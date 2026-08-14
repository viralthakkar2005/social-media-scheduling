const cloudinary = require('../config/cloudinary');

// upload_chunked_stream (instead of upload_stream) sends the file to
// Cloudinary in chunks and tolerates slow connections much better —
// upload_stream has no chunking and was hitting Cloudinary's 60s default
// timeout on videos/thumbnails, which is the "timeout" error you were
// seeing. (Note: the v2 SDK only exposes this method as
// `upload_chunked_stream` — `upload_large_stream` exists in the legacy v1
// API but isn't re-exported on v2's `cloudinary.uploader`, which is why
// that name threw "is not a function".)
// The explicit `timeout` here overrides Cloudinary's 60s default with 5
// minutes, as extra headroom on top of chunking.
function uploadToCloudinary(fileBuffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_chunked_stream(
      {
        resource_type: 'auto', // 'auto' handles both image and video
        folder,
        chunk_size: 6 * 1024 * 1024, // 6MB per chunk
        timeout: 300000, // 5 minutes
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(fileBuffer);
  });
}

module.exports = uploadToCloudinary;
