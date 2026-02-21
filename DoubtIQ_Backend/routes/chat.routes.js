import express from "express";
import {
    createChat,
    getAllChats,
    getChatById,
    sendMessage,
    renameChat,
    deleteChat
} from "../controllers/chat.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = express.Router();

// Setup Multer for memory storage (for direct base64 API posting)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.use(requireAuth); // All chat routes need auth

router.post("/new", upload.single('file'), createChat);
router.get("/history", getAllChats);
router.get("/:id", getChatById);
router.post("/:id/message", upload.single('file'), sendMessage);
router.patch("/:id/rename", renameChat);
router.delete("/:id", deleteChat);

export default router;
