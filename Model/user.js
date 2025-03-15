const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  roleType: { type: String, enum: ["freelancer", "client"], required: true },
  country: { type: String, required: true },
  mobileNumber:{type:  String, required:true},
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  credits: { type: Number, default: 0 },
},{timestamps:true});
UserSchema.index({ tokenExpiresAt: 1 }, { expireAfterSeconds: 0 });
module.exports=mongoose.model("user", UserSchema);