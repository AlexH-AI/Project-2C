//! macOS (the only other platform the app is built for): the data folder under Application
//! Support and its `flock`, the write bits and lock flags, `open`, no key store yet. Built on
//! macOS, and in tests elsewhere for its pure parts; the parts that call the system are
//! `cfg(not(windows))`.

use std::ffi::{OsStr, OsString};
use std::fs;
use std::io::{self, ErrorKind};
use std::path::{Path, PathBuf};
use std::process::Command;

/// The identifier of the build (`tauri.conf.json`), which names the data folder on macOS.
const APP_ID: &str = "dev.alexh.project2c";
/// macOS `open`, by its full path (see [`open_command`]).
const OPEN: &str = "/usr/bin/open";
/// The file flags (`chflags`) under which the system refuses to delete or rename a file whatever
/// its folder's bits: `uchg` (user immutable, Finder's "Locked"), `uappnd`, `schg`, `sappnd`. The
/// values of `<sys/stat.h>` (`UF_IMMUTABLE`, `UF_APPEND`, `SF_IMMUTABLE`, `SF_APPEND`).
const LOCK_FLAGS: u32 = 0x0000_0002 | 0x0000_0004 | 0x0002_0000 | 0x0004_0000;

#[cfg(not(windows))]
pub fn data_dir() -> io::Result<PathBuf> {
    app_support_dir(std::env::var_os("HOME"))
}

/// Opens the lock file and locks it for this process (`flock`): two opens of the file never share
/// the lock, in one process or two. Also built on Windows, where its test runs too.
pub fn open_lock_file(path: &Path) -> io::Result<fs::File> {
    let file = super::lock_file_options().open(path)?;
    match file.try_lock() {
        Ok(()) => Ok(file),
        Err(fs::TryLockError::WouldBlock) => Err(super::already_open()),
        Err(fs::TryLockError::Error(error)) => Err(error),
    }
}

/// macOS lets every program open a file.
#[cfg(not(windows))]
pub fn held_by_another_program(_error: &io::Error) -> bool {
    false
}

/// Makes the file `probe` in `dir` and removes it at once (see `platform::add_refused`).
#[cfg(not(windows))]
pub fn add_refused(dir: &Path, probe: &str) -> bool {
    let probe = dir.join(probe);
    match fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&probe)
    {
        Ok(file) => {
            drop(file);
            let _ = fs::remove_file(&probe);
            false
        }
        Err(error) => error.kind() == ErrorKind::PermissionDenied,
    }
}

/// A lock flag on the file: its folder's bits are asked by `add_refused`, which every caller asks
/// first.
#[cfg(not(windows))]
pub fn delete_refused(path: &Path) -> bool {
    fs::metadata(path).is_ok_and(|meta| locked(std::os::macos::fs::MetadataExt::st_flags(&meta)))
}

/// No write bit on the file, or a lock flag (see `platform::must_refuse_replacing`).
#[cfg(not(windows))]
pub fn must_refuse_replacing(path: &Path) -> bool {
    fs::metadata(path).is_ok_and(|meta| {
        meta.permissions().readonly() || locked(std::os::macos::fs::MetadataExt::st_flags(&meta))
    })
}

/// Whether the file flags `flags` hold one of [`LOCK_FLAGS`].
fn locked(flags: u32) -> bool {
    flags & LOCK_FLAGS != 0
}

#[cfg(not(windows))]
pub fn folder_command(path: &Path) -> io::Result<Command> {
    Ok(open_command(path))
}

#[cfg(not(windows))]
pub fn url_command(url: &str) -> io::Result<Command> {
    Ok(open_command(url))
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
    fn a_second_lock_of_the_lock_file_is_refused_until_the_first_is_released() {
        // The lock of macOS (`flock`, L137); on Windows the same `std` lock, though the exe locks
        // by sharing there.
        let path = std::env::temp_dir().join(format!("p2c-lock-{}.lock", std::process::id()));
        let first = open_lock_file(&path).unwrap();
        let error = open_lock_file(&path).unwrap_err();
        assert_eq!(error.kind(), ErrorKind::ResourceBusy);
        assert_eq!(error.to_string(), crate::storage::ALREADY_OPEN);
        drop(first);
        drop(open_lock_file(&path).unwrap());
        fs::remove_file(&path).unwrap();
    }

    #[test]
    fn the_lock_flags_of_finder_and_the_system_refuse_deleting_the_file() {
        // `uchg` (Finder's "Locked"), `uappnd`, `schg`, `sappnd`: the values of `<sys/stat.h>`.
        for flags in [0x2, 0x4, 0x2_0000, 0x4_0000, 0x2 | 0x8000] {
            assert!(locked(flags), "flags {flags:#x}");
        }
        // None, `nodump`, `opaque`, `hidden`: the file may be deleted.
        for flags in [0, 0x1, 0x8, 0x8000] {
            assert!(!locked(flags), "flags {flags:#x}");
        }
    }

    #[test]
    fn open_chatgpt_runs_the_macos_open_by_its_full_path_on_the_fixed_url_only() {
        let command = open_command(CHATGPT_URL);
        assert_eq!(command.get_program(), "/usr/bin/open");
        assert_eq!(command.get_args().collect::<Vec<_>>(), [CHATGPT_URL]);
        assert_eq!(CHATGPT_URL, "https://chatgpt.com/");
    }
}
