mod appbar;
mod popover;
mod battery;
mod wifi;
mod theme; 

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            popover::open_popover,
            popover::hide_popover,
            battery::get_battery,
            wifi::get_wifi,
            wifi::disconnect_wifi,
            wifi::connect_wifi, 
            wifi::open_wifi_settings,
            theme::set_system_theme 
        ]) 
        .setup(|app| {
            appbar::setup_appbar(app);
            popover::setup_popover(app);
            battery::start_battery_polling(app.handle().clone());
            wifi::start_wifi_polling(app.handle().clone());
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}