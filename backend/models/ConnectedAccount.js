const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

const connectedAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    platform: { type: String, required: true },
    accountLabel: { type: String },
    platformUserId: { type: String, required: true },
    platformUsername: { type: String },
    platformAvatarUrl: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiresAt: { type: Date },
    status: {
      type: String,
      enum: ['active', 'expired', 'revoked'],
      default: 'active',
    },
  },
  { timestamps: true }
);

connectedAccountSchema.index(
  { userId: 1, platform: 1, platformUserId: 1 },
  { unique: true }
);

// Mongoose 7+ dropped callback-style hooks — no `next` param, no next()
// call. A plain synchronous function (or one returning a promise) is
// all that's needed here.
connectedAccountSchema.pre('save', function () {
  if (this.isModified('accessToken') && this.accessToken) {
    this.accessToken = encrypt(this.accessToken);
  }
  if (this.isModified('refreshToken') && this.refreshToken) {
    this.refreshToken = encrypt(this.refreshToken);
  }
});

connectedAccountSchema.methods.getDecryptedTokens = function () {
  return {
    accessToken: this.accessToken ? decrypt(this.accessToken) : null,
    refreshToken: this.refreshToken ? decrypt(this.refreshToken) : null,
  };
};

module.exports = mongoose.model('ConnectedAccount', connectedAccountSchema);