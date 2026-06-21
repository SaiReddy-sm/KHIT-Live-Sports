// ==========================================
// KHIT Live Sports Portal - Database Config
// ==========================================

const mongoose = require('mongoose');

/**
 * Establishes a connection to the MongoDB Atlas database instance
 * utilizing the MONGO_URI value specified in the environment file.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`Database Status: Connected`);
    console.log(`Database Host: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    // Terminate the Node.js process immediately with a failure exit code (1)
    process.exit(1);
  }
};

module.exports = connectDB;