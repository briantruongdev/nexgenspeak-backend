const jwt = require("jsonwebtoken");
const { createCorsResponse } = require("./cors");

/**
 * Extracts and verifies JWT token from Authorization header
 * @param {Object} event - Lambda event
 * @returns {{ decoded: Object|null, error: Object|null }}
 */
const extractAndVerifyToken = (event) => {
  const authHeader =
    event.headers?.Authorization || event.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      decoded: null,
      error: createCorsResponse(401, {
        message: "Unauthorized: No token provided",
      }),
    };
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { decoded, error: null };
  } catch (err) {
    return {
      decoded: null,
      error: createCorsResponse(401, {
        message: "Unauthorized: Invalid or expired token",
      }),
    };
  }
};

/**
 * Middleware to verify user has admin role
 * @param {Object} event - Lambda event
 * @returns {{ decoded: Object|null, error: Object|null }}
 */
const requireAdmin = (event) => {
  const { decoded, error } = extractAndVerifyToken(event);
  if (error) return { decoded: null, error };

  if (decoded.role !== "admin") {
    return {
      decoded: null,
      error: createCorsResponse(403, {
        message: "Forbidden: Admin access required",
      }),
    };
  }

  return { decoded, error: null };
};

/**
 * Middleware to verify user has teacher role
 * @param {Object} event - Lambda event
 * @returns {{ decoded: Object|null, error: Object|null }}
 */
const requireTeacher = (event) => {
  const { decoded, error } = extractAndVerifyToken(event);
  if (error) return { decoded: null, error };

  if (decoded.role !== "teacher") {
    return {
      decoded: null,
      error: createCorsResponse(403, {
        message: "Forbidden: Teacher access required",
      }),
    };
  }

  return { decoded, error: null };
};

/**
 * Middleware to verify user has admin or teacher role (CMS access)
 * @param {Object} event - Lambda event
 * @returns {{ decoded: Object|null, error: Object|null }}
 */
const requireCmsAccess = (event) => {
  const { decoded, error } = extractAndVerifyToken(event);
  if (error) return { decoded: null, error };

  if (!["admin", "teacher"].includes(decoded.role)) {
    return {
      decoded: null,
      error: createCorsResponse(403, {
        message: "Forbidden: CMS access required",
      }),
    };
  }

  return { decoded, error: null };
};

module.exports = {
  extractAndVerifyToken,
  requireAdmin,
  requireTeacher,
  requireCmsAccess,
};
