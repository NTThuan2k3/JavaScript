
var express = require('express');
var router = express.Router();
var roleController = require('../controllers/roles')
let constants = require('../utils/constants')
let {check_authentication,check_authorization} = require('../utils/check_auth')

let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler')

/* GET users listing. */
router.get('/',check_authentication,check_authorization(["admin","mod"]),async function (req, res, next) {
  try {
    let roles = await roleController.GetAllRoles();
    CreateSuccessResponse(res, 200, roles);
  } catch (error) {
    CreateErrorResponse(res, 404, error.message)
  }
});
router.post('/',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body;
    let newRole = await roleController.CreateARole(body.name);
    CreateSuccessResponse(res, 200, newRole);
  } catch (error) {
    CreateErrorResponse(res, 404, error.message)
  }
});

module.exports = router;

// const seedRoles = async () => {
//   try {
//     const defaultRoles = [
//       { name: 'admin', description: 'Quản trị viên toàn hệ thống' },
//       { name: 'mod', description: 'Quản lý nội dung và người dùng' },
//       { name: 'user', description: 'Người dùng thông thường' }
//     ];

//     for (let role of defaultRoles) {
//       let existed = await roleSchema.findOne({ name: role.name });
//       if (!existed) {
//         await roleSchema.create(role);
//         console.log(`Đã thêm quyền: ${role.name}`);
//       } else {
//         console.log(`Quyền ${role.name} đã tồn tại`);
//       }
//     }

//     console.log('Seed role hoàn tất.');
//   } catch (error) {
//     console.error('Lỗi khi seed roles:', error.message);
//   }
// };

// router.post('/seed', async function (req, res, next) {
//   try {
//     await seedRoles();
//     CreateSuccessResponse(res, 200, "Đã seed roles mặc định");
//   } catch (error) {
//     CreateErrorResponse(res, 404, error.message)
//   }
// });