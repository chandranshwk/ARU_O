use tauri::{Manager, PhysicalPosition, PhysicalSize};
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

pub fn setup_appbar(app: &tauri::App) {
    let window = app.get_webview_window("topbar").expect("topbar window not found");
    
    #[cfg(target_os = "windows")]
    let _ = window.set_background_color(Some(tauri::webview::Color(0, 0, 0, 0)));

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
                    
                    SHAppBarMessage(ABM_NEW, &mut abd);
                    
                    let ex_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
                    SetWindowLongPtrW(hwnd, GWL_EXSTYLE, ex_style | WS_EX_LAYERED.0 as isize);
                    
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
        
        let window_clone = window.clone();
        std::thread::spawn(move || {
            std::thread::sleep(std::time::Duration::from_millis(150));
            let _ = window_clone.set_position(PhysicalPosition::new(pos_x, pos_y));
        });
    }
    
    window.show().unwrap();
    
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
}