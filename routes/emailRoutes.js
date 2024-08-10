import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises'; // Use promises API for async file operations
import { fileURLToPath } from 'url'; // Import fileURLToPath
import sendQuotationEmail from '../controllers/emailController.js';

const router = express.Router();

// Set up multer to store files in the 'uploads' directory in the root
const upload = multer({ dest: 'uploads/' });

// Create __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/send-email', upload.single('pdf'), async (req, res) => {
    // Check if the file was uploaded
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const userEmail = req.body.email; // Get email from the request body
    const userName = req.body.name; // Get name from the request body
    const pdfPath = path.join(__dirname, '../uploads', req.file.filename); // Path to the uploaded PDF

    try {
        // Send email with the PDF attached
        await sendQuotationEmail(userEmail, userName, pdfPath);

        // Delete the file after sending the email
        await fs.unlink(pdfPath);

        res.send('Email sent and PDF saved locally successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
});

export default router;