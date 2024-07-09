// models/Lead.js
import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    transactionType: { type: String, required: true },
    propertyType: { type: String, required: true },
    area: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
