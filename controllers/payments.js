let paymentSchema = require('../schemas/payment');

module.exports = {
  GetAllPayments: async function () {
    return await paymentSchema.find({}).populate('user order');
  },
  GetPaymentByID: async function (id) {
    return await paymentSchema.findById(id).populate('user order');
  },
  CreatePayment: async function (userID, orderID, method, amount) {
    let newPayment = new paymentSchema({
      user: userID,
      order: orderID,
      method,
      amount,
      status: 'pending'
    });
    return await newPayment.save();
  },
  UpdatePaymentStatus: async function (id, status) {
    return await paymentSchema.findByIdAndUpdate(id, { status }, { new: true });
  }
};
