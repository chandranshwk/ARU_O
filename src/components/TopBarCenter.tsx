import { useAppContext } from "../context/AppContext";
import { FiMonitor } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";

const TopBarCenter = () => {
  const app = useAppContext();
  const darkMode = app.theme === "dark";
  const activeDesktop = app.activeDesktop || 1;
  const setActiveDesktop = app.setActiveDesktop;

  return (
    <div className="flex items-center gap-3">
      {/* Workspaces Slider */}
      <div
        className={`${
          darkMode ? "bg-[#1c1c1c]/50" : "bg-[#e6e8ec]/50"
        } relative flex items-center rounded-md px-1`}
      >
        <div
          className={`absolute top-[3.55px] left-1.25 size-4.5 rounded-sm ${
            darkMode ? "bg-[#3c3d3f]" : "bg-white"
          } shadow-sm z-10 transition-transform duration-200 ease-in-out`}
          style={{
            transform: `translateX(${35 + (activeDesktop - 1) * 24}px)`,
          }}
        />

        {/* Monitor Icon */}
        <div
          className={`relative z-20 flex h-6 w-6 items-center justify-center rounded-sm ${
            darkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          <FiMonitor size={14} />
        </div>

        <div className="h-4 w-px bg-zinc-500/50 mx-1" />

        {[1, 2, 3, 4, 5, 6].map((desktop) => (
          <button
            key={desktop}
            onClick={() => setActiveDesktop(desktop)}
            className={`relative z-20 flex h-6 w-6 items-center justify-center rounded-sm cursor-pointer text-[11px] font-semibold transition-colors ${
              activeDesktop === desktop
                ? darkMode
                  ? "text-white"
                  : "text-black"
                : "text-[#757b84] hover:text-zinc-700"
            }`}
          >
            {desktop}
          </button>
        ))}
      </div>

      {/* Active App Indicator with Active Highlight */}
      <div
        className={`${
          app.activePopover === "active-apps"
            ? "bg-black/10 dark:bg-white/20 text-black dark:text-white"
            : darkMode
              ? "bg-[#1c1c1c]/50 text-white"
              : "bg-white/50 text-black"
        } shadow-sm rounded-md px-3 py-1 flex items-center gap-2 cursor-pointer transition-colors hover:bg-opacity-80`}
        onClick={(e) => app.openPopover("active-apps", e)}
      >
        <span className="font-semibold text-[10px]">Chrome</span>
        <BiChevronDown fill="#9f9fa9" size={14} />
      </div>
    </div>
  );
};

export default TopBarCenter;
