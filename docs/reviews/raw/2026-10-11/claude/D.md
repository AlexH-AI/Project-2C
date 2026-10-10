# Review lại Phase 5 (vòng 2) — Claude, gói D: xuyên gói + CI / tools, kết luận G7

- **SHA:** `705ea7c`. Đã kiểm `git rev-parse HEAD` = `705ea7c0e76d…` lúc đầu và lúc cuối phiên. Worktree `C:\workspace\Project-2C-review`, Home PC.
- **Reviewer:** Claude Opus 5.5, phiên sạch, không subagent. Không mở / liệt kê / tìm trong `deep-review-5-r2\codex\`. Đã đọc `claude\A.md`, `B.md`, `C.md` (vòng 2); mục đã báo ở đó chỉ dẫn ID.
- **Không gọi AI thật:** probe đầu-cuối dùng IPC giả trả đúng dạng `Completion` / `AiError` của `ai.rs`, nội dung "đúng" lấy từ Mock adapter. Không đụng Credential Manager, không mở chatgpt.com.
- **Cách probe:** mọi thứ ở `C:\workspace\deep-review-5-r2\claude\D\` (phụ lục §8). Đột biến / gỡ sửa áp vào worktree, chạy test, rồi `git checkout --` ngay. Hai file tạm dưới `docs/reviews/raw/zz-probe-D/` (CL2-D1) tạo rồi xóa ngay trong cùng lệnh. Cuối phiên `git status --short` **sạch**; `vitest run` toàn repo: **103 file, 2 215 test xanh** (khớp baseline).

## 1. Bảng R của gói D

| DR5 | Issue | Kết luận | Bằng chứng (tái hiện cũ ra gì; test nào đỏ khi gỡ sửa) | Ghi chú |
|---|---|---|---|---|
| 57 | #482 T-189 | **ĐÃ SỬA**; còn biến thể gần → CL2-D1, CL2-D2, CL2-D3 | Tái hiện vòng 1 (`r57-repro.mjs`): `pr-core.mjs` ở `0df3606` cho `isDocsOnly(['docs/design/phase-5-prompts.md'])` = **true**, `['docs/golden/ai-eval.md']` = **true**, `ci.yml` không có dòng nào cho hai file. Ở `705ea7c`: cả hai **false**, `docs/reviews/x.md` vẫn true, `ci.yml` liệt kê cả hai ở **cả** khối `pull_request` lẫn `push`. `merge-pr` (`mergeBlockers`), `pr-status` và kiểm "main nhận code sau lúc CI bắt đầu" (`mainSince`) đều đi qua `isDocsOnly`, nên cùng coi hai tài liệu là code. Đột biến (`mutate.mjs`, `tools/pr-core.test.mjs` 59 test): gỡ trọn phần sửa → **1 đỏ**; bỏ `phase-5-prompts.md` khỏi khối `pull_request` → **1 đỏ**; bỏ `ai-eval.md` khỏi khối `push` → **1 đỏ**; bỏ khỏi `CODE_DOCS` → **2 đỏ**; thêm `docs/golden/kyc.md` vào cả hai khối → **1 đỏ** (test so đúng bằng, bắt cả dòng thừa); `isDocsOnly` dùng lại `CODEMAP_DOCS` → **1 đỏ**. Đối chứng tương đương (đổi thứ tự hai dòng) sống | Ngưỡng GitHub `paths`: mẫu sau thắng mẫu trước, nên `'**'` → `'!docs/**'` → `'!**/*.md'` → `'docs/design/phase-5-prompts.md'` đưa file trở lại. CI của #496 chạy Verify (11 phút), xanh. Ngoài hai tài liệu G5 + 5 `CLAUDE.md` của package, repo không có test / script `verify` nào đọc file `.md` khác (`git grep` §3) |

## 2. Bảng R gộp — đủ 35 DR5 (A + B + C + D)

Kết luận lấy nguyên từ báo cáo gói kiểm chính; "→" chỉ phát hiện biến thể gần (không phải HỒI QUY).

| DR5 | Issue | Gói | Kết luận | Bằng chứng chính | Biến thể / ghi chú |
|---|---|---|---|---|---|
| 05 (Rust) | #487 T-194 | B | ĐÃ SỬA | `finish_reason` từ `choices[0]` tới JS; gỡ → 2 test Rust đỏ; đổi kiểu TS → `tauri-contract` đỏ | → CL2-B4 (`content: null` + `length` mất `finish_reason`, Nit). Phần `packages/ai` là KNOWN #492 |
| 13 | #485 T-192 | A | ĐÃ SỬA | Output ACCEPTED sai schema / `evidence` lạ → `AI_ANALYSIS_INVALID`; 1 430 dòng do app sinh: 0 bị lệnh từ chối, nhập lại `ok`; gỡ → 2 đỏ | — |
| 14 | #485 | A | ĐÃ SỬA | NUL chèn vào từng giá trị chữ của backup: 97 / 97 `BACKUP_INVALID`; gỡ → 3 đỏ | → CL2-A4 (`optionalText` của lịch hẹn nhận NUL, Nit, Phase 2–3) |
| 15 | #490 T-196 | A (db) + C (panel) | ĐÃ SỬA (db, panel) | Xác nhận lại cùng giá trị: phiên bản giữ, CURRENT, `F2` → dữ kiện hiện hành; gỡ ánh xạ → 2 unit + 1 e2e đỏ | → CL2-C1 (khối AI ở lịch hẹn vẫn tính mức theo ngày cũ, Low; ngoài file Issue cho sửa) |
| 16 | #485 | A | ĐÃ SỬA | 10 / 10 ca ở lệnh `AI_ANALYSIS_INVALID`, 5 / 5 ở nhập `BACKUP_INVALID`; gỡ ràng chéo → 4 đỏ | — |
| 20 | #487 | B | ĐÃ SỬA | Bom gzip 4 GB → đọc 2 097 153 B, `AI_BAD_RESPONSE`, +6,6 MB RAM; gỡ `take` → 2 đỏ | — |
| 21 | #487 | B | ĐÃ SỬA | Đúng 2 MB nhận, 2 MB + 1 từ chối qua gzip / chunked / đọc tới khi đóng; `>` → `>=` → 2 đỏ | — |
| 22 | #487 | B | ĐÃ SỬA | Kết nối chặn → `AI_NETWORK` sau 701 ms; hết 120 s → `AI_TIMEOUT`; gỡ nhánh → 2 đỏ | Hết hạn phân giải tên chỉ đọc code |
| 24 | #487 | B | ĐÃ SỬA | 14 / 14 đột biến sống vòng 1 giờ bị giết | → CL2-B1 (`key_entry` không ghim `Local`, Low, T) |
| 25 | #487 | B | ĐÃ SỬA | Store thật, mục tạm: lưu với `Local` → `Local`; mục cũ `Enterprise` đọc được, lưu lại thành `Local` | → CL2-B1 |
| 26 | #487 | B | ĐÃ SỬA | Key có LF → `AI_BAD_REQUEST`; 11 ca; gỡ luật ASCII → 2 đỏ | Luật Rust = luật webview |
| 27 | #487 | B | ĐÃ SỬA | Thân không phải JSON không lộ; key / mã phiên che; 502 3 MB giữ mã; gỡ từng phần → 1–2 đỏ | → CL2-B2 (thân lỗi đọc hỏng mất mã HTTP, Nit) |
| 28 | #487 | B | ĐÃ SỬA | `content` chứa key → `AI_BAD_RESPONSE`; gỡ → 1 đỏ | → CL2-B3 (`finish_reason` không qua kiểm key / trần, Nit) |
| 29 | #487 | B | ĐÃ SỬA | Không `usage` → token `null` qua dây; `unwrap_or(0)` → 1 đỏ. D (§4 trục C): một lần thử `null` → tổng `null`, vòng backup giữ nguyên | — |
| 30 | #486 T-193 | C | ĐÃ SỬA | 502 / 429 / 401 kèm "(HTTP n)" ở panel và trích xuất; gỡ → 3 unit + 1 e2e đỏ. D: 12 / 12 ca lỗi từ Rust ra **cùng câu** ở panel, trích xuất, Cài đặt (§4) | — |
| 31 | #486 | C | ĐÃ SỬA | Dòng đang chạy giữ model lúc bấm (e2e); gỡ → 1 e2e / 1 unit đỏ mỗi chỗ | — |
| 32 | #486 | C | ĐÃ SỬA | Ô key `password`, `spellcheck=false`, `autocomplete=off`; `text` → 1 e2e đỏ | — |
| 33 | #489 T-195 | C | ĐÃ SỬA | Vùng live có sẵn, "Phân tích xong…" / "AI trích xuất xong…"; gỡ → 2 / 1 e2e đỏ | → CL2-C3 (câu từ chối tại khung dán không được đọc, Low), CL2-C4 (PLAUSIBLE, Nit) |
| 35 | #485 | A | ĐÃ SỬA | `isIssue` kiểm `code` / `path` / `detail`; về bản cũ → 1 đỏ | — |
| 36 | #484 T-191 | C | ĐÃ SỬA | Nhập backup cùng ID → `discarded`; bỏ kiểm thế hệ → 2 đỏ; tăng trước khi thay xong → 1 đỏ | Seed lỗi: thế hệ giữ, kết quả lưu |
| 37 | #486 | C | ĐÃ SỬA | Trạng thái key về muộn không đè; bỏ chặn → 1 e2e đỏ | — |
| 38 | #489 | C | ĐÃ SỬA | Enter trên mã F → focus `span#fact-Fn`; bỏ `focus` / `tabIndex` → 1 e2e đỏ mỗi chỗ | → CL2-C6 (link 2b chỉ cuộn, Nit) |
| 39 | #483 T-190 | C | ĐÃ SỬA | Phiên web của KH A tắt AI trích xuất của A, không ảnh hưởng B; bỏ `webOpen` → 1 e2e đỏ | — |
| 40 | #489 | C | ĐÃ SỬA | `busyElsewhere`; luôn tắt / bật cả khi tự chạy → 1 unit + 1 e2e đỏ mỗi chiều | — |
| 41 | #489 | C | ĐÃ SỬA | Dòng help theo provider / gói / model, đếm đúng tập gửi; bỏ dòng → 2 e2e đỏ; đếm cả `superseded` → 2 unit đỏ | — |
| 42 | #489 | C | ĐÃ SỬA | `AiPanelSource` dùng chung; view bỏ badge web → 1 unit đỏ | → CL2-C5 (TSX không có test, Nit) |
| 43 | #489 | C | ĐÃ SỬA | Phiên web đóng / Đóng "0 đề xuất" → focus về nút; gỡ → 2 / 1 e2e đỏ | → CL2-C2 (6 đường khác rơi focus về `body`, Low) |
| 44 | #486 | C | ĐÃ SỬA | `AI_NO_KEY` có link `#/settings/ai`, mở đúng mục; bỏ → 1 unit + 1 e2e đỏ | — |
| 45 | #489 | C | ĐÃ SỬA | Badge đầu theo chế độ phiên (4e); bỏ → 1 unit + 1 e2e đỏ | → CL2-C5 |
| 46 | #486 | C | ĐÃ SỬA | Xóa kết quả trước khi kiểm ô; thứ tự cũ → 1 e2e đỏ | — |
| 47 | #489 | C | ĐÃ SỬA | `codes.join(t('sep.slash'))`; `git grep "' / '"` trong TSX: 0 | Chỉ chuyển chuỗi, không test riêng |
| 48 | #490 | A (db) + C (UI) | ĐÃ SỬA | `seq` thật ở mọi chỗ hiện "v<n>"; backup `seq` ×10 → [10, 20]; gỡ → 2 đỏ (db), 1 unit đỏ mỗi view | → CL2-C5 (`kyc.meta`, `kycNote.sub` TSX không test) |
| 49 (a) | #483 | A (`web.ts`) + C (UI) | ĐÃ SỬA | Seed demo: dán nguyên tin nhắn `web@1` → 767 / 767 `OWN_MESSAGE` (vòng 1: 39 ACCEPTED), cả CRLF; gỡ → 7 đỏ | → CL2-A1 (dán lại tin nhắn thử lại ở lần 2 → REJECTED, Low), CL2-A2 (khung NFD / NBSP / ZWSP → vẫn 39 ACCEPTED, Low), CL2-A3 (Nit, T). 49 (b) là KNOWN #491 |
| 50 | #490 | C | ĐÃ SỬA | Nạp lại chép dòng `ai` sang seed mới; không chép → 2 unit + 1 e2e đỏ | JSON hỏng → mặc định (đúng spec §4.1) |
| 57 | #482 T-189 | D | ĐÃ SỬA | §1 | → CL2-D1 (Low), CL2-D2 (Nit), CL2-D3 (Nit) |
| — (T-202) | #500 | A | ĐÃ SỬA | `rg WEB_PROMPT_VERSION` ngoài `docs/reviews/**`: 0 | Không phải DR5 |

