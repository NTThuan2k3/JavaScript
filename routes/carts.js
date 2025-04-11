const express = require('express');
const router = express.Router();
const cartController = require('../controllers/carts');
const { check_authentication } = require('../utils/check_auth');
const { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');

router.get('/', check_authentication, async (req, res) => {
  try {
    const cart = await cartController.GetCart(req.user._id);
    CreateSuccessResponse(res, 200, cart);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

router.post('/', check_authentication, async (req, res) => {
  try {
    const newCart = await cartController.CreateCart(req.user._id);
    CreateSuccessResponse(res, 201, newCart);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

module.exports = router;