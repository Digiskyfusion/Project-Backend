import express from "express";
import UserProfile from "../../controllers/user/User_Profile.js";

const router = express.Router();

router.get("/", UserProfile.getAllProfiles);
router.get("/:id", UserProfile.getProfileById);
router.post("/", UserProfile.addProfile);
router.delete("/:id", UserProfile.deleteProfile);
router.get("/subcategory/:subcategory", UserProfile.getUserBySubCategory);
router.get("/users/:userId", UserProfile.getByUserId);

export default router;