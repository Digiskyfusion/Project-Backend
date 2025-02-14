// const mongoose= require("mongoose")

// const freelancerSchema = new mongoose.Schema({
//     id:{
//         type: mongoose.Types.ObjectId,
//         ref: "user",
//         require: true
//     }
// })

// module.exports= mongoose.model("freelancer", freelancerSchema);




const mongoose = require("mongoose");

const FreelancerSchema = new mongoose.Schema({
  freelancer_id: { type: String, unique: true, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true },
  subcategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "subCategory" }],
  profile_image: { type: String },
  date_of_birth: { type: Date },

  verification_details: {
    govt_id_type: { type: String, required: true },
    govt_id_number: { type: String, unique: true, required: true },
    govt_id_image: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    verified_status: { type: Boolean, default: false },
    verification_date: { type: Date },
  },
  professional_details: {
    experience_years: { type: Number },
    portfolio_link: { type: String },
    resume: { type: String },
    certifications: [{ type: String }],
    languages: [{ type: String }],
  },

  timestamps: {
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
});

module.exports = mongoose.model("Freelancer", FreelancerSchema);
