const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', rateLimiter.authLimiter, authController.register);
router.post('/login', rateLimiter.authLimiter, authController.login);
router.get('/me', authMiddleware.protect, authController.getMe);

module.exports = router;
