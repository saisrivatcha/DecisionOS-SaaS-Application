import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Target,
  Clock,
  Zap,
  Activity,
  Brain,
  BarChart2,
} from "lucide-react";

const weeklyDecisions = [
  { week: "W22", decisions: 48, approved: 38, accuracy: 79 },
  { week: "W23", decisions: 52, approved: 43, accuracy: 83 },
  { week: "W24", decisions: 61, approved: 50, accuracy: 82 },
  { week: "W25", decisions: 58, approved: 49, accuracy: 84 },
  { week: "W26", decisions: 71, approved: 60, accuracy: 85 },
  { week: "W27", decisions: 31, approved: 28, accuracy: 90 },
];

const agentPerf = [
  { agent: "Planner", success: 97.2, tasks: 142, avgTime: 1.8 },
  { agent: "Retrieval", success: 98.5, tasks: 198, avgTime: 2.2 },
  { agent: "Memory", success: 99.1, tasks: 302, avgTime: 1.5 },
  { agent: "Analysis", success: 92.3, tasks: 142, avgTime: 2.8 },
  { agent: "Recommendation", success: 90.1, tasks: 142, avgTime: 2.4 },
  { agent: "Explanation", success: 99.2, tasks: 128, avgTime: 1.6 },
];

const decisionTimeData = [
  { date: "Jun 1", time: 18.2 },
  { date: "Jun 5", time: 15.8 },
  { date: "Jun 10", time: 14.1 },
  { date: "Jun 15", time: 12.4 },
  { date: "Jun 20", time: 10.9 },
  { date: "Jun 25", time: 8.3 },
  { date: "Jun 27", time: 7.1 },
];

const outcomeData = [
  { name: "Renewed", value: 58, color: "#059669" },
  { name: "Expanded", value: 18, color: "#4f46e5" },
  { name: "At Risk", value: 14, color: "#d97706" },
  { name: "Churned", value: 10, color: "#dc2626" },
];

const kpis = [
  {
    title: "Total Recommendations",
    value: "321",
    delta: "+47 this week",
    up: true,
    icon: Target,
    accent: "#4f46e5",
    bg: "#eef2ff",
  },
  {
    title: "Approval Rate",
    value: "84.1%",
    delta: "+1.8% vs last month",
    up: true,
    icon: TrendingUp,
    accent: "#059669",
    bg: "#f0fdf4",
  },
  {
    title: "Recommendation Accuracy",
    value: "78.4%",
    delta: "+2.1% vs last month",
    up: true,
    icon: Activity,
    accent: "#0284c7",
    bg: "#f0f9ff",
  },
  {
    title: "Avg Decision Time",
    value: "4.2m",
    delta: "−18% vs last month",
    up: true,
    icon: Clock,
    accent: "#d97706",
    bg: "#fffbeb",
  },
  {
    title: "Agent Uptime",
    value: "99.7%",
    delta: "Last 30 days",
    up: true,
    icon: Zap,
    accent: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    title: "Memory Growth",
    value: "8.4K",
    delta: "+312 records this week",
    up: true,
    icon: Brain,
    accent: "#dc2626",
    bg: "#fef2f2",
  },
];

