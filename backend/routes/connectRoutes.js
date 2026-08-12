const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  startYoutubeConnect,
  handleYoutubeCallback,
  listConnectedAccounts,
  disconnectAccount,
} = require('../controllers/connectController');

router.get('/youtube/start', protect, startYoutubeConnect);
router.get('/youtube/callback', handleYoutubeCallback);
router.get('/', protect, listConnectedAccounts);
router.delete('/:id', protect, disconnectAccount);

module.exports = router;