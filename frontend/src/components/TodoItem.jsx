import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, Check, X, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { VALIDATION_MESSAGES } from '../utils/constants';

export default function TodoItem({ todo, onToggle, onUpdate, onDeleteTrigger, existingTodos }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [inlineError, setInlineError] = useState('');
  const editInputRef = useRef(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
      setInlineError('');
    }
  }, [isEditing]);

  const handleToggle = () => {
    // Don't toggle while editing
    if (!isEditing) {
      onToggle(todo.id, todo.completed);
    }
  };

  const handleStartEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  const handleCancelEdit = (e) => {
    if (e) e.stopPropagation();
    setIsEditing(false);
    setEditTitle(todo.title);
    setInlineError('');
  };

  const handleSaveEdit = async (e) => {
    if (e) e.stopPropagation();
    const trimmed = editTitle.trim();

    if (!trimmed) {
      setInlineError(VALIDATION_MESSAGES.REQUIRED_TITLE);
      return;
    }

    // Check duplicate among pending tasks (excluding itself)
    const isDuplicate = existingTodos.some(
      (t) =>
        t.id !== todo.id &&
        t.title.toLowerCase() === trimmed.toLowerCase() &&
        !t.completed
    );

    if (isDuplicate) {
      setInlineError(VALIDATION_MESSAGES.DUPLICATE_TITLE);
      return;
    }

    setInlineError('');
    const success = await onUpdate(todo.id, trimmed);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Format Date beautifully: "Jun 6, 2026, 12:00 AM"
  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div
      className={`group relative bg-white border ${
        todo.completed ? 'border-slate-100 bg-slate-50/50' : 'border-slate-200/80 shadow-xs'
      } rounded-2xl p-4.5 hover:shadow-premium hover:border-slate-300 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4`}
    >
      {/* Task Content / Checkbox / Title Edit */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Toggle Checkbox */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={isEditing}
          className={`mt-0.5 h-5.5 w-5.5 shrink-0 rounded-lg border flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 ${
            todo.completed
              ? 'bg-brand-success border-brand-success text-white'
              : 'border-slate-300 bg-white hover:border-brand-primary'
          } ${isEditing ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {todo.completed && <Check className="h-4 w-4 stroke-[3px]" />}
        </button>

        {/* Text Area */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex flex-col gap-1.5 w-full">
              <input
                ref={editInputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full px-3 py-1.5 text-sm bg-white border ${
                  inlineError ? 'border-rose-400 focus:ring-rose-100' : 'border-brand-primary focus:ring-indigo-100'
                } rounded-lg focus:outline-none focus:ring-4 transition-all duration-150 text-slate-800`}
                placeholder="Task title..."
              />
              {inlineError && (
                <div className="flex items-center gap-1 text-[11px] text-rose-600 font-semibold px-0.5 animate-shake">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{inlineError}</span>
                </div>
              )}
            </div>
          ) : (
            <span
              onClick={handleToggle}
              className={`block text-sm font-medium leading-relaxed break-words cursor-pointer select-none transition-colors duration-200 ${
                todo.completed
                  ? 'text-slate-400 line-through decoration-slate-300/80'
                  : 'text-slate-800'
              }`}
            >
              {todo.title}
            </span>
          )}

          {/* Meta details (Date / Status Badge for mobile) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(todo.createdAt || todo.date)}</span>
            </span>

            {/* Completed/Pending badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                todo.completed
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}
            >
              {todo.completed ? (
                <>
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  Completed
                </>
              ) : (
                <>
                  <AlertCircle className="h-2.5 w-2.5 animate-pulse" />
                  Pending
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Item Action Controls */}
      <div className="flex items-center gap-1.5 md:self-center self-end shrink-0">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-lg transition-colors cursor-pointer"
              title="Save changes"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1.5 text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Cancel editing"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleStartEdit}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg transition-all duration-200 opacity-100 md:opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Edit task"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTrigger(todo.id);
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-all duration-200 opacity-100 md:opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
