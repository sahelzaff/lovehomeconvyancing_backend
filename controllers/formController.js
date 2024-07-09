import formModel from "../models/formmodel.js";

// Controller to handle form submission
export const submitForm = async (req, res) => {
    try {
        const newForm = new formModel(req.body);
        await newForm.save();
        res.status(201).send(newForm);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Controller to retrieve all form data
export const getFormData = async (req, res) => {
    try {
        const forms = await formModel.find();
        res.status(200).send(forms);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Controller to retrieve leads (optional, if different logic is needed)
export const getLeads = async (req, res) => {
    try {
        const leads = await formModel.find();
        res.status(200).send(leads);
    } catch (error) {
        res.status(500).send(error);
    }
};
