import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 seconds timeout to respond quickly in case of network issue
});

// Helper to standardise error handling
const handleApiError = (error, operationName) => {
  console.error(`API Error during ${operationName}:`, error);
  
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !error.response) {
    throw {
      isNetworkError: true,
      message: 'Unable to connect to the backend server. The API might be offline.',
      originalError: error
    };
  }
  
  throw {
    isNetworkError: false,
    message: error.response?.data?.message || `Failed to ${operationName.toLowerCase()}.`,
    originalError: error,
    status: error.response?.status
  };
};

export const todoService = {
  /**
   * Fetch all todos
   * GET /api/todos
   */
  async getAll() {
    try {
      const response = await apiClient.get('');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'fetch todos');
    }
  },

  /**
   * Create a new todo
   * POST /api/todos
   */
  async create(title) {
    try {
      // Typically backend expects a JSON payload. We set default completed to false.
      const response = await apiClient.post('', { title, completed: false });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'create todo');
    }
  },

  /**
   * Update a todo (title, completed status)
   * PUT /api/todos/:id
   */
  async update(id, updates) {
    try {
      // updates is an object containing fields to change e.g., { title, completed }
      const response = await apiClient.put(`/${id}`, updates);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'update todo');
    }
  },

  /**
   * Delete a todo
   * DELETE /api/todos/:id
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'delete todo');
    }
  }
};
