XONG — deepseek gói A lượt 5, 10:38

# Gói A — Lõi dữ liệu (`packages/domain/**`, `packages/db/**`)

## 1. Phiên

- **Bên:** deepseek · **Gói:** A (Lõi dữ liệu) · **Lượt:** 5.
- **SHA đầu phiên:** `37a80b662861d308a110d1e2b0f65ad13b91fb51` (`git rev-parse HEAD`), đúng SHA ghim.
- **`git status --short` đầu phiên:** rỗng.
- **Giờ bắt đầu:** 05/11/2026 09:48 +07:00. **Giờ xong:** 10:38.
- **Máy:** `DESKTOP-KDURKJP` (Home PC), như `common\baseline.md`; phiên chạy một mình (đợt 2).
- **App:** WorkBuddy **v5.9.4** (Owner ghi ở `common\baseline.md`, mục "Kiểm ACL với Code review expert"); expert **CodeReviewExpert** (khối expert của ngữ cảnh phiên); model **DeepSeek-V4.1-Flash** (dòng "This conversation is powered by DeepSeek-V4.1-Flash"); context **1M**, mức suy luận **Max** (Owner ghi ở `baseline.md`); chế độ quyền **Default**.
- **Node:** `"C:\Program Files\nodejs\node.exe" --version` → `v24.20.0` (≥ 24). Mọi lệnh `node` / vitest đặt `C:\Program Files\nodejs` lên đầu PATH trong chính lệnh đó.
- **Công cụ:** đọc file, PowerShell / Git Bash, `node node_modules/vitest/vitest.mjs`, `node node_modules/typescript/bin/tsc`, `node tools/codemap.mjs`, `node node_modules/dependency-cruiser/bin/dependency-cruiser.mjs`. Không dùng agent phụ, không skill, không connector, không mạng.

## 2. Bảng R1 / R2

