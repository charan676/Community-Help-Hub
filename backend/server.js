const dotenv = require('dotenv');
const path = require('path');
const logger = require('./src/utils/logger');

// Catch uncaught exceptions globally
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err);
  process.exit(1);
});

// Load Env variables
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./src/config/db');
const app = require('./src/app');

// Connect to MongoDB Database
connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Catch unhandled promise rejections globally
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down gracefully...');
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});
