use tauri::{Manager, PhysicalPosition, PhysicalSize, Emitter};
use raw_window_handle::{HasWindowHandle, RawWindowHandle};

#[cfg(target_os = "windows")]
use windows::Win32::UI::Shell::{
    SHAppBarMessage, ABM_NEW, ABM_REMOVE, ABM_SETPOS, ABE_TOP, APPBARDATA,
};
#[cfg(target_os = "windows")]
use windows::Win32::Foundation::{HWND, RECT};
#[cfg(target_os = "windows")]
use windows::Win32::UI::WindowsAndMessaging::{
    GetWindowLongPtrW, SetWindowLongPtrW, GWL_EXSTYLE, WS_EX_LAYERED,
};

#[tauri::command]
async fn open_popover(app: tauri::AppHandle, r#type: String, x: f64, y: f64, width: f64, height: f64) -> Result<(), String> {
    let window = app.get_webview_window("popover").ok_or("Popover window not found")?;
    window.set_position(tauri::LogicalPosition::new(x, y)).map_err(|e| e.to_string())?;
    window.set_size(tauri::LogicalSize::new(width, height)).map_err(|e| e.to_string())?;
    window.show().map_err(|e| e.to_string())?;
    window.set_focus().map_err(|e| e.to_string())?;
    window.emit("popover-opened", r#type).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn hide_popover(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("popover") {
        window.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_popover, hide_popover]) 
        .setup(|app| {
            let window = app.get_webview_window("topbar").expect("topbar window not found");
            let popover = app.get_webview_window("popover").expect("popover window not found");
            
            // Force BOTH windows to have a transparent WebView2 background
            #[cfg(target_os = "windows")]
            {
                let _ = window.set_background_color(Some(tauri::webview::Color(0, 0, 0, 0)));
                let _ = popover.set_background_color(Some(tauri::webview::Color(0, 0, 0, 0)));
            }

            if let Ok(Some(monitor)) = window.current_monitor() {
                let position = monitor.position();
                let size = monitor.size();
                let pos_x = position.x;
                let pos_y = position.y;
                
                let _ = window.set_position(PhysicalPosition::new(pos_x, pos_y));
                let _ = window.set_size(PhysicalSize::new(size.width, 40));
                
                #[cfg(target_os = "windows")]
                unsafe {
                    if let Ok(handle) = window.window_handle() {
                        if let RawWindowHandle::Win32(win32_handle) = handle.as_raw() {
                            let hwnd = HWND(win32_handle.hwnd.get() as *mut std::ffi::c_void);
                            
                            let mut abd = APPBARDATA {
                                cbSize: std::mem::size_of::<APPBARDATA>() as u32,
                                hWnd: hwnd,
                                ..Default::default()
                            };
                            
                            // 1. Register AppBar
                            SHAppBarMessage(ABM_NEW, &mut abd);
                            
                            // 2. THE FIX: Force WS_EX_LAYERED back onto the window!
                            let ex_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
                            SetWindowLongPtrW(hwnd, GWL_EXSTYLE, ex_style | WS_EX_LAYERED.0 as isize);
                            
                            // 3. Set AppBar Position
                            abd.uEdge = ABE_TOP as u32;
                            abd.rc = RECT {
                                left: pos_x,
                                top: pos_y,
                                right: pos_x + size.width as i32,
                                bottom: pos_y + 40,
                            };
                            SHAppBarMessage(ABM_SETPOS, &mut abd);
                        }
                    }
                }
                
                // 4. Wait for Windows to finish docking, then ensure position is correct
                let window_clone = window.clone();
                std::thread::spawn(move || {
                    std::thread::sleep(std::time::Duration::from_millis(150));
                    let _ = window_clone.set_position(PhysicalPosition::new(pos_x, pos_y));
                });
            }
            
            window.show()?;
            
            // 5. Cleanup AppBar on exit
            let window_for_cleanup = window.clone();
            window.on_window_event(move |event| {
                if let tauri::WindowEvent::Destroyed = event {
                    #[cfg(target_os = "windows")]
                    unsafe {
                        if let Ok(handle) = window_for_cleanup.window_handle() {
                            if let RawWindowHandle::Win32(win32_handle) = handle.as_raw() {
                                let hwnd = HWND(win32_handle.hwnd.get() as *mut std::ffi::c_void);
                                let mut abd = APPBARDATA {
                                    cbSize: std::mem::size_of::<APPBARDATA>() as u32,
                                    hWnd: hwnd,
                                    ..Default::default()
                                };
                                SHAppBarMessage(ABM_REMOVE, &mut abd);
                            }
                        }
                    }
                }
            });

            // 6. Popover auto-hide
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
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}