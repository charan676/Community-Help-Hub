const express = require('express');
const schemeController = require('../controllers/scheme.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/check', schemeController.checkEligibility);

router.route('/')
  .get(schemeController.getAllSchemes)
  .post(authMiddleware.protect, authMiddleware.restrictTo('admin'), schemeController.createScheme);

router.route('/:id')
  .put(authMiddleware.protect, authMiddleware.restrictTo('admin'), schemeController.updateScheme)
  .delete(authMiddleware.protect, authMiddleware.restrictTo('admin'), schemeController.deleteScheme);

module.exports = router;