### R1 — theo mã (4 dòng của gói A: DR6-135, 136, 137, 151)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-135 | #896 → #907 | **ĐÃ SỬA** | Tái hiện lượt 4 (xóa / sửa / hủy một cuộc gặp khi cuộc gặp khác **cùng ngày** đã giữ nhóm): probe `probe-a1.mjs` — `sameDay.deleteMoved`, `.editMoved`, `.cancelMoved` đều `STAGE_KEPT_BY_MEETING {date:"05/01/2026"}`, `stageAfterBlocks = N2`; xóa cuộc gặp giữ nhóm trước → `OK`, rồi xóa cuộc gặp đã dời → `OK`, nhóm cuối `N1`. Ca mới `appointments.test.ts:1027` phủ đúng ba lệnh. **Gỡ tạm:** đổi `date >= ?` → `date > ?` ở `packages/db/src/customers.ts:445` (sha256 trước `c5181012…`), chạy `appointments.test.ts -t "same day"` → **1 failed** (`:1035` nhận `undefined` thay `STAGE_KEPT_BY_MEETING`); khôi phục nguyên byte, sha256 lại `c5181012…`, `git status` rỗng | Đường khôi phục (`probe-a1.mjs` `restore`): khôi phục cuộc gặp **giữ nhóm** trước → `STAGE_NOT_ON_DAY {05/01/2026}`; khôi phục cuộc gặp đã dời → `OK`; rồi cuộc gặp giữ nhóm → `OK`, nhóm `N2`. Đường nhập backup (`probe-a2.mjs`): file sửa tay bỏ chuyển nhóm của cuộc gặp đã dời, hạ `customers.stage` về `N1`, giữ cuộc gặp cùng ngày → `BACKUP_INVALID rule 4`. Biến thể gần (`probe-a7.mjs`): dời ngày cuộc gặp đã dời sang 06/01 hay 04/01 → vẫn `STAGE_KEPT_BY_MEETING {05/01}`; dời cuộc gặp giữ nhóm về 03/01 → `TRANSITION_BEFORE_LATEST {05/01}`, sang 06/01 → `OK`; ba cuộc gặp cùng giữ nhóm → xóa một cái vẫn khóa, xóa cả hai thì xóa được |
| DR6-136 | #896 → #907 | **ĐÃ SỬA** | `probe-a3.mjs` (dữ liệu tải, Node v24.20.0): sắp 10 255 lịch hẹn theo tên KH — **11,4 ms** (lần đầu 11,4; 7 lần min 11,3 / max 11,5). Bản `2e51e25` dựng lại đúng mã cũ trong probe (tính khóa mỗi lần so): **64,0 ms**. Lượt 4 đo 65,2 ms; trước #828 là 9,4 ms ⇒ +2,0 ms (+21 %) nhưng **dưới luật nhiễu** (phải quá 10 ms) và dưới ngưỡng 200 ms. 1 481 tên KH: 1,4 ms (cũ 7,3; lượt 4 9,1). **Thứ tự:** trùng bản `2e51e25` trên 10 255 tên thật (`sameOrderAppointments.equal = true`), trên 1 547 tên có chữ số toàn khổ / Ả Rập (`Team ２`, `Team ٢`, `0１a`, `01 2`, `0A`, …) và trên 20 002 tên (vượt `MAX_KEYS`, khóa khởi động lại giữa lúc sắp) — `sameOrder = true` cả ba. `probe-a6.mjs`: 1 393 tên thật của dữ liệu tải, **0** tên ngoài `LATIN`, **0** cặp collator đọc bằng nhau ⇒ thứ tự **trùng collator trần** | **Gỡ tạm:** `key = LATIN.test(name) ? name : name.replace(OTHER_DIGIT, asciiDigit);` → `key = name;` (bỏ ánh xạ chữ số) → 3 test `name-order.test.ts` đỏ, gồm ca mới `:94` ("sorts more names than it keeps the keys of"). Gỡ hẳn cache = đo lại đúng mã cũ (64,0 ms) — đó là chi phí mà bản sửa bỏ đi. Ca `MAX_KEYS`: 20 002 tên 10,2–10,7 ms (cũ 12,3–12,5), thứ tự không đổi |
| DR6-137 | #896 → #907 (+ #933 → #946) | **ĐÃ SỬA** | `isLabel` (`common.ts:105`) và `valueOf` của bước nạp (`backup.ts:197`) cùng gọi `readsBackAsIs` (`common.ts:96`). **Gỡ tạm** luật U+FEFF trong `readsBackAsIs` (`return isStorableText(text);`, sha256 trước `39e8e489…`) → **4 test đỏ**: `ai-analyses.test.ts` "refuses an analysis whose provider…" (nhận model `'x'×99 + \uD800` và `\uDC00glm-5.3`, `\u{FEFF}alpha`), `ai-analyses.test.ts` "reads a model name at the import (rule 12) as the command does", `backup-invariants.test.ts` "VALUE: a model name starting with U+FEFF" (nhận `rule 12` thay vì không rule), `common.test.ts` "refuses a NUL, a lone surrogate half and a U+FEFF that starts the text". Khôi phục nguyên byte, sha256 lại `39e8e489…` | **Ma trận mọi cột chữ** (`probe-a2.mjs`, 38 cột chữ của 6 bảng có dữ liệu × 5 đột biến): NUL và nửa surrogate bị từ chối ở **mọi** cột; U+FEFF **đầu** chữ bị từ chối ở **mọi** cột; U+FEFF **giữa** chỉ lọt ở `appointments.id`, `customers.code`, `kyc_notes.id`, `stage_transitions.id`, `appointments.trigger_note`; U+FEFF **cuối** lọt ở `appointments.id`, `customers.code` — đúng những cột lệnh lưu nguyên văn (`optionalText` chỉ `trim`, cắt FEFF cuối) hoặc cột định danh. Không cột nào lệnh ghi được mà bước nạp từ chối: `probe-a2.mjs` `roundTrip` ghi tên KH `Trịnh\u{FEFF}Minh Anh` (lưu thành `TrịnhMinh Anh` — `normalizeText` bỏ FEFF), ghi chú KYC có FEFF (bỏ như tên), và ba ô chữ của lịch hẹn (`trigger_note`, `next_step`, `note`) có FEFF ở giữa — giữ nguyên; xuất rồi nhập lại → `OK`, đọc lại y nguyên |
| DR6-151 | #903 → #924 (+ #933 → #946) | **ĐÃ SỬA** | `TrashRow` kind `customer` có `code` (`trash.ts:82`), `listTrash` đọc `row.code` (`trash.ts:134`). `probe-a1.mjs` `trashCode`: ba KH đã xóa, hai tên **và nhóm** trùng nhau (`Trịnh Minh Anh`, N3) → ba mã khác nhau `K-YZE9` / `K-BBAS` / `K-6NY6`, `trashCodesUnique = 3`. **Gỡ tạm:** bỏ dòng `code: row.code,` → `trash.test.ts` "E1: restores a customer with every record not deleted on its own" đỏ (`:114`); khôi phục nguyên byte | Quy tắc "có mã khi tên và nhóm trùng" nằm ở `codedCustomers` (`apps/desktop/src/routes/trash-view.ts:204`, khóa `stage\|name`, đọc trên mọi dòng bất kể bộ lọc) — thuộc dòng E; gói A chỉ kiểm dữ liệu `code` có và khác nhau. Không thấy chỗ nào khác dựng `TrashRow` nên không có đường thiếu `code` |

