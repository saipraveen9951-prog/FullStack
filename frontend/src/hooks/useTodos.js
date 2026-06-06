import { useState, useEffect, useMemo } from 'react';
import { todoService } from '../services/todoService';
import { FILTERS, DEBOUNCE_DELAY, TOAST_TYPES, VALIDATION_MESSAGES } from '../utils/constants';

export function useTodos(addToast) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filter and Search States
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Initial load
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const data = await todoService.getAll();
      const sortedData = Array.isArray(data) ? data : [];
      sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTodos(sortedData);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      if (addToast) addToast(err.message || 'Failed to load tasks from server.', TOAST_TYPES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  // Create Todo
  const addTodo = async (title) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      if (addToast) addToast(VALIDATION_MESSAGES.REQUIRED_TITLE, TOAST_TYPES.ERROR);
      return false;
    }

    // Client-side duplicate check against current list
    const isDuplicate = todos.some(
      (todo) => todo.title.toLowerCase() === trimmedTitle.toLowerCase() && !todo.completed
    );
    if (isDuplicate) {
      if (addToast) addToast(VALIDATION_MESSAGES.DUPLICATE_TITLE, TOAST_TYPES.ERROR);
      return false;
    }

    setActionLoading(true);
    try {
      const createdTodo = await todoService.create(trimmedTitle);
      setTodos((prev) => [createdTodo, ...prev]);
      if (addToast) addToast('Task created successfully', TOAST_TYPES.SUCCESS);
      return true;
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
      const existingTodo = todos.find((t) => t.id === id);
      const updatedTodo = await todoService.update(id, {
        ...existingTodo,
        completed: nextStatus,
      });
      setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
      if (addToast) {
        addToast(
          nextStatus ? 'Task completed! 🎉' : 'Task marked as pending',
          TOAST_TYPES.SUCCESS
        );
      }
      return true;
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to update task status', TOAST_TYPES.ERROR);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Update Todo Title
  const updateTodo = async (id, title) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      if (addToast) addToast(VALIDATION_MESSAGES.REQUIRED_TITLE, TOAST_TYPES.ERROR);
      return false;
    }

    // Client-side duplicate check (excluding current task)
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
      const existingTodo = todos.find((t) => t.id === id);
      const updatedTodo = await todoService.update(id, {
        ...existingTodo,
        title: trimmedTitle,
      });
      setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
      if (addToast) addToast('Task updated successfully', TOAST_TYPES.SUCCESS);
      return true;
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
      await todoService.delete(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      if (addToast) addToast('Task deleted successfully', TOAST_TYPES.SUCCESS);
      return true;
    } catch (err) {
      if (addToast) addToast(err.message || 'Failed to delete task', TOAST_TYPES.ERROR);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered list by category + debounced search
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesFilter =
        filter === FILTERS.ALL ||
        (filter === FILTERS.COMPLETED && todo.completed) ||
        (filter === FILTERS.PENDING && !todo.completed);

      const matchesSearch = todo.title
        .toLowerCase()
        .includes(debouncedQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [todos, filter, debouncedQuery]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, completionRate };
  }, [todos]);

  return {
    todos,
    filteredTodos,
    loading,
    actionLoading,
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
