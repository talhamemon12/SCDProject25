// db/connection.js
const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/nodevault';

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB Connected Successfully!');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Error:', err);
});

module.exports = connectDB;