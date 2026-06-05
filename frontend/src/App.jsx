import React, { useState } from 'react';
import Header from './components/Header';
import Statistics from './components/Statistics';
import TodoForm from './components/TodoForm';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import TodoList from './components/TodoList';
import ConfirmDialog from './components/ConfirmDialog';
import { useTodos } from './hooks/useTodos';
import { TOAST_TYPES } from './utils/constants';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function App() {
  const [toasts, setToasts] = useState([]);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Custom Toast Trigger
  const addToast = (message, type = TOAST_TYPES.SUCCESS) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Bind Todo Manager Hook
  const {
    filteredTodos,
    loading,
    actionLoading,
    fallbackMode,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    stats,
    addTodo,
    toggleTodoStatus,
    updateTodo,
    deleteTodo,
    refreshTodos,
  } = useTodos(addToast);

  // Delete handlers
  const handleDeleteTrigger = (id) => {
    setDeleteTargetId(id);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      const success = await deleteTodo(deleteTargetId);
      if (success) {
        setDialogOpen(false);
        setDeleteTargetId(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDialogOpen(false);
    setDeleteTargetId(null);
  };

  // Get toast styles
  const getToastStyles = (type) => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return {
          bg: 'bg-white border-emerald-200 text-slate-800 shadow-lg',
          icon: <CheckCircle2 className="h-5 w-5 text-brand-success" />,
        };
      case TOAST_TYPES.ERROR:
        return {
          bg: 'bg-white border-rose-200 text-slate-800 shadow-lg',
          icon: <AlertCircle className="h-5 w-5 text-brand-danger" />,
        };
      case TOAST_TYPES.WARNING:
        return {
          bg: 'bg-white border-amber-200 text-slate-800 shadow-lg',
          icon: <AlertTriangle className="h-5 w-5 text-brand-warning animate-pulse" />,
        };
      case TOAST_TYPES.INFO:
      default:
        return {
          bg: 'bg-white border-sky-200 text-slate-800 shadow-lg',
          icon: <Info className="h-5 w-5 text-blue-500" />,
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col gap-6.5">
        
        {/* Header Section */}
        <Header
          stats={stats}
          fallbackMode={fallbackMode}
          onRefresh={refreshTodos}
          refreshLoading={loading}
        />

        {/* Metric Cards Dashboard */}
        <Statistics stats={stats} />

        {/* Main Workspace Card Grid */}
        <main className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-premium flex flex-col gap-6">
          
          {/* Add Todo Block */}
          <div>
            <h2 className="text-sm font-bold text-slate-700 tracking-wide uppercase mb-3">
              Add New Task
            </h2>
            <TodoForm
              onAdd={addTodo}
              actionLoading={actionLoading}
              existingTodos={filteredTodos}
            />
          </div>

          <hr className="border-slate-100" />

          {/* Filtering & Searching Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full md:max-w-xs">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            
            <FilterBar
              activeFilter={filter}
              onChange={setFilter}
              stats={stats}
            />
          </div>

          {/* Task List Grid Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-slate-700 tracking-wide uppercase">
              Task Workspace
            </h2>
            <TodoList
              todos={filteredTodos}
              loading={loading}
              onToggle={toggleTodoStatus}
              onUpdate={updateTodo}
              onDeleteTrigger={handleDeleteTrigger}
            />
          </div>

        </main>
      </div>

      {/* Confirmation Dialog Modal */}
      <ConfirmDialog
        isOpen={dialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        actionLoading={actionLoading}
      />

      {/* Stacked Toast Notifications overlay */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className={`flex items-start justify-between gap-3 p-3.5 border rounded-xl animate-slide-in select-none ${styles.bg}`}
              role="alert"
            >
              <div className="flex gap-2.5 items-start">
                <div className="shrink-0 mt-0.5">{styles.icon}</div>
                <p className="text-xs font-semibold text-slate-700 leading-snug">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
