// config/config.js
require('dotenv').config();

const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nodevault',
    dbName: process.env.DB_NAME || 'nodevault'
  },
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  }
};

// Validate required environment variables
const validateConfig = () => {
  if (!config.mongodb.uri) {
    throw new Error('❌ MONGODB_URI is required in .env file');
  }
  
  console.log('✅ Configuration loaded successfully');
  console.log(`📊 Environment: ${config.app.env}`);
  console.log(`🗄️  Database: ${config.mongodb.dbName}`);
};

module.exports = { config, validateConfig };