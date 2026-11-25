//! The window of the app, `main` (VA5, ADR-0013 appendix 11/11/2026 §2): transparent over the
//! material of its system where the system has one, solid where it has none (DS-9, review #1414).
//! tauri.conf.json describes it over the material, as macOS and Windows 11 have it; `run` makes it
//! solid on Windows 10 before Tauri builds it. A transparent window over nothing lets the desktop
//! show where WebView2 has not painted yet: before its first frame at startup, and along the edge
//! being dragged while the window is resized.

use tauri::utils::config::{Color, Config, WindowConfig};

/// The fill of a solid window: `--bg-1` of packages/ui/src/tokens.css, which the page paints then
/// (`data-backdrop` `solid`), so the window shows no other colour before the page paints.
const SOLID_FILL: Color = Color(0x11, 0x18, 0x22, 0xff);

/// The first build of Windows 11, the first with Mica (the bound `window-vibrancy` tries Mica
/// from). The page has the same bound: `windowBackdrop` (apps/desktop/src/shell/platform.ts) reads
/// Windows 11 as platform version 13 and up in the client hints.
const FIRST_MICA_BUILD: u32 = 22000;

/// What lies under the page of the window.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Backdrop {
    /// The Mica of Windows 11, under a transparent window.
    Mica,
    /// The glass of macOS, under a transparent window.
    Glass,
    /// Nothing: the window is not transparent and paints [`SOLID_FILL`].
    Solid,
}

/// The backdrop of a run on Windows (`windows`) of build `build` (`None`: the system did not say),
/// or on macOS, the only other platform the app is built for.
pub fn backdrop(windows: bool, build: Option<u32>) -> Backdrop {
    match (windows, build) {
        (false, _) => Backdrop::Glass,
        (true, Some(build)) if build >= FIRST_MICA_BUILD => Backdrop::Mica,
        (true, _) => Backdrop::Solid,
    }
}

/// Draws `window` (of tauri.conf.json: transparent, with the effects of each system) on
/// `backdrop`: as it is over a material; without one not transparent, with no effects, and filled
/// with [`SOLID_FILL`], both the window's own layer and WebView2's until the page paints.
pub fn fit(window: &mut WindowConfig, backdrop: Backdrop) {
    if backdrop == Backdrop::Solid {
        window.transparent = false;
        window.window_effects = None;
        window.background_color = Some(SOLID_FILL);
    }
}

/// Draws the windows of `config` on the backdrop of this run, before Tauri builds them.
pub fn fit_to_this_system(config: &mut Config) {
    let backdrop = backdrop(cfg!(windows), windows_build());
    for window in &mut config.app.windows {
        fit(window, backdrop);
    }
}

/// The build of Windows, from `RtlGetVersion`, which says the true version whatever the exe's
/// manifest declares (`GetVersionEx` does not); `None` when the call fails. Declared here rather
/// than taken from a crate: a new dependency is G4.
#[cfg(windows)]
fn windows_build() -> Option<u32> {
    let mut info = OsVersionInfo::new();
    // SAFETY: `info` is an OSVERSIONINFOW with its size set, as `RtlGetVersion` requires; the call
    // only writes into it.
    let status = unsafe { RtlGetVersion(&mut info) };
    (status == 0).then_some(info.build)
}

#[cfg(not(windows))]
fn windows_build() -> Option<u32> {
    None
}

/// OSVERSIONINFOW of the Windows SDK, which `RtlGetVersion` fills; only the build is read.
#[cfg(windows)]
#[repr(C)]
struct OsVersionInfo {
    size: u32,
    _major: u32,
    _minor: u32,
    build: u32,
    _platform_id: u32,
    _service_pack: [u16; 128],
}

#[cfg(windows)]
impl OsVersionInfo {
    fn new() -> Self {
        Self {
            size: std::mem::size_of::<Self>() as u32,
            _major: 0,
            _minor: 0,
            build: 0,
            _platform_id: 0,
            _service_pack: [0; 128],
        }
    }
}

#[cfg(windows)]
#[link(name = "ntdll", kind = "raw-dylib")]
extern "system" {
    fn RtlGetVersion(info: *mut OsVersionInfo) -> i32;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mica_from_the_first_build_of_windows_11_glass_on_macos_solid_otherwise() {
        assert_eq!(backdrop(true, Some(22000)), Backdrop::Mica);
        assert_eq!(backdrop(true, Some(26100)), Backdrop::Mica);
        // One build before the bound, and the last build of Windows 10.
        assert_eq!(backdrop(true, Some(21999)), Backdrop::Solid);
        assert_eq!(backdrop(true, Some(19045)), Backdrop::Solid);
        // A build the system did not say: Mica is not sure to be there.
        assert_eq!(backdrop(true, None), Backdrop::Solid);
        assert_eq!(backdrop(false, None), Backdrop::Glass);
    }

    /// The window of tauri.conf.json, as Tauri reads it.
    fn configured() -> WindowConfig {
        let config: serde_json::Value =
            serde_json::from_str(include_str!("../tauri.conf.json")).unwrap();
        serde_json::from_value(config["app"]["windows"][0].clone()).unwrap()
    }

    #[test]
    fn a_window_over_a_material_stays_as_tauri_conf_json_has_it() {
        for backdrop in [Backdrop::Mica, Backdrop::Glass] {
            let mut window = configured();
            fit(&mut window, backdrop);
            assert_eq!(window, configured(), "{backdrop:?}");
            assert!(window.transparent && window.window_effects.is_some());
        }
    }

    #[test]
    fn a_solid_window_is_opaque_and_filled_as_the_page_until_it_paints() {
        let configured = configured();
        let mut window = configured.clone();
        fit(&mut window, Backdrop::Solid);
        assert!(!window.transparent);
        assert_eq!(window.window_effects, None);
        assert_eq!(window.background_color, Some(SOLID_FILL));
        // Nothing else changes: label, title, size, theme, title bar.
        let unfitted = WindowConfig {
            transparent: configured.transparent,
            window_effects: configured.window_effects.clone(),
            background_color: configured.background_color,
            ..window
        };
        assert_eq!(unfitted, configured);
    }

    #[test]
    fn the_solid_fill_is_the_fill_of_the_page() {
        // `--bg-1`, which the page paints on a solid window (`data-backdrop` `solid`).
        let tokens = std::fs::read_to_string(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../../packages/ui/src/tokens.css"
        ))
        .unwrap();
        assert_eq!(tokens.matches("--bg-1:").count(), 1);
        let Color(r, g, b, a) = SOLID_FILL;
        assert_eq!(a, 0xff);
        let fill = format!("--bg-1: #{r:02x}{g:02x}{b:02x};");
        assert!(tokens.contains(&fill), "{fill} in tokens.css");
    }

    #[cfg(windows)]
    #[test]
    fn windows_says_its_build() {
        // OSVERSIONINFOW: five 32-bit fields and 128 UTF-16 units.
        assert_eq!(std::mem::size_of::<OsVersionInfo>(), 276);
        // Windows 10 starts at build 10240; the CI and the app run on 10 or 11.
        assert!(windows_build().is_some_and(|build| build >= 10240));
    }
}
