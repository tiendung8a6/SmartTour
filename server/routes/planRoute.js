import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  createPlanActivity,
  createPlanLodging,
  createPlanFlights,
  createPlanCar,
  createPlanConcert,
  createPlanTheater,
  createPlanCamp,
  createPlanParking,
} from "../controllers/planController.js";

const router = express.Router();

//ROUTES
router.post("/create/activity/:id", userAuth, createPlanActivity); //activity
router.post("/create/lodging/:id", userAuth, createPlanLodging); //lodging
router.post("/create/flights/:id", userAuth, createPlanFlights); //flights
router.post("/create/car/:id", userAuth, createPlanCar); //car
router.post("/create/concert/:id", userAuth, createPlanConcert); //concert
router.post("/create/theater/:id", userAuth, createPlanTheater); //theater
router.post("/create/camp/:id", userAuth, createPlanCamp); //camp
router.post("/create/parking/:id", userAuth, createPlanParking); //parking

export default router;
