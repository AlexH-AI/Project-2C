//! Database file storage for the exe (ADR-0016): `std` only, no extra crates.
//!
//! Layout next to the exe: `Project2C-data\project2c.db`, `project2c.lock`, `backups\`, `exports\`.

use std::fs;
use std::io::{self, ErrorKind, Write};
use std::path::{Path, PathBuf};
use std::sync::Mutex;

pub const DATA_DIR: &str = "Project2C-data";
/// Error message when another process holds the data folder; the app matches it exactly.
pub const ALREADY_OPEN: &str = "ALREADY_OPEN";
const DB_FILE: &str = "project2c.db";
const LOCK_FILE: &str = "project2c.lock";
const BACKUP_DIR: &str = "backups";
const EXPORT_DIR: &str = "exports";
const BACKUP_PREFIX: &str = "project2c-";
const KEEP_BACKUPS: usize = 10;
/// How many `-n` suffixes an export tries before giving up.
const MAX_EXPORT_SUFFIX: u32 = 1000;
/// Digits of the write order in a backup name, zero-padded so the folder lists in order.
const SEQ_WIDTH: usize = 8;
const SQLITE_HEADER: &[u8] = b"SQLite format 3\0";

/// Keeps the data folder to one process: holds `project2c.lock` open without sharing until the
/// process ends. Windows releases it when the app closes or crashes, so the file is never removed.
pub struct DataLock(Mutex<Option<fs::File>>);

impl DataLock {
    pub const fn new() -> Self {
        Self(Mutex::new(None))
    }

    /// Takes the lock on `dir` once and returns `true`; later calls from the same process (a
    /// webview reload) succeed without reopening and return `false`. Another process holding it
    /// → `ResourceBusy` with the message [`ALREADY_OPEN`].
    fn acquire(&self, dir: &Path) -> io::Result<bool> {
        let mut held = self
            .0
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());
        if held.is_some() {
            return Ok(false);
        }
        *held = Some(open_lock_file(&dir.join(LOCK_FILE))?);
        Ok(true)
    }
}

#[cfg(windows)]
fn open_lock_file(path: &Path) -> io::Result<fs::File> {
    use std::os::windows::fs::OpenOptionsExt;
    // Windows `ERROR_SHARING_VIOLATION`.
    const SHARING_VIOLATION: i32 = 32;
    fs::OpenOptions::new()
        .read(true)
        .write(true)
        .create(true)
        .truncate(false)
        .share_mode(0)
        .open(path)
        .map_err(|error| match error.raw_os_error() {
            Some(SHARING_VIOLATION) => io::Error::new(ErrorKind::ResourceBusy, ALREADY_OPEN),
            _ => error,
        })
}

/// The app ships for Windows only (ADR-0006): elsewhere the file is opened but locks nothing.
#[cfg(not(windows))]
fn open_lock_file(path: &Path) -> io::Result<fs::File> {
    fs::OpenOptions::new()
        .read(true)
        .write(true)
        .create(true)
        .truncate(false)
        .open(path)
}

/// Reads the database at startup; `None` on a first start (no file and no backups). The data
/// folder is locked first, so a second process touches nothing (see [`DataLock`]). A missing
/// file with backups left is an error, so the app never starts over them. An existing file is first
/// copied into `backups\` (unless an identical copy is already there), keeping the ten last
/// written copies. A file that is empty or not SQLite is an error, never a first start, and is
/// not backed up: the app would otherwise write a new database over it.
pub fn open(dir: &Path, stamp: &str, lock: &DataLock) -> io::Result<Option<Vec<u8>>> {
    fs::create_dir_all(dir)?;
    let first_open = lock.acquire(dir)?;
    // A crash between writing and renaming leaves this behind; the database file itself is whole.
    remove_if_exists(&dir.join(tmp_name(DB_FILE)))?;
    if first_open {
        remove_interrupted_exports(&dir.join(EXPORT_DIR));
    }
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
    copy_to_backups(&backups, &bytes, stamp)?;
    Ok(Some(bytes))
}

/// Copies the saved database file into `backups\` on demand (before reloading the simulated
/// data) and returns the backup's file name — an identical copy already there is reused.
pub fn backup(dir: &Path, stamp: &str) -> io::Result<String> {
    let bytes = fs::read(dir.join(DB_FILE))?;
    copy_to_backups(&dir.join(BACKUP_DIR), &bytes, stamp)
}

