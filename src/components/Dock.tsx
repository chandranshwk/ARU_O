import { useState } from "react";
import { motion } from "motion/react";
import { invoke } from "@tauri-apps/api/core";

export interface DockApp {
  id: string;
  name: string;
  icon?: string;
  isOpen?: boolean;
  isActive?: boolean;
  badge?: number;
  profileAvatar?: string;
}

interface DockProps {
  apps?: DockApp[];
  onAppClick?: (app: DockApp) => void;
}

const DEFAULT_APPS: DockApp[] = [
  { id: "start", name: "Start" },
  { id: "explorer", name: "File Explorer", isOpen: true, isActive: true },
  { id: "chrome", name: "Google Chrome", isOpen: true },
  { id: "notion", name: "Notion" },
  { id: "vscode", name: "Visual Studio Code", isOpen: true },
  { id: "whatsapp", name: "WhatsApp", isOpen: true, badge: 1 },
  { id: "chrome-profile", name: "Chrome (Profile)" },
];

function AppGlyph({
  id,
  name,
  icon,
}: {
  id: string;
  name: string;
  icon?: string;
}) {
  if (icon) {
    return (
      <img
        src={icon}
        alt=""
        title={name}
        className="w-[24px] h-[24px] object-contain pointer-events-none"
      />
    );
  }

  switch (id) {
    case "start":
      return (
        <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]">
          <rect x="2" y="2" width="9" height="9" rx="1" fill="#38bdf8" />
          <rect x="13" y="2" width="9" height="9" rx="1" fill="#60a5fa" />
          <rect x="2" y="13" width="9" height="9" rx="1" fill="#0284c7" />
          <rect x="13" y="13" width="9" height="9" rx="1" fill="#2563eb" />
        </svg>
      );
    case "explorer":
      return (
        <svg viewBox="0 0 24 24" className="w-[24px] h-[24px]">
          <path
            d="M2 6a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z"
            fill="#facc15"
          />
          <path d="M2 9h20v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z" fill="#fde047" />
          <rect x="7" y="15" width="10" height="3" rx="1" fill="#2563eb" />
        </svg>
      );
    case "chrome":
    case "chrome-profile":
      return (
        <svg viewBox="0 0 24 24" className="w-[24px] h-[24px]">
          <circle cx="12" cy="12" r="10" fill="#ef4444" />
          <path d="M12 12L20.66 7A10 10 0 0 1 12 22V12Z" fill="#22c55e" />
          <path d="M12 12L12 22A10 10 0 0 1 3.34 7L12 12Z" fill="#eab308" />
          <circle cx="12" cy="12" r="4.5" fill="#ffffff" />
          <circle cx="12" cy="12" r="3.5" fill="#3b82f6" />
        </svg>
      );
    case "notion":
      return (
        <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]">
          <rect x="3" y="3" width="18" height="18" rx="3" fill="#ffffff" />
          <path
            d="M8 17V7h2.2l3.8 6.2V7H16v10h-2.1L10 10.6V17H8z"
            fill="#18181b"
          />
        </svg>
      );
    case "vscode":
      return (
        <svg viewBox="0 0 24 24" className="w-[23px] h-[23px]">
          <path
            d="M17.5 2L7.5 11.2 3.5 8.2 2 9.5 6 12.5 2 15.5l1.5 1.3 4-3 10 9.2 4.5-2V4l-4.5-2z"
            fill="#3b82f6"
          />
          <path d="M17.5 6.5v11L11 12l6.5-5.5z" fill="#1d4ed8" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className="w-[24px] h-[24px]">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="#22c55e" />
          <path
            d="M12 6.5a5.5 5.5 0 0 0-4.78 8.22L6.5 17.5l2.86-.7A5.5 5.5 0 1 0 12 6.5z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.7"
          />
        </svg>
      );
    default:
      return <div className="w-[22px] h-[22px] rounded bg-white/20" />;
  }
}

export default function Dock({ apps, onAppClick }: DockProps) {
  const [internalApps, setInternalApps] = useState<DockApp[]>(DEFAULT_APPS);
  const displayedApps = apps ?? internalApps;

  const handleClick = async (clickedApp: DockApp) => {
    if (onAppClick) {
      onAppClick(clickedApp);
      return;
    }

    try {
      const isNowActive = await invoke<boolean>("handle_dock_click", {
        appId: clickedApp.id,
      });

      setInternalApps((prev) =>
        prev.map((app) => ({
          ...app,
          isOpen: app.id === clickedApp.id ? true : app.isOpen,
          isActive: app.id === clickedApp.id ? isNowActive : false,
          badge: app.id === clickedApp.id ? undefined : app.badge,
        })),
      );
    } catch (err) {
      console.error("Dock click failed:", err);
    }
  };

  return (
    <div className="h-[48px] w-full flex items-center justify-center bg-[#202020]/95 backdrop-blur-md border-t border-white/10 rounded-t-[8px] px-2 select-none">
      <div className="flex items-center gap-1">
        {displayedApps.map((app) => (
          <motion.button
            key={app.id}
            onClick={() => handleClick(app)}
            whileHover={{ y: -2, scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            title={app.name}
            className={`relative flex items-center justify-center w-[38px] h-[38px] rounded-[6px] transition-colors ${
              app.isActive ? "bg-white/15" : "hover:bg-white/10"
            }`}
          >
            <AppGlyph id={app.id} name={app.name} icon={app.icon} />

            {/* Notification Badge */}
            {app.badge && app.badge > 0 && (
              <span className="absolute top-[2px] right-[2px] min-w-[15px] h-[15px] px-1 rounded-full bg-[#38bdf8] text-[#09090b] text-[10px] font-bold flex items-center justify-center leading-none shadow-sm">
                {app.badge}
              </span>
            )}

            {/* Profile Mini-Avatar */}
            {(app.profileAvatar || app.id === "chrome-profile") &&
              !app.badge && (
                <span className="absolute top-[2px] right-[2px] w-[13px] h-[13px] rounded-full bg-[#ea580c] border border-[#202020] flex items-center justify-center text-[8px] font-bold text-white">
                  P
                </span>
              )}

            {/* Active / Open Indicator Pill */}
            {app.isOpen && (
              <span
                className={`absolute bottom-[2px] h-[3px] rounded-full transition-all duration-200 ${
                  app.isActive ? "w-[14px] bg-[#60a5fa]" : "w-[6px] bg-white/50"
                }`}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
