const { Op } = require('sequelize');
const Chat = require('../models/Chat');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { generateRoomId } = require('../utils/chatUtils');

// Send a message
exports.sendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    console.log('senderId', senderId , 'receiverId', receiverId, 'message', message);

    if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    if (!senderId || !receiverId || senderId === receiverId) {
        return res.status(400).json({ error: 'Invalid senderId or receiverId.' });
    }

    try {
        // Generate roomId server-side,
        const roomId = generateRoomId(senderId, receiverId);
        console.log('roomId', roomId);

        const newMessage = await Chat.create({
            roomId,
            senderId,
            receiverId,
            message,
            isRead: false,
        });

        res.status(201).json({
            id: newMessage.id,
            message: newMessage.message,
            sender: { id: senderId },
            receiver: { id: receiverId },
            isRead: newMessage.isRead,
            createdAt: newMessage.createdAt,
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message.', details: error.message });
    }
};

exports.getChatHistory = async (req, res) => {
    const { roomId } = req.params;


    if (!roomId || typeof roomId !== 'string' || !roomId.trim()) {
        return res.status(400).json({ error: 'Invalid room ID provided.' });
    }

    try {
        const chats = await Chat.findAll({
            where: { roomId },
            include: [
                { model: User, as: 'Sender', attributes: ['id', 'username', 'email'] },
                { model: User, as: 'Receiver', attributes: ['id', 'username', 'email'] },
            ],
            order: [['createdAt', 'ASC']],
        });

        // Format chat data
        const formattedChats = chats.map(chat => ({
            id: chat.id,
            message: chat.message,
            sender: {
                id: chat.Sender?.id,
                username: chat.Sender?.username,
                email: chat.Sender?.email
            },
            receiver: {
                id: chat.Receiver?.id,
                username: chat.Receiver?.username,
                email: chat.Receiver?.email
            },
            isRead: chat.isRead,
            createdAt: chat.createdAt
        }));

        res.status(200).json(formattedChats);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history.', details: error.message || error });
    }
};

// Mark a message as read
exports.markAsRead = async (req, res) => {
    const { chatId } = req.body;

    if (!chatId || !Number.isInteger(Number(chatId))) {
        return res.status(400).json({ error: 'Invalid chatId.' });
    }

    try {
        const chat = await Chat.findByPk(chatId);
        if (!chat) {
            return res.status(404).json({ error: 'Chat message not found.' });
        }

        // Mark the message as read
        chat.isRead = true;
        await chat.save();

        res.status(200).json({
            message: 'Message marked as read.',
            chat: {
                id: chat.id,
                isRead: chat.isRead,
                updatedAt: chat.updatedAt
            }
        });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ error: 'Failed to mark message as read.', details: error.message });
    }
};
