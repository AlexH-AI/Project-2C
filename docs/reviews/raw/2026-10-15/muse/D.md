XONG — muse gói D, 23:54 14/10/2026

# Báo cáo soát xét sâu lượt 1 — gói D: Màn nhập liệu (bên muse)

## 1. Thông tin phiên

- Bên soát xét: muse (người soát xét độc lập, mẫu hình Muse Spark 1.3)
- Gói: D — Màn nhập liệu
- Mã đã chốt của kho: `8855345` (`885534549808f42aec7f9af5743bbf86642ee4bd`), đã kiểm bằng lệnh `git rev-parse HEAD` trước khi đọc mã
- Tình trạng kho đầu phiên (`git status --short`): trống (sạch)
- Giờ bắt đầu: 23:27 14/10/2026
- Kiểu phiên: làm mới (chưa từng có tệp `muse\D.md`)

## 2. Phạm vi đã đọc

(Đang ghi dần trong lúc làm. Phạm vi gói theo bảng kế hoạch: `packages/ui/**` trừ `scripts/`, `apps/desktop/src/{shell,i18n}/**`, `routes/customers/**` trừ tệp trí tuệ nhân tạo và Hợp đồng, `routes/team/**`, `routes/Screen.tsx`, `apps/desktop/src/*`, `apps/desktop/index.html`.)

### 2.1. Tài liệu đã đọc trước

- `common\plan.md` (toàn bộ §1–§12 và phụ lục A–C; phụ lục D trùng lời nhắc phiên nên đọc trong lời nhắc).
- `common\known.md` (toàn bộ: sổ OPEN / ACCEPTED và quyết định K1–K17).
- `common\baseline.md` (toàn bộ: cổng xanh, vùng phủ, gói web, dữ liệu tải, số tham chiếu cùng máy).
- `CLAUDE.md` gốc (122 dòng), `CONTEXT.md` (37 dòng), `packages/ui/CLAUDE.md`, `apps/desktop/CLAUDE.md` (kèm bản đồ xuất / tuyến).
- `docs/design/phase-3-du-lieu.md` (toàn bộ §0–§7: quyết định D1–D10, lược đồ, lệnh ghi, lưu tệp, nhập / xuất, dữ liệu giả).
- `docs/design/phase-6-hoan-thien.md` §1–§4.4 (mục tiêu, thứ tự, S-2 §4.1, Thùng rác §4.2 gồm TR-1–TR-10 và ví dụ E1–E17, hướng dẫn §4.3).
- `docs/metrics/phase-6.md` (số đo nền T-219, ngưỡng thao tác màn dưới 200 mili giây, ngưỡng mở lại, gói web, exe).
- Mẫu giao diện: `mockups/README.md` (bản đồ), `customer-forms.html` (5a–5f), `trash.html` (11a–11g, trọng tâm 11f hộp Xóa khách hàng và 11g câu khóa ghi), `customers.html`, `customer.html`, `kyc-forms.html` (7a–7e), `team.html` (màn và 9a–9c), `table-more.html` (lề Hiện thêm), `phase-3-feedback.html` khối B1 (đầu bảng team, mỗi team một trưởng nhóm) và B2 (hàng chọn chuyên viên).

### 2.2. Tệp mã nguồn đã đọc

Đọc toàn bộ từng tệp trong phạm vi, tổng khoảng 8.050 dòng mã nguồn và bài kiểm (đếm bằng `Get-Content`: 8.047). Danh sách theo nhóm:

