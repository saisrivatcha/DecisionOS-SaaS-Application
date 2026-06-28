import { cn } from "./ui/utils";
import {
  LayoutDashboard, Plus, ClipboardList, BookMarked,
  BarChart2, Settings, LogOut, ChevronRight,
  Bell, Search, User, InboxIcon, BookOpen,
} from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import type { Page, User as UserType } from "../App";

// Architect nav
const architectNav = [
  { id: "dashboard"       as Page, label: "Work Queue",             icon: LayoutDashboard },
  { id: "pending-reviews" as Page, label: "Pending Reviews",        icon: InboxIcon, badge: true },
  { id: "memory"          as Page, label: "Organizational Memory",  icon: BookMarked },
  { id: "insights"        as Page, label: "Insights",               icon: BarChart2 },
  { id: "settings"        as Page, label: "Department Settings",    icon: Settings },
];

// Contributor nav
const contributorNav = [
  { id: "dashboard"        as Page, label: "Work Queue",       icon: LayoutDashboard },
  { id: "knowledge-base"   as Page, label: "Knowledge Base", icon: BookOpen },
  { id: "capture-decision" as Page, label: "Capture Decision", icon: Plus },
  { id: "my-decisions"     as Page, label: "My Decisions",     icon: ClipboardList },
  { id: "profile"          as Page, label: "Profile",          icon: User },
];

const pageTitles: Record<Page, string> = {
  "dashboard":         "Work Queue",
  "capture-decision":  "Capture Decision",
  "my-decisions":      "My Decisions",
  "submission-view":   "Submission Status",
  "pending-reviews":   "Pending Reviews",
  "workspace":         "Decision Review",
  "memory":            "Organizational Memory",
  "knowledge-base":    "Knowledge Base",
  "insights":          "Insights",
  "settings":          "Department Settings",
  "profile":           "Profile",
};

interface LayoutProps {
  children: React.ReactNode;
  page: Page;
  user: UserType;
  pendingCount: number;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Layout({ children, page, user, pendingCount, onNavigate, onLogout }: LayoutProps) {
  const isArchitect = user.role === "architect";
  const navItems = isArchitect ? architectNav : contributorNav;

  const isActive = (id: Page) => {
    if (page === id) return true;
    if (id === "pending-reviews" && page === "workspace") return true;
    if (id === "my-decisions" && page === "submission-view") return true;
    if (id === "capture-decision" && page === "submission-view") return false;
    return false;
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f7f7f9" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 border-r"
        style={{ width: 228, background: "#ffffff", borderColor: "#e8e8ed" }}
      >
        {/* Logo */}
        <div className="h-[60px] flex items-center px-5 border-b" style={{ borderColor: "#e8e8ed" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#1a1a2e" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L12.5 4.5V9.5L7 12.5L1.5 9.5V4.5L7 1.5Z" stroke="white" strokeWidth="1.2" fill="none" />
                <circle cx="7" cy="7" r="1.8" fill="white" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold leading-none tracking-tight" style={{ color: "#1a1a2e" }}>
                DecisionOS
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#a0a0b0" }}>Enterprise Decision Memory</div>
            </div>
          </div>
        </div>

        {/* Role indicator */}
        <div className="px-4 pt-3 pb-1">
          <div
            className="px-3 py-2 rounded-xl flex items-center gap-2"
            style={{
              background: isArchitect ? "#f0f0f8" : "#f7f7f9",
              border: `1px solid ${isArchitect ? "#ddddf0" : "#e8e8ed"}`,
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: isArchitect ? "#4f46e5" : "#22c55e" }} />
            <span className="text-xs font-semibold" style={{ color: isArchitect ? "#4f46e5" : "#374151" }}>
              {isArchitect ? "Decision Architect" : "Decision Contributor"}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);
            const showBadge = "badge" in item && item.badge && pendingCount > 0;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all")}
                style={active
                  ? { background: "#f0f0f8", color: "#4f46e5", fontWeight: 500 }
                  : { color: "#6b6b80" }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {showBadge && (
                  <span className="text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold" style={{ background: "#ef4444", color: "#fff" }}>
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="p-3 border-t space-y-1" style={{ borderColor: "#e8e8ed" }}>
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl">
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarFallback
                className="text-xs font-semibold"
                style={{ background: isArchitect ? "#ededf8" : "#f0fdf4", color: isArchitect ? "#4f46e5" : "#059669" }}
              >
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: "#1a1a2e" }}>{user.name}</div>
              <div className="text-xs truncate" style={{ color: "#a0a0b0" }}>{user.department} · {isArchitect ? "Architect" : "Contributor"}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" style={{ color: "#dc2626" }} />
            <span className="text-xs" style={{ color: "#dc2626" }}>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="h-[60px] flex items-center justify-between px-6 flex-shrink-0 border-b"
          style={{ background: "#fff", borderColor: "#e8e8ed" }}
        >
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: "#a0a0b0" }}>DecisionOS</span>
            <ChevronRight className="w-3 h-3" style={{ color: "#d1d1db" }} />
            <span className="font-medium" style={{ color: "#1a1a2e" }}>{pageTitles[page]}</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: "#6b6b80" }}>
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative" style={{ color: "#6b6b80" }}>
              <Bell className="w-4 h-4" />
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "#ef4444" }} />
              )}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
