import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Save,
  Trash2,
  Check,
} from 'lucide-react';
import {
  YoutubeIcon,
  LinkedinIcon,
  InstagramIcon,
} from '../component/dashboard/SocialIcons';

function parseToDateInput(dateStr) {
  if (!dateStr) return '2025-10-10';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  const months = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
  const parts = dateStr.replace(',', '').trim().split(/\s+/);
  if (parts.length >= 2) {
    const monthKey = parts[0].toLowerCase().slice(0, 3);
    const m = months[monthKey] || '10';
    const d = parts[1].padStart(2, '0');
    const y = parts[2] || '2025';
    return `${y}-${m}-${d}`;
  }
  return '2025-10-10';
}

function parseToTimeInput(timeStr) {
  if (!timeStr) return '11:55';
  if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = match[3] ? match[3].toUpperCase() : null;
    
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }
  return '11:55';
}

export default function EditPost() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialId = searchParams.get('id') || 'p1';
  const initialDate = searchParams.get('date') || 'Oct 10';
  const initialTime = searchParams.get('time') || '11:55 AM';
  const initialCaption = searchParams.get('caption') || 'TRY these hobbies and 1000...';
  const rawPlatforms = searchParams.get('platforms') || 'youtube,linkedin,instagram';
  const initialPlatforms = rawPlatforms.split(',').filter(Boolean);

  const [caption, setCaption] = useState(initialCaption);
  const [date, setDate] = useState(() => parseToDateInput(initialDate));
  const [time, setTime] = useState(() => parseToTimeInput(initialTime));
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    initialPlatforms.length > 0 ? initialPlatforms : ['youtube', 'linkedin', 'instagram']
  );
  const [toastMessage, setToastMessage] = useState('');

  const togglePlatform = (p) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length === 1) return; // keep at least 1
      setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setToastMessage('Post changes saved successfully!');
    setTimeout(() => {
      navigate('/calendar');
    }, 1200);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setToastMessage('Post deleted');
      setTimeout(() => {
        navigate('/calendar');
      }, 1000);
    }
  };

  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto font-sans">
      {/* Top Header / Back Button */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Calendar</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDelete}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Post</span>
          </button>
        </div>
      </div>

      {/* Main Card Editor */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-2xs">
        <div className="border-b border-slate-100 pb-5 mb-6">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Edit Scheduled Post
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Update your scheduled post content, timing, and cross-platform publishing settings.
          </p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* Post Caption Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Post Caption / Content
            </label>
            <textarea
              rows={5}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your post content here..."
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5bc983] text-sm text-slate-800 leading-relaxed"
            />
          </div>

          {/* Schedule Date & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Scheduled Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5bc983] text-sm text-slate-800 font-medium cursor-pointer shadow-2xs"
                />
                <CalendarIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Scheduled Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5bc983] text-sm text-slate-800 font-medium cursor-pointer shadow-2xs"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Target Social Channels */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Publish to Channels
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* YouTube */}
              <div
                onClick={() => togglePlatform('youtube')}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  selectedPlatforms.includes('youtube')
                    ? 'border-[#FF0000] bg-rose-50/40 text-slate-800 ring-1 ring-[#FF0000]'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-[#FF0000] text-white flex items-center justify-center">
                    <YoutubeIcon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-sm font-bold">YouTube</span>
                </div>
                {selectedPlatforms.includes('youtube') && (
                  <Check className="w-4 h-4 text-[#FF0000] stroke-[3]" />
                )}
              </div>

              {/* LinkedIn */}
              <div
                onClick={() => togglePlatform('linkedin')}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  selectedPlatforms.includes('linkedin')
                    ? 'border-[#0A66C2] bg-blue-50/40 text-slate-800 ring-1 ring-[#0A66C2]'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-[#0A66C2] text-white flex items-center justify-center">
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-sm font-bold">LinkedIn</span>
                </div>
                {selectedPlatforms.includes('linkedin') && (
                  <Check className="w-4 h-4 text-[#0A66C2] stroke-[3]" />
                )}
              </div>

              {/* Instagram */}
              <div
                onClick={() => togglePlatform('instagram')}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  selectedPlatforms.includes('instagram')
                    ? 'border-purple-500 bg-purple-50/40 text-slate-800 ring-1 ring-purple-500'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center">
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-sm font-bold">Instagram</span>
                </div>
                {selectedPlatforms.includes('instagram') && (
                  <Check className="w-4 h-4 text-purple-600 stroke-[3]" />
                )}
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/calendar')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#5bc983] hover:bg-[#4eb573] text-white text-sm font-bold shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-[#5bc983]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
