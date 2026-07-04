const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hrms';
  
  const options = {
    serverSelectionTimeoutMS: 5000, // wait 5 seconds before timeout
  };

  console.log(`Mongoose connection: Attempting link to ${mongoURI}...`);

  mongoose.connection.on('connected', () => {
    console.log('\n[DATABASE] MongoDB Connection Established Successfully.\n');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`\n[DATABASE] MongoDB connection error: ${err.message}\n`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('\n[DATABASE] MongoDB Connection lost. Mongoose will attempt to reconnect...\n');
  });

  try {
    await mongoose.connect(mongoURI, options);
  } catch (error) {
    console.error(`\n===================================================================`);
    console.error(`[DATABASE OFF-LINE] Initial connection attempt failed.`);
    console.error(`Details: ${error.message}`);
    console.error(`WARNING: The application is running, but database features will fail.`);
    console.error(`Please make sure your MongoDB instance is running at the configured URI.`);
    console.error(`===================================================================\n`);
  }
};

module.exports = connectDB;
