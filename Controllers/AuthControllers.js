const express= require("express");
const app = express();
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken")
const userModel= require("../Model/user");
const cookieParser = require("cookie-parser");
const nodemailer= require("nodemailer")
const randomstring   = require("randomstring");



app.use(cookieParser());

const resetPasswordMail= async(name, email,token)=>
{
    try {
        const transporter=nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            // service:"gmail",
            port:process.env.EMAIL_PORT,
            secure:false,
            // requireTLS:false,
            auth:{
                user:process.env.USER_EMAIL,
                password:process.env.USER_PASSWORD,
            }
        })
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //       user: process.env.USER_EMAIL,
        //       pass: process.env.USER_PASSWORD,
        //     }
        //   });

          

        const mailOption = {
            from: process.env.USER_EMAIL,
            // from:"manishsharma6906@gmai.com",
            to: email,
            subject: "Reset Your Password",
            html: `<p>Hi ${name},</p>
                   <p>Please click the link below to reset your password:</p>
                   <a href="http://localhost:3000/reset-password?tokens=${token}" target="_blank">Reset Password</a>
                   <p>If you did not request this, please ignore this email.</p>`
        };
        
        try {
            transporter.sendMail(mailOption,function(error,info){
                // console.log(info);
                
                if(error){
                    console.log(`erorr from mailoptions ${error}`);
                    
                }
                else{
                    console.log('Message sent: ', info.response);
                    return res.status(200).json({ message: 'Email sent successfully!' });
                    // console.log("mail hass been send",info.response);
                    
                }
            });
        } catch (error) {
            return res.status(400).send("error from inside nodemailer")
        }

       
    } catch (error) {
        return res.status(400).send("error from nodemailer")
    }
    
    // const transporter = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //       user: process.env.EMAIL_USER,
    //       pass: process.env.EMAIL_PASS,
    //     },
    //   });
      
    //   // Function to send an email
    //   const sendEmail = async (to, subject, html) => {
    //     try {
    //       const mailOptions = {
    //         from: `"Your App" <${process.env.EMAIL_USER}>`,
    //         to,
    //         subject,
    //         html,
    //       };
      
    //       const info = await transporter.sendMail(mailOptions);
    //       console.log(`Email sent: ${info.messageId}`);
    //       return true;
    //     } catch (error) {
    //       console.error("Email sending error:", error);
    //       return false;
    //     }
    //   };
      
    //   // Send Welcome Email
    //   const sendWelcomeEmail = async (email, name) => {
    //     const html = `<h3>Welcome, ${name}!</h3><p>Thank you for signing up.</p>`;
    //     return sendEmail(email, "Welcome to Our Platform!", html);
    //   };
      
    //   // Send Password Reset Email
    //   const sendPasswordResetEmail = async (email, resetToken) => {
    //     const resetLink = `http://yourfrontend.com/reset-password?token=${resetToken}`;
    //     const html = `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`;
    //     return sendEmail(email, "Reset Your Password", html);
    //   };

}



