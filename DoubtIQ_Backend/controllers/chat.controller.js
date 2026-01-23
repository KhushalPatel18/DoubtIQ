import Chat from "../models/Chat.js";
import { askAI } from "../utils/ai.js";

// Create a new chat session
export const createChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const { message } = req.body; // Optional initial message

        const chat = await Chat.create({
            user: userId,
            messages: [],
        });

        // If there's an initial message, process it immediately
        if (message) {
            chat.messages.push({ role: "user", content: message });

            // Get AI response
            const aiResponse = await askAI(message);
            chat.messages.push({ role: "ai", content: aiResponse });

            // Update title based on first message
            chat.title = message.substring(0, 30) + (message.length > 30 ? "..." : "");

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

// Send a message to an existing chat
export const sendMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const userId = req.user._id;

        const chat = await Chat.findOne({ _id: id, user: userId });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Add user message to history
        chat.messages.push({ role: "user", content: message });

        // If it's the first message and title is default, update title
        if (chat.messages.length === 1 && chat.title === "New Chat") {
            chat.title = message.substring(0, 30) + (message.length > 30 ? "..." : "");
        }

        await chat.save(); // Save user message first so we don't lose it if AI fails

        // Call AI
        const aiResponse = await askAI(message);

        // Add AI response
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
