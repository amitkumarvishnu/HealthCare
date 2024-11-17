const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const User = require('./User');
const Doctor = require('./Doctor');

const Consultation = sequelize.define('Consultation', {
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Doctor,
            key: 'id',
        },
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT, 
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'Accepted', 'Rejected', 'Confirmed', 'Completed'),
        allowNull: false,
        defaultValue: 'pending'
    },
});


module.exports = Consultation;
