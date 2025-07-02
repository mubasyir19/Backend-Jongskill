import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📱 Environment: ${env.NODE_ENV}`);
  logger.info(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  server.close(() => {
    logger.info('Process terminated');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received');
  server.close(() => {
    logger.info('Process terminated');
  });
});

export default server;
