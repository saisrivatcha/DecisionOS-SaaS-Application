export interface MockScenario {
  id: string;
  demoLabel: string;
  customer: string;
  context: string;
  notes: string;
  revenue: string;
  priority: "High" | "Medium" | "Low";
  stats: {
    arr: string;
    end: string;
    days: string;
    nps: string;
    tier: string;
    since: string;
  };
  stakeholders: Array<{ name: string; role: string; sentiment: string; color: string; bg: string }>;
  risks: Array<{ text: string; level: "High" | "Medium" | "Low" }>;
  history: Array<{ date: string; action: string; outcome: string }>;
  evidence: string[];
  questions: string[];
  strategies: Array<{
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
  }>;
}

export const DEMO_SCENARIOS: MockScenario[] = [
  {
    id: "SCENARIO_01",
    demoLabel: "1. Pricing Objection (CFO Pushback)",
    customer: "Acme Corporation",
    context: "Pricing",
    notes: "The CFO is pushing back on our renewal pricing and wants a 20% discount. They are actively evaluating a cheaper competitor and their evaluation window closes in 12 days.",
    revenue: "$245,000",
    priority: "High",
    stats: { arr: "$245,000", end: "Aug 31, 2026", days: "67 days", nps: "48 (+18 vs Q1)", tier: "Enterprise", since: "March 2022" },
    stakeholders: [
      { name: "Mike Torres", role: "VP of Engineering", sentiment: "Champion", color: "#059669", bg: "#f0fdf4" },
      { name: "Lisa Chen", role: "CFO", sentiment: "Skeptical", color: "#b45309", bg: "#fffbeb" },
    ],
    risks: [
      { text: "CFO has not approved the renewal budget", level: "High" },
      { text: "Active competitor evaluation — closes in 12 days", level: "High" },
    ],
    history: [
      { date: "Mar 2026", action: "Sent ROI report after QBR concerns", outcome: "Customer NPS rose 18 points" }
    ],
    evidence: ["May 2026 QBR transcript — champion expressed strong renewal intent"],
    questions: ["What is the CFO's exact budget authority limit?"],
    strategies: [
      { id: "s1", title: "Executive Business Review", description: "Schedule an EBR with VP-level stakeholders to realign on value, address concerns, and confirm next steps.", probability: 88, impact: "Highest renewal probability", risk: "Low", timeRequired: "7–14 days", resources: "VP Sales + AE", recommended: true, accent: "#4f46e5", bg: "#f0f0f8" },
      { id: "s2", title: "Renewal Incentive", description: "Offer a multi-year commitment with a modest discount and enhanced SLA guarantee.", probability: 71, impact: "Secures ARR with minor concession", risk: "Low", timeRequired: "3–5 days", resources: "AE + Finance", accent: "#0284c7", bg: "#f0f9ff" },
      { id: "s3", title: "Hold Position", description: "Maintain pricing, send ROI evidence report, and allow the evaluation to finish.", probability: 34, impact: "Risk of losing to competitor", risk: "High", timeRequired: "14+ days", resources: "AE only", accent: "#6b6b80", bg: "#f7f7f9" },
    ]
  },
  {
    id: "SCENARIO_02",
    demoLabel: "2. Churn Risk (Low Adoption)",
    customer: "GlobalRetail Ltd.",
    context: "Renewal",
    notes: "Usage has dropped by 40% in the last quarter. Our main champion left the company, and the new VP of Ops hasn't logged into the platform in 45 days.",
    revenue: "$92,000",
    priority: "Medium",
    stats: { arr: "$92,000", end: "Sep 15, 2026", days: "82 days", nps: "12 (-20 vs Q1)", tier: "Mid-Market", since: "Nov 2023" },
    stakeholders: [
      { name: "Sarah Jenkins", role: "VP of Ops (New)", sentiment: "Neutral", color: "#6b6b80", bg: "#f7f7f9" },
    ],
    risks: [
      { text: "Usage dropped 40% in Q2", level: "High" },
      { text: "No champion relationship established with new VP", level: "High" },
    ],
    history: [
      { date: "May 2026", action: "Sent automated 'we miss you' emails", outcome: "No response (0% open rate)" }
    ],
    evidence: ["Mixpanel Data: Zero logins from Executive team since April"],
    questions: ["What are the new VP's strategic priorities for Q3?"],
    strategies: [
      { id: "s1", title: "On-site Re-onboarding", description: "Offer a free, half-day on-site training workshop for the new VP's team.", probability: 65, impact: "Resets relationship, boosts adoption", risk: "Medium", timeRequired: "21 days", resources: "CSM + Solutions Engineer", recommended: true, accent: "#4f46e5", bg: "#f0f0f8" },
      { id: "s2", title: "Downgrade Offer", description: "Proactively offer a lower tier to keep them as a customer while they transition.", probability: 82, impact: "Retains logo, loses 30% ARR", risk: "Low", timeRequired: "7 days", resources: "AE", accent: "#0284c7", bg: "#f0f9ff" },
      { id: "s3", title: "Do Nothing", description: "Send standard renewal notice at 30 days out.", probability: 12, impact: "Likely complete churn", risk: "High", timeRequired: "0 days", resources: "None", accent: "#6b6b80", bg: "#f7f7f9" },
    ]
  },
  {
    id: "SCENARIO_03",
    demoLabel: "3. Upsell Opportunity (Cross-department)",
    customer: "Meridian Health",
    context: "Upsell",
    notes: "The product team is fully deployed. Now Legal and Finance are asking for read-only access to our analytics module, but they balked at the $400/seat price.",
    revenue: "$310,000",
    priority: "High",
    stats: { arr: "$310,000", end: "Dec 31, 2027", days: "550 days", nps: "64 (Top 5%)", tier: "Strategic", since: "Jan 2020" },
    stakeholders: [
      { name: "Dr. Evans", role: "Product VP", sentiment: "Champion", color: "#059669", bg: "#f0fdf4" },
      { name: "Finance Team", role: "Finance", sentiment: "Skeptical", color: "#b45309", bg: "#fffbeb" },
    ],
    risks: [
      { text: "Finance might block expansion if perceived as too expensive", level: "Medium" },
    ],
    history: [
      { date: "Jan 2026", action: "Upgraded Product Team to Enterprise Tier", outcome: "100% license utilization" }
    ],
    evidence: ["Support tickets: 14 requests from Finance asking for export access"],
    questions: ["How many total users in Legal/Finance actually need access?"],
    strategies: [
      { id: "s1", title: "Site License Upgrade", description: "Pitch a flat-rate 'Unlimited Read-Only' site license for the entire org.", probability: 78, impact: "+$85K ARR", risk: "Low", timeRequired: "14 days", resources: "AE + Deal Desk", recommended: true, accent: "#059669", bg: "#f0fdf4" },
      { id: "s2", title: "Bundle Discount", description: "Offer a 40% discount on read-only seats if they buy 50+ seats upfront.", probability: 55, impact: "+$12K ARR minimum", risk: "Medium", timeRequired: "30 days", resources: "AE", accent: "#0284c7", bg: "#f0f9ff" },
      { id: "s3", title: "Free Trial", description: "Give Finance 30 days of free access to prove value before charging.", probability: 40, impact: "Delayed revenue, high admin overhead", risk: "High", timeRequired: "45 days", resources: "CSM", accent: "#6b6b80", bg: "#f7f7f9" },
    ]
  },
  {
    id: "SCENARIO_04",
    demoLabel: "4. Compliance Block (Security Audit)",
    customer: "FinBank Global",
    context: "Other",
    notes: "Their InfoSec team just flagged our recent sub-processor change. They are threatening to halt deployment until we pass a custom 200-question security audit.",
    revenue: "$1.2M",
    priority: "High",
    stats: { arr: "$1,200,000", end: "May 01, 2028", days: "700+ days", nps: "32", tier: "Strategic", since: "Aug 2024" },
    stakeholders: [
      { name: "Marcus Reed", role: "CISO", sentiment: "Skeptical", color: "#dc2626", bg: "#fef2f2" },
    ],
    risks: [
      { text: "Deployment halted, risking $1.2M recognized revenue", level: "High" },
      { text: "Custom audit could take 6 weeks of engineering time", level: "High" },
    ],
    history: [],
    evidence: ["Email from InfoSec demanding immediate SOC2 Type II appendix"],
    questions: ["Will they accept our standard SOC2 report instead of the custom questionnaire?"],
    strategies: [
      { id: "s1", title: "Executive Security Briefing", description: "Our CISO gets on a call with their CISO to review our updated SOC2 report and bypass the questionnaire.", probability: 85, impact: "Saves 6 weeks of work, unblocks deal", risk: "Low", timeRequired: "2 days", resources: "CISO + AE", recommended: true, accent: "#4f46e5", bg: "#f0f0f8" },
      { id: "s2", title: "Outsource Audit Response", description: "Use our compliance partner (Vanta/Drata) to auto-fill the 200 questions.", probability: 60, impact: "Delays deployment by 2 weeks", risk: "Medium", timeRequired: "14 days", resources: "Compliance Team", accent: "#0284c7", bg: "#f0f9ff" },
      { id: "s3", title: "Push Back", description: "Refuse the custom audit based on clause 4.2 in the MSA.", probability: 10, impact: "High risk of contract termination", risk: "High", timeRequired: "30+ days", resources: "Legal Team", accent: "#6b6b80", bg: "#f7f7f9" },
    ]
  },
  {
    id: "SCENARIO_05",
    demoLabel: "5. Feature Request Escalation",
    customer: "StartupXYZ",
    context: "Feature Request",
    notes: "They are demanding a custom integration with their bespoke internal tool. The CEO emailed our CEO directly saying they will churn if it's not built this quarter.",
    revenue: "$48,000",
    priority: "Medium",
    stats: { arr: "$48,000", end: "Feb 28, 2027", days: "245 days", nps: "55", tier: "Growth", since: "Feb 2025" },
    stakeholders: [
      { name: "Alex Founder", role: "CEO", sentiment: "Skeptical", color: "#dc2626", bg: "#fef2f2" },
    ],
    risks: [
      { text: "CEO-level escalation creates internal panic", level: "Medium" },
      { text: "Building custom integration derails Q3 roadmap", level: "High" },
    ],
    history: [],
    evidence: ["Email from StartupXYZ CEO to our CEO"],
    questions: ["Can their bespoke tool use our existing public API?"],
    strategies: [
      { id: "s1", title: "API Solutions Architect Session", description: "Offer a free consultation with our Solutions Engineer to show them how to build it themselves using our public API.", probability: 75, impact: "Saves engineering roadmap, satisfies customer", risk: "Low", timeRequired: "5 days", resources: "Solutions Engineer", recommended: true, accent: "#4f46e5", bg: "#f0f0f8" },
      { id: "s2", title: "Paid Professional Services", description: "Offer to build it for them for a one-time $25k Professional Services fee.", probability: 40, impact: "Generates one-time revenue, strains engineering", risk: "Medium", timeRequired: "45 days", resources: "AE + Eng", accent: "#0284c7", bg: "#f0f9ff" },
      { id: "s3", title: "Commit to Q4 Roadmap", description: "Agree to build it, but push the delivery timeline to Q4.", probability: 20, impact: "High risk of immediate churn", risk: "High", timeRequired: "90 days", resources: "Product Team", accent: "#6b6b80", bg: "#f7f7f9" },
    ]
  },
  { id: "SCENARIO_06", demoLabel: "6. Implementation Delay (Resource Bottleneck)", customer: "HealthPlus", context: "Other", notes: "Implementation is 3 weeks behind because their IT team hasn't provided the necessary database access.", revenue: "$150,000", priority: "Medium", stats: { arr: "$150,000", end: "N/A", days: "N/A", nps: "N/A", tier: "Enterprise", since: "New" }, stakeholders: [], risks: [{ text: "Delayed go-live impacts time-to-value", level: "Medium" }], history: [], evidence: [], questions: [], strategies: [
    { id: "s1", title: "Executive Escalation", description: "Escalate to the executive sponsor to unblock IT.", probability: 80, impact: "Unblocks implementation", risk: "Low", timeRequired: "3 days", resources: "CSM", recommended: true, accent: "#4f46e5", bg: "#f0f0f8" },
    { id: "s2", title: "Technical Workaround", description: "Use mock data temporarily to proceed with training while IT provisions access.", probability: 60, impact: "Maintains momentum", risk: "Medium", timeRequired: "7 days", resources: "Solutions Engineer", accent: "#0284c7", bg: "#f0f9ff" },
    { id: "s3", title: "Pause Implementation", description: "Formally pause billing and implementation until IT is ready.", probability: 20, impact: "Delays revenue recognition", risk: "High", timeRequired: "0 days", resources: "Finance", accent: "#6b6b80", bg: "#f7f7f9" }
  ] },
  { id: "SCENARIO_07", demoLabel: "7. Payment Dispute (Missing Invoice)", customer: "Logistics Pro", context: "Complaint", notes: "Customer claims they never received the invoice and are refusing to pay late fees.", revenue: "$65,000", priority: "Low", stats: { arr: "$65,000", end: "N/A", days: "N/A", nps: "N/A", tier: "Mid-Market", since: "Old" }, stakeholders: [], risks: [], history: [], evidence: [], questions: [], strategies: [
    { id: "s1", title: "Waive Late Fees", description: "Waive the late fee as a one-time courtesy and set up auto-pay.", probability: 95, impact: "Resolves dispute instantly", risk: "Low", timeRequired: "1 day", resources: "Finance", recommended: true, accent: "#4f46e5", bg: "#f0f0f8" },
    { id: "s2", title: "Split the Difference", description: "Offer a 50% reduction in late fees.", probability: 50, impact: "Saves some fee revenue, risks anger", risk: "Medium", timeRequired: "3 days", resources: "AE", accent: "#0284c7", bg: "#f0f9ff" },
    { id: "s3", title: "Enforce Contract", description: "Hold firm on standard policy due to 90-day delinquency.", probability: 10, impact: "High churn risk", risk: "High", timeRequired: "14 days", resources: "Legal", accent: "#6b6b80", bg: "#f7f7f9" }
  ] },
  { id: "SCENARIO_08", demoLabel: "8. Competitor Threat (Discounting)", customer: "EduTech Solutions", context: "Pricing", notes: "Competitor offered them a 50% discount to switch.", revenue: "$110,000", priority: "High", stats: { arr: "$110,000", end: "N/A", days: "N/A", nps: "N/A", tier: "Enterprise", since: "2021" }, stakeholders: [], risks: [{ text: "High churn risk due to aggressive competitor pricing", level: "High" }], history: [], evidence: [], questions: [], strategies: [
    { id: "s1", title: "Value-based Counter", description: "Highlight switching costs and missing competitor features.", probability: 60, impact: "Protects margins", risk: "Medium", timeRequired: "7 days", resources: "AE", recommended: true, accent: "#4f46e5", bg: "#f0f0f8" },
    { id: "s2", title: "Price Match", description: "Offer a temporary 1-year discount to match competitor pricing.", probability: 85, impact: "Retains logo, hurts margin", risk: "Low", timeRequired: "3 days", resources: "Finance", accent: "#0284c7", bg: "#f0f9ff" },
    { id: "s3", title: "Product Bundle", description: "Throw in premium features for free instead of dropping price.", probability: 45, impact: "Maintains core pricing integrity", risk: "Medium", timeRequired: "14 days", resources: "Product", accent: "#6b6b80", bg: "#f7f7f9" }
  ] },
  { id: "SCENARIO_09", demoLabel: "9. Executive Sponsor Left", customer: "CloudNet", context: "Renewal", notes: "Our main champion and buyer just left for a competitor.", revenue: "$320,000", priority: "High", stats: { arr: "$320,000", end: "N/A", days: "N/A", nps: "N/A", tier: "Strategic", since: "2019" }, stakeholders: [], risks: [{ text: "Orphaned account with no internal advocacy", level: "High" }], history: [], evidence: [], questions: [], strategies: [
    { id: "s1", title: "Map New Org Chart", description: "Immediately engage the interim leader with a summary of our past ROI.", probability: 70, impact: "Re-establishes foothold", risk: "Medium", timeRequired: "14 days", resources: "VP Sales", recommended: true, accent: "#4f46e5", bg: "#f0f0f8" },
    { id: "s2", title: "Grassroots Campaign", description: "Empower daily end-users to advocate for the tool to the new leadership.", probability: 45, impact: "Builds bottom-up momentum", risk: "Low", timeRequired: "30 days", resources: "CSM", accent: "#0284c7", bg: "#f0f9ff" },
    { id: "s3", title: "Executive Outreach", description: "Have our CEO reach out directly to their C-Suite to reaffirm partnership.", probability: 25, impact: "High-risk, high-reward approach", risk: "High", timeRequired: "5 days", resources: "CEO", accent: "#6b6b80", bg: "#f7f7f9" }
  ] },
  { id: "SCENARIO_10", demoLabel: "10. Major Bug (Data Loss)", customer: "FinServe Corp", context: "Complaint", notes: "A bug in our recent release caused them to lose 4 hours of reporting data.", revenue: "$500,000", priority: "High", stats: { arr: "$500,000", end: "N/A", days: "N/A", nps: "N/A", tier: "Strategic", since: "2018" }, stakeholders: [], risks: [{ text: "Breach of SLA, potential lawsuit", level: "High" }], history: [], evidence: [], questions: [], strategies: [
    { id: "s1", title: "Root Cause Analysis (RCA) + Credit", description: "Provide a full RCA document within 24 hours and a 1-month SLA credit.", probability: 90, impact: "Restores trust, costs 1 month MRR", risk: "Low", timeRequired: "24 hours", resources: "Eng + Legal", recommended: true, accent: "#4f46e5", bg: "#f0f0f8" },
    { id: "s2", title: "Premium Support Upgrade", description: "Offer 6 months of free Platinum Support as an apology.", probability: 60, impact: "Cheaper than an SLA credit", risk: "Medium", timeRequired: "3 days", resources: "CS Director", accent: "#0284c7", bg: "#f0f9ff" },
    { id: "s3", title: "Do Nothing", description: "Wait for them to initiate a formal complaint or lawsuit.", probability: 5, impact: "Guaranteed churn, legal risk", risk: "High", timeRequired: "0 days", resources: "None", accent: "#6b6b80", bg: "#f7f7f9" }
  ] }
];
