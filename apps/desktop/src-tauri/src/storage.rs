//! Database file storage for the exe (ADR-0016): `std` only, no extra crates.
//!
//! Layout next to the exe: `Project2C-data\project2c.db`, `backups\`, `exports\`.

use std::fs;
use std::io::{self, ErrorKind, Write};
use std::path::{Path, PathBuf};

pub const DATA_DIR: &str = "Project2C-data";
const DB_FILE: &str = "project2c.db";
const BACKUP_DIR: &str = "backups";
const EXPORT_DIR: &str = "exports";
const BACKUP_PREFIX: &str = "project2c-";
const KEEP_BACKUPS: usize = 10;

/// Reads the database at startup; `None` when there is no file yet. An existing file is first
/// copied into `backups\` under `stamp`, keeping the newest ten copies. An empty file is an
/// error, never a first start: the app would otherwise write a new database over it.
pub fn open(dir: &Path, stamp: &str) -> io::Result<Option<Vec<u8>>> {
    fs::create_dir_all(dir)?;
    // A crash between writing and renaming leaves this behind; the database file itself is whole.
    remove_if_exists(&dir.join(tmp_name(DB_FILE)))?;
    let bytes = match fs::read(dir.join(DB_FILE)) {
        Ok(bytes) => bytes,
        Err(error) if error.kind() == ErrorKind::NotFound => return Ok(None),
        Err(error) => return Err(error),
    };
    if bytes.is_empty() {
        return Err(io::Error::new(
            ErrorKind::InvalidData,
            format!("{DB_FILE} is empty"),
        ));
    }
    let backups = dir.join(BACKUP_DIR);
    write_atomic(&backups, &backup_name(&backups, stamp), &bytes)?;
    prune_backups(&backups)?;
    Ok(Some(bytes))
}

/// Replaces the database file atomically.
pub fn save(dir: &Path, bytes: &[u8]) -> io::Result<()> {
    write_atomic(dir, DB_FILE, bytes)
}

