import express from "express";
import authRoute from "./authRoutes.js";
import postRoute from "./postRoutes.js";
import userRoute from "./userRoutes.js";
import categoryRoute from "./categoryRoute.js";
import tripRoute from "./tripRoute.js";
import planRoute from "./planRoute.js";
import paymentRoute from "./paymentRoute.js";
import travelAIRoute from "./travelAIRoute.js";
import notificationRoute from "./notificationRoute.js";
const router = express.Router();

router.use(`/auth`, authRoute); //auth/register
router.use(`/users`, userRoute);
router.use(`/posts`, postRoute);
router.use(`/categories`, categoryRoute);
router.use(`/trips`, tripRoute);
router.use(`/plans`, planRoute);
router.use(`/payment`, paymentRoute);
router.use(`/ai`, travelAIRoute);
router.use(`/notification`, notificationRoute);

export default router;
