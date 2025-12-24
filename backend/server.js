
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
import jobTypeRoutes from "./routes/jobTypeRoutes.js"


// Load environment variables
dotenv.config();

// Import routes
import taskRoutes from './routes/taskRoutes.js';
import simpleUserRoutes from './routes/simpleUserRoutes.js';
import workerTaskRoutes from './routes/workerTaskRoutes.js';


const app = express();

// Connect to MongoDB (non-blocking)
connectDB().catch((error) => {
  console.log('⚠️ MongoDB connection failed, continuing without database');
});

// CORS Configuration 
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Middleware
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobtypes", jobTypeRoutes);

// app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', simpleUserRoutes);
app.use('/api/worker-tasks', workerTaskRoutes);
// app.use('/api/companies', companyRoutes);

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});