### R2 — theo Issue (2 dòng của gói A: T-332, T-350)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-332 | #933 → #946 | **ĐÃ SỬA** (phần của gói A: mục 5 của Issue) | Mục tiêu "điều kiện *đọc lại đúng như lưu* ở một nơi": `readsBackAsIs` (`common.ts:96`) là chỗ duy nhất; `isLabel` (`:105`) và `valueOf` (`backup.ts:197`) cùng gọi; lý do từng ký tự (DR-49, DR5-14, DR6-49, DR6-107) nằm ở doc của hàm chung. Test chấp nhận "isLabel và valueOf gọi cùng một hàm; chữ bắt đầu bằng U+FEFF vẫn bị từ chối ở cả hai" — đúng. **Gỡ tạm:** như dòng DR6-137 (4 test đỏ). Không còn bản sao điều kiện nào: `rg "startsWith('\\u{FEFF}')"` chỉ ra `common.ts:97` | Phần còn của T-332 không thuộc gói A: `parseTime` + ô Giờ (D/E), focus sau hộp 10a/10b (D), khóa i18n `customer.withCode` (D/E), `listeners.ts` (B/C). `valueOf` sau khi đổi hành vi **y như trước** trên mọi cột (cùng `isStorableText` + cùng luật FEFF đầu) — ma trận ở dòng DR6-137 xác nhận |
| T-350 | #1001 → #1011 | **ĐÃ SỬA** (phần của gói A: `appointmentGroup`) | `appointmentGroup` nhận `Pick<Appointment,'status'\|'date'>` (`appointment-counts.ts:18-32`), thân hàm không đổi. `probe-a1.mjs` `counts`: lịch Dự kiến 20/09 (đã qua) → `unrecorded`, 30/09 → `planned`; `appointmentCounts` kỳ Tháng 9/2026 → `{unrecorded:1, planned:1, total:2}`. Mọi chỗ dùng một luật: `appointment-counts.ts:55,77,116` (chỉ số), `appointments-view.ts:109,394,427`, `AppointmentsScreen.tsx:143`, `CustomerAppointments.tsx:30`, và Thùng rác qua `statusLabel` (`trash-view.ts:92`, `:431`). **Gỡ tạm:** `return 'planned'` thay nhánh so ngày → **17 test đỏ** ở 3 file (`appointment-counts.test.ts` 9, `trash-view.test.ts` 5, `appointments-view.test.ts` 3) | Dòng "Trạng thái" của hộp khôi phục dùng `statusLabel(row, today)` (`trash-view.ts:431`), dòng "Bản ghi" dùng `recordTitle` (`:89`, gọi `statusLabel` ở `:92`) — cả hai đi qua `appointmentGroup`. Phần `trash-view.ts` / `SettingsTrash.tsx` / `RestoreDialog.tsx` / mockup `trash.html` thuộc dòng E; gói A kiểm hàm chung và mọi chỗ gọi |

## 3. Phạm vi đã đọc

**Diff `2e51e25..37a80b6` của gói A** (12 file, +164 / −44; `git diff --numstat`: SP +53 / −24 trong 5 file, test +110 / −19 trong 6 file, `CLAUDE.md` +1 / −1 — khớp `common\baseline.md` §L5.3):

