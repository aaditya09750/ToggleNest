const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const connectDB = async (retries = 3, delayMs = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host} ...`);
      console.log(`Database Name: ${conn.connection.name} ...`);
      return conn;
    } catch (error) {
      console.error(
        `MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`
      );
      if (attempt === retries) {
        console.error('All retry attempts exhausted. Exiting.');
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

module.exports = connectDB;
