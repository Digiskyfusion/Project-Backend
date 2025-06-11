import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    skills: { type: String, required: true },
    // scope: { type: String, required: true },
    budget: { type: Number, required: true },
    experience: { type: String, required: true },
   currency: { 
  type: String, 
  required: true,
  enum: ['USD', 'INR', 'EUR'], 
},
    description: { type: String },
    // file: { type: String },
    // location: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
