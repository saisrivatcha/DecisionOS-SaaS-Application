import { useState, useEffect, useCallback } from "react";
import { LoginPage } from "./components/LoginPage";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { ContributorDashboard } from "./components/ContributorDashboard";
import { ContributorSubmissionView } from "./components/ContributorSubmissionView";
import { DecisionsPage } from "./components/DecisionsPage";
import { DecisionWorkspace } from "./components/DecisionWorkspace";
import { PendingReviews } from "./components/PendingReviews";
import { CompanyMemory } from "./components/CompanyMemory";
import { InsightsPage } from "./components/InsightsPage";
import { SettingsPage } from "./components/SettingsPage";
import { KnowledgeBase } from "./components/KnowledgeBase";

export type Page =
  | "dashboard"
  | "capture-decision"    // contributor: new submission form
  | "my-decisions"        // contributor: list of own submissions
  | "submission-view"     // contributor: track a specific submission (NO AI)
  | "pending-reviews"     // architect: review queue
  | "workspace"           // architect: full AI analysis + approve/reject
  | "memory"              // architect: organizational memory
  | "knowledge-base"      // contributor: knowledge base integrations
  | "insights"            // architect: insights
  | "settings"            // architect: department settings
  | "profile";            // contributor: profile

export type UserRole = "architect" | "contributor";

export interface User {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  initials: string;
  roleLabel: string;
  department: string;
}

export interface DecisionDraft {
  id?: string;
  entity: string;
  entityType: string;
  notes: string;
  isNew: boolean;
  // compat shim
  customer?: string;
  context?: string;
  scenarioId?: string;
}

export interface SharedDecision {
  id: string;
  customer: string;
  context: string;
  submittedBy: string;
  status: "draft" | "submitted" | "in-review" | "approved" | "rejected";
  date: string;
  revenue: string;
  summary: string;
  priority?: "High" | "Medium" | "Low";
  rejectionNote?: string;
  approvedStrategy?: string;
  outcome?: string;
  scenarioId?: string;
}

const INITIAL_DECISIONS: SharedDecision[] = [
  { id: "D-2840", customer: "TechCorp Inc.",     context: "Pricing",  submittedBy: "Sarah Lee",  status: "in-review", date: "Jun 27", revenue: "$180K", summary: "Procurement raised a 30% pricing objection. Evaluation window closes in 12 days.", priority: "High" },
  { id: "D-2838", customer: "StartupXYZ",        context: "Complaint",submittedBy: "Sarah Lee",  status: "submitted", date: "Jun 26", revenue: "$48K",  summary: "VP-level escalation after data export bug blocked finance workflow.", priority: "Medium" },
  { id: "D-2835", customer: "Beacon Analytics",  context: "Renewal",  submittedBy: "Sarah Lee",  status: "approved",  date: "Jun 24", revenue: "$155K", summary: "Success team integration workshop to drive adoption before renewal.", approvedStrategy: "Schedule Integration Workshop within 10 days", priority: "Medium" },
  { id: "D-2841", customer: "Acme Corporation",  context: "Renewal",  submittedBy: "James Chen", status: "approved",  date: "Jun 27", revenue: "$245K", summary: "CFO-level pushback on renewal pricing with active competitor evaluation.", approvedStrategy: "Executive Business Review within 14 days", priority: "High" },
  { id: "D-2839", customer: "GlobalRetail Ltd.", context: "Renewal",  submittedBy: "James Chen", status: "approved",  date: "Jun 26", revenue: "$92K",  summary: "Contract renewal with no champion engagement for 45 days.", approvedStrategy: "Send formal renewal proposal with bundled SLA upgrade", priority: "Low" },
  { id: "D-2837", customer: "Meridian Health",   context: "Upsell",   submittedBy: "James Chen", status: "approved",  date: "Jun 25", revenue: "$310K", summary: "3 teams at full capacity. Legal and Finance departments requesting access.", approvedStrategy: "Present expansion proposal directly to both departments", priority: "High" },
];

const DEMO_USERS: User[] = [
  { name: "James Chen", email: "james@acme.com", password: "demo", role: "architect",    initials: "JC", roleLabel: "DA • Sales", department: "Sales" },
  { name: "Sarah Lee",  email: "sarah@acme.com", password: "demo", role: "contributor",  initials: "SL", roleLabel: "DC • Sales", department: "Sales" },
];

export { DEMO_USERS };

const VALID_PAGES: Page[] = [
  "dashboard", "capture-decision", "my-decisions", "submission-view",
  "pending-reviews", "workspace", "memory", "knowledge-base", "insights", "settings", "profile",
];

function getInitialPage(): Page {
  const params = new URLSearchParams(window.location.search);
  const pageParam = params.get("page") || params.get("returnTo");
  if (pageParam && VALID_PAGES.includes(pageParam as Page)) {
    return pageParam as Page;
  }
  return "dashboard";
}

