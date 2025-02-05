const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const plansRoutes = require('./routes/plansRoutes');
const fileUpload = require('express-fileupload');

const port = 3000;
const dbURL = 'mongodb+srv://Miguel:palavraPasse@doghotel.egvtbmc.mongodb.net/DogHotel?retryWrites=true&w=majority&appName=DogHotel';

const app = express();

// Increase file size limit for express-fileupload to 1 MB
app.use(fileUpload({
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB
}));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Set up CORS options
const corsOptions = {
  origin: 'http://localhost:4200', // Allow requests from this origin
  optionsSuccessStatus: 204,
  methods: 'GET, POST, PUT', // Allowed HTTP methods
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}

// Enable CORS with the specified options
app.use(cors(corsOptions));

// Increase body size limit for body-parser to 1 MB
app.use(bodyParser.json({ limit: '1mb' })); // Parse JSON bodies
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true })); // Parse URL-encoded bodies

// Connect to MongoDB
mongoose.connect(dbURL)
  .then(() => app.listen(port, () => {
    console.log(`Listening on port ${port}`) // Log a message when the server starts
  }))
  .catch(err => console.log(err)); // Log any connection errors

// Set up routes
app.use('/users', userRoutes); // Routes for user-related operations
app.use('/auth', authRoutes); // Routes for authentication-related operations
app.use('/reservations', reservationRoutes); // Routes for reservation-related operations
app.use('/price-plans', plansRoutes); // Routes for price plan-related operations
