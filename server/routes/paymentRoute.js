import express from "express";
import {
  createStripePayment,
  createVnPayPayment,
} from "../controllers/paymentController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//ROUTES
router.post("/stripe/:paymentType", createStripePayment); // silver, gold, diamond
router.post("/vnpay", createVnPayPayment); // silver, gold, diamond

export default router;
