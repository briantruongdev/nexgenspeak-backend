const { v4: uuidv4 } = require("uuid");
const { getDynamoClient } = require("../dynamo-client");

const tableName = process.env.TRIAL_REQUESTS_TABLE;

const createTrialRequest = async ({ email, name, phone, englishLevel }) => {
  const db = getDynamoClient();
  const requestId = uuidv4();
  const item = {
    requestId,
    email,
    name,
    phone,
    englishLevel,
    requestedAt: new Date().toISOString(),
  };
  await db
    .put({
      TableName: tableName,
      Item: item,
    })
    .promise();

  return item;
};

module.exports = { createTrialRequest };
