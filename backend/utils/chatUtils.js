const generateRoomId = (senderId, receiverId) => {
    return senderId < receiverId ? `${senderId}-${receiverId}` : `${receiverId}-${senderId}`;
  };
  
  module.exports = { generateRoomId };
  