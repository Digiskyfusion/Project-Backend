import express from "express";
const router = express.Router();
import {protect}  from "../middleware/authMiddleware.js"
import {getAllJobs,postJob,deleteJob,updateJob,getJobById,searchJobs} from "../controller/jobControl.js";

router.route("/").get(protect,getAllJobs);
router.route("/").post(protect,postJob);
router.route("/:id").delete(protect,deleteJob);
router.route("/:userId").put(protect,updateJob);
router.get("/:id",protect,getJobById); // 👈 Add this
router.get("/searchjobs/:keyword",searchJobs);
// router.route("/api/user/me").put(protect,findById);

export default router;
