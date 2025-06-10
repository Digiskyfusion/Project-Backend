import express from "express";
import { sendFireBaseNotification } from "../controller/firebaseController.js"; // Added .js extension

const router = express.Router();

router.post("/send-notification", async (req, res) => {
  const result = await sendFireBaseNotification(req, res);
  return res.send(result);
});

export default router; // Changed to ES module export