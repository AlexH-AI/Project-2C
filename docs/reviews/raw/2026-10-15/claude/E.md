XONG — claude gói E, 2026-10-14 17:53

# Deep review Phase 1–6, lượt 1 — Claude, gói E (Lịch hẹn, chỉ số, quản lý)

## 1. Đầu phiên

- Bên: Claude (Opus 5.5), phiên sạch, chỉ đọc.
- Gói: E — `routes/{appointments,overview,reports}/**`, `routes/{Overview,Settings*,RestoreDialog,FilterBar}.tsx` (trừ `SettingsAi.tsx`), `routes/{trash-view,period-labels,applied-filter}.ts`, Hợp đồng (`routes/customers/{CustomerPolicies,PolicyDialogs,policy-form}.*`).
- Worktree: `C:\workspace\Project-2C-review`.
- SHA đầu phiên: `885534549808f42aec7f9af5743bbf86642ee4bd` (khớp `8855345`).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 2026-10-14 17:16.
- Máy: Office Laptop `D13_THINKPAD`.
- Ghi chú bước 0: trong lệnh đầu tiên (đọc prompt) tôi lỡ chạy `ls -la` cả `C:\workspace\deep-review-1-6\` (trái quy tắc 1 "không liệt kê"). Chỉ thấy tên thư mục / file cấp 1 (`claude`, `codex`, `common`, `muse`, `owner-notes.md`), **không** mở / liệt kê bên trong `codex\`, `muse\`, không đọc `owner-notes.md`, không thấy nội dung báo cáo của bên khác. Từ đó trở đi chỉ kiểm file theo tên đầy đủ.

## 2. Phạm vi đã đọc

- Tài liệu: `CLAUDE.md` gốc, `apps/desktop/CLAUDE.md`, `packages/db/CLAUDE.md`, `.claude/rules/i18n-ui.md`, `docs/design/phase-4-chi-so.md` (cả file: §1 đếm lịch hẹn, §2 ảnh chụp KH, §3 miền năm, §4 chỉ số / so kỳ trước C01–C11 / mốc M01–M04), `docs/design/phase-6-hoan-thien.md` §4 (S-2, Thùng rác TR-1…TR-10, E1–E17) và §5, `docs/design/phase-3-du-lieu.md` (D3, D6, D7, D9, D10, bảng lệnh), mockup `appointment-forms.html` (6a–6i), `policy-forms.html` (8a–8d), `docs/design/mockups/README.md`; `common\plan.md`, `known.md`, `baseline.md`; `claude\A.md` … `D.md` (để không báo lại: CL-D7 đã nêu bàn giao KH ↔ RE của lịch; CL-A1, CL-A2 đã nêu khôi phục cùng ngày và `listTrash` theo số KH xóa).
- Gói E (đọc hết từng file ở SHA ghim): `routes/appointments/` — `AppointmentsScreen.tsx` (652), `appointments-view.ts` (471), `AppointmentDialog.tsx` (447), `appointment-form.ts` (125), `OutcomeDialog.tsx` (292), `outcome-form.ts` (132), `MetFields.tsx` (164), `EditOutcomeDialog.tsx` (237), `RescheduleDialog.tsx` (60), `RescheduleFields.tsx` (142), `DeleteAppointmentDialog.tsx` (100), `YearGrid.tsx` (142); `routes/overview/` — `overview-view.ts` (252), `stage-view.ts` (142), `team-compare-view.ts` (129), `stage-chart.ts` (130), `OverviewTiles.tsx` (76), `StageBlock.tsx` (127), `TeamCompare.tsx` (127); `routes/reports/` — `reports-view.ts` (327), `ReportsScreen.tsx` (113), `ReportTable.tsx` (154), `ReportExport.tsx` (96), `report-workbook.ts` (259); `routes/` — `Overview.tsx` (61), `FilterBar.tsx` (82), `applied-filter.ts` (51), `period-labels.ts` (26), `Settings.tsx` (170), `SettingsDataFile.tsx` (135), `SettingsBackup.tsx` (280), `SettingsTrash.tsx` (226), `RestoreDialog.tsx` (65), `trash-view.ts` (439); Hợp đồng — `customers/CustomerPolicies.tsx` (109), `PolicyDialogs.tsx` (354), `policy-form.ts` (138).
- Chỗ gói khác mà gói E nối vào (đọc phần liên quan): `packages/db/src/appointments.ts` (95–545: lệnh ghi kết quả / sửa / dời / xóa / khôi phục), `packages/db/src/customers.ts` (60–330: thứ tự `listStageTransitions`, `checkTransition`, `withdrawAppointmentTransition`), `apps/desktop/src/data/tables.ts`, `routes/Screen.tsx` (khóa `Settings` theo section).


## 3. Phát hiện

### CL-E7

(đánh số theo thứ tự tìm ra; đặt đầu vì mức cao nhất của gói)

```
ID: CL-E7
Mức: Medium
Trục: D (xóa không đảo ngược được), C (hộp 6g "khôi phục được" và câu Thùng rác "đưa bản ghi về như trước" sai cho trường hợp này), E (chuỗi: cuộc gặp giữ nhóm → KH đổi nhóm ngày sau → xóa cuộc gặp → khôi phục)
Vị trí: packages/db/src/appointments.ts:251-257 (softDeleteAppointment: cuộc gặp không có chuyển nhóm → xóa luôn được), :278-286 (checkRestoreAppointment: `to = outcomeStage(row, stage)` so `stage_after` với nhóm **hiện tại**), :289-293 (outcomeStage), :358-361 (applyOutcome); apps/desktop/src/routes/appointments/outcome-form.ts:56-64 (outcomeLock: không có chuyển nhóm → không khóa, nút "Xóa lịch hẹn" bật), apps/desktop/src/routes/appointments/DeleteAppointmentDialog.tsx:86-97 + apps/desktop/src/i18n/vi.ts:825-827 ("Cuộc hẹn này không đổi nhóm KH … Xóa mềm, khôi phục được ở Cài đặt → Thùng rác."), vi.ts:264-265 (trash.help "Khôi phục đưa bản ghi về như trước."), vi.ts:306-307 (trash.blocked.TRANSITION_BEFORE_LATEST) (8855345)
Tình trạng: CONFIRMED (hành vi); luật mong muốn cần Owner chốt (spec Phase 6 TR-3 chưa nói cuộc gặp giữ nhóm)
```

- **Mô tả:** Cuộc gặp Đã gặp **giữ nhóm** (nhóm sau = nhóm lúc gặp, không sinh chuyển nhóm) xóa lúc nào cũng được: không có chuyển nhóm để rút, `outcomeLock` không khóa, hộp 6g ghi "Cuộc hẹn này không đổi nhóm KH … Xóa mềm, khôi phục được ở Cài đặt → Thùng rác". Nhưng khi khôi phục, `checkRestoreAppointment` so `stage_after` (nhóm của ngày gặp) với nhóm **hiện tại** của KH; nếu KH đã đổi nhóm vào một ngày sau cuộc gặp (việc bình thường với mọi cuộc gặp cũ), hai nhóm khác nhau nên lệnh coi như phải ghi lại một chuyển nhóm "nhóm hiện tại → nhóm ngày gặp" mang ngày gặp, và từ chối `TRANSITION_BEFORE_LATEST` (D10). Thùng rác tắt nút Khôi phục với câu "Nhóm KH đã đổi ngày …, sau ngày cuộc hẹn này — không ghi chuyển nhóm lùi ngày (D10)", trong khi khôi phục cuộc gặp này không cần chuyển nhóm nào (lúc xóa nó không rút gì). Kết quả: cuộc gặp biến khỏi "Đã gặp" của kỳ của nó và không lấy lại được bằng app (vẫn còn trong DB / backup). Cùng gốc với CL-A1 (khôi phục áp lại "nhóm sau" lên nhóm hiện tại thay vì trả về đúng như lúc xóa); CL-A1 nêu ca **cùng ngày** (khôi phục thêm chuyển nhóm / RF), ở đây là ca **ngày sau** — phổ biến hơn nhiều, hậu quả là bị chặn hẳn.
- **Tái hiện / bằng chứng:**
  - Giao diện — `node p9-kept-delete.mjs <repo>` (bản web `E\web`, cổng 4393, seed; log `E\p9-kept-delete.log`): cuộc gặp 04/10 Đã gặp giữ N3, chuyển tay N3 → N2 ngày 14/10, rồi Sửa kết quả → Xóa lịch hẹn:
    ```
    6f "Xóa lịch hẹn" enabled: true
    6g dialog: "Xóa lịch hẹn 04/10/2026? Bùi Bảo Hạnh · Đã gặp Cuộc hẹn này không đổi nhóm KH. Khi xóa: Nhóm KH không đổi RF không đổi Ghi chú KYC giữ nguyên Xóa mềm, khôi phục được ở Cài đặt → Thùng rác. Hủy Xóa lịch hẹn"
    trash row: "Lịch hẹn 04/10/2026 · Đã gặp nhóm sau N3 Nhóm KH đã đổi ngày 14/10/2026, sau ngày cuộc hẹn này — không ghi chuyển nhóm lùi ngày (D10). KH Bùi Bảo Hạnh · RE Hồ Ngọc Yến 14/10/2026 17:45 Khôi phục…"
    "Khôi phục…" enabled: false
    ```
  - Quy mô trên dữ liệu tải — `node p10-kept-count.mjs <repo> <backup>` (`E\p10-kept-count.log`): "live met meetings: 7507; kept the stage (no transition): 4254; of which the customer moved on a later day: 2973"; xóa rồi khôi phục 50 cuộc gặp đầu của nhóm đó bằng lệnh: "delete always accepted; restore refused 46 {"TRANSITION_BEFORE_LATEST":46}".
  - Chuỗi xóa / khôi phục trên số liệu — `node p8-roundtrip.mjs <repo> <backup>` (`E\p8-roundtrip.log`): xóa rồi khôi phục ngược thứ tự 120 bản ghi (40 cuộc gặp có chuyển nhóm mới nhất, 20 cuộc gặp giữ nhóm, 20 lịch dự kiến, 20 HĐ, 20 KH): 103 khôi phục được, 17 từ chối `TRANSITION_BEFORE_LATEST` (đều là cuộc gặp giữ nhóm); Báo cáo năm 2025 dòng Toàn bộ "1.688 đã gặp … tổng 2.147" → "1.671 … 2.130", các dòng RE tương ứng; năm / tháng 2026 và nhóm của mọi KH trùng như trước.
- **Ảnh hưởng:** RE / TL xóa một cuộc gặp Đã gặp cũ (vd. ghi nhầm KH, nhầm ngày — thao tác có sẵn ở hộp 6f, hộp xác nhận hứa "khôi phục được") rồi muốn lấy lại: Thùng rác chặn với lý do D10 sai bản chất, không có đường vòng trong app (ghi bù lại cuộc gặp thì "giữ nguyên" thành nhóm hiện tại, không đúng nhóm ngày gặp — CL-E1). "Đã gặp" của kỳ đó trên Tổng quan / Báo cáo / Excel thấp đi vĩnh viễn. Ở dữ liệu tải ≈ 40 % cuộc gặp Đã gặp ở trạng thái này. Không mất dữ liệu đã lưu (bản ghi còn, backup còn) → Medium theo thước ("thao tác bình thường dẫn tới dữ liệu … không đảo ngược được").
- **Đề xuất (cần Owner chốt luật TR-3 cho cuộc gặp giữ nhóm):** khôi phục một cuộc gặp Đã gặp **không có chuyển nhóm bị rút khi xóa** thì không ghi chuyển nhóm và không kiểm D10 (trả về đúng như lúc xóa, như E7) — dùng chung dữ liệu với đề xuất CL-A1 (chuyển nhóm đã xóa có `appointment_id` = lịch này). Cùng một chỗ sửa ở `checkRestoreAppointment` / `restoreAppointment` / `listTrash` (lý do + hệ quả của màn dùng chung hàm kiểm), ≈ 20–30 dòng SP + ca E-mới ở `trash.test.ts` (giữ nhóm, KH đổi nhóm ngày sau → khôi phục được, không thêm chuyển nhóm, "Đã gặp" về lại) và cập nhật spec TR-3 (G2).

(17:24: probe P1 khớp số Tổng quan ↔ Báo cáo ↔ Lịch hẹn ↔ Excel trên dữ liệu tải xong, 0 lệch, xem §6 trục C)

### CL-E1

```
ID: CL-E1
Mức: Low
Trục: C (hộp 6f nói một việc lưu không làm), E (chuỗi: cuộc gặp giữ nhóm → chuyển tay → Sửa kết quả)
Vị trí: apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx:51 (outcomeLock chỉ khóa khi cuộc gặp có chuyển nhóm), :78 (`from = caused?.from ?? customer.stage`), :198 (MetFields from); apps/desktop/src/routes/appointments/MetFields.tsx:82-97, :145-163 (StageRead); apps/desktop/src/routes/appointments/outcome-form.ts:56-64 (outcomeLock); packages/db/src/appointments.ts:209-218 (editMeetingOutcome: stageAfter không đổi → không ghi chuyển nhóm) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** Cuộc gặp Đã gặp **giữ nhóm** (nhóm sau = nhóm lúc đó, không sinh chuyển nhóm) không bao giờ bị khóa theo D7, vì `outcomeLock` chỉ xét chuyển nhóm do chính cuộc gặp tạo. Khi KH đã được chuyển tay sang nhóm khác **sau** cuộc gặp, hộp "Sửa kết quả cuộc gặp" (6f) lấy `from` = nhóm **hiện tại** của KH: ô "Nhóm sau cuộc gặp" đánh "giữ nguyên" vào nhóm hiện tại (một nhóm KH chưa ở vào ngày gặp), và dòng đọc lại dưới ô ghi một lần chuyển nhóm **không có thật**: "N2 → N3 ngày 13/10/2026 · không tính RF". Bấm Lưu (chỉ sửa Việc tiếp theo) thì không có chuyển nhóm nào được ghi (lệnh thấy nhóm sau không đổi) — hộp nói một việc, lệnh làm việc khác. Nếu RE chọn ô "giữ nguyên" (nghĩ là để không đổi gì), kết quả cuộc gặp ngày 13/10 thành "Giữ N2", trong khi ngày đó KH ở N3 (hồ sơ / Lịch hẹn / dòng thời gian ghi sai nhóm của ngày gặp; chỉ số không đổi vì không có chuyển nhóm). Chọn nhóm khác (N1) thì bị từ chối "Ngày chuyển trước lần đổi nhóm gần nhất (14/10/2026)."
- **Tái hiện / bằng chứng:** `node p3-kept-edit.mjs <repo>` (bản web của tôi `E\web`, cổng 4393, seed; log `E\p3-kept-edit.log`):
  ```
  customer: Bùi Bảo Hạnh K-0AZ7 N3
  6c (record) stage line: "Giữ nhóm hiện tại, không tạo chuyển nhóm."
  meeting 13/10 after recording: Trạng thái Đã gặp | Kết quả Giữ N3
  after manual move: ← Khách hàng Bùi Bảo Hạnh N2
  6f lock note shown: false
  6f stage choices: ["N4","N3 [chọn]","N2 giữ nguyên","N1","Tạm hoãn","Mất cơ hội"]
  6f stage read line: "N2 → N3 ngày 13/10/2026 · không tính RF — RF chỉ khi N4 / N3 lên N2 / N1"
  (a) saved unchanged → meeting: Trạng thái Đã gặp | Kết quả Giữ N3
  (a) profile: ← Khách hàng Bùi Bảo Hạnh N2 …
  (b) N1 → alert: ["Ngày chuyển trước lần đổi nhóm gần nhất (14/10/2026)."]
  (c) read line with "giữ nguyên": "Giữ nhóm hiện tại, không tạo chuyển nhóm."
  (c) saved → meeting: Trạng thái Đã gặp | Kết quả Giữ N2
  ```
