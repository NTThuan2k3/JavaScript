const cartItemSchema = require('../schemas/cartItem');
const productSchema = require('../schemas/product');
const orderSchema = require('../schemas/order');

module.exports = {
  CreateAnOrder: async function (userId, phoneNumber, shippingAddress, cartItemIds, method) {
    if (!Array.isArray(cartItemIds) || cartItemIds.length === 0) {
      throw new Error("Danh sách items không hợp lệ");
    }

    // Lấy danh sách cartItems từ database
    const cartItems = await cartItemSchema.find({ _id: { $in: cartItemIds } }).populate('product');

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Không tìm thấy cartItem nào hợp lệ");
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cartItems) {
      const product = item.product;

      if (!product) continue;

      // Kiểm tra tồn kho
      if (product.quantity < item.quantity) {
        throw new Error(`Sản phẩm "${product.name}" không đủ hàng. Còn lại: ${product.quantity}`);
      }

      // Trừ số lượng sản phẩm
      product.quantity -= item.quantity;
      await product.save(); // Lưu lại sau khi cập nhật tồn kho

      // Chuẩn hóa dữ liệu để lưu vào đơn hàng
      orderItems.push({
        product: product._id,
        quantity: item.quantity
      });

      totalAmount += product.price * item.quantity;
    }

    const finalMethod = method || "cash";

    const newOrder = new orderSchema({
      user: userId,
      phoneNumber,
      shippingAddress,
      items: orderItems,
      totalAmount,
      method: finalMethod
    });

    const savedOrder = await newOrder.save();
    return await savedOrder.populate('items.product');
  },
  DeleteOrder: async function (orderId) {
    const order = await orderSchema.findById(orderId).populate('items.product');
  
    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }
  
    if (order.isDeleted) {
      throw new Error("Đơn hàng đã bị hủy trước đó");
    }
  
    // Trả lại số lượng hàng cho từng sản phẩm
    for (const item of order.items) {
      const product = item.product;
  
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    order.isDeleted = true;
    return await order.save();
  },
  GetAllOrders: async function () {
    return await orderSchema
      .find({ isDeleted: false })
      .populate('items.product');         // lấy thông tin sản phẩm
  },
  GetOrderById: async function (orderId) {
    const order = await orderSchema
      .findById(orderId).populate('items.product');
  
    if (!order || order.isDeleted) {
      throw new Error('Đơn hàng không tồn tại hoặc đã bị hủy');
    }
  
    return order;
  }  
};
