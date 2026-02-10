const {
  getFavoriteTeachers,
} = require("/opt/nodejs/db/repository/user-repository");
const {
  getTeacherById,
} = require("/opt/nodejs/db/repository/teacher-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");
const jwt = require("jsonwebtoken");

exports.lambdaHandler = async (event) => {
  console.log("Event:", JSON.stringify(event, null, 2));

  try {
    const authHeader =
      event.headers?.Authorization || event.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return createCorsResponse(401, {
        success: false,
        message: "Missing or invalid authorization header",
      });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return createCorsResponse(401, {
        success: false,
        message: "Invalid or expired token",
      });
    }

    const userId = decoded.sub;

    const favoriteTeacherIds = await getFavoriteTeachers(userId);

    const teachers = [];
    for (const teacherId of favoriteTeacherIds) {
      const teacher = await getTeacherById(teacherId);
      if (teacher) {
        teachers.push(teacher);
      }
    }

    return createCorsResponse(200, {
      success: true,
      data: {
        teachers,
        count: teachers.length,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return createCorsResponse(500, {
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
