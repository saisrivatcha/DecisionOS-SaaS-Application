import { useState } from "react";
import { Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import type { User } from "../App";
import { DEMO_USERS } from "../App";

const roleDescriptions: Record<string, { title: string; description: string; capabilities: string[] }> = {
  architect: {
    title: "Decision Architect",
    description: "Reviews AI analysis and approves organizational decisions.",
    capabilities: ["Review pending submissions", "Access Organizational Memory", "View AI analysis & confidence", "Approve or reject strategies", "Configure department settings"],
  },
  contributor: {
    title: "Decision Contributor",
    description: "Captures business situations and submits them for review.",
    capabilities: ["Capture business discussions", "Upload meeting notes & emails", "Track submission status", "View approved decisions"],
  },
};

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);

  const handleDemoLogin = (user: User) => {
    setLoadingEmail(user.email);
    setLoading(true);
    setTimeout(() => onLogin(user), 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const match = DEMO_USERS.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password,
    );
    if (!match) { setError("Invalid credentials. Use the demo accounts above."); return; }
    setLoading(true);
    setTimeout(() => onLogin(match), 700);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 flex-shrink-0"
        style={{ width: 460, background: "#1a1a2e" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" stroke="white" strokeWidth="1.3" fill="none" />
              <circle cx="8" cy="8" r="2.5" fill="white" />
            </svg>
          </div>
          <span className="text-white text-base font-semibold">DecisionOS</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight mb-4" style={{ color: "#fff" }}>
            The operating system for organizational decision-making.
          </h1>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: "#8888a8" }}>
            Capture → Learn → Remember → Reuse.
          </p>
          <div className="space-y-4">
            {[
              { title: "Capture",  body: "Record any business discussion in minutes" },
              { title: "Analyze",  body: "AI searches past decisions for similar situations" },
              { title: "Remember", body: "Every approved decision lives in Organizational Memory" },
              { title: "Reuse",    body: "Future teams make better decisions from your history" },
            ].map(({ title, body }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(79,70,229,0.3)" }}>
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: "#818cf8" }} />
                </div>
                <div>
                  <span className="text-sm font-semibold" style={{ color: "#e0e0f0" }}>{title} — </span>
                  <span className="text-sm" style={{ color: "#8888a8" }}>{body}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs leading-relaxed" style={{ color: "#444460" }}>
          "Companies have CRMs for customers, ERPs for resources, and GitHub for code.
          Every company also deserves a system that remembers its decisions."
        </p>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto" style={{ background: "#f7f7f9" }}>
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#1a1a2e" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L12.5 4.5V9.5L7 12.5L1.5 9.5V4.5L7 1.5Z" stroke="white" strokeWidth="1.2" fill="none" />
                <circle cx="7" cy="7" r="1.8" fill="white" />
              </svg>
            </div>
            <span className="text-base font-semibold" style={{ color: "#1a1a2e" }}>DecisionOS</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "#1a1a2e" }}>Sign in</h2>
          <p className="text-sm mb-7" style={{ color: "#6b6b80" }}>Choose your role to explore the platform.</p>

          {/* Demo accounts */}
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a0a0b0" }}>
            Demo Accounts — Click to sign in
          </p>
          <div className="space-y-3 mb-6">
            {DEMO_USERS.map((user) => {
              const rd = roleDescriptions[user.role];
              const isArchitect = user.role === "architect";
              const isLoading = loadingEmail === user.email;
              return (
                <button
                  key={user.email}
                  onClick={() => handleDemoLogin(user)}
                  disabled={loading}
                  className="w-full text-left rounded-2xl border-2 p-5 transition-all hover:shadow-md group"
                  style={{
                    borderColor: isArchitect ? "#4f46e5" : "#e8e8ed",
                    background: isArchitect ? "#f0f0f8" : "#ffffff",
                    opacity: loading && !isLoading ? 0.5 : 1,
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
                      style={{ background: isArchitect ? "#4f46e5" : "#1a1a2e", color: "#fff" }}
                    >
                      {isLoading
                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : user.initials}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-sm" style={{ color: "#1a1a2e" }}>{user.name}</span>
                        <span className="text-xs" style={{ color: "#a0a0b0" }}>·</span>
                        <span className="text-xs" style={{ color: "#a0a0b0" }}>{user.email}</span>
                      </div>

                      {/* Role name — full, no abbreviation */}
                      <div className="mb-2">
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={isArchitect
                            ? { background: "#4f46e5", color: "#fff" }
                            : { background: "#1a1a2e", color: "#fff" }}
                        >
                          {rd.title}
                        </span>
                      </div>

                      {/* Role description */}
                      <p className="text-xs mb-2" style={{ color: "#6b6b80" }}>{rd.description}</p>

                      {/* Capabilities */}
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        {rd.capabilities.slice(0, 3).map((cap) => (
                          <span key={cap} className="text-xs" style={{ color: "#a0a0b0" }}>· {cap}</span>
                        ))}
                      </div>
                    </div>

                    <ArrowRight
                      className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                      style={{ color: "#4f46e5" }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: "#e8e8ed" }} />
            <span className="text-xs" style={{ color: "#a0a0b0" }}>or sign in with email</span>
            <div className="flex-1 h-px" style={{ background: "#e8e8ed" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
              style={{ borderColor: "#e8e8ed", color: "#1a1a2e", background: "#fff" }}
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none pr-11"
                style={{ borderColor: "#e8e8ed", color: "#1a1a2e", background: "#fff" }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#a0a0b0" }} onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-xs px-3 py-2.5 rounded-xl" style={{ background: "#fef2f2", color: "#dc2626" }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl text-sm font-semibold"
              style={{ background: "#1a1a2e", color: "#fff", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p className="text-xs text-center mt-4" style={{ color: "#a0a0b0" }}>
            Demo password:{" "}
            <code className="px-1.5 py-0.5 rounded" style={{ background: "#f0f0f8", color: "#4f46e5" }}>demo</code>
          </p>
        </div>
      </div>
    </div>
  );
}
