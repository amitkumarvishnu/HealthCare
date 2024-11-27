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
    imageUrls: { // Changed from imageUrl to imageUrls
        type: DataTypes.JSON, // Or use DataTypes.ARRAY(DataTypes.STRING) for PostgreSQL
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
    date: {
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: sequelize.fn('NOW'), 
    },
    startTime: { 
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime: { 
        type: DataTypes.TIME,
        allowNull: false,
    },
});

module.exports = Consultation;
