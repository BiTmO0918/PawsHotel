var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');
var userController = require('../controllers/userController');

// Route for user login
router.post('/login', authController.login);

// Route for user registration
router.post('/register', authController.register);

// Route for user logout
router.get('/logout', authController.logout);

// Route to get the profile of the logged-in user
router.get('/profile', authController.verifyToken, authController.profile);

// Route to check if the logged-in user is an admin
router.get('/isAdmin', authController.verifyToken, authController.checkAdmin);

module.exports = router;
