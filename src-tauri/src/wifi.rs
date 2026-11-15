use serde::Serialize;
use std::process::Command;
use std::time::Duration;
use tauri::{AppHandle, Emitter};

// NEW: Create a struct just for the other networks
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
    if let Ok(out) = Command::new("netsh").args(&["wlan", "show", "interfaces"]).output() {
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

    // 2. Get Available Networks (Parsing Signal & Security)
    if let Ok(out) = Command::new("netsh").args(&["wlan", "show", "networks"]).output() {
        let text = String::from_utf8_lossy(&out.stdout);
        
        let mut current_ssid = String::new();
        let mut current_signal = 0;
        let mut current_secured = false;
        let mut parsing_network = false;

        for line in text.lines() {
            let line = line.trim();
            
            // Start of a new network
            if line.starts_with("SSID") && line.contains(':') {
                // If we were parsing a network, save it before starting a new one
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
            
            // Get Authentication (Security Type)
            if parsing_network && line.starts_with("Authentication") {
                if let Some(val) = line.split(':').nth(1) {
                    let auth = val.trim();
                    current_secured = !auth.contains("Open"); // If it doesn't say "Open", it's secured
                }
            }
            
            // Get Signal Strength
            if parsing_network && line.starts_with("Signal") {
                if let Some(val) = line.split(':').nth(1) {
                    let sig_str = val.trim().replace("%", "");
                    current_signal = sig_str.parse().unwrap_or(0);
                }
            }
        }
        
        // Push the last network in the list
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
    Command::new("netsh")
        .args(&["wlan", "disconnect"])
        .output()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn connect_wifi(ssid: String) -> Result<(), String> {
    let output = Command::new("netsh")
        .args(&["wlan", "connect", &format!("name={}", ssid)])
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    if stdout.contains("completed successfully") {
        Ok(())
    } else {
        Err("Failed to connect. Password may be required.".into())
    }
}

#[tauri::command]
pub fn open_wifi_settings() -> Result<(), String> {
    Command::new("cmd")
        .args(&["/C", "start", "ms-settings:network-wifi"])
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn start_wifi_polling(handle: AppHandle) {
    std::thread::spawn(move || {
        loop {
            let info = get_wifi_info();
            let _ = handle.emit("wifi-changed", info);
            // 3 seconds is good because scanning networks takes a bit of CPU
            std::thread::sleep(Duration::from_secs(3));
        }
    });
}