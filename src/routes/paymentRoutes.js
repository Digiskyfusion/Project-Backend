import express from "express";
import { createOrder, verifyPayment ,getUserReceipts} from "../controller/paymentController.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/receipts/:userId", getUserReceipts); // Optional endpoint

export default router;