- Gói giao diện dùng chung `packages/ui/src`: `index.ts`, `token-guard.ts`, `token-guard.test.ts`, `tokens.css`, `theme.css`, `fonts.css` và thư mục `components` gồm `Button.tsx`, `Chart.tsx`, `chart-theme.ts`, `chart-theme.test.ts`, `Choices.tsx`, `compare-cells.ts`, `compare-cells.test.ts`, `DataTable.tsx`, `Dialog.tsx`, `NavIcon.tsx`, `PeriodPicker.label.ts`, `PeriodPicker.label.test.ts`, `PeriodPicker.tsx`, `PolicyBadge.tsx`, `Segmented.tsx`, `SelectField.tsx`, `show-more.ts`, `show-more.test.ts`, `StageBadge.tsx`, `TextField.tsx`. Tệp phông chữ `.woff2` chỉ ghi nhận hiện diện, không đọc ruột.
- Vỏ ứng dụng `apps/desktop/src/shell`: `AppShell.tsx`, `block-reload.ts`, `block-reload.test.ts`, `close-guard.ts`, `close-guard.test.ts`, `CloseGuard.tsx`, `ErrorBoundary.tsx`, `RePicker.tsx`, `routes.ts`, `routes.test.ts`, `SaveWarning.tsx`, `scope.ts`, `scope.test.ts`, `ScopeContext.tsx`, `ScopePicker.tsx`, `screen-error.ts`, `screen-error.test.ts`, `Sidebar.tsx`, `startup-error.ts`, `startup-error.test.ts`, `StartupError.tsx`, `useRoute.ts`.
- Chữ giao diện `apps/desktop/src/i18n`: `index.ts`, `index.test.ts`, `vi.ts` (1.085 khóa).
- Màn khách hàng `apps/desktop/src/routes/customers` (trừ tệp trí tuệ nhân tạo và Hợp đồng thuộc gói khác): `CustomerAppointments.tsx`, `CustomerDialogs.tsx`, `CustomerKyc.tsx`, `CustomerProfile.tsx`, `customers-view.ts`, `customers-view.test.ts`, `CustomersScreen.tsx`, `CustomersScreen.test.tsx`, `kyc-view.ts`, `kyc-view.test.ts`, `KycDialogs.tsx`.
- Màn team `apps/desktop/src/routes/team`: `PersonDialogs.tsx`, `team-view.ts`, `team-view.test.ts`, `TeamDialogs.tsx`, `TeamScreen.tsx`.
- Gốc ứng dụng: `apps/desktop/src/App.tsx`, `apps/desktop/src/index.css`, `apps/desktop/src/main.tsx`, `apps/desktop/src/ui-choices.test.tsx`, `apps/desktop/src/routes/Screen.tsx`, `apps/desktop/index.html`.

Đọc thêm chỗ mã gói khác mà gói D nối vào (chỉ phần D dùng): `packages/db/src/counts.ts`, `packages/db/src/customers.ts` (`listStageTransitions`, `previewCustomerProfile`), `packages/db/src/appointments.ts` (`listAppointments`), `packages/db/src/backup.ts` (`importBackup`), `packages/ai/src` (`factCode`), `packages/domain/src` (`scopeMatcher`, `byName`), `apps/desktop/src/data/AppDataContext.tsx`, `apps/desktop/src/data/tables.ts`, `apps/desktop/src/data/app-data.ts` (hàm `run`), `apps/desktop/src/routes/appointments/appointment-form.ts` và phần `statusLabel` / `outcomeText` / `STATUS_TONE` / `LINK` của `appointments-view.ts`. Đọc các kiểm đầu-cuối phủ màn gói D để xét trục kiểm thử: `customers`, `customer-forms`, `customer-kyc`, `customer-appointments`, `team`, `data-table`, `dialog-keyboard`, `navigation`, `period-picker`, `theme`.

## 3. Phát hiện

### muse-D1

