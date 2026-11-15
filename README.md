# ARU_O

ARU_O is a high-performance macOS-style desktop environment emulator designed for Windows. It aims to provide the polished aesthetic and workflow of macOS without the heavy resource usage of traditional Electron applications.

By leveraging Tauri v2, Rust, and React, ARU_O integrates directly with the Windows operating system to deliver a native-feeling, lightweight desktop shell.

## Architecture Highlights

- Native AppBar Integration: Utilizes the Win32 `SHAppBarMessage` API to reserve screen space at the top. Maximized windows automatically resize to sit below the top bar, functioning exactly like a native system taskbar.
- Single Popover Host: Instead of spawning a new webview for every dropdown menu, ARU_O uses a single hidden 1x1 window. When a menu is triggered, the Rust backend dynamically resizes, positions, and shows the window while routing React to the correct component.
- Native Glassmorphism: Combines Windows DWM (Desktop Window Manager) effects with React CSS to achieve the frosted glass aesthetic typical of macOS.

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Vite
- Backend: Rust, Tauri v2
- Native APIs: `windows` crate (Win32 API), `window-vibrancy` (DWM effects), `raw-window-handle`

## Roadmap

- [x] Phase 1: Top Bar, native AppBar space reservation, and Popover Host architecture.
- [ ] Phase 2: The Dock (Magnification, running app indicators).
- [ ] Phase 3: Window Manager (Custom frameless emulated application windows).
- [ ] Phase 4: OS Shell (System menus, Spotlight, Control Center).
- [ ] Phase 5: System Integrations (Real battery, Wi-Fi, and active app polling).

## Getting Started

Ensure you have Node.js, Rust, and the necessary C++ Build Tools installed.

```bash
# Clone the repository
git clone https://github.com/chandranshwk/ARU_O.git
cd ARU_O

# Install dependencies
npm install

# Run the development server
npm run tauri dev

To build for production, run:

bash
npm run tauri build
Disclaimer
ARU_O is an independent project and is not affiliated with, endorsed by, or sponsored by Apple Inc. macOS is a trademark of Apple Inc.

```
