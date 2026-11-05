XONG — deepseek gói F lượt 5, 12:40 05/11/2026

# DeepSeek — gói F (Xuyên gói, bloat / hiệu năng, công cụ), lượt 5

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | `deepseek` (ID phát hiện `DSR5`) |
| Gói | **F** — Xuyên gói, bloat / hiệu năng, công cụ (`tools/**`, `e2e/**`, `.github/**`, `.githooks/**`, `.claude/**`, `packages/ui/scripts/`, `apps/desktop/vite.config.ts`, file gốc repo; luồng xuyên gói; toàn codebase cho bloat và hiệu năng) |
| SHA đầu phiên | `37a80b662861d308a110d1e2b0f65ad13b91fb51` (`37a80b6`) — `git rev-parse HEAD` khớp ✅ |
| `git status --short` đầu phiên | rỗng ✅ |
| Giờ bắt đầu | 12:24 05/11/2026 (+07:00) |
| App | WorkBuddy **v5.9.4** (theo `common\baseline.md`); model phiên `DeepSeek-V4.1-Flash`, reasoning **Max**, context **1M** (Owner ghi từ giao diện, `baseline.md`) |
| Expert | **CodeReviewExpert** (khối expert của ngữ cảnh phiên); model của expert: ngữ cảnh phiên không nêu |
| Công cụ | công cụ app (Read / Write / Edit / Glob / Grep / Bash / PowerShell), Code review expert; **không** dùng agent phụ, không skill, không connector, không mạng |
| Mức suy luận | Max |
| Node | `C:\Program Files\nodejs\node.exe` → **v24.20.0** ✅ (≥ 24); mọi lệnh `node` / vitest / Playwright / depcruise đặt `C:\Program Files\nodejs` lên đầu PATH trong chính lệnh đó |
| Chế độ quyền | Default |

Bước 0: `{GÓI}` = F, đúng một chữ trong A…F ✅. `deepseek\F.md` chưa có → làm mới ✅. Báo cáo A–E đều có, dòng đầu đều `XONG` (A 10:38, B 10:29, C 10:56, D 11:14, E 12:21) ✅.

## 2. Bảng R

### 2.1 Bảng R1 gộp — đủ 25 dòng (`known.md` phần 4)

