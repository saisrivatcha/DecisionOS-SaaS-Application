import { useEffect, useMemo, useState } from "react";
import {
  Search,
  FileText,
  Database,
  Globe,
  ChevronRight,
  Plus,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Video,
  ChevronDown,
  Mic,
  MicOff,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useGoogleMeetIntegration } from "../hooks/useGoogleMeetIntegration";
import {
  connectIntegration,
  getAddedSourceIds,
  getAddableSourcesNotYetAdded,
  addKnowledgeSource,
  getConnectedIntegrations,
  markIntegrationConnected,
  templateToKnowledgeSource,
  ADDABLE_SOURCE_TEMPLATES,
  type AddableSourceTemplate,
  type IntegrationKey,
} from "../lib/knowledgeIntegrations";

interface KnowledgeSource {
  id: string;
  name: string;
  type: "document" | "database" | "web" | "crm";
  description: string;
  documents: number;
  lastSync: string;
  status: "synced" | "syncing" | "error";
  vectorized: number;
  integrationKey?: IntegrationKey;
}

const sources: KnowledgeSource[] = [
  {
    id: "ks-1",
    name: "Contract Renewal Playbooks",
    type: "document",
    description: "Structured renewal strategies for enterprise accounts across all verticals",
    documents: 48,
    lastSync: "2h ago",
    status: "synced",
    vectorized: 100,
    integrationKey: "google-drive",
  },
  {
    id: "ks-2",
    name: "CRM — Salesforce Export",
    type: "crm",
    description: "Bi-directional sync with Salesforce CRM including account history, contacts, opportunities",
    documents: 3420,
    lastSync: "15m ago",
    status: "synced",
    vectorized: 98,
    integrationKey: "salesforce",
  },
  {
    id: "ks-3",
    name: "Competitive Intelligence",
    type: "document",
    description: "Competitor analysis, battle cards, displacement strategies and win/loss reports",
    documents: 92,
    lastSync: "1d ago",
    status: "synced",
    vectorized: 100,
    integrationKey: "notion",
  },
  {
    id: "ks-4",
    name: "Product Documentation",
    type: "web",
    description: "Full product docs, feature releases, API references, and integration guides",
    documents: 1240,
    lastSync: "3h ago",
    status: "synced",
    vectorized: 95,
    integrationKey: "web-docs",
  },
  {
    id: "ks-5",
    name: "Customer Success Metrics DB",
    type: "database",
    description: "Historical NPS, CSAT, usage analytics, and engagement scores for all accounts",
    documents: 8900,
    lastSync: "5m ago",
    status: "syncing",
    vectorized: 67,
    integrationKey: "hubspot",
  },
  {
    id: "ks-6",
    name: "Legal & Compliance Templates",
    type: "document",
    description: "Contract templates, SLA definitions, DPA agreements, and compliance frameworks",
    documents: 156,
    lastSync: "7d ago",
    status: "synced",
    vectorized: 100,
    integrationKey: "google-drive",
  },
  {
    id: "ks-7",
    name: "Industry Research Reports",
    type: "web",
    description: "Gartner, Forrester, and internal research reports by industry vertical",
    documents: 312,
    lastSync: "2d ago",
    status: "error",
    vectorized: 88,
    integrationKey: "web-docs",
  },
  {
    id: "ks-8",
    name: "EBR & QBR Transcripts",
    type: "document",
    description: "Transcripts and summaries from all executive and quarterly business reviews",
    documents: 624,
    lastSync: "1h ago",
    status: "synced",
    vectorized: 100,
    integrationKey: "google-drive",
  },
  {
    id: "ks-9",
    name: "Google Meet Recordings",
    type: "document",
    description: "Recorded meetings and transcripts from Google Meet — synced to DecisionOS after each call",
    documents: 0,
    lastSync: "Connect to sync",
    status: "error",
    vectorized: 0,
    integrationKey: "google-meet",
  },
];

const typeConfig = {
  document: { icon: FileText, color: "#4f46e5", bg: "#eef2ff", label: "Document Store" },
  database: { icon: Database, color: "#059669", bg: "#f0fdf4", label: "Database" },
  web: { icon: Globe, color: "#0284c7", bg: "#f0f9ff", label: "Web Source" },
  crm: { icon: Database, color: "#d97706", bg: "#fffbeb", label: "CRM Integration" },
};

