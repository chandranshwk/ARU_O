import { useState } from "react";
import { FiCheck, FiChevronRight, FiPlus, FiWifi } from "react-icons/fi";
import { useAppContext } from "../../context/AppContext";
import Toggle from "../ui/Toggle";

const WifiMenu = () => {
  const app = useAppContext();
  const darkMode = app.theme === "dark";
  const [wifiOn, setWifiOn] = useState(true);

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
          Wi-Fi
        </span>
        <Toggle isOn={wifiOn} onToggle={() => setWifiOn(!wifiOn)} />
      </div>

      {wifiOn && (
        <>
          {/* CONNECTED */}
          <div
            className={`px-4 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.04em] ${
              darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"
            }`}
          >
            CONNECTED
          </div>

          <div className="px-2.5">
            <div
              className={`flex items-center justify-between px-2.5 py-2 rounded-sm cursor-pointer transition-colors ${
                darkMode
                  ? "bg-[#233245] hover:bg-[#293A50]"
                  : "bg-[#EEF4FC] hover:bg-[#E4EEFA]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-[7px] bg-[#1A73E8] text-white shrink-0">
                  <FiWifi size={15} strokeWidth={2.2} />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-[13px] leading-tight">
                    Home Network
                  </span>
                  <span
                    className={`text-[11px] leading-tight mt-0.5 ${
                      darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"
                    }`}
                  >
                    Connected · Secured
                  </span>
                </div>
              </div>
              <FiCheck
                size={15}
                className={darkMode ? "text-[#8AB4F8]" : "text-[#1A73E8]"}
              />
            </div>
          </div>

          {/* OTHER NETWORKS */}
          <div
            className={`px-4 pt-3.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.04em] ${
              darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"
            }`}
          >
            OTHER NETWORKS
          </div>

          <div className="flex flex-col gap-1 px-2.5 pb-2">
            {/* Studio */}
            <div
              className={`flex items-center justify-between px-2.5 py-2 rounded-sm cursor-pointer transition-colors ${
                darkMode ? "hover:bg-white/5" : "hover:bg-black/4"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-[7px] shrink-0 ${
                    darkMode
                      ? "bg-[#35373B] text-[#9AA0A6]"
                      : "bg-[#F1F3F4] text-[#5F6368]"
                  }`}
                >
                  <FiWifi size={15} strokeWidth={2.2} />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-[13px] leading-tight">
                    Studio
                  </span>
                  <span
                    className={`text-[11px] leading-tight mt-0.5 ${
                      darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"
                    }`}
                  >
                    Secured
                  </span>
                </div>
              </div>
            </div>

            {/* Guest Network */}
            <div
              className={`flex items-center justify-between px-2.5 py-2 rounded-sm cursor-pointer transition-colors ${
                darkMode ? "hover:bg-white/5" : "hover:bg-black/4"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-[7px] shrink-0 ${
                    darkMode
                      ? "bg-[#35373B] text-[#9AA0A6]"
                      : "bg-[#F1F3F4] text-[#5F6368]"
                  }`}
                >
                  <FiWifi size={15} strokeWidth={2.2} />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-[13px] leading-tight">
                    Guest Network
                  </span>
                  <span
                    className={`text-[11px] leading-tight mt-0.5 ${
                      darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"
                    }`}
                  >
                    Open network
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Divider & Action Rows */}
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
                Join other network...
              </span>
              <FiPlus
                size={14}
                className={darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"}
              />
            </div>
          </div>

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
                Wi-Fi settings...
              </span>
              <FiChevronRight
                size={14}
                className={darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WifiMenu;
