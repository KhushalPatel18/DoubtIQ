import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const askAI = async (question) => {
  try {
    // Check if API key exists
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY not found in environment variables");
    }

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an AI doubt solver. Explain answers clearly, simply, and step-by-step.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.5,
      max_tokens: 2000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("GROQ AI error:", error.message);
    console.error("Full error:", error);
    throw new Error(`AI service error: ${error.message}`);
  }
};

export const askVisionAI = async (question, base64Image) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY not found in environment variables");
    }

    const response = await client.chat.completions.create({
      model: "llama-3.2-11b-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: question },
            { type: "image_url", image_url: { url: base64Image } }
          ],
        },
      ],
      temperature: 0.5,
      max_tokens: 1024,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("GROQ Vision AI error:", error.message);
    console.error("Full error:", error);
    throw new Error(`AI service error: ${error.message}`);
  }
};
