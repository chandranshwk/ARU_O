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
          /* KEPT YOUR COLORS: Removed the /50 to make it solid and visible */
          darkMode ? "bg-[#1c1c1c]/70" : "bg-[#f9f9f9]"
        } relative flex items-center rounded-md px-1 ${
          /* Added a subtle border to separate it from the top bar */
          darkMode ? "border border-white/10" : "border border-black/10"
        } shadow-sm`}
      >
        <div
          className={`absolute top-[2.3px] left-1 z-10 size-5 rounded-sm ${
            /* Made the sliding box pop more with a stronger shadow */
            darkMode ? "bg-[#3c3d3f] shadow-md" : "bg-[#71757b3a] shadow-md"
          } transition-transform duration-200 ease-in-out`}
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

        <div
          className={`h-4 w-px mx-1 ${darkMode ? "bg-white/20" : "bg-black/10"}`}
        />

        {[1, 2, 3, 4, 5, 6].map((desktop) => (
          <button
            key={desktop}
            onClick={() => setActiveDesktop(desktop)}
            className={`relative z-20 flex h-6 w-6 items-center justify-center rounded-sm cursor-pointer text-[11px] font-semibold transition-colors ${
              activeDesktop === desktop
                ? darkMode
                  ? "text-white"
                  : "text-black"
                : /* Improved the inactive text contrast slightly so it's easier to read */
                  darkMode
                  ? "text-zinc-400 hover:text-zinc-200"
                  : "text-zinc-500 hover:text-black"
            }`}
          >
            {desktop}
          </button>
        ))}
      </div>

      {/* Active App Indicator */}
      <div
        className={`${
          app.activePopover === "active-apps"
            ? "bg-[#007AFF] text-white shadow-sm"
            : darkMode
              ? "bg-[#1c1c1c]/70 text-white hover:bg-[#2c2c2c] border border-white/10"
              : "bg-[#e6e8ec] text-black hover:bg-[#d6d8dc] border border-black/10"
        } rounded-md px-3 py-1.25 flex items-center gap-2 cursor-pointer transition-colors shadow-sm`}
        onClick={(e) => app.openPopover("active-apps", e)}
      >
        <span className="font-semibold text-[10px] relative top-[1.5px]">
          Chrome
        </span>
        <BiChevronDown
          fill={
            app.activePopover === "active-apps"
              ? "currentColor"
              : darkMode
                ? "#F0F0F099"
                : "#1D1D1E"
          }
          size={14}
        />
      </div>
    </div>
  );
};

export default TopBarCenter;