**Tổng:** 35 / 35 DR5 **ĐÃ SỬA**, 0 SỬA MỘT PHẦN, 0 CHƯA SỬA, **0 HỒI QUY**. Mọi phần sửa có ít nhất một test đỏ khi gỡ, trừ phần TSX ghi ở CL2-C5 và `key_entry` ở CL2-B1 (hai chỗ đó code đúng, chỉ thiếu test ghim). Vòng 2 có 17 phát hiện (A 4, B 4, C 6, D 3), phần lớn là biến thể gần của các phần sửa (một số DR5 chung một phát hiện); không cái nào trên mức Low.

## 3. Phát hiện của gói D

```
ID: CL2-D1
Mức: Low
Trục: R
Vị trí: tools/pr-core.mjs:36–41 (isDocsOnly), .github/workflows/ci.yml:10–12, 27–29 ('!docs/**');
  so với .prettierignore (chỉ bỏ *.md và docs/design/), eslint.config.js:8–14 (không bỏ docs/) (705ea7c)
Tình trạng: CONFIRMED
Liên quan: DR5-57 · có từ trước (ADR-0015 §2), phần sửa #496 chỉ xét các file .md mà test đọc
Mô tả: CI và merge-pr coi mọi file dưới docs/ là docs-only, nhưng `pnpm verify` vẫn kiểm file không
  phải .md dưới docs/ (ngoài docs/design/): `prettier --check .` và `eslint .`. Một PR chỉ thêm file
  như vậy được merge không cần CI, rồi main đỏ `pnpm verify` mà không ai thấy, tới khi PR code kế tiếp
  đỏ ở file nó không đụng. Đây đúng là loại lỗi của DR5-57 ("docs-only" rộng hơn phần verify bỏ qua),
  chỉ khác đường đi.
Tái hiện / bằng chứng: tạo tạm docs/reviews/raw/zz-probe-D/{probe.mjs,data.json} rồi xóa ngay:
    isDocsOnly([...probe.mjs, ...data.json])  → true   (merge-pr: không cần CI)
    prettier --check .                        → [warn] …/data.json, …/probe.mjs — Code style issues found in 2 files
    eslint . --max-warnings 0                 → probe.mjs 1:7 error 'unused' is assigned a value but never used
  Hôm nay `git ls-files docs` không có file nào ngoài .md / docs/design/ (css, html, png đều trong
  docs/design/), nên main đang xanh.
Ảnh hưởng: gặp khi một PR docs chép mã nguồn vào docs/. Ca gần nhất là chính bước tổng hợp vòng 2
  (plan §7.2 "chép báo cáo gốc + common\ vào docs/reviews/raw/<ngày>/"): common\ chỉ có .md / .log
  (prettier bỏ qua .log khi quét `.`), nhưng claude\A\…\D\ có .mjs, .ts, .json, .diff, package.json
  của probe. Chép cả thư mục probe thì main đỏ.
Đề xuất: (1) ngay cho bước tổng hợp: chỉ chép .md (và .log) vào docs/reviews/raw/, hoặc chạy
  `pnpm format:check && pnpm lint` trước khi merge PR docs đó; (2) về lâu dài: thêm `docs/**` vào
  .prettierignore và `ignores` của eslint (CI không kiểm docs/ thì verify cũng không nên), kèm test
  nhỏ trong pr-core.test.mjs giữ ba nơi khớp. Cỡ ≈ 2 dòng cấu hình + 1 test.
```

```
ID: CL2-D2
Mức: Nit
Trục: C
Vị trí: .claude/skills/review-pr/SKILL.md:66 (705ea7c)
Tình trạng: CONFIRMED (đọc tài liệu)
Liên quan: DR5-57 · có từ trước (cùng chỗ cũng chưa tính 5 CLAUDE.md của package, DR-74); #482 không
  cho sửa file này
Mô tả: Skill review-pr còn một định nghĩa docs-only thứ ba: "PR chỉ sửa docs (`docs/**`, `*.md`) →
  chạy mức low, bỏ trục Correctness". Theo câu này, PR chỉ sửa docs/design/phase-5-prompts.md được
  review mức low và bỏ Correctness, trong khi CODE_DOCS coi đó là code và bảng nâng mức ngay trên
  (`docs/golden/**` → high) lại đòi high cho docs/golden/ai-eval.md. Hai dòng của cùng skill mâu thuẫn
  với ai-eval.md.
Tái hiện / bằng chứng: SKILL.md:62 (`docs/golden/**` → high) và :66 (docs-only → low, bỏ Correctness);
  tools/pr-core.mjs:29–33 (CODE_DOCS).
Ảnh hưởng: nhỏ. CI giờ chạy cho PR G5, và PR G5 còn qua cổng G5 của Owner; chỉ là phiên review có thể
  chọn mức thấp hơn ý định cho PR chỉ sửa tài liệu G5.
Đề xuất: câu ở :66 thêm "trừ CODE_DOCS của tools/pr-core.mjs (tính là code)". Cỡ 1 dòng, gộp vào lần
  sửa skill kế tiếp.
```

```
ID: CL2-D3
Mức: Nit
Trục: T
Vị trí: tools/pr-core.test.mjs:80–96 (705ea7c)
Tình trạng: CONFIRMED (đọc test; đột biến thêm tài liệu thứ ba được bắt chỉ khi sửa ci.yml)
Liên quan: DR5-57 · mới do đợt sửa (PR #496: test giữ ci.yml ↔ CODE_DOCS, không giữ CODE_DOCS ↔ thứ
  test đọc thật)
Mô tả: Test giữ hai danh sách khớp nhau, nhưng không giữ danh sách khớp với sự thật mà nó đại diện
  (file .md nào test / verify đọc). Một test mới đọc docs/golden/kyc.md (vd. so nguyên văn bảng K01–K15)
  hay việc đổi tên docs/golden/ai-eval.md đều không làm test nào đỏ; khi đó DR5-57 quay lại đúng như cũ.
  Hôm nay danh sách đủ: `git grep` chỉ thấy 3 chỗ đọc .md (prompts.test.ts, web.test.ts →
  phase-5-prompts.md; eval-ai-core.test.mjs → ai-eval.md), cộng codemap đọc 5 CLAUDE.md.
Tái hiện / bằng chứng: mutate.mjs: mọi đột biến đều ở ci.yml / pr-core.mjs; không đột biến nào trên
  phía "người đọc" có thể bị bắt, vì test không quét file test. Đọc test: chỉ readFileSync(ci.yml).
Ảnh hưởng: không ai gặp hôm nay; chỉ là lần thêm test so nguyên văn tài liệu sau có thể quên CODE_DOCS.
Đề xuất: thêm một ca quét file test (`git ls-files '*.test.*'`) tìm import / readFileSync tới
  `docs/**/*.md` và đòi mỗi file có trong CODE_DOCS; thêm `existsSync` cho từng mục CODE_DOCS. Cỡ
  ≈ 10 dòng test.
```

