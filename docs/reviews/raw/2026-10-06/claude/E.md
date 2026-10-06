# Deep review Phase 1–4 — gói E (`routes/appointments`, `routes/customers`) — Claude

- **SHA:** `f0c53eb57eb7eac8665ad87287e794ae4c5bc43b` (`git rev-parse HEAD` kiểm đầu phiên trong `C:\workspace\Project-2C-review`, detached). Cuối phiên `git status` sạch: không sửa file, không commit; mọi build / test tạm ghi ra `C:\workspace\deep-review-1-4\claude\E\` (build web có mutation ở `E\dist-mut`, kết quả Playwright ở `E\pw-out`, cache Vite riêng `E\.vite-*`).
- **Ngày / máy:** 05/10/2026, `hostname` = `D13_ThinkPad`. Một phiên Claude sạch, không subagent.
- **Prompt:** prompt dán còn sót "§4 dòng gói A" và "ID `CL-D<số>`"; mọi chỗ khác ghi gói E (thư mục `claude\E\`, file `E.md`). Phiên này làm **gói E** theo dòng E của §4 và đánh ID **`CL-E<số>`** (theo §7: `CL-<gói><số>`), để không trùng ID của gói D.
- **Nguồn ngoài repo đã đọc:** `common\README.md`, `baseline.md`, `known.md`, `common\load\load-backup.json`, `load-summary.json`; `claude\A.md`, `B.md`, `C.md`, `D.md` (danh sách phát hiện, "đã xét" và ghi chú "cho gói E"). Dùng lại bản exe release gói D đã build ở cùng SHA (`claude\D\exe`), **chép sang** `claude\E\exe` kèm file dữ liệu tải đã nhập, không chạy bản của D. **Không mở / liệt kê / tìm trong `codex\`.**

## 1. Phạm vi đã đọc

| Vùng | File (dòng) | Cách đọc |
|---|---|---|
| `routes/appointments` (SP 2 956 dòng) | `appointments-view.ts` 1–409; `AppointmentsScreen.tsx` 1–667; `AppointmentDialog.tsx` 1–443; `appointment-form.ts` 1–119; `OutcomeDialog.tsx` 1–316; `outcome-form.ts` 1–132; `MetFields.tsx` 1–164; `EditOutcomeDialog.tsx` 1–246; `RescheduleFields.tsx` 1–142; `RescheduleDialog.tsx` 1–61; `DeleteAppointmentDialog.tsx` 1–101; `YearGrid.tsx` 1–145; `FailureAlert.tsx` 1–11 | đọc từng dòng |
| `routes/customers` (SP 2 589 dòng) | `customers-view.ts` 1–148; `CustomersScreen.tsx` 1–254; `CustomerProfile.tsx` 1–207; `CustomerAppointments.tsx` 1–153; `CustomerDialogs.tsx` 1–385; `CustomerKyc.tsx` 1–264; `KycDialogs.tsx` 1–362; `kyc-view.ts` 1–216; `PolicyDialogs.tsx` 1–362; `policy-form.ts` 1–129; `CustomerPolicies.tsx` 1–109 | đọc từng dòng |
| Test unit gói E (1 570 dòng) | `appointments-view.test.ts`, `appointment-form.test.ts`, `outcome-form.test.ts`, `MetFields.test.ts`, `customers-view.test.ts`, `kyc-view.test.ts`, `policy-form.test.ts` | cấu trúc `describe/it` toàn bộ; đọc đoạn quanh mọi mutation sống (`appointment-form.test.ts` 50–97, `policy-form.test.ts` 96–125, `kyc-view.test.ts` 33–68); đánh giá bằng 93 mutation |
| e2e của gói E | tên mọi test của `appointments`, `appointment-outcome`, `customers`, `customer-forms`, `customer-appointments`, `customer-kyc`, `customer-policies` `.spec.ts`; `appointment-outcome.spec.ts` 128–166; `playwright.config.ts`, `e2e/serve.mjs` | đánh giá bằng 23 mutation chạy e2e thật (19 TSX + 4 con sống của unit) |
| Hợp đồng nơi khác (chỉ để kiểm) | `packages/db/src/appointments.ts` 80–479; `customers.ts` 80–95, 199–235; `policies.ts` 19–28; `packages/ui/src/components/compare-cells.ts` 1–43; `packages/domain/src/stats.ts` 28–86, `kyc-catalog.ts` 27–47; `apps/desktop/src/i18n/index.ts` 1–113 + mọi key của gói E trong `vi.ts`; `vitest.config.ts`; `tokens.css` | đọc đoạn |
| Mockup | `customer.html` 300–380 (dòng thời gian, bảng lịch hẹn), `appointment-forms.html` 400–470 (6h, 6i), `customer-forms.html` 132–175 (5c) | đối chiếu nhãn |

Lệnh / công cụ đã chạy: 7 file test unit của gói E (106 test, xanh) dưới `TZ` = Pacific/Honolulu, Pacific/Kiritimati, America/Los_Angeles và `--sequence.shuffle` seed 7, 99 (đều 106/106); coverage gói E **tính cả `*-form.ts`** (ngoài `coverage.include`); 93 mutation unit (phụ lục A); 23 mutation trên e2e + 1 lượt nền xanh (phụ lục B); 7 probe Vitest trên dữ liệu tải / lịch sử dựng tay (phụ lục C); exe release (WebView2 Edg/154, cổng debug 9334) với dữ liệu tải: đo bấm ngày, CPU profile, tái hiện CL-E2 / CL-E3 trên UI, đọc cây trợ năng; tính tương phản; quét export / chuỗi cứng.

## 2. Phát hiện

### CL-E1

```
ID: CL-E1
Mức: Low
Trục: P
Vị trí: apps/desktop/src/routes/appointments/appointments-view.ts:319-353 (monthGrid, vòng 343-347) · nơi gọi AppointmentsScreen.tsx:363 (useMemo theo day, rows, period, today), 282 (f0c53eb)
Tình trạng: CONFIRMED (số đo Node + exe + CPU profile)
```

**Mô tả.** `monthGrid` duyệt **mọi** lịch hẹn trong góc nhìn (toàn bộ lịch sử, không chỉ tháng đang xem) cho **mỗi** ô của lưới tháng: 42 ô × 10 434 lịch = 438 000 lần `compareDates`. Hàm chạy lại mỗi lần bấm một ngày (đổi `day`) và sau mỗi lệnh ghi (`rows` mới). Chi phí tăng tuyến tính theo số năm dữ liệu, vì `listAppointments` đọc mọi năm.

**Số đo** (dữ liệu tải, kỳ Tháng 10/2026):

| Đo | Toàn bộ (10 434 lịch) | Team (2 595 lịch) |
|---|---|---|
| `monthGrid` (Node, median 9 lượt, `probe-perf`) | **23,02 ms** | 7,28 ms |
| Cùng phép đếm nhưng gom lịch theo ngày một lượt (`monthGridIndexedBaseline`) | 0,22 ms | — |
| `dayBoard` cùng lúc | 0,92 ms | 0,24 ms |
| Bấm một ngày trong exe, tới khung hình kế (`perf-dayclick.js`, 5 lượt × 6 ngày, có gắn CDP; `perf-dayclick.result.json`) | **31–77 ms, trung vị 46 ms** | 11–29 ms, trung vị 17 ms |
| CPU profile 8 lần bấm ngày trong exe (`profile-dayclick.mjs`; lượt này 31–36 ms / lần) | `fw` (= `monthGrid` đã minify, khớp nguồn theo đoạn bundle in ra) **152 ms tự thân / 229 ms bận**, GC 27 ms | — |

Tức khoảng hai phần ba thời gian CPU của một lần bấm ngày là `monthGrid`. (Các lượt đo exe dao động theo lúc chạy, kể cả khi khởi động lại exe; số Node ổn định hơn.) Tổng phần view thuần của màn sau một lệnh ghi ở góc nhìn Toàn bộ (`perWriteAllMonth`) là 29,2 ms, trong đó `monthGrid` 23 ms; phần này nằm trong 205–266 ms mỗi lệnh ghi đầu-cuối đã đo ở CL-D7.

**Ảnh hưởng.** TL / BDM xem Lịch hẹn ở góc nhìn Toàn bộ: mỗi lần bấm ngày trên lịch tháng khựng hai đến bốn khung hình; sau mỗi năm dữ liệu thêm chừng ấy nữa (≈ 7 000 lịch / năm ở dữ liệu tải).

**Đề xuất.** Trong `monthGrid`, gom `rows` theo ngày một lượt (chỉ các ngày trong khoảng của lưới), rồi điền 42 ô từ bảng đó: O(N + 42). Không đổi API, test hiện có giữ nguyên. Cỡ ≈ 15 dòng SP. Tiêu chí: `monthGrid` Toàn bộ trên dữ liệu tải ≤ 2 ms (Node); bấm ngày trong exe ≤ 16 ms.

### CL-E2

```
ID: CL-E2
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx:103-106 (latest = transitions.findLast(customer)) · packages/db/src/appointments.ts:209-216 (editMeetingOutcome rút transition của cuộc gặp rồi gắn lại ở ngày mới) · packages/db/src/customers.ts:206-210 (appendTransition so với transition mới nhất còn lại) · apps/desktop/src/i18n/vi.ts:239 (f0c53eb)
Tình trạng: CONFIRMED (probe lệnh + tái hiện trên UI exe)
```

**Mô tả.** Hộp 6f "Sửa kết quả cuộc gặp" của một cuộc gặp đã gây ra lần đổi nhóm **mới nhất** của KH (chưa bị khóa D7): đổi ngày cuộc hẹn về trước lần đổi nhóm liền trước đó thì lệnh từ chối `TRANSITION_BEFORE_LATEST` (đúng), nhưng câu báo lấy ngày từ `transitions.findLast(...)` — chính transition của cuộc gặp này, tức **ngày cũ của cuộc gặp** — chứ không phải ngày của lần đổi nhóm đã chặn. Câu "Ngày chuyển trước lần đổi nhóm gần nhất (‹ngày cũ›)" vì vậy chỉ sai mốc.

**Tái hiện.**
- `probe-editdate.test.ts` (dữ liệu tải, 1 015 KH có dạng này): KH K-QR0X, cuộc gặp 25/08/2026 (N3 → Tạm hoãn), lần đổi nhóm trước đó 23/01/2026. Gõ ngày 22/01/2026 → `TRANSITION_BEFORE_LATEST`, câu hiện "Ngày chuyển trước lần đổi nhóm gần nhất (25/08/2026)."; gõ 24/01/2026 (vẫn trước 25/08) → lưu được.
- Exe, dữ liệu tải (`editdate-ui.mjs`, `editdate-alert.mjs`; ảnh `editdate-alert.png`): Lịch hẹn → 25/08/2026 → Võ Thị Thảo → "Sửa kết quả" → Ngày cuộc hẹn 22/01/2026 → Lưu → hộp đỏ "Ngày chuyển trước lần đổi nhóm gần nhất (25/08/2026)." ngay trên ô ngày đang ghi 22/01/2026; gõ 24/01/2026 thì gợi ý "N3 → Tạm hoãn ngày 24/01/2026" (hợp lệ). Không lưu gì (lần lưu bị từ chối, rồi Hủy).
- Không e2e nào kiểm câu báo `TRANSITION_BEFORE_LATEST` ở ba hộp có nó (6c, 6f, 5d): mutation TSX T10, T13, T14 (bỏ ngày khỏi câu) đều sống (phụ lục B).

**Ảnh hưởng.** RE muốn dời ngày một cuộc gặp nhập nhầm về sớm hơn: đọc câu báo thì tưởng không được về trước ngày cũ của chính cuộc gặp, trong khi mọi ngày từ 23/01 trở đi đều được. Không sai dữ liệu.

**Đề xuất.** Để db mang ngày chặn trong lỗi: `appendTransition` ném `DbError('TRANSITION_BEFORE_LATEST', { date: formatDate(latest.date) })` và `errorMessage` dùng `error.params` khi có; bỏ ba cách tính "ngày mới nhất" riêng ở UI (`OutcomeDialog.tsx:117-124` lấy max theo ngày, `EditOutcomeDialog.tsx:104` lấy transition cuối, `CustomerDialogs.tsx:315` dùng `since`). Thêm một test (unit db + e2e 6f) cho ca trên. Cỡ ≈ 20 dòng SP + 30 dòng test.

### CL-E3

```
ID: CL-E3
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/customers/CustomersScreen.tsx:80-85 (cột "Ngày sinh", kind 'text', value = birthLabel) · packages/ui/src/components/compare-cells.ts:13-17 (text: Intl.Collator vi, numeric) (f0c53eb)
Tình trạng: CONFIRMED (probe Node + exe)
```

**Mô tả.** Cột "Ngày sinh" của bảng Khách hàng sắp theo **chuỗi hiển thị** ("12/03/1984" hoặc "1984") với collator có `numeric: true`. Ngày đủ được so từ số ngày trong tháng ("12" < "1984"), nên sắp tăng dần ra theo ngày-tháng chứ không theo ngày sinh, và mọi KH chỉ có năm sinh dồn về một đầu.

**Tái hiện.**
- `probe-labels.test.ts` (dữ liệu tải, 1 395 KH có ngày sinh: 905 ngày đủ, 490 chỉ năm), sắp bằng đúng `compareCellsThen('text', …)` của DataTable: 10 dòng đầu "01/01/1961, 01/01/1969, 01/02/1969, 01/02/1974, 01/03/1978, 01/03/1983, 01/03/1991, 01/03/1992, 01/04/1969, 01/05/1977"; 5 dòng cuối "2000" × 5; **270 cặp dòng kề nhau sai thứ tự ngày**.
- Exe (`birth-sort-ui.mjs`, ảnh `birth-sort-ui.png`): Khách hàng → Toàn bộ → Bảng → bấm "Ngày sinh": sau 101 KH không có ngày sinh (ô trống, đứng đầu — đúng) là cùng 8 dòng như trên; bấm lần nữa (giảm dần): 8 dòng "2000".

**Ảnh hưởng.** Ai sắp bảng Khách hàng theo ngày sinh (tìm KH lớn / nhỏ tuổi) nhận thứ tự vô nghĩa. Trái quy tắc "nhãn UI hiểu theo nghĩa thường".

**Đề xuất.** Giữ ô hiển thị `birthLabel`, nhưng `value` là khóa sắp theo năm rồi ngày (vd. `yyyy` hoặc `yyyy-mm-dd`; với collator numeric "1984" < "1984-03-12"), hoặc một hàm khóa trong `customers-view.ts` có unit test. Cỡ ≤ 15 dòng SP + test.

### CL-E4

```
ID: CL-E4
Mức: Low
Trục: T
Vị trí: unit — appointment-form.ts:69, 114 · outcome-form.ts:95-96 · policy-form.ts:58, 77, 90-95 · kyc-view.ts:58 · customers-view.ts:69, 121; TSX — AppointmentsScreen.tsx:113, 658; YearGrid.tsx:54; RescheduleFields.tsx:28-29; CustomerProfile.tsx:88; CustomerAppointments.tsx:133-136; CustomerPolicies.tsx:64-65; vitest.config.ts:19-20 (coverage.include chỉ `routes/**/*-view.ts`) (f0c53eb)
Tình trạng: CONFIRMED (93 mutation unit + 23 mutation chạy e2e thật, phụ lục A, B)
```

**Mô tả.** Các mutation dưới đây đổi hành vi thấy được mà test vẫn xanh.

*Unit (93 lượt, 78 bị bắt, 15 sống)* — sống mà có nghĩa:
- **OF7** `withoutError` không bỏ lỗi: hàm không có test nào (coverage `outcome-form.ts:96`) và **e2e cũng không bắt** (lượt U3): lỗi "Chọn nhóm sau cuộc gặp" / "Nhập việc tiếp theo" ở 6c / 6f sẽ đứng nguyên sau khi đã sửa ô.
- **PF4** mức "Ảnh hưởng chỉ số" (8d) tính từ FYP **nộp** thay vì FYP phát hành đã lưu: test có FYP phát hành = FYP nộp nên không phân biệt được; **e2e cũng không bắt** (lượt U4). **PF3** cùng tháng khác năm vẫn coi là "cùng tháng": không có ca. **PF8** HĐ vẫn được dựng khi ô FYP phát hành sai. **PF2** biên "phát hành trước ngày nộp **một** ngày" không có ca.
- **KV2** một hạng mục có cả mâu thuẫn trường cốt lõi lẫn trường phụ (vd. FAMILY: `maritalStatus` cốt lõi + `dependents` phụ) hiện "Mâu thuẫn phụ" màu cảnh báo: test chỉ có hạng mục toàn cốt lõi hoặc toàn phụ.
- **AF5** `parseTime` nhận "24:00" (test thử "25:00"): ô giờ không báo, db từ chối `INVALID_TIME` khi lưu.
- Nhỏ: AF15 (không trim ô tìm KH), CV3 (bỏ sắp tên khi cùng ngày trên kanban), CV9 (ngày sinh = hôm nay bị từ chối). KV6 → CL-E6.
- Sống nhưng e2e bắt: AF1 (biên "hôm qua" của chế độ từ hôm nay — lượt U2 đỏ), AF3 (`withTime` — lượt U1 đỏ). Tương đương: AV6, PF7 (xem "đã xét" T).

*TSX trên e2e (19 lượt, 9 bị bắt, 10 sống; chỉ chạy spec liên quan):*
- **T7** bỏ chặn "Ngày giờ mới trùng lịch cũ" ở Dời lịch: e2e xanh, và lệnh `rescheduleAppointment` (`appointments.ts:225-242`) không kiểm lại → lịch thay thế trùng ngày giờ lịch cũ, còn lịch cũ thành "Dời lịch" và bị đếm vào nhóm dời / hủy / không đến. Luật này chỉ ở TSX, không lớp test nào giữ.
- **T2** nút "Tạo lịch hẹn tiếp theo" hiện cả cho lịch tương lai (mockup 6h: chỉ lịch đã qua).
- **T6** tổng quý của lưới năm chỉ cộng "đã gặp".
- **T5** danh sách không đảo thứ tự gốc: sau khi bấm bỏ sắp (↓ → không sắp) danh sách ra cũ nhất trước, và hai lịch cùng ngày cùng giờ đổi chỗ.
- **T16** "từ ‹ngày›" ở hồ sơ KH và phụ đề hộp Chuyển nhóm lấy lần đổi nhóm **đầu tiên**; **T17** dòng "n lịch · m đã gặp" của bảng lịch hẹn hồ sơ ra 0 đã gặp; **T19** danh sách HĐ cũ nhất trước.
- **T10 / T13 / T14** bỏ ngày khỏi câu `TRANSITION_BEFORE_LATEST` ở 6c / 6f / 5d (→ CL-E2).

*Coverage:* `coverage.include` chỉ đo `routes/**/*-view.ts`; ba file `*-form.ts` (380 dòng logic thuần, có unit test) không được đo — tính vào thì vùng `routes/**` rơi xuống Stmts 98,73 % / Funcs 97,05 %, dưới ngưỡng 99 % (`withoutError` và một nhánh `withTime` chưa phủ).

**Ảnh hưởng.** Chưa có lỗi người dùng (trừ CL-E2 / CL-E6 đã nêu riêng). Một lần sửa các chỗ trên — nhất là T7 (dữ liệu lịch trùng) và OF7 / PF4 (câu chữ của hộp thoại) — qua được `pnpm verify` lẫn e2e.

**Đề xuất.** Thêm ≈ 10 ca unit (OF7, PF2–PF4, PF8, KV2, AF5, AF15, CV3) và vài khẳng định e2e: 6e từ chối ngày giờ trùng (hoặc chuyển luật "khác lịch cũ" vào `rescheduleAppointment` để db giữ), không có "Tạo lịch hẹn tiếp theo" cho lịch tương lai, tổng quý, "từ ‹ngày›" của hồ sơ, dòng "m đã gặp", thứ tự HĐ. Thêm `apps/desktop/src/routes/**/*-form.ts` vào `coverage.include`. Cỡ ≈ 80 dòng test (+ ≤ 10 dòng SP nếu đưa luật T7 vào db).

### CL-E5

```
ID: CL-E5
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:424 (Dot aria-hidden), 482-503 (DayButton: aria-label chỉ có tổng) · YearGrid.tsx:92-96 (aria-label chỉ có tổng), 109-114 (thanh nhóm aria-hidden), 125-128 (số từng nhóm chỉ ở title) (f0c53eb)
Tình trạng: CONFIRMED (cây trợ năng trong exe)
```

**Mô tả.** Ô ngày của lịch tháng và ô tháng của lưới năm cho người nhìn thấy số lịch **theo từng nhóm** (chấm màu: chưa ghi kết quả / dời–hủy–không đến / đã gặp / dự kiến; thanh màu có số), nhưng tên trợ năng của nút chỉ có tổng; chấm và thanh đều `aria-hidden`, số từng nhóm của thanh chỉ nằm trong `title` (chỉ hiện khi rê chuột). Lịch tháng cũng là 31 điểm dừng Tab liền nhau (mỗi ngày một nút, không có phím mũi tên).

**Bằng chứng** (`aria-calendar.mjs`, exe, dữ liệu tải): nút ngày 04/10/2026 có tên "04/10/2026: 1 lịch hẹn", chấm `bg-ok` không đọc được; nút "Tháng 9/2026: 717 lịch" trong khi thanh hiện 566 đã gặp + 151 dời / hủy / không đến (chỉ trong `title`); `calendarTabStops` = 31.

**Ảnh hưởng.** Người dùng trình đọc màn hình không biết ngày / tháng nào còn lịch "chưa ghi kết quả" — chính tín hiệu mà thứ tự chấm (`DOT_ORDER`, "unrecorded first") được thiết kế để làm nổi. Khác KNOWN #156 (ô ngoài tháng / ngoài khoảng bị `aria-hidden`).

**Đề xuất.** Đưa số từng nhóm khác 0 vào `aria-label` (một key i18n dạng "{date}: {count} lịch hẹn — {parts}"), cùng cho `MonthButton`; tùy chọn: roving tabindex + phím mũi tên cho lưới ngày như `Segmented`. Cỡ ≤ 30 dòng SP + i18n.

### CL-E6

```
ID: CL-E6
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/customers/kyc-view.ts:91-106 (meetingEvents) · test kyc-view.test.ts:122 (f0c53eb)
Tình trạng: CONFIRMED (probe trên lịch sử dựng tay; dữ liệu tải không có ca này)
```

**Mô tả.** Dòng thời gian đánh "Lịch hẹn lần n" cho lịch đã gặp **và** lịch còn ở trạng thái Dự kiến với n = số lần đã gặp trước nó + 1, nên hai lịch khác nhau có thể cùng số: hai lịch dự kiến liên tiếp, hoặc một lịch quá ngày chưa ghi kết quả rồi một lịch đã gặp sau nó.

**Tái hiện** (`probe-timeline.test.ts`): [Đã gặp 01/09, Dự kiến 10/10, Dự kiến 20/10] → "lần 1, lần 2, lần 2"; [Đã gặp 01/08, Dự kiến 01/09 (chưa ghi kết quả), Đã gặp 10/09] → "lần 1, lần 2, lần 2". Dữ liệu tải: 0 / 1 376 KH có số trùng (`probe-labels`), vì seed không tạo hai dạng này; qua UI thì tạo được (đặt hai lịch tương lai cho một KH; hẹn bù một ngày đã qua). Mutation KV6 (đánh số cả lịch dự kiến) sống: test không có ca này.

**Ảnh hưởng.** Hai dòng "Lịch hẹn lần 2" khác nhau trên hồ sơ KH, trái nghĩa thường của nhãn. Mockup chỉ có một lịch dự kiến ("Lịch hẹn lần 4 · dự kiến" sau 3 lần gặp) nên không mâu thuẫn trực tiếp.

**Đề xuất.** Owner chốt một trong hai: chỉ đánh số lịch đã gặp (lịch dự kiến / chưa ghi kết quả là "Lịch hẹn"), hoặc đánh số tiếp nhau theo ngày (lịch dự kiến thứ hai là n + 1). Thêm ca vào `kyc-view.test.ts`. Cỡ ≤ 10 dòng SP + test.

### CL-E7

```
ID: CL-E7
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/customers/CustomersScreen.tsx:179-181 ({board.open[stage].length} in thẳng) — đối chiếu dòng 236 (cột đã đóng dùng formatCount) (f0c53eb)
Tình trạng: CONFIRMED (đọc code; dữ liệu tải chưa tới ngưỡng: cột lớn nhất N4 = 364)
```

**Mô tả.** Số KH đầu mỗi cột kanban N4 → N1 in số thô, còn hai khối đã đóng và mọi chỗ trống `{count}` của i18n nhóm nghìn bằng `formatCount`. Từ 1 000 KH một cột, cột mở hiện "1234" cạnh "1.234" của cột đã đóng.

**Ảnh hưởng.** Chỉ ở góc nhìn Toàn bộ của văn phòng lớn (dữ liệu tải: N4 364, Tạm hoãn 344 sau 14 tháng — khối đã đóng tăng mãi).

**Đề xuất.** `formatCount(board.open[stage].length)`. 1 dòng.

### CL-E8

```
ID: CL-E8
Mức: Nit
Trục: B
Vị trí: apps/desktop/src/routes/customers/CustomerDialogs.tsx:222, 339 · KycDialogs.tsx:156, 326 · PolicyDialogs.tsx:200, 354 · so với appointments/FailureAlert.tsx:5-10 (f0c53eb)
Tình trạng: CONFIRMED (grep)
```

**Mô tả.** Hộp lỗi đỏ `<p role="alert" className={`${ALERT} border-danger text-danger`}>` chép tay 6 lần trong `routes/customers`, trong khi `FailureAlert` (11 dòng) làm đúng việc đó và 5 hộp thoại Lịch hẹn đã dùng. Cùng kiểu: hàm `edit` "đặt giá trị rồi xóa lỗi lưu" viết lại ở `AppointmentDialog.tsx:103`, `OutcomeDialog.tsx:82`, `EditOutcomeDialog.tsx:81` (ba bản giống hệt).

**Ảnh hưởng.** Không lỗi. Đổi cách hiện lỗi (vd. focus vào hộp lỗi, CL-D2) phải sửa 7 chỗ. Khác KNOWN #141 (ba helper `badge`).

**Đề xuất.** Chuyển `FailureAlert` ra chỗ chung của `routes` và dùng ở 6 chỗ; `edit` thành một hook nhỏ. Cỡ ≈ −20 dòng.

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | P | B | T | A | S | Tổng |
|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | 0 |
| High | | | | | | | | | 0 |
| Medium | | | | | | | | | 0 |
| Low | | 2 (E2, E3) | | 1 (E1) | | 1 (E4) | | | 4 |
| Nit | | 1 (E6) | | | 1 (E8) | | 2 (E5, E7) | | 4 |
| **Tổng** | 0 | 3 | 0 | 1 | 1 | 1 | 2 | 0 | **8** |

Tình trạng: 8/8 CONFIRMED (probe, số đo, mutation hoặc tái hiện trên exe). CL-E6 tái hiện trên lịch sử dựng tay (dữ liệu tải không có ca này); CL-E7 xác nhận bằng đọc code, dữ liệu tải chưa tới ngưỡng 1 000 — cả hai ghi rõ trong khối. Không có PLAUSIBLE.

**Nhận định chung gói E:** hai màn và các hộp thoại đi đúng lệnh db (mỗi thao tác một lệnh, một transaction) và khớp nhãn / mockup ở mọi chỗ đã đối chiếu, trừ ba chỗ ra chữ sai nghĩa (CL-E2 mốc ngày trong câu báo, CL-E3 thứ tự cột "Ngày sinh", CL-E6 số lần hẹn trùng). Không thấy đường nào làm mất / sai dữ liệu. Điểm nghẽn hiệu năng riêng của gói là `monthGrid` (CL-E1); phần còn lại của chi phí mỗi lệnh ghi đã có ở CL-B8 / CL-D7. Test unit của các file thuần tốt (78 / 93 mutation bị bắt); phần TSX (≈ 79 % số dòng SP: 4 392 / 5 545) chỉ có e2e giữ, và e2e bỏ sót các nhánh "không được hiện" / câu báo lỗi (CL-E4).

## 4. KNOWN và phát hiện gói trước có liên quan

- **KNOWN #156** (ô ngoài tháng / ngoài khoảng `aria-hidden`): không có gì mới; CL-E5 là chỗ khác (ô chọn được thiếu số theo nhóm).
- **KNOWN #163 / #165** (6a nhóm trước → sau bằng chữ, RF không tô accent, 6h hiện "Các lần hẹn trước", e2e chưa kiểm "Xem tất cả (n)"): không có bằng chứng mới; mutation T2 (phụ lục B) cho thấy thêm một chỗ e2e của 6h không kiểm (nút "Tạo lịch hẹn tiếp theo" hiện cả cho lịch tương lai mà vẫn xanh).
- **KNOWN #141** (Khách hàng: dòng "Sau khi lưu" thiếu "hạ / lên nhóm", khối "Chuyển tay…" hiện cả khi đã đóng, `INVALID_TRANSITION`, `CLOSED_STAGES.includes` lặp, `StageBadge` dựng tay, ba helper `badge`): còn nguyên, không có gì mới.
- **ACCEPTED** "ngày được chọn của Lịch hẹn không tự nhảy qua nửa đêm", "không cây Team → RE", "hộp xóa 3 dòng cả cho Hủy / Không đến": còn đúng như mô tả.
- **CL-A7** (`inScope` dựng lại matcher cho từng bản ghi) — gói A nhờ gói E đo ở màn: `appointmentRows` góc nhìn Team 7,35 ms so với Toàn bộ 3,16 ms trên dữ liệu tải (phần chênh ≈ 4 ms là `inScope`), một lần mỗi lệnh ghi; `customerBoard` Team 1,77 ms. Không nâng mức.
- **Ghi chú gói A** (`monthGrid` 42 × số lịch): đã đo → CL-E1. (`appointment-form.ts:70` tự parse giờ): xem "đã xét" trục C.
- **Ghi chú gói B** (`appointments-view.ts:266-267` tìm lịch dời bằng `find`): chỉ chạy cho lịch đang chọn, 0,15 ms — không thành phát hiện. (`CustomerAppointments.tsx:74-77` dựa vào thứ tự giờ của `listAppointments`, CL-B6 AP12): cột Ngày của bảng có `thenBy` giờ nên sắp mặc định không phụ thuộc; chỉ còn hai lịch cùng ngày cùng giờ dựa vào thứ tự `id`.
- **CL-B10** (sắp tên theo BINARY của SQLite) — thêm nơi trong gói E dùng thẳng thứ tự db: bộ lọc "Phối hợp" (`AppointmentsScreen.tsx:138-140`) và ô tìm KH của hộp 6a (`searchCustomers`, doc ghi "by name", chỉ lấy 6 kết quả đầu). Trên dữ liệu tải không thấy khác biệt (không người phối hợp nào tên bắt đầu bằng "Đ"; truy vấn "thảo" 55 KH: 6 kết quả đầu trùng thứ tự `Intl.Collator('vi')`, `probe-order`).
- **CL-D2 / CL-D3** (`autoFocus` không ăn, focus rơi về `body`): đã nêu với ví dụ là hộp của gói E (Hẹn tiếp, Phát hành HĐ, Dời lịch); không báo lại. Hộp KYC mở chồng lên hộp 6c (`OutcomeDialog.tsx:270-277`) cũng chịu CL-D3 khi đóng.
- **CL-D7 / CL-B8** (DataTable không ảo hóa; đọc lại toàn bảng mỗi lệnh ghi): là phần lớn chi phí mỗi lệnh ghi ở Lịch hẹn / Khách hàng; CL-E1 là phần riêng của lịch tháng.

## 5. Đã xét, không thấy

- **E — Edge case:**
  - Lưới tháng / năm: tuần qua năm, tháng 6 tuần, tháng bắt đầu Thứ Hai, ngày sau 31/12/2100, dải tuần / Tùy chọn qua tháng — có test và 8 mutation `monthGrid` / `yearGrid` / `pickDay` đều bị bắt (AV17–AV24).
  - Dời lịch: chuỗi A → B → C cho "Dời từ / Dời sang" đúng (đọc `outcomeResolver` + `rescheduleLinks`); lịch thay thế bị xóa thì lịch cũ chỉ còn "Dời lịch" (đúng ý ACCEPTED #171). Ngày giờ mới trùng lịch cũ bị chặn (`same`, chỉ ở TSX, không test nào giữ → CL-E4 T7).
  - Giờ: `parseTime` nhận "9:30" → "09:30", từ chối "25:00", "12:60", "1400", "12:5", số toàn chiều rộng (`\d` không cờ `u`); db kiểm lại bằng regex riêng, hai luật khớp sau khi đệm 0. Biên "24:00" thiếu test → CL-E4.
  - Ngày nhập nhanh: qua `parseQuickDate` (gói A; "29/02" cuối năm là CL-A4). Chế độ `fromToday` (6h, hẹn tiếp trong 6c) từ chối ngày đã qua; biên "hôm qua" không có ca unit (mutation AF1 sống ở unit) nhưng e2e 6h bắt được (lượt U2).
  - Rỗng: không lịch trong ngày ("Không có lịch hẹn trong ngày."), KH không lịch hẹn, không HĐ, chưa có phiên bản KYC đều có chuỗi riêng (đọc code + e2e "a customer without appointments says so"). Mọi KH có transition đầu nên `since.get(...)!` / `transitions.at(-1)!` không rỗng (luật nhập backup cũng đòi).
  - Chuỗi: tìm KH bỏ dấu, `đ`, hoa thường, theo mã (mutation AF11–AF13 bị bắt); tên dài `truncate` ở Trong ngày / kanban; ghi chú nhiều dòng `whitespace-pre-line`.
  - Số ≥ 1 000: mọi `{count}` qua `COUNT_SLOTS`, trừ cột kanban → CL-E7.
  - Múi giờ / thứ tự: test gói E không đọc ngày hệ thống (không `Date.now` / `new Date(`), xanh dưới 3 múi giờ và 2 seed xáo thứ tự.
  - Hai thao tác chồng nhau: mỗi lần lưu là một `app.run` đồng bộ rồi đóng hộp, React xả cập nhật trước sự kiện kế nên Enter hai lần không tạo đôi; hộp KYC mở chồng trên 6c lưu riêng theo mockup 6c → 7a và không đụng lịch hẹn.
- **C — Đúng hợp đồng:**
  - Đối chiếu UI ↔ lệnh db: `outcomeChoices` ↔ `INVALID_STATUS` / `OUTCOME_IN_FUTURE` / `APPOINTMENT_NOT_SCHEDULED`; `readOutcome` ↔ `outcomeFields` (`OUTCOME_REQUIRED`, `STAGE_AFTER_NOT_ALLOWED`, `REVIEWER_NOT_ALLOWED`, `requireAmount`); khóa D7 (`outcomeLock`) ↔ rút / gắn lại transition trong `editMeetingOutcome`; `readPolicy` ↔ FYP > 0, phát hành ≥ nộp, ≤ hôm nay; `parseBirthDate` / `parseRecordDate` ↔ `toPastIsoDate`; xem trước KYC (`previewKycNote`, `useKycPreview`) dùng chính hàm domain / db mà lệnh ghi dùng. Chỗ lệch duy nhất là câu báo CL-E2.
  - Hai chỗ cùng tính một số: dòng tóm tắt ↔ lịch tháng ↔ danh sách ↔ dải RE ↔ lưới năm (cùng `appointmentGroup`, cùng `rows`; e2e "the list matching the summary", "numbers in the strip follow the period"); "Đã có HĐ (n)" hồ sơ ↔ "n HĐ" kanban (cùng `listPolicies`); "từ ngày" hồ sơ ↔ kanban (transition cuối theo `seq`); "Lần gặp thứ n" (6a) ↔ "Lịch hẹn lần n" (dòng thời gian) cho lịch dự kiến đầu tiên. Ngoại lệ: CL-E6.
  - Nhãn theo nghĩa thường: "Chưa ghi kết quả" = dự kiến trước hôm nay, "Các lần hẹn trước" = tới hôm nay (Owner 29/09), "Hẹn tiếp" chỉ cho lịch tới hôm nay, "Ghi kết quả" cho lịch tương lai chỉ mở Dời lịch / Hủy (Owner 29/09) — đúng. Mã cổng KYC (`KYC_INSUFFICIENT`…) và chip `birthYear = 1984` hiện thô là đúng mockup (`customer.html:397`, `customer-forms.html:162`). Ngoại lệ: CL-E3.
  - `parseTime` ở UI (ghi chú gói A): quy tắc "chỉ dùng hàm chuẩn trong domain" nói tiền / ngày / chỉ số; giờ trong ngày chỉ parse ở một chỗ (`appointment-form.ts:65-71`, dùng chung cho 4 hộp) và db kiểm lại — không thấy lệch, không thành phát hiện (nếu Phase 5 cần giờ ở nơi khác thì chuyển vào domain).
  - Sau "Lưu kết quả + tạo lịch" màn giữ chi tiết ở lịch vừa ghi, không nhảy sang lịch mới: đúng như e2e `appointment-outcome.spec.ts:128-150` cố ý kiểm.
- **D — Dữ liệu:** 12 chỗ ghi của gói E (`AppointmentDialog:114`, `DeleteAppointmentDialog:35`, `EditOutcomeDialog:93`, `OutcomeDialog:98,109`, `RescheduleDialog:36`, `CustomerDialogs:187,312`, `KycDialogs:132,310`, `PolicyDialogs:126,329`) mỗi chỗ đúng một lệnh db → một transaction; 6c + hẹn tiếp dùng `recordOutcomeWithNext` (một transaction), 6f dùng `editMeetingOutcome` (một transaction thay cho hai lệnh cũ). Lỗi giữ hộp mở kèm câu báo, DB không đổi (quy ước db, gói B). Mẫu "gọi `onCreated` / `onMoved` trong cùng `try` với lệnh" (như ghi chú gói D về `PersonDialogs`): `show()` chỉ gọi hàm ngày với ngày hợp lệ nên không ném được → không thành phát hiện. Không có đường ghi nào ngoài lệnh db.
- **P — Hiệu năng** (Node, dữ liệu tải, median 9 lượt; `probe-perf`, `probe-profile`):
  - Lịch hẹn: `appointmentRows` 3,16 / 7,35 / 0,74 ms (Toàn bộ / Team / RE); lọc kỳ 0,72 (tháng) / 0,89 ms (năm, 7 071 dòng); `summary` 0,39 ms; `yearGrid` 0,38 ms; `dayBoard` 0,92 ms; dải RE 0,20 ms; `outcomeResolver` 0,30 ms; `rescheduleLinks` 0,15 ms. Ngoài `monthGrid` (CL-E1) không hàm nào quá 8 ms.
  - Hộp 6a mở từ Lịch hẹn nhận toàn bộ dữ liệu: `priorMeetings` 0,73 ms (KH 39 lịch); `searchCustomers` 0,94–1,16 ms mỗi phím.
  - Khách hàng: `customerBoard` 2,49 ms (Toàn bộ) / 1,77 ms (Team). Bảng 1 496 dòng: CL-D7.
  - Hồ sơ KH: đọc mỗi lần mở / mỗi lệnh ghi 11,86 ms, trong đó `listPolicies` toàn bảng rồi lọc một KH chiếm 8,39 ms (`CustomerProfile.tsx:40`; db chưa có `listPolicies(db, customerId)`). Dưới một khung hình nên không thành phát hiện; nếu tách hàm db thì còn ≈ 3,5 ms. Dòng thời gian 0,03 ms.
  - Đầu-cuối trong exe: bấm ngày 31–77 ms, trung vị 46 ms (Toàn bộ) / 11–29 ms, trung vị 17 ms (Team) → CL-E1; lệnh ghi và đổi kỳ: CL-D7.
- **B — Bloat:** `tsc --noUnusedLocals --noUnusedParameters` cho `apps/desktop` sạch (gói D đã chạy, cùng SHA). Quét mọi `export` của hai thư mục (`exports.mjs`): chỉ có type nằm trong chữ ký công khai và `OUTCOME_CHOICES`, `readFyp` (dùng trong chính file + test) không có nơi dùng ngoài — không báo. Key i18n của gói E đều được dùng (probe key của gói D: chỉ `app.subtitle` thừa). `updateAppointmentDetails` không dùng là CL-B7. Lặp → CL-E8; ba helper `badge` là KNOWN #141.
- **T — Test:** 93 mutation unit (78 bị bắt) và 23 mutation chạy e2e (19 trên TSX: 9 bị bắt; 4 lặp lại con sống của unit: AF1, AF3 bị e2e bắt, OF7, PF4 vẫn sống) → CL-E4 (phụ lục A, B). Con sống tương đương: AV6 (chỉ lịch Đã gặp có `stageAfter`, db chặn `STAGE_AFTER_NOT_ALLOWED`), PF7 (UI luôn bỏ case size khi không Đã gặp). Coverage khi tính cả `*-form.ts`: Stmts 98,73 / Branch 93,66 / Funcs 97,05; chỗ chưa phủ: `withoutError` (`outcome-form.ts:96`), nhánh `withTime` (`appointment-form.ts:62`).
- **A — Trợ năng / i18n:**
  - Tương phản (`contrast.mjs`, 19 cặp của gói E chưa đo ở gói D): thấp nhất 4,82:1 (số ngày `text-fg-3` trên dải kỳ) — mọi cặp ≥ 4,5:1, kể cả số trong thanh lưới năm (6,6–10,26) và badge "Chưa ghi kết quả" (8,35).
  - Chuỗi cứng: quét JSX / `aria-label` / `title` / `placeholder` literal: không có; chỉ còn ký hiệu `×`, `—`, `!`, `✓`, `○`, dấu ngoặc kép — có trong mockup (chip người phối hợp "Nguyễn Thu Hà ×") hoặc `aria-hidden`.
  - Nút chỉ có ký hiệu / chữ ngắn đều có `aria-label` riêng ("Bỏ {name}", "Hẹn tiếp sau lịch {date}", "Phát hành HĐ nộp {date}", "Giải quyết · {field}", "Bỏ dữ kiện {field}"); `fieldset/legend` cho người phối hợp; `Choices` cho trạng thái / nhóm sau cuộc gặp.
  - Focus / Escape của hộp thoại: CL-D1–D3 (gói D). Còn lại → CL-E5, CL-E7.
- **S — An toàn (hẹp):** gói E không đọc file, không đường dẫn, không tên file xuất. Không `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `window.open`; mọi `href` qua `routeToHash` (id được `encodeURIComponent`, gói D). Dữ liệu người dùng chỉ vào JSX (React tự escape); gói E không dùng ECharts.

## 6. Ghi chú cho gói sau (không phải phát hiện gói E)

- **Gói G:** `coverage.include` chỉ có `routes/**/*-view.ts`; ba file `*-form.ts` (380 dòng logic thuần của gói E, có unit test) không được đo — tính vào thì ngưỡng `routes/**` (99 % stmts / funcs) đỏ (98,73 % / 97,05 %). Bộ chạy mutation TSX trên e2e (`E\e2e-mut.mjs`: build Vite có plugin `load` ra thư mục ngoài repo + `PW_REUSE=1`, `--output` ngoài repo) dùng lại được để đo độ phủ e2e của các màn khác; lưu ý server preview phải chạy cùng tiến trình với `spawn` bất đồng bộ (bản đầu dùng `spawnSync` treo vì chặn vòng sự kiện).
- **Gói H:** lỗi db không mang tham số mà câu báo cần (`TRANSITION_BEFORE_LATEST` → UI tự tính ngày ở ba chỗ, CL-E2) — xem có mã lỗi khác cùng kiểu không. Chi phí một lệnh ghi ở Lịch hẹn là tổng CL-B8 (đọc lại) + CL-E1 (`monthGrid`) + CL-D7 (bảng); nên đo lại đầu-cuối sau khi sửa từng phần.

## Phụ lục A — Mutation unit (`mutate-results.json`)

Mỗi lượt phục vụ đúng một file đã đổi qua plugin `load` của Vite (repo không bị ghi), chạy 106 test unit của gói E (`vitest.mut.config.mts`, `--bail=1`). Tổng: {"KILLED":78,"SURVIVED":15}. Tiền tố: AV = `appointments-view.ts`, AF = `appointment-form.ts`, OF = `outcome-form.ts`, MF = `MetFields.tsx (metDraftOf)`, CV = `customers-view.ts`, KV = `kyc-view.ts`, PF = `policy-form.ts`. Chuỗi thay đổi chính xác ở `mutate.mjs` (phụ lục D).

| Mutation | Kết quả | Test bắt được |
|---|---|---|
| AV1 outcomeText ignores RF | KILLED | appointments/appointments-view.test.ts > outcomeText > names both stages, including one outside the pipeline |
| AV2 statusLabel never unrecorded | KILLED | appointments/appointments-view.test.ts > statusLabel > says a scheduled appointment before today has no outcome recorded yet |
| AV3 summary always with unrecorded | KILLED | appointments/appointments-view.test.ts > summaryText > adds the unrecorded count only when there are some |
| AV4 dateTone today is past | KILLED | appointments/appointments-view.test.ts > dateTone > is past before today, today on it, future after it |
| AV5 reviewerChoices keeps everyone | KILLED | appointments/appointments-view.test.ts > reviewerChoices > keeps every IS, TL, BDM and BD in the given order, and no RE |
| AV6 keep without MET check | **SURVIVED** |  |
| AV7 new day keyed by own id | KILLED | appointments/appointments-view.test.ts > appointmentRows > describes the outcome: a stage move (RF or not), a kept stage, a new day |
| AV8 coordinator none = at most one | KILLED | appointments/appointments-view.test.ts > appointmentRows > filters by coordinator: a given person, or none at all |
| AV9 rows ignore scope | KILLED | appointments/appointments-view.test.ts > appointmentRows > keeps the appointments of the RE in scope |
| AV10 rows without team | KILLED | appointments/appointments-view.test.ts > appointmentRows > joins the customer, RE, team and coordinators |
| AV11 rows without coordinators | KILLED | appointments/appointments-view.test.ts > appointmentRows > joins the customer, RE, team and coordinators |
| AV12 byRe ignores period | KILLED | appointments/appointments-view.test.ts > appointmentsByRe > counts the appointments in the period by the RE in charge, not by coordinator |
| AV13 reveal outsideScope inverted | KILLED | appointments/appointments-view.test.ts > revealCreated > says when the RE is outside the scope, which it leaves alone |
| AV14 reveal always clears filter | KILLED | appointments/appointments-view.test.ts > revealCreated > keeps the coordinator filter when it shows the new appointment |
| AV15 rescheduleLinks to = from | KILLED | appointments/appointments-view.test.ts > rescheduleLinks > finds the appointment this one replaced and the one that replaced it |
| AV16 groupTotal drops planned | KILLED | appointments/appointments-view.test.ts > APPOINTMENT_GROUPS > lists the four groups in the order of spec §4.5, a total adding them up |
| AV17 month banded | KILLED | appointments/appointments-view.test.ts > monthGrid > marks no band for a month or a day period |
| AV18 every day in month | KILLED | appointments/appointments-view.test.ts > monthGrid > shows whole weeks Monday to Sunday around the month, with counts by status |
| AV19 grid counts days up to cell | KILLED | appointments/appointments-view.test.ts > monthGrid > shows whole weeks Monday to Sunday around the month, with counts by status |
| AV20 grid one week short | KILLED | appointments/appointments-view.test.ts > monthGrid > shows whole weeks Monday to Sunday around the month, with counts by status |
| AV21 year state ignores year | KILLED | appointments/appointments-view.test.ts > yearGrid > marks months past, current and future against today |
| AV22 yearGrid ignores year | KILLED | appointments/appointments-view.test.ts > yearGrid > counts each month's appointments of the year by calendar group |
| AV23 pickDay custom keeps period | KILLED | appointments/appointments-view.test.ts > pickDay > refuses a day outside a custom range |
| AV24 pickDay always moves | KILLED | appointments/appointments-view.test.ts > pickDay > keeps the period when the day is in it |
| AV25 dayBoard time reversed | KILLED | appointments/appointments-view.test.ts > dayBoard > groups the day's appointments by team, then RE, by name and time |
| AV26 dayBoard teams unsorted | KILLED | appointments/appointments-view.test.ts > dayBoard > groups the day's appointments by team, then RE, by name and time |
| AV27 dayBoard REs unsorted | KILLED | appointments/appointments-view.test.ts > dayBoard > groups the day's appointments by team, then RE, by name and time |
| AV28 dayBoard ignores date | KILLED | appointments/appointments-view.test.ts > dayBoard > groups the day's appointments by team, then RE, by name and time |
| AF1 fromToday allows yesterday | **SURVIVED** |  |
| AF2 dayText always drops year | KILLED | appointments/appointment-form.test.ts > readScheduleDate (from today) > refuses the prefilled day of an appointment from an earlier year; never makes it a future one |
| AF3 withTime drops time | **SURVIVED** |  |
| AF4 parseTime no padding | KILLED | appointments/appointment-form.test.ts > parseTime > reads hh:mm, padding the hour, and empty as no time |
| AF5 parseTime accepts 24h | **SURVIVED** |  |
| AF6 parseTime accepts :60 | KILLED | appointments/appointment-form.test.ts > parseTime > refuses an hour or minute out of range and other text |
| AF7 isPastOrToday excludes today | KILLED | appointments/appointment-form.test.ts > isPastOrToday > is true for today and earlier |
| AF8 prior includes future | KILLED | appointments/appointment-form.test.ts > priorMeetings > lists the customer's appointments up to today, newest first, and counts the ones met |
| AF9 prior same-day time order reversed | KILLED | appointments/appointment-form.test.ts > priorMeetings > lists the customer's appointments up to today, newest first, and counts the ones met |
| AF10 lastMet is the oldest | KILLED | appointments/appointment-form.test.ts > priorMeetings > lists the customer's appointments up to today, newest first, and counts the ones met |
| AF11 search keeps accents | KILLED | appointments/appointment-form.test.ts > searchCustomers > matches a part of the name or the code, ignoring accents and case |
| AF12 search keeps đ | KILLED | appointments/appointment-form.test.ts > searchCustomers > matches a part of the name or the code, ignoring accents and case |
| AF13 search ignores code | KILLED | appointments/appointment-form.test.ts > searchCustomers > matches a part of the name or the code, ignoring accents and case |
| AF14 search limit + 1 | KILLED | appointments/appointment-form.test.ts > searchCustomers > returns nothing for empty text and no more than the limit |
| AF15 search untrimmed | **SURVIVED** |  |
| OF1 case size zero ok | KILLED | appointments/outcome-form.test.ts > readOutcome > refuses a case size that is not a whole, positive amount of đồng |
| OF2 moved not closed | KILLED | appointments/outcome-form.test.ts > outcomeChoices > offers nothing for an appointment that was already moved (D3) |
| OF3 any status reschedules | KILLED | appointments/outcome-form.test.ts > outcomeChoices > reschedules only a scheduled appointment |
| OF4 cancel waits for the day | KILLED | appointments/outcome-form.test.ts > outcomeChoices > holds met and no-show until the day comes (Owner 29/09) |
| OF5 lock: first move, not latest | KILLED | appointments/outcome-form.test.ts > outcomeLock > is locked by a later move of the same customer |
| OF6 current stage not choosable | KILLED | appointments/outcome-form.test.ts > stageAfterChoices > offers every stage from an open one, the current one kept |
| OF7 withoutError keeps errors | **SURVIVED** |  |
| OF8 next step untrimmed | KILLED | appointments/outcome-form.test.ts > readOutcome > reads a met outcome with its stage after, next step, case size and reviewer |
| OF9 reviewer empty string kept | KILLED | appointments/outcome-form.test.ts > readOutcome > needs a stage after and a next step when met; case size and reviewer may stay empty |
| OF10 next time error ignored | KILLED | appointments/outcome-form.test.ts > readOutcome > books the next appointment from today on, with its time when given |
| OF11 case size error ignored | KILLED | appointments/outcome-form.test.ts > readOutcome > refuses a case size that is not a whole, positive amount of đồng |
| OF12 non-met keeps stage after | KILLED | appointments/outcome-form.test.ts > readOutcome > keeps only the note when not met, whatever else was typed |
| MF1 case size not filled | KILLED | appointments/MetFields.test.ts > metDraftOf > fills the draft from a met appointment, keeping its reviewer |
| MF2 reviewer not filled | KILLED | appointments/MetFields.test.ts > metDraftOf > fills the draft from a met appointment, keeping its reviewer |
| CV1 since = first transition | KILLED | customers/customers-view.test.ts > customerBoard > puts each customer in the column of its stage, latest change first |
| CV2 board oldest first | KILLED | customers/customers-view.test.ts > customerBoard > puts each customer in the column of its stage, latest change first |
| CV3 no name tie-break | **SURVIVED** |  |
| CV4 openByRe counts closed | KILLED | customers/customers-view.test.ts > customerBoard > counts the open customers of each RE in scope, leaving the closed ones out |
| CV5 openCount counts closed | KILLED | customers/customers-view.test.ts > customerBoard > puts each customer in the column of its stage, latest change first |
| CV6 record date allows future | KILLED | customers/customers-view.test.ts > parseRecordDate > refuses a day after today, typed in full or read into the current year |
| CV7 birth: inferred year ok | KILLED | customers/customers-view.test.ts > parseBirthDate > refuses a day that does not exist, a short year or a birth after today |
| CV8 birth year next year ok | KILLED | customers/customers-view.test.ts > parseBirthDate > refuses a day that does not exist, a short year or a birth after today |
| CV9 birth today refused | **SURVIVED** |  |
| CV10 age: birthday counted a day late | KILLED | customers/customers-view.test.ts > ageOn > counts full years from a full birth date |
| CV11 age from year minus one | KILLED | customers/customers-view.test.ts > ageOn > counts the age reached this year from a year alone |
| CV12 birthLabel year only | KILLED | customers/customers-view.test.ts > birthLabel > shows the year alone, or the full date |
| CV13 policy count max 1 | KILLED | customers/customers-view.test.ts > customerBoard > gives each card its RE, the day it entered the stage and its policy count |
| CV14 board ignores scope | KILLED | customers/customers-view.test.ts > customerBoard > keeps only the customers of the RE in scope, through their team or directly |
| KV1 overview keeps superseded | KILLED | customers/kyc-view.test.ts > kycOverview > lists every hạng mục with its facts in effect and the kind of conflict |
| KV2 core only if all core | **SURVIVED** |  |
| KV3 present = any fact | KILLED | customers/kyc-view.test.ts > kycOverview > lists every hạng mục with its facts in effect and the kind of conflict |
| KV4 yes/no swapped | KILLED | customers/kyc-view.test.ts > factText > shows yes/no answers in words and other values as they are |
| KV5 planned not numbered | KILLED | customers/kyc-view.test.ts > kycTimeline > adds the appointments, numbering the meetings held or planned, each under its stage change |
| KV6 planned counted as met | **SURVIVED** |  |
| KV7 meeting ranked after version | KILLED | customers/kyc-view.test.ts > kycTimeline > adds the appointments, numbering the meetings held or planned, each under its stage change |
| KV8 timeline not reversed first | KILLED | customers/kyc-view.test.ts > kycTimeline > puts the newest first; on one day a version, then its note, then a stage change |
| KV9 manual material ignored | KILLED | customers/kyc-view.test.ts > previewKycNote > numbers the next version; a cốt lõi trường makes it material on its own |
| KV10 next version number | KILLED | customers/kyc-view.test.ts > previewKycNote > numbers the next version; a cốt lõi trường makes it material on its own |
| KV11 resolve never disabled | KILLED | customers/kyc-view.test.ts > resolveKycOptions > keeps birth year to the hồ sơ KH value: the one from a ghi chú is locked (D2) |
| KV12 resolve any status | KILLED | customers/kyc-view.test.ts > resolveKycOptions > offers nothing for a trường not in conflict |
| KV13 preview conflict as update | KILLED | customers/kyc-view.test.ts > previewKycNote > refuses a conflict with no value to disagree with, or with the same value |
| PF1 FYP zero ok | KILLED | customers/policy-form.test.ts > readFyp > refuses nothing, zero, a negative amount and words (mockup 8c) |
| PF2 issue a day before submission ok | **SURVIVED** |  |
| PF3 same month ignores year | **SURVIVED** |  |
| PF4 diff from submitted | **SURVIVED** |  |
| PF5 effect always up | KILLED | customers/policy-form.test.ts > effectText > names the RE of the policy |
| PF6 case size of oldest meeting | KILLED | customers/policy-form.test.ts > expectedCaseSize > takes the case size of the latest met meeting that has one |
| PF7 case size of any status | **SURVIVED** |  |
| PF8 policy despite bad issued FYP | **SURVIVED** |  |
| PF9 RE name untrimmed | KILLED | customers/policy-form.test.ts > effectText > never shows an empty RE name, e.g. when the RE was deleted |

## Phụ lục B — Mutation TSX trên e2e (`e2e-mut-results.json`)

Mỗi lượt: build web bằng Vite (cấu hình của repo + plugin `load` đổi đúng một file) ra `E\dist-mut`, phục vụ ở cổng 4173, chạy các spec liên quan với `PW_REUSE=1 --project=edge --no-deps --output=E\pw-out` (Edge, 4 worker). Chỉ chạy spec liên quan đến màn bị đổi, không chạy cả bộ 146 test. Lượt nền (không đổi gì) xanh trước khi chạy mutation.

| Mutation | Spec chạy | Kết quả | Test đỏ đầu tiên |
|---|---|---|---|
| BASE no mutation | appointments, appointment-outcome, customers, customer-forms, customer-appointments, customer-kyc, customer-policies | GREEN (64 passed (1.7m)) |  |
| T1 dots: unrecorded last | appointments | KILLED (1 failed, 30 passed (51.1s)) | e2e\appointments.spec.ts:539:1 › an appointment past and still scheduled counts as unrecorded: count line, badge, year grid |
| T2 next offered for future | appointments | **SURVIVED** (31 passed (53.5s)) |  |
| T3 delete offered for any status | appointments, appointment-outcome | KILLED (2 failed, 39 passed (1.3m)) | e2e\appointment-outcome.spec.ts:224:1 › deleting the meeting that moved the customer takes the move back (6g) |
| T4 month line: no unrecorded | appointments | KILLED (1 failed, 30 passed (55.7s)) | e2e\appointments.spec.ts:539:1 › an appointment past and still scheduled counts as unrecorded: count line, badge, year grid |
| T5 list not newest first on ties | appointments | **SURVIVED** (31 passed (55.3s)) |  |
| T6 quarter total = met only | appointments | **SURVIVED** (31 passed (55.2s)) |  |
| T7 reschedule: same day+time accepted | appointments | **SURVIVED** (31 passed (58.1s)) |  |
| T8 outcome: no default status | appointment-outcome | KILLED (5 failed, 5 passed (56.6s)) | e2e\appointment-outcome.spec.ts:61:1 › a meeting met N3 → N2 moves the customer, the timeline says after the meeting |
| T9 outcome: next booking dropped | appointment-outcome | KILLED (2 failed, 8 passed (28.2s)) | e2e\appointment-outcome.spec.ts:105:1 › another status than met has no stage after; a past next day saves nothing |
| T10 outcome: error without date | appointment-outcome | **SURVIVED** (10 passed (23.1s)) |  |
| T11 edit: stage after not locked | appointment-outcome | KILLED (1 failed, 9 passed (32.2s)) | e2e\appointment-outcome.spec.ts:187:1 › once the customer moved on, status, day and stage after are locked and delete too (D7) |
| T12 edit: delete not blocked | appointment-outcome | KILLED (1 failed, 9 passed (31.5s)) | e2e\appointment-outcome.spec.ts:187:1 › once the customer moved on, status, day and stage after are locked and delete too (D7) |
| T13 edit: error without date | appointment-outcome | **SURVIVED** (10 passed (30.3s)) |  |
| T14 stage dialog: error without date | customers, customer-forms | **SURVIVED** (13 passed (24.0s)) |  |
| T15 kanban: no column limit | customers, customer-forms | KILLED (1 failed, 12 passed (31.0s)) | e2e\customers.spec.ts:31:1 › the kanban shows N4 → N1 and the closed stages, adding up to the summary |
| T16 profile: since = first move | customers, customer-forms, customer-appointments, customer-kyc, customer-policies | **SURVIVED** (23 passed (40.3s)) |  |
| T17 profile list: met count 0 | customer-appointments, customer-kyc, customer-policies | **SURVIVED** (10 passed (21.6s)) |  |
| T18 KYC: no resolve button | customer-appointments, customer-kyc, customer-policies | KILLED (1 failed, 9 passed (39.7s)) | e2e\customer-kyc.spec.ts:67:1 › a KYC note confirms facts; a cốt lõi conflict blocks the gate until it is resolved |
| T19 policy list: oldest first | customer-appointments, customer-kyc, customer-policies | **SURVIVED** (10 passed (19.7s)) |  |
| U1 withTime drops time (AF3) | appointments, customer-appointments, customer-kyc, customer-policies | KILLED (3 failed, 38 passed (1.6m)) | e2e\appointments.spec.ts:351:1 › creates an appointment: the day is read back, a trigger is required, the day lists it |
| U2 fromToday allows yesterday (AF1) | appointments, appointment-outcome, customer-appointments, customer-kyc, customer-policies | KILLED (1 failed, 50 passed (1.6m)) | e2e\appointments.spec.ts:408:1 › the next appointment from a past one is filled in and must be from today on |
| U3 withoutError keeps errors (OF7) | appointment-outcome | **SURVIVED** (10 passed (25.5s)) |  |
| U4 effect diff from submitted (PF4) | customer-appointments, customer-kyc, customer-policies | **SURVIVED** (10 passed (21.0s)) |  |

## Phụ lục C — Kết quả probe

### `probe-perf.result.json`

```json
{
 "counts": {
  "appointments": 10434,
  "customers": 1496,
  "people": 51,
  "transitions": 4978
 },
 "rows": {
  "all": 10434,
  "team": 2595
 },
 "appointmentRows": {
  "all": 3.16,
  "team": 7.35,
  "re": 0.74
 },
 "inPeriod": {
  "month": 0.72,
  "year": 0.89
 },
 "yearRowsInPeriod": 7071,
 "summaryYear": 0.39,
 "yearGrid": 0.38,
 "appointmentsByRe": 0.2,
 "monthGrid": {
  "all": 23.02,
  "team": 7.28
 },
 "dayBoard": {
  "all": 0.92,
  "team": 0.24
 },
 "monthGridIndexedBaseline": 0.22,
 "dayClickAll": 24.1,
 "perWriteAllMonth": 29.22,
 "rescheduleLinks": 0.15,
 "outcomeResolver": 0.3,
 "busiestCustomerAppointments": 39,
 "priorMeetingsFullData": 0.73,
 "searchCustomers": {
  "n": 0.94,
  "nguyen": 1.1,
  "none": 1.16
 },
 "customerBoard": {
  "all": 2.49,
  "team": 1.77
 },
 "boardColumns": {
  "N4": 364,
  "N3": 253,
  "N2": 175,
  "N1": 186,
  "ON_HOLD": 344,
  "LOST": 174
 },
 "kycTimeline": 0.04,
 "readProfileLists": 3.66,
 "sanity": -444
}
```

### `perf-dayclick.result.json`

```json
{
 "note": "Lịch hẹn, kỳ Tháng 10/2026, dữ liệu tải, exe release f0c53eb có gắn CDP; ms từ click tới khung hình kế, 6 ngày mỗi lượt",
 "listRows": {
  "Toàn bộ": 662,
  "Team": 163
 },
 "runs": {
  "5": {
   "Toàn bộ": [
    54,
    64,
    31,
    33,
    34,
    31
   ],
   "Team": [
    14,
    14,
    13,
    13,
    13,
    15
   ]
  },
  "1 (16:00, console)": {
   "Toàn bộ": [
    37,
    36,
    35,
    33,
    34,
    34
   ],
   "Team": [
    12,
    14,
    11,
    15,
    11,
    15
   ]
  },
  "2 (sau e2e)": {
   "Toàn bộ": [
    50,
    51,
    45,
    42,
    55,
    58
   ],
   "Team": [
    18,
    21,
    20,
    20,
    13,
    20
   ]
  },
  "3 (ngay sau lượt 2)": {
   "Toàn bộ": [
    72,
    77,
    54,
    56,
    66,
    47
   ],
   "Team": [
    21,
    24,
    28,
    19,
    26,
    22
   ]
  },
  "4 (exe khởi động lại)": {
   "Toàn bộ": [
    61,
    62,
    45,
    44,
    45,
    50
   ],
   "Team": [
    23,
    19,
    16,
    29,
    17,
    17
   ]
  }
 },
 "summary": {
  "Toàn bộ": {
   "min": 31,
   "median": 46,
   "max": 77
  },
  "Team": {
   "min": 11,
   "median": 17,
   "max": 29
  }
 }
}
```

### `profile-dayclick.result.json`

```json
{
 "clicks": [
  33,
  34,
  36,
  36,
  34,
  35,
  31,
  35
 ],
 "busyMsTotal": 229,
 "top": [
  {
   "key": "fw @14:73:116908",
   "ms": 152,
   "url": "",
   "snippet": "nned:0});function fw(e,t,n,r){let i=n.kind===`week`||n.kind===`custom`,a=Ye(`month`,e),o=[];for(let s=Ye(`week`,a.start);;s=et(s,1)){let c=[],l=We(s.start,s.end)+1;for(let a=0;a<7;a++){if(a>=l){c.push(null);continue}let o=Ie(s.start,a),u={date:o,inMonth:o.month===e.month,inPeriod"
  },
  {
   "key": "(garbage collector) @0:-1:-1",
   "ms": 27.2,
   "url": "",
   "snippet": ""
  },
  {
   "key": "sp @14:9:7993",
   "ms": 6.4,
   "url": "",
   "snippet": "ar op={};function sp(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var a=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`valu"
  },
  {
   "key": "(anon) @14:73:165497",
   "ms": 3.4,
   "url": "",
   "snippet": "let a=(0,k.useMemo)(()=>fw(t,r,e,n),[t,r,e,n]),o=it(Ye(`month`,t)),s=a.flat().filter(e=>e?.inMonth===!0),c=e=>s.reduce((t,n)=>t+e(n),0);return(0,Q.jsxs)(`section`,{\"aria-labelledby\":`appointments-calendar`,className:GC,children:[(0,Q.jsxs)(`div`,{className:`mb-2 flex items-baseli"
  },
  {
   "key": "rp @14:9:71",
   "ms": 3.3,
   "url": "",
   "snippet": "p(e)===t}function rp(e,t,n,r,a,o){switch(n){case`children`:if(typeof r==`string`)t===`body`||t===`textarea`&&r===``||hn(e,r);else if(typeof r==`number`||typeof r==`bigint`)t!==`body`&&hn(e,``+r);else return;break;case`className`:en(e,`class`,r);break;case`tabIndex`:en(e,`tabindex"
  },
  {
   "key": "_ @14:8:43396",
   "ms": 2.6,
   "url": "",
   "snippet": "&V(a,g),u}function _(e,r,o,c){if(typeof o==`object`&&o&&o.type===te&&o.key===null&&o.props.ref===void 0&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case E:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===te){if(r.tag===7){n(e,r.sibling),c=a(r,o.prop"
  },
  {
   "key": "Du @14:8:109443",
   "ms": 2.3,
   "url": "",
   "snippet": " Eu=null;function Du(e,t,n){var r=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(a&4&&(r=e.updateQueue,r=r===null?null:r.events,r!==null))for(var o=0;o<r.length;o++){var s=r[o];s.ref.impl=s.nextImpl}Tu(t,e,n),Ou(e),a&4&&(vl(3,e,e.return),_l(3,e),vl(5,e,e.re"
  },
  {
   "key": "ke @14:9:50870",
   "ms": 2.2,
   "url": "",
   "snippet": "Oe=864e5;function ke({year:e,month:t,day:n}){return Date.UTC(e,t-1,n)/Oe}function Ae(e){let t=new Date(e*Oe);return{year:t.getUTCFullYear(),month:t.getUTCMonth()+1,day:t.getUTCDate()}}function je(e,t){return new Date(Date.UTC(e,t,0)).getUTCDate()}var A=1900,Me=2100,Ne=Date.UTC(A,"
  }
 ]
}
```

### `probe-editdate.result.json`

```json
{
 "candidates": 1015,
 "meetingDay": "25/08/2026",
 "moveBefore": {
  "date": "23/01/2026",
  "from": "ON_HOLD",
  "to": "N3"
 },
 "typed": "22/01/2026",
 "code": "TRANSITION_BEFORE_LATEST",
 "dialogDate": "25/08/2026",
 "dialogIsTheMeetingsOwnMove": true,
 "messageShown": "Ngày chuyển trước lần đổi nhóm gần nhất (25/08/2026).",
 "acceptedBetween": {
  "typed": "24/01/2026",
  "savedDay": "24/01/2026"
 }
}
```

### `editdate-ui.result.json`

```json
{
 "dayHeading": "Trong ngày 25/08/2026",
 "detailTitle": "25/08/2026 15:00 · Võ Thị Thảo",
 "alert": [
  "Ngày chuyển trước lần đổi nhóm gần nhất (25/08/2026)."
 ],
 "hintFor24": [
  "Thứ Bảy 24/01/2026 · đã qua 254 ngày",
  "N3 → Tạm hoãn ngày 24/01/2026 · không tính RF — RF chỉ khi N4 / N3 lên N2 / N1"
 ]
}
```

### `probe-labels.result.json`

```json
{
 "customersWithAppointments": 1376,
 "customersWithDuplicatedMeetingNumber": 0,
 "duplicateGroupsByKind": {},
 "birthColumn": {
  "withBirth": 1395,
  "fullDates": 905,
  "yearOnly": 490,
  "adjacentPairsOutOfDateOrder": 270,
  "firstTenAscending": [
   "01/01/1961",
   "01/01/1969",
   "01/02/1969",
   "01/02/1974",
   "01/03/1978",
   "01/03/1983",
   "01/03/1991",
   "01/03/1992",
   "01/04/1969",
   "01/05/1977"
  ],
  "lastFiveAscending": [
   "2000",
   "2000",
   "2000",
   "2000",
   "2000"
  ]
 }
}
```

### `birth-sort-ui.result.json`

```json
{
 "headers": [
  "Mã KH ↕",
  "Họ tên ↕",
  "Nhóm ↕",
  "RE ↕",
  "Ngày sinh ↕",
  "HĐ ↕",
  "Từ ngày ↓"
 ],
 "ascending": [
  "01/01/1961",
  "01/01/1969",
  "01/02/1969",
  "01/02/1974",
  "01/03/1978",
  "01/03/1983",
  "01/03/1991",
  "01/03/1992"
 ],
 "descending": [
  "2000",
  "2000",
  "2000",
  "2000",
  "2000",
  "2000",
  "2000",
  "2000"
 ]
}
```

### `probe-timeline.result.json`

```json
{
 "twoPlanned": [
  "A 01/09 MET → Lịch hẹn lần 1",
  "B 10/10 SCHEDULED → Lịch hẹn lần 2",
  "C 20/10 SCHEDULED → Lịch hẹn lần 2"
 ],
 "unrecordedThenMet": [
  "A 01/08 MET → Lịch hẹn lần 1",
  "B 01/09 SCHEDULED → Lịch hẹn lần 2",
  "C 10/09 MET → Lịch hẹn lần 2"
 ]
}
```

### `aria-calendar.result.json`

```json
{
 "dayAccessibleName": "04/10/2026: 1 lịch hẹn",
 "dayAria": "- 'button \"04/10/2026: 1 lịch hẹn\"': 04 1",
 "dayDots": [
  "bg-ok"
 ],
 "calendarTabStops": 31,
 "listUnrecordedYesterday": 0,
 "monthAccessibleName": "Tháng 9/2026: 717 lịch",
 "monthAria": "- 'button \"Tháng 9/2026: 717 lịch\"': Tháng 9 717lịch",
 "monthBarVisible": [
  "Đã gặp: 566 lịch",
  "Dời lịch / hủy / không đến: 151 lịch"
 ]
}
```

### `probe-profile.result.json`

```json
{
 "appointmentsOfCustomer": 39,
 "readProfileMs": 11.86,
 "listPoliciesAllMs": 8.39,
 "timelineMs": 0.03
}
```

### `probe-order.result.json`

```json
{
 "search": {
  "query": "thảo",
  "matches": 55,
  "shownFirstSix": [
   "Bùi Hoài Thảo",
   "Bùi Kim Thảo",
   "Bùi Ngọc Thảo",
   "Bùi Thanh Thảo",
   "Bùi Thu Thảo",
   "Dương Minh Thảo"
  ],
  "viCollatedFirstSix": [
   "Bùi Hoài Thảo",
   "Bùi Kim Thảo",
   "Bùi Ngọc Thảo",
   "Bùi Thanh Thảo",
   "Bùi Thu Thảo",
   "Dương Minh Thảo"
  ],
  "matchesStartingWithĐ": 6
 },
 "coordinatorList": [
  "IS Bùi Văn Nga",
  "BDM Hoàng Minh Quang",
  "TL Huỳnh Thanh Hoa",
  "TL Lý Văn Tâm",
  "TL Ngô Minh Yến",
  "BD Phan Minh Hà",
  "TL Vũ Đức Long"
 ],
 "coordinatorListFirstOutOfViOrder": 1,
 "reviewerList": [
  "IS Bùi Văn Nga",
  "BDM Hoàng Minh Quang",
  "TL Huỳnh Thanh Hoa",
  "TL Lý Văn Tâm",
  "TL Ngô Minh Yến",
  "BD Phan Minh Hà",
  "TL Vũ Đức Long"
 ]
}
```

### `contrast.result.txt`

```
8.35  "Chưa ghi kết quả" badge text-appt-unrecorded (warn) on surface-1 (list, day)
 7.41  status text-info (Dự kiến tone) on surface-1
 9.59  status text-ok (Đã gặp tone) on surface-1
 6.17  status text-appt-missed (text-3) on surface-1
 6.79  status text-danger (Không đến) on surface-1
 5.61  day number text-fg-3 on surface-2 (weekday cell)
 4.82  day number text-fg-3 on period-band over surface-2
