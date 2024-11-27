const TimeSlot = require('../models/TimeSlot');
const Doctor = require('../models/Doctor');

// Create multiple time slots for a doctor
const createTimeSlots = async (req, res) => {
    const { doctorId } = req.params;
    const { slots } = req.body; // Assuming `slots` contains an array of slot objects, each with startTime, endTime, and date

    try {
        // Validate if the doctor exists
        const doctor = await Doctor.findByPk(doctorId);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Create time slots for the doctor, ensuring each slot has a date
        const createdSlots = await Promise.all(slots.map(slot => {
            return TimeSlot.create({
                doctorId,
                date: slot.date, // Add the date to each slot
                startTime: slot.startTime,
                endTime: slot.endTime,
                isAvailable: slot.isAvailable || true,  // Default to available
            });
        }));

        res.status(201).json({
            message: 'Time slots created successfully',
            slots: createdSlots,
        });
    } catch (error) {
        console.error('Error creating time slots:', error);
        res.status(500).json({ error: 'Failed to create time slots' });
    }
};

// Get all time slots for a specific doctor
const getTimeSlots = async (req, res) => {
    const { doctorId } = req.params;  // Get doctorId from the URL

    try {
        const slots = await TimeSlot.findAll({
            where: { doctorId },
            order: [['date', 'ASC'], ['startTime', 'ASC']],
            attributes: ['id', 'date', 'startTime', 'endTime', 'isAvailable'], // Include 'id' here
        });

        if (!slots.length) {
            return res.status(404).json({ message: 'No time slots found for this doctor' });
        }

        // Format the response to include date and time information
        const formattedSlots = slots.map(slot => ({
            id: slot.id,  // Add id to the formatted response
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.isAvailable,
        }));

        res.status(200).json({ slots: formattedSlots });
    } catch (error) {
        console.error('Error fetching time slots:', error);
        res.status(500).json({ error: 'Failed to fetch time slots' });
    }
};



// Update a specific time slot
const updateTimeSlot = async (req, res) => {
    const { doctorId, timeSlotId } = req.params;
    const { date, startTime, endTime, isAvailable } = req.body;

    try {
        const timeSlot = await TimeSlot.findOne({ where: { id: timeSlotId, doctorId } });

        if (!timeSlot) {
            return res.status(404).json({ error: 'Time slot not found' });
        }

        // Update time slot details
        timeSlot.date = date || timeSlot.date; // Update date if provided
        timeSlot.startTime = startTime || timeSlot.startTime;
        timeSlot.endTime = endTime || timeSlot.endTime;
        timeSlot.isAvailable = isAvailable !== undefined ? isAvailable : timeSlot.isAvailable;

        await timeSlot.save();

        res.status(200).json({ message: 'Time slot updated successfully', slot: timeSlot });
    } catch (error) {
        console.error('Error updating time slot:', error);
        res.status(500).json({ error: 'Failed to update time slot' });
    }
};

// Delete a specific time slot
const deleteTimeSlot = async (req, res) => {
    const { doctorId, timeSlotId } = req.params;

    try {
        const timeSlot = await TimeSlot.findOne({ where: { id: timeSlotId, doctorId } });

        if (!timeSlot) {
            return res.status(404).json({ error: 'Time slot not found' });
        }

        // Delete the time slot
        await timeSlot.destroy();

        res.status(200).json({ message: 'Time slot deleted successfully' });
    } catch (error) {
        console.error('Error deleting time slot:', error);
        res.status(500).json({ error: 'Failed to delete time slot' });
    }
};

module.exports = {
    createTimeSlots,
    getTimeSlots,
    updateTimeSlot,
    deleteTimeSlot,  
};
