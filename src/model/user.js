import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  roleType: { type: String, enum: ["freelancer", "client"], default: "freelancer" },
  state: { type: String, default: "Rajasthan" },
  image: { type: String },
  mobileNumber: { type: String },
  bio: { type: String },
  experience: { type: String },
  language: { type: String },
  password: { type: String },
  skills: [],
  credits: { type: Number },
  joineddate: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

export default User;
