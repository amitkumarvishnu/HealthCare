const express = require('express');
const multer = require('multer');
const { register, login, verifyEmail, getRegisterUsers } = require('../controllers/authController');
// const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Save file with a unique name
    }
});

// Create the multer instance
const upload = multer({ storage });

// Update the registration route to handle image uploads
router.post('/register',upload.single('image'), register); 
router.get('/registeredUser',getRegisterUsers)
router.get('/verify-email', verifyEmail);
router.post('/login', login);

module.exports = router;
