const express=require("express")
const router= express.Router();
const auth= require('../Controllers/AuthControllers')




router.route("/").get(auth.Home)
router.route("/signup").post(auth.signup)
router.route("/login").post(auth.login)
router.route("/forget-password").post(auth.forgetPassword)
router.route("/reset-password").post(auth.resetPassword)


module.exports= router