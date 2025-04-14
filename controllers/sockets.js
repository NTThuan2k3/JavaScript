const messageModel = require('../schemas/message');
const userModel = require('../schemas/user');

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', async (userId) => {
      const user = await userModel.findById(userId);
      if (user) {
        socket.userId = user._id;
        socket.username = user.username;
        console.log(`User ${user.username} joined chat`);
      }
    });

    socket.on('message', async (content) => {
      if (!socket.userId) return;

      const savedMsg = await messageModel.create({ sender: socket.userId, content });
      const populatedMsg = await savedMsg.populate('sender', 'username');

      io.emit('message', populatedMsg);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};