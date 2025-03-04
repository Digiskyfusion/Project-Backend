const express = require("express");
const app = express();
const userModel = require("../Model/user");
const User = require("../Model/user");

const getUserProfile = async (req, res) => {
  const userId = req.params.id; // Extract user ID from URL parameter
  // console.log(userId);

  try {
    // Fetch user details, excluding sensitive fields like 'password'
    const user = await userModel.findById(userId).select("-password"); // Use your User model to find by ID
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return the user data in the response
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  console.log("caleled");
  try {
    // console.log(req.user)
    // console.log(req.params)
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: ("hello", error.message) });
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

module.exports = { getUserProfile, updateUserProfile, deleteUser };
