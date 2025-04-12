var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
let { CreateSuccessResponse, CreateErrorResponse } = require('./utils/responseHandler')
let constants = require("./utils/constants")
let cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

mongoose.connect("mongodb://0.0.0.0:27017/DoAn");
mongoose.connection.on('connected',()=>{
  console.log("connected");
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/forgotpassword', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'forgot-password.html'));
});

app.get('/resetpassword', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'reset-password.html'));
});

app.get('/changepassword', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'change-password.html'));
});

app.get('/personalinformation', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'personal-information.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', '/admin/products/productsManage.html'));
});

app.get('/product-details', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', '/user/productDetails.html'));
});

app.get('/products/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', '/admin/products/addProduct.html'));
});

app.get('/products/edit', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', '/admin/products/editProduct.html'));
});

app.get('/categories', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', '/admin/categories/categoriesManage.html'));
});

app.get('/categories/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', '/admin/categories/addCategory.html'));
});

app.get('/categories/edit', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', '/admin/categories/editCategory.html'));
});

app.get('/users', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', '/admin/users/userManage.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', '/user/shoppingCart.html'));
});

app.get('/orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', '/user/order.html'));
});

app.get('/orderList', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', '/user/orderList.html'));
});
app.get('/orderDetail', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', '/user/orderDetail.html'));
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(constants.SECRET_KEY_COOKIE));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/load/users', usersRouter);
app.use('/auth', require('./routes/auth'));
app.use('/menus', require('./routes/menus'));
app.use('/roles', require('./routes/roles'));
app.use('/load/products', require('./routes/products'));
app.use('/load/categories', require('./routes/categories'));

app.use('/load/orders', require('./routes/orders'));
app.use('/load/carts', require('./routes/carts'));
app.use('/cartItems', require('./routes/cartItems'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  CreateErrorResponse(res, err.status||500, err.message)
});

module.exports = app;
