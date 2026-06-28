import {
  Clock, Sparkles, ChevronRight, DollarSign,
  TrendingUp, CheckCircle, ArrowRight, Flag,
} from "lucide-react";
import { Button } from "./ui/button";
import type { Page, DecisionDraft, SharedDecision, User } from "../App";

const contextColors: Record<string, { bg: string; color: string }> = {
  Renewal:    { bg: "#f0f0f8", color: "#4f46e5" },
  Pricing:    { bg: "#fffbeb", color: "#b45309" },
  Complaint:  { bg: "#fef2f2", color: "#dc2626" },
  Upsell:     { bg: "#f0fdf4", color: "#059669" },
  Discussion: { bg: "#f7f7f9", color: "#6b6b80" },
};

const priorityConfig = {
  High:   { color: "#dc2626", bg: "#fef2f2" },
  Medium: { color: "#b45309", bg: "#fffbeb" },
  Low:    { color: "#6b6b80", bg: "#f7f7f9" },
};

const urgentCases = [
  { customer: "Netflix",  context: "Renewal", revenue: "$480K", desc: "Contract expires in 3 days. CFO sign-off missing.", tag: "Due today",   tagColor: "#dc2626", tagBg: "#fef2f2", priority: "High"   as const },
  { customer: "Amazon",   context: "Pricing",  revenue: "$1.2M", desc: "30% price cut demand. Evaluation closes in 12 days.", tag: "Risk",     tagColor: "#b45309", tagBg: "#fffbeb", priority: "High"   as const },
  { customer: "Google",   context: "Upsell",   revenue: "+$320K", desc: "Platform at 94% capacity. 2 departments requesting access.", tag: "Opportunity", tagColor: "#166534", tagBg: "#f0fdf4", priority: "Medium" as const },
];

interface DashboardProps {
  user: User;
  decisions: SharedDecision[];
  onNavigate: (page: Page) => void;
  onOpenWorkspace: (draft: DecisionDraft) => void;
  onApprove: (id: string, strategy: string) => void;
  onReject: (id: string, note: string) => void;
}

