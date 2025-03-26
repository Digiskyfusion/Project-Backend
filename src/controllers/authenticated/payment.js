import crypto from "crypto";
import Razorpay from "razorpay";
import UserModel from "../../models/user.js";
import PackageModel from "../../models/package.js";
import payment from "../../models/payment.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);

class paymentController {
  static createOrder = async (req, res) => {
    try {
      const { packageId } = req.params;
      const userId = req.userId;
      const { amount, currency } = req.body;

      const packageInfo = await PackageModel.findById(packageId, "discount credits");
      if (!packageInfo) {
        return res.status(404).json({ message: "Package not found!" });
      }

      let amountToBePaid = amount;
      if (packageInfo.discount) {
        amountToBePaid = amount - (amount * (packageInfo.discount / 100));
      }

      const options = {
        amount: Math.round(amountToBePaid * 100),
        currency,
        receipt: crypto.randomBytes(10).toString("hex"),
        payment_capture: 1,
      };

      const order = await razorpay.orders.create(options);
      console.log("order");
      console.log(order);
      return res.json({ status: "success", order });
    } catch (error) {
      console.error("Payment Error:", error);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  };

  static verifyPayment = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const sign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (sign !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid Payment Signature" });
      }

      const paymentRecord = await payment.findOne({ orderId: razorpay_order_id });
      const packageId = paymentRecord.package;
      const subscription = await PackageModel.findById(packageId);

      await UserModel.findByIdAndUpdate(paymentRecord.userId, {
        $push: {
          packages: {
            packageId,
            date: new Date(),
            paymentDetails: {
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id,
              signature: razorpay_signature,
            },
          },
        },
        $inc: { credits: subscription.credits },
      });

      return res.status(200).json({ message: "Payment verified successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  };
}

export default paymentController;
