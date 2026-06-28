import { useState } from "react";
import {
  CheckCircle, XCircle, ChevronRight, Clock, AlertTriangle,
  Eye, MessageSquare,
} from "lucide-react";
import { Button } from "./ui/button";
import type { SharedDecision, DecisionDraft } from "../App";
import { DEMO_SCENARIOS } from "../lib/mockScenarios";

const contextColors: Record<string, { bg: string; color: string }> = {
  Renewal:    { bg: "#f0f0f8", color: "#4f46e5" },
  Pricing:    { bg: "#fffbeb", color: "#b45309" },
  Complaint:  { bg: "#fef2f2", color: "#dc2626" },
  Upsell:     { bg: "#f0fdf4", color: "#059669" },
  Discussion: { bg: "#f7f7f9", color: "#6b6b80" },
};

const priorityLabel = (d: SharedDecision) => {
  if (d.status === "in-review") return { label: "In Review", color: "#4f46e5", bg: "#f0f0f8" };
  return { label: "New Submission", color: "#b45309", bg: "#fffbeb" };
};

interface PendingReviewsProps {
  decisions: SharedDecision[];
  onApprove: (id: string, strategy: string) => void;
  onReject: (id: string, note: string) => void;
  onOpenWorkspace: (draft: DecisionDraft) => void;
}

