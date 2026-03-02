const bcrypt = require("bcryptjs");
const { getDynamoClient } = require("/opt/nodejs/db/dynamo-client");
const { getUserByEmail } = require("/opt/nodejs/db/repository/user-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");
const { v4: uuidv4 } = require("uuid");

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Admin@12345";

exports.lambdaHandler = async (event) => {
  try {
    // Check if admin already exists
    const existingAdmin = await getUserByEmail(ADMIN_EMAIL);
    if (existingAdmin) {
      return createCorsResponse(200, {
        message: "Admin account already exists",
        admin: {
          userId: existingAdmin.userId,
          email: existingAdmin.email,
          role: existingAdmin.role,
        },
      });
    }

    // Create admin account
    const db = getDynamoClient();
    const userId = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const item = {
      userId,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      fullName: "Admin",
      role: "admin",
      createdAt: new Date().toISOString(),
    };

    await db
      .put({
        TableName: process.env.USERS_TABLE,
        Item: item,
      })
      .promise();

    return createCorsResponse(201, {
      message: "Admin account created successfully",
      admin: {
        userId: item.userId,
        email: item.email,
        fullName: item.fullName,
        role: item.role,
      },
    });
  } catch (err) {
    console.error("Seed admin error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
