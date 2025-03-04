const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const freelancerSchema = require("../Model/freelancer");
app.use(cookieParser());

// freelancer profile
const createFreelancer = async (req, res) => {
  try {
    const existingFreelancer = await freelancerSchema.findOne({
      freelancer_id: req.body.freelancer_id,
    });
    // const existingFreelancer = await freelancerSchema.findOne({ email: req.user.email });
    if (existingFreelancer) {
      return res
        .status(400)
        .json({ success: false, message: "Freelancer already exists." });
    }
    const freelancer = new freelancerSchema(req.body);
    await freelancer.save();
    res.status(201).json({ success: true, data: freelancer });
    console.log(freelancer);
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: error.message, message: "hey" });
  }
};

// get all freelancer
const getallfreelancer = async (req, res) => {
  try {
    const freelancers = await freelancerSchema.find();
    res.status(200).json({ success: true, data: freelancers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// get single freelancer by id
const getSingleFreelancer = async (req, res) => {
  try {
    const freelancer = await freelancerSchema.findById(req.params.id);
    if (!freelancer)
      return res
        .status(404)
        .json({ success: false, message: "Freelancer not found" });
    res.status(200).json({ success: true, data: freelancer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// update freelancer by id
const updatefreelancer = async (req, res) => {
  try {
    const freelancer = await freelancerSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!freelancer)
      return res
        .status(404)
        .json({ success: false, message: "Freelancer not found" });
    res.status(200).json({ success: true, data: freelancer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// delete freelancer by id
const deleteFreelancer = async (req, res) => {
  try {
    const freelancer = await freelancerSchema.findByIdAndDelete(req.params.id);
    if (!freelancer)
      return res
        .status(404)
        .json({ success: false, message: "Freelancer not found" });
    res
      .status(200)
      .json({ success: true, message: "Freelancer deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createFreelancer,
  getallfreelancer,
  getSingleFreelancer,
  updatefreelancer,
  deleteFreelancer,
};
