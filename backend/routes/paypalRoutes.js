const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypal/paymentController');

// Route to verify a payment
router.post('/verify-payment', paypalController.verifyPayment); 

module.exports = router;