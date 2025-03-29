import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use true for port 465, false for others
  auth: {
    user: "digiskyfusion@gmail.com", // Your email
    pass: "mfxs aufn bsoa ttjc", // Your app password
  },
});

export default transporter;
