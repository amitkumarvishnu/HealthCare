import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

// Socket connection URL...
const socket = io('http://localhost:5000');

const Chat = ({ userId, receiverId, token }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);

  const generateRoomId = (senderId, receiverId) => {
    return senderId < receiverId ? `${senderId}-${receiverId}` : `${receiverId}-${senderId}`;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/registeredUser', {
          headers: { Authorization: `Bearer ${token}`  },
        });
        setAvailableUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (!selectedUser) return;
  
    const roomId = generateRoomId(userId, selectedUser);
    socket.emit('joinRoom', roomId);
  
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chat/history/${roomId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
  
    fetchChatHistory();
  
    const handleReceiveMessage = (newMessage) => {
      if (
        (newMessage.senderId === userId && newMessage.receiverId === selectedUser) ||
        (newMessage.senderId === selectedUser && newMessage.receiverId === userId)
      ) {
        setMessages((prevMessages) => {
          const isMessageExist = prevMessages.some(msg => msg.id === newMessage.id);
          if (isMessageExist) {
            return prevMessages;
          }
          return [...prevMessages, newMessage];
        });
      }
    };
  
    socket.on('receiveMessage', handleReceiveMessage);
  
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [selectedUser, userId, token]);
  
  

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!message.trim() || !selectedUser) {
      console.error('Message is empty or no user selected!');
      return;
    }

    const roomId = generateRoomId(userId, selectedUser);
    const messageData = {
      roomId,
      senderId: userId,
      receiverId: selectedUser,
      message,
    };

    try {
      await axios.post('http://localhost:5000/api/chat/send/', messageData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      socket.emit('sendMessage', messageData);

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/4 bg-white border-r shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Users</h3>
        <div className="space-y-2">
          {availableUsers.length > 0 ? (
            availableUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`block w-full text-left p-3 rounded-lg transition ${
                  selectedUser === user.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {user.username}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No users available</p>
          )}
        </div>
      </div>

      <div className="w-3/4 flex flex-col">
        <div className="bg-blue-600 text-white p-4 shadow-lg">
          <h3 className="text-lg font-semibold">
            {selectedUser
              ? `Chat with ${availableUsers.find((user) => user.id === selectedUser)?.username}`
              : 'Select a user to start chatting'}
          </h3>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-100">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-lg p-3 rounded-lg ${
                msg.sender?.id === userId ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">
                {msg.sender?.id === userId ? (
                  <span className="font-semibold">You:</span>
                ) : (
                  <span className="font-semibold">{msg.sender?.username}:</span>
                )}
                <span className="ml-2">{msg.message}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex items-center space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!selectedUser}
            className={`p-3 px-6 rounded-lg text-white font-semibold transition ${
              selectedUser
                ? 'bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-300'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
