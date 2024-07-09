// routes/leadRoutes.js
import express from 'express';
import Leadcalmodel from '../models/Leadcalmodel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { transactionType, propertyType, area, name, email, phone } = req.body;

    try {
        const newLead = new Leadcalmodel({ transactionType, propertyType, area, name, email, phone });
        await newLead.save();
        res.status(201).json(newLead);
    } catch (error) {
        res.status(500).json({ message: 'Failed to save lead', error: error.message });
    }
});

export default router;
