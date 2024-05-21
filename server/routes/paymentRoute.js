import express from "express";
import { createPayment } from "../controllers/paymentController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//ROUTES
router.post("/:paymentType", createPayment); // silver, gold, diamond

export default router;
