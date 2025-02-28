// require("dotenv").config();
// const nodemailer = require("nodemailer");

// const sendMailByUser = async ({ to, subject, text, html }) => {

//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: true,
//       auth: {
//         user: "manishsharma5382@gmail.com",
//         pass: "qmkyooqxmehexlpv",
//       },
//     });

//     const info = await transporter.sendMail({
//       from: `"Maddison Foo Koch 👻" <"manishsharma5382@gmail.com">`, 
//       to, 
//       subject, 
//       text, 
//       html, 
//     });

//     console.log("Message sent:", info.messageId);
//     return { success: true, messageId: info.messageId };

//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error("Failed to send email");
//   }
// };

// module.exports = sendMailByUser
