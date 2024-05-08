import express from "express";
import {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  getAdminTrips,
  deleteTrip,
  updateTripStatus,
} from "../controllers/tripController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//ROUTES
router.post("/create", userAuth, createTrip);
router.get("/", userAuth, getTrips); //Lấy danh sách Trips theo token user
router.post("/admin-trip", userAuth, getAdminTrips); //ADMIN - Lấy Toàn bộ
router.delete("/:id", userAuth, deleteTrip);
router.patch("/update-status/:id", userAuth, updateTripStatus);
router.get("/:tripId", getTrip);
router.patch("/update/:id", userAuth, updateTrip);

export default router;
