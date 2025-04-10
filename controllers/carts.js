let cartSchema = require('../schemas/cart');

module.exports = {
  GetAllCarts: async function () {
    return await cartSchema.find({ isDeleted: false }).populate('user items.product');
  },
  GetCartByUserID: async function (userID) {
    return await cartSchema.findOne({ user: userID, isDeleted: false }).populate('items.product');
  },
  AddOrUpdateCart: async function (userID, items) {
    let cart = await cartSchema.findOne({ user: userID });
    if (!cart) {
      cart = new cartSchema({ user: userID, items });
    } else {
      cart.items = items; // override, or implement merge logic
    }
    return await cart.save();
  },
  DeleteCart: async function (id) {
    return await cartSchema.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }
};
