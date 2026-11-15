import { useState } from "react";
import {
  FiWifi,
  FiBluetooth,
  FiSun,
  FiChevronRight,
  FiMinus,
  FiMusic,
} from "react-icons/fi";
import { useAppContext } from "../../context/AppContext";
import Toggle from "../ui/Toggle";
import Slider from "../ui/Slider";

const ControlCenter = () => {
  const app = useAppContext();
  const darkMode = app.theme === "dark";

  const [wifi, setWifi] = useState(true);
  const [bt, setBt] = useState(true);
  const [focus, setFocus] = useState(false);
  const [brightness, setBrightness] = useState(70);
  const [volume, setVolume] = useState(45);

  const mainBg = darkMode
    ? "bg-[#090909] border-[#171717] text-[#F1F3F4] shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
    : "bg-white border-[#E5E7EB] text-[#111827] shadow-[0_10px_25px_rgba(0,0,0,0.12)]";
  const cardBg = darkMode
    ? "bg-[#313338] hover:bg-[#383A40]"
    : "bg-[#F5F6F8] hover:bg-[#ECEEF2]";
  const sliderCardBg = darkMode ? "bg-[#313338]" : "bg-[#F5F6F8]";
  const textMuted = darkMode ? "text-[#9AA0A6]" : "text-[#6B7280]";
  const focusIconBg = darkMode
    ? "bg-[#35373B] text-[#E8EAED]"
    : "bg-[#F1F3F4] text-[#374151]";
  const divider = darkMode ? "border-[#171717]" : "border-[#E5E7EB]";

  return (
    <div
      className={`flex flex-col w-full h-full p-3.5 font-sans rounded-b-sm border select-none transition-colors ${mainBg}`}
    >
      {/* Header */}
      <div className="text-[14px] font-semibold mb-3 tracking-[-0.01em] px-0.5">
        Control panel
      </div>

      {/* Top Grid: Wi-Fi & Bluetooth */}
      <div className="grid grid-cols-2 gap-2.5 mb-2">
        {/* Wi-Fi */}
        <div
          onClick={() => setWifi(!wifi)}
          className={`${cardBg} flex flex-col p-2.5 rounded-sm cursor-pointer transition-colors`}
        >
          <div
            className={`rounded-[7px] w-7 h-7 flex items-center justify-center transition-colors ${
              wifi
                ? "bg-[#1A73E8] text-white"
                : darkMode
                  ? "bg-[#43464D] text-[#9AA0A6]"
                  : "bg-[#E5E7EB] text-[#6B7280]"
            }`}
          >
            <FiWifi size={15} strokeWidth={2.2} />
          </div>
          <div className="flex flex-col mt-2.5">
            <span className="text-[13px] font-medium leading-[1.25]">
              Wi-Fi
            </span>
            <span className={`text-[11px] leading-[1.25] mt-0.5 ${textMuted}`}>
              {wifi ? "Home Network" : "Off"}
            </span>
          </div>
        </div>

        {/* Bluetooth */}
        <div
          onClick={() => setBt(!bt)}
          className={`${cardBg} flex flex-col p-2.5 rounded-sm cursor-pointer transition-colors`}
        >
          <div
            className={`rounded-[7px] w-7 h-7 flex items-center justify-center transition-colors ${
              bt
                ? "bg-[#1A73E8] text-white"
                : darkMode
                  ? "bg-[#43464D] text-[#9AA0A6]"
                  : "bg-[#E5E7EB] text-[#6B7280]"
            }`}
          >
            <FiBluetooth size={15} strokeWidth={2.2} />
          </div>
          <div className="flex flex-col mt-2.5">
            <span className="text-[13px] font-medium leading-[1.25]">
              Bluetooth
            </span>
            <span className={`text-[11px] leading-[1.25] mt-0.5 ${textMuted}`}>
              {bt ? "On" : "Off"}
            </span>
          </div>
        </div>
      </div>

      {/* Focus Row */}
      <div
        onClick={() => setFocus(!focus)}
        className={`flex items-center justify-between py-2 px-1.5 rounded-sm cursor-pointer mb-2 transition-colors ${
          darkMode ? "hover:bg-white/5" : "hover:bg-black/[0.04]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`rounded-[7px] w-7 h-7 flex items-center justify-center transition-colors ${
              focus ? "bg-[#1A73E8] text-white" : focusIconBg
            }`}
          >
            <FiMinus size={14} strokeWidth={2.4} />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium leading-[1.25]">
              Focus
            </span>
            <span className={`text-[11px] leading-[1.25] mt-0.5 ${textMuted}`}>
              {focus ? "On" : "Off"}
            </span>
          </div>
        </div>
        <FiChevronRight className={textMuted} size={14} />
      </div>

      {/* Brightness */}
      <div
        className={`${sliderCardBg} rounded-sm px-3 py-2.5 flex flex-col gap-2 mb-2`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FiSun size={13} className={textMuted} />
            <span className="text-[13px] font-medium leading-none">
              Brightness
            </span>
          </div>
          <span className={`text-[11px] ${textMuted}`}>{brightness}%</span>
        </div>
        <Slider value={brightness} onChange={setBrightness} />
      </div>

      {/* Sound */}
      <div
        className={`${sliderCardBg} rounded-sm px-3 py-2.5 flex flex-col gap-2 mb-2.5`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FiMusic size={13} className={textMuted} />
            <span className="text-[13px] font-medium leading-none">Sound</span>
          </div>
          <span className={`text-[11px] ${textMuted}`}>{volume}%</span>
        </div>
        <Slider value={volume} onChange={setVolume} />
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col mt-auto">
        {/* Dark Appearance */}
        <div
          className={`flex items-center justify-between py-2.5 px-1 border-b ${divider}`}
        >
          <span className="text-[13px] font-medium">Dark appearance</span>
          <Toggle
            isOn={darkMode}
            onToggle={() => app.setTheme(darkMode ? "light" : "dark")}
          />
        </div>

        {/* System Settings */}
        <div
          className={`flex items-center justify-between py-2.5 px-1 mt-0.5 rounded-[8px] cursor-pointer transition-colors ${
            darkMode ? "hover:bg-white/5" : "hover:bg-black/[0.04]"
          }`}
        >
          <span className="text-[13px] font-medium">System settings...</span>
          <FiChevronRight className={textMuted} size={14} />
        </div>
      </div>
    </div>
  );
};

export default ControlCenter;
