import React from 'react';
import { FILTERS } from '../utils/constants';

export default function FilterBar({ activeFilter, onChange, stats }) {
  const filterTabs = [
    {
      id: FILTERS.ALL,
      label: 'All Tasks',
      count: stats.total,
    },
    {
      id: FILTERS.PENDING,
      label: 'Pending',
      count: stats.pending,
    },
    {
      id: FILTERS.COMPLETED,
      label: 'Completed',
      count: stats.completed,
    },
  ];

  return (
    <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto self-start">
      <div className="flex w-full sm:w-auto gap-0.5">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all duration-200 select-none ${
                isActive
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/10'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'bg-slate-200/60 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
