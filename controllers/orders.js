let orderSchema = require('../schemas/order');

module.exports = {
  GetAllOrders: async function () {
    return await orderSchema.find({}).populate('user');
  },
  GetOrderByID: async function (id) {
    return await orderSchema.findById(id).populate('user');
  },
  CreateAnOrder: async function (userId, phoneNumber, shippingAddress, cartItems, totalAmount) {
    let newOrder = new orderSchema({
      user: userId,
      phoneNumber,
      shippingAddress,
      items: cartItems,
      totalAmount,
      status: 'pending'
    });
    return await newOrder.save();
  },
  UpdateOrderStatus: async function (id, status) {
    return await orderSchema.findByIdAndUpdate(id, { status }, { new: true });
  },
  DeleteOrder: async function (id) {
    return await orderSchema.findByIdAndDelete(id);
  }
};
