const express=require("express")
const router= express.Router();
const auth= require('../Controllers/AuthControllers');
const { protect } = require("../Middleware/AuthMiddleware");
const { loginLimiter } = require("../Middleware/RateLimitMiddleware");
const { body, validationResult } = require('express-validator');
const passport = require("passport");
const jwt = require("jsonwebtoken");
const UserAuth= require("../Controllers/UserController")
const ChatAuth= require("../Controllers/ChatController")
const PlanAuth= require("../Controllers/PlanController")
const categoryAuth= require("../Controllers/CategoryController")
const freelancerAuth= require("../Controllers/FreelancerController")
const ClientAuth= require("../Controllers/ClientController")

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
router.route("/reset-password").post(auth.resetPassword);

//user
router.route('/profile/:id').get(protect,UserAuth.getUserProfile); 
router.route('/profile/:id').put(protect, UserAuth.updateUserProfile);
router.route("/delete/:id").delete(protect, UserAuth.deleteUser);

// chat. js
router.route("/send").post(protect,ChatAuth.sendMessage);
router.route("/history/:userId").get(protect,ChatAuth.chatHistoryAPI);

// planroute
router.route("/create").post(protect,PlanAuth.createSubscription);
router.route("/all").get(protect,PlanAuth.AllSubscription);


// category and subcategory
router.route("/createCategory").post(protect, categoryAuth.createCategory);
router.route("/getallCategory").get(protect, categoryAuth.getCategories);
router.route("/singlecategory/:id").get(protect, categoryAuth.getCategoryById);
router.route("/updateCategory/:id").put(protect, categoryAuth.updateCategory);
router.route("/deleteCategory/:id").delete(protect, categoryAuth.deleteCategory);


// subcategory
router.route("/subCategory").post(protect, categoryAuth.createSubCategory);
router.route("/getallsubCategory").get(protect, categoryAuth.getSubCategories);
router.route("/singlesubCategory/:id").get(protect, categoryAuth.getSubCategoryById);
router.route("/updatesubCategory/:id").put(protect, categoryAuth.updateSubCategory);
router.route("/deletesubCategory/:id").delete(protect, categoryAuth.deleteSubCategory);

// freelancer profile
router.route("/createfreelancer").post(protect, freelancerAuth.createFreelancer);
router.route("/getallfreelancers").get(protect, freelancerAuth.getallfreelancer);
router.route("/freelancers/:id").get(protect, freelancerAuth.getSingleFreelancer);
router.route("/updatefreelancers/:id").put(protect, freelancerAuth.updatefreelancer);
router.route("/deletefreelancers/:id").delete(protect, freelancerAuth.deleteFreelancer);


// client route
router.route("/createclient").post(protect,ClientAuth.createClient);
router.route("/getallclient").get(protect, ClientAuth.getAllClient);
router.route("/getsingleclient/:id").get(protect, ClientAuth.getSingleClinet);
router.route("/updateclient/:id").put(protect, ClientAuth.updateClinet);
router.route("/deleteclient/:id").delete(protect, ClientAuth.deleteClient);



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