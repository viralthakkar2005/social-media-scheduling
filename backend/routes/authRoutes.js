const express = require('express');
const router = express.Router();
const { signUp, signIn,logout } = require('../controllers/authController');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/logout', logout);

module.exports = router;