/// Writes an export file into `exports\` and returns its path.
pub fn write_export(dir: &Path, name: &str, bytes: &[u8]) -> io::Result<PathBuf> {
    if !is_export_name(name) {
        return Err(io::Error::new(
            ErrorKind::InvalidInput,
            format!("invalid export name: {name}"),
        ));
    }
    let exports = dir.join(EXPORT_DIR);
    write_atomic(&exports, name, bytes)?;
    Ok(exports.join(name))
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

/// `project2c-<stamp>.db`, or `project2c-<stamp>-<n>.db` when that second already has a backup.
fn backup_name(backups: &Path, stamp: &str) -> String {
    let mut name = format!("{BACKUP_PREFIX}{stamp}.db");
    let mut n = 1;
    while backups.join(&name).exists() {
        name = format!("{BACKUP_PREFIX}{stamp}-{n}.db");
        n += 1;
    }
    name
}

/// The sort key of a name `backup_name` makes; `None` for any other name.
fn backup_key(name: &str) -> Option<(&str, u64)> {
    let rest = name.strip_prefix(BACKUP_PREFIX)?.strip_suffix(".db")?;
    let stamp = rest.get(..15)?;
    let (date, time) = stamp.split_once('-')?;
    if date.len() != 8 || !all_digits(date) || !all_digits(time) {
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
    Some((stamp, n))
}

fn all_digits(s: &str) -> bool {
    !s.is_empty() && s.bytes().all(|b| b.is_ascii_digit())
}

/// Deletes all but the newest `KEEP_BACKUPS` backups. Only files named like our backups count;
/// anything else in the folder is left alone.
fn prune_backups(backups: &Path) -> io::Result<()> {
    let mut names = Vec::new();
    for entry in fs::read_dir(backups)? {
        let entry = entry?;
        let name = entry.file_name().to_string_lossy().into_owned();
        if entry.file_type()?.is_file() && backup_key(&name).is_some() {
            names.push(name);
        }
    }
    names.sort_by(|a, b| backup_key(a).cmp(&backup_key(b)));
    let excess = names.len().saturating_sub(KEEP_BACKUPS);
    for name in &names[..excess] {
        fs::remove_file(backups.join(name))?;
    }
    Ok(())
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
        save(&dir, b"first").unwrap();
        save(&dir, b"second").unwrap();
        assert_eq!(names(&dir), vec![DB_FILE]);
        assert_eq!(
            open(&dir, "20260927-080000").unwrap(),
            Some(b"second".to_vec())
        );
    }

    #[test]
    fn open_backs_up_the_existing_file() {
        let dir = temp_dir();
        save(&dir, b"data").unwrap();
        open(&dir, "20260927-080000").unwrap();
        let backups = dir.join(BACKUP_DIR);
        assert_eq!(names(&backups), vec!["project2c-20260927-080000.db"]);
        assert_eq!(
            fs::read(backups.join("project2c-20260927-080000.db")).unwrap(),
            b"data"
        );
    }

    #[test]
    fn open_keeps_only_the_ten_newest_backups() {
        let dir = temp_dir();
        save(&dir, b"data").unwrap();
        let backups = dir.join(BACKUP_DIR);
        fs::create_dir_all(&backups).unwrap();
        fs::write(backups.join("notes.txt"), b"not a backup").unwrap();
        for day in 10..22 {
            open(&dir, &format!("202609{day}-080000")).unwrap();
        }
        let kept = names(&backups);
        assert_eq!(kept.len(), 11);
        assert_eq!(kept[0], "notes.txt");
        assert_eq!(kept[1], "project2c-20260912-080000.db");
        assert_eq!(kept[10], "project2c-20260921-080000.db");
    }

    #[test]
    fn open_prunes_only_backups_it_named() {
        let dir = temp_dir();
        save(&dir, b"data").unwrap();
        let backups = dir.join(BACKUP_DIR);
        fs::create_dir_all(backups.join("project2c-20260101-000000.db")).unwrap();
        let foreign = [
            "project2c-000-important.db",
            "project2c-notes.db",
            "project2c-20260101-00000x.db",
            "project2c-20260101-000000-x.db",
            "project2c-20260101-000000-0.db",
        ];
        for name in foreign {
            fs::write(backups.join(name), b"keep").unwrap();
        }
        for day in 10..22 {
            open(&dir, &format!("202609{day}-080000")).unwrap();
        }
        let kept = names(&backups);
        assert_eq!(kept.len(), 16);
        for name in foreign {
            assert_eq!(fs::read(backups.join(name)).unwrap(), b"keep", "{name}");
        }
        assert!(backups.join("project2c-20260101-000000.db").is_dir());
        assert!(backups.join("project2c-20260912-080000.db").exists());
        assert!(!backups.join("project2c-20260911-080000.db").exists());
    }

    #[test]
    fn open_twice_in_the_same_second_keeps_both_backups() {
        let dir = temp_dir();
        let backups = dir.join(BACKUP_DIR);
        save(&dir, b"a").unwrap();
        open(&dir, "20260927-080000").unwrap();
        for version in [b"b", b"c"] {
            save(&dir, version).unwrap();
            open(&dir, "20260927-080000").unwrap();
        }
        assert_eq!(
            fs::read(backups.join("project2c-20260927-080000.db")).unwrap(),
            b"a"
        );
        assert_eq!(
            fs::read(backups.join("project2c-20260927-080000-1.db")).unwrap(),
            b"b"
        );
        assert_eq!(
            fs::read(backups.join("project2c-20260927-080000-2.db")).unwrap(),
            b"c"
        );
        // Eight later backups push out one: the unsuffixed copy is the oldest of the second.
        for day in 10..18 {
            open(&dir, &format!("202610{day}-080000")).unwrap();
        }
        assert!(!backups.join("project2c-20260927-080000.db").exists());
        assert!(backups.join("project2c-20260927-080000-1.db").exists());
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
    fn open_removes_a_tmp_file_left_by_a_crash() {
        let dir = temp_dir();
        save(&dir, b"data").unwrap();
        fs::write(dir.join("project2c.db.tmp"), b"half").unwrap();
        assert_eq!(
            open(&dir, "20260927-080000").unwrap(),
            Some(b"data".to_vec())
        );
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
    fn stamp_formats_calendar_date_and_time() {
        assert_eq!(stamp(0), "19700101-000000");
        // 2026-09-27 08:05:09
        assert_eq!(stamp(1_790_496_309), "20260927-080509");
        // 2028-02-29 23:59:59 (leap day)
        assert_eq!(stamp(1_835_481_599), "20280229-235959");
    }
}
