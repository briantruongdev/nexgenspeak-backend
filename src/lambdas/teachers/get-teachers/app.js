const {
  getAllTeachers,
} = require("/opt/nodejs/db/repository/teacher-repository");
const {
  getFavoriteTeachers,
} = require("/opt/nodejs/db/repository/user-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");
const jwt = require("jsonwebtoken");

exports.lambdaHandler = async (event) => {
  try {
    const teachers = await getAllTeachers();

    let favoriteTeacherIds = [];
    let userId = null;

    const authHeader =
      event.headers?.Authorization || event.headers?.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.sub;

        const favorites = await getFavoriteTeachers(userId);
        favoriteTeacherIds = Array.from(favorites);
      } catch (err) {
        console.log(
          "Invalid token, continuing without favorites:",
          err.message,
        );
      }
    }

    const teachersWithFavorites = teachers.map((teacher) => ({
      ...teacher,
      isFavorite: favoriteTeacherIds.includes(teacher.teacherId),
    }));

    teachersWithFavorites.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });

    return createCorsResponse(200, {
      teachers: teachersWithFavorites,
      total: teachersWithFavorites.length,
      favoriteCount: favoriteTeacherIds.length,
    });
  } catch (err) {
    console.error("Get teachers error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
