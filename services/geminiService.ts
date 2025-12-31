
import { GoogleGenAI, Type, Schema } from "@google/genai";
// FIX: Added ColorPalette to the types import
import { GeneratedCode, Language, ColorPalette } from "../types";

export const generateDesignCode = async (prompt: string, lang: Language): Promise<GeneratedCode> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
      model: 'gemini-3-pro-preview',
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

// FIX: Added generateColorPalette function as required by PaletteGenerator.tsx
export const generateColorPalette = async (mood: string, lang: Language): Promise<ColorPalette> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { 
        type: Type.STRING, 
        description: "A creative name for the color palette." 
      },
      colors: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "An array of 5 hex color codes that match the mood/description."
      },
      description: { 
        type: Type.STRING, 
        description: lang === 'ar' ? "شرح موجز لسبب اختيار هذه الألوان." : "Brief explanation of why these colors were chosen."
      }
    },
    required: ["name", "colors", "description"]
  };

  const systemInstruction = lang === 'ar'
    ? `أنت خبير في نظريات الألوان وتصميم الهويات البصرية. 
      المهمة: توليد لوحة ألوان مكونة من 5 ألوان بناءً على الوصف التالي: "${mood}".
      الشروط:
      1. أرجع النتيجة بتنسيق JSON فقط.
      2. يجب أن تكون الأكواد بتنسيق HEX (مثال: #FFFFFF).
      3. تأكد من تناسق الألوان مع بعضها البعض.`
    : `You are an expert in color theory and visual identity design.
      Task: Generate a color palette of 5 colors based on this description: "${mood}".
      Requirements:
      1. Return the result in JSON format only.
      2. Colors must be in HEX format (e.g., #FFFFFF).
      3. Ensure the colors are harmonized and aesthetic.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: systemInstruction,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
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
