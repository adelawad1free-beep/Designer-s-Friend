import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ColorPalette, GeneratedCode, Language } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check for API key
const checkApiKey = () => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
};

export const generateColorPalette = async (mood: string, lang: Language): Promise<ColorPalette> => {
  checkApiKey();
  
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: lang === 'ar' ? "اسم إبداعي للوحة الألوان" : "Creative name for the palette" },
      colors: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 5 Hex codes"
      },
      description: { type: Type.STRING, description: lang === 'ar' ? "وصف موجز للوحة الألوان" : "Brief description of the palette" }
    },
    required: ["name", "colors", "description"]
  };

  const prompt = lang === 'ar' 
    ? `قم بإنشاء لوحة ألوان متناسقة للمصممين بناءً على الوصف التالي: "${mood}".`
    : `Generate a consistent color palette for designers based on this description: "${mood}".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 1, 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from model");
    return JSON.parse(text) as ColorPalette;
  } catch (error) {
    console.error("Error generating palette:", error);
    throw error;
  }
};

export const generateDesignCode = async (prompt: string, lang: Language): Promise<GeneratedCode> => {
  checkApiKey();

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      html: { 
        type: Type.STRING, 
        description: "Complete HTML code using Tailwind CSS classes only." 
      },
      explanation: { 
        type: Type.STRING, 
        description: lang === 'ar' ? "شرح موجز للكود والمفاهيم المستخدمة باللغة العربية." : "Brief explanation of the code and concepts in English."
      }
    },
    required: ["html", "explanation"]
  };

  const systemInstruction = lang === 'ar'
    ? `أنت مساعد خبير في كتابة أكواد الواجهات (Frontend). 
      المهمة: اكتب كود لمكون واجهة مستخدم (UI Component) بناءً على الطلب التالي: "${prompt}".
      الشروط:
      1. استخدم HTML و Tailwind CSS فقط (عبر CDN).
      2. تأكد من أن التصميم متجاوب (Responsive) ويدعم RTL إذا لزم الأمر.
      3. اجعل التصميم عصريًا وجذابًا بصريًا.
      4. لا تستخدم JavaScript خارجي، فقط HTML/CSS.`
    : `You are an expert Frontend assistant.
      Task: Write code for a UI Component based on this request: "${prompt}".
      Requirements:
      1. Use HTML and Tailwind CSS only (via CDN).
      2. Ensure the design is Responsive and supports RTL/LTR as appropriate.
      3. Make the design modern and visually appealing.
      4. Do not use external JavaScript, only HTML/CSS.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemInstruction,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from model");
    return JSON.parse(text) as GeneratedCode;
  } catch (error) {
    console.error("Error generating code:", error);
    throw error;
  }
};
