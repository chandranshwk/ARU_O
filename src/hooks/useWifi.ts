import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

export interface AvailableNetwork {
  ssid: string;
  signal: number;
  is_secured: boolean;
}

export interface WifiPayload {
  ssid: string;
  is_connected: boolean;
  available_networks: AvailableNetwork[];
}

export function useWifi() {
  const [wifi, setWifi] = useState<WifiPayload>({
    ssid: "Loading...",
    is_connected: false,
    available_networks: [],
  });

  useEffect(() => {
    invoke<WifiPayload>("get_wifi")
      .then(setWifi)
      .catch((err) => console.error("Failed to get initial wifi:", err));

    const unlisten = listen<WifiPayload>("wifi-changed", (event) => {
      setWifi(event.payload);
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return wifi;
}
