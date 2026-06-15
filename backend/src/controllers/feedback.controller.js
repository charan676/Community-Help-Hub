const Feedback = require('../models/feedback.model');
const AppError = require('../utils/AppError');
const mockDb = require('../utils/mockDb');

exports.submitFeedback = async (req, res, next) => {
  try {
    const { name, email, message, category } = req.body;

    if (global.dbOffline) {
      const newFeedback = {
        _id: `feedback_${Date.now()}`,
        userId: req.user ? req.user._id : null,
        name,
        email,
        message,
        category: category || 'suggestion',
        status: 'pending',
        createdAt: new Date()
      };
      mockDb.feedbacks.push(newFeedback);
      return res.status(201).json({
        status: 'success',
        data: { feedback: newFeedback }
      });
    }

    const newFeedback = await Feedback.create({
      userId: req.user ? req.user._id : null,
      name,
      email,
      message,
      category
    });

    res.status(201).json({
      status: 'success',
      data: { feedback: newFeedback }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllFeedbacks = async (req, res, next) => {
  try {
    if (global.dbOffline) {
      const sorted = [...mockDb.feedbacks].sort((a, b) => b.createdAt - a.createdAt);
      return res.status(200).json({
        status: 'success',
        results: sorted.length,
        data: { feedbacks: sorted }
      });
    }

    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: feedbacks.length,
      data: { feedbacks }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateFeedbackStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return next(new AppError('Invalid feedback status value', 400));
    }

    if (global.dbOffline) {
      const index = mockDb.feedbacks.findIndex(f => f._id === id);
      if (index === -1) {
        return next(new AppError('No feedback found with that ID', 404));
      }
      mockDb.feedbacks[index].status = status;
      return res.status(200).json({
        status: 'success',
        data: { feedback: mockDb.feedbacks[index] }
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return next(new AppError('No feedback found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { feedback }
    });
  } catch (error) {
    next(error);
  }
};
