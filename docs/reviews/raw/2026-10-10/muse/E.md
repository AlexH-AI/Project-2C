# Deep review Phase 5 — gói E (tools + e2e + CI) — Muse

- SHA: `0df3606fb783cc89b1b9c413c02810340e273a4f` (`git rev-parse HEAD`, worktree
  `C:\workspace\Project-2C-review-2`, chỉ đọc, không sửa file nào trong repo).
- `git status --short` đầu phiên: `?? .agents/`, `?? .codex/`, `?? AGENTS.md`,
  `?? opencode.json` (đúng 4 mục cho phép).
- Ngày: 10/10/2026. Không gọi AI thật: mọi probe dùng Mock / fetch giả / build web
  local, tuân thủ rule 4 (không `eval:ai`, không key thật, không chatgpt.com).
- Ghi chú môi trường: sandbox chặn ghi ra `C:\workspace\deep-review-5\` và chặn
  listen socket, nên (1) nháp + probe làm trong thư mục temp rồi chép ra đây bằng
  một lệnh `Copy-Item` có phê duyệt; (2) các lượt chạy e2e (cần server local + Edge)
  chạy bằng một lệnh escalated duy nhất; (3) build web ra thư mục temp thay vì
  `dist/` (EPERM xóa `dist/` của Owner — xem phụ lục).

## Phạm vi đã đọc

Gói E theo `plan.md` §3, đọc toàn bộ từng file (số dòng ở SHA trên):

| File | Dòng | Kiểm |
|---|---|---|
| `tools/eval-ai.mjs` | 1–52 | hook resolve `.ts`, đường dẫn, key chỉ từ env |
| `tools/eval-ai-core.mjs` | 1–584 | toàn bộ: config, adapter, chấm điểm, report |
| `tools/eval-ai-core.test.mjs` | 1–645 | toàn bộ 33 test + đột biến UM0–UM4 |
| `tools/fixtures/ai-eval.mjs` | 1–314 | đối chiếu từng hồ sơ/ghi chú với golden |
| `e2e/support.ts` | 1–173 | toàn bộ, trọng tâm `asExe` (lệnh AI giả) |
| `e2e/customer-ai.spec.ts` | 1–386 | toàn bộ 7 test + đột biến M1, M2 |
| `e2e/customer-ai-web.spec.ts` | 1–214 | toàn bộ 5 test + đột biến M4 |
| `e2e/settings-ai.spec.ts` | 1–233 | toàn bộ 6 test + đột biến M3 |
| `e2e/appointments.spec.ts` | 848–901 | test khối AI §9.2 (baseline) |
| `.github/workflows/ci.yml` | 1–140 | toàn bộ; diff Phase 5 chỉ 2 dòng paths |
| `.dependency-cruiser.cjs` | 1–72 | toàn bộ; thử phủ định 3 rule mới |
| `vitest.config.ts` | 1–70 | toàn bộ; kiểm ngưỡng `ai` 100% có hiệu lực |
| `tools/codemap.mjs`, `tools/codemap-core.mjs` (đoạn `CODEMAP_PACKAGES`), `tools/pr-core.mjs` (`CODEMAP_DOCS`), `tools/pr-core.test.mjs:53–89` | — | đồng bộ codemap/CI, 57 test xanh |

Tài liệu chuẩn (rule 5): `docs/golden/ai-eval.md` (toàn bộ, kỹ §1/§2/§4/§5),
`docs/design/phase-5-ai.md` (§3, §5–§7, §10, §11), `docs/design/phase-5-prompts.md`
(§6a `web@1`, các version prompt), ADR-0009 phụ lục D-1/G5/W-1, `CONTEXT.md`,
`packages/ai/CLAUDE.md`, `docs/metrics/ai-eval-2026-10-10.md` (kết quả chạy thật,
đối chiếu định dạng report). Code gói khác mà E nối vào (chỉ đọc phần E dùng):
`packages/ai/src/run.ts` (điều phối, thử lại), `prompts/retry.ts`
(`MAX_ATTEMPTS`, `checkAnswer`), `validator.ts:110–175` (V7),
`packages/domain/src/kyc-fact.ts:17–45` (kiểu giá trị chuẩn hóa),
`apps/desktop/src/data/ai-tauri.ts` + `tauri-contract.test.ts` (dạng lỗi Rust),
`apps/desktop/src-tauri/src/ai.rs` (URL, timeout, redirect, mã lỗi),
`apps/desktop/src/main.tsx:22–37` + `data/demo-snapshot.ts` (cách serve e2e).

## Phát hiện

```
ID: MS-E1
Mức: Low
Trục: C
Vị trí: tools/eval-ai-core.mjs:222-228 (0df3606)
Tình trạng: CONFIRMED
Mô tả: gradeNote() so từ khóa với quote thô, trong khi V7 giữ quote theo bản đã
  gộp khoảng trắng + NFC — cùng một quote, V7 giữ nhưng chấm điểm loại.
