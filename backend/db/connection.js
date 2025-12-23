import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    console.log('⚠️ Server will continue without database connection');
    // Don't exit process, let server continue
    return null;
  }
};

export default connectDB;
