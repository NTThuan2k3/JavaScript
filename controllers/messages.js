let messageModel = require('../schemas/message');

module.exports = {
  SaveMessage: async function (senderId, content) {
    let newMsg = new messageModel({ sender: senderId, content });
    return await newMsg.save();
  },

  GetAllMessages: async function () {
    return await messageModel.find({}).populate('sender', 'username');
  }
};