import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const contextAgent = async (state) => {
  console.log("--> [Context Agent] Started");
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEY
  });

  const prompt = `You are a Context Agent.
  Given the retrieved data: ${state.retrievedData}
  And the current situation: ${JSON.stringify(state.inputData)}
  Synthesize the context. What is the current sentiment, constraints, and operational context?`;

  const response = await llm.invoke(prompt);
  return { contextAnalysis: response.content };
};
