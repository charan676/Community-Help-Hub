const express = require('express');
const hospitalController = require('../controllers/hospital.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/nearby', hospitalController.getNearbyHospitals);

router.route('/')
  .get(hospitalController.getAllHospitals)
  .post(authMiddleware.protect, authMiddleware.restrictTo('admin'), hospitalController.createHospital);

router.route('/:id')
  .put(authMiddleware.protect, authMiddleware.restrictTo('admin'), hospitalController.updateHospital)
  .delete(authMiddleware.protect, authMiddleware.restrictTo('admin'), hospitalController.deleteHospital);

module.exports = router;
