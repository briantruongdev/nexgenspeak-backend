const { requireAdmin } = require("/opt/nodejs/common/auth-middleware");
const { getAllStudents } = require("/opt/nodejs/db/repository/user-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");

exports.lambdaHandler = async (event) => {
  try {
    // Verify admin role
    const { decoded, error } = requireAdmin(event);
    if (error) return error;

    // Get all students
    const students = await getAllStudents();

    // Remove sensitive data (password)
    const sanitizedStudents = students.map((student) => ({
      userId: student.userId,
      email: student.email,
      phone: student.phone,
      fullName: student.fullName || null,
      slotAvailablePerDay: student.slotAvailablePerDay || 3,
      expirationDate: student.expirationDate || null,
      createdAt: student.createdAt,
    }));

    return createCorsResponse(200, {
      students: sanitizedStudents,
      total: sanitizedStudents.length,
    });
  } catch (err) {
    console.error("Get all students error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
