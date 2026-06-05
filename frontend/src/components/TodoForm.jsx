import React, { useState } from 'react';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { VALIDATION_MESSAGES } from '../utils/constants';

export default function TodoForm({ onAdd, actionLoading, existingTodos }) {
  const [title, setTitle] = useState('');
  const [inlineError, setInlineError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setInlineError(VALIDATION_MESSAGES.REQUIRED_TITLE);
      return;
    }

    // Client-side duplication validation
    const isDuplicate = existingTodos.some(
      (todo) => todo.title.toLowerCase() === trimmed.toLowerCase() && !todo.completed
    );
    if (isDuplicate) {
      setInlineError(VALIDATION_MESSAGES.DUPLICATE_TITLE);
      return;
    }

    setInlineError('');
    
    // Call custom hook trigger
    const success = await onAdd(trimmed);
    if (success) {
      setTitle('');
    }
  };

  const handleChange = (e) => {
    setTitle(e.target.value);
    if (inlineError) {
      setInlineError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={title}
              onChange={handleChange}
              disabled={actionLoading}
              placeholder="What needs to be done?"
              className={`w-full px-4.5 py-3 bg-white border ${
                inlineError
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
                  : 'border-slate-200 focus:border-brand-primary focus:ring-indigo-100'
              } rounded-xl shadow-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-200 disabled:opacity-60 text-sm`}
            />
          </div>

          <button
            type="submit"
            disabled={actionLoading}
            className="px-5 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed select-none text-sm"
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4.5 w-4.5" />
            )}
            <span>Add Task</span>
          </button>
        </div>

        {/* Validation message element */}
        {inlineError && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium px-1 animate-shake">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{inlineError}</span>
          </div>
        )}
      </div>
    </form>
  );
}
