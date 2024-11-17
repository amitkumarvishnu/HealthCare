const express = require('express');
const router = express.Router();
const timeSlotController = require('../controllers/timeSlotController');

// Create time slots for a doctor
router.post('/doctor/:doctorId/time-slots', timeSlotController.createTimeSlots);

// Get time slots for a specific doctor
router.get('/doctor/:doctorId/time-slots', timeSlotController.getTimeSlots);

// Update a specific time slot for a doctor
router.put('/doctor/:doctorId/time-slot/:timeSlotId', timeSlotController.updateTimeSlot);

// DELETE time slot for a specific doctor
router.delete('/doctor/:doctorId/time-slot/:timeSlotId', timeSlotController.deleteTimeSlot);

module.exports = router;
