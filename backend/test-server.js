import express from 'express';
import cors from 'cors';

const app = express();

// CORS Configuration 
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test worker task routes without database
app.put('/api/worker-tasks/:taskId/:workerId/status', (req, res) => {
  const { taskId, workerId } = req.params;
  const { status } = req.body;
  
  res.json({
    success: true,
    message: 'Worker task status updated (mock)',
    data: {
      taskId,
      workerId,
      status,
      updatedAt: new Date()
    }
  });
});

app.get('/api/worker-tasks/:taskId/:workerId', (req, res) => {
  const { taskId, workerId } = req.params;
  
  res.json({
    success: true,
    data: {
      taskId,
      workerId,
      status: 'todo'
    }
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log('🧪 Worker Task API routes are configured');
});