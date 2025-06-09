import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.js"; // Ensure 'model' is lowercase
import { sendMailNodemailer } from "../config/email.js";

// Register User
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, mobileNumber, state, roleType } = req.body;

//     // Check if user already exists
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: "User already exists" });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user
//     user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       mobileNumber,
//       state,
//       roleType,
//     });

//     await user.save();
    
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };



export const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobileNumber, state, roleType } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      state,
      roleType,
    });

    await user.save();

    // ✅ Send welcome email
    if (user.email) {
      await sendMailNodemailer({
        to: user.email,
        subject: "Welcome to DIGISKY.ai",
        text: `Hi ${user.name}, Welcome to DIGISKY.ai – Let’s Get Started!!`,
   html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1); padding: 30px;">

      <div style="text-align: center;">
        <img 
          src="https://yt3.googleusercontent.com/6tDf6NB-Mv1J_ySKEM4NXQyifUHgpHrghpUIqE3dXj2wc8DJl2SqyO5R0qobKinKNY8JyA4SRaQ=s200-c-k-c0x00ffffff-no-rj"
          alt="DIGISKY.ai Logo"
          style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; margin-bottom: 20px;"
        />
      </div>

      <h2 style="text-align: center; color: #2e2e2e; font-size: 24px; margin-bottom: 12px;">
        🎉 Welcome to <span style="color: #007BFF;">JobConnect</span>!
      </h2>

      <p style="font-size: 16px; color: #444; text-align: center; line-height: 1.6; margin-bottom: 25px;">
        Hi <strong>${user.name}</strong>,<br/>
        Thank you for registering with <strong>DIGISKY.ai</strong>! We're thrilled to have you on board. Whether you're looking to hire talent or get hired, our platform is here to support your goals.
      </p>

      <div style="background-color: #f9fafb; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 25px;">
        <p style="margin: 0; font-size: 15px; color: #333;">
          You’re now registered as a <strong style="color: #007BFF;">${user.roleType}</strong>.
        </p>
      </div>

      <p style="font-size: 15px; color: #555; line-height: 1.5; text-align: center;">
        Explore, connect, and start your journey with us today. <br/>
        If you have any questions, feel free to reach out — we're just a message away!
      </p>

      <p style="font-size: 14px; color: #888; text-align: center; margin-top: 30px;">
        — Team <strong>DIGISKY.ai</strong>
      </p>
    </div>
  </div>
`




      });
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
            const token = jwt.sign(
              { id: user._id, email: user.email, roleType: user.roleType }, 
              process.env.JWT_SECRET_KEY || "your_jwt_secret", 
              { expiresIn: "1h" }
            );

  
      // const token = jwt.sign({ id: user._id , user:user  }, process.env.JWT_SECRET_KEY || "your_jwt_secret", { expiresIn: "1h" });
  
      // Remove password from user data before sending response
      const { password: _, ...userData } = user.toObject();
  
      res.status(200).json({ message: "Login successful", token, user: userData });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };  

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

// Get users by skills (case-insensitive)
export const getUsersBySkills = async (req, res) => {
    try {
        let { skill } = req.query;

        if (!skill) {
            return res.status(400).json({ message: "Skill parameter is required" });
        }

        console.log("Searching for users with skill:", skill);

        // Ensure skill is trimmed and converted to lowercase for consistency
        const regex = new RegExp(skill.trim(), "i");

        // Fetch users whose `skills` array contains a matching skill
        const users = await User.find({ skills: { $regex: regex } });

        console.log("Found users:", users);

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found with this skill" });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // console.log(req.body.image);
     
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};


// Update user
// export const updateUser = async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     try {
//       // Send email
//       await transporter.sendMail({
//         to: email,
//         subject: "Welcome to Digisky Fusion",
//         text: "hello",
//         html: `<p>Hi ${user.name},</p>
//         <p>We are excited to have you on board. As a token of appreciation, we have credited 15 free credits to your account.</p>
//         <p>You can use these credits to explore our services and features.</p>
//         <p>If you have any questions or need assistance, feel free to contact our support team.</p>
//         <p>Enjoy your journey with us!</p>
//         <p>Best Regards,</p>
//         <p>The Digisky Fusion Team</p>`,
//       });
    
//       return res.status(200).json({
//         success: true,
//         message: "Please check your email inbox for your free credits and welcome message.",
//       });
//     } catch (error) {
//       return res.status(500).json({ message: "Failed to send mail", error });
//     }

//     if (!updatedUser) return res.status(404).json({ message: "User not found" });

//     res.status(200).json({ message: "User updated successfully", user: updatedUser });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating user", error: error.message });
//   }
// };



// Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
  
};