- Mức: Low
- Trục: C
- Vị trí: `apps/desktop/src/routes/customers/KycDialogs.tsx:396-406` (vẽ lựa chọn), gốc ở `apps/desktop/src/routes/customers/kyc-view.ts:230-238` (`KycResolveOption` không mang số thứ tự) (8855345)
- Tình trạng: CONFIRMED
- Mô tả: Mỗi giá trị trong hộp Giải quyết mâu thuẫn chỉ hiện giá trị kèm nguồn và ngày, thiếu mã dữ kiện F; mẫu 7d và câu nghiệm thu NT-HS-08 đòi mỗi giá trị kèm mã F, ghi chú, ngày.
- Tái hiện / bằng chứng: kiểm `confirm-d.spec.ts` kiểm 1 trên bản web dựng từ mã đã chốt: tạo mâu thuẫn Số con (2 rồi 3), mở hộp Giải quyết, tên hai lựa chọn thu được là `"2"ghi chú 15/09/2026` và `"3"ghi chú 15/09/2026`, 0/2 có mã F. Kiểm `customer-kyc.spec.ts` hiện chỉ bắt tên bắt đầu bằng giá trị (`/^"3"/`) nên không giữ được mẫu.
- Ảnh hưởng: người dùng không lần được giá trị về dòng thời gian theo mã F khi hai giá trị khó phân biệt bằng mắt.
- Đề xuất: thêm số thứ tự vào `KycResolveOption`, vẽ mã F dạng F13 cạnh nguồn và ngày; thêm điều kiện kiểm đầu-cuối cho tên lựa chọn. Ước lượng dưới 400 dòng mã nguồn.

### muse-D2

- Mức: Low
- Trục: C
- Vị trí: `apps/desktop/src/routes/customers/KycDialogs.tsx:272` so với `apps/desktop/src/routes/customers/CustomerDialogs.tsx:323` và `:480` (8855345)
- Tình trạng: CONFIRMED
- Mô tả: Ô Ngày của hộp Ghi chú KYC gắn lỗi trực tiếp (`error={date.error}`) nên báo đỏ ngay khi đang gõ, chưa bấm Lưu; hai hộp cùng dùng móc ngày (`CustomerDialogs.tsx`) đều chỉ gắn lỗi sau khi bấm Lưu (`errors.date`).
- Tái hiện / bằng chứng: kiểm `confirm-d.spec.ts` kiểm 2 trên bản web dựng từ mã đã chốt: xóa trắng ô Ngày (chưa Lưu) đã có `aria-invalid=true`; gõ dở `3` (chưa Lưu) được `aria-invalid=true` kèm câu `Gõ dd/mm hoặc dd/mm/yyyy.` Trong khi mẫu 5b và kiểm `customer-forms.spec.ts` chốt lỗi ô chỉ hiện sau khi bấm Lưu.
- Ảnh hưởng: người gõ ngày thấy câu đỏ chớp tắt giữa chừng; người dùng công cụ hỗ trợ nghe câu lỗi trước khi làm gì sai.
- Đề xuất: hộp Ghi chú KYC cũng giữ lỗi ngày trong trạng thái lỗi sau Lưu như hai hộp cùng móc. Ước lượng dưới 400 dòng mã nguồn.

### muse-D3

- Mức: Low
- Trục: C
- Vị trí: `apps/desktop/src/routes/team/TeamDialogs.tsx:81`, `apps/desktop/src/routes/team/PersonDialogs.tsx:163`; so sánh hộp Xóa khách hàng `apps/desktop/src/routes/customers/CustomerDialogs.tsx:218-244` không khóa (8855345)
- Tình trạng: CONFIRMED
- Mô tả: Hai hộp Xóa team và Xóa nhân sự khóa nút Xóa sau mọi lỗi (`disabled` khi `error` khác rỗng), kể cả lỗi khóa ghi S2-2 mà câu chữ của chính lỗi dặn thử lại khi xong; hộp Xóa khách hàng vẫn cho bấm lại.
- Tái hiện / bằng chứng: kiểm `confirm-d.spec.ts` kiểm 3 trên bản web dựng từ mã đã chốt: xóa team còn nhân sự thì hộp hiện câu `Team còn nhân sự: chuyển hoặc xóa hết nhân sự trước khi xóa team.` và nút Xóa có `disabled=true`. Đường lỗi khóa ghi đi qua cùng một câu lệnh khóa nút nên cũng bị khóa.
- Ảnh hưởng: người xóa đúng lúc đang thay dữ liệu thì hộp bắt đóng ra mở lại mới được bấm tiếp, trái lời dặn thử lại của câu lỗi.
- Đề xuất: chỉ khóa nút với lỗi thuộc loại không bấm lại được (còn người, còn dữ liệu), hoặc mở lại nút khi lỗi là khóa ghi; đồng bộ với hộp Xóa khách hàng. Ước lượng dưới 400 dòng mã nguồn.

