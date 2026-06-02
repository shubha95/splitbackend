const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/responseHelper');

const isDev = process.env.NODE_ENV !== 'production';

// Applied on login and register routes only
const authLimiter = rateLimit({
  windowMs:         1 * 60 * 1000,       // 1 minute window
  max:              isDev ? 1000 : 100,  // dev: 1000 | prod: 100 per IP per minute
  standardHeaders:  true,
  legacyHeaders:    false,
  handler: (req, res) => {
    return sendError(
      res,
      429,
      'Too many requests. Please try again after 1 minute.',
    );
  },
});

// Applied globally on all routes
const globalLimiter = rateLimit({
  windowMs:         1 * 60 * 1000,       // 1 minute window
  max:              isDev ? 1000 : 100,  // dev: 1000 | prod: 100 per IP per minute
  standardHeaders:  true,
  legacyHeaders:    false,
  handler: (req, res) => {
    return sendError(
      res,
      429,
      'Too many requests. Please try again after 1 minute.',
    );
  },
});

module.exports = { authLimiter, globalLimiter };
