import express from "express";
import cookieSession from "cookie-session";
import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";

// Load server/.env first, then root .env as fallback for any missing vars
dotenv.config({ path: path.join(path.dirname(import.meta.url.replace('file:///', '')), '.env') });
dotenv.config({ path: path.join(path.dirname(import.meta.url.replace('file:///', '')), '..', '.env') });
import fs from "fs/promises";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { fileURLToPath } from "url";
import { processDecision } from "./services/decisionService.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `http://localhost:${PORT}/auth/google/callback`;
const MOCK_MODE = !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || GOOGLE_CLIENT_ID.includes("your-") || GOOGLE_CLIENT_SECRET.includes("your-");

if (MOCK_MODE) {
  console.warn("Google OAuth credentials are not configured. Running in local mock mode.");
}

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID || "demo-client-id",
  GOOGLE_CLIENT_SECRET || "demo-client-secret",
  GOOGLE_REDIRECT_URI
);

const drive = google.drive({ version: "v3", auth: oauth2Client });
const app = express();

app.use(express.json());
app.enable("trust proxy");
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "dev-session-secret"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

const STORAGE_DIR = path.join(__dirname, "storage", "meetings");
const TRANSCRIPT_DIR = path.join(STORAGE_DIR, "transcripts");
const DATA_DIR = path.join(__dirname, "data");
const RECORDINGS_FILE = path.join(DATA_DIR, "recordings.json");
const TRANSCRIPT_PREVIEW_LENGTH = 220;

const ensureStorage = async () => {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  await fs.mkdir(TRANSCRIPT_DIR, { recursive: true });
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(RECORDINGS_FILE);
  } catch {
    await fs.writeFile(RECORDINGS_FILE, "[]", "utf-8");
  }
};

const readRecordings = async () => {
  await ensureStorage();
  try {
    const file = await fs.readFile(RECORDINGS_FILE, "utf-8");
    if (!file.trim()) return [];
    return JSON.parse(file);
  } catch (error) {
    console.error("Failed to read recordings, resetting cache", error);
    await fs.writeFile(RECORDINGS_FILE, "[]", "utf-8");
    return [];
  }
};

