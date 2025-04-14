let express = require('express');
let router = express.Router();
let messageController = require('../controllers/messages');
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');
let { check_authentication } = require('../utils/check_auth');

// GET: all chat messages
router.get('/', check_authentication, async (req, res) => {
  try {
    let messages = await messageController.GetAllMessages();
    CreateSuccessResponse(res, 200, messages);
  } catch (err) {
    CreateErrorResponse(res, 500, err.message);
  }
});

// POST: send a new message
router.post('/', check_authentication, async (req, res) => {
  try {
    let { content } = req.body;
    let newMessage = await messageController.SaveMessage(req.user._id, content);
    CreateSuccessResponse(res, 201, newMessage);
  } catch (err) {
    CreateErrorResponse(res, 500, err.message);
  }
});

module.exports = router;