## 4. Xuyên gói: đường đi đầu-cuối, hợp đồng, hồi quy

### Đầu-cuối OpenCode qua hợp đồng Rust (probe `unit/e2e-contract.test.ts`, kết quả `out-e2e-contract.txt`)

e2e của repo không có đường "OpenCode trả JSON hợp lệ → ACCEPTED": `asExe` luôn trả `content: 'OK'` (`e2e/support.ts:82–86`). Probe nối đúng các lớp thật: IPC giả theo dạng `Completion` / `AiError` của `ai.rs` → `tauriOpenCode` → `analyseCustomer` / `extractFromNote` / `checkConnection` → `recordAiAnalysis` → `exportBackup` / `importBackup` → `historyRows` / `rejectedReport` / `errorText` / `checkShown`.

- ACCEPTED: dòng `OPENCODE_GO`, model `deepseek-v4.1-flash`, `DEFAULT`, 1 lần thử, token [9, 1], `discovery@1`, CURRENT. Lệnh gửi `plan: CREDIT`, `reasoning: null`, `maxTokens: 8000`. Xuất → nhập: dòng giống hệt từng trường. Lịch sử ghi `v4` theo `seq`.
- Lần 1 không có `usage` → token `[null, null]` (đúng §5.1 / B DR5-29); hai lần có token → cộng `[18, 2]`.
- REJECTED hai lần (`finish_reason: length`, `content` có NUL): `raw_output` lưu U+FFFD thay NUL, báo cáo 2 lần thử, token 20, xuất → nhập giống hệt.
- 12 dạng lỗi từ Rust (`AI_HTTP` 502 + message, 500 không message, 429, 401, `AI_TIMEOUT`, `AI_NO_KEY`, `AI_BUSY`, `AI_KEYRING`, `AI_OPEN_BROWSER`, mã lạ, chuỗi lỗi của Tauri, `httpStatus` dạng chuỗi): **12 / 12 cùng một câu** ở panel, trích xuất và Cài đặt, 0 dòng được lưu. Mã lạ / chuỗi Tauri / `AI_OPEN_BROWSER` → câu chung (§5.3 "lỗi khác"). `httpStatus` không phải số bị bỏ (Rust luôn gửi số, `ai.rs` test `an_error_is_sent_as_code_http_status_and_message`).
- Trích xuất qua cùng client ra đề xuất; Kiểm tra kết nối gửi `maxTokens: 64`, đúng gói, câu "· Credit · DeepSeek V4.1 Flash".

