import { useState, useEffect } from "react";
import {
  CheckCircle, Clock, XCircle, AlertCircle, ChevronRight,
  FileText, Mail, Database, Mic, User, ArrowLeft,
  Calendar, DollarSign, Flag,
} from "lucide-react";
import { Button } from "./ui/button";
import type { SharedDecision, Page } from "../App";

// 5-stage lifecycle visible to contributors (no AI terminology)
const LIFECYCLE = [
  { key: "submitted",    label: "Submitted",                icon: CheckCircle },
  { key: "ai-processing",label: "Being Processed",          icon: Clock },
  { key: "in-review",    label: "Under Architect Review",   icon: User },
  { key: "approved",     label: "Decision Approved",        icon: CheckCircle },
  { key: "memory",       label: "Stored in Memory",         icon: CheckCircle },
];

function getLifecycleStep(status: SharedDecision["status"]): number {
  switch (status) {
    case "draft":      return -1;
    case "submitted":  return 0;
    case "in-review":  return 2;
    case "approved":   return 4;
    case "rejected":   return 2; // stops at review with a rejection note
    default:           return 0;
  }
}

const statusDisplay: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  submitted:  { label: "Submitted",                 color: "#b45309", bg: "#fffbeb", icon: Clock       },
  "in-review":{ label: "Waiting for Architect Review",color: "#4f46e5", bg: "#f0f0f8", icon: Clock    },
  approved:   { label: "Approved",                  color: "#059669", bg: "#f0fdf4", icon: CheckCircle },
  rejected:   { label: "Rejected — Needs more info",color: "#dc2626", bg: "#fef2f2", icon: XCircle    },
  draft:      { label: "Draft",                     color: "#a0a0b0", bg: "#f7f7f9", icon: AlertCircle },
};

const contextColors: Record<string, { bg: string; color: string }> = {
  Renewal:    { bg: "#f0f0f8", color: "#4f46e5" },
  Pricing:    { bg: "#fffbeb", color: "#b45309" },
  Complaint:  { bg: "#fef2f2", color: "#dc2626" },
  Upsell:     { bg: "#f0fdf4", color: "#059669" },
  Discussion: { bg: "#f7f7f9", color: "#6b6b80" },
};

interface ContributorSubmissionViewProps {
  decision: SharedDecision | null;
  onNavigate: (page: Page) => void;
}

