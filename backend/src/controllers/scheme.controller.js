const Scheme = require('../models/scheme.model');
const AppError = require('../utils/AppError');
const mockDb = require('../utils/mockDb');

exports.getAllSchemes = async (req, res, next) => {
  try {
    const { category, districtCode, search } = req.query;

    if (global.dbOffline) {
      let results = mockDb.schemes.filter(s => s.isActive);

      if (category && category !== 'all') {
        results = results.filter(s => s.category === category);
      }
      if (districtCode) {
        const lowerDistrict = districtCode.toLowerCase();
        results = results.filter(s => !s.districtCode || s.districtCode === lowerDistrict);
      }
      if (search) {
        const query = search.toLowerCase();
        results = results.filter(s => 
          (s.title.en && s.title.en.toLowerCase().includes(query)) ||
          (s.title.te && s.title.te.toLowerCase().includes(query)) ||
          (s.benefits.en && s.benefits.en.toLowerCase().includes(query))
        );
      }

      return res.status(200).json({
        status: 'success',
        results: results.length,
        data: { schemes: results }
      });
    }

    let query = { isActive: true };
    if (category && category !== 'all') {
      query.category = category;
    }
    if (districtCode) {
      query.$or = [
        { districtCode: null },
        { districtCode: '' },
        { districtCode: districtCode.toLowerCase() }
      ];
    }
    if (search) {
      query.$or = [
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.te': { $regex: search, $options: 'i' } },
        { 'benefits.en': { $regex: search, $options: 'i' } }
      ];
    }

    const schemes = await Scheme.find(query).sort({ category: 1 });

    res.status(200).json({
      status: 'success',
      results: schemes.length,
      data: { schemes }
    });
  } catch (error) {
    next(error);
  }
};

exports.checkEligibility = async (req, res, next) => {
  try {
    const { age, isStudent, isFarmer, gender } = req.body;
    let categories = ['general'];

    if (isStudent) {
      categories.push('student');
    }
    if (isFarmer) {
      categories.push('farmer');
    }
    if (gender === 'female' || gender === 'women') {
      categories.push('women');
    }
    if (age && parseInt(age) >= 60) {
      categories.push('senior');
    }

    if (global.dbOffline) {
      const matchingSchemes = mockDb.schemes.filter(s => 
        s.isActive && categories.includes(s.category)
      );

      return res.status(200).json({
        status: 'success',
        results: matchingSchemes.length,
        data: { schemes: matchingSchemes }
      });
    }

    const matchingSchemes = await Scheme.find({
      category: { $in: categories },
      isActive: true
    }).sort({ category: 1 });

    res.status(200).json({
      status: 'success',
      results: matchingSchemes.length,
      data: { schemes: matchingSchemes }
    });
  } catch (error) {
    next(error);
  }
};

exports.createScheme = async (req, res, next) => {
  try {
    const { title, category, eligibilityCriteria, benefits, officialWebsiteUrl, districtCode } = req.body;

    if (global.dbOffline) {
      const newScheme = {
        _id: `scheme_${Date.now()}`,
        title,
        category,
        eligibilityCriteria,
        benefits,
        officialWebsiteUrl,
        districtCode: districtCode ? districtCode.toLowerCase() : null,
        isActive: true
      };
      mockDb.schemes.push(newScheme);
      return res.status(201).json({
        status: 'success',
        data: { scheme: newScheme }
      });
    }

    const newScheme = await Scheme.create({
      title,
      category,
      eligibilityCriteria,
      benefits,
      officialWebsiteUrl,
      districtCode: districtCode ? districtCode.toLowerCase() : null
    });

    res.status(201).json({
      status: 'success',
      data: { scheme: newScheme }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateScheme = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (global.dbOffline) {
      const index = mockDb.schemes.findIndex(s => s._id === id);
      if (index === -1) {
        return next(new AppError('No scheme found with that ID', 404));
      }
      if (req.body.districtCode) {
        req.body.districtCode = req.body.districtCode.toLowerCase();
      }
      mockDb.schemes[index] = { ...mockDb.schemes[index], ...req.body };
      return res.status(200).json({
        status: 'success',
        data: { scheme: mockDb.schemes[index] }
      });
    }

    if (req.body.districtCode) {
      req.body.districtCode = req.body.districtCode.toLowerCase();
    }

    const scheme = await Scheme.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!scheme) {
      return next(new AppError('No scheme found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { scheme }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteScheme = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (global.dbOffline) {
      const index = mockDb.schemes.findIndex(s => s._id === id);
      if (index === -1) {
        return next(new AppError('No scheme found with that ID', 404));
      }
      mockDb.schemes.splice(index, 1);
      return res.status(204).json({
        status: 'success',
        data: null
      });
    }

    const scheme = await Scheme.findByIdAndDelete(id);

    if (!scheme) {
      return next(new AppError('No scheme found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
