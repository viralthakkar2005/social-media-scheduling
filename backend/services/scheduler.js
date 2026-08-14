const Post = require('../models/Post');
const { publishPost } = require('./publishPost');

const POLL_INTERVAL_MS = 15 * 1000; // check every 15s
const STALE_LOCK_MS = 5 * 60 * 1000; // treat a lock older than 5 min as crashed, retry it

let running = false;

async function tick() {
  if (running) return; // don't overlap runs
  running = true;

  try {
    const now = new Date();

    // Due = scheduled time has passed (or it's an immediate 'Publish Now'
    // post, which has scheduledAt: null and status already 'publishing'),
    // and not currently being processed by another tick.
    const dueFilter = {
      status: { $in: ['scheduled', 'publishing'] },
      $or: [{ scheduledAt: null }, { scheduledAt: { $lte: now } }],
      $and: [
        {
          $or: [
            { lockedAt: null },
            { lockedAt: { $lt: new Date(now.getTime() - STALE_LOCK_MS) } },
          ],
        },
      ],
    };

    const duePosts = await Post.find(dueFilter).limit(20);

    for (const post of duePosts) {
      // Atomically claim it so a second tick (or process) can't double-publish.
      const claimed = await Post.findOneAndUpdate(
        { _id: post._id, lockedAt: post.lockedAt },
        { lockedAt: now },
        { new: true }
      );
      if (!claimed) continue; // someone else claimed it first

      await publishPost(claimed);
    }
  } catch (err) {
    console.error('Scheduler tick failed:', err.message);
  } finally {
    running = false;
  }
}

function startScheduler() {
  setInterval(tick, POLL_INTERVAL_MS);
  console.log(`Post scheduler started — checking every ${POLL_INTERVAL_MS / 1000}s`);
}

module.exports = { startScheduler };
