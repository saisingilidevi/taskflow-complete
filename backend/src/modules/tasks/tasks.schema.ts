import { z } from 'zod';

export const createTaskSchema = z.object({
  title:       z.string().min(1).max(200).trim(),
  description: z.string().max(2000).optional(),
  status:      z.enum(['todo', 'in_progress', 'done']).default('todo'),
  priority:    z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate:     z.string().datetime().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskQuerySchema = z.object({
  page:     z.coerce.number().min(1).default(1),
  limit:    z.coerce.number().min(1).max(100).default(10),
  status:   z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  sort:     z.enum(['createdAt', 'dueDate', 'priority']).default('createdAt'),
});
