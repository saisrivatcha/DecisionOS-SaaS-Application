import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Search,
  Filter,
  Download,
  Star,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Button } from "./ui/button";

interface Decision {
  id: string;
  date: string;
  customer: string;
  action: string;
  confidence: number;
  humanDecision: "approved" | "rejected" | "pending";
  outcome: string;
  rep: string;
  processingTime: string;
  isNew?: boolean;
}

const baseDecisions: Decision[] = [
  {
    id: "DEC-2841",
    date: "Jun 27, 2026 · 10:14 AM",
    customer: "Acme Corporation",
    action: "Schedule Executive Business Review",
    confidence: 92,
    humanDecision: "approved",
    outcome: "EBR scheduled — renewal on track",
    rep: "Sarah L.",
    processingTime: "13.8s",
  },
  {
    id: "DEC-2840",
    date: "Jun 27, 2026 · 08:42 AM",
    customer: "TechCorp Inc.",
    action: "Offer Premium Support Upgrade",
    confidence: 87,
    humanDecision: "pending",
    outcome: "Awaiting manager review",
    rep: "James C.",
    processingTime: "11.2s",
  },
  {
    id: "DEC-2839",
    date: "Jun 26, 2026 · 03:55 PM",
    customer: "GlobalRetail Ltd.",
    action: "Send Contract Renewal Proposal",
    confidence: 74,
    humanDecision: "approved",
    outcome: "Proposal sent — customer responded positively",
    rep: "Maria K.",
    processingTime: "16.1s",
  },
  {
    id: "DEC-2838",
    date: "Jun 26, 2026 · 10:03 AM",
    customer: "StartupXYZ",
    action: "Escalate to CS Director",
    confidence: 68,
    humanDecision: "rejected",
    outcome: "Rep chose direct outreach instead",
    rep: "Tom B.",
    processingTime: "9.7s",
  },
  {
    id: "DEC-2837",
    date: "Jun 25, 2026 · 02:17 PM",
    customer: "Meridian Health",
    action: "Share Industry Case Study",
    confidence: 91,
    humanDecision: "approved",
    outcome: "Customer engaged — demo scheduled",
    rep: "Sarah L.",
    processingTime: "14.5s",
  },
  {
    id: "DEC-2836",
    date: "Jun 25, 2026 · 09:44 AM",
    customer: "NovaStar Financial",
    action: "Propose Security Compliance Add-on",
    confidence: 83,
    humanDecision: "approved",
    outcome: "Add-on purchased +$28K ARR",
    rep: "James C.",
    processingTime: "12.0s",
  },
  {
    id: "DEC-2835",
    date: "Jun 24, 2026 · 04:30 PM",
    customer: "Beacon Analytics",
    action: "Offer Success Team Integration Workshop",
    confidence: 77,
    humanDecision: "approved",
    outcome: "Workshop confirmed for Jul 10",
    rep: "Maria K.",
    processingTime: "10.9s",
  },
  {
    id: "DEC-2834",
    date: "Jun 24, 2026 · 11:12 AM",
    customer: "Horizon Logistics",
    action: "Send Churn-Risk Intervention Playbook",
    confidence: 61,
    humanDecision: "rejected",
    outcome: "Rep requested more analysis",
    rep: "Tom B.",
    processingTime: "15.3s",
  },
];

const statusConfig = {
  approved: { color: "#059669", bg: "#f0fdf4", label: "Approved", Icon: CheckCircle },
  rejected: { color: "#dc2626", bg: "#fef2f2", label: "Rejected", Icon: XCircle },
  pending: { color: "#d97706", bg: "#fffbeb", label: "Pending", Icon: Clock },
};

interface DecisionHistoryProps {
  newlyApproved?: boolean;
}

