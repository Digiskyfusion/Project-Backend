// import nodemailer from "nodemailer";
// import "dotenv/config";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true, // Use true for port 465, false for others
//   auth: {
//     user: "digiskyfusion@gmail.com", // Your email
//     pass: "mfxs aufn bsoa ttjc", // Your app password
//   },
// });

// export default transporter;



import nodemailer from 'nodemailer';

export const sendMailNodemailer = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "digiskyfusion@gmail.com",
      pass: "Kamleshsharma0310@", // Consider using environment variables for security
    },
  });

  const info = await transporter.sendMail({
    from: '"Digisky Fusion" <digiskyfusion@gmail.com>',
    to,
    subject,
    text,
    html,
  });

  // console.log("Message sent: %s", info.messageId);
};

