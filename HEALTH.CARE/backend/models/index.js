const User = require('./User');
const Doctor = require('./Doctor');
const Consultation = require('./Consultation');
const TimeSlot = require('./TimeSlot'); // Ensure TimeSlot is correctly imported

// associations...

// User has one doctor
User.hasOne(Doctor, { foreignKey: 'userId' });
Doctor.belongsTo(User, { foreignKey: 'userId' });

// Consultation belongs to both User (Patient) and Doctor
Consultation.belongsTo(User, { as: 'Patient', foreignKey: 'patientId' });
Consultation.belongsTo(Doctor, { foreignKey: 'doctorId' });

// Doctor has many time slots
Doctor.hasMany(TimeSlot, { foreignKey: 'doctorId' });
TimeSlot.belongsTo(Doctor, { foreignKey: 'doctorId' });

module.exports = {
    User,
    Doctor,
    Consultation,
    TimeSlot
};
