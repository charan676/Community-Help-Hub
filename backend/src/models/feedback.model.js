const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
  category: { type: String, enum: ['complaint', 'suggestion', 'emergency_issue'], default: 'suggestion' }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
