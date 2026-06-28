import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Info,
  BookOpen,
  Star,
  Shield,
  Lightbulb,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Target,
} from "lucide-react";
import { Button } from "./ui/button";
import type { DecisionContext, Page } from "../App";

interface RecommendationCenterProps {
  context: DecisionContext;
  onApprove: () => void;
  onNavigate: (page: Page) => void;
}

const alternatives = [
  {
    rank: 2,
    action: "Offer a 12-Month Price Lock with Enhanced SLA",
    confidence: 74,
    rationale: "Addresses CFO pricing concern while retaining customer",
  },
  {
    rank: 3,
    action: "Initiate Executive Sponsor Alignment Meeting",
    confidence: 68,
    rationale: "Engage VP-level relationship to bypass procurement friction",
  },
  {
    rank: 4,
    action: "Deploy Customer Success Playbook: At-Risk Account",
    confidence: 61,
    rationale: "Structured intervention with defined escalation milestones",
  },
];

const evidenceSources = [
  { source: "CRM: Acme Corp Account History", type: "CRM", relevance: 94 },
  { source: "Contract Renewal Playbook v3.2", type: "Knowledge Base", relevance: 89 },
  { source: "Q2 2026 Renewal Success Patterns", type: "Analytics", relevance: 86 },
  { source: "Acme Corp — QBR Transcript (May 2026)", type: "Memory", relevance: 82 },
  { source: "Competitor Displacement Strategy Guide", type: "Knowledge Base", relevance: 78 },
];

