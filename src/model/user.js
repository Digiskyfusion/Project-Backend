import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true ,unique: true},
  roleType: { type: String, enum: ["freelancer", "client"], default: "freelancer" },
  state: { type: String, default: "Rajasthan" },
  city: { type: String },              // <-- Added city
  country: { type: String },          // <-- Added country
  image: { type: String },
  mobileNumber: { type: String },
  bio: { type: String },
  experience: { type: String },
    pastExperience: { type: String }, // ✅ New field
  work: {
  type: [String],
  default: [],
},// ✅ New field (array of work items)
  language: { type: String },
  password: { type: String },
  skills: [],
  showcaseLinks: [{ type: String }],
  credits: { type: Number, default: 0 },
  joineddate: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

export default User;
