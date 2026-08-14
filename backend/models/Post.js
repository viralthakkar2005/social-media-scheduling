const mongoose = require('mongoose');

const targetSchema = new mongoose.Schema(
  {
    connectedAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'ConnectedAccount', required: true },
    platform: { type: String, required: true },
    status: { type: String, enum: ['pending', 'posted', 'failed'], default: 'pending' },
    platformPostId: { type: String },
    postedAt: { type: Date },
    errorMessage: { type: String },
  },
  { _id: false }
);

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    postType: { type: String, enum: ['text', 'image', 'video'], required: true },

    // One post can go out to multiple connected accounts across platforms —
    // each target tracks its own publish status independently.
    targets: { type: [targetSchema], required: true },

    caption: { type: String, default: '' },
    // Per-platform override — only set for platforms someone actually
    // edited in the UI; everything else falls back to `caption`.
    platformCaptions: {
      youtube: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
    },

    media: { type: [mediaSchema], default: [] },

    youtube: {
      title: { type: String },
      thumbnailUrl: { type: String },
    },

    scheduledAt: { type: Date, default: null }, // null = "Publish Now"
    timezone: { type: String },

    status: {
      type: String,
      enum: ['draft', 'scheduled', 'publishing', 'posted', 'partially_failed', 'failed'],
      default: 'scheduled',
    },
    lockedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
