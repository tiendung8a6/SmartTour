import express from "express";
import {
  googleSignUp,
  login,
  register,
  forgotPassword,
  loginAdmin,
  getContacts,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/google-signup", googleSignUp);
router.post("/login", login);
router.post("/login-admin", loginAdmin);
router.post("/forgot-password", forgotPassword);

//CONTACT
router.post("/admin-contacts", getContacts);

export default router;
