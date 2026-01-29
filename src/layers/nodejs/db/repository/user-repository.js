const { getDynamoClient } = require("../dynamo-client");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const EMAIL_INDEX = "emailIndex";
const tableName = process.env.USERS_TABLE;

const getUserByEmail = async (email) => {
  const db = getDynamoClient();
  const res = await db
    .query({
      TableName: tableName,
      IndexName: EMAIL_INDEX,
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

module.exports = {
  getUserByEmail,
  createUser,
};