const writeRecordings = async (data) => {
  await ensureStorage();
  const tempFile = `${RECORDINGS_FILE}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tempFile, RECORDINGS_FILE);
};

const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/documents.readonly",
    ],
  });
};

const createMockSession = (req) => {
  req.session.tokens = {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    token_type: "Bearer",
    expiry_date: Date.now() + 3600 * 1000,
    mock: true,
  };
};

const safeFileName = (filename) => filename.replace(/[^a-zA-Z0-9-_\. ]/g, "_");

const buildFrontendRedirect = (req, { authResult, extra = {} }) => {
  const returnTo = req.query.returnTo || req.session.oauthReturnTo || "knowledge-base";
  const params = new URLSearchParams({ google_auth: authResult, returnTo, ...extra });
  return `${FRONTEND_URL}/?${params.toString()}`;
};

const makeTranscriptPreview = (text) => {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  if (normalized.length <= TRANSCRIPT_PREVIEW_LENGTH) return normalized;
  return `${normalized.slice(0, TRANSCRIPT_PREVIEW_LENGTH).trim()}…`;
};

const saveTranscriptForRecording = async (recordingId, text) => {
  const transcriptFileName = `${safeFileName(recordingId)}.txt`;
  const absolutePath = path.join(TRANSCRIPT_DIR, transcriptFileName);
  await fs.writeFile(absolutePath, text, "utf-8");
  return path.join("storage", "meetings", "transcripts", transcriptFileName);
};

const readTranscriptFromRecording = async (recording) => {
  if (!recording?.transcriptPath) return null;
  const candidates = [
    recording.transcriptPath,
    path.join(__dirname, recording.transcriptPath),
    path.join(__dirname, recording.transcriptPath.replace(/^server\//, "")),
  ];
  for (const candidate of candidates) {
    try {
      return await fs.readFile(candidate, "utf-8");
    } catch {
      // try next path
    }
  }
  return null;
};

const applyTranscriptToRecording = async (recording, text, source = "live") => {
  const transcriptPath = await saveTranscriptForRecording(recording.id, text);
  recording.transcriptPath = transcriptPath;
  recording.transcriptPreview = makeTranscriptPreview(text);
  recording.hasTranscript = true;
  recording.transcriptSource = source;
  return recording;
};

const stripLegacyMockTranscripts = (recordings) => {
  for (const recording of recordings) {
    if (recording.hasTranscript && recording.transcriptSource !== "live" && recording.transcriptSource !== "google-drive") {
      recording.hasTranscript = false;
      recording.transcriptPreview = undefined;
      recording.transcriptPath = undefined;
      recording.transcriptDriveId = undefined;
      recording.transcriptSourceName = undefined;
      recording.transcriptSource = undefined;
    }
  }
};

const attachLiveTranscript = async (recording, liveTranscript) => {
  const lines = liveTranscript?.lines;
  const text = String(liveTranscript?.text || "").trim();
  if (!Array.isArray(lines) || lines.length === 0 || !text) return false;
  await applyTranscriptToRecording(recording, text, "live");
  return true;
};

const exportDriveFileAsText = async (file) => {
  if (file.mimeType === "application/vnd.google-apps.document") {
    const response = await drive.files.export(
      { fileId: file.id, mimeType: "text/plain" },
      { responseType: "text" }
    );
    return String(response.data || "").trim();
  }

  if (file.mimeType === "text/plain" || file.mimeType?.includes("text")) {
    const response = await drive.files.get(
      { fileId: file.id, alt: "media" },
      { responseType: "text" }
    );
    return String(response.data || "").trim();
  }

  return "";
};

const listDriveTranscriptFiles = async () => {
  const query = [
    "trashed = false",
    "(",
    "name contains 'Transcript'",
    "or name contains 'transcript'",
    "or name contains 'Notes by Gemini'",
    "or name contains 'Meeting notes'",
    "or name contains 'Captions'",
    ")",
    "and (",
    "mimeType = 'application/vnd.google-apps.document'",
    "or mimeType = 'text/plain'",
    ")",
  ].join(" ");

  const listResponse = await drive.files.list({
    q: query,
    fields: "files(id,name,mimeType,modifiedTime,createdTime)",
    pageSize: 100,
    orderBy: "modifiedTime desc",
  });

  return listResponse.data.files || [];
};

const transcriptMatchesRecording = (transcriptFile, recording) => {
  const transcriptName = (transcriptFile.name || "").toLowerCase();
  const recordingName = (recording.name || "").toLowerCase();
  const recordingTime = new Date(recording.modifiedTime || recording.syncedAt).getTime();
  const transcriptTime = new Date(transcriptFile.modifiedTime || transcriptFile.createdTime).getTime();
  const withinDay = Math.abs(recordingTime - transcriptTime) <= 24 * 60 * 60 * 1000;

  if (!withinDay) return false;

  const recordingTokens = recordingName
    .replace(/meeting recording|meet recording|google meet|—|-/gi, " ")
    .split(/\s+/)
    .filter((token) => token.length > 3);

  return recordingTokens.some((token) => transcriptName.includes(token)) || withinDay;
};

const backfillTranscripts = async (recordings) => {
  let updated = 0;
  const transcriptFiles = await listDriveTranscriptFiles();
  const usedTranscriptIds = new Set(
    recordings.map((recording) => recording.transcriptDriveId).filter(Boolean)
  );

  for (const recording of recordings) {
    if (recording.hasTranscript && recording.transcriptPath) continue;

    const match = transcriptFiles.find(
      (file) => !usedTranscriptIds.has(file.id) && transcriptMatchesRecording(file, recording)
    );

    if (!match) continue;

    const text = await exportDriveFileAsText(match);
    if (!text) continue;

    await applyTranscriptToRecording(recording, text, "google-drive");
    recording.transcriptDriveId = match.id;
    recording.transcriptSourceName = match.name;
    usedTranscriptIds.add(match.id);
    updated += 1;
  }

  return updated;
};

const buildRecordingEntry = async (file, localFilePath) => {
  return {
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    size: file.size,
    modifiedTime: file.modifiedTime,
    localPath: path.relative(__dirname, localFilePath),
    syncedAt: new Date().toISOString(),
    hasTranscript: false,
  };
};

const syncMeetingsForSession = async (req, { afterMeeting = false, liveTranscript = null } = {}) => {
  await ensureStorage();
  oauth2Client.setCredentials(req.session.tokens);
  let added = 0;
  let latestRecording = null;

  if (MOCK_MODE) {
    const recordings = await readRecordings();
    stripLegacyMockTranscripts(recordings);
    const existingIds = new Set(recordings.map((recording) => recording.id));

    if (!existingIds.has("demo-recording-1") && !afterMeeting) {
      const demoRecording = {
        id: "demo-recording-1",
        name: "Demo Google Meet Recording",
        mimeType: "video/mp4",
        size: 1240000,
        modifiedTime: new Date().toISOString(),
        localPath: path.join("storage", "meetings", "demo-recording-1.mp4"),
        syncedAt: new Date().toISOString(),
        hasTranscript: false,
      };
      recordings.push(demoRecording);
      await fs.writeFile(path.join(STORAGE_DIR, "demo-recording-1.mp4"), "mock recording", "utf-8");
      added += 1;
    } else if (afterMeeting) {
      const stamp = Date.now();
      const newId = `demo-recording-${stamp}`;
      const meetingDate = new Date(stamp).toLocaleString();
      latestRecording = {
        id: newId,
        name: `Meeting recording — ${meetingDate}`,
        mimeType: "video/mp4",
        size: 980000 + Math.floor(Math.random() * 500000),
        modifiedTime: new Date().toISOString(),
        localPath: path.join("storage", "meetings", `${newId}.mp4`),
        syncedAt: new Date().toISOString(),
        hasTranscript: false,
      };
      recordings.push(latestRecording);
      await fs.writeFile(
        path.join(STORAGE_DIR, `${newId}.mp4`),
        `mock meeting recording created ${meetingDate}`,
        "utf-8"
      );
      added += 1;
    }

    if (latestRecording) {
      await attachLiveTranscript(latestRecording, liveTranscript);
    }

    await writeRecordings(recordings);
    return { total: recordings.length, added };
  }

  const query = "mimeType contains 'video/' and trashed = false and (name contains 'Meeting recording' or name contains 'Meet recording' or name contains 'Google Meet')";
  const listResponse = await drive.files.list({
    q: query,
    fields: "files(id,name,mimeType,size,modifiedTime)",
    pageSize: 100,
    orderBy: "modifiedTime desc",
  });

  const driveFiles = listResponse.data.files || [];
  const recordings = await readRecordings();
  const existingIds = new Set(recordings.map((recording) => recording.id));

  for (const file of driveFiles) {
    if (existingIds.has(file.id)) continue;
    const safeName = safeFileName(file.name || file.id || "recording");
    const extension = file.mimeType && file.mimeType.includes("mp4") ? ".mp4" : path.extname(file.name || "") || ".bin";
    const localFileName = `${file.id}-${safeName}${extension}`;
    const localFilePath = path.join(STORAGE_DIR, localFileName);

    const downloadResponse = await drive.files.get(
      { fileId: file.id, alt: "media" },
      { responseType: "stream" }
    );

    await pipeline(downloadResponse.data, createWriteStream(localFilePath));

    const recording = await buildRecordingEntry(file, localFilePath);
    recordings.push(recording);
    existingIds.add(file.id);
    added += 1;
  }

  await backfillTranscripts(recordings);

  if (afterMeeting && liveTranscript) {
    latestRecording = recordings
      .slice()
      .sort((a, b) => new Date(b.syncedAt).getTime() - new Date(a.syncedAt).getTime())[0];
    if (latestRecording && !latestRecording.hasTranscript) {
      await attachLiveTranscript(latestRecording, liveTranscript);
    }
  }

  await writeRecordings(recordings);
  req.session.tokens = oauth2Client.credentials;
  return { total: recordings.length, added };
};

const resolveStoredFilePath = (storedPath) => {
  const candidates = [
    storedPath,
    path.join(__dirname, storedPath),
    path.join(__dirname, storedPath.replace(/^server\//, "")),
  ];
  return candidates;
};

const deleteStoredFile = async (storedPath) => {
  if (!storedPath) return;
  for (const candidate of resolveStoredFilePath(storedPath)) {
    try {
      await fs.unlink(candidate);
      return;
    } catch {
      // try next candidate
    }
  }
};

const deleteRecordingData = async (recording) => {
  await deleteStoredFile(recording.localPath);
  await deleteStoredFile(recording.transcriptPath);
};

app.get("/auth/google", (req, res) => {
  const returnTo = req.query.returnTo || "knowledge-base";
  req.session.oauthReturnTo = returnTo;

  if (MOCK_MODE) {
    createMockSession(req);
    return syncMeetingsForSession(req)
      .then(() => res.redirect(buildFrontendRedirect(req, { authResult: "success", synced: "1" })))
      .catch((error) => {
        console.error("Mock Google Meet sync failed", error);
        return res.redirect(buildFrontendRedirect(req, { authResult: "success" }));
      });
  }
  res.redirect(getAuthUrl());
});

app.get("/auth/google/callback", async (req, res) => {
  if (MOCK_MODE) {
    createMockSession(req);
    try {
      await syncMeetingsForSession(req);
      return res.redirect(buildFrontendRedirect(req, { authResult: "success", synced: "1" }));
    } catch (error) {
      console.error("Mock Google Meet sync failed", error);
      return res.redirect(buildFrontendRedirect(req, { authResult: "success" }));
    }
  }

  const code = req.query.code;
  if (!code) {
    return res.redirect(buildFrontendRedirect(req, { authResult: "failed" }));
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    req.session.tokens = tokens;
    try {
      await syncMeetingsForSession(req);
      res.redirect(buildFrontendRedirect(req, { authResult: "success", synced: "1" }));
    } catch (syncError) {
      console.error("Google Meet auto-sync after OAuth failed", syncError);
      res.redirect(buildFrontendRedirect(req, { authResult: "success" }));
    }
  } catch (error) {
    console.error("Google OAuth callback failed", error);
    res.redirect(buildFrontendRedirect(req, { authResult: "failed" }));
  }
});

app.get("/api/auth/status", (req, res) => {
  res.json({ connected: Boolean(req.session.tokens) });
});

app.get("/api/meetings", async (req, res) => {
  try {
    const recordings = await readRecordings();
    stripLegacyMockTranscripts(recordings);
    await writeRecordings(recordings);
    res.json({ connected: Boolean(req.session.tokens), recordings });
  } catch (error) {
    console.error("Failed to read recordings", error);
    res.status(500).json({ error: "Unable to read recordings" });
  }
});

const ensureAuthenticated = (req, res, next) => {
  if (!req.session.tokens) {
    return res.status(401).json({ error: "Google Meet is not connected" });
  }
  oauth2Client.setCredentials(req.session.tokens);
  next();
};

app.post("/api/meetings/sync", ensureAuthenticated, async (req, res) => {
  try {
    const afterMeeting = Boolean(req.body?.afterMeeting);
    const liveTranscript = req.body?.liveTranscript || null;
    const syncResult = await syncMeetingsForSession(req, { afterMeeting, liveTranscript });
    const recordings = await readRecordings();
    res.json({ success: true, ...syncResult, recordings });
  } catch (error) {
    console.error("Google Meet sync failed", error);
    res.status(500).json({ error: "Google Meet sync failed", details: error.message });
  }
});

app.get("/api/meetings/:id/transcript", async (req, res) => {
  try {
    const recordings = await readRecordings();
    const recording = recordings.find((item) => item.id === req.params.id);
    if (!recording) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    let transcript = await readTranscriptFromRecording(recording);

    if (!transcript) {
      return res.status(404).json({
        error: "No speech captured for this meeting",
        hint: "Start a meeting from DecisionOS, allow microphone access, speak during the call, then click Sync After Meeting.",
      });
    }

    res.json({
      id: recording.id,
      name: recording.name,
      syncedAt: recording.syncedAt,
      transcript,
    });
  } catch (error) {
    console.error("Transcript fetch failed", error);
    res.status(500).json({ error: "Unable to read transcript" });
  }
});

app.get("/api/meetings/:id/download", async (req, res) => {
  try {
    const recordings = await readRecordings();
    const recording = recordings.find((item) => item.id === req.params.id);
    if (!recording) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    const transcript = await readTranscriptFromRecording(recording);
    const safeBaseName = safeFileName(recording.name || "meeting-recording");

    if (transcript) {
      const transcriptFileName = `${safeBaseName}-transcript.txt`;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${transcriptFileName}"`);
      return res.send(transcript);
    }

    if (recording.transcriptPath) {
      let absoluteTranscriptPath = null;
      for (const candidate of resolveStoredFilePath(recording.transcriptPath)) {
        try {
          await fs.access(candidate);
          absoluteTranscriptPath = candidate;
          break;
        } catch {
          // try next candidate
        }
      }
      if (absoluteTranscriptPath) {
        return res.download(absoluteTranscriptPath, `${safeBaseName}-transcript.txt`);
      }
    }

    if (!recording.localPath) {
      return res.status(404).json({
        error: "No transcript available for this meeting",
        hint: "Speak during the meeting with microphone enabled, then save the meeting.",
      });
    }

    let absolutePath = null;
    for (const candidate of resolveStoredFilePath(recording.localPath)) {
      try {
        await fs.access(candidate);
        absolutePath = candidate;
        break;
      } catch {
        // try next candidate
      }
    }

    if (!absolutePath) {
      return res.status(404).json({ error: "Recording file not found on disk" });
    }

    res.download(absolutePath, recording.name || "meeting-recording.mp4");
  } catch (error) {
    console.error("Recording download failed", error);
    res.status(500).json({ error: "Unable to download recording" });
  }
});

