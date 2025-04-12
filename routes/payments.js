var express = require('express');
var router = express.Router();
let paymentController = require('../controllers/payments');
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');
let { check_authentication } = require('../utils/check_auth');
let constants = require('../utils/constants');

// Tạo thanh toán cho đơn hàng
router.post('/', check_authentication, async (req, res) => {
  try {
    const result = await paymentController.ProcessPayment(req.user._id, req.body.orderId, req.body.paymentMethod);
    CreateSuccessResponse(res, 200, result);
  } catch (error) {
    CreateErrorResponse(res, 400, error.message);
  }
});

// Lấy danh sách thanh toán của user
router.get('/', check_authentication, async (req, res) => {
  try {
    const payments = await paymentController.GetUserPayments(req.user._id);
    CreateSuccessResponse(res, 200, payments);
  } catch (error) {
    CreateErrorResponse(res, 404, error.message);
  }
});

module.exports = router;
