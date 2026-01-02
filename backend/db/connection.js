import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongo Connected To "${conn.connection.host}"`);
  } catch (error) {
    console.log("Error Connecting To The Database:", error.message);
    throw error; // Let server.js handle exit
  }
};

export default connectDB;
