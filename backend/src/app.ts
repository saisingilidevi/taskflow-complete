import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import authRoutes  from './modules/auth/auth.routes';
import taskRoutes  from './modules/tasks/tasks.routes';
import userRoutes  from './modules/users/users.routes';
import { env } from './config/env';

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(rateLimiter);

// Swagger docs
const swaggerDoc = YAML.load(path.join(__dirname, '../../docs/openapi.yaml'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// Routes
app.use('/api/v1/auth',  authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users', userRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// Global error handler
app.use(errorHandler);

export default app;