11.36  "· hôm nay" text-date-today on surface-2
 8.63  "· hôm nay" text-date-today on accent-soft (today picked)
 6.18  picked day number text-accent on accent-soft over surface-2
10.26  year bar count text-on-accent on bg-ok
  6.6  year bar count text-on-accent on bg-appt-missed (text-3)
 8.94  year bar count text-on-accent on bg-appt-unrecorded (warn)
 7.92  year bar count text-on-accent on bg-info
 9.47  future planned bar text-fg on info/25 over surface-1
 8.73  kanban "n HĐ" text-issued on surface-2
 8.35  KYC minor conflict text-warn on surface-1
 8.94  card heading text-heading (accent) on surface-1
 8.94  link text-accent on surface-1
```

### `exports.result.json`

```json
[
 {
  "file": "routes/appointments/appointment-form.ts",
  "name": "ScheduleMode",
  "ownFileUses": 1,
  "tests": []
 },
 {
  "file": "routes/appointments/appointments-view.ts",
  "name": "DateTone",
  "ownFileUses": 2,
  "tests": []
 },
 {
  "file": "routes/appointments/appointments-view.ts",
  "name": "DayGroup",
  "ownFileUses": 1,
  "tests": []
 },
 {
  "file": "routes/appointments/MetFields.tsx",
  "name": "MetDraft",
  "ownFileUses": 7,
  "tests": []
 },
 {
  "file": "routes/appointments/outcome-form.ts",
  "name": "OUTCOME_CHOICES",
  "ownFileUses": 2,
  "tests": [
   "outcome-form.test.ts"
  ]
 },
 {
  "file": "routes/appointments/outcome-form.ts",
  "name": "CaseSizeRead",
  "ownFileUses": 1,
  "tests": []
 },
 {
  "file": "routes/appointments/outcome-form.ts",
  "name": "OutcomeDraft",
  "ownFileUses": 1,
  "tests": [
   "outcome-form.test.ts"
  ]
 },
 {
  "file": "routes/appointments/outcome-form.ts",
  "name": "OutcomeRead",
  "ownFileUses": 1,
  "tests": []
 },
 {
  "file": "routes/appointments/RescheduleFields.tsx",
  "name": "RescheduleForm",
  "ownFileUses": 1,
  "tests": []
 },
 {
  "file": "routes/customers/customers-view.ts",
  "name": "CustomerBoard",
  "ownFileUses": 1,
  "tests": []
 },
 {
  "file": "routes/customers/customers-view.ts",
  "name": "CustomerData",
  "ownFileUses": 1,
  "tests": []
 },
 {
  "file": "routes/customers/customers-view.ts",
  "name": "BirthDateResult",
  "ownFileUses": 1,
  "tests": []
 },
 {
  "file": "routes/customers/kyc-view.ts",
  "name": "TimelineEvent",
  "ownFileUses": 3,
  "tests": []
 },
 {
  "file": "routes/customers/kyc-view.ts",
  "name": "KycNotePreview",
  "ownFileUses": 1,
  "tests": []
 },
 {
  "file": "routes/customers/kyc-view.ts",
  "name": "KycResolveOption",
  "ownFileUses": 1,
  "tests": []
 },
 {
  "file": "routes/customers/policy-form.ts",
  "name": "readFyp",
  "ownFileUses": 2,
  "tests": [
   "policy-form.test.ts"
  ]
 },
 {
  "file": "routes/customers/policy-form.ts",
  "name": "PolicyValues",
  "ownFileUses": 1,
  "tests": []
 }
]
```

Ảnh: `editdate-alert.png` (hộp 6f với câu báo sai mốc), `editdate-ui.png` (hộp 6f sau khi gõ lại 24/01/2026), `birth-sort-ui.png` (bảng KH sắp "Ngày sinh" tăng dần).

## Phụ lục D — Nguồn test tạm / probe

Tất cả ở `C:\workspace\deep-review-1-4\claude\E\`; `node_modules` là junction tới `node_modules` của worktree review. Probe Vitest chạy bằng `node node_modules/vitest/vitest.mjs run --config vitest.probe.config.mts <tên>`; script `.mjs` chạy bằng `node`; probe exe cần exe bản sao `E\exe\project2c.exe` chạy với `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9334`.

### `vitest.probe.config.mts`

```ts
// Runs the gói E probes (probe-*.test.ts) against the review worktree, read-only.
// Usage (PowerShell, from this folder):
//   node node_modules/vitest/vitest.mjs run --config vitest.probe.config.mts [file filter]
// MUT (JSON {file, from, to}) serves ONE repo file mutated, as in vitest.mut.config.mts.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repo = 'C:/workspace/Project-2C-review';
const here = 'C:/workspace/deep-review-1-4/claude/E';
const mut = process.env.MUT ? JSON.parse(process.env.MUT) : null;
const target = mut ? resolve(repo, mut.file).replaceAll('\\', '/').toLowerCase() : null;

