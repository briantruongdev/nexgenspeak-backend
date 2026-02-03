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

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return createCorsResponse(401, {
        message: "Invalid credentials",
      });
    }

    // Generate JWT token (expires in 7 days)
    const token = await generateToken(
      { sub: user.userId, email: user.email },
      "7d",
    );

    return createCorsResponse(200, {
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
