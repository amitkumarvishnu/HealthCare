const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config');
const { User, Doctor, Consultation } = require('./models'); 
const authRoutes = require('./routes/authRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const timeSlotRoutes = require('./routes/timeSlotRoutes'); 
const path = require('path');

// dotenv.config();
require('dotenv').config();

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware...
app.use(cors());
app.use(express.json()); 

// Routes...
app.use('/api/auth', authRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api', timeSlotRoutes);

const PORT = process.env.PORT;

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


