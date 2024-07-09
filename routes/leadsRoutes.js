// routes/leadRoutes.js
import express from 'express';
import Lead from '../models/Lead.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { transactionType, propertyType, area, name, email, phone } = req.body;

    try {
        const newLead = new Lead({ transactionType, propertyType, area, name, email, phone });
        await newLead.save();
        res.status(201).json(newLead);
    } catch (error) {
        res.status(500).json({ message: 'Failed to save lead', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const leads = await Lead.find();
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve leads', error: error.message });
    }
});

export default router;
