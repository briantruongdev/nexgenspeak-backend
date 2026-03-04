const { requireAdmin } = require("/opt/nodejs/common/auth-middleware");
const { getUserById } = require("/opt/nodejs/db/repository/user-repository");
const {
  getRegistrationsByUserId,
} = require("/opt/nodejs/db/repository/registration-repository");
const {
  getTeacherById,
} = require("/opt/nodejs/db/repository/teacher-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");
const { TIME_SLOTS } = require("/opt/nodejs/common/constants");

exports.lambdaHandler = async (event) => {
  try {
    // Verify admin role
    const { decoded, error } = requireAdmin(event);
    if (error) return error;

    const studentId = event.pathParameters?.studentId;
    if (!studentId) {
      return createCorsResponse(400, { message: "Student ID is required" });
    }

    // Check if student exists
    const student = await getUserById(studentId);
    if (!student) {
      return createCorsResponse(404, { message: "Student not found" });
    }

    // Get all registrations for this student
    const registrations = await getRegistrationsByUserId(studentId);

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Categorize slots
    const completedSlots = []; // Past - đã học
    const upcomingSlots = []; // Future - chuẩn bị học
    const todaySlots = []; // Today

    for (const reg of registrations) {
      const teacher = await getTeacherById(reg.teacherId);
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
          teacherId: reg.teacherId,
          teacherName: teacher ? teacher.fullName : "Unknown",
          teacherPosition: teacher ? teacher.position : null,
        };

        if (reg.date < today) {
          completedSlots.push({ ...slotInfo, status: "completed" });
        } else if (reg.date > today) {
          upcomingSlots.push({ ...slotInfo, status: "upcoming" });
        } else {
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
    }

    // Sort by date and time
    const sortByDateTime = (a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    };

    completedSlots.sort(sortByDateTime);
    upcomingSlots.sort(sortByDateTime);
    todaySlots.sort(sortByDateTime);

    // Calculate summary
    const totalCompletedHours = completedSlots.length * 0.5;
    const totalUpcomingHours = upcomingSlots.length * 0.5;
    const totalTodayHours = todaySlots.length * 0.5;

    return createCorsResponse(200, {
      student: {
        userId: student.userId,
        email: student.email,
        phone: student.phone,
        slotAvailablePerDay: student.slotAvailablePerDay || 3,
        expirationDate: student.expirationDate || null,
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
    console.error("Get student schedule error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
