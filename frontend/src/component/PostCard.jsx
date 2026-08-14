import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Image as ImageIcon, FileText, Pencil, Trash2 } from 'lucide-react';
import { YoutubeIcon, LinkedinIcon, InstagramIcon } from './dashboard/SocialIcons';

const FORMAT_META = {
  video: { Icon: Video, label: 'video' },
  image: { Icon: ImageIcon, label: 'image' },
  text: { Icon: FileText, label: 'text' },
};

const PLATFORM_META = {
  youtube: { Icon: YoutubeIcon, bg: '#FF0000' },
  linkedin: { Icon: LinkedinIcon, bg: '#0A66C2' },
  instagram: { Icon: InstagramIcon, bg: 'linear-gradient(135deg,#f59e0b,#f43f5e,#9333ea)' },
};

const STATUS_META = {
  draft: { label: 'draft', className: 'bg-slate-100 text-slate-600' },
  scheduled: { label: 'scheduled', className: 'bg-blue-50 text-blue-600' },
  publishing: { label: 'publishing', className: 'bg-amber-50 text-amber-600' },
  posted: { label: 'posted', className: 'bg-emerald-50 text-emerald-600' },
  partially_failed: { label: 'partially failed', className: 'bg-orange-50 text-orange-600' },
  failed: { label: 'failed', className: 'bg-rose-50 text-rose-600' },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

// Local yyyy-mm-dd / HH:MM pieces, for pre-filling the edit form's inputs.
function toEditParts(dateStr) {
  if (!dateStr) return { date: '', time: '' };
  const d = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, '0');
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

export default function PostCard({ post, onDeleted }) {
  const navigate = useNavigate();

  // A post is only editable/deletable before it's actually gone out —
  // once it's posted, it's history. This is decided here from the post's
  // own status, not by whichever page renders the card, so the same
  // <PostCard /> is correct on every page (All / Scheduled / Posted).
  const showActions = post.status !== 'posted';

  const format = FORMAT_META[post.postType] || FORMAT_META.text;
  const status = STATUS_META[post.status] || STATUS_META.draft;
  const caption = post.caption || '(no caption)';
  const platforms = Array.from(new Set((post.targets || []).map((t) => t.platform)));
  const when = post.scheduledAt || post.createdAt;

  const handleEdit = () => {
    const { date, time } = toEditParts(post.scheduledAt);
    const params = new URLSearchParams({
      id: post._id,
      date,
      time,
      caption: post.caption || '',
      platforms: platforms.join(','),
    });
    navigate(`/edit-post?${params.toString()}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This can\'t be undone.')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${post._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete');
      onDeleted?.(post._id);
    } catch (err) {
      window.alert('Could not delete this post — please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Date / time */}
      <div className="px-4 pt-4 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>{formatDate(when)}</span>
        <span>{formatTime(when)}</span>
      </div>

      {/* Format badge */}
      <div className="px-4 pt-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <format.Icon className="w-3.5 h-3.5" />
        <span>{format.label}</span>
      </div>

      {/* Caption */}
      <p className="px-4 pt-2 text-sm text-slate-700 leading-snug line-clamp-3 min-h-[3.6em]">
        {caption}
      </p>

      {/* Media thumbnails */}
      {post.media?.length > 0 && (
        <div className="px-4 pt-3 flex gap-1.5">
          {post.media.slice(0, 3).map((m, i) =>
            m.type === 'video' ? (
              <video key={i} src={m.url} className="w-12 h-12 rounded-lg object-cover bg-slate-100" muted />
            ) : (
              <img key={i} src={m.url} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
            )
          )}
          {post.media.length > 3 && (
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-[11px] font-semibold text-slate-500">
              +{post.media.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Footer: platforms + status + actions */}
      <div className="mt-auto p-4 pt-3 flex items-center justify-between border-t border-slate-100">
        <div className="flex -space-x-1.5">
          {platforms.map((p) => {
            const meta = PLATFORM_META[p];
            if (!meta) return null;
            return (
              <span
                key={p}
                title={p}
                className="w-6 h-6 rounded-full ring-2 ring-white text-white flex items-center justify-center"
                style={{ background: meta.bg }}
              >
                <meta.Icon className="w-3 h-3" />
              </span>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {showActions && (
            <>
              <button
                type="button"
                onClick={handleEdit}
                title="Edit"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                title="Delete"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${status.className}`}>
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
}