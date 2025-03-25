import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    merchantTransactionId: { type: String },
    status: { type: String , default:'failed' },
    txDetails: { type: Object },
    Date: { type: Date, default: Date.now } // Set current date as default
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
