const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
let transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "markjackman31820@gmail.com",
    pass: "vworktlirikcethu",
  },
});
transporter.use(
  "compile",
  hbs({
    viewEngine: "nodemailer-express-handlebars",
    viewPath: "emailTeamplate/",
  })
);
let mailOptions = {
  from: "markjackman31820@gmail.com",
  to: ["shrutika.chavan@gmail.com", "shaikhmohdnoman612@gmail.com"],
  subject: "Testing Mail",
  template: "email",
  context: {
    username: uname,
  },
};
// transporter.sendMail(mailOptions, (err, info) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Mail send : " + info);
//   }
// });
