import { useState, useEffect, useRef } from "react";
import {
  Building2, FolderOpen, Truck, Users, Handshake,
  Upload, FileText, Mail, Database, Mic, FileImage,
  AlignLeft, Camera, CheckCircle, Loader, Sparkles,
  ChevronRight, X, AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";
import type { DecisionDraft } from "../App";

type EntityType = "Customer" | "Partner" | "Vendor" | "Internal Team" | "Project";
type DecisionType = "Renewal" | "Pricing" | "Complaint" | "Upsell" | "Feature Request" | "Other";
type Priority = "High" | "Medium" | "Low";

const entityTypes: { type: EntityType; icon: React.ElementType; desc: string }[] = [
  { type: "Customer",      icon: Building2,  desc: "Client, account, prospect" },
  { type: "Partner",       icon: Handshake,  desc: "Channel, alliance, reseller" },
  { type: "Vendor",        icon: Truck,      desc: "Supplier, tool, service" },
  { type: "Internal Team", icon: Users,      desc: "Engineering, Finance, HR…" },
  { type: "Project",       icon: FolderOpen, desc: "Product, initiative, campaign" },
];

const decisionTypes: { type: DecisionType; color: string; bg: string }[] = [
  { type: "Renewal",         color: "#4f46e5", bg: "#f0f0f8" },
  { type: "Pricing",         color: "#b45309", bg: "#fffbeb" },
  { type: "Complaint",       color: "#dc2626", bg: "#fef2f2" },
  { type: "Upsell",          color: "#059669", bg: "#f0fdf4" },
  { type: "Feature Request", color: "#0284c7", bg: "#f0f9ff" },
  { type: "Other",           color: "#6b6b80", bg: "#f7f7f9" },
];

const evidenceTypes = [
  { label: "Meeting Notes",    icon: FileText },
  { label: "CRM Notes",        icon: Database },
  { label: "Email Thread",     icon: Mail     },
  { label: "Call Transcript",  icon: Mic      },
  { label: "Document / PDF",   icon: FileImage },
  { label: "Screenshots",      icon: Camera   },
  { label: "Free Text",        icon: AlignLeft },
];

const pipelineSteps = [
  { label: "Uploading evidence",              detail: "Storing your files securely" },
  { label: "Reading business context",        detail: "Extracting key signals from your submission" },
  { label: "Searching Organizational Memory", detail: "Finding similar past decisions" },
  { label: "Identifying the business case",  detail: "AI surfacing the core decision needed" },
  { label: "Preparing review package",        detail: "Assembling evidence for architect review" },
  { label: "Ready",                           detail: "Submitted to your Decision Architect" },
];

interface DecisionsPageProps {
  onSubmit: (draft: DecisionDraft) => void;
}

export function DecisionsPage({ onSubmit }: DecisionsPageProps) {
  const [step, setStep]               = useState<1 | 2 | 3>(1);
  const [entityType, setEntityType]   = useState<EntityType | null>(null);
  const [entityName, setEntityName]   = useState("");
  const [decisionType, setDecisionType] = useState<DecisionType | null>(null);
  const [files, setFiles]             = useState<File[]>([]);
  const [freeText, setFreeText]       = useState("");
  const [dragging, setDragging]       = useState(false);
  const [summary, setSummary]         = useState("");
  const [involved, setInvolved]       = useState("");
  const [decision, setDecision]       = useState("");
  const [priority, setPriority]       = useState<Priority>("Medium");
  const [revenue, setRevenue]         = useState("");
  const [stage, setStage]             = useState<"idle" | "processing" | "done">("idle");
  const [pipelineStep, setPipelineStep] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  /* Pipeline animation */
  useEffect(() => {
    if (stage !== "processing") return;
    if (pipelineStep >= pipelineSteps.length - 1) {
      setTimeout(() => setStage("done"), 500);
      return;
    }
    const delay = pipelineStep === 0 ? 600 : pipelineStep <= 2 ? 900 : 1100;
    const t = setTimeout(() => setPipelineStep((s) => s + 1), delay);
    return () => clearTimeout(t);
  }, [stage, pipelineStep]);

  useEffect(() => {
    if (stage === "done") {
      const t = setTimeout(() => {
        onSubmit({
          entity: entityName || entityType || "Unknown",
          entityType: decisionType ?? entityType ?? "Discussion",
          notes: [summary, involved && `Involved: ${involved}`, decision && `Decision needed: ${decision}`].filter(Boolean).join("\n"),
          isNew: true,
        });
      }, 700);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    setFiles((p) => [...p, ...Array.from(e.dataTransfer.files)]);
  };

  const canGoStep2 = !!entityType && entityName.trim().length > 0 && !!decisionType;
  const canGoStep3 = files.length > 0 || freeText.trim().length > 10;
  const canSubmit  = summary.trim().length > 10;

  /* Processing screen */
  if (stage === "processing" || stage === "done") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "#f0f0f8" }}>
              <Sparkles className="w-5 h-5" style={{ color: "#4f46e5" }} />
            </div>
            <h3 className="font-semibold mb-1" style={{ color: "#1a1a2e" }}>Submitting your business case</h3>
            <p className="text-sm" style={{ color: "#6b6b80" }}>{entityName} · {decisionType}</p>
          </div>
          <div className="space-y-2">
            {pipelineSteps.map((s, i) => {
              const isDone    = i < pipelineStep;
              const isCurrent = i === pipelineStep && stage === "processing";
              const isPending = i > pipelineStep;
              return (
                <div
                  key={s.label}
                  className="flex items-center gap-3 rounded-2xl p-3.5 transition-all"
                  style={{ background: isCurrent ? "#fff" : "#f7f7f9", border: isCurrent ? "1px solid #ddddf0" : "1px solid transparent", opacity: isPending ? 0.35 : 1 }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: isDone ? "#059669" : isCurrent ? "#4f46e5" : "#e8e8ed" }}
                  >
                    {isDone     ? <CheckCircle className="w-3.5 h-3.5 text-white" />
                    : isCurrent ? <Loader className="w-3 h-3 text-white animate-spin" />
                    : null}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: isDone ? "#374151" : isCurrent ? "#1a1a2e" : "#a0a0b0" }}>
                      {s.label}
                    </div>
                    {(isCurrent || isDone) && (
                      <div className="text-xs mt-0.5" style={{ color: "#6b6b80" }}>{s.detail}</div>
                    )}
                  </div>
                  {isDone && <span className="text-xs font-medium" style={{ color: "#059669" }}>Done</span>}
                </div>
              );
            })}
          </div>
          {stage === "done" && (
            <div className="mt-4 rounded-2xl p-4 text-center" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <CheckCircle className="w-5 h-5 mx-auto mb-2" style={{ color: "#059669" }} />
              <p className="text-sm font-medium" style={{ color: "#166534" }}>Submitted to James Chen</p>
              <p className="text-xs mt-1" style={{ color: "#6b6b80" }}>Expected review within 24 hours</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* Step indicator */
  const StepBar = () => (
    <div className="flex items-center gap-2 mb-8">
      {([1, 2, 3] as const).map((s, i, arr) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
            style={
              step > s  ? { background: "#059669", color: "#fff" }
              : step === s ? { background: "#4f46e5", color: "#fff" }
              : { background: "#e8e8ed", color: "#a0a0b0" }
            }
          >
            {step > s ? <CheckCircle className="w-3.5 h-3.5" /> : s}
          </div>
          <span className="text-xs font-medium" style={{ color: step === s ? "#1a1a2e" : "#a0a0b0" }}>
            {s === 1 ? "Business Context" : s === 2 ? "Evidence" : "Business Summary"}
          </span>
          {i < arr.length - 1 && <ChevronRight className="w-3 h-3" style={{ color: "#d1d1db" }} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-full p-8">
      <div className="w-full max-w-xl">
        <StepBar />

        {/* ── Step 1: Business Context ── */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-2" style={{ color: "#1a1a2e" }}>
              Business Context
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6b6b80" }}>
              Tell us who this business case is about and what type of decision is needed.
            </p>

            {/* Entity type */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a0a0b0" }}>
                This is about a…
              </label>
              <div className="grid grid-cols-5 gap-2">
                {entityTypes.map(({ type, icon: Icon, desc }) => (
                  <button
                    key={type}
                    onClick={() => setEntityType(type)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 text-center transition-all"
                    style={entityType === type
                      ? { borderColor: "#4f46e5", background: "#f0f0f8" }
                      : { borderColor: "#e8e8ed", background: "#fff" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: entityType === type ? "#4f46e5" : "#a0a0b0" }} />
                    <span className="text-xs font-medium leading-tight" style={{ color: entityType === type ? "#4f46e5" : "#374151" }}>
                      {type}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Entity name */}
            {entityType && (
              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a0a0b0" }}>
                  {entityType} Name
                </label>
                <input
                  autoFocus
                  className="w-full rounded-2xl border px-5 py-4 text-base outline-none"
                  style={{ borderColor: "#e8e8ed", color: "#1a1a2e", background: "#fff" }}
                  placeholder={`e.g. ${entityType === "Customer" ? "Netflix, Amazon…" : entityType === "Project" ? "Q3 Renewal Drive…" : entityType === "Vendor" ? "Salesforce, AWS…" : "Finance Team…"}`}
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                />
              </div>
            )}

            {/* Decision type */}
            {entityType && entityName.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a0a0b0" }}>
                  Decision Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {decisionTypes.map(({ type, color, bg }) => (
                    <button
                      key={type}
                      onClick={() => setDecisionType(type)}
                      className="py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all text-center"
                      style={decisionType === type
                        ? { borderColor: color, background: bg, color }
                        : { borderColor: "#e8e8ed", background: "#fff", color: "#6b6b80" }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="w-full h-12 gap-2 text-base"
              disabled={!canGoStep2}
              onClick={() => setStep(2)}
              style={canGoStep2 ? { background: "#1a1a2e", color: "#fff" } : {}}
            >
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* ── Step 2: Evidence ── */}
        {step === 2 && (
          <div>
            <button className="text-sm flex items-center gap-1 mb-5" style={{ color: "#a0a0b0" }} onClick={() => setStep(1)}>
              <ChevronRight className="w-3 h-3 rotate-180" /> Back
            </button>
            <h2 className="text-2xl font-semibold tracking-tight mb-2" style={{ color: "#1a1a2e" }}>
              Provide Evidence
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6b6b80" }}>
              Upload anything relevant — meetings, emails, CRM notes, documents. The more evidence, the better the analysis.
            </p>

            {/* Drop zone */}
            <div
              className="rounded-2xl border-2 border-dashed p-8 text-center mb-4 cursor-pointer transition-all"
              style={{ borderColor: dragging ? "#4f46e5" : "#e8e8ed", background: dragging ? "#f0f0f8" : "#fafafa" }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => { if (e.target.files) setFiles((p) => [...p, ...Array.from(e.target.files!)]); }} />
              <Upload className="w-8 h-8 mx-auto mb-3" style={{ color: "#a0a0b0" }} />
              <p className="font-medium mb-1" style={{ color: "#1a1a2e" }}>
                {dragging ? "Drop files here" : "Drop files or click to upload"}
              </p>
              <p className="text-xs" style={{ color: "#a0a0b0" }}>
                Meetings · CRM · Emails · Transcripts · Documents · Screenshots
              </p>
            </div>

            {/* Evidence type badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {evidenceTypes.map(({ label, icon: Icon }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full" style={{ background: "#f3f3f7", color: "#6b6b80" }}>
                  <Icon className="w-3 h-3" /> {label}
                </span>
              ))}
            </div>

            {/* Uploaded files */}
            {files.length > 0 && (
              <div className="space-y-2 mb-4">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#059669" }} />
                    <span className="text-sm flex-1 truncate" style={{ color: "#166534" }}>{f.name}</span>
                    <button onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}>
                      <X className="w-3.5 h-3.5" style={{ color: "#a0a0b0" }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Or free text */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a0a0b0" }}>
                Or describe the evidence in text
              </label>
              <textarea
                className="w-full rounded-2xl border p-4 text-sm outline-none resize-none"
                style={{ borderColor: "#e8e8ed", color: "#1a1a2e", background: "#fff", minHeight: 100, lineHeight: 1.7 }}
                placeholder="Paste meeting notes, CRM data, email excerpts…"
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
              />
            </div>

            <Button
              className="w-full h-12 gap-2 text-base"
              onClick={() => setStep(3)}
              style={{ background: "#1a1a2e", color: "#fff" }}
            >
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
            <button className="w-full mt-2 text-sm py-2" style={{ color: "#a0a0b0" }} onClick={() => setStep(3)}>
              Skip — I'll describe it in the next step
            </button>
          </div>
        )}

        {/* ── Step 3: Business Summary ── */}
        {step === 3 && (
          <div>
            <button className="text-sm flex items-center gap-1 mb-5" style={{ color: "#a0a0b0" }} onClick={() => setStep(2)}>
              <ChevronRight className="w-3 h-3 rotate-180" /> Back
            </button>
            <h2 className="text-2xl font-semibold tracking-tight mb-2" style={{ color: "#1a1a2e" }}>
              Business Summary
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6b6b80" }}>
              Help your Decision Architect understand the situation before they review the AI analysis.
            </p>

            <div className="space-y-4 mb-6">
              {/* What happened */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#374151" }}>
                  What happened? <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  autoFocus
                  className="w-full rounded-2xl border p-4 text-sm outline-none resize-none"
                  style={{ borderColor: "#e8e8ed", color: "#1a1a2e", background: "#fff", minHeight: 100, lineHeight: 1.7 }}
                  placeholder={`We had a ${decisionType?.toLowerCase() ?? "business"} discussion with ${entityName || "the customer"}. They raised concerns about…`}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>

              {/* Who was involved */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#374151" }}>
                  Who was involved?
                </label>
                <input
                  className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{ borderColor: "#e8e8ed", color: "#1a1a2e", background: "#fff" }}
                  placeholder="e.g. Sarah (AE), Mike Torres (Customer VP), Lisa Chen (Customer CFO)"
                  value={involved}
                  onChange={(e) => setInvolved(e.target.value)}
                />
              </div>

              {/* What decision is needed */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#374151" }}>
                  What decision is needed?
                </label>
                <input
                  className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{ borderColor: "#e8e8ed", color: "#1a1a2e", background: "#fff" }}
                  placeholder="e.g. Should we offer a discount to close the renewal?"
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                />
              </div>

              {/* Priority + revenue */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#374151" }}>Priority</label>
                  <div className="flex gap-2">
                    {(["High", "Medium", "Low"] as Priority[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className="flex-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all"
                        style={priority === p
                          ? p === "High" ? { borderColor: "#dc2626", background: "#fef2f2", color: "#dc2626" }
                            : p === "Medium" ? { borderColor: "#b45309", background: "#fffbeb", color: "#b45309" }
                            : { borderColor: "#6b6b80", background: "#f7f7f9", color: "#6b6b80" }
                          : { borderColor: "#e8e8ed", background: "#fff", color: "#a0a0b0" }
                        }
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#374151" }}>
                    Revenue Impact <span style={{ color: "#a0a0b0" }}>(optional)</span>
                  </label>
                  <input
                    className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
                    style={{ borderColor: "#e8e8ed", color: "#1a1a2e", background: "#fff" }}
                    placeholder="e.g. $245K ARR"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {!canSubmit && summary.length > 0 && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl" style={{ background: "#fffbeb" }}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "#b45309" }} />
                <p className="text-xs" style={{ color: "#92400e" }}>Please describe what happened (at least 10 characters).</p>
              </div>
            )}

            <Button
              className="w-full h-12 gap-2 text-base"
              disabled={!canSubmit}
              onClick={() => { setStage("processing"); setPipelineStep(0); }}
              style={canSubmit ? { background: "#4f46e5", color: "#fff" } : {}}
            >
              <Sparkles className="w-4 h-4" />
              Submit for Review
            </Button>
            <p className="text-xs text-center mt-3" style={{ color: "#a0a0b0" }}>
              Your Decision Architect will receive this and review the AI analysis within 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