Cột "Bằng chứng" của dòng do gói khác chấm ghi phép thử đã giết dòng đó ở gói ấy; báo cáo gói đó có lệnh và output đầy đủ. Dòng của F in đậm ở cột Kết luận là phần F tự chấm.

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-135 | #896 → #907 | **ĐÃ SỬA** (A) | A: xóa / sửa / hủy cuộc gặp cùng ngày → `STAGE_KEPT_BY_MEETING {05/01/2026}`; gỡ `date >= ?` → `date > ?` (`customers.ts:445`): 1 test đỏ | Khôi phục và nhập backup cùng ngày đúng luật; biến thể dời ngày hai phía không khóa oan |
| DR6-136 | #896 → #907 | **ĐÃ SỬA** (A; **F đo lại**) | **F:** `probe-byname.mjs`, dữ liệu tải, 10 255 lịch / 1 269 tên phân biệt: `byName` **11,4 / 11,3 ms** (trung vị 2 lần chạy, min 11,1, max 12,3); bản `2e51e25` dựng lại trong probe **64,4 / 64,5 ms**; **cùng thứ tự** (`sameOrder = true`). A đo 11,4 ms và bản cũ 64,0 ms, khớp | So lượt 4 (65,2 ms): −83 %. So trước #828 (9,4 ms): +2 ms (+21 %) nhưng **dưới luật nhiễu** (phải quá 10 ms) và dưới ngưỡng 200 ms ⇒ không phải hồi quy hiệu năng |
| DR6-137 | #896 → #907 (+ #933 → #946) | **ĐÃ SỬA** (A, C) | A: gỡ luật U+FEFF trong `readsBackAsIs` → 4 test đỏ; ma trận 38 cột chữ × 5 đột biến: NUL / surrogate / FEFF đầu bị từ chối ở mọi cột. C: `isLabel` 6 dạng, gỡ sửa → 8 test đỏ | Không cột nào lệnh ghi được mà bước nạp từ chối (vòng xuất → nhập với FEFF giữa/cuối) |
| DR6-138 | #897 → #915 | **ĐÃ SỬA** (B) | B: 8 đột biến CSP / `identifier` / `backup_names` / `disk_full`, cả 8 bị giết; Rust `storage::` 77/77 | Ca CSP so đủ 8 chỉ thị đã sắp nên cả chỉ thị mới lẫn chỉ thị bị nới đều đỏ |
| DR6-139 | #898 → #911 | **ĐÃ SỬA** (B) | B: trả `flush()` về `await idle()` → 2 test đỏ, một ca đỏ đúng kiểu lỗi cũ (file lúc đóng là dữ liệu cũ) | Biến thể `while (running) await running` cũng 2 đỏ |
| DR6-140 | #898 → #911 (+ #933 → #946) | **ĐÃ SỬA** (B) | B: bỏ `try` trong `notify()` → 3 test đỏ | T-332 gom vòng gọi listener của ba store về `notify`; listener gỡ chính mình vẫn đúng |
| DR6-141 | #899 → #917 (+ #930 → #937, #931 → #939, #950 → #956, #960 → #963) | **ĐÃ SỬA** (C) | C: 18/18 câu CLR4-C1 nay ra ∅; 50 ví dụ spec §10 khớp; gỡ cổng "câu kể đơn" → 127 test đỏ | Biến thể mới (góa + con đã mất, ly thân, con nuôi) không ra giá trị trái nghĩa |
| DR6-142 | #900 → #909, #913 (+ #930 → #937) | **ĐÃ SỬA** (C) | C: NUL ở 6 dạng đều bị V3–V6 chặn; gỡ `replaceAll('\0','')` → 16 test đỏ | Chỉ đổi bản so khớp, không đổi chữ lưu (K25) |
| DR6-143 | #900 → #909, #913 (+ #930 → #937) | **ĐÃ SỬA** (C) | C: "Môi / ranh / biên / thế giới Luật …" → V6; "giới luật Phật giáo" → 0; gỡ `unlessAfter` → 9 test đỏ | — |
| DR6-144 | #899 → #917 (+ #933 → #946) | **ĐÃ SỬA** (C) | C: `kept` sau `generation` 0 → 1 trả `undefined`; gỡ kiểm generation → 3 test đỏ | Đường cũ (mở lại hồ sơ sau Nhập backup vẫn thấy lỗi cũ) không còn |
| DR6-145 | #901 → #920 (+ #934 → #965, #969 → #971, #973 → #975) | **SỬA MỘT PHẦN** (D) | D: (a) `: ` của thẻ Dữ kiện KYC xong (DR6-37); (b) bộ chặn bắt thêm `.join(', ')`, `}, {`… (gỡ sửa → 2 và 3 ca đỏ); (c) cắt comment đúng. **Còn hở:** `←` `–` `…` ngoặc kép cong và `: ` giữa chữ JSX | Phần còn lại là **DSR5-D1** (Low) — ghi ở bảng này, không ghi lại thành phát hiện riêng |
| DR6-146 | #902 → #922 (a), #898 → #911 (b) | **ĐÃ SỬA** (D) | D: gỡ (a) `normalizeText(name)` ở 5c → ca e2e đỏ; gỡ (b) focus của Thử lại → ca e2e đỏ | — |
| DR6-147 | #898 → #911 | **ĐÃ SỬA** (D, B) | D: gỡ `subscribe` của `SaveWarning` → e2e đỏ; gỡ `askWhileFailed` → 2 unit đỏ. B: cùng hai ca, cả hai passed ở bản ghim | Đột biến M5 sống ở unit (không có unit test cho `SaveWarning`), chỉ e2e giết — đúng thiết kế |
| DR6-148 | #902 → #922 (+ #932 → #941, #951 → #958) | **ĐÃ SỬA** (D, E) | D: bỏ `relative` ở `th` → unit đỏ; bỏ `flex-wrap` ở thẻ team → e2e đỏ. E: bỏ `max-w-60` của `ReportTable` → ca Báo cáo đỏ | Tên TL dài ở hàng tiêu đề thẻ team: ACCEPTED (Owner 02/11), không báo lại |
| DR6-149 | #901 → #920 (+ #905 → #928, #935 → #948) | **ĐÃ SỬA** (D) | D: `Choices` khớp `.choice` ở 7 điểm; đặt lại class cũ → e2e `theme.spec.ts` đỏ | Unit chỉ kiểm `aria-required`; chốt chặn là e2e — đúng test chấp nhận của #901 |
| DR6-150 | #903 → #924 (+ #933 → #946, #951 → #958) | **ĐÃ SỬA** (E) | E: `readCaseSize` về `trim()` → 2 unit đỏ; `pending` của 6b về `trim()` → e2e đỏ | Còn hộp Hợp đồng chưa theo — **DSR5-E1** (Low) |
| DR6-151 | #903 → #924 (+ #933 → #946) | **ĐÃ SỬA** (E, A) | E: gỡ nhánh `coded` → 1 đỏ; gỡ vai trò + team → 2 đỏ; e2e `trash.spec.ts:637` xanh. A: ba KH trùng tên + nhóm → ba mã khác nhau | Hai nhân sự trùng cả tên, vai trò và team vẫn trùng tên nút — Q3 (a) không chốt duy nhất |
| DR6-152 | #903 → #924 | **ĐÃ SỬA** (E) | E: `PURGE_REMINDER` không `export`, `git grep` chỉ 3 dòng trong chính file | — |
| DR6-153 | #903 → #924 | **ĐÃ SỬA** (E) | E: đổi câu từ chối → `save-state.spec.ts:126` đỏ; giấu huy hiệu nhóm → `trash.spec.ts:197` đỏ | — |
| DR6-154 | #903 → #924 (+ #933 → #946, #951 → #958) | **ĐÃ SỬA** (E) | E: gỡ `useEffect` focus của `ConfirmButton` → ca **nộp bằng Enter** đỏ; hai ca bấm nút vẫn xanh | Đường Enter là đường làm focus rơi; chỉ ca 150 giết được đột biến |
| DR6-155 | #904 → #926 | **ĐÃ SỬA** (**F**) | **F, (a):** đột biến T83c `Read ${pr.files.length}` → `${paths.length}` (`pr-core.mjs:147`): `pr-core.test.mjs` **1 failed** — nhận "Read 2 of the 2 files…", đòi "Read 1 of the 2 files…" (ca `:555`, file đổi tên). **F, (b):** chạy `playwright.guide.config.ts` ở bản ghim: **13 passed (27,1 s)**, `git status` rỗng sau khi chụp lại 28 ảnh (ảnh trùng từng byte). Gỡ dòng `style:` của `shots.guide.ts` → **1 failed**: `Error: foot of the part in the shot` ở `04, 05 hồ sơ KH` (10 passed, 2 did not run) | Bản gỡ nửa `header { position: static }` (đột biến của CXR4-F2) cũng đỏ ở "top of the part in the shot" theo bảng thân PR; tôi chỉ chạy bản gỡ cả dòng. Ảnh đã chụp lại được trả nguyên byte (`git checkout -- docs/user-guide/img`), `git status` rỗng |
| DR6-156 | #904 → #926 (+ #934 → #965) | **ĐÃ SỬA** (**F**) | **F:** trả `covers` về bản cũ (tiền tố trước `*` đầu + đòi `**`) → `notes-core.test.mjs` **2 failed**, ca `:309` mất ghi chú thư mục `packages/ai/src/` cho đích `packages/*/src/schema.ts` (nhận `area: []`). Bản ghim: `notes-core` 31/31 xanh | T-333 (3) chấm riêng ở dòng R2 dưới |
| DR6-157 | #904 → #926 | **ĐÃ SỬA** (**F**) | **F:** trả `others` về "mọi file không phải JS/CSS" → `size-report-core.test.mjs` **1 failed**: `{files: 5, raw: 1107}` thay `{4, 107}`. **Đo thật:** `apps/desktop/dist` đang có `demo-2026-09-15.sqlite` 9 969 664 B (do `serve.mjs` ghi khi chạy bộ ảnh hướng dẫn) → `node tools/size-report.mjs` ra **"Tệp khác (19 file: wasm, font, ảnh…) | 1 022 121"**, đúng bằng mốc `baseline.md` | File `.sqlite` vẫn nằm trong `dist` (đúng, `serve.mjs` không đổi); chỉ số của công cụ là đúng |
| DR6-37 | #790 → #845, #901 → #920 | **ĐÃ SỬA** (D, E) | D: vị trí đầu tiên của lượt 1 (`CustomerKyc.tsx:95`) nay là khóa `kyc.factLine`; quét JSX của 67 file trong gói: 0 dấu viết thẳng; đặt lại `{t(…)}: {factText(…)}` → `check-tokens` đỏ. E: `check-tokens` trên gói E sạch | Lượt 4 sót vị trí này vì chấm theo danh sách Issue #790 — lượt 5 chấm theo mô tả DR6 ở tổng hợp lượt 4 §3.1 |
| CLR4-F2 | #905 → #928 (tài liệu) | **ĐÃ SỬA** (**F**, mục KNOWN sửa bằng tài liệu) | **F:** dòng ghi có ở `docs/testing/nghiem-thu-v1.md:343` (NT-EX-08, cột Ghi chú) và `:344` (NT-EX-09), đúng chữ "CLR4-F2", nêu đủ bốn ô tùy chọn + lịch đã xóa + "kể cả bản chính nó xuất sau khi nâng cấp tại chỗ" + câu 10b. **Khớp app** (`probe-clr4f2.mjs`, dữ liệu tải): `trigger_note` = U+200B, `note` = U+200B U+2060, `next_step` của lịch MET = U+200B → cả ba `BACKUP_INVALID`; bản v1.0 tự xuất rồi nhập lại → `OK`; hai câu 10b có nguyên văn ở `vi.ts:1146,1152` | Hành vi dưới dòng ghi vẫn là KNOWN K1 (dữ liệu giả lập thì nạp lại), không mở Issue |

