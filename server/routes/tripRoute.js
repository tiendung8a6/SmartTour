import express from "express";
import {
  createTrip,
  getTrips,
  getTrip,
} from "../controllers/tripController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//ROUTES
router.post("/create", userAuth, createTrip);
router.get("/", userAuth, getTrips);
router.get("/:tripId", getTrip);

export default router;