export function ContributorSubmissionView({ decision, onNavigate }: ContributorSubmissionViewProps) {
  const [liveDecision, setLiveDecision] = useState<SharedDecision | null>(decision);

  // Update liveDecision when the prop changes
  useEffect(() => {
    if (decision) setLiveDecision(decision);
  }, [decision]);

  // Poll for status updates when decision is pending
  useEffect(() => {
    if (!decision?.id) return;
    const status = liveDecision?.status;
    // Only poll if the decision is still pending
    if (status === 'approved' || status === 'rejected') return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/decisions/${decision.id}`);
        if (!res.ok) return;
        const data = await res.json();
        const mappedStatus = data.status?.toLowerCase() === 'pending_review' ? 'in-review'
          : data.status?.toLowerCase() === 'approved' ? 'approved'
          : data.status?.toLowerCase() === 'rejected' ? 'rejected'
          : data.status?.toLowerCase() || 'submitted';

        setLiveDecision(prev => prev ? {
          ...prev,
          status: mappedStatus as any,
          approvedStrategy: data.approvedStrategy || prev.approvedStrategy,
        } : prev);
      } catch { /* ignore polling errors */ }
    };

    const interval = setInterval(poll, 8000);
    return () => clearInterval(interval);
  }, [decision?.id, liveDecision?.status]);

  // Use liveDecision for rendering
  const d = liveDecision;

  if (!d) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <AlertCircle className="w-10 h-10 mb-3" style={{ color: "#d1d1db" }} />
        <p className="text-sm font-medium" style={{ color: "#1a1a2e" }}>Submission not found</p>
        <button className="mt-4 text-sm" style={{ color: "#4f46e5" }} onClick={() => onNavigate("my-decisions")}>
          ← Back to My Decisions
        </button>
      </div>
    );
  }

  const lifecycleStep = getLifecycleStep(d.status);
  const sd = statusDisplay[d.status] ?? statusDisplay["submitted"];
  const StatusIcon = sd.icon;
  const cc = contextColors[d.context] ?? contextColors.Discussion;
  const isApproved = d.status === "approved";
  const isRejected = d.status === "rejected";

  return (
    <div className="flex h-full">
      {/* ── Left: status sidebar ── */}
      <div
        className="flex flex-col border-r flex-shrink-0"
        style={{ width: 280, background: "#fff", borderColor: "#e8e8ed" }}
      >
        {/* Back */}
        <div className="p-4 border-b" style={{ borderColor: "#e8e8ed" }}>
          <button
            className="flex items-center gap-2 text-sm mb-4"
            style={{ color: "#6b6b80" }}
            onClick={() => onNavigate("my-decisions")}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> My Decisions
          </button>
          <span className="text-xs font-mono" style={{ color: "#a0a0b0" }}>{d.id}</span>
          <h2 className="font-semibold mt-1 mb-2" style={{ color: "#1a1a2e" }}>{d.customer}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: cc.bg, color: cc.color }}>
              {d.context}
            </span>
            {d.revenue !== "TBD" && (
              <span className="text-xs font-semibold" style={{ color: "#374151" }}>{d.revenue}</span>
            )}
          </div>
        </div>

        {/* Current status — large, prominent */}
        <div className="p-4 border-b" style={{ borderColor: "#e8e8ed" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a0a0b0" }}>
            Current Status
          </p>
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: sd.bg }}
          >
            <StatusIcon className="w-5 h-5 flex-shrink-0" style={{ color: sd.color }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: sd.color }}>{sd.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "#6b6b80" }}>
                {d.date === "Just now" ? "Submitted just now" : `Submitted ${d.date}`}
              </p>
            </div>
          </div>
        </div>

        {/* Lifecycle tracker */}
        <div className="p-4 border-b" style={{ borderColor: "#e8e8ed" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#a0a0b0" }}>
            Submission Journey
          </p>
          <div className="space-y-3">
            {LIFECYCLE.map((stage, i) => {
              const isDone    = i <= lifecycleStep && d.status !== "rejected";
              const isCurrent = i === lifecycleStep + (d.status === "in-review" ? 0 : 0);
              const isRejectedHere = isRejected && i === 2;
              const StageIcon = stage.icon;

              return (
                <div key={stage.key} className="flex items-center gap-3">
                  {/* Connector */}
                  <div className="flex flex-col items-center" style={{ width: 20 }}>
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isRejectedHere ? "#dc2626" : isDone ? "#059669" : i === lifecycleStep + 1 && !isRejected ? "#4f46e5" : "#e8e8ed",
                      }}
                    >
                      {isRejectedHere
                        ? <XCircle className="w-3 h-3 text-white" />
                        : isDone
                        ? <CheckCircle className="w-3 h-3 text-white" />
                        : i === lifecycleStep + 1 && !isRejected
                        ? <Clock className="w-3 h-3 text-white" />
                        : null}
                    </div>
                    {i < LIFECYCLE.length - 1 && (
                      <div
                        className="w-px mt-1"
                        style={{ height: 16, background: isDone && !isRejectedHere ? "#059669" : "#e8e8ed" }}
                      />
                    )}
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{
                      color: isRejectedHere ? "#dc2626" : isDone ? "#374151" : i === lifecycleStep + 1 && !isRejected ? "#4f46e5" : "#d1d1db",
                    }}
                  >
                    {stage.label}
                    {isRejectedHere && " (Rejected)"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assigned Architect */}
        <div className="p-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a0a0b0" }}>
            Assigned Architect
          </p>
          <div className="rounded-xl p-3" style={{ background: "#f7f7f9" }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: "#ededf8", color: "#4f46e5" }}
              >
                JC
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>James Chen</p>
                <p className="text-xs" style={{ color: "#a0a0b0" }}>Decision Architect · Sales</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span style={{ color: "#a0a0b0" }}>Expected review</span>
                <span style={{ color: "#374151" }}>Within 24 hours</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#a0a0b0" }}>Department</span>
                <span style={{ color: "#374151" }}>Sales</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto" style={{ background: "#f7f7f9" }}>
        <div className="p-7 max-w-2xl">

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-3.5 h-3.5" style={{ color: "#a0a0b0" }} />
              <span className="text-xs" style={{ color: "#a0a0b0" }}>Submitted {d.date}</span>
            </div>
            <h1 className="text-xl font-semibold" style={{ color: "#1a1a2e" }}>
              {d.customer}
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6b6b80" }}>{d.context} Discussion</p>
          </div>

          {/* Submitted Information */}
          <div className="rounded-2xl border p-5 mb-4" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#a0a0b0" }}>
              Submitted Information
            </h3>
            <div className="space-y-2.5">
              {[
                { icon: FileText,  label: "Meeting Notes",   value: "1 document uploaded"    },
                { icon: Database,  label: "CRM Notes",       value: "Attached"               },
                { icon: Mail,      label: "Email Thread",    value: "Included in context"    },
                { icon: Mic,       label: "Call Transcript", value: "Auto-transcribed"       },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f7f7f9" }}>
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "#a0a0b0" }} />
                  <span className="text-sm flex-1" style={{ color: "#374151" }}>{label}</span>
                  <span className="text-xs" style={{ color: "#6b6b80" }}>{value}</span>
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#059669" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Business Summary */}
          <div className="rounded-2xl border p-5 mb-4" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a0a0b0" }}>
              Business Summary
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
              {d.summary}
            </p>
          </div>

          {/* Architect Comments */}
          <div className="rounded-2xl border p-5 mb-4" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a0a0b0" }}>
              Architect Comments
            </h3>
            {isRejected && d.rejectionNote ? (
              <div className="rounded-xl p-3.5" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <XCircle className="w-4 h-4" style={{ color: "#dc2626" }} />
                  <span className="text-xs font-semibold" style={{ color: "#dc2626" }}>
                    Additional Information Required
                  </span>
                </div>
                <p className="text-sm" style={{ color: "#991b1b" }}>{d.rejectionNote}</p>
              </div>
            ) : isApproved ? (
              <div className="rounded-xl p-3.5" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4" style={{ color: "#059669" }} />
                  <span className="text-xs font-semibold" style={{ color: "#059669" }}>Approved</span>
                </div>
                <p className="text-sm" style={{ color: "#166534" }}>
                  This submission has been reviewed and approved. See the approved decision below.
                </p>
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#a0a0b0", fontStyle: "italic" }}>
                No comments yet. You'll be notified when your architect leaves feedback.
              </p>
            )}
          </div>

          {/* Final Decision — only shown after approval */}
          {isApproved && d.approvedStrategy && (
            <div
              className="rounded-2xl border p-5"
              style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5" style={{ color: "#059669" }} />
                <h3 className="font-semibold" style={{ color: "#166534" }}>Final Decision</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#a0a0b0" }}>
                    Chosen Strategy
                  </p>
                  <div className="rounded-xl p-3.5" style={{ background: "#fff" }}>
                    <p className="font-semibold text-sm" style={{ color: "#1a1a2e" }}>
                      {d.approvedStrategy}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#a0a0b0" }}>Approved By</p>
                    <p className="text-sm font-medium" style={{ color: "#1a1a2e" }}>James Chen</p>
                    <p className="text-xs" style={{ color: "#a0a0b0" }}>Decision Architect · Sales</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#a0a0b0" }}>Approved Time</p>
                    <p className="text-sm font-medium" style={{ color: "#1a1a2e" }}>{d.date}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#a0a0b0" }}>Reason</p>
                  <p className="text-sm" style={{ color: "#374151" }}>
                    This strategy was selected based on historical outcomes from similar business situations in your organization's memory.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rejected — resubmit prompt */}
          {isRejected && (
            <div className="rounded-2xl border p-5 mt-4" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
              <h3 className="font-semibold mb-1" style={{ color: "#1a1a2e" }}>What to do next</h3>
              <p className="text-sm mb-4" style={{ color: "#6b6b80" }}>
                Your architect needs more information. Review their feedback above, then capture a new submission with the additional details.
              </p>
              <Button
                className="gap-2"
                style={{ background: "#4f46e5", color: "#fff" }}
                onClick={() => onNavigate("capture-decision")}
              >
                Capture New Submission
              </Button>
            </div>
          )}

          {/* Pending guidance */}
          {!isApproved && !isRejected && (
            <div className="rounded-2xl border p-4 mt-4" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
              <p className="text-sm" style={{ color: "#6b6b80" }}>
                <strong style={{ color: "#374151" }}>What happens next?</strong> Your Decision Architect will review the AI analysis, compare similar past decisions, and select the best strategy. You'll receive a notification when a decision is made.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
