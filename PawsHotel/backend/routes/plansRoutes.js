const express = require('express');
const controller = require('../controllers/plansController');
const authController = require('../controllers/authController');
const router = express.Router();

// Route to get all price plans
router.get('/plans', controller.get_plans);

// Route to save new or update existing price plans, only accessible by admin
router.post('/plans', authController.verifyToken, authController.verifyRoleAdmin, controller.save_plans);

module.exports = router;
