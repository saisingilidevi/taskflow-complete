// users.controller.ts
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user!.userId },
      select: { id: true, name: true, email: true, role: true, isVerified: true, createdAt: true },
    });
    if (!user) throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
}

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 20;
    const role  = req.query.role as string | undefined;
    const skip  = (page - 1) * limit;
    const where: any = role ? { role } : {};
    const [data, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take: limit, select: { id: true, name: true, email: true, role: true, createdAt: true }, orderBy: { createdAt: 'desc' } }),
      prisma.user.count({ where }),
    ]);
    res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
}
