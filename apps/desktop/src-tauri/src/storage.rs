//! Database file storage for the exe (ADR-0016): `std` only, no extra crates.
//!
//! Layout next to the exe: `Project2C-data\project2c.db`, `project2c.lock`, `backups\`, `exports\`.

use std::ffi::OsString;
use std::fs;
use std::io::{self, ErrorKind, Read, Write};
use std::path::{Path, PathBuf};
use std::sync::{Mutex, MutexGuard};

pub const DATA_DIR: &str = "Project2C-data";
/// Error message when another process holds the data folder; the app matches it exactly.
pub const ALREADY_OPEN: &str = "ALREADY_OPEN";
/// Error message of a save from a page that a webview reload replaced.
pub const STALE_PAGE: &str = "STALE_PAGE";
/// Error message of a backup that found the disk full; the app matches it exactly.
pub const DISK_FULL: &str = "DISK_FULL";
const DB_FILE: &str = "project2c.db";
const LOCK_FILE: &str = "project2c.lock";
const BACKUP_DIR: &str = "backups";
const EXPORT_DIR: &str = "exports";
const BACKUP_PREFIX: &str = "project2c-";
const KEEP_BACKUPS: usize = 10;
/// The kinds of export: a backup (Settings → Data) and a report (Báo cáo → Xuất Excel).
const EXPORT_EXTENSIONS: [&str; 2] = [".p2cbackup", ".xlsx"];
/// How many `-n` suffixes an export tries before giving up.
const MAX_EXPORT_SUFFIX: u32 = 1000;
/// Digits of the write order in a backup name, zero-padded so the folder lists in order.
const SEQ_WIDTH: usize = 8;
const SQLITE_HEADER: &[u8] = b"SQLite format 3\0";
/// How much of a backup [`find_copy`] reads at a time.
const COMPARE_BLOCK: usize = 64 * 1024;

/// Keeps the data folder to one process, and the file commands of this process to one at a time.
/// The first [`open`] holds `project2c.lock` open without sharing until the process ends; Windows
/// releases it when the app closes or crashes, so the file is never removed. [`open`], [`save`]
/// and [`backup`] each hold the lock while they run: after a webview reload, the new page's
/// `open` waits for a save the old page started, and two saves or backups never share a `.tmp`.
/// A save of the old page that arrives after the new page's `open` is refused (see [`save`]).
pub struct DataLock(Mutex<Held>);

/// What [`DataLock`] guards.
struct Held {
    /// `project2c.lock`, from the first [`open`] on.
    file: Option<fs::File>,
    /// The page (webview load) of the last [`open`]: the only one whose saves are written.
    page: Option<String>,
}

impl DataLock {
    pub const fn new() -> Self {
        Self(Mutex::new(Held {
            file: None,
            page: None,
        }))
    }

    /// Waits for the file command running in this process, then holds off the others until the
    /// guard drops.
    fn hold(&self) -> MutexGuard<'_, Held> {
        self.0
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
    }
}

/// Opens the lock file without sharing. The app ships for Windows only (ADR-0006): elsewhere the
/// file is opened but locks nothing.
fn open_lock_file(path: &Path) -> io::Result<fs::File> {
    let mut options = fs::OpenOptions::new();
    options.read(true).write(true).create(true).truncate(false);
    #[cfg(windows)]
    {
        use std::os::windows::fs::OpenOptionsExt;
        options.share_mode(0);
    }
    options.open(path).map_err(|error| {
        // Windows `ERROR_SHARING_VIOLATION`.
        #[cfg(windows)]
        if error.raw_os_error() == Some(32) {
            return io::Error::new(ErrorKind::ResourceBusy, ALREADY_OPEN);
        }
        error
    })
}

/// Reads the database at startup; `None` on a first start (no file and no backups). The data
/// folder is locked first, so a second process touches nothing (see [`DataLock`]); later calls
/// from the same process (a webview reload) open again under the lock it holds. Another process
/// holding it → `ResourceBusy` with the message [`ALREADY_OPEN`]. A missing file with backups
/// left is an error, so the app never starts over them. A file that is empty or not SQLite is an
/// error, never a first start: the app would otherwise write a new database over it. Nothing is
/// backed up here: the app calls [`backup`] once it opened the file, before saving anything, so a
/// file damaged inside never becomes the newest backup (DR-51).
pub fn open(dir: &Path, page: &str, lock: &DataLock) -> io::Result<Option<Vec<u8>>> {
    let mut held = lock.hold();
    fs::create_dir_all(dir)?;
    if held.file.is_none() {
        held.file = Some(open_lock_file(&dir.join(LOCK_FILE))?);
        // What a crash left, cleaned by the first open of the process only: a reload's open must
        // keep an export still running, and never finds a save of the old page half done (it
        // waited for the lock). Cleaned before anything below can fail, since a retry holds the
        // lock already and skips this.
        remove_interrupted_exports(&dir.join(EXPORT_DIR));
        // A crash between writing and renaming; the database file itself is whole.
        remove_if_exists(&dir.join(tmp_name(DB_FILE)))?;
    }
    held.page = Some(page.to_owned());
    let backups = dir.join(BACKUP_DIR);
    let bytes = match fs::read(dir.join(DB_FILE)) {
        Ok(bytes) => bytes,
        // Backups but no file: the file was lost, and a new database would push them out.
        Err(error) if error.kind() == ErrorKind::NotFound && !backup_names(&backups).is_empty() => {
            return Err(io::Error::new(
                ErrorKind::NotFound,
                format!("{DB_FILE} is missing but {BACKUP_DIR} has copies"),
            ));
        }
        Err(error) if error.kind() == ErrorKind::NotFound => return Ok(None),
        Err(error) => return Err(error),
    };
    if !bytes.starts_with(SQLITE_HEADER) {
        return Err(io::Error::new(
            ErrorKind::InvalidData,
            format!("{DB_FILE} is not a SQLite database"),
        ));
    }
    Ok(Some(bytes))
}

/// Copies the saved database file into `backups\` (at startup once the app opened it, and before
/// replacing the data) and returns the backup's file name — an identical copy already there is
/// reused. A full disk → `StorageFull` with the message [`DISK_FULL`].
pub fn backup(dir: &Path, stamp: &str, lock: &DataLock) -> io::Result<String> {
    let _held = lock.hold();
    let bytes = fs::read(dir.join(DB_FILE))?;
    copy_to_backups(&dir.join(BACKUP_DIR), &bytes, stamp).map_err(disk_full)
}

/// Gives a full disk the message the app tells apart; any other error stays as it is.
fn disk_full(error: io::Error) -> io::Error {
    if error.kind() == ErrorKind::StorageFull {
        io::Error::new(ErrorKind::StorageFull, DISK_FULL)
    } else {
        error
    }
}

