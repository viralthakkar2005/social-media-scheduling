import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Plus,
  Video,
  Image as ImageIcon,
  FileText,
  Calendar as CalendarIcon,
  X,
  Clock,
  Edit3,
} from 'lucide-react';
import {
  YoutubeIcon,
  LinkedinIcon,
  InstagramIcon,
} from '../component/dashboard/SocialIcons';

// Structured sample data for October 2025 calendar
const INITIAL_POSTS = {
  'Sep 28': [
    {
      id: 'p1',
      time: '9:05 AM',
      type: 'video',
      caption: 'forgot I said this, but it\'s true',
      platforms: ['youtube', 'instagram'],
      extraCount: 1,
    },
    {
      id: 'p2',
      time: '11:04 AM',
      type: 'image',
      caption: 'DO these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 3,
    },
  ],
  'Sep 29': [
    {
      id: 'p3',
      time: '11:04 AM',
      type: 'video',
      caption: 'DO these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 3,
    },
    {
      id: 'p4',
      time: '11:55 AM',
      type: 'image',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'instagram'],
      extraCount: 2,
    },
  ],
  'Sep 30': [
    {
      id: 'p5',
      time: '11:04 AM',
      type: 'video',
      caption: 'DO these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 3,
    },
    {
      id: 'p6',
      time: '11:55 AM',
      type: 'image',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 1': [
    {
      id: 'p7',
      time: '11:00 AM',
      type: 'text',
      caption: 'as of today its been 1 year...',
      platforms: ['youtube', 'linkedin'],
      extraCount: 2,
    },
    {
      id: 'p8',
      time: '11:04 AM',
      type: 'video',
      caption: 'DO these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 3,
    },
  ],
  'Oct 2': [
    {
      id: 'p9',
      time: '11:55 AM',
      type: 'image',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 3': [
    {
      id: 'p10',
      time: '11:05 AM',
      type: 'text',
      caption: 'I always worry about money...',
      platforms: ['youtube', 'linkedin'],
      extraCount: 2,
    },
    {
      id: 'p11',
      time: '11:55 AM',
      type: 'image',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 4': [
    {
      id: 'p12',
      time: '10:55 AM',
      type: 'image',
      caption: 'things are getting real now, posted using...',
      platforms: ['youtube', 'linkedin'],
      extraCount: 2,
    },
    {
      id: 'p13',
      time: '11:55 AM',
      type: 'image',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 5': [
    {
      id: 'p14',
      time: '8:43 AM',
      type: 'image',
      caption: 'keepgoinggggg',
      platforms: ['youtube', 'linkedin'],
      extraCount: 2,
    },
    {
      id: 'p15',
      time: '11:55 AM',
      type: 'image',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 6': [
    {
      id: 'p16',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'instagram'],
      extraCount: 2,
    },
    {
      id: 'p17',
      time: '3:37 PM',
      type: 'video',
      caption: 'testing in prod, dom look at this',
      platforms: ['youtube', 'instagram', 'linkedin'],
      extraCount: 3,
    },
  ],
  'Oct 7': [
    {
      id: 'p18',
      time: '9:26 AM',
      type: 'image',
      caption: 'famous last words',
      platforms: ['youtube', 'linkedin'],
      extraCount: 2,
    },
    {
      id: 'p19',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 8': [
    {
      id: 'p20',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 9': [
    {
      id: 'p21',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 10': [
    {
      id: 'p22',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 11': [
    {
      id: 'p23',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 12': [
    {
      id: 'p24',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 13': [
    {
      id: 'p25',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 14': [
    {
      id: 'p26',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 15': [
    {
      id: 'p27',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 16': [
    {
      id: 'p28',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 17': [
    {
      id: 'p29',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 18': [
    {
      id: 'p30',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 19': [
    {
      id: 'p31',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 20': [
    {
      id: 'p32',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 21': [
    {
      id: 'p33',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 2,
    },
    {
      id: 'p34',
      time: '2:20 PM',
      type: 'video',
      caption: 'Caption here!',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 5,
    },
  ],
  'Oct 22': [
    {
      id: 'p35',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 23': [
    {
      id: 'p36',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 2,
    },
  ],
  'Oct 24': [
    {
      id: 'p37',
      time: '11:55 AM',
      type: 'video',
      caption: 'TRY these hobbies and 1000...',
      platforms: ['youtube', 'linkedin', 'instagram'],
      extraCount: 2,
    },
  ],
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// October 2025 Calendar dates layout (35 days matrix matching screenshot)
const CALENDAR_GRID = [
  'Sep 28', 'Sep 29', 'Sep 30', 'Oct 1', 'Oct 2', 'Oct 3', 'Oct 4',
  'Oct 5', 'Oct 6', 'Oct 7', 'Oct 8', 'Oct 9', 'Oct 10', 'Oct 11',
  'Oct 12', 'Oct 13', 'Oct 14', 'Oct 15', 'Oct 16', 'Oct 17', 'Oct 18',
  'Oct 19', 'Oct 20', 'Oct 21', 'Oct 22', 'Oct 23', 'Oct 24', 'Oct 25',
  'Oct 26', 'Oct 27', 'Oct 28', 'Oct 29', 'Oct 30', 'Oct 31', 'Nov 1'
];

export default function CalendarPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // October 2025
  const [viewMode, setViewMode] = useState('Month'); // 'Month' or 'Week'
  const [highlightedDayKey, setHighlightedDayKey] = useState('Oct 10'); // Highlighted date key
  const [postsData, setPostsData] = useState(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState(null);

  // Format month and year label for header e.g. "October 2025"
  const currentDateLabel = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    if (viewMode === 'Month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      // Prev week
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(currentDate.getDate() - 7);
      setCurrentDate(prevWeek);
    }
  };

  const handleNextMonth = () => {
    if (viewMode === 'Month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      // Next week
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(currentDate.getDate() + 7);
      setCurrentDate(nextWeek);
    }
  };

  // Generate calendar grid cells dynamically
  const generateCalendarCells = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    if (viewMode === 'Week') {
      // Find Sunday of the current week
      const dayOfWeek = currentDate.getDay();
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

      const cells = [];
      for (let i = 0; i < 7; i++) {
        const cellDate = new Date(startOfWeek);
        cellDate.setDate(startOfWeek.getDate() + i);

        const monthShort = cellDate.toLocaleDateString('en-US', { month: 'short' });
        const dayNum = cellDate.getDate();
        const dateLabel = `${monthShort} ${dayNum}`;

        cells.push({
          date: cellDate,
          dateLabel,
          isCurrentMonth: cellDate.getMonth() === month,
        });
      }
      return cells;
    }

    // Month view: 35 cells (5 rows x 7 days)
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sun

    const startDate = new Date(year, month, 1 - startingDayOfWeek);

    const cells = [];
    for (let i = 0; i < 35; i++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + i);

      const monthShort = cellDate.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = cellDate.getDate();
      const dateLabel = `${monthShort} ${dayNum}`;

      cells.push({
        date: cellDate,
        dateLabel,
        isCurrentMonth: cellDate.getMonth() === month,
      });
    }
    return cells;
  };

  const calendarCells = generateCalendarCells();

  const renderPlatformIcons = (platforms, extraCount) => {
    return (
      <div className="flex items-center -space-x-1 flex-shrink-0">
        {platforms.includes('youtube') && (
          <span className="w-4 h-4 rounded-full bg-[#FF0000] text-white flex items-center justify-center text-[9px] shadow-2xs border border-white">
            <YoutubeIcon className="w-2.5 h-2.5" />
          </span>
        )}
        {platforms.includes('linkedin') && (
          <span className="w-4 h-4 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-[9px] shadow-2xs border border-white">
            <LinkedinIcon className="w-2.5 h-2.5" />
          </span>
        )}
        {platforms.includes('instagram') && (
          <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-[9px] shadow-2xs border border-white">
            <InstagramIcon className="w-2.5 h-2.5" />
          </span>
        )}
        {extraCount > 0 && (
          <span className="text-[10px] text-slate-500 font-semibold ml-1 pl-0.5">
            +{extraCount}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto font-sans">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#1e293b] tracking-tight">
            Calendar
          </h1>
          <button
            title="Calendar Information"
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>



        {/* View Mode Toggle (Month / Week) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-start md:self-auto">
          <button
            onClick={() => setViewMode('Month')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'Month'
                ? 'bg-[#5bc983] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Month</span>
          </button>
          <button
            onClick={() => setViewMode('Week')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'Week'
                ? 'bg-[#5bc983] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Week</span>
          </button>
        </div>
      </div>

      {/* CALENDAR CONTAINER TABLE / GRID */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* DAYS OF WEEK HEADER */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50 text-center py-2.5 text-xs font-bold text-slate-600">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* DAYS GRID */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-200/80 bg-slate-100/30">
          {calendarCells.map((cell) => {
            const dateStr = cell.dateLabel;
            const posts = postsData[dateStr] || [];
            const isHighlighted = dateStr === highlightedDayKey;

            return (
              <div
                key={dateStr}
                className={`min-h-[135px] lg:min-h-[155px] p-2 flex flex-col justify-between transition-colors relative group ${
                  cell.isCurrentMonth ? 'bg-white' : 'bg-slate-50/40 opacity-70'
                } hover:bg-slate-50/80 ${
                  isHighlighted ? 'bg-emerald-50/40 ring-1 ring-[#5bc983] inset-0 z-10' : ''
                }`}
              >
                {/* Date Header Banner */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    onClick={() => setHighlightedDayKey(dateStr)}
                    className={`text-xs font-medium cursor-pointer transition-colors ${
                      isHighlighted
                        ? 'bg-[#5bc983] text-white px-2 py-0.5 rounded-md font-bold shadow-2xs'
                        : cell.isCurrentMonth
                        ? 'text-slate-700 hover:text-slate-900 font-medium'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {dateStr}
                  </span>

                  {/* Quick Add Post Button on Day Hover */}
                  <button
                    onClick={() => navigate('/new-post')}
                    title={`Create new post for ${dateStr}`}
                    className="opacity-0 group-hover:opacity-100 bg-[#5bc983] text-white w-4 h-4 rounded-md flex items-center justify-center text-xs shadow-2xs hover:bg-[#4eb573] transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </button>
                </div>

                {/* Scheduled Posts Stack */}
                <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
                  {posts.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-xs text-slate-300 font-medium italic select-none">
                      No posts
                    </div>
                  ) : (
                    posts.slice(0, 2).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPost({ ...p, date: dateStr })}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200/70 rounded-xl p-1.5 flex flex-col gap-1 text-[11px] cursor-pointer transition-all shadow-2xs hover:shadow-xs group/card"
                      >
                        {/* Time & Media Format Icon */}
                        <div className="flex items-center justify-between text-slate-400 font-medium text-[10px]">
                          <span>{p.time}</span>
                          {p.type === 'video' && <Video className="w-3 h-3 text-slate-400" />}
                          {p.type === 'image' && <ImageIcon className="w-3 h-3 text-slate-400" />}
                          {p.type === 'text' && <FileText className="w-3 h-3 text-slate-400" />}
                        </div>

                        {/* Platforms Row + Snippet */}
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          {renderPlatformIcons(p.platforms, p.extraCount)}
                          <span className="text-slate-700 font-medium truncate text-[11px]">
                            {p.caption}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* More Posts Count Footer Indicator */}
                {posts.length > 2 && (
                  <button
                    onClick={() => setHighlightedDayKey(dateStr)}
                    className="mt-1 text-[10px] font-semibold text-slate-400 hover:text-slate-700 text-center w-full cursor-pointer py-0.5"
                  >
                    +{posts.length - 2} more
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* POST PREVIEW MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5bc983]" />
                <h3 className="text-base font-bold text-slate-800">
                  Scheduled for {selectedPost.date} at {selectedPost.time}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-sm text-slate-700">
              <p className="font-medium">{selectedPost.caption}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Target Channels:
              </span>
              <div className="flex items-center gap-2">
                {renderPlatformIcons(selectedPost.platforms, selectedPost.extraCount)}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  const params = new URLSearchParams({
                    id: selectedPost.id || 'p1',
                    date: selectedPost.date || 'Oct 10',
                    time: selectedPost.time || '11:00 AM',
                    caption: selectedPost.caption || '',
                    type: selectedPost.type || 'image',
                    platforms: (selectedPost.platforms || []).join(','),
                  });
                  navigate(`/edit-post?${params.toString()}`);
                  setSelectedPost(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#5bc983] hover:bg-[#4eb573] transition-colors cursor-pointer shadow-2xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



