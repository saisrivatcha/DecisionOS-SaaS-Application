export type IntegrationKey =
  | "google-meet"
  | "salesforce"
  | "google-drive"
  | "notion"
  | "hubspot"
  | "slack"
  | "microsoft-teams"
  | "gmail"
  | "office365"
  | "web-docs";

export interface IntegrationConfig {
  key: IntegrationKey;
  name: string;
  connectUrl: string;
  /** Uses backend OAuth flow instead of opening an external URL */
  usesOAuth?: boolean;
  /** Opens in a new tab */
  external?: boolean;
}

export const INTEGRATIONS: Record<IntegrationKey, IntegrationConfig> = {
  "google-meet": {
    key: "google-meet",
    name: "Google Meet",
    connectUrl: "/auth/google",
    usesOAuth: true,
  },
  salesforce: {
    key: "salesforce",
    name: "Salesforce",
    connectUrl: "https://login.salesforce.com",
    external: true,
  },
  "google-drive": {
    key: "google-drive",
    name: "Google Drive",
    connectUrl: "https://drive.google.com",
    external: true,
  },
  notion: {
    key: "notion",
    name: "Notion",
    connectUrl: "https://www.notion.so/login",
    external: true,
  },
  hubspot: {
    key: "hubspot",
    name: "HubSpot",
    connectUrl: "https://app.hubspot.com/login",
    external: true,
  },
  slack: {
    key: "slack",
    name: "Slack",
    connectUrl: "https://slack.com/signin",
    external: true,
  },
  "microsoft-teams": {
    key: "microsoft-teams",
    name: "Microsoft Teams",
    connectUrl: "https://teams.microsoft.com",
    external: true,
  },
  gmail: {
    key: "gmail",
    name: "Gmail",
    connectUrl: "https://mail.google.com",
    external: true,
  },
  office365: {
    key: "office365",
    name: "Microsoft 365",
    connectUrl: "https://www.office.com",
    external: true,
  },
  "web-docs": {
    key: "web-docs",
    name: "Web Documentation",
    connectUrl: "https://docs.google.com",
    external: true,
  },
};

const CONNECTED_KEY = "decisionos_connected_integrations";

export function getConnectedIntegrations(): Set<IntegrationKey> {
  try {
    const raw = localStorage.getItem(CONNECTED_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as IntegrationKey[]);
  } catch {
    return new Set();
  }
}

export function markIntegrationConnected(key: IntegrationKey) {
  const connected = getConnectedIntegrations();
  connected.add(key);
  localStorage.setItem(CONNECTED_KEY, JSON.stringify([...connected]));
}

export function buildOAuthUrl(returnTo: string) {
  return `/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
}

export function connectIntegration(key: IntegrationKey, returnTo = "knowledge-base") {
  const config = INTEGRATIONS[key];
  if (config.usesOAuth) {
    window.location.href = buildOAuthUrl(returnTo);
    return;
  }
  if (config.external) {
    window.open(config.connectUrl, "_blank", "noopener,noreferrer");
  } else {
    window.location.href = config.connectUrl;
  }
  markIntegrationConnected(key);
}

export interface MeetingRecording {
  id: string;
  name: string;
  mimeType?: string;
  size?: number;
  modifiedTime?: string;
  localPath?: string;
  transcriptPath?: string;
  transcriptPreview?: string;
  hasTranscript?: boolean;
  transcriptSource?: "live" | "google-drive";
  syncedAt: string;
}

export type KnowledgeSourceType = "document" | "database" | "web" | "crm";

export interface AddableSourceTemplate {
  id: string;
  integrationKey: IntegrationKey;
  name: string;
  type: KnowledgeSourceType;
  description: string;
  documents: number;
  vectorized: number;
}

/** Integrations not shown by default — added via Add Source */
export const ADDABLE_SOURCE_TEMPLATES: AddableSourceTemplate[] = [
  {
    id: "ks-slack",
    integrationKey: "slack",
    name: "Slack Workspace",
    type: "document",
    description: "Channel messages, threads, and shared files from your Slack workspace",
    documents: 0,
    vectorized: 0,
  },
  {
    id: "ks-teams",
    integrationKey: "microsoft-teams",
    name: "Microsoft Teams",
    type: "document",
    description: "Meeting chats, channel posts, and shared files from Microsoft Teams",
    documents: 0,
    vectorized: 0,
  },
  {
    id: "ks-gmail",
    integrationKey: "gmail",
    name: "Gmail — Customer Threads",
    type: "document",
    description: "Email threads and attachments synced from Gmail for account context",
    documents: 0,
    vectorized: 0,
  },
  {
    id: "ks-office365",
    integrationKey: "office365",
    name: "Microsoft 365 Documents",
    type: "document",
    description: "Word, Excel, and PowerPoint files from your Microsoft 365 tenant",
    documents: 0,
    vectorized: 0,
  },
];

const ADDED_SOURCES_KEY = "decisionos_added_kb_sources";

export function getAddedSourceIds(): string[] {
  try {
    const raw = localStorage.getItem(ADDED_SOURCES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addKnowledgeSource(sourceId: string) {
  const added = getAddedSourceIds();
  if (!added.includes(sourceId)) {
    localStorage.setItem(ADDED_SOURCES_KEY, JSON.stringify([...added, sourceId]));
  }
}

export function getAddableSourcesNotYetAdded(): AddableSourceTemplate[] {
  const added = new Set(getAddedSourceIds());
  return ADDABLE_SOURCE_TEMPLATES.filter((template) => !added.has(template.id));
}

export function templateToKnowledgeSource(
  template: AddableSourceTemplate,
  connected: boolean
) {
  return {
    id: template.id,
    name: template.name,
    type: template.type,
    description: template.description,
    documents: connected ? template.documents || 120 : 0,
    lastSync: connected ? "Just now" : "Connect to sync",
    status: connected ? ("synced" as const) : ("error" as const),
    vectorized: connected ? template.vectorized || 85 : 0,
    integrationKey: template.integrationKey,
  };
}
