const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

const SECRET = process.env.JWT_SECRET;

exports.generateToken = async (payload, expiresIn = "7d") => {
  return sign(payload, SECRET, { algorithm: "HS256", expiresIn });
};

exports.verifyToken = async (token) => {
  return verify(token, SECRET);
};
