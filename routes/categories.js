var express = require('express');
var router = express.Router();
let {check_authentication,check_authorization} = require('../utils/check_auth');
let constants = require('../utils/constants');
var categoryController = require('../controllers/categories');
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');
let slugify = require('slugify');

// GET all categories
router.get('/', async (req, res) => {
  try {
    let categories = await categoryController.GetAllCategories();
    CreateSuccessResponse(res, 200, categories);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

// GET a single category by ID
router.get('/:id', async (req, res) => {
  try {
    let category = await categoryController.GetCategoryByID(req.params.id);
    CreateSuccessResponse(res, 200, category);
  } catch (error) {
    CreateErrorResponse(res, 404, error.message);
  }
});

// POST create new category
router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async (req, res) => {
  try {
    let { name, description = '' } = req.body;
    let slug = slugify(name, { lower: true });
    let newCategory = await categoryController.CreateCategory(name, description, slug);
    CreateSuccessResponse(res, 200, newCategory);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

// PUT update category
router.put('/:id', async (req, res) => {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name, { lower: true });
    }
    let updatedCategory = await categoryController.UpdateCategory(req.params.id, req.body);
    CreateSuccessResponse(res, 200, updatedCategory);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

// DELETE (soft delete) category
router.delete('/:id', async (req, res) => {
  try {
    let deletedCategory = await categoryController.DeleteCategory(req.params.id);
    CreateSuccessResponse(res, 200, deletedCategory);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

module.exports = router;
