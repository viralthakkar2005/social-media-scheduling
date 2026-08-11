import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Posted() {
  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <CheckCircle2 className="w-8 h-8 text-[#5bc983]" />
        <h1 className="text-3xl font-bold text-[#1e293b]">Posted History</h1>
      </div>
      <p className="text-slate-500 mb-8">History of successfully published posts across your social platforms.</p>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 min-h-[300px] flex flex-col items-center justify-center">
        <CheckCircle2 className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-lg font-medium text-slate-700">Publication History</p>
        <p className="text-sm text-slate-400 mt-1 max-w-md">
          Track published posts, engagement links, and cross-platform performance metrics.
        </p>
      </div>
    </div>
  );
}
