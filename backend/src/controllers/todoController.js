import { todoService } from '../services/todoService.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Helper to catch async exceptions cleanly without try/catch boilerplate
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const todoController = {
  /**
   * Fetch list of todos (GET /api/todos)
   */
  getAllTodos: asyncHandler(async (req, res) => {
    // req.query is validated and co-erced by Zod
    const { page, limit, search, status, sortBy, order } = req.query;

    const { todos, pagination } = await todoService.getAllTodos({
      page,
      limit,
      search,
      status,
      sortBy,
      order,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, todos, 'Todos fetched successfully', pagination));
  }),

  /**
   * Fetch single todo details (GET /api/todos/:id)
   */
  getTodoById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const todo = await todoService.getTodoById(id);

    return res.status(200).json(new ApiResponse(200, todo, 'Todo fetched successfully'));
  }),

  /**
   * Create task (POST /api/todos)
   */
  createTodo: asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const todo = await todoService.createTodo({ title, description });

    return res.status(201).json(new ApiResponse(201, todo, 'Todo created successfully'));
  }),

  /**
   * Update task (PUT /api/todos/:id)
   */
  updateTodo: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const todo = await todoService.updateTodo(id, updates);

    return res.status(200).json(new ApiResponse(200, todo, 'Todo updated successfully'));
  }),

  /**
   * Delete task (DELETE /api/todos/:id)
   */
  deleteTodo: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await todoService.deleteTodo(id);

    return res.status(200).json(new ApiResponse(200, null, 'Todo deleted successfully'));
  }),
};
