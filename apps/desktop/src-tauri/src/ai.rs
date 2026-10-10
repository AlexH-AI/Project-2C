// The AI commands (spec Phase 5 §5, ADR-0009 D-1 / W-1): OpenCode's chat endpoint called from Rust
// with the key kept in the Windows Credential Manager, so the webview never sees the key and never
// talks to the network (the CSP stays `'self'`). One AI request runs at a time ([`Busy`]). The
// logic here takes the key store and the HTTP call as arguments, so tests run on sample data and
// a local HTTP server only.

use keyring_core::{Entry, Error as KeyringError};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::io::Read;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::Duration;

/// The chat endpoint of each OpenCode plan (P8); the webview names the plan, never a URL.
pub const GO_URL: &str = "https://opencode.ai/zen/go/v1/chat/completions";
pub const CREDIT_URL: &str = "https://opencode.ai/zen/v1/chat/completions";
/// The only page `open_chatgpt` opens (P7, §5.4).
pub const CHATGPT_URL: &str = "https://chatgpt.com/";

/// The Credential Manager entry of the key, one for both plans.
pub const KEY_SERVICE: &str = "Project-2C";
pub const KEY_USER: &str = "opencode-go";
/// Stored `Local`: on this machine only, never carried to another one by a roaming profile, as
/// `Enterprise` (the store's default) would be (ADR-0009 D-1 item 4: one key per machine).
pub const KEY_MODIFIERS: [(&str, &str); 1] = [("persistence", "Local")];

pub const TIMEOUT: Duration = Duration::from_secs(120);
/// For each of finding the server's address and opening the connection (TCP and TLS).
pub const CONNECT_TIMEOUT: Duration = Duration::from_secs(10);
/// The most of a reply body that is read, counted once gzip is undone; a longer 2xx is
/// `AI_BAD_RESPONSE`.
pub const MAX_BODY: u64 = 2 * 1024 * 1024;

const MAX_TOKENS: i64 = 16_000;
/// Over the `content` of all messages, in characters.
const MAX_MESSAGE_CHARS: usize = 200_000;
const MAX_KEY_CHARS: usize = 512;
const MAX_SESSION_CHARS: usize = 64;
/// How the app names itself to OpenCode, which asks each client for its own `User-Agent` rather
/// than an HTTP library's (ADR-0009 W-1).
pub const USER_AGENT: &str = concat!("Project-2C/", env!("CARGO_PKG_VERSION"));
/// The most of the server's error message an error carries, in characters.
const MAX_SERVER_MESSAGE: usize = 200;
const ROLES: [&str; 3] = ["system", "user", "assistant"];
/// The `reasoning_effort` values OpenCode takes (spec §4.1).
const REASONING: [&str; 3] = ["low", "medium", "high"];

// The error codes of spec §5.3, which `packages/ai` (`AI_ERROR_CODES`) translates.
pub const AI_NO_KEY: &str = "AI_NO_KEY";
pub const AI_UNAUTHORIZED: &str = "AI_UNAUTHORIZED";
pub const AI_RATE_LIMITED: &str = "AI_RATE_LIMITED";
pub const AI_TIMEOUT: &str = "AI_TIMEOUT";
pub const AI_NETWORK: &str = "AI_NETWORK";
pub const AI_HTTP: &str = "AI_HTTP";
pub const AI_BAD_RESPONSE: &str = "AI_BAD_RESPONSE";
pub const AI_BUSY: &str = "AI_BUSY";
pub const AI_BAD_REQUEST: &str = "AI_BAD_REQUEST";
pub const AI_KEYRING: &str = "AI_KEYRING";
pub const AI_OPEN_BROWSER: &str = "AI_OPEN_BROWSER";

/// What an AI command returns on failure: `{ code, httpStatus?, message? }`. `message` is only
/// the start of the server's own error message, with the key and the session id masked; never a
/// header or the request body.
#[derive(Debug, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AiError {
    pub code: &'static str,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub http_status: Option<u16>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
}

impl AiError {
    pub fn new(code: &'static str) -> Self {
        AiError {
            code,
            http_status: None,
            message: None,
        }
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Message {
    pub role: String,
    pub content: String,
}

/// The arguments of `ai_complete`.
pub struct Request {
    /// One id per conversation (the attempts of one analysis or extraction, or one connection
    /// check), sent as `x-opencode-session`: OpenCode Go routes and caches by it (ADR-0009 W-1).
    pub session_id: String,
    /// `GO` or `CREDIT`.
    pub plan: String,
    pub model: String,
    /// `None` sends no `reasoning_effort`.
    pub reasoning: Option<String>,
    pub messages: Vec<Message>,
    pub max_tokens: i64,
}

#[derive(Debug, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Completion {
    pub content: String,
    /// `null` when OpenCode gives no count: unknown, not zero.
    pub prompt_tokens: Option<u64>,
    pub completion_tokens: Option<u64>,
    /// Why the model stopped, as OpenCode says (`stop`, `length` when `max_tokens` cut the answer).
    pub finish_reason: Option<String>,
}

/// The "running" flag of P5: at most one AI request at a time.
pub struct Busy(AtomicBool);

/// Holds [`Busy`] until dropped, so the flag clears however the request ends (reply, error,
/// timeout or panic).
pub struct Running<'a>(&'a AtomicBool);

impl Busy {
    pub const fn new() -> Self {
        Busy(AtomicBool::new(false))
    }

    /// Sets the flag, or `AI_BUSY` when a request already holds it.
    pub fn start(&self) -> Result<Running<'_>, AiError> {
        self.0
            .compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
            .map(|_| Running(&self.0))
            .map_err(|_| AiError::new(AI_BUSY))
    }
}

impl Drop for Running<'_> {
    fn drop(&mut self) {
        self.0.store(false, Ordering::Release);
    }
}

/// Checks the arguments before anything else happens and returns the URL of the plan; a wrong
/// argument is a programming error of the webview (`AI_BAD_REQUEST`).
pub fn check(request: &Request) -> Result<&'static str, AiError> {
    let url = match request.plan.as_str() {
        "GO" => GO_URL,
        "CREDIT" => CREDIT_URL,
        _ => return Err(AiError::new(AI_BAD_REQUEST)),
    };
    let chars: usize = request
        .messages
        .iter()
        .map(|message| message.content.chars().count())
        .sum();
    let session = &request.session_id;
    let valid = (1..=MAX_SESSION_CHARS).contains(&session.len())
        && session
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || byte == b'-')
        && !request.model.is_empty()
        && request
            .reasoning
            .as_deref()
            .is_none_or(|effort| REASONING.contains(&effort))
        && !request.messages.is_empty()
        && request
            .messages
            .iter()
            .all(|message| ROLES.contains(&message.role.as_str()))
        && (1..=MAX_TOKENS).contains(&request.max_tokens)
        && chars <= MAX_MESSAGE_CHARS;
    if valid {
        Ok(url)
    } else {
        Err(AiError::new(AI_BAD_REQUEST))
    }
}

