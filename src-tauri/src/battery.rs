use serde::Serialize;
use std::time::Duration;
use tauri::{Emitter, AppHandle};

#[derive(Serialize, Clone)]
pub struct BatteryPayload {
    pub percentage: f32,
    pub is_charging: bool,
    pub is_present: bool,
}

fn get_battery_info() -> BatteryPayload {
    match ::battery::Manager::new() {
        Ok(manager) => {
            if let Ok(mut batteries) = manager.batteries() {
                if let Some(Ok(batt)) = batteries.next() {
                    let percentage = batt.state_of_charge().value * 100.0;
                    let state = batt.state();
                    let is_charging = matches!(state, ::battery::State::Charging | ::battery::State::Full);
                    return BatteryPayload {
                        percentage,
                        is_charging,
                        is_present: true,
                    };
                }
            }
            BatteryPayload { percentage: 100.0, is_charging: false, is_present: false }
        }
        Err(_) => BatteryPayload { percentage: 100.0, is_charging: false, is_present: false },
    }
}

#[tauri::command]
pub fn get_battery() -> BatteryPayload {
    get_battery_info()
}

pub fn start_battery_polling(handle: AppHandle) {
    std::thread::spawn(move || {
        let mut last_percentage = -1.0;
        let mut last_charging = false;

        loop {
            let info = get_battery_info();

            if (info.percentage - last_percentage).abs() > 0.1 || info.is_charging != last_charging {
                last_percentage = info.percentage;
                last_charging = info.is_charging;
                let _ = handle.emit("battery-changed", info);
            }

            std::thread::sleep(Duration::from_millis(500));
        }
    });
}