Đếm: 23 DR6 lượt 4 + DR6-37 + CLR4-F2 = **25 dòng**; **24 ĐÃ SỬA**, **1 SỬA MỘT PHẦN** (DR6-145), 0 CHƯA SỬA, 0 HỒI QUY.

### 2.2 Bảng R2 gộp — đủ 28 dòng (`known.md` phần 5)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-329 | #930 → #937 | **ĐÃ SỬA** (C) | C: Mock của `b6d4388^` so bản sau trên 556 chuỗi → 0 khác; đột biến `namingTheKh` → 2 đỏ | Refactor không đổi hành vi, đúng yêu cầu §L5.4 |
| T-330 | #931 → #939 | **ĐÃ SỬA** (C) | C: 9 ca chấp nhận của Issue đúng; gỡ luật 3 → 9 test đỏ | 14 ca có sẵn đổi kết quả đúng bảng thân PR |
| T-331 | #932 → #941 | **ĐÃ SỬA** (D, E) | D: M3 (`relative` của `th`), M11 (`flex-wrap`), M14 (`items-baseline`) đều đỏ. E: cùng ba phép thử | M14 chỉ đỏ ở ca "team + IS 160 chữ", đúng phạm vi mục 3 |
| T-332 | #933 → #946 | **ĐÃ SỬA** (E, A, B, D, C) | E: `parseTime` về `trim` → 2 đỏ; A: `readsBackAsIs` bỏ FEFF → 4 đỏ; B: `notify` bỏ `try` → 3 đỏ, `AiJobs.changed` về vòng `for` trần → 1 đỏ; D: `customer.withCode` đổi chữ → 2 đỏ; C: 2 + 3 đỏ | Sáu mục của Issue chia đủ cho năm gói; mục 4 (chú thích e2e) thuộc F — chỉ là comment, đọc và khớp |
| T-333 | #934 → #965 | **ĐÃ SỬA** (D, **F**) | D: mục 1 (`{` sau `>` của kiểu generic) gỡ `types++` → 2 đỏ; mục 2 (CRLF) có ca ghim. **F, mục 3:** `globMeetsFolder` cho đoạn `**` lẫn chữ đi qua mọi thư mục → `notes-core.test.mjs` **1 failed**: `a/b**/c.ts` trả `[1, 2]` thay `[2]` | `a/b**x/c.ts` → chỉ `a/bx/`, `a/x**b/c.ts` → chỉ `a/x/`, `a/**/c.ts` → cả hai, đúng bảng test chấp nhận |
| T-334 | #935 → #948 | **ĐÃ SỬA** (tài liệu, **F**) | F: `docs/reviews/2026-10-31-…-tong-hop.md` có; `docs/metrics/phase-6.md` §7.3 nêu đơn vị code unit; mục "Ô chọn" của "Lệch mockup đã biết" có (`nghiem-thu-v1.md:166`); quyết định #917 / #920 có ở `PROJECT-STATE.md` | PR chỉ tài liệu, CI không chạy |
| T-335 | #942 → #944 | **ĐÃ SỬA** (**F**) | **F:** `auto-wait-core.test.mjs` 41 ca xanh; đột biến "ngủ trọn `everyMs`, bỏ hạn" → **1 failed** (`at` = `[0, 61000, 122000]` thay `[0, 61000, 92000]`); `auto-wait.mjs` chạy thật: `sleep --timeout 1` → `AUTO-WAIT sleep: 1 min passed`, exit 0; sai tham số → exit 64 (5 dạng); `gh` chưa đăng nhập → exit 3, **một dòng** `AUTO-WAIT ci #1: read failed: …` (lỗi nhiều dòng của `gh` bị gộp đúng) | Đột biến "bỏ đọc file cho quyết định docs-only" → 1 đỏ. Mục 2 (`update-branch`) và mục 5 (`.claude/rules`) là chữ của skill, đọc và khớp |
| T-336 | #950 → #956 | **ĐÃ SỬA** (C, **F**) | C: gỡ phép thử `\p{L}` của `carried` → 2 đỏ. **F:** `probe-deps.mjs` trên `.dependency-cruiser.cjs` — file sản phẩm import `vitest` → đỏ `ai-only-on-domain-and-zod`; `latest-support.ts` / `web-test-support.ts` (không khớp neo `/test-support`) → vẫn đỏ; sản phẩm import `./test-support` → đỏ `ai-test-support-only-in-tests`; file test import `./test-support` → xanh | `pnpm lint:deps` 354 module / 1 582 phụ thuộc, khớp `baseline.md` |
| T-337 | #951 → #958 | **ĐÃ SỬA** (E, D) | E: `parseTime` với `\u200B14:00` → `14:00`, gỡ `normalizeText` → đỏ; D: gỡ cặp `aria-disabled:` → `ui-button.test.tsx` đỏ | `git grep "aria-disabled:"` trong `apps/`: 0 |
| T-338 | #952 → #954 | **ĐÃ SỬA** (**F**) | **F:** đột biến bỏ vế `--since` trong `ciState` → **1 failed** (`done:true` "CI green" thay `done:false` "no workflow run since … yet"); đột biến giữ các khối app trong `reviewedPr` → **2 failed** (`946` thay `950`). Chạy `reviewedPr` trên **brief §3.2 thật** của skill (thay `<N>` = 946): `946`; thêm ghi chú `Linked sessions now` phía trước → vẫn `946`; báo cáo phiên con trong `<system-reminder>` → `null`; `[auto-issues]` không có dòng đúng → `null` | `ci.yml` có `types: [opened, synchronize, reopened]` nên run sau `reopen` có thật; mốc lấy `closedAt` (giờ GitHub) như skill §4 |
| T-339 | #960 → #963 | **ĐÃ SỬA** (C, **F**) | C: đưa mẫu bậc hai vào → 4/32 hàng thời gian đỏ; đo lại 4,4–6,0 ms cho 36 000 ký tự. **F:** `AI_TEST_FILES` neo `/test-support` — `probe-deps.mjs` xác nhận `latest-support.ts` / `web-test-support.ts` **không** được miễn (đỏ), `test-support.ts` được miễn | `pnpm lint:deps` xanh |
| T-340 | #961 → #967 | **ĐÃ SỬA** (tài liệu, **F**) | F: `SKILL.md:259` có câu "chạy lại `node tools/notes-for.mjs --diff`, cập nhật mục "Ghi chú OPEN liên quan"…" sau `push` của §3.8; `:273` ghi "chờ CI như dưới" (không còn "dòng cuối của danh sách này") | Hai chỗ sửa đúng như thân PR; `git diff` chỉ hai dòng |
| T-341 | #969 → #971 | **ĐÃ SỬA** (D) | D: thêm `source[i+1] !== '/'` → ca ghim **đỏ 1** — ca thật sự cắn | Hành vi không đổi, đúng chốt của Issue #969 |
| T-342 | #973 → #975 | **ĐÃ SỬA** (D, **F**) | D: `phase-6.md:336` câu phạm vi mới, 4 dòng bảng chính, gạch "Không xét" +2 PR, gạch tổng 23/112 khớp hai bảng; `token-guard.test.ts:177` có `<p>one<b>{a}, {b}</b></p>`. **F:** đếm lại hai bảng: 19 + 4 = 23 dòng bảng chính, 8 + 4 = 12 bảng phụ, 23/112 đúng | Không chạy `gh` để đếm lại số PR (prompt cấm `gh`); số PR #917 / #937 / #939 / #944 khớp `fixes.md` |
| T-343 | #977 → #978 | **ĐÃ SỬA** (ảnh, **F**) | **F:** chạy lại **toàn bộ** bộ chụp ở bản ghim: 13 passed (27,1 s), rồi `git status --short` **rỗng** — 28 ảnh đang commit trùng từng byte với bản chụp lại (đúng test chấp nhận "chạy hai lần liền: 28 ảnh trùng byte"). Cỡ: check project xanh (mỗi ảnh ≤ 150 KiB, tổng ≤ 4 MiB) | Ảnh khớp app ở `37a80b6`, không chỉ khớp bản chụp ở `3e3f5bc` |
| T-344 | #980 → #981 | **ĐÃ SỬA** (tài liệu, D) | D: `docs/user-guide/README.md:75` hàng "Chuyển nhóm" ghi `customer-forms.html` 5d–5e | — |
| T-345 | #983 → #984 | **ĐÃ SỬA** (**F**) | **F:** `metDays()` lùi bằng "Kỳ trước" tới tháng gần nhất có đủ `PERF_RUNS` ngày Đã gặp; kiểm tháng đang xem **trước** khi lùi (đọc tiêu đề, không bấm); dừng ngay khi hết 12 kỳ, câu lỗi nêu số ngày nhiều nhất + `MORE_MET`. Đọc đối chiếu `period-labels.ts` / `formatPeriodValue`: tiêu đề đúng dạng `Lịch tháng MM/YYYY` mà `metDays` dựng (`pad` hai chữ số) | Bản ghi của lần đo G7 (`phase-6.md:253`) in `Lịch tháng 10/2026, 1 back: 10 days met` — đúng chuỗi `metDays` in |
| T-346 | #986 → #988 | **ĐÃ SỬA** (**F**) | **F:** `metYear()` lùi tối đa `YEARS_BACK = 1`, đếm `metRows()` sau `oldestFirst()`; `checkPeriods()` kiểm **trước** vòng nhập backup và trả `MetYear` cho `appointments()` / `nextAppointment()`; `stepYears()` dùng "Kỳ trước" / "Kỳ sau", không "Hôm nay" (ghi lý do 9 ms) | `MORE_MET` đã sửa "steps 1, 3 and 4" (NIT của Issue) |
| T-347 | #990 → #992 | **ĐÃ SỬA** (**F**) | **F:** một `metRows()` dùng cho cả `metYear` lẫn `nextAppointment(…, 'year')`; `metDays()` kiểm tháng chứa hôm nay trước khi lùi; `toMetYear()` fail thay vì đo năm khác | Bản ghi G7: `Lịch năm 2026, 0 back: 79 met`, `Lịch tháng 10/2026, 1 back: 10 days met` — đúng hai chuỗi mới |
| T-348 | #994 → #995 | **ĐÃ SỬA** (tài liệu, **F**) | F: `docs/metrics/phase-6.md:243` mục "Số đo G7, NT-HN-01 (T-348, 03/11/2026)" có máy, code `233c77e`, cỡ + sha256 exe, dữ liệu tải (`tables` sha256, Nội dung sau nhập, `project2c.db`), cách đo 5 bước, kỳ Năm/Tháng probe đã dùng, bảng probe, mở lần đầu, mở lại, Dọn sạch, kích thước | Số trong mục khớp `baseline.md` ở các mốc so sánh được (exe 5 649 408 B, `project2c.db` 14 102 528 B, `tables` `e256e4f1…`) |
| T-349 | #997 → #999 | **ĐÃ SỬA** (tài liệu, **F**) | F: cột Ghi chú của NT-HN-01 (`nghiem-thu-v1.md:388`) **không còn số đo** (không "ms", "≤", "+… B"), chỉ kết quả bằng chữ + câu trỏ `phase-6.md`; dòng **Cách đo** của mục G7 ghi "như lượt 4, thêm bước 3 (mở lại 3 lần; lượt 4 không đo mở lại)" | Đúng hai mục của Issue |
| T-350 | #1001 → #1011 | **ĐÃ SỬA** (E, A) | E: 4 ca unit + e2e; đổi `statusLabel` về `t(appointmentStatus.…)` → 4 đỏ. A: `appointmentGroup` đột biến `'planned'` → 17 đỏ; lịch Dự kiến 20/09 → `unrecorded` | Nhãn khớp nghĩa thường ở 6a, danh sách, chi tiết, hộp xóa, hộp dời, Thùng rác, chỉ số |
| T-351 | #1002 → #1003 | **ĐÃ SỬA** (nghiệm thu, **F**) | F: `nghiem-thu-v1.md:39` dòng L2 ghi exe `1ce3c61` (artifact CI run 41666800294), dữ liệu, cách chạy, 6 dòng `L2 ✅` còn phần Owner | `git merge-base --is-ancestor 1ce3c61 3d237b0` → đúng: exe L2 có trước exe L3 |
| T-352 | #1004 → #1007 | **ĐÃ SỬA** (tài liệu, D; **F** phần bảng cổng KYC) | D: `nghiem-thu-v1.md:23` danh sách dòng cần lịch Chưa ghi kết quả có NT-LH-15 / NT-KH-09; `:29` chú giải `L1 ⚠️`; `:39` phạm vi L2; NT-AI-03 bỏ liên kết. **F:** bảng cổng KYC của hướng dẫn (`docs/user-guide/06-ai.md:29`) chỉ còn liên kết ở hàng `CONFLICT_RESOLUTION`, khớp `KycIntelligence` | — |
| T-353 | #1005 → #1009 | **ĐÃ SỬA** (E) | E: `parseQuickDate('29/02', …)` ba mốc đúng; hai dòng NT-LH-19 / 28 khớp app | — |
| T-354 | #1012 → #1014 | **ĐÃ SỬA** (nghiệm thu, **F**) | F: NT-TR-12 có trong danh sách dòng cần lịch Chưa ghi kết quả (`nghiem-thu-v1.md:23`); NT-AI-03 (`:205`) không còn "Xem ở Dữ kiện KYC →" trong Kết quả mong đợi, ghi chú nêu lý do (chỉ 2b có liên kết) | — |
| T-355 | #1017 → #1020 | **ĐÃ SỬA** (nghiệm thu, **F**) | F: `:40` dòng L3 ghi exe `3d237b0` (artifact CI run 41765637293), kèm "cũng là exe của `main` tới `331e7a0`". Kiểm: `git diff --stat 3d237b0 37a80b6` ngoài `docs/**` và `*.md` **rỗng**; 22 commit sau đó chỉ là docs | Khớp `baseline.md` mục "Code so với exe ứng viên L3" |
| T-356 | #1019 → #1023 | **ĐÃ SỬA** (tài liệu, D) | D: `01-bat-dau.md:8,10` mô tả mở lại màn dùng lần cuối + `localStorage` theo máy; e2e "reopening the app returns to the last screen" xanh | — |

