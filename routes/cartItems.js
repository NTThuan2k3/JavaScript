const express = require('express');
const router = express.Router();
const cartItemController = require('../controllers/cartItems');
const { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');
const { check_authentication } = require('../utils/check_auth');

// Thêm sản phẩm vào giỏ hàng
router.post('/', check_authentication, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const result = await cartItemController.AddItemToCart(req.user._id, productId, quantity);
    CreateSuccessResponse(res, 200, result);
  } catch (error) {
    CreateErrorResponse(res, 400, error.message);
  }
});

// Cập nhật số lượng sản phẩm trong giỏ
router.put('/:itemId', check_authentication, async (req, res) => {
  try {
    const result = await cartItemController.UpdateItemQuantity(req.user._id, req.params.itemId, req.body.quantity);
    CreateSuccessResponse(res, 200, result);
  } catch (error) {
    CreateErrorResponse(res, 400, error.message);
  }
});

// Xóa sản phẩm khỏi giỏ
router.delete('/:itemId', check_authentication, async (req, res) => {
  try {
    const result = await cartItemController.RemoveItemFromCart(req.user._id, req.params.itemId);
    CreateSuccessResponse(res, 200, result);
  } catch (error) {
    CreateErrorResponse(res, 400, error.message);
  }
});

module.exports = router;
