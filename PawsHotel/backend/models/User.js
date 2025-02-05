const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the structure of the 'User' collection
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true // First name is required
    }, 
    lastName: {
        type: String,
        required: true // Last name is required
    },
    email: {
        type: String,
        unique: true, // Email must be unique
        required: true // Email is required
    },
    phone: {
        type: Number,
        unique: true, // Phone number must be unique
        required: true // Phone number is required
    },
    address: {
        type: String,
        unique: true, // Address must be unique
        required: true // Address is required
    },
    password: {
        type: String,
        required: true // Password is required
    },
    active: {
        type: Boolean,
        required: true // Active status is required
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Create a model for the 'User' collection
const User = mongoose.model('User', userSchema);

module.exports = User;
