const Consultation = require('../models/Consultation');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const TimeSlot = require('../models/TimeSlot')


exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username','gender'],  
                },
                {
                    model: TimeSlot,
                    attributes: ['date', 'startTime', 'endTime', 'isAvailable'], 
                },
            ],
            attributes: ['id', 'specialization', 'contactDetails', 'image','experience'],  
        });

        // Format the doctors to include time slots and correctly formatted image URL
        const formattedDoctors = doctors.map(doctor => ({
            id: doctor.id,
            name: doctor.User.username,
            gender: doctor.User.gender,
            image: doctor.image ? `http://localhost:5000/${doctor.image}` : null,
            specialization: doctor.specialization,
            experience: doctor.experience,
            timeSlots: doctor.TimeSlots.map(slot => ({
                date: slot.date,  
                startTime: slot.startTime,
                endTime: slot.endTime,
                isAvailable: slot.isAvailable,
            })),
        }));

        res.json(formattedDoctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to find doctors' });
    }
};







// Request a consultation
exports.requestConsultation = async (req, res) => {
    try {
        const { patientId, doctorId, description, date, startTime, endTime } = req.body;

       
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Images required' });
        }

        
        const imageUrls = req.files.map(file => file.path);

       
        if (!date || !startTime || !endTime) {
            return res.status(400).json({ error: 'Date, startTime, and endTime are required' });
        }

        

        const consultation = await Consultation.create({
            patientId,
            doctorId,
            imageUrls,
            description,
            date, 
            startTime, 
            endTime, 
        });

        res.status(201).json({ message: 'Consultation requested', consultation });
    } catch (error) {
        console.error('Error in requestConsultation:', error); 
        res.status(500).json({ error: 'Failed to request consultation' });
    }
};






exports.getConsultationStatus = async (req, res) => {
    const { patientId } = req.params;

    try {
        const consultations = await Consultation.findAll({
            where: { patientId },
            attributes: ['id', 'doctorId', 'status', 'date', 'startTime', 'endTime'],
            include: [{
                model: Doctor,
                attributes: ['specialization'],
                include: [{
                    model: User,
                    attributes: ['username'], 
                }],
            }],
        });

        if (!consultations.length) {
            return res.status(404).json({ message: 'No consultations found' });
        }

        const formattedConsultations = consultations.map(consultation => ({
            id: consultation.id,
            doctorId: consultation.doctorId,
            status: consultation.status,
            doctorName: consultation.Doctor.User.username, 
            specialty: consultation.Doctor.specialization,
            date: consultation.date, // Include date
            startTime: consultation.startTime, // Include start time
            endTime: consultation.endTime, // Include end time
        }));

        res.json(formattedConsultations);
    } catch (error) {
        console.error('Error in getConsultationStatus:', error); 
        res.status(500).json({ error: 'Failed to retrieve consultation status' });
    }
};

exports.updateDoctor = async (req, res) => {
    const doctorId = req.params.id; 
    const { specialization, experience, contactDetails, image } = req.body;  // Removed timeSlots from the destructuring

    try {
        // Step 1: Find the doctor by ID
        const doctor = await Doctor.findByPk(doctorId, {
            include: [
                {
                    model: User,
                    attributes: ['username', 'gender'],
                },
            ],
        });

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Step 2: Update doctor details
        // Update the doctor with the provided data, only updating non-null values
        if (specialization) doctor.specialization = specialization;
        if (experience) doctor.experience = experience;
        if (contactDetails) doctor.contactDetails = contactDetails;
        if (image) doctor.image = image;

        // Save the updated doctor data
        await doctor.save();

        // Step 3: Return the updated doctor details (no time slots)
        const updatedDoctor = await Doctor.findByPk(doctorId, {
            include: [
                {
                    model: User,
                    attributes: ['username', 'gender'],
                },
            ],
        });

        // Return the updated doctor data without time slots
        res.json({
            id: updatedDoctor.id,
            name: updatedDoctor.User.username,
            gender: updatedDoctor.User.gender,
            image: updatedDoctor.image ? `http://localhost:5000/${updatedDoctor.image}` : null,
            specialization: updatedDoctor.specialization,
            experience: updatedDoctor.experience,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update doctor data' });
    }
};


