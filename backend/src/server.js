const app = require('./app');
const serverConfig = require('./config/serverConfig');
const logger = require('./utils/logger');

const server = app.listen(serverConfig.port, () => {
  logger.info(
    `Server running in ${serverConfig.nodeEnv} mode on port ${serverConfig.port}`
  );
});

const shutdown = (signal) => {
  logger.info(`${signal} received. Closing HTTP server.`);

  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', reason);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});
