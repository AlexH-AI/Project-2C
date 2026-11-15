//! Windows: the lock of the data folder by sharing, the access lists, Explorer, the Credential
//! Manager. Built on Windows, and in tests elsewhere for its pure parts; the parts that call
//! Windows are `cfg(windows)`.

use std::ffi::OsString;
use std::io::{self, ErrorKind};
use std::path::{Path, PathBuf};

/// Windows `ERROR_SHARING_VIOLATION`: another process holds the file without sharing.
const SHARING_VIOLATION: i32 = 32;
/// Windows `ERROR_LOCK_VIOLATION`: another process locked a part of the file.
const LOCK_VIOLATION: i32 = 33;

/// Stored `Local`: on this machine only, never carried to another one by a roaming profile, as
/// `Enterprise` (the store's default) would be (ADR-0009 D-1 item 4: one key per machine).
const KEY_MODIFIERS: [(&str, &str); 1] = [("persistence", "Local")];

/// Opens the lock file without sharing: a second exe on the same data folder fails with a sharing
/// violation, told apart as [`super::already_open`].
#[cfg(windows)]
pub fn open_lock_file(path: &Path) -> io::Result<std::fs::File> {
    use std::os::windows::fs::OpenOptionsExt;
    super::lock_file_options()
        .share_mode(0)
        .open(path)
        .map_err(|error| {
            if error.raw_os_error() == Some(SHARING_VIOLATION) {
                super::already_open()
            } else {
                error
            }
        })
}

/// A sharing or lock violation: another program opened the file without sharing (a sync or backup
/// tool, an antivirus scan, a SQLite browser), or locked a part of it.
pub fn held_by_another_program(error: &io::Error) -> bool {
    matches!(
        error.raw_os_error(),
        Some(SHARING_VIOLATION | LOCK_VIOLATION)
    )
}

/// Asks the access list of the folder for `FILE_ADD_FILE`; `probe` is for macOS only.
#[cfg(windows)]
pub fn add_refused(dir: &Path, _probe: &str) -> bool {
    // Windows `FILE_ADD_FILE`, and `FILE_FLAG_BACKUP_SEMANTICS`, without which no folder opens.
    const FILE_ADD_FILE: u32 = 0x0002;
    const FILE_FLAG_BACKUP_SEMANTICS: u32 = 0x0200_0000;
    refuses(dir, FILE_ADD_FILE, FILE_FLAG_BACKUP_SEMANTICS)
}

/// Asks the access lists for `DELETE`, which a save would get the same answer to.
#[cfg(windows)]
pub fn delete_refused(path: &Path) -> bool {
    // Windows `DELETE`.
    const DELETE: u32 = 0x0001_0000;
    refuses(path, DELETE, 0)
}

/// Windows refuses itself to rename a file over a read-only one (see
/// `platform::REFUSES_REPLACING_READ_ONLY`).
#[cfg(windows)]
pub const REFUSES_REPLACING_READ_ONLY: bool = true;

/// Opens `path` with the right `access` alone (and the `flags` of the open), which changes
/// nothing, and tells a refusal from a program that holds the file: that one fails with a sharing
/// violation, not with `PermissionDenied`.
#[cfg(windows)]
fn refuses(path: &Path, access: u32, flags: u32) -> bool {
    use std::os::windows::fs::OpenOptionsExt;
    std::fs::OpenOptions::new()
        .access_mode(access)
        .custom_flags(flags)
        .open(path)
        .is_err_and(|error| error.kind() == ErrorKind::PermissionDenied)
}

#[cfg(windows)]
pub fn folder_command(path: &Path) -> io::Result<std::process::Command> {
    explorer_showing(std::env::var_os("SystemRoot"), path)
}

#[cfg(windows)]
pub fn url_command(url: &str) -> io::Result<std::process::Command> {
    explorer_opening(std::env::var_os("SystemRoot"), url)
}

/// Explorer showing `path`, named by its full path in `system_root` (DR-54); the path goes raw
/// and quoted (see [`explorer_arg`]).
#[cfg(windows)]
fn explorer_showing(
    system_root: Option<OsString>,
    path: &Path,
) -> io::Result<std::process::Command> {
    let mut command = std::process::Command::new(explorer(system_root)?);
    std::os::windows::process::CommandExt::raw_arg(&mut command, explorer_arg(path));
    Ok(command)
}

/// Opens `url` in the default browser through Explorer, named by its full path like
/// [`explorer_showing`] does (DR-54).
#[cfg(windows)]
fn explorer_opening(system_root: Option<OsString>, url: &str) -> io::Result<std::process::Command> {
    let mut command = std::process::Command::new(explorer(system_root)?);
    command.arg(url);
    Ok(command)
}

/// The command-line argument that makes Explorer show `path`. Always quoted and passed raw:
/// `std` quotes an argument only when it has a space or tab, and Explorer splits an unquoted one
/// at commas (`/select,…`), so `D:\Apps\P2C,v2\…` opened Documents instead. A Windows path
/// never contains `"`, so nothing inside needs escaping.
fn explorer_arg(path: &Path) -> OsString {
    let mut arg = OsString::from("\"");
    arg.push(path);
    arg.push("\"");
    arg
}

