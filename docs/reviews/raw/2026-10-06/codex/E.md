# Gói E — Lịch hẹn + Khách hàng — review độc lập Codex

Ngày: 05/10/2026. SHA: `f0c53eb57eb7eac8665ad87287e794ae4c5bc43b` (detached HEAD; kiểm trước và sau review).

Có **6 phát hiện mới CONFIRMED: 2 Medium, 4 Low**, không có Critical/High hoặc PLAUSIBLE. Không tạo Issue, không sửa repo, không commit. Không đọc, mở, liệt kê hoặc tìm kiếm thư mục/báo cáo của bên review khác. Chỉ thực hiện Gói E; chưa kết luận điều kiện đóng Phase 4 của Gói H.

## 1. Phạm vi và cách kiểm

Đọc trước các tài liệu bắt buộc: `docs/process/deep-review-phase-1-4.md`, `CLAUDE.md`, `CONTEXT.md`, `docs/design/phase-3-du-lieu.md`, `docs/design/phase-4-chi-so.md`, toàn bộ `docs/golden/{chi-so,kh-theo-nhom,kyc,lich-hen}.md`; đọc `common/{README,baseline,known}.md`. Golden được dùng làm chuẩn; không sửa hoặc đề xuất đổi fixture để khớp code.

Đã đọc toàn bộ **24 file sản phẩm + 7 file unit test** trong hai thư mục của E. Phạm vi dòng dưới đây là ở SHA đã ghim:

| File | Dòng đã đọc | Loại |
|---|---:|---|
| `apps/desktop/src/routes/appointments/AppointmentDialog.tsx` | 1–443 | SP |
| `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx` | 1–667 | SP |
| `apps/desktop/src/routes/appointments/DeleteAppointmentDialog.tsx` | 1–101 | SP |
| `apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx` | 1–246 | SP |
| `apps/desktop/src/routes/appointments/FailureAlert.tsx` | 1–11 | SP |
| `apps/desktop/src/routes/appointments/MetFields.test.ts` | 1–36 | test |
| `apps/desktop/src/routes/appointments/MetFields.tsx` | 1–164 | SP |
| `apps/desktop/src/routes/appointments/OutcomeDialog.tsx` | 1–316 | SP |
| `apps/desktop/src/routes/appointments/RescheduleDialog.tsx` | 1–61 | SP |
| `apps/desktop/src/routes/appointments/RescheduleFields.tsx` | 1–142 | SP |
| `apps/desktop/src/routes/appointments/YearGrid.tsx` | 1–145 | SP |
| `apps/desktop/src/routes/appointments/appointment-form.test.ts` | 1–189 | test |
| `apps/desktop/src/routes/appointments/appointment-form.ts` | 1–119 | SP |
| `apps/desktop/src/routes/appointments/appointments-view.test.ts` | 1–578 | test |
| `apps/desktop/src/routes/appointments/appointments-view.ts` | 1–409 | SP |
| `apps/desktop/src/routes/appointments/outcome-form.test.ts` | 1–182 | test |
| `apps/desktop/src/routes/appointments/outcome-form.ts` | 1–132 | SP |
| `apps/desktop/src/routes/customers/CustomerAppointments.tsx` | 1–153 | SP |
| `apps/desktop/src/routes/customers/CustomerDialogs.tsx` | 1–385 | SP |
| `apps/desktop/src/routes/customers/CustomerKyc.tsx` | 1–264 | SP |
| `apps/desktop/src/routes/customers/CustomerPolicies.tsx` | 1–109 | SP |
| `apps/desktop/src/routes/customers/CustomerProfile.tsx` | 1–207 | SP |
| `apps/desktop/src/routes/customers/CustomersScreen.tsx` | 1–254 | SP |
| `apps/desktop/src/routes/customers/KycDialogs.tsx` | 1–362 | SP |
| `apps/desktop/src/routes/customers/PolicyDialogs.tsx` | 1–362 | SP |
| `apps/desktop/src/routes/customers/customers-view.test.ts` | 1–186 | test |
| `apps/desktop/src/routes/customers/customers-view.ts` | 1–148 | SP |
| `apps/desktop/src/routes/customers/kyc-view.test.ts` | 1–261 | test |
| `apps/desktop/src/routes/customers/kyc-view.ts` | 1–216 | SP |
| `apps/desktop/src/routes/customers/policy-form.test.ts` | 1–138 | test |
| `apps/desktop/src/routes/customers/policy-form.ts` | 1–129 | SP |

Tổng theo file hiện có: 5.545 dòng SP và 1.570 dòng unit test (không tính e2e hỗ trợ).

Đọc các đoạn hỗ trợ trực tiếp: `apps/desktop/src/data/{AppDataContext.tsx,app-data.ts}` (luồng query/run và vòng đời DB), `packages/ui/src/components/{Dialog,Choices,Button,TextField,PeriodPicker,DataTable}.tsx` (hộp thoại, nhãn, render bảng); `packages/db/src/{appointments,customers,policies,kyc}.ts` (API được gọi và thứ tự đọc/ghi); các helper tiền/ngày/kỳ của domain. Đây là kiểm đường gọi của E, không phải review đầy đủ Gói B/C/D/F.

Đã đọc test e2e liên quan: `e2e/{customers,customer-forms,customer-appointments,customer-kyc,customer-policies,appointment-outcome,appointments}.spec.ts` (luồng form, D3/D7/D9, pending KYC, xóa mềm, phân nhóm, lịch năm). Đối chiếu khóa i18n đang dùng và cấu hình Vitest/Playwright/Vite. Không chạy lại toàn bộ e2e/baseline; số baseline xem `common/baseline.md`.

Kiểm mới trong phiên:

- 7 file unit test E: **106/106 xanh** (`E/baseline-tests.log`).
- `tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters --incremental false`: exit 0.
- Probe sql.js dùng backup chung và một DB nhỏ tạo hoàn toàn qua lệnh nghiệp vụ: xanh, kết quả ở `E/probe-results.jsonl`.
- Mutation từng chỗ trên bản sao ngoài repo; witness và đối chứng nêu ở CX-E5.
- Edge thật qua Playwright: nhập backup, tạo KH/ghi chú KYC, cây trợ năng lịch năm, Tab/Shift+Tab/Escape.
- Build production bằng Vite với `outDir`/cache ngoài repo; Edge production đo 5 lượt mỗi chế độ. Không cài dependency/công cụ mới.

Dữ liệu tải nguyên bản: **1.496 KH / 10.434 lịch hẹn / 51 nhân sự**, ngày neo **05/10/2026**. Đo hiệu năng không thêm KH probe vào dữ liệu tải. Probe sai dữ kiện chạy ở context trình duyệt riêng, không ảnh hưởng các mẫu đo.

## 2. Phát hiện

### CX-E1 — Đổi trường KYC mang theo giá trị của trường trước

- **ID:** CX-E1
- **Mức:** Medium
- **Trục:** D (liên quan E/C; chỉ đếm một lần ở D)
- **Vị trí:** `apps/desktop/src/routes/customers/KycDialogs.tsx:218–222`, `:93–104`, SHA `f0c53eb`.
- **Tình trạng:** CONFIRMED.
- **Mô tả:** Chọn trường mới chỉ đổi `field` và xóa lỗi, giữ nguyên `value`, `answer` và `mode`. Khi hai trường đều nhận chuỗi, giá trị của trường cũ có thể được thêm và lưu hợp lệ vào trường mới.
- **Tái hiện / bằng chứng:** `node C:/workspace/deep-review-1-4/codex/E/browser.mjs` khi server `serve.mjs` đang chạy. Tạo KH mới → Ghi chú KYC → nhập ghi chú “KH nói đang sinh sống tại Huế.” → chọn **Nơi sinh sống**, nhập **Huế** → đổi sang **Mục tiêu chính** → không nhập giá trị mới → Thêm dữ kiện → Lưu ghi chú. Kết quả `browser-results.json`: `stale: "Huế"`; dữ kiện đã lưu **“Mục tiêu chính: Huế”**, ghi nhận 1/8 hạng mục và v1. Không có `pageerror`. Đây là lưu vào DB qua UI thật, không chỉ suy đoán từ state.
- **Ảnh hưởng:** Người dùng đổi lựa chọn trong lúc soạn một fact có thể gán nhầm nội dung vào hạng mục KYC; gate/phiên bản sau đó sử dụng fact sai. Dòng fact trước khi lưu có thể giúp người dùng nhận ra, nhưng form không buộc xác nhận lại giá trị theo trường mới. Không khẳng định `mode`/`answer` đã gây sai dữ liệu trong probe này.
- **Đề xuất:** Khi đổi trường, đặt lại draft giá trị/yes-no/chế độ tương ứng; thêm e2e đổi trường trước khi Thêm dữ kiện. Ước lượng < 40 dòng SP, không cần dependency hoặc migration dữ liệu giả lập.

### CX-E2 — “Case size dự kiến” lấy cuộc gặp sớm hơn trong cùng ngày

- **ID:** CX-E2
- **Mức:** Low
- **Trục:** C (liên quan E)
- **Vị trí:** `apps/desktop/src/routes/customers/policy-form.ts:121–128`; đường đọc `packages/db/src/appointments.ts:106`, SHA `f0c53eb`.
- **Tình trạng:** CONFIRMED.
- **Mô tả:** Helper được mô tả là case size của cuộc gặp mới nhất có giá trị, nhưng chỉ sort theo ngày. `listAppointments` trả ngày/giờ/id tăng dần, nên cùng ngày helper chọn cuộc gặp sớm nhất thay vì mới nhất.
- **Tái hiện / bằng chứng:** Chạy mode `probe` ở phụ lục. DB nhỏ tạo KH N3, lịch **05/10/2026 09:00** rồi **16:00**, lần lượt ghi MET/giữ N3 với case size **100 triệu** và **900 triệu**. Hai lần đều đi qua `scheduleAppointment` + `recordMeetingOutcome`, đều hợp lệ. `expectedCaseSize(listAppointments(db, customerId))` trả **100.000.000**, dù lần gặp 16:00 được ghi sau và có **900.000.000**. Nguồn/JSON ở `probe.test.ts` và `probe-results.jsonl`.
- **Ảnh hưởng:** Hồ sơ KH và hộp tạo HĐ hiển thị số tham khảo cũ khi có nhiều cuộc gặp trong ngày. **Không làm sai FYP/chỉ số**, không tự điền số này thành FYP; vì vậy mức Low.
- **Đề xuất:** Giữ thứ tự “mới nhất” theo ngày rồi giờ, và một tiêu chí ổn định khi cùng giờ; cân nhắc dùng thứ tự repository đã cung cấp. Thêm fixture hai cuộc gặp cùng ngày, giá trị mới nhất null và giờ null. Ước lượng < 30 dòng SP.

