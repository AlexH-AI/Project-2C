// The AI commands (spec Phase 5 §5, ADR-0009 D-1 / W-1): OpenCode's chat endpoint called from Rust
// with the key kept in the Windows Credential Manager, so the webview never sees the key and never
// talks to the network (the CSP stays `'self'`). One AI request runs at a time ([`Busy`]). The
// logic here takes the key store and the HTTP call as arguments, so tests run on sample data only.

use keyring_core::{Entry, Error as KeyringError};
use serde::{Deserialize, Serialize};
use serde_json::Value;
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

pub const TIMEOUT: Duration = Duration::from_secs(120);
pub const CONNECT_TIMEOUT: Duration = Duration::from_secs(10);
/// The most of a reply body that is read; a longer one is `AI_BAD_RESPONSE`.
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
/// the start of the server's own error message, with the key masked; never a header or the
/// request body.
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
    pub prompt_tokens: u64,
    pub completion_tokens: u64,
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
    reply(status, &reply_body, &key)
}

/// Reads an HTTP reply: a 2xx carries `choices[0].message.content`; any other status is an error
/// with the start of the server's message, `key` masked out of it.
pub fn reply(status: u16, body: &[u8], key: &str) -> Result<Completion, AiError> {
    if !(200..300).contains(&status) {
        let code = match status {
            401 | 403 => AI_UNAUTHORIZED,
            402 | 429 => AI_RATE_LIMITED,
            _ => AI_HTTP,
        };
        return Err(AiError {
            code,
            http_status: Some(status),
            message: server_message(body, key),
        });
    }
    let bad = || AiError::new(AI_BAD_RESPONSE);
    if body.len() as u64 > MAX_BODY {
        return Err(bad());
    }
    let reply: Value = serde_json::from_slice(body).map_err(|_| bad())?;
    let content = reply["choices"][0]["message"]["content"]
        .as_str()
        .ok_or_else(bad)?;
    let tokens = |name: &str| reply["usage"][name].as_u64().unwrap_or(0);
    Ok(Completion {
        content: content.to_owned(),
        prompt_tokens: tokens("prompt_tokens"),
        completion_tokens: tokens("completion_tokens"),
    })
}

/// The server's error message: OpenAI's `error.message`, a plain `error` or `message`, else the
/// body as text. The key is masked before the cut, so no part of it is left at the end.
fn server_message(body: &[u8], key: &str) -> Option<String> {
    let text = String::from_utf8_lossy(body);
    let json: Option<Value> = serde_json::from_str(&text).ok();
    let message = json
        .as_ref()
        .and_then(|json| {
            [&json["error"]["message"], &json["error"], &json["message"]]
                .into_iter()
                .find_map(Value::as_str)
        })
        .unwrap_or(&text)
        .trim();
    let masked = if key.is_empty() {
        message.to_owned()
    } else {
        message.replace(key, "***")
    };
    let cut: String = masked.chars().take(MAX_SERVER_MESSAGE).collect();
    (!cut.is_empty()).then_some(cut)
}

/// A failed HTTP call; nothing of it is passed on but its code.
pub fn transport_error(error: &ureq::Error) -> AiError {
    AiError::new(match error {
        ureq::Error::Timeout(_) => AI_TIMEOUT,
        ureq::Error::Io(e) if e.kind() == std::io::ErrorKind::TimedOut => AI_TIMEOUT,
        ureq::Error::BodyExceedsLimit(_) => AI_BAD_RESPONSE,
        _ => AI_NETWORK,
    })
}

