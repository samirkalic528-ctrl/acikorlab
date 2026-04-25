import { GoogleGenAI } from "@google/genai";

// Čitamo ključ koji je Vite "ubrizgao"
const apiKey = process.env.GEMINI_API_KEY || "";

// Inicijalizacija - ako nema ključa, sajt neće pasti, samo će ispisati grešku u konzoli
const genAI = apiKey ? new GoogleGenAI(apiKey) : null;

export const generateStylistFeedback = async (originalBase64: string, generatedBase64: string, prompt: string): Promise<string> => {
  if (!genAI) return "API ključ nije podešen.";
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "Ti si iskusan hair stilista. Uporedi ove dve slike i daj kratak savet na srpskom.",
      { inlineData: { data: originalBase64.split(',')[1], mimeType: "image/jpeg" } },
      { inlineData: { data: generatedBase64.split(',')[1], mimeType: "image/jpeg" } }
    ]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    return "Trenutno ne mogu da generišem savet.";
  }
};

export const generateHeadshot = async (imageBase64: string, prompt: string): Promise<string> => {
  if (!genAI) throw new Error("API ključ nedostaje.");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    { inlineData: { data: imageBase64.split(',')[1], mimeType: "image/jpeg" } },
    { text: prompt }
  ]);
  const response = await result.response;
  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (!part?.inlineData?.data) throw new Error("Model nije vratio sliku.");
  return `data:image/png;base64,${part.inlineData.data}`;
};
