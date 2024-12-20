const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Chat = sequelize.define('Chat', {
  roomId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Chat;

