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

const router = express.Router();

router.use(requireAuth); // All chat routes need auth

router.post("/new", createChat);
router.get("/history", getAllChats);
router.get("/:id", getChatById);
router.post("/:id/message", sendMessage);
router.patch("/:id/rename", renameChat);
router.delete("/:id", deleteChat);

export default router;
