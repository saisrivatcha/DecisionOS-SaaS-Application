import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const reasoningAgent = async (state) => {
  console.log("--> [Reasoning Agent] Started");
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEY
  });

  const prompt = `You are a Reasoning Agent.
  Given the context: ${state.contextAnalysis}
  Apply logical deduction to weigh risks, impacts, and success probabilities for solving the issue described in ${JSON.stringify(state.inputData)}.
  Provide a detailed reasoning analysis.`;

  const response = await llm.invoke(prompt);
  return { reasoningAnalysis: response.content };
};
