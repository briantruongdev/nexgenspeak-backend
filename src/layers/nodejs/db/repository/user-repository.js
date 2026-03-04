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

const createUser = async ({ email, password, phone }) => {
  const db = getDynamoClient();
  const userId = uuidv4();
  const item = {
    userId,
    email,
    phone,
    slotAvailablePerDay: 3, // Default slots available per day
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

const addFavoriteTeacher = async (userId, teacherId) => {
  const db = getDynamoClient();
  const teacherSet = db.createSet([teacherId]);

  await db
    .update({
      TableName: tableName,
      Key: { userId },
      UpdateExpression: "ADD favoriteTeachers :teacherId",
      ExpressionAttributeValues: {
        ":teacherId": teacherSet,
      },
    })
    .promise();
};

const removeFavoriteTeacher = async (userId, teacherId) => {
  const db = getDynamoClient();
  const teacherSet = db.createSet([teacherId]);

  await db
    .update({
      TableName: tableName,
      Key: { userId },
      UpdateExpression: "DELETE favoriteTeachers :teacherId",
      ExpressionAttributeValues: {
        ":teacherId": teacherSet,
      },
    })
    .promise();
};

const getFavoriteTeachers = async (userId) => {
  const db = getDynamoClient();
  const res = await db
    .get({
      TableName: tableName,
      Key: { userId },
      ProjectionExpression: "favoriteTeachers",
    })
    .promise();
  return res.Item?.favoriteTeachers?.values || [];
};

// Get user by userId
const getUserById = async (userId) => {
  const db = getDynamoClient();
  const res = await db
    .get({
      TableName: tableName,
      Key: { userId },
    })
    .promise();
  return res.Item;
};

// Get all students (users with role = 'student' or no role, i.e. regular users)
const getAllStudents = async () => {
  const db = getDynamoClient();
  const res = await db
    .scan({
      TableName: tableName,
      FilterExpression: "#role = :student OR attribute_not_exists(#role)",
      ExpressionAttributeNames: {
        "#role": "role",
      },
      ExpressionAttributeValues: {
        ":student": "student",
      },
    })
    .promise();
  return res.Items || [];
};

// Get all teacher users (users with role = 'teacher')
const getAllTeacherUsers = async () => {
  const db = getDynamoClient();
  const res = await db
    .scan({
      TableName: tableName,
      FilterExpression: "#role = :teacher",
      ExpressionAttributeNames: {
        "#role": "role",
      },
      ExpressionAttributeValues: {
        ":teacher": "teacher",
      },
    })
    .promise();
  return res.Items || [];
};

// Create teacher user account (with role = 'teacher')
const createTeacherUser = async ({ email, password, fullName, teacherId }) => {
  const db = getDynamoClient();
  const userId = uuidv4();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const item = {
    userId,
    email,
    password: hashedPassword,
    fullName,
    role: "teacher",
    teacherId, // Link to the teacher profile in TeachersTable
    createdAt: new Date().toISOString(),
  };

  await db
    .put({
      TableName: tableName,
      Item: item,
    })
    .promise();

  return { userId, email, fullName, role: "teacher", teacherId };
};

// Update student settings (slots per day and expiration date)
const updateUserSettings = async (
  userId,
  { maxSlotsPerDay, expirationDate },
) => {
  const db = getDynamoClient();

  const updateExpressions = [];
  const expressionValues = {};
  const expressionNames = {};

  if (maxSlotsPerDay !== undefined) {
    updateExpressions.push("#maxSlots = :maxSlots");
    expressionValues[":maxSlots"] = maxSlotsPerDay;
    expressionNames["#maxSlots"] = "slotAvailablePerDay";
  }

  if (expirationDate !== undefined) {
    updateExpressions.push("#expDate = :expDate");
    expressionValues[":expDate"] = expirationDate;
    expressionNames["#expDate"] = "expirationDate";
  }

  if (updateExpressions.length === 0) {
    throw new Error("No settings to update");
  }

  updateExpressions.push("#updatedAt = :updatedAt");
  expressionValues[":updatedAt"] = new Date().toISOString();
  expressionNames["#updatedAt"] = "updatedAt";

  await db
    .update({
      TableName: tableName,
      Key: { userId },
      UpdateExpression: "SET " + updateExpressions.join(", "),
      ExpressionAttributeValues: expressionValues,
      ExpressionAttributeNames: expressionNames,
    })
    .promise();

  return { userId, maxSlotsPerDay, expirationDate };
};

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  createTeacherUser,
  resetPassword,
  addFavoriteTeacher,
  removeFavoriteTeacher,
  getFavoriteTeachers,
  getAllStudents,
  getAllTeacherUsers,
  updateUserSettings,
};
