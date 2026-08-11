import React from 'react';
import { List } from 'lucide-react';

export default function PostsList() {
  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <List className="w-8 h-8 text-[#5bc983]" />
        <h1 className="text-3xl font-bold text-[#1e293b]">All Posts</h1>
      </div>
      <p className="text-slate-500 mb-8">Manage all drafts, scheduled, and published posts.</p>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 min-h-[300px] flex flex-col items-center justify-center">
        <List className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-lg font-medium text-slate-700">Posts Overview</p>
        <p className="text-sm text-slate-400 mt-1 max-w-md">
          Filter, search, and manage your posts across drafts, scheduled, and posted history.
        </p>
      </div>
    </div>
  );
}
