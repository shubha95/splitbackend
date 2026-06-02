const express         = require('express');
const router          = express.Router();
const authRoutes        = require('./authRoutes');
const expenseRoutes     = require('./expenseRoutes');
const groupRoutes       = require('./groupRoutes');
const groupMemberRoutes = require('./groupMemberRoutes');
const { authLimiter }   = require('../middleware/rateLimiter');

router.use('/auth',         authLimiter, authRoutes);
router.use('/expense',      expenseRoutes);
router.use('/group',        groupRoutes);
router.use('/group-member', groupMemberRoutes);

module.exports = router;