- **Ảnh hưởng:** RE / TL sửa ghi chú hay việc tiếp theo của một cuộc gặp cũ (thao tác bình thường) sau khi đã chuyển tay KH: hộp báo sai rằng lưu sẽ đưa KH "N2 → N3"; nếu làm theo "giữ nguyên" thì lịch sử cuộc gặp ghi nhóm sai cho ngày đó, không có dòng nào báo. Không đổi chỉ số / RF; cần chuỗi thao tác cụ thể → Low. (Ghi kết quả **muộn** một lịch cũ sau khi đã chuyển tay cũng cho "giữ nguyên" = nhóm hiện tại — đúng chữ bảng lệnh spec Phase 3 §4 "`MET` với `stage_after` = nhóm hiện tại … vẫn ghi được", nên chỉ nêu phần **sửa**.)
- **Đề xuất:** khi cuộc gặp Đã gặp không có chuyển nhóm và KH có chuyển nhóm ngày sau ngày gặp, khóa ô "Nhóm sau cuộc gặp" như D7 (cùng dòng giải thích 6f), hoặc lấy `from` = `stageOn(transitions, KH, ngày gặp)` để "giữ nguyên" và dòng đọc lại đúng ngày đó. ≈ 10–15 dòng SP (`outcome-form.ts` `outcomeLock` + `EditOutcomeDialog.tsx`) + 2 ca `outcome-form.test.ts`; cần Owner chốt có coi đây là D7 hay không.

