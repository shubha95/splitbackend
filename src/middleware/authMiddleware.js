const jwt  = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/responseHelper');

const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization') || req.header('x-auth-token');
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return sendError(res, 401, 'Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
      return sendError(res, 401, 'Access denied. User no longer exists.');
    }

    if (user.awsToken !== token) {
      return sendError(res, 401, 'Access denied. Token is invalid or has been replaced.');
    }

    if (!user.tokenExpiry || new Date() > new Date(user.tokenExpiry)) {
      return sendError(res, 401, 'Access denied. Token has expired. Please login again.');
    }

    req.user = {
      id:       user._id,
      userName: user.name,
      emailId:  user.email,
    };

    next();
  } catch (err) {
    return sendError(res, 401, 'Access denied. Token is not valid.');
  }
};

module.exports = auth;
