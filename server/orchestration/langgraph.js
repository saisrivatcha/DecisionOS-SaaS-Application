import { StateGraph, START, END } from "@langchain/langgraph";

import { plannerAgent } from "../agents/plannerAgent.js";
import { retrievalAgent } from "../agents/retrievalAgent.js";
import { contextAgent } from "../agents/contextAgent.js";
import { reasoningAgent } from "../agents/reasoningAgent.js";
import { recommendationAgent } from "../agents/recommendationAgent.js";
import { memoryAgent } from "../agents/memoryAgent.js";

// Define the state schema
const channels = {
  inputData: {
    value: (a, b) => b,
    default: () => ({}),
  },
  plan: {
    value: (a, b) => b,
    default: () => "",
  },
  retrievedData: {
    value: (a, b) => b,
    default: () => "",
  },
  contextAnalysis: {
    value: (a, b) => b,
    default: () => "",
  },
  reasoningAnalysis: {
    value: (a, b) => b,
    default: () => "",
  },
  strategies: {
    value: (a, b) => b,
    default: () => [],
  },
  status: {
    value: (a, b) => b,
    default: () => "PROCESSING",
  }
};

export const createAgentWorkflow = () => {
  const workflow = new StateGraph({ channels });

  workflow.addNode("planner", plannerAgent);
  workflow.addNode("retrieval", retrievalAgent);
  workflow.addNode("context", contextAgent);
  workflow.addNode("reasoning", reasoningAgent);
  workflow.addNode("recommendation", recommendationAgent);
  workflow.addNode("memory", memoryAgent);

  workflow.addEdge(START, "planner");
  workflow.addEdge("planner", "retrieval");
  workflow.addEdge("retrieval", "context");
  workflow.addEdge("context", "reasoning");
  workflow.addEdge("reasoning", "recommendation");
  workflow.addEdge("recommendation", "memory");
  workflow.addEdge("memory", END);

  return workflow.compile();
};
