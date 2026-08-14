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
  ChevronDown,
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

const API_BASE = 'http://localhost:5000/api';

// Which connected-account platforms are even selectable for a given post
// format — mirrors the platform icons shown on each format card in
// NewPost.jsx (Text -> LinkedIn only, Image/Video -> all three).
const PLATFORMS_BY_FORMAT = {
  text: ['linkedin'],
  image: ['youtube', 'linkedin', 'instagram'],
  video: ['youtube', 'linkedin', 'instagram'],
};

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

  /* ---------------- Connected accounts (real data) ---------------- */
  // Only platforms that support this post format are ever shown here —
  // e.g. a Text post can only go to LinkedIn, per PLATFORMS_BY_FORMAT.
  const allowedPlatforms = PLATFORMS_BY_FORMAT[format] || [];
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState(false);

  useEffect(() => {
    const loadAccounts = async () => {
      setAccountsLoading(true);
      setAccountsError(false);
      try {
        const res = await fetch(`${API_BASE}/connect`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load accounts');
        const data = await res.json();
        const mapped = (data.accounts || []).map((a) => ({
          id: a._id,
          platform: a.platform,
          name: a.platformUsername || `${a.platform} account`,
          avatar: a.platformAvatarUrl || undefined,
        }));
        setAccounts(mapped);
      } catch (err) {
        setAccountsError(true);
      } finally {
        setAccountsLoading(false);
      }
    };
    loadAccounts();
  }, []);

  /* ---------------- Selected accounts ---------------- */
  const [selectedAccountIds, setSelectedAccountIds] = useState([]);
  const [accountSearch, setAccountSearch] = useState('');

  // Accounts eligible for this format at all (e.g. LinkedIn only, for text)
  const eligibleAccounts = useMemo(
    () => accounts.filter((a) => allowedPlatforms.includes(a.platform)),
    [accounts, allowedPlatforms]
  );

  const filteredAccounts = useMemo(
    () =>
      eligibleAccounts.filter((a) =>
        a.name.toLowerCase().includes(accountSearch.toLowerCase())
      ),
    [eligibleAccounts, accountSearch]
  );

  const selectedPlatforms = useMemo(() => {
    const set = new Set();
    accounts.forEach((a) => {
      if (selectedAccountIds.includes(a.id)) set.add(a.platform);
    });
    return Array.from(set);
  }, [accounts, selectedAccountIds]);

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

  // Per-platform caption overrides — only YouTube, LinkedIn, Instagram are
  // supported (no Facebook/TikTok in this app). Absence of a key for a
  // platform means "still using the Main Caption".
  const [captionOverrides, setCaptionOverrides] = useState({});
  const [showCaptionsPanel, setShowCaptionsPanel] = useState(false);
  const [showYoutubePanel, setShowYoutubePanel] = useState(false);

  const setPlatformCaption = (platform, text) => {
    const limit = PLATFORM_META[platform].captionLimit;
    setCaptionOverrides((prev) => ({ ...prev, [platform]: text.slice(0, limit) }));
  };
  const clearPlatformCaption = (platform) => {
    setCaptionOverrides((prev) => {
      const next = { ...prev };
      delete next[platform];
      return next;
    });
  };

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
  const [submitError, setSubmitError] = useState('');
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
    setSubmitError('');

    // Build the multipart form the backend's POST /api/posts expects.
    const formData = new FormData();
    formData.append('postType', format);
    formData.append('accountIds', JSON.stringify(selectedAccountIds));
    formData.append('caption', caption);

    // Per-platform caption text — only the platforms someone actually
    // edited get sent; postController falls back to `caption` for the rest.
    const platformCaptions = selectedPlatforms.reduce((acc, p) => {
      if (captionOverrides[p] != null) acc[p] = captionOverrides[p];
      return acc;
    }, {});
    formData.append('platformCaptions', JSON.stringify(platformCaptions));

    if (needsYoutubeFields) {
      formData.append('youtubeTitle', youtubeTitle);
      if (youtubeThumb) formData.append('youtubeThumbnail', youtubeThumb.file);
    }

    if (scheduleEnabled) {
      formData.append('scheduledAt', `${scheduleDate}T${scheduleTime}`);
      formData.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
    }

    // format === 'text' has no media files at all
    mediaFiles.forEach((m) => formData.append('media', m.file));

    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSubmitError(data.message || 'Something went wrong — please try again.');
        setSubmitting(false);
        return;
      }

      setSubmitting(false);
      showToast(scheduleEnabled ? 'Post scheduled!' : 'Post published!');
      setTimeout(() => navigate('/dashboard/scheduled'), 900);
    } catch (err) {
      setSubmitError('Could not reach the server — check your connection and try again.');
      setSubmitting(false);
    }
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
            onClick={() => navigate('/dashboard/new-post')}
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
          <SectionCard
            title="Post to"
            hint={`${FORMAT_LABEL[format]} posts support ${allowedPlatforms
              .map((p) => PLATFORM_META[p].label)
              .join(', ')}.`}
          >
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

            {accountsLoading ? (
              <p className="text-sm text-slate-400 py-2 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading your connected accounts…
              </p>
            ) : accountsError ? (
              <p className="text-sm text-rose-500 py-2">
                Couldn't load your connected accounts. Refresh to try again.
              </p>
            ) : (
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

                {eligibleAccounts.length === 0 && (
                  <p className="text-sm text-slate-400 py-2">
                    No connected accounts support {FORMAT_LABEL[format].toLowerCase()} posts yet. Connect one on the{' '}
                    <Link to="/connections" className="text-[#5bc983] font-semibold hover:underline">
                      Connections
                    </Link>{' '}
                    page.
                  </p>
                )}
                {eligibleAccounts.length > 0 && filteredAccounts.length === 0 && (
                  <p className="text-sm text-slate-400 py-2">No accounts match "{accountSearch}".</p>
                )}
              </div>
            )}

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

          {/* Post configuration chips — only tools this app actually supports:
              per-platform caption overrides, and YouTube's title/thumbnail
              (no Facebook, TikTok, "Past Captions", or "Processing" — those
              aren't real features here). */}
          {selectedPlatforms.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mr-1">
                Post configurations
              </span>
              <button
                type="button"
                onClick={() => setShowCaptionsPanel((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold transition-colors cursor-pointer ${
                  showCaptionsPanel
                    ? 'bg-[#f0fdf4] border-[#5bc983] text-[#2f7d54]'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Platform Captions
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCaptionsPanel ? 'rotate-180' : ''}`} />
              </button>

              {needsYoutubeFields && (
                <button
                  type="button"
                  onClick={() => setShowYoutubePanel((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold transition-colors cursor-pointer ${
                    errors.youtubeTitle
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : showYoutubePanel
                      ? 'bg-[#f0fdf4] border-[#5bc983] text-[#2f7d54]'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <YoutubeIcon className="w-3.5 h-3.5" />
                  YouTube Title
                  {errors.youtubeTitle && <AlertCircle className="w-3.5 h-3.5" />}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showYoutubePanel ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
          )}

          {/* Platform Captions panel — override the Main Caption per platform,
              same "Using main caption / Edit / Clear" pattern for every
              platform we actually support. */}
          {showCaptionsPanel && selectedPlatforms.length > 0 && (
            <SectionCard title="Platform Captions" hint="Override the main caption for individual platforms.">
              <div className="flex flex-col gap-5">
                {selectedPlatforms.map((platform) => {
                  const meta = PLATFORM_META[platform];
                  const isEdited = captionOverrides[platform] != null;
                  const value = isEdited ? captionOverrides[platform] : caption;
                  return (
                    <div key={platform}>
                      <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded flex items-center justify-center text-white flex-shrink-0"
                            style={{ background: meta.bg }}
                          >
                            <meta.Icon className="w-3 h-3" />
                          </span>
                          <span className="text-sm font-bold text-slate-800">{meta.label}</span>
                          {isEdited ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2f7d54] bg-[#f0fdf4] px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#5bc983]" /> Edited caption
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Using main caption</span>
                          )}
                        </div>
                        {isEdited ? (
                          <button
                            type="button"
                            onClick={() => clearPlatformCaption(platform)}
                            className="text-xs font-semibold text-slate-400 hover:text-rose-500 cursor-pointer"
                          >
                            Clear
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPlatformCaption(platform, caption)}
                            className="text-xs font-semibold text-[#5bc983] hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                      <div
                        className={`rounded-xl border transition-colors ${
                          isEdited
                            ? 'border-slate-200 focus-within:border-[#5bc983] focus-within:ring-2 focus-within:ring-[#5bc983]/30'
                            : 'border-slate-100 bg-slate-50'
                        }`}
                      >
                        <textarea
                          rows={3}
                          value={value}
                          disabled={!isEdited}
                          onChange={(e) => setPlatformCaption(platform, e.target.value)}
                          placeholder="Caption here!"
                          className="w-full px-4 py-3 rounded-t-xl resize-none focus:outline-none text-sm text-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed bg-transparent"
                        />
                        <div className="flex items-center justify-end px-4 py-2 border-t border-slate-100 text-xs text-slate-400">
                          {value.length}/{meta.captionLimit}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          )}

          {/* YouTube Title panel — YouTube is the only platform that needs
              more than a caption: a required title, plus an optional
              thumbnail. */}
          {showYoutubePanel && needsYoutubeFields && (
            <SectionCard title="YouTube" hint="Required for YouTube video uploads.">
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

            {submitError && (
              <p className="text-xs text-rose-600 font-medium mb-3 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> {submitError}
              </p>
            )}

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