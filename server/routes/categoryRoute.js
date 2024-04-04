import express from "express";
import {
  createCategory,
  getCategory,
  deleteCategory,
  getCategories,
  getPostsByCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// ADMIN ROUTES
router.post("/create-category", userAuth, createCategory);
router.post("/admin-category", userAuth, getCategory);

router.delete("/:id", userAuth, deleteCategory);

router.get("/", getCategories);

router.get("/:catId", getPostsByCategory);

router.patch("/update/:id", userAuth, updateCategory);

export default router;
