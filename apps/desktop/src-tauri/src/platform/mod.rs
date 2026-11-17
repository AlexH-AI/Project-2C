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
        choose_data_dir(this_build(std::env::current_exe()?)?)
    })
}

/// [`launch`] for this build: the platform and the kind of build it was made for.
fn this_build(exe: PathBuf) -> io::Result<Launch> {
    launch(cfg!(windows), cfg!(debug_assertions), exe)
}

/// What the data folder of a run of `exe` depends on, read from the system. Only a release exe on
/// Windows has a portable mode, so only it looks for `Project2C-data` ([`portable`]), and its error
/// is the data folder's: elsewhere a `Project2C-data` it cannot read is no reason to fail.
fn launch(windows: bool, debug: bool, exe: PathBuf) -> io::Result<Launch> {
    let portable = windows && !debug && portable(&exe)?;
    Ok(Launch {
        windows,
        debug,
        exe,
        portable,
        local_app_data: std::env::var_os("LOCALAPPDATA"),
        home: std::env::var_os("HOME"),
    })
}

/// Whether a folder `Project2C-data` is next to `exe`: the portable mode of the exe on Windows.
/// Nothing there, or anything else by that name, is no. One the system cannot read is an error, as
/// a missing variable is, so the data never goes silently to the installed app's folder (L176): a
/// link that leads nowhere or out of reach too (a junction to a deleted folder, to a drive pulled
/// out or not ready). That one's message is
/// [`DATA_DIR_UNREACHABLE`](crate::storage::DATA_DIR_UNREACHABLE) (see [`unreadable`]): the file
/// is whole, so the startup page must not tell to copy a backup over it (L184, L204).
fn portable(exe: &Path) -> io::Result<bool> {
    portable_with(exe, |dir| fs::metadata(dir))
}

/// [`portable`] with the read that follows a link passed in, which the tests make fail.
fn portable_with(
    exe: &Path,
    metadata: impl FnOnce(&Path) -> io::Result<fs::Metadata>,
) -> io::Result<bool> {
    let dir = beside(exe)?;
    match metadata(&dir) {
        Ok(found) => Ok(found.is_dir()),
        Err(error) => unreadable(error, || fs::symlink_metadata(&dir).map(drop)),
    }
}