export function AnalyticsDashboard() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "#9ca3af" }}>
          <span>Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: "#4f46e5" }}>Analytics</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>
              Analytics
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              Platform performance metrics — June 2026
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="text-sm rounded-lg border px-3 py-2 outline-none"
              style={{ borderColor: "#e5e7eb", color: "#374151", background: "#ffffff" }}
            >
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="rounded-xl border p-5 flex items-start gap-4"
              style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: kpi.bg }}>
                <Icon className="w-5 h-5" style={{ color: kpi.accent }} />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide" style={{ color: "#9ca3af" }}>
                  {kpi.title}
                </div>
                <div className="text-2xl font-bold mt-1" style={{ color: "#111827" }}>
                  {kpi.value}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.up ? (
                    <TrendingUp className="w-3 h-3" style={{ color: "#059669" }} />
                  ) : (
                    <TrendingDown className="w-3 h-3" style={{ color: "#dc2626" }} />
                  )}
                  <span className="text-xs" style={{ color: kpi.up ? "#059669" : "#dc2626" }}>
                    {kpi.delta}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Weekly decisions chart */}
        <div
          className="col-span-2 rounded-xl border p-5"
          style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
        >
          <h3 className="font-semibold mb-1" style={{ color: "#111827" }}>
            Weekly Decision Volume & Accuracy
          </h3>
          <p className="text-xs mb-4" style={{ color: "#9ca3af" }}>
            Decisions analyzed, approved, and accuracy rate by week
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyDecisions} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Bar dataKey="decisions" fill="#e0e7ff" radius={[4, 4, 0, 0]} name="Analyzed" />
              <Bar dataKey="approved" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Approved" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Outcome breakdown */}
        <div
          className="rounded-xl border p-5"
          style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
        >
          <h3 className="font-semibold mb-1" style={{ color: "#111827" }}>
            Outcome Distribution
          </h3>
          <p className="text-xs mb-3" style={{ color: "#9ca3af" }}>
            Final customer outcomes post-decision
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={outcomeData} cx="50%" cy="50%" innerRadius={38} outerRadius={56} paddingAngle={3} dataKey="value">
                {outcomeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {outcomeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs" style={{ color: "#6b7280" }}>{item.name}</span>
                </div>
                <span className="text-xs font-medium" style={{ color: "#111827" }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Decision time trend */}
        <div
          className="rounded-xl border p-5"
          style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
        >
          <h3 className="font-semibold mb-1" style={{ color: "#111827" }}>
            Average Decision Time (minutes)
          </h3>
          <p className="text-xs mb-4" style={{ color: "#9ca3af" }}>
            End-to-end processing time trending down 18%
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={decisionTimeData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Area type="monotone" dataKey="time" stroke="#059669" strokeWidth={2} fill="url(#timeGradient)" name="Avg Time (min)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Agent performance */}
        <div
          className="rounded-xl border p-5"
          style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
        >
          <h3 className="font-semibold mb-1" style={{ color: "#111827" }}>
            Agent Performance
          </h3>
          <p className="text-xs mb-3" style={{ color: "#9ca3af" }}>
            Success rate and task volume by agent
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={agentPerf} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" domain={[85, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="agent" type="category" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} formatter={(v) => `${v}%`} />
              <Bar dataKey="success" fill="#4f46e5" radius={[0, 4, 4, 0]} name="Success Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agent details table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "#f3f4f6" }}>
          <h3 className="font-semibold" style={{ color: "#111827" }}>
            Agent Performance Details
          </h3>
        </div>
        <div className="divide-y" style={{ borderColor: "#f9fafb" }}>
          <div
            className="grid grid-cols-5 gap-4 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide"
            style={{ color: "#9ca3af", background: "#f9fafb" }}
          >
            <div>Agent</div>
            <div>Success Rate</div>
            <div>Total Tasks</div>
            <div>Avg Exec Time</div>
            <div>Health</div>
          </div>
          {agentPerf.map((agent) => (
            <div key={agent.agent} className="grid grid-cols-5 gap-4 px-5 py-3.5 items-center hover:bg-gray-50">
              <div className="font-medium text-sm" style={{ color: "#111827" }}>
                {agent.agent}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: "#e5e7eb", maxWidth: 80 }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${((agent.success - 85) / 15) * 100}%`,
                        background: agent.success >= 95 ? "#059669" : "#d97706",
                      }}
                    />
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: agent.success >= 95 ? "#059669" : "#d97706" }}
                  >
                    {agent.success}%
                  </span>
                </div>
              </div>
              <div className="text-sm" style={{ color: "#374151" }}>
                {agent.tasks.toLocaleString()}
              </div>
              <div className="text-sm" style={{ color: "#374151" }}>
                {agent.avgTime}s
              </div>
              <div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={
                    agent.success >= 95
                      ? { background: "#f0fdf4", color: "#059669" }
                      : { background: "#fffbeb", color: "#d97706" }
                  }
                >
                  {agent.success >= 95 ? "Excellent" : "Good"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
