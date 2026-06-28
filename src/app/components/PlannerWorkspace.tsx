import { useState, useEffect } from "react";
import {
  CheckCircle,
  Circle,
  Loader,
  Network,
  Clock,
  ChevronRight,
  Sparkles,
  FileSearch,
  Database,
  BookOpen,
  Brain,
  Star,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import type { DecisionContext, Page } from "../App";

type StepStatus = "pending" | "running" | "complete";

interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  agent: string;
  duration: number; // ms
  detail: string;
}

const steps: WorkflowStep[] = [
  {
    id: "plan",
    label: "Planner Agent",
    description: "Creating execution plan from input context",
    icon: Network,
    agent: "Planner",
    duration: 1800,
    detail: "Analyzing input, identifying knowledge gaps, sequencing agent tasks",
  },
  {
    id: "retrieve",
    label: "Retrieve Customer History",
    description: "Fetching CRM data and past interactions",
    icon: FileSearch,
    agent: "Retrieval Agent",
    duration: 2200,
    detail: "Querying CRM, fetching 24 past records, loading interaction timeline",
  },
  {
    id: "memory",
    label: "Memory Agent",
    description: "Recalling past recommendations and outcomes",
    icon: Brain,
    agent: "Memory Agent",
    duration: 1500,
    detail: "Retrieving 6 past decisions, 3 approved recommendations, learned preferences",
  },
  {
    id: "knowledge",
    label: "Retrieve Knowledge Base",
    description: "Searching enterprise knowledge sources",
    icon: BookOpen,
    agent: "Retrieval Agent",
    duration: 2000,
    detail: "Searching 12,400 documents across 8 sources, ChromaDB vector retrieval",
  },
  {
    id: "analyze",
    label: "Analyze Business Context",
    description: "Evaluating risks, opportunities, and strategy",
    icon: Database,
    agent: "Analysis Agent",
    duration: 2800,
    detail: "Reasoning across retrieved context, scoring risk factors, modeling outcomes",
  },
  {
    id: "recommend",
    label: "Generate Recommendation",
    description: "Synthesizing next best action with confidence score",
    icon: Star,
    agent: "Recommendation Agent",
    duration: 2400,
    detail: "Generating primary recommendation, 3 alternatives, business impact assessment",
  },
  {
    id: "explain",
    label: "Build Explainability Report",
    description: "Documenting reasoning, sources, and assumptions",
    icon: Sparkles,
    agent: "Explanation Agent",
    duration: 1600,
    detail: "Constructing evidence trail, source citations, confidence breakdown",
  },
  {
    id: "review",
    label: "Human Review",
    description: "Awaiting manager approval",
    icon: User,
    agent: "Human",
    duration: 0,
    detail: "Decision ready for review — approve, reject, or request more analysis",
  },
];

interface PlannerWorkspaceProps {
  context: DecisionContext;
  onNavigate: (page: Page) => void;
}

