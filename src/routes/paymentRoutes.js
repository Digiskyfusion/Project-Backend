import express from "express";
import { createOrder, verifyPayment ,getUserReceipts, createSubscription,  verifySubscription} from "../controller/paymentController.js";

const router = express.Router();
// 
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post('/payment/verify-subscription', verifySubscription);
router.get("/receipts/:userId", getUserReceipts);
router.post('/create-subscription', createSubscription); // Optional endpoint

export default router;
