import express from "express";
import {
  OPTVerification,
  followWritter,
  getWriter,
  resendOTP,
  updateUser,
  getAllUsers,
  updateUserLock,
  deleteUser,
  createContact,
  updatePolicy,
  getPolicyContent,
  getContactsContent,
  sendReplyEmail,
  getUserById,
  getUsersNotifications,
  getPolicy,
} from "../controllers/userController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/verify/:userId/:otp", OPTVerification);
router.post("/resend-link/:id", resendOTP);

// user routes
router.post("/follower/:id", userAuth, followWritter);
router.put("/update-user", userAuth, updateUser);

router.get("/get-user/:id", getWriter);

router.post("/admin-users", userAuth, getAllUsers);
router.patch("/update-user-lock/:id", userAuth, updateUserLock);
router.delete("/delete-user/:id", userAuth, deleteUser);

//get ID user
router.get("/get-info/:id", getUserById); //Lấy FULL thông tin người dùng

//contact
router.post("/contact", createContact);
router.patch("/contact/:id", userAuth, sendReplyEmail);
router.post("/admin-contacts", userAuth, getContactsContent);

//Policy
router.patch("/policy/:id", userAuth, updatePolicy);
router.post("/admin-policy", userAuth, getPolicyContent);

//Notification
router.get("/notifications", getUsersNotifications);

router.get("/policy", getPolicy);

export default router;
