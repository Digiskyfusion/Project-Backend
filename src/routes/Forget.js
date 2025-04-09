import express from "express";
import {forgetPassword, resetPassword} from "../controller/forgetPassword.js";

const router = express.Router();


router.route("/forget-password").post(forgetPassword);
router.route("/reset-password").post(resetPassword);



export default router;