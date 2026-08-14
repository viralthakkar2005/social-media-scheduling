const Post = require('../models/Post');
const ConnectedAccount = require('../models/ConnectedAccount');
const uploadToCloudinary = require('../utils/cloudinaryUpload');

// POST /api/posts  (protected, multipart/form-data)
exports.createPost = async (req, res) => {
  try {
    const { postType, caption, scheduledAt, timezone, youtubeTitle } = req.body;

    if (!postType || !['text', 'image', 'video'].includes(postType)) {
      return res.status(400).json({ message: 'postType must be text, image, or video' });
    }

    // accountIds arrives as a JSON string from FormData, e.g. '["id1","id2"]'
    let accountIds = req.body.accountIds;
    if (typeof accountIds === 'string') {
      try {
        accountIds = JSON.parse(accountIds);
      } catch {
        accountIds = [accountIds];
      }
    }
    if (!Array.isArray(accountIds) || accountIds.length === 0) {
      return res.status(400).json({ message: 'Select at least one account to post to' });
    }

    // platformCaptions also arrives as a JSON string
    let platformCaptions = {};
    if (req.body.platformCaptions) {
      try {
        platformCaptions = JSON.parse(req.body.platformCaptions);
      } catch {
        platformCaptions = {};
      }
    }

    // Only allow accounts that actually belong to this user — never trust
    // the client's list on its own.
    const accounts = await ConnectedAccount.find({
      _id: { $in: accountIds },
      userId: req.userId,
    });
    if (accounts.length !== accountIds.length) {
      return res.status(403).json({ message: 'One or more accounts are invalid or not yours' });
    }

    const targets = accounts.map((acc) => ({
      connectedAccountId: acc._id,
      platform: acc.platform,
      status: 'pending',
    }));

    // multer.fields() puts these under req.files.<fieldName>
    const mediaFiles = req.files?.media || [];
    const thumbnailFile = req.files?.youtubeThumbnail?.[0];

    const media = [];
    for (let i = 0; i < mediaFiles.length; i++) {
      const file = mediaFiles[i];
      const result = await uploadToCloudinary(file.buffer, `posts/${req.userId}`);
      media.push({
        url: result.secure_url,
        type: file.mimetype.startsWith('video') ? 'video' : 'image',
        order: i,
      });
    }

    if (postType !== 'text' && media.length === 0) {
      return res.status(400).json({
        message: `Upload ${postType === 'video' ? 'a video' : 'at least one image'} to continue`,
      });
    }

    let youtube;
    const needsYoutubeFields = postType === 'video' && targets.some((t) => t.platform === 'youtube');
    if (needsYoutubeFields) {
      if (!youtubeTitle || !youtubeTitle.trim()) {
        return res.status(400).json({ message: 'YouTube requires a title' });
      }
      youtube = { title: youtubeTitle };
      if (thumbnailFile) {
        const thumbResult = await uploadToCloudinary(thumbnailFile.buffer, `posts/${req.userId}/thumbnails`);
        youtube.thumbnailUrl = thumbResult.secure_url;
      }
    }

    const post = await Post.create({
      userId: req.userId,
      postType,
      targets,
      caption: caption || '',
      platformCaptions,
      media,
      youtube,
      scheduledAt: scheduledAt || null,
      timezone,
      // No publish queue wired up yet — that's the next step after this.
      status: scheduledAt ? 'scheduled' : 'publishing',
    });

    res.status(201).json({ post });
  } catch (err) {
    console.error('createPost error:', err.message);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

// GET /api/posts  (protected)
exports.listPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load posts' });
  }
};

// GET /api/posts/:id  (protected)
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, userId: req.userId });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load post' });
  }
};

// DELETE /api/posts/:id  (protected)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, userId: req.userId });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await Post.deleteOne({ _id: post._id });
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post' });
  }
};
