import React from 'react';
import { Clock } from 'lucide-react';

export default function Scheduled() {
  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Clock className="w-8 h-8 text-[#5bc983]" />
        <h1 className="text-3xl font-bold text-[#1e293b]">Scheduled Posts</h1>
      </div>
      <p className="text-slate-500 mb-8">Posts queued for automatic publication across your channels.</p>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 min-h-[300px] flex flex-col items-center justify-center">
        <Clock className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-lg font-medium text-slate-700">Scheduled Queue</p>
        <p className="text-sm text-slate-400 mt-1 max-w-md">
          Review upcoming scheduled content and check publication timestamps.
        </p>
      </div>
    </div>
  );
}
