import express from "express";
import { createReview, getAllreview } from "../controller/review.js";

const router = express.Router();

// Reviews
// Create review
router.route("/createreview").post(createReview);
router.route("/allreview").get(getAllreview);

export default router;
