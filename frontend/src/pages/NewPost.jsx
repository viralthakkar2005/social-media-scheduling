import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Info,
  Image as ImageIcon,
  Video as VideoIcon,
  AlignLeft,
} from 'lucide-react';
import {
  YoutubeIcon,
  LinkedinIcon,
  InstagramIcon,
} from '../component/dashboard/SocialIcons';

export default function NewPost() {
  const navigate = useNavigate();
  const [selectedFormat, setSelectedFormat] = useState('image'); // 'text', 'image', 'video'

  return (
    <div className="p-8 lg:p-12 flex flex-col justify-between min-h-screen max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1e293b] tracking-tight">
              Create a new post
            </h1>
            <p className="text-slate-500 text-sm lg:text-base mt-2">
              Select a post format to compose and cross-post natively across{' '}
              <strong className="text-slate-800 font-semibold">YouTube</strong>,{' '}
              <strong className="text-slate-800 font-semibold">LinkedIn</strong>, and{' '}
              <strong className="text-slate-800 font-semibold">Instagram</strong>.
            </p>
          </div>

          
        </div>

        {/* Cards Grid (3 Post Format Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* CARD 1: TEXT POST */}
          <div
            onClick={() => setSelectedFormat('text')}
            className={`group cursor-pointer rounded-2xl p-8 flex flex-col items-center text-center justify-between min-h-[360px] transition-all bg-white ${
              selectedFormat === 'text'
                ? 'border-2 border-[#5bc983] bg-[#f0fdf4] shadow-xs'
                : 'border-2 border-dashed border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col items-center w-full">
              {/* Icon Box */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  selectedFormat === 'text'
                    ? 'bg-white text-[#5bc983] shadow-xs'
                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200/70'
                }`}
              >
                <AlignLeft className="w-7 h-7 stroke-[2]" />
              </div>

              <h3 className="text-xl font-bold text-slate-900">Text Post</h3>
              <p className="text-sm text-slate-500 mt-1">
                Short status updates & articles
              </p>

              <button
                type="button"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#5bc983] hover:underline"
              >
                <span>Create Text Post</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Supported Platforms at bottom */}
            <div className="w-full pt-6 border-t border-slate-100/60 flex items-center justify-center gap-2 mt-6">
              <span className="w-6 h-6 rounded-md bg-[#0A66C2] text-white flex items-center justify-center" title="LinkedIn">
                <LinkedinIcon className="w-3.5 h-3.5" />
              </span>
             
            </div>
          </div>

          {/* CARD 2: IMAGE POST */}
          <div
            onClick={() => setSelectedFormat('image')}
            className={`group cursor-pointer rounded-2xl p-8 flex flex-col items-center text-center justify-between min-h-[360px] transition-all ${
              selectedFormat === 'image'
                ? 'border-2 border-[#5bc983] bg-[#f0fdf4] shadow-xs'
                : 'border-2 border-dashed border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex flex-col items-center w-full">
              {/* Icon Box */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  selectedFormat === 'image'
                    ? 'bg-white text-[#5bc983] shadow-xs'
                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200/70'
                }`}
              >
                <ImageIcon className="w-7 h-7 stroke-[2]" />
              </div>

              <h3 className="text-xl font-bold text-slate-900">Image Post</h3>
              <p className="text-sm text-slate-500 mt-1">
                Single or carousel photo posts
              </p>

              <button
                type="button"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#5bc983] hover:underline"
              >
                <span>Create Image Post</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Supported Platforms at bottom */}
            <div className="w-full pt-6 border-t border-slate-100/60 flex items-center justify-center gap-2 mt-6">
              <span className="w-6 h-6 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center" title="Instagram">
                <InstagramIcon className="w-3.5 h-3.5" />
              </span>
              <span className="w-6 h-6 rounded-md bg-[#0A66C2] text-white flex items-center justify-center" title="LinkedIn">
                <LinkedinIcon className="w-3.5 h-3.5" />
              </span>
              <span className="w-6 h-6 rounded-md bg-[#FF0000] text-white flex items-center justify-center" title="YouTube">
                <YoutubeIcon className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* CARD 3: VIDEO POST */}
          <div
            onClick={() => setSelectedFormat('video')}
            className={`group cursor-pointer rounded-2xl p-8 flex flex-col items-center text-center justify-between min-h-[360px] transition-all bg-white ${
              selectedFormat === 'video'
                ? 'border-2 border-[#5bc983] bg-[#f0fdf4] shadow-xs'
                : 'border-2 border-dashed border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col items-center w-full">
              {/* Icon Box */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  selectedFormat === 'video'
                    ? 'bg-white text-[#5bc983] shadow-xs'
                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200/70'
                }`}
              >
                <VideoIcon className="w-7 h-7 stroke-[2]" />
              </div>

              <h3 className="text-xl font-bold text-slate-900">Video Post</h3>
              <p className="text-sm text-slate-500 mt-1">
                YouTube Shorts, Reels, & Videos
              </p>

              <button
                type="button"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#5bc983] hover:underline"
              >
                <span>Create Video Post</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Supported Platforms at bottom */}
            <div className="w-full pt-6 border-t border-slate-100/60 flex items-center justify-center gap-2 mt-6">
              <span className="w-6 h-6 rounded-md bg-[#FF0000] text-white flex items-center justify-center" title="YouTube">
                <YoutubeIcon className="w-3.5 h-3.5" />
              </span>
              <span className="w-6 h-6 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center" title="Instagram">
                <InstagramIcon className="w-3.5 h-3.5" />
              </span>
              <span className="w-6 h-6 rounded-md bg-[#0A66C2] text-white flex items-center justify-center" title="LinkedIn">
                <LinkedinIcon className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CONFIGURATION ALERT BANNER */}
      <div className="mt-12 bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3 shadow-xs text-sm text-slate-600">
        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#5bc983] flex-shrink-0">
          <Info className="w-4 h-4 stroke-[2.5]" />
        </div>
        <p>
          Looking to configure your platform settings? You can manage connected channels{' '}
          <Link
            to="/connections"
            className="font-semibold text-slate-900 underline hover:text-[#5bc983] transition-colors"
          >
            here
          </Link>
        </p>
      </div>
    </div>
  );
}
