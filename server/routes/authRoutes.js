import express from "express";
import {
  googleSignUp,
  login,
  register,
  forgotPassword,
  loginAdmin,
  // getContacts,
  createAdmin,
} from "../controllers/authController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/google-signup", googleSignUp);
router.post("/login", login);
router.post("/login-admin", loginAdmin);
router.post("/forgot-password", forgotPassword);

//--ADMIN--
router.post("/create-admin", userAuth, createAdmin);

export default router;
