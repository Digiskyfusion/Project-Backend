import express from "express";
import { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getUsersBySkills,
  updateUserCredits,
  getUsersWithWork
} from "../controller/user.js"; // ✅ Ensure this path is correct

import User from "../model/user.js"// ✅ Needed for portfolio route

const router = express.Router();

// User Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users-with-work", getUsersWithWork);
router.get("/all", getAllUsers);
router.get("/skills", getUsersBySkills);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/credits/:id", updateUserCredits);


// ✅ Subdomain portfolio API route
router.get("/portfolio/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
