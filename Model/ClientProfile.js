const mongoose = require('mongoose');

const ClientProfileSchema = new mongoose.Schema({
  user_id:{ type: mongoose.Schema.Types.ObjectId, ref:"user"},
  fullName: String,
  email: String,
  phone: String,
  address: String,
  experience: Number,
  skills: [{ type: String }],  // Array of skills
  portfolioLinks: [{ type: String }],  // Array of portfolio links
  education: String,
  bio: String,
  profileImage: String
});

module.exports = mongoose.model('ClientProfile', ClientProfileSchema);