//! What the shell does differently on each platform (ADR-0019 §1): the data folder, showing a
//! folder or a page, the key store. Windows is `windows`; anything else is `macos`, the only other
//! platform the app is built for. Each one's pure parts (no system call) build in tests on every
//! platform, so both are checked wherever the tests run.

use std::io;
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

/// Shows `path` in Explorer, in Finder on macOS, without waiting (see [`spawn_unwaited`]).
pub fn open_folder(path: &Path) -> io::Result<()> {
    imp::open_folder(path)
}

/// Opens `url` in the default browser, without waiting (see [`spawn_unwaited`]).
pub fn open_url(url: &str) -> io::Result<()> {
    imp::open_url(url)
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
/// the program runs all the same, only its end is not collected.
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
