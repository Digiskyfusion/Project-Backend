const mongoose = require("mongoose");

const freelancerProfileSchema = new mongoose.Schema({
  user_id:{ type: mongoose.Schema.Types.ObjectId, ref:"user"},
  accountType: { type: String, default: "Freelancer" },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  skills: { type: String, required: true },
  experience: { type: String, required: true },
  bio: { type: String, required: true },
  profileImage: { type: String }, // URL or path of the uploaded image
});

module.exports = mongoose.model("FreelancerProfile", freelancerProfileSchema);
