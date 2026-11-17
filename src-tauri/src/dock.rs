use std::time::Duration;
use tauri::{AppHandle, Manager, PhysicalPosition, PhysicalSize};

const DOCK_LOGICAL_WIDTH: f64 = 440.0;
const DOCK_LOGICAL_HEIGHT: f64 = 48.0;

pub fn setup_dock(app: &tauri::App) {
    let dock = app
        .get_webview_window("dock")
        .expect("dock window not found");

    #[cfg(target_os = "windows")]
    let _ = dock.set_background_color(Some(tauri::webview::Color(0, 0, 0, 0)));

    // Initial Size & Position (Centered, tucked cleanly below bottom edge)
    if let Ok(Some(monitor)) = dock.current_monitor() {
        let scale = monitor.scale_factor();
        let size = monitor.size();
        let position = monitor.position();

        let dock_width = DOCK_LOGICAL_WIDTH * scale;
        let dock_height = DOCK_LOGICAL_HEIGHT * scale;

        let pos_x = position.x as f64 + ((size.width as f64 - dock_width) / 2.0);
        let hide_y = position.y as f64 + size.height as f64;

        let _ = dock.set_size(PhysicalSize::new(dock_width as u32, dock_height as u32));
        let _ = dock.set_position(PhysicalPosition::new(pos_x as i32, hide_y as i32));
        let _ = dock.set_ignore_cursor_events(true);
    }

    let _ = dock.show();

    // Auto-Hide Polling Loop
    let dock_clone = dock.clone();
    let app_handle = app.handle().clone();

    std::thread::spawn(move || {
        let mut is_visible = false;

        loop {
            std::thread::sleep(Duration::from_millis(80));

            if let Ok(cursor) = app_handle.cursor_position() {
                if let Ok(Some(monitor)) = dock_clone.current_monitor() {
                    let scale = monitor.scale_factor();
                    let size = monitor.size();
                    let position = monitor.position();

                    let screen_bottom = position.y as f64 + size.height as f64;
                    let dock_width = DOCK_LOGICAL_WIDTH * scale;
                    let dock_height = DOCK_LOGICAL_HEIGHT * scale;

                    // Trigger zone: Bottom 3 logical pixels of the screen
                    let trigger_y = screen_bottom - (3.0 * scale);
                    // Leave zone: 24 logical pixels above the top edge of the visible dock
                    let leave_y = screen_bottom - dock_height - (24.0 * scale);

                    let pos_x = position.x as f64 + ((size.width as f64 - dock_width) / 2.0);
                    let show_y = screen_bottom - dock_height;
                    let hide_y = screen_bottom;

                    // Optional: restrict bottom trigger horizontally to the dock's X span (with padding)
                    let in_horizontal_bounds =
                        cursor.x >= (pos_x - 40.0 * scale) && cursor.x <= (pos_x + dock_width + 40.0 * scale);

                    if cursor.y >= trigger_y && in_horizontal_bounds && !is_visible {
                        // SHOW DOCK
                        let _ = dock_clone
                            .set_position(PhysicalPosition::new(pos_x as i32, show_y as i32));
                        let _ = dock_clone.set_ignore_cursor_events(false);
                        is_visible = true;
                    } else if cursor.y < leave_y && is_visible {
                        // HIDE DOCK
                        let _ = dock_clone
                            .set_position(PhysicalPosition::new(pos_x as i32, hide_y as i32));
                        let _ = dock_clone.set_ignore_cursor_events(true);
                        is_visible = false;
                    }
                }
            }
        }
    });
}

#[tauri::command]
pub fn handle_dock_click(app: AppHandle, app_id: String) -> Result<bool, String> {
    // Map dock item IDs to Tauri window labels
    let target_label = match app_id.as_str() {
        "start" => "popover",
        other => other,
    };

    let window = app
        .get_webview_window(target_label)
        .ok_or_else(|| format!("Window '{}' not found", target_label))?;

    if window.is_visible().unwrap_or(false) {
        window.hide().map_err(|e| e.to_string())?;
        Ok(false)
    } else {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
        Ok(true)
    }
}
