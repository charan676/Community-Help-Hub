const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true, trim: true },
    te: { type: String, required: true, trim: true }
  },
  icon: { type: String, default: '📞' },
  description: {
    en: { type: String, trim: true },
    te: { type: String, trim: true }
  },
  contactNumber: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['medical', 'police', 'fire', 'disaster', 'women', 'child', 'other'], 
    default: 'other',
    index: true
  },
  districtCode: { type: String, index: true }, // null for state-wide
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Emergency', EmergencySchema);
