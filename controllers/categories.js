let categorySchema = require('../schemas/category');
let slugify = require('slugify');

module.exports = {
  GetAllCategories: async function () {
    return await categorySchema.find({ isDeleted: false });
  },

  GetCategoryByID: async function (id) {
    return await categorySchema.findById(id);
  },

  CreateCategory: async function (name, description, slug) {
    let newCategory = new categorySchema({
      name,
      description,
      slug
    });
    return await newCategory.save();
  },

  UpdateCategory: async function (id, body) {
    return await categorySchema.findByIdAndUpdate(id, body, { new: true });
  },

  DeleteCategory: async function (id) {
    return await categorySchema.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }
};
