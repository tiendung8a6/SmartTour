import express from "express";
import { createPayment } from "../controllers/paymentController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//ROUTES
router.post("/", createPayment);

export default router;