app.delete("/api/meetings/:id", async (req, res) => {
  try {
    const recordings = await readRecordings();
    const index = recordings.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    const [removed] = recordings.splice(index, 1);
    await deleteRecordingData(removed);
    await writeRecordings(recordings);

    res.json({ success: true, deletedId: removed.id, recordings });
  } catch (error) {
    console.error("Meeting delete failed", error);
    res.status(500).json({ error: "Unable to delete meeting" });
  }
});

// --- DECISIONS API (LangGraph & SQLite integration) ---

app.get("/api/decisions", async (req, res) => {
  try {
    const decisions = await prisma.decision.findMany({
      include: {
        strategies: true,
        submitter: true,
        organization: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(decisions);
  } catch (error) {
    console.error("Failed to fetch decisions", error);
    res.status(500).json({ error: "Failed to fetch decisions" });
  }
});

// Single decision lookup (used by contributor polling)
app.get("/api/decisions/:id", async (req, res) => {
  try {
    const decision = await prisma.decision.findUnique({
      where: { id: req.params.id },
      include: {
        strategies: true,
        submitter: true,
        organization: true
      }
    });
    if (!decision) {
      return res.status(404).json({ error: "Decision not found" });
    }
    res.json(decision);
  } catch (error) {
    console.error("Failed to fetch decision", error);
    res.status(500).json({ error: "Failed to fetch decision" });
  }
});

app.post("/api/decisions", async (req, res) => {
  try {
    const inputData = req.body;
    // Process via LangGraph
    const result = await processDecision(inputData);
    res.json(result.dbDecision);
  } catch (error) {
    console.error("Failed to process decision", error);
    res.status(500).json({ error: "Failed to process decision", details: error.message });
  }
});

app.put("/api/decisions/:id/approve", async (req, res) => {
  try {
    const { strategyId, feedback } = req.body;
    const isRejection = !!feedback;

    // Ensure architect user exists for demo
    await prisma.user.upsert({
      where: { id: "user-architect-1" },
      update: {},
      create: {
        id: "user-architect-1",
        email: "james@acme.com",
        name: "James Chen",
        role: "ARCHITECT",
        organizationId: "org-demo-1"
      }
    });

    const decision = await prisma.decision.upsert({
      where: { id: req.params.id },
      update: {
        status: isRejection ? "REJECTED" : "APPROVED",
        architectId: "user-architect-1",
        approvedStrategy: !isRejection ? strategyId : null,
      },
      create: {
        id: req.params.id,
        customer: "Legacy Decision",
        context: "Unknown",
        priority: "Medium",
        status: isRejection ? "REJECTED" : "APPROVED",
        architectId: "user-architect-1",
        approvedStrategy: !isRejection ? strategyId : null,
        organizationId: "org-demo-1",
        submitterId: "user-demo-1",
      },
      include: {
        strategies: true,
        submitter: true,
        organization: true
      }
    });
    res.json(decision);
  } catch (error) {
    console.error("Failed to approve/reject decision", error);
    res.status(500).json({ error: "Failed to update decision" });
  }
});

app.listen(PORT, () => {
  console.log(`Google Meet integration server is running on http://localhost:${PORT}`);
  console.log(`Open ${FRONTEND_URL} after setting up Google credentials in server/.env`);
});
