const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the structure of the 'Reservation' collection
const reservationSchema = new Schema({
  owner: { 
    type: String, 
    required: true // Owner is required
  },
  localization: { 
    type: String, 
    required: true // Localization is required
  },
  startDate: { 
    type: Date, 
    required: true // Start date is required
  },
  endDate: { 
    type: Date, 
    required: true // End date is required
  },
  animalName: { 
    type: String, 
    required: true // Animal name is required
  },
  animalSpecie: { 
    type: String, 
    required: true // Animal species is required
  },
  animalBreed: { 
    type: String, 
    required: true // Animal breed is required
  },
  photoURL: { 
    type: String, 
    required: true // Photo URL is required
  },
  vaccinationCardURL: { 
    type: String, 
    required: true // Vaccination card URL is required
  },
  obs: { 
    type: String, 
    required: true // Observations are required
  },
  discountCode: { 
    type: String, 
    required: true // Discount code is required
  },
  price: { 
    type: Number, 
    required: true // Price is required
  },
  status: { 
    type: String, 
    required: true // Status is required
  }
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Create a model for the 'Reservation' collection
const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