## 4. Mục Bloat (mã thừa)

| Việc đã chạy / đọc | Dữ liệu dùng | Số đo | Mã phát hiện |
|---|---|---|---|
| `tsc --noEmit --noUnusedLocals --noUnusedParameters` ở `packages/ui` | Toàn bộ gói | Sạch, thoát 0 | Không |
| `tsc --noEmit --noUnusedLocals --noUnusedParameters` ở `apps/desktop` | Toàn bộ ứng dụng | Sạch, thoát 0 | Không |
| Đo thử `i18n-audit.mjs`: soát chỗ dùng của từng khóa chữ | `vi.ts` 1.085 khóa, quét 341 tệp mã nguồn, kiểm và công cụ | 0 khóa thừa, 0 khóa thiếu (5 chuỗi lạ là hàm `t()` không phải chữ giao diện trong bài kiểm khác) | Không |
| Quét chữ Việt cứng và ký tự `·` `→` trong mã phạm vi D (trừ `vi.ts` và bài kiểm) | Mọi tệp ở §2.2 | Chỉ còn trong chú thích; chữ hiện đều qua `t()`, dấu nối qua `sep.*` | Không |
| Tìm chỗ nhập của từng xuất `@p2c/ui` | Toàn kho | 4 kiểu chỉ không ai nhập (`Choice`, `SegmentedOption`, `ButtonVariant`, `DataTableSort`); kiểu chỉ không tốn chạy, giữ theo lệ gói | Không lập (ghi nhận) |
| Tìm chỗ dùng `showMore` / `SHOW_MORE_STEP` | Toàn kho | Chỉ `DataTable` dùng, kèm bài kiểm riêng — đúng lệ gói giao diện | Không |
| Tìm chỗ dùng các xuất của `CustomerDialogs.tsx` | Toàn kho | `useSaveFailure`, `InvalidAlert`, `ALERT`, `Actions`, `useDateField`, `dayRead` đều có màn khác dùng | Không |
| Trùng mã: hằng `CARD` | `CustomerKyc.tsx:26`, `TeamScreen.tsx:31` giống hệt nhau; bản thứ ba ở màn Lịch hẹn thuộc gói khác | 2 bản trong phạm vi D (chưa tới ngưỡng 3) — để gói F xét toàn cục | Không lập |
| `pnpm lint:deps` | Kết quả nền | Xanh, không chạy lại | Không |

## 5. Mục Hiệu năng

| Việc đã chạy / đo | Dữ liệu dùng | Số đo | Mã phát hiện |
|---|---|---|---|
| Đo thử `perf-d.mjs`: `customerBoard` toàn bộ | Bản tải seed6: 4 team, 51 nhân sự, 1.481 khách hàng, 10.252 lịch hẹn, 1.674 hợp đồng, 4.883 lần chuyển nhóm | Trung vị 1,9 ms (1,6 – 2,8) | Không |
| Đo thử `perf-d.mjs`: `customerBoard` team rồi hẹp xuống RE (màn vẽ 2 bảng mỗi lần) | Như trên | Trung vị 0,8 ms (0,8 – 1,0) | Không |
| Đo thử `perf-d.mjs`: `kycOverview` + `kycTimeline` ở hồ sơ nặng nhất (7 ghi chú, 19 dữ kiện, 20 phiên bản, 6 lần chuyển nhóm, 12 lịch hẹn) | Như trên | Trung vị 0,0 ms (0,0 – 0,1) | Không |
| Đo thử `perf-d.mjs`: `groupByTeam` + `staffMetrics` (màn Team dựng mỗi lần vẽ) | Như trên | Trung vị 6,9 ms (6,7 – 7,5) | Không |
| Đo thử `perf-d.mjs`: `countCustomerRecords` ở khách hàng nặng nhất (hộp Xóa khách hàng) | Như trên | Trung vị 2,3 ms (2,3 – 2,6) | Không |
| Thứ tự sắp cột Nhóm ở bảng Khách hàng | 6 mã nhóm, phép so `byName` của miền | Sắp theo mã trùng sắp theo nhãn (`LOST`, N1–N4, `ON_HOLD`), khớp chữ hiện — đã xét, không lập | Không |

