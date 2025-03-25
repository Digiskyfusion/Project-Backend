import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    user_image:{type:String},
    bio: { type: String, default: "" },
    portfolio_project_title: { type: String, default: "" },
    your_role: { type: String, default: "" },
    project_description: { type: String, default: "" },
    skills_and_deliverables: { type: [String], default: [] },
    content: {
      type: [
        {
          heading: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
      default: [],
    },
    company: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    job_title: { type: String, default: "" },
    start_month: { type: String, default: "" },
    start_year: { type: String, default: null },
    end_month: { type: String, default: "" },
    end_year: { type: String, default: null },
    employment_description: { type: String, default: "" },
    college_name: { type: String, default: "" },
    degree_name: { type: String, default: null },
    degree_start_date: { type: Date, default: null },
    degree_end_date: { type: Date, default: "" },
    education_description: { type: String, default: "" },
    add_video_introduction: { type: String, default: "" },
    certification: { type: [String], default: [] },
    visibility: {
      type: String,
      enum: ["public", "private", "bizchrome"],
      default: "public",
    },
    preference: {
      type: String,
      enum: ["both", "short-term", "long-term"],
      default: "both",
    },
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

    linked_account: { type: [String], default: [] }
  },
  { timestamps: true }
);

// Use the collection name 'User_Profile' instead of 'ProfileVerification'
const ProfileModel = mongoose.model("User_Profile", ProfileSchema, "User_Profile");

export default ProfileModel;