export function PlannerWorkspace({ context, onNavigate }: PlannerWorkspaceProps) {
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>(
    Object.fromEntries(steps.map((s) => [s.id, "pending"]))
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [elapsedTimes, setElapsedTimes] = useState<Record<string, number>>({});
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let totalMs = 0;

    const run = async () => {
      const agentSteps = steps.filter((s) => s.id !== "review");

      for (let i = 0; i < agentSteps.length; i++) {
        if (cancelled) return;
        const step = agentSteps[i];

        setCurrentStepIndex(i);
        setStepStatuses((prev) => ({ ...prev, [step.id]: "running" }));

        const startTime = Date.now();
        const tickInterval = setInterval(() => {
          if (!cancelled) {
            setElapsedTimes((prev) => ({
              ...prev,
              [step.id]: Math.floor((Date.now() - startTime) / 100) / 10,
            }));
            setTotalElapsed(Math.floor((Date.now() - startTime + totalMs) / 100) / 10);
            setProgress(Math.min(((i + (Date.now() - startTime) / step.duration) / agentSteps.length) * 100, 100));
          }
        }, 100);

        await new Promise((res) => setTimeout(res, step.duration));
        clearInterval(tickInterval);

        if (!cancelled) {
          totalMs += step.duration;
          setElapsedTimes((prev) => ({ ...prev, [step.id]: step.duration / 1000 }));
          setStepStatuses((prev) => ({ ...prev, [step.id]: "complete" }));
        }
      }

      if (!cancelled) {
        setStepStatuses((prev) => ({ ...prev, review: "running" }));
        setCurrentStepIndex(agentSteps.length);
        setProgress(100);
        setDone(true);
      }
    };

    const timeout = setTimeout(run, 400);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  const completedCount = Object.values(stepStatuses).filter((s) => s === "complete").length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "#9ca3af" }}>
          <span>Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span>New Decision</span>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: "#4f46e5" }}>Planner Workspace</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>
              Planner Workspace
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              AI agents are orchestrating a decision analysis for{" "}
              <span className="font-medium" style={{ color: "#111827" }}>
                {context.customer}
              </span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: "#9ca3af" }}>
              Overall Progress
            </div>
            <div className="text-2xl font-semibold" style={{ color: "#4f46e5" }}>
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <Progress value={progress} className="h-1.5" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs" style={{ color: "#9ca3af" }}>
              {completedCount} of {steps.length - 1} agent tasks complete
            </span>
            <span className="text-xs" style={{ color: "#9ca3af" }}>
              {totalElapsed > 0 ? `${totalElapsed}s elapsed` : "Starting..."}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Workflow steps */}
        <div className="col-span-2">
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <div className="px-5 py-3.5 border-b" style={{ borderColor: "#f3f4f6" }}>
              <h3 className="font-semibold text-sm" style={{ color: "#111827" }}>
                Execution Plan
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                LangGraph-orchestrated multi-agent workflow
              </p>
            </div>
            <div className="p-4 space-y-1">
              {steps.map((step, idx) => {
                const status = stepStatuses[step.id];
                const Icon = step.icon;
                const elapsed = elapsedTimes[step.id];
                const isLast = idx === steps.length - 1;

                return (
                  <div key={step.id} className="flex gap-3">
                    {/* Connector line + icon */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-500"
                        style={
                          status === "complete"
                            ? { background: "#059669", border: "2px solid #059669" }
                            : status === "running"
                            ? { background: "#4f46e5", border: "2px solid #4f46e5" }
                            : { background: "#f9fafb", border: "2px solid #e5e7eb" }
                        }
                      >
                        {status === "complete" ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : status === "running" ? (
                          <Loader className="w-4 h-4 text-white animate-spin" />
                        ) : (
                          <Icon className="w-4 h-4" style={{ color: "#d1d5db" }} />
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className="w-0.5 mt-1 mb-1 transition-all duration-500"
                          style={{
                            height: 28,
                            background: status === "complete" ? "#059669" : "#e5e7eb",
                          }}
                        />
                      )}
                    </div>

                    {/* Step content */}
                    <div
                      className={`flex-1 mb-1 rounded-lg p-3 transition-all duration-300 ${isLast ? "mb-0" : ""}`}
                      style={
                        status === "running"
                          ? { background: "#eef2ff", border: "1px solid #c7d2fe" }
                          : status === "complete"
                          ? { background: "#f0fdf4", border: "1px solid #bbf7d0" }
                          : { background: "#f9fafb", border: "1px solid #f3f4f6" }
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-medium"
                            style={{
                              color:
                                status === "running"
                                  ? "#4f46e5"
                                  : status === "complete"
                                  ? "#059669"
                                  : "#9ca3af",
                            }}
                          >
                            {step.label}
                          </span>
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={
                              step.id === "review"
                                ? { background: "#f3f4f6", color: "#9ca3af" }
                                : { background: "#e0e7ff", color: "#4f46e5" }
                            }
                          >
                            {step.agent}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {status === "running" && (
                            <span className="text-xs animate-pulse" style={{ color: "#4f46e5" }}>
                              {elapsed?.toFixed(1) || "0.0"}s
                            </span>
                          )}
                          {status === "complete" && elapsed && (
                            <span className="text-xs" style={{ color: "#6b7280" }}>
                              {elapsed.toFixed(1)}s
                            </span>
                          )}
                          {status === "complete" && (
                            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#dcfce7", color: "#059669" }}>
                              Done
                            </span>
                          )}
                        </div>
                      </div>
                      {(status === "running" || status === "complete") && (
                        <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
                          {status === "running" ? step.description : step.detail}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {done && (
            <div className="mt-4 flex gap-3">
              <Button
                className="gap-2"
                style={{ background: "#4f46e5", color: "#ffffff" }}
                onClick={() => onNavigate("recommendation")}
              >
                <Sparkles className="w-4 h-4" />
                View Recommendation
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => onNavigate("agents")}
              >
                View Agent Details
              </Button>
            </div>
          )}
        </div>

        {/* Right: context & stats */}
        <div className="space-y-4">
          {/* Decision context */}
          <div
            className="rounded-xl border p-4"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#9ca3af" }}>
              Decision Context
            </p>
            <div className="space-y-2.5">
              {[
                { label: "Customer", value: context.customer },
                { label: "Input Type", value: context.inputType === "transcript" ? "Meeting Transcript" : context.inputType === "email" ? "Email Thread" : context.inputType === "crm" ? "CRM Notes" : "Free Text" },
                { label: "Priority", value: "High" },
                { label: "Context", value: "Contract Renewal" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span style={{ color: "#9ca3af" }}>{label}</span>
                  <span className="font-medium" style={{ color: "#111827" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live stats */}
          <div
            className="rounded-xl border p-4"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#9ca3af" }}>
              Live Stats
            </p>
            <div className="space-y-3">
              {[
                { label: "Agents Active", value: stepStatuses.plan === "running" || stepStatuses.retrieve === "running" ? "2" : "1" },
                { label: "Documents Retrieved", value: completedCount >= 3 ? "36" : completedCount >= 2 ? "24" : "0" },
                { label: "Knowledge Sources", value: completedCount >= 4 ? "8" : "0" },
                { label: "Memory Records", value: completedCount >= 2 ? "6" : "0" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: "#6b7280" }}>{label}</span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: value === "0" ? "#d1d5db" : "#4f46e5" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Agents used */}
          <div
            className="rounded-xl border p-4"
            style={{ background: "#f8f9fc", borderColor: "#e5e7eb" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#9ca3af" }}>
              Agent Orchestra
            </p>
            {["Planner", "Retrieval", "Memory", "Analysis", "Recommendation", "Explanation"].map((agent, i) => {
              const isComplete = completedCount > i;
              const isRunning = currentStepIndex === i;
              return (
                <div key={agent} className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${isRunning ? "animate-pulse" : ""}`}
                    style={{ background: isComplete ? "#059669" : isRunning ? "#4f46e5" : "#d1d5db" }}
                  />
                  <span className="text-xs flex-1" style={{ color: "#6b7280" }}>
                    {agent}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: isComplete ? "#059669" : isRunning ? "#4f46e5" : "#d1d5db" }}
                  >
                    {isComplete ? "Done" : isRunning ? "Running" : "Queued"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
