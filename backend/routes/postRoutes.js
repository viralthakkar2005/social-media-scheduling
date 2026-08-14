const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  createPost,
  listPosts,
  getPost,
  deletePost,
} = require('../controllers/postController');

// multipart/form-data: 'media' (up to 10 — carousel images or 1 video)
// plus an optional single 'youtubeThumbnail'
const postUpload = upload.fields([
  { name: 'media', maxCount: 10 },
  { name: 'youtubeThumbnail', maxCount: 1 },
]);

router.post('/', protect, postUpload, createPost);
router.get('/', protect, listPosts);
router.get('/:id', protect, getPost);
router.delete('/:id', protect, deletePost);

module.exports = router;
