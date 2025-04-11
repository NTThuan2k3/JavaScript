const express = require('express');
const router = express.Router();
const cartItemController = require('../controllers/cartItems');
const { check_authentication } = require('../utils/check_auth');
const { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');

router.get('/', check_authentication, async (req, res) => {
  try {
    const items = await cartItemController.GetCartItems(req.user._id);
    CreateSuccessResponse(res, 200, items);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

router.post('/', check_authentication, async (req, res) => {
  try {
    const item = await cartItemController.AddCartItem(req.user._id, req.body.product, req.body.quantity);
    CreateSuccessResponse(res, 200, item);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

router.put('/:id', check_authentication, async (req, res) => {
  try {
    const updated = await cartItemController.UpdateCartItem(req.params.id, req.body.quantity);
    CreateSuccessResponse(res, 200, updated);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

router.delete('/:id', check_authentication, async (req, res) => {
  try {
    const deleted = await cartItemController.DeleteCartItem(req.params.id);
    CreateSuccessResponse(res, 200, deleted);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

module.exports = router;