export default {
  root: here,
  cacheDir: `${here}/.vite-probe`,
  resolve: {
    alias: [
      { find: /^@p2c\/domain$/, replacement: `${repo}/packages/domain/src/index.ts` },
      { find: /^@p2c\/db$/, replacement: `${repo}/packages/db/src/index.ts` },
      { find: /^#app\/(.*)$/, replacement: `${repo}/apps/desktop/src/$1` },
      { find: /^#db\/(.*)$/, replacement: `${repo}/packages/db/src/$1` },
      { find: /^drizzle-orm$/, replacement: `${repo}/packages/db/node_modules/drizzle-orm/index.js` },
    ],
  },
  server: { fs: { allow: [repo, here, 'C:/workspace/deep-review-1-4/common'] } },
  plugins: [
    {
      name: 'p2c-mutate',
      enforce: 'pre' as const,
      load(id: string) {
        if (!mut) return null;
        const clean = id.split('?')[0]!.replaceAll('\\', '/').toLowerCase();
        if (clean !== target) return null;
        const source = readFileSync(resolve(repo, mut.file), 'utf8').replaceAll('\r\n', '\n');
        return source.replace(mut.from, mut.to);
      },
    },
  ],
  test: {
    include: ['probe-*.test.ts'],
    globals: true,
    testTimeout: 900_000,
    fileParallelism: false,
  },
};
```

### `vitest.mut.config.mts`

```ts
// Gói E "phá code" probe: runs the E-scope unit tests of the review worktree with ONE file served
// mutated (from the MUT env var: {file, from, to}); the repo is only read, never written.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = 'C:/workspace/Project-2C-review';
const mut = process.env.MUT ? JSON.parse(process.env.MUT) : null;
const target = mut ? resolve(ROOT, mut.file).replaceAll('\\', '/').toLowerCase() : null;

export default {
  root: ROOT,
  cacheDir: 'C:/workspace/deep-review-1-4/claude/E/.vite-mut',
  plugins: [
    {
      name: 'p2c-mutate',
      enforce: 'pre' as const,
      load(id: string) {
        if (!mut) return null;
        const clean = id.split('?')[0]!.replaceAll('\\', '/').toLowerCase();
        if (clean !== target) return null;
        const source = readFileSync(resolve(ROOT, mut.file), 'utf8').replaceAll('\r\n', '\n');
        const count = source.split(mut.from).length - 1;
        if (count !== 1) throw new Error(`mutation "${mut.from}" found ${count} times in ${mut.file}`);
        return source.replace(mut.from, mut.to);
      },
    },
  ],
  test: {
    include: [
      'apps/desktop/src/routes/appointments/**/*.test.ts',
      'apps/desktop/src/routes/customers/**/*.test.ts',
    ],
  },
};
```

### `probe-load.ts`

```ts
// Shared by the gói E probes: the load data (common/load/load-backup.json) read through the app's
// own list* commands, as the screens read it, and small timing / result helpers.
import { readFileSync, writeFileSync } from 'node:fs';
import {
  importBackup,
  listAppointments,
  listCustomers,
  listPeople,
  listPolicies,
  listStageTransitions,
  listTeams,
  type Database,
} from '@p2c/db';

export const LOAD = 'C:/workspace/deep-review-1-4/common/load/load-backup.json';
/** The load data is anchored on 05/10/2026 (load-summary.json); the clock of the probes too. */
export const NOW = () => new Date(Date.UTC(2026, 9, 5, 9, 0, 0));
export const TODAY = { year: 2026, month: 10, day: 5 } as const;

export async function loadDb(): Promise<Database> {
  const { db } = await importBackup(readFileSync(LOAD, 'utf8'), { now: NOW });
  return db;
}

export function readAll(db: Database) {
  return {
    appointments: listAppointments(db),
    customers: listCustomers(db),
    people: listPeople(db),
    teams: listTeams(db),
    transitions: listStageTransitions(db),
    policies: listPolicies(db),
  };
}

/** Median of `runs` runs after one warm-up, in ms with two decimals. */
export function median(fn: () => unknown, runs = 9): number {
  fn();
  const times: number[] = [];
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  return Math.round(times[Math.floor(runs / 2)]! * 100) / 100;
}

export function save(name: string, result: unknown): void {
  writeFileSync(
    `C:/workspace/deep-review-1-4/claude/E/${name}.result.json`,
    JSON.stringify(result, null, 1),
  );
}
```

### `probe-perf.test.ts`

```ts
// Probe gói E, trục P: the pure view code of Lịch hẹn and Khách hàng on the load data (1 496 KH,
// 10 434 lịch hẹn, 51 nhân sự), in Node, as each screen calls it. Median of 9 runs after a warm-up.
import { appointmentGroup, compareDates, isInPeriod, periodOf, type Scope } from '@p2c/domain';
import {
  appointmentRows,
  appointmentsByRe,
  dayBoard,
  monthGrid,
  outcomeResolver,
  rescheduleLinks,
  yearGrid,
} from '#app/routes/appointments/appointments-view';
import { priorMeetings, searchCustomers } from '#app/routes/appointments/appointment-form';
import { customerBoard } from '#app/routes/customers/customers-view';
import { kycTimeline } from '#app/routes/customers/kyc-view';
import { getKycProfile, listKycVersions, listStageTransitions, listAppointments } from '@p2c/db';
import { loadDb, median, readAll, save, TODAY } from './probe-load';

it('measures the Appointments and Customers view code on the load data', async () => {
  const db = await loadDb();
  const data = readAll(db);
  const out: Record<string, unknown> = {
    counts: {
      appointments: data.appointments.length,
      customers: data.customers.length,
      people: data.people.length,
      transitions: data.transitions.length,
    },
  };
  const all: Scope = { kind: 'all' };
  const team: Scope = { kind: 'team', teamId: data.teams[0]!.id };
  const re: Scope = { kind: 're', reId: data.people.find((p) => p.role === 'RE')!.id };
  const month = periodOf('month', TODAY);
  const year = periodOf('year', TODAY);

  const rowsAll = appointmentRows(data, all, 'any');
  const rowsTeam = appointmentRows(data, team, 'any');
  out.rows = { all: rowsAll.length, team: rowsTeam.length };

  // What the screen recomputes on every write (useQuery gives a new `data`).
  out.appointmentRows = {
    all: median(() => appointmentRows(data, all, 'any')),
    team: median(() => appointmentRows(data, team, 'any')),
    re: median(() => appointmentRows(data, re, 'any')),
  };
  const inPeriod = (period: typeof month) =>
    rowsAll.filter((row) => isInPeriod(row.appointment.date, period)).reverse();
  out.inPeriod = { month: median(() => inPeriod(month)), year: median(() => inPeriod(year)) };
  const yearRows = inPeriod(year);
  out.yearRowsInPeriod = yearRows.length;
  // `summary` (AppointmentsScreen.tsx:128-133): two filters over inPeriod, not memoised (every render).
  out.summaryYear = median(() => ({
    met: yearRows.filter((row) => row.appointment.status === 'MET').length,
    unrecorded: yearRows.filter((row) => appointmentGroup(row.appointment, TODAY) === 'unrecorded')
      .length,
  }));
  out.yearGrid = median(() => yearGrid(2026, rowsAll, TODAY));
  out.appointmentsByRe = median(() => appointmentsByRe(rowsTeam, month));

  // MonthCalendar (useMemo on day, rows, period, today) and DayTable (useMemo on rows, day):
  // both run again on every day click and every write.
  out.monthGrid = {
    all: median(() => monthGrid(TODAY, rowsAll, month, TODAY)),
    team: median(() => monthGrid(TODAY, rowsTeam, month, TODAY)),
  };
  out.dayBoard = {
    all: median(() => dayBoard(rowsAll, TODAY)),
    team: median(() => dayBoard(rowsTeam, TODAY)),
  };
  // The same month grid with the rows grouped by day first: what an index would cost.
  const indexed = () => {
    const byDay = new Map<string, number>();
    for (const row of rowsAll) {
      const d = row.appointment.date;
      if (d.year === TODAY.year && d.month === TODAY.month) {
        const key = `${d.day}`;
        byDay.set(key, (byDay.get(key) ?? 0) + 1);
      }
    }
    return byDay;
  };
  out.monthGridIndexedBaseline = median(indexed);
  out.dayClickAll = median(() => {
    monthGrid({ ...TODAY, day: 6 }, rowsAll, month, TODAY);
    dayBoard(rowsAll, { ...TODAY, day: 6 });
  });
  out.perWriteAllMonth = median(() => {
    const rows = appointmentRows(data, all, 'any');
    const list = rows.filter((row) => isInPeriod(row.appointment.date, month)).reverse();
    yearGrid(2026, rows, TODAY);
    monthGrid(TODAY, rows, month, TODAY);
    dayBoard(rows, TODAY);
    list.filter((row) => row.appointment.status === 'MET');
    list.filter((row) => appointmentGroup(row.appointment, TODAY) === 'unrecorded');
  });

  const a = data.appointments[Math.floor(data.appointments.length / 2)]!;
  out.rescheduleLinks = median(() => rescheduleLinks(data.appointments, a));
  out.outcomeResolver = median(() => outcomeResolver(data));

  // AppointmentDialog on the Appointments screen gets the whole data: picking a customer runs
  // priorMeetings over every appointment; typing in the customer field runs searchCustomers.
  const busiest = [...data.appointments.reduce((m, x) => m.set(x.customerId, (m.get(x.customerId) ?? 0) + 1), new Map<string, number>())]
    .sort((x, y) => y[1] - x[1])[0]!;
  out.busiestCustomerAppointments = busiest[1];
  out.priorMeetingsFullData = median(() => priorMeetings(data, busiest[0], TODAY));
  out.searchCustomers = {
    n: median(() => searchCustomers(data.customers, 'n', 6)),
    nguyen: median(() => searchCustomers(data.customers, 'nguyễn văn', 6)),
    none: median(() => searchCustomers(data.customers, 'zzzz', 6)),
  };

  // Customers screen: customerBoard (both picked and scope boards on a Team scope).
  out.customerBoard = {
    all: median(() => customerBoard(data, all)),
    team: median(() => customerBoard(data, team)),
  };
  const board = customerBoard(data, all);
  out.boardColumns = Object.fromEntries(
    Object.entries({ ...board.open, ...board.closed }).map(([k, v]) => [k, v.length]),
  );

  // Profile: the KYC timeline of the busiest customer.
  const profile = getKycProfile(db, busiest[0]);
  const versions = listKycVersions(db, busiest[0]);
  const transitions = listStageTransitions(db, busiest[0]);
  const appts = listAppointments(db, busiest[0]);
  out.kycTimeline = median(() => kycTimeline(transitions, profile.notes, versions, appts));
  out.readProfileLists = median(() => {
    listAppointments(db, busiest[0]);
    listStageTransitions(db, busiest[0]);
    getKycProfile(db, busiest[0]);
    listKycVersions(db, busiest[0]);
  });

  out.sanity = compareDates(rowsAll[0]!.appointment.date, rowsAll.at(-1)!.appointment.date);
  save('probe-perf', out);
  console.log(JSON.stringify(out, null, 1));
});
```

### `probe-editdate.test.ts`

```ts
// Probe gói E, trục C: the date EditOutcomeDialog (6f) puts in the TRANSITION_BEFORE_LATEST message
// when the day of a met meeting that made the customer's latest move is set before the move
// before it. The dialog takes `transitions.findLast(customer)` (EditOutcomeDialog.tsx:104), which
// is the meeting's own move; the command withdraws that move first and checks against the one
// before (appointments.ts:210-216, customers.ts:206-210). Load data, in memory, read-only.
import {
  DbError,
  editMeetingOutcome,
  listAppointments,
  listStageTransitions,
} from '@p2c/db';
import { addDays, daysBetween, formatDate } from '@p2c/domain';
import { errorMessage } from '#app/i18n';
import { loadDb, save } from './probe-load';

it('shows which date the edit dialog names when the command refuses the new day', async () => {
  const db = await loadDb();
  const transitions = listStageTransitions(db);
  const appointments = new Map(listAppointments(db).map((a) => [a.id, a]));
  // A customer whose latest move was made by a met meeting, with a move before it ≥ 3 days earlier.
  const byCustomer = Map.groupBy(transitions, (t) => t.customerId);
  let pick: { caused: (typeof transitions)[number]; before: (typeof transitions)[number] } | undefined;
  let candidates = 0;
  for (const list of byCustomer.values()) {
    const caused = list.at(-1)!;
    const before = list.at(-2);
    if (!caused.appointmentId || !before || !appointments.has(caused.appointmentId)) continue;
    if (daysBetween(before.date, caused.date) < 3) continue;
    candidates += 1;
    pick ??= { caused, before };
  }
  const { caused, before } = pick!;
  const a = appointments.get(caused.appointmentId!)!;
  const outcome = {
    status: 'MET' as const,
    stageAfter: a.stageAfter,
    nextStep: a.nextStep ?? 'x',
    expectedCaseSize: a.expectedCaseSize,
    outcomeReviewerId: a.outcomeReviewerId,
    note: a.note,
  };

  // What the dialog does on save, with the day typed one day before the move before.
  const typed = addDays(before.date, -1);
  let refused: unknown;
  try {
    editMeetingOutcome(db, a.id, outcome, { date: typed });
  } catch (error) {
    refused = error;
  }
  const dialogLatest = transitions.findLast((tr) => tr.customerId === a.customerId)!;
  const shown = errorMessage(refused, { date: formatDate(dialogLatest.date) });

  // A day after the move before but still before the meeting's own day is accepted.
  const between = addDays(before.date, 1);
  editMeetingOutcome(db, a.id, outcome, { date: between });
  const after = listAppointments(db, a.customerId).find((x) => x.id === a.id)!;

  const result = {
    candidates,
    meetingDay: formatDate(a.date),
    moveBefore: { date: formatDate(before.date), from: before.from, to: before.to },
    typed: formatDate(typed),
    code: refused instanceof DbError ? refused.code : String(refused),
    dialogDate: formatDate(dialogLatest.date),
    dialogIsTheMeetingsOwnMove: dialogLatest.id === caused.id,
    messageShown: shown,
    acceptedBetween: { typed: formatDate(between), savedDay: formatDate(after.date) },
  };
  save('probe-editdate', result);
  expect(result.code).toBe('TRANSITION_BEFORE_LATEST');
  expect(result.dialogIsTheMeetingsOwnMove).toBe(true);
});
```

### `probe-editdate-who.test.ts`

```ts
// Helper for probe-editdate: who the picked meeting is, to find it in the exe UI.
import { listAppointments, listCustomers, listPeople, listStageTransitions } from '@p2c/db';
import { daysBetween, formatDate } from '@p2c/domain';
import { loadDb, save } from './probe-load';

it('names the meeting probe-editdate picks', async () => {
  const db = await loadDb();
  const transitions = listStageTransitions(db);
  const appointments = new Map(listAppointments(db).map((a) => [a.id, a]));
  for (const list of Map.groupBy(transitions, (t) => t.customerId).values()) {
    const caused = list.at(-1)!;
    const before = list.at(-2);
    if (!caused.appointmentId || !before || !appointments.has(caused.appointmentId)) continue;
    if (daysBetween(before.date, caused.date) < 3) continue;
    const a = appointments.get(caused.appointmentId)!;
    const customer = listCustomers(db).find((c) => c.id === a.customerId)!;
    const re = listPeople(db).find((p) => p.id === a.reId)!;
    save('probe-editdate-who', { id: a.id, day: formatDate(a.date), time: a.time, customer: customer.name, code: customer.code, re: re.name });
    return;
  }
});
```

### `probe-labels.test.ts`

```ts
// Probe gói E, trục C (nhãn UI theo nghĩa thường), load data:
// 1. Dòng thời gian (kyc-view.ts meetingEvents): "Lịch hẹn lần n" — how many customers show the
//    same n on two different appointments, and why.
// 2. Bảng Khách hàng, cột "Ngày sinh" (CustomersScreen.tsx:80-85, kind 'text'): the order the
//    DataTable sort gives (compareCellsThen of packages/ui), against the order of the dates.
import { getKycProfile, listAppointments, listKycVersions, listStageTransitions } from '@p2c/db';
import { compareDates, formatDate } from '@p2c/domain';
import { compareCellsThen } from 'C:/workspace/Project-2C-review/packages/ui/src/components/compare-cells';
import { birthLabel } from '#app/routes/customers/customers-view';
import { kycTimeline } from '#app/routes/customers/kyc-view';
import { loadDb, readAll, save, TODAY } from './probe-load';

it('counts duplicated meeting numbers and sorts the birth column', async () => {
  const db = await loadDb();
  const data = readAll(db);
  const byCustomer = Map.groupBy(listAppointments(db), (a) => a.customerId);

  let customersWithDup = 0;
  const reasons: Record<string, number> = {};
  let example: unknown;
  for (const [customerId, appts] of byCustomer) {
    const events = kycTimeline(
      listStageTransitions(db, customerId),
      getKycProfile(db, customerId).notes,
      listKycVersions(db, customerId),
      appts,
    ).filter((e) => e.kind === 'meeting');
    const byNumber = Map.groupBy(
      events.filter((e) => e.number !== null),
      (e) => e.number,
    );
    const dups = [...byNumber.values()].filter((list) => list.length > 1);
    if (dups.length === 0) continue;
    customersWithDup += 1;
    for (const list of dups) {
      const kinds = list
        .map((e) => {
          const a = e.appointment;
          if (a.status === 'MET') return 'MET';
          return compareDates(a.date, TODAY) < 0 ? 'SCHEDULED-past(unrecorded)' : 'SCHEDULED-today/future';
        })
        .sort()
        .join(' + ');
      reasons[kinds] = (reasons[kinds] ?? 0) + 1;
    }
    example ??= dups[0]!.map((e) => ({
      date: formatDate(e.date),
      status: e.appointment.status,
      shown: `Lịch hẹn lần ${e.number}`,
    }));
  }

  // The birth column: values as the table reads them, sorted ascending as DataTable does.
  const births = data.customers
    .filter((c) => c.birthDate)
    .map((c) => ({ text: birthLabel(c.birthDate!), birth: c.birthDate! }));
  const sorted = [...births].sort((a, b) => compareCellsThen('text', a.text, b.text));
  const asDate = (b: (typeof births)[number]['birth']) =>
    'month' in b ? b : { year: b.year, month: 1, day: 1 };
  let outOfOrder = 0;
  for (let i = 1; i < sorted.length; i++) {
    if (compareDates(asDate(sorted[i - 1]!.birth), asDate(sorted[i]!.birth)) > 0) outOfOrder += 1;
  }
  const full = births.filter((b) => 'month' in b.birth).length;

  const result = {
    customersWithAppointments: byCustomer.size,
    customersWithDuplicatedMeetingNumber: customersWithDup,
    duplicateGroupsByKind: reasons,
    example,
    birthColumn: {
      withBirth: births.length,
      fullDates: full,
      yearOnly: births.length - full,
      adjacentPairsOutOfDateOrder: outOfOrder,
      firstTenAscending: sorted.slice(0, 10).map((b) => b.text),
      lastFiveAscending: sorted.slice(-5).map((b) => b.text),
    },
  };
  save('probe-labels', result);
});
```

### `probe-timeline.test.ts`

```ts
// Probe gói E, trục C: "Lịch hẹn lần n" of the timeline (kyc-view.ts meetingEvents) on two
// constructed histories the load data never holds (probe-labels: 0 customers): two planned
// appointments, and a past one still scheduled (unrecorded) followed by a met one.
import type { AppointmentRecord } from '@p2c/db';
import { kycTimeline } from '#app/routes/customers/kyc-view';
import { save } from './probe-load';

const appt = (id: string, date: string, status: AppointmentRecord['status']): AppointmentRecord => {
  const [day, month, year] = date.split('/').map(Number) as [number, number, number];
  return {
    id,
    customerId: 'c',
    reId: 'r',
    date: { year, month, day },
    time: null,
    status,
    triggerType: 'OTHER',
    triggerNote: null,
    stageAfter: status === 'MET' ? 'N3' : null,
    nextStep: status === 'MET' ? 'x' : null,
    expectedCaseSize: null,
    note: '',
    rescheduledFromId: null,
    outcomeReviewerId: null,
    coordinatorIds: [],
  } as unknown as AppointmentRecord;
};

const numbers = (appointments: AppointmentRecord[]) =>
  kycTimeline([], [], [], appointments)
    .filter((e) => e.kind === 'meeting')
    .reverse()
    .map((e) => `${e.id} ${e.appointment.status} → ${e.number === null ? 'Lịch hẹn' : `Lịch hẹn lần ${e.number}`}`);

it('numbers the meetings of two constructed histories', () => {
  const result = {
    twoPlanned: numbers([
      appt('A 01/09', '01/09/2026', 'MET'),
      appt('B 10/10', '10/10/2026', 'SCHEDULED'),
      appt('C 20/10', '20/10/2026', 'SCHEDULED'),
    ]),
    unrecordedThenMet: numbers([
      appt('A 01/08', '01/08/2026', 'MET'),
      appt('B 01/09', '01/09/2026', 'SCHEDULED'),
      appt('C 10/09', '10/09/2026', 'MET'),
    ]),
  };
  save('probe-timeline', result);
});
```

### `probe-profile.test.ts`

```ts
// Probe gói E, trục P: what the customer profile reads on open and after every write
// (CustomerProfile.tsx readProfile, copied call for call), on the load data, for the customer
// with the most appointments. Median of 9 runs.
import {
  getCustomer,
  getKycProfile,
  listAppointments,
  listKycVersions,
  listPeople,
  listPolicies,
  listStageTransitions,
  listTeams,
} from '@p2c/db';
import { kycTimeline } from '#app/routes/customers/kyc-view';
import { loadDb, median, save } from './probe-load';

it('measures readProfile on the load data', async () => {
  const db = await loadDb();
  const counts = new Map<string, number>();
  for (const a of listAppointments(db)) counts.set(a.customerId, (counts.get(a.customerId) ?? 0) + 1);
  const id = [...counts].sort((x, y) => y[1] - x[1])[0]![0];
  const readProfile = () => {
    const customer = getCustomer(db, id)!;
    const people = listPeople(db);
    const teams = listTeams(db);
    const transitions = listStageTransitions(db, id);
    return {
      customer,
      people,
      teams,
      policies: listPolicies(db).filter((p) => p.customerId === id),
      transitions,
      kyc: getKycProfile(db, id),
      versions: listKycVersions(db, id),
      appointments: listAppointments(db, id),
    };
  };
  const p = readProfile();
  save('probe-profile', {
    appointmentsOfCustomer: p.appointments.length,
    readProfileMs: median(readProfile),
    listPoliciesAllMs: median(() => listPolicies(db)),
    timelineMs: median(() => kycTimeline(p.transitions, p.kyc.notes, p.versions, p.appointments)),
  });
});
```

### `probe-order.test.ts`

```ts
// Probe gói E (CL-B10, new places): lists of gói E that take the repository's BINARY name order:
// the customer search of AppointmentDialog (searchCustomers "by name", first 6 only) and the
// coordinator lists (AppointmentsScreen.tsx:138-140 filter, AppointmentDialog.tsx:226-228,
// reviewerChoices). Load data.
import { searchCustomers } from '#app/routes/appointments/appointment-form';
import { personLabel, reviewerChoices } from '#app/routes/appointments/appointments-view';
import { loadDb, readAll, save } from './probe-load';

const vi = new Intl.Collator('vi').compare;
const plain = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd');

it('shows the order of the search and of the coordinator lists', async () => {
  const data = readAll(await loadDb());
  const query = 'thảo';
  const shown = searchCustomers(data.customers, query, 6).map((c) => c.name);
  const all = data.customers.filter((c) => plain(c.name).includes(plain(query))).map((c) => c.name);
  const coordinators = data.people.filter((p) => p.role !== 'RE').map(personLabel);
  const firstOutOfOrder = (list: string[]) =>
    list.findIndex((name, i) => i > 0 && vi(list[i - 1]!, name) > 0);
  save('probe-order', {
    search: {
      query,
      matches: all.length,
      shownFirstSix: shown,
      viCollatedFirstSix: [...all].sort(vi).slice(0, 6),
      matchesStartingWithĐ: all.filter((n) => n.startsWith('Đ')).length,
    },
    coordinatorList: coordinators,
    coordinatorListFirstOutOfViOrder: firstOutOfOrder(coordinators),
    reviewerList: reviewerChoices(data.people).map(personLabel),
  });
});
```

### `mutate.mjs`

```js
// Deep review Phase 1–4, gói E: "phá code" probe. For each mutation, runs the E-scope unit tests
// (vitest.mut.config.mts) with one file served mutated, and records killed / survived.
// The repo is never written. Usage: node mutate.mjs [name-prefix]
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const HERE = 'C:/workspace/deep-review-1-4/claude/E';
const ROOT = 'C:/workspace/Project-2C-review';
const VITEST = `${ROOT}/node_modules/vitest/vitest.mjs`;
const A = 'apps/desktop/src/routes/appointments/';
const C = 'apps/desktop/src/routes/customers/';

/** [name, file, from, to] — `from` must occur exactly once in the file. */
const MUTATIONS = [
  // appointments-view.ts
  ['AV1 outcomeText ignores RF', `${A}appointments-view.ts`, "t(outcome.rf ? 'appointments.moveRf' : 'appointments.move', {", "t('appointments.move', {"],
  ['AV2 statusLabel never unrecorded', `${A}appointments-view.ts`, "return appointmentGroup(a, today) === 'unrecorded'", 'return false'],
  ['AV3 summary always with unrecorded', `${A}appointments-view.ts`, 'counts.unrecorded > 0 ?', 'counts.unrecorded >= 0 ?'],
  ['AV4 dateTone today is past', `${A}appointments-view.ts`, "return order < 0 ? 'past'", "return order <= 0 ? 'past'"],
  ['AV5 reviewerChoices keeps everyone', `${A}appointments-view.ts`, 'people.filter((person) => REVIEWER_ROLES.includes(person.role))', 'people.filter(() => true)'],
  ['AV6 keep without MET check', `${A}appointments-view.ts`, "if (a.status === 'MET' && a.stageAfter)", 'if (a.stageAfter)'],
  ['AV7 new day keyed by own id', `${A}appointments-view.ts`, '[[a.rescheduledFromId, a.date] as const]', '[[a.id, a.date] as const]'],
  ['AV8 coordinator none = at most one', `${A}appointments-view.ts`, 'a.coordinatorIds.length === 0', 'a.coordinatorIds.length <= 1'],
  ['AV9 rows ignore scope', `${A}appointments-view.ts`, '.filter((a) => inScope(data.people, a.reId, scope) && matchesCoordinator(a, coordinator))', '.filter((a) => matchesCoordinator(a, coordinator))'],
  ['AV10 rows without team', `${A}appointments-view.ts`, 'team: re?.teamId ? teams.get(re.teamId) : undefined,', 'team: undefined,'],
  ['AV11 rows without coordinators', `${A}appointments-view.ts`, 'coordinators: a.coordinatorIds.flatMap((id) => people.get(id) ?? []),', 'coordinators: [],'],
  ['AV12 byRe ignores period', `${A}appointments-view.ts`, 'if (isInPeriod(a.date, period)) counts.set', 'counts.set'],
  ['AV13 reveal outsideScope inverted', `${A}appointments-view.ts`, 'outsideScope: !inScope(', 'outsideScope: inScope('],
  ['AV14 reveal always clears filter', `${A}appointments-view.ts`, "coordinator: matchesCoordinator(created, coordinator) ? coordinator : 'any',", "coordinator: 'any',"],
  ['AV15 rescheduleLinks to = from', `${A}appointments-view.ts`, 'to: appointments.find((other) => other.rescheduledFromId === a.id),', 'to: appointments.find((other) => other.id === a.rescheduledFromId),'],
  ['AV16 groupTotal drops planned', `${A}appointments-view.ts`, 'counts.met + counts.missed + counts.unrecorded + counts.planned', 'counts.met + counts.missed + counts.unrecorded'],
  ['AV17 month banded', `${A}appointments-view.ts`, "const banded = period.kind === 'week' || period.kind === 'custom';", "const banded = period.kind !== 'day';"],
  ['AV18 every day in month', `${A}appointments-view.ts`, 'inMonth: day.month === date.month,', 'inMonth: true,'],
  ['AV19 grid counts days up to cell', `${A}appointments-view.ts`, 'if (compareDates(row.appointment.date, day) === 0) {', 'if (compareDates(row.appointment.date, day) <= 0) {'],
  ['AV20 grid one week short', `${A}appointments-view.ts`, 'if (compareDates(span.end, month.end) >= 0) return weeks;', 'if (compareDates(span.end, month.end) >= -6) return weeks;'],
  ['AV21 year state ignores year', `${A}appointments-view.ts`, 'const order = year === today.year ? i + 1 - today.month : year - today.year;', 'const order = i + 1 - today.month;'],
  ['AV22 yearGrid ignores year', `${A}appointments-view.ts`, 'const cell = a.date.year === year ? counts[a.date.month - 1] : undefined;', 'const cell = counts[a.date.month - 1];'],
  ['AV23 pickDay custom keeps period', `${A}appointments-view.ts`, "return period.kind === 'custom' ? null : periodOf(period.kind, date);", "return period.kind === 'custom' ? period : periodOf(period.kind, date);"],
  ['AV24 pickDay always moves', `${A}appointments-view.ts`, '  if (isInPeriod(date, period)) return period;\n', '\n'],
  ['AV25 dayBoard time reversed', `${A}appointments-view.ts`, "(a.appointment.time ?? '').localeCompare(b.appointment.time ?? ''),", "(b.appointment.time ?? '').localeCompare(a.appointment.time ?? ''),"],
  ['AV26 dayBoard teams unsorted', `${A}appointments-view.ts`, "    .sort((a, b) => byName(a.team?.name ?? '', b.team?.name ?? ''))\n", '\n'],
  ['AV27 dayBoard REs unsorted', `${A}appointments-view.ts`, "        .sort((a, b) => byName(a.re?.name ?? '', b.re?.name ?? '')),", '        ,'],
  ['AV28 dayBoard ignores date', `${A}appointments-view.ts`, '    if (compareDates(row.appointment.date, date) !== 0) continue;\n', '\n'],
  // appointment-form.ts
  ['AF1 fromToday allows yesterday', `${A}appointment-form.ts`, "if (mode === 'fromToday' && read.daysFromToday < 0)", "if (mode === 'fromToday' && read.daysFromToday < -1)"],
  ['AF2 dayText always drops year', `${A}appointment-form.ts`, 'date.year === today.year ? formatDayMonth(date) : formatDate(date);', 'formatDayMonth(date);'],
  ['AF3 withTime drops time', `${A}appointment-form.ts`, '(time ? `${day} ${time}` : day)', '(day)'],
  ['AF4 parseTime no padding', `${A}appointment-form.ts`, "match[1]?.padStart(2, '0')", 'match[1]'],
  ['AF5 parseTime accepts 24h', `${A}appointment-form.ts`, 'Number(match[1]) > 23', 'Number(match[1]) > 24'],
  ['AF6 parseTime accepts :60', `${A}appointment-form.ts`, 'Number(match[2]) > 59', 'Number(match[2]) > 60'],
  ['AF7 isPastOrToday excludes today', `${A}appointment-form.ts`, 'compareDates(date, today) <= 0', 'compareDates(date, today) < 0'],
  ['AF8 prior includes future', `${A}appointment-form.ts`, '.filter((a) => a.customerId === customerId && isPastOrToday(a.date, today))', '.filter((a) => a.customerId === customerId)'],
  ['AF9 prior same-day time order reversed', `${A}appointment-form.ts`, "(b.time ?? '').localeCompare(a.time ?? '')", "(a.time ?? '').localeCompare(b.time ?? '')"],
  ['AF10 lastMet is the oldest', `${A}appointment-form.ts`, 'lastMet: met[0]?.date ?? null,', 'lastMet: met.at(-1)?.date ?? null,'],
  ['AF11 search keeps accents', `${A}appointment-form.ts`, ".normalize('NFD').replace(/\\p{M}/gu, '')", ".normalize('NFD')"],
  ['AF12 search keeps đ', `${A}appointment-form.ts`, ".replace(/đ/g, 'd')", ''],
  ['AF13 search ignores code', `${A}appointment-form.ts`, ' || plain(c.code).includes(needle)', ''],
  ['AF14 search limit + 1', `${A}appointment-form.ts`, '.slice(0, limit);', '.slice(0, limit + 1);'],
  ['AF15 search untrimmed', `${A}appointment-form.ts`, 'const needle = plain(query.trim());', 'const needle = plain(query);'],
  // outcome-form.ts
  ['OF1 case size zero ok', `${A}outcome-form.ts`, 'size.amount > 0 ? size', 'size.amount >= 0 ? size'],
  ['OF2 moved not closed', `${A}outcome-form.ts`, '      moved ||\n', '      false ||\n'],
  ['OF3 any status reschedules', `${A}outcome-form.ts`, "? appointment.status !== 'SCHEDULED'", '? false'],
  ['OF4 cancel waits for the day', `${A}outcome-form.ts`, ": value !== 'CANCELLED' && !arrived", ': !arrived'],
  ['OF5 lock: first move, not latest', `${A}outcome-form.ts`, 'transitions.findLast((tr) => tr.customerId === appointment.customerId)', 'transitions.find((tr) => tr.customerId === appointment.customerId)'],
  ['OF6 current stage not choosable', `${A}outcome-form.ts`, 'allowed: stage === current || reachable.includes(stage),', 'allowed: reachable.includes(stage),'],
  ['OF7 withoutError keeps errors', `${A}outcome-form.ts`, 'errors.filter((error) => error !== field)', 'errors.filter(() => true)'],
  ['OF8 next step untrimmed', `${A}outcome-form.ts`, 'const nextStep = draft.nextStep.trim();', 'const nextStep = draft.nextStep;'],
  ['OF9 reviewer empty string kept', `${A}outcome-form.ts`, 'outcomeReviewerId: draft.reviewerId || null,', "outcomeReviewerId: draft.reviewerId as string | null,"],
  ['OF10 next time error ignored', `${A}outcome-form.ts`, "  if (next && !next.time.ok) errors.push('nextTime');\n", '\n'],
  ['OF11 case size error ignored', `${A}outcome-form.ts`, "    if (size && !size.ok) errors.push('caseSize');\n", '\n'],
  ['OF12 non-met keeps stage after', `${A}outcome-form.ts`, "  if (draft.status === 'MET') {\n    const nextStep", "  if (draft.status !== 'NO_SHOW') {\n    const nextStep"],
  // MetFields.tsx (metDraftOf)
  ['MF1 case size not filled', `${A}MetFields.tsx`, "caseSize: a.expectedCaseSize === null ? '' : formatVnd(a.expectedCaseSize),", "caseSize: '',"],
  ['MF2 reviewer not filled', `${A}MetFields.tsx`, "reviewerId: a.outcomeReviewerId ?? '',", "reviewerId: '',"],
  // customers-view.ts
  ['CV1 since = first transition', `${C}customers-view.ts`, 'for (const transition of data.transitions) since.set(transition.customerId, transition.date);', 'for (const transition of data.transitions) if (!since.has(transition.customerId)) since.set(transition.customerId, transition.date);'],
  ['CV2 board oldest first', `${C}customers-view.ts`, 'compareDates(b.since, a.since) ||', 'compareDates(a.since, b.since) ||'],
  ['CV3 no name tie-break', `${C}customers-view.ts`, ' || byName(a.customer.name, b.customer.name))', ')'],
  ['CV4 openByRe counts closed', `${C}customers-view.ts`, 'for (const { customer } of PIPELINE_STAGES.flatMap((s) => open[s])) {', 'for (const { customer } of cards) {'],
  ['CV5 openCount counts closed', `${C}customers-view.ts`, 'openCount: cards.length - closedCount,', 'openCount: cards.length,'],
  ['CV6 record date allows future', `${C}customers-view.ts`, "  return compareDates(parsed.date, today) > 0\n    ? { ok: false, error: 'future' }", "  return false\n    ? { ok: false, error: 'future' }"],
  ['CV7 birth: inferred year ok', `${C}customers-view.ts`, "  if (parsed.yearInferred) return { ok: false, error: 'format' };\n", '\n'],
  ['CV8 birth year next year ok', `${C}customers-view.ts`, ': year > today.year;', ': year > today.year + 1;'],
  ['CV9 birth today refused', `${C}customers-view.ts`, 'const tooLate = year === null ? compareDates(parsed.date, today) > 0', 'const tooLate = year === null ? compareDates(parsed.date, today) >= 0'],
  ['CV10 age: birthday counted a day late', `${C}customers-view.ts`, 'compareDates({ ...birth, year: today.year }, today) <= 0', 'compareDates({ ...birth, year: today.year }, today) < 0'],
  ['CV11 age from year minus one', `${C}customers-view.ts`, "if (!('month' in birth)) return age;", "if (!('month' in birth)) return age - 1;"],
  ['CV12 birthLabel year only', `${C}customers-view.ts`, "return 'month' in birth ? formatDate(birth) : String(birth.year);", 'return String(birth.year);'],
  ['CV13 policy count max 1', `${C}customers-view.ts`, '(policies.get(policy.customerId) ?? 0) + 1', '1'],
  ['CV14 board ignores scope', `${C}customers-view.ts`, '    .filter((customer) => inScope(data.people, customer.reId, scope))\n', '\n'],
  // kyc-view.ts
  ['KV1 overview keeps superseded', `${C}kyc-view.ts`, "facts.filter((f) => f.category === category && f.status !== 'superseded')", 'facts.filter((f) => f.category === category)'],
  ['KV2 core only if all core', `${C}kyc-view.ts`, 'conflicts.some((f) => KYC_FIELDS[f.field].core)', 'conflicts.every((f) => KYC_FIELDS[f.field].core)'],
  ['KV3 present = any fact', `${C}kyc-view.ts`, 'present: gate.presentCategories.includes(category),', 'present: current.length > 0,'],
  ['KV4 yes/no swapped', `${C}kyc-view.ts`, 'value ? words.yes : words.no', 'value ? words.no : words.yes'],
  ['KV5 planned not numbered', `${C}kyc-view.ts`, "const counted = appointment.status === 'MET' || appointment.status === 'SCHEDULED';", "const counted = appointment.status === 'MET';"],
  ['KV6 planned counted as met', `${C}kyc-view.ts`, "    if (appointment.status === 'MET') met += 1;", '    if (counted) met += 1;'],
  ['KV7 meeting ranked after version', `${C}kyc-view.ts`, 'const RANK = { meeting: -1, stage: 0, note: 1, version: 2 } as const;', 'const RANK = { meeting: 3, stage: 0, note: 1, version: 2 } as const;'],
  ['KV8 timeline not reversed first', `${C}kyc-view.ts`, '    .reverse()\n    .sort(', '    .sort('],
  ['KV9 manual material ignored', `${C}kyc-view.ts`, 'material: version.material || manualMaterial,', 'material: version.material,'],
  ['KV10 next version number', `${C}kyc-view.ts`, 'number: versions.length + 1,', 'number: versions.length,'],
  ['KV11 resolve never disabled', `${C}kyc-view.ts`, 'disabled: KYC_FIELDS[field].fromProfile && !system,', 'disabled: false,'],
  ['KV12 resolve any status', `${C}kyc-view.ts`, ".filter((fact) => fact.field === field && fact.status === 'conflict')", '.filter((fact) => fact.field === field)'],
  ['KV13 preview conflict as update', `${C}kyc-view.ts`, 'after = fact.conflict ? markConflict(after, input) : confirmFact(after, input);', 'after = confirmFact(after, input);'],
  // policy-form.ts
  ['PF1 FYP zero ok', `${C}policy-form.ts`, 'if (parsed.ok && parsed.amount <= 0)', 'if (parsed.ok && parsed.amount < 0)'],
  ['PF2 issue a day before submission ok', `${C}policy-form.ts`, 'return daysAfter < 0', 'return daysAfter < -1'],
  ['PF3 same month ignores year', `${C}policy-form.ts`, '    before.year === next.issuedDate.year &&\n', '\n'],
  ['PF4 diff from submitted', `${C}policy-form.ts`, 'const diff = next.issuedFyp - (saved.issuedFyp ?? 0);', 'const diff = next.issuedFyp - saved.submittedFyp;'],
  ['PF5 effect always up', `${C}policy-form.ts`, "const key = metric.diff < 0 ? 'Down' : 'Up';", "const key = 'Up';"],
  ['PF6 case size of oldest meeting', `${C}policy-form.ts`, '.sort((a, b) => compareDates(b.date, a.date))[0];', '.sort((a, b) => compareDates(a.date, b.date))[0];'],
  ['PF7 case size of any status', `${C}policy-form.ts`, ".filter((a) => a.status === 'MET' && a.expectedCaseSize !== null)", '.filter((a) => a.expectedCaseSize !== null)'],
  ['PF8 policy despite bad issued FYP', `${C}policy-form.ts`, '(issuedFyp?.ok ?? true)', 'true'],
  ['PF9 RE name untrimmed', `${C}policy-form.ts`, "re: reName?.trim() ?? '',", "re: reName ?? '',"],
];

const filter = process.argv[2];
const results = {};
writeFileSync(`${HERE}/mutate.log`, '');
for (const [name, file, from, to] of MUTATIONS) {
  if (filter && !name.startsWith(filter)) continue;
  const source = readFileSync(`${ROOT}/${file}`, 'utf8').replaceAll('\r\n', '\n');
  const count = source.split(from).length - 1;
  if (count !== 1) {
    results[name] = { verdict: 'BAD-MUTATION', failing: `found ${count} times` };
    console.log(`BAD-MUTATION ${name} (found ${count} times)`);
    continue;
  }
  const run = spawnSync(
    process.execPath,
    [VITEST, 'run', '--config', `${HERE}/vitest.mut.config.mts`, '--reporter=dot', '--bail=1'],
    { env: { ...process.env, MUT: JSON.stringify({ file, from, to }) }, encoding: 'utf8', cwd: HERE },
  );
  const out = `${run.stdout}\n${run.stderr}`;
  let verdict;
  if (/found \d+ times/.test(out)) verdict = 'BAD-MUTATION';
  else if (run.status === 0) verdict = 'SURVIVED';
  else verdict = 'KILLED';
  const failing = [...out.matchAll(/FAIL\s+(\S+)\s+>\s+([^\n]+)/g)].map((m) => `${m[1]} > ${m[2]}`)[0] ?? '';
  results[name] = { verdict, failing };
  console.log(`${verdict.padEnd(12)} ${name}${failing ? `  [${failing}]` : ''}`);
  appendFileSync(`${HERE}/mutate.log`, `\n===== ${name} (${verdict})\n${out.slice(-3000)}\n`);
}
writeFileSync(`${HERE}/mutate-results.json`, JSON.stringify(results, null, 1));
const tally = Object.values(results).reduce((t, r) => ({ ...t, [r.verdict]: (t[r.verdict] ?? 0) + 1 }), {});
console.log(JSON.stringify(tally));
```

### `e2e-mut.mjs`

```js
// Deep review Phase 1–4, gói E: "phá code" for the React screens (TSX), which only e2e covers.
// For each mutation: builds the web app with ONE file served mutated (Vite load hook) into
// E\dist-mut (never the repo's dist), serves it on the e2e port, and runs the related Playwright
// specs against it (PW_REUSE=1, output in E\pw-out). The repo is only read.
// Usage (PowerShell): node e2e-mut.mjs [name-prefix]     ("BASE" runs every spec unmutated)
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const HERE = 'C:/workspace/deep-review-1-4/claude/E';
const ROOT = 'C:/workspace/Project-2C-review';
const APP = `${ROOT}/apps/desktop`;
const OUT = `${HERE}/dist-mut`;
const PW = `${ROOT}/node_modules/@playwright/test/cli.js`;
const A = 'apps/desktop/src/routes/appointments/';
const C = 'apps/desktop/src/routes/customers/';
const APPTS = ['e2e/appointments.spec.ts'];
const OUTCOME = ['e2e/appointment-outcome.spec.ts'];
const CUST = ['e2e/customers.spec.ts', 'e2e/customer-forms.spec.ts'];
const PROFILE = ['e2e/customer-appointments.spec.ts', 'e2e/customer-kyc.spec.ts', 'e2e/customer-policies.spec.ts'];

/** [name, file, from, to, specs] — `from` must occur exactly once in the file. */
const MUTATIONS = [
  ['BASE no mutation', null, null, null, [...APPTS, ...OUTCOME, ...CUST, ...PROFILE]],
  ['T1 dots: unrecorded last', `${A}AppointmentsScreen.tsx`, "const DOT_ORDER = ['unrecorded', 'missed', 'met', 'planned'] as const;", "const DOT_ORDER = ['missed', 'met', 'planned', 'unrecorded'] as const;", APPTS],
  ['T2 next offered for future', `${A}AppointmentsScreen.tsx`, '{row.customer && isPastOrToday(a.date, today) && (', '{row.customer && (', APPTS],
  ['T3 delete offered for any status', `${A}AppointmentsScreen.tsx`, "{a.status === 'SCHEDULED' && row.customer && (\n          <Button onClick={() => onDelete(row)}>", '{row.customer && (\n          <Button onClick={() => onDelete(row)}>', [...APPTS, ...OUTCOME]],
  ['T4 month line: no unrecorded', `${A}AppointmentsScreen.tsx`, 'unrecorded: sum((cell) => cell.unrecorded),', 'unrecorded: 0,', APPTS],
  ['T5 list not newest first on ties', `${A}AppointmentsScreen.tsx`, '() => rows.filter((row) => isInPeriod(row.appointment.date, period)).reverse(),', '() => rows.filter((row) => isInPeriod(row.appointment.date, period)),', APPTS],
  ['T6 quarter total = met only', `${A}YearGrid.tsx`, 'months.reduce((sum, cell) => sum + total(cell), 0)', 'months.reduce((sum, cell) => sum + cell.met, 0)', APPTS],
  ['T7 reschedule: same day+time accepted', `${A}RescheduleFields.tsx`, 'date.ok && time.ok && compareDates(date.date, old.date) === 0 && time.time === old.time;', 'false;', APPTS],
  ['T8 outcome: no default status', `${A}OutcomeDialog.tsx`, "choices.find((choice) => !choice.disabled && choice.value === 'MET') ? 'MET' : null,", 'null,', OUTCOME],
  ['T9 outcome: next booking dropped', `${A}OutcomeDialog.tsx`, 'next: booking ? { date: nextDate, time: nextTime } : null,', 'next: null,', OUTCOME],
  ['T10 outcome: error without date', `${A}OutcomeDialog.tsx`, "setFailure(errorMessage(error, { date: latest ? formatDate(latest.date) : '' }));", 'setFailure(errorMessage(error));', OUTCOME],
  ['T11 edit: stage after not locked', `${A}EditOutcomeDialog.tsx`, 'stageLocked={later !== undefined}', 'stageLocked={false}', OUTCOME],
  ['T12 edit: delete not blocked', `${A}EditOutcomeDialog.tsx`, '<Button onClick={() => setDeleting(true)} disabled={later !== undefined}>', '<Button onClick={() => setDeleting(true)}>', OUTCOME],
  ['T13 edit: error without date', `${A}EditOutcomeDialog.tsx`, "setFailure(errorMessage(error, { date: latest ? formatDate(latest.date) : '' }));", 'setFailure(errorMessage(error));', OUTCOME],
  ['T14 stage dialog: error without date', `${C}CustomerDialogs.tsx`, 'setErrors({ form: errorMessage(failure, { date: formatDate(since) }) });', 'setErrors({ form: errorMessage(failure) });', CUST],
  ['T15 kanban: no column limit', `${C}CustomersScreen.tsx`, '{board.open[stage].slice(0, COLUMN_LIMIT).map((card) => (', '{board.open[stage].map((card) => (', CUST],
  ['T16 profile: since = first move', `${C}CustomerProfile.tsx`, 'const since = transitions.at(-1)!.date;', 'const since = transitions[0]!.date;', [...CUST, ...PROFILE]],
  ['T17 profile list: met count 0', `${C}CustomerAppointments.tsx`, "met: appointments.filter((a) => a.status === 'MET').length,", 'met: 0,', PROFILE],
  ['T18 KYC: no resolve button', `${C}CustomerKyc.tsx`, '{conflicting.map((field) => (', '{conflicting.slice(0, 0).map((field) => (', PROFILE],
  // Survivors of the unit mutations (mutate.mjs) whose code only the screens read: does e2e hold them?
  ['U1 withTime drops time (AF3)', `${A}appointment-form.ts`, '(time ? `${day} ${time}` : day)', '(day)', [...APPTS, ...PROFILE]],
  ['U2 fromToday allows yesterday (AF1)', `${A}appointment-form.ts`, "if (mode === 'fromToday' && read.daysFromToday < 0)", "if (mode === 'fromToday' && read.daysFromToday < -1)", [...APPTS, ...OUTCOME, ...PROFILE]],
  ['U3 withoutError keeps errors (OF7)', `${A}outcome-form.ts`, 'errors.filter((error) => error !== field)', 'errors.filter(() => true)', OUTCOME],
  ['U4 effect diff from submitted (PF4)', `${C}policy-form.ts`, 'const diff = next.issuedFyp - (saved.issuedFyp ?? 0);', 'const diff = next.issuedFyp - saved.submittedFyp;', PROFILE],
  ['T19 policy list: oldest first', `${C}CustomerPolicies.tsx`, '.sort((a, b) => compareDates(b.submittedDate, a.submittedDate))', '.sort((a, b) => compareDates(a.submittedDate, b.submittedDate))', PROFILE],
];

const vitePath = createRequire(`${APP}/package.json`).resolve('vite');
const { build, preview } = await import(pathToFileURL(vitePath).href);
process.env.VITE_DEMO_ANCHOR = '15/09/2026';

const mutatePlugin = (file, from, to) => ({
  name: 'p2c-mutate',
  enforce: 'pre',
  load(id) {
    if (!file) return null;
    const clean = id.split('?')[0].replaceAll('\\', '/').toLowerCase();
    if (clean !== resolve(ROOT, file).replaceAll('\\', '/').toLowerCase()) return null;
    const source = readFileSync(resolve(ROOT, file), 'utf8').replaceAll('\r\n', '\n');
    return source.replace(from, to);
  },
});

const filter = process.argv[2];
const resultsFile = `${HERE}/e2e-mut-results.json`;
let results = {};
try {
  results = JSON.parse(readFileSync(resultsFile, 'utf8'));
} catch {}
for (const [name, file, from, to, specs] of MUTATIONS) {
  if (filter ? !name.startsWith(filter) : name.startsWith('BASE')) continue;
  if (file) {
    const source = readFileSync(`${ROOT}/${file}`, 'utf8').replaceAll('\r\n', '\n');
    const count = source.split(from).length - 1;
    if (count !== 1) {
      results[name] = { verdict: 'BAD-MUTATION', detail: `found ${count} times` };
      console.log(`BAD-MUTATION ${name} (found ${count} times)`);
      continue;
    }
  }
  const started = Date.now();
  await build({
    root: APP,
    configFile: `${APP}/vite.config.ts`,
    logLevel: 'error',
    cacheDir: `${HERE}/.vite-e2e`,
    build: { outDir: OUT, emptyOutDir: true },
    plugins: [mutatePlugin(file, from, to)],
  });
  const server = await preview({
    root: APP,
    configFile: `${APP}/vite.config.ts`,
    logLevel: 'error',
    build: { outDir: OUT },
    preview: { port: 4173, strictPort: true },
  });
  // Asynchronous: the preview server runs in this process and must keep answering.
  const run = await new Promise((done) => {
    const child = spawn(
      process.execPath,
      [PW, 'test', ...specs, '--project=edge', '--no-deps', `--output=${HERE}/pw-out`, '--reporter=line'],
      { cwd: ROOT, env: { ...process.env, PW_REUSE: '1', CI: '' } },
    );
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('close', (status) => done({ status, stdout, stderr }));
  });
  await server.close();
  const out = `${run.stdout}\n${run.stderr}`;
  // The list of failures after the run: "  1) [edge] › e2e\file.spec.ts:12:1 › title".
  const failed = [...out.matchAll(/^\s+\d+\) \[edge\] › ([^\n]+)/gm)].map((m) => m[1].trim());
  const summary = out.match(/(\d+) (passed|failed)[^\n]*/g) ?? [];
  const verdict = file === null ? (run.status === 0 ? 'GREEN' : 'RED') : run.status === 0 ? 'SURVIVED' : 'KILLED';
  results[name] = { verdict, specs, summary, firstFailing: failed[0] ?? '', seconds: Math.round((Date.now() - started) / 1000) };
  console.log(`${verdict.padEnd(10)} ${name} ${summary.join(' / ')} ${failed[0] ?? ''}`);
  appendFileSync(`${HERE}/e2e-mut.log`, `\n===== ${name} (${verdict})\n${out.slice(-4000)}\n`);
  writeFileSync(resultsFile, JSON.stringify(results, null, 1));
}
process.exit(0);
```

### `cdp.mjs`

```js
// Probe (gói E): drives the release exe copy in E\exe (built at f0c53eb by gói D, copied with its
// load-data file) through WebView2's remote debugging port 9334. Copy of D\cdp.mjs.
// Usage: node cdp.mjs eval <file.js>   — runs the file's body as an async function in the page
//        node cdp.mjs key <Key> [n]    — presses a key n times (CDP input)
// The exe is started with WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9334.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const [, , cmd, a, b] = process.argv;
const browser = await chromium.connectOverCDP('http://127.0.0.1:9334');
const page = browser.contexts()[0].pages()[0];
let out;
if (cmd === 'eval') {
  const body = readFileSync(a, 'utf8');
  out = await page.evaluate(`(async () => { ${body} })()`);
} else if (cmd === 'key') {
  for (let i = 0; i < Number(b ?? 1); i++) await page.keyboard.press(a);
  out = 'pressed';
}
console.log(JSON.stringify(out, null, 1));
await browser.close().catch(() => {});
process.exit(0);
```

### `perf-dayclick.js`

```js
// Probe body (gói E): Lịch hẹn, kỳ Tháng, load data in the exe. A click on a day of the month
// calendar changes only `day`: the list (DataTable) keeps its rows, but MonthCalendar runs
// monthGrid (42 cells × every row in scope) and DayTable runs dayBoard again.
// Measured from the click to the next frame, per scope: Toàn bộ, then a team.
const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const timed = async (act) => {
  const start = performance.now();
  act();
  await frame();
  return Math.round(performance.now() - start);
};
location.hash = '#/appointments';
await wait(2000);
const radio = (name) =>
  [...document.querySelectorAll('[role=radio]')].find((b) => b.textContent.trim() === name);
const days = () => [...document.querySelectorAll('[aria-labelledby=appointments-calendar] button[aria-pressed]')];
const out = {};
for (const scope of ['Toàn bộ', 'Team']) {
  radio(scope)?.click();
  await wait(1000);
  radio('Tháng')?.click();
  await wait(1000);
  const clicks = [];
  for (const i of [3, 8, 12, 16, 20, 24]) {
    const target = days()[i];
    if (!target) continue;
    clicks.push(await timed(() => target.click()));
    await wait(300);
  }
  out[scope] = {
    dayButtons: days().length,
    listRows: document.querySelectorAll('main table tbody tr').length,
    clickMs: clicks,
  };
}
radio('Toàn bộ')?.click();
return out;
```

### `profile-dayclick.mjs`

```js
// Probe (gói E): CPU profile of day clicks in Lịch hẹn (kỳ Tháng, góc nhìn Toàn bộ) in the exe,
// load data; prints the functions with the most self time and a snippet of the bundle around
// each, so the minified function can be matched to its source.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const browser = await chromium.connectOverCDP('http://127.0.0.1:9334');
const page = browser.contexts()[0].pages()[0];
const cdp = await page.context().newCDPSession(page);
await cdp.send('Debugger.enable');
const scripts = new Map();
cdp.on('Debugger.scriptParsed', (e) => scripts.set(e.scriptId, e.url));
await cdp.send('Profiler.enable');
await cdp.send('Profiler.setSamplingInterval', { interval: 100 });

await page.evaluate(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const radio = (name) =>
    [...document.querySelectorAll('[role=radio]')].find((b) => b.textContent.trim() === name);
  location.hash = '#/appointments';
  await wait(1500);
  radio('Toàn bộ')?.click();
  await wait(800);
  radio('Tháng')?.click();
  await wait(800);
});
await cdp.send('Profiler.start');
const clicks = await page.evaluate(async () => {
  const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const days = () => [
    ...document.querySelectorAll('[aria-labelledby=appointments-calendar] button[aria-pressed]'),
  ];
  const ms = [];
  for (const i of [2, 5, 9, 13, 17, 21, 25, 28]) {
    const start = performance.now();
    days()[i].click();
    await frame();
    ms.push(Math.round(performance.now() - start));
    await wait(200);
  }
  return ms;
});
const { profile } = await cdp.send('Profiler.stop');

