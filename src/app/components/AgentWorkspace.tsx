import { useState, useEffect } from "react";
import {
  Network,
  FileSearch,
  Brain,
  Star,
  Sparkles,
  Database,
  CheckCircle,
  Loader,
  Circle,
  Clock,
  ChevronRight,
  Activity,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import type { Page } from "../App";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  bg: string;
  role: string;
  dependencies: string[];
  totalTasks: number;
  successRate: number;
}

const agentDefinitions: Agent[] = [
  {
    id: "planner",
    name: "Planner Agent",
    description: "Orchestrates the decision workflow by creating and sequencing execution plans for all other agents.",
    icon: Network,
    accent: "#4f46e5",
    bg: "#eef2ff",
    role: "Orchestrator",
    dependencies: [],
    totalTasks: 142,
    successRate: 97.2,
  },
  {
    id: "retrieval",
    name: "Retrieval Agent",
    description: "Fetches customer data from CRM, support tickets, and enterprise databases using semantic search.",
    icon: FileSearch,
    accent: "#0284c7",
    bg: "#f0f9ff",
    role: "Data Retrieval",
    dependencies: ["Planner"],
    totalTasks: 198,
    successRate: 98.5,
  },
  {
    id: "memory",
    name: "Memory Agent",
    description: "Maintains persistent customer memory across sessions including past interactions and learned preferences.",
    icon: Brain,
    accent: "#7c3aed",
    bg: "#f5f3ff",
    role: "Memory & Context",
    dependencies: ["Planner"],
    totalTasks: 302,
    successRate: 99.1,
  },
  {
    id: "analysis",
    name: "Analysis Agent",
    description: "Reasons across retrieved context to evaluate risks, opportunities, and strategic fit using Gemini 2.5 Flash.",
    icon: Database,
    accent: "#059669",
    bg: "#f0fdf4",
    role: "Reasoning",
    dependencies: ["Retrieval", "Memory"],
    totalTasks: 142,
    successRate: 92.3,
  },
  {
    id: "recommendation",
    name: "Recommendation Agent",
    description: "Synthesizes analysis output into ranked, confidence-scored next best action recommendations.",
    icon: Star,
    accent: "#d97706",
    bg: "#fffbeb",
    role: "Decision Engine",
    dependencies: ["Analysis"],
    totalTasks: 142,
    successRate: 90.1,
  },
  {
    id: "explanation",
    name: "Explanation Agent",
    description: "Generates transparent explainability reports documenting reasoning, evidence, and assumptions.",
    icon: Sparkles,
    accent: "#dc2626",
    bg: "#fef2f2",
    role: "Explainability",
    dependencies: ["Recommendation"],
    totalTasks: 128,
    successRate: 99.2,
  },
];

type AgentStatus = "idle" | "running" | "complete" | "queued";

interface AgentState {
  status: AgentStatus;
  progress: number;
  lastAction: string;
  executionTime: number;
  currentTask: string;
}

const idleStates: Record<string, AgentState> = {
  planner: { status: "idle", progress: 0, lastAction: "Completed plan DEC-2841 · 2h ago", executionTime: 0, currentTask: "Awaiting input" },
  retrieval: { status: "running", progress: 67, lastAction: "Fetching CRM data for TechCorp Inc.", executionTime: 14.2, currentTask: "Querying 3 data sources" },
  memory: { status: "idle", progress: 0, lastAction: "Updated memory for Meridian Health · 1d ago", executionTime: 0, currentTask: "Memory store synchronized" },
  analysis: { status: "running", progress: 42, lastAction: "Analyzing renewal risk for GlobalRetail", executionTime: 8.7, currentTask: "Evaluating 6 risk factors" },
  recommendation: { status: "idle", progress: 0, lastAction: "Generated NBA for Acme Corp · 2h ago", executionTime: 0, currentTask: "Awaiting analysis" },
  explanation: { status: "idle", progress: 0, lastAction: "Explained DEC-2839 · 6h ago", executionTime: 0, currentTask: "Standby" },
};

const statusConfig = {
  idle: { color: "#9ca3af", bg: "#f3f4f6", label: "Idle" },
  queued: { color: "#d97706", bg: "#fffbeb", label: "Queued" },
  running: { color: "#4f46e5", bg: "#eef2ff", label: "Running" },
  complete: { color: "#059669", bg: "#f0fdf4", label: "Complete" },
};

interface AgentWorkspaceProps {
  onNavigate: (page: Page) => void;
}

