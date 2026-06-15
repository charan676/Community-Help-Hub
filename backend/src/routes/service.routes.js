const express = require('express');
const serviceController = require('../controllers/service.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/')
  .get(serviceController.getAllEmergencies)
  .post(authMiddleware.protect, authMiddleware.restrictTo('admin'), serviceController.createEmergency);

router.route('/:id')
  .put(authMiddleware.protect, authMiddleware.restrictTo('admin'), serviceController.updateEmergency)
  .delete(authMiddleware.protect, authMiddleware.restrictTo('admin'), serviceController.deleteEmergency);

module.exports = router;