/// Writes `bytes` as the next backup, keeping the ten last written; returns the name of the copy.
/// Starts on a file that did not change must not push the older backups out, so an identical copy
/// is reused instead of written twice, and the backups are pruned again then: a prune another
/// program held off is retried (DR-31). The oldest backup goes before the copy is written, so a
/// nearly full disk needs room for one copy only (DR-57); a copy that still fails costs that one.
fn copy_to_backups(backups: &Path, bytes: &[u8], stamp: &str) -> io::Result<String> {
    if let Some(name) = find_copy(backups, bytes) {
        prune_backups(backups, KEEP_BACKUPS, Some(&name));
        return Ok(name);
    }
    prune_backups(backups, KEEP_BACKUPS - 1, None);
    let name = backup_name(next_seq(backups), stamp);
    write_atomic(backups, &name, bytes)?;
    Ok(name)
}

/// Replaces the database file atomically. A save from another page than the last [`open`]'s (one
/// still on its way from before a webview reload) is refused with [`STALE_PAGE`]: the new page
/// read the file without it, and its next save would write over it unseen.
pub fn save(dir: &Path, bytes: &[u8], page: &str, lock: &DataLock) -> io::Result<()> {
    let held = lock.hold();
    if held.page.as_deref().is_some_and(|opened| opened != page) {
        return Err(io::Error::other(STALE_PAGE));
    }
    write_atomic(dir, DB_FILE, bytes)
}

/// Writes an export file into `exports\` and returns its path. An earlier export is never
/// overwritten: a taken name gets `-2`, `-3`… before its extension (spec §6). The final name
/// appears only with the whole file in it; an interrupted export leaves just its `.claim` and
/// `.tmp`, which the next app start removes (see [`remove_interrupted_exports`]).
pub fn write_export(dir: &Path, name: &str, bytes: &[u8]) -> io::Result<PathBuf> {
    if !is_export_name(name) {
        return Err(io::Error::new(
            ErrorKind::InvalidInput,
            format!("invalid export name: {name}"),
        ));
    }
    let exports = dir.join(EXPORT_DIR);
    fs::create_dir_all(&exports)?;
    let free = claim_export_name(&exports, name)?;
    let claim = exports.join(claim_name(&free));
    // The claimed name is ours alone, so its `.tmp` is too, and nothing sits under it to replace.
    let result = write_atomic(&exports, &free, bytes);
    let _ = fs::remove_file(claim);
    result.map(|()| exports.join(free))
}

/// Takes the first name with neither a file nor a claim under it and returns it. The claim is an
/// empty `<name>.claim` made with `create_new`, so two exports at once never get the same name.
fn claim_export_name(exports: &Path, name: &str) -> io::Result<String> {
    let extension = export_extension(name).unwrap_or_default();
    let stem = &name[..name.len() - extension.len()];
    for n in 1..=MAX_EXPORT_SUFFIX {
        let candidate = if n == 1 {
            name.to_owned()
        } else {
            format!("{stem}-{n}{extension}")
        };
        let claim = exports.join(claim_name(&candidate));
        match fs::OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(&claim)
        {
            // A claim that cannot be removed (another program holds it) only keeps its name
            // taken; the next app start removes it.
            Ok(_) if fs::symlink_metadata(exports.join(&candidate)).is_ok() => {
                let _ = fs::remove_file(&claim);
            }
            Ok(_) => return Ok(candidate),
            // Windows reports a folder under that name as access denied, not as existing.
            Err(error)
                if error.kind() == ErrorKind::AlreadyExists
                    || fs::symlink_metadata(&claim).is_ok() => {}
            Err(error) => return Err(error),
        }
    }
    Err(io::Error::new(
        ErrorKind::AlreadyExists,
        format!("no free export name for {name}"),
    ))
}

fn claim_name(name: &str) -> String {
    format!("{name}.claim")
}

/// Removes what an export cut short by a crash left in `exports\`: claims and `.tmp` files. Runs
/// only when [`open`] takes the data lock for this process, before any
/// export of this process can start and while no other app instance can export. A webview reload
/// opens again under the lock already held and skips this, so an export still running keeps its
/// claim and `.tmp`. Best effort: a file another program holds stays until a later start.
fn remove_interrupted_exports(exports: &Path) {
    for entry in fs::read_dir(exports).into_iter().flatten().flatten() {
        let Ok(meta) = entry.metadata() else { continue };
        let name = entry.file_name().to_string_lossy().into_owned();
        let left = EXPORT_EXTENSIONS.iter().any(|extension| {
            name.ends_with(&format!("{extension}.claim"))
                || name.ends_with(&format!("{extension}.tmp"))
        });
        if left && meta.is_file() {
            let _ = fs::remove_file(entry.path());
        }
    }
}

/// Formats seconds since 1970 (already shifted to local time) as `YYYYMMDD-HHMMSS`.
pub fn stamp(local_secs: i64) -> String {
    let days = local_secs.div_euclid(86_400);
    let secs = local_secs.rem_euclid(86_400);
    let (year, month, day) = civil_from_days(days);
    format!(
        "{year:04}{month:02}{day:02}-{:02}{:02}{:02}",
        secs / 3600,
        secs % 3600 / 60,
        secs % 60
    )
}

/// Days since 1970-01-01 → (year, month, day); Howard Hinnant's `civil_from_days`.
fn civil_from_days(days: i64) -> (i64, i64, i64) {
    let z = days + 719_468;
    let era = z.div_euclid(146_097);
    let doe = z.rem_euclid(146_097);
    let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let day = doy - (153 * mp + 2) / 5 + 1;
    let month = if mp < 10 { mp + 3 } else { mp - 9 };
    let year = yoe + era * 400 + i64::from(month <= 2);
    (year, month, day)
}

fn tmp_name(name: &str) -> String {
    format!("{name}.tmp")
}

/// Writes `name.tmp`, flushes it to disk, then renames it over `name`: never a half-written file.
fn write_atomic(dir: &Path, name: &str, bytes: &[u8]) -> io::Result<()> {
    fs::create_dir_all(dir)?;
    let tmp = dir.join(tmp_name(name));
    let result = (|| {
        let mut file = fs::File::create(&tmp)?;
        file.write_all(bytes)?;
        file.sync_all()?;
        drop(file);
        fs::rename(&tmp, dir.join(name))
    })();
    if result.is_err() {
        let _ = fs::remove_file(&tmp);
    }
    result
}

fn remove_if_exists(path: &Path) -> io::Result<()> {
    match fs::remove_file(path) {
        Err(error) if error.kind() != ErrorKind::NotFound => Err(error),
        _ => Ok(()),
    }
}

/// `project2c-s<seq>-<stamp>.db`: `seq` is the write order and never comes from the clock; the
/// stamp is only for people reading the folder.
fn backup_name(seq: u64, stamp: &str) -> String {
    format!("{BACKUP_PREFIX}s{seq:0SEQ_WIDTH$}-{stamp}.db")
}

/// The write order of a backup name; `None` for any other name.
fn backup_seq(name: &str) -> Option<u64> {
    let rest = name.strip_prefix(BACKUP_PREFIX)?.strip_suffix(".db")?;
    let (seq, stamp) = rest.strip_prefix('s')?.split_once('-')?;
    if !all_digits(seq) || !is_stamp(stamp) {
        return None;
    }
    seq.parse().ok()
}