### CX-E3 — Lịch năm dựng toàn bộ 7.071 dòng, chuyển chế độ mất khoảng 1,13 giây

- **ID:** CX-E3
- **Mức:** Medium
- **Trục:** P
- **Vị trí:** `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:111–117`, `:303–309`; render hỗ trợ `packages/ui/src/components/DataTable.tsx:145–160`, SHA `f0c53eb`.
- **Tình trạng:** CONFIRMED, có số đo.
- **Mô tả:** Cả kỳ năm được truyền nguyên vào DataTable và render mọi dòng. Dữ liệu tải đã ghim tạo 7.071 dòng trong kỳ năm; mỗi lần đổi Tháng → Năm phải dựng khoảng 85.000 phần tử DOM.
- **Tái hiện / bằng chứng:** Chạy `build-serve.mjs`, sau khi production preview sẵn sàng chạy `performance-browser.mjs`. Edge **154.0.4258.53**, headless, viewport 1440×1000, locale vi-VN, không throttle CPU. Timer chạy **trong trang**, từ DOM click lựa chọn kỳ đến sau hai `requestAnimationFrame`, gồm React commit/layout, không gồm độ trễ driver Playwright. Năm/Tháng luân phiên 5 lượt; không tính nhập backup và tải trang trong timer.

| Chế độ | Trung vị (ms) | Min–max (ms) | Dòng bảng | Phần tử DOM toàn trang |
|---|---:|---:|---:|---:|
| Lịch năm | **1.129,6** | 974,1–1.214,5 | **7.071** | **85.121** |
| Lịch tháng 10 | 169,4 | 150,5–188,0 | 654 | 8.600 |
| Khách hàng dạng Bảng | 210,3 | 187,7–346,5 | 1.496 | 16.547 |
| Khách hàng Kanban | 23,3 | 20,3–120,2 | 0 | 291 |

Năm có 5 mẫu: 1214,5 / 1118,9 / 1174,8 / 974,1 / 1129,6 ms. Số liệu gốc ở `performance-browser.json`. Pure helper `yearGrid` chỉ trung vị 0,45 ms (25 mẫu sau 5 warm-up); `monthGrid` 24,71 ms. Kết hợp số dòng/DOM, thời gian helper và việc render tất cả dòng cho thấy phần bảng là điểm cần xử lý trước; **chưa tách riêng bằng profiler để quy toàn bộ 1,13 giây cho một component**. Đây là phép đo trên một máy, không phải SLA mọi máy.

- **Ảnh hưởng:** Người dùng xem cả năm với dữ liệu cỡ tải chịu khoảng một giây phản hồi/render mỗi lần đổi kỳ. Bảng KH cũng render toàn bộ nhưng chậm nhẹ hơn; nêu để so sánh, không nâng thành phát hiện riêng.
- **Đề xuất:** Giới hạn số dòng được render bằng phân trang dùng hạ tầng hiện có, giữ tổng/kỳ và kết quả sort/filter đúng trên toàn bộ dữ liệu. Đo lại cùng script/dữ liệu, kiểm thao tác dòng ở trang sau. Ước lượng một task < 200 dòng SP nếu chọn phân trang, không cần thư viện mới. Không đề xuất đổi golden hay mockup trong review này.

### CX-E4 — Cây trợ năng lịch năm không có số của từng nhóm lịch

