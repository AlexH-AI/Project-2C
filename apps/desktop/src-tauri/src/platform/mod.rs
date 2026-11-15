//! What the shell does differently on each platform (ADR-0019 §1): the data folder and its lock,
//! what the system lets the app write there, showing a folder or a page, the key store. Windows is
//! `windows`; anything else is `macos`, the only other platform the app is built for. Each one's
//! pure parts (no system call) build in tests on every platform, so both are checked wherever the
//! tests run.

use std::ffi::OsString;
use std::fs;
use std::io::{self, ErrorKind};
use std::path::{Path, PathBuf};
use std::process::{Command, ExitStatus};
use std::sync::OnceLock;
use std::thread;

#[cfg(any(not(windows), test))]
mod macos;
#[cfg(any(windows, test))]
mod windows;

#[cfg(not(windows))]
use macos as imp;
#[cfg(windows)]
use windows as imp;

/// The identifier of the build (`tauri.conf.json`): it names the data folder of the installed app
/// on Windows and of the app on macOS, as it names WebView2's folder (ADR-0019 §2).
const APP_ID: &str = "com.heritas.lcrm";
/// The data folder next to the executable: a debug build's, and the exe's in portable mode.
const DATA_DIR_BESIDE: &str = "Project2C-data";

/// The data folder (ADR-0019 §2), chosen by [`choose_data_dir`] at the first call of the run and
/// kept: the same files and subfolders wherever it is.
pub fn data_dir() -> io::Result<PathBuf> {
    static CHOSEN: OnceLock<PathBuf> = OnceLock::new();
    chosen_once(&CHOSEN, || {
        let exe = std::env::current_exe()?;
        let portable = beside(&exe).is_ok_and(|dir| dir.is_dir());
        choose_data_dir(Launch {
            windows: cfg!(windows),
            debug: cfg!(debug_assertions),
            exe,
            portable,
            local_app_data: std::env::var_os("LOCALAPPDATA"),
            home: std::env::var_os("HOME"),
        })
    })
}

/// The folder kept in `chosen`, or the one `choose` gives, kept there for the rest of the run: a
/// `Project2C-data` made next to the exe meanwhile must not move the data away from the folder the
/// data lock holds. An error is not kept, so the next command asks again.
fn chosen_once(
    chosen: &OnceLock<PathBuf>,
    choose: impl FnOnce() -> io::Result<PathBuf>,
) -> io::Result<PathBuf> {
    if let Some(dir) = chosen.get() {
        return Ok(dir.clone());
    }
    let dir = choose()?;
    Ok(chosen.get_or_init(|| dir).clone())
}

/// What the data folder depends on, read from the system by [`data_dir`]: passed in, so every
/// branch of [`choose_data_dir`] is tested on both platforms.
struct Launch {
    windows: bool,
    debug: bool,
    /// The running executable.
    exe: PathBuf,
    /// Whether a folder `Project2C-data` is next to the executable.
    portable: bool,
    /// `%LOCALAPPDATA%`, read on Windows only.
    local_app_data: Option<OsString>,
    /// `$HOME`, read on macOS only.
    home: Option<OsString>,
}

/// The data folder, in this order:
/// 1. a debug build (`pnpm dev`), on both platforms: `Project2C-data` next to the executable, so
///    the data of a dev machine never mixes with the data in use;
/// 2. Windows, portable mode: the `Project2C-data\` next to the exe, when there is one;
/// 3. Windows, installed: `%LOCALAPPDATA%\<identifier>\`. No `Project2C-data\` is made;
/// 4. macOS: `~/Library/Application Support/<identifier>/`, never next to the app, whose `.app`
///    may run from a read-only place (App Translocation) and whose signature a write would break.
///
/// A variable missing or not an absolute path is an error: the data never goes anywhere else.
fn choose_data_dir(launch: Launch) -> io::Result<PathBuf> {
    if launch.debug || (launch.windows && launch.portable) {
        beside(&launch.exe)
    } else if launch.windows {
        absolute(launch.local_app_data, "LOCALAPPDATA").map(|dir| dir.join(APP_ID))
    } else {
        absolute(launch.home, "HOME").map(|home| {
            home.join("Library")
                .join("Application Support")
                .join(APP_ID)
        })
    }
}

