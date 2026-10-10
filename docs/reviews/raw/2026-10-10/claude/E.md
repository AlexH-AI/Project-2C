# Deep review Phase 5 — gói E (tools + e2e + CI) — Claude

- **SHA:** `0df3606` (`git rev-parse HEAD` = `0df3606fb783cc89b1b9c413c02810340e273a4f`, kiểm đầu và cuối phiên). Ngày 10/10/2026, Home PC.
- **Chỉ đọc:** không sửa file nào trong repo, không commit. Đột biến của `tools/eval-ai-core.mjs` chạy trên **bản chép** ở `E\mut\` (import viết lại trỏ về worktree), không ghi đè file của repo. Luật `dependency-cruiser` thử trên một repo mini ở `E\depcruise\` với đúng config của repo. `git status --short` cuối phiên: **sạch**.
- **Không gọi AI thật:** mọi probe dùng `fetch` giả. Không chạy `pnpm eval:ai` với key; `node tools/eval-ai.mjs` chỉ chạy một lần **không có** `OPENCODE_GO_KEY` (đã kiểm biến không đặt): dừng ở `readConfig`, exit 1, không gọi gì. Không đụng Credential Manager, không mở chatgpt.com.
- Không đọc `C:\workspace\deep-review-5\codex\`. Có đọc báo cáo Claude A–D (chỉ dẫn ID khi trùng).

## 1. Phạm vi đã đọc

| File | Dòng | Cách |
|---|---|---|
| `tools/eval-ai-core.mjs` | 1–584 (hết) | đọc từng dòng; so phần gọi HTTP với `apps/desktop/src-tauri/src/ai.rs:13–14, 160–256, 317–354`; probe + 35 đột biến |
| `tools/eval-ai.mjs` | 1–52 (hết) | đọc; chạy không key (exit 1) |
| `tools/eval-ai-core.test.mjs` | 1–645 (hết) | đọc; chạy bản chép (33 test xanh, 0,74 s) |
| `tools/fixtures/ai-eval.mjs` | 1–314 (hết) | so tay từng hồ sơ E01–E20 (chế độ, hạng mục thiếu, cảnh báo) và X01–X05 (phải có / không được có) với `docs/golden/ai-eval.md` §3–§5 |
| `docs/golden/ai-eval.md` | 1–119 (hết) | nguồn đúng của chấm điểm |
| `docs/design/phase-5-ai.md` | §10–§12 (355–380) | spec bộ eval, ranh giới |
| `docs/metrics/ai-eval-2026-10-10.md` | 1–60 + khối E10 | đọc kết quả thật để đối chiếu cách chấm (không chạy lại) |
| `e2e/support.ts` | 1–173 (hết) | đọc; độ trung thực của IPC giả so với `ai.rs` (`AiError`, `Completion` camelCase) |
| `e2e/customer-ai.spec.ts` | 1–386 (hết) | đọc |
| `e2e/customer-ai-web.spec.ts` | 1–214 (hết) | đọc |
| `e2e/settings-ai.spec.ts` | 1–233 (hết) | đọc |
| `e2e/appointments.spec.ts`, `appointment-outcome.spec.ts`, `customer-kyc.spec.ts`, `dialog-keyboard.spec.ts` | diff `3e84ce8..0df3606` | đọc phần Phase 5 |
| `.github/workflows/ci.yml` | 1–140 (hết) | đọc; `paths` |
| `.dependency-cruiser.cjs` | 1–72 (hết) | đọc; probe trên repo mini |
| `vitest.config.ts`, `playwright.config.ts`, `package.json` (scripts) | hết | đọc |
| `tools/codemap-core.mjs`, `tools/codemap.mjs`, `tools/pr-core.mjs` (+ test) | diff Phase 5 + `isDocsOnly` | đọc; probe `isDocsOnly` |
| Đối chiếu: `packages/ai/src/run.ts`, `validator.ts:104–165`, `input.ts:61–106`, `prompts/prompts.test.ts`, `web.test.ts:1–20`, `packages/domain/src/kyc-fact.ts:29–45`, `apps/desktop/src/data/tauri-contract.test.ts:1–60`, `ai-analysis.test.ts` (danh sách ca) | phần liên quan | đọc |

Chạy: bộ e2e AI của repo (`customer-ai`, `customer-ai-web`, `settings-ai`) `--repeat-each 3`: **54 / 54 xanh, 0 flaky, 55,5 s**. `tsc -p e2e --noEmit --noUnusedLocals --noUnusedParameters`: **0 lỗi**.

## 2. Phát hiện

### CL-E1 — Chấm X so trích dẫn nguyên văn, còn V7 so bản NFC + gộp khoảng trắng: đề xuất V7 giữ lại bị chấm "thiếu"

```
ID: CL-E1
Mức: Low
Trục: E / C
Vị trí: tools/eval-ai-core.mjs:221-228 (gradeNote); packages/ai/src/validator.ts:121, 146, 149 (V7 so collapseSpaces, giữ quote gốc)
Tình trạng: CONFIRMED
```

- **Mô tả:** `filterExtraction` (V7) nhận trích dẫn khi `NFC + \s+ → ' '` của nó nằm trong ghi chú, nhưng giữ **nguyên** `quote` model viết. `gradeNote` lại so `quote.toLowerCase().includes(từ khóa)` trên chuỗi gốc. Trích dẫn ở dạng NFD, hay có NBSP / xuống dòng / hai dấu cách **bên trong** từ khóa, qua V7 nhưng bị chấm thiếu dòng "Phải có", tức là trái `ai-eval.md` §5 mục 2 ("`quote` chứa từ khóa, không phân biệt hoa / thường").
- **Tái hiện** (`node E\probe-eval.mjs`, P1): cùng đề xuất `residence` = "Đà Nẵng" của X01:

  | trích dẫn | V7 | `gradeNote` |
  |---|---|---|
  | NFC `sống ở Đà Nẵng` | giữ | đạt |
  | NFD | giữ | **thiếu** `residence — "Đà Nẵng"` |
  | `Đà` + NBSP + `Nẵng` | giữ | **thiếu** |
  | `Đà` + LF + `Nẵng` | giữ | **thiếu** |
  | NBSP / hai dấu cách ngoài từ khóa | giữ | đạt |

  Qua `runEval` với X01 trả đủ 4 dòng, mọi `quote` ở NFD: `status=OK kept=4 dropped=0 pass=false`, thiếu 3 dòng (`residence`, `maritalStatus`, `primaryGoal / otherGoals`; dòng "hai con" không có dấu nên vẫn đạt).
- **Ảnh hưởng:** chỉ làm chấm khắt hơn (TRƯỢT giả), không làm đạt giả. Lần chạy 10/10 không gặp (5/5), nhưng model trả NFD hoặc xuống dòng trong trích dẫn thì cột "Script" ghi TRƯỢT, và Owner phải đọc lại để biết lỗi ở script.
- **Đề xuất:** `gradeNote` chuẩn hóa `quote` và từ khóa cùng cách V7 làm (NFC, gộp `\s+`), rồi mới `toLowerCase`. Thêm 1 ca test NFD. Cỡ: ~5 dòng + 1 test.

### CL-E2 — Giá trị model viết vào cột "Không được có" không qua `plain()`

```
ID: CL-E2
Mức: Low
Trục: S
Vị trí: tools/eval-ai-core.mjs:237 (forbidden), :524-525 (ô bảng chỉ qua cell())
Tình trạng: CONFIRMED
```

- **Mô tả:** `gradeNote` dựng `\`${fact.field}\` = "${fact.value}"` cho mỗi đề xuất bị cấm, và `formatReport` ghi thẳng vào bảng X01–X05 (chỉ `cell()`: thoát `|` và xuống dòng). `value` là chữ model viết: V7 chỉ kiểm `quote` nằm trong ghi chú, **không** kiểm `value`. Với X03 thì mọi đề xuất đều bị cấm, X04 là mọi trường khác `riskProfile`. Chỗ này khác hai dòng đã có trong KNOWN (`detail` ở `:409`, `:451`): đây là ô bảng tổng hợp ở đầu file.
- **Tái hiện** (`probe-eval.mjs` P2, X03 trả `{"facts":[{"field":"residence","value":"<!-- x","quote":"văn phòng"}]}`): dòng bảng thành `| X03 | OK | 1 | đủ | \`residence\` = "<!-- x" | 0 | 1 / 1 | 1.0 s | **TRƯỢT** |`, nghĩa là `<!--` vào file nguyên văn. Cùng giá trị đó ở khối chi tiết thì đã được thoát (`&lt;!-- x`).
- **Ảnh hưởng:** file kết quả được commit (repo public). Một `<!--` không đóng hay thẻ HTML trong ô có thể làm sai phần còn lại của file khi xem trên GitHub. Chưa thử trên GitHub; GitHub lọc script nên đây không phải XSS.
- **Đề xuất:** `plain(fact.value)` trong `gradeNote` (hoặc khi ghi ô), gom cùng việc sửa KNOWN `:409` / `:451`. Cỡ: 1–2 dòng + 1 test.

