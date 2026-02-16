
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize with the named parameter apiKey from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAuroraPrediction = async (date: string, location: string) => {
  if (!process.env.API_KEY) return { chance: 75, kpIndex: 4, description: "極光女神正在趕來的路上。" };
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Predict Aurora visibility for ${location} on ${date}. Give me a percentage chance and a short poetic description in Traditional Chinese.`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chance: { type: Type.NUMBER, description: "Percentage chance (0-100)" },
            kpIndex: { type: Type.NUMBER, description: "Predicted KP Index (1-9)" },
            description: { type: Type.STRING }
          },
          required: ["chance", "kpIndex", "description"]
        }
      }
    });
    // Access response.text as a property
    return JSON.parse(response.text || "{}");
  } catch (e) { 
    console.error("Gemini Error:", e);
    return { chance: 50, kpIndex: 3, description: "今晚雲層較厚，建議稍後再觀察。" }; 
  }
};

export const askGemini = async (prompt: string) => {
  if (!process.env.API_KEY) return "請先配置 API Key。";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        systemInstruction: "你是一位加拿大旅遊專家與極光攝影大師。請用親切、專業且夢幻的口吻回答問題，使用繁體中文，字數請控制在 200 字以內。如果提到氣溫，請提醒使用者注意保溫。" 
      }
    });
    // Access response.text as a property
    return response.text || "系統暫忙。";
  } catch (e) { 
    console.error("Gemini Chat Error:", e);
    return "發生錯誤。"; 
  }
};
