import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  email: String,
  mobileNumber: String,
  creditsAdded: Number,
  totalCredits: Number,
  planName: String,
  paymentId: String,
  orderId: String,
  paymentDate: Date,
}, { timestamps: true });

export default mongoose.model("Receipt", receiptSchema);
