import { useState } from "react";
import {
  Settings,
  Bot,
  BookOpen,
  Shield,
  Network,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Save,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

type AdminTab = "agents" | "rules" | "knowledge" | "approval" | "workflows";

const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "agents", label: "AI Agents", icon: Bot },
  { id: "rules", label: "Business Rules", icon: Settings },
  { id: "knowledge", label: "Knowledge Sources", icon: BookOpen },
  { id: "approval", label: "Approval Policies", icon: Shield },
  { id: "workflows", label: "Enterprise Workflows", icon: Network },
];

const agentConfig = [
  {
    name: "Planner Agent",
    model: "Gemini 2.5 Flash",
    enabled: true,
    maxTokens: 8192,
    temperature: 0.3,
    description: "Orchestrator agent for creating execution plans",
  },
  {
    name: "Retrieval Agent",
    model: "Gemini 2.5 Flash",
    enabled: true,
    maxTokens: 4096,
    temperature: 0.1,
    description: "Semantic retrieval from ChromaDB and CRM",
  },
  {
    name: "Memory Agent",
    model: "Gemini 2.5 Flash",
    enabled: true,
    maxTokens: 4096,
    temperature: 0.1,
    description: "Persistent customer memory management",
  },
  {
    name: "Analysis Agent",
    model: "Gemini 2.5 Flash",
    enabled: true,
    maxTokens: 8192,
    temperature: 0.4,
    description: "Multi-source reasoning and risk evaluation",
  },
  {
    name: "Recommendation Agent",
    model: "Gemini 2.5 Flash",
    enabled: true,
    maxTokens: 4096,
    temperature: 0.5,
    description: "NBA generation with confidence scoring",
  },
  {
    name: "Explanation Agent",
    model: "Gemini 2.5 Flash",
    enabled: true,
    maxTokens: 6144,
    temperature: 0.2,
    description: "Explainability and evidence documentation",
  },
];

const businessRules = [
  { id: 1, name: "High-Value Account Threshold", value: "> $100K ARR", active: true, category: "Segmentation" },
  { id: 2, name: "At-Risk Churn Signal", value: "NPS < 30 OR usage drop > 40%", active: true, category: "Risk" },
  { id: 3, name: "Renewal Window Alert", value: "Contract expiry < 90 days", active: true, category: "Triggers" },
  { id: 4, name: "EBR Auto-Trigger", value: "ARR > $200K AND last EBR > 6 months", active: false, category: "Automation" },
  { id: 5, name: "Competitor Flag", value: "Evaluation mention in transcript", active: true, category: "Risk" },
  { id: 6, name: "Upsell Signal", value: "Usage > 85% capacity for 30 days", active: true, category: "Opportunity" },
];

const approvalPolicies = [
  { name: "Standard Decision", description: "All recommendations under $50K ARR", approvers: "Sales Manager", sla: "24 hours", auto: false },
  { name: "High-Value Decision", description: "Recommendations for accounts > $100K ARR", approvers: "VP Sales + CS Director", sla: "4 hours", auto: false },
  { name: "Auto-Approve", description: "Confidence ≥ 95% and low-risk classification", approvers: "AI Supervised", sla: "Instant", auto: true },
  { name: "Escalation Required", description: "Competitor evaluation active + renewal < 30 days", approvers: "Executive Team", sla: "1 hour", auto: false },
];

const workflows = [
  { name: "Standard NBA Workflow", steps: 7, avgTime: "4.2m", active: true, runs: 312 },
  { name: "Fast-Track Renewal", steps: 5, avgTime: "2.8m", active: true, runs: 48 },
  { name: "Churn Prevention Workflow", steps: 8, avgTime: "6.1m", active: true, runs: 24 },
  { name: "Upsell Analysis Workflow", steps: 6, avgTime: "3.5m", active: false, runs: 16 },
];

