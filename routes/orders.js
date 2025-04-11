const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');
const { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');
const { check_authentication, check_authorization } = require('../utils/check_auth');
const constants = require('../utils/constants');

// Lấy tất cả đơn hàng (chỉ mod hoặc admin mới xem được)
router.get('/', check_authentication, check_authorization(constants.MOD_PERMISSION), async function (req, res, next) {
  try {
    let orders = await orderController.GetAllOrders();
    CreateSuccessResponse(res, 200, orders);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

// Tạo đơn hàng mới (user tạo)
router.post('/', check_authentication, async function (req, res, next) {
  try {
    let newOrder = await orderController.CreateOrder(req.user._id, req.body);
    CreateSuccessResponse(res, 201, newOrder);
  } catch (error) {
    CreateErrorResponse(res, 400, error.message);
  }
});

// Cập nhật đơn hàng (mod/admin)
router.put('/:id', check_authentication, check_authorization(constants.MOD_PERMISSION), async function (req, res, next) {
  try {
    let updatedOrder = await orderController.UpdateOrder(req.params.id, req.body);
    CreateSuccessResponse(res, 200, updatedOrder);
  } catch (error) {
    CreateErrorResponse(res, 404, error.message);
  }
});

module.exports = router;
