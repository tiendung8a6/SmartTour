import express from "express";
import {
  createStripePayment,
  createVnPayPayment,
  vnpayReturn,
} from "../controllers/paymentController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//ROUTES
router.post("/stripe/:paymentType", createStripePayment); // silver, gold, diamond
router.post("/vnpay/:paymentType", createVnPayPayment); // silver, gold, diamond
router.get("/vnpay_return", vnpayReturn);
export default router;
