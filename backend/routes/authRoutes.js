const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const { signUp, signIn, logout, getMe, googleAuthStart, googleAuthCallback } = require('../controllers/authController');
// ^ replace the old import line with this one

router.get('/google', googleAuthStart);
router.get('/google/callback', googleAuthCallback);

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;