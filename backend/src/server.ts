import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { prisma } from './config/db';

const PORT = env.PORT;

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected');

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📚 Swagger docs at http://localhost:${PORT}/api/docs`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
}

bootstrap();
