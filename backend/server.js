const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const { sequelize } = require('./config');
const { User, Doctor, Consultation, Chat } = require('./models');
const authRoutes = require('./routes/authRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const timeSlotRoutes = require('./routes/timeSlotRoutes');
const chatRoutes = require('./routes/chatRoutes');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const paypalRoutes = require("./routes/paypalRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api', timeSlotRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/paypal", paypalRoutes);

const generateRoomId = (senderId, receiverId) => {
  return senderId < receiverId ? `${senderId}-${receiverId}` : `${receiverId}-${senderId}`;
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User with socket ID ${socket.id} joined room ID = ${roomId}`);
  });

  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, message } = data;
  
    try {
      const roomId = generateRoomId(senderId, receiverId); 
  
      const chat = await Chat.create({
        roomId,          
        senderId,
        receiverId,
        message,
        isRead: false, 
      });
  
      const messageData = {
        id: chat.id,
        senderId,
        receiverId,
        message,
        isRead: chat.isRead,
        createdAt: chat.createdAt,
      };
  
      // Emit message to the receiver and sender (sender will also see it)
      io.to(roomId).emit('receiveMessage', messageData);  
      io.to(senderId).emit('messageSent', messageData);  // Optionally, confirm to sender
  
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', { message: 'Failed to send message.' });
    }
  });
  
  

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Sync database and start server
const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
