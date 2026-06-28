import { useState } from "react";
import {
  Search, CheckCircle, XCircle, Clock, Tag,
  Calendar, DollarSign, Users, ArrowRight, BookOpen, Sparkles,
} from "lucide-react";
import type { Page, SharedDecision } from "../App";

const exampleQueries = [
  "Show all renewals where Finance disagreed",
  "Find pricing discussions with Amazon",
  "Show decisions where discount was rejected",
  "Renewals without executive sponsor",
  "Feature requests related to compliance",
];

const fullRecords = [
  {
    id: "D-2841", customer: "Acme Corporation", context: "Renewal", date: "Jun 27, 2026",
    revenue: "+$245K", department: "Sales", submittedBy: "James Chen",
    problem: "CFO-level pushback on renewal pricing with active Salesforce evaluation running in parallel.",
    decision: "Schedule Executive Business Review within 14 days",
    reason: "Past data showed EBR resolves CFO objections in 82% of similar cases when the evaluation is still in early stage.",
    outcome: "EBR held June 30 — CFO approved full renewal on July 2. No discount required.",
    lessons: "Early executive involvement prevents discount pressure. Start EBR > 90 days before renewal.",
    participants: ["James Chen (DA • Sales)", "Sarah L. (AE)", "Mike Torres (Customer VP)"],
    tags: ["renewal", "executive-alignment", "pricing", "competitive"],
    aiSummary: "High-urgency renewal with procurement resistance. EBR strategy outperformed 8 of 10 similar cases.",
    relatedIds: ["D-2839"],
  },
  {
    id: "D-2839", customer: "GlobalRetail Ltd.", context: "Renewal", date: "Jun 26, 2026",
    revenue: "+$92K", department: "Sales", submittedBy: "James Chen",
    problem: "Contract renewal with no champion engagement for 45 days. Procurement went silent.",
    decision: "Send formal renewal proposal with bundled SLA upgrade at no extra cost",
    reason: "A formal proposal with added value typically re-activates silent procurement teams.",
    outcome: "Proposal accepted within 4 days. Customer signed a 2-year deal.",
    lessons: "Silence from procurement often means internal review is in progress. A formal proposal can accelerate their timeline.",
    participants: ["Maria K. (AE)", "David Park (Customer Procurement)"],
    tags: ["renewal", "re-engagement", "silent-champion"],
    aiSummary: "Champion disengagement pattern. Formal proposal tactic succeeded — consistent with 7 past similar cases.",
    relatedIds: ["D-2841"],
  },
  {
    id: "D-2837", customer: "Meridian Health", context: "Upsell", date: "Jun 25, 2026",
    revenue: "+$310K", department: "Customer Success", submittedBy: "James Chen",
    problem: "Three teams at full platform capacity. Legal and Finance departments formally requested access.",
    decision: "Present expansion proposal directly to both departments without a pilot phase",
    reason: "Confirmed demand from both departments justified skipping the pilot to reduce time-to-revenue.",
    outcome: "Both departments onboarded in 3 weeks. Deal closed at $310K additional ARR.",
    lessons: "When user demand is already confirmed, pilots delay revenue by 6+ weeks with no risk reduction benefit.",
    participants: ["Sarah L. (AE)", "Priya N. (CS Manager)", "Dr. Chen (Customer CTO)"],
    tags: ["upsell", "expansion", "healthcare", "no-pilot"],
    aiSummary: "Clear expansion opportunity. Skipping pilot reduced time-to-close by 6 weeks vs. typical expansion pattern.",
    relatedIds: [],
  },
  {
    id: "D-2834", customer: "Horizon Logistics", context: "Complaint", date: "Jun 24, 2026",
    revenue: "−$78K", department: "Customer Success", submittedBy: "James Chen",
    problem: "40% usage drop over 60 days. No CSM contact in 90 days. Customer escalated.",
    decision: "Send churn intervention playbook and schedule product training refresh",
    reason: "Usage drops were historically linked to onboarding gaps — training was the standard fix.",
    outcome: "Customer churned 45 days later. Root cause was budget reallocation, not onboarding.",
    lessons: "Usage drop alone does not diagnose churn cause. Always verify budget status before launching training interventions.",
    participants: ["Tom B. (CSM)", "Rachel G. (Customer Ops Lead)"],
    tags: ["churn", "at-risk", "wrong-diagnosis", "budget"],
    aiSummary: "Wrong strategy applied. Budget conversation should have preceded training recommendation. Critical lesson for churn playbook.",
    relatedIds: [],
  },
];

interface CompanyMemoryProps {
  decisions: SharedDecision[];
  onNavigate: (page: Page) => void;
}

