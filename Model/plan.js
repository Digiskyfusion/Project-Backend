const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  credits: {
    type: Number,
    required: false, // Optional, set to true if required
  },
});

module.exports = mongoose.model("Plan", planSchema);
