const { getDynamoClient } = require("../dynamo-client");
const { v4: uuidv4 } = require("uuid");
const tableName = process.env.TEACHERS_TABLE;

// Get all teachers
const getAllTeachers = async () => {
  const db = getDynamoClient();
  const res = await db
    .scan({
      TableName: tableName,
    })
    .promise();
  return res.Items || [];
};

// Get teacher by ID
const getTeacherById = async (teacherId) => {
  const db = getDynamoClient();
  const res = await db
    .get({
      TableName: tableName,
      Key: { teacherId },
    })
    .promise();
  return res.Item;
};

// Create a new teacher
const createTeacher = async ({
  fullName,
  position,
  award1,
  award2,
  award3,
}) => {
  const db = getDynamoClient();
  const teacherId = uuidv4();
  const item = {
    teacherId,
    fullName,
    position,
    award1: award1 || null,
    award2: award2 || null,
    award3: award3 || null,
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

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
};
