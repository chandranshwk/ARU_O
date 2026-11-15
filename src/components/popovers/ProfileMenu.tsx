import { FiCheck } from "react-icons/fi";
import { useAppContext } from "../../context/AppContext";

const ProfileMenu = () => {
  const app = useAppContext();
  const darkMode = app.theme === "dark";

  const accounts = [
    {
      id: "personal",
      name: "John Doe",
      initials: "JD",
      role: "Personal · Active",
      active: true,
    },
    {
      id: "work",
      name: "John Doe",
      initials: "JD",
      role: "Work",
      active: false,
    },
    {
      id: "guest",
      name: "John Doe",
      initials: "JD",
      role: "Guest",
      active: false,
    },
  ];

  const textMuted = darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]";

  return (
    <div
      className={`flex flex-col w-full h-full rounded-b-md border text-[13px] select-none transition-colors ${
        darkMode
          ? "bg-[#090909] border-[#171717] text-[#F1F3F4] shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
          : "bg-white border-[#E5E7EB] text-[#111827] shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
      }`}
    >
      {/* Header */}
      <div className="px-4 pt-3.5 pb-2">
        <span className="text-[14px] font-semibold tracking-[-0.01em]">
          Account
        </span>
      </div>

      {/* Account Switcher List */}
      <div className="flex flex-col gap-1 px-2.5 pb-2">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
              acc.active
                ? darkMode
                  ? "bg-[#243447] hover:bg-[#2A3C52]"
                  : "bg-[#EEF4FC] hover:bg-[#E4EEFA]"
                : darkMode
                  ? "hover:bg-white/5"
                  : "hover:bg-black/4"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Initials Badge */}
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-md text-[11px] font-semibold shrink-0 ${
                  acc.active
                    ? "bg-[#1A73E8] text-white"
                    : darkMode
                      ? "bg-[#35373B] text-[#E8EAED]"
                      : "bg-[#F1F3F4] text-[#374151]"
                }`}
              >
                {acc.initials}
              </div>

              {/* Name & Role */}
              <div className="flex flex-col">
                <span className="font-medium text-[13px] leading-tight">
                  {acc.name}
                </span>
                <span
                  className={`text-[11px] leading-tight mt-0.5 ${textMuted}`}
                >
                  {acc.role}
                </span>
              </div>
            </div>

            {acc.active && (
              <FiCheck
                size={14}
                className={darkMode ? "text-[#8AB4F8]" : "text-[#1A73E8]"}
              />
            )}
          </div>
        ))}
      </div>

      {/* Footer Divider & Session Actions */}
      <div className="mt-auto">
        <div
          className={`w-full h-px ${
            darkMode ? "bg-[#171717]" : "bg-[#E5E7EB]"
          }`}
        />
        <div className="flex flex-col p-1.5">
          {/* Lock Screen */}
          <div
            className={`flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer transition-colors ${
              darkMode ? "hover:bg-white/5" : "hover:bg-black/4"
            }`}
          >
            <span
              className={`text-[13px] ${
                darkMode ? "text-[#E8EAED]" : "text-[#1F2937]"
              }`}
            >
              Lock screen
            </span>
            <span className={`text-[11px] tracking-wider ${textMuted}`}>
              ^⌘Q
            </span>
          </div>

          {/* Sign Out */}
          <div
            className={`flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer transition-colors ${
              darkMode ? "hover:bg-white/5" : "hover:bg-black/4"
            }`}
          >
            <span
              className={`text-[13px] ${
                darkMode ? "text-[#E8EAED]" : "text-[#1F2937]"
              }`}
            >
              Sign out...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;
