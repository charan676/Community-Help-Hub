const rateLimit = require('express-rate-limit');

const isDev = process.env.NODE_ENV === 'development';

exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 10000 : 100, // limit each IP to 100 requests (10000 in dev) per windowMs
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDev ? 1000 : 10, // limit each IP to 10 login/register requests (1000 in dev) per hour
  message: {
    status: 'fail',
    message: 'Too many login attempts from this IP, please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

