// server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connection.js";
import cors from 'cors';

// Routes
import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobTypeRoutes from "./routes/jobTypeRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import simpleUserRoutes from "./routes/simpleUserRoutes.js";
import dashboardRoutes from './routes/dashboard.routes.js';
import timeEntryRoutes from "./routes/timeEntry.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/users", simpleUserRoutes); // Changed to use simpleUserRoutes for workers
app.use("/api/jobtypes", jobTypeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/simple-users', simpleUserRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/time-entries', timeEntryRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Chantify API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Start server only after connecting to MongoDB
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();  // connectDB() is called only once
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('⚠️ MongoDB connection failed:', err.message);
    process.exit(1); // stop server if DB fails
  }
};

startServer();
