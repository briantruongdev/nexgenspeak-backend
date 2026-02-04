const {
  getTeacherById,
} = require("/opt/nodejs/db/repository/teacher-repository");
const {
  getRegistrationsByTeacherAndDate,
} = require("/opt/nodejs/db/repository/registration-repository");
const { TIME_SLOTS } = require("/opt/nodejs/common/constants");
const { createCorsResponse } = require("/opt/nodejs/common/cors");

exports.lambdaHandler = async (event) => {
  try {
    const teacherId = event.pathParameters?.teacherId;
    const date = event.queryStringParameters?.date;

    // Validate teacherId
    if (!teacherId) {
      return createCorsResponse(400, { message: "Teacher ID is required" });
    }

    // Validate date format (YYYY-MM-DD)
    if (!date) {
      return createCorsResponse(400, { message: "Date is required" });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return createCorsResponse(400, {
        message: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    // Check if teacher exists
    const teacher = await getTeacherById(teacherId);
    if (!teacher) {
      return createCorsResponse(404, { message: "Teacher not found" });
    }

    // Get all registrations for this teacher on this date
    const registrations = await getRegistrationsByTeacherAndDate(
      teacherId,
      date,
    );

    // Collect all booked slot IDs
    const bookedSlotIds = new Set();
    registrations.forEach((reg) => {
      if (reg.slotIds && Array.isArray(reg.slotIds)) {
        reg.slotIds.forEach((slotId) => bookedSlotIds.add(slotId));
      }
    });

    // Mark slots as available or booked
    const slotsWithAvailability = TIME_SLOTS.map((slot) => ({
      ...slot,
      isAvailable: !bookedSlotIds.has(slot.id),
    }));

    return createCorsResponse(200, {
      teacherId,
      teacherName: teacher.fullName,
      date,
      slots: slotsWithAvailability,
    });
  } catch (err) {
    console.error("Get available slots error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
