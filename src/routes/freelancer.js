import express from "express";
import {getAllFreelancer, getSingleFreelancer} from "../controller/freelancer.js";

const router = express.Router();

// get all freelancers
router.get('/all',getAllFreelancer);

// get freelancer by id
router.get('/:id',getSingleFreelancer);

export default router;