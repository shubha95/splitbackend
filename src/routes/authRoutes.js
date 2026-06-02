const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/authMiddleware');
const { register, login, changePassword, getUsers, getMe, logout } = require('../controllers/authController');

router.post('/register',         register);
router.post('/login',            login);
router.put('/change-password',   changePassword);
router.get('/me',                auth, getMe);
router.post('/logout',           auth, logout);
router.post('/users',            auth, getUsers);

module.exports = router;