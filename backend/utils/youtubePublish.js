const { getValidAccessToken } = require('./googleAuth');

const UPLOAD_BASE = 'https://www.googleapis.com/upload/youtube/v3/videos';
const THUMBNAIL_BASE = 'https://www.googleapis.com/upload/youtube/v3/thumbnails/set';

// Downloads a URL (the video/thumbnail we already stored on Cloudinary)
// fully into memory. Fine for the file sizes this app deals with (same
// buffering approach already used for the Cloudinary upload itself).
async function fetchAsBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download media from Cloudinary (${res.status})`);
  const contentType = res.headers.get('content-type') || 'application/octet-stream';
  const buffer = Buffer.from(await res.arrayBuffer());
  return { buffer, contentType };
}

// Two-step resumable upload, per YouTube Data API docs:
//   1. POST metadata -> Google replies with a one-time upload URL (Location header)
//   2. PUT the raw video bytes to that URL
// Returns the new YouTube video id.
async function uploadVideo({ accessToken, videoBuffer, videoContentType, title, description }) {
  const initRes = await fetch(`${UPLOAD_BASE}?uploadType=resumable&part=snippet,status`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Upload-Content-Length': String(videoBuffer.length),
      'X-Upload-Content-Type': videoContentType,
    },
    body: JSON.stringify({
      snippet: {
        title: title.slice(0, 100), // YouTube's title limit
        description: description || '',
      },
      status: {
        // Change to 'private' or 'unlisted' if you don't want posts going
        // live on YouTube immediately/automatically.
        privacyStatus: 'public',
      },
    }),
  });

  if (!initRes.ok) {
    const errBody = await initRes.text().catch(() => '');
    throw new Error(`YouTube upload init failed (${initRes.status}): ${errBody}`);
  }

  const uploadUrl = initRes.headers.get('location');
  if (!uploadUrl) throw new Error('YouTube did not return a resumable upload URL');

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': videoContentType,
      'Content-Length': String(videoBuffer.length),
    },
    body: videoBuffer,
  });

  const uploadData = await uploadRes.json().catch(() => ({}));
  if (!uploadRes.ok || !uploadData.id) {
    throw new Error(`YouTube video upload failed (${uploadRes.status}): ${JSON.stringify(uploadData)}`);
  }

  return uploadData.id;
}

async function setThumbnail({ accessToken, videoId, thumbBuffer, thumbContentType }) {
  const res = await fetch(`${THUMBNAIL_BASE}?videoId=${videoId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': thumbContentType,
      'Content-Length': String(thumbBuffer.length),
    },
    body: thumbBuffer,
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    // Non-fatal — the video itself published fine, just log and move on.
    console.error(`YouTube thumbnail set failed (${res.status}): ${errBody}`);
  }
}

// Publishes one post to one connected YouTube account.
// `account` is a ConnectedAccount mongoose doc, `post` is a Post doc.
// Returns the YouTube video id.
async function publishToYoutube(account, post) {
  const accessToken = await getValidAccessToken(account);

  const videoMedia = post.media.find((m) => m.type === 'video');
  if (!videoMedia) throw new Error('No video file attached to this post');

  const { buffer: videoBuffer, contentType: videoContentType } = await fetchAsBuffer(videoMedia.url);

  const description = post.platformCaptions?.youtube || post.caption || '';

  const videoId = await uploadVideo({
    accessToken,
    videoBuffer,
    videoContentType,
    title: post.youtube?.title || 'Untitled',
    description,
  });

  if (post.youtube?.thumbnailUrl) {
    const { buffer: thumbBuffer, contentType: thumbContentType } = await fetchAsBuffer(post.youtube.thumbnailUrl);
    await setThumbnail({ accessToken, videoId, thumbBuffer, thumbContentType });
  }

  return videoId;
}

module.exports = { publishToYoutube };