- `packages/domain/src/name-order.ts` (+21 / −4), `appointment-counts.ts` (+6 / −2);
- `packages/db/src/common.ts` (+17 / −2), `backup.ts` (+6 / −16), `trash.ts` (+3 / 0);
- test: `name-order.test.ts` (+26 / −13), `ai-analyses.test.ts` (+39 / −5), `appointments.test.ts` (+18), `backup-invariants.test.ts` (+9), `common.test.ts` (+16 / −1), `trash.test.ts` (+2);
- `packages/db/CLAUDE.md` (+1 / −1, khối codemap).

**Đọc trọn hoặc theo vùng chức năng:**

- `packages/db/src/common.ts` (319 dòng), `backup.ts` (209), `backup-validation.ts` (543), `trash.ts` (290), `customers.ts` (vùng `stagesOfDay`, `withdrawAppointmentTransition`, `meetingKeepingMove`, `unmovedMeetingsFrom`, `transitionWithdrawnAt`, `reinstateTransition`, `softDeleteCustomer`), `appointments.ts` (vùng `recordMeetingOutcome`, `editMeetingOutcome`, `softDeleteAppointment`, `restoreAppointment`, `applyOutcome`, `outcomeStage`, `requireOutcomeDay`), `ai-analyses.ts` (vùng `toRow`, `analysisLabelsFit`, `analysisContentFits`, `storedRawOutput`), `schema.ts` (mọi cột `text(`), `test-support.ts`, `index.ts` (xuất).
- `packages/domain/src/text.ts` (79), `name-order.ts` (61), `appointment-counts.ts` (120), `period.ts` (vùng `compareDates`, `isInPeriod`, `periodOf`), `model.ts` (vùng `Appointment`, `PERSON_ROLES`).
- Ứng dụng, chỉ để kiểm chỗ dùng của luật của gói: `apps/desktop/src/routes/trash-view.ts` (vùng `recordTitle`, `recordBadge`, `codedCustomers`, `restoreLabel`, `appointmentRestore`), `routes/appointments/appointments-view.ts` (vùng `statusLabel`, `monthGrid`, `yearGrid`), `routes/appointments/EditOutcomeDialog.tsx` (nhãn trạng thái khóa), `routes/SettingsTrash.tsx` (đọc `codedCustomers`/`today`), `routes/customers/CustomerAppointments.tsx`.
- Test của gói: `appointments.test.ts` (nhóm "the stage on the meeting day", 930–1120), `common.test.ts`, `backup-invariants.test.ts` (bảng `broken`), `ai-analyses.test.ts` (vùng nhãn model), `name-order.test.ts`, `trash.test.ts` (nhóm khách hàng).

