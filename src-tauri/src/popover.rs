use tauri::{Manager, Emitter, AppHandle};

#[tauri::command]
pub async fn open_popover(app: AppHandle, r#type: String, x: f64, y: f64, width: f64, height: f64) -> Result<(), String> {
    let window = app.get_webview_window("popover").ok_or("Popover window not found")?;
    window.set_position(tauri::LogicalPosition::new(x, y)).map_err(|e| e.to_string())?;
    window.set_size(tauri::LogicalSize::new(width, height)).map_err(|e| e.to_string())?;
    window.show().map_err(|e| e.to_string())?;
    window.set_focus().map_err(|e| e.to_string())?;
    window.emit("popover-opened", r#type).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn hide_popover(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("popover") {
        window.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}

pub fn setup_popover(app: &tauri::App) {
    let popover = app.get_webview_window("popover").expect("popover window not found");
    
    #[cfg(target_os = "windows")]
    let _ = popover.set_background_color(Some(tauri::webview::Color(0, 0, 0, 0)));

    let popover_clone = popover.clone();
    let app_handle = app.handle().clone();

    popover.on_window_event(move |event| {
        if let tauri::WindowEvent::Focused(false) = event {
            let popover_clone = popover_clone.clone();
            let app_handle = app_handle.clone();
            
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_millis(100));
                
                if !popover_clone.is_focused().unwrap_or(false) {
                    let _ = popover_clone.hide();
                    let _ = app_handle.emit("popover-closed", ());
                }
            });
        }
    });
}