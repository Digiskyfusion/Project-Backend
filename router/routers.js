const express=require("express")
const router= express.Router();
const auth= require('../Controllers/AuthControllers');
const { protect } = require("../Middleware/AuthMiddleware");
const { loginLimiter } = require("../Middleware/RateLimitMiddleware");
const { body, validationResult } = require('express-validator');
const passport = require("passport");
const jwt = require("jsonwebtoken");



// router.route("/sendEmail").post(sendMailByUser)


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







//google authentication

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://192.168.29.123:5173/registration" }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("http://192.168.29.123:5173/login");
    }
    const token = jwt.sign({ id: req.user._id },process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
console.log(token);

    res.cookie("token", token, { httpOnly: true, secure: false });
    res.redirect(`http://192.168.29.123:5173/dashboard}`);
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.sendStatus(500);
    }

    req.session = null; // Destroy the session (if using session-based auth)
    res.clearCookie("token"); // Remove JWT token cookie
    res.clearCookie("connect.sid"); // If using express-session

    return res.redirect("http://localhost:5173/login"); // Redirect to login page
  });
});


router.get("/user", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    res.json({ user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
});


module.exports= router;