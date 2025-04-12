var express = require('express');
var router = express.Router();
var cartItemController = require('../controllers/cartItems');
let {check_authentication,check_authorization} = require('../utils/check_auth');
let constants = require('../utils/constants');
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');

router.get('/', check_authentication, check_authorization(constants.USER_PERMISSION), async (req, res) => {
  try {
    let items = await cartItemController.GetCartItems(req.user._id);
    CreateSuccessResponse(res, 200, items);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

router.post('/', check_authentication, check_authorization(constants.USER_PERMISSION), async (req, res) => {
  try {
    let item = await cartItemController.AddCartItem(req.user._id, req.body.product, req.body.quantity);
    CreateSuccessResponse(res, 200, item);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

router.put('/:id', check_authentication, check_authorization(constants.USER_PERMISSION), async (req, res) => {
  try {
    let updated = await cartItemController.UpdateCartItem(req.params.id, req.body.quantity);
    CreateSuccessResponse(res, 200, updated);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

router.delete('/:id', check_authentication, check_authorization(constants.USER_PERMISSION), async (req, res) => {
  try {
    let deleted = await cartItemController.DeleteCartItem(req.params.id);
    CreateSuccessResponse(res, 200, deleted);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

module.exports = router;