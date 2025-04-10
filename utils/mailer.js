const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 25,
    secure: false, 
    auth: {
      user: "71f7843f493393",
      pass: "ac85160f69438c",
    },
  });
module.exports = {
    sendMailForgotPassword: async function(to,URL){
        return await transporter.sendMail({
            to:to,
            subject:"DOI MAT KHAU",
            html:`<a href=${URL}>CLICK VAO DAY DE DOI MAT KHAU MOI</a>`
        })
    }
}