- **ID:** CX-E4
- **Mức:** Low
- **Trục:** A
- **Vị trí:** `apps/desktop/src/routes/appointments/YearGrid.tsx:92–96`, `:109–138`, SHA `f0c53eb`.
- **Tình trạng:** CONFIRMED.
- **Mô tả:** Tên accessible của nút tháng chỉ có tổng; toàn thanh nhóm có `aria-hidden="true"`, nên cả số hiển thị và `title` phân nhóm bị loại khỏi cây trợ năng. Chú giải vẫn đọc được tên nhóm nhưng không cung cấp số theo tháng.
- **Tái hiện / bằng chứng:** `browser.mjs` lấy `ariaSnapshot()` vùng **Lịch năm 2026** sau nhập backup. Tháng 1 trong ảnh có **591 Đã gặp + 145 Dời lịch/hủy/không đến**, nhưng cây chỉ có nút **“Tháng 1/2026: 736 lịch hẹn”**; tháng 10 chỉ đọc tổng 654, không có các số của thanh nhóm. Ảnh `year-grid.png` và snapshot trong `browser-results.json`.
- **Ảnh hưởng:** Người dùng trình đọc màn hình không nhận được cơ cấu từng tháng mà người nhìn thấy trên lưới; bảng lịch bên dưới liệt kê từng lịch, không thay thế số tổng hợp theo nhóm/tháng.
- **Đề xuất:** Bổ sung mô tả accessible số từng nhóm cho mỗi tháng, ví dụ `aria-describedby` hoặc text ẩn được sinh từ cùng `MonthCell`; giữ thanh màu decorative. Ước lượng < 40 dòng SP. Đây là **YearGrid màn Lịch hẹn**, khác KNOWN Chart N4–N1 và ô ngày ngoài tháng (#156).

### CX-E5 — Unit test không phát hiện parseTime nhận giờ 24:00

- **ID:** CX-E5
- **Mức:** Low
- **Trục:** T
- **Vị trí:** `apps/desktop/src/routes/appointments/appointment-form.test.ts:84–96`; mutation tại `appointment-form.ts:70`, SHA `f0c53eb`.
- **Tình trạng:** CONFIRMED.
- **Mô tả:** Bộ test giờ kiểm 25:00 nhưng không kiểm đúng biên 24:00. Đổi duy nhất giới hạn giờ từ `> 23` sang `> 24` trên bản sao làm helper nhận 24:00 sai hợp đồng mà **14/14 test gốc của file vẫn xanh**.
- **Tái hiện / bằng chứng:** `mutation-time.test.ts` là bản sao test gốc, chỉ đổi import sang `mutated-appointment-form.ts`. Bản sản phẩm sao từ SHA ghim, thay đúng `Number(match[1]) > 23` → `Number(match[1]) > 24`. Mode `mutation-time`: 14 xanh. `witness.test.ts` xác nhận original trả `{ok:false}`, mutant trả `{ok:true,time:'24:00'}`, original 23:59 hợp lệ. Đối chứng `> 99` chạy cùng 14 test làm test `25:00` **đỏ** (1 fail/13 pass), chứng minh suite đang load bản patch thật. Log `mutation-time.log`, `witness.log`, `control-time.log`.
- **Ảnh hưởng:** Đây là lỗ hổng test, **code hiện tại vẫn từ chối 24:00**. Không kết luận toàn bộ `pnpm verify`/e2e sẽ sống qua mutation này; lớp DB cũng có validation độc lập. Thiếu ca biên làm refactor parser dễ lọt sai ở seam form.
- **Đề xuất:** Thêm ca 23:59 hợp lệ và 24:00 không hợp lệ (cùng phút 59/60, giờ 00 nếu cần). Không cần đổi SP. Ước lượng < 20 dòng test.

### CX-E6 — Đóng hộp Ghi chú KYC bằng Escape làm mất vị trí focus

- **ID:** CX-E6
- **Mức:** Low
- **Trục:** A
- **Vị trí:** `apps/desktop/src/routes/customers/CustomerProfile.tsx:118–120`, `:189–194`; nguyên nhân chung `packages/ui/src/components/Dialog.tsx:20–22`, `:29–32`, SHA `f0c53eb`.
- **Tình trạng:** CONFIRMED.
- **Mô tả:** Hộp native dialog mở bằng `showModal`, nhưng Escape bị `preventDefault` rồi callback làm React unmount hộp. Luồng này không đóng dialog/khôi phục focus về nút đã mở hộp.
- **Tái hiện / bằng chứng:** `keyboard.mjs`: ở hồ sơ KH, focus **+ Ghi chú KYC**, nhấn Enter mở hộp, nhấn Escape, chờ hộp biến mất và hai frame. **3/3 lần** `document.activeElement.tagName === 'BODY'`; nút mở hộp không được focus lại. `keyboard-results.json` ghi đầy đủ. Probe Tab/Shift+Tab 36 bước không thấy focus vào phần tử có thể tương tác của nội dung nền. Một số bước Edge trả activeElement BODY khi đi qua browser chrome; **không dùng điều đó để báo lỗi bẫy focus**. Lỗi ở đây chỉ là focus sau Escape.
- **Ảnh hưởng:** Người dùng bàn phím/trình đọc màn hình mất vị trí thao tác ở hồ sơ KH sau khi đóng hộp. Đã tái hiện ở web Edge; chưa chạy WebView Tauri để xác nhận cùng kết quả native. Nguyên nhân nằm component dùng chung thuộc D, ghi ở E vì luồng KYC trực tiếp đã xác nhận; khi tổng hợp cần tránh tạo hai task cho cùng nguyên nhân.
- **Đề xuất:** Khi kết thúc modal, đóng dialog đúng vòng đời và trả focus về trigger còn tồn tại; thêm e2e Enter → Escape → nút mở hộp được focus, kiểm cả modal KYC mở trên hộp kết quả cuộc gặp. Ước lượng < 40 dòng SP ở component chung.

## 3. KNOWN — không đếm thành phát hiện mới

Đối chiếu `common/known.md`, không tạo lại các mục:

- Ô ngày ngoài tháng/khoảng `aria-hidden` (#156), RF/chuyển nhóm lệch mockup và link lịch trước (#163/#165), lịch Dời lịch không có nút xóa (#171 — ACCEPTED).
- Các helper badge/StageBadge và cảnh báo/chuyển nhóm tay của Khách hàng (#141): trùng ít nhất ba chỗ là KNOWN B; không lấy làm phát hiện mới.
- Chart N4–N1 thiếu số cho screen reader (P8/P12/T2) là KNOWN; CX-E4 ở thành phần và màn khác.
- Viền input/mũi tên sort dưới 3:1 (R4), DataTable thiếu unit test một số nhánh / cellClass chỉ e2e (#240), PeriodPicker báo lỗi khi blur (R4): KNOWN, không nâng thành lỗi mới ở E.
- Ngày đang chọn của Lịch hẹn không tự nhảy qua nửa đêm (#318 — ACCEPTED).
- KYC snapshot hash (S-1/D-1), thay DB chồng nhau (S-2) thuộc đường chung B/C/D; không chạy lại hoặc suy luận thêm từ E.

## 4. Bảng đếm mức × trục

Mỗi ID đếm theo một trục chính, không nhân đôi các lỗi có liên quan nhiều trục. KNOWN không nằm trong bảng.

| Mức | E | C | D | P | B | T | A | S | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 2 |
| Low | 0 | 1 | 0 | 0 | 0 | 1 | 2 | 0 | 4 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng** | **0** | **1** | **1** | **1** | **0** | **1** | **2** | **0** | **6** |

## 5. Đi qua mọi trục; “đã xét, không thấy” và giới hạn

| Trục | Cách đã xét / kết quả |
|---|---|
| E — Edge | Đọc/runs test helper rỗng/một/nhiều hàng, status tương lai/quá hạn, khóa D7, ngày hợp lệ/cuối kỳ, tiền dương/an toàn, normalize Unicode và thứ tự. Probe hai MET cùng ngày (CX-E2), đổi trường trong draft (CX-E1), 23:59/24:00 (CX-E5). Tuổi 29/02/1984 ở 28/02 và 01/03/2027 trả 42/43; chưa có quy tắc ngày sinh nhuận khác nên không báo lỗi. **Đã xét, không thấy edge mới khác** trong các đường này. Không đổi timezone/clock hệ điều hành hoặc mô phỏng qua nửa đêm WebView; hành vi giữ ngày chọn là KNOWN. |
| C — Hợp đồng | Đối chiếu nhãn “Các lần hẹn trước” với lọc hôm nay trở về trước, nhóm planned/unrecorded/met/other, bộ lọc phối hợp, khóa stage theo D7, người đánh giá D9, policy đọc chỉ số domain và golden. Có CX-E2; **đã xét, không thấy sai hợp đồng mới khác** trong các đường đã đọc. |
| D — Dữ liệu | Trace mọi form E → `app.run` → lệnh DB cho schedule/reschedule/outcome+next/edit/delete, KH/stage, KYC/conflict, policy; đối chiếu kiểu tiền/ngày/fact với spec backup. Không có SQL trực tiếp trong các route E; lệnh kết quả+kế tiếp dùng API nguyên tử, modal lỗi giữ draft. Có CX-E1 sai nội dung đúng kiểu. **Đã xét, không thấy đường ghi E mới bỏ qua validation/transaction**; không tiêm lỗi ổ đĩa/Tauri hoặc audit lại toàn bộ backup (B/C/D). |
| P — Hiệu năng | Dữ liệu tải thật, 25 mẫu helper/repository sau warm-up và 5 lượt UI production/chế độ. Có CX-E3. Không báo `monthGrid` quét ô×lịch thành lỗi riêng chỉ vì nhìn thuật toán; đã có số đo 24,71 ms trung vị. Build chia chunk theo cấu hình hiện có; không quy kích thước chunk chung thành finding E. |
| B — Thừa/chết/lặp | `tsc --noUnusedLocals --noUnusedParameters` xanh; rà export/consumer/helper và key i18n trong phạm vi E bằng `rg`, đọc đường branch của form. **Đã xét, không thấy bloat mới** có ảnh hưởng ngoài badge/StageBadge KNOWN #141. Không coi một helper chỉ có một consumer là lỗi tự thân. Không dùng knip/jscpd hoặc cài công cụ. |
| T — Test | 106 test gốc xanh; đọc assertions e2e liên quan; mutation giới hạn giờ có witness và đối chứng thật (CX-E5). Mutation bỏ lọc MET của helper case size cũng sống qua 13 test nhưng trạng thái không MET + case size là dữ liệu không hợp lệ theo lệnh; chưa chứng minh đầu vào hợp lệ phân biệt mutant nên **không đếm** survivor đó thành test yếu. Không báo thiếu unit test component đã được chấp nhận thay bằng e2e. |
| A — Trợ năng/i18n | Đọc label/aria, error+alert, Choices, Dialog và lời dịch; xem ảnh lịch năm, `ariaSnapshot`, 36 bước Tab/Shift+Tab, 3 lần Enter/Escape. Có CX-E4/CX-E6. **Đã xét, không thấy chuỗi UI mới viết cứng hoặc format tiền/ngày tự làm** trong E. Chưa đo lại tương phản mọi pixel; các viền KNOWN không báo lại. |
| S — An toàn hẹp | `rg` toàn hai thư mục E cho invoke/readFile/writeFile/importBackup/exportBackup/download/filename/fileName: không có đường I/O trực tiếp. Tên KH/fact render dạng React text, không dùng `dangerouslySetInnerHTML`/innerHTML. **Đã xét, không thấy bề mặt S mới ở E**. Nhập backup được sử dụng đúng API sẵn có để dựng probe; chưa kiểm đường dẫn/capability Rust và tên file xuất trong gói này vì đó là C/D/F, không khẳng định các phần ngoài E an toàn. |

Kiểm cuối phiên: HEAD vẫn SHA ghim, `git diff --stat` rỗng. `git status --short` vẫn chỉ ba mục chưa theo dõi có sẵn từ đầu: `.agents/`, `.codex/`, `AGENTS.md`. Không tạo thay đổi mới trong repo. Mọi source probe, bản sao mutation, cache, build và log nằm ở `codex/E/`; báo cáo ở `codex/E.md`.

## 6. Phụ lục — lệnh tái hiện và nguồn test tạm

Các lệnh PowerShell chạy từ `C:/workspace/Project-2C-review-2`; không sửa config/source trong repo. Cache và build của config tạm đều đặt ngoài repo.

```powershell
$env:E_MODE = 'baseline'
node node_modules/vitest/vitest.mjs run --config C:/workspace/deep-review-1-4/codex/E/vitest.config.mts --configLoader runner
# 7 files / 106 tests passed

$env:E_MODE = 'probe'
node node_modules/vitest/vitest.mjs run --config C:/workspace/deep-review-1-4/codex/E/vitest.config.mts --configLoader runner

$env:E_MODE = 'mutation-time' # 14 passed; mutant >24 survives
node node_modules/vitest/vitest.mjs run --config C:/workspace/deep-review-1-4/codex/E/vitest.config.mts --configLoader runner
$env:E_MODE = 'control-time' # intentional: 1 fail, 13 pass, mutant >99
node node_modules/vitest/vitest.mjs run --config C:/workspace/deep-review-1-4/codex/E/vitest.config.mts --configLoader runner
$env:E_MODE = 'witness' # 1 passed: proves original and mutant differ at 24:00
node node_modules/vitest/vitest.mjs run --config C:/workspace/deep-review-1-4/codex/E/vitest.config.mts --configLoader runner
$env:E_MODE = 'mutation-policy' # 13 passed; not counted as a finding
node node_modules/vitest/vitest.mjs run --config C:/workspace/deep-review-1-4/codex/E/vitest.config.mts --configLoader runner

node node_modules/typescript/bin/tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters --incremental false

# Terminal 1; wait for server ready
node C:/workspace/deep-review-1-4/codex/E/serve.mjs
# Terminal 2
node C:/workspace/deep-review-1-4/codex/E/browser.mjs
node C:/workspace/deep-review-1-4/codex/E/keyboard.mjs

# Production build/preview, separate terminal; wait for preview ready
node C:/workspace/deep-review-1-4/codex/E/build-serve.mjs
# Then run timer on production
node C:/workspace/deep-review-1-4/codex/E/performance-browser.mjs
```

Mutation đều sao từ source/test ở SHA ghim sang thư mục bằng chứng; bản test chỉ thay import sang bản product copy. Đối chứng cố ý đỏ không phải lỗi product hiện tại. Các lỗi dựng harness ban đầu (tham số API fixture, selector strict, role radio) đã sửa **chỉ ngoài repo**; kết luận dựa trên source và log cuối ở dưới. Probe keyboard ban đầu dùng tiêu chí quá chặt rằng activeElement BODY trong chu trình Tab là lỗi; đã loại tiêu chí này và chỉ xác nhận focus sau Escape, có 3 lần trực tiếp độc lập với Tab.

### A1. vitest.config.mts

Nguồn: `C:/workspace/deep-review-1-4/codex/E/vitest.config.mts`.

```typescript
const repo = 'C:/workspace/Project-2C-review-2';
const out = 'C:/workspace/deep-review-1-4/codex/E';
export default {
  root: out,
  cacheDir: `${out}/.vite`,
  resolve: { alias: [
    { find: /^@p2c\/domain$/, replacement: `${repo}/packages/domain/src/index.ts` },
    { find: /^@p2c\/db$/, replacement: `${repo}/packages/db/src/index.ts` },
    { find: /^@p2c\/ui$/, replacement: `${repo}/packages/ui/src/index.ts` },
  ] },
  server: { fs: { allow: [repo, out, 'C:/workspace/deep-review-1-4/common'] } },
  test: {
    include: process.env.E_MODE === 'baseline'
      ? [`${repo}/apps/desktop/src/routes/appointments/*.test.ts`, `${repo}/apps/desktop/src/routes/customers/*.test.ts`]
      : [`${out}/${process.env.E_MODE ?? 'probe'}.test.ts`],
    testTimeout: 120000,
  },
};
```

### A2. probe.test.ts

Nguồn: `C:/workspace/deep-review-1-4/codex/E/probe.test.ts`.

```typescript
import { readFileSync, appendFileSync, writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { test, expect } from 'vitest';
import { importBackup, listCustomers, listAppointments, listPeople, listTeams, listPolicies, listStageTransitions, openDatabase, createTeam, createPerson, createCustomer, scheduleAppointment, recordMeetingOutcome } from '@p2c/db';
import { calendarDate, periodOf } from '@p2c/domain';
import { appointmentRows, monthGrid, yearGrid, dayBoard } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/appointments/appointments-view';
import { customerBoard, ageOn } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/customers/customers-view';
import { expectedCaseSize } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/customers/policy-form';
import { priorMeetings, parseTime } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/appointments/appointment-form';
function emit(value: unknown){ appendFileSync('C:/workspace/deep-review-1-4/codex/E/probe-results.jsonl', JSON.stringify(value)+'\n'); }
writeFileSync('C:/workspace/deep-review-1-4/codex/E/probe-results.jsonl','');
const today = calendarDate(2026,10,5);
function measure(label: string, run: ()=>unknown) {
  for(let i=0;i<5;i++) run();
  const samples = Array.from({length: 25},()=> { const start=performance.now(); run(); return performance.now()-start; }).sort((a,b)=>a-b);
  emit({label,median:samples[12],p95:samples[23],min:samples[0],max:samples[24]});
}
test('load performance and valid same-day appointments', async()=>{
  const start=performance.now();
  const {db}=await importBackup(readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json','utf8'), {now:()=>new Date('2026-10-05T05:00:00Z')});
  emit({importMs:performance.now()-start});
  const data={customers:listCustomers(db),appointments:listAppointments(db),people:listPeople(db),teams:listTeams(db),transitions:listStageTransitions(db),policies:listPolicies(db)};
  emit({customers:data.customers.length,appointments:data.appointments.length,people:data.people.length});
  const rows=appointmentRows(data,{kind:'all'},'any');
  measure('appointmentRows all',()=>appointmentRows(data,{kind:'all'},'any'));
  measure('monthGrid October',()=>monthGrid(today,rows,periodOf('month',today),today));
  measure('yearGrid 2026',()=>yearGrid(2026,rows,today));
  measure('dayBoard',()=>dayBoard(rows,today));
  measure('customerBoard all',()=>customerBoard(data,{kind:'all'}));
  measure('listAppointments',()=>listAppointments(db));
  measure('listCustomers',()=>listCustomers(db));
  measure('listStageTransitions',()=>listStageTransitions(db));
  db.sqlite.close();
  const small=await openDatabase({now:()=>new Date('2026-10-05T05:00:00Z')});
  const team=createTeam(small,{name:'Probe'});
  const re=createPerson(small,{name:'RE',role:'RE',teamId:team.id});
  const c=createCustomer(small,{name:'Same day',reId:re.id,stage:'N3',date:today});
  for(const [time,size] of [['09:00',100000000],['16:00',900000000]] as const){
    const a=scheduleAppointment(small,{customerId:c.id,reId:re.id,date:today,time,triggerType:'OTHER'});
    recordMeetingOutcome(small,a.id,{status:'MET',stageAfter:'N3',nextStep:'Continue',expectedCaseSize:size});
  }
  const appointments=listAppointments(small,c.id);
  emit({sameDay:appointments.map(a=>({time:a.time,size:a.expectedCaseSize})),expectedCaseSize:expectedCaseSize(appointments)});
  expect(expectedCaseSize(appointments)).toBe(100000000); // Observed bug; latest 16:00 is 900m.
  emit({leapAgeBefore:ageOn(calendarDate(1984,2,29),calendarDate(2027,2,28)),leapAgeAfter:ageOn(calendarDate(1984,2,29),calendarDate(2027,3,1))});
  expect(parseTime('24:00')).toEqual({ok:false});
  small.sqlite.close();
});
```

### A3. serve.mjs

Nguồn: `C:/workspace/deep-review-1-4/codex/E/serve.mjs`.

```javascript
import { createServer } from 'file:///C:/workspace/Project-2C-review-2/apps/desktop/node_modules/vite/dist/node/index.js';
import config from 'file:///C:/workspace/Project-2C-review-2/apps/desktop/vite.config.ts';
const repo='C:/workspace/Project-2C-review-2';
const out='C:/workspace/deep-review-1-4/codex/E';
const server=await createServer({
 ...config, configFile:false, root:`${repo}/apps/desktop`, cacheDir:`${out}/.vite-browser`,
 define:{'import.meta.env.VITE_DEMO_ANCHOR':JSON.stringify('05/10/2026')},
 server:{host:'127.0.0.1',port:4185,strictPort:true,fs:{allow:[repo,out,'C:/workspace/deep-review-1-4/common']}},
});
await server.listen();
console.log('E probe server: http://127.0.0.1:4185');
process.on('SIGINT',async()=>{await server.close();process.exit(0);});
```

### A4. browser.mjs

Nguồn: `C:/workspace/deep-review-1-4/codex/E/browser.mjs`.

```javascript
import { chromium } from 'file:///C:/workspace/Project-2C-review-2/node_modules/@playwright/test/index.mjs';
import { writeFileSync } from 'node:fs';
const out='C:/workspace/deep-review-1-4/codex/E';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({locale:'vi-VN',viewport:{width:1440,height:1000}});
page.setDefaultTimeout(30000);
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
try{
 await page.goto('http://127.0.0.1:4185/#/settings');
 await page.getByRole('region',{name:'Xuất / nhập backup'}).waitFor();
 await page.getByLabel('Nhập backup',{exact:true}).setInputFiles('C:/workspace/deep-review-1-4/common/load/load-backup.json');
 const confirm=page.getByRole('dialog',{name:'Thay toàn bộ dữ liệu?'});
 await confirm.waitFor();
 await confirm.getByRole('button',{name:'Thay dữ liệu',exact:true}).click();
 await confirm.waitFor({state:'hidden'});
 await page.getByRole('navigation').getByRole('link',{name:'Khách hàng',exact:true}).click();
 await page.getByRole('button',{name:'+ Khách hàng'}).click();
 let dialog=page.getByRole('dialog',{name:'Khách hàng mới'});
 await dialog.getByRole('textbox',{name:'Họ tên'}).fill('CX E KYC Probe');
 await dialog.getByRole('combobox',{name:'RE phụ trách'}).selectOption({index:1});
 await dialog.getByRole('button',{name:'Lưu KH'}).click();
 await dialog.waitFor({state:'hidden'});
 await page.getByRole('link',{name:/CX E KYC Probe/}).click();
 await page.getByRole('button',{name:'+ Ghi chú KYC'}).click();
 dialog=page.getByRole('dialog',{name:'Ghi chú KYC · CX E KYC Probe'});
 await dialog.getByRole('textbox',{name:'Ghi chú',exact:true}).fill('KH nói đang sinh sống tại Huế.');
 await dialog.getByRole('combobox',{name:'Trường',exact:true}).selectOption({label:'Nơi sinh sống'});
 await dialog.getByRole('textbox',{name:'Giá trị',exact:true}).fill('Huế');
 await dialog.getByRole('combobox',{name:'Trường',exact:true}).selectOption({label:'Mục tiêu chính'});
 const stale=await dialog.getByRole('textbox',{name:'Giá trị',exact:true}).inputValue();
 await dialog.getByRole('button',{name:'Thêm dữ kiện'}).click();
 const staged=await dialog.getByRole('list',{name:'Dữ kiện từ ghi chú này'}).innerText();
 await dialog.getByRole('button',{name:'Lưu ghi chú'}).click();
 await dialog.waitFor({state:'hidden'});
 const persisted=await page.getByRole('region',{name:'Dữ kiện KYC'}).innerText();
 await page.getByRole('navigation').getByRole('link',{name:'Lịch hẹn',exact:true}).click();
 await page.getByRole('table',{name:'Danh sách lịch hẹn'}).waitFor();
 await page.getByRole('radio',{name:'Năm',exact:true}).click();
 const grid=page.getByRole('region',{name:/Lịch năm/});
 const snapshot=await grid.ariaSnapshot();
 await page.screenshot({path:`${out}/year-grid.png`,fullPage:false});
 writeFileSync(`${out}/browser-results.json`,JSON.stringify({stale,staged,persisted,yearAria:snapshot,errors},null,2));
 console.log(JSON.stringify({stale,staged,hasWrongFact:persisted.includes('Mục tiêu chính: Huế'),errors}));
}catch(e){writeFileSync(`${out}/browser-failure.txt`,String(e)+'\n'+await page.locator('body').innerText());console.error(e);process.exitCode=1;}
finally{await browser.close();}
```

### A5. build-serve.mjs

Nguồn: `C:/workspace/deep-review-1-4/codex/E/build-serve.mjs`.

```javascript
import { build, preview } from 'file:///C:/workspace/Project-2C-review-2/apps/desktop/node_modules/vite/dist/node/index.js';
import config from 'file:///C:/workspace/Project-2C-review-2/apps/desktop/vite.config.ts';
const repo='C:/workspace/Project-2C-review-2';
const out='C:/workspace/deep-review-1-4/codex/E';
const options={...config,configFile:false,root:`${repo}/apps/desktop`,cacheDir:`${out}/.vite-production`,
 define:{'import.meta.env.VITE_DEMO_ANCHOR':JSON.stringify('05/10/2026')},
 build:{...config.build,outDir:`${out}/build`,emptyOutDir:false},
 preview:{host:'127.0.0.1',port:4186,strictPort:true}};
await build(options);
const server=await preview(options);
console.log('E production probe: http://127.0.0.1:4186');
process.on('SIGINT',async()=>{await server.close();process.exit(0);});
```

### A6. performance-browser.mjs

Nguồn: `C:/workspace/deep-review-1-4/codex/E/performance-browser.mjs`.

```javascript
import { chromium } from 'file:///C:/workspace/Project-2C-review-2/node_modules/@playwright/test/index.mjs';
import { writeFileSync } from 'node:fs';
const out='C:/workspace/deep-review-1-4/codex/E';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({locale:'vi-VN',viewport:{width:1440,height:1000}});
page.setDefaultTimeout(30000);
const results={browser:browser.version(),samples:[]};
try{
 await page.goto('http://127.0.0.1:4186/#/settings');
 await page.getByRole('region',{name:'Xuất / nhập backup'}).waitFor();
 await page.getByLabel('Nhập backup',{exact:true}).setInputFiles('C:/workspace/deep-review-1-4/common/load/load-backup.json');
 const dialog=page.getByRole('dialog',{name:'Thay toàn bộ dữ liệu?'});
 await dialog.getByRole('button',{name:'Thay dữ liệu',exact:true}).click();
 await dialog.waitFor({state:'hidden'});
 await page.getByRole('navigation').getByRole('link',{name:'Lịch hẹn',exact:true}).click();
 await page.getByRole('table',{name:'Danh sách lịch hẹn'}).waitFor();
 // Browser-only timer: starts with a DOM click, ends after commit/layout and two frames.
 for(let trial=0;trial<5;trial++){
  for(const label of ['Năm','Tháng']){
   const sample=await page.evaluate(async label=>{
    const radio=[...document.querySelectorAll('[role="radiogroup"] [role="radio"]')].find(n=>n.textContent===label);
    if(!radio) throw new Error('Missing period '+label);
    const start=performance.now();radio.click();
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const table=document.querySelector('[aria-label="Danh sách lịch hẹn"]');
    return {label,duration:performance.now()-start,rows:table.querySelectorAll('tbody tr').length,nodes:document.querySelectorAll('*').length};
   },label);
   results.samples.push(sample);
  }
 }
 await page.getByRole('navigation').getByRole('link',{name:'Khách hàng',exact:true}).click();
 for(let trial=0;trial<5;trial++){
  for(const label of ['Bảng','Kanban']){
   results.samples.push(await page.evaluate(async label=>{
    const radio=[...document.querySelectorAll('[role="radiogroup"] [role="radio"]')].find(n=>n.textContent===label);
    const start=performance.now();radio.click();
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    return {label,duration:performance.now()-start,rows:document.querySelectorAll('tbody tr').length,nodes:document.querySelectorAll('*').length};
   },label));
  }
 }
 writeFileSync(`${out}/performance-browser.json`,JSON.stringify(results,null,2));
 console.log(JSON.stringify(results));
}catch(e){writeFileSync(`${out}/performance-failure.txt`,String(e)+'\n'+await page.locator('body').innerText());console.error(e);process.exitCode=1;}
finally{await browser.close();}
```

### A7. keyboard.mjs

Nguồn: `C:/workspace/deep-review-1-4/codex/E/keyboard.mjs`.

```javascript
import { chromium } from 'file:///C:/workspace/Project-2C-review-2/node_modules/@playwright/test/index.mjs';
import { writeFileSync } from 'node:fs';
const out='C:/workspace/deep-review-1-4/codex/E';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({locale:'vi-VN',viewport:{width:1440,height:1000}});
page.setDefaultTimeout(30000);
try {
 await page.goto('http://127.0.0.1:4185/#/settings');
 await page.getByRole('region',{name:'Xuất / nhập backup'}).waitFor();
 await page.getByLabel('Nhập backup',{exact:true}).setInputFiles('C:/workspace/deep-review-1-4/common/load/load-backup.json');
 const confirm=page.getByRole('dialog',{name:'Thay toàn bộ dữ liệu?'});
 await confirm.getByRole('button',{name:'Thay dữ liệu',exact:true}).click();
 await confirm.waitFor({state:'hidden'});
 await page.getByRole('navigation').getByRole('link',{name:'Khách hàng',exact:true}).click();
 await page.getByRole('button',{name:'+ Khách hàng'}).click();
 let dialog=page.getByRole('dialog',{name:'Khách hàng mới'});
 await dialog.getByRole('textbox',{name:'Họ tên'}).fill('CX E Keyboard Probe');
 await dialog.getByRole('combobox',{name:'RE phụ trách'}).selectOption({index:1});
 await dialog.getByRole('button',{name:'Lưu KH'}).click();
 await dialog.waitFor({state:'hidden'});
 await page.getByRole('link',{name:/CX E Keyboard Probe/}).click();
 const trigger=page.getByRole('button',{name:'+ Ghi chú KYC'});
 await trigger.focus();
 await page.keyboard.press('Enter');
 dialog=page.getByRole('dialog',{name:'Ghi chú KYC · CX E Keyboard Probe'});
 await dialog.waitFor();
 const focus=[];
 for (const key of [...Array(24).fill('Tab'),...Array(12).fill('Shift+Tab')]) {
  await page.keyboard.press(key);
  focus.push(await page.evaluate(()=>({tag:document.activeElement.tagName,inDialog:!!document.activeElement.closest('dialog[open]')})));
 }
 await page.keyboard.press('Escape');
 await dialog.waitFor({state:'hidden'});
 const restored=await trigger.evaluate(el=>el===document.activeElement);
 const after=await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent?.slice(0,80)}));
 const direct=[];
 for(let i=0;i<3;i++){
  await trigger.focus();
  await page.keyboard.press('Enter');
  await dialog.waitFor();
  await page.keyboard.press('Escape');
  await dialog.waitFor({state:'hidden'});
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  direct.push(await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent?.slice(0,80)})));
 }
 const result={focus,escaped:true,restored,after,direct};
 writeFileSync(`${out}/keyboard-results.json`,JSON.stringify(result,null,2));
 if(focus.some(x=>!x.inDialog && x.tag!=='BODY')) throw new Error('Focusable page content escaped modal');
 console.log(JSON.stringify({steps:focus.length,pageFocusableEscape:false,escaped:true,restored,after,direct}));
} finally { await browser.close(); }
```

### A8. witness.test.ts

Nguồn: `C:/workspace/deep-review-1-4/codex/E/witness.test.ts`.

```typescript
import { test, expect } from 'vitest';
import { parseTime as original } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/appointments/appointment-form';
import { parseTime as mutated } from './mutated-appointment-form';
import { writeFileSync } from 'node:fs';
test('hour boundary witness', () => {
  const evidence = { original: original('24:00'), mutated: mutated('24:00'), valid: original('23:59') };
  writeFileSync('C:/workspace/deep-review-1-4/codex/E/witness-results.json', JSON.stringify(evidence, null, 2));
  expect(evidence.original).toEqual({ ok: false });
  expect(evidence.mutated).toEqual({ ok: true, time: '24:00' });
  expect(evidence.valid).toEqual({ ok: true, time: '23:59' });
});
```

### A9. mutated-appointment-form.ts

Nguồn: `C:/workspace/deep-review-1-4/codex/E/mutated-appointment-form.ts`.

```typescript
import type { AppointmentRecord, CustomerRecord } from '@p2c/db';
import {
  compareDates,
  daysBetween,
  formatDate,
  formatDayMonth,
  parseQuickDate,
  weekdayOf,
  type CalendarDate,
  type QuickDateError,
  type Weekday,
} from '@p2c/domain';
import { outcomeResolver, type AppointmentData, type Outcome } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/appointments/appointments-view.ts';

/** "Các lần hẹn trước" shows this many, newest first; the rest is behind "Xem tất cả". */
export const MAX_HISTORY = 5;

/**
 * `any`: a new appointment, where a day already past is a back-filled meeting (6b).
 * `fromToday`: the next appointment after a past one, which must be today or later (6h).
 */
export type ScheduleMode = 'any' | 'fromToday';

interface ReadDate {
  readonly date: CalendarDate;
  /** Negative once the day has passed. */
  readonly daysFromToday: number;
  /** The same day next year, offered when a year-less day is long past; never applied. */
  readonly suggestion: CalendarDate | null;
}

export type ScheduleDate =
  | ({ readonly ok: true; readonly weekday: Weekday } & ReadDate)
  | ({ readonly ok: false; readonly error: 'past' } & ReadDate)
  | { readonly ok: false; readonly error: QuickDateError };

/** Reads the day typed into the form: `dd/mm` or `dd/mm/yyyy`, checked against `today`. */
export function readScheduleDate(
  text: string,
  today: CalendarDate,
  mode: ScheduleMode,
): ScheduleDate {
  const parsed = parseQuickDate(text, today);
  if (!parsed.ok) return parsed;
  const read = {
    date: parsed.date,
    daysFromToday: daysBetween(today, parsed.date),
    suggestion: parsed.nextYearSuggestion,
  };
  if (mode === 'fromToday' && read.daysFromToday < 0) return { ok: false, error: 'past', ...read };
  return { ok: true, weekday: weekdayOf(parsed.date), ...read };
}

/**
 * A day as the form writes it: `dd/mm` this year, `dd/mm/yyyy` otherwise. `readScheduleDate`
 * reads it back as the same day, so an earlier year's day never turns into this year's.
 */
export const dayText = (date: CalendarDate, today: CalendarDate) =>
  date.year === today.year ? formatDayMonth(date) : formatDate(date);

/** A day as written, then its time when it has one: `dd/mm/yyyy hh:mm`. */
export const withTime = (day: string, time: string | null) => (time ? `${day} ${time}` : day);

/** `hh:mm` (the hour may lose its zero); empty means no time. */
export function parseTime(text: string): { ok: true; time: string | null } | { ok: false } {
  const trimmed = text.trim();
  if (trimmed === '') return { ok: true, time: null };
  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!match || Number(match[1]) > 24 || Number(match[2]) > 59) return { ok: false };
  return { ok: true, time: `${match[1]?.padStart(2, '0')}:${match[2]}` };
}

/** Whether the day is today or earlier, so the appointment can be followed by a next one. */
export const isPastOrToday = (date: CalendarDate, today: CalendarDate) =>
  compareDates(date, today) <= 0;

export interface PriorMeetings {
  /** The customer's appointments up to today, newest first. */
  readonly rows: readonly { readonly appointment: AppointmentRecord; readonly outcome: Outcome }[];
  readonly metCount: number;
  readonly lastMet: CalendarDate | null;
}

/**
 * The earlier appointments of one customer, for the form to show before a new one is made:
 * today's and before, never one still ahead (mockup 6a, Owner 29/09/2026).
 */
export function priorMeetings(
  data: Pick<AppointmentData, 'appointments' | 'transitions'>,
  customerId: string,
  today: CalendarDate,
): PriorMeetings {
  const outcome = outcomeResolver(data);
  const list = data.appointments
    .filter((a) => a.customerId === customerId && isPastOrToday(a.date, today))
    .sort((a, b) => compareDates(b.date, a.date) || (b.time ?? '').localeCompare(a.time ?? ''));
  const met = list.filter((a) => a.status === 'MET');
  return {
    rows: list.map((appointment) => ({ appointment, outcome: outcome(appointment) })),
    metCount: met.length,
    lastMet: met[0]?.date ?? null,
  };
}

const plain = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd');

/** The customers whose name or code contains the text (accents and case ignored), by name. */
export function searchCustomers(
  customers: readonly CustomerRecord[],
  query: string,
  limit: number,
): CustomerRecord[] {
  const needle = plain(query.trim());
  if (needle === '') return [];
  return customers
    .filter((c) => plain(c.name).includes(needle) || plain(c.code).includes(needle))
    .slice(0, limit);
}
```

### A10. mutation-time.test.ts

Nguồn: `C:/workspace/deep-review-1-4/codex/E/mutation-time.test.ts`.

```typescript
import { describe, expect, it } from 'vitest';
import { calendarDate, formatDate, type CalendarDate } from '@p2c/domain';
import type { AppointmentRecord, CustomerRecord } from '@p2c/db';
import type { StageTransition } from '@p2c/domain';
import {
  dayText,
  isPastOrToday,
  parseTime,
  priorMeetings,
  readScheduleDate,
  searchCustomers,
} from './mutated-appointment-form';

const d = (day: number, month: number, year: number) => calendarDate(year, month, day);
const TODAY = d(26, 9, 2026);

function ok(result: ReturnType<typeof readScheduleDate>) {
  if (!result.ok) throw new Error(`expected a date, got ${result.error}`);
  return result;
}

describe('readScheduleDate (any day)', () => {
  it('reads dd/mm in this year with the weekday and days from today', () => {
    const result = ok(readScheduleDate('28/9', TODAY, 'any'));
    expect(formatDate(result.date)).toBe('28/09/2026');
    expect(result.weekday).toBe(1);
    expect(result.daysFromToday).toBe(2);
    expect(result.suggestion).toBeNull();
  });

  it('accepts a day already past and offers next year only when long past and no year typed', () => {
    const recent = ok(readScheduleDate('20/9', TODAY, 'any'));
    expect(recent.daysFromToday).toBe(-6);
    expect(recent.suggestion).toBeNull();

    const old = ok(readScheduleDate('5/1', TODAY, 'any'));
    expect(old.daysFromToday).toBe(-264);
    expect(formatDate(old.suggestion as CalendarDate)).toBe('05/01/2027');

    expect(ok(readScheduleDate('5/1/2026', TODAY, 'any')).suggestion).toBeNull();
  });

  it('passes the parser errors through', () => {
    expect(readScheduleDate('', TODAY, 'any')).toEqual({ ok: false, error: 'empty' });
    expect(readScheduleDate('28-9', TODAY, 'any')).toEqual({ ok: false, error: 'format' });
    expect(readScheduleDate('29/02', TODAY, 'any')).toEqual({ ok: false, error: 'invalid-date' });
  });
});

describe('readScheduleDate (from today)', () => {
  it('accepts today and later', () => {
    expect(ok(readScheduleDate('26/9', TODAY, 'fromToday')).daysFromToday).toBe(0);
    expect(ok(readScheduleDate('1/10', TODAY, 'fromToday')).daysFromToday).toBe(5);
  });

  it('refuses a past day without changing it; still suggests next year when long past', () => {
    const recent = readScheduleDate('20/9', TODAY, 'fromToday');
    expect(recent).toMatchObject({ ok: false, error: 'past', suggestion: null });

    const old = readScheduleDate('20/6', TODAY, 'fromToday');
    if (old.ok || old.error !== 'past') throw new Error('expected a past day');
    expect(formatDate(old.suggestion as CalendarDate)).toBe('20/06/2027');
  });

  it('refuses the prefilled day of an appointment from an earlier year; never makes it a future one', () => {
    const lastYear = readScheduleDate(dayText(d(5, 11, 2025), TODAY), TODAY, 'fromToday');
    expect(lastYear).toMatchObject({ ok: false, error: 'past', suggestion: null });
    if (lastYear.ok || lastYear.error !== 'past') throw new Error('expected a past day');
    expect(formatDate(lastYear.date)).toBe('05/11/2025');

    const leapDay = readScheduleDate(dayText(d(29, 2, 2024), TODAY), TODAY, 'fromToday');
    expect(leapDay).toMatchObject({ ok: false, error: 'past', suggestion: null });
  });
});

describe('dayText', () => {
  it('drops the year only when it is this year', () => {
    expect(dayText(d(20, 9, 2026), TODAY)).toBe('20/09');
    expect(dayText(d(5, 11, 2025), TODAY)).toBe('05/11/2025');
    expect(dayText(d(3, 1, 2027), TODAY)).toBe('03/01/2027');
  });
});

describe('parseTime', () => {
  it('reads hh:mm, padding the hour, and empty as no time', () => {
    expect(parseTime('14:00')).toEqual({ ok: true, time: '14:00' });
    expect(parseTime(' 9:30 ')).toEqual({ ok: true, time: '09:30' });
    expect(parseTime('')).toEqual({ ok: true, time: null });
  });

  it('refuses an hour or minute out of range and other text', () => {
    for (const text of ['25:00', '12:60', '1400', 'abc', '12:5']) {
      expect(parseTime(text)).toEqual({ ok: false });
    }
  });
});

describe('isPastOrToday', () => {
  it('is true for today and earlier', () => {
    expect(isPastOrToday(TODAY, TODAY)).toBe(true);
    expect(isPastOrToday(d(25, 9, 2026), TODAY)).toBe(true);
    expect(isPastOrToday(d(27, 9, 2026), TODAY)).toBe(false);
  });
});

let seq = 0;
function appt(customerId: string, date: CalendarDate, time: string | null, extra = {}) {
  seq += 1;
  return {
    id: `A${seq}`,
    customerId,
    reId: 'RE1',
    coordinatorIds: [],
    date,
    time,
    status: 'MET',
    triggerType: 'OTHER',
    triggerNote: null,
    stageAfter: null,
    expectedCaseSize: null,
    nextStep: null,
    note: '',
    rescheduledFromId: null,
    outcomeReviewerId: null,
    ...extra,
  } as AppointmentRecord;
}

describe('priorMeetings', () => {
  const move = {
    customerId: 'C1',
    appointmentId: 'A2',
    from: 'N2',
    to: 'N1',
    date: d(14, 9, 2026),
  } as unknown as StageTransition;

  const appointments = [
    appt('C1', d(1, 6, 2026), '10:00'),
    appt('C1', d(14, 9, 2026), '10:00', { stageAfter: 'N1' }),
    appt('C1', d(20, 6, 2026), null, { status: 'NO_SHOW' }),
    appt('C2', d(15, 9, 2026), '09:00'),
    appt('C1', d(14, 9, 2026), '15:00', { status: 'CANCELLED' }),
    appt('C1', d(26, 9, 2026), '16:00', { status: 'SCHEDULED' }),
    appt('C1', d(27, 9, 2026), '09:00', { status: 'SCHEDULED' }),
  ];

  it("lists the customer's appointments up to today, newest first, and counts the ones met", () => {
    const history = priorMeetings({ appointments, transitions: [move] }, 'C1', TODAY);
    expect(history.rows.map((r) => [formatDate(r.appointment.date), r.appointment.time])).toEqual([
      ['26/09/2026', '16:00'],
      ['14/09/2026', '15:00'],
      ['14/09/2026', '10:00'],
      ['20/06/2026', null],
      ['01/06/2026', '10:00'],
    ]);
    expect(history.rows[2]?.outcome).toMatchObject({ kind: 'move', from: 'N2', to: 'N1' });
    expect(history.metCount).toBe(2);
    expect(formatDate(history.lastMet as CalendarDate)).toBe('14/09/2026');
  });

  it('has no last meeting for a customer never met', () => {
    const history = priorMeetings({ appointments, transitions: [] }, 'C3', TODAY);
    expect(history).toEqual({ rows: [], metCount: 0, lastMet: null });
  });
});

describe('searchCustomers', () => {
  const customer = (name: string, code: string) => ({ name, code }) as CustomerRecord;
  const all = [
    customer('Trịnh Minh Anh', 'K-9A1C'),
    customer('Lê Hoài Nam', 'K-M2D8'),
    customer('Đỗ Minh Khang', 'K-0001'),
  ];

  it('matches a part of the name or the code, ignoring accents and case', () => {
    expect(searchCustomers(all, 'minh', 10).map((c) => c.name)).toEqual([
      'Trịnh Minh Anh',
      'Đỗ Minh Khang',
    ]);
    expect(searchCustomers(all, 'do minh', 10).map((c) => c.code)).toEqual(['K-0001']);
    expect(searchCustomers(all, 'k-m2', 10).map((c) => c.name)).toEqual(['Lê Hoài Nam']);
  });

  it('returns nothing for empty text and no more than the limit', () => {
    expect(searchCustomers(all, '  ', 10)).toEqual([]);
    expect(searchCustomers(all, 'k-', 2)).toHaveLength(2);
  });
});
```

### A11. control-appointment-form.ts

Nguồn: `C:/workspace/deep-review-1-4/codex/E/control-appointment-form.ts`.

```typescript
import type { AppointmentRecord, CustomerRecord } from '@p2c/db';
import {
  compareDates,
  daysBetween,
  formatDate,
  formatDayMonth,
  parseQuickDate,
  weekdayOf,
  type CalendarDate,
  type QuickDateError,
  type Weekday,
} from '@p2c/domain';
import { outcomeResolver, type AppointmentData, type Outcome } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/appointments/appointments-view.ts';

/** "Các lần hẹn trước" shows this many, newest first; the rest is behind "Xem tất cả". */
export const MAX_HISTORY = 5;

/**
 * `any`: a new appointment, where a day already past is a back-filled meeting (6b).
 * `fromToday`: the next appointment after a past one, which must be today or later (6h).
 */
export type ScheduleMode = 'any' | 'fromToday';

interface ReadDate {
  readonly date: CalendarDate;
  /** Negative once the day has passed. */
  readonly daysFromToday: number;
  /** The same day next year, offered when a year-less day is long past; never applied. */
  readonly suggestion: CalendarDate | null;
}

export type ScheduleDate =
  | ({ readonly ok: true; readonly weekday: Weekday } & ReadDate)
  | ({ readonly ok: false; readonly error: 'past' } & ReadDate)
  | { readonly ok: false; readonly error: QuickDateError };

/** Reads the day typed into the form: `dd/mm` or `dd/mm/yyyy`, checked against `today`. */
export function readScheduleDate(
  text: string,
  today: CalendarDate,
  mode: ScheduleMode,
): ScheduleDate {
  const parsed = parseQuickDate(text, today);
  if (!parsed.ok) return parsed;
  const read = {
    date: parsed.date,
    daysFromToday: daysBetween(today, parsed.date),
    suggestion: parsed.nextYearSuggestion,
  };
  if (mode === 'fromToday' && read.daysFromToday < 0) return { ok: false, error: 'past', ...read };
  return { ok: true, weekday: weekdayOf(parsed.date), ...read };
}

/**
 * A day as the form writes it: `dd/mm` this year, `dd/mm/yyyy` otherwise. `readScheduleDate`
 * reads it back as the same day, so an earlier year's day never turns into this year's.
 */
export const dayText = (date: CalendarDate, today: CalendarDate) =>
  date.year === today.year ? formatDayMonth(date) : formatDate(date);

/** A day as written, then its time when it has one: `dd/mm/yyyy hh:mm`. */
export const withTime = (day: string, time: string | null) => (time ? `${day} ${time}` : day);

/** `hh:mm` (the hour may lose its zero); empty means no time. */
export function parseTime(text: string): { ok: true; time: string | null } | { ok: false } {
  const trimmed = text.trim();
  if (trimmed === '') return { ok: true, time: null };
  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!match || Number(match[1]) > 99 || Number(match[2]) > 59) return { ok: false };
  return { ok: true, time: `${match[1]?.padStart(2, '0')}:${match[2]}` };
}

/** Whether the day is today or earlier, so the appointment can be followed by a next one. */
export const isPastOrToday = (date: CalendarDate, today: CalendarDate) =>
  compareDates(date, today) <= 0;

export interface PriorMeetings {
  /** The customer's appointments up to today, newest first. */
  readonly rows: readonly { readonly appointment: AppointmentRecord; readonly outcome: Outcome }[];
  readonly metCount: number;
  readonly lastMet: CalendarDate | null;
}

/**
 * The earlier appointments of one customer, for the form to show before a new one is made:
 * today's and before, never one still ahead (mockup 6a, Owner 29/09/2026).
 */
export function priorMeetings(
  data: Pick<AppointmentData, 'appointments' | 'transitions'>,
  customerId: string,
  today: CalendarDate,
): PriorMeetings {
  const outcome = outcomeResolver(data);
  const list = data.appointments
    .filter((a) => a.customerId === customerId && isPastOrToday(a.date, today))
    .sort((a, b) => compareDates(b.date, a.date) || (b.time ?? '').localeCompare(a.time ?? ''));
  const met = list.filter((a) => a.status === 'MET');
  return {
    rows: list.map((appointment) => ({ appointment, outcome: outcome(appointment) })),
    metCount: met.length,
    lastMet: met[0]?.date ?? null,
  };
}

const plain = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd');

/** The customers whose name or code contains the text (accents and case ignored), by name. */
export function searchCustomers(
  customers: readonly CustomerRecord[],
  query: string,
  limit: number,
): CustomerRecord[] {
  const needle = plain(query.trim());
  if (needle === '') return [];
  return customers
    .filter((c) => plain(c.name).includes(needle) || plain(c.code).includes(needle))
    .slice(0, limit);
}
```

### A12. control-time.test.ts

Nguồn: `C:/workspace/deep-review-1-4/codex/E/control-time.test.ts`.

```typescript
import { describe, expect, it } from 'vitest';
import { calendarDate, formatDate, type CalendarDate } from '@p2c/domain';
import type { AppointmentRecord, CustomerRecord } from '@p2c/db';
import type { StageTransition } from '@p2c/domain';
import {
  dayText,
  isPastOrToday,
  parseTime,
  priorMeetings,
  readScheduleDate,
  searchCustomers,
} from './control-appointment-form';

const d = (day: number, month: number, year: number) => calendarDate(year, month, day);
const TODAY = d(26, 9, 2026);

function ok(result: ReturnType<typeof readScheduleDate>) {
  if (!result.ok) throw new Error(`expected a date, got ${result.error}`);
  return result;
}

describe('readScheduleDate (any day)', () => {
  it('reads dd/mm in this year with the weekday and days from today', () => {
    const result = ok(readScheduleDate('28/9', TODAY, 'any'));
    expect(formatDate(result.date)).toBe('28/09/2026');
    expect(result.weekday).toBe(1);
    expect(result.daysFromToday).toBe(2);
    expect(result.suggestion).toBeNull();
  });

  it('accepts a day already past and offers next year only when long past and no year typed', () => {
    const recent = ok(readScheduleDate('20/9', TODAY, 'any'));
    expect(recent.daysFromToday).toBe(-6);
    expect(recent.suggestion).toBeNull();

    const old = ok(readScheduleDate('5/1', TODAY, 'any'));
    expect(old.daysFromToday).toBe(-264);
    expect(formatDate(old.suggestion as CalendarDate)).toBe('05/01/2027');

    expect(ok(readScheduleDate('5/1/2026', TODAY, 'any')).suggestion).toBeNull();
  });

  it('passes the parser errors through', () => {
    expect(readScheduleDate('', TODAY, 'any')).toEqual({ ok: false, error: 'empty' });
    expect(readScheduleDate('28-9', TODAY, 'any')).toEqual({ ok: false, error: 'format' });
    expect(readScheduleDate('29/02', TODAY, 'any')).toEqual({ ok: false, error: 'invalid-date' });
  });
});

describe('readScheduleDate (from today)', () => {
  it('accepts today and later', () => {
    expect(ok(readScheduleDate('26/9', TODAY, 'fromToday')).daysFromToday).toBe(0);
    expect(ok(readScheduleDate('1/10', TODAY, 'fromToday')).daysFromToday).toBe(5);
  });

  it('refuses a past day without changing it; still suggests next year when long past', () => {
    const recent = readScheduleDate('20/9', TODAY, 'fromToday');
    expect(recent).toMatchObject({ ok: false, error: 'past', suggestion: null });

    const old = readScheduleDate('20/6', TODAY, 'fromToday');
    if (old.ok || old.error !== 'past') throw new Error('expected a past day');
    expect(formatDate(old.suggestion as CalendarDate)).toBe('20/06/2027');
  });

  it('refuses the prefilled day of an appointment from an earlier year; never makes it a future one', () => {
    const lastYear = readScheduleDate(dayText(d(5, 11, 2025), TODAY), TODAY, 'fromToday');
    expect(lastYear).toMatchObject({ ok: false, error: 'past', suggestion: null });
    if (lastYear.ok || lastYear.error !== 'past') throw new Error('expected a past day');
    expect(formatDate(lastYear.date)).toBe('05/11/2025');

    const leapDay = readScheduleDate(dayText(d(29, 2, 2024), TODAY), TODAY, 'fromToday');
    expect(leapDay).toMatchObject({ ok: false, error: 'past', suggestion: null });
  });
});

describe('dayText', () => {
  it('drops the year only when it is this year', () => {
    expect(dayText(d(20, 9, 2026), TODAY)).toBe('20/09');
    expect(dayText(d(5, 11, 2025), TODAY)).toBe('05/11/2025');
    expect(dayText(d(3, 1, 2027), TODAY)).toBe('03/01/2027');
  });
});

describe('parseTime', () => {
  it('reads hh:mm, padding the hour, and empty as no time', () => {
    expect(parseTime('14:00')).toEqual({ ok: true, time: '14:00' });
    expect(parseTime(' 9:30 ')).toEqual({ ok: true, time: '09:30' });
    expect(parseTime('')).toEqual({ ok: true, time: null });
  });

  it('refuses an hour or minute out of range and other text', () => {
    for (const text of ['25:00', '12:60', '1400', 'abc', '12:5']) {
      expect(parseTime(text)).toEqual({ ok: false });
    }
  });
});

describe('isPastOrToday', () => {
  it('is true for today and earlier', () => {
    expect(isPastOrToday(TODAY, TODAY)).toBe(true);
    expect(isPastOrToday(d(25, 9, 2026), TODAY)).toBe(true);
    expect(isPastOrToday(d(27, 9, 2026), TODAY)).toBe(false);
  });
});

let seq = 0;
function appt(customerId: string, date: CalendarDate, time: string | null, extra = {}) {
  seq += 1;
  return {
    id: `A${seq}`,
    customerId,
    reId: 'RE1',
    coordinatorIds: [],
    date,
    time,
    status: 'MET',
    triggerType: 'OTHER',
    triggerNote: null,
    stageAfter: null,
    expectedCaseSize: null,
    nextStep: null,
    note: '',
    rescheduledFromId: null,
    outcomeReviewerId: null,
    ...extra,
  } as AppointmentRecord;
}

describe('priorMeetings', () => {
  const move = {
    customerId: 'C1',
    appointmentId: 'A2',
    from: 'N2',
    to: 'N1',
    date: d(14, 9, 2026),
  } as unknown as StageTransition;

  const appointments = [
    appt('C1', d(1, 6, 2026), '10:00'),
    appt('C1', d(14, 9, 2026), '10:00', { stageAfter: 'N1' }),
    appt('C1', d(20, 6, 2026), null, { status: 'NO_SHOW' }),
    appt('C2', d(15, 9, 2026), '09:00'),
    appt('C1', d(14, 9, 2026), '15:00', { status: 'CANCELLED' }),
    appt('C1', d(26, 9, 2026), '16:00', { status: 'SCHEDULED' }),
    appt('C1', d(27, 9, 2026), '09:00', { status: 'SCHEDULED' }),
  ];

  it("lists the customer's appointments up to today, newest first, and counts the ones met", () => {
    const history = priorMeetings({ appointments, transitions: [move] }, 'C1', TODAY);
    expect(history.rows.map((r) => [formatDate(r.appointment.date), r.appointment.time])).toEqual([
      ['26/09/2026', '16:00'],
      ['14/09/2026', '15:00'],
      ['14/09/2026', '10:00'],
      ['20/06/2026', null],
      ['01/06/2026', '10:00'],
    ]);
    expect(history.rows[2]?.outcome).toMatchObject({ kind: 'move', from: 'N2', to: 'N1' });
    expect(history.metCount).toBe(2);
    expect(formatDate(history.lastMet as CalendarDate)).toBe('14/09/2026');
  });

  it('has no last meeting for a customer never met', () => {
    const history = priorMeetings({ appointments, transitions: [] }, 'C3', TODAY);
    expect(history).toEqual({ rows: [], metCount: 0, lastMet: null });
  });
});

describe('searchCustomers', () => {
  const customer = (name: string, code: string) => ({ name, code }) as CustomerRecord;
  const all = [
    customer('Trịnh Minh Anh', 'K-9A1C'),
    customer('Lê Hoài Nam', 'K-M2D8'),
    customer('Đỗ Minh Khang', 'K-0001'),
  ];

  it('matches a part of the name or the code, ignoring accents and case', () => {
    expect(searchCustomers(all, 'minh', 10).map((c) => c.name)).toEqual([
      'Trịnh Minh Anh',
      'Đỗ Minh Khang',
    ]);
    expect(searchCustomers(all, 'do minh', 10).map((c) => c.code)).toEqual(['K-0001']);
    expect(searchCustomers(all, 'k-m2', 10).map((c) => c.name)).toEqual(['Lê Hoài Nam']);
  });

  it('returns nothing for empty text and no more than the limit', () => {
    expect(searchCustomers(all, '  ', 10)).toEqual([]);
    expect(searchCustomers(all, 'k-', 2)).toHaveLength(2);
  });
});
```

### A13. mutated-policy-form.ts

Nguồn: `C:/workspace/deep-review-1-4/codex/E/mutated-policy-form.ts`.

```typescript
import {
  calendarDate,
  compareDates,
  daysBetween,
  formatPeriodValue,
  formatVndCompact,
  parseVnd,
  periodOf,
  type Appointment,
  type CalendarDate,
  type Policy,
  type Vnd,
  type VndParseError,
} from '@p2c/domain';
import { t } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/i18n/index.ts';
import { parseRecordDate, type RecordDateResult } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/customers/customers-view.ts';

export type FypResult =
  | { readonly ok: true; readonly amount: Vnd }
  | { readonly ok: false; readonly error: VndParseError | 'zero' };

/** An FYP as typed (`500tr`, `1,2 tỷ`): more than 0 (spec §3.7). */
export function readFyp(text: string): FypResult {
  const parsed = parseVnd(text);
  if (parsed.ok && parsed.amount <= 0) return { ok: false, error: 'zero' };
  return parsed;
}

export type IssuedDateResult =
  | {
      readonly ok: true;
      readonly date: CalendarDate;
      /** Days since the submission; null while the submission day is not readable. */
      readonly daysAfter: number | null;
    }
  | { readonly ok: false; readonly error: 'beforeSubmitted'; readonly date: CalendarDate }
  | Extract<RecordDateResult, { ok: false }>;

/** What a policy dialog holds; `issued` is null until the policy is issued (mockups 8a–8d). */
export interface PolicyDraft {
  readonly submittedDate: string;
  readonly submittedFyp: string;
  readonly issued: { readonly date: string; readonly fyp: string } | null;
}

export type PolicyValues = Omit<Policy, 'id' | 'customerId' | 'reId'>;

/**
 * Reads every field of the draft, and the policy when all of them are right. Days are today or
 * earlier; the issue comes on the submission day or later (spec §3.7).
 */
export function readPolicy(draft: PolicyDraft, today: CalendarDate) {
  const submittedDate = parseRecordDate(draft.submittedDate, today);
  const submittedFyp = readFyp(draft.submittedFyp);
  const issuedDate = draft.issued && readIssuedDate(draft.issued.date, today, submittedDate);
  const issuedFyp = draft.issued && readFyp(draft.issued.fyp);
  const policy: PolicyValues | null =
    submittedDate.ok && submittedFyp.ok && (issuedDate?.ok ?? true) && (issuedFyp?.ok ?? true)
      ? {
          submittedDate: submittedDate.date,
          submittedFyp: submittedFyp.amount,
          issuedDate: issuedDate?.ok ? issuedDate.date : null,
          issuedFyp: issuedFyp?.ok ? issuedFyp.amount : null,
        }
      : null;
  return { submittedDate, submittedFyp, issuedDate, issuedFyp, policy };
}

function readIssuedDate(
  text: string,
  today: CalendarDate,
  submitted: RecordDateResult,
): IssuedDateResult {
  const parsed = parseRecordDate(text, today);
  if (!parsed.ok || !submitted.ok) return parsed.ok ? { ...parsed, daysAfter: null } : parsed;
  const daysAfter = daysBetween(submitted.date, parsed.date);
  return daysAfter < 0
    ? { ok: false, error: 'beforeSubmitted', date: parsed.date }
    : { ok: true, date: parsed.date, daysAfter };
}

/**
 * Mockup 8d: how far the issued FYP is from the submitted one, and what the edit does to the
 * issued FYP of the saved issue month (null when the FYP stays or the issue month moves).
 */
export function issuedChange(
  saved: Policy,
  next: { readonly issuedDate: CalendarDate; readonly issuedFyp: Vnd },
) {
  const before = saved.issuedDate;
  const sameMonth =
    before !== null &&
    before.year === next.issuedDate.year &&
    before.month === next.issuedDate.month;
  const diff = next.issuedFyp - (saved.issuedFyp ?? 0);
  return {
    fromSubmitted: next.issuedFyp - saved.submittedFyp,
    metric: sameMonth && diff !== 0 ? { year: before.year, month: before.month, diff } : null,
  };
}

export const monthOf = (date: CalendarDate) => formatPeriodValue(periodOf('month', date));

/**
 * "Ảnh hưởng chỉ số" (8d) for the `metric` of `issuedChange`. Without the RE's name (an RE no
 * longer listed, e.g. deleted), the sentence leaves the RE out rather than show an empty name.
 */
export function effectText(
  metric: { readonly year: number; readonly month: number; readonly diff: Vnd },
  reName: string | undefined,
): string {
  const params = {
    month: monthOf(calendarDate(metric.year, metric.month, 1)),
    re: reName?.trim() ?? '',
    amount: formatVndCompact(Math.abs(metric.diff)),
  };
  const key = metric.diff < 0 ? 'Down' : 'Up';
  return t(params.re ? `policyForm.effect${key}` : `policyForm.effect${key}NoRe`, params);
}

/** "Case size dự kiến": the one of the latest met meeting that has it, for reference only (8a). */
export function expectedCaseSize(
  appointments: readonly Pick<Appointment, 'date' | 'status' | 'expectedCaseSize'>[],
): Vnd | null {
  const latest = appointments
    .filter((a) => a.expectedCaseSize !== null)
    .sort((a, b) => compareDates(b.date, a.date))[0];
  return latest?.expectedCaseSize ?? null;
}
```

### A14. mutation-policy.test.ts

Nguồn: `C:/workspace/deep-review-1-4/codex/E/mutation-policy.test.ts`.

```typescript
import { describe, expect, it } from 'vitest';
import { calendarDate, type Appointment, type Policy } from '@p2c/domain';
import {
  effectText,
  expectedCaseSize,
  issuedChange,
  readFyp,
  readPolicy,
  type PolicyDraft,
} from './mutated-policy-form';

const d = (day: number, month: number, year = 2026) => calendarDate(year, month, day);
const TODAY = d(26, 9);
const MILLION = 1_000_000;

describe('effectText', () => {
  const down = { year: 2026, month: 9, diff: -14_500_000 };

  it('names the RE of the policy', () => {
    expect(effectText(down, 'Đỗ Khánh Linh')).toMatch(
      /^FYP phát hành tháng \S+ của RE Đỗ Khánh Linh giảm 14,5 tr$/,
    );
    expect(effectText({ ...down, diff: 2 * MILLION }, 'Linh')).toMatch(/của RE Linh tăng 2 tr$/);
  });

  it('never shows an empty RE name, e.g. when the RE was deleted', () => {
    for (const name of [undefined, '', '  ']) {
      expect(effectText(down, name)).toMatch(/^FYP phát hành tháng \S+ giảm 14,5 tr$/);
    }
  });
});

describe('readFyp', () => {
  it('reads a positive amount the way the money field does', () => {
    expect(readFyp('500tr')).toEqual({ ok: true, amount: 500 * MILLION });
    expect(readFyp('385,5tr')).toEqual({ ok: true, amount: 385_500_000 });
    expect(readFyp('500.000.000 ₫')).toEqual({ ok: true, amount: 500 * MILLION });
  });

  it('refuses nothing, zero, a negative amount and words (mockup 8c)', () => {
    expect(readFyp(' ')).toEqual({ ok: false, error: 'empty' });
    expect(readFyp('0')).toEqual({ ok: false, error: 'zero' });
    expect(readFyp('-50tr')).toEqual({ ok: false, error: 'negative' });
    expect(readFyp('năm trăm')).toEqual({ ok: false, error: 'format' });
  });
});

const submitted: PolicyDraft = { submittedDate: '20/8', submittedFyp: '400tr', issued: null };
const issued: PolicyDraft = { ...submitted, issued: { date: '18/9', fyp: '400tr' } };

describe('readPolicy', () => {
  it('gives the submitted policy, not issued', () => {
    const read = readPolicy(submitted, TODAY);
    expect(read.policy).toEqual({
      submittedDate: d(20, 8),
      submittedFyp: 400 * MILLION,
      issuedDate: null,
      issuedFyp: null,
    });
  });

  it('gives the issued day and FYP, and how many days after the submission it came', () => {
    const read = readPolicy({ ...issued, issued: { date: '18/9', fyp: '385,5tr' } }, TODAY);
    expect(read.policy).toMatchObject({ issuedDate: d(18, 9), issuedFyp: 385_500_000 });
    expect(read.issuedDate).toEqual({ ok: true, date: d(18, 9), daysAfter: 29 });
  });

  it('refuses an issue day before the submission (mockup 8c)', () => {
    const read = readPolicy({ ...issued, issued: { date: '15/8', fyp: '0' } }, TODAY);
    expect(read.policy).toBeNull();
    expect(read.issuedDate).toEqual({ ok: false, error: 'beforeSubmitted', date: d(15, 8) });
    expect(read.issuedFyp).toEqual({ ok: false, error: 'zero' });
  });

  it('allows the issue on the day of the submission', () => {
    const read = readPolicy({ ...issued, issued: { date: '20/8', fyp: '400tr' } }, TODAY);
    expect(read.issuedDate).toEqual({ ok: true, date: d(20, 8), daysAfter: 0 });
  });

  it('refuses a day after today and a day that does not exist', () => {
    const read = readPolicy(
      { ...issued, submittedDate: '27/9', issued: { date: '31/9', fyp: '1tr' } },
      TODAY,
    );
    expect(read.submittedDate).toEqual({ ok: false, error: 'future' });
    expect(read.issuedDate).toEqual({ ok: false, error: 'invalid-date' });
    expect(read.policy).toBeNull();
  });

  it('does not compare with a submission day it cannot read', () => {
    const read = readPolicy({ ...issued, submittedDate: 'x' }, TODAY);
    expect(read.issuedDate).toEqual({ ok: true, date: d(18, 9), daysAfter: null });
  });
});

describe('issuedChange', () => {
  const policy: Policy = {
    id: 'p',
    customerId: 'c',
    reId: 're',
    submittedDate: d(20, 8),
    submittedFyp: 400 * MILLION,
    issuedDate: d(18, 9),
    issuedFyp: 400 * MILLION,
  };

  it('tells how far the issued FYP now is from the submitted one and from the saved one', () => {
    expect(issuedChange(policy, { issuedDate: d(18, 9), issuedFyp: 385_500_000 })).toEqual({
      fromSubmitted: -14_500_000,
      metric: { year: 2026, month: 9, diff: -14_500_000 },
    });
  });

  it('leaves out the effect on the month when the FYP stays or the issue month moves', () => {
    expect(issuedChange(policy, { issuedDate: d(19, 9), issuedFyp: 400 * MILLION })).toEqual({
      fromSubmitted: 0,
      metric: null,
    });
    expect(issuedChange(policy, { issuedDate: d(1, 10), issuedFyp: 410 * MILLION })).toEqual({
      fromSubmitted: 10 * MILLION,
      metric: null,
    });
  });
});

describe('expectedCaseSize', () => {
  const met = (day: number, size: number | null, status: Appointment['status'] = 'MET') => ({
    date: d(day, 9),
    status,
    expectedCaseSize: size,
  });

  it('takes the case size of the latest met meeting that has one', () => {
    const list = [met(10, 600 * MILLION), met(1, 800 * MILLION), met(12, null)];
    expect(expectedCaseSize(list)).toBe(600 * MILLION);
    expect(expectedCaseSize([])).toBeNull();
  });
});
```