**Tài liệu:** `common\plan.md` §L5.4, §L5.6, §L5.8; `common\known.md` phần 2 (K1–K47), phần 4, 5; `common\fixes.md` #896/#907, #903/#924, #933/#946, #1001/#1011; `common\baseline.md`; `docs/reviews/2026-10-31-…-luot-4-tong-hop.md` §6.1, §7.2, §7.4; `docs/design/phase-6-hoan-thien.md` §4.2 (TR-1…TR-13, vùng Thùng rác); `docs/golden/lich-hen.md` (bảng nhóm + L-01…L-14) và `docs/golden/chi-so.md` (bảng định nghĩa), chỉ để đối chiếu nhóm lịch hẹn và chuyển RF.

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | **D7 cùng ngày, ba lệnh:** KH N1; cuộc gặp A 05/01 Đã gặp → N2; cuộc gặp B 05/01 Đã gặp, giữ N2. Xóa A / sửa A sang N1 / hủy A | Cả ba `STAGE_KEPT_BY_MEETING {05/01/2026}`, nhóm vẫn N2; xóa B trước thì xóa A được, nhóm về N1 | — |
| 2 | **D7 cùng ngày qua khôi phục:** xóa B, xóa A, khôi phục B trước | `STAGE_NOT_ON_DAY {05/01/2026}` (đúng: ngày đó không còn N2); khôi phục A rồi B thì được, nhóm N2 | — |
| 3 | **D7 cùng ngày qua nhập backup:** file xuất rồi sửa tay — bỏ chuyển nhóm của A, hạ `customers.stage` về N1, giữ B sống | `BACKUP_INVALID {rule:4}` — luật nhập bắt đúng trạng thái mà lệnh không cho tạo | — |
| 4 | **Biến thể gần của D7:** dời ngày A sang 06/01 và 04/01; dời B về 03/01 và sang 06/01; ba cuộc gặp cùng giữ nhóm rồi xóa lần lượt | A dời ngày → vẫn khóa (`05/01`); B về 03/01 → `TRANSITION_BEFORE_LATEST`; B sang 06/01 → `OK`; ba cái: khóa còn khi một cái sống, xóa hết thì A xóa được | — |
| 5 | **Vòng xuất → nhập dữ liệu tải** (1 496 KH, 10 255 lịch sống, 113 dòng Thùng rác): `exportBackup` rồi `importBackup` lại | `tables` sha256 `e256e4f1…` **trùng mốc G7**; nhập lại cho cùng hash, cùng `listCustomers` / `listAppointments` / `listTrash` | — |
| 6 | **Dữ liệu do exe ghi:** mở 4 file `.db` trong `common\perf\run\Project2C-data` (DB sau Dọn sạch: 1 481 KH / 10 255 lịch; backup của seed demo: 1 200 / 6 229; hai backup dữ liệu tải: 1 496 / 10 424 và 1 496 / 10 414), xuất backup rồi nhập lại | Cả 4 `OK`, đọc lại trùng (`same` = true ba mục) — dữ liệu exe ở SHA ghim xuất ra vẫn nhập được | — |
| 7 | **Ma trận cột chữ:** 38 cột chữ × {NUL, nửa surrogate, FEFF đầu / giữa / cuối} | NUL, surrogate, FEFF đầu: từ chối ở mọi cột; FEFF giữa/cuối chỉ lọt ở cột lệnh lưu nguyên văn (`trigger_note`) và cột định danh (`id`, `code`) | — |
| 8 | **Đi bộ ngẫu nhiên 300 bước** trên lõi dữ liệu (tạo KH, đặt lịch, ghi / sửa kết quả, dời lịch, xóa / khôi phục lịch và KH, chuyển nhóm tay), sau **mỗi** bước xuất rồi nhập lại và so bốn lượt đọc | 84 bước áp được, 181 bị lệnh từ chối; **0** lần nhập hỏng, **0** lần đọc khác trước | — |
| 9 | **`byName` với collator trần:** 1 393 tên thật của dữ liệu tải (KH + nhân sự + team) sắp bằng `byName` và bằng `Intl.Collator('vi',{numeric:true})` trần | Trùng hoàn toàn; 0 tên ngoài `LATIN`, 0 cặp collator đọc bằng nhau ⇒ phần "cùng thứ tự với collator trần trên tên thật" đúng | — |
| 10 | **Khóa của cache qua `MAX_KEYS`:** sắp 20 002 tên (10 001 số viết ASCII và Ả Rập) — khóa bị xóa giữa lúc sắp | Thứ tự trùng bản `2e51e25` và trùng dãy đã sắp; 10,2–10,7 ms (cũ 12,3–12,5) | — |
| 11 | **Mã KH ở Thùng rác:** hai KH cùng tên, cùng nhóm, đều đã xóa, cộng một KH tên khác | Ba mã khác nhau; `TrashRow.code` có mặt ở cả ba dòng | — |

## 5. Phát hiện mới

**Không có phát hiện mới trong gói A.** Phần diff sau lượt 4 của gói nhỏ (5 file sản phẩm, +53 / −24 dòng) và cả bốn dòng R1 cùng hai dòng R2 đều đứng trước đột biến và trước các biến thể gần. Các hướng đã thử mà **không** thành phát hiện, ghi lại để phiên tổng hợp khỏi thử lại:

