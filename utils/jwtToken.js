var jwt = require('jsonwebtoken');
require('dotenv').config();

const createJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const refreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.REFRESH_EXPIRES_IN,
  });
};
module.exports = { createJWT, refreshToken };
