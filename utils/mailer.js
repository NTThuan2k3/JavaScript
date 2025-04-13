const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,  // đổi lại
    auth: {
        user: "71f7843f493393",
        pass: "ac85160f69438c",
    },
});

module.exports = {
    sendMailForgotPassword: async function(to, URL) {
        return await transporter.sendMail({
            from: '"MyApp Support" <no-reply@myapp.com>',  // thêm from chuẩn
            to: to,
            subject: "DOI LAI MAT KHAU",
            html: `<p>Click vào link bên dưới để reset mật khẩu:</p>
                   <a href="${URL}" target="_blank">Reset Password</a>`
        })
    }
}
