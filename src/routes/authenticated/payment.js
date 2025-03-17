import express from "express";
import paymentController from "../../controllers/authenticated/payment.js";
import verifyToken from "../../middlewares/authentication.js";
const router = express.Router();

router.get("/payment/:userId", paymentController.getPaymentDataByUserId);
router.post("/order/:packageId", verifyToken, paymentController.createOrder);
router.post("/verify/:id", paymentController.verifyPayment);
router.get("/:status", paymentController.getPaymentsWithStatus);

export default router;