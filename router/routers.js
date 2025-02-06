const express=require("express")
const router= express.Router();
const auth= require('../Controllers/AuthControllers');
const { protect } = require("../Middleware/AuthMiddleware");
const { loginLimiter } = require("../Middleware/RateLimitMiddleware");
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
router.route("/delete/:id").delete(protect, auth.deleteUser);

module.exports= router;