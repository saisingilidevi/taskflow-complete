import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JWTPayload { userId: string; role: string; }

export function signAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload: Pick<JWTPayload, 'userId'>): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): Pick<JWTPayload, 'userId'> {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as Pick<JWTPayload, 'userId'>;
}
