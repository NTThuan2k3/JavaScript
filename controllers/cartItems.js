let cartSchema = require('../schemas/cart');

module.exports = {
  AddItemToCart: async function (userID, productID, quantity) {
    let cart = await cartSchema.findOne({ user: userID });
    if (!cart) {
      cart = new cartSchema({ user: userID, items: [] });
    }

    let existingItem = cart.items.find(item => item.product.toString() === productID);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productID, quantity });
    }

    return await cart.save();
  },
  RemoveItemFromCart: async function (userID, productID) {
    let cart = await cartSchema.findOne({ user: userID });
    if (cart) {
      cart.items = cart.items.filter(item => item.product.toString() !== productID);
      return await cart.save();
    }
    return null;
  }
};