### CL-E2

```
ID: CL-E2
Mức: Low
Trục: C (nhãn UI theo nghĩa thường)
Vị trí: apps/desktop/src/routes/customers/policy-form.ts:122-138 (expectedCaseSize: "the latest met meeting that has it"); apps/desktop/src/i18n/vi.ts:1173-1174 (policyForm.caseSizeHelp "Case size dự kiến ở cuộc gặp gần nhất: {amount} …"), :1145 (policies.caseSize); apps/desktop/src/routes/customers/PolicyDialogs.tsx:235-239; apps/desktop/src/routes/customers/CustomerPolicies.tsx:41; apps/desktop/src/routes/customers/CustomerProfile.tsx:124 (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** Hộp 8a ghi "Case size dự kiến **ở cuộc gặp gần nhất**: 800 tr (chỉ để tham khảo…)", nhưng số lấy từ cuộc gặp Đã gặp gần nhất **có** case size: khi cuộc gặp gần nhất để trống (= "chưa ước lượng", D6), app hiện case size của một cuộc gặp cũ hơn dưới nhãn "cuộc gặp gần nhất". Test `policy-form.test.ts:157-160` ghim đúng hành vi này (cuộc gặp 12/09 trống → lấy 600 tr của 10/09), nên đây là chủ ý của code, nhưng trái nghĩa thường của nhãn (quy tắc Owner PR #163: "kết quả trái nhãn là lỗi"); đầu thẻ Hợp đồng ở hồ sơ ("case size dự kiến …") cũng dùng số này.
- **Tái hiện / bằng chứng:** `node p5-labels.mjs <repo> <backup>` (dữ liệu tải, log `E\p5-labels.log`):
  ```
  customers with a case size shown in 8a: 1190; of which the latest met meeting has none (value from an older meeting): 319
    01K7C4NNBQXFVA2EJV1SGE9060: latest met 20/08/2026 without case size; shown 20 tr from 28/07/2026
    01K7C4NYERA3YG92MR802CXHTT: latest met 09/09/2026 without case size; shown 50 tr from 23/08/2026
  ```
- **Ảnh hưởng:** RE ghi HĐ mới (8a) tham khảo một con số mà mình tưởng là ước lượng của lần gặp mới nhất, trong khi lần gặp đó chưa ước lượng; ≈ 27 % KH có số hiện ở dữ liệu tải. Chỉ là dòng tham khảo, không tự điền, không vào chỉ số → Low.
- **Đề xuất:** hoặc chỉ lấy case size của cuộc gặp Đã gặp gần nhất (trống thì không hiện dòng), hoặc đổi câu thành "Case size dự kiến gần nhất đã ước lượng: {amount} (cuộc gặp dd/mm/yyyy)" — đổi câu là đổi chữ mockup 8a (G3) nên cần Owner chọn. ≈ 5 dòng SP + sửa 1 ca test.

### CL-E3

```
ID: CL-E3
Mức: Low
Trục: C (bảng Thùng rác), A
Vị trí: apps/desktop/src/routes/SettingsTrash.tsx:80-86 (cột "Bản ghi" `kind: 'text'`, `value: recordTitle`, sắp được vì không có `sortable: false`); apps/desktop/src/routes/trash-view.ts:75-86 (recordTitle: "dd/mm/yyyy hh:mm · Trạng thái", "Nộp dd/mm/yyyy · FYP"); packages/ui/src/components/compare-cells.ts:13 (text → byName) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** Bấm đầu cột "Bản ghi" của Thùng rác sắp theo **chữ** của ô, mà ô của lịch hẹn và HĐ bắt đầu bằng ngày dạng `dd/mm/yyyy`: kết quả xếp theo ngày-trong-tháng, không theo thời gian (01/09/2026, 01/12/2025, 02/06/2026, 02/08/2026, 02/11/2025 …). Mockup 11a không nói cột nào sắp được; các bảng khác của app sắp cột ngày theo `kind: 'date'`.
- **Tái hiện / bằng chứng:** `p5-labels.log` (80 lịch hẹn trong Thùng rác của dữ liệu tải, sắp bằng `compareCells('text', recordTitle(a), recordTitle(b))` như `DataTable`):
  ```
  first 6 after a click on "Bản ghi" (asc):
    01/09/2026 08:30 · Đã gặp
    01/12/2025 09:00 · Đã gặp
    02/06/2026 18:00 · Hủy
    02/08/2026 19:30 · Không đến
    02/11/2025 15:00 · Đã gặp
    03/05/2026 14:00 · Hủy
  in date order: false
  ```
