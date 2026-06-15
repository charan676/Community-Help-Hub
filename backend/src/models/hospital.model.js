const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true, trim: true },
    te: { type: String, required: true, trim: true }
  },
  description: {
    en: { type: String, trim: true },
    te: { type: String, trim: true }
  },
  contactNumber: { type: String, required: true },
  address: {
    en: { type: String, required: true },
    te: { type: String, required: true }
  },
  googleMapsUrl: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  districtCode: { type: String, required: true, index: true },
  category: { type: String, enum: ['government', 'private', 'PHC', 'blood_bank'], default: 'government' },
  hasBloodBank: { type: Boolean, default: false },
  is24_7: { type: Boolean, default: true }
}, { timestamps: true });

HospitalSchema.index({ location: '2dsphere' });
HospitalSchema.index({ 'name.en': 'text', 'name.te': 'text', districtCode: 1 });

module.exports = mongoose.model('Hospital', HospitalSchema);
