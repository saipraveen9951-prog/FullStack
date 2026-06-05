import { useState, useEffect, useMemo } from 'react';
import { todoService } from '../services/todoService';
import { FILTERS, LOCAL_STORAGE_KEY, DEBOUNCE_DELAY, TOAST_TYPES, VALIDATION_MESSAGES } from '../utils/constants';

// Helper to get local storage tasks or return defaults
const getLocalStorageTasks = () => {
  try {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
      return JSON.parse(localData);
    }
  } catch (e) {
    console.error('Failed to parse local storage tasks', e);
  }
  
  // Default preview items for high-fidelity empty states
  const now = new Date();
  return [
    {
      id: 'local-1',
      title: '👋 Welcome to Todo Manager! Start by adding a task below',
      completed: false,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: 'local-2',
      title: '✨ Edit a task inline using the edit action button',
      completed: false,
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    },
    {
      id: 'local-3',
      title: '🚀 Connect a backend server running at http://localhost:5000',
      completed: false,
      createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    },
    {
      id: 'local-4',
      title: '✅ Completed items will display with a strike-through and badge',
      completed: true,
      createdAt: new Date(now.getTime() - 10 * 60 * 1000).toISOString(), // 10 mins ago
    }
  ];
};

// Helper to save to local storage
const saveLocalStorageTasks = (tasks) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to local storage', e);
  }
};

export function useTodos(addToast) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter and Search States
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // Fallback mode tracks if we are offline and using LocalStorage
  const [fallbackMode, setFallbackMode] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Initial load
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await todoService.getAll();
      // Ensure backend array format
      const sortedData = Array.isArray(data) ? data : [];
      // Sort: newest first
      sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTodos(sortedData);
      setFallbackMode(false);
    } catch (err) {
      console.warn('Backend server offline or error. Switching to Local Storage fallback.', err);
      const localTasks = getLocalStorageTasks();
      // Sort newest first
      localTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTodos(localTasks);
      setFallbackMode(true);
      setError('Backend API is offline. Running in Local Storage preview mode.');
      if (addToast) {
        addToast('Connected via Local Storage (Backend Offline)', TOAST_TYPES.WARNING);
      }
    } finally {
      setLoading(false);
    }
  };

  // Synchronize with Local Storage in fallback mode
  useEffect(() => {
    if (fallbackMode && !loading) {
      saveLocalStorageTasks(todos);
    }
  }, [todos, fallbackMode, loading]);

  // Create Todo
  const addTodo = async (title) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      if (addToast) addToast(VALIDATION_MESSAGES.REQUIRED_TITLE, TOAST_TYPES.ERROR);
      return false;
    }

    // Check duplicate
    const isDuplicate = todos.some(
      (todo) => todo.title.toLowerCase() === trimmedTitle.toLowerCase() && !todo.completed
    );
    if (isDuplicate) {
      if (addToast) addToast(VALIDATION_MESSAGES.DUPLICATE_TITLE, TOAST_TYPES.ERROR);
      return false;
    }

    setActionLoading(true);
    try {
      if (fallbackMode) {
        const newTodo = {
          id: `local-${Date.now()}`,
          title: trimmedTitle,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        setTodos((prev) => [newTodo, ...prev]);
        if (addToast) addToast('Task created successfully', TOAST_TYPES.SUCCESS);
        return true;
      } else {
        const createdTodo = await todoService.create(trimmedTitle);
        setTodos((prev) => [createdTodo, ...prev]);
        if (addToast) addToast('Task created successfully', TOAST_TYPES.SUCCESS);
        return true;
      }
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to create task', TOAST_TYPES.ERROR);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Todo Status
  const toggleTodoStatus = async (id, currentStatus) => {
    setActionLoading(true);
    const nextStatus = !currentStatus;
    try {
      if (fallbackMode) {
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? { ...todo, completed: nextStatus } : todo
          )
        );
        if (addToast) {
          addToast(
            nextStatus ? 'Task completed! 🎉' : 'Task marked as pending',
            TOAST_TYPES.SUCCESS
          );
        }
        return true;
      } else {
        // Find existing todo to make sure we keep title and other properties
        const existingTodo = todos.find((t) => t.id === id);
        const updatedTodo = await todoService.update(id, {
          ...existingTodo,
          completed: nextStatus,
        });
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
        if (addToast) {
          addToast(
            nextStatus ? 'Task completed! 🎉' : 'Task marked as pending',
            TOAST_TYPES.SUCCESS
          );
        }
        return true;
      }
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to update task status', TOAST_TYPES.ERROR);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Update Todo Text/Content
  const updateTodo = async (id, title) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      if (addToast) addToast(VALIDATION_MESSAGES.REQUIRED_TITLE, TOAST_TYPES.ERROR);
      return false;
    }

    // Check duplicate (excluding the task being edited)
    const isDuplicate = todos.some(
      (todo) =>
        todo.id !== id &&
        todo.title.toLowerCase() === trimmedTitle.toLowerCase() &&
        !todo.completed
    );
    if (isDuplicate) {
      if (addToast) addToast(VALIDATION_MESSAGES.DUPLICATE_TITLE, TOAST_TYPES.ERROR);
      return false;
    }

    setActionLoading(true);
    try {
      if (fallbackMode) {
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? { ...todo, title: trimmedTitle } : todo
          )
        );
        if (addToast) addToast('Task updated successfully', TOAST_TYPES.SUCCESS);
        return true;
      } else {
        const existingTodo = todos.find((t) => t.id === id);
        const updatedTodo = await todoService.update(id, {
          ...existingTodo,
          title: trimmedTitle,
        });
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
        if (addToast) addToast('Task updated successfully', TOAST_TYPES.SUCCESS);
        return true;
      }
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to update task', TOAST_TYPES.ERROR);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Todo
  const deleteTodo = async (id) => {
    setActionLoading(true);
    try {
      if (fallbackMode) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
        if (addToast) addToast('Task deleted successfully', TOAST_TYPES.SUCCESS);
        return true;
      } else {
        await todoService.delete(id);
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
        if (addToast) addToast('Task deleted successfully', TOAST_TYPES.SUCCESS);
        return true;
      }
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to delete task', TOAST_TYPES.ERROR);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Memoized lists filtered by both Category and Debounced Query
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // 1. Category filter
      const matchesFilter =
        filter === FILTERS.ALL ||
        (filter === FILTERS.COMPLETED && todo.completed) ||
        (filter === FILTERS.PENDING && !todo.completed);
        
      // 2. Search query filter
      const matchesSearch = todo.title
        .toLowerCase()
        .includes(debouncedQuery.toLowerCase());
        
      return matchesFilter && matchesSearch;
    });
  }, [todos, filter, debouncedQuery]);

  // Memoized stats calculation
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      total,
      completed,
      pending,
      completionRate,
    };
  }, [todos]);

  return {
    todos,
    filteredTodos,
    loading,
    actionLoading,
    error,
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
    refreshTodos: loadTodos,
  };
}
