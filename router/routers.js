const express=require("express")
const router= express.Router();
const auth= require('../Controllers/AuthControllers');
const { protect } = require("../Middleware/AuthMiddleware");
const { loginLimiter } = require("../Middleware/RateLimitMiddleware");
const { body, validationResult } = require('express-validator');



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
router.route("/login").post(loginLimiter,auth.login);
router.route("/forget-password").post(auth.forgetPassword);
router.route("/reset-password").post(protect,auth.resetPassword);
router.route('/profile/:id').get(auth.getUserProfile); 
router.route('/profile/:id').put(protect, auth.updateUserProfile);
router.route("/delete/:id").delete(protect, auth.deleteUser);

// chat. js
router.route("/send").post(protect,auth.sendMessage);
router.route("/history/:userId").get(protect,auth.chatHistoryAPI);

// planroute
router.route("/create").post(protect,auth.createSubscription);
router.route("/all").get(protect,auth.AllSubscription);


// category and subcategory
router.route("/createCategory").post(protect, auth.createCategory);
router.route("/getallCategory").get(protect, auth.getCategories);
router.route("/singlecategory/:id").get(protect, auth.getCategoryById);
router.route("/updateCategory/:id").put(protect, auth.updateCategory);
router.route("/deleteCategory/:id").delete(protect, auth.deleteCategory);


// subcategory
router.route("/subCategory").post(protect, auth.createSubCategory);
router.route("/getallsubCategory").get(protect, auth.getSubCategories);
router.route("/singlesubCategory/:id").get(protect, auth.getSubCategoryById);
router.route("/updatesubCategory/:id").put(protect, auth.updateSubCategory);
router.route("/deletesubCategory/:id").delete(protect, auth.deleteSubCategory);

// freelancer profile
router.route("/createfreelancer").post(protect, auth.createFreelancer);
router.route("/getallfreelancers").get(protect, auth.getallfreelancer);
router.route("/freelancers/:id").get(protect, auth.getSingleFreelancer);
router.route("/updatefreelancers/:id").put(protect, auth.updatefreelancer);
router.route("/deletefreelancers/:id").delete(protect, auth.deleteFreelancer);


// client route
router.route("/createclient").post(protect, auth.createClient);
router.route("/getallclient").get(protect, auth.getAllClient);
router.route("/getsingleclient/:id").get(protect, auth.getSingleClinet);
router.route("/updateclient/:id").put(protect, auth.updateClinet);
router.route("/deleteclient/:id").delete(protect, auth.deleteClient);


module.exports= router;