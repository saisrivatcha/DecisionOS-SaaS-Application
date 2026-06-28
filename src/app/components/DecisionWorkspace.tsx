import { useState } from "react";
import {
  CheckCircle, XCircle, RefreshCw, ChevronRight,
  AlertTriangle, Info, ChevronDown, ChevronUp, ArrowRight,
} from "lucide-react";
import { Button } from "./ui/button";
import type { DecisionDraft, Page } from "../App";

const LIFECYCLE = ["Draft", "Submitted", "Analysis", "Review", "Approved", "Executed", "In Memory"] as const;

interface Strategy {
  id: string;
  title: string;
  description: string;
  probability: number;
  impact: string;
  risk: "Low" | "Medium" | "High";
  timeRequired: string;
  resources: string;
  recommended?: boolean;
  accent: string;
  bg: string;
}

function buildStrategies(context: string): Strategy[] {
  if (context === "Pricing") {
    return [
      { id: "s1", title: "Executive Alignment", description: "Request a VP-to-VP call to reframe value and resolve the pricing concern at the right level.", probability: 74, impact: "Preserves full ARR and builds executive relationship", risk: "Medium", timeRequired: "7–10 days", resources: "VP Sales + Account Executive", recommended: true, accent: "#4f46e5", bg: "#f0f0f8" },
      { id: "s2", title: "Restructured Offer", description: "Present a tiered package that reduces short-term cost while protecting long-term revenue.", probability: 61, impact: "10–15% discount, customer retained", risk: "Low", timeRequired: "3–5 days", resources: "Account Executive + Finance", accent: "#0284c7", bg: "#f0f9ff" },
      { id: "s3", title: "Hold Position", description: "Maintain pricing, send ROI evidence report, and allow the customer to complete their evaluation.", probability: 38, impact: "Full ARR or potential churn", risk: "High", timeRequired: "14+ days", resources: "Account Executive only", accent: "#6b6b80", bg: "#f7f7f9" },
    ];
  }
  if (context === "Upsell") {
    return [
      { id: "s1", title: "Expansion Proposal", description: "Present a formal expansion proposal to both requesting departments with a volume discount.", probability: 82, impact: "+$320K ARR potential", risk: "Low", timeRequired: "5–7 days", resources: "Account Executive + CS Manager", recommended: true, accent: "#059669", bg: "#f0fdf4" },
      { id: "s2", title: "90-Day Pilot", description: "Start with one department on a pilot before expanding to both.", probability: 69, impact: "+$140K ARR short-term", risk: "Low", timeRequired: "14 days", resources: "CS Manager", accent: "#0284c7", bg: "#f0f9ff" },
      { id: "s3", title: "Wait for QBR", description: "Address expansion during the upcoming Quarterly Business Review in 6 weeks.", probability: 45, impact: "Delayed revenue, risk of alternative tools", risk: "Medium", timeRequired: "6 weeks", resources: "None now", accent: "#6b6b80", bg: "#f7f7f9" },
    ];
  }
  // Default: Renewal / Complaint / other
  return [
    { id: "s1", title: "Executive Business Review", description: "Schedule an EBR with VP-level stakeholders to realign on value, address concerns, and confirm next steps.", probability: 88, impact: "Highest renewal probability, executive alignment", risk: "Low", timeRequired: "7–14 days", resources: "VP Sales + Account Executive", recommended: true, accent: "#4f46e5", bg: "#f0f0f8" },
    { id: "s2", title: "Renewal Incentive", description: "Offer a multi-year commitment with a modest discount and enhanced SLA guarantee.", probability: 71, impact: "Secures ARR with minor concession", risk: "Low", timeRequired: "3–5 days", resources: "Account Executive + Finance", accent: "#0284c7", bg: "#f0f9ff" },
    { id: "s3", title: "Wait and Monitor", description: "Allow the evaluation to continue while maintaining regular touchpoints with the champion.", probability: 34, impact: "Risk of losing to competitor", risk: "High", timeRequired: "14+ days", resources: "Account Executive check-ins only", accent: "#6b6b80", bg: "#f7f7f9" },
  ];
}

