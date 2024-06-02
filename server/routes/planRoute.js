import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  createPlanActivity,
  createPlanLodging,
  createPlanFlights,
  createPlanCar,
  createPlanConcert,
  createPlanTheater,
  // createPlanCamp,
  createPlanParking,
  createPlanRestaurant,
  createPlanRail,
  getPlanById,
  updatePlanActivity,
  updatePlanFlights,
  updatePlanConcert,
  updatePlanTheater,
  updatePlanCar,
  updatePlanParking,
  updatePlanRail,
  updatePlanLodging,
  updatePlanRestaurant,
} from "../controllers/planController.js";

const router = express.Router();

//ROUTES
//CREATE
router.post("/create/activity/:id", userAuth, createPlanActivity); //activity
router.post("/create/lodging/:id", userAuth, createPlanLodging); //lodging
router.post("/create/flights/:id", userAuth, createPlanFlights); //flights
router.post("/create/car/:id", userAuth, createPlanCar); //car
router.post("/create/concert/:id", userAuth, createPlanConcert); //concert
router.post("/create/theater/:id", userAuth, createPlanTheater); //theater
// router.post("/create/camp/:id", userAuth, createPlanCamp); //camp
router.post("/create/parking/:id", userAuth, createPlanParking); //parking
router.post("/create/restaurant/:id", userAuth, createPlanRestaurant); //restaurant
router.post("/create/rail/:id", userAuth, createPlanRail); //rail

//UPDATE
router.patch("/update/activity/:id", userAuth, updatePlanActivity); //activity
router.patch("/update/flights/:id", userAuth, updatePlanFlights); //flights
router.patch("/update/concert/:id", userAuth, updatePlanConcert); //concert
router.patch("/update/theater/:id", userAuth, updatePlanTheater); //theater
router.patch("/update/car/:id", userAuth, updatePlanCar); //car
router.patch("/update/parking/:id", userAuth, updatePlanParking); //parking
router.patch("/update/rail/:id", userAuth, updatePlanRail); //rail
router.patch("/update/lodging/:id", userAuth, updatePlanLodging); //lodging
router.patch("/update/restaurant/:id", userAuth, updatePlanRestaurant); //restaurant

//GET
router.get("/:planId", getPlanById);
export default router;
