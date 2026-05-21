import { Request, Response, NextFunction } from 'express';
import { TaskService } from './tasks.service';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from './tasks.schema';

const taskService = new TaskService();

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const body = createTaskSchema.parse(req.body);
    const task = await taskService.create(req.user!.userId, body);
    res.status(201).json({ success: true, data: task });
  } catch (err) { next(err); }
}

export async function getMyTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const query  = taskQuerySchema.parse(req.query);
    const result = await taskService.findByUser(req.user!.userId, query);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

export async function getAllTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const query  = taskQuerySchema.parse(req.query);
    const result = await taskService.findAll(query);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

export async function getTask(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await taskService.findOne(req.params.id, req.user!);
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const body = updateTaskSchema.parse(req.body);
    const task = await taskService.update(req.params.id, req.user!, body);
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    await taskService.remove(req.params.id, req.user!);
    res.status(204).send();
  } catch (err) { next(err); }
}