export default function App() {
  const [user, setUser]                   = useState<User | null>(null);
  const [page, setPage]                   = useState<Page>(getInitialPage);
  const [draft, setDraft]                 = useState<DecisionDraft | null>(null);
  const [decisions, setDecisions]         = useState<SharedDecision[]>(INITIAL_DECISIONS);
  const [activeDecisionId, setActiveDecisionId] = useState<string | null>(null);

  const mapApiDecision = (d: any): SharedDecision => ({
    id: d.id,
    customer: d.customer || d.organization?.name || "Unknown",
    context: d.context?.length > 20 ? d.context.slice(0, 20) + "..." : d.context || "Discussion",
    submittedBy: d.submitter?.name || "Demo User",
    status: d.status?.toLowerCase() === 'pending_review' ? 'in-review'
          : d.status?.toLowerCase() === 'approved' ? 'approved'
          : d.status?.toLowerCase() === 'rejected' ? 'rejected'
          : d.status?.toLowerCase() || 'submitted',
    date: new Date(d.createdAt).toLocaleDateString(),
    revenue: "TBD",
    summary: d.context?.slice(0, 100) || "",
    priority: (d.priority || "Medium") as any,
    scenarioId: d.id,
    // @ts-ignore pass strategies so workspace can render them
    strategies: d.strategies
  });

  const fetchDecisions = useCallback(() => {
    fetch('/api/decisions')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data) && data.length > 0) {
           const mapped = data.map(mapApiDecision);
           setDecisions(prev => {
             // Merge: API decisions first, then keep initial decisions that aren't in API
             const apiIds = new Set(mapped.map((d: SharedDecision) => d.id));
             const kept = prev.filter(d => !apiIds.has(d.id) && !d.id.startsWith('D-'));
             return [...mapped, ...INITIAL_DECISIONS.filter(d => !apiIds.has(d.id))];
           });
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchDecisions();
  }, [fetchDecisions]);

  // Poll for status updates every 10 seconds when contributor is viewing their submissions
  useEffect(() => {
    if (!user || user.role === 'architect') return;
    const interval = setInterval(fetchDecisions, 10000);
    return () => clearInterval(interval);
  }, [user, fetchDecisions]);

  const navigate = (p: Page) => {
    setPage(p);
    const params = new URLSearchParams(window.location.search);
    params.set("page", p);
    params.delete("google_auth");
    params.delete("returnTo");
    params.delete("synced");
    window.history.replaceState({}, document.title, `/?${params.toString()}`);
  };

  const openWorkspace = (d: DecisionDraft) => {
    // If opening from a decision that has strategies, attach them to the draft
    const matchingDecision = decisions.find(dec => dec.id === d.id);
    const enrichedDraft = {
      ...d,
      customer: d.entity || (matchingDecision as any)?.customer,
      context: d.entityType || (matchingDecision as any)?.context,
      summary: d.notes || (matchingDecision as any)?.summary,
      strategies: (matchingDecision as any)?.strategies || (d as any)?.strategies || [],
    };
    setDraft(enrichedDraft);
    setPage("workspace");
  };

  const openSubmissionView = (id: string) => {
    setActiveDecisionId(id);
    setPage("submission-view");
  };

  const handleApprove = async (id: string, strategy: string) => {
    try {
      await fetch(`/api/decisions/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategyId: strategy })
      });
      setDecisions((prev) =>
        prev.map((d) => d.id === id ? { ...d, status: "approved", approvedStrategy: strategy } : d)
      );
      // Refetch to ensure consistency
      setTimeout(fetchDecisions, 500);
    } catch(e) { console.error(e); }
  };

  const handleReject = async (id: string, note: string) => {
    try {
      await fetch(`/api/decisions/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: note })
      });
      setDecisions((prev) =>
        prev.map((d) => d.id === id ? { ...d, status: "rejected", rejectionNote: note } : d)
      );
      // Refetch to ensure consistency
      setTimeout(fetchDecisions, 500);
    } catch(e) { console.error(e); }
  };

  const handleWorkspaceApprove = () => {
    setDraft(null);
    navigate("memory");
  };

  const handleNewSubmission = async (d: DecisionDraft) => {
    try {
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: d.notes,
          entity: d.entity,
          priority: "Medium"
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${res.status}`);
      }

      const data = await res.json();
      
      const newDec: SharedDecision = {
        id: data.id,
        customer: d.entity,
        context: d.entityType ?? "Discussion",
        submittedBy: user?.name ?? "Unknown",
        status: data.status?.toLowerCase() === 'pending_review' ? 'in-review' : (data.status?.toLowerCase() || 'submitted'),
        date: "Just now",
        revenue: "TBD",
        summary: d.notes.slice(0, 100) + (d.notes.length > 100 ? "…" : ""),
        priority: "Medium",
        scenarioId: data.id,
        // @ts-ignore
        strategies: data.strategies
      };
      setDecisions((prev) => [newDec, ...prev]);
      setActiveDecisionId(newDec.id);
      if (user?.role !== "architect") {
        setPage("submission-view");
      }
    } catch (e: any) {
      console.error(e);
      alert(`Failed to submit decision: ${e.message}`);
      throw e; // Rethrow so DecisionsPage can catch it
    }
  };

  if (!user) {
    return <LoginPage onLogin={(u) => { setUser(u); setPage("dashboard"); }} />;
  }

  const isArchitect = user.role === "architect";
  const pending = decisions.filter((d) => d.status === "submitted" || d.status === "in-review");
  const myDecisions = decisions.filter((d) => d.submittedBy === user.name);
  const activeDecision = decisions.find((d) => d.id === activeDecisionId) ?? null;

  const architectOnlyPages: Page[] = ["memory", "insights", "settings", "pending-reviews", "workspace"];
  const contributorOnlyPages: Page[] = ["knowledge-base"];
  const isRestricted =
    (!isArchitect && architectOnlyPages.includes(page)) ||
    (isArchitect && contributorOnlyPages.includes(page));

  return (
    <Layout page={page} onNavigate={navigate} user={user} onLogout={() => setUser(null)} pendingCount={pending.length}>

      {/* ── ARCHITECT PAGES ── */}
      {isArchitect && page === "dashboard" && (
        <Dashboard
          user={user}
          decisions={decisions}
          onNavigate={navigate}
          onOpenWorkspace={openWorkspace}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
      {isArchitect && page === "pending-reviews" && (
        <PendingReviews
          decisions={pending}
          onApprove={handleApprove}
          onReject={handleReject}
          onOpenWorkspace={openWorkspace}
        />
      )}
      {isArchitect && page === "workspace" && (
        <DecisionWorkspace
          draft={draft}
          onApprove={handleWorkspaceApprove}
          onReject={handleReject}
          onNavigate={navigate}
          userRole="architect"
        />
      )}
      {isArchitect && page === "memory" && (
        <CompanyMemory decisions={decisions.filter((d) => d.status === "approved")} onNavigate={navigate} />
      )}
      {isArchitect && page === "insights" && <InsightsPage decisions={decisions} />}
      {isArchitect && page === "settings" && <SettingsPage user={user} />}

      {/* ── CONTRIBUTOR PAGES ── */}
      {!isArchitect && page === "dashboard" && (
        <ContributorDashboard
          user={user}
          decisions={myDecisions}
          onNavigate={navigate}
          onOpenSubmission={openSubmissionView}
        />
      )}
      {!isArchitect && page === "capture-decision" && (
        <DecisionsPage onSubmit={handleNewSubmission} />
      )}
      {!isArchitect && page === "my-decisions" && (
        <ContributorDashboard
          user={user}
          decisions={myDecisions}
          onNavigate={navigate}
          onOpenSubmission={openSubmissionView}
          listOnly
        />
      )}
      {!isArchitect && page === "submission-view" && (
        <ContributorSubmissionView
          decision={activeDecision}
          onNavigate={navigate}
        />
      )}
      {!isArchitect && page === "knowledge-base" && <KnowledgeBase />}
      {!isArchitect && page === "profile" && <ProfilePage user={user} />}

      {/* ── RESTRICTED ── */}
      {isRestricted && (
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "#1a1a2e" }}>Access Restricted</h2>
          <p className="text-sm text-center mb-5" style={{ color: "#6b6b80", maxWidth: 280 }}>
            {isArchitect
              ? "This section is available to Decision Contributors only."
              : "This section is available to Decision Architects only."}
          </p>
          <button
            className="text-sm font-medium px-4 py-2 rounded-xl"
            style={{ background: "#f0f0f8", color: "#4f46e5" }}
            onClick={() => navigate("dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </Layout>
  );
}

function ProfilePage({ user }: { user: User }) {
  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold tracking-tight mb-6" style={{ color: "#1a1a2e" }}>Profile</h1>
      <div className="rounded-2xl border p-6" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold" style={{ background: "#ededf8", color: "#4f46e5" }}>
            {user.initials}
          </div>
          <div>
            <h2 className="font-semibold text-lg" style={{ color: "#1a1a2e" }}>{user.name}</h2>
            <p className="text-sm" style={{ color: "#6b6b80" }}>Decision Contributor · {user.department}</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: "Email", value: user.email },
            { label: "Role", value: "Decision Contributor" },
            { label: "Department", value: user.department },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2 border-b" style={{ borderColor: "#f3f3f7" }}>
              <span className="text-sm" style={{ color: "#a0a0b0" }}>{label}</span>
              <span className="text-sm font-medium" style={{ color: "#1a1a2e" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
