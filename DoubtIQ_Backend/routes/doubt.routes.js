import express from "express";
import { askDoubt } from "../controllers/doubt.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔐 Protected Ask Doubt Route
router.post("/ask", requireAuth, askDoubt);

export default router;
