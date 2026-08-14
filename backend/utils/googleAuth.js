const { youtube } = require('../config/oauthConfig');

async function getValidAccessToken(account) {
  const { accessToken, refreshToken } = account.getDecryptedTokens();

  const isExpired =
    !account.tokenExpiresAt || account.tokenExpiresAt.getTime() <= Date.now() + 60 * 1000; // 60s buffer

  if (!isExpired) {
    return accessToken;
  }

  if (!refreshToken) {
    throw new Error('Access token expired and no refresh token is stored — account needs to be reconnected');
  }

  const res = await fetch(youtube.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: youtube.clientId,
      client_secret: youtube.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(`Failed to refresh Google access token: ${data.error || res.status}`);
  }

  account.accessToken = data.access_token; // encrypted by the pre-save hook
  account.tokenExpiresAt = data.expires_in
    ? new Date(Date.now() + data.expires_in * 1000)
    : undefined;
  await account.save();

  return data.access_token;
}

module.exports = { getValidAccessToken };