const Emergency = require('../models/emergency.model');
const AppError = require('../utils/AppError');
const mockDb = require('../utils/mockDb');

exports.getAllEmergencies = async (req, res, next) => {
  try {
    const { districtCode } = req.query;

    if (global.dbOffline) {
      let services = mockDb.emergencies.filter(s => s.isActive);
      if (districtCode) {
        const lowerDistrict = districtCode.toLowerCase();
        services = services.filter(s => !s.districtCode || s.districtCode === lowerDistrict);
      }
      return res.status(200).json({
        status: 'success',
        results: services.length,
        data: { services }
      });
    }

    let filter = { isActive: true };
    if (districtCode) {
      filter.$or = [
        { districtCode: null },
        { districtCode: '' },
        { districtCode: districtCode.toLowerCase() }
      ];
    }

    const services = await Emergency.find(filter).sort({ category: 1 });

    res.status(200).json({
      status: 'success',
      results: services.length,
      data: { services }
    });
  } catch (error) {
    next(error);
  }
};

exports.createEmergency = async (req, res, next) => {
  try {
    const { name, icon, description, contactNumber, category, districtCode } = req.body;

    if (global.dbOffline) {
      const newService = {
        _id: `emergency_${Date.now()}`,
        name,
        icon: icon || '📞',
        description,
        contactNumber,
        category,
        districtCode: districtCode ? districtCode.toLowerCase() : null,
        isActive: true
      };
      mockDb.emergencies.push(newService);
      return res.status(201).json({
        status: 'success',
        data: { service: newService }
      });
    }

    const newService = await Emergency.create({
      name,
      icon,
      description,
      contactNumber,
      category,
      districtCode: districtCode ? districtCode.toLowerCase() : null
    });

    res.status(201).json({
      status: 'success',
      data: { service: newService }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEmergency = async (req, res, next) => {
  try {
    if (global.dbOffline) {
      const index = mockDb.emergencies.findIndex(e => e._id === req.params.id);
      if (index === -1) {
        return next(new AppError('No emergency service found with that ID', 404));
      }
      mockDb.emergencies[index] = { ...mockDb.emergencies[index], ...req.body };
      return res.status(200).json({
        status: 'success',
        data: { service: mockDb.emergencies[index] }
      });
    }

    const service = await Emergency.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!service) {
      return next(new AppError('No emergency service found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { service }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEmergency = async (req, res, next) => {
  try {
    if (global.dbOffline) {
      const index = mockDb.emergencies.findIndex(e => e._id === req.params.id);
      if (index === -1) {
        return next(new AppError('No emergency service found with that ID', 404));
      }
      mockDb.emergencies.splice(index, 1);
      return res.status(204).json({
        status: 'success',
        data: null
      });
    }

    const service = await Emergency.findByIdAndDelete(req.params.id);

    if (!service) {
      return next(new AppError('No emergency service found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
