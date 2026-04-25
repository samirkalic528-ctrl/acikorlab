import { GoogleGenAI } from "@google/genai";

// Proveravamo sve moguće nazive varijabli koje smo možda uneli
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";

if (!apiKey) {
  console.error("KLJUČ NIJE PRONAĐEN! Proveri Netlify Environment Variables.");
}

const genAI = new GoogleGenAI(apiKey);

export const generateStylistFeedback = async (originalBase64: string, generatedBase64: string, prompt: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Čišćenje base64 stringova
    const cleanOrig = originalBase64.includes(',') ? originalBase64.split(',')[1] : originalBase64;
    const cleanGen = generatedBase64.includes(',') ? generatedBase64.split(',')[1] : generatedBase64;

    const result = await model.generateContent([
      { text: `Ti si hair stilista. Klijent želi: ${prompt}. Analiziraj originalnu i novu sliku i daj kratak savet na srpskom.` },
      { inlineData: { data: cleanOrig, mimeType: "image/jpeg" } },
      { inlineData: { data: cleanGen, mimeType: "image/jpeg" } }
    ]);
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Feedback error:", error);
    return "Izgleda super! Probaj još neku varijantu.";
  }
};

export const generateHeadshot = async (imageBase64: string, prompt: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const cleanImg = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    const result = await model.generateContent([
      { inlineData: { data: cleanImg, mimeType: "image/jpeg" } },
      { text: `${prompt}. Keep the same face and identity. Output only the image.` }
    ]);

    const response = await result.response;
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    
    if (!part?.inlineData?.data) {
      throw new Error("Model nije vratio sliku.");
    }

    return `data:image/png;base64,${part.inlineData.data}`;
  } catch (error) {
    console.error("Generation error:", error);
    throw error;
  }
};
