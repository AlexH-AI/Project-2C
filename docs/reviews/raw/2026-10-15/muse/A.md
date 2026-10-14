XONG — muse gói A, 22:45 14/10/2026
# Báo cáo soát sâu lượt 1 — gói A: Lõi dữ liệu

## 1. Thông tin phiên

- Bên soát: muse
- Gói: A (Lõi dữ liệu)
- Đường dẫn gói: `packages/domain/**`, `packages/db/**`
- Mã nguồn: `C:\workspace\Project-2C-review-2`, ở trạng thái tách rời
- SHA đầu phiên: `885534549808f42aec7f9af5743bbf86642ee4bd` (viết gọn `8855345`)
- Lệnh kiểm đầu phiên: `git -C C:\workspace\Project-2C-review-2 rev-parse HEAD` và `status --short` (kèm `safe.directory`)
- Kết quả `status --short` đầu phiên: (trống, cây làm việc sạch)
- Giờ bắt đầu: 22:12 14/10/2026 (giờ địa phương +07:00)
- Tệp báo cáo: `C:\workspace\deep-review-1-6\muse\A.md`
- Thư mục nháp: `C:\workspace\deep-review-1-6\muse\A\`
- Cách làm: chỉ đọc kho nguồn, không ghi vào kho; mọi thử nghiệm đặt trong thư mục nháp của gói
- Phiên làm tiếp: phiên trước bị cắt khi mới dựng khung và 5 thăm dò chưa ghi kết quả. Phiên này giữ nguyên khung, chạy lại các thăm dò đã có, đọc sâu từng tệp và ghi dần.

## 2. Phạm vi đã đọc

Đang đọc dần. Bảng dưới ghi từng tệp đã đọc xong trong phạm vi gói.

| Tệp (tính từ gốc kho) | Số dòng | Trạng thái |
|---|---|---|
| packages/domain/src/period.ts | 434 | Đã đọc hết |
| packages/domain/src/money.ts | 188 | Đã đọc hết |
| packages/domain/src/stats.ts | 272 | Đã đọc hết |
| packages/db/src/customers.ts | 370 | Đã đọc hết |
| packages/db/src/team.ts | 320 | Đã đọc hết |
| packages/db/src/common.ts | 165 | Đã đọc hết |
| packages/db/src/errors.ts | 108 | Đã đọc hết |
| packages/db/src/schema.ts | 384 | Đã đọc hết |
| packages/db/src/appointments.ts | 545 | Đã đọc hết |
| packages/db/src/policies.ts | 154 | Đã đọc hết |
| packages/db/src/backup-validation.ts | 438 | Đã đọc hết |
| packages/db/src/backup.ts | 203 | Đã đọc hết |
| packages/db/src/database.ts | 229 | Đã đọc hết |
| packages/db/src/kyc.ts | 551 | Đã đọc hết |
| packages/db/src/trash.ts | 254 | Đã đọc hết |
| packages/db/src/counts.ts | 90 | Đã đọc hết |
| packages/db/src/ai-analyses.ts | 337 | Đã đọc hết |
| packages/db/src/ids.ts | 34 | Đã đọc hết |
| packages/db/src/settings.ts | 29 | Đã đọc hết |
| packages/db/src/migrations.ts | 39 | Đã đọc hết |
| packages/db/src/test-support.ts | 39 | Đã đọc hết |
| packages/db/src/seed.ts | 634 | Đã đọc hết |
| packages/db/src/seed-data.ts | 289 | Đã đọc hết |
| packages/db/src/index.ts | 96 | Đã đọc hết |
| packages/domain/src/model.ts | 116 | Đã đọc hết |
| packages/domain/src/customer-lifecycle.ts | 63 | Đã đọc hết |
| packages/domain/src/stage-snapshot.ts | 169 | Đã đọc hết |
| packages/domain/src/appointment-counts.ts | 116 | Đã đọc hết |
| packages/domain/src/compare.ts | 80 | Đã đọc hết |
| packages/domain/src/kyc.ts | 164 | Đã đọc hết |
| packages/domain/src/kyc-fact.ts | 71 | Đã đọc hết |
| packages/domain/src/kyc-gate.ts | 85 | Đã đọc hết |
| packages/domain/src/kyc-catalog.ts | 155 | Đã đọc hết |
| packages/domain/src/evidence-level.ts | 52 | Đã đọc hết |
| packages/domain/src/number.ts | 43 | Đã đọc hết |
| packages/domain/src/name-order.ts | 10 | Đã đọc hết |
| packages/domain/src/pipeline-stage.ts | 8 | Đã đọc hết |
| packages/domain/src/index.ts | 116 | Đã đọc hết |
| packages/domain/src/customer-lifecycle.test.ts | 131 | Đã đọc hết |

Tệp đọc thêm ngoài gói để hiểu chỗ nối: `CLAUDE.md` gốc, `CONTEXT.md`, `packages/domain/CLAUDE.md`, `packages/db/CLAUDE.md`, `docs/decisions/0007-dinh-nghia-chi-so-va-vong-doi.md`, `0008-kyc-du-kien-co-cau-truc-va-cong-deterministic.md`, `docs/golden/chi-so.md`, `docs/design/phase-3-du-lieu.md` (mục 4, 6, 7), `docs/design/phase-6-hoan-thien.md` (mục 4.2), `docs/metrics/phase-6.md` (ngưỡng), `packages/domain/src/golden/metrics.fixture.ts` (đối chiếu G09), `common/plan.md`, `common/known.md`, `common/baseline.md`.

## 3. Phát hiện

```
ID: MU-A1
Mức: Low
Trục: C
Vị trí: packages/db/src/customers.ts:311 (8855345), packages/db/src/team.ts:276, packages/db/src/appointments.ts:298
Tình trạng: CONFIRMED
Mô tả: Giá trị liệt kê sai (giới tính, vai trò, nhóm) làm lệnh lộ lỗi thô của kho, không mang mã lỗi.
Tái hiện / bằng chứng: chạy `node muse/A/probe-2-enums.mjs` và `node muse/A/probe-6-stage.mjs` cho kết quả thật: giới tính X cho `Error | (không có mã) | CHECK constraint failed: customers_gender`; vai trò ADMIN cho `Error | (không có mã) | CHECK constraint failed: people_role`; nhóm N9 khi tạo cho `Error | (không có mã) | CHECK constraint failed: customers_stage`; nhóm sau N9 cho `Error | (không có mã) | CHECK constraint failed: appointments_stage_after`. Đối chứng: trạng thái DONE cho `DbError | INVALID_STATUS` đúng. Nguồn thăm dò ở phụ lục.
Ảnh hưởng: nơi gọi nhập sai (lỗi lập trình, ép kiểu) nhận lỗi không mã, màn hình không dịch được, chỉ hiện chữ thô. Dữ liệu không đổi vì giao dịch vẫn lùi.
Đề xuất: kiểm liệt kê ở lệnh như kiểm loại hẹn, ném mã lỗi có mã; cỡ nhỏ (dưới 100 dòng sản phẩm).
```

```
ID: MU-A2
Mức: Nit
Trục: C
Vị trí: packages/domain/src/model.ts:76 (8855345)
Tình trạng: CONFIRMED
Mô tả: Ghi chú nói người phối hợp gồm RE khác, trái với luật chỉ TL / IS / BD / BDM.
Tái hiện / bằng chứng: đọc ghi chú dòng 76 `TL/IS/BD/BDM (or other RE) joining the meeting` và đối chiếu luật ở `packages/db/src/appointments.ts:408` chỉ nhận `REVIEWER_ROLES`, cùng thăm dò `node muse/A/probe-1-coordinator.mjs` cho kết quả thật `lệnh từ chối: INVALID_COORDINATOR` khi đặt RE làm người phối hợp. Quyết định K5 cũng chốt chỉ bốn vai trò trên.
Ảnh hưởng: người đọc sau hiểu sai luật, có thể viết sai khi sửa.
Đề xuất: sửa ghi chú bỏ cụm RE khác; cỡ một dòng.
```

## 4. Bloat (mã thừa / lặp / xuất thừa)

| Việc đã chạy / đọc | Dữ liệu dùng | Số đo | Mã phát hiện |
|---|---|---|---|
| `tsc --noEmit --noUnusedLocals --noUnusedParameters` ở `packages/domain` | mã nguồn gói | 0 lỗi | không |
| `tsc --noEmit --noUnusedLocals --noUnusedParameters` ở `packages/db` | mã nguồn gói | 0 lỗi | không |
| Rà 37 xuất hay dùng bằng `node muse/A/bloat-exports.mjs` (đếm nơi nhập trong 344 tệp) | toàn kho | mọi xuất có từ 2 nơi dùng trở lên, không có xuất chết | không |
| Đọc bản đồ xuất ở hai `CLAUDE.md` của gói, đối chiếu `index.ts` | mã nguồn gói | khớp, xuất nội bộ (`markIndexer`, `checkRestore*`, `liveCustomer`) dùng trong gói đúng chỗ | không |
| Rà lặp mã từ 3 nơi: tên, ngày, tiền, `seq`, kiểm vai trò | mã nguồn gói | dùng chung qua `common.ts` / `domain`, không thấy lặp từ 3 nơi | không |
| Đối chiếu mục lặp đã biết trong sổ (`counts.ts`, `trash.ts:refs`, `plain`, `newSessionId`) | `common/known.md` | trùng mục đã biết, không có bằng chứng mới nên không nêu | không |

## 5. Hiệu năng

Máy đo: `D13_THINKPAD` (máy chạy lượt này, trùng máy đo nền). Việc chạy song song: không có việc nặng, chỉ mở trình soạn thảo và cửa sổ lệnh.

| Việc đã chạy / đo | Dữ liệu dùng | Số đo | Ngưỡng / mốc so | Mã phát hiện |
|---|---|---|---|---|
| `importBackup` 3 lần (`node muse/A/probe-5-perf.mjs`) | tải `load-2026-10-12-seed6` (15,7 triệu ký tự) | 976, 825, 812 ms | mốc `backup.read` 1035 ms, ngưỡng 2000 ms: đạt | không |
| `listCustomers` trung vị 5 lần | tải đã nhập (1481 KH) | 6 ms (5-10) | ngưỡng màn 200 ms: đạt | không |
| `listAppointments` trung vị 5 lần | tải đã nhập (10252 lịch) | 52 ms (51-55) | ngưỡng màn 200 ms: đạt | không |
| `listStageTransitions` trung vị 5 lần | tải đã nhập (4883 chuyển) | 11 ms (11-13) | ngưỡng màn 200 ms: đạt | không |
| `listPolicies` trung vị 5 lần | tải đã nhập (1674 HĐ) | 8 ms (7-12) | ngưỡng màn 200 ms: đạt | không |
| `listTrash` trung vị 5 lần | tải đã nhập (117 dòng rác) | 52 ms (51-59) | mốc `trash.open` 89 ms, ngưỡng 200 ms: đạt | không |
| `countRecords` trung vị 5 lần | tải đã nhập | 6 ms | ngưỡng màn 200 ms: đạt | không |
| `exportBackup` trung vị 5 lần | tải đã nhập | 200 ms (197-204) | mốc `backup.export` 481 ms, ngưỡng 1000 ms: đạt | không |
| `periodMetrics`, `rfCount`, `appointmentCounts`, `stageSnapshot` trung vị 5 lần | tải đã nhập, kỳ tháng 10/2026 | 1,2 / 0,8 / 1,0 / 0,9 ms | ngưỡng màn 200 ms: đạt | không |

## 6. Bảng đếm mức × trục

| Mức / Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Low | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Nit | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Tổng | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |

Cả hai phát hiện đều ở tình trạng đã xác nhận bằng lệnh chạy thật, không có phát hiện phỏng đoán.

## 7. Trục đã xét mà không thấy gì

- E (trường hợp biên): đã xét, không thấy. Đã chạy `probe-3-edges.mjs` (năm nhuận, biên 1900-2100, tuần cuối, trần 3 tháng, ngày nhanh, 7 mẫu tiền nói) cho kết quả đạt hết; đọc `period.ts`, `money.ts`, `calendarDate`, `parseQuickDate`, `customRangeMaxEnd`.
- C (đúng hợp đồng): đã xét, thấy 2 phát hiện ở trên. Đã đối chiếu golden G09 giữa `docs/golden/chi-so.md` và `metrics.fixture.ts` (khớp 5 / 1900 / 5 / 2300 / 5); đọc ADR-0007, ADR-0008, spec mục 4 và 6, kiểm D7/D10 qua `probe-4-multistep.mjs`.
- D (dữ liệu): đã xét, không thấy thêm ngoài MU-A1. Đã đọc `backup.ts`, `backup-validation.ts` (14 luật), `database.ts` (giao dịch lùi cả lỗi thô), `trash.ts`, `counts.ts`; chạy `probe-4` (sửa kết quả sau chuyển tay rồi xuất nhập lại được).
- G (giữ AI): đã xét, không thấy. Đã đọc `ai-analyses.ts` (kiểm nhãn, nội dung, nhắc STALE), `evidence-level.ts`; gói này chỉ lưu trữ, giữ rào ở gói C.
- S (an toàn ranh giới): đã xét, không thấy thêm ngoài MU-A1. Đã đọc kiểm NUL ở `cleanText`, `valueOf`, `storedRawOutput`; kiểm nhập sao lưu bọc lỗi thô thành `BACKUP_INVALID`; không đọc khóa, không gọi mạng.
- P (hiệu năng): đã xét, không thấy. Đã đo ở mục 5, mọi số dưới ngưỡng; `listTrash` 52 ms dù đọc cả ba bảng (mục đã biết, không có bằng chứng mới).
- B (mã thừa): đã xét, không thấy. Đã chạy ở mục 4, không có biến thừa, xuất chết hay lặp từ 3 nơi.
- T (chất lượng kiểm thử): đã xét, không thấy thêm ngoài khoảng trống liệt kê ở MU-A1. Đã đọc `customer-lifecycle.test.ts`, chạy đột biến `mutant-1.mjs` cho kết quả bị giết; cổng nền 2755 kiểm thử đạt.
- A (trợ năng / đa ngữ): đã xét, không thấy. Gói này không có mặt hiển thị; chuỗi tiếng Việt duy nhất (`Cần chăm sóc...`, `Cập nhật KYC...`, định dạng tiền ngày) đúng chính tả.

## 8. Phụ lục

### 8.1. Nguồn thăm dò / thử tạm / đột biến

- `muse/A/loader.mjs`: bộ nạp đọc mã nguồn trực tiếp mà không ghi vào kho (kế thừa phiên trước).
- `muse/A/probe-1-coordinator.mjs`: đặt RE làm người phối hợp. Kết quả: `lệnh từ chối: INVALID_COORDINATOR`. Dùng cho MU-A2.
- `muse/A/probe-2-enums.mjs`: giới tính X, vai trò ADMIN, trạng thái DONE. Kết quả: hai trường hợp đầu lộ lỗi thô không mã, trường hợp sau đúng mã. Dùng cho MU-A1.
- `muse/A/probe-3-edges.mjs`: biên tiền ngày kỳ. Kết quả: đạt hết 13 kiểm tra.
- `muse/A/probe-4-multistep.mjs`: gặp không chuyển nhóm, sửa tay, sửa lại kết quả, xuất nhập lại. Kết quả: chuyển nhóm 1 rồi 2, nhập lại được.
- `muse/A/probe-5-perf.mjs`: đo trên dữ liệu tải. Kết quả ở mục 5.
- `muse/A/probe-6-stage.mjs` (phiên này viết thêm): nhóm N9 khi tạo và nhóm sau N9. Kết quả: cả hai lộ lỗi thô không mã. Dùng cho MU-A1.
- `muse/A/bloat-exports.mjs` (phiên này viết thêm): đếm nơi dùng 37 xuất trong 344 tệp. Kết quả: không có xuất chết.
- `muse/A/mutant-1.mjs` (phiên này viết thêm): đột biến `isRfTransition` luôn sai. Kết quả: bị giết (`GIET: N4->N2 muốn true, được false`).

### 8.2. Trạng thái kho cuối phiên

- Lệnh: `git -C C:\workspace\Project-2C-review-2 status --short`
- Kết quả: (trống, cây làm việc sạch, giống đầu phiên)
- Không ghi gì vào kho trong cả phiên.

### 8.3. Giờ xong

- 22:45 14/10/2026 (giờ địa phương +07:00)
