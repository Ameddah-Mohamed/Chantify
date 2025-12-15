import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/connection.js';

// Load environment variables
dotenv.config();

// Import routes
import taskRoutes from './routes/taskRoutes.js';
import simpleUserRoutes from './routes/simpleUserRoutes.js';
import workerTaskRoutes from './routes/workerTaskRoutes.js';
// const authRoutes = require('./routes/authRoutes');
// const companyRoutes = require('./routes/companyRoutes');
// const userRoutes = require('./routes/userRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// CORS Configuration 
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', simpleUserRoutes);
app.use('/api/worker-tasks', workerTaskRoutes);
// app.use('/api/companies', companyRoutes);
// app.use('/api/users', userRoutes);

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
  console.log(` MongoDB: ${process.env.MONGO_URI || 'Not configured'}`);
});