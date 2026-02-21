import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "ai"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Store base64 or URL
        default: null
    },
    fileAttachment: {
        type: String, // File name
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const chatSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            default: "New Chat",
        },
        messages: [messageSchema],
    },
    { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
