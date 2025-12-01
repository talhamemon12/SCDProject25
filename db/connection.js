const mongoose = require('mongoose');
const { config } = require('../config/config');

const connectDB = async () => {
  try {
    // Remove deprecated options - they're now defaults in Mongoose 6+
    await mongoose.connect(config.mongodb.uri);
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📍 Connected to: ${mongoose.connection.host}`);
    console.log(`🗄️  Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

// Handle process termination gracefully
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;