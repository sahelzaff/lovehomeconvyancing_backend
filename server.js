import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Import database connection
import { connectDB } from './config/db.js';

// Import routes
import formRoutes from './routes/formRoutes.js';
import leadsRoutes from './routes/leadsRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import googleRoutes from './routes/googleRoutes.js';
import emailRoutes from './routes/emailRoutes.js'; // <-- New Email Routes

// App config
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// Routes
app.use('/api/form', formRoutes);
app.use('/api/lead-cal', leadsRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/email', emailRoutes); // <-- New Email Route

// Root endpoint
app.get('/', (req, res) => {
    res.send('API Working');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port lovehomeconvyancingbackend-production.up.railway.app:${port}`);
    console.log('Server environment:', process.env.NODE_ENV || 'development');
});
