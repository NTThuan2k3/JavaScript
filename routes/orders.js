var express = require('express');
var router = express.Router();
var orderController = require('../controllers/orders');
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');
let { check_authentication, check_authorization } = require('../utils/check_auth');
let constants = require('../utils/constants');

// Tạo đơn hàng mới (user tạo)
router.post('/', check_authentication, check_authorization(constants.USER_PERMISSION), async function (req, res, next) {
  try {
    let { phoneNumber, shippingAddress, items, method } = req.body;

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
router.delete('/:id', check_authentication, check_authorization(constants.USER_PERMISSION), async (req, res) => {
  try {
    let deletedOrder = await orderController.DeleteOrder(req.params.id);
    CreateSuccessResponse(res, 200, deletedOrder);
  } catch (error) {
    CreateErrorResponse(res, 400, error.message);
  }
});

// Lấy tất cả đơn hàng của user
router.get('/', check_authentication, check_authorization(constants.USER_PERMISSION), async (req, res) => {
  try {
    let orders = await orderController.GetAllOrders();
    CreateSuccessResponse(res, 200, orders);
  } catch (error) {
    CreateErrorResponse(res, 400, error.message);
  }
});

// Lấy đơn hàng theo ID
router.get('/:id', check_authentication, check_authorization(constants.USER_PERMISSION), async (req, res) => {
  try {
    let order = await orderController.GetOrderById(req.params.id);
    CreateSuccessResponse(res, 200, order);
  } catch (error) {
    CreateErrorResponse(res, 404, error.message);
  }
});


module.exports = router;
