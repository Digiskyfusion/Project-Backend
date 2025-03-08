const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: String,
    skills: String,
    scope: String,
    budget: Number,
    currency: String,
    description: String,
    file: String,
    location:String,
    postedBy: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

module.exports= mongoose.model("Job", jobSchema);
