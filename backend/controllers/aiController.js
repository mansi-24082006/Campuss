import { GoogleGenerativeAI } from "@google/generative-ai";
import Event from "../models/Event.js";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Fetch some context about recent/upcoming events to give to the AI
    const events = await Event.find({ status: "approved" })
      .sort({ date: 1 })
      .limit(10)
      .select("title date venue category type description");

    const eventContext = events.map(e => 
      `- ${e.title} (${e.category}) on ${new Date(e.date).toDateString()} at ${e.venue}. ${e.description}`
    ).join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are CampusBuzz Assistant, a helpful AI for a college event management platform. 
      Your goal is to help students with their doubts, provide information about events, and guide them through the platform.
      
      Here is some information about upcoming events:
      ${eventContext}
      
      User's current message: ${message}
      
      Please provide a concise, friendly, and helpful response. If you don't know something specific about an event not listed, 
      advise the user to check the "Discover" tab or contact the event organizer.
    `;

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ message: "Failed to get AI response" });
  }
};
