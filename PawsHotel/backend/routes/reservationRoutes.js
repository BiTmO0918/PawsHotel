const express = require('express');
const controller = require('../controllers/reservationController');
const authController = require('../controllers/authController');
const router = express.Router();

// Route to get all reservations, only accessible by admin
router.get('/list-all', authController.verifyToken, authController.verifyRoleAdmin, controller.list_reservations);

// Route to get reservations for the logged-in user
router.get('/list', authController.verifyToken, controller.list_user_reservations);

// Route to get a specific reservation by ID
router.get('/:id', authController.verifyToken, controller.get_reservation_by_id);

// Route to create a new reservation
router.post('/create-reservation', authController.verifyToken, controller.create_reservation);

// Route to update an existing reservation by ID
router.put('/update/:id', authController.verifyToken, controller.update_reservation);

module.exports = router;
