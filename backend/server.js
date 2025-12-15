const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/connection');

// Load environment variables
dotenv.config();

// Import routes
const taskRoutes = require('./routes/taskRoutes');
const simpleUserRoutes = require('./routes/simpleUserRoutes');
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