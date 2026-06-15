const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/community_help_hub';
    
    // Set connection timeout limit
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    
    global.dbOffline = false;
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    global.dbOffline = true;
    logger.warn('--- DATABASE WARNING ---');
    logger.warn(`Could not connect to MongoDB: ${error.message}`);
    logger.warn('The application is running in Mock DB/Offline mode using in-memory datasets.');
    logger.warn('------------------------');
  }
};

module.exports = connectDB;
