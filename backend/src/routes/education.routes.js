const express = require('express');
const educationController = require('../controllers/education.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/')
  .get(educationController.getAllEducation)
  .post(authMiddleware.protect, authMiddleware.restrictTo('admin'), educationController.createEducation);

router.route('/:id')
  .put(authMiddleware.protect, authMiddleware.restrictTo('admin'), educationController.updateEducation)
  .delete(authMiddleware.protect, authMiddleware.restrictTo('admin'), educationController.deleteEducation);

module.exports = router;
