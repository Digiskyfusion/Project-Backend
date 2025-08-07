import express from "express";
const router = express.Router();
import {getAllJobs,postJob,deleteJob,updateJob,getJobById,searchJobs} from "../controller/jobControl.js";

router.route("/").get(getAllJobs);
router.route("/").post(postJob);
router.route("/:id").delete(deleteJob);
router.route("/:userId").put(updateJob);
router.get("/:id",getJobById); // 👈 Add this
router.get("/searchjobs/:keyword",searchJobs);
// router.route("/api/user/me").put(protect,findById);

export default router;
