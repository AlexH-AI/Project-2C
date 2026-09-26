// Keep the Rust layer thin: business logic lives in packages/domain (ADR-0005, ADR-0006).
// The only commands are file I/O for the sql.js database (ADR-0016).

mod storage;

use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::ipc::{InvokeBody, Request, Response};

/// Header carrying the export file name (the body is the raw file).
const EXPORT_NAME_HEADER: &str = "x-p2c-file-name";

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

/// Startup: backs up and returns the database file; an empty body means there is no file yet
/// (an existing empty file is an error, see `storage::open`).
/// `utc_offset_minutes` comes from the webview so backup names use local time.
#[tauri::command]
fn db_open(utc_offset_minutes: i64) -> Result<Response, String> {
    let secs = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_secs() as i64;
    let stamp = storage::stamp(secs + utc_offset_minutes * 60);
    let bytes = storage::open(&data_dir()?, &stamp).map_err(|e| e.to_string())?;
    Ok(Response::new(bytes.unwrap_or_default()))
}

/// Replaces the database file with the request body (atomic).
#[tauri::command]
fn db_save(request: Request<'_>) -> Result<(), String> {
    storage::save(&data_dir()?, raw_body(&request)?).map_err(|e| e.to_string())
}

/// Writes the request body into `exports\` (used by T-052); returns the file path.
#[tauri::command]
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
        .invoke_handler(tauri::generate_handler![db_open, db_save, export_write])
        .run(tauri::generate_context!())
        .expect("error while running Project-2C");
}