// Self time per node, from the samples and their time deltas.
const self = new Map();
profile.samples.forEach((id, i) => self.set(id, (self.get(id) ?? 0) + (profile.timeDeltas[i] ?? 0)));
const byFrame = new Map();
let total = 0;
for (const node of profile.nodes) {
  const us = self.get(node.id) ?? 0;
  const f = node.callFrame;
  if (f.functionName === '(idle)' || f.functionName === '(program)') continue;
  total += us;
  const key = `${f.functionName || '(anon)'} @${f.scriptId}:${f.lineNumber}:${f.columnNumber}`;
  const prev = byFrame.get(key) ?? { us: 0, frame: f };
  prev.us += us;
  byFrame.set(key, prev);
}
const top = [...byFrame.entries()].sort((a, b) => b[1].us - a[1].us).slice(0, 8);
const out = { clicks, busyMsTotal: Math.round(total / 1000), top: [] };
for (const [key, { us, frame }] of top) {
  let snippet = '';
  if (frame.scriptId && frame.scriptId !== '0') {
    try {
      const { scriptSource } = await cdp.send('Debugger.getScriptSource', { scriptId: frame.scriptId });
      const line = scriptSource.split('\n')[frame.lineNumber] ?? '';
      snippet = line.slice(Math.max(0, frame.columnNumber - 20), frame.columnNumber + 260);
    } catch {}
  }
  out.top.push({ key, ms: Math.round(us / 100) / 10, url: scripts.get(frame.scriptId) ?? '', snippet });
}
writeFileSync('C:/workspace/deep-review-1-4/claude/E/profile-dayclick.result.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close().catch(() => {});
process.exit(0);
```

### `editdate-ui.mjs`

```js
// Probe (gói E): the same case as probe-editdate.test.ts, through the UI of the exe (load data):
// Lịch hẹn → 25/08/2026 → Võ Thị Thảo (K-QR0X) → "Sửa kết quả" → day 22/01/2026 → Lưu; reads the
// alert, then tries 24/01/2026 without saving (Hủy). Nothing is saved: the first save is refused.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const browser = await chromium.connectOverCDP('http://127.0.0.1:9334');
const page = browser.contexts()[0].pages()[0];
const out = {};
await page.evaluate(() => (location.hash = '#/appointments'));
await page.waitForTimeout(1500);
await page.getByRole('radio', { name: 'Toàn bộ', exact: true }).click();
await page.getByRole('radio', { name: 'Tháng', exact: true }).click();
await page.getByRole('button', { name: 'Kỳ trước' }).click();
await page.getByRole('button', { name: 'Kỳ trước' }).click();
await page.getByRole('button', { name: /^25\/08\/2026:/ }).click();
const day = page.getByRole('region', { name: /Trong ngày 25\/08\/2026/ });
out.dayHeading = await page.locator('#appointments-day').textContent();
await page.locator('[aria-labelledby=appointments-day]').getByRole('button', { name: 'Võ Thị Thảo' }).click();
const detail = page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' });
out.detailTitle = await detail.locator('h2').textContent();
await detail.getByRole('button', { name: 'Sửa kết quả' }).click();
const dialog = page.locator('dialog[open]');
await dialog.getByLabel('Ngày cuộc hẹn').fill('22/01/2026');
await dialog.getByRole('button', { name: 'Lưu', exact: true }).click();
await page.waitForTimeout(300);
out.alert = await dialog.getByRole('alert').allTextContents();
await dialog.getByLabel('Ngày cuộc hẹn').fill('24/01/2026');
out.hintFor24 = await dialog.locator('text=/24\\/01\\/2026/').allTextContents();
await page.screenshot({ path: 'C:/workspace/deep-review-1-4/claude/E/editdate-ui.png' });
await dialog.getByRole('button', { name: 'Hủy', exact: true }).click();
writeFileSync('C:/workspace/deep-review-1-4/claude/E/editdate-ui.result.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close().catch(() => {});
process.exit(0);
```

### `editdate-alert.mjs`

```js
// Probe (gói E, CL-E2): screenshot of the 6f alert itself (editdate-ui.mjs read its text; its
// screenshot was taken after the field was typed again). Same steps, nothing saved.
import { createRequire } from 'node:module';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const browser = await chromium.connectOverCDP('http://127.0.0.1:9334');
const page = browser.contexts()[0].pages()[0];
await page.evaluate(() => (location.hash = '#/appointments'));
await page.waitForTimeout(1500);
await page.getByRole('radio', { name: 'Toàn bộ', exact: true }).click();
await page.getByRole('radio', { name: 'Tháng', exact: true }).click();
await page.getByRole('button', { name: 'Hôm nay', exact: true }).click();
await page.getByRole('button', { name: 'Kỳ trước' }).click();
await page.getByRole('button', { name: 'Kỳ trước' }).click();
await page.getByRole('button', { name: /^25\/08\/2026:/ }).click();
await page.locator('[aria-labelledby=appointments-day]').getByRole('button', { name: 'Võ Thị Thảo' }).click();
await page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' }).getByRole('button', { name: 'Sửa kết quả' }).click();
const dialog = page.locator('dialog[open]');
await dialog.getByLabel('Ngày cuộc hẹn').fill('22/01/2026');
await dialog.getByRole('button', { name: 'Lưu', exact: true }).click();
await dialog.getByRole('alert').first().scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: 'C:/workspace/deep-review-1-4/claude/E/editdate-alert.png' });
console.log(JSON.stringify(await dialog.getByRole('alert').allTextContents()));
await dialog.getByRole('button', { name: 'Hủy', exact: true }).click();
await browser.close().catch(() => {});
process.exit(0);
```

### `birth-sort-ui.mjs`

```js
// Probe (gói E, CL-E3): Khách hàng → Bảng → sort "Ngày sinh" in the exe (load data); reads the
// first rows of the column after one click (ascending) and after a second (descending).
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const browser = await chromium.connectOverCDP('http://127.0.0.1:9334');
const page = browser.contexts()[0].pages()[0];
await page.evaluate(() => (location.hash = '#/customers'));
await page.waitForTimeout(1500);
await page.getByRole('radio', { name: 'Toàn bộ', exact: true }).click();
await page.getByRole('radio', { name: 'Bảng', exact: true }).click();
await page.waitForTimeout(800);
const table = page.locator('main table');
const headers = await table.locator('thead th').allTextContents();
const col = headers.findIndex((h) => h.includes('Ngày sinh')) + 1;
const cells = () => table.locator(`tbody tr td:nth-child(${col})`).evaluateAll((tds) => tds.map((td) => td.textContent).filter(Boolean).slice(0, 8));
await table.getByRole('button', { name: /Ngày sinh/ }).click();
await page.waitForTimeout(500);
const ascending = await cells();
await page.screenshot({ path: 'C:/workspace/deep-review-1-4/claude/E/birth-sort-ui.png' });
await table.getByRole('button', { name: /Ngày sinh/ }).click();
await page.waitForTimeout(500);
const descending = await cells();
const out = { headers, ascending, descending };
await page.getByRole('radio', { name: 'Kanban', exact: true }).click();
writeFileSync('C:/workspace/deep-review-1-4/claude/E/birth-sort-ui.result.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close().catch(() => {});
process.exit(0);
```

### `aria-calendar.mjs`

```js
// Probe (gói E, trục A): what a screen reader gets from the month calendar and the year grid of
// Lịch hẹn (exe, load data): the accessibility snapshot of a few day cells and month cells, and
// the visible per-group figures they leave out. Also counts the Tab stops of the month calendar.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const browser = await chromium.connectOverCDP('http://127.0.0.1:9334');
const page = browser.contexts()[0].pages()[0];
const out = {};
await page.evaluate(() => (location.hash = '#/appointments'));
await page.waitForTimeout(1500);
await page.getByRole('radio', { name: 'Toàn bộ', exact: true }).click();
await page.getByRole('radio', { name: 'Tháng', exact: true }).click();
await page.getByRole('button', { name: 'Hôm nay', exact: true }).click();
await page.waitForTimeout(500);
const calendar = page.locator('[aria-labelledby=appointments-calendar]');
// Yesterday (04/10/2026) holds unrecorded ones in the load data: its dots say so, its name does not.
const yesterday = calendar.getByRole('button', { name: /^04\/10\/2026:/ });
out.dayAccessibleName = await yesterday.getAttribute('aria-label');
out.dayAria = await yesterday.ariaSnapshot();
out.dayDots = await yesterday.evaluate((b) =>
  [...b.querySelectorAll('i')].map((i) => i.className.match(/bg-[\w-]+|border-info/)?.[0]),
);
out.calendarTabStops = await calendar.evaluate(
  (c) => [...c.querySelectorAll('button')].filter((b) => b.tabIndex >= 0 && !b.disabled).length,
);
out.listUnrecordedYesterday = await page.evaluate(() =>
  [...document.querySelectorAll('main table tbody tr')].filter(
    (tr) => tr.textContent.includes('04/10/2026') && tr.textContent.includes('Chưa ghi kết quả'),
  ).length,
);
await page.getByRole('radio', { name: 'Năm', exact: true }).click();
await page.waitForTimeout(800);
const year = page.locator('[aria-labelledby=appointments-year]');
const sept = year.getByRole('button', { name: /^Tháng 9\/2026/ });
out.monthAccessibleName = await sept.getAttribute('aria-label');
out.monthAria = await sept.ariaSnapshot();
out.monthBarVisible = await sept.evaluate((b) =>
  [...b.querySelectorAll('[title]')].map((s) => s.getAttribute('title')),
);
await page.getByRole('radio', { name: 'Tháng', exact: true }).click();
writeFileSync('C:/workspace/deep-review-1-4/claude/E/aria-calendar.result.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close().catch(() => {});
process.exit(0);
```

### `contrast.mjs`

```js
// Probe (gói E, trục A): WCAG contrast of the text / background pairs Lịch hẹn and Khách hàng use
// that gói D did not measure (tokens.css values; rgba backgrounds composited over the surface
// below them). Same method as D\contrast.mjs. Usage: node contrast.mjs
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const over = ([r, g, b, a], base) => base.map((c, i) => Math.round([r, g, b][i] * a + c * (1 - a)));
const lum = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};
const T = {
  bg1: hex('#111822'), bg2: hex('#18212d'), bg3: hex('#212c3a'),
  text: hex('#e8edf4'), text2: hex('#aeb9c8'), text3: hex('#8c99ac'), accent: hex('#d9b26a'),
  onAccent: hex('#0b1017'), danger: hex('#f07e7e'), warn: hex('#f0a04b'), ok: hex('#3fd69a'),
  info: hex('#6fa8ff'), dateToday: hex('#9be8c0'), issued: hex('#3fd69a'),
};
const accentSoftOn2 = over([217, 178, 106, 0.14], T.bg2);
const bandOn2 = over([217, 178, 106, 0.08], T.bg2);
const infoQuarterOn1 = over([111, 168, 255, 0.25], T.bg1);
const pairs = [
  ['"Chưa ghi kết quả" badge text-appt-unrecorded (warn) on surface-1 (list, day)', T.warn, T.bg1],
  ['status text-info (Dự kiến tone) on surface-1', T.info, T.bg1],
  ['status text-ok (Đã gặp tone) on surface-1', T.ok, T.bg1],
  ['status text-appt-missed (text-3) on surface-1', T.text3, T.bg1],
  ['status text-danger (Không đến) on surface-1', T.danger, T.bg1],
  ['day number text-fg-3 on surface-2 (weekday cell)', T.text3, T.bg2],
  ['day number text-fg-3 on period-band over surface-2', T.text3, bandOn2],
  ['"· hôm nay" text-date-today on surface-2', T.dateToday, T.bg2],
  ['"· hôm nay" text-date-today on accent-soft (today picked)', T.dateToday, accentSoftOn2],
  ['picked day number text-accent on accent-soft over surface-2', T.accent, accentSoftOn2],
  ['year bar count text-on-accent on bg-ok', T.onAccent, T.ok],
  ['year bar count text-on-accent on bg-appt-missed (text-3)', T.onAccent, T.text3],
  ['year bar count text-on-accent on bg-appt-unrecorded (warn)', T.onAccent, T.warn],
  ['year bar count text-on-accent on bg-info', T.onAccent, T.info],
  ['future planned bar text-fg on info/25 over surface-1', T.text, infoQuarterOn1],
  ['kanban "n HĐ" text-issued on surface-2', T.issued, T.bg2],
  ['KYC minor conflict text-warn on surface-1', T.warn, T.bg1],
  ['card heading text-heading (accent) on surface-1', T.accent, T.bg1],
  ['link text-accent on surface-1', T.accent, T.bg1],
];
for (const [name, fg, bg] of pairs) console.log(`${String(ratio(fg, bg)).padStart(5)}  ${name}`);
```

### `exports.mjs`

```js
// Probe (gói E, trục B): every `export` of routes/appointments and routes/customers, and where
// it is used outside its own file (product code vs tests only). Usage: node exports.mjs
import { readdirSync, readFileSync } from 'node:fs';

const ROOT = 'C:/workspace/Project-2C-review/apps/desktop/src';
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${dir}/${e.name}`) : /\.(ts|tsx)$/.test(e.name) ? [`${dir}/${e.name}`] : [],
  );
const files = walk(ROOT);
const scope = files.filter((f) => /routes\/(appointments|customers)\//.test(f) && !f.includes('.test.'));
const rows = [];
for (const file of scope) {
  const source = readFileSync(file, 'utf8');
  for (const m of source.matchAll(/^export (?:const|function|type|interface) (\w+)/gm)) {
    const name = m[1];
    const re = new RegExp(`\\b${name}\\b`);
    const users = files.filter((f) => f !== file && re.test(readFileSync(f, 'utf8')));
    const prod = users.filter((f) => !f.includes('.test.'));
    const ownUses = (source.match(new RegExp(`\\b${name}\\b`, 'g')) ?? []).length - 1;
    if (prod.length === 0) {
      rows.push({
        file: file.replace(`${ROOT}/`, ''),
        name,
        ownFileUses: ownUses,
        tests: users.filter((f) => f.includes('.test.')).map((f) => f.split('/').pop()),
      });
    }
  }
}
console.log(JSON.stringify(rows, null, 1));
```

### `build-report.mjs`

```js
// Assembles ..\E.md from the body parts and the probe outputs of this folder. Usage: node build-report.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const HERE = 'C:/workspace/deep-review-1-4/claude/E';
const read = (name) => readFileSync(`${HERE}/${name}`, 'utf8').replaceAll('\r\n', '\n');
const json = (name) => JSON.parse(read(name));

const FILES = {
  AV: 'appointments-view.ts',
  AF: 'appointment-form.ts',
  OF: 'outcome-form.ts',
  MF: 'MetFields.tsx (metDraftOf)',
  CV: 'customers-view.ts',
  KV: 'kyc-view.ts',
  PF: 'policy-form.ts',
};
const unit = json('mutate-results.json');
const tally = Object.values(unit).reduce((t, r) => ({ ...t, [r.verdict]: (t[r.verdict] ?? 0) + 1 }), {});
let appendixA =
  '## Phụ lục A — Mutation unit (`mutate-results.json`)\n\n' +
  'Mỗi lượt phục vụ đúng một file đã đổi qua plugin `load` của Vite (repo không bị ghi), chạy 106 test unit của gói E ' +
  `(\`vitest.mut.config.mts\`, \`--bail=1\`). Tổng: ${JSON.stringify(tally)}. Tiền tố: ` +
  Object.entries(FILES).map(([k, v]) => `${k} = \`${v}\``).join(', ') +
  '. Chuỗi thay đổi chính xác ở `mutate.mjs` (phụ lục D).\n\n| Mutation | Kết quả | Test bắt được |\n|---|---|---|\n';
for (const [name, r] of Object.entries(unit)) {
  const test = r.failing.replace(/^apps\/desktop\/src\/routes\//, '').replace(/\|/g, '\\|');
  appendixA += `| ${name} | ${r.verdict === 'SURVIVED' ? '**SURVIVED**' : r.verdict} | ${test} |\n`;
}

const e2e = json('e2e-mut-results.json');
let appendixB =
  '## Phụ lục B — Mutation TSX trên e2e (`e2e-mut-results.json`)\n\n' +
  'Mỗi lượt: build web bằng Vite (cấu hình của repo + plugin `load` đổi đúng một file) ra `E\\dist-mut`, phục vụ ở cổng 4173, ' +
  'chạy các spec liên quan với `PW_REUSE=1 --project=edge --no-deps --output=E\\pw-out` (Edge, 4 worker). Chỉ chạy spec liên quan ' +
  'đến màn bị đổi, không chạy cả bộ 146 test. Lượt nền (không đổi gì) xanh trước khi chạy mutation.\n\n' +
  '| Mutation | Spec chạy | Kết quả | Test đỏ đầu tiên |\n|---|---|---|---|\n';
for (const [name, r] of Object.entries(e2e)) {
  const specs = r.specs.map((s) => s.replace('e2e/', '').replace('.spec.ts', '')).join(', ');
  const verdict = r.verdict === 'SURVIVED' ? '**SURVIVED**' : r.verdict;
  const first = r.verdict === 'GREEN' ? '' : (r.firstFailing ?? '').replace(/\|/g, '\\|');
  appendixB += `| ${name} | ${specs} | ${verdict} (${(r.summary ?? []).join(', ')}) | ${first} |\n`;
}

const RESULTS = [
  'probe-perf.result.json',
  'perf-dayclick.result.json',
  'profile-dayclick.result.json',
  'probe-editdate.result.json',
  'editdate-ui.result.json',
  'probe-labels.result.json',
  'birth-sort-ui.result.json',
  'probe-timeline.result.json',
  'aria-calendar.result.json',
  'probe-profile.result.json',
  'probe-order.result.json',
  'contrast.result.txt',
  'exports.result.json',
];
let appendixC = '## Phụ lục C — Kết quả probe\n\n';
for (const name of RESULTS) {
  appendixC += `### \`${name}\`\n\n\`\`\`${name.endsWith('.json') ? 'json' : ''}\n${read(name).trim()}\n\`\`\`\n\n`;
}
appendixC += 'Ảnh: `editdate-alert.png` (hộp 6f với câu báo sai mốc), `editdate-ui.png` (hộp 6f sau khi gõ lại 24/01/2026), `birth-sort-ui.png` (bảng KH sắp "Ngày sinh" tăng dần).\n';

const SOURCES = [
  'vitest.probe.config.mts',
  'vitest.mut.config.mts',
  'probe-load.ts',
  'probe-perf.test.ts',
  'probe-editdate.test.ts',
  'probe-editdate-who.test.ts',
  'probe-labels.test.ts',
  'probe-timeline.test.ts',
  'probe-profile.test.ts',
  'probe-order.test.ts',
  'mutate.mjs',
  'e2e-mut.mjs',
  'cdp.mjs',
  'perf-dayclick.js',
  'profile-dayclick.mjs',
  'editdate-ui.mjs',
  'editdate-alert.mjs',
  'birth-sort-ui.mjs',
  'aria-calendar.mjs',
  'contrast.mjs',
  'exports.mjs',
  'build-report.mjs',
];
let appendixD =
  '## Phụ lục D — Nguồn test tạm / probe\n\n' +
  'Tất cả ở `C:\\workspace\\deep-review-1-4\\claude\\E\\`; `node_modules` là junction tới `node_modules` của worktree review. ' +
  'Probe Vitest chạy bằng `node node_modules/vitest/vitest.mjs run --config vitest.probe.config.mts <tên>`; script `.mjs` chạy bằng `node`; ' +
  'probe exe cần exe bản sao `E\\exe\\project2c.exe` chạy với `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9334`.\n\n';
for (const name of SOURCES) {
  const lang = name.endsWith('.ts') || name.endsWith('.mts') ? 'ts' : 'js';
  appendixD += `### \`${name}\`\n\n\`\`\`${lang}\n${read(name).trim()}\n\`\`\`\n\n`;
}

const report = [
  read('E.body.md').trim(),
  read('E.findings-1.md').trim(),
  read('E.findings-2.md').trim(),
  read('E.findings-3.md').trim(),
  read('E.rest.md').trim(),
  appendixA.trim(),
  appendixB.trim(),
  appendixC.trim(),
  appendixD.trim(),
].join('\n\n');
writeFileSync('C:/workspace/deep-review-1-4/claude/E.md', `${report}\n`);
console.log(`E.md: ${report.length} chars`);
```