/// `YYYYMMDD-HHMMSS` as [`stamp`] makes it.
fn is_stamp(s: &str) -> bool {
    s.split_once('-').is_some_and(|(date, time)| {
        date.len() == 8 && time.len() == 6 && all_digits(date) && all_digits(time)
    })
}

/// The next write order: one past the highest numbered name in the folder (any entry, so a
/// folder squatting on a name is never overwritten); 1 when there is none.
fn next_seq(backups: &Path) -> u64 {
    fs::read_dir(backups)
        .into_iter()
        .flatten()
        .flatten()
        .filter_map(|entry| backup_seq(&entry.file_name().to_string_lossy()))
        .max()
        .map_or(1, |seq| seq.saturating_add(1))
}

fn all_digits(s: &str) -> bool {
    !s.is_empty() && s.bytes().all(|b| b.is_ascii_digit())
}

/// Our backups, oldest written first. Only files named like our backups count; anything else in
/// the folder is left alone, and an unreadable folder counts as empty.
fn backup_names(backups: &Path) -> Vec<String> {
    let mut names: Vec<String> = fs::read_dir(backups)
        .into_iter()
        .flatten()
        .flatten()
        .filter(|entry| entry.file_type().is_ok_and(|kind| kind.is_file()))
        .map(|entry| entry.file_name().to_string_lossy().into_owned())
        .filter(|name| backup_seq(name).is_some())
        .collect();
    names.sort_by_key(|name| backup_seq(name));
    names
}

/// The name of the last written backup (Settings → Data); `None` when there is none.
pub fn latest_backup(dir: &Path) -> Option<String> {
    backup_names(&dir.join(BACKUP_DIR)).pop()
}

/// The folder Settings → Data opens, created if missing. Only `exports` and `backups`: the
/// webview never names a path.
pub fn folder(dir: &Path, kind: &str) -> io::Result<PathBuf> {
    let name = match kind {
        "exports" => EXPORT_DIR,
        "backups" => BACKUP_DIR,
        _ => {
            return Err(io::Error::new(
                ErrorKind::InvalidInput,
                format!("unknown folder: {kind}"),
            ))
        }
    };
    let path = dir.join(name);
    fs::create_dir_all(&path)?;
    Ok(path)
}

/// The command-line argument that makes Explorer show `path`. Always quoted and passed raw:
/// `std` quotes an argument only when it has a space or tab, and Explorer splits an unquoted one
/// at commas (`/select,…`), so `D:\Apps\P2C,v2\…` opened Documents instead. A Windows path
/// never contains `"`, so nothing inside needs escaping.
pub fn explorer_arg(path: &Path) -> OsString {
    let mut arg = OsString::from("\"");
    arg.push(path);
    arg.push("\"");
    arg
}

/// Explorer by its full path in `system_root` (`%SystemRoot%`): a bare name is looked up in the
/// exe's folder first, so an `explorer.exe` put next to the portable exe would run instead (DR-54).
pub fn explorer(system_root: Option<OsString>) -> io::Result<PathBuf> {
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

/// The newest backup with the same bytes. An unchanged file matches the newest, so it is tried
/// first; each one is read a block at a time and left at its first difference, since backups of
/// the same size usually differ in the header already (DR-53).
fn find_copy(backups: &Path, bytes: &[u8]) -> Option<String> {
    backup_names(backups)
        .into_iter()
        .rev()
        .find(|name| has_same_bytes(&backups.join(name), bytes).unwrap_or(false))
}

/// Whether the file at `path` has exactly `bytes` in it.
fn has_same_bytes(path: &Path, bytes: &[u8]) -> io::Result<bool> {
    let mut file = fs::File::open(path)?;
    if file.metadata()?.len() != bytes.len() as u64 {
        return Ok(false);
    }
    let mut block = vec![0; COMPARE_BLOCK];
    for expected in bytes.chunks(COMPARE_BLOCK) {
        let read = &mut block[..expected.len()];
        file.read_exact(read)?;
        if read != expected {
            return Ok(false);
        }
    }
    Ok(true)
}

/// Deletes the oldest written backups until `count` remain, never `keep` (the copy reused).
/// Best effort, so it never blocks startup: a backup another program holds open stays, and a
/// later start tries again.
fn prune_backups(backups: &Path, count: usize, keep: Option<&str>) {
    let names = backup_names(backups);
    let mut excess = names.len().saturating_sub(count);
    for name in names.iter().filter(|name| Some(name.as_str()) != keep) {
        if excess == 0 {
            break;
        }
        if fs::remove_file(backups.join(name)).is_ok() {
            excess -= 1;
        }
    }
}

/// The extension of an export file name, `None` for any other name.
fn export_extension(name: &str) -> Option<&'static str> {
    EXPORT_EXTENSIONS
        .into_iter()
        .find(|extension| name.ends_with(extension))
}

