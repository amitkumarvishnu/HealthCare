const Consultation = require('../models/Consultation');
const User = require('../models/User');
const Doctor = require('../models/Doctor'); 

// Get consultation requests for the logged-in doctor's account
exports.getConsultationRequests = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    const doctorId = req.user.doctorId;
    const baseUrl = 'http://localhost:5000/';

    try {
        const consultations = await Consultation.findAll({
            where: { doctorId },
            include: [{ model: User, as: 'Patient', attributes: ['id', 'username', 'email'] }],
        });

        // Check if consultations are found...
        if (!consultations.length) {
            return res.status(404).json({ message: 'No consultation requests found.' });
        }

        // Map the consultation data to the response format
        const response = consultations.map(consultation => ({
            id: consultation.id,
            patientId: consultation.patientId,
            doctorId: consultation.doctorId,
            status: consultation.status,
            // Handle multiple image URLs
            imageUrls: consultation.imageUrls ? consultation.imageUrls.map(url => `${baseUrl}${url.replace(/\\/g, '/')}`) : [],
            patientUsername: consultation.Patient.username,
            patientEmail: consultation.Patient.email,
            description: consultation.description,
            date: consultation.date, // Ensure date is included
            startTime: consultation.startTime, // Include start time
            endTime: consultation.endTime, // Include end time
        }));

        // Send the response
        res.json(response);
    } catch (error) {
        console.error('Error fetching consultation requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
};




// Update consultation status 
exports.updateConsultationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    try {
        const consultation = await Consultation.findByPk(id);
        console.log('Received status:', status); 

        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found.' });
        }

        // Update consultation status based on the received status
        if (status === 'Accepted') {
            consultation.status = 'Accepted';
        } else if (status === 'Confirmed') {
            if (consultation.status === 'Accepted') {
                consultation.status = 'Confirmed';
            } else {
                return res.status(400).json({ message: 'Cannot confirm consultation unless accepted.' });
            }
        } else if (status === 'Completed') {
            if (consultation.status === 'Confirmed') {
                consultation.status = 'Completed';
            } else {
                return res.status(400).json({ message: 'Cannot complete consultation unless confirmed.' });
            }
        } else if (status === 'Rejected') {
            consultation.status = 'Rejected';
        } else {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Save the updated consultation object
        await consultation.save();
        res.json({ message: 'Consultation updated successfully', consultation });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update status' });
    }
};

//make only to fetch Accepted status from a doctorId 
exports.getAcceptedConsultations = async (req, res) => {
    // Get the doctorId from the query parameters (not from URL params)
    const { doctorId } = req.query;

    if (!doctorId) {
        return res.status(400).json({ message: 'Doctor ID is required.' });
    }

    try {
        // Fetch consultations where the status is 'Accepted' for the given doctorId
        const consultations = await Consultation.findAll({
            where: { doctorId, status: 'Accepted' }, // Filter by doctorId and status
            include: [
                {
                    model: User,
                    as: 'Patient', // Include associated patient data
                    attributes: ['id', 'username', 'email'] // Fetch specific patient attributes
                }
            ]
        });

        // If no consultations are found, return a 404 error
        if (!consultations.length) {
            return res.status(404).json({ message: 'No accepted consultations found.' });
        }

        // Map the consultations to a response format
        const response = consultations.map(consultation => ({
            id: consultation.id,
            patientId: consultation.patientId,
            doctorId: consultation.doctorId,
            status: consultation.status,
            patientUsername: consultation.Patient.username,
           
        }));

        // Return the response with the consultations data
        res.json(response);
    } catch (error) {
        console.error('Error fetching accepted consultations:', error);
        res.status(500).json({ error: 'Failed to fetch accepted consultations' });
    }
};



