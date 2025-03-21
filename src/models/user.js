import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  roleType: { type: String, enum: ["freelancer", "client"], default: "client" },
  country: { type: String, default: "India" },
  mobileNumber: { type: Number },
  google_sub: { type: String },
  google_auth: { type: Boolean, default: false },
  manual_register: { type: Boolean, default: false },
  password: { type: String },
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
  credits: { type: Number, default: 0},
  status: { type: String, enum: ['Online', 'Offline'], default: 'Offline' },
  joinedAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;

