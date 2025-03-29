import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 465,
  secure: process.env.SMTP_SECURE === "true", // Use true for port 465, false for others
  auth: {
    user: process.env.SMTP_USER, // Your email from environment variables
    pass: process.env.SMTP_PASS, // Your app password from environment variables
  },
});

export default transporter;
