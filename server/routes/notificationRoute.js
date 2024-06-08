import express from "express";
import { getNotificationById } from "../controllers/notificationController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//ROUTES
router.get("/:id", getNotificationById);
export default router;
