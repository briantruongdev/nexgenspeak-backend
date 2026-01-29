const { parseEventBody } = require("/opt/nodejs/common/utils");
const {
  createUser,
  getUserByEmail,
} = require("/opt/nodejs/db/repository/user-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");

exports.lambdaHandler = async (event) => {
  try {
    const { email, password } = event.body ? parseEventBody(event) : event;

    if (!email) {
      return createCorsResponse(400, { message: "Email is required" });
    }
    if (!password) {
      return createCorsResponse(400, { message: "Password is required" });
    }

    // Check for existing user (by email)
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return createCorsResponse(409, { message: "Email already registered" });
    }

    // create user
    const item = await createUser({
      email,
      password,
    });

    return createCorsResponse(201, {
      userId: item.userId,
      userEmail: item.email,
    });
  } catch (err) {
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
