const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CreateSuccessResponse } = require('../utils/responseHandler');

// Đường dẫn thư mục lưu ảnh
let avatarDir = path.join(__dirname, "../avatars");
let imageDir = path.join(__dirname, "../images");

// Base URL trả về
let authURL = "http://localhost:4000/avatars/";
let baseImageURL = "http://localhost:4000/images/";

// Multer config cho avatar
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});
let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match('image')) {
      cb(new Error("only image"));
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Multer config cho ảnh sản phẩm
let imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imageDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});
let uploadImage = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match('image')) {
      cb(new Error("only image"));
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Upload avatar
router.post("/upload", upload.single('avatar'), async function (req, res, next) {
  let avatarURL = authURL + req.file.filename;
  CreateSuccessResponse(res, 200, avatarURL);
});

// Upload ảnh sản phẩm
router.post("/images", uploadImage.single('image'), async function (req, res, next) {
  let imgURL = baseImageURL + req.file.filename;
  CreateSuccessResponse(res, 200, imgURL);
});

// Trả file ảnh tĩnh
router.get("/avatars/:filename", function (req, res, next) {
  let pathAvatar = path.join(avatarDir, req.params.filename);
  res.sendFile(pathAvatar);
});
router.get("/images/:filename", function (req, res, next) {
  let pathImage = path.join(imageDir, req.params.filename);
  res.sendFile(pathImage);
});

module.exports = router;
