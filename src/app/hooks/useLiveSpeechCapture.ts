import { useCallback, useEffect, useRef, useState } from "react";

export interface SpeechLine {
  id: string;
  timestamp: string;
  text: string;
}

const STORAGE_KEY = "decisionos_live_speech_lines";

function loadStoredLines(): SpeechLine[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistLines(lines: SpeechLine[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
}

export function clearStoredSpeechLines() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function formatLiveTranscript(lines: SpeechLine[]) {
  if (lines.length === 0) return "";
  const header = `Live Meeting Transcript — ${new Date().toLocaleString()}\n`;
  const body = lines.map((line) => `[${line.timestamp}] You: ${line.text}`).join("\n\n");
  return `${header}\n${body}`;
}

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognitionCtor():
  | (new () => SpeechRecognitionInstance)
  | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
}

export function useLiveSpeechCapture() {
  const [lines, setLines] = useState<SpeechLine[]>(() => loadStoredLines());
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const keepListeningRef = useRef(false);
  const linesRef = useRef(lines);

  const SpeechRecognition = getSpeechRecognitionCtor();
  const isSupported = Boolean(SpeechRecognition);

  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  const addLine = useCallback((text: string) => {
    const line: SpeechLine = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toLocaleTimeString(),
      text,
    };
    setLines((prev) => {
      const next = [...prev, line];
      persistLines(next);
      return next;
    });
    setInterimText("");
  }, []);

  const stopListening = useCallback(() => {
    keepListeningRef.current = false;
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      setSpeechError("Live speech capture needs Chrome or Edge.");
      return;
    }

    setSpeechError(null);
    keepListeningRef.current = true;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // already running
      }
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const spoken = result[0]?.transcript?.trim();
        if (!spoken) continue;
        if (result.isFinal) {
          addLine(spoken);
        } else {
          interim += spoken;
        }
      }
      setInterimText(interim.trim());
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        setSpeechError("Microphone access denied. Allow mic permission to capture your speech.");
        keepListeningRef.current = false;
        setIsListening(false);
        return;
      }
      if (event.error !== "no-speech" && event.error !== "aborted") {
        setSpeechError(`Speech capture error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (keepListeningRef.current) {
        try {
          recognition.start();
          setIsListening(true);
        } catch {
          // ignore restart race
        }
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
    } catch (error) {
      setSpeechError("Could not start microphone. Check browser permissions.");
      keepListeningRef.current = false;
    }
  }, [SpeechRecognition, addLine]);

  const resetCapture = useCallback(() => {
    stopListening();
    setLines([]);
    setInterimText("");
    clearStoredSpeechLines();
  }, [stopListening]);

  const getTranscriptPayload = useCallback(() => {
    return {
      lines: linesRef.current,
      text: formatLiveTranscript(linesRef.current),
    };
  }, []);

  useEffect(() => {
    return () => {
      keepListeningRef.current = false;
      recognitionRef.current?.stop();
    };
  }, []);

  return {
    isSupported,
    isListening,
    lines,
    interimText,
    speechError,
    startListening,
    stopListening,
    resetCapture,
    getTranscriptPayload,
  };
}
