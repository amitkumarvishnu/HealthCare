const Consultation = require('../models/Consultation');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// Get consultation requests for the logged-in doctor's account
exports.getConsultationRequests = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    const doctorId = req.user.doctorId;
    const baseUrl = 'http://localhost:5000/uploads'; 

    try {
        // Fetch consultations from the database with patient info
        const consultations = await Consultation.findAll({
            where: { doctorId },
            include: [{ model: User, as: 'Patient', attributes: ['id', 'username', 'email'] }],
        });

        if (!consultations.length) {
            return res.status(404).json({ message: 'No consultation requests found.' });
        }

        // Transform the consultations data to include proper image URLs
        const response = consultations.map((consultation) => {
            const imageUrls = Array.isArray(consultation.imageUrls)
                ? consultation.imageUrls.map((url) => {
                    const urlParts = url.split('\\');
                    return `${baseUrl}/${urlParts[urlParts.length - 1]}`;
                })
                : []; // Default to empty array if no image URLs

            return {
                id: consultation.id,
                patientId: consultation.patientId,
                doctorId: consultation.doctorId,
                status: consultation.status,
                imageUrls,
                patientUsername: consultation.Patient?.username || 'Unknown', // Handle missing patient data
                patientEmail: consultation.Patient?.email || 'Unknown',
                description: consultation.description || 'No description provided',
                date: consultation.date || null,
                startTime: consultation.startTime || null,
                endTime: consultation.endTime || null,
            };
        });

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

        await consultation.save();
        res.json({ message: 'Consultation updated successfully', consultation });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update status' });
    }
};

// Make only to fetch Accepted status from a doctorId
exports.getAcceptedConsultations = async (req, res) => {
    const { doctorId } = req.query;

    if (!doctorId) {
        return res.status(400).json({ message: 'Doctor ID is required.' });
    }

    try {
        const consultations = await Consultation.findAll({
            where: { doctorId, status: 'Accepted' },
            include: [{
                model: User,
                as: 'Patient',
                attributes: ['id', 'username', 'email']
            }]
        });

        if (!consultations.length) {
            return res.status(404).json({ message: 'No accepted consultations found.' });
        }

        const response = consultations.map(consultation => ({
            id: consultation.id,
            patientId: consultation.patientId,
            doctorId: consultation.doctorId,
            status: consultation.status,
            patientUsername: consultation.Patient.username,
        }));

        res.json(response);
    } catch (error) {
        console.error('Error fetching accepted consultations:', error);
        res.status(500).json({ error: 'Failed to fetch accepted consultations' });
    }
};


