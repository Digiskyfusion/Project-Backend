import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    user_image:{type:String},
    bio: { type: String, default: "" },
    city: { type: String, default: "" },
    degree_name: { type: String, default: null },
    add_video_introduction: { type: String, default: "" },
    certification: { type: [String], default: [] },
    experience_level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert"],
      default: "Beginner",
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subcategory: {
      type: [mongoose.Types.ObjectId],
      ref: "Subcategory",
      default: [],
    },

  },
  { timestamps: true }
);

// Use the collection name 'User_Profile' instead of 'ProfileVerification'
const ProfileModel = mongoose.model("User_Profile", ProfileSchema, "User_Profile");

export default ProfileModel;
