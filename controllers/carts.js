const cartSchema = require('../schemas/cart');
const cartItemSchema = require('../schemas/cartItem');

module.exports = {
  GetCart: async function (userID) {
    let cart = await cartSchema.findOne({ user: userID });

    if (!cart) {
      cart = await cartSchema.create({ user: userID });
    }

    // Lấy danh sách sản phẩm trong giỏ
    let items = await cartItemSchema.find({ cart: cart._id }).populate('product');

    return {
      ...cart.toObject(),  // convert cart to plain object
      items                // thêm danh sách sản phẩm
    };
  }
};
