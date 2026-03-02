const { parseEventBody } = require("/opt/nodejs/common/utils");
const { requireAdmin } = require("/opt/nodejs/common/auth-middleware");
const {
  getUserById,
  updateUserSettings,
} = require("/opt/nodejs/db/repository/user-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");

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

    // Parse request body
    const { maxSlotsPerDay, expirationDate } = event.body
      ? parseEventBody(event)
      : event;

    // Validate maxSlotsPerDay
    if (maxSlotsPerDay !== undefined) {
      if (
        !Number.isInteger(maxSlotsPerDay) ||
        maxSlotsPerDay < 1 ||
        maxSlotsPerDay > 26
      ) {
        return createCorsResponse(400, {
          message: "maxSlotsPerDay must be an integer between 1 and 26",
        });
      }
    }

    // Validate expirationDate format
    if (expirationDate !== undefined && expirationDate !== null) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(expirationDate)) {
        return createCorsResponse(400, {
          message: "expirationDate must be in YYYY-MM-DD format",
        });
      }

      // Check that expiration date is in the future
      const expDate = new Date(expirationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expDate < today) {
        return createCorsResponse(400, {
          message: "expirationDate must be in the future",
        });
      }
    }

    if (maxSlotsPerDay === undefined && expirationDate === undefined) {
      return createCorsResponse(400, {
        message:
          "At least one setting (maxSlotsPerDay or expirationDate) is required",
      });
    }

    // Update settings
    const result = await updateUserSettings(studentId, {
      maxSlotsPerDay,
      expirationDate,
    });

    return createCorsResponse(200, {
      message: "Student settings updated successfully",
      student: {
        userId: studentId,
        email: student.email,
        maxSlotsPerDay:
          maxSlotsPerDay !== undefined
            ? maxSlotsPerDay
            : student.slotAvailablePerDay,
        expirationDate:
          expirationDate !== undefined
            ? expirationDate
            : student.expirationDate,
      },
    });
  } catch (err) {
    console.error("Update student settings error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
