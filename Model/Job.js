const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    skills: { type: String, required: true },
    scope: { type: String, required: true },
    budget: { type: Number, required: true },
    currency: { type: String, required: true },
    description: { type: String },
    file: { type: String},
    location: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