Đếm: **28 dòng**, **28 ĐÃ SỬA** (16 có code/test, 12 chỉ tài liệu / ảnh / nghiệm thu), 0 SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY.

## 3. Phạm vi đã đọc

**Diff `2e51e25..37a80b6` của gói F** — 26 file (`git diff --numstat`), khớp `baseline.md` (SP +460 / −14 trong 7 file, test +1 597 / −30 trong 14 file):

- SP: `.dependency-cruiser.cjs` (+16 / −3), `tools/auto-wait-core.mjs` (+265), `tools/auto-wait.mjs` (+123), `tools/notes-core.mjs` (+18 / −3), `tools/pr-status.mjs` (+11 / −5), `tools/review-hint-core.mjs` (+21 / −2), `tools/size-report-core.mjs` (+6 / −1);
- test: `e2e/{appointment-outcome,customer-forms,dialog-keyboard,long-names,save-state,theme,trash}.spec.ts`, `e2e/guide/shots.guide.ts` (+36 / −2), `e2e/perf/probe.perf.ts` (+156 / −22), `tools/{auto-wait-core,notes-core,pr-core,review-hint-core,size-report-core}.test.mjs`;
- tài liệu: `.claude/skills/auto-issues/SKILL.md` (+344), `.claude/skills/review-pr/SKILL.md` (+5), `.claude/skills/README.md` (+2 / −2), `CLAUDE.md` (+4 / −3), `e2e/perf/README.md` (+9 / −3).

