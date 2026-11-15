//! Windows: the data folder next to the exe, Explorer, the Credential Manager. Built on Windows,
//! and in tests elsewhere for its pure parts; the parts that call Windows are `cfg(windows)`.

use std::ffi::OsString;
use std::io::{self, ErrorKind};
use std::path::{Path, PathBuf};

const DATA_DIR: &str = "Project2C-data";

/// Stored `Local`: on this machine only, never carried to another one by a roaming profile, as
/// `Enterprise` (the store's default) would be (ADR-0009 D-1 item 4: one key per machine).
const KEY_MODIFIERS: [(&str, &str); 1] = [("persistence", "Local")];

#[cfg(windows)]
pub fn data_dir() -> io::Result<PathBuf> {
    data_dir_beside(&std::env::current_exe()?)
}

/// `Project2C-data\` next to `exe` (portable, ADR-0006).
fn data_dir_beside(exe: &Path) -> io::Result<PathBuf> {
    let dir = exe
        .parent()
        .ok_or_else(|| io::Error::new(ErrorKind::NotFound, "exe has no parent folder"))?;
    Ok(dir.join(DATA_DIR))
}

#[cfg(windows)]
pub fn open_folder(path: &Path) -> io::Result<()> {
    let mut opener = std::process::Command::new(explorer(std::env::var_os("SystemRoot"))?);
    std::os::windows::process::CommandExt::raw_arg(&mut opener, explorer_arg(path));
    super::spawn_unwaited(&mut opener).map(drop)
}

#[cfg(windows)]
pub fn open_url(url: &str) -> io::Result<()> {
    super::spawn_unwaited(&mut url_command(std::env::var_os("SystemRoot"), url)?).map(drop)
}

/// Opens `url` in the default browser through Explorer, named by its full path like
/// `open_folder` does (DR-54).
#[cfg(windows)]
fn url_command(system_root: Option<OsString>, url: &str) -> io::Result<std::process::Command> {
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
    fn the_windows_data_folder_is_project2c_data_next_to_the_exe() {
        let folder = std::env::temp_dir();
        assert_eq!(
            data_dir_beside(&folder.join("Heritas L-CRM.exe")).unwrap(),
            folder.join("Project2C-data")
        );
        let error = data_dir_beside(Path::new("")).unwrap_err();
        assert_eq!(error.kind(), ErrorKind::NotFound);
        assert_eq!(error.to_string(), "exe has no parent folder");
    }

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
        let command = url_command(Some(r"C:\Windows".into()), CHATGPT_URL).unwrap();
        assert_eq!(
            command.get_program(),
            Path::new(r"C:\Windows").join("explorer.exe")
        );
        assert_eq!(command.get_args().collect::<Vec<_>>(), [CHATGPT_URL]);
        assert_eq!(CHATGPT_URL, "https://chatgpt.com/");
        assert!(url_command(None, CHATGPT_URL).is_err());
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
