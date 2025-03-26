import crypto from "crypto";
import UserModel from "../../models/user.js";
import PackageModel from "../../models/package.js";
import axios from "axios";
import payment from "../../models/payment.js";

class paymentController {
  static getPaymentsWithStatus = async (req, res) => {
    if (!req.params.status) return res.send([]);
    const payments = await payment
      .find({ status: req.params.status })
      .populate("userId");
    return res.send(payments);
  };

  
 
  static getPaymentDataByUserId = async (req, res) => {
    try {
      const { userId } = req.params;

      // Find payments by userId and populate both userId and packageId
      const paymentDetails = await payment
        .find({ userId: userId })
        .populate("userId") // Populates the user details
        .populate("package"); // Populates the package details (assuming you have a packageId field)

      console.log("paymentDetails:", paymentDetails);

      if (paymentDetails.length === 0) {
        return res.status(404).json({ error: "No Data Found" });
      }

      res.status(200).json(paymentDetails); // Send the payment details including user and package data
    } catch (error) {
      console.log("Error:", error);
      res.status(400).json({ error: error.message });
    }
  };

  static createOrder = async (req, res) => {
    try {
        const { packageId } = req.params;
        const userId = req.userId;
        const { amount, currency } = req.body;

        // Fetch package details including discount and credits
        const packageInfo = await PackageModel.findById(packageId, "discount credits");
        if (!packageInfo) {
            return res.status(404).json({ message: "Package not found!" });
        }

        // Calculate discounted amount
        let amountToBePaid = amount;
        if (packageInfo.discount) {
            amountToBePaid = amount - (amount * (packageInfo.discount / 100));
        }

        // Generate transaction ID
        const transactionId = crypto.randomBytes(10).toString("hex");

        // Prepare data for PhonePe API
        const data = {
            merchantId: process.env.PHONEPE_MERCHANT_ID,
            merchantTransactionId: transactionId,
            amount: Math.round(amountToBePaid * 100), // Convert to paisa
            merchantUserId: userId,
            redirectUrl: `${process.env.FRONTEND_URL}/plan`,
            redirectMode: "REDIRECT",
            callbackUrl: `${process.env.BACKEND_URL}/user/payment/verify/${transactionId}`,
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        };

        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString("base64");
        const keyIndex = 1;
        const stringToHash = `${payloadMain}/pg/v1/pay${process.env.PHONEPE_KEY_SECRET}`;
        const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
        const checksum = `${sha256}###${keyIndex}`;

        // Make API request to PhonePe
        const response = await axios.post(
            "https://api.phonepe.com/apis/hermes/pg/v1/pay",
            { request: payloadMain },
            {
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    "X-VERIFY": checksum,
                },
                referrerPolicy: "strict-origin-when-cross-origin",
            }
        );

        if (response.status === 200) {
            // Do NOT add credits here. Credits will be added in verifyPayment after success.
            return res.json({
                status: "success",
                ...response.data,
                transactionId,
            });
        } else {
            return res.status(500).json({ message: "Payment Failed!" });
        }

    } catch (error) {
        console.error("Payment Error:", error);
        return res.status(500).json({ message: "Internal Server Error!" });
    }
};

  static verifyPayment = async (req, res) => {
    try {
      const encodedPayload = req.body.response; // Assuming PhonePe sends the payload in req.body
      const decodedPayload = Buffer.from(encodedPayload, "base64").toString(
        "utf-8"
      );
      const decodedData = JSON.parse(decodedPayload);

      if (decodedData.data.state !== "COMPLETED")
        return res.status(400).json({ message: "Payment not completed." });

      const paymentRecord = await payment.findOne({
        merchantTransactionId: decodedData.data.merchantTransactionId,
      });
      const packageId = paymentRecord.package;

      if (decodedData.code === "PAYMENT_SUCCESS") {
        const subscription = await PackageModel.findById(packageId);
        const packageCredits = subscription.credits;

        await UserModel.findByIdAndUpdate(
          { _id: paymentRecord.userId },
          {
            $push: {
              packages: {
                packageId,
                date: new Date(),
                paymentDetails: {
                  paymentId: decodedData.data.merchantTransactionId,
                  orderId: decodedData.data.transactionId,
                  signature: decodedData,
                },
              },
            },
            $inc: { credits: packageCredits },
          },
          { new: true }
        );

        return res
          .status(200)
          .json({ message: "Payment verified successfully." });
      } else {
        return res.status(400).json({ message: "Payment failed." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  };
}

export default paymentController;
