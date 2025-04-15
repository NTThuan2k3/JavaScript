# Web Bán Hàng (JavaScript)

## Giới thiệu
Dự án này là một ứng dụng web bán hàng trực tuyến, cung cấp các tính năng như quản lý sản phẩm, giỏ hàng, đặt hàng, và quản lý người dùng. Ứng dụng được xây dựng bằng Node.js và Express.js ở phía server, kết hợp với giao diện người dùng sử dụng HTML, CSS và JavaScript.

## Các tính năng chính
- **Người dùng:**
  - Đăng ký, đăng nhập, và quản lý thông tin cá nhân.
  - Xem danh sách sản phẩm và chi tiết sản phẩm.
  - Thêm sản phẩm vào giỏ hàng và thực hiện đặt hàng.
  - Xem danh sách đơn hàng và chi tiết đơn hàng.

- **Quản trị viên:**
  - Quản lý sản phẩm: thêm, sửa, xóa sản phẩm.
  - Quản lý danh mục sản phẩm.
  - Quản lý người dùng.

## Công nghệ sử dụng
- **Backend:**
  - Node.js, Express.js
  - MongoDB (Mongoose)
  - Socket.IO (cho tính năng chat realtime)
- **Frontend:**
  - HTML, CSS, JavaScript
  - Bootstrap 5
- **Khác:**
  - Multer (upload ảnh)
  - Axios (gửi request HTTP)
  - Nodemailer (gửi email)

## Cách chạy dự án
1. Cài đặt các phụ thuộc:
   ```bash
   npm install