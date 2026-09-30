// Keep the Rust layer thin: business logic lives in packages/domain (ADR-0005, ADR-0006).
// The only commands are file I/O for the sql.js database (ADR-0016). They run on the async
// threadpool (`async`): a plain command runs on the main thread and would freeze the window
// while a whole file is written and flushed after every transaction.

mod storage;

use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::ipc::{InvokeBody, Request, Response};

/// Header carrying the export file name (the body is the raw file).
const EXPORT_NAME_HEADER: &str = "x-p2c-file-name";

/// Held from the first `db_open` until the process ends: one exe per data folder.
static DATA_LOCK: storage::DataLock = storage::DataLock::new();

/// `Project2C-data\` next to the exe (portable, ADR-0006).
fn data_dir() -> Result<PathBuf, String> {
    let exe = std::env::current_exe().map_err(|e| e.to_string())?;
    let dir = exe.parent().ok_or("exe has no parent folder")?;
    Ok(dir.join(storage::DATA_DIR))
}

fn raw_body<'a>(request: &'a Request<'_>) -> Result<&'a [u8], String> {
    match request.body() {
        InvokeBody::Raw(bytes) => Ok(bytes),
        InvokeBody::Json(_) => Err("expected raw bytes".into()),
    }
}

/// Startup: locks the data folder, backs up and returns the database file; an empty body means a
/// first start (a file that is missing with backups left, empty or not SQLite is an error, see
/// `storage::open`). Another exe already running → the error `ALREADY_OPEN`.
/// `utc_offset_minutes` comes from the webview so backup names use local time.
#[tauri::command(async)]
fn db_open(utc_offset_minutes: i64) -> Result<Response, String> {
    let stamp = local_stamp(utc_offset_minutes)?;
    let bytes = storage::open(&data_dir()?, &stamp, &DATA_LOCK).map_err(|e| e.to_string())?;
    Ok(Response::new(bytes.unwrap_or_default()))
}

/// Backs the saved file up before the simulated data is reloaded; returns the backup file name.
#[tauri::command(async)]
fn db_backup(utc_offset_minutes: i64) -> Result<String, String> {
    let stamp = local_stamp(utc_offset_minutes)?;
    storage::backup(&data_dir()?, &stamp).map_err(|e| e.to_string())
}

/// `YYYYMMDD-HHMMSS` in local time for backup names.
fn local_stamp(utc_offset_minutes: i64) -> Result<String, String> {
    let secs = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_secs() as i64;
    Ok(storage::stamp(secs + utc_offset_minutes * 60))
}

/// Replaces the database file with the request body (atomic).
#[tauri::command(async)]
fn db_save(request: Request<'_>) -> Result<(), String> {
    storage::save(&data_dir()?, raw_body(&request)?).map_err(|e| e.to_string())
}

/// Writes the request body into `exports\` (Settings → Data, `.p2cbackup`) without overwriting an
/// earlier export; returns the path actually written, which may carry a `-n` suffix.
#[tauri::command(async)]
fn export_write(request: Request<'_>) -> Result<String, String> {
    let name = request
        .headers()
        .get(EXPORT_NAME_HEADER)
        .and_then(|value| value.to_str().ok())
        .ok_or("missing export file name")?;
    let path = storage::write_export(&data_dir()?, name, raw_body(&request)?)
        .map_err(|e| e.to_string())?;
    Ok(path.to_string_lossy().into_owned())
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            db_open,
            db_save,
            db_backup,
            export_write
        ])
        .run(tauri::generate_context!())
        .expect("error while running Project-2C");
}