Tái hiện / bằng chứng: p-v7keep.mjs (phụ lục):
  "newline: V7 kept=1 dropped=0 | grade pass=false"
  "NFD: V7 kept=1 dropped=0 | grade pass=false"
  (quote "giữ\ntiền an toàn" và quote NFD của X04: filterExtraction giữ cả hai
  theo validator.ts:121,146, nhưng gradeNote báo thiếu vì
  fact.quote.toLowerCase().includes(word.toLowerCase()) so thô.)
Ảnh hưởng: model trích quote chứa xuống dòng / NFD trong vùng từ khóa thì ghi chú
  bị TRƯỢT oan ở cột Script, có thể làm sai ngưỡng X ≥ 4/5 (Owner vẫn đọc tay nên
  hậu quả giới hạn ở cột tự động).
Đề xuất: chuẩn hóa cả hai vế như V7 (NFC + gộp \s+ thành dấu cách) trước khi so;
  thêm 2 ca test. Cỡ ~10 dòng.
```

```
ID: MS-E2
Mức: Nit
Trục: C
Vị trí: tools/eval-ai-core.mjs:95-96,150-151 (0df3606)
Tình trạng: PLAUSIBLE (đọc code hai bên; không dựng body GB để đo vì tốn tài nguyên)
Mô tả: Script đọc TOÀN BỘ thân trả lời (response.text()) rồi mới kiểm 2 MB, trong
  khi spec §5.2 ("Thân trả lời đọc tối đa 2 MB") và Rust kiểm trong lúc đọc. Mã lỗi
  quan sát được vẫn đúng (AI_BAD_RESPONSE), chỉ khác biên bộ nhớ.
Tái hiện / bằng chứng: dòng 150-151 đọc hết body trước, dòng 96 mới so
  Buffer.byteLength(text) > MAX_BODY. Test hiện có chỉ phủ body ~2,2 MB
  (eval-ai-core.test.mjs:257) nên vẫn xanh.
Ảnh hưởng: body lỗi khổng lồ (hiếm; server tin cậy) làm Node giữ hết mới loại.
  Tool local, Owner chạy tay.
Đề xuất: kiểm Content-Length trước khi đọc, hoặc cộng dồn theo chunk và bỏ ở
  2 MB+1. Không bắt buộc. Cỡ ~15 dòng + test.
```

```
ID: MS-E3
Mức: Nit
Trục: C
Vị trí: tools/eval-ai-core.mjs:36,141 so với apps/desktop/src-tauri/src/ai.rs:22-23,326-327 (0df3606)
Tình trạng: PLAUSIBLE (đọc code hai bên; sandbox chặn listen socket nên không dựng
  server treo để đo — server treo cần escalated, không xứng cho mức Nit)
Mô tả: Script chỉ hẹn giờ tổng 120 s cho fetch; Rust có thêm hẹn giờ kết nối 10 s
  (CONNECT_TIMEOUT). Treo lúc bắt tay TCP/TLS: app báo AI_TIMEOUT sau ~10 s,
  eval báo cùng mã sau ~120 s — lệch thời gian đo ở A4.
Tái hiện / bằng chứng: ai.rs:327 timeout_connect(Some(CONNECT_TIMEOUT)) trong khi
  eval-ai-core.mjs:141 chỉ có AbortSignal.timeout(TIMEOUT_MS). Redirect thì khớp
  (max_redirects(0) ở ai.rs:330 ~ redirect: 'error' ở :140 — đã đối chiếu).
