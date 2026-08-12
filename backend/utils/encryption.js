const crypto = require('crypto');

// Generate TOKEN_ENCRYPTION_KEY with:
//   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
// That prints a 64-char hex string = 32 raw bytes, required for AES-256.
// Put it in backend/.env as TOKEN_ENCRYPTION_KEY=<that string>.

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV, recommended size for GCM
const AUTH_TAG_LENGTH = 16;

const getKey = () => {
  const keyHex = process.env.TOKEN_ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error('TOKEN_ENCRYPTION_KEY is not set');
  }
  const key = Buffer.from(keyHex, 'hex');
  if (key.length !== 32) {
    throw new Error(
      'TOKEN_ENCRYPTION_KEY must decode to 32 bytes (64 hex chars) for AES-256'
    );
  }
  return key;
};

const encrypt = (text) => {
  if (text === undefined || text === null || text === '') return text;

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

  const ciphertext = Buffer.concat([
    cipher.update(String(text), 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, ciphertext]).toString('base64');
};

const decrypt = (encryptedText) => {
  if (!encryptedText) return encryptedText;

  const data = Buffer.from(encryptedText, 'base64');
  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
};

module.exports = { encrypt, decrypt };