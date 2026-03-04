const { parseEventBody } = require("/opt/nodejs/common/utils");
const { requireAdmin } = require("/opt/nodejs/common/auth-middleware");
const {
  getUserByEmail,
  createTeacherUser,
} = require("/opt/nodejs/db/repository/user-repository");
const {
  createTeacher,
} = require("/opt/nodejs/db/repository/teacher-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");

exports.lambdaHandler = async (event) => {
  try {
    // Verify admin role
    const { decoded, error } = requireAdmin(event);
    if (error) return error;

    // Parse request body
    const { email, password, fullName, position, award1, award2, award3 } =
      event.body ? parseEventBody(event) : event;

    // Validate required fields
    if (!email || !email.trim()) {
      return createCorsResponse(400, { message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createCorsResponse(400, { message: "Invalid email format" });
    }

    if (!password || password.length < 6) {
      return createCorsResponse(400, {
        message: "Password is required and must be at least 6 characters",
      });
    }

    if (!fullName || !fullName.trim()) {
      return createCorsResponse(400, { message: "Full name is required" });
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return createCorsResponse(409, {
        message: "Email already registered",
      });
    }

    // Step 1: Create teacher profile in TeachersTable
    const teacher = await createTeacher({
      fullName,
      position: position || "Teacher",
      award1: award1 || null,
      award2: award2 || null,
      award3: award3 || null,
    });

    // Step 2: Create user account with teacher role linked to the teacher profile
    const user = await createTeacherUser({
      email,
      password,
      fullName,
      teacherId: teacher.teacherId,
    });

    return createCorsResponse(201, {
      message: "Teacher account created successfully",
      user: {
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      teacher: {
        teacherId: teacher.teacherId,
        fullName: teacher.fullName,
        position: teacher.position,
      },
    });
  } catch (err) {
    console.error("Create teacher account error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
