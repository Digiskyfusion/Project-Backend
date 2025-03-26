import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  roleType: { type: String, enum: ["freelancer", "client"], default: "client" },
  location: { type: String, default: "Rajasthan" },
  image: { type: String },
  mobileNumber: { type: String, required: true }, // Changed from Number to String
  bio: { type: String },
  language: { type: String },
  college: { type: String },
  name_of_course: { type: String },
  course_start: { type: Date },
  course_end: { type: Date },
  google_sub: { type: String },
  google_auth: { type: Boolean, default: false },
  manual_register: { type: Boolean, default: false },
  password: { type: String },
  required_skills: {
    type: [mongoose.Types.ObjectId],
    ref: "Category",
    default: [],
  },
  verification: {
    code: Number,
    expiresAt: Date,
    isVerified: { type: Boolean, default: false },
  },
  packages: [
    {
      packageId: { type: mongoose.Types.ObjectId, ref: "Package" },
      date: { type: Date },
      paymentDetails: { paymentId: String, orderId: String, signature: Object },
    },
  ],
  credits: { type: Number, default: 0 },
  status: { type: String, enum: ['Online', 'Offline'], default: 'Offline' },
  joinedAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