export function AdminConsole() {
  const [activeTab, setActiveTab] = useState<AdminTab>("agents");
  const [agentStates, setAgentStates] = useState(agentConfig.map((a) => ({ ...a })));
  const [ruleStates, setRuleStates] = useState(businessRules.map((r) => ({ ...r })));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "#9ca3af" }}>
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "#4f46e5" }}>Admin Settings</span>
          </div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>
            Admin Console
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            Configure agents, business rules, approval policies, and enterprise workflows
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
            style={{ background: "#fffbeb", border: "1px solid #fde68a" }}
          >
            <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#d97706" }} />
            <span style={{ color: "#92400e" }}>Changes require system restart</span>
          </div>
          <Button
            onClick={handleSave}
            className="gap-2"
            style={{ background: saved ? "#059669" : "#4f46e5", color: "#ffffff" }}
          >
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl mb-6"
        style={{ background: "#f3f4f6", width: "fit-content" }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              )}
              style={
                activeTab === tab.id
                  ? { background: "#ffffff", color: "#111827", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
                  : { color: "#6b7280" }
              }
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "agents" && (
        <div className="space-y-3">
          {agentStates.map((agent, i) => (
            <div
              key={agent.name}
              className="rounded-xl border p-5"
              style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold" style={{ color: "#111827" }}>
                      {agent.name}
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ background: "#eef2ff", color: "#4f46e5" }}
                    >
                      {agent.model}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "#6b7280" }}>
                    {agent.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-6">
                  <span className="text-xs" style={{ color: "#9ca3af" }}>
                    {agent.enabled ? "Enabled" : "Disabled"}
                  </span>
                  <button
                    onClick={() =>
                      setAgentStates((prev) =>
                        prev.map((a, idx) => idx === i ? { ...a, enabled: !a.enabled } : a)
                      )
                    }
                  >
                    {agent.enabled ? (
                      <ToggleRight className="w-8 h-8" style={{ color: "#4f46e5" }} />
                    ) : (
                      <ToggleLeft className="w-8 h-8" style={{ color: "#d1d5db" }} />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "#6b7280" }}>
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    defaultValue={agent.maxTokens}
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                    style={{ borderColor: "#e5e7eb", color: "#111827" }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "#6b7280" }}>
                    Temperature
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    defaultValue={agent.temperature}
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                    style={{ borderColor: "#e5e7eb", color: "#111827" }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "#6b7280" }}>
                    LLM Model
                  </label>
                  <select
                    defaultValue={agent.model}
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                    style={{ borderColor: "#e5e7eb", color: "#111827" }}
                  >
                    <option>Gemini 2.5 Flash</option>
                    <option>Gemini 2.5 Pro</option>
                    <option>GPT-4o</option>
                    <option>Claude Sonnet 4</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "rules" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: "#6b7280" }}>
              Business rules used to classify and prioritize decisions
            </p>
            <Button size="sm" className="gap-2" style={{ background: "#4f46e5", color: "#ffffff" }}>
              <Plus className="w-3.5 h-3.5" />
              Add Rule
            </Button>
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
            <div
              className="grid grid-cols-5 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide border-b"
              style={{ color: "#9ca3af", background: "#f9fafb", borderColor: "#f3f4f6" }}
            >
              <div className="col-span-2">Rule Name</div>
              <div>Condition</div>
              <div>Category</div>
              <div>Status</div>
            </div>
            {ruleStates.map((rule, i) => (
              <div
                key={rule.id}
                className="grid grid-cols-5 gap-4 px-5 py-4 items-center border-b last:border-0 hover:bg-gray-50"
                style={{ borderColor: "#f9fafb" }}
              >
                <div className="col-span-2">
                  <div className="font-medium text-sm" style={{ color: "#111827" }}>
                    {rule.name}
                  </div>
                </div>
                <div>
                  <code
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ background: "#f3f4f6", color: "#374151" }}
                  >
                    {rule.value}
                  </code>
                </div>
                <div>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ background: "#eef2ff", color: "#4f46e5" }}
                  >
                    {rule.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setRuleStates((prev) =>
                        prev.map((r, idx) => idx === i ? { ...r, active: !r.active } : r)
                      )
                    }
                  >
                    {rule.active ? (
                      <ToggleRight className="w-7 h-7" style={{ color: "#4f46e5" }} />
                    ) : (
                      <ToggleLeft className="w-7 h-7" style={{ color: "#d1d5db" }} />
                    )}
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
                  </button>
                  <button className="p-1 hover:bg-red-50 rounded">
                    <Trash2 className="w-3.5 h-3.5" style={{ color: "#dc2626" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "approval" && (
        <div className="space-y-3">
          {approvalPolicies.map((policy) => (
            <div
              key={policy.name}
              className="rounded-xl border p-5 flex items-start justify-between"
              style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold" style={{ color: "#111827" }}>
                    {policy.name}
                  </h3>
                  {policy.auto && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "#eef2ff", color: "#4f46e5" }}
                    >
                      Auto-approve
                    </span>
                  )}
                </div>
                <p className="text-sm" style={{ color: "#6b7280" }}>
                  {policy.description}
                </p>
              </div>
              <div className="ml-6 flex gap-6 text-right">
                <div>
                  <div className="text-xs mb-0.5" style={{ color: "#9ca3af" }}>Approvers</div>
                  <div className="text-sm font-medium" style={{ color: "#374151" }}>{policy.approvers}</div>
                </div>
                <div>
                  <div className="text-xs mb-0.5" style={{ color: "#9ca3af" }}>SLA</div>
                  <div className="text-sm font-medium" style={{ color: "#374151" }}>{policy.sla}</div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg self-start">
                  <Edit className="w-4 h-4" style={{ color: "#9ca3af" }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "workflows" && (
        <div className="space-y-3">
          {workflows.map((wf) => (
            <div
              key={wf.name}
              className="rounded-xl border p-5 flex items-center justify-between"
              style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold" style={{ color: "#111827" }}>
                    {wf.name}
                  </h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={
                      wf.active
                        ? { background: "#f0fdf4", color: "#059669" }
                        : { background: "#f3f4f6", color: "#9ca3af" }
                    }
                  >
                    {wf.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: "#9ca3af" }}>
                  <span>{wf.steps} steps</span>
                  <span>·</span>
                  <span>Avg {wf.avgTime}</span>
                  <span>·</span>
                  <span>{wf.runs} total runs</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Edit Workflow</Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Network className="w-3.5 h-3.5" />
                  View Graph
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "knowledge" && (
        <div className="space-y-4">
          <div
            className="rounded-xl border p-5"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <h3 className="font-semibold mb-4" style={{ color: "#111827" }}>
              Vector Database Configuration
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Vector DB", value: "ChromaDB", type: "select" },
                { label: "Embedding Model", value: "text-embedding-004", type: "select" },
                { label: "Collection Name", value: "decision_os_kb", type: "text" },
                { label: "Max Results (k)", value: "20", type: "number" },
                { label: "Similarity Threshold", value: "0.75", type: "number" },
                { label: "Chunking Strategy", value: "Semantic", type: "select" },
              ].map(({ label, value, type }) => (
                <div key={label}>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "#6b7280" }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    defaultValue={value}
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                    style={{ borderColor: "#e5e7eb", color: "#111827" }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl border p-5"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <h3 className="font-semibold mb-4" style={{ color: "#111827" }}>
              Agent Permissions Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <th className="text-left py-2 px-3" style={{ color: "#9ca3af" }}>Agent</th>
                    {["CRM Read", "CRM Write", "KB Read", "KB Write", "Memory R/W", "External API"].map((h) => (
                      <th key={h} className="text-center py-2 px-3" style={{ color: "#9ca3af" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Planner", perms: [false, false, true, false, true, false] },
                    { name: "Retrieval", perms: [true, false, true, false, false, true] },
                    { name: "Memory", perms: [true, false, false, false, true, false] },
                    { name: "Analysis", perms: [false, false, true, false, true, false] },
                    { name: "Recommendation", perms: [false, false, false, false, true, false] },
                    { name: "Explanation", perms: [false, false, true, false, false, false] },
                  ].map((row) => (
                    <tr key={row.name} className="hover:bg-gray-50" style={{ borderBottom: "1px solid #f9fafb" }}>
                      <td className="py-2.5 px-3 font-medium" style={{ color: "#374151" }}>{row.name}</td>
                      {row.perms.map((p, i) => (
                        <td key={i} className="py-2.5 px-3 text-center">
                          {p ? (
                            <span style={{ color: "#059669" }}>✓</span>
                          ) : (
                            <span style={{ color: "#e5e7eb" }}>—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
