// Keep the Rust layer thin: business logic lives in packages/domain (ADR-0005, ADR-0006).
// The commands are file I/O for the sql.js database (ADR-0016) and the AI calls with their key
// (`ai`, ADR-0009 D-1). None runs on the main thread, which would freeze the window while a whole
// file is written and flushed after every transaction, or while OpenCode answers: the database
// commands and `ai_complete` run on the blocking pool, the others on the async threadpool
// (`async`).

mod ai;
mod storage;

use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::ipc::{InvokeBody, Request, Response};

/// Header carrying the export file name (the body is the raw file).
const EXPORT_NAME_HEADER: &str = "x-p2c-file-name";
/// Header carrying the page a save comes from (`db_save`).
const PAGE_HEADER: &str = "x-p2c-page";

/// Held from the first `db_open` until the process ends (one exe per data folder), and by each of
/// `db_open`, `db_save` and `db_backup` while it runs (one file command at a time, see `DataLock`).
static DATA_LOCK: storage::DataLock = storage::DataLock::new();

/// Set while `ai_complete` runs: one AI request at a time (spec Phase 5 P5). The AI commands never
/// take [`DATA_LOCK`], so a running request does not hold up saving.
static AI_RUNNING: ai::Busy = ai::Busy::new();

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

/// Startup: locks the data folder and returns the database file; an empty body means a first
/// start (a file that is missing with backups left, empty or not SQLite is an error, see
/// `storage::open`). Another exe already running → the error `ALREADY_OPEN`. The app backs the
/// file up with `db_backup` once it opened it. `page` names this load of the webview: from now on
/// only its saves are written (see `storage::save`).
#[tauri::command]
async fn db_open(page: String) -> Result<Response, String> {
    let dir = data_dir()?;
    let bytes = blocking(move || storage::open(&dir, &page, &DATA_LOCK)).await?;
    Ok(Response::new(bytes.unwrap_or_default()))
}

/// Backs the saved file up (at startup once the app opened it, and before the data is replaced);
/// returns the backup file name. `utc_offset_minutes` comes from the webview so backup names use
/// local time.
#[tauri::command]
async fn db_backup(utc_offset_minutes: i64) -> Result<String, String> {
    let stamp = local_stamp(utc_offset_minutes)?;
    let dir = data_dir()?;
    blocking(move || storage::backup(&dir, &stamp, &DATA_LOCK)).await
}

/// `YYYYMMDD-HHMMSS` in local time for backup names.
fn local_stamp(utc_offset_minutes: i64) -> Result<String, String> {
    let secs = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_secs() as i64;
    Ok(storage::stamp(secs + utc_offset_minutes * 60))
}

/// Replaces the database file with the request body (atomic), unless a later `db_open` came from
/// another page than the one in the page header (`STALE_PAGE`).
#[tauri::command]
async fn db_save(request: Request<'_>) -> Result<(), String> {
    let page = header(&request, PAGE_HEADER)?.to_owned();
    let bytes = raw_body(&request)?.to_vec();
    let dir = data_dir()?;
    blocking(move || storage::save(&dir, &bytes, &page, &DATA_LOCK)).await
}

/// Runs a file command on the blocking pool: waiting for [`DATA_LOCK`] or the disk never holds up
/// an async worker, so other commands keep running meanwhile.
async fn blocking<T: Send + 'static>(
    command: impl FnOnce() -> std::io::Result<T> + Send + 'static,
) -> Result<T, String> {
    tauri::async_runtime::spawn_blocking(command)
        .await
        .map_err(|e| e.to_string())?
        .map_err(|e| e.to_string())
}

fn header<'a>(request: &'a Request<'_>, name: &str) -> Result<&'a str, String> {
    request
        .headers()
        .get(name)
        .and_then(|value| value.to_str().ok())
        .ok_or_else(|| format!("missing header {name}"))
}

