import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import { createPlan } from "../controllers/planController.js";

const router = express.Router();

//ROUTES
router.post("/create/:id", userAuth, createPlan);

export default router;
