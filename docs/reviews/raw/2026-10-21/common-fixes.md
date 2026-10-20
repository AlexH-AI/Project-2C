# Issue và PR sửa lượt 2 — deep review Phase 1–6, lượt 3

Dựng ở bước chuẩn bị (`plan.md` §L3.9 bước 4), 19/10/2026 23:57 +07:00, máy `DESKTOP-KDURKJP`, bằng `gh issue view` / `gh pr view --json` trên `AlexH-AI/Project-2C`. Nguyên văn thân 18 Issue của `plan.md` §L3.2 và thân mọi PR sửa của chúng (gồm PR docs đi kèm: spec #707, sổ / chú thích #677, #692, câu trả lời Owner lượt 2 #665 của dòng DR6-98), để reviewer không cần chạy `gh`. Mỗi thân PR có các mục "Lệch so với Issue", "Chưa làm", "Ghi chú OPEN liên quan" khi PR có. Tiêu đề trong thân đã hạ hai cấp để lồng dưới mục của file này; chữ giữ nguyên.

| Issue | Tiêu đề | PR (commit merge) |
|---|---|---|
| #652 | T-248: Cuộc gặp trước ngày tạo KH, E20 theo thứ tự ghi, khôi phục chuyển nhóm đúng KH (DR6-68, 69, 71, 87) | #666 (`d6c2350`) |
| #653 | T-249: Hộp 6f nêu hậu quả, chữ Thùng rác, luật D7 một nơi (DR6-70, 91, 93, 94, 95, 99, 103) | #667 (`d0a97ec`) |
| #654 | T-250: Màn nhập liệu: link dài, hộp 9b đếm như lệnh, cuộn về đầu, tiền KYC (DR6-80, 81, 82, 90, 101) | #669 (`1f71029`) |
| #655 | T-251: Focus không rơi về body, tên cột nút (DR6-83, 100) | #693 (`f9fb70f`) |
| #656 | T-252: Lớp file: integrity_check, file chỉ đọc, màn lỗi khởi động, test hở (DR6-73, 74, 75, 88) | #674 (`c5a40e1`) |
| #657 | T-253: Key qua mọi tổ hợp hai lớp escape, Rust và script eval (DR6-76) | #680 (`217cef6`) |
| #658 | T-254: AI Mock: trích xuất không chậm, bớt đề xuất sai, test panel (DR6-78, 79, 89) | #682 (`1502c5e`) |
| #659 | T-255: K20 mở rộng: khoảng trắng và ký tự vô hình Unicode (DR6-72) | #686 (`9ac20cf`) |
| #660 | T-256: Công cụ: cổng tested base, retro.mjs, múi giờ, probe Thùng rác (DR6-85, 86, 92, 98) | #689 (`bbb20b1`) |
| #661 | T-257: Đợt G5: ký tự vô hình V3–V6, bỏ dấu khớp nhầm, chi tiết V1, trần chuỗi gốc, kỉ / qui (DR6-17, 23, 24, 77, 102) | #698 (`8f7355b`) |
| #662 | T-258: Dọn sạch Thùng rác (DR6-84, Q8 c) | #707 (`b4aebfa`), #709 (`29aca69`), #710 (`6526793`) |
| #663 | T-259: Tài liệu: nghiệm thu hành vi mới, hướng dẫn "200.000" (DR6-96, 97) | #700 (`16a28f0`) |
| #671 | T-260: Bỏ luật cấm subagent, cho phép ultracode (ADR-0001 M8) | #672 (`29b68e2`) |
| #676 | T-261: Mỗi task biết và xử lý ghi chú review OPEN ở file nó sửa (notes-for) | #678 (`a48a319`), #677 (`305771c`) |
| #683 | T-262: E2E mở hồ sơ KH chờ đúng h2 của hồ sơ, hết đỏ chập chờn ở customer-appointments | #684 (`ce6de0a`) |
| #691 | T-263: Test seed cố định múi giờ khi so hash dữ liệu giả lập (UTC+12) | #702 (`2b0a7aa`), #692 (`8a0d0a3`) |
| #695 | T-264: Đo lại mốc Home PC sau integrity_check (#656) | #696 (`8f202bc`), #665 (`9c86d77`) |
| #704 | T-265: Module nạp TypeScript dùng chung cho tools/, sửa import có dấu chấm (#474) | #705 (`1f0489f`) |

---

# Issue #652 — T-248: Cuộc gặp trước ngày tạo KH, E20 theo thứ tự ghi, khôi phục chuyển nhóm đúng KH (DR6-68, 69, 71, 87)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

1. **Cuộc gặp trước ngày tạo KH (DR6-68, Medium, hồi quy do #616) — Q1 (a):** trước ngày tạo KH, "nhóm của ngày" = nhóm tạo KH (chuyển nhóm đầu tiên), ở mọi nơi dùng nhóm theo ngày: lệnh ghi / sửa kết quả, khôi phục, luật nhập 4, hộp 6c.
   - Cuộc gặp Đã gặp **giữ nhóm** mang ngày trước ngày tạo KH ghi / khôi phục / nhập được như trước #616 (DR-43 / K2: nhập bù hợp lệ).
   - Cuộc gặp **đổi nhóm** trước ngày tạo vẫn bị D10 như DR-43 đã ghi.
   - Hộp 6c đi từ nhóm tạo KH; không còn câu "Ngày chuyển trước lần đổi nhóm gần nhất (<ngày tạo KH>)" cho ca giữ nhóm.
   - Spec Phase 3 §4 dòng `recordMeetingOutcome` thêm ca trước ngày tạo (G2: Owner đã duyệt Q1 (a) ngày 17/10/2026).
2. **E20 theo thứ tự ghi (DR6-69):** E20 so thứ tự ghi của chuyển nhóm (`seq`) thay cho mốc thời gian `created_at`. Đúng cả khi hai máy lệch giờ (xuất / nhập), hai bản ghi cùng mili giây, đồng hồ lùi, và file có mốc không phần nghìn giây.
3. **Khôi phục chuyển nhóm đúng KH (DR6-71):**
   - Khôi phục cuộc gặp chỉ đưa lại chuyển nhóm của chính KH của cuộc hẹn đó.
   - Luật nhập 4 xét cả chuyển nhóm đã rút có `appointment_id`: KH của chuyển nhóm phải là KH của cuộc hẹn.
4. **Test hở (DR6-87):** ca giữ nhánh "0 khi KH đã là của RE đó" của xem trước bàn giao (R16).

##### Bối cảnh

Deep review Phase 1–6 lượt 2 (T-225 #565), nhóm **L2-A**. Owner 17/10/2026: Phương án 3 (sửa hết), đồng ý đề xuất Q1 (a). DR6-68 là Medium duy nhất còn chặn v1.0 (spec Phase 6 §1 mục 3). Nó là hồi quy của #616 (T-232): `applyOutcome` so "nhóm sau" với nhóm tại ngày cuộc hẹn, mà trước ngày tạo thì không có nhóm nào. K18 ("nhóm của KH tại ngày cuộc hẹn") và DR-43 mâu thuẫn ở ca này; Q1 (a) chốt cách gộp hai quyết định. Dữ liệu giả lập: nạp lại nếu luật nhập đổi (K1).

##### Tài liệu cần đọc

- `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` §5.1 (DR6-68), §6.1 (DR6-69, 71), §6.6 (DR6-87), §8.2 L2-A, §9 Q1
- `docs/design/phase-3-du-lieu.md` §4 (dòng `recordMeetingOutcome`, D10)
- `docs/design/phase-6-hoan-thien.md` §4.2 (TR-3, E18–E20)
- `docs/state/review-notes.md` mục DR-43 (ACCEPTED 06/10)
- `packages/db/src/customers.ts` (`stageOnDay`, `isStageOfDay`, `appendTransition`, `checkTransition`, `reinstateTransition`, `previewHandover`)
- `packages/db/src/appointments.ts` (`applyOutcome`, khôi phục cuộc gặp), `packages/db/src/backup-validation.ts` (luật 4)
- `apps/desktop/src/routes/appointments/outcome-form.ts` (`meetingDay`), `OutcomeDialog.tsx`

##### File / thư mục được phép sửa

- `packages/db/src/{customers,appointments,backup-validation}.ts` và test cạnh chúng (`*.test.ts`, `trash.test.ts`, `backup-invariants.test.ts`)
- `apps/desktop/src/routes/appointments/{outcome-form.ts,outcome-form.test.ts,OutcomeDialog.tsx}`
- `apps/desktop/src/i18n/vi.ts` (chỉ khi câu lỗi đổi)
- `e2e/appointment-outcome.spec.ts`
- `docs/design/phase-3-du-lieu.md` (dòng `recordMeetingOutcome`), `docs/design/phase-6-hoan-thien.md` (E20 nếu chữ đổi)

##### Interface / hợp đồng

- `checkTransition` nhận mốc thứ tự (`afterSeq`) thay mốc thời gian; mã lỗi giữ nguyên.
- Không đổi schema, không migration.

##### Test chấp nhận

- [ ] Ca CL2-A1: KH tạo N3 ngày 10/10, lịch 05/10, Đã gặp giữ N3 → nhận ở lệnh, ở khôi phục sau khi xóa, và ở nhập backup. Đổi nhóm (N2) cùng ngày → vẫn D10.
- [ ] Hộp 6c của lịch trước ngày tạo: ô nhóm đi từ nhóm tạo KH, Lưu giữ nhóm thành công (unit `outcome-form` + e2e ghi bù).
- [ ] E20: `created_at` đảo thứ tự so với `seq`, hoặc bằng nhau → kết quả theo `seq`; mốc không phần nghìn giây không đổi kết quả.
- [ ] File có cuộc hẹn của KH X trỏ tới chuyển nhóm đã rút của KH Y → nhập bị từ chối (luật 4); khôi phục không đổi nhóm / RF của KH khác.
- [ ] Đột biến R16 (`previewHandover` trả 1 khi KH đã là của RE đó) có test đỏ.

Ước lượng: ≈ 25–35 dòng SP + ≈ 150 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med

##### Bị chặn bởi

Không

## PR #666 — fix: meetings before the customer's creation, E20 by seq, restore the right customer (T-248)

Trạng thái: MERGED · merge 2026-10-17T13:16:17Z · commit `d6c2350fd66ff7492642a1a26980cac2996a8f34` · nhánh `task/T-248-meeting-before-creation`

Closes #652

#### Thay đổi

T-248, nhóm L2-A của deep review Phase 1–6 lượt 2: DR6-68 (Medium, hồi quy do #616), 69, 71, 87. Owner đã duyệt Q1 (a) ngày 17/10/2026 (G2).

- **Cuộc gặp trước ngày tạo KH (DR6-68, Q1 (a))**
  - Trước ngày tạo KH, "nhóm của ngày" = nhóm tạo KH (transition đầu). Áp ở `stageOnDay` (lệnh ghi / sửa kết quả), `isStageOfDay` (khôi phục, luật nhập 4) và `meetingDay` (hộp 6c / 6f).
  - Cuộc gặp Đã gặp **giữ nhóm** trước ngày tạo ghi, khôi phục và nhập lại được như trước #616 (DR-43). **Đổi nhóm** ở ngày đó vẫn bị D10 (`TRANSITION_BEFORE_LATEST`, nêu ngày tạo KH), như DR-43 / DR-64 đã ghi.
  - Hộp 6c / 6f: ô "Nhóm sau cuộc gặp" đi từ nhóm tạo KH và **khóa** ở đó, như mọi ca có chuyển nhóm sau ngày cuộc hẹn (T-232: hộp không đưa lựa chọn mà lệnh sẽ từ chối). Dòng khóa bỏ câu "Nhóm của KH đã đổi tiếp sau cuộc gặp này…" khi cái đến sau chỉ là việc tạo KH, nên không còn gọi ngày tạo KH là một lần đổi nhóm. Không thêm khóa i18n mới.
- **E20 theo thứ tự ghi (DR6-69):** `checkTransition` nhận `afterSeq` (seq của chuyển nhóm mà lần xóa đã rút) thay mốc thời gian `recordedAfter`. Mã lỗi giữ nguyên. Hai máy lệch giờ, cùng mili giây, đồng hồ lùi hay mốc không phần nghìn giây không còn đổi kết quả khôi phục.
- **Khôi phục chuyển nhóm đúng KH (DR6-71)**
  - `transitionWithdrawnAt` chỉ tìm chuyển nhóm đã rút của chính KH của cuộc hẹn. Chuyển nhóm của KH khác thì như không có, nên khôi phục không đổi nhóm / RF của KH khác.
  - Luật nhập 4 kiểm mọi chuyển nhóm có `appointment_id`, kể cả đã rút: KH của chuyển nhóm phải là KH của cuộc hẹn. Phép so "cùng KH" của chuyển nhóm sống gộp vào phép kiểm này, không kiểm hai lần.
- **Test hở R16 (DR6-87):** `previewHandover` trả 0 khi KH đã là của RE đó, cả khi KH có lịch Dự kiến của RE khác.
- **Spec**
  - Phase 3 §4, dòng `recordMeetingOutcome`: thêm ca trước ngày tạo KH (lệnh + hộp 6c / 6f).
  - Phase 3 §6 luật 4: thêm chuyển nhóm đã rút và nhóm đầu ngày trước ngày tạo KH. Issue chỉ ghi dòng `recordMeetingOutcome`, nhưng luật nhập đổi theo mục tiêu 1 và 3 của Issue nên spec phải sửa theo.
  - Phase 6 TR-3: "sau lúc xóa" tính theo `seq`, không theo đồng hồ.
- Không đổi schema, không migration. Dữ liệu giả lập không đổi (`DEMO_HASH` giữ nguyên). Luật nhập chỉ chặt hơn với file sửa tay (chuyển nhóm đã rút trỏ cuộc hẹn của KH khác), nên không cần nạp lại.

##### Ngoài phạm vi (có từ trước, không đổi)

Hai cuộc gặp cùng ngày, R rồi X, mỗi cuộc gặp một chuyển nhóm. Xóa R, ghi X, xóa X, khôi phục R (lấy lại chuyển nhóm cũ của R với `seq` cũ), rồi khôi phục X. X được khôi phục với "nhóm trước" khác lúc xóa, dù chuyển nhóm của R được ghi lại sau lúc xóa X. Cả cách so `created_at` cũ lẫn `seq` đều không bắt ca này. Ca hiếm, nên ghi vào sổ ghi chú review nếu phiên review thấy cần.

#### Test chấp nhận

- [x] Ca CL2-A1: KH tạo N3 ngày 10/09, lịch 05/09. Đã gặp giữ N3 được nhận ở lệnh, ở khôi phục sau khi xóa, và ở nhập backup. Đổi N2 cùng ngày vẫn D10 (`appointments.test.ts` "keeps a meeting met before the customer was created…"). Luật nhập: nhận ca giữ nhóm tạo KH, từ chối nhóm khác trước ngày tạo (`backup-invariants.test.ts`).
- [x] Hộp 6c của lịch trước ngày tạo: ô nhóm đi từ nhóm tạo KH và khóa ở đó, Lưu giữ nhóm thành công (unit `meetingDay`; e2e "a meeting held before the customer was entered keeps the stage it was created in"). E2E đỏ khi gỡ phần sửa UI.
- [x] E20: `created_at` của chuyển nhóm ghi sau lúc xóa đặt sớm hơn / bằng lúc xóa → vẫn chặn. `created_at` của chuyển nhóm ghi trước lúc xóa đặt muộn hơn / không phần nghìn giây → không chặn (`trash.test.ts`, 4 ca).
- [x] File có chuyển nhóm đã rút của KH Hoa trỏ tới cuộc hẹn của KH Lan → nhập bị từ chối, luật 4. Khôi phục trên DB có dữ liệu đó → `STAGE_NOT_ON_DAY`, nhóm / chuyển nhóm của KH khác không đổi (`appointments.test.ts` "DR6-71…").
- [x] Đột biến R16 (bỏ nhánh "0 khi KH đã là của RE đó") làm `customers.test.ts` đỏ (`expected 1 to be +0`), đã thử trên máy.

Trước khi sửa, 9 test mới đều đỏ.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] `pnpm e2e` toàn bộ xanh ở local (228 test)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med` → Owner bảo merge (`--owner`).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #653 — T-249: Hộp 6f nêu hậu quả, chữ Thùng rác, luật D7 một nơi (DR6-70, 91, 93, 94, 95, 99, 103)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

1. **Hộp 6f nêu hậu quả khi dời ngày làm rút chuyển nhóm (DR6-70) — Q6 (a).** Dời ngày một cuộc gặp **đã chuyển nhóm** (vd. N3 → N2, tính RF) qua một lần đổi nhóm khác thì Lưu sẽ rút chuyển nhóm và RF của nó. Trước khi Lưu, hộp nói rõ hậu quả như hộp 6g, vd. "Khi lưu: Nhóm KH N2 → về N3 (hủy chuyển nhóm 15/09) · RF bớt 1". Tiêu đề hộp không còn ghi "N3 → N2 · RF" sau khi chuyển nhóm đã bị rút.
2. **Chữ Thùng rác (DR6-93, 94) — Q7 (a):**
   - Dòng Thùng rác của cuộc gặp giữ nhóm ghi "nhóm sau N3 · không đổi nhóm KH" (như TR-3 và mục tiêu #592).
   - Câu chặn E20 khi ngày đổi nhóm trùng ngày cuộc hẹn đổi thành "Nhóm KH đã đổi ngày 15/09/2026, ghi sau lúc xóa cuộc hẹn này — …" (bỏ chữ "sau ngày cuộc hẹn", sai theo nghĩa thường).
   - Spec TR-3 / E20 sửa theo (G2: Owner duyệt Q7 (a) ngày 17/10/2026). Mockup 11 sửa chữ cho khớp, và **ví dụ E7 cũ ở 11c** đổi theo E7 hiện hành (DR6-95): chuyển tay ngày sau → chặn như E6.
3. **Tên nút khôi phục HĐ (DR6-99):** thêm FYP như dòng "Bản ghi", để hai HĐ cùng KH nộp cùng ngày không trùng tên.
4. **Luật D7 mở rộng ở một chỗ (DR6-103):** luật "cuộc gặp giữ nhóm sau giữ chuyển nhóm" đang viết ba nơi (lệnh, `fillTrash` của seed, `outcomeLock` của màn). Gom về một hàm thuần dùng chung.
5. **Test hở gói E (DR6-91):** mỗi đột biến sống có test đỏ:
   - N1, N2, R04g: ba nhánh "giữ nhóm" của 6c / 6f.
   - R38c–e: phần nối DR6-38 ở 6f / 6h / 8a–8d (e2e `page.clock` qua giao thừa).
   - R43e: `headerHidden` cột nút Thùng rác.

##### Bối cảnh

Deep review Phase 1–6 lượt 2 (T-225 #565), nhóm **L2-B1** (+ DR6-95, 103 theo Phương án 3 — Owner 17/10/2026 "sửa hết"). Làm sau L2-A vì cùng luật nhóm tại ngày cuộc gặp và cùng `outcome-form.ts`.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` §3.1, §6.1 (DR6-70), §6.6 (DR6-91), §6.7 (DR6-93, 94, 95, 99, 103), §8.2 L2-B1, §9 Q6, Q7
- `docs/design/phase-6-hoan-thien.md` §4.2 (TR-3, E7, E20), `docs/design/phase-3-du-lieu.md` D7
- `docs/design/mockups/appointment-forms.html` (6f, 6g), `docs/design/mockups/trash.html` (11a, 11c)
- `apps/desktop/src/routes/appointments/{EditOutcomeDialog.tsx,outcome-form.ts}`, `apps/desktop/src/routes/{trash-view.ts,SettingsTrash.tsx}`
- `packages/db/src/{appointments,trash,seed}.ts` (D7, `fillTrash`)

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/appointments/{EditOutcomeDialog.tsx,OutcomeDialog.tsx,outcome-form.ts}` + test
- `apps/desktop/src/routes/{trash-view.ts,SettingsTrash.tsx}` + test, `apps/desktop/src/i18n/vi.ts`
- `packages/db/src/{appointments,trash,seed}.ts` + test; `packages/domain/src/**` (chỉ nếu hàm D7 chung đặt ở đó) + test
- `e2e/{appointment-outcome,customer-policies,trash,appointments}.spec.ts`
- `docs/design/phase-6-hoan-thien.md` (TR-3, E20), `docs/design/mockups/trash.html`
- `CLAUDE.md` codemap của package có export đổi (sinh bằng `pnpm codemap`)

##### Interface / hợp đồng

- Không đổi schema, không đổi mã lỗi; params của câu chặn E20 có thể thêm cờ "cùng ngày".

##### Test chấp nhận

- [ ] Ca CL2-E1 trên màn: hộp 6f hiện hậu quả (nhóm KH về, RF bớt 1) trước khi Lưu; Lưu xong khớp câu đã hiện.
- [ ] Dòng Thùng rác cuộc gặp giữ nhóm có "không đổi nhóm KH"; câu chặn E20 cùng ngày đúng chữ mới.
- [ ] Hai HĐ cùng KH, cùng ngày nộp, khác FYP → hai tên nút khác nhau.
- [ ] Luật D7 mở rộng chỉ còn một nơi định nghĩa; lệnh, seed và màn cho cùng kết quả trên dữ liệu seed.
- [ ] Mỗi đột biến N1, N2, R04g, R38c–e, R43e có test đỏ.

Ước lượng: ≈ 30–45 dòng SP (DR6-103 bớt ≈ 15) + ≈ 150 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med

##### Bị chặn bởi

#652

## PR #667 — fix: say what 6f takes back, trash wording, one D7 rule (T-249)

Trạng thái: MERGED · merge 2026-10-17T14:10:25Z · commit `d0a97ec9b02ed66c8f0d02141b7ca45086aa8960` · nhánh `task/T-249-outcome-trash-d7`

Closes #653

#### Thay đổi

T-249, nhóm L2-B1 của deep review Phase 1–6 lượt 2: DR6-70, 91, 93, 94, 95, 99, 103. Owner đã duyệt Q6 (a), Q7 (a) ngày 17/10/2026 (G2 / G3).

- **Hộp 6f nêu hậu quả (DR6-70, Q6 (a))**
  - Khi Lưu sẽ rút chuyển nhóm của chính cuộc gặp mà không ghi chuyển nhóm nào thay, hộp hiện khung "Khi lưu" với đúng hai dòng của hộp 6g: `Nhóm KH N2 → về N3 (hủy chuyển nhóm 15/09)` và `RF bớt 1 (N3 → N2 tính RF)` (hoặc "không đổi (… không tính RF)"). Phần chữ và `dl` dùng chung với 6g (`DeleteAppointmentDialog.tsx`), chỉ thêm một khóa i18n `outcomeEdit.onSave`.
  - Luật hiện khung là hàm thuần `undoneMove` (`outcome-form.ts`): cuộc gặp có chuyển nhóm, chưa bị khóa D7, và kết quả mới không còn chuyển nhóm — trạng thái khác Đã gặp, hoặc nhóm sau = nhóm đầu của ngày (tự giữ khi dời ngày qua một lần đổi nhóm khác, hay tự chọn "giữ nguyên").
  - **Rộng hơn câu chữ của Issue:** khung cũng hiện khi đổi trạng thái Đã gặp → Hủy / Không đến, và khi tự chọn nhóm sau "giữ nguyên" cho cuộc gặp đã chuyển nhóm. Ba ca này Lưu đều rút chuyển nhóm và RF y như ca dời ngày, mà trước đây hộp cũng không nói. Dùng một luật chung thì gọn hơn tách riêng ca dời ngày. Ca chọn nhóm sau khác (ghi chuyển nhóm mới thay) thì không hiện khung: dòng đọc lại có sẵn đã nêu chuyển nhóm mới và RF. **Owner quyết 17/10/2026: giữ khung "Khi lưu" cho mọi ca rút chuyển nhóm như PR này làm.**
  - Tiêu đề hộp vẫn tả kết quả đang lưu. Lưu xong, mở lại thì tiêu đề không còn "N3 → N2" (e2e kiểm).
- **Chữ Thùng rác (DR6-93, 94, 99, Q7 (a))**
  - Dòng của cuộc gặp giữ nhóm (không bị chặn): `nhóm sau N3 · không đổi nhóm KH`.
  - Câu chặn E20, khi ngày đổi nhóm trùng ngày cuộc hẹn: `Nhóm KH đã đổi ngày 15/09/2026, ghi sau lúc xóa cuộc hẹn này — không ghi chuyển nhóm lùi ngày (D10).` Màn so `params.date` với ngày của lịch, nên không đổi mã lỗi hay params của lệnh. Hộp khôi phục dùng cùng hàm nên cũng ra câu này khi lệnh từ chối.
  - Tên nút khôi phục HĐ có FYP như dòng "Bản ghi": `Khôi phục HĐ nộp 15/09/2026 · 24.000.000 ₫ của KH …`.
- **Luật D7 mở rộng một nơi (DR6-103):** hàm thuần `meetingKeepingMove` (`packages/db/src/customers.ts`) thay ba bản viết riêng: lệnh (`withdrawAppointmentTransition`, bỏ câu SQL lọc riêng), `fillTrash` của seed, `outcomeLock` của màn. `isStageOfDay` không còn ở API công khai của `@p2c/db` vì app không dùng nữa.
  - 6f: phần "nhóm bắt đầu" (`kept`) tách thành hàm thuần `editedDay`, có test.
- **Spec / mockup (G2 / G3 theo Q7 (a))**
  - `phase-6-hoan-thien.md` TR-3, E18, E20: chữ dòng Thùng rác và câu E20 mới.
  - `trash.html`: 11a thêm dòng mẫu cuộc gặp giữ nhóm (`… 5 bản ghi khác`, tổng vẫn 14); 11c ví dụ E7 theo E7 hiện hành (chuyển tay **cùng ngày** 02/10, ghi sau khi xóa; ngày sau thì chặn như E6, DR6-95); 11d thêm câu E20. Mục lục dòng ở đầu file cập nhật.
- Không đổi schema, không migration, không đổi dữ liệu giả lập.

#### Test chấp nhận

- [x] Ca CL2-E1 trên màn: KH N4 chuyển tay N3 hôm nay, cuộc gặp hôm nay N3 → N2; 6f gõ ngày 14/9 → nhóm sau khóa N4, khung "Khi lưu" nêu `N2 → về N3 (hủy chuyển nhóm 15/09)` và `bớt 1 (N3 → N2 tính RF)`; Lưu xong chi tiết `14/09/2026 · …`, `Giữ N4`, hồ sơ N3, mở lại không còn khung và "N3 → N2" (e2e `appointment-outcome.spec.ts` "…(DR6-70)").
- [x] Dòng Thùng rác của cuộc gặp giữ nhóm có "không đổi nhóm KH" (unit + e2e E18 `trash.spec.ts`). Câu chặn E20 cùng ngày đúng chữ mới (unit, và một ca trên DB thật: chuyển tay cùng ngày sau khi xóa).
- [x] Hai HĐ cùng KH, cùng ngày nộp, khác FYP → hai tên nút khác nhau (`trash-view.test.ts`).
- [x] Luật D7 mở rộng chỉ còn `meetingKeepingMove`. Test trên dữ liệu seed có Thùng rác (`outcome-form.test.ts`): với mọi cuộc gặp có chuyển nhóm, khóa của màn (`outcomeLock`) trùng đúng lỗi của lệnh xóa (chạy trong transaction rồi rollback), gồm cả `params.date`; dữ liệu có đủ ba loại (`TRANSITION_NOT_LATEST`, `STAGE_KEPT_BY_MEETING`, xóa được). Seed dùng cùng hàm để chọn lịch xóa; chọn sai thì seed ném lỗi ở chính test này.
- [x] Mỗi đột biến có test đỏ, đã áp tạm từng cái trên máy rồi chạy:
  - N1 (bỏ `kept !== ended`), N2 (`heldStage` bỏ ca cuộc gặp sau), R04g (6f không đi từ nhóm đã giữ) → `outcome-form.test.ts` đỏ.
  - R38c (6f), R38d (6h), R38e (8a–8d bỏ `opened`) → ba ca e2e `page.clock` qua giao thừa đỏ (6f, 6h ở `appointment-outcome.spec.ts`, 8b ở `customer-policies.spec.ts`).
  - R43e (bỏ `headerHidden`) → `trash.spec.ts` đỏ (tiêu đề cột nút rộng ≤ 1 px).
  - Thêm: gỡ khung 6f, gỡ chữ "không đổi nhóm KH", gỡ nhánh E20, và 6 đột biến của `meetingKeepingMove` → đều đỏ.

Ghi chú e2e: build e2e ghim ngày 15/09/2026, nên ca giao thừa tua đồng hồ 107 ngày tới 31/12 23:58. Một lần `page.clock.fastForward` quá 2³² ms (≈ 49,7 ngày) bị quay vòng (thử ra app ở 23/09), nên test tua từng bước 20 ngày.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] `pnpm e2e` toàn bộ xanh ở local (232 test)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Cỡ: ≈ 190 dòng thêm / 95 dòng bớt ở code sản phẩm (phần lớn là chuyển phần chữ 6g thành dùng chung và gom luật D7), ≈ 700 dòng tổng diff.

Rủi ro: `risk:med` → Owner bảo merge (`--owner`).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #654 — T-250: Màn nhập liệu: link dài, hộp 9b đếm như lệnh, cuộn về đầu, tiền KYC (DR6-80, 81, 82, 90, 101)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

1. **Link dài tràn cột ở hồ sơ 3 cột (DR6-82, hồi quy của DR6-30).** Chữ ghi chú KYC, dòng dữ kiện và dòng trích xuất được ngắt dòng ở chuỗi liền dài (`overflow-wrap`). Cột hồ sơ có `min-w-0`. Link Facebook / Zalo dài không tràn sang cột KYC Intelligence.
2. **Hộp 9b đếm như lệnh, nêu KH trong Thùng rác (ghi chú review #636, Owner 17/10/2026).**
   - Hiện nay xóa KH xong, RE / người phối hợp / người đánh giá của KH đó vẫn bị lệnh từ chối `PERSON_IN_USE`: lệnh đếm lịch hẹn và HĐ của KH đã xóa (chúng chỉ ẩn theo KH). Hộp 9b đếm từ danh sách đã bỏ KH xóa, nên nút Xóa bật rồi báo lỗi bằng câu chỉ nói về RE.
   - Sửa: hộp 9b lấy số từ cùng một hàm với lệnh (gồm dữ liệu của KH trong Thùng rác). Có KH trong Thùng rác thì câu nêu tên KH đó và cách gỡ: khôi phục rồi bàn giao KH, hoặc dọn Thùng rác (sau T-258).
   - Không đổi luật của lệnh: khôi phục KH chỉ kiểm RE, nên cho xóa người phối hợp trước sẽ làm khôi phục đưa về lịch trỏ tới nhân sự đã xóa.
   - `error.PERSON_IN_USE` nói theo vai (không chỉ RE).
3. **Câu hộp 9b cho người hỗ trợ (DR6-80) — Q5 (a).** Vế "bỏ khỏi người đánh giá kết quả (ở Sửa kết quả)" chỉ hiện khi có lịch người đó đánh giá. Với người phối hợp: "Người phối hợp của lịch Dời lịch / Dự kiến không đổi được — giữ lại thay vì xóa". Sửa luôn ghi chú review #636 cùng hộp: RE vừa có KH vừa phối hợp thấy hai câu hướng dẫn, mockup 9b chỉ có một.
4. **Đổi màn về đầu trang (DR6-81).** Mở màn khác (vd. hồ sơ KH từ bảng Khách hàng đã cuộn) thì khung nhìn về đầu, trừ khi quay về đúng thẻ vừa xem.
5. **Đọc lại tiền KYC trên chữ đã chuẩn hóa (DR6-101).** Dòng đọc lại tiền ở 7b / 7c / 3f gọi `parseVnd` trên chữ đã qua `normalizeText`, như lệnh (K20).
6. **Test hở (DR6-90).**
   - Hai hộp Xóa (team, nhân sự) giữ nút Xóa khi `DATA_REPLACING` (`retriesDelete`).
   - Khung lỗi lưu 7a mất khi gõ (R33c–e).
   - BR3 của DR6-62: `block-reload.test.ts` dùng selector thật thay `closest` giả.
   - Gộp ghi chú review #636 ở hộp 7a: các nhánh lỗi của `add()` không xóa lỗi Ngày / Ghi chú đang hiện.

##### Bối cảnh

Deep review Phase 1–6 lượt 2 (T-225 #565), nhóm **L2-F** (Phương án 3, Owner 17/10/2026). Mục 2 do Owner thêm 17/10 sau khi làm rõ luật xóa / Thùng rác. Đã có trong `docs/state/review-notes.md` (ghi chú review PR #636), chưa có Issue. Phiên tổng hợp chạy lại: RE có KH duy nhất trong Thùng rác → `PERSON_IN_USE`; IS chỉ đánh giá cuộc gặp của KH đó → `PERSON_IN_USE`. L2-B2 (focus) làm sau Issue này vì cùng `KycDialogs.tsx`.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` §6.4 (DR6-80, 81, 82), §6.6 (DR6-90), §6.7 (DR6-101), §8.2 L2-F, §9 Q5
- `docs/state/review-notes.md` mục "Ba ghi chú không chặn của review PR #636"
- `docs/design/mockups/team.html` (9b), `docs/design/mockups/customer.html` (hồ sơ 3 cột)
- `docs/design/phase-6-hoan-thien.md` §4.2 (TR-2, TR-4)
- `packages/db/src/team.ts` (`isPersonInUse`, `ownsLiveRecords`), `packages/db/src/appointments.ts` (`listAppointments`)
- `apps/desktop/src/routes/team/{PersonDialogs.tsx,team-view.ts,TeamScreen.tsx}`
- `apps/desktop/src/routes/customers/{CustomerProfile,KycExtraction,CustomerKyc,KycDialogs}.tsx`, `apps/desktop/src/shell/AppShell.tsx`, `apps/desktop/src/shell/block-reload.test.ts`

##### File / thư mục được phép sửa

- `packages/db/src/team.ts` + test (hàm đếm dùng chung với hộp 9b; luật lệnh không đổi), `packages/db/CLAUDE.md` (codemap)
- `apps/desktop/src/routes/team/{PersonDialogs.tsx,team-view.ts,TeamScreen.tsx,TeamDialogs.tsx}` + test
- `apps/desktop/src/routes/customers/{CustomerProfile,KycExtraction,CustomerKyc,KycDialogs}.tsx` + file view / test cạnh chúng
- `apps/desktop/src/shell/{AppShell.tsx,block-reload.test.ts}`, `apps/desktop/src/i18n/vi.ts`
- `e2e/**` (spec của hồ sơ KH, KYC, team)
- `docs/state/review-notes.md` (chuyển các ghi chú #636 đã sửa sang RESOLVED)

##### Interface / hợp đồng

- `@p2c/db` thêm một hàm đọc "nhân sự đang được dùng ở đâu" (số + tên KH trong Thùng rác), lệnh xóa và hộp 9b cùng dùng.

##### Test chấp nhận

- [ ] Link 108 ký tự trong ghi chú KYC không tràn cột ở 1 440 và 1 100 (e2e, đo hộp chữ).
- [ ] RE / IS chỉ còn dữ liệu của KH trong Thùng rác: hộp 9b khóa Xóa, câu nêu tên KH đó; lệnh vẫn từ chối; khôi phục KH vẫn được.
- [ ] Câu 9b của người hỗ trợ đúng Q5 (a); RE vừa phối hợp chỉ thấy một câu hướng dẫn.
- [ ] `scrollY === 0` sau khi mở hồ sơ từ bảng Khách hàng đã cuộn.
- [ ] "6" + U+200B + "tỷ" có dòng đọc lại như lệnh lưu.
- [ ] Đột biến `retriesDelete` hai hộp, R33c–e, BR3, nhánh lỗi `add()` của 7a có test đỏ.

Ước lượng: ≈ 35–60 dòng SP + ≈ 150 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #669 — fix: 9b counts as the delete does, long text breaks, new screens open at the top (T-250)

Trạng thái: MERGED · merge 2026-10-17T15:11:26Z · commit `1f71029dd6d778c840e7f28a84d666edd9e3ccbb` · nhánh `task/T-250-input-screens`

Closes #654

#### Thay đổi

T-250, nhóm L2-F của deep review Phase 1–6 lượt 2: DR6-80, 81, 82, 90, 101, cùng ba ghi chú review PR #636. Owner đã chọn Q5 (a) và thêm mục 2 ngày 17/10/2026.

- **Hộp 9b đếm như lệnh (mục 2, Owner 17/10)**
  - `@p2c/db` có thêm `personUsage(db, id)`: số KH / lịch hẹn / HĐ là RE, số lịch là người phối hợp, số lịch là người đánh giá, và **tên các KH trong Thùng rác** có dữ liệu trong các số đó (xếp theo `byName`). `softDeletePerson` và hộp 9b cùng gọi hàm này (`isPersonInUse(usage)`), nên hộp khóa Xóa đúng khi lệnh từ chối.
  - Luật của lệnh không đổi: vẫn đếm lịch / HĐ chưa xóa của KH đã xóa. `updatePerson` cũng đọc từ `personUsage` thay ba hàm riêng (`ownsLiveRecords`, `coordinatesLiveAppointment`, `reviewsLiveAppointment`), điều kiện giữ nguyên.
  - Màn Team thôi đếm từ bảng của màn (`personUsage` của `team-view.ts` bỏ; bảng đó không có lịch của KH đã xóa nên hộp để Xóa bật rồi lệnh từ chối).
  - Có KH trong Thùng rác thì thêm một câu nêu tên KH và cách gỡ:
    - RE: `Có cả dữ liệu của KH đã xóa: Lan. Khôi phục KH ở Cài đặt → Thùng rác rồi chuyển sang RE khác.`
    - Người hỗ trợ: `Có cả lịch hẹn của KH đã xóa: Lan. Khôi phục KH ở Cài đặt → Thùng rác thì mới sửa được các lịch đó.`
    - Nêu tối đa 3 tên, còn lại `… và 2 KH khác`.
  - `error.PERSON_IN_USE` nói theo vai: một câu cho cả hai đường dùng chung mã này (RE còn dữ liệu đổi vai, xóa nhân sự còn được dùng), nêu cả RE, người phối hợp, người đánh giá.
- **Câu hướng dẫn 9b (DR6-80, Q5 (a); ghi chú #636)** — hàm thuần `inUseHelp` (`team-view.ts`), chỉ một câu theo vai:
  - Còn dữ liệu là RE (KH / lịch / HĐ): chỉ câu của RE như mẫu 9b, kể cả khi người đó cũng phối hợp.
  - Chỉ đánh giá: `Bỏ nhân sự này khỏi người đánh giá kết quả của các lịch đó (ở Sửa kết quả) trước, hoặc giữ lại thay vì xóa.`
  - Chỉ phối hợp: `Người phối hợp của lịch Dời lịch / Dự kiến không đổi được — giữ lại thay vì xóa.`
  - Cả hai: hai vế trên trong một câu.
- **Chữ liền dài (DR6-82):** ba cột hồ sơ có `min-w-0`. Chữ ghi chú KYC, dòng dữ kiện, dòng đề xuất trích xuất và dòng chữ cuộc gặp trong Dòng thời gian dùng `wrap-anywhere` (`overflow-wrap: anywhere`).
- **Đổi màn về đầu trang (DR6-81):** `useScreenFocus` gọi `window.scrollTo(0, 0)` trước khi focus `h1`. Về Khách hàng đúng thẻ vừa xem thì vẫn focus thẻ đó (trình duyệt cuộn tới thẻ).
- **Đọc lại tiền KYC (DR6-101):** `kycAmountRead` đọc `parseVnd(normalizeText(text))`, như lệnh lưu. Hàm này dùng chung cho 7b / 7c / 3f.
- **7a (ghi chú #636):** các nhánh lỗi của `add()` chỉ thay lỗi dữ kiện (`setFactError`), lỗi Ngày / Ghi chú đang hiện giữ nguyên.
- `docs/state/review-notes.md`: ba ghi chú #636 sang RESOLVED. Phần "lọc theo `reId` lặp ở `staffMetrics` và `personUsage`" của ghi chú #144 bỏ, vì màn không còn `personUsage`.

##### Lệch so với Issue / mockup

- `packages/db/src/index.ts` không có trong danh sách file của Issue. Phải sửa để export `personUsage`, `isPersonInUse`, `PersonUsage`, theo mục "Interface / hợp đồng".
- Câu Thùng rác chưa có vế "hoặc dọn Thùng rác", vì chức năng dọn chưa có. T-258 (#662) thêm vế này vào `person.inUseTrash` / `person.inUseSupportTrash` (`vi.ts` có trong danh sách file của #662).
- Mẫu 9b (`team.html`) chưa có dòng câu Thùng rác. Đây là câu Owner thêm 17/10; hình thức như câu hướng dẫn (chữ nhỏ dưới khung đỏ).
- Ngắt dòng làm thêm ở dòng chữ cuộc gặp trong Dòng thời gian. Cùng lỗi, review gợi ý ("có thể cả các ô note của dòng thời gian").
- Màn Khách hàng luôn mở lại ở Kanban (có từ trước). Vì vậy "về thẻ vừa xem" chỉ đúng khi thẻ đó còn hiện; e2e kiểm trên Kanban.
- Ở 1 100 px trang hết cuộn ngang. Lượt 2 đo thấy cuộn ngang ở cả hai bản; e2e nay kiểm cả điều này.

#### Test chấp nhận

- [x] Link 108 ký tự trong ghi chú KYC (và cùng link làm giá trị dữ kiện) không tràn thẻ ở 1 440 và 1 100; đo từng `Range` của nút chữ so với mép phải thẻ; trang không cuộn ngang (`customer-kyc.spec.ts` "a link of 108 characters…").
- [x] RE / IS chỉ còn dữ liệu của KH trong Thùng rác:
  - unit `team.test.ts`: `personUsage` đếm và nêu tên KH; lệnh vẫn `PERSON_IN_USE` cho RE, TL (phối hợp), IS (đánh giá); khôi phục KH vẫn được.
  - e2e `team.spec.ts` "…kept only by a customer in the trash…": hộp 9b khóa Xóa, `1 lịch hẹn, 0 HĐ ghi cho RE này` / `1 lịch hẹn là người đánh giá kết quả`, câu nêu tên KH; khôi phục KH ở Thùng rác được.
- [x] Câu 9b của người hỗ trợ đúng Q5 (a); RE vừa phối hợp chỉ thấy một câu (`team-view.test.ts` `inUseHelp`; e2e ba ca 9b sửa theo câu mới).
- [x] `scrollY === 0` sau khi mở hồ sơ từ bảng Khách hàng đã cuộn tới cuối, và sau khi sang màn khác từ hồ sơ đã cuộn; về Khách hàng thì thẻ vừa xem được focus và nằm trong khung nhìn (`navigation.spec.ts` "…(DR6-81)").
- [x] "6" + U+200B + "tỷ" → `6.000.000.000 ₫ (6 tỷ)` (`kyc-view.test.ts`).
- [x] Mỗi đột biến có test đỏ. Đã áp tạm từng cái trên máy, chạy, rồi trả file nguyên byte:
  - `retriesDelete` bị bỏ ở hộp Xóa team (R33c) / hộp Xóa nhân sự (R33d) → e2e "both delete dialogs…" đỏ (`asExe`, `holdBackup`, Nạp lại đang chạy).
  - Gõ ghi chú / gõ ngày không xóa khung lỗi lưu 7a (R33e, hai đột biến) → e2e "the frame of a refused save…" đỏ. Lỗi lưu là `INVALID_TEXT` từ nửa surrogate lẻ, như khi dán.
  - BR3 (bỏ `checkbox` khỏi selector) và bỏ `textarea` → `block-reload.test.ts` đỏ. Test nay chạy selector thật qua bộ so khớp nhỏ (tag, `[a]`, `[a="v"]`, `:not(…)`; selector lạ thì ném lỗi), không còn `closest` giả.
  - Nhánh lỗi `add()` của 7a xóa lỗi Ngày → e2e "a fact's error leaves those of the note and its day shown" đỏ.
  - Thêm: bỏ `scrollTo` → e2e DR6-81 đỏ; bỏ `wrap-anywhere` ở chữ ghi chú hay ở dòng dữ kiện → e2e link 108 ký tự đỏ.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (2 930 unit)
- [x] `pnpm e2e` toàn bộ xanh ở local (238 test)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Cỡ: code sản phẩm ≈ 300 dòng (178 thêm / 120 bớt, gồm ba hàm cũ của `team.ts` và `personUsage` của màn bỏ đi). Tổng diff ≈ 950 dòng, **vượt ~800 của ADR-0001**: phần test ≈ 640 dòng vì Issue có 6 mục test chấp nhận, 4 mục là luồng e2e phải dựng dữ liệu qua màn (RE + IS + KH + cuộc gặp + xóa KH; Nạp lại đang chạy trên exe giả). Test của `personUsage` cũng chuyển từ app sang db. `packages/db/CLAUDE.md` là codemap sinh tự động.

Rủi ro: `risk:low` → Claude tự merge sau review PASS.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #655 — T-251: Focus không rơi về body, tên cột nút (DR6-83, 100)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

1. **Focus không rơi về `body` (DR6-83).** Khi nút mở hộp hoặc nút vừa bấm tự gỡ khỏi trang, focus đi tới một đích dự phòng do nơi gọi chọn, không rơi về `body`. Các chỗ:
   - Lưu ở 6c, 6g, 6h, 8a (ô trống), 8b.
   - Khôi phục ở Thùng rác.
   - Bỏ một dữ kiện đang soạn ở 7a → focus về ô chọn Trường.
   - Đích gợi ý: tiêu đề khung Chi tiết, dòng `role="status"`, đầu khung Hợp đồng.
2. **Tiêu đề cột nút có tên ẩn (DR6-100).** Cột nút của thẻ Lịch hẹn trong hồ sơ KH và bảng thành viên team dùng `headerHidden` của `DataTable` (như DR6-43 ở Thùng rác).

##### Bối cảnh

Deep review Phase 1–6 lượt 2 (T-225 #565), nhóm **L2-B2** (Phương án 3, Owner 17/10/2026). Cùng loại DR6-35, chỗ khác. Làm sau L2-F vì cùng `KycDialogs.tsx`.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` §6.4 (DR6-83), §6.7 (DR6-100), §8.2 L2-B2
- `docs/decisions/0013-huong-ui-dark-mode.md` (trợ năng, focus)
- `packages/ui/src/components/{Dialog,DataTable}.tsx`
- `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx`, `apps/desktop/src/routes/customers/{CustomerPolicies,KycDialogs,CustomerAppointments}.tsx`, `apps/desktop/src/routes/SettingsTrash.tsx`, `apps/desktop/src/routes/team/TeamScreen.tsx`

##### File / thư mục được phép sửa

- `packages/ui/src/components/Dialog.tsx` + test, `packages/ui/CLAUDE.md` (codemap)
- `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx`, `apps/desktop/src/routes/customers/{CustomerPolicies,KycDialogs,CustomerAppointments}.tsx`, `apps/desktop/src/routes/SettingsTrash.tsx`, `apps/desktop/src/routes/team/TeamScreen.tsx`
- `apps/desktop/src/i18n/vi.ts` (tên ẩn của cột)
- `e2e/**` (ca bàn phím)

##### Interface / hợp đồng

- `Dialog` nhận thêm đích focus dự phòng (tùy chọn); không đổi hành vi khi nút mở còn trong trang.

##### Test chấp nhận

- [ ] e2e bàn phím: sau Lưu ở 6c / 6g / 6h / 8a / 8b, sau Khôi phục ở Thùng rác, sau Bỏ dữ kiện ở 7a → `document.activeElement` ≠ `BODY`, nằm đúng đích.
- [ ] Hai cột nút có tên ẩn đọc được bằng trình đọc màn hình (`read_page` / role `columnheader` có tên).

Ước lượng: ≈ 20–40 dòng SP + ≈ 50 dòng e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

#654

## PR #693 — fix: land the focus on a fallback when a dialog's opener is gone, name the button columns (T-251)

Trạng thái: MERGED · merge 2026-10-18T10:51:03Z · commit `f9fb70f2ba565b6629f952e327c7314ac2fa6ba9` · nhánh `task/T-251-focus-fallback`

Closes #655

#### Thay đổi

- **DR6-83, đích focus dự phòng của `Dialog`** (`packages/ui/src/components/Dialog.tsx`, `dialog-focus.ts`):
  - `@p2c/ui` export context `DialogFocusFallback`: một hàm trả phần tử nhận focus. Màn hình đặt nó quanh các hộp của mình.
  - Khi hộp đóng, `focusBack(opener, fallback)` quyết định trả focus về đâu:
    - Nút mở còn trong trang: trả focus về nút đó như trước, `preventScroll`.
    - Nút mở đã mất (không còn trong trang, hoặc không nhận focus): đưa focus tới đích dự phòng. Trình duyệt chỉ cuộn khi đích nằm ngoài màn hình.
    - Không có đích, hoặc đích không tìm thấy gì: không làm gì, như trước.
  - Hàm đích chạy **sau** khi hộp đã gỡ (cleanup của effect). Vì vậy nó đọc được phần tử vừa xuất hiện cùng lần lưu, ví dụ dòng `role="status"`.
  - **Vì sao dùng context, không dùng prop** (Issue ghi "`Dialog` nhận thêm đích focus dự phòng"):
    - Thẻ `<Dialog>` của các chỗ cần sửa nằm trong 7 file hộp không có trong danh sách của Issue: `OutcomeDialog`, `AppointmentDialog`, `DeleteAppointmentDialog`, `EditOutcomeDialog`, `RescheduleDialog`, `PolicyDialogs`, `RestoreDialog`. Dùng prop thì phải luồn qua cả 7 file.
    - Context đi thẳng từ màn hình (nơi gọi chọn đích) tới `Dialog`. Nó cũng phủ hai lối hộp đổi sang hộp khác mà prop dễ sót: 6f → 6g và 8d Sửa → Xóa.
    - Không đặt context thì `undefined`: mọi màn khác giữ nguyên hành vi.
- **Đích theo từng màn** (do màn chọn, như Issue gợi ý):
  - **Lịch hẹn** (`AppointmentsScreen.tsx`), áp cho mọi hộp của màn:
    - Có lịch đang hiện: tiêu đề khung Chi tiết (6c Lưu, 6h tới ngày sau hôm nay).
    - Lịch vừa tạo nằm ngoài góc nhìn: dòng `role="status"` "Đã tạo lịch hẹn … ngoài góc nhìn" (6h với RE ngoài góc nhìn).
    - Khung trống: chính khung Chi tiết (6g Xóa, kể cả lối 6f → 6g).
    - Khung trống nay cũng `lg:sticky lg:top-20` như khung có lịch (mockup `.detail` sticky). Trước đây, sau khi xóa, khung rơi về đầu trang, nên focus kéo trang lên đầu (phát hiện của vòng review trước PR).
  - **Hồ sơ KH** (`CustomerProfile.tsx`, `CustomerPolicies.tsx`):
    - Quanh `PolicyDialog`: tiêu đề thẻ "Hợp đồng". Áp cho 8a từ ô trống, 8b, và 8d Xóa HĐ (đi kèm, cùng hộp).
    - Quanh `ResolveKycDialog` (7d): tiêu đề "Dữ kiện KYC" (`#kyc-facts`, đã có `tabIndex=-1`). Giải quyết xong thì nút "Giải quyết" của trường đó mất. **Chỗ này Issue không liệt kê**, tìm ra ở vòng review trước PR. Cùng loại DR6-83, cùng file, ≈ 3 dòng.
  - **Thùng rác** (`SettingsTrash.tsx`): dòng 11e "✓ Đã khôi phục …" (`role="status"`, `tabIndex=-1`). Dòng này có cả khi dòng vừa khôi phục là dòng cuối và bảng thành "Thùng rác trống".
  - **7a Bỏ** (`KycDialogs.tsx`): hộp không đóng nên không qua `Dialog`. "Bỏ" chuyển focus sang ô chọn Trường **trước khi** dòng của nó bị gỡ. Ô chọn này là `select` duy nhất của khung dữ kiện, lấy qua `querySelector`, như `KycWebSession.tsx`.
  - Tiêu đề, khung, dòng status nhận `tabIndex={-1}`: chỉ nhận focus từ code, không vào thứ tự Tab. Theo mẫu đã có: `CustomerKyc.tsx` h2, `AppShell` h1.
- **DR6-100:** cột nút của thẻ Lịch hẹn trong hồ sơ (`customer.colActions`) và của bảng thành viên team (`team.colActions`) có tiêu đề "Thao tác" chỉ cho trình đọc màn hình (`headerHidden`), như cột của Thùng rác (DR6-43). Trên màn hình vẫn rỗng như mockup.
- Gộp từ sổ ghi chú (xem mục dưới): DR6-37 ở ba file đã chạm, khóa `OwnerCell`, `useMemo` vô tác dụng (DR6-66), `toNewYearsEve` vào `e2e/anchor.ts`, kiểm RF ở ca DR6-70, `exact` ở `appointments.spec.ts`.
- Trước khi mở PR đã chạy một vòng review đối kháng: 4 góc nhìn (focus / React, spec, trợ năng, test), mỗi phát hiện một người kiểm. Có 7 phát hiện, 5 được xác nhận, không có mục chặn.
  - Đã sửa ở commit thứ hai: khung trống không sticky, comment `focusBack` nói quá, nhánh "ngoài góc nhìn" chưa có test, 7d.
  - Còn lại: nội dung thân PR (mục này và hai mục dưới), và hai đề xuất ở mục cuối.

#### Ngoài danh sách file (P-2)

- `apps/desktop/src/routes/customers/CustomerProfile.tsx`: `PolicyDialog` và `ResolveKycDialog` render ở đây, không ở `CustomerPolicies.tsx`. Context và ref tiêu đề phải đặt ở đây.
- `packages/ui/src/components/dialog-focus.ts` + `dialog-focus.test.ts`: logic trả focus tách ra `.ts` để unit test được không cần DOM (Vitest không có DOM, thêm là G4), theo `packages/ui/CLAUDE.md`.
- `packages/ui/src/index.ts`: export `DialogFocusFallback`, API công khai của `@p2c/ui`.
- Spec e2e đã sửa, đều trong `e2e/**` được phép: `appointment-outcome`, `appointments`, `customer-appointments`, `customer-kyc`, `customer-policies`, `team`, `trash`, và `anchor.ts`.

#### Test chấp nhận

- [x] e2e bàn phím (mở hộp bằng Enter trên nút, lưu bằng Enter trên nút lưu). Mỗi ca kiểm nút mở hoặc dòng đã mất (đúng là nhánh dự phòng), rồi kiểm đích `toBeFocused()`, tức `activeElement` ≠ `BODY`:
  - 6c → 6h → 6g nối tiếp: `appointment-outcome.spec.ts` "by the keyboard, saving 6c, 6h and 6g leaves the focus on the detail (DR6-83)".
    - Mở đầu bằng Escape: nút mở còn nên focus về nút. Đây là hành vi không đổi.
    - 6g cuộn trang 300 px trước khi xóa, rồi kiểm `scrollY` không đổi và khung vẫn trong màn hình.
  - 6f → 6g: cùng file, "by the keyboard, deleting from 6f leaves the focus on the detail (DR6-83)".
  - 6h ngoài góc nhìn: `appointments.spec.ts` "by the keyboard, a next appointment made out of sight leaves the focus on the line saying so (DR6-83)".
  - 8a từ ô trống → 8b → 8d Xóa: `customer-policies.spec.ts` "by the keyboard, Lưu HĐ from the empty card, Phát hành and Xóa HĐ leave the focus on the card (DR6-83)". KH mới tạo nên chắc chắn bắt đầu từ ô trống.
  - Khôi phục ở Thùng rác: `trash.spec.ts` "by the keyboard, Khôi phục leaves the focus on the line of what came back (DR6-83)". Dòng cuối nên bảng thành "Thùng rác trống". Escape trước đó: focus về nút của dòng.
  - 7a Bỏ: `customer-kyc.spec.ts` "by the keyboard, Bỏ a fact being drafted leaves the focus on Trường (7a, DR6-83)". Hai dữ kiện; bỏ dữ kiện cuối thì mất cả danh sách; hộp vẫn mở.
  - 7d (thêm): ca "a KYC note confirms facts; a cốt lõi conflict…" mở / lưu 7d bằng Enter, kiểm tiêu đề "Dữ kiện KYC" được focus.
- [x] Hai cột nút có tên ẩn: `team.spec.ts` và `customer-appointments.spec.ts` kiểm `columnheader` "Thao tác" có đúng 1, và rộng ≤ 1 px trên màn hình (như R43e ở Thùng rác).
- Unit: `dialog-focus.test.ts`, 4 ca: nút mở còn trong trang (`preventScroll`, không hỏi đích); nút mở đã mất (focus đích, có cuộn); nút mở không nhận focus coi như đã mất; không có đích hoặc đích rỗng thì không làm gì.
- Đỏ trước khi sửa:
  - 7 ca đầu đỏ đúng dòng kiểm focus / tiêu đề cột.
  - Ba kiểm thêm sau review đỏ khi đưa code về bản trước:
    - bỏ `lg:sticky` của khung trống → `scrollY` đổi;
    - bỏ `outsideLine` khỏi chuỗi đích → dòng status không được focus;
    - bỏ context quanh 7d → tiêu đề KYC không được focus.

#### Ghi chú OPEN liên quan

- L19 (`AppointmentsScreen.tsx`, ô ngoài tháng `aria-hidden`, #156): để lại. Lịch tháng, ngoài phạm vi focus sau hộp.
- L21 (`CustomerAppointments.tsx`, mockup tô "RF" màu accent / năm xuống dòng, #165): để lại. Chữ / màu theo mockup, ngoài DR6-83/100.
- L22 (#163: `AppointmentDialog.tsx` 6a badge, "Các lần hẹn trước", e2e "Xem tất cả" > 5 lịch): để lại. PR không sửa `AppointmentDialog.tsx`; e2e "Xem tất cả" ngoài phạm vi.
- L24 (#141 hồ sơ KH: dòng 5d, khối cảnh báo, `INVALID_TRANSITION`, badge lặp): để lại. Hộp 5d / `CustomerDialogs.tsx`, ngoài phạm vi; PR chỉ chạm `CustomerProfile.tsx` để đặt đích focus.
- L36 (`AppointmentsScreen.tsx`, `bg-period-band` ở nhánh `!pickable`, #239): để lại. Ghi chú nói không xảy ra; ngoài phạm vi.
- L47 (`ConfirmFactDialog` 3f, preview `refused`): để lại. Cần câu báo riêng (không chỉ mâu thuẫn) và e2e riêng, không phải focus.
- L50 (NIT `KycExtraction.tsx:96`, dấu `:` trong JSX): để lại. `KycExtraction.tsx` ngoài các file PR sửa.
- L86 (`trash.customer.with` dùng slot `{count}`): để lại. Cần sửa `COUNT_SLOTS` ở `i18n/index.ts`, ngoài danh sách file.
- L87 (`SettingsTrash.tsx` `OwnerCell` `key={owner.text}`): đã sửa. Khóa theo vị trí.
- L110 (`close.unsavedBody` khi đĩa đầy): để lại. Hành vi hộp đóng app, ngoài phạm vi.
- L126 (NIT `SettingsTrash.tsx` `useCallback(…, [today])` + `eslint-disable`): để lại. Chính ghi chú khuyên giữ comment; dọn về `useQuery(listTrash)` sẽ làm TR-5 hỏng lại.
- L143 (`CustomerProfile.tsx` `stageSince` chỉ giữ bằng e2e): để lại. Cần công cụ test DOM, tức G4.
- L147 (`toNewYearsEve` viết hai lần): đã sửa. `toNewYearsEve(page)` ở `e2e/anchor.ts`, cùng phép tính; `appointment-outcome.spec.ts` và `customer-policies.spec.ts` dùng chung.
- L152 (ca DR6-70 chưa kiểm RF bớt 1): đã sửa. Cuối ca, dòng thời gian của KH còn "chuyển tay · không tính RF" và không còn "tính 1 RF". Trước khi sửa kết quả, chuyển nhóm N3 → N2 của cuộc gặp hiện "tính 1 RF", nên kiểm này không rỗng.
- L169 (Chỉ ghi lại: `user-guide/10-su-co.md`, NT-EX-06): để lại. Chỉ ghi lại; #663 (T-259) chép câu mới.
- L186 (`appointments.spec.ts:656-660` thiếu `exact`): đã sửa. `{ name: 'Lịch hẹn', exact: true }`, kèm comment.
- L207 (DR6-37, dấu nối / ký hiệu viết cứng): đã sửa phần ở các file PR chạm.
  - `AppointmentsScreen.tsx:67, :600-604`: `sep.list`, `appointments.none`.
  - `KycDialogs.tsx` (ngoặc kép của 7d, `:398` cũ): `kycResolve.value`; `:115-116` đã sửa từ trước.
  - `SettingsTrash.tsx` (`—`): `trash.owner.none`.
  - Chữ hiển thị không đổi; ca 7d kiểm `"2"` / `"3"` vẫn xanh.
  - Còn mở: `CustomerKyc.tsx:84, :153, :245`, `AppointmentDialog.tsx:234` (`×`), `TeamCompare.tsx:91`. PR sổ nên thu hẹp mục này, không chuyển RESOLVED.
- L208 (DR6-66): đã sửa phần `CustomerAppointments.tsx`. Bỏ `useMemo` cột, vì `onNext` của hồ sơ mới mỗi lần render nên memo luôn tính lại; hành vi không đổi. Phần còn lại (hàm `db` chỉ test dùng, export không ai import, …) ở file khác. PR sổ nên thu hẹp mục này.

#### Đề xuất ghi vào sổ ở PR sổ sau review (ngoài phạm vi)

- **Không có `scroll-padding` cho thanh trên cùng sticky** (`apps/desktop/src/index.css`).
  - Khi đích dự phòng nằm trong dải ≈ 59 px ngay dưới thanh, Chromium coi nó "đã thấy" nên không cuộn, và đích bị thanh che (WCAG 2.4.11). Đích có thể rơi vào dải này: tiêu đề Hợp đồng, dòng 11e, dòng "ngoài góc nhìn", và khung Chi tiết dưới lg.
  - Cùng gốc với "Xem tất cả" (`scrollIntoView({ block: 'start' })` ở `CustomerProfile.tsx`) đưa đích xuống dưới thanh.
  - Sửa một dòng CSS (`html { scroll-padding-top: … }`), nhưng file ngoài danh sách và đổi hành vi cuộn chung → Issue riêng.
- **Khung Chi tiết chuyển sang lịch khác mà nút mở được tái dùng.**
  - Các luồng: 6c kèm "Hẹn lần tiếp theo", 6e, 6h tới đúng hôm nay.
  - React giữ nút cùng chỗ, nên focus về nút đó, giờ thuộc lịch mới, và tiêu đề mới không được đọc.
  - Đúng hợp đồng của Issue ("không đổi hành vi khi nút mở còn trong trang"), K16 cũng đã nhận 6e. Nếu anh muốn focus theo lịch mới thì cần quyết định riêng: khóa hàng nút theo lịch.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (3 027 test)
- [x] `pnpm e2e` toàn bộ xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #656 — T-252: Lớp file: integrity_check, file chỉ đọc, màn lỗi khởi động, test hở (DR6-73, 74, 75, 88)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

1. **`integrity_check` thay `quick_check` (DR6-73) — Q3 (a).** Mở file dữ liệu chạy `PRAGMA integrity_check`. Nó bắt thêm hỏng làm chỉ mục lệch nội dung bảng (Claude B: 257 / 600 lần lật một byte chỉ `integrity_check` bắt được). File hỏng như vậy → lỗi khởi động như file không mở được, **không** chép thành backup mới nhất. Sửa doc comment `database.ts` cho đúng. Chi phí ≈ +30 ms mỗi lần mở (`app.open-data` ≈ 330 ms, ngưỡng 600).
2. **File chỉ đọc (DR6-74).** `project2c.db` có thuộc tính chỉ đọc → mở bị từ chối bằng `ACCESS_DENIED` (câu khởi động sẵn có). Hiện nay app mở bình thường rồi mọi lần lưu lỗi `PermissionDenied`, hộp đóng app "Thử lại" không bao giờ được, Nhập backup báo xong mà không vào file.
3. **Màn lỗi khởi động còn giữ khóa (DR6-75).** Ba câu `fileInUseHelp`, `backupFailedHelp`, `diskFullHelp` (và câu cùng loại) bảo "đóng cửa sổ này rồi mở lại app", vì màn lỗi giữ `project2c.lock` tới khi tiến trình thoát. Không thêm nút mới (nút "Thử lại" là đổi mockup, cần G3).
4. **Test hở gói B (DR6-88).**
   - G07d: `create_dir_all` → `ACCESS_DENIED` (ca thư mục cài trong Program Files), qua seam tạo thư mục.
   - `TempDir` của test Rust có `Drop`, tự dọn.
   - Test phiên bản bắt được ca cả ba file cùng lùi về 0.1.0 (vd. đòi ≥ 1.0.0), không chỉ so ba file với nhau.
   - Id trong `AI_MODELS` khớp luật tên model của Rust (test hợp đồng).
5. **J5 (Q10, ACCEPTED).** Sửa comment `app-data.ts:394-396` cho khớp điều test kiểm. Không thêm test.

##### Bối cảnh

Deep review Phase 1–6 lượt 2 (T-225 #565), nhóm **L2-C** (Phương án 3, Owner 17/10/2026; Q3 (a), Q10 đồng ý). Có Rust → nhãn `build-exe`. Làm liền với L2-D (cũng `build-exe`) để build exe ít lần. Đổi `quick_check` → `integrity_check` làm số đo `app.open-data` / `reload.*` đổi: ghi vào PR, mốc mới ghi ở `docs/metrics/phase-6.md` (DR6-98).

##### Tài liệu cần đọc

- `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` §5.3 (DR6-73), §6.2 (DR6-73, 74, 75), §6.6 (DR6-88), §7.1, §8.2 L2-C, §9 Q3, Q10
- `docs/design/phase-6-hoan-thien.md` §5 (lớp file, mục 4)
- `packages/db/src/database.ts`, `apps/desktop/src/data/app-data.ts` (mở file, backup lúc khởi động)
- `apps/desktop/src-tauri/src/storage.rs` (`open`, `backup`, ánh xạ lỗi), `apps/desktop/src/data/tauri-contract.test.ts`
- `apps/desktop/src/shell/{StartupError.tsx,startup-error.ts}`, `apps/desktop/src/i18n/vi.ts`

##### File / thư mục được phép sửa

- `packages/db/src/database.ts` + test
- `apps/desktop/src/data/{app-data.ts,tauri-contract.test.ts}` + test
- `apps/desktop/src-tauri/src/storage.rs` (+ test Rust trong file)
- `apps/desktop/src/shell/{StartupError.tsx,startup-error.ts}` + test, `apps/desktop/src/i18n/vi.ts`
- `docs/design/phase-6-hoan-thien.md` §5 (nếu chữ về kiểm file đổi)

##### Interface / hợp đồng

- Mã lỗi khởi động không thêm mới: file chỉ đọc dùng `ACCESS_DENIED`, hỏng chỉ mục dùng nhánh "file hỏng" sẵn có.

##### Test chấp nhận

- [ ] DB có một byte lật trong khóa chỉ mục (ca của Claude B) → từ chối mở, không có backup mới.
- [ ] File chỉ đọc → `ACCESS_DENIED`, không mở (test Rust + test TS của ánh xạ).
- [ ] Câu của ba màn lỗi khởi động có "đóng cửa sổ này".
- [ ] G07d, `Drop`, phiên bản 0.1.0, id `AI_MODELS` ↔ Rust: mỗi đột biến có test đỏ.
- [ ] `pnpm verify:rust` xanh; số `app.open-data` ghi trong PR.

Ước lượng: ≈ 15–35 dòng SP + ≈ 100 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh (gồm build exe)
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med

##### Bị chặn bởi

Không

## PR #674 — fix: integrity_check at startup, refuse a read-only data file, tell to close the error window (T-252)

Trạng thái: MERGED · merge 2026-10-17T16:42:38Z · commit `c5a40e1c8a1c217f145309e79698597d8349d948` · nhánh `task/T-252-file-layer`

Closes #656

#### Thay đổi

T-252, nhóm L2-C của deep review Phase 1–6 lượt 2: DR6-73, 74, 75, 88 và comment J5 (Q3 (a), Q10, Owner 17/10/2026).

- **`integrity_check` thay `quick_check` (DR6-73).** `Database.quickCheck()` đổi tên thành `integrityCheck()` và chạy `PRAGMA integrity_check`. Lệnh này so từng chỉ mục với bảng, nên bắt được khóa chỉ mục lệch một byte mà mọi trang vẫn nguyên. File như vậy dừng khởi động qua nhánh `DATA_DAMAGED` sẵn có ("File dữ liệu bị hỏng"), không chép thành backup, không lưu. Doc comment `database.ts` và comment / doc ở `app-data.ts` sửa theo.
- **File chỉ đọc (DR6-74).** `storage::open` từ chối `project2c.db` có thuộc tính chỉ đọc bằng `ACCESS_DENIED` (mã sẵn có, câu "App không có quyền ghi vào thư mục dữ liệu"). Bước kiểm nằm sau bước kiểm đầu file SQLite: file không phải SQLite vẫn báo lỗi đó trước.
- **Màn lỗi khởi động còn giữ khóa (DR6-75).** Không thêm nút. Các câu của trang lỗi mở khi tiến trình đã giữ `project2c.lock` nay bảo đóng cửa sổ này trước khi mở lại:
  - `fileInUseHelp`, `backupFailedHelp`, `diskFullHelp`, `accessDeniedHelp`, `openFailedHelp` (dùng cho cả trang "File dữ liệu bị hỏng"): "…rồi đóng cửa sổ này và mở lại app".
  - `tooNewHelp`: "…App không thay đổi gì trong file. Hãy đóng cửa sổ này rồi dùng bản app mới hơn."
  - `alreadyOpenHelp` thêm: "Nếu cửa sổ đó đang báo lỗi mở dữ liệu, hãy đóng cả hai cửa sổ rồi mở lại app."
- **Test hở gói B (DR6-88):**
  - G07d: seam `open_with(…, create_dir)` như `save_with`. Test cho hàm tạo thư mục trả `PermissionDenied` → `ACCESS_DENIED`, thư mục không được tạo.
  - `TempDir`: test bỏ một `TempDir` có file rồi kiểm thư mục đã mất.
  - Phiên bản: ngoài so ba file với nhau, nay đòi `package.json` ≥ 1.0.0 (major ≥ 1).
  - `AI_MODELS` ↔ Rust: test hợp đồng đọc `MAX_MODEL_CHARS` và tập ký tự `b"…"` của luật tên model trong `ai.rs`, kiểm mọi id.
- **J5 (Q10, ACCEPTED):** comment `swap` ở `app-data.ts` nói đúng điều test giữ (người nghe biết DB mới trước khi DB cũ đóng). Nhịp `setTimeout` ghi là biên an toàn không test nào giữ. Không thêm test.

##### Lệch so với Issue

- Issue nêu "ba câu (và câu cùng loại)". PR sửa năm câu `…Help` mà lượt 2 (CL2-B6) liệt kê, thêm `accessDeniedHelp`: file chỉ đọc nay báo `ACCESS_DENIED` **sau khi** đã giữ khóa. Cũng sửa `alreadyOpenHelp` theo đề xuất của CL2-B6, vì đó là trang người dùng gặp khi đã mở lại lúc cửa sổ lỗi còn.
- `docs/user-guide/10-su-co.md` (bảng "Khi mở app") và `docs/testing/nghiem-thu-v1.md` NT-EX-06 trích các câu cũ. Hai file này không có trong danh sách file của Issue nhưng có trong #663 (T-259, "`10-su-co.md` khớp chữ app"). Đã ghi chú vào #663 để chép câu mới.
- Spec Phase 6 §5 mục 4 không nêu tên lệnh kiểm nên không sửa.

#### Test chấp nhận

- [x] Lật một byte trong khóa chỉ mục `teams_active_name` (mọi trang nguyên, `quick_check` = `ok`) → `integrityCheck()` báo `row … missing from index teams_active_name` (`database.test.ts`). `openAppData` từ chối bằng `DATA_DAMAGED`, không backup, không lưu (`app-data.test.ts` "…(DR6-73)").
- [x] File chỉ đọc → `ACCESS_DENIED`, file không đổi, gỡ chỉ đọc thì mở được (`open_reports_a_read_only_database_file_as_access_denied`). Ánh xạ TS: `startup-error.test.ts` (`ACCESS_DENIED` → câu khởi động), `tauri-contract.test.ts` (hằng `ACCESS_DENIED` khớp Rust). Trên exe release: `attrib +R` → trang "App không có quyền ghi vào thư mục dữ liệu" với câu mới, `project2c.db` không đổi (hash), không thêm backup.
- [x] Câu của các trang lỗi khởi động giữ khóa (file bị giữ, không có quyền, backup lỗi, đĩa đầy, file hỏng, schema mới hơn, không mở được) có "đóng cửa sổ này"; `ALREADY_OPEN` nêu đóng cả hai cửa sổ (`startup-error.test.ts`).
- [x] Mỗi đột biến có test đỏ. Đã áp tạm từng cái, chạy, rồi trả file nguyên byte:
  - `integrity_check` → `quick_check`: hai test DR6-73 đỏ (`database.test.ts`, `app-data.test.ts`).
  - G07d (`create_dir(dir)?` bỏ `out_of_reach`) → `open_reports_a_data_folder_it_may_not_create_as_access_denied` đỏ.
  - Bỏ `impl Drop for TempDir` → `a_temp_dir_goes_with_all_it_holds_once_dropped` đỏ.
  - Bỏ bước kiểm chỉ đọc → `open_reports_a_read_only_database_file_as_access_denied` đỏ.
  - Ba file cùng về `0.1.0` → test phiên bản đỏ.
  - Id `kimi+k3` trong `AI_MODELS`; bỏ `.` khỏi tập ký tự của Rust; `MAX_MODEL_CHARS` = 8 → test tên model đỏ (cả ba).
- [x] `pnpm verify:rust` xanh (fmt, clippy `-D warnings`, 104 test).
- [x] Số `app.open-data` dưới đây.

#### Số đo (Home PC, dữ liệu tải)

Dữ liệu: `node tools/load-data.mjs` (anchor 2026-10-12, seed 6), file DB 14 069 760 B, bằng cỡ file của lượt 2.

**`app.open-data` trên exe release, A/B cùng nhánh** (chỉ khác lệnh kiểm). Cách đo: mở exe có cổng debug, đọc mốc `p2c:data-open` của trang mới mở (như probe `e2e/perf`), đóng; 6 lần mỗi bản, cùng dữ liệu, cùng profile WebView2.

| Bản | Trung vị | Min–max |
|---|---|---|
| `quick_check` | 347 ms | 341–352 ms |
| `integrity_check` (PR này) | 381 ms | 378–384 ms |
| Chênh | **+34 ms** | |

**Riêng lệnh kiểm trong Node** (sql.js, cùng bytes, 7 lần × 2 lượt): `quick_check` 68 ms, `integrity_check` 99,5 ms, tức +31 ms.

- Ngưỡng `app.open-data` ≤ 600 ms: đạt.
- Số tuyệt đối cao hơn mốc lượt 2 (301 ms, probe đầy đủ ở `4217ed4`). Bản `quick_check` của A/B cũng cao như vậy (347 ms), nên phần cao hơn không do PR này. Chưa tách nguyên nhân: khác cách đo (script riêng, không phải probe), khác code từ `4217ed4`, trạng thái profile WebView2.
- Mốc mới cho G7 đo lại bằng probe đầy đủ sau khi merge (HANDOFF bước 3, DR6-98).
- File `.local/load-data/load-2026-10-12-seed6.p2cbackup` cũ trên Home PC nay bị nhập backup từ chối (`BACKUP_INVALID`, luật 4). Sinh lại bằng `node tools/load-data.mjs` trước khi đo lại.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] `pnpm verify:rust` xanh ở local
- [x] `pnpm e2e` toàn bộ xanh ở local (238 test)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med` (nhãn `build-exe`: sửa `src-tauri`)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #657 — T-253: Key qua mọi tổ hợp hai lớp escape, Rust và script eval (DR6-76)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

Nhận diện và che API key qua **mọi tổ hợp tới hai lớp escape JSON / URL**, kể cả trộn theo từng đoạn (DR6-76), ở cả Rust (`ai.rs`) và script eval (`eval-ai-core.mjs`). Theo Q9 = Phương án 3 (sửa hết), làm cả phần Q2 (a) lẫn dạng trộn mà Q2 (a) định hoãn.

1. **Hai lớp cùng loại:** JSON rồi JSON, URL rồi URL. Hiện `readings` cố ý bỏ JSON→JSON ("the webview parses an answer once"); test `ai.rs` ghim dạng này là hợp lệ → đổi thành ca bị chặn.
2. **Trộn theo từng đoạn:** mỗi đoạn của key mang số lớp / thứ tự escape khác nhau, tới hai lớp. Gợi ý: hai lượt "gỡ cả hai loại escape" (`Escapes::Both`) nối nhau thay cho bốn cách đọc cố định, để mỗi lượt gỡ lớp ngoài của mọi đoạn. Phiên làm Issue chọn cách, chứng minh bằng test sinh tổ hợp.
3. **Nơi áp dụng:**
   - Rust: trả lời 2xx có key → `AI_BAD_RESPONSE`, không tới webview. Thông điệp lỗi server (401 / 429…) che key ở mọi dạng trên.
   - Script eval: không ghi key vào file kết quả, `.partial`, log.
4. **Ghi giới hạn:** từ ba lớp trở lên nằm ngoài mô hình đe dọa. Ghi một câu vào ADR-0009 D-1 (server / proxy phải cố ý dội key).

##### Bối cảnh

Deep review Phase 1–6 lượt 2 (T-225 #565), nhóm **L2-D**. Owner 17/10/2026: Phương án 3 "sửa hết" gồm cả "DR6-76 dạng trộn" (§8.5). Mọi dạng đều cần server / proxy cố ý dội key → Low; sửa để đóng cả họ. Có Rust → nhãn `build-exe`. Làm liền sau L2-C để build exe ít lần. Key trong test là key giả.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` §5.3 (DR6-76), §6.2, §8.2 L2-D, §9 Q2
- `docs/reviews/raw/2026-10-17/claude/B.md` (CL2-B4), `claude/F.md` (CL2-F1), `codex/B.md` (CX2-B3), `codex/F.md` (CX2-F2): ca và probe
- `docs/decisions/0009-ai-copilot-provider-va-guardrail.md` D-1
- `apps/desktop/src-tauri/src/ai.rs` (`readings`, `unescape`, `reveals`, `mask` và test)
- `tools/eval-ai-core.mjs` (`readings`, `mask`) + `tools/eval-ai-core.test.mjs`

##### File / thư mục được phép sửa

- `apps/desktop/src-tauri/src/ai.rs` (+ test trong file)
- `tools/eval-ai-core.mjs`, `tools/eval-ai-core.test.mjs`
- `docs/decisions/0009-ai-copilot-provider-va-guardrail.md` (một câu ở D-1)

##### Interface / hợp đồng

- Không đổi lệnh Tauri, không đổi mã lỗi (`AI_BAD_RESPONSE`).

##### Test chấp nhận

- [ ] JSON→JSON, URL→URL, JSON→URL, URL→JSON của key giả trong `content` → `AI_BAD_RESPONSE` (Rust) / lỗi, file kết quả không chứa key (script).
- [ ] Test sinh tổ hợp: key cắt thành 2–4 đoạn, mỗi đoạn 0–2 lớp escape tùy loại → đều bị bắt; thông điệp 401 / 429 chứa các dạng đó → bị che.
- [ ] Câu thường có `%` / `\u` nhưng không chứa key không bị chặn nhầm (ca có sẵn vẫn xanh).
- [ ] Rust và script cho cùng kết quả trên cùng bộ ca (bảng ca dùng chung hoặc chép y hệt).
- [ ] `pnpm verify:rust` xanh.

Ước lượng: ≈ 30–120 dòng SP (Rust + script) + ≈ 150 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh (gồm build exe)
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med

##### Bị chặn bởi

Không (làm liền sau #656 để build exe một lần)

## PR #680 — fix: catch the key in up to two layers of escapes, part by part (T-253)

Trạng thái: MERGED · merge 2026-10-17T19:32:12Z · commit `217cef6bd98bfe63d36ffd25450b3199d430c0d8` · nhánh `task/T-253-key-two-layers`

Closes #657

#### Thay đổi

- **Cách đọc mới** (`readings` ở `apps/desktop/src-tauri/src/ai.rs` và `tools/eval-ai-core.mjs`, theo gợi ý của Issue): thay bốn cách đọc cố định (nguyên văn, gỡ cả hai loại một lượt, JSON rồi URL, URL rồi JSON) bằng ba: nguyên văn, gỡ mọi escape JSON và `%XX` một lượt, và hai lượt nối nhau. Mỗi lượt gỡ lớp ngoài của mọi đoạn, nên key mà mỗi đoạn qua 0–2 lớp, cùng hay khác loại, thứ tự tùy ý, đều hiện ra ở lượt hai. Bỏ enum `Escapes` (Rust) và `ESCAPES.json` / `.url` (script). Cùng một luật cho trả lời 2xx (`AI_BAD_RESPONSE`), `finish_reason` và che thông điệp lỗi 401 / 429 / 5xx.
- **Ca đổi từ "hợp lệ" sang "bị chặn"** theo mục 1 của Issue: hai ca JSON rồi JSON (mỗi `\` của lớp trong viết lại thành `\\`, hoặc thành escape JSON của `\`) mà test `ai.rs` cũ ghim là hợp lệ; ca "key sau một `\` đã escape" (ký tự đầu hai lớp JSON, phần còn lại một lớp) ở cả `ai.rs` lẫn `eval-ai-core.test.mjs` — chính là dạng trộn theo đoạn. Ca ba lớp (JSON, JSON, URL) vẫn là trả lời hợp lệ.
- **Bộ ca dùng chung** (`shared_cases` trong `ai.rs` ↔ `sharedCases` trong `eval-ai-core.test.mjs`, chép y hệt, cùng key giả `sk-test-SECRET-0123456789`):
  - Bị chặn và che (16 099 ca): 5 dạng hai lớp cố định (JSON→URL, URL→JSON, JSON→JSON hai cách viết, URL→URL); dạng xen kẽ từng ký tự của CX2-B3; key cắt 2 / 3 / 4 đoạn, mỗi đoạn một trong 11 cách (không escape, `J`, `U`, lớp trong `J` / `U` × lớp ngoài `J` / `U` / `j` = `JSON.stringify` / `u` = `encodeURIComponent`), đủ mọi tổ hợp. Mỗi ca: trả lời 2xx → `AI_BAD_RESPONSE`; thông điệp 401 và 429 (xen nhau) → `bad ***!`.
  - Không bị chặn (6 ca): key ba lớp, câu có `%` / `\u` / `\` thường, mẩu key. Trả lời qua, thông điệp giữ nguyên.
  - Hai bên kiểm cùng số ca và cùng vân tay FNV-1a `0x834ac61c` của toàn bộ chữ các ca: một bên lệch là test đỏ.
- Thêm ca `ODD_KEY` (key có `\n`, `%41` của chính nó) một lớp ở cả hai nơi: giữ cách đọc "một lượt", vì lượt hai gỡ tiếp phần của chính key.
- **ADR-0009 D-1 mục 1**: một câu — key tới hai lớp escape bị chặn / che ở Rust và script eval; từ ba lớp trở lên nằm ngoài mô hình đe dọa.

Giới hạn (ghi ở doc comment của `readings`): test chứng minh cho secret không có `\` hay `%` của riêng nó, như key OpenCode và session id. Secret có các ký tự đó vẫn bị bắt nguyên văn và một lớp, nhưng không bảo đảm mọi dạng hai lớp vì lượt gỡ có thể gỡ cả phần của chính secret. Luật key (`clean_key`) không đổi (ngoài Issue).

Đột biến (chạy tay ở `ebb86a9`): bỏ từng cách đọc (nguyên văn / gỡ một lượt / gỡ hai lượt), mỗi lần một cách, ở mỗi nơi → test đỏ: 3 / 3 ở Rust, 3 / 3 ở script.

Thời gian test: ca dùng chung ≈ 3,5 s ở `cargo test` (debug), ≈ 1,5 s ở Vitest; test Vitest đặt `timeout` 60 s như các test chậm khác của `tools/`.

#### Test chấp nhận

- [x] JSON→JSON, URL→URL, JSON→URL, URL→JSON của key giả trong `content` → `AI_BAD_RESPONSE` (Rust) / lỗi, file kết quả không chứa key (script): `two_layers` / `twoLayers` (5 dạng) trong bộ ca dùng chung; `evalMain` "writes no answer that holds the key, in any form" chạy thêm ba dạng hai lớp mới và dạng xen kẽ, 0 lần trong file kết quả, `.partial`, log.
- [x] Test sinh tổ hợp: key cắt 2–4 đoạn, mỗi đoạn 0–2 lớp tùy loại → đều bị bắt; thông điệp 401 / 429 chứa các dạng đó → bị che (`the_key_in_up_to_two_layers_of_escapes_part_by_part_is_bad_response_and_masked`, "refuses and masks the key in up to two layers of escapes part by part, as Rust (DR6-76)").
- [x] Câu thường có `%` / `\u` không chứa key không bị chặn nhầm: ca có sẵn vẫn xanh, cộng 6 ca "không bị chặn" của bộ dùng chung.
- [x] Rust và script cho cùng kết quả trên cùng bộ ca: chép y hệt, kiểm bằng số ca + vân tay chung.
- [x] `pnpm verify:rust` xanh (104 test).

#### Ghi chú OPEN liên quan

- Không có (`node tools/notes-for.mjs --diff`: không mục nào trùng file).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med` · nhãn `build-exe` (sửa `src-tauri`)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #658 — T-254: AI Mock: trích xuất không chậm, bớt đề xuất sai, test panel (DR6-78, 79, 89)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

1. **Mock trích xuất không còn chậm bậc hai (DR6-79, hồi quy của DR6-19).** `aboutTheKh` không quét ngược từng ký tự cho mỗi cụm. Tính đầu câu / đầu vế một lượt (hoặc dừng ở 20 cụm được nhận) trước khi cắt 20. Hiện ghi chú một dòng 36 003 ký tự mất ≈ 2 s và làm trang đứng.
2. **Mock trích xuất bớt đề xuất sai (DR6-78).**
   - Không đề xuất cho KH điều nói về người khác: ông nội, bà ngoại, em, anh họ, anh rể, vợ cũ, cô, ba, sếp, hàng xóm…
   - "<n> con" chỉ tính là số con khi không theo sau là danh từ con vật / đồ vật ("2 con chó", "10 con bò").
   - Bỏ câu giả định ("nếu đã kết hôn, có 2 con").
   - Có ca test cho "!", "?", ";" và xuống dòng làm ranh giới câu (N19d).
3. **Test hở gói C (DR6-89).**
   - DR6-15: e2e panel bỏ phiên ChatGPT web khi dữ liệu thay (R15b); unit thứ tự "đọc `generation` trước `await`" (R15d).
   - DR6-21: e2e tương phản khối AI ở chi tiết lịch hẹn khi STALE (R21c).

##### Bối cảnh

Deep review Phase 1–6 lượt 2 (T-225 #565), nhóm **L2-E** (Phương án 3, Owner 17/10/2026). Mock adapter là đường AI không tốn tiền (dùng cho eval, e2e, dữ liệu giả lập). Không đổi prompt hay guardrail, nên không cần G5. Không gọi AI thật.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` §6.3 (DR6-78, 79), §6.6 (DR6-89), §8.2 L2-E
- `docs/reviews/raw/2026-10-17/claude/C.md` (CL2-C2, C4, C5, C7: ca, probe, đột biến), `codex/C.md` (CX2-C1)
- `docs/design/phase-5-ai.md` (AI trích xuất, Mock)
- `packages/ai/src/mock-adapter.ts` + test; `apps/desktop/src/data/ai-analysis.ts` + `ai-analysis.test.ts`
- `e2e/customer-ai-web.spec.ts`, `e2e/appointments.spec.ts`

##### File / thư mục được phép sửa

- `packages/ai/src/mock-adapter.ts` + test
- `apps/desktop/src/data/ai-analysis.test.ts`
- `e2e/customer-ai-web.spec.ts`, `e2e/appointments.spec.ts` (hoặc spec AI của chi tiết lịch hẹn)
- `packages/ai/CLAUDE.md` (codemap, nếu export đổi)

##### Interface / hợp đồng

- Không đổi interface adapter.

##### Test chấp nhận

- [ ] Ghi chú một dòng 36 000 ký tự: trích xuất Mock < 50 ms.
- [ ] Mọi câu ví dụ của DR6-78 → 0 đề xuất cho KH; câu đúng về KH vẫn đề xuất như cũ.
- [ ] Đột biến R15b, R15d, R21c có test đỏ.

Ước lượng: ≈ 25 dòng SP + ≈ 80 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #682 — fix: read a Mock extraction note in one pass and propose less of others (T-254)

Trạng thái: MERGED · merge 2026-10-18T05:33:46Z · commit `1502c5e60c6088a0a310f05f9736569d459a0032` · nhánh `task/T-254-mock-extraction`

Closes #658

#### Thay đổi

- **DR6-79 (hồi quy của DR6-19):** `aboutTheKh` không còn quét ngược từng ký tự cho mỗi cụm. `wordBefore` lấy đầu câu / đầu vế một lượt (`matchAll` các dấu kết thúc), mỗi câu / vế chỉ tìm từ một lần, các cụm được hỏi theo thứ tự vị trí. Ghi chú một dòng 36 003 ký tự: tốt nhất 1,8 ms ("độc thân" × 4 000) và 0,8 ms ("có 2 con và" × 3 000) ở Home PC. Trước sửa: 2 296 ms và 945 ms.
- **DR6-78:** Mock trích xuất bớt đề xuất sai. Vẫn giữ nguyên tắc "Narrow on purpose" (CX-A4): thà không đề xuất còn hơn đề xuất sai.
  - Người khác (`SOMEONE_ELSE`, trước cụm trong câu): em; anh trai / họ / rể / ruột / của; chị gái / họ / dâu / ruột / của; ông, bà, cô, chú, bác, dì, cậu, mợ, thím, dượng, bố, mẹ, cha, má; ba (là cha: trước của / KH / má / mẹ / anh / chị / em / ấy); vợ, chồng; sếp, hàng xóm, cùng các từ cũ.
    - Không tính là người khác: "vợ chồng" và "KH và vợ / chồng", vì đó là hai vợ chồng có KH.
    - Cũng không tính các từ chứa từ thân tộc nhưng không chỉ ai: "bác sĩ", "cô giáo", "cô đơn", "chú ý", "chú trọng", và "ba" là số.
    - Từ có thể chính là KH ("Ông Hùng…", "Cô ấy…") thì không đề xuất. Đây là lựa chọn có chủ ý, ghi trong comment.
  - Giả định (`SUPPOSED`, trước cụm trong câu): nếu, giả sử, giả như, giả định, giá mà, giá như, lỡ như, nhỡ như, trường hợp.
  - Phủ định, ước muốn, dự định (`NOT_SO`, trước cụm trong vế): không, chưa, chẳng, muốn, mong, dự định, hy vọng ("KH muốn có 2 con").
  - "<n> con / bé / cháu" không là số con khi theo sau là con vật / đồ vật (`NOT_CHILDREN`, không phân biệt hoa thường: chó, mèo, bò, gà, cá, xe, tàu…), cùng "nội / ngoại / số" như cũ.
  - "độc thân" phải là một từ riêng. Bản quét một lượt làm "khôngđộc thân" (gõ dính) bị đề xuất, nay không còn.
- **DR6-89 (test hở gói C):**
  - R15d: unit trong `ai-analysis.test.ts`. Copy của phiên ChatGPT web bị giữ, trong lúc đó nhập backup cùng dữ liệu / cùng ID, rồi Kiểm tra và lưu → `discarded`.
  - R15b: e2e trong `customer-ai-web.spec.ts` (exe giả, `holdBackup`). Nạp lại chờ backup; mở hồ sơ KH seed "Phan Thanh Bình" (Nạp lại cùng ngày giữ nguyên ID); bấm ChatGPT web; thả backup → khung "Dán kết quả" biến mất, nút bật lại.
  - R21c: e2e trong `appointments.spec.ts`. Khối AI chi tiết lịch hẹn khi STALE có `lowestContrast(ai) ≥ 4,5`.
- **Hai file ngoài danh sách của Issue, Owner đã cho phép trong phiên (18/10/2026):** `lowestContrast` chuyển nguyên từ `e2e/customer-ai.spec.ts` sang `e2e/support.ts` để dùng chung (như CL2-C5 đề xuất), thay vì chép ~50 dòng. Helper được sửa theo L135 (xem dưới).
- Trước khi mở PR đã chạy một vòng review đối kháng (3 góc nhìn, mỗi phát hiện một người kiểm). Kết quả: 8 phát hiện được xác nhận, đều không chặn, đã sửa hết trong commit thứ ba. 1 phát hiện bị bác: ghi chú NFD, vì DB luôn lưu ghi chú NFC.

#### Test chấp nhận

- [x] Ghi chú một dòng 36 000 ký tự, trích xuất Mock < 50 ms: `mock-adapter.test.ts` "reads a one-line note of 36 000 characters…". Hai ghi chú, lấy lần tốt nhất trong 3 để runner CI bận không làm đỏ oan. Trước sửa ≈ 2,3 s / 0,9 s.
- [x] Mọi câu ví dụ của DR6-78 → 0 đề xuất: `it.each` 22 câu, gồm người khác (cả anh rể / vợ cũ của CX2-C1), con vật, giả định, ước muốn.
  - Câu đúng về KH vẫn đề xuất như cũ: mọi ca cũ giữ nguyên.
  - Thêm câu tách ("Ông nội KH mất sớm. KH đã kết hôn, có 2 con.").
  - Thêm câu có từ chứa từ thân tộc: "KH là bác sĩ, đã kết hôn, có 2 con.", "Chú ý: …", "KH và vợ / chồng …", "… ba năm …", "KH sống cô đơn, vẫn độc thân."
  - "!", "?", ";" và xuống dòng làm ranh giới câu cho người khác, giả định và phủ định (N19d).
- [x] Đột biến R15b, R15d, R21c có test đỏ. Đã chạy ở local rồi khôi phục file:
  - R15d (đọc `generation` sau hai `await`) → đỏ "ties the session to the data its input was taken from, though replaced while it copies (DR6-15)".
  - R15b (`const web = generation >= 0 ? opened : null`) → đỏ e2e DR6-15 mới (`toBeHidden`: khung vẫn hiện).
  - R21c (`faded={faded && false}`; bản `faded={false}` không qua `tsc` của `build:web`) → đỏ e2e lịch hẹn, 4,44 < 4,5. R21a (mờ 50 %) → 2,49, như số của review.
  - Thêm 30 đột biến của `mock-adapter.ts`, đều bị giết: ranh giới câu / vế, bỏ từng loại kiểm, từng ngoại lệ ("vợ chồng", "KH và vợ / chồng", "bác sĩ", "cô giáo", "cô đơn", "chú ý", "ba"), con vật hoa / thường, "độc thân" dính chữ, trần 20…

#### Ghi chú OPEN liên quan

- L22 (`e2e/appointments.spec.ts`, #163: nhóm trước → sau ở 6a, hộp 6h, link "Xem tất cả (n)"): để lại. Ngoài phạm vi (lịch hẹn, không thuộc AI / DR6-89); phần mockup cần sửa `AppointmentDialog.tsx`, ngoài file Issue cho sửa.
- L123 (`mock-adapter.ts` `SOMEONE_ELSE`: "con / cháu / bạn" trước cụm làm rơi dữ kiện của KH): để lại. Nếu bỏ "con" đứng sau số khỏi danh sách người khác thì "KH có 2 con trai đều đã kết hôn" sẽ bị đề xuất sai "Đã kết hôn". Mock cố ý hẹp (CX-A4), cùng hướng với DR6-78: bớt đề xuất sai, chấp nhận âm tính giả.
- L125 (`ai-panel-view.test.ts:398`, test gần như hiển nhiên): để lại. Ghi chú nói về `ai-panel-view.test.ts`, ngoài file Issue cho sửa; nó chỉ nhắc tới `ai-analysis.test.ts`.
- L135 (`e2e/customer-ai.spec.ts:21` `lowestContrast`: nền trong suốt một phần trong nhóm có `opacity` bị coi như nền đặc; màu `color(srgb …)` / `oklab(…)` bị đọc sai): đã sửa. Ghi chú yêu cầu sửa "trước khi dùng lại helper ở màn khác", mà PR này dùng lại nó ở chi tiết lịch hẹn.
  - Cách sửa: helper nay ở `e2e/support.ts`, ghép source-over có alpha ở mọi lớp (kể cả lớp đầu của nhóm và màu chữ), đọc màu qua canvas 1×1 (`getImageData`).
  - Kiểm bằng một spec tạm trên trang tự dựng (đã xóa), so với số tính tay: chữ đen trên trắng 21; nhóm 50 % 3,98; chữ trắng trên nền `rgb(0 0 0 / .5)` trong nhóm 85 % **3,10** (bản cũ: 15,08, vì coi là nền đặc); chữ `color(srgb 1 1 1)` trên nền đen 21.
  - Số trên app không đổi: R21a 2,49, R21c 4,44, bản đúng ≥ 4,5.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] `pnpm e2e` ở local:
  - Toàn bộ trên commit đầu: 238 / 239. Test đỏ là `customer-appointments.spec.ts:38`, ngoài phần đổi; nó đếm `rows.count()` không chờ, chạy riêng 3 / 3 xanh.
  - Trên head: 5 spec có khối AI (`customer-ai`, `customer-ai-web`, `appointments`, `customer-kyc`, `full-cycle`) 68 / 68 xanh.
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #659 — T-255: K20 mở rộng: khoảng trắng và ký tự vô hình Unicode (DR6-72)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

Mở rộng K20 (DR6-72) — Q4 đồng ý. `normalizeText`:

1. Gộp **mọi** khoảng trắng Unicode `White_Space`, thêm U+0085 (phần K20 chưa làm, DR6-49).
2. Bỏ mọi `\p{Default_Ignorable_Code_Point}` (gồm `\p{Cf}` và U+3164, U+115F, U+FFA0, U+034F, U+FE00–FE0F), và U+2800.
3. Lệnh, nhập backup và UI cùng dùng hàm này (như K20).

Hệ quả cần đúng:

- Tên chỉ gồm các ký tự trên → rỗng → bị từ chối như tên trống.
- "Sao Mai" + U+3164 trùng team "Sao Mai".
- Giá trị KYC chỉ là U+3164 không làm đổi cổng lên PAIN_POINT_ANALYSIS.

##### Bối cảnh

Deep review Phase 1–6 lượt 2 (T-225 #565), nhóm **L2-G** (Phương án 3, Owner 17/10/2026; Q4 đồng ý). Siết luật nên dữ liệu cũ có thể vi phạm: theo R2-02 / K1, áp ở mọi nơi (lệnh + kiểm khi nhập backup), Owner nạp lại dữ liệu giả lập. Không migration. Hash `tables` của dữ liệu tải có thể đổi: ghi số mới vào PR.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` §6.1 (DR6-72), §8.2 L2-G, §9 Q4
- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` (DR6-49, K20)
- `packages/domain/src/text.ts` + test
- `packages/db/src/common.ts` (`cleanText`, `requireName`), `packages/db/src/backup-validation.ts`

##### File / thư mục được phép sửa

- `packages/domain/src/text.ts` + test
- Test lệnh / nhập backup ở `packages/db/src/**` (`*.test.ts`)
- `packages/db/src/{common,backup-validation}.ts` (chỉ khi cần gọi đúng hàm)
- `tools/load-data*.mjs` hoặc chỗ ghi hash dữ liệu tải (chỉ để cập nhật hash, nếu có)

##### Interface / hợp đồng

- Chữ ký `normalizeText` không đổi.

##### Test chấp nhận

- [ ] Mỗi ký tự của DR6-72 (U+0085, U+3164, U+115F, U+FFA0, U+034F, U+FE00–FE0F, U+2800) → bị bỏ / gộp; tên chỉ gồm chúng bị từ chối; "Sao Mai" + U+3164 → `TEAM_NAME_TAKEN` (mã hiện có).
- [ ] Thuộc tính trên chuỗi ngẫu nhiên: `normalizeText(normalizeText(s)) === normalizeText(s)`; lệnh và nhập backup cho cùng kết quả.
- [ ] Hash dữ liệu tải mới ghi trong PR.

Ước lượng: ≈ 3–5 dòng SP + ≈ 40 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med

##### Bị chặn bởi

Không

## PR #686 — fix: drop every invisible character and gather all Unicode white space (T-255)

Trạng thái: MERGED · merge 2026-10-18T06:28:39Z · commit `9ac20cf6797f9973997be5c59a8b082b249b9b87` · nhánh `task/T-255-k20-unicode`

Closes #659

#### Thay đổi

- **DR6-72 (K20 mở rộng, Q4):** `normalizeText` (`packages/domain/src/text.ts`) đổi hai bước:
  - Bỏ `[\p{Cf}\p{Default_Ignorable_Code_Point}\u{2800}]`, trước đây chỉ `\p{Cf}`.
    - Lấy hợp hai tập vì `Default_Ignorable_Code_Point` không chứa hết `\p{Cf}`. Ví dụ U+0600–0605, U+06DD, U+110BD là `Cf` nhưng không thuộc DI. Như vậy luật "bỏ mọi `\p{Cf}`" của K20 vẫn giữ.
    - Nay bỏ thêm U+3164, U+115F, U+1160, U+FFA0, U+034F, U+FE00–FE0F, U+E0100–E01EF và U+2800.
  - Gộp `\p{White_Space}+`, trước đây `\s+`. `\p{White_Space}` gồm mọi ký tự của `\s` trừ U+FEFF (U+FEFF là `Cf`, đã bị bỏ ở bước trước) và có thêm U+0085.
- **Lệnh, nhập backup, UI:** không phải sửa gì, vì đều gọi hàm này:
  - lệnh: `cleanText` / `cleanNote` / `requireName`, `normalizeKycValue` của `domain`;
  - nhập backup: `storedAs` của `backup-validation.ts`;
  - UI: `CustomerDialogs`, `KycDialogs`, `TeamDialogs`, `kyc-view`.
- **Gộp hai ghi chú của sổ (cùng file, nhỏ):**
  - L144: `normalizeNote` tách dòng ở U+0085, U+2028, U+2029, cùng với CR / LF. Trước đây U+2028 / U+2029 bị gộp thành dấu cách, nên ghi chú KYC dán từ nguồn dùng hai ký tự này mất xuống dòng (trái quyết định 16/10). U+0085 (NEL) là ký tự cùng loại, và nay thuộc White_Space: không tách thì nó cũng thành dấu cách.
  - L145: `optionalText` (`common.ts`) kiểm qua `storable` (`isStorableText`) như `cleanText`. Nửa surrogate lẻ ở ghi chú / bước tiếp theo / lý do dời lịch hẹn nay là `INVALID_TEXT`, không còn bị lưu thành U+FFFD.
- **Hệ quả Owner nên biết (theo Q4, bỏ mọi DI):** emoji có VS16 (U+FE0F) mất kiểu hiện emoji, ví dụ "❤️" lưu thành "❤" và keycap "1️⃣" thành "1⃣". Ký tự gốc vẫn còn.

#### Test chấp nhận

- [x] Mỗi ký tự của DR6-72 bị bỏ hoặc gộp:
  - `text.test.ts`: U+3164, U+115F, U+FFA0, U+034F, U+FE00–FE0F (cả 16) và U+2800 nằm trong tên → bị bỏ, đứng một mình → rỗng. "Bình" + U+0085 + "Minh" → "Bình Minh".
  - Tên chỉ gồm các ký tự đó bị từ chối: `team.test.ts` → `NAME_REQUIRED` cho team và nhân sự; `customers.test.ts`: KH tên là U+2800 → `NAME_REQUIRED`.
  - `team.test.ts`: "Sao Mai" + U+3164, "Sao" + U+0085 + "Mai" và một tên trộn U+115F / U+034F / U+FE0F / U+FFA0 → `TEAM_NAME_TAKEN`.
  - `kyc.test.ts`, KH đủ 5 hạng mục (cổng `PROFILE_DISCOVERY`): `mainConcern` là U+3164, hai U+2800, hay U+FE0F + U+0085 → `INVALID_KYC_VALUE`, cổng vẫn `PROFILE_DISCOVERY`. Giá trị thật → `PAIN_POINT_ANALYSIS`, chứng tỏ KH thiếu đúng một hạng mục.
- [x] Thuộc tính trên chuỗi ngẫu nhiên (seed cố định, MINSTD; không thêm dependency):
  - `text.test.ts`, 2 000 chuỗi lấy từ bảng ký tự: chữ, dấu tổ hợp, emoji, ký tự NFC đổi (U+0340, U+2126), mọi loại khoảng trắng / xuống dòng, `Cf`, DI (kể cả U+E0100), U+2800, nửa surrogate.
    - `normalizeText(normalizeText(s)) === normalizeText(s)`.
    - Kết quả không còn White_Space / DI / `Cf` / U+2800 ngoài dấu cách đơn, không có dấu cách ở đầu, ở cuối hay hai dấu liền nhau.
    - `normalizeNote` cũng ổn định.
  - `backup.test.ts`, 30 chuỗi ngẫu nhiên, kèm bản `normalizeText` / `normalizeNote` của mỗi chuỗi (có cả NUL và nửa surrogate):
    - Nhập backup nhận tên team / ghi chú KYC **đúng khi** lệnh (`renameTeam` / `addKycNote`) lưu nguyên chuỗi đó.
    - Test kiểm có cả ca nhận lẫn ca từ chối, để test không qua chỉ vì toàn ca bị từ chối.
- [x] Hash dữ liệu tải: `node tools/load-data.mjs` (mốc `2026-10-12`, seed `6`) chạy trên `main` `f59fe61` và trên head đều ra **`1c306cfb8203409337a5fa33c48306694581cb70355eb5526e4cf4f543589591`**, số dòng như cũ. Hash không đổi vì seed giả lập không có ký tự nào của DR6-72. Mốc trong `docs/metrics/phase-6.md` vẫn đúng.
- [x] Đột biến: gỡ phần sửa `text.ts` + `common.ts` → 5 test `domain` đỏ và 4 test `db` đỏ (team, KH, KYC, `optionalText`). Đã khôi phục file.

#### Ngoài phạm vi (đề xuất ghi vào sổ ở PR sổ sau review)

- `docs/design/phase-3-du-lieu.md:175` (spec Phase 3, dòng "Mọi lệnh có tên / chữ KYC") còn ghi luật K20 cũ: "bỏ ký tự định dạng vô hình (`\p{Cf}` …), mỗi chuỗi khoảng trắng (cả NBSP, tab)". Dòng này chưa nêu DI, U+2800, U+0085, cũng chưa nêu việc ghi chú tách dòng ở U+0085 / U+2028 / U+2029. `docs/design` không nằm trong danh sách file Issue cho sửa → sửa ở #663 (T-259, tài liệu) hoặc một PR docs riêng.
- `tools/notes-core.mjs:135` (regex mục `^( *)- (.*)$`): `.` không khớp U+2028 / U+2029. Mục L144 của sổ chứa nguyên văn hai ký tự đó nên `notes-for` không liệt kê nó, cả `notes-for 659` lẫn `--diff`. Mục này vẫn là "Trùng file" của `text.ts` (xem dưới) → thuộc #660 (T-256, công cụ) hoặc làm sau.

#### Ghi chú OPEN liên quan

- L143 (`text.ts:24`, bỏ `\p{Cf}` làm tách emoji ghép ZWJ / ZWNJ): để lại. Đây là luật Owner chọn (#604). Q4 mở rộng cùng hướng (bỏ mọi DI; U+200C / U+200D cũng thuộc DI). Ghi chú chỉ cần xem lại khi có tên thật dùng emoji ghép.
- L145 (`common.ts:56`, `optionalText` nhận nửa surrogate lẻ): đã sửa.
- L144 (`text.ts:36`, `normalizeNote` gộp U+2028 / U+2029 thành dấu cách; `notes-for` bỏ sót, xem trên): đã sửa.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] `pnpm e2e` ở local, 6 spec có tên / KYC / backup (`team`, `customers`, `customer-forms`, `customer-kyc`, `backup`, `appointment-outcome`): 70 / 70 xanh
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #660 — T-256: Công cụ: cổng tested base, retro.mjs, múi giờ, probe Thùng rác (DR6-85, 86, 92, 98)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

1. **Cổng "tested base" đọc đủ commit (DR6-85).** `pr-status` / `merge-pr` đọc `gh api compare` một lần, không phân trang, không so `total_commits`. Theo tài liệu REST, danh sách có tối đa 250 commit, nên commit code ở phần cũ hơn không chặn. Sửa: đọc `total_commits` (hoặc phân trang tới đủ). Đọc thiếu → chặn, như danh sách file PR (DR6-57).
2. **`retro.mjs` đọc mọi thư mục cấu hình (DR6-86, KNOWN #642).**
   - Đọc mọi `~/.claude*` có `projects\` cùng `CLAUDE_CONFIG_DIR`. Home PC có `.claude`, `.claude-b`, `.claude-c`.
   - Khử trùng bằng đường dẫn thật (`realpathSync.native`), để dạng 8.3 / khác hoa thường không đếm đôi.
   - In các thư mục đã đọc. `docs/metrics/README.md` dòng 24 sửa theo.
3. **Test múi giờ (DR6-92).** Ca `backup-invariants.test.ts:1078` đặt đồng hồ 11:00 UTC thay 10:00, để xanh cả ở UTC−11 (Pago Pago), đúng khoảng UTC−11…+12 mà comment DR-15 (#644) hứa.
4. **Probe hiệu năng `trash.open` (DR6-98, phần code).** `e2e/perf/probe.perf.ts` đo `trash.open` khi đã ngắt DevTools (hoặc đo cả hai, ghi rõ). Gắn DevTools làm thao tác nhiều câu SQL chậm ×2,4–3,3. `e2e/perf/README.md` ghi câu đó.

5. **Ghi chú review PR #642 cùng file** (`docs/state/review-notes.md`, mục "Năm ghi chú không chặn của review PR #642"): `mergeBlockers` không ném khi `testedBase` là `null`; `pr-status` chỉ báo "noted no tested" khi PR còn mở; ghi lại ca `changedFiles` / danh sách file đọc ở hai lệnh. Mục `projectRoots` là mục 2 ở trên.

##### Bối cảnh

Deep review Phase 1–6 lượt 2 (T-225 #565), nhóm **L2-H** (+ phần probe của DR6-98 theo Phương án 3, Owner 17/10/2026). Cổng merge là lớp kiểm "REVIEW PASS đúng head", nhưng ca > 250 commit hiếm → `risk:low`. Phần API là PLAUSIBLE theo tài liệu GitHub: test bằng `gh` giả. Số đo mốc Home PC lượt 2 ghi ở `docs/metrics/phase-6.md` do T-225 làm.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` §5.3 (DR6-84 cách đo), §6.5 (DR6-85, 86), §6.7 (DR6-92, 98), §8.2 L2-H
- `docs/state/review-notes.md` KNOWN #642
- `tools/{pr-status,pr-core,merge-pr,retro,retro-core}.mjs` + test
- `docs/metrics/README.md`
- `packages/db/src/backup-invariants.test.ts` (ca dòng 1078)
- `e2e/perf/{probe.perf.ts,README.md}`

##### File / thư mục được phép sửa

- `tools/{pr-status,pr-core,merge-pr,retro,retro-core}.mjs` + test cạnh chúng
- `docs/metrics/README.md`
- `packages/db/src/backup-invariants.test.ts`
- `e2e/perf/{probe.perf.ts,README.md}`
- `docs/state/review-notes.md` (KNOWN #642 → RESOLVED)

##### Interface / hợp đồng

- `pr-status` in thêm số commit đã đọc / tổng khi chặn vì đọc thiếu.

##### Test chấp nhận

- [ ] Ca 251 commit sau bản đã test, code ở phần cũ → chặn; đọc thiếu → chặn kèm lý do.
- [ ] Ba thư mục cấu hình giả đọc đủ; cùng thư mục qua dạng 8.3 / khác hoa thường không đếm đôi.
- [ ] Cả bộ unit của `packages/db` xanh dưới `TZ=Pacific/Pago_Pago`.
- [ ] Hai ghi chú code của #642 (`testedBase` null, PR đã đóng) có test.
- [ ] Probe ghi `trash.open` khi không gắn DevTools; README có câu về DevTools.

Ước lượng: ≈ 15–30 dòng `tools/` + probe + ≈ 60 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #689 — fix: read every commit since the tested base, every config folder, trash.open detached (T-256)

Trạng thái: MERGED · merge 2026-10-18T07:25:40Z · commit `bbb20b17fb4b85d50f19f2f9519275c682dde6f5` · nhánh `task/T-256-tools-tested-base-retro-tz-probe`

Closes #660

#### Thay đổi

- **DR6-85, cổng "tested base" đọc đủ commit** (`tools/pr-status.mjs`, `tools/pr-core.mjs`, `tools/merge-pr.mjs`):
  - `loadMainSince` đọc `compare/<tested>...<base>?per_page=100` qua `gh api --paginate`, jq `{total: .total_commits, shas: [.commits[].sha]}` một dòng mỗi trang. Kết quả có `mainTotal` = `total_commits`.
  - `mergeBlockers` chặn khi `mainSince.length < mainTotal`, hoặc GitHub không cho số đếm: "Read n of the m commits main got since …: gh pr update-branch …". Dòng `tested` của `pr-status` in thêm ", only n read" khi đọc thiếu (hợp đồng của Issue).
  - `merge-pr` và `pr-status` cùng lấy blocker qua `loadedBlockers(loaded, { owner, mode })`. Nhờ vậy số đếm luôn tới `merge-pr`, và đường nối này có test.
  - **Đã kiểm trên GitHub thật (DR6-85 từ PLAUSIBLE thành CONFIRMED):** `compare/605157a...main` có `total_commits` 268.
    - Không phân trang: trả 250 commit, bắt đầu từ commit cũ thứ 19, tức 18 commit cũ nhất bị bỏ, đúng như tài liệu REST.
    - Có `per_page=100` + `--paginate`: 3 dòng (100 / 100 / 68), đủ 268 commit theo thứ tự thời gian, mọi trang cùng `total` 268.
    - So sánh rỗng trả một dòng `{"shas":[],"total":0}`.
- **Ghi chú review #642:**
  - `testedBase` null không còn ném lỗi, vì mọi phép kiểm `mainSince` nằm trong `if (testedBase)`.
  - "noted no tested" chỉ báo khi PR còn mở. `pr-status 686` / `688` (đã merge) giờ chỉ báo "PR is MERGED, not open."
  - Ca hai lần đọc `changedFiles` / danh sách file: ghi lại bằng comment ở `loadPr`.
- **DR6-86, `retro.mjs`** (`tools/retro.mjs`, `tools/retro-core.mjs`, `docs/metrics/README.md`):
  - `projectRoots(env, home, names, realpath)` đọc mọi `~/.claude*` có `projects/` cùng `CLAUDE_CONFIG_DIR`. Khử trùng bằng `fs.realpathSync.native`, vì `realpathSync` thường không đổi dạng 8.3 / hoa thường. Chỉ nhận thư mục.
  - README dòng 24 sửa theo.
  - **Chạy thật ở Home PC** với `CLAUDE_CONFIG_DIR=C:\Users\<user-8.3>\.CLAUDE`:
    - Trước sửa: đọc `<user-8.3>\.CLAUDE\projects` và `<user>\.claude\projects`, tức cùng một thư mục hai lần, và bỏ `.claude-b`, `.claude-c`.
    - Sau sửa: `.claude`, `.claude-b`, `.claude-c`, mỗi thư mục một lần.
- **DR6-92:** đồng hồ của ca "imports again after each main command…" trong `backup-invariants.test.ts` đổi 10:00 → 11:00 UTC, như `setup()`.
- **DR6-98, probe** (`e2e/perf/probe.perf.ts`, `e2e/perf/README.md`):
  - `trash.open` đo khi đã ngắt DevTools (`detached`, ngưỡng 200 ms), trong vòng riêng **sau** `memory.js-heap`. Lý do: mỗi lần nối lại để lại script của Playwright trong heap (≈ 0,5 MB) tới lần tải lại kế. Đo trong vòng chính thì `memory.js-heap` sẽ tăng ≈ `PERF_RUNS` × 0,5 MB.
  - `trash.kind-appointments` vẫn đo khi gắn, vì chỉ lọc trên các dòng đã đọc.
  - README có câu về DevTools (×2,4–3,3 với thao tác nhiều câu SQL, lệch tăng theo số dòng). Câu này nói rõ số `trash.open` trước T-256 là số khi gắn.
- Trước khi mở PR đã chạy một vòng review đối kháng: 4 góc nhìn, mỗi góc một người kiểm, cộng một vòng đột biến và một phiên tìm nguyên nhân của phát hiện UTC+12 bên dưới.
  - 1 phát hiện chặn, đã sửa: heap của probe, như trên.
  - Các phát hiện không chặn / nit trong phạm vi đã sửa ở commit thứ hai: fake `gh` trả một trang cho so sánh rỗng, ca PR không có commit mới, `realpath` chỉ nhận thư mục, chữ JSDoc / comment / README.
  - Phát hiện ngoài phạm vi ghi ở mục cuối.

#### Test chấp nhận

- [x] Ca 251 commit sau bản đã test, code ở phần cũ → chặn; đọc thiếu → chặn kèm lý do:
  - `pr-core.test.mjs` "stops a code PR until it read every commit main got since the tested main (DR6-85)": đủ 251 → chặn "main got code … (0000000)"; 250 mới nhất / 251 → chặn "Read 250 of the 251 commits"; không có số đếm (`null` / `undefined`) → "Read 0 of the ? commits"; đọc thiếu và có code cùng lúc → hai dòng.
  - `pr-status.test.mjs` (`gh` giả, phân trang như tài liệu REST): đọc đủ ba trang → dòng `tested … 251 commit(s)` và chặn vì code; GitHub liệt kê 250 / 251 → `only 250 read` và chặn; không có `total_commits` → `? commit(s)`; 0 commit → `ready`.
- [x] Ba thư mục cấu hình giả đọc đủ; cùng thư mục qua dạng 8.3 / khác hoa thường không đếm đôi:
  - Test `retro-core.test.mjs` "the projects folders read (DR6-58, DR6-86)", ba ca. `realpath` giả theo cách `realpathSync.native` chạy trên Windows; `~/Documents/projects` không được đọc.
  - Chạy thật ở Home PC như trên.
- [x] Cả bộ unit của `packages/db` xanh dưới `TZ=Pacific/Pago_Pago`: trước sửa 550 / 551 (đúng ca này, `OUTCOME_IN_FUTURE`), sau sửa 551 / 551. Cả bộ unit của repo dưới Pago Pago: 3 021 / 3 021.
- [x] Hai ghi chú code của #642 có test: `pr-core.test.mjs` "reads no tested main as unknown, and says so of an open PR only (#642)" và `pr-status.test.mjs` "reads no tested main for a PR that is no longer open…".
- [x] Probe đo `trash.open` khi không gắn DevTools: `trashOpen()` → `detached('trash.open', …)`. README có câu về DevTools. **Chưa chạy probe trên exe** (cần exe release + dữ liệu tải, cửa sổ exe ở trên cùng vài phút); `tsc` / eslint của `pnpm verify` qua. Lần đo lại mốc Home PC trước G7 (HANDOFF bước 3) sẽ chạy nó.
- Đột biến: 14 đột biến do tác giả liệt kê đều bị giết (bỏ `per_page`, bỏ `--paginate`, lấy số đếm từ số SHA, bỏ blocker đọc thiếu, bỏ kiểm `Number.isInteger`, bỏ `pr.state === 'OPEN'`, bỏ `!notesOnly`, bỏ `realpath`, chỉ `.claude`, bỏ `CLAUDE_CONFIG_DIR`…). Sau khi thêm assertion, các đột biến sống của vòng review cũng bị giết: `?? 0`, `null commit(s)`, `merge-pr` không chuyển số đếm, bỏ lọc `.claude*`, chỉ báo code khi đã đọc đủ. Còn hai đột biến sống:
  - `pages.at(-1)` thay `pages[0]`: tương đương, vì mọi trang cùng `total`.
  - `realpathSync` thay `.native` trong `retro.mjs`: phần I/O, theo `.claude/rules/tests.md` không unit test. Đã kiểm bằng lần chạy thật trên.

#### Ghi chú OPEN liên quan

- L43 (`backup-invariants.test.ts`, ca "13: evidence when the input has no facts list"): đã sửa. Đổi tên thành "13: an input that is not an analysis input".
- L75 (`tools/pr-core.test.mjs:102`, regex R2-21 của `CODE_DOCS`): để lại. PR không thêm test nào đọc docs theo dạng khác (`pr-status.test.mjs` không đọc docs), nên điều kiện "khi có test đọc docs kiểu khác" chưa tới.
- L99 (`tools/merge-pr.mjs:12-13`, header không nhắc ngoại lệ sổ ghi chú): đã sửa. Header thêm "a PR that only writes the review notes ledger needs none, T-215" và điều kiện đọc thiếu commit (DR6-85).
- L100 (`tools/pr-status.mjs:94`, dòng `(review notes only: not needed)` chưa có test; bỏ "NOT the head" khi `isNotesOnly`): đã sửa. `formatStatus` không còn so REVIEW với head khi PR chỉ sửa sổ ghi chú; test "does not ask a review notes PR to review its head again (T-215)".
- L110 (`probe.perf.ts:22`, `PERF_RUNS` không được kiểm): đã sửa. Probe dừng ngay khi `PERF_RUNS` không phải số nguyên ≥ 1.
- L111 (`probe.perf.ts:228`, `importBackup` với `start = NaN`): đã sửa. Không có sự kiện `change` → báo "backup.read: no file picked for …" thay vì treo tới timeout; quá 60 s → "no confirmation after 60 s".
- L144 (`backup-invariants.test.ts`, nhãn "a KYC note with a line of spaces kept"): đã sửa. Đổi thành "a KYC note with a space at the end of a line".
- L148 (`pr-core.mjs:177`, `testedBase.slice` khi null): đã sửa (xem Thay đổi, #642).
- L149 (`pr-status.mjs:47`, "noted no tested" cho PR đã merge / đóng): đã sửa (xem Thay đổi, #642).
- L150 (`pr-status.mjs:68`, `changedFiles` và danh sách file đọc ở hai lệnh): đã ghi lại, như ghi chú yêu cầu. Comment ở `loadPr` nói rõ: push đổi số file → chặn "Read n of the m files", chạy lại; push khác → lần merge vẫn ghim head đã đọc (`--match-head-commit`).
- L151 (`retro-core.mjs:200`, khử trùng bằng so chuỗi): đã sửa, bằng `realpathSync.native` thay cho "so chữ thường" mà ghi chú đề xuất. CL2-F4 cho thấy so chữ thường không bắt được dạng 8.3.

Issue cho sửa `docs/state/review-notes.md` (KNOWN #642 → RESOLVED), nhưng theo `CLAUDE.md` (T-261) PR code không chuyển mục của sổ. Các mục "đã sửa" trên chuyển sang RESOLVED ở PR sổ sau review.

#### Phát hiện ngoài phạm vi (đề xuất ghi vào sổ ở PR sổ sau review)

- **`packages/db/src/seed.test.ts` đỏ ở UTC+12 trở lên** (Etc/GMT-12, Pacific/Auckland, Fiji, Kiritimati…). Ca "writes the same data for the same anchor day and seed…" so `contentHash` với `DEMO_HASH` đã ghim.
  - Nguyên nhân: `middayOf` (`seed.ts:627`) chủ ý dùng 12:00 giờ địa phương khi 12:00 UTC đã sang ngày khác, nên mọi mốc thời gian và phần thời gian của mọi ULID lùi 12–14 giờ. Ngày (`yyyy-mm-dd`) và mọi cột khác không đổi.
  - Header `seed.ts` đã ghi giới hạn "UTC−12 tới UTC+11". Nhưng ghim hash (T-216, #566) không cố định múi giờ.
  - Vì vậy comment DR-15 (`test-support.ts:10`) và Mục tiêu 3 của Issue này ("UTC−11…+12") chỉ đúng cho `setup()`: cả bộ `packages/db` hiện chỉ xanh từ UTC−11 tới UTC+11. Cả bộ unit của repo dưới UTC+12: 3 020 / 3 021, chỉ ca này đỏ.
  - Sửa nhỏ (≈ 3–5 dòng test): ca đó seed trong `inTimeZone('UTC', …)` (hàm có sẵn trong file), comment cạnh `DEMO_HASH`. Tùy chọn: thêm giới hạn UTC−12…+11 vào câu "same on any machine" của `tools/load-data*.mjs`. Ngoài file Issue cho sửa → Issue riêng.
- **`.claude/rules/tests.md:17`** ghi "phần I/O (`gh`, `git`) không unit test", nhưng `tools/pr-status.test.mjs` giả `run` của `session-io` để test `loadPr` (Issue yêu cầu "test bằng `gh` giả"). Nên sửa câu luật: I/O không bắt buộc test; khi cần thì giả `run` như `pr-status.test.mjs`.
- **`.claude/rules/ci.md:12` / `CLAUDE.md`** tả cổng "tested base" mà chưa nói danh sách commit `main` sau bản đã test cũng đọc đủ trang và đọc thiếu thì chặn (DR6-85). Chưa sai, chỉ thiếu.
- **Có từ trước (không do PR này):** commit trên `main` đổi tên file code thành đường dẫn `docs/` / `.md` bị coi là docs-only. Lý do: `.files[].filename` chỉ có tên mới, tên cũ ở `previous_filename`. Danh sách file của PR cũng vậy. Lịch sử `main` hiện không có commit đổi tên nào. Sửa: jq `.files[] | .filename, (.previous_filename // empty)`.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (3 023 test)
- [x] Unit dưới `TZ=Pacific/Pago_Pago`: `packages/db` 551 / 551, cả repo 3 021 / 3 021
- [x] `node tools/pr-status.mjs 686` / `688` và `node tools/retro.mjs` chạy thật như trên
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #661 — T-257: Đợt G5: ký tự vô hình V3–V6, bỏ dấu khớp nhầm, chi tiết V1, trần chuỗi gốc, kỉ / qui (DR6-17, 23, 24, 77, 102)

Trạng thái: CLOSED · nhãn: type:task, risk:med, gate, ready-for-agent

##### Mục tiêu

Một đợt sửa G5 (guardrail + message thử lại) gom năm mục đã hoãn hoặc cần G5:

1. **DR6-17 — ký tự vô hình làm lọt V3–V6.**
   - Chuẩn hóa lại (NFKC) **sau** khi bỏ ký tự vô hình. Hiện NFKC chạy trước, nên NFD có U+200B chen trước dấu tổ hợp lọt cả V3, V4, V5, V6, kể cả nhận diện tin nhắn của app ở `checkWebAnswer`.
   - Khoảng trắng trong mẫu V6 (`Điều\s+…`, `Luật\s+…`, `khoản\s+… điều`) khớp cả chỗ chỉ có ký tự vô hình (U+200B / U+2060).
   - Tập ký tự vô hình nên trùng tập của K20 mở rộng (T-255): `\p{Default_Ignorable_Code_Point}`.
2. **DR6-23 — bản bỏ dấu khớp nhầm câu thường.** Xét chuyển "hướng nội", "hướng ngoại", "nghị định" (và các cặp khác trong DR6-23 nếu cần) sang "Bỏ dấu: không" như "nghị quyết". Ví dụ khớp nhầm: "định hướng nơi ở", "nghĩ định cư", "khách nông thôn", "sẵn sàng kỹ".
3. **DR6-24 — chi tiết V1 nêu dạng đúng.** `detail` đi vào message thử lại (G5 §5) nêu dạng đúng: mã `F12`, giá trị enum `PSYCHOLOGY` / `ESOTERIC`…, để lần thử lại không trượt tiếp thành REJECTED.
4. **DR6-77 — trần chuỗi gốc của V1.** Sau DR6-16, V1 đếm 300 trên chữ đã bỏ `\p{Cf}` nhưng lưu chữ gốc, không còn trần cho chuỗi gốc: 300 chữ + 650 000 × U+200B được nhận, ≈ 2 MB vô hình vào `ai_analyses` (chỉ thêm, không xóa) và mọi backup. Sửa: lưu chữ đã bỏ ký tự vô hình, hoặc thêm trần cho chuỗi gốc. Chọn trong đề xuất G5.
5. **DR6-102 — `LAW_NAME` miễn chính tả i / y.** Miễn cả "kỉ luật", "qui luật" như "kỷ", "quy". Hiện "kỉ luật Thép", "qui luật Thị trường" bị V6 chặn nhầm.

Ca kiểm mới thêm vào G5 §8.5.

##### Bối cảnh

Owner 17/10/2026: Phương án 3 (sửa hết) gồm "một đợt G5 (DR6-17, 23, 24, 77, 102)" (bản tổng hợp lượt 2 §8.5). DR6-17, 23, 24 là mục hoãn của lượt 1 (`review-notes.md`). Cách làm như T-197 (#491):

1. Phiên đầu viết **đề xuất sửa `docs/design/phase-5-prompts.md`** (mục §10 mới: bảng chặn, cách so khớp §7, V1, message thử lại, version nếu chữ prompt / message đổi) → **dừng, Owner duyệt G5**.
2. Sau duyệt: một PR gồm tài liệu + code + test. Tài liệu G5 được test so nguyên văn và tính là code ở CI.
3. Eval: CI chạy eval Mock. Eval AI thật chạy ở G7 trên SHA phát hành (spec Phase 6 §1 mục 4).

Siết luật → dữ liệu cũ có thể vi phạm: theo R2-02 / K1, áp ở mọi nơi, Owner nạp lại dữ liệu giả lập. Làm sau T-255 để dùng chung tập ký tự vô hình.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` §6.3 (DR6-77), §6.7 (DR6-102), §8.4, §8.5
- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.3 (DR6-16, 17, 23, 24), §8.4
- `docs/state/review-notes.md` mục DR6-17, DR6-23, DR6-24
- `docs/design/phase-5-prompts.md` (toàn bộ, nhất là §5, §7, §8, §8.5, §10); `docs/design/phase-5-ai.md` §6; `docs/golden/ai-eval.md`
- Issue #491 (T-197, đợt G5 trước): cách chia bước
- `packages/ai/src/{text-match,blocklists,validator,schema,web}.ts`, `packages/ai/src/prompts/**`

##### File / thư mục được phép sửa

- `docs/design/phase-5-prompts.md`, `docs/design/phase-5-ai.md` §6
- `packages/ai/src/**` + test, `packages/ai/CLAUDE.md` (codemap)
- `packages/db/src/**` chỉ nơi kiểm output AI khi nhập backup (nếu V1 đổi) + test
- `docs/golden/ai-eval.md`, `tools/fixtures/ai-eval.mjs`, `tools/eval-ai-core.test.mjs` (nếu ca eval đổi)
- Hệ quả nếu version đổi: `e2e/customer-ai*.spec.ts`, `apps/desktop/src/data/ai-analysis.test.ts`, `apps/desktop/src/routes/customers/ai-panel-view.test.ts`, `packages/db/src/seed.ts`
- `docs/state/review-notes.md` (DR6-17, 23, 24 → RESOLVED)

##### Interface / hợp đồng

- Hàm chuẩn hóa so khớp V3–V6 dùng chung (như §10.2 của đợt trước); `prompt_version` tăng nếu chữ prompt / message thử lại đổi.

##### Test chấp nhận

- [ ] Có đề xuất G5 và Owner duyệt trước khi sửa code.
- [ ] Ca DR6-17 (NFD + U+200B trước dấu; V6 với U+200B / U+2060 giữa chữ) bị chặn ở V3–V6 và ở nhận diện tin nhắn của app.
- [ ] Các câu thường của DR6-23 không bị chặn; ca chặn có sẵn vẫn chặn.
- [ ] Lần thử 2 nhận `detail` nêu dạng đúng (unit message thử lại).
- [ ] 300 chữ + 650 000 × U+200B: không lưu ≈ 2 MB (bị cắt / từ chối theo đề xuất duyệt).
- [ ] "kỉ luật Thép", "qui luật Thị trường" không bị V6 chặn.
- [ ] Eval Mock xanh; ca kiểm mới có trong G5 §8.5.

Ước lượng: ≈ 60–100 dòng SP + tài liệu G5 + ≈ 200 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med

##### Bị chặn bởi

#659

## PR #698 — feat(ai): second Phase 6 G5 round — analysis@3, discovery@3 (T-257)

Trạng thái: MERGED · merge 2026-10-18T18:08:56Z · commit `8f7355ba8aecaf05791eb921d107185e2322ef6a` · nhánh `task/T-257-g5-round-2`

Closes #661

Đợt G5 Phase 6 lượt 2. **Owner duyệt G5 18/10/2026** ("duyệt hết", gồm thêm `e2e/full-cycle.spec.ts` vào file được phép). Đề xuất, lý do và số đo ở `docs/design/phase-5-prompts.md` §11; các thay đổi đã chép vào §2, §3 (version), §5, §6a, §7, §8 (ca C55–C72 ở §8.5) và spec `phase-5-ai.md` §6.2, §6.4.

#### Thay đổi

- **Version:** `analysis@3`, `discovery@3` (chữ prompt không đổi; đổi luật kiểm). `extraction@1`, `web@1` giữ → ChatGPT web lưu `analysis@3+web@1`. Seed lấy version từ `PROMPT_VERSIONS` nên tự theo; mốc hash seed (`seed.test.ts`) đổi theo như T-237.
- **DR6-17 — ký tự vô hình (G5 §7 bước 0, §11.2):** `cleanText` = `normalizeText` của K20 (bỏ `\p{Cf}`, `\p{Default_Ignorable_Code_Point}`, U+2800; gộp mọi khoảng trắng Unicode) **rồi** NFKC, nên dấu tổ hợp viết sau U+200B vẫn ghép vào chữ. Áp cả cho dòng dán ChatGPT web (tin nhắn của app viết NFD + U+200B → `OWN_MESSAGE`). Bốn mẫu V6 ("Điều <số>", "khoản … điều", "điểm … khoản", "luật <Tên>") dùng `\s*`: hai phần dính nhau sau khi bỏ ký tự vô hình vẫn khớp.
- **DR6-23 — bản bỏ dấu (G5 §7 mục 2–3, §11.3, phương án A):** mục "Bỏ dấu: có" khớp khi **mỗi chữ** viết đúng như mục hoặc viết không dấu. Bỏ "bản bỏ dấu của cả câu" trong `text-match.ts`: mỗi mục / mẫu "có" được dựng thành regex chạy trên bản có dấu, mỗi chữ là "đúng dấu hoặc không dấu" (`bareToo`). Hết chặn nhầm "định hướng nơi ở", "nghĩ định cư", "khách nông thôn", "sẵn sàng kỹ", "bỏ luật sư"…; vẫn chặn "nghi dinh", "khach nong", "Xác suat". Không đổi cột "Bỏ dấu" của mục nào.
- **DR6-102:** "kỉ", "qui" vào ngoại lệ trước "luật".
- **DR6-77 — V1 (§11.5, phương án A):** chuỗi gốc ≤ 1 000 ký tự (đếm `length`, kiểm trước, không cấp phát theo cỡ chuỗi); phần thấy được = `normalizeText` (tập K20), 1–300 ký tự; `text` analysis / discovery phải có chữ cái trong phần thấy được (U+3164 không còn đạt). Giá trị lưu vẫn là chuỗi model viết. `db` không đổi code: lệnh và nhập backup dùng cùng schema, nên 300 chữ + 650 000 × U+200B bị từ chối ở cả hai.
- **DR6-24 — `detail` V1 nêu dạng đúng (§11.6):** "thiếu, cần array" (khóa thiếu; khóa enum thiếu "thiếu, cần một trong: …"), `value` trích xuất là chuỗi sai luật nhận lỗi của chuỗi, "sai định dạng, cần mã dữ kiện dạng F12", "giá trị không hợp lệ, cần một trong: PSYCHOLOGY, ESOTERIC", "sai kiểu, cần string, number hoặc boolean".
- Hệ quả version ở test app và e2e (`@2` → `@3`).

#### Test chấp nhận

- [x] Có đề xuất G5 và Owner duyệt trước khi sửa code (commit `d233f59` đề xuất, Owner duyệt 18/10, rồi `15df083`, `826b1f2`).
- [x] Ca DR6-17 (NFD + U+200B trước dấu; V6 với U+200B / U+2060 giữa chữ) bị chặn ở V3–V6 (C55–C57) và ở nhận diện tin nhắn của app (`web.test.ts`: khung NFD + ZWSP, Hangul filler, message thử lại NFD + ZWSP ở lần 2).
- [x] Các câu thường của DR6-23 không bị chặn (C62–C66); ca chặn có sẵn vẫn chặn (C1–C54, C67–C69, test bảng §8).
- [x] Lần thử 2 nhận `detail` nêu dạng đúng (`run.test.ts` "names the right form of each V1 issue in the retry").
- [x] 300 chữ + 650 000 × U+200B: V1 từ chối (C71), `recordAiAnalysis` và nhập backup từ chối (`ai-analyses.test.ts`, `backup-invariants.test.ts`).
- [x] "kỉ luật Thép", "qui luật Thị trường" không bị V6 chặn (C70).
- [x] Eval Mock xanh (`pnpm verify`); ca kiểm mới có trong G5 §8.5 (C55–C72).

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff` (17 mục "Trùng file"):

- L39 (`text-match.ts` / `validator.ts`, `phrase()` ghi tên mục vào `detail`, mục trùng phần nhau sinh hai issue): để lại — đổi chữ `detail` V3–V6 kéo theo bảng test §8; ngoài 5 mục G5 của Issue, ghi chú tự nói "code, không cần G5".
- L42 (`schema.ts:47` `isoDate` lặp `validDate`): để lại — ngoài phạm vi (schema đầu vào, không phải V1).
- L51 (`collapseSpaces` / `comparable`): để lại — V7 / màn trích xuất, ngoài phạm vi.
- L60 (`AI_ANALYSIS_NO_MODEL` / web): để lại — ngoài phạm vi.
- L61 (hai hằng 20 000): để lại — ngoài phạm vi.
- L63 (`customerId` + `kycVersionId`): để lại — ngoài phạm vi.
- L64 (phạm vi export của `run.ts`): để lại — ngoài phạm vi.
- L72 (`checkWebAnswer` kiểm `TOO_LONG` trước tin nhắn của app): để lại — thứ tự kiểm không đổi ở PR này, ngoài phạm vi.
- L118 (`ai-panel-view.test.ts:398` test gần hiển nhiên): để lại — file chỉ đổi chuỗi version, test thuộc DR6-15.
- L119 (`packages/ai/CLAUDE.md` dòng Validator chưa nói bỏ `\p{Cf}` trước khi đếm): **đã sửa** — dòng viết lại theo V1 mới (`normalizeText`, trần 1 000), cùng độ dài để bản đồ export không rút gọn.
- L120 (`KycIntelligence.tsx` tên state): để lại — ngoài phạm vi.
- L123 (`ai-analyses.test.ts:654` test migration): để lại — ngoài phạm vi.
- L154 (NIT `kyc-view.test.ts` chuỗi có ký tự vô hình thô): để lại — file khác; test mới của PR này đều viết ký tự vô hình bằng escape / `String.fromCodePoint`.
- L180 (`mock-adapter.ts` chia câu hai lần): để lại — ngoài phạm vi.
- L209 (**DR6-17**): **đã sửa** (bước 0 mới, `\s*` ở V6, C55–C61).
- L211 (**DR6-24**): **đã sửa** (`schemaDetail`, §11.6).
- L212 (DR6-25 `zod/mini`): để lại — hoãn sau v1.0 (Owner 15/10).

Ngoài danh sách "Trùng file": **DR6-23** (L210 của sổ, không nêu file) **đã sửa** theo phương án A của §11.3. PR sổ sau review: chuyển DR6-17, 23, 24 sang RESOLVED; ghi mới (i) REJECTED vẫn lưu được `output_json` lớn (G5 §11.8, cần G2), (ii) spec `phase-5-ai.md` §3.1 mục 3 còn chữ chuẩn hóa cũ (Issue chỉ cho sửa §6), (iii) `docs/README.md` còn ghi prompt `@1`.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (3 117 test; coverage `packages/ai` 100 %)
- [x] e2e liên quan xanh ở local (`customer-ai`, `customer-ai-web`, `full-cycle`: 27 / 27)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

**Review đối kháng trước PR** (workflow nhiều agent, Owner bật subagent / Workflow theo ADR-0001 phụ lục M8; không thay review phiên sạch). Năm hướng: đúng chữ G5, so khớp cũ ↔ mới trên mọi mục chặn và văn bản thật (eval, seed, `vi.ts`), V1 / `db`, ChatGPT web, đột biến test. Mỗi phát hiện có 3 người kiểm chứng tìm cách bác bỏ.

- **11 phát hiện đứng vững**, đã xử lý ở `826b1f2`: `value` trích xuất là chuỗi rỗng / quá trần từng nhận "sai kiểu" (giờ là lỗi của chuỗi); khóa enum thiếu nay "thiếu, cần một trong: …"; đột biến bỏ `abort: true` của trần 1 000 sống → thêm test; chưa có test U+2800 → thêm; ví dụ C60 ("Bảo" + U+034F + "Việt") không lọt ở `main` → đổi thành "… Minh" (lọt ở `main`, bị chặn ở PR này), số "luật hiện tại sai" 40 → 41; chữ §6.4 "chữ thường" thêm ngoại lệ "trên bản gốc"; §11.8 ghi hai giới hạn còn lại. Hai mục tài liệu ngoài file được phép (spec §3.1 mục 3, `docs/README.md`) để PR sổ ghi lại.
- **4 phát hiện bị bác** (đúng luật đã duyệt hoặc có từ trước, không hồi quy): ký tự trống có bề rộng làm dấu cách đầu cụm (ghi §11.8), backup sửa tay mang chuỗi lớn ở khóa lạ / khoảng trắng hai đầu (ghi §11.8), câu dán chỉ có ký tự vô hình vẫn tính một lần thử (không đổi), U+2028 / U+0085 làm xuống dòng không tách dòng (không đổi).
- Đột biến (worktree riêng, ở `15df083`): 30 đột biến, 27 bị giết. 3 sống: bỏ `abort: true` của trần 1 000 và `cleanText` không bỏ U+2800 (đã thêm test ở `826b1f2`); `isAt` dùng `in` thay `Object.hasOwn` (tương đương hành vi vì đầu vào từ `JSON.parse`, đường dẫn chỉ gồm khóa schema).

Rủi ro: `risk:med` (cổng G5; Owner merge)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #662 — T-258: Dọn sạch Thùng rác (DR6-84, Q8 c)

Trạng thái: CLOSED · nhãn: type:task, risk:high, gate, ready-for-agent

##### Mục tiêu

Thêm chức năng **"Dọn sạch Thùng rác…"** (Owner chốt 17/10/2026, Q8 phương án (c), thay "hoãn, theo dõi" cho DR6-84):

1. **Nút "Dọn sạch Thùng rác…"** ở đầu màn Cài đặt → Thùng rác. Dọn tất cả; không có xóa vĩnh viễn từng dòng.
2. **Hộp xác nhận.**
   - Đếm theo loại: KH, lịch hẹn, HĐ, nhân sự, team.
   - Nói rõ không hoàn tác được, và app tạo một bản backup trước khi dọn.
   - Nêu số bản ghi sẽ được giữ lại (mục 4), nếu có.
3. **Tự backup trước khi dọn.** Đi cùng đường "backup rồi mới thay dữ liệu" đang có của `app-data`: chờ lưu xong, chép file vào `backups\`, chặn lệnh ghi trong lúc dọn. Backup lỗi thì không dọn.
4. **Giữ bản ghi còn được dùng, kèm lý do.** Bản ghi trong Thùng rác mà dữ liệu không bị dọn vẫn trỏ tới thì giữ lại, dòng của nó ghi lý do (như dòng bị chặn TR-1).
5. **Dọn thật theo đúng thứ tự khóa ngoại, trong một transaction.**
   - Dòng KH: KH và mọi dữ liệu con — lịch hẹn, người phối hợp, chuyển nhóm, HĐ, ghi chú / dữ kiện / phiên bản KYC, phân tích AI — kể cả lịch / HĐ của KH đó đang thành dòng riêng.
   - Dòng lịch hẹn: lịch, người phối hợp, chuyển nhóm đã rút theo nó; xử lý lịch khác trỏ về nó (`rescheduled_from_id`).
   - Dòng HĐ, nhân sự, team.
   - Lỗi giữa chừng → không đổi gì.
6. **Nhắc khi Thùng rác lớn.** Từ 1 000 dòng, đầu màn hiện câu nhắc nên dọn (màn mở chậm dần theo số dòng, DR6-84).
7. **Đổi luật và tài liệu.**
   - Spec Phase 6 §4.2: TR-6 thành "Không tự dọn; người dùng dọn sạch được (hỏi trước, backup trước)". Thêm luật giữ lại và nhắc 1 000 dòng.
   - Mockup 11a: nút, câu nhắc, hộp xác nhận mới.
   - Phụ lục ADR-0008: append-only của `kyc_notes`, `kyc_facts`, `ai_analyses` có một ngoại lệ là dọn dữ liệu của KH đã xóa mềm.
   - Hướng dẫn sử dụng, danh sách nghiệm thu: thêm dòng cho chức năng mới.
8. **Migration nới trigger chỉ thêm.** `kyc_notes_no_delete`, `kyc_facts_no_delete`, `ai_analyses_no_delete` chỉ cho xóa dòng của KH đã xóa mềm. Mọi sửa / xóa khác vẫn bị chặn.

##### Bối cảnh

Deep review Phase 1–6 lượt 2 (T-225 #565): DR6-84, Thùng rác mở chậm tuyến tính. Exe không DevTools ≈ 0,09 ms / dòng: 1 313 dòng 138 ms, 200 ms ở ≈ 2 000 dòng (laptop chậm hơn ≈ 25 %). TR-6 hiện nay không cho xóa vĩnh viễn nên Thùng rác và file chỉ lớn lên (≈ 9–10 KB mỗi KH đã xóa kèm dữ liệu con).

Owner chốt 17/10/2026: nút dọn tất cả, hộp xác nhận đếm theo loại, tự backup trước, giữ bản ghi còn được dùng kèm lý do, nhắc khi quá 1 000 dòng. Không tự dọn theo trần (Owner bỏ hướng đó). Làm sau L2-A, L2-B1, L2-B2 (cùng luật / file Thùng rác).

Đây là đường mất dữ liệu vĩnh viễn duy nhất của app → `risk:high`. Cổng:

1. **PR docs trước:** spec TR-6 (G2), mockup 11a + hộp xác nhận (G3), phụ lục ADR-0008 (G1) → dừng, Owner duyệt.
2. **PR code sau:** migration + lệnh dọn + màn + test.

Chỉ số không đổi khi dọn, vì bản ghi đã xóa vốn không tính. Luật nhập backup không đổi.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` §5.3, §6.4 (DR6-84), §7.4, §9 Q8
- `docs/design/phase-6-hoan-thien.md` §4.2 (TR-1…TR-10, màn Thùng rác)
- `docs/design/mockups/trash.html` (11a–11g), `docs/design/mockups/README.md`
- `docs/decisions/0008-kyc-du-kien-co-cau-truc-va-cong-deterministic.md` (append-only), `docs/decisions/0016-luu-tru-sqljs-ghi-file-qua-rust.md`
- `packages/db/migrations/{0003_kyc_append_only,0008_ai_analyses_append_only_rebuilt}.sql`, `packages/db/src/{schema,trash,migrations,team}.ts`, `packages/db/CLAUDE.md` (cách thêm migration tự viết)
- `apps/desktop/src/data/app-data.ts` (`replace` / `swap`: backup trước khi thay dữ liệu, chặn ghi)
- `apps/desktop/src/routes/{SettingsTrash.tsx,trash-view.ts}`, `e2e/trash.spec.ts`
- `docs/user-guide/09-cai-dat.md`, `docs/testing/nghiem-thu-v1.md` (phần Thùng rác)

##### File / thư mục được phép sửa

- PR docs: `docs/design/phase-6-hoan-thien.md` §4.2, `docs/design/mockups/trash.html` (+ `mockups/README.md` nếu thêm khối), `docs/decisions/0008-kyc-du-kien-co-cau-truc-va-cong-deterministic.md` (phụ lục)
- PR code:
  - `packages/db/migrations/**` (migration tự viết mới), `packages/db/src/{migrations,trash,index}.ts` (hoặc file mới `packages/db/src/purge.ts`) + test, `packages/db/CLAUDE.md` (codemap)
  - `apps/desktop/src/data/app-data.ts` + test
  - `apps/desktop/src/routes/{SettingsTrash.tsx,trash-view.ts}` + test, `apps/desktop/src/i18n/vi.ts`
  - `e2e/trash.spec.ts`
  - `docs/user-guide/09-cai-dat.md`, `docs/testing/nghiem-thu-v1.md`

##### Interface / hợp đồng

- `@p2c/db`: một lệnh dọn (vd. `purgeTrash(db)`) trả số đã dọn theo loại và danh sách giữ lại kèm lý do; một hàm xem trước cho hộp xác nhận.
- `AppData`: dọn qua hàng đợi thay dữ liệu (backup trước, chặn ghi), trả tên file backup.
- Migration mới: tăng `LATEST_SCHEMA_VERSION`; DB cũ có dữ liệu mở được (test như "migrating a saved database").

##### Test chấp nhận

- [ ] Có PR docs (G1 / G2 / G3) đã được Owner duyệt trước PR code.
- [ ] Seed có Thùng rác đủ năm loại → dọn → Thùng rác rỗng (trừ dòng giữ lại); `PRAGMA foreign_key_check` rỗng; không còn dòng con nào của KH đã dọn ở mọi bảng.
- [ ] Dữ liệu sống không đổi: `exportBackup` của phần chưa xóa trước / sau dọn giống hệt; chỉ số Tổng quan / Báo cáo giống hệt.
- [ ] Trigger vẫn chặn sửa / xóa ghi chú, dữ kiện, phân tích AI của KH chưa xóa.
- [ ] Backup lỗi → không dọn, DB không đổi; lỗi giữa chừng dọn → DB không đổi.
- [ ] Hộp xác nhận đếm đúng theo loại; sau dọn có file mới trong `backups\` mở / nhập lại được và chứa dữ liệu trước dọn.
- [ ] Bản ghi còn được trỏ tới (nếu dựng được ca) được giữ, dòng ghi lý do.
- [ ] 1 000 dòng → có câu nhắc; 999 → không.
- [ ] Nhân sự chỉ còn dữ liệu của KH đã dọn → xóa được (nối với T-250).
- [ ] Thời gian dọn 1 313 dòng ghi trong PR.

Ước lượng: ≈ 120–200 dòng SP + migration + ≈ 250–300 dòng test (PR code); PR docs ≈ 80–150 dòng.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:high

##### Bị chặn bởi

#652, #653, #655

## PR #707 — docs: spec, mockup and ADR-0008 appendix to empty the trash (T-258)

Trạng thái: MERGED · merge 2026-10-18T20:33:55Z · commit `b4aebfa07e04cd9b43ef90501f9f0680c902aa4e` · nhánh `task/T-258-purge-docs`

Refs #662 — PR docs của T-258 (Q8 (c), DR6-84). **Cổng G1 / G2 / G3: Owner duyệt cả 6 đề xuất ngày 19/10/2026** (commit `df3384a` ghi vào spec, ADR-0008, README mockup và `docs/PROJECT-STATE.md`). PR code (migration + lệnh dọn + màn + test) làm sau khi PR này merge.

#### Thay đổi

- **Spec** `docs/design/phase-6-hoan-thien.md` §4.2 (G2):
  - **TR-6** thành "Không tự dọn; người dùng dọn sạch được (hỏi trước, backup trước)"; TR-9: hộp 5f bỏ "giữ nguyên, không bao giờ xóa" ở dòng Ghi chú KYC.
  - **TR-11** dọn tất cả: nút "Dọn sạch Thùng rác…", hộp xác nhận đếm theo loại (KH kèm dữ liệu con, lịch hẹn, HĐ, nhân sự, team), gõ DỌN SẠCH; đi cùng hàng đợi thay dữ liệu (chờ lưu, backup vào `backups\`, khóa ghi S2-2); một transaction theo thứ tự khóa ngoại; dữ liệu đang dùng và chỉ số không đổi; hộp 9b thêm vế "hoặc dọn sạch Thùng rác".
  - **TR-12** giữ bản ghi còn được dùng, lý do một dòng như dòng bị chặn. Dữ liệu tạo trong app không có ca nào; ca đã biết chỉ đến từ file nhập (lịch Dời lịch đã xóa mà lịch mới dời từ nó còn).
  - **TR-13** câu nhắc từ 1 000 bản ghi.
  - 13 ví dụ chuẩn **D1–D13** (mỗi dòng một test chấp nhận); mô hình dữ liệu (migration nới 3 trigger chặn xóa, một hàm tính tập giữ lại dùng chung); tài liệu sửa ở PR code.
  - **6 câu hỏi cho Owner** ở cuối §4.2, mỗi câu có đề xuất.
- **Mockup** `docs/design/mockups/trash.html` (G3): 11a có nút và câu TR-6 mới; dòng lịch Đã gặp bị chặn ghi "nhóm sau N2" như app (lệch đã biết, sổ review #543); 11f bỏ "giữ nguyên, không bao giờ xóa"; mới **11h** câu nhắc, **11i** hộp dọn sạch, **11j** sau khi dọn / dòng giữ lại / không dọn được. `mockups/README.md`: dòng bảng và danh sách khối.
- **ADR-0008 phụ lục** (G1): append-only của `kyc_notes`, `kyc_facts`, `ai_analyses` có một ngoại lệ là dọn dữ liệu của KH đã xóa mềm; trigger chỉ nới cho đúng ca đó, trigger chặn sửa giữ nguyên.
- **`docs/PROJECT-STATE.md`**: một dòng quyết định Owner 19/10/2026, theo `CLAUDE.md` ("Quyết định Owner theo ngày"). File này ngoài danh sách file của #662.

#### Câu hỏi cho Owner (chi tiết ở spec §4.2, cuối mục) — Owner đồng ý cả 6 (19/10/2026)

1. G1 — phụ lục ADR-0008. **Đề xuất: đồng ý.**
2. G2 — TR-6, TR-11…TR-13, D1–D13. **Đề xuất: đồng ý.**
3. G2 — thu gọn file (`VACUUM`) sau khi dọn: file nhỏ lại, lần lưu sau ghi ít hơn, phần đã dọn không còn sót trong file. **Đề xuất: có.**
4. G3 — gõ DỌN SẠCH để xác nhận như Nạp lại. **Đề xuất: có.**
5. G3 — mockup 11a, 11f, 11h–11j. **Đề xuất: duyệt.**
6. Phạm vi PR code: thêm `docs/user-guide/04-khach-hang.md`, `e2e/team.spec.ts`, `team-view.test.ts`. **Đề xuất: đồng ý.**

#### Test chấp nhận

- [x] Có PR docs (G1 / G2 / G3) đã được Owner duyệt trước PR code — PR này, duyệt 19/10/2026.
- Các test chấp nhận còn lại của #662 thuộc PR code (D1–D13 ở spec).

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff` (sổ @ `df3384a`, sổ không đổi từ `514ae16`), 3 mục "Trùng file":

- L81 `docs/design/mockups/trash.html` (dòng lịch Đã gặp bị chặn: app "nhóm sau N2", mockup "N3 → N2"): **đã sửa** — 11a ghi "nhóm sau N2" như app, chờ Owner duyệt (câu hỏi 5). PR code bỏ dòng này khỏi "Lệch mockup đã biết" của `nghiem-thu-v1.md`.
- L93 `docs/design/phase-6-hoan-thien.md` (§4.3, "trạng thái lưu ở góc sidebar"): **để lại** — ngoài phạm vi, Issue #662 chỉ cho sửa §4.2.
- L138 `docs/design/phase-6-hoan-thien.md` (§6.3, thêm "(lượt 1)"): **để lại** — ngoài phạm vi, Issue #662 chỉ cho sửa §4.2.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (docs-only, không chạy CI)
- [x] Không thêm dependency
- [x] Mockup mở trên server `mockups` (1440 × 900): 11a, 11h, 11i, 11j hiển thị đúng CSS dùng chung; mục lục đầu file khớp dòng
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low` (docs-only; nhãn `gate`). Issue #662 là `risk:high` cho PR code.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #709 — feat(db): purge the trash for good, keeping what still points to it (T-258, 1/2)

Trạng thái: MERGED · merge 2026-10-19T13:15:27Z · commit `29aca69394aea74aa084455ee64dbc5bc09d6ed4` · nhánh `task/T-258-empty-trash`

Refs #662

PR 1 / 2 của T-258 (Dọn sạch Thùng rác, `risk:high`): phần `packages/db` gồm migration nới trigger, lệnh dọn và tập giữ lại. PR 2 làm phần còn lại: `AppData` (hàng đợi thay dữ liệu, backup trước, khóa ghi), màn 11a / 11h–11j, i18n, e2e, tài liệu. PR docs #707 (G1 / G2 / G3) đã được Owner duyệt ngày 19/10/2026.

#### Thay đổi

- **Migration `0011_trash_purge`** (tự viết, `drizzle-kit generate --custom`). Tạo lại `kyc_notes_no_delete`, `kyc_facts_no_delete`, `ai_analyses_no_delete` với `WHEN NOT EXISTS (KH của dòng đã xóa mềm)`, nên chỉ dòng của KH đã xóa mềm xóa được. Trigger chặn sửa không đổi (phụ lục ADR-0008). `LATEST_SCHEMA_VERSION` 11 → 12.
- **`packages/db/src/purge.ts`** (file mới):
  - `previewPurge(db)` cho hộp 11i: số sẽ xóa hẳn theo loại và danh sách giữ lại kèm lý do. Số theo loại gồm `customers`, `customerRecords` (phần "kèm …", đếm như 11b), `appointments`, `policies`, `people`, `teams`.
  - `purgeTrash(db)`: xóa trong một transaction, theo thứ tự khóa ngoại: phân tích AI → dữ kiện → ghi chú → phiên bản KYC → chuyển nhóm → người phối hợp → lịch → HĐ → KH → nhân sự → team. Lệnh trả số đã xóa và cả tập giữ lại (ghi chú L208). Dọn xong chạy `VACUUM` (câu hỏi 3 (a)) rồi lưu file đã thu gọn.
  - `keptRecords(db)` tính tập giữ lại TR-12, một hàm dùng chung cho xem trước, lệnh dọn và `listTrash`. Có ba ca:
    - lịch đã xóa mà một lịch còn lại (hoặc một lịch được giữ) dời từ nó;
    - nhân sự đã xóa là RE / người phối hợp / người đánh giá của lịch được giữ;
    - team đã xóa của nhân sự được giữ.

    Theo lệnh và luật nhập (spec Phase 3 §6), ngoài ba ca này không bản ghi nào còn lại trỏ được tới bản ghi đã xóa. Nếu có, khóa ngoại từ chối và lệnh không đổi gì (comment đầu `purge.ts`).
- **`listTrash`**: dòng được giữ có `keptBy`, tức bản ghi trỏ tới nó. Dòng hiện lý do cả trước khi dọn.
- **Cỡ PR:** ≈ 280 dòng sản phẩm (`purge.ts` 233, migration 28, phần còn lại ở `trash.ts` / `index.ts` / `migrations.ts`) cộng 573 dòng test, tổng ≈ 860 dòng. Không tính `0011_snapshot.json` (drizzle-kit sinh) và codemap. Tổng vượt ~800 vì test chấp nhận D1–D11 phải dựng Thùng rác đủ năm loại như mockup 11a, và đây là đường mất dữ liệu duy nhất của app. Phần sản phẩm vẫn dưới ~400.

#### Quyết định trong PR (Owner xem khi duyệt)

- **`VACUUM` lỗi sau lúc dọn (ghi chú L209).** Transaction đã xong nên dữ liệu đã được dọn. Lệnh vẫn trả kết quả như khi dọn xong; file chỉ chưa nhỏ lại, đến lần dọn sau. Câu này sẽ vào spec §4.2 TR-11 và hướng dẫn ở PR 2.
- **Tắt khóa ngoại trong lúc xóa, kiểm một lần trước COMMIT,** như `migrate()` và nhập backup. Cách này nhanh hơn ≈ 30 lần (số đo ở dưới). An toàn vẫn như cũ: tham chiếu nào trỏ tới dòng đã xóa thì cả lệnh bị hủy.
- **Lưu file hai lần.** Transaction lưu file một lần, ở cỡ cũ. `VACUUM` phải chạy ngoài transaction (SQLite yêu cầu), sau đó lưu lần nữa ở cỡ mới, bằng một transaction rỗng. Cách này không phải sửa `database.ts`, file nằm ngoài danh sách của Issue.

#### Test chấp nhận

`packages/db/src/purge.test.ts` dựng Thùng rác như mockup 11a: 3 KH kèm 12 lịch hẹn · 1 HĐ · 9 ghi chú KYC · 2 phân tích AI, cùng 6 lịch hẹn, 2 HĐ, 2 nhân sự, 1 team.

- [x] Dọn Thùng rác đủ năm loại → Thùng rác rỗng, `PRAGMA foreign_key_check` rỗng, không còn dòng nào của KH đã dọn ở mọi bảng. Lịch 02/10 đi cùng chuyển nhóm đã rút của nó, KH Phạm Gia Bảo vẫn N3 (D1, D2).
- [x] Dữ liệu đang dùng không đổi: phần chưa xóa của `exportBackup` và `countRecords` giống hệt trước / sau, file sau khi dọn vẫn nhập lại được (D3, phần db). Chỉ số Tổng quan / Báo cáo (`tables()` của app) kiểm ở PR 2.
- [x] Trigger vẫn chặn sửa / xóa ghi chú, dữ kiện, phân tích AI của KH chưa xóa. Với KH đã xóa: xóa được, sửa vẫn bị chặn, dữ kiện vẫn chỉ đổi được trạng thái (D11).
- [x] Lỗi giữa chừng (câu xóa cuối bị từ chối) → không đổi dòng nào, không lưu file (D9). Còn tham chiếu trỏ tới dòng đã dọn → từ chối, không đổi gì, khóa ngoại bật lại. Ca backup lỗi kiểm ở PR 2.
- [x] Bản ghi còn được trỏ tới được giữ kèm lý do: lịch Dời lịch (D5); thêm RE, người phối hợp và team của họ (D6).
- [x] Nhân sự chỉ còn dữ liệu của KH đã dọn → xóa được (D4, nối T-250).
- [x] DB cũ (schema 11) có dữ liệu mở được và dọn được.
- [x] `VACUUM`: file lưu sau khi dọn nhỏ hơn và không còn chữ của ghi chú đã dọn.
- [x] Thời gian dọn 1 313 dòng (đo ở dưới).
- [ ] Hộp xác nhận, file trong `backups\`, nhắc từ 1 000 dòng, D7, D8, D10, D12, D13: PR 2.

##### Thời gian dọn 1 313 dòng

Đo trên Office Laptop (`D13_ThinkPad`), Node 24, bằng script tạm trong scratchpad (không commit). Dữ liệu: dữ liệu tải (seed 6, neo 12/10/2026, như `tools/load-data.mjs`) thêm 1 200 KH xóa, được 1 313 dòng Thùng rác, giống cách đo DR6-84.

| Đo | 3 lần |
|---|---|
| `purgeTrash` (transaction + kiểm tham chiếu + `VACUUM` + 2 lần xuất file) | 122,0 / 123,4 / 125,0 ms |
| `previewPurge` (mở hộp 11i) | 11,7–12,7 ms |
| `listTrash` (để so) | 161–167 ms |
| Cỡ file | 13,79 MB → 1,42 MB (đã dọn 1 215 KH kèm 9 834 lịch hẹn, 1 648 HĐ, 5 006 ghi chú KYC, 99 phân tích AI) |

Bản đầu tiên giữ khóa ngoại bật trong lúc xóa và mất 3 524–3 650 ms. Lý do: mỗi dòng bị xóa phải tìm các dòng trỏ tới nó qua cột không có chỉ mục (`appointments.rescheduled_from_id`, `kyc_facts.note_id`). Bản này làm như `migrate()`: tắt khóa ngoại trong lúc xóa, kiểm mọi tham chiếu một lần bằng `PRAGMA foreign_key_check` trước COMMIT. Nếu còn tham chiếu trỏ tới dòng đã xóa thì lệnh từ chối và không đổi gì (có test riêng). Bản exe còn mất thêm thời gian chép backup và ghi file (13,79 MB rồi 1,42 MB).

#### Ghi chú OPEN liên quan

- L64 `packages/db/src/index.ts`: để lại, ngoài phạm vi. Mục này nói về `export * from './run'` của `packages/ai/src/index.ts`, không phải index của db.
- L75 `packages/db/src/trash.ts` (`refs` đọc cả ba bảng): để lại. Số đo 6C không thấy chậm ở phần này; phần chậm dần theo số dòng là phần tính cho từng dòng (DR6-84), và Owner đã chọn dọn sạch để xử lý (#662).
- L145 `packages/db/src/index.ts`: chỉ ghi lại (lý do PR #541 sửa file ngoài danh sách), không có gì để sửa.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:high`: đây là đường xóa hẳn dữ liệu duy nhất của app. Owner merge. Không đổi Rust / `package.json`, nên không cần nhãn `build-exe`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #710 — feat(trash): empty the trash from Settings, backed up first (T-258, 2/2)

Trạng thái: MERGED · merge 2026-10-19T15:08:01Z · commit `6526793d38cd26d94893c39284d81206e706ce9f` · nhánh `task/T-258-empty-trash-screen`

Closes #662

PR 2 / 2 của T-258 (Dọn sạch Thùng rác, `risk:high`). PR 1 #709 (đã merge vào `main`) làm phần `packages/db`: migration, lệnh dọn, tập giữ lại. PR này làm `AppData`, màn 11a / 11h–11j, i18n, e2e và tài liệu.

#### Thay đổi

- **`AppData.purgeTrash()`** (`app-data.ts`) chạy chung một hàng đợi với Nạp lại / Nhập backup (S2-1), theo thứ tự:
  1. Chờ lưu xong. Lần lưu trước lỗi → từ chối `RELOAD_UNSAVED_CHANGES` (D7).
  2. Backup file. Backup lỗi → không dọn (D8).
  3. Dọn ngay trên DB đang mở.

  Từ lúc gọi tới lúc xong, mọi lệnh ghi bị chặn (S2-2, D10) và kết quả AI về lúc đó bị bỏ (S2-3). `generation` không đổi, nên lần chạy AI của KH chưa xóa về sau lúc dọn vẫn được lưu. Lệnh trả số đã dọn, tập giữ lại và tên file backup. Phần chung của `replace` tách thành `inTurn` (một lượt trong hàng đợi) và `backUp` (chờ lưu rồi backup).
- **Màn Thùng rác** (`SettingsTrash.tsx`, logic ở `trash-view.ts`):
  - 11a: nút **Dọn sạch Thùng rác…** ở đầu thẻ, chỉ có khi Thùng rác có bản ghi, và tắt khi mọi bản ghi đều được giữ lại. Câu TR-6 mới; vế "app backup trước" chỉ có ở bản exe (ghi chú L210).
  - 11h: từ 1 000 bản ghi có câu nhắc dọn (TR-13).
  - Dòng được giữ lại: lý do một dòng dưới bản ghi (TR-12), cùng chỗ với lý do chặn.
  - 11i: hộp đếm theo loại (KH kèm lịch hẹn · HĐ · ghi chú KYC · phân tích AI). Hộp có "Giữ lại n bản ghi còn được dùng", "Không hoàn tác được" và câu backup (bản exe) hoặc câu bản web. Gõ DỌN SẠCH thì nút mới bật; trong lúc dọn nút ghi "Đang dọn…" và hộp không đóng được.
  - 11j: thông báo "Đã dọn sạch Thùng rác", số đã xóa hẳn theo loại (loại bằng 0 bỏ ra), số bản ghi giữ lại, tên file backup. Focus về thông báo, kể cả khi nút còn đó nhưng tắt vì có bản ghi giữ lại. Không dọn được → câu lỗi ở cùng chỗ (D7; D8 / D9).
- **Hộp 9b** (comment (a) của #662): `person.inUseTrash`, `person.inUseSupportTrash` thêm vế "hoặc dọn sạch Thùng rác"; sửa câu mong đợi ở `team-view.test.ts` và `e2e/team.spec.ts`.
- **Hộp 5f** (TR-9, mockup 11f): dòng Ghi chú KYC chỉ ghi số.
- **i18n:**
  - Khóa đếm trung tính `trash.records.*` thay `trash.restore.policies` / `kyc` / `ai` / `leftAppointments`, dùng chung cho hộp khôi phục, thông báo 11e và phần dọn sạch (ghi chú L86).
  - `trash.restored.mark` → `trash.done.mark`, dùng cho cả 11e và 11j.
- **Tài liệu:**
  - Hướng dẫn: `09-cai-dat.md` (câu TR-6, mục mới "Dọn sạch Thùng rác"), `04-khach-hang.md` (5f), `08-team.md` và `11-thuat-ngu.md` (L207), `README.md` (bảng đối chiếu: hộp 11i).
  - `nghiem-thu-v1.md`: sửa NT-KH-14, NT-TM-16, NT-TR-01, NT-TR-04; dòng mới NT-TR-21–23 làm sau mọi dòng NT-TR khác, kèm câu ở mục 8 về hệ quả với RE Thùng rác / IS Hỗ trợ (L203); bảng đối chiếu thêm 11h–11j; bỏ lệch 11a vì mockup đã sửa ở #707.
  - Spec §4.2: ba câu theo ghi chú review #707 (L208, L209, và mục `:189` nay đã RESOLVED ở #711).
- **Cỡ PR:** sản phẩm +400 / −70 dòng (`SettingsTrash.tsx` 178, `trash-view.ts` 153, `app-data.ts` 76, `vi.ts` 60); test +499 / −33; tài liệu +54 / −17. Tổng ≈ 1 070 dòng, vượt ~800 dù đã tách đôi. Không tách thêm vì hàng đợi, hộp 11i, thông báo 11j và màn đi cùng nhau: mỗi phần lẻ ra không chạy được. Test gồm e2e 11i / 11j trên bản web, ca nhập 1 000 dòng có dòng giữ lại (D5, D12), D7–D10 ở `app-data`, D1 / D12 / 11j ở `trash-view`.

#### File ngoài danh sách của Issue (Owner xem khi duyệt)

- `apps/desktop/src/routes/customers/CustomerDialogs.tsx`, `e2e/customer-forms.spec.ts`: TR-9 (Owner duyệt ở #707) đổi dòng Ghi chú KYC của hộp 5f, mà e2e 5f ghim câu cũ. Bỏ khóa `customerDelete.kycKept`; dòng này nay dùng `formatCount` như dòng Hợp đồng ngay trên.
- `docs/user-guide/08-team.md`, `docs/user-guide/11-thuat-ngu.md`: ghi chú L207 ghi "**Owner quyết**". Câu "không bao giờ xóa" trái D4, trong khi mục mới của `09-cai-dat.md` trỏ sang `08-team.md`. Em đề xuất sửa luôn ở đây; nếu anh muốn để PR docs riêng thì em gỡ ra.
- `docs/user-guide/README.md`: spec §4.3 yêu cầu bảng đối chiếu có mọi hộp đã duyệt, nên thêm 11i.
- `docs/design/phase-6-hoan-thien.md` §4.2: file có trong Issue nhưng cho PR docs. Ba câu đến từ ghi chú review #707 (L208, L209, và mục `:189` nay đã RESOLVED ở #711); câu L208 (`VACUUM` lỗi thì vẫn báo đã dọn, xem PR 1) cần anh duyệt.

#### Vòng sửa sau review @`938da18` (CHANGES: 2 chặn, 2 không chặn + 1 mùi)

- [chặn] `docs/testing/nghiem-thu-v1.md` NT-TR-21, NT-TR-22: đường dẫn backup nay đúng chữ của app: `Project2C-data\backups\.` (`trash.purge.backup`), `Backup: Project2C-data\backups\<file>` (`settings.demo.doneBackup`), "nằm trong `backups\`". Ký tự U+0008 được thay bằng script node, vì Edit không gõ được ký tự điều khiển. Quét `[\x00-\x08\x0b\x0c\x0e-\x1f]` ở `apps/desktop/src`, `docs`, `e2e`: không còn.
- [chặn] `apps/desktop/src/data/app-data.test.ts` (D3): `tables` nay đọc hết các bảng trước khi dọn (`{ ...app.tables() }`, vì `tables()` chỉ đọc một bảng khi được hỏi lần đầu) và so với `{ ...app.tables() }` sau khi dọn. Review đã thử đúng dạng này: đỏ khi một team đang dùng bị xóa sau lúc dọn. Câu D3 ở "Test chấp nhận" sửa theo.
- [không chặn] NIT doc comment ở `apps/desktop/src/data/app-data.ts`: `subscribe` kể đủ `run`, `reloadDemoData`, `importBackup`, `purgeTrash`; `isUnsavedChangesError` thêm `purgeTrash`.
- [không chặn, mùi] `customerRecordParts` (`trash-view.ts`): để lại. Ba chỗ khác nhau theo mockup: 11b giữ loại bằng 0 và lịch hẹn kèm "(x đã gặp · y lần tính RF)" (khóa riêng `trash.restore.appointments`); 11e bỏ phân tích AI và nối bằng dấu phẩy ("cùng 7 lịch hẹn, 5 ghi chú KYC"); 11i / 11j đủ bốn loại, nối bằng " · ". Hàm chung vẫn phải tách nhánh cho 11b và 11e.
- [không chặn] Cỡ PR: ghi vào bảng "Kích thước PR vượt ngưỡng" của `docs/metrics/phase-6.md` khi viết số đo cuối phase.
- Gộp `main` `dc77b13` (merge #709, sổ #711) vào nhánh trong cùng lần push, để CI test trên `main` mới nhất. Phần `main` mang vào chỉ có `docs/state/review-notes.md`.
- Vẫn chờ anh quyết lúc merge: câu `VACUUM` ở spec §4.2 (G2) và việc sửa `08-team.md` / `11-thuat-ngu.md` ngay ở PR này (L207).
- `pnpm verify` xanh ở local (118 file, 3 159 test). `pnpm e2e` không chạy lại ở local: vòng này không đổi code chạy (comment, một test unit, tài liệu); CI chạy e2e.

#### Vòng sửa sau review @`0ec791b` (CHANGES: 1 chặn, 1 không chặn + 1 mùi)

Vòng sửa thứ hai (giới hạn 2 vòng, sau đó G8).

- [chặn] `docs/user-guide/08-team.md:76`: câu 9b nay khớp app.
  - Hộp ghi tên KH đã xóa mỗi khi có bản ghi của người đó thuộc KH đã xóa, "dù người này còn bản ghi khác hay không" (`inUseHelp` xét `usage.inTrash`, còn `IN_TRASH` không xét phần còn lại).
  - Người này xóa được sau khi dọn chỉ khi mọi bản ghi đều thuộc KH đã xóa (D4). Lệnh dọn không bao giờ giữ lại KH đã xóa (`purge.ts`), nên vế này đúng.
  - Câu đầu đoạn thêm "số lịch hẹn là người đánh giá kết quả". Hộp 9b có dòng này (`person.inUseReviewing`, D9) mà hướng dẫn chưa kể, nên "các bản ghi đó" nay gồm đủ các dòng của hộp.
  - Đã rà các câu cùng ý: `09-cai-dat.md` ("Nhân sự chỉ còn dữ liệu của KH đã bị dọn thì xóa được"), spec §4.2 (`:123`, D4), NT-TM-16, NT-TR-23. Không câu nào sai cùng kiểu: NT-TM-16 / NT-TR-23 đã ghi IS Hỗ trợ vừa còn lịch khác vừa có câu "Có cả lịch hẹn của KH đã xóa …".
- [không chặn] Cỡ PR: như vòng trước, ghi vào bảng "Kích thước PR vượt ngưỡng" của `docs/metrics/phase-6.md` khi viết số đo cuối phase.
- [không chặn, mùi] `PurgeDialog` (`SettingsTrash.tsx`) chép khung hộp gõ chữ xác nhận của `ReloadDialog` (`Settings.tsx`): để lại. Gộp thành một component chung phải sửa `Settings.tsx` (hộp Nạp lại dữ liệu giả lập, ngoài danh sách file của #662), tức đổi một hộp đang chạy ổn trong một PR đã vượt cỡ. Đề xuất PR sổ sau review ghi mục này, sửa ở lần chạm sau của một trong hai hộp.
- Vẫn chờ anh quyết lúc merge: câu `VACUUM` ở spec §4.2 (G2) và việc sửa `08-team.md` / `11-thuat-ngu.md` ngay ở PR này (L207).
- `pnpm verify` xanh ở local. `pnpm e2e` không chạy lại ở local: vòng này chỉ đổi một đoạn hướng dẫn, không đổi code; CI chạy e2e. `main` không có commit mới sau `dc77b13`, nên không cần gộp `main`.

#### Test chấp nhận

- [x] Có PR docs (G1 / G2 / G3) đã được Owner duyệt trước PR code (#707).
- [x] Dọn Thùng rác đủ năm loại → Thùng rác rỗng, `foreign_key_check` rỗng, không còn dòng nào của KH đã dọn: PR 1 (D1, D2). Ở đây: `AppData` dọn trên đúng DB, Thùng rác rỗng trong file đã lưu.
- [x] Dữ liệu đang dùng không đổi: mọi bảng của `app.tables()` (các chỉ số Tổng quan / Báo cáo đọc từ đó), đọc hết ngay trước khi dọn, giống hệt các bảng đọc sau khi dọn; cùng DB, cùng `generation` (D3, `app-data.test.ts`). Tầng db: `purge.test.ts` so `livePart` đọc ngay trước khi dọn (PR 1).
- [x] Backup lỗi → không dọn, DB không đổi; lần lưu trước lỗi → từ chối, không backup; lỗi giữa chừng → không đổi gì, lệnh ghi chạy lại được (D7, D8, D9, `app-data.test.ts`).
- [x] File backup: bytes mà `backup()` chép lúc dọn mở lại được và còn đủ Thùng rác cùng thay đổi chưa lưu trước đó; file lưu sau khi dọn có Thùng rác rỗng (D3, ghi chú L209). Bản exe: dòng NT-TR-22 kiểm file mang tên ở thông báo.
- [x] Hộp xác nhận đếm đúng theo loại: D1 ở `trash-view.test.ts`; e2e kiểm hộp trên dữ liệu thật của bản web.
- [x] Bản ghi còn được trỏ tới được giữ, dòng ghi lý do: e2e nhập file có lịch Dời lịch đã xóa mà lịch dời từ nó còn sống; sau khi dọn Thùng rác chỉ còn dòng đó và nút tắt (D5, TR-12).
- [x] 1 000 dòng → có câu nhắc; 999 → không (`trash-view.test.ts`). E2E: 1 000 → có; sau khi dọn còn 1 → không (D12).
- [x] Nhân sự chỉ còn dữ liệu của KH đã dọn → xóa được (D4, PR 1). Câu 9b có vế "hoặc dọn sạch Thùng rác".
- [x] Lệnh ghi trong lúc dọn → `DATA_REPLACING`, `replacing()` đúng (D10). Dọn chờ lượt sau Nạp lại gọi trước nó (S2-1).
- [x] Bản web: nút "Dọn sạch", không backup, thông báo không có "Backup:" (D13, e2e).
- [x] Thời gian dọn 1 313 dòng: 122–125 ms (`purgeTrash`, Node, Office Laptop, đo ở PR 1). Bản exe còn mất thêm thời gian chép backup và ghi file.

Đã xem trên bản web (`pnpm dev:web`): xóa một KH → Thùng rác có nút đỏ ở đầu thẻ; hộp 11i ("1 — kèm 7 lịch hẹn · 0 HĐ · 4 ghi chú KYC · 0 phân tích AI"); gõ DỌN SẠCH → "Đã dọn sạch Thùng rác / Xóa hẳn 1 KH (kèm 7 lịch hẹn · 4 ghi chú KYC)." nhận focus, "Thùng rác trống", không có lỗi console. Ảnh hướng dẫn `09-cai-dat-thung-rac.png` chưa chụp lại: theo spec §4.3, ảnh chụp lại trước G7.

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff`, sau khi gộp `main` `dc77b13` (sổ #711) vào nhánh: 25 mục "Trùng file". #711 chuyển mục spec `:189` (lệnh dọn trả cả tập giữ lại, L208 cũ) sang RESOLVED, nên các mục sau nó lùi một số.

- L24 `CustomerDialogs.tsx` (#141, hộp 5d / chuyển nhóm): để lại, ngoài phạm vi. PR này chỉ sửa dòng KYC của 5f; mục này là lệch mockup đã biết.
- L50 `vi.ts` (NIT `KycExtraction.tsx:96`): để lại, ngoài phạm vi; phải sửa `KycExtraction.tsx`, file ngoài danh sách.
- L73 `app-data.test.ts:723` (hai ca S2-4 chỉ kiểm `toThrow()`): **đã sửa**. Mỗi ca S2-4 nay kiểm đúng lỗi của nó bằng `toSatisfy`: `isUnsavedChangesError`, "disk full", "file is not a database".
- L78 `e2e/customer-forms.spec.ts:245` (e2e 5f chỉ kiểm `\d+`): để lại, vượt phạm vi. PR chỉ đổi dòng KYC theo TR-9; ghim số chính xác phải đọc thêm số ghi chú từ hồ sơ.
- L81 `trash-view.test.ts:150` ("mới xóa nhất trên"): **đã sửa**. E2E D5 / D12 dựng 1 000 dòng và kiểm dòng xóa sau cùng (lịch Dời lịch) đứng đầu bảng, theo `initialSort` của `DataTable`.
- L82 `trash-view.ts:35` (`plain` lặp lại): để lại, ngoài phạm vi; hàm chung phải sửa cả `appointment-form.ts`, `report-workbook.ts`.
- L83 `vi.ts` `trash.customer.with` (slot `{count}`): để lại; phải thêm slot vào `COUNT_SLOTS` ở `i18n/index.ts`, file ngoài danh sách.
- L86 `trash-view.ts` `restoredWith` (khóa "còn lại" dùng để đếm lịch đã về): **đã sửa**. Khóa trung tính `trash.records.*` nay dùng cho hộp khôi phục, thông báo 11e và phần dọn sạch.
- L92 spec §4.3 (trạng thái lưu ở sidebar): để lại; nằm ngoài §4.2 mà Issue cho sửa.
- L100 `app-data.ts:249` (`PerformanceMeasure`): để lại, ngoài phạm vi; chính ghi chú nói chấp nhận được.
- L103 `app-data.ts` (`integrityCheck` chạy trên DB đã migrate): để lại, ngoài phạm vi (đường mở app).
- L104 `vi.ts` `close.unsavedBody`: để lại, ngoài phạm vi (hộp đóng app, `CloseGuard`).
- L105 `app-data.ts` `openFrom` (xuất thêm một lần): để lại; chi phí nhỏ, và lệnh dọn không đi qua `openFrom`.
- L119 `SettingsTrash.tsx:166` (`useCallback` + `eslint-disable`): để lại, giữ comment như ghi chú gợi ý. Cho `useQuery` nhận deps phải sửa `AppDataContext.tsx`, file ngoài danh sách.
- L120 `trash-view.ts` `restoreLabel` (`?? ''`): chỉ ghi lại; khóa ngoại làm ca này không xảy ra.
- L137 spec §6.3 ("lượt 1" của Muse): để lại; nằm ngoài §4.2.
- L140, L141 `trash-view.ts` (`TRANSITION_BEFORE_LATEST` cùng ngày): chỉ ghi lại.
- L156 `app-data.test.ts` (đoạn lật byte chép ở hai package): để lại. Helper chung phải sửa cả `packages/db/src/database.test.ts`, và ghi chú cho phép giữ vì hai test ở hai package.
- L157 `app-data.test.ts:282` (không kiểm kết quả `findIndex`): **đã sửa ở `app-data.test.ts`**. Nửa ở `database.test.ts` để lại vì file ngoài danh sách.
- L178 `nghiem-thu-v1.md` (luật K20 cũ ở `phase-3-du-lieu.md:175`): để lại; file phải sửa là `phase-3-du-lieu.md`, ngoài danh sách.
- L203 `nghiem-thu-v1.md:245`, NT-TM-16 (KH Thùng rác nằm lại tới hết lượt nghiệm thu): **đã sửa**. Các dòng dọn sạch NT-TR-21–23 đặt sau mọi dòng NT-TR khác (sau NT-TM-16); câu mở đầu mục 8 nêu hệ quả; NT-TR-23 kiểm RE Thùng rác xóa được và IS Hỗ trợ bớt một lịch phối hợp.
- L207 `08-team.md:76`, `11-thuat-ngu.md:71`: **đã sửa theo đề xuất**, chờ Owner xác nhận (xem "File ngoài danh sách"). Câu 9b ở `08-team.md:76` sửa lại ở vòng @`0ec791b`.
- L208 spec `:118`, `:122` (`VACUUM` lỗi sau transaction): **đã sửa**. Code vẫn báo như dọn xong (PR 1); spec §4.2 và hướng dẫn có câu này. Câu spec cần Owner duyệt.
- L209 spec `:172` (D3 "file mới"): **đã sửa**. D3 ghi "file mang tên ở thông báo"; NT-TR-22 kiểm đúng file đó; `app-data.test.ts` kiểm bytes mà `backup()` chép lúc dọn.

Đã RESOLVED ở #711 (không còn trong `--diff`): spec `:189` (lệnh dọn trả cả tập giữ lại). PR 1 trả `{ counts, kept }`; PR này sửa câu spec theo.

Ngoài danh sách `--diff` (file không nằm trong diff):

- L210 `trash.html:152` (vế "app backup trước" sai ở bản web): **đã sửa ở app**. App chọn `trash.help` (bản web) hoặc `trash.helpFile` (bản exe) theo `hasFile`; mockup giữ nguyên.
- L211 `mockups/index.html:150`: để lại; file ngoài danh sách, sửa ở lần chạm sau.
- L213–L218 (sáu ghi chú review #709, `packages/db/src/purge.ts`): để lại, sửa ở lần chạm sau của `purge.ts`. PR này không đụng `packages/db` và đã vượt cỡ. Riêng L216 đòi PR 2 bắt mọi lỗi của lệnh dọn thành câu D8 / D9: đã có, `purgeFailure` (`trash-view.ts`) ra câu D8 / D9 cho mọi lỗi không phải D7 (review @`938da18` đã kiểm).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] `pnpm e2e` xanh ở local (Edge)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:high`: đây là đường xóa hẳn dữ liệu duy nhất của app. Owner merge. Không đổi Rust / `package.json`, nên không cần nhãn `build-exe`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #663 — T-259: Tài liệu: nghiệm thu hành vi mới, hướng dẫn "200.000" (DR6-96, 97)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

1. **Danh sách nghiệm thu có hành vi mới của đợt sửa lượt 1 (DR6-96):**
   - NT-EX-05: exe chặn cả Back / Forward (phím Alt+←/→, nút chuột 4 / 5), không chỉ F5, Ctrl+R (ghi chú review #638).
   - Dòng báo khi tạo KH ngoài góc nhìn đang chọn (PR #636 để lượt 2 cân nhắc).
   - Hộp 9b của người hỗ trợ / người đánh giá kết quả, và ca nhân sự chỉ còn dữ liệu của KH trong Thùng rác (theo chữ cuối của T-250). NT-TM-10 hiện chỉ có ca RE.
2. **Hướng dẫn sử dụng (DR6-97):** `10-su-co.md` chép đúng câu app "(quá 200.000 ký tự)".

##### Bối cảnh

Deep review Phase 1–6 lượt 2 (T-225 #565), PR docs của §8.3 (Phương án 3, Owner 17/10/2026). Các phần khác của §8.3 đi chỗ khác:

- DR6-95 (mockup 11c E7 cũ) sửa cùng mockup ở T-249.
- DR6-98: mốc Home PC lượt 2 ở `docs/metrics/phase-6.md` do T-225 ghi; probe và README `e2e/perf` ở T-256.
- Dòng nghiệm thu của "Dọn sạch Thùng rác" do T-258 thêm.

Làm sau T-250 để chép đúng chữ hộp 9b mới. Chỉ `docs/**` → không chạy CI.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` §6.7 (DR6-96, 97), §8.3
- `docs/testing/nghiem-thu-v1.md` (NT-EX-05, NT-KH-…, NT-TM-10)
- `docs/state/review-notes.md` (ghi chú review #636, #638)
- `docs/user-guide/10-su-co.md` (dòng 82); `apps/desktop/src/i18n/vi.ts` (`aiError.AI_TOO_LARGE`, câu 9b — chỉ đọc)

##### File / thư mục được phép sửa

- `docs/testing/nghiem-thu-v1.md`
- `docs/user-guide/10-su-co.md`
- `docs/state/review-notes.md` (ghi chú #636 / #638 đã xử lý → RESOLVED)

##### Interface / hợp đồng

- Không.

##### Test chấp nhận

- [ ] Ba hành vi của DR6-96 có dòng nghiệm thu với bước làm và kết quả mong đợi.
- [ ] `10-su-co.md` khớp chữ app.

Ước lượng: ≈ 20–40 dòng tài liệu.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh (PR docs-only: không chạy CI)
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

#654

## PR #700 — docs: acceptance rows for the new behaviour of the fix rounds, guide quotes the app (T-259)

Trạng thái: MERGED · merge 2026-10-18T18:31:46Z · commit `16a28f05eeab1f6a01a62bce041499aa22ded038` · nhánh `task/T-259-acceptance-new-behaviour`

Closes #663

#### Thay đổi

T-259: PR docs của §8.3 bản tổng hợp lượt 2 (DR6-96, DR6-97), cộng ba mục "Trùng file" của sổ ghi chú. Chỉ hai file Issue cho sửa; ≈ 20 dòng.

`docs/testing/nghiem-thu-v1.md`:

- **NT-EX-05** (DR6-96, ghi chú review #638): ngoài F5 / Ctrl+R, nay kiểm thêm Ctrl+Shift+R, Alt+← / →, nút chuột 4 / 5, phím Back / Forward / Refresh của bàn phím, và menu chuột phải ngoài ô chữ (`block-reload.ts`). Thao tác làm trong hộp 7a đang gõ dở, mở từ Khách hàng để Back có màn trước mà lùi về. Kết quả: hộp còn mở, chữ còn, màn không đổi.
- **NT-KH-16** (DR6-96, PR #636): góc nhìn RE A, tạo KH cho RE B → dòng `customers.createdOutside` + link **Hồ sơ KH →**. Cùng mẫu NT-LH-20.
- **NT-TM-15** (DR6-96, T-250): hộp 9b của người hỗ trợ, ba ca theo `inUseHelp`:
  - chỉ phối hợp: người hỗ trợ của seed;
  - chỉ đánh giá: IS mới làm người đánh giá kết quả;
  - cả hai: thêm lịch có IS đó phối hợp.
  Mỗi ca chép đúng câu của `vi.ts`.
- **NT-TM-16** (DR6-96, T-250): RE chỉ còn lịch của KH đã xóa → câu `person.inUseTrash`. IS phối hợp lịch của KH đó → `person.inUseSupportTrash`. Câu mở đầu mục 8 nói hai người này cố ý không xóa được, để không vướng dãy NT-TR.
- **NT-TM-11**: trích câu `error.PERSON_IN_USE` mới, đổi ở T-250 (#669).
- **NT-EX-06**: chép câu `alreadyOpenHelp` mới (DR6-75, PR #674).
- **NT-DB-20**: `attrib +R project2c.db` → trang "App không có quyền ghi vào thư mục dữ liệu", hash không đổi, không thêm backup (DR6-74). Comment của #663 đề xuất dòng này. Đối chiếu `storage.rs` `open_with`: kiểm chỉ đọc trước khi trả bytes, nên app không sao lưu.
- **NT-HN-01** (ghi chú review #696): `PERF_BASE` là mốc của chính máy đo (Office Laptop `perf.json`, Home PC `perf-home-pc-sau-656.json`). Ghi ngoại lệ có chủ ý cho `app.open-data` / `reload.*` khi so với `perf.json` (DR6-06, DR6-73).
- Bảng đối chiếu mockup: 5a → KH-16, 9b → TM-15, 16, 10d → DB-17–20.

`docs/user-guide/10-su-co.md`:

- Dòng 82: "(quá 200.000 ký tự)", đúng `aiError.AI_TOO_LARGE` (DR6-97).
- Bảng "Lỗi lúc mở app" theo chữ mới của `vi.ts` (PR #674, DR6-75):
  - cột "Làm gì" của năm lỗi: "đóng cửa sổ báo lỗi và mở lại app";
  - "File dữ liệu do bản app mới hơn tạo": "Đóng cửa sổ báo lỗi rồi dùng bản app mới hơn";
  - "đang mở ở một cửa sổ khác": thêm "Cửa sổ đó đang báo lỗi mở dữ liệu thì đóng cả hai cửa sổ rồi mở lại app";
  - "App không có quyền ghi": nêu thêm "kể cả chính `project2c.db`" (DR6-74).
- Các câu trích khác trong file đã đối chiếu từng câu với `vi.ts`: khớp.

#### Test chấp nhận

- [x] Ba hành vi của DR6-96 có dòng nghiệm thu với bước làm và kết quả mong đợi: NT-EX-05 (Back / Forward), NT-KH-16 (KH ngoài góc nhìn), NT-TM-15 và NT-TM-16 (hộp 9b của người hỗ trợ / người đánh giá, và ca chỉ còn dữ liệu của KH trong Thùng rác).
- [x] `10-su-co.md` khớp chữ app ("200.000" và bảng lỗi khởi động).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `a5ca90c`:

- L165 (`10-su-co.md` bảng "Khi mở app" và NT-EX-06 còn trích câu cũ của màn lỗi khởi động, DR6-75): đã sửa, theo comment của #663.
- L185 (`docs/design/phase-3-du-lieu.md:175` còn luật K20 cũ): để lại vì ngoài phạm vi. Mục chỉ nêu hai file của #663 để nói Issue này không có `phase-3-du-lieu.md`. File đó không nằm trong danh sách được sửa → PR docs riêng hoặc lần chạm sau của spec.
- L205 (NT-HN-01 so với `perf.json` mà không ghi ngoại lệ `app.open-data` / `reload.*`, chưa nhắc mốc Home PC): đã sửa (xem NT-HN-01 ở trên).

Ghi chú review #638 (mục đầu, Back / Forward trên WebView2 thật) nay có dòng NT-EX-05. Mục này không phải "Trùng file" nên `notes-for` không in, nhưng #663 nêu tên nó. PR sổ sau review sẽ chuyển nó sang RESOLVED cùng L165, L205. Ghi chú review #636 đã RESOLVED từ T-250.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (116 file, 3 117 test)
- [x] PR docs-only (`docs/**`), không chạy CI; không sửa code
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #671 — T-260: Bỏ luật cấm subagent, cho phép ultracode (ADR-0001 M8)

Trạng thái: CLOSED · nhãn: type:task, risk:med, gate

##### Mục tiêu

Bỏ luật cấm subagent / Agent tool để Owner dùng được ultracode (Workflow nhiều agent). Owner quyết 17/10/2026 → ADR-0001 phụ lục M8 (G1).

##### Bối cảnh

Hiện `.claude/settings.json` chặn cứng `permissions.deny: ["Agent"]`; `CLAUDE.md`, ADR-0001 (mục 2, M1–M3), ADR-0012 (quyết định 3), ADR-0017 (mục 5), skill `review-pr`, `.claude/skills/README.md`, `README.md`, `docs/PROJECT-PLAN.md`, `docs/PROJECT-STATE.md` đều ghi "không subagent".

Luật mới:
- Subagent / Agent tool / Workflow được phép. Subagent là Claude nên vẫn đúng "chỉ Claude Code"; Codex / Muse / OpenCode / Cursor vẫn không viết code.
- Mặc định vẫn làm trong phiên chính; dùng Workflow / subagent khi Owner bật (từ khóa `ultracode`, hoặc bảo rõ).
- Không đổi: cổng G1–G8, quy trình một task, review phiên sạch (`review-pr`), merge qua `tools/merge-pr.mjs`.
- Báo cáo lịch sử (`docs/reviews/raw/**`, prompt deep review đã chạy) giữ nguyên.

##### Tài liệu cần đọc

`CLAUDE.md`, `docs/decisions/0001-*.md`, `0012-*.md`, `0017-*.md`.

##### File / thư mục được phép sửa

`.claude/settings.json`, `CLAUDE.md`, `README.md`, `docs/decisions/0001-*.md`, `docs/decisions/0012-*.md`, `docs/decisions/0017-*.md`, `docs/decisions/README.md`, `.claude/skills/README.md`, `.claude/skills/review-pr/SKILL.md`, `docs/PROJECT-PLAN.md`, `docs/PROJECT-STATE.md`, `docs/design/phase-6-hoan-thien.md` (§6.5, ghi chú sửa), `eslint.config.js` + `.gitignore` (bỏ qua `.claude/worktrees/` — worktree của subagent, để `pnpm verify` không đỏ).

##### Test chấp nhận

- `.claude/settings.json` không còn `deny: ["Agent"]`; JSON hợp lệ; `pnpm verify` xanh.
- Không còn câu cấm subagent đang hiệu lực trong các file trên (chỉ còn ở phần đánh dấu lịch sử).

##### Định nghĩa hoàn thành

PR review đạt ở phiên sạch, CI xanh, Owner merge (G1).

##### Rủi ro

`risk:med` (settings + quy tắc quy trình; G1 → Owner merge).

## PR #672 — chore: allow subagents and Workflow when the Owner turns them on (T-260)

Trạng thái: MERGED · merge 2026-10-17T15:46:56Z · commit `29b68e2a2524da6009aba4a755a82728cdf9c55c` · nhánh `task/T-260-allow-subagents`

Closes #671 (T-260). G1 — Owner quyết 17/10/2026: bỏ luật cấm subagent để dùng ultracode (ADR-0001 phụ lục M8).

#### Thay đổi
- `.claude/settings.json`: bỏ `permissions.deny: ["Agent"]`.
- Luật mới (CLAUDE.md, ADR-0001 M8): subagent / Agent tool / Workflow được phép; **mặc định vẫn làm trong phiên chính**, chạy Workflow / subagent khi Owner bật (`ultracode` hoặc bảo rõ). Agent ngoài Claude vẫn không viết code; G1–G8, quy trình một task, review phiên sạch, `merge-pr` giữ nguyên.
- ADR-0012 (phụ lục): `subagent-driven-development`, `dispatching-parallel-agents` dùng được khi Owner bật; `requesting-code-review`, `using-git-worktrees` vẫn không dùng.
- ADR-0017 mục 5 + skill `review-pr`: `code-review` / Workflow dùng subagent khi Owner bật; chưa bật thì inline như cũ.
- `eslint.config.js`, `.gitignore`: bỏ qua `.claude/worktrees/` (worktree của subagent khi `isolation: "worktree"`), để `pnpm verify` không đỏ — trước đây worktree lồng ở đây làm `eslint .` đỏ (ADR-0017 phụ lục mục 2).
- Ghi chú sửa ở README, PROJECT-PLAN (C3, §0, §4.1, §4.3, §6), PROJECT-STATE, chỉ mục ADR, `.claude/skills/README.md`, spec Phase 6 §6.5. Báo cáo / prompt deep review đã chạy giữ nguyên (lịch sử).

#### Kiểm tra
- `pnpm verify` xanh (kể cả khi đang có worktree lồng `.claude/worktrees/bold-almeida-c4594c` của phiên khác — trước sửa thì lint đỏ 712 lỗi).
- Quét đối chứng bằng Workflow (3 vùng: file đã sửa, tools / hook / CI, tài liệu quy trình đang hiệu lực; mỗi phát hiện có agent kiểm phản biện): 10 phát hiện xác nhận, đã sửa hết trong PR này. Không có tool / test nào kiểm luật `deny`.

`risk:med` (settings + quy tắc quy trình, G1) → Owner merge sau review phiên sạch.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #676 — T-261: Mỗi task biết và xử lý ghi chú review OPEN ở file nó sửa (notes-for)

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress

##### Mục tiêu

Mỗi task biết và xử lý các ghi chú OPEN của `docs/state/review-notes.md` nằm ở file nó sẽ sửa:

- Lệnh `node tools/notes-for.mjs` in các mục OPEN nêu đúng file của một Issue / một nhánh / một PR.
- Phiên làm task chạy lệnh lúc bắt đầu (`/session-start`, CLAUDE.md "Quy trình một task") và trước khi mở PR.
- Thân PR có mục cố định "Ghi chú OPEN liên quan": mỗi mục "Trùng file" ghi đã sửa, hoặc để lại kèm lý do.
- `review-pr` (trục Spec) chạy lệnh trên PR: mục "Trùng file" không được nhắc → **chặn** (Owner quyết 17/10/2026, G1).
- Viết Issue (`task.yml`, `to-tickets`, `docs/agents/issue-tracker.md`): ô "Ghi chú OPEN liên quan" để tính các mục cần gộp vào cỡ task.

##### Bối cảnh

- Review PR #674 (T-252, #656): PR sửa đúng đoạn code mà ghi chú OPEN của review #620 nói tới (`app-data.ts`, kiểm file chạy trên DB đã migrate), nhưng cả Issue lẫn PR không nhắc. Không bước nào của phiên code đọc sổ (`tdd`, `to-spec`, `to-tickets`, `task.yml`, `/session-start`, hook, `tools/status.mjs`); đầu sổ ghi "skill `review-pr` đối chiếu sổ này" nhưng skill không có dòng nào về sổ. Ghi chú chỉ tới phiên code khi Issue chép lại (#654, #660, #661).
- Owner duyệt G1 ngày 17/10/2026: làm cả 6 mục của đề xuất, **không** làm hook UserPromptSubmit; mục chưa được nhắc trong PR là chặn.
- Chuyển mục "đã sửa" sang RESOLVED ở PR sổ sau review (như #670, #675), không trong PR code: các PR code song song không xung đột ở file sổ, head không đổi sau PASS.
- Thay đề xuất rộng hơn trước đó (task_0b24d9f6).

##### Tài liệu cần đọc

- `CLAUDE.md` § "Quy trình một task", § "Nghi thức phiên"
- `docs/state/review-notes.md`: đầu sổ và cấu trúc mục OPEN (mục cha / mục con, đường dẫn trong backtick)
- `.claude/skills/review-pr/SKILL.md` §2–§5, `.claude/commands/session-start.md`, `.claude/skills/to-tickets/SKILL.md` (khối issue-template)
- `.github/ISSUE_TEMPLATE/task.yml`, `.github/pull_request_template.md`, `docs/agents/issue-tracker.md`
- Mẫu code: `tools/review-hint-core.mjs` + test (phần thuần tách khỏi lệnh), `tools/pr-status.mjs` (`ghLines`, danh sách file PR qua REST phân trang), `tools/session-io.mjs`

##### File / thư mục được phép sửa

- `tools/notes-core.mjs`, `tools/notes-core.test.mjs`, `tools/notes-for.mjs` (mới)
- `CLAUDE.md` (§ Quy trình một task, dòng `tools/` của § Kiến trúc)
- `.claude/commands/session-start.md`, `.claude/skills/review-pr/SKILL.md`, `.claude/skills/to-tickets/SKILL.md`
- `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/task.yml`
- `docs/agents/issue-tracker.md`, `docs/PROJECT-STATE.md` (dòng quyết định 17/10)
- `docs/state/review-notes.md`: đầu sổ (câu quy trình) trong PR code; PR sổ riêng thêm đường dẫn file cho các mục OPEN chỉ nêu vùng

##### Interface / hợp đồng

```
node tools/notes-for.mjs <issue>          # file / glob ở "File / thư mục được phép sửa" của Issue
node tools/notes-for.mjs --diff [--base <ref>]   # file đổi ở nhánh hiện tại (commit + chưa commit) so <ref>, mặc định origin/main
node tools/notes-for.mjs --pr <N>         # file của PR (REST, phân trang)
node tools/notes-for.mjs --files <path|glob>...  # khi đang viết Issue
```

In ra: dòng nguồn (sổ @ SHA HEAD, theo gì), nhóm **Trùng file** (mỗi mục: `L<dòng>`, file khớp, đầu mục), nhóm **Trong vùng** (chỉ số dòng: glob / thư mục của Issue, hoặc thư mục ghi chú nêu). Thoát 0 kể cả khi không có mục.

Phần thuần `tools/notes-core.mjs`:
- `openNotes(markdown, repoFiles)` → mục lá của phần OPEN: `{ line, text, paths }`. Đường dẫn lấy từ code span: file có thật, tên trần (`storage.rs`) tra theo tên file, tên trùng nhiều nơi lọc theo package của đường dẫn khác trong mục / mục cha; thư mục ≥ 2 cấp; bỏ hậu tố `:dòng`. Mục con không nêu file thì dùng file của mục cha; mục cha chỉ báo qua mục con.
- `allowedPatterns(issueBody)` → đường dẫn / glob của ô "File / thư mục được phép sửa" (mở `{a,b}`).
- `relatedNotes(notes, targets)` → `{ exact, area }`.

##### Test chấp nhận

- [ ] Mục lá nêu đường dẫn đủ của một file Issue cho sửa → "Trùng file"; file `*.test.*` cạnh file được nêu cũng tính trùng.
- [ ] Tên trần (`storage.rs`, `app-data.ts:249`) khớp file thật trong repo; hậu tố `:dòng`, `:12-13`, `:28–29` bị bỏ.
- [ ] Tên trùng nhiều nơi (`index.ts`) chỉ khớp file cùng package với đường dẫn khác trong mục / mục cha; không có ngữ cảnh và > 3 nơi → bỏ.
- [ ] Mục con không nêu file dùng file của mục cha; mục cha có mục con không bị báo riêng.
- [ ] Code span không phải đường dẫn (khóa i18n, regex, tên hàm, `docs/` một cấp) không khớp.
- [ ] Glob của Issue (`e2e/**`, `packages/ai/src/**`) và thư mục ghi chú nêu (`e2e/perf/`) → "Trong vùng", không vào "Trùng file".
- [ ] Chỉ đọc phần OPEN: mục ở RESOLVED / ACCEPTED không bao giờ được báo.
- [ ] `allowedPatterns` đọc đúng ô của body Issue thật (mở `{a,b}`, bỏ chữ ngoài code span).
- [ ] Chạy `--diff` trên nhánh task và trên một Issue mở in đúng nhóm (kiểm tay, ghi vào PR).
- [ ] Mẫu PR có mục "Ghi chú OPEN liên quan"; `review-pr` trục Spec chạy `--pr <N>`, mục không được nhắc là chặn; `task.yml` có ô "Ghi chú OPEN liên quan"; CLAUDE.md và `/session-start` có bước chạy lệnh.
- [ ] Sau khi merge: comment danh sách lên các Issue mở có mục "Trùng file" (#655, #658–#662 theo bản thử); PR sổ thêm đường dẫn cho các mục OPEN chỉ nêu vùng.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #678 — chore: show each task the OPEN review notes of the files it changes (T-261)

Trạng thái: MERGED · merge 2026-10-17T18:00:59Z · commit `a48a31923bfc7686aa22f2d5a0b71b6a444268f1` · nhánh `task/T-261-notes-for`

Closes #676

#### Thay đổi

- **`tools/notes-for.mjs`** (mới) + phần thuần **`tools/notes-core.mjs`** (24 ca test ở `tools/notes-core.test.mjs`): in các mục OPEN của `docs/state/review-notes.md` nêu file mà task sửa.
  - Bốn cách gọi: `<issue>` (ô "File / thư mục được phép sửa"), `--diff [--base <ref>]` (file nhánh đổi, kể cả chưa commit), `--pr <N>` (file của PR, REST phân trang), `--files <path|glob>...`.
  - Hai nhóm: **Trùng file** (ghi chú nêu đúng file; với Issue, file `*.test.*` cạnh file được nêu cũng tính) và **Trong vùng** (glob / thư mục của Issue, hoặc thư mục ghi chú nêu). Dòng cuối là việc phải làm, theo chế độ.
  - Khớp: code span là file có thật; tên trần (`storage.rs`) tra theo tên file; tên trùng nhiều nơi (`index.ts`) lọc theo package của đường dẫn khác trong mục / mục cha, không lọc được thì lấy file cùng tên ở gốc repo (`CLAUDE.md`), không có thì > 3 nơi là bỏ; bỏ hậu tố `:dòng`; mở `{a,b}`; thư mục ≥ 2 cấp; đường dẫn file repo không còn (PR đang xóa / đổi tên) giữ nguyên; mục con không nêu file dùng file của mục cha, mục cha chỉ báo qua mục con. Chỉ đọc phần OPEN.
  - Phía Issue / `--files` tra đường dẫn cùng cách: đường dẫn từ gốc repo lấy nguyên (`CLAUDE.md`); tên ngắn (`backup.ts` cạnh đường dẫn đủ của `packages/db`) và đường dẫn rút gọn (`mockups/README.md`) ra file thật; thư mục một cấp (`tools/`) bị bỏ; đường dẫn repo chưa có (file task thêm mới) giữ nguyên.
  - `--diff` (`--no-renames`) và `--pr` (`previous_filename`) có cả tên cũ của file đổi tên.
- **Quy trình** (Owner duyệt G1 17/10/2026, không làm hook):
  - `CLAUDE.md` "Quy trình một task": bước 2 chạy `notes-for <issue>`; bước 4 thân PR có mục "Ghi chú OPEN liên quan", thiếu dòng là chặn, mục đã sửa chuyển RESOLVED ở PR sổ sau review. Dòng `tools/` của "Kiến trúc".
  - `/session-start` bước 5–6: chạy `notes-for <N>`, nêu các mục "Trùng file" trong tóm tắt.
  - `.github/pull_request_template.md`: mục "Ghi chú OPEN liên quan".
  - `review-pr` trục Spec: chạy `--pr <N>`; thiếu dòng → chặn (a), "đã sửa" mà diff không sửa → chặn (c), lý do yếu → không chặn. §4: đối chiếu sổ trước khi ghi MỚI, mỗi ghi chú nêu ít nhất một đường dẫn file. Head chưa có lệnh (nhánh cắt trước T-261) → chạy bản của checkout chính trong worktree review.
  - `task.yml` ô tùy chọn "Ghi chú OPEN liên quan"; `to-tickets` và `docs/agents/issue-tracker.md` chạy `--files` khi viết Issue, tính mục gộp vào cỡ. Sửa `to-tickets/SKILL.md` ghi vào bảng "Sửa cục bộ" của `.claude/skills/README.md`.
  - Đầu sổ `docs/state/review-notes.md` (một câu quy trình, không thêm dòng); dòng quyết định 17/10 ở `docs/PROJECT-STATE.md`.
- PR sổ riêng #677 (đã merge, không cần review) thêm đường dẫn cho tám mục OPEN chỉ nêu vùng. Sau #677 chỉ còn L182 không nêu file; mục đó thuộc nhóm ghi chú L181 mà PR này sửa.

Kích thước: 750 dòng tổng diff, code sản phẩm `tools/notes-core.mjs` + `notes-for.mjs` 348 dòng (gồm doc comment).

#### Ngoài danh sách file (P-2)

- `.claude/skills/README.md`: một dòng trong bảng "Sửa cục bộ" cho câu mới của `to-tickets/SKILL.md`. Checklist §6 (ADR-0012 phụ lục 03/10) bắt PR sửa file vendored trong `.claude/skills/` ghi vào bảng này; Issue #676 liệt kê `to-tickets/SKILL.md` mà quên bảng.

#### Vòng sửa sau review @`9169a2d` (CHANGES: 1 chặn, 2 không chặn)

- [chặn] Bảng "Sửa cục bộ" thiếu dòng cho `to-tickets/SKILL.md` → thêm dòng (#676, T-261), nêu ở "Ngoài danh sách file".
- [không chặn] `review-pr`: head chưa có `tools/notes-for.mjs` → thêm đường lùi: trong worktree review chạy `node C:\workspace\Project-2C\tools\notes-for.mjs --pr <N>`. Lệnh đọc sổ và file của thư mục đang đứng; đã thử chạy bản của worktree T-261 trong `Project-2C-review` (@`db4df45`), ra đúng sổ của thư mục đó.
- [không chặn] `targetPatterns` không tra tên ngắn / đường dẫn rút gọn, và lấy `tools/` làm target → tra như phía ghi chú, bỏ thư mục một cấp, có ca test mới "finds a short name or path in the repo as a note does, and drops a one-level folder". `notes-for 676` không còn 10 mục "Trong vùng" vì `tools/`; số mục của các Issue đã comment (#655, #658–#663) không đổi.

#### Vòng sửa sau review @`8f2acab` (CHANGES: 1 chặn, 3 không chặn)

- [chặn] File ở gốc repo (`CLAUDE.md`, `package.json`, `README.md`) bị coi là tên trần, nên bị bỏ hoặc bị thay bằng file cùng tên của package:
  - Phía ghi chú: `filesNamed` lấy file ở gốc khi không lọc được theo package, xét trước ngưỡng 3 nơi. Ca test "takes a bare name that is a file at the repo root as that file, unless a package narrows it" có cả `CLAUDE.md:42` lẫn `CLAUDE.md` dưới mục cha `packages/db`.
  - Phía Issue: `targetPatterns` lấy nguyên đường dẫn có trong repo trước mọi bước khác. Ca test "reads a listed path from the repo root first" kiểm `CLAUDE.md` đi cùng `packages/db/src/x.ts` vẫn là file ở gốc.
  - `notes-for 676` giờ ra 13 đường dẫn (giữ `CLAUDE.md`).
- [không chặn] Ghi chú nêu file mà PR xóa / đổi tên → `pathsNamed` giữ nguyên đường dẫn file (có `/`, có đuôi, không phải glob) mà repo không còn, có ca test "keeps a file path the repo no longer has…". `--diff` thêm `--no-renames`, `--pr` thêm `previous_filename`, để có cả tên cũ.
- [không chặn] Đường lùi ở `review-pr` dùng dấu `/`: `node C:/workspace/Project-2C/tools/notes-for.mjs --pr <N>`. Đã chạy thử trong Git Bash.
- [NIT] Số kiểm tay dưới đây đã sửa (658: 4 mục, `--pr 674`: 16 mục).
- Số mục "Trùng file" / "Trong vùng" của các Issue đã comment vẫn không đổi.

#### Test chấp nhận

- [x] Mục lá nêu đường dẫn đủ → "Trùng file"; file `*.test.*` cạnh file được nêu cũng tính: `allowedPatterns` "reads the paths and globs of the field, with the test file next to each source file" + `relatedNotes` "puts a note that names a target file in exact".
- [x] Tên trần + bỏ `:dòng` / `:12-13` / `:28–29` / `:~300` / `:84, :153`: "finds a bare file name in the repo and drops a line suffix".
- [x] Tên trùng nhiều nơi: "narrows a name found in many places…", "keeps a name found in up to three places…, drops it past that".
- [x] Mục con kế thừa, mục cha không báo riêng: "reports a heading only through its sub-items…".
- [x] Code span không phải đường dẫn (khóa i18n, regex, `docs/…`, thuộc tính Rust) và `docs/` một cấp: "takes no code span that is not a path", "reads a folder of two levels or more…".
- [x] Glob / thư mục → "Trong vùng", không vào "Trùng file": "puts a note under a target glob or folder…", "reads `*` within one folder and `**` across folders", "reads every other character of a glob as itself", "lists a note once, in exact when it is in both".
- [x] Chỉ đọc OPEN: "never reads RESOLVED or ACCEPTED".
- [x] Phía Issue tra tên ngắn, bỏ thư mục một cấp, giữ file mới: "finds a short name or path in the repo as a note does, and drops a one-level folder".
- [x] File ở gốc repo, cả hai phía: "takes a bare name that is a file at the repo root…", "reads a listed path from the repo root first". File bị xóa / đổi tên: "keeps a file path the repo no longer has…".
- [x] `allowedPatterns` trên body Issue thật (#656, mở `{a,b}`, bỏ chữ ngoài code span) + "is empty for a body without the field".
- [x] Kiểm tay:
  - `node tools/notes-for.mjs 658` → Trùng file 4 (L22, L123, L125, L126), Trong vùng 1 (L196).
  - `--pr 674` → 16 mục "Trùng file" (L13 … L196).
  - `676` → 13 đường dẫn / glob (có `CLAUDE.md`), Trùng file 1 (L181); `--files CLAUDE.md package.json` → không có mục nào (sổ chưa có ghi chú OPEN về hai file này).
  - `--files "apps/desktop/src/routes/{SettingsTrash.tsx,trash-view.ts}" e2e/trash.spec.ts` → các mục Thùng rác (L84–L91, L132, L133, L164, L165, L194).
  - `--diff` trên nhánh này → L181 (mục dưới).
  - Không đối số → in usage, thoát 2.
- [x] Mẫu PR, `review-pr` (Spec, chặn), `task.yml`, CLAUDE.md, `/session-start`: như mục Thay đổi.
- [x] Comment danh sách lên các Issue mở có mục "Trùng file": #655, #658, #659, #660, #661, #662, #663 (#657 không có mục nào; tóm tắt trên #676).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `706ba03`: 1 mục "Trùng file".

- L181 `.claude/skills/review-pr/SKILL.md:103` (review #672: câu đường lùi khi Owner chưa bật subagent nói khác ADR-0017) → **đã sửa**: câu nay là "Owner chưa bật subagent → vẫn chạy `code-review`, nó rà inline trong phiên này. Chỉ khi skill lỗi, hoặc đòi subagent mà không có đường inline → rà Correctness inline …, ghi 'code-review không chạy được'". Cả nhóm L179–L182 chuyển sang RESOLVED ở PR sổ sau review.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (format, lint, lint:deps, lint:tokens, codemap, typecheck, coverage)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low` (không đụng `.claude/hooks/**`, `.claude/settings.json`, workflow).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #677 — docs: name a file in the OPEN review notes that named only an area (T-261)

Trạng thái: MERGED · merge 2026-10-17T17:02:31Z · commit `305771c138f3e86676fba188d85002616d726fa5` · nhánh `task/T-261-review-notes`

Thêm đường dẫn file cho tám mục OPEN của `docs/state/review-notes.md` vốn chỉ nêu vùng, để `node tools/notes-for.mjs` (T-261, #676) khớp được chúng với task sửa đúng file đó. Không đổi nội dung ghi chú, không thêm / bớt dòng (số dòng `L<n>` giữ nguyên).

- L10 S-1 / D-1 (hash `kyc_versions` khi nhập backup) → `packages/db/src/backup-validation.ts`
- L19 Lịch hẹn, ô `aria-hidden` → `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx` (ô ngoài tháng `:460`)
- L21 #165 "RF" màu accent / năm khác → `apps/desktop/src/routes/customers/CustomerAppointments.tsx` (PR #165 là danh sách lịch hẹn trong hồ sơ KH)
- L22 #163 6a / 6h / "Xem tất cả (n)" → `apps/desktop/src/routes/appointments/AppointmentDialog.tsx` (mockup 6a, 6h, `appointmentForm.historyAll`), `e2e/appointments.spec.ts`
- L26 Cài đặt → `apps/desktop/src/routes/Settings.tsx` (hộp 10c, Nạp lại); `backups\` không đọc được → `apps/desktop/src-tauri/src/storage.rs` `backup_names` (doc: "an unreadable folder counts as empty", vẫn đúng ở `88e9a75`)
- L33 `DataTable` → `packages/ui/src/components/DataTable.tsx`
- L37 Domain → `packages/domain/src/kyc.ts` (`nextKycVersion`), `packages/domain/src/period.ts` (`parseQuickDate`)
- L38 Token G3 → `packages/ui/src/tokens.css`

Đã kiểm bằng `openNotes` của `tools/notes-core.mjs` (nhánh T-261): sau PR này chỉ còn L182 không nêu file, và mục đó được PR code của T-261 giải quyết.

PR chỉ sửa `docs/state/review-notes.md` → không cần review (Owner quyết 12/10/2026, T-215), merge bằng `node tools/merge-pr.mjs`.

Refs #676

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #683 — T-262: E2E mở hồ sơ KH chờ đúng h2 của hồ sơ, hết đỏ chập chờn ở customer-appointments

Trạng thái: CLOSED · nhãn: type:task, risk:low

##### Mục tiêu

Test e2e "the profile lists its appointments newest first; "Hẹn tiếp" fills in the next one" (`customer-appointments.spec.ts`) không còn đỏ chập chờn khi máy bận: hàm mở hồ sơ KH của e2e chỉ trả về khi hồ sơ đã hiện thật, nên các số đếm sau đó đọc trên hồ sơ chứ không phải trên màn Lịch hẹn.

##### Bối cảnh

- Phiên T-254 (#658, PR #682) chạy toàn bộ e2e ở Home PC ngày 18/10/2026: 238 / 239, đỏ đúng test này; chạy riêng `--repeat-each=3` xanh cả 3. Diff của T-254 không đụng màn hồ sơ / lịch hẹn, nên lỗi có từ trước. Thông báo lỗi của lượt đó không còn (đầu ra bị cắt).
- **Nguyên nhân (đã xác nhận):** `openProfile` bấm "Hồ sơ KH →" rồi chờ `getByRole('heading', { level: 2, name })`. Playwright so `name` theo chuỗi con, nên locator khớp luôn h2 "14/09/2026 19:30 · Đỗ Quốc Dũng" của khung chi tiết **trên màn Lịch hẹn**, đã hiện từ trước khi bấm (dò: locator trả về đúng dòng đó trước cú bấm). Bước chờ vì vậy qua ngay. Click đổi URL ngay, còn màn hồ sơ chỉ render khi task `hashchange` chạy (`useRoute` dùng `useSyncExternalStore`, hồ sơ đọc dữ liệu đồng bộ nên render trọn một nhịp). Khi máy bận, `rows.count()` có thể chạy trước task đó → đếm 0 dòng trên màn Lịch hẹn.
- **Tái hiện chắc chắn:** trì hoãn listener `hashchange` 300 ms (init script) → test đỏ ở `expect(count).toBeGreaterThan(0)`: `Expected: > 0 · Received: 0`. Cùng điều kiện, chờ heading với `exact: true` → xanh. Không làm chậm cả CPU được (CDP `setCPUThrottlingRate` làm chậm cả lệnh của Playwright nên thứ tự giữ nguyên); 200 lượt spec với 16 worker không đỏ lần nào, đúng kiểu chập chờn hiếm.
- Chờ URL (`toHaveURL`) không đủ: URL đổi trước khi hồ sơ render.
- Cùng bước chờ chép ở `openProfile` của `customer-policies.spec.ts` và sau link "Mở Hồ sơ KH để phân tích →" ở `appointments.spec.ts`. Hai chỗ này hiện không đỏ được vì bước kế tiếp dùng locator tự chờ (vùng "Hợp đồng", `#customer-name`, nút "Phân tích"), nhưng bước chờ cũng không chờ gì → sửa cùng lúc.
- Không sửa code sản phẩm.

##### Tài liệu cần đọc

- `e2e/customer-appointments.spec.ts` (`openProfile`, test đầu và test "+ Lịch hẹn")
- `e2e/customer-policies.spec.ts` (`openProfile`)
- `e2e/appointments.spec.ts` quanh link "Mở Hồ sơ KH để phân tích →" (~dòng 850)
- `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx` khung chi tiết (h2 "ngày giờ · tên KH"), `apps/desktop/src/routes/customers/CustomerProfile.tsx` h2 `#customer-name`, `apps/desktop/src/shell/useRoute.ts`
- `.claude/rules/tests.md` (e2e chọn phần tử theo role / nhãn)

##### File / thư mục được phép sửa

- `e2e/customer-appointments.spec.ts`
- `e2e/customer-policies.spec.ts`
- `e2e/appointments.spec.ts`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files e2e/customer-appointments.spec.ts e2e/customer-policies.spec.ts e2e/appointments.spec.ts` @ `54cb3bb`:

- L22 `e2e/appointments.spec.ts` (#163: nhóm trước → sau trong 6a bằng chữ, hộp 6h, e2e chưa kiểm "Xem tất cả (n)"): **để lại** — việc của hộp lịch hẹn 6a / 6h (code sản phẩm + e2e mới), khác phạm vi sửa bước chờ.
- L162 `e2e/customer-policies.spec.ts` (vòng `page.clock.fastForward` viết hai lần): **để lại** — gom vào `e2e/anchor.ts` phải sửa thêm `anchor.ts` và `appointment-outcome.spec.ts`, ngoài phạm vi sửa bước chờ; hợp với lần chạm `anchor.ts` sau.

##### Interface / hợp đồng

Không đổi interface. Chỉ đổi điều kiện chờ trong e2e: chờ h2 tên KH **khớp đúng** (`exact: true`) — h2 `#customer-name` của hồ sơ, không khớp h2 "ngày giờ · tên KH" của khung chi tiết màn Lịch hẹn.

##### Test chấp nhận

- [ ] `openProfile` (cả hai spec) và bước mở hồ sơ ở `appointments.spec.ts` chỉ qua khi h2 của hồ sơ đã hiện: locator chờ không khớp phần tử nào của màn Lịch hẹn.
- [ ] Với listener `hashchange` bị trì hoãn 300 ms (dò tạm, không commit): test đầu của `customer-appointments.spec.ts` đỏ trước khi sửa, xanh sau khi sửa.
- [ ] `customer-appointments.spec.ts` chạy lặp dưới tải (ví dụ `--repeat-each=40 --workers=16`) xanh hết; `customer-policies.spec.ts` và test sửa ở `appointments.spec.ts` vẫn xanh.
- [ ] Không đổi file ngoài danh sách được phép sửa.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #684 — test: wait for the profile's own heading before reading it (T-262)

Trạng thái: MERGED · merge 2026-10-18T06:05:09Z · commit `ce6de0ae5216498db66bc5873484177b60fed0c7` · nhánh `task/T-262-profile-wait`

Closes #683

#### Thay đổi

- Bước chờ sau khi bấm "Hồ sơ KH →" giờ khớp **đúng** tên KH: `getByRole('heading', { level: 2, name, exact: true })`. Áp ở ba chỗ chép cùng bước chờ:
  - `e2e/customer-appointments.spec.ts` (`openProfile`): test đỏ chập chờn của lượt e2e T-254.
  - `e2e/customer-policies.spec.ts` (`openProfile`).
  - `e2e/appointments.spec.ts` (sau link "Mở Hồ sơ KH để phân tích →").
- Lý do: Playwright so `name` theo chuỗi con, nên bước chờ cũ khớp h2 "14/09/2026 19:30 · Đỗ Quốc Dũng" của khung chi tiết **trên màn Lịch hẹn**. h2 đó đã hiện trước khi bấm, nên bước chờ qua ngay. Click đổi URL ngay, nhưng màn hồ sơ chỉ render khi task `hashchange` chạy. Máy bận thì `rows.count()` có thể chạy trước task đó và đếm 0 dòng. Hồ sơ đọc dữ liệu đồng bộ (`useQuery`, `useRoute` qua `useSyncExternalStore`), nên khi h2 `#customer-name` đã hiện thì cả hồ sơ đã render, các số đếm sau đó đúng.
- Không sửa code sản phẩm.

#### Test chấp nhận

- [x] Bước chờ không còn khớp phần tử nào của màn Lịch hẹn. Spec dò tạm cho thấy locator cũ trả về đúng h2 của khung chi tiết **trước** cú bấm.
- [x] Đỏ → xanh khi listener `hashchange` bị trì hoãn 300 ms (init script tạm, không commit):
  - Trước khi sửa, đỏ 2 / 5 test của `customer-appointments.spec.ts`:
    - Test đầu đỏ ở `expect(count).toBeGreaterThan(0)` với `Expected: > 0 · Received: 0`.
    - Test "+ Lịch hẹn" bấm nhầm nút "+ Lịch hẹn" của màn Lịch hẹn.
  - Sau khi sửa: 5 / 5 xanh.
- [x] Chạy lặp dưới tải đều xanh:
  - `customer-appointments.spec.ts` `--repeat-each=40 --workers=20`, chạy cùng lúc với `pnpm verify`: **200 / 200**.
  - Các test bị ảnh hưởng của ba spec `--repeat-each=10 --workers=16`: **110 / 110**.
  - Toàn bộ e2e (số worker mặc định, 4): **238 / 238**.
- [x] Không đổi file ngoài danh sách được phép sửa.

Ghi chú về đo đạc:
- Thông báo lỗi gốc của lượt T-254 không còn (đầu ra bị cắt). Thông báo trên là từ bản tái hiện.
- Làm chậm cả CPU qua CDP (`setCPUThrottlingRate`) không tái hiện được, vì lệnh của Playwright cũng chậm theo nên thứ tự giữ nguyên. Trước khi sửa, 200 lượt với 16 worker không đỏ lần nào: lỗi này hiếm.
- Một lượt quá tải hơn (24 worker cùng lúc với `pnpm verify`) làm `appointments.spec.ts:824` vượt trần 30 s ở 7 / 10 lần. Trace cho thấy:
  - Bước sửa qua trong 0,0 s.
  - Riêng `beforeEach` (mở trình duyệt + trang) đã mất 12,2 s, còn test dài này tới bước cuối ở giây 33.
  - Không liên quan sửa đổi: cùng nhóm test chạy 16 worker xanh 10 / 10.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `049f932`:

- L22 `e2e/appointments.spec.ts` (#163: nhóm trước → sau trong 6a bằng chữ, hộp 6h, e2e chưa kiểm "Xem tất cả (n)"): **để lại**, ngoài phạm vi. Đó là việc của hộp lịch hẹn 6a / 6h (code sản phẩm + e2e mới), không phải bước chờ.
- L162 `e2e/customer-policies.spec.ts` (vòng `page.clock.fastForward` viết hai lần): **để lại**, ngoài phạm vi. Gom vào `e2e/anchor.ts` phải sửa thêm `anchor.ts` và `appointment-outcome.spec.ts`, ngoài danh sách file của #683; hợp với lần chạm `anchor.ts` sau.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (exit 0; 114 file, 2966 test)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #691 — T-263: Test seed cố định múi giờ khi so hash dữ liệu giả lập (UTC+12)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Bộ unit của `packages/db` xanh ở mọi múi giờ mà nó hứa (UTC−11 … UTC+12), không chỉ tới UTC+11.

1. **Ca hash của dữ liệu giả lập cố định múi giờ.** Ca "writes the same data for the same anchor day and seed, and other data for another seed" so `contentHash` với `DEMO_HASH` đã ghim. Hiện ca này đỏ khi máy ở UTC+12 trở lên (Etc/GMT-12, Fiji, Auckland giờ hè, Kiritimati). Sửa: phần so với `DEMO_HASH` seed trong `inTimeZone('UTC', …)` (hàm đã có trong file), thêm comment cạnh `DEMO_HASH` nói hash là của dữ liệu seed ở UTC và vì sao. Giá trị `DEMO_HASH` **không đổi**: ở UTC−12 … UTC+11 dữ liệu đã giống hệt ở UTC.
2. **Comment "giống trên mọi máy" của dữ liệu tải nói rõ giới hạn.** Câu "the same on any machine" ở đầu `tools/load-data.mjs` và `tools/load-data-core.mjs` thêm khoảng UTC−12 … UTC+11, như header của `seed.ts`. Chỉ comment, không đổi code.

##### Bối cảnh

Phát hiện ngoài phạm vi của PR #689 (T-256, #660), phiên review đã tái hiện. Ghi ở sổ ghi chú bằng PR #690 (mục "Năm ghi chú không chặn của review PR #689", mục con cuối).

- Nguyên nhân: `middayOf` của seed cố ý lấy 12:00 giờ địa phương khi 12:00 UTC đã sang ngày khác (giữ ngày của thay đổi hồ sơ, D2, DR-15). Vì vậy từ UTC+12 mọi mốc thời gian và phần thời gian của mọi ULID lùi 12–14 giờ, còn ngày `yyyy-mm-dd` và các cột khác không đổi. Header `seed.ts` đã ghi giới hạn "UTC−12 tới UTC+11", nhưng ca ghim hash (T-216, #566) không cố định múi giờ.
- Mục tiêu 3 của #660 (DR6-92) và comment DR-15 của `setup()` hứa "UTC−11 … UTC+12". `setup()` đúng như vậy, nhưng cả bộ `packages/db` hiện chỉ xanh từ UTC−11 tới UTC+11.
- Đo ở `main` = `9f94787` dưới `TZ=Etc/GMT-12`: `packages/db` 550 / 551, chỉ ca này đỏ. PR #689 đo cả bộ unit của repo dưới UTC+12: 3 020 / 3 021, chỉ ca này đỏ. Dưới `TZ=Pacific/Pago_Pago` (UTC−11): `packages/db` 551 / 551.
- Không đổi `middayOf`: hành vi này là chủ ý (DR-15), có test riêng (Kiritimati) ở cùng ca.

##### Tài liệu cần đọc

- `docs/state/review-notes.md` mục "Năm ghi chú không chặn của review PR #689", mục con "Ngoài phạm vi, đã tái hiện: `packages/db/src/seed.test.ts`" và ba mục con của nó
- `packages/db/src/seed.test.ts`: `DEMO_HASH`, `inTimeZone`, ca "writes the same data for the same anchor day and seed…"
- `packages/db/src/seed.ts`: header (dòng 1–10), `middayOf`
- `packages/db/src/test-support.ts`: comment DR-15 của `setup()`
- `tools/load-data.mjs`, `tools/load-data-core.mjs`: comment đầu file

##### File / thư mục được phép sửa

- `packages/db/src/seed.test.ts`
- `tools/load-data.mjs`, `tools/load-data-core.mjs` (chỉ comment đầu file)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files packages/db/src/seed.test.ts tools/load-data.mjs tools/load-data-core.mjs` @ `9f94787`:

- L201 (`tools/load-data.mjs`, `tools/load-data-core.mjs`, mục con "Sửa ≈ 3–5 dòng…" của ghi chú review #689): gộp, đây chính là task này.
- L99 (`tools/load-data.mjs:53`, `--out` tương đối tính từ gốc repo): gộp. Cùng comment đầu file của mục 2, chỉ thêm một vế vào dòng usage.
- L101 (`tools/load-data.mjs:19`, hook `resolve` chép từ `tools/eval-ai.mjs`): để lại. Là refactor, chạm `tools/eval-ai.mjs` ngoài file được sửa.
- Ghi chú cha (L198) và hai mục con L199, L200 không hiện ở "Trùng file" (`notes-for` chỉ khớp mục lá, mục lá nêu file khác): chúng là cùng một việc với L201, PR trả lời chung một dòng.

##### Interface / hợp đồng

Không đổi API. `DEMO_HASH` giữ nguyên giá trị.

##### Test chấp nhận

- [ ] Cả bộ unit của `packages/db` xanh dưới `TZ=Etc/GMT-12` (UTC+12) và dưới `TZ=Pacific/Pago_Pago` (UTC−11).
- [ ] Cả bộ unit của repo xanh dưới `TZ=Etc/GMT-12`.
- [ ] Ca hash vẫn bắt thay đổi thật: sửa thử một giá trị của seed (hoặc `DEMO_HASH`) thì ca đỏ ở cả múi giờ máy lẫn UTC+12 (kiểm tay, ghi vào PR).
- [ ] `DEMO_HASH` không đổi giá trị; phần so ngày ở Kiritimati của cùng ca giữ nguyên.

Ước lượng: ≈ 5–10 dòng test + 2–4 dòng comment.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #702 — test(db): pin the demo hash on data seeded at UTC (T-263)

Trạng thái: MERGED · merge 2026-10-18T19:10:33Z · commit `2b0a7aafb7f0c4ff1641561a8c98ee780dd8b1b2` · nhánh `task/T-263-seed-hash-utc`

Closes #691

#### Thay đổi

- `packages/db/src/seed.test.ts`, ca "writes the same data for the same anchor day and seed, and other data for another seed":
  - Seed thêm một lần trong `inTimeZone('UTC', …)` và so hai mốc ghim (`DEMO_ROW_COUNTS`, `DEMO_HASH`) trên bản đó.
  - Phần so cùng seed / khác seed và phần so ngày ở Kiritimati giữ ở múi giờ máy như cũ. Chọn seed thêm một lần thay vì đưa cả ba lần seed sang UTC, để phần "cùng seed → cùng dữ liệu" vẫn chạy ở múi giờ máy (thêm một lần seed, ≈ 3–4 s trên Home PC).
  - Comment cạnh `DEMO_HASH`: hash là của dữ liệu seed ở UTC. Từ UTC+12, `middayOf` lấy 12:00 giờ địa phương nên mọi mốc và phần thời gian của mọi id lùi 12–14 giờ (DR-15); từ UTC−12 tới UTC+11 dữ liệu giống hệt ở UTC.
  - `DEMO_HASH` không đổi giá trị.
- `tools/load-data.mjs`, `tools/load-data-core.mjs`: chỉ comment đầu file. Câu "giống trên mọi máy" thêm khoảng UTC−12 … UTC+11 như header `seed.ts`; `load-data.mjs` thêm vế `--out` tương đối tính từ gốc repo (mục sổ L98). Không đổi code: chuỗi `USAGE` (`tools/load-data-core.mjs:24`) là code, không sửa.

#### Test chấp nhận

- [x] Cả bộ unit của `packages/db` xanh dưới `TZ=Etc/GMT-12` (UTC+12): 552 / 552. Trước khi sửa ca hash đỏ (nhận `aaec6a38…`, chờ `a66327bf…`). Dưới `TZ=Pacific/Pago_Pago` (UTC−11): 552 / 552.
- [x] Cả bộ unit của repo xanh dưới `TZ=Etc/GMT-12`: 3 117 / 3 117 (116 file).
- [x] Ca hash vẫn bắt thay đổi thật (kiểm tay, đã trả lại cả hai):
  - Đổi `'Chi'` → `'Chí'` trong `GIVEN_NAMES` (`packages/db/src/seed-data.ts`): ca đỏ ở múi giờ máy (SE Asia Standard Time, UTC+7) và dưới `TZ=Etc/GMT-12`, cùng hash nhận `94192108…` ở cả hai (bản UTC không theo múi giờ máy).
  - Đổi ký tự cuối của `DEMO_HASH` (`…e4b7` → `…e4b8`): ca đỏ ở cả hai múi giờ, nhận đúng `…eda711e4b7`.
- [x] `DEMO_HASH` không đổi giá trị; phần so ngày ở Kiritimati của cùng ca giữ nguyên.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `67dde2c`:

- L98 `tools/load-data.mjs:53` (`--out` tương đối tính từ gốc repo): đã sửa, thêm vế vào comment đầu file (dòng `Defaults:`).
- L100 hook `resolve` của `tools/load-data.mjs:19` chép từ `tools/eval-ai.mjs`: để lại. Là refactor, chạm `tools/eval-ai.mjs` ngoài danh sách file của Issue.
- L193 (ca hash seed trong `inTimeZone('UTC', …)`, comment cạnh `DEMO_HASH`, giới hạn UTC−12 … UTC+11 ở `load-data*`): đã sửa, đây là task này. Cùng việc với mục cha L190 và hai mục con L191, L192 (L192 hiện ở "Trong vùng": cả bộ `packages/db` nay xanh từ UTC−11 tới UTC+12, khớp comment DR-15 của `setup()`).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #692 — docs: point the seed hash time zone note to its issue (T-263)

Trạng thái: MERGED · merge 2026-10-18T09:45:24Z · commit `8a0d0a30ba1c7415f13c300f2b5e6458328ad0c0` · nhánh `docs/review-notes-t263`

Refs #691

#### Thay đổi

Trỏ hai ghi chú OPEN của `docs/state/review-notes.md` tới Issue #691 (T-263) vừa tạo:

- Ghi chú review PR #689 về `packages/db/src/seed.test.ts` đỏ từ UTC+12 (mục cha và mục con "Sửa ≈ 3–5 dòng…"): thay "Cần Issue riêng" bằng #691.
- Ghi chú review PR #566 `tools/load-data.mjs:53` (`--out` tương đối tính từ gốc repo): #691 gộp mục này, vì cùng sửa comment đầu file.

PR chỉ sửa `docs/state/review-notes.md`, nên không cần review; merge bằng `node tools/merge-pr.mjs` (Owner quyết 12/10/2026, T-215).

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #695 — T-264: Đo lại mốc Home PC sau integrity_check (#656)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Đo lại mốc Home PC sau #656 (T-252, `quick_check` → `integrity_check`) và ghi vào `docs/metrics/phase-6.md`, để G7 so "không xấu đi" trên mốc đúng với code phát hành (DR6-98, HANDOFF bước 3).

1. Build exe release tại máy ở `main` hiện tại, sinh lại dữ liệu tải (`node tools/load-data.mjs`, mốc 2026-10-12, seed 6; `tables` sha256 phải bằng lượt 2).
2. Probe T-218 (`e2e/perf`), `PERF_RUNS=5`, `PERF_BASE=docs/metrics/phase-6-baseline/perf-home-pc-luot-2.json`, như mục "Mốc Home PC sau deep review lượt 2": nhập dữ liệu tải, đóng exe, mở lại cùng thư mục, nối probe ngay.
3. Mở lần đầu (cách T-227, 3 lần, LCP) cùng exe.
4. Ghi JSON mới vào `docs/metrics/phase-6-baseline/`, thêm mục mốc mới vào `phase-6.md` (35 thao tác tóm tắt như mục lượt 2, so lượt 2), sửa dòng "Mốc này phải đo lại trước G7".

##### Bối cảnh

`docs/metrics/phase-6.md` mục "Mốc Home PC sau deep review lượt 2" dòng cuối: mốc đó đo ở `4217ed4` với `quick_check`; #656 thêm ≈ 30 ms mỗi lần mở. PR #674 đo A/B riêng (script, không phải probe): +34 ms, và ghi mốc mới cho G7 phải đo bằng probe đầy đủ sau khi merge.

##### Tài liệu cần đọc

- `docs/metrics/phase-6.md` mục "Số đo nền", "Mở app lần đầu, đo lại", "Mốc Home PC sau deep review lượt 2"
- `e2e/perf/README.md`
- Thân PR #674 mục "Số đo"

##### File / thư mục được phép sửa

- `docs/metrics/phase-6.md`
- `docs/metrics/phase-6-baseline/` (thêm file JSON mới, không sửa file cũ)

##### Interface / hợp đồng

Không đổi code. Tên thao tác của probe giữ nguyên.

##### Test chấp nhận

- [ ] Probe đủ 35 thao tác, mọi dòng trong ngưỡng `phase-6.md`; dòng ⚠️ so lượt 2 (nếu có) có giải thích.
- [ ] `tables` sha256 của dữ liệu tải bằng lượt 2 (`1c306cfb…`).
- [ ] Mở lần đầu: trung vị LCP ≤ 4 724 ms.

##### Định nghĩa hoàn thành

- [ ] Review phiên sạch: PASS (PR docs, không chạy CI)

##### Rủi ro

risk:low

##### Bị chặn bởi

Không (#656 đã merge, PR #674)

## PR #696 — docs: record the Home PC baseline after integrity_check (T-264)

Trạng thái: MERGED · merge 2026-10-18T16:07:39Z · commit `8f202bc84f21307faf2f62dc7a87c45fae89de08` · nhánh `task/T-264-home-pc-baseline`

Closes #695

#### Thay đổi

T-264: đo lại mốc Home PC sau #656 (T-252, `quick_check` → `integrity_check`), làm bước 3 của HANDOFF và DR6-98. PR chỉ sửa tài liệu.

- `docs/metrics/phase-6.md`: thêm mục "Mốc Home PC sau #656 (T-264, 18/10/2026)". Đây là mốc G7 sẽ so. Mục lượt 2 ghi rõ đã có mốc mới thay; câu mở đầu file nêu thêm mục này.
- `docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json`: JSON của probe ở `dae9df3`. Lần đo sau so với file này qua `PERF_BASE`.

##### Cách đo (Home PC `DESKTOP-KDURKJP`, 18/10)

1. Build exe release tại máy ở `main` `dae9df3`: 5 408 768 byte.
2. Sinh lại dữ liệu tải (`node tools/load-data.mjs`). `tables` sha256 `1c306cfb…589591`, bằng lượt 2.
3. Mở lần đầu theo cách T-227: 3 lần, mỗi lần một thư mục mới.
4. Nhập dữ liệu tải qua CDP (`project2c.db` 14 069 760 byte, bằng lượt 2), đóng exe, mở lại cùng thư mục rồi chạy probe ngay: `PERF_RUNS=5`, `PERF_BASE` = mốc lượt 2.
5. Đối chứng cùng ngày: chạy lại các bước 4 trên exe lượt 2 (`4217ed4`, sha256 `E2C421…4504`, bản giữ ở `deep-review-1-6-r2`).
6. Đo thêm `app.open-data` 5 lần mỗi exe, mở xen kẽ.

##### Kết quả chính

| | Lượt 2 `4217ed4` (17/10) | `4217ed4` đo lại (18/10) | `dae9df3` |
|---|---|---|---|
| `app.open-data` probe (1 mẫu) | 301 ms | 321 ms | 387 ms ⚠️ |
| `app.open-data` 5 lần mở xen kẽ | — | 308 ms | 351 ms |
| `reload.*` (6 màn) | 247–355 ms | 256–368 ms | 283–398 ms (`reload.customers` ⚠️) |
| LCP mở lần đầu | 3 526 ms | — | 3 663 ms |

- Cả 35 thao tác nằm trong ngưỡng `phase-6.md`. LCP mở lần đầu ≤ 4 724 ms.
- Máy hôm nay gần như hôm đo lượt 2: cùng exe `4217ed4`, không dòng nào ⚠️.
- Phần do code, so cùng ngày:
  - Năm màn `reload.*` tăng +27…+35 ms, `app.open-data` +43 ms. Khớp chi phí `integrity_check` (PR #674: +31 ms trong Node, +34 ms trên exe).
  - `reload.customers` tăng +55 ms, tức dư ≈ 20 ms so với chi phí đó. Phần dư chưa rõ nguyên nhân: từ `4217ed4`, `CustomersScreen.tsx` và `customers-view.ts` không đổi. Màn vẫn còn cách ngưỡng 164 ms.
- `trash.open` từ T-256 đo khi đã ngắt DevTools: 34 ms ở cả hai exe. Không so được với 73 ms của lượt 2 (đo khi gắn DevTools).

#### Test chấp nhận

- [x] Probe chạy đủ 35 thao tác, mọi dòng trong ngưỡng `phase-6.md`. Hai dòng ⚠️ so lượt 2 (`app.open-data`, `reload.customers`) có giải thích trong tài liệu.
- [x] `tables` sha256 của dữ liệu tải bằng lượt 2 (`1c306cfb…`).
- [x] Mở lần đầu: trung vị LCP 3 663 ms ≤ 4 724 ms.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `dae9df3`:

- L78, L87, L90, L102, L106 (nhắc ghi các PR #539, #543, #545, #566, #572 vượt ngưỡng cỡ khi viết `phase-6.md`): để lại. Các mục này thuộc mục "Kích thước PR vượt ngưỡng", điền cuối phase. PR này chỉ thêm mốc đo.
- L213 (cờ đo `app.open-data`, câu cuối "#656 đổi sang `integrity_check` nên đo lại khi G7"): đã sửa. Đã đo lại; mốc mới và nguyên nhân phần tăng ghi trong mục mới của `phase-6.md`.

#### Kiểm tra

- [x] PR docs-only (`docs/**`), không chạy CI; không sửa code
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #665 — docs: record the Owner answers of deep review Phase 1-6 round 2 (T-225)

Trạng thái: MERGED · merge 2026-10-17T12:29:23Z · commit `9c86d77d9896a76dd5adfc0eb7dc92bc8338a600` · nhánh `task/T-225-tra-loi-luot-2`

#### Tóm tắt

Ghi câu trả lời của Owner (17/10/2026) cho §9 của bản tổng hợp deep review Phase 1–6 lượt 2 (T-225 #565), danh sách Issue sửa và số đo lượt 2.

- **Bản tổng hợp** (`docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md`):
  - §9: câu trả lời. Q9 Phương án 3 (sửa hết). Q8 phương án (c) mới: nút "Dọn sạch Thùng rác…". Các câu khác theo đề xuất; Q2 làm cả dạng trộn theo Q9. Lỗi xóa nhân sự khi KH của họ ở Thùng rác vào L2-F.
  - §8.6 mới: 12 Issue #652–#663, nhóm, mức rủi ro, quan hệ chặn, thứ tự gợi ý.
  - §8.2, §8.4, §8.5: ghi phần Phương án 3 đổi so với bảng đề xuất.
  - §1 "Còn trước G7"; §8.1 bước đã xong.
  - Cột "Nhóm" của DR6-77, 84, 95, 98, 102, 103.
- **`docs/PROJECT-STATE.md`:** dòng quyết định 2026-10-17.
- **`docs/metrics/phase-6.md`:**
  - Mục mới "Mốc Home PC sau deep review lượt 2" (DR6-98): bảng so lượt 1 cùng máy, nguyên nhân 7 dòng ⚠️, `trash.open` khi gắn / ngắt DevTools, phải đo lại sau #656 (`integrity_check`).
  - Mục "Review đóng phase": số liệu hai lượt.
  - Dòng 90: so mở lần đầu theo quyết định 17/10 (ADR-0001 M7).
- **`docs/metrics/phase-6-baseline/perf-home-pc-luot-2.json`** (mới): JSON probe lượt 2 Home PC để chạy `PERF_BASE`. Chép nguyên văn từ `C:\workspace\deep-review-1-6-r2\common\perf\perf-ref.json`.
- **`docs/state/review-notes.md`:** ghi chú `phase-6.md:90` của review lại #647 chuyển sang RESOLVED.

Phần sổ ghi chú còn lại đã merge ở #664.

#### File ngoài danh sách được phép của #565

- `docs/PROJECT-STATE.md`: sổ quyết định Owner theo ngày (như #613 của lượt 1).
- `docs/metrics/phase-6-baseline/perf-home-pc-luot-2.json`: file mốc mà mục mới của `phase-6.md` trỏ tới. G7 so `PERF_BASE` với nó; nằm cạnh `perf.json` của T-219.

Chỉ sửa `docs/**` → không chạy CI. `pnpm verify` xanh ở máy.

Refs #565

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #704 — T-265: Module nạp TypeScript dùng chung cho tools/, sửa import có dấu chấm (#474)

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress

##### Mục tiêu

Hai lệnh Node của `tools/` nạp code TypeScript của các package (`node tools/load-data.mjs`, `node tools/eval-ai.mjs` / `pnpm eval:ai`) dùng chung **một** module nạp, thay cho hai bản hook `resolve` chép nhau. Sửa luôn lỗi #474 ở chỗ chung đó: import tương đối không đuôi mà tên có dấu chấm (vd. `./golden/kyc.fixture` → `kyc.fixture.ts`) được thử thêm `.ts` / `/index.ts` như mọi import không đuôi khác.

1. **Module nạp dùng chung.** Logic hai hook (`resolve` cho import không đuôi, `load` cho `?raw`) tách ra một module thuần có test; một module mỏng gọi `registerHooks` của `node:module`. Hai lệnh import module mỏng đó và bỏ `registerHooks` riêng. `eval-ai` nhận thêm hook `?raw` (vô hại: cây import của nó không có `?raw`).
2. **Sửa lỗi #474.** Hook `resolve` hiện bỏ qua mọi specifier khớp `/\.\w+$/`, nên `./golden/kyc.fixture` không được thử `./golden/kyc.fixture.ts`. Sửa: specifier tương đối mà Node không nạp được thì luôn thử thêm `.ts` rồi `/index.ts`; không được thì ném **lỗi gốc** (như nay). Specifier không tương đối (`zod`, `node:fs`, `@p2c/…`) giữ nguyên hành vi.

Không đổi hành vi nào khác của hai lệnh: cùng tham số, cùng đầu ra, cùng file ghi.

##### Bối cảnh

- Ghi chú không chặn của review PR #566 (T-216, #556): hook `resolve` của `tools/load-data.mjs` chép từ `tools/eval-ai.mjs`, cùng lỗi #474 → tách một module nạp TypeScript dùng chung trong `tools/` (kèm hook `?raw`), sửa lỗi #474 một chỗ cho cả hai lệnh.
- Ghi chú #474 (T-171): lỗi chưa xảy ra vì chỉ file test import kiểu `./golden/kyc.fixture` (Vitest tự nạp TS), còn cây import thật của hai lệnh nạp được. Module dùng chung sửa lỗi trước khi lệnh thứ ba hay một import mới gặp nó.
- PR #702 (T-263, #691) để mục này lại vì chạm `tools/eval-ai.mjs`, ngoài danh sách file của #691. Owner bảo làm riêng (19/10/2026).
- `.claude/rules/tests.md`: logic thuần của `tools/*.mjs` tách ra `*-core.mjs` có test; phần I/O không unit test. Node ≥ 24 (`engines`) có `registerHooks` đồng bộ và tự bỏ kiểu của `.ts`.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục "Script eval AI `tools/eval-ai.mjs` (#474…)" (mục con `eval-ai.mjs:21`) và mục "Ba ghi chú không chặn của review PR #566", mục con *Duplicated Code* hook `resolve`
- `tools/load-data.mjs`: comment đầu file, `registerHooks` (`resolve` + `load` cho `?raw`), các `await import`
- `tools/eval-ai.mjs`: comment đầu file, `registerHooks` (`resolve`), các `await import`
- `.claude/rules/tests.md`: dòng `tools/*.mjs`
- `tools/load-data-core.test.mjs`: kiểu test của `tools/` (Vitest, import `.mjs`)

##### File / thư mục được phép sửa

- `tools/ts-hooks-core.mjs`, `tools/ts-hooks-core.test.mjs` (mới: logic hai hook + test)
- `tools/ts-hooks.mjs` (mới: gọi `registerHooks`)
- `tools/load-data.mjs`, `tools/eval-ai.mjs` (bỏ hook riêng, import module chung, sửa comment cho khớp)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files tools/ts-hooks.mjs tools/ts-hooks-core.mjs tools/ts-hooks-core.test.mjs tools/load-data.mjs tools/eval-ai.mjs` @ `02938e7`:

- L67 (`tools/eval-ai.mjs:21`, hook `resolve` bỏ qua specifier có dấu chấm, #474): gộp, là mục tiêu 2.
- L99 (`tools/load-data.mjs:19`, hook `resolve` chép từ `tools/eval-ai.mjs`): gộp, là mục tiêu 1.

##### Interface / hợp đồng

```js
// tools/ts-hooks-core.mjs — pure, unit-tested
/** The hooks of `registerHooks` (node:module). `readText(url: URL): string` reads a `?raw` file. */
export function tsHooks(readText) // → { resolve(specifier, context, nextResolve), load(url, context, nextLoad) }

// tools/ts-hooks.mjs — I/O: registerHooks(tsHooks((url) => readFileSync(url, 'utf8')))
```

- `resolve`: thử `nextResolve(specifier)`; lỗi và specifier bắt đầu bằng `.` → thử `specifier + '.ts'`, rồi `specifier + '/index.ts'`; không được → ném lỗi của lần đầu. Specifier khác → ném lỗi như nay.
- `load`: URL kết thúc `?raw` → `{ format: 'module', source: 'export default <JSON của chữ trong file>;', shortCircuit: true }`; URL khác → `nextLoad(url, context)`.
- Hai lệnh: `import './ts-hooks.mjs';` trước mọi import TypeScript; các import TypeScript vẫn là `await import(…)` (import tĩnh được liên kết trước khi hook đăng ký).

##### Test chấp nhận

- [ ] Hai lệnh dùng chung một module nạp: trong `tools/`, chỉ `tools/ts-hooks.mjs` gọi `registerHooks`; `tools/load-data.mjs` và `tools/eval-ai.mjs` import `./ts-hooks.mjs` (kiểm bằng `git grep -n registerHooks -- tools/`).
- [ ] Lỗi #474 có test đỏ trước khi sửa: ca "import không đuôi có dấu chấm (`./golden/kyc.fixture`) nạp `kyc.fixture.ts`" đỏ với logic `resolve` cũ (chép nguyên sang module chung), xanh sau khi sửa. PR dán dòng đỏ.
- [ ] Unit test `tsHooks` (giả `nextResolve` / `nextLoad` / `readText`): import tồn tại trả nguyên kết quả của Node; `./x` → `./x.ts`; `./dir` → `./dir/index.ts`; ưu tiên `.ts` hơn `/index.ts`; không tìm được → ném đúng lỗi gốc; specifier không tương đối không thử thêm đuôi; `?raw` → module `export default` đúng chữ (kể cả dấu nháy, xuống dòng); URL không `?raw` đi qua `nextLoad`.
- [ ] `node tools/load-data.mjs --out <file tạm>` chạy như cũ: in cùng số dòng mỗi bảng và cùng hash `tables` như ở `main` (anchor, seed mặc định). PR ghi hai kết quả.
- [ ] `node tools/eval-ai.mjs` (không `OPENCODE_GO_KEY`) nạp đủ cây import của `@p2c/ai` rồi dừng ở báo thiếu key, giống hệt `main` (không gọi mạng, không tốn tiền). PR ghi kết quả.

Ước lượng: ≈ 40 dòng sản phẩm (module chung + module mỏng; hai lệnh bớt ≈ 40 dòng), ≈ 90 dòng test; tổng diff ≈ 200 dòng.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #705 — refactor(tools): share the TypeScript loader hooks, find dotted names (T-265)

Trạng thái: MERGED · merge 2026-10-18T19:41:20Z · commit `1f0489f88a2c094c5fbf0f467072cf2fd8a6ac27` · nhánh `task/T-265-shared-ts-hooks`

Closes #704

#### Thay đổi

- `tools/ts-hooks-core.mjs` (mới): `tsHooks(readText)` trả hai hook của `registerHooks` (`node:module`). `resolve`: import tương đối không đuôi → thử `.ts` rồi `/index.ts`, không được thì ném lỗi gốc. `load`: URL `?raw` → module `export default <chữ của file>`, URL khác qua `nextLoad`. I/O (`readText`) nhận qua tham số nên test được (`.claude/rules/tests.md`).
- `tools/ts-hooks.mjs` (mới, I/O): `registerHooks(tsHooks((url) => readFileSync(url, 'utf8')))`. Comment nhắc import TypeScript phải là `await import(…)` sau module này (import tĩnh được liên kết trước khi hook đăng ký).
- `tools/load-data.mjs`, `tools/eval-ai.mjs`: bỏ `registerHooks` riêng, thay bằng `import './ts-hooks.mjs';` trước các `await import` có sẵn. `eval-ai` nhận thêm hook `?raw`; cây import của nó không có `?raw` nên không đổi gì.
- **Sửa lỗi #474** trong `resolve`: bỏ điều kiện `/\.\w+$/`. Specifier tương đối mà Node không nạp được thì luôn thử thêm `.ts` / `/index.ts`, nên `./golden/kyc.fixture` tìm được `kyc.fixture.ts`. Specifier trỏ tới file có thật (vd. `./x.ts`, `./schema.sql?raw`) không đi vào nhánh này. Specifier không tương đối (`zod`, `node:…`, `@p2c/…`) giữ nguyên hành vi.
- Không đổi tham số, đầu ra hay file ghi của hai lệnh. Không file nào ngoài danh sách của Issue.

#### Test chấp nhận

- [x] Hai lệnh dùng chung một module nạp: `git grep -n registerHooks -- tools/` chỉ ra `tools/ts-hooks.mjs`; `tools/load-data.mjs` và `tools/eval-ai.mjs` import `./ts-hooks.mjs`.
- [x] Lỗi #474 có test đỏ trước khi sửa. Bước đầu chép nguyên logic `resolve` cũ sang `tools/ts-hooks-core.mjs`, chạy `tools/ts-hooks-core.test.mjs`: 11 / 13 xanh, đúng hai ca #474 đỏ:
  ```
  FAIL  tools/ts-hooks-core.test.mjs > tsHooks resolve > finds an extensionless name with a dot in it as a .ts file (#474)
  Error: Cannot find './golden/kyc.fixture'
  FAIL  tools/ts-hooks-core.test.mjs > tsHooks resolve > throws the first error of ./golden/missing.fixture when no file matches
  AssertionError: expected './golden/missing.fixture' to be './golden/missing.fixture/index.ts' // Object.is equality
  ```
  Sau khi sửa: 13 / 13 xanh.
- [x] Unit test `tsHooks` (giả `nextResolve` / `nextLoad` / `readText`): import tồn tại trả nguyên kết quả của Node và không thử thêm (kể cả `?raw`); `./rows` → `rows.ts`; `./migrations` → `migrations/index.ts`; `..` → `../index.ts`; `.ts` trước `/index.ts`; không tìm được → ném đúng đối tượng lỗi của lần đầu (cả tên có dấu chấm); `zod`, `node:missing`, `@p2c/missing` không thử thêm đuôi; `?raw` → `export default` đúng chữ (nháy đơn / kép, backtick, `\`, `${…}`, `\n`, `\r\n`); URL khác qua `nextLoad` với đúng `url` / `context`.
- [x] `node tools/load-data.mjs --out <file tạm>` chạy như cũ (Home PC, anchor / seed mặc định): `main` @ `02938e7` và nhánh in cùng số dòng mỗi bảng (customers 1 496, appointments 10 414, kyc_facts 13 833…) và cùng `tables sha256  1c0a43fb9d5711df4700cb688a256ac50bb44eed1c0fd00218fa36f0746d003f`, file 15,3 MB. Hai file chỉ khác từ ký tự 80 (mốc giờ xuất).
- [x] `node tools/eval-ai.mjs` không `OPENCODE_GO_KEY`: nạp đủ cây import của `@p2c/ai` rồi dừng ở `Thiếu biến môi trường OPENCODE_GO_KEY (key OpenCode) — không gọi gì.`, exit 1, giống hệt `main`. Không gọi mạng.
- Thêm (kiểm tay, Node thật, ngoài repo): `node --import tools/ts-hooks.mjs main.ts` với `main.ts` import `./golden/kyc.fixture` (`kyc.fixture.ts`), `./dir` (`dir/index.ts`) và `./note.txt?raw` → in đúng ba giá trị. Không `--import`: `ERR_MODULE_NOT_FOUND`.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `d5dc9f0`:

- L67 `tools/eval-ai.mjs:21` (hook `resolve` bỏ qua specifier có dấu chấm, #474): đã sửa, sửa ở `tools/ts-hooks-core.mjs` cho cả hai lệnh. Mục cha L66 chỉ có mục con này.
- L99 hook `resolve` của `tools/load-data.mjs:19` chép từ `tools/eval-ai.mjs`: đã sửa, hai lệnh dùng chung `tools/ts-hooks.mjs` (kèm hook `?raw`).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (117 file, 3 130 test)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---
