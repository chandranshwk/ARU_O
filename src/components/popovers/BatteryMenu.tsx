import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { useAppContext } from "../../context/AppContext";
import Toggle from "../ui/Toggle";
import { useBattery } from "../../hooks/useBattery";
import { MdElectricBolt } from "react-icons/md";

const BatteryMenu = () => {
  const app = useAppContext();
  const darkMode = app.theme === "dark";
  const [lowPower, setLowPower] = useState(false);
  const { percentage, is_charging } = useBattery();

  // Determine colors based on state
  const isLow = percentage <= 20 && !is_charging;
  const colorBorder = isLow
    ? darkMode
      ? "border-[#FF453A]"
      : "border-[#FF3B30]" // Red
    : darkMode
      ? "border-[#63C789]"
      : "border-[#34A853]"; // Green

  const colorFill = isLow
    ? darkMode
      ? "bg-[#FF453A]"
      : "bg-[#FF3B30]"
    : darkMode
      ? "bg-[#63C789]"
      : "bg-[#34A853]";

  // Determine status text
  const getStatusText = () => {
    if (is_charging) {
      return Math.round(percentage) === 100 ? "Fully Charged" : "Charging";
    }
    return "On Battery";
  };

  return (
    <div
      className={`w-66 flex flex-col rounded-b-sm h-full overflow-hidden border select-none transition-colors ${
        darkMode
          ? "bg-[#090909] border-[#171717] text-[#F1F3F4] shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
          : "bg-white border-[#E5E7EB] text-[#111827] shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
      }`}
    >
      {/* Header */}
      <div className="px-4 pt-3.5 pb-2.5 text-[14px] font-semibold tracking-[-0.01em]">
        Battery
      </div>

      {/* Main Status Box */}
      <div className="px-3 pb-3.5">
        <div
          className={`rounded-sm px-4 py-3.5 flex items-center justify-between ${
            darkMode ? "bg-[#1C1C1E]" : "bg-[#F5F6F8]"
          }`}
        >
          <div className="flex flex-col">
            <span className="text-[26px] font-semibold leading-none tracking-[-0.02em]">
              {Math.round(percentage)}%
            </span>
            <span
              className={`text-[12px] font-normal mt-1.5 ${
                darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"
              }`}
            >
              {getStatusText()}
            </span>
          </div>
          {/* UPGRADED LARGE BATTERY ICON */}
          <div className="relative flex items-center shrink-0">
            {/* Battery Body */}
            <div
              className={`w-18 h-10 border-2 rounded-sm p-0.5 flex items-center justify-start relative shrink-0 ${colorBorder}`}
            >
              {/* Battery Fill */}
              <div
                className={`h-full rounded-0.5 transition-all duration-500 ease-out shrink-0 ${colorFill}`}
                style={{ width: `${Math.round(percentage)}%` }}
              />

              {/* Charging Lightning Bolt */}
              {is_charging && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <MdElectricBolt
                    size={18}
                    className={`${
                      darkMode
                        ? "text-[#090909] fill-[#090909]"
                        : "text-white fill-white"
                    } scale-125`}
                  />
                </div>
              )}
            </div>

            {/* Battery Nub */}
            <div
              className={`w-[3px] h-[9px] rounded-r-0.5 ml-0.5 shrink-0 ${colorFill}`}
            />
          </div>
        </div>
      </div>

      {/* Power Source Section */}
      <div className="px-4 pb-3.5">
        <div
          className={`text-[10px] font-semibold uppercase tracking-[0.04em] mb-2 ${
            darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"
          }`}
        >
          POWER SOURCE
        </div>
        <div className="text-[13px] font-normal leading-tight">
          {is_charging ? "Power Adapter" : "Battery"}
        </div>
        <div
          className={`text-[11px] mt-0.5 leading-tight ${
            darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"
          }`}
        >
          {is_charging ? "Connected" : "Discharging"}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto">
        {/* Full-width Divider */}
        <div
          className={`h-px w-full ${
            darkMode ? "bg-[#171717]" : "bg-[#E5E7EB]"
          }`}
        />

        {/* Low Power Mode Toggle */}
        <div className="px-4 py-2.5 flex items-center justify-between">
          <span className="text-[13px] font-normal">Low Power Mode</span>
          <Toggle isOn={lowPower} onToggle={() => setLowPower(!lowPower)} />
        </div>

        {/* Full-width Divider */}
        <div
          className={`h-px w-full ${
            darkMode ? "bg-[#171717]" : "bg-[#E5E7EB]"
          }`}
        />

        {/* Battery Settings Button */}
        <div
          className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
            darkMode ? "hover:bg-white/5" : "hover:bg-black/5"
          }`}
        >
          <span className="text-[13px] font-normal">Battery settings...</span>
          <FiChevronRight
            className={darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"}
            size={14}
          />
        </div>
      </div>
    </div>
  );
};

export default BatteryMenu;
