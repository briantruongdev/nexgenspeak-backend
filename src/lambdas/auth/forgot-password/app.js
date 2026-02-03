const { parseEventBody } = require("/opt/nodejs/common/utils");
const {
  resetPassword,
  getUserByEmail,
} = require("/opt/nodejs/db/repository/user-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");

exports.lambdaHandler = async (event) => {
  try {
    const { email, newPassword } = event.body ? parseEventBody(event) : event;

    // Validate email
    if (!email || !email.trim()) {
      return createCorsResponse(400, { message: "Email is required" });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createCorsResponse(400, { message: "Invalid email format" });
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return createCorsResponse(400, {
        message: "New password is required and must be at least 6 characters",
      });
    }

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return createCorsResponse(404, {
        message: "No account found with this email address",
      });
    }

    // Reset password
    const result = await resetPassword(email, newPassword);

    // Return success response
    return createCorsResponse(200, {
      message:
        "Password reset successful. You can now login with your new password.",
      userId: result.userId,
      email: result.email,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
