const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const mockDb = require('../utils/mockDb');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret-for-development-only-12345', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, preferredLanguage, homeDistrict } = req.body;

    if (global.dbOffline) {
      const existingUser = mockDb.users.find(u => u.email === email.toLowerCase());
      if (existingUser) {
        return next(new AppError('Email already in use', 400));
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = {
        _id: `user_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'citizen',
        phone,
        preferredLanguage: preferredLanguage || 'en',
        homeDistrict: homeDistrict || '',
        isVerified: false,
        createdAt: new Date()
      };

      mockDb.users.push(newUser);
      return sendToken(newUser, 201, res);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      preferredLanguage,
      homeDistrict
    });

    sendToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    if (global.dbOffline) {
      const user = mockDb.users.find(u => u.email === email.toLowerCase());
      if (!user) {
        return next(new AppError('Incorrect email or password', 401));
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new AppError('Incorrect email or password', 401));
      }

      // Clone user to avoid modifying original record with password removal
      const userClone = { ...user };
      return sendToken(userClone, 200, res);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      data: { user: req.user }
    });
  } catch (error) {
    next(error);
  }
};
