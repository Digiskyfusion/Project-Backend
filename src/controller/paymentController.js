import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import User from "../model/user.js";
import Receipt from "../model/receipt.js"; // Importing Receipt model

// Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: error.message });
  }
};

// Verify Payment and Save Receipt
export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    plan,
    planName,
  } = req.body;

  try {
    // Step 1: Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Step 2: Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Step 3: Credits to add
    const creditsToAdd = parseInt(plan);
    if (isNaN(creditsToAdd)) {
      return res.status(400).json({ error: "Invalid plan value" });
    }

    // Step 4: Update user credits
    user.credits = (user.credits || 0) + creditsToAdd;
    await user.save();

    // Step 5: Create and save receipt
    const savedReceipt = new Receipt({
      userId: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      creditsAdded: creditsToAdd,
      totalCredits: user.credits,
      planName: planName || "Custom Plan",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentDate: new Date(),
    });

    await savedReceipt.save();

    // Step 6: Respond
    res.status(200).json({
      message: `Payment verified successfully.`,
      receipt: savedReceipt,
    });
  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ error: "Failed to verify payment and update credits." });
  }
};

// Optional: Get all receipts for a user
export const getUserReceipts = async (req, res) => {
  try {
    const { userId } = req.params;
    const receipts = await Receipt.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(receipts);
  } catch (err) {
    console.error("Error fetching receipts:", err);
    res.status(500).json({ error: "Failed to fetch receipts." });
  }
};

// paymentcontroller.js
// export const createSubscription = async (req, res) => {
//   try {
//     const { planId } = req.body; // Razorpay Plan ID from dashboard

//     const subscription = await razorpay.subscriptions.create({
//       plan_id: planId,
//       customer_notify: 1,
//       total_count: 12, // Optional: 12 months
//     });

//     res.status(200).json(subscription);
//   } catch (err) {
//     console.error("Subscription creation failed", err);
//     res.status(500).json({ error: "Failed to create subscription" });
//   }
// };

// export const verifySubscription = async (req, res) => {
//   const {
//     razorpay_subscription_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     userId,
//     plan,
//   } = req.body;

//   try {
//     // Step 1: Verify signature (if needed)
//     // You can optionally verify the signature (similar to order flow)

//     // Step 2: Get user
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // Step 3: Save plan to user
//     user.plan = plan;
//     await user.save();

//     // Step 4: (Optional) Save to Receipt DB
//     const receipt = new Receipt({
//       userId: user._id,
//       name: user.name,
//       email: user.email,
//       mobileNumber: user.mobileNumber,
//       planName: plan,
//       paymentId: razorpay_payment_id,
//       subscriptionId: razorpay_subscription_id,
//       paymentDate: new Date(),
//     });

//     await receipt.save();

//     res.status(200).json({ message: "Subscription successful", receipt });
//   } catch (err) {
//     console.error("Subscription verify error:", err);
//     res.status(500).json({ error: "Failed to verify subscription and update user" });
//   }
// };


// =========================
// CREATE SUBSCRIPTION
// =========================
export const createSubscription = async (req, res) => {
  console.log("[DEBUG-CS-001] createSubscription called with body:", req.body);

  try {
    const { planId } = req.body; // Razorpay Plan ID from dashboard
    console.log("[DEBUG-CS-002] Extracted planId:", planId);

    if (!planId) {
      console.error("[DEBUG-CS-003] Missing planId in request body");
      return res.status(400).json({ error: "Plan ID is required" });
    }

    console.log("[DEBUG-CS-004] Creating Razorpay subscription with planId:", planId);

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // Optional: 12 months
    });

    console.log("[DEBUG-CS-005] Razorpay subscription created successfully:", subscription);
    return res.status(200).json(subscription);

  } catch (err) {
    console.error("[DEBUG-CS-006] Subscription creation failed:", err.message, err.stack);
    return res.status(500).json({ error: "Failed to create subscription", details: err.message });
  }
};

// =========================
// VERIFY SUBSCRIPTION
// =========================
export const verifySubscription = async (req, res) => {
  console.log("[DEBUG-VS-001] verifySubscription called with body:", req.body);

  const {
    razorpay_subscription_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    plan,
  } = req.body;

  try {
    // Validate request body
    if (!razorpay_subscription_id || !razorpay_payment_id || !razorpay_signature || !userId || !plan) {
      console.error("[DEBUG-VS-002] Missing required fields in request body", req.body);
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("[DEBUG-VS-003] Validating user with userId:", userId);

    // Step 1: Verify signature (Optional, recommended)
    // For now, just logging data to confirm we have correct Razorpay response
    console.log("[DEBUG-VS-004] Razorpay signature verification payload:", {
      razorpay_subscription_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    // Step 2: Find user
    const user = await User.findById(userId);
    if (!user) {
      console.error("[DEBUG-VS-005] User not found with ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("[DEBUG-VS-006] User found:", {
      id: user._id,
      name: user.name,
      email: user.email,
    });

    // Step 3: Update user plan
    user.plan = plan;
    await user.save();
    console.log("[DEBUG-VS-007] User plan updated successfully to:", plan);

    // Step 4: Save to Receipt DB
    console.log("[DEBUG-VS-008] Creating receipt entry for user:", userId);

    const receipt = new Receipt({
      userId: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      planName: plan,
      paymentId: razorpay_payment_id,
      subscriptionId: razorpay_subscription_id,
      paymentDate: new Date(),
    });

    await receipt.save();
    console.log("[DEBUG-VS-009] Receipt saved successfully:", receipt);

    return res.status(200).json({ message: "Subscription successful", receipt });

  } catch (err) {
    console.error("[DEBUG-VS-010] Subscription verification failed:", err.message, err.stack);
    return res.status(500).json({
      error: "Failed to verify subscription and update user",
      details: err.message,
    });
  }
};

