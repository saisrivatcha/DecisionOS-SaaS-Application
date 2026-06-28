import {
  Plus, CheckCircle, Clock, XCircle, FileText,
  ChevronRight, Flag, User,
} from "lucide-react";
import { Button } from "./ui/button";
import type { Page, SharedDecision, User as UserType } from "../App";

// Contributor-visible lifecycle (no AI terminology)
const CONTRIB_LIFECYCLE = [
  { key: "submitted",   label: "Submitted" },
  { key: "processing",  label: "Being Processed" },
  { key: "review",      label: "Under Review" },
  { key: "approved",    label: "Approved" },
  { key: "memory",      label: "In Organizational Memory" },
];

function getContribStep(status: SharedDecision["status"]): number {
  switch (status) {
    case "draft":      return -1;
    case "submitted":  return 0;
    case "in-review":  return 2;
    case "approved":   return 4;
    case "rejected":   return 2;
    default:           return 0;
  }
}

const statusConfig = {
  draft:       { color: "#a0a0b0", bg: "#f7f7f9", label: "Draft",          icon: FileText    },
  submitted:   { color: "#b45309", bg: "#fffbeb", label: "Submitted",      icon: Clock       },
  "in-review": { color: "#4f46e5", bg: "#f0f0f8", label: "Under Review",   icon: Clock       },
  approved:    { color: "#059669", bg: "#f0fdf4", label: "Approved",       icon: CheckCircle },
  rejected:    { color: "#dc2626", bg: "#fef2f2", label: "Needs more info",icon: XCircle     },
};

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

interface ContributorDashboardProps {
  user: UserType;
  decisions: SharedDecision[];
  onNavigate: (page: Page) => void;
  onOpenSubmission: (id: string) => void;
  listOnly?: boolean;
}

