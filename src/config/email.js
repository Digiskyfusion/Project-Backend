import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Replace with your SMTP host
  port: 465, // Use 465 for secure connection, or 587 for STARTTLS
  secure: true, // Use true for port 465, false for other ports
  auth: {
    user: "digiskyfusion@gmail.com", // Your email
    pass: "mfxs aufn bsoa ttjc", 
  },
});

export default transporter;