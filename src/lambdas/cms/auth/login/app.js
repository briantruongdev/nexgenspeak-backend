const bcrypt = require("bcryptjs");
const { parseEventBody } = require("/opt/nodejs/common/utils");
const { generateToken } = require("/opt/nodejs/common/jwt-service");
const { getUserByEmail } = require("/opt/nodejs/db/repository/user-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");

exports.lambdaHandler = async (event) => {
  try {
    const { email, password } = event.body ? parseEventBody(event) : event;

    // Validate input
    if (!email || !password) {
      return createCorsResponse(400, { message: "Missing credentials" });
    }

    // Get user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return createCorsResponse(401, { message: "Invalid credentials" });
    }

    // Check that user has CMS access (admin or teacher role)
    if (!user.role || !["admin", "teacher"].includes(user.role)) {
      return createCorsResponse(403, {
        message: "Access denied: You do not have CMS access",
      });
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return createCorsResponse(401, {
        message: "Invalid credentials",
      });
    }

    // Generate JWT token with role info (expires in 7 days)
    const token = await generateToken(
      {
        sub: user.userId,
        email: user.email,
        role: user.role,
        teacherId: user.teacherId || null,
      },
      "7d",
    );

    return createCorsResponse(200, {
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        teacherId: user.teacherId || null,
      },
    });
  } catch (err) {
    console.error("CMS Login error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