**Đọc trọn ở `37a80b6`:** `tools/auto-wait-core.mjs` (265), `tools/auto-wait.mjs` (123), `tools/review-hint-core.mjs` (60), `tools/notes-core.mjs` (vùng `covers` / `globMeetsFolder` / `globRegExp`), `tools/size-report-core.mjs` (vùng `bundleReport`, `parseSizeArgs`, `table`), `tools/pr-status.mjs` (vùng `loadPrFiles`, `loadPr`, cổng `main`), `tools/pr-core.mjs` (vùng `prFiles`, `mergeBlockers`, `prList`), `tools/session-core.mjs` (vùng `latestReview`, `checkCounts`), `tools/session-io.mjs`, `tools/ts-hooks*.mjs`, `packages/ui/scripts/check-tokens.ts`, `.dependency-cruiser.cjs`, `eslint.config.js`, `.github/workflows/ci.yml`, `.githooks/pre-push`, `apps/desktop/vite.config.ts`, `e2e/serve.mjs`, `e2e/guide/{shots,check}.guide.ts`, `e2e/guide/links.ts`, `e2e/perf/probe.perf.ts` (trọn), `playwright{,.guide,.perf}.config.ts`, `vitest.config.ts`, `package.json` (gốc + `@p2c/desktop`).

**Đọc phần liên quan:** `apps/desktop/src/routes/period-labels.ts`, `packages/ui/src/components/PeriodPicker.label.ts`, `packages/domain/src/period.ts` (`formatPeriodValue`), `packages/domain/src/name-order.ts`, `packages/db/src/{backup,backup-validation,customers,kyc,appointments,trash}.ts` (chữ ký + luật 4), `packages/ai/src/{mock-extraction,mock-adapter,schema}.ts`, `apps/desktop/src/i18n/vi.ts` (`settings.backup.*`), `.claude/skills/auto-issues/SKILL.md` (§1, §2, §3.2, §3.8, §4, mã thoát), `docs/metrics/phase-6.md` (mục G7 + "Kích thước PR vượt ngưỡng"), `docs/testing/nghiem-thu-v1.md` (NT-EX-08/09, NT-HN-01, NT-TR-12, NT-AI-03, L1–L3), `docs/user-guide/06-ai.md`.

**Tài liệu chung:** `common\{prompt-deepseek.md (đủ), plan.md (§4, §L5.1–§L5.11), known.md (đủ), fixes.md (38 Issue + 39 PR liên quan gói F), baseline.md (đủ)}`, tổng hợp lượt 4 §3.1, §6, §8.4, §9. Báo cáo A–E lượt 5 của chính tôi.

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | **Chuỗi C → A → E:** ghi chú KYC có dấu đầu dòng, một khúc không chữ và một lần đổi hôn nhân (`- KH đã kết hôn` / `- Đã ly hôn năm 2020.` / `Sống ở quận 7.` / `Có 2 con.`) → Mock trích xuất → `recordKycNote` xác nhận dữ kiện → hồ sơ KYC → xóa mềm KH → Thùng rác → khôi phục | Mock đề xuất **Ly hôn** (đúng luật mang KH qua dấu đầu dòng của K42); ghi chú + phiên bản KYC tạo được; hồ sơ có `maritalStatus = Ly hôn` (bản `Độc thân` thành `superseded`), `childrenCount = 2`; Thùng rác 114 dòng, dòng KH có `code = K-3A40`; khôi phục → KH sống lại | — |
| 2 | **Chuỗi E → A → F:** lịch **Dự kiến 13/10/2026** (đã qua so hôm nay 05/11) → xóa → Thùng rác → khôi phục → nhóm của tháng 10 và nhãn | Trước 503 `unrecorded`; sau xóa 502; dòng Thùng rác `kind = appointment`; khôi phục → `unrecorded` lại (T-350 giữ sau khôi phục) | — |
| 3 | **Vòng xuất → nhập ở lớp dữ liệu:** nhập dữ liệu tải → xuất → nhập bản xuất → xuất lần hai | `tables` của hai bản xuất **trùng** (`sameTables = true`), cùng số KH / lịch / Thùng rác; 15 676 559 byte. Chỉ `exportedAt` đổi — đúng thiết kế | — |
| 4 | **CLR4-F2:** bản backup kiểu exe trước v1.0 — `trigger_note`, `note`, `next_step` của lịch MET chỉ có U+200B / U+2060 | Cả ba `BACKUP_INVALID` (luật 4); bản v1.0 tự xuất rồi nhập lại `OK`. Dòng NT-EX-08 / 09 khớp hành vi | — |
| 5 | **`auto-wait` với GitHub thật (chưa đăng nhập) và tham số sai:** `ci 1 --once`, `ci`, `ci 1 --since 2026-02-30T00:00:00Z`, `sleep --timeout 1 --once`, `pr 0`, `review 1 --sha zz`, `sleep --timeout 1` | `ci 1 --once` → **exit 3**, đúng **một dòng** `AUTO-WAIT ci #1: read failed: gh pr view failed: …` (lỗi nhiều dòng của `gh` gộp còn một); 5 dạng sai tham số → **exit 64** kèm câu đúng; `sleep --timeout 1` → exit 0 `AUTO-WAIT sleep: 1 min passed` | — |
| 6 | **Bộ chặn ký hiệu + i18n + ảnh hướng dẫn:** `check-tokens` trên `apps/desktop/src` + `packages/ui/src/components`, rồi chụp lại toàn bộ 28 ảnh hướng dẫn ở bản ghim | `check-tokens` xanh, 201 ms; bộ ảnh 13 passed, 28 ảnh **trùng từng byte** với bản commit (`git status` rỗng) — DR6-37 hết ở mức nguồn **và** ảnh hướng dẫn khớp app | — |
| 7 | **`size-report` trên `dist` bẩn:** chạy bộ ảnh (Playwright ghi `demo-2026-09-15.sqlite` 9,97 MB vào `dist`) rồi `node tools/size-report.mjs` | "Tệp khác (19 file …) 1 022 121" = mốc `baseline.md`; `.sqlite` không bị cộng (DR6-157). Sau khi dựng lại `build:web` **không** đặt biến riêng: `index.js` 892 184 / 264 291, tổng JS/CSS 2 366 456 / 699 761 — đúng mốc (bản do `serve.mjs` dựng lệch +10 B vì `VITE_DEMO_ANCHOR` được nhúng) | — |
| 8 | **Luật `dependency-cruiser` cho `test-support`:** tạo tạm 4 cặp file trong `packages/ai/src` rồi xóa | Sản phẩm import `vitest` → đỏ; `latest-support.ts` / `web-test-support.ts` (không khớp neo `/test-support`) → **vẫn đỏ**; sản phẩm import `./test-support` → đỏ rule mới; file test import `./test-support` → xanh; xóa xong `lint:deps` xanh lại | — |
| 9 | **`reviewedPr` trên brief §3.2 thật** của skill (thay `<N>` = 946), có và không có ghi chú `Linked sessions now` phía trước; báo cáo phiên con trong `<system-reminder>`; brief `[auto-issues]` không có dòng đúng | `946` / `946` / `null` / `null` — đúng hợp đồng của T-338 mục 7 | — |

