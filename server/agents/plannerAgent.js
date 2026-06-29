import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const plannerAgent = async (state) => {
  console.log("--> [Planner Agent] Started");
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEY
  });

  const prompt = `You are a Planner Agent for DecisionOS.
  Given the following decision input data: ${JSON.stringify(state.inputData)}
  Create a concise execution plan outlining what information needs to be retrieved and what factors need to be analyzed to make a recommendation.`;

  const response = await llm.invoke(prompt);
  return { plan: response.content };
};