### CL-E3 — "Không ghi đè" chỉ kiểm lúc bắt đầu; lần ghi cuối là `writeFileSync` ghi đè

```
ID: CL-E3
Mức: Low
Trục: D
Vị trí: tools/eval-ai-core.mjs:563-567 (exists) và :575-576; tools/eval-ai.mjs:49-50 (writeFileSync không cờ)
Tình trạng: CONFIRMED
```

- **Mô tả:** `evalMain` kiểm `exists(path)` trước lần gọi đầu, nhưng ghi file sau cả lượt chạy (thật: 606 s; tối đa 25 × 2 × 120 s). `writeFileSync` mặc định cờ `w` nên ghi đè file xuất hiện trong khoảng đó.
- **Tái hiện** (`probe-eval.mjs` P3, `exists` / `writeFile` y như `eval-ai.mjs:49–50`, thư mục tạm; `fetch` giả ghi một file "RESULT OF THE OTHER RUN" ở lần gọi đầu): `exit=0 calls=50`, file của lần chạy kia bị thay bằng `# Eval AI — 2026-10-12`.
- **Ảnh hưởng:** hai lần chạy cùng ngày cùng model (hai terminal), hoặc `git pull` kéo về file cùng ngày của máy kia trong lúc đang chạy (Owner dùng hai máy): kết quả trả tiền của lần trước bị mất, trái câu `:566` "không ghi đè kết quả của một lần chạy". Bản cũ đã commit thì git còn giữ; bản chưa commit thì mất hẳn.
- **Đề xuất:** `writeFileSync(..., { flag: 'wx' })`; gặp `EEXIST` thì đi nhánh in kết quả ra màn hình (`:577–580`) đã có sẵn. Cỡ: ~3 dòng + 1 test.

