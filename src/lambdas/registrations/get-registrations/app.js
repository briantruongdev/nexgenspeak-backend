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

    // Enrich registrations with teacher and slot details
    const enrichedRegistrations = await Promise.all(
      registrations.map(async (reg) => {
        const teacher = await getTeacherById(reg.teacherId);
        const slots = TIME_SLOTS.filter(
          (slot) => reg.slotIds && reg.slotIds.includes(slot.id),
        );

        return {
          registrationId: reg.registrationId,
          date: reg.date,
          teacher: teacher
            ? {
                teacherId: teacher.teacherId,
                fullName: teacher.fullName,
                position: teacher.position,
              }
            : null,
          slots,
          createdAt: reg.createdAt,
        };
      }),
    );

    // Sort by date (most recent first)
    enrichedRegistrations.sort((a, b) => new Date(b.date) - new Date(a.date));

    return createCorsResponse(200, {
      registrations: enrichedRegistrations,
      total: enrichedRegistrations.length,
    });
  } catch (err) {
    console.error("Get registrations error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
