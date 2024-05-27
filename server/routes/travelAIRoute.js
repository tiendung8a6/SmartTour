import express from "express";
import { travelAI } from "../controllers/travelAIController.js";

const router = express.Router();

//GET
router.get("/:place", travelAI);

export default router;
