import express from "express";
import {
  createCategory,
  getCategory,
  deleteCategory,
  getCategories,
  getPostsByCategory,
} from "../controllers/categoryController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// ADMIN ROUTES
router.post("/create-category", userAuth, createCategory);
router.post("/admin-category", userAuth, getCategory);

router.delete("/:id", userAuth, deleteCategory);

router.get("/", getCategories);

router.get("/:catId", getPostsByCategory);

export default router;