### Mock / ChatGPT web / trích xuất

Đã có e2e trên bản build cho cả ba đường sau đợt sửa (`customer-ai.spec.ts` 10 test, `customer-ai-web.spec.ts` 6 test, `settings-ai.spec.ts` 8 test; baseline 188 e2e xanh). A, C đã chạy lại các ca DR5 trên đó. D không thấy kẽ hở giữa các đường: phiên web không giữ yêu cầu AI (§3.1 mục 5) nên không chạm `AiRunner`; `saveChatGptAnswer` không kiểm thế hệ, nhưng Nạp lại / Nhập chỉ có ở Cài đặt nên panel (giữ phiên) đã unmount trước (C, DR5-36).

### Hợp đồng `ai` ↔ `db` ↔ UI ↔ Rust

- Mã lỗi: tập Rust = `AI_ERROR_CODES` + `AI_OPEN_BROWSER` (test `tauri-contract`); `vi.ts` có `aiError.*` cho mọi mã (B). Hình lỗi `{code, httpStatus?, message?}` ghim ở cả Rust (serde test) và `ai-tauri.ts` (đọc đúng ba tên).
- `Completion` 4 trường ⇔ `AiCompletion` (test so tên và `| null`). `finishReason` tới `ai` rồi bị bỏ: KNOWN #492; chỗ Rust bỏ sót là CL2-B3 / B4.
- `prompt_version` / `provider` / `attempts` / token: `run.ts` / `web.ts` ghi đúng dạng mà `analysisLabelsFit` / `analysisContentFits` và luật nhập 12–13 nhận (A: 1 430 dòng; D: 4 dòng OpenCode qua lệnh thật + nhập).
- `httpStatus` / `serverMessage`: Rust → `AiError` → `runAnalysis` / `runExtraction` / `checkConnection` → `errorText` một hàm (D: 12 / 12 khớp).

