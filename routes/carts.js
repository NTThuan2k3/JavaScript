var express = require('express');
var router = express.Router();
var cartController = require('../controllers/carts');
let {check_authentication,check_authorization} = require('../utils/check_auth');
let constants = require('../utils/constants');
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');

router.get('/', check_authentication, check_authorization(constants.USER_PERMISSION), async (req, res) => {
  try {
    let cart = await cartController.GetCart(req.user._id);
    CreateSuccessResponse(res, 200, cart);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

router.post('/', check_authentication, check_authorization(constants.USER_PERMISSION), async (req, res) => {
  try {
    let newCart = await cartController.CreateCart(req.user._id);
    CreateSuccessResponse(res, 201, newCart);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

module.exports = router;