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
router.post("/create", userAuth, createTrip);
router.get("/", userAuth, getTrips); //Lấy danh sách Trips theo token user
router.get("/public", getPublicTrips); //Lấy danh sách Trips Công Khai
router.post("/admin-trip", userAuth, getAdminTrips); //ADMIN - Lấy Toàn bộ
router.delete("/:id", userAuth, deleteTrip);
router.patch("/update-status/:id", userAuth, updateTripStatus);
router.get("/:tripId", getTrip);
router.patch("/update/:id", userAuth, updateTrip);

router.post("/activate/:id", userAuth, activateTrip);

export default router;
