import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, Clock,
  Target, Brain, Lightbulb, AlertTriangle,
} from "lucide-react";
import type { SharedDecision } from "../App";

const qualityData = [
  { month: "Jan", rate: 68 }, { month: "Feb", rate: 71 },
  { month: "Mar", rate: 74 }, { month: "Apr", rate: 72 },
  { month: "May", rate: 77 }, { month: "Jun", rate: 78 },
];

const strategyData = [
  { strategy: "Exec Review",    rate: 88, count: 42 },
  { strategy: "Renewal Offer",  rate: 71, count: 38 },
  { strategy: "Case Study",     rate: 69, count: 24 },
  { strategy: "Price Incentive",rate: 61, count: 31 },
  { strategy: "Wait & Monitor", rate: 34, count: 19 },
];

const actionableInsights = [
  {
    insight: "Pricing objections increased 38% this month",
    action: "Proactively schedule executive alignment calls for all enterprise renewals in Q3.",
    urgency: "high",
    color: "#dc2626", bg: "#fef2f2",
  },
  {
    insight: "Legal review before pricing decisions increases win rate by 24%",
    action: "Add legal sign-off as a required step in pricing change workflows.",
    urgency: "high",
    color: "#4f46e5", bg: "#f0f0f8",
  },
  {
    insight: "Renewals without an executive sponsor fail twice as often",
    action: "Flag any renewal > $100K that doesn't have a VP-level champion identified.",
    urgency: "medium",
    color: "#b45309", bg: "#fffbeb",
  },
  {
    insight: "Decisions made within 5 days of a customer complaint have a 61% higher success rate",
    action: "Set a 5-day response SLA for escalated complaints across all departments.",
    urgency: "medium",
    color: "#059669", bg: "#f0fdf4",
  },
  {
    insight: "Discounts above 20% are followed by churn within 18 months in 67% of cases",
    action: "Require DA approval and outcome tracking for any discount > 20%.",
    urgency: "low",
    color: "#6b6b80", bg: "#f7f7f9",
  },
];

const orgBrain = [
  {
    pattern: "Executive reviews improve enterprise renewals by 27%",
    evidence: "48 similar cases",
    confidence: 92,
    impact: "High",
    impactColor: "#059669",
  },
  {
    pattern: "Pricing objections combined with security concerns almost always require executive involvement",
    evidence: "31 of 34 cases",
    confidence: 91,
    impact: "High",
    impactColor: "#059669",
  },
  {
    pattern: "Accounts with no CSM contact for 90+ days churn at 3× the baseline rate",
    evidence: "47 accounts tracked",
    confidence: 88,
    impact: "High",
    impactColor: "#059669",
  },
  {
    pattern: "Skipping pilots when user demand is confirmed reduces time-to-close by 6 weeks",
    evidence: "23 expansion deals",
    confidence: 84,
    impact: "Medium",
    impactColor: "#b45309",
  },
  {
    pattern: "Responding to feature requests within 24 hours increases upsell probability by 41%",
    evidence: "53 decisions",
    confidence: 79,
    impact: "Medium",
    impactColor: "#b45309",
  },
];

const kpis = [
  { label: "Revenue Influenced", value: "$12.4M", delta: "+18% YoY", up: true,  icon: DollarSign, color: "#059669", bg: "#f0fdf4" },
  { label: "Decision Success Rate", value: "78%",  delta: "+6% YoY", up: true,  icon: Target,     color: "#4f46e5", bg: "#f0f0f8" },
  { label: "Avg Decision Time",   value: "4.2 days", delta: "−41% YoY", up: true, icon: Clock,    color: "#b45309", bg: "#fffbeb" },
  { label: "Knowledge Reused",    value: "134 cases", delta: "this quarter", up: true, icon: Brain, color: "#0284c7", bg: "#f0f9ff" },
];

interface InsightsPageProps {
  decisions?: SharedDecision[];
}

