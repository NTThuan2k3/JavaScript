let productSchema = require('../schemas/product');
let categorySchema = require('../schemas/category');

module.exports = {
  GetAllProducts: async function () {
    return await productSchema.find({ isDeleted: false }).populate('category');
  },
  GetProductByID: async function (id) {
    return await productSchema.findById(id).populate('category');
  },
  CreateAProduct: async function (name, price, categoryId, description, slug) {
    let category = await categorySchema.findById(categoryId);
    if (!category) throw new Error("category không tồn tại");

    let newProduct = new productSchema({
      name,
      price,
      category: category._id,
      description,
      slug
    });
    return await newProduct.save();
  },
  UpdateAProduct: async function (id, body) {
    return await productSchema.findByIdAndUpdate(id, body, { new: true });
  },
  DeleteAProduct: async function (id) {
    return await productSchema.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }
};
