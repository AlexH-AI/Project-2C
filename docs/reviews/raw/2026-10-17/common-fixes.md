# Issue và PR sửa lượt 1 — deep review Phase 1–6, lượt 2

Dựng ở bước chuẩn bị (`plan.md` §L2.9 bước 4), 17/10/2026, máy `DESKTOP-KDURKJP`, bằng `gh issue view` / `gh pr view --json` trên `AlexH-AI/Project-2C`. Nguyên văn thân 17 Issue (#592–#607, #625) và thân mọi PR sửa của chúng (bảng `plan.md` §L2.2, gồm PR docs đi kèm), để reviewer không cần chạy `gh`. Tiêu đề trong thân đã hạ cấp để lồng dưới mục của file này; chữ giữ nguyên.

| Issue | Tiêu đề | PR (commit merge) |
|---|---|---|
| #592 | T-231: Khôi phục cuộc gặp Đã gặp về đúng như lúc xóa (DR6-01, DR6-03) | #614 (`23eed54`), #615 (`b752bc4`) |
| #593 | T-232: Ghi, sửa, xóa cuộc gặp theo nhóm của KH tại ngày cuộc hẹn (DR6-04, DR6-05) | #616 (`b563604`) |
| #594 | T-233: Bàn giao KH chuyển cả lịch Dự kiến sang RE mới (DR6-02) | #618 (`5d2443f`) |
| #595 | T-234: Lớp file: chặn DB hỏng, câu lỗi khởi động / lưu đúng nguyên nhân, `openFrom` (DR6-06…09) | #620 (`9acef55`), #621 (`0446180`) |
| #596 | T-235: Rust AI và cấu hình phát hành: key hai lớp, tên model, phiên bản 1.0.0, crate-type, quyền webview (DR6-10…14) | #617 (`1531b71`) |
| #597 | T-236: Hồ sơ KH và Tổng quan khớp danh sách nghiệm thu G7 (DR6-27…30, DR6-46) | #623 (`bf87d71`), #624 (`123f846`) |
| #598 | T-237: AI: phiên ChatGPT web theo mốc dữ liệu, V1 / LAW_NAME đúng chữ G5, version prompt của seed, Mock trích xuất (DR6-15, 16, 18, 19, 22) | #628 (`e6c9078`) |
| #599 | T-238: Bản phân tích STALE vẫn mờ nhưng đạt WCAG AA (DR6-21) | #632 (`35ba0d3`) |
| #600 | T-239: Hộp lịch hẹn và HĐ: ngày qua giao thừa, case size, chênh FYP, đổi tháng, lịch hẹn tiếp (DR6-38…42) | #634 (`ffc1db7`) |
| #601 | T-240: Thùng rác và Cài đặt → Dữ liệu: chỉ mục `customer_id`, sắp cột, nhãn nút, sang ngày, thông báo (DR6-43…45) | #630 (`43e6696`) |
| #602 | T-241: Team và Khách hàng: người đánh giá trong hộp Xóa nhân sự, KH ngoài góc nhìn, bảng Team, lỗi form (DR6-26, 31, 32, 33) | #636 (`ba3ca2d`) |
| #603 | T-242: Điều hướng và trợ năng: chặn Back trên exe, focus khi đổi màn, focus sau nút tự gỡ (DR6-20, 34, 35) | #638 (`e8d340a`) |
| #604 | T-243: Chữ và nhập backup: khoảng trắng / ký tự vô hình, mâu thuẫn trùng giá trị, enum, CHECK nhân sự (DR6-49…52) | #640 (`d3797d7`) |
| #605 | T-244: Công cụ: key và `finish_reason` của script eval, cổng merge chặt hơn, `retro.mjs` (DR6-55…58, DR6-64) | #642 (`30e12c4`), #646 (`4217ed4`) |
| #606 | T-245: Test giữ các luật đột biến còn sống (DR6-59, 62, 63, 65 và phần TS của DR6-60) | #644 (`83e0515`) |
| #607 | T-246: Tài liệu: lệch mockup đã biết, câu NT-TQ-06, ghi chú golden L-09 (DR6-29, 36, 47, 48, 54) | #619 (`13f62d6`) |
| #625 | T-247: Chụp lại hai ảnh hướng dẫn còn lệch sau T-236 (06-ai-phan-tich, 03-ket-qua) | #626 (`d887a82`) |

---

# Issue #592 — T-231: Khôi phục cuộc gặp Đã gặp về đúng như lúc xóa (DR6-01, DR6-03)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

#### Mục tiêu

Xóa rồi khôi phục một lịch hẹn Đã gặp trả dữ liệu về **đúng như trước khi xóa** (Owner duyệt 15/10 — bản tổng hợp lượt 1 §9 Q1 phương án (a), Q2):

1. Cuộc gặp lúc xóa **không rút chuyển nhóm nào** (giữ nhóm) → khôi phục không ghi chuyển nhóm, không kiểm D10 / ADR-0007. Hộp TR-8 và dòng Thùng rác nói "không đổi nhóm KH" (DR6-01, **Medium**).
2. Cuộc gặp lúc xóa **có rút** một chuyển nhóm → khôi phục ghi lại đúng chuyển nhóm đó như hiện nay (E5–E8). Một chuyển nhóm của KH ghi **sau lúc xóa** mà cùng ngày cuộc hẹn được tính như "nhóm đã đổi sau ngày cuộc hẹn" → từ chối, lý do nêu ngày (DR6-03 ca b).
3. Thùng rác (lý do chặn, hệ quả TR-8) dùng chung đúng hàm kiểm của lệnh khôi phục (như hiện nay).
4. Spec Phase 6 §4.2: TR-3 thêm hai dòng trên và bảng ví dụ thêm **E18** (giữ nhóm, KH đổi nhóm ngày sau → khôi phục được, không thêm chuyển nhóm, "Đã gặp" của kỳ về lại), **E19** (giữ nhóm, có chuyển tay cùng ngày cuộc hẹn → khôi phục được, không thêm chuyển nhóm — DR6-03 ca a), **E20** (có chuyển nhóm bị rút, rồi chuyển tay cùng ngày cuộc hẹn → chặn như E6 — DR6-03 ca b).

#### Bối cảnh

Deep review Phase 1–6 lượt 1 (T-223 #563): DR6-01 (L·CL-E7, H·CL-F2), DR6-03 (L·CL-A1). Hôm nay `checkRestoreAppointment` so "nhóm sau" với nhóm **hiện tại** của KH: phiên tổng hợp chạy lại trên dữ liệu tải, 2 690 / 4 254 cuộc gặp giữ nhóm không khôi phục được ngay sau khi xóa, dù hộp 6g hứa "khôi phục được". Ghi / sửa / xóa cuộc gặp theo nhóm tại ngày cuộc hẹn là T-232 (làm sau Issue này). Bắt đầu sau khi PR #591 (bản tổng hợp) merge.

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §4.2, §5.1 (DR6-01, DR6-03), §8.2 S1-A, §9 Q1–Q2
- `docs/design/phase-6-hoan-thien.md` §4.2 (TR-3, TR-8, bảng E1–E16)
- `docs/design/phase-3-du-lieu.md` §1 (D7, D10), §4 (dòng `recordMeetingOutcome`, `softDelete…` / `restore…`)
- `docs/decisions/0007-dinh-nghia-chi-so-va-vong-doi.md` (RF gắn với chuyển nhóm)
- `packages/db/src/appointments.ts` (`softDeleteAppointment`, `restoreAppointment`, `checkRestoreAppointment`, `outcomeStage`, `applyOutcome`)
- `packages/db/src/customers.ts` (`withdrawAppointmentTransition`, `checkTransition`)
- `packages/db/src/trash.ts` (`listTrash`: `blocked`, `effect`) và `packages/db/src/trash.test.ts`
- `apps/desktop/src/routes/trash-view.ts` (câu hệ quả / lý do)

#### File / thư mục được phép sửa

- `packages/db/src/appointments.ts`, `packages/db/src/customers.ts`, `packages/db/src/trash.ts` và test cạnh chúng
- một file test mới trong `packages/db/src/` cho test thuộc tính xóa → khôi phục
- `apps/desktop/src/routes/trash-view.ts` (+ test), `apps/desktop/src/i18n/vi.ts` (nếu câu hệ quả đổi)
- `e2e/trash.spec.ts`
- `docs/design/phase-6-hoan-thien.md` (§4.2: TR-3, E18–E20)

#### Interface / hợp đồng

- `checkRestoreAppointment(db, row)` vẫn ném `DbError` y như `restoreAppointment`; `listTrash` tính `blocked` và `effect` bằng chính hàm đó.
- Dòng Thùng rác của cuộc gặp giữ nhóm: `effect` là "không đổi nhóm" như lịch không Đã gặp.

#### Test chấp nhận

- [ ] E18, E19, E20 là test ở `trash.test.ts` (lệnh và `listTrash` cùng kết quả); E1–E16 vẫn xanh.
- [ ] Test thuộc tính trên seed demo (ngày neo cố định): xóa rồi khôi phục **từng** lịch hẹn (trừ ca D7 từ chối xóa), HĐ, KH → `exportBackup` bỏ `updated_at`, `deleted_at` giống hệt trước.
- [ ] Trên dữ liệu tải (`node tools/load-data.mjs` mặc định): xóa rồi khôi phục ngay mỗi cuộc gặp Đã gặp giữ nhóm → 0 bị từ chối (trước: 2 690 / 4 254); ghi số vào PR.
- [ ] e2e: xóa cuộc gặp giữ nhóm của KH đã đổi nhóm sau đó → Thùng rác cho khôi phục, hộp xác nhận ghi không đổi nhóm; khôi phục xong lịch về "Đã gặp".

Ước lượng: ≈ 30–50 dòng SP + ≈ 200 dòng test.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:med

#### Bị chặn bởi

Không (bắt đầu sau khi PR #591 merge)

## PR #614 — fix: restore a deleted met appointment as it was deleted (T-231)

Trạng thái: MERGED · merge 2026-10-15T06:44:32Z · commit `23eed54ad816823a63cb21667babaa40ee0cea8b` · nhánh `task/T-231-restore-kept-meeting`

Closes #592 (T-231 — DR6-01 Medium, DR6-03).

#### Thay đổi

Khôi phục lịch hẹn trả dữ liệu về **đúng như lúc xóa** (Owner duyệt 15/10, tổng hợp lượt 1 §9 Q1 (a), Q2):

- **Mốc xóa chung.** `softDeleteAppointment` đóng dấu lịch và chuyển nhóm nó rút bằng **cùng một thời điểm** (`withdrawAppointmentTransition(db, id, at)`). Nhờ vậy lúc khôi phục / ở Thùng rác biết lần xóa có rút chuyển nhóm nào không (`transitionWithdrawnAt`), không đoán theo nhóm hiện tại của KH.
- **`restoreStageMove(db, row, stage)`** (`appointments.ts`) là hàm chung của `checkRestoreAppointment`, `restoreAppointment` và `listTrash` (hệ quả TR-8):
  - lúc xóa không rút chuyển nhóm (không Đã gặp, hoặc Đã gặp giữ nhóm) → `null`: khôi phục không ghi chuyển nhóm, không kiểm D10; Thùng rác `effect: none` — "Không đổi nhóm KH" (E18, E19);
  - có rút → ghi lại như hiện nay (E5–E8). KH chưa đổi nhóm từ lúc xóa thì **chính chuyển nhóm đã rút quay lại** (`reinstateTransition` bỏ `deleted_at`), nên xóa → khôi phục là phép trả lại trọn vẹn; nhóm đã đổi sang ngày trước đó thì ghi chuyển nhóm mới như cũ.
- **E20 / DR6-03 ca b.** `checkTransition(…, recordedAfter)`: chuyển nhóm cùng ngày cuộc hẹn nhưng **ghi sau lúc xóa** tính như đổi nhóm ngày sau → `TRANSITION_BEFORE_LATEST` nêu ngày. Câu ở Thùng rác giữ nguyên chữ mockup 11a / E6.
- **Hộp khôi phục** (`trash-view.ts`): lịch Đã gặp giữ nhóm hiện "Kết quả: Đã gặp · nhóm sau N3" (trước đây hộp chỉ có "Trạng thái"), hệ quả "Không đổi nhóm KH".
- **Spec Phase 6 §4.2:** TR-3 thêm hai dòng (giữ nhóm / có rút; cùng ngày ghi sau lúc xóa), bảng thêm E18–E20.

#### Test chấp nhận

- [x] E18, E19, E20 ở `trash.test.ts`, lệnh và `listTrash` cùng kết quả; E1–E16 vẫn xanh. E5 nay kiểm thêm: khôi phục đưa lại **đúng** chuyển nhóm đã rút (cùng id); thêm ca E5 khi nhóm đổi sang ngày trước cuộc hẹn sau lúc xóa (ghi chuyển nhóm mới).
- [x] Test thuộc tính `restore-roundtrip.test.ts` trên seed demo (mốc 15/09/2026, seed 1, cỡ nhỏ 1 team × 2 RE × 10 KH để chạy ~5 s): xóa rồi khôi phục từng lịch hẹn / HĐ / KH → `exportBackup` bỏ `updated_at`, `deleted_at` giống hệt trước. Phủ 220 lịch (64 có chuyển nhóm, 101 giữ nhóm rồi KH đổi nhóm sau — đúng ca DR6-01; 46 bị D7 từ chối xóa, bỏ qua), 61 HĐ, 20 KH. Trên code cũ test đỏ với `TRANSITION_BEFORE_LATEST`.
- [x] Dữ liệu tải (`load-data` mặc định 2026-10-12, seed 6, `importBackup`, đồng hồ 12/10/2026), xóa rồi khôi phục ngay từng cuộc gặp Đã gặp sống:

  | | giữ nhóm: khôi phục được | giữ nhóm: bị từ chối | có chuyển nhóm: xóa → khôi phục |
  |---|---|---|---|
  | `main` | 1 564 / 4 254 | **2 690** (2 689 `TRANSITION_BEFORE_LATEST`, 1 `INVALID_TRANSITION`) | 1 041 / 1 041 (2 212 D7 từ chối xóa) |
  | PR này | 4 254 / 4 254 | **0** | 1 041 / 1 041 (2 212 D7 từ chối xóa) |

- [x] e2e `trash.spec.ts`: cuộc gặp 14/09 giữ N3, cuộc gặp 15/09 đưa KH lên N2, xóa cuộc gặp 14/09 → Thùng rác cho khôi phục, hộp ghi "Không đổi nhóm KH"; khôi phục xong lịch 14/09 về "Đã gặp", KH vẫn N2. Trên code cũ test này đỏ (nút Khôi phục tắt).
- [x] `pnpm verify` xanh (111 file, 2 762 test).

#### Ghi chú cho review

- **Ngoài danh sách file của Issue:** `packages/db/src/schema.ts` — chỉ sửa comment của `stage_transitions.deleted_at` ("transitions are never edited" không còn đúng: khôi phục bỏ `deleted_at` của chuyển nhóm đã rút); không đổi schema, không migration. `packages/db/CLAUDE.md` do `pnpm codemap` sinh (export mới `restoreStageMove`, `transitionWithdrawnAt`, `reinstateTransition`; `outcomeStage` thôi export vì không còn ai dùng ngoài file). `apps/desktop/src/i18n/vi.ts` không đổi.
- Test TR-3 "KH đã đóng" dời ngày chuyển tay LOST từ 05/10 (cùng ngày cuộc hẹn, ghi sau lúc xóa — nay là E20) sang 04/10 để vẫn kiểm `INVALID_TRANSITION`.
- **Hash dữ liệu tải đổi** (số dòng không đổi, chỉ mốc thời gian vì lần xóa nay đọc đồng hồ một lần): `tables` sha256 `1e69a97f…` → `a406fe8dec9eb7e75579cf19b675ac5ea9053d39359f203692ca55b3c91c6176`. `docs/metrics/phase-6.md` và kế hoạch 6D giữ hash lượt 1 (dữ liệu lượt 2 sinh lại sau #593 như HANDOFF đã ghi). Hash seed demo (`DEMO_HASH`) không đổi — demo không có Thùng rác.
- Dữ liệu cũ đã xóa bằng code trước PR (hai mốc lệch nhau) sẽ được coi như "giữ nhóm" khi khôi phục; theo quy tắc dữ liệu giả lập (R2-02) không viết tương thích, nạp lại dữ liệu.
- Ghi / sửa / xóa cuộc gặp theo nhóm tại ngày cuộc hẹn (DR6-04, DR6-05) là #593 T-232, không nằm trong PR này.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #615 — docs: describe restoring a met appointment that kept the stage (E18-E20)

Trạng thái: MERGED · merge 2026-10-15T06:47:15Z · commit `b752bc4e0555b33855ea2e17c7c0eebfcc406537` · nhánh `docs/restore-kept-meeting-guide`

PR docs cho thay đổi hành vi khôi phục của PR #614 (T-231, Issue #592; DR6-01, DR6-03). **Merge sau #614**: hai file này mô tả hành vi mà `main` chỉ có sau khi #614 merge.

#### Thay đổi

- `docs/user-guide/09-cai-dat.md` § Khôi phục: tách lịch Đã gặp thành hai ca.
  - Cuộc gặp **đã chuyển nhóm KH** (lúc xóa app hủy chuyển nhóm): hai kết quả như trước.
  - Cuộc gặp **giữ nguyên nhóm** (mới): hộp ghi "Không đổi nhóm KH", lịch về đúng như lúc xóa, kể cả khi nhóm KH đã đổi sau đó (E18, E19).
  - Bảng "Khi không khôi phục được": dòng D10 thêm ca E20 (nhóm đổi chính ngày gặp nhưng sau lúc xóa) và ghi rõ dòng này chỉ gặp với cuộc gặp đã chuyển nhóm.
- `docs/testing/nghiem-thu-v1.md`:
  - Thêm NT-TR-18 (E18), NT-TR-19 (E19), NT-TR-20 (E20).
  - Phạm vi NT-TR ghi E1–E20.
  - Bảng đối chiếu mockup thêm 11c → TR-18, 19 và 11d → TR-20.

Chuỗi trích trong tài liệu lấy từ `vi.ts` và test của #614 (`trash-view.test.ts` E18, e2e `trash.spec.ts`).

Ghi chú từ `REVIEW: PASS` của #614 (mục tài liệu lệch). Chỉ đụng `docs/**`, nên không chạy CI.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #593 — T-232: Ghi, sửa, xóa cuộc gặp theo nhóm của KH tại ngày cuộc hẹn (DR6-04, DR6-05)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

#### Mục tiêu

Luật mới (Owner duyệt 15/10, bản tổng hợp §9 Q2): "nhóm sau" của một cuộc gặp so với **nhóm của KH tại ngày cuộc hẹn**, không với nhóm hiện tại. Sửa dòng `recordMeetingOutcome` của spec Phase 3 §4 theo luật này.

1. Hộp 6c (ghi kết quả) và 6f (sửa kết quả) lấy "nhóm trước" = nhóm tại ngày cuộc hẹn; lựa chọn "giữ nguyên" và dòng đọc lại theo nhóm đó. Khi KH đã có chuyển nhóm vào ngày sau cuộc hẹn, ô "Nhóm sau cuộc gặp" khóa ở nhóm tại ngày đó, kèm dòng giải thích như khóa D7 hiện có của 6f — không còn lựa chọn nào chắc chắn bị D10 từ chối sau khi bấm Lưu, không còn dòng đọc lại báo một chuyển nhóm không có thật (DR6-04).
2. `recordMeetingOutcome` / `editMeetingOutcome`: "nhóm sau" = nhóm tại ngày cuộc hẹn là giữ nhóm (không sinh chuyển nhóm). Dời ngày (6f) một cuộc gặp giữ nhóm thì kiểm lại như ghi mới ở ngày mới (D10).
3. D7 mở rộng: từ chối xóa / sửa kết quả cuộc gặp có chuyển nhóm khi sau nó có một cuộc gặp Đã gặp giữ nhóm ghi "nhóm sau" bằng nhóm mới (câu báo nêu ngày cuộc gặp đó). Chuyển tay (5d) không được lùi ngày qua một cuộc gặp Đã gặp đã ghi (DR6-05).
4. Luật nhập backup cùng luật (`CLAUDE.md` mục Quy tắc Owner, R2-02): cuộc gặp Đã gặp sống không có chuyển nhóm thì "nhóm sau" phải là một nhóm KH có trong ngày cuộc hẹn (trước, giữa hoặc sau các chuyển nhóm cùng ngày). Seed (`fillTrash`) xóa theo luật D7 mới. Dữ liệu cũ: Owner nạp lại (K1), không migration.

#### Bối cảnh

Deep review lượt 1: DR6-04 (H·CL-A2, L·CL-E1, H·CL-E4), DR6-05 (H·CL-F3; dữ liệu tải có đúng 1 ca do `fillTrash`). Cùng gốc với DR6-01 (T-231): spec Phase 3 §4 so "nhóm sau" với nhóm hiện tại. Dùng chung hàm "nhóm tại ngày cuộc hẹn" của T-231 nên làm sau.

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.1 (DR6-04, DR6-05), §8.2 S1-A, §9 Q2
- `docs/design/phase-3-du-lieu.md` §1 (D7, D10), §4 (dòng `recordMeetingOutcome`, `changeStageManually`, `softDelete…`), §6 (luật nhập backup), §7 (seed)
- `docs/design/phase-6-hoan-thien.md` §4.2 (TR-3 sau T-231)
- Mockup `docs/design/mockups/appointment-forms.html` 6c, 6f (dòng khóa D7); `docs/design/mockups/customer-forms.html` 5d
- `packages/domain/src/customer-lifecycle.ts` (`stageOn`)
- `packages/db/src/appointments.ts`, `packages/db/src/customers.ts`, `packages/db/src/backup-validation.ts`, `packages/db/src/seed.ts` (`fillTrash`)
- `apps/desktop/src/routes/appointments/OutcomeDialog.tsx`, `EditOutcomeDialog.tsx`, `MetFields.tsx`, `outcome-form.ts`

#### File / thư mục được phép sửa

- `packages/db/src/{appointments,customers,backup-validation,seed}.ts` và test cạnh chúng
- `apps/desktop/src/routes/appointments/{OutcomeDialog,EditOutcomeDialog,MetFields}.tsx`, `outcome-form.ts` (+ test)
- `apps/desktop/src/routes/customers/CustomerDialogs.tsx` (hộp 5d, nếu cần câu báo)
- `apps/desktop/src/i18n/vi.ts`
- `e2e/appointment-outcome.spec.ts`, `e2e/customer-forms.spec.ts`
- `docs/design/phase-3-du-lieu.md` (§4 dòng `recordMeetingOutcome`, `changeStageManually`; §1 D7)

#### Interface / hợp đồng

- Lệnh từ chối bằng mã có sẵn (`TRANSITION_BEFORE_LATEST`, mã D7 hiện có) hoặc một mã mới có câu i18n; luật nhập backup dùng cùng hàm kiểm với lệnh.

#### Test chấp nhận

- [ ] Lệnh: ca của H·CL-A2 (dời ngày cuộc gặp giữ nhóm qua một chuyển tay) bị từ chối hoặc ghi chuyển nhóm đúng như ghi mới; ca H·CL-E4 (ghi bù lịch 05/09 sau chuyển tay 15/09) chỉ nhận "nhóm sau" = nhóm ngày 05/09 và lưu thành giữ nhóm; ca H·CL-F3 (xóa cuộc gặp có chuyển nhóm khi có cuộc gặp giữ nhóm sau) và chuyển tay lùi ngày qua cuộc gặp đã ghi bị từ chối.
- [ ] `outcome-form` / hộp: "nhóm trước" = nhóm tại ngày cuộc hẹn; khóa khi có chuyển nhóm sau ngày đó (unit test + một ca e2e 6c ghi bù).
- [ ] Nhập backup từ chối file có cuộc gặp giữ nhóm trái nhóm của ngày đó; seed demo và dữ liệu tải qua được; ghi hash `tables` mới của `node tools/load-data.mjs` vào PR.
- [ ] Test thuộc tính của T-231 vẫn xanh.

Ước lượng: ≈ 50–70 dòng SP + ≈ 250 dòng test.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:med

#### Bị chặn bởi

#592

## PR #616 — fix: record, edit and delete a meeting by the stage of its day (T-232)

Trạng thái: MERGED · merge 2026-10-15T07:53:33Z · commit `b56360420c2456450e3d187d1d34dd6e13b8b7e5` · nhánh `task/T-232-stage-on-meeting-day`

Closes #593

#### Tóm tắt

T-232 (#593), DR6-04, DR6-05. Luật mới (Owner duyệt 15/10/2026, tổng hợp deep review lượt 1 §9 Q2): "nhóm sau" của cuộc gặp so với **nhóm của KH tại ngày cuộc hẹn** (cuối ngày đó), không so với nhóm hiện tại.

- **Lệnh** (`appointments.ts`, `customers.ts`):
  - `recordMeetingOutcome` / `editMeetingOutcome`: `stage_after` bằng nhóm của ngày cuộc hẹn (`stageOnDay`, đọc như `stageOn`) thì giữ nhóm. Khác thì ghi transition ở ngày đó, D10 kiểm như cũ. Dời ngày (6f) một cuộc gặp giữ nhóm thì kiểm lại như ghi mới ở ngày mới (DR6-04).
  - D7 mở rộng: rút transition của một cuộc gặp (xóa, sửa kết quả) bị từ chối khi sau nó có cuộc gặp Đã gặp giữ nhóm ghi nhóm mới, mã `STAGE_KEPT_BY_MEETING` kèm ngày cuộc gặp đó (DR6-05).
  - Mọi transition (5d, ghi kết quả, khôi phục) không được mang ngày trước một cuộc gặp Đã gặp đã ghi, mã `TRANSITION_BEFORE_MEETING`. Cùng ngày thì được.
  - Khôi phục cuộc gặp Đã gặp mà không ghi transition chỉ được khi "nhóm sau" vẫn là một nhóm KH có trong ngày đó. Cuộc gặp giữ nhóm mà nhóm của ngày ấy đã đổi lúc nằm trong Thùng rác → `STAGE_NOT_ON_DAY`.
- **G2 / G8 trong phiên (Owner chốt 15/10/2026):** E7 mâu thuẫn với luật nhập backup mới, vì khôi phục sinh ra dữ liệu mà chính app nhập lại không được. Owner chọn **thu hẹp E7, chặn như E6**: KH tới nhóm sau ngay trong ngày cuộc hẹn → khôi phục, không thêm chuyển nhóm. Tới vào ngày sau → `TRANSITION_BEFORE_LATEST` ("Nhóm KH đã đổi ngày …, sau ngày cuộc hẹn này (D10)"). Đã sửa spec Phase 6 TR-3 + E7, cùng NT-TR-09 và hướng dẫn 09 cho khớp.
- **Nhập backup** (`backup-validation.ts`, luật 4): cuộc gặp Đã gặp sống không có transition thì "nhóm sau" phải là nhóm đầu ngày hoặc nhóm sau một transition cùng ngày (`isStageOfDay`, cùng hàm lệnh dùng). Dữ liệu cũ: nạp lại (K1), không migration.
- **Seed:** `fillTrash` chọn bản ghi xóa theo luật D7 mới.
- **UI 6c / 6f** (`outcome-form.ts` `meetingDay`, `heldStage`, `outcomeLock`):
  - "Nhóm trước" = nhóm của ngày cuộc hẹn. Đã có chuyển nhóm hoặc cuộc gặp Đã gặp sau ngày đó thì ô "Nhóm sau cuộc gặp" khóa ở nhóm ấy, kèm dòng giải thích và link Chuyển nhóm tay (`DayLockNote`).
  - Khóa D7 của 6f thêm trường hợp `keptBy`.
  - Cuộc gặp giữ nhóm sửa ở chính ngày của nó thì đi từ nhóm đã giữ, nên ca E19 không hiện một chuyển nhóm không có thật.
- **Spec Phase 3:** cập nhật D7, §4 (`changeStageManually`, `recordMeetingOutcome`, `softDelete…`), §6 luật 4.

##### Ngoài danh sách file của Issue (cần cho đúng luật)

- `packages/db/src/errors.ts`: 3 mã mới, Issue cho phép "một mã mới có câu i18n".
- `packages/db/src/index.ts`: export `isStageOfDay` (UI dùng).
- `packages/db/CLAUDE.md`: codemap sinh lại.
- `trash.test.ts`, `restore-roundtrip.test.ts`, `seed.test.ts`:
  - E7 mới.
  - Tập mã D7 của test thuộc tính T-231 thêm `STAGE_KEPT_BY_MEETING`.
  - Pin `DEMO_HASH` đổi vì đồng hồ của seed tăng mỗi lần đọc: `checkTransition` đọc `today` thêm một lần để bỏ truy vấn khi ngày ≥ hôm nay (cuộc gặp Đã gặp không sau hôm nay). Trước khi thêm phép kiểm này, verify vẫn ra đúng hash cũ, tức luật mới không đổi dữ liệu demo; số hàng không đổi.
- `docs/design/phase-6-hoan-thien.md`, `docs/testing/nghiem-thu-v1.md`, `docs/user-guide/09-cai-dat.md`: theo quyết định E7.

#### Test chấp nhận

- [x] Lệnh:
  - H·CL-A2: dời cuộc gặp giữ nhóm qua chuyển tay thì ghi chuyển nhóm như ghi mới; dời về trước chuyển nhóm thì bị từ chối.
  - H·CL-E4: ghi bù lịch 05 sau chuyển tay 15 chỉ nhận nhóm của ngày 05 và lưu thành giữ nhóm.
  - H·CL-F3: xóa / sửa cuộc gặp có chuyển nhóm khi có cuộc gặp giữ nhóm sau → `STAGE_KEPT_BY_MEETING`.
  - Chuyển tay lùi ngày qua cuộc gặp đã ghi → `TRANSITION_BEFORE_MEETING` (`appointments.test.ts` "the stage on the meeting day").
- [x] `outcome-form`: `meetingDay` / `heldStage` / `outcomeLock` (unit). E2E 6c ghi bù: "a meeting recorded late keeps the stage of its day once the customer moved on".
- [x] Nhập backup từ chối cuộc gặp giữ nhóm trái nhóm của ngày đó, và nhận ca E19 (`backup-invariants.test.ts`). Seed demo nhập được (it.each 2, 11, 42). Dữ liệu tải nhập được (thử `importBackup` trên file vừa sinh); file dữ liệu tải của `main` giờ bị từ chối ở luật 4, đúng như dự kiến (K1).
- [x] Test thuộc tính của T-231 (`restore-roundtrip.test.ts`) xanh, `changed: []`.

**Dữ liệu tải** (`node tools/load-data.mjs`, mặc định anchor 2026-10-12, seed 6): `tables sha256 5568effd6fc4a6e89aa77c239d2d5c03f3df63caf09fcfddd4a32994ae281897` (trên `main`: `a406fe8d…`). Số hàng mọi bảng không đổi. Thời gian sinh: 7,9 s (trên `main` 6,5 s).

#### Kiểm

- `pnpm verify` xanh (111 file, 2778 test).
- `pnpm e2e` toàn bộ xanh trên máy, kể cả seed-timing < 5 s.

risk:med → Owner bảo merge (`--owner`).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #594 — T-233: Bàn giao KH chuyển cả lịch Dự kiến sang RE mới (DR6-02)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

#### Mục tiêu

Bàn giao KH (hộp 5c, đổi "RE phụ trách") không còn để lịch tương lai ở RE cũ (Owner duyệt 15/10, bản tổng hợp §9 Q3 phương án (a)):

1. `updateCustomerProfile` đổi RE thì trong cùng transaction chuyển mọi lịch **Dự kiến** (chưa có kết quả, ngày từ hôm nay trở đi, chưa xóa) của KH sang RE mới. Lịch đã có kết quả, lịch "Chưa ghi kết quả" (ngày đã qua) và HĐ giữ RE cũ (ADR-0007: RF tính cho RE ghi trên cuộc hẹn).
2. Hộp 5c nói trước việc này khi đổi RE (vd. "n lịch dự kiến chuyển sang RE mới"); câu `customerForm.reHelp` hiện "lịch hẹn và HĐ cũ vẫn tính cho RE đã ghi" sửa cho khớp nghĩa thường.
3. "Hẹn lần tiếp theo" của hộp 6c (`recordOutcomeWithNext`) tạo lịch mới cho **RE hiện tại của KH**; "Hẹn tiếp" (6h) điền sẵn RE hiện tại của KH (ô vẫn sửa được).
4. Spec Phase 3 §4 dòng `updateCustomerProfile` ghi luật này (G2, Owner đã duyệt).

#### Bối cảnh

Deep review lượt 1: DR6-02 **Medium** (L·CL-D7). Phiên tổng hợp chạy lại: sau khi đổi RE A → B, cuộc gặp 12/10 ghi kết quả và lịch hẹn tiếp 20/10 đều mang RE A, RF tính cho A. Không lệnh nào đổi được RE của một lịch nên lệch tích dần ở Tổng quan / Báo cáo / Excel theo RE và team. NT-KH-09 chỉ kiểm lịch Đã gặp / HĐ cũ. Bắt đầu sau khi PR #591 merge.

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §4.2 (DR6-02), §8.2 S1-B, §9 Q3
- `docs/design/phase-3-du-lieu.md` §4 (dòng `updateCustomerProfile`, `recordMeetingOutcome`), §6 luật 5
- `docs/decisions/0007-dinh-nghia-chi-so-va-vong-doi.md` (RE của chỉ số)
- `docs/design/phase-4-chi-so.md` §1 mục 6 (góc nhìn theo RE hiện tại)
- Mockup `docs/design/mockups/customer-forms.html` 5c; `docs/design/mockups/appointment-forms.html` 6c ("Hẹn lần tiếp theo"), 6h
- `docs/testing/nghiem-thu-v1.md` NT-KH-09
- `packages/db/src/customers.ts` (`updateCustomerProfile`), `packages/db/src/appointments.ts` (`recordOutcomeWithNext`, `insertScheduled`)
- `apps/desktop/src/routes/customers/CustomerDialogs.tsx` (hộp 5c), `apps/desktop/src/routes/appointments/AppointmentDialog.tsx` (`from.reId`)

#### File / thư mục được phép sửa

- `packages/db/src/customers.ts`, `packages/db/src/appointments.ts` và test cạnh chúng
- `apps/desktop/src/routes/customers/CustomerDialogs.tsx`, `apps/desktop/src/routes/appointments/AppointmentDialog.tsx`, `apps/desktop/src/routes/customers/customers-view.ts` (nếu cần hàm đếm) (+ test)
- `apps/desktop/src/i18n/vi.ts`
- `e2e/customer-forms.spec.ts`, `e2e/appointments.spec.ts`
- `docs/design/phase-3-du-lieu.md` (§4)

#### Interface / hợp đồng

- `previewCustomerProfile` (hoặc một hàm đọc riêng) trả số lịch Dự kiến sẽ chuyển, để hộp 5c hiện trước khi lưu.

#### Test chấp nhận

- [ ] Lệnh: KH của RE A có lịch Dự kiến hôm nay và tuần sau, một lịch Chưa ghi kết quả, một cuộc gặp Đã gặp, một HĐ; đổi RE sang B → hai lịch Dự kiến sang B, ba bản ghi còn lại giữ A.
- [ ] `recordOutcomeWithNext` sau bàn giao → lịch mới mang RE B; RF của cuộc gặp ghi sau bàn giao tính cho B trong `periodMetricsByScope` (RE B), không cho A.
- [ ] Hộp 5c hiện số lịch sẽ chuyển; hộp 6h điền sẵn RE hiện tại của KH.
- [ ] Luật nhập backup 5 (RE của lịch chưa xóa là RE chưa xóa) vẫn giữ; e2e NT-KH-09 mở rộng với lịch Dự kiến.

Ước lượng: ≈ 40 dòng SP + ≈ 150 dòng test.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:med

#### Bị chặn bởi

Không (bắt đầu sau khi PR #591 merge)

## PR #618 — fix: hand a customer's planned appointments over to the new RE (T-233)

Trạng thái: MERGED · merge 2026-10-15T11:33:41Z · commit `5d2443f78fbf30aca907404bd03cf557ab4c5909` · nhánh `task/T-233-handover-planned-appointments`

Closes #594

#### Tóm tắt

T-233 (#594), DR6-02 (Medium). Luật bàn giao KH, Owner duyệt 15/10/2026 (tổng hợp deep review lượt 1 §9 Q3, phương án (a)).

- **Lệnh** (`customers.ts`, `appointments.ts`):
  - `updateCustomerProfile` đổi RE → trong cùng transaction, mọi lịch **Dự kiến** chưa xóa của KH (`SCHEDULED`, ngày từ hôm nay — Phase 4 §1) chuyển sang RE mới. Lịch đã có kết quả (cả Hủy ở tương lai), lịch Chưa ghi kết quả (đã qua), lịch đã xóa và HĐ giữ RE đã ghi (ADR-0007). Lưu hồ sơ mà không đổi RE thì không đụng lịch nào, kể cả lịch Dự kiến cố ý đặt cho RE khác.
  - `previewHandover(db, customerId, reId)` (hợp đồng "Interface" của Issue): số lịch Dự kiến sẽ chuyển sang `reId`; 0 khi KH đã thuộc RE đó. Dùng chung điều kiện với lệnh (`plannedOff`).
  - `recordOutcomeWithNext` (6c, 6i): lịch mới mang **RE hiện tại của KH** thay vì RE của lịch vừa ghi.
- **UI:**
  - Hộp 5c: câu `customerForm.reHelp` mới "Đổi RE: lịch hẹn Dự kiến chuyển sang RE mới; lịch hẹn khác và HĐ vẫn tính cho RE đã ghi trên từng bản ghi."; chọn RE khác mà có lịch sẽ chuyển → khung `role="status"` "Khi lưu: n lịch hẹn Dự kiến chuyển sang RE mới." (cùng kiểu khung "Khi lưu, app tự ghi vào KYC").
  - Hộp 6h (`AppointmentDialog`): điền sẵn RE hiện tại của KH, ô vẫn sửa được.
  - 6c / 6i: câu `outcome.nextHelp` "cùng KH, RE, …" → "cùng KH, người phối hợp, trigger, RE phụ trách KH" cho khớp nghĩa thường.
- **Spec Phase 3 §4** dòng `updateCustomerProfile` ghi luật (G2 đã duyệt). Thêm một câu mô tả hành vi sẵn có: dời lịch (6e) giữ RE của lịch cũ, đúng chữ "cùng RE" của mockup 6e.

##### Lệch mockup (G3)

- 5c: câu help đổi, thêm khung "Khi lưu: n lịch hẹn Dự kiến chuyển sang RE mới." (mockup 5c chưa có); Issue mục 2 yêu cầu.
- 6c / 6i: chữ phụ của "Hẹn lần tiếp theo" đổi như trên.

##### Ngoài danh sách file của Issue

- `packages/db/src/index.ts`: export `previewHandover` (UI dùng). `packages/db/CLAUDE.md`: codemap sinh lại.
- `docs/testing/nghiem-thu-v1.md` (NT-KH-09 trích nguyên câu 5c cũ, mở rộng với lịch Dự kiến + 6h; NT-LH-26), `docs/user-guide/04-khach-hang.md`, `docs/user-guide/03-lich-hen.md`: **Owner quyết trong phiên (15/10/2026) sửa luôn trong PR này** để tài liệu khớp code lúc merge.

##### Ghi chú

- Lịch Dự kiến đã xóa giữ RE cũ (Issue: "chưa xóa"); khôi phục từ Thùng rác trả về đúng như lúc xóa (TR-3), test ghi lại hành vi này.
- Dời lịch (6e) một lịch Chưa ghi kết quả của RE cũ sau bàn giao vẫn tạo lịch mới cho RE cũ ("cùng RE" của mockup 6e, Issue không đổi 6e).

#### Test chấp nhận

- [x] Lệnh: KH của RE A có lịch Dự kiến hôm nay và tuần sau, một lịch Chưa ghi kết quả, một Đã gặp, một Hủy ở tương lai, một lịch Dự kiến đã xóa, một HĐ; đổi RE sang B → hai lịch Dự kiến sang B, còn lại giữ A (`customers.test.ts` "hands the planned appointments over to a new RE, and nothing else (5c)"). Thêm "hands over only when the RE changes, and saves nothing when refused".
- [x] `recordOutcomeWithNext` sau bàn giao → lịch mới mang RE B (cả khi ghi lịch Chưa ghi kết quả còn ở A); RF của cuộc gặp ghi sau bàn giao tính cho B trong `periodMetricsByScope`, A = 0 (`appointments.test.ts` "books the next appointment for the RE now in charge of the customer").
- [x] Hộp 5c hiện số lịch sẽ chuyển; hộp 6h điền sẵn RE hiện tại của KH; NT-KH-09 mở rộng với lịch Dự kiến (`e2e/customer-forms.spec.ts` "changing the RE hands the planned appointments over, not the past ones (5c, 6h)": danh sách Lịch hẹn ngày 20/09 → RE mới, 14/09 → RE cũ).
- [x] Luật nhập backup 5 vẫn giữ: sau bàn giao `importBackup(exportBackup(db))` nhận file.

#### Kiểm

- `pnpm verify` xanh.
- `pnpm e2e` toàn bộ xanh trên máy (213 test).
- Bản web: hộp 5c của một KH có lịch Dự kiến, chọn RE khác → câu help mới và "Khi lưu: 1 lịch hẹn Dự kiến chuyển sang RE mới.", không lỗi console.
- Seed demo không đổi (pin `DEMO_HASH` vẫn xanh).

risk:med → Owner bảo merge (`--owner`).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #595 — T-234: Lớp file: chặn DB hỏng, câu lỗi khởi động / lưu đúng nguyên nhân, `openFrom` (DR6-06…09)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

#### Mục tiêu

1. **DB hỏng (DR6-06):** lúc mở app, sau khi đọc file và **trước** khi chép bản backup lúc khởi động, chạy `PRAGMA quick_check`; kết quả khác `ok` → không backup, không lưu, màn khởi động báo "file dữ liệu hỏng" như file không mở được (câu hướng dẫn chép bản liền trước hiện có). Lời hứa DR-51 "file hỏng bên trong không bao giờ thành backup mới nhất" thành đúng.
2. **Câu lỗi đúng nguyên nhân (DR6-07):** Rust trả mã riêng cho file DB đang bị chương trình khác giữ (os error 32 / 33), thư mục dữ liệu không ghi được (quyền, os error 5) và `project2c.db.tmp` không xóa được, như `ALREADY_OPEN` / `DISK_FULL`; màn khởi động có câu riêng ("File không hỏng, không cần khôi phục: đóng chương trình đang mở file / kiểm quyền thư mục rồi mở lại app") thay cho câu hướng dẫn chép backup. `save()` ánh xạ đĩa đầy thành `DISK_FULL` như `backup()`; dải lỗi lưu có câu riêng cho đĩa đầy.
3. **`openFrom` (DR6-08):** lưu `db.export()` của DB vừa mở (đã migrate), không lưu lại bytes đầu vào sau bản migrate; test kiểm schema của **bản lưu cuối** bằng sql.js không migrate, dùng một file cũ thật có dữ liệu.
4. **`.tmp` sót (DR6-09, KNOWN #87):** lần mở đầu của tiến trình xóa `backups\project2c-s*.db.tmp` (cùng chỗ dọn `exports\`); `temp_dir()` của test Rust tự xóa thư mục khi xong.
5. Test giữ luật (phần B của DR6-60): tên xuất bắt đầu bằng "." (`..p2cbackup`, `.a.xlsx`) bị từ chối; `find_copy` không dùng lại backup dài hơn có cùng phần đầu; bước `sync_all` có ca kiểm (lỗi flush → báo lỗi, giữ file cũ, không rename).

#### Bối cảnh

Deep review lượt 1: DR6-06 (L·CL-B1), DR6-07 (L·CL-B6, H·CL-B1, H·MU-B2), DR6-08 (L·CL-B2, L·CX-B2, H·CX-B1), DR6-09 (H·CL-B5), DR6-60 phần Rust (L·CL-B3, H·CL-B2, H·CX-B2). Spec Phase 6 §5 mục 4: file DB hỏng / không ghi được → báo lỗi rõ, không mất bản đã lưu. `quick_check` trên dữ liệu tải ≈ 79 ms; `app.open-data` 273 ms, ngưỡng 600 ms.

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.2 (DR6-06…09), §5.8 (DR6-60), §8.3 S2-C
- `docs/design/phase-6-hoan-thien.md` §4.1, §5 (mục 4)
- `docs/decisions/0016-luu-tru-sqljs-ghi-file-qua-rust.md` (lưu file); `docs/design/phase-3-du-lieu.md` §5
- `apps/desktop/src-tauri/src/storage.rs` (`open`, `save`, `backup`, `disk_full`, `write_atomic`, `is_export_name`, `has_same_bytes`, test)
- `apps/desktop/src/data/app-data.ts` (`openAppData`, `openFrom`), `apps/desktop/src/data/app-data.test.ts`
- `apps/desktop/src/shell/startup-error.ts`, `apps/desktop/src/shell/SaveWarning.tsx`
- `docs/state/review-notes.md` mục #87

#### File / thư mục được phép sửa

- `apps/desktop/src-tauri/src/storage.rs`, `apps/desktop/src-tauri/src/lib.rs` (nếu cần mã lỗi)
- `apps/desktop/src/data/app-data.ts`, `apps/desktop/src/data/tauri-storage.ts` và test cạnh chúng
- `apps/desktop/src/shell/startup-error.ts`, `apps/desktop/src/shell/SaveWarning.tsx` và test
- `apps/desktop/src/i18n/vi.ts`
- `packages/db/src/database.ts` (nếu đặt hàm `quick_check` ở đây) và test

#### Interface / hợp đồng

- Hằng mã lỗi mới của Rust (kiểu `ALREADY_OPEN`) có tên ở `tauri-contract.test.ts` như các mã hiện có.

#### Test chấp nhận

- [ ] `app-data.test.ts`: file có một trang b-tree hỏng (dựng từ DB thật, ghi đè một trang) → khởi động lỗi, không gọi `backup`, không `save`.
- [ ] Test Rust: file giữ `share_mode(0)` → mã "file đang bị giữ"; `startup-error.test.ts` có câu riêng, không còn câu chép backup cho ca này; `save` khi đĩa đầy (lỗi `StorageFull` giả) → `DISK_FULL`.
- [ ] `openFrom` với file schema cũ có dữ liệu → bản lưu cuối có `schemaVersion() === LATEST_SCHEMA_VERSION`.
- [ ] `backups\*.db.tmp` sót bị xóa ở lần mở đầu; `cargo test` không còn để thư mục trong `%TEMP%`.
- [ ] Ba ca test luật của mục 5 đỏ khi bỏ luật tương ứng (ghi lệnh đột biến đã thử trong PR).

Ước lượng: ≈ 60 dòng SP (Rust + TS) + ≈ 200 dòng test.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` + `pnpm verify:rust` xanh
- [ ] CI xanh (PR gắn nhãn `build-exe` lúc tạo)
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:med

#### Bị chặn bởi

Không (bắt đầu sau khi PR #591 merge)

## PR #620 — fix: refuse a damaged database, tell why the file is out of reach, save the migrated import (T-234)

Trạng thái: MERGED · merge 2026-10-15T12:49:43Z · commit `9acef55723085b2473d701cbdf585f6be2451516` · nhánh `task/T-234-file-layer-errors`

Closes #595 (T-234 — DR6-06…09, phần B của DR6-60).

#### Thay đổi

- **DB hỏng (DR6-06).** `Database.quickCheck()` (`packages/db/src/database.ts`) chạy `PRAGMA quick_check`, trả các chỗ hỏng (rỗng khi `ok`); hỏng nặng làm chính lệnh kiểm ném lỗi ("database disk image is malformed", ≈ một nửa số trang thử) cũng thành một dòng. `openAppData` gọi nó sau khi mở file, **trước** `storage.backup()`: có chỗ hỏng → lỗi `DATA_DAMAGED` (`isDamagedDataError`, `cause` = chỗ hỏng đầu tiên), không backup, không lưu (lần lưu của migration vẫn chờ `backedUp`). Màn khởi động: tiêu đề mới "File dữ liệu bị hỏng" + câu hướng dẫn chép bản liền trước sẵn có + "Chi tiết kỹ thuật". Lời hứa DR-51 thành đúng cả với file hỏng mà vẫn mở được.
- **Câu lỗi đúng nguyên nhân (DR6-07).** `storage::open` qua `out_of_reach`: os error 32 / 33 (file DB hoặc `project2c.db.tmp` bị chương trình khác giữ) → `FILE_IN_USE`; `PermissionDenied` (thư mục / file khóa không ghi được, os error 5) → `ACCESS_DENIED`; lỗi khác giữ nguyên (thiếu file, không phải SQLite… vẫn ra câu khôi phục). `ALREADY_OPEN` không đổi. Màn khởi động có hai câu riêng, mở đầu "File dữ liệu không hỏng, không cần khôi phục", không còn câu chép backup. `save()` ánh xạ đĩa đầy thành `DISK_FULL` như `backup()`; `AppData.saveError()` / `subscribeSaveError` giữ lý do lần lưu lỗi (đổi theo cả khi lỗi khác nối tiếp, xóa khi lưu được), dải lỗi lưu có câu riêng cho đĩa đầy (`SaveFailed`).
- **`openFrom` (DR6-08).** Lưu `db.export()` của DB vừa mở (đã migrate), không lưu lại bytes đầu vào.
- **`.tmp` sót (DR6-09, KNOWN #87).** Lần mở đầu của tiến trình xóa `backups\project2c-s*.db.tmp` (chỉ tên mà bỏ `.tmp` là tên backup, chỉ file), cùng chỗ dọn `exports\`. `temp_dir()` của test Rust trả `TempDir` tự xóa khi `Drop` (cả khi test đỏ).
- **Test giữ luật (DR6-60 phần B).** Tên xuất `..p2cbackup`, `.a.xlsx` bị từ chối; backup dài hơn có cùng phần đầu không được dùng lại; bước flush qua seam `save_with` / `write_atomic_with` (như `post` / `post_with` của `ai.rs`): flush lỗi → báo lỗi, giữ file cũ, không `.tmp`; flush chạy trên file mới đủ khi file cũ còn nguyên.

#### Test chấp nhận

- [x] `app-data.test.ts` "refuses a file damaged inside that still opens": DB thật 100 team, ghi đè một trang gần cuối → `isDamagedDataError`, `events` rỗng (không `backup`, không `save`). `database.test.ts`: ghi đè **từng** trang (trừ trang 1) của một DB thật — mọi file còn mở được đều có chỗ hỏng, có ca lệnh kiểm tự ném lỗi; DB nguyên → `[]`.
- [x] Test Rust (Windows): `project2c.db` giữ `share_mode(0)` → `FILE_IN_USE`, thả ra → mở được; `project2c.db.tmp` bị giữ → `FILE_IN_USE`; `project2c.lock` chỉ đọc → `ACCESS_DENIED`; `out_of_reach` với os error 32, 33, `PermissionDenied`, và các lỗi giữ nguyên. `startup-error.test.ts` có câu riêng cho hai mã, không chứa "chép bản mới nhất". `save` khi flush trả `StorageFull` giả → `DISK_FULL`, file cũ còn. `tauri-contract.test.ts` kiểm hai hằng mới với `storage.rs`.
- [x] `openFrom` với file schema v0 có dữ liệu (bảng `notes`) qua `importBackup`: bản lưu cuối có schema **9** (`LATEST_SCHEMA_VERSION`, đọc bằng `openDatabase({ migrations: [] })` — không migrate, lỗi `SCHEMA_TOO_NEW` nêu version), dữ liệu còn. Trên code cũ: 0.
- [x] `backups\*.db.tmp` sót bị xóa ở lần mở đầu (thư mục trùng tên, `notes.tmp`, `project2c-notes.db.tmp` giữ nguyên). `cargo test` không để thư mục `%TEMP%\p2c-storage-*` (2 889 trước / 2 889 sau một lần chạy).
- [x] Đột biến (script tạm ngoài repo, mỗi lần sửa một chỗ, chạy test, trả file về từng byte; `git diff --stat` trước / sau như nhau) — **14 / 14 bị giết**:

  | Đột biến | Test đỏ |
  |---|---|
  | bỏ `&& !name.starts_with('.')` (`is_export_name`) | `write_export_writes_into_exports_and_rejects_unsafe_names`, `write_export_takes_a_report_and_suffixes_it_before_xlsx` |
  | bỏ so độ dài trong `has_same_bytes` | `backup_of_a_file_a_longer_backup_starts_with_writes_a_copy` |
  | bỏ `flush(&file)?` (`sync_all`) | `a_save_flushes_the_written_file_to_the_disk_before_it_replaces_the_old_one`, `a_save_that_finds_the_disk_full_is_reported_as_disk_full` |
  | bỏ `.map_err(disk_full)` ở `save_with` | `a_save_that_finds_the_disk_full_is_reported_as_disk_full` |
  | bỏ `out_of_reach` ở `fs::read` / `remove_if_exists` / `open_lock_file` | `open_reports_a_database_file_another_program_holds_as_in_use` / `open_reports_a_db_tmp_another_program_holds_as_in_use` / `open_reports_a_data_folder_it_may_not_write_as_access_denied` |
  | bỏ `remove_interrupted_backups` | `open_removes_the_tmp_of_a_backup_cut_short_and_keeps_everything_else` |
  | bỏ chặn `quick_check` ở `openAppData` | "refuses a file damaged inside that still opens" |
  | `openFrom` lưu lại `bytes` | "saves the migration of the new data while it opens…" |
  | không xóa `saveError` khi lưu được / chỉ báo lỗi đầu | "keeps why the last save failed until a save succeeds…" |
  | `quickCheck` ném lại lỗi / coi `ok` là hỏng | hai ca `quickCheck` |

- [x] **Thử trên exe release** (`pnpm build:exe`, exe chép ra thư mục riêng trong scratchpad, đọc màn khởi động qua cổng debug WebView2 bằng script Playwright tạm, không commit): lần đầu → app mở, lưu dữ liệu giả lập; lần hai → mở, 1 backup. `project2c.db` bị PowerShell giữ (`FileShare None`) → "File dữ liệu đang bị chương trình khác giữ" + câu riêng. Ghi đè một trang gần cuối → "File dữ liệu bị hỏng" + câu chép bản liền trước + "Chi tiết kỹ thuật: *** in database main *** Tree 13 page 2338: btreeInitPage() returns error code 11"; `backups\` không đổi, file không bị ghi. `project2c.lock` chỉ đọc → "App không có quyền ghi vào thư mục dữ liệu". Trả file lại → mở bình thường. (Đĩa đầy không dựng được trên exe: chỉ có test Rust với lỗi giả.)
- [x] `pnpm verify` xanh (112 file, 2 794 test); `pnpm verify:rust` xanh (fmt, clippy `-D warnings`, 101 test).

#### Ghi chú cho review

- **Chi phí `quick_check`:** ≈ 79 ms trung vị trên dữ liệu tải (đo của deep review lượt 1); `app.open-data` 273 ms → ≈ 350 ms, ngưỡng 600 ms. Chỉ chạy ở lần mở có file (exe), không chạy ở Nạp lại / Nhập (bytes do app dựng).
- **`ACCESS_DENIED` gom mọi `PermissionDenied` của `open`** (tạo thư mục, file khóa, xóa `.tmp`, đọc file DB). Ca hiếm "một **thư mục** tên `project2c.db`" cũng ra câu này thay vì câu khôi phục — chấp nhận vì không ai dựng được bằng app.
- **`saveError` nằm ở `AppData`**, không ở `PersistQueue`: `persist-queue.ts` ngoài danh sách file của Issue; hàng đợi chỉ báo khi `failed()` lật, nên lý do đổi giữa hai lần lỗi đi qua `subscribeSaveError` riêng.
- Hộp "Chưa lưu được thay đổi" khi đóng app (`close.unsavedBody`) vẫn nói "file có thể đang bị chương trình khác mở" cả khi đĩa đầy — ngoài phạm vi Issue (chỉ nêu dải lỗi lưu).
- Tài liệu người dùng (`docs/user-guide/10-su-co.md`, `docs/testing/nghiem-thu-v1.md`) chưa có ba câu khởi động mới và câu đĩa đầy khi lưu — ngoài danh sách file; đề xuất PR docs sau khi PR này merge.
- Sửa ngoài danh sách file của Issue: không có (`SaveWarning.test.tsx` mới là "test cạnh" `SaveWarning.tsx`).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #621 — docs: describe the damaged, held and read-only file errors and the full-disk save warning (T-234)

Trạng thái: MERGED · merge 2026-10-15T12:59:11Z · commit `04461804971221e0a3d150672184ac167b20e577` · nhánh `docs/file-layer-errors-guide`

PR docs cho các câu lỗi mới của PR #620 (T-234, Issue #595; DR6-06, DR6-07). #620 đã merge (`9acef55`). Đã đối chiếu lại từng câu trích với `vi.ts` trên `main` (`3f44c9e`): khớp hết; ghi chú không chặn của review #620 (#622) không làm câu nào sai.

#### Thay đổi

- `docs/user-guide/10-su-co.md` § Lỗi lúc mở app:
  - Câu mở đầu: app đọc file, kiểm tra không hỏng, rồi mới sao lưu (trước ghi "sao lưu rồi mới đọc", không đúng từ trước và trái với DR-51 / DR6-06).
  - Bảng thêm ba dòng: **File dữ liệu đang bị chương trình khác giữ** và **App không có quyền ghi vào thư mục dữ liệu** (file không hỏng: đóng chương trình / sửa quyền rồi mở lại, **không** chép backup đè), **File dữ liệu bị hỏng** (hỏng bên trong nhưng mở được: Mở lại từ backup, vẫn lỗi thì chép bản liền trước; `backups\` không nhận file hỏng).
  - Dòng **Không mở được file dữ liệu**: nguyên nhân còn lại là file rỗng / hỏng tới mức không mở được, không phải file của app, hoặc bị mất khi `backups\` còn bản sao.
  - § Mở lại từ backup: bỏ câu "app chép file vào `backups\` mỗi lần mở" (nay chỉ chép file đã đọc được và kiểm tra không hỏng).
- `docs/user-guide/01-bat-dau.md` § Khi app chưa lưu được: trích câu dải lỗi khi ổ đầy (`storage.saveDiskFull`); hộp đóng app ghi thêm "ổ đầy thì xóa bớt file".
- `docs/testing/nghiem-thu-v1.md` § `NT-DB`:
  - NT-DB-16 (ổ đầy): trích câu dải lỗi mới.
  - Thêm NT-DB-17 (file bị PowerShell giữ `'Open','Read','None'` lúc mở → "đang bị chương trình khác giữ", đóng giữ rồi mở lại được), NT-DB-18 (`attrib +R project2c.lock` → "không có quyền ghi"), NT-DB-19 (ghi đè trang áp chót bằng `FF`, không đụng 100 byte đầu → "File dữ liệu bị hỏng", hash không đổi, `backups\` không thêm bản). Cách ghi đè như test `app-data.test.ts` của #620.
  - Đối chiếu mockup `settings-data.html` 10d thêm DB-17–19.

Câu trích lấy từ `apps/desktop/src/i18n/vi.ts` ở head `caefe3e` của #620 (`storage.damaged`, `storage.fileInUse*`, `storage.accessDenied*`, `storage.saveDiskFull`; trang "bị hỏng" dùng lại `storage.openFailedHelp` theo `startup-error.ts`), đã kiểm bằng script: mọi câu trong ngoặc kép / in đậm / trích dẫn có trong `vi.ts`. Mã lỗi theo `storage.rs` (`out_of_reach`: os error 32/33 → `FILE_IN_USE`, `PermissionDenied` → `ACCESS_DENIED`).

Chỉ đụng `docs/**`, nên không chạy CI.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #596 — T-235: Rust AI và cấu hình phát hành: key hai lớp, tên model, phiên bản 1.0.0, crate-type, quyền webview (DR6-10…14)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

#### Mục tiêu

1. **Key hai lớp (DR6-10):** nhận diện key trong trả lời / thông điệp lỗi của server giải escape tới hai lượt có giới hạn (JSON → `%XX`, `%XX` → JSON), để key URL-encode rồi JSON-escape `%` (`%…`) cũng bị chặn ở `reply` và che ở `mask`; không chặn nhầm backslash JSON hợp lệ.
2. **Tên model (DR6-11):** `check()` giới hạn `model` (≤ 128 ký tự, chỉ ký tự có trong tên model thật) như các trường khác → `AI_BAD_REQUEST`.
3. **Phiên bản 1.0.0 (DR6-12, Owner chọn 15/10 §9 Q12):** `tauri.conf.json`, `Cargo.toml` (User-Agent `Project-2C/1.0.0`), `apps/desktop/package.json`.
4. **`crate-type` (DR6-13):** chỉ `rlib` (exe chỉ link `rlib`); bớt ≈ 11,5 s mỗi build release và ≈ 187 MB `target`.
5. **Quyền webview (DR6-14):** thay `core:default` bằng đúng quyền app dùng (lắng nghe sự kiện đóng cửa sổ, `destroy`); CSP thêm `base-uri 'none'; form-action 'none'`. Kiểm tay trên exe: đóng cửa sổ (CloseGuard), Nhập / Xuất, AI Mock.
6. Test giữ luật (phần A14 của DR6-60): `complete` với `Busy` đang giữ và đối số sai → `AI_BAD_REQUEST`, cờ bận vẫn của yêu cầu đang chạy.

#### Bối cảnh

Deep review lượt 1: DR6-10 (L·CX-B1), DR6-11 (H·MU-B1), DR6-12, DR6-13 (L·CL-B4, B5), DR6-14 (H·CL-B3), DR6-60 phần A14 (H·CL-B2). ADR-0009 D-1 (key không sang webview), K8. Không có đường khai thác hiện tại cho mục 1, 2, 5 (cần server bất thường / webview bị chiếm); làm vì rẻ và đằng nào PR này cũng build exe.

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.2 (DR6-10…14), §8.3 S2-D
- `docs/decisions/0009-ai-copilot-provider-va-guardrail.md` phụ lục D-1, W-1 mục 7
- `apps/desktop/src-tauri/src/ai.rs` (`check`, `reply`, `reveals`, `mask`, `unescape`, test key / escape)
- `apps/desktop/src-tauri/Cargo.toml`, `apps/desktop/src-tauri/tauri.conf.json`, `apps/desktop/src-tauri/capabilities/default.json`, `apps/desktop/package.json`
- `apps/desktop/src/main.tsx` (API Tauri webview dùng)
- `apps/desktop/src/data/tauri-contract.test.ts`

#### File / thư mục được phép sửa

- `apps/desktop/src-tauri/src/ai.rs`
- `apps/desktop/src-tauri/Cargo.toml`, `apps/desktop/src-tauri/Cargo.lock` (nếu đổi phiên bản), `apps/desktop/src-tauri/tauri.conf.json`, `apps/desktop/src-tauri/capabilities/default.json`, `apps/desktop/src-tauri/gen/schemas/**` (sinh tự động)
- `apps/desktop/package.json`
- `apps/desktop/src/data/tauri-contract.test.ts`

#### Interface / hợp đồng

- Không đổi lệnh Tauri hay mã lỗi; chỉ thêm ca bị từ chối.

#### Test chấp nhận

- [ ] Test Rust: key giả URL-encode rồi `%` thành `%` trong `content` → `AI_BAD_RESPONSE`; trong thông điệp lỗi 401 → bị che; JSON có `\\` hợp lệ không bị chặn.
- [ ] Test Rust: `model` 129 ký tự / có ký tự lạ → `AI_BAD_REQUEST`; A14 như mục 6.
- [ ] Exe build được, Properties ghi 1.0.0; `pnpm build:exe` không còn sinh `project2c_lib.lib` / `.dll`.
- [ ] Ghi trong PR: kiểm tay trên exe đóng cửa sổ có thay đổi chưa lưu (CloseGuard), Nhập / Xuất backup, AI Mock — đều chạy với capability mới.

Ước lượng: ≈ 40 dòng SP + ≈ 80 dòng test.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` + `pnpm verify:rust` xanh
- [ ] CI xanh (PR gắn nhãn `build-exe` lúc tạo)
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:med

#### Bị chặn bởi

Không (bắt đầu sau khi PR #591 merge)

## PR #617 — fix: harden the Rust AI checks and the release config, version 1.0.0 (T-235)

Trạng thái: MERGED · merge 2026-10-15T09:33:05Z · commit `1531b714feb831385a401ec6326923a625b107a7` · nhánh `task/T-235-rust-ai-release-config`

Closes #596 (T-235 — DR6-10…14, phần A14 của DR6-60).

#### Thay đổi

- **Key hai lớp (DR6-10, `ai.rs`).** `reveals` / `mask` tìm key trong 4 cách đọc một chuỗi (`readings`): nguyên văn; một lượt giải JSON + `%XX` (như cũ); và **hai lượt nối nhau** — JSON rồi `%XX` (key URL-encode, mỗi `%` viết thành escape JSON `\u0025`), `%XX` rồi JSON (escape JSON, mỗi `\` viết `%5C`). Không bao giờ giải JSON hai lượt: webview chỉ `JSON.parse` một lần, nên `\\` hợp lệ không bị chặn nhầm. `unescape` thành một lượt dạng iterator (mỗi ký tự mang khoảng byte gốc), nên `mask` che đúng đoạn gốc ở mọi cách đọc; các đoạn trùng nhau (cùng key, nhiều cách đọc) gộp thành một `***`.
- **Tên model (DR6-11).** `check()`: `model` 1–128 ký tự, chỉ chữ / số ASCII và `-._:/` → khác đi là `AI_BAD_REQUEST`.
- **Phiên bản 1.0.0 (DR6-12, Q12).** `apps/desktop/package.json`, `tauri.conf.json`, `Cargo.toml` (User-Agent `Project-2C/1.0.0`, `Cargo.lock` theo). `tools/eval-ai.mjs` đọc phiên bản từ `package.json` nên tự theo.
- **`crate-type = ["rlib"]` (DR6-13).** Exe chỉ link `rlib`; `staticlib` / `cdylib` là của bản mobile trong template Tauri.
- **Quyền webview (DR6-14).** `capabilities/default.json` thay `core:default` bằng đúng ba quyền app dùng: `core:event:allow-listen`, `core:event:allow-unlisten` (`onCloseRequested` của CloseGuard) và `core:window:allow-destroy`. Lệnh của app (`db_*`, `export_write`, `ai_*`…) không cần quyền (không có app manifest). CSP thêm `base-uri 'none'; form-action 'none'`, `connect-src` giữ nguyên.

#### Test chấp nhận

- [x] Test Rust `the_key_in_two_layers_of_escapes_is_bad_response_and_masked`: key URL-encode rồi `%` → `\u0025` trong `content` → `AI_BAD_RESPONSE`; dạng `%5C` cũng vậy; trong thông điệp lỗi 401 / 429 → `***` (cả mã phiên); `\\` hợp lệ (`\\u0025…`, `\\u0073…`, `\u005C…`) không bị chặn. Trên code cũ test đỏ.
- [x] Test Rust: `model` rỗng / 129 ký tự / có khoảng trắng, CRLF, `"`, chữ có dấu → `AI_BAD_REQUEST` (code cũ đỏ); 128 ký tự và `Org_1/GLM-5.3:free` qua. A14: `wrong_arguments_while_a_request_runs_are_bad_request_and_leave_its_flag_alone` — `Busy` đang giữ + đối số sai → `AI_BAD_REQUEST`, cờ vẫn của yêu cầu đang chạy.
- [x] Đột biến (tay, rồi trả lại): bỏ từng cách đọc hai lượt, thay một lượt bằng JSON → JSON, nới 128 → 129, cho phép khoảng trắng trong model → mỗi cái làm ít nhất một test đỏ.
- [x] `tauri-contract.test.ts` thêm "the release configuration": ba file cùng một phiên bản; `crate-type = ["rlib"]`; webview chỉ import `invoke`, `isTauri`, `getCurrentWindow` từ `@tauri-apps/api` và capability đúng ba quyền trên (import mới → test đỏ, nhắc xem quyền); CSP có `base-uri 'none'`, `form-action 'none'`, `connect-src` cũ.
- [x] `pnpm build:exe` (release, 2 phút 49 giây trên laptop): Properties của exe `FileVersion` / `ProductVersion` **1.0.0**; `target\release` chỉ còn `project2c.exe` (+ `.pdb`, `.d`), không còn `project2c_lib.lib` / `.dll`.
- [x] **Kiểm trên exe release với capability mới** (exe chép ra thư mục riêng, dữ liệu mới, điều khiển qua cổng debug WebView2 như `e2e/perf`, script Playwright tạm trong `.local/`, không commit). Kết quả qua hết:
  - Lệnh `core:default` từng cho mà app không dùng nay bị từ chối: `plugin:window|title`, `plugin:app|version`, `plugin:event|emit`, `plugin:webview|get_all_webviews` → "not allowed by ACL".
  - **Xuất backup** → file vào `exports\`; tạo team mới; **Nhập backup** file vừa xuất ("Backup rồi thay dữ liệu") → "Đã nhập backup", team mới biến mất.
  - **AI Mock:** KH mới + ghi chú KYC 3 dữ kiện → Phân tích → "Phân tích xong: đã lưu kết quả.", "Kết quả Mock…".
  - **CloseGuard, đóng cửa sổ khi có thay đổi chưa lưu:** một tiến trình khác giữ `project2c.db` (không share delete) → tạo team, lưu lỗi → gửi WM_CLOSE (như nút X) → hộp "Chưa lưu được thay đổi" hiện, cửa sổ còn mở → thả file, bấm "Thử lại" → lưu rồi cửa sổ đóng, tiến trình thoát → mở lại exe: team còn. Đóng lần nữa không có thay đổi → đóng ngay.
  - Console của webview suốt lần chạy: không có lỗi quyền nào.
- [x] `pnpm verify` xanh (111 file, 2 766 test); `pnpm verify:rust` xanh (fmt, clippy `-D warnings`, 93 test).

#### Ghi chú cho review

- **Chi phí 4 cách đọc** (đo một lần, build release): `reveals` + `mask` trên `content` 128 KB (câu trả lời dài nhất của `max_tokens` 32 000) ≈ 16 ms; trên 2 MB (trần `MAX_BODY`) ≈ 0,26 s. Chỉ chạy trên câu trả lời 2xx / thông điệp lỗi, sau một lượt gọi mạng nhiều giây.
- Kiểm trên exe là chạy tự động qua CDP trên exe release thật (không phải bản web `asExe`), chưa phải bấm tay. Owner muốn tự thử thì: exe ở CI artifact của PR này.
- Không có đường khai thác hiện tại cho mục 1, 2, 5 (cần server bất thường / webview bị chiếm), như Issue ghi.
- Sửa ngoài danh sách file của Issue: không có. `gen/schemas/**` sinh lại khi build nhưng đã gitignore.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #597 — T-236: Hồ sơ KH và Tổng quan khớp danh sách nghiệm thu G7 (DR6-27…30, DR6-46)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

#### Mục tiêu

Các dòng nghiệm thu v1.0 đang viết theo mockup đã duyệt mà app chưa làm (Owner chọn 15/10, bản tổng hợp §9 Q4, Q9):

1. **NT-HS-05 (DR6-27):** ô Giá trị của trường tiền KYC (Thu nhập năm, Tổng tài sản, Nợ phải trả — chốt danh sách trường trong PR) hiện dòng đọc lại "6.000.000.000 ₫ (6 tỷ)" khi `parseVnd` hiểu được chữ đã gõ, như mọi ô tiền khác (mockup 7b / 7c); không hiểu được ("Khoảng 12 tỷ", "1–2 tỷ") thì không hiện gì. Kiểu lưu giữ nguyên (chữ).
2. **NT-HS-08 (DR6-28):** hộp 7d ghi mã F cạnh mỗi giá trị ("F10 · ghi chú 23/11/2025"); dòng "Đang có:" của 7c cũng có mã F.
3. **Dòng thời gian (DR6-29):** sự kiện chuyển nhóm do cuộc gặp ghi "· tính 1 RF" / "· không tính RF" (`isRfTransition`) như mockup `customer.html`; phiên bản KYC `material` có nhãn "thay đổi quan trọng" (khóa `timeline.material` có sẵn). Ô "Kỳ" của thẻ Lịch hẹn: không làm (ghi lệch đã biết ở T-246).
4. **Bố cục 1 440 × 900 (DR6-30):** hồ sơ KH ba cột như mockup ở bề rộng cửa sổ mặc định; dưới bề rộng đó vẫn co như hiện nay (kiểm ảnh ở 1 440 và 1 100).
5. **NT-TQ-22 (DR6-46):** dòng "Đang xem" của kỳ Năm có "·" giữa kỳ và khoảng ngày như mockup 1c / 2e (kỳ Tháng giữ như cũ).
6. Sửa các e2e đang ghim bản lệch (dòng thời gian không nhãn, "Đang xem" không dấu).

#### Bối cảnh

Deep review lượt 1: DR6-27 (L·CL-D2, H·CL-D2, L·CX-D3, H·MU-D1), DR6-28 (H·CL-D3, L·MU-D1), DR6-29 (L·CL-D3, H·CX-D1, L·CX-D2), DR6-30 (L·CX-D4), DR6-46 (H·CL-E1). NT-TQ-06 (tỉ lệ chốt) và các lệch không sửa đi vào T-246 (docs).

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.4 (DR6-27…30), §5.5 (DR6-46), §8.3 S2-E, §9 Q4, Q9
- `docs/testing/nghiem-thu-v1.md` NT-HS-05, NT-HS-06, NT-HS-08, NT-HS-11, NT-TQ-22, mục "Lệch mockup đã biết"
- Mockup `docs/design/mockups/kyc-forms.html` 7b, 7c, 7d; `docs/design/mockups/customer.html` (dòng thời gian, bố cục 3 cột); `docs/design/mockups/overview.html` 1c; `docs/design/mockups/reports.html` 2e
- `packages/domain/src/money.ts` (`parseVnd`, `formatVnd`, `formatVndCompact`), `packages/domain/src/kyc-fact.ts`
- `apps/desktop/src/routes/customers/KycDialogs.tsx`, `kyc-view.ts`, `CustomerKyc.tsx`, `CustomerProfile.tsx`; `apps/desktop/src/routes/FilterBar.tsx`

#### File / thư mục được phép sửa

- `apps/desktop/src/routes/customers/{KycDialogs,CustomerKyc,CustomerProfile}.tsx`, `apps/desktop/src/routes/customers/kyc-view.ts` (+ test)
- `apps/desktop/src/routes/FilterBar.tsx`, `apps/desktop/src/routes/applied-filter.ts` (+ test)
- `apps/desktop/src/i18n/vi.ts`
- `e2e/customer-kyc.spec.ts`, `e2e/overview.spec.ts`, `e2e/reports.spec.ts`, `e2e/customer-ai.spec.ts` (nếu bố cục đổi chỗ chọn)

#### Interface / hợp đồng

- `KycResolveOption` thêm mã F (`factCode(seq)`); một hàm thuần đọc lại tiền cho trường KYC (có unit test).

#### Test chấp nhận

- [ ] Unit: hàm đọc lại tiền: "6 tỷ" → "6.000.000.000 ₫ (6 tỷ)", "1 tỷ 2" → "1.200.000.000 ₫ (1,2 tỷ)", "Khoảng 12 tỷ" → không có dòng.
- [ ] e2e: NT-HS-05 (7b gõ "6 tỷ" thấy dòng đọc lại), NT-HS-08 (7d có mã F), dòng thời gian có "tính 1 RF" và "thay đổi quan trọng", NT-TQ-22 có "·".
- [ ] Ảnh hồ sơ KH ở 1 440 × 900 ba cột, ở 1 100 hai cột (đính PR).

Ước lượng: ≈ 60–80 dòng SP + ≈ 150 dòng test.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:low

#### Bị chặn bởi

Không (bắt đầu sau khi PR #591 merge)

## PR #623 — fix: read back KYC amounts, fact codes, RF and material on the timeline, three profile columns at 1440 (T-236)

Trạng thái: MERGED · merge 2026-10-15T13:41:23Z · commit `bf87d711f26af9028951f790e7a0cd30992abc80` · nhánh `task/T-236-g7-acceptance-profile`

Closes #597 (T-236). Deep review lượt 1, nhóm S2-E: DR6-27, 28, 29, 30, 46 — các dòng nghiệm thu G7 viết theo mockup đã duyệt.

#### Đã làm

1. **NT-HS-05 (DR6-27) — đọc lại tiền KYC.** `kycAmountRead(field, text)` trong `kyc-view.ts`: với **Thu nhập năm, Tổng tài sản, Nợ phải trả** (`annualIncome`, `totalAssets`, `liabilities` — danh sách chốt), chữ `parseVnd` hiểu được hiện dòng đọc lại dưới ô Giá trị như case size / FYP: `6 tỷ` → "6.000.000.000 ₫ (6 tỷ)", `1 tỷ 2` → "1.200.000.000 ₫ (1,2 tỷ)". Không hiểu được ("Khoảng 12 tỷ", "1–2 tỷ", số âm) hay trường khác → không có dòng. Giá trị vẫn lưu nguyên chữ. Dưới 1 triệu dạng gọn trùng dạng đủ nên chỉ ghi một lần ("0 ₫", "500.000 ₫"). Áp cho cả 7a/7b/7c và hộp Xác nhận đề xuất AI (3f, dùng chung `FactValue`); ở 3f dòng đọc lại đứng trước "Sửa được trước khi lưu.".
2. **NT-HS-08 (DR6-28) — mã F.** `KycResolveOption.code = factCode(seq)`; hộp 7d ghi "F4 · ghi chú 15/09/2026" / "F1 · hồ sơ KH …". Dòng "Đang có:" của 7c: "2 · F4 (15/09/2026)" (`currentFactRecords` giữ `seq`).
3. **Dòng thời gian (DR6-29).** `stageCause(transition)`: chuyển nhóm do cuộc gặp ghi "sau cuộc gặp · **tính 1 RF**" (màu accent như mockup) hoặc "sau cuộc gặp · không tính RF" theo `isRfTransition`; "tạo KH", "chuyển tay · không tính RF" giữ nguyên. Phiên bản KYC `material` có nhãn "thay đổi quan trọng" (khóa `timeline.material` có sẵn). Dòng phiên bản / chuyển nhóm `flex-wrap` để cột hẹp xuống dòng gọn. Ô "Kỳ" thẻ Lịch hẹn: không làm (lệch đã ghi ở T-246).
4. **Bố cục (DR6-30).** Hồ sơ KH ba cột từ bề rộng 1 440 (cửa sổ mặc định), dưới đó giữ như cũ (2 cột từ `lg`, 1 cột dưới nữa).
5. **NT-TQ-22 (DR6-46).** "Đang xem" kỳ Năm đang chạy: "Năm 2026 · 01/01 – 15/09/2026 · …"; kỳ Tháng giữ "Tháng 09/2026 MTD 01/09 – 15/09/2026 · …".
6. Sửa e2e ghim bản lệch: `overview.spec.ts`, `reports.spec.ts` (dấu "·"), `customer-kyc.spec.ts`, `customer-ai.spec.ts` (nhãn, mã F).

#### Lệch so với Issue / mockup — cần reviewer xem

- **File ngoài danh sách (2):**
  - `packages/ui/src/theme.css`: thêm token `--breakpoint-wide: 90rem` (biến thể `wide:`). Lý do: `lint:tokens` cấm giá trị tùy ý (`min-[1440px]:`), mà breakpoint chuẩn gần nhất `xl` (1 280) làm khoảng 1 280–1 439 thành ba cột chật (đã chụp thử: dữ kiện KYC, nút panel AI gãy dòng), trái "dưới bề rộng đó vẫn co như hiện nay". Có tiền lệ token bố cục cùng chỗ (`--container-bar-label`). Không đổi màu / khoảng cách nào.
  - `e2e/appointment-outcome.spec.ts`: một dòng kiểm "N3→N2sau cuộc gặp · tính 1 RF" thay hai dòng kiểm "N3", "N2" trong test sẵn có ghi kết quả N3 → N2 — chỗ duy nhất e2e tạo một chuyển nhóm RF do cuộc gặp, khỏi dựng lại luồng đó trong `customer-kyc.spec.ts`.
- **Định dạng mã F:** mockup ghi "F-05 · ghi chú N-0712 (12/07/2026)" / "F-10 · N-0712 · 12/07/2026"; app không có mã ghi chú N-…, mã F theo `factCode` ("F5", như thẻ Dữ kiện KYC và panel AI). Issue cũng ghi dạng "F10 · ghi chú 23/11/2025".
- **"thay đổi quan trọng" ở v1:** phiên bản đầu luôn material (ADR-0008 7, `isMaterialChange(null, …)`), nên KH mới cũng có nhãn ở "kyc v1". Đúng câu NT-HS-11 ("có nhãn … khi có"); mockup vẽ phiên bản đầu bằng dòng "KYC lần đầu" khác hẳn, không có nhãn.
- **`sep.semicolon`:** dòng "Đang có:" chuyển sang `t()` nên `'; '` cứng thay bằng khóa mới (DR6-37, sửa khi chạm tới).

#### Ảnh 1 440 × 900 / 1 100

`gh` không tải ảnh lên PR được; ảnh hồ sơ KH ở 1 440 (ba cột), 1 280 (hai cột, như cũ) và 1 100 (hai cột) đã gửi Owner trong phiên. Bố cục còn được e2e mới kiểm (`customer-kyc.spec.ts`: ở 1 440 ba vùng Dữ kiện KYC / Dòng thời gian / KYC Intelligence cùng hàng, trái → phải; ở 1 100 panel AI xuống dưới, thẳng cột Dữ kiện KYC).

#### Chưa sửa (docs, ngoài phạm vi)

Hướng dẫn sử dụng `05-ho-so-kh.md` (dòng 74) và `11-thuat-ngu.md` (dòng 31) ghi chuyển nhóm "sau cuộc gặp" chưa có "· tính 1 RF / không tính RF"; ảnh `05-ho-so-kh.png` (chụp 1 440) sẽ thành ba cột khi chụp lại; NT-HS-11 nên ghi thêm "· tính 1 RF / không tính RF". Đề xuất một PR docs sau khi PR này merge.

#### Test

- Unit (`kyc-view.test.ts`): `kycAmountRead` (6 tỷ, 1 tỷ 2, 800tr, 0, 500k, Khoảng 12 tỷ, 1–2 tỷ, rỗng, âm, trường khác), `currentFactRecords`, `stageCause` (tạo KH, chuyển tay, RF N3→N2 / N4→N1, không RF N2→N1 / N4→N3 / N2→N3), `resolveKycOptions` có `code`.
- E2E: NT-HS-05 (7b gõ "6 tỷ" có mô tả đọc lại, "Khoảng 12 tỷ" không), mã F ở 7c / 7d, "thay đổi quan trọng" ở dòng thời gian, "tính 1 RF", "Đang xem" kỳ Năm có "·", bố cục 1 440 / 1 100.
- `pnpm verify` xanh; `pnpm e2e` toàn bộ trên Office Laptop: 214 / 214 xanh.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #624 — docs: mark RF on meeting stage changes, material KYC versions and the three-column profile in the guide (T-236)

Trạng thái: MERGED · merge 2026-10-15T13:51:16Z · commit `123f8469cc2e954945314f14031af73d6f4970d1` · nhánh `docs/t-236-profile-guide`

PR docs sau PR #623 (T-236, Issue #597; DR6-27…30, DR6-46), đã merge ở `bf87d71`: làm phần "Chưa sửa (docs, ngoài phạm vi)" ghi trong thân #623. Câu trích đối chiếu với `apps/desktop/src/i18n/vi.ts` trên `main` (`customer.created` / `customer.manual` / `customer.byMeeting`, `timeline.rf` "tính 1 RF", `timeline.noRf` "không tính RF", `timeline.material`); luật RF theo `stageCause` trong `kyc-view.ts` (`isRfTransition`); "kyc v1 luôn là thay đổi quan trọng" theo ADR-0008 mục 7 (`nextKycVersion`, e2e `customer-kyc.spec.ts`); bố cục theo `CustomerProfile.tsx` (`lg:grid-cols-2 wide:grid-cols-3`, `--breakpoint-wide: 90rem`) và cửa sổ mặc định 1440 × 900 trong `tauri.conf.json`.

#### Thay đổi

- `docs/user-guide/05-ho-so-kh.md`
  - § Dòng thời gian: chuyển nhóm ghi "tạo KH", "chuyển tay · không tính RF", "sau cuộc gặp · tính 1 RF" (cuộc gặp đưa KH từ N4 / N3 lên N2 / N1) hoặc "sau cuộc gặp · không tính RF" (ví dụ N4 → N3, N2 → N1). Phiên bản KYC có thay đổi quan trọng có nhãn "thay đổi quan trọng"; kyc v1 luôn có.
  - Dưới ảnh đầu mục: một câu tả bố cục: từ 1 440 px (cỡ mặc định) ba cột **Dữ kiện KYC** + **Hợp đồng** · **Dòng thời gian** + **Lịch hẹn** · **KYC Intelligence**; hẹp hơn còn hai cột, KYC Intelligence xuống cuối.
  - § KYC Intelligence: "ở cuối hồ sơ" → "cột phải; cửa sổ hẹp hơn 1 440 px thì ở cuối hồ sơ".
- `docs/user-guide/06-ai.md`: câu vị trí thẻ KYC Intelligence sửa như trên.
- `docs/user-guide/11-thuat-ngu.md`: **Chuyển nhóm** thêm "· tính 1 RF / không tính RF"; **Thay đổi quan trọng** thêm "kyc v1 luôn là thay đổi quan trọng" và nhãn ở Dòng thời gian; **KYC Intelligence** "ở cột phải hồ sơ KH (hẹp hơn 1 440 px: ở cuối hồ sơ)".
- `docs/testing/nghiem-thu-v1.md` NT-HS-11: "sau cuộc gặp · tính 1 RF" / "sau cuộc gặp · không tính RF" (tính 1 RF chỉ khi N4 / N3 lên N2 / N1); "kyc v1 luôn có" nhãn "thay đổi quan trọng".

#### Ảnh

Chụp lại bằng lệnh của hướng dẫn (`pnpm exec playwright test -c playwright.guide.config.ts`: bản web, ngày neo 15/09/2026, khung 1440 × 900), 13 / 13 xanh (gồm kiểm link / ảnh và giới hạn 150 KB / ảnh).

- `05-ho-so-kh.png`: hồ sơ ba cột (Dữ kiện KYC / Dòng thời gian / KYC Intelligence).
- `05-du-kien-kyc.png`: thẻ hẹp lại theo cột (572 → 376 px).
- `04-chuyen-nhom.png`, `05-ghi-chu-kyc.png`, `05-hop-dong-moi.png`: hộp không đổi; chỉ vài chục pixel nền mờ phía sau (hồ sơ ba cột) khác, giữ để lần chạy sau ra cùng byte.

Không gồm (ngoài phạm vi PR này):

- `06-ai-phan-tich.png` **giữ ảnh cũ**: ở 1 440 thẻ cao 985 px > khung 900, Playwright cuộn tới thẻ và header `sticky` (`AppShell.tsx`) che dòng đầu thẻ (tiêu đề "KYC Intelligence", CURRENT, Mock). Ảnh cũ vẫn đúng nội dung (thẻ như ở cửa sổ hẹp hơn 1 440). Sửa cần đổi `e2e/guide/shots.guide.ts` (PR code, chạy CI) → việc sau.
- `03-ket-qua.png` cũng đổi khi chạy lại, nhưng do PR #618 (T-233: câu gợi ý **Hẹn lần tiếp theo** nay "cùng KH, người phối hợp, trigger, RE phụ trách KH"), không do #623 → để việc sau, cùng lúc với ảnh 06.

Chỉ đụng `docs/**`, nên không chạy CI.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #598 — T-237: AI: phiên ChatGPT web theo mốc dữ liệu, V1 / LAW_NAME đúng chữ G5, version prompt của seed, Mock trích xuất (DR6-15, 16, 18, 19, 22)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

#### Mục tiêu

1. **Phiên ChatGPT web (DR6-15):** `startChatGptWeb` ghi mốc `generation`; `saveChatGptAnswer` trả `discarded` khi dữ liệu đã thay hoặc đang thay (như `analyseCustomer`); panel bỏ phiên khi mốc đổi; `webChip` không ném khi phiên bản KYC không còn.
2. **Đúng chữ G5 đã duyệt, không đổi G5 (DR6-16, Owner xác nhận 15/10 §9 Q6):** V1 đếm 1–300 ký tự **sau khi bỏ** `\p{Cf}` (G5 §10.4); `LAW_NAME` miễn "KH", "RE" ở **mọi kiểu chữ** như "sư" (G5 §8.4).
3. **Seed (DR6-18):** phân tích Mock của seed ghi đúng version prompt hiện hành của từng chế độ (đưa version vào module schema mà `db` được import, hoặc truyền vào seed); sửa e2e đang ghim `@1`. Dữ liệu sinh ra đổi → Owner nạp lại (K1).
4. **Mock trích xuất (DR6-19):** chỉ nhận câu có chủ thể là KH và không phủ định ("em trai độc thân", "không có 2 con", "9 con số" → 0 đề xuất); sửa test đang ghim ca "Em trai chị còn độc thân".
5. **Chữ cũ (DR6-22, phần code):** comment "64 tokens" của Kiểm tra kết nối → 1 024; `aiError.AI_TOO_LARGE` viết "200.000". `docs/golden/ai-eval.md:13` ("`reasoningEffort: false`") sửa nếu dòng đó không thuộc phần test so nguyên văn; nếu thuộc thì ghi `review-notes.md`.
6. Test giữ luật (DR6-61): ngoại lệ "kỷ" / "quy" / "RE" của `LAW_NAME` (gồm "quy luật Thị trường"); test hợp đồng TS ↔ Rust: `max(maxTokens của các prompt) ≤ MAX_TOKENS` của `ai.rs` và trần ký tự hai bên bằng nhau; V4 / V6 vẫn áp cho `personalityNotes`.

#### Bối cảnh

Deep review lượt 1: DR6-15 (L·MU-C1, H·CL-C6), DR6-16 (L·CL-C1, L·CX-C2), DR6-18 (L·CL-C4), DR6-19 (L·CX-C3, H·CX-C1), DR6-22 (L·CL-C6, H·CL-C4, L·MU-C3, H·MU-C2), DR6-61 (L·CL-C2, L·CL-C3, H·CL-C7). Unicode lọt V3–V6 (DR6-17) cần G5 → hoãn sau v1.0 (Owner 15/10). Đường vào thật của DR6-15 (nút Back trong lúc Nạp lại) đóng ở T-242.

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.3 (DR6-15, 16, 18, 19, 22), §5.8 (DR6-61), §8.3 S2-F, §9 Q5, Q6
- `docs/design/phase-5-prompts.md` §7, §8.4, §10.4; `docs/design/phase-5-ai.md` §3.1, §5.3, §9.1; ADR-0009 phụ lục G5, W-1
- `packages/ai/CLAUDE.md`; `packages/ai/src/schema.ts`, `blocklists.ts`, `mock-adapter.ts`, `run.ts`, `prompts/*.ts`
- `packages/db/src/seed.ts` (phân tích Mock)
- `apps/desktop/src/data/ai-analysis.ts` (`startChatGptWeb`, `saveChatGptAnswer`, `analyseCustomer`), `apps/desktop/src/routes/customers/ai-panel-view.ts` (`webChip`), `KycWebSession.tsx`, `KycIntelligence.tsx`, `apps/desktop/src/routes/SettingsAi.tsx`
- `apps/desktop/src-tauri/src/ai.rs` (`MAX_TOKENS`, `MAX_MESSAGE_CHARS` — chỉ đọc), `apps/desktop/src/data/tauri-contract.test.ts`

#### File / thư mục được phép sửa

- `packages/ai/src/{schema,blocklists,mock-adapter}.ts`, `packages/ai/src/validator-blocklists.test.ts`, test cạnh các file trên
- `packages/db/src/seed.ts` (+ test)
- `apps/desktop/src/data/ai-analysis.ts`, `apps/desktop/src/routes/customers/{ai-panel-view.ts,KycWebSession.tsx,KycIntelligence.tsx}`, `apps/desktop/src/routes/SettingsAi.tsx` (comment) và test cạnh chúng
- `apps/desktop/src/data/tauri-contract.test.ts`
- `apps/desktop/src/i18n/vi.ts`
- `e2e/customer-ai.spec.ts`, `e2e/customer-ai-web.spec.ts`
- `docs/golden/ai-eval.md` (chỉ dòng 13, xem mục 5)

#### Interface / hợp đồng

- Phiên web (`WebStartOutcome` / phiên trong panel) mang `generation`; `saveChatGptAnswer` có thêm kết quả `discarded` như các job AI khác.

#### Test chấp nhận

- [ ] `ai-analysis.test.ts`: mở phiên web, Nạp lại / nhập backup cùng ID, dán câu trả lời → `discarded`, không có dòng mới; `ai-panel-view.test.ts`: `webChip` với phiên bản không còn không ném.
- [ ] `schema.test.ts`: 295 chữ + 10 × U+200B đạt V1; 301 chữ không đạt.
- [ ] `validator-blocklists.test.ts`: "luật Kh tự đặt", "luật Re…", "quy luật Thị trường", "kỷ luật Thép của KH" → đạt; "Luật Kinh doanh bảo hiểm" vẫn chặn; `personalityNotes` có tên hãng → V4, có "Điều 35" → V6.
- [ ] Test hợp đồng TS ↔ Rust đỏ khi đổi trần một phía.
- [ ] Seed demo: phân tích Mock mang version prompt hiện hành; e2e cập nhật.
- [ ] `mock-adapter.test.ts`: các câu người thân / phủ định / "con số" → 0 đề xuất; "KH đã kết hôn, có 2 con" vẫn 2 đề xuất.

Ước lượng: ≈ 80 dòng SP + ≈ 250 dòng test.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:med

#### Bị chặn bởi

Không (bắt đầu sau khi PR #591 merge)

## PR #628 — fix: tie the ChatGPT web session to its data, count V1 without format characters, seed the current prompt versions (T-237)

Trạng thái: MERGED · merge 2026-10-15T15:55:02Z · commit `e6c907827196f479be8da768437bc7add3a75a11` · nhánh `task/T-237-ai-web-v1-seed-mock`

Closes #598 (T-237, đợt S2-F của deep review Phase 1–6 lượt 1).

#### Thay đổi

1. **Phiên ChatGPT web theo mốc dữ liệu (DR6-15).** `startChatGptWeb` ghi `generation` lúc chụp đầu vào và `seq` của phiên bản KYC (`kycVersion`) vào phiên (`AppWebSession` / `WebStartOutcome`). `saveChatGptAnswer(app, { session, generation }, pasted)` trả `discarded` khi dữ liệu đã thay (Nạp lại / Nhập backup, kể cả cùng ID), không kiểm, không lưu. Panel (`KycIntelligence`) theo dõi `generation` bằng `useSyncExternalStore` và bỏ phiên khi mốc đổi. `webChip` đọc "kyc v<n>" từ ảnh chụp, không tra danh sách phiên bản nữa, nên không còn `RangeError` làm sập hồ sơ (`KycWebSession` bỏ prop `versions`).
2. **Code khớp đúng chữ G5 đã duyệt, không đổi G5 (DR6-16, Q6).** V1 đếm 1–300 ký tự **sau khi bỏ** `\p{Cf}` và cắt khoảng trắng (G5 §10.4). `LAW_NAME` miễn "KH", "RE" ở mọi kiểu chữ như "sư" (G5 §8.4).
3. **Seed (DR6-18).** `PROMPT_VERSIONS` ở `@p2c/ai/schema` (module duy nhất `db` được import); seed ghi `analysis@2` / `discovery@2` như app. Có test giữ hằng này khớp với `version` của từng prompt. Sửa e2e đang ghim `@1`. `DEMO_HASH` của seed đổi (chỉ cột `prompt_version`; số dòng từng bảng không đổi).
4. **Mock trích xuất (DR6-19).** Chỉ nhận cụm nói về KH: không có người khác (em trai, con, bố, mẹ…) nêu trước nó trong câu, không có phủ định (không / chưa / chẳng) trước nó trong vế câu; "con số" không phải số con. Đã sửa test đang ghim ca "Em trai chị còn độc thân".
5. **Chữ cũ (DR6-22, phần code).** Comment Kiểm tra kết nối "64 tokens" → 1 024; `aiError.AI_TOO_LARGE` viết "200.000"; `docs/golden/ai-eval.md:13` sửa theo `models.ts` hiện tại (`reasoningEffort: true`, T-179). Dòng 13 thuộc §1, không nằm trong phần `eval-ai-core.test.mjs` so nguyên văn (§4.1, §5).
6. **Test giữ luật (DR6-61).** Ngoại lệ "kỷ" / "quy" / "KH" / "RE" của `LAW_NAME` (gồm "quy luật Thị trường", "kỷ luật Thép của KH"), "Luật Khoa học…" vẫn chặn. V4 / V6 vẫn áp cho `personalityNotes`. Test hợp đồng TS ↔ Rust (`tauri-contract.test.ts`): `max(maxTokens)` của 4 prompt ≤ `MAX_TOKENS` của `ai.rs`, trần ký tự hai bên bằng nhau. Đã thử: đổi tạm trần ký tự ở `run.ts`, hoặc `maxTokens` của extraction lên 40 000 → test đỏ (đã trả lại, không commit).

#### Điểm cần reviewer xem

- **"Đang thay" giữ S2-2, không đổi thành `discarded`.** Issue ghi `discarded` "khi dữ liệu đã thay hoặc đang thay (như `analyseCustomer`)". Bấm Kiểm tra và lưu **trong lúc** đang thay vẫn trả `replacing` (câu S2-2, giữ phiên) như test S2-2 / S2-4 đã có: lần thay có thể thất bại, khi đó dữ liệu vẫn là dữ liệu cũ và phiên lưu được. Không trường hợp nào lưu câu trả lời vào dữ liệu khác: đang thay thì lệnh ghi bị từ chối; thay xong thì `generation` đổi → `discarded`, panel bỏ phiên.
- **`PROMPT_VERSIONS` là bản chép, có test giữ khớp.** `prompts/*.ts` (file G5) không có trong danh sách file được phép sửa nên em không đụng; `schema.ts` không được import prompt (`ai-schema-standalone`). Hằng có cả `extraction` để tên đúng nghĩa.
- **`packages/ai/CLAUDE.md`:** chỉ phần bản đồ export do `pnpm codemap` sinh (thêm `PROMPT_VERSIONS`). File đang ở 7.998 / 8.000 ký tự: export mới tiếp theo sẽ làm `codemap` thu bản đồ về danh sách file.
- Dữ liệu seed đổi (`prompt_version`) → Owner nạp lại dữ liệu giả lập (K1).

#### Kiểm

- `pnpm verify` xanh (2 821 test, coverage đạt).
- `pnpm e2e` xanh (214 / 214, Edge, bản build web).

#### Rủi ro

`risk:med` (đổi kiểu lưu phiên web, luật validator V1 / V6, seed). Không chạm `src-tauri` / build → không cần `build-exe`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #599 — T-238: Bản phân tích STALE vẫn mờ nhưng đạt WCAG AA (DR6-21)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

#### Mục tiêu

Owner chọn 15/10 (bản tổng hợp §9 Q7, phương án (a), G3): khối phân tích STALE (và lúc đang chạy / đang hủy / cổng chặn) ở panel KYC Intelligence và khối AI của chi tiết lịch hẹn vẫn trông "mờ" nhưng **mọi cặp chữ / nền đạt AA** (ADR-0013, thấp nhất 4,5:1): không làm mờ chữ bằng `opacity: 0.5` cả khối; làm mờ bằng viền / nền / nhãn, hoặc độ mờ đủ cao để mọi cặp ≥ 4,5:1 (tính từ token). Sửa mockup `ai.html` (`.faded`) cho khớp, kèm ghi chú mockup 1f "1 024 token" (DR6-22, phần mockup).

#### Bối cảnh

Deep review lượt 1: DR6-21 (H·CL-C2): mờ 50 % làm dòng "Mức bằng chứng" còn 2,38:1, chữ phần tử 4,43:1; mockup G3 mâu thuẫn ADR-0013. Sửa mockup theo `.claude/rules/mockups.md`.

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.3 (DR6-21, DR6-22), §9 Q7
- `docs/decisions/0013-huong-ui-dark-mode.md`
- `.claude/rules/mockups.md`; mockup `docs/design/mockups/ai.html` (khối STALE `.faded`, ghi chú 1f)
- `docs/design/phase-5-ai.md` §9.1, §9.2 (STALE)
- `packages/ui/src/tokens.css`
- `apps/desktop/src/routes/customers/KycIntelligence.tsx`, `apps/desktop/src/routes/appointments/AppointmentAi.tsx`

#### File / thư mục được phép sửa

- `apps/desktop/src/routes/customers/KycIntelligence.tsx`, `apps/desktop/src/routes/appointments/AppointmentAi.tsx`
- `packages/ui/src/tokens.css` (chỉ khi cần một token mới cho trạng thái mờ, kèm `lint:tokens`)
- `docs/design/mockups/ai.html`
- `e2e/customer-ai.spec.ts` (nếu thêm kiểm)

#### Interface / hợp đồng

- Không đổi.

#### Test chấp nhận

- [ ] Bảng tương phản trong PR: mỗi cặp chữ / nền của khối STALE (chữ phần tử, dòng mức bằng chứng, chip, badge) ≥ 4,5:1, tính từ token.
- [ ] Khối STALE vẫn phân biệt được với khối CURRENT (ảnh trước / sau trong PR).
- [ ] Mockup `ai.html` cập nhật cùng cách, ghi chú 1f "1 024 token".

Ước lượng: ≈ 10–20 dòng SP + mockup.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:low

#### Bị chặn bởi

Không (bắt đầu sau khi PR #591 merge)

## PR #632 — fix: keep a faded AI analysis at WCAG AA, hollow items at 85 % (T-238)

Trạng thái: MERGED · merge 2026-10-16T05:49:35Z · commit `35ba0d3c349fccd4256f13473e94a64b016c3fc7` · nhánh `task/T-238-stale-faded-aa`

Closes #599 (T-238). Deep review lượt 1: DR6-21 (G3, Owner chọn Q7 (a) ngày 15/10) và phần mockup của DR6-22.

#### Đã làm

1. **Khối phân tích mờ vẫn đạt AA.** Bản STALE, bản đang chạy / đang hủy lại và bản dưới cổng chặn ở panel KYC Intelligence, cùng khối AI STALE ở chi tiết lịch hẹn: bỏ `opacity-50`. Giờ cả khối mờ **85 %** (`FADED = 'opacity-85'` trong `KycIntelligence.tsx`, `AppointmentAi.tsx` dùng chung), và **thẻ phần tử thành rỗng**: viền đứt `border-border-strong`, không nền `bg-surface-2` (`Item` thêm prop `faded`). Thẻ rỗng là để chữ nằm trên nền thẻ `--bg-1`: dòng mức bằng chứng ở 85 % trên `--bg-2` chỉ 4,44:1, trên `--bg-1` là 4,81:1.
2. **Mockup `ai.html`:** `.faded` → `opacity: 0.85` + `.faded .hyp` viền đứt `--border-strong`, không nền; thêm một dòng ghi chú dưới 2h (cách mờ, số tương phản, dùng chung cho 2b / 2d / 2j / chi tiết lịch hẹn). Ghi chú 1f: "tối đa 64 token" → "**1 024 token**" (khớp `connection.ts` `maxTokens: 1_024`, DR6-22).
3. **E2E** (`customer-ai.spec.ts`): helper `lowestContrast(area)` đo tương phản WCAG thấp nhất của mọi chữ đang hiện trong vùng, mỗi chữ so với màu thật sự vẽ phía sau, tính qua độ mờ của mọi khối bên trên (bỏ qua control `disabled`, như WCAG). Kiểm toàn panel ≥ 4,5 ở hai trạng thái mờ: STALE và dưới cổng CONFLICT_RESOLUTION. Đỏ trước khi sửa: **2,38** (đúng số tính từ token); CURRENT: 5,61.

Không thêm token, không đổi `tokens.css`. Có tiền lệ cùng cách: `phase-3-feedback.html:677` ("flat surface, dashed border … text keeps ≥ 4.5:1 (no opacity on text)").

#### Bảng tương phản (tính từ token `packages/ui/src/tokens.css`, nền thẻ `--bg-1`)

Độ mờ của nhóm phủ lên nền thẻ: màu chữ và màu nền trong khối đều trộn với `--bg-1` theo độ mờ.

| Cặp chữ / nền | Không mờ | Trước (50 %, thẻ `--bg-2`) | **Sau (85 %, thẻ rỗng)** |
|---|---|---|---|
| Chữ phần tử (`--text`) | 13,79 | 4,43 | **11,16** |
| Bằng chứng / Mức bằng chứng (`--text-3`) | 5,61 | 2,38 | **4,81** |
| Mã F — app (`--accent`) | 8,13 | 3,01 | **6,76** |
| Mã F — mockup (`--info`) | 6,74 | 2,68 | **5,69** |
| Chip "kyc v · prompt · model · giờ" (`--text-2` / `--bg-2`, chip giữ nền) | 8,17 | 3,04 | **6,29** |
| Đề mục khối (`--heading`) | 8,94 | 3,15 | **6,76** |
| Ghi chú đề mục, nhãn nhóm, dòng "Kết quả Mock" (`--text-3`) | 6,17 | 2,49 | **4,81** |
| Badge chế độ PROFILE_DISCOVERY / PAIN_POINT_ANALYSIS (`--info`) | 7,41 | 2,80 | **5,69** |
| Cảnh báo mâu thuẫn phụ (`--text`) | 15,16 | 4,63 | **11,16** |

Thấp nhất sau sửa: **4,81:1** (≥ 4,5). Badge trong khối chỉ có màu chế độ (`gateState` của một phân tích chỉ là PROFILE_DISCOVERY / PAIN_POINT_ANALYSIS). E2E đo trên bản build web cho cùng kết quả (≥ 4,5 cả panel).

#### Ảnh trước / sau

`gh` không tải ảnh lên PR được; ảnh ghép (app 1 440: CURRENT · STALE trước · STALE sau; mockup 2h trước · sau) đã gửi Owner trong phiên. STALE sau sửa vẫn phân biệt rõ với CURRENT: thẻ phần tử viền đứt không nền (CURRENT: thẻ nổi nền `--bg-2`, viền liền), cả khối hơi mờ, cộng badge STALE và lời nhắc như cũ.

#### Lệch so với Issue / mockup — cần reviewer xem

- **Thay đổi hình thức đã duyệt G3:** ngoài độ mờ, thẻ phần tử ở trạng thái mờ đổi sang viền đứt không nền. Issue cho phép "làm mờ bằng viền / nền / nhãn, hoặc độ mờ đủ cao"; riêng độ mờ thì phải ≥ 0,86 (cặp `--text-3` / `--bg-2`) nên gần như không còn thấy mờ — kết hợp hai cách để vừa AA vừa phân biệt được. Mockup sửa cùng cách.
- **Khối AI ở chi tiết lịch hẹn:** sửa cùng cách (dùng chung `FADED`, `Item`); e2e chỉ kiểm panel Hồ sơ KH (file e2e được phép sửa chỉ có `customer-ai.spec.ts`), phần dùng chung giống hệt.

#### Test

- E2E `customer-ai.spec.ts`: 16 / 16 xanh (2 lần kiểm mới đỏ trước khi sửa).
- `pnpm verify` xanh.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #600 — T-239: Hộp lịch hẹn và HĐ: ngày qua giao thừa, case size, chênh FYP, đổi tháng, lịch hẹn tiếp (DR6-38…42)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

#### Mục tiêu

1. **Giao thừa (DR6-38):** ô ngày điền sẵn mà người dùng chưa sửa giữ đúng ngày đã lưu (hoặc điền đủ năm) ở hộp 6f (sửa kết quả), 6h (Hẹn tiếp), 8b (Phát hành), 8d (Sửa HĐ) — hộp mở trước nửa đêm 31/12 rồi lưu sau đó không còn nhảy sang năm sau; lỗi "1 ô cần sửa" luôn chỉ ra ô.
2. **Case size (DR6-39, Owner chọn §9 Q8 (a)):** "Case size dự kiến ở cuộc gặp gần nhất" chỉ lấy cuộc gặp Đã gặp gần nhất (theo ngày, giờ); cuộc đó để trống → không hiện dòng. Sửa test đang ghim hành vi cũ.
3. **Chênh FYP (DR6-40):** hộp Sửa HĐ so "khác FYP nộp" với FYP nộp **đang nhập**; dòng "Ảnh hưởng chỉ số" vẫn so với bản đã lưu.
4. **Đổi tháng (DR6-41):** sửa HĐ dời ngày phát hành / nộp sang tháng khác thì hộp hiện ảnh hưởng hai tháng (tháng cũ −X, tháng mới +X).
5. **Lịch hẹn tiếp (DR6-42):** ghi kết quả kèm "Hẹn lần tiếp theo" xong thì màn chuyển tới lịch mới như ba đường tạo lịch khác (dời lịch, tạo mới, Hẹn tiếp), báo khi lịch nằm ngoài góc nhìn (NT-LH-20).

#### Bối cảnh

Deep review lượt 1: DR6-38 (H·CL-E2, L·CX-E2, H·CX-E3), DR6-39 (L·CL-E2, L·CX-E3), DR6-40 (L·CX-E1, H·CX-E2), DR6-41 (L·MU-E1, H·MU-E3), DR6-42 (H·MU-E4). Cùng file với T-232 (hộp 6c / 6f) và T-233 (hộp 6h) nên làm sau hai Issue đó.

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.5 (DR6-38…42), §8.3 S2-G, §9 Q8
- Mockup `docs/design/mockups/appointment-forms.html` 6b, 6c, 6f, 6h; `docs/design/mockups/policy-forms.html` 8a, 8b, 8d
- `docs/testing/nghiem-thu-v1.md` NT-LH-20
- `apps/desktop/src/routes/appointments/{EditOutcomeDialog,AppointmentDialog,OutcomeDialog,AppointmentsScreen}.tsx`, `appointment-form.ts`
- `apps/desktop/src/routes/customers/{PolicyDialogs.tsx,policy-form.ts}`

#### File / thư mục được phép sửa

- `apps/desktop/src/routes/appointments/{EditOutcomeDialog,AppointmentDialog,OutcomeDialog,AppointmentsScreen}.tsx`, `apps/desktop/src/routes/appointments/appointment-form.ts` (+ test)
- `apps/desktop/src/routes/customers/PolicyDialogs.tsx`, `apps/desktop/src/routes/customers/policy-form.ts` (+ test)
- `apps/desktop/src/i18n/vi.ts`
- `e2e/appointments.spec.ts`, `e2e/appointment-outcome.spec.ts`, `e2e/customer-policies.spec.ts`

#### Interface / hợp đồng

- `issuedChange` (hoặc hàm mới) trả ảnh hưởng cho cả hai tháng khi tháng đổi.

#### Test chấp nhận

- [ ] Unit: đọc lại chữ ngày điền sẵn với `today` của năm sau giữ nguyên ngày đã lưu (6f, 6h, 8b, 8d).
- [ ] Unit `policy-form`: case size của cuộc gặp gần nhất trống → không có dòng; chênh FYP theo ô đang nhập; đổi tháng → hai dòng ảnh hưởng.
- [ ] e2e: ghi kết quả kèm lịch tiếp theo ở tháng sau → màn chuyển tới lịch đó.

Ước lượng: ≈ 70 dòng SP + ≈ 180 dòng test.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:low

#### Bị chặn bởi

#593, #594

## PR #634 — fix: prefilled days across New Year, case size, policy effects per month, show the next appointment (T-239)

Trạng thái: MERGED · merge 2026-10-16T06:35:09Z · commit `ffc1db7fd4f93aba5909de7aa8171eac84ecc20c` · nhánh `task/T-239-dialog-dates-effects`

Closes #600 (T-239). Deep review lượt 1: DR6-38…42 (nhóm S2-G), DR6-39 theo Owner chọn §9 Q8 (a).

#### Đã làm

1. **Ngày điền sẵn qua giao thừa (DR6-38).** `appointment-form.ts`: `Prefill { text, on }` + `prefill(date, today)`; `readScheduleDate(text, today, mode, filled?)` đọc chữ **còn y như lúc điền** theo ngày mở hộp (`filled.on`), còn số ngày tới / kiểm "đã qua" vẫn theo `today` hiện tại. `policy-form.ts`: `openDraft(mode, today)` (chuyển từ `draftOf` của `PolicyDialogs.tsx`) trả `{ draft, on }`; `readPolicy(draft, today, opened?)` đọc ô ngày chưa sửa theo `opened.on`. Áp cho 6f (`EditOutcomeDialog`), 6h (`AppointmentDialog` có `from`), 8a / 8b / 8d (`PolicyDialog`).
   - Hộp mở 31/12/2026, lưu sau nửa đêm: 6f giữ ngày đã lưu; 6h báo "31/12/2026 đã qua" thay vì tạo lịch 31/12/2027; 8b không còn lỗi ở ô Ngày nộp ẩn ("1 ô cần sửa" không chỉ ra ô) và phát hành đúng 31/12/2026.
   - Không chọn cách "điền đủ năm": mockup 6h điền `dd/mm` và gợi ý "Ý anh là 20/06/2027?" — gợi ý năm sau chỉ có khi chữ không ghi năm. Chữ trong ô giữ nguyên như trước, e2e không đổi.
2. **Case size (DR6-39, Q8 (a)).** `expectedCaseSize` lấy cuộc gặp Đã gặp gần nhất (ngày, rồi giờ; trùng thì cuộc tạo sau); cuộc đó để trống → `null` → không hiện dòng. Test ghim hành vi cũ đã sửa.
3. **Chênh FYP theo ô đang nhập (DR6-40).** `policyChange(saved, read)` (thay `issuedChange`) trả `fromSubmitted` = FYP phát hành **đang nhập** − FYP nộp **đang nhập** (null khi một trong hai chưa đọc được).
4. **Đổi tháng (DR6-41).** `policyChange(...).effects`: mỗi chỉ số (FYP nộp theo ngày nộp, FYP phát hành theo ngày phát hành) cùng tháng → một dòng chênh; khác tháng → tháng cũ −X rồi tháng mới +Y. Hộp 8d hiện mọi dòng dưới "Ảnh hưởng chỉ số" (`dd` chứa các dòng). Chuỗi `policyForm.effect*` thành `{label} tháng {month} …` với `policyForm.metric.submitted` = "FYP nộp", `policyForm.metric.issued` = "FYP phát hành" (slot `{label}` có sẵn trong `PLAIN_SLOTS`, không phải sửa `i18n/index.ts`).
5. **Lịch hẹn tiếp (DR6-42).** `OutcomeDialog`: ghi kết quả kèm "Hẹn lần tiếp theo" gọi `onShow(next)` (prop `onMoved` đổi tên `onShow` vì nay nhận cả lịch dời lẫn lịch tiếp theo) → màn nhảy tới kỳ / ngày của lịch mới, chọn nó, xóa lọc phối hợp che khuất, báo khi ngoài góc nhìn (cùng `show` như ba đường kia, NT-LH-20).

#### Lệch so với Issue / mockup — cần reviewer xem

- **Dòng "FYP nộp" ở "Ảnh hưởng chỉ số":** Issue nói "dời ngày phát hành / nộp sang tháng khác"; dời ngày nộp chỉ đổi FYP nộp (case size), nên thêm dòng "FYP nộp tháng …" cùng mẫu câu với dòng FYP phát hành của mockup 8d. Vì tính chung theo tháng, sửa FYP nộp trong cùng tháng cũng hiện một dòng "FYP nộp … tăng / giảm" (trước đây không hiện gì); sửa HĐ chưa phát hành cũng hiện dòng FYP nộp. Mockup 8d (chỉ sửa FYP phát hành) hiện đúng một dòng như cũ.
- **Dòng ảnh hưởng chỉ hiện khi mọi ô đọc được** (`read.policy`), tức là khi lưu được; trước đây dòng FYP phát hành vẫn hiện khi ô Ngày nộp sai.
- **8a cũng giữ ngày điền sẵn** (ngày nộp = hôm nay lúc mở hộp) dù Issue chỉ nêu 6f, 6h, 8b, 8d — cùng cơ chế.
- **Đếm "n ô cần sửa" ở 8b** vẫn tính hai ô nộp ẩn; nguyên nhân (ô ngày nộp ẩn trôi sang năm sau) đã hết nên hai ô này không còn sai được.
- `PolicyMode` chuyển sang `policy-form.ts`, `PolicyDialogs.tsx` export lại (`CustomerProfile.tsx` không đổi).
- Sau "Lưu kết quả + tạo lịch", bảng chi tiết chuyển sang **lịch mới** (trước đây vẫn ở lịch cũ); e2e cũ ghim hành vi cũ ("Kỳ sau" rồi tự tìm) đã sửa.

#### Test

- Unit `appointment-form.test.ts`: 4 ca qua giao thừa (6f `any`, 6h `fromToday` báo đã qua, 6h vẫn gợi ý năm sau khi lâu ngày, chữ gõ đè đọc theo hôm nay).
- Unit `policy-form.test.ts`: `openDraft` + `readPolicy` qua giao thừa (8b, 8d, 8a, chữ gõ đè); `policyChange` (chênh FYP theo ô đang nhập, cùng tháng, không đổi / ô sai, dời tháng nộp / phát hành, cùng tháng khác năm, HĐ chưa phát hành); `effectText` hai chỉ số; `expectedCaseSize` theo Q8 (a). Đỏ trước khi sửa (14 ca).
- E2E `appointment-outcome.spec.ts`: ghi Không đến kèm lịch 01/10 → màn sang "Lịch tháng 10/2026", "Trong ngày 01/10/2026", chi tiết là lịch mới; lịch cũ vẫn Không đến + ghi chú. `customer-policies.spec.ts` (8d): dời ngày nộp 25/8, FYP nộp 390tr, ngày phát hành 31/8 → "khác FYP nộp −4,5 tr" và bốn dòng ảnh hưởng (09 giảm / 08 tăng cho từng chỉ số). Ba spec `appointment-outcome`, `appointments`, `customer-policies`: 49 / 49 xanh.
- Đã xem ảnh hộp 8d với bốn dòng ảnh hưởng (bản build web): dòng xếp dọc trong cột `dd`, không tràn.
- `pnpm verify` xanh.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #601 — T-240: Thùng rác và Cài đặt → Dữ liệu: chỉ mục `customer_id`, sắp cột, nhãn nút, sang ngày, thông báo (DR6-43…45)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

#### Mục tiêu

1. **Hiệu năng (DR6-44):** `listTrash` không quét toàn bảng cho từng KH đã xóa: thêm chỉ mục `appointments(customer_id)`, `policies(customer_id)` (migration mới, test mở DB cũ có dữ liệu), hoặc đếm một lượt `GROUP BY` — chọn trong PR theo số đo. Hồ sơ KH và hộp 5f cũng nhanh hơn.
2. **Bảng Thùng rác (DR6-43):** cột "Bản ghi" không sắp theo chữ `dd/mm/yyyy` (tắt sắp, hoặc giá trị sắp theo loại); nút "Khôi phục…" có `aria-label` nêu bản ghi, `aria-describedby` trỏ dòng lý do khi bị chặn; cột nút có tiêu đề ẩn; danh sách tính lại khi sang ngày mới (TR-5, theo `useToday`).
3. **Cài đặt → Dữ liệu (DR6-45):** một thông báo thành công chung cho mục Dữ liệu — lần thay dữ liệu sau xóa thông báo của lần trước.

#### Bối cảnh

Deep review lượt 1: DR6-44 (L·CL-A2, H·CL-A1: 75–100 KH đã xóa → ≈ 200 ms; chỉ mục 389 → 36 ms), DR6-43 (L·CL-E3, H·CL-E3, H·CX-E1), DR6-45 (H·CL-E7). Cùng `trash.ts` với T-231 nên làm sau. KNOWN #539 (`refs` đọc cả bảng) giữ nguyên.

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.5 (DR6-43…45), §7.1, §8.3 S2-H
- `docs/design/phase-6-hoan-thien.md` §4.2 (TR-5, TR-6, màn Thùng rác); mockup `docs/design/mockups/trash.html`, `docs/design/mockups/settings-data.html`
- `packages/db/CLAUDE.md` (migration); `packages/db/src/schema.ts`, `trash.ts`, `counts.ts`, `database.test.ts` ("migrating a saved database")
- `apps/desktop/src/routes/SettingsTrash.tsx`, `trash-view.ts`, `Settings.tsx`, `SettingsBackup.tsx`; `apps/desktop/src/data/AppDataContext.tsx` (`useQuery`, `useToday`)
- `docs/state/review-notes.md` mục #539

#### File / thư mục được phép sửa

- `packages/db/src/{schema,trash,counts,migrations}.ts`, `packages/db/migrations/**` (sinh bằng `pnpm db:generate`) và test cạnh chúng
- `apps/desktop/src/routes/{SettingsTrash,Settings,SettingsBackup}.tsx`, `apps/desktop/src/routes/trash-view.ts` (+ test)
- `apps/desktop/src/i18n/vi.ts`
- `e2e/trash.spec.ts`, `e2e/backup.spec.ts`, `e2e/demo-data.spec.ts`

#### Interface / hợp đồng

- Không đổi `listTrash` / `countCustomerRecords` (chỉ nhanh hơn).

#### Test chấp nhận

- [ ] Số đo trong PR (Node, dữ liệu tải + xóa thêm 150 KH): `listTrash` trước / sau; sau < 100 ms.
- [ ] Migration mở được DB cũ có dữ liệu; `trash.test.ts`, `counts.test.ts` xanh.
- [ ] e2e Thùng rác: nút khôi phục tìm được theo tên bản ghi; cột "Bản ghi" không còn sắp theo chữ.
- [ ] `trash-view` / màn: bản ghi TR-5 hết bị chặn khi sang ngày của nó mà không cần lệnh ghi khác.
- [ ] e2e: Nạp lại rồi Nhập backup → chỉ còn thông báo của lần nhập.

Ước lượng: ≈ 45 dòng SP + migration sinh tự động + ≈ 150 dòng test.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:med

#### Bị chặn bởi

#592

## PR #630 — fix: index customer and appointment lookups, name the restore buttons, one notice for Data (T-240)

Trạng thái: MERGED · merge 2026-10-16T00:14:56Z · commit `43e66960de708af591a58a293e480da2bd1f4f90` · nhánh `task/T-240-trash-index-a11y`

Closes #601 (T-240, DR6-43…45; deep review Phase 1–6 lượt 1, nhóm S2-H).

#### Thay đổi

**DR6-44 — `listTrash` không quét toàn bảng cho từng bản ghi đã xóa.** Migration `0009_lookup_indexes` (drizzle-kit sinh, chỉ 3 câu `CREATE INDEX`, không dựng lại bảng):

- `appointments(customer_id)`, `policies(customer_id)`: `countCustomerRecords` (Thùng rác, hồ sơ KH, hộp 5f) đếm theo KH.
- `stage_transitions(appointment_id)`: `transitionWithdrawnAt` / `withdrawAppointmentTransition` tìm chuyển nhóm của một lịch hẹn (mỗi lịch đã xóa trong Thùng rác, mỗi lần xóa / sửa kết quả lịch hẹn).

Chọn chỉ mục thay vì đếm một lượt `GROUP BY`: không đổi `listTrash` / `countCustomerRecords`, và làm nhanh cả hồ sơ KH, hộp 5f, xóa lịch hẹn; `GROUP BY` chỉ giúp `listTrash`. Chỉ mục thứ ba thêm theo số đo (bảng dưới).

**DR6-43 — bảng Thùng rác.**

- Cột "Bản ghi" không sắp nữa (tên và ngày `dd/mm/yyyy` lẫn nhau, không thứ tự nào đúng cho cả hai).
- Nút "Khôi phục…" có `aria-label` nêu bản ghi (`restoreLabel`: "Khôi phục KH …", "Khôi phục lịch hẹn 15/09/2026 của KH …", "Khôi phục HĐ nộp … của KH …", "Khôi phục nhân sự / team …"); nút bị chặn có `aria-describedby` trỏ dòng lý do.
- Cột nút có tiêu đề "Thao tác" chỉ cho trình đọc màn hình (mockup 11a: cột trống).
- Màn đọc lại `listTrash` khi sang ngày mới (`useToday`): bản ghi TR-5 hết bị chặn đúng ngày của nó, không cần lệnh ghi khác (H·CX-E1).

**DR6-45 — Cài đặt → Dữ liệu một thông báo chung.** Mục Dữ liệu chỉ hiện thông báo của lần xuất / nhập / nạp lại sau cùng; lần thay dữ liệu sau xóa thông báo của lần trước.

#### Số đo (test chấp nhận 1)

Node 24, laptop `D13_THINKPAD`. Dữ liệu tải sinh ở `main` hiện tại (`node tools/load-data.mjs`, mốc 2026-10-12, seed 6, `tables` sha256 `1c306cfb…9591`), nhập bằng `importBackup`, xóa thêm 150 KH bằng `softDeleteCustomer` → 165 KH đã xóa, Thùng rác 263 dòng. `listTrash`: 2 lượt khởi động, 9 lượt đo.

| | Trung vị | Min–max |
|---|---|---|
| Trước (`main` `1841ca4`) | **378 ms** | 375,6–383,6 |
| Chỉ `appointments` + `policies(customer_id)` | 56,7 ms | 55,1–59,6 |
| Sau (cả 3 chỉ mục, PR này) | **32,5 ms** | 31,8–36,0 |

Ngưỡng Issue: sau < 100 ms ✅.

Ảnh hưởng phụ (cùng máy, cùng file):

- `importBackup` (5 lượt): file v9 768 → 772 ms; file xuất lại ở v10 752 → 800 ms. Ngưỡng ≤ 1 100 ms.
- Cỡ file DB (`db.export()`): 12,84 → 13,37 MB (+0,53 MB, ≈ +4 %); `db.save` tuyến tính theo cỡ file → ước + 6 ms trên nền 162 ms (ngưỡng ≤ 400 ms).

#### Ngoài danh sách file của Issue

- `packages/ui/src/components/DataTable.tsx`: prop `headerHidden` (tiêu đề cột chỉ cho trình đọc màn hình) — **Owner đồng ý trong phiên** (Issue yêu cầu "cột nút có tiêu đề ẩn" nhưng `DataTable` chỉ in `header` ra chữ).
- `packages/db/src/database.test.ts`: test mở DB cũ (v9) có dữ liệu → v10, giữ nguyên dòng, truy vấn dùng chỉ mục — Issue trỏ tới đây ("migrating a saved database").
- `packages/db/src/ai-analyses.test.ts`: test migration `ai_analyses` gỡ các migration AI khỏi DB đã seed rồi chạy lại; nay phải gỡ cả 3 chỉ mục mới (nếu không, `schemaVersion` vẫn là 10 và migration không chạy lại). Hệ quả bắt buộc của migration mới.
- `e2e/full-cycle.spec.ts`: một dòng chọn nút theo tên mới "Khôi phục KH …" (tên cũ "Khôi phục…" hết khớp vì `aria-label`).

#### Test chấp nhận

- [x] Số đo trong PR: `listTrash` 378 → 32,5 ms (< 100 ms).
- [x] Migration mở được DB cũ có dữ liệu (`database.test.ts` "adds the lookups of a customer and an appointment…"); `trash.test.ts`, `counts.test.ts` xanh.
- [x] e2e Thùng rác: nút khôi phục tìm theo tên bản ghi (`trash.spec.ts`, `full-cycle.spec.ts`), nút bị chặn đọc kèm lý do; cột "Bản ghi" không có nút sắp / `aria-sort`; cột nút có tiêu đề ẩn "Thao tác".
- [x] Màn: bản ghi TR-5 hết bị chặn khi sang ngày của nó (e2e `page.clock`, HĐ nộp ngày mai từ file nhập; trước khi sửa: nút vẫn tắt sau nửa đêm).
- [x] e2e: Nạp lại rồi Nhập backup → chỉ còn thông báo của lần nhập (`backup.spec.ts`).
- [x] `pnpm verify` xanh; `pnpm e2e` xanh.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #602 — T-241: Team và Khách hàng: người đánh giá trong hộp Xóa nhân sự, KH ngoài góc nhìn, bảng Team, lỗi form (DR6-26, 31, 32, 33)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

#### Mục tiêu

1. **Hộp 9b (DR6-26):** đếm cả lịch hẹn mà nhân sự là **người đánh giá kết quả**; có thì tắt Xóa và hiện dòng "n lịch hẹn là người đánh giá kết quả"; câu hướng dẫn của người phối hợp / người đánh giá là câu riêng (bỏ họ khỏi các lịch đó trước), không dùng câu của RE.
2. **KH ngoài góc nhìn (DR6-31):** tạo KH cho RE nằm ngoài góc nhìn đang chọn → dòng `role="status"` báo đã tạo và nằm ngoài góc nhìn, kèm link mở hồ sơ (như NT-LH-20 của Lịch hẹn); ô "RE phụ trách" điền sẵn RE của góc nhìn khi góc nhìn là một RE.
3. **Bảng Team (DR6-32):** đổi team đưa bảng về 100 dòng (`resetKey`), như các bảng khác (mockup `table-more.html`).
4. **Lỗi form (DR6-33):** ô Ngày của hộp Ghi chú KYC chỉ báo lỗi sau khi bấm Lưu, như hộp KH; đổi Giới tính ở hộp Sửa hồ sơ xóa câu lỗi lưu cũ; hộp Ghi chú KYC xóa lỗi lưu khi sửa ghi chú / ngày; hộp Xóa team / nhân sự không khóa nút với lỗi thử lại được (khóa ghi S2-2).

#### Bối cảnh

Deep review lượt 1: DR6-26 (L·CL-D1, H·CL-D1, L·CX-D1, H·CX-D2), DR6-31 (L·CL-D4), DR6-32 (H·CX-D3), DR6-33 (L·MU-D2, L·MU-D3, H·CL-D6). Cùng `KycDialogs.tsx` với T-236 nên làm sau.

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.4 (DR6-26, 31, 32, 33), §8.3 S2-I
- Mockup `docs/design/mockups/team.html` 9b; `docs/design/mockups/phase-3-feedback.html` B1; `docs/design/mockups/customer-forms.html` 5a, 5b, 5c; `docs/design/mockups/kyc-forms.html` 7a; `docs/design/mockups/table-more.html`
- `docs/testing/nghiem-thu-v1.md` NT-TM-14, NT-LH-20
- `packages/db/src/team.ts` (`isPersonInUse`)
- `apps/desktop/src/routes/team/{team-view.ts,PersonDialogs.tsx,TeamDialogs.tsx,TeamScreen.tsx}`
- `apps/desktop/src/routes/customers/{CustomersScreen,CustomerDialogs,KycDialogs}.tsx`

#### File / thư mục được phép sửa

- `apps/desktop/src/routes/team/{team-view.ts,PersonDialogs.tsx,TeamDialogs.tsx,TeamScreen.tsx}` (+ test)
- `apps/desktop/src/routes/customers/{CustomersScreen,CustomerDialogs,KycDialogs}.tsx`, `apps/desktop/src/routes/customers/customers-view.ts` (+ test)
- `apps/desktop/src/i18n/vi.ts`
- `e2e/team.spec.ts`, `e2e/customers.spec.ts`, `e2e/customer-forms.spec.ts`, `e2e/customer-kyc.spec.ts`

#### Interface / hợp đồng

- `PersonUsage` / `StaffRecords` thêm số lịch đang đánh giá.

#### Test chấp nhận

- [ ] `team-view.test.ts`: IS chỉ là người đánh giá → `personUsage` có số đánh giá > 0; e2e hộp 9b tắt Xóa và nói đúng lý do.
- [ ] e2e: góc nhìn một RE, tạo KH cho RE khác → có dòng báo kèm link; ô RE điền sẵn RE của góc nhìn.
- [ ] e2e hoặc unit: hai team > 100 RE, "Hiện thêm" ở team A rồi chọn team B → 100 dòng.
- [ ] e2e: gõ dở ô Ngày của 7a không báo đỏ; Lưu với ngày sai thì báo.

Ước lượng: ≈ 50 dòng SP + ≈ 150 dòng test.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:low

#### Bị chặn bởi

#597

## PR #636 — fix: 9b counts outcome reviewers, a customer outside the scope is said so, team table resets, 7a day checked on save (T-241)

Trạng thái: MERGED · merge 2026-10-16T13:26:54Z · commit `ba3ca2d29121390f029c24b3626c35be1ff943fb` · nhánh `task/T-241-team-customers`

Closes #602 (T-241). Deep review lượt 1: DR6-26, 31, 32, 33 (nhóm S2-I).

#### Đã làm

1. **Hộp 9b đếm người đánh giá kết quả (DR6-26).** `StaffRecords.appointments` mang thêm `outcomeReviewerId` (lấy `Pick` từ `AppointmentRecord` của `@p2c/db`, bảng `tables` đã có sẵn trường này); `PersonUsage.reviewing` = số lịch chưa xóa mà người đó là người đánh giá — cùng luật `reviewsLiveAppointment` của `softDeletePerson`. Hộp 9b: có người đánh giá thì tắt Xóa, dòng mới "n lịch hẹn là người đánh giá kết quả". Câu hướng dẫn tách hai: câu của RE (`person.inUseHelp`) chỉ hiện khi còn KH / lịch / HĐ ghi cho RE; vướng phối hợp / đánh giá thì câu mới `person.inUseSupportHelp` "Bỏ nhân sự này khỏi người phối hợp và người đánh giá kết quả của các lịch đó trước, hoặc giữ lại thay vì xóa."
2. **Tạo KH ngoài góc nhìn (DR6-31).** `CustomerFormDialog` nhận `defaultReId` + `onCreated`. Màn Khách hàng: góc nhìn là một RE (kể cả RE chọn ở dải RE của Team) → ô "RE phụ trách" điền sẵn RE đó; KH vừa tạo có RE ngoài góc nhìn → dòng `role="status"` "Đã tạo KH {tên} cho {RE}. RE này nằm ngoài góc nhìn hiện tại nên KH không hiện ở đây; đổi góc nhìn để xem." kèm link "Hồ sơ KH →" (như NT-LH-20). Dòng chỉ đứng khi góc nhìn còn là góc nhìn lúc tạo (so `JSON.stringify(scope)`, cùng khóa `resetKey` của bảng): đổi góc nhìn là mất.
3. **Bảng Team về 100 dòng khi đổi team (DR6-32).** `resetKey={entry.team.id}` cho `DataTable` của bảng thành viên, như ba bảng kia (mockup `table-more.html`).
4. **Lỗi form (DR6-33).**
   - 7a: ô Ngày ghi nhận chỉ báo lỗi sau khi bấm Lưu (`errors.date`), gõ lại thì mất tới lần Lưu kế — như 5a / 5b. Chọn lại Trường không xóa lỗi của ô Ghi chú / Ngày (trước đây xóa mọi lỗi; nay lỗi Ngày có trạng thái riêng nên phải giữ).
   - 7a: sửa Ghi chú / Ngày xóa câu lỗi lưu (`errors.form`).
   - 5c: đổi Giới tính xóa câu lỗi lưu (`edit('form', setGender)`).
   - Hộp Xóa team / Xóa nhân sự: nút Xóa chỉ khóa với lỗi không bấm lại được; lỗi khóa ghi S2-2 (`DATA_REPLACING`, câu dặn "thử lại khi xong") để nút bật (`retriesDelete` ở `team-view.ts`), như hộp Xóa KH.

#### Lệch so với Issue / mockup — cần reviewer xem

- **Mockup 9b** chỉ có dòng "người phối hợp"; dòng "n lịch hẹn là người đánh giá kết quả" và câu hướng dẫn riêng cho người hỗ trợ là theo Issue (DR6-26, Owner đồng ý §9 ngày 15/10), không sửa mockup.
- **Lỗi lưu của 7a (`errors.form`) và lỗi khóa ghi S2-2 ở hai hộp Xóa không có e2e:** chỉ tới được khi đang Nạp lại / Nhập backup, mà hộp đó là modal nên không thao tác hộp khác được (DR6-33 §4.3: "gần như không tới được"). Phần hộp Xóa có unit `retriesDelete`; e2e "refuses to delete a team that still has people" thêm kiểm nút Xóa vẫn khóa sau `TEAM_HAS_MEMBERS`.
- **Không thêm dòng nghiệm thu** cho dòng báo KH ngoài góc nhìn (`docs/testing/` ngoài file được sửa); ghi để phiên tổng hợp / lượt 2 cân nhắc thêm "NT-KH-…" như NT-LH-20.

#### Test

- Unit `team-view.test.ts`: IS chỉ là người đánh giá → `reviewing: 2`, mọi số khác 0; TL vừa phối hợp vừa đánh giá; `retriesDelete` (`DATA_REPLACING` có, `TEAM_HAS_MEMBERS` / `PERSON_IN_USE` / lỗi lạ không). Đỏ trước khi sửa.
- E2E `team.spec.ts`:
  - IS mới làm người đánh giá một cuộc gặp Đã gặp hôm nay → hộp 9b "Chưa xóa được — IS còn dữ liệu", "1 lịch hẹn là người đánh giá kết quả", không nhắc người phối hợp, câu hướng dẫn của người hỗ trợ, không có câu của RE, Xóa tắt. Hai ca 9b cũ thêm kiểm câu hướng dẫn đúng vai (RE / IS phối hợp).
  - Nhập backup có thêm 101 RE vào Bình Minh và Sao Mai (111 mỗi team): Bình Minh 100 dòng → "Hiện thêm 11 người" → 111; chọn Sao Mai → 100 dòng, "Đang hiện 100 / 111 người".
- E2E `customer-forms.spec.ts`: góc nhìn một RE, ô RE điền sẵn RE đó; tạo KH cho RE khác → dòng báo đúng câu, số "KH đang mở" không đổi, link mở hồ sơ KH. Ca tạo KH cũ: RE điền sẵn, không có dòng "ngoài góc nhìn". Sửa hồ sơ: chọn "Chưa rõ" → Lưu → lỗi → chọn lại "Nữ" → hết lỗi.
- E2E `customer-kyc.spec.ts`: 7a gõ dở `3` / xóa trắng ô Ngày không đỏ; Lưu với `3` → `aria-invalid` + "Gõ dd/mm hoặc dd/mm/yyyy."; gõ `14/9` → hết đỏ, đọc lại "Thứ Hai 14/09/2026", lưu được.
- `pnpm verify` xanh; e2e toàn bộ trên máy: 221 / 221 xanh. Ca "changing the RE hands the planned appointments over…" đỏ một lần ở một lượt chạy giữa chừng (lúc `CustomersScreen.tsx` chưa sửa xong); chạy lại `--repeat-each=5` 5 / 5 xanh và xanh trong lượt toàn bộ.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #603 — T-242: Điều hướng và trợ năng: chặn Back trên exe, focus khi đổi màn, focus sau nút tự gỡ (DR6-20, 34, 35)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

#### Mục tiêu

1. **Back / Forward trên exe (DR6-34):** như chặn tải lại (DR-60), exe chặn lùi / tiến lịch sử: phím BrowserBack / BrowserForward, Alt+← / Alt+→, nút chuột 4 / 5 — để không mất bản nháp của hộp đang mở và không về được màn cũ trong lúc Nạp lại / Nhập (đóng đường vào của DR6-15).
2. **Đổi màn (DR6-35):** khi route đổi (không phải lần đầu), focus `h1` của màn (`tabIndex={-1}`, không cuộn) và `document.title` = tên màn + tên app; về lại Khách hàng từ hồ sơ thì focus thẻ / dòng của KH vừa xem nếu có.
3. **Nút tự gỡ (DR6-35, DR6-20):** sau "Hiện thêm" lần cuối, "+ n KH · xem dạng bảng", Hủy / Thử lại của AI trích xuất: focus tới một điểm ổn định gần đó (dòng "Đã hiện hết", bảng, ghi chú đang trích xuất), không rơi về `body`.

#### Bối cảnh

Deep review lượt 1: DR6-34 (H·CL-D5), DR6-35 (H·CL-D10, H·MU-D3, H·MU-D2), DR6-20 (L·CX-C4). Vitest không có DOM (thêm jsdom là G4) → giữ bằng e2e (chế độ `asExe` cho mục 1).

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.3 (DR6-20), §5.4 (DR6-34, 35), §4.5, §8.3 S2-J
- `docs/state/review-notes.md` (DR-60 chặn tải lại)
- `apps/desktop/src/shell/{block-reload.ts,useRoute.ts,AppShell.tsx}`, `apps/desktop/src/main.tsx`
- `packages/ui/src/components/DataTable.tsx`; `apps/desktop/src/routes/customers/{CustomersScreen,KycExtraction}.tsx`
- `e2e/support.ts` (chế độ `asExe`), `e2e/navigation.spec.ts`, `e2e/dialog-keyboard.spec.ts`

#### File / thư mục được phép sửa

- `apps/desktop/src/shell/{block-reload.ts,useRoute.ts,AppShell.tsx}` (+ test)
- `packages/ui/src/components/DataTable.tsx` (+ test)
- `apps/desktop/src/routes/customers/{CustomersScreen,KycExtraction}.tsx`
- `apps/desktop/src/i18n/vi.ts`
- `e2e/navigation.spec.ts`, `e2e/dialog-keyboard.spec.ts`, `e2e/data-table.spec.ts`, `e2e/customer-ai.spec.ts`

#### Interface / hợp đồng

- Không đổi.

#### Test chấp nhận

- [ ] e2e `asExe`: mở hộp 7a, gõ chữ, Alt+← và nút chuột 4 → hộp vẫn mở, chữ còn; F5 vẫn bị chặn như cũ.
- [ ] e2e: bấm thẻ KH → `h1` của hồ sơ có focus, `document.title` đổi; sidebar → màn khác cũng vậy.
- [ ] e2e: "Hiện thêm" lần cuối, "+ n KH", Hủy / Thử lại trích xuất → `document.activeElement` không phải `body`.
- [ ] `block-reload.test.ts`: lắng nghe ở pha capture (kiểm tham số `addEventListener`).

Ước lượng: ≈ 40 dòng SP + ≈ 120 dòng test.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:low

#### Bị chặn bởi

Không (bắt đầu sau khi PR #591 merge)

## PR #638 — fix: block Back and Forward on the exe, focus the new screen and a stable point after self-removing buttons (T-242)

Trạng thái: MERGED · merge 2026-10-16T14:14:25Z · commit `e8d340af14636c09a8626a8ac1b7d919c4e9dd4d` · nhánh `task/T-242-navigation-focus`

Closes #603 (T-242) — DR6-20, DR6-34, DR6-35 (deep review lượt 1, nhóm S2-J).

#### Thay đổi

1. **Chặn Back / Forward trên exe (DR6-34)** — `block-reload.ts`: cùng chỗ chặn F5 (DR-60), `keydown` chặn thêm `BrowserBack` / `BrowserForward`, Alt+← / Alt+→ (trừ Ctrl+Alt = AltGr); listener mới `mouseup` chặn nút chuột 4 / 5 (`button` 3 / 4). Cả ba listener ở pha capture. Đóng luôn đường vào của DR6-15 (lùi màn trong lúc Nạp lại / Nhập).
2. **Đổi màn (DR6-35)** — `AppShell.tsx` (`useScreenFocus`): `document.title` = "tên màn · Project-2C"; route đổi (không phải lần mở app) → focus `h1` (`tabIndex={-1}`, `preventScroll`); về Khách hàng từ hồ sơ → focus thẻ / dòng của KH vừa xem nếu đang hiện, không thì `h1`.
3. **Nút tự gỡ (DR6-35, DR6-20)**:
   - `DataTable`: "Hiện thêm" lần cuối → focus dòng "Đã hiện hết …" (`tabIndex={-1}`); prop `ref` mới cho bảng (có `ref` thì bảng `tabIndex={-1}`).
   - `CustomersScreen`: "+ n KH · xem dạng bảng" → focus bảng vừa mở.
   - `KycExtraction`: Hủy / Thử lại → nút AI trích xuất của ghi chú, hoặc chữ của ghi chú (`tabIndex={-1}`) khi nút đang tắt vì có yêu cầu chạy — cùng cách panel làm (R2-05). Đường focus sẵn có (`focusTo`) bỏ qua nút đang tắt, rơi về chữ ghi chú.

Không đổi interface / dữ liệu; không chuỗi i18n mới (`app.title`, `joinParts` sẵn có).

#### Test

- `block-reload.test.ts`: lắng nghe ở pha capture (kiểm tham số `addEventListener`); phím Back / Forward, Alt+← / →; nút chuột 3 / 4 chặn, 0 / 1 / 2 không; mũi tên thường, Ctrl+←, Ctrl+Alt+← không chặn.
- e2e `navigation.spec.ts`:
  - `asExe`: hộp 7a đang gõ → Alt+←, Alt+→, F5 đều bị trang chặn (đọc `defaultPrevented` sau mọi listener); nút chuột Back (gửi qua CDP như WebView2 nhận) → không đổi màn trong 1 s, hộp còn, chữ còn; nút Forward trên hộp 5a cũng vậy.
  - Bấm thẻ KH (Enter) → `h1` hồ sơ có focus, title đổi; "← Khách hàng" → thẻ KH đó có focus; sidebar → `h1` "Báo cáo" có focus; mở app không lấy focus.
- e2e `data-table.spec.ts`: "Hiện thêm" cuối → "Đã hiện hết …" có focus; "+ n KH" (bàn phím) → bảng Khách hàng có focus.
- e2e `customer-ai.spec.ts`: bàn phím, Hủy và Thử lại của AI trích xuất → chữ ghi chú có focus (cả sau khi yêu cầu kết thúc).
- Đỏ trước khi sửa: cả 5 ca e2e mới + 3 ca unit. Thử tắt từng phần sửa (focus dòng "Đã hiện hết"; chặn nút 4; chặn nút 5) → ca tương ứng đỏ đúng dòng.

`pnpm verify` xanh; `pnpm e2e` toàn bộ trên máy: 225 / 225 pass.

#### Giới hạn đã biết

- Playwright gửi Alt+← vào Edge không làm trang lùi kể cả khi không chặn (phím tắt do khung trình duyệt xử lý), nên e2e kiểm phím bằng `defaultPrevented`; nút chuột Back / Forward thì kiểm được thật (Edge lùi trang khi không chặn). **Chưa thử trên exe thật với chuột 5 nút / phím Back của bàn phím** — WebView2 cùng engine với Edge; nên thử tay ở G7.
- Exe: thanh tiêu đề cửa sổ vẫn "Project-2C" — Tauri 2 không tự đồng bộ `document.title` (chỉ có `on_document_title_changed` phía Rust, ngoài phạm vi Issue); `document.title` vẫn là tên tài liệu cho trình đọc màn hình.
- Về Khách hàng: màn mở lại ở Kanban (như trước), nên KH ngoài 6 thẻ đầu của cột / 5 tên đầu của khối đóng → focus `h1`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #604 — T-243: Chữ và nhập backup: khoảng trắng / ký tự vô hình, mâu thuẫn trùng giá trị, enum, CHECK nhân sự (DR6-49…52)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

#### Mục tiêu

1. **Chữ (DR6-49):** `cleanText` gộp mọi khoảng trắng Unicode (gồm NBSP) thành một dấu cách, bỏ ký tự định dạng vô hình (`\p{Cf}`: U+200B, U+2060…) trước khi trim, và từ chối chuỗi UTF-16 hỏng (`INVALID_TEXT` hoặc mã có sẵn); áp cho tên team / nhân sự / KH, ghi chú và giá trị KYC — ở lệnh và ở kiểm nhập backup (cùng hàm). Ô chữ của UI kiểm "rỗng" theo cùng luật. Dữ liệu cũ: Owner nạp lại (K1).
2. **Mâu thuẫn trùng (DR6-50):** luật 7 của nhập backup từ chối nhóm dữ kiện `conflict` mà các giá trị (đã chuẩn hóa) không khác nhau, như `markConflict`.
3. **Enum (DR6-51):** lệnh kiểm giới tính, vai trò, nhóm, "nhóm sau" thuộc tập hợp lệ và ném mã có sẵn (như `INVALID_STATUS`), không để lộ lỗi `CHECK constraint` thô.
4. **CHECK nhân sự (DR6-52):** ràng buộc `people` thêm vế "IS / BD / BDM không có team" (migration; dữ liệu hiện có đều đúng).
5. **Comment trái DR-47 (DR6-54, phần code):** `model.ts` ("or other RE"), `appointment-counts.ts` ("coordinators, even RE"), JSDoc thừa ở `seed.ts`.

#### Bối cảnh

Deep review lượt 1: DR6-49 (H·CL-A3, A6), DR6-50 (L·CX-A1, H·CX-A1), DR6-51 (L·MU-A1, H·MU-A2), DR6-52 (H·MU-A3), DR6-54 (L·CL-A4, H·CL-A10, L·CX-A2, H·CX-A2, L·MU-A2). Cùng `backup-validation.ts` với T-232 và migration sau T-240 (thứ tự migration) nên làm sau hai Issue đó. Ghi chú golden L-09 là T-246.

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.6 (DR6-49…52, 54), §8.3 S2-K
- `docs/design/phase-3-du-lieu.md` §2 (quy ước chuỗi), §3.2, §6 (luật 7, 9); ADR-0008 §6; DR-49 (so tên team NFC) trong `docs/state/review-notes.md`
- `packages/db/CLAUDE.md` (migration); `packages/db/src/{common,team,customers,appointments,kyc,backup-validation,schema}.ts`
- `packages/domain/src/{kyc-fact,model,appointment-counts}.ts`
- `apps/desktop/src/routes/customers/KycDialogs.tsx` (kiểm rỗng)

#### File / thư mục được phép sửa

- `packages/db/src/{common,team,customers,appointments,kyc,backup-validation,schema,migrations,seed}.ts`, `packages/db/migrations/**` (sinh tự động) và test cạnh chúng
- `packages/domain/src/{kyc-fact,model,appointment-counts}.ts` (+ test)
- `apps/desktop/src/routes/customers/KycDialogs.tsx`, `apps/desktop/src/routes/customers/CustomerDialogs.tsx`, `apps/desktop/src/routes/team/{PersonDialogs,TeamDialogs}.tsx` (kiểm rỗng cùng luật)
- `apps/desktop/src/i18n/vi.ts`

#### Interface / hợp đồng

- `cleanText` (hoặc hàm chuẩn hóa mới) dùng chung cho lệnh và nhập backup; mã lỗi mới (nếu có) có câu i18n.

#### Test chấp nhận

- [ ] `common.test.ts` / `team.test.ts`: "Bình  Minh", "Bình Minh", "Sao Mai​" → trùng tên team có sẵn (`TEAM_NAME_TAKEN`); "​" một mình → rỗng; "A\uD800" → từ chối.
- [ ] `kyc.test.ts`: giá trị KYC chỉ ký tự vô hình → rỗng, không sinh phiên bản, cổng không đổi.
- [ ] `backup-invariants.test.ts`: mâu thuẫn 2 / 2 → từ chối, 2 / 3 → nhận; tên có U+200B trong file → từ chối như lệnh.
- [ ] Lệnh với giới tính "X", vai trò "ADMIN", nhóm "N9" → `DbError` có mã.
- [ ] Migration: DB cũ có dữ liệu mở được; ghi IS kèm team bằng SQL thô bị CHECK chặn.

Ước lượng: ≈ 50 dòng SP + migration + ≈ 200 dòng test.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:med

#### Bị chặn bởi

#593, #601

## PR #640 — fix: store text as shown, refuse equal conflicts on import, code enum errors, check IS/BD/BDM have no team (T-243)

Trạng thái: MERGED · merge 2026-10-16T15:11:24Z · commit `d3797d7bde95a9194271a9d7c1d44e883c7b8b34` · nhánh `task/T-243-text-backup-enum`

Closes #604 (T-243). Deep review lượt 1: DR6-49, 50, 51, 52 (nhóm S2-K) + phần comment của DR6-54.

Owner quyết thêm ngày 16/10 khi làm task, có ghi ở Issue ([quyết định 1](https://github.com/AlexH-AI/Project-2C/issues/604#issuecomment-6217703876), [quyết định 2](https://github.com/AlexH-AI/Project-2C/issues/604#issuecomment-6218039325)): ghi chú KYC giữ xuống dòng; cho sửa 5 nhóm file ngoài danh sách (xem "Lệch so với Issue"); mã mới `INVALID_CHOICE`.

#### Đã làm

1. **Chữ lưu như màn hình hiện (DR6-49).** Hàm chuẩn mới ở `packages/domain/src/text.ts`:
   - `normalizeText`: bỏ `\p{Cf}` (U+200B, U+2060, U+FEFF…) **trước** NFC, để ký tự vô hình nằm giữa chữ và dấu không làm hai bên tách rời. Sau đó gộp mỗi chuỗi khoảng trắng Unicode (NBSP, tab, xuống dòng…) thành một dấu cách, NFC, trim.
   - `normalizeNote`: ghi chú KYC, làm như `normalizeText` trên từng dòng và giữ dấu xuống dòng (`\r\n` / `\r` thành `\n`).
   - `isStorableText`: không có NUL và không có nửa surrogate lẻ (`/\p{Cs}/u`, vì `isWellFormed` thuộc ES2024, ngoài `lib` ES2023).

   Ai dùng các hàm này:
   - `db`: `cleanText` / `requireName` dùng `normalizeText`, `cleanNote` (mới) dùng `normalizeNote`; chuỗi không qua `isStorableText` → `INVALID_TEXT`. `addKycNote` / `recordKycNote` dùng `cleanNote`.
   - `normalizeKycValue` của `domain` dùng `normalizeText` + `isStorableText`, nên lệnh KYC, kiểm nhập backup (`validKycValue`), V7 của AI và UI đều đọc giá trị theo một luật. Giá trị chỉ có ký tự vô hình là rỗng → `INVALID_KYC_VALUE`, không sinh phiên bản, cổng không đổi.
   - Nhập backup: `name` và `kyc_notes.text` kiểm bằng cùng hàm (`storedAs(requireName / requireNote)`). `valueOf` của `backup.ts` từ chối ô chữ không qua `isStorableText`, vì lúc nạp sql.js đã đổi surrogate lẻ thành U+FFFD (Owner, quyết định 2).
   - UI: `CustomerDialogs` (tên) và `KycDialogs` (giá trị ở 7a / hộp xác nhận, ghi chú ở 7a) kiểm rỗng bằng `normalizeText` / `normalizeNote`. `TeamDialogs` dùng `normalizeText` cho tham số dự phòng của câu lỗi. `PersonDialogs` / `TeamDialogs` vốn lấy lỗi "rỗng" từ lệnh, nên đã theo luật mới mà không phải sửa.
2. **Mâu thuẫn trùng giá trị (DR6-50).** Luật 7 của nhập backup chỉ nhận nhóm `conflict` khi các giá trị **đã đọc** (không phải chữ JSON: `2.0` là `2`) khác nhau từng đôi, như `markConflict` (nó từ chối giá trị trùng bất kỳ giá trị nào đang hiệu lực).
3. **Enum (DR6-51).** `requireChoice` (`common.ts`) cho giới tính (`validateProfile`) và vai trò (`validatePerson`) → `INVALID_CHOICE` (mã mới, câu "Giá trị không có trong danh sách: chọn lại."). `requireStage` (`customers.ts`) → `INVALID_TRANSITION` với `{ to }`, gọi ở `createCustomer` (trước khi chèn hàng), `checkTransition` (chuyển tay, khôi phục…) và `outcomeFields` (nhóm sau). `CUSTOMER_STAGES` của `schema.ts` được export để dùng chung.
4. **CHECK `people` (DR6-52).** Thêm `people_team_none`: `role IN ('RE','TL') OR team_id IS NULL`. Migration `0010_people_team_none` do drizzle-kit sinh, dựng lại bảng `people`. Nhánh (ii) của luật 9 nhập backup giờ do schema chặn ngay lúc nạp, nên câu SELECT của nó trong `staffRule` không bao giờ chạy tới nữa; em đã bỏ câu đó và ghi lại ở comment + spec.
5. **Comment trái DR-47 (DR6-54, phần code):** `model.ts` ("never an RE"), `appointment-counts.ts`, JSDoc thừa ở `seed.ts` (chuyển về đúng `profile`).

#### Lệch so với Issue / cần reviewer xem

- **File ngoài danh sách**, đều có Owner cho phép (hai comment ở Issue):
  - `packages/domain/src/text.ts` (+ test) và một dòng export ở `packages/domain/src/index.ts`. Codemap ở `packages/domain/CLAUDE.md` và `packages/db/CLAUDE.md` do `pnpm codemap` sinh lại.
  - `packages/db/src/errors.ts`: comment `INVALID_TEXT` và mã `INVALID_CHOICE`.
  - `packages/db/src/backup.ts`: `valueOf` dùng `isStorableText` (quyết định 2).
  - `docs/design/phase-3-du-lieu.md`: §4 dòng "Mọi lệnh có tên / chữ KYC", §6 kiểm `name` / `kyc_notes.text`, luật 7. Em sửa thêm luật 9 (ii): giờ là CHECK của schema, file sai bị từ chối lúc nạp và không mang `rule`. Câu này không nằm trong 3 chỗ Owner nêu, nhưng cùng file và cần để spec khớp code.
  - `e2e/customer-forms.spec.ts`, `e2e/customer-kyc.spec.ts`: e2e cho phần UI kiểm rỗng.
- **Ghi chú KYC giữ xuống dòng** (Owner, quyết định 1), khác chữ của Issue ("gộp mọi khoảng trắng"): màn hồ sơ hiện ghi chú bằng `whitespace-pre-line` từ T-048.
- **Hai test cũ đổi theo CHECK mới:**
  - `team.test.ts`: ca "khôi phục IS đã xóa có team" nay không dựng được bằng SQL thô nữa, nên ca kiểm CHECK chặn câu UPDATE đó.
  - `backup-invariants.test.ts`: "an IS in a team" / "a deleted BDM in a team" chuyển nhãn `9:` → `CHECK:`.
- **`database.test.ts` "keeps queries working across an export":** ca này chập chờn từ trước. Hai team tạo trong cùng một mili giây có ULID xếp theo phần ngẫu nhiên, nên khoảng một nửa số lần ra `['B','A']`; em gặp đúng một lần khi chạy. Em đã ghim đồng hồ chạy tăng, như `setup()` của các test khác.
- `optionalText` (ghi chú / bước tiếp theo của lịch hẹn) **không** đổi: ngoài phạm vi DR6-49, vẫn chỉ trim và chặn NUL.
- Dữ liệu cũ: theo K1, Owner nạp lại dữ liệu giả lập, không có migration dữ liệu. Seed vẫn qua mọi luật mới (`seed-invariants`, e2e nạp dữ liệu giả lập).

#### Test

- `domain/text.test.ts`: gộp khoảng trắng (2 dấu cách, NBSP, tab / xuống dòng, U+3000); bỏ U+200B / U+2060 / U+00AD / U+FEFF; NFD + U+200B trước dấu → "Bà"; ghi chú giữ `\n\n`, rỗng khi chỉ có dòng vô hình; `isStorableText` với NUL, `\uD800`, `\uDC00`, emoji.
- `team.test.ts`: "Bình  Minh", "Bình Minh", "\tBình ⁠Minh\n", "Sao Mai​" → `TEAM_NAME_TAKEN`; "​" / " ⁠ ﻿" → `NAME_REQUIRED`; "A\uD800", "\uDC00B" → `INVALID_TEXT`; vai trò "ADMIN" (có / không team, sửa) → `INVALID_CHOICE`.
- `kyc.test.ts`: giá trị chỉ có ký tự vô hình (`recordKycNote`, `confirmKycFact`) → `INVALID_KYC_VALUE`, DB không đổi, không phiên bản, cổng như cũ; "Thận  trọng​" là cùng giá trị → `KYC_NO_CONFLICT`; ghi chú nhiều dòng giữ xuống dòng, ghi chú vô hình → `KYC_NOTE_EMPTY`, surrogate lẻ → `INVALID_TEXT`.
- `customers.test.ts` / `appointments.test.ts`: giới tính "X" (tạo, sửa) → `INVALID_CHOICE`; nhóm "N9" (tạo, chuyển tay, nhóm sau) → `INVALID_TRANSITION`; DB không đổi.
- `backup-invariants.test.ts`: luật 7 — 2 / 2, `2` / `2.0`, 2 / 3 / 3 → từ chối; 2 / 3 / 4 → nhận. VALUE — tên team có U+200B, tên KH hai dấu cách, ghi chú KYC có khoảng trắng cuối dòng, giá trị KYC chữ chỉ U+200B, tên team có `\uD800` → từ chối; ghi chú hai dòng → nhận.
- `database.test.ts`: IS / BD / BDM có team bằng SQL thô → `CHECK constraint failed: people_team_none`. DB ở phiên bản 10 có dữ liệu (đủ 5 vai trò, người đã xóa, người phối hợp, người đánh giá) mở được, giữ mọi hàng và khóa ngoại, CHECK chạy trên bảng đã dựng lại.
- E2E: tên KH chỉ có ký tự vô hình → "Chưa nhập tên." tại ô; 7a giá trị vô hình → "Nhập giá trị.", ghi chú vô hình → câu `KYC_NOTE_EMPTY` tại ô, ghi chú hai dòng hiện hai dòng ở dòng thời gian.
- Mọi ca mới đều đỏ trước khi sửa code. Riêng các ca VALUE về tên / ghi chú trong `backup-invariants` đã xanh ngay khi chạy lần đầu, vì lúc đó `cleanText` mới đã có rồi.
- `pnpm verify` xanh (2 864 test). E2E toàn bộ trên máy: 226 / 226 xanh.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #605 — T-244: Công cụ: key và `finish_reason` của script eval, cổng merge chặt hơn, `retro.mjs` (DR6-55…58, DR6-64)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

#### Mục tiêu

1. **Key trong script eval (DR6-55):** `eval-ai-core.mjs` dùng cùng luật key của Rust: trả lời 2xx có `content` chứa key (nguyên văn, escape JSON, `%XX`) → `AI_BAD_RESPONSE`, không ghi vào file kết quả / partial / log; thông điệp lỗi server che key ở cả ba dạng. Doc comment đầu file đúng sự thật.
2. **`finish_reason` (DR6-56):** adapter của script truyền `finishReason`, coi `content: null` + `length` là trả lời rỗng bị cắt như Rust → chạy đúng đường thử lại / `CUT_ANSWER` của app.
3. **Cổng merge (DR6-57):** `merge-pr` / `pr-status` không coi code vào `main` sau lần chạy CI gốc là "đã thử" khi CI được chạy lại (Re-run dùng SHA cũ): so SHA `main` mà lần CI đã gộp (job Verify ghi ra) với `main` hiện tại, thay cho so giờ — hoặc, nếu không làm được gọn, `CLAUDE.md` cấm Re-run cho PR code (đóng / mở lại PR). Danh sách file của PR lấy bằng REST có phân trang (không giới hạn 100); không đọc đủ thì chặn.
4. **`retro.mjs` (DR6-58):** đọc transcript ở `CLAUDE_CONFIG_DIR` (và `~/.claude`), in thư mục đã đọc.
5. Test giữ luật (DR6-64): sổ ghi chú + một file khác dưới `docs/state/` → cần REVIEW; `REVIEW: CHANGES … PASS` → chặn; SHA REVIEW < 7 ký tự → không nhận; `fitOutput` với header dài vẫn dưới giới hạn hook.

#### Bối cảnh

Deep review lượt 1: DR6-55 (H·CL-F1, L·CX-F1, H·CX-F1), DR6-56 (L·CX-F2, H·CX-F2), DR6-57 (L·CL-F2, F3 — PLAUSIBLE với GitHub), DR6-58 (L·CL-F1), DR6-64 (H·CL-F4). Cổng merge là lớp kiểm duy nhất của "REVIEW PASS đúng head" nên `risk:med`. Không gọi AI thật: test dùng `fetch` giả, key giả.

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.7 (DR6-55…58), §5.8 (DR6-64), §8.3 S2-L
- `tools/eval-ai-core.mjs` (+ test), `apps/desktop/src-tauri/src/ai.rs` (`reply`, `reveals`, `mask`, nhánh `null` + `length` — chỉ đọc)
- `tools/pr-core.mjs`, `tools/pr-status.mjs`, `tools/merge-pr.mjs`, `tools/session-core.mjs` (+ test); `.github/workflows/ci.yml`
- `tools/retro.mjs`, `docs/metrics/README.md`
- `CLAUDE.md` mục Quy trình một task bước 5

#### File / thư mục được phép sửa

- `tools/{eval-ai-core,pr-core,pr-status,merge-pr,session-core,retro}.mjs` và test cạnh chúng
- `.github/workflows/ci.yml` (chỉ để ghi SHA đã gộp, nếu chọn cách đó)
- `CLAUDE.md` (chỉ câu về Re-run, nếu chọn cách đó)

#### Interface / hợp đồng

- `mergeBlockers` nhận thêm SHA `main` đã thử (nếu có); `pr-status` in nó.

#### Test chấp nhận

- [ ] `eval-ai-core.test.mjs`: `content` chứa key giả (ba dạng) → lỗi, file kết quả không chứa key; lỗi 401 có key `%XX` → bị che; `null` + `length` rồi trả lời đúng → ACCEPTED sau 2 lần như app.
- [ ] `pr-core.test.mjs`: chạy lại CI trên SHA cũ khi `main` đã có code mới → chặn; PR > 100 file → không bị coi docs-only; 4 ca của DR6-64.
- [ ] `retro.mjs` đọc được thư mục `CLAUDE_CONFIG_DIR` (test hàm chọn thư mục).

Ước lượng: ≈ 80 dòng `tools/` + ≈ 150 dòng test.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:med

#### Bị chặn bởi

Không (bắt đầu sau khi PR #591 merge)

## PR #642 — fix: keep the key out of the eval script, gate merges on the tested base, read CLAUDE_CONFIG_DIR in retro (T-244)

Trạng thái: MERGED · merge 2026-10-16T15:49:15Z · commit `30e12c459d023e0b882b7466a26089c297655b6d` · nhánh `task/T-244-tools-key-gate`

Closes #605 (T-244). Deep review lượt 1: DR6-55, 56, 57, 58 (nhóm S2-L) + 4 ca test giữ luật của DR6-64.

#### Đã làm

1. **Key trong script eval (DR6-55).** `eval-ai-core.mjs` đọc key theo đúng luật của Rust (`ai.rs`):
   - Port `readings` / `unescape` / `reveals` / `mask`: văn bản nguyên văn, bỏ escape JSON và `%XX` trong một lượt, hai lượt JSON → URL và URL → JSON (không bao giờ hai lượt JSON). Mỗi ký tự đọc ra giữ vị trí trong văn bản gốc, nên `mask` che đúng đoạn gốc như Rust.
   - Trả lời 2xx có `content` chứa key ở bất kỳ dạng nào → `AI_BAD_RESPONSE`, nên nội dung đó không vào file kết quả, file `.partial` hay log.
   - Thông điệp lỗi của server che key và session ở cả ba dạng, trước khi cắt 200 ký tự.
   - Sửa doc comment đầu file cho khớp hành vi.
2. **`finish_reason` (DR6-56).** Adapter của script trả `finishReason` như Rust: chỉ một từ ≤ 32 ký tự `[a-z_]` và không chứa key, ngoài ra là `null`. `content: null` (hoặc thiếu) kèm `length` → trả lời rỗng bị cắt. Khi chấm, script truyền `cut` vào `checkAnalysisAnswer` / `checkAnswer` / `extractJson`, nên đi đúng đường thử lại / `CUT_ANSWER` của app.
3. **Cổng merge (DR6-57).** Em chọn cách so SHA, không cấm Re-run:
   - Job Verify (`ci.yml`) thêm một bước ngay sau checkout. Bước này đọc cha thứ nhất của commit gộp bằng `git cat-file -p HEAD` (clone nông nên `HEAD^1` không dùng được; em đã thử trên clone `--depth 1`), rồi ghi notice `::notice title=Tested base::<sha>`. Re-run giữ commit gộp của lần chạy đầu, nên notice ghi đúng `main` đã thử.
   - `pr-status` lấy id check run của Verify từ `detailsUrl` (`…/job/<id>`; job id = check run id, em đã kiểm bằng API trên #640), đọc annotation, rồi so `compare/<sha đã thử>...main`. `mergeBlockers` nhận thêm `testedBase` và chặn khi `main` có commit code sau SHA đó. Luật không còn dùng giờ chạy (`ciStartedAt` bị bỏ).
   - Run code đã xanh mà không có notice (CI chạy trước PR này) → chặn, kèm hướng dẫn `gh pr close` + `gh pr reopen`.
   - Danh sách file của PR lấy bằng REST có phân trang (`gh api --paginate …/pulls/<N>/files`), so với `changedFiles`. Đọc thiếu → chặn, và PR không bao giờ được coi là docs-only / chỉ sổ ghi chú (`prFiles`). Em đã thử phân trang 10 file / trang trên #10 (58 file): ra đủ 58.
   - `pr-status` in thêm dòng `tested` (SHA đã thử, số commit sau nó) và `files N changed, M read`.
4. **`retro.mjs` (DR6-58).** `projectRoots(env, home)` trả `CLAUDE_CONFIG_DIR/projects` và `~/.claude/projects`, mỗi thư mục một lần. Lệnh đọc mọi thư mục có thật và in dòng `Transcripts read from: …`.
5. **Test giữ luật (DR6-64).** Sổ ghi chú kèm `docs/state/other.md` → cần REVIEW (P3). `REVIEW: CHANGES — sửa 2 mục rồi mới PASS` → chặn (P5). SHA 1–6 ký tự hoặc không phải hex → không nhận, cả ở `latestReview` lẫn `mergeBlockers` (S3). `fitOutput` với header 200 ký tự + thân 9 400 ký tự ≤ `HOOK_LIMIT` (S9).

#### Lệch so với Issue / cần reviewer xem

- **`tools/retro-core.mjs` (+ test) không có trong danh sách file của Issue.** Em đặt hàm chọn thư mục ở đây theo `.claude/rules/tests.md` ("logic thuần tách ra `*-core.mjs` có test"); `retro.mjs` chỉ làm I/O. Test chấp nhận "test hàm chọn thư mục" nằm ở `retro-core.test.mjs`.
- **Chưa sửa `CLAUDE.md` bước 5 và `.claude/rules/ci.md`**, vì Issue chỉ cho sửa `CLAUDE.md` ở câu cấm Re-run, mà em không chọn cách đó:
  - Câu "`merge-pr` chặn PR code khi `main` nhận code mới sau lúc CI của PR bắt đầu" vẫn đúng ở lần chạy đầu. Với Re-run, cổng nay chặt hơn câu đó.
  - `ci.md` chưa nhắc bước "Note the tested base".

  Nếu anh muốn, em ghi hai chỗ này vào sổ ghi chú cho PR docs sau.
- **Chuyển tiếp:** sau khi PR này merge, PR code nào có CI chạy trước đó sẽ bị chặn vì "noted no tested main" → cần `gh pr close` + `gh pr reopen`. Luật cũ cũng đã bắt `update-branch` trong trường hợp đó, vì `main` nhận code mới.
- `mergeBlockers` giả định `mainSince` rỗng khi `testedBase` là `null`. Bộ nạp (`loadMainSince`) bảo đảm điều này và JSDoc có ghi.
- Phần I/O (`pr-status`, `merge-pr`, `retro.mjs`, bước CI) không có unit test (theo `tests.md`). Em kiểm bằng lệnh thật: `node tools/pr-status.mjs 640` đọc 35 / 35 file qua REST và in `tested not noted` (run cũ). Notice của chính PR này sẽ được kiểm khi CI xong (comment bên dưới).

#### Test

- `eval-ai-core.test.mjs`:
  - `content` chứa key: nguyên văn, `Bearer …`, key có dạng escape, `%XX` hoa / thường, `\uXXXX` hoa / thường, một phần escape, `\/`, hai lớp → `AI_BAD_RESPONSE`. Escape khác, mảnh key, key sau `\\` → trả lời thường.
  - Lỗi 401 có key / session ở dạng `%XX`, `\uXXXX`, hai lớp, key "lạ" → `***`; `%20`, `\u00` lẻ, mảnh key giữ nguyên.
  - `finish_reason`: `stop`, `length`, `content_filter`, 32 ký tự → giữ. Key, `stop <key>`, 33 ký tự, rỗng, `Stop`, `stop\n`, `end_turn2`, số, key = `stop` → `null`.
  - `null` + `length` (và thiếu `content` + `length`) → `''` / `length`. `null` + `stop`, `null` không lý do, `42` + `length` → `AI_BAD_RESPONSE`.
  - `runEval`: hồ sơ E01 và ghi chú X01 bị cắt trước nội dung, lần 2 trả lời đúng → ACCEPTED / OK sau 2 lần, lần 1 có `CUT_ANSWER`.
  - `evalMain`: mọi trả lời chứa key (5 dạng) → mỗi mục `LỖI AI_BAD_RESPONSE`, A1 0/20, không file nào (kể cả mọi lần ghi `.partial`) và không dòng log nào chứa dạng nào của key.
- `pr-core.test.mjs`:
  - Re-run lúc 10:30 trên commit gộp 10:00, code vào `main` lúc 10:05 → chặn (luật cũ cho qua).
  - `main` có commit code sau SHA đã thử → chặn; chỉ docs → qua.
  - Run xanh không có notice → chặn; run đang chạy thì chỉ báo đang chạy.
  - 100 / 101 file đã đọc → chặn và tính là code; sổ ghi chú đọc thiếu → cần REVIEW + CI.
  - `testedBaseOf`: chỉ nhận SHA 40 ký tự thường của notice đúng tiêu đề. `verifyRunId`: lấy theo tên job Verify. `ci.yml` có đúng tên job và tiêu đề notice mà code đọc.
  - 3 ca DR6-64 (P3, P5, S3).
- `session-core.test.mjs`: S3 (`latestReview`), S9 (`fitOutput`).
- `retro-core.test.mjs`: `.claude-b` + `.claude`; không có biến / biến rỗng / trùng `~/.claude` (kể cả dấu `\` cuối) → một thư mục.
- Mọi ca mới về hành vi đều đỏ trước khi sửa code (7 ở eval, 7 ở `pr-core`, 1 ở retro). 4 ca DR6-64 xanh ngay, vì chúng giữ luật đang đúng (mục đích là giết đột biến).
- `pnpm verify` xanh (tools: 275 test).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #646 — docs: describe the tested-base merge gate in CLAUDE.md and the CI rules

Trạng thái: MERGED · merge 2026-10-16T16:45:18Z · commit `4217ed4cd3300af1d63aa61db9eb13902fe75f16` · nhánh `docs/merge-gate-tested-base`

Làm ghi chú không chặn đầu tiên của review PR #642 (T-244, `docs/state/review-notes.md`): `CLAUDE.md:49` (bước 5) và `.claude/rules/ci.md` còn tả cổng merge cũ ("`main` nhận code mới sau lúc CI của PR bắt đầu").

- `CLAUDE.md`: `merge-pr` chặn khi `main` có commit code sau bản `main` CI đã test (notice `Tested base`, Re-run giữ nguyên); CI không có notice → `gh pr close` + `gh pr reopen`.
- `.claude/rules/ci.md`: thêm mục bước "Note the tested base" (DR6-57), hai trường hợp chặn, đọc danh sách file bằng REST có phân trang.
- `review-notes.md`: chuyển ghi chú đó sang RESOLVED.

Đối chiếu với code: `tools/pr-core.mjs` (`TESTED_BASE`, `mergeBlockers`), `.github/workflows/ci.yml` bước "Note the tested base".

Docs-only (`CLAUDE.md` gốc không thuộc `CODE_DOCS`) → không chạy CI. Có file ngoài `review-notes.md` nên cần review phiên sạch.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #606 — T-245: Test giữ các luật đột biến còn sống (DR6-59, 62, 63, 65 và phần TS của DR6-60)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

#### Mục tiêu

Thêm test cho những luật mà đột biến của deep review lượt 1 cho thấy không test nào giữ; **không đổi code sản phẩm** (trừ khi một test lộ lỗi thật — khi đó dừng, báo trong PR / G8).

1. **Gói A (DR6-59):** ghim giá trị `kycHash` của 1–2 hồ sơ golden (giá trị lưu trong DB / backup); `countCustomerRecords` đếm 1 RF cho cuộc gặp đã dời ngày ở 6f (bắt bỏ `t.deleted_at IS NULL`); số lẻ ở cột token của `ai_analyses` trong file backup bị từ chối; khôi phục cuộc gặp sinh chuyển nhóm không phải RF có `effect.rf === false`.
2. **Gói B, phần TS (DR6-60):** `readBackup` đóng DB tạm (spy như ca seed).
3. **Gói D (DR6-62):** ngày "từ …" của hồ sơ và hộp 5d dùng chung hàm với thẻ kanban (một hàm `stageSince`, cả hai nơi gọi) + test; số "+ n KH" của cột kanban; `coverage.include` thêm `packages/ui/src/**/*.ts` và `apps/desktop/src/i18n/index.ts` với ngưỡng theo số đo hiện tại; năm sinh chỉ có năm = năm nay được nhận.
4. **Gói E (DR6-63):** `restoreRow` với HĐ đã xóa thật gọi đúng lệnh khôi phục HĐ (và nhân sự, team); thứ tự chấm "Dự kiến" sau "Đã gặp / Dời – hủy".
5. **KNOWN (DR6-65):** `tables.test.ts` dùng đồng hồ của `setup()` (đúng ở múi giờ UTC−11…+12, sửa comment DR-15 của #539); bảng so sánh probe in "—" khi nền bằng 0 (#572); e2e kiểm năm sinh / tên chỉ quét `messages[*].content`, không quét `sessionId` (#524).

#### Bối cảnh

Deep review lượt 1: DR6-59 (L·CL-A6, H·CL-A4, A5, A7), DR6-60 phần TS (L·CL-B3 MJ15), DR6-62 (H·CL-D4, L·CL-D6), DR6-63 (L·CX-E4, H·CL-E6), DR6-65 (L·CL-F4, H·MU-F1, H·MU-F2). Phần Rust của DR6-60 ở T-234, T-235; phần C (DR6-61) ở T-237; phần F (DR6-64) ở T-244. Cùng `trash.test.ts` với T-231 nên làm sau. Mục 3 tách `stageSince` là refactor nhỏ giữ hành vi (≈ 10 dòng SP).

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.8 (DR6-59…65), §7.3, §8.3 S2-M
- `.claude/rules/tests.md`; `vitest.config.ts`
- `packages/domain/src/kyc.ts` (`kycHash`); `packages/db/src/{counts,backup,trash}.ts` và test
- `apps/desktop/src/data/app-data.ts` (`readBackup`) + test
- `apps/desktop/src/routes/customers/{customers-view.ts,CustomerProfile.tsx,CustomersScreen.tsx}`
- `apps/desktop/src/routes/{trash-view.ts,appointments/appointments-view.ts}` + test
- `apps/desktop/src/data/tables.test.ts`, `packages/db/src/test-support.ts`; `e2e/perf/stats.ts`; `e2e/customer-ai.spec.ts`
- `docs/state/review-notes.md` mục #524, #539, #572

#### File / thư mục được phép sửa

- test (`*.test.ts`) của các file trên; `e2e/perf/stats.ts` (+ `stats.spec.ts`), `e2e/customer-ai.spec.ts`
- `vitest.config.ts` (`coverage.include`, ngưỡng)
- `apps/desktop/src/routes/customers/{customers-view.ts,CustomerProfile.tsx,CustomersScreen.tsx}` (chỉ tách `stageSince` / số "+ n KH" thành hàm có test)
- `packages/db/src/test-support.ts` (chỉ comment DR-15)

#### Interface / hợp đồng

- `stageSince(transitions)` (tên chốt trong PR) dùng chung cho kanban và hồ sơ.

#### Test chấp nhận

- [ ] Mỗi luật ở mục 1–4 có ít nhất một test đỏ khi đột biến tương ứng của báo cáo lượt 1 được áp lại (ghi tên đột biến và kết quả trong PR).
- [ ] `TZ=America/Los_Angeles pnpm test` không còn đỏ ở `tables.test.ts`.
- [ ] `pnpm test:coverage` xanh với vùng mới.

Ước lượng: ≈ 10 dòng SP + ≈ 300 dòng test.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:low

#### Bị chặn bởi

#592

## PR #644 — test: keep the rules the round 1 mutations survived (T-245)

Trạng thái: MERGED · merge 2026-10-16T16:36:00Z · commit `83e0515435fedbd018d6f176af0abaf09ca17bbe` · nhánh `task/T-245-mutation-tests`

Closes #606 (T-245). Deep review lượt 1, nhóm S2-M: test giữ các luật mà đột biến của lượt 1 còn sống (DR6-59, DR6-60 phần TS, DR6-62, DR6-63) và ba mục KNOWN của DR6-65. Không đổi hành vi sản phẩm.

#### Đã làm

1. **Gói A (DR6-59).**
   - `kyc.test.ts` (domain): ghim `kycHash` của hồ sơ golden K10 (`150004cacdd0f0`) và K14 (`002c4621be503a`, có mâu thuẫn). Comment ghi rõ: giá trị này lưu trong `kyc_versions` và file backup, đổi cách băm là đổi định dạng file.
   - `counts.test.ts`: cuộc gặp Đã gặp N3 → N2 dời từ 01/10 sang 02/10 bằng `editMeetingOutcome` (6f) → `countCustomerRecords` vẫn đếm 1 RF. Đúng ca probe của H·CL-A4: chuyển nhóm đã rút vẫn trỏ vào cuộc hẹn còn sống.
   - `backup-invariants.test.ts`: `prompt_tokens: 1.5`, `completion_tokens: 300.5` của phân tích OpenCode → file bị từ chối. Với hai cột này, chỉ `valueOf` chặn số lẻ.
   - `trash.test.ts`: khôi phục cuộc gặp Đã gặp N4 → N3 → `effect.rf === false`, và sau khi khôi phục `isRfAppointment` là `false`.
2. **Gói B, phần TS (DR6-60).** `app-data.test.ts`: spy `run` trên prototype của sql.js. Mọi DB mở ra đều chạy `PRAGMA foreign_keys = ON`, nên spy thấy hết. Test kiểm mọi DB mà `readBackup` mở đều đã đóng sau lệnh, còn DB hiện tại vẫn dùng được.
3. **Gói D (DR6-62).**
   - `stageSince(transitions)` trong `customers-view.ts` trả ngày vào nhóm hiện tại của từng KH (`Map`). `customerBoard` và `CustomerProfile` (dòng "từ …" ở đầu hồ sơ, `since` của hộp 5d) đều gọi hàm này. Hồ sơ không còn tự tính `transitions.at(-1)`. Có test riêng, cộng một ca "thẻ kanban lấy ngày đúng từ `stageSince`".
   - `kanbanColumn(cards)` trả `{ shown, more }`. `COLUMN_LIMIT` chuyển vào đây, `CustomersScreen` chỉ còn hiển thị. Test: 8 thẻ → hiện 6, `more: 2`; 6 thẻ hoặc rỗng → `more: 0`.
   - `parseBirthDate('2026', today)` → nhận `{ year: 2026 }`.
   - `coverage.include` thêm `packages/ui/src/**/*.ts` và `apps/desktop/src/i18n/index.ts`. Ngưỡng lấy theo số đo khi chạy cả bộ: `packages/ui/src/**` 100 / **92** / 100 / 100 (nhánh đo được 92,59 %: `token-guard.ts:63`, `compare-cells.ts:37`); `i18n/index.ts` 100 ở cả bốn chỉ số.
4. **Gói E (DR6-63).**
   - `trash-view.test.ts`: một DB có đủ năm loại bản ghi đã xóa, không dòng nào bị chặn. Với từng loại, `restoreRow` trả `null`; dòng đó rời Thùng rác, bốn dòng kia giữ nguyên.
   - `appointments-view.test.ts`: ô hôm nay có Dời / hủy 1, Đã gặp 1, Dự kiến 9 → nhãn đọc "Dự kiến" sau cùng.
5. **KNOWN (DR6-65).**
   - `tables.test.ts`: dùng đồng hồ 11:00 UTC như `setup()`, không còn 05:00 UTC.
   - Comment DR-15 ở `test-support.ts`: ghi đúng khoảng bảo đảm là UTC−11…+12. Auckland giờ mùa hè (UTC+13, từ 27/09/2026) và Kiritimati đã sang ngày hôm sau (ghi chú #539).
   - `stats.ts`: nền bằng 0 thì cột Δ in `(—)`, không còn `+Infinity%` / `−NaN%` (#572). Có thêm ca trong `stats.spec.ts`.
   - `customer-ai.spec.ts`: chỉ quét `messages[*].content` để tìm tên, mã KH và "1984", không quét `sessionId` (#524).

#### Áp lại đột biến của lượt 1

Em dùng script vá tạm từng đột biến, chạy file test liên quan, rồi trả file về nguyên byte (có kiểm hash). Kết quả: **15 / 15 bị giết** (trước PR này, các đột biến tương ứng đều sống).

| Đột biến (báo cáo) | Thay đổi | Kết quả |
|---|---|---|
| M31 (L·CL-A6) | `kycHash` bỏ `status` khỏi chuỗi băm | KILLED, 2 failed (ghim K10, K14) |
| M31b (thêm) | `kycHash` nối bằng `'\|'` thay `'\n'` | KILLED, 2 failed |
| M15 (H·CL-A4) | bỏ `t.deleted_at IS NULL` ở `counts.ts` | KILLED, 1 failed |
| M10 (H·CL-A5) | `valueOf`: `Number.isSafeInteger` → `typeof … === 'number'` | KILLED, 2 failed (hai cột token) |
| N19 (H·CL-A7) | `trash.ts`: `rf: isRfTransition(…)` → `rf: true` | KILLED, 1 failed |
| MJ15 (L·CL-B3) | bỏ `imported.db.sqlite.close()` | KILLED, 1 failed |
| X5 (H·CL-D4) | `stageSince` giữ chuyển nhóm **đầu** | KILLED, 4 failed |
| X6 (H·CL-D4) | "+ n KH" đếm cả cột | KILLED, 1 failed |
| D6 (L·CL-D6) | `year > today.year` → `>=` | KILLED, 1 failed |
| CX-E4 ×5 (L·CX-E4) | `RESTORE` nối sai lệnh: team → `restorePerson`, person → `restoreTeam`, customer → `restorePolicy`, appointment / policy → `restoreCustomer` | KILLED cả 5 (1–3 failed mỗi ca) |
| AV8 (H·CL-E6) | `'planned'` lên đầu `DOT_ORDER` | KILLED, 1 failed |

`stats.ts`: bản cũ in `+8 ms (+Infinity%)` và `+0 ms (−NaN%)`, ca mới trong `stats.spec.ts` đỏ với bản cũ; bản mới in `(—)`. Em kiểm bằng cách chạy `markdownTable` của cả hai bản.

#### Lệch so với Issue / cần reviewer xem

- **X5 / X6 nay nằm trong hàm chung.** Đột biến gốc của X5 sửa ngay `CustomerProfile.tsx:122`, nhưng chỗ đó không còn: hồ sơ gọi `stageSince`. Unit test không thấy được nếu một màn `.tsx` ngừng gọi hàm chung (repo chưa có DOM cho vitest; thêm là G4). Phần này giữ bằng đọc code. `e2e/customers.spec.ts` và `e2e/customer-forms.spec.ts` chạy local: 18 / 18 xanh.
- **BR3 / BR4 (chặn tải lại) của DR6-62 không có trong Issue này.** `block-reload.test.ts` trên `main` đã có ca `{ capture: true }`. Em không đụng file đó.
- **Nhánh `packages/ui` dưới 100 %.** Ngưỡng nhánh đặt 92 theo số đo, chưa thêm test cho `token-guard.ts:63` / `compare-cells.ts:37`, vì Issue chỉ đòi ngưỡng theo số đo hiện tại.
- **Ca TR-5 của `trash.test.ts`** (ghi chú #539, HĐ phát hành 12/10) em giữ nguyên. Comment DR-15 mới nói rõ khoảng múi giờ được bảo đảm, và ca này đúng trong khoảng đó.

#### Test

- `pnpm verify` xanh: 113 file, 2 898 test, coverage đạt mọi ngưỡng, kể cả hai vùng mới.
- `TZ=America/Los_Angeles`: chạy cả bộ unit, 2 898 / 2 898 xanh. Trước khi sửa, `tables.test.ts` đỏ 2 ca (`DATE_IN_FUTURE`).
- e2e local: `e2e/perf/stats.spec.ts` + `e2e/customer-ai.spec.ts` 26 / 26; `e2e/customers.spec.ts` + `e2e/customer-forms.spec.ts` 18 / 18.
- Kích thước: 17 file, +323 / −54. Phần sản phẩm ≈ 25 dòng: `customers-view.ts` thêm hai hàm, `CustomersScreen.tsx` chủ yếu do thụt lề, `CustomerProfile.tsx` 2 dòng. Còn lại là test, cấu hình coverage, `e2e/perf`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #607 — T-246: Tài liệu: lệch mockup đã biết, câu NT-TQ-06, ghi chú golden L-09 (DR6-29, 36, 47, 48, 54)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

#### Mục tiêu

Ghi các điểm Owner chọn **không sửa code** (15/10, bản tổng hợp §9 Q4, §8.4), để nghiệm thu G7 không ghi "Lỗi" sai:

1. `docs/testing/nghiem-thu-v1.md` mục "Lệch mockup đã biết" thêm: thẻ Lịch hẹn của hồ sơ không có ô "Kỳ" (DR6-29); 5c chú thích ô Ngày sinh khi sửa, 7c khung cảnh báo cổng khi đánh dấu mâu thuẫn trường cốt lõi, 7a nhãn "cốt lõi", hai mockup ghi "+ KH mới" / "+ Khách hàng" (DR6-36); 6c không có "· lần n", "Dời – hủy – không đến", meta Báo cáo, "÷ RF" (mockup tự lệch), thẻ File dữ liệu không có số ghi chú KYC (mockup tự lệch với 10a), chú giải lịch tháng không có "Trong kỳ" (DR6-48); tỉ lệ chốt tròn viết "60%" theo golden, mockup 1a viết "60,0%" (DR6-47).
2. Câu **NT-TQ-06** sửa thành "một chữ số thập phân khi không tròn (tròn thì '60%')", kèm ghi chú file Excel luôn một chữ số (`0.0%`).
3. Golden `docs/golden/lich-hen.md`: ghi chú dưới L-09 / A09 rằng người phối hợp RE là dữ liệu trước DR-47 (06/10), app nay từ chối; A09 vẫn kiểm "người phối hợp không tính" — **không sửa số, không sửa fixture** (G2, DR6-54).

#### Bối cảnh

Deep review lượt 1: DR6-29 (phần ô Kỳ), DR6-36 (H·CL-D9), DR6-47 (L·CL-E4, H·CL-E5, L·MU-E4), DR6-48 (L·CL-E4, H·CL-E5, L·MU-E2, E3), DR6-54. Phần sửa code của các dòng NT là T-236. PR chỉ sửa tài liệu, không chạy CI.

#### Tài liệu cần đọc

- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.4, §5.5, §5.6 (DR6-29, 36, 47, 48, 54), §8.4, §9 Q4
- `docs/testing/nghiem-thu-v1.md` NT-TQ-06, mục "Lệch mockup đã biết"
- `docs/golden/lich-hen.md` (L-09, A09); `docs/golden/chi-so.md` (cách viết tỉ lệ)
- `docs/design/phase-3-du-lieu.md` §3.6 (DR-47)

#### File / thư mục được phép sửa

- `docs/testing/nghiem-thu-v1.md`
- `docs/golden/lich-hen.md` (chỉ thêm ghi chú)

#### Interface / hợp đồng

- Không.

#### Test chấp nhận

- [ ] Mỗi điểm ở mục 1 có một dòng trong "Lệch mockup đã biết", nêu mockup / khối và DR6.
- [ ] NT-TQ-06 khớp golden và màn.
- [ ] Ghi chú L-09 không đổi bảng số của golden; `pnpm verify` xanh (golden test không đổi).

Ước lượng: PR docs.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh (PR docs-only: không chạy CI)
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:low

#### Bị chặn bởi

Không (bắt đầu sau khi PR #591 merge)

## PR #619 — docs: record the mockup deviations kept, NT-TQ-06 and the L-09 golden note (T-246)

Trạng thái: MERGED · merge 2026-10-15T12:12:28Z · commit `13f62d6a537859dbbbd426c44e72c13b6e27ff03` · nhánh `task/T-246-docs-known-deviations`

Closes #607 (T-246). PR chỉ sửa tài liệu — không chạy CI.

#### Thay đổi

- `docs/testing/nghiem-thu-v1.md`
  - **NT-TQ-06:** tỉ lệ chốt "một chữ số thập phân sau dấu phẩy khi không tròn ('66,7%'), tròn thì không có ',0' ('60%', '100%')" như golden `chi-so.md`; cột Ghi chú: file Excel (NT-BC-12) luôn một chữ số (`0.0%`), mockup 1a "60,0%" là lệch đã biết (DR6-47).
  - **"Lệch mockup đã biết":** khối mới "Owner chọn không sửa (15/10/2026, §8.4, §9 Q4)", mỗi điểm một dòng nêu mockup / khối và DR6:
    - DR6-29: thẻ Lịch hẹn của hồ sơ không có ô "Kỳ".
    - DR6-36: 5c chú thích Ngày sinh, 7c cảnh báo cổng khi đánh dấu mâu thuẫn trường cốt lõi, 7a nhãn "cốt lõi", "+ KH mới" / "+ Khách hàng".
    - DR6-48: 6c "· lần n", "Dời – hủy – không đến" (1a, 1c), "÷ RF" (mockup tự lệch 1a ↔ 1c, 1e), meta Báo cáo 2b / 2c, thẻ File dữ liệu không có số ghi chú KYC (mockup tự lệch với 10a), chú giải "Trong kỳ" (B4).
    - DR6-47: cách viết tỉ lệ chốt tròn.
- `docs/golden/lich-hen.md`: thêm một dòng ở "Diễn giải vài dòng": `L-09` có RE phối hợp là dữ liệu trước DR-47 (06/10), app nay từ chối; A09 vẫn kiểm "người phối hợp không tính". **Không sửa bảng số, không sửa fixture** (G2, DR6-54).

#### Test chấp nhận

- [x] Mỗi điểm ở mục 1 của Issue có một dòng trong "Lệch mockup đã biết", nêu mockup / khối và DR6.
- [x] NT-TQ-06 khớp golden (`chi-so.md` "100%", "66,7%") và màn (`formatPercent` bỏ ",0").
- [x] Ghi chú L-09 không đổi bảng số; `pnpm verify` xanh (golden test không đổi).

Đã kiểm chữ mockup / app trước khi ghi: `customer.html:364`, `customer-forms.html:151`, `appointment-forms.html:146`, `overview.html:831, 865, 1020, 1093`, `reports.html:364, 384`, `settings-data.html:120`, `phase-3-feedback.html` B4; `vi.ts` (`appointments.legendMissed`, `kyc.gateHelp.CONFLICT_RESOLUTION`), `number.ts` `formatPercent`, `report-workbook.ts` `0.0%`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

---

# Issue #625 — T-247: Chụp lại hai ảnh hướng dẫn còn lệch sau T-236 (06-ai-phan-tich, 03-ket-qua)

Trạng thái: CLOSED · nhãn: type:task, risk:low

#### Mục tiêu

Hai ảnh của hướng dẫn sử dụng đúng với app hiện tại: `06-ai-phan-tich.png` có đủ dòng đầu thẻ KYC Intelligence (tiêu đề, CURRENT, Mock) và `03-ket-qua.png` chụp lại sau câu gợi ý mới của "Hẹn lần tiếp theo".

#### Bối cảnh

- PR #623 (T-236) đổi Hồ sơ KH thành ba cột ở cửa sổ mặc định 1 440 px. Thẻ KYC Intelligence nay cao hơn khung 900 px, Playwright cuộn tới thẻ khi chụp và header `sticky` của khung app che dòng đầu thẻ.
- PR #624 (docs T-236) chụp lại năm ảnh nhưng cố ý để lại hai ảnh này vì cần sửa script chụp (PR code). Review PR #624 ghi chú chưa có Issue theo dõi; Issue này là chỗ theo dõi.
- `03-ket-qua.png` đổi khi chạy lại do PR #618 (T-233: câu `outcome.nextHelp` của "Hẹn lần tiếp theo").

#### Tài liệu cần đọc

- `e2e/guide/shots.guide.ts` (hàm `shot`, test "06 AI", test "03 lịch hẹn: detail, booking, rescheduling")
- `playwright.guide.config.ts` (viewport 1 440 × 900, lệnh chạy)
- `apps/desktop/src/shell/AppShell.tsx` (header `sticky top-0`)
- `docs/user-guide/06-ai.md` đầu mục; `docs/user-guide/03-lich-hen.md` §Ghi kết quả cuộc gặp, §Hẹn tiếp

#### File / thư mục được phép sửa

- `e2e/guide/shots.guide.ts`
- `docs/user-guide/img/**`
- `docs/user-guide/06-ai.md`, `docs/user-guide/03-lich-hen.md` (chỉ khi câu chữ lệch ảnh)

#### Interface / hợp đồng

Không đổi code sản phẩm. Chỉ script chụp ảnh (chạy tay, không chạy trong CI).

#### Test chấp nhận

- [ ] `pnpm exec playwright test -c playwright.guide.config.ts` xanh 13/13; mỗi ảnh ≤ 150 KB, tổng ≤ 4 MB.
- [ ] `06-ai-phan-tich.png` có dòng đầu thẻ (tiêu đề "KYC Intelligence", CURRENT, Mock), không có header của khung app đè lên.
- [ ] `03-ket-qua.png` có câu gợi ý mới của "Hẹn lần tiếp theo" (PR #618).
- [ ] Ảnh khác không đổi byte, hoặc PR nêu lý do từng ảnh đổi.
- [ ] Câu chữ của `06-ai.md` và `03-lich-hen.md` khớp hai ảnh.

#### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

#### Rủi ro

risk:low

#### Bị chặn bởi

Không

## PR #626 — fix: keep the app header off the top of tall guide shots, reshoot the outcome dialog (T-247)

Trạng thái: MERGED · merge 2026-10-15T14:05:53Z · commit `d887a829cc6f94b5ed52a543acfaddd2fd428da5` · nhánh `task/T-247-guide-shots`

Closes #625

#### Tóm tắt

T-247: hai ảnh hướng dẫn còn để lại sau PR #624 (T-236).

- `e2e/guide/shots.guide.ts`: hàm `shot` truyền `style: 'header.sticky { position: static !important; }'` cho mọi lần chụp. Hồ sơ KH ba cột (PR #623) làm thẻ KYC Intelligence cao hơn khung 900 px; Playwright cuộn tới thẻ và header `sticky` của khung app đè lên dòng đầu thẻ. Header ở trạng thái `static` giữ nguyên chỗ trong luồng trang, nên ảnh chụp từ đầu trang không đổi byte (chỉ 2 ảnh dưới đổi).
- `docs/user-guide/img/06-ai-phan-tich.png`: có đủ dòng đầu thẻ (KYC Intelligence, CURRENT, Mock, nút Phân tích bằng ChatGPT web / Phân tích lại, `PROFILE_DISCOVERY`).
- `docs/user-guide/img/03-ket-qua.png`: câu gợi ý mới của "Hẹn lần tiếp theo" ("cùng KH, người phối hợp, trigger, RE phụ trách KH", PR #618).

Câu chữ `docs/user-guide/06-ai.md` (đầu thẻ, nhãn CURRENT / Mock, chip phiên bản) và `docs/user-guide/03-lich-hen.md` (§Ghi kết quả cuộc gặp, §Hẹn tiếp) đã khớp hai ảnh, không sửa.

##### Ngoài danh sách file của Issue

Không có.

#### Test chấp nhận

- [x] `pnpm exec playwright test -c playwright.guide.config.ts`: 13/13 xanh; chạy lần hai cho cùng byte. `06-ai-phan-tich.png` 93,8 KB, `03-ket-qua.png` 55,4 KB (≤ 150 KB; bước `check` kiểm cả tổng ≤ 4 MB).
- [x] `06-ai-phan-tich.png` có dòng đầu thẻ, không có header khung app đè lên.
- [x] `03-ket-qua.png` có câu gợi ý mới của PR #618.
- [x] Ảnh khác không đổi byte (`git status` chỉ có hai ảnh trên).
- [x] Câu chữ `06-ai.md`, `03-lich-hen.md` khớp ảnh.

#### Kiểm

- `pnpm verify` xanh.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
