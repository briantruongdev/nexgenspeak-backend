const { parseEventBody } = require("/opt/nodejs/common/utils");
const {
  getTeacherById,
} = require("/opt/nodejs/db/repository/teacher-repository");
const {
  getRegistrationByUserAndDate,
  getRegistrationByUserTeacherAndDate,
  getRegistrationsByTeacherAndDate,
  createRegistration,
  updateRegistrationSlots,
} = require("/opt/nodejs/db/repository/registration-repository");
const { getUserByEmail } = require("/opt/nodejs/db/repository/user-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");
const { TIME_SLOTS } = require("/opt/nodejs/common/constants");
const jwt = require("jsonwebtoken");

exports.lambdaHandler = async (event) => {
  try {
    // Extract and verify JWT token
    const authHeader =
      event.headers?.Authorization || event.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return createCorsResponse(401, {
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return createCorsResponse(401, {
        message: "Unauthorized: Invalid token",
      });
    }

    const userId = decoded.sub; // JWT token uses 'sub' field for userId

    // Parse request body
    const { teacherId, slotIds, date } = event.body
      ? parseEventBody(event)
      : event;

    // Validate required fields
    if (!teacherId) {
      return createCorsResponse(400, { message: "Teacher ID is required" });
    }

    if (!slotIds || !Array.isArray(slotIds) || slotIds.length === 0) {
      return createCorsResponse(400, {
        message: "Slot IDs are required and must be a non-empty array",
      });
    }

    if (!date) {
      return createCorsResponse(400, { message: "Date is required" });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return createCorsResponse(400, {
        message: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    // Validate slot IDs
    const validSlotIds = TIME_SLOTS.map((s) => s.id);
    const invalidSlots = slotIds.filter((id) => !validSlotIds.includes(id));
    if (invalidSlots.length > 0) {
      return createCorsResponse(400, {
        message: `Invalid slot IDs: ${invalidSlots.join(", ")}`,
      });
    }

    // Check if teacher exists
    const teacher = await getTeacherById(teacherId);
    if (!teacher) {
      return createCorsResponse(404, { message: "Teacher not found" });
    }

    // Get user info to check slotAvailablePerDay
    const user = await getUserByEmail(decoded.email);
    if (!user) {
      return createCorsResponse(404, { message: "User not found" });
    }

    const slotAvailablePerDay = user.slotAvailablePerDay || 3;

    // Get all user's registrations for this date (across all teachers)
    const allUserRegistrationsForDate = await getRegistrationByUserAndDate(
      userId,
      date,
    );

    // Calculate total slots already booked for this date (from all teachers)
    let totalSlotsBookedForDate = 0;
    const allBookedSlotIds = new Set();

    if (allUserRegistrationsForDate) {
      // getRegistrationByUserAndDate returns single item, but we need to get all
      // Let's use a different approach - scan all registrations for this user on this date
      const db = require("/opt/nodejs/db/dynamo-client").getDynamoClient();
      const allRegsResult = await db
        .query({
          TableName: process.env.REGISTRATIONS_TABLE,
          IndexName: "userDateIndex",
          KeyConditionExpression: "userId = :userId AND #date = :date",
          ExpressionAttributeNames: {
            "#date": "date",
          },
          ExpressionAttributeValues: {
            ":userId": userId,
            ":date": date,
          },
        })
        .promise();

      const allRegistrations = allRegsResult.Items || [];
      allRegistrations.forEach((reg) => {
        if (reg.slotIds && Array.isArray(reg.slotIds)) {
          reg.slotIds.forEach((slotId) => allBookedSlotIds.add(slotId));
        }
      });
      totalSlotsBookedForDate = allBookedSlotIds.size;
    }

    // Check if user already has a registration with THIS teacher for this date
    const existingTeacherRegistration =
      await getRegistrationByUserTeacherAndDate(userId, teacherId, date);

    if (existingTeacherRegistration) {
      // User is adding more slots with the SAME teacher
      const currentSlots = existingTeacherRegistration.slotIds || [];
      const newUniqueSlots = [...new Set([...currentSlots, ...slotIds])];

      // Check if the new slots are already booked with this teacher
      const duplicateSlots = slotIds.filter((id) => currentSlots.includes(id));
      if (duplicateSlots.length > 0) {
        const duplicateSlotDetails = TIME_SLOTS.filter((s) =>
          duplicateSlots.includes(s.id),
        )
          .map((s) => `${s.startTime}-${s.endTime}`)
          .join(", ");
        return createCorsResponse(400, {
          message: `You have already registered for the following slots with this teacher: ${duplicateSlotDetails}`,
          duplicateSlots,
        });
      }

      // Calculate how many NEW slots are being added
      const newSlotsCount = newUniqueSlots.length - currentSlots.length;
      const totalSlotsAfterUpdate = totalSlotsBookedForDate + newSlotsCount;

      // Check if adding new slots would exceed the daily limit
      if (totalSlotsAfterUpdate > slotAvailablePerDay) {
        return createCorsResponse(400, {
          message: `Cannot register. You can only book ${slotAvailablePerDay} slots per day. Currently booked: ${totalSlotsBookedForDate}. Trying to add: ${newSlotsCount}`,
        });
      }

      // Update existing registration with this teacher
      await updateRegistrationSlots(
        existingTeacherRegistration.registrationId,
        newUniqueSlots,
      );

      return createCorsResponse(200, {
        message: "Registration updated successfully",
        registration: {
          ...existingTeacherRegistration,
          slotIds: newUniqueSlots,
        },
      });
    }

    // User is creating a NEW registration with a DIFFERENT teacher
    // Check if any of the requested slots are already booked (with any teacher)
    const conflictingUserSlots = slotIds.filter((id) =>
      allBookedSlotIds.has(id),
    );
    if (conflictingUserSlots.length > 0) {
      const conflictingSlotDetails = TIME_SLOTS.filter((s) =>
        conflictingUserSlots.includes(s.id),
      )
        .map((s) => `${s.startTime}-${s.endTime}`)
        .join(", ");
      return createCorsResponse(400, {
        message: `You have already registered for the following slots: ${conflictingSlotDetails}`,
        conflictingSlots: conflictingUserSlots,
      });
    }

    // Check if adding these slots would exceed the daily limit
    const totalSlotsAfterNew = totalSlotsBookedForDate + slotIds.length;
    if (totalSlotsAfterNew > slotAvailablePerDay) {
      return createCorsResponse(400, {
        message: `Cannot register. You can only book ${slotAvailablePerDay} slots per day. Currently booked: ${totalSlotsBookedForDate}. Trying to add: ${slotIds.length}`,
      });
    }

    // Check if the requested slots are available for this teacher
    const teacherRegistrations = await getRegistrationsByTeacherAndDate(
      teacherId,
      date,
    );
    const bookedSlotIds = new Set();
    teacherRegistrations.forEach((reg) => {
      if (reg.slotIds && Array.isArray(reg.slotIds)) {
        reg.slotIds.forEach((slotId) => bookedSlotIds.add(slotId));
      }
    });

    const conflictingSlots = slotIds.filter((id) => bookedSlotIds.has(id));
    if (conflictingSlots.length > 0) {
      const conflictingSlotDetails = TIME_SLOTS.filter((s) =>
        conflictingSlots.includes(s.id),
      )
        .map((s) => `${s.startTime}-${s.endTime}`)
        .join(", ");

      return createCorsResponse(409, {
        message: `The following slots are already booked: ${conflictingSlotDetails}`,
        conflictingSlots,
      });
    }

    const registration = await createRegistration({
      userId,
      teacherId,
      slotIds,
      date,
      phone: user.phone,
      email: decoded.email,
    });

    return createCorsResponse(201, {
      message: "Registration successful",
      registration,
    });
  } catch (err) {
    console.error("Create registration error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