## 5. Phát hiện mới

**Không có phát hiện mới trong gói F.** Tỉ lệ PLAUSIBLE: **0/0**.

Phần diff sau lượt 4 của gói là công cụ, và mọi nhánh mới đều đứng trước đột biến (bảng ở §10): 8 đột biến trên `tools/`, 1 trên bộ chụp ảnh, 4 ca của `dependency-cruiser`. Các hướng đã thử mà **không** thành phát hiện, ghi để phiên tổng hợp khỏi thử lại:

- **`globMeetsFolder` với đoạn `**` lẫn chữ** (T-333 mục 3): hàm trả ngay ở đoạn đầu tiên có `**`, nên `a/b**x/c.ts` với thư mục `a/by/` ra `true` dù không file nào trong đó khớp regex của glob. Đúng chữ của Issue ("tên thư mục phải bắt đầu như phần đứng trước `**`"), hậu quả chỉ là **dư một dòng** "Trong vùng" của `notes-for` với dạng glob không có trong repo (`git grep` trên `docs/state/review-notes.md`: 0 dạng `**` lẫn chữ). Ghi lại, không nâng thành phát hiện.
- **`bundleReport` bỏ mọi đuôi không nằm trong `OTHER_ASSET`** (DR6-157): bản dựng có `sourcemap` (`TAURI_ENV_DEBUG`) sẽ có `*.js.map` không được đếm ở đâu cả. `pnpm build:web` và `tauri build` (release) không đặt biến đó — `vite.config.ts:17` chỉ bật khi `TAURI_ENV_DEBUG` — nên số đang dùng (bản release) không bị ảnh hưởng. Ghi lại.
- **`auto-wait` `pr <issue>` chỉ đọc PR đang mở** (`--state open`): PR bị merge trong lúc chờ thì lệnh chờ hết hạn (exit 2) thay vì exit 3. Pipeline không dùng `pr` sau bước merge (§2 của skill), nên không có đường vào. Ghi lại.
- **`reviewedPr` bỏ `<system-reminder>` bằng regex không lồng nhau**: một khối không có thẻ đóng (prompt bị cắt) sẽ không bị bỏ, và `review-1` cạnh `PR #946` lại gợi ý nhầm. Prompt do app dựng luôn đóng thẻ; hướng sai là **gợi ý thừa**, không phải bỏ sót. Ghi lại.
- **`expectShotWhole` chỉ kiểm mép trên** khi phần chụp cao hơn cửa sổ (Playwright chụp trọn phần tử): đúng thiết kế, không phải lỗ.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đo | Trên | Kết quả | ID |
|---|---|---|---|
| `tsc -p e2e --noEmit --noUnusedLocals --noUnusedParameters` | `e2e/**` | exit 0, 0 lỗi | — |
| `eslint --max-warnings 0 tools e2e .dependency-cruiser.cjs eslint.config.js apps/desktop/vite.config.ts packages/ui/scripts` | toàn gói F | exit 0 | — |
| Quét export của `tools/*.mjs` (đếm chỗ dùng ngoài file khai báo, gồm test) | 39 file `tools/` | Không export **mới** nào chết. 7 tên "không dùng ngoài file" đều có từ trước (`handoff.readHandoff` / `writeHandoff`, `load-data-core.LOAD_SCALE`, `session-core.BODY_TARGET` / `BODY_MAX`, `size-report-core.DEFAULT_DIST` / `DEFAULT_EXE`) | — |
| `node tools/codemap.mjs --check` | toàn repo | "Export maps are up to date." | — |
| `node node_modules/dependency-cruiser/bin/dependency-cruiser.mjs apps packages` | toàn repo | no violations (354 module, 1 582 phụ thuộc) — trùng `baseline.md` | — |
| Cỡ dòng gói F (`common\baseline.md` §L5.3) | — | SP 4 886 (**+446** so lượt 4), test 18 427 (**+1 567**), sinh 4 628 (0), file 100 (+4); diff sửa +460 / −14 SP (7 file), +1 597 / −30 test (14 file) | — |
| Đọc 7 file SP đã đổi | diff | `auto-wait-core` 265 + `auto-wait` 123 là **công cụ mới** (thay việc chờ tay của pipeline); `notes-core` +15 ròng thay 3 dòng cũ bằng một hàm 15 dòng; `size-report-core` +5 (một regex + một hằng); `pr-status` +6 ròng (tách `loadPrFiles`, bỏ bản chép trong `loadPr`); `review-hint-core` +19 (hai luật mới); `.dependency-cruiser.cjs` +13 (một hằng + một rule) | — |
| Bundle web (dựng lại `build:web` **không** đặt biến) | `apps/desktop/dist` | `index.js` 892 184 / 264 291 gzip, `index.css` 30 295 / 6 821, tổng JS/CSS **2 366 456 / 699 761** — đúng `baseline.md`; so lượt 4 +8 029 B thô / +2 627 gzip, có giải thích ở các đợt sửa (không phải của gói F: gói F không thêm dependency, không thêm chunk) | — |
| Dependency mới | `package.json` các package | không | — |