const riskColor = { Low: "#059669", Medium: "#b45309", High: "#dc2626" };
const riskBg    = { Low: "#f0fdf4", Medium: "#fffbeb", High: "#fef2f2" };

interface DecisionWorkspaceProps {
  draft: DecisionDraft | null;
  onApprove: () => void;
  onNavigate: (page: Page) => void;
  userRole?: "architect" | "contributor";
}

export function DecisionWorkspace({ draft, onApprove, onNavigate, userRole = "architect" }: DecisionWorkspaceProps) {
  const isArchitect = userRole === "architect";
  const [selected, setSelected]     = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [approved, setApproved]     = useState(false);
  const [extra, setExtra]           = useState("");

  const customer   = draft?.entity    ?? draft?.customer   ?? "Acme Corporation";
  const context    = draft?.entityType ?? draft?.context  ?? "Renewal";
  const notes      = draft?.notes    ?? "";
  const strategies = buildStrategies(context);

  const handleApprove = () => {
    if (!selected) return;
    setApproved(true);
    setTimeout(onApprove, 900);
  };

  if (approved) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "#f0fdf4" }}>
          <CheckCircle className="w-7 h-7" style={{ color: "#059669" }} />
        </div>
        <h2 className="text-lg font-semibold mb-2" style={{ color: "#1a1a2e" }}>Decision Recorded</h2>
        <p className="text-sm text-center" style={{ color: "#6b6b80", maxWidth: 300 }}>
          This decision has been saved to your Company Memory. Redirecting…
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* ── Main scroll area ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-2xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "#a0a0b0" }}>
            <button onClick={() => onNavigate(isArchitect ? "pending-reviews" : "my-submissions")} className="hover:underline">
              {isArchitect ? "Pending Reviews" : "My Submissions"}
            </button>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "#1a1a2e" }}>{customer} — {context}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "#1a1a2e" }}>{customer}</h1>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "#f0f0f8", color: "#4f46e5" }}>
              {context}
            </span>
            <span className="text-xs" style={{ color: "#a0a0b0" }}>· Decision Workspace · Just now</span>
          </div>

          {/* Decision lifecycle tracker */}
          <div className="rounded-2xl border p-4 mb-8" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a0a0b0" }}>
                Decision Lifecycle
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#fffbeb", color: "#b45309" }}>
                Step 4 of 7 — Awaiting Review
              </span>
            </div>
            <div className="flex items-center">
              {LIFECYCLE.map((step, i, arr) => {
                const isDone    = i < 3;   // Draft, Submitted, Analysis done
                const isCurrent = i === 3;  // Review is current
                return (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          background: isDone ? "#059669" : isCurrent ? "#4f46e5" : "#e8e8ed",
                          flexShrink: 0,
                        }}
                      >
                        {isDone
                          ? <CheckCircle className="w-3.5 h-3.5 text-white" />
                          : isCurrent
                          ? <span className="w-2 h-2 rounded-full bg-white" />
                          : null}
                      </div>
                      <span
                        className="text-center mt-1.5 leading-tight"
                        style={{
                          fontSize: 9,
                          color: isDone ? "#374151" : isCurrent ? "#4f46e5" : "#d1d1db",
                          fontWeight: isCurrent ? 600 : 400,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {step}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        className="h-px flex-shrink-0"
                        style={{ width: 12, background: isDone ? "#059669" : "#e8e8ed", marginBottom: 14 }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Context sections */}
          <div className="space-y-4 mb-8">

            {/* Customer overview */}
            <Section title="Customer Overview">
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: "ARR",         value: "$245,000" },
                  { label: "Contract End", value: "Aug 31, 2026" },
                  { label: "Days Left",   value: "67 days" },
                  { label: "NPS Score",   value: "48 (+18 vs Q1)" },
                  { label: "Tier",        value: "Enterprise" },
                  { label: "Customer Since", value: "March 2022" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl p-3" style={{ background: "#f7f7f9" }}>
                    <div className="text-xs mb-0.5" style={{ color: "#a0a0b0" }}>{label}</div>
                    <div className="text-sm font-medium" style={{ color: "#1a1a2e" }}>{value}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Situation summary */}
            {notes && (
              <Section title="Situation Summary">
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{notes}</p>
              </Section>
            )}

            {/* Stakeholders */}
            <Section title="Stakeholders">
              <div className="space-y-2">
                {[
                  { name: "Mike Torres", role: "VP of Engineering",  sentiment: "Champion",  color: "#059669", bg: "#f0fdf4" },
                  { name: "Lisa Chen",   role: "CFO",                sentiment: "Skeptical", color: "#b45309", bg: "#fffbeb" },
                  { name: "David Park",  role: "Procurement Manager", sentiment: "Neutral",   color: "#6b6b80", bg: "#f7f7f9" },
                ].map(({ name, role, sentiment, color, bg }) => (
                  <div key={name} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "#f7f7f9" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0" style={{ background: "#e0e0f0", color: "#4f46e5" }}>
                        {name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: "#1a1a2e" }}>{name}</div>
                        <div className="text-xs" style={{ color: "#a0a0b0" }}>{role}</div>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: bg, color }}>{sentiment}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Current Risks */}
            <Section title="Current Risks">
              <div className="space-y-2">
                {[
                  { text: "CFO has not approved the renewal budget",            level: "High" as const },
                  { text: "Active Salesforce evaluation — closes in 12 days",   level: "High" as const },
                  { text: "No identified secondary champion",                    level: "Medium" as const },
                  { text: "Budget cycle starts in 45 days",                     level: "Medium" as const },
                ].map(({ text, level }) => (
                  <div key={text} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f7f7f9" }}>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: riskColor[level] }} />
                    <span className="text-sm flex-1" style={{ color: "#374151" }}>{text}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: riskBg[level], color: riskColor[level] }}>{level}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Previous decisions */}
            <Section title="Previous Decisions">
              <div className="space-y-2">
                {[
                  { date: "Mar 2026", action: "Sent ROI report after QBR concerns",         outcome: "Customer NPS rose 18 points" },
                  { date: "Dec 2025", action: "Offered 90-day proof-of-concept extension",  outcome: "Converted to full contract" },
                  { date: "Sep 2025", action: "Escalated to VP after support delays",       outcome: "Resolved — customer satisfied" },
                ].map(({ date, action, outcome }) => (
                  <div key={date} className="p-3 rounded-xl" style={{ background: "#f7f7f9" }}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium" style={{ color: "#a0a0b0" }}>{date}</span>
                      <CheckCircle className="w-3 h-3" style={{ color: "#059669" }} />
                    </div>
                    <div className="text-sm font-medium" style={{ color: "#1a1a2e" }}>{action}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#6b6b80" }}>Outcome: {outcome}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Supporting evidence */}
            <Section title="Supporting Evidence">
              {[
                "CRM account history — 4 years, 98% on-time payments",
                "May 2026 QBR transcript — champion expressed strong renewal intent",
                "Q2 usage analytics — 94% platform adoption, above enterprise average",
                "3 comparable accounts renewed when EBR was offered in similar window",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#4f46e5" }} />
                  <span className="text-sm" style={{ color: "#374151" }}>{item}</span>
                </div>
              ))}
            </Section>

            {/* Open questions */}
            <Section title="Open Questions">
              {[
                "What is the CFO's exact budget authority limit?",
                "What stage is the Salesforce evaluation at?",
                "Who else has influence over the renewal decision?",
              ].map((q, i) => (
                <div key={i} className="flex items-start gap-2.5 py-1.5">
                  <span className="text-xs font-semibold mt-0.5 flex-shrink-0" style={{ color: "#a0a0b0" }}>Q{i + 1}</span>
                  <span className="text-sm" style={{ color: "#374151" }}>{q}</span>
                </div>
              ))}
            </Section>
          </div>

          {/* Suggested Strategies */}
          <div className="mb-6">
            <h2 className="font-semibold mb-1" style={{ color: "#1a1a2e" }}>Suggested Strategies</h2>
            <p className="text-sm mb-5" style={{ color: "#6b6b80" }}>
              Based on similar decisions in your company's history. Select one to approve.
            </p>
            <div className="space-y-3">
              {strategies.map((s) => {
                const isSelected = selected === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelected(isSelected ? null : s.id)}
                    className="w-full text-left rounded-2xl border-2 p-5 transition-all"
                    style={{ borderColor: isSelected ? s.accent : "#e8e8ed", background: isSelected ? s.bg : "#fff" }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold" style={{ color: "#1a1a2e" }}>{s.title}</h3>
                          {s.recommended && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: s.bg, color: s.accent }}>
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "#6b6b80" }}>{s.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold" style={{ color: s.accent }}>{s.probability}%</div>
                        <div className="text-xs" style={{ color: "#a0a0b0" }}>success probability</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Risk",      value: s.risk,         color: riskColor[s.risk], bg: riskBg[s.risk] },
                        { label: "Impact",    value: s.impact,       color: "#374151", bg: "#f7f7f9" },
                        { label: "Timeline",  value: s.timeRequired, color: "#374151", bg: "#f7f7f9" },
                        { label: "Resources", value: s.resources,    color: "#374151", bg: "#f7f7f9" },
                      ].map(({ label, value, color, bg }) => (
                        <div key={label} className="rounded-xl p-2.5" style={{ background: bg }}>
                          <div className="text-xs mb-0.5" style={{ color: "#a0a0b0" }}>{label}</div>
                          <div className="text-xs font-medium" style={{ color }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Analysis Confidence (collapsible) */}
          <div className="rounded-2xl border overflow-hidden mb-8" style={{ borderColor: "#e8e8ed" }}>
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" style={{ color: "#4f46e5" }} />
                <span className="font-medium text-sm" style={{ color: "#1a1a2e" }}>Analysis Confidence</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#f0f0f8", color: "#4f46e5" }}>78%</span>
              </div>
              {showAnalysis
                ? <ChevronUp className="w-4 h-4" style={{ color: "#a0a0b0" }} />
                : <ChevronDown className="w-4 h-4" style={{ color: "#a0a0b0" }} />}
            </button>

            {showAnalysis && (
              <div className="border-t" style={{ borderColor: "#f0f0f4", background: "#fafafa" }}>
                {/* Confidence score + evidence */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold" style={{ color: "#4f46e5" }}>78%</div>
                      <div className="text-xs" style={{ color: "#a0a0b0" }}>Confidence</div>
                    </div>
                    <div className="flex-1 h-2 rounded-full" style={{ background: "#e8e8ed" }}>
                      <div className="h-2 rounded-full" style={{ width: "78%", background: "#4f46e5" }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: "#a0a0b0" }}>
                        Evidence Used
                      </h4>
                      <div className="space-y-1.5">
                        {[
                          "Meeting notes",
                          "CRM history (4 years)",
                          "Support ticket history",
                          "Usage analytics (Q2)",
                          "Customer health score",
                          "3 similar past decisions",
                        ].map((e) => (
                          <div key={e} className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#059669" }} />
                            <span className="text-xs" style={{ color: "#374151" }}>{e}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: "#a0a0b0" }}>
                        Missing Information
                      </h4>
                      <div className="space-y-1.5 mb-3">
                        {[
                          "Budget approval authority",
                          "Competitor pricing details",
                          "Legal review status",
                          "Internal stakeholder map",
                        ].map((m) => (
                          <div key={m} className="flex items-center gap-2">
                            <XCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#d1d1db" }} />
                            <span className="text-xs" style={{ color: "#9ca3af" }}>{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a0a0b0" }}>Assumptions</h4>
                    <div className="space-y-1">
                      {[
                        "Champion remains in current role through renewal",
                        "Competitor evaluation is in early stage (< 30%)",
                        "Budget cycle follows standard 30-day approval",
                      ].map((a) => (
                        <div key={a} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#b0b0bb" }} />
                          <span className="text-xs" style={{ color: "#6b6b80" }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload more context */}
                  <div className="pt-3 border-t" style={{ borderColor: "#ebebef" }}>
                    <p className="text-xs font-medium mb-1" style={{ color: "#374151" }}>
                      Upload missing information to improve confidence
                    </p>
                    <p className="text-xs mb-2" style={{ color: "#6b6b80" }}>
                      Adding budget emails or competitor details can raise confidence to ~92% and refine strategies.
                    </p>
                    <div className="flex gap-2">
                      <textarea
                        className="flex-1 rounded-xl border text-xs px-3 py-2 outline-none resize-none"
                        style={{ borderColor: "#e8e8ed", color: "#374151", minHeight: 56, background: "#fff" }}
                        placeholder="Paste budget emails, stakeholder notes, competitor pricing…"
                        value={extra}
                        onChange={(e) => setExtra(e.target.value)}
                      />
                      <Button size="sm" className="flex-shrink-0 gap-1.5 h-8 self-end text-xs" style={{ background: "#4f46e5", color: "#fff" }}>
                        <RefreshCw className="w-3 h-3" /> Refresh
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Right sidebar ── */}
      <div
        className="w-68 flex-shrink-0 border-l overflow-y-auto p-5"
        style={{ width: 264, background: "#fff", borderColor: "#e8e8ed" }}
      >
        <h3 className="font-semibold mb-1" style={{ color: "#1a1a2e" }}>
          {isArchitect ? "Your Decision" : "Decision Status"}
        </h3>
        <p className="text-xs mb-5" style={{ color: "#6b6b80" }}>
          {isArchitect
            ? "Select a strategy, then approve to record this decision."
            : "This decision has been submitted and is awaiting architect review."}
        </p>

        {/* Selected preview */}
        {selected ? (
          (() => {
            const s = strategies.find((x) => x.id === selected)!;
            return (
              <div className="rounded-xl p-4 mb-4" style={{ background: s.bg, border: `1px solid ${s.accent}33` }}>
                <div className="text-xs mb-0.5" style={{ color: "#a0a0b0" }}>Selected</div>
                <div className="font-semibold text-sm" style={{ color: "#1a1a2e" }}>{s.title}</div>
                <div className="text-xs mt-1 font-medium" style={{ color: s.accent }}>{s.probability}% success probability</div>
              </div>
            );
          })()
        ) : (
          <div className="rounded-xl p-4 mb-4 text-center" style={{ background: "#f7f7f9", border: "1px dashed #d1d1db" }}>
            <span className="text-xs" style={{ color: "#a0a0b0" }}>Select a strategy above</span>
          </div>
        )}

        <div className="space-y-2 mb-6">
          {isArchitect ? (
            <>
              <Button
                className="w-full h-11 gap-2"
                disabled={!selected}
                onClick={handleApprove}
                style={selected ? { background: "#1a1a2e", color: "#fff" } : {}}
              >
                <CheckCircle className="w-4 h-4" />
                Approve & Record
              </Button>
              <Button variant="outline" className="w-full h-10 gap-2 text-sm">
                <RefreshCw className="w-3.5 h-3.5" /> Request More Context
              </Button>
              <Button variant="outline" className="w-full h-10 gap-2 text-sm" style={{ color: "#dc2626", borderColor: "#fca5a5" }}>
                <XCircle className="w-3.5 h-3.5" /> Reject
              </Button>
            </>
          ) : (
            <>
              <div className="rounded-xl p-3 flex items-center gap-2" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
                <span className="text-xs" style={{ color: "#92400e" }}>
                  ⏳ Submitted — awaiting Decision Architect review
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full h-10 gap-2 text-sm"
                onClick={() => onNavigate("my-submissions")}
              >
                Back to My Submissions
              </Button>
            </>
          )}
        </div>

        <div className="space-y-2.5 pt-4 border-t" style={{ borderColor: "#f0f0f4" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a0a0b0" }}>Details</p>
          {[
            { label: "Customer", value: customer },
            { label: "Context",  value: context },
            { label: "Created",  value: "Just now" },
            { label: "Priority", value: "High" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-xs">
              <span style={{ color: "#a0a0b0" }}>{label}</span>
              <span className="font-medium" style={{ color: "#374151" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#a0a0b0" }}>{title}</h3>
      {children}
    </div>
  );
}
