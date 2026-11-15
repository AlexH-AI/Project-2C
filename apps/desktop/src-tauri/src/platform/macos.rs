//! macOS (the only other platform the app is built for): the data folder under Application
//! Support, `open`, no key store yet. Built on macOS, and in tests elsewhere for its pure parts;
//! the parts that call the system are `cfg(not(windows))`.

use std::ffi::{OsStr, OsString};
use std::io::{self, ErrorKind};
use std::path::PathBuf;
use std::process::Command;

/// The identifier of the build (`tauri.conf.json`), which names the data folder on macOS.
const APP_ID: &str = "dev.alexh.project2c";
/// macOS `open`, by its full path (see [`open_command`]).
const OPEN: &str = "/usr/bin/open";

#[cfg(not(windows))]
pub fn data_dir() -> io::Result<PathBuf> {
    app_support_dir(std::env::var_os("HOME"))
}

#[cfg(not(windows))]
pub fn open_folder(path: &std::path::Path) -> io::Result<()> {
    super::spawn_unwaited(&mut open_command(path)).map(drop)
}

#[cfg(not(windows))]
pub fn open_url(url: &str) -> io::Result<()> {
    super::spawn_unwaited(&mut open_command(url)).map(drop)
}

/// macOS has no key store yet (Keychain, M1 of the macOS trial, Mac-4): every key command fails,
/// with `AI_KEYRING`.
#[cfg(not(windows))]
pub fn key_entry(_service: &str, _user: &str) -> keyring_core::Result<keyring_core::Entry> {
    Err(keyring_core::Error::NoDefaultStore)
}

/// macOS `open` on `target`: Finder shows a folder, the default browser opens a page. By its full
/// path, never looked up in `PATH` (as Explorer, DR-54).
fn open_command(target: impl AsRef<OsStr>) -> Command {
    let mut command = Command::new(OPEN);
    command.arg(target);
    command
}

/// The data folder on macOS, `$HOME/Library/Application Support/dev.alexh.project2c/` (M2): not
/// next to the app, whose `.app` may run from a read-only place (App Translocation) and whose
/// signature a write inside would break. `home` (`$HOME`) missing or not an absolute path is an
/// error: the data never goes anywhere else.
fn app_support_dir(home: Option<OsString>) -> io::Result<PathBuf> {
    home.map(PathBuf::from)
        .filter(|home| home.is_absolute())
        .map(|home| {
            home.join("Library")
                .join("Application Support")
                .join(APP_ID)
        })
        .ok_or_else(|| {
            io::Error::new(
                ErrorKind::NotFound,
                "HOME is missing or not an absolute path",
            )
        })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ai::CHATGPT_URL;
    use std::path::Path;

    #[test]
    fn the_macos_data_folder_is_the_app_s_own_under_application_support() {
        // Not inside the `.app`, which may run from a read-only place and whose signature a write
        // would break (M2). A `HOME` missing or relative is an error, never another folder.
        let home = std::env::temp_dir();
        assert_eq!(
            app_support_dir(Some(home.clone().into_os_string())).unwrap(),
            home.join("Library")
                .join("Application Support")
                .join("dev.alexh.project2c")
        );
        for home in [
            None,
            Some(OsString::new()),
            Some(OsString::from("Users/me")),
        ] {
            assert_eq!(
                app_support_dir(home).unwrap_err().kind(),
                ErrorKind::NotFound
            );
        }
    }

    #[test]
    fn the_macos_data_folder_is_named_by_the_identifier_of_the_build() {
        // A new identifier would leave the data in the old folder.
        let config: serde_json::Value =
            serde_json::from_str(include_str!("../../tauri.conf.json")).unwrap();
        assert_eq!(config["identifier"], APP_ID);
    }

    #[test]
    fn open_command_runs_the_macos_open_by_its_full_path_on_the_target_only() {
        // Never looked up in `PATH` (DR-54); Finder for a folder, the default browser for a page.
        let folder = Path::new("/Users/me/Library/Application Support/dev.alexh.project2c/exports");
        let command = open_command(folder);
        assert_eq!(command.get_program(), "/usr/bin/open");
        assert_eq!(command.get_args().collect::<Vec<_>>(), [folder.as_os_str()]);
    }

    #[test]
    fn open_chatgpt_runs_the_macos_open_by_its_full_path_on_the_fixed_url_only() {
        let command = open_command(CHATGPT_URL);
        assert_eq!(command.get_program(), "/usr/bin/open");
        assert_eq!(command.get_args().collect::<Vec<_>>(), [CHATGPT_URL]);
        assert_eq!(CHATGPT_URL, "https://chatgpt.com/");
    }
}
