const {
  getRegistrationsByUserId,
} = require("/opt/nodejs/db/repository/registration-repository");
const {
  getTeacherById,
} = require("/opt/nodejs/db/repository/teacher-repository");
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

    // Get all registrations for this user
    const registrations = await getRegistrationsByUserId(userId);

    // Group registrations by date and expand slots with teacher info
    const registrationsByDate = {};

    for (const reg of registrations) {
      const teacher = await getTeacherById(reg.teacherId);
      const slots = TIME_SLOTS.filter(
        (slot) => reg.slotIds && reg.slotIds.includes(slot.id),
      );

      if (!registrationsByDate[reg.date]) {
        registrationsByDate[reg.date] = {
          date: reg.date,
          slots: [],
        };
      }

      // Add each slot with its teacher info
      slots.forEach((slot) => {
        registrationsByDate[reg.date].slots.push({
          ...slot,
          teacher: teacher
            ? {
                teacherId: teacher.teacherId,
                fullName: teacher.fullName,
                position: teacher.position,
              }
            : null,
          registrationId: reg.registrationId,
          createdAt: reg.createdAt,
        });
      });
    }

    // Convert to array and sort
    const enrichedRegistrations = Object.values(registrationsByDate)
      .map((dateGroup) => {
        // Sort slots by start time
        dateGroup.slots.sort((a, b) => {
          const timeA = a.startTime.split(":").map(Number);
          const timeB = b.startTime.split(":").map(Number);
          return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
        });
        return dateGroup;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return createCorsResponse(200, {
      registrations: enrichedRegistrations,
      total: enrichedRegistrations.length,
    });
  } catch (err) {
    console.error("Get registrations error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
