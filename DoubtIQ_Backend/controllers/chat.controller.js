import Chat from "../models/Chat.js";
import { askAI, askVisionAI } from "../utils/ai.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const createChat = async (req, res) => {
    try {
        const userId = req.user._id;
        let { message } = req.body;

        const chat = await Chat.create({
            user: userId,
            messages: [],
        });

        if (message || req.file) {
            let userMessageObj = { role: "user", content: message || "Analyze this file" };
            let aiResponse = "";

            if (req.file) {
                userMessageObj.fileAttachment = req.file.originalname;
                if (req.file.mimetype === "application/pdf") {
                    const pdfData = await pdfParse(req.file.buffer);
                    const pdfText = pdfData.text.substring(0, 15000); // Prevent overflow
                    const combinedMessage = `User Input: ${message || "Explain this PDF Document"}\n\nDocument Content:\n${pdfText}`;
                    aiResponse = await askAI(combinedMessage);
                } else if (req.file.mimetype.startsWith("image/")) {
                    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
                    userMessageObj.image = base64Image;
                    aiResponse = await askVisionAI(message || "What is this image about?", base64Image);
                }
            } else {
                aiResponse = await askAI(message);
            }

            chat.messages.push(userMessageObj);
            chat.messages.push({ role: "ai", content: aiResponse });

            const titleBase = message && message.trim() ? message : req.file ? req.file.originalname : "New Chat";
            chat.title = titleBase.substring(0, 30) + (titleBase.length > 30 ? "" : "");

            await chat.save();
        }

        res.status(201).json(chat);
    } catch (error) {
        console.error("Create Chat Error:", error);
        res.status(500).json({ message: "Failed to create chat" });
    }
};

// Get all chats for the user (summary only)
export const getAllChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ user: userId })
            .select("title updatedAt")
            .sort({ updatedAt: -1 });

        res.status(200).json(chats);
    } catch (error) {
        console.error("Get Chats Error:", error);
        res.status(500).json({ message: "Failed to fetch chats" });
    }
};

// Get a specific chat by ID
export const getChatById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const chat = await Chat.findOne({ _id: id, user: userId });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error("Get Chat Error:", error);
        res.status(500).json({ message: "Failed to fetch chat" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { id } = req.params;
        let { message } = req.body;
        const userId = req.user._id;

        const chat = await Chat.findOne({ _id: id, user: userId });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        let userMessageObj = { role: "user", content: message || "Analyze this file" };
        let aiResponse = "";

        if (req.file) {
            userMessageObj.fileAttachment = req.file.originalname;
            if (req.file.mimetype === "application/pdf") {
                const pdfData = await pdfParse(req.file.buffer);
                const pdfText = pdfData.text.substring(0, 15000);
                const combinedMessage = `User Input: ${message || "Explain this PDF Document"}\n\nDocument Content:\n${pdfText}`;
                aiResponse = await askAI(combinedMessage);
            } else if (req.file.mimetype.startsWith("image/")) {
                const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
                userMessageObj.image = base64Image;
                aiResponse = await askVisionAI(message || "What is this image about?", base64Image);
            }
        } else {
            aiResponse = await askAI(message);
        }

        chat.messages.push(userMessageObj);

        if (chat.messages.length === 1 && chat.title === "New Chat") {
            const titleBase = message && message.trim() ? message : req.file ? req.file.originalname : "New Chat";
            chat.title = titleBase.substring(0, 30) + (titleBase.length > 30 ? "..." : "");
        }

        await chat.save();

        chat.messages.push({ role: "ai", content: aiResponse });
        await chat.save();

        res.status(200).json(chat);
    } catch (error) {
        console.error("Send Message Error:", error);
        res.status(500).json({ message: "Failed to send message" });
    }
};

// Rename a chat
export const renameChat = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const userId = req.user._id;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }

        const chat = await Chat.findOneAndUpdate(
            { _id: id, user: userId },
            { title: title.trim() },
            { new: true }
        );

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error("Rename Chat Error:", error);
        res.status(500).json({ message: "Failed to rename chat" });
    }
};

// Delete a chat
export const deleteChat = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const chat = await Chat.findOneAndDelete({ _id: id, user: userId });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.status(200).json({ message: "Chat deleted successfully", id });
    } catch (error) {
        console.error("Delete Chat Error:", error);
        res.status(500).json({ message: "Failed to delete chat" });
    }
};
