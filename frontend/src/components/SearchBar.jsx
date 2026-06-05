import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="h-4.5 w-4.5" />
      </div>
      
      {/* Search Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks..."
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 focus:border-brand-primary focus:ring-4 focus:ring-indigo-100 rounded-xl shadow-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200 text-sm"
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-150"
          title="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
