import mongoose from "mongoose";

// Define the schema
const formSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});


const formmodel = mongoose.models.form || mongoose.model("form", formSchema);

export default formmodel;