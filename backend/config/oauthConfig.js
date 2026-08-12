const PORT = process.env.PORT || 5000;

const youtube = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // must exactly match what's registered in Google Cloud Console
  redirectUri:
    process.env.GOOGLE_REDIRECT_URI ||
    `http://localhost:${PORT}/api/connect/youtube/callback`,
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  // upload scope requested now even though upload logic isn't built yet,
  // so this config doesn't need to change (and users don't need to
  // re-consent) when that task lands
  scope: [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly',
  ].join(' '),
};

module.exports = { youtube };