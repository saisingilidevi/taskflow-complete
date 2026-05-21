import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema, refreshSchema } from './auth.schema';
import { ApiError } from '../../utils/ApiError';

const authService = new AuthService();

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const body = registerSchema.parse(req.body);
    const user = await authService.register(body);
    res.status(201).json({ success: true, message: 'User registered successfully', data: user });
  } catch (err) { next(err); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const body = loginSchema.parse(req.body);
    const tokens = await authService.login(body);
    res.json({ success: true, ...tokens });
  } catch (err) { next(err); }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const tokens = await authService.refresh(refreshToken);
    res.json({ success: true, ...tokens });
  } catch (err) { next(err); }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new ApiError(400, 'MISSING_TOKEN', 'refreshToken required');
    await authService.logout(refreshToken);
    res.status(204).send();
  } catch (err) { next(err); }
}
