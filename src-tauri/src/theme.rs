use winreg::enums::*;
use winreg::RegKey;

#[tauri::command]
pub fn set_system_theme(is_dark: bool) -> Result<(), String> {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let path = "Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize";
    
    if let Ok(key) = hkcu.open_subkey_with_flags(path, KEY_WRITE) {
        // 0 = Dark Mode, 1 = Light Mode
        let val: u32 = if is_dark { 0 } else { 1 };
        
        let _ = key.set_value("AppsUseLightTheme", &val);
        let _ = key.set_value("SystemUsesLightTheme", &val);
        
        Ok(())
    } else {
        Err("Failed to open registry key".into())
    }
}