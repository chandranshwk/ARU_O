import { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { useAppContext } from "../../context/AppContext";
import Toggle from "../ui/Toggle";

const BatteryMenu = () => {
  const app = useAppContext();
  const darkMode = app.theme === "dark";
  const [lowPower, setLowPower] = useState(false);
  const [charge] = useState(100);

  useEffect(() => {
    if (charge < 40) setLowPower(true);
    else setLowPower(false);
  }, [charge]);

  return (
    <div
      className={`w-66 flex flex-col rounded-b-sm h-full  overflow-hidden border select-none transition-colors ${
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
          className={`rounded-sm px-3.5 py-3 flex items-center justify-between ${
            darkMode ? "bg-[#313338]" : "bg-[#F5F6F8]"
          }`}
        >
          <div className="flex flex-col">
            <span className="text-[24px] font-semibold leading-none tracking-[-0.02em]">
              {charge}%
            </span>
            <span
              className={`text-[11px] font-normal mt-1.5 ${
                darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"
              }`}
            >
              {charge > 30 ? "Fully charged" : "Low Charge"}
            </span>
          </div>

          {/* Custom Battery Icon */}
          <div className="relative flex items-center">
            <div
              className={`w-9 h-4.5 border-[1.5px] rounded-sm p-xs flex items-center justify-start ${
                darkMode ? "border-[#63C789]" : "border-[#34A853]"
              }`}
            >
              <div
                className={`h-full w-0.5 rounded-xs transition-all ${
                  darkMode ? "bg-[#63C789]" : "bg-[#34A853]"
                }`}
                style={{ width: `${charge}%` }}
              />
            </div>
            <div
              className={`w-0.5 h-1.5 rounded-r-[1px] ml-[1.5px] ${
                darkMode ? "bg-[#63C789]" : "bg-[#34A853]"
              }`}
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
          Power adapter
        </div>
        <div
          className={`text-[11px] mt-0.5 leading-tight ${
            darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]"
          }`}
        >
          Connected
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
            darkMode ? "hover:bg-white/5" : "hover:bg-black/4"
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
