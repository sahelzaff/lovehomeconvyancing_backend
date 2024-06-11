import express from 'express';
import { submitForm, getFormData } from '../controllers/formController.js';

const router = express.Router();


router.post('/submit', submitForm);


router.get('/data', getFormData);

export default router;
