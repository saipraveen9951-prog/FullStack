import React from 'react';
import { CheckCircle2, ListTodo, AlertCircle, RefreshCw } from 'lucide-react';

export default function Header({ stats, fallbackMode, onRefresh, refreshLoading }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
      {/* Title & Branding */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl">
            <ListTodo className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 m-0">
            Todo Manager
          </h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          {fallbackMode ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Local Storage Mode
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Connected to API
            </span>
          )}
        </p>
      </div>

      {/* Header Quick Stats & Refresher */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <button
          onClick={onRefresh}
          disabled={refreshLoading}
          className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-50 rounded-xl transition-all duration-200 border border-slate-200"
          title="Refresh tasks from server"
        >
          <RefreshCw className={`h-4.5 w-4.5 ${refreshLoading ? 'animate-spin' : ''}`} />
        </button>

        {/* Small stats badges */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-white shadow-xs rounded-lg">
            <span>Total</span>
            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-800 rounded-md font-mono text-[11px]">
              {stats.total}
            </span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-brand-success" />
            <span className="font-mono text-slate-800">{stats.completed}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1">
            <AlertCircle className="h-3.5 w-3.5 text-brand-warning" />
            <span className="font-mono text-slate-800">{stats.pending}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
