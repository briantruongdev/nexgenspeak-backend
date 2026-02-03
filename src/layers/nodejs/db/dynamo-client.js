const AWS = require("aws-sdk");
const { APP_REGION } = process.env;
let db = null;
const getDynamoClient = () => {
  if (db) return db;
  db = new AWS.DynamoDB.DocumentClient({ region: APP_REGION });
  return db;
};

module.exports = { getDynamoClient };
