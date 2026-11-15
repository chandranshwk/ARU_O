import { FiChevronRight, FiMinus } from "react-icons/fi";
import { useAppContext } from "../../context/AppContext";

const NotificationsMenu = () => {
  const app = useAppContext();
  const darkMode = app.theme === "dark";

  const notifications = [
    {
      id: 1,
      app: "Calendar",
      time: "Now",
      title: "Design review",
      body: "Starts in 10 minutes",
    },
    {
      id: 2,
      app: "Files",
      time: "12m",
      title: "Download complete",
      body: "Your files are ready",
    },
    {
      id: 3,
      app: "System",
      time: "1h",
      title: "You're up to date",
      body: "No updates available",
    },
  ];

  const textMuted = darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]";
  const divider = darkMode ? "bg-[#171717]" : "bg-[#E5E7EB]";

  return (
    <div
      className={`flex flex-col w-full h-full rounded-b-sm border text-[13px] select-none transition-colors ${
        darkMode
          ? "bg-[#090909] border-[#171717] text-[#F1F3F4] shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
          : "bg-white border-[#E5E7EB] text-[#111827] shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5">
        <span className="text-[14px] font-semibold tracking-[-0.01em]">
          Notifications
        </span>
        <span className={`text-[11px] font-normal ${textMuted}`}>3 new</span>
      </div>

      {/* Focus Status Row */}
      <div className="px-2.5 pb-2">
        <div
          className={`flex items-center justify-between px-2 py-2 rounded-sm cursor-pointer transition-colors ${
            darkMode ? "hover:bg-white/5" : "hover:bg-black/4"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`rounded-[7px] w-7 h-7 flex items-center justify-center shrink-0 ${
                darkMode
                  ? "bg-[#35373B] text-[#E8EAED]"
                  : "bg-[#F1F3F4] text-[#374151]"
              }`}
            >
              <FiMinus size={14} strokeWidth={2.4} />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium leading-tight">
                Focus is off
              </span>
              <span className={`text-[11px] leading-tight mt-0.5 ${textMuted}`}>
                All notifications allowed
              </span>
            </div>
          </div>
          <FiChevronRight size={14} className={textMuted} />
        </div>
      </div>

      {/* Divider */}
      <div className={`w-full h-px ${divider}`} />

      {/* TODAY Section */}
      <div
        className={`px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.04em] ${textMuted}`}
      >
        TODAY
      </div>

      {/* Notification Cards */}
      <div className="flex flex-col gap-2 px-3 pb-3.5">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col rounded-sm px-3 py-2.5 cursor-pointer transition-colors ${
              darkMode
                ? "bg-[#23252853] hover:bg-[#121315]"
                : "bg-[#F5F6F8] hover:bg-[#ECEEF2]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[11px] leading-none ${textMuted}`}>
                {item.app}
              </span>
              <span className={`text-[11px] leading-none ${textMuted}`}>
                {item.time}
              </span>
            </div>
            <span className="font-medium text-[13px] leading-tight">
              {item.title}
            </span>
            <span className={`text-[11px] leading-tight mt-0.5 ${textMuted}`}>
              {item.body}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Divider & Settings Link */}
      <div className="mt-auto">
        <div className={`w-full h-px ${divider}`} />
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
              Notification settings...
            </span>
            <FiChevronRight size={14} className={textMuted} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsMenu;