/// `Project2C-data` next to `exe`.
fn beside(exe: &Path) -> io::Result<PathBuf> {
    exe.parent()
        .map(|dir| dir.join(DATA_DIR_BESIDE))
        .ok_or_else(|| io::Error::new(ErrorKind::NotFound, "exe has no parent folder"))
}

/// The path in the variable `name`, when it is set to an absolute path.
fn absolute(value: Option<OsString>, name: &str) -> io::Result<PathBuf> {
    value
        .map(PathBuf::from)
        .filter(|path| path.is_absolute())
        .ok_or_else(|| {
            io::Error::new(
                ErrorKind::NotFound,
                format!("{name} is missing or not an absolute path"),
            )
        })
}

/// Opens the lock file of the data folder at `path` and holds the folder for this process until
/// the file drops; the system lets go when the process ends, crashed or not. Windows opens it
/// without sharing; macOS locks it (`flock`), as any program may open a file there, so `open -n`
/// or the binary run from inside the `.app` cannot write the data at the same time (L137).
/// Another process holding it → `ResourceBusy` with the message
/// [`ALREADY_OPEN`](crate::storage::ALREADY_OPEN). `std` only: no crate (ADR-0016).
pub fn lock_data_folder(path: &Path) -> io::Result<fs::File> {
    imp::open_lock_file(path)
}

/// Whether `error` says another program holds the file, which may let go: on Windows, it opened
/// the file without sharing or locked a part of it. Never on macOS, which lets every program open
/// a file.
pub fn held_by_another_program(error: &io::Error) -> bool {
    imp::held_by_another_program(error)
}

/// Whether the system refuses the app a new file in the folder `dir`, which every save asks first
/// to write its `.tmp`: Windows by the folder's access list, macOS by its write bits. Windows asks
/// without making a file. macOS cannot ask without trying, so it makes the file `probe` in `dir`
/// and removes it at once: the caller owns that name (it holds the data lock), and one a crash
/// leaves must be one the next start removes. A `probe` already there answers nothing, so no.
pub fn add_refused(dir: &Path, probe: &str) -> bool {
    imp::add_refused(dir, probe)
}

/// Whether the system refuses the app the right to delete the file at `path`, which renaming a
/// new file over it asks: on Windows, the access lists of the file and of its folder (a folder that
/// lets the app delete in it stands in for the file's own right, as it does for a save); on macOS,
/// a lock flag on the file (Finder's "Locked", `uchg`), whatever the folder's bits.
pub fn delete_refused(path: &Path) -> bool {
    imp::delete_refused(path)
}

/// Whether the system refuses itself to rename a new file over a read-only one: Windows does, with
/// `PermissionDenied`. macOS's `rename` asks only the folder's write bits, so it replaces a
/// read-only file (no write bit), whose data and mark would be lost unseen (L76); a locked one it
/// refuses, but with a bare "Operation not permitted" once the whole new file is written.
pub const REFUSES_REPLACING_READ_ONLY: bool = imp::REFUSES_REPLACING_READ_ONLY;

/// Shows `path` in Explorer, in Finder on macOS, without waiting (see [`spawn_unwaited`]).
pub fn open_folder(path: &Path) -> io::Result<()> {
    spawn_unwaited(&mut imp::folder_command(path)?).map(drop)
}

/// Opens `url` in the default browser, without waiting (see [`spawn_unwaited`]). Only the app's
/// own fixed URLs (`ai::CHATGPT_URL`), never a string from the webview: Explorer and `open` run a
/// program as readily as they open a page, and Explorer splits an unquoted argument at its commas.
pub fn open_url(url: &str) -> io::Result<()> {
    spawn_unwaited(&mut imp::url_command(url)?).map(drop)
}