### CL-E4 — Lượt chạy bị dừng giữa chừng (Ctrl+C, treo) mất mọi câu trả lời đã trả tiền

```
ID: CL-E4
Mức: Low
Trục: D
Vị trí: tools/eval-ai-core.mjs:573-576 (chỉ ghi một lần ở cuối), :321 / :356 (log chỉ in trạng thái)
Tình trạng: CONFIRMED
```

- **Mô tả:** comment `:578` nói rõ ý "the run is paid for", nhưng kết quả chỉ được ghi một lần sau hồ sơ / ghi chú cuối. Màn hình chỉ có một dòng trạng thái cho mỗi mục, không có output.
- **Tái hiện** (`node E\probe-interrupt.mjs`): tiến trình con chạy `evalMain` với `fetch` giả. E01 trả 2 lần (REJECTED), lần gọi thứ 3 treo. Sau 3 s tiến trình cha kill nó: `docs/metrics` **trống**, output chỉ còn `E01 discovery REJECTED · 2 lần thử · 0.0 s`.
- **Ảnh hưởng:** Owner dừng một lượt chạy chậm (lượt 10/10 có lần gọi E18 mất 104,6 s) hoặc máy ngủ / mất mạng kéo dài thì mất cả token đã trả lẫn output để đọc tay R1–R7.
- **Đề xuất:** sau mỗi mục, ghi `formatReport` của phần đã có ra `<path>.partial`; xong thì đổi tên sang `<path>` (dùng `wx` như CL-E3). Hoặc nối từng kết quả vào `.partial.jsonl`. Cỡ: ~20 dòng + test.

### CL-E5 — Hai tài liệu mà test so nguyên văn được CI và `merge-pr` coi là docs-only

```
ID: CL-E5
Mức: Low
Trục: C
Vị trí: .github/workflows/ci.yml:8-16, 21-29 ('!docs/**', '!**/*.md'); tools/pr-core.mjs:27-32 (isDocsOnly); test đọc tài liệu: packages/ai/src/prompts/prompts.test.ts:2, packages/ai/src/web.test.ts:2 (docs/design/phase-5-prompts.md), tools/eval-ai-core.test.mjs:25 (docs/golden/ai-eval.md)
Tình trạng: CONFIRMED
```

