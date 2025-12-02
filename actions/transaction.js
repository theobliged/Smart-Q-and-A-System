// Add imports at the top
import { GoogleGenAI } from "@google/genai";
// Ensure all other necessary imports are present (db, checkUser, etc.)

// Initialize the AI client (runs on the server)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = ai.generativeModel({ model: "gemini-1.5-flash" });

export async function scanReceipt(file) {
  "use server";

  const arrayBuffer = await file.arrayBuffer();
  const base64Image = Buffer.from(arrayBuffer).toString("base64");

  // The detailed prompt asks the AI for structured JSON output
  const PROMPT = "Analyze this receipt image and extract the total amount, date (in YYYY-MM-DD format), description, and suggested category from the provided list. If date or amount are not found, use null. Respond ONLY with the JSON object.";

  try {
    const response = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: PROMPT }, { inlineData: { data: base64Image, mimeType: file.type } }] },
      ],
    });

    // Clean up the response text to ensure valid JSON parsing
    const jsonText = response.text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(jsonText);

    return { success: true, data };
  } catch (error) {
    console.error("AI Scan Error:", error);
    throw new Error("Failed to scan receipt. Please try again or enter details manually.");
  }
}