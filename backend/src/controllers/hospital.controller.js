const Hospital = require('../models/hospital.model');
const AppError = require('../utils/AppError');
const mockDb = require('../utils/mockDb');

// Distance calculator helper
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

exports.getAllHospitals = async (req, res, next) => {
  try {
    const { districtCode, category, search } = req.query;

    if (global.dbOffline) {
      let results = [...mockDb.hospitals];

      if (districtCode) {
        results = results.filter(h => h.districtCode === districtCode.toLowerCase());
      }
      if (category) {
        results = results.filter(h => h.category === category);
      }
      if (search) {
        const query = search.toLowerCase();
        results = results.filter(h => 
          (h.name.en && h.name.en.toLowerCase().includes(query)) ||
          (h.name.te && h.name.te.toLowerCase().includes(query)) ||
          (h.address.en && h.address.en.toLowerCase().includes(query))
        );
      }

      return res.status(200).json({
        status: 'success',
        results: results.length,
        data: { hospitals: results }
      });
    }

    let query = {};
    if (districtCode) {
      query.districtCode = districtCode.toLowerCase();
    }
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.te': { $regex: search, $options: 'i' } },
        { 'address.en': { $regex: search, $options: 'i' } }
      ];
    }

    const hospitals = await Hospital.find(query).sort({ 'name.en': 1 });

    res.status(200).json({
      status: 'success',
      results: hospitals.length,
      data: { hospitals }
    });
  } catch (error) {
    next(error);
  }
};

exports.getNearbyHospitals = async (req, res, next) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return next(new AppError('Please provide latitude (lat) and longitude (lng) coordinates', 400));
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const maxRadius = parseFloat(radius);

    if (global.dbOffline) {
      const nearby = mockDb.hospitals.filter(h => {
        const coords = h.location.coordinates;
        // coordinates array is [longitude, latitude]
        const distance = calculateDistance(latitude, longitude, coords[1], coords[0]);
        return distance <= maxRadius;
      });

      return res.status(200).json({
        status: 'success',
        results: nearby.length,
        data: { hospitals: nearby }
      });
    }

    const radiusInMeters = maxRadius * 1000;
    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radiusInMeters
        }
      }
    });

    res.status(200).json({
      status: 'success',
      results: hospitals.length,
      data: { hospitals }
    });
  } catch (error) {
    next(error);
  }
};

exports.createHospital = async (req, res, next) => {
  try {
    const { name, description, contactNumber, address, googleMapsUrl, location, districtCode, category, hasBloodBank, is24_7 } = req.body;

    if (global.dbOffline) {
      const newHospital = {
        _id: `hospital_${Date.now()}`,
        name,
        description,
        contactNumber,
        address,
        googleMapsUrl,
        location: location || { type: 'Point', coordinates: [83.3, 17.7] },
        districtCode: districtCode.toLowerCase(),
        category: category || 'government',
        hasBloodBank: !!hasBloodBank,
        is24_7: !!is24_7
      };
      mockDb.hospitals.push(newHospital);
      return res.status(201).json({
        status: 'success',
        data: { hospital: newHospital }
      });
    }

    const newHospital = await Hospital.create({
      name,
      description,
      contactNumber,
      address,
      googleMapsUrl,
      location,
      districtCode: districtCode.toLowerCase(),
      category,
      hasBloodBank,
      is24_7
    });

    res.status(201).json({
      status: 'success',
      data: { hospital: newHospital }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateHospital = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (global.dbOffline) {
      const index = mockDb.hospitals.findIndex(h => h._id === id);
      if (index === -1) {
        return next(new AppError('No hospital found with that ID', 404));
      }
      if (req.body.districtCode) {
        req.body.districtCode = req.body.districtCode.toLowerCase();
      }
      mockDb.hospitals[index] = { ...mockDb.hospitals[index], ...req.body };
      return res.status(200).json({
        status: 'success',
        data: { hospital: mockDb.hospitals[index] }
      });
    }

    if (req.body.districtCode) {
      req.body.districtCode = req.body.districtCode.toLowerCase();
    }

    const hospital = await Hospital.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!hospital) {
      return next(new AppError('No hospital found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { hospital }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteHospital = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (global.dbOffline) {
      const index = mockDb.hospitals.findIndex(h => h._id === id);
      if (index === -1) {
        return next(new AppError('No hospital found with that ID', 404));
      }
      mockDb.hospitals.splice(index, 1);
      return res.status(204).json({
        status: 'success',
        data: null
      });
    }

    const hospital = await Hospital.findByIdAndDelete(id);

    if (!hospital) {
      return next(new AppError('No hospital found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