- **Mô tả:** Phase 5 thêm test giữ "code chép đúng G5 / G2": chữ prompt, retry và `web@1` so với `phase-5-prompts.md`; hồ sơ E11–E20 và ghi chú X so với `ai-eval.md`. Nhưng PR chỉ sửa hai file đó không chạy CI, và `merge-pr` cho merge không cần CI. Phase 5 đã đưa `packages/ai/CLAUDE.md` vào danh sách "md là code" (`CODEMAP_DOCS`) nhưng không đưa hai file này vào.
- **Bằng chứng:** `isDocsOnly(['docs/design/phase-5-prompts.md'])` → `true`; `isDocsOnly(['docs/golden/ai-eval.md'])` → `true` (probe một dòng, mục 5.3).
- **Ảnh hưởng:** một PR docs sửa G5 (vd. ứng viên KNOWN "dễ chốt" sang "Bỏ dấu: không", hay một chữ trong khối prompt) merge được mà không ai thấy code lệch tài liệu. `main` đỏ âm thầm, và PR code kế tiếp đỏ vì lý do không liên quan. Danh sách chặn §8 thì không test nào so với tài liệu (gói A chỉ so bằng probe), nên lệch ở đó không bị bắt ở bước nào.
- **Đề xuất:** thêm `docs/design/phase-5-prompts.md` và `docs/golden/ai-eval.md` vào `paths` của `ci.yml` và vào danh sách "md là code" của `pr-core.mjs` (đổi tên `CODEMAP_DOCS` thành danh sách chung). Test hiện có "matches the paths filter of ci.yml" giữ hai nơi khớp nhau. Cỡ: ~10 dòng.

### CL-E6 — Test của script eval: 4 / 35 đột biến có nghĩa sống; fixture chỉ so một phần với tài liệu; lệnh thật không chạy trong CI

```
ID: CL-E6
Mức: Low
Trục: T
Vị trí: tools/eval-ai-core.test.mjs (toàn file); tools/fixtures/ai-eval.mjs:3 (comment); tools/eval-ai-core.mjs:29-32, 95-123 (chép logic ai.rs)
Tình trạng: CONFIRMED
```

- **Đột biến** (`node E\mutate-eval.mjs`, 35 đột biến một chỗ, chạy 33 test của bản chép): **28 bị giết, 7 sống**, trong đó 3 tương đương (M30 giữ cả `output` lẫn `raw`; M33 bỏ `map` role/content vì message chỉ có hai khóa đó; M35 `''` thay `undefined` vì `readReply` lọc giá trị falsy). Bốn đột biến sống có nghĩa:

  | # | Đột biến | Hậu quả khi code sai mà test vẫn xanh |
  |---|---|---|
  | M5 | `missingBlocks` bỏ `!Object.hasOwn(parsed, path)` | A3 đếm cả V1 "sai kiểu" của khối **có mặt** là "thiếu khóa khối". Lượt thật 10/10 có đúng ca này (E16 `lần 1: V1 \`nextBestActions\``, A3 = 0 đúng) |
  | M9 | A1 `>=` → `>` | 18/20 (đúng ngưỡng spec §11) chấm TRƯỢT. Test chỉ có 17/20 và 20/20 |
  | M16 | `TIMEOUT_MS` 120 000 → 1 200 000 | lần gọi treo chờ 20 phút. Test chỉ kiểm có `AbortSignal` |
  | M20 | bỏ `stopped = FATAL…` ở vòng ghi chú | 401 / 429 ở X01 vẫn gọi tiếp X02–X05. Test FATAL chỉ có ở vòng hồ sơ |

- **Fixture so tài liệu:** comment `fixtures/ai-eval.mjs:3` ghi "checks it against the gate and against the doc". Thật ra `mode` / `missing` / `warnings` chỉ được so với **cổng** (`test:56–71`), không so với cột "Chế độ / Hạng mục thiếu / Cảnh báo" của `ai-eval.md`. `required` / `forbidden` của X01–X05 không được so với gì. Tôi đã so tay cả 20 + 5 mục: **hiện khớp hết**. Nhưng sửa từ khóa (vd. "Đà Nẵng" → "Nẵng") thì test vẫn xanh, trong khi `ai-eval.md` §1 đòi "chép 1–1".
- **Lệnh thật:** `tools/eval-ai.mjs` (hook resolve + Node tự bỏ kiểu TS trên cả cây import của `@p2c/ai`) không có lần chạy nào trong CI. Một import mới mà Node không bỏ kiểu được (`enum`, `?raw`, `.tsx`) chỉ lộ ra trên máy Owner. Chạy tay hôm nay thì nạp được (exit 1, câu thiếu key).
- **Chép logic Rust:** URL hai gói, bảng mã HTTP → mã lỗi và cách cắt `serverMessage` là bản chép của `ai.rs:13–14, 202–256`. Không test nào so hai bên như `tauri-contract.test.ts` làm cho tên lệnh. Hôm nay đọc song song thấy khớp (mục 4).
- **Đề xuất:** 4 ca test cho M5, M9 (18/20), M16, M20; một test đọc bảng §3 / §4 / §5 của `ai-eval.md` so với fixture (như đã làm cho §4.1); một test smoke `node tools/eval-ai.mjs` không key → exit 1 (không mạng); một ca trong `tauri-contract.test.ts` so `PLAN_URLS` với `GO_URL` / `CREDIT_URL` của `ai.rs`. Cỡ: ~80 dòng test.

