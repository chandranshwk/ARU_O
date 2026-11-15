import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

export interface BatteryPayload {
  percentage: number;
  is_charging: boolean;
  is_present: boolean;
}

export function useBattery() {
  const [battery, setBattery] = useState<BatteryPayload>({
    percentage: 100,
    is_charging: false,
    is_present: true,
  });

  useEffect(() => {
    // 1. Fetch initial value from Rust
    invoke<BatteryPayload>("get_battery")
      .then((data) => {
        setBattery(data);
      })
      .catch((err) => console.error("Failed to get initial battery:", err));

    // 2. Listen for live updates from the background thread
    const unlisten = listen<BatteryPayload>("battery-changed", (event) => {
      setBattery(event.payload);
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return battery;
}