/// Writes the request body into `exports\` (Settings → Data `.p2cbackup`, Báo cáo `.xlsx`) without
/// overwriting an earlier export; returns the path actually written, which may carry a `-n` suffix.
#[tauri::command(async)]
fn export_write(request: Request<'_>) -> Result<String, String> {
    let name = header(&request, EXPORT_NAME_HEADER)?;
    let path = storage::write_export(&data_dir()?, name, raw_body(&request)?)
        .map_err(|e| e.to_string())?;
    Ok(path.to_string_lossy().into_owned())
}

/// The name of the newest automatic backup (Settings → Data), `null` when there is none.
#[tauri::command(async)]
fn db_latest_backup() -> Result<Option<String>, String> {
    Ok(storage::latest_backup(&data_dir()?))
}

/// Shows `exports\` or `backups\` in Explorer (Settings → Data); any other `kind` is an error.
#[tauri::command(async)]
fn open_folder(kind: String) -> Result<(), String> {
    let path = storage::folder(&data_dir()?, &kind).map_err(|e| e.to_string())?;
    let explorer = storage::explorer(std::env::var_os("SystemRoot")).map_err(|e| e.to_string())?;
    let mut explorer = std::process::Command::new(explorer);
    #[cfg(windows)]
    std::os::windows::process::CommandExt::raw_arg(&mut explorer, storage::explorer_arg(&path));
    #[cfg(not(windows))]
    explorer.arg(path);
    // Not waited on: Explorer reports exit code 1 even when it opened the folder.
    explorer.spawn().map(drop).map_err(|e| e.to_string())
}

/// Sends `messages` to OpenCode under `plan` (`GO` / `CREDIT`) with the stored key and returns the
/// answer; an error is `{ code, httpStatus?, message? }` (spec Phase 5 §5.3), `AI_BUSY` while
/// another request runs. `session_id` names the conversation the request belongs to.
#[tauri::command]
async fn ai_complete(
    session_id: String,
    plan: String,
    model: String,
    reasoning: Option<String>,
    messages: Vec<ai::Message>,
    max_tokens: i64,
) -> Result<ai::Completion, ai::AiError> {
    let request = ai::Request {
        session_id,
        plan,
        model,
        reasoning,
        messages,
        max_tokens,
    };
    let read_key = || ai::read_key(&ai::key_entry()?);
    tauri::async_runtime::spawn_blocking(move || {
        ai::complete(&request, &AI_RUNNING, read_key, ai::post)
    })
    .await
    // A panic (in a debug build only: release aborts) is a bug, like a wrong argument.
    .unwrap_or_else(|_| Err(ai::AiError::new(ai::AI_BAD_REQUEST)))
}

/// Stores the OpenCode key, trimmed, in the Credential Manager; no command reads it back.
#[tauri::command(async)]
fn ai_key_set(key: String) -> Result<(), ai::AiError> {
    ai::set_key(&ai::key_entry()?, &key)
}

#[tauri::command(async)]
fn ai_key_delete() -> Result<(), ai::AiError> {
    ai::delete_key(&ai::key_entry()?)
}

/// Whether a key is stored (Settings → AI), never the key.
#[tauri::command(async)]
fn ai_key_status() -> Result<bool, ai::AiError> {
    Ok(ai::read_key(&ai::key_entry()?)?.is_some())
}

/// Opens chatgpt.com in the default browser for the manual ChatGPT web path (spec Phase 5 §5.4).
#[tauri::command(async)]
fn open_chatgpt() -> Result<(), ai::AiError> {
    ai::chatgpt_command(std::env::var_os("SystemRoot"))
        .and_then(|mut browser| browser.spawn())
        // Not waited on, like `open_folder`.
        .map(drop)
        .map_err(|_| ai::AiError::new(ai::AI_OPEN_BROWSER))
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            db_open,
            db_save,
            db_backup,
            db_latest_backup,
            export_write,
            open_folder,
            ai_complete,
            ai_key_set,
            ai_key_delete,
            ai_key_status,
            open_chatgpt
        ])
        .run(tauri::generate_context!())
        .expect("error while running Project-2C");
}