export function CompanyMemory({ decisions: _approved, onNavigate }: CompanyMemoryProps) {
  const [query, setQuery]     = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const doSearch = (q: string) => {
    setQuery(q);
    setHasSearched(true);
    if (!selected) setSelected(fullRecords[0].id);
  };

  const filtered = hasSearched
    ? fullRecords.filter((r) => {
        const q = query.toLowerCase();
        return !q || r.customer.toLowerCase().includes(q) || r.problem.toLowerCase().includes(q) ||
          r.decision.toLowerCase().includes(q) || r.tags.some((t) => t.includes(q)) ||
          r.context.toLowerCase().includes(q) || r.outcome.toLowerCase().includes(q);
      })
    : fullRecords;

  const selectedRecord = fullRecords.find((r) => r.id === selected);

  return (
    <div className="flex h-full">
      {/* Left panel */}
      <div className="flex flex-col border-r flex-shrink-0" style={{ width: 340, background: "#fff", borderColor: "#e8e8ed" }}>

        {/* Hero search */}
        <div className="p-5 border-b" style={{ borderColor: "#e8e8ed" }}>
          <div className="mb-3">
            <h2 className="font-semibold" style={{ color: "#1a1a2e" }}>Company Memory</h2>
            <p className="text-xs mt-0.5" style={{ color: "#a0a0b0" }}>
              {fullRecords.length} decisions · {fullRecords.filter((r) => r.outcome.includes("+")).length} successful · Search anything
            </p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); doSearch(query); }}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all focus-within:border-indigo-400"
            style={{ borderColor: "#e8e8ed", background: "#f7f7f9" }}
          >
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#a0a0b0" }} />
            <input
              className="flex-1 bg-transparent border-0 outline-none text-sm"
              placeholder='e.g. "renewals where Finance disagreed"'
              style={{ color: "#1a1a2e" }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button type="button" onClick={() => { setQuery(""); setHasSearched(false); }} style={{ color: "#a0a0b0" }}>
                ✕
              </button>
            )}
          </form>

          {/* Example queries */}
          {!hasSearched && (
            <div className="mt-3 space-y-1.5">
              {exampleQueries.map((q) => (
                <button
                  key={q}
                  onClick={() => doSearch(q)}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-xs"
                  style={{ color: "#4f46e5" }}
                >
                  <Search className="w-3 h-3 flex-shrink-0 opacity-50" />
                  {q}
                </button>
              ))}
            </div>
          )}

          {hasSearched && (
            <div className="mt-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#4f46e5" }} />
              <span className="text-xs font-medium" style={{ color: "#4f46e5" }}>
                {filtered.length} decisions found
              </span>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: "#f5f5f8" }}>
          {filtered.map((record) => {
            const isSuccess = record.outcome.includes("+") || record.revenue.startsWith("+");
            const isActive = selected === record.id;
            return (
              <button
                key={record.id}
                onClick={() => setSelected(record.id)}
                className="w-full text-left px-4 py-4 transition-colors"
                style={{ background: isActive ? "#f7f7fb" : "#fff" }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono" style={{ color: "#a0a0b0" }}>{record.id}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: "#f0f0f8", color: "#4f46e5" }}>
                      {record.context}
                    </span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: isSuccess ? "#059669" : "#dc2626" }}>
                    {record.revenue}
                  </span>
                </div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: "#1a1a2e" }}>{record.customer}</p>
                <p className="text-xs line-clamp-2 mb-2 leading-relaxed" style={{ color: "#6b6b80" }}>{record.problem}</p>
                <div className="flex flex-wrap gap-1">
                  {record.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: "#f3f3f7", color: "#6b6b80" }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm font-medium mb-1" style={{ color: "#1a1a2e" }}>No decisions found</p>
              <p className="text-xs" style={{ color: "#a0a0b0" }}>Try different search terms</p>
            </div>
          )}
        </div>
      </div>

      {/* Right detail */}
      <div className="flex-1 overflow-y-auto" style={{ background: "#f7f7f9" }}>
        {selectedRecord ? (
          <div className="p-8 max-w-2xl">
            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono" style={{ color: "#a0a0b0" }}>{selectedRecord.id}</span>
                <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: "#f0f0f8", color: "#4f46e5" }}>{selectedRecord.context}</span>
                <span className="flex items-center gap-1 text-xs font-medium" style={{ color: selectedRecord.revenue.startsWith("+") ? "#059669" : "#dc2626" }}>
                  {selectedRecord.revenue.startsWith("+") ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {selectedRecord.revenue.startsWith("+") ? "Succeeded" : "Failed"}
                </span>
              </div>
              <h1 className="text-xl font-semibold mb-1.5" style={{ color: "#1a1a2e" }}>{selectedRecord.customer}</h1>
              <div className="flex items-center gap-4 text-xs" style={{ color: "#a0a0b0" }}>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{selectedRecord.date}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /><strong style={{ color: selectedRecord.revenue.startsWith("+") ? "#059669" : "#dc2626" }}>{selectedRecord.revenue}</strong></span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{selectedRecord.department}</span>
              </div>
            </div>

            {/* AI Summary — prominent */}
            <div
              className="rounded-2xl p-4 mb-5 flex items-start gap-3"
              style={{ background: "#f0f0f8", border: "1px solid #ddddf0" }}
            >
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#4f46e5" }} />
              <p className="text-sm leading-relaxed" style={{ color: "#3730a3" }}>{selectedRecord.aiSummary}</p>
            </div>

            <div className="space-y-4">
              <MemSection label="Problem">{selectedRecord.problem}</MemSection>
              <MemSection label="Decision">
                <div className="rounded-xl p-3.5" style={{ background: "#f0f0f8", border: "1px solid #ddddf0" }}>
                  <p className="font-semibold text-sm" style={{ color: "#1a1a2e" }}>{selectedRecord.decision}</p>
                </div>
              </MemSection>
              <MemSection label="Reason">{selectedRecord.reason}</MemSection>
              <MemSection label="Outcome">
                <div
                  className="rounded-xl p-3.5"
                  style={{
                    background: selectedRecord.revenue.startsWith("+") ? "#f0fdf4" : "#fef2f2",
                    border: `1px solid ${selectedRecord.revenue.startsWith("+") ? "#bbf7d0" : "#fecaca"}`,
                  }}
                >
                  <p className="text-sm" style={{ color: selectedRecord.revenue.startsWith("+") ? "#166534" : "#991b1b" }}>
                    {selectedRecord.outcome}
                  </p>
                </div>
              </MemSection>
              <MemSection label="Lessons Learned">
                <div
                  className="rounded-xl p-3.5"
                  style={{
                    background: selectedRecord.revenue.startsWith("-") ? "#fef2f2" : "#fffbeb",
                    border: `1px solid ${selectedRecord.revenue.startsWith("-") ? "#fecaca" : "#fde68a"}`,
                  }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: selectedRecord.revenue.startsWith("-") ? "#991b1b" : "#92400e" }}>
                    {selectedRecord.lessons}
                  </p>
                </div>
              </MemSection>
              <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
                <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a0a0b0" }}>People Involved</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRecord.participants.map((p) => (
                    <span key={p} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#f7f7f9", color: "#374151" }}>{p}</span>
                  ))}
                </div>
              </div>
              {/* Tags */}
              <div className="flex items-center gap-2 pt-1">
                <Tag className="w-3.5 h-3.5" style={{ color: "#a0a0b0" }} />
                {selectedRecord.tags.map((t) => (
                  <button
                    key={t}
                    onClick={() => doSearch(t)}
                    className="text-xs px-2 py-0.5 rounded font-mono hover:bg-indigo-50 transition-colors"
                    style={{ background: "#f3f3f7", color: "#6b6b80" }}
                  >
                    #{t}
                  </button>
                ))}
              </div>
              {/* Related */}
              {selectedRecord.relatedIds.length > 0 && (
                <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
                  <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a0a0b0" }}>Related Decisions</h4>
                  {selectedRecord.relatedIds.map((rid) => {
                    const rel = fullRecords.find((r) => r.id === rid);
                    if (!rel) return null;
                    return (
                      <button key={rid} onClick={() => setSelected(rid)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-left" style={{ background: "#f7f7f9" }}>
                        <div>
                          <span className="text-xs font-mono mr-2" style={{ color: "#a0a0b0" }}>{rid}</span>
                          <span className="text-sm font-medium" style={{ color: "#1a1a2e" }}>{rel.customer}</span>
                          <p className="text-xs mt-0.5" style={{ color: "#6b6b80" }}>{rel.decision}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <span className="text-xs font-semibold" style={{ color: rel.revenue.startsWith("+") ? "#059669" : "#dc2626" }}>{rel.revenue}</span>
                          <ArrowRight className="w-3.5 h-3.5" style={{ color: "#a0a0b0" }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <BookOpen className="w-10 h-10 mb-3" style={{ color: "#d1d1db" }} />
            <p className="text-sm font-medium" style={{ color: "#1a1a2e" }}>Search company decisions above</p>
            <p className="text-xs mt-1" style={{ color: "#a0a0b0" }}>Every approved decision lives here permanently</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MemSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
      <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a0a0b0" }}>{label}</h4>
      {typeof children === "string"
        ? <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{children}</p>
        : children}
    </div>
  );
}
