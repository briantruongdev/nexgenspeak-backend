const {
  addFavoriteTeacher,
  removeFavoriteTeacher,
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

    const body = JSON.parse(event.body || "{}");
    const { teacherId, action } = body;

    if (!teacherId) {
      return createCorsResponse(400, {
        success: false,
        message: "teacherId is required",
      });
    }

    if (!action || !["add", "remove"].includes(action)) {
      return createCorsResponse(400, {
        success: false,
        message: "action must be 'add' or 'remove'",
      });
    }

    const teacher = await getTeacherById(teacherId);
    if (!teacher) {
      return createCorsResponse(404, {
        success: false,
        message: "Teacher not found",
      });
    }

    if (action === "add") {
      await addFavoriteTeacher(userId, teacherId);
    } else {
      await removeFavoriteTeacher(userId, teacherId);
    }

    const favoriteTeachers = await getFavoriteTeachers(userId);

    return createCorsResponse(200, {
      success: true,
      message: `Teacher ${action === "add" ? "added to" : "removed from"} favorites`,
      data: {
        favoriteTeachers: Array.from(favoriteTeachers),
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
