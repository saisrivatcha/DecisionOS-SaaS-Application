# 🎥 DecisionOS: 5-Minute Architecture Walkthrough

*Use this script and outline for your presentation video. It is designed to take about 4–5 minutes to present at a normal speaking pace. Feel free to adjust the wording to match your own voice!*

---

## ⏱️ [0:00 - 0:45] Introduction & The Problem
**Slide / Visual:** *Show the DecisionOS Dashboard or the Architecture Diagram.*

**Script:**
> "Hi everyone, today I'm walking you through the architecture of **DecisionOS**. The core problem we are solving is that enterprise teams make hundreds of high-stakes decisions every day, but the context behind those decisions is often lost in emails, meetings, and CRM logs. 
>
> We needed a system that doesn't just store data, but actively acts as an intelligent 'Decision Architect'. To achieve this, we had to make some very specific design choices. Let’s look under the hood at our tech stack and why we chose it."

---

## ⏱️ [0:45 - 1:30] Frontend: Built for Speed & Clarity
**Slide / Visual:** *Show the React UI, clicking between the Contributor and Architect views.*

**Script:**
> "Let's start with the Client Layer. For the frontend, we chose **React** powered by **Vite**, styled with **TailwindCSS**. 
>
> **Why?** Decision making requires zero friction. Vite gives us lightning-fast hot module replacement during development and a highly optimized build for production. Tailwind allowed us to build a completely custom, premium UI without fighting generic component libraries. 
>
> Because DecisionOS has two distinct users—the 'Contributor' who submits problems, and the 'Decision Architect' who reviews them—we needed a flexible state management system. React's component-based architecture allows us to instantly swap these views seamlessly."

---

## ⏱️ [1:30 - 2:30] Backend: The Express API Gateway
**Slide / Visual:** *Show the `backend/` folder structure or the top half of your Mermaid Diagram.*

**Script:**
> "Moving to the Server Layer, our API Gateway is built on **Node.js and Express**. 
> 
> **Why Node.js?** Since our frontend is JavaScript-heavy, using Node allows for a unified language across the stack. Express acts as our traffic controller. It handles authentication via Google OAuth, manages incoming REST API payloads from the frontend, and most importantly, it triggers our AI Orchestrator. 
>
> Rather than putting heavy processing on the frontend, the Express server securely handles all the API keys and data routing behind the scenes."

---

## ⏱️ [2:30 - 3:45] The Core Innovation: Multi-Agent AI (LangGraph)
**Slide / Visual:** *Zoom in on the Multi-Agent LangGraph Pipeline (Planner -> Retrieval -> Context -> Reasoning -> Recommendation -> Memory).*

**Script:**
> "This brings us to the core of DecisionOS: our AI Orchestration layer. Instead of just sending a massive prompt to ChatGPT and hoping for the best, we implemented a **Multi-Agent Orchestration system using LangGraph**.
>
> **Why LangGraph?** Complex business decisions require step-by-step reasoning. We broke the AI down into 6 specialized, autonomous agents:
> 1. The **Planner Agent** receives the payload and maps out the required steps.
> 2. The **Retrieval Agent** uses our custom tools to fetch data from Enterprise APIs (like Salesforce or Google Meet).
> 3. The **Context Agent** synthesizes that raw data.
> 4. The **Reasoning Agent** models the probabilities of success and weighs the risks.
> 5. The **Recommendation Agent** formats the final strategies.
> 6. Finally, the **Memory Agent** securely logs the outcome.
>
> This multi-agent design ensures our outputs are deterministic, logical, and highly accurate because each agent has a single, focused job."

---

## ⏱️ [3:45 - 4:45] Database & Storage: The Hybrid Approach
**Slide / Visual:** *Show the `schema.prisma` file or the Database section of the diagram.*

**Script:**
> "Finally, let's talk about where this data lives. We use a **Hybrid Database Architecture**. 
>
> First, we use **PostgreSQL**, managed by **Prisma ORM**. 
> **Why?** We need strict, relational integrity for our users, organizations, and decision statuses. Prisma gives us incredible type safety and clearly defined relationships. 
> 
> Second, we use **ChromaDB** as our Vector Database. 
> **Why?** When a new decision is submitted, our Retrieval Agent converts it into a vector embedding and searches ChromaDB for semantic similarities in our 'Company Memory'. This allows the AI to say, *'We faced a similar issue 6 months ago, and here is how we solved it.'* 
>
> You can't do that efficiently with standard SQL, which is why the hybrid SQL + Vector approach was a critical design decision."

---

## ⏱️ [4:45 - 5:00] Conclusion
**Slide / Visual:** *Show the full Architecture diagram one last time or a "Thank You" slide.*

**Script:**
> "In summary: React for a frictionless UI, Node/Express for secure routing, LangGraph for rigorous multi-agent reasoning, and a Hybrid Postgres/ChromaDB layer for semantic memory. 
>
> By decoupling the architecture this way, DecisionOS is highly scalable, secure, and ready for the enterprise. Thank you!"