/// The lock file is made by the first start and never cut.
fn lock_file_options() -> fs::OpenOptions {
    let mut options = fs::OpenOptions::new();
    options.read(true).write(true).create(true).truncate(false);
    options
}

/// What [`lock_data_folder`] returns when another process holds the data folder.
fn already_open() -> io::Error {
    io::Error::new(ErrorKind::ResourceBusy, crate::storage::ALREADY_OPEN)
}

/// The entry of `service` / `user` in the system's key store, or the store's error as is (the
/// caller decides what of it to pass on).
pub fn key_entry(service: &str, user: &str) -> keyring_core::Result<keyring_core::Entry> {
    imp::key_entry(service, user)
}

/// What waits for a program [`spawn_unwaited`] started: its thread gives the exit status.
type Waiting = thread::JoinHandle<io::Result<ExitStatus>>;

/// Starts `opener` (Explorer, `open`) and returns at once: Explorer reports exit code 1 even when
/// it opened the folder, so its end says nothing. A thread of its own waits for it, so it does not
/// stay a zombie until the app quits (L77). `None` when the system could not start that thread:
/// the program runs all the same, only its end is not collected. Every opener goes through here
/// ([`open_folder`], [`open_url`]): each platform only builds the command.
fn spawn_unwaited(opener: &mut Command) -> io::Result<Option<Waiting>> {
    let mut child = opener.spawn()?;
    Ok(thread::Builder::new().spawn(move || child.wait()).ok())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::process::Stdio;

    /// A program that ends once its input closes, by its full path.
    fn until_input_closes() -> Command {
        #[cfg(windows)]
        let program = PathBuf::from(std::env::var_os("SystemRoot").unwrap())
            .join("System32")
            .join("sort.exe");
        #[cfg(not(windows))]
        let program = PathBuf::from("/bin/cat");
        let mut command = Command::new(program);
        command.stdout(Stdio::null());
        command
    }

    #[test]
    fn an_opener_is_not_waited_for_but_its_end_is_collected() {
        // The program cannot end while the test holds its input open: `spawn_unwaited` returning
        // at all shows it did not wait (L77). Called on a thread of its own, so a wait fails the
        // test after a while instead of holding it up forever.
        let (input, held) = io::pipe().unwrap();
        let (sent, returned) = std::sync::mpsc::channel();
        thread::spawn(move || sent.send(spawn_unwaited(until_input_closes().stdin(input))));
        let waiting = match returned.recv_timeout(std::time::Duration::from_secs(30)) {
            Ok(started) => started.unwrap().unwrap(),
            Err(_) => {
                drop(held);
                panic!("spawn_unwaited waited for the program to end");
            }
        };
        assert!(!waiting.is_finished());
        drop(held);
        // The thread's `wait` read how it ended: the process was collected, not left a zombie.
        assert!(waiting.join().unwrap().unwrap().success());
    }

    /// A release build of the installed app on Windows, with no `Project2C-data` next to its exe and
    /// both variables absolute paths under `root`.
    fn installed(root: &Path) -> Launch {
        Launch {
            windows: true,
            debug: false,
            exe: root.join("Heritas L-CRM").join("project2c.exe"),
            portable: false,
            local_app_data: Some(root.join("AppData").join("Local").into_os_string()),
            home: Some(root.join("home").into_os_string()),
        }
    }

    #[test]
    fn a_debug_build_keeps_its_data_next_to_the_executable_on_both_platforms() {
        // Never with the data in use, whatever the variables say (ADR-0019 §2).
        let root = std::env::temp_dir();
        for windows in [true, false] {
            let debug = Launch {
                windows,
                debug: true,
                local_app_data: None,
                home: None,
                ..installed(&root)
            };
            assert_eq!(
                choose_data_dir(debug).unwrap(),
                root.join("Heritas L-CRM").join("Project2C-data")
            );
        }
        let nowhere = Launch {
            debug: true,
            exe: PathBuf::new(),
            ..installed(&root)
        };
        let error = choose_data_dir(nowhere).unwrap_err();
        assert_eq!(error.kind(), ErrorKind::NotFound);
        assert_eq!(error.to_string(), "exe has no parent folder");
    }

    #[test]
    fn the_exe_on_windows_uses_the_project2c_data_folder_next_to_it() {
        // The portable mode (ADR-0019 §5, C+P): `LOCALAPPDATA` is not read.
        let root = std::env::temp_dir();
        let portable = Launch {
            portable: true,
            local_app_data: None,
            ..installed(&root)
        };
        assert_eq!(
            choose_data_dir(portable).unwrap(),
            root.join("Heritas L-CRM").join("Project2C-data")
        );
    }

    #[test]
    fn the_installed_app_on_windows_keeps_its_data_in_local_app_data_under_the_identifier() {
        let root = std::env::temp_dir();
        assert_eq!(
            choose_data_dir(installed(&root)).unwrap(),
            root.join("AppData").join("Local").join("com.heritas.lcrm")
        );
        // A `LOCALAPPDATA` missing or relative is an error, never another folder.
        for local_app_data in [
            None,
            Some(OsString::new()),
            Some(OsString::from(r"AppData\Local")),
        ] {
            let error = choose_data_dir(Launch {
                local_app_data,
                ..installed(&root)
            })
            .unwrap_err();
            assert_eq!(error.kind(), ErrorKind::NotFound);
            assert_eq!(
                error.to_string(),
                "LOCALAPPDATA is missing or not an absolute path"
            );
        }
    }

    #[test]
    fn the_app_on_macos_keeps_its_data_under_application_support() {
        // Not inside the `.app`, which may run from a read-only place and whose signature a write
        // would break (M2); no portable mode, even with a `Project2C-data` next to it.
        let root = std::env::temp_dir();
        let macos = Launch {
            windows: false,
            portable: true,
            ..installed(&root)
        };
        assert_eq!(
            choose_data_dir(macos).unwrap(),
            root.join("home")
                .join("Library")
                .join("Application Support")
                .join("com.heritas.lcrm")
        );
        // A `HOME` missing or relative is an error, never another folder.
        for home in [
            None,
            Some(OsString::new()),
            Some(OsString::from("Users/me")),
        ] {
            let error = choose_data_dir(Launch {
                windows: false,
                home,
                ..installed(&root)
            })
            .unwrap_err();
            assert_eq!(error.kind(), ErrorKind::NotFound);
            assert_eq!(error.to_string(), "HOME is missing or not an absolute path");
        }
    }

    #[test]
    fn the_data_folder_is_named_by_the_identifier_of_the_build() {
        // A new identifier would leave the data in the old folder (ADR-0019 §2).
        let config: serde_json::Value =
            serde_json::from_str(include_str!("../../tauri.conf.json")).unwrap();
        assert_eq!(config["identifier"], APP_ID);
    }

    #[test]
    fn the_data_folder_is_chosen_once_a_run() {
        // A `Project2C-data` made next to the exe while the app runs moves nothing: the data lock
        // holds the folder of the first start only. An error is not kept.
        let chosen = OnceLock::new();
        let failed = chosen_once(&chosen, || Err(io::Error::from(ErrorKind::NotFound)));
        assert_eq!(failed.unwrap_err().kind(), ErrorKind::NotFound);
        let first = std::env::temp_dir().join("first");
        assert_eq!(chosen_once(&chosen, || Ok(first.clone())).unwrap(), first);
        let later = chosen_once(&chosen, || panic!("chosen again"));
        assert_eq!(later.unwrap(), first);
    }

    #[test]
    fn an_opener_that_cannot_start_is_an_error() {
        let missing = std::env::temp_dir().join("no-such-opener.exe");
        assert!(spawn_unwaited(&mut Command::new(missing)).is_err());
    }
}