### Hồi quy vào Phase 1–4

- Đợt sửa chạm code Phase 1–4 ở: `backup.ts` `valueOf` (NUL ở mọi bảng), `kyc.ts` (`seq`), `app-data.ts` (`generation`, Nạp lại chép `ai`), `routes.ts` / `Screen.tsx` / `Settings.tsx` (`#/settings/ai`, `key={section}`), `TextField.tsx` (`type`, `spellCheck`), `CustomerKyc.tsx` / `KycDialogs.tsx` (`seq`).
- Đã đọc từng diff. `parseHash` chỉ nhận thêm đúng `settings/ai`, mọi hash cũ ra như trước (test `routes.test.ts`). `sectionOf` / `usesScope` không đổi cho `settings`. `TextField` mặc định không truyền `type` (giữ `text`), `rows` bỏ `type`. NUL: sql.js cắt khi bind nên DB do app ghi không bao giờ có NUL (A), backup cũ vẫn nhập được trừ khi file bị sửa tay. Mở DB lúc khởi động không chạy luật nhập, nên DB cũ có dòng `ai_analyses` trái luật mới vẫn mở; chỉ xuất → nhập lại mới bị từ chối — đúng quyết định R2-02 (nạp lại dữ liệu giả lập), KNOWN.
- `pnpm verify` (baseline) và `vitest run` cuối phiên D: 2 215 test xanh; e2e 188 xanh (baseline). Không thấy hồi quy.

