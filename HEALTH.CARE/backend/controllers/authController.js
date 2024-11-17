const bcrypt = require('bcrypt');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../email/sendMail');

// Registration
const register = async (req, res) => {
    const { email, username, password, role, specialization, contact } = req.body;

    console.log('Received registration data:', req.body);

    if (!email || !username || !password || !role) {
        return res.status(400).json({ error: 'email, username, password, role required' });
    }

    if (!['doctor', 'patient'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    if (role === 'doctor') {
        if (!specialization || !contact) {
            return res.status(400).json({ error: 'specialization and contact required for doctors' });
        }
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            return res.status(400).json({ error: 'Username is already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, username, password: hashedPassword, role });

        // Generate email verification token
        const verificationToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        // Create doctor record if the user is a doctor
        if (role === 'doctor') {
            const doctor = await Doctor.create({
                specialization,
                contactDetails: contact,
                userId: user.id
            });
        }

        res.status(201).json({ userId: user.id, message: 'User registered successfully. Please check your email to verify your account.' });
    } catch (error) {
        console.error('Error in registration:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};

// Login function
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if the email is verified
        if (!user.emailVerified) {
            return res.status(400).json({ error: 'Please verify your email first' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            let doctorId = null;
            if (user.role === 'doctor') {
                const doctor = await Doctor.findOne({ where: { userId: user.id } });
                doctorId = doctor ? doctor.id : null;
            }
            const token = jwt.sign(
                { userId: user.id, role: user.role, doctorId },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.json({
                token,
                userId: user.id,
                username: user.username,
                role: user.role,
                doctorId,
                message: 'Login successful'
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal error' });
    }
};

// Additional email verification endpoint
const verifyEmail = async (req, res) => {
    const { token } = req.query; // Get the token from the query parameters

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
        const userId = decoded.userId; // Extract user ID from the token

        // Find the user by ID
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the email is already verified
        if (user.emailVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        // Update the user's email verification status
        user.emailVerified = true;
        user.verificationToken = undefined;  // Clear the token after successful verification
        await user.save();

        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(400).json({ error: 'Invalid or expired token' });
    }
};

module.exports = {
    register,
    login,
    verifyEmail,
};
