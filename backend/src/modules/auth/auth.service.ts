import bcrypt from 'bcryptjs';
import { prisma } from '../../config/db';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { ApiError } from '../../utils/ApiError';

export class AuthService {
  async register(data: { name: string; email: string; password: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ApiError(409, 'EMAIL_EXISTS', 'Email already registered');

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return user;
  }

  async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');

    const accessToken  = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id });

    const tokenHash = await bcrypt.hash(refreshToken, 8);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({ data: { userId: user.id, tokenHash, expiresAt } });

    return { accessToken, refreshToken, expiresIn: 900 };
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const stored  = await prisma.refreshToken.findFirst({
      where: { userId: payload.userId, isRevoked: false, expiresAt: { gt: new Date() } },
    });
    if (!stored) throw new ApiError(401, 'INVALID_TOKEN', 'Refresh token invalid or expired');

    const valid = await bcrypt.compare(refreshToken, stored.tokenHash);
    if (!valid) throw new ApiError(401, 'INVALID_TOKEN', 'Refresh token mismatch');

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    return { accessToken, expiresIn: 900 };
  }

  async logout(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      await prisma.refreshToken.updateMany({
        where: { userId: payload.userId, isRevoked: false },
        data:  { isRevoked: true },
      });
    } catch {
      // silently ignore — token may already be expired
    }
  }
}
