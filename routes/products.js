const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const multer = require('multer');
const slugify = require('slugify');

const productController = require('../controllers/products');
const { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler');

// Cấu hình upload ảnh (sẽ upload lên thư mục tạm trước khi gửi đến server CDN)
let imageDir = path.join(__dirname, "../temp_images");
let serverCDN = 'http://localhost:4000/upload/image';
let productImgURL = "http://localhost:4000/images/";

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, imageDir),
    filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});
let upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
      cb(new Error("Chỉ cho phép ảnh"));
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});


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
    let products = await productController.GetAllProducts(query);
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

// POST create new product with image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let { name, quantity = 10, price = 1000, category } = req.body;
    let slug = slugify(name, { lower: true });

    // Gửi ảnh lên server CDN
    let imgPath = path.join(imageDir, req.file.filename);
    let form = new FormData();
    form.append('image', fs.createReadStream(imgPath));
    let result = await axios.post(serverCDN, form, { headers: form.getHeaders() });
    fs.unlinkSync(imgPath); // Xoá ảnh tạm sau khi gửi

    // URL ảnh trên CDN
    let imgURL = result.data?.data || "";

    let newProduct = await productController.CreateAProduct(name, quantity, price, category, slug, imgURL);
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

    // Nếu có file ảnh → upload lên server CDN
    if (req.file) {
      let imgPath = path.join(imageDir, req.file.filename);
      let form = new FormData();
      form.append('image', fs.createReadStream(imgPath));
      let result = await axios.post(serverCDN, form, { headers: form.getHeaders() });
      fs.unlinkSync(imgPath);
      req.body.imgURL = result.data?.data || "";
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