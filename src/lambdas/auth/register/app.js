const { parseEventBody } = require("/opt/nodejs/common/utils");
const {
  createUserWithOTP,
  getUserByEmail,
} = require("/opt/nodejs/db/repository/user-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");
const {
  generateOTP,
  getOTPExpiration,
} = require("/opt/nodejs/utils/otp-utils");
const { sendOTPEmail } = require("/opt/nodejs/services/sns-service");

exports.lambdaHandler = async (event) => {
  try {
    const { email, password } = event.body ? parseEventBody(event) : event;

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

    // Check for existing user
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return createCorsResponse(409, { message: "Email already registered" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiredAt = getOTPExpiration(
      parseInt(process.env.OTP_EXPIRED_MINUTES || "5"),
    );

    // Create user with OTP (isVerified = false)
    const user = await createUserWithOTP({
      email,
      password,
      otp,
      otpExpiredAt,
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return createCorsResponse(500, {
        message:
          "User created but failed to send verification email. Please contact support.",
      });
    }

    // Return success response (DO NOT return OTP in production)
    return createCorsResponse(201, {
      message:
        "Registration successful. Please check your email for OTP verification.",
      userId: user.userId,
      email: user.email,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
