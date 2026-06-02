const jwt = require('jsonwebtoken');

const TOKEN_EXPIRY_HOURS = 24;

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: `${TOKEN_EXPIRY_HOURS}h`,
  });
};

const getTokenExpiry = () => {
  return new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
};

module.exports = { generateToken, getTokenExpiry };
