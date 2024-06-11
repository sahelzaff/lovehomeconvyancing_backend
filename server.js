import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import formRoutes from './routes/formRoutes.js';

// App config
const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// Routes
app.use('/api/form', formRoutes);

app.get('/', (req, res) => {
    res.send('API Working');
});

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
