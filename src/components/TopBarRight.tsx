import { useAppContext } from "../context/AppContext";
import {
  FiBattery,
  FiBatteryCharging,
  FiBell,
  FiBluetooth,
  FiSearch,
  FiSliders,
  FiWifi,
} from "react-icons/fi";
import { useBattery } from "../hooks/useBattery";

const TopBarRight = () => {
  const app = useAppContext();
  const darkMode = app.theme === "dark";

  // Determine the base color for the entire right cluster
  const textColor = darkMode ? "text-white/70" : "text-black/70";

  // Helper for the active highlight state
  const isActive = (type: string) => app.activePopover === type;

  const activeClass = "bg-[#007AFF] text-white shadow-sm";

  const { percentage, is_charging } = useBattery();

  return (
    <div className={`flex items-center text-[12px] font-medium ${textColor}`}>
      <div className="flex items-center ">
        {/* Bluetooth */}
        <div
          onClick={(e) => app.openPopover("bluetooth", e)}
          className={`cursor-pointer transition-colors p-1 rounded-md ${
            isActive("bluetooth") ? activeClass : "hover:opacity-100"
          }`}
        >
          <FiBluetooth size={14} />
        </div>

        {/* Wi-Fi */}
        <div
          onClick={(e) => app.openPopover("wifi", e)}
          className={`cursor-pointer transition-colors p-1 rounded-md ${
            isActive("wifi") ? activeClass : "hover:opacity-100"
          }`}
        >
          <FiWifi size={15} />
        </div>

        {/* Battery */}
        <div
          onClick={(e) => app.openPopover("battery", e)}
          className={`flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-md ${
            isActive("battery") ? activeClass : "hover:opacity-100"
          }`}
        >
          {" "}
          <span className="text-[11px]">{Math.round(percentage)}%</span>
          {is_charging ? (
            <FiBatteryCharging size={16} />
          ) : (
            <FiBattery size={16} />
          )}
        </div>

        <div className="flex items-center ">
          {/* Spotlight Search */}
          <div
            onClick={(e) => app.openPopover("spotlight", e)}
            className={`cursor-pointer transition-colors p-1 rounded-md ${
              isActive("spotlight") ? activeClass : "hover:opacity-100"
            }`}
          >
            <FiSearch size={14} />
          </div>

          {/* Control Center */}
          <div
            onClick={(e) => app.openPopover("control-center", e)}
            className={`cursor-pointer transition-colors p-1 rounded-md ${
              isActive("control-center") ? activeClass : "hover:opacity-100"
            }`}
          >
            <FiSliders size={14} />
          </div>

          {/* Notification Center */}
          <div
            onClick={(e) => app.openPopover("notifications", e)}
            className={`cursor-pointer transition-colors p-1 rounded-md ${
              isActive("notifications") ? activeClass : "hover:opacity-100"
            }`}
          >
            <FiBell size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarRight;