### Quy trình merge của đợt sửa

9 PR #496–#499, #501–#505: `REVIEW: PASS` mới nhất ghi đúng SHA head lúc merge (9 / 9); ba PR `risk:med` (#497, #498, #503) có comment "Merged on Owner request (merge-pr --owner)"; CI Verify xanh ở cả 9, #503 có `build-exe` và job exe xanh; mọi push `main` sau đó xanh. Milestone Phase 5: 0 Issue mở / 66 đóng; 0 PR mở. Artifact exe `Project-2C-705ea7c…` (3,1 MB đã nén, hết hạn 08/01/2027) có sẵn từ run `38074144272`.

## 5. Đã xét, không thấy

- **R:** §1, §2. Không có HỒI QUY ở 35 DR5.
- **E — Edge case (CI / tools):** `isDocsOnly([])` = false (test); tên giống docs ngoài `docs/` (`apps/docs/x.ts`, `README.mdx`) không là docs (test); `.md` hoa / thường: GitHub `paths` và `isDocsOnly` cùng phân biệt hoa thường; đổi thứ tự dòng trong `paths` tương đương. Đổi tên tài liệu G5: ghi ở CL2-D3.
- **G — Guardrail:** đợt sửa không đổi validator / blocklist / prompt (A). Đường OpenCode đầu-cuối: output qua V1–V6 rồi mới `recordAiAnalysis`; REJECTED không hiện `raw_output` (`rejectedReport` chỉ có báo cáo). AI không có đường ghi KYC (A, C). Không thấy gì mới.
- **C — Hợp đồng:** §4. Câu `AI_UNAUTHORIZED` ("Gói Go đã hết hạn → chọn gói Credit") hiện cả khi đang ở Credit: khớp nguyên văn mockup 4c (`ai.html:858`) và spec §5.3, nên không báo. Hộp 10c "Toàn bộ dữ liệu hiện tại được thay…" không mâu thuẫn với Nạp lại giữ Cài đặt AI, vì spec §4.1 gọi đó là cấu hình của máy, không phải dữ liệu (Owner chọn giữ hành vi mới, không đòi sửa 10c). Ngoài CL2-D2, không thấy hai chỗ lệch.
- **D — Dữ liệu:** vòng ghi → xuất → nhập của dòng OpenCode ACCEPTED / REJECTED / token `null`: giống hệt (§4). Lệnh và nhập cùng luật (A). Lưu kết quả AI trong transaction của lệnh. Không thấy.
- **S — An toàn:** `ci.yml` không đổi quyền (`contents: read`, `pull-requests: read`), vẫn `pull_request` (không `pull_request_target`), mọi `uses:` ghim SHA; bước đọc nhãn chỉ chèn số PR. Key / `serverMessage`: B. Không thấy.
- **P — Hiệu năng:** CI của PR không `build-exe` 9–11 phút, có `build-exe` 16 phút, push `main` 3–5 phút (20 run gần nhất). PR chỉ sửa tài liệu G5 giờ tốn một lần Verify + e2e (~11 phút) — đúng mục tiêu #482, không phải vấn đề. `tools/pr-core.test.mjs` 59 test 0,33 s. Probe đầu-cuối 5 ca 1,9 s.
- **B — Thừa / lặp:** `unused-exports.mjs` quét export của 31 file sản phẩm `.ts` / `.tsx` đợt sửa: export **mới** không ai dùng ngoài file chỉ có `AiShownCode` (C đã ghi, không báo). Các export cũ còn lại là kiểu công khai / helper có test (Phase 3–5, trước đợt sửa). `errorText` thay ba hàm cũ (`panelError`, khóa `settingsAi.checkHttp*`, `aiPanel.web.tooLong` đã bỏ — C). Không thấy lặp ≥ 3 nơi mới.
- **T — Test:** 6 / 6 đột biến không tương đương ở DR5-57 bị giết. Ngoài CL2-D3, không thấy test chép công thức / phụ thuộc ngày ở `tools/`.
- **A — Trợ năng / i18n:** gói D không có UI riêng; xuyên gói thì mọi câu lỗi qua `vi.ts` (§4, 12 / 12 ca). Các mục của C (CL2-C2 … C6) không đếm lại.
- **KNOWN:** không có mục "KNOWN đã sửa". KNOWN #468 (`use-ai-job.ts` lỗi mất khi ở màn khác; `ai-jobs.ts` `start` ghi đè) vẫn như cũ (C).