- **Luật D7 cùng ngày có thể khóa nhầm** một lệnh đáng cho phép: đã thử dời ngày cuộc gặp đã dời (06/01, 04/01), dời cuộc gặp giữ nhóm (03/01, 06/01), ba cuộc gặp cùng giữ nhóm, và đường khôi phục — mọi ca ra đúng luật, không ca nào bị khóa oan (kịch bản 1, 2, 4).
- **Lệch giữa lệnh và bước nạp** (họ DR6-137) ở cột khác: ma trận 38 cột chữ (kịch bản 7) và 300 bước đi bộ ngẫu nhiên có xuất/nhập sau từng bước (kịch bản 8) không tìm được trạng thái nào lệnh tạo ra mà file xuất không nhập lại được.
- **Cache `byName`** (state ở cấp module): không đổi thứ tự, không rò rỉ đo được (tối đa 20 000 tên, dữ liệu tải chỉ 1 393 tên phân biệt), không làm chậm khi vượt `MAX_KEYS` (kịch bản 10). Hàm không còn thuần khiết nhưng kết quả tất định — ghi lại, không nâng thành phát hiện.
- **`TrashRow.code`** có thể làm lộ mã KH ra chỗ khác: chỉ `restoreLabel` đọc (`trash-view.ts:227`), không chỗ nào in thêm.

## 6. Bloat và Hiệu năng

### Bloat

| Đã chạy / đo | Trên | Kết quả | ID |
|---|---|---|---|
| `node node_modules/typescript/bin/tsc -p packages/domain/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` | `packages/domain/src` | sạch (không export / biến / tham số thừa) | — |
| như trên với `packages/db/tsconfig.json` | `packages/db/src` | sạch | — |
| `node tools/codemap.mjs --check` | toàn repo | "Export maps are up to date." | — |
| `node node_modules/dependency-cruiser/bin/dependency-cruiser.mjs apps packages` | toàn repo | "no dependency violations (354 modules, 1582 dependencies)" — trùng `baseline.md` | — |
| Cỡ dòng gói A | `common\baseline.md` §L5.3 | SP 8 748 (**+29** so lượt 4), test 15 805 (**+91**), sinh 341 (0), file 104 (0); diff sửa +53 / −24 SP (5 file), +110 / −19 test (6 file) | — |
| Đọc 5 file sản phẩm đã đổi | diff | `common.ts` **bớt** một bản sao điều kiện (7 dòng trong `valueOf` → 1 lời gọi), `name-order.ts` **thêm** cache 18 dòng có lý do đo được (DR6-136), `trash.ts` +2 dòng, `appointment-counts.ts` +4 / −2 (chỉ kiểu), `backup.ts` −10 dòng doc | — |
| Dependency mới | `package.json` các package | không | — |

Kết luận bloat: **không có phát hiện**. Hai thay đổi lớn nhất đều là giảm hoặc có số đo: `readsBackAsIs` gộp một điều kiện đã chép, cache `byName` đổi 64,0 ms lấy 18 dòng.

### Hiệu năng

Máy `DESKTOP-KDURKJP`, Node `v24.20.0`, phiên chạy một mình (đợt 2 không có bên khác đo). Dữ liệu: `common\load\load-2026-10-12-seed6.p2cbackup` (15,3 MB, 1 496 KH, 10 255 lịch sống). Luật nhiễu: quá 20 % **và** quá 10 ms.

