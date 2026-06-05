import { z } from 'zod';

export const createTodoSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
      })
      .trim()
      .min(3, 'Title must be at least 3 characters')
      .max(255, 'Title must not exceed 255 characters'),
    description: z.string().trim().optional().nullable(),
  }),
});

export const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID format'),
  }),
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(3, 'Title must be at least 3 characters')
        .max(255, 'Title must not exceed 255 characters')
        .optional(),
      description: z.string().trim().optional().nullable(),
      completed: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field (title, description, completed) must be provided for update',
    }),
});

export const queryTodoSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1, 'Page must be 1 or greater').default(1),
    limit: z.coerce.number().int().min(1, 'Limit must be 1 or greater').max(100).default(10),
    search: z.string().trim().optional(),
    status: z.enum(['completed', 'pending', 'all']).default('all'),
    sortBy: z.enum(['createdAt', 'title', 'completed']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const getTodoByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID format'),
  }),
});
