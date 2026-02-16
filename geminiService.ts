
import { GoogleGenAI, Type } from "@google/genai";

// Use the API key exclusively from process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAuroraPrediction = async (date: string, location: string) => {
  if (!process.env.API_KEY) {
    console.warn("Missing API Key. Using mock data for Aurora prediction.");
    return { chance: 75, kpIndex: 4, description: "極光女神正在趕來的路上 (請配置 API Key 以獲得即時預測)。" };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Predict the Aurora Borealis visibility for ${location} on ${date}. 
      Give me a percentage chance and a short poetic description in Traditional Chinese.`,
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
    // response.text is a property, not a method
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return { chance: 65, kpIndex: 4, description: "今晚極光女神可能會降臨，請準備好相機！" };
  }
};

export const askGemini = async (prompt: string) => {
  if (!process.env.API_KEY) return "請先在設定中配置 Gemini API Key 才能與我聊天喔！";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "你是一位加拿大旅遊專家與極光攝影大師。請用親切、專業且夢幻的口吻回答問題，使用繁體中文，字數請控制在 200 字以內。如果提到氣溫，請提醒使用者注意保溫。",
      },
    });
    // response.text is a property, not a method
    return response.text || "抱歉，極光女神暫時斷開了連結，請稍後再試。";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "極光似乎被雲層擋住了 (發生錯誤)，請再問一次吧！";
  }
};

export const getCurrencyRate = async () => {
  // 這裡之後可以串接真正的 API，目前回傳台灣銀行概估匯率
  return { cadToTwd: 23.85 };
};
