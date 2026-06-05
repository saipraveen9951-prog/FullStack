import { todoRepository } from '../repositories/todoRepository.js';
import { ApiError } from '../utils/ApiError.js';

export const todoService = {
  /**
   * Fetch paginated list of todos and calculate pagination indicators
   */
  async getAllTodos({ page, limit, search, status, sortBy, order }) {
    const { todos, total } = await todoRepository.findAll({
      page,
      limit,
      search,
      status,
      sortBy,
      order,
    });

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      todos,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };
  },

  /**
   * Fetch single todo details
   */
  async getTodoById(id) {
    const todo = await todoRepository.findById(id);
    if (!todo) {
      throw new ApiError(404, `Todo with ID ${id} not found`);
    }
    return todo;
  },

  /**
   * Create a new task (validates active duplication)
   */
  async createTodo({ title, description }) {
    const trimmedTitle = title.trim();

    // Check duplicate among pending (non-completed) tasks
    const existing = await todoRepository.findPendingByTitle(trimmedTitle);
    if (existing) {
      throw new ApiError(400, 'A pending task with this title already exists');
    }

    return await todoRepository.create({
      title: trimmedTitle,
      description: description?.trim() || null,
    });
  },

  /**
   * Update task details (validates active duplication if title is changing)
   */
  async updateTodo(id, updates) {
    // 1. Verify existence
    const todo = await todoRepository.findById(id);
    if (!todo) {
      throw new ApiError(404, `Todo with ID ${id} not found`);
    }

    const cleanedUpdates = {};

    // 2. Validate changing title duplication
    if (updates.title !== undefined) {
      const trimmedTitle = updates.title.trim();
      
      if (trimmedTitle.toLowerCase() !== todo.title.toLowerCase()) {
        const existing = await todoRepository.findPendingByTitle(trimmedTitle);
        // Duplicate blocks update only if the duplicate task is a different task ID
        if (existing && existing.id !== id) {
          throw new ApiError(400, 'A pending task with this title already exists');
        }
      }
      cleanedUpdates.title = trimmedTitle;
    }

    if (updates.description !== undefined) {
      cleanedUpdates.description = updates.description?.trim() || null;
    }

    if (updates.completed !== undefined) {
      cleanedUpdates.completed = updates.completed;
    }

    return await todoRepository.update(id, cleanedUpdates);
  },

  /**
   * Delete task
   */
  async deleteTodo(id) {
    // Verify existence
    const todo = await todoRepository.findById(id);
    if (!todo) {
      throw new ApiError(404, `Todo with ID ${id} not found`);
    }

    return await todoRepository.delete(id);
  },
};