/// What a `Project2C-data` that `fs::metadata` could not read means ([`portable`]): `error` is
/// that read's error, and `entry` reads the entry itself without following a link
/// (`fs::symlink_metadata`). Passed in, so every branch is tested without a drive. Anything there
/// whose end cannot be reached, for any cause but the system refusing the app, is
/// [`DATA_DIR_UNREACHABLE`](crate::storage::DATA_DIR_UNREACHABLE): what it leads to is gone or
/// out of reach (a drive pulled out, or still in the machine but not ready, a network not reached;
/// L204). The refusal stays as it is, for `db_open` to tell apart.
fn unreadable(error: io::Error, entry: impl FnOnce() -> io::Result<()>) -> io::Result<bool> {
    if error.kind() == ErrorKind::PermissionDenied {
        return Err(error);
    }
    let not_found = error.kind() == ErrorKind::NotFound;
    match entry() {
        Ok(()) => Err(io::Error::new(
            ErrorKind::NotFound,
            crate::storage::DATA_DIR_UNREACHABLE,
        )),
        Err(none) if not_found && none.kind() == ErrorKind::NotFound => Ok(false),
        Err(other) if not_found => Err(other),
        Err(_) => Err(error),
    }
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

/// What the data folder depends on, read from the system by [`launch`]: passed in, so every
/// branch of [`choose_data_dir`] is tested on both platforms.
struct Launch {
    windows: bool,
    debug: bool,
    /// The running executable.
    exe: PathBuf,
    /// Whether a folder `Project2C-data` is next to the executable ([`portable`]); looked for by the
    /// release exe on Windows only, false elsewhere.
    portable: bool,
    /// `%LOCALAPPDATA%`: read on every platform, used by the installed app on Windows only.
    local_app_data: Option<OsString>,
    /// `$HOME`: read on every platform, used on macOS only.
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
    use crate::storage::DATA_DIR_UNREACHABLE;
    use crate::test_support::temp_dir;
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
    fn only_a_project2c_data_folder_next_to_the_exe_is_the_portable_mode() {
        let root = temp_dir();
        fs::create_dir_all(&root).unwrap();
        let exe = root.join("project2c.exe");
        assert!(!portable(&exe).unwrap());
        // Anything else by that name is no folder: the installed app's data, as before.
        fs::write(root.join("Project2C-data"), b"").unwrap();
        assert!(!portable(&exe).unwrap());
        fs::remove_file(root.join("Project2C-data")).unwrap();
        fs::create_dir(root.join("Project2C-data")).unwrap();
        assert!(portable(&exe).unwrap());
        // No folder above the exe either: not found, so no portable folder.
        assert!(!portable(&root.join("gone").join("project2c.exe")).unwrap());
        assert_eq!(
            portable(Path::new("")).unwrap_err().to_string(),
            "exe has no parent folder"
        );
        // A `Project2C-data` the system cannot read is an error, never the installed app's folder
        // in its place (L176): here a path through a file, `ENOTDIR` on macOS. Windows reports that
        // path as not found, hence macOS only.
        #[cfg(not(windows))]
        {
            let file = root.join("file");
            fs::write(&file, b"").unwrap();
            let error = portable(&file.join("project2c.exe")).unwrap_err();
            assert_ne!(error.kind(), ErrorKind::NotFound);
        }
    }

    /// A link at `link` to the folder `target`: a junction on Windows (`mklink /J` needs no
    /// privilege, unlike a symbolic link), a symbolic link on macOS. cmd splits a path at `&` or
    /// `^` out of quotes, and `std` quotes only a path with a space, so each path goes raw and
    /// quoted (L188).
    fn link_folder(target: &Path, link: &Path) {
        #[cfg(windows)]
        {
            use std::os::windows::process::CommandExt;
            let quoted = |path: &Path| {
                let mut arg = OsString::from("\"");
                arg.push(path);
                arg.push("\"");
                arg
            };
            let cmd = PathBuf::from(std::env::var_os("SystemRoot").unwrap())
                .join("System32")
                .join("cmd.exe");
            let made = Command::new(cmd)
                .args(["/D", "/C", "mklink", "/J"])
                .raw_arg(quoted(link))
                .raw_arg(quoted(target))
                .stdout(Stdio::null())
                .status()
                .unwrap();
            assert!(made.success());
        }
        #[cfg(not(windows))]
        std::os::unix::fs::symlink(target, link).unwrap();
    }

    /// `root` with a `Project2C-data` link to a folder already removed (a junction to a deleted
    /// folder, or to the drive of a USB stick pulled out); returns the exe next to it. The exe's
    /// folder has an `&` in its name, which cmd would split an unquoted path at (L188).
    fn beside_a_link_to_nowhere(root: &Path) -> PathBuf {
        let folder = root.join("R&D");
        let target = root.join("target");
        fs::create_dir_all(&folder).unwrap();
        fs::create_dir_all(&target).unwrap();
        link_folder(&target, &folder.join("Project2C-data"));
        let exe = folder.join("project2c.exe");
        assert!(portable(&exe).unwrap());
        fs::remove_dir(&target).unwrap();
        exe
    }

    #[test]
    fn a_project2c_data_link_that_leads_nowhere_is_an_error_not_no_folder() {
        // The system says "not found" for what the link leads to, though the link is there: the
        // data must not go silently to the installed app's folder (L176, review of PR 1348). Its
        // message is the code the startup page tells apart (L184).
        let root = temp_dir();
        let exe = beside_a_link_to_nowhere(&root);
        let error = portable(&exe).unwrap_err();
        assert_eq!(error.kind(), ErrorKind::NotFound);
        assert_eq!(error.to_string(), DATA_DIR_UNREACHABLE);
    }

    #[test]
    fn db_open_says_the_file_is_whole_when_project2c_data_leads_nowhere() {
        // Not the page that tells to copy a backup over the file, which is whole, only out of
        // reach until the drive or the link is back (L184).
        let root = temp_dir();
        let exe = beside_a_link_to_nowhere(&root);
        let chosen = launch(true, false, exe).and_then(choose_data_dir);
        assert_eq!(crate::opened_dir(chosen).unwrap_err(), DATA_DIR_UNREACHABLE);
    }

    #[test]
    fn a_project2c_data_there_that_leads_to_a_drive_out_of_reach_is_unreachable() {
        // A link to a drive still in the machine but not ready (a memory card pulled out of its
        // reader), or across a network not reached, fails with another kind than "not found": the
        // file is whole all the same, so not the page that tells to copy a backup over it (L204).
        for error in [
            io::Error::other("not ready"),
            io::Error::from(ErrorKind::NetworkUnreachable),
        ] {
            let unreachable = unreadable(error, || Ok(())).unwrap_err();
            assert_eq!(unreachable.to_string(), DATA_DIR_UNREACHABLE);
        }
        // Nothing to read by that name either: the error stays as it is.
        let gone = || Err(io::Error::from(ErrorKind::NotFound));
        let error = unreadable(io::Error::other("not ready"), gone).unwrap_err();
        assert_eq!(
            (error.kind(), error.to_string()),
            (ErrorKind::Other, "not ready".into())
        );
        // The system refusing the app stays as it is, for `db_open` to tell apart (`opened_dir`):
        // what the link leads to, or the link itself when what it leads to is not found.
        let refused = unreadable(io::Error::from(ErrorKind::PermissionDenied), || Ok(()));
        assert_eq!(refused.unwrap_err().kind(), ErrorKind::PermissionDenied);
        let link_refused = || Err(io::Error::from(ErrorKind::PermissionDenied));
        let refused = unreadable(io::Error::from(ErrorKind::NotFound), link_refused);
        assert_eq!(refused.unwrap_err().kind(), ErrorKind::PermissionDenied);
    }

    #[test]
    fn any_project2c_data_there_whose_read_fails_is_unreachable_not_only_a_link() {
        // The new branch covers whatever the system reads by that name, as the one for "not found"
        // does: a folder of any other kind of reparse point fails out of reach the same (L204).
        let root = temp_dir();
        fs::create_dir_all(root.join("Project2C-data")).unwrap();
        let not_ready = |_: &Path| Err(io::Error::other("not ready"));
        let error = portable_with(&root.join("project2c.exe"), not_ready).unwrap_err();
        assert_eq!(error.to_string(), DATA_DIR_UNREACHABLE);
    }

    #[test]
    fn db_open_says_the_file_is_whole_when_project2c_data_leads_round_in_a_loop() {
        // Two links that lead to each other: the entry is there and what it leads to fails with
        // another kind than "not found", as a drive not ready does (L204), here through `portable`
        // as `db_open` meets it.
        let root = temp_dir();
        let folder = root.join("exe");
        fs::create_dir_all(&folder).unwrap();
        let data = folder.join("Project2C-data");
        link_folder(&root.join("other"), &data);
        link_folder(&data, &root.join("other"));
        // Windows: os error 1921; macOS: `ELOOP`.
        assert_ne!(fs::metadata(&data).unwrap_err().kind(), ErrorKind::NotFound);
        let chosen = launch(true, false, folder.join("project2c.exe")).and_then(choose_data_dir);
        assert_eq!(crate::opened_dir(chosen).unwrap_err(), DATA_DIR_UNREACHABLE);
    }

    #[cfg(windows)]
    #[test]
    fn db_open_says_the_file_is_whole_when_project2c_data_leads_to_a_drive_not_ready() {
        // Windows `ERROR_NOT_READY`, which `std` sorts into no kind (review of PR 1362); 21 is
        // another error on macOS.
        let error = unreadable(io::Error::from_raw_os_error(21), || Ok(())).unwrap_err();
        assert_eq!(
            crate::opened_dir(Err(error)).unwrap_err(),
            DATA_DIR_UNREACHABLE
        );
    }

    #[test]
    fn only_a_release_exe_on_windows_looks_for_its_portable_folder() {
        // Its error is the data folder's, so the app does not start (L176); a debug build and
        // macOS never look, so the same link is no reason for them to fail.
        let root = temp_dir();
        let exe = beside_a_link_to_nowhere(&root);
        let failed = launch(true, false, exe.clone())
            .err()
            .map(|error| error.kind());
        assert_eq!(failed, Some(ErrorKind::NotFound));
        for (windows, debug) in [(true, true), (false, false), (false, true)] {
            assert!(!launch(windows, debug, exe.clone()).unwrap().portable);
        }
        let folder = root.join("exe");
        fs::create_dir_all(folder.join("Project2C-data")).unwrap();
        assert!(
            launch(true, false, folder.join("project2c.exe"))
                .unwrap()
                .portable
        );
        assert!(
            !launch(false, false, folder.join("project2c.exe"))
                .unwrap()
                .portable
        );
    }

    #[test]
    fn the_data_folder_of_a_run_depends_on_the_platform_and_the_build_it_runs() {
        // The line that ties the choice to this build: tests run a debug build, whose data folder
        // is the same on both platforms, so only what it passes on shows it (L188).
        let root = temp_dir();
        let this = this_build(root.join("project2c.exe")).unwrap();
        assert_eq!(
            (this.windows, this.debug),
            (cfg!(windows), cfg!(debug_assertions))
        );
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