/// The key as stored: trimmed, 1–512 characters.
pub fn clean_key(key: &str) -> Result<&str, AiError> {
    let key = key.trim();
    if key.is_empty() || key.chars().count() > MAX_KEY_CHARS {
        Err(AiError::new(AI_BAD_REQUEST))
    } else {
        Ok(key)
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

/// The key's entry in the Windows Credential Manager.
#[cfg(windows)]
pub fn key_entry() -> Result<Entry, AiError> {
    use keyring_core::api::CredentialStoreApi;
    windows_native_keyring_store::Store::new()
        .and_then(|store| store.build(KEY_SERVICE, KEY_USER, None))
        .map_err(keyring_error)
}

/// The app runs on Windows only (ADR-0006); elsewhere there is no key store.
#[cfg(not(windows))]
pub fn key_entry() -> Result<Entry, AiError> {
    Err(AiError::new(AI_KEYRING))
}

/// The HTTP call of [`complete`]: returns the status and at most [`MAX_BODY`] of the body. No
/// redirect is followed (the URL is fixed) and only HTTPS is spoken.
pub fn post(
    url: &str,
    key: &str,
    headers: &[(&str, &str)],
    body: &str,
) -> Result<(u16, Vec<u8>), AiError> {
    let agent: ureq::Agent = ureq::Agent::config_builder()
        .timeout_global(Some(TIMEOUT))
        .timeout_connect(Some(CONNECT_TIMEOUT))
        .http_status_as_error(false)
        .https_only(true)
        .max_redirects(0)
        .build()
        .into();
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
    let bytes = response
        .body_mut()
        .with_config()
        .limit(MAX_BODY)
        .read_to_vec()
        .map_err(|e| transport_error(&e))?;
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

    const OK_REPLY: &str = r#"{"id":"x","choices":[{"index":0,"message":{"role":"assistant","content":"{\"a\":1}"}}],"usage":{"prompt_tokens":120,"completion_tokens":45,"total_tokens":165}}"#;

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
    fn a_reply_gives_its_content_and_token_counts() {
        assert_eq!(
            run(&request("GO"), 200, OK_REPLY).0,
            Ok(Completion {
                content: r#"{"a":1}"#.into(),
                prompt_tokens: 120,
                completion_tokens: 45,
            })
        );
    }

    #[test]
    fn a_reply_without_usage_counts_no_tokens() {
        let reply = r#"{"choices":[{"message":{"content":"x"}}]}"#;
        assert_eq!(
            super::reply(200, reply.as_bytes(), KEY),
            Ok(Completion {
                content: "x".into(),
                prompt_tokens: 0,
                completion_tokens: 0,
            })
        );
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
                reply(200, body.as_bytes(), KEY),
                Err(AiError::new(AI_BAD_RESPONSE)),
                "{body}"
            );
        }
    }

    #[test]
    fn a_reply_over_2_mb_is_bad_response() {
        let content = "x".repeat(MAX_BODY as usize);
        let big = format!(r#"{{"choices":[{{"message":{{"content":"{content}"}}}}]}}"#);
        assert_eq!(
            reply(200, big.as_bytes(), KEY),
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
                reply(status, body("Nope").as_bytes(), KEY),
                Err(http_error(code, status, "Nope")),
                "{status}"
            );
        }
    }

    #[test]
    fn the_server_message_is_read_from_the_usual_shapes_or_the_raw_text() {
        for (body, message) in [
            (r#"{"error":{"message":"A"}}"#, Some("A")),
            (r#"{"error":"B"}"#, Some("B")),
            (r#"{"message":"C"}"#, Some("C")),
            ("  plain text\n", Some("plain text")),
            ("", None),
            (r#"{"error":{"code":1}}"#, Some(r#"{"error":{"code":1}}"#)),
        ] {
            assert_eq!(
                reply(500, body.as_bytes(), KEY)
                    .unwrap_err()
                    .message
                    .as_deref(),
                message,
                "{body}"
            );
        }
    }

    #[test]
    fn the_server_message_is_cut_at_200_characters() {
        let long = "é".repeat(250);
        let message = reply(500, long.as_bytes(), KEY)
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
    fn transport_errors_map_to_timeout_network_or_bad_response() {
        use std::io;
        for (error, code) in [
            (ureq::Error::Timeout(ureq::Timeout::Global), AI_TIMEOUT),
            (ureq::Error::Timeout(ureq::Timeout::Connect), AI_TIMEOUT),
            (
                ureq::Error::Io(io::Error::new(io::ErrorKind::TimedOut, "t")),
                AI_TIMEOUT,
            ),
            (ureq::Error::BodyExceedsLimit(MAX_BODY), AI_BAD_RESPONSE),
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
    fn no_error_carries_the_key() {
        let echo = format!(r#"{{"error":{{"message":"Invalid API key: {KEY} (Bearer {KEY})"}}}}"#);
        let long_echo = format!("{}{KEY}", "x".repeat(190));
        let errors = [
            reply(401, echo.as_bytes(), KEY).unwrap_err(),
            reply(500, echo.as_bytes(), KEY).unwrap_err(),
            reply(429, long_echo.as_bytes(), KEY).unwrap_err(),
            reply(200, echo.as_bytes(), KEY).unwrap_err(),
            run(&request("GO"), 403, &echo).0.unwrap_err(),
            run(&request("bad"), 200, OK_REPLY).0.unwrap_err(),
            clean_key(&format!("{KEY}{}", "k".repeat(MAX_KEY_CHARS))).unwrap_err(),
        ];
        for error in errors {
            let sent = serde_json::to_string(&error).unwrap();
            assert!(!sent.contains(KEY), "{sent}");
            assert!(!format!("{error:?}").contains(KEY), "{error:?}");
        }
        assert_eq!(
            reply(401, echo.as_bytes(), KEY)
                .unwrap_err()
                .message
                .unwrap(),
            "Invalid API key: *** (Bearer ***)"
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
        assert_eq!(
            serde_json::to_value(Completion {
                content: "c".into(),
                prompt_tokens: 1,
                completion_tokens: 2,
            })
            .unwrap(),
            json(r#"{"content":"c","promptTokens":1,"completionTokens":2}"#)
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
    fn an_empty_or_over_512_character_key_is_bad_request_and_not_stored() {
        let entry = entry();
        for key in ["", "   \t\n", &"k".repeat(MAX_KEY_CHARS + 1)] {
            assert_eq!(set_key(&entry, key), Err(AiError::new(AI_BAD_REQUEST)));
            assert_eq!(read_key(&entry), Ok(None));
        }
        assert_eq!(
            clean_key(&format!(" {} ", "k".repeat(MAX_KEY_CHARS))).map(str::len),
            Ok(512)
        );
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
