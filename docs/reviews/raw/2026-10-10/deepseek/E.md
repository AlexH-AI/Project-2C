# Deep review Phase 5 — gói E (tools + e2e + CI) — DeepSeek

- SHA kiểm đầu phiên: `0df3606fb783cc89b1b9c413c02810340e273a4f` (khớp ghim `0df3606`).
- `git status --short` đầu phiên: `?? opencode.json` (chỉ còn file này).
- `git status --short` cuối phiên: `?? opencode.json`; `git diff --stat` rỗng (repo nguyên vẹn; mọi test tạm/mutation nằm ngoài repo, ở `C:\workspace\deep-review-5\deepseek\E\`).
- Ngày: 10/10/2026. Báo cáo viết dần trong lúc làm; bản này là bản cuối gói E.

## 1. Phạm vi đã đọc

File trong phạm vi gói (đọc đủ, trừ chỗ ghi rõ):

| File | Ghi chú |
|---|---|
| `tools/eval-ai-core.mjs` (584 dòng) | đọc đủ; đối chiếu từng mục `ai-eval.md` §2/§5 |
| `tools/eval-ai.mjs` (52) | đọc đủ |
| `tools/eval-ai-core.test.mjs` (645) | đọc đủ |
| `tools/fixtures/ai-eval.mjs` (314) | đọc đủ, so với golden từng dòng E11–E20 + X01–X05 |
| `tools/codemap.mjs` (95), `tools/codemap-core.mjs` (199), `tools/codemap-core.test.mjs` (197) | đọc đủ |
| `tools/pr-core.mjs`, `tools/pr-core.test.mjs` (563) | đọc đủ phần đổi + test liên quan CODEMAP_DOCS/ci.yml |
| `e2e/support.ts` (173) | đọc đủ (kể cả stub `asExe` AI) |
| `e2e/customer-ai.spec.ts` (386), `e2e/customer-ai-web.spec.ts` (214), `e2e/settings-ai.spec.ts` (233) | đọc đủ |
| `e2e/dialog-keyboard.spec.ts` (188) | đọc đủ (đổi `asExe` sang dùng chung) |
| `e2e/appointments.spec.ts` | đọc diff + đầu file + hai helper mới (:817, :835) + test AI (:848–897) |
| `e2e/customer-kyc.spec.ts`, `e2e/appointment-outcome.spec.ts` | đọc diff (đổi kỳ vọng chữ) |
| `.github/workflows/ci.yml` (140), `.dependency-cruiser.cjs` (72), `vitest.config.ts` (70) | đọc đủ |
| `packages/ai/CLAUDE.md` (52) | đọc đủ (khối codemap của gói mới) |

Đọc chéo để chấm đúng (gói A/C, chỉ phần script tựa vào):
`packages/ai/src/run.ts` (394), `validator.ts` (228), `errors.ts` (46), `prompts/retry.ts` (51), `schema.ts` (159), `settings.ts` (86), `models.ts` (35); `packages/domain/src/kyc-fact.ts` (57);
`apps/desktop/src/data/ai-tauri.ts` (75); `apps/desktop/src-tauri/src/ai.rs` (các đoạn :163–352, :444–452, :544–546);
`docs/design/phase-5-ai.md` (430), `docs/design/phase-5-prompts.md` (345), `docs/golden/ai-eval.md` (119), `docs/decisions/0009-ai-copilot-provider-va-guardrail.md` (82), `docs/metrics/ai-eval-2026-10-10.md` (4 530 dòng; đọc 1–1448 + cuối 4396–4530 + grep), `CONTEXT.md`, `playwright.config.ts`, `e2e/serve.mjs`, `.gitignore`, `package.json` gốc, `CLAUDE.md` gốc (mục Lệnh/Quy ước).
Ngoài repo: `common\plan.md`, `common\baseline.md`, `common\known.md`.

## 2. Nhật ký kiểm chứng (nguồn cho các mục CONFIRMED)

1. `git rev-parse HEAD` → `0df3606fb783cc89b1b9c413c02810340e273a4f`; `git status --short` → `?? opencode.json`.
2. `pnpm vitest run tools/eval-ai-core.test.mjs tools/pr-core.test.mjs` → **2 file / 90 test xanh** (774 ms).
3. `pnpm lint:deps` → `✔ no dependency violations found (297 modules, 1156 dependencies cruised)`.
4. `pnpm codemap:check` → `Export maps are up to date.`
5. Mutation ngoài repo (`deepseek\E\mirror`, 8 phép phá `eval-ai-core.mjs`, chạy `node deepseek\E\mutate.mjs`): **8/8 làm test đỏ**, đúng ca mong đợi:
   - M1 bỏ kiểm `OPENCODE_PLAN` → đỏ `refuses any other plan`, `never puts the key in an error`, `stops before any call without a key or with a wrong plan`;
   - M2 thôi che key trong `serverMessage` → đỏ 2 ca che key;
   - M3 bỏ ánh xạ 402 → đỏ `maps HTTP statuses as Rust does…`;
   - M4 `gradeNote` bỏ cột "Không được có" → đỏ `fails on a forbidden fact`;
   - M5 bỏ cổng `exists` → đỏ `never overwrites a result file, before any call`;
   - M6 A1 đếm cả ERROR/REJECTED → đỏ `shows errors, rejections, missing blocks…`;
   - M7 timeout → AI_NETWORK → đỏ ca timeout;
   - M8 `missingBlocks` luôn rỗng → đỏ ca A3.
6. E2E AI thật (`CI=1`, Edge, `pnpm e2e`): `customer-ai.spec.ts` + `customer-ai-web.spec.ts` + `settings-ai.spec.ts` → **19 passed (38,1 s), 0 flaky** (`test-results/e2e.json`: `"expected":19, "flaky":0, "unexpected":0`). Lô thứ hai (`dialog-keyboard` + `customer-kyc` + `appointment-outcome` + `appointments -g "read-only|…"`) → 19 passed (32,6 s), `0 flaky`.
7. Thử "phá app khi phục vụ" (schema `deepseek\E\server-break.mjs` + `pw.break.config.mjs`, chạy bản build web thật với `navigator.clipboard.writeText` luôn lỗi) → `customer-ai-web.spec.ts` **3/5 test đỏ** ngay (`:67`, `:105`, `:200`); 2 test còn lại không đi qua đường copy-thành-công nên xanh hợp lý → spec bám hành vi thật, không giả xanh.
8. Probe ngoài repo (mirror + `vitest.mirror.config.mjs`, `--disable-console-intercept`), xem chi tiết ở phụ lục:
   - `probe-grade.test.mjs`: `V7 kept: [{"field":"childrenCount","value":2,"quote":"Hai vợ chồng  có   2 con"}] dropped: []` và `gradeNote: {"missing":["`childrenCount` — \"có 2 con\" = 2"],"forbidden":[],"pass":false}`; ca NFD tương tự (`residence`, quote NFD, V7 giữ, `gradeNote` báo thiếu).
   - `probe-config.test.mjs`: `readConfig(glm-5.3) = {"model":"glm-5.3","reasoning":"HIGH"}`; hai `evalMain` chồng nhau: `sau lần 1: codes = 0 0 | còn LOW trong file: false | số file: 1` (lần ghi sau đè lần trước).
   - `probe-302.test.mjs`: `302 → AiError AI_NETWORK "AI_NETWORK"`.
9. Probe ranh giới dependency-cruiser (schema ngoài repo `deepseek\E\boundary-probe\`, chạy `depcruise --config .dependency-cruiser.cjs packages` từ đó) → đúng 3 vi phạm mong đợi:
   `db-only-on-domain-and-ai-schema: packages/db/src/bad-to-ai.ts → packages/ai/src/run.ts`;
   `ai-schema-standalone: packages/ai/src/schema.ts → packages/ai/src/helper.ts`;
   `ai-only-on-domain-and-zod: packages/ai/src/bad-to-db.ts → packages/db/src/thing.ts` — và `db → ai/src/schema.ts` không bị báo → các rule mới có hiệu lực thật, không phải rule rỗng.

## 3. Phát hiện

### DS-E1

- **ID**: DS-E1
- **Mức**: Low
- **Trục**: C
- **Vị trí**: `tools/eval-ai-core.mjs:226` (0df3606); luật đối chiếu của app ở `packages/ai/src/validator.ts:121,146`
- **Tình trạng**: CONFIRMED (probe ngoài repo, mục 8 phụ lục)
- **Mô tả**: `gradeNote` so từ khóa của dòng "Phải có" trên `fact.quote` **thô** (`keywords.some((word) => fact.quote.toLowerCase().includes(word.toLowerCase()))`), trong khi V7 (`filterExtraction`) chấp nhận quote là chuỗi con của ghi chú **sau khi gộp khoảng trắng chạy và chuẩn hóa NFC**. Một đề xuất mà V7 đã giữ vẫn bị script chấm "thiếu" nếu quote khác ghi chú ở dạng NFD hoặc ở chỗ chạy khoảng trắng.
- **Tái hiện / bằng chứng**: probe `mirror/tools/probe-grade.test.mjs`:
  `pnpm vitest run --config deepseek\E\vitest.mirror.config.mjs --disable-console-intercept probe-grade` →
  `V7 kept: [{"field":"childrenCount","value":2,"quote":"Hai vợ chồng  có   2 con"}] dropped: []` ·
  `gradeNote: {"missing":["`childrenCount` — \"có 2 con\" = 2"],"forbidden":[],"pass":false}`;
  ca NFD: `V7 kept: [{"field":"residence","value":"Đà Nẵng","quote":"sống ở Đà Nẵng" (NFD)}]` + `gradeNote.missing` = `residence` — "Đà Nẵng".
- **Ảnh hưởng**: lần chạy eval thật (tốn tiền) có thể ghi một ghi chú X là TRƯỢT oan khi câu trả lời đúng nhưng khác dạng Unicode/khoảng trắng; Owner dựa vào X ≥ 4/5 để đánh giá "AI trích xuất".
- **Đề xuất**: trong `gradeNote`, so từ khóa trên bản đã chuẩn hóa giống validator (NFC + gộp khoảng trắng, chữ thường cho cả hai phía), thêm 1 ca test với quote NFD/khoảng trắng chạy. Cỡ ≈ 10 dòng SP.

### DS-E2

- **ID**: DS-E2
- **Mức**: Low
- **Trục**: B
- **Vị trí**: `e2e/appointments.spec.ts:817` (`customerForAi`), `:835` (`kycNote`); bản dùng chung đã có ở `e2e/support.ts:142` (`createKycCustomer`), `:156` (`addKycNote`)
- **Tình trạng**: CONFIRMED (so trực tiếp hai đoạn; các spec khác đều import `./support`)
- **Mô tả**: test AI mới ở chi tiết lịch hẹn định nghĩa lại hai helper gần như y hệt helper đã được tách vào `e2e/support.ts` **trong cùng phase** (chỉ thiếu tham số `conflict`), thay vì import như `customer-ai.spec.ts:2`, `customer-ai-web.spec.ts:2`, `settings-ai.spec.ts:3`.
- **Tái hiện / bằng chứng**: `e2e/appointments.spec.ts:1` chỉ import `@playwright/test`; `Select-String` cho `async function customerForAi`/`async function kycNote` (:817, :835) và `createKycCustomer`/`addKycNote` (support.ts:142, :156); nội dung hai bên trùng từng dòng thao tác (mở hộp, điền, `selectOption({ index: 1 })`, `Lưu KH`, `'Ghi chú KYC · …'`, `fill('Gặp KH')`, `Thêm dữ kiện`, `Lưu ghi chú`).
- **Ảnh hưởng**: hai bản sao phải sửa cùng lúc khi UI "Khách hàng mới" / "Ghi chú KYC" đổi; dễ lệch hành vi giữa các spec.
- **Đề xuất**: `import { addKycNote, createKycCustomer } from './support'`, giữ `customerForAi` như một hàm mỏng gọi hai helper chung rồi bỏ `kycNote` cục bộ. Cỡ ≈ 25 dòng xoá.

### DS-E3

- **ID**: DS-E3
- **Mức**: Low
- **Trục**: C
- **Vị trí**: `tools/eval-ai-core.mjs:56` (+ `:65–73` chỉ kiểm id model); hành vi app ở `packages/ai/src/models.ts:27` và `packages/ai/src/settings.ts:82`
- **Tình trạng**: CONFIRMED (probe ngoài repo)
- **Mô tả**: `readConfig` mặc định `reasoning = HIGH` cho **mọi** model và không kiểm cờ `reasoningEffort`; chạy `pnpm eval:ai --model glm-5.3` sẽ **vẫn gửi** `reasoning_effort: "high"`, dù app coi `glm-5.3` không nhận tham số này (Settings ép `DEFAULT`, `settings.ts:82`) — trái chú thích đầu file "the app's own flow" / "as the app would". Model không nhận tham số mà vẫn bị gửi có thể trả lỗi và đốt token cho một cấu hình app không thể tạo ra.
- **Tái hiện / bằng chứng**: probe `mirror/tools/probe-config.test.mjs`: `readConfig(glm-5.3) = {"model":"glm-5.3","reasoning":"HIGH"}` (test khẳng định `reasoning === 'HIGH'`).
- **Ảnh hưởng**: Owner chạy thêm model khác bằng `--model` (golden §1 cho phép) có thể nhận kết quả không so sánh được với hành vi thật, hoặc cả hồ sơ ERROR vì tham số lạ — tốn tiền.
- **Đề xuất**: trong `readConfig`, khi `AI_MODELS` có model ứng với `reasoningEffort === false` mà `reasoning ≠ DEFAULT` → hoặc ép `DEFAULT` như `readAiSettings` + cảnh báo, hoặc từ chối kèm thông báo; nếu giữ chủ ý "thử model có nhận tham số" thì ghi rõ trong doc comment + thông báo lúc chạy. Cỡ ≈ 5–10 dòng SP + 1 test.

### DS-E4

- **ID**: DS-E4
- **Mức**: Low
- **Trục**: D
- **Vị trí**: `tools/eval-ai-core.mjs:565–567` (cổng `exists`) và `:576` (`writeFile`)
- **Tình trạng**: CONFIRMED (probe ngoài repo)
- **Mô tả**: cổng "không ghi đè kết quả cũ" là kiểm–rồi–ghi không nguyên tử (TOCTOU). Một lần chạy kéo dài ~10 phút; nếu Owner mở lần chạy thứ hai khi lần đầu đang chờ mạng, cả hai đều qua cổng (file chưa tồn tại) và cùng ghi vào **một** đường dẫn; lần ghi sau đè kết quả lần trước, không cảnh báo — mất kết quả đo và tốn gấp đôi token.
- **Tái hiện / bằng chứng**: probe `mirror/tools/probe-config.test.mjs` (fs bằng `Map`; treo lời gọi đầu của lần 1, cho lần 2 chạy xong với `--reasoning LOW`): `sau lần 1: codes = 0 0 | còn LOW trong file: false | số file: 1` — hai lần đều trả 0, nội dung `LOW` của lần 2 bị lần 1 ghi đè, vẫn chỉ 1 file.
- **Ảnh hưởng**: mất kết quả một lần chạy tốn tiền khi hai lần chồng nhau.
- **Đề xuất**: ghi bằng cờ tạo mới độc quyền (`writeFile` với `flag: 'wx'` / `fs.open(path,'wx')`); nếu đã tồn tại thì in báo cáo ra stdout như nhánh `writeFile` lỗi hiện có (không im lặng mất). Cỡ ≈ 5–10 dòng SP + 1 test.

### DS-E5

- **ID**: DS-E5
- **Mức**: Nit
- **Trục**: S
- **Vị trí**: `tools/eval-ai-core.mjs:151` (đọc hết body) so với `:96` (ngưỡng 2 MB kiểm sau khi đã đọc); đối chiếu `apps/desktop/src-tauri/src/ai.rs:345–350`
- **Tình trạng**: CONFIRMED (đọc code hai bên)
- **Mô tả**: adapter eval đọc **toàn bộ** body vào bộ nhớ (`await response.text()`) rồi mới cắt theo 2 MB, còn `ai_complete` giới hạn ngay khi đọc (`.limit(MAX_BODY)`). Mã lỗi cuối cùng vẫn giống nhau (`AI_BAD_RESPONSE`), chỉ khác mức tiêu thụ bộ nhớ / đường truyền nếu server trả body rất lớn.
- **Tái hiện / bằng chứng**: đọc `eval-ai-core.mjs:95–96,150–151` và `ai.rs:317–352`; ca `> 2 MB` đã có test (`eval-ai-core.test.mjs:253–259`).
- **Ảnh hưởng**: chỉ ở tình huống bất thường (server trả body khổng lồ) — script chạy trên máy Owner, không ảnh hưởng app.
- **Đề xuất**: đọc theo luồng và dừng ở 2 MB (hoặc ghi rõ khác biệt trong doc comment). Cỡ ≈ 5–10 dòng, không bắt buộc.

### DS-E6

- **ID**: DS-E6
- **Mức**: Nit
- **Trục**: T
- **Vị trí**: `tools/eval-ai-core.test.mjs:56–71` (ca "… of the doc (A2)"); cột "Chế độ"/"Hạng mục thiếu" của `docs/golden/ai-eval.md` §3 (E01–E10)
- **Tình trạng**: CONFIRMED (đọc ca kiểm + chạy)
- **Mô tả**: ca kiểm so `input.mode`, `missingCategories`, `conflictWarnings` với **fixture** (`profile.mode` / `profile.missing` / `profile.warnings`) chứ không đọc file golden cho ba cột này; doc chỉ được so tự động ở phần facts E11–E20 (`§4.1`, `:84–94`), ghi chú X và **số** dữ kiện E01–E10 (`[4,10,…]`). Một lần chép fixture sai nhưng tự nhất quán (sửa cả facts lẫn mode/missing) ở E01–E10 sẽ không có ca nào bắt; tên ca "of the doc" hơi quá lời so với việc nó kiểm (gate ↔ fixture).
- **Tái hiện / bằng chứng**: đọc `eval-ai-core.test.mjs:56–71` (không tham chiếu `DOC`), so với `:73–94` (có `DOC`) và `:96–100` (có `DOC`).
- **Ảnh hưởng**: thấp — fixture do Owner duyệt G2 và mọi lệch gate sẽ đỏ; đây là lỗ hổng kiểm chứng nhỏ, không phải lỗi hành vi.
- **Đề xuất**: đọc bảng §3 của doc (hoặc đổi tên ca cho khớp nội dung). Cỡ ≈ 20–30 dòng test.

### DS-E7

- **ID**: DS-E7
- **Mức**: Nit
- **Trục**: C
- **Vị trí**: `tools/eval-ai-core.mjs:140` (`redirect: 'error'`) so với `apps/desktop/src-tauri/src/ai.rs:330` (`max_redirects(0)`) + `ai.rs:204–210`
- **Tình trạng**: CONFIRMED (probe bằng server local trả 302)
- **Mô tả**: gặp 3xx, Node fetch với `redirect: 'error'` **ném** (eval ghi `AI_NETWORK`), còn Rust không theo redirect nhưng **nhận status 3xx** rồi ánh xạ `AI_HTTP`. Trường hợp hiếm (URL cố định), nhưng mã lỗi ghi vào kết quả eval sẽ khác app.
- **Tái hiện / bằng chứng**: `probe-302.test.mjs` (server local `127.0.0.1` trả 302): `302 → AiError AI_NETWORK "AI_NETWORK"`.
- **Ảnh hưởng**: chỉ thông tin chẩn đoán trong file metrics; không mất dữ liệu, không gọi sai.
- **Đề xuất**: bỏ `redirect: 'error'` và để `redirect: 'manual'` (đọc status 3xx → `AI_HTTP` như Rust), hoặc ghi chú khác biệt. Cỡ ≈ 2–5 dòng.

## 4. Bảng đếm mức × trục

| Mức \ Trục | E | G | C | D | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | | **0** |
| High | | | | | | | | | | **0** |
| Medium | | | | | | | | | | **0** |
| Low | | | 2 | 1 | | | 1 | | | **4** |
| Nit | | | 1 | | 1 | | | 1 | | **3** |
| **Tổng** | **0** | **0** | **3** | **1** | **1** | **0** | **1** | **1** | **0** | **7** |

(Không có phát hiện Critical/High/Medium. Không có mục nào trùng `known.md` — các mục #474 trong known.md đã được đối chiếu lại, xem §5, không có bằng chứng mới nên không nêu thành phát hiện.)

## 5. Đã xét, không thấy

- **E — Edge case**: đã xét và không thấy vấn đề mới ngoài DS-E1/E4/E5/E7.
  - `readConfig` với argv thiếu giá trị / lạ / lặp, plan lạ (`GO `, `credit`), model lạ, key rỗng hoặc có khoảng trắng: `eval-ai-core.mjs:47–75` + các ca `readConfig` trong test (chạy xanh); không rò key vào thông báo lỗi (test "never puts the key in an error", mutation M1/M2 đỏ đúng chỗ).
  - Rỗng / một phần tử: X03 (0 đề xuất) chạy thật trong eval (`docs/metrics/ai-eval-2026-10-10.md:4503–4509`) và trong e2e `customer-ai.spec.ts:293–301`; `missingBlocks` chịu được output không phải object (`eval-ai-core.mjs:170–177`).
  - Ngày nửa đêm: `day` tính một lần ở `tools/eval-ai.mjs:46` và dùng cho cả tên file lẫn báo cáo (`eval-ai-core.mjs:564,487`) → chạy vắt 00:00 vẫn một ngày; ngày phân tích của bộ eval cố định `2026-10-01` (`fixtures/ai-eval.mjs:10`).
  - Hủy/timeout giữa chừng: script eval không có nút Hủy (không áp dụng); adapter có trần 120 s qua `AbortSignal.timeout` (`:141`), ca timeout/Ctrl+C giữa chừng không ghi đè file (cổng `exists` chạy trước mọi lời gọi mạng).
  - Tải lại webview / thay DB khi AI đang chạy: e2e phủ bằng `customer-ai.spec.ts:179–213` (rời màn rồi quay lại, Hủy) và `:345–386` (khóa mọi nút AI, Hủy, lỗi) — chạy xanh trong phiên này.
  - Unicode: phần NFD/khoảng trắng của `gradeNote` đã thành DS-E1; zero-width trong quote sẽ bị V7 bỏ (không phải lỗi của eval); chuỗi báo cáo có `plain()`/`cell()`/`fenced()` che `<`, `|`, fence (trừ các dòng `detail` — đã có trong known.md `#474`, không thêm bằng chứng).
- **G — Guardrail AI**: đã xét, không thấy vấn đề thuộc gói E. Tools/e2e không cài lại luật V1–V7 mà dùng chính `validateOutput`/`filterExtraction` của `packages/ai` (eval chấm trên `kept` sau V7 — `eval-ai-core.mjs:338–348`; báo cáo ghi riêng số V7 bỏ — bảng X ở `formatReport`); không có chỗ nào nới danh sách chặn hay bỏ qua cổng: `takeAnalysisInput` chặn trước khi gọi (`:274–280`), ca hồ sơ bị cổng chặn có test riêng (`eval-ai-core.test.mjs:446–464`). Bộ đếm V1-thiếu-khối tách riêng khớp yêu cầu #413 (`missingBlocks`, test + mutation M8).
- **P — Hiệu năng**: có số đo, không thấy vấn đề: tools unit 90 test / 774 ms; e2e AI 19 test / 38,1 s (12 workers, CI=1) + lô 19 test / 32,6 s; 0 flaky cả hai lô; script eval là I/O tuần tự theo thiết kế (một hồ sơ một lần), không có đường nào lặp vô hạn (bước lặp bị `MAX_ATTEMPTS = 2` chặn — `retry.ts:23`).
- **T — Chất lượng test**: đã xét: mutation 8/8 đỏ (mục 2.5); "phá app khi phục vụ" 3/5 spec đỏ (mục 2.7); test không phụ thuộc đồng hồ thật (clock tiêm — `eval-ai-core.test.mjs:29–32`) hay mạng (mock fetch/serve local); test fixture đối chiếu doc cho facts E11–E20 và ghi chú X; các ca KNOWN `#474` (`issueLines` không `plain`, `recording` bỏ lời gọi lỗi, tên prompt cứng `:490`, hook `resolve` bỏ `.ext`, `noteDetails` dùng `EVAL_NOTES` toàn cục) đã đối chiếu lại trong code nhưng **không có bằng chứng mới** nên không nêu lại; ghi chú nhỏ về cột doc ↔ fixture ở DS-E6.
- **A — Trợ năng / i18n**: đã xét, không thấy vấn đề trong phạm vi E: e2e mới dùng selector theo vai trò/ARIA (`getByRole`, `aria-current` ở `customer-ai.spec.ts:130,141,157`, `role=status`/`role=alert` cho trạng thái chạy/lỗi) — phù hợp lưới trợ năng; tools/eval là công cụ nội bộ in tiếng Việt cho Owner, không có chuỗi UI sản phẩm nào trong gói E để i18n.
- **C — Đúng hợp đồng (phần còn lại)**: đối chiếu hai URL trong eval với Rust (`PLAN_URLS` ↔ `ai.rs:13–14`), header (`x-opencode-session`, `User-Agent Project-2C/<version>` ↔ `ai.rs:34,178–183`; bản desktop `0.1.0` = bản Cargo `0.1.0`), body `{model,messages,max_tokens,reasoning_effort?}` viết thường (`eval-ai-core.mjs:129–134` ↔ `ai.rs:165–175`) — khớp; các lệch nhỏ đã nêu ở DS-E3/E5/E7.
- **B — Bloat (phần còn lại)**: export của `eval-ai-core.mjs` đều được dùng (test và/hoặc `eval-ai.mjs`); `CODEMAP_PACKAGES` dùng ở `codemap.mjs` + test; không thấy nhánh chết mới trong tools/codemap; riêng trùng lặp ở DS-E2.
- **D — Dữ liệu (phần còn lại)**: eval chỉ ghi `docs/metrics/…` sau cổng `exists`; không có test nào ghi file thật (writeFile tiêm); e2e dùng backup thật để nhập cấu hình AI (`settings-ai.spec.ts:49–94`) chạy xanh.

## 6. Phụ lục — nguồn test tạm (ngoài repo)

Tất cả trong `C:\workspace\deep-review-5\deepseek\E\`; repo không bị sửa (`git diff --stat` rỗng):

- `mirror\` — bản chép (ngoài repo): `packages/ai/src/**` (nguyên trạng), `packages/domain/src/**` (nguyên trạng), `tools/eval-ai-core.mjs` (được `mutate.mjs` ghi lại bản gốc sau mỗi phép phá; kiểm lại bằng `pnpm vitest run --config …` xanh trước khi kết thúc), `tools/eval-ai-core.test.mjs`, `tools/fixtures/ai-eval.mjs`, `docs/golden/ai-eval.md`, và các probe:
  - `tools/probe-grade.test.mjs` — lệch `gradeNote` ↔ V7 (DS-E1).
  - `tools/probe-config.test.mjs` — `readConfig(glm-5.3)` + hai `evalMain` chồng nhau (DS-E3, DS-E4).
  - `tools/probe-302.test.mjs` — 3xx → `AI_NETWORK` (DS-E7).
- `vitest.mirror.config.mjs` — config vitest cho mirror (root = mirror; alias `@p2c/domain`, `zod`).
- `mutate.mjs` — 8 phép phá `eval-ai-core.mjs` (biên bản ở mục 2.5).
- `boundary-probe\` — cây giả `packages/ai|db/src/*` chạy bằng chính `.dependency-cruiser.cjs` của repo (mục 2.9).
- `server-break.mjs`, `pw.break.config.mjs` — server phục vụ `apps/desktop/dist` đã build với clipboard luôn lỗi + config Playwright tạm (mục 2.7).

Lệnh đã chạy trong repo (chỉ đọc / chỉ sinh output bị ignore): `git rev-parse HEAD`, `git status --short`, `git diff --stat`, `pnpm vitest run …`, `pnpm lint:deps`, `pnpm codemap:check`, `pnpm e2e …` (ghi `dist/`, `test-results/` — đều bị `.gitignore`), `pnpm exec playwright test --config …` (server tạm ngoài repo), và các `node` script ngoài repo ở trên.

## 7. git status

- Đầu phiên: `?? opencode.json`.
- Cuối phiên: `?? opencode.json` (không đổi; `git diff --stat` rỗng).

---

_Xong gói E. Không tổng hợp, không so với bên khác, không tạo Issue._
