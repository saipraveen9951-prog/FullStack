import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { VALIDATION_MESSAGES } from '../utils/constants';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, actionLoading }) {
  const modalRef = useRef(null);

  // Lock scrolling, hook escape key, and set focus when open
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // Check if click was on the outer overlay container
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-slide-in"
    >
      <div
        ref={modalRef}
        className="bg-white border border-slate-100 w-full max-w-md rounded-2xl shadow-xl p-5 relative transition-all duration-300 transform scale-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={actionLoading}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Modal Info */}
        <div className="flex gap-4 items-start pr-6">
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 id="modal-title" className="text-base font-bold text-slate-900 leading-tight">
              Delete Task
            </h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              {VALIDATION_MESSAGES.DELETE_CONFIRM}
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-2.5 mt-6 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer select-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={actionLoading}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 rounded-xl shadow-xs transition-all cursor-pointer select-none"
          >
            {actionLoading ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
