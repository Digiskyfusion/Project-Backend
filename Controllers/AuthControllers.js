const express= require("express");
const app = express();
const bcrypt= require("bcryptjs");
const jwt= require("jsonwebtoken")
const userModel= require("../Model/user");
const cookieParser = require("cookie-parser");
const randomstring   = require("randomstring");
const { sendMailNodemailer } = require("../Mail/SendMail");
app.use(cookieParser());


        const signup = async (req, res) => {
          try {
              let { name, email, password, roleType, country, mobileNumber } = req.body;
      
              let userFind = await userModel.findOne({ email });
              if (userFind) {
                  return res.status(200).send('User already exists');
              }
      
              // Hash password before saving
              const salt = await bcrypt.genSalt(10);
              const hash = await bcrypt.hash(password, salt);
      
              // Create user
              let user = await userModel.create({
                  name,
                  email,
                  password: hash,
                  roleType,
                  country,
                  mobileNumber,
              });
      
              // Generate JWT token
              let token = jwt.sign({ email }, process.env.JWT_SECRET_KEY);
              res.cookie("token", token);
              await sendMailNodemailer({
                to: email,
                subject: "Account created SuccessFully ",
                text: "hello",
                html: `<p>Hi ${user.name},</p>
                <p>Hy Welcome to the freelancer website:</p>`
              });
              // Send only one response
              return res.status(201).json({ 
                  success: true,
                  message: "User registered successfully",
                  user: {
                          _id: user._id,   // ✅ Ensure _id is sent
                          name: user.name,
                          email: user.email,
                        },
                  token 
              });
      
          } catch (error) {
              console.error(error);
                  return res.status(500).json({ message: "Server error" });
          }
      };
      


        const login = async (req, res) => {
            try {
                const { email, password } = req.body;
        
                // Check if user exists
                const user = await userModel.findOne({ email });
                if (!user) {
                    return res.status(400).json({ success: false, message: "Invalid user" });
                }
        
                // Compare passwords
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ success: false, message: "Invalid credentials" });
                }
        
                // Generate JWT token
                const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        
                // Set cookie with security flags
                res.cookie("token", token);
                await sendMailNodemailer({
                    to: email,
                    subject: "login created SuccessFully ",
                    text: "hello",
                    html: `<p>Hi ${user.name},</p>
                    <p>Hy You are login successfully:</p>`
                  });
                // Success response
                return res.status(200).json({
                    success: true,
                    message: "Successfully logged in",
                    user: {
                        name: user.name,
                        email: user.email,
                        token,
                    },
                });
        
            } catch (error) {
                console.error("Login Error:", error);
                return res.status(500).json({ success: false, message: "Internal Server Error" });
            }
        };

       

        const forgetPassword = async (req, res) => {
            try {
                let { email } = req.body;
                let user = await userModel.findOne({ email });
              
                
                if (user) {
                    let randomString = randomstring.generate();
                    let expirationTime = Date.now() + 60 * 60 * 1000;
                    await userModel.updateOne({ email }, { $set: { token: randomString ,tokenExpiresAt:new Date(expirationTime) } });
                    try {
                      // Send email
                      await sendMailNodemailer({
                        to: email,
                        subject: "Welcome to  reset password",
                        text: "hello",
                        html: `<p>Hi ${user.name},</p>
                        <p>Please click the link below to reset your password:</p>
                        <a href="http://localhost:5173/resetpassword?token=${randomString}" target="_blank">Reset Password</a>
                        <p>If you did not request this, please ignore this email.</p>`,
                      });
                  
                      return res.status(200).json({
                        success: true,
                        message: "Please check your email inbox to reset your password."
                    });
                    } catch (error) {
                     return res.status(500).json({ message: "Failed to send mail", error });
                    }
                } else {
                    return res.status(404).json({
                        success: false,
                        message: "This email does not exist."
                    });
                }
            } catch (error) {
                console.log("Error in forgetPassword:", error);
                return res.status(500).send("Error from forgetPassword route.");
            }
        };
 
        const resetPassword = async (req, res) => {
            try {
                const token = req.query.token;
                // console.log(token);
                
                let tokenData = await userModel.findOne({ token });
            //  console.log(tokenData);
        
                if (tokenData) {
                    const { password } = req.body;
        
                    // Hash the new password
                    bcrypt.genSalt(10, async (err, salt) => {
                        if (err) {
                            return res.status(500).send({ success: false, message: "Error generating salt" });
                        }
        
                        // Hash the password
                        bcrypt.hash(password, salt, async (err, hash) => {
                            if (err) {
                                return res.status(500).send({ success: false, message: "Error hashing password" });
                            }
        
                            // Update the user password in the database
                            let updatedUser = await userModel.findByIdAndUpdate(
                                 tokenData._id,
                                { $set: { password: hash, token: "" } },
                                { new: true }
                            );
        
                            // Respond with the updated user data
                            res.status(200).json({
                                success: true,
                                message: "User password has been reset ssuccessfully.",
                                data: updatedUser,
                            });
                        });
                    });
                } else {
                    return res.status(404).send({ success: false, message: "The link has expired or is invalid hihi." });
                }
            } catch (error) {
                console.error(error);
                return res.status(500).send({ success: false, message: "An error occurred during password reset." });
            }
        };


module.exports={
    signup,
    login,
    forgetPassword,
    resetPassword,
}








