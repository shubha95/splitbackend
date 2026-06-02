const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/authMiddleware');
const { register, login, changePassword, getUsers } = require('../controllers/authController');

router.post('/register',         register);
router.post('/login',            login);
router.put('/change-password',   changePassword);
router.post('/users',            auth, getUsers);

module.exports = router;