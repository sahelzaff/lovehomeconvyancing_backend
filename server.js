import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Import database connection
import { connectDB } from './config/db.js';

// Import routes
import formRoutes from './routes/formRoutes.js';
import leadsRoutes from './routes/leadsRoutes.js';
// import blogRoutes from './routes/blogRoutes.js';
import googleRoutes from './routes/googleRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

// App config
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// DB connection
connectDB();

// Routes
app.use('/api/form', formRoutes);
app.use('/api/lead-cal', leadsRoutes);
// app.use('/api/blogs', blogRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/email', emailRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('API Working');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
