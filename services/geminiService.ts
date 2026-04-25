import { GoogleGenAI } from "@google/genai";

// Koristimo GEMINI_API_KEY koji smo definisali u Vite i Netlify podešavanjima
// process.env.GEMINI_API_KEY se automatski menja tvojim pravim ključem tokom build-a
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenAI(apiKey);

/**
 * Generiše stilistički savet analizirajući originalnu i novu sliku.
 */
export const generateStylistFeedback = async (originalBase64: string, generatedBase64: string, prompt: string): Promise<string> => {
  try {
    const cleanOriginal = originalBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    const cleanGenerated = generatedBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    // Koristimo gemini-1.5-flash jer je najstabilniji za besplatni nivo
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const response = await model.generateContent([
      { text: `Ti si vrhunski, motivacioni, ali i potpuno iskreni hair stilista. Klijent je upravo isprobao novu frizuru koristeći AI. Tražena frizura je: "${prompt}".\nPrva slika je originalna slika (pre), a druga slika je generisana nova frizura (posle).\n\nTvoj zadatak je da analiziraš sliku klijenta (oblik lica, ten, crte lica) i kažeš svoje mišljenje kako se ova nova frizura uklapa.\nBUDI ISKREN: Objasni šta ti se sviđa, a šta bi možda moglo bolje (npr. da li otvara lice, da li boja odgovara tenu). Ako izgleda ok reci to, a ako ne stoji baš najbolje, slobodno to reci na ljubazan i motivišući način i daj neki kratak predlog za razmišljanje.\n\nNa kraju, OBAVEZNO završi savet sličnom porukom: "Izgleda super za eksperimentisanje! Probaj još frizura ovde i obavezno se posavetuj sa svojim frizerom pre nego što se odlučiš da napraviš pravu promenu."\n\nObrati se direktno klijentu (na "ti") sa puno energije, stila i ljubavi prema kosi. Ne koristi generične fraze. Ograniči savet na 2-3 kratka paragrafa (na srpskom jeziku).` },
      { inlineData: { data: cleanOriginal, mimeType: 'image/jpeg' } },
      { inlineData: { data: cleanGenerated, mimeType: 'image/jpeg' } }
    ]);

    const result = await response.response;
    return result.text() || "Nismo uspeli da generišemo savet u ovom trenutku.";
  } catch (error) {
    console.error("Gemini Stylist Feedback Error:", error);
    throw error;
  }
};

/**
 * Menja frizuru na slici na osnovu prompta.
 */
export const generateHeadshot = async (imageBase64: string, prompt: string): Promise<string> => {
  try {
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    // Koristimo gemini-1.5-flash koji podržava multimodalni input (slika + tekst)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const response = await model.generateContent([
      {
        inlineData: {
          data: cleanBase64,
          mimeType: 'image/jpeg',
        },
      },
      {
        text: `${prompt} Important: Keep the person's face, facial features, skin texture, and expression exactly the same. DO NOT add any new marks, moles, freckles, wrinkles, or blemishes that are not present in the original picture. Completely preserve the original facial identity. Only change the hair/style as requested. Photorealistic, high quality.`,
      },
    ]);

    const result = await response.response;
    let generatedImageBase64 = '';

    // Proveravamo da li je model vratio generisanu sliku
    if (result.candidates?.[0]?.content?.parts) {
      for (const part of result.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          generatedImageBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!generatedImageBase64) {
       // Ako model vrati samo tekst umesto slike (što se dešava ako je kvota mala ili filteri strogi)
       throw new Error("Model nije vratio sliku. Pokušaj sa drugačijim opisom frizure.");
    }

    return `data:image/png;base64,${generatedImageBase64}`;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