### CL-E7 — Thông điệp lỗi của server vào file kết quả commit lên repo public, chỉ che key

```
ID: CL-E7
Mức: Nit
Trục: S
Vị trí: tools/eval-ai-core.mjs:81-93 (serverMessage), :374-377 (statusWord ghi vào bảng và khối chi tiết)
Tình trạng: PLAUSIBLE (cơ chế CONFIRMED bằng test có sẵn eval-ai-core.test.mjs:568; nội dung lỗi thật của OpenCode chưa biết)
```

- **Mô tả:** khi gặp lỗi HTTP, script ghi 200 ký tự đầu của thông điệp server vào file `docs/metrics/…`, rồi file đó được commit (#479). Chỉ key bị che; mã phiên không bị che (cùng gốc CL-C7). Theo `ai-eval.md` §1, mô tả lỗi khi model từ chối tham số là thứ **cần** ghi. Nhưng thông điệp 401 / 402 / 429 của nhà cung cấp có thể có định danh tài khoản / workspace / email.
- **Ảnh hưởng:** thấp, vì Owner đọc file trước khi mở PR docs. Ghi lại để quy trình biết.
- **Đề xuất:** với `AI_UNAUTHORIZED` / `AI_RATE_LIMITED`, chỉ ghi mã + HTTP vào file và in thông điệp ra màn hình; hoặc một dòng nhắc "đọc trước khi commit" ở đầu file. Cỡ: ~5 dòng.

### CL-E8 — e2e không đi qua phân tích / trích xuất bằng OpenCode: `ai_complete` giả chỉ trả "OK"

```
ID: CL-E8
Mức: Nit
Trục: T
Vị trí: e2e/support.ts:82-87; aiCalls chỉ được kiểm ở e2e/settings-ai.spec.ts:151, 208, 232 (Kiểm tra kết nối); e2e/customer-ai-web.spec.ts:82
Tình trạng: CONFIRMED (grep: không spec nào khác đọc aiCalls; câu trả lời giả cố định)
```

- **Mô tả:** IPC giả luôn trả `content: 'OK'` (không có JSON), nên với provider OpenCode e2e chỉ thấy được REJECTED / "không đọc được", Hủy và lỗi. Không ca e2e nào thấy dòng ACCEPTED của OpenCode (chip model, token) hay kiểm **cái gì** đi vào `ai_complete` của phân tích / trích xuất: `maxTokens` 8000 / 4000, không có tên / mã KH / năm sinh (spec §6.1), cùng `sessionId` ở lần thử lại. Unit đã phủ từng mảnh (`run.test.ts:579–606`, `ai-analysis.test.ts:615–648`). e2e ChatGPT web chỉ kiểm tên KH vắng trong tin nhắn (`:82`), không kiểm năm sinh "1984".
- **Ghi chú cho phiên tổng hợp:** `D.md:68` ghi "e2e `settings-ai.spec.ts` đã kiểm `page.content()`" để nói key không lọt vào DB / backup. Thật ra `page.content()` chỉ phủ DOM (IPC giả bỏ qua tham số của `db_save`). DB / backup do unit `ai-analysis.test.ts:593–613` phủ.
- **Đề xuất:** cho `ai_complete` giả nhận câu trả lời theo kịch bản (`exe.aiAnswer`) và thêm 1 e2e: discovery OpenCode ACCEPTED, kiểm `aiCalls[0]` (`maxTokens`, message `user` không có tên KH / "1984"), chip model trên panel. Cỡ: ~40 dòng test.

### CL-E9 — Helper e2e chép lại ở `appointments.spec.ts`

```
ID: CL-E9
Mức: Nit
Trục: B
Vị trí: e2e/appointments.spec.ts:817-846 (customerForAi, kycNote) ↔ e2e/support.ts:142-173 (createKycCustomer, addKycNote); panelOf ở customer-ai.spec.ts:7 và customer-ai-web.spec.ts:37
Tình trạng: CONFIRMED (đọc diff)
```

- **Mô tả:** `customerForAi` + `kycNote` giống từng bước `createKycCustomer` + `addKycNote` (không có tham số `conflict`), cả hai bản đều được thêm trong Phase 5. Đổi nhãn hộp "Khách hàng mới" / "Ghi chú KYC" thì phải sửa hai nơi.
- **Đề xuất:** `appointments.spec.ts` import hai helper của `support.ts`. Cỡ: −30 dòng.

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | G | C | D | S | P | B | T | A | Cộng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | | 0 |
| High | | | | | | | | | | 0 |
| Medium | | | | | | | | | | 0 |
| Low | 1 (E1) | | 1 (E5) | 2 (E3, E4) | 1 (E2) | | | 1 (E6) | | 6 |
| Nit | | | | | 1 (E7) | | 1 (E9) | 1 (E8) | | 3 |
| **Cộng** | 1 | 0 | 1 | 2 | 2 | 0 | 1 | 2 | 0 | **9** |

CL-E1 cũng chạm trục C (trái `ai-eval.md` §5 mục 2); đếm ở E.

## 4. Đã xét, không thấy

- **E — Edge case:**
  - `readConfig`: thiếu key, key toàn khoảng trắng, gói viết thường / có khoảng trắng (từ chối), cờ lạ, cờ thiếu giá trị, cờ lặp (lấy giá trị sau). Hồ sơ bị cổng chặn không gọi gì. Sau 401 / 429 thì phần còn lại `SKIPPED`. Một mục lỗi script không làm dừng lượt chạy (`settle`).
  - Output: trả lời rỗng thì vào `EMPTY_RAW_OUTPUT`; dấu backtick trong output được rào bằng fence dài hơn; `|` và xuống dòng trong ô bảng được thoát. Thông điệp server cắt theo code point sau khi che key (test). Thân trả lời > 2 MB → `AI_BAD_RESPONSE` (M18 bị giết).
  - e2e: 18 ca AI × 3 lần, không flaky. Ca "Hủy rồi không lưu" thật sự đỏ khi Hủy hỏng: câu "OK" được thả ra sẽ thành REJECTED và hiện trên panel.
- **G — Guardrail:**
  - Script đi đúng luồng của app: `takeAnalysisInput` → `runAnalysis` / `runExtraction` (V1–V7, đúng 1 lần thử lại, REJECTED), `checkAnalysisAnswer` cho câu trả lời trước một lỗi. X được chấm trên đề xuất còn lại sau V7, như §5.
  - `reasoning_effort: high` được gửi có chủ ý, bỏ qua cờ của `models.ts` (đúng `ai-eval.md` §1). A2 so chế độ với fixture và cổng.
  - E09 không gửi F1 / F2 (test).
- **C — Đúng hợp đồng:**
  - Ngưỡng A1 ≥ 18/20 và X ≥ 4/5 khớp §2.1 / §5. Tên file khớp spec §11, thêm `-<model>` khi không phải model mặc định (§1 "ghi riêng").
  - Đọc song song với `ai.rs`: body (`model, messages, max_tokens, reasoning_effort?`), header, bảng 401/403 → `AI_UNAUTHORIZED`, 402/429 → `AI_RATE_LIMITED`, 5xx/khác → `AI_HTTP`, thứ tự lấy thông điệp `error.message → error → message → text`, che key rồi mới cắt 200: **khớp**. Chỗ khác không ảnh hưởng eval: Rust thêm timeout kết nối 10 s và kiểm 200 000 ký tự / `max_tokens`; Rust đọc token bằng `as_u64`, JS bằng `isInteger`, nên số âm khác nhau.
  - User-Agent `Project-2C/<apps/desktop version>` = `0.1.0` = Cargo.
  - `CODEMAP_PACKAGES` ↔ `CODEMAP_DOCS` ↔ `ci.yml` được test giữ khớp. `packages/ai/CLAUDE.md` dài 7 188 / 8 000 ký tự.
  - `vitest.config.ts`: `packages/ai/src/**` ngưỡng 100 %, `tools/**/*.test.mjs` nằm trong `include`.
- **Ranh giới (`dependency-cruiser`):** repo mini với đúng config bắt đủ 4 vi phạm cố ý: `ai → node:fs`, `ai → db`, `db → @p2c/ai` (index), `schema.ts → models.ts`. `db → schema.ts` đạt. Trên repo thật: `zod` resolve vào `node_modules/.pnpm/zod@4.6.5/…`, `@p2c/domain` vào `packages/domain/src/index.ts`, type-only cũng được tính (`tsPreCompilationDeps`). File `*.test.ts` của `ai` được miễn luật `ai-only-on-domain-and-zod` (để đọc tài liệu qua `?raw`), nên về lý thuyết test của `ai` import được `db`. Grep: không test nào làm vậy. `db` chỉ import `@p2c/ai/schema` (6 chỗ).
- **D — Dữ liệu:** script không đụng DB. Chỉ có một file kết quả (xem CL-E3 / E4).
- **S — An toàn:**
  - Key chỉ đi trong header `Authorization`, không vào log hay file (test `:503`, `:623–625`, `:643`). Lỗi của `fetch` chỉ còn mã, không mang chữ của header. `redirect: 'error'` nên key không đi sang host khác.
  - Node `fetch` kiểm TLS mặc định (trừ khi máy đặt `NODE_TLS_REJECT_UNAUTHORIZED`) và không tự dùng proxy từ biến môi trường.
  - `ci.yml` không có `secrets`, không chạy `eval:ai`. e2e dùng key giả, giữ trong bộ nhớ của IPC giả. Ô key trống sau khi lưu, DOM không có key.
- **P — Hiệu năng:**
  - Test của script: 33 test 0,74 s. e2e AI: 54 lần chạy 55,5 s.
  - Lượt thật 10/10 (file trong repo): tổng 606 s. Lần gọi chậm nhất E18 **104,6 s** cho một lần thử, ở reasoning HIGH, bằng 87 % timeout 120 s của spec §5. Đây không phải lỗi code; ghi lại làm số liệu khi cân nhắc timeout / mức suy luận.
  - `missingBlocks` gọi lại `extractJson` trên mỗi câu trả lời, nên cùng độ phức tạp CL-A5. Không báo thêm.
- **B — Bloat:** `tsc --noUnusedLocals --noUnusedParameters` trên e2e: 0. Mọi export của `eval-ai-core.mjs` được test hoặc lệnh dùng. Code lặp: CL-E9, và phần chép Rust ở CL-E6.
- **T — Test:** CL-E6, CL-E8. Đột biến TSX qua e2e đã làm ở CL-D4, không làm lại.
- **A — Trợ năng / i18n:** e2e chọn phần tử theo role / nhãn, kiểm `role=status` / `alert` cho trạng thái chạy / lỗi. Chữ tiếng Việt của script eval là công cụ, không phải chuỗi UI (`vi.ts` không áp).
- **KNOWN không nêu lại** (probe không cho bằng chứng mới): `detail` không qua `plain()` (`:409`, `:451`; CL-E2 là chỗ thứ ba, khác dòng); `recording` không đếm lần gọi lỗi; tên prompt `@1` ghi cứng; hook `resolve` bỏ qua specifier có dấu chấm; `noteDetails` đọc `EVAL_NOTES` toàn cục.

## 5. Phụ lục — nguồn probe (trong `C:\workspace\deep-review-5\claude\E\`)

| File | Việc | Chạy |
|---|---|---|
| `probe-eval.mjs` | P1 `gradeNote` ↔ V7 (NFC / NFD / NBSP / LF) và qua `runEval`; P2 HTML trong ô "Không được có"; P3 ghi đè sau khi kiểm `exists`; P4 A3 đếm cả ghi chú. `fetch` / adapter giả, thư mục tạm | `node E\probe-eval.mjs` |
| `probe-interrupt.mjs` | kill tiến trình con giữa lượt chạy, xem còn file nào (CL-E4) | `node E\probe-interrupt.mjs` |
| `mutate-eval.mjs` (+ `mutate-eval-out.txt`) | 35 đột biến `eval-ai-core.mjs` trên bản chép `mut\eval-ai-core.mjs`, test chép `mut\eval-ai-core.test.mjs` (import trỏ `/@fs/C:/workspace/Project-2C-review/…`); `base` chạy bản không đột biến (33 xanh) | `node E\mutate-eval.mjs [base \| Mn …]`; cần junction `mut\node_modules` → `C:\workspace\Project-2C-review\node_modules` (đã gỡ cuối phiên, tạo lại bằng `New-Item -ItemType Junction`) |
| `depcruise\` | repo mini: `packages/ai/src/{a.ts,b.test.ts,schema.ts,models.ts,index.ts}`, `packages/db/src/index.ts`, `packages/domain/src/index.ts`, `tsconfig.base.json`, bản chép `.dependency-cruiser.cjs` | `cd E\depcruise; node C:\workspace\Project-2C-review\node_modules\dependency-cruiser\bin\dependency-cruiser.mjs --config .dependency-cruiser.cjs packages` |

### 5.1 Đầu ra `probe-eval.mjs` (rút gọn)

```
== P1 gradeNote vs V7 on the same quote
  NFC        V7 kept=1 dropped=0 → gradeNote pass=true missing=[]
  NFD        V7 kept=1 dropped=0 → gradeNote pass=false missing=["`residence` — \"Đà Nẵng\""]
  two spaces V7 kept=1 dropped=0 → gradeNote pass=true missing=[]
  NBSP       V7 kept=1 dropped=0 → gradeNote pass=true missing=[]
  NBSP in kw V7 kept=1 dropped=0 → gradeNote pass=false missing=["`residence` — \"Đà Nẵng\""]
  LF in kw   V7 kept=1 dropped=0 → gradeNote pass=false missing=["`residence` — \"Đà Nẵng\""]
  runEval X01 (NFD quotes): status=OK kept=4 dropped=0 pass=false
    missing: `residence` — "Đà Nẵng" ; `maritalStatus` — "vợ" ; `primaryGoal` / `otherGoals` — "quỹ từ thiện"
== P2 HTML / comment from the model in the result file
  table row: | X03 | OK | 1 | đủ | `residence` = "<!-- x" | 0 | 1 / 1 | 1.0 s | **TRƯỢT** |
  details line (plain): - `residence` = "&lt;!-- x" — trích: "văn phòng"
== P3 existence check at start, plain writeFileSync at the end
  exit=0 calls=50 other run's file kept=false (now starts: "# Eval AI — 2026-10-12")
== P4 A3 counts a note
  | A3 | Lần thử V1 trượt vì thiếu khóa khối | 2 (X03 lần 1: `facts`; X03 lần 2: `facts`) | ghi nhận |
```

P4 không thành phát hiện: §2.1 không giới hạn A3 ở hồ sơ, và với ghi chú, "thiếu `facts`" đúng là thiếu khóa khối.

### 5.2 Đầu ra `probe-interrupt.mjs`

```
child still running after 3 s (stuck on call 3): true; exit {"code":null,"signal":"SIGTERM"}
child output:
Eval AI: gói GO, model deepseek-v4.1-flash, reasoning HIGH.
E01 discovery REJECTED · 2 lần thử · 0.0 s
files in docs/metrics after the kill: []
```

### 5.3 Probe một dòng

```
node --input-type=module -e "import { isDocsOnly } from 'file:///C:/workspace/Project-2C-review/tools/pr-core.mjs'; …"
docs/design/phase-5-prompts.md true
docs/golden/ai-eval.md true
docs/golden/kyc.md true
packages/ai/CLAUDE.md false
```

`dependency-cruiser` trên repo mini:

```
error db-only-on-domain-and-ai-schema: packages/db/src/index.ts → packages/ai/src/index.ts
error ai-schema-standalone: packages/ai/src/schema.ts → packages/ai/src/models.ts
error ai-only-on-domain-and-zod: packages/ai/src/a.ts → packages/db/src/index.ts
error ai-only-on-domain-and-zod: packages/ai/src/a.ts → fs
x 4 dependency violations (4 errors, 0 warnings). 8 modules, 7 dependencies cruised.
```

(`b.test.ts → db` không bị báo, do miễn trừ `\.test\.ts$`; `db → schema.ts` không bị báo, đúng thiết kế.)

### 5.4 Đột biến `eval-ai-core.mjs` (`mutate-eval-out.txt`)

Bị giết (28): M1 403 → HTTP, M2 bỏ che key, M3 cắt trước rồi mới che, M4 bỏ 429 khỏi FATAL, M6 bỏ kiểm giá trị, M7 phân biệt hoa / thường, M8 ngưỡng 17, M10 không thoát `<`, M11 fence cố định, M12 không thoát `|`, M13 bỏ kiểm file có sẵn, M14 không trim key, M15 `redirect: 'follow'`, M17 không viết thường reasoning, M18 bỏ trần 2 MB (lần đầu ghi nhầm "SURVIVED" vì `spawnSync` tràn bộ đệm khi in 1,1 triệu ký tự; chạy lại với `maxBuffer` 256 MB: bị giết), M19 token luôn 0, M21 A2 luôn đúng, M22 ngưỡng X 3, M23 bỏ SKIPPED của ghi chú, M24 bỏ `x-opencode-session`, M25 luôn thêm đuôi model, M26 bỏ "Không được có", M27 nhận gói viết thường, M28 bỏ 402, M29 timeout thành mạng, M31 bỏ "lần n" trong A3, M32 thời gian của SKIPPED, M36 chế độ của BLOCKED.
Sống (7): M5, M9, M16, M20 (có nghĩa, CL-E6); M30, M33, M35 (tương đương).
