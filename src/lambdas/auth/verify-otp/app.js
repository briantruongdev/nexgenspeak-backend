const { parseEventBody } = require("/opt/nodejs/common/utils");
const {
  getUserByEmail,
  updateUserVerification,
} = require("/opt/nodejs/db/repository/user-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");
const { isOTPExpired } = require("/opt/nodejs/utils/otp-utils");

exports.lambdaHandler = async (event) => {
  try {
    const { email, otp } = event.body ? parseEventBody(event) : event;

    // Validate input
    if (!email || !email.trim()) {
      return createCorsResponse(400, { message: "Email is required" });
    }

    if (!otp || !otp.trim()) {
      return createCorsResponse(400, { message: "OTP is required" });
    }

    // Get user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return createCorsResponse(404, { message: "User not found" });
    }

    // Check if already verified
    if (user.isVerified) {
      return createCorsResponse(400, { message: "Email already verified" });
    }

    // Check if OTP exists
    if (!user.otp) {
      return createCorsResponse(400, {
        message: "No OTP found. Please request a new one.",
      });
    }

    // Check if OTP is expired
    if (isOTPExpired(user.otpExpiredAt)) {
      return createCorsResponse(400, {
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP
    if (user.otp !== otp.trim()) {
      return createCorsResponse(400, { message: "Invalid OTP" });
    }

    // Update user verification status
    await updateUserVerification(email);

    return createCorsResponse(200, {
      message: "Email verified successfully. You can now login.",
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
