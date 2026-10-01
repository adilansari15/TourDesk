import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('FATAL ERROR: MONGODB_URI is not defined in environment variables.');
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('💡 Atlas Tip: Ensure 0.0.0.0/0 is added to your MongoDB Atlas Network Access whitelist.');
    throw error;
  }
};

export default connectDB;
