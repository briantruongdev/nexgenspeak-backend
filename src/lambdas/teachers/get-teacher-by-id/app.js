const {
  getTeacherById,
} = require("/opt/nodejs/db/repository/teacher-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");

exports.lambdaHandler = async (event) => {
  try {
    // Get teacherId from path parameters
    const teacherId = event.pathParameters?.teacherId;

    if (!teacherId) {
      return createCorsResponse(400, {
        message: "Teacher ID is required",
      });
    }

    // Get teacher from database
    const teacher = await getTeacherById(teacherId);

    if (!teacher) {
      return createCorsResponse(404, {
        message: "Teacher not found",
      });
    }

    return createCorsResponse(200, {
      teacher,
    });
  } catch (err) {
    console.error("Get teacher by ID error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
