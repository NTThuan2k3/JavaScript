const cartSchema = require('../schemas/cart');
const cartItemSchema = require('../schemas/cartItem');

module.exports = {
  GetCartItems: async function (userID) {
    const cart = await cartSchema.findOne({ user: userID });
    if (!cart) throw new Error('Cart not found');
    return await cartItemSchema.find({ cart: cart._id }).populate('product');
  },

  AddCartItem: async function (userID, productID, quantity = 1) {
    const cart = await cartSchema.findOne({ user: userID });
    if (!cart) throw new Error('Cart not found');

    let item = await cartItemSchema.findOne({ cart: cart._id, product: productID });
    if (item) {
      item.quantity += quantity;
      return await item.save();
    } else {
      return await cartItemSchema.create({ cart: cart._id, product: productID, quantity });
    }
  },

  UpdateCartItem: async function (itemId, quantity) {
    return await cartItemSchema.findByIdAndUpdate(itemId, { quantity }, { new: true });
  },

  DeleteCartItem: async function (itemId) {
    return await cartItemSchema.findByIdAndDelete(itemId);
  }
};
