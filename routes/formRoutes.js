import express from 'express';
import { submitForm, getFormData, getLeads } from '../controllers/formController.js';

const router = express.Router();

router.post('/submit', submitForm);
router.get('/data', getFormData);
router.get('/leads', getLeads);

export default router;
