import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes an image to detect chart type and insights.
 */
export const analyzeChartImage = async (base64Image: string, mimeType: string) => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Bu görseldeki veri grafiğini analiz et. Aşağıdaki formatta Türkçe JSON döndür.
      Sadece JSON döndür, markdown bloğu kullanma.
      
      {
        "chartType": "Grafik türü nedir? (Örn: Sütun, Çizgi, Pasta)",
        "title": "Grafiğin başlığı veya konusu",
        "summary": "Grafiğin ne gösterdiğine dair kısa bir özet (maks 2 cümle)",
        "insights": ["Çıkarım 1", "Çıkarım 2", "Çıkarım 3"]
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    throw new Error("Görsel analiz edilemedi.");
  }
};

/**
 * Generates insights based on CSV raw data (string representation).
 */
export const analyzeCsvData = async (csvSnippet: string) => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Aşağıdaki CSV verisine dayanarak Türkçe kısa bir analiz yap.
      
      Veri:
      ${csvSnippet}
      
      Lütfen şunları sağla:
      1. Verinin genel trendi.
      2. Dikkat çeken en yüksek/düşük değerler.
      3. Bir sonraki dönem için basit bir tahmin (eğer zaman serisi ise).
      
      Yanıtı sadece düz metin olarak, madde işaretleri ile ver.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini CSV Analysis Error:", error);
    return "Veri analizi sırasında bir hata oluştu.";
  }
};
