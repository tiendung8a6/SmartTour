import express from "express";
import {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
} from "../controllers/tripController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//ROUTES
router.post("/create", userAuth, createTrip);
router.get("/", userAuth, getTrips);
router.get("/:tripId", getTrip);
router.patch("/update/:id", userAuth, updateTrip);

export default router;
