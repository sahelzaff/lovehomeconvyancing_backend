import formmodel from '../models/formmodel.js';
import fetch from 'node-fetch';

const RECAPTCHA_SECRET_KEY = '6LfaqO0qAAAAAKsE0sMNB82k8RPty9Db8zuIdjEb';

// Verify reCAPTCHA token
const verifyRecaptcha = async (token) => {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
};

// Submit form controller
export const submitForm = async (req, res) => {
  try {
    const { recaptchaToken, ...formData } = req.body;

    // Verify reCAPTCHA token
    const isVerified = await verifyRecaptcha(recaptchaToken);
    if (!isVerified) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }

    // Create new form entry
    const newForm = new formmodel(formData);
    await newForm.save();

    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ message: 'Error submitting form', error: error.message });
  }
};

// Get form data controller
export const getFormData = async (req, res) => {
  try {
    const forms = await formmodel.find();
    res.status(200).json(forms);
  } catch (error) {
    console.error('Error fetching form data:', error);
    res.status(500).json({ message: 'Error fetching form data', error: error.message });
  }
};

// Get leads count
export const getLeads = async (req, res) => {
  try {
    const count = await formmodel.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting leads:', error);
    res.status(500).json({ message: 'Error counting leads', error: error.message });
  }
};