/// The JSON body: `{ model, messages, max_tokens, reasoning_effort? }`. No `response_format`: not
/// every model takes it, and the output is read from `content` (§5.1).
pub fn body(request: &Request) -> String {
    let mut body = serde_json::json!({
        "model": request.model,
        "messages": request.messages,
        "max_tokens": request.max_tokens,
    });
    if let Some(reasoning) = &request.reasoning {
        body["reasoning_effort"] = Value::from(reasoning.as_str());
    }
    body.to_string()
}

/// The headers besides the key and the content type, the same for both plans.
pub fn headers(request: &Request) -> [(&'static str, &str); 2] {
    [
        ("x-opencode-session", &request.session_id),
        ("User-Agent", USER_AGENT),
    ]
}

/// One `ai_complete`: checks the arguments, takes [`Busy`], reads the key, posts the body to the
/// plan's URL and reads the reply. `read_key` and `post` (URL, key, [`headers`], body) are the
/// Credential Manager and the HTTP call; neither runs for wrong arguments or while another request
/// runs.
pub fn complete(
    request: &Request,
    busy: &Busy,
    read_key: impl FnOnce() -> Result<Option<String>, AiError>,
    post: impl FnOnce(&str, &str, &[(&str, &str)], &str) -> Result<(u16, Vec<u8>), AiError>,
) -> Result<Completion, AiError> {
    let url = check(request)?;
    let _running = busy.start()?;
    let key = read_key()?.ok_or_else(|| AiError::new(AI_NO_KEY))?;
    let (status, reply_body) = post(url, &key, &headers(request), &body(request))?;
    reply(status, &reply_body, &key, &request.session_id)
}

/// Reads an HTTP reply: a 2xx carries `choices[0].message.content`; any other status is an error
/// with the start of the server's message, `key` and `session` masked out of it.
pub fn reply(status: u16, body: &[u8], key: &str, session: &str) -> Result<Completion, AiError> {
    if !(200..300).contains(&status) {
        let code = match status {
            401 | 403 => AI_UNAUTHORIZED,
            402 | 429 => AI_RATE_LIMITED,
            _ => AI_HTTP,
        };
        return Err(AiError {
            code,
            http_status: Some(status),
            message: server_message(body, [key, session]),
        });
    }
    let bad = || AiError::new(AI_BAD_RESPONSE);
    if body.len() as u64 > MAX_BODY {
        return Err(bad());
    }
    let reply: Value = serde_json::from_slice(body).map_err(|_| bad())?;
    let choice = &reply["choices"][0];
    let content = choice["message"]["content"].as_str().ok_or_else(bad)?;
    // The webview must never get the key (D-1 item 1), and an answer may be saved as it is.
    if !key.is_empty() && content.contains(key) {
        return Err(bad());
    }
    let tokens = |name: &str| reply["usage"][name].as_u64();
    Ok(Completion {
        content: content.to_owned(),
        prompt_tokens: tokens("prompt_tokens"),
        completion_tokens: tokens("completion_tokens"),
        finish_reason: choice["finish_reason"].as_str().map(str::to_owned),
    })
}

/// The server's error message: OpenAI's `error.message`, a plain `error` or `message`. A body
/// without one gives none, as the rest of a body may echo the request. The secrets are masked
/// before the cut, so no part of them is left at the end.
fn server_message(body: &[u8], secrets: [&str; 2]) -> Option<String> {
    let json: Value = serde_json::from_slice(body).ok()?;
    let message = [&json["error"]["message"], &json["error"], &json["message"]]
        .into_iter()
        .find_map(Value::as_str)?
        .trim();
    let masked = secrets
        .into_iter()
        .filter(|secret| !secret.is_empty())
        .fold(message.to_owned(), |text, secret| {
            text.replace(secret, "***")
        });
    let cut: String = masked.chars().take(MAX_SERVER_MESSAGE).collect();
    (!cut.is_empty()).then_some(cut)
}

/// A failed HTTP call; nothing of it is passed on but its code. Running out of the 10 s to reach
/// the server is a network error: the model was not asked yet.
pub fn transport_error(error: &ureq::Error) -> AiError {
    AiError::new(match error {
        ureq::Error::Timeout(ureq::Timeout::Resolve | ureq::Timeout::Connect) => AI_NETWORK,
        ureq::Error::Timeout(_) => AI_TIMEOUT,
        ureq::Error::Io(e) if e.kind() == std::io::ErrorKind::TimedOut => AI_TIMEOUT,
        _ => AI_NETWORK,
    })
}

/// The key as stored: trimmed, 1–512 characters of printable ASCII with no space, as Settings → AI
/// asks: any other character would fail only on each call, in the `Authorization` header.
pub fn clean_key(key: &str) -> Result<&str, AiError> {
    let key = key.trim();
    if (1..=MAX_KEY_CHARS).contains(&key.len()) && key.bytes().all(|byte| byte.is_ascii_graphic()) {
        Ok(key)
    } else {
        Err(AiError::new(AI_BAD_REQUEST))
    }
}

pub fn set_key(entry: &Entry, key: &str) -> Result<(), AiError> {
    entry.set_password(clean_key(key)?).map_err(keyring_error)
}

/// Deleting a key that is not there is fine.
pub fn delete_key(entry: &Entry) -> Result<(), AiError> {
    match entry.delete_credential() {
        Ok(()) | Err(KeyringError::NoEntry) => Ok(()),
        Err(error) => Err(keyring_error(error)),
    }
}

/// The key, `None` when none is stored.
pub fn read_key(entry: &Entry) -> Result<Option<String>, AiError> {
    match entry.get_password() {
        Ok(key) => Ok(Some(key)),
        Err(KeyringError::NoEntry) => Ok(None),
        Err(error) => Err(keyring_error(error)),
    }
}

/// Only the code: a keyring error can hold the stored bytes (`BadEncoding`).
fn keyring_error(_: KeyringError) -> AiError {
    AiError::new(AI_KEYRING)
}

/// The key's entry in the Windows Credential Manager. The store applies [`KEY_MODIFIERS`] when the
/// key is saved, so a key saved before keeps its kind until it is saved again.
#[cfg(windows)]
pub fn key_entry() -> Result<Entry, AiError> {
    use keyring_core::api::CredentialStoreApi;
    let modifiers = std::collections::HashMap::from(KEY_MODIFIERS);
    windows_native_keyring_store::Store::new()
        .and_then(|store| store.build(KEY_SERVICE, KEY_USER, Some(&modifiers)))
        .map_err(keyring_error)
}

/// The app runs on Windows only (ADR-0006); elsewhere there is no key store.
#[cfg(not(windows))]
pub fn key_entry() -> Result<Entry, AiError> {
    Err(AiError::new(AI_KEYRING))
}

/// The HTTP call of [`complete`], with the app's [`agent`].
pub fn post(
    url: &str,
    key: &str,
    headers: &[(&str, &str)],
    body: &str,
) -> Result<(u16, Vec<u8>), AiError> {
    post_with(&agent(), url, key, headers, body)
}

/// Speaks only HTTPS and follows no redirect (the URL is fixed, and the key goes nowhere else);
/// an HTTP error status is a reply to read, not a failed call.
fn agent() -> ureq::Agent {
    agent_with(TIMEOUT, CONNECT_TIMEOUT, true)
}

/// [`agent`] with other timeouts, or plain HTTP for the tests' local server.
fn agent_with(timeout: Duration, connect_timeout: Duration, https_only: bool) -> ureq::Agent {
    ureq::Agent::config_builder()
        .timeout_global(Some(timeout))
        .timeout_resolve(Some(connect_timeout))
        .timeout_connect(Some(connect_timeout))
        .http_status_as_error(false)
        .https_only(https_only)
        .max_redirects(0)
        .build()
        .into()
}

/// Posts `body` and returns the status and the body, read to one byte past [`MAX_BODY`] once
/// gzip is undone: a longer body shows as such without being held whole, though a gzip one can
/// unpack to a thousand times its size on the wire.
fn post_with(
    agent: &ureq::Agent,
    url: &str,
    key: &str,
    headers: &[(&str, &str)],
    body: &str,
) -> Result<(u16, Vec<u8>), AiError> {
    // A `User-Agent` set here replaces ureq's own.
    let mut request = agent
        .post(url)
        .header("Authorization", &format!("Bearer {key}"));
    for (name, value) in headers {
        request = request.header(*name, *value);
    }
    let mut response = request
        .content_type("application/json")
        .send(body)
        .map_err(|e| transport_error(&e))?;
    let status = response.status().as_u16();
    let mut bytes = Vec::new();
    response
        .body_mut()
        .as_reader()
        .take(MAX_BODY + 1)
        .read_to_end(&mut bytes)
        .map_err(|e| transport_error(&e.into()))?;
    Ok((status, bytes))
}

/// Opens [`CHATGPT_URL`] in the default browser through Explorer, named by its full path like
/// `open_folder` does (DR-54). The webview passes nothing.
pub fn chatgpt_command(
    system_root: Option<std::ffi::OsString>,
) -> std::io::Result<std::process::Command> {
    let mut command = std::process::Command::new(crate::storage::explorer(system_root)?);
    command.arg(CHATGPT_URL);
    Ok(command)
}

#[cfg(test)]
mod tests {
    use super::*;
    use keyring_core::api::CredentialStoreApi;
    use std::cell::Cell;
    use std::io::{Read, Write};
    use std::net::{TcpListener, TcpStream};
    use std::sync::{Arc, Mutex};

    const KEY: &str = "sk-test-SECRET-0123456789";
    const SESSION: &str = "0f3a9c1d-77be-4e21-a0c4-5d2e8b6f9a10";

    fn request(plan: &str) -> Request {
        Request {
            session_id: SESSION.into(),
            plan: plan.into(),
            model: "deepseek-v4.1-flash".into(),
            reasoning: Some("high".into()),
            messages: vec![
                Message {
                    role: "system".into(),
                    content: "Rules".into(),
                },
                Message {
                    role: "user".into(),
                    content: "Facts".into(),
                },
            ],
            max_tokens: 4000,
        }
    }

    const OK_REPLY: &str = r#"{"id":"x","choices":[{"index":0,"message":{"role":"assistant","content":"{\"a\":1}"},"finish_reason":"stop"}],"usage":{"prompt_tokens":120,"completion_tokens":45,"total_tokens":165}}"#;

    /// What `complete` posted: the URL, the headers besides the key's and the body.
    type Posted = (String, Vec<(String, String)>, String);

    /// `complete` with a stored key and a server answering `status` / `reply`; returns what it
    /// gave and what it posted.
    fn run(
        request: &Request,
        status: u16,
        reply: &str,
    ) -> (Result<Completion, AiError>, Option<Posted>) {
        let posted = std::cell::RefCell::new(None);
        let result = complete(
            request,
            &Busy::new(),
            || Ok(Some(KEY.into())),
            |url, key, headers, body| {
                assert_eq!(key, KEY);
                let headers = headers
                    .iter()
                    .map(|(name, value)| (name.to_string(), value.to_string()))
                    .collect();
                *posted.borrow_mut() = Some((url.to_owned(), headers, body.to_owned()));
                Ok((status, reply.as_bytes().to_vec()))
            },
        );
        (result, posted.into_inner())
    }

    fn json(text: &str) -> Value {
        serde_json::from_str(text).unwrap()
    }

    fn entry() -> Entry {
        keyring_core::mock::Store::new()
            .unwrap()
            .build(KEY_SERVICE, KEY_USER, None)
            .unwrap()
    }

    #[test]
    fn each_plan_posts_to_its_own_url() {
        assert_eq!(run(&request("GO"), 200, OK_REPLY).1.unwrap().0, GO_URL);
        assert_eq!(
            run(&request("CREDIT"), 200, OK_REPLY).1.unwrap().0,
            CREDIT_URL
        );
    }

    #[test]
    fn each_plan_sends_the_session_and_the_app_s_own_user_agent() {
        let user_agent = format!("Project-2C/{}", env!("CARGO_PKG_VERSION"));
        for plan in ["GO", "CREDIT"] {
            let (_, headers, body) = run(&request(plan), 200, OK_REPLY).1.unwrap();
            assert_eq!(
                headers,
                [
                    ("x-opencode-session".to_owned(), SESSION.to_owned()),
                    ("User-Agent".to_owned(), user_agent.clone()),
                ],
                "{plan}"
            );
            assert!(!body.contains(SESSION), "{plan}");
        }
    }

    #[test]
    fn the_body_sends_reasoning_effort_only_when_set_and_never_response_format() {
        let with = json(&body(&request("GO")));
        assert_eq!(
            with,
            json(
                r#"{"model":"deepseek-v4.1-flash","messages":[{"role":"system","content":"Rules"},{"role":"user","content":"Facts"}],"max_tokens":4000,"reasoning_effort":"high"}"#
            )
        );
        let without = json(&body(&Request {
            reasoning: None,
            ..request("GO")
        }));
        assert!(without.get("reasoning_effort").is_none());
        assert!(without.get("response_format").is_none());
        assert_eq!(without["max_tokens"], 4000);
    }

    #[test]
    fn a_reply_gives_its_content_token_counts_and_finish_reason() {
        assert_eq!(
            run(&request("GO"), 200, OK_REPLY).0,
            Ok(Completion {
                content: r#"{"a":1}"#.into(),
                prompt_tokens: Some(120),
                completion_tokens: Some(45),
                finish_reason: Some("stop".into()),
            })
        );
    }

    #[test]
    fn a_reply_without_usage_has_unknown_tokens_and_a_cut_one_says_length() {
        let reply = r#"{"choices":[{"message":{"content":"{\"hypo"},"finish_reason":"length"}]}"#;
        assert_eq!(
            super::reply(200, reply.as_bytes(), KEY, SESSION),
            Ok(Completion {
                content: r#"{"hypo"#.into(),
                prompt_tokens: None,
                completion_tokens: None,
                finish_reason: Some("length".into()),
            })
        );
        let bare = r#"{"choices":[{"message":{"content":"x"}}],"usage":{"prompt_tokens":3}}"#;
        assert_eq!(
            super::reply(200, bare.as_bytes(), KEY, SESSION),
            Ok(Completion {
                content: "x".into(),
                prompt_tokens: Some(3),
                completion_tokens: None,
                finish_reason: None,
            })
        );
    }

    #[test]
    fn a_reply_whose_content_holds_the_key_is_bad_response() {
        for content in [KEY.to_owned(), format!("Bearer {KEY} được gửi")] {
            let echo = serde_json::json!({ "choices": [{ "message": { "content": content } }] });
            assert_eq!(
                reply(200, echo.to_string().as_bytes(), KEY, SESSION),
                Err(AiError::new(AI_BAD_RESPONSE)),
                "{content}"
            );
        }
        // Only the whole key: the answer may well hold a piece of it by chance.
        let fine = format!(
            r#"{{"choices":[{{"message":{{"content":"{}"}}}}]}}"#,
            &KEY[..10]
        );
        assert!(reply(200, fine.as_bytes(), KEY, SESSION).is_ok());
    }

    #[test]
    fn an_unreadable_reply_is_bad_response() {
        for body in [
            "not json",
            "{}",
            r#"{"choices":[]}"#,
            r#"{"choices":[{"message":{}}]}"#,
            r#"{"choices":[{"message":{"content":null}}]}"#,
            r#"{"choices":[{"message":{"content":42}}]}"#,
        ] {
            assert_eq!(
                reply(200, body.as_bytes(), KEY, SESSION),
                Err(AiError::new(AI_BAD_RESPONSE)),
                "{body}"
            );
        }
    }

    /// A readable reply of exactly `size` bytes: `{"choices":…}` padded with spaces.
    fn padded_reply(size: usize) -> Vec<u8> {
        let mut reply = br#"{"choices":[{"message":{"content":"x"}}]}"#.to_vec();
        reply.resize(size, b' ');
        reply
    }

    #[test]
    fn a_reply_of_2_mb_is_read_and_one_byte_more_is_bad_response() {
        let limit = MAX_BODY as usize;
        assert!(reply(200, &padded_reply(limit), KEY, SESSION).is_ok());
        assert_eq!(
            reply(200, &padded_reply(limit + 1), KEY, SESSION),
            Err(AiError::new(AI_BAD_RESPONSE))
        );
    }

    fn http_error(code: &'static str, status: u16, message: &str) -> AiError {
        AiError {
            code,
            http_status: Some(status),
            message: Some(message.into()),
        }
    }

    #[test]
    fn http_statuses_map_to_their_codes_with_the_server_message() {
        let body = |message: &str| format!(r#"{{"error":{{"message":"{message}"}}}}"#);
        for (status, code) in [
            (401, AI_UNAUTHORIZED),
            (403, AI_UNAUTHORIZED),
            (402, AI_RATE_LIMITED),
            (429, AI_RATE_LIMITED),
            (500, AI_HTTP),
            (404, AI_HTTP),
            (302, AI_HTTP),
        ] {
            assert_eq!(
                reply(status, body("Nope").as_bytes(), KEY, SESSION),
                Err(http_error(code, status, "Nope")),
                "{status}"
            );
        }
    }

    #[test]
    fn the_server_message_is_read_from_the_usual_shapes_and_never_from_the_raw_body() {
        let echo = format!(
            "POST /v1/chat/completions\r\nx-opencode-session: {SESSION}\r\n\r\n{{\"messages\":[]}}"
        );
        for (body, message) in [
            (r#"{"error":{"message":"A"}}"#, Some("A")),
            (r#"{"error":"B"}"#, Some("B")),
            (r#"{"message":"  C \n"}"#, Some("C")),
            (r#"{"message":"   "}"#, None),
            ("  plain text\n", None),
            ("<html>Bad gateway</html>", None),
            (&echo, None),
            ("", None),
            (r#"{"error":{"code":1}}"#, None),
            (r#"{"choices":[]}"#, None),
        ] {
            assert_eq!(
                reply(500, body.as_bytes(), KEY, SESSION),
                Err(AiError {
                    code: AI_HTTP,
                    http_status: Some(500),
                    message: message.map(str::to_owned),
                }),
                "{body}"
            );
        }
    }

    #[test]
    fn the_server_message_is_cut_at_200_characters() {
        let long = format!(r#"{{"message":"{}"}}"#, "é".repeat(250));
        let message = reply(500, long.as_bytes(), KEY, SESSION)
            .unwrap_err()
            .message
            .unwrap();
        assert_eq!(message, "é".repeat(200));
    }

    #[test]
    fn wrong_arguments_are_bad_request_and_reach_neither_the_key_nor_the_network() {
        let role = |role: &str| Request {
            messages: vec![Message {
                role: role.into(),
                content: "x".into(),
            }],
            ..request("GO")
        };
        let session = |id: &str| Request {
            session_id: id.into(),
            ..request("GO")
        };
        let reasoning = |effort: &str| Request {
            reasoning: Some(effort.into()),
            ..request("GO")
        };
        let wrong = [
            session(""),
            session(&"a".repeat(65)),
            session("a b"),
            session("a_b"),
            session("a.b"),
            session("phiên"),
            session("abc\r\nX-Other: 1"),
            request("go"),
            request("ZEN"),
            request(""),
            Request {
                model: String::new(),
                ..request("GO")
            },
            role("tool"),
            role("System"),
            reasoning("HIGH"),
            reasoning("max"),
            reasoning(""),
            reasoning("high\r\nX-Other: 1"),
            Request {
                messages: vec![],
                ..request("GO")
            },
            Request {
                max_tokens: 0,
                ..request("GO")
            },
            Request {
                max_tokens: 16_001,
                ..request("GO")
            },
            Request {
                messages: vec![
                    Message {
                        role: "system".into(),
                        content: "x".repeat(100_000),
                    },
                    Message {
                        role: "user".into(),
                        content: "é".repeat(100_001),
                    },
                ],
                ..request("GO")
            },
        ];
        for request in wrong {
            let result = complete(
                &request,
                &Busy::new(),
                || panic!("read the key"),
                |_, _, _, _| panic!("called the network"),
            );
            assert_eq!(
                result,
                Err(AiError::new(AI_BAD_REQUEST)),
                "{} {:?}",
                request.plan,
                request.session_id
            );
        }
    }

    #[test]
    fn the_limits_themselves_are_allowed() {
        for request in [
            Request {
                session_id: "a".into(),
                ..request("GO")
            },
            Request {
                session_id: "Az09-".repeat(12) + "Az09",
                ..request("CREDIT")
            },
            Request {
                max_tokens: 1,
                ..request("GO")
            },
            Request {
                max_tokens: 16_000,
                ..request("CREDIT")
            },
            Request {
                reasoning: None,
                ..request("GO")
            },
            Request {
                reasoning: Some("low".into()),
                ..request("GO")
            },
            Request {
                reasoning: Some("medium".into()),
                ..request("CREDIT")
            },
            Request {
                messages: vec![Message {
                    role: "assistant".into(),
                    content: "é".repeat(200_000),
                }],
                ..request("GO")
            },
        ] {
            assert!(check(&request).is_ok());
        }
    }

    #[test]
    fn no_key_is_no_key_and_reaches_no_network() {
        let result = complete(
            &request("GO"),
            &Busy::new(),
            || Ok(None),
            |_, _, _, _| panic!("called the network"),
        );
        assert_eq!(result, Err(AiError::new(AI_NO_KEY)));
    }

    #[test]
    fn a_second_request_while_one_runs_is_busy_and_reaches_no_network() {
        let busy = Busy::new();
        let _running = busy.start().unwrap();
        let result = complete(
            &request("GO"),
            &busy,
            || panic!("read the key"),
            |_, _, _, _| panic!("called the network"),
        );
        assert_eq!(result, Err(AiError::new(AI_BUSY)));
    }

    #[test]
    fn the_flag_is_held_during_the_call_and_cleared_after_a_reply_an_error_or_a_timeout() {
        let busy = Busy::new();
        let outcomes: [Result<(u16, Vec<u8>), AiError>; 4] = [
            Ok((200, OK_REPLY.into())),
            Ok((500, vec![])),
            Err(AiError::new(AI_TIMEOUT)),
            Err(AiError::new(AI_NETWORK)),
        ];
        for outcome in outcomes {
            let held = Cell::new(false);
            let _ = complete(
                &request("GO"),
                &busy,
                || Ok(Some(KEY.into())),
                |_, _, _, _| {
                    held.set(busy.start().is_err());
                    outcome
                },
            );
            assert!(held.get());
            assert!(busy.start().is_ok());
        }
    }

    #[test]
    fn the_flag_is_cleared_after_a_failed_key_read_and_a_panic() {
        let busy = Busy::new();
        let _ = complete(
            &request("GO"),
            &busy,
            || Err(AiError::new(AI_KEYRING)),
            |_, _, _, _| panic!("called the network"),
        );
        assert!(busy.start().is_ok());
        let panicked = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            complete(
                &request("GO"),
                &busy,
                || Ok(Some(KEY.into())),
                |_, _, _, _| panic!("boom"),
            )
        }));
        assert!(panicked.is_err());
        assert!(busy.start().is_ok());
    }

    #[test]
    fn transport_errors_map_to_timeout_or_network() {
        use std::io;
        for (error, code) in [
            (ureq::Error::Timeout(ureq::Timeout::Global), AI_TIMEOUT),
            (ureq::Error::Timeout(ureq::Timeout::RecvBody), AI_TIMEOUT),
            (
                ureq::Error::Io(io::Error::new(io::ErrorKind::TimedOut, "t")),
                AI_TIMEOUT,
            ),
            // The 10 s to find and reach the server: nothing was asked of the model yet.
            (ureq::Error::Timeout(ureq::Timeout::Connect), AI_NETWORK),
            (ureq::Error::Timeout(ureq::Timeout::Resolve), AI_NETWORK),
            (ureq::Error::HostNotFound, AI_NETWORK),
            (ureq::Error::ConnectionFailed, AI_NETWORK),
            (ureq::Error::Tls("bad certificate"), AI_NETWORK),
            (
                ureq::Error::Io(io::Error::new(io::ErrorKind::ConnectionReset, "r")),
                AI_NETWORK,
            ),
        ] {
            assert_eq!(transport_error(&error), AiError::new(code), "{error}");
        }
    }

    #[test]
    fn no_error_carries_the_key_or_the_session() {
        let echo = format!(
            r#"{{"error":{{"message":"Invalid API key: {KEY} (Bearer {KEY}) in session {SESSION}"}}}}"#
        );
        // Masked before the cut at 200 characters, so no start of the key is left at the end.
        let long_echo = format!(r#"{{"message":"{}{KEY}"}}"#, "x".repeat(190));
        let errors = [
            reply(401, echo.as_bytes(), KEY, SESSION).unwrap_err(),
            reply(500, echo.as_bytes(), KEY, SESSION).unwrap_err(),
            reply(429, long_echo.as_bytes(), KEY, SESSION).unwrap_err(),
            reply(200, echo.as_bytes(), KEY, SESSION).unwrap_err(),
            run(&request("GO"), 403, &echo).0.unwrap_err(),
            run(&request("bad"), 200, OK_REPLY).0.unwrap_err(),
            clean_key(&format!("{KEY}{}", "k".repeat(MAX_KEY_CHARS))).unwrap_err(),
            clean_key(&format!("{KEY}\n{KEY}")).unwrap_err(),
        ];
        for error in errors {
            let sent = serde_json::to_string(&error).unwrap();
            for secret in [KEY, SESSION, &KEY[..4]] {
                assert!(!sent.contains(secret), "{sent}");
                assert!(!format!("{error:?}").contains(secret), "{error:?}");
            }
        }
        assert_eq!(
            reply(401, echo.as_bytes(), KEY, SESSION)
                .unwrap_err()
                .message
                .unwrap(),
            "Invalid API key: *** (Bearer ***) in session ***"
        );
    }

    #[test]
    fn an_error_is_sent_as_code_http_status_and_message() {
        assert_eq!(
            serde_json::to_value(http_error(AI_HTTP, 500, "Down")).unwrap(),
            json(r#"{"code":"AI_HTTP","httpStatus":500,"message":"Down"}"#)
        );
        assert_eq!(
            serde_json::to_value(AiError::new(AI_BUSY)).unwrap(),
            json(r#"{"code":"AI_BUSY"}"#)
        );
    }

    #[test]
    fn a_completion_is_sent_with_null_for_what_opencode_did_not_say() {
        assert_eq!(
            serde_json::to_value(Completion {
                content: "c".into(),
                prompt_tokens: Some(1),
                completion_tokens: Some(2),
                finish_reason: Some("length".into()),
            })
            .unwrap(),
            json(
                r#"{"content":"c","promptTokens":1,"completionTokens":2,"finishReason":"length"}"#
            )
        );
        assert_eq!(
            serde_json::to_value(Completion {
                content: "c".into(),
                prompt_tokens: None,
                completion_tokens: None,
                finish_reason: None,
            })
            .unwrap(),
            json(
                r#"{"content":"c","promptTokens":null,"completionTokens":null,"finishReason":null}"#
            )
        );
    }

    #[test]
    fn a_key_is_stored_trimmed_and_reported_until_deleted() {
        let entry = entry();
        assert_eq!(read_key(&entry), Ok(None));
        assert_eq!(delete_key(&entry), Ok(()));
        set_key(&entry, &format!("  {KEY}\n")).unwrap();
        assert_eq!(read_key(&entry), Ok(Some(KEY.into())));
        delete_key(&entry).unwrap();
        assert_eq!(read_key(&entry), Ok(None));
    }

    #[test]
    fn a_key_that_is_empty_over_512_characters_or_not_printable_ascii_is_bad_request_and_not_stored(
    ) {
        let entry = entry();
        for key in [
            "",
            "   \t\n",
            &"k".repeat(MAX_KEY_CHARS + 1),
            // Two keys pasted, a control character, a space, non-ASCII: each fails only on the
            // call (the `Authorization` header), as `AI_NETWORK`.
            &format!("{KEY}\n{KEY}"),
            &format!("{KEY}\r{KEY}"),
            &format!("{KEY}\0"),
            &format!("{KEY}\u{7f}"),
            "sk test",
            &format!("{KEY}\u{200b}"),
            &format!("\u{feff}{KEY}"),
            "sk-tăng",
        ] {
            assert_eq!(
                set_key(&entry, key),
                Err(AiError::new(AI_BAD_REQUEST)),
                "{key:?}"
            );
            assert_eq!(read_key(&entry), Ok(None));
        }
        assert_eq!(
            clean_key(&format!(" {} ", "k".repeat(MAX_KEY_CHARS))).map(str::len),
            Ok(512)
        );
        assert_eq!(clean_key("\t!sk-A_b.c~/+=\n"), Ok("!sk-A_b.c~/+="));
    }

    #[test]
    fn the_urls_and_the_key_s_entry_are_the_agreed_ones() {
        assert_eq!(GO_URL, "https://opencode.ai/zen/go/v1/chat/completions");
        assert_eq!(CREDIT_URL, "https://opencode.ai/zen/v1/chat/completions");
        // Renaming the entry would lose the key saved on every machine.
        assert_eq!((KEY_SERVICE, KEY_USER), ("Project-2C", "opencode-go"));
    }

    #[test]
    fn the_key_is_stored_local_to_this_machine() {
        assert_eq!(KEY_MODIFIERS, [("persistence", "Local")]);
        #[cfg(windows)]
        {
            let modifiers = std::collections::HashMap::from(KEY_MODIFIERS);
            let store = windows_native_keyring_store::Store::new().unwrap();
            assert!(store.build(KEY_SERVICE, KEY_USER, Some(&modifiers)).is_ok());
            // The store reads the value: a wrong one would fail here rather than store `Enterprise`.
            let wrong = std::collections::HashMap::from([("persistence", "Locale")]);
            assert!(store.build(KEY_SERVICE, KEY_USER, Some(&wrong)).is_err());
            assert!(key_entry().is_ok());
        }
    }

    #[test]
    fn a_credential_manager_failure_is_keyring_without_its_details() {
        let entry = entry();
        let fail = |error: KeyringError| {
            entry
                .as_any()
                .downcast_ref::<keyring_core::mock::Cred>()
                .unwrap()
                .set_error(error)
        };
        fail(KeyringError::BadEncoding(KEY.as_bytes().to_vec()));
        assert_eq!(read_key(&entry), Err(AiError::new(AI_KEYRING)));
        fail(KeyringError::NoStorageAccess("locked".into()));
        assert_eq!(set_key(&entry, KEY), Err(AiError::new(AI_KEYRING)));
        fail(KeyringError::PlatformFailure("failed".into()));
        assert_eq!(delete_key(&entry), Err(AiError::new(AI_KEYRING)));
    }

    // ---- the HTTP call, against a local server ---------------------------------------------------

    /// An HTTP/1.1 reply: `status`, more `headers` (each ending in CRLF) and `body`.
    fn http(status: u16, headers: &str, body: &[u8]) -> Vec<u8> {
        let mut reply = format!(
            "HTTP/1.1 {status} X\r\nContent-Length: {}\r\nConnection: close\r\n{headers}\r\n",
            body.len()
        )
        .into_bytes();
        reply.extend_from_slice(body);
        reply
    }

    /// Reads one request, its head and the body its `Content-Length` announces.
    fn read_request(stream: &mut TcpStream) -> String {
        let mut request = Vec::new();
        let mut buffer = [0; 8192];
        loop {
            let read = stream.read(&mut buffer).unwrap();
            request.extend_from_slice(&buffer[..read]);
            let text = String::from_utf8_lossy(&request);
            let complete = text.find("\r\n\r\n").is_some_and(|end| {
                let length: usize = text[..end]
                    .lines()
                    .find_map(|line| {
                        let line = line.to_ascii_lowercase();
                        Some(
                            line.strip_prefix("content-length:")?
                                .trim()
                                .parse()
                                .unwrap(),
                        )
                    })
                    .unwrap_or(0);
                request.len() >= end + 4 + length
            });
            if complete || read == 0 {
                return text.into_owned();
            }
        }
    }

    /// A local HTTP server answering each connection with the next of `replies`; gives its URL and
    /// the requests it read.
    fn serve(replies: Vec<Vec<u8>>) -> (String, Arc<Mutex<Vec<String>>>) {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let url = format!(
            "http://{}/v1/chat/completions",
            listener.local_addr().unwrap()
        );
        let requests = Arc::new(Mutex::new(Vec::new()));
        let seen = Arc::clone(&requests);
        std::thread::spawn(move || {
            for (reply, stream) in replies.into_iter().zip(listener.incoming()) {
                let mut stream = stream.unwrap();
                let request = read_request(&mut stream);
                seen.lock().unwrap().push(request);
                // Fails when the client stops reading past `MAX_BODY` and closes.
                let _ = stream.write_all(&reply);
            }
        });
        (url, requests)
    }

    /// The app's agent but for plain HTTP, which the local server speaks.
    fn local() -> ureq::Agent {
        agent_with(TIMEOUT, CONNECT_TIMEOUT, false)
    }

    /// [`post_with`] of `request("GO")` with the stored key.
    fn post_local(agent: &ureq::Agent, url: &str) -> Result<(u16, Vec<u8>), AiError> {
        let request = request("GO");
        post_with(agent, url, KEY, &headers(&request), &body(&request))
    }

    /// The CRC-32 of `bytes`, which gzip checks after unpacking.
    fn crc32(bytes: impl Iterator<Item = u8>) -> u32 {
        let table: Vec<u32> = (0..256)
            .map(|n| {
                (0..8).fold(n, |c, _| {
                    if c & 1 == 1 {
                        0xedb8_8320 ^ (c >> 1)
                    } else {
                        c >> 1
                    }
                })
            })
            .collect();
        !bytes.fold(!0, |crc, byte| {
            table[((crc ^ u32::from(byte)) & 0xff) as usize] ^ (crc >> 8)
        })
    }

    /// `data` then `spaces` spaces, gzipped as a server would: the spaces as copies of 258 bytes
    /// from one byte back (fixed Huffman codes, RFC 1951), so 16 MB pack into about 100 KB.
    fn gzip(data: &[u8], spaces: usize) -> Vec<u8> {
        struct Bits {
            out: Vec<u8>,
            bits: u64,
            count: u32,
        }
        impl Bits {
            /// `count` bits of `value`, least significant first.
            fn put(&mut self, value: u32, count: u32) {
                self.bits |= u64::from(value) << self.count;
                self.count += count;
                while self.count >= 8 {
                    self.out.push(self.bits as u8);
                    self.bits >>= 8;
                    self.count -= 8;
                }
            }
            /// A Huffman code, most significant bit first.
            fn code(&mut self, code: u32, length: u32) {
                self.put(code.reverse_bits() >> (32 - length), length);
            }
            fn literal(&mut self, byte: u8) {
                match byte {
                    0..=143 => self.code(0x30 + u32::from(byte), 8),
                    _ => self.code(0x190 + u32::from(byte) - 144, 9),
                }
            }
        }
        let header = vec![0x1f, 0x8b, 8, 0, 0, 0, 0, 0, 0, 255];
        let mut bits = Bits {
            out: header,
            bits: 0,
            count: 0,
        };
        bits.put(1, 1); // the last block
        bits.put(1, 2); // fixed Huffman codes
        data.iter().for_each(|&byte| bits.literal(byte));
        let mut left = spaces;
        if left > 0 {
            bits.literal(b' ');
            left -= 1;
        }
        while left >= 258 {
            bits.code(0xc5, 8); // length 258 (code 285)
            bits.code(0, 5); // distance 1
            left -= 258;
        }
        (0..left).for_each(|_| bits.literal(b' '));
        bits.code(0, 7); // end of block
        bits.put(0, 7); // up to the next byte
        let mut out = bits.out;
        let all = data
            .iter()
            .copied()
            .chain(std::iter::repeat_n(b' ', spaces));
        out.extend_from_slice(&crc32(all).to_le_bytes());
        out.extend_from_slice(&((data.len() + spaces) as u32).to_le_bytes());
        out
    }

    #[test]
    fn the_call_sends_the_key_the_session_one_user_agent_and_the_body() {
        let (url, requests) = serve(vec![http(200, "", OK_REPLY.as_bytes())]);
        assert_eq!(
            post_local(&local(), &url),
            Ok((200, OK_REPLY.as_bytes().to_vec()))
        );
        let requests = requests.lock().unwrap();
        let [sent] = requests.as_slice() else {
            panic!("{requests:?}")
        };
        let (head, sent_body) = sent.split_once("\r\n\r\n").unwrap();
        let mut lines = head.lines();
        assert_eq!(lines.next(), Some("POST /v1/chat/completions HTTP/1.1"));
        let headers: Vec<(String, &str)> = lines
            .map(|line| {
                let (name, value) = line.split_once(": ").unwrap();
                (name.to_ascii_lowercase(), value)
            })
            .collect();
        let values = |name: &str| -> Vec<&str> {
            headers
                .iter()
                .filter(|(header, _)| header == name)
                .map(|(_, value)| *value)
                .collect()
        };
        assert_eq!(values("authorization"), [format!("Bearer {KEY}")]);
        assert_eq!(values("x-opencode-session"), [SESSION]);
        assert_eq!(values("user-agent"), [USER_AGENT]);
        assert_eq!(values("content-type"), ["application/json"]);
        assert_eq!(sent_body, body(&request("GO")));
    }

    #[test]
    fn an_error_status_is_read_as_a_reply_and_a_redirect_is_not_followed() {
        let error = br#"{"error":{"message":"Nope"}}"#;
        for status in [401, 429, 500] {
            let (url, _) = serve(vec![http(status, "", error)]);
            assert_eq!(post_local(&local(), &url), Ok((status, error.to_vec())));
        }
        // Followed, the second request would get the 200.
        let (url, requests) = serve(vec![
            http(302, "Location: /v1/elsewhere\r\n", b""),
            http(200, "", OK_REPLY.as_bytes()),
        ]);
        let (status, reply_body) = post_local(&local(), &url).unwrap();
        assert_eq!(
            reply(status, &reply_body, KEY, SESSION),
            Err(AiError {
                code: AI_HTTP,
                http_status: Some(302),
                message: None,
            })
        );
        assert_eq!(requests.lock().unwrap().len(), 1);
    }

    #[test]
    fn a_body_is_read_to_2_mb_and_one_byte_more_shows_it_is_longer() {
        let limit = MAX_BODY as usize;
        for (size, read, readable) in [
            (limit, limit, true),
            (limit + 1, limit + 1, false),
            (3 * limit, limit + 1, false),
        ] {
            let (url, _) = serve(vec![http(200, "", &padded_reply(size))]);
            let (status, reply_body) = post_local(&local(), &url).unwrap();
            assert_eq!((status, reply_body.len()), (200, read), "{size}");
            assert_eq!(
                reply(status, &reply_body, KEY, SESSION).is_ok(),
                readable,
                "{size}"
            );
        }
    }

    #[test]
    fn an_error_reply_over_2_mb_keeps_its_http_status() {
        // Its first 2 MB are still whole JSON, its message read as usual.
        let mut huge = br#"{"error":{"message":"Bad gateway"}}"#.to_vec();
        huge.resize(3 * MAX_BODY as usize, b' ');
        let (url, _) = serve(vec![http(502, "", &huge)]);
        let (status, reply_body) = post_local(&local(), &url).unwrap();
        assert_eq!(
            reply(status, &reply_body, KEY, SESSION),
            Err(http_error(AI_HTTP, 502, "Bad gateway"))
        );
        let cut = "x".repeat(3 * MAX_BODY as usize);
        let (url, _) = serve(vec![http(503, "", cut.as_bytes())]);
        let (status, reply_body) = post_local(&local(), &url).unwrap();
        assert_eq!(
            reply(status, &reply_body, KEY, SESSION),
            Err(AiError {
                code: AI_HTTP,
                http_status: Some(503),
                message: None,
            })
        );
    }

    #[test]
    fn a_gzip_reply_is_unpacked_and_read_to_2_mb_however_small_it_is_on_the_wire() {
        let json = br#"{"choices":[{"message":{"content":"x"}}]}"#;
        let gzipped = |packed: &[u8]| http(200, "Content-Encoding: gzip\r\n", packed);
        let (url, _) = serve(vec![gzipped(&gzip(json, 1000))]);
        let mut unpacked = json.to_vec();
        unpacked.resize(json.len() + 1000, b' ');
        assert_eq!(post_local(&local(), &url), Ok((200, unpacked)));
        // 16 MB from about 100 KB: reading stops one byte past 2 MB, the rest is never unpacked.
        let bomb = gzip(json, 16 << 20);
        assert!(bomb.len() < 200_000, "{}", bomb.len());
        let (url, _) = serve(vec![gzipped(&bomb)]);
        let (status, reply_body) = post_local(&local(), &url).unwrap();
        assert_eq!(reply_body.len() as u64, MAX_BODY + 1);
        assert_eq!(
            reply(status, &reply_body, KEY, SESSION),
            Err(AiError::new(AI_BAD_RESPONSE))
        );
    }

    #[test]
    fn a_server_that_never_answers_the_tls_handshake_is_a_network_error() {
        // Never accepted: the system completes the TCP handshake, the TLS one then waits.
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let url = format!("https://{}/", listener.local_addr().unwrap());
        let agent = agent_with(TIMEOUT, Duration::from_millis(300), true);
        let started = std::time::Instant::now();
        assert_eq!(
            post_with(&agent, &url, KEY, &[], "{}"),
            Err(AiError::new(AI_NETWORK))
        );
        assert!(started.elapsed() < Duration::from_secs(10));
    }

    #[test]
    fn a_reply_that_stops_coming_is_a_timeout() {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let url = format!("http://{}/", listener.local_addr().unwrap());
        std::thread::spawn(move || {
            let (mut stream, _) = listener.accept().unwrap();
            read_request(&mut stream);
            // The head and the first byte of the body, then nothing.
            stream
                .write_all(b"HTTP/1.1 200 OK\r\nContent-Length: 100\r\n\r\n{")
                .unwrap();
            std::thread::sleep(Duration::from_secs(10));
        });
        let agent = agent_with(Duration::from_millis(500), CONNECT_TIMEOUT, false);
        assert_eq!(
            post_with(&agent, &url, KEY, &[], "{}"),
            Err(AiError::new(AI_TIMEOUT))
        );
    }

    #[test]
    fn the_app_s_agent_speaks_only_https_follows_no_redirect_and_has_the_spec_s_timeouts() {
        let (url, requests) = serve(vec![http(200, "", OK_REPLY.as_bytes())]);
        assert_eq!(post(&url, KEY, &[], "{}"), Err(AiError::new(AI_NETWORK)));
        assert!(requests.lock().unwrap().is_empty());
        assert_eq!(
            (TIMEOUT, CONNECT_TIMEOUT),
            (Duration::from_secs(120), Duration::from_secs(10))
        );
        let app = agent();
        let config = app.config();
        assert!(config.https_only());
        assert!(!config.http_status_as_error());
        assert_eq!(config.max_redirects(), 0);
        let timeouts = config.timeouts();
        assert_eq!(
            (timeouts.global, timeouts.resolve, timeouts.connect),
            (Some(TIMEOUT), Some(CONNECT_TIMEOUT), Some(CONNECT_TIMEOUT))
        );
    }

    #[test]
    fn open_chatgpt_runs_explorer_by_its_full_path_on_the_fixed_url_only() {
        let command = chatgpt_command(Some(r"C:\Windows".into())).unwrap();
        assert_eq!(
            command.get_program(),
            std::path::Path::new(r"C:\Windows").join("explorer.exe")
        );
        assert_eq!(command.get_args().collect::<Vec<_>>(), [CHATGPT_URL]);
        assert_eq!(CHATGPT_URL, "https://chatgpt.com/");
        assert!(chatgpt_command(None).is_err());
    }
}