export function InsightsPage({ decisions = [] }: InsightsPageProps) {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#1a1a2e" }}>Insights</h1>
        <p className="mt-1" style={{ color: "#6b6b80" }}>
          Actionable intelligence derived from your organization's decision history.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(({ label, value, delta, up, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a0a0b0" }}>{label}</p>
                <p className="text-2xl font-bold" style={{ color: "#1a1a2e" }}>{value}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  {up ? <TrendingUp className="w-3 h-3" style={{ color: "#059669" }} /> : <TrendingDown className="w-3 h-3" style={{ color: "#dc2626" }} />}
                  <span className="text-xs font-medium" style={{ color: up ? "#059669" : "#dc2626" }}>{delta}</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon className="w-4.5 h-4.5" style={{ color, width: 18, height: 18 }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
          <h3 className="font-semibold mb-0.5" style={{ color: "#1a1a2e" }}>Decision Quality Over Time</h3>
          <p className="text-xs mb-4" style={{ color: "#a0a0b0" }}>Success rate — last 6 months</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={qualityData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="qg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f3f7" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a0a0b0" }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 85]} tick={{ fontSize: 11, fill: "#a0a0b0" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e8e8ed", fontSize: 12 }} formatter={(v) => [`${v}%`, "Success"]} />
              <Area type="monotone" dataKey="rate" stroke="#4f46e5" strokeWidth={2} fill="url(#qg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
          <h3 className="font-semibold mb-0.5" style={{ color: "#1a1a2e" }}>Most Successful Strategies</h3>
          <p className="text-xs mb-4" style={{ color: "#a0a0b0" }}>Success rate by strategy type</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={strategyData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f3f7" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#a0a0b0" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <YAxis dataKey="strategy" type="category" tick={{ fontSize: 11, fill: "#6b6b80" }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e8e8ed", fontSize: 12 }} formatter={(v) => [`${v}%`, "Success Rate"]} />
              <Bar dataKey="rate" radius={[0, 6, 6, 0]}>
                {strategyData.map((_e, i) => (
                  <Cell key={`cell-${i}`} fill={i === 0 ? "#4f46e5" : "#e0e0f0"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actionable Intelligence */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5" style={{ color: "#4f46e5" }} />
          <h2 className="font-semibold text-lg" style={{ color: "#1a1a2e" }}>Actionable Intelligence</h2>
        </div>
        <p className="text-sm mb-5" style={{ color: "#6b6b80" }}>
          These insights require action. They are derived from patterns AI identified across your decision history.
        </p>
        <div className="space-y-3">
          {actionableInsights.map((item, i) => (
            <div key={i} className="rounded-2xl border p-5 flex items-start gap-4" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: item.bg }}>
                <Lightbulb className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-1" style={{ color: "#1a1a2e" }}>{item.insight}</p>
                <p className="text-sm" style={{ color: "#6b6b80" }}>
                  <span className="font-medium" style={{ color: "#374151" }}>Recommended action: </span>
                  {item.action}
                </p>
              </div>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                style={
                  item.urgency === "high"
                    ? { background: "#fef2f2", color: "#dc2626" }
                    : item.urgency === "medium"
                    ? { background: "#fffbeb", color: "#b45309" }
                    : { background: "#f7f7f9", color: "#6b6b80" }
                }
              >
                {item.urgency === "high" ? "High priority" : item.urgency === "medium" ? "Review" : "Low"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Organizational Brain */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5" style={{ color: "#4f46e5" }} />
          <h2 className="font-semibold text-lg" style={{ color: "#1a1a2e" }}>Organizational Brain</h2>
        </div>
        <p className="text-sm mb-5" style={{ color: "#6b6b80" }}>
          Patterns AI discovered across your company's history. Updated as new decisions are recorded.
        </p>
        <div className="space-y-3">
          {orgBrain.map((item, i) => (
            <div key={i} className="rounded-2xl border p-5 flex items-start gap-4" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
              <div className="flex-1">
                <p className="font-medium mb-2" style={{ color: "#1a1a2e" }}>{item.pattern}</p>
                <div className="flex items-center gap-4 text-xs" style={{ color: "#a0a0b0" }}>
                  <span>Observed in <strong style={{ color: "#374151" }}>{item.evidence}</strong></span>
                  <span>·</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-20 h-1.5 rounded-full" style={{ background: "#e8e8ed" }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${item.confidence}%`, background: "#4f46e5" }} />
                    </div>
                    <span><strong style={{ color: "#374151" }}>{item.confidence}%</strong> confidence</span>
                  </div>
                </div>
              </div>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                style={{ background: item.impactColor === "#059669" ? "#f0fdf4" : "#fffbeb", color: item.impactColor }}
              >
                {item.impact} impact
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
