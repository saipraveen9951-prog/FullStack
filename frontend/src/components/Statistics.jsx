import React from 'react';
import { Layers, CheckCircle2, CircleAlert, Percent } from 'lucide-react';

export default function Statistics({ stats }) {
  const cards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      description: 'All registered tasks',
      icon: Layers,
      colorClass: 'text-violet-600 bg-violet-50 border-violet-100',
    },
    {
      title: 'Completed',
      value: stats.completed,
      description: 'Tasks checked off',
      icon: CheckCircle2,
      colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Pending',
      value: stats.pending,
      description: 'Awaiting completion',
      icon: CircleAlert,
      colorClass: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      description: 'Overall progress',
      icon: Percent,
      colorClass: 'text-blue-600 bg-blue-50 border-blue-100',
      isProgress: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-semibold text-slate-500 tracking-wide uppercase">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.colorClass}`}>
                <IconComponent className="h-4.5 w-4.5" />
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {card.value}
              </div>
              <p className="text-xs text-slate-400 mt-1">{card.description}</p>
              
              {/* If it's the progress card, display a completion progress bar */}
              {card.isProgress && (
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${stats.completionRate}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