const statusConfig = {
  synced: { color: "#059669", bg: "#f0fdf4", label: "Synced", Icon: CheckCircle },
  syncing: { color: "#4f46e5", bg: "#eef2ff", label: "Syncing", Icon: RefreshCw },
  error: { color: "#dc2626", bg: "#fef2f2", label: "Not Connected", Icon: AlertCircle },
};

const MEETINGS_PAGE_SIZE = 5;

export function KnowledgeBase() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("all");
  const [connectedKeys, setConnectedKeys] = useState<Set<IntegrationKey>>(() => getConnectedIntegrations());
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [showAllMeetings, setShowAllMeetings] = useState(false);
  const [expandedTranscriptId, setExpandedTranscriptId] = useState<string | null>(null);
  const [fullTranscripts, setFullTranscripts] = useState<Record<string, string>>({});
  const [loadingTranscriptId, setLoadingTranscriptId] = useState<string | null>(null);
  const [transcriptErrors, setTranscriptErrors] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddSourceDialog, setShowAddSourceDialog] = useState(false);
  const [addedSourceIds, setAddedSourceIds] = useState<string[]>(() => getAddedSourceIds());
  const [addableSources, setAddableSources] = useState<AddableSourceTemplate[]>(() =>
    getAddableSourcesNotYetAdded()
  );

  const {
    meetConnected,
    recordings,
    recordingsCount,
    syncing,
    lastSync: meetLastSync,
    pendingMeetSync,
    endMeetingAndSave,
    deleteMeeting,
    startMeeting,
    speech,
  } = useGoogleMeetIntegration({
    onNewRecordings: (added) => {
      setSyncNotice(
        added >= 1
          ? "Meeting saved with your spoken transcript."
          : "Meeting saved."
      );
    },
  });

  const sortedRecordings = useMemo(
    () =>
      [...recordings].sort(
        (a, b) => new Date(b.syncedAt).getTime() - new Date(a.syncedAt).getTime()
      ),
    [recordings]
  );

  const visibleRecordings = showAllMeetings
    ? sortedRecordings
    : sortedRecordings.slice(0, MEETINGS_PAGE_SIZE);

  const hasMoreMeetings = sortedRecordings.length > MEETINGS_PAGE_SIZE;

  const loadTranscript = async (recordingId: string) => {
    if (fullTranscripts[recordingId]) {
      setExpandedTranscriptId((current) => (current === recordingId ? null : recordingId));
      return;
    }

    setLoadingTranscriptId(recordingId);
    setTranscriptErrors((prev) => {
      const next = { ...prev };
      delete next[recordingId];
      return next;
    });

    try {
      const res = await fetch(`/api/meetings/${encodeURIComponent(recordingId)}/transcript`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || data?.hint || "Transcript unavailable");
      }
      if (!data.transcript) {
        throw new Error("Transcript was empty");
      }
      setFullTranscripts((prev) => ({ ...prev, [recordingId]: data.transcript }));
      setExpandedTranscriptId(recordingId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load transcript";
      setTranscriptErrors((prev) => ({ ...prev, [recordingId]: message }));
      setExpandedTranscriptId(recordingId);
      console.error("Failed to load transcript", error);
    } finally {
      setLoadingTranscriptId(null);
    }
  };

  const typeFilters = ["all", "document", "database", "web", "crm"];

  useEffect(() => {
    if (meetConnected) {
      markIntegrationConnected("google-meet");
      setConnectedKeys(getConnectedIntegrations());
    }
  }, [meetConnected]);

  const isSourceConnected = (source: KnowledgeSource) => {
    if (source.integrationKey === "google-meet") return meetConnected;
    if (!source.integrationKey) return source.status === "synced";
    return connectedKeys.has(source.integrationKey) || source.status === "synced";
  };

  const addedSources: KnowledgeSource[] = addedSourceIds
    .map((id) => ADDABLE_SOURCE_TEMPLATES.find((t) => t.id === id))
    .filter((t): t is AddableSourceTemplate => Boolean(t))
    .map((template) => {
      const connected =
        template.integrationKey === "google-meet"
          ? meetConnected
          : connectedKeys.has(template.integrationKey);
      return templateToKnowledgeSource(template, connected);
    });

  const allSources = [...sources, ...addedSources];

  const refreshAddSourceState = () => {
    setAddedSourceIds(getAddedSourceIds());
    setAddableSources(getAddableSourcesNotYetAdded());
    setConnectedKeys(getConnectedIntegrations());
  };

  const handleAddAndConnect = (template: AddableSourceTemplate) => {
    addKnowledgeSource(template.id);
    refreshAddSourceState();

    if (template.integrationKey === "google-meet") {
      if (!meetConnected) {
        connectIntegration("google-meet", "knowledge-base");
        return;
      }
    } else {
      connectIntegration(template.integrationKey, "knowledge-base");
    }

    setShowAddSourceDialog(false);
  };

  const handleDeleteMeeting = async (recordingId: string, recordingName: string) => {
    const confirmed = window.confirm(`Delete "${recordingName}" and its transcript?`);
    if (!confirmed) return;

    setDeletingId(recordingId);
    try {
      await deleteMeeting(recordingId);
      setFullTranscripts((prev) => {
        const next = { ...prev };
        delete next[recordingId];
        return next;
      });
      if (expandedTranscriptId === recordingId) {
        setExpandedTranscriptId(null);
      }
    } catch (error) {
      console.error("Failed to delete meeting", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleConnect = (source: KnowledgeSource) => {
    if (!source.integrationKey) return;

    if (source.integrationKey === "google-meet") {
      if (!meetConnected) {
        connectIntegration("google-meet", "knowledge-base");
      }
      return;
    }

    connectIntegration(source.integrationKey, "knowledge-base");
    setConnectedKeys(getConnectedIntegrations());
  };

  const displaySources = allSources.map((source) => {
    if (source.id !== "ks-9") {
      const connected = isSourceConnected(source);
      return {
        ...source,
        status: connected ? ("synced" as const) : source.status === "syncing" ? ("syncing" as const) : ("error" as const),
        lastSync: connected ? source.lastSync : "Connect to sync",
      };
    }

    return {
      ...source,
      documents: recordingsCount,
      lastSync: meetConnected ? meetLastSync : "Connect to sync",
      status: meetConnected ? ("synced" as const) : ("error" as const),
      vectorized: meetConnected && recordingsCount > 0 ? 100 : 0,
    };
  });

  const filtered = displaySources.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = activeType === "all" || s.type === activeType;
    return matchesSearch && matchesType;
  });

  const totalDocs = displaySources.reduce((sum, s) => sum + s.documents, 0);
  const syncedCount = displaySources.filter((s) => s.status === "synced").length;

  const getButtonLabel = (source: KnowledgeSource, connected: boolean) => {
    if (source.integrationKey === "google-meet") {
      if (!connected) return "Connect";
      return "✓ Connected";
    }
    return connected ? "✓ Connected" : "Connect";
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "#9ca3af" }}>
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "#4f46e5" }}>Knowledge Base</span>
          </div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>
            Knowledge Base
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            Connect your tools — Google Meet, Salesforce, Drive, and more. Meeting data syncs back automatically.
          </p>
        </div>
        <Button
          className="gap-2"
          style={{ background: "#4f46e5", color: "#ffffff" }}
          onClick={() => {
            setAddableSources(getAddableSourcesNotYetAdded());
            setShowAddSourceDialog(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Source
        </Button>
      </div>

      <Dialog open={showAddSourceDialog} onOpenChange={setShowAddSourceDialog}>
        <DialogContent className="sm:max-w-md" style={{ background: "#fff" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#111827" }}>Add Knowledge Source</DialogTitle>
            <DialogDescription style={{ color: "#6b7280" }}>
              Connect a new tool to DecisionOS. It will appear in your Knowledge Base and open the app to authorize.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {addableSources.length === 0 ? (
              <p className="text-sm py-4 text-center" style={{ color: "#9ca3af" }}>
                All available sources have been added. Connect them from the cards below.
              </p>
            ) : (
              addableSources.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between gap-3 rounded-xl border p-3"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium" style={{ color: "#111827" }}>
                        {template.name}
                      </div>
                      <div className="text-xs mt-0.5 line-clamp-2" style={{ color: "#6b7280" }}>
                        {template.description}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="h-8 text-xs flex-shrink-0"
                      style={{ background: "#4f46e5", color: "#fff" }}
                      onClick={() => handleAddAndConnect(template)}
                    >
                      Connect
                    </Button>
                  </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Documents", value: totalDocs.toLocaleString(), color: "#4f46e5", bg: "#eef2ff" },
          { label: "Active Sources", value: String(allSources.length), color: "#059669", bg: "#f0fdf4" },
          { label: "Sources Synced", value: `${syncedCount}/${allSources.length}`, color: "#059669", bg: "#f0fdf4" },
          { label: "Meet Recordings", value: String(recordingsCount), color: "#4285F4", bg: "#EAF2FB" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl border p-4"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <div className="text-xs mb-1" style={{ color: "#9ca3af" }}>{label}</div>
            <div className="text-xl font-bold" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {meetConnected && (
        <div
          className="rounded-xl border p-5 mb-6"
          style={{ background: "#EAF2FB", borderColor: "#bfdbfe" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-sm mb-2" style={{ color: "#1e40af" }}>
                New meeting workflow
              </h2>
              <ol className="text-xs space-y-1.5" style={{ color: "#374151", lineHeight: 1.6 }}>
                <li><strong>1.</strong> Click <strong>Start New Meeting</strong> — allow microphone access when prompted.</li>
                <li><strong>2.</strong> Keep this DecisionOS tab open. Your speech is captured live as you talk in Meet.</li>
                <li><strong>3.</strong> When the meeting ends, return here — it saves automatically. Or click <strong>End Meeting & Save</strong>.</li>
              </ol>
              <p className="text-xs mt-3" style={{ color: "#6b7280" }}>
                Saves only when a meeting happens. No background syncing. Use Delete to remove old meetings.
              </p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Button
                size="sm"
                className="h-8 text-xs gap-1.5"
                style={{ background: "#4285F4", color: "#fff" }}
                onClick={startMeeting}
              >
                <ExternalLink className="w-3 h-3" />
                Start New Meeting
              </Button>
              {pendingMeetSync && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5"
                  style={{ background: "#fff", borderColor: "#4285F4", color: "#4285F4" }}
                  disabled={syncing}
                  onClick={() => endMeetingAndSave()}
                >
                  <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? "Saving..." : "End Meeting & Save"}
                </Button>
              )}
            </div>
          </div>
          {pendingMeetSync && (
            <div
              className="mt-4 rounded-lg border p-3"
              style={{ background: "#fff", borderColor: "#bfdbfe" }}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 text-xs font-medium" style={{ color: speech.isListening ? "#dc2626" : "#6b7280" }}>
                  {speech.isListening ? (
                    <>
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#dc2626" }} />
                      Listening — speak now, your words appear below
                    </>
                  ) : (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      Microphone paused — click Resume Listening
                    </>
                  )}
                </div>
                {!speech.isListening && speech.isSupported && (
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => speech.startListening()}>
                    Resume Listening
                  </Button>
                )}
              </div>

              {speech.speechError && (
                <p className="text-xs mb-2" style={{ color: "#dc2626" }}>{speech.speechError}</p>
              )}

              {!speech.isSupported && (
                <p className="text-xs" style={{ color: "#dc2626" }}>
                  Live speech capture requires Chrome or Edge. Switch browsers to capture what you speak.
                </p>
              )}

              <div
                className="rounded-lg p-3 max-h-40 overflow-y-auto text-xs space-y-2"
                style={{ background: "#f9fafb", color: "#374151", lineHeight: 1.6 }}
              >
                {speech.lines.length === 0 && !speech.interimText ? (
                  <p style={{ color: "#9ca3af" }}>
                    Waiting for speech… say something in your meeting and it will show up here live.
                  </p>
                ) : (
                  speech.lines.map((line) => (
                    <p key={line.id}>
                      <span style={{ color: "#9ca3af" }}>[{line.timestamp}]</span> You: {line.text}
                    </p>
                  ))
                )}
                {speech.interimText && (
                  <p style={{ color: "#9ca3af", fontStyle: "italic" }}>You: {speech.interimText}…</p>
                )}
              </div>
            </div>
          )}
          {syncNotice && (
            <p className="text-xs mt-3 font-medium" style={{ color: "#059669" }}>
              {syncNotice}
            </p>
          )}
        </div>
      )}

      <div
        className="rounded-xl border p-4 mb-4 flex items-center gap-3"
        style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
      >
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
          <Search className="w-4 h-4" style={{ color: "#9ca3af" }} />
          <input
            className="flex-1 bg-transparent border-0 outline-none text-sm"
            placeholder="Search knowledge sources..."
            style={{ color: "#111827" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {typeFilters.map((f) => (
            <button
              key={f}
              className="text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-colors"
              style={
                activeType === f
                  ? { background: "#4f46e5", color: "#ffffff" }
                  : { background: "#f3f4f6", color: "#6b7280" }
              }
              onClick={() => setActiveType(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((source) => {
          const original = allSources.find((s) => s.id === source.id)!;
          const tc = typeConfig[source.type];
          const sc = statusConfig[source.status];
          const TypeIcon = tc.icon;
          const StatusIcon = sc.Icon;
          const connected = isSourceConnected(original);
          const showConnect = Boolean(original.integrationKey);

          return (
            <div
              key={source.id}
              className="rounded-xl border p-5 hover:shadow-md transition-shadow"
              style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: tc.bg }}
                  >
                    <TypeIcon className="w-5 h-5" style={{ color: tc.color }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "#111827" }}>
                      {source.name}
                    </div>
                    <div
                      className="text-xs mt-0.5 px-1.5 py-0.5 rounded"
                      style={{ background: tc.bg, color: tc.color, display: "inline-block" }}
                    >
                      {tc.label}
                    </div>
                  </div>
                </div>
                <span
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
                  style={{ background: sc.bg, color: sc.color }}
                >
                  <StatusIcon className={`w-3 h-3 ${source.status === "syncing" ? "animate-spin" : ""}`} />
                  {sc.label}
                </span>
              </div>

              <p className="text-xs mb-4" style={{ color: "#6b7280", lineHeight: 1.6 }}>
                {source.description}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="rounded-lg p-2.5" style={{ background: "#f9fafb" }}>
                  <div className="text-xs" style={{ color: "#9ca3af" }}>Documents</div>
                  <div className="font-semibold text-sm mt-0.5" style={{ color: "#111827" }}>
                    {source.documents.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg p-2.5" style={{ background: "#f9fafb" }}>
                  <div className="text-xs" style={{ color: "#9ca3af" }}>Vectorized</div>
                  <div
                    className="font-semibold text-sm mt-0.5"
                    style={{ color: source.vectorized === 100 ? "#059669" : "#d97706" }}
                  >
                    {source.vectorized}%
                  </div>
                </div>
                <div className="rounded-lg p-2.5" style={{ background: "#f9fafb" }}>
                  <div className="text-xs" style={{ color: "#9ca3af" }}>Last Sync</div>
                  <div className="font-semibold text-sm mt-0.5 truncate" style={{ color: "#374151" }}>
                    {source.lastSync}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: "#9ca3af" }}>Vector Coverage</span>
                  <span style={{ color: "#374151" }}>{source.vectorized}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "#e5e7eb" }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${source.vectorized}%`,
                      background: source.vectorized === 100 ? "#059669" : source.vectorized >= 80 ? "#d97706" : "#dc2626",
                    }}
                  />
                </div>
              </div>

              {showConnect && (
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    className="h-8 text-xs flex-1"
                    style={
                      connected
                        ? { background: "#f0fdf4", color: "#059669", border: "1px solid #bbf7d0" }
                        : { background: "#4f46e5", color: "#fff" }
                    }
                    variant={connected ? "outline" : "default"}
                    disabled={source.integrationKey === "google-meet" && syncing}
                    onClick={() => {
                      if (source.integrationKey === "google-meet" && isSourceConnected(original)) return;
                      handleConnect(original);
                    }}
                  >
                    {getButtonLabel(original, connected)}
                  </Button>
                  {original.integrationKey === "google-meet" && connected && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1"
                      onClick={startMeeting}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Start Meet
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {meetConnected && (
        <div
          className="rounded-xl border p-5 mt-6"
          style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5" style={{ color: "#4285F4" }} />
              <h2 className="font-semibold text-sm" style={{ color: "#111827" }}>
                Stored Meeting Recordings
              </h2>
            </div>
            {pendingMeetSync ? (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs gap-1.5"
                disabled={syncing}
                onClick={() => endMeetingAndSave()}
              >
                <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Saving..." : "End Meeting & Save"}
              </Button>
            ) : null}
          </div>
          {recordings.length === 0 ? (
            <p className="text-xs" style={{ color: "#6b7280" }}>
              No recordings yet. Start a meeting, enable recording, then click Sync After Meeting.
            </p>
          ) : (
            <>
              <p className="text-xs mb-4" style={{ color: "#6b7280" }}>
                {recordingsCount} meeting{recordingsCount === 1 ? "" : "s"} stored with spoken conversation transcripts for AI retrieval.
              </p>
              <div className="space-y-2">
                {visibleRecordings.map((recording) => {
                  const isExpanded = expandedTranscriptId === recording.id;
                  const fullTranscript = fullTranscripts[recording.id];
                  const preview = recording.transcriptPreview;
                  const isLoadingTranscript = loadingTranscriptId === recording.id;
                  const transcriptError = transcriptErrors[recording.id];

                  return (
                    <div
                      key={recording.id}
                      className="rounded-lg border px-4 py-3"
                      style={{ borderColor: "#f3f4f6" }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate" style={{ color: "#111827" }}>
                            {recording.name}
                          </div>
                          <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "#9ca3af" }}>
                            <Clock className="w-3 h-3" />
                            Synced {new Date(recording.syncedAt).toLocaleString()}
                          </div>
                          <div
                            className="mt-2 rounded-lg p-2.5 text-xs"
                            style={{ background: "#f9fafb", color: "#374151", lineHeight: 1.6 }}
                          >
                            <div className="flex items-center gap-1 mb-1 font-medium" style={{ color: "#4285F4" }}>
                              <MessageSquare className="w-3 h-3" />
                              What was spoken
                            </div>
                            {isLoadingTranscript ? (
                              <p style={{ color: "#6b7280" }}>Loading transcript…</p>
                            ) : transcriptError ? (
                              <p style={{ color: "#dc2626" }}>{transcriptError}</p>
                            ) : isExpanded && fullTranscript ? (
                              <pre className="whitespace-pre-wrap font-sans max-h-64 overflow-y-auto">
                                {fullTranscript}
                              </pre>
                            ) : preview ? (
                              <p>{preview}</p>
                            ) : (
                              <p style={{ color: "#6b7280" }}>
                                No speech saved yet. Start a meeting from here, speak during the call, then Sync After Meeting.
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                          <a
                            href={`/api/meetings/${recording.id}/download`}
                            download
                            className="text-xs font-medium px-3 py-1.5 rounded-lg text-center"
                            style={{ background: "#EAF2FB", color: "#4285F4" }}
                          >
                            Download Transcript
                          </a>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            disabled={isLoadingTranscript}
                            onClick={() => loadTranscript(recording.id)}
                          >
                            {isLoadingTranscript
                              ? "Loading..."
                              : isExpanded
                              ? "Hide Transcript"
                              : "View Transcript"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            style={{ color: "#dc2626", borderColor: "#fecaca" }}
                            disabled={deletingId === recording.id}
                            onClick={() => handleDeleteMeeting(recording.id, recording.name)}
                          >
                            <Trash2 className="w-3 h-3" />
                            {deletingId === recording.id ? "Deleting..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {hasMoreMeetings && (
                <div className="mt-3 flex justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1.5"
                    onClick={() => setShowAllMeetings((prev) => !prev)}
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${showAllMeetings ? "rotate-180" : ""}`}
                    />
                    {showAllMeetings
                      ? "Show less"
                      : `Show more (${sortedRecordings.length - MEETINGS_PAGE_SIZE} more)`}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
