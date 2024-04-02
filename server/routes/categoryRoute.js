import express from "express";
import {
  createCategory,
  getCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// ADMIN ROUTES
router.post("/create-category", userAuth, createCategory);
router.post("/admin-category", userAuth, getCategory);
router.delete("/:id", userAuth, deleteCategory);

export default router;
