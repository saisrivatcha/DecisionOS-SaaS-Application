import { useCallback, useEffect, useRef, useState } from "react";
import type { MeetingRecording } from "../lib/knowledgeIntegrations";
import {
  clearStoredSpeechLines,
  useLiveSpeechCapture,
} from "./useLiveSpeechCapture";

const MEET_PENDING_SYNC_KEY = "decisionos_meet_pending_sync";
const MEET_HIDDEN_AT_KEY = "decisionos_meet_hidden_at";
const AUTO_SAVE_HIDDEN_MS = 5000;

export function markMeetingPendingSync() {
  sessionStorage.setItem(MEET_PENDING_SYNC_KEY, String(Date.now()));
}

export function clearMeetingPendingSync() {
  sessionStorage.removeItem(MEET_PENDING_SYNC_KEY);
  sessionStorage.removeItem(MEET_HIDDEN_AT_KEY);
}

export function hasMeetingPendingSync() {
  return Boolean(sessionStorage.getItem(MEET_PENDING_SYNC_KEY));
}

interface UseGoogleMeetIntegrationOptions {
  onNewRecordings?: (added: number) => void;
  onMeetingSaved?: () => void;
}

export function useGoogleMeetIntegration(options: UseGoogleMeetIntegrationOptions = {}) {
  const { onNewRecordings, onMeetingSaved } = options;
  const [meetConnected, setMeetConnected] = useState(false);
  const [recordings, setRecordings] = useState<MeetingRecording[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("Connect to sync");
  const [lastAddedCount, setLastAddedCount] = useState(0);
  const [pendingMeetSync, setPendingMeetSync] = useState(hasMeetingPendingSync());
  const savedThisMeetingRef = useRef(false);
  const syncInFlightRef = useRef(false);

  const speech = useLiveSpeechCapture();

  const applyRecordings = useCallback((items: MeetingRecording[]) => {
    setRecordings(items);
    if (items.length > 0) {
      const latest = items
        .map((r) => new Date(r.syncedAt).getTime())
        .reduce((max, t) => Math.max(max, t), 0);
      setLastSync(new Date(latest).toLocaleString());
    } else {
      setLastSync("Connect to sync");
    }
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      const [statusRes, meetingsRes] = await Promise.all([
        fetch("/api/auth/status"),
        fetch("/api/meetings"),
      ]);

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setMeetConnected(Boolean(statusData.connected));
      }

      if (meetingsRes.ok) {
        const data = await meetingsRes.json();
        setMeetConnected(Boolean(data.connected));
        const items = Array.isArray(data.recordings) ? data.recordings : [];
        applyRecordings(items);
      }
    } catch (error) {
      console.error("Google Meet status refresh failed", error);
    }
  }, [applyRecordings]);

  const syncRecordings = useCallback(async (afterMeeting = false) => {
    if (syncInFlightRef.current) return;
    syncInFlightRef.current = true;
    setSyncing(true);

    try {
      if (afterMeeting) {
        speech.stopListening();
      }

      const livePayload = speech.getTranscriptPayload();
      const res = await fetch("/api/meetings/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          afterMeeting,
          liveTranscript: afterMeeting
            ? {
                lines: livePayload.lines,
                text: livePayload.text,
              }
            : undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.error || "Sync failed");
      }
      const data = await res.json();
      const items = Array.isArray(data.recordings) ? data.recordings : [];
      applyRecordings(items);
      setMeetConnected(true);

      const added = typeof data.added === "number" ? data.added : 0;
      setLastAddedCount(added);

      if (afterMeeting) {
        onNewRecordings?.(added);
        onMeetingSaved?.();
        clearMeetingPendingSync();
        setPendingMeetSync(false);
        savedThisMeetingRef.current = true;
        speech.resetCapture();
      }

      return data;
    } catch (error) {
      console.error("Google Meet sync failed", error);
      throw error;
    } finally {
      syncInFlightRef.current = false;
      setSyncing(false);
    }
  }, [applyRecordings, onMeetingSaved, onNewRecordings, speech]);

  const endMeetingAndSave = useCallback(() => {
    return syncRecordings(true);
  }, [syncRecordings]);

  const deleteMeeting = useCallback(async (recordingId: string) => {
    const res = await fetch(`/api/meetings/${encodeURIComponent(recordingId)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error || "Failed to delete meeting");
    }
    const data = await res.json();
    applyRecordings(Array.isArray(data.recordings) ? data.recordings : []);
    return data;
  }, [applyRecordings]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authResult = params.get("google_auth");

    if (authResult === "success") {
      const returnTo = params.get("returnTo") || "knowledge-base";
      window.history.replaceState({}, document.title, `/?page=${returnTo}`);
      refreshStatus();
    } else if (authResult === "failed") {
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      refreshStatus();
    }
  }, [refreshStatus]);

  useEffect(() => {
    if (pendingMeetSync && meetConnected && speech.isSupported && !speech.isListening) {
      speech.startListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMeetSync, meetConnected]);

  useEffect(() => {
    if (!pendingMeetSync || !meetConnected) return;

    const maybeAutoSaveAfterMeet = () => {
      if (document.visibilityState === "hidden") {
        sessionStorage.setItem(MEET_HIDDEN_AT_KEY, String(Date.now()));
        return;
      }

      if (document.visibilityState !== "visible") return;
      if (savedThisMeetingRef.current || syncInFlightRef.current) return;

      const hiddenAt = Number(sessionStorage.getItem(MEET_HIDDEN_AT_KEY) || "0");
      const hiddenDuration = hiddenAt ? Date.now() - hiddenAt : 0;
      const hasSpeech = speech.getTranscriptPayload().lines.length > 0;

      if (hiddenDuration >= AUTO_SAVE_HIDDEN_MS && hasSpeech) {
        endMeetingAndSave().catch(() => undefined);
      }
    };

    document.addEventListener("visibilitychange", maybeAutoSaveAfterMeet);
    return () => document.removeEventListener("visibilitychange", maybeAutoSaveAfterMeet);
  }, [pendingMeetSync, meetConnected, endMeetingAndSave, speech]);

  const startMeeting = useCallback(() => {
    clearStoredSpeechLines();
    speech.resetCapture();
    savedThisMeetingRef.current = false;
    sessionStorage.removeItem(MEET_HIDDEN_AT_KEY);
    markMeetingPendingSync();
    setPendingMeetSync(true);
    speech.startListening();
    window.open("https://meet.google.com/new", "_blank", "noopener,noreferrer");
  }, [speech]);

  return {
    meetConnected,
    recordings,
    recordingsCount: recordings.length,
    syncing,
    lastSync,
    lastAddedCount,
    pendingMeetSync,
    refreshStatus,
    endMeetingAndSave,
    deleteMeeting,
    startMeeting,
    speech,
  };
}
