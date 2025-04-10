var express = require('express');
var router = express.Router();

let productController = require('../controllers/products');
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');
let slugify = require('slugify');

// GET all products with optional filters
router.get('/', async (req, res) => {
  try {
    let { name, price } = req.query;
    let query = {
      name: name || '',
      price: {
        $gte: price?.$gte ? Number(price.$gte) : 0,
        $lte: price?.$lte ? Number(price.$lte) : 10000
      }
    };
    let products = await productController.GetAllProduct(query);
    CreateSuccessResponse(res, 200, products);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

// GET a single product by ID
router.get('/:id', async (req, res) => {
  try {
    let product = await productController.GetProductByID(req.params.id);
    CreateSuccessResponse(res, 200, product);
  } catch (error) {
    CreateErrorResponse(res, 404, error.message);
  }
});

// POST create new product
router.post('/', async (req, res) => {
  try {
    let { name, price = 1000, quantity = 10, category } = req.body;
    let slug = slugify(name, { lower: true });
    let newProduct = await productController.CreateAProduct(name, price, quantity, category, slug);
    CreateSuccessResponse(res, 200, newProduct);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name, { lower: true });
    }
    let updatedProduct = await productController.UpdateAProduct(req.params.id, req.body);
    CreateSuccessResponse(res, 200, updatedProduct);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

// DELETE (soft delete) a product
router.delete('/:id', async (req, res) => {
  try {
    let deletedProduct = await productController.DeleteAProduct(req.params.id);
    CreateSuccessResponse(res, 200, deletedProduct);
  } catch (error) {
    CreateErrorResponse(res, 500, error.message);
  }
});

module.exports = router;
