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
const Jobauth = require("../Controllers/JobController");
const upload = require("../Middleware/Upload");
const clientProfileauth= require("../Controllers/ClientProfileController")
const freelancerProfileauth= require("../Controllers/FreelancerProfileControllers")
const reviewAuth= require("../Controllers/ReviewController")
const contactusAuth= require("../Controllers/ContactUs")
//freelancerProfile
router.post("/createfreelancerprofile",protect, upload.single("profileImage"),freelancerProfileauth.createFreelancer);
router.get("/getallfreelancerprofile", freelancerProfileauth.getFreelancers);
router.get("/getfreelancerprofile/:userId", freelancerProfileauth.getFreelancerByUserId);
router.get("/getfreelancerprofile/:id", freelancerProfileauth.getfreelancerById);
router.put("/updatefreelancerprofile/:userId", freelancerProfileauth.updateFreelancerProfile);



//clientProfile
router.post("/createProfile",protect, upload.single("profileImage"), clientProfileauth.createClients);
// router.post("/createProfile",clientProfileauth.createClients);
router.get("/getclientprofile",clientProfileauth.getClients);
router.get("/getclientprofile/:id",clientProfileauth.getClientById);

//review create
router.route("/allreview").get(reviewAuth.getAllreview)
router.route("/createreview").post(reviewAuth.createReview)


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
router.route("/createfreelancer").post(upload.fields([
  { name: "profile_image", maxCount: 1 },
  { name: " govt_id_image", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]), freelancerAuth.createFreelancer);
router.route("/getallfreelancers").get(protect, freelancerAuth.getallfreelancer);
router.route("/freelancers/:id").get(protect, freelancerAuth.getSingleFreelancer);
router.route("/updatefreelancers/:id").put(protect, freelancerAuth.updatefreelancer);
router.route("/deletefreelancers/:id").delete(protect, freelancerAuth.deleteFreelancer);


// client route
router.route("/createclient").post(upload.fields([{ name: "image" }, { name: "govt_id_proof" }]),ClientAuth.createClient);
// router.route("/createclient").post(ClientAuth.createClient);
router.route("/getallclient").get(protect, ClientAuth.getAllClient);
router.route("/getsingleclient/:id").get(protect, ClientAuth.getSingleClinet);
router.route("/updateclient/:id").put(protect, ClientAuth.updateClinet);
router.route("/deleteclient/:id").delete(protect, ClientAuth.deleteClient);

//upload job
router.route("/").get(protect, Jobauth.getAllJobs);
router.route('/').post(protect,Jobauth.postJob);
router.route('/:id').delete(protect,Jobauth.deleteJob);
router.route('/:id').put(protect,Jobauth.updateJob);
router.route('/api/user/me').put(protect,Jobauth.findById);


// contact us 
router.route("/conatctus").post(contactusAuth.contact)

module.exports= router;