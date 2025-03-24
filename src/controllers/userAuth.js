// Import only the necessary modules
import UserModel from "../models/user.js"; // Import the UserModel from the user model file
import jwt from "jsonwebtoken"; // Import the JWT library for token generation
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import { authClient, getUserData } from "../shared/googleAuth.js"; // Import Google Auth functions
import transporter from "../config/email.js"; // Import email transporter
import newsLetterModel from "../models/newsLetter.js"; // Import the newsletter model

class userAuthController {
  static register = async (req, res) => {
    const { email, password } = req.body;
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    req.body.password = hashPassword;
    req.body.manual_register = true;

    const user = await UserModel.create(req.body);

    if (user) {
      const token = await jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("token", token, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      const link = `${process.env.FRONTEND_URL}/login`
      // Send welcome email
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Welcome to Digisky!",
        text: `Hi ${user.name},

Welcome to DigiSkyfusion! 🚀 We’re excited to have you on board.

Your journey to connecting with top freelancers and businesses starts now. Complete your profile to get the best experience.

🔹 Post Jobs | 🔹 Find Work | 🔹 Monetize Your Skills

👉 [Complete Your Profile Now]

Need help? We’re here for you. Contact us anytime at digiskyhelp@gmail.com.

Cheers,
The DigiSkyfusion Team`,
       
      });

      return res.status(200).send({ message: "User registered successfully", info });
    } else {
      return res.status(400).json({ message: "Error registering user" });
    }
  };

  static login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await UserModel.findOne({ email });
      if (!user || !user.password) {
          return res.status(400).json({ message: "Invalid Credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: "Invalid Credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d", // Token expiration time
      });

      // console.log("Login successful. Token generated:", { token, userId: user._id });

      // Send the userId and token in the response
      res.status(200).json({ userId: user._id, token,  roleType: user.roleType , mobileNumber : user.mobileNumber , email : user.email , country: user.country , name : user.name ,  message: "Login successful" });
      console.log(user.roleType);
  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

  static Adminlogin = async (req, res) => {
    // console.log("login request initiated");
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    if (!user.isAdmin) {
      return res.status(400).json({ message: "Your are not a admin" });
    }

    if (!user || !user?.password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user.id, Admin: "true" }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    // console.log(token)
    res.cookie("token", token, {
      // httpOnly: true,
      // sameSite: 'none',
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });
    // console.log("login request completed");

    res.status(200).json({ userId: user._id, token, message: "Login successfull" });
  };

  static googleAuth = async (req, res) => {
    // console.log("google auth request initiated");
    const code = req.query.code;
    if (!code) {
      return res
        .status(400)
        .json({ error: "user declined google authentication" });
    }

    const client = await authClient();
    const r = await client.getToken(code);
    // Make sure to set the credentials on the OAuth2 client.
    await client.setCredentials(r.tokens);
    console.info("Tokens acquired.");
    // const user = oAuth2Client.credentials;
    // console.log('credentials',user);
    const userData = await getUserData(client.credentials.access_token);

    //store user info in db
    const user = await UserModel.findOneAndUpdate(
      { email: userData?.email },
      {
        $setOnInsert: {
          name: userData?.name,
          google_sub: userData?.sub,
          email: userData.email,
          google_auth: true,
        },
      },
      {
        upsert: true,
        new: true, // Return the modified document rather than the original
      }
    );

    //generate jwt
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      // httpOnly: true,
      // sameSite: 'none',
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });

    // console.log("google auth request completed");
    const redirectUrl = `${process.env.FRONTEND_URL}`;
    return res.redirect(redirectUrl);
    // return res
    //   .status(200)
    //   .json({ message: "google authentication successfull" });
  };

  static sendVerificationEmail = async (req, res) => {
    const { email } = req.params;
    const user = await UserModel.findOne({ email }, "email verification");

    if (!user) {
      return res.status(422).json({ message: "Account is not registered" });
    }
    if (user.verification.isVerified) {
      return res.status(422).json({ message: "Account is already verified" });
    }
    //send email with otp
    // generate the admin code
    const code = Math.floor(100000 + Math.random() * 900000);

    // calculate the expiration date (e.g. 15 minutes from now)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Digisky email verification",
      text: "Hello world?", // plain text body
      html: `<span>Here is your one-time OTP: ${code}</span>
      <br>
      <span>Note: This OTP will expire in 15 minutes.</span>`, // html body
    });

    const userData = await UserModel.findOneAndUpdate(
      { email },
      { verification: { code, expiresAt, isVerified: false } }
    );
    return res.status(200).send({
      status: "success",
      message: "Verification code sent successfully",
      info: info,
    });
  };

  static verifyEmail = async (req, res) => {
    const { otp } = req.body;
    const { email } = req.params;
    const currentTime = new Date();

    const user = await UserModel.findOne({
      email,
      "verification.code": otp,
      "verification.expiresAt": { $gt: currentTime },
    });

    if (!user) {
      return res.status(422).json({ message: "Invalid code" });
    }
    const updated = await UserModel.updateOne(
      { email },
      { verification: { isVerified: true } }
    );
    if (updated.modifiedCount > 0) {
      return res.status(200).json({ message: "Account verified successfully" });
    }
    return res.status(422).json({ message: "Error verifying email" });
  };

  static logOut = async (req, res) => {
    // console.log("logout request");

    //creating empty auth token and expires at the time of creation
    // res.cookie("token", "", {
    //   expires: new Date(0),
    // });
    res.clearCookie("token");
    // console.log("logout request completed");

    res.status(200).json({ status: "success", message: "logout successfully" });
  };

  static sendForgotPasswordEmail = async (req, res) => {
    // console.log("forgot password email request initiated");

    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    console.log("user");
    console.log(user);
    if (user) {
      const secret = user._id + process.env.JWT_SECRET_KEY;
      console.log("secret");
      console.log(secret);
      const token = jwt.sign({ userId: user._id }, secret, {
        expiresIn: "15m",
      });
      console.log("token");
      console.log(token);
      const link = `${process.env.FRONTEND_URL}/auth/login/reset-password/${user._id}/${token}`;
      // const logoImageUrl = "`logo.png`";
      // const resetPasswordImageUrl = `https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1095.jpg`;
     console.log("link");
     console.log(link);
      // send email
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM, // sender address
        to: user.email, // list of receivers
        subject: "Digisky Password Reset Link",
        html:` <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Request</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f7fc;
                    color: #2c3e50;
                    text-align: center;
                }
        
                .email-container {
                    max-width: 600px;
                    margin: 40px auto;
                    background: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    overflow: hidden;
                }
        
                .header {
                    padding: 20px;
                    background: #485ee1;
                }
        
                .logo {
                    width: 140px;
                    display: block;
                    margin: 0 auto;
                }
        
                .banner {
                    width: 100%;
                    height: auto;
                    border-bottom: 3px solid #485ee1;
                }
        
                .content {
                    padding: 30px;
                }
        
                h1 {
                    color: #485ee1;
                    font-size: 22px;
                    margin-bottom: 15px;
                }
        
                p {
                    font-size: 16px;
                    line-height: 1.6;
                    color: #34495e;
                }
        
                .btn {
                    display: inline-block;
                    padding: 12px 24px;
                    font-size: 16px;
                    font-weight: bold;
                    color: white;
                    background: #485ee1;
                    text-decoration: none;
                    border-radius: 6px;
                    margin-top: 20px;
                    transition: background 0.3s ease-in-out, transform 0.2s;
                }
        
                .btn:hover {
                    transform: scale(1.05);
                }
        
                .footer {
                    font-size: 12px;
                    color: #7f8c8d;
                    padding: 15px;
                    background: #f1f1f1;
                }
        
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
        
                .email-container {
                    animation: fadeIn 1s ease-in-out;
                }
            </style>
        </head>
        <body>
        
            <div class="email-container">
                <!-- Header Section -->
                <div class="header">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDZc1Wv8hCozA95jx0Ug2FgMEKMBJ_Ry4ijQ&s" alt="Digisky Logo" class="logo">
                </div>
                <!-- Content Section -->
                <div class="content">
                    <h1>Password Reset Request</h1>
                    <p>Hello ${user.name},</p>
                    <p>We received a request to reset your password. Click the button below to set a new one:</p>
        
                    <a href="${link}" class="btn" style="color:white;">Reset Password</a>
        
                    <p><strong>Note:</strong> This link will expire in 15 minutes.</p>
                </div>
        
                <!-- Footer Section -->
                <div class="footer">
                    &copy; ${new Date().getFullYear()} Digisky. All rights reserved.
                </div>
            </div>
        
        </body>
        </html>
        `,
      });
      console.log("info");
      console.log(info);
      // console.log("forgot password email request completed");

      return res.status(200).send({
        status: "success",
        message: "Password Reset Email Sent. Please Check Your Email",
        info: info,
      });
    } else {
      return res.status(400).send({ message: "Invalid email" });
    }
  };

  static resetPassword = async (req, res) => {
    // console.log("reset password api");

    const { userId, token } = req.params;
    const { password } = req.body;

    // Verify the token
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const secret = user._id + process.env.JWT_SECRET_KEY;

    jwt.verify(token, secret, async (err) => {
      if (err) {
        return res
          .status(401)
          .json({ status: "failed", message: "Invalid or expired token" });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(12);
      const hashPassword = await bcrypt.hash(password, salt);

      //if password exist i.e manual register else google auth
      const updatedUser = await UserModel.findByIdAndUpdate(
        { _id: userId },
        { password: hashPassword },
        { new: true }
      );

      // console.log("reset password request completed");

      res.json({
        status: "success",
        message:
          "Password reset successful. You can now log in with your new password.",
      });
    });
  };

  static subscribeNLetter = async (req, res) => {
    const { email } = req.body
    const existingUser = await newsLetterModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Already Subscribed" });
    }

    await newsLetterModel.findOneAndUpdate(
      { email },
      { email },
      { upsert: true, new: true }
    );

    // Send a success response
    res.status(201).json({ message: "Subscribed successfully" });
  };
}

export default userAuthController;