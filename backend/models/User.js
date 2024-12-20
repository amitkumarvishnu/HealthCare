const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('patient', 'doctor'),
        allowNull: false,
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    
});

module.exports = User; 
