const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');
const { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');
const { check_authentication, check_authorization } = require('../utils/check_auth');
const constants = require('../utils/constants');

// Tạo đơn hàng mới (user tạo)
router.post('/', check_authentication, async function (req, res, next) {
  try {
    const { phoneNumber, shippingAddress, items, method } = req.body;

    let newOrder = await orderController.CreateAnOrder(
      req.user._id,
      phoneNumber,
      shippingAddress,
      items,
      method
    );

    CreateSuccessResponse(res, 201, newOrder);
  } catch (error) {
    CreateErrorResponse(res, 400, error.message);
  }
});

// Cập nhật đơn hàng (mod/admin)
router.put('/:id', check_authentication, check_authorization(constants.MOD_PERMISSION), async function (req, res, next) {
  try {
    let updatedOrder = await orderController.UpdateOrderStatus(req.params.id, req.body);
    CreateSuccessResponse(res, 200, updatedOrder);
  } catch (error) {
    CreateErrorResponse(res, 404, error.message);
  }
});

// Hủy đơn hàng
router.delete('/:id', check_authentication, async (req, res) => {
  try {
    const deletedOrder = await orderController.DeleteOrder(req.params.id);
    CreateSuccessResponse(res, 200, deletedOrder);
  } catch (error) {
    CreateErrorResponse(res, 400, error.message);
  }
});

// Lấy tất cả đơn hàng của user
router.get('/', check_authentication, async (req, res) => {
  try {
    const orders = await orderController.GetAllOrders();
    CreateSuccessResponse(res, 200, orders);
  } catch (error) {
    CreateErrorResponse(res, 400, error.message);
  }
});

// Lấy đơn hàng theo ID
router.get('/:id', check_authentication, async (req, res) => {
  try {
    const order = await orderController.GetOrderById(req.params.id);
    CreateSuccessResponse(res, 200, order);
  } catch (error) {
    CreateErrorResponse(res, 404, error.message);
  }
});


module.exports = router;
