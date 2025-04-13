let cartItemSchema = require('../schemas/cartItem');
let productSchema = require('../schemas/product');
let orderSchema = require('../schemas/order');

module.exports = {
  CreateAnOrder: async function (userId, phoneNumber, shippingAddress, cartItemIds, method) {
    if (!Array.isArray(cartItemIds) || cartItemIds.length === 0) {
      throw new Error("Danh sách items không hợp lệ");
    }

    // Lấy danh sách cartItems từ database
    let cartItems = await cartItemSchema.find({ _id: { $in: cartItemIds } }).populate('product');

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Không tìm thấy cartItem nào hợp lệ");
    }

    let orderItems = [];
    let totalAmount = 0;

    for (let item of cartItems) {
      let product = item.product;

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

    let finalMethod = method || "cash";

    let newOrder = new orderSchema({
      user: userId,
      phoneNumber,
      shippingAddress,
      items: orderItems,
      totalAmount,
      method: finalMethod
    });

    let savedOrder = await newOrder.save();
    return await savedOrder.populate('items.product');
  },
  DeleteOrder: async function (orderId) {
    let order = await orderSchema.findById(orderId).populate('items.product');
  
    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }
  
    if (order.isDeleted) {
      throw new Error("Đơn hàng đã bị hủy trước đó");
    }
  
    // Trả lại số lượng hàng cho từng sản phẩm
    for (let item of order.items) {
      let product = item.product;
  
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    order.isDeleted = true;
    return await order.save();
  },
  GetAllOrders: async function (userId) {
    return await orderSchema
      .find({user: userId, isDeleted: false })
      .populate('items.product');         // lấy thông tin sản phẩm
  },
  GetOrderById: async function (id) {
    return await orderModel.findById({ _id: id, isDeleted: false });
  },
  GetOrdersByUserId: async function (User) {
    try {
       if (User) {
          return await orderSchema.find({ user: User, isDeleted: false });
       } else {
          throw new Error("Khong tim thay user");
       }
    } catch (error) {
       throw new Error(error.message); 
    }
  },
  GetOrderById: async function (orderId) {
    let order = await orderSchema
      .findById(orderId).populate('items.product');
  
    if (!order || order.isDeleted) {
      throw new Error('Đơn hàng không tồn tại hoặc đã bị hủy');
    }
  
    return order;
  },
  UpdateOrderStatus: async function (orderId, updateData) {
    if (!updateData.status) {
      throw new Error("Vui lòng cung cấp trạng thái mới cho đơn hàng");
    }
  
    // Kiểm tra đơn hàng có tồn tại và chưa bị xoá
    let order = await orderSchema.findById(orderId);
    if (!order || order.isDeleted) {
      throw new Error("Đơn hàng không tồn tại hoặc đã bị hủy");
    }
  
    // Cập nhật trường status
    order.status = updateData.status;
    await order.save();
  
    // Trả về bản ghi sau cập nhật, kèm populate nếu cần
    return await order.populate('items.product');
  }
};
