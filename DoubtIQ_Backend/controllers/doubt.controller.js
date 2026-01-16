import Doubt from "../models/Doubt.js";
import { askAI } from "../utils/ai.js";

export const askDoubt = async (req, res) => {
  try {
    const { question } = req.body;
    const user = req.user;

    if (!question || !question.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }

    // Call AI
    const answer = await askAI(question);

    // Save to DB
    const doubt = await Doubt.create({
      user: user._id,
      question,
      answer,
    });

    res.status(200).json({
      message: "Doubt answered successfully",
      answer: doubt.answer,
    });
  } catch (error) {
    console.error("Ask doubt error:", error);
    res.status(500).json({ message: error.message });
  }
  
};
