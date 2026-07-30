import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let genAI: GoogleGenAI | null = null;

export function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set in environment.");
      return null;
    }
    genAI = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAI;
}

export async function generateAiContent(prompt: string, model: string = "gemini-1.5-flash") {
  const ai = getGenAI();
  if (!ai) throw new Error("AI Service Unavailable: API Key missing.");

  const response = await ai.getGenerativeModel({ model }).generateContent(prompt);
  const responseText = response.response.text();
  
  try {
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Failed to parse AI response:", responseText);
    throw new Error("Failed to parse AI decision output");
  }
}
