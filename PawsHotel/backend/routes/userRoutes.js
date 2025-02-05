const express = require('express');
const controller = require('../controllers/userController');
const authController = require('../controllers/authController');
const helpRequestController = require('../controllers/helpRequestController');
const router = express.Router();

// Route to get all users, only accessible by admin
router.get('/all-users', authController.verifyToken, authController.verifyRoleAdmin, controller.user_all);

// Route to get all help requests, only accessible by admin
router.get('/all-requests', authController.verifyToken, authController.verifyRoleAdmin, helpRequestController.request_all);

// Route to create a new help request, accessible by all
router.post('/create-request', helpRequestController.create_request);

// Route to create a new help request by a logged-in user
router.post('/create-user-request', authController.verifyToken, helpRequestController.create_user_request);

// Route to delete a help request by ID, only accessible by admin
router.post('/delete-request/:id', authController.verifyToken, authController.verifyRoleAdmin, helpRequestController.request_delete);

// Route to set a user as inactive by ID, only accessible by admin
router.post('/inactive/:id', authController.verifyToken, authController.verifyRoleAdmin, controller.user_inactive);

// Route to set a user as active by ID, only accessible by admin
router.post('/active/:id', authController.verifyToken, authController.verifyRoleAdmin, controller.user_active);

// Route to edit the profile of a logged-in user
router.post('/edit-profile', authController.verifyToken, controller.edit_user_profile);

module.exports = router;
