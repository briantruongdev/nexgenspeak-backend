const {
  getAllTeachers,
} = require("/opt/nodejs/db/repository/teacher-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");

exports.lambdaHandler = async (event) => {
  try {
    const teachers = await getAllTeachers();

    return createCorsResponse(200, {
      teachers,
      total: teachers.length,
    });
  } catch (err) {
    console.error("Get teachers error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