/// Explorer by its full path in `system_root` (`%SystemRoot%`): a bare name is looked up in the
/// exe's folder first, so an `explorer.exe` put next to the portable exe would run instead (DR-54).
fn explorer(system_root: Option<OsString>) -> io::Result<PathBuf> {
    system_root
        .map(PathBuf::from)
        .filter(|root| root.is_absolute())
        .map(|root| root.join("explorer.exe"))
        .ok_or_else(|| {
            io::Error::new(
                ErrorKind::NotFound,
                "SystemRoot is missing or not an absolute path",
            )
        })
}

/// The entry in the Windows Credential Manager. The store applies [`KEY_MODIFIERS`] when the
/// key is saved, so a key saved before keeps its kind until it is saved again.
#[cfg(windows)]
pub fn key_entry(service: &str, user: &str) -> keyring_core::Result<keyring_core::Entry> {
    use keyring_core::api::CredentialStoreApi;
    let modifiers = std::collections::HashMap::from(KEY_MODIFIERS);
    windows_native_keyring_store::Store::new()
        .and_then(|store| store.build(service, user, Some(&modifiers)))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[cfg(windows)]
    use crate::ai::{CHATGPT_URL, KEY_SERVICE, KEY_USER};

    #[test]
    fn explorer_arg_quotes_the_path_and_keeps_it_verbatim() {
        for path in [
            r"D:\Apps\P2C,v2\Project2C-data\exports",
            r"D:\My Apps\P2C, v2\Project2C-data\backups",
            r"D:\Apps\Project-2C\Project2C-data\exports",
            r"C:\Program Files\Project-2C\Project2C-data\backups",
        ] {
            assert_eq!(
                explorer_arg(Path::new(path)),
                OsString::from(format!("\"{path}\""))
            );
        }
    }

    #[test]
    fn explorer_is_named_by_its_full_path_in_the_windows_folder() {
        // A bare name would run an `explorer.exe` put next to the portable exe (DR-54).
        let root = std::env::temp_dir();
        assert_eq!(
            explorer(Some(root.clone().into_os_string())).unwrap(),
            root.join("explorer.exe")
        );
        for root in [None, Some(OsString::new()), Some(OsString::from("Windows"))] {
            assert_eq!(explorer(root).unwrap_err().kind(), ErrorKind::NotFound);
        }
    }

    // `C:\Windows` is a path of Windows only: elsewhere it is not absolute.
    #[cfg(windows)]
    #[test]
    fn open_chatgpt_runs_explorer_by_its_full_path_on_the_fixed_url_only() {
        let command = explorer_opening(Some(r"C:\Windows".into()), CHATGPT_URL).unwrap();
        assert_eq!(
            command.get_program(),
            Path::new(r"C:\Windows").join("explorer.exe")
        );
        assert_eq!(command.get_args().collect::<Vec<_>>(), [CHATGPT_URL]);
        assert_eq!(CHATGPT_URL, "https://chatgpt.com/");
        assert!(explorer_opening(None, CHATGPT_URL).is_err());
    }

    #[cfg(windows)]
    #[test]
    fn open_folder_runs_explorer_by_its_full_path_on_the_path_quoted() {
        // Unquoted, Explorer would split the path at its comma and open Documents instead.
        let path = Path::new(r"D:\Apps\P2C,v2\Project2C-data\exports");
        let command = explorer_showing(Some(r"C:\Windows".into()), path).unwrap();
        assert_eq!(
            command.get_program(),
            Path::new(r"C:\Windows").join("explorer.exe")
        );
        assert_eq!(
            command.get_args().collect::<Vec<_>>(),
            [r#""D:\Apps\P2C,v2\Project2C-data\exports""#]
        );
        assert!(explorer_showing(None, path).is_err());
    }

    #[test]
    fn only_a_sharing_or_lock_violation_says_another_program_holds_the_file() {
        // Windows `ERROR_SHARING_VIOLATION` and `ERROR_LOCK_VIOLATION`.
        for code in [32, 33] {
            let error = io::Error::from_raw_os_error(code);
            assert!(held_by_another_program(&error), "os error {code}");
        }
        // Windows `ERROR_ACCESS_DENIED`, and an error of no system call.
        assert!(!held_by_another_program(&io::Error::from_raw_os_error(5)));
        let denied = io::Error::from(ErrorKind::PermissionDenied);
        assert!(!held_by_another_program(&denied));
    }

    #[test]
    fn the_key_is_stored_local_to_this_machine() {
        assert_eq!(KEY_MODIFIERS, [("persistence", "Local")]);
        #[cfg(windows)]
        {
            use keyring_core::api::CredentialStoreApi;
            let modifiers = std::collections::HashMap::from(KEY_MODIFIERS);
            let store = windows_native_keyring_store::Store::new().unwrap();
            assert!(store.build(KEY_SERVICE, KEY_USER, Some(&modifiers)).is_ok());
            // The store reads the value: a wrong one would fail here rather than store `Enterprise`.
            let wrong = std::collections::HashMap::from([("persistence", "Locale")]);
            assert!(store.build(KEY_SERVICE, KEY_USER, Some(&wrong)).is_err());
            // The entry the app uses, read without touching the Credential Manager: its `Debug`
            // shows the store's own credential (`windows-native-keyring-store` 1.1.0, pinned).
            let app = format!("{:?}", crate::ai::key_entry().unwrap());
            assert!(app.contains("persistence: Local"), "{app}");
            assert!(
                app.contains(r#"Some(("Project-2C", "opencode-go"))"#),
                "{app}"
            );
        }
    }
}