/// Writes `bytes` as the next backup, keeping the ten last written; returns the name of the copy.
/// A file the app keeps refusing (damaged inside) must not push the good backups out, so an
/// identical copy is never written twice.
fn copy_to_backups(backups: &Path, bytes: &[u8], stamp: &str) -> io::Result<String> {
    if let Some(name) = find_copy(backups, bytes) {
        return Ok(name);
    }
    let name = backup_name(next_seq(backups), stamp);
    write_atomic(backups, &name, bytes)?;
    prune_backups(backups, &name);
    Ok(name)
}

/// Replaces the database file atomically.
pub fn save(dir: &Path, bytes: &[u8]) -> io::Result<()> {
    write_atomic(dir, DB_FILE, bytes)
}

/// Writes an export file into `exports\` and returns its path. An earlier export is never
/// overwritten: a taken name gets `-2`, `-3`… before `.p2cbackup` (spec §6). The final name
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
    let stem = name.strip_suffix(".p2cbackup").unwrap_or(name);
    for n in 1..=MAX_EXPORT_SUFFIX {
        let candidate = if n == 1 {
            name.to_owned()
        } else {
            format!("{stem}-{n}.p2cbackup")
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

/// Removes what an export cut short by a crash left in `exports\`: claims, `.tmp` files, and the
/// empty file the first version of [`write_export`] kept under the final name — an empty file is
/// never a real export. Runs only when [`open`] takes the data lock for this process, before any
/// export of this process can start and while no other app instance can export. A webview reload
/// opens again under the lock already held and skips this, so an export still running keeps its
/// claim and `.tmp`. Best effort: a file another program holds stays until a later start.
fn remove_interrupted_exports(exports: &Path) {
    for entry in fs::read_dir(exports).into_iter().flatten().flatten() {
        let Ok(meta) = entry.metadata() else { continue };
        let name = entry.file_name().to_string_lossy().into_owned();
        let left = name.ends_with(".p2cbackup.claim")
            || name.ends_with(".p2cbackup.tmp")
            || (name.ends_with(".p2cbackup") && meta.len() == 0);
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

/// Where a backup sits in write order. Names from before write order existed
/// (`project2c-<stamp>[-<n>].db`) are older than every numbered one and sort by `(stamp, n)`.
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
enum BackupKey<'a> {
    Stamped(&'a str, u64),
    Numbered(u64),
}

/// The sort key of a backup name; `None` for any other name.
fn backup_key(name: &str) -> Option<BackupKey<'_>> {
    let rest = name.strip_prefix(BACKUP_PREFIX)?.strip_suffix(".db")?;
    if let Some(numbered) = rest.strip_prefix('s') {
        let (seq, stamp) = numbered.split_once('-')?;
        if !all_digits(seq) || !is_stamp(stamp) {
            return None;
        }
        return seq.parse().ok().map(BackupKey::Numbered);
    }
    let stamp = rest.get(..15)?;
    if !is_stamp(stamp) {
        return None;
    }
    let n = match &rest[15..] {
        "" => 0,
        suffix => {
            let digits = suffix
                .strip_prefix('-')
                .filter(|d| all_digits(d) && !d.starts_with('0'))?;
            digits.parse().ok()?
        }
    };
    Some(BackupKey::Stamped(stamp, n))
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
        .filter_map(
            |entry| match backup_key(&entry.file_name().to_string_lossy()) {
                Some(BackupKey::Numbered(seq)) => Some(seq),
                _ => None,
            },
        )
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
        .filter(|name| backup_key(name).is_some())
        .collect();
    names.sort_by(|a, b| backup_key(a).cmp(&backup_key(b)));
    names
}

fn find_copy(backups: &Path, bytes: &[u8]) -> Option<String> {
    backup_names(backups).into_iter().find(|name| {
        let path = backups.join(name);
        fs::metadata(&path).is_ok_and(|meta| meta.len() == bytes.len() as u64)
            && fs::read(&path).is_ok_and(|copy| copy == bytes)
    })
}

/// Deletes the oldest written backups until `KEEP_BACKUPS` remain, never `keep` (the copy just
/// written). Best effort, so it never blocks startup: a backup another program holds open stays,
/// and a later start tries again.
fn prune_backups(backups: &Path, keep: &str) {
    let names = backup_names(backups);
    let mut excess = names.len().saturating_sub(KEEP_BACKUPS);
    for name in names.iter().filter(|name| *name != keep) {
        if excess == 0 {
            break;
        }
        if fs::remove_file(backups.join(name)).is_ok() {
            excess -= 1;
        }
    }
}

fn is_export_name(name: &str) -> bool {
    name.len() > ".p2cbackup".len()
        && name.ends_with(".p2cbackup")
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
    fn open(dir: &Path, stamp: &str) -> io::Result<Option<Vec<u8>>> {
        super::open(dir, stamp, &DataLock::new())
    }

    /// A database file whose content is `tag` after the SQLite header.
    fn db(tag: &str) -> Vec<u8> {
        [b"SQLite format 3\0".as_slice(), tag.as_bytes()].concat()
    }

    /// Ten starts on ten different files: backups `project2c-s<1..10>-202609<10..19>-080000.db`.
    fn ten_backups(dir: &Path) {
        for day in 10..20 {
            save(dir, &db(&format!("day {day}"))).unwrap();
            open(dir, &format!("202609{day}-080000")).unwrap();
        }
    }

    #[test]
    fn open_without_a_file_creates_the_folder_and_returns_none() {
        let dir = temp_dir();
        assert_eq!(open(&dir, "20260927-080000").unwrap(), None);
        assert!(dir.is_dir());
        assert!(!dir.join(BACKUP_DIR).exists());
    }

    #[test]
    fn save_then_open_returns_the_saved_bytes_and_leaves_no_tmp_file() {
        let dir = temp_dir();
        save(&dir, &db("first")).unwrap();
        save(&dir, &db("second")).unwrap();
        assert_eq!(names(&dir), vec![DB_FILE]);
        assert_eq!(open(&dir, "20260927-080000").unwrap(), Some(db("second")));
    }

    #[test]
    fn open_backs_up_the_existing_file() {
        let dir = temp_dir();
        save(&dir, &db("data")).unwrap();
        open(&dir, "20260927-080000").unwrap();
        let backups = dir.join(BACKUP_DIR);
        assert_eq!(
            names(&backups),
            vec!["project2c-s00000001-20260927-080000.db"]
        );
        assert_eq!(
            fs::read(backups.join("project2c-s00000001-20260927-080000.db")).unwrap(),
            db("data")
        );
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
        open(&dir, "20260927-080000").unwrap();
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
    fn backup_without_a_file_is_an_error() {
        let dir = temp_dir();
        fs::create_dir_all(&dir).unwrap();
        assert_eq!(
            backup(&dir, "20260927-101500").unwrap_err().kind(),
            ErrorKind::NotFound
        );
    }

    #[test]
    fn open_keeps_only_the_ten_newest_backups() {
        let dir = temp_dir();
        let backups = dir.join(BACKUP_DIR);
        fs::create_dir_all(&backups).unwrap();
        fs::write(backups.join("notes.txt"), b"not a backup").unwrap();
        for day in 10..22 {
            save(&dir, &db(&format!("day {day}"))).unwrap();
            open(&dir, &format!("202609{day}-080000")).unwrap();
        }
        let kept = names(&backups);
        assert_eq!(kept.len(), 11);
        assert_eq!(kept[0], "notes.txt");
        assert_eq!(kept[1], "project2c-s00000003-20260912-080000.db");
        assert_eq!(kept[10], "project2c-s00000012-20260921-080000.db");
    }

    #[test]
    fn open_prunes_only_backups_it_named() {
        let dir = temp_dir();
        let backups = dir.join(BACKUP_DIR);
        fs::create_dir_all(backups.join("project2c-20260101-000000.db")).unwrap();
        let foreign = [
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
            open(&dir, &format!("202609{day}-080000")).unwrap();
        }
        let kept = names(&backups);
        assert_eq!(kept.len(), 20);
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
    fn open_twice_in_the_same_second_keeps_both_backups() {
        let dir = temp_dir();
        let backups = dir.join(BACKUP_DIR);
        for version in ["a", "b", "c"] {
            save(&dir, &db(version)).unwrap();
            open(&dir, "20260927-080000").unwrap();
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
            open(&dir, &format!("202610{day}-080000")).unwrap();
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
        let error = open(&dir, "20260927-080000").unwrap_err();
        assert_eq!(error.kind(), ErrorKind::InvalidData);
        assert!(!dir.join(BACKUP_DIR).exists());
    }

    #[test]
    fn open_refuses_a_file_that_is_not_sqlite_without_touching_the_backups() {
        let dir = temp_dir();
        ten_backups(&dir);
        let before = names(&dir.join(BACKUP_DIR));
        save(&dir, b"not a database").unwrap();
        let error = open(&dir, "20260927-080000").unwrap_err();
        assert_eq!(error.kind(), ErrorKind::InvalidData);
        assert_eq!(names(&dir.join(BACKUP_DIR)), before);
    }

    #[test]
    fn restarts_on_an_unchanged_file_keep_the_older_backups() {
        // A damaged file that still has the SQLite header: the app refuses it on every start,
        // and each start must not push out another good backup.
        let dir = temp_dir();
        ten_backups(&dir);
        save(&dir, &db("damaged")).unwrap();
        for minute in 10..20 {
            open(&dir, &format!("20260927-08{minute}00")).unwrap();
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
        let error = open(&dir, "20260927-080000").unwrap_err();
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
        assert_eq!(open(&dir, "20260927-080000").unwrap(), None);
    }

    #[test]
    fn a_backup_made_with_the_clock_set_back_is_kept() {
        let dir = temp_dir();
        ten_backups(&dir);
        save(&dir, &db("latest")).unwrap();
        open(&dir, "20250101-080000").unwrap();
        let backups = dir.join(BACKUP_DIR);
        assert_eq!(names(&backups).len(), 10);
        assert_eq!(
            fs::read(backups.join("project2c-s00000011-20250101-080000.db")).unwrap(),
            db("latest")
        );
    }

    #[test]
    fn starts_with_the_clock_in_2000_keep_the_latest_sessions_over_old_named_backups() {
        let dir = temp_dir();
        let backups = dir.join(BACKUP_DIR);
        fs::create_dir_all(&backups).unwrap();
        // Backups from before write order existed, written newest first so that file times
        // disagree with their names: the result must not depend on file times.
        let mut old: Vec<String> = (10..19)
            .map(|day| format!("project2c-202609{day}-080000.db"))
            .collect();
        old.push("project2c-20260918-080000-1.db".into());
        for name in old.iter().rev() {
            fs::write(backups.join(name), db(name)).unwrap();
        }
        let stamps: Vec<String> = (0..5)
            .map(|i| format!("200001{:02}-000000", 5 - i))
            .collect();
        for (i, stamp) in stamps.iter().enumerate() {
            save(&dir, &db(&format!("session {i}"))).unwrap();
            open(&dir, stamp).unwrap();
        }
        let sessions: Vec<String> = (1..)
            .zip(&stamps)
            .map(|(seq, stamp)| backup_name(seq, stamp))
            .collect();
        let expected = [&old[5..], &sessions[..]].concat();
        assert_eq!(backup_names(&backups), expected);
        for (i, name) in sessions.iter().enumerate() {
            let copy = fs::read(backups.join(name)).unwrap();
            assert_eq!(copy, db(&format!("session {i}")));
        }
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
            open(&dir, stamp).unwrap();
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
        fs::write(dir.join("project2c-20260927-080000.db"), b"old").unwrap();
        fs::write(dir.join("project2c-20260927-080000-1.db"), b"old").unwrap();
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

    #[test]
    fn old_named_backups_sort_before_numbered_ones() {
        assert!(
            backup_key("project2c-20301231-235959-9.db")
                < backup_key("project2c-s00000001-19700101-000000.db")
        );
        assert!(
            backup_key("project2c-20260927-080000.db")
                < backup_key("project2c-20260927-080000-1.db")
        );
        assert!(
            backup_key("project2c-s00000002-20000101-000000.db")
                < backup_key("project2c-s00000010-19990101-000000.db")
        );
    }

    #[cfg(windows)]
    #[test]
    fn a_locked_old_backup_does_not_block_startup() {
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
        assert_eq!(open(&dir, "20260927-080000").unwrap(), Some(db("latest")));
        assert_eq!(names(&backups).len(), 10);
        assert!(oldest.exists());
        assert!(!backups
            .join("project2c-s00000002-20260911-080000.db")
            .exists());
    }

    #[cfg(windows)]
    #[test]
    fn open_while_another_process_holds_the_lock_touches_nothing() {
        use std::os::windows::fs::OpenOptionsExt;
        let dir = temp_dir();
        save(&dir, &db("data")).unwrap();
        open(&dir, "20260927-080000").unwrap();
        let backups_before = names(&dir.join(BACKUP_DIR));
        let other = fs::OpenOptions::new()
            .read(true)
            .write(true)
            .share_mode(0)
            .open(dir.join(LOCK_FILE))
            .unwrap();
        save(&dir, &db("changed")).unwrap();
        fs::write(dir.join("project2c.db.tmp"), b"being written").unwrap();

        let error = open(&dir, "20260927-090000").unwrap_err();
        assert_eq!(error.kind(), ErrorKind::ResourceBusy);
        assert_eq!(error.to_string(), ALREADY_OPEN);
        assert_eq!(fs::read(dir.join(DB_FILE)).unwrap(), db("changed"));
        assert_eq!(
            fs::read(dir.join("project2c.db.tmp")).unwrap(),
            b"being written"
        );
        assert_eq!(names(&dir.join(BACKUP_DIR)), backups_before);

        drop(other);
        assert_eq!(open(&dir, "20260927-090000").unwrap(), Some(db("changed")));
        assert!(!dir.join("project2c.db.tmp").exists());
    }

    #[cfg(windows)]
    #[test]
    fn open_keeps_the_lock_and_does_not_lock_itself_out() {
        let dir = temp_dir();
        let lock = DataLock::new();
        save(&dir, &db("data")).unwrap();
        assert_eq!(
            super::open(&dir, "20260927-080000", &lock).unwrap(),
            Some(db("data"))
        );
        // Same process again (a webview reload): still opens.
        assert_eq!(
            super::open(&dir, "20260927-080001", &lock).unwrap(),
            Some(db("data"))
        );
        // A second process is refused while the first one runs.
        assert_eq!(
            open(&dir, "20260927-080002").unwrap_err().to_string(),
            ALREADY_OPEN
        );
        drop(lock);
        assert!(open(&dir, "20260927-080003").is_ok());
    }

    #[test]
    fn open_removes_a_tmp_file_left_by_a_crash() {
        let dir = temp_dir();
        save(&dir, &db("data")).unwrap();
        fs::write(dir.join("project2c.db.tmp"), b"half").unwrap();
        assert_eq!(open(&dir, "20260927-080000").unwrap(), Some(db("data")));
        assert!(!dir.join("project2c.db.tmp").exists());
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
    fn write_export_skips_a_name_taken_by_a_folder() {
        let dir = temp_dir();
        let exports = dir.join(EXPORT_DIR);
        fs::create_dir_all(exports.join("a.p2cbackup")).unwrap();
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
        // A crash mid-export: its claim, its half-written `.tmp`, and the empty placeholder
        // the first version of `write_export` kept under the final name.
        fs::write(exports.join("a.p2cbackup"), b"").unwrap();
        fs::write(exports.join("b.p2cbackup.claim"), b"").unwrap();
        fs::write(exports.join("b.p2cbackup.tmp"), b"half").unwrap();
        fs::write(exports.join("c.p2cbackup"), b"real export").unwrap();
        fs::write(exports.join("notes.txt"), b"").unwrap();

        open(&dir, "20260930-080000").unwrap();

        assert_eq!(
            names(&exports),
            vec!["c.p2cbackup", "folder.p2cbackup", "notes.txt"]
        );
        // The freed names are used again; a real export is still never overwritten.
        assert_eq!(
            write_export(&dir, "a.p2cbackup", b"new").unwrap(),
            exports.join("a.p2cbackup")
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
        super::open(&dir, "20260930-080000", &lock).unwrap();
        assert_eq!(names(&exports), Vec::<String>::new());

        fs::write(exports.join("b.p2cbackup.claim"), b"").unwrap();
        fs::write(exports.join("b.p2cbackup.tmp"), b"half").unwrap();
        super::open(&dir, "20260930-080001", &lock).unwrap();
        assert_eq!(
            names(&exports),
            vec!["b.p2cbackup.claim", "b.p2cbackup.tmp"]
        );
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