Kết luận bloat: **không có phát hiện**. Hai khối lớn nhất (388 dòng `tools/auto-wait*`) thay một quy trình chờ tay bằng lệnh có mã thoát; phần còn lại đều là bỏ bản chép (`loadPrFiles`, `globMeetsFolder`, `AI_TEST_FILES`).

### 6.2 Hiệu năng

Máy `DESKTOP-KDURKJP`, Node `v24.20.0`, chạy một mình (không exe, không Playwright lúc đo), 05/11/2026 12:30–12:50.

| Đo | Trên dữ liệu nào | Số | Mốc / ngưỡng | ID |
|---|---|---|---|---|
| `byName` sắp 10 255 lịch theo tên KH (7 lần, trung vị 2 lần chạy) | dữ liệu tải | **11,4 / 11,3 ms** (min 11,1 · max 12,3) | lượt 4: 65,2 ms; bản `2e51e25` dựng lại trong probe: **64,4 / 64,5 ms**; trước #828: 9,4 ms | **DR6-136 đã hết**: −83 % so lượt 4; +2 ms (+21 %) so trước #828 nhưng **dưới luật nhiễu** (> 10 ms) và < 200 ms |
| `findHardcodedSeparators` qua `check-tokens.ts` (một lần, gồm khởi động Node + đọc 356 file) | `apps/desktop/src` + `packages/ui/src/components` | **201 ms** | D đo 196–197 ms; nằm trong `pnpm verify` (159 s) | — |
| `node tools/size-report.mjs` | toàn repo + `dist` | **246 ms** | `baseline.md`: 0,3 s | — |
| `node tools/codemap.mjs --check` | toàn repo | **449 ms** | — | — |
| `node tools/notes-for.mjs --diff` | sổ ghi chú ở bản ghim | **240 ms** | — | — |
| `dependency-cruiser apps packages` | toàn repo | **1 147 ms** | — | — |
| `pnpm exec playwright test -c playwright.guide.config.ts` (28 ảnh + 2 ca kiểm) | bản build web ở bản ghim | **27,1 s**, 13 passed | lượt 4 / T-343: không ghi số; bộ chụp chạy tay, không ở CI | — |
| `auto-wait` trên hàng đợi rảnh (`sleep`, `--once`) | — | 0 lệnh `gh` khi `sleep`; `--once` đúng **1** lần đọc | — | — |
| `tools/` unit | 13 file / 388 test | **9,09 s** | — | — |

Không có phát hiện P. Số trên exe (`app.open-data` 330 ms, `db.save` 150 ms, `trash.open` 33 ms, `reload.*` 285–407 ms, Dọn sạch 128,0 ms, `appointments.next-*` 111/108 ms) lấy từ `baseline.md` — mọi dòng trong ngưỡng, không dòng nào ⚠️ so mốc sau #656 hay G7; gói F không đổi đường nóng nào nên tôi không đo lại exe (và không đo khi bên khác có thể đang đo).

## 7. Đếm mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |

Gói F: **0 phát hiện mới**, 0 PLAUSIBLE. Bảng R của F: 5 dòng R1 (136, 155, 156, 157, CLR4-F2) + 19 dòng R2, **tất cả ĐÃ SỬA**. Cả 6 gói: **5 phát hiện mới** (DSR5-B1 Nit, DSR5-C1 Low, DSR5-D1 Low, DSR5-D2 Nit, DSR5-E1 Low) và **1 dòng R SỬA MỘT PHẦN** (DR6-145).

## 8. Đã xét, không thấy

- **R (phần đã sửa):** 5 dòng R1 + 19 dòng R2 của F ở §2, mỗi dòng có đột biến, phép chạy lại hoặc số đo; cộng 20 dòng còn lại của bảng gộp (đọc báo cáo A–E, đối chiếu `fixes.md`). Không dòng nào của F còn đường lỗi cũ.
- **E (edge case):** tham số `auto-wait` (7 dạng sai, `--once` với `--timeout`, `--since` ngày không có thật, SHA sai dạng, `sleep --once`); `gh` lỗi và lỗi nhiều dòng; `globMeetsFolder` với `**` lẫn chữ, `**` đứng riêng, thư mục sâu hơn glob, thư mục nông hơn glob; `bundleReport` với `dist` có `.sqlite`, `.map` (lý thuyết), tên chunk trùng sau khi bỏ hash; `metDays` / `metYear` với tháng/năm không đủ ngày Đã gặp, chạy vắt nửa đêm cuối tháng, tháng < 10 (định dạng `MM/YYYY` có `pad` — đối chiếu `formatPeriodValue`); `expectShotWhole` với phần chụp cao hơn cửa sổ, phần tử nằm trong `<dialog>`. Không thấy.
- **C (hợp đồng / spec):** `auto-wait` khớp bảng mã thoát và cách dùng của skill §2 / §4 (exit 0/1/2/3/64, dòng `AUTO-WAIT` một dòng); `ci --since` khớp mô tả §4 sau `reopen` (`closedAt` của GitHub); `title` khớp tên PR sổ trong skill; `notes-core` khớp DR6-156 và T-333 (3); `size-report` khớp `docs/metrics/phase-6.md` §6.2; `check-tokens` khớp ADR-0013 + quy tắc i18n; `.dependency-cruiser.cjs` khớp ADR-0006 và T-336 / T-339. Không thấy lệch.
- **D (dữ liệu):** ba chuỗi ở §4 (KYC → xóa → khôi phục; lịch đã qua → xóa → khôi phục; xuất → nhập → xuất) không lần nào cho dữ liệu khác đi; `tables` của hai bản xuất trùng. Không thấy.
- **G (guardrail AI):** gói F không chạm prompt hay validator; `mock-extraction` chỉ dùng để dựng chuỗi §4 (1). Không thấy.
- **S (an toàn ranh giới):** `auto-wait` chỉ gọi `gh` với tham số cố định + số / SHA / tiêu đề; `title` đưa chữ của Owner vào `--search` (một đối số, không shell) — không thành đường dẫn hay lệnh. `check-tokens` / `size-report` / `notes-core` chỉ đọc file trong repo. Không thấy đường mới.
- **P (hiệu năng):** §6.2 — không dòng nào vượt ngưỡng; `byName` là chỗ duy nhất đổi và đã đo.
- **B (bloat):** §6.1 — `tsc` unused sạch, eslint sạch, codemap khớp, 0 dependency mới, không export mới nào chết.
- **T (chất lượng test):** 8 đột biến trên `tools/` + 1 trên bộ chụp ảnh, **9/9 bị giết**; 4 ca `dependency-cruiser` đúng chiều. `auto-wait.mjs` (phần I/O, 40 dòng) không có unit test — chỉ chạy thật được khi `gh` đã đăng nhập, mà đợt 2 đăng xuất `gh`; tôi kiểm phần này bằng đường lỗi thật (exit 3, một dòng) và bằng đột biến ở phần thuần. Ghi lại làm giới hạn của phiên, không nâng thành phát hiện.
- **A (trợ năng / i18n):** gói F không có màn; `check-tokens` là chốt i18n và xanh trên toàn app; ảnh hướng dẫn khớp app (T-343). Không thấy.