export function PendingReviews({ decisions, onApprove, onReject, onOpenWorkspace }: PendingReviewsProps) {
  const [expanded, setExpanded]       = useState<string | null>(decisions[0]?.id ?? null);
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote]   = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState<Record<string, string>>({});
  const [customStrategy, setCustomStrategy]     = useState<Record<string, string>>({});

  const handleApprove = (id: string) => {
    const strategy = customStrategy[id] || selectedStrategy[id] || "Strategy approved";
    onApprove(id, strategy);
    setApprovedIds((p) => [...p, id]);
    setExpanded(null);
  };

  const handleConfirmReject = (id: string) => {
    onReject(id, rejectNote || "Needs more context before approval.");
    setRejectingId(null);
    setRejectNote("");
  };

  if (decisions.length === 0 && approvedIds.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <CheckCircle className="w-14 h-14 mb-4" style={{ color: "#059669" }} />
        <h2 className="text-xl font-semibold mb-2" style={{ color: "#1a1a2e" }}>All caught up!</h2>
        <p className="text-sm" style={{ color: "#6b6b80" }}>No pending reviews. Check back later.</p>
      </div>
    );
  }

  if (decisions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Clock className="w-12 h-12 mb-4" style={{ color: "#d1d1db" }} />
        <h2 className="text-lg font-semibold mb-2" style={{ color: "#1a1a2e" }}>No pending reviews</h2>
        <p className="text-sm" style={{ color: "#6b6b80" }}>Contributors haven't submitted anything yet.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left list */}
      <div
        className="flex flex-col border-r flex-shrink-0"
        style={{ width: 300, background: "#fff", borderColor: "#e8e8ed" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "#e8e8ed" }}>
          <h2 className="font-semibold" style={{ color: "#1a1a2e" }}>Pending Reviews</h2>
          <p className="text-xs mt-0.5" style={{ color: "#a0a0b0" }}>{decisions.length - approvedIds.length} awaiting your decision</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: "#f5f5f8" }}>
          {decisions.map((dec) => {
            const isApproved = approvedIds.includes(dec.id);
            const pl = priorityLabel(dec);
            const cc = contextColors[dec.context] ?? contextColors.Discussion;
            return (
              <button
                key={dec.id}
                onClick={() => !isApproved && setExpanded(expanded === dec.id ? null : dec.id)}
                className="w-full text-left px-4 py-4 transition-colors"
                style={{ background: expanded === dec.id ? "#f7f7fb" : "#fff", opacity: isApproved ? 0.5 : 1 }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono" style={{ color: "#a0a0b0" }}>{dec.id}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: cc.bg, color: cc.color }}>
                    {dec.context}
                  </span>
                </div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: "#1a1a2e" }}>{dec.customer}</p>
                <p className="text-xs mb-2 line-clamp-2" style={{ color: "#6b6b80", lineHeight: 1.5 }}>{dec.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#a0a0b0" }}>by {dec.submittedBy} · {dec.date}</span>
                  {isApproved
                    ? <span className="text-xs font-medium" style={{ color: "#059669" }}>Approved ✓</span>
                    : <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: pl.bg, color: pl.color }}>{pl.label}</span>
                  }
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right detail */}
      <div className="flex-1 overflow-y-auto" style={{ background: "#f7f7f9" }}>
        {expanded ? (() => {
          const dec = decisions.find((d) => d.id === expanded);
          if (!dec) return null;
          
          const scenario = DEMO_SCENARIOS.find(s => s.id === dec.scenarioId) ?? DEMO_SCENARIOS[0];
          const strategies = scenario.strategies.map(s => s.title);
          const isApproved = approvedIds.includes(dec.id);
          const isRejecting = rejectingId === dec.id;

          return (
            <div className="p-7 max-w-2xl">
              {/* Header */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono" style={{ color: "#a0a0b0" }}>{dec.id}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: (contextColors[dec.context] ?? contextColors.Discussion).bg, color: (contextColors[dec.context] ?? contextColors.Discussion).color }}>
                    {dec.context}
                  </span>
                  <span className="text-xs" style={{ color: "#a0a0b0" }}>· by {dec.submittedBy} · {dec.date}</span>
                </div>
                <h1 className="text-xl font-semibold mb-1" style={{ color: "#1a1a2e" }}>{dec.customer}</h1>
                <p className="text-sm leading-relaxed" style={{ color: "#6b6b80" }}>{dec.summary}</p>
              </div>

              {/* AI Analysis output */}
              <div className="space-y-4 mb-6">
                <AnalysisCard title="Business Summary">
                  <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                    {scenario.notes}
                  </p>
                </AnalysisCard>

                <AnalysisCard title="Possible Decision Identified">
                  <div className="rounded-xl p-4" style={{ background: "#f0f0f8", border: "1px solid #ddddf0" }}>
                    <p className="font-semibold" style={{ color: "#1a1a2e" }}>
                      {scenario.strategies[0]?.description ?? "Immediate executive engagement required."}
                    </p>
                  </div>
                </AnalysisCard>

                <div className="grid grid-cols-2 gap-4">
                  <AnalysisCard title="Evidence Used">
                    {scenario.evidence.slice(0, 4).map((e) => (
                      <div key={e} className="flex items-center gap-2 mb-1.5">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#059669" }} />
                        <span className="text-xs" style={{ color: "#374151" }}>{e}</span>
                      </div>
                    ))}
                    {scenario.evidence.length === 0 && (
                      <p className="text-xs" style={{ color: "#6b6b80" }}>No evidence explicitly attached.</p>
                    )}
                  </AnalysisCard>
                  <AnalysisCard title="Missing Information">
                    {scenario.questions.slice(0, 3).map((m) => (
                      <div key={m} className="flex items-center gap-2 mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#f59e0b" }} />
                        <span className="text-xs" style={{ color: "#374151" }}>{m}</span>
                      </div>
                    ))}
                    {scenario.questions.length === 0 && (
                      <p className="text-xs" style={{ color: "#6b6b80" }}>No missing information detected.</p>
                    )}
                  </AnalysisCard>
                </div>

                {/* Similar decisions */}
                <AnalysisCard title={`${scenario.history.length > 0 ? scenario.history.length : '3'} Similar Cases Found`}>
                  <div className="space-y-2">
                    {scenario.history.length > 0 ? scenario.history.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f7f7f9" }}>
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#059669" }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium" style={{ color: "#1a1a2e" }}>{c.action}</div>
                        </div>
                        <span className="text-xs font-semibold flex-shrink-0" style={{ color: "#059669" }}>{c.outcome}</span>
                      </div>
                    )) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f7f7f9" }}>
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#059669" }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium" style={{ color: "#1a1a2e" }}>Standard Process Executed</div>
                        </div>
                        <span className="text-xs font-semibold flex-shrink-0" style={{ color: "#059669" }}>Successful</span>
                      </div>
                    )}
                  </div>
                </AnalysisCard>
              </div>

              {/* Strategy selection + approve */}
              {!isApproved && !isRejecting && (
                <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
                  <h3 className="font-semibold mb-1" style={{ color: "#1a1a2e" }}>Select a strategy to approve</h3>
                  <p className="text-xs mb-4" style={{ color: "#a0a0b0" }}>Based on past outcomes, these are ranked by success probability.</p>
                  <div className="space-y-2 mb-4">
                    {strategies.map((s, i) => (
                      <label key={s} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer" style={{ background: selectedStrategy[dec.id] === s ? "#f0f0f8" : "#f7f7f9", border: `1px solid ${selectedStrategy[dec.id] === s ? "#c7d2fe" : "transparent"}` }}>
                        <input type="radio" name={`strategy-${dec.id}`} className="accent-indigo-600" checked={selectedStrategy[dec.id] === s} onChange={() => setSelectedStrategy((p) => ({ ...p, [dec.id]: s }))} />
                        <div className="flex-1">
                          <span className="text-sm font-medium" style={{ color: "#1a1a2e" }}>{s}</span>
                          {i === 0 && <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: "#eef2ff", color: "#4f46e5" }}>Recommended</span>}
                        </div>
                      </label>
                    ))}
                    <div>
                      <input
                        className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none mt-1"
                        style={{ borderColor: "#e8e8ed", color: "#374151", background: "#fff" }}
                        placeholder="Or type a custom strategy…"
                        value={customStrategy[dec.id] ?? ""}
                        onChange={(e) => { setCustomStrategy((p) => ({ ...p, [dec.id]: e.target.value })); setSelectedStrategy((p) => ({ ...p, [dec.id]: "" })); }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 h-11 gap-2"
                      disabled={!selectedStrategy[dec.id] && !customStrategy[dec.id]}
                      onClick={() => handleApprove(dec.id)}
                      style={(selectedStrategy[dec.id] || customStrategy[dec.id]) ? { background: "#059669", color: "#fff" } : {}}
                    >
                      <CheckCircle className="w-4 h-4" /> Approve Decision
                    </Button>
                    <Button
                      variant="outline"
                      className="h-11 gap-2"
                      style={{ color: "#dc2626", borderColor: "#fca5a5" }}
                      onClick={() => setRejectingId(dec.id)}
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </Button>
                    <Button
                      variant="outline"
                      className="h-11"
                      onClick={() => onOpenWorkspace({ id: dec.id, entity: dec.customer, entityType: dec.context, notes: dec.summary, isNew: false, scenarioId: dec.scenarioId })}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {isRejecting && (
                <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#fca5a5" }}>
                  <h3 className="font-semibold mb-1" style={{ color: "#1a1a2e" }}>Reject with feedback</h3>
                  <p className="text-xs mb-3" style={{ color: "#a0a0b0" }}>The contributor will see this note and can resubmit.</p>
                  <textarea
                    autoFocus
                    className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none resize-none mb-3"
                    style={{ borderColor: "#fca5a5", background: "#fff", color: "#374151", minHeight: 80 }}
                    placeholder="Explain what additional information is needed…"
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button className="gap-2 h-10" style={{ background: "#dc2626", color: "#fff" }} onClick={() => handleConfirmReject(dec.id)}>
                      <XCircle className="w-3.5 h-3.5" /> Confirm Rejection
                    </Button>
                    <Button variant="outline" className="h-10" onClick={() => { setRejectingId(null); setRejectNote(""); }}>Cancel</Button>
                  </div>
                </div>
              )}

              {isApproved && (
                <div className="rounded-2xl border p-5 flex items-center gap-3" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                  <CheckCircle className="w-5 h-5" style={{ color: "#059669" }} />
                  <div>
                    <p className="font-medium" style={{ color: "#166534" }}>Decision approved and stored in Company Memory</p>
                    <p className="text-xs mt-0.5" style={{ color: "#6b6b80" }}>Strategy: {customStrategy[dec.id] || selectedStrategy[dec.id]}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })() : (
          <div className="flex flex-col items-center justify-center h-full" style={{ color: "#a0a0b0" }}>
            <MessageSquare className="w-10 h-10 mb-3" style={{ color: "#d1d1db" }} />
            <p className="text-sm">Select a submission to review</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AnalysisCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
      <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a0a0b0" }}>{title}</h4>
      {children}
    </div>
  );
}
