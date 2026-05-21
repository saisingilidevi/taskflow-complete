import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';
import type { JWTPayload } from '../../utils/jwt';

export class TaskService {
  async create(userId: string, data: any) {
    return prisma.task.create({
      data: { ...data, userId },
    });
  }

  async findByUser(userId: string, query: any) {
    const { page = 1, limit = 10, status, priority, sort = 'createdAt' } = query;
    const skip  = (page - 1) * limit;
    const where: any = { userId };
    if (status)   where.status   = status;
    if (priority) where.priority = priority;

    const [data, total] = await Promise.all([
      prisma.task.findMany({ where, skip, take: Number(limit), orderBy: { [sort]: 'desc' } }),
      prisma.task.count({ where }),
    ]);
    return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async findAll(query: any) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.task.findMany({ skip, take: Number(limit), include: { user: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: 'desc' } }),
      prisma.task.count(),
    ]);
    return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, user: JWTPayload) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw new ApiError(404, 'TASK_NOT_FOUND', 'Task not found');
    if (task.userId !== user.userId && user.role !== 'admin') throw new ApiError(403, 'FORBIDDEN', 'Access denied');
    return task;
  }

  async update(id: string, user: JWTPayload, data: any) {
    await this.findOne(id, user);
    return prisma.task.update({ where: { id }, data });
  }

  async remove(id: string, user: JWTPayload) {
    await this.findOne(id, user);
    await prisma.task.delete({ where: { id } });
  }
}
