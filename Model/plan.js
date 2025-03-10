const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  credit: { type: Number, required: true },  // Price in USD or any currency
  amount: { type: Number, required: true },  // Duration in months
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('plan', PlanSchema);