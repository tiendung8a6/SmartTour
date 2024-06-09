import express from "express";
import {
  getNotificationById,
  createNotification,
  createNotificationEmail,
} from "../controllers/notificationController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//ROUTES
router.get("/:id", getNotificationById);
router.post("/create", userAuth, createNotification);
router.post("/create/email", userAuth, createNotificationEmail);

export default router;
