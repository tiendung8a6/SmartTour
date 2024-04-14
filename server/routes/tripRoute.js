import express from "express";
import { createTrip } from "../controllers/tripController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//ROUTES
router.post("/create", userAuth, createTrip);

export default router;
