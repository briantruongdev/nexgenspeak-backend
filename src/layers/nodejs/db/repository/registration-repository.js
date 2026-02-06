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

// Get registration by userId, teacherId and date
const getRegistrationByUserTeacherAndDate = async (userId, teacherId, date) => {
  const db = getDynamoClient();

  const queryParams = {
    TableName: tableName,
    IndexName: "userDateIndex",
    KeyConditionExpression: "userId = :userId AND #date = :date",
    FilterExpression: "teacherId = :teacherId",
    ExpressionAttributeNames: {
      "#date": "date",
    },
    ExpressionAttributeValues: {
      ":userId": userId,
      ":date": date,
      ":teacherId": teacherId,
    },
    Limit: 1,
  };

  console.log(
    "getRegistrationByUserTeacherAndDate - Query params:",
    JSON.stringify(queryParams, null, 2),
  );

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

// Get registration by registrationId
const getRegistrationById = async (registrationId) => {
  const db = getDynamoClient();
  const res = await db
    .get({
      TableName: tableName,
      Key: { registrationId },
    })
    .promise();
  return res.Item;
};

// Delete registration
const deleteRegistration = async (registrationId) => {
  const db = getDynamoClient();
  await db
    .delete({
      TableName: tableName,
      Key: { registrationId },
    })
    .promise();
};

module.exports = {
  getRegistrationByUserAndDate,
  getRegistrationByUserTeacherAndDate,
  getRegistrationsByTeacherAndDate,
  getRegistrationsByUserId,
  getRegistrationById,
  createRegistration,
  updateRegistrationSlots,
  deleteRegistration,
};