fn is_export_name(name: &str) -> bool {
    export_extension(name).is_some_and(|extension| name.len() > extension.len())
        && !name.starts_with('.')
        && name
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || matches!(c, '-' | '_' | '.'))
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::atomic::{AtomicUsize, Ordering};

    fn temp_dir() -> PathBuf {
        static NEXT: AtomicUsize = AtomicUsize::new(0);
        let n = NEXT.fetch_add(1, Ordering::Relaxed);
        let dir = std::env::temp_dir().join(format!("p2c-storage-{}-{n}", std::process::id()));
        let _ = fs::remove_dir_all(&dir);
        dir
    }

    fn names(dir: &Path) -> Vec<String> {
        let mut names: Vec<String> = fs::read_dir(dir)
            .unwrap()
            .map(|e| e.unwrap().file_name().into_string().unwrap())
            .collect();
        names.sort();
        names
    }

    /// `open` as one process start: a fresh lock, released when the call returns.
    fn open(dir: &Path) -> io::Result<Option<Vec<u8>>> {
        super::open(dir, PAGE, &DataLock::new())
    }

    fn save(dir: &Path, bytes: &[u8]) -> io::Result<()> {
        super::save(dir, bytes, PAGE, &DataLock::new())
    }

    fn backup(dir: &Path, stamp: &str) -> io::Result<String> {
        super::backup(dir, stamp, &DataLock::new())
    }

    /// The page (webview load) the tests open and save from.
    const PAGE: &str = "page-1";

    /// Long enough for a command that is not held off to finish on any disk.
    const HELD_OFF: std::time::Duration = std::time::Duration::from_millis(200);

    #[test]
    fn each_file_command_waits_while_another_one_runs() {
        let dir = temp_dir();
        let lock = DataLock::new();
        super::save(&dir, &db("before"), PAGE, &lock).unwrap();
        let commands: [(&str, &(dyn Fn() -> io::Result<()> + Sync)); 3] = [
            ("save", &|| super::save(&dir, &db("after"), PAGE, &lock)),
            ("backup", &|| {
                super::backup(&dir, "20261006-080000", &lock).map(drop)
            }),
            ("open", &|| super::open(&dir, PAGE, &lock).map(drop)),
        ];
        for (name, command) in commands {
            std::thread::scope(|scope| {
                let running = lock.hold();
                let waiting = scope.spawn(command);
                std::thread::sleep(HELD_OFF);
                assert!(!waiting.is_finished(), "{name} ran while held off");
                drop(running);
                waiting.join().unwrap().unwrap();
            });
        }
    }

    #[test]
    fn two_saves_at_once_never_mix_their_files() {
        let dir = temp_dir();
        let lock = DataLock::new();
        let writers = 8;
        let barrier = std::sync::Barrier::new(writers);
        for _ in 0..3 {
            std::thread::scope(|scope| {
                for n in 0..writers {
                    let (dir, lock, barrier) = (&dir, &lock, &barrier);
                    scope.spawn(move || {
                        let bytes = vec![b'a' + n as u8; 1 << 20];
                        barrier.wait();
                        super::save(dir, &bytes, PAGE, lock).unwrap();
                    });
                }
            });
            let file = fs::read(dir.join(DB_FILE)).unwrap();
            assert_eq!(file.len(), 1 << 20);
            assert!(file.iter().all(|byte| *byte == file[0]), "mixed file");
            assert_eq!(names(&dir), vec![DB_FILE]);
        }
    }

    #[test]
    fn two_backups_at_once_write_one_copy() {
        let dir = temp_dir();
        let lock = DataLock::new();
        save(&dir, &db("data")).unwrap();
        let barrier = std::sync::Barrier::new(2);
        let copies: Vec<String> = std::thread::scope(|scope| {
            let threads: Vec<_> = ["20261006-080000", "20261006-080001"]
                .into_iter()
                .map(|stamp| {
                    let (dir, lock, barrier) = (&dir, &lock, &barrier);
                    scope.spawn(move || {
                        barrier.wait();
                        super::backup(dir, stamp, lock).unwrap()
                    })
                })
                .collect();
            threads.into_iter().map(|t| t.join().unwrap()).collect()
        });
        assert_eq!(copies[0], copies[1]);
        assert_eq!(names(&dir.join(BACKUP_DIR)), vec![copies[0].clone()]);
    }

    /// A database file whose content is `tag` after the SQLite header.
    fn db(tag: &str) -> Vec<u8> {
        [b"SQLite format 3\0".as_slice(), tag.as_bytes()].concat()
    }

    /// Ten starts on ten different files: backups `project2c-s<1..10>-202609<10..19>-080000.db`.
    fn ten_backups(dir: &Path) {
        for day in 10..20 {
            save(dir, &db(&format!("day {day}"))).unwrap();
            backup(dir, &format!("202609{day}-080000")).unwrap();
        }
    }

    #[test]
    fn open_without_a_file_creates_the_folder_and_returns_none() {
        let dir = temp_dir();
        assert_eq!(open(&dir).unwrap(), None);
        assert!(dir.is_dir());
        assert!(!dir.join(BACKUP_DIR).exists());
    }

    #[test]
    fn save_then_open_returns_the_saved_bytes_and_leaves_no_tmp_file() {
        let dir = temp_dir();
        save(&dir, &db("first")).unwrap();
        save(&dir, &db("second")).unwrap();
        assert_eq!(names(&dir), vec![DB_FILE]);
        assert_eq!(open(&dir).unwrap(), Some(db("second")));
    }

    #[test]
    fn open_leaves_the_backup_to_the_app_once_it_opened_the_file() {
        // A file damaged inside still has the SQLite header: only the app can tell, so the app
        // backs it up after opening it (DR-51), and a damaged file never becomes the newest copy.
        let dir = temp_dir();
        save(&dir, &db("data")).unwrap();
        assert_eq!(open(&dir).unwrap(), Some(db("data")));
        assert!(!dir.join(BACKUP_DIR).exists());
    }

    #[test]
    fn backup_copies_the_saved_file_and_returns_its_name() {
        let dir = temp_dir();
        save(&dir, &db("before reload")).unwrap();
        let name = backup(&dir, "20260927-101500").unwrap();
        assert_eq!(name, "project2c-s00000001-20260927-101500.db");
        assert_eq!(
            fs::read(dir.join(BACKUP_DIR).join(&name)).unwrap(),
            db("before reload")
        );
    }

    #[test]
    fn backup_of_an_already_copied_file_returns_the_existing_copy() {
        let dir = temp_dir();
        save(&dir, &db("data")).unwrap();
        backup(&dir, "20260927-080000").unwrap();
        assert_eq!(
            backup(&dir, "20260927-101500").unwrap(),
            "project2c-s00000001-20260927-080000.db"
        );
        assert_eq!(
            names(&dir.join(BACKUP_DIR)),
            vec!["project2c-s00000001-20260927-080000.db"]
        );
    }

    #[test]
    fn backup_keeps_only_the_ten_newest_backups() {
        let dir = temp_dir();
        ten_backups(&dir);
        save(&dir, &db("before reload")).unwrap();
        backup(&dir, "20260927-101500").unwrap();
        let kept = names(&dir.join(BACKUP_DIR));
        assert_eq!(kept.len(), 10);
        assert_eq!(kept[9], "project2c-s00000011-20260927-101500.db");
    }

    #[test]
    fn backup_reusing_a_copy_still_keeps_only_the_ten_newest() {
        // Eleven left by a prune another program held off: the next start on an unchanged file
        // reuses its copy and prunes again (DR-31).
        let dir = temp_dir();
        ten_backups(&dir);
        let backups = dir.join(BACKUP_DIR);
        let eleventh = backup_name(11, "20260927-080000");
        fs::write(backups.join(&eleventh), db("latest")).unwrap();
        save(&dir, &db("latest")).unwrap();
        assert_eq!(backup(&dir, "20260927-090000").unwrap(), eleventh);
        let kept = backup_names(&backups);
        assert_eq!(kept.len(), 10);
        assert_eq!(kept[0], "project2c-s00000002-20260911-080000.db");
    }

    #[test]
    fn backup_reusing_the_oldest_copy_keeps_it_and_prunes_the_next() {
        let dir = temp_dir();
        ten_backups(&dir);
        let backups = dir.join(BACKUP_DIR);
        fs::write(
            backups.join(backup_name(11, "20260927-080000")),
            db("latest"),
        )
        .unwrap();
        save(&dir, &db("day 10")).unwrap();
        let oldest = "project2c-s00000001-20260910-080000.db";
        assert_eq!(backup(&dir, "20260927-090000").unwrap(), oldest);
        let kept = backup_names(&backups);
        assert_eq!(kept.len(), 10);
        assert_eq!(kept[0], oldest);
        assert_eq!(kept[1], "project2c-s00000003-20260912-080000.db");
    }

    #[test]
    fn backup_makes_room_before_it_writes_the_copy() {
        // A nearly full disk then only needs room for the copy over the one it replaces (DR-57).
        let dir = temp_dir();
        ten_backups(&dir);
        let backups = dir.join(BACKUP_DIR);
        // A folder under the copy's `.tmp` name makes the write fail, like a full disk.
        let tmp = tmp_name(&backup_name(11, "20260927-080000"));
        fs::create_dir_all(backups.join(&tmp)).unwrap();
        save(&dir, &db("latest")).unwrap();
        assert!(backup(&dir, "20260927-080000").is_err());
        let kept = backup_names(&backups);
        assert_eq!(kept.len(), 9);
        assert_eq!(kept[0], "project2c-s00000002-20260911-080000.db");
    }

    #[test]
    fn a_full_disk_is_reported_as_disk_full() {
        let full = disk_full(io::Error::from(ErrorKind::StorageFull));
        assert_eq!(full.kind(), ErrorKind::StorageFull);
        assert_eq!(full.to_string(), DISK_FULL);
        // Windows `ERROR_HANDLE_DISK_FULL` and `ERROR_DISK_FULL`.
        #[cfg(windows)]
        for code in [39, 112] {
            let full = disk_full(io::Error::from_raw_os_error(code));
            assert_eq!(full.to_string(), DISK_FULL, "os error {code}");
        }
        let other = disk_full(io::Error::from(ErrorKind::PermissionDenied));
        assert_eq!(other.kind(), ErrorKind::PermissionDenied);
        assert_ne!(other.to_string(), DISK_FULL);
    }

    #[test]
    fn backup_of_a_file_of_the_same_size_that_differs_only_at_the_end_writes_a_copy() {
        // Compared block by block (DR-53): a partial last block and a late difference still count.
        let dir = temp_dir();
        let mut bytes = db(&"x".repeat(3 * COMPARE_BLOCK));
        save(&dir, &bytes).unwrap();
        let first = backup(&dir, "20261006-080000").unwrap();
        *bytes.last_mut().unwrap() = b'y';
        save(&dir, &bytes).unwrap();
        let second = backup(&dir, "20261006-080001").unwrap();
        assert_ne!(second, first);
        assert_eq!(fs::read(dir.join(BACKUP_DIR).join(second)).unwrap(), bytes);
    }

    #[test]
    fn backup_without_a_file_is_an_error() {
        let dir = temp_dir();
        fs::create_dir_all(&dir).unwrap();
        assert_eq!(
            backup(&dir, "20260927-101500").unwrap_err().kind(),
            ErrorKind::NotFound
        );
    }

    #[test]
    fn backups_keep_the_ten_newest_and_leave_other_files_alone() {
        let dir = temp_dir();
        let backups = dir.join(BACKUP_DIR);
        fs::create_dir_all(&backups).unwrap();
        fs::write(backups.join("notes.txt"), b"not a backup").unwrap();
        for day in 10..22 {
            save(&dir, &db(&format!("day {day}"))).unwrap();
            backup(&dir, &format!("202609{day}-080000")).unwrap();
        }
        let kept = names(&backups);
        assert_eq!(kept.len(), 11);
        assert_eq!(kept[0], "notes.txt");
        assert_eq!(kept[1], "project2c-s00000003-20260912-080000.db");
        assert_eq!(kept[10], "project2c-s00000012-20260921-080000.db");
    }

    #[test]
    fn backup_prunes_only_backups_it_named() {
        let dir = temp_dir();
        let backups = dir.join(BACKUP_DIR);
        fs::create_dir_all(backups.join("project2c-20260101-000000.db")).unwrap();
        let foreign = [
            // Named before write order existed (R2-02: no longer read as backups).
            "project2c-20260101-080000.db",
            "project2c-000-important.db",
            "project2c-notes.db",
            "project2c-20260101-00000x.db",
            "project2c-20260101-000000-x.db",
            "project2c-20260101-000000-0.db",
            "project2c-s-20260101-000000.db",
            "project2c-s1x-20260101-000000.db",
            "project2c-s00000099-20260101.db",
            "project2c-s00000099-20260101-000000-1.db",
        ];
        for name in foreign {
            fs::write(backups.join(name), b"keep").unwrap();
        }
        for day in 10..22 {
            save(&dir, &db(&format!("day {day}"))).unwrap();
            backup(&dir, &format!("202609{day}-080000")).unwrap();
        }
        let kept = names(&backups);
        assert_eq!(kept.len(), 21);
        for name in foreign {
            assert_eq!(fs::read(backups.join(name)).unwrap(), b"keep", "{name}");
        }
        assert!(backups.join("project2c-20260101-000000.db").is_dir());
        assert!(backups
            .join("project2c-s00000003-20260912-080000.db")
            .exists());
        assert!(!backups
            .join("project2c-s00000002-20260911-080000.db")
            .exists());
    }

    #[test]
    fn two_backups_in_the_same_second_are_both_kept() {
        let dir = temp_dir();
        let backups = dir.join(BACKUP_DIR);
        for version in ["a", "b", "c"] {
            save(&dir, &db(version)).unwrap();
            backup(&dir, "20260927-080000").unwrap();
        }
        assert_eq!(
            fs::read(backups.join("project2c-s00000001-20260927-080000.db")).unwrap(),
            db("a")
        );
        assert_eq!(
            fs::read(backups.join("project2c-s00000002-20260927-080000.db")).unwrap(),
            db("b")
        );
        assert_eq!(
            fs::read(backups.join("project2c-s00000003-20260927-080000.db")).unwrap(),
            db("c")
        );
        // Eight later backups push out one: the first written in that second.
        for day in 10..18 {
            save(&dir, &db(&format!("day {day}"))).unwrap();
            backup(&dir, &format!("202610{day}-080000")).unwrap();
        }
        assert!(!backups
            .join("project2c-s00000001-20260927-080000.db")
            .exists());
        assert!(backups
            .join("project2c-s00000002-20260927-080000.db")
            .exists());
    }

    #[test]
    fn open_refuses_an_empty_database_file() {
        let dir = temp_dir();
        save(&dir, b"").unwrap();
        let error = open(&dir).unwrap_err();
        assert_eq!(error.kind(), ErrorKind::InvalidData);
        assert!(!dir.join(BACKUP_DIR).exists());
    }

    #[test]
    fn open_refuses_a_file_that_is_not_sqlite_without_touching_the_backups() {
        let dir = temp_dir();
        ten_backups(&dir);
        let before = names(&dir.join(BACKUP_DIR));
        save(&dir, b"not a database").unwrap();
        let error = open(&dir).unwrap_err();
        assert_eq!(error.kind(), ErrorKind::InvalidData);
        assert_eq!(names(&dir.join(BACKUP_DIR)), before);
    }

    #[test]
    fn restarts_on_an_unchanged_file_keep_the_older_backups() {
        // Every start backs the file up once the app opened it: starts that changed nothing must
        // not push out the older backups.
        let dir = temp_dir();
        ten_backups(&dir);
        save(&dir, &db("damaged")).unwrap();
        for minute in 10..20 {
            backup(&dir, &format!("20260927-08{minute}00")).unwrap();
        }
        let backups = dir.join(BACKUP_DIR);
        let kept = names(&backups);
        assert_eq!(kept.len(), 10);
        let damaged = kept
            .iter()
            .filter(|name| fs::read(backups.join(name)).unwrap() == db("damaged"))
            .count();
        assert_eq!(damaged, 1);
    }

    #[test]
    fn a_missing_file_with_backups_left_is_an_error_not_a_first_start() {
        // Quarantined or deleted by mistake: a new database would push the backups out.
        let dir = temp_dir();
        ten_backups(&dir);
        let before = names(&dir.join(BACKUP_DIR));
        fs::remove_file(dir.join(DB_FILE)).unwrap();
        let error = open(&dir).unwrap_err();
        assert_eq!(error.kind(), ErrorKind::NotFound);
        assert_eq!(names(&dir.join(BACKUP_DIR)), before);
        assert!(!dir.join(DB_FILE).exists());
    }

    #[test]
    fn a_missing_file_with_only_foreign_files_in_backups_is_a_first_start() {
        let dir = temp_dir();
        let backups = dir.join(BACKUP_DIR);
        fs::create_dir_all(&backups).unwrap();
        fs::write(backups.join("notes.txt"), b"not a backup").unwrap();
        assert_eq!(open(&dir).unwrap(), None);
    }

    #[test]
    fn a_backup_made_with_the_clock_set_back_is_kept() {
        let dir = temp_dir();
        ten_backups(&dir);
        save(&dir, &db("latest")).unwrap();
        backup(&dir, "20250101-080000").unwrap();
        let backups = dir.join(BACKUP_DIR);
        assert_eq!(names(&backups).len(), 10);
        assert_eq!(
            fs::read(backups.join("project2c-s00000011-20250101-080000.db")).unwrap(),
            db("latest")
        );
    }

    #[test]
    fn a_clock_going_back_and_forth_keeps_the_ten_last_written_backups() {
        let dir = temp_dir();
        let stamps = [
            "20260927-080000",
            "20000101-000000",
            "20260101-120000",
            "19991231-235959",
            "20260927-080000",
            "20301231-000000",
            "20000101-000000",
            "20100505-050505",
            "20260926-080000",
            "20000102-000000",
            "20260928-080000",
            "19990101-000000",
            "20260927-075959",
            "20000101-000000",
            "20150615-101010",
        ];
        for (i, stamp) in stamps.iter().enumerate() {
            save(&dir, &db(&format!("start {i}"))).unwrap();
            backup(&dir, stamp).unwrap();
        }
        let expected: Vec<String> = (1..)
            .zip(stamps)
            .skip(stamps.len() - KEEP_BACKUPS)
            .map(|(seq, stamp)| backup_name(seq, stamp))
            .collect();
        assert_eq!(backup_names(&dir.join(BACKUP_DIR)), expected);
        // Zero-padded write order also lists the folder in order.
        assert_eq!(names(&dir.join(BACKUP_DIR)), expected);
    }

    #[test]
    fn next_seq_is_one_past_the_highest_numbered_backup() {
        let dir = temp_dir();
        assert_eq!(next_seq(&dir), 1);
        fs::create_dir_all(&dir).unwrap();
        assert_eq!(next_seq(&dir), 1);
        fs::write(dir.join("project2c-s00000077-2026.db"), b"foreign").unwrap();
        assert_eq!(next_seq(&dir), 1);
        // Lower numbers already pruned: counting goes on from the highest left.
        fs::write(dir.join(backup_name(5, "20260927-080000")), b"x").unwrap();
        fs::write(dir.join(backup_name(9, "20000101-000000")), b"x").unwrap();
        assert_eq!(next_seq(&dir), 10);
        // A folder squatting on a numbered name is never written over.
        fs::create_dir_all(dir.join(backup_name(12, "20000101-000000"))).unwrap();
        assert_eq!(next_seq(&dir), 13);
    }

    #[cfg(windows)]
    #[test]
    fn a_locked_old_backup_does_not_block_a_backup() {
        use std::os::windows::fs::OpenOptionsExt;
        let dir = temp_dir();
        ten_backups(&dir);
        let backups = dir.join(BACKUP_DIR);
        let oldest = backups.join("project2c-s00000001-20260910-080000.db");
        // Another program (a SQLite browser, an antivirus scan) holds the file open.
        let _lock = fs::OpenOptions::new()
            .read(true)
            .share_mode(0)
            .open(&oldest)
            .unwrap();
        save(&dir, &db("latest")).unwrap();
        assert_eq!(
            backup(&dir, "20260927-080000").unwrap(),
            "project2c-s00000011-20260927-080000.db"
        );
        assert_eq!(names(&backups).len(), 10);
        assert!(oldest.exists());
        assert!(!backups
            .join("project2c-s00000002-20260911-080000.db")
            .exists());
    }

    #[cfg(windows)]
    #[test]
    fn a_prune_held_off_is_done_by_the_next_backup_of_the_unchanged_file() {
        use std::os::windows::fs::OpenOptionsExt;
        let dir = temp_dir();
        ten_backups(&dir);
        let backups = dir.join(BACKUP_DIR);
        // Every older backup is held open by another program, so none of them can go.
        let held: Vec<fs::File> = names(&backups)
            .iter()
            .map(|name| {
                fs::OpenOptions::new()
                    .read(true)
                    .share_mode(0)
                    .open(backups.join(name))
                    .unwrap()
            })
            .collect();
        save(&dir, &db("latest")).unwrap();
        let name = backup(&dir, "20260927-080000").unwrap();
        assert_eq!(fs::read(backups.join(&name)).unwrap(), db("latest"));
        assert_eq!(names(&backups).len(), 11);

        // Released: the next start on the unchanged file prunes again (DR-31).
        drop(held);
        assert_eq!(backup(&dir, "20260927-090000").unwrap(), name);
        let kept = names(&backups);
        assert_eq!(kept.len(), 10);
        assert_eq!(kept[0], "project2c-s00000002-20260911-080000.db");
    }

    #[cfg(windows)]
    #[test]
    fn open_while_another_process_holds_the_lock_touches_nothing() {
        use std::os::windows::fs::OpenOptionsExt;
        let dir = temp_dir();
        save(&dir, &db("changed")).unwrap();
        let other = fs::OpenOptions::new()
            .read(true)
            .write(true)
            .create(true)
            .truncate(false)
            .share_mode(0)
            .open(dir.join(LOCK_FILE))
            .unwrap();
        fs::write(dir.join("project2c.db.tmp"), b"being written").unwrap();

        let error = open(&dir).unwrap_err();
        assert_eq!(error.kind(), ErrorKind::ResourceBusy);
        assert_eq!(error.to_string(), ALREADY_OPEN);
        assert_eq!(fs::read(dir.join(DB_FILE)).unwrap(), db("changed"));
        assert_eq!(
            fs::read(dir.join("project2c.db.tmp")).unwrap(),
            b"being written"
        );

        drop(other);
        assert_eq!(open(&dir).unwrap(), Some(db("changed")));
        assert!(!dir.join("project2c.db.tmp").exists());
    }

    #[cfg(windows)]
    #[test]
    fn open_keeps_the_lock_and_does_not_lock_itself_out() {
        let dir = temp_dir();
        let lock = DataLock::new();
        save(&dir, &db("data")).unwrap();
        assert_eq!(super::open(&dir, PAGE, &lock).unwrap(), Some(db("data")));
        // Same process again (a webview reload): still opens.
        assert_eq!(super::open(&dir, PAGE, &lock).unwrap(), Some(db("data")));
        // A second process is refused while the first one runs.
        assert_eq!(open(&dir).unwrap_err().to_string(), ALREADY_OPEN);
        drop(lock);
        assert!(open(&dir).is_ok());
    }

    #[test]
    fn open_removes_a_tmp_file_left_by_a_crash() {
        let dir = temp_dir();
        save(&dir, &db("data")).unwrap();
        fs::write(dir.join("project2c.db.tmp"), b"half").unwrap();
        assert_eq!(open(&dir).unwrap(), Some(db("data")));
        assert!(!dir.join("project2c.db.tmp").exists());
    }

    #[cfg(windows)]
    #[test]
    fn a_save_whose_rename_fails_keeps_the_old_file_byte_for_byte() {
        use std::os::windows::fs::OpenOptionsExt;
        let dir = temp_dir();
        save(&dir, &db("old")).unwrap();
        // Another program holds the `.tmp` without letting it be renamed (no share delete): the
        // new bytes are written, the rename fails.
        let tmp = dir.join("project2c.db.tmp");
        let holder = fs::OpenOptions::new()
            .read(true)
            .write(true)
            .create(true)
            .truncate(false)
            .share_mode(1 | 2)
            .open(&tmp)
            .unwrap();
        assert!(save(&dir, &db("new")).is_err());
        assert_eq!(fs::read(dir.join(DB_FILE)).unwrap(), db("old"));

        drop(holder);
        save(&dir, &db("new")).unwrap();
        assert_eq!(fs::read(dir.join(DB_FILE)).unwrap(), db("new"));
        assert_eq!(names(&dir), vec![DB_FILE]);
    }

    #[test]
    fn a_save_that_fails_leaves_no_tmp_behind() {
        // A folder under the database's name: the write succeeds, the rename over it fails.
        let dir = temp_dir();
        fs::create_dir_all(dir.join(DB_FILE)).unwrap();
        fs::write(dir.join(DB_FILE).join("inside"), b"kept").unwrap();
        assert!(save(&dir, &db("new")).is_err());
        assert_eq!(names(&dir), vec![DB_FILE]);
        assert_eq!(fs::read(dir.join(DB_FILE).join("inside")).unwrap(), b"kept");
    }

    #[test]
    fn a_save_from_the_page_before_a_reload_is_refused_once_the_new_page_opened() {
        // A save still on its way from the old page must not land over the file the new page
        // read and shows: the new page's next save would write over it unseen.
        let dir = temp_dir();
        let lock = DataLock::new();
        super::save(&dir, &db("first"), "old", &lock).unwrap();
        super::open(&dir, "old", &lock).unwrap();
        super::save(&dir, &db("old page"), "old", &lock).unwrap();

        assert_eq!(
            super::open(&dir, "new", &lock).unwrap(),
            Some(db("old page"))
        );
        let error = super::save(&dir, &db("late"), "old", &lock).unwrap_err();
        assert_eq!(error.to_string(), STALE_PAGE);
        assert_eq!(fs::read(dir.join(DB_FILE)).unwrap(), db("old page"));
        assert_eq!(names(&dir), vec![DB_FILE, LOCK_FILE]);

        super::save(&dir, &db("new page"), "new", &lock).unwrap();
        assert_eq!(fs::read(dir.join(DB_FILE)).unwrap(), db("new page"));
    }

    #[test]
    fn open_again_in_the_same_process_leaves_the_db_tmp_alone() {
        // Only the first open of a process cleans up after a crash (DR-01).
        let dir = temp_dir();
        let lock = DataLock::new();
        super::save(&dir, &db("data"), PAGE, &lock).unwrap();
        super::open(&dir, PAGE, &lock).unwrap();
        fs::write(dir.join("project2c.db.tmp"), b"being written").unwrap();
        assert_eq!(super::open(&dir, PAGE, &lock).unwrap(), Some(db("data")));
        assert_eq!(
            fs::read(dir.join("project2c.db.tmp")).unwrap(),
            b"being written"
        );
    }

    #[test]
    fn write_export_writes_into_exports_and_rejects_unsafe_names() {
        let dir = temp_dir();
        let path = write_export(&dir, "project2c-20260927.p2cbackup", b"x").unwrap();
        assert_eq!(
            path,
            dir.join(EXPORT_DIR).join("project2c-20260927.p2cbackup")
        );
        assert_eq!(fs::read(&path).unwrap(), b"x");
        for name in [
            "",
            "..\\evil.p2cbackup",
            // Starts like a plain name: only the character rule stops the path.
            r"x\..\..\evil.p2cbackup",
            "a/b.p2cbackup",
            ".p2cbackup",
            "a.db",
        ] {
            let error = write_export(&dir, name, b"x").unwrap_err();
            assert_eq!(error.kind(), ErrorKind::InvalidInput, "{name}");
        }
    }

    #[test]
    fn write_export_never_overwrites_an_earlier_export() {
        let dir = temp_dir();
        let name = "project2c-20260930-0745.p2cbackup";
        let first = write_export(&dir, name, b"first").unwrap();
        let second = write_export(&dir, name, b"second").unwrap();
        let third = write_export(&dir, name, b"third").unwrap();
        let exports = dir.join(EXPORT_DIR);
        assert_eq!(first, exports.join(name));
        assert_eq!(second, exports.join("project2c-20260930-0745-2.p2cbackup"));
        assert_eq!(third, exports.join("project2c-20260930-0745-3.p2cbackup"));
        assert_eq!(fs::read(&first).unwrap(), b"first");
        assert_eq!(fs::read(&second).unwrap(), b"second");
        assert_eq!(fs::read(&third).unwrap(), b"third");
        let mut left: Vec<_> = fs::read_dir(&exports)
            .unwrap()
            .map(|entry| entry.unwrap().file_name().into_string().unwrap())
            .collect();
        left.sort();
        assert_eq!(left.len(), 3, "no .tmp left behind: {left:?}");
    }

    #[test]
    fn write_export_takes_a_report_and_suffixes_it_before_xlsx() {
        let dir = temp_dir();
        let name = "bao-cao_2026-10_toan-bo_2026-10-15.xlsx";
        let first = write_export(&dir, name, b"first").unwrap();
        let second = write_export(&dir, name, b"second").unwrap();
        let exports = dir.join(EXPORT_DIR);
        assert_eq!(first, exports.join(name));
        assert_eq!(
            second,
            exports.join("bao-cao_2026-10_toan-bo_2026-10-15-2.xlsx")
        );
        assert_eq!(fs::read(&first).unwrap(), b"first");
        for name in [".xlsx", "a.xls", "a.xlsx.exe", "a b.xlsx"] {
            let error = write_export(&dir, name, b"x").unwrap_err();
            assert_eq!(error.kind(), ErrorKind::InvalidInput, "{name}");
        }
    }

    #[test]
    fn write_export_skips_a_name_taken_by_a_folder() {
        let dir = temp_dir();
        let exports = dir.join(EXPORT_DIR);
        fs::create_dir_all(exports.join("a.p2cbackup")).unwrap();
        let path = write_export(&dir, "a.p2cbackup", b"x").unwrap();
        assert_eq!(path, exports.join("a-2.p2cbackup"));
        assert_eq!(fs::read(&path).unwrap(), b"x");
    }

    #[test]
    fn write_export_skips_a_name_whose_claim_is_taken_by_a_folder() {
        // Windows reports the folder as access denied, not as existing.
        let dir = temp_dir();
        let exports = dir.join(EXPORT_DIR);
        fs::create_dir_all(exports.join("a.p2cbackup.claim")).unwrap();
        let path = write_export(&dir, "a.p2cbackup", b"x").unwrap();
        assert_eq!(path, exports.join("a-2.p2cbackup"));
        assert_eq!(fs::read(&path).unwrap(), b"x");
    }

    #[test]
    fn write_export_leaves_no_claim_behind() {
        let dir = temp_dir();
        write_export(&dir, "a.p2cbackup", b"x").unwrap();
        assert_eq!(names(&dir.join(EXPORT_DIR)), vec!["a.p2cbackup"]);
    }

    #[test]
    fn write_export_skips_a_name_whose_claim_is_left() {
        // Another export in this process holds the name, or a crash left its claim.
        let dir = temp_dir();
        let exports = dir.join(EXPORT_DIR);
        fs::create_dir_all(&exports).unwrap();
        fs::write(exports.join("a.p2cbackup.claim"), b"").unwrap();
        let path = write_export(&dir, "a.p2cbackup", b"x").unwrap();
        assert_eq!(path, exports.join("a-2.p2cbackup"));
        assert!(!exports.join("a.p2cbackup").exists());
    }

    #[test]
    fn open_removes_what_an_interrupted_export_left_and_keeps_real_exports() {
        let dir = temp_dir();
        let exports = dir.join(EXPORT_DIR);
        fs::create_dir_all(exports.join("folder.p2cbackup")).unwrap();
        // A crash mid-export: its claim and its half-written `.tmp`.
        fs::write(exports.join("b.p2cbackup.claim"), b"").unwrap();
        fs::write(exports.join("b.p2cbackup.tmp"), b"half").unwrap();
        fs::write(exports.join("c.p2cbackup"), b"real export").unwrap();
        fs::write(exports.join("d.xlsx.claim"), b"").unwrap();
        fs::write(exports.join("d.xlsx.tmp"), b"half").unwrap();
        fs::write(exports.join("e.xlsx"), b"real report").unwrap();
        fs::write(exports.join("notes.txt"), b"").unwrap();

        open(&dir).unwrap();

        assert_eq!(
            names(&exports),
            vec!["c.p2cbackup", "e.xlsx", "folder.p2cbackup", "notes.txt"]
        );
        // The freed names are used again; a real export is still never overwritten.
        assert_eq!(
            write_export(&dir, "b.p2cbackup", b"new").unwrap(),
            exports.join("b.p2cbackup")
        );
        assert_eq!(
            write_export(&dir, "c.p2cbackup", b"new").unwrap(),
            exports.join("c-2.p2cbackup")
        );
        assert_eq!(
            fs::read(exports.join("c.p2cbackup")).unwrap(),
            b"real export"
        );
    }

    #[test]
    fn open_again_in_the_same_process_keeps_a_running_export() {
        // A webview reload mid-export opens the data again with the lock the process holds.
        let dir = temp_dir();
        let lock = DataLock::new();
        let exports = dir.join(EXPORT_DIR);
        fs::create_dir_all(&exports).unwrap();
        fs::write(exports.join("a.p2cbackup.claim"), b"").unwrap();
        fs::write(exports.join("a.p2cbackup.tmp"), b"half").unwrap();
        super::open(&dir, PAGE, &lock).unwrap();
        assert_eq!(names(&exports), Vec::<String>::new());

        fs::write(exports.join("b.p2cbackup.claim"), b"").unwrap();
        fs::write(exports.join("b.p2cbackup.tmp"), b"half").unwrap();
        super::open(&dir, PAGE, &lock).unwrap();
        assert_eq!(
            names(&exports),
            vec!["b.p2cbackup.claim", "b.p2cbackup.tmp"]
        );
    }

    #[test]
    fn the_first_open_cleans_exports_even_when_it_cannot_remove_the_db_tmp() {
        // A folder under the `.tmp` name makes its removal fail on every platform, like a
        // `.tmp` file an antivirus holds.
        let dir = temp_dir();
        let lock = DataLock::new();
        let exports = dir.join(EXPORT_DIR);
        fs::create_dir_all(&exports).unwrap();
        fs::create_dir_all(dir.join("project2c.db.tmp")).unwrap();
        fs::write(exports.join("a.p2cbackup.claim"), b"").unwrap();
        fs::write(exports.join("a.p2cbackup.tmp"), b"half").unwrap();

        assert!(super::open(&dir, PAGE, &lock).is_err());
        assert_eq!(names(&exports), Vec::<String>::new());

        // The retry opens under the lock already held and leaves a running export alone.
        fs::remove_dir(dir.join("project2c.db.tmp")).unwrap();
        fs::write(exports.join("b.p2cbackup.claim"), b"").unwrap();
        super::open(&dir, PAGE, &lock).unwrap();
        assert_eq!(names(&exports), vec!["b.p2cbackup.claim"]);
    }

    #[test]
    fn latest_backup_is_the_last_written_and_none_without_backups() {
        let dir = temp_dir();
        assert_eq!(latest_backup(&dir), None);
        save(&dir, &db("a")).unwrap();
        backup(&dir, "20260920-080000").unwrap();
        save(&dir, &db("b")).unwrap();
        // The clock set back: write order still decides, not the stamp.
        backup(&dir, "20260910-080000").unwrap();
        assert_eq!(
            latest_backup(&dir).as_deref(),
            Some("project2c-s00000002-20260910-080000.db")
        );
    }

    #[test]
    fn folder_takes_only_exports_or_backups_and_creates_it() {
        let dir = temp_dir();
        assert_eq!(folder(&dir, "exports").unwrap(), dir.join(EXPORT_DIR));
        assert!(dir.join(EXPORT_DIR).is_dir());
        assert_eq!(folder(&dir, "backups").unwrap(), dir.join(BACKUP_DIR));
        assert!(dir.join(BACKUP_DIR).is_dir());
        for kind in ["", "..", "Backups", "C:\\Windows", "exports\\..\\.."] {
            let error = folder(&dir, kind).unwrap_err();
            assert_eq!(error.kind(), ErrorKind::InvalidInput);
        }
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

    #[test]
    fn stamp_formats_calendar_date_and_time() {
        assert_eq!(stamp(0), "19700101-000000");
        // 2026-09-27 08:05:09
        assert_eq!(stamp(1_790_496_309), "20260927-080509");
        // 2028-02-29 23:59:59 (leap day)
        assert_eq!(stamp(1_835_481_599), "20280229-235959");
    }
}
