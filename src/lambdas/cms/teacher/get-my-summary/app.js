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

    // Get all registrations for this teacher
    const registrations = await getRegistrationsByTeacherId(teacherId);

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    let totalCompletedSlots = 0;
    let totalUpcomingSlots = 0;
    let totalTodaySlots = 0;
    const uniqueStudents = new Set();
    const teachingDays = new Set();

    // Breakdown per month
    const monthlyBreakdown = {};

    registrations.forEach((reg) => {
      const slotCount = reg.slotIds ? reg.slotIds.length : 0;
      uniqueStudents.add(reg.userId);
      teachingDays.add(reg.date);

      // Monthly breakdown key: YYYY-MM
      const monthKey = reg.date.substring(0, 7);
      if (!monthlyBreakdown[monthKey]) {
        monthlyBreakdown[monthKey] = {
          month: monthKey,
          completedSlots: 0,
          upcomingSlots: 0,
          completedHours: 0,
          upcomingHours: 0,
        };
      }

      if (reg.date < today) {
        totalCompletedSlots += slotCount;
        monthlyBreakdown[monthKey].completedSlots += slotCount;
        monthlyBreakdown[monthKey].completedHours += slotCount * 0.5;
      } else if (reg.date > today) {
        totalUpcomingSlots += slotCount;
        monthlyBreakdown[monthKey].upcomingSlots += slotCount;
        monthlyBreakdown[monthKey].upcomingHours += slotCount * 0.5;
      } else {
        // Today - split by current time
        if (reg.slotIds && Array.isArray(reg.slotIds)) {
          reg.slotIds.forEach((slotId) => {
            const slot = TIME_SLOTS.find((s) => s.id === slotId);
            if (slot) {
              const now = new Date();
              const [hours, minutes] = slot.endTime.split(":").map(Number);
              const slotEndTime = new Date();
              slotEndTime.setHours(hours, minutes, 0, 0);

              if (now > slotEndTime) {
                totalCompletedSlots++;
                monthlyBreakdown[monthKey].completedSlots++;
                monthlyBreakdown[monthKey].completedHours += 0.5;
              } else {
                totalTodaySlots++;
                totalUpcomingSlots++;
                monthlyBreakdown[monthKey].upcomingSlots++;
                monthlyBreakdown[monthKey].upcomingHours += 0.5;
              }
            }
          });
        }
      }
    });

    // Sort monthly breakdown
    const sortedMonthlyBreakdown = Object.values(monthlyBreakdown).sort(
      (a, b) => b.month.localeCompare(a.month),
    );

    return createCorsResponse(200, {
      teacherId,
      summary: {
        totalCompletedSlots,
        totalUpcomingSlots,
        totalTodaySlots,
        totalCompletedHours: totalCompletedSlots * 0.5,
        totalUpcomingHours: totalUpcomingSlots * 0.5,
        totalUniqueStudents: uniqueStudents.size,
        totalTeachingDays: teachingDays.size,
      },
      monthlyBreakdown: sortedMonthlyBreakdown,
    });
  } catch (err) {
    console.error("Get my summary error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
