const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true, trim: true },
    te: { type: String, required: true, trim: true }
  },
  category: { type: String, enum: ['student', 'farmer', 'women', 'senior', 'general'], default: 'general', index: true },
  eligibilityCriteria: {
    en: { type: String, required: true },
    te: { type: String, required: true }
  },
  benefits: {
    en: { type: String, required: true },
    te: { type: String, required: true }
  },
  officialWebsiteUrl: { type: String },
  districtCode: { type: String, index: true }, // Optional - null indicates state-wide
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

SchemeSchema.index({ 'title.en': 'text', 'title.te': 'text' });

module.exports = mongoose.model('Scheme', SchemeSchema);
