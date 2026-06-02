const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/responseHelper');

// Applied on login and register routes only
const authLimiter = rateLimit({
  windowMs:         15 * 60 * 1000, // 15 minutes window
  max:              10,              // max 10 requests per IP per window
  standardHeaders:  true,
  legacyHeaders:    false,
  handler: (req, res) => {
    return sendError(
      res,
      429,
      'Too many requests. Please try again after 15 minutes.',
    );
  },
});

// Applied globally on all routes
const globalLimiter = rateLimit({
  windowMs:         1 * 60 * 1000, // 1 minute window
  max:              100,            // max 100 requests per IP per minute
  standardHeaders:  true,
  legacyHeaders:    false,
  handler: (req, res) => {
    return sendError(
      res,
      429,
      'Too many requests. Slow down.',
    );
  },
});

module.exports = { authLimiter, globalLimiter };