Máy đo và việc chạy cùng lúc: máy trạm văn phòng (Office Laptop), lúc đo không việc nặng chạy cùng. Ngưỡng thao tác màn dưới 200 mili giây: mọi hàm thuần của gói D đều dưới 10 mili giây, còn cách xa ngưỡng. Thời gian nạp bản tải `importBackup` 937 mili giây chỉ ghi tham chiếu (thuộc gói khác).

## 6. Bảng đếm mức × trục

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |

Tỉ lệ PLAUSIBLE: 0% (cả 3 phát hiện đều CONFIRMED bằng kiểm trình duyệt trên bản web dựng từ mã đã chốt).

## 7. Trục đã xét mà không thấy gì

- E (ca biên): đã đọc mọi hàm thuần của gói và bài kiểm của chúng; đã xác minh thứ tự ghi của `listStageTransitions` (`ORDER BY customer_id, seq`) và `listAppointments` (`ORDER BY date, time, id`) mà bảng khách hàng, ngày `từ` và số thứ tự cuộc gặp dựa vào; đã xác minh `previewCustomerProfile` chỉ đọc nên gọi khi vẽ là an toàn; ngày suy năm (`28/12` đầu tháng Một) và tuổi người sinh 29/02 đều có lệ hợp lý kèm bài kiểm; bấm Lưu đúp không lưu trùng vì lệnh ghi đồng bộ và hộp đóng ngay (`app-data.ts:367`). Không thấy gì mới. Ba mục `#141` trong sổ đã biết (thiếu `hạ nhóm` ở dòng `Sau khi lưu`, khối `không tính RF` hiện cả khi đã đóng, lặp `CLOSED_STAGES.includes`) vẫn đúng như sổ, không có bằng chứng mới nên không nêu lại.
- C (đúng khế ước / mẫu / nhãn — phần còn lại): đã đối chiếu từng màn với mẫu 5a–5f, 7a–7e (trừ 7d đã lập muse-D1), B1, B2, `table-more` và khối 11f; các lệch ở màn Khách hàng (ô tìm Ctrl K, bộ lọc, tóm tắt pipeline, Độ phủ KYC) Owner đã xác nhận ở vòng 1 trong danh sách nghiệm thu nên không nêu lại; thứ tự sắp cột Nhóm đã đo, khớp nhãn hiện; hộp thoại nào cũng thiếu nút × so với mẫu nhưng đều có Hủy và Escape, danh sách nghiệm thu không bắt nên không lập. Không thấy gì mới ngoài 3 phát hiện trên.
- D (dữ liệu): màn gói D chỉ ghi qua lệnh của miền và kho, không ghi thẳng; đếm hộp Xóa khách hàng lấy từ `countCustomerRecords` (đo 2,3 ms); số RF hộp 5f và Thùng rác cùng dựa một phép tính nên không lệch. Không thấy gì.
- G (trí tuệ nhân tạo): gói D chỉ nhúng kết quả trí tuệ nhân tạo để xem (`renderNote`, khung trí tuệ ở hồ sơ) và xác nhận đề xuất qua lệnh thường ở `ConfirmFactDialog`; công tắc `webOpen` chặn trích xuất khi mở (K10) nằm ở gói khác. Không thấy gì.
- S (an toàn ở ranh giới): quét `dangerouslySetInnerHTML`, `target=`, `window.open`, `innerHTML` trong phạm vi D không trúng; băm địa chỉ giải mã có bắt lỗi; `localStorage` có bắt lỗi; phông chữ tải nội bộ đã có kiểm `theme.spec.ts` giữ. Không thấy gì.
- P (hiệu năng): số đo ở §5, mọi hàm thuần dưới 10 mili giây so với ngưỡng 200 mili giây. Không thấy gì.
- B (mã thừa): số liệu ở §4, không khóa thừa, không biến thừa, không xuất thừa tốn chạy. Không thấy gì.
- T (chất lượng kiểm thử): hàm thuần đều có bài kiểm đơn vị; màn và hộp thoại có kiểm đầu-cuối dày (`customer-forms`, `customer-kyc`, `team`, `data-table`, `dialog-keyboard`, `navigation`, `period-picker`); đo thử đột biến `mutation-d.mjs` diệt 3/3 (đảo thứ tự dòng thời gian, bỏ nhóm đóng khỏi bảng, đếm cả khách đã đóng vào chỉ số RE); phím mũi tên và `roving tabindex` của `Segmented` đã tự kiểm bằng trình duyệt và đúng, nhưng kho chưa có kiểm giữ hành vi này — ghi nhận để bổ sung, không lập phát hiện. Không thấy gì phải lập.
- A (trợ năng / chữ giao diện): đo thử `contrast.mjs` cho 33 cặp chữ trên nền đều đạt AA (thấp nhất 4,55 cho chữ mờ trên thẻ, còn lại từ 5,5 trở lên); tên nhóm radio của `Choices` đã tự kiểm bằng trình duyệt (`Nhóm ban đầu` đọc được) và kiểm đầu-cuối trong kho cũng bắt theo tên nên hành vi có giữ; hộp thoại bẫy điểm đọc tự nhiên, Escape đóng, trả điểm đọc khi xong, đã có kiểm giữ; không chữ cứng ngoài `vi.ts`. Hai mục trong sổ đã biết (ô ngày Tùy chọn báo đỏ sớm khi Tab; biểu đồ thiếu bảng cho công cụ đọc) vẫn đúng như sổ, không có bằng chứng mới nên không nêu lại. Không thấy gì mới.

