import React, { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  Image as ImageIcon,
  Video,
  FileText,
  Loader2,
  Plus,
  AlertCircle,
} from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import {
  YoutubeIcon,
  LinkedinIcon,
  InstagramIcon,
} from '../component/dashboard/SocialIcons';

const API_BASE = 'http://localhost:5000/api';

const PLATFORM_META = {
  youtube: {
    label: 'YouTube',
    Icon: YoutubeIcon,
    bg: '#FF0000',
  },
  linkedin: {
    label: 'LinkedIn',
    Icon: LinkedinIcon,
    bg: '#0A66C2',
  },
  instagram: {
    label: 'Instagram',
    Icon: InstagramIcon,
    bg: 'linear-gradient(135deg,#f59e0b,#f43f5e,#9333ea)',
  },
};

const TYPE_META = {
  video: { Icon: Video, label: 'Video' },
  image: { Icon: ImageIcon, label: 'Image' },
  text: { Icon: FileText, label: 'Text' },
};

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dayKey(date) {
  const d = startOfDay(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatTime(dateString) {
  if (!dateString) return 'No time';
  return new Date(dateString).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatFullDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getPostDate(post) {
  // Scheduled posts belong on their scheduled date. If a post was published
  // without a schedule, createdAt still lets the calendar show real data.
  return post.scheduledAt || post.createdAt;
}

function getPostTargets(post) {
  return post.targets || [];
}

function AccountAvatars({ post }) {
  const targets = getPostTargets(post);

  return (
    <div className="flex items-center -space-x-1.5">
      {targets.slice(0, 5).map((target, index) => {
        const meta = PLATFORM_META[target.platform];
        if (!meta) return null;

        const name =
          target.accountName ||
          target.platformUsername ||
          `${meta.label} account`;

        return (
          <span
            key={`${String(target.connectedAccountId || target.platform)}-${index}`}
            title={`${name} · ${meta.label}`}
            className="relative w-7 h-7 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center"
          >
            {target.accountAvatarUrl ? (
              <img
                src={target.accountAvatarUrl}
                alt={name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="w-full h-full rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                {name.slice(0, 1).toUpperCase()}
              </span>
            )}

            <span
              className="absolute -right-1 -bottom-1 w-3.5 h-3.5 rounded-full ring-1 ring-white text-white flex items-center justify-center"
              style={{ background: meta.bg }}
            >
              <meta.Icon className="w-2 h-2" />
            </span>
          </span>
        );
      })}

      {targets.length > 5 && (
        <span className="ml-2 text-[11px] font-semibold text-slate-500">
          +{targets.length - 5}
        </span>
      )}
    </div>
  );
}

function CalendarPost({ post, onClick }) {
  const type = TYPE_META[post.postType] || TYPE_META.text;
  const TypeIcon = type.Icon;
  const when = getPostDate(post);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            <TypeIcon className="w-3.5 h-3.5" />
            {type.label}
            <span className="text-slate-300">•</span>
            <Clock className="w-3.5 h-3.5" />
            {formatTime(when)}
          </div>

          <p className="mt-1.5 text-sm font-semibold text-slate-800 line-clamp-2">
            {post.caption || post.youtube?.title || '(No caption)'}
          </p>

          {post.youtube?.title && post.caption && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-1">
              YouTube title: {post.youtube.title}
            </p>
          )}
        </div>

        <span
          className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${
            post.status === 'posted'
              ? 'bg-emerald-50 text-emerald-600'
              : post.status === 'failed'
              ? 'bg-rose-50 text-rose-600'
              : 'bg-blue-50 text-blue-600'
          }`}
        >
          {post.status}
        </span>
      </div>

      <div className="mt-3">
        <AccountAvatars post={post} />
      </div>
    </button>
  );
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadPosts = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(`${API_BASE}/posts`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to load posts');

        const data = await res.json();
        if (!cancelled) setPosts(data.posts || []);
      } catch (err) {
        if (!cancelled) setError('Could not load calendar posts. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  const postsByDay = useMemo(() => {
    const map = new Map();

    posts.forEach((post) => {
      const date = getPostDate(post);
      if (!date) return;

      const key = dayKey(new Date(date));
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(post);
    });

    for (const dayPosts of map.values()) {
      dayPosts.sort(
        (a, b) =>
          new Date(getPostDate(a)).getTime() -
          new Date(getPostDate(b)).getTime()
      );
    }

    return map;
  }, [posts]);

  const selectedPosts = postsByDay.get(dayKey(selectedDate)) || [];

  const handleDateChange = (value) => {
    if (value instanceof Date) {
      setSelectedDate(startOfDay(value));
    }
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const dayPosts = postsByDay.get(dayKey(date)) || [];
    if (!dayPosts.length) return null;

    return (
      <div className="flex items-center justify-center gap-0.5 mt-1">
        {dayPosts.slice(0, 3).map((post) => (
          <span
            key={post._id}
            className={`w-1.5 h-1.5 rounded-full ${
              post.status === 'posted'
                ? 'bg-emerald-500'
                : post.status === 'failed'
                ? 'bg-rose-500'
                : 'bg-[#5bc983]'
            }`}
          />
        ))}
        {dayPosts.length > 3 && (
          <span className="text-[8px] font-bold text-slate-400">
            +{dayPosts.length - 3}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1500px] mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-[#5bc983]" />
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">
              Calendar
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Your real scheduled and published posts from the backend.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/dashboard/new-post')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5bc983] hover:bg-[#4eb573] text-white text-sm font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 lg:p-6">
          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            tileContent={tileContent}
            locale="en-US"
            calendarType="gregory"
            showNeighboringMonth
            prev2Label={null}
            next2Label={null}
            className="social-calendar"
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 min-h-[400px]">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Selected day
              </p>
              <h2 className="text-lg font-extrabold text-slate-800 mt-1">
                {formatFullDate(selectedDate)}
              </h2>
            </div>

            {loading && (
              <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
            )}
          </div>

          {!loading && selectedPosts.length === 0 && (
            <div className="min-h-[280px] flex flex-col items-center justify-center text-center">
              <CalendarDays className="w-10 h-10 text-slate-200 mb-3" />
              <p className="text-sm font-semibold text-slate-600">
                No posts on this day
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Select another date or create a new post.
              </p>
            </div>
          )}

          {!loading && selectedPosts.length > 0 && (
            <div className="flex flex-col gap-3">
              {selectedPosts.map((post) => (
                <CalendarPost
                  key={post._id}
                  post={post}
                  onClick={() => {
                    if (post.status !== 'posted') {
                      navigate(`/edit-post?id=${encodeURIComponent(post._id)}`);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .social-calendar {
          width: 100%;
          border: 0;
          font-family: inherit;
          color: #334155;
        }

        .social-calendar .react-calendar__navigation {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 14px;
        }

        .social-calendar .react-calendar__navigation button {
          min-width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 0;
          background: #f8fafc;
          color: #334155;
          font-weight: 700;
        }

        .social-calendar .react-calendar__navigation button:hover,
        .social-calendar .react-calendar__navigation button:enabled:focus {
          background: #f1f5f9;
        }

        .social-calendar .react-calendar__navigation__label {
          flex: 1;
          background: white !important;
          font-size: 15px;
          color: #1e293b !important;
        }

        .social-calendar .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-size: 10px;
          font-weight: 800;
          color: #94a3b8;
          margin-bottom: 6px;
        }

        .social-calendar .react-calendar__month-view__weekdays abbr {
          text-decoration: none;
        }

        .social-calendar .react-calendar__tile {
          min-height: 72px;
          border: 1px solid #f1f5f9;
          border-radius: 10px;
          background: white;
          padding: 8px 5px;
          font-size: 12px;
          color: #475569;
          transition: 0.15s ease;
        }

        .social-calendar .react-calendar__tile:hover {
          background: #f8fafc;
        }

        .social-calendar .react-calendar__tile--now {
          background: #f0fdf4;
          color: #166534;
        }

        .social-calendar .react-calendar__tile--active {
          background: #5bc983 !important;
          color: white !important;
        }

        .social-calendar .react-calendar__tile--active:hover {
          background: #4eb573 !important;
        }

        .social-calendar .react-calendar__month-view__days__day--neighboringMonth {
          color: #cbd5e1;
        }

        @media (max-width: 640px) {
          .social-calendar .react-calendar__tile {
            min-height: 54px;
            padding: 6px 3px;
          }
        }
      `}</style>
    </div>
  );
}
