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
/// copied into `backups\` under `stamp`, keeping the newest ten copies.
pub fn open(dir: &Path, stamp: &str) -> io::Result<Option<Vec<u8>>> {
    fs::create_dir_all(dir)?;
    // A crash between writing and renaming leaves this behind; the database file itself is whole.
    remove_if_exists(&dir.join(tmp_name(DB_FILE)))?;
    let bytes = match fs::read(dir.join(DB_FILE)) {
        Ok(bytes) => bytes,
        Err(error) if error.kind() == ErrorKind::NotFound => return Ok(None),
        Err(error) => return Err(error),
    };
    let backups = dir.join(BACKUP_DIR);
    write_atomic(&backups, &format!("{BACKUP_PREFIX}{stamp}.db"), &bytes)?;
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

/// Deletes all but the newest `KEEP_BACKUPS` backups; stamped names sort by time.
fn prune_backups(backups: &Path) -> io::Result<()> {
    let mut names = Vec::new();
    for entry in fs::read_dir(backups)? {
        let name = entry?.file_name().to_string_lossy().into_owned();
        if name.starts_with(BACKUP_PREFIX) && name.ends_with(".db") {
            names.push(name);
        }
    }
    names.sort();
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
