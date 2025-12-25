// backend/db/connection.js
import mongoose from 'mongoose'; // Changed from require

const connectDB = async () => {
  try {
    console.log("DEBUG: URI is ->", process.env.MONGO_URI); // ADD THIS LINE
    
    if (!process.env.MONGO_URI) {
       throw new Error("MONGO_URI is undefined. Check your .env file location.");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(` ✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(` ❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB; // Changed from module.exports