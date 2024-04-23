import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  createPlanActivity,
  createPlanLodging,
  createPlanFlights,
} from "../controllers/planController.js";

const router = express.Router();

//ROUTES
router.post("/create/activity/:id", userAuth, createPlanActivity); //activity
router.post("/create/lodging/:id", userAuth, createPlanLodging); //lodging
router.post("/create/flights/:id", userAuth, createPlanFlights); //flights

export default router;
