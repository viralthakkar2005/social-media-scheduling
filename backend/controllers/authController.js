const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { signUpSchema, signInSchema } = require('../validators/authValidator');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// POST /api/auth/signup
exports.signUp = async (req, res) => {
  const parsed = signUpSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0].message });
  }

  const { fullName, email, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ fullName, email, password: hashedPassword });

  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,          // JS can't read it — blocks XSS token theft
    secure: process.env.NODE_ENV === 'production', // true = HTTPS only
    sameSite: 'lax',         // 'none' + secure:true if frontend/backend on different domains in prod
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, match JWT_EXPIRES_IN
  });

  res.status(201).json({
    user: { id: user._id, fullName: user.fullName, email: user.email },
    // no token in body anymore — it's in the cookie
  });
};

// POST /api/auth/signin
exports.signIn = async (req, res) => {
  const parsed = signInSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0].message });
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,          // JS can't read it — blocks XSS token theft
    secure: process.env.NODE_ENV === 'production', // true = HTTPS only
    sameSite: 'lax',         // 'none' + secure:true if frontend/backend on different domains in prod
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, match JWT_EXPIRES_IN
  });

  res.status(201).json({
    user: { id: user._id, fullName: user.fullName, email: user.email },
    // no token in body anymore — it's in the cookie
  });
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
};

// GET /api/auth/me  (protected)
// Lets the frontend check "am I logged in" on load — the JWT lives in an
// httpOnly cookie so client-side JS can't read it directly, this is the
// only way the SPA can know the session is valid.
exports.getMe = async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    user: { id: user._id, fullName: user.fullName, email: user.email },
  });
};