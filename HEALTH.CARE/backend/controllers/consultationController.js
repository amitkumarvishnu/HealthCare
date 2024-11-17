const Consultation = require('../models/Consultation');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const TimeSlot = require('../models/TimeSlot')

// available doctors
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],  // Include the username from User
                },
                {
                    model: TimeSlot,
                    attributes: ['startTime', 'endTime', 'isAvailable'],  // Include time slots data
                },
            ],
            attributes: ['id', 'specialization', 'contactDetails'],  // Include the doctor's basic details
        });

        // Format the doctors to include time slots
        const formattedDoctors = doctors.map(doctor => ({
            id: doctor.id,
            name: doctor.User.username,
            specialization: doctor.specialization,
            timeSlots: doctor.TimeSlots.map(slot => ({
                startTime: slot.startTime,
                endTime: slot.endTime,
                isAvailable: slot.isAvailable,
            }))
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
        const { patientId, doctorId,description } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Imagerequired' });
        }

        const imageUrl = req.file.path; 

        const consultation = await Consultation.create({
            patientId,
            doctorId,
            imageUrl,
            description
        });

        res.status(201).json({ message: 'Consult requested', consultation });
    } catch (error) {
        res.status(500).json({ error: 'Failed consultation' });
    }
};



exports.getConsultationStatus = async (req, res) => {
    const { patientId } = req.params;

    try {
        const consultations = await Consultation.findAll({
            where: { patientId },
            attributes: ['id', 'doctorId', 'status',],
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
            return res.status(404).json({ message: 'No consultations' });
        }

        const formattedConsultations = consultations.map(consultation => ({
            id: consultation.id,
            doctorId: consultation.doctorId,
            status: consultation.status,
            doctorName: consultation.Doctor.User.username, 
            specialty: consultation.Doctor.specialization, 
        }));

        res.json(formattedConsultations);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};