- **Ảnh hưởng:** Owner / TL lọc "Lịch hẹn" hay "HĐ" rồi bấm "Bản ghi" để tìm theo ngày thì thứ tự sai; chỉ hiển thị, có đường vòng (cột "Xóa lúc", ô tìm theo tên KH) → Low.
- **Đề xuất:** `sortable: false` cho cột "Bản ghi" (cột chứa nhiều loại bản ghi, không có một thứ tự chung), hoặc giá trị sắp theo loại (ngày ISO cho lịch hẹn / HĐ, tên cho KH / người / team). ≈ 3–10 dòng SP + 1 ca `trash-view.test.ts` / e2e.

### CL-E4

```
ID: CL-E4
Mức: Nit
Trục: C (mockup ↔ app, mockup ↔ spec)
Vị trí: apps/desktop/src/i18n/vi.ts:765 (outcome.sub '{customer} · {weekday} {when} · hiện {stage}') ↔ docs/design/mockups/appointment-forms.html 6c ("… · Thứ Hai 14/09/2026 10:00 · lần 3 · hiện N2"); packages/domain/src/number.ts:16-22 (formatPercent bỏ ",0") + apps/desktop/src/routes/overview/overview-view.ts:65-68 (closeRateText) ↔ docs/design/mockups/overview.html 1a bảng So sánh team ("60,0%", "100,0%", "0,0%") ↔ docs/design/phase-4-chi-so.md §4.1 ("Tổng 5/5 = 100%") (8855345)
Tình trạng: CONFIRMED (đọc + grep)
```

- **Mô tả:** Hai lệch nhỏ chưa có trong "Lệch mockup đã biết" (`docs/testing/nghiem-thu-v1.md:366-379`): (1) đầu hộp "Kết quả cuộc gặp" (6c) không có "· lần n" như mockup; NT-LH-21 đã viết theo app nên lượt nghiệm thu không lộ. (2) Tỉ lệ chốt tròn hiện "60%", "100%", "0%" (test `reports-view.test.ts:83` ghim "100%"), mockup 1a viết "60,0%" / "100,0%" / "0,0%", còn spec §4.1 và golden viết "100%" — mockup và spec không cùng cách ghi; NT-TQ-06 ghi "một chữ số thập phân".
- **Tái hiện / bằng chứng:** `grep -n "lần 3" docs/design/mockups/appointment-forms.html`; `grep -o "[0-9]*,[0-9]%" docs/design/mockups/overview.html` → `60,0%`, `100,0%`, `0,0%`, `25,0%`; `packages/domain/src/number.test.ts:58` `expect(formatPercent(100)).toBe('100')`.
- **Ảnh hưởng:** chỉ chữ; người nghiệm thu có thể ghi "Lỗi" ở NT-TQ-06 / NT-TQ-23 vì "60%" không có chữ số thập phân.
- **Đề xuất:** Owner chọn: ghi hai điểm vào "Lệch mockup đã biết" và sửa câu NT-TQ-06 ("một chữ số thập phân khi không tròn"), hoặc thêm "· lần n" (dùng `priorMeetings().metCount`) vào `outcome.sub`. ≈ 0–5 dòng.

### CL-E5

```
ID: CL-E5
Mức: Nit
Trục: A (i18n — chuỗi UI cứng)
Vị trí: apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:67, :600 (`.join(', ')`, `|| '—'`), :603, :604 (`|| '—'`); apps/desktop/src/routes/appointments/AppointmentDialog.tsx:234 (`{personLabel(person)} ×`); apps/desktop/src/routes/overview/TeamCompare.tsx:91 (`'▾' : '▸'`); apps/desktop/src/routes/SettingsTrash.tsx:55 (`<span>—</span>`) (8855345)
Tình trạng: CONFIRMED (quét `E\b1-hardcoded.mjs`, log `E\b1-hardcoded.log`)
```

