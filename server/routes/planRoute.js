import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  createPlanActivity,
  createPlanLodging,
  createPlanFlights,
  createPlanCar,
  createPlanConcert,
  createPlanTheater,
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
  deletePlan,
} from "../controllers/planController.js";

const router = express.Router();

//CREATE
router.post("/create/activity/:id", userAuth, createPlanActivity); //activity
router.post("/create/flights/:id", userAuth, createPlanFlights); //flights
router.post("/create/lodging/:id", userAuth, createPlanLodging); //lodging
router.post("/create/car/:id", userAuth, createPlanCar); //car
router.post("/create/parking/:id", userAuth, createPlanParking); //parking
router.post("/create/theater/:id", userAuth, createPlanTheater); //theater
router.post("/create/rail/:id", userAuth, createPlanRail); //rail
router.post("/create/concert/:id", userAuth, createPlanConcert); //concert
router.post("/create/restaurant/:id", userAuth, createPlanRestaurant); //restaurant

//UPDATE
router.patch("/update/activity/:id", userAuth, updatePlanActivity); //activity
router.patch("/update/flights/:id", userAuth, updatePlanFlights); //flights
router.patch("/update/lodging/:id", userAuth, updatePlanLodging); //lodging
router.patch("/update/car/:id", userAuth, updatePlanCar); //car
router.patch("/update/parking/:id", userAuth, updatePlanParking); //parking
router.patch("/update/theater/:id", userAuth, updatePlanTheater); //theater
router.patch("/update/rail/:id", userAuth, updatePlanRail); //rail
router.patch("/update/concert/:id", userAuth, updatePlanConcert); //concert
router.patch("/update/restaurant/:id", userAuth, updatePlanRestaurant); //restaurant

//GET
router.get("/:planId", getPlanById);

//DELETE
router.delete("/:id", userAuth, deletePlan);

export default router;
