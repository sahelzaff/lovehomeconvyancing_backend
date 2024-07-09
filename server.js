import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv'

// Import database connection
import { connectDB } from './config/db.js';

// Import routes
import formRoutes from './routes/formRoutes.js';
import leadsRoutes from './routes/leadsRoutes.js'; // Ensure this is correctly imported
import blogRoutes from './routes/blogRoutes.js';
import googleRoutes from './routes/googleRoutes.js';
import emailRoutes from './routes/emailRoutes.js'; // Import the email routes
import { isModuleNamespaceObject } from 'util/types';

// App config
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads'))); // Serve static files

// DB connection
connectDB(); // Assuming this function sets up your database connection

// Routes
app.use('/api/form', formRoutes);
app.use('/api/lead-cal', leadsRoutes); // Ensure this is correctly used
app.use('/api/blogs', blogRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/email', emailRoutes); // Use the email routes

// Root endpoint
app.get('/', (req, res) => {
    res.send('API Working');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
