import { useEffect, useState } from "react";
import { Users, Link, Plus, Edit, Check, X, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import type { User } from "../App";
import { useGoogleMeetIntegration } from "../hooks/useGoogleMeetIntegration";
import {
  connectIntegration,
  getConnectedIntegrations,
  type IntegrationKey,
} from "../lib/knowledgeIntegrations";

type Tab = "team" | "sources";

interface IntegrationSource {
  name: string;
  logo: string;
  color: string;
  bg: string;
  status: string;
  docs: string;
  lastSync: string;
  integrationKey?: IntegrationKey;
}

const tabs = [
  { id: "team"    as Tab, label: "Team Members",    icon: Users },
  { id: "sources" as Tab, label: "Knowledge Sources", icon: Link  },
];

const teamMembers = [
  { name: "Sarah Lee",  email: "sarah@acme.com",  role: "DC • Sales", active: true  },
  { name: "Tom Brown",  email: "tom@acme.com",    role: "DC • Sales", active: true  },
  { name: "Maria Kim",  email: "maria@acme.com",  role: "DC • Sales", active: true  },
  { name: "Alex Wong",  email: "alex@acme.com",   role: "DC • Sales", active: false },
];

const initialIntegrations: IntegrationSource[] = [
  { name: "Salesforce",  logo: "SF",  color: "#00A1E0", bg: "#E8F5FB", status: "connected", docs: "3,420 records",  lastSync: "5m ago",  integrationKey: "salesforce" },
  { name: "HubSpot",     logo: "HS",  color: "#FF7A59", bg: "#FFF0EB", status: "connected", docs: "1,890 records",  lastSync: "1h ago",  integrationKey: "hubspot" },
  { name: "Slack",       logo: "SL",  color: "#611f69", bg: "#F5EDF7", status: "connected", docs: "12,400 messages",lastSync: "Real-time", integrationKey: "slack" },
  { name: "Notion",      logo: "N",   color: "#000000", bg: "#F7F7F7", status: "not connected", docs: "—",          lastSync: "—",       integrationKey: "notion" },
  { name: "Google Meet", logo: "GM",  color: "#4285F4", bg: "#EAF2FB", status: "not connected", docs: "Meeting recordings", lastSync: "—", integrationKey: "google-meet" },
  { name: "Google Drive",logo: "GD",  color: "#4285F4", bg: "#EAF2FB", status: "not connected", docs: "—",          lastSync: "—",       integrationKey: "google-drive" },
  { name: "Emails",      logo: "EM",  color: "#EA4335", bg: "#FDECEA", status: "connected", docs: "8,200 emails",   lastSync: "30m ago", integrationKey: "gmail" },
  { name: "Microsoft Teams", logo: "T", color: "#6264A7", bg: "#EEEFFA", status: "not connected", docs: "—",        lastSync: "—",       integrationKey: "microsoft-teams" },
  { name: "PDF / Word / Excel", logo: "F", color: "#374151", bg: "#F7F7F9", status: "connected", docs: "624 files", lastSync: "2h ago",  integrationKey: "office365" },
];

interface SettingsPageProps {
  user: User;
}

export function SettingsPage({ user }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>("team");
  const [members, setMembers]     = useState(teamMembers);
  const [sources, setSources]     = useState<IntegrationSource[]>(initialIntegrations);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [connectedKeys, setConnectedKeys] = useState<Set<IntegrationKey>>(() => getConnectedIntegrations());

  const {
    meetConnected,
    recordingsCount,
    lastSync: meetLastSync,
    syncing,
    pendingMeetSync,
    endMeetingAndSave,
  } = useGoogleMeetIntegration();

  useEffect(() => {
    setConnectedKeys(getConnectedIntegrations());
  }, [meetConnected]);

  const handleConnect = (src: IntegrationSource) => {
    if (!src.integrationKey) return;

    if (src.integrationKey === "google-meet") {
      if (!meetConnected) {
        connectIntegration("google-meet", "settings");
      }
      return;
    }

    connectIntegration(src.integrationKey, "settings");
    setConnectedKeys(getConnectedIntegrations());
    setSources((prev) =>
      prev.map((source) =>
        source.name === src.name
          ? { ...source, status: "connected", lastSync: "Just now" }
          : source
      )
    );
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setMembers((prev) => [
      ...prev,
      { name: inviteEmail.split("@")[0], email: inviteEmail, role: `DC • ${user.department}`, active: false },
    ]);
    setInviteEmail("");
    setShowInvite(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isConnected = (src: IntegrationSource) => {
    if (src.integrationKey === "google-meet") return meetConnected;
    if (src.integrationKey) return connectedKeys.has(src.integrationKey) || src.status === "connected";
    return src.status === "connected";
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#1a1a2e" }}>Department Settings</h1>
          <p className="mt-1" style={{ color: "#6b6b80" }}>
            Manage your {user.department} team and connected knowledge sources.
          </p>
        </div>
        <Button onClick={handleSave} style={{ background: saved ? "#059669" : "#1a1a2e", color: "#fff" }} className="gap-2">
          {saved ? <><Check className="w-4 h-4" /> Saved</> : "Save Changes"}
        </Button>
      </div>

      <div className="flex items-center gap-1 p-1 rounded-2xl mb-6" style={{ background: "#f3f3f7", width: "fit-content" }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all")}
            style={activeTab === id
              ? { background: "#fff", color: "#1a1a2e", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }
              : { color: "#6b6b80" }}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {activeTab === "team" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium" style={{ color: "#374151" }}>
                {members.length} contributors in {user.department}
              </p>
              <p className="text-xs" style={{ color: "#a0a0b0" }}>
                You can only manage contributors in your own department.
              </p>
            </div>
            <Button
              size="sm"
              className="gap-2 h-9"
              style={{ background: "#4f46e5", color: "#fff" }}
              onClick={() => setShowInvite(true)}
            >
              <Plus className="w-3.5 h-3.5" /> Invite Contributor
            </Button>
          </div>

          {showInvite && (
            <div className="rounded-2xl border p-4 mb-4 flex items-center gap-3" style={{ background: "#f0f0f8", borderColor: "#ddddf0" }}>
              <input
                autoFocus
                className="flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none"
                style={{ borderColor: "#e8e8ed", color: "#1a1a2e", background: "#fff" }}
                placeholder="colleague@acme.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              />
              <Button size="sm" className="gap-1.5 h-9" style={{ background: "#4f46e5", color: "#fff" }} onClick={handleInvite}>
                <Check className="w-3.5 h-3.5" /> Send Invite
              </Button>
              <button onClick={() => setShowInvite(false)} style={{ color: "#a0a0b0" }}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="rounded-2xl border overflow-hidden" style={{ background: "#fff", borderColor: "#e8e8ed" }}>
            <div
              className="grid grid-cols-4 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-widest border-b"
              style={{ color: "#a0a0b0", background: "#fafafa", borderColor: "#f0f0f4" }}
            >
              <div className="col-span-1">Name</div>
              <div className="col-span-1">Email</div>
              <div className="col-span-1">Role</div>
              <div className="col-span-1">Status</div>
            </div>
            {members.map((m) => (
              <div
                key={m.email}
                className="grid grid-cols-4 gap-4 px-5 py-4 items-center border-b last:border-0 hover:bg-gray-50 transition-colors"
                style={{ borderColor: "#f5f5f8" }}
              >
                <div className="col-span-1 flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                    style={{ background: "#ededf8", color: "#4f46e5" }}
                  >
                    {m.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#1a1a2e" }}>{m.name}</span>
                </div>
                <div className="col-span-1 text-sm" style={{ color: "#6b6b80" }}>{m.email}</div>
                <div className="col-span-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: "#f3f3f7", color: "#374151" }}>{m.role}</span>
                </div>
                <div className="col-span-1 flex items-center justify-between">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={m.active ? { background: "#f0fdf4", color: "#059669" } : { background: "#fffbeb", color: "#b45309" }}
                  >
                    {m.active ? "Active" : "Invited"}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-3.5 h-3.5" style={{ color: "#a0a0b0" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "sources" && (
        <div>
          <p className="text-sm mb-5" style={{ color: "#6b6b80" }}>
            Connect your company's existing tools. Click Connect to open each app — Google Meet recordings sync back to DecisionOS automatically.
          </p>
          <div className="space-y-3">
            {sources.map((src) => {
              const isGoogleMeet = src.integrationKey === "google-meet";
              const connected = isConnected(src);
              const buttonLabel = isGoogleMeet
                ? !connected
                  ? "Connect"
                  : pendingMeetSync
                  ? syncing
                    ? "Saving..."
                    : "End Meeting & Save"
                  : "✓ Connected"
                : connected
                ? "✓ Connected"
                : "Connect";

              const displaySource = isGoogleMeet
                ? {
                    ...src,
                    status: connected ? "connected" : src.status,
                    docs: connected ? `${recordingsCount} recordings` : src.docs,
                    lastSync: connected ? meetLastSync : src.lastSync,
                  }
                : {
                    ...src,
                    status: connected ? "connected" : src.status,
                  };

              return (
                <div
                  key={src.name}
                  className="rounded-2xl border p-4 flex items-center gap-4"
                  style={{ background: "#fff", borderColor: "#e8e8ed" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: src.bg, color: src.color }}
                  >
                    {src.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm" style={{ color: "#1a1a2e" }}>{src.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#a0a0b0" }}>
                      {displaySource.docs} · Last synced {displaySource.lastSync}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {connected && !isGoogleMeet && (
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" style={{ color: "#a0a0b0" }} />
                      </button>
                    )}
                    <Button
                      size="sm"
                      className="h-8 text-xs"
                      style={
                        connected
                          ? { background: "#f0fdf4", color: "#059669", border: "1px solid #bbf7d0" }
                          : { background: "#4f46e5", color: "#fff" }
                      }
                      variant={connected ? "outline" : "default"}
                      disabled={isGoogleMeet && syncing}
                      onClick={() => {
                        if (isGoogleMeet && connected && pendingMeetSync) {
                          endMeetingAndSave();
                          return;
                        }
                        if (connected && !isGoogleMeet) return;
                        handleConnect(src);
                      }}
                    >
                      {buttonLabel}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-center mt-5" style={{ color: "#a0a0b0" }}>
            AI indexes all connected sources automatically. New files are embedded within minutes of upload.
          </p>
        </div>
      )}
    </div>
  );
}
