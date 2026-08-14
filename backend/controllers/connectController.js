const jwt = require('jsonwebtoken');
const ConnectedAccount = require('../models/ConnectedAccount');
const { youtube } = require('../config/oauthConfig');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const STATE_EXPIRES_IN = '10m';

// GET /api/connect/youtube/start  (protected)
// Builds Google's consent URL and redirects. `state` is a short-lived JWT
// carrying the logged-in user's id, since Google's callback request won't
// carry our auth cookie.
exports.startYoutubeConnect = (req, res) => {
  const state = jwt.sign({ userId: req.userId }, process.env.JWT_SECRET, {
    expiresIn: STATE_EXPIRES_IN,
  });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: youtube.clientId,
    redirect_uri: youtube.redirectUri,
    scope: youtube.scope,
    access_type: 'offline',
    prompt: 'consent select_account',
    state,
  });

  res.redirect(`${youtube.authUrl}?${params.toString()}`);
};

// GET /api/connect/youtube/callback  (NOT cookie-protected — user comes
// from state instead, since this request arrives from Google, not our SPA)
exports.handleYoutubeCallback = async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.redirect(`${FRONTEND_URL}/connections?error=missing_params`);
  }

  let userId;
  try {
    const decoded = jwt.verify(state, process.env.JWT_SECRET);
    userId = decoded.userId;
  } catch (err) {
    return res.redirect(`${FRONTEND_URL}/connections?error=invalid_state`);
  }

  try {
    // 1. exchange the code for tokens
    const tokenRes = await fetch(youtube.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: youtube.clientId,
        client_secret: youtube.clientSecret,
        redirect_uri: youtube.redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    
    if (!tokenRes.ok || !tokenData.access_token) {
      return res.redirect(
        `${FRONTEND_URL}/connections?error=token_exchange_failed`
      );
    }

    const { access_token, refresh_token, expires_in } = tokenData;

    // 2. fetch the connected channel's identity
    const channelRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const channelData = await channelRes.json();
    e
    const channel = channelData.items && channelData.items[0];

    if (!channelRes.ok || !channel) {
      return res.redirect(
        `${FRONTEND_URL}/connections?error=channel_fetch_failed`
      );
    }

    const platformUserId = channel.id;
    const platformUsername = channel.snippet?.title || '';
    const platformAvatarUrl = channel.snippet?.thumbnails?.default?.url || '';
    const tokenExpiresAt = expires_in
      ? new Date(Date.now() + expires_in * 1000)
      : undefined;

    // 3. upsert — reconnect if this exact user+platform+channel already
    // exists, else create new. Using find + save (not findOneAndUpdate)
    // deliberately, so the model's pre-save encryption hook always runs.
    let account = await ConnectedAccount.findOne({
      userId,
      platform: 'youtube',
      platformUserId,
    });

    if (!account) {
      account = new ConnectedAccount({
        userId,
        platform: 'youtube',
        platformUserId,
      });
    }

    account.platformUsername = platformUsername;
    account.platformAvatarUrl = platformAvatarUrl;
    account.accessToken = access_token;
    // Google only returns refresh_token on the FIRST consent. On a
    // reconnect it may be omitted — don't overwrite a good token with
    // nothing.
    if (refresh_token) {
      account.refreshToken = refresh_token;
    }
    account.tokenExpiresAt = tokenExpiresAt;
    account.status = 'active';

    await account.save();

    return res.redirect(`${FRONTEND_URL}/connections`);
  } catch (err) {
    console.error('YouTube callback error:', err.message, err.response?.data || '');
    return res.redirect(`${FRONTEND_URL}/connections?error=connection_failed`);
}
};

// GET /api/connect  (protected)
exports.listConnectedAccounts = async (req, res) => {
  try {
    const accounts = await ConnectedAccount.find({ userId: req.userId }).select(
      '-accessToken -refreshToken'
    );
    res.status(200).json({ accounts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load connected accounts' });
  }
};

// DELETE /api/connect/:id  (protected)
exports.disconnectAccount = async (req, res) => {
  try {
    const account = await ConnectedAccount.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (account.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: 'Not authorized to modify this account' });
    }

    await ConnectedAccount.deleteOne({ _id: account._id });

    res.status(200).json({ message: 'Account disconnected' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to disconnect account' });
  }
};