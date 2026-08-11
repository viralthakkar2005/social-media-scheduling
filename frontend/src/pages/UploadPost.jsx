import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  UploadCloud,
  X,
  Play,
  Pause,
  Square,
  Calendar as CalendarIcon,
  Clock,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Trash2,
  Search,
  Send,
  Loader2,
} from 'lucide-react';
import {
  YoutubeIcon,
  LinkedinIcon,
  InstagramIcon,
} from '../component/dashboard/SocialIcons';

/* ------------------------------------------------------------------ */
/*  Static config                                                      */
/* ------------------------------------------------------------------ */

// Platform metadata: brand color, icon, caption limit, ring color for selection
const PLATFORM_META = {
  youtube: {
    label: 'YouTube',
    Icon: YoutubeIcon,
    bg: '#FF0000',
    ring: 'ring-[#FF0000]',
    border: 'border-[#FF0000]',
    captionLimit: 5000,
  },
  linkedin: {
    label: 'LinkedIn',
    Icon: LinkedinIcon,
    bg: '#0A66C2',
    ring: 'ring-[#0A66C2]',
    border: 'border-[#0A66C2]',
    captionLimit: 3000,
  },
  instagram: {
    label: 'Instagram',
    Icon: InstagramIcon,
    bg: 'linear-gradient(135deg,#f59e0b,#f43f5e,#9333ea)',
    ring: 'ring-purple-500',
    border: 'border-purple-500',
    captionLimit: 2200,
  },
};

