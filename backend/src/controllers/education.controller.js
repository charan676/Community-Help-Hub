const Education = require('../models/education.model');
const AppError = require('../utils/AppError');
const mockDb = require('../utils/mockDb');

exports.getAllEducation = async (req, res, next) => {
  try {
    const { category } = req.query;

    if (global.dbOffline) {
      let results = [...mockDb.educations];
      if (category) {
        results = results.filter(e => e.category === category);
      }
      return res.status(200).json({
        status: 'success',
        results: results.length,
        data: { resources: results }
      });
    }

    let query = {};
    if (category) {
      query.category = category;
    }

    const resources = await Education.find(query).sort({ title: 1 });

    res.status(200).json({
      status: 'success',
      results: resources.length,
      data: { resources }
    });
  } catch (error) {
    next(error);
  }
};

exports.createEducation = async (req, res, next) => {
  try {
    if (global.dbOffline) {
      const newResource = {
        _id: `edu_${Date.now()}`,
        ...req.body
      };
      mockDb.educations.push(newResource);
      return res.status(201).json({
        status: 'success',
        data: { resource: newResource }
      });
    }

    const newResource = await Education.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { resource: newResource }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEducation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (global.dbOffline) {
      const index = mockDb.educations.findIndex(e => e._id === id);
      if (index === -1) {
        return next(new AppError('No educational resource found with that ID', 404));
      }
      mockDb.educations[index] = { ...mockDb.educations[index], ...req.body };
      return res.status(200).json({
        status: 'success',
        data: { resource: mockDb.educations[index] }
      });
    }

    const resource = await Education.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!resource) {
      return next(new AppError('No educational resource found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { resource }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEducation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (global.dbOffline) {
      const index = mockDb.educations.findIndex(e => e._id === id);
      if (index === -1) {
        return next(new AppError('No educational resource found with that ID', 404));
      }
      mockDb.educations.splice(index, 1);
      return res.status(204).json({
        status: 'success',
        data: null
      });
    }

    const resource = await Education.findByIdAndDelete(id);

    if (!resource) {
      return next(new AppError('No educational resource found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
