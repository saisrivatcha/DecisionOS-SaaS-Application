import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

async function run() {
  for (const model of ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.5-flash-latest"]) {
    try {
      const llm = new ChatGoogleGenerativeAI({
        model: model,
        apiKey: process.env.GOOGLE_API_KEY
      });
      await llm.invoke("hello");
      console.log(model, "Success!");
      return;
    } catch (e) {
      console.log(model, "Failed:", e.message);
    }
  }
}

run();
