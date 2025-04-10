const express = require('express');
const router = express.Router();
const cartController = require('../controllers/carts');
const { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');
const { check_authentication } = require('../utils/check_auth');

// Lấy giỏ hàng của user đã đăng nhập
router.get('/', check_authentication, async (req, res) => {
  try {
    const cart = await cartController.GetCartByUserId(req.user._id);
    CreateSuccessResponse(res, 200, cart);
  } catch (error) {
    CreateErrorResponse(res, 404, error.message);
  }
});

// Tạo giỏ hàng cho user (nếu chưa có)
router.post('/', check_authentication, async (req, res) => {
  try {
    const cart = await cartController.CreateCart(req.user._id);
    CreateSuccessResponse(res, 201, cart);
  } catch (error) {
    CreateErrorResponse(res, 400, error.message);
  }
});

module.exports = router;
