const { requireAdmin } = require("/opt/nodejs/common/auth-middleware");
const {
  getTeacherById,
} = require("/opt/nodejs/db/repository/teacher-repository");
const {
  getRegistrationsByTeacherId,
} = require("/opt/nodejs/db/repository/registration-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");
const { TIME_SLOTS } = require("/opt/nodejs/common/constants");

exports.lambdaHandler = async (event) => {
  try {
    // Verify admin role
    const { decoded, error } = requireAdmin(event);
    if (error) return error;

    const teacherId = event.pathParameters?.teacherId;
    if (!teacherId) {
      return createCorsResponse(400, { message: "Teacher ID is required" });
    }

    // Check if teacher exists
    const teacher = await getTeacherById(teacherId);
    if (!teacher) {
      return createCorsResponse(404, { message: "Teacher not found" });
    }

    // Get all registrations for this teacher
    const registrations = await getRegistrationsByTeacherId(teacherId);

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Categorize slots
    const completedSlots = []; // Past - đã dạy
    const upcomingSlots = []; // Future - chuẩn bị dạy
    const todaySlots = []; // Today

    registrations.forEach((reg) => {
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

        if (reg.date < today) {
          completedSlots.push({ ...slotInfo, status: "completed" });
        } else if (reg.date > today) {
          upcomingSlots.push({ ...slotInfo, status: "upcoming" });
        } else {
          // Today - check time
          const now = new Date();
          const [hours, minutes] = slot.endTime.split(":").map(Number);
          const slotEndTime = new Date();
          slotEndTime.setHours(hours, minutes, 0, 0);

          if (now > slotEndTime) {
            completedSlots.push({ ...slotInfo, status: "completed" });
          } else {
            todaySlots.push({ ...slotInfo, status: "in-progress" });
          }
        }
      });
    });

    // Sort by date and time
    const sortByDateTime = (a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    };

    completedSlots.sort(sortByDateTime);
    upcomingSlots.sort(sortByDateTime);
    todaySlots.sort(sortByDateTime);

    // Calculate summary
    const totalCompletedHours = completedSlots.length * 0.5; // Each slot is 30 minutes
    const totalUpcomingHours = upcomingSlots.length * 0.5;
    const totalTodayHours = todaySlots.length * 0.5;

    return createCorsResponse(200, {
      teacher: {
        teacherId: teacher.teacherId,
        fullName: teacher.fullName,
        position: teacher.position,
      },
      schedule: {
        completed: completedSlots,
        upcoming: upcomingSlots,
        today: todaySlots,
      },
      summary: {
        totalCompletedSlots: completedSlots.length,
        totalUpcomingSlots: upcomingSlots.length,
        totalTodaySlots: todaySlots.length,
        totalCompletedHours,
        totalUpcomingHours,
        totalTodayHours,
      },
    });
  } catch (err) {
    console.error("Get teacher schedule error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
