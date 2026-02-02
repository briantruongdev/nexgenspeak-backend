const { getDynamoClient } = require("../dynamo-client");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const tableName = process.env.USERS_TABLE;

const getUserByEmail = async (email) => {
  const db = getDynamoClient();
  const res = await db
    .query({
      TableName: tableName,
      IndexName: "emailIndex",
      KeyConditionExpression: "email = :e",
      ExpressionAttributeValues: { ":e": email },
      Limit: 1,
    })
    .promise();
  return res.Items && res.Items[0];
};

const createUser = async ({ email, password }) => {
  const db = getDynamoClient();
  const userId = uuidv4();
  const item = {
    userId,
    email,
    createdAt: new Date().toISOString(),
  };
  if (password) {
    const salt = await bcrypt.genSalt(10);
    item.password = await bcrypt.hash(password, salt);
  }
  await db
    .put({
      TableName: tableName,
      Item: item,
    })
    .promise();

  return item;
};

const resetPassword = async (email, newPassword) => {
  const db = getDynamoClient();
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await db
    .update({
      TableName: tableName,
      Key: { userId: user.userId },
      UpdateExpression: "SET password = :password",
      ExpressionAttributeValues: {
        ":password": hashedPassword,
      },
    })
    .promise();

  return { userId: user.userId, email: user.email };
};

module.exports = {
  getUserByEmail,
  createUser,
  resetPassword,
};
