import cron from "node-cron";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import UserModel from "./models/user.js";
import User_Profile from "./models/User_Profile.js";
import connectDb from "./config/mongo.js"; // Ensure database connection

dotenv.config();

// Configure Email Transporter using OAuth2
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USERNAME,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
    pool: true, // Enables connection pooling
    maxConnections: 5, // Limits simultaneous connections
    rateLimit: 10, // Limits messages per second
});

// Function to check freelancer profiles and send emails
const sendVerificationEmails = async () => {
    try {
        console.log("Checking freelancer profiles...");

        // Get all freelancers from UserModel
        const freelancers = await UserModel.find({ roleType: "freelancer" });

        for (const user of freelancers) {
            // Check if the freelancer has a corresponding profile
            const profile = await User_Profile.findOne({ userId: user._id });

            if (!profile || !profile.verificationStatus) {
                const verificationLink = `https://bizchrome.ai/dashboard`;

                // Send email to freelancers without profile data
                const mailOptions = {
                    from: process.env.EMAIL_USERNAME,
                    to: user.email,
                    subject: "Complete Your Profile Verification",
                    html: `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Verify Your Profile - BizChrome</title>
                            <style>
                                body {
                                    font-family: 'Poppins', sans-serif;
                                    margin: 0;
                                    padding: 0;
                                    background: linear-gradient(to right, #1e3a8a, #4f46e5);
                                    text-align: center;
                                    color: #ffffff;
                                }

                                .email-container {
                                    max-width: 600px;
                                    margin: 40px auto;
                                    background: #ffffff;
                                    border-radius: 12px;
                                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
                                    padding: 20px;
                                    overflow: hidden;
                                }

                                .header {
                                    padding: 20px;
                                    background: #1e3a8a;
                                    border-top-left-radius: 12px;
                                    border-top-right-radius: 12px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                }

                                .logo {
                                    width: 50px;
                                    margin-right: 15px;
                                }

                                .verify-text {
                                    font-size: 24px;
                                    font-weight: bold;
                                    text-transform: uppercase;
                                    letter-spacing: 1px;
                                    color:white;
                                }

                                .content {
                                    padding: 30px;
                                }

                                h1 {
                                    color: #1e3a8a;
                                    font-size: 28px;
                                    font-weight: bold;
                                    margin-bottom: 20px;
                                }

                                p {
                                    font-size: 18px;
                                    line-height: 1.6;
                                    color: #2c3e50;
                                }

                                .btn {
                                    background: linear-gradient(to right, #4A00E0, #8E2DE2);
                                    color: white;
                                    font-weight: bold;
                                    padding: 12px 24px;
                                    border-radius: 8px;
                                    text-align: center;
                                    text-decoration: none;
                                    display: inline-block;
                                }

                                .btn:hover {
                                    background: linear-gradient(135deg, #1e3a8a, #0f254a);
                                    transform: scale(1.05);
                                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
                                }

                                .footer {
                                    font-size: 14px;
                                    color: #7f8c8d;
                                    padding: 15px;
                                    background: #f1f1f1;
                                    border-bottom-left-radius: 12px;
                                    border-bottom-right-radius: 12px;
                                }
                            </style>
                        </head>
                        <body>

                            <div class="email-container">
                                <!-- Header Section -->
                                <div class="header">
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDZc1Wv8hCozA95jx0Ug2FgMEKMBJ_Ry4ijQ&s" alt="BizChrome Logo" class="logo">
                                    <div class="verify-text">Verify Your Profile</div>
                                </div>

                                <!-- Content Section -->
                                <div class="content">
                                    <h1>🚀 Hello, ${user.name}! 🚀</h1>
                                    <p>We noticed that you haven't completed your profile verification.</p>
                                    <p>Verifying your profile unlocks freelancer benefits and ensures smooth access to BizChrome.</p>

                                    <a href="${verificationLink}" class="btn">Complete Verification</a>

                                    <p>If you have any questions, feel free to reach out. We're here to help!</p>
                                </div>

                                <!-- Footer Section -->
                                <div class="footer">
                                    &copy; ${new Date().getFullYear()} BizChrome. All rights reserved.
                                </div>
                            </div>

                        </body>
                        </html>
                    `,
                };
                await transporter.sendMail(mailOptions);
                console.log(`Verification reminder sent to: ${user.email}`);
            }
        }

        console.log("Freelancer profile check completed.");
    } catch (error) {
        console.error("Error sending emails:", error);
    }
};

// Ensure the database is connected before running cron jobs
connectDb().then(() => {
    console.log("Database connected. Scheduling email job...");

    // Schedule the job to run daily at 4:35 PM UTC (10:05 PM IST)
    cron.schedule("35 16 * * *", () => {
        console.log("Running scheduled email job...");
        sendVerificationEmails();
    });
});

// Export function in case manual execution is needed
export default sendVerificationEmails;
