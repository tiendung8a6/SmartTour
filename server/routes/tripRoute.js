import express from "express";
import {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  getAdminTrips,
  deleteTrip,
  updateTripStatus,
  getPublicTrips,
  activateTrip,
} from "../controllers/tripController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//ROUTES
router.post("/create", userAuth, createTrip); //**+10 ĐIỂM THƯỞNG**
router.get("/", userAuth, getTrips); //Lấy danh sách Trips theo token user
router.get("/public", getPublicTrips); //Lấy danh sách Trips Công Khai
router.post("/admin-trip", userAuth, getAdminTrips); //ADMIN - Lấy Toàn bộ
router.delete("/:id", userAuth, deleteTrip);
router.patch("/update-status/:id", userAuth, updateTripStatus);
router.get("/:tripId", getTrip);
router.patch("/update/:id", userAuth, updateTrip); //**CHECK +10 ĐIỂM THƯỞNG**
router.post("/activate/:id", userAuth, activateTrip); //**-10 ĐIỂM THƯỞNG <> +5 ĐIỂM THƯỞNG**

export default router;
