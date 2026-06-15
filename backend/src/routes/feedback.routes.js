const express = require('express');
const feedbackController = require('../controllers/feedback.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// submitFeedback accepts optional auth (decodes if present, but doesn't block)
// For simplicity, we can make submitFeedback fully public or verify token if available
router.post('/', (req, res, next) => {
  // Optional decode middleware or call directly
  if (req.headers.authorization) {
    return authMiddleware.protect(req, res, () => {
      feedbackController.submitFeedback(req, res, next);
    });
  }
  feedbackController.submitFeedback(req, res, next);
});

router.route('/')
  .get(authMiddleware.protect, authMiddleware.restrictTo('admin'), feedbackController.getAllFeedbacks);

router.route('/:id')
  .patch(authMiddleware.protect, authMiddleware.restrictTo('admin'), feedbackController.updateFeedbackStatus);

module.exports = router;