const Home=(req, res)=>
    {
        try {
           res.send("hello welcome to the home page");
        } catch (error) {
            console.log(error);
            
        }
    } 


    const signup= async (req, res)=>
        {
            try {
                let {name, email,password, roleType,country}= req.body;
        
                let userFind= await userModel.findOne({email});
        
                if(userFind){
                    return res.status(200).send('user Already Exist from');
                }
        
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt,async function(err, hash) {
                        let user= await userModel.create({
                            name,
                            email,
                            password:hash,
                            roleType,
                            country
                        })
                        let token = jwt.sign({ email }, process.env.SECRET_KEY);
                        res.cookie("token", token)
                        // res.json(user)
                        res.status(201).send({ 
                            success: true,
                            message:"user register successfuly from backend reg",
                            user,
                            token
                        })
                    });
                });
            } catch (error) {
                res.status(500).send("error from registration") 
            }
        }


        const login=async (req,res)=>{
            try {
                let {email, password}= req.body
                let user= await userModel.findOne({email});
                if(!user){
                    return res.status(200).send("invalied user from login")
                }
                bcrypt.compare(password, user.password, function(err, result) {
                   if(result){
                    let token= jwt.sign({email}, process.env.SECRET_KEY)
                    res.cookie("token", token)
                    // console.log(token);
                    res.status(200).send({
                        success:true,
                        message:"successfully login",
                        user:{
                            name:user.name,
                            email:user.email,
                        },
                        token
                       })
                   }
                   else{
                    res.status(200).send({
                        success:true,
                        message:"invaild data",})
                   }
                });
                
            } catch (error) {
              return res.status(500).send("error from login") 
            }
        }


        // const forgetPassword= async (req, res)=>
        // {
        //     try {
        //         let {email}= req.body;
        //         let user= await userModel.findOne({email});
        //         if(user){
        //             let randomString= randomstring.generate();
        //             await  userModel.updateOne({email},{$set:{token:randomString}});
        //            resetPasswordMail(user.name, user.email,randomString)
        //            return res.status(200).json({success:true,
        //             message:"please check you email inbox and forget your password"});
        //         }else{
        //             return res.status(404).json({
        //                 sucess:false,
        //                 message:"this email is not exist"})
        //         }
                
        //     } catch (error) {
        //         return res.status(500).send("error from forgetpassword")
        //     }
        // }


        // const resetPassword= async (req,res)=>
        // {
        //     try {
        //         let token= req.query.token;
        //        let tokenData= user.findOne({token})
        //         if(tokenData){
        //             const password= req.body.password
        //          let newpassword=   bcrypt.genSalt(10, function(err, salt) {
        //                 bcrypt.hash(password, salt,async function(err, hash) {
        //                     let user= await userModel.create({
        //                         password:hash,
        //                     })
        //                     res.status(201).send({ 
        //                         success: true,
        //                         message:"user register successfuly from backend reg",
        //                         user,
        //                         token
        //                     })
        //                 });
        //             });
        //           let userData=  userModel.findByIdAndUpdate({_id:tokenData._id},{$set:{password:newpassword,token:""}},{new :true})
        //           res.status(404).send({sucess:true, message:"user password has been reset", data:userData})
        //         }else{
        //           return  res.status(404).send({sucess:true, message:"the link is expire"})
        //         }
        //     } catch (error) {
        //      return res.status(404).send("error from reset password")   
        //     }
        // }

        const forgetPassword = async (req, res) => {
            try {
                let { email } = req.body;
                let user = await userModel.findOne({ email });
                if (user) {
                    let randomString = randomstring.generate();
                    let expirationTime =  60 * 60 * 1000; // 1 hour from now
                    await userModel.updateOne({ email }, { $set: { token: randomString ,tokenExpiresAt: expirationTime } });
                    resetPasswordMail(user.name, user.email, randomString); // Send email after updating token
                    return res.status(200).json({
                        success: true,
                        message: "Please check your email inbox to reset your password."
                    });
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
        
                // Find the token in the database (make sure it's saved in the user model)
                let tokenData = await userModel.findOne({ token });
        
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
        
                            // Update the user's password in the database
                            let updatedUser = await userModel.findByIdAndUpdate(
                                { _id: tokenData._id },
                                { $set: { password: hash, token: "" } },
                                { new: true }
                            );
        
                            // Respond with the updated user data
                            res.status(200).send({
                                success: true,
                                message: "User password has been reset successfully.",
                                data: updatedUser,
                            });
                        });
                    });
                } else {
                    return res.status(404).send({ success: false, message: "The link has expired or is invalid." });
                }
            } catch (error) {
                console.error(error);
                return res.status(500).send({ success: false, message: "An error occurred during password reset." });
            }
        };
        


module.exports={Home,signup,login,forgetPassword,resetPassword}








