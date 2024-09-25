const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.ENVIRONMENT === 'test' ? process.env.USER_MONGO_URI : process.env.USER_MONGO_CLOUD_URI;
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Exit process if there is a failure
  }
};

module.exports = connectDB;
