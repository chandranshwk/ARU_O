import { useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import "./App.css";
import Statusbar from "./components/Statusbar";
import { useAppContext } from "./context/AppContext";
import ActiveAppsMenu from "./components/popovers/ActiveAppsMenu";
import WifiMenu from "./components/popovers/WifiMenu";
import BluetoothMenu from "./components/popovers/BluetoothMenu";
import BatteryMenu from "./components/popovers/BatteryMenu";
import ControlCenter from "./components/popovers/ControlCenter";
import NotificationsMenu from "./components/popovers/NotificationsMenu";
import ProfileMenu from "./components/popovers/ProfileMenu";
import Dock, { DockApp } from "./components/Dock";

function App() {
  const windowLabel = getCurrentWindow().label;
  const [popoverType, setPopoverType] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const app = useAppContext();
  const darkMode = app.theme === "dark";

  const INITIAL_APPS: DockApp[] = [
    {
      id: "start",
      name: "Start",
      icon: "https://icons8.com",
    },
    {
      id: "explorer",
      name: "File Explorer",
      icon: "https://icons8.com",
      isOpen: true,
      isActive: true,
    },
    {
      id: "chrome-work",
      name: "Google Chrome",
      icon: "https://icons8.com",
      isOpen: true,
    },
    {
      id: "notion",
      name: "Notion",
      icon: "https://icons8.com",
    },
    {
      id: "vscode",
      name: "Visual Studio Code",
      icon: "https://icons8.com",
      isOpen: true,
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: "https://icons8.com",
      isOpen: true,
      badge: 1,
    },
    {
      id: "chrome-personal",
      name: "Chrome (Profile)",
      icon: "https://icons8.com",
      profileAvatar: "https://dicebear.com",
    },
  ];

  useEffect(() => {
    if (windowLabel === "popover") {
      const unlisten = listen<string>("popover-opened", (event) => {
        setPopoverType(event.payload);
        setShow(false);
        setTimeout(() => setShow(true), 10);
      });
      return () => {
        unlisten.then((f) => f());
      };
    }
  }, [windowLabel]);

  if (windowLabel === "popover") {
    return (
      <div
        className={`w-full h-full flex flex-col overflow-hidden rounded-[5px] shadow-[0_10px_40px_rgba(0,0,0,0.3)] border transition-all duration-200 ease-out ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        } ${
          darkMode
            ? "bg-[#1c1c1e]/30 border-[#3a3a3c] text-[#f2f2f7]"
            : "bg-[#ffffff]/30 border-[#e5e5ea] text-[#1c1c1e]"
        }`}
      >
        {popoverType === "active-apps" && <ActiveAppsMenu />}
        {popoverType === "account" && <ProfileMenu />}
        {popoverType === "wifi" && <WifiMenu />}
        {popoverType === "bluetooth" && <BluetoothMenu />}
        {popoverType === "battery" && <BatteryMenu />}
        {popoverType === "control-center" && <ControlCenter />}
        {popoverType === "notifications" && <NotificationsMenu />}
      </div>
    );
  }

  if (windowLabel === "dock") {
    const [apps, setApps] = useState<DockApp[]>(INITIAL_APPS);

    const handleAppClick = (clickedApp: DockApp) => {
      setApps((prev) =>
        prev.map((app) => ({
          ...app,
          isOpen: app.id === clickedApp.id ? true : app.isOpen,
          isActive: app.id === clickedApp.id,
          badge: app.id === clickedApp.id ? undefined : app.badge,
        })),
      );
    };

    return <Dock apps={apps} onAppClick={handleAppClick} />;
  }

  return (
    <div className="bg-transparent">
      <Statusbar />
    </div>
  );
}

export default App;
