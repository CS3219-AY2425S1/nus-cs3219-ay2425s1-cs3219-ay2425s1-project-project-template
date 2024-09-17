import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoDbURI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoDbURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
};

export default connectDB;
