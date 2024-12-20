const User = require('./User');
const Doctor = require('./Doctor');
const Consultation = require('./Consultation');
const TimeSlot = require('./TimeSlot');
const Chat = require('./Chat');

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

// Chat associations
Chat.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
Chat.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' });

module.exports = {
  User,
  Doctor,
  Consultation,
  TimeSlot,
  Chat
};
