const { parseEventBody } = require("/opt/nodejs/common/utils");
const {
  getTeacherById,
} = require("/opt/nodejs/db/repository/teacher-repository");
const {
  getRegistrationByUserAndDate,
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

    const userId = decoded.userId;

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

    // Check if user already has a registration for this date
    const existingUserRegistration = await getRegistrationByUserAndDate(
      userId,
      date,
    );

    if (existingUserRegistration) {
      // Check if adding new slots would exceed the limit
      const currentSlots = existingUserRegistration.slotIds || [];
      const newUniqueSlots = [...new Set([...currentSlots, ...slotIds])];

      if (newUniqueSlots.length > slotAvailablePerDay) {
        return createCorsResponse(400, {
          message: `Cannot register. You can only book ${slotAvailablePerDay} slots per day. Currently booked: ${currentSlots.length}`,
        });
      }

      // Update existing registration
      await updateRegistrationSlots(
        existingUserRegistration.registrationId,
        newUniqueSlots,
      );

      return createCorsResponse(200, {
        message: "Registration updated successfully",
        registration: {
          ...existingUserRegistration,
          slotIds: newUniqueSlots,
        },
      });
    }

    // Check if user is trying to book more slots than allowed
    if (slotIds.length > slotAvailablePerDay) {
      return createCorsResponse(400, {
        message: `Cannot register. You can only book ${slotAvailablePerDay} slots per day`,
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

    // Create new registration
    const registration = await createRegistration({
      userId,
      teacherId,
      slotIds,
      date,
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