- **Mô tả:** Dấu nối / ký hiệu UI viết thẳng trong JSX của gói E, trong khi `vi.ts` đã có `sep.list` (', '), `overview.none` ('—'); `lint:tokens` chỉ chặn `·` và `→` nên không bắt. Cùng loại với CL-D5 (gói D) và NIT sổ review #469 (`KycExtraction.tsx:96`). Ngoài các chỗ trên, quét 37 file SP của gói E không thấy chữ tiếng Việt cứng nào (mọi chuỗi qua `t()`).
- **Tái hiện / bằng chứng:** `node b1-hardcoded.mjs <repo>` → các dòng `[join] ", "` (`AppointmentsScreen.tsx:67`, `:600`), `[fallback] —` (`:67`, `:600`, `:603`, `:604`), `[text] —` (`SettingsTrash.tsx:55`); `grep -n "×\|'▾'"` cho hai chỗ còn lại.
- **Ảnh hưởng:** không ai thấy khác biệt khi app chỉ có tiếng Việt.
- **Đề xuất:** `t('sep.list')`, `t('overview.none')`, khóa mới cho "×" (nhãn bỏ đã có `appointmentForm.coordinatorRemove`) và mũi tên mở / thu; gộp vào lần chạm sau của từng file, ≈ 8 dòng.

### CL-E6

```
ID: CL-E6
Mức: Nit
Trục: B (code lặp ≥ 3 nơi)
Vị trí: apps/desktop/src/routes/reports/ReportTable.tsx:14-33 (COLUMNS: 17 nhãn, GROUPS, GROUP_STARTS); apps/desktop/src/routes/reports/report-workbook.ts:43-69 (COLUMNS: 17 nhãn + giá trị, GROUPS); apps/desktop/src/routes/reports/reports-view.ts:83-93, :312-327 (REPORT_STAGES, APPOINTMENT_SUMS, reportCells: thứ tự 17 ô) (8855345)
Tình trạng: CONFIRMED (đọc + probe P1)
```

- **Mô tả:** Danh sách 17 cột của báo cáo (Lịch hẹn 5 · Kết quả 6 · KH cuối kỳ 6) và 3 nhóm cột được khai báo ba lần độc lập: nhãn + màu ở `ReportTable.tsx`, nhãn + giá trị số ở `report-workbook.ts`, thứ tự ô chữ ở `reportCells`; số cột mỗi nhóm (5 / 6 / 6) viết tay ở hai `GROUPS` và `GROUP_STARTS = [0, 5, 11]`. Thêm hay đổi thứ tự một cột phải sửa đúng ba chỗ; màn và file Excel lệch nhau nếu quên một chỗ. Hôm nay ba chỗ khớp: probe P1 so 2 242 dòng Excel với ô của màn trên dữ liệu tải, 0 lệch (§6 trục C); test `report-workbook.test.ts:97-131` ghim nhãn cột Excel, không so với màn.
- **Tái hiện / bằng chứng:** đọc ba khối trên; `E\p1-consistency.log` ("Excel rows compared: 2242", "problems: 0").
- **Ảnh hưởng:** chỉ bảo trì; không đo được chi phí chạy.
- **Đề xuất:** một bảng cột dùng chung trong `reports-view.ts` (`{ group, label, className?, value(figures): number | null, format }`), `reportCells`, `ReportTable` và `report-workbook` đọc từ đó; ≈ −30 dòng SP; giữ hành vi bằng `reports-view.test.ts`, `report-workbook.test.ts`, `e2e/reports.spec.ts` (xuất Excel, so số với màn) và probe P1.

## 4. Bloat

