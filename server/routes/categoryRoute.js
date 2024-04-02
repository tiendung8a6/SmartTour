import express from "express";
import {
  createCategory,
  getCategory,
} from "../controllers/categoryController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// ADMIN ROUTES
router.post("/create-category", userAuth, createCategory);
router.post("/admin-category", userAuth, getCategory);

export default router;
