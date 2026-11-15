import {
  FiCheck,
  FiChevronRight,
  FiPlus,
  FiWifi,
  FiLock,
} from "react-icons/fi";
import { invoke } from "@tauri-apps/api/core";
import { useAppContext } from "../../context/AppContext";
import Toggle from "../ui/Toggle";
import { useWifi, AvailableNetwork } from "../../hooks/useWifi";

// Helper component to draw the 3 signal bars like macOS
const SignalBars = ({
  signal,
  darkMode,
}: {
  signal: number;
  darkMode: boolean;
}) => {
  // Determine how many bars to fill (1, 2, or 3) based on signal %
  const bars = signal >= 75 ? 3 : signal >= 40 ? 2 : 1;

  const activeColor = darkMode ? "bg-[#9AA0A6]" : "bg-[#5F6368]";
  const inactiveColor = darkMode ? "bg-[#35373B]" : "bg-[#E5E7EB]";

  return (
    <div className="flex items-end gap-[2px] h-[14px] w-[14px]">
      <div
        className={`w-[3px] rounded-sm h-[6px] ${bars >= 1 ? activeColor : inactiveColor}`}
      />
      <div
        className={`w-[3px] rounded-sm h-[10px] ${bars >= 2 ? activeColor : inactiveColor}`}
      />
      <div
        className={`w-[3px] rounded-sm h-[14px] ${bars >= 3 ? activeColor : inactiveColor}`}
      />
    </div>
  );
};

const WifiMenu = () => {
  const app = useAppContext();
  const darkMode = app.theme === "dark";
  const { ssid, is_connected, available_networks } = useWifi();

  const openWindowsWifiSettings = () => {
    invoke("open_wifi_settings").catch((err) => console.error(err));
  };

  const handleToggle = () => {
    if (is_connected) {
      invoke("disconnect_wifi").catch((err) => console.error(err));
    } else {
      openWindowsWifiSettings();
    }
  };

  const handleConnect = (network: string) => {
    invoke("connect_wifi", { ssid: network }).catch(() => {
      openWindowsWifiSettings();
    });
  };

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
        <Toggle isOn={is_connected} onToggle={handleToggle} />
      </div>

      {is_connected && (
        <>
          <div
            className={`px-4 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.04em] ${darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"}`}
          >
            CONNECTED
          </div>
          <div className="px-2.5 pb-3">
            <div
              className={`flex items-center justify-between px-2.5 py-2.5 rounded-md cursor-default ${darkMode ? "bg-[#233245]" : "bg-[#EEF4FC]"}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-[7px] bg-[#1A73E8] text-white shrink-0">
                  <FiWifi size={15} strokeWidth={2.2} />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-[13px] leading-tight">
                    {ssid}
                  </span>
                  <span
                    className={`text-[11px] leading-tight mt-0.5 ${darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"}`}
                  >
                    Connected
                  </span>
                </div>
              </div>
              <FiCheck
                size={15}
                className={darkMode ? "text-[#8AB4F8]" : "text-[#1A73E8]"}
              />
            </div>
          </div>
        </>
      )}
      {/* OTHER NETWORKS */}
      <div
        className={`px-4 pt-3.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.04em] ${darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"}`}
      >
        OTHER NETWORKS
      </div>

      <div className="flex flex-col gap-1 px-2.5 pb-2 overflow-y-auto max-h-[180px] mac-scrollbar">
        {available_networks.length === 0 ? (
          <div
            className={`px-2.5 py-2 text-[11px] ${darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"}`}
          >
            No other networks found.
          </div>
        ) : (
          available_networks.map((network, index) => (
            <div
              key={index}
              onClick={() => handleConnect(network.ssid)}
              className={`flex items-center justify-between px-2.5 py-2 rounded-sm cursor-pointer transition-colors ${darkMode ? "hover:bg-white/5" : "hover:bg-black/4"}`}
            >
              <div className="flex items-center gap-3">
                {/* SIGNAL BARS */}
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-[7px] shrink-0 ${darkMode ? "bg-[#35373B] text-[#9AA0A6]" : "bg-[#F1F3F4] text-[#5F6368]"}`}
                >
                  <SignalBars signal={network.signal} darkMode={darkMode} />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-[13px] leading-tight">
                      {network.ssid}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {network.is_secured && (
                      <FiLock
                        size={10}
                        className={
                          darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"
                        }
                      />
                    )}
                    <span
                      className={`text-[11px] leading-tight ${darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"}`}
                    >
                      {network.is_secured ? "Secured" : "Open"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Actions */}
      <div
        className={`w-full h-px mt-auto ${darkMode ? "bg-[#171717]" : "bg-[#E5E7EB]"}`}
      />
      <div className="p-1.5">
        <div
          onClick={openWindowsWifiSettings}
          className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${darkMode ? "hover:bg-white/5" : "hover:bg-black/4"}`}
        >
          <span
            className={`text-[13px] ${darkMode ? "text-[#E8EAED]" : "text-[#1F2937]"}`}
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
        className={`w-full h-px ${darkMode ? "bg-[#171717]" : "bg-[#E5E7EB]"}`}
      />
      <div className="p-1.5">
        <div
          onClick={openWindowsWifiSettings}
          className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${darkMode ? "hover:bg-white/5" : "hover:bg-black/4"}`}
        >
          <span
            className={`text-[13px] ${darkMode ? "text-[#E8EAED]" : "text-[#1F2937]"}`}
          >
            Wi-Fi settings...
          </span>
          <FiChevronRight
            size={14}
            className={darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"}
          />
        </div>
      </div>
    </div>
  );
};

export default WifiMenu;
