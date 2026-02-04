const { getDynamoClient } = require("../dynamo-client");
const { v4: uuidv4 } = require("uuid");
const tableName = process.env.REGISTRATIONS_TABLE;

// Get registrations by userId and date
const getRegistrationByUserAndDate = async (userId, date) => {
  const db = getDynamoClient();

  const queryParams = {
    TableName: tableName,
    IndexName: "userDateIndex",
    KeyConditionExpression: "userId = :userId AND #date = :date",
    ExpressionAttributeNames: {
      "#date": "date",
    },
    ExpressionAttributeValues: {
      ":userId": userId,
      ":date": date,
    },
    Limit: 1,
  };

  console.log(
    "getRegistrationByUserAndDate - Query params:",
    JSON.stringify(queryParams, null, 2),
  );
  console.log("getRegistrationByUserAndDate - userId:", userId, "date:", date);

  const res = await db.query(queryParams).promise();
  return res.Items && res.Items[0];
};

// Get registrations by teacherId and date
const getRegistrationsByTeacherAndDate = async (teacherId, date) => {
  const db = getDynamoClient();
  const res = await db
    .query({
      TableName: tableName,
      IndexName: "teacherDateIndex",
      KeyConditionExpression: "teacherId = :teacherId AND #date = :date",
      ExpressionAttributeNames: {
        "#date": "date",
      },
      ExpressionAttributeValues: {
        ":teacherId": teacherId,
        ":date": date,
      },
    })
    .promise();
  return res.Items || [];
};

// Get all registrations by userId
const getRegistrationsByUserId = async (userId) => {
  const db = getDynamoClient();
  const res = await db
    .query({
      TableName: tableName,
      IndexName: "userDateIndex",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    })
    .promise();
  return res.Items || [];
};

// Create a new registration
const createRegistration = async ({ userId, teacherId, slotIds, date }) => {
  const db = getDynamoClient();
  const registrationId = uuidv4();
  const item = {
    registrationId,
    userId,
    teacherId,
    slotIds,
    date,
    createdAt: new Date().toISOString(),
  };

  await db
    .put({
      TableName: tableName,
      Item: item,
    })
    .promise();

  return item;
};

// Update registration slots
const updateRegistrationSlots = async (registrationId, slotIds) => {
  const db = getDynamoClient();
  await db
    .update({
      TableName: tableName,
      Key: { registrationId },
      UpdateExpression: "SET slotIds = :slotIds, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":slotIds": slotIds,
        ":updatedAt": new Date().toISOString(),
      },
    })
    .promise();
};

module.exports = {
  getRegistrationByUserAndDate,
  getRegistrationsByTeacherAndDate,
  getRegistrationsByUserId,
  createRegistration,
  updateRegistrationSlots,
};
