import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import {
  createContext,
  MouseEvent,
  useContext,
  useState,
  useEffect,
} from "react";

interface AppContextType {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  activeDesktop: number;
  setActiveDesktop: (desktop: number) => void;
  openPopover: (type: string, event: MouseEvent<HTMLElement>) => Promise<void>;
  activePopover: string | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("app-theme");
    return (saved as "light" | "dark") || "light";
  });

  const [activeDesktop, setActiveDesktop] = useState<number>(1);
  const [activePopover, setActivePopover] = useState<string | null>(null);

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    localStorage.setItem("app-theme", newTheme);
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "app-theme" && e.newValue) {
        setThemeState(e.newValue as "light" | "dark");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const unlisten = listen("popover-closed", () => {
      setActivePopover(null);
    });
    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  const windows = {
    battery: { h: 291, w: 264 },
    bluetooth: { h: 321, w: 300 },
    notifications: { h: 451, w: 320 },
    "control-center": { h: 451, w: 350 },
    spotlight: { h: 301, w: 400 },
    wifi: { h: 520, w: 284 },
    account: { h: 292, w: 264 },
    "active-apps": { h: 346, w: 300 },
  };

  const openPopover = async (type: string, event: MouseEvent<HTMLElement>) => {
    try {
      // If clicking the active popover, close it
      if (activePopover === type) {
        await invoke("hide_popover");
        setActivePopover(null);
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const config = windows[type as keyof typeof windows];
      const popoverWidth = config?.w || 300;
      const popoverHeight = config?.h || 400;

      let x = rect.left;
      let y = rect.bottom + 9;

      if (x + popoverWidth > window.innerWidth) {
        x = window.innerWidth - popoverWidth - 8;
      }
      if (x < 8) x = 8;

      await invoke("open_popover", {
        x,
        y,
        type: type,
        width: popoverWidth,
        height: popoverHeight + 3,
      });

      setActivePopover(type);
    } catch (error) {
      console.error("Failed to open popover:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        activeDesktop,
        setActiveDesktop,
        openPopover,
        activePopover,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
