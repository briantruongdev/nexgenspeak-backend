const { requireAdmin } = require("/opt/nodejs/common/auth-middleware");
const {
  getAllTeachers,
} = require("/opt/nodejs/db/repository/teacher-repository");
const {
  getAllTeacherUsers,
} = require("/opt/nodejs/db/repository/user-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");

exports.lambdaHandler = async (event) => {
  try {
    // Verify admin role
    const { decoded, error } = requireAdmin(event);
    if (error) return error;

    // Get all teacher profiles
    const teachers = await getAllTeachers();

    // Get all teacher user accounts
    const teacherUsers = await getAllTeacherUsers();

    // Merge teacher profile with user account info
    const teachersWithAccounts = teachers.map((teacher) => {
      const userAccount = teacherUsers.find(
        (u) => u.teacherId === teacher.teacherId,
      );
      return {
        ...teacher,
        account: userAccount
          ? {
              userId: userAccount.userId,
              email: userAccount.email,
              fullName: userAccount.fullName,
              createdAt: userAccount.createdAt,
            }
          : null,
        hasAccount: !!userAccount,
      };
    });

    return createCorsResponse(200, {
      teachers: teachersWithAccounts,
      total: teachersWithAccounts.length,
    });
  } catch (err) {
    console.error("Get all teachers error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