Ảnh hưởng: chỉ khi mạng treo lúc kết nối; mã lỗi vẫn đúng, chỉ cột thời gian của
  hồ sơ đó phình ~120 s thay vì ~10 s.
Đề xuất: bọc fetch với hẹn giờ kết nối riêng (không có sẵn trong fetch — cần
  AbortSignal.any / timer tay), hoặc ghi chú khác biệt này vào đầu file script.
  Không bắt buộc.
```

```
ID: MS-E4
Mức: Low
Trục: C (kèm T: nhánh này 0% coverage)
Vị trí: tools/eval-ai-core.mjs:180-192,381,509 (0df3606)
Tình trạng: KNOWN (known.md #474, đoạn recording) — bằng chứng mới: biến thể lỗi
  ngay lần gọi đầu + số đo coverage nhánh recompute.
Mô tả: recording() chỉ ghi câu trả lời có về. Đã biết: lỗi lần 2 → cột "Lần thử"
  ghi 1 dù gọi 2 lần. Mới: lỗi ngay lần gọi đầu → ghi "0 lần thử" dù đã gọi 1 lần
  (tốn thời gian, có thể tốn tiền) và token 0/0.
Tái hiện / bằng chứng: p-tries.mjs, E01 HTTP 500 ở lần gọi 1, lệnh gọi 2 hồ sơ:
  log: "E01 discovery LỖI `AI_HTTP` (HTTP 500: boom) · 0 lần thử · 1.5 s"
  dòng bảng: "| E01 | discovery | LỖI `AI_HTTP` (HTTP 500: boom) | 0 | — | 0 / 0 | 1.5 s |"
  Kịch bản 2 tái hiện đúng mục KNOWN (lần 1 có đáp, lần 2 timeout):
  "E01b status: ERROR | attempts recorded: 1 | calls made: 2",
  "E01 discovery LỖI `AI_TIMEOUT` · 1 lần thử · 1.5 s".
  Đo coverage tools (33 test): eval-ai-core.mjs 98,94/96,36/97,36/99,17, hở đúng
  dòng 316 — nhánh recompute issues cho đáp án trước lỗi (chỉ chạy khi có lỗi
  sau đáp án, tức đúng vùng này) — và dòng 269 (reportError của runner, không tới
  được trong eval).
Ảnh hưởng: chạy eval gặp lỗi mạng/timeout thì log + cột "Lần thử" + token A4 thiếu
  đúng các lần gọi lỗi; Owner khó biết đã gọi bao nhiêu lần, tốn bao nhiêu.
Đề xuất: theo known.md (đếm cả lần gọi lỗi, hoặc ghi "lần 2 lỗi"). Thêm test
  attempt-2-lỗi (hiện không có — là lý do dòng 316 hở). Cỡ ~30 dòng + test.
```

```
ID: MS-E5
Mức: Low
Trục: S
Vị trí: tools/eval-ai-core.mjs:406-412,450-452 (0df3606)
Tình trạng: KNOWN (known.md #474, đoạn issueLines) — bằng chứng mới: repro chạy được
  + output chính xác.
Mô tả: detail do model viết (kể cả tên trường model đề xuất ở V7) vào file kết quả
  mà không qua plain(), trái quy tắc tự đặt ở :365 ("no HTML gets through").
Tái hiện / bằng chứng: p-html.mjs với issue V3 detail chứa "</details><b>do model
  viet</b>":
  details line: "- lần 1: V3 `needs[0].text`: "</details><b>do model viet</b>""
  raw </details> present: true
  Khối <details> của hồ sơ sẽ bị đóng sớm khi xem trên GitHub (GitHub lọc script
  nên không phải XSS — như known.md đã ghi).
Ảnh hưởng: file metrics của lần chạy có output "bẩn" bị vỡ layout, khó đọc; nội
  dung model viết hiện như HTML thật trong chi tiết (bảng chính không ảnh hưởng
  vì issuesCell chỉ ghi mã + đường dẫn).
Đề xuất: theo known.md (bọc plain() cho detail, có thể cả path). Cỡ ~5 dòng + test.
```

## Bảng đếm mức × trục

| Mức | E | G | C | D | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Low | — | — | 2 (E1, E4-KNOWN) | — | 1 (E5-KNOWN) | — | — | — | — | 3 |
| Nit | — | — | 2 (E2, E3) | — | — | — | — | — | — | 2 |
| Tổng | 0 | 0 | 4 | 0 | 1 | 0 | 0 | 0 | 0 | 5 |

(KNOWN = mục đã có trong `common/known.md`, chỉ nêu vì có bằng chứng mới.)

## Đã xét, không thấy

- **E — Edge case: đã xét, không thấy.** Đọc toàn bộ nhánh biên của script eval:
  argv lẻ/thừa/cờ lặp (`readConfig`, test phủ ở `eval-ai-core.test.mjs:104–158`),
  `OPENCODE_PLAN` sai/hoa-thường/khoảng trắng (từ chối, đã test), body lỗi rỗng /
  không JSON / `error.message` không phải chuỗi (`serverMessage`, đã test),
  `usage` thiếu/sai kiểu (token về 0, đã test), REJECTED rỗng (`EMPTY_RAW_OUTPUT`
  từ `run.ts`, không phải việc của script), `record.calls.at(-1)` ở nhánh INVALID
  (INVALID chỉ xảy ra sau 2 đáp án nên mảng không rỗng — đã đọc `run.ts:364–378`),
  `row.validator[i]` thẳng hàng với `record.calls` (mỗi `converse` push đúng một
  cặp đáp án + kiểm tra — `run.ts:196–211`). E2E: vòng `while link ẩn bấm Hiện thêm`
  (`customer-ai.spec.ts:120`) an toàn vì hết dữ liệu nút tắt → Playwright timeout
  đỏ chứ không treo; các `toHaveCount(0)` đều có neo dương tính kèm (khu vực đã
  assert text trước đó), riêng tiền đề "có ghi chú SYSTEM" của `:242` được
  `customer-kyc.spec.ts:45,61–62` khẳng định ở suite khác.
- **G — Guardrail AI: đã xét, không thấy (gói E không cài guardrail).** Script eval
  không chép luật V1–V7 mà gọi đúng `runAnalysis`/`runExtraction`/`validateOutput`
  của app, nên số lần thử tối đa (2, `MAX_ATTEMPTS` ở `retry.ts:23`), thứ tự kiểm
  và message thử lại mặc nhiên khớp app. A3 tách "V1 thiếu khóa khối" đúng định
  nghĩa golden (kiểm `!Object.hasOwn(parsed, path)` ở `:170–177`, không nhầm với
  V1 sai kiểu/cấu trúc — đối chiếu chạy thật E16 ở metrics). Fixture E01–E20/X01–X05
  đối chiếu từng ô mode/thiếu/cảnh báo/bẫy với `ai-eval.md` §3–§5: khớp hết, gồm
  E16 thiếu rỗng (đúng vì `hasProtection: false` vẫn tính "đã có"), E09 từ F3,
  14 analysis / 6 discovery; test `eval-ai-core.test.mjs:56–101` ghim bằng cổng
  thật và trích nguyên văn từ file golden.
- **C — Đúng hợp đồng: đã xét, còn lại MS-E1/E2/E3/E4.** Ngoài 4 mục trên, đã đối
  chiếu: `PLAN_URLS` với hằng Rust (`ai.rs:13–14`) — khớp từng ký tự; header
  `Authorization/x-opencode-session/User-Agent` (`:138–148`, test ghim ở `:174–191`);
  body `model/messages/max_tokens/reasoning_effort` thường (`:129–134`, test ghim
  chuỗi JSON nguyên văn); ánh xạ 401/403→`AI_UNAUTHORIZED`, 402/429→`AI_RATE_LIMITED`
  (`:97–103`, test cả 6 mã); cắt 200 ký tự sau che key; timeout tổng 120 s;
  `readAiSettings` không can thiệp nên eval gửi `reasoning_effort: high` đúng
  golden §1 (xác nhận `run.ts:150–159` gửi thẳng, không tra `AI_MODELS`); chấm X
  đúng §5 (script chấm mục 1 qua trạng thái OK/INVALID, mục 3, field+từ khóa bất
  kể hoa thường, giá trị số/có-không so khớp đúng — kiểu đã chuẩn hóa qua
  `normalizeKycValue`, `kyc-fact.ts:29–45`); `evalMain` từ chối ghi đè trước mọi
  lệnh gọi (đã test) và rẽ tên file theo model không mặc định.
- **D — Dữ liệu: đã xét, không thấy.** Script eval không chạm DB/backup, chỉ ghi
  một file metrics mới (từ chối khi đã có; ghi hỏng thì in kết quả ra log để không
  mất lần chạy tốn tiền — đã test). E2E nhập backup model lạ (test 1g) đi qua
  đường nhập thật và khẳng định nguyên văn cảnh báo. Không có migration/seed nào
  trong phạm vi gói E.
- **S — An toàn: đã xét, còn lại MS-E5.** Key: chỉ từ `OPENCODE_GO_KEY`, chỉ vào
  header `Authorization`, che bằng `replaceAll` trước khi cắt 200 ký tự, không bao
  giờ vào file/log — đã test 3 lớp (đơn vị che, report, log) và đột biến UM2 chứng
  minh 2 test che đỏ đúng khi gỡ che. Tên KH: e2e khẳng định tin nhắn copy không
  chứa tên (`customer-ai-web.spec.ts:82`) và `page.content()` không chứa key sau
  khi lưu (`settings-ai.spec.ts:176`); URL mở ra ngoài ghim nguyên văn
  `['https://chatgpt.com/', '_blank', 'noopener']` (`:83`) và đột biến M4 chứng
  minh assertion này sống. Dạng lỗi của `asExe` (`{code, httpStatus?, message?}`)
  khớp struct Rust (`ai.rs:52–62`) và đầu đọc của app (`ai-tauri.ts:43`). TOCTOU
  exists→write của file kết quả: chấp nhận được (tool một người chạy tay).
  Không có secret trong CI (đọc hết `ci.yml`, không có job eval, không dùng key).
- **P — Hiệu năng: đã xét, không thấy.** Số đo thật phiên này: e2e AI 7 test 22,3 s
  / 5 test 13,8 s / 6 test 14,1 s / 1 test §9.2 6,0 s (Edge, build temp, seed mỗi
  lần tải trang do không có snapshot — vẫn nhanh hơn xa ngưỡng seed 5 s của từng
  lần tải); unit tools 90 test 768 ms; coverage `ai` 264 test 837 ms; build web
  1087 module (trùng baseline). Script eval bị chi phối bởi mạng, phần dựng report
  là O(n) chuỗi thuần, không vòng lặp lồng đáng kể.
- **B — Bloat: đã xét, không thấy.** Mọi export của `eval-ai-core.mjs` đều có người
  dùng (script chạy hoặc test); mọi móc của `asExe` (`aiCalls`, `keysSet`,
  `holdAi`/`releaseAi`, `aiError`) đều được spec dùng; không có nhánh khoanh đỏ
  trong lint (`eslint` sạch trên 7 file phạm vi) và `tsc -p e2e` bật
  `noUnusedLocals/Parameters` (kế thừa `tsconfig.base.json`). `tools/*.mjs` không
  qua `tsc` nhưng qua `eslint . --max-warnings 0` trong verify.
- **T — Chất lượng test: đã xét, không giả xanh.** Đơn vị script eval (33 test):
  canary UM0 chứng minh kỹ thuật alias-redirect hoạt động; UM1 (ngưỡng A1 18→99)
  đỏ đúng 2 test formatReport; UM2 (gỡ che key) đỏ đúng 2 test che; UM3 (so từ khóa
  phân biệt hoa thường) đỏ đúng 2 test gradeNote; UM4 (đảo so sánh A2) đỏ đúng
  3 test. E2E (19 test, baseline tự chạy đều xanh trên build từ đúng SHA): M1 đổi
  chữ cổng → đỏ đúng `customer-ai.spec.ts:17`; M2 đổi badge cổng → đỏ đúng `:28`
  (dòng 17 vẫn xanh, chứng tỏ app vẫn chạy); M3 đổi câu key rỗng → đỏ đúng
  `settings-ai.spec.ts:165`; M4 đổi URL ChatGPT → đỏ đúng `customer-ai-web.spec.ts:83`
  (các assert tin nhắn copy ở :79–82 vẫn xanh). Ranh giới module: `pnpm lint:deps`
  xanh (297 module, 1156 phụ thuộc); fixture phủ định riêng chứng minh cả 3 rule
  Phase 5 đều bắn (4 vi phạm đúng) và 4 ngoại lệ đều qua (`ai`→`domain`,
  test `ai`→`db`, `db`→`ai/schema`, `ai`→`zod`). Ngưỡng coverage `ai` 100%: chứng
  minh sống (chạy 1 file test → 4 dòng ERROR đúng tên pattern) và đang đạt thật
  (264 test, 100/100/100/100). Ghi nhận (không thành phát hiện): chưa có test
  end-to-end "key trong serverMessage đi suốt tới report/log vẫn bị che" (hiện che
  ở nguồn đã được ghim, chuỗi xuôi chỉ truyền tay); `AI_BUSY` của Rust chưa có e2e
  nào dựng (stand-in làm được qua `aiError`, nhưng message đã phủ ở unit
  `ai-jobs/ai-panel-view/settings-ai-view`); `tools/` không có ngưỡng coverage
  trong repo config (đo được 98,94/96,36/97,36/99,17 — xem MS-E4).
- **A — Trợ năng / i18n: đã xét, không thấy.** Spec e2e toàn gói dùng locator theo
  roleaccessible name (`region`, `status`, `alert`, `note`, `table`), gián tiếp
  ghim cấu trúc trợ năng của panel AI; các chuỗi assert đều là tiếng Việt trong
  app (không assert chuỗi cứng tiếng Anh lạc); report eval là Markdown tiếng Việt
  đúng quy ước tài liệu dự án.

## KNOWN đã kiểm, không có bằng chứng mới (không nêu thành phát hiện)

- Hook `resolve` của `tools/eval-ai.mjs:21` bỏ qua specifier có dấu chấm (known.md
  #474): cây import thật (core + `index.ts` + `retry.ts` + `period.ts` + fixture)
  vẫn nạp được — mọi probe `p-*.mjs` phiên này chạy qua đúng hook đó. Không thử
  thêm vì không có specifier mới dạng đó trong cây.
- Tên prompt ghi cứng `analysis@1/discovery@1/extraction@1` ở đầu file kết quả
  (`:490`, known.md #474): đối chiếu G5 hiện tại vẫn đúng (không lệch), chỉ sai
  khi G5 tăng version trong tương lai.
- `noteDetails` tìm chữ ghi chú trong `EVAL_NOTES` toàn cục (`:443`, known.md #474):
  đường chạy chuẩn (ghi chú golden) đã phủ bởi test + chạy thật 10/10; không dựng
  thêm vì known.md đã mô tả đủ hậu quả (TypeError) và hướng sửa.

## Phụ lục — test tạm (`muse/E/`)

Tất cả chạy ngoài repo, repo không bị sửa. `T` = thư mục temp sandbox của phiên
(`...\muse-shell-sandbox-39ec8c29-a966-4d2e-b530-7a5498abb3fc`).

| File | Chạy | Kết quả |
|---|---|---|
| `E/p-grade.mjs` | `node p-grade.mjs` (repo làm cwd) | quote xuống dòng → `missing`, `pass:false` (MS-E1) |
| `E/p-grade2.mjs` | `node p-grade2.mjs` | quote NFD → `missing`, `pass:false` (MS-E1) |
| `E/p-v7keep.mjs` | `node p-v7keep.mjs` | `V7 kept=1 dropped=0 \| grade pass=false` cả hai dạng (MS-E1) |
| `E/p-tries.mjs` | `node p-tries.mjs` | `0 lần thử` khi lỗi lần 1; `1 lần thử`/2 calls khi lỗi lần 2 (MS-E4) |
| `E/p-html.mjs` | `node p-html.mjs` | `raw </details> present: true` (MS-E5) |
| `E/um/mk.mjs` + `E/um/vitest.um.config.mjs` | `node mk.mjs UM<n>` rồi `pnpm vitest run --config vitest.um.config.mjs` (cần junction `um/packages` → `packages` của repo và `TEMP`/`TMP` trỏ chỗ ghi được — xem `E/um/README-um.md`) | UM0 canary `MUT-ALIVE`; UM1 đỏ 2 test A1; UM2 đỏ 2 test che key; UM3 đỏ 2 test gradeNote; UM4 đỏ 3 test A2 |
| `E/serve-mut.mjs` + `E/pw.config.ts` + `E/e2e-batch.ps1` | build web ra temp với `VITE_DEMO_ANCHOR=15/09/2026` rồi chạy batch (cần listen socket — chạy escalated) | baseline 7+5+6+1 xanh; M1 đỏ `:17`, M2 đỏ `:28`, M3 đỏ `:165`, M4 đỏ `:83` |
| `E/dep/` (fixture 13 file) + `E/dep-config.cjs` (chép nguyên `.dependency-cruiser.cjs`) | `depcruise --config dep-config.cjs packages` với cwd=`dep/` | đúng 4 vi phạm (`ai-only` ×2, `ai-schema-standalone`, `db-only`), 4 ca hợp lệ qua |
| `E/vitest.cov1/2/3.config.mjs` | `pnpm vitest run --config ...` | cov1: 4 dòng `ERROR ... threshold (100%)`; cov2: 264 test, `All files 100/100/100/100`; cov3 (tools): `98.94/96.36/97.36/99.17`, hở dòng 269, 316 |

Trích output thật (nguyên văn, đã gọn ANSI):

```
✔ no dependency violations found (297 modules, 1156 dependencies cruised)
Export maps are up to date.
Test Files  2 passed (2) / Tests  90 passed (90)   (tools/eval-ai-core + pr-core)
UM0 → Error: MUT-ALIVE (alias redirect sống)
UM1 → 2 failed: formatReport/sums A1–A4…, formatReport/shows errors…
UM2 → 2 failed: openCodeAdapter/maps HTTP statuses…key masked, …/cuts the server message…
UM3 → 2 failed: gradeNote/passes when each required line…, gradeNote/fails on a forbidden fact
UM4 → 3 failed: runEval/calls nothing…, formatReport/sums…, formatReport/shows errors…
dep → error db-only…: db-bad.ts → ai-ok.ts; error ai-schema-standalone: schema.ts → ai-ok.ts;
         error ai-only…: ai-bad-fs.ts → fs; error ai-only…: ai-bad-db.ts → db/src/thing.ts
cov1 → ERROR: Coverage for lines (0.56%) does not meet "packages/ai/src/**" threshold (100%) (+3)
cov2 → Test Files 13 passed / Tests 264 passed; All files | 100 | 100 | 100 | 100
cov3 → eval-ai-core.mjs | 98.94 | 96.36 | 97.36 | 99.17 | 269,316
e2e → BASELINE-AI 7 passed (22.3s); BASELINE-WEB 5 passed (13.8s);
      BASELINE-SET 6 passed (14.1s); BASELINE-APT 1 passed (6.0s)
MUT-M1 → 1 failed, at customer-ai.spec.ts:17:23 (toContainText gate)
MUT-M2 → 1 failed, at customer-ai.spec.ts:28:23 (toContainText PROFILE_DISCOVERY)
MUT-M3 → 1 failed, at settings-ai.spec.ts:165:22 (toContainText 'Chưa nhập key.')
MUT-M4 → 1 failed, at customer-ai-web.spec.ts:83:18 (opened toEqual)
```

Ghi chú build: `pnpm build:web` trong repo thất bại ở bước xóa `dist/` (EPERM,
file của Owner) sau khi `tsc` và transform 1087 module đã xong — trùng số module
baseline; build dùng cho e2e chạy `vite build --outDir <temp>/webdist` với
`VITE_DEMO_ANCHOR=15/09/2026`, các chunk phụ trùng hash baseline
(`2K9eLC7h/Zomw1zIK/DgbhWywh`), chunk index khác hash do chuỗi anchor bake vào.

## `git status --short` cuối phiên

```
0df3606fb783cc89b1b9c413c02810340e273a4f
?? .agents/
?? .codex/
?? AGENTS.md
?? opencode.json
```

Đúng 4 mục cho phép như đầu phiên — repo không bị sửa.

