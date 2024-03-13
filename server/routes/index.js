import express from "express";
import authRoute from "./authRoutes.js";
import postRoute from "./postRoutes.js";
import userRoute from "./userRoutes.js";

const router = express.Router();

router.use(`/auth`, authRoute); //auth/register
router.use(`/users`, userRoute);
router.use(`/posts`, postRoute);

export default router;