export function Dashboard({ user, decisions, onNavigate, onOpenWorkspace }: DashboardProps) {
  const pending  = decisions.filter((d) => d.status === "submitted" || d.status === "in-review");
  const approved = decisions.filter((d) => d.status === "approved").slice(0, 3);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Greeting */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#1a1a2e" }}>
          Good morning, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1" style={{ color: "#6b6b80" }}>
          {pending.length > 0
            ? <><strong style={{ color: "#1a1a2e" }}>{pending.length} submissions</strong> are waiting for your review.</>
            : "No pending reviews. You're all caught up."}
        </p>
      </div>

      {/* Invisible AI insight */}
      <div className="rounded-2xl px-5 py-4 mb-6 flex items-start gap-3" style={{ background: "#f0f0f8", border: "1px solid #ddddf0" }}>
        <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#4f46e5" }} />
        <p className="text-sm leading-relaxed" style={{ color: "#3730a3" }}>
          Three new submissions match situations where Sales historically outperformed the initial risk estimate — executive review led to renewal in 8 of 10 similar cases.{" "}
          <button className="underline font-medium" style={{ color: "#4f46e5" }} onClick={() => onNavigate("insights")}>
            View pattern →
          </button>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main column */}
        <div className="col-span-2 space-y-6">

          {/* Pending — ONE button only: Review Decision */}
          {pending.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a0a0b0" }}>
                  Pending Reviews ({pending.length})
                </p>
                <button
                  className="text-xs font-medium flex items-center gap-1"
                  style={{ color: "#4f46e5" }}
                  onClick={() => onNavigate("pending-reviews")}
                >
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {pending.slice(0, 3).map((dec) => {
                  const cc = contextColors[dec.context] ?? contextColors.Discussion;
                  const pc = priorityConfig[dec.priority ?? "Medium"];
                  return (
                    <div
                      key={dec.id}
                      className="rounded-2xl border p-5"
                      style={{ background: "#fff", borderColor: "#e8e8ed" }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-mono" style={{ color: "#a0a0b0" }}>{dec.id}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: cc.bg, color: cc.color }}>
                              {dec.context}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: pc.bg, color: pc.color }}>
                              <Flag className="w-2.5 h-2.5 inline mr-0.5" />{dec.priority ?? "Medium"}
                            </span>
                          </div>
                          <h3 className="font-semibold" style={{ color: "#1a1a2e" }}>{dec.customer}</h3>
                          <p className="text-sm mt-0.5" style={{ color: "#6b6b80" }}>{dec.summary}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{dec.revenue}</span>
                          <p className="text-xs mt-0.5" style={{ color: "#a0a0b0" }}>by {dec.submittedBy}</p>
                        </div>
                      </div>

                      {/* ONE action only — Review Decision */}
                      <Button
                        className="w-full h-10 gap-2"
                        style={{ background: "#1a1a2e", color: "#fff" }}
                        onClick={() => onNavigate("pending-reviews")}
                      >
                        Review Decision
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
                {pending.length > 3 && (
                  <button
                    className="w-full py-3 rounded-2xl border text-sm font-medium hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#e8e8ed", color: "#4f46e5" }}
                    onClick={() => onNavigate("pending-reviews")}
                  >
                    View {pending.length - 3} more pending reviews
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border p-8 text-center" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
              <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: "#d1d1db" }} />
              <p className="font-medium" style={{ color: "#1a1a2e" }}>No decisions waiting for approval</p>
              <p className="text-sm mt-1" style={{ color: "#a0a0b0" }}>
                You'll be notified when contributors submit new business cases.
              </p>
            </div>
          )}

          {/* Important business cases */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a0a0b0" }}>
              Important Business Cases
            </p>
            <div className="space-y-3">
              {urgentCases.map((item) => (
                <button
                  key={item.customer}
                  onClick={() => onOpenWorkspace({ entity: item.customer, entityType: item.context, notes: item.desc, isNew: false })}
                  className="w-full text-left rounded-2xl border p-5 hover:shadow-md transition-all group"
                  style={{ background: "#fff", borderColor: "#e8e8ed" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium" style={{ color: "#a0a0b0" }}>{item.customer}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: item.tagBg, color: item.tagColor }}>
                          {item.tag}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1" style={{ color: "#1a1a2e" }}>{item.context} Discussion</h3>
                      <p className="text-sm" style={{ color: "#6b6b80" }}>{item.desc}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{item.revenue}</div>
                      <ArrowRight className="w-4 h-4 mt-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#4f46e5" }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recently approved */}
          {approved.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a0a0b0" }}>
                  Recently Approved
                </p>
                <button className="text-xs font-medium" style={{ color: "#4f46e5" }} onClick={() => onNavigate("memory")}>
                  View in Organizational Memory →
                </button>
              </div>
              <div className="space-y-2">
                {approved.map((dec) => (
                  <div key={dec.id} className="flex items-center gap-3 p-3.5 rounded-2xl border" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#059669" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#1a1a2e" }}>{dec.customer} — {dec.approvedStrategy}</p>
                      <p className="text-xs" style={{ color: "#a0a0b0" }}>by {dec.submittedBy} · {dec.date}</p>
                    </div>
                    <span className="text-sm font-semibold flex-shrink-0" style={{ color: "#059669" }}>{dec.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right stats */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a0a0b0" }}>This Month</p>
          {[
            { label: "Revenue Influenced", value: "$2.4M",   icon: DollarSign,  color: "#059669", bg: "#f0fdf4" },
            { label: "Decisions Approved", value: String(decisions.filter((d) => d.status === "approved").length), icon: CheckCircle, color: "#4f46e5", bg: "#f0f0f8" },
            { label: "Success Rate",       value: "78%",      icon: TrendingUp,  color: "#0284c7", bg: "#f0f9ff" },
            { label: "Avg Review Time",    value: "4.2 hrs",  icon: Clock,       color: "#b45309", bg: "#fffbeb" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl border p-4 flex items-center gap-3" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: "#a0a0b0" }}>{label}</div>
                <div className="font-semibold" style={{ color: "#1a1a2e" }}>{value}</div>
              </div>
            </div>
          ))}
          <div className="rounded-2xl p-4" style={{ background: "#1a1a2e" }}>
            <p className="text-xs leading-relaxed" style={{ color: "#8888a8" }}>
              <span style={{ color: "#c8c8e8", fontWeight: 600 }}>Capture → Learn → Remember → Reuse.</span>
              {" "}Every approved decision becomes permanent organizational intelligence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
