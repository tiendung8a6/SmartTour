import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  createPlanActivity,
  createPlanAlodging,
} from "../controllers/planController.js";

const router = express.Router();

//ROUTES
router.post("/create/activity/:id", userAuth, createPlanActivity); //activity
router.post("/create/lodging/:id", userAuth, createPlanAlodging); //lodging

export default router;
