import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Skeleton Card showing loading state placeholder.
 */
export function SkeletonCard() {
  return (
    <div className="shimmer-wrapper bg-white border border-slate-100 rounded-2xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 flex-1 w-full">
        {/* Mock Checkbox */}
        <div className="h-5.5 w-5.5 rounded-lg bg-slate-200 shrink-0"></div>
        {/* Mock Title Lines */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
          <div className="flex gap-2">
            <div className="h-3 bg-slate-100 rounded-md w-1/4"></div>
            <div className="h-3 bg-slate-100 rounded-md w-12"></div>
          </div>
        </div>
      </div>
      {/* Mock Actions */}
      <div className="flex gap-1.5 self-end md:self-center">
        <div className="h-7 w-7 rounded-lg bg-slate-200"></div>
        <div className="h-7 w-7 rounded-lg bg-slate-200"></div>
      </div>
    </div>
  );
}

/**
 * Centered spinner for modal loads or general saves.
 */
export function Spinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Loader2 className="h-7 w-7 animate-spin text-brand-primary" />
      <span className="text-sm font-semibold text-slate-500">{message}</span>
    </div>
  );
}

/**
 * Default component exports a grid list of SkeletonCards
 */
export default function Loader({ count = 3 }) {
  return (
    <div className="flex flex-col gap-3.5 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}
