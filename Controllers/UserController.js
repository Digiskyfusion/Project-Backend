const express = require("express");
const app = express();
const User = require("../Model/user");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password field
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile by ID
const getUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
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

module.exports = { getAllUsers, getUserProfile, updateUserProfile, deleteUser };
