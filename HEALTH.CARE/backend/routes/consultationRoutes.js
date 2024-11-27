const express = require('express');
const multer = require('multer');
const {
    getDoctors,
    requestConsultation,
    getConsultationStatus,
    updateDoctor
} = require('../controllers/consultationController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole'); 

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    },
});

const upload = multer({ storage });

router.get('/doctors', getDoctors);
router.put('/updateDoctor/:id', updateDoctor);
router.post('/request', authMiddleware, upload.array('images', 5), requestConsultation);
router.get('/status/:patientId', authMiddleware, checkRole(['patient']), getConsultationStatus);


module.exports = router;
