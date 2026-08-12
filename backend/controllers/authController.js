const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { signUpSchema, signInSchema } = require('../validators/authValidator');

const crypto = require('crypto');
const { google } = require('../config/oauthConfig');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

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


// GET /api/auth/google
// Kicks off Google sign-in/sign-up. Unlike the YouTube-connect flow, there's
// no logged-in user yet to bind `state` to, so instead we drop a random
// value in a short-lived httpOnly cookie and check it matches on callback
// (standard OAuth CSRF protection).
exports.googleAuthStart = (req, res) => {
  const state = crypto.randomBytes(24).toString('hex');

  res.cookie('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000, // 10 minutes
  });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: google.clientId,
    redirect_uri: google.redirectUri,
    scope: google.scope,
    prompt: 'select_account',
    state,
  });

  res.redirect(`${google.authUrl}?${params.toString()}`);
};

// GET /api/auth/google/callback  (not cookie-auth-protected — Google calls this, not our SPA)
exports.googleAuthCallback = async (req, res) => {
  const { code, state } = req.query;
  const savedState = req.cookies.oauth_state;
  res.clearCookie('oauth_state');

  if (!code || !state || !savedState || state !== savedState) {
    return res.redirect(`${FRONTEND_URL}/sign-in?error=invalid_state`);
  }

  try {
    const tokenRes = await fetch(google.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: google.clientId,
        client_secret: google.clientSecret,
        redirect_uri: google.redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      return res.redirect(`${FRONTEND_URL}/sign-in?error=google_auth_failed`);
    }

    const profileRes = await fetch(google.userInfoUrl, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();

    if (!profileRes.ok || !profile.sub || !profile.email) {
      return res.redirect(`${FRONTEND_URL}/sign-in?error=google_profile_failed`);
    }
    if (!profile.email_verified) {
      return res.redirect(`${FRONTEND_URL}/sign-in?error=email_not_verified`);
    }

    // 1. returning Google user
    let user = await User.findOne({ googleId: profile.sub });

    // 2. an email/password account already exists with this email — link it
    //    instead of creating a duplicate
    if (!user) {
      user = await User.findOne({ email: profile.email });
      if (user) {
        user.googleId = profile.sub;
        await user.save();
      }
    }

    // 3. brand new user
    if (!user) {
      user = await User.create({
        fullName: profile.name || profile.email.split('@')[0],
        email: profile.email,
        googleId: profile.sub,
        authProvider: 'google',
      });
    }

    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${FRONTEND_URL}/dashboard/new-post`);
  } catch (err) {
    console.error('Google auth callback error:', err.message);
    return res.redirect(`${FRONTEND_URL}/sign-in?error=google_auth_failed`);
  }
};