export function RecommendationCenter({ context, onApprove, onNavigate }: RecommendationCenterProps) {
  const [showExplain, setShowExplain] = useState(false);
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);

  const handleApprove = () => {
    setApproved(true);
    setTimeout(onApprove, 1200);
  };

  if (approved) {
    return (
      <div className="p-6 max-w-3xl mx-auto flex flex-col items-center justify-center" style={{ minHeight: 400 }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#f0fdf4" }}>
          <CheckCircle className="w-8 h-8" style={{ color: "#059669" }} />
        </div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: "#111827" }}>
          Decision Approved
        </h2>
        <p className="text-sm text-center" style={{ color: "#6b7280", maxWidth: 360 }}>
          The recommendation has been approved and saved to Decision History. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-4" style={{ color: "#9ca3af" }}>
        <span>Dashboard</span>
        <ChevronRight className="w-3 h-3" />
        <span style={{ color: "#4f46e5" }}>Recommendation Center</span>
      </div>

      {/* Header with confidence */}
      <div
        className="rounded-xl border p-5 mb-5"
        style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: "#eef2ff", color: "#4f46e5" }}
              >
                DEC-2842
              </span>
              <span className="text-xs" style={{ color: "#9ca3af" }}>·</span>
              <span className="text-xs" style={{ color: "#9ca3af" }}>
                {context.customer} · Generated just now
              </span>
            </div>
            <h1 className="text-lg font-semibold mb-1" style={{ color: "#111827" }}>
              Recommendation for {context.customer}
            </h1>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              AI-generated next best action based on 36 retrieved records across 8 knowledge sources
            </p>
          </div>
          {/* Confidence gauge */}
          <div className="text-center ml-6">
            <div
              className="w-20 h-20 rounded-full flex flex-col items-center justify-center"
              style={{ background: "conic-gradient(#4f46e5 0% 88%, #e0e7ff 88% 100%)" }}
            >
              <div className="w-14 h-14 rounded-full bg-white flex flex-col items-center justify-center">
                <div className="text-xl font-bold" style={{ color: "#4f46e5" }}>88</div>
                <div className="text-xs" style={{ color: "#9ca3af" }}>%</div>
              </div>
            </div>
            <div className="text-xs font-medium mt-1.5" style={{ color: "#6b7280" }}>
              Confidence
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left: main recommendation */}
        <div className="col-span-2 space-y-4">
          {/* Next Best Action */}
          <div
            className="rounded-xl border p-5"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#eef2ff" }}>
                <Star className="w-4 h-4" style={{ color: "#4f46e5" }} />
              </div>
              <h2 className="font-semibold" style={{ color: "#111827" }}>
                Next Best Action
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ background: "#f0fdf4", color: "#059669" }}>
                Primary Recommendation
              </span>
            </div>
            <div
              className="rounded-lg p-4 mb-3"
              style={{ background: "#eef2ff", border: "1px solid #c7d2fe" }}
            >
              <p className="font-semibold" style={{ color: "#1e1b4b" }}>
                Schedule an Executive Business Review (EBR) with VP-level champions within 14 days, anchored on ROI evidence and competitive differentiation strategy.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Urgency", value: "High", color: "#dc2626", bg: "#fef2f2" },
                { label: "Timeline", value: "14 Days", color: "#d97706", bg: "#fffbeb" },
                { label: "Expected Outcome", value: "Renewal", color: "#059669", bg: "#f0fdf4" },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className="rounded-lg p-3 text-center" style={{ background: bg }}>
                  <div className="text-xs mb-1" style={{ color: "#9ca3af" }}>{label}</div>
                  <div className="font-semibold text-sm" style={{ color }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Impact */}
          <div
            className="rounded-xl border p-5"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4" style={{ color: "#059669" }} />
              <h2 className="font-semibold" style={{ color: "#111827" }}>
                Business Impact
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "ARR at Risk", value: "$245K", sub: "Contract renewal value", color: "#dc2626" },
                { label: "Renewal Probability", value: "+34%", sub: "If EBR completed", color: "#059669" },
                { label: "Decision Window", value: "67 days", sub: "Until contract expiry", color: "#d97706" },
              ].map(({ label, value, sub, color }) => (
                <div key={label} className="rounded-lg border p-3" style={{ borderColor: "#f3f4f6" }}>
                  <div className="text-xs mb-1" style={{ color: "#9ca3af" }}>{label}</div>
                  <div className="text-lg font-bold" style={{ color }}>{value}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities & Risks */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-xl border p-4"
              style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4" style={{ color: "#d97706" }} />
                <h3 className="font-semibold text-sm" style={{ color: "#111827" }}>
                  Opportunities
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  "Champion (Mike Torres) is strongly supportive",
                  "Platform NPS increased by 18 pts in Q2",
                  "Competitor pricing is 22% higher",
                  "3 new use cases identified post-QBR",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#059669" }} />
                    <span className="text-xs" style={{ color: "#374151" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="rounded-xl border p-4"
              style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" style={{ color: "#dc2626" }} />
                <h3 className="font-semibold text-sm" style={{ color: "#111827" }}>
                  Risks
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  "CFO (Lisa Chen) is questioning ROI value",
                  "Active Salesforce competitive evaluation",
                  "Budget cycle starts in 45 days",
                  "Secondary champion unknown or absent",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#dc2626" }} />
                    <span className="text-xs" style={{ color: "#374151" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Missing Information */}
          <div
            className="rounded-xl border p-4"
            style={{ background: "#fffbeb", borderColor: "#fde68a" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4" style={{ color: "#d97706" }} />
              <h3 className="font-semibold text-sm" style={{ color: "#92400e" }}>
                Missing Information
              </h3>
            </div>
            <div className="space-y-1.5">
              {[
                "CFO's specific budget authority limit is unknown",
                "Exact timeline of competitor evaluation stage",
                "Internal stakeholder influence map not current",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#d97706" }} />
                  <span className="text-xs" style={{ color: "#92400e" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alternative recommendations */}
          <div
            className="rounded-xl border p-4"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4" style={{ color: "#6b7280" }} />
              <h3 className="font-semibold text-sm" style={{ color: "#111827" }}>
                Alternative Actions
              </h3>
            </div>
            <div className="space-y-2">
              {alternatives.map((alt) => (
                <div
                  key={alt.rank}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: "#f9fafb", border: "1px solid #f3f4f6" }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                    style={{ background: "#e5e7eb", color: "#6b7280" }}
                  >
                    {alt.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium" style={{ color: "#111827" }}>
                      {alt.action}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                      {alt.rationale}
                    </div>
                  </div>
                  <div className="text-sm font-semibold flex-shrink-0" style={{ color: "#6b7280" }}>
                    {alt.confidence}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explainability panel */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              onClick={() => setShowExplain(!showExplain)}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: "#4f46e5" }} />
                <span className="font-semibold text-sm" style={{ color: "#111827" }}>
                  AI Reasoning & Explainability
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ background: "#eef2ff", color: "#4f46e5" }}
                >
                  Transparent AI
                </span>
              </div>
              {showExplain ? (
                <ChevronUp className="w-4 h-4" style={{ color: "#9ca3af" }} />
              ) : (
                <ChevronDown className="w-4 h-4" style={{ color: "#9ca3af" }} />
              )}
            </button>

            {showExplain && (
              <div className="border-t p-4 space-y-4" style={{ borderColor: "#f3f4f6" }}>
                {/* Why */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9ca3af" }}>
                    Why This Recommendation
                  </h4>
                  <p className="text-sm" style={{ color: "#374151", lineHeight: 1.7 }}>
                    The Planner Agent identified contract renewal urgency (67 days remaining) and churn risk signals from the most recent QBR transcript. The Analysis Agent cross-referenced these with 3 similar successful renewal patterns where EBR execution within 14 days correlated with 82% renewal closure. CFO resistance was flagged as the primary friction point, making executive alignment the highest-leverage action.
                  </p>
                </div>

                {/* Sources */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9ca3af" }}>
                    Knowledge Sources Used
                  </h4>
                  <div className="space-y-1.5">
                    {evidenceSources.map((src) => (
                      <div
                        key={src.source}
                        className="flex items-center justify-between p-2 rounded-lg"
                        style={{ background: "#f9fafb" }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{ background: "#e0e7ff", color: "#4f46e5" }}
                          >
                            {src.type}
                          </span>
                          <span className="text-xs" style={{ color: "#374151" }}>
                            {src.source}
                          </span>
                        </div>
                        <span className="text-xs font-medium" style={{ color: "#6b7280" }}>
                          {src.relevance}% relevance
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assumptions */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9ca3af" }}>
                    Assumptions Made
                  </h4>
                  <div className="space-y-1.5">
                    {[
                      "Customer champion remains in their current role",
                      "Competitor evaluation is in early stage",
                      "Budget approval process follows standard 30-day cycle",
                    ].map((assumption, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Shield className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#9ca3af" }} />
                        <span className="text-xs" style={{ color: "#6b7280" }}>{assumption}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confidence breakdown */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9ca3af" }}>
                    Confidence Breakdown
                  </h4>
                  <div className="space-y-2">
                    {[
                      { factor: "Data completeness", score: 82 },
                      { factor: "Historical pattern match", score: 91 },
                      { factor: "Risk assessment coverage", score: 88 },
                      { factor: "Alternative evaluation", score: 76 },
                    ].map(({ factor, score }) => (
                      <div key={factor}>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: "#6b7280" }}>{factor}</span>
                          <span style={{ color: "#374151" }}>{score}%</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: "#e5e7eb" }}>
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{ width: `${score}%`, background: score >= 85 ? "#059669" : "#d97706" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: actions + summary */}
        <div className="space-y-4">
          {/* Action buttons */}
          <div
            className="rounded-xl border p-4"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <h3 className="font-semibold text-sm mb-3" style={{ color: "#111827" }}>
              Manager Decision
            </h3>
            <div className="space-y-2">
              <Button
                className="w-full h-10 gap-2 text-sm"
                style={{ background: "#059669", color: "#ffffff" }}
                onClick={handleApprove}
                disabled={rejected}
              >
                <CheckCircle className="w-4 h-4" />
                Approve Recommendation
              </Button>
              <Button
                variant="outline"
                className="w-full h-10 gap-2 text-sm"
                onClick={() => onNavigate("new-decision")}
                disabled={rejected}
              >
                <RefreshCw className="w-4 h-4" />
                Request More Analysis
              </Button>
              <Button
                variant="outline"
                className="w-full h-10 gap-2 text-sm"
                style={rejected ? {} : { color: "#dc2626", borderColor: "#fca5a5" }}
                onClick={() => setRejected(true)}
                disabled={rejected}
              >
                <XCircle className="w-4 h-4" />
                {rejected ? "Rejected" : "Reject"}
              </Button>
            </div>
            {rejected && (
              <p className="text-xs mt-2 text-center" style={{ color: "#9ca3af" }}>
                Rejection recorded. You can start a new analysis.
              </p>
            )}
          </div>

          {/* AI Summary */}
          <div
            className="rounded-xl border p-4"
            style={{ background: "#f8f9fc", borderColor: "#e5e7eb" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4" style={{ color: "#4f46e5" }} />
              <h3 className="font-semibold text-sm" style={{ color: "#111827" }}>
                AI Reasoning Summary
              </h3>
            </div>
            <p className="text-xs" style={{ color: "#6b7280", lineHeight: 1.7 }}>
              Based on 6 agent analyses across 36 data points, the primary risk is CFO-level resistance within a competitive evaluation window. An Executive Business Review is the highest-leverage intervention, historically correlated with 82% renewal success in similar accounts. The 14-day timeline is critical to complete before competitor evaluation reaches decision stage.
            </p>
          </div>

          {/* Metadata */}
          <div
            className="rounded-xl border p-4"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <h3 className="font-semibold text-sm mb-3" style={{ color: "#111827" }}>
              Decision Metadata
            </h3>
            <div className="space-y-2">
              {[
                { label: "Decision ID", value: "DEC-2842" },
                { label: "Customer", value: context.customer },
                { label: "Generated", value: "Just now" },
                { label: "Agents Used", value: "6 agents" },
                { label: "Sources Queried", value: "8 sources" },
                { label: "Processing Time", value: "14.3s" },
                { label: "LLM", value: "Gemini 2.5 Flash" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span style={{ color: "#9ca3af" }}>{label}</span>
                  <span className="font-medium" style={{ color: "#374151" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
