import express from "express";
import { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getUsersBySkills ,
  updateUserCredits
} from "../controller/user.js"; // Ensure this path is correct

const router = express.Router();

// User Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", getAllUsers);
router.get("/skills", getUsersBySkills);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/credits/:id", updateUserCredits);


export default router;
