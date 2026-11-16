//! macOS (the only other platform the app is built for): the `flock` of the data folder, the
//! write bits and lock flags, `open`, the Keychain. Built on macOS, and in tests elsewhere for its
//! pure parts; the parts that call the system are `cfg(not(windows))`.

use std::ffi::OsStr;
use std::fs;
use std::io::{self, ErrorKind};
use std::path::Path;
use std::process::Command;

/// macOS `open`, by its full path (see [`open_command`]).
const OPEN: &str = "/usr/bin/open";
/// The file flags (`chflags`) under which the system refuses to delete or rename a file whatever
/// its folder's bits: `uchg` (user immutable, Finder's "Locked"), `uappnd`, `schg`, `sappnd`. The
/// values of `<sys/stat.h>` (`UF_IMMUTABLE`, `UF_APPEND`, `SF_IMMUTABLE`, `SF_APPEND`).
const LOCK_FLAGS: u32 = 0x0000_0002 | 0x0000_0004 | 0x0002_0000 | 0x0004_0000;

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

/// macOS replaces a read-only file (see `platform::REFUSES_REPLACING_READ_ONLY`).
#[cfg(not(windows))]
pub const REFUSES_REPLACING_READ_ONLY: bool = false;

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

/// The entry in the user's login Keychain, the file-based one (ADR-0019 §4): building it reads and
/// writes nothing there. No modifiers: the store's only one names another Keychain, and the
/// Windows store's `persistence` means nothing here.
#[cfg(not(windows))]
pub fn key_entry(service: &str, user: &str) -> keyring_core::Result<keyring_core::Entry> {
    use keyring_core::api::CredentialStoreApi;
    apple_native_keyring_store::keychain::Store::new()
        .and_then(|store| store.build(service, user, None))
}

/// macOS `open` on `target`: Finder shows a folder, the default browser opens a page. By its full
/// path, never looked up in `PATH` (as Explorer, DR-54).
fn open_command(target: impl AsRef<OsStr>) -> Command {
    let mut command = Command::new(OPEN);
    command.arg(target);
    command
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ai::CHATGPT_URL;

    #[test]
    fn open_command_runs_the_macos_open_by_its_full_path_on_the_target_only() {
        // Never looked up in `PATH` (DR-54); Finder for a folder, the default browser for a page.
        let folder = Path::new("/Users/me/Library/Application Support/com.heritas.lcrm/exports");
        let command = open_command(folder);
        assert_eq!(command.get_program(), "/usr/bin/open");
        assert_eq!(command.get_args().collect::<Vec<_>>(), [folder.as_os_str()]);
    }

    /// A file in the system's temporary folder, removed when this drops: also when a test fails
    /// half way, so none is left behind (DR6-09).
    struct TempFile(std::path::PathBuf);

    impl Drop for TempFile {
        fn drop(&mut self) {
            let _ = fs::remove_file(&self.0);
        }
    }

    #[test]
    fn a_second_lock_of_the_lock_file_is_refused_until_the_first_is_released() {
        // The lock of macOS (`flock`, L137); on Windows the same `std` lock, though the exe locks
        // by sharing there. Made before the locks, the file drops after them.
        let path =
            TempFile(std::env::temp_dir().join(format!("p2c-lock-{}.lock", std::process::id())));
        let first = open_lock_file(&path.0).unwrap();
        let error = open_lock_file(&path.0).unwrap_err();
        assert_eq!(error.kind(), ErrorKind::ResourceBusy);
        assert_eq!(error.to_string(), crate::storage::ALREADY_OPEN);
        drop(first);
        drop(open_lock_file(&path.0).unwrap());
    }

    #[cfg(not(windows))]
    #[test]
    fn the_key_s_entry_is_in_the_login_keychain_and_building_it_touches_nothing() {
        // The entry the app uses: the generic password `Project-2C` / `opencode-go` of the user's
        // login Keychain, as the Credential Manager's on Windows (ADR-0009 D-1). Building it reads
        // and writes nothing in the Keychain, so no password prompt can hold up the run; saving,
        // reading and deleting there are tried by the Owner on the MacBook (Mac-4).
        use apple_native_keyring_store::keychain::{Cred, MacKeychainDomain};
        let entry = crate::ai::key_entry().unwrap();
        assert_eq!(
            entry.as_any().downcast_ref::<Cred>(),
            Some(&Cred {
                domain: MacKeychainDomain::User,
                service: "Project-2C".into(),
                account: "opencode-go".into(),
            })
        );
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
