const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the structure of the 'HelpRequest' collection
const helpRequestSchema = new Schema({
    fullName: {
        type: String,
        required: true // Full name is required
    },
    email: {
        type: String,
        required: true // Email is required
    },
    phone: {        
        type: Number,
        required: false // Phone is not required (not unique due to MongoServerError: E11000 duplicate key error)
    },
    subject: {
        type: String,
        required: true // Subject is required
    },
    message: {
        type: String,
        required: true // Message is required
    },
    active: {
        type: Boolean,
        required: true // Active status is required
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Create a model for the 'HelpRequest' collection
const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);

module.exports = HelpRequest;
