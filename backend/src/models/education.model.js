const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true, trim: true },
    te: { type: String, required: true, trim: true }
  },
  description: {
    en: { type: String, required: true, trim: true },
    te: { type: String, required: true, trim: true }
  },
  providerName: { type: String, required: true, trim: true }, // e.g. APSSDC, SWAYAM, NPTEL
  category: { 
    type: String, 
    enum: ['skills', 'scholarship', 'courses', 'career_opportunities'], 
    default: 'courses',
    index: true
  },
  linkUrl: { type: String, required: true },
  isFree: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Education', EducationSchema);