| Đã chạy / đo | Trên gì | Kết quả | ID |
|---|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` | `apps/desktop` | hai cờ đã bật sẵn ở `tsconfig.base.json` (gói A / B / D đã xác nhận), `pnpm verify` xanh ở SHA ghim (`common\baseline.md`) → 0 biến / tham số thừa; không chạy lại | — |
| `E\b2-exports.mjs`: mọi `export` của 37 file SP gói E → nơi dùng ngoài file (SP / chỉ test / không đâu) | `apps/desktop/src`, `packages`, `e2e`, `tools` (log `E\b2-exports.log`) | 183 export: 152 dùng ở SP; 22 không ai import ngoài file — 21 là **kiểu** (xóa khi biên dịch, chi phí 0) và 1 hàm `markName` (`reports-view.ts`, chỉ dùng trong file, export thừa); 9 chỉ test dùng — seam test có chủ ý (`buildReportWorkbook`, `reportWorkbookMeta`, `reportFileName`, `readFyp`, `OUTCOME_CHOICES` + 4 kiểu) | không thành phát hiện |
| Code lặp ≥ 3 nơi (đọc) | gói E | 17 cột báo cáo + 3 nhóm cột khai báo 3 lần (`ReportTable.tsx`, `report-workbook.ts`, `reportCells`) | CL-E6 |
| Code lặp 2 nơi / đã biết (đọc) | gói E | `plain` bỏ dấu (`appointment-form.ts:111`, `trash-view.ts:48`, biến thể `slug` `report-workbook.ts:224`) — KNOWN sổ #543; `download()` tải file ở bản web (`SettingsBackup.tsx:169`, `ReportExport.tsx:88`, khác kiểu blob); hằng class thẻ (`StageBlock.tsx:35`, `TeamCompare.tsx:42`, `ReportsScreen.tsx:20` cùng chuỗi Tailwind), `ALERT` riêng ở `SettingsBackup.tsx:33` cạnh `ALERT` của `CustomerDialogs.tsx` — chuỗi class, không phải logic, không đo được chi phí | không thành phát hiện |
| Dependency của gói | `exceljs` (chỉ gói E dùng) | nạp lười ở lần xuất đầu (`report-workbook.ts:158` `await import('exceljs')`); bản build riêng `E\web`: `index.html` chỉ `modulepreload` `rolldown-runtime` + `chart`, **không** nạp `exceljs.min.js` 929 569 B lúc mở; lần xuất đầu trong Node 237 ms (gồm nạp module), các lần sau 11 ms | — |
| `lint:deps`, codemap | `common\baseline.md` (309 module, 1 244 dependency, 0 vi phạm; `codemap:check` xanh) | không chạy lại | — |
| Chuỗi UI cứng (`E\b1-hardcoded.mjs`) | 37 file SP gói E | không có chữ tiếng Việt cứng; 6 chỗ dấu / ký hiệu viết thẳng | CL-E5 (trục A) |

Đề xuất refactor bloat của gói E: chỉ CL-E6 (≈ −30 dòng, test giữ hành vi ghi trong mục).

## 4b. Hiệu năng

Máy Office Laptop `D13_THINKPAD`, 14/10/2026 17:25–17:32; song song có thể có phiên Codex ở `Project-2C-review-2` (không biết đang chạy gì). Dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (sau nhập, bản ghi sống: 1 481 KH, 10 252 lịch, 1 674 HĐ, 4 883 chuyển nhóm, 51 người, 4 team; Thùng rác 117 dòng). Ngưỡng: thao tác màn < 200 ms (`docs/metrics/phase-6.md`).

**Trong Node** (`E\p2-perf.mjs`, trung vị 15 lần, đồng hồ 14/10/2026; log `E\p2-perf.log`) — các hàm thuần mà màn gói E gọi mỗi revision / mỗi lần bấm:

| Hàm (màn gọi) | Trung vị | Max |
|---|---:|---:|
| `appointmentRows` Toàn bộ (≈ 10 k dòng, Lịch hẹn mỗi revision) / Team | 2,58 / 1,20 ms | 5,58 ms |
| lọc kỳ + đảo (tháng / năm), dòng đếm năm (2 lần lọc) | 0,62 / 0,78 / 1,07 ms | 1,89 ms |
| `monthGrid` / `yearGrid` / `dayBoard` / `appointmentsByRe` (năm) | 0,96 / 0,29 / 0,66 / 1,01 ms | 1,51 ms |
| `priorMeetings` (hộp 6a, KH 38 lịch) / `searchCustomers` mỗi lần gõ / `rescheduleLinks` | 0,45 / 1,10 / 0,15 ms | 2,01 ms |
| `kpiTiles` tháng / năm | 1,91 / 2,56 ms | 3,52 ms |
| `stageBlock` tháng · năm, Toàn bộ / Team (1 chart mỗi team) | 3,22 · 3,20 / 3,47 · 3,35 ms | 5,16 ms |
| `teamCompare` tháng / năm | 1,95 / 2,75 ms | 3,87 ms |
| `reportRows` Toàn bộ tháng / năm / Tùy chọn 3 tháng | 6,33 / 8,43 / 6,24 ms | 9,63 ms |
| `reportCells` mọi dòng | ≤ 0,10 ms | 0,33 ms |
| `buildReportWorkbook` năm, 4 sheet (lần đầu gồm nạp `exceljs`) | 10,94 ms | 237,20 ms (lần đầu) |
| `listTrash` (117 dòng) / `trashCounts` + `filterTrash` / chữ mọi dòng | 48,87 / 0,09 / 0,22 ms | 54,90 ms |
| `expectedCaseSize` (KH 38 lịch) | 0,10 ms | 0,45 ms |

**Trên bản web** (`E\p4-ui-perf.mjs`, Edge headless 1440×900, bản build riêng `E\web` cổng 4393, cách đo như `e2e/perf/probe.perf.ts`: từ click / phím cuối tới khung hình đầu có kết quả; 5 lần; 17:29–17:32; log `E\p4-ui-perf.log`; số Edge headless, cùng engine với WebView2 nên so ngưỡng được, không so trực tiếp với `perf-ref.json`). Thao tác của gói E mà probe T-218 chưa đo:

| Thao tác | Trung vị | Min–max | Ngưỡng |
|---|---:|---:|---|
| Sidebar → Tổng quan (bảng đã đọc) | 39 ms | 37–87 | < 200 ✅ |
| Tổng quan: Lọc Năm / Lọc góc nhìn Team (1 chart mỗi team) | 19 / 38 ms | 18–45 | < 200 ✅ |
| Tổng quan: ẩn / hiện N4 (mọi chart) / mở một team (RE) | 21 / 21 / 12 ms | 8–29 | < 200 ✅ |
| Sidebar → Báo cáo / Lọc Năm / Theo RE (51 dòng) / Theo mốc năm | 12 / 11 / 16 / 6 ms | 6–17 | < 200 ✅ |
| Sidebar → Lịch hẹn / mở hộp 6a / gõ tìm KH / chọn dòng (Chi tiết) / mở hộp 6c–6f / "Hiện thêm" 100 | 27 / 11 / 6 / 7 / 9 / 14 ms | 5–28 | < 200 ✅ |
| Sidebar → Cài đặt (Dữ liệu, `countRecords`) | 12 ms | 12–13 | < 200 ✅ |
| Cài đặt → Thùng rác (`listTrash`) | 86 ms | 81–97 | < 200 ✅ (exe `trash.open` 91 ms) |
| Thùng rác: lọc loại / gõ tìm / mở hộp khôi phục | 7 / 4 / 7 ms | 3–9 | < 200 ✅ |
| Thùng rác: Khôi phục (lệnh ghi + `listTrash` lại; bản web không ghi file) | 86 ms | 75–89 | < 200 ✅ |

Số tham chiếu cùng máy của exe (`common\perf\perf-ref.json`, không đo lại): `appointments.period-*` 10–18 ms, `overview.filter-*` 16–17 ms, `reports.filter-*` 8–10 ms, `reports.table-re` 16 ms, `reports.export-excel` 36 ms, `trash.open` 91 ms, `reload.overview / appointments / reports / settings` 349 / 336 / 307 / 207 ms — đều trong ngưỡng / bằng nền.

Kết luận: **không có phát hiện P trong gói E.** Chỗ nặng nhất của gói là `listTrash` (≈ 50 ms trong Node, 86 ms trên màn), đã nêu ở CL-A2 (tăng theo số KH trong Thùng rác); mọi hàm view khác của gói ≤ 10 ms trên dữ liệu tải.

## 5. Bảng đếm mức × trục

Trục chính của mỗi phát hiện (ngoặc = trục phụ của cùng phát hiện, không đếm lần hai).

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | (CL-E7) | (CL-E7) | 1 (CL-E7) | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Low | (CL-E1) | 3 (CL-E1, CL-E2, CL-E3) | 0 | 0 | 0 | 0 | 0 | 0 | (CL-E3) | 3 |
| Nit | 0 | 1 (CL-E4) | 0 | 0 | 0 | 0 | 1 (CL-E6) | 0 | 1 (CL-E5) | 3 |
| **Tổng** | 0 | 4 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | **7** |

Tình trạng: 7 / 7 CONFIRMED (CL-E1, CL-E2, CL-E3, CL-E7 có probe chạy thật trên bản web và / hoặc dữ liệu tải; CL-E4, CL-E5, CL-E6 xác nhận bằng đọc + quét / `grep` + probe P1), 0 PLAUSIBLE, 0 KNOWN. CL-E7 và CL-E1: hành vi CONFIRMED, luật đúng cần Owner chốt (spec TR-3 / D7 chưa nói cuộc gặp giữ nhóm). CL-E7 cùng gốc với CL-A1 (gói A) nhưng là hậu quả khác (ngày sau → chặn khôi phục), nên đặt ID riêng.

## 6. Đã xét, không thấy (theo trục)

- **E — Edge case:** probe P1 chạy 5 "hôm nay" (14/10/2026, 31/10 cuối tháng, 31/12 cuối năm, 01/01/2027 đầu năm, 29/02/2028) × 7 kỳ (Ngày, Tuần, Tháng, Năm, một tháng đã qua, Tùy chọn vắt 3 tháng, Tùy chọn 20 ngày) × 9 góc nhìn (Toàn bộ, 4 team, 4 RE) — không lệch. Chuỗi nhiều bước qua gói A ↔ E: cuộc gặp giữ nhóm → chuyển tay → sửa (P3 → CL-E1) / xóa → khôi phục (P9, P10 → CL-E7); xóa rồi khôi phục 120 bản ghi ngược thứ tự (P8: ngoài CL-E7, nhóm KH và số 2026 trở về đúng). `exportedAt` của backup sửa tay ngoài miền năm (P6: `importBackup` nhận "2200-01-01T00:00:00.000Z" / "1800-06-01…", hộp 10a hiện "01/01/2200 07:00" — không lỗi, chỉ ở file sửa tay, không nêu). Xét thêm nhưng không nêu: Thùng rác đọc `listTrash` qua `useQuery` theo revision, không theo ngày (`AppDataContext.tsx` `useQuery` không phụ thuộc `useToday`), nên một dòng bị chặn vì "sau hôm nay" (TR-5, chỉ có ở bản ghi xóa từ file nhập) vẫn tắt nút tới lần đổi dữ liệu / mở lại màn nếu app mở qua nửa đêm — điều kiện quá hiếm, lệnh khôi phục vẫn kiểm lại (đọc code, chưa chạy). Ngày được chọn của Lịch hẹn không nhảy qua nửa đêm: ACCEPTED (#334).
- **C — Hợp đồng / mockup / nhãn:** số khớp giữa màn (P1, 315 tổ hợp, 0 lệch): ô Lịch hẹn Tổng quan ↔ Tổng hợp Báo cáo ↔ dòng đếm + lịch tháng + lưới năm Lịch hẹn; 6 ô KPI ↔ 6 ô Kết quả; 4 ô N4–N1 ↔ KH cuối kỳ ↔ cột cuối chart; Σ team = Σ RE = Tổng hợp; Σ mốc (lịch hẹn, kết quả) = Tổng hợp, mốc cuối có ảnh chụp = Tổng hợp; So sánh team (team, RE, Tổng) ↔ Theo team / Theo RE; Excel 2 242 dòng × 17 cột ↔ ô màn (tiền, %, "—" = ô trống). Mockup đối chiếu: `appointment-forms.html` 6a–6i, `policy-forms.html` 8a–8d, `trash.html` 11a–11g, `overview.html` 1a và §2, `reports.html` 2a và 2f; NT-LH / NT-TQ / NT-BC / NT-TR của `nghiem-thu-v1.md`. Lệch / sai nhãn: CL-E1, CL-E2, CL-E3, CL-E4, CL-E7. Mockup tự lệch chữ "Dời – hủy – không đến" (ô 1a) / "Dời lịch / hủy / không đến" (chú giải §2); app dùng một chữ cho cả hai — không nêu. Lệch đã biết (#163, #165, #543 "nhóm sau N2") không nêu lại.
- **D — Dữ liệu:** gói E không ghi thẳng bảng: mọi hộp (6a–6i, 8a–8d, khôi phục, nạp lại, nhập backup) đi qua lệnh `@p2c/db` trong `data.run` / `replace` (đọc từng file); số tiền ở 6c / 6f / 8a–8d đọc bằng `parseVnd`, `metDraftOf` → `parseVnd` khứ hồi (test `MetFields.test.ts`; chạy lại `formatVnd` / `parseVnd` cho 800 tr, 1 234 567 ₫, 100 tỷ: khớp); hộp 10a so "Trong file" và "Hiện tại" cùng là bản ghi sống (`countRecords`). Phát hiện: CL-E7.
- **G — Guardrail AI:** không có code AI trong gói E (`AppointmentAi.tsx`, `appointment-ai-view.ts`, `SettingsAi.tsx` thuộc gói C).
- **S — Ranh giới:** tên file Excel chỉ ASCII + ngày ISO (`slug`, `periodStamp`; đọc + test `report-workbook.test.ts`); tên team / RE bắt đầu bằng `=` / `+` / `@` ghi vào Excel là chuỗi, không thành công thức (test "writes team and RE names as they are"); tooltip chart escape tên team (`stage-chart.ts:51`, `:73` `encodeHtml`, F-18); không `dangerouslySetInnerHTML` / `innerHTML` / `window.open` trong gói E (`grep`); khôi phục gọi lệnh theo id của dòng; backup sửa tay `exportedAt` ngoài miền: P6, vô hại. Không thấy.
- **P — Hiệu năng:** §4b, không có phát hiện (mọi hàm view ≤ 10 ms trong Node; mọi thao tác đo trên bản web ≤ 97 ms; `listTrash` theo số KH xóa đã ở CL-A2).
- **B — Bloat:** §4, CL-E6.
- **T — Chất lượng test:** 70 đột biến trên 12 file logic thuần của gói E (+ 1 lần chạy thử E1): 67 bị giết, 3 sống (§7.2). Sống: E9 (đổi thứ tự chấm "Chưa ghi kết quả" / "Dời …" của ô ngày — unit không ghim; e2e `appointments.spec.ts:606-615` ghim chấm đầu + tên trợ năng, chỉ bắt được khi ngày có lịch Dời / hủy / không đến), E30 (gắn "MTD" cho kỳ Năm đang chạy — unit không ghim, e2e `overview.spec.ts:85` so nguyên chữ "Đang xem: Năm 2026 01/01 – 15/09/2026 · Toàn bộ" nên e2e giết; không chạy e2e vì cổng 4173 dùng chung với phiên Codex), E69 (biên 12 cột của nhãn trục chart: chart Năm sẽ chỉ ghi nhãn vài tháng — không test nào ghim; hậu quả nhỏ) → không tách phát hiện. e2e Thùng rác 3 ca (`trash.spec.ts`), lý do chặn 11d có ở `trash-view.test.ts` + `packages/db/src/trash.test.ts`; không test nào có cuộc gặp giữ nhóm bị xóa (CL-E7).
- **A — Trợ năng / i18n:** P7 (cây trợ năng Chromium qua CDP): Tổng quan, Báo cáo, Lịch hẹn (tháng, năm), Cài đặt → Dữ liệu, Cài đặt → Thùng rác, hộp 6c, hộp khôi phục 11c — 0 phần tử tương tác không có tên; hai hộp: focus vào trong khi mở, Tab chỉ ra `body` (bước "chrome" của `showModal`, như gói D ghi), Escape đóng và trả focus về nút mở. Chuỗi cứng: CL-E5. Đã biết: chart `role="img"` không có bảng số (sổ P8), ô ngoài tháng `aria-hidden` (#156).

## 7. Phụ lục

### 7.1 Probe, log

Mọi file ở `C:\workspace\deep-review-1-6\claude\E\`. Probe Node nạp thẳng nguồn TS ở SHA ghim qua `hooks.mjs` (chép của gói D, cách nạp như `tools/load-data.mjs`), không sửa repo. Probe giao diện chạy trên bản web dựng riêng: `pnpm exec vite build --outDir C:\workspace\deep-review-1-6\claude\E\web --emptyOutDir` (trong `apps/desktop`, không đặt `VITE_DEMO_ANCHOR`: seed theo hôm nay 14/10/2026), phục vụ bằng `serve.mjs` ở cổng **4393** (không dùng 4173; đã tắt cuối phiên), Edge headless qua `@playwright/test` của repo; không bấm nút AI nào, không gọi mạng ngoài.

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `hooks.mjs` | nạp TS không đuôi + `?raw` | — | mọi probe Node |
| `p1-consistency.mjs` | khớp số Tổng quan ↔ Báo cáo ↔ Lịch hẹn ↔ Excel, 315 tổ hợp | `p1-consistency.log` | §6 C, CL-E6 |
| `p2-perf.mjs` | thời gian hàm view gói E trong Node | `p2-perf.log` | §4b |
| `p3-kept-edit.mjs` | cuộc gặp giữ nhóm → chuyển tay → hộp 6f (a / b / c) | `p3-kept-edit.log` | CL-E1 |
| `p4-ui-perf.mjs` | thời gian thao tác màn gói E trên bản web, dữ liệu tải | `p4-ui-perf.log` | §4b |
| `p5-labels.mjs` | case size "cuộc gặp gần nhất"; sắp cột "Bản ghi" Thùng rác | `p5-labels.log` | CL-E2, CL-E3 |
| `p6-exported-at.mjs` | backup `exportedAt` ngoài miền năm (file sửa tay ở `data\`) | `p6-exported-at.log` | §6 E, S |
| `p7-a11y.mjs` | tên trợ năng, focus hộp 6c / 11c | `p7-a11y.log` | §6 A |
| `p8-roundtrip.mjs` | xóa rồi khôi phục 120 bản ghi, so Báo cáo trước / sau | `p8-roundtrip.log` | CL-E7 |
| `p9-kept-delete.mjs` | cuộc gặp giữ nhóm → chuyển tay → xóa (6g) → Thùng rác | `p9-kept-delete.log` | CL-E7 |
| `p10-kept-count.mjs` | đếm cuộc gặp giữ nhóm mà xóa sẽ không khôi phục được; thử 50 | `p10-kept-count.log` | CL-E7 |
| `b1-hardcoded.mjs` | quét chuỗi / dấu UI cứng 37 file SP gói E | `b1-hardcoded.log` | CL-E5 |
| `b2-exports.mjs` | nơi dùng mọi export của gói E | `b2-exports.log` | §4 |
| `m-run.mjs` | 70 đột biến: vá tạm file repo → `pnpm exec vitest run <test của file>` → trả lại nguyên byte, kiểm sha256 | `m-run.log` | §6 T |

### 7.2 Đột biến (70 lần, 17:36:50–17:39:09; 67 bị giết, 3 sống; lần chạy thử E1 riêng lúc 17:36:39: bị giết)

Mỗi đột biến khớp đúng 1 chỗ trong file (kiểm trước bằng lượt khô), file trả lại nguyên byte trong `finally` (không có dòng `RESTORE MISMATCH`), `git status --short` sau lượt: rỗng (`m-run.log`).

| Nhóm | ID | Bị giết | Sống |
|---|---|---:|---|
| `appointments-view.ts` (tô ngày, nhóm, lọc phối hợp, đếm RE, lịch tháng / năm, chọn ngày, Trong ngày) | E1–E11 | 10 | E9 (thứ tự chấm) |
| `appointment-form.ts` (ngày từ hôm nay, `dayText`, giờ, lịch trước, tìm KH) | E12–E18 | 7 | — |
| `outcome-form.ts` (case size > 0, trạng thái chọn được, khóa D7, thiếu mục D6, người đánh giá, hẹn tiếp) | E19–E25 | 7 | — |
| `overview-view.ts` (cửa sổ tính, "=", làm tròn điểm %, Team cộng mọi team, MTD, năm của cửa sổ so, Tùy chọn không so) | E26–E32 | 6 | E30 (MTD kỳ Năm — e2e giết) |
| `stage-view.ts`, `stage-chart.ts` (cột sau hôm nay, Team cộng mọi team, "(hôm nay)", thứ tự chồng, nhãn trục, Tổng tooltip) | E33–E35, E68–E70 | 5 | E69 (biên 12 cột) |
| `team-compare-view.ts` (tỉ lệ chốt Tổng, sắp team, Đã gặp) | E36–E38 | 3 | — |
| `reports-view.ts` (Tổng khi chưa bắt đầu, tên mốc, "tới dd/mm", RE của team, tỉ lệ chốt, số RE) | E39–E45 | 7 | — |
| `report-workbook.ts` (ô % trống, `slug` đ, tên file tháng, bước lỗi, MTD trong dòng đầu) | E46–E50 | 5 | — |
| `trash-view.ts` (lọc loại, tìm theo KH của HĐ, chi tiết dòng chặn, "Thuộc", lý do có ngày, câu còn lại, thông báo 11e, lỗi khôi phục, đếm Tất cả) | E51–E59 | 9 | — |
| `applied-filter.ts` (cùng góc nhìn team, cùng kỳ) | E60–E61 | 2 | — |
| `policy-form.ts` (FYP > 0, ngày phát hành, ảnh hưởng chỉ số cùng tháng, tăng / giảm, case size mới nhất, tên RE rỗng) | E62–E67 | 6 | — |
| **Tổng** | 70 | **67** | **3** |

Nguồn đầy đủ của từng đột biến (chuỗi `from` → `to`, file test) nằm trong `E\m-run.mjs`; kết quả từng dòng (số test đỏ / xanh) trong `E\m-run.log`.

### 7.3 Cuối phiên

- `git status --short` cuối phiên (`C:\workspace\Project-2C-review`): rỗng; `git rev-parse HEAD` = `885534549808f42aec7f9af5743bbf86642ee4bd`.
- Server tĩnh cổng 4393 đã tắt; không chạy `pnpm e2e`, không đo trên exe (số exe lấy từ `common\perf\perf-ref.json`).
- Không mở / liệt kê `codex\`, `muse\`; không đọc báo cáo bên khác (xem ghi chú bước 0 ở §1 về một lần `ls` cấp 1 của `deep-review-1-6\`).
- Giờ xong: 2026-10-14 17:53.
