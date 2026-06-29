import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const retrievalAgent = async (state) => {
  console.log("--> [Retrieval Agent] Started");
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEY
  });

  const prompt = `You are a Retrieval Agent.
  Given this plan: ${state.plan}
  And this input data: ${JSON.stringify(state.inputData)}
  Simulate retrieving historical documents, CRM logs, and past decision precedents that match this scenario. Return a summary of the retrieved simulated data.`;

  const response = await llm.invoke(prompt);
  return { retrievedData: response.content };
};
