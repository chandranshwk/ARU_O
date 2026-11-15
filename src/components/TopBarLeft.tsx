import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { BiChevronDown } from "react-icons/bi";
import { FiMoon, FiSun } from "react-icons/fi";
import { invoke } from "@tauri-apps/api/core";

const TopBarLeft = () => {
  const app = useAppContext();
  const darkMode = app.theme === "dark";

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dayString = now
    .toLocaleDateString([], { weekday: "long" })
    .toUpperCase();
  const dateString = now.toLocaleDateString([], {
    day: "2-digit",
    month: "long",
  });
  const [hours, minutes] = timeString.split(":");

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-4">
        <div
          className={`${
            darkMode ? "text-black bg-[#E9ECF2]" : "text-white bg-[#202328]"
          } flex items-center justify-center py-1.5 px-1 text-[9px] font-bold rounded-[5px] cursor-default`}
        >
          U_O
        </div>

        <div className="flex flex-col justify-center -gap-1">
          <div className="text-[10px] font-semibold tracking-wider">
            {hours} : {minutes}
          </div>
          <div className="flex items-center gap-1 leading-tight">
            <span
              className={`font-bold text-[8px] tracking-widest ${
                darkMode ? "text-[#b8c0cce0]" : "text-[#2e3033]"
              }`}
            >
              {dayString}
            </span>
            <span
              className={`font-medium text-[8px] tracking-widest ${
                darkMode ? "text-[#b8c0cce0]" : "text-[#161819]"
              }`}
            >
              {dateString}
            </span>
          </div>
        </div>
      </div>

      <div className="h-5 w-px bg-zinc-500/50 mx-4" />

      {/* Profile Pill with Active Highlight */}
      <div
        className={`${
          app.activePopover === "account"
            ? "bg-[#007AFF] text-white shadow-sm"
            : darkMode
              ? "bg-[#1c1c1c]/70 text-white hover:bg-[#1c1c1c]/70"
              : "bg-white/50 text-black hover:bg-white/70"
        } rounded-md px-3 py-1 flex items-center gap-2 cursor-pointer transition-colors`}
        onClick={(e) => app.openPopover("account", e)}
      >
        <div className="bg-green-500 size-1.5 rounded-full" />
        <span className="font-normal text-[10px] relative top-px">
          Pranab Choudhary
        </span>
        <BiChevronDown
          fill={app.activePopover === "account" ? "currentColor" : "#9f9fa9"}
          size={14}
        />
      </div>

      {/* Theme Slider */}
      <div
        className={`${
          darkMode ? "bg-[#1c1c1c]/70" : "bg-[#e6e8ec]/50"
        } relative flex items-center gap-1 rounded-md px-1 ml-3`}
      >
        <div
          className={`absolute top-[2.8px] left-1 z-10 size-4.5 px-2.5 rounded-sm shadow-sm transition-transform duration-200 ease-in-out ${
            darkMode
              ? "translate-x-[calc(100%+0.6rem)] bg-[#3c3d3f]"
              : "translate-x-[2.2px] bg-white"
          }`}
        />
        <button
          onClick={() => {
            app.setTheme("light");
            invoke("set_system_theme", { isDark: false });
          }}
          className={`relative z-20 flex h-6 w-6 items-center justify-center rounded-sm transition-colors ${
            !darkMode ? "text-black" : "text-zinc-400 hover:text-white"
          }`}
        >
          <FiSun size={14} />
        </button>
        <button
          onClick={() => {
            app.setTheme("dark");
            invoke("set_system_theme", { isDark: true });
          }}
          className={`relative z-20 flex h-6 w-6 items-center justify-center rounded-sm transition-colors ${
            darkMode ? "text-white" : "text-zinc-500 hover:text-black"
          }`}
        >
          <FiMoon size={14} />
        </button>
      </div>
    </div>
  );
};

export default TopBarLeft;
