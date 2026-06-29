import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const recommendationAgent = async (state) => {
  console.log("--> [Recommendation Agent] Started");
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEY
  });

  const prompt = `You are a Recommendation Agent.
  Based on this reasoning: ${state.reasoningAnalysis}
  Provide EXACTLY 3 strategies. For each strategy, output a valid JSON object matching this schema:
  {
    "id": "strategy-uuid-here",
    "title": "Strategy name",
    "description": "Short description",
    "probability": 85, 
    "impact": "High", // High, Medium, or Low
    "risk": "Medium", // High, Medium, or Low
    "timeRequired": "e.g. 2 weeks",
    "resources": "e.g. 2 engineers",
    "recommended": true, // exactly one should be true
    "accent": "border-blue-500", // any tailwind border color
    "bg": "bg-blue-500/10" // any tailwind bg color with /10 opacity
  }
  Make sure one is recommended: true.
  Output ONLY a valid JSON array of these 3 objects. NO markdown formatting around it, just the raw JSON array.`;

  const response = await llm.invoke(prompt);
  
  let strategies = [];
  try {
    const rawJson = response.content.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    strategies = JSON.parse(rawJson);
    // ensure each has an id
    strategies = strategies.map((s, i) => ({ ...s, id: s.id || `strat-${Date.now()}-${i}` }));
  } catch(e) {
    console.error("Failed to parse strategies JSON:", e);
    console.error("Raw content:", response.content);
    // fallback
    strategies = [{
      id: "strat-error",
      title: "Fallback Strategy",
      description: "Error parsing AI response.",
      probability: 50,
      impact: "Medium",
      risk: "Medium",
      timeRequired: "Unknown",
      resources: "Unknown",
      recommended: true,
      accent: "border-gray-500",
      bg: "bg-gray-500/10"
    }];
  }

  return { strategies, status: "PENDING_REVIEW" };
};
