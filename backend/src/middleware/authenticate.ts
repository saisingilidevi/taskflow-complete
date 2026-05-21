import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return next(new ApiError(401, 'UNAUTHORIZED', 'Missing or malformed Authorization header'));

  const token = authHeader.slice(7);
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new ApiError(401, 'TOKEN_EXPIRED', 'Access token expired or invalid'));
  }
}
