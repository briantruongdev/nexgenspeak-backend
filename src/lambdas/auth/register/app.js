const { parseEventBody } = require("/opt/nodejs/common/utils");
const {
  createUser,
  getUserByEmail,
} = require("/opt/nodejs/db/repository/user-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");

exports.lambdaHandler = async (event) => {
  try {
    const { email, password, phone } = event.body
      ? parseEventBody(event)
      : event;

    // Validate email
    if (!email || !email.trim()) {
      return createCorsResponse(400, { message: "Email is required" });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createCorsResponse(400, { message: "Invalid email format" });
    }

    // Validate password
    if (!password || password.length < 6) {
      return createCorsResponse(400, {
        message: "Password is required and must be at least 6 characters",
      });
    }

    if (!phone || !phone.trim()) {
      return createCorsResponse(400, { message: "Phone is required" });
    }

    // Validate phone (optional but if provided must be valid)
    const phoneRegex = /^(\+84|0)[1-9][0-9]{8,9}$/;
    if (!phoneRegex.test(phone)) {
      return createCorsResponse(400, {
        message: "Invalid phone format.",
      });
    }

    // Check for existing user
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return createCorsResponse(409, { message: "Email already registered" });
    }

    // Create user (auto-verified)
    const user = await createUser({
      email,
      password,
      phone,
    });

    // Return success response
    return createCorsResponse(201, {
      message: "Registration successful. You can now login.",
      userId: user.userId,
      email: user.email,
      phone: user.phone,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
