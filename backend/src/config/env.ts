import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
  NODE_ENV:           z.enum(['development', 'test', 'production']).default('development'),
  PORT:               z.coerce.number().default(4000),
  DATABASE_URL:       z.string().url(),
  JWT_ACCESS_SECRET:  z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  REDIS_URL:          z.string().url().optional(),
  CLIENT_URL:         z.string().url().default('http://localhost:5173'),
});

export const env = envSchema.parse(process.env);
