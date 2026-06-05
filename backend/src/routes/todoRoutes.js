import { Router } from 'express';
import { todoController } from '../controllers/todoController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createTodoSchema,
  updateTodoSchema,
  queryTodoSchema,
  getTodoByIdSchema,
} from '../validations/todoValidation.js';

const router = Router();

router
  .route('/')
  .get(validateRequest(queryTodoSchema), todoController.getAllTodos)
  .post(validateRequest(createTodoSchema), todoController.createTodo);

router
  .route('/:id')
  .get(validateRequest(getTodoByIdSchema), todoController.getTodoById)
  .put(validateRequest(updateTodoSchema), todoController.updateTodo)
  .delete(validateRequest(getTodoByIdSchema), todoController.deleteTodo);

export default router;