## 8. Phụ lục

### 8.1. Nguồn đo thử / thử tạm / đột biến

Đo thử đặt trong `muse\D\`, chỉ đọc kho, không ghi gì vào kho:

- `i18n-audit.mjs` — soát chỗ dùng của 1.085 khóa chữ trên 341 tệp: 0 thừa, 0 thiếu.
- `contrast.mjs` — tỉ số tương phản 33 cặp chữ trên nền từ `tokens.css`: 33/33 đạt AA.
- `perf-d.mjs` — đo hàm thuần trên bản tải seed6 qua `importBackup` của `@p2c/db`: số liệu ở §5.
- `mutation-d.mjs` cùng 3 bản chép đột biến (`mut-kyc-view.ts`, `mut-customers-view.ts`, `mut-team-view.ts`): 4 điều kiện xanh trên bản gốc, 4 điều kiện đỏ trên bản đột biến (MUT2 văng `TypeError`, cũng tính bị diệt vì bài kiểm nào chạy tới cũng đỏ) — 3/3 đột biến bị diệt, 0 sống.
- `confirm.config.ts` + `confirm-d.spec.ts` — 4 kiểm trình duyệt Edge trên bản web do `e2e/serve.mjs` dựng lại từ mã đã chốt (cổng 4174, chốt ngày 15/09/2026): tên lựa chọn hộp Giải quyết (0/2 có mã F), lỗi ngày hiện khi đang gõ (`aria-invalid=true` kèm câu `Gõ dd/mm hoặc dd/mm/yyyy.` khi chưa Lưu), nút Xóa team `disabled=true` sau lỗi, phím mũi tên `Segmented` đúng. Cả 4 kiểm đều xanh; thư mục `muse\test-results` là rác của lần chạy này.
- Lần chạy kiểm trình duyệt có dựng lại `dist` trong kho (thư mục được git bỏ qua, đúng luật); `git status` cuối phiên vẫn sạch.

### 8.2. Tình trạng kho cuối phiên

`git status --short` cuối phiên: trống (sạch), trùng đầu phiên. `git rev-parse HEAD` cuối phiên: `885534549808f42aec7f9af5743bbf86642ee4bd`, trùng mã đã chốt.

### 8.3. Giờ xong

23:54 14/10/2026.
