# Deep review Phase 1–4 — gói A (`packages/domain`) — Claude

- **SHA:** `f0c53eb57eb7eac8665ad87287e794ae4c5bc43b` (`git rev-parse HEAD` kiểm đầu phiên, worktree `C:\workspace\Project-2C-review`, detached). Kết thúc phiên `git status` sạch: không sửa file, không commit.
- **Ngày:** 05/10/2026, Home PC. Một phiên, không subagent.
- **Nguồn đã đọc ngoài repo:** `common\README.md`, `common\baseline.md`, `common\known.md`, `common\load\` (dùng `load-backup.json`). Không có báo cáo Claude gói trước (A là gói đầu). Không mở / liệt kê / tìm trong `codex\`.
- **Probe, test tạm:** `C:\workspace\deep-review-1-4\claude\A\` (nguồn ở phụ lục). Chạy bằng bản sao / alias, không ghi vào repo: `node_modules` của thư mục probe là junction tới `node_modules` của worktree.

## 1. Phạm vi đã đọc

| File | Dòng | Cách đọc |
|---|---|---|
| `src/period.ts` | 1–408 (toàn bộ) | đọc từng dòng + probe |
| `src/money.ts`, `src/number.ts` | 1–136, 1–43 | đọc từng dòng + probe |
| `src/stats.ts`, `src/compare.ts` | 1–208, 1–82 | đọc từng dòng + probe |
| `src/appointment-counts.ts`, `src/stage-snapshot.ts`, `src/customer-lifecycle.ts` | 1–80, 1–151, 1–72 | đọc từng dòng + probe |
| `src/kyc-catalog.ts`, `src/kyc-fact.ts`, `src/kyc.ts`, `src/kyc-gate.ts` | 1–155, 1–30, 1–166, 1–85 | đọc từng dòng |
| `src/model.ts`, `src/pipeline-stage.ts`, `src/index.ts` | 1–110, 1–13, 1–107 | đọc từng dòng |
| `src/golden/*.fixture.ts` (4 file) | 133 + 271 + 245 + 222 | đọc từng dòng, đối chiếu tự động với `docs/golden/*.md` |
| `src/golden/*.fixture.test.ts` (4 file) | 50 + 68 + 112 + 74 | đọc từng dòng |
| `src/compare.test.ts` | 1–224 | đọc từng dòng |
| `src/stats.test.ts` | 1–120 | đọc |
| `src/period.test.ts` | cấu trúc `describe/it` toàn file; 219–260, 333–365, 630–665 | đọc chọn lọc |
| Các test còn lại (`money`, `number`, `kyc*`, `stage-snapshot`, `stats-rf`, `appointment-counts`, `customer-lifecycle`, `pipeline-stage`) | — | không đọc từng dòng; đánh giá bằng 56 mutation (§T) và grep assertion |
| Tài liệu | `docs/process/deep-review-phase-1-4.md`; `docs/design/phase-4-chi-so.md` 1–160 + grep §3.1, §4.4; `docs/golden/{chi-so,kyc,lich-hen,kh-theo-nhom}.md` toàn bộ; `packages/domain/CLAUDE.md` | |
| Nơi gọi domain (chỉ để kiểm hợp đồng / dùng export) | `customers-view.ts` 1–120; `appointments-view.ts` 175–200, 315–345; `overview-view.ts:63,67,179–190`; `team-compare-view.ts` 1–80; `db/src/metrics.ts`; grep `db/src/{backup-validation,customers,kyc,team}.ts` | grep + đọc đoạn |

Lệnh đã chạy: `pnpm vitest run packages/domain` (508 test xanh, 1,2 s); `tsc --noEmit --noUnusedLocals --noUnusedParameters` trong `packages/domain` (exit 0); bộ test domain trên bản sao với 4 múi giờ và 3 seed xáo thứ tự; 56 mutation; 9 probe (phụ lục).

## 2. Phát hiện

### CL-A1

```
ID: CL-A1
Mức: Low
Trục: T
Vị trí: packages/domain/src/period.ts:251 (customRangeMaxEnd) · test packages/domain/src/period.test.ts:219-241 (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Trần kỳ Tùy chọn chưa có test cho ca "ngày đầu = ngày cuối của tháng thứ 3" (28/11 năm thường, 30/01, 31/12, 29/11 trước năm nhuận). Đổi `start.day > last` thành `>=` (trần dài thêm một ngày) thì cả 508 test vẫn xanh.
Tái hiện / bằng chứng: mutation P1 (`mutate.mjs`) → SURVIVED. Code hiện đúng: `probe-cap.test.ts` 6/6 xanh (28/11/2026 → 27/02/2027, 29/11/2026 → 28/02/2027, 30/01/2027 → 29/04/2027, 31/12/2026 → 30/03/2027, 29/11/2027 → 28/02/2028, 30/11/2027 → 29/02/2028). Bảng spec §3.1 chỉ có 01/01, 15/01, 31/01, 30/11, 01/12, 15/11/2100, không có ca bằng nhau.
Ảnh hưởng: chưa có lỗi người dùng. Người sửa `customRangeMaxEnd` sau này có thể làm trần dài thêm một ngày ở các ngày đầu trên mà test không đỏ.
Đề xuất: thêm 4–6 dòng vào `cases` của `describe('custom range cap')` (không đụng golden, không đổi spec). ≈ 10 dòng test.
```

### CL-A2

```
ID: CL-A2
Mức: Low
Trục: E
Vị trí: packages/domain/src/money.ts:32-33 (AMOUNT_PATTERN) (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: `parseVnd` báo `format` cho mấy cách viết tiền phổ biến: hậu tố "VNĐ" / "vnđ" (trong khi nhận "VND", "đ", "₫", "đồng"), "1tr5", "1 tỷ 2" và nhóm nghìn bằng dấu cách "500 000 000". Không có ca nào ra số sai, chỉ bị từ chối.
Tái hiện / bằng chứng: probe-edges.test.ts → "500.000 VNĐ" {ok:false,error:"format"}; "500.000 vnđ" format; "500.000 VND" ok 500000; "500 000 000" format; "1tr5" format; "1 tỷ 2" format. (Đối chứng: "2 TỶ" ok 2 000 000 000, "1,5 tỷ" ok.)
Ảnh hưởng: RE nhập FYP / case size (PolicyDialogs, MetFields) gõ "500.000 VNĐ" hay dán số có dấu cách thì bị báo sai định dạng và phải gõ lại.
Đề xuất: thêm `vnđ` vào nhóm hậu tố (1 dòng + test). Có nhận "1tr5" / "1 tỷ 2" / dấu cách hay không là quyết định định dạng nhập, cần Owner chốt. ≤ 30 dòng.
```

### CL-A3

```
ID: CL-A3
Mức: Nit
Trục: E
Vị trí: packages/domain/src/money.ts:32-33, 49 (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Regex `^([\d.,]+)\s*(unit)?\s*(suffix)?$` quay lui bậc hai khi giữa chuỗi có nhiều dấu cách (hai `\s*` liền nhau quanh một nhóm tùy chọn). `trim()` chỉ bỏ dấu cách ở hai đầu.
Tái hiện / bằng chứng: probe-redos.test.ts: "1" + n dấu cách + "x" → n = 1 000: 1 ms · 5 000: 11 ms · 20 000: 173 ms (tăng ~16 lần khi n tăng 4 lần). Chuỗi chữ số dài / nhóm "1." dài: ≤ 2 ms. `parseQuickDate` 20 000 ký tự: 0 ms.
Ảnh hưởng: chỉ xảy ra khi dán chuỗi rác rất dài vào ô tiền; UI đứng tạm vài trăm ms. Không phải vấn đề an toàn (app offline, dữ liệu do người dùng tự gõ).
Đề xuất: gộp `\s+` thành một dấu cách trước khi khớp, hoặc giới hạn độ dài ô nhập. ≤ 10 dòng.
```

### CL-A4

```
ID: CL-A4
Mức: Nit
Trục: E
Vị trí: packages/domain/src/period.ts:179-186 (parseQuickDate) (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Gõ "29/02" (không năm) vào cuối năm liền trước năm nhuận thì nhận lỗi `invalid-date`, không được gợi ý 29/02 năm sau. Hàm lấy năm hiện tại trước, mà 29/02 năm đó không tồn tại, nên không tới bước gợi ý năm sau, trong khi doc comment nói gợi ý năm sau vì "at year end the RE often means early next year".
Tái hiện / bằng chứng: probe-leapquick.test.ts, hôm nay 15/12/2027: "29/02" → {ok:false,error:"invalid-date"}; "28/02" → ok 28/02/2027 kèm gợi ý 28/02/2028.
Ảnh hưởng: chỉ khi hẹn lịch vào 29/02 của năm nhuận kế tiếp, gõ tắt trong vài tháng cuối năm trước đó. RE gõ đủ "29/02/2028" là xong. Khác KNOWN R3 ("ngày nhanh đầu năm — gợi ý năm trước?"), là chiều ngược lại.
Đề xuất: khi `yearInferred` và ngày không tồn tại ở năm nay mà có ở năm sau thì trả lỗi kèm gợi ý, hoặc ghi chú vào ACCEPTED. ≤ 20 dòng nếu sửa.
```

### CL-A5

```
ID: CL-A5
Mức: Low
Trục: B
Vị trí: packages/domain/src/index.ts:1,26,55,66-69,73,86-88 · pipeline-stage.ts:11 · customer-lifecycle.ts:41,66 · stats.ts:114 · stage-snapshot.ts:31,73 · kyc.ts:43 · period.ts:163,208 (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Nhiều export công khai của `@p2c/domain` không có nơi gọi nào trong code sản phẩm (apps / packages khác), chỉ test dùng:
  - `compareStages`: chỉ test của chính nó.
  - `policyBadge`: chỉ test của chính nó. UI tự đếm lại cùng số ở `apps/desktop/src/routes/customers/customers-view.ts:55-58` (Map đếm HĐ theo KH).
  - `monthToDate`: chỉ test. MTD thật do `comparisonWindows` / `overview-view.ts:102` dựng bằng `customPeriod`.
  - `isRfAppointment`, `stageOn`: chỉ test (domain + db). Cả hai tốn O(số chuyển nhóm) mỗi lần gọi (dựng lại Set hoặc filter), nên gọi theo từng dòng sẽ thành bậc hai.
  - `stageSnapshot`, `stageSnapshotter`: doc comment ghi là "the reference its tests compare the series against". Đây là code chuẩn đối chiếu cho test nhưng nằm trong code sản phẩm và được export.
  - `EMPTY_KYC_PROFILE`: chỉ test. `NEXT_YEAR_SUGGESTION_DAYS`: export ở index nhưng không file nào import (test ghi cứng 60).
  - `period.ts:208` `Math.max(monday, FIRST_DAY)` không bao giờ có tác dụng, vì 01/01/1900 là Thứ Hai nên Thứ Hai của mọi ngày hợp lệ ≥ FIRST_DAY (mutation P4 bỏ nó: 508 test vẫn xanh, là mutation tương đương).
Tái hiện / bằng chứng: grep mọi export của `index.ts` trên apps/packages/e2e/tools, trừ `packages/domain` và `*.test.*` (lệnh ở phụ lục B). `probe-perf.test.ts`: gọi `stageOn` cho từng KH trong 1 496 KH = 28,25 ms, so với `stageSnapshotSeries` cả tháng × 5 góc nhìn = 3,42 ms.
Ảnh hưởng: không gây lỗi. API rộng hơn nhu cầu, và hai hàm "một bản ghi / một lần gọi" là bẫy hiệu năng nếu Phase 5–6 dùng theo dòng. `policyBadge` và `customers-view` là hai nơi định nghĩa "Đã có HĐ (n)".
Đề xuất: bỏ `compareStages`, `NEXT_YEAR_SUGGESTION_DAYS` khỏi index; `customers-view` dùng `policyBadge` (hoặc bỏ `policyBadge`); `stageOn` / `monthToDate` được spec nhắc tên (§2.2, ADR-0007), nên giữ nhưng có thể chuyển phần chuẩn đối chiếu (`stageSnapshotter`) vào file test. ≤ 60 dòng, chủ yếu xóa.
```

### CL-A6

```
ID: CL-A6
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/overview/overview-view.ts:63 · packages/domain/src/compare.ts:15 (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Công thức "tỉ lệ chốt → %" `(numerator / denominator) * 100` có hai bản: một bản riêng trong domain (`compare.ts` `percent`, không export) cho điểm % chênh lệch, một bản trong UI (`overview-view.ts` `percentOf`) cho số hiện trên ô KPI và bảng So sánh team. CLAUDE.md: "Tiền, ngày, chỉ số: chỉ dùng hàm chuẩn trong packages/domain".
Tái hiện / bằng chứng: grep `numerator / denominator` → 2 nơi (report-workbook.ts:57 ghi tỉ số thô cho định dạng % của Excel, khác mục đích).
Ảnh hưởng: hôm nay hai bản ra cùng số. Nếu sửa một bản (vd. làm tròn) mà quên bản kia thì ô KPI "66,7%" và dòng "▲ x điểm" lệch nhau.
Đề xuất: export `closeRatePercent(rate)` từ domain, dùng ở cả hai nơi. ≤ 15 dòng.
```

### CL-A7

```
ID: CL-A7
Mức: Nit
Trục: P
Vị trí: packages/domain/src/stats.ts:84-86 (inScope) · nơi gọi theo từng bản ghi: apps/desktop/src/routes/appointments/appointments-view.ts:215, apps/desktop/src/routes/customers/customers-view.ts:61 (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: `inScope` dựng lại `scopeMatcher` (với góc nhìn Team: filter `people` + Set) ở mỗi lần gọi. Hai màn gọi nó cho từng bản ghi trong `.filter`. `scopeMatcher` (dựng một lần) không được export ra ngoài domain, nên nơi gọi không có cách nhanh.
Tái hiện / bằng chứng: probe-inscope.test.ts trên dữ liệu tải (10 434 lịch hẹn, góc nhìn Team, giữ 2 595): `appointments.filter(a => inScope(people, a.reId, team))` 6,00 ms; dựng `scopeMatcher` một lần rồi filter 0,26 ms (median 9 lượt). Với 1 496 KH: 0,92 ms.
Ảnh hưởng: nhỏ, dưới một khung hình mỗi lần lọc. Tổng chi phí tùy số lần màn Lịch hẹn tính lại danh sách (để gói E đo).
Đề xuất: export một `scopeFilter(people, scope)` hoặc chính `scopeMatcher`, và dùng một lần cho mỗi danh sách. ≤ 15 dòng.
```

### CL-A8

```
ID: CL-A8
Mức: Nit
Trục: T
Vị trí: packages/domain/src/stats.ts:56 (markIndexer, vế `daysBetween(mark.start, mark.end) < 0`) (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Nhánh từ chối một mốc có ngày đầu sau ngày cuối chưa có test. Coverage báo 100% nhánh vì v8 không tính riêng từng vế của `||`. Vế "chồng / sai thứ tự" (T-137) đã có test và bắt được mutation S2.
Tái hiện / bằng chứng: mutation S3 (bỏ vế đó) → SURVIVED. Mốc ngược đi qua `fill(index, a, b)` với a > b, không ghi gì, nên mốc đó ra 0 thay vì ném lỗi.
Ảnh hưởng: chưa có đường nào tạo mốc ngược (`chartMarks` / `reportMarks` luôn đúng thứ tự). Chỉ để giữ đúng hợp đồng ghi trong doc comment.
Đề xuất: thêm một `expect(() => markIndexer([customPeriod-ngược…])).toThrow(RangeError)`. Vì `customPeriod` từ chối khoảng ngược nên phải dựng object tay. ≈ 5 dòng test.
```

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | P | B | T | A | S | Tổng |
|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 1 (A2) | 0 | 0 | 0 | 1 (A5) | 1 (A1) | 0 | 0 | 3 |
| Nit | 2 (A3, A4) | 1 (A6) | 0 | 1 (A7) | 0 | 1 (A8) | 0 | 0 | 5 |
| **Tổng** | 3 | 1 | 0 | 1 | 1 | 2 | 0 | 0 | **8** |

Cả 8 phát hiện đều CONFIRMED (có probe, mutation hoặc số đo), không có PLAUSIBLE. Không có mục nào trùng `known.md` cần gắn KNOWN. Mục gần nhất là CL-A4, khác chiều với KNOWN R3 "ngày nhanh đầu năm".

**Nhận định chung gói A:** domain đúng theo spec và golden trên mọi phép kiểm đã chạy, kể cả kiểm vét cạn (mọi ngày 1900–2100) và kiểm trên dữ liệu tải. Không có lỗi ra số sai. Phát hiện chỉ ở mức chỗ trống của test, cách nhập tiền, và API thừa.

## 4. Đã xét, không thấy

- **E — Edge case:**
  - `weekdayOf` khớp `Date#getUTCDay` trên **mọi ngày 01/01/1900–31/12/2100** (73 414 ngày).
  - `customRangeMaxEnd` với mọi ngày đầu 2024–2031 (2 922 ngày): mọi khoảng 89–92 ngày. `canShift` true thì `shift` luôn ra khoảng được phép (0 lệch).
  - `comparisonWindows` mọi ngày 2024–2030 × Ngày / Tuần / Tháng (7 671 ca): kỳ trước luôn bắt đầu đúng ngày đầu kỳ liền trước, không vượt ngày cuối của nó, cùng số ngày trừ khi bị cắt (0 lệch).
  - Vòng `parseVnd(formatVnd(x)) === x`: 2 010 số tới `MAX_SAFE_INTEGER` (0 lệch). `9.007.199.254.740.992` → `too-large`. `0,001k` → 1 đ. `1,0005k` → `fraction`. `-0`, `--5` → `negative`.
  - `formatVndCompact` quanh 999 995 000 → "1 tỷ" / 999 994 999 → "999,99 tr". `formatPercent(-0,04)` → "0".
  - Biên miền: tuần cắt 27/12–31/12/2100; Năm 2100 → Tùy chọn 01/01–31/03/2100; `addDays(01/03/1900, -1)` = 28/02/1900 (1900 không nhuận).
  - Nửa đêm / múi giờ: `fromLocalDate(31/12 23:59:59.999)` → 31/12, `(01/01 00:00)` → 01/01. Toàn bộ test domain xanh dưới `TZ` = America/St_Johns (+3:30), Pacific/Kiritimati (−14), Pacific/Pago_Pago (+11), UTC. Phải đặt `TZ` qua PowerShell; Git Bash không truyền `TZ` cho Node, đã kiểm bằng `getTimezoneOffset`.
  - Chuỗi dài: `parseQuickDate` 20 000 ký tự 0 ms (chỉ `parseVnd` có vấn đề, CL-A3).
  - Lớn / lặp: `stageSnapshotSeries` 431 ngày liên tiếp một lần gọi khớp `stageSnapshot` từng ngày.
- **C — Đúng hợp đồng:**
  - Đối chiếu tự động bảng Markdown với fixture TS (`probe-golden.test.ts`): `chi-so.md` G01–G22, `lich-hen.md` A01–A13, `kh-theo-nhom.md` S01–S13 khớp từng số. Spec §4.2 C01–C11 đều có test cùng mã trong `compare.test.ts`. 18 câu hỏi gợi ý KYC và câu `KYC_INSUFFICIENT_MESSAGE` khớp nguyên văn `kyc.md`. K01–K15 đối chiếu tay với bảng §4.
  - **Golden không bị chiều theo code.** Mọi số kỳ vọng ghi tay, khớp tài liệu Owner duyệt. Ngoại lệ duy nhất: helper `expected()` trong `metrics.fixture.ts:201` tự suy ra `closeRate` từ `issued/rf`. Công thức chỉ là "PH ÷ RF" của spec và fixture test (`metrics.fixture.test.ts:103`) kiểm lại, nên không phải lỗi.
  - Đã đọc doc comment của mọi hàm export và so với hành vi (vd. "Equal, mark by mark" của `periodMetricsByMark` / `appointmentCountsByMark` / `stageSnapshotSeries`). Kiểm trên dữ liệu tải: 1 529 cặp mốc × góc nhìn (all, 4 team, 6 RE; năm 2025, năm 2026, tháng, tuần, Tùy chọn qua năm; `chartMarks` + `reportMarks`) đều bằng nhau.
  - Spec §3 (bảng ‹ ›), §3.1 (bảng trần), §4.2 (C01–C11), §4.4 (M01–M04) có test tương ứng và qua.
  - Khớp nhãn: "Chưa ghi kết quả" là ngày **trước** hôm nay, "Dự kiến" từ hôm nay (mutation A1 bị 8 test bắt).
- **D — Dữ liệu:** domain không I/O. Các thao tác KYC (`addNote` / `confirmFact` / `markConflict` / `resolveConflict`) luôn trả object mới, không sửa đầu vào (đọc code). Đường ghi db và đường nhập backup dùng chung luật domain: `assertValidTransition` (`customers.ts:213`, `backup-validation.ts:151`), `calendarDate` (`common.ts:39`, `backup-validation.ts:68`), `nextKycVersion` (`kyc.ts:252,426`). Hash KYC khi nhập backup đã là KNOWN S-1, không báo lại. Phần `status` trong `kycHash` là thừa với bất biến hiện có (một giá trị → active, ≥ 2 giá trị khác nhau → conflict), nên mutation K1 sống là mutation tương đương, không phải lỗ hổng.
- **P — Hiệu năng** (Node, dữ liệu tải 1 496 KH / 10 434 lịch hẹn / 4 978 chuyển nhóm / 1 804 HĐ / 51 người, median 7 lượt, `probe-perf.result.json`):
  - `periodMetrics` năm, Toàn bộ: 1,5 ms.
  - `periodMetrics` tháng × 48 góc nhìn (tải của bảng So sánh team): 18,1 ms.
  - `appointmentCounts` × 48: 7,7 ms.
  - `periodMetricsByMark` 12 mốc: 0,99 ms. `appointmentCountsByMark` các tuần của tháng: 1,29 ms.
  - Dựng `stageSnapshotSeries`: 0,89 ms. Gọi 5 ngày × 5 góc nhìn: 3,42 ms. 10 tháng: 2,52 ms.
  - Không hàm nào trên 20 ms, ngoài phát hiện CL-A7 và chi phí của hàm không dùng (CL-A5).
  - Bundle: domain không có dependency. Mã ~2,7 nghìn dòng TS, chunk `index-*.js` trong baseline không tách được phần domain bằng công cụ có sẵn (không dùng visualizer theo §6), nên không ước lượng thêm.
- **B — Bloat:** `tsc --noUnusedLocals --noUnusedParameters` sạch (exit 0). Mọi export của `index.ts` đã grep nơi dùng (kết quả ở CL-A5). Không có dependency. Không thấy code lặp ≥ 3 nơi trong domain.
- **T — Test:**
  - 56 mutation, mỗi lần một chỗ (phụ lục A): 50 bị bắt, 6 sống. Trong 6 con sống: P1 → CL-A1, S3 → CL-A8, P4 / N1 / K1 là mutation tương đương, L3 không tác dụng (thay bằng L3b, bị 3 test bắt).
  - Thứ tự: `--sequence.shuffle` 3 seed đều 508/508.
  - Không test nào đọc ngày hệ thống: không có `Date.now`; `new Date(y, m, …)` chỉ dùng cho hàm "local" và đọc lại cũng theo giờ local, nên không phụ thuộc múi giờ (kiểm ở trục E).
  - Không có test thiếu `expect` (quét bằng script); `not.toThrow` chỉ dùng cho validator trả `void`.
  - Golden được chạy ở domain (`stats*.test`, `appointment-counts.test`, `stage-snapshot.test`, `kyc-gate.test`, `period.test`) và ở db (`golden-metrics.test`, `golden-kyc.test`).
- **A — Trợ năng / i18n:** domain không có giao diện. Chuỗi tiếng Việt trong domain:
  - Câu hỏi KYC và `KYC_INSUFFICIENT_MESSAGE`: danh mục G2, chưa hiện ở UI. Phase 5 cần chốt lấy từ catalog hay qua i18n.
  - Đơn vị "tr" / "tỷ" / "₫" / "B–TB": định dạng thuộc domain theo ADR-0013.
  - "Cập nhật KYC dd/mm/yyyy": ACCEPTED.
  - Định dạng số / ngày đúng kiểu Việt Nam (đã kiểm ở E).
- **S — An toàn (hẹp):** domain không đọc backup và không đụng đường dẫn. Tên file xuất chỉ lấy từ `localFileStamp` / `formatIsoDate`, chỉ sinh `[0-9-]`. Regex nhập: chỉ `parseVnd` chậm bậc hai (CL-A3, không phải lỗ an toàn).
- **Ghi chú cho gói sau (không phải phát hiện gói A):**
  - `appointment-form.ts:70` tự parse giờ `HH:MM` ở UI; domain chưa có hàm giờ trong ngày. Gói E xem có vi phạm quy tắc "chỉ parse ở domain" không.
  - `monthGrid` (`appointments-view.ts:328-345`) lặp toàn bộ `rows` cho mỗi ô ngày (42 × số lịch); gói E đo.

## Phụ lục A — Kết quả mutation (`mutate-results.json`)

Mỗi dòng: chép `packages/domain/src` sang `A\mut\src`, sửa một chỗ, chạy toàn bộ 508 test domain.

| Mutation | Kết quả |
|---|---|
| P1 cap: `start.day > last` → `>=` | **SURVIVED** → CL-A1 |
| P2 chart ngày ≤ 31 → ≤ 32 | killed (1) |
| P3 gợi ý năm sau `> 60` → `>= 60` | killed (1) |
| P4 bỏ `Math.max(monday, FIRST_DAY)` | **SURVIVED** (tương đương) → CL-A5 |
| P5 bỏ kiểm trần khi dời Tùy chọn | killed (1) |
| P6 `todayPeriod` luôn trả object mới | killed (1) |
| P7 `switchKind` luôn neo ngày đầu | killed (1) |
| P8 bỏ cắt trần ở 31/12/2100 | killed (1) |
| P9 `formatPeriodValue` luôn dạng cùng năm | killed (1) |
| P10 `addDays` biên trên `>` → `>=` | killed (1) |
| P11 `clip` luôn `custom` | killed (7) |
| P12 bỏ kiểm năm < 1900 trong `parseQuickDate` | killed (1) |
| P13 `reportMarks` tháng → ngày | killed (4) |
| M1 bỏ "làm tròn tới 1.000 tr → tỷ" | killed (1) |
| M2 bỏ luật "một dấu sau 0" | killed (1) |
| M3 cho trộn dấu nhóm | killed (2) |
| M4 cho dấu thập phân trùng dấu nhóm | killed (2) |
| M5 bỏ luật nhóm đầu 1–3 chữ số | killed (1) |
| M6 bỏ lỗi `fraction` | killed (3) |
| M7 `formatVndDelta(0)` có dấu | killed (1) |
| M8 bỏ chặn "-0" của `formatPercent` | killed (1) |
| M9 `formatFileSize` so trước làm tròn | killed (1) |
| M10 `formatCount` nhận số âm | killed (1) |
| S1 RF bỏ kiểm `MET` | killed (1) |
| S2 `markIndexer` cho mốc chạm nhau | killed (1) |
| S3 `markIndexer` cho mốc ngược | **SURVIVED** → CL-A8 |
| S4 byMark doanh số dùng FYP nộp | killed (6) |
| S5 `periodMetrics` doanh số dùng FYP nộp | killed (17) |
| S6 góc nhìn Team = mọi người | killed (18) |
| C1 so sánh: ngày cuối kỳ coi như đã hết | killed (4) |
| C2 bỏ cắt ở kỳ trước ngắn hơn | killed (2) |
| C3 điểm % khi chỉ một bên có tỉ lệ | killed (1) |
| A1 lịch hôm nay thành "Chưa ghi kết quả" | killed (8) |
| A2 byMark bỏ góc nhìn | killed (6) |
| N1 `snapshotDate` `<` → `<=` | **SURVIVED** (tương đương: khi hôm nay = ngày cuối thì hai nhánh trả cùng ngày) |
| N2 tìm nhị phân `<` → `<=` | killed (5) |
| N3 bỏ sắp xếp theo KH | killed (2) |
| N4 bỏ kiểm thứ tự ngày | killed (1) |
| L1 cùng ngày không tính | killed (15) |
| L2 `stageOn` không sắp | killed (1) |
| L3 comparator `|| 1` | **SURVIVED** (mutation không tác dụng, thay bằng L3b) |
| L3b lần chuyển cùng ngày đảo thứ tự | killed (3) |
| L4 cho mở lại về N2 | killed (1) |
| L5 RF bỏ N3 | killed (27) |
| K1 `kycHash` bỏ `status` | **SURVIVED** (tương đương với bất biến hiện có, xem §4 D) |
| K2 `kycHash` phụ thuộc thứ tự | killed (3) |
| K3 bỏ `manualMaterial` | killed (1) |
| K4 `markConflict` nhận cùng giá trị | killed (1) |
| K5 `resolveConflict` giữ các fact khác ở conflict | killed (1) |
| K6 `confirmFact` không thay bản cũ | killed (5) |
| K7 `isMaterialChange` bỏ lọc cốt lõi | killed (2) |
| G1 cổng cần > 6 | killed (2) |
| G2 bỏ "Tài sản hoặc Bảo vệ" | killed (1) |
| G3 luật `any` thành `all` | killed (19) |
| G4 trường mâu thuẫn không tính "đã có" | killed (5) |
| G5 bỏ bắt buộc Mục tiêu | killed (1) |

## Phụ lục B — Lệnh grep export (CL-A5)

```bash
cd /c/workspace/Project-2C-review
for s in <mọi tên export của packages/domain/src/index.ts>; do
  prod=$(grep -rlw --include='*.ts' --include='*.tsx' --include='*.mjs' "$s" apps packages e2e tools \
    | grep -v node_modules | grep -v '^packages/domain/' | grep -v '\.test\.' | grep -v '/dist/' | wc -l)
  echo "$s prod=$prod"; done
```

Rồi với từng tên `prod=0`: `grep -rlw <tên> packages apps e2e --include='*.ts' --include='*.tsx'` để thấy nơi dùng còn lại (chỉ test).

## Phụ lục C — Nguồn test tạm / probe

Mọi file ở `C:\workspace\deep-review-1-4\claude\A\`. Chạy probe: `node node_modules/vitest/vitest.mjs run --config vitest.probe.config.mts <tên>`. Chạy mutation: `node mutate.mjs [tiền tố]`.

### `vitest.probe.config.mts`

```ts
// Runs the gói A probes (probe-*.test.ts) against the review worktree's packages, read-only.
// Usage: node node_modules/vitest/vitest.mjs run --config vitest.probe.config.mts [file filter]
const repo = 'C:/workspace/Project-2C-review';
const here = 'C:/workspace/deep-review-1-4/claude/A';

export default {
  root: here,
  resolve: {
    alias: [
      { find: /^@p2c\/domain$/, replacement: `${repo}/packages/domain/src/index.ts` },
      { find: /^@p2c\/db$/, replacement: `${repo}/packages/db/src/index.ts` },
    ],
  },
  server: { fs: { allow: [repo, here, 'C:/workspace/deep-review-1-4/common'] } },
  test: { include: ['probe-*.test.ts'], globals: true, testTimeout: 600_000 },
};
```

### `vitest.mut.config.mts`

```ts
// Runs the mutated copy of packages/domain/src (see mutate.mjs) without touching the repo.
const here = 'C:/workspace/deep-review-1-4/claude/A';

export default {
  root: `${here}/mut`,
  test: { include: ['src/**/*.test.ts'] },
};
```

### `mutate.mjs`

```js
// Deep review Phase 1–4, gói A: "phá code" probe. Copies packages/domain/src of the review worktree
// into ./mut/src, applies ONE textual mutation, runs the domain tests there and records whether any
// test failed (killed) or all passed (survived). The repo itself is never written.
// Usage: node mutate.mjs [name-filter]
import { cpSync, readFileSync, rmSync, writeFileSync, appendFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const REPO_SRC = 'C:/workspace/Project-2C-review/packages/domain/src';
const HERE = 'C:/workspace/deep-review-1-4/claude/A';
const MUT = `${HERE}/mut/src`;
const VITEST = `${HERE}/node_modules/vitest/vitest.mjs`;

/** [name, file, from, to] — `from` must occur exactly once in the file. */
const MUTATIONS = [
  // period.ts
  ['P1 cap: start.day > last → >=', 'period.ts', 'start.day > last', 'start.day >= last'],
  ['P2 chart daily ≤31 → ≤32', 'period.ts', '< DAILY_MARKS_MAX_DAYS ?', '<= DAILY_MARKS_MAX_DAYS ?'],
  ['P3 next-year suggestion > 60 → >= 60', 'period.ts', ') > NEXT_YEAR_SUGGESTION_DAYS', ') >= NEXT_YEAR_SUGGESTION_DAYS'],
  ['P4 week clip Math.max(monday, FIRST_DAY) dropped', 'period.ts', 'fromDayNumber(Math.max(monday, FIRST_DAY))', 'fromDayNumber(monday)'],
  ['P5 shift custom: cap check dropped', 'period.ts', 'if (!customRangeAllowed(moved.start, moved.end)) {', 'if (false) {'],
  ['P6 todayPeriod: always new object', 'period.ts', 'return same ? period : target;', 'return target;'],
  ['P7 switchKind: anchor always period.start', 'period.ts', 'viewingToday ? today : period.start', 'period.start'],
  ['P8 cap: Math.min LAST_DAY dropped', 'period.ts', 'return fromDayNumber(Math.min(end, LAST_DAY));', 'return fromDayNumber(end);'],
  ['P9 formatPeriodValue: same-year short form always', 'period.ts', 'return start.year === end.year', 'return true'],
  ['P10 addDays upper bound > → >=', 'period.ts', 'result > LAST_DAY', 'result >= LAST_DAY'],
  ['P11 clip: kind always custom', 'period.ts', "kind: whole ? mark.kind : 'custom'", "kind: 'custom'"],
  ['P12 parseQuickDate year range: < MIN_YEAR dropped', 'period.ts', 'if (year < MIN_YEAR || year > MAX_YEAR)', 'if (year > MAX_YEAR)'],
  ['P13 reportMarks: month → days', 'period.ts', "period.kind === 'month' ? splitBy(period, 'week')", "period.kind === 'month' ? splitBy(period, 'day')"],
  // money.ts / number.ts
  ['M1 compact: rounding-to-1000tr guard dropped', 'money.ts', 'magnitude >= BILLION || millionHundredths >= 1000 * 100', 'magnitude >= BILLION'],
  ['M2 splitNumber: lone mark after 0 rule dropped', 'money.ts', "(marks.length === 1 && head === '0')", 'false'],
  ['M3 splitNumber: mixed separators allowed', 'money.ts', 'if ([...separators].some((mark) => mark !== separator)) return null;', ''],
  ['M4 splitNumber: decimal mark may equal grouping mark', 'money.ts', 'if (hasDecimal && marks.at(-1) === separator) return null;', ''],
  ['M5 splitNumber: head 1–3 digits rule dropped', 'money.ts', "if (!/^[1-9]\\d{0,2}$/.test(head)) return null;", ''],
  ['M6 parseVnd: fraction check dropped (round away)', 'money.ts', "if (!/^0*$/.test(digits.slice(scale))) return { ok: false, error: 'fraction' };", ''],
  ['M7 formatVndDelta: 0 gets a sign', 'money.ts', 'if (amount === 0) return magnitude;', ''],
  ['M8 formatPercent: -0 guard dropped', 'number.ts', 'value < 0 && tenths > 0', 'value < 0'],
  ['M9 formatFileSize: compare before rounding', 'number.ts', 'Math.round(value * 10) >= 10240', 'value >= 1024'],
  ['M10 formatCount: negative accepted', 'number.ts', '!Number.isSafeInteger(count) || count < 0', '!Number.isSafeInteger(count)'],
  // stats.ts / compare.ts / counts / snapshot / lifecycle
  ['S1 rfMatcher: MET check dropped', 'stats.ts', "appointment.status === 'MET' && rfIds.has(appointment.id)", 'rfIds.has(appointment.id)'],
  ['S2 markIndexer: touching marks allowed', 'stats.ts', 'daysBetween(previous.end, mark.start) <= 0', 'daysBetween(previous.end, mark.start) < 0'],
  ['S3 markIndexer: reversed mark allowed', 'stats.ts', 'daysBetween(mark.start, mark.end) < 0 ||', ''],
  ['S4 byMark revenue uses submittedFyp', 'stats.ts', 'issued.revenue += policy.issuedFyp ?? policy.submittedFyp;', 'issued.revenue += policy.submittedFyp;'],
  ['S5 periodMetrics revenue uses submittedFyp', 'stats.ts', 'revenue: sum(issued.map((policy) => policy.issuedFyp ?? policy.submittedFyp)),', 'revenue: sum(issued.map((policy) => policy.submittedFyp)),'],
  ['S6 team scope: all people', 'stats.ts', 'people.filter((person) => person.teamId === scope.teamId)', 'people'],
  ['C1 compare: ended uses >= (last day counts as ended)', 'compare.ts', 'if (compareDates(today, period.end) > 0)', 'if (compareDates(today, period.end) >= 0)'],
  ['C2 compare: no cut at end of shorter period', 'compare.ts', 'earlier(addDays(before.start, daysBetween(period.start, today)), before.end)', 'addDays(before.start, daysBetween(period.start, today))'],
  ['C3 compare: closeRatePoints when only one side has rate', 'compare.ts', 'current.closeRate && previous.closeRate', 'current.closeRate'],
  ['A1 appointmentGroup: today counts as unrecorded', 'appointment-counts.ts', "compareDates(appointment.date, today) < 0 ? 'unrecorded'", "compareDates(appointment.date, today) <= 0 ? 'unrecorded'"],
  ['A2 byMark: scope ignored', 'appointment-counts.ts', '    if (!matches(appointment.reId)) continue;\n    const mark', '    const mark'],
  ['N1 snapshotDate: today < end → <=', 'stage-snapshot.ts', 'compareDates(today, period.end) < 0 ? today : period.end', 'compareDates(today, period.end) <= 0 ? today : period.end'],
  ['N2 series: binary search <= 0', 'stage-snapshot.ts', 'if (compareDates(dates[middle]!, date) < 0) low = middle + 1;', 'if (compareDates(dates[middle]!, date) <= 0) low = middle + 1;'],
  ['N3 series: per-customer sort dropped', 'stage-snapshot.ts', 'sorted: sortedByDate(grouped.get(customer.id) ?? []),', 'sorted: grouped.get(customer.id) ?? [],'],
  ['N4 series: order check dropped', 'stage-snapshot.ts', 'if (previous && compareDates(previous, date) > 0) {', 'if (false) {'],
  ['L1 stageAtEndOf: same day excluded', 'customer-lifecycle.ts', 'compareDates(t.date, date) <= 0', 'compareDates(t.date, date) < 0'],
  ['L2 stageOn: no sort', 'customer-lifecycle.ts', 'return stageAtEndOf(sortedByDate(transitions.filter((t) => t.customerId === customerId)), date);', 'return stageAtEndOf(transitions.filter((t) => t.customerId === customerId), date);'],
  ['L3 sortedByDate: unstable (reverse ties)', 'customer-lifecycle.ts', 'compareDates(a.date, b.date))', 'compareDates(a.date, b.date) || 1)'],
  ['L3b sortedByDate: ties reversed', 'customer-lifecycle.ts', 'return [...transitions].sort(', 'return [...transitions].reverse().sort('],
  ['L4 reopen to N2 allowed', 'customer-lifecycle.ts', "to !== 'N3'", "to !== 'N3' && to !== 'N2'"],
  ['L5 RF from N3 dropped', 'customer-lifecycle.ts', "(from === 'N4' || from === 'N3')", "from === 'N4'"],
  // KYC
  ['K1 kycHash: status not hashed', 'kyc.ts', 'JSON.stringify([fact.field, fact.value, fact.status])', 'JSON.stringify([fact.field, fact.value])'],
  ['K2 kycHash: order-dependent', 'kyc.ts', '    .sort()\n', '\n'],
  ['K3 nextKycVersion: manual material ignored', 'kyc.ts', 'isMaterialChange(before, after) || manualMaterial', 'isMaterialChange(before, after)'],
  ['K4 markConflict: same value accepted', 'kyc.ts', ' || current.some((fact) => fact.value === input.value)', ''],
  ['K5 resolveConflict: others of field kept in conflict', 'kyc.ts', "if (fact.field === chosen.field && fact.status === 'conflict') {", 'if (false) {'],
  ['K6 confirmFact: old value stays active', 'kyc.ts', "existing.field === input.field && existing.status !== 'superseded'", 'false'],
  ['K7 isMaterialChange: core filter dropped', 'kyc.ts', 'return currentEntries(before, isCore) !== currentEntries(after, isCore);', 'return currentEntries(before, () => true) !== currentEntries(after, () => true);'],
  ['G1 gate: analysis needs > 6', 'kyc-gate.ts', 'present.size >= t.analysisMinCategories', 'present.size > t.analysisMinCategories'],
  ['G2 gate: any-of dropped', 'kyc-gate.ts', ' &&\n    t.analysisAnyOfCategories.some((category) => present.has(category))', ''],
  ['G3 gate: rule any treated as all', 'kyc-gate.ts', "return rule === 'all'", 'return true'],
  ['G4 gate: conflict not counted as answered', 'kyc-gate.ts', 'const answered = new Set(current.map((fact) => fact.field));', "const answered = new Set(current.filter((f) => f.status === 'active').map((fact) => fact.field));"],
  ['G5 gate: required GOALS dropped', 'kyc-gate.ts', ' &&\n    present.has(t.analysisRequiredCategory)', ''],
];

const filter = process.argv[2];
const results = [];
for (const [name, file, from, to] of MUTATIONS) {
  if (filter && !name.startsWith(filter)) continue;
  rmSync(`${HERE}/mut`, { recursive: true, force: true });
  cpSync(REPO_SRC, MUT, { recursive: true });
  const path = `${MUT}/${file}`;
  const text = readFileSync(path, 'utf8');
  const count = text.split(from).length - 1;
  if (count !== 1) {
    results.push({ name, outcome: `NOT APPLIED (found ${count}×)` });
    continue;
  }
  writeFileSync(path, text.replace(from, to));
  const run = spawnSync(process.execPath, [VITEST, 'run', '--config', `${HERE}/vitest.mut.config.mts`], {
    cwd: HERE,
    encoding: 'utf8',
  });
  const out = `${run.stdout}${run.stderr}`;
  const failed = /Tests\s+(\d+) failed/.exec(out)?.[1];
  const outcome = run.status === 0 ? 'SURVIVED' : `killed (${failed ?? '?'} failed)`;
  if (run.status !== 0 && !failed) appendFileSync(`${HERE}/mutate-errors.log`, `== ${name}\n${out.slice(-3000)}\n`);
  results.push({ name, outcome });
  console.log(`${outcome.padEnd(22)} ${name}`);
}
writeFileSync(`${HERE}/mutate-results${filter ? `-${filter}` : ''}.json`, JSON.stringify(results, null, 2));
rmSync(`${HERE}/mut`, { recursive: true, force: true });
```

### `probe-cap.test.ts`

```ts
// Probe CL-A1: customRangeMaxEnd when the start day equals the last day of the third month.
// Spec Phase 4 §3.1 rule 1: "ngày liền trước 'cùng ngày, 3 tháng sau'; tháng đó ngắn hơn thì là
// ngày cuối của tháng đó" → 28/11/2026 → 27/02/2027 (28/02 exists), 30/01 → 29/04, 31/12 → 30/03.
import { customRangeMaxEnd, formatDate, parseDate } from '@p2c/domain';

const rows: [string, string][] = [
  ['28/11/2026', '27/02/2027'],
  ['29/11/2026', '28/02/2027'],
  ['30/01/2027', '29/04/2027'],
  ['31/12/2026', '30/03/2027'],
  ['29/11/2027', '28/02/2028'],
  ['30/11/2027', '29/02/2028'],
];

it.each(rows)('cap from %s is %s', (from, expected) => {
  expect(formatDate(customRangeMaxEnd(parseDate(from)!))).toBe(expected);
});
```

### `probe-edges.test.ts`

```ts
// Probe gói A, trục E: inputs at the edges of the domain parsers and formatters. Prints what each
// returns so the report can quote it; asserts nothing beyond "does not throw" unless stated.
import {
  addDays,
  calendarDate,
  chartMarks,
  comparisonWindows,
  customPeriod,
  formatDate,
  formatPercent,
  formatPeriodValue,
  formatVnd,
  formatVndCompact,
  formatVndDelta,
  fromLocalDate,
  localFileStamp,
  parseQuickDate,
  parseVnd,
  periodOf,
  reportMarks,
  shift,
  switchKind,
} from '@p2c/domain';

it('parseVnd on typical Vietnamese spellings', () => {
  const inputs = [
    '500.000 VNĐ',
    '500.000 vnđ',
    '500.000 VND',
    '500.000đ',
    '500 000 000',
    '1tr5',
    '1 tỷ 2',
    '1,5 tỷ',
    '1,500 tỷ',
    '1.000tr',
    '0',
    '-0',
    '--5',
    '9.007.199.254.740.991',
    '9.007.199.254.740.992',
    '0,001k',
    '1,0005k',
    "2 TỶ",
    '2 Tỉ',
  ];
  const out = Object.fromEntries(inputs.map((text) => [text, parseVnd(text)]));
  console.log(JSON.stringify(out, null, 1));
});

it('formatters at the edges', () => {
  const out = {
    compact999_995_000: formatVndCompact(999_995_000),
    compact999_994_999: formatVndCompact(999_994_999),
    compactMaxSafe: formatVndCompact(Number.MAX_SAFE_INTEGER),
    vndMinSafe: formatVnd(-Number.MAX_SAFE_INTEGER),
    deltaNeg: formatVndDelta(-1_500_000),
    percent1e21: formatPercent(1e21),
    percent1_45: formatPercent(1.45),
    percent0_05: formatPercent(0.05),
    percentNeg0_04: formatPercent(-0.04),
  };
  console.log(JSON.stringify(out, null, 1));
});

it('dates and periods at the edges', () => {
  const today = calendarDate(2027, 1, 3);
  const out = {
    quick2812on0301: parseQuickDate('28/12', today),
    quick0101on0301: parseQuickDate('1/1', today),
    week2100: formatPeriodValue(periodOf('week', calendarDate(2100, 12, 31))),
    yearToCustomFrom2100: formatPeriodValue(
      switchKind(periodOf('year', calendarDate(2100, 1, 1)), 'custom', today),
    ),
    shift92back: (() => {
      try {
        return formatPeriodValue(
          shift(customPeriod(calendarDate(2027, 11, 1), calendarDate(2028, 1, 31)), 1),
        );
      } catch (error) {
        return String(error);
      }
    })(),
    marks32days: chartMarks(customPeriod(calendarDate(2027, 1, 1), calendarDate(2027, 2, 1))).length,
    reportMarksMay2027: reportMarks(periodOf('month', calendarDate(2027, 5, 1))).map(
      (m) => `${m.kind} ${formatDate(m.start)}–${formatDate(m.end)}`,
    ),
    comparisonLastWeek2100Ended: comparisonWindows(
      periodOf('week', calendarDate(2100, 12, 31)),
      calendarDate(2100, 12, 31),
    ),
    addDaysNeg: formatDate(addDays(calendarDate(1900, 3, 1), -1)),
    // A JS Date just after local midnight and just before: the calendar day follows the machine's
    // time zone (process TZ here), which is the documented contract of fromLocalDate.
    tz: process.env.TZ ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    beforeMidnight: formatDate(fromLocalDate(new Date(2026, 11, 31, 23, 59, 59, 999))),
    afterMidnight: formatDate(fromLocalDate(new Date(2027, 0, 1, 0, 0, 0, 0))),
    stamp: localFileStamp(new Date(2027, 0, 1, 0, 0)),
  };
  console.log(JSON.stringify(out, null, 1));
});
```

### `probe-golden.test.ts`

```ts
// Probe gói A, focus "golden không bị chiều theo code": the expected numbers of every golden table
// in docs/golden/*.md (and C01–C11 in the Phase 4 spec) are parsed from the Markdown and compared
// with the TS fixtures / tests, row by row.
import { readFileSync } from 'node:fs';
import { GOLDEN_CASES } from '../../../Project-2C-review/packages/domain/src/golden/metrics.fixture';
import { APPOINTMENT_GOLDEN_CASES } from '../../../Project-2C-review/packages/domain/src/golden/appointments.fixture';
import {
  CHART_GOLDEN_CASES,
  SNAPSHOT_GOLDEN_CASES,
} from '../../../Project-2C-review/packages/domain/src/golden/stage-snapshot.fixture';

const repo = 'C:/workspace/Project-2C-review';
const rows = (file: string, prefix: string) =>
  readFileSync(`${repo}/${file}`, 'utf8')
    .split('\n')
    .filter((line) => line.startsWith(`| ${prefix}`))
    .map((line) => line.split('|').map((cell) => cell.trim()));
const num = (cell: string) => (cell === '—' ? null : Number(cell.replace(/\./g, '')));

it('chi-so.md G01–G22 = metrics.fixture.ts', () => {
  const table = rows('docs/golden/chi-so.md', 'G');
  expect(table).toHaveLength(GOLDEN_CASES.length);
  for (const cells of table) {
    const [, id, , , nop, cs, ph, ds, rf] = cells;
    const g = GOLDEN_CASES.find((c) => c.id === id)!;
    expect([id, num(nop!), num(cs!), num(ph!), num(ds!), num(rf!)]).toEqual([
      id,
      g.expected.submittedCount,
      g.expected.caseSize / 1e6,
      g.expected.issuedCount,
      g.expected.revenue / 1e6,
      g.expected.rfCount,
    ]);
  }
});

it('lich-hen.md A01–A13 = appointments.fixture.ts', () => {
  const table = rows('docs/golden/lich-hen.md', 'A');
  expect(table).toHaveLength(APPOINTMENT_GOLDEN_CASES.length);
  for (const [, id, , , met, missed, unrec, planned, total] of table) {
    const g = APPOINTMENT_GOLDEN_CASES.find((c) => c.id === id)!;
    expect([id, ...[met, missed, unrec, planned, total].map((x) => num(x!))]).toEqual([
      id,
      g.expected.met,
      g.expected.missed,
      g.expected.unrecorded,
      g.expected.planned,
      g.expected.total,
    ]);
  }
});

it('kh-theo-nhom.md S01–S13 = stage-snapshot.fixture.ts', () => {
  const table = rows('docs/golden/kh-theo-nhom.md', 'S');
  for (const cells of table) {
    const id = cells[1]!;
    const snap = SNAPSHOT_GOLDEN_CASES.find((c) => c.id === id);
    if (snap) {
      const [, , , , , n4, n3, n2, n1, th, mch] = cells;
      expect([id, ...[n4, n3, n2, n1, th, mch].map((x) => num(x!))]).toEqual([
        id,
        snap.expected.N4,
        snap.expected.N3,
        snap.expected.N2,
        snap.expected.N1,
        snap.expected.ON_HOLD,
        snap.expected.LOST,
      ]);
    } else {
      const chart = CHART_GOLDEN_CASES.find((c) => c.id === id)!;
      const [, , , n4, n3, n2, n1] = cells;
      const values = [n4, n3, n2, n1].map((x) => num(x!));
      expect([id, ...values]).toEqual([
        id,
        ...(chart.expected
          ? [chart.expected.N4, chart.expected.N3, chart.expected.N2, chart.expected.N1]
          : [null, null, null, null]),
      ]);
    }
  }
  expect(table).toHaveLength(SNAPSHOT_GOLDEN_CASES.length + CHART_GOLDEN_CASES.length);
});

it('phase-4-chi-so.md C01–C11 all appear in compare.test.ts with the same windows', () => {
  const spec = rows('docs/design/phase-4-chi-so.md', 'C');
  const test = readFileSync(`${repo}/packages/domain/src/compare.test.ts`, 'utf8');
  const missing = spec.map((c) => c[1]!).filter((id) => !test.includes(`'${id}:`));
  console.log({ specRows: spec.map((c) => c[1]), missingInTest: missing });
});
```

### `probe-inscope.test.ts`

```ts
// Probe gói A, trục P: inScope per record vs one scopeMatcher per list (load data, team scope).
import { readFileSync } from 'node:fs';
import { inScope, type Scope } from '@p2c/domain';
import { scopeMatcher } from '../../../Project-2C-review/packages/domain/src/stats';
import { importBackup, listTeams, loadMetricsData } from '@p2c/db';

const median = (fn: () => unknown) => {
  fn();
  const t: number[] = [];
  for (let i = 0; i < 9; i++) { const s = performance.now(); fn(); t.push(performance.now() - s); }
  return Math.round(t.sort((a, b) => a - b)[4]! * 100) / 100;
};

it('inScope per record vs scopeMatcher once', async () => {
  const { db } = await importBackup(readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json', 'utf8'));
  const data = loadMetricsData(db);
  const scope: Scope = { kind: 'team', teamId: listTeams(db)[0]!.id };
  const perRecord = median(() => data.appointments.filter((a) => inScope(data.people, a.reId, scope)));
  const once = median(() => { const m = scopeMatcher(data.people, scope); return data.appointments.filter((a) => m(a.reId)); });
  const same = data.appointments.filter((a) => inScope(data.people, a.reId, scope)).length;
  console.log({ appointments: data.appointments.length, kept: same, perRecordMs: perRecord, matcherOnceMs: once });
  db.sqlite.close();
});
```

### `probe-leapquick.test.ts`

```ts
// Probe gói A, trục E: quick date "29/02" typed late in the year before a leap year.
// parseQuickDate infers today's year first; 29/02/2027 does not exist, so the next-year
// suggestion (29/02/2028) is never reached.
import { calendarDate, parseQuickDate } from '@p2c/domain';

it('29/02 typed on 15/12/2027', () => {
  const r = parseQuickDate('29/02', calendarDate(2027, 12, 15));
  const r2 = parseQuickDate('28/02', calendarDate(2027, 12, 15));
  console.log(JSON.stringify({ '29/02': r, '28/02': r2 }));
});
```

### `probe-perf.test.ts`

```ts
// Probe gói A, trục P: cost of the domain metric functions on the load data
// (common/load/load-backup.json: 1 496 KH, 10 434 lịch hẹn, 51 nhân sự, 1 804 HĐ), in Node.
// Each figure is the median of RUNS runs after one warm-up. Read-only: the backup is imported into
// an in-memory sql.js database.
import { readFileSync, writeFileSync } from 'node:fs';
import {
  appointmentCounts,
  appointmentCountsByMark,
  calendarDate,
  chartMarks,
  inScope,
  periodMetrics,
  periodMetricsByMark,
  periodOf,
  reportMarks,
  snapshotDate,
  stageOn,
  stageSnapshotSeries,
  type Scope,
} from '@p2c/domain';
import { importBackup, listCustomers, loadMetricsData, listTeams } from '@p2c/db';

const RUNS = 7;
const TODAY = calendarDate(2026, 10, 5);

function median(fn: () => unknown): number {
  fn();
  const times: number[] = [];
  for (let i = 0; i < RUNS; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  return Math.round(times[Math.floor(RUNS / 2)]! * 100) / 100;
}

it('measures domain metric functions on the load data', async () => {
  const text = readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json', 'utf8');
  const { db } = await importBackup(text);
  const data = loadMetricsData(db);
  const customers = listCustomers(db);
  const teams = listTeams(db);
  const res = data.people.filter((p) => p.role === 'RE');
  const all: Scope = { kind: 'all' };
  const scopes: Scope[] = [
    ...teams.map((t) => ({ kind: 'team' as const, teamId: t.id })),
    ...res.map((p) => ({ kind: 're' as const, reId: p.id })),
  ];
  const year = periodOf('year', TODAY);
  const month = periodOf('month', TODAY);
  const yearMarks = chartMarks(year);
  const monthMarks = reportMarks(month);
  const dayDates = chartMarks(month).map((m) => snapshotDate(m, TODAY)).filter((x) => x !== null);
  const yearDates = yearMarks.map((m) => snapshotDate(m, TODAY)).filter((x) => x !== null);
  const teamScope: Scope = { kind: 'team', teamId: teams[0]!.id };

  const r: Record<string, number | string> = {
    sizes: `${customers.length} KH · ${data.appointments.length} lịch · ${data.transitions.length} chuyển nhóm · ${data.policies.length} HĐ · ${data.people.length} người · ${scopes.length} góc nhìn team+RE`,
  };
  r['periodMetrics(year, all) ×1'] = median(() => periodMetrics(data, year, all));
  r[`periodMetrics(month) × ${scopes.length} scopes (team compare)`] = median(() => {
    for (const s of scopes) periodMetrics(data, month, s);
  });
  r[`appointmentCounts(month) × ${scopes.length} scopes`] = median(() => {
    for (const s of scopes) appointmentCounts(data.appointments, month, s, data.people, TODAY);
  });
  r['periodMetricsByMark(year → 12 marks, all)'] = median(() =>
    periodMetricsByMark(data, yearMarks, all),
  );
  r['appointmentCountsByMark(month → weeks, all)'] = median(() =>
    appointmentCountsByMark(data.appointments, monthMarks, all, data.people, TODAY),
  );
  r['stageSnapshotSeries build (group+sort)'] = median(() =>
    stageSnapshotSeries(customers, data.transitions, data.people),
  );
  const series = stageSnapshotSeries(customers, data.transitions, data.people);
  r['stageSnapshotSeries call: 5 days of month × (all + 4 teams)'] = median(() => {
    series(dayDates, all);
    for (const t of teams) series(dayDates, { kind: 'team', teamId: t.id });
  });
  r['stageSnapshotSeries call: 10 months of year, all'] = median(() => series(yearDates, all));
  r['appointments.filter(inScope(team)) — rebuilds the team Set per record'] = median(() =>
    data.appointments.filter((a) => inScope(data.people, a.reId, teamScope)),
  );
  r['customers.filter(inScope(team)) — per record'] = median(() =>
    customers.filter((c) => inScope(data.people, c.reId, teamScope)),
  );
  r['stageOn(…) per customer (unused in prod; quadratic if used)'] = median(() => {
    for (const c of customers) stageOn(data.transitions, c.id, TODAY);
  });
  writeFileSync(
    'C:/workspace/deep-review-1-4/claude/A/probe-perf.result.json',
    JSON.stringify(r, null, 2),
  );
  console.log(r);
  db.sqlite.close();
});
```

### `probe-properties.test.ts`

```ts
// Probe gói A, trục E / C: properties the domain promises, checked exhaustively or on the load data
// (common/load/load-backup.json) rather than on the small fixtures the unit tests use.
import { readFileSync } from 'node:fs';
import {
  addDays,
  appointmentCounts,
  appointmentCountsByMark,
  calendarDate,
  canShift,
  chartMarks,
  compareDates,
  comparisonWindows,
  customPeriod,
  customRangeAllowed,
  customRangeMaxEnd,
  daysBetween,
  formatDate,
  formatVnd,
  parseVnd,
  periodMetrics,
  periodMetricsByMark,
  periodOf,
  reportMarks,
  shift,
  snapshotDate,
  stageSnapshot,
  stageSnapshotSeries,
  weekdayOf,
  type CalendarDate,
  type Period,
  type Scope,
} from '@p2c/domain';
import { importBackup, listCustomers, listTeams, loadMetricsData } from '@p2c/db';

const TODAY = calendarDate(2026, 10, 5);

function* everyDay(from: CalendarDate, to: CalendarDate) {
  for (let day = from; compareDates(day, to) <= 0; day = addDays(day, 1)) {
    yield day;
    if (compareDates(day, to) === 0) return;
  }
}

it('weekdayOf agrees with Date#getUTCDay on every day of 1900–2100', () => {
  let checked = 0;
  for (const day of everyDay(calendarDate(1900, 1, 1), calendarDate(2100, 12, 31))) {
    const js = new Date(Date.UTC(day.year, day.month - 1, day.day)).getUTCDay();
    expect(weekdayOf(day)).toBe(js === 0 ? 7 : js);
    checked++;
  }
  console.log({ weekdayDaysChecked: checked });
});

it('custom cap: every allowed range is 89–92 days and shifting never throws past canShift', () => {
  let starts = 0;
  let minLen = Infinity;
  let maxLen = 0;
  let shiftMismatch = 0;
  for (const start of everyDay(calendarDate(2024, 1, 1), calendarDate(2031, 12, 31))) {
    const end = customRangeMaxEnd(start);
    const length = daysBetween(start, end) + 1;
    minLen = Math.min(minLen, length);
    maxLen = Math.max(maxLen, length);
    const range = customPeriod(start, end);
    for (const step of [1, -1] as const) {
      const can = canShift(range, step);
      if (can) {
        const moved = shift(range, step);
        if (!customRangeAllowed(moved.start, moved.end)) shiftMismatch++;
      }
    }
    starts++;
  }
  console.log({ capStartsChecked: starts, minLen, maxLen, shiftMismatch });
  expect(shiftMismatch).toBe(0);
});

it('comparison windows: same length (or cut), previous inside the period before, every day 2024–2030', () => {
  let checked = 0;
  const problems: string[] = [];
  for (const today of everyDay(calendarDate(2024, 1, 1), calendarDate(2030, 12, 31))) {
    for (const kind of ['day', 'week', 'month'] as const) {
      const period = periodOf(kind, today);
      const w = comparisonWindows(period, today)!;
      const before = shift(period, -1);
      const curLen = daysBetween(w.current.start, w.current.end);
      const prevLen = daysBetween(w.previous.start, w.previous.end);
      const cut = compareDates(w.previous.end, before.end) === 0;
      if (compareDates(w.previous.start, before.start) !== 0) problems.push(`${kind} ${formatDate(today)} start`);
      if (compareDates(w.previous.end, before.end) > 0) problems.push(`${kind} ${formatDate(today)} past end`);
      if (prevLen !== curLen && !(cut && prevLen < curLen)) problems.push(`${kind} ${formatDate(today)} length`);
      checked++;
    }
  }
  console.log({ comparisonCasesChecked: checked, problems: problems.slice(0, 5), problemCount: problems.length });
  expect(problems).toEqual([]);
});

it('parseVnd(formatVnd(x)) === x on a spread of amounts', () => {
  const amounts = [0, 1, 999, 1000, 1001, 999_999, 1_000_000, 123_456_789, 10 ** 12, Number.MAX_SAFE_INTEGER];
  for (let i = 0; i < 2000; i++) amounts.push(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
  const bad = amounts.filter((x) => {
    const r = parseVnd(formatVnd(x));
    return !r.ok || r.amount !== x;
  });
  expect(bad).toEqual([]);
});

it('series / byMark helpers equal the per-day / per-period forms on the load data', async () => {
  const { db } = await importBackup(
    readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json', 'utf8'),
  );
  const data = loadMetricsData(db);
  const customers = listCustomers(db);
  const scopes: Scope[] = [
    { kind: 'all' },
    ...listTeams(db).map((t) => ({ kind: 'team' as const, teamId: t.id })),
    ...data.people.filter((p) => p.role === 'RE').slice(0, 6).map((p) => ({ kind: 're' as const, reId: p.id })),
  ];
  const series = stageSnapshotSeries(customers, data.transitions, data.people);
  const periods: Period[] = [
    periodOf('year', calendarDate(2025, 1, 1)),
    periodOf('year', TODAY),
    periodOf('month', TODAY),
    periodOf('month', calendarDate(2025, 2, 1)),
    periodOf('week', TODAY),
    customPeriod(calendarDate(2025, 11, 20), calendarDate(2026, 2, 15)),
  ];
  let compared = 0;
  for (const period of periods) {
    for (const marks of [chartMarks(period), reportMarks(period)]) {
      const dates = marks.map((m) => snapshotDate(m, TODAY)).filter((x): x is CalendarDate => x !== null);
      for (const scope of scopes) {
        const viaSeries = series(dates, scope);
        dates.forEach((date, i) => {
          expect(viaSeries[i]).toEqual(stageSnapshot(customers, data.transitions, date, scope, data.people));
        });
        const byMark = periodMetricsByMark(data, marks, scope);
        const counts = appointmentCountsByMark(data.appointments, marks, scope, data.people, TODAY);
        marks.forEach((mark, i) => {
          expect(byMark[i]).toEqual(periodMetrics(data, mark, scope));
          expect(counts[i]).toEqual(appointmentCounts(data.appointments, mark, scope, data.people, TODAY));
          compared++;
        });
      }
    }
  }
  // Every day of 2025–2026 in one call, all scope.
  const all = [...everyDay(calendarDate(2025, 8, 1), TODAY)];
  const big = series(all, { kind: 'all' });
  all.forEach((date, i) => {
    if (i % 7 === 0) expect(big[i]).toEqual(stageSnapshot(customers, data.transitions, date, { kind: 'all' }, data.people));
  });
  console.log({ markComparisons: compared, seriesDays: all.length });
  db.sqlite.close();
});
```

### `probe-redos.test.ts`

```ts
// Probe gói A, trục E (chuỗi dài): time of parseVnd / parseQuickDate on long pasted inputs.
import { calendarDate, parseQuickDate, parseVnd } from '@p2c/domain';

const time = (fn: () => unknown) => { const s = performance.now(); fn(); return Math.round(performance.now() - s); };

it('long inputs', () => {
  const out: Record<string, number> = {};
  for (const n of [1_000, 5_000, 20_000]) {
    out[`vnd "1"+${n} spaces+"x"`] = time(() => parseVnd('1' + ' '.repeat(n) + 'x'));
    out[`vnd "1"+${n} spaces+"tr"+${n} spaces+"x"`] = time(() => parseVnd('1' + ' '.repeat(n) + 'tr' + ' '.repeat(n) + 'x'));
    out[`vnd ${n} digits+"x"`] = time(() => parseVnd('1'.repeat(n) + 'x'));
    out[`vnd ${n} "1." groups`] = time(() => parseVnd('1.'.repeat(n) + '000'));
    out[`quick ${n} chars`] = time(() => parseQuickDate('1/'.repeat(n), calendarDate(2026, 10, 5)));
  }
  console.log(JSON.stringify(out, null, 1));
});
```

### `probe-perf.result.json`

```json
{
  "sizes": "1496 KH · 10434 lịch · 4978 chuyển nhóm · 1804 HĐ · 51 người · 48 góc nhìn team+RE",
  "periodMetrics(year, all) ×1": 1.5,
  "periodMetrics(month) × 48 scopes (team compare)": 18.12,
  "appointmentCounts(month) × 48 scopes": 7.7,
  "periodMetricsByMark(year → 12 marks, all)": 0.99,
  "appointmentCountsByMark(month → weeks, all)": 1.29,
  "stageSnapshotSeries build (group+sort)": 0.89,
  "stageSnapshotSeries call: 5 days of month × (all + 4 teams)": 3.42,
  "stageSnapshotSeries call: 10 months of year, all": 2.52,
  "appointments.filter(inScope(team)) — rebuilds the team Set per record": 5.96,
  "customers.filter(inScope(team)) — per record": 0.92,
  "stageOn(…) per customer (unused in prod; quadratic if used)": 28.25
}
```