// Mock connected accounts — in the real app this comes from GET /api/connections
const CONNECTED_ACCOUNTS = [
  { id: 'yt1', platform: 'youtube', name: 'jack friks', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' },
  { id: 'yt2', platform: 'youtube', name: 'jack friks shorts', initials: 'JS', color: 'bg-slate-800' },
  { id: 'li1', platform: 'linkedin', name: 'post bridge', initials: 'PB', color: 'bg-slate-700' },
  { id: 'li2', platform: 'linkedin', name: 'jack friks', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' },
  { id: 'ig1', platform: 'instagram', name: 'jackfriks', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' },
  { id: 'ig2', platform: 'instagram', name: 'postbridge.app', initials: 'PB', color: 'bg-emerald-500' },
];

// What each format accepts as media
const ACCEPT_BY_FORMAT = {
  text: null, // no media required for a text post
  image: 'image/png,image/jpeg,image/jpg,image/webp,image/gif',
  video: 'video/mp4',
};

const FORMAT_LABEL = { text: 'Text', image: 'Image', video: 'Video' };

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function SectionCard({ title, hint, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs p-5 lg:p-6 ${className}`}>
      {title && (
        <div className="mb-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{title}</h2>
          {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function AccountAvatar({ account }) {
  if (account.avatar) {
    return (
      <img
        src={account.avatar}
        alt={account.name}
        className="w-full h-full rounded-full object-cover"
      />
    );
  }
  return (
    <div className={`w-full h-full rounded-full flex items-center justify-center text-white text-[11px] font-bold ${account.color || 'bg-slate-400'}`}>
      {account.initials || account.name?.[0]?.toUpperCase()}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function UploadPost() {
  const navigate = useNavigate();
  const location = useLocation();

  // The format was already chosen on the previous screen (NewPost.jsx).
  // We trust it completely — this page never inspects the uploaded file
  // to guess the format, it only enforces what that format allows.
  const format = location.state?.format || 'image';

  /* ---------------- Selected accounts ---------------- */
  const [selectedAccountIds, setSelectedAccountIds] = useState([]);
  const [accountSearch, setAccountSearch] = useState('');

  const filteredAccounts = useMemo(
    () =>
      CONNECTED_ACCOUNTS.filter((a) =>
        a.name.toLowerCase().includes(accountSearch.toLowerCase())
      ),
    [accountSearch]
  );

  const selectedPlatforms = useMemo(() => {
    const set = new Set();
    CONNECTED_ACCOUNTS.forEach((a) => {
      if (selectedAccountIds.includes(a.id)) set.add(a.platform);
    });
    return Array.from(set);
  }, [selectedAccountIds]);

  const toggleAccount = (id) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ---------------- Media ---------------- */
  const [mediaFiles, setMediaFiles] = useState([]); // [{file, url}]
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const accept = ACCEPT_BY_FORMAT[format];

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;

    if (format === 'video') {
      const file = incoming[0];
      const isMp4 = file.type === 'video/mp4' || file.name.toLowerCase().endsWith('.mp4');
      if (!isMp4) {
        setErrors((prev) => ({ ...prev, media: 'Only .mp4 video files are supported.' }));
        return;
      }
      // Video posts only take a single file — replace whatever was there
      mediaFiles.forEach((m) => URL.revokeObjectURL(m.url));
      setMediaFiles([{ file, url: URL.createObjectURL(file) }]);
      setErrors((prev) => ({ ...prev, media: undefined }));
      setActivePreviewIndex(0);
      return;
    }

    if (format === 'image') {
      const validImages = incoming.filter((f) => f.type.startsWith('image/'));
      if (!validImages.length) {
        setErrors((prev) => ({ ...prev, media: 'Only image files are supported.' }));
        return;
      }
      const next = validImages.map((file) => ({ file, url: URL.createObjectURL(file) }));
      setMediaFiles((prev) => [...prev, ...next]);
      setErrors((prev) => ({ ...prev, media: undefined }));
    }
  };

  const removeMediaAt = (idx) => {
    setMediaFiles((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[idx].url);
      copy.splice(idx, 1);
      return copy;
    });
    setActivePreviewIndex((i) => Math.max(0, Math.min(i, mediaFiles.length - 2)));
  };

  useEffect(() => {
    // Clean up object URLs on unmount
    return () => mediaFiles.forEach((m) => URL.revokeObjectURL(m.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  /* ---------------- Caption ---------------- */
  const [caption, setCaption] = useState('');
  const captionLimit = useMemo(() => {
    if (!selectedPlatforms.length) return 3000;
    return Math.min(...selectedPlatforms.map((p) => PLATFORM_META[p].captionLimit));
  }, [selectedPlatforms]);

  /* ---------------- Per-platform fields (the "3rd part") ---------------- */
  // YouTube video posts need a Title + optional Thumbnail.
  // Instagram & LinkedIn just reuse the Main Caption above — no extra fields.
  const [youtubeTitle, setYoutubeTitle] = useState('');
  const [youtubeThumb, setYoutubeThumb] = useState(null); // {file, url}
  const thumbInputRef = useRef(null);

  const needsYoutubeFields = format === 'video' && selectedPlatforms.includes('youtube');

  const handleThumbSelect = (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    if (youtubeThumb) URL.revokeObjectURL(youtubeThumb.url);
    setYoutubeThumb({ file, url: URL.createObjectURL(file) });
  };

  /* ---------------- Schedule ---------------- */
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  /* ---------------- Validation + submit ---------------- */
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const validate = () => {
    const next = {};
    if (selectedAccountIds.length === 0) next.accounts = 'Select at least one account to post to.';
    if (format !== 'text' && mediaFiles.length === 0) next.media = `Upload ${format === 'video' ? 'a video' : 'at least one image'} to continue.`;
    if (!caption.trim() && format === 'text') next.caption = 'Write something for your text post.';
    if (needsYoutubeFields && !youtubeTitle.trim()) next.youtubeTitle = 'YouTube requires a title.';
    if (scheduleEnabled && (!scheduleDate || !scheduleTime)) next.schedule = 'Pick a date and time, or turn off scheduling to post now.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    // Build the payload the backend will receive.
    const payload = {
      format,
      accountIds: selectedAccountIds,
      caption,
      platformMeta: needsYoutubeFields
        ? { youtube: { title: youtubeTitle, hasThumbnail: !!youtubeThumb } }
        : {},
      scheduledAt: scheduleEnabled ? `${scheduleDate}T${scheduleTime}` : null,
      mediaCount: mediaFiles.length,
    };

    /* -------------------------------------------------------------
     * BACKEND TODO — none of this exists yet, wire it up like this:
     *
     * 1. POST /api/posts  (multipart/form-data, protected by the
     *    `protect` JWT-cookie middleware from authMiddleware.js)
     *      - fields: format, caption, accountIds[], scheduledAt
     *      - files:  media[] (one video or 1..N images)
     *      - files:  youtubeThumbnail (optional, only when the
     *                YouTube account + video format are both selected)
     *      - platformMeta: JSON string, e.g. { youtube: { title } }
     *
     * 2. Validate the body with a new zod schema, e.g.
     *    backend/validators/postValidator.js -> postSchema
     *
     * 3. Upload media to object storage (S3 / Cloudinary / R2),
     *    getting back permanent URLs — do NOT store raw files in Mongo.
     *
     * 4. Create a Post document, e.g.
     *    backend/models/Post.js
     *      { userId, format, caption, accounts: [{platform, accountId}],
     *        mediaUrls: [...], platformMeta, status: 'scheduled'|'queued'|'draft',
     *        scheduledAt, createdAt }
     *
     * 5. If scheduledAt is in the future, enqueue a job (BullMQ / Agenda +
     *    Redis) that fires at that time and calls step 6 below.
     *    If the user chose "Post now", skip the queue and go straight
     *    to step 6.
     *
     * 6. For each selected account, call that platform's publish API
     *    using the OAuth token stored for it (see Connections.jsx —
     *    those tokens don't exist yet either, since account connection
     *    is still mocked):
     *      - YouTube Data API v3 (videos.insert)
     *      - LinkedIn Marketing API (ugcPosts)
     *      - Instagram Graph API (media + media_publish)
     *
     * 7. Update the Post document's status to 'posted' or 'failed'
     *    per account, so the Posted/Scheduled pages can reflect it.
     * ------------------------------------------------------------- */
    console.log('New post payload ->', payload);

    await new Promise((r) => setTimeout(r, 900)); // simulate network round trip
    setSubmitting(false);
    showToast(scheduleEnabled ? 'Post scheduled!' : 'Post published!');
    setTimeout(() => navigate('/scheduled'), 900);
  };

  /* ---------------- Video controls ---------------- */
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };
  const stopVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setIsPlaying(false);
  };

  const currentMediaFileName =
    mediaFiles[activePreviewIndex]?.file?.name || (format === 'text' ? null : 'No file selected yet');

  return (
    <div className="p-6 lg:p-10 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/new-post')}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Back to format selection"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#1e293b] tracking-tight">
              Create {FORMAT_LABEL[format]} Post
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Choose your accounts, add your media, then schedule it.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
        {/* ---------------------------- LEFT COLUMN ---------------------------- */}
        <div className="flex flex-col gap-6">
          {/* Accounts selector */}
          <SectionCard title="Post to" hint="Pick every account this post should go out to.">
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={accountSearch}
                onChange={(e) => setAccountSearch(e.target.value)}
                placeholder="Search accounts by name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5bc983] text-sm text-slate-800"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {filteredAccounts.map((account) => {
                const meta = PLATFORM_META[account.platform];
                const isSelected = selectedAccountIds.includes(account.id);
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => toggleAccount(account.id)}
                    title={`${account.name} · ${meta.label}`}
                    className="relative w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-105"
                  >
                    <div
                      className={`w-full h-full rounded-full p-0.5 ${
                        isSelected ? `ring-2 ${meta.ring}` : 'ring-1 ring-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <AccountAvatar account={account} />
                    </div>
                    {/* Platform badge */}
                    <span
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white border-2 border-white"
                      style={{ background: meta.bg }}
                    >
                      <meta.Icon className="w-2.5 h-2.5" />
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#5bc983] border-2 border-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
                      </span>
                    )}
                  </button>
                );
              })}
              {filteredAccounts.length === 0 && (
                <p className="text-sm text-slate-400 py-2">No accounts match “{accountSearch}”.</p>
              )}
            </div>

            {errors.accounts && (
              <p className="text-xs text-rose-600 font-medium mt-3 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.accounts}
              </p>
            )}
          </SectionCard>

          {/* Media upload — hidden entirely for text posts */}
          {format !== 'text' && (
            <SectionCard
              title="Media"
              hint={format === 'video' ? 'MP4 files only.' : 'JPG, PNG, WEBP or GIF — add more than one for a carousel.'}
            >
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-colors ${
                  isDragging ? 'border-[#5bc983] bg-[#f0fdf4]' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#5bc983]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Drag & drop {format === 'video' ? 'your video' : 'your image(s)'} here
                </p>
                <p className="text-xs text-slate-400">or click to browse · {format === 'video' ? '.mp4 only' : 'images only'}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={accept}
                  multiple={format === 'image'}
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>

              {errors.media && (
                <p className="text-xs text-rose-600 font-medium mt-3 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.media}
                </p>
              )}

              {/* Thumbnails of uploaded media */}
              {mediaFiles.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {mediaFiles.map((m, idx) => (
                    <div
                      key={m.url}
                      onClick={() => setActivePreviewIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer flex-shrink-0 bg-slate-900 ${
                        idx === activePreviewIndex ? 'border-[#5bc983]' : 'border-transparent'
                      }`}
                    >
                      {format === 'video' ? (
                        <video src={m.url} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={m.url} alt="" className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeMediaAt(idx); }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          )}

          {/* Main Caption */}
          <SectionCard title="Main Caption" hint="Used for every selected account unless a platform overrides it below.">
            <div className={`rounded-xl border ${errors.caption ? 'border-rose-300' : 'border-slate-200 focus-within:border-[#5bc983] focus-within:ring-2 focus-within:ring-[#5bc983]/30'} transition-colors`}>
              <textarea
                rows={5}
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, captionLimit))}
                placeholder="Caption here!"
                className="w-full px-4 py-3 rounded-t-xl resize-none focus:outline-none text-sm text-slate-800"
              />
              <div className="flex items-center justify-end px-4 py-2 border-t border-slate-100 text-xs text-slate-400">
                {caption.length}/{captionLimit}
              </div>
            </div>
            {errors.caption && (
              <p className="text-xs text-rose-600 font-medium mt-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.caption}
              </p>
            )}
          </SectionCard>

          {/* Per-platform fields — the "3rd part" */}
          {selectedPlatforms.length > 0 && (
            <SectionCard title="Platform settings" hint="Fields shown here only apply to platforms that need something extra.">
              <div className="flex flex-col gap-4">
                {/* YouTube: needs a Title + Thumbnail, but only for video posts */}
                {selectedPlatforms.includes('youtube') && (
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-md bg-[#FF0000] text-white flex items-center justify-center">
                        <YoutubeIcon className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-sm font-bold text-slate-800">YouTube</span>
                    </div>

                    {format === 'video' ? (
                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Video title <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={youtubeTitle}
                            onChange={(e) => setYoutubeTitle(e.target.value.slice(0, 100))}
                            placeholder="Give your video a title"
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5bc983] ${
                              errors.youtubeTitle ? 'border-rose-300' : 'border-slate-300'
                            }`}
                          />
                          <div className="flex items-center justify-between mt-1">
                            {errors.youtubeTitle ? (
                              <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.youtubeTitle}
                              </p>
                            ) : <span />}
                            <span className="text-xs text-slate-400">{youtubeTitle.length}/100</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Thumbnail <span className="text-slate-400 font-normal">(optional)</span>
                          </label>
                          {youtubeThumb ? (
                            <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200">
                              <img src={youtubeThumb.url} alt="Thumbnail" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => { URL.revokeObjectURL(youtubeThumb.url); setYoutubeThumb(null); }}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => thumbInputRef.current?.click()}
                              className="w-32 h-20 rounded-lg border-2 border-dashed border-slate-200 hover:border-slate-300 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-500 cursor-pointer"
                            >
                              <ImagePlus className="w-5 h-5" />
                              <span className="text-[11px] font-medium">Add image</span>
                            </button>
                          )}
                          <input
                            ref={thumbInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleThumbSelect(e.target.files)}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">Uses the Main Caption above — no extra fields for this format.</p>
                    )}
                  </div>
                )}

                {/* Instagram: just the caption, nothing else */}
                {selectedPlatforms.includes('instagram') && (
                  <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                      <InstagramIcon className="w-3.5 h-3.5" />
                    </span>
                    <p className="text-xs text-slate-500">
                      <span className="font-bold text-slate-800">Instagram</span> — uses the Main Caption above as-is. No separate title field, {PLATFORM_META.instagram.captionLimit.toLocaleString()} character limit.
                    </p>
                  </div>
                )}

                {/* LinkedIn: also just the caption */}
                {selectedPlatforms.includes('linkedin') && (
                  <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-[#0A66C2] text-white flex items-center justify-center flex-shrink-0">
                      <LinkedinIcon className="w-3.5 h-3.5" />
                    </span>
                    <p className="text-xs text-slate-500">
                      <span className="font-bold text-slate-800">LinkedIn</span> — uses the Main Caption above as-is. No separate title field, {PLATFORM_META.linkedin.captionLimit.toLocaleString()} character limit.
                    </p>
                  </div>
                )}
              </div>
            </SectionCard>
          )}
        </div>

        {/* ---------------------------- RIGHT COLUMN ---------------------------- */}
        <div className="flex flex-col gap-6 xl:sticky xl:top-6">
          {/* Media preview player */}
          <SectionCard title="Media Preview">
            <div className="relative w-full aspect-[9/13] rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
              {format === 'video' && mediaFiles[activePreviewIndex] && (
                <>
                  <video
                    ref={videoRef}
                    src={mediaFiles[activePreviewIndex].url}
                    className="w-full h-full object-contain bg-black"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    controls
                  />
                </>
              )}

              {format === 'image' && mediaFiles[activePreviewIndex] && (
                <>
                  <img
                    src={mediaFiles[activePreviewIndex].url}
                    alt="Preview"
                    className="w-full h-full object-contain bg-black"
                  />
                  {mediaFiles.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActivePreviewIndex((i) => (i - 1 + mediaFiles.length) % mediaFiles.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePreviewIndex((i) => (i + 1) % mediaFiles.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {mediaFiles.map((_, i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${i === activePreviewIndex ? 'bg-white' : 'bg-white/40'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}

              {format !== 'text' && !mediaFiles[activePreviewIndex] && (
                <div className="flex flex-col items-center gap-2 text-slate-500 px-6 text-center">
                  {format === 'video' ? <UploadCloud className="w-8 h-8" /> : <ImagePlus className="w-8 h-8" />}
                  <p className="text-xs">Nothing uploaded yet</p>
                </div>
              )}

              {format === 'text' && (
                <div className="w-full h-full bg-white flex flex-col p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-slate-200" />
                    <div className="h-2 w-20 rounded bg-slate-200" />
                  </div>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap break-words leading-relaxed">
                    {caption || <span className="text-slate-300">Your caption will preview here…</span>}
                  </p>
                </div>
              )}
            </div>

            {/* Custom transport controls for video, per the "play / stop" ask */}
            {format === 'video' && mediaFiles[activePreviewIndex] && (
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  type="button"
                  onClick={stopVideo}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5" /> Stop
                </button>
              </div>
            )}

            {currentMediaFileName && (
              <p className="text-xs text-slate-400 text-center mt-3 truncate">{currentMediaFileName}</p>
            )}
          </SectionCard>

          {/* Schedule */}
          <SectionCard title="Schedule post">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-600 font-medium">Schedule for later</span>
              <button
                type="button"
                onClick={() => setScheduleEnabled((v) => !v)}
                className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                  scheduleEnabled ? 'bg-[#5bc983]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    scheduleEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {scheduleEnabled && (
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="relative">
                  <CalendarIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full pl-9 pr-2 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5bc983]"
                  />
                </div>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full pl-9 pr-2 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5bc983]"
                  />
                </div>
              </div>
            )}

            {errors.schedule && (
              <p className="text-xs text-rose-600 font-medium mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.schedule}
              </p>
            )}

            <p className="text-xs text-slate-400 mb-4">
              {scheduleEnabled
                ? 'Your post will go out at this time, in your local timezone.'
                : "Your post will publish immediately when you submit."}
            </p>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#5bc983] hover:bg-[#4eb573] disabled:opacity-60 text-white text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {submitting ? 'Submitting…' : scheduleEnabled ? 'Schedule Post' : 'Publish Now'}
            </button>
          </SectionCard>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-[#5bc983]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}