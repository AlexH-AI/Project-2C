//! What the shell does differently on each platform (ADR-0019 §1): the data folder and its lock,
//! what the system lets the app write there, showing a folder or a page, the key store. Windows is
//! `windows`; anything else is `macos`, the only other platform the app is built for. Each one's
//! pure parts (no system call) build in tests on every platform, so both are checked wherever the
//! tests run.

use std::fs;
use std::io::{self, ErrorKind};
use std::path::{Path, PathBuf};
use std::process::{Command, ExitStatus};
use std::thread;

#[cfg(any(not(windows), test))]
mod macos;
#[cfg(any(windows, test))]
mod windows;

#[cfg(not(windows))]
use macos as imp;
#[cfg(windows)]
use windows as imp;

/// The data folder: Windows `Project2C-data\` next to the exe (portable, ADR-0006); macOS
/// `~/Library/Application Support/<identifier>/` (ADR-0019 §2). The same files and subfolders in
/// both.
pub fn data_dir() -> io::Result<PathBuf> {
    imp::data_dir()
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

/// Whether the app must refuse itself to replace the file at `path`, which the system would
/// replace all the same: macOS's `rename` asks only the folder's write bits, so a database file
/// made read-only (no write bit) or locked would lose its data and its mark unseen (L76). Never on
/// Windows, which refuses to replace a read-only file itself, with `PermissionDenied`.
pub fn must_refuse_replacing(path: &Path) -> bool {
    imp::must_refuse_replacing(path)
}

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

    #[test]
    fn an_opener_that_cannot_start_is_an_error() {
        let missing = std::env::temp_dir().join("no-such-opener.exe");
        assert!(spawn_unwaited(&mut Command::new(missing)).is_err());
    }
}