export function DecisionHistory({ newlyApproved = false }: DecisionHistoryProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "approved" | "rejected" | "pending">("all");

  const newDecision: Decision | null = newlyApproved
    ? {
        id: "DEC-2842",
        date: "Jun 27, 2026 · Just now",
        customer: "Acme Corporation",
        action: "Schedule Executive Business Review",
        confidence: 88,
        humanDecision: "approved",
        outcome: "EBR scheduled — awaiting follow-up",
        rep: "James C.",
        processingTime: "14.3s",
        isNew: true,
      }
    : null;

  const allDecisions = newDecision
    ? [newDecision, ...baseDecisions]
    : baseDecisions;

  const filtered = allDecisions.filter((d) => {
    const matchesSearch =
      d.customer.toLowerCase().includes(search.toLowerCase()) ||
      d.action.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || d.humanDecision === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: allDecisions.length,
    approved: allDecisions.filter((d) => d.humanDecision === "approved").length,
    rejected: allDecisions.filter((d) => d.humanDecision === "rejected").length,
    pending: allDecisions.filter((d) => d.humanDecision === "pending").length,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "#9ca3af" }}>
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "#4f46e5" }}>Decision History</span>
          </div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>
            Decision History
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            Complete timeline of AI-generated recommendations and human approvals
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Decisions", value: stats.total, color: "#4f46e5", bg: "#eef2ff" },
          { label: "Approved", value: stats.approved, color: "#059669", bg: "#f0fdf4" },
          { label: "Rejected", value: stats.rejected, color: "#dc2626", bg: "#fef2f2" },
          { label: "Pending", value: stats.pending, color: "#d97706", bg: "#fffbeb" },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="rounded-xl border p-4 flex items-center gap-3"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: bg }}>
              <span className="font-bold text-sm" style={{ color }}>{value}</span>
            </div>
            <span className="text-sm" style={{ color: "#6b7280" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="rounded-xl border p-4 mb-4 flex items-center gap-3"
        style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
      >
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#9ca3af" }} />
          <input
            className="flex-1 bg-transparent border-0 outline-none text-sm"
            placeholder="Search by customer, action, or decision ID..."
            style={{ color: "#111827" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4" style={{ color: "#9ca3af" }} />
          {(["all", "approved", "rejected", "pending"] as const).map((f) => (
            <button
              key={f}
              className="text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-colors"
              style={
                filter === f
                  ? { background: "#4f46e5", color: "#ffffff" }
                  : { background: "#f3f4f6", color: "#6b7280" }
              }
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-12 gap-4 px-5 py-3 border-b text-xs font-semibold uppercase tracking-wide"
          style={{ borderColor: "#f3f4f6", color: "#9ca3af", background: "#f9fafb" }}
        >
          <div className="col-span-1">ID</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-3">Recommended Action</div>
          <div className="col-span-1">Confidence</div>
          <div className="col-span-1">Decision</div>
          <div className="col-span-2">Outcome</div>
        </div>

        <div className="divide-y" style={{ borderColor: "#f9fafb" }}>
          {filtered.map((dec) => {
            const sc = statusConfig[dec.humanDecision];
            const StatusIcon = sc.Icon;
            return (
              <div
                key={dec.id}
                className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors"
                style={dec.isNew ? { background: "#f0fdf4", border: "none" } : {}}
              >
                <div className="col-span-1">
                  <div className="flex items-center gap-1.5">
                    {dec.isNew && (
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#059669" }} />
                    )}
                    <span className="text-xs font-mono" style={{ color: "#4f46e5" }}>
                      {dec.id}
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 flex-shrink-0" style={{ color: "#9ca3af" }} />
                    <span className="text-xs" style={{ color: "#6b7280" }}>
                      {dec.date}
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-sm font-medium truncate block" style={{ color: "#111827" }}>
                    {dec.customer}
                  </span>
                  <span className="text-xs" style={{ color: "#9ca3af" }}>{dec.rep}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-sm" style={{ color: "#374151" }}>
                    {dec.action}
                  </span>
                </div>
                <div className="col-span-1">
                  <span
                    className="font-semibold text-sm"
                    style={{
                      color:
                        dec.confidence >= 85
                          ? "#059669"
                          : dec.confidence >= 70
                          ? "#d97706"
                          : "#dc2626",
                    }}
                  >
                    {dec.confidence}%
                  </span>
                </div>
                <div className="col-span-1">
                  <span
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium w-fit"
                    style={{ background: sc.bg, color: sc.color }}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {sc.label}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs" style={{ color: "#6b7280" }}>
                    {dec.outcome}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              No decisions match your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
