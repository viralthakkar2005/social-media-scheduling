const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { signUp, signIn, logout, getMe } = require('../controllers/authController');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;