## 6. Bảng đếm

**Gói D:**

| Mức \ Trục | R | E | G | C | D | S | P | B | T | A | Cộng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Low | 1 (D1) | | | | | | | | | | 1 |
| Nit | | | | 1 (D2) | | | | | 1 (D3) | | 2 |
| **Cộng** | 1 | | | 1 | | | | | 1 | | **3** |

**Cả bốn gói phía Claude (A + B + C + D), vòng 2:**

| Mức \ Trục | R | E | G | C | D | S | P | B | T | A | Cộng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | **0** |
| Low | 3 (A1, A2, D1) | | | 1 (C1) | | | | | 1 (B1) | 2 (C2, C3) | **7** |
| Nit | 1 (B2) | | | 2 (B4, D2) | 1 (A4) | 1 (B3) | | | 3 (A3, C5, D3) | 2 (C4, C6) | **10** |
| **Cộng** | 4 | | | 3 | 1 | 1 | | | 4 | 4 | **17** |

16 CONFIRMED, 1 PLAUSIBLE (CL2-C4).

## 7. Kết luận G7 Phase 5 (phía Claude): **SẴN SÀNG**

Lý do:

1. **Đợt sửa đúng và đủ:** 35 / 35 DR5 giao Phase 5 ĐÃ SỬA, 0 HỒI QUY. Hai lỗi Medium của vòng 1 đã hết: DR5-49 (a) (767 / 767 tin nhắn của app bị chặn tại khung, vòng 1 lưu 39 CURRENT) và DR5-36 (nhập backup cùng ID → `discarded`). Mọi phần sửa đều có test đỏ khi gỡ, trừ hai chỗ chỉ thiếu test ghim (CL2-B1, CL2-C5).
2. **Không có phát hiện chặn:** vòng 2 có 0 Critical / High / Medium. 7 Low đều cần điều kiện hiếm (tin nhắn đi qua công cụ khác, dán nhầm tin nhắn thử lại, đổi `key_entry` sau này, PR docs chép mã nguồn) hoặc chỉ là hiển thị / trợ năng. Không cái nào làm sai / mất dữ liệu ở thao tác thường hay chặn việc chính (thước Medium của §10 tổng hợp 10/10).
3. **Quy trình sạch:** 9 PR merge đúng luật (SHA PASS = head, `--owner` cho `risk:med`, CI xanh); `main` xanh; milestone Phase 5 không còn Issue mở; có artifact exe ở `705ea7c`.

Đề xuất xếp chỗ (Owner quyết, không chặn G7):

- **Trước PR tổng hợp vòng 2:** làm theo CL2-D1 điểm (1) — chỉ chép `.md` (và `.log`) vào `docs/reviews/raw/`, hoặc chạy `pnpm format:check && pnpm lint` trước khi merge PR docs đó.
- **Gộp vào Issue Phase 6 đã có:** CL2-B3, CL2-B4 → #492 T-199 (`finish_reason`); CL2-A3, CL2-B1, CL2-C5, CL2-D3 → #493 T-200 (test); CL2-A1, CL2-A2 → #491 T-197 (đợt G5, vì cần thêm nửa câu spec §3.1 mục 3 và cùng cách chuẩn hóa của V3–V6).
- **Một Issue nhỏ sau G7 (hoặc gộp T-200):** trợ năng CL2-C2, C3, C4, C6; CL2-C1 (≈ 5 dòng); CL2-D1 điểm (2), CL2-D2; CL2-A4, CL2-B2 gộp vào lần chạm sau của file.

