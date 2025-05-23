import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.js"; // Ensure 'model' is lowercase

// Register User
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
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
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
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "1h" });
  
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


// Update user credits
export const updateUserCredits = async (req, res) => {
  try {
    const { credits } = req.body;
    if (typeof credits !== 'number') {
      return res.status(400).json({ message: "Credits must be a number" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { credits },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Credits updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating credits", error: error.message });
  }
};