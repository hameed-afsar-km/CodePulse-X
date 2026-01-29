
import { GoogleGenAI, Type } from "@google/genai";
import { PerformanceMetrics, CoderArchetype, GameMode } from "../types";

export async function getAICoachSummary(metrics: PerformanceMetrics, mode: GameMode) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    As a Lead Engineering Cognitive Analyst, analyze the following developer typing session metrics for the mode "${mode}":
    - WPM: ${metrics.wpm}
    - Accuracy: ${metrics.accuracy}%
    - Cognitive Load Score: ${metrics.cognitiveLoad}/100
    - Consistency: ${metrics.consistency}%
    - Errors: ${metrics.errorPositions.length}

    Please provide:
    1. A human-tone summary of their performance.
    2. A classification into one of these archetypes: Calm Coder, Panic Fixer, Flow Specialist, Precision Thinker, Adaptive Switcher.
    3. Three specific recommendations for cognitive improvement.
    
    Return the response as a valid JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            archetype: { type: Type.STRING },
            recommendations: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      summary: "You displayed remarkable focus despite technical challenges.",
      archetype: metrics.accuracy > 95 ? "Precision Thinker" : "Flow Specialist",
      recommendations: [
        "Focus on rhythm stability over raw speed.",
        "Take a short micro-break every 25 minutes.",
        "Practice with more complex syntax structures."
      ]
    };
  }
}
