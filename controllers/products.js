let productSchema = require('../schemas/product');
let categorySchema = require('../schemas/category');
let mongoose = require('mongoose');

module.exports = {
  GetAllProducts: async function () {
    return await productSchema.find({ isDeleted: false }).populate('category');
  },
  GetProductByID: async function (id) {
    return await productSchema.findById(id).populate('category');
  },
  CreateAProduct: async function (name, quantity, price, categoryInput, slug, imageURL) {
    // Tìm theo tên hoặc ID
    let category = mongoose.isValidObjectId(categoryInput)
        ? await categorySchema.findById(categoryInput)
        : await categorySchema.findOne({ name: categoryInput });

    if (!category) throw new Error("category không tồn tại");

    let newProduct = new productSchema({
      name,
      quantity,
      price,
      category: category._id,
      slug,
      imageURL
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