G7 vẫn cần phần của Owner: kiểm exe `705ea7c` bằng tay, điền số Owner vào `docs/metrics/phase-5.md`, rồi merge cuối milestone.

## 8. Phạm vi đã đọc

- `common\plan.md` (trọn), `known.md`, `baseline.md`; `claude\A.md`, `B.md`, `C.md` (trọn). Tổng hợp vòng 1 §7 (I-8), §8, §10; `PROJECT-STATE.md` dòng 10/10. Thân Issue #482, #490; thân PR #496. ADR-0015 (dòng 18–52). Spec `phase-5-ai.md` §4.1 (dòng 106), §5.3 (dòng 167), §7.3 luật 3.
- CI / tools (`705ea7c`): `.github/workflows/ci.yml` (trọn), `tools/pr-core.mjs` (1–150 + `isDocsOnly` / `mergeBlockers`), `tools/pr-core.test.mjs:60–120`, `tools/pr-status.mjs` (grep), `tools/codemap-core.mjs` (comment), `.claude/rules/ci.md` (trọn), `.claude/skills/review-pr/SKILL.md:50–80`, `package.json` scripts, `.prettierignore`, `.prettierrc.json`, `eslint.config.js:1–30`, `vitest.config.ts`, `.gitattributes`.
- Xuyên gói: `packages/ai/src/errors.ts`, `apps/desktop/src/data/ai-tauri.ts`, `ai-analysis.ts` (trọn), `app-data.ts:207–232`, `routes/ai-error-view.ts` (trọn), `ai-panel-view.ts:525–600`, `settings-ai-view.ts:70–110`, `SettingsAi.tsx:285–320`, `ai.rs:60–115, 930–950`, `tauri-contract.test.ts:125–217`, `e2e/support.ts:60–140`, tên test của 3 spec e2e AI, `vi.ts:905–930`. Diff `0df3606..705ea7c` của `routes.ts`, `Screen.tsx`, `Settings.tsx`, `TextField.tsx`; `--stat` cả 61 file.
- GitHub (chỉ đọc): checks / nhãn / comment REVIEW của 9 PR, 20 run CI gần nhất, milestones, artifact của run `38074144272`.

## 9. Phụ lục — nguồn probe (`C:\workspace\deep-review-5-r2\claude\D\`)

| File | Làm gì | Lệnh (từ worktree) |
|---|---|---|
| `r57-repro.mjs`, `old\pr-core.mjs`, `old\session-core.mjs` | Tái hiện DR5-57: `isDocsOnly` ở `0df3606` (lấy bằng `git show`) và `705ea7c` | `node <D>\r57-repro.mjs` |
| `mutate.mjs`, `mutate-out.txt` | 7 phép trên `ci.yml` / `pr-core.mjs` (gỡ trọn phần sửa, bỏ một dòng mỗi khối, bỏ khỏi `CODE_DOCS`, thêm tài liệu thừa, `isDocsOnly` dùng `CODEMAP_DOCS`, đối chứng đổi thứ tự); chạy `tools/pr-core.test.mjs`, rồi `git checkout --` | `node <D>\mutate.mjs [tiền tố]` |
| `vitest.probe.config.mjs`, `unit\e2e-contract.test.ts`, `out-e2e-contract.txt` | Probe đầu-cuối §4: IPC giả dạng Rust → `tauriOpenCode` → chạy AI → lệnh `db` → backup → view | `node_modules/.bin/vitest run --config <D>\vitest.probe.config.mjs e2e-contract --silent=false --reporter=verbose` |
| `unused-exports.mjs`, `out-unused-exports.txt` | Trục B: export của file sản phẩm đợt sửa không có người dùng ngoài file (đọc HEAD qua `git`) | `node <D>\unused-exports.mjs` |
| (không lưu file) | CL2-D1: tạo `docs/reviews/raw/zz-probe-D/{probe.mjs,data.json}`, chạy `prettier --check .`, `eslint .`, `isDocsOnly`, rồi `rm -rf` ngay trong cùng lệnh | xem §3 |

## 10. Thời gian

Bắt đầu ≈ 02:37, kết thúc ≈ 02:58 (11/10/2026, giờ máy Home PC). Cuối phiên: `git rev-parse HEAD` = `705ea7c`, `git status --short` **sạch**, `vitest run` 2 215 / 2 215 xanh.
