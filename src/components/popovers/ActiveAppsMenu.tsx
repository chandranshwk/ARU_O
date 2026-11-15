import { FiCheck, FiChevronRight } from "react-icons/fi";
import { useAppContext } from "../../context/AppContext";

const ActiveAppsMenu = () => {
  const app = useAppContext();
  const darkMode = app.theme === "dark";

  const apps = [
    {
      name: "Chrome",
      badge: "C",
      active: true,
      desc: "Current app · 3 windows",
    },
    {
      name: "Files",
      badge: "F",
      active: false,
      desc: "Home",
    },
    {
      name: "Terminal",
      badge: ">_",
      active: false,
      desc: "1 window",
    },
    {
      name: "Settings",
      badge: "S",
      active: false,
      desc: "System preferences",
    },
  ];

  const textMuted = darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]";

  return (
    <div
      className={`flex flex-col w-full h-full rounded-b-sm border text-[13px] select-none transition-colors ${
        darkMode
          ? "bg-[#090909] border-[#171717] text-[#F1F3F4] shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
          : "bg-[#f5f5f5] border-[#E5E7EB] text-[#111827] shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
      }`}
    >
      {/* Header */}
      <div className="px-4 pt-3.5 pb-2">
        <span className="text-[14px] font-semibold tracking-[-0.01em]">
          Active apps
        </span>
      </div>

      {/* WORKSPACE 1 */}
      <div
        className={`px-4 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.04em] ${textMuted}`}
      >
        WORKSPACE 1
      </div>

      {/* App List */}
      <div className="flex flex-col gap-1 px-2.5 pb-2">
        {apps.map((item) => (
          <div
            key={item.name}
            className={`flex items-center justify-between px-2.5 py-2 rounded-sm cursor-pointer transition-colors ${
              item.active
                ? darkMode
                  ? "bg-[#233245] hover:bg-[#121315]"
                  : "bg-[#EEF4FC] hover:bg-[#E4EEFA]"
                : darkMode
                  ? "hover:bg-white/5"
                  : "hover:bg-black/4"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Letter / Symbol Badge */}
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-[7px] font-semibold shrink-0 ${
                  item.badge === ">_"
                    ? "text-[11px] font-mono tracking-tighter"
                    : "text-[12px]"
                } ${
                  item.active
                    ? "bg-[#1A73E8] text-white"
                    : darkMode
                      ? "bg-[#35373B] text-[#E8EAED]"
                      : "bg-[#F1F3F4] text-[#374151]"
                }`}
              >
                {item.badge}
              </div>

              {/* App Name & Subtitle */}
              <div className="flex flex-col">
                <span className="font-medium text-[13px] leading-tight">
                  {item.name}
                </span>
                <span
                  className={`text-[11px] leading-tight mt-0.5 ${textMuted}`}
                >
                  {item.desc}
                </span>
              </div>
            </div>

            {item.active && (
              <FiCheck
                size={15}
                className={darkMode ? "text-[#8AB4F8]" : "text-[#1A73E8]"}
              />
            )}
          </div>
        ))}
      </div>

      {/* Footer Divider & Show All Windows */}
      <div className="mt-auto">
        <div
          className={`w-full h-px ${
            darkMode ? "bg-[#171717]" : "bg-[#E5E7EB]"
          }`}
        />
        <div className="p-1.5">
          <div
            className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
              darkMode ? "hover:bg-white/5" : "hover:bg-black/4"
            }`}
          >
            <span
              className={`text-[13px] ${
                darkMode ? "text-[#E8EAED]" : "text-[#1F2937]"
              }`}
            >
              Show all windows
            </span>
            <FiChevronRight size={14} className={textMuted} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveAppsMenu;
