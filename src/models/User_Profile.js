import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    category_id:{
      type: mongoose.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subcategory: {
      type: [mongoose.Types.ObjectId],
      ref: "Subcategory",
      default: [],
    },
    profile_image: { type: String, default: "" },
    date_of_birth: { type: Date, default: "" },
    govt_id_type:{ type: String, default: "" },
    govt_id_number:{ type: String, default: "" },
    govt_id_image: { type: String, default: "" },
    address: { type: String, default: "" },
    country: { type: String, default: "" },
    experience_years:  { type: String, default: "" },
    portfolio_link:  { type: String, default: "" },
    bio:  { type: String, default: "" },
    languages: {  type: [String], default: []  },
  },
  { timestamps: true }
);

// Use the collection name 'User_Profile' instead of 'ProfileVerification'
const ProfileModel = mongoose.model("User_Profile", ProfileSchema, "User_Profile");

export default ProfileModel;