| Đo | Kết quả (trung vị) | Mốc | Δ | Ngưỡng / kết luận |
|---|---|---|---|---|
| `byName` sắp 10 255 lịch hẹn theo tên KH (7 lần) | **11,4 ms** (min 11,3 / max 11,5; lần đầu 11,4) | lượt 4: **65,2 ms** (bản cũ dựng lại trong probe: 64,0 ms); trước #828: 9,4 ms | −53,8 ms (−83 %) so lượt 4; +2,0 ms (+21 %) so trước #828, **dưới luật nhiễu** (cần > 10 ms) | < 200 ms ✅ — DR6-136 đã hết |
| `byName` sắp 1 481 tên KH | 1,4 ms | lượt 4: 9,1 ms (trước #828: 1,0) | −7,7 ms (−85 %) | ✅ |
| `byName` sắp 20 002 tên (vượt `MAX_KEYS`, 3 lần) | 10,2 / 10,2 / 10,7 ms | bản cũ cùng bộ tên: 12,3 / 12,3 / 12,5 ms | −2 ms | ✅ |
| `listTrash` (113 dòng) | **20,6 ms** (19,0–22,8) | `baseline.md` đợt 2: 24,6 ms; lượt 4: 23,8 ms | −4,0 ms (−16 %) | < 200 ms ✅ |
| `listAppointments` (10 255 dòng) | 43,7 ms (42,5–46,1) | lượt 4 §7.2: "như cũ trong nhiễu", không có số | — | ✅ |
| `appointmentCounts` kỳ Tháng 10/2026 (10 255 lịch) | 0,8 ms (0,6–1,1) | — | — | ✅ |
| `appointmentCountsByScope` cùng kỳ | 0,7 ms (0,6–0,9) | — | — | ✅ |
| `exportBackup` (15,68 MB JSON) | 175,3 ms (174,3–178,0) | `baseline.md` trên exe `backup.export` 438 ms (gồm ghi file của Rust) — không so trực tiếp | — | ≤ 1 000 ms (exe) ✅ |
| `importBackup` dữ liệu tải | 905,5 ms | — (lượt 4 không đo trong Node) | — | ✅ |
| `importBackup` bản xuất của chính nó | 807,2 ms | — | — | ✅ |

Không có phát hiện P. Mọi số đo lấy từ `probe-a3.json` và `probe-a5.json` (phụ lục). Bộ nhớ: không đo lại (không có thay đổi nào giữ thêm dữ liệu ngoài cache 20 000 khóa; dữ liệu tải chỉ sinh 1 393 khóa).

## 7. Đếm mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |

Không có phát hiện mới, nên không có dòng PLAUSIBLE. Bốn dòng R1 và hai dòng R2 đều **ĐÃ SỬA**, không có SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY trong gói A.

## 8. Đã xét, không thấy

- **R (phần đã sửa):** bốn dòng R1 + hai dòng R2 ở mục 2, mỗi dòng có đột biến hoặc số đo; thêm các biến thể gần ở kịch bản 1–4, 9–11. Không dòng nào còn đường lỗi cũ.
- **E (edge case):** biên của luật D7 cùng ngày (ba cuộc gặp, dời ngày hai phía, khôi phục sai thứ tự); biên của cache (`MAX_KEYS`, tên rỗng, tên chỉ có chữ số, tên ngoài `LATIN`); biên của `readsBackAsIs` (chuỗi rỗng, FEFF đơn độc, FEFF ở cuối, surrogate ở đầu / giữa / cuối). Không thấy.
- **C (hợp đồng / spec):** `appointmentGroup` đúng golden `lich-hen.md` (bảng "Chưa ghi kết quả = Đã lên lịch, ngày **trước** hôm nay"); đột biến cho nó luôn `'planned'` làm đỏ đúng các ca golden A02/A03/A06/A08/A11–A13 của `appointment-counts.test.ts`. `TrashRow.code` đúng Q3 (a) của K41. `readsBackAsIs` đúng luật 12 của spec §6 và không đổi hành vi của `valueOf`. Không thấy lệch.
- **D (dữ liệu):** vòng xuất → nhập dữ liệu tải cho cùng hash `tables` với mốc G7; bốn file do exe ghi cũng vậy; 300 bước ngẫu nhiên không tạo trạng thái nào bước nạp từ chối. Không thấy.
- **G (guardrail AI):** gói A chỉ chạm nhãn model của `ai_analyses` (DR6-137) — `isLabel` siết thêm, không nới; `analysisLabelsFit` không đổi. Luật G5 không thuộc gói.
- **S (an toàn ranh giới):** `valueOf` vẫn là chỗ duy nhất dựng giá trị chèn từ file; không thêm đường đọc file / mạng. `sqlTexts` không đổi.
- **P (hiệu năng):** mục 6; `byName` là mục duy nhất có thay đổi và đã đo.
- **B (bloat):** mục 6; `tsc` với `noUnusedLocals` / `noUnusedParameters` sạch, codemap khớp, không dependency mới, diff ròng làm giảm một bản sao.
- **T (chất lượng test):** mỗi phần sửa có ít nhất một ca đỏ khi gỡ (DR6-135: 1; DR6-136: 3; DR6-137: 4; DR6-151: 1; T-350: 17). Nhánh `keys.clear()` của cache chỉ được giữ bởi ngưỡng phủ 100 % branch của `packages/domain` cộng ca `name-order.test.ts:94`; gỡ dòng `clear` thì ca vẫn xanh (thứ tự không đổi) nhưng ngưỡng phủ sẽ trượt — đúng cơ chế đã có, không phải lỗ.
- **A (trợ năng / i18n):** gói A không đổi chuỗi i18n; `TrashRow.code` chỉ vào tên nút qua `customer.withCode` (D/E). Không thấy.

## 9. Phụ lục

**Probe (đều trong `C:\workspace\deep-review-1-6-r5\deepseek\A\`):**

| File | Việc | Kết quả tệp |
|---|---|---|
| `probe-a1.mjs` → `probe-a1.json` | D7 cùng ngày qua xóa / sửa / hủy / khôi phục; mã KH ở Thùng rác; `appointmentGroup` + `appointmentCounts` | 5 khối, mọi giá trị như mục 4 |
| `probe-a2.mjs` → `probe-a2.json` | luật nhập 4 cho trạng thái cùng ngày; vòng xuất → nhập với U+FEFF; ma trận 38 cột chữ × 5 đột biến; nhập dữ liệu tải | `rule4 = BACKUP_INVALID rule 4`; `roundTrip.import = OK`; 38 dòng ma trận |
| `probe-a3.mjs` → `probe-a3.json` | `byName`: thứ tự so bản `2e51e25` (10 255 / 1 547 / 20 002 tên) và thời gian sắp | `equal = true` cả ba; 11,4 ms (cũ 64,0) |
| `probe-a4.mjs` → `probe-a4.json` | đi bộ ngẫu nhiên 300 bước, xuất + nhập sau mỗi bước | 84 bước áp được, `failureCount = 0` |
| `probe-a5.mjs` → `probe-a5.json` | dữ liệu tải: nhập, xuất, nhập lại, so hash; thời gian các lượt đọc của gói | hash `e256e4f1…`, `sameHash = true`, bảng thời gian mục 6 |
| `probe-a6.mjs` → `probe-a6.json` | `byName` so collator trần trên 1 393 tên thật | `sameAsBareCollator = true`, 0 cặp bằng nhau |
| `probe-a7.mjs` → `probe-a7.json` | biến thể gần của D7 (dời ngày hai phía, ba cuộc gặp) | như kịch bản 4 |
| `probe-a9.mjs` → `probe-a9.json` | mở 4 file `.db` do exe ghi, xuất backup, nhập lại | cả 4 `OK`, `same` = true |

**Đột biến đã chạy (tất cả đã khôi phục nguyên byte, kiểm bằng sha256 và `git status`):**

| Đột biến | File | Test đỏ | Kết quả |
|---|---|---|---|
| `date >= ?` → `date > ?` | `packages/db/src/customers.ts:445` | 1 (`appointments.test.ts` cùng ngày) | bị giết |
| `readsBackAsIs` bỏ luật U+FEFF | `packages/db/src/common.ts:97` | 4 (2 `ai-analyses`, 1 `backup-invariants`, 1 `common`) | bị giết |
| bỏ `code: row.code,` | `packages/db/src/trash.ts:134` | 1 (`trash.test.ts` E1) | bị giết |
| `key = name` (bỏ ánh xạ chữ số) | `packages/domain/src/name-order.ts:57` | 3 (`name-order.test.ts`, gồm ca `MAX_KEYS`) | bị giết |
| `appointmentGroup` luôn `'planned'` | `packages/domain/src/appointment-counts.ts:30` | 17 (9 `appointment-counts`, 5 `trash-view`, 3 `appointments-view`) | bị giết |
| Bản `2e51e25` dựng lại trong probe (không gỡ gì trong repo) | `probe-a3.mjs` | không test nào (hành vi không đổi) | sống về test; đo 64,0 ms — đây là chi phí mà bản sửa bỏ đi |

**Bản chép gốc để khôi phục:** `customers.ts.orig`, `common.ts.orig`, `trash.ts.orig`, `name-order.ts.orig`, `appointment-counts.ts.orig` trong cùng thư mục; mọi sha256 sau khôi phục trùng giá trị trước đột biến (`customers.ts` `c5181012…`, `common.ts` `39e8e489…`, `trash.ts` `ebc9678a…`, `name-order.ts` và `appointment-counts.ts` trùng `git status` rỗng).

**Chạy nền:** không có lệnh nào chạy nền ở gói này.

**`git status --short` cuối phiên:** rỗng; `git rev-parse HEAD` vẫn `37a80b6`.

**Giờ xong:** 05/11/2026 10:38 +07:00.
