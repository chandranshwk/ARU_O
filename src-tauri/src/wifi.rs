use serde::Serialize;
use std::process::Command;
use std::time::Duration;
use tauri::{AppHandle, Emitter};

// ADD THIS IMPORT FOR WINDOWS
#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

#[derive(Serialize, Clone)]
pub struct AvailableNetwork {
    pub ssid: String,
    pub signal: u32,
    pub is_secured: bool,
}

#[derive(Serialize, Clone)]
pub struct WifiPayload {
    pub ssid: String,
    pub is_connected: bool,
    pub available_networks: Vec<AvailableNetwork>,
}

fn get_wifi_info() -> WifiPayload {
    let mut ssid = "Disconnected".to_string();
    let mut is_connected = false;
    let mut available_networks = Vec::new();

    // 1. Get Connected Status
    let mut cmd_interfaces = Command::new("netsh");
    cmd_interfaces.args(&["wlan", "show", "interfaces"]);
    #[cfg(target_os = "windows")]
    cmd_interfaces.creation_flags(0x08000000); // HIDE WINDOW

    if let Ok(out) = cmd_interfaces.output() {
        let text = String::from_utf8_lossy(&out.stdout);
        for line in text.lines() {
            let line = line.trim();
            if line.starts_with("State") && line.contains("connected") && !line.contains("disconnected") {
                is_connected = true;
            }
            if is_connected && line.starts_with("SSID") && !line.starts_with("BSSID") {
                if let Some(val) = line.split(':').nth(1) {
                    ssid = val.trim().to_string();
                }
            }
        }
    }

    if !is_connected {
        ssid = "Disconnected".to_string();
    }

    // 2. Get Available Networks
    let mut cmd_networks = Command::new("netsh");
    cmd_networks.args(&["wlan", "show", "networks"]);
    #[cfg(target_os = "windows")]
    cmd_networks.creation_flags(0x08000000); // HIDE WINDOW

    if let Ok(out) = cmd_networks.output() {
        let text = String::from_utf8_lossy(&out.stdout);
        let mut current_ssid = String::new();
        let mut current_signal = 0;
        let mut current_secured = false;
        let mut parsing_network = false;

        for line in text.lines() {
            let line = line.trim();
            if line.starts_with("SSID") && line.contains(':') {
                if parsing_network && !current_ssid.is_empty() && current_ssid != ssid {
                    available_networks.push(AvailableNetwork {
                        ssid: current_ssid.clone(),
                        signal: current_signal,
                        is_secured: current_secured,
                    });
                }
                if let Some(val) = line.split(':').nth(1) {
                    current_ssid = val.trim().to_string();
                    parsing_network = true;
                    current_signal = 0;
                    current_secured = false;
                }
            }
            if parsing_network && line.starts_with("Authentication") {
                if let Some(val) = line.split(':').nth(1) {
                    current_secured = !val.trim().contains("Open");
                }
            }
            if parsing_network && line.starts_with("Signal") {
                if let Some(val) = line.split(':').nth(1) {
                    current_signal = val.trim().replace("%", "").parse().unwrap_or(0);
                }
            }
        }
        if parsing_network && !current_ssid.is_empty() && current_ssid != ssid {
            available_networks.push(AvailableNetwork {
                ssid: current_ssid,
                signal: current_signal,
                is_secured: current_secured,
            });
        }
    }

    WifiPayload { ssid, is_connected, available_networks }
}

#[tauri::command]
pub fn get_wifi() -> WifiPayload {
    get_wifi_info()
}

#[tauri::command]
pub fn disconnect_wifi() -> Result<(), String> {
    let mut cmd = Command::new("netsh");
    cmd.args(&["wlan", "disconnect"]);
    #[cfg(target_os = "windows")]
    cmd.creation_flags(0x08000000); // HIDE WINDOW

    cmd.output().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn connect_wifi(ssid: String) -> Result<(), String> {
    let mut cmd = Command::new("netsh");
    cmd.args(&["wlan", "connect", &format!("name={}", ssid)]);
    #[cfg(target_os = "windows")]
    cmd.creation_flags(0x08000000); // HIDE WINDOW

    let output = cmd.output().map_err(|e| e.to_string())?;
    let stdout = String::from_utf8_lossy(&output.stdout);
    if stdout.contains("completed successfully") {
        Ok(())
    } else {
        Err("Failed to connect".into())
    }
}

#[tauri::command]
pub fn open_wifi_settings() -> Result<(), String> {
    // We use explorer.exe here instead of cmd /C start to avoid console flashes
    let mut cmd = Command::new("explorer.exe");
    cmd.args(&["ms-settings:network-wifi"]);
    #[cfg(target_os = "windows")]
    cmd.creation_flags(0x08000000); // HIDE WINDOW

    cmd.spawn().map_err(|e| e.to_string())?;
    Ok(())
}

pub fn start_wifi_polling(handle: AppHandle) {
    std::thread::spawn(move || {
        loop {
            let info = get_wifi_info();
            let _ = handle.emit("wifi-changed", info);
            std::thread::sleep(Duration::from_secs(3));
        }
    });
}