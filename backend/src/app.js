const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middleware/error.middleware');
const { apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

// Route imports
const authRoutes = require('./routes/auth.routes');
const emergencyRoutes = require('./routes/service.routes');
const hospitalRoutes = require('./routes/hospital.routes');
const schemeRoutes = require('./routes/scheme.routes');
const educationRoutes = require('./routes/education.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const chatbotRoutes = require('./routes/chatbot.routes');

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: '*', // For development. Can be restricted in production config.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing with limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Workaround for Express getter issue with query parameter modifications
app.use((req, res, next) => {
  if (req.query) {
    Object.defineProperty(req, 'query', {
      value: { ...req.query },
      writable: true,
      configurable: true,
      enumerable: true
    });
  }
  next();
});

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// Apply rate limiting to all /api routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/schemes', schemesRoutes = schemeRoutes); // Aliased or direct
app.use('/api/education', educationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Handle favicon.ico requests to avoid log noise/404s
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Fallback for unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized error handler
app.use(globalErrorHandler);

module.exports = app;
