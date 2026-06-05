import React from 'react';
import { ClipboardList, Sparkles } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 py-16 bg-white border border-slate-100 rounded-2xl shadow-premium">
      {/* Icon Frame */}
      <div className="relative mb-6">
        <div className="p-4 bg-slate-50 border border-slate-200/50 text-slate-400 rounded-2xl">
          <ClipboardList className="h-10 w-10 stroke-[1.5]" />
        </div>
        <div className="absolute -top-1 -right-1 p-1 bg-indigo-50 border border-indigo-100 text-brand-primary rounded-lg">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
        </div>
      </div>

      {/* Message and instructions */}
      <h3 className="text-base font-bold text-slate-800 tracking-tight">
        No tasks available
      </h3>
      <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
        Create your first task to get started
      </p>
    </div>
  );
}
