const Post = require('../models/Post');
const ConnectedAccount = require('../models/ConnectedAccount');
const { publishToYoutube } = require('../utils/youtubePublish');

// Only YouTube actually has OAuth + upload logic wired up right now.
// LinkedIn/Instagram targets get marked as failed with an honest message
// instead of silently hanging as 'pending' forever — add real publishers
// here for those platforms once they're built.
async function publishTarget(post, target) {
  if (target.platform !== 'youtube') {
    target.status = 'failed';
    target.errorMessage = `Publishing to ${target.platform} isn't implemented yet`;
    return;
  }

  try {
    const account = await ConnectedAccount.findById(target.connectedAccountId);
    if (!account) throw new Error('Connected account no longer exists');

    const videoId = await publishToYoutube(account, post);

    target.status = 'posted';
    target.platformPostId = videoId;
    target.postedAt = new Date();
    target.errorMessage = undefined;
  } catch (err) {
    target.status = 'failed';
    target.errorMessage = err.message;
    console.error(`Failed to publish post ${post._id} to ${target.platform}:`, err.message);
  }
}

// Publishes a post to every one of its targets, then updates overall status.
async function publishPost(post) {
  for (const target of post.targets) {
    await publishTarget(post, target);
  }

  const statuses = post.targets.map((t) => t.status);
  if (statuses.every((s) => s === 'posted')) {
    post.status = 'posted';
  } else if (statuses.some((s) => s === 'posted')) {
    post.status = 'partially_failed';
  } else {
    post.status = 'failed';
  }

  post.lockedAt = undefined;
  await post.save();
}

module.exports = { publishPost };
