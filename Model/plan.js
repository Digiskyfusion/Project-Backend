const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },  // Price in USD or any currency
  duration: { type: Number, required: true },  // Duration in months
  features: [{ type: String }],  // List of features for this plan
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('plan', PlanSchema);
