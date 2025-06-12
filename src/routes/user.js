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
  getUsersWithWork,
  removeItme
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
router.put("/api/users/:id/work", removeItme);


// ✅ Subdomain portfolio API route
router.get("/portfolio/:name", async (req, res) => {
  let { name } = req.params;
  name = name.replace(/_/g, " "); // Replace underscores with spaces

  try {
    const user = await User.findOne({
      name: { $regex: `^${name}$`, $options: "i" } // Case-insensitive exact match
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



export default router;
