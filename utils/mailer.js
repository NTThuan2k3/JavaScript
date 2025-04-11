const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,  // đổi lại
    auth: {
        user: "8d23692f21331a",
        pass: "23acd6a5f748d5",
    },
});

module.exports = {
    sendMailForgotPassword: async function(to, URL) {
        return await transporter.sendMail({
            from: '"MyApp Support" <no-reply@myapp.com>',  // thêm from chuẩn
            to: to,
            subject: "THƯ MỜI ĐI DU LỊCH - ĐỜI NHẸ NHÀNG, TIỀN CAO ÁP",
            html: `<p>Click vào link bên dưới để reset mật khẩu:</p>
                   <a href="${URL}" target="_blank">Reset Password</a>`
        })
    }
}
