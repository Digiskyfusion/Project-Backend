const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const planModel = require("../Model/plan");
const userModel = require("../Model/user")
app.use(cookieParser());
const createSubscription = async (req, res) => {
  const { name, credit, amount } = req.body;

  // Validate the input
  if (!name || !amount || !credit) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create new plan
    const newPlan = new planModel({
      user_id: req.user,
      name,
      amount,
      credit,
    });

    await newPlan.save();

    // Update user's credits
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user, 
      { $inc: { credits: credit } }, // Increment credits
      { new: true }
    );
console.log(updatedUser)
    return res.status(201).json({
      message: "Subscription plan created successfully",
      plan: newPlan,
      updatedCredits: updatedUser.credits, // Sending updated credits in response
    });
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};


const AllSubscription = async (req, res) => {
  try {
    const plans = await planModel.find(); // Find all subscription plans
    return res.status(200).json({ plans }); // Return all the plans as JSON
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createSubscription, AllSubscription };