export function ContributorDashboard({ user, decisions, onNavigate, onOpenSubmission, listOnly = false }: ContributorDashboardProps) {
  const stats = {
    total:    decisions.length,
    pending:  decisions.filter((d) => d.status === "submitted" || d.status === "in-review").length,
    approved: decisions.filter((d) => d.status === "approved").length,
    rejected: decisions.filter((d) => d.status === "rejected").length,
  };

  const pendingDecisions = decisions.filter((d) => d.status === "submitted" || d.status === "in-review");
  const otherDecisions   = decisions.filter((d) => d.status !== "submitted" && d.status !== "in-review");

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {!listOnly && (
        <>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#1a1a2e" }}>
                Good morning, {user.name.split(" ")[0]}
              </h1>
              <p className="mt-1" style={{ color: "#6b6b80" }}>
                {stats.pending > 0
                  ? <><strong style={{ color: "#b45309" }}>{stats.pending} submission{stats.pending > 1 ? "s" : ""}</strong> {stats.pending > 1 ? "are" : "is"} currently being reviewed.</>
                  : "No submissions pending review."}
              </p>
            </div>
            <Button
              className="gap-2 h-11"
              style={{ background: "#4f46e5", color: "#fff" }}
              onClick={() => onNavigate("capture-decision")}
            >
              <Plus className="w-4 h-4" /> Capture Decision
            </Button>
          </div>

          {/* Your responsibility — simplified */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* What you do */}
            <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#a0a0b0" }}>
                Your Responsibility
              </p>
              <div className="space-y-3">
                {[
                  { step: "1", label: "Capture", desc: "Upload business discussion" },
                  { step: "2", label: "Submit",  desc: "Send for architect review" },
                  { step: "3", label: "Track",   desc: "Monitor submission status" },
                ].map(({ step, label, desc }) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0" style={{ background: "#f0f0f8", color: "#4f46e5" }}>
                      {step}
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "#1a1a2e" }}>{label}</div>
                      <div className="text-xs" style={{ color: "#a0a0b0" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status tracker */}
            <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#a0a0b0" }}>
                Submission Status
              </p>
              <div className="space-y-2.5">
                {CONTRIB_LIFECYCLE.map((stage, i) => {
                  const latestStep = decisions.length > 0
                    ? Math.max(...decisions.map((d) => getContribStep(d.status)))
                    : -1;
                  const isDone    = i <= latestStep && latestStep >= 0;
                  const isCurrent = i === latestStep + 1;
                  return (
                    <div key={stage.key} className="flex items-center gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: isDone ? "#059669" : isCurrent ? "#4f46e5" : "#e8e8ed" }}
                      >
                        {isDone && <CheckCircle className="w-3 h-3 text-white" />}
                        {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-xs" style={{ color: isDone ? "#374151" : isCurrent ? "#4f46e5" : "#d1d1db", fontWeight: isCurrent ? 600 : 400 }}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-7">
            {[
              { label: "Total",    value: stats.total,    color: "#1a1a2e", bg: "#f7f7f9" },
              { label: "Pending",  value: stats.pending,  color: "#b45309", bg: "#fffbeb" },
              { label: "Approved", value: stats.approved, color: "#059669", bg: "#f0fdf4" },
              { label: "Rejected", value: stats.rejected, color: "#dc2626", bg: "#fef2f2" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="rounded-2xl border p-4" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
                <div className="text-2xl font-bold mb-0.5" style={{ color }}>{value}</div>
                <div className="text-xs" style={{ color: "#6b6b80" }}>{label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {listOnly && (
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#1a1a2e" }}>My Decisions</h1>
          <Button className="gap-2 h-10" style={{ background: "#4f46e5", color: "#fff" }} onClick={() => onNavigate("capture-decision")}>
            <Plus className="w-4 h-4" /> Capture Decision
          </Button>
        </div>
      )}

      {/* Decisions list */}
      {decisions.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
          <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: "#d1d1db" }} />
          <p className="font-medium mb-1" style={{ color: "#1a1a2e" }}>No submissions yet</p>
          <p className="text-sm mb-5" style={{ color: "#a0a0b0" }}>
            Capture your first business discussion and submit it for review.
          </p>
          <Button className="gap-2" style={{ background: "#4f46e5", color: "#fff" }} onClick={() => onNavigate("capture-decision")}>
            <Plus className="w-4 h-4" /> Capture Decision
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pending first */}
          {pendingDecisions.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a0a0b0" }}>
                Under Review ({pendingDecisions.length})
              </p>
              <div className="space-y-3">
                {pendingDecisions.map((dec) => <DecisionCard key={dec.id} dec={dec} onOpen={onOpenSubmission} />)}
              </div>
            </div>
          )}

          {/* Others */}
          {otherDecisions.length > 0 && (
            <div>
              {pendingDecisions.length > 0 && (
                <p className="text-xs font-semibold uppercase tracking-widest mb-3 mt-4" style={{ color: "#a0a0b0" }}>
                  Previous Submissions
                </p>
              )}
              <div className="space-y-3">
                {otherDecisions.map((dec) => <DecisionCard key={dec.id} dec={dec} onOpen={onOpenSubmission} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DecisionCard({ dec, onOpen }: { dec: SharedDecision; onOpen: (id: string) => void }) {
  const sc = statusConfig[dec.status] ?? statusConfig["submitted"];
  const StatusIcon = sc.icon;
  const cc = contextColors[dec.context] ?? contextColors.Discussion;
  const pc = dec.priority ? priorityConfig[dec.priority] : priorityConfig["Medium"];

  return (
    <div className="rounded-2xl border p-5 hover:shadow-md transition-all" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Meta row */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-mono" style={{ color: "#a0a0b0" }}>{dec.id}</span>
            <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: cc.bg, color: cc.color }}>
              {dec.context}
            </span>
            {dec.priority && (
              <span className="text-xs px-1.5 py-0.5 rounded font-medium flex items-center gap-1" style={{ background: pc.bg, color: pc.color }}>
                <Flag className="w-2.5 h-2.5" />{dec.priority}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>
              <StatusIcon className="w-3 h-3" /> {sc.label}
            </span>
          </div>

          <h3 className="font-semibold mb-0.5" style={{ color: "#1a1a2e" }}>{dec.customer}</h3>
          <p className="text-sm mb-3" style={{ color: "#6b6b80" }}>{dec.summary}</p>

          {/* Assigned architect */}
          <div className="flex items-center gap-2 mb-3">
            <User className="w-3.5 h-3.5" style={{ color: "#a0a0b0" }} />
            <span className="text-xs" style={{ color: "#6b6b80" }}>
              Assigned to <strong style={{ color: "#374151" }}>James Chen</strong> · {dec.date}
            </span>
          </div>

          {/* Approved strategy (visible only after approval) */}
          {dec.status === "approved" && dec.approvedStrategy && (
            <div className="rounded-xl px-3 py-2.5 mb-3" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <p className="text-xs font-semibold mb-0.5" style={{ color: "#166634" }}>Approved Strategy</p>
              <p className="text-xs" style={{ color: "#166634" }}>{dec.approvedStrategy}</p>
            </div>
          )}

          {/* Rejection note */}
          {dec.status === "rejected" && dec.rejectionNote && (
            <div className="rounded-xl px-3 py-2.5 mb-3" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
              <p className="text-xs font-semibold mb-0.5" style={{ color: "#991b1b" }}>More Information Needed</p>
              <p className="text-xs" style={{ color: "#991b1b" }}>{dec.rejectionNote}</p>
            </div>
          )}
        </div>

        {/* Revenue + action */}
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          {dec.revenue !== "TBD" && (
            <span className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{dec.revenue}</span>
          )}
          <button
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
            style={{ background: "#f0f0f8", color: "#4f46e5" }}
            onClick={() => onOpen(dec.id)}
          >
            Open <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
