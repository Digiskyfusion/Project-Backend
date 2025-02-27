const express= require("express");
const app = express();
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken")
const userModel= require("../Model/user");
const chatModel= require("../Model/chat")
const cookieParser = require("cookie-parser");
const nodemailer= require("nodemailer")
const randomstring   = require("randomstring");
const User = require("../Model/user")
const planModel= require("../Model/Plan")
const Category= require ("../Model/category")
const SubCategory = require("../Model/subCategory")
const freelancerSchema= require("../Model/freelancer")
const clientModel= require("../Model/client");
app.use(cookieParser());

       const resetPasswordMail= async(name, email,token)=>
      {
          try {
              const transporter=nodemailer.createTransport({
                  host: process.env.EMAIL_HOST,
                  port:process.env.EMAIL_PORT,
                  secure:true,
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
          //     secure: false, 
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



        // const signup= async (req, res)=>
        // {
        //     try {
        //         let {name, email,password, roleType,country,mobileNumber,credits}= req.body;
        
        //         let userFind= await userModel.findOne({email});
        //         if(userFind){
        //             return res.status(200).send('user Already Exist from');
        //         }
        //         bcrypt.genSalt(10, function(err, salt) {
        //             bcrypt.hash(password, salt,async function(err, hash) {
        //                 let user= await userModel.create({
        //                     name,
        //                     email,
        //                     password:hash,
        //                     roleType,
        //                     country,
        //                     mobileNumber,
        //                     credits
        //                 })
        //                 let token = jwt.sign({ email }, process.env.JWT_SECRET_KEY);
        //                 res.cookie("token", token)
        //                 res.json(user)
        //                 res.status(201).send({ 
        //                     success: true,
        //                     message:"user register successfuly from backend reg",
        //                     user,
        //                     token
        //                 })
        //             });
        //         });
        //     } catch (error) {
        //         if (!res.headersSent) {
        //           res.status(500).json({ message: "Server error" });
        //       }
        //       res.status(500).send("error from registration") 
        //     }
        // }

        const signup = async (req, res) => {
          try {
              let { name, email, password, roleType, country, mobileNumber, credits } = req.body;
      
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
                  credits
              });
      
              // Generate JWT token
              let token = jwt.sign({ email }, process.env.JWT_SECRET_KEY);
              res.cookie("token", token);
      
              // Send only one response
              return res.status(201).json({ 
                  success: true,
                  message: "User registered successfully",
                  user,
                  token
              });
      
          } catch (error) {
              console.error(error);
              if (!res.headersSent) {
                  return res.status(500).json({ message: "Server error" });
              }
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
        

       
        const getUserProfile = async (req, res) => {
            const userId = req.params.id; // Extract user ID from URL parameter
        // console.log(userId);
        
            try {
                // Fetch user details, excluding sensitive fields like 'password'
                const user = await userModel.findById(userId).select('-password'); // Use your User model to find by ID
                if (!user) {
                    return res.status(404).json({ msg: 'User not found' });
                }
        
                // Return the user data in the response
                res.json(user);
            } catch (error) {
                console.error(error);
                res.status(500).json({ msg: 'Server error' });
            }
        };
        

         const updateUserProfile = async (req, res) => {
        console.log("caleled")
            try {
                // console.log(req.user)
                // console.log(req.params)
              if (req.user.id !== req.params.id) {
                return res.status(403).json({ message: "Unauthorized action" });
              }
              const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
              res.json(updatedUser);
            } catch (error) {
              res.status(500).json({ message: ("hello",error.message )});
            }
          };

         const deleteUser = async (req, res) => {
            try {
              if (req.user.roleType !== "admin" && req.user.id === req.params.id) {
                return res.status(403).json({ message: "Unauthorized action" });
              }
              await User.findByIdAndDelete(req.params.id);
              res.json({ message: "User deleted successfully" });
            } catch (error) {
              res.status(500).json({ message: error.message });
            }
          };
        


          const sendMessage = async (req, res) => {
            try {
              const { receiver, message, roleType } = req.body;
              const sender = req.user;
              console.log(message);
              
          
              if (!receiver || !message) {
                return res.status(400).json({ message: "Receiver and message are required" });
              }
          
              // Check if sender is a freelancer and has enough credits
              if (sender.roleType == "freelancer") {
                if (sender.credits < 1) {
                  return res.status(403).json({ message: "Insufficient credits" });
                }
                sender.credits -= 1; // Deduct one credit per message
                await sender.save();
              }
          
              // Save chat message
              const chatMessage = new chatModel({
                sender: sender._id,
                receiver: receiver,
                message,
                roleType 
              });
              
          
              await chatMessage.save();
          
              res.status(201).json({ message: "Message sent successfully", chat: chatMessage });
            } catch (error) {
              res.status(500).json({ message: "Server error", error:error.message });
            }
          };
          

          const chatHistoryAPI= async (req, res) => {
            try {
              const userId = req.params.userId;
              const loggedInUserId = req.user.id; // Assuming JWT or session authentication to get the logged-in user ID
          
              // Validate if the logged-in user is requesting their chat history
              if (!userId || userId !== loggedInUserId) {
                return res.status(403).json({ message: 'You can only access your own chat history.' });
              }
          
              // Fetch chat history between the logged-in user and the other user
              const chatHistory = await chatModel.find({
                $or: [
                  { senderId: loggedInUserId, receiverId: userId },
                  { senderId: userId, receiverId: loggedInUserId }
                ]
              }).sort({ createdAt: 1 }); // Sort by date (ascending)
          
              if (!chatHistory) {
                return res.status(404).json({ message: 'No chat history found.' });
              }
          
              // Return the chat history
              return res.status(200).json({ chatHistory });
          
            } catch (error) {
              console.error('Error fetching chat history:', error);
              return res.status(500).json({ message: 'Internal server error.' });
            }
          };
          


          // plan
          const createSubscription = async (req, res) => {
            const { name, credit, amount } = req.body;
          
            // Validate the input
            if (!name || !amount || !credit) {
              return res.status(400).json({ message: 'All fields are required' });
            }
          
            
          
            try {
              const newPlan = new planModel({
                name,
                amount,
                credit,
              });
          
            
              await newPlan.save();
          
              return res.status(201).json({ message: 'Subscription plan created successfully', plan: newPlan });
            } catch (error) {
              console.error('Error creating subscription plan:', error);
              return res.status(500).json({ message: 'Internal server error', error: error.message });
            }
          };
          
          const AllSubscription= async (req, res) => {
            try {
              const plans = await planModel.find(); // Find all subscription plans
              return res.status(200).json({ plans });  // Return all the plans as JSON
            } catch (error) {
              console.error('Error fetching subscription plans:', error);
              return res.status(500).json({ message: 'Internal server error' });
            }
          };




              // category and subcategory routes

              const createCategory = async (req, res) => {
                try {
                  const { name } = req.body;
                  const category = new Category({ name });
                  await category.save();
                  res.status(201).json({ message: "Category created", category });
                } catch (error) {
                  res.status(500).json({ message: "Error creating category", error: error.message });
                }
              };

                      // Read All Categories
            const getCategories = async (req, res) => {
              try {
                const categories = await Category.find(); // Fetch all categories
                res.status(200).json(categories);
              } catch (error) {
                res.status(500).json({ message: "Error fetching categories", error: error.message });
              }
            };

            // Read Single Category by ID
            const getCategoryById = async (req, res) => {
              try {
                const category = await Category.findById(req.params.id);
                if (!category) {
                  return res.status(404).json({ message: "Category not found" });
                }
                res.status(200).json(category);
              } catch (error) {
                res.status(500).json({ message: "Error fetching category", error: error.message });
              }
            };

            // Update Category by ID
            const updateCategory = async (req, res) => {
              try {
                const { name } = req.body;
                const updatedCategory = await Category.findByIdAndUpdate(
                  req.params.id,
                  { name },
                  { new: true } // Returns the updated document
                );

                if (!updatedCategory) {
                  return res.status(404).json({ message: "Category not found" });
                }

                res.status(200).json({ message: "Category updated", updatedCategory });
              } catch (error) {
                res.status(500).json({ message: "Error updating category", error: error.message });
              }
            };

            // Delete Category by ID
            const deleteCategory = async (req, res) => {
              try {
                const deletedCategory = await Category.findByIdAndDelete(req.params.id);
                if (!deletedCategory) {
                  return res.status(404).json({ message: "Category not found" });
                }
                res.status(200).json({ message: "Category deleted", deletedCategory });
              } catch (error) {
                res.status(500).json({ message: "Error deleting category", error: error.message });
              }
            };
          



                // Create SubCategory (Already Provided)
          const createSubCategory = async (req, res) => {
            try {
              const { category_id, name } = req.body;
              const subcategory = new SubCategory({ category_id, name });
              await subcategory.save();
              res.status(201).json({ message: "Subcategory created", subcategory });
            } catch (error) {
              res.status(500).json({ message: "Error creating subcategory", error: error.message });
            }
          };

          // Read All SubCategories
          const getSubCategories = async (req, res) => {
            try {
              const subcategories = await SubCategory.find().populate("category_id"); // Fetch all subcategories with category details
              res.status(200).json(subcategories);
            } catch (error) {
              res.status(500).json({ message: "Error fetching subcategories", error: error.message });
            }
          };

          // Read Single SubCategory by ID
          const getSubCategoryById = async (req, res) => {
            try {
              const subcategory = await SubCategory.findById(req.params.id).populate("category_id");
              if (!subcategory) {
                return res.status(404).json({ message: "Subcategory not found" });
              }
              res.status(200).json(subcategory);
            } catch (error) {
              res.status(500).json({ message: "Error fetching subcategory", error: error.message });
            }
          };

          // Update SubCategory by ID
          const updateSubCategory = async (req, res) => {
            try {
              const { category_id, name } = req.body;
              const updatedSubCategory = await SubCategory.findByIdAndUpdate(
                req.params.id,
                { category_id, name },
                { new: true } // Returns the updated document
              );

              if (!updatedSubCategory) {
                return res.status(404).json({ message: "Subcategory not found" });
              }

              res.status(200).json({ message: "Subcategory updated", updatedSubCategory });
            } catch (error) {
              res.status(500).json({ message: "Error updating subcategory", error: error.message });
            }
          };

          // Delete SubCategory by ID
          const deleteSubCategory = async (req, res) => {
            try {
              const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);
              if (!deletedSubCategory) {
                return res.status(404).json({ message: "Subcategory not found" });
              }
              res.status(200).json({ message: "Subcategory deleted", deletedSubCategory });
            } catch (error) {
              res.status(500).json({ message: "Error deleting subcategory", error: error.message });
            }
          };




          // freelancer profile
          const createFreelancer =  async (req, res) => {
            try {
              const existingFreelancer = await freelancerSchema.findOne({ freelancer_id: req.body.freelancer_id });
              if (existingFreelancer) {
                return res.status(400).json({ success: false, message: "Freelancer already exists." });
              }
              const freelancer = new freelancerSchema(req.body);
              await freelancer.save();
              res.status(201).json({ success: true, data: freelancer });
              console.log(freelancer);
              
            } catch (error) {
              res.status(400).json({ success: false, error: error.message , message :"hey" });
            }
          };

          // get all freelancer
          const getallfreelancer= async (req, res) => {
            try {
              const freelancers = await freelancerSchema.find();
              res.status(200).json({ success: true, data: freelancers });
            } catch (error) {
              res.status(500).json({ success: false, error: error.message });
            }
          }

          // get single freelancer by id 
          const getSingleFreelancer=  async (req, res) => {
            try {
              const freelancer = await freelancerSchema.findById(req.params.id);
              if (!freelancer) return res.status(404).json({ success: false, message: "Freelancer not found" });
              res.status(200).json({ success: true, data: freelancer });
            } catch (error) {
              res.status(500).json({ success: false, error: error.message });
            }
          }


          // update freelancer by id
          const updatefreelancer= async (req, res) => {
            try {
              const freelancer = await freelancerSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
              if (!freelancer) return res.status(404).json({ success: false, message: "Freelancer not found" });
              res.status(200).json({ success: true, data: freelancer });
            } catch (error) {
              res.status(400).json({ success: false, error: error.message });
            }
          }

          // delete freelancer by id
          const deleteFreelancer =  async (req, res) => {
            try {
              const freelancer = await freelancerSchema.findByIdAndDelete(req.params.id);
              if (!freelancer) return res.status(404).json({ success: false, message: "Freelancer not found" });
              res.status(200).json({ success: true, message: "Freelancer deleted successfully" });
            } catch (error) {
              res.status(500).json({ success: false, error: error.message });
            }
          }





          // clinetSchema crud

          // createClient
          const createClient= async (req, res) => {
            try {
              const { client_id, image, mobileNumber, govt_id_proof,govt_id_number } = req.body;
             
              
              const newClient = new clientModel({ client_id, image, mobileNumber, govt_id_proof,govt_id_number });
              await newClient.save();
               console.log(newClient);
              res.status(201).json({ success: true, message: "Client added successfully", data: newClient });
            } catch (err) {
              res.status(500).json({ success: false, message: "Error adding client", error: err.message });
            }
          }

          // get all client
          const getAllClient= async (req, res) => {
            try {
              const clients = await clientModel.find();
              res.status(200).json({ success: true, data: clients });
            } catch (err) {
              res.status(500).json({ success: false, message: "Error fetching clients", error: err.message });
            }
          }


          // get single clinet

          const getSingleClinet=  async (req, res) => {
            try {
              const client = await clientModel.findById(req.params.id);
              if (!client) return res.status(404).json({ success: false, message: "Client not found" });
              res.status(200).json({ success: true, data: client });
            } catch (err) {
              res.status(500).json({ success: false, message: "Error fetching client", error: err.message });
            }
          }

          // update clinet

          const updateClinet=async (req, res) => {
            try {
              const updatedClient = await clientModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
              if (!updatedClient) return res.status(404).json({ success: false, message: "Client not found" });
              res.status(200).json({ success: true, message: "Client updated successfully", data: updatedClient });
            } catch (err) {
              res.status(500).json({ success: false, message: "Error updating client", error: err.message });
            }
          }

          // delete client

          const deleteClient= async (req, res) => {
            try {
              const deletedClient = await clientModel.findByIdAndDelete(req.params.id);
              if (!deletedClient) return res.status(404).json({ success: false, message: "Client not found" });
              res.status(200).json({ success: true, message: "Client deleted successfully" });
            } catch (err) {
              res.status(500).json({ success: false, message: "Error deleting client", error: err.message });
            }
          }
module.exports={
    signup,
    login,
    forgetPassword,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    deleteUser,
    sendMessage,
    chatHistoryAPI,
    createSubscription,
    AllSubscription,
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    createSubCategory,
    getSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory,
    createFreelancer,
    getallfreelancer,
    getSingleFreelancer,
    updatefreelancer,
    deleteFreelancer,
    createClient,
    getAllClient,
    getSingleClinet,
    updateClinet,
    deleteClient
}








