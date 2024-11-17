const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const Doctor = require('./Doctor');

const TimeSlot = sequelize.define('TimeSlot', {
    doctorId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Doctor,
            key: 'id',
        },
        onDelete: 'CASCADE', // Optional: Deletes time slots if the doctor is deleted.
    },
    date: {
        type: DataTypes.DATE, // Ensure this is a valid DATE or DATETIME
        allowNull: false, // Make sure the date field is not null or give a default value
        defaultValue: sequelize.fn('NOW'), // Set current date and time as default
    },
    startTime: { 
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime: { 
        type: DataTypes.TIME,
        allowNull: false,
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    
});

module.exports = TimeSlot;
