const multer = require('multer');

// Memory storage — files never touch disk, the buffer goes straight to
// Cloudinary in the controller.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file
});

module.exports = upload;
