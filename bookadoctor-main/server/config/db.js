const mongoose = require('mongoose');

// Disable buffering globally so operations fail immediately when MongoDB is down
// This lets the ModelWrapper fallback to file-based storage without a 10s timeout
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/book_a_doctor',
      {
        serverSelectionTimeoutMS: 3000, // Fail fast if MongoDB is unavailable
        connectTimeoutMS: 3000,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('Running in file-based fallback mode (no MongoDB). Data will be stored in server/data/*.json');
  }
};

module.exports = connectDB;
