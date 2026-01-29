const bcrypt = require("bcryptjs");
const { parseEventBody } = require("/opt/nodejs/common/utils");
const { generateToken } = require("/opt/nodejs/common/jwt-service");
const { getUserByEmail } = require("/opt/nodejs/db/repository/user-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");

exports.lambdaHandler = async (event) => {
  const { email, password } = event.body ? parseEventBody(event) : event;
  if (!email || !password)
    return createCorsResponse(400, { message: "Missing credentials" });

  const user = await getUserByEmail(email);
  if (!user) {
    return createCorsResponse(401, { message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return createCorsResponse(401, { message: "Invalid credentials" });

  const token = await generateToken({ sub: user.userId, email });
  return createCorsResponse(200, { token });
};