## 9. Kết luận cho v1.0 ở SHA `37a80b6`

**CHƯA SẴN SÀNG.**

Lý do, theo đúng chữ K47 (`known.md` phần 2: "sau tổng hợp **sửa hết mọi phát hiện, rồi G7**"):

1. **Còn phát hiện mới** — 5 phát hiện của chính tôi ở lượt này, tất cả CONFIRMED, không có Medium trở lên:
   - **DSR5-C1** (Low, C/E): ô dán ChatGPT web hỏi "trống" bằng `trim()`, nên chuỗi chỉ có U+200B / U+2060 được tính là một lần thử; hai lần thì ghi một dòng `ai_analyses` REJECTED — dữ liệu sai nghĩa, không xóa được.
   - **DSR5-D1** (Low, T): bộ chặn ký hiệu vẫn bỏ sót `←`, `–`, `…` và ngoặc kép cong — bốn dạng DR6-145 (b) liệt kê đích danh; đường DR6-37 quay lại được.
   - **DSR5-E1** (Low, E): hộp Hợp đồng hỏi "trống" bằng `trim()` — ô chỉ có ký tự vô hình hiện lỗi bắt buộc trước khi bấm Lưu.
   - **DSR5-B1** (Nit, B), **DSR5-D2** (Nit, T): nhánh chết trong hàng đợi lưu; `JOINER` báo nhầm `text.split(', ')`.
2. **Còn một dòng R chưa ĐÃ SỬA** — **DR6-145** ở mức **SỬA MỘT PHẦN** (gói D): phần (b) của mô tả DR6 chưa đóng hết, và chính phần còn lại là DSR5-D1.
3. **Không có gì chặn kiểu khác:** 24/25 dòng R1 và 28/28 dòng R2 **ĐÃ SỬA**, 0 HỒI QUY; mọi số đo không xấu hơn mốc Home PC sau #656, G7 hay lượt 4 (kể cả `byName`, Dọn sạch 128,0 ms, `reload.*` ≤ 407 ms); bundle và exe bằng lượt 4 (exe 5 649 408 B, JS/CSS +8 029 B có giải thích); `pnpm verify` / `e2e` / `verify:rust` xanh ở bản ghim theo `baseline.md`.

Nghĩa là: sửa 5 phát hiện trên và đóng nốt DR6-145 (b), rồi G7 — đúng đường K47. Không có phát hiện nào ở mức chặn phát hành, nên nếu Owner chọn phát hành trước rồi vá sau thì đó là quyết định của Owner, không phải kết luận của báo cáo này.

## 10. Phụ lục

**Probe / script (trong `C:\workspace\deep-review-1-6-r5\deepseek\F\`):**

| File | Việc | Kết quả |
|---|---|---|
| `mut/mutate.mjs` + `mut/*.json` | vá một chuỗi trong một file repo, chạy một lệnh, trả nguyên byte + so sha256 | 9 lần, `restored: true` cả 9 |
| `mut/specs.mjs`, `mut/spec-guide.mjs` | sinh spec đột biến | — |
| `probe-clr4f2.mjs` | CLR4-F2: ba ô tùy chọn chỉ có ký tự vô hình, vòng xuất → nhập v1.0 | `BACKUP_INVALID` ×3; `v1_roundTrip = OK` |
| `probe-chain.mjs` | ba chuỗi §4 (1)–(3) | Ly hôn + Số con 2; 503 → 502 → khôi phục; `sameTables = true` |
| `probe-byname.mjs` | DR6-136: `byName` so bản `2e51e25` dựng lại | 11,3–11,4 ms vs 64,4–64,5 ms, `sameOrder = true` |
| `probe-deps.mjs` | bốn ca `dependency-cruiser` (T-336, T-339) | đúng chiều cả bốn, file tạm đã xóa |
| `probe-autowait.mjs`, `fake-gh.mjs`, `shim/gh.cmd` | định chạy `auto-wait` với `gh` giả | **không dùng được**: libuv không phân giải `gh.cmd` theo PATH khi không có shell (`spawnSync gh → ENOENT`), nên mọi lần đều gọi `gh` thật (chưa đăng nhập) → exit 3. Giữ lại làm bằng chứng; phần I/O vì vậy chỉ kiểm được bằng đường lỗi thật |
| `pw-guide/`, `pw-guide-mut/`, `guide-base.log` | output Playwright của bộ ảnh (bản ghim và bản đột biến) | 13 passed; bản đột biến: `foot of the part in the shot` |

**Đột biến (mỗi lần: áp → chạy → trả bản gốc → `sha256` trùng):**

| Mã | File | Đột biến | Test đỏ |
|---|---|---|---|
| R155a | `tools/pr-core.mjs` | `Read ${pr.files.length}` → `${paths.length}` (T83c) | 1 — `pr-core.test.mjs:555` ("Read 2 of the 2") |
| R156 | `tools/notes-core.mjs` | `covers` về bản cũ (tiền tố trước `*` + đòi `**`) | 2 — `notes-core.test.mjs:309` |
| R157 | `tools/size-report-core.mjs` | `others` = mọi file không phải JS/CSS | 1 — `{files: 5, raw: 1107}` |
| R155b | `e2e/guide/shots.guide.ts` | gỡ dòng `style:` của `shot()` | 1 — `04, 05 hồ sơ KH`: "foot of the part in the shot" (10 passed, 2 did not run) |
| T333g | `tools/notes-core.mjs` | đoạn có `**` → `return true` | 1 — `a/b**/c.ts` trả `[1, 2]` |
| T335d | `tools/auto-wait-core.mjs` | `sleep(everyMs)` thay `min(everyMs, max(left, MIN_EVERY_MS))` | 1 — lần đọc ở `[0, 61000, 122000]` |
| T338s | `tools/auto-wait-core.mjs` | bỏ vế `--since` | 1 — "CI green" thay "no workflow run since … yet" |
| T338h | `tools/review-hint-core.mjs` | không bỏ các khối app | 2 — `946` thay `950` |
| T338f | `tools/auto-wait-core.mjs` | `ciState` đọc `files: []` | 1 — docs-only PR thành "no checks yet" |

Mọi lần vá đều trả file về nguyên byte (`restored: true`, sha256 trước = sau), `git status --short` rỗng sau từng lần và ở cuối phiên; `docs/user-guide/img` được trả bằng `git checkout` sau lần đột biến ảnh (28 ảnh trùng byte bản commit).

**`git status --short` cuối phiên:** rỗng. `git rev-parse HEAD`: `37a80b662861d308a110d1e2b0f65ad13b91fb51`.

**Giờ xong:** 12:40 05/11/2026 (+07:00).
