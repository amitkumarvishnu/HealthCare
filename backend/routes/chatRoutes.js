const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route to send a message
router.post('/send', chatController.sendMessage);
router.get('/history/:roomId', chatController.getChatHistory);
router.post('/markAsRead', chatController.markAsRead);

module.exports = router;
