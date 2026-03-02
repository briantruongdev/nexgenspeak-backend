const { requireTeacher } = require("/opt/nodejs/common/auth-middleware");
const {
  getRegistrationsByTeacherId,
} = require("/opt/nodejs/db/repository/registration-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");
const { TIME_SLOTS } = require("/opt/nodejs/common/constants");

exports.lambdaHandler = async (event) => {
  try {
    // Verify teacher role
    const { decoded, error } = requireTeacher(event);
    if (error) return error;

    const teacherId = decoded.teacherId;
    if (!teacherId) {
      return createCorsResponse(400, {
        message: "Teacher profile not linked to account",
      });
    }

    // Get optional date range filters
    const startDate = event.queryStringParameters?.startDate;
    const endDate = event.queryStringParameters?.endDate;

    // Get all registrations for this teacher
    let registrations = await getRegistrationsByTeacherId(teacherId);

    // Apply date filters if provided
    if (startDate) {
      registrations = registrations.filter((r) => r.date >= startDate);
    }
    if (endDate) {
      registrations = registrations.filter((r) => r.date <= endDate);
    }

    const today = new Date().toISOString().split("T")[0];

    // Categorize slots
    const completedSlots = []; // Đã dạy
    const availableSlots = []; // Slot trống (today + future)
    const upcomingSlots = []; // Chuẩn bị dạy (in-commit)

    // Get booked slots per date
    const bookedSlotsByDate = {};
    registrations.forEach((reg) => {
      if (!bookedSlotsByDate[reg.date]) {
        bookedSlotsByDate[reg.date] = [];
      }

      const slotDetails = TIME_SLOTS.filter(
        (slot) => reg.slotIds && reg.slotIds.includes(slot.id),
      );

      slotDetails.forEach((slot) => {
        const slotInfo = {
          registrationId: reg.registrationId,
          date: reg.date,
          slotId: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          studentId: reg.userId,
          studentEmail: reg.email,
          studentPhone: reg.phone,
        };

        bookedSlotsByDate[reg.date].push(slot.id);

        if (reg.date < today) {
          completedSlots.push({ ...slotInfo, status: "completed" });
        } else if (reg.date > today) {
          upcomingSlots.push({ ...slotInfo, status: "upcoming" });
        } else {
          // Today - check current time
          const now = new Date();
          const [hours, minutes] = slot.endTime.split(":").map(Number);
          const slotEndTime = new Date();
          slotEndTime.setHours(hours, minutes, 0, 0);

          if (now > slotEndTime) {
            completedSlots.push({ ...slotInfo, status: "completed" });
          } else {
            upcomingSlots.push({ ...slotInfo, status: "in-progress" });
          }
        }
      });
    });

    // Calculate available slots for today
    const todayBookedSlots = bookedSlotsByDate[today] || [];
    TIME_SLOTS.forEach((slot) => {
      if (!todayBookedSlots.includes(slot.id)) {
        // Only show future available slots for today
        const now = new Date();
        const [hours, minutes] = slot.startTime.split(":").map(Number);
        const slotStartTime = new Date();
        slotStartTime.setHours(hours, minutes, 0, 0);

        if (now < slotStartTime) {
          availableSlots.push({
            date: today,
            slotId: slot.id,
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: "available",
          });
        }
      }
    });

    // Sort
    const sortByDateTime = (a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    };

    completedSlots.sort(sortByDateTime);
    upcomingSlots.sort(sortByDateTime);
    availableSlots.sort(sortByDateTime);

    return createCorsResponse(200, {
      teacherId,
      schedule: {
        completed: completedSlots,
        available: availableSlots,
        upcoming: upcomingSlots,
      },
      summary: {
        totalCompletedSlots: completedSlots.length,
        totalUpcomingSlots: upcomingSlots.length,
        totalAvailableSlots: availableSlots.length,
        totalCompletedHours: completedSlots.length * 0.5,
        totalUpcomingHours: upcomingSlots.length * 0.5,
      },
    });
  } catch (err) {
    console.error("Get my schedule error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
