const express=require("express")
const router= express.Router();
const auth= require('../Controllers/AuthControllers');
const { protect } = require("../Middleware/AuthMiddleware");
const { loginLimiter } = require("../Middleware/RateLimitMiddleware");
const chatCongo= require("../Controllers/ChatControllers")
const planCOngo= require("../Controllers/planControllers")
const { body, validationResult } = require('express-validator');



// router.route("/signup",).post(auth.signup)sss
router.route("/signup")
  .post(
    [
      body('email').isEmail().withMessage('Invalid email'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    (req, res, next) => {
      // Validation result
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();  // If validation passes, continue to signup controller
    },
    auth.signup
  );
router.route("/login").post(loginLimiter,auth.login)
router.route("/forget-password").post(auth.forgetPassword)
router.route("/reset-password").post(protect,auth.resetPassword)
router.route('/profile/:id').get(auth.getUserProfile); 
// router.route('/profile/:id').put(protect, auth.updateUserProfile);
// router.route("/delete/:id").delete(protect, auth.deleteUser);

// chat. js
// router.route("/send").post(protect,validateChatMessage, chatCongo.sendMessage);

// planroute
// router.route("/create").post(protect,planCOngo.createPlan);



router.put(
  '/profile/:id',
  protect, // Protect this route with authentication
  [
    // Validation rules
    body('name', 'Name is required').notEmpty(),
    body('country', 'Country is required').notEmpty(),
    body('roleType', 'Role type is required').notEmpty(), // Add more validation as needed
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.params.id;
      const { name, country, roleType } = req.body;

      // Security check: Ensure the user is updating their own profile
      if (req.user.id !== userId) {  // Assuming req.user.id is set by authMiddleware
        return res.status(403).json({ message: 'Unauthorized: You can only update your own profile.' });
      }

      // Find the user by ID
      let user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update the user's profile
      user.name = name;
      user.country = country;
      user.roleType = roleType;

      await user.save();

      res.json({ message: 'Profile updated successfully', user }); // Send a success response with the updated user data.
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

module.exports= router;