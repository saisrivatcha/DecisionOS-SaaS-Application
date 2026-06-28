import { useState, useRef } from "react";
import {
  FileText,
  Mail,
  Database,
  ClipboardPaste,
  Upload,
  Sparkles,
  ChevronRight,
  X,
  CheckCircle,
  Info,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import type { DecisionContext } from "../App";

interface InputMethod {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  placeholder: string;
  accent: string;
  bg: string;
}

const inputMethods: InputMethod[] = [
  {
    id: "transcript",
    label: "Meeting Transcript",
    icon: FileText,
    description: "Upload or paste a meeting transcript for analysis",
    placeholder: `Paste your meeting transcript here...\n\nExample:\n[10:02 AM] Sarah (Sales): Good morning! Thanks for taking the time to meet. I wanted to follow up on the Q3 renewal discussion.\n[10:03 AM] Mike (Customer): Yes, we've been thinking about it. The platform has been helpful but we're concerned about pricing for next year...`,
    accent: "#4f46e5",
    bg: "#eef2ff",
  },
  {
    id: "email",
    label: "Customer Email",
    icon: Mail,
    description: "Analyze a customer email thread for context",
    placeholder: `Paste the email thread here...\n\nExample:\nFrom: john.smith@acmecorp.com\nTo: sarah@ourcompany.com\nSubject: Re: Q4 Renewal Discussion\n\nHi Sarah,\nThank you for reaching out. We've been evaluating our current subscription and have a few concerns about the upcoming renewal...`,
    accent: "#0284c7",
    bg: "#f0f9ff",
  },
  {
    id: "crm",
    label: "CRM Notes",
    icon: Database,
    description: "Import notes from your CRM for comprehensive analysis",
    placeholder: `Paste CRM notes here...\n\nExample:\nAccount: Acme Corporation\nLast Activity: June 25, 2026\nDeal Stage: Renewal\nNotes: Customer expressed concerns about ROI during last QBR. Champion (Mike Torres) is supportive but CFO (Lisa Chen) is questioning value. ARR: $245,000. Contract expiry: Aug 31, 2026...`,
    accent: "#059669",
    bg: "#f0fdf4",
  },
  {
    id: "paste",
    label: "Free Text",
    icon: ClipboardPaste,
    description: "Describe the situation in your own words",
    placeholder: `Describe the customer situation or decision context...\n\nExample:\nWe had a difficult call with Acme Corporation yesterday. The customer's champion Mike Torres is supportive of renewal but the CFO is pushing back on pricing. They have a competitor evaluation running with Salesforce. The contract expires in 67 days. We need to determine the best next action to secure the renewal...`,
    accent: "#7c3aed",
    bg: "#f5f3ff",
  },
];

const exampleCustomers = [
  "Acme Corporation",
  "TechCorp Inc.",
  "GlobalRetail Ltd.",
  "Meridian Health",
  "NovaStar Financial",
];

interface NewDecisionProps {
  onAnalyze: (ctx: DecisionContext) => void;
}

export function NewDecision({ onAnalyze }: NewDecisionProps) {
  const [activeMethod, setActiveMethod] = useState("transcript");
  const [inputText, setInputText] = useState("");
  const [customer, setCustomer] = useState("Acme Corporation");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const current = inputMethods.find((m) => m.id === activeMethod)!;
  const canAnalyze = inputText.trim().length > 20 || fileUploaded;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileUploaded(true);
      setFileName(file.name);
      setInputText(`[File uploaded: ${file.name}]\n\nContent will be extracted and analyzed automatically.`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileUploaded(true);
      setFileName(file.name);
      setInputText(`[File uploaded: ${file.name}]\n\nContent will be extracted and analyzed automatically.`);
    }
  };

  const handleAnalyze = () => {
    const text = inputText.trim() || `Customer: ${customer}. Input method: ${activeMethod}.`;
    onAnalyze({ inputText: text, inputType: activeMethod, customer });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "#9ca3af" }}>
          <span>Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: "#4f46e5" }}>New Decision</span>
        </div>
        <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>
          Analyze a Decision
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
          Provide context and our AI agents will determine the optimal next best action.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main input area */}
        <div className="col-span-2 space-y-4">
          {/* Input method selector */}
          <div
            className="rounded-xl border p-4"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#9ca3af" }}>
              Input Source
            </p>
            <div className="grid grid-cols-2 gap-2">
              {inputMethods.map((method) => {
                const Icon = method.icon;
                const isActive = activeMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => { setActiveMethod(method.id); setFileUploaded(false); setInputText(""); }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border-2 text-sm transition-all text-left"
                    )}
                    style={
                      isActive
                        ? { borderColor: method.accent, background: method.bg }
                        : { borderColor: "#e5e7eb", background: "#ffffff" }
                    }
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: isActive ? method.accent : "#f3f4f6" }}
                    >
                      <Icon className="w-4 h-4" style={{ color: isActive ? "#ffffff" : "#9ca3af" }} />
                    </div>
                    <div>
                      <div className="font-medium text-xs" style={{ color: isActive ? "#111827" : "#374151" }}>
                        {method.label}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                        {method.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text input / drop zone */}
          <div
            className="rounded-xl border"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#f3f4f6" }}>
              <div className="flex items-center gap-2">
                <current.icon className="w-4 h-4" style={{ color: current.accent }} />
                <span className="text-sm font-medium" style={{ color: "#111827" }}>
                  {current.label}
                </span>
              </div>
              {fileUploaded && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: "#059669" }} />
                  <span className="text-xs" style={{ color: "#059669" }}>{fileName}</span>
                  <button onClick={() => { setFileUploaded(false); setInputText(""); setFileName(""); }}>
                    <X className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
                  </button>
                </div>
              )}
            </div>

            {/* Drop zone */}
            <div
              className={cn("relative transition-colors")}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={isDragging ? { background: "#f5f3ff" } : {}}
            >
              <textarea
                className="w-full resize-none border-0 outline-none bg-transparent text-sm p-4"
                style={{ color: "#111827", minHeight: 260 }}
                placeholder={current.placeholder}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              {!inputText && !fileUploaded && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40"
                  style={{ top: "40%" }}
                >
                  <div
                    className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border"
                    style={{ borderColor: "#d1d5db", color: "#9ca3af" }}
                  >
                    <Upload className="w-3 h-3" />
                    Drop a file or type above
                  </div>
                </div>
              )}
            </div>

            <div
              className="flex items-center justify-between px-4 py-2.5 border-t"
              style={{ borderColor: "#f3f4f6" }}
            >
              <div className="flex items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept=".txt,.pdf,.docx,.csv"
                  onChange={handleFileChange}
                />
                <button
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload file
                </button>
              </div>
              <span className="text-xs" style={{ color: "#9ca3af" }}>
                {inputText.length} characters
              </span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Customer context */}
          <div
            className="rounded-xl border p-4"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#9ca3af" }}>
              Customer Context
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "#374151" }}>
                  Customer Account
                </label>
                <select
                  className="w-full text-sm rounded-lg border px-3 py-2 outline-none"
                  style={{ borderColor: "#e5e7eb", color: "#111827", background: "#ffffff" }}
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                >
                  {exampleCustomers.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "#374151" }}>
                  Decision Priority
                </label>
                <select
                  className="w-full text-sm rounded-lg border px-3 py-2 outline-none"
                  style={{ borderColor: "#e5e7eb", color: "#111827", background: "#ffffff" }}
                >
                  <option>High — Customer at Risk</option>
                  <option>Medium — Standard Review</option>
                  <option>Low — Informational</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "#374151" }}>
                  Business Context
                </label>
                <select
                  className="w-full text-sm rounded-lg border px-3 py-2 outline-none"
                  style={{ borderColor: "#e5e7eb", color: "#111827", background: "#ffffff" }}
                >
                  <option>Contract Renewal</option>
                  <option>Upsell / Expansion</option>
                  <option>Churn Risk</option>
                  <option>Onboarding</option>
                  <option>Support Escalation</option>
                </select>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div
            className="rounded-xl border p-4"
            style={{ background: "#f8f9fc", borderColor: "#e5e7eb" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#9ca3af" }}>
              AI Workflow
            </p>
            <div className="space-y-2.5">
              {[
                "Planner Agent creates execution plan",
                "Retrieval Agent fetches customer data",
                "Memory Agent recalls past interactions",
                "Analysis Agent evaluates business context",
                "Recommendation Agent generates NBA",
                "Explanation Agent adds reasoning",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                    style={{ background: "#e0e7ff", color: "#4f46e5" }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs" style={{ color: "#6b7280" }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="flex items-start gap-2 mt-4 p-2.5 rounded-lg"
              style={{ background: "#fffbeb", border: "1px solid #fde68a" }}
            >
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#d97706" }} />
              <p className="text-xs" style={{ color: "#92400e" }}>
                Avg processing time: 4.2 minutes end-to-end
              </p>
            </div>
          </div>

          {/* CTA */}
          <Button
            className="w-full h-11 gap-2 text-sm"
            disabled={!canAnalyze}
            onClick={handleAnalyze}
            style={canAnalyze ? { background: "#4f46e5", color: "#ffffff" } : {}}
          >
            <Sparkles className="w-4 h-4" />
            Analyze Decision
          </Button>
          {!canAnalyze && (
            <p className="text-xs text-center" style={{ color: "#9ca3af" }}>
              Enter at least 20 characters to enable analysis
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
