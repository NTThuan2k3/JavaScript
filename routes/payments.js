const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payments');
const { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');
const { check_authentication } = require('../utils/check_auth');

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