export function AgentWorkspace({ onNavigate }: AgentWorkspaceProps) {
  const [agentStates, setAgentStates] = useState<Record<string, AgentState>>(idleStates);

  // Simulate live updates for running agents
  useEffect(() => {
    const interval = setInterval(() => {
      setAgentStates((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((id) => {
          if (next[id].status === "running") {
            next[id] = {
              ...next[id],
              progress: Math.min(next[id].progress + Math.random() * 3, 99),
              executionTime: next[id].executionTime + 0.1,
            };
          }
        });
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const runningCount = Object.values(agentStates).filter((s) => s.status === "running").length;
  const idleCount = Object.values(agentStates).filter((s) => s.status === "idle").length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "#9ca3af" }}>
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "#4f46e5" }}>Agent Workspace</span>
          </div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>
            Agent Workspace
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            Real-time orchestration view of all AI agents in the decision pipeline
          </p>
        </div>
        <Button
          className="gap-2"
          style={{ background: "#4f46e5", color: "#ffffff" }}
          onClick={() => onNavigate("new-decision")}
        >
          <Zap className="w-4 h-4" />
          New Decision
        </Button>
      </div>

      {/* System overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Agents", value: "6", icon: Network, accent: "#4f46e5", bg: "#eef2ff" },
          { label: "Active Now", value: String(runningCount), icon: Activity, accent: "#059669", bg: "#f0fdf4" },
          { label: "Idle", value: String(idleCount), icon: Circle, accent: "#9ca3af", bg: "#f3f4f6" },
          { label: "Tasks Today", value: "47", icon: Clock, accent: "#d97706", bg: "#fffbeb" },
        ].map(({ label, value, icon: Icon, accent, bg }) => (
          <div
            key={label}
            className="rounded-xl border p-4 flex items-center gap-3"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: bg }}>
              <Icon className="w-4.5 h-4.5" style={{ color: accent, width: 18, height: 18 }} />
            </div>
            <div>
              <div className="text-xl font-semibold" style={{ color: "#111827" }}>{value}</div>
              <div className="text-xs" style={{ color: "#9ca3af" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent cards grid */}
      <div className="grid grid-cols-3 gap-4">
        {agentDefinitions.map((agent) => {
          const state = agentStates[agent.id];
          const Icon = agent.icon;
          const sc = statusConfig[state.status];

          return (
            <div
              key={agent.id}
              className="rounded-xl border p-5 transition-shadow hover:shadow-md"
              style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
            >
              {/* Agent header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: agent.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: agent.accent }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "#111827" }}>
                      {agent.name}
                    </div>
                    <div className="text-xs" style={{ color: "#9ca3af" }}>
                      {agent.role}
                    </div>
                  </div>
                </div>
                <span
                  className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium"
                  style={{ background: sc.bg, color: sc.color }}
                >
                  {state.status === "running" ? (
                    <Loader className="w-3 h-3 animate-spin" />
                  ) : state.status === "idle" ? (
                    <Circle className="w-3 h-3" />
                  ) : (
                    <CheckCircle className="w-3 h-3" />
                  )}
                  {sc.label}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs mb-4" style={{ color: "#6b7280", lineHeight: 1.6 }}>
                {agent.description}
              </p>

              {/* Progress (if running) */}
              {state.status === "running" && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: "#6b7280" }}>{state.currentTask}</span>
                    <span style={{ color: "#4f46e5" }}>{Math.round(state.progress)}%</span>
                  </div>
                  <Progress value={state.progress} className="h-1.5" />
                </div>
              )}

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg p-2.5" style={{ background: "#f9fafb" }}>
                  <div className="text-xs" style={{ color: "#9ca3af" }}>Total Tasks</div>
                  <div className="font-semibold text-sm mt-0.5" style={{ color: "#111827" }}>
                    {agent.totalTasks.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg p-2.5" style={{ background: "#f9fafb" }}>
                  <div className="text-xs" style={{ color: "#9ca3af" }}>Success Rate</div>
                  <div
                    className="font-semibold text-sm mt-0.5"
                    style={{ color: agent.successRate >= 95 ? "#059669" : agent.successRate >= 90 ? "#d97706" : "#dc2626" }}
                  >
                    {agent.successRate}%
                  </div>
                </div>
              </div>

              {/* Last action */}
              <div
                className="flex items-start gap-2 rounded-lg p-2.5"
                style={{ background: "#f9fafb" }}
              >
                <Clock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#9ca3af" }} />
                <div>
                  <div className="text-xs" style={{ color: "#9ca3af" }}>
                    {state.status === "running" ? "Current Task" : "Last Action"}
                  </div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: "#374151" }}>
                    {state.status === "running" ? state.lastAction : state.lastAction}
                  </div>
                  {state.status === "running" && (
                    <div className="text-xs mt-0.5" style={{ color: "#4f46e5" }}>
                      {state.executionTime.toFixed(1)}s elapsed
                    </div>
                  )}
                </div>
              </div>

              {/* Dependencies */}
              {agent.dependencies.length > 0 && (
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="text-xs" style={{ color: "#9ca3af" }}>Depends on:</span>
                  {agent.dependencies.map((dep) => (
                    <span
                      key={dep}
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: "#f3f4f6", color: "#6b7280" }}
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Flow diagram hint */}
      <div
        className="mt-6 rounded-xl border p-4 flex items-center justify-between"
        style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs" style={{ color: "#6b7280" }}>
            {["Planner", "Retrieval", "Memory", "Analysis", "Recommendation", "Explanation", "Human Review"].map((name, i, arr) => (
              <span key={name} className="flex items-center gap-2">
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={i < 2 && agentStates[name.toLowerCase().split(" ")[0]]?.status === "running"
                    ? { background: "#eef2ff", color: "#4f46e5" }
                    : { background: "#f3f4f6", color: "#6b7280" }
                  }
                >
                  {name}
                </span>
                {i < arr.length - 1 && <ArrowRight className="w-3 h-3" style={{ color: "#d1d5db" }} />}
              </span>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => onNavigate("planner")}
        >
          View Workflow <ChevronRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
