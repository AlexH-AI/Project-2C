# Issue và PR sửa sau lượt 4 — deep review Phase 1–6, lượt 5

Dựng ở bước chuẩn bị (`plan.md` §L5.9 bước 4), 04/11/2026 21:47 +07:00, máy `DESKTOP-KDURKJP`, bằng `gh issue view` / `gh pr view --json` trên `AlexH-AI/Project-2C` (tải lúc 2026-11-04T14:45:05.523Z); sổ ghi chú đọc ở SHA ghim `37a80b6`. Nguyên văn thân 38 Issue của ba bảng `plan.md` §L5.2 (đợt sửa lượt 4, mục sổ [G7] sau đợt sửa, G7), cùng thân mọi PR của chúng (39 PR, gồm PR G5 #909 đi kèm #900). Các PR không có mục riêng tên "Lệch so với Issue", "Chưa làm", "Sửa sau review" (mẫu PR có "Thay đổi", "Test chấp nhận", "Ghi chú OPEN liên quan", "Kiểm tra"), nên chép cả thân PR như lượt 4: phần lệch / chưa làm / sửa sau review nằm trong các mục đó khi PR có. Sau thân PR là nguyên văn các nhóm RESOLVED của `docs/state/review-notes.md` mà Issue đó gom (25 nhóm, theo nhãn T-xxx ở dòng đầu nhóm), để thử biến thể gần (`plan.md` §L5.4 bảng R2). Tiêu đề trong thân đã hạ hai cấp để lồng dưới mục của file này; chữ giữ nguyên.

Kiểm khi dựng: Issue đều CLOSED, PR đều MERGED, commit merge của mỗi PR trùng cột Commit của bảng §L5.2 và nằm trong lịch sử của `37a80b6`. Các Issue sau bảng §L5.2 (T-357…T-361) chỉ sửa tài liệu của lượt 5 (kế hoạch, `dot2.mjs`), không ở đây.

| Bảng §L5.2 | Issue | Tiêu đề | PR (commit merge) | Nhóm RESOLVED |
|---|---|---|---|---:|
| Đợt sửa lượt 4 | #896 | T-319: Lượt 4 L4-A: test D7 cùng ngày, byName đổi chữ số một lần mỗi tên, nhãn model từ chối UTF-16 hỏng (DR6-135…137) | #907 (`1766cca`) | 0 |
| Đợt sửa lượt 4 | #897 | T-320: Lượt 4 L4-B: test hợp đồng CSP / identifier và storage.rs (thư mục tên backup, ổ đầy lúc backup) (DR6-138) | #915 (`ea2aa34`) | 0 |
| Đợt sửa lượt 4 | #898 | T-321: Lượt 4 L4-C: flush() chờ lần thay bắt đầu muộn, listener của AppData, focus và câu hộp đóng app (DR6-139, 140, 147, 146 b) | #911 (`59fdfca`) | 0 |
| Đợt sửa lượt 4 | #899 | T-322: Lượt 4 L4-D: Mock trích xuất chỉ đề xuất từ câu kể đơn về KH, lỗi AI giữ lại theo dữ liệu (DR6-141, 144) | #917 (`5d13f5a`) | 1 |
| Đợt sửa lượt 4 | #900 | T-323: Lượt 4 L4-E: đợt G5 lượt 4, NUL không làm lọt V3–V6, miễn "giới" trước "luật" hẹp lại (DR6-142, 143) | #909 (`1e500e1`), #913 (`1eab296`) | 1 |
| Đợt sửa lượt 4 | #901 | T-324: Lượt 4 L4-F: dấu nối còn lại của DR6-37 và bộ chặn ký hiệu, ô chọn theo mockup (DR6-145, 149) | #920 (`656052f`) | 0 |
| Đợt sửa lượt 4 | #902 | T-325: Lượt 4 L4-G: tên liền dài không tràn ở hộp thoại, màn Team, So sánh team, Báo cáo (DR6-148, 146 a) | #922 (`06c5a1b`) | 0 |
| Đợt sửa lượt 4 | #903 | T-326: Lượt 4 L4-H: ô Case size trống, tên nút khôi phục ở Thùng rác, focus lúc hộp xác nhận chạy, test hở gói E (DR6-150…154) | #924 (`4d7e689`) | 0 |
| Đợt sửa lượt 4 | #904 | T-327: Lượt 4 L4-I: công cụ: pr-core, bộ kiểm ảnh hướng dẫn, glob của notes-core, size-report (DR6-155…157) | #926 (`54884d4`) | 0 |
| Đợt sửa lượt 4 | #905 | T-328: Lượt 4 L4-J: nghiệm thu NT-EX-08/09 cho dữ liệu exe trước v1.0 (KNOWN CLR4-F2) | #928 (`532a93a`) | 1 |
| Mục sổ [G7] | #930 | T-329: Mục sổ G7: packages/ai gỡ chép ở bộ chặn và test, tách Mock trích xuất ra file riêng (không đổi hành vi) | #937 (`b6d4388`) | 1 |
| Mục sổ [G7] | #931 | T-330: Mục sổ G7: Mock trích xuất theo quyết định Owner 31/10 – 01/11 (giá trị cuối về KH, Ly hôn / Góa / Ly thân, con đã mất, "bé"), viết lại §10 | #939 (`36a63e7`) | 1 |
| Mục sổ [G7] | #932 | T-331: Mục sổ G7: tên dài — DataTable an toàn trong khung cuộn, hàng tiêu đề thẻ team, mũi tên cạnh tên nhiều dòng, e2e phụ đề | #941 (`023cf3b`) | 1 |
| Mục sổ [G7] | #933 | T-332: Mục sổ G7: ô Giờ chỉ có ký tự vô hình, focus sau hộp nhập backup, khóa i18n chung, gỡ chép ở db và dữ liệu app | #946 (`66019cc`) | 1 |
| Mục sổ [G7] | #934 | T-333: Mục sổ G7: công cụ kiểm — bộ chặn ký hiệu (kiểu generic, CRLF) và globMeetsFolder | #965 (`7b6dbd1`) | 1 |
| Mục sổ [G7] | #935 | T-334: Mục sổ G7: tài liệu — bản tổng hợp lượt 4, phase-6.md, §7.3, quyết định Owner #917 / #920, mục Ô chọn | #948 (`52a9979`) | 1 |
| Mục sổ [G7] | #942 | T-335: Skill auto-issues — /goal chạy hàng đợi Issue qua phiên code / review con, merge, ghi sổ | #944 (`a96d94d`) | 0 |
| Mục sổ [G7] | #950 | T-336: Mục sổ G7: packages/ai — Mock trích xuất mang KH qua khúc không chữ và dấu đầu dòng, ca Số con của luật 3, gỡ chép, §10, ranh giới test-support, chữ quyết định T-330 | #956 (`a7877e5`) | 1 |
| Mục sổ [G7] | #951 | T-337: Mục sổ G7: UI — ô Giờ có ký tự vô hình, dáng nút aria-disabled ở Button, e2e tiêu đề team cạnh tên TL dài | #958 (`2cc4464`) | 1 |
| Mục sổ [G7] | #952 | T-338: Mục sổ G7: pipeline auto-issues và checklist (chạm rào, Owner làm) — update-branch, chờ CI sau reopen, chạy tiếp, .claude/rules và rào, gỡ chép, hook gợi ý review nhầm | #954 (`3665328`) | 1 |
| Mục sổ [G7] | #960 | T-339: Mục sổ G7: test Mock trích xuất và ranh giới test-support — đo thời gian bền với runner chậm, ca qua dòng của luật 1, hằng miễn chung của dependency-cruiser | #963 (`ee01e41`) | 1 |
| Mục sổ [G7] | #961 | T-340: Mục sổ G7: skill auto-issues (chạm rào, Owner làm) — brief §3.8 làm mới Ghi chú OPEN liên quan, câu trỏ dòng ở §4 | #967 (`6be4dee`) | 1 |
| Mục sổ [G7] | #969 | T-341: Mục sổ G7: comment bộ đếm đối số kiểu của bộ chặn ký hiệu — thẻ đóng / tự đóng dính chữ JSX, hậu quả bỏ sót | #971 (`55086de`) | 1 |
| Mục sổ [G7] | #973 | T-342: Mục sổ G7: bảng PR vượt ngưỡng của Phase 6 đếm bổ sung tới nay (gồm #944), ca ghim thẻ mở dính chữ JSX của bộ chặn ký hiệu | #975 (`ace10ee`) | 1 |
| G7 | #977 | T-343: Chụp lại ảnh hướng dẫn sau đợt sửa lượt 4 (ô chọn, discovery@5) | #978 (`fffe3e5`) | 0 |
| G7 | #980 | T-344: Mục sổ G7: bảng đối chiếu của hướng dẫn, hàng Chuyển nhóm ghi mockup vẽ hộp (customer-forms.html 5d–5e) | #981 (`57d6330`) | 1 |
| G7 | #983 | T-345: Probe hiệu năng: Lịch hẹn kỳ Tháng lùi về tháng gần nhất có đủ ngày Đã gặp | #984 (`0212bb6`) | 0 |
| G7 | #986 | T-346: Mục sổ G7: probe hiệu năng — kỳ Năm lùi về năm có đủ lịch Đã gặp, kiểm sớm trước vòng nhập backup | #988 (`6d9ae0e`) | 1 |
| G7 | #990 | T-347: Mục sổ G7: probe hiệu năng — một locator cho dòng Đã gặp kỳ Năm, kiểm tháng chứa hôm nay trước khi lùi kỳ Tháng | #992 (`1ce3c61`) | 1 |
| G7 | #994 | T-348: Ghi số đo NT-HN-01 trên Home PC (G7) | #995 (`ffdea65`) | 0 |
| G7 | #997 | T-349: Mục sổ G7: số đo NT-HN-01 — Ghi chú NT-HN-01 không chép số, Cách đo nêu bước mở lại mới so lượt 4 | #999 (`570b110`) | 1 |
| G7 | #1001 | T-350: Thùng rác ghi lịch Dự kiến đã qua là Chưa ghi kết quả (NT-TR-07) | #1011 (`3d237b0`) | 0 |
| G7 | #1002 | T-351: Ghi kết quả nghiệm thu lượt L2 trên exe ứng viên 1ce3c61 (G7) | #1003 (`ccea84f`) | 0 |
| G7 | #1004 | T-352: Mục sổ G7: nghiệm thu sau L2 — mục Dữ liệu, phạm vi dòng L2, chú giải ⚠️, NT-AI-03 và bảng cổng KYC của hướng dẫn | #1007 (`46ffe62`) | 1 |
| G7 | #1005 | T-353: Mục sổ G7: NT-LH-19 (29/02) và NT-LH-28 (Dời lịch ở Các lần hẹn trước) lệch app — Owner chọn sửa dòng hay sửa app | #1009 (`daa8651`) | 1 |
| G7 | #1012 | T-354: Mục sổ G7: nghiệm thu sau T-352 — NT-TR-12 vào danh sách cần lịch Chưa ghi kết quả, dấu câu NT-AI-03 | #1014 (`b1cacf7`) | 1 |
| G7 | #1017 | T-355: Nghiệm thu lượt L3 trên exe ứng viên 3d237b0: NT-TR-07, vùng Thùng rác, NT-LH-19/28, NT-HD-01 (G7) | #1020 (`abd10b9`) | 1 |
| G7 | #1019 | T-356: Hướng dẫn: mở app vào màn dùng lần cuối, không phải luôn Tổng quan (NT-HD-01) | #1023 (`382967d`) | 1 |

---
# Issue #896 — T-319: Lượt 4 L4-A: test D7 cùng ngày, byName đổi chữ số một lần mỗi tên, nhãn model từ chối UTF-16 hỏng (DR6-135…137)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

Nhóm **L4-A** của đợt sửa lượt 4 (lõi dữ liệu, gói A):

1. **DR6-135 — test hở của luật D7 cùng ngày.** Bộ lọc ngày trong SQL của `unmovedMeetingsFrom` (`date >= ?`, mới ở #805) giữ luật D7 cho cuộc gặp **cùng ngày**, nhưng không test nào giữ. Thêm ca: KH N3; cuộc gặp A ngày d đổi N3 → N2; cuộc gặp B cùng ngày d, ghi sau, giữ N2. Xóa A, sửa A thành Hủy, sửa A sang nhóm khác → từ chối `STAGE_KEPT_BY_MEETING { date: d }`, KH vẫn N2. Code hiện tại đúng; chỉ thêm test.
2. **DR6-136 — `byName` nhanh lại.** `byName` (luật 6 của T-291) đổi chữ số về ASCII cho cả hai tên ở **mỗi lần so** (`LATIN.test` × 2). Sắp bảng Lịch hẹn 10 255 dòng theo KH chậm từ 9,4 lên 65,2 ms trong Node (54–60 ms trên bản web): vượt luật nhiễu, dưới ngưỡng 200 ms. Đổi chữ số một lần cho mỗi tên (nhớ theo tên, hay khóa dựng trước khi sắp), giữ **đúng thứ tự** hiện nay (DR6-112: chỉ cùng tên mới hòa).
3. **DR6-137 — nhãn model nhận UTF-16 hỏng.** `isLabel` chỉ kiểm rỗng và NUL. Lệnh `recordAiAnalysis` nhận `model` có nửa surrogate lẻ hay U+FEFF đầu chuỗi; sql.js đọc lại thành chữ khác (U+FFFD ×3, mất BOM), nên mọi bản xuất có dòng đó bị luật nhập 12 từ chối. Nhãn (model, prompt version) phải lưu và đọc lại nguyên văn: từ chối nửa surrogate lẻ (`isStorableText`) và U+FEFF đầu chuỗi, cùng một hàm ở lệnh và ở luật nhập 12 (`analysisLabelsFit`). Dữ liệu giả lập nạp lại (K1).

##### Bối cảnh

Deep review Phase 1–6 lượt 4: tổng hợp T-318 #893, PR #895, §6.1 và §8.2 (nhóm L4-A). Owner 27/10 chốt sửa hết trước G7 (plan §L4.11 đề xuất 6). DR6-135, 136 mới do đợt sửa sau lượt 3 (#805, #828); DR6-137 có từ trước (họ DR6-107 / 108). DR6-136 là phát hiện P duy nhất của lượt 4. K1 / R2-02: siết luật thì áp ở lệnh và nhập backup, không migration hay UI cho dữ liệu cũ.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` §6.1 (DR6-135…137), §7.2, §8.2 (L4-A)
- Báo cáo gốc (PR #894): `docs/reviews/raw/2026-10-31/claude/A.md` (CLR4-A1, A2: probe, đột biến `T287-unmoved-day-after`, số đo `byname-*`), `docs/reviews/raw/2026-10-31/codex/A.md` (CXR4-A1), `docs/reviews/raw/2026-10-31/deepseek/A.md` (DSR4-A1)
- `packages/db/src/customers.ts` (`unmovedMeetingsFrom`, `meetingKeepingMove`, `withdrawAppointmentTransition`), `packages/db/src/appointments.test.ts` (khối D7 của "the stage on the meeting day")
- `packages/domain/src/name-order.ts` (+ test), `packages/ui/src/components/compare-cells.ts` (nơi `DataTable` gọi `byName`)
- `packages/db/src/common.ts` (`isLabel`), `packages/db/src/ai-analyses.ts` (`toRow`, `analysisLabelsFit`), `packages/db/src/backup-validation.ts` (luật 12)
- `docs/design/phase-5-ai.md` §7.3 (luật nhập 2: nhãn `model`, `prompt_version`)

##### File / thư mục được phép sửa

- `packages/domain/src/name-order.ts`, `packages/domain/src/name-order.test.ts`
- `packages/db/src/common.ts`, `packages/db/src/ai-analyses.ts` và test của chúng
- `packages/db/src/appointments.test.ts`, `packages/db/src/backup*.test.ts`
- `docs/design/phase-5-ai.md` (§7.3, chữ luật nhãn)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `2e51e25`): không có ghi chú OPEN nào. Sổ OPEN rỗng từ #892.

##### Interface / hợp đồng

- `byName(a: string, b: string): number` giữ chữ ký và thứ tự trả về.
- `isLabel(text: unknown): text is string` thêm điều kiện: chữ lưu nguyên được (không NUL, không nửa surrogate lẻ, không bắt đầu bằng U+FEFF).

##### Test chấp nhận

- [ ] Ca D7 cùng ngày: xóa A, sửa A thành Hủy, sửa A sang N1 → `STAGE_KEPT_BY_MEETING` mang đúng ngày, KH vẫn N2. Đột biến `date >= ?` → `date > ?` ở `unmovedMeetingsFrom` làm ca này đỏ.
- [ ] `byName` cùng thứ tự với bản ở `2e51e25` trên mọi ca hiện có, trên tên KH / nhân sự / team của dữ liệu tải, và trên tên có chữ số toàn khổ / Ả Rập. Số đo sắp 10 255 tên (lặp như bảng Lịch hẹn) trước / sau ghi trong thân PR; sau ≤ khoảng 2× collator trần.
- [ ] `recordAiAnalysis` với `model` = `'x'.repeat(99) + '\uD800'` hay `'﻿' + 'alpha'` → `AI_ANALYSIS_INVALID`, không ghi dòng; nhãn hợp lệ dài đúng 100 vẫn nhận. File backup có dòng như vậy → `BACKUP_INVALID` ngay lúc nạp, không kèm `rule` (`VALUE`): bước nạp đã chặn chữ có nửa surrogate lẻ hay bắt đầu bằng U+FEFF ở mọi cột (DR6-49, DR6-107), trước luật 12. Luật 12 (`analysisLabelsFit`), khi gọi thẳng, từ chối các nhãn đó bằng chính hàm kiểm của lệnh. (Owner đồng ý 31/10/2026 ở PR #907, thay cho "`BACKUP_INVALID { rule: 12 }`".)
- [ ] `pnpm verify` xanh.

Ước lượng: ≈ 10–20 dòng SP + ≈ 70 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med (luật nhập backup)

##### Bị chặn bởi

Không

## PR #907 — fix: same-day D7 test, byName keeps each name's key, model labels read back (T-319)

Trạng thái: MERGED · merge 2026-10-31T00:42:02Z · commit `1766cca6644486fd26570940188dccbbcc281765` · nhánh `task/T-319-l4a-loi-du-lieu` · nhãn: risk:med

Closes #896

Nhóm **L4-A** của đợt sửa lượt 4 (lõi dữ liệu, gói A): DR6-135, DR6-136, DR6-137.

#### Thay đổi

- **DR6-135 (test hở D7 cùng ngày).** `appointments.test.ts`, khối "the stage on the meeting day": ca mới "keeps the move of a meeting while a meeting of the same day kept the stage (D7)".
  - Kịch bản: KH N3. Cuộc gặp A ngày 05/01 đổi N3 → N2. Cuộc gặp B cùng ngày, ghi sau, giữ N2.
  - Xóa A, sửa A thành Hủy, sửa A sang N1: cả ba bị từ chối `STAGE_KEPT_BY_MEETING { date: '05/01/2026' }`, KH vẫn N2.
  - Không sửa code sản phẩm.
- **DR6-136 (`byName` nhanh lại).** `name-order.ts`: khóa của mỗi tên (tên với mọi chữ số `\p{Nd}` đổi về ASCII) tính một lần rồi nhớ trong một `Map`.
  - Bộ nhớ đệm giữ tối đa 20 000 tên; quá thì xóa và tính lại từ đầu, để tên của dữ liệu đã đóng không ở lại mãi.
  - Chữ ký và thứ tự trả về giữ nguyên, kể cả cách phân định khi hai tên hòa: so theo mã ký tự (DR6-112).
  - Lối tắt `LATIN` giữ lại: tên Latinh là khóa của chính nó, nên bộ nhớ đệm không giữ bản sao.
  - Test: tách hàm xáo Lehmer dùng chung. Thêm ca "sorts more names than it keeps the keys of in the same order": 20 002 tên ASCII / Ả Rập, xáo rồi sắp, ra đúng thứ tự.
- **DR6-137 (nhãn model đọc lại nguyên văn).** `isLabel` (`common.ts`) nay còn đòi `isStorableText` (không NUL, không nửa surrogate lẻ) và không bắt đầu bằng U+FEFF.
  - Điều kiện này giống hệt `valueOf` của bước nạp backup.
  - Lệnh `recordAiAnalysis` và luật nhập 12 (`analysisLabelsFit`) cùng gọi `isLabel`.
  - `prompt_version` vốn đã chỉ nhận ASCII nhờ biểu thức `PROMPT_VERSION`.
- **Test DR6-137:**
  - Ba ca từ chối ở lệnh (`'x'×99 + '\uD800'`, `'\uDC00glm-5.3'`, `'\u{FEFF}alpha'`); vòng lặp có sẵn kiểm luôn là không ghi dòng nào.
  - Ca khứ hồi thêm nhãn 100 đơn vị có cặp surrogate hợp lệ (`'g'×98 + '😀'`), và nay kiểm mọi dòng đọc lại đúng bản lệnh trả về (`toMatchObject`), trước khi xuất → nhập.
  - Ca gọi thẳng `analysisLabelsFit`.
  - Hai ca `VALUE:` ở `backup-invariants.test.ts`.
- **`docs/design/phase-5-ai.md` §7.3 luật 2:** `model` không rỗng, ≤ 100 ký tự, đọc lại đúng như lưu. File backup có chữ như vậy bị từ chối ngay lúc nạp, trước luật này.
- Dữ liệu giả lập nạp lại (K1); không migration.

#### Dòng cuối test chấp nhận DR6-137: Issue đã sửa (Owner 31/10/2026)

Issue ghi lúc đầu: "File backup có dòng như vậy → `BACKUP_INVALID { rule: 12 }`". Dòng này không đạt được như chữ ghi, và cũng không nên làm cho đạt:

- Lúc nạp, `valueOf` (`backup.ts`) đã từ chối mọi chữ có nửa surrogate lẻ hay bắt đầu bằng U+FEFF, ở mọi cột (DR6-49, DR6-107), trước khi tới luật 12.
  - Vì vậy file như vậy bị từ chối `BACKUP_INVALID` **không kèm `rule`**, tức nhóm `VALUE:` của `backup-invariants.test.ts`.
- Muốn ra `{ rule: 12 }` thì phải nới `valueOf`. Làm vậy là đi lùi, và `backup.ts` không nằm trong danh sách file Issue cho sửa.
- PR này làm thay như sau:
  - Hai ca `VALUE:` ghi đúng kết quả thật của file: nửa surrogate lẻ ở biên 100, và U+FEFF đầu chuỗi.
  - Ca gọi thẳng `analysisLabelsFit`, tức hàm của luật 12, cho thấy luật 12 kiểm nhãn bằng đúng hàm của lệnh: nó từ chối ba nhãn hỏng, nhận nhãn 100 đơn vị kể cả nhãn có cặp surrogate hợp lệ.
- Owner đồng ý ngày 31/10/2026. Dòng đó trong Issue #896 nay ghi:
  - file như vậy bị từ chối `BACKUP_INVALID` ngay lúc nạp, không kèm `rule` (`VALUE`);
  - luật 12 (`analysisLabelsFit`), khi gọi thẳng, từ chối các nhãn đó bằng chính hàm kiểm của lệnh.

#### Test chấp nhận

- [x] Ca D7 cùng ngày: xóa A, sửa A thành Hủy, sửa A sang N1 → `STAGE_KEPT_BY_MEETING { date: '05/01/2026' }`, KH vẫn N2.
  - Đột biến `date >= ?` → `date > ?` ở `unmovedMeetingsFrom`, chạy cả `packages/db/src`: đúng 1 test đỏ (ca mới), 666 xanh.
  - Sau đó đã hoàn lại `customers.ts`; PR không sửa file này.
- [x] `byName` cùng thứ tự với `2e51e25` (số đo bên dưới):
  - mọi ca có sẵn của `name-order.test.ts` và `compare-cells.test.ts` vẫn xanh;
  - trên dữ liệu tải: tên KH (1 496), nhân sự (54), team (5), các dòng lịch hẹn sắp theo KH rồi giờ (10 255);
  - trên 4 488 tên KH có số viết bằng chữ số ASCII / toàn khổ / Ả Rập;
  - mỗi bộ xáo 5 lần, so bằng chuỗi.
  - Sau sửa = 1,31× collator trần (≤ ~2×).
- [x] `recordAiAnalysis` từ chối `'x'×99 + '\uD800'` và `'\u{FEFF}alpha'` bằng `AI_ANALYSIS_INVALID`, không ghi dòng; nhãn hợp lệ dài đúng 100 vẫn nhận (cả `'g'×100` lẫn `'g'×98 + '😀'`).
  - File backup có dòng như vậy bị từ chối `BACKUP_INVALID` ngay lúc nạp, không kèm `rule` (`VALUE`). `analysisLabelsFit` (luật 12), khi gọi thẳng, cũng từ chối các nhãn đó.
  - Đây là chữ của Issue sau khi sửa (Owner 31/10/2026), xem mục ngay trên.
- [x] `pnpm verify` xanh.

#### Số đo `byName` (DR6-136)

Cách đo:

- Node v24.20.0, Home PC.
- Dữ liệu tải `load-2026-10-12-seed6.p2cbackup`, file lượt 4 dùng (`deep-review-1-6-r4\common\load\`).
- Bộ so giống `DataTable`: `byName` theo tên KH, rồi so giờ.
- Trung vị của 41 lần, ba bản chạy xen kẽ trong cùng tiến trình.
- "Cũ" là bản `2e51e25`, chép nguyên văn vào script đo. Script ở scratchpad của phiên, không commit.

| Sắp | Collator trần | Cũ (`2e51e25`) | Mới (nhánh này) |
|---|---|---|---|
| 10 255 lịch hẹn sống theo KH, rồi giờ | 8,71 ms | 65,13 ms | **11,44 ms** (1,31×) |
| Như trên, lần sắp đầu khi chưa nhớ khóa nào (JIT đã chạy nóng trên tên khác) | — | — | 12,08 ms |
| 1 496 tên KH (`tables.ts` sắp mỗi lần đọc bảng) | 1,01 ms | 7,25 ms | 1,29 ms |

Đo trước khi sửa, để chọn cách. Một script so các cách viết ngay trong script, cùng dữ liệu và cùng cách đo. Lần chạy này cho collator trần 8,49 ms, bản cũ 65,00 ms.

| Cách | 10 255 lịch hẹn |
|---|---|
| Nhớ theo tên, không trần | 12,34 ms |
| Nhớ theo tên, trần 20 000 (bản chọn) | 12,11 ms |
| Kiểm mã ký tự mỗi lần so, không nhớ | 15,36 ms |

Cả ba cách đều cho cùng thứ tự. Bản chọn khớp hướng Issue nêu ("đổi chữ số một lần cho mỗi tên").

Ngưỡng coverage 100 % của `domain` giữ ca 20 002 tên. Nếu bỏ ca này thì nhánh `keys.clear()` không được phủ: statements 95,65 %, branches 92,85 %, và lệnh báo đỏ. Vì vậy ai nâng trần lên quá số tên của ca này sẽ bị báo.

#### Ghi chú OPEN liên quan

Không có. `node tools/notes-for.mjs --diff` (sổ @ `770c09b`) không có ghi chú OPEN nào nêu 7 file của nhánh.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med` (luật nhập backup). Owner merge.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-319 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #897 — T-320: Lượt 4 L4-B: test hợp đồng CSP / identifier và storage.rs (thư mục tên backup, ổ đầy lúc backup) (DR6-138)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Nhóm **L4-B** của đợt sửa lượt 4 (DR6-138, test hở gói B). Code hiện tại đúng ở cả ba chỗ; thêm test (và một seam nhỏ) để một lần sửa sau không làm hỏng mà CI vẫn xanh:

1. **CSP và `identifier` của bản dựng.** Ca "keeps the CSP closed…" của `tauri-contract.test.ts` chỉ đòi bốn chỉ thị có mặt (`arrayContaining`). Nới `script-src` / `img-src` / `font-src` hay thêm `frame-src` vẫn xanh, dù bản web của e2e không có CSP nên ca này là chốt chặn duy nhất của CSP exe. `identifier` (K39 giữ `dev.alexh.project2c`; đổi thì WebView2 dùng thư mục hồ sơ khác) không ca nào đọc. So **cả chuỗi** CSP (hay đủ mảng chỉ thị đã sắp) và đọc `identifier`.
2. **Bộ lọc "chỉ file" của `backup_names`** (`storage.rs`, viết lại ở #807) không test nào giữ. Bỏ nó thì một thư mục mang tên backup làm mất một bản backup thật, chặn lần mở đầu và thành "Backup mới nhất". Thêm test Rust: thư mục tên `backup_name(n, …)` giữa 10 bản → sau backup còn 10 file; mất `project2c.db` mà chỉ còn thư mục đó → `open` như lần mở đầu (`Ok(None)`); `latest_backup` bỏ thư mục.
3. **Ánh xạ ổ đầy → `DISK_FULL` của `backup`** không test nào đi qua (chỉ đường lưu có). Thêm một seam như `save_with` cho `backup` (hay cho phần chép của nó) và test "a backup that finds the disk full is reported as disk full".

##### Bối cảnh

Deep review Phase 1–6 lượt 4: tổng hợp T-318 #893, PR #895, §6.2 (DR6-138) và §8.2 (nhóm L4-B). Owner 27/10 chốt sửa hết trước G7. Có từ trước, lượt 1–3 bỏ sót. Đột biến sống của Claude B: NC7–NC11, NC13 (CSP / `identifier`), D4 (bộ lọc file), DF2 (ổ đầy ở backup).

##### Tài liệu cần đọc

- `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` §6.2 (DR6-138), §8.2 (L4-B)
- Báo cáo gốc (PR #894): `docs/reviews/raw/2026-10-31/claude/B.md` (CLR4-B1, B2, B3; mục 9.2 đột biến)
- `apps/desktop/src/data/tauri-contract.test.ts` (ca CSP, `tauriConf()`), `apps/desktop/src-tauri/tauri.conf.json`
- `apps/desktop/src-tauri/src/storage.rs` (`backup`, `disk_full`, `backup_names`, `latest_backup`, `save_with` và test của chúng)
- `docs/decisions/0013-huong-ui-dark-mode.md` phụ lục 27/10 (K39: `identifier` giữ)

##### File / thư mục được phép sửa

- `apps/desktop/src/data/tauri-contract.test.ts`
- `apps/desktop/src-tauri/src/storage.rs` (seam lỗi cho `backup` + test)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `2e51e25`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

Không đổi hành vi. Seam mới của `backup` chỉ dùng trong test (như `save_with`).

##### Test chấp nhận

- [ ] Nới `script-src` (thêm host, `'unsafe-eval'`, `'unsafe-inline'`), `img-src *`, `font-src` thêm Google Fonts, thêm `frame-src *`, đổi `identifier` → ca hợp đồng đỏ (đột biến NC7–NC11, NC13).
- [ ] Bỏ lọc file của `backup_names` → test Rust mới đỏ (D4).
- [ ] Bỏ `.map_err(disk_full)` ở `backup` → test mới đỏ (DF2).
- [ ] `pnpm verify` và `pnpm verify:rust` xanh.

Ước lượng: ≈ 10 dòng SP (seam Rust) + ≈ 50 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify`, `pnpm verify:rust` xanh
- [ ] CI xanh (PR gắn nhãn `build-exe` lúc tạo, vì sửa `src-tauri`)
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #915 — test: hold the exe's CSP and identifier, folders named like backups and a full disk on backup (T-320)

Trạng thái: MERGED · merge 2026-10-31T09:11:49Z · commit `ea2aa34ff8e3f13981ec3de034e76317e4395ef8` · nhánh `task/T-320-build-contract-storage-tests` · nhãn: risk:low, build-exe

Closes #897

#### Thay đổi

Nhóm **L4-B** của đợt sửa lượt 4 (DR6-138, CLR4-B1…B3). Code hiện tại đúng ở cả ba chỗ; PR thêm test (và một seam nhỏ) để một lần sửa sau làm hỏng thì CI đỏ.

- `apps/desktop/src/data/tauri-contract.test.ts`:
  - ca "keeps the CSP closed…" so **đủ mảng chỉ thị đã sắp** (8 chỉ thị) thay cho `arrayContaining` bốn chỉ thị: nới `script-src` / `img-src` / `font-src` hay thêm chỉ thị mới đều đỏ (bản web của e2e không có CSP, nên ca này là chốt chặn duy nhất của CSP exe);
  - ca mới "keeps the identifier of the build": `identifier` = `dev.alexh.project2c` (K39; WebView2 đặt tên thư mục hồ sơ theo nó).
- `apps/desktop/src-tauri/src/storage.rs`:
  - seam `backup_with(dir, stamp, lock, flush)` như `save_with`: `backup` gọi nó với `fs::File::sync_all`; `copy_to_backups` nhận `flush` và gọi `write_atomic_with`. Không đổi hành vi (`write_export` vẫn dùng `write_atomic`);
  - test `a_backup_that_finds_the_disk_full_is_reported_as_disk_full` (DF2): flush giả `StorageFull` → lỗi `DISK_FULL`, `backups\` không còn `.tmp`;
  - ba test cho bộ lọc "chỉ file" của `backup_names` (D4): `a_folder_named_like_a_backup_costs_no_backup` (thư mục tên `backup_name(5, …)` giữa 10 bản → sau backup còn 10 file, thư mục giữ nguyên), `a_missing_file_with_only_a_folder_named_like_a_backup_is_a_first_start` (`open` → `Ok(None)`), `a_folder_named_like_a_later_backup_is_never_the_latest_backup` (`latest_backup` bỏ thư mục `s00000099`).

#### Test chấp nhận

Đột biến chạy bằng script tạm (sửa file, chạy test của file đó, trả file gốc; repo không đổi):

| Đột biến | Kết quả | Test đỏ |
|---|---|---|
| NC7 `font-src 'self' data: https://fonts.gstatic.com` | KILLED (1 / 18 đỏ) | keeps the CSP closed… |
| NC8 `script-src … https://cdn.example.com` | KILLED | keeps the CSP closed… |
| NC9 `script-src … 'unsafe-eval' 'unsafe-inline'` | KILLED | keeps the CSP closed… |
| NC10 `img-src *` | KILLED | keeps the CSP closed… |
| NC11 thêm `frame-src *` | KILLED | keeps the CSP closed… |
| NC13 `identifier` → `dev.alexh.heritas` | KILLED | keeps the identifier of the build |
| D4 bỏ `.filter(… kind.is_file())` của `backup_names` | KILLED (3 / 77 đỏ) | cả ba test thư mục mới |
| DF2 bỏ `.map_err(disk_full)` của `backup_with` | KILLED (1 / 77 đỏ) | a_backup_that_finds_the_disk_full_is_reported_as_disk_full |

- [x] Nới `script-src` (thêm host, `'unsafe-eval'`, `'unsafe-inline'`), `img-src *`, `font-src` thêm Google Fonts, thêm `frame-src *`, đổi `identifier` → ca hợp đồng đỏ (NC7–NC11, NC13).
- [x] Bỏ lọc file của `backup_names` → test Rust mới đỏ (D4).
- [x] Bỏ `.map_err(disk_full)` ở `backup` → test mới đỏ (DF2).
- [x] `pnpm verify` và `pnpm verify:rust` xanh (Rust: 120 test).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `399d2b6`): Không có.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low` (Issue). Sửa `apps/desktop/src-tauri/**` → nhãn `build-exe`; theo HANDOFF, Owner merge.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-320 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #898 — T-321: Lượt 4 L4-C: flush() chờ lần thay bắt đầu muộn, listener của AppData, focus và câu hộp đóng app (DR6-139, 140, 147, 146 b)

Trạng thái: CLOSED · nhãn: type:task, risk:med, ready-for-agent

##### Mục tiêu

Nhóm **L4-C** của đợt sửa lượt 4 (lưu và đóng app):

1. **DR6-139 — `flush()` không chờ lần thay bắt đầu muộn.** `flush()` (`persist-queue.ts`) chỉ hỏi `tracked` trước `await idle()`. Một lần thay (Nạp lại / Nhập backup / Dọn sạch) bắt đầu trong lúc `flush()` đang chờ lần ghi thì không được chờ, nên `closeAfterSaving` hủy cửa sổ giữa lúc thay, trái S2-6. Sửa: `flush()` chờ tới khi không còn việc theo dõi **và** không còn lần ghi (lặp).
2. **DR6-140 — listener của `AppData`.** `changed()` của `AppData` gọi từng listener không bọc `try`, khác `persist-queue` (NIT #87). Một listener ném làm `run()` ném **sau** khi lệnh đã ghi, trái hợp đồng "lệnh bị từ chối thì không đổi gì". Sửa: mỗi listener một `try`, lỗi qua `console.error`, các listener khác vẫn được gọi.
3. **DR6-147 — một lần lưu khác thành công trong lúc dải lưu lỗi hay hộp đóng app đang hiện.**
   - (a) Dải gỡ khi `failed` về false; chỉ đường Thử lại đưa focus về tiêu đề, nên focus đang ở "Thử lại" rơi về `body`. Sửa: khi dải sắp gỡ mà focus nằm trong dải, đưa focus về tiêu đề màn (cùng luật của nhánh Thử lại).
   - (b) Hộp "Chưa lưu được thay đổi" đọc `error` hiện tại của hàng đợi: lỗi về `undefined` thì câu đổi sang "file có thể đang bị chương trình khác mở", trong khi sidebar ghi "Đã lưu". Sửa: khi `failed` về false trong lúc hộp đang hỏi, hộp tự trả lời "Thử lại" (lưu đủ thì cửa sổ đóng như người dùng đã muốn khi bấm X).
4. **DR6-146 (b) — test hở:** nhánh "người dùng đã chuyển focus đi trong lúc lưu" của Thử lại (`SaveWarning.tsx`) không ca nào giữ (đột biến RB2c sống). Thêm ca e2e.

##### Bối cảnh

Deep review Phase 1–6 lượt 4: tổng hợp T-318 #893, PR #895, §6.2 (DR6-139, 140), §6.4 (DR6-146, 147) và §8.2 (nhóm L4-C). Owner 27/10 chốt sửa hết trước G7. DR6-139, 146, 147 mới do #750, #817; DR6-140 có từ trước. S2-6 (spec Phase 6 §4.1, K13 / K35): đóng app chờ lần thay đang chạy và lần lưu của nó.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` §6.2, §6.4, §8.2 (L4-C)
- Báo cáo gốc (PR #894): `docs/reviews/raw/2026-10-31/deepseek/B.md` (DSR4-B1, B2), `docs/reviews/raw/2026-10-31/claude/D.md` (CLR4-D2, D3: probe `p13-retry-focus`, `p16-close-question`)
- `docs/design/phase-6-hoan-thien.md` §4.1 (S2-1…S2-6)
- `apps/desktop/src/data/persist-queue.ts` (+ test), `apps/desktop/src/data/app-data.ts` (`changed`, `run`; + test)
- `apps/desktop/src/shell/close-guard.ts`, `apps/desktop/src/shell/CloseGuard.tsx`, `apps/desktop/src/shell/SaveWarning.tsx` (+ test)
- `e2e/save-state.spec.ts`, `e2e/support.ts` (`holdSaves`, `failSaves` của exe giả)

##### File / thư mục được phép sửa

- `apps/desktop/src/data/persist-queue.ts`, `apps/desktop/src/data/app-data.ts` và test của chúng
- `apps/desktop/src/shell/{close-guard.ts,CloseGuard.tsx,SaveWarning.tsx}` và test của chúng
- `e2e/save-state.spec.ts`, `e2e/support.ts` (nếu cần helper)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `2e51e25`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

`PersistQueue.flush()`: resolve khi không còn việc theo dõi và không còn lần ghi nào chạy hay chờ (kể cả việc `track` sau khi `flush()` bắt đầu); reject `SAVE_FAILED` như nay.

##### Test chấp nhận

- [ ] Unit `persist-queue`: lần ghi đang chạy, gọi `flush()`, rồi `track` một việc → `flush()` chỉ xong sau việc đó (probe của DR6-139 ở bản tổng hợp đỏ trước khi sửa). Ca S2-6 hiện có xanh.
- [ ] Unit `app-data`: một listener ném → `run()` trả kết quả, lệnh đã ghi, `console.error` một lần, listener khác vẫn được gọi.
- [ ] e2e (exe giả): focus ở "Thử lại", một lần lưu khác thành công → focus ở tiêu đề màn, không ở `BODY`.
- [ ] e2e (exe giả): hộp đóng app đang hỏi, một lần lưu khác thành công → hộp không đổi sang câu "chương trình khác"; cửa sổ đóng sau khi lưu đủ.
- [ ] e2e: Thử lại khi người dùng đã chuyển focus đi trong lúc lưu → focus ở yên (đột biến RB2c bị giết).
- [ ] `pnpm verify`, `pnpm e2e` xanh.

Ước lượng: ≈ 30–45 dòng SP + ≈ 120 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med (lưu và đóng app)

##### Bị chặn bởi

Không

## PR #911 — fix: flush() waits for a late replace, AppData listeners apart, focus and close question after another save (T-321)

Trạng thái: MERGED · merge 2026-10-31T05:10:27Z · commit `59fdfca116e78b3c25a26e9ac7d53f6a876923bd` · nhánh `task/T-321-save-close-focus` · nhãn: risk:med

Closes #898

Nhóm **L4-C** của đợt sửa lượt 4 (lưu và đóng app, gói B / D): DR6-139, DR6-140, DR6-147, DR6-146 (b).

#### Thay đổi

- **DR6-139 (`flush()` chờ lần thay bắt đầu muộn).** `persist-queue.ts`: hai bước đầu của `flush()` giữ nguyên (chờ việc theo dõi; hàng đợi rảnh mà còn snapshot lỗi thì ghi lại nó một lần). Sau đó `flush()` lặp tới khi không còn lần ghi chạy / chờ **và** không còn việc theo dõi: `while (running || tracked.size > 0) await (running ?? Promise.allSettled(tracked))`.
  - Một lần thay (Nạp lại / Nhập backup / Dọn sạch) bắt đầu trong lúc `flush()` chờ lần ghi nay được chờ, cả lần lưu dữ liệu mới của nó: bấm X rồi xác nhận một lần thay trước khi lưu xong không còn làm cửa sổ đóng giữa lúc thay (S2-6).
  - Luật ghi lại không đổi: lần ghi đang chạy (và việc xếp sau nó) quyết kết quả, không ghi lại thêm (ca "flush() waits for a waiting snapshot, and rejects when that write fails" vẫn giữ).
  - Doc của `flush()` ghi hợp đồng của Issue: xong khi không còn việc theo dõi và không còn lần ghi, kể cả việc `track` sau khi gọi.
- **DR6-140 (listener của `AppData`).** `changed()` (`app-data.ts`) bọc từng listener một `try`, lỗi qua `console.error`, như `persist-queue` (NIT #87). Listener ném không còn làm `run()` ném sau khi lệnh đã ghi, cũng không chặn các listener sau. Cùng `changed()` nên lần thay và Dọn sạch cũng không còn reject sau khi đã đổi dữ liệu. Doc của `subscribe` ghi luật này.
- **DR6-147 (a) (focus khi dải lưu lỗi gỡ).** `SaveWarning.tsx`: một listener của hàng đợi lưu chạy ngay lúc hàng đợi báo lần lưu thành công, trước khi React gỡ dải. Lúc đó focus còn nằm trong dải thì về tiêu đề màn.
  - Áp cho mọi lần lưu thành công, bởi "Thử lại" hay không (phân tích AI ghi xong…).
  - Focus đã chuyển sang chỗ khác thì ở yên, như trước.
  - Nhánh của "Thử lại" (`flush().then`) còn đúng vế `body`: focus rơi về trang trong lúc lưu (bấm vào chỗ trống; trình đọc màn hình kích hoạt nút mà không chuyển focus hệ thống) → tiêu đề, như trước. Vế "focus còn ở nút" của bản cũ nay listener lo, khi nút còn trong trang.
  - `SaveFailed` nhận `ref` (prop của React 19, như `DataTable`) để `SaveWarning` biết dải; `onRetry` không cần nút nữa.
- **DR6-147 (b) (hộp đóng app khi một lần lưu khác thành công).** `close-guard.ts`: hàm mới `askWhileFailed(saves, show)`, câu hỏi của `ClosePort.ask`. Hộp hiện qua `show`, và hàm nghe hàng đợi lưu:
  - lần lưu gần nhất hết lỗi trong lúc hỏi → tự trả lời "retry", gỡ hộp. `closeAfterSaving` gọi `flush()` lại: không còn gì thì đóng cửa sổ; lần ghi xếp sau lỗi thì hỏi lại, câu theo nguyên nhân mới;
  - một lần lưu khác lỗi trong lúc hỏi → hộp ở lại;
  - lúc hỏi mà đã hết lỗi → trả lời "retry" ngay, không hiện hộp;
  - người dùng trả lời → thôi nghe, không lần lưu nào sau đó trả lời thay.
  - `CloseGuard.tsx` dùng nó. Hộp không còn đổi sang câu "chương trình khác" của một lỗi đã hết.
  - Đã thử thêm một chặn ở render (`!failed` thì không hiện hộp), phòng React render trạng thái lưu mới trước câu trả lời. Đột biến bỏ chặn sống, và `MutationObserver` không thấy câu nào đổi: React 19 render lần đổi của `useSyncExternalStore` cùng `setAnswer` (gọi cùng lúc) trong một lần. Nên đã bỏ chặn đó, không để code không bao giờ có tác dụng.
- **DR6-146 (b) (test hở).** Ca e2e Thử lại khi người dùng đã chuyển focus đi trong lúc lưu (dưới).
- Không đổi màn, câu chữ, Rust hay cấu hình build (không cần `build-exe`). Hướng dẫn sử dụng (`01-bat-dau.md` "Khi app chưa lưu được", `10-su-co.md`) và NT-DB-11 / 24 / 25 vẫn đúng: bản sửa chỉ thêm nhánh hộp tự đóng khi dữ liệu đã lưu được.

#### Test chấp nhận

- [x] Unit `persist-queue`: lần ghi đang chạy, gọi `flush()`, rồi `track` một việc → `flush()` chỉ xong sau việc đó và lần ghi nó persist ("flush() waits for work tracked once it began, while a write ran, and what it persists (DR6-139)"). Đỏ trước khi sửa: `flush()` xong khi việc chưa xong. Ca S2-6 có sẵn xanh.
  - Thêm ca tích hợp `app-data.test.ts` "closing the app waits for a replace called while the close waits for a save… (DR6-139)" (kịch bản DSR4-B1): lần lưu bị giữ, `flush()`, rồi `reloadDemoData()`. File cuối là dữ liệu mới; trước khi sửa là dữ liệu cũ + thay đổi đang lưu.
- [x] Unit `app-data`: một listener ném → `run()` trả kết quả, team đã ghi, `console.error` đúng một lần với đúng lỗi, listener kia được gọi một lần. Đỏ trước khi sửa.
- [x] e2e (exe giả): focus ở "Thử lại", một lần lưu khác thành công (lần lưu bị giữ của một team khác, như phân tích AI ghi xong) → focus ở tiêu đề "Team & nhân sự". Đỏ trên code cũ: focus về `BODY`.
- [x] e2e (exe giả): hộp đóng app đang hỏi (`READ_ONLY`), phân tích OpenCode bị giữ xong và ghi → hộp gỡ, cửa sổ đóng (`events` kết thúc `['save', 'destroy']`).
  - Một `MutationObserver` ghi mọi chữ của hộp từ lúc hỏi: không có "chương trình khác".
  - Trên code cũ: hộp ở lại, không `destroy`. Chạy riêng tới lúc sidebar "Đã lưu" thì observer ghi đúng câu "…file có thể đang bị chương trình khác mở…" (khớp CLR4-D3 K7).
- [x] e2e: "Thử lại", trong lúc lưu Tab sang "+ Nhân sự" → focus ở yên khi lưu xong. Vòng 2: bấm vào chỗ trống trong lúc lưu → focus về tiêu đề. RB2c bị giết (bảng dưới).
- [x] `pnpm verify` xanh (3 986 test); `pnpm e2e` xanh (311 passed, 4,4 phút).
- [x] Cỡ: SP +70 / −25 (gồm comment), test +246 / −2 (9 file).

#### Đột biến

Mỗi đột biến áp riêng, chạy rồi hoàn lại; script ở scratchpad của phiên, không commit.

| Đột biến | Chạy | Kết quả |
|---|---|---|
| `flush()` như cũ (`await idle()` sau bước ghi lại) | unit 3 file `data`, `close-guard` | bị giết (2 đỏ: ca DR6-139 của `persist-queue` và `app-data`) |
| `flush()` chỉ chờ lần ghi (`while (running) await running`) | như trên | bị giết (2 đỏ) |
| `AppData.changed` bọc `try` ngoài vòng lặp (listener ném chặn các listener sau) | `app-data.test.ts` | bị giết (1 đỏ) |
| `askWhileFailed`: trả lời mà không thôi nghe | `close-guard.test.ts` | bị giết (1 đỏ) |
| `askWhileFailed`: luôn hiện hộp, kể cả khi đã hết lỗi | như trên | bị giết (1 đỏ) |
| `askWhileFailed`: mọi lần đổi trạng thái lưu đều trả lời (cả lần lưu lỗi) | như trên | bị giết (1 đỏ) |
| **RB2c** trên code cũ (`.then` của Thử lại luôn đưa focus về tiêu đề) | e2e ca DR6-146 | bị giết |
| RB2c trên code mới (`.then` luôn về tiêu đề) | e2e ca DR6-146 | bị giết (vòng 1) |
| Listener của dải không xét focus ở đâu (luôn về tiêu đề khi hết lỗi) | e2e ca DR6-146 | bị giết (vòng 1) |
| Listener của dải không đưa focus | e2e ca DR6-147 (a) | bị giết |
| Thử lại bỏ vế `body` (focus rơi về trang ở yên) | e2e ca DR6-146 | bị giết (vòng 2) |
| Code cũ của `SaveWarning` + `CloseGuard` | 3 ca e2e mới | 2 ca DR6-147 đỏ; ca DR6-146 xanh (code cũ đúng ở nhánh này, ca giữ nó) |

#### Ghi chú OPEN liên quan

- Không có (`node tools/notes-for.mjs --diff`: không có ghi chú OPEN nào nêu 9 file của PR).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-321 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #899 — T-322: Lượt 4 L4-D: Mock trích xuất chỉ đề xuất từ câu kể đơn về KH, lỗi AI giữ lại theo dữ liệu (DR6-141, 144)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Nhóm **L4-D** của đợt sửa lượt 4 (AI, gói C):

1. **DR6-141 — Mock trích xuất, theo Q1 (a) (Owner đồng ý 31/10).** Mock còn đề xuất sai cho KH ở các dạng câu ngoài DR6-121 / T-289, vì các luật bỏ cụm chỉ xét chữ đứng **trước** cụm. Đảo thành danh sách cho phép (hướng của T-289): chỉ đề xuất khi vế là câu kể đơn về chính KH ("KH [đã / đang / hiện] kết hôn / độc thân", "KH có N con / bé"), và vế không còn chữ nào ngoài danh sách chữ đệm; mọi dạng khác không đề xuất. Cập nhật câu về Mock trích xuất ở spec Phase 5 §10.
2. **DR6-144 — lỗi AI giữ lại sống qua thay dữ liệu.** `AiJobs` giữ kết quả lỗi của lần chạy kết thúc khi RE ở màn khác (T-297), theo khóa `analysis:<id KH>`, không gắn với dữ liệu. Sau Nhập backup / Nạp lại, mở hồ sơ vẫn báo lỗi của lần chạy trên dữ liệu cũ. Sửa: ghi `generation` của dữ liệu lúc job kết thúc cùng kết quả giữ lại; bỏ kết quả của `generation` khác (như câu trả lời / lỗi về trong lúc thay, DR5-36, S2-3).

##### Bối cảnh

Deep review Phase 1–6 lượt 4: tổng hợp T-318 #893, PR #895, §6.3 và §8.2 (nhóm L4-D); câu hỏi §9 Q1, Owner 31/10 chọn (a). DR6-141 có từ trước (giống hệt `119e2e4`), là biến thể còn hở của DR6-121 / T-289 mà ba lượt liền đều thấy thêm dạng mới. Đề xuất Mock không tự lưu (spec Phase 5 §8), OpenCode không dùng thuật toán này. DR6-144 mới do #835.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` §6.3 (DR6-141, 144), §8.2 (L4-D), §9 Q1
- Báo cáo gốc (PR #894): `docs/reviews/raw/2026-10-31/claude/C.md` (CLR4-C1: 28 câu của `p03-mock`, đếm 1 332 đề xuất trên ghi chú thật; CLR4-C3: probe `p09-kept`), `docs/reviews/raw/2026-10-31/codex/C.md` (CXR4-C1: "… là sai")
- `docs/design/phase-5-ai.md` §8 (AI trích xuất), §10 (Mock); `docs/design/phase-5-prompts.md` (quy tắc 1 của `extraction@1`)
- `packages/ai/src/mock-adapter.ts` (+ test)
- `apps/desktop/src/data/ai-jobs.ts` (+ test), `apps/desktop/src/data/ai-analysis.ts` (`AppAi`), `apps/desktop/src/data/app-data.ts` (`generation`), `apps/desktop/src/routes/customers/use-ai-job.ts`

##### File / thư mục được phép sửa

- `packages/ai/src/mock-adapter.ts`, `packages/ai/src/mock-adapter.test.ts`
- `apps/desktop/src/data/ai-jobs.ts`, `apps/desktop/src/data/ai-analysis.ts` và test của chúng
- `apps/desktop/src/routes/customers/use-ai-job.ts`
- `docs/design/phase-5-ai.md` (§10, câu về Mock trích xuất)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `2e51e25`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

Không đổi API công khai của `@p2c/ai`. `AiJobs.kept(key)` không trả kết quả của dữ liệu đã thay.

##### Test chấp nhận

- [ ] 18 câu sai của CLR4-C1 (phủ định khẩu ngữ "đâu", "làm gì"; "định / tính sinh"; "con dấu / con tem"; người đi cùng; trạng thái cũ; "khi …"; danh sách lựa chọn) và 2 câu của CXR4-C1 ("… là sai") → 0 đề xuất.
- [ ] Các ca hiện có của `mock-adapter.test.ts` (DR6-121, T-288, T-289) xanh; câu kể đơn về KH vẫn ra đề xuất.
- [ ] Đề xuất trên ghi chú thật (dữ liệu tải + seed) so bản `2e51e25`: ca nào đổi thì nêu trong thân PR, và mỗi ca đổi là một câu sai.
- [ ] Lỗi AI giữ lại không hiện sau Nhập backup / Nạp lại; vẫn hiện một lần khi chỉ rời rồi quay lại hồ sơ (ca e2e của T-297 xanh).
- [ ] `pnpm verify`, `pnpm e2e` xanh.

Ước lượng: ≈ 35–70 dòng SP + ≈ 80 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #917 — fix(ai): Mock extraction only from a simple statement about the KH; kept AI errors follow the data (T-322)

Trạng thái: MERGED · merge 2026-10-31T16:22:07Z · commit `5d13f5a9e47ed3fccb7143291a57f96ba8314153` · nhánh `task/T-322-mock-allowlist-kept-generation` · nhãn: risk:low

Closes #899

#### Thay đổi

##### 1. DR6-141: Mock trích xuất chỉ đề xuất từ câu kể đơn về KH (Q1 (a), Owner 31/10)

Hướng làm: thêm một cổng danh sách cho phép, đặt **sau** các luật chặn sẵn có (`packages/ai/src/mock-adapter.ts`). Các luật chặn cũ chỉ đổi theo hướng chặn thêm, nên cổng chỉ bớt đề xuất, không thêm đề xuất nào:
- `RETRACTED` nhận tối đa hai chữ giữa "không / chưa" và "đúng / chính xác", và xét cả ghi chú;
- `endedBy` thêm chữ kết thúc cụm;
- bỏ "cháu" khỏi mẫu Số con.

Mock chỉ đề xuất "đã kết hôn", "độc thân" và số con khi đạt đủ các điều kiện dưới đây.

Không câu nào có đề xuất mà `c9a6af3` không có. Đã đo hai lần:
- ở `46c7674`, trên 1 236 câu: câu của test, các câu đó viết lại mở bằng "Khách …" / "Hai vợ chồng …", câu của `p03-mock`, của review và của app;
- ở head mới, trên kho 637 câu: mọi chuỗi có cụm của file test ở `c9a6af3`, `46c7674` và head, câu của `p03-mock`, câu trong comment của PR, câu của app. Các sửa sau `46c7674` chỉ thêm điều kiện bỏ.

- **Vế mở bằng KH.**
  - Ở đầu ghi chú, khi chưa có chữ nào của ghi chú đứng trước (`OPENS`):
    - "KH", "Khách (hàng)" (`KH_WORD`), cặp vợ chồng KH ("Hai vợ chồng", "Vợ chồng", "Vợ chồng KH", "KH và vợ"), có thể có "Hiện" đứng trước;
    - KH tự nói ("KH cho biết", "Chị nói …", "KH khẳng định chắc nịch");
    - có thể sau dấu đầu dòng và một tiêu đề trong danh sách đóng "Ghi chú:", "Chú ý:", "Lưu ý:", "Chú thích:", "Gặp KH:".
  - Sau đó, ở đầu câu sau hay sau dấu phẩy (`OPENS_AFTER`): chỉ cách gọi có chữ "KH" ("KH gặp anh Nam, KH đã kết hôn"). "Chị nói", "khách", "hai vợ chồng" ở đó có thể là người được nhắc trước ("KH đi cùng chị Lan, chị nói đã kết hôn", "KH là chủ nhà, khách độc thân", "KH giới thiệu khách mới. Khách đã kết hôn.").
  - `OPENS` và `OPENS_AFTER` dựng bằng một hàm `opener`.
  - Dòng "Hôn nhân: …" / "Tình trạng hôn nhân: …" (`FIELD_LINE`), có thể có "KH cho biết lại" đứng trước, ở đầu mọi câu như seed ghi (mỗi dòng một câu). Không nhận dòng này sau dấu phẩy ("Chị Lan, hôn nhân: độc thân"), và không nhận người khác nói nó ("KH đi cùng chị Lan. Chị nói hôn nhân: độc thân.").
- **Vế không tự mở bằng KH** chỉ được tính khi vế ngay trước nó trong câu kết thúc bằng một câu kể đơn về KH ("KH đã kết hôn, có 2 con"; `clausesOf`).
  - Sau mọi chữ khác, vế đó có thể nói về người được nhắc, nên không đề xuất: "KH giới thiệu khách mới, đã kết hôn", "KH là bác sĩ, Lan là y tá, độc thân", "KH là bác sĩ, đã kết hôn".
  - Luật này không dựa vào danh sách từ chỉ người, nên `NAMED` bỏ.
  - Vế tự ghi việc nó kết thúc bằng câu kể đơn về KH, qua hàm `done` của nó. Chú thích `clausesOf` ghi điều kiện thứ tự: mọi cụm của một vế được hỏi xong trước khi vế sau được đọc.
- **Giữa KH và cụm chỉ có chữ đệm** (`FILLER`): đã, đang, hiện, hiện tại, vẫn, còn, nay, cũng, sống, là, người, thì, chắc chắn.
  - Với Số con, cụm mở bằng "có" hay "sống / ở cùng / với", kể cả "có vợ / chồng và <n> con".
  - Một chữ nối ("nhưng", "vì", "nên", "và"; `JOINED`) chỉ mang KH đi tiếp khi đứng ngay sau một câu kể đơn về KH, kể cả ngay sau dấu phẩy: "KH đã kết hôn và có 2 con", "KH đã kết hôn, và có 2 con". "KH gặp người yêu cũ vì có 2 con", "KH nên có 2 con" không đề xuất.
  - "mà" và "còn" không mở vế mới trước cụm: sau một người, chúng nói người đó là ai ("một người mà / còn độc thân").
- **Sau cụm** chỉ có tiểu từ (ạ / rồi / nhé), rồi hết vế hoặc một chữ nối ("nhưng / mà / còn / vì / nên / và"). Riêng từng cụm còn nhận:
  - "đã kết hôn": thêm "lại" và thời điểm kết hôn ("10 năm", "được 5 năm nay", "năm 2010", "khi 25 tuổi");
  - Số con: lời tả con trong danh sách đóng.
    - Gồm "trai / gái / nhỏ / lớn", "của mình", rồi "[đều] đang / đã" (`CHILDREN_NOW`) với một trong các lời tả: "(đi) học / làm [cấp / lớp <n>, mẫu giáo, tiểu học, đại học]", "lớn", "trưởng thành", "lập gia đình", "kết hôn".
    - Chữ khác sau cụm thì không đề xuất: "2 con nhỏ của em gái", "2 bé đang trong bụng", "2 con của anh ấy".
    - Không nhận khi sau nó trong câu còn một số con khác, bằng số hay bằng chữ ("2 con đang đi học và 1 con đã đi làm", "2 con trai và một con gái").
- **Chữ kết thúc cụm** (`endedBy`), sau cụm trong câu, thì cụm không đề xuất:
  - sau "đã kết hôn": "ly hôn", "ly dị", "ly thân", "đã mất", "qua đời", "góa" ("KH đã kết hôn nhưng vợ đã mất");
  - sau số con: "đã mất", "qua đời" ("KH có 2 con nhưng đều đã mất");
  - "mất" đứng trơn không tính ("mất việc").
- **Cả ghi chú:**
  - ghi chú có chữ nói thông tin sai (`RETRACTED`: "sai", "nhầm", "ghi lộn", "đính chính", "không phải", "không / chưa … đúng / chính xác" với tối đa hai chữ ở giữa), ở câu nào cũng vậy, không đề xuất ("KH độc thân. Điều này sai.");
  - ghi chú nói hai giá trị khác nhau của cùng một trường, ở cùng câu hay câu khác, không đề xuất trường đó ("KH độc thân, thực ra đã kết hôn", "KH có 2 con. Thực ra chỉ 1 con.", "KH độc thân. Nay KH đã kết hôn."). Giá trị nói về người khác, bị phủ định, hỏi hay đoán không tính ("KH đã kết hôn, em trai KH độc thân", "KH độc thân. Em gái đã kết hôn.").

Đi kèm:
- Bỏ "cháu" khỏi mẫu Số con, vì (a) chỉ liệt kê "con / bé".
- Bỏ `forTheChildren` / `NOTHING_MORE`. Đoạn này cho "cho 2 con" thoát luật mong muốn, nhưng cổng không bao giờ nhận "cho" trước số con, nên nó không còn tác dụng.
- Cổng đọc mỗi câu / vế có cụm một lần qua `readerOf`, như trước. Vế không có cụm thì không được đọc và cắt chuỗi mang KH: `clausesOf` nhận ra vế bị bỏ qua vì vế đang đọc không nối liền vế đọc trước.
  - Chữ nối cuối cùng của vế tìm bằng con trỏ: "có 2 bé và" lặp 36 000 ký tự trước mất 20 ms, nay 1,5 ms.
  - Các test DR6-79 (ghi chú 36 000 ký tự, dưới 50 ms) xanh, thêm 7 ca cho phần mới.
- Mọi trường đều được đọc, kể cả trường không được hỏi, để một vế kết thúc bằng cụm của trường ấy vẫn mang KH sang vế sau; lọc theo `fields` sau cổng.
- `THE_KH` và `OPENS` dùng chung `KH_WORD` ("KH", "Khách (hàng)").
  - `KH_SUBJECT`, luật có trước DR6-141, vẫn chỉ đọc "KH"; chú thích ghi lý do. Các luật này tha chữ ở chỗ mở mọi vế, mà sau chữ khác "khách" có thể là người khác: "KH đã kết hôn, khách là người độc thân" vẫn ra Đã kết hôn.
  - Vì vậy "Khách là người độc thân." ra 0 (hướng an toàn), có test giữ.
- `docs/design/phase-5-ai.md` §10: viết lại câu về Mock trích xuất theo đúng các luật trên.

**Quyết định của Owner trong phiên.** Cần ghi vào `docs/PROJECT-STATE.md` ở một PR docs sau, vì Issue không cho sửa file đó.
- 31/10, G8 (Q1 (a) "mọi dạng khác không đề xuất" mâu thuẫn với "các ca hiện có xanh"): đảo 12 ca hiện có (comment trên #899). Các ca này đều không phải câu kể đơn về KH.

  | Câu | Trước → Sau |
  |---|---|
  | Gặp KH lần đầu khi KH đã kết hôn, có 2 con. | 2 đề xuất → 0 |
  | KH sẽ cho 2 con đi học thêm. | Số con 2 → 0 |
  | KH đã kết hôn với bạn học cũ, có 2 con. | 2 → chỉ Số con 2 (nay câu đổi, xem dưới) |
  | KH muốn mua bảo hiểm cho 2 con, ưu tiên gói học vấn. | Số con 2 → 0 |
  | Muốn lo cho 2 con | Số con 2 → 0 |
  | Bác sĩ nói KH đã kết hôn, có 2 con. | 2 → 0 (thêm ca "Bác sĩ khám xong, KH đã kết hôn." vẫn ra Đã kết hôn) |
  | KH đã kết hôn hai năm thì không có con. | Đã kết hôn → 0 |
  | KH muốn đầu tư cho 2 con. · Hai vợ chồng dự định mua bảo hiểm cho 2 con. · KH mong lo cho 2 con ăn học. · Muốn lo cho 2 con. | Số con 2 → 0 |
  | Nhà có 2 cháu, đều học cấp 2. | Số con 2 → 0 |

- 31/10, sau review @`bdacfe1`: mục 3 sửa bằng code tới dứt điểm, không ghi giới hạn vào §10, không tính vòng sửa (comment trên PR). Owner chọn hai luật trên ([comment trên #899](https://github.com/AlexH-AI/Project-2C/issues/899#issuecomment-6544354997)): vế sau chỉ được mang KH sang sau một câu kể đơn về KH (A1), và chữ nối cũng vậy (J2). 34 ca hiện có đổi:
  - 29 ca chèn "KH" vào vế sau, kết quả giữ nguyên. Test vẫn kiểm đúng chữ nó nhắm tới, vì `SOMEONE_ELSE` và `GUESSED` xét cả câu:
    - "KH là bác sĩ / cô giáo / đàn ông / cô dâu mới, KH đã kết hôn, có 2 con."; "Hiện tại KH là đàn ông, KH đã kết hôn.";
    - "KH là người miền Nam, KH độc thân."; "KH đã ly hôn, KH đã kết hôn lại, có 2 con."; "KH muốn mua bảo hiểm, KH đã kết hôn, có 2 con.";
    - "KH chú trọng đầu tư / bác bỏ gói cũ / có em bé, KH đã kết hôn, có 2 con.";
    - "KH sống với chồng / đã lấy chồng / vừa cưới vợ / mới lấy chồng / cưới vợ năm 2015 / kết hôn với chồng năm 2015, KH có 2 con.";
    - "KH đã kết hôn với bạn học cũ / lấy đồng nghiệp / cưới người quen năm 2015, KH có 2 con.";
    - 7 ca "chắc" ("KH có tài chính vững chắc, KH đã kết hôn.", săn chắc, rắn chắc, biết chắc, nắm chắc, ăn chắc mặc bền, bền chắc);
    - "KH chưa đăng ký kết hôn, KH hiện sống độc thân."; "KH sống cô đơn, KH vẫn độc thân.".
  - 5 ca đảo về 0: "KH có em bé, đã kết hôn." (ca thêm ở `bdacfe1` cho `NAMED`), "KH sẽ cân nhắc vì còn độc thân.", "KH sẽ cân nhắc vì có 2 con.", "KH sẽ cân nhắc gói cho gia đình vì có 2 con.", "KH vừa thay việc nhưng vẫn độc thân.".
  - 4 câu gốc đại diện của các ca chèn "KH" nay nằm trong test ra 0: "KH là bác sĩ, đã kết hôn, có 2 con.", "KH là người miền Nam, độc thân.", "KH sống với chồng, có 2 con.", "KH cưới người quen năm 2015, có 2 con.".
- 31/10, chấp nhận cỡ diff ở `46c7674` ("Chấp nhận 875 dòng", comment trên PR).
- 31/10, sau review @`46c7674` (comment trên #899):
  - đảo thêm 1 ca theo danh sách đóng sau số con: "KH có 2 con của anh ấy." (DR6-121) Số con 2 → 0;
  - Correctness 1: thêm chữ kết thúc "ly thân", "đã mất", "qua đời", "góa" (sau "đã kết hôn") và "đã mất", "qua đời" (sau số con);
  - Correctness 2: luật hai giá trị và `RETRACTED` xét cả ghi chú;
  - chấp nhận cỡ diff ở head mới, với số đếm đúng luật (mục Kiểm tra).

##### 2. DR6-144: lỗi AI giữ lại theo dữ liệu

- `AiJobs.start` nhận `keep: AiJobKeep<T>` = `{ keeps, generation }`. `apps/desktop/src/data/app-data.ts` không nằm trong danh sách file được sửa, nên `generation` đi vào qua `start`, chứ không qua lúc tạo `AppAi`.
- Khi job kết thúc, `AiJobs` đọc `generation` và lưu cùng kết quả giữ lại. `kept(key)` chỉ trả kết quả khi `generation` hiện tại vẫn bằng giá trị đã lưu. Hợp đồng "`kept(key)` không trả kết quả của dữ liệu đã thay" vì vậy nằm trong `AiJobs`.
- `useAiJob` truyền `keptFailures(app)` (ở `ai-analysis.ts`): lỗi / failed / invalid, đọc `generation` của `AppData`.

##### 3. Ghi chú L19 (review #911): listener của `AiJobs`

`changed()` gọi mỗi listener trong một `try`, như vòng gọi của `AppData` và của hàng đợi lưu. Lỗi đi qua `reportError` của `AiJobs`, là kênh báo bug sẵn có của module. Trong app, `AppData` không truyền `reportError`, nên kênh này là `console.error`, đúng như ghi chú đề xuất; test thì kiểm được lời báo.

#### Test chấp nhận

- [x] 18 câu sai của CLR4-C1 và 2 câu của CXR4-C1 → 0 đề xuất: test `proposes nothing from %j: not a simple statement about the KH (DR6-141)`.
- [x] Các ca hiện có của `mock-adapter.test.ts` (DR6-121, T-288, T-289) xanh, trừ các ca Owner đồng ý đảo / đổi ở trên. Câu kể đơn về KH vẫn ra đề xuất (test `reads %j as %j: a simple statement about the KH (DR6-141)`). Các câu ở file không được sửa cũng vẫn ra đủ đề xuất:
  - e2e `customer-ai.spec.ts`: "Hai vợ chồng đã kết hôn, có 2 con đang học cấp 1.";
  - `run.test.ts`: "Chị nói hai vợ chồng đã kết hôn, có 2 bé.";
  - `ai-analysis.test.ts`: "Hai vợ chồng đã kết hôn 10 năm, có 2 con đang học cấp 1.";
  - NT-AI-17 của `nghiem-thu-v1.md`: "Khách đã kết hôn, có 2 con nhỏ".
- [x] Ghi chú thật so với `main` `c9a6af3`. `mock-adapter.ts` không đổi từ `2e51e25` tới đó, nên đây cũng là bản ghim.
  - Đo lại ở head mới, trên toàn bộ ghi chú RE của dữ liệu tải lượt 4 (`load-2026-10-12-seed6.p2cbackup`) và seed demo ở 3 ngày neo (29/10/2026, 28/02/2026, 31/12/2027). Cách đo như `p03-mock` của Claude C; adapter của `c9a6af3` (base), `46c7674` (head) và bản mới (cur) chạy trong cùng tiến trình:

    ```
    real RE notes: 3551 distinct; proposals base 1332 → head 1332 → cur 1332; cur ≠ head 0; cur adds to base 0
    ```

  - Không ca nào đổi. Toàn bộ 1 332 đề xuất đến từ dòng "Hôn nhân: Đã kết hôn" / "Hôn nhân: Độc thân", trong đó 2 dòng có "KH cho biết lại" đứng trước.
  - Với các câu tự viết của `p03-mock` (phần 1 và 3) và CXR4-C1 (53 câu), có 24 câu đổi so với `c9a6af3`:
    - 20 câu là các câu sai ở trên;
    - "KH có 1 con riêng và 1 con chung.": trước ra Số con 1, trong khi KH có 2 con;
    - "\"Tôi đã kết hôn\", chị Lan nói về KH.": trước ra Đã kết hôn từ lời trích của người khác, và `p03-mock` xếp câu này là "khó định";
    - 2 câu đúng nay không đề xuất (hướng an toàn), theo luật A1 / J2 Owner chọn: "KH đã kết hôn hai lần, hiện đã ly hôn và độc thân." (Độc thân → 0: "đã kết hôn" bị "ly hôn" kết thúc nên vế đầu không mang KH sang) và "KH married, đã kết hôn 3 năm." (Đã kết hôn → 0).
  - Cũng theo hướng an toàn, các dạng sau nay ra 0; không ca có sẵn nào có các dạng này:
    - "Khách", "Hai vợ chồng", "Chị nói" ở đầu một câu sau không còn được tính là KH: "Gặp tại văn phòng. Khách đã kết hôn, có 2 con." → 0;
    - dòng hôn nhân chỉ nhận "KH" nói: "Khách cho biết lại Hôn nhân: Độc thân" → 0;
    - sau review @`46c7674`, Owner biết khi chọn: "KH có 2 con đều học giỏi." (lời tả ngoài danh sách đóng), "KH đã kết hôn, đã mất việc năm ngoái." ("đã mất"), "KH có 2 con. Anh Nam có 3 con." (giá trị thứ hai trong ghi chú), "KH độc thân. Hẹn sai giờ." ("sai").
- [x] Lỗi AI giữ lại không hiện sau Nhập backup / Nạp lại:
  - unit `ai-jobs.test.ts`: `generation` đổi, và `generation` được đọc lúc job kết thúc;
  - `ai-analysis.test.ts`: chạy qua `openAppData`, `analyseCustomer` lỗi `AI_TIMEOUT`, rồi Nạp lại hay Nhập backup chính dữ liệu đó → `kept` rỗng.

  Ca vẫn hiện một lần khi chỉ rời rồi quay lại hồ sơ: ca e2e của T-297 xanh (`pnpm e2e`).
- [x] `pnpm verify`, `pnpm e2e` xanh ở local (Home PC).

#### Ghi chú OPEN liên quan

- L17 `docs/design/phase-5-ai.md` (§7.3, "100 ký tự"): để lại. Issue chỉ cho sửa §10 của file này, và mục đã gắn [G7].
- L19 `apps/desktop/src/data/ai-jobs.ts` (`AiJobs.changed` gọi listener trần): đã sửa (mục 3 ở trên). Mục [G7] L20 (chép vòng gọi listener ở ba nơi) vẫn để G7: bản ở `AiJobs` báo lỗi qua `reportError`, nên khi gom, hàm chung cần nhận cách báo.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- Cỡ (so `c9a6af3`, 8 file đều trong danh sách của Issue; luật đếm của repo, `docs/metrics/phase-6.md`: dòng thêm + dòng xóa):
  - code sản phẩm 465 dòng (`mock-adapter.ts` 378, `ai-jobs.ts` 51, `use-ai-job.ts` 20, `ai-analysis.ts` 16), vượt mức ~400 của ADR-0001 khoảng 16 %;
  - tổng diff 938 dòng (800 thêm, 138 bớt; test 465, docs 8), vượt mức ~800 khoảng 17 %. Phần vượt chủ yếu là test của các mục review, cùng 29 ca Owner đồng ý viết lại (mỗi ca tính cả dòng thêm lẫn dòng bớt);
  - ở `46c7674`: SP 439, tổng 875. Bản trước của thân PR ghi SP 362, là số dòng thêm, không theo luật đếm;
  - Owner chấp nhận cỡ này (31/10, sau review @`46c7674`).
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`. Review lên mức `high` vì PR sửa `packages/ai/**`, nên Owner merge.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-322 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #911, #917 — T-322 (#899, PR #917, `REVIEW: PASS` @`6e7a498`):
  - #911, `apps/desktop/src/data/ai-jobs.ts` (`AiJobs.changed`, `:70-80`): mỗi listener một `try`, lỗi qua `reportError` của `AiJobs` (trong app là `console.error`, `apps/desktop/src/data/ai-analysis.ts:109`); listener ném không làm `start()` ném với job đã chạy, các listener sau vẫn được gọi. Test ở `apps/desktop/src/data/ai-jobs.test.ts`.
  - Ghi chú không chặn của ba vòng `REVIEW: CHANGES` của PR #917 (@`ccdfa56`, @`bdacfe1`, @`46c7674`) đã làm trong PR: đường nối `generation` của hook có test (`keptFailures` ở `apps/desktop/src/data/ai-analysis.ts`, ca qua `openAppData` ở `apps/desktop/src/data/ai-analysis.test.ts`); chú thích `kept` ghi ngoại lệ khi dữ liệu bị thay (`apps/desktop/src/data/ai-jobs.ts`); ở `packages/ai/src/mock-adapter.ts`: chữ nối dùng chung `STARTS_ANOTHER`, "Hiện…" dùng chung `NOW`, chú thích `FILLER` và `KH_SUBJECT` ghi vì sao khác, đổi tên `before` / `current`, bỏ `NAMED` (luật A1 / J2), `OPENS` / `OPENS_AFTER` dựng bằng `opener` và `KH_SAYS` dùng chung, vế tự ghi trạng thái qua `done(end)` kèm chú thích thứ tự ở `clausesOf`, "hiện tại" / "cũng" vào `FILLER` và "KH:" mở vế, chữ nối ngay sau dấu phẩy (`JOINS_ON`), `RETRACTED` và luật hai giá trị, chữ kết thúc cụm (`endedBy`); §10 của `docs/design/phase-5-ai.md` thêm các dạng số con, "mà / còn", "Vợ chồng". Các mục cần chọn hướng (Correctness 4, 5 của @`ccdfa56`; Correctness 1, 2 của @`46c7674`) sửa theo quyết định Owner 31/10 (comment trên PR #917 và #899).

---

# Issue #900 — T-323: Lượt 4 L4-E: đợt G5 lượt 4, NUL không làm lọt V3–V6, miễn "giới" trước "luật" hẹp lại (DR6-142, 143)

Trạng thái: CLOSED · nhãn: type:task, risk:med, gate, ready-for-agent

##### Mục tiêu

Nhóm **L4-E**: **đợt G5 lượt 4** theo Q2 (a) (Owner đồng ý 31/10). Hai PR: PR docs G5 trước, Owner duyệt (G5); rồi PR code. **Owner duyệt G5 §14 ngày 31/10/2026 ("duyệt hết", PR #909):** bước 0 bỏ cả NUL (chỉ bản so khớp), "giới" chỉ được miễn khi không đứng sau "môi / ranh / biên / thế" (giữ "thế"), `analysis@5` / `discovery@5`. Chỗ chữ dưới khác §14 thì theo §14.

1. **PR docs:** §14 mới của `docs/design/phase-5-prompts.md`: hai luật đổi, ca kiểm, phần "Mất" nếu có, version.
2. **DR6-142 — NUL làm V3–V6 lọt.** `cleanText` = `normalizeText` giữ NUL (K25 chỉ từ chối NUL ở chỗ lưu), nên cụm bị chặn đứng hai bên NUL không khớp ("phần\^@trăm", "xác\^@suất" qua V3, bản có dấu cách bị chặn). Sửa: bước 0 của so khớp bỏ NUL như ký tự vô hình. Chỉ ở bản so khớp, không đổi chữ lưu.
3. **DR6-143 — "giới" được miễn quá rộng ở V6.** `LAW_NAME` miễn "giới" trước "luật" ở mọi từ ghép (G5 §12.5), nên "môi giới Luật …", "ranh giới Luật …", "biên giới Luật …" lọt. Sửa: miễn "giới" trừ khi nó đứng sau "môi", "ranh", "biên", "thế" (như "định" sau "quy / qui").
4. **Version prompt theo quyết định G5:** đổi luật kiểm như §12 thì `analysis@5`, `discovery@5` (giữ `extraction@1`, `web@1`). Eval AI thật ở G7 (NT-EV-01) chạy với version cuối.

##### Bối cảnh

Deep review Phase 1–6 lượt 4: tổng hợp T-318 #893, PR #895, §6.3 và §8.2 (nhóm L4-E); câu hỏi §9 Q2, Owner 31/10 chọn (a). DR6-142 có từ trước, cần output suy biến (model viết `\^@`); DR6-143 mới do #766 (G5 §12.5), kho chữ thật 0 lần. Đổi danh sách / cách so khớp = qua G5 (`packages/ai/CLAUDE.md`). Đợt G5 lượt 3 làm mẫu: §12 (#728 → #762, #766).

##### Tài liệu cần đọc

- `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` §6.3 (DR6-142, 143), §8.2 (L4-E), §9 Q2
- Báo cáo gốc (PR #894): `docs/reviews/raw/2026-10-31/deepseek/C.md` (DSR4-C1: probe 1), `docs/reviews/raw/2026-10-31/claude/C.md` (CLR4-C2: `p06-g5` phần b)
- `docs/design/phase-5-prompts.md` §7 (cách so khớp), §8 (danh sách chặn), §11, §12 (hai đợt G5 trước)
- `packages/ai/src/text-match.ts` (`cleanText`), `packages/ai/src/blocklists.ts` (`LAW_NAME`), `packages/ai/src/schema.ts` (`PROMPT_VERSIONS`), `packages/ai/src/prompts/{analysis,discovery}.ts`, `packages/ai/src/prompts/prompts.test.ts`
- `docs/golden/ai-eval.md` (version của eval)

##### File / thư mục được phép sửa

- `docs/design/phase-5-prompts.md` (§14 mới; PR docs riêng, trước): PR #909
- `packages/ai/src/{text-match,blocklists,schema}.ts`, `packages/ai/src/prompts/{analysis,discovery}.ts` và test trong `packages/ai/src/**`
- Test ghim version prompt: `packages/db/src/*.test.ts`, `apps/desktop/src/**/*.test.ts`
- Chữ version ở tài liệu: `docs/golden/ai-eval.md`, `docs/README.md`, `docs/user-guide/06-ai.md`, `docs/user-guide/11-thuat-ngu.md`
- Thêm cho PR code theo G5 §14.1 (Owner duyệt 31/10/2026): `docs/design/phase-5-prompts.md` (chép §14 vào §2, §3, §6a, §7, §8.4, §8.5; trạng thái §14 và dòng trạng thái đầu file), `docs/design/phase-5-ai.md` (§3.1 mục 3, §6.4: bước chuẩn hóa bỏ cả NUL)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `2e51e25`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

Version prompt mới theo §14 đã duyệt: `analysis@5`, `discovery@5`; `extraction@1`, `web@1` giữ (G5 §14.1, Owner duyệt 31/10/2026). Chữ prompt không đổi.

##### Test chấp nhận

- [ ] "phần\^@trăm", "xác\^@suất" (và với BEL như hiện nay) → bị V3 chặn như bản có dấu cách.
- [ ] "Môi giới Luật Kinh doanh bảo hiểm 2022", "Ranh giới Luật Đất đai …", "biên giới Luật …" → V6; "giới luật Phật giáo", "GIỚI LUẬT Phật giáo", "định luật Pareto" vẫn qua; "quy định Luật …" vẫn V6.
- [ ] 1 085 chuỗi eval và các chuỗi `vi.ts` không đổi kết quả.
- [ ] Ca C80–C83 và các ca ngoài bảng của G5 §14.4 ra đúng; PR code chép C80–C83 vào §8.5.
- [ ] `prompts.test.ts` khớp `phase-5-prompts.md`; version mới ở mọi chỗ ghim.
- [ ] `pnpm verify`, `pnpm e2e` xanh.

Ước lượng: ≈ 5–15 dòng SP + ≈ 40 dòng test, cộng PR docs G5.

##### Định nghĩa hoàn thành

- [ ] Owner duyệt G5 ở PR docs §14 (trước PR code)
- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med; nhãn `gate` (G5)

##### Bị chặn bởi

Không (PR code chờ PR docs §14, #909, merge: Owner đã duyệt G5 31/10/2026)

## PR #909 — docs: propose the fourth Phase 6 G5 round for Owner review (T-323)

Trạng thái: MERGED · merge 2026-10-31T03:45:06Z · commit `1e500e14ed1a09696f07885e3d2cca9a91a93276` · nhánh `task/T-323-g5-round-4-docs` · nhãn: risk:med, gate

Refs #900 (PR docs G5 đi trước; PR code đi sau và đóng Issue)

Đợt G5 Phase 6 lượt 4, theo Q2 (a) của bản tổng hợp lượt 4 (Owner 31/10/2026). **Owner duyệt G5 31/10/2026: "duyệt hết"** (§14.6; ghi ở `26727ec`), giữ "thế" như đề xuất. Đề xuất, lý do và số đo nằm ở §14 mới của `docs/design/phase-5-prompts.md`.

#### Thay đổi

- **§14 mới** (Owner duyệt 31/10/2026; PR code chép vào §2, §3, §6a, §7, §8.4, §8.5):
  - §14.1 version `analysis@5` / `discovery@5`, giữ `extraction@1`, `web@1`. PR code được sửa thêm `docs/design/phase-5-prompts.md` (chép §14 vào thân file) và `docs/design/phase-5-ai.md` (§3.1 mục 3, §6.4). Ảnh `06-ai-phan-tich.png` có `discovery@4`: chụp lại ở G7.
  - §14.2 DR6-142: bước 0 của so khớp bỏ cả NUL (K20 giữ NUL để lệnh lưu từ chối nó; so khớp thì bỏ). Chỉ ở bản so khớp: V1 và chữ lưu không đổi. Dòng dán ChatGPT web dùng chung bước 0, nên dòng mốc có NUL nay ra `OWN_MESSAGE` (hôm nay ở lần 2 app lưu dòng REJECTED, như R2-04).
  - §14.3 DR6-143: "giới" chỉ được miễn trước "luật" khi không đứng sau "môi", "ranh", "biên", "thế" (như "định" sau "quy / qui"); chữ mới của mục §8.4. "Mất": "giới" của từ ghép khác ("nữ giới", "địa giới"…). Tác dụng phụ của "thế": "Vì thế giới luật Phật giáo …" (không dấu phẩy) nay bị V6; đề xuất vẫn giữ "thế" như Q2 (a).
  - §14.4 ca kiểm C80–C83 và hai ca dán ChatGPT web; §14.5 việc không làm (V1 vẫn nhận `text` có NUL); §14.6 danh sách duyệt.
- **Dòng trạng thái đầu file:** thêm "Đợt lượt 4 `analysis@5` / `discovery@5` **Owner duyệt G5 31/10/2026** (T-323 #900, §14; PR code chép vào §1–§8)".
- Không sửa §1–§13. Test đọc nguyên văn các bảng §8 và các khối ```` ````text ```` / ```` ````plaintext ````, nên PR code mới chép §14 vào thân file, cùng lúc với code.

**Đã thử trước khi đề xuất.** Bản thử 3 dòng trong `packages/ai` (`cleanText`, `LAW_NAME`; worktree của task, không commit), script tạm so kết quả V3–V6 của từng chuỗi:

| | Hôm nay (`6e45757`) | Bản thử |
|---|---|---|
| 1 297 test hiện có của `packages/ai` (gồm C1–C79, bảng §8) | xanh | xanh |
| 14 chuỗi có NUL của DR6-142 (V3, V4, V5, V6) | lọt cả 14 | chặn cả 14 |
| 4 ca dán tin nhắn của app có NUL (§6a) | 0 / 4 `OWN_MESSAGE`; lần 2 lưu REJECTED | 4 / 4 `OWN_MESSAGE` |
| 10 câu "Luật <Tên>" sau "môi / ranh / biên / thế giới" | lọt cả 10 | V6 cả 10 |
| "giới luật Phật giáo" (3 kiểu), "định luật Pareto"; C79 "quy định Luật …" | đạt; V6 | như cũ |
| 1 085 chuỗi eval thật, đúng khối | 0 bị chặn | 0 đổi |
| 1 076 chuỗi `vi.ts`, 82 641 chuỗi dữ liệu giả lập (hạt giống 1) | 13 bị chặn (nhãn, tên KH, câu Mock ở `personalityNotes`) | 0 đổi |
| 59 207 dòng khác nhau của `docs/**/*.md` | 1 800 bị chặn | 1 đổi: dòng DR6-143 của bản tổng hợp lượt 4 |

#### Test chấp nhận

- [x] PR docs §14 có Owner duyệt (G5) trước PR code (#900): Owner 31/10/2026 "duyệt hết", ghi ở `26727ec`
- Các mục còn lại của Issue là việc của PR code; ca kiểm tương ứng ở §14.4.

#### Ghi chú OPEN liên quan

Không có (`node tools/notes-for.mjs --diff`: sổ không có ghi chú OPEN nào nêu file này).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

**Thứ tự:**

1. ✅ Owner trả lời §14.6 trong chat: "duyệt hết" (31/10/2026).
2. ✅ Phần duyệt ghi vào PR này ở `26727ec` (trạng thái §14, tick §14.6, dòng trạng thái đầu file). Issue #900 ghi cùng ngày: luật theo §14, hai file thêm cho PR code, ca C80–C83 vào test chấp nhận.
3. Khi CI xanh trên head `26727ec`, Owner gõ "review PR #909" ở phiên sạch. Review đạt thì Owner merge (`risk:med`).
4. Sau đó mới làm PR code của #900.

Rủi ro: `risk:med` (cổng G5, nhãn `gate`; Owner merge)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## PR #913 — feat(ai): fourth Phase 6 G5 round — analysis@5, discovery@5 (T-323)

Trạng thái: MERGED · merge 2026-10-31T07:57:55Z · commit `1eab29618f01c323c00d54e7d7da123ee793f36d` · nhánh `task/T-323-g5-round4-code` · nhãn: risk:med, gate

Closes #900

Đợt G5 Phase 6 lượt 4, PR code. **Owner duyệt G5 31/10/2026** ("duyệt hết", PR #909): bước 0 bỏ cả NUL (chỉ ở bản so khớp), "giới" chỉ được miễn khi không đứng sau "môi / ranh / biên / thế" (giữ "thế"), `analysis@5` / `discovery@5`, hai file thêm cho PR code. Đề xuất, lý do và số đo ở `docs/design/phase-5-prompts.md` §14. Các thay đổi đã chép vào §2, §3 (version), §6a, §7, §8.4, §8.5 (C80–C83) và spec `phase-5-ai.md` §3.1 mục 3, §6.4.

#### Thay đổi

- **Version:** `analysis@5`, `discovery@5`. Chữ prompt không đổi; luật kiểm đổi, như `@4`. `extraction@1`, `web@1` giữ, nên ChatGPT web lưu `analysis@5+web@1`.
  - Seed, e2e (`e2e/fixtures.ts`) và test app lấy version từ `PROMPT_VERSIONS` nên tự theo. Mốc hash seed không đổi: từ T-288, `seed.test.ts` đọc version là một dấu.
  - `ai-eval.md`, `docs/README.md`, hướng dẫn sử dụng (`06-ai.md`, `11-thuat-ngu.md`): `@4` → `@5`.
  - Ảnh `06-ai-phan-tich.png` còn `discovery@4`: chụp lại ở G7 (§14.1).
- **DR6-142 — NUL (§7 bước 0, §14.2):** `cleanText` bỏ NUL trước `normalizeText`, cùng nhóm với ký tự vô hình của K20. "phần" + U+0000 + "trăm" → V3 `có "phầntrăm"` (như BEL).
  - NUL bị bỏ trước NFKC, nên dấu viết sau NUL vẫn ghép vào chữ.
  - Chỉ ở bản so khớp: K20 (`normalizeText`), V1 và chữ lưu không đổi. `text` chỉ có NUL vẫn V1 "không có chữ"; "KH thích" + U+0000 + "đọc sách" vẫn đạt (§14.5).
  - Dòng dán ChatGPT web dùng chung bước 0, nên tin nhắn của app có NUL ra `OWN_MESSAGE` ở cả hai lần.
- **DR6-143 — "luật <Tên>" sau "giới" (§8.4, §14.3):** `LAW_NAME` miễn "giới" trừ khi "giới" đứng sau "môi", "ranh", "biên", "thế" (mọi kiểu chữ, đủ cả từ). Viết như "định" sau "quy / qui" (lookbehind lồng).
  - Ô §8.4 chép nguyên văn §14.3. `blocklists.test.ts` đọc ô đó, thêm mẫu "môi giới Luật Kinh doanh bảo hiểm".
  - Tác dụng phụ đã duyệt: "Vì thế giới luật Phật giáo…" (không dấu phẩy) nay V6. "Mất" đã duyệt: "nữ giới Luật Lao động…" vẫn đạt. Cả hai ghim bằng test.
- **Tài liệu G5:**
  - Dòng trạng thái đầu file bỏ "PR code chép vào §1–§8". Trạng thái §14 viết như §12 ("đã chép vào…").
  - §14.4 thay bảng bằng "Đã chép vào bảng §8.5 (C80–C83)", giữ "Ngoài bảng".
  - C54 ghi `@5`; tiêu đề §8.5 thêm "C80–C83 đợt lượt 4, T-323".
- **Sau review #913** (Owner 31/10/2026 chọn (a) cho mục Correctness 1, chấp nhận như §11.8; commit `f8db0b7`):
  - §14.5 thêm dòng "Mất": NUL đặt làm dấu cách **ngay cạnh** một cụm bị chặn làm cụm dính vào chữ bên cạnh, nên lọt. Ví dụ: "KH có" + U+0000 + "xác suất cao" (V3), "Đề xuất" + U+0000 + "Prudential cho KH" (V4), "Theo" + U+0000 + "Điều 35" (V6); trên `main` các câu này bị chặn.
  - Cùng dòng ghi mặt "Được": "KH thích đồng hồ Ato" + U+0000 + "mic" trước bị V4 `có "mic"`, nay đạt.
  - `validator-blocklists.test.ts` ghim bốn chuỗi đó → đạt. Bỏ bước bỏ NUL (hành vi của `main`) thì cả bốn đỏ.
  - Không đổi luật, không đổi code; giữ `analysis@5` / `discovery@5`. Các ghi chú không chặn khác của review vào sổ như thường.

#### Test chấp nhận

- [x] "phần" + U+0000 + "trăm", "xác" + U+0000 + "suất" (và với BEL như hiện nay) → bị V3 chặn như bản có dấu cách (C80).
- [x] "Môi giới Luật Kinh doanh bảo hiểm 2022", "Ranh giới Luật Đất đai …", "biên giới Luật …" → V6 (C82). "giới luật Phật giáo", "GIỚI LUẬT Phật giáo", "định luật Pareto" vẫn qua (C78, C83). "quy định Luật …" vẫn V6 (C79).
- [x] 1 085 chuỗi eval và các chuỗi `vi.ts` không đổi kết quả (số đo dưới).
- [x] Ca C80–C83 và các ca ngoài bảng của G5 §14.4 ra đúng; C80–C83 đã chép vào §8.5.
- [x] `prompts.test.ts` khớp `phase-5-prompts.md`. Version mới ở mọi chỗ ghim: `prompts.test.ts`; `schema.test.ts` so `PROMPT_VERSIONS` với `version` của từng prompt; test app, `db`, e2e đọc `PROMPT_VERSIONS`.
- [x] `pnpm verify`, `pnpm e2e` xanh.

**Ca ngoài bảng (§14.4):**

- Tin nhắn `web@1` có NUL trước mỗi dòng khung → `OWN_MESSAGE` ở lần 1.
- Ở lần 2, message thử lại có NUL ở đầu và cuối mỗi dòng → `OWN_MESSAGE`. Phiên còn mở: câu trả lời đúng dán sau đó ACCEPTED ở lần 2.
- `detail` của "Bảo" + U+0000 + "Việt" là `có "BảoViệt"`.
- Viết NFD với NUL trước mỗi dấu: "KH dễ chốt" V3, "Theo Điều 35" V6.

**Số đo.** Script tạm ngoài repo gọi `matchText` / `BLOCKLISTS` thật. Chạy trên `867f4bc` rồi trên PR, so V3–V6 của từng chuỗi. Mỗi chuỗi eval ở đúng khối của nó; V5 không áp cho `personalityNotes`.

| Kho chữ | Số chuỗi | Bị chặn `main` → PR | Đổi kết quả |
|---|---|---|---|
| `text` eval thật 10/10 + 11/10 | 1 085 (không chuỗi nào có NUL) | 0 → 0 | 0 |
| giá trị `vi.ts` | 1 198 (1 076 khác nhau) | 4 → 4 | 0 |
| dòng khác nhau của `docs/**/*.md`, có ở cả hai bản | 59 774 | — | 7, đều trích chính câu của DR6-143 (§14 và §8.5 của G5, dòng DR6-143 của bản tổng hợp lượt 4): 6 dòng nay bị V6, 1 dòng vẫn V6 nhưng khớp ở chỗ sớm hơn |

**Tự kiểm bằng đột biến.** Script tạm; mỗi đột biến chạy lại test của `packages/ai`. 13 đột biến, **13 bị giết**:

- NUL: không bỏ NUL; NUL thành dấu cách; chỉ bỏ NUL đầu tiên; bỏ NUL sau NFC (dấu viết sau NUL thành dấu lạc).
- "giới": luôn được miễn; không bao giờ được miễn; bỏ từng chữ "môi", "ranh", "biên", "thế"; chỉ chữ thường; bỏ ranh giới từ trước bốn chữ (giết bằng ca "tranh giới luật Phật giáo", commit thứ hai).
- Version: `analysis@4`.

Bỏ NUL ngay sau `normalizeText` (trước NFKD) là đột biến tương đương. Bước gộp khoảng trắng chạy lại sau đó, và NFKD rồi NFC dựng lại dấu, nên mọi chuỗi ra như nhau.

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff` (3 mục "Trùng file"):

- L17 (**[G7]** `docs/design/phase-5-ai.md:311`: §7.3 luật 2 ghi `model` "không quá 100 ký tự", code đếm code unit): để lại, ngoài phạm vi. #900 chỉ cho sửa §3.1 mục 3 và §6.4 của file này, như chính ghi chú đã nêu; mục vẫn [G7].
- L19 (**[T-323 #900]** NIT `phase-5-prompts.md:968`: chữ §14.2 cho §7 bước 0 bỏ ", trừ NUL" khỏi ngoặc K20): **đã sửa**. §7 bước 0 giữ ", trừ NUL" trong ngoặc tả tập K20, rồi thêm "**và NUL** (K20 giữ NUL để lệnh lưu từ chối nó; so khớp thì bỏ — DR6-142, §14.2)". Chữ §14.2 là bản ghi đề xuất, giữ nguyên.
- L20 (**[T-323 #900]** NIT `phase-5-prompts.md:933`: "6 ca dán ChatGPT web" mà chỉ 4 ca có kết quả): **đã sửa** bằng cách sửa số: "**4** ca dán tin nhắn của app có NUL (ChatGPT web, §6a)". Số này khớp §14.2 và bảng ở thân PR #909, hai nơi duy nhất ghi kết quả ca dán. Script đo của PR #909 không có trong repo, nên không dựng lại 2 ca còn lại.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local trên head `f8db0b7` (4 019 test; coverage `packages/ai` 100 %)
- [x] `pnpm e2e` xanh ở local (311 / 311). Chạy trước các commit sau cùng; các commit đó chỉ đụng comment, unit test và §14.5. Code chạy giống head.
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med` (cổng G5, nhãn `gate`; Owner merge)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-323 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #909 — T-323 (#900, PR #913, `REVIEW: PASS` @`f8db0b7`):
  - #909, `docs/design/phase-5-prompts.md` (§7 bước 0): ngoặc tả tập K20 giữ ", trừ NUL", rồi thêm "**và NUL** (K20 giữ NUL để lệnh lưu từ chối nó; so khớp thì bỏ — DR6-142, §14.2)". Chữ đề xuất ở §14.2 giữ nguyên, là bản ghi đề xuất.
  - #909 NIT, `docs/design/phase-5-prompts.md` (đầu §14, "Đã thử"): "**4** ca dán tin nhắn của app có NUL (ChatGPT web, §6a)", khớp §14.2 và bảng ở thân PR #909. Script đo của PR #909 không có trong repo, nên không dựng lại hai ca kia.

---

# Issue #901 — T-324: Lượt 4 L4-F: dấu nối còn lại của DR6-37 và bộ chặn ký hiệu, ô chọn theo mockup (DR6-145, 149)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Nhóm **L4-F** của đợt sửa lượt 4 (ký hiệu viết cứng, ô chọn):

1. **DR6-145 (a) — phần còn của DR6-37.** "{trường}: {giá trị}" của thẻ Dữ kiện KYC viết dấu `: ` thẳng trong JSX (`CustomerKyc.tsx`). Đưa qua khóa i18n (hay dùng lại `extraction.proposed` nếu cùng nghĩa); chữ hiện như cũ.
2. **DR6-145 (b) — bộ chặn bắt thêm dạng.** `findHardcodedSeparators` (`token-guard.ts`, chạy trong `pnpm lint:tokens`) không bắt:
   - `` .join(`, `) ``, `a + ', ' + b`, `` `${a}, ${b}` ``, `a + '; ' + b`;
   - chữ JSX `}, {` / `}; {` / `}: {`.

   Bắt thêm các dạng này; comment vẫn được dùng ký hiệu. Ký hiệu viết bằng escape (`×`…) ngoài phạm vi, nêu trong PR.
3. **DR6-145 (c) — bộ chặn cắt comment sai.** Bộ chặn tìm comment bằng `indexOf('//')` / `'/*'` mà không biết chuỗi. Một URL `'https://…'` làm mất phần còn lại của dòng; một `'/*'` trong chuỗi làm mất tới `*/`, có khi hết file. Sửa bằng một máy trạng thái nhỏ biết chuỗi `'` / `"` / template (có `\`).
4. **DR6-149 — ô chọn theo mockup.** `Choices` khác `.choice` của mockup đã duyệt (`docs/design/mockups/forms.css`) ở sáu điểm. Đưa về đúng mockup:
   - nền `--bg-2`, viền `--border-strong`, bo `--radius-sm`, đệm 5 / 11, chữ `--text-2`;
   - ô đang chọn: chữ `--text`, đậm 600;
   - ô tắt: mờ 0.4, gạch ngang.

   Không cần G3: theo mockup đã duyệt.

##### Bối cảnh

Deep review Phase 1–6 lượt 4: tổng hợp T-318 #893, PR #895, §3.1 (DR6-37 SỬA MỘT PHẦN), §6.4 (DR6-145, 149) và §8.2 (nhóm L4-F). Owner 27/10 chốt sửa hết trước G7. DR6-37 lượt 1 (L·CL-D5) nêu "{trường}: {giá trị}" ở vị trí đầu; Issue #790 mục 3 không liệt kê. Ô chọn khác mockup từ #375, chưa có trong "Lệch mockup đã biết". Đổi hình ô chọn có ở nhiều hộp (5a, 5d, 7b / 7c / 7d, 3f, Cài đặt → AI): G7 chụp lại ảnh hướng dẫn có các hộp này.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` §3.1, §6.4 (DR6-145, 149), §8.2 (L4-F)
- Báo cáo gốc (PR #894): `docs/reviews/raw/2026-10-31/claude/D.md` (CLR4-D1: `r1-37-guard.mjs`, danh sách "missed"), `docs/reviews/raw/2026-10-31/deepseek/D.md` (DSR4-D1 ca thử; DSR4-D2 số đo `getComputedStyle`, ảnh)
- `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` (dòng DR6-37), `docs/reviews/raw/2026-10-15/claude/D.md` (CL-D5)
- `packages/ui/src/token-guard.ts` (+ test), `packages/ui/scripts/check-tokens.ts`, `packages/ui/src/components/Choices.tsx`
- `docs/design/mockups/forms.css` (`.choice`, `.choice.on`, `.choice.off`), `docs/design/mockups/customer-forms.html` (5a, 5d)
- `apps/desktop/src/routes/customers/CustomerKyc.tsx`, `apps/desktop/src/i18n/vi.ts`

##### File / thư mục được phép sửa

- `packages/ui/src/token-guard.ts`, `packages/ui/src/token-guard.test.ts`, `packages/ui/scripts/check-tokens.ts`
- `packages/ui/src/components/Choices.tsx`
- `apps/desktop/src/routes/customers/CustomerKyc.tsx`, `apps/desktop/src/i18n/vi.ts`
- `e2e/theme.spec.ts` (hay một spec ô chọn mới trong `e2e/`)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `2e51e25`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

`findHardcodedSeparators(source: string): TokenViolation[]` giữ chữ ký; luật mới cùng tên luật (`hardcoded-separator`, `hardcoded-mark`). `Choices` giữ props.

##### Test chấp nhận

- [ ] Không còn chữ JSX `}: {` trong app; dòng dữ kiện KYC hiện như cũ ("<trường>: <giá trị>").
- [ ] `token-guard.test.ts`: các dạng ở mục 2 bị báo. Ba ca của DSR4-D1 (chuỗi có `//`, có `/*`, có `*/` rồi ký hiệu ở sau) bị báo đúng dòng. Comment có ký hiệu không bị báo.
- [ ] `pnpm lint:tokens` xanh trên app sau sửa.
- [ ] e2e: `getComputedStyle` của ô chọn ở 5a / 5d khớp mockup (nền, viền, bo, đệm, màu chữ; ô đang chọn đậm 600; ô tắt gạch ngang); tương phản chữ ≥ AA, viền ≥ 3:1 (đo như `theme.spec.ts`).
- [ ] `pnpm verify`, `pnpm e2e` xanh.

Ước lượng: ≈ 30–55 dòng SP + ≈ 60 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #920 — fix(ui): token guard reads strings and hand-joined parts; choices as the mockup (T-324)

Trạng thái: MERGED · merge 2026-10-31T18:38:11Z · commit `656052fd19438a36c7305d9ae88ea9e285066f77` · nhánh `task/T-324-separators-choices` · nhãn: risk:low

Closes #901

#### Thay đổi

##### 1. DR6-145 (a): dòng dữ kiện KYC qua i18n

- Thêm khóa `kyc.factLine: '{field}: {value}'` vào `vi.ts`. `CustomerKyc.tsx` gọi `t('kyc.factLine', { field, value })` thay cho chữ JSX `}: {`.
- Không dùng lại `extraction.proposed`: khóa đó có "AI đề xuất:" ở đầu, nên khác nghĩa.
- Chữ hiện như cũ. Các e2e sẵn có vẫn xanh, không sửa: `customer-kyc.spec.ts` ("Năm sinh: 1984 · sửa ở hồ sơ KH", "Số con: 2F4 · 15/09/2026"…) và `customer-ai.spec.ts` ("Tình trạng hôn nhân: Đã kết hôn").
- `fillSlots` không quét lại giá trị đã điền, nên một giá trị chứa "{field}" vẫn hiện đúng như gõ.

##### 2–3. DR6-145 (b), (c): bộ chặn `findHardcodedSeparators`

- **Đọc nguồn bằng một máy trạng thái nhỏ.** Máy phân biệt code, comment `//` / `/* */`, chuỗi `'` / `"` và template. Nó hiểu `\` (cả xuống dòng sau `\`) và theo dõi `${…}` lồng nhau bằng một ngăn xếp `{`.
  - `//`, `/*`, `*/` nằm trong chuỗi hay template không còn mở hay đóng comment (ba ca của DSR4-D1).
  - Dấu nháy trong comment không mở chuỗi.
  - Chuỗi `'` / `"` dừng ở cuối dòng, nên một dấu nháy lạc (ví dụ trong regex) không nuốt phần sau của file.
- **Bắt thêm**, vẫn luật `hardcoded-separator`:
  - `', '` / `'; '` khi là **cả** một chuỗi hay **cả** một mảnh template: `` .join(`, `) ``, `a + ', ' + b`, `a + "; " + b`, `` `${a}, ${b}` `` (báo `}, ${`). Không bị báo: `['MET', 'CANCELLED']`, `'a, b'`, `` `${kind}:${id}` ``.
  - `}, {` / `}; {` / `}: {` giữa hai biểu thức JSX. Một `{` được coi là JSX khi đứng ngay sau `>` của một thẻ (không phải `=>`), hay sau `}` của một biểu thức JSX. Vì vậy không bị báo: chú thích kiểu `({ a }: { a: T })` (hơn 60 chỗ trong app), mảng `[{…}, {…}]`, đối số `f({…}, {…})`.
  - Regex `.join\((['"])[,;] \1\)` cũ gộp vào luật chuỗi. Chữ báo đổi từ `.join(', ')` thành `', '`.
- **Kiểm trên app trước khi sửa `CustomerKyc`:** bộ chặn mới chỉ báo `CustomerKyc.tsx:95  }: {`. Sau khi sửa, `pnpm lint:tokens` xanh.
- **Ngoài phạm vi**, ghi lại để biết:
  - Ký hiệu viết bằng escape Unicode trong chuỗi: Issue mục 2 để ngoài.
  - Bộ chặn không đọc nội dung regex literal. Trong vùng quét không có regex nào chứa dấu nháy, `\//` hay `\/*`. Chỉ file test có, mà file test không bị quét ký hiệu.
  - `': '` khi là cả chuỗi / mảnh template thì không báo, vì Issue chỉ nêu `: ` ở JSX. Bật luật này sẽ bắt `${path}: ${detail}` ở `ai-panel-view.ts:201`: đó là chi tiết kỹ thuật của lỗi kiểm AI, nằm ở file ngoài phạm vi.
  - `←`, `–`, `…`, ngoặc kép cong trong danh sách "missed" của CLR4-D1: Issue mục 2 không nêu, nên không thêm.
  - Chữ JSX đứng trước biểu thức đầu tiên (`<p>chữ {a}: {b}</p>`) không được nhận là JSX. App không có chữ JSX như vậy vì mọi chuỗi đều qua i18n.

##### 4. DR6-149: `Choices` theo `.choice` của mockup

- Ô thường: nền `--bg-2` (`bg-surface-2`), viền `--border-strong`, bo `--radius-sm` (6 px), đệm 5 / 11 px (`py-1.25 px-2.75`), chữ `--text-2`.
- Ô đang chọn: thêm chữ `--text`, đậm 600. Ô tắt: mờ 0.4, gạch ngang. Props giữ nguyên.
- Còn một chỗ khác mockup, không thuộc sáu điểm của Issue và cố ý giữ: `.choice` có `white-space: nowrap`, còn `Choices` vẫn cho chữ xuống dòng (giá trị KYC dài ở 7d, tên dài).
- Ô chọn đổi hình ở 5a, 5d, 7b / 7c / 7d, 3f, Cài đặt → AI. Ở G7 cần chụp lại ảnh hướng dẫn có các hộp này (HANDOFF đã ghi).

#### Test chấp nhận

- [x] Không còn chữ JSX `}: {` trong app; dòng dữ kiện KYC hiện như cũ ("<trường>: <giá trị>").
- [x] `token-guard.test.ts`:
  - các dạng ở mục 2 bị báo;
  - ba ca DSR4-D1 (chuỗi có `//`, có `/*`, có `*/` rồi ký hiệu ở sau) bị báo đúng dòng;
  - comment có ký hiệu không bị báo;
  - thêm ca: dấu nháy trong comment, escape (cả xuống dòng sau `\`), chuỗi dừng ở cuối dòng;
  - với code cũ: 6 ca đỏ.
- [x] `pnpm lint:tokens` xanh trên app sau sửa.
- [x] e2e `theme.spec.ts` "the choices of a dialog…":
  - `getComputedStyle` của ô chọn khớp mockup ở 5a (Giới tính, Nhóm ban đầu) và 5d (Nhóm mới): nền, viền, bo, đệm, cỡ chữ, màu chữ; ô đang chọn đậm 600; ô tắt "N2 hiện tại" mờ 0.4, gạch ngang.
  - Với `Choices` cũ: đỏ ở bo 10 px.
  - Tương phản đo bằng `lowestContrast`: chữ ô đang chọn 11,6:1, ô chưa chọn 8,2:1, ô có huy hiệu nhóm 6,7:1; viền ô đang chọn 6,9:1.
  - **Viền ≥ 3:1 chỉ đo ở ô đang chọn.** Owner chốt 01/11/2026 trong phiên (G8: Issue đòi cả viền `--border-strong` lẫn "viền ≥ 3:1"):
    - viền ô chưa chọn là `--border-strong`, 1,6:1, đúng mockup;
    - G3 T-284 (`index.html#contrast`) đã để `Choices` ngoài phạm vi 3:1 vì ô có chữ;
    - trạng thái "đang chọn" nhận ra bằng viền `--accent` (6,9:1), chữ đậm và màu chữ.
- [x] `pnpm verify` xanh; `pnpm e2e` 312 / 312 xanh ở local.

#### Ghi chú OPEN liên quan

Không có: `node tools/notes-for.mjs --diff` không thấy ghi chú OPEN nào nêu 6 file của nhánh.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

Cỡ: thêm 96 dòng SP (bộ chặn 87, bỏ 27 dòng cũ), thêm 178 dòng test (unit 116, e2e 62).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-324 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #902 — T-325: Lượt 4 L4-G: tên liền dài không tràn ở hộp thoại, màn Team, So sánh team, Báo cáo (DR6-148, 146 a)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Nhóm **L4-G** của đợt sửa lượt 4 (tên liền dài):

1. **DR6-148 — tên liền dài tràn khung ở bốn chỗ DR6-117 chưa phủ.** Tên không có trần độ dài (`requireName` chỉ kiểm rỗng), nên tên liền dài là đầu vào hợp lệ.
   - (a) Tiêu đề hộp thoại (`Dialog.tsx`, h2 không ngắt): tên KH 81 chữ liền tràn ở 6 hộp (5c, 5d, 7a…).
   - (b) Màn Team: tên nhân sự (`whitespace-nowrap`), nút team, tiêu đề team trong hàng flex. Chữ đè thẻ; "Đổi tên", "Xóa team", "Sửa" ra ngoài cửa sổ 1 100.
   - (c) Bảng So sánh team ở Tổng quan (`CELL` có `whitespace-nowrap`, bảng không có vùng cuộn): trang rộng 3 005 px ở 1 100.
   - (d) Cột tên RE ghim của Báo cáo (`STICKY`, không giới hạn rộng): cột ghim 1 770 px che mọi số, kể cả khi cuộn hết.

   Sửa: `min-w-0` / `wrap-anywhere` (hay giới hạn bề rộng) cho đúng các chỗ trên; ô tên ghim của Báo cáo giới hạn bề rộng và ngắt chuỗi liền. **Tên thường không đổi hình** (mockup `reports.html` để cột tên "lấy phần còn lại"; không tính tên dài).
2. **DR6-146 (a) — test hở:** đường 5c (sửa hồ sơ) gửi tên gốc cho lệnh (DR6-109) không e2e nào giữ; đột biến R109c (5c chuẩn hóa tên trước lệnh) sống cả bộ. Thêm ca e2e 5c dán tên hỏng → câu `INVALID_TEXT`, như ca 5a của `customer-forms.spec.ts`.

##### Bối cảnh

Deep review Phase 1–6 lượt 4: tổng hợp T-318 #893, PR #895, §6.4 (DR6-146, 148) và §8.2 (nhóm L4-G). Owner 27/10 chốt sửa hết trước G7. DR6-148 có từ trước, họ DR6-117 (#724 → #746 sửa tên KH, thẻ Lịch hẹn, 7a / 7c / 7d). Đường vòng hiện nay của Báo cáo: xuất Excel.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` §6.4 (DR6-146, 148), §8.2 (L4-G)
- Báo cáo gốc (PR #894): `docs/reviews/raw/2026-10-31/codex/D.md` (CXR4-D1, D2: kịch bản N1, N2), `docs/reviews/raw/2026-10-31/codex/E.md` (CXR4-E1, E2), `docs/reviews/raw/2026-10-31/claude/D.md` (CLR4-D2: đột biến R109c)
- `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §6.4 (DR6-117: cách sửa đã dùng)
- `packages/ui/src/components/Dialog.tsx`, `apps/desktop/src/routes/team/TeamScreen.tsx`, `apps/desktop/src/routes/overview/TeamCompare.tsx`, `apps/desktop/src/routes/reports/ReportTable.tsx`
- `docs/design/mockups/reports.html` (bảng `rep`), `docs/design/mockups/team.html`, `docs/design/mockups/overview.html` (So sánh team)
- `e2e/customer-forms.spec.ts` (ca 5a dán tên hỏng), `e2e/support.ts`

##### File / thư mục được phép sửa

- `packages/ui/src/components/Dialog.tsx`
- `apps/desktop/src/routes/team/TeamScreen.tsx`, `apps/desktop/src/routes/overview/TeamCompare.tsx`, `apps/desktop/src/routes/reports/ReportTable.tsx`
- `e2e/{customer-forms,team,overview,reports}.spec.ts` (hay một spec mới trong `e2e/` cho tên dài), `e2e/support.ts` (helper đo tràn nếu cần)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `2e51e25`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

Không đổi props hay chữ; chỉ class.

##### Test chấp nhận

- [ ] Tên KH 81 chữ liền: tiêu đề các hộp có tên KH không tràn (`scrollWidth ≤ clientWidth`) ở 1 100 và 1 440.
- [ ] Tên team và tên IS 160 chữ liền: màn Team không cuộn ngang ở 1 100; "Đổi tên", "Xóa team", "Sửa" nằm trong thẻ của chúng.
- [ ] Tên team 160 chữ liền: Tổng quan không cuộn ngang ở 1 100.
- [ ] Tên RE 160 chữ liền: Báo cáo → Theo RE, cuộn hết sang phải vẫn thấy các cột số.
- [ ] Tên thường: các màn trên không đổi hình (class / e2e hiện có xanh).
- [ ] Đột biến R109c làm ca e2e 5c mới đỏ.
- [ ] `pnpm verify`, `pnpm e2e` xanh.

Ước lượng: ≈ 20–40 dòng SP + ≈ 100 dòng e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #922 — fix(ui): long names with no space break in dialogs, Team, So sánh team and Báo cáo (T-325)

Trạng thái: MERGED · merge 2026-10-31T19:46:47Z · commit `06c5a1b204fe6a5fb8bc550d36fcded61ba95240` · nhánh `task/T-325-long-names` · nhãn: risk:low

Closes #902

#### Thay đổi

Nhóm **L4-G** của đợt sửa lượt 4 (DR6-148, DR6-146 (a)). Chỉ class, trừ một span bọc tên ở Báo cáo (lý do dưới); không đổi props công khai hay chữ.

- **(a) Tiêu đề hộp thoại** (`Dialog.tsx`): khối tiêu đề + phụ đề `wrap-anywhere`. Phủ mọi hộp có tên ở tiêu đề (5c, 5d, 5f, 7a, Sửa HĐ…) và ở phụ đề (lịch hẹn, kết quả, 7d…).
- **(b) Màn Team** (`TeamScreen.tsx`):
  - nút team trong danh sách `wrap-anywhere`, số đếm `shrink-0` (không bị bóp khi tên dài);
  - tên ở thẻ "Người hỗ trợ" `min-w-0 wrap-anywhere` (`PersonName` thêm cờ riêng `breaks`); tên RE trong bảng thành viên giữ `whitespace-nowrap` vì bảng ở 1 100 đã rộng hơn thẻ (615 > 499 px): bỏ nowrap thì tên thường xuống dòng;
  - tiêu đề "Team …" `min-w-0 wrap-anywhere`;
  - khung cuộn của bảng thành viên thêm `relative`: ô tiêu đề ẩn "Thao tác" (`sr-only`, định vị tuyệt đối theo `body`) lọt ra ngoài khung cuộn, làm màn Team ở 1 100 **đã cuộn ngang ~23–50 px kể cả với tên mẫu** (có từ trước). Không sửa thì test chấp nhận "không cuộn ngang ở 1 100" không đạt.
- **(c) So sánh team** (`TeamCompare.tsx`): `CELL` tách làm `FIGURE` (giữ nowrap) và `NAME` (`wrap-anywhere`, không nowrap) cho ô tên team / RE / Tổng; nút tên team `text-left` (nút mặc định căn giữa, dòng cuối của tên dài ra giữa ô), mũi tên mở `shrink-0 text-center` (giữ chỗ cũ trong ô 14 px). Bảng ở 1 100 còn dư chỗ (775 / 803 px), nên tên thường không đổi.
- **(d) Báo cáo** (`ReportTable.tsx`): tên trong cột đầu bọc `<span class="block w-max max-w-60 whitespace-normal wrap-anywhere">`. Đo trên Edge: bảng Theo RE ở 1 100 đã rộng hơn khung (944 > 775) nên mọi cột ở bề rộng tối thiểu; bỏ nowrap / thêm `wrap-anywhere` ở `th` làm cột tên co còn 31 px (tên thường ngắt từng chữ), `min-w-*` ở `th` làm cột rộng thêm. Chỉ span `w-max` + `max-w-60` cho bề rộng tối thiểu = min(độ dài tên, 240 px): tên thường giữ nguyên, tên 160 chữ dừng ở 257 px, phần số còn ~518 px. Áp cho cả cột Team (không ghim) của Theo RE, để tên team dài không đẩy bảng thêm ~1 300 px.
- **DR6-146 (a)**: ca e2e 5c dán tên hỏng (`'\uD83D​\uDE00 Lan'`) → câu `INVALID_TEXT`, hộp còn mở, Hủy giữ tên cũ.

#### Test chấp nhận

- [x] Tên KH 81 chữ liền: tiêu đề Sửa hồ sơ, Chuyển nhóm, Ghi chú KYC, Xóa KH không tràn (`scrollWidth ≤ clientWidth` cả tiêu đề lẫn hộp) ở 1 100 và 1 440 (`e2e/long-names.spec.ts`).
- [x] Tên team và tên IS 160 chữ liền: màn Team không cuộn ngang (trang và `main`) ở 1 100 / 1 440; "Đổi tên team", "Xóa team", nút team, "Sửa" của IS nằm trong thẻ.
- [x] Tên team 160 chữ liền: Tổng quan không cuộn ngang ở 1 100 / 1 440, bảng So sánh team trong khối. Đo "không cuộn ngang" bằng `expect.poll`: ngay sau khi thu cửa sổ từ 1 280, biểu đồ ECharts còn giữ bề rộng canvas cũ một lúc (lượt chạy đủ bộ đầu tiên đỏ vì đo quá sớm; ảnh lúc lỗi cho thấy bố cục đã đúng).
- [x] Tên RE (và team) 160 chữ liền: Báo cáo → Theo RE / Theo team, cuộn hết sang phải: cột ghim ≤ 40% khung, ≥ 8 ô số thấy được, không ô nào bị che.
- [x] Tên thường không đổi hình: chụp 76 trạng thái với dữ liệu mẫu (Team 3 team, So sánh team đóng / mở, Báo cáo 5 loại kỳ × 3 bảng × đầu / cuộn phải, 4 hộp thoại; 1 100 và 1 440) trước và sau: ảnh PNG trùng từng byte; toạ độ mọi phần tử cũ trùng khớp, khác biệt duy nhất là span bọc tên mới. Spec chụp chỉ dùng tạm, không commit. e2e hiện có xanh.
- [x] Đột biến R109c (`name: customer ? normalizeText(name) : name`) làm ca 5c mới đỏ (ca 5a vẫn xanh); đã hoàn tác.
- [x] `pnpm verify`, `pnpm e2e` xanh.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff`: Không có.

Biến thể ngoài Issue, đề nghị ghi vào sổ ở PR sổ sau review:
- Tên **TL** liền dài ở hàng tiêu đề thẻ team vẫn đẩy "Đổi tên team" / "Xóa team" ra ngoài ở 1 100: thử `min-w-0 wrap-anywhere` thì tên TL thường bị bóp ngắt từng chữ khi tên team dài; thử `max-w-60 wrap-break-word` thì ở 1 100 thẻ không đủ chỗ (hàng vẫn tràn 15 px, tiêu đề team co về 0). Cần đổi bố cục hàng (gom nút / `flex-wrap`), ngoài phạm vi "chỉ class".
- `DataTable` (`packages/ui`) để ô tiêu đề ẩn `sr-only` định vị theo `body`: khung cuộn nào bọc bảng mà không `relative` thì trang cuộn ngang khi bảng rộng hơn khung. Ở đây sửa tại màn Team; hai chỗ khác có cột tiêu đề ẩn (`CustomerAppointments.tsx`, `SettingsTrash.tsx`) đo ở 1 100 với dữ liệu mẫu: trang không cuộn ngang (bảng vừa khung), chỉ là rủi ro khi bảng rộng hơn khung.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-325 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #903 — T-326: Lượt 4 L4-H: ô Case size trống, tên nút khôi phục ở Thùng rác, focus lúc hộp xác nhận chạy, test hở gói E (DR6-150…154)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Nhóm **L4-H** của đợt sửa lượt 4 (lịch hẹn, Thùng rác, hộp xác nhận; gói E):

1. **DR6-150 — ô Case size chỉ có ký tự vô hình.** `readCaseSize` hỏi "trống" bằng `text.trim()`, còn `parseVnd` đọc `normalizeText`. Ô tùy chọn ("để trống = chưa ước lượng") chỉ có U+200B / U+0085 / U+2060 báo "Chưa nhập số tiền." và chặn Lưu của 6c / 6d / 6f. Sửa: hỏi "trống" bằng `normalizeText(text) === ''`, cả ở ba `pending` của ô ngày (6b / 6e / ngày hẹn tiếp của 6c), như ô ngày sinh 5a.
2. **DR6-151 — tên nút khôi phục trùng, theo Q3 (a) (Owner đồng ý 31/10).**
   - Nhân sự: tên nút luôn thêm vai trò và team như dòng thứ hai của ô "Bản ghi": "Khôi phục nhân sự <tên> · <vai trò> · <team>".
   - KH: chỉ khi tên + nhóm trùng một dòng KH khác đang có trong Thùng rác thì thêm mã KH theo khuôn của hộp 9b ("<tên> (<mã>)"). KH không trùng: tên nút như nay.
   - Dòng KH của `listTrash` cần thêm mã KH.
3. **DR6-152 — export thừa:** bỏ `export` của `PURGE_REMINDER` (`trash-view.ts`); test đọc hằng qua hàm hay giữ số viết thẳng.
4. **DR6-153 — test hở gói E:**
   - (a) ca e2e: Nhập backup bị từ chối sau một lần lưu lỗi nói câu có vế "Thử lại" (chép ca Nạp lại của `save-state.spec.ts`);
   - (b) ca e2e Thùng rác đòi huy hiệu nhóm trong ô "Bản ghi" của KH.
5. **DR6-154 — focus lúc hộp xác nhận đang chạy.** Hộp Nạp lại 10c, Dọn sạch 11i và Nhập backup 10a tắt cả ô chữ, Hủy và nút xác nhận, nên focus rơi về `body`. Tab không vào lại hộp, và trình đọc màn hình không nghe "Đang …".
   - Sửa: lúc chạy giữ focus trong hộp và đọc được chữ "Đang …" (một dòng `role="status"` nhận focus, hay `aria-disabled` thay `disabled` cho nút xác nhận); dùng chung cho `ConfirmWordDialog` và hộp 10a.
   - Xong thì focus về như nay.

##### Bối cảnh

Deep review Phase 1–6 lượt 4: tổng hợp T-318 #893, PR #895, §6.5 (DR6-150…154) và §8.2 (nhóm L4-H); câu hỏi §9 Q3, Owner 31/10 chọn (a). Owner 27/10 chốt sửa hết trước G7. DR6-151 đổi khuôn tên nút Owner chốt 25/10 (#833: "Khôi phục KH <tên> · <nhóm>"), nay mở rộng theo Q3 (a). DR6-153 mới do #817, #855, #871; còn lại có từ trước.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` §6.5 (DR6-150…154), §8.2 (L4-H), §9 Q3
- Báo cáo gốc (PR #894): `docs/reviews/raw/2026-10-31/claude/E.md` (CLR4-E1…E5: probe `p25b-blank`, `p26-blank-case-size`, `p23-restore-names`, `p34-confirm-focus`; đột biến RB2e, T305b), `docs/reviews/raw/2026-10-31/deepseek/E.md` (DSR4-E1)
- `apps/desktop/src/routes/appointments/{outcome-form.ts,AppointmentDialog.tsx,RescheduleFields.tsx,OutcomeDialog.tsx}`
- `apps/desktop/src/routes/{trash-view.ts,SettingsTrash.tsx,ConfirmWordDialog.tsx,SettingsBackup.tsx}`, `apps/desktop/src/routes/team/team-view.ts` (khuôn tên có mã của 9b)
- `packages/db/src/trash.ts` (`TrashRow`, `listTrash`)
- `e2e/{trash,save-state,appointment-outcome}.spec.ts`, `e2e/dialog-keyboard.spec.ts`

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/appointments/{outcome-form.ts,AppointmentDialog.tsx,RescheduleFields.tsx,OutcomeDialog.tsx}` và test
- `apps/desktop/src/routes/{trash-view.ts,SettingsTrash.tsx,ConfirmWordDialog.tsx,SettingsBackup.tsx}` và test
- `apps/desktop/src/i18n/vi.ts`
- `packages/db/src/trash.ts`, `packages/db/src/trash.test.ts`
- `e2e/{trash,save-state,appointment-outcome,dialog-keyboard}.spec.ts`
- `docs/testing/nghiem-thu-v1.md`, `docs/user-guide/**` nếu có câu ghi tên nút khôi phục

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `2e51e25`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

- `TrashRow` của KH thêm `code` (mã KH).
- `restoreLabel(row, …)` nhận thêm thông tin để biết dòng KH có trùng tên + nhóm với dòng khác không (hay một hàm dựng tên cho cả danh sách).

##### Test chấp nhận

- [ ] `readCaseSize` của U+200B, U+0085, U+2060 → `null`; 6c / 6d / 6f lưu được với ô Case size chỉ có ký tự vô hình (case size trống); ô ngày 6b / 6e / 6c chỉ có ký tự vô hình xử như trống.
- [ ] Hai KH cùng tên cùng nhóm trong Thùng rác: hai tên nút khác nhau, có mã; KH không trùng: tên nút như cũ; hai nhân sự cùng tên khác vai trò / team: tên nút khác nhau.
- [ ] `PURGE_REMINDER` không còn export (codemap theo).
- [ ] Đột biến RB2e (câu Nhập backup mất vế "Thử lại") và T305b (ô "Bản ghi" không vẽ huy hiệu) làm e2e mới đỏ.
- [ ] Lúc hộp 10c / 11i / 10a đang chạy (`holdBackup`): `activeElement` nằm trong hộp và có chữ "Đang …" đọc được; xong thì focus về như nay; Escape / Hủy vẫn không đóng hộp lúc chạy.
- [ ] `pnpm verify`, `pnpm e2e` xanh.

Ước lượng: ≈ 25–35 dòng SP + ≈ 80 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

#898 (T-321, L4-C): cùng `e2e/save-state.spec.ts`

## PR #924 — fix(ui): blank case size, restore names, focus of running dialogs (T-326)

Trạng thái: MERGED · merge 2026-11-01T04:43:32Z · commit `4d7e689daee2539b1e76efd31293cf493822da12` · nhánh `task/T-326-trash-names-confirm-focus` · nhãn: risk:low

Closes #903

Nhóm L4-H của đợt sửa lượt 4 (DR6-150…154; tổng hợp `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` §6.5, §8.2, §9 Q3).

#### Thay đổi

- **DR6-150 — ô chỉ có ký tự vô hình:** `readCaseSize` hỏi "trống" bằng `normalizeText(text) === ''`, nên ô Case size chỉ có U+200B / U+0085 / U+2060 là "chưa ước lượng" và 6c / 6d / 6f lưu được (`MetFields` đọc qua `readCaseSize`). Ba `pending` của ô ngày (6b `AppointmentDialog`, 6e `RescheduleFields`, ngày hẹn tiếp 6c `OutcomeDialog`) cũng hỏi bằng `normalizeText`: ô chỉ có ký tự vô hình chờ lần bấm lưu như ô trống.
- **DR6-151 — tên nút khôi phục, theo Q3 (a):**
  - `TrashRow` của KH thêm `code` (`listTrash`).
  - `codedCustomers(rows)`: các KH của Thùng rác có tên + nhóm trùng một KH khác ở đó, đọc trên mọi dòng, không theo bộ lọc. `restoreLabel(row, coded)` thêm mã cho các KH ấy theo khuôn của 9b: "Khôi phục KH <tên> (<mã>) · <nhóm>". KH không trùng giữ tên nút như cũ.
  - Nhân sự: "Khôi phục nhân sự <tên> · <vai trò> · <team>" (dòng thứ hai của ô và cột "Thuộc"); người không có team: "<tên> · <vai trò>".
- **DR6-152:** bỏ `export` của `PURGE_REMINDER`. Test giữ số viết thẳng `1_000`. Codemap của app chỉ liệt kê tên file, nên không đổi.
- **DR6-153 — test hở gói E:**
  - (a) e2e `save-state.spec.ts`: Nhập backup sau một lần lưu lỗi bị từ chối, nói đủ câu có vế "Thử lại", không backup; sau "Thử lại" thì nhập được.
  - (b) e2e `trash.spec.ts`: ô "Bản ghi" của KH vẽ huy hiệu nhóm, và tên nút đọc đúng chữ đó.
- **DR6-154 — focus lúc hộp xác nhận đang chạy:** nút xác nhận dùng chung `ConfirmButton` (`ConfirmWordDialog.tsx`, dùng ở 10c, 11i và 10a). Lúc chạy, nút tắt bằng `aria-disabled` thay `disabled`, ghi "Đang …" và nhận focus; vẫn mờ như nút tắt (`aria-disabled:opacity-50`). Ô chữ và Hủy vẫn `disabled`. Bấm nút lúc chạy không chạy lại, vì `onSubmit` của hai hộp đã chặn khi `running`. Xong thì focus về như trước (`Dialog` giữ phần tử mở hộp).

Ngoài ước lượng của Issue (≈ 25–35 dòng SP): ≈ 110 dòng SP, phần lớn là `ConfirmButton` dùng chung và dòng import do Prettier tách. Tổng diff ≈ 400 dòng, gồm cả test.

#### Test chấp nhận

- [x] `readCaseSize` của U+200B, U+0085, U+2060 → `null`; `readOutcome` với Case size chỉ có ký tự vô hình → `expectedCaseSize: null` (unit). e2e `appointment-outcome.spec.ts` "a field of invisible characters alone reads as empty…": 6b, ngày hẹn tiếp 6c và 6e không báo lỗi trước khi bấm lưu, báo "Nhập ngày." sau đó; 6c lưu được với Case size chỉ có ký tự vô hình. Bỏ phần sửa thì ca này đỏ (đã chạy: 6b báo lỗi ngay).
- [x] Hai KH cùng tên cùng nhóm có hai tên nút khác nhau, có mã; KH không trùng giữ tên cũ; nhân sự cùng tên khác vai trò / team có tên nút khác nhau (unit `trash-view.test.ts`). e2e `trash.spec.ts` "two customers of one name and one stage…" giữ phần nối ở màn (đột biến `coded` rỗng ở `SettingsTrash` làm ca này đỏ).
- [x] `PURGE_REMINDER` không còn export; `pnpm codemap:check` xanh.
- [x] Đột biến RB2e (câu Nhập backup không còn vế "Thử lại") và T305b (ô "Bản ghi" không vẽ huy hiệu) làm hai ca e2e mới đỏ (đã chạy từng đột biến rồi gỡ).
- [x] Lúc hộp 10c / 11i / 10a chạy (`holdBackup`): focus ở nút "Đang …" trong hộp, cả sau Escape (hộp mở lại theo DR-58); hai lần Tab đưa focus về lại nút (10c). Nút vẫn mờ 0,5, kể cả khi rê chuột lên. Escape / Hủy không đóng hộp. Xong thì focus về như cũ: 10c về nút "Nạp lại…", 11i về thông báo 11j. Ba ca e2e đỏ trước khi sửa.
  - **Ngoài phạm vi, có từ trước** (đề nghị phiên review ghi vào sổ): sau khi 10a đóng, focus ở `body`, cả trước lẫn sau PR này. Ca e2e 10a mở file bằng nút "Chọn file…" như người dùng. Nút này tắt trong lúc đọc file, nên lúc hộp mở focus đã rơi về `body`, và `Dialog` trả focus về đó. Cùng họ DR6-83. PR này không khẳng định chỗ focus sau khi 10a đóng.
- [x] `pnpm verify` xanh; `pnpm e2e` xanh (xem mục Kiểm tra).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff`: không có mục "Trùng file" nào. `notes-for 903` có ra mục L33 **[T-328 #905]** (`docs/testing/nghiem-thu-v1.md`, hai lệch mockup của ô chọn). Mục này để lại, thuộc #905. PR này không sửa `nghiem-thu-v1.md` vì tài liệu không có câu nào ghi tên nút khôi phục; `docs/user-guide/**` cũng vậy.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (125 file, 4 203 test)
- [x] `pnpm e2e` xanh ở local: 321 / 321 ở `bc0e15c`; commit sau chỉ sửa `e2e/dialog-keyboard.spec.ts`, chạy lại cả file đó (8 / 8)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-326 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #904 — T-327: Lượt 4 L4-I: công cụ: pr-core, bộ kiểm ảnh hướng dẫn, glob của notes-core, size-report (DR6-155…157)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Nhóm **L4-I** của đợt sửa lượt 4 (công cụ, gói F):

1. **DR6-155 (a) — test hở của `pr-core`.** Câu chặn "Read n of the m files" của `mergeBlockers` đếm theo file (`pr.files.length`), nhưng không ca nào có file đổi tên trong một PR đọc thiếu, nên đếm theo đường dẫn (đột biến T83c) vẫn xanh cả bộ. Thêm ca: PR có `{ path, previousPath }`, `changedFiles` lớn hơn số mục → đúng "Read 1 of the 2 files…".
2. **DR6-155 (b) — test hở của bộ chụp ảnh hướng dẫn.** `check.guide.ts` chỉ kiểm link và cỡ ảnh. Gỡ `style` của `shots.guide.ts` (sửa của T-312: thanh trên cùng tĩnh, bỏ `scroll-margin-top`) thì 13 / 13 vẫn xanh, mà ảnh thẻ cao hụt 8 hàng chân. Thêm một kiểm có trong bộ chụp ảnh (vd. khung chụp phải chứa đủ chân của thẻ cao gần bằng cửa sổ), không thêm thư viện.
3. **DR6-156 — `notes-core` bỏ sót ghi chú thư mục khi đích là glob cấp package.** Với đích `packages/*/src/schema.ts` và ghi chú `packages/ai/src/`, `covers` chỉ xét phần trước dấu `*` đầu và chỉ cho qua khi đích có `**`, nên `notes-for --files` in "Không có ghi chú OPEN nào". Sửa: so glob với thư mục theo từng đoạn đường dẫn.
4. **DR6-157 — `size-report` đếm file `.sqlite` của e2e.** `bundleReport` xếp mọi file không phải `.js` / `.css` trong `dist` vào "Tệp khác", kể cả `demo-<ngày>.sqlite` (≈ 10 MB) mà `e2e/serve.mjs` ghi và không xóa. Chạy `pnpm e2e` rồi đo thì "Tệp khác" tăng ≈ 10 MB, và `size.json` ghi lúc đó thành mốc sai. Sửa: `bundleReport` chỉ đếm đuôi của asset, hay `serve.mjs` ghi snapshot ra ngoài `dist`.

##### Bối cảnh

Deep review Phase 1–6 lượt 4: tổng hợp T-318 #893, PR #895, §6.6 (DR6-155…157) và §8.2 (nhóm L4-I). Owner 27/10 chốt sửa hết trước G7. DR6-155 mới do #792, #882; DR6-156, 157 có từ trước. G7 đo `size-report` trên SHA phát hành: cần DR6-157 xong trước lần đo đó.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` §6.6 (DR6-155…157), §8.2 (L4-I)
- Báo cáo gốc (PR #894): `docs/reviews/raw/2026-10-31/claude/F.md` (CLR4-F1: đột biến T83c), `docs/reviews/raw/2026-10-31/codex/F.md` (CXR4-F1: `notes-glob.mjs`; CXR4-F2: `guide-style-mutate.mjs`), `docs/reviews/raw/2026-10-31/deepseek/F.md` (DSR4-F1)
- `tools/pr-core.mjs` (`mergeBlockers`, `prFiles`), `tools/pr-core.test.mjs`
- `tools/notes-core.mjs` (`covers`, `relatedNotes`), `tools/notes-core.test.mjs`
- `tools/size-report-core.mjs` (`bundleReport`) + test, `e2e/serve.mjs`
- `e2e/guide/check.guide.ts`, `e2e/guide/shots.guide.ts`, `playwright.guide.config.ts`

##### File / thư mục được phép sửa

- `tools/pr-core.test.mjs`
- `tools/notes-core.mjs`, `tools/notes-core.test.mjs`
- `tools/size-report-core.mjs` và test, `e2e/serve.mjs`
- `e2e/guide/check.guide.ts`, `e2e/guide/shots.guide.ts`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `2e51e25`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

Không đổi lệnh hay cách dùng của `pr-status`, `merge-pr`, `notes-for`, `size-report`.

##### Test chấp nhận

- [ ] Ca `mergeBlockers` mới đỏ với đột biến T83c (`Read ${paths.length}`).
- [ ] `relatedNotes` với đích `packages/*/src/schema.ts` thấy ghi chú thư mục `packages/ai/src/`; hai đối chứng `packages/ai/src/*.ts`, `packages/**/schema.ts` như cũ; mọi ca hiện có của `notes-core` xanh.
- [ ] `size-report` sau `pnpm e2e` không cộng file `.sqlite` vào "Tệp khác" (hay file đó không còn trong `dist`); số "Tệp khác" của bản dựng sạch không đổi.
- [ ] Gỡ `style` của `shots.guide.ts` thì bộ chụp / kiểm ảnh đỏ (nêu cách thử trong thân PR); ảnh đang commit vẫn qua.
- [ ] `pnpm verify` xanh.

Ước lượng: ≈ 20–60 dòng SP + ≈ 90 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #926 — fix(tools): folder notes under package globs, build assets in size-report, whole guide shots (T-327)

Trạng thái: MERGED · merge 2026-11-01T05:51:26Z · commit `54884d473ebfca0a4503de1eee42dd3881ec2585` · nhánh `task/T-327-tools-l4-i` · nhãn: risk:low

Closes #904

Nhóm **L4-I** của đợt sửa lượt 4 (công cụ, gói F): DR6-155…157.

#### Thay đổi

- **DR6-155 (a), `tools/pr-core.test.mjs`:** thêm vào ca "takes a PR it could not read every file of as code (DR6-57)" một PR đọc thiếu có file đổi tên (`{ path, previousPath }`, `changedFiles: 2`). Ca đòi đúng "Read 1 of the 2 files of the PR: check them by hand." và đủ danh sách lý do chặn. Không sửa `pr-core.mjs`.
- **DR6-156, `tools/notes-core.mjs`:** khi đích là glob và ghi chú là thư mục, `covers` dùng hàm mới `globMeetsFolder`, so glob với thư mục theo từng đoạn đường dẫn:
  - đoạn `**` → cho qua;
  - đoạn khác khớp tên thư mục cùng chỗ bằng `globRegExp`;
  - hết thư mục mà glob còn đoạn bên dưới → cho qua.

  Thay cách cũ "phần trước dấu `*` đầu + phải có `**`". Ví dụ đích `packages/*/src/schema.ts` giờ thấy ghi chú `packages/ai/src/`.
- **DR6-157, `tools/size-report-core.mjs`:** dòng "Tệp khác" của `bundleReport` chỉ đếm những loại file bản dựng sinh ra (`OTHER_ASSET`: html, wasm, font, ảnh). File `demo-<ngày>.sqlite` mà `e2e/serve.mjs` để lại trong `dist` không còn được cộng. Không sửa `serve.mjs`.
- **DR6-155 (b), `e2e/guide/shots.guide.ts`:** sau mỗi lần chụp một phần (`Locator`), hàm `expectShotWhole` bật lại đúng `options.style` của lần chụp, vì Playwright để nguyên chỗ cuộn nhưng gỡ style ra. Rồi hàm kiểm bằng `document.elementFromPoint`:
  - giữa mép trên của phần chụp phải là chính phần đó, không phải header;
  - nếu phần đó không cao hơn cửa sổ (khi ấy Playwright chỉ chụp trong cửa sổ), giữa chân của nó cũng phải là chính nó, không nằm ngoài cửa sổ.

  Không thêm thư viện. Kiểm này đọc `options.style`, không tự chèn một style riêng, nên khi gỡ style thì kiểm không còn gì để bật lại và báo đỏ.

#### Test chấp nhận

- [x] **Ca `mergeBlockers` mới đỏ với đột biến T83c.** Đổi `Read ${pr.files.length}` thành `Read ${paths.length}` ở `tools/pr-core.mjs:147` rồi chạy `pnpm exec vitest run tools/pr-core.test.mjs` → `1 failed`: nhận "Read 2 of the 2 files…", đòi "Read 1 of the 2 files…". Trả lại code thì 78/78 xanh.
- [x] **`relatedNotes` với đích `packages/*/src/schema.ts` thấy ghi chú thư mục `packages/ai/src/`.**
  - Hai ca mới đỏ trước khi sửa, xanh sau khi sửa. Ca chuỗi đi `openNotes` → `targetPatterns(['packages/*/src/schema.ts'])` → `relatedNotes`, như CXR4-F1.
  - Đối chứng thấy ghi chú: `packages/ai/src/*.ts`, `packages/**/schema.ts`, `packages/a*/src/x/y.ts`.
  - Đối chứng không thấy: `packages/*/lib/schema.ts`, `packages/d*/src/schema.ts`, `packages/*/*.ts`, `packages/*`.
  - Mọi ca cũ của `notes-core` xanh (30/30).
- [x] **`size-report` sau `pnpm e2e` không cộng file `.sqlite` vào "Tệp khác".**
  - Ca unit mới (có `demo-2026-09-15.sqlite`) đỏ trước khi sửa: `{ files: 5, raw: 1107 }`.
  - Đo thật trên `apps/desktop/dist` của máy này, đang còn `demo-2026-09-15.sqlite` 9 969 664 B từ một lần chạy e2e: `node tools/size-report.mjs` → `Tệp khác (19 file: wasm, font, ảnh…) | 1 022 121`. Số này đúng bằng mốc bản dựng sạch ở `baseline.md` của lượt 4 (19 file, 1 022 121 B).
  - Ca cũ `{ files: 2, raw: 57 }` (wasm + html) giữ nguyên.
- [x] **Gỡ `style` của `shots.guide.ts` thì bộ chụp đỏ.** Cách thử: sửa dòng `style:` của `shot()` theo từng biến thể dưới, chạy `pnpm exec playwright test -c playwright.guide.config.ts`, rồi `git restore docs/user-guide/img` sau mỗi lần chạy.

  | Biến thể | Kết quả |
  |---|---|
  | Giữ nguyên | 13 passed |
  | Gỡ nửa `header { position: static }` | `06 AI…` đỏ: "top of the part in the shot". Panel AI cao 1 001 px, header che mất hàng "KYC Intelligence" |
  | Gỡ nửa `scroll-margin-top: 0` | `04, 05 hồ sơ KH…` đỏ: "foot of the part in the shot". Thẻ "Dữ kiện KYC" có chân ở 907,5 > 900 |
  | Gỡ cả dòng `style` (đột biến của CXR4-F2) | `04, 05 hồ sơ KH…` đỏ: "foot of the part in the shot" |

  Trước khi thêm kiểm, cả hai nửa đều lọt: bản gỡ nửa header làm khác `06-ai-phan-tich.png` mà 13/13 vẫn xanh.

  Ảnh đang commit vẫn qua: `pnpm exec playwright test -c playwright.guide.config.ts --project check --no-deps` → 2 passed. PR không commit ảnh nào. Chạy lại bộ chụp thì 8 ảnh khác bản commit, vì các đợt sửa lượt 4 đã đổi màn (vd. `discovery@4` → `@5`): `03-ket-qua`, `04-chuyen-nhom`, `04-khach-hang-moi`, `05-du-kien-kyc`, `05-ho-so-kh`, `06-ai-phan-tich`, `08-nhan-su-moi`, `09-cai-dat-ai`. Chụp lại thuộc G7, theo HANDOFF.

  Bộ chụp ảnh chỉ chạy tay, không chạy trong CI. CI chỉ kiểm kiểu (`tsc -p e2e`) và lint của `shots.guide.ts`.
- [x] `pnpm verify` xanh.

#### Ghi chú OPEN liên quan

Không có. `node tools/notes-for.mjs --diff` báo không có ghi chú OPEN nào nêu 6 file của PR.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Cỡ: SP ≈ 45 dòng (`notes-core.mjs`, `size-report-core.mjs`, `shots.guide.ts`), test ≈ 50 dòng. Không đổi lệnh hay cách dùng của `pr-status`, `merge-pr`, `notes-for`, `size-report`. Không đụng file nào cần `build-exe`.

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-327 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #905 — T-328: Lượt 4 L4-J: nghiệm thu NT-EX-08/09 cho dữ liệu exe trước v1.0 (KNOWN CLR4-F2)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Nhóm **L4-J** của đợt sửa lượt 4, theo Q4 (a) (Owner đồng ý 31/10): mục KNOWN CLR4-F2 giữ K1, không sửa code; chỉ thêm một dòng vào NT-EX-08 / 09 của `docs/testing/nghiem-thu-v1.md`.

Nội dung dòng đó: dữ liệu tạo ở exe trước v1.0 mà ô tùy chọn của lịch hẹn (lý do dời, việc tiếp theo…) chỉ có ký tự vô hình thì ở v1.0 không xuất / nhập lại được:

- luật nhập 4 của T-291 từ chối;
- hộp 10b báo "File hỏng hoặc không phải backup Project-2C", kể cả với bản v1.0 tự xuất sau khi nâng cấp tại chỗ;
- dữ liệu giả lập thì nạp lại (K1 / R2-02).

##### Bối cảnh

Deep review Phase 1–6 lượt 4: tổng hợp T-318 #893, PR #895, §8.4 (KNOWN CLR4-F2) và §8.2 (nhóm L4-J); câu hỏi §9 Q4, Owner 31/10 chọn (a). Đường vào là UI thường của exe lượt 3: `optionalText` của `119e2e4` chỉ `trim`, nên lưu nguyên chữ chỉ có ký tự vô hình. Đường vòng: chép bản backup tự động `.db` thành `project2c.db` (`09-cai-dat.md`), hay Nạp lại.

##### Tài liệu cần đọc

- `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` §8.4, §9 Q4
- Báo cáo gốc (PR #894): `docs/reviews/raw/2026-10-31/claude/F.md` (CLR4-F2, chuỗi F11)
- `docs/testing/nghiem-thu-v1.md` (NT-EX-08, NT-EX-09), `docs/user-guide/09-cai-dat.md` (lấy lại dữ liệu từ backup tự động)
- `packages/db/src/backup-validation.ts` (luật 4: chữ tùy chọn của lịch hẹn), `packages/db/src/common.ts` (`optionalText`)

##### File / thư mục được phép sửa

- `docs/testing/nghiem-thu-v1.md`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files docs/testing/nghiem-thu-v1.md` (sổ @ `2e51e25`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

Không (tài liệu).

##### Test chấp nhận

- [ ] NT-EX-08 / 09 có dòng trên, khớp hành vi của luật nhập 4 và câu 10b ở `vi.ts`.

Ước lượng: 1–3 dòng tài liệu.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI: PR chỉ sửa docs, không chạy
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #928 — docs: note pre-v1.0 appointment text in NT-EX-08/09, choice mockup deviations (T-328)

Trạng thái: MERGED · merge 2026-11-01T06:20:01Z · commit `532a93a2a2bba6d55ea36731abeeb2be8064efa4` · nhánh `task/T-328-nt-ex-pre-v1-data` · nhãn: risk:low

Closes #905

#### Thay đổi

Nhóm **L4-J** của đợt sửa lượt 4 (bản tổng hợp lượt 4 §8.4, §9 Q4: Owner 31/10 chọn (a)). KNOWN CLR4-F2 giữ K1, không sửa code; chỉ sửa `docs/testing/nghiem-thu-v1.md`.

- **NT-EX-08, cột Ghi chú:** thêm ngoại lệ đã biết (K1, R2-02; CLR4-F2), giữ câu cũ "Exe Phase 5: xem Cách dùng":
  - Exe trước v1.0 lưu nguyên chữ chỉ có ký tự vô hình ở ô tùy chọn của lịch hẹn: mô tả trigger, việc tiếp theo, ghi chú cuộc gặp, lý do dời. Lịch đã xóa cũng tính.
  - Thư mục có chữ đó vẫn mở bằng v1.0 không lỗi và xuất backup được, nhưng v1.0 không nhập lại được file đó, kể cả bản chính nó xuất sau khi nâng cấp tại chỗ.
  - Lý do: luật 4 của T-291 (#780) từ chối. Hộp 10b hiện "Không nhập được file" · "File hỏng hoặc không phải backup Project-2C".
  - Không mở Issue. Dữ liệu giả lập thì Nạp lại (NT-CD-08).
- **NT-EX-09, cột Ghi chú:** file có lịch hẹn như vậy thì hiện hộp 10b thay cho 10a, dữ liệu hiện tại không đổi. Ghi chú trỏ về NT-EX-08.
- **"Lệch mockup đã biết":** thêm mục ô chọn, gộp mục sổ [T-328 #905] của review #920.
  - `Choices` cho chữ dài xuống dòng (vd. giá trị KYC dài ở 7d), còn `.choice` của `forms.css` có `white-space: nowrap`.
  - Ô tắt mờ 0,4 như `.choice.off` của `forms.css`, còn hộp 1c của `ai.html` tự vẽ 0,45.

##### Đối chiếu với code

- **Exe trước v1.0 chỉ `trim`:** `optionalText` ở Phase 5 (`3d6c7fc`) và ở exe lượt 3 (`119e2e4`) chỉ `trim` nên lưu nguyên chữ chỉ có ký tự vô hình. Bản nay đọc qua `normalizeText` (`packages/db/src/common.ts:75-78`).
- **Luật nhập:** `appointmentTextStored` (`packages/db/src/backup-validation.ts:99-111`) kiểm `trigger_note`, `next_step`, `note` của mọi lịch hẹn, kể cả đã xóa. Ba cột ứng với bốn ô của dòng ghi chú: mô tả trigger, việc tiếp theo, còn ghi chú cuộc gặp và lý do dời cùng lưu vào `note` (`packages/db/src/appointments.ts:242-245`, `:351`).
- **Câu 10b:** lấy nguyên văn từ `vi.ts` (`settings.backup.refusedTitle`, `settings.backup.invalid`). Exe Phase 5 cũng dùng các nhãn ô và câu 10b này (`3d6c7fc:apps/desktop/src/i18n/vi.ts`).
- **"Luật 4 của T-291":** là luật thứ 4 trong bảy luật của #780: "Bước tiếp theo hoặc ghi chú lịch hẹn chỉ có ký tự vô hình thì coi là rỗng". Không nhầm với "§6 luật 4" (bất biến liên bảng) của `phase-3-du-lieu.md`.
- **Mở và xuất vẫn được:** theo kịch bản F11 của báo cáo gốc `docs/reviews/raw/2026-10-31/claude/F.md`, exe lượt 4 mở được thư mục đó và xuất được. Chỉ lần nhập bị từ chối.
- **Hộp 1c, không phải 1g:** mục sổ ghi `.choice.off` (0,45) thuộc hộp 1g, nhưng nơi dùng `choice off` duy nhất của `ai.html` là dòng 420, trong hộp **1c · Bản web** (dòng 415). Tài liệu ghi 1c.

#### Test chấp nhận

- [x] NT-EX-08 / 09 có dòng trên, khớp hành vi của luật nhập 4 và câu 10b ở `vi.ts`.

#### Ghi chú OPEN liên quan

- L33 `docs/testing/nghiem-thu-v1.md` **[T-328 #905]** (hai chỗ ô chọn còn khác mockup, chưa ghi ở "Lệch mockup đã biết"): **đã sửa**. Thêm mục "Ô chọn" vào danh sách đầu của "Lệch mockup đã biết", gồm chữ xuống dòng và độ mờ 0,4 / 0,45. Hộp ghi là 1c thay cho 1g của mục sổ (xem "Đối chiếu với code").

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

PR chỉ sửa docs (`docs/testing/nghiem-thu-v1.md`, không thuộc `CODE_DOCS`): CI không chạy.

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-328 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #920 — T-328 (#905, PR #928, `REVIEW: PASS` @`0f88eac`):
  - #920, `docs/testing/nghiem-thu-v1.md` ("Lệch mockup đã biết", mục "Ô chọn"): ghi hai chỗ ô chọn còn khác mockup. Chữ dài xuống dòng trong ô, còn `.choice` của `docs/design/mockups/forms.css` có `white-space: nowrap`. Ô tắt mờ 0,4 như `.choice.off` của `forms.css`, còn hộp 1c của `docs/design/mockups/ai.html` tự vẽ 0,45. Mục sổ ghi hộp 1g; tài liệu ghi 1c, vì `choice off` duy nhất của `ai.html` nằm ở dòng 420, trong hộp 1c (dòng 415).

---

# Issue #930 — T-329: Mục sổ G7: packages/ai gỡ chép ở bộ chặn và test, tách Mock trích xuất ra file riêng (không đổi hành vi)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Sửa sáu mục sổ OPEN ở `packages/ai` (review #913: 3 mục, review #917: 3 mục). **Không đổi hành vi:** output của Mock, của bộ chặn V3–V6 và của validator giữ nguyên từng ký tự.

1. **`LAW_NAME` dựng bằng một hàm (review #913, có thể là *Duplicated Code*).** Khuôn `(?<!${B}(X)\s+)${ci(word)}` đang chép hai lần: "giới" trừ khi đứng sau `GIOI_OF`, "định" trừ khi đứng sau `QUY`. Dựng cả hai bằng một hàm nhỏ (vd. `unlessAfter(word, before)`). Regex dựng ra phải giống hệt bản hiện tại, nên bộ chặn không đổi và việc này không qua G5 (Owner duyệt cách gom 01/11).
2. **Hằng `NUL` dùng chung cho test (review #913, có thể là *Duplicated Code*).** `NUL` đang khai riêng ở hai file test, file thứ ba viết trần `'\^@'`. Thêm `NUL` cạnh `ZWSP` trong file hỗ trợ test của package; ba file test cùng nhập nó.
3. **Chú thích của `ownLine` (review #913, NIT).** Danh sách các bước làm sạch thiếu bước bỏ NUL mà PR #913 thêm. Thêm NUL vào, như chú thích của `cleanText` ("no invisible character nor NUL").
4. **Tách Mock trích xuất ra file riêng (review #917, có thể là *Divergent Change*).** File Mock nay 779 dòng: dòng 1–67 là adapter cùng Mock phân tích / khám phá, phần còn lại là luật trích xuất và bộ đọc riêng của nó (`readerOf`, `clausesOf`, `joinedIn`, `aboutTheKh`).
   - Đổi tên file hiện có thành `mock-extraction.ts` bằng `git mv`, rồi tạo lại file adapter với phần 1–67. Git ghi nhận đổi tên và giữ lịch sử, thay vì ~1 400 dòng xóa / thêm.
   - Test của phần trích xuất đi theo file mới nếu tách gọn; không thì giữ một file test, PR ghi lý do.
5. **`THE_KH` / `KH_NAMED` dựng bằng một hàm (review #917, có thể là *Duplicated Code*).** Hai khuôn cặp vợ chồng viết tay, chỉ khác ở chỗ có bắt buộc chữ "KH" hay không. Dựng cả hai bằng một hàm, như `opener` đã làm cho `OPENS` / `OPENS_AFTER`. Regex dựng ra giống hệt bản hiện tại.
6. **Vế `at < kh` của `aboutTheKh` (review #917, NIT).** Vế này không bao giờ đúng: `kh` là chỗ bắt đầu của vế hoặc chỗ hết một khớp sticky ở đầu vế, mà không khớp nào chứa chỗ bắt đầu của một cụm. Đổi thành `if (kh === undefined) return undefined;`. Sửa luôn chú thích đi kèm: câu "Độc thân: KH đã kết hôn." bị chặn vì `kh === undefined`, không vì vế này.

##### Bối cảnh

- G7 Phase 6. Đợt sửa lượt 4 (T-319…T-328) xong 01/11; sổ OPEN còn 27 mục [G7]. Owner 01/11 duyệt gom thành sáu Issue T-329…T-334 (Owner 23/10: sửa hết trước v1.0).
- T-330 (luật mới của Mock trích xuất) làm sau Issue này, trên file trích xuất mới.
- Diff chạm `packages/ai/**` nên review lên mức high (skill `review-pr` §2), Owner merge.
- Sau các Issue code của G7: chụp lại ảnh hướng dẫn, rồi nghiệm thu trên exe phát hành.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: nhóm review PR #913 và nhóm review PR #917, các mục [T-329]
- `packages/ai/src/blocklists.ts` (`LAW_NAME`, `GIOI_OF`, `QUY`, `ci`, `B`); `packages/ai/src/blocklists.test.ts`
- `docs/design/phase-5-prompts.md` §8.4 (ô "luật"; chỉ đọc)
- `packages/ai/src/test-support.ts` (`ZWSP`); `packages/ai/src/validator-blocklists.test.ts`, `packages/ai/src/web.test.ts`, `packages/ai/src/validator.test.ts`
- `packages/ai/src/web.ts` (`ownLine`); `packages/ai/src/text-match.ts` (`cleanText` và chú thích đầu file)
- `packages/ai/src/mock-adapter.ts` (cả file: phần adapter dòng 1–67; `THE_KH`, `KH_NAMED`, `opener`; `aboutTheKh`); `packages/ai/src/mock-adapter.test.ts`
- `packages/ai/src/index.ts`; `packages/ai/CLAUDE.md` (bản đồ export, `pnpm codemap`)
- Comment review của PR #913 và PR #917

##### File / thư mục được phép sửa

- `packages/ai/src/blocklists.ts`, `packages/ai/src/blocklists.test.ts`
- `packages/ai/src/test-support.ts`, `packages/ai/src/validator-blocklists.test.ts`, `packages/ai/src/web.test.ts`, `packages/ai/src/validator.test.ts`
- `packages/ai/src/web.ts` (chỉ chú thích của `ownLine`)
- `packages/ai/src/mock-adapter.ts`, `packages/ai/src/mock-extraction.ts` (mới, qua `git mv`), `packages/ai/src/mock-adapter.test.ts`, `packages/ai/src/mock-extraction.test.ts` (mới, nếu tách test)
- `packages/ai/src/index.ts` (nếu export đổi chỗ)
- `packages/ai/CLAUDE.md` (khối codemap)

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với các đường dẫn trên (sổ @ `343cd6f`; nhãn theo PR sổ gắn lại nhãn ngày 01/11):

- **Gộp** sáu mục [T-329]:
  - review #913: `LAW_NAME`, hằng `NUL` của test, chú thích `ownLine`;
  - review #917: tách file trích xuất, `THE_KH` / `KH_NAMED`, vế `at < kh`.
- **Để lại**, thuộc T-330 (khớp vì nêu file Mock): Correctness 1 của review #917 (luật mới của Mock trích xuất); NIT chữ §10 của spec Phase 5.

##### Interface / hợp đồng

- API công khai của `@p2c/ai` không đổi (`createMockAdapter` và các export khác); chỉ đường import trong package đổi.
- Chuỗi regex dựng từ `LAW_NAME`, `THE_KH`, `KH_NAMED` giống hệt bản ở `main` trước PR.

##### Test chấp nhận

- [ ] Regex dựng ra từ `LAW_NAME`, `THE_KH` và `KH_NAMED` giống hệt từng ký tự bản ở `main` trước PR. PR ghi lệnh so (chuỗi trước / sau) và kết quả.
- [ ] Mọi test có sẵn của `packages/ai` xanh mà không sửa kỳ vọng của ca nào; chỉ được đổi import hay chuyển ca sang file test mới.
- [ ] `git diff --stat -M` của PR cho thấy đổi tên file Mock thành `mock-extraction.ts`, không phải ~700 dòng xóa cộng ~700 dòng thêm; `git log --follow` của file mới thấy lịch sử của file Mock cũ.
- [ ] `NUL` export từ file hỗ trợ test; ba file test nhập nó. Lệnh `rg` ghi trong PR cho thấy test của `packages/ai` không còn khai `NUL` riêng hay viết trần `'\^@'`.
- [ ] Chú thích của `ownLine` nêu bước bỏ NUL.
- [ ] `aboutTheKh` không còn vế `at < kh`. Chú thích tả đúng đường chặn của "Độc thân: KH đã kết hôn."; có ca test cho câu này ra 0 (ca có sẵn hoặc ca mới).
- [ ] Khối codemap của `packages/ai/CLAUDE.md` khớp code (`pnpm verify`).

Ước lượng: ~200 dòng tổng diff (code sản phẩm ~80; phần đổi tên file không tính).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low (review tự lên mức high vì chạm `packages/ai`; Owner merge)

##### Bị chặn bởi

Không

## PR #937 — refactor(ai): one helper for LAW_NAME and the KH openers, shared NUL in tests, Mock extraction in its own file (T-329)

Trạng thái: MERGED · merge 2026-11-01T07:43:53Z · commit `b6d4388e2b6993c8fdc548636c2644c74edb9816` · nhánh `task/T-329-ai-dedup-mock-extraction` · nhãn: risk:low

Closes #930

#### Thay đổi

Sáu mục sổ [T-329] của `packages/ai`, không đổi hành vi: regex, output của Mock, của bộ chặn V3–V6 và của validator giữ nguyên.

1. `blocklists.ts`: `unlessAfter(word, before)` dựng cả hai ngoại lệ của `LAW_NAME` ("giới" trừ sau `GIOI_OF`, "định" trừ sau `QUY`).
2. `test-support.ts` export `NUL` cạnh `ZWSP`, gộp hai chú thích cũ thành một. `validator-blocklists.test.ts`, `web.test.ts`, `validator.test.ts` nhập `NUL` từ đây.
3. `web.ts`: chú thích của `ownLine` thêm bước bỏ NUL (DR6-142). Chỉ đổi chú thích.
4. Tách Mock:
   - `mock-adapter.ts`: `createMockAdapter`, đọc input, gồm cả `allowedFields`, vì hàm này đọc `fields` của input.
   - `mock-extraction.ts`: luật trích xuất và bộ đọc riêng của nó. Đầu file có chú thích riêng. Export duy nhất là `mockExtractionOutput(note, fields)`: hàm `extraction` cũ, đổi tên cho cùng kiểu `mock…Output`.
   - `index.ts` giữ như `main`, nên API công khai của `@p2c/ai` không đổi và `mock-extraction` không qua `index.ts`.
   - Test cũng tách: 17 ca adapter sang `mock-adapter.test.ts`, 565 ca trích xuất ở lại `mock-extraction.test.ts`.
   - `request` / `complete` dùng ở cả hai file, nên chuyển sang `test-support.ts` thành `mockRequest` / `completeMock`, để không file nào chép chúng. `completeMock` dùng `assert` của vitest thay `if … throw`. File hỗ trợ test nằm trong vùng coverage 100%, mà nhánh "Mock trả lời không có JSON" không ca nào chạy tới.
5. `THE_KH` / `KH_NAMED` dựng bằng `namingTheKh(kh, saysKh)`.
6. `aboutTheKh`: bỏ vế `at < kh`, sửa chú thích. Câu "Độc thân: KH đã kết hôn." bị chặn vì `kh === undefined`: ":" không kết thúc vế, nên cả câu là một vế không mở trên KH.
   - Thêm ca "Độc thân: KH đã kết hôn." → 0.
   - Kiểm thực nghiệm trước khi bỏ: tạm cho vế này `throw`, rồi chạy cả 4 206 test unit. Không lần nào chạy tới.

##### Ba commit; đề xuất Owner merge bằng `--merge`

1. `60ab4ad`: mục 1, 2, 3, 5, 6, trên file Mock cũ.
2. `eefcd8e`: chỉ đổi tên (`git mv mock-adapter.ts mock-extraction.ts`, cả file test). Git ghi `{mock-adapter.ts => mock-extraction.ts} | 0`.
   - Commit này sửa thêm import ở `index.ts` và `run.test.ts`, chỉ để đổi tên đứng riêng; `run.test.ts` không thuộc file Issue cho sửa.
   - Commit 3 trả cả hai về đúng như `main`: `git diff main... -- packages/ai/src/index.ts packages/ai/src/run.test.ts` rỗng.
3. `d9d11b4`: tạo lại `mock-adapter.ts` với phần adapter, tách test.

Mỗi commit đều `pnpm verify` xanh.

Vì sao làm hai bước: `mock-adapter.ts` vẫn còn sau PR. Nếu so cả PR với `git diff -M`, git không bao giờ ghép một file còn tồn tại với file mới, nên tách trong một commit sẽ hiện ~720 dòng xóa cộng ~720 dòng thêm.

Thử squash trong một worktree tạm (đã xóa):

- `git log --follow -- packages/ai/src/mock-extraction.ts` vẫn thấy lịch sử cũ (#917, #822, #812…).
- Nhưng `git blame` thường dồn cả 722 dòng vào commit squash. Phải có `-C` mới thấy đúng: 23 dòng của T-329, phần còn lại của các PR cũ.
- Merge commit giữ commit đổi tên, nên `git blame` thường ra đúng (22 dòng của T-329).

→ Đề xuất: `node tools/merge-pr.mjs <N> --owner --merge`.

#### Test chấp nhận

- [x] **Regex giống hệt từng ký tự.** Một test tạm ở scratchpad (không commit) thay `globalThis.RegExp` bằng một Proxy, rồi `import` `packages/ai/src/index.ts`. Mỗi lần `new RegExp(...)` lúc nạp module được ghi lại thành một dòng JSON (đối số nguyên văn và cờ).
  - Có cả `LAW_NAME` (qua `pattern()` của `text-match.ts`) và `OPENS` / `OPENS_AFTER` (qua `opener()`, chứa nguyên chuỗi `THE_KH` / `KH_NAMED`).
  - Chạy ở `main` (`97876b4`), sau commit 1 và ở head: `git diff --no-index before.txt after.txt` → không khác. Cả hai bản đều 210 regex, cùng thứ tự.
  - Regex viết dạng literal (`/…/`) không đi qua constructor, nhưng chúng chỉ chuyển nguyên văn theo `git mv` / cắt file.

  <details><summary>Lệnh so</summary>

  ```js
  // regex-dump.test.mjs — chạy: REGEX_DUMP_OUT=<file> pnpm exec vitest run --config vitest.dump.config.mjs
  // (vitest.dump.config.mjs: export default { test: { dir: import.meta.dirname, include: ['regex-dump.test.mjs'] } })
  import { writeFileSync } from 'node:fs';
  import { it } from 'vitest';

  it('dumps every RegExp built when @p2c/ai loads', async () => {
    const built = [];
    const Native = globalThis.RegExp;
    globalThis.RegExp = new Proxy(Native, {
      construct(target, args) {
        built.push(JSON.stringify(args.map((arg) => (arg instanceof Native ? String(arg) : arg))));
        return Reflect.construct(target, args);
      },
    });
    try {
      await import('C:/workspace/Project-2C/packages/ai/src/index.ts');
    } finally {
      globalThis.RegExp = Native;
    }
    writeFileSync(process.env.REGEX_DUMP_OUT, `${built.join('\n')}\n`);
  });
  ```

  </details>

- [x] **Test có sẵn xanh, không sửa kỳ vọng.** Ngoài đổi import và chuyển ca sang file mới, PR làm thêm một việc mà Issue không nêu: chuyển hai hàm gọi Mock `request` / `complete` sang `test-support.ts`, đổi tên thành `mockRequest` / `completeMock`, và thay `if … throw` bằng `assert` của vitest.
  - Lý do: hai file test mới cùng dùng chúng, nên để ở một file thì phải chép sang file kia.
  - `test-support.ts` nằm trong vùng coverage 100%, mà nhánh `throw` không ca nào chạy tới. `assert` giữ đúng phép kiểm đó mà không có nhánh.
  - So tên đầy đủ và kết quả của mọi ca (vitest `--reporter=json`, sắp xếp) của test Mock + `run.test.ts`, trước và sau khi tách test: 638 / 638 ca, giống hệt.
  - Toàn repo: 4 207 ca = 4 206 của `main` + 1 ca mới ("Độc thân: KH đã kết hôn.").
- [x] **Đổi tên file Mock: đạt theo commit `eefcd8e` và với `-B -M` / `-C` cho cả PR. Lệnh `git diff --stat -M` của Issue, chạy cho cả PR, không thể ra đổi tên**, vì `mock-adapter.ts` vẫn còn sau PR (xem mục "Ba commit" ở trên). Ý của Issue (giữ lịch sử, không phải ~1 400 dòng xóa / thêm) vẫn đạt.
  - Commit `eefcd8e`: `git show --stat -M` → `packages/ai/src/{mock-adapter.ts => mock-extraction.ts} | 0`. Cả PR: `git diff --stat -B -M main...` (hay `-C`) → `{mock-adapter.ts => mock-extraction.ts}`, `{mock-adapter.test.ts => mock-extraction.test.ts}`.
  - `git log --follow --oneline -- packages/ai/src/mock-extraction.ts` thấy `d9d11b4`, `eefcd8e`, `60ab4ad`, rồi `5d13f5a` (#917), `d1a75e7` (#822)…
- [x] **`NUL`** export từ `test-support.ts`; ba file test nhập nó.
  - `rg -n -F -e 'const NUL' -e '\^@' -e 'fromCodePoint(0)' packages/ai/src` → chỉ `packages/ai/src/test-support.ts:23: export const NUL = String.fromCodePoint(0);`.
  - `'\0'` ở `text-match.ts` là code sản phẩm, giữ nguyên.
- [x] **Chú thích của `ownLine`** nêu bước bỏ NUL.
- [x] **`aboutTheKh`** không còn vế `at < kh`. Chú thích tả đúng đường chặn, có ca "Độc thân: KH đã kết hôn." → 0.
- [x] **Khối codemap** của `packages/ai/CLAUDE.md` khớp code (`pnpm verify`). Khối nay có `src/mock-adapter.ts — createMockAdapter`, `src/mock-extraction.ts — mockExtractionOutput`, `test-support` thêm `NUL`, `mockRequest`, `completeMock`.

Cỡ diff, theo từng commit với `-M`:

- Commit 1: +37 / −20.
- Commit 2: +5 / −5 (đổi tên).
- Commit 3: +281 / −263.
  - Phần lớn là 155 dòng test adapter và 72 dòng adapter chuyển sang file mới, và cùng chừng ấy dòng bỏ khỏi file cũ.
  - Code mới thật chỉ gồm chú thích đầu `mock-extraction.ts`, `mockRequest` / `completeMock` và import.

#### Ghi chú OPEN liên quan

- L21 `blocklists.ts` (`LAW_NAME`): đã sửa (mục 1).
- L22 `NUL` của test: đã sửa (mục 2).
- L23 `web.ts` (`ownLine`): đã sửa (mục 3).
- L25 [T-330 #931] Mock chưa theo câu sau cập nhật trạng thái, "bé" như "con": để lại. Đây là luật mới của Mock trích xuất, đổi hành vi, thuộc T-330 #931; Issue này giữ nguyên hành vi.
- L26 [T-330 #931] NIT §10 của `docs/design/phase-5-ai.md`: để lại. Thuộc T-330 #931, viết lại §10; Issue này không cho sửa file đó.
- L27 `aboutTheKh` vế `at < kh`: đã sửa (mục 6).
- L28 `THE_KH` / `KH_NAMED`: đã sửa (mục 5).
- L29 tách Mock trích xuất: đã sửa (mục 4).

#931 (T-330) cho sửa `mock-extraction.ts`, `mock-extraction.test.ts` và `mock-adapter.test.ts`, khớp chỗ PR này đặt ca trích xuất. T-330 chỉ cần nhập `completeMock` từ `test-support.ts`, không phải sửa file đó.

Cho PR sổ sau review:

- L25 nêu `packages/ai/src/mock-adapter.ts` (`endedBy`…). Sau PR này phần đó ở `packages/ai/src/mock-extraction.ts`, nên nên đổi đường dẫn trong mục.
- `packages/ai/CLAUDE.md` mục "File hay tìm" vẫn ghi "Mock: `src/mock-adapter.ts`". Câu này vẫn đúng cho adapter, nhưng chưa nêu `src/mock-extraction.ts`.
  - Không sửa ở đây vì Issue chỉ cho sửa khối codemap, mà khối đó đã có file mới.
  - Có thể ghi thành NIT cho lần chạm sau.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (ở cả ba commit; head: 126 file test, 4 207 ca, coverage `packages/ai` 100%)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low` (chạm `packages/ai` nên review lên mức high; Owner merge)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-329 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #913, #917 — T-329 (#930, PR #937, `REVIEW: PASS` @`d9d11b4`):
  - #913, `packages/ai/src/blocklists.ts` (`LAW_NAME`): `unlessAfter(word, before)` dựng cả hai ngoại lệ ("giới" trừ sau `GIOI_OF`, "định" trừ sau `QUY`). Chuỗi regex giống hệt bản trước: review #937 dựng lại từ mã nguồn của `97876b4` và `d9d11b4`.
  - #913, `packages/ai/src/test-support.ts`: `NUL` export cạnh `ZWSP`; `packages/ai/src/validator-blocklists.test.ts`, `packages/ai/src/web.test.ts` và `packages/ai/src/validator.test.ts` nhập nó, không file test nào còn khai riêng.
  - #913 NIT, `packages/ai/src/web.ts` (`ownLine`): chú thích thêm bước bỏ NUL ("nor NUL", DR6-142).
  - #917 NIT, `packages/ai/src/mock-extraction.ts` (`aboutTheKh`): bỏ vế `at < kh`. Chú thích ghi "Độc thân: KH đã kết hôn." là một vế (":" không kết thúc vế) không mở trên KH, kèm ca → [] ở `packages/ai/src/mock-extraction.test.ts`. Review #937 so Mock trích xuất của `97876b4` với head trên 450 000 ghi chú: 0 khác, vế không lần nào đúng.
  - #917, `packages/ai/src/mock-extraction.ts` (`THE_KH` / `KH_NAMED`): dựng bằng `namingTheKh(kh, saysKh)`, chuỗi giống hệt bản trước.
  - #917, tách Mock trích xuất: `git mv` sang `packages/ai/src/mock-extraction.ts` (commit `eefcd8e`, đổi tên thuần), rồi tạo lại `packages/ai/src/mock-adapter.ts` gồm adapter và `allowedFields`. Export duy nhất của file mới là `mockExtractionOutput`, không qua `index.ts`. Test tách theo: 17 ca adapter ở `packages/ai/src/mock-adapter.test.ts`, 565 ca trích xuất ở `packages/ai/src/mock-extraction.test.ts`; `mockRequest` / `completeMock` dùng chung ở `packages/ai/src/test-support.ts`. PR merge bằng squash (`b6d4388`): `git log --follow` vẫn thấy lịch sử cũ, còn `git blame` cần `-C`.

---

# Issue #931 — T-330: Mục sổ G7: Mock trích xuất theo quyết định Owner 31/10 – 01/11 (giá trị cuối về KH, Ly hôn / Góa / Ly thân, con đã mất, "bé"), viết lại §10

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Làm mục Correctness 1 của review #917 theo các quyết định Owner 31/10 – 01/11 (sổ, nhóm review PR #917, mục đầu). Viết lại §10 của spec Phase 5 (Mock trích xuất) theo luật mới, gộp NIT chữ §10 của cùng review.

Mock hiện chưa theo câu sau cập nhật trạng thái của câu trước, và chưa tính "bé" như "con". Bốn luật Owner chọn:

1. **Giá trị cuối về KH thay luật hai giá trị.** Mỗi trường lấy giá trị cuối cùng nói về KH trong ghi chú: là câu kể đơn thì đề xuất, không thì bỏ trường. Câu không chủ ngữ ngay sau câu kể đơn về KH được tính là nói về KH.
2. **Hôn nhân thêm ba giá trị:**
   - "Ly hôn" (nhãn như seed) từ "ly hôn", "ly dị";
   - "Góa" (một nhãn chung, như "Ly hôn") từ "góa vợ / chồng", và từ "vợ / chồng đã mất / qua đời" sau câu kể đơn về KH đã kết hôn, kể cả trong cùng câu;
   - "Ly thân" từ "ly thân" sau câu kể đơn về KH đã kết hôn.
3. **Trừ số con đã mất.** Vế hay câu sau "<k> con / bé đã mất / qua đời" (k viết bằng số hay chữ) trừ k khỏi số con của KH nêu trước. Dạng khác ("con út đã mất", "mất một con") thì bỏ đề xuất Số con.
4. **"bé" (đứa trẻ) tính như "con"** ở luật người khác nêu trước. Trừ "bé" nghĩa "nhỏ": "nhỏ bé", "bé nhỏ", "bé xíu", "bé tí", "bé hơn", "bé nhất".

Phần câu sau chỉ đoán / hỏi / bác bỏ bằng chữ ngoài danh sách thì giữ như hiện nay (đã ở ACCEPTED). Chỗ bốn luật trên chưa nói rõ: hỏi Owner trên Issue này trước khi code.

**§10 viết lại** theo bốn luật, gộp ba chỗ chữ rộng hơn code (NIT của review #917):
- "giá trị nói về người khác … không tính" → "người khác mà Mock nhận ra (chữ chỉ người…)";
- danh sách chữ nói thông tin sai mở bằng "…" → liệt kê đủ danh sách đóng của `RETRACTED`;
- "rồi tiểu từ" → "một tiểu từ" (`CLAUSE_DONE` chỉ nhận một).

##### Bối cảnh

- G7 Phase 6. Owner 01/11 duyệt gom 27 mục [G7] thành sáu Issue T-329…T-334 (Owner 23/10: sửa hết trước v1.0).
- Owner 31/10 – 01/11, trong phiên review #917, chọn sửa ở G7; nguồn: các comment quyết định Owner trên Issue #899 và PR #917, cùng mục đầu nhóm #917 của sổ. Việc ghi các quyết định này vào sổ quyết định là của T-334, không phải Issue này.
- Làm sau T-329, Issue tách phần trích xuất của Mock ra file riêng.
- Diff chạm `packages/ai/**` nên review lên mức high; Owner merge. Không đổi danh mục KYC: Hôn nhân là trường chữ tự do, nên ba giá trị mới không chạm `packages/domain` (không G2). Không golden nào chạy Mock (X01–X05 là của prompt `extraction@1`).

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: nhóm review PR #917, hai mục [T-330]; mục ACCEPTED về phần câu sau chỉ đoán / hỏi / bác bỏ
- `docs/design/phase-5-ai.md` §10
- `packages/ai/src/mock-extraction.ts` (sau T-329): `endedBy`, `PEOPLE`, luật hai giá trị ở cuối `extraction`, `RETRACTED`, `CLAUSE_DONE`; test của Mock trích xuất (`packages/ai/src/mock-extraction.test.ts` hoặc `packages/ai/src/mock-adapter.test.ts`, theo T-329)
- `packages/db/src/seed-data.ts` (`KYC_VALUES` của `maritalStatus`, các dòng ghi chú seed); chỉ đọc
- `e2e/customer-ai.spec.ts`, `e2e/customer-kyc.spec.ts`, `e2e/customer-ai-web.spec.ts`, `e2e/appointment-outcome.spec.ts` (ca có đề xuất của Mock trích xuất)
- Comment review của PR #917 (Correctness 1), comment quyết định Owner trên Issue #899 và PR #917

##### File / thư mục được phép sửa

- `packages/ai/src/mock-extraction.ts`, `packages/ai/src/mock-extraction.test.ts`, `packages/ai/src/mock-adapter.test.ts` (test của Mock trích xuất, theo chỗ T-329 để)
- `docs/design/phase-5-ai.md` (chỉ §10)
- `e2e/customer-ai.spec.ts`, `e2e/customer-kyc.spec.ts`, `e2e/customer-ai-web.spec.ts`, `e2e/appointment-outcome.spec.ts` (chỉ khi kết quả của Mock đổi)
- `packages/ai/CLAUDE.md` (khối codemap, nếu export đổi)

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với các đường dẫn trên (sổ @ `343cd6f`; nhãn theo PR sổ gắn lại nhãn ngày 01/11):

- **Gộp** hai mục [T-330] của review #917: Correctness 1 (luật mới của Mock trích xuất), NIT chữ §10.
- **Để lại:**
  - NIT §7.3 luật 2 ("100 code unit") của review #907, thuộc T-334 (khớp vì cùng file spec, khác mục);
  - tách file trích xuất của review #917, thuộc T-329 (khớp vì nêu tên file mới);
  - ô Giờ chỉ có ký tự vô hình của review #924, thuộc T-332 (khớp vì cùng nêu e2e của kết quả cuộc hẹn). T-332 thêm một lượt vào ca DR6-150 của e2e đó; PR nào merge sau thì `gh pr update-branch`.

##### Interface / hợp đồng

- Output của Mock trích xuất giữ schema hiện tại (`extraction@1`): trường, giá trị, trích dẫn. Giá trị Hôn nhân mới: "Ly hôn", "Góa", "Ly thân".
- API công khai của `@p2c/ai` không đổi.

##### Test chấp nhận

Mỗi câu dưới là một ca test của Mock trích xuất (chép nguyên văn ví dụ của sổ):

- [ ] Luật 1: "KH độc thân. Nay KH đã kết hôn." và "KH độc thân, nay đã kết hôn." → Hôn nhân: Đã kết hôn. "KH có 2 con. Thực ra chỉ 1 con." và "KH có 2 con. Anh Nam có 3 con." → không đề xuất Số con.
- [ ] Luật 2:
  - "KH đã kết hôn. Đã ly hôn năm 2020." → Ly hôn; một câu có "ly dị" sau câu kể đơn về KH → Ly hôn;
  - "KH đã kết hôn. Vợ đã mất năm 2020." và "KH đã kết hôn nhưng vợ đã mất." → Góa;
  - "KH đã kết hôn nhưng đang ly thân." → Ly thân.
- [ ] Luật 3: "KH có 2 con. Một con đã mất." → Số con 1; "KH có 2 con nhưng đều đã mất." → Số con 0; "con út đã mất" hay "mất một con" sau "KH có 2 con" → không đề xuất Số con.
- [ ] Luật 4: "KH có 2 bé đã lớn, độc thân." → chỉ Số con 2, không đề xuất Hôn nhân (như "KH có 2 con đã lớn, độc thân."). "bé" nghĩa "nhỏ" ("nhỏ bé", "bé nhỏ", "bé xíu", "bé tí", "bé hơn", "bé nhất") không tính là con.
- [ ] Mọi ca khác có sẵn của Mock giữ kết quả, trừ ca bốn luật trên làm đổi. Thân PR liệt kê từng ca có sẵn đổi kết quả (vd. "KH độc thân. Nay KH đã kết hôn.", "KH đã kết hôn nhưng vợ đã mất.", "KH có 2 con nhưng đều đã mất.").
- [ ] Thân PR ghi số đề xuất đổi trên ghi chú của seed: dòng "Hôn nhân: Ly hôn" nay ra Ly hôn.
- [ ] §10 tả bốn luật và ba chỗ chữ của NIT, khớp code. Các mục khác của spec không đổi.
- [ ] e2e có đề xuất của Mock trích xuất vẫn xanh; ca nào đổi kỳ vọng thì PR ghi lý do.

Ước lượng: ~400–550 dòng tổng diff (code sản phẩm ~200, test dạng bảng ~250, spec ~40). Vượt ~800 dòng thì PR nêu để Owner chấp nhận cỡ, hoặc tách theo luật (Hôn nhân / Số con), như PR #917.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low (review tự lên mức high vì chạm `packages/ai`; Owner merge)

##### Bị chặn bởi

#930

## PR #939 — feat(ai): Mock extraction takes the last value said of the KH, reads Ly hôn / Góa / Ly thân, children who died and "bé" (T-330)

Trạng thái: MERGED · merge 2026-11-01T15:28:48Z · commit `36a63e77e8f1d7e16de8b458abfb017869f2149b` · nhánh `task/T-330-mock-extraction-rules` · nhãn: risk:low

Closes #931

Mock trích xuất theo bốn luật Owner 31/10 – 01/11 (mục Correctness 1 của review #917), và bốn quyết định Owner 01/11 cho chỗ luật chưa nói rõ. Quyết định và các mặc định Claude chọn ghi ở [comment trên #931](https://github.com/AlexH-AI/Project-2C/issues/931#issuecomment-6555846300). §10 của spec Phase 5 viết lại, gộp ba chỗ chữ của NIT #917.

#### Sửa theo review @aa1d257 (vòng 1)

Diff của vòng sửa: `aa1d257..00e6e76` (commit `400167d` sửa code, test, §10; `00e6e76` sửa chữ §10 về giới hạn mang KH, thêm một test ghim). Từng mục của review:

- **Correctness 1 + Spec §10 `:383` [chặn]: đã sửa.**
  - Cụm bị chữ kết thúc (`endedBy`) nay ở lại lượt đọc. Nếu qua được `saysOfTheKh`, nó là giá trị nói về KH nhưng không phải câu kể đơn, nên trường đó không được đề xuất; giá trị cũ hơn không được đẩy lên thay.
  - Cụm đó không được đưa vào `simpleStatement`, nên không mang KH sang vế sau. Cách mang KH giữ nguyên như ở `aa1d257`.
  - Ba câu của review ra 0, có test.
  - §10, ý "chữ kết thúc", ghi rõ luật này, kèm ví dụ "KH độc thân. KH đã kết hôn nhưng sắp ly hôn.".
  - **Đo lại so với `aa1d257`:**
    - Ghi chú thật, seed, chuỗi test của bản `main` và của `aa1d257`: 0 ghi chú đổi.
    - Ghép đôi 571 câu của file test `aa1d257` (324 900 ghi chú): 868 ghi chú đổi, **tất cả chỉ bớt đề xuất**. Mọi trường hợp đều do câu sau là một trong 8 câu có cụm bị chữ kết thúc (vd "KH đã kết hôn, em gái đã ly hôn.", "KH có 2 con, bố mẹ đã mất."), nên giá trị của câu trước không còn được đề xuất.
- **NIT `phase-5-ai.md:379`: đã sửa.** Ví dụ "KH vừa ly hôn" chuyển sang ý chữ đệm.
- **NIT `mock-extraction.ts:44`: đã sửa.** Chú thích của `KH_SUBJECT` thêm "Nay" (`NOW`).
- **Mùi code Duplicated Code: đã sửa.**
  - `otherDeaths` đọc vế qua reader `clause`, bỏ `CLAUSE_MARKS`.
  - `endedBy` của số con dựng từ `DIED`.
  - `endedBy` của "đã kết hôn" dựng từ `DIVORCE` / `SEPARATION` / `DIED` / `WIDOWED`, dùng chung với các khuôn Hôn nhân.
- **Mùi code Refused Bequest: đã sửa.**
  - Lượt đọc của `otherDeaths` chỉ còn `at`, `ofChildren`, `field`, không còn `before` / `after` / `quote` / `value` giả.
  - Vòng chính coi lượt đọc không có cụm (`Said`, khác `Phrase`) và cụm bị chữ kết thúc là giá trị không phải câu kể đơn.
- **Correctness 2 (luật ":"): đã sửa phần giờ; phần danh sách Owner chấp nhận.**
  - Đã sửa: dấu ":" giữa hai chữ số (giờ) không tính. "… lúc 9:30.", "… lúc 10:00 thứ Hai." ra như `main`, có test.
  - Lớp danh sách sau ":": "KH đã kết hôn và có 2 con nhỏ: một trai, một gái." ra 0, trong khi `main` ra Đã kết hôn.
    - Đổi theo hướng an toàn; không có trên seed hay dữ liệu thật.
    - Đã ghi vào §10, có test ghim.
    - **Owner chấp nhận ngày 01/11/2026** (trả lời "Chấp nhận" trong phiên sửa): giữ như head, không là mục chặn.
- **Correctness 3 (mang KH qua ".\n", dấu đầu dòng): để lại.**
  - Đã ghi giới hạn vào §10 (ý "vế không tự mở bằng KH") theo đúng cách code chạy: KH không được mang qua một khúc không có chữ giữa hai vế (dấu kết câu rồi xuống dòng, hay dòng trống), cũng không sang vế mở bằng dấu đầu dòng.
  - Có test ghim: "KH đã kết hôn.\nĐã ly hôn năm 2020." → 0, "KH đã kết hôn\n\nĐã ly hôn năm 2020." → 0, "- KH đã kết hôn\n- Đã ly hôn năm 2020." → 0. Chỉ xuống một dòng, không có dấu kết câu, thì KH vẫn được mang sang ("KH đã kết hôn\nĐã ly hôn năm 2020." → Ly hôn).
  - Lý do để lại: sửa sẽ mở thêm đề xuất trên ghi chú nhiều dòng, tức một lớp mới phải review lại. Giới hạn này theo hướng an toàn: trường bị bỏ, không ra giá trị sai. Sẽ ghi vào sổ ở PR sổ sau khi merge.
- **Correctness 4 ("2 bé nhỏ"): đã sửa.**
  - "bé nhỏ / xíu / tí / hơn / nhất" đứng ngay sau một số đếm (chữ số, số bằng chữ, "các / những / mấy / vài") là đứa trẻ, không phải nghĩa "nhỏ".
  - "KH có 2 bé nhỏ, đã kết hôn." → chỉ Số con 2. "KH có hai bé nhỏ, KH đã kết hôn." → 0.
- **Correctness 5 ("li"): đã sửa.**
  - "li hôn / li dị / li thân" được nhận ở cả ba chỗ: hai khuôn và `endedBy`.
  - "KH đã li dị." → Ly hôn.
  - "KH đã kết hôn nhưng đã li dị." → Ly hôn (trước ra Đã kết hôn, sai).
  - "KH đã kết hôn, em gái đã li hôn." → 0.

Ba điểm "Owner nên biết" của review (lớp mới của luật 1, ngoại lệ của `endedBy`, luật ":") giữ nguyên như mô tả dưới.

#### Thay đổi

- `packages/ai/src/mock-extraction.ts`
  - **Luật 1.** Mỗi trường lấy giá trị cuối cùng nói về KH. Là câu kể đơn thì đề xuất, trích cụm cuối, mỗi trường một đề xuất. Không thì bỏ trường. Luật này thay luật hai giá trị.
    - Vế mở câu được mang KH sang khi câu trước kết thúc bằng một câu kể đơn về KH ("câu không chủ ngữ").
    - "Nay KH" mở vế như "Hiện KH".
  - **Luật 2.**
    - "Ly hôn" từ "ly hôn", "ly dị"; "Góa" từ "góa" / "goá", có thể kèm "vợ / chồng". Cả hai đứng một mình được.
    - "Ly thân", và "Góa" từ "vợ / chồng đã mất / (đã) qua đời", chỉ khi giá trị gần nhất về KH của Hôn nhân trước cụm là câu kể đơn "Đã kết hôn" (Owner 01/11: ở đâu trước cũng được).
  - **Luật 3.**
    - "<k> con / bé đã mất / qua đời" (k bằng số hay chữ) trừ k khỏi số con nêu trước; "đều đã mất" trừ hết. Trích dẫn là chính cụm đó (Owner 01/11).
    - Cụm con mất không coi "con / bé" của số con nêu trước nó trong câu là người khác.
    - Dạng khác (vế có "con / bé" và "mất / qua đời") là một giá trị Số con không phải câu kể đơn, nên bỏ đề xuất Số con.
  - **Luật 4.** "bé" vào luật người khác như "con". Không tính "bé" nghĩa nhỏ: "nhỏ bé", "bé nhỏ / xíu / tí / hơn / nhất", trừ khi đứng ngay sau một số đếm ("2 bé nhỏ").
  - "ly" viết "li" cũng nhận ("li dị", "li hôn", "li thân").
  - **Chữ kết thúc trong câu (`endedBy`)**: cụm trước nó là giá trị nói về KH không phải câu kể đơn, nên trường đó không được đề xuất. Ngoại lệ: chữ đó nằm trong một cụm mới mà cụm ấy nói về KH. Khác với comment #931 (ghi "một phần của cụm mới"): code đòi thêm điều kiện cụm nói về KH. Nhờ vậy mấy câu sau giữ kết quả 0 như hiện nay, thay vì ra Đã kết hôn / Số con 2:
    - "KH đã kết hôn, em gái đã ly hôn.";
    - "KH đã kết hôn, có 2 con nhưng vợ đã mất." (vợ có thể là vợ của con);
    - "KH có 2 con nhưng vợ đã mất.";
    - "KH đã kết hôn, không ly hôn.";
    - "KH đã kết hôn năm 2010, muốn ly hôn.".
  - **Dấu ":" sau cụm trong vế** làm cụm thành tiêu đề, không đề xuất. Không tính dấu ":" giữa hai chữ số (giờ). Luật này thêm vì khi KH được mang qua dấu chấm, "KH đã kết hôn, có 2 con. Độc thân và có 2 con: KH chưa xác nhận." ra Độc thân. Trước PR, câu sau không mở bằng KH nên không ra gì.
  - **Cấu trúc.**
    - `aboutTheKh` tách thành `saysOfTheKh` (luật cũ: người khác, phủ định, hỏi, đoán…) và `simpleStatement` (câu kể đơn).
    - Lượt đầu chỉ chạy `saysOfTheKh`, để biết cụm nào nói về KH (dùng cho ngoại lệ của `endedBy` ở trên). Lượt chính dùng lại kết quả đó, không đọc lại câu.
    - `otherDeaths` chỉ đọc vế có chữ "mất / qua đời", qua reader `clause`.
  - Các khuôn mới dùng một dấu cách giữa các chữ (như "kết hôn", "ly hôn"). Dùng `\s+` thì trích dẫn có thể chứa cả dãy dấu cách dài, vượt giới hạn 1 000 ký tự của V1, làm hỏng cả câu trả lời.
- `packages/ai/src/mock-extraction.test.ts`
  - Đổi tên nhóm thành `Mock extraction` (mục sổ L45).
  - Thêm bốn bảng theo luật, mỗi bảng gồm ca chấp nhận của Issue và ca biên.
  - Thêm 10 ca 36 000 ký tự cho khuôn mới.
  - Ghim ba câu ACCEPTED ("Hình như vậy.", "Phải không?", "Điều đó không có thật.").
- `docs/design/phase-5-ai.md` §10:
  - viết lại theo bốn luật, ghi theo quyết định ở #931 (đổi luật hai giá trị và chữ kết thúc cụm của quyết định 31/10);
  - ba chỗ của NIT #917: "người khác mà Mock nhận ra (chữ chỉ người…)", danh sách đóng đủ của `RETRACTED`, "một tiểu từ";
  - mọi câu ví dụ trong §10 đã chạy qua Mock, kết quả khớp chữ.

##### Ca có sẵn đổi kết quả

So Mock của `main` (`291fbd4`) với head, trên mọi chuỗi của file test bản `main`: 595 câu khác nhau, **14 câu đổi**, tất cả 0 → có đề xuất. Cộng một ca lặp.

| # | Câu | Trước → Sau | Luật |
|---|---|---|---|
| 1 | KH độc thân, nay đã kết hôn. | 0 → Đã kết hôn | 1 |
| 2 | KH độc thân, KH đã kết hôn. | 0 → Đã kết hôn | 1 |
| 3 | KH độc thân. Nay KH đã kết hôn. | 0 → Đã kết hôn | 1 |
| 4 | KH độc thân. Hiện KH đã kết hôn. | 0 → Đã kết hôn | 1 |
| 5 | KH đã kết hôn nhưng đã ly hôn năm 2020. (cả bản sau `LONG`) | 0 → Ly hôn | 2 |
| 6 | KH đã kết hôn năm 2010, ly hôn năm 2020. | 0 → Ly hôn | 2 |
| 7 | KH đã kết hôn năm 2010 nhưng đã ly dị. | 0 → Ly hôn ("ly dị") | 2 |
| 8 | KH đã kết hôn, đã ly dị năm 2020. | 0 → Ly hôn ("ly dị") | 2 |
| 9 | KH đã kết hôn nhưng đang ly thân. | 0 → Ly thân | 2 |
| 10 | KH đã kết hôn nhưng vợ đã mất. | 0 → Góa ("vợ đã mất") | 2 |
| 11 | KH đã kết hôn nhưng chồng qua đời năm 2020. | 0 → Góa ("chồng qua đời") | 2 |
| 12 | KH đã kết hôn, nay góa vợ. | 0 → Góa ("góa vợ") | 2 |
| 13 | KH có 2 con nhưng đều đã mất. | 0 → Số con 0 ("đều đã mất") | 3 |
| 14 | "KH độc thân. " lặp 25 lần | 20 đề xuất → 1 | 1 (mỗi trường một đề xuất) |

Câu 5 có hai bản (thường và sau `LONG`), nên 14 câu khác nhau cho 13 dòng chữ; dòng 14 là ca lặp.

Ba ca DR6-121 cũ chuyển sang bảng luật 2 (nay ra Ly hôn). Chỗ cũ của chúng thay bằng câu vẫn ra 0 qua `endedBy`, để test vẫn kiểm vị trí của chữ kết thúc trong câu sau: "KH đã kết hôn nhưng sắp ly hôn.", "KH đã kết hôn năm 2010, vợ cũ đã mất.", và bản sau `LONG`.

**Lớp mới (luật 1), không chặn nhưng cần biết:** luật người khác vẫn chỉ xét trong câu. Vì vậy:
- "KH có 2 con. Đã kết hôn." ra Số con 2 và Đã kết hôn, còn "KH có 2 con, đã kết hôn." chỉ ra Số con (DR6-19);
- tương tự "KH có 2 con. Độc thân.";
- đúng chữ luật 1 và ví dụ Owner duyệt ("KH đã kết hôn, có 2 con. Vợ đã mất." → Góa, Số con 2). Có test ghim.

Ghép đôi 499 câu kết thúc bằng dấu câu của file test `main` (249 001 ghi chú hai câu): mọi đề xuất head thêm đều là giá trị một trong hai câu tự ra ở head, hoặc là giá trị cuối theo luật 1. Riêng lớp "Độc thân và có 2 con: KH chưa xác nhận." (82 cặp) đã chặn bằng luật ":" ở trên.

##### Số đề xuất trên ghi chú thật

Cách đo như review #917: Mock của `main` và của head chạy trong cùng tiến trình, trích dẫn kiểm như V7. Dữ liệu là hợp các ghi chú RE khác nhau: dữ liệu tải `load-2026-10-12-seed6.p2cbackup` cộng seed ở 3 ngày neo (29/10/2026, 28/02/2026, 31/12/2027).

`real RE notes 3551 distinct; proposals base 1332 → head 1972; differ 640; head adds 640`
- Cả 640 ghi chú đổi đều chỉ thêm đúng một đề xuất Hôn nhân: **Ly hôn**, trích "Ly hôn", từ dòng "Hôn nhân: Ly hôn". Không đề xuất nào khác đổi.
- Riêng seed (3 ngày neo): 1 799 ghi chú khác nhau, 660 → 990 đề xuất (+330, đúng 330 ghi chú có dòng "Hôn nhân: Ly hôn").

##### Cỡ

`git diff main --numstat` (dòng thêm + dòng xóa), sau vòng sửa:
- code sản phẩm `mock-extraction.ts`: 441 (328 + 113), quá ~400 một chút, trong khoảng ~400–550 của Issue;
- test: 232;
- spec: 17;
- tổng: **690**, dưới ~800.

##### Hiệu năng

Chạy riêng bằng Node, lấy lần nhanh nhất:
- trên các ghi chú 36 000 ký tự có sẵn, head chậm hơn `main` 1,2–1,7 lần, lâu nhất 7,5 ms (ca `"đã kết hôn, "`);
- mỗi câu hay vế có cụm tốn vài micro giây, như trước PR: `main` cũng mất 8 ms cho "KH độc thân. " lặp 2 770 lần;
- vì vậy ca mới dùng cụm dài để số cụm ngang các ca cũ, lâu nhất khoảng 6 ms.

#### Test chấp nhận

- [x] Luật 1: "KH độc thân. Nay KH đã kết hôn.", "KH độc thân, nay đã kết hôn." → Đã kết hôn; "KH có 2 con. Thực ra chỉ 1 con.", "KH có 2 con. Anh Nam có 3 con." → không đề xuất Số con.
- [x] Luật 2: "KH đã kết hôn. Đã ly hôn năm 2020." → Ly hôn; "ly dị" ở câu sau → Ly hôn ("KH đã kết hôn, có 2 con. Đã ly dị năm 2021."); "KH đã kết hôn. Vợ đã mất năm 2020.", "KH đã kết hôn nhưng vợ đã mất." → Góa; "KH đã kết hôn nhưng đang ly thân." → Ly thân.
- [x] Luật 3: "KH có 2 con. Một con đã mất." → 1; "KH có 2 con nhưng đều đã mất." → 0; "con út đã mất", "mất một con" sau "KH có 2 con" (cùng câu và câu sau) → không đề xuất Số con.
- [x] Luật 4: "KH có 2 bé đã lớn, độc thân." → chỉ Số con 2; "nhỏ bé", "bé nhỏ", "bé xíu", "bé tí", "bé hơn", "bé nhất" không tính là con.
- [x] Mọi ca có sẵn khác giữ kết quả; ca đổi liệt kê ở bảng trên.
- [x] Thân PR ghi số đề xuất đổi trên seed: dòng "Hôn nhân: Ly hôn" nay ra Ly hôn (seed +330; cả dữ liệu thật +640, chỉ dòng này).
- [x] §10 tả bốn luật và ba chỗ chữ của NIT, khớp code; các mục khác của spec không đổi (diff spec chỉ ở §10).
- [x] e2e có đề xuất của Mock trích xuất xanh, không ca nào đổi kỳ vọng: `pnpm e2e` bốn spec `customer-ai`, `customer-kyc`, `customer-ai-web`, `appointment-outcome` → 64 passed. Sau vòng sửa chạy lại `customer-ai`, `customer-kyc`, `appointment-outcome`, `customer-appointments` (60 passed) và `customer-ai-web` (11 passed).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `291fbd4`):

- L21 `packages/ai/src/mock-extraction.ts` [T-330] Correctness 1 của review #917: **đã sửa**, bốn luật như trên.
- L22 `docs/design/phase-5-ai.md` [T-330] NIT §10 nói rộng hơn code ở ba chỗ: **đã sửa**, §10 viết lại; code giữ ba hành vi đó, có test ("KH đã kết hôn, Lan độc thân." → 0, "KH đã kết hôn rồi ạ." → 0, `RETRACTED` liệt kê đủ).
- L45 `packages/ai/src/mock-extraction.test.ts` [T-330] `describe('createMockAdapter', …)`: **đã sửa**, nay `describe('Mock extraction', …)`.
- L17 `docs/design/phase-5-ai.md` [T-334] NIT §7.3 luật 2 ("100 code unit"): **để lại**, thuộc T-334 (#935); Issue này chỉ cho sửa §10.
- Ngoài danh sách khớp file: mục [G7] `packages/ai/CLAUDE.md:19` ("File hay tìm") để lại. Issue chỉ cho sửa khối codemap của file này, và export không đổi nên khối codemap cũng không đổi.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local sau vòng sửa (`packages/ai` 100%)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low` (diff sửa `packages/ai/**` nên review lên mức high; Owner merge)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-330 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #917, #937 — T-330 (#931, PR #939, `REVIEW: PASS` @`00e6e76`):
  - #917, `packages/ai/src/mock-extraction.ts` (Correctness 1, Mock trích xuất): bốn luật Owner 31/10 – 01/11; chỗ luật chưa nói rõ theo bốn quyết định Owner 01/11 trên #931. Mỗi trường lấy giá trị cuối cùng nói về KH, là câu kể đơn thì đề xuất, thay luật hai giá trị; vế mở câu được mang KH sang khi câu trước kết thúc bằng câu kể đơn về KH; "Nay KH" mở vế như "Hiện KH". "Ly hôn" ("ly hôn", "ly dị") và "Góa" ("góa" / "goá", có thể kèm "vợ / chồng") đứng một mình; "Ly thân", và "Góa" từ "vợ / chồng đã mất / qua đời", chỉ khi giá trị gần nhất về KH của Hôn nhân là câu kể đơn "Đã kết hôn"; "li" cũng nhận. "<k> con / bé đã mất / qua đời" trừ k khỏi số con nêu trước, "đều đã mất" về 0, dạng khác của con mất bỏ Số con. "bé" vào `PEOPLE`, trừ "bé" nghĩa nhỏ ("nhỏ bé", "bé nhỏ / xíu / tí / hơn / nhất") khi không đứng ngay sau một số đếm. Cụm bị chữ kết thúc (`endedBy`) là giá trị nói về KH không phải câu kể đơn (Correctness 1 của vòng @`aa1d257`); dấu ":" sau cụm trong vế làm cụm thành tiêu đề, trừ ":" giữa hai chữ số. Ca có sẵn đổi kết quả liệt kê ở thân PR #939 (14 câu, cộng ca lặp; review #939 chạy lại: khớp); trên ghi chú dạng seed chỉ dòng "Hôn nhân: Ly hôn" đổi (∅ → Ly hôn). Test: bốn bảng theo luật ở `packages/ai/src/mock-extraction.test.ts`.
  - #917 NIT, `docs/design/phase-5-ai.md` (§10): viết lại theo bốn luật, gộp ba chỗ chữ: "người khác mà Mock nhận ra (chữ chỉ người…)", danh sách đóng đủ của `RETRACTED`, "một tiểu từ". Code giữ ba hành vi đó, có test ("KH đã kết hôn, Lan độc thân." → ∅, "KH đã kết hôn rồi ạ." → ∅).
  - #937, `packages/ai/src/mock-extraction.test.ts`: nhóm test trích xuất đổi tên thành `describe('Mock extraction', …)`.

---

# Issue #932 — T-331: Mục sổ G7: tên dài — DataTable an toàn trong khung cuộn, hàng tiêu đề thẻ team, mũi tên cạnh tên nhiều dòng, e2e phụ đề

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Sửa bốn mục sổ OPEN của review #922, tiếp phần tên liền dài của L4-G. Với tên thường, giao diện không đổi.

1. **`DataTable` an toàn trong mọi khung cuộn.** Ô tiêu đề ẩn (cột `headerHidden`) là span `sr-only`, tức `position: absolute`, nằm trong một `th` không định vị, nên khối chứa của span là khối gốc. Khi một khung cuộn không định vị bọc bảng, span nằm ngoài vùng cuộn của khung, và trang cuộn ngang khi bảng rộng hơn khung.
   - PR #922 sửa ở chỗ gọi: thêm `relative` cho khung cuộn của màn Team.
   - Đặt `relative` ở `th` chứa span `sr-only`, để `DataTable` an toàn trong mọi khung cuộn; rồi bỏ `relative` ở khung cuộn của Team.
2. **Tên TL liền dài ở hàng tiêu đề thẻ team.** Tên TL không co, không ngắt, nên vẫn đẩy "Đổi tên team" / "Xóa team" ra ngoài thẻ ở 1 100 px.
   - Thân PR #922 đã thử hai cách và đều hỏng: `min-w-0 wrap-anywhere` làm tên TL thường bị bóp, ngắt từng chữ khi tên team dài; `max-w-60 wrap-break-word` để hàng vẫn tràn 15 px và tiêu đề team co về 0.
   - Đổi bố cục hàng (vd. `flex-wrap`, hay gom hai nút) để tên dài xuống dòng mà hai nút ở trong thẻ.
   - Chọn cách để tên thường hiện như nay. Cách nào đổi hình của tên thường so với mockup là việc G3: hỏi Owner trước.
3. **Mũi tên và số đếm cạnh tên nhiều dòng (NIT).** Nút tên team của So sánh team và nút team của danh sách Team dùng `items-center`, nên khi tên liền dài xuống nhiều dòng, mũi tên ▸ / ▾ và số đếm nằm ngang giữa khối tên, không cạnh dòng đầu. Đổi sang `items-baseline` (hay `items-start`) để giữ chúng ở dòng đầu; tên một dòng không đổi.
4. **e2e phụ đề hộp thoại (NIT).** Ca "a customer name of 81 letters breaks inside the title of its dialogs" chỉ đo tiêu đề. `wrap-anywhere` của khối tiêu đề `Dialog` phủ cả phụ đề, nhưng không e2e nào giữ điều đó. Thêm một lượt đo phụ đề, vd. ở một hộp lịch hẹn của KH tên 81 chữ.

##### Bối cảnh

- G7 Phase 6. Owner 01/11 duyệt gom 27 mục [G7] thành sáu Issue T-329…T-334 (Owner 23/10: sửa hết trước v1.0).
- Mục 1–3 đổi hình màn Team và So sánh team khi tên dài. Lần chụp lại ảnh hướng dẫn của G7 (sau các Issue code) xem lại các ảnh có hai màn này.
- Màn Team theo `phase-3-feedback.html` B1 ("Lệch mockup đã biết" của tài liệu nghiệm thu).

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: nhóm review PR #922, bốn mục [T-331]
- `packages/ui/src/components/DataTable.tsx` (cột `headerHidden`, ô `sr-only`)
- `apps/desktop/src/routes/team/TeamScreen.tsx` (khung cuộn có `relative`, hàng tiêu đề thẻ team, nút team của danh sách)
- `apps/desktop/src/routes/overview/TeamCompare.tsx` (nút tên team)
- `packages/ui/src/components/Dialog.tsx` (khối tiêu đề `wrap-anywhere`)
- `e2e/long-names.spec.ts`; `apps/desktop/src/ui-choices.test.tsx` (mẫu test markup của component `@p2c/ui`)
- Mockup `docs/design/mockups/phase-3-feedback.html` B1 (thẻ team), `docs/design/mockups/overview.html` (So sánh team)
- Comment review của PR #922; thân PR #922 (hai cách đã thử cho tên TL)

##### File / thư mục được phép sửa

- `packages/ui/src/components/DataTable.tsx`
- `apps/desktop/src/ui-datatable.test.tsx` (mới, nếu kiểm bằng test markup)
- `apps/desktop/src/routes/team/TeamScreen.tsx`
- `apps/desktop/src/routes/overview/TeamCompare.tsx`
- `e2e/long-names.spec.ts`

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với các đường dẫn trên (sổ @ `343cd6f`; nhãn theo PR sổ gắn lại nhãn ngày 01/11):

- **Gộp** bốn mục [T-331] của review #922: `sr-only` của `DataTable` trong khung cuộn, tên TL ở hàng tiêu đề thẻ team, mũi tên / số đếm cạnh tên nhiều dòng, e2e phụ đề.
- Không có mục nào để lại.

##### Interface / hợp đồng

- Props của `DataTable` không đổi.
- Chữ, nhãn và thứ tự nút không đổi.

##### Test chấp nhận

- [ ] `th` chứa span `sr-only` của cột `headerHidden` là khối định vị (`relative`), kiểm bằng test markup hoặc e2e. Khung cuộn của Team không còn `relative`. Màn Team ở 1 100 px với dữ liệu mẫu không cuộn ngang (ca có sẵn của #922 vẫn xanh).
- [ ] e2e: team có TL tên 160 chữ liền, ở 1 100 px: "Đổi tên team" và "Xóa team" nằm trong thẻ của team đó, trang không cuộn ngang.
- [ ] Tên TL thường không bị bóp hay ngắt từng chữ khi tên team dài: ca có sẵn với tên thường giữ nguyên hình.
- [ ] e2e: khi tên team liền dài xuống nhiều dòng, mũi tên và số đếm ở dòng đầu (đỉnh của chúng cạnh dòng đầu của tên), ở cả So sánh team và danh sách Team.
- [ ] e2e: phụ đề của một hộp thoại mang tên KH 81 chữ liền ngắt trong hộp, đo như ca tiêu đề có sẵn.

Ước lượng: ~120 dòng tổng diff (code sản phẩm ~20, e2e và test ~100).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #941 — fix(ui): long team and TL names wrap the Team card head, hidden table headings stay in scroll boxes (T-331)

Trạng thái: MERGED · merge 2026-11-01T16:28:32Z · commit `023cf3bf1583defb4867e92e3edc51e90689c367` · nhánh `task/T-331-long-names-team` · nhãn: risk:low

Closes #932

#### Thay đổi

Bốn mục sổ OPEN [T-331] của review #922, tiếp phần tên liền dài của L4-G (DR6-148). Chỉ class và một `div` gom hai nút; props của `DataTable`, chữ, nhãn và thứ tự nút không đổi.

1. **`DataTable` an toàn trong mọi khung cuộn** (`DataTable.tsx`): `th` chứa span `sr-only` của cột `headerHidden` có `relative`, nên span (định vị tuyệt đối) nằm trong khung cuộn quanh bảng thay vì kéo rộng trang. Chỉ ô tiêu đề ẩn có thêm class; các ô tiêu đề khác giữ nguyên. Khung cuộn của bảng thành viên ở màn Team bỏ `relative` (và bỏ câu comment về nó).
2. **Hàng tiêu đề thẻ team** (`TeamScreen.tsx`): thêm `flex-wrap`, đúng `.members-head` của mockup `phase-3-feedback.html` B1 (`flex-wrap: wrap`, dòng 189), nên không phải lệch G3.
   - Tên TL `min-w-0 wrap-anywhere`.
   - "Đổi tên team" / "Xóa team" gom vào một `div` `ml-auto flex gap-2`, thay `div` `flex-1`: hai nút đi cùng nhau, ở bên phải dòng cuối (mockup: "Nút Đổi tên team / Xóa team giữ bên phải").
   - Khi xuống dòng, flex xếp dòng theo bề rộng tự nhiên trước khi co. Tên team hay tên TL quá dài cho dòng thì có dòng riêng rồi ngắt ở đó; tên kia không bị bóp. Đây là chỗ hai cách đã thử ở PR #922 hỏng (không xuống dòng thì tên dài và tên TL cùng co theo tỉ lệ, tên TL thường còn ~35 px).
   - Hình khi tên dài: tên team dài nay chiếm dòng đầu một mình, không co cạnh tên TL như trước. Khi cả tên team lẫn tên TL cùng liền dài, dấu "·" giữa hai tên đứng một mình một dòng: đúng cách `flex-wrap` của mockup cư xử, chỉ xảy ra với hai tên bất thường.
3. **Mũi tên / số đếm cạnh dòng đầu** (`TeamCompare.tsx`, nút team của `TeamScreen.tsx`): `items-center` → `items-baseline`. Đo trên Edge, tên một dòng: vị trí mũi tên trùng nhau ở cả `items-center`, `items-baseline`, `items-start` (cùng hộp 18,75 px).
4. **e2e phụ đề** (`e2e/long-names.spec.ts`): KH tên 81 chữ liền, lịch hẹn 16/9. Phụ đề của Ghi kết quả, Dời lịch và Xóa (`{customer} · …`) không tràn, cả phụ đề lẫn hộp, ở 1 100 và 1 440.

#### Test chấp nhận

- [x] `th` chứa span `sr-only` của cột `headerHidden` có `relative`: test markup `apps/desktop/src/ui-datatable.test.tsx` (đỏ trước khi sửa). Khung cuộn của Team không còn `relative`. Bỏ `relative` ở Team trước khi sửa `DataTable`: ca có sẵn "a team and an IS of 160 letters…" đỏ ("page at 1100"); sau khi sửa `DataTable` thì xanh.
- [x] e2e "a TL of 160 letters keeps Đổi tên team and Xóa team in the card of the team":
  - TL của Bình Minh tên 160 chữ liền, ở 1 100 / 1 440: trang và `main` không cuộn ngang, thẻ không tràn, hai nút nằm trong thẻ;
  - đỏ trước khi sửa;
  - đột biến bỏ `min-w-0 wrap-anywhere` của tên TL: đỏ ("page at 1100").
- [x] Tên TL thường không bị bóp:
  - ca có sẵn (team 160 chữ) thêm kiểm "Lý Gia Trang" chỉ một dòng (`Range.getClientRects`);
  - đột biến bỏ `flex-wrap` (cách thứ nhất của PR #922): đỏ, tên TL thành 6 dòng.
- [x] Mũi tên và số đếm ở dòng đầu:
  - tên ≥ 2 dòng, và đỉnh của mũi tên ▾ (So sánh team) / số đếm (danh sách Team) cách đỉnh dòng đầu của tên ≤ 3 px;
  - đỏ với `items-center`: mũi tên lệch 64,6 px, số đếm 74 px.
- [x] e2e "a customer name of 81 letters breaks inside the subtitle of the dialogs of its appointment". Đột biến dời `wrap-anywhere` từ khối tiêu đề sang riêng `h2` của `Dialog.tsx`: ca mới đỏ ("subtitle of Ghi kết quả at 1100"), ca tiêu đề vẫn xanh; đã hoàn tác.
- [x] Tên thường không đổi hình. Chụp 12 trạng thái với dữ liệu mẫu, ở 1 100 và 1 440, trước và sau khi sửa: ảnh PNG trùng từng byte.
  - Màn Team: 3 team.
  - So sánh team: đóng và mở hết.
  - Bảng Lịch hẹn của hồ sơ KH: `DataTable` có cột tiêu đề ẩn.

  Hai lần chụp trước khi sửa cũng trùng từng byte. Spec chụp chỉ dùng tạm, không commit.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff`, Trùng file (4):

- L27 `DataTable.tsx` (`sr-only` trong khung cuộn): đã sửa (mục 1).
- L28 `TeamScreen.tsx:309` (tên TL ở hàng tiêu đề thẻ team): đã sửa (mục 2).
- L29 NIT `TeamCompare.tsx:86` / `TeamScreen.tsx:172` (mũi tên / số đếm): đã sửa (mục 3).
- L30 NIT `e2e/long-names.spec.ts` (phụ đề): đã sửa (mục 4).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (4 314 unit test); `pnpm e2e` xanh (323 ca)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Cỡ diff: 176 dòng (code sản phẩm ~38; test ~138).

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-331 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #922 — T-331 (#932, PR #941, `REVIEW: PASS` @`b6f8931`):
  - #922, `packages/ui/src/components/DataTable.tsx` (cột `headerHidden`): `th` chứa span `sr-only` có `relative`, chỉ ô tiêu đề ẩn; test markup ở `apps/desktop/src/ui-datatable.test.tsx`. Khung cuộn của bảng thành viên ở `apps/desktop/src/routes/team/TeamScreen.tsx` bỏ `relative`. Thân PR #941: bỏ `relative` ở Team trước khi sửa `DataTable` thì ca e2e có sẵn (team 160 chữ) đỏ ở 1 100, sửa xong thì xanh. Bảng Lịch hẹn của hồ sơ KH và bảng Thùng rác không có khung cuộn, header sticky hay class định vị qua `width`, nên ở đó `relative` không đổi hành vi (review #941).
  - #922, `apps/desktop/src/routes/team/TeamScreen.tsx` (hàng tiêu đề thẻ team): `flex-wrap` như `.members-head` của `docs/design/mockups/phase-3-feedback.html` B1. Tên TL có `min-w-0 wrap-anywhere`; "Đổi tên team" / "Xóa team" gom một `div` `ml-auto`, ở bên phải dòng cuối. Tên quá dài cho dòng thì có dòng riêng rồi ngắt ở đó, không bóp tên kia. Ca e2e TL 160 chữ ở `e2e/long-names.spec.ts`; ca team 160 chữ thêm kiểm tên TL thường một dòng. Thân PR #941: tên thường chụp trước / sau trùng byte, nên không lệch G3.
  - #922 NIT, `apps/desktop/src/routes/overview/TeamCompare.tsx` và `apps/desktop/src/routes/team/TeamScreen.tsx` (nút tên team của So sánh team, nút team của danh sách): `items-baseline`; e2e đo đỉnh mũi tên ▾ / số đếm cách đỉnh dòng đầu của tên ≤ 3 px (`expectByFirstLine`).
  - #922 NIT, `e2e/long-names.spec.ts`: ca mới đo phụ đề của Ghi kết quả, Dời lịch và Xóa với KH tên 81 chữ liền, ở 1 100 / 1 440. Thân PR #941: dời `wrap-anywhere` từ khối tiêu đề sang riêng `h2` của `packages/ui/src/components/Dialog.tsx` thì ca mới đỏ.

---

# Issue #933 — T-332: Mục sổ G7: ô Giờ chỉ có ký tự vô hình, focus sau hộp nhập backup, khóa i18n chung, gỡ chép ở db và dữ liệu app

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Sửa sáu mục sổ OPEN: review #924 (4 mục), review #907 (1), review #911 (1). Với người dùng, chỉ hai việc thấy được: ô Giờ chỉ có ký tự vô hình đọc như trống, và focus về lại nút "Chọn file…" sau khi hộp nhập backup đóng. Các mục còn lại không đổi hành vi.

1. **Ô Giờ chỉ có ký tự vô hình (review #924, cùng họ DR6-150).** `parseTime` hỏi "trống" bằng `trim()` của JS, mà `trim()` không bỏ U+200B / U+0085 / U+2060. Ô Giờ là ô tùy chọn ("empty means no time"); dán vào đó chỉ ký tự vô hình thì app báo lỗi giờ ngay và chặn lưu, dù ô không hiện gì.
   - Hỏi "trống" bằng `normalizeText`, như `readCaseSize` sau PR #924.
   - Bốn ô đọc qua `parseTime`: 6b, giờ hẹn tiếp của 6c, giờ của lịch ở Sửa kết quả, và 6e. Sửa một chỗ là đủ cả bốn.
2. **Focus sau khi hộp nhập backup đóng (review #924, cùng họ DR6-83).** Nút "Chọn file…" tắt (`disabled`) trong lúc đọc file, nên khi hộp 10a mở thì focus đã rơi về `body`, và `Dialog` lấy `body` làm phần tử mở hộp. Đóng 10a (nhập xong, lỗi, Hủy, Escape) thì focus vẫn ở `body`, Tab bắt đầu lại từ đầu trang. Hộp 10b mở sau khi đọc (file hỏng, bản mới hơn) đi cùng đường.
   - Giữ nút nhận focus lúc đọc: `aria-disabled` thay `disabled`, như `ConfirmButton` của PR #924. Bấm lúc đang đọc thì không làm gì.
3. **Một khóa i18n cho khuôn "<tên> (<mã>)" (review #924, có thể là *Duplicated Code*).** `trash.restoreLabel.coded` chép nguyên văn khuôn của `person.inUseTrashCoded`, tức khuôn của hộp 9b mà Q3 (a) bảo theo. Đổi khuôn 9b mà chỉ sửa một khóa thì tên nút khôi phục và câu của 9b lệch nhau. Dùng một khóa chung, mà `restoreLabel` và `inUseHelp` cùng gọi.
4. **Chú thích ca Dọn sạch của e2e Thùng rác (review #924, NIT).** Ca DR6-151 chen giữa chú thích "TR-11, 11i: while the purge runs the dialog stays…" (hai dòng) và ca Dọn sạch mà nó tả. Chuyển hai dòng đó xuống ngay trên ca "the dialog of a purge that runs stays…".
5. **Điều kiện "đọc lại đúng như lưu" ở một nơi (review #907, có thể là *Duplicated Code*).** `isLabel` chép nguyên điều kiện của `valueOf` ở bước nạp backup: chữ qua `isStorableText` và không bắt đầu bằng U+FEFF. Lần sửa sau mà chỉ sửa một nơi thì lệnh ghi phân tích AI và bước nạp backup lệch nhau, đúng họ lỗi DR6-137. Dùng một hàm chung trong phần helper của `packages/db`, cả hai cùng gọi.
6. **Vòng gọi listener ở một nơi (review #911, có thể là *Duplicated Code*).** Vòng gọi listener có `try` đang chép ở ba store: `AppData.changed`, hàng đợi lưu, và `AiJobs.changed`. Hai bản đầu báo lỗi bằng `console.error`, `AiJobs` báo qua `reportError`. Dùng một hàm chung cạnh ba file (mỗi listener một `try`, nhận cách báo lỗi), cả ba cùng gọi.

##### Bối cảnh

- G7 Phase 6. Owner 01/11 duyệt gom 27 mục [G7] thành sáu Issue T-329…T-334 (Owner 23/10: sửa hết trước v1.0).
- Mục 1 và 2 tiếp đợt sửa lượt 4: L4-H (DR6-150, PR #924) chỉ giao ô Case size và ba ô ngày; DR6-154 (PR #924) đổi nút của hộp đang chạy sang `aria-disabled`.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: nhóm review PR #924 (4 mục), mục `isLabel` của nhóm #907, mục vòng gọi listener của nhóm #911; các mục [T-332]
- `apps/desktop/src/routes/appointments/appointment-form.ts` (`parseTime`, `readCaseSize`), test của nó; `e2e/appointment-outcome.spec.ts` (ca DR6-150)
- `apps/desktop/src/routes/SettingsBackup.tsx` (nút "Chọn file…", `readFile`, `busy`); `apps/desktop/src/routes/ConfirmWordDialog.tsx` (`ConfirmButton`: mẫu `aria-disabled`); `packages/ui/src/components/dialog-focus.ts` (`focusBack`; chỉ đọc); `e2e/dialog-keyboard.spec.ts` (ca 10a)
- `apps/desktop/src/i18n/vi.ts` (`trash.restoreLabel.coded`, `person.inUseTrashCoded`); `apps/desktop/src/routes/trash-view.ts` (`restoreLabel`); `apps/desktop/src/routes/team/team-view.ts` (`inUseHelp`); test của hai file
- `e2e/trash.spec.ts` (chú thích "TR-11, 11i", ca DR6-151, ca Dọn sạch)
- `packages/db/src/common.ts` (`isLabel`), `packages/db/src/backup.ts` (`valueOf`), test của hai file
- `apps/desktop/src/data/app-data.ts` (`changed`), `apps/desktop/src/data/persist-queue.ts` (vòng gọi listener), `apps/desktop/src/data/ai-jobs.ts` (`AiJobs.changed`, `reportError`), test của ba file
- Comment review của PR #924, #907, #911

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/appointments/appointment-form.ts`, `apps/desktop/src/routes/appointments/appointment-form.test.ts`, `e2e/appointment-outcome.spec.ts`
- `apps/desktop/src/routes/SettingsBackup.tsx`, `e2e/dialog-keyboard.spec.ts`
- `apps/desktop/src/i18n/vi.ts`, `apps/desktop/src/routes/trash-view.ts`, `apps/desktop/src/routes/trash-view.test.ts`, `apps/desktop/src/routes/team/team-view.ts`, `apps/desktop/src/routes/team/team-view.test.ts`
- `e2e/trash.spec.ts` (chỉ hai dòng chú thích)
- `packages/db/src/common.ts`, `packages/db/src/common.test.ts`, `packages/db/src/backup.ts`, `packages/db/src/backup.test.ts`
- `apps/desktop/src/data/app-data.ts`, `apps/desktop/src/data/persist-queue.ts`, `apps/desktop/src/data/ai-jobs.ts`, `apps/desktop/src/data/listeners.ts` (mới, tên chọn trong task) và test của nó
- `packages/db/CLAUDE.md`, `apps/desktop/CLAUDE.md` (khối codemap)

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với các đường dẫn trên (sổ @ `343cd6f`; nhãn theo PR sổ gắn lại nhãn ngày 01/11):

- **Gộp** sáu mục [T-332]:
  - review #924: ô Giờ chỉ có ký tự vô hình, focus sau hộp 10a / 10b, khóa "<tên> (<mã>)", chú thích ca Dọn sạch;
  - review #907: điều kiện "đọc lại đúng như lưu";
  - review #911: vòng gọi listener.
- Không có mục nào để lại.

##### Interface / hợp đồng

- `parseTime(text)`: chuỗi mà `normalizeText` đọc là rỗng thì trả `{ ok: true, time: null }`; chuỗi khác đọc như nay.
- Chữ trên màn không đổi: một khóa i18n chung thay hai khóa trùng khuôn.
- `isLabel` và bước nạp backup nhận / từ chối đúng như nay.
- Hàm gọi listener chung: mỗi listener gọi trong một `try`; lỗi đi qua hàm báo lỗi được truyền vào. Ba store giữ cách báo lỗi hiện tại.

##### Test chấp nhận

- [ ] Unit: `parseTime` đọc chuỗi chỉ có U+200B, U+0085, hay U+2060 là không có giờ.
- [ ] e2e: ca DR6-150 có một lượt ô Giờ chỉ có ký tự vô hình (dán vào): lưu được, lịch không có giờ.
- [ ] e2e: sau khi hộp 10a đóng bằng Hủy và bằng Escape, và sau khi hộp 10b đóng bằng Đóng, focus ở nút "Chọn file…".
- [ ] Lúc đang đọc file, bấm "Chọn file…" không mở hộp chọn file lần nữa.
- [ ] Một khóa i18n cho "<tên> (<mã>)", `restoreLabel` và `inUseHelp` cùng dùng; test có sẵn của nút khôi phục và câu 9b xanh, chữ không đổi.
- [ ] Hai dòng chú thích "TR-11, 11i…" nằm ngay trên ca Dọn sạch.
- [ ] `isLabel` và `valueOf` gọi cùng một hàm. Test có sẵn của hai đường xanh; chữ bắt đầu bằng U+FEFF vẫn bị từ chối ở cả hai.
- [ ] Ba store gọi cùng một hàm gọi listener. Unit test của hàm đó: listener ném thì listener sau vẫn được gọi, lỗi đi qua hàm báo lỗi được truyền. Ca listener ném có sẵn của `AiJobs` xanh.
- [ ] Khối codemap của hai `CLAUDE.md` khớp code (`pnpm verify`).

Ước lượng: ~250 dòng tổng diff (code sản phẩm ~80, test và e2e ~170).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #946 — fix(ui): blank time, focus after the backup dialogs, one key for coded names, shared read-back and listener helpers (T-332)

Trạng thái: MERGED · merge 2026-11-02T06:08:41Z · commit `66019cc87cc1dde09360063a19d678b61efa6d2d` · nhánh `task/T-332-time-focus-dedup` · nhãn: risk:low

Closes #933

Phiên code: coding-ses2 (auto-issues)

#### Thay đổi

Sáu mục sổ OPEN [T-332]: review #924 (4 mục), review #907 (1), review #911 (1). Với người dùng chỉ hai việc thấy được (mục 1, 2); bốn mục còn lại không đổi hành vi hay chữ trên màn.

1. **Ô Giờ chỉ có ký tự vô hình đọc là không có giờ** (`appointment-form.ts`, `parseTime`): hỏi "trống" bằng `normalizeText`, như `readCaseSize` sau PR #924; chuỗi khác đọc như cũ (`trim()` rồi khớp `hh:mm`). Bốn ô đọc qua `parseTime` (6b, giờ hẹn tiếp của 6c, giờ của lịch ở Sửa kết quả, 6e) đều chỉ đọc kết quả của hàm này (`time.ok` / `time.time`), không ô nào tự hỏi "trống" trên chữ gốc, nên sửa một chỗ là đủ cả bốn.
2. **"Chọn file…" giữ focus lúc đọc file** (`SettingsBackup.tsx`): trong lúc đọc, nút tắt bằng `aria-disabled` thay `disabled`, như `ConfirmButton` của PR #924 (cùng class `aria-disabled:cursor-default aria-disabled:opacity-50`, nên vẫn mờ như nút tắt). Bấm lúc đó không làm gì (`onClick` chỉ mở hộp chọn file khi `busy === null`). Focus không rơi về `body`, nên `Dialog` của 10a / 10b lấy nút làm phần tử mở hộp và trả focus về đó khi đóng, đường nào cũng vậy (e2e kiểm Hủy, Escape và nhập xong của 10a, Đóng của 10b; đường nhập lỗi đóng hộp cùng cách nên không có ca riêng). Lúc đang xuất backup, nút vẫn `disabled` như cũ (focus khi đó ở nút "Xuất backup").
3. **Một khóa i18n cho "<tên> (<mã>)"** (`vi.ts`): `customer.withCode` thay `trash.restoreLabel.coded` và `person.inUseTrashCoded`; `restoreLabel` (`trash-view.ts`) và `inUseHelp` (`team-view.ts`) cùng gọi. Chữ không đổi.
4. **Chú thích ca Dọn sạch** (`e2e/trash.spec.ts`): hai dòng "TR-11, 11i…" chuyển xuống ngay trên ca "the dialog of a purge that runs stays…".
5. **"Đọc lại đúng như lưu" ở một nơi** (`packages/db/src/common.ts`): hàm mới `readsBackAsIs(text)` (`isStorableText` và không bắt đầu bằng U+FEFF); `isLabel` và `valueOf` của `backup.ts` cùng gọi. Lý do của từng ký tự (DR-49, DR5-14, DR6-49, DR6-107) chuyển từ doc của `valueOf` sang doc của hàm chung.
6. **Vòng gọi listener ở một nơi** (`apps/desktop/src/data/listeners.ts` mới): `notify(listeners, report)` gọi mỗi listener trong một `try`, lỗi đi qua `report`; duyệt thẳng `Set` của store như ba vòng cũ (không chép ra mảng). `AppData.changed` và hàng đợi lưu truyền `console.error`, `AiJobs` truyền `reportError`, như trước.

Khối codemap của `packages/db/CLAUDE.md` (`readsBackAsIs`) và `apps/desktop/CLAUDE.md` (`listeners.ts`) sinh lại bằng `pnpm codemap`.

#### Test chấp nhận

- [x] Unit `parseTime`: chuỗi chỉ có U+200B, U+0085, U+2060 (và lẫn dấu cách) là không có giờ. Đỏ trước khi sửa (`{ ok: false }`).
- [x] e2e ca DR6-150 (`e2e/appointment-outcome.spec.ts`): đặt lịch 6b với ô Giờ dán chỉ ký tự vô hình → lưu được, tiêu đề chi tiết `15/09/2026 · <tên>` (không giờ). `book` nhận thêm `time` tùy chọn. Đỏ trước khi sửa (hộp 6b không đóng).
- [x] e2e mới "the dialogs of a chosen backup give the focus back to "Chọn file…" (10a, 10b)" (`e2e/dialog-keyboard.spec.ts`), chọn file qua nút và sự kiện `filechooser` (nút có focus như khi người dùng bấm):
  - lượt đầu giữ việc đọc file (`Blob.text` chờ tới khi test thả): nút "Đang đọc file…" giữ focus, tắt (`toBeDisabled`), mờ (opacity 0,5); bấm Enter và click lên nó không mở hộp chọn file nào (đếm `filechooser`: đúng 3 cho 3 lần chọn);
  - 10a đóng bằng Hủy, rồi 10a đóng bằng Escape, rồi 10b (file không phải backup Project-2C) đóng bằng Đóng: focus ở "Chọn file…" sau mỗi lần;
  - đỏ trước khi sửa (focus ở `body` lúc đọc);
  - đột biến bỏ điều kiện `busy === null` của `onClick` (giữ `aria-disabled`): đỏ, 5 hộp chọn file thay vì 3; đã hoàn tác.
  - Ca có sẵn "the dialog of a running import…" thêm kiểm focus ở "Chọn file…" sau khi nhập xong; đỏ trước khi sửa.
- [x] Một khóa i18n cho "<tên> (<mã>)", `restoreLabel` và `inUseHelp` cùng dùng; test có sẵn của nút khôi phục (`trash-view.test.ts`) và câu 9b (`team-view.test.ts`) xanh, chữ không đổi.
- [x] Hai dòng chú thích "TR-11, 11i…" nằm ngay trên ca Dọn sạch.
- [x] `isLabel` và `valueOf` gọi cùng `readsBackAsIs`; unit mới của hàm chung (`common.test.ts`, đỏ trước khi có hàm). Test có sẵn của hai đường xanh: U+FEFF ở đầu vẫn bị từ chối ở cả hai (`analysisLabelsFit` ở `ai-analyses.test.ts`, `importBackup — a text that starts with U+FEFF` ở `backup.test.ts`).
- [x] Ba store gọi cùng `notify`. Unit `listeners.test.ts`: listener ném thì listener sau vẫn được gọi, lỗi đi qua hàm báo lỗi được truyền (đỏ trước khi có module). Ca listener ném có sẵn của `AiJobs`, `AppData` và hàng đợi lưu xanh.
- [x] Khối codemap của hai `CLAUDE.md` khớp code (`pnpm verify`).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff`, Trùng file (6):

- L16 `packages/db/src/common.ts` / `backup.ts` (`isLabel` chép điều kiện "đọc lại đúng như lưu" của `valueOf`): đã sửa (mục 5).
- L19 `app-data.ts` / `persist-queue.ts` / `ai-jobs.ts` (vòng gọi listener chép ở ba store): đã sửa (mục 6).
- L27 NIT `e2e/trash.spec.ts` (chú thích "TR-11, 11i" nằm trên nhầm ca): đã sửa (mục 4).
- L28 `vi.ts` (`trash.restoreLabel.coded` chép khuôn của `person.inUseTrashCoded`): đã sửa (mục 3).
- L29 `appointment-form.ts` (`parseTime`: ô Giờ chỉ có ký tự vô hình báo lỗi): đã sửa (mục 1).
- L30 `SettingsBackup.tsx` (focus ở `body` sau khi hộp 10a / 10b đóng): đã sửa (mục 2).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (4 357 unit test); e2e của năm file chạm tới (`appointment-outcome`, `dialog-keyboard`, `backup`, `trash`, `team`) xanh ở local (80 ca). Bộ e2e đầy đủ chạy ở CI.
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Cỡ diff: 280 dòng (code sản phẩm 127; test và e2e 149; khối codemap sinh tự động 4). Không đụng file cần nhãn `build-exe`.

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-332 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #907, #911, #924 — T-332 (#933, PR #946, `REVIEW: PASS` @`52434dd`):
  - #907, `packages/db/src/common.ts` (`isLabel`, DR6-137): hàm chung `readsBackAsIs(text)` (`isStorableText`, và không bắt đầu bằng U+FEFF); `isLabel` và `valueOf` của `packages/db/src/backup.ts` cùng gọi. Lý do của từng ký tự (DR-49, DR5-14, DR6-49, DR6-107) chuyển từ doc của `valueOf` sang doc của hàm chung. Unit ở `packages/db/src/common.test.ts`; test có sẵn của hai đường (U+FEFF ở đầu bị từ chối ở cả hai) xanh.
  - #911, `apps/desktop/src/data/listeners.ts` (mới): `notify(listeners, report)` gọi mỗi listener trong một `try`, lỗi đi qua `report`. `AppData.changed` (`apps/desktop/src/data/app-data.ts`) và hàng đợi lưu (`apps/desktop/src/data/persist-queue.ts`) truyền `console.error`, `AiJobs` (`apps/desktop/src/data/ai-jobs.ts`) truyền `reportError`, như trước. Unit ở `apps/desktop/src/data/listeners.test.ts`; ca listener ném có sẵn của ba store xanh.
  - #924 NIT, `e2e/trash.spec.ts`: hai dòng chú thích "TR-11, 11i…" chuyển xuống ngay trên ca "the dialog of a purge that runs stays…".
  - #924, `apps/desktop/src/i18n/vi.ts`: một khóa `customer.withCode` thay `trash.restoreLabel.coded` và `person.inUseTrashCoded`; `restoreLabel` (`apps/desktop/src/routes/trash-view.ts`) và `inUseHelp` (`apps/desktop/src/routes/team/team-view.ts`) cùng gọi, chữ không đổi.
  - #924, `apps/desktop/src/routes/appointments/appointment-form.ts` (`parseTime`): hỏi "trống" bằng `normalizeText`, như `readCaseSize`; bốn ô đọc qua hàm này chỉ dùng kết quả của nó. Unit cho U+200B, U+0085, U+2060 (cả khi lẫn dấu cách); ca DR6-150 của `e2e/appointment-outcome.spec.ts` thêm một lượt ô Giờ chỉ có ký tự vô hình: lưu được, tiêu đề chi tiết không có giờ. Giờ có ký tự vô hình dính vào vẫn bị từ chối: ghi chú mới của review #946, ở OPEN.
  - #924, `apps/desktop/src/routes/SettingsBackup.tsx` (nút "Chọn file…"): trong lúc đọc file, nút tắt bằng `aria-disabled` thay `disabled`, như `ConfirmButton`; bấm lúc đó không làm gì. Nút giữ focus, nên hộp 10a / 10b trả focus về đó khi đóng. E2e ở `e2e/dialog-keyboard.spec.ts`: 10a đóng bằng Hủy, Escape và sau khi nhập xong, 10b đóng bằng Đóng; Enter và click lúc đang đọc không mở hộp chọn file nào.

---

# Issue #934 — T-333: Mục sổ G7: công cụ kiểm — bộ chặn ký hiệu (kiểu generic, CRLF) và globMeetsFolder

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Sửa ba mục sổ OPEN ở hai công cụ kiểm: bộ chặn ký hiệu viết tay của `pnpm lint:tokens` (review #920, 2 mục) và `notes-for` (review #926, 1 mục). App không đổi.

1. **`{` sau `>` của kiểu generic bị đọc là JSX (review #920).** `findHardcodedSeparators` tính `{` đứng sau `>` là mở khối JSX, nên thân hàm `(): Promise<void> {` hay thân lớp `extends Foo<Bar> {` bị đọc như JSX. Thử: `function f(): Promise<void> {…}: {` bị báo `}: {`. App hiện không có dạng này (review #920 so với parser TypeScript: 0 khác trên 247 file). Nhưng test chỉ ghim `=>`, còn doc comment và thân PR #920 không nêu giới hạn này.
   - Chọn trong task: sửa để `{` sau `>` của một kiểu không tính là JSX; hoặc ghi giới hạn vào doc comment, cạnh "does not read a regex literal", kèm một ca test ghim hành vi hiện tại. PR ghi lý do chọn.
2. **`\` trước CRLF trong chuỗi (review #920, NIT).** Trong chuỗi, `\` chỉ bỏ qua một ký tự kế. Trước CRLF nó bỏ `\r`, rồi `\n` kết thúc chuỗi, nên phần sau của chuỗi bị đọc như code. Thử: `'one \` + CRLF + `two three'; // N2 → N1` bị báo `→` ở dòng 2. Chỉ xảy ra với file lưu CRLF trên đĩa, vì `.gitattributes` đặt `eol=lf`; tức một lần chạy `pnpm lint:tokens` trên file mới lưu CRLF, trước commit. Khi gặp `\` thì bỏ cả `\r\n`, và vẫn đếm đúng dòng.
3. **`globMeetsFolder` với đoạn glob có `**` lẫn chữ (review #926, NIT).** Một đoạn glob như `b**`, `a**x` đang được xem như `**` đứng riêng, nên hàm cho qua mọi thư mục ở vị trí đó mà không so phần đứng trước `**`.
   - Ví dụ: đích `a/b**/c.ts` với ghi chú thư mục `a/x/` → `true`. Trong khi đó regex của `globRegExp` (`^a/b.*/c\.ts$`) không khớp đường dẫn nào trong thư mục đó; `covers` trước PR #926 trả `false`.
   - Hậu quả chỉ là dư một dòng ở "Trong vùng" của `notes-for`, với dạng glob hiếm gặp.
   - Sửa: chỉ cho qua sớm khi đoạn đúng bằng `**`. Đoạn có `**` lẫn chữ thì so phần trước `**` với đầu tên thư mục rồi mới cho qua.

##### Bối cảnh

- G7 Phase 6. Owner 01/11 duyệt gom 27 mục [G7] thành sáu Issue T-329…T-334 (Owner 23/10: sửa hết trước v1.0).
- Bộ chặn ký hiệu: L4-F (DR6-145, 149; PR #920). Ghi chú thư mục dưới glob: L4-I (DR6-156; PR #926).

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: hai mục `token-guard` của nhóm review PR #920, nhóm review PR #926; các mục [T-333]
- `packages/ui/src/token-guard.ts` (`findHardcodedSeparators`: các mode, ngăn xếp `{`, `last`; doc comment), `packages/ui/src/token-guard.test.ts`, `packages/ui/scripts/check-tokens.ts`
- `tools/notes-core.mjs` (`globMeetsFolder`, `globRegExp`, `covers`), `tools/notes-core.test.mjs`
- Comment review của PR #920 và PR #926

##### File / thư mục được phép sửa

- `packages/ui/src/token-guard.ts`, `packages/ui/src/token-guard.test.ts`
- `tools/notes-core.mjs`, `tools/notes-core.test.mjs`

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với các đường dẫn trên (sổ @ `343cd6f`; nhãn theo PR sổ gắn lại nhãn ngày 01/11):

- **Gộp** ba mục [T-333]: `{` sau kiểu generic và `\` trước CRLF (review #920); `globMeetsFolder` (review #926).
- Không có mục nào để lại.

##### Interface / hợp đồng

- `findHardcodedSeparators(source)` và `globMeetsFolder(glob, folder)` giữ chữ ký.
- Với nguồn LF và glob thường, kết quả như nay.

##### Test chấp nhận

- [ ] `function f(): Promise<void> {…}` và `class A extends Foo<Bar> {…}`: có ca test cho hành vi đã chọn ở mục 1. Nếu không sửa, doc comment nêu giới hạn.
- [ ] Nguồn CRLF `'one \` + CRLF + `two three'; // N2 → N1`: không báo gì. Dòng của các phát hiện sau đó trong cùng nguồn vẫn đúng.
- [ ] `globMeetsFolder('a/b**/c.ts', 'a/x/')` → `false`; `globMeetsFolder('a/b**/c.ts', 'a/bx/')` → `true`; đoạn `**` đứng riêng (`a/**/c.ts` với `a/x/`) → `true` như nay.
- [ ] Mọi test có sẵn của hai công cụ xanh; `pnpm lint:tokens` trên repo không đổi kết quả.

Ước lượng: ~80 dòng tổng diff (code ~25, test ~55).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #965 — fix(tools): type arguments and escaped CRLF in the separator guard, b** glob parts (T-333)

Trạng thái: MERGED · merge 2026-11-02T17:40:58Z · commit `7b6dbd1ed55bc83ac77edd5918b9507b9f6facc0` · nhánh `task/T-333-token-guard-glob-folder` · nhãn: risk:low

Closes #934

#### Thay đổi

1. **`{` sau `>` của danh sách đối số kiểu không còn tính là JSX** (`packages/ui/src/token-guard.ts`, review #920). `findHardcodedSeparators` đếm các danh sách đối số kiểu đang mở: `<` đứng liền sau một tên (`[\w$]`, không cách) mở một danh sách (`Promise<void>`, `Foo<Bar>`, `useState<Row>`, `<List<Row>`); `>` đóng danh sách đó (không phải `>` của `=>`) không đặt `last = '>'`, nên `{` theo sau là code. Comment cạnh `braces` và biến mới nêu cách nhận và giới hạn còn lại.
2. **`\` trước CRLF trong chuỗi bỏ cả `\r\n`** (`packages/ui/src/token-guard.ts`, review #920). Gặp `\` mà hai ký tự sau là `\r\n` thì bỏ qua cả hai, rồi vẫn đếm dòng ở `\n` như cũ.
3. **`globMeetsFolder` với đoạn có `**` lẫn chữ** (`tools/notes-core.mjs`, review #926). Đoạn có `**` không còn cho qua mọi thư mục: tên thư mục phải bắt đầu như phần đứng trước `**` (`globRegExp(<phần trước> + '*')`). Đoạn `**` đứng riêng có phần trước rỗng, nên vẫn cho qua mọi thư mục như nay. Doc comment nói thêm điều này.

Chữ ký `findHardcodedSeparators(source)` và `globMeetsFolder(glob, folder)` giữ nguyên. Cỡ: 66 dòng tổng diff (61 thêm, 5 bớt): code công cụ ~27, test 39.

##### Cách chọn cho mục 1 và lý do

Chọn **sửa**, không chỉ ghi giới hạn:

- Dạng báo nhầm này dễ gặp ở code sau: `run(function (): Promise<void> {…}, { tries: 3 })` hay `[class A extends Foo<Bar> {}, {…}]` bị báo `}, {`. Ghi giới hạn thì người viết code đó phải tự hiểu vì sao `lint:tokens` đỏ.
- Cách nhận rẻ và chắc nhờ Prettier (`pnpm format:check` trong `pnpm verify`): Prettier luôn để cách quanh `<` so sánh (`i < n`), còn đối số kiểu luôn dính tên. Thẻ JSX đứng sau `(`, `return `, `&& `, `>`, `}`…, không dính tên.
- Không reset bộ đếm ở cuối dòng: 16 chỗ trong repo mở danh sách kiểu ở một dòng và đóng ở dòng sau (`useState<{`, `Record<`, `ComposeOption<`…); reset sẽ làm sai các ca đó.
- Giới hạn còn lại (ghi ở comment): một thẻ viết dính một chữ của văn bản JSX (`one<b>`) cũng bị đọc như đối số kiểu. App không có dạng này (mọi chữ UI qua i18n); `git grep '[\w$]<[a-z]'` trên `*.tsx` chỉ ra đối số kiểu (`Promise<void>`, `useState<string>`…) và một comment. `<` dính tên trong regex literal cũng vậy, thuộc giới hạn "does not read a regex literal" đã có.

##### Đo trên repo

Script tạm (scratchpad, không commit) chạy `findHardcodedSeparators` của `main` và của nhánh trên mọi file `.ts/.tsx` đã track:

- 356 file, 1 346 lần báo: **0 khác** giữa `main` và nhánh.
- Bản có đo: 16 dòng còn danh sách kiểu mở ở cuối dòng, cả 16 là danh sách kiểu viết nhiều dòng thật (`packages/db/src/seed-data.ts:227` `Readonly<`, `packages/ui/src/components/Chart.tsx:19` `ComposeOption<`…), không có `<` nào bị đếm nhầm.
- Mỗi file đổi sang CRLF so với LF: 0 khác ở cả `main` lẫn nhánh (repo không có chuỗi nối dòng bằng `\`; ca CRLF do unit test ghim).
- `pnpm lint:tokens` trên repo: cùng kết quả trước và sau ("no styling that bypasses the tokens").

#### Test chấp nhận

- [x] Mục 1 (`function f(): Promise<void> {…}`, `class A extends Foo<Bar> {…}`): ca mới "reads the `{` after the type arguments of a name as code". `run(function (): Promise<void> {}, { tries: 3 })`, `[class A extends Foo<Bar> {}, { b: 2 }]`, `Promise<Map<string, () => void>> {}, {}` (lồng nhau, có `=>` bên trong) không báo gì; `useState<Row>(<b>{a}: {b}</b>)` và `<List<Row> rows={rows}>{a}, {b}</List>` vẫn báo `}: {`, `}, {` (danh sách kiểu đã đóng không nuốt `>` của thẻ). Trước khi sửa: ba dòng đầu bị báo `}, {` (đỏ đúng lý do).
- [x] Nguồn CRLF `'one \` + CRLF + `two three'; // N2 → N1`, rồi `const s = 'a · b';`: chỉ báo `·` ở dòng 3. Trước khi sửa: thêm `→` ở dòng 2 (đỏ đúng lý do).
- [x] `globMeetsFolder` (qua `relatedNotes`, vì hàm không export), ghi chú thư mục `a/x/` (dòng 1) và `a/bx/` (dòng 2): `a/b**/c.ts` → chỉ `a/bx/`; `a/b**x/c.ts` → chỉ `a/bx/`; `a/x**b/c.ts` → chỉ `a/x/`; `a/c**/d.ts` → không thư mục nào; `a/**/c.ts` → cả hai, như nay. Trước khi sửa: `a/b**/c.ts` → cả hai (đỏ đúng lý do).
- [x] Mọi test có sẵn của hai công cụ xanh (`token-guard.test.ts` 27, `notes-core.test.mjs` 31); `pnpm lint:tokens` trên repo không đổi kết quả.

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff` (@ `a6e25fb`):

- L13 `packages/ui/src/token-guard.ts` **[T-333 #934]** `{` đứng sau `>` của một kiểu generic tính là JSX: đã sửa (mục 1, sửa thay vì ghi giới hạn; lý do ở trên).
- L14 `packages/ui/src/token-guard.ts` **[T-333 #934]** NIT `\` trước CRLF trong chuỗi: đã sửa (mục 2).
- L16 `tools/notes-core.mjs`, `tools/notes-core.test.mjs` **[T-333 #934]** NIT `globMeetsFolder` với đoạn có `**` lẫn chữ: đã sửa (mục 3, kèm ca đối chứng).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Không cần nhãn `build-exe` (không chạm Rust, Cargo, `package.json`, lockfile hay cấu hình build).

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-333 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #920, #926 — T-333 (#934, PR #965, `REVIEW: PASS` @`de5331b`):
  - #920, `packages/ui/src/token-guard.ts` (`findHardcodedSeparators`, `{` sau `>` của kiểu generic): sửa thay vì ghi giới hạn. Bộ đếm `types` giữ số danh sách đối số kiểu đang mở, mỗi danh sách mở bằng `<` dính liền một tên (`Promise<void>`; Prettier luôn để cách quanh `<` so sánh); `>` đóng danh sách đó không đặt `last = '>'`, nên `{` theo sau là code. Ca "reads the `{` after the type arguments of a name as code" ở `packages/ui/src/token-guard.test.ts` ghim `Promise<void> {`, `extends Foo<Bar> {`, kiểu lồng có `=>` bên trong, và hai ca JSX vẫn báo (`useState<Row>(<b>…`, `<List<Row> rows={rows}>…`). Review #965 so `main` với head trên 14 ca biên: chỉ khác ở thẻ dính một chữ của văn bản JSX (ghi chú mới ở OPEN) và `<` dính chữ trong regex literal (giới hạn "does not read a regex literal" đã có).
  - #920 NIT, `packages/ui/src/token-guard.ts` (`\` trước CRLF trong chuỗi): gặp `\` mà hai ký tự sau là `\r\n` thì bỏ cả hai, dòng vẫn đếm một lần ở `\n`. Ca CRLF ở `packages/ui/src/token-guard.test.ts` (`'one \` + CRLF + `two three'; // N2 → N1`, rồi `const s = 'a · b';`) chỉ báo `·` ở dòng 3.
  - #926 NIT, `tools/notes-core.mjs` (`globMeetsFolder`): đoạn có `**` chỉ cho qua thư mục có tên bắt đầu như phần đứng trước `**` (`globRegExp(<phần trước> + '*')`); đoạn `**` đứng riêng có phần trước rỗng nên vẫn cho qua mọi thư mục. Ca ở `tools/notes-core.test.mjs` (qua `relatedNotes`, hàm không export): `a/b**/c.ts` → chỉ `a/bx/`, `a/b**x/c.ts` → chỉ `a/bx/`, `a/x**b/c.ts` → chỉ `a/x/`, `a/c**/d.ts` → không thư mục nào, `a/**/c.ts` → cả hai.

---

# Issue #935 — T-334: Mục sổ G7: tài liệu — bản tổng hợp lượt 4, phase-6.md, §7.3, quyết định Owner #917 / #920, mục Ô chọn

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Sửa sáu mục sổ OPEN thuộc về tài liệu: review #895 (2), #907 (1), #917 (1), #920 (1), #928 (1). Chỉ đổi chữ để khớp nguồn, và ghi lại các quyết định Owner đã có. Không đổi luật, số hay quyết định nào.

1. **Ba câu lệch nguồn của bản tổng hợp lượt 4 (review #895, NIT).** Kết luận "không nhiễm" không đổi.
   - §10.1 ("Ghi vào worktree"): câu "`baseline.md` chỉ do phiên thử (theo việc được giao) và Claude ở bước 7 ghi thêm" sai. Bản baseline gốc còn năm phần ghi giữa hai đợt (29/10 tối → 30/10 18:46, trước gói A). Chữ đề xuất: "`baseline.md` do phiên thử, task kiểm expert, Owner và các phiên Claude điều phối ghi thêm giữa hai đợt (tới 30/10 18:46, trước gói A), rồi Claude ở bước 7".
   - §1: "14 có từ trước, lượt 1–3 bỏ sót" không đúng cho DR6-152 (tổng hợp lượt 3 §7.5 đã nêu) và phần (a) của DR6-145 (L·CL-D5 lượt 1). Câu ở §1 nêu hai ngoại lệ đó; dòng 152 của §6, dòng duy nhất chưa ghi "Mới / Trước", ghi "Trước".
   - §8.3: câu về PR Owner phải merge chỉ tính L4-A, L4-C, L4-E. PR của L4-B (sửa phần Rust của app) và L4-D (sửa `packages/ai`) cũng review mức high, nên cũng chờ Owner. Thêm L4-B, L4-D: 5 PR code, cộng PR docs §14 của L4-E.
2. **`phase-6.md`, dòng lượt 4 của "Review đóng phase" (review #895, NIT).** Câu "Kiểm phần đã sửa của hai đợt trên" sai, vì phía trên có ba đợt (lượt 3, sổ OPEN, mục OPEN trước lượt 4) và bảng R2 còn gồm T-305…T-308. Đổi thành "các đợt sửa từ sau lượt 3".
3. **§7.3 luật 2 của spec Phase 5 (review #907, NIT).** Spec ghi `model` "không quá 100 ký tự", còn lệnh và luật nhập 12 đếm code unit UTF-16. Đổi thành "không quá 100 code unit (UTF-16)". Lệch này có từ DR5-16, và không có đường từ màn.
4. **Quyết định Owner của PR #917 / Issue #899 (review #917).** Ghi vào sổ quyết định Owner đủ các ý sổ ghi chú liệt kê, mỗi ý kèm ngày và nguồn:
   - đảo 12 ca (G8); luật A1 / J2 kèm 34 ca; "mục 3 sửa code, không tính vòng"; chấp nhận cỡ diff;
   - bốn quyết định sau review @`46c7674`; "Giữ nguyên" `RETRACTED` xét cả ghi chú;
   - các quyết định 31/10 – 01/11 cho mục Correctness 1 của review #917: giá trị cuối về KH thay luật hai giá trị; ba giá trị Hôn nhân mới; trừ số con đã mất; "bé" như "con"; phần câu sau chỉ đoán / hỏi / bác bỏ ngoài danh sách giữ nguyên (ACCEPTED);
   - ghi rõ các quyết định này đổi một phần hai quyết định 31/10 sau review @`46c7674`: luật hai giá trị, và chữ kết thúc cụm.
5. **Quyết định Owner 01/11 của #901 (review #920).** Test chấp nhận "viền ≥ 3:1" của ô chọn chỉ đo ở ô đang chọn (viền `--accent`, 6,9:1). Ô chưa chọn giữ viền `--border-strong` (1,6:1) như `.choice` của mockup, theo G3 T-284: ô chọn có chữ nên viền không bắt buộc 3:1. Hiện chỉ thân PR #920 ghi quyết định này.
6. **Mục "Ô chọn" của "Lệch mockup đã biết" (review #928, NIT).** Ví dụ "giá trị KYC dài ở 7d" đi cùng vế "mockup giữ một dòng (`white-space: nowrap`)", nhưng mockup 7d không vẽ ô chọn mà vẽ hàng `.radio`, nên ở 7d chữ dài trên mockup cũng xuống dòng. Tách 7d thành một vế riêng (app dùng ô chọn thay hàng `.radio` của mockup), và bỏ 7d khỏi ví dụ của vế `nowrap`.

##### Bối cảnh

- G7 Phase 6. Owner 01/11 duyệt gom 27 mục [G7] thành sáu Issue T-329…T-334 (Owner 23/10: sửa hết trước v1.0).
- Mục 4 ghi quyết định cho T-330 (Mock trích xuất). Hai Issue không chờ nhau.
- T-330 sửa §10 của cùng file spec Phase 5, còn Issue này chỉ sửa §7.3. PR nào merge sau thì `gh pr update-branch` nếu cần.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: nhóm review PR #895; mục §7.3 của nhóm #907; mục quyết định Owner của nhóm #917 và nhóm #920; nhóm review PR #928; các mục [T-334]
- `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` §1, §6 (dòng 152), §8.3, §10.1; `docs/reviews/raw/2026-10-31/common-baseline.md`
- `docs/metrics/phase-6.md`, mục "Review đóng phase" (dòng lượt 4)
- `docs/design/phase-5-ai.md` §7.3 luật 2; `packages/db/src/ai-analyses.ts` (`MAX_MODEL`; chỉ đọc)
- `docs/PROJECT-STATE.md` (mục "Current OWNER decisions": cách ghi)
- Comment quyết định Owner trên Issue #899 và PR #917 (`gh issue view 899 --comments`, `gh pr view 917 --json comments`); thân PR #920 và Issue #901
- `docs/testing/nghiem-thu-v1.md` ("Lệch mockup đã biết", mục "Ô chọn"); mockup `docs/design/mockups/kyc-forms.html` hộp 7d (chỉ đọc)

##### File / thư mục được phép sửa

- `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md`
- `docs/metrics/phase-6.md` (chỉ dòng lượt 4 của "Review đóng phase")
- `docs/design/phase-5-ai.md` (chỉ §7.3)
- `docs/PROJECT-STATE.md`
- `docs/testing/nghiem-thu-v1.md` (chỉ "Lệch mockup đã biết")

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với các đường dẫn trên (sổ @ `343cd6f`; nhãn theo PR sổ gắn lại nhãn ngày 01/11):

- **Gộp** sáu mục [T-334]: hai mục của review #895, §7.3 của #907, hai mục ghi quyết định Owner (#917, #920), "Ô chọn" của #928.
- **Để lại**, thuộc T-330 (khớp vì cùng file spec, khác mục): Correctness 1 của review #917 (luật mới của Mock trích xuất, viết lại §10) và NIT chữ §10.

##### Interface / hợp đồng

Không (tài liệu).

##### Test chấp nhận

- [ ] Ba câu của bản tổng hợp lượt 4 khớp nguồn, theo chữ đề xuất ở sổ hoặc chữ tương đương (PR ghi lý do nếu khác).
- [ ] Dòng lượt 4 của `phase-6.md` ghi "các đợt sửa từ sau lượt 3".
- [ ] §7.3 luật 2 ghi "không quá 100 code unit (UTF-16)".
- [ ] `PROJECT-STATE.md` có đủ các quyết định Owner của #899 / PR #917 (mỗi ý trỏ nguồn), và quyết định 01/11 của #901 / PR #920.
- [ ] Mục "Ô chọn" có vế 7d riêng; vế `nowrap` không còn lấy 7d làm ví dụ.

Ước lượng: ~60 dòng chữ.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI: PR chỉ sửa docs, không chạy
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #948 — docs: round 4 synthesis and metrics wording, §7.3 code units, Owner decisions of #899 and #901, the 7d choice gap (T-334)

Trạng thái: MERGED · merge 2026-11-02T06:42:56Z · commit `52a9979ca4999c757aff2d5f9a26f06ed97c6c9f` · nhánh `task/T-334-docs-notes` · nhãn: risk:low

Closes #935

Phiên code: coding-ses1 (auto-issues)

#### Thay đổi

Sáu mục sổ OPEN [T-334], đều là tài liệu: review #895 (2), #907 (1), #917 (1), #920 (1), #928 (1). Chỉ đổi chữ cho khớp nguồn và ghi các quyết định Owner đã có; không đổi luật, số hay quyết định nào.

1. **Bản tổng hợp lượt 4** (`docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md`), ba câu lệch nguồn:
   - §10.1 ("Ghi vào worktree"), đúng chữ đề xuất của sổ: "`baseline.md` do phiên thử, task kiểm expert, Owner và các phiên Claude điều phối ghi thêm giữa hai đợt (tới 30/10 18:46, trước gói A), rồi Claude ở bước 7". Nguồn: các đề mục đợt 2 của `docs/reviews/raw/2026-10-31/common-baseline.md` (hai phiên thử; ghi chú của Claude sau phiên thử lần 1; "Owner làm lại bước 1–4" kèm phần Claude kiểm đĩa; Claude kiểm phiên thử lần 2; quyết định G6; task kiểm expert; Claude kiểm task expert) và dòng "Không file nào ở `common\` sửa sau 18:46, lần Claude ghi file này trước gói A" của bước 7. Kết luận "không nhiễm" không đổi.
   - §1: câu "14 có từ trước, lượt 1–3 bỏ sót" nay nêu hai ngoại lệ: DR6-152 (tổng hợp lượt 3 §7.5 đã nêu `PURGE_REMINDER`, họ DR6-66) và phần (a) của DR6-145 (dòng "{trường}: {giá trị}" của DR6-37, vị trí L·CL-D5 lượt 1 đã nêu). Dòng 152 của §6 ghi "Trước (lượt 3 §7.5 đã nêu, Issue #790 không liệt kê)", theo cách các dòng khác ghi. Đếm lại §6: 9 dòng "Mới" (đúng 9 số ở §1), 14 dòng "Trước", đủ 23.
     - Thêm ngoài chữ đề xuất: chú thích đầu §6 định nghĩa "trước" là "có từ trước, lượt 1–3 bỏ sót". Dòng 152 ghi "Trước" thì chú thích đó sai cho đúng hai chỗ trên, nên chú thích thêm "(trừ hai ngoại lệ ở §1)".
   - §8.3: câu về PR Owner phải merge nay đủ 5 PR code: ba PR `risk:med` (L4-A, L4-C, L4-E) và hai PR review ở mức `high` theo bảng nâng mức của skill `review-pr` §2 (L4-B sửa `apps/desktop/src-tauri/**`, L4-D sửa `packages/ai/**`), cộng PR docs §14 của L4-E (G5). Chữ `risk:med` không còn đứng ở vế chung, vì #897 và #899 mang nhãn `risk:low` (§8.5). Khớp sổ: Owner merge #907, #911, #913, #915, #917; #909 merge theo lời Owner.
2. **`docs/metrics/phase-6.md`**, dòng lượt 4 của "Review đóng phase": "Kiểm phần đã sửa của các đợt sửa từ sau lượt 3".
3. **`docs/design/phase-5-ai.md` §7.3 luật 2**: `model` "không quá 100 code unit (UTF-16)", khớp `a.model.length <= MAX_MODEL` (`packages/db/src/ai-analyses.ts:242`).
4. **`docs/PROJECT-STATE.md`**: hai mục mới, xếp theo ngày ngay sau mục quyết định lượt 4 ngày 31/10, viết tiếng Anh như cả file, chữ Owner giữ nguyên văn ("in the OWNER's words"). Mỗi ý trỏ nguồn.
   - Mục "2026-10-31 / 11-01", Mock trích xuất:
     - 31/10, T-322: G8 đảo 12 ca (#899, comment `6542610486`); Owner không nhận hai giới hạn mà Correctness 4, 5 của review @`ccdfa56` ghi vào §10, bảo sửa bằng code, từ đó có `RETRACTED` (PR #917, comment `6543143155`); "mục 3 sửa code, không tính vòng, sửa tới dứt điểm" (PR #917, comment `6543614010`); A1 / J2 kèm 34 ca (#899, comment `6544354997`); "Chấp nhận 875 dòng" (PR #917, comment `6544577470`; ghi rõ SP thật ở `46c7674` là 439, không phải 362); bốn quyết định sau review @`46c7674`, gồm cỡ SP 465 / tổng 938 (#899, comment `6545579335`); "Giữ nguyên" `RETRACTED` xét cả ghi chú (#899, comment `6545612469`; PR #917, comment `6545612171`).
     - 31/10 – 01/11, mục Correctness 1 của review #917: giá trị cuối về KH thay luật hai giá trị; ba giá trị "Ly hôn" / "Góa" / "Ly thân"; trừ số con đã mất; "bé" như "con"; phần câu sau chỉ đoán / hỏi / bác bỏ ngoài danh sách giữ nguyên (ACCEPTED). Không comment nào trên #899 hay PR #917 ghi các ý này, nên mục trỏ tới sổ (PR #919, nay ở RESOLVED của T-330) và thân #931. Đoạn cuối ghi rõ các ý này đổi một phần hai quyết định sau review @`46c7674`: luật hai giá trị, và chữ kết thúc cụm ("vợ đã mất", "ly thân", "đều đã mất" nay ra giá trị thay vì bỏ đề xuất).
     - 01/11, T-330 (phần mục sổ thêm sau review #939): bốn quyết định trên #931 trước khi code (comment `6555846300`), kèm câu nói rõ các mặc định Claude chọn ở comment đó không phải lựa chọn Owner được hỏi từng cái; trên PR #939: chấp nhận lớp danh sách sau ":" (comment `6559531540`), chấp nhận cỡ 441 / 690 và chấp nhận số con cũ khi "vợ / chồng" đứng trước chỗ con mất ở câu sau (comment `6559984059`, ACCEPTED).
   - Mục "2026-11-01", G8 của #901 (T-324): viền ≥ 3:1 chỉ đo ở ô đang chọn (`--accent`, 6,9:1); ô chưa chọn giữ `--border-strong` (1,6:1) như `.choice` của `forms.css`, theo G3 T-284 (`docs/design/mockups/index.html:280`). Mục ghi rõ nguồn duy nhất là thân PR #920.
5. **`docs/testing/nghiem-thu-v1.md`**, mục "Ô chọn" của "Lệch mockup đã biết": vế `nowrap` bỏ ví dụ 7d, không thêm ví dụ thay. Vế mới cho 7d: hộp 7d của `kyc-forms.html` vẽ mỗi giá trị bằng một hàng `.radio` (chấm tròn, giá trị in đậm, dòng nguồn bên dưới), còn app dùng ô chọn từ T-048 (#150, `Choices` trong `KycDialogs.tsx`), nên không có chấm tròn; ở 7d, giá trị dài xuống dòng ở cả app lẫn mockup.

#### Test chấp nhận

- [x] Ba câu của bản tổng hợp lượt 4 khớp nguồn: §10.1 đúng chữ đề xuất của sổ; §1 và dòng 152 theo chữ đề xuất, thêm chú thích đầu §6 (lý do ở mục 1); §8.3 thêm L4-B, L4-D.
- [x] Dòng lượt 4 của `phase-6.md` ghi "các đợt sửa từ sau lượt 3".
- [x] §7.3 luật 2 ghi "không quá 100 code unit (UTF-16)".
- [x] `PROJECT-STATE.md` có đủ các quyết định Owner của #899 / PR #917 (mỗi ý trỏ nguồn), các quyết định 01/11 của T-330 mà mục sổ thêm sau review #939, và quyết định 01/11 của #901 / PR #920.
- [x] Mục "Ô chọn" có vế 7d riêng; vế `nowrap` không còn lấy 7d làm ví dụ.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff`, Trùng file (9):

- L13 `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` (ba câu lệch nguồn): đã sửa (mục 1).
- L14 `docs/metrics/phase-6.md:318` (dòng lượt 4, "hai đợt trên"): đã sửa (mục 2).
- L16 `docs/design/phase-5-ai.md:311` (§7.3 luật 2, "100 ký tự"): đã sửa (mục 3).
- L18 `docs/PROJECT-STATE.md` (quyết định Owner của PR #917 / #899, cùng #931 / PR #939): đã sửa (mục 4).
- L20 `docs/PROJECT-STATE.md` (quyết định Owner 01/11 của #901, viền ô chọn): đã sửa (mục 4).
- L26 `docs/testing/nghiem-thu-v1.md:403` (ví dụ 7d của mục "Ô chọn"): đã sửa (mục 5).
- L31 `packages/ai/src/mock-extraction.ts:756`, `docs/design/phase-5-ai.md:377` (KH chưa được mang qua khúc không có chữ): để lại, ngoài phạm vi: cần sửa code ở `packages/ai/src/mock-extraction.ts`, còn Issue chỉ cho sửa §7.3 của file spec.
- L33 NIT `docs/design/phase-5-ai.md:377`, `:375` (§10): để lại, ngoài phạm vi: Issue chỉ cho sửa §7.3; chữ `:377` đổi theo phần sửa của L31.
- L39 `docs/metrics/phase-6.md:247` ("Kích thước PR vượt ngưỡng", PR #944): để lại, ngoài phạm vi: Issue chỉ cho sửa dòng lượt 4 của "Review đóng phase"; mục này thêm PR #944 khi chốt số đo của G7.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

PR chỉ sửa `docs/` (không file nào thuộc `CODE_DOCS`), nên CI không chạy. `git diff --check` sạch; các dòng sửa không có CR, không có ký tự ẩn, số backtick và `**` chẵn. Cỡ diff: 29 dòng thêm, 8 dòng bớt, chỉ tài liệu. Không đụng file cần nhãn `build-exe`.

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-334 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #895, #907, #917, #920, #928 — T-334 (#935, PR #948, `REVIEW: PASS` @`1647f4e`):
  - #895 NIT, `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md`: ba câu khớp nguồn. §10.1 theo đúng chữ đề xuất (`baseline.md` do phiên thử, task kiểm expert, Owner và các phiên Claude điều phối ghi thêm giữa hai đợt, tới 30/10 18:46, rồi Claude ở bước 7). §1 nêu hai ngoại lệ của "lượt 1–3 bỏ sót" (DR6-152, phần (a) của DR6-145); dòng 152 ghi "Trước"; chú thích đầu §6 thêm "(trừ hai ngoại lệ ở §1)". §8.3 tính 5 PR code Owner phải merge: ba PR `risk:med` (L4-A, L4-C, L4-E) và hai PR review ở mức `high` (L4-B, L4-D), cộng PR docs §14 của L4-E.
  - #895 NIT, `docs/metrics/phase-6.md` ("Review đóng phase", dòng lượt 4): "Kiểm phần đã sửa của các đợt sửa từ sau lượt 3".
  - #907 NIT, `docs/design/phase-5-ai.md` (§7.3 luật 2): `model` "không quá 100 code unit (UTF-16)", khớp `a.model.length <= MAX_MODEL` (`packages/db/src/ai-analyses.ts`).
  - #917, `docs/PROJECT-STATE.md`: mục "2026-10-31 / 11-01" ghi các quyết định Owner về Mock trích xuất, mỗi ý trỏ nguồn: của #899 / PR #917 (đảo 12 ca, `RETRACTED`, "mục 3 sửa code, không tính vòng", A1 / J2 kèm 34 ca, "Chấp nhận 875 dòng", bốn quyết định sau review @`46c7674`, "Giữ nguyên"); các lựa chọn 31/10 – 01/11 cho Correctness 1 của review #917 (nguồn: PR #919 và thân #931), kèm câu ghi rằng chúng đổi một phần hai quyết định sau review @`46c7674`; các quyết định 01/11 của T-330 (#931, comment `6555846300`; PR #939, comment `6559531540`, `6559984059`). Các mặc định Claude chọn ở comment `6555846300` chỉ trỏ nguồn, vì không phải lựa chọn của Owner. Chữ "follows" ở ý 1 của T-330 là ghi chú mới của review #948 (OPEN).
  - #920, `docs/PROJECT-STATE.md`: mục "2026-11-01" ghi G8 của #901: viền ≥ 3:1 chỉ đo ở ô đang chọn (`--accent`, 6,9:1); ô chưa chọn giữ `--border-strong` (1,6:1) như `.choice` của `docs/design/mockups/forms.css`, theo G3 T-284 (`docs/design/mockups/index.html:280`); nguồn duy nhất là thân PR #920.
  - #928 NIT, `docs/testing/nghiem-thu-v1.md` (mục "Ô chọn" của "Lệch mockup đã biết"): vế `nowrap` bỏ ví dụ 7d. Vế mới: hộp 7d của `kyc-forms.html` vẽ mỗi giá trị bằng một hàng `.radio` (chấm tròn, giá trị in đậm, dòng nguồn bên dưới); app dùng ô chọn từ T-048 (#150), nên không có chấm tròn; ở 7d, giá trị dài xuống dòng ở cả app lẫn mockup.

---

# Issue #942 — T-335: Skill auto-issues — /goal chạy hàng đợi Issue qua phiên code / review con, merge, ghi sổ

Trạng thái: CLOSED · nhãn: type:task, risk:med, status:in-progress

##### Mục tiêu

Owner gõ `/goal …` một lần trong một **phiên điều phối**. Phiên đó tự chạy hàng đợi Issue, mỗi lần một Issue:

1. Phiên code con, context sạch, làm Issue và mở PR.
2. Chờ CI xanh. CI đỏ thì gửi về phiên code đó sửa.
3. Phiên review con, context sạch, chạy `review-pr`.
4. `REVIEW: CHANGES` thì gửi nội dung về đúng phiên code đó sửa, rồi review lại ở một phiên sạch. Lặp tới `REVIEW: PASS`.
5. Merge, mọi mức risk.
6. Phiên review đã PASS viết PR sổ ghi chú; phiên điều phối merge PR sổ. Xong mới sang Issue kế.

Hết hàng đợi: đề xuất gom các mục OPEN của sổ thành Issue, dừng chờ Owner duyệt, tạo Issue và PR gắn nhãn sổ, rồi in `AUTO: XONG`. Pipeline dừng hỏi Owner ở cổng G1–G7, khi spec mâu thuẫn, và khi phiên code không đồng ý một mục chặn.

##### Bối cảnh

Quyết định Owner 01/11/2026 (phiên Coding-ses2, trả lời từng câu hỏi khi thiết kế):

1. Phiên con là **phiên thật trong sidebar**: `coding-ses1`, `coding-ses2` ở checkout chính; `review-1` ở worktree review, `review-2` ở worktree review thứ hai.
2. **Lặp review tới PASS, không trần.** Khác "sửa tối đa 2 vòng, sau đó G8" của `CLAUDE.md`, và chỉ áp trong pipeline.
3. **Cổng G1–G7 và spec mâu thuẫn vẫn dừng pipeline.** Quyền mới chỉ có hai: merge PR `risk:med` / `risk:high` do pipeline làm ra (`merge-pr --owner`), và lặp không trần.
4. **Sau khi gom sổ thành Issue thì dừng**, in `AUTO: XONG`. Đợt mới do Owner gõ `/goal` lại.
5. "cứ xây dựng đi, khi nào chạy thử anh sẽ quyết định": task này không chạy thử pipeline.

Ràng buộc kỹ thuật, đã đọc ở tài liệu `/goal` và mô tả công cụ của app desktop:

- `/goal`: sau mỗi lượt, một model nhỏ đọc transcript, điều kiện chưa đạt thì chạy lượt tiếp. Khi còn lệnh nền hay subagent đang chạy thì không đánh giá. Model này chỉ đọc chữ trong transcript.
- Một phiên chỉ `/clear` được phiên con do chính nó mở, khi phiên con đang rảnh, không ghim, không đang mở trên màn hình. Lượt do sự kiện tự động khởi động không mở được phiên mới. Vì vậy phải mở đủ 4 phiên con ngay trong lượt `/goal` đầu.
- App không báo khi CI xanh hay khi có comment REVIEW. Phiên điều phối chờ bằng lệnh nền hỏi GitHub, mỗi lần cách ≥ 30 giây. Đây là ngoại lệ có chủ ý với quy tắc "không poll CI" của app, ghi vào ADR.

Quyết định ghi vào ADR-0001 phụ lục M11, `docs/PROJECT-STATE.md` và `CLAUDE.md`.

##### Tài liệu cần đọc

- `CLAUDE.md`: Mô hình thực hiện; Quy trình một task, bước 4–5; Nghi thức phiên
- `docs/decisions/0001-mo-hinh-thuc-hien-chi-claude-code.md`: phụ lục M8 (mẫu phụ lục)
- `docs/decisions/0017-review-theo-muc-risk.md`: review phiên sạch, worktree review
- `.claude/skills/review-pr/SKILL.md`: §0, §4, §5
- `tools/pr-status.mjs` (`loadPr`), `tools/session-core.mjs` (`latestReview`, `checkCounts`), `tools/pr-core.mjs` (`prFiles`), `tools/merge-pr.mjs` (đầu file: lúc nào từ chối)
- `docs/state/review-notes.md` (đoạn đầu), `tools/notes-for.mjs`
- PR #940 (PR sổ mẫu), PR #936 (PR gắn nhãn sổ mẫu), Issue #930…#935 (Issue gom từ sổ)
- https://code.claude.com/docs/en/goal

##### File / thư mục được phép sửa

- `.claude/skills/auto-issues/**` (mới)
- `.claude/skills/review-pr/SKILL.md` (§5: một đoạn cho phiên con của pipeline)
- `.claude/skills/README.md`
- `tools/auto-wait.mjs`, `tools/auto-wait-core.mjs`, `tools/auto-wait-core.test.mjs` (mới)
- `docs/decisions/0001-mo-hinh-thuc-hien-chi-claude-code.md` (phụ lục M11)
- `docs/PROJECT-STATE.md`
- `CLAUDE.md`

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với các đường dẫn trên:

- L21, L23 **[T-334 #935]** `docs/PROJECT-STATE.md`: để lại. Hai mục thuộc Issue #935, đang trong hàng đợi; T-335 chỉ thêm một mục quyết định 01/11.

##### Interface / hợp đồng

Lệnh chờ `node tools/auto-wait.mjs <kiểu> …`:

- `pr <issue>`: chờ PR mở đóng Issue đó, in số PR và head.
- `ci <N> [--not <sha>]`: chờ CI chạy xong trên head của PR. Có `--not` thì trước hết chờ head đổi khác SHA đó. PR chỉ sửa docs thì xong ngay.
- `review <N> [--sha <sha>]`: chờ comment `REVIEW:` mới nhất nêu đúng head (hoặc `<sha>`).
- `title <chữ>`: chờ một PR có tiêu đề chứa đúng chữ đó (PR sổ).
- `sleep`: chỉ chờ hết giờ. Dùng khi chờ phiên con mà việc của nó không để lại dấu trên GitHub, để `/goal` không đánh giá giữa chừng.
- Tham số chung:
  - `--timeout <phút>`: mặc định 45, tối đa 120;
  - `--every <giây>`: mặc định 60, tối thiểu 30.
- Mã thoát:
  - 0: xong, kết quả tốt (xanh / PASS / đã thấy);
  - 1: xong, kết quả xấu (đỏ / CHANGES);
  - 2: hết giờ;
  - 3: cần xem, gồm PR đã đóng hoặc đã merge, nhiều PR cho một Issue, lỗi `gh` nhiều lần liền;
  - 64: sai tham số.
- Dòng cuối stdout có dạng `AUTO-WAIT <kiểu> …: <kết quả>`.

Dòng mốc:

- Phiên điều phối in `AUTO: XONG` hoặc `AUTO: DỪNG — <lý do>`. Điều kiện `/goal` mẫu đọc hai dòng này.
- Phiên con kết thúc mỗi lượt bằng đúng một dòng `AUTO-CHILD: …`, theo bảng trong skill.

##### Test chấp nhận

- [ ] Unit test phần thuần của lệnh chờ:
  - đọc tham số: từng kiểu, giá trị mặc định, giới hạn, sai tham số → 64;
  - CI:
    - xanh; đỏ, kèm tên check đỏ; đang chạy;
    - PR code chưa có check nào → đang chờ;
    - PR chỉ sửa docs → xong;
    - head vẫn bằng `--not` → đang chờ;
    - PR đã merge hoặc đã đóng → 3;
  - review:
    - PASS / CHANGES của đúng head;
    - REVIEW của head cũ → đang chờ; chưa có REVIEW → đang chờ;
    - so SHA theo tiền tố;
  - PR của Issue: một PR; không có; nhiều PR → 3;
  - tiêu đề: khớp đúng số PR (939 không khớp 9390);
  - vòng chờ:
    - hết giờ → 2;
    - lỗi `gh` nhiều lần liền → 3;
    - lỗi lẻ được thử lại.
- [ ] Chạy thật trên PR có sẵn, kết quả ghi trong thân PR:
  - `ci` và `review` trên PR đã merge → 3;
  - `title "record the notes of the PR 939 review"` → 0 (#940);
  - `pr 931` với `--timeout 1` → 2.
- [ ] Skill `auto-issues` có đủ các phần sau:
  - lệnh `/goal` mẫu;
  - kiểm đầu: checkout chính sạch và ở `main`, hai worktree review sạch, `gh` đã đăng nhập;
  - hàng đợi: danh sách trong lệnh, hoặc các Issue mở có `ready-for-agent` của milestone, theo số, bỏ Issue còn bị chặn. Owner xác nhận ở lượt đầu;
  - mở 4 phiên con ở lượt đầu;
  - mỗi lượt đọc trạng thái từ GitHub và phiên con rồi làm đúng một bước: code → CI → review → sửa → merge → PR sổ;
  - brief cho từng loại phiên con;
  - chọn phiên con: việc mới cho phiên ít dùng gần nhất; việc sửa về đúng phiên đã code, phiên đó ghi tên mình trong thân PR. `/clear` bị từ chối → dùng phiên sinh đôi → vẫn bị thì hỏi Owner;
  - chờ bằng lệnh chờ chạy nền, mỗi lúc chỉ một lệnh;
  - điểm dừng hỏi Owner bằng `AskUserQuestion` kèm thông báo đẩy, ghi quyết định thành comment trên PR / Issue;
  - chỉ phiên điều phối merge, qua `merge-pr`, thêm `--owner` cho med / high;
  - bước sổ → Issue;
  - chạy tiếp sau khi context bị nén hoặc phiên được mở lại;
  - không tự merge PR sửa chính pipeline: Issue / PR chạm skill `auto-issues` hoặc lệnh chờ → dừng, Owner review và merge.
- [ ] Ghi quyết định:
  - ADR-0001 phụ lục M11 có 5 quyết định Owner ngày 01/11 và ngoại lệ "chờ bằng lệnh hỏi GitHub";
  - `PROJECT-STATE` có mục 01/11;
  - `CLAUDE.md` có pipeline ở "Mô hình thực hiện", ngoại lệ ở bước 5, tên skill ở "Project skills";
  - README của skill ghi `auto-issues` là skill 2C tự viết;
  - `review-pr` §5 có đoạn cho phiên con của pipeline.

Ước lượng: ~750 dòng tổng diff (code công cụ ~170, test ~220, skill ~260, tài liệu ~100).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] Owner merge (risk:med). Thời điểm chạy thử pipeline do Owner quyết.

##### Rủi ro

risk:med

##### Bị chặn bởi

Không

## PR #944 — feat(tools): auto-issues pipeline, /goal runs the Issue queue through child sessions (T-335)

Trạng thái: MERGED · merge 2026-11-02T02:09:35Z · commit `a96d94df4330652dcb640c0f6f4b5474f2b287cf` · nhánh `task/T-335-auto-issues` · nhãn: type:task, risk:med

Closes #942

> **Cỡ vượt ngưỡng: 1297 dòng tổng diff (> ~800)** sau ba vòng sửa review (@`6233e7e`, @`67c6743`, @`8767876`); lúc Owner chấp nhận cỡ là 1078 dòng. Issue ước lượng ~750.
>
> | Phần | Dòng | Ngưỡng |
> |---|---|---|
> | Code công cụ (gồm 16 dòng ở `tools/pr-status.mjs`, 12 dòng ở `tools/review-hint-core.mjs`) | 394 | ≤ ~400, trong ngưỡng |
> | Test | 503 | |
> | Skill | 334 | |
> | Tài liệu | 66 | |
>
> **Owner 01/11/2026 chấp nhận cỡ** ([comment](https://github.com/AlexH-AI/Project-2C/pull/944#issuecomment-6560983167)): review không coi cỡ là mục chặn.
>
> **Owner 02/11/2026 bảo sửa tiếp sau `REVIEW: CHANGES` thứ ba** (G8, [comment](https://github.com/AlexH-AI/Project-2C/pull/944#issuecomment-6562478439), ghi ở `docs/PROJECT-STATE.md`). Review sau mà còn CHANGES thì dừng để Owner quyết.
>
> **Owner 02/11/2026 mở rộng rào "không tự sửa"** ([comment](https://github.com/AlexH-AI/Project-2C/pull/944#issuecomment-6566154223), ghi ở `docs/PROJECT-STATE.md`): pipeline không làm Issue và không merge PR chạm chính nó, cổng merge, cổng review hay luật chung của các cổng đó.

#### Thay đổi

- **Skill `auto-issues`** (mới, `.claude/skills/auto-issues/SKILL.md`): phiên điều phối do `/goal` giữ chạy. Gồm:
  - lượt đầu: kiểm đầu, hàng đợi Owner xác nhận, mở 4 phiên con `coding-ses1/2` và `review-1/2`;
  - bảng nhịp: mỗi lượt đọc trạng thái từ GitHub và phiên con, rồi làm đúng một bước;
  - brief cho từng việc của phiên con, mỗi việc kết thúc bằng một dòng `AUTO-CHILD: …`;
  - chọn phiên con và `/clear`: phiên ít dùng gần nhất; sửa thì về đúng phiên đã code; bị từ chối thì dùng phiên sinh đôi;
  - merge: chỉ phiên điều phối, `--owner` cho PR med / high; PR chạm rào "không tự sửa" thì dừng hỏi Owner;
  - hỏi Owner: thông báo đẩy + `AskUserQuestion`, quyết định ghi thành comment;
  - Owner bác một mục chặn mà head chưa đổi: phiên code push một commit rỗng để có head mới, rồi review lại ở phiên sạch. Brief review cho reviewer đọc các comment `Quyết định Owner (…)` trước khi kết luận. Không có hai điều này, CHANGES trên cùng head sẽ bị gửi lại mãi (commit `6233e7e`);
  - sổ → Issue; kết thúc và chạy tiếp; những việc phiên điều phối không làm.
- **Lệnh chờ `tools/auto-wait.mjs`**, phần thuần ở `tools/auto-wait-core.mjs` (37 unit test).
  - Kiểu chờ: `pr`, `ci [--not]`, `review [--sha]`, `title`, `sleep`. Tham số: `--timeout` / `--every` / `--once`. Mã thoát 0 / 1 / 2 / 3 / 64.
  - Chờ đủ `--timeout`: lần ngủ cuối dừng đúng hạn, rồi đọc thêm một lần. Lần ngủ đó không ngắn hơn 30 giây, nên hai lần đọc luôn cách nhau ≥ 30 giây (vòng sửa 3).
  - Dòng `AUTO-WAIT` luôn là một dòng, kể cả khi lỗi của `gh` có xuống dòng (vòng sửa 3).
  - Đọc PR bằng một `gh pr view`, thay cho `loadPr` của `pr-status` (vòng sửa review).
    - Danh sách file đọc bằng `loadPrFiles` mà `pr-status` export (vòng sửa 2), nên chỉ còn một chỗ đọc file theo DR6-57. Chỉ đọc khi CI chưa có check nào.
    - Workflow run chỉ đọc khi mọi check đã xong.
    - Dùng lại `latestReview`, `checkCounts`, `prFiles`.
  - CI chỉ tính là xong khi mọi workflow run của head đã xong. Lý do: job `Build portable exe` (`needs: verify`) chỉ có check sau khi Verify xong. Rollup của #939 có cả hai check, còn của #941 lúc đang chạy chỉ có Verify.
- **Hook `review-pr-hint`** (`tools/review-hint-core.mjs`, vòng sửa 3): tin có `[auto-issues]` chỉ được gợi ý `review-pr` khi có một dòng đúng `review PR #<N>` (brief §3.2).
- **Ghi quyết định Owner 01/11** (ADR-0001 phụ lục M11): `docs/PROJECT-STATE.md`; `CLAUDE.md` (Mô hình thực hiện, bước 5, Project skills); README của skills; `review-pr` §5 thêm đoạn cho phiên con của pipeline.
- **Ghi quyết định Owner 02/11** (G8 của PR này; mở rộng rào "không tự sửa"): `docs/PROJECT-STATE.md`.
- **Thêm so với Issue** (đều trong file được phép sửa):
  - cờ `--once` (đọc một lần), để mỗi nhịp đọc CI theo cùng logic với lệnh chờ;
  - worktree chỉ đọc `Project-2C-auto` cho công cụ của phiên điều phối, vì phiên code sửa ngay trên checkout chính, kể cả `tools/`. Từ vòng sửa review, `merge-pr` cũng chạy từ đó, nên cổng merge là bản đã duyệt trên `main`.
- **Vòng sửa 1, sau `REVIEW: CHANGES` @`6233e7e`** (commit `67c6743`): từng mục ghi ở comment trả lời review.
- **Vòng sửa 2, sau `REVIEW: CHANGES` @`67c6743`** (commit `0631194`, `8767876`):
  - dòng `AUTO-CHILD` mang thẻ việc;
  - bảng nhịp chờ khi có phiên con đang chạy, và chỉ giao việc chưa được giao, kể cả ở bước PR sổ và §6;
  - dừng lệnh chờ trước dòng kết thúc; sau dòng kết thúc không làm nhịp nữa.
- **Vòng sửa 3, sau `REVIEW: CHANGES` @`8767876`** (commit `fa378ed`, `125c16b`, `cc0e52b`, `2597207`):
  - lệnh chờ chờ đủ `--timeout`, giữ khoảng ≥ 30 giây giữa hai lần đọc; dòng `AUTO-WAIT` không vỡ dòng;
  - hook không gợi ý `review-pr` nhầm trên brief khác §3.2 và trên tin chuyển quyết định Owner;
  - skill: phiên con còn chạy mà kết quả đã lên GitHub thì ngủ 5 phút thay vì lặp nhịp; nhịp đọc PR sổ; PR chạm pipeline dừng hỏi Owner ở bước merge; §3.3 chỉ cách tìm run đỏ;
  - mở rộng rào "không tự sửa" theo quyết định Owner 02/11 (`cc0e52b`, `2597207`): rào ghi một lần ở đầu skill (pipeline, cổng merge, cổng review, luật chung `CLAUDE.md` gốc và `.claude/settings.json`); §1, §4, §5 và ADR-0001 M11 trỏ về đó, §3.0 giữ một bản chép cho phiên con;
  - ghi hai quyết định Owner 02/11 (G8, rào) vào `docs/PROJECT-STATE.md`.

  Từng mục ghi ở comment trả lời review.

#### File ngoài danh sách của Issue

- `tools/pr-status.mjs`: export `loadPrFiles`, phần đọc danh sách file vốn nằm trong `loadPr`. Review @`67c6743` gợi ý tách ra (*Duplicated Code* giữa `readPr` và `loadPr`), để cách đọc file theo DR6-57 chỉ còn ở một chỗ.
  - Chỉ tách hàm, `loadPr` chạy như cũ.
  - 382 test của `tools/` xanh, kể cả `tools/pr-status.test.mjs`.
  - `node tools/pr-status.mjs 940` ra như trước: `1 changed, 1 read · docs-only yes`.
- `tools/review-hint-core.mjs`, `tools/review-hint-core.test.mjs` (vòng sửa 3): phần thuần của hook `review-pr-hint`. Review @`8767876` chỉ ra hook bắn nhầm trên brief §3.4, §3.5, §3.7 và tin chuyển quyết định Owner, và gợi ý sửa chính hook là cách chắc nhất.
  - Chỉ đổi tin có `[auto-issues]`; mọi ca cũ của `reviewedPr` giữ nguyên và vẫn xanh. File hook `.claude/hooks/review-pr-hint.mjs` không đổi.
  - Hook chạy từ checkout của từng phiên (`$CLAUDE_PROJECT_DIR`), nên luật mới có hiệu lực khi checkout đó có bản sau merge. Worktree review đang ở bản cũ chỉ nhận brief §3.2 làm việc đầu, và brief đó cần gợi ý; sau đó `review-pr` đưa worktree về head của PR, vốn dựng trên `main`.

#### Test chấp nhận

- [x] Unit test phần thuần (`tools/auto-wait-core.test.mjs`, 37 ca). Vòng sửa 2 thêm hai ca: workflow run chỉ đọc khi mọi check đã xong, và `--once` gặp lần đọc lỗi thì ra mã 3. Vòng sửa 3 thêm bốn ca: lần đọc tốn thời gian mà vẫn chờ đủ hạn và đọc lần cuối đúng hạn, kể cả khi hạn bằng một nhịp; lần ngủ cuối không dưới 30 giây; lỗi `gh` hai dòng vẫn ra một dòng `AUTO-WAIT`.
  - đọc tham số: từng kiểu, mặc định, giới hạn, sai tham số, `--once`;
  - CI: xanh; đỏ kèm tên check; đang chạy; chưa có check; docs-only; đọc thiếu file; `--not`; workflow run còn chạy; PR đã đóng hoặc đã merge;
  - review: PASS / CHANGES; REVIEW của head cũ; chưa có REVIEW; không có SHA; người ngoài; tiền tố SHA; verdict lạ; PR đã merge;
  - PR của Issue: một / không có / nhiều;
  - tiêu đề: khớp đúng số PR, bỏ PR đóng mà không merge;
  - vòng chờ: hết giờ, chờ đủ hạn khi lần đọc tốn thời gian, khoảng ≥ 30 giây ở lần đọc cuối, lỗi đọc liên tiếp, lỗi lẻ, `--once`;
  - dòng báo, kể cả lỗi nhiều dòng.
- [x] Unit test hook (`tools/review-hint-core.test.mjs`, thêm một ca): brief §3.2 → số PR, kể cả khi có dòng đứng trước; brief §3.4, §3.5, §3.7 và tin chuyển quyết định Owner → không.
- [x] Chạy thật (Home PC, 01/11; các lệnh `pr 931` chạy lại 02/11 ở `fa378ed` và `125c16b`):
  - `ci 939`, `review 939`, `review 939 --sha 00e6e76`: `PR #939 is MERGED`, exit 3;
  - `title "record the notes of the PR 939 review"`: `PR #940 (MERGED): docs: record the notes of the PR 939 review (T-330)`, exit 0;
  - `title "record the notes of the PR 93"`: hết giờ, exit 2, không khớp nhầm PR 939;
  - `pr 931 --timeout 1`: hết giờ sau 61 giây, exit 2; `pr 931 --timeout 1 --every 600`: sau 60 giây, exit 2. Trước vòng sửa 3 hai lệnh này ra sau 1 và 0 giây, nên bằng chứng cũ là đạt giả;
  - `pr 931 --timeout 1 --every 45`: sau 77 giây, exit 2 (đọc ở khoảng 0, 46 và 77 giây; lần ngủ cuối 30 giây);
  - `pr 932`: `PR #941 @b6f8931 closes #932`, exit 0;
  - `ci 941` và `review 941` (PR đang mở của T-331, chỉ đọc): hết giờ khi CI đang chạy và chưa có REVIEW, exit 2;
  - `ci 941 --once`: `not yet: CI 0 pass, 0 fail, 1 pending @b6f8931`, exit 2;
  - thiếu tham số: exit 64.
- [x] Skill có đủ các phần Issue liệt kê:
  - lệnh `/goal` mẫu, kiểm đầu, hàng đợi, 4 phiên con mở ở lượt đầu;
  - bảng nhịp, brief, chọn và `/clear` phiên con, cách chờ;
  - hỏi Owner, merge, sổ → Issue, chạy tiếp;
  - rào "không tự sửa" (đầu skill: pipeline, cổng merge, cổng review, luật chung): Issue chạm rào bị bỏ khỏi hàng (§1), PR chạm rào dừng hỏi Owner ở bước merge (§4, §5).
- [x] ADR-0001 M11, `PROJECT-STATE`, `CLAUDE.md`, README của skills, `review-pr` §5.
- [ ] Chạy thử pipeline: Owner quyết thời điểm (Issue #942, Bối cảnh mục 5).

#### Ghi chú OPEN liên quan

- L21 **[T-334 #935]** `docs/PROJECT-STATE.md` (quyết định Owner 31/10 của PR #917 / Issue #899): để lại. Mục này thuộc Issue #935 trong hàng đợi; PR này chỉ thêm mục 01/11 của pipeline và hai mục 02/11 (G8 và rào "không tự sửa" của chính PR này).
- L23 **[T-334 #935]** `docs/PROJECT-STATE.md` (quyết định Owner 01/11, G8 của #901): để lại, cùng lý do.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local trên `2597207` (4351 test). Làm trong worktree `C:\workspace\Project-2C-T-335`, dựng trên `main` `f5dab7d`. Lúc dựng, checkout chính đang có phiên `coding-ses1` làm #932, nên em không làm ở đó.
- [x] Không thêm dependency. Công cụ chỉ dùng module có sẵn của Node; `git diff --check` sạch.
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`.
- Chưa chạy thử pipeline, theo lời Owner. Những điều chỉ biết được khi chạy thật:
  - app có cho `/clear` và gửi tin vào phiên con từ một lượt tự động không;
  - `/goal` có hoãn đánh giá khi lệnh chờ chạy nền như tài liệu ghi không;
  - hook `UserPromptSubmit` có chạy trên tin gửi bằng `SendMessage` không (§3.2 dựa vào điều này để gợi ý `review-pr`; brief vẫn bảo chạy skill, nên không có gợi ý cũng không sao);
  - model đánh giá của `/goal` có đọc nhầm dòng mốc nằm trong file skill không. Nếu nhầm thì Owner gõ lại `/goal`; skill có ghi điều này.
- `docs/PROJECT-STATE.md` cũng sẽ được #935 (T-334) sửa: PR nào merge sau thì `gh pr update-branch`.

Rủi ro: `risk:med`. PR đổi quy trình merge nên Owner merge. PR chạm rào "không tự sửa", nên pipeline cũng không được tự merge.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-335 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #950 — T-336: Mục sổ G7: packages/ai — Mock trích xuất mang KH qua khúc không chữ và dấu đầu dòng, ca Số con của luật 3, gỡ chép, §10, ranh giới test-support, chữ quyết định T-330

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Sửa bảy mục sổ OPEN ở `packages/ai` và tài liệu của nó (review #937 ×2, #939 ×4, #948 ×1). Ngoài luật mang KH ở mục 1, Mock trích xuất không đổi kết quả.

1. **Mock trích xuất mang KH qua khúc không có chữ cái và sang vế mở bằng dấu đầu dòng** (Correctness 3 của vòng @`aa1d257` của review #939, PR #939 để lại; quyết định Owner 02/11/2026 ở Bối cảnh).
   - Dấu kết câu rồi xuống dòng tạo một vế chỉ có ký tự xuống dòng. Vế đó không có cụm nên không được đọc, và vế mở câu sau không được mang KH sang. Dòng trống và dãy dấu không có chữ ("...", "!!") cũng vậy.
   - Vế mở bằng dấu đầu dòng được mang KH sang thì `before` không khớp, vì `kh` là đầu vế, chưa bỏ dấu đầu dòng.
   - Vì vậy, với ghi chú viết mỗi câu một dòng, luật 1–3 qua câu chỉ chạy khi hai câu cùng dòng. Hiện ra ∅ theo hướng an toàn (trường bị bỏ, không ra giá trị sai), và ba ca ở bảng luật 1 ghim hành vi đó.
2. **Ngoại lệ Số con của `endedBy` chưa có ca test (review #939).** §10 cho cả cụm Hôn nhân lẫn cụm Số con che chữ kết thúc, nhưng đột biến "chỉ cụm Hôn nhân che" không làm đổi chuỗi nào của file test. Thêm hai câu vào bảng luật 3.
3. **Chữ §10 (NIT review #939).** Danh sách "chỉ đề xuất … số con" ở đầu mục Mock thiếu "đều đã mất / qua đời". Câu giới hạn mang KH ("Hiện KH chưa được mang qua…") đổi theo mục 1.
4. **Gỡ chép (review #939).** `NAMES_NO_ONE` gõ lại cách viết "góa" của `WIDOWED`, khai báo sau nó: thêm một cách viết "góa" vào `WIDOWED` mà quên chỗ kia thì "vợ" trong "góa vợ" thành người khác. "con / bé" có ở bốn chỗ (`COUNT`, `DEAD_CHILDREN`, `CHILD`, mẫu số con). Đưa `WIDOWED` lên trước `NAMES_NO_ONE` rồi dùng lại; một hằng cho "con / bé".
5. **Ranh giới module (review #937).** `exclude` của cấu hình dependency-cruiser bỏ khỏi đồ thị mọi module có `dist/` trong đường dẫn, kể cả module npm. Vì vậy `domain-is-pure` và `ai-only-on-domain-and-zod` không thấy import npm nào phân giải vào `dist/`. Hôm nay cạnh duy nhất bị che mà vi phạm rule là `test-support` → `vitest` (PR #937). Chỉ loại thư mục build của repo, và miễn `test-support` trong rule của `ai`; sửa riêng `exclude` thì `pnpm lint:deps` đỏ ở cạnh đó.
6. **"File hay tìm" của CLAUDE.md package ai (NIT review #937)** chưa nêu file trích xuất của Mock (`mockExtractionOutput`), chỉ khối codemap có. Thêm, và nói rõ `mockAnalysisOutput` / `mockDiscoveryOutput` ở đâu.
7. **Sổ quyết định (NIT review #948).** Ý 1 của quyết định 01/11 của T-330 viết "and the phrase follows a plain statement about the customer", lỏng hơn nguồn (comment `6555846300` trên #931: "cụm đứng ngay sau một câu kể đơn về KH (như luật 1)"). Hai cách đọc cho kết quả khác nhau, vd. với "KH đã kết hôn. Anh Nam đến muộn. Vợ đã mất." Sửa thành "and the phrase comes right after a plain statement about the customer (as in rule 1)".

##### Bối cảnh

- G7 Phase 6. Owner 02/11/2026 duyệt gom 18 mục [G7] của sổ: ba Issue T-336…T-338, một mục ACCEPTED, một mục giữ [G7] (Owner 23/10: sửa hết trước v1.0).
- **Quyết định Owner 02/11/2026, hành vi mới của Mock trích xuất** (duyệt trong đợt gom sổ của pipeline `auto-issues`):
  - khi xét "vế ngay trước", vế không có chữ cái là trong suốt (dấu kết câu rồi xuống dòng, dòng trống, "...", "!!");
  - vế mở bằng dấu đầu dòng được mang KH sang, sau khi bỏ `BULLET`;
  - bốn ví dụ: "KH đã kết hôn." xuống dòng "Đã ly hôn năm 2020." → Ly hôn; "- KH đã kết hôn" xuống dòng "- Đã ly hôn năm 2020." → Ly hôn; "KH có 2 con." xuống dòng "Một con đã mất." → Số con 1; "KH đã kết hôn... Đã ly hôn năm 2020." → Ly hôn.

  Test chấp nhận viết theo quyết định này, nên không cần hỏi lại. Chỗ quyết định chưa nói rõ: chọn theo chữ §10 và hướng an toàn (không đề xuất), ghi ở thân PR.
- Luật 1–3 qua câu và §10 là của T-330 (#931, PR #939). T-329 (#930, PR #937) tách phần trích xuất của Mock ra file riêng.
- Không đổi danh mục KYC; không G2 / G5: không golden nào chạy Mock (X01–X05 là của prompt `extraction@1`), và spec §10 không là tài liệu G5 (như Bối cảnh #931).
- Diff chạm `packages/ai/**` nên review lên mức high; pipeline `auto-issues` merge mọi mức (ADR-0001 phụ lục M11). Cấu hình dependency-cruiser và sổ quyết định nằm ngoài rào "không tự sửa" của pipeline.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: các mục [T-336] (nhóm review PR #937, #939, #948)
- `docs/design/phase-5-ai.md` §10, mục Mock
- `packages/ai/src/mock-extraction.ts`: `clausesOf` (`carried`, `worded`), `opening`, `BULLET`, `NAMES_NO_ONE`, `WIDOWED`, `COUNT`, `DEAD_CHILDREN`, `CHILD`, mẫu số con của phần trích xuất
- `packages/ai/src/mock-extraction.test.ts`: ba ca qua dòng ở bảng luật 1 (comment "Nor, for now, past a stretch with no word…"), bảng luật 3
- `.dependency-cruiser.cjs` (`options.exclude`, rule `ai-only-on-domain-and-zod`); `packages/ai/src/test-support.ts`
- `packages/ai/CLAUDE.md`, mục "File hay tìm"
- `docs/PROJECT-STATE.md`: quyết định 01/11 của T-330
- `e2e/customer-ai.spec.ts`, `e2e/customer-kyc.spec.ts`, `e2e/customer-ai-web.spec.ts`, `e2e/appointment-outcome.spec.ts` (ca có đề xuất của Mock trích xuất); `packages/db/src/seed-data.ts` (ghi chú seed), chỉ đọc
- Comment review của PR #937, PR #939 (vòng @`aa1d257`: Correctness 3) và PR #948; Issue #931 (comment `6555846300`)

##### File / thư mục được phép sửa

- `packages/ai/src/mock-extraction.ts`, `packages/ai/src/mock-extraction.test.ts`
- `docs/design/phase-5-ai.md` (chỉ §10)
- `packages/ai/CLAUDE.md` (mục "File hay tìm"; khối codemap nếu export đổi)
- `.dependency-cruiser.cjs`
- `docs/PROJECT-STATE.md` (ý 1 của quyết định 01/11 của T-330; thêm quyết định Owner 02/11/2026 ở Bối cảnh)
- `e2e/customer-ai.spec.ts`, `e2e/customer-kyc.spec.ts`, `e2e/customer-ai-web.spec.ts`, `e2e/appointment-outcome.spec.ts` (chỉ khi kết quả của Mock đổi)

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với các đường dẫn trên (sổ @ `0a72770`; nhãn theo PR gắn nhãn sổ ngày 02/11):

- **Gộp** bảy mục [T-336]:
  - review #937: `exclude` của dependency-cruiser; "File hay tìm" của CLAUDE.md package ai;
  - review #939: mang KH qua khúc không có chữ (Correctness 3 của vòng @`aa1d257`); ca ngoại lệ Số con ở bảng luật 3; chữ §10; gỡ chép `WIDOWED` / "con / bé";
  - review #948: chữ "follows" ở quyết định 01/11 của T-330.
- Không có mục nào để lại.

##### Interface / hợp đồng

- Output của Mock trích xuất giữ schema `extraction@1` (trường, giá trị, trích dẫn). Chỉ đổi: ghi chú có khúc không có chữ cái, hay dấu đầu dòng, giữa hai vế ra đề xuất như khi hai vế cùng dòng.
- API công khai của `@p2c/ai` không đổi. Rule ranh giới giữ nghĩa: `ai` chỉ dùng `domain` + `zod`, trừ test và `test-support`.

##### Test chấp nhận

Mỗi câu dưới là một ca test của Mock trích xuất:

- [ ] Quyết định Owner 02/11: "KH đã kết hôn." xuống dòng "Đã ly hôn năm 2020." → Ly hôn; "- KH đã kết hôn" xuống dòng "- Đã ly hôn năm 2020." → Ly hôn; "KH có 2 con." xuống dòng "Một con đã mất." → Số con 1 (trích "Một con đã mất"); "KH đã kết hôn... Đã ly hôn năm 2020." → Ly hôn.
- [ ] Ba ca đang ghim ∅ ở bảng luật 1 đổi thành Ly hôn: "KH đã kết hôn." xuống dòng "Đã ly hôn năm 2020."; "KH đã kết hôn", dòng trống, "Đã ly hôn năm 2020."; "- KH đã kết hôn" xuống dòng "- Đã ly hôn năm 2020.". Thêm "KH đã kết hôn!! Đã ly hôn năm 2020." → Ly hôn.
- [ ] Chỉ vế không có chữ cái là trong suốt: "KH sống ở quận 7." xuống dòng "Có 2 con." và "KH sống ở quận 7.", dòng trống, "Đã kết hôn." → không đề xuất, như khi cùng dòng.
- [ ] Bảng luật 3 thêm hai ca: "KH đã kết hôn, có 2 con nhưng đều đã mất." → Đã kết hôn, Số con 0 (trích "đều đã mất"); "KH đã kết hôn, có 2 con, 1 con đã mất." → Đã kết hôn, Số con 1.
- [ ] Cách viết "góa" khai báo một lần (`WIDOWED`, đặt trước `NAMES_NO_ONE` và dùng lại ở đó); "con / bé" một hằng, dùng ở cả bốn chỗ. Mọi ca có sẵn khác của Mock giữ kết quả; thân PR liệt kê từng ca có sẵn đổi kết quả.
- [ ] `exclude` của dependency-cruiser chỉ bỏ thư mục build của repo (vd. `^(coverage|apps/[^/]+/(dist|src-tauri)|packages/[^/]+/dist)/`). Rule `ai-only-on-domain-and-zod` miễn `test-support` (`(\.test|test-support)\.ts$`). `pnpm lint:deps` xanh. Thử tay, ghi ở thân PR: thêm tạm một import `vitest` vào một file không phải test của package ai thì `pnpm lint:deps` đỏ ở cạnh đó.
- [ ] Mục "File hay tìm" nêu file trích xuất của Mock (`mockExtractionOutput`) và nơi của `mockAnalysisOutput` / `mockDiscoveryOutput`; khối codemap khớp (`pnpm verify`).
- [ ] §10 tả luật mang KH mới (vế không có chữ cái trong suốt, dấu đầu dòng bỏ trước khi xét) thay câu "Hiện KH chưa được mang qua…"; danh sách số con ở đầu mục Mock có "đều đã mất / qua đời". Khớp code; mục khác của spec không đổi.
- [ ] Sổ quyết định: ý 1 của quyết định 01/11 của T-330 đọc "and the phrase comes right after a plain statement about the customer (as in rule 1)"; có mục quyết định Owner 02/11/2026 ở Bối cảnh.
- [ ] e2e có đề xuất của Mock trích xuất vẫn xanh; ca nào đổi kỳ vọng thì PR ghi lý do. Thân PR ghi đề xuất nào đổi trên ghi chú của seed, nếu có.

Ước lượng: ~100–150 dòng tổng diff (code sản phẩm ~40–60, test ~50–80, tài liệu ~10).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low (review tự lên mức high vì chạm `packages/ai`; pipeline `auto-issues` merge mọi mức, ADR-0001 phụ lục M11)

##### Bị chặn bởi

Không

## PR #956 — fix(ai): Mock extraction carries the KH past clauses with no letter and onto bullets, depcruise build-only exclude (T-336)

Trạng thái: MERGED · merge 2026-11-02T15:20:32Z · commit `a7877e534336c137ad219f2808afd5bd0848ecc2` · nhánh `task/T-336-mock-extraction-carry` · nhãn: risk:low

Closes #950

Phiên code: coding-ses2 (auto-issues)

#### Thay đổi

1. **Mock trích xuất mang KH qua vế không có chữ cái và sang vế mở bằng dấu đầu dòng** (`clausesOf`; quyết định Owner 02/11/2026 ở Bối cảnh #950).
   - Vế đọc gần nhất mang KH sang vế đang xét khi phần ghi chú giữa hai vế không có chữ cái (`\p{L}`, như `worded`): dấu kết câu rồi xuống dòng, dòng trống, "...", "!!", cả "?" đứng riêng. Phép thử chạy trên chữ của ghi chú, nên vế có chữ mà không có cụm (không được đọc) vẫn chặn như trước: "KH đã kết hôn, sống ở quận 7. Có 2 con." → chỉ Đã kết hôn.
   - Vế được mang KH sang đọc từ sau `BULLET` (`BULLETED`), kể cả chữ nối mở vế (`JOINS_ON`).
   - Chỗ quyết định chưa nói rõ, chọn theo chữ §10 (ghi cả ở `docs/PROJECT-STATE.md`):
     - Vế chỉ có số và dấu (số thứ tự "2." của danh sách) không có chữ cái, nên trong suốt: "1. KH đã kết hôn." xuống dòng "2. Đã ly hôn năm 2020." → Ly hôn.
     - Chữ nối ngay sau dấu đầu dòng mang KH đi tiếp như khi không có dấu: "- KH đã kết hôn" xuống dòng "- và có 2 con." → Đã kết hôn, Số con 2.
     - Dấu đầu dòng được bỏ ở mọi vế được mang KH sang, cả vế sau dấu phẩy trên cùng dòng, như `opener` đọc dấu đầu dòng ở mọi vế mở bằng KH.
     - Vế chỉ có "?" không có chữ cái nên trong suốt, đúng chữ quyết định: "KH đã kết hôn." xuống dòng "?" xuống dòng "Đã ly hôn năm 2020." → Ly hôn. Cùng hướng với mục ACCEPTED 01/11: câu sau chỉ hỏi lại không bỏ đề xuất của câu trước ("KH đã kết hôn. Phải không?" → Đã kết hôn).
2. **Ngoại lệ Số con của `endedBy`**: thêm hai ca ở bảng luật 3 ("KH đã kết hôn, có 2 con nhưng đều đã mất." → Đã kết hôn + Số con 0; "KH đã kết hôn, có 2 con, 1 con đã mất." → Đã kết hôn + Số con 1). Hai ca xanh ngay với code hiện có (chúng ghim đột biến). Thử đột biến: chỉ cụm `maritalStatus` được che (`covered`) → hai ca mới đỏ, cùng các ca luật 3 khác mà đột biến rộng này chạm.
3. **§10** (`docs/design/phase-5-ai.md`): danh sách số con ở đầu mục Mock thêm "đều đã mất / qua đời"; câu "Hiện KH chưa được mang qua…" thay bằng luật mới (vế không có chữ cái trong suốt, cả "?" đứng riêng; bỏ dấu đầu dòng trước khi xét) với các ví dụ của quyết định Owner.
4. **Gỡ chép** (`packages/ai/src/mock-extraction.ts`):
   - `DIVORCE` / `SEPARATION` / `WIDOWED` (cùng chú thích) lên trước `NAMES_NO_ONE`; `NAMES_NO_ONE` dùng `(?:${WIDOWED})`.
   - Hằng `CHILD_WORD` (`con|bé`) dùng ở `COUNT`, `DEAD_CHILDREN`, `CHILD` (nay dựng bằng `new RegExp`), mẫu số con, và cả `PEOPLE`: chỗ thứ năm, để "bé" như "con" ở luật người khác (rule 4) theo cùng một hằng.
   - Mỗi chỗ chèn hai hằng này bọc `(?:…)`, cả `maritalWord` của Góa, để thêm một cách viết có `|` không đổi nghĩa mẫu.
5. **dependency-cruiser** (`.dependency-cruiser.cjs`):
   - `exclude` chỉ bỏ thư mục build của repo: `^((apps|packages)/[^/]+/(dist|coverage)|apps/[^/]+/src-tauri)/` (`lint:deps` chỉ duyệt `apps packages`; `coverage/` theo package vẫn bị loại như trước).
   - Rule `ai-only-on-domain-and-zod` miễn `(\.test|test-support)\.ts$`, `comment` của rule nêu thêm. Trước khi sửa, lệnh tái hiện của sổ ra đúng 1 lỗi, ở cạnh `packages/ai/src/test-support.ts → vitest`.
   - Rule mới `ai-test-support-only-in-tests`: file không phải test của `packages/ai` không import `src/test-support.ts`, để chỗ miễn trên không mở đường cho code sản phẩm kéo `vitest` qua file đó.
6. **"File hay tìm" của `packages/ai/CLAUDE.md`**: dòng Mock nêu `mockAnalysisOutput` / `mockDiscoveryOutput` ở `schema.ts`, `mockExtractionOutput` ở `mock-extraction.ts`.
   - File đã sát trần 8 000 ký tự của `tools/codemap.mjs` (còn 4 ký tự). Vượt trần thì `pnpm codemap` đổi bản đồ export sang dạng chỉ tên file (đã thấy ở lần `pnpm verify` đầu).
   - Để giữ bản đồ đầy đủ, mục này gọn ba chỗ trùng: bỏ "(giao diện)" sau `src/adapter.ts`; bỏ "kiểu `AnalysisInput` suy từ nó" (khối codemap có `type AnalysisInput` cạnh `analysisInputSchema`); câu V7 ở dòng schema rút thành "Field / value / quote trích xuất: V7.". File còn 7 999 ký tự; khối codemap không đổi.
7. **Sổ quyết định** (`docs/PROJECT-STATE.md`): ý 1 của quyết định 01/11 của T-330 đọc "and the phrase comes right after a plain statement about the customer (as in rule 1)"; thêm mục 2026-11-02 cho quyết định Owner ở Bối cảnh #950, kèm các mặc định ở mục 1.

Cỡ: 127 dòng tổng diff (88 thêm, 39 bớt): code sản phẩm 78 (`mock-extraction.ts` 63, `.dependency-cruiser.cjs` 15), test 32, tài liệu 17.

**Sau `REVIEW: CHANGES` @`21ee2a8`** ([comment](https://github.com/AlexH-AI/Project-2C/pull/956#issuecomment-6579769775)), commit `bab8ba6`:
- [chặn] vế chỉ có "?" chặn việc mang KH, trái chữ quyết định Owner 02/11: đồng ý, sửa theo đúng chữ. Bỏ `IN_THE_WAY`; `carried` thử `\p{L}` như `worded`. Ca "KH đã kết hôn." xuống dòng "?" xuống dòng "Đã ly hôn năm 2020." nay ra Ly hôn; câu "Trừ vế có dấu "?"…" bỏ khỏi §10 (thêm "cả "?" đứng riêng" vào ví dụ), câu tương ứng ở mục quyết định 02/11 của `docs/PROJECT-STATE.md` sửa theo. Hai mục không chặn về "?" (chép dấu nghi, NIT sổ) hết nghĩa.
- [không chặn] rule cho `test-support`: thêm `ai-test-support-only-in-tests` (mục 5). Thử tay ở dưới.
- [không chặn] NIT `exclude`: dùng mẫu reviewer đề xuất (mục 5).
- [không chặn] test thời gian 50 ms chập chờn trên CI: để lại, ngoài phạm vi Issue.

Hiệu năng (DR6-79): phép thử chữ cái chạy trên phần ghi chú giữa hai vế đọc liền nhau, các phần này không chồng nhau, nên cả ghi chú vẫn một lượt. Bảng "36 000 ký tự … under 50 ms" thêm hai ca: KH mang qua 36 000 dấu "."; KH mang qua dấu đầu dòng sau dấu phẩy. Đo `HEAD` so với nhánh này (node, tốt nhất 15 lần): 36 000 dấu "." rồi "KH độc thân" 4,4 → 4,5 ms; 3 000 dòng "đã kết hôn." 9,1 → 10,5 ms; 2 700 dòng "- Đã kết hôn" 8,3 → 10,1 ms. Một lần `pnpm verify` (cả repo, có coverage) ca "36 000 dấu "." rồi KH độc thân" đo 59 ms; chạy riêng và hai lần `pnpm verify` sau đều xanh, và với ghi chú đó nhánh mới không chạy (`last` chưa có), nên coi là do máy bận.

##### Ca có sẵn đổi kết quả

Chỉ ba ca ghim ∅ ở bảng luật 1, nay Ly hôn: "KH đã kết hôn." xuống dòng "Đã ly hôn năm 2020."; "KH đã kết hôn", dòng trống, "Đã ly hôn năm 2020."; "- KH đã kết hôn" xuống dòng "- Đã ly hôn năm 2020.". Mọi ca có sẵn khác của `packages/ai` giữ kết quả: cả bộ test của package xanh mà không sửa kỳ vọng nào khác.

##### e2e và seed

Không đổi. Ghi chú KYC của seed ghép các dòng bằng "; " trên một dòng (`kycSimulation` ở `packages/db/src/seed.ts`), không có dấu đầu dòng hay khúc không chữ giữa hai vế; ghi chú của bốn file e2e cũng vậy. Không sửa e2e; CI chạy e2e xác nhận.

#### Test chấp nhận

- [x] Quyết định Owner 02/11: "KH đã kết hôn." xuống dòng "Đã ly hôn năm 2020." → Ly hôn; "- KH đã kết hôn" xuống dòng "- Đã ly hôn năm 2020." → Ly hôn; "KH có 2 con." xuống dòng "Một con đã mất." → Số con 1 (trích "Một con đã mất"); "KH đã kết hôn... Đã ly hôn năm 2020." → Ly hôn.
- [x] Ba ca ghim ∅ ở bảng luật 1 đổi thành Ly hôn; thêm "KH đã kết hôn!! Đã ly hôn năm 2020." → Ly hôn.
- [x] Chỉ vế không có chữ cái là trong suốt: "KH sống ở quận 7." xuống dòng "Có 2 con." và "KH sống ở quận 7.", dòng trống, "Đã kết hôn." → không đề xuất.
- [x] Bảng luật 3 thêm hai ca ngoại lệ Số con (mục 2).
- [x] "góa" khai báo một lần (`WIDOWED`, trước `NAMES_NO_ONE`, dùng lại ở đó); "con / bé" một hằng (`CHILD_WORD`) ở cả bốn chỗ (và `PEOPLE`). Ca có sẵn đổi kết quả: chỉ ba ca ở trên.
- [x] `exclude` chỉ bỏ thư mục build của repo; rule `ai-only-on-domain-and-zod` miễn `test-support`; `pnpm lint:deps` xanh. Thử tay: thêm tạm `packages/ai/src/zz-probe.ts` (`import { assert } from 'vitest'`) → `pnpm lint:deps` đỏ đúng cạnh đó (`error ai-only-on-domain-and-zod: packages/ai/src/zz-probe.ts → node_modules/.pnpm/vitest@5.0.1_…/node_modules/vitest/dist/index.d.ts`, 1 lỗi); xóa file → xanh (353 module, 1577 cạnh). Thử lại ở `bab8ba6` với `exclude` mới: vẫn đỏ đúng cạnh đó. Rule mới: file thử `import { ZWSP } from './test-support'` → `error ai-test-support-only-in-tests: packages/ai/src/zz-probe.ts → packages/ai/src/test-support.ts`; xóa file → xanh.
- [x] "File hay tìm" nêu `mockExtractionOutput` ở `mock-extraction.ts` và nơi của `mockAnalysisOutput` / `mockDiscoveryOutput`; khối codemap khớp (`pnpm verify`).
- [x] §10 tả luật mang KH mới thay câu "Hiện KH chưa được mang qua…"; danh sách số con ở đầu mục Mock có "đều đã mất / qua đời". Mục khác của spec không đổi.
- [x] Sổ quyết định: ý 1 của quyết định 01/11 của T-330 đã sửa; có mục quyết định Owner 02/11/2026.
- [ ] e2e có đề xuất của Mock trích xuất vẫn xanh (CI): không ca nào đổi kỳ vọng; đề xuất trên ghi chú của seed không đổi.

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff` (sổ @ `f09d08d`):

- L18 `.dependency-cruiser.cjs` (`exclude` che cạnh npm phân giải vào `dist/`): đã sửa (mục 5).
- L19 `packages/ai/CLAUDE.md` ("File hay tìm" chưa nêu file trích xuất của Mock): đã sửa (mục 6).
- L21 `packages/ai/src/mock-extraction.ts`, `docs/design/phase-5-ai.md`, `packages/ai/src/mock-extraction.test.ts` (KH chưa được mang qua khúc không có chữ, sang vế mở bằng dấu đầu dòng): đã sửa (mục 1, 3).
- L22 `packages/ai/src/mock-extraction.test.ts` (ngoại lệ Số con của `endedBy` chưa có ca test): đã sửa (mục 2).
- L23 `docs/design/phase-5-ai.md` (NIT §10: câu giới hạn mang KH, "đều đã mất"): đã sửa (mục 3).
- L24 `packages/ai/src/mock-extraction.ts` (chép `WIDOWED`, "con / bé" ở bốn chỗ): đã sửa (mục 4).
- L33 `docs/PROJECT-STATE.md` (NIT "follows" ở quyết định 01/11 của T-330): đã sửa (mục 7).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low` (review lên mức high vì chạm `packages/ai`; pipeline `auto-issues` merge mọi mức, ADR-0001 phụ lục M11).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-336 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #937, #939, #948 — T-336 (#950, PR #956, `REVIEW: PASS` @`bab8ba6`):
  - #937, `.dependency-cruiser.cjs` (`exclude`): chỉ loại thư mục build của repo, `^((apps|packages)/[^/]+/(dist|coverage)|apps/[^/]+/src-tauri)/`, nên module npm trong `dist/` có trong đồ thị. Rule `ai-only-on-domain-and-zod` miễn `(\.test|test-support)\.ts$`; rule mới `ai-test-support-only-in-tests` cấm file không phải test của package ai import file hỗ trợ test. Review #956: bỏ phần miễn thì `pnpm lint:deps` ra đúng 1 lỗi, ở cạnh tới `vitest` của file hỗ trợ test.
  - #937 NIT, `packages/ai/CLAUDE.md` ("File hay tìm"): dòng Mock nêu `mockAnalysisOutput` / `mockDiscoveryOutput` ở `schema.ts`, `mockExtractionOutput` ở `mock-extraction.ts`. Ba chỗ trùng với khối codemap viết gọn lại, để file giữ dưới trần 8 000 ký tự của `tools/codemap.mjs` (7 999) và khối codemap giữ dạng đầy đủ.
  - #939, `packages/ai/src/mock-extraction.ts` (`carried`, Correctness 3 của vòng @`aa1d257`), `docs/design/phase-5-ai.md` (§10): theo quyết định Owner 02/11/2026 trên #950, khi xét vế ngay trước, vế không có chữ cái là trong suốt (dấu kết câu rồi xuống dòng, dòng trống, "...", "!!", cả "?" đứng riêng và số thứ tự "2."); vế được mang KH sang bỏ `BULLET` trước khi xét, và chữ nối ngay sau dấu đầu dòng mang KH đi tiếp. Ba ca ghim ∅ ở bảng luật 1 của `packages/ai/src/mock-extraction.test.ts` nay ra Ly hôn; §10 thay câu "Hiện KH chưa được mang qua…" bằng luật mới.
  - #939, `packages/ai/src/mock-extraction.test.ts` (bảng luật 3): thêm "KH đã kết hôn, có 2 con nhưng đều đã mất." → Đã kết hôn, Số con 0 và "KH đã kết hôn, có 2 con, 1 con đã mất." → Đã kết hôn, Số con 1. Đột biến "chỉ cụm Hôn nhân được che" làm cả hai ra ∅.
  - #939 NIT, `docs/design/phase-5-ai.md` (§10): danh sách số con ở đầu mục Mock có "đều đã mất / qua đời"; luật mang KH mới nêu các khúc không có chữ bằng "vd.".
  - #939 (*Duplicated Code*), `packages/ai/src/mock-extraction.ts`: `DIVORCE`, `SEPARATION`, `WIDOWED` khai báo trước `NAMES_NO_ONE`, nơi dùng lại `WIDOWED`; hằng `CHILD_WORD` (`con|bé`) dùng ở `COUNT`, `DEAD_CHILDREN`, `CHILD`, mẫu số con và `PEOPLE`.
  - #948 NIT, `docs/PROJECT-STATE.md` (quyết định 01/11 của T-330, ý 1): "and the phrase comes right after a plain statement about the customer (as in rule 1)". Sổ quyết định thêm mục quyết định Owner 02/11/2026 của #950, kèm các chỗ Claude tự chọn.

---

# Issue #951 — T-337: Mục sổ G7: UI — ô Giờ có ký tự vô hình, dáng nút aria-disabled ở Button, e2e tiêu đề team cạnh tên TL dài

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Sửa ba mục sổ OPEN ở màn của app (review #946 ×2, #941 ×1). Với dữ liệu thường, giao diện không đổi.

1. **Ô Giờ đọc được giờ có ký tự vô hình dính vào (review #946).** `parseTime` chỉ đọc qua `normalizeText` khi hỏi "trống"; giờ vẫn khớp `hh:mm` trên `text.trim()`.
   - Một giờ dán vào có ký tự vô hình (U+200B trước `14:00`, hay U+2060 giữa giờ và phút; ô chỉ hiện `14:00`) vì thế báo lỗi giờ và chặn lưu. Lỗi có ở cả bốn ô đọc qua `parseTime`: 6b, giờ hẹn tiếp của 6c, giờ của lịch ở Sửa kết quả, 6e.
   - Ô Ngày cùng hộp đọc chữ đã `normalizeText` (`parseQuickDate`), nên U+200B rồi `15/9` đọc được.
   - Sửa: khớp regex trên `normalizeText(text)`, như `parseQuickDate`. Cùng họ DR6-150.
2. **Một chỗ cho dáng nút tắt bằng `aria-disabled` (review #946).** Nút "Chọn file…" của Backup chép nguyên chuỗi class `aria-disabled:cursor-default aria-disabled:opacity-50` của `ConfirmButton`, còn cặp `disabled:` tương ứng nằm trong class nền của `Button`. Lần đổi dáng nút tắt sau mà chỉ sửa `Button` thì nút tắt bằng `aria-disabled` lệch nút `disabled`. Thêm cặp `aria-disabled:` vào class nền của `Button`; hai chỗ gọi bỏ `className`.
3. **e2e tiêu đề team cạnh tên TL dài (review #941).** Ca "a TL of 160 letters keeps Đổi tên team and Xóa team in the card of the team" chỉ ghim hai nút nằm trong thẻ. Chiều ngược lại chưa có kiểm: tiêu đề "Team Bình Minh" bị bóp từng chữ cạnh tên TL dài thì ca này vẫn xanh. Thêm kiểm tiêu đề một dòng ở mỗi bề rộng, như ca team 160 chữ kiểm tên TL.

##### Bối cảnh

- G7 Phase 6. Owner 02/11/2026 duyệt gom 18 mục [G7] của sổ: ba Issue T-336…T-338, một mục ACCEPTED, một mục giữ [G7] (Owner 23/10: sửa hết trước v1.0).
- Mục 1: T-332 (#933, PR #946) cho ô Giờ chỉ có ký tự vô hình đọc như trống; hợp đồng của #933 để "chuỗi khác đọc như nay". Issue này mở cho giờ có ký tự vô hình.
- Mục 2: nút tắt bằng `aria-disabled` để giữ focus (DR6-154; review PR #924, PR #946).
- Mục 3: T-331 (#932, PR #941). Ghi chú cùng review về dấu "·" ở hàng tiêu đề thẻ team (khi chỉ tên TL dài) Owner 02/11/2026 chọn không sửa (ACCEPTED), nên Issue không đổi bố cục thẻ team. Ca mới đỏ trên code hiện tại (tiêu đề bị bóp) là lỗi thật nằm ngoài file Issue cho sửa: dừng và hỏi Owner.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: các mục [T-337] (nhóm review PR #941, #946)
- `apps/desktop/src/routes/appointments/appointment-form.ts` (`parseTime`), `apps/desktop/src/routes/appointments/appointment-form.test.ts`
- `packages/domain/src/text.ts` (`normalizeText`), `packages/domain/src/period.ts` (`parseQuickDate`), chỉ đọc
- `packages/ui/src/components/Button.tsx`; `apps/desktop/src/routes/ConfirmWordDialog.tsx` (`ConfirmButton`); `apps/desktop/src/routes/SettingsBackup.tsx` (nút "Chọn file…")
- `apps/desktop/src/ui-choices.test.tsx` (mẫu test markup của component `@p2c/ui`)
- `e2e/long-names.spec.ts` (`lineTops`; hai ca tên team / tên TL 160 chữ)
- Comment review của PR #941 và PR #946

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/appointments/appointment-form.ts`, `apps/desktop/src/routes/appointments/appointment-form.test.ts`
- `packages/ui/src/components/Button.tsx`
- `apps/desktop/src/routes/SettingsBackup.tsx`, `apps/desktop/src/routes/ConfirmWordDialog.tsx`
- `apps/desktop/src/ui-button.test.tsx` (mới, nếu kiểm bằng test markup)
- `e2e/long-names.spec.ts`

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với các đường dẫn trên (sổ @ `0a72770`; nhãn theo PR gắn nhãn sổ ngày 02/11):

- **Gộp** ba mục [T-337]: `parseTime` với ký tự vô hình, chuỗi class `aria-disabled:` chép ở hai nút (review #946); e2e tiêu đề team cạnh tên TL dài (review #941).
- Không có mục nào để lại.

##### Interface / hợp đồng

- `parseTime(text)` giữ chữ ký; chuỗi không có ký tự vô hình đọc như nay.
- Props của `Button` không đổi; nút không có `aria-disabled` giữ nguyên dáng.

##### Test chấp nhận

- [ ] Unit test `parseTime`: U+200B rồi `14:00` → giờ `14:00`; `14`, U+2060, `:00` → `14:00`; ký tự vô hình quanh `9:05` → `09:05`. Ca có sẵn giữ kết quả (trống → không giờ; `24:00`, `12:60` → lỗi).
- [ ] `Button` có cặp `aria-disabled:cursor-default aria-disabled:opacity-50` trong class nền, cạnh cặp `disabled:`. Test markup: nút có `aria-disabled` mang hai class đó.
- [ ] `ConfirmButton` và nút "Chọn file…" không còn truyền `className`; code của app không còn chuỗi `aria-disabled:` nào. e2e có sẵn của các hộp 10a, 10b, 10c, 11i xanh.
- [ ] e2e: ca TL 160 chữ kiểm thêm tiêu đề "Team Bình Minh" một dòng (`lineTops` độ dài 1) ở mỗi bề rộng của `WIDTHS`.

Ước lượng: ~50 dòng tổng diff (code sản phẩm ~10, test ~40).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #958 — fix(ui): time read past invisible characters, one look for aria-disabled buttons, team title e2e (T-337)

Trạng thái: MERGED · merge 2026-11-02T16:00:15Z · commit `2cc44642a8e4fcb4f7498169261ed1b2c14826a9` · nhánh `task/T-337-invisible-time-aria-disabled-team-title` · nhãn: risk:low

Closes #951

Phiên code: coding-ses1 (auto-issues)

#### Thay đổi

- **Ô Giờ đọc giờ có ký tự vô hình** (`apps/desktop/src/routes/appointments/appointment-form.ts`): `parseTime` khớp `hh:mm` trên `normalizeText(text)` (như `parseQuickDate` đọc ngày), không còn trên `text.trim()`. Bốn ô đọc qua `parseTime` (6b, giờ hẹn tiếp của 6c, giờ của lịch ở Sửa kết quả, 6e) nay đọc U+200B rồi `14:00` là `14:00`. Hợp đồng giữ: với chuỗi không có ký tự vô hình, `normalizeText` chỉ thêm trim, gộp khoảng trắng và NFC; không bước nào biến một chuỗi không khớp `^\d{1,2}:\d{2}$` thành khớp (regex không nhận khoảng trắng; NFC không đổi chữ số hay dấu `:`), nên chuỗi thường đọc như nay.
- **Một chỗ cho dáng nút tắt bằng `aria-disabled`** (`packages/ui/src/components/Button.tsx`): class nền của `Button` thêm cặp `aria-disabled:cursor-default aria-disabled:opacity-50` cạnh cặp `disabled:`. `ConfirmButton` (`ConfirmWordDialog.tsx`) và nút "Chọn file…" (`SettingsBackup.tsx`) bỏ `className`; code của app không còn chuỗi `aria-disabled:` nào. Chỉ hai nút này mang `aria-disabled`, nên nút khác giữ nguyên dáng. Bản build web (`apps/desktop/dist/assets/*.css`) có đủ hai luật `[aria-disabled=true]` (Tailwind quét `packages/ui`).
- **e2e tiêu đề team cạnh tên TL dài** (`e2e/long-names.spec.ts`): ca "a TL of 160 letters keeps Đổi tên team and Xóa team in the card of the team" kiểm thêm `lineTops(card, 'Team Bình Minh')` có độ dài 1 ở mỗi bề rộng của `WIDTHS`. Ca xanh trên bố cục hiện tại (không đổi bố cục thẻ team).

Không nhãn `build-exe`: PR không chạm `src-tauri/**`, Cargo, `rust-toolchain.toml`, `package.json`, `pnpm-lock.yaml`, `vite.config.*` hay `tauri.conf.json`.

#### Test chấp nhận

- [x] Unit test `parseTime`: U+200B rồi `14:00` → `14:00`; `14`, U+2060, `:00` → `14:00`; ký tự vô hình quanh `9:05` → `09:05`. Ca có sẵn giữ kết quả (trống → không giờ; `24:00`, `12:60` → lỗi), thêm U+200B rồi `24:00` → lỗi.
- [x] `Button` có cặp `aria-disabled:cursor-default aria-disabled:opacity-50` trong class nền, cạnh cặp `disabled:`. Test markup `apps/desktop/src/ui-button.test.tsx`: nút có `aria-disabled` mang hai class đó.
- [x] `ConfirmButton` và nút "Chọn file…" không còn truyền `className`; `grep "aria-disabled:"` trong code của app: không còn. e2e có sẵn của các hộp 10a, 10b, 10c, 11i xanh (`backup`, `demo-data`, `trash`, `dialog-keyboard`: chạy local, 43 ca xanh cùng `long-names`).
- [x] e2e: ca TL 160 chữ kiểm thêm tiêu đề "Team Bình Minh" một dòng ở mỗi bề rộng của `WIDTHS`.

#### Ghi chú OPEN liên quan

- L18 `e2e/long-names.spec.ts` [T-337 #951] (ca TL 160 chữ chỉ ghim hai nút, PR #941): đã sửa — thêm kiểm tiêu đề "Team Bình Minh" một dòng ở mỗi bề rộng.
- L22 `apps/desktop/src/routes/appointments/appointment-form.ts` [T-337 #951] (`parseTime` khớp regex trên `text.trim()`, PR #946): đã sửa — khớp trên `normalizeText(text)`, kèm ca unit.
- L23 `apps/desktop/src/routes/SettingsBackup.tsx` / `ConfirmWordDialog.tsx` / `packages/ui/src/components/Button.tsx` [T-337 #951] (chuỗi class `aria-disabled:` chép ở hai nút, PR #946): đã sửa — cặp `aria-disabled:` vào class nền của `Button`, hai chỗ gọi bỏ `className`.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-337 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #941, #946 — T-337 (#951, PR #958, `REVIEW: PASS` @`e447022`):
  - #941, `e2e/long-names.spec.ts` (ca "a TL of 160 letters keeps Đổi tên team and Xóa team in the card of the team"): ở mỗi bề rộng của `WIDTHS`, ca kiểm thêm `lineTops(card, 'Team Bình Minh')` có độ dài 1, nên tiêu đề bị bóp từng chữ cạnh tên TL dài thì ca đỏ. Ca xanh trên bố cục hiện tại; bố cục thẻ team không đổi.
  - #946, `apps/desktop/src/routes/appointments/appointment-form.ts` (`parseTime`): khớp `hh:mm` trên `normalizeText(text)`, như `parseQuickDate`, nên U+200B rồi `14:00`, hay `14`, U+2060, `:00`, đọc là `14:00` ở cả bốn ô (6b, giờ hẹn tiếp của 6c, giờ của lịch ở Sửa kết quả, 6e). Unit ở `apps/desktop/src/routes/appointments/appointment-form.test.ts`: ba ca có ký tự vô hình; U+200B rồi `24:00` vẫn lỗi.
  - #946 (*Duplicated Code*), `packages/ui/src/components/Button.tsx`: class nền của `Button` có cặp `aria-disabled:cursor-default aria-disabled:opacity-50` cạnh cặp `disabled:`; `ConfirmButton` (`apps/desktop/src/routes/ConfirmWordDialog.tsx`) và nút "Chọn file…" (`apps/desktop/src/routes/SettingsBackup.tsx`) bỏ `className`. Test markup ở `apps/desktop/src/ui-button.test.tsx`; review #958 build bản web: CSS có hai luật `[aria-disabled=true]`.

---

# Issue #952 — T-338: Mục sổ G7: pipeline auto-issues và checklist (chạm rào, Owner làm) — update-branch, chờ CI sau reopen, chạy tiếp, .claude/rules và rào, gỡ chép, hook gợi ý review nhầm

Trạng thái: CLOSED · nhãn: type:task, risk:med, status:in-progress, ready-for-agent

##### Mục tiêu

Sửa sáu mục sổ OPEN của review #944 ở pipeline `auto-issues` và checklist review, cùng lỗi hook `review-pr-hint` gợi ý review nhầm mà đợt `auto-issues` ngày 02/11 gặp (mục 7).

**Issue này chạm rào "không tự sửa" của pipeline, nên pipeline bỏ nó khỏi hàng. Owner làm theo cách thường**: phiên thường, review phiên sạch bằng `review-pr`, Owner merge. Việc này gồm cả quyết định ở mục 5.

1. **Checklist §6 (review #944, cả bốn vòng).** Dòng về bảng "Sửa cục bộ" chỉ miễn `review-pr`, trong khi README của các skill nay miễn cả `auto-issues`. Phụ lục 03/10 của ADR-0012 chỉ áp cho skill vendored, nên PR #944 không sai; nhưng đọc checklist theo chữ thì PR sửa `auto-issues` phải thêm dòng vào bảng. Sửa thành "(trừ skill 2C tự viết: `review-pr`, `auto-issues`)".
2. **`gh pr update-branch` để lại nhánh local (review #944 vòng 4).**
   - Khi `merge-pr` từ chối vì `main` có code sau bản CI đã test, §4 chạy `gh pr update-branch <N>`. Nhánh trên GitHub thêm một merge commit, còn nhánh local trong checkout chính vẫn ở head cũ, vì không phiên nào pull nó.
   - Lần merge sau, `cleanupPlan` thấy nhánh local khác head đã merge và giữ nó ("kept, check its commits"); `merge-pr` ra mã 1 ("clean-up NOT finished"), nên §4 hỏi Owner. Không làm sai: merge đã xong, chỉ còn nhánh local.
   - Chọn một cách: thay `update-branch` bằng một tin cho phiên code của PR (merge `origin/main` vào nhánh, `pnpm verify`, push), để nhánh local khớp head; hoặc ghi ở §4 rằng báo dọn này là dự kiến, và phiên điều phối làm gì khi gặp.
3. **Chờ CI sau `reopen` không đoán giờ (review #944 vòng 1, 3).** `sleep --timeout 1` rồi `ci` là đoán thời gian: GitHub tạo workflow run mới chậm hơn một phút thì `ci` đọc các check cũ đã xong và báo xong. Không merge sai, vì `mergeBlockers` vẫn chặn, nhưng thêm một lần `merge-pr` từ chối. Cho `ci` chờ một workflow run tạo sau lúc `reopen` (vd. một cờ nhận mốc thời gian), thay lần ngủ cố định.
4. **Chạy tiếp khi checkout chính còn ở nhánh của PR (review #944 vòng 3).**
   - §7 coi `/goal` gõ lại sau dòng kết thúc là đợt mới, đi từ §1. Kiểm đầu của §1 đòi checkout chính sạch và ở `main`, nhưng checkout chính còn ở nhánh task của PR tới lúc `merge-pr` dọn, nên kiểm đầu in dòng dừng. Pipeline dừng an toàn, không làm sai.
   - Chọn một cách: kiểm đầu nhận checkout chính ở nhánh PR của Issue đang làm, và brief §3.3 / §3.4 bảo phiên code về nhánh đó; hoặc ghi ở bước 5 của "Owner chạy thế nào" bước tay đưa checkout về `main`.
5. **`.claude/rules/*.md` và rào (review #944 vòng 4): Owner quyết.** Rào định nghĩa cổng review là "những gì phiên review chạy hay đọc làm luật", nhưng danh sách không có các file luật này, mà Claude Code tự nạp khi phiên đọc file khớp `paths:` của chúng (vd. luật golden: không sửa "cho xanh", đổi qua G2). Owner đã duyệt danh sách rào hai lần (02/11), nên đây chỉ là chỗ lệch giữa định nghĩa và danh sách. Owner chọn: thêm `.claude/rules/*.md` vào rào (đầu skill và bản chép ở §3.0); hoặc ghi ở đầu skill vì sao để ngoài. Quyết định ghi vào sổ quyết định.
6. **Gỡ chép điều kiện "chưa có check nào" (review #944 vòng 4).** `pass + fail + pending === 0` viết ở cả `readPr` lẫn `ciState`, và hai chỗ phải đổi cùng nhau: nếu `ciState` xét docs-only ở nhánh khác, `readPr` vẫn trả `files: []` ở đó, và PR chỉ sửa docs chờ tới hết giờ thay vì xong ngay. Truyền vào `ciState` một hàm đọc file lười (`files: () => loadPrFiles(n)`), như `runs`, và bỏ điều kiện ở `readPr`.
7. **Hook `review-pr-hint` gợi ý review nhầm (đợt `auto-issues` 02/11; bằng chứng và cách sửa đã thử ở [comment đề xuất](https://github.com/AlexH-AI/Project-2C/issues/952#issuecomment-6575395196)).**
   - Phiên điều phối nhận 10 gợi ý `Owner asked to review PR #<số>…`, cả 10 ở lượt do app tạo. Nguồn: báo cáo phiên con và ghi chú `Linked sessions now` (cả hai trong `<system-reminder>`), `<task-notification>` của lệnh chờ. Luật `[auto-issues]` của `reviewedPr` chỉ áp cho brief gửi tới phiên con, nên các tin này lọt qua.
   - Ghi chú `Linked sessions now` còn làm hook nêu sai số: trong `(done, PR #946); review-1 = …`, tên phiên `review-1` đứng sát PR của phiên code, nên cả năm lần hook đều báo #946.
   - Sửa trong `reviewedPr`: bỏ các khối `<system-reminder>`, `<task-notification>`, `<side-sessions-event>` (mỗi khối tính tới thẻ đóng của nó) trước khi dò. Giữ khối `<cross-session-message>`, vì brief §3.2 tới phiên review theo cách đó. Hook `.claude/hooks/review-pr-hint.mjs` không đổi.

##### Bối cảnh

- G7 Phase 6. Owner 02/11/2026 duyệt gom 18 mục [G7] của sổ: ba Issue T-336…T-338, một mục ACCEPTED, một mục giữ [G7] (Owner 23/10: sửa hết trước v1.0).
- **Chạm rào "không tự sửa"** (đầu skill `auto-issues`; ADR-0001 phụ lục M11): skill `auto-issues`, `tools/auto-wait*`, checklist review, hook gợi ý review (`tools/review-hint-core*`). Pipeline bỏ Issue này khỏi hàng (§1). Owner làm theo cách thường, gồm việc quyết `.claude/rules/*.md` có vào rào không (mục 5).
- Làm lúc pipeline không chạy: Issue sửa chính skill, lệnh chờ mà phiên điều phối dùng và hook gợi ý review.
- Pipeline: T-335 (#942, PR #944). Mục 2 và 4 có hai cách sửa; PR ghi cách chọn và lý do.
- README của các skill đã miễn `auto-issues` khỏi bảng "Sửa cục bộ", nên Issue không thêm dòng vào bảng đó.
- Mục 5 ghi quyết định vào sổ quyết định, file mà T-336 cũng sửa ở chỗ khác; hai Issue không chặn nhau.
- Mục 7 không từ sổ: phiên điều phối thấy ở đợt `auto-issues` ngày 02/11 (#933, #935). Owner 02/11 duyệt gộp vào Issue này.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: các mục [T-338] (nhóm review PR #944)
- `.claude/skills/auto-issues/SKILL.md`: đầu skill (rào), "Owner chạy thế nào" bước 5, §1 (kiểm đầu), §3.0 (bản chép rào), §3.3, §3.4, §4 (`merge-pr` từ chối), §7
- `tools/auto-wait.mjs` (`readPr`, `runsOf`), `tools/auto-wait-core.mjs` (`ciState`, `prFiles`, `checkCounts`), `tools/auto-wait-core.test.mjs`
- `tools/review-hint-core.mjs` (`reviewedPr`), `tools/review-hint-core.test.mjs`; `.claude/hooks/review-pr-hint.mjs`, chỉ đọc
- `tools/pr-core.mjs` (`cleanupPlan`, `mergeBlockers`), chỉ đọc
- `docs/process/REVIEW-CHECKLIST.md` §6; `.claude/skills/README.md` (bảng "Sửa cục bộ"), chỉ đọc
- `.claude/rules/*.md` (phần `paths:`), chỉ đọc
- ADR-0001 phụ lục M11: `docs/decisions/0001-mo-hinh-thuc-hien-chi-claude-code.md`
- Comment review của PR #944 (bốn vòng)
- Comment đề xuất mục 7 trên Issue này (bảng nguồn, cách sửa đã thử trên prompt thật)

##### File / thư mục được phép sửa

- `.claude/skills/auto-issues/SKILL.md`
- `tools/auto-wait.mjs`, `tools/auto-wait-core.mjs`, `tools/auto-wait-core.test.mjs`
- `tools/review-hint-core.mjs`, `tools/review-hint-core.test.mjs`
- `docs/process/REVIEW-CHECKLIST.md` (chỉ §6)
- `docs/PROJECT-STATE.md` (chỉ để ghi quyết định Owner của mục 5)

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với các đường dẫn trên (sổ @ `0a72770`; nhãn theo PR gắn nhãn sổ ngày 02/11):

- **Gộp** sáu mục [T-338] của review #944: checklist §6, `update-branch`, chờ CI sau `reopen`, chạy tiếp khi checkout chính ở nhánh PR, `.claude/rules/*.md` và rào, điều kiện "chưa có check nào".
- **Để lại:** NIT chữ "follows" ở quyết định 01/11 của T-330 (review #948), thuộc T-336 (khớp vì cùng sổ quyết định).
- Hai file của mục 7 (`tools/review-hint-core.mjs`, `tools/review-hint-core.test.mjs`): không có mục OPEN (sổ @ `2e3dcc0`).

##### Interface / hợp đồng

- `node tools/auto-wait.mjs ci <N>` giữ cách dùng có sẵn; cờ mới (nếu có) chỉ thêm.
- Mã thoát và dòng in của `auto-wait` giữ như nay ở các ca có sẵn.
- `reviewedPr(prompt)` giữ chữ ký; câu gợi ý của hook giữ như nay.

##### Test chấp nhận

- [ ] Checklist §6: dòng "Sửa cục bộ" miễn cả `review-pr` lẫn `auto-issues` ("trừ skill 2C tự viết").
- [ ] Sau khi `merge-pr` từ chối vì `main` có code sau bản CI đã test, lần merge sau không còn báo "clean-up NOT finished" vì nhánh local; hoặc §4 ghi báo đó là dự kiến, kèm bước của phiên điều phối khi gặp. PR ghi cách chọn.
- [ ] `ci` chờ được workflow run tạo sau một mốc. Unit test: chỉ có run tạo trước mốc (đã xong) → chưa xong; có run tạo sau mốc và mọi check xong → xong. §4 dùng cách này sau `reopen`, không còn `sleep --timeout 1`.
- [ ] `/goal` gõ lại khi pipeline dừng giữa một PR (checkout chính ở nhánh của PR) không dừng ở kiểm đầu; hoặc bước 5 của "Owner chạy thế nào" ghi bước tay đưa checkout về `main`. PR ghi cách chọn.
- [ ] Rào theo quyết định Owner: `.claude/rules/*.md` có trong rào, ở đầu skill và ở bản chép §3.0; hoặc đầu skill ghi vì sao để ngoài. Quyết định có ở sổ quyết định.
- [ ] Điều kiện "chưa có check nào" chỉ còn ở `ciState`; `readPr` không đọc file. Unit test: PR docs-only chưa có check → xong ngay; PR code chưa có check → chờ; `files()` không được gọi khi đã có check.
- [ ] Mọi test có sẵn của `auto-wait` xanh.
- [ ] `reviewedPr` ra `null` cho prompt do app tạo: báo cáo phiên con trong `<system-reminder>` (`REVIEW: PASS cho PR #<n>`), ghi chú `Linked sessions now` (`(done, PR #<n>); review-1 = …`), `<task-notification>` có mô tả `… REVIEW on PR <n>'s head`.
- [ ] Brief §3.2 trong `<cross-session-message>`, đứng sau ghi chú `Linked sessions now`, ra đúng số của dòng `review PR #<n>`. Chữ Owner gõ sau một khối `<system-reminder>` vẫn ra số PR. Mọi test có sẵn của `review-hint-core` xanh.

Ước lượng: ~200–240 dòng tổng diff (code công cụ ~50–80, test ~90–120, skill và checklist ~20–40; mục 7 thêm ~10 dòng code và ~40 dòng test).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med (như T-335 #942; Owner review và merge theo cách thường)

##### Bị chặn bởi

Không

## PR #954 — fix(tools): auto-issues waits for the reopened run, keeps the local branch, skips app blocks in the review hint (T-338)

Trạng thái: MERGED · merge 2026-11-02T13:06:41Z · commit `3665328f0e8888aa460b0c06958beae5225eb2ad` · nhánh `task/T-338-auto-issues-fence-fixes` · nhãn: type:task, risk:med

Closes #952

Issue chạm rào "không tự sửa" của pipeline `auto-issues`, nên làm ngoài pipeline (phiên thường). Owner review và merge theo cách thường; phiên này không merge.

#### Thay đổi

1. **Checklist §6** (`docs/process/REVIEW-CHECKLIST.md`): dòng bảng "Sửa cục bộ" miễn "(trừ skill 2C tự viết: `review-pr`, `auto-issues`)".
2. **`main` đi trước bản CI đã test** (skill §4, brief mới §3.8). Chọn cách thứ nhất của Issue: phiên điều phối không chạy `gh pr update-branch` nữa mà gửi §3.8 cho phiên code của PR (`gh pr checkout <N>`, `git fetch origin`, `git merge --no-edit origin/main`, `pnpm verify`, push). Lệnh chờ: `ci <N> --not <H>`; head đổi nên bảng §2 tự ra bước chờ CI rồi review lại, không cần hàng mới.
   - Lý do: nhánh local khớp head trên GitHub, nên `merge-pr` dọn được nhánh như mọi lần. Cách thứ hai (ghi báo dọn là dự kiến) để lại nhánh local cũ và một bước tay mỗi lần gặp. Thêm nữa, `pnpm verify` chạy trên bản đã gộp `main`, xung đột (nếu có) do phiên code giải; `update-branch` thì thất bại khi có xung đột.
   - §3.8 đặt cuối mục 3 để không đánh lại số §3.5–§3.7 mà §2 và §6 đang dẫn.
   - Hàng merge của bảng §2 nay chỉ "làm tiếp nhịp ngay" khi merge xong. `merge-pr` từ chối thì phiên điều phối làm theo §4, đặt lệnh chờ §4 nêu rồi kết thúc nhịp. Với `update-branch`, head đổi ngay trên GitHub nên đọc lại ngay là đúng. Với §3.8, head chỉ đổi khi phiên code push; còn PR mở lại thì vẫn giữ check cũ đã xong. Đọc lại ngay sẽ ra hàng merge lần nữa: gửi §3.8 hai lần, hoặc đóng / mở lại PR lặp lại.
3. **Chờ CI sau `reopen`** (`tools/auto-wait*`, skill §4): thêm cờ `ci <N> --since <time>`, chỉ cho `ci`. Có cờ thì `ciState` chỉ xong khi head có một workflow run tạo từ mốc đó trở đi (`created_at` thêm vào jq của `runsOf`), và mọi run đã xong. §4 bỏ `sleep --timeout 1`: mốc là `closedAt` của PR, đọc bằng `gh pr view <N> --json closedAt` giữa `close` và `reopen`.
   - Mốc lấy theo giờ của GitHub thay vì đồng hồ máy: giờ máy chạy nhanh hơn GitHub vài giây thì run mới bị tính là cũ, và lệnh chờ tới hết giờ.
   - `parseArgs` chỉ đặt `since` khi có cờ, nên hai test `toEqual` có sẵn của `parseArgs` giữ nguyên.
4. **Chạy tiếp khi checkout chính còn ở nhánh PR** (skill "Owner chạy thế nào" bước 5, §1, §3.3, §3.4, §3.8). Chọn cách thứ nhất: kiểm đầu nhận nhánh của một PR đang mở mà thân có dòng `Phiên code: … (auto-issues)`; ở nhánh đó chỉ `fetch`, không `pull`. Issue của PR đó lên đầu hàng. Brief §3.3, §3.4 (và §3.8) mở đầu bằng `gh pr checkout <N>`.
   - Lý do: cách thứ hai (bước tay đưa checkout về `main`) không đủ một mình. Brief §3.3 / §3.4 không nêu nhánh, nên phiên code nhận việc tiếp khi checkout đang ở `main` sẽ commit lên `main` local, rồi hook pre-push chặn push. Đằng nào brief cũng phải về nhánh của PR; có dòng đó rồi thì kiểm đầu nhận nhánh PR được, khỏi bước tay.
5. **`.claude/rules/*.md` vào rào** (quyết định Owner, [comment](https://github.com/AlexH-AI/Project-2C/issues/952#issuecomment-6575891621)). Câu hỏi: "`.claude/rules/*.md` (ci.md, i18n-ui.md, mockups.md, tests.md, Claude Code tự nạp theo `paths:`) có đưa vào rào "không tự sửa" của pipeline auto-issues không? …". Owner trả lời: **"Thêm vào rào"**. Đã thêm vào nhóm cổng review ở đầu skill và vào bản chép trong §3.0; quyết định ghi ở `docs/PROJECT-STATE.md` (2026-11-02).
6. **Gỡ chép "chưa có check nào"**: `readPr` không đọc file nữa (một lần `gh pr view`); `READS.ci` truyền `files: () => loadPrFiles(target)` vào `ciState`, như `runs`, và chỉ `ciState` xét `pass + fail + pending === 0`. Ba test có sẵn chuyển sang truyền `files` qua tùy chọn mới, hành vi giữ nguyên: `waits for the first check of a code PR`, `is done at once for a docs-only PR, which CI skips`, `does not take a PR for docs-only when not every file was read`. Helper `pr()` của test bỏ trường `files`.
7. **Hook `review-pr-hint` gợi ý nhầm** (`tools/review-hint-core.mjs`): `reviewedPr` thay mỗi khối `<system-reminder>`, `<task-notification>`, `<side-sessions-event>` (tới thẻ đóng của nó) bằng một dấu xuống dòng trước khi dò, cả trước luật `[auto-issues]`. Khối `<cross-session-message>` giữ nguyên. Hook không đổi. §3.2 của skill thêm một câu nói việc này.

Cỡ: 242 dòng tổng diff (code công cụ 95, test 106, skill và tài liệu 41).

**Sau `REVIEW: CHANGES` @`2c4f192`** ([comment](https://github.com/AlexH-AI/Project-2C/pull/954#issuecomment-6576499238)), commit `6f37a67`:
- [chặn] test chấp nhận thiếu ca "run tạo sau mốc, đã xong → xong": thêm ca run tạo `10:57:10Z` (mốc `10:56:33Z`), đúng ca thật sau `gh pr reopen`. Code đã đúng nên ca mới xanh ngay; bản đột biến `>=` → `===` nay đỏ ở test `with since, …` (đã chạy).
- [không chặn] NIT `--since` nhận ngày không có thật: sửa luôn. `parseArgs` nay đòi giờ đọc lại đúng như đã nhập (`toISOString()` so với giá trị, bỏ phần lẻ giây), nên từ chối `2026-02-30`, `2026-11-31`, `T24:00:00`. Test thêm ba ca đó và một giờ hợp lệ có phần lẻ giây.

#### Test chấp nhận

- [x] Checklist §6: dòng "Sửa cục bộ" miễn cả `review-pr` lẫn `auto-issues` ("trừ skill 2C tự viết").
- [x] Sau khi `merge-pr` từ chối vì `main` có code sau bản CI đã test, phiên code merge `origin/main` và push (§3.8), nên nhánh local khớp head và lần merge sau không báo "clean-up NOT finished" vì nhánh local. Cách chọn ghi ở trên (mục 2).
- [x] `ci` chờ được workflow run tạo sau một mốc (`--since`). Unit test `with since, waits for a workflow run made at or after it`: chỉ có run tạo trước mốc (đã xong) → chưa xong; có run tạo sau mốc (và một run tạo đúng mốc) đã xong, mọi check xong → xong; run sau mốc còn chạy → chưa xong. §4 dùng cách này sau `reopen`, không còn `sleep --timeout 1`. `parseArgs` từ chối giờ sai dạng, giờ không phải UTC, ngày / giờ không có thật, `review --since`, `sleep --since`.
- [x] `/goal` gõ lại khi pipeline dừng giữa một PR không dừng ở kiểm đầu (§1 nhận nhánh PR của pipeline; brief §3.3 / §3.4 về nhánh đó). Cách chọn ghi ở trên (mục 4).
- [x] `.claude/rules/*.md` có trong rào, ở đầu skill và ở bản chép §3.0; quyết định có ở `docs/PROJECT-STATE.md`.
- [x] Điều kiện "chưa có check nào" chỉ còn ở `ciState`; `readPr` không đọc file. Unit test: PR docs-only chưa có check → xong ngay; PR code chưa có check → chờ; `files()` không được gọi khi đã có check (`reads the files only while CI has no check`).
- [x] Mọi test có sẵn của `auto-wait` xanh (ba test của `ciState` đổi cách truyền file, xem mục 6).
- [x] `reviewedPr` ra `null` cho báo cáo phiên con trong `<system-reminder>` (`REVIEW: PASS cho PR #946`, `no review.` rồi `AUTO-CHILD: [Issue #933] PR #946`), ghi chú `Linked sessions now` (`(done, PR #946); review-1 = …`), `<task-notification>` có `… REVIEW on PR 946's head`, và `<side-sessions-event>`.
- [x] Brief §3.2 trong `<cross-session-message>`, đứng sau ghi chú `Linked sessions now` (có và không có dòng trống giữa hai khối), ra 948. Chữ Owner gõ sau một khối `<system-reminder>` ra 950 (`review PR #950 giúp anh`, `review lại PR 950`). Mọi test có sẵn của `review-hint-core` xanh.

Chạy thử trên GitHub thật:
- `node tools/auto-wait.mjs ci 946 --once --since 2026-11-02T10:56:33Z` → `PR #946 is MERGED`, mã 3. `--since yesterday` và `review 946 --since …` → dòng dùng, mã 64.
- jq mới của `runsOf` trên head của #946 → `{"created_at":"2026-11-02T05:42:28Z","name":"CI","status":"completed"}`. `closedAt` cùng dạng giờ (`2026-11-02T06:08:41Z`).
- Hook với prompt chỉ có ghi chú `Linked sessions now` → không in gì. Ghi chú đó rồi `review PR #950` → gợi ý PR #950.

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff` (sổ @ `6f37a67`):

- L29 `docs/process/REVIEW-CHECKLIST.md` (§6 chỉ miễn `review-pr`): đã sửa (mục 1).
- L30 `.claude/skills/auto-issues/SKILL.md` (§4, `gh pr update-branch` để lại nhánh local): đã sửa (mục 2, §3.8).
- L31 `.claude/skills/auto-issues/SKILL.md` (§4, `sleep --timeout 1` rồi `ci`): đã sửa (mục 3, `ci --since`).
- L32 `.claude/skills/auto-issues/SKILL.md` (bước 5, §1: chạy tiếp khi checkout chính ở nhánh PR): đã sửa (mục 4).
- L33 `.claude/skills/auto-issues/SKILL.md` (rào và `.claude/rules/*.md`): đã sửa theo quyết định Owner (mục 5).
- L34 `tools/auto-wait.mjs`, `tools/auto-wait-core.mjs` (điều kiện "chưa có check nào" ở hai chỗ): đã sửa (mục 6).
- L39 `docs/PROJECT-STATE.md` (NIT "follows" ở quyết định 01/11 của T-330): để lại, thuộc T-336 (#950); Issue này chỉ cho sửa file đó để ghi quyết định mục 5.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med` (như T-335 #942; Owner review và merge theo cách thường)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-338 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #944 — T-338 (#952, PR #954, `REVIEW: PASS` @`6f37a67`):
  - #944, `docs/process/REVIEW-CHECKLIST.md` (§6): dòng bảng "Sửa cục bộ" miễn "(trừ skill 2C tự viết: `review-pr`, `auto-issues`)".
  - #944, `.claude/skills/auto-issues/SKILL.md` (§4, `main` có code sau bản CI đã test): phiên điều phối không chạy `gh pr update-branch` nữa mà gửi brief §3.8 cho phiên code của PR (`gh pr checkout <N>`, `git merge --no-edit origin/main`, `pnpm verify`, push), nên nhánh local khớp head và `merge-pr` dọn được nhánh; lệnh chờ `ci <N> --not <H>`. Hàng merge của bảng §2 kết thúc nhịp khi `merge-pr` từ chối.
  - #944, `.claude/skills/auto-issues/SKILL.md` (§4, chờ CI sau `gh pr close` + `gh pr reopen`), `tools/auto-wait-core.mjs`, `tools/auto-wait.mjs`: cờ `ci <N> --since <time>`; `ciState` chỉ xong khi head có một workflow run tạo từ mốc đó trở đi và mọi run đã xong. Mốc là `closedAt` của PR (giờ của GitHub), đọc giữa `close` và `reopen`; không còn `sleep --timeout 1`. Unit ở `tools/auto-wait-core.test.mjs`: run tạo trước, đúng và sau mốc, run còn chạy; `parseArgs` từ chối giờ sai dạng, không phải UTC, ngày / giờ không có thật.
  - #944, `.claude/skills/auto-issues/SKILL.md` ("Owner chạy thế nào" bước 5, §1): kiểm đầu nhận checkout chính ở nhánh của một PR đang mở có dòng `Phiên code: … (auto-issues)` (ở đó chỉ `fetch`), và Issue của PR đó lên đầu hàng; brief §3.3, §3.4, §3.8 mở đầu bằng `gh pr checkout <N>`.
  - #944, `.claude/skills/auto-issues/SKILL.md` (rào "không tự sửa"): Owner 02/11 chọn "Thêm vào rào" (comment `6575891621` trên #952): `.claude/rules/*.md` có trong nhóm cổng review ở đầu skill và ở bản chép §3.0; quyết định ghi ở `docs/PROJECT-STATE.md`.
  - #944, `tools/auto-wait.mjs`, `tools/auto-wait-core.mjs` (*Duplicated Code*, điều kiện "chưa có check nào"): `readPr` không đọc file nữa; `READS.ci` truyền `files: () => loadPrFiles(target)` vào `ciState`, như `runs`, và chỉ `ciState` xét `pass + fail + pending === 0`. Unit `reads the files only while CI has no check`.

---

# Issue #960 — T-339: Mục sổ G7: test Mock trích xuất và ranh giới test-support — đo thời gian bền với runner chậm, ca qua dòng của luật 1, hằng miễn chung của dependency-cruiser

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Sửa ba mục sổ OPEN của review #956: hai mục ở test Mock trích xuất, một mục ở cấu hình dependency-cruiser. Code sản phẩm và kết quả của Mock không đổi.

1. **Test thời gian của bảng ghi chú 36 000 ký tự đỏ trên runner chậm.**
   - Test ghim DR6-79, hồi quy chậm bậc hai của Mock trích xuất. Khi đó ghi chú 36 003 ký tự mất 2 042 ms; bản sửa đo 1–7 ms.
   - Test kiểm lần nhanh nhất trong 3 lần phải dưới 50 ms. Run 41454921921 @`2344d66` đỏ ở hàng có sẵn "Một con đã mất được 2 năm nay rồi." với đúng 50 ms: runner chậm, cả bộ chạy 275 s so với 158 s. Local đo 5,2 ms ở cả base lẫn head.
   - Mỗi lần đỏ như vậy tốn một commit rỗng và một vòng CI ~20 phút (`21ee2a8` của PR #956).
   - Sửa cho bền với runner chậm mà vẫn bắt được chậm bậc hai. Chọn trong task:
     - so với một phép đo chuẩn trên cùng máy, cùng lần chạy;
     - hoặc nới trần;
     - hoặc tăng số lần đo.

     PR ghi cách chọn và lý do.
2. **Ca "chỉ vế không có chữ cái là trong suốt" không ghim điều comment nói.**
   - Hai ca "Only clauses with no letter" của bảng luật 1 xanh cả khi `carried` không thử chữ cái. Câu đầu của chúng không có cụm, nên không vế nào được đọc để mang KH sang.
   - Review #956 thử đột biến `const carried = !!last?.endsOnTheKh;`: hai ca vẫn ra ∅. Ca một dòng có sẵn "KH đã kết hôn, sống ở quận 7. Có 2 con." đỏ dưới đột biến (thêm Số con 2), nên luật vẫn được ghim, nhưng không ở ca mà comment trỏ tới.
   - Thêm một ca qua dòng có câu đầu mang cụm.
3. **Phần miễn `test-support` chép ở hai rule và không neo.**
   - Rule `ai-only-on-domain-and-zod` và rule `ai-test-support-only-in-tests` (PR #956) chép cùng mẫu miễn `(\.test|test-support)\.ts$`.
   - Mẫu không neo ở đầu tên file, nên khớp mọi tên tận cùng bằng "test-support.ts", kể cả "latest-support.ts". Một file hỗ trợ thứ hai, vd. "web-test-support.ts" trong package ai, sẽ được import `vitest`. Code sản phẩm của package ai cũng import được file đó, vì rule mới chỉ chặn đúng file hỗ trợ test hiện có (`to.path`). Khi đó `pnpm lint:deps` vẫn xanh.
   - Hôm nay chưa có file như vậy. Dùng một hằng chung cho các file được miễn, neo ở `/test-support`, cho `from.pathNot` của cả hai rule và cho `to.path` của rule mới.

##### Bối cảnh

- G7 Phase 6. **Quyết định Owner 02/11/2026: "Duyệt"** đề xuất gom sổ của pipeline `auto-issues`, gồm hai Issue T-339 và T-340 đúng như bảng đề xuất (Owner 23/10: sửa hết trước v1.0). Mục còn lại của sổ:
  - ba mục [T-333] đã thuộc #934;
  - mục thêm PR #944 vào "Kích thước PR vượt ngưỡng" giữ [G7], làm ở PR chốt số đo cuối G7.
- DR6-79: hồi quy chậm bậc hai của lượt 2. Bảng tổng hợp lượt 2 ghi 18 003 ký tự 518 ms, 36 003 ký tự 2 042 ms. Bản sửa: `aboutTheKh` không quét ngược từng ký tự.
- Tiền lệ đo thời gian bền với runner chậm: test "reads a long run of spaces quickly" của `parseVnd`. Test đo khi đã chạy nóng, lấy lần nhanh nhất trong nhiều lần, và comment ghi mẫu bậc hai mất bao lâu.
- Luật mang KH qua vế không có chữ cái: quyết định Owner 02/11/2026 của T-336 (#950, PR #956).
- Rule `ai-test-support-only-in-tests` và phần miễn `test-support`: T-336 (PR #956).
- Không G2 / G5: không golden nào chạy Mock, và Issue không sửa prompt hay tài liệu G5. Không thêm dependency.
- Diff chạm `packages/ai/**` nên review lên mức high (như #950). Cả hai file nằm ngoài rào "không tự sửa", nên pipeline `auto-issues` nhận Issue này và merge mọi mức (ADR-0001 phụ lục M11).

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: các mục [T-339] (nhóm review PR #956)
- `packages/ai/src/mock-extraction.test.ts`: bảng "reads a one-line note of 36 000 characters …" (DR6-79); bảng luật 1, các ca qua dòng, hai ca "Only clauses with no letter" và ca "KH đã kết hôn, sống ở quận 7. Có 2 con."
- `packages/ai/src/mock-extraction.ts` (`clausesOf`: `carried`, `worded`, `endsOnTheKh`), chỉ đọc
- `packages/domain/src/money.test.ts` (test "reads a long run of spaces quickly", DR-38), chỉ đọc
- `.dependency-cruiser.cjs` (rule `ai-only-on-domain-and-zod`, `ai-test-support-only-in-tests`); `packages/ai/src/test-support.ts`, chỉ đọc
- `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` (dòng 19 của bảng, DR6-79), chỉ đọc
- Comment review của PR #956 (hai vòng: @`21ee2a8`, @`bab8ba6`)

##### File / thư mục được phép sửa

- `packages/ai/src/mock-extraction.test.ts`
- `.dependency-cruiser.cjs`

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với các đường dẫn trên (sổ @ `742643f`; nhãn theo PR gắn nhãn sổ ngày 02/11, lần 2):

- **Gộp** ba mục [T-339] của review #956: test thời gian của bảng 36 000 ký tự; phần miễn `test-support` chép ở hai rule và không neo; hai ca "Only clauses with no letter".
- Không có mục nào để lại.

##### Interface / hợp đồng

- Code sản phẩm không đổi. Output của Mock trích xuất không đổi.
- Rule ranh giới giữ nghĩa: package `ai` chỉ dùng `domain` + `zod`, trừ file test và file hỗ trợ test; chỉ test của package ai import file hỗ trợ test.

##### Test chấp nhận

- [ ] Test thời gian của bảng 36 000 ký tự vẫn bắt được chậm bậc hai: đưa tạm vào Mock một mẫu bậc hai (vd. quét ngược từng ký tự cho mỗi cụm khớp, như trước bản sửa DR6-79) thì test đỏ. Thử tay, ghi ở thân PR: cách đưa lại và số đo.
- [ ] Test không đỏ khi máy chậm hơn local nhiều lần: thân PR ghi trần / tỉ lệ đã chọn so với số đo local (~5 ms) và với 2 042 ms của DR6-79. Nếu dùng tỉ lệ so với phép đo chuẩn: mốc chuẩn có sàn, hoặc đo bằng `performance.now()`, vì `Date.now()` chỉ chính xác tới 1 ms.
- [ ] Mọi hàng có sẵn của bảng 36 000 ký tự giữ nguyên ghi chú (độ dài ≥ 36 000).
- [ ] Bảng luật 1 thêm ca "KH đã kết hôn.\nSống ở quận 7.\nCó 2 con." → Đã kết hôn, không Số con. Thử tay, ghi ở thân PR: đột biến `const carried = !!last?.endsOnTheKh;` làm ca này đỏ (thêm Số con 2).
- [ ] Phần miễn của hai rule là một hằng, neo ở `/test-support` (không khớp "latest-support.ts"). Hằng dùng cho `from.pathNot` của cả hai rule và cho `to.path` của rule `ai-test-support-only-in-tests`. `pnpm lint:deps` xanh.
- [ ] Thử tay, ghi ở thân PR, mỗi việc rồi gỡ:
  - một file sản phẩm tạm của package ai import một file "latest-support.ts" tạm có import `vitest` → `pnpm lint:deps` đỏ;
  - một file hỗ trợ test thứ hai, vd. "web-test-support.ts" có import `vitest`, được một file sản phẩm của package ai import → `pnpm lint:deps` đỏ;
  - bỏ phần miễn → `pnpm lint:deps` đỏ ở cạnh `test-support` → `vitest`, như review #956.
- [ ] Mọi ca có sẵn khác của Mock giữ kết quả.

Ước lượng: ~30–60 dòng tổng diff (test ~20–40, cấu hình ~10–15); 0 dòng code sản phẩm.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low (review tự lên mức high vì chạm `packages/ai`; pipeline `auto-issues` merge mọi mức, ADR-0001 phụ lục M11)

##### Bị chặn bởi

Không

## PR #963 — test(ai): time the 36 000 notes against short notes, a carried case past a worded line, one anchored test-support exemption (T-339)

Trạng thái: MERGED · merge 2026-11-02T17:10:31Z · commit `ee01e41933a64956b71822d5a000ed5960fcd2d1` · nhánh `task/T-339-mock-timing-test-support` · nhãn: risk:low

Closes #960

Phiên code: coding-ses2 (auto-issues)

#### Thay đổi

1. **Test thời gian của bảng ghi chú 36 000 ký tự (DR6-79) so với một phép đo chuẩn trên cùng máy, cùng lần chạy** (`packages/ai/src/mock-extraction.test.ts`).
   - Mỗi hàng đo xen kẽ, 3 lần, lấy lần nhanh nhất của mỗi bên: Mock đọc cùng số ký tự trong ghi chú ngắn (`shortNote`: "KH đã kết hôn, có 2 con. " + `LONG`, 4 lần, 316 ký tự; ~114 lần gọi), rồi Mock đọc ghi chú dài của hàng. Đạt khi ghi chú dài < 10 × ghi chú ngắn, ghi chú ngắn tính tối thiểu 5 ms.
   - Đo bằng `Date.now()` có sàn: `performance` không có kiểu trong package ai (`types: []`, lib ES2023; `tsc` báo `TS2304`), nên dùng sàn 5 ms cho mốc chuẩn như Issue cho phép. Sàn 5 ms × 10 = 50 ms: trần không bao giờ chặt hơn trần cũ.
   - Tên test đổi "in under 50 ms" → "in linear time"; comment ghi cách đo, run 41454921921 và số đo dưới đây. Không hàng nào của bảng đổi ghi chú; vẫn kiểm `note.length ≥ 36 000`.
2. **Bảng luật 1 thêm ca qua dòng có câu đầu mang cụm**: "KH đã kết hôn.\nSống ở quận 7.\nCó 2 con." → `[MARRIED]` (không Số con), đặt đầu nhóm "Only clauses with no letter"; comment của nhóm nói thêm "after a phrase about the KH or not". Hai ca cũ giữ nguyên.
3. **Một hằng `AI_TEST_FILES = '(\\.test|/test-support)\\.ts$'`** ở đầu `.dependency-cruiser.cjs`, neo ở `/test-support` (không khớp "latest-support.ts", "web-test-support.ts"). Dùng cho `from.pathNot` của `ai-only-on-domain-and-zod` và `ai-test-support-only-in-tests`, và cho `to.path` của rule sau (trước đó chỉ chặn đúng `^packages/ai/src/test-support\.ts$`). Comment của rule sau nói thêm "its tests": code sản phẩm của package ai cũng không import file test.

Code sản phẩm và output của Mock không đổi. Cỡ: 41 dòng tổng diff (28 thêm, 13 bớt): test 29, cấu hình 12; 0 dòng code sản phẩm.

##### Cách chọn cho mục 1 và lý do

Chọn **so với phép đo chuẩn** (phương án đầu của Issue), không nới trần hay chỉ tăng số lần đo:

- Run 41454921921 chậm đều, không chỉ một lần giật: cả bộ 275 s so với 158 s, và hàng "Một con đã mất được 2 năm nay rồi." mất 50 ms trên lần nhanh nhất của 3 lần, trong khi local đo 7,4 ms dưới coverage (×6,8). Tăng số lần đo không bỏ được chậm đều.
- Trần tuyệt đối phải vừa cao hơn runner chậm nhất, vừa thấp hơn mẫu bậc hai trên máy nhanh nhất. Hàng chậm nhất local dưới coverage 9,5 ms → trên runner ×6,8 khoảng 65 ms; hàng bậc hai yếu nhất (thử dưới đây) 383 ms không coverage. Trần 200 ms chỉ còn biên ~2× ở phía bắt bậc hai, và lại đỏ khi có runner chậm hơn nữa.
- Mốc chuẩn chạy cùng code Mock (cùng JIT, cùng coverage) trên cùng máy, xen kẽ với hàng đo, nên runner chậm N lần thì cả hai chậm N lần, tỉ lệ giữ nguyên. Ghi chú ngắn chỉ có câu ngắn, nên mẫu bậc hai theo câu (như DR6-79) không chạm mốc chuẩn; mẫu bậc hai theo cả ghi chú thì chạm ghi chú 316 ký tự ít hơn ghi chú 36 000 ký tự khoảng 114 lần.
- Giá: mỗi hàng đọc thêm ~36 000 ký tự ghi chú ngắn 3 lần (~25 ms local). Cả file `mock-extraction.test.ts` (684 test) chạy 1,44 s local.

##### Số đo (local, Windows, Node của repo)

Lần nhanh nhất của 5 lần, có coverage như CI (`--coverage`):

| | Ghi chú ngắn (mốc) | Hàng của bảng | Tỉ lệ hàng / mốc |
|---|---|---|---|
| Mock hiện tại | 7,9–9,3 ms | 1,7–9,5 ms | 0,21–1,21 |
| Mock + mẫu bậc hai (9 hàng chạm) | 8,3–12,7 ms | 708–1 561 ms | 81–162 |

- Trần đã chọn 10 × mốc: local khoảng 80 ms, cao hơn hàng chậm nhất (9,5 ms) ~8 lần; tỉ lệ 10 cách tỉ lệ tuyến tính lớn nhất (1,21) ~8 lần và tỉ lệ bậc hai nhỏ nhất (81) ~8 lần.
- So với DR6-79: 2 042 ms cho 36 003 ký tự, khoảng 25 lần trần local (~80 ms). So với số đo local ~5 ms của sổ: trần ~80 ms là ~16 lần.
- Trên runner chậm ×6,8 như run 41454921921: mốc ~55–60 ms → trần ~550–600 ms; hàng ~50–65 ms.

#### Test chấp nhận

- [x] **Vẫn bắt được chậm bậc hai.** Đưa tạm vào `mockExtractionOutput` (trong `.map` của từng cụm khớp), như `aboutTheKh` trước PR #682: quét ngược từng ký tự từ cụm tới đầu câu (`[.!?;\n]`), rồi thử một regex trên đoạn đó. Với test mới, không coverage: 9 hàng đỏ, 383–797 ms so với trần 60–70 ms (mốc 6–7 ms): "độc thân", "<n> con", "đã kết hôn", "có 2 bé và", "1 con đã mất " after "có 2 con", "vợ đã mất, ", "đã ly hôn được …", "đã kết hôn, " after one "KH", "- đã kết hôn, " after one "KH". 23 hàng còn lại không có nhiều cụm trong một câu, nên mẫu này với chúng vẫn tuyến tính (trần 50 ms cũ cũng chỉ đỏ đúng 9 hàng này). Đã gỡ mẫu (`git checkout` file).
- [x] **Không đỏ khi máy chậm hơn local nhiều lần**: trần là tỉ lệ 10 so với mốc đo cùng máy, cùng lần chạy, mốc có sàn 5 ms (`Date.now()`); số đo và biên ở bảng trên (~5 ms local, 2 042 ms của DR6-79).
- [x] Mọi hàng có sẵn của bảng 36 000 ký tự giữ nguyên ghi chú (độ dài ≥ 36 000, test vẫn kiểm).
- [x] Bảng luật 1 thêm "KH đã kết hôn.\nSống ở quận 7.\nCó 2 con." → Đã kết hôn, không Số con. Đột biến `const carried = !!last?.endsOnTheKh;`: đúng 2 test đỏ, ca mới và ca một dòng "KH đã kết hôn, sống ở quận 7. Có 2 con." (cả hai thêm Số con 2); hai ca "Only clauses with no letter" cũ vẫn xanh, như review #956 ghi. Đã gỡ đột biến.
- [x] Phần miễn của hai rule là một hằng `AI_TEST_FILES`, neo ở `/test-support`; dùng cho `from.pathNot` của cả hai rule và cho `to.path` của `ai-test-support-only-in-tests`. `pnpm lint:deps` xanh (354 module).
- [x] Thử tay, mỗi việc rồi gỡ (file tạm trong `packages/ai/src/`; "trước" là cấu hình của `main` qua `depcruise --config`):
  - `zz-probe.ts` (sản phẩm) import `latest-support.ts` có `import { expect } from 'vitest'` → **đỏ**: `ai-only-on-domain-and-zod: packages/ai/src/latest-support.ts → …/vitest/dist/index.d.ts`. Với cấu hình cũ: xanh.
  - `zz-probe.ts` import `web-test-support.ts` có import `vitest` → **đỏ**: `ai-only-on-domain-and-zod: packages/ai/src/web-test-support.ts → …/vitest/dist/index.d.ts`. Với cấu hình cũ: xanh.
  - Thêm: `zz-probe.ts` import `./test-support` → **đỏ**: `ai-test-support-only-in-tests: packages/ai/src/zz-probe.ts → packages/ai/src/test-support.ts`.
  - Bỏ phần miễn (`AI_TEST_FILES = '\\.test\\.ts$'`) → **đỏ** đúng 1 lỗi: `ai-only-on-domain-and-zod: packages/ai/src/test-support.ts → …/vitest/dist/index.d.ts`, như review #956.
- [x] Mọi ca có sẵn khác của Mock giữ kết quả: không đổi code sản phẩm; `pnpm verify` xanh, 4 377 test.

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff` (@ `cf7168f`):

- L23 `packages/ai/src/mock-extraction.test.ts` **[T-339 #960]** bảng ghi chú 36 000 ký tự, `toBeLessThan(50)`: đã sửa (mục 1, so với mốc đo cùng máy).
- L24 `.dependency-cruiser.cjs` **[T-339 #960]** phần miễn `test-support` chép ở hai rule, không neo: đã sửa (mục 3, hằng `AI_TEST_FILES`).
- L25 `packages/ai/src/mock-extraction.test.ts` **[T-339 #960]** hai ca "Only clauses with no letter": đã sửa (mục 2, ca qua dòng có câu đầu mang cụm).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Không cần nhãn `build-exe` (không chạm Rust, Cargo, `package.json`, lockfile hay cấu hình build).

Rủi ro: `risk:low` (review lên mức high vì chạm `packages/ai`, như #950)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-339 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #956 — T-339 (#960, PR #963, `REVIEW: PASS` @`cf7168f`):
  - #956, `packages/ai/src/mock-extraction.test.ts` (bảng ghi chú 36 000 ký tự, DR6-79): mỗi hàng đo so với Mock đọc cùng số ký tự trong ghi chú ngắn (`shortNote`, 316 ký tự, ~114 lần gọi), xen kẽ trên cùng máy, cùng lần chạy, lần nhanh nhất của 3 lần mỗi bên. Đạt khi ghi chú dài < 10 × ghi chú ngắn, ghi chú ngắn tính tối thiểu 5 ms (`Date.now()`). Mẫu bậc hai (quét ngược từng ký tự tới đầu câu cho mỗi cụm khớp) làm đỏ 9 hàng; review #963 đo lại không coverage: tỉ lệ 42–88 với mẫu đó, ≤ 1,4 với code hiện tại.
  - #956 (*Duplicated Code*), `.dependency-cruiser.cjs`: hằng `AI_TEST_FILES` = `(\.test|/test-support)\.ts$`, neo ở `/test-support`, dùng cho `from.pathNot` của `ai-only-on-domain-and-zod` và `ai-test-support-only-in-tests`, và cho `to.path` của rule sau. Review #963 thử: một file "latest-support.ts" hay "web-test-support.ts" của package ai import `vitest` nay bị `ai-only-on-domain-and-zod` báo.
  - #956, `packages/ai/src/mock-extraction.test.ts` (bảng luật 1, "Only clauses with no letter"): thêm ca qua dòng "KH đã kết hôn.\nSống ở quận 7.\nCó 2 con." → Đã kết hôn, không Số con. Đột biến `const carried = !!last?.endsOnTheKh;` làm ca này ra thêm Số con 2; hai ca cũ vẫn ra ∅.

---

# Issue #961 — T-340: Mục sổ G7: skill auto-issues (chạm rào, Owner làm) — brief §3.8 làm mới Ghi chú OPEN liên quan, câu trỏ dòng ở §4

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Sửa hai mục sổ OPEN của review #954 ở skill `auto-issues`. Chỉ sửa chữ của skill; code và công cụ không đổi.

**Issue này chạm rào "không tự sửa" của pipeline, nên pipeline bỏ nó khỏi hàng. Owner làm theo cách thường**: phiên thường, review phiên sạch bằng `review-pr`, Owner merge.

1. **Brief §3.8 (`main` đi trước) không làm mới mục "Ghi chú OPEN liên quan" của thân PR.**
   - Gộp `origin/main` cũng kéo sổ ghi chú của `main` vào nhánh. Brief không bảo chạy lại `node tools/notes-for.mjs --diff` và cập nhật mục đó của thân PR, như §3.4 làm.
   - §3.8 chỉ xảy ra khi `main` nhận code từ ngoài pipeline. Nếu kèm một PR sổ có mục OPEN mới ở file của PR, review head mới chạy `notes-for --pr <N>` trên sổ của head, thấy mục "Trùng file" chưa có dòng và chặn (`review-pr` §A). Thêm một vòng `REVIEW: CHANGES`.
   - Vòng đó chỉ sửa thân PR, nên head không đổi. Trong khi đó bảng §2 dựa vào head mới để chờ CI rồi review lại, và chỉ §5 có cách commit rỗng (cho quyết định Owner).
   - Sửa: thêm vào brief §3.8, như §3.4: "chạy lại `node tools/notes-for.mjs --diff`, cập nhật mục 'Ghi chú OPEN liên quan' của thân PR nếu đổi".
2. **§4, thiếu nhãn `build-exe`: câu trỏ nhầm dòng (NIT).**
   - Câu "chờ CI như dòng cuối của danh sách này" trỏ vào dòng cuối của danh sách, tức "Lý do khác: hỏi Owner". Dòng định trỏ tới là "Đóng, mở lại PR và chờ CI" (áp chót).
   - Câu đã lệch từ trước PR #954, nhưng PR viết lại chính câu này. Đọc theo chữ, phiên điều phối hỏi Owner thay vì đóng, mở lại PR và chờ `ci <N> --since <T>`.
   - Sửa thành "như dưới", như dòng `Tested base` kế đó.

##### Bối cảnh

- G7 Phase 6. **Quyết định Owner 02/11/2026: "Duyệt"** đề xuất gom sổ của pipeline `auto-issues`, gồm hai Issue T-339 và T-340 đúng như bảng đề xuất (Owner 23/10: sửa hết trước v1.0). Mục còn lại của sổ:
  - ba mục [T-333] đã thuộc #934;
  - mục thêm PR #944 vào "Kích thước PR vượt ngưỡng" giữ [G7], làm ở PR chốt số đo cuối G7.
- **Chạm rào "không tự sửa"** (đầu skill `auto-issues`; ADR-0001 phụ lục M11): skill `auto-issues`. Pipeline bỏ Issue này khỏi hàng (§1). Owner làm theo cách thường, như T-338 (#952).
- Làm lúc pipeline không chạy, vì Issue sửa chính skill mà phiên điều phối đang đọc.
- §3.8 và §4 hiện hành: T-338 (#952, PR #954).
- Mức `risk:low`, khác `risk:med` của T-338: PR chỉ sửa một file `.md` (không chạy CI; `review-pr` không gọi `code-review` cho PR chỉ sửa docs). T-338 sửa cả code `tools/` và hook.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: các mục [T-340] (nhóm review PR #954)
- `.claude/skills/auto-issues/SKILL.md`: §2 (bảng nhịp), §3.4 (brief REVIEW CHANGES, câu cập nhật thân PR), §3.8 (brief `main` đi trước), §4 (`merge-pr` từ chối), §5 (commit rỗng sau quyết định Owner)
- `.claude/skills/review-pr/SKILL.md` §A (kiểm mục "Ghi chú OPEN liên quan"), chỉ đọc
- Comment review của PR #954 (hai vòng: @`2c4f192`, @`6f37a67`)

##### File / thư mục được phép sửa

- `.claude/skills/auto-issues/SKILL.md` (chỉ §3.8 và §4)

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với đường dẫn trên (sổ @ `742643f`; nhãn theo PR gắn nhãn sổ ngày 02/11, lần 2):

- **Gộp** hai mục [T-340] của review #954: brief §3.8 không làm mới mục "Ghi chú OPEN liên quan"; câu "như dòng cuối của danh sách này" ở §4.
- Không có mục nào để lại.

##### Interface / hợp đồng

- Dòng `AUTO-CHILD` của brief §3.8 và các bước khác của §4 giữ như nay.
- Không sửa công cụ (`tools/auto-wait*`, `tools/merge-pr*`); bảng §2 không đổi.

##### Test chấp nhận

- [ ] Brief §3.8 có bước chạy lại `node tools/notes-for.mjs --diff` sau khi gộp `origin/main`, và cập nhật mục "Ghi chú OPEN liên quan" của thân PR nếu đổi, cùng cách viết với §3.4.
- [ ] §4, dòng thiếu nhãn `build-exe`, trỏ tới dòng "Đóng, mở lại PR và chờ CI" ("như dưới"), không trỏ tới "Lý do khác: hỏi Owner".
- [ ] Không câu nào khác của skill đổi; thân PR liệt kê hai chỗ sửa.

Ước lượng: ~3–6 dòng tài liệu skill.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh (PR chỉ sửa `.md`: CI không chạy)
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low (Owner review và merge theo cách thường vì chạm rào)

##### Bị chặn bởi

Không

## PR #967 — docs(skills): refresh PR notes after merging main, fix line pointer in auto-issues (T-340)

Trạng thái: MERGED · merge 2026-11-02T18:50:02Z · commit `6be4deebebc90b624f2b16b6513cf40ceeab1f27` · nhánh `task/T-340-auto-issues-brief-fixes` · nhãn: type:task, risk:low

Closes #961

Issue chạm rào "không tự sửa" của `auto-issues` (sửa chính skill): pipeline không nhận. Làm theo cách thường: phiên thường, review phiên sạch bằng `review-pr`, Owner merge.

#### Thay đổi

Chỉ sửa chữ của `.claude/skills/auto-issues/SKILL.md`, hai chỗ; code, công cụ và bảng §2 không đổi.

- **Brief §3.8 (`main` đi trước), dòng 259:** sau `push` thêm `chạy lại \`node tools/notes-for.mjs --diff\`, cập nhật mục "Ghi chú OPEN liên quan" của thân PR nếu đổi.`, cùng thứ tự với §3.4 (push rồi cập nhật thân PR). Gộp `origin/main` kéo cả sổ của `main` vào nhánh, nên mục "Trùng file" mới (nếu có) được ghi vào thân PR trước khi review head mới. Không có bước này thì review chặn vì thiếu dòng (`review-pr` §A), mà vòng sửa đó không đổi head. Dòng `AUTO-CHILD` của brief giữ nguyên.
- **§4, dòng thiếu nhãn `build-exe`, dòng 272:** "chờ CI như dòng cuối của danh sách này" → "chờ CI như dưới", như dòng `Tested base` kế đó. Câu cũ trỏ vào "Lý do khác: hỏi Owner" (dòng cuối), không vào "Đóng, mở lại PR và chờ CI" (áp chót). Các bước khác của §4 giữ nguyên.

Diff: 1 file, 2 dòng thêm, 2 dòng bớt.

#### Test chấp nhận

- [x] Brief §3.8 có bước chạy lại `node tools/notes-for.mjs --diff` sau khi gộp `origin/main` và cập nhật mục "Ghi chú OPEN liên quan" của thân PR nếu đổi, cùng cách viết với §3.4.
- [x] §4, dòng thiếu nhãn `build-exe`, trỏ tới dòng "Đóng, mở lại PR và chờ CI" ("như dưới"), không trỏ tới "Lý do khác: hỏi Owner".
- [x] Không câu nào khác của skill đổi (`git diff --word-diff`: chỉ hai chỗ trên); thân PR liệt kê hai chỗ sửa.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `756ff8d`): 2 mục "Trùng file".

- L15 **[T-340 #961]** `.claude/skills/auto-issues/SKILL.md:259` (brief §3.8 không làm mới mục "Ghi chú OPEN liên quan"): đã sửa.
- L16 **[T-340 #961]** NIT `.claude/skills/auto-issues/SKILL.md:272` ("như dòng cuối của danh sách này" ở §4): đã sửa.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

PR chỉ sửa một file `.md`: CI không chạy, và `review-pr` không gọi `code-review` cho PR chỉ sửa docs.

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-340 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #954 — T-340 (#961, PR #967, `REVIEW: PASS` @`4d224eb`):
  - #954, `.claude/skills/auto-issues/SKILL.md` (brief §3.8, `main` đi trước): sau push, brief bảo chạy lại `node tools/notes-for.mjs --diff` và cập nhật mục "Ghi chú OPEN liên quan" của thân PR nếu đổi, cùng thứ tự với §3.4 (push rồi cập nhật thân PR). `--diff` lấy file từ `<base>...HEAD`, nên sau `git merge origin/main` chỉ còn file của PR, còn sổ đọc từ cây làm việc, tức đã gồm sổ của `main`. Dòng `AUTO-CHILD` của brief giữ nguyên.
  - #954 NIT, `.claude/skills/auto-issues/SKILL.md` (§4, thiếu nhãn `build-exe`): "chờ CI như dưới", như dòng `Tested base` kế đó, nên câu trỏ tới bước "Đóng, mở lại PR và chờ CI", không tới "Lý do khác: hỏi Owner".

---

# Issue #969 — T-341: Mục sổ G7: comment bộ đếm đối số kiểu của bộ chặn ký hiệu — thẻ đóng / tự đóng dính chữ JSX, hậu quả bỏ sót

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Sửa mục sổ OPEN cuối cùng ở code (review #965, NIT). Comment của bộ đếm `types` trong `findHardcodedSeparators` (bộ chặn ký hiệu viết tay của `pnpm lint:tokens`) chưa nêu đủ giới hạn của nó. Chỉ sửa comment và ghim hành vi hiện tại bằng một ca test; hành vi không đổi.

- Comment hiện chỉ nêu dạng thẻ mở viết dính một chữ của văn bản JSX (`one<b>`).
- Thẻ đóng hay tự đóng viết dính một chữ (`Name</b>`, `Hello<br />`) cũng bị đọc như danh sách đối số kiểu. Vì vậy `{` ngay sau thẻ thành code, và `}, {` sau đó bị bỏ sót.
  - Thử ở `main` `5d2715d`: `<p><b>Name</b>{a}, {b}</p>` và `<p>Hello<br />{a}, {b}</p>` đều không báo gì. Theo review #965, trước PR #965 ca đầu báo `}, {`.
- Hậu quả chỉ là bỏ sót, không báo nhầm.
  - App hiện không có dạng này: review #965 grep `[\w$]</?[A-Za-z]` trên các `.tsx` được quét, chỉ ra đối số kiểu.
  - Văn bản JSX viết thẳng đã trái quy tắc i18n.
- Sửa: comment nêu cả dạng thẻ đóng / tự đóng (`one</b>`, `one<br />`) và hậu quả (dấu nối viết tay ngay sau thẻ đó bị bỏ sót, không báo nhầm). Thêm một ca test ghim hành vi này, như T-333 làm với giới hạn đã ghi.

##### Bối cảnh

- G7 Phase 6. Owner 23/10: sửa hết sổ OPEN trước v1.0. **Owner 03/11 chọn "Tạo Issue T-341"**: Issue nhỏ riêng, `risk:low`, thay vì gộp vào một PR nhỏ của G7.
- Bộ đếm `types` có từ T-333 (#934, PR #965): sửa mục `{` sau `>` của kiểu generic của review #920.
- File không nằm trong rào "không tự sửa" của pipeline `auto-issues`, nên pipeline nhận được Issue này.
- Sau Issue này, sổ OPEN chỉ còn một mục [G7]: thêm PR #944 vào "Kích thước PR vượt ngưỡng", làm ở PR chốt số đo cuối G7.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: mục [T-341] (nhóm review PR #965); mục RESOLVED của review #920 về `{` sau `>` của kiểu generic (nhóm T-333)
- `packages/ui/src/token-guard.ts`: `findHardcodedSeparators`, comment của `types` và doc comment của hàm (câu giới hạn "does not read a regex literal")
- `packages/ui/src/token-guard.test.ts`: ca "reads the `{` after the type arguments of a name as code"
- Comment review của PR #965 (`REVIEW: PASS` @`de5331b`)

##### File / thư mục được phép sửa

- `packages/ui/src/token-guard.ts` (chỉ comment)
- `packages/ui/src/token-guard.test.ts` (một ca ghim)

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với hai đường dẫn trên (sổ @ `5d2715d`):

- **Gộp** mục [G7] của review #965 (comment `types` chưa nêu dạng thẻ đóng / tự đóng và hậu quả). PR sổ gắn nhãn sổ đổi nhãn mục này thành [T-341].
- Không có mục nào để lại.

##### Interface / hợp đồng

- `findHardcodedSeparators(source)` giữ chữ ký và kết quả trên mọi nguồn.
- Code của hàm không đổi, chỉ comment.

##### Test chấp nhận

- [ ] Comment của `types` nêu: thẻ đóng hay tự đóng viết dính một chữ của văn bản JSX (`one</b>`, `one<br />`) cũng bị tính như đối số kiểu, như `one<b>`.
- [ ] Comment nêu hậu quả: `{` ngay sau thẻ đó đọc là code, nên dấu nối viết tay ở đó bị bỏ sót, không bao giờ báo nhầm.
- [ ] Một ca test ghim hành vi hiện tại: `<p><b>Name</b>{a}, {b}</p>` và `<p>Hello<br />{a}, {b}</p>` không báo gì, còn `<p><b>{x}</b>{a}, {b}</p>` (thẻ đóng không dính chữ) vẫn báo `}, {`.
- [ ] Mọi test có sẵn của `token-guard` xanh; `pnpm lint:tokens` trên repo không đổi kết quả.

Ước lượng: ~15 dòng tổng diff (comment ~3, test ~12).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #971 — test(ui): pin closing and self-closing tags against JSX text in the separator guard (T-341)

Trạng thái: MERGED · merge 2026-11-03T05:39:07Z · commit `55086de9f579813fc418ed502370c37e2929efac` · nhánh `task/T-341-types-comment` · nhãn: type:task, risk:low

Closes #969

#### Thay đổi

1. **Comment của bộ đếm `types`** (`packages/ui/src/token-guard.ts`, `findHardcodedSeparators`, review #965). Comment nay nêu cả thẻ đóng và thẻ tự đóng viết dính một chữ của văn bản JSX (`one</b>`, `one<br />`), không chỉ thẻ mở `one<b>`: cả ba bị tính như đối số kiểu. Comment cũng nêu hậu quả: `{` ngay sau thẻ đó đọc là code, nên dấu nối viết tay ở đó (`one</b>{a}, {b}`) bị bỏ sót. Bộ đếm chỉ có thể làm bỏ sót, không bao giờ báo nhầm.
2. **Ca test ghim hành vi hiện tại** (`packages/ui/src/token-guard.test.ts`). Ca "takes a closing or self-closing tag written against a word of JSX text for type arguments": `<p><b>Name</b>{a}, {b}</p>` và `<p>Hello<br />{a}, {b}</p>` không báo gì; `<p><b>{x}</b>{a}, {b}</p>` (thẻ đóng không dính chữ) vẫn báo `}, {`.

Code của hàm không đổi, chỉ comment. Chữ ký `findHardcodedSeparators(source)` giữ nguyên. Cỡ: 16 dòng tổng diff (15 thêm, 1 bớt): comment 3, test 12.

##### Ca ghim có "cắn"

Ca ghim xanh ngay vì hành vi không đổi (Issue chỉ ghim, không sửa), nên không có bước đỏ. Để chắc ca này bắt được thay đổi hành vi, script tạm (scratchpad, không commit) chạy cùng ba dòng trên `token-guard.ts` của bản trước PR #965 (`7b6dbd1^`) và của nhánh:

- bản trước #965: báo `}, {` ở cả dòng 1, 2, 3;
- nhánh: chỉ báo `}, {` ở dòng 3.

##### App không có dạng này

`git grep -nE '[A-Za-z0-9_$]</[A-Za-z]'` trên các `.tsx` được quét (`apps/desktop/src`, `packages/ui/src/components`) chỉ ra một dòng, nằm trong chuỗi của `CustomersScreen.test.tsx:9` (`'>1.234</span>'`); máy quét đọc chuỗi, không đọc như code. Dạng tự đóng dính chữ (`[A-Za-z0-9_$]<[a-z]+ ?/>`): 0 dòng.

#### Test chấp nhận

- [x] Comment của `types` nêu: thẻ đóng hay tự đóng viết dính một chữ của văn bản JSX (`one</b>`, `one<br />`) cũng bị tính như đối số kiểu, như `one<b>`.
- [x] Comment nêu hậu quả: `{` ngay sau thẻ đó đọc là code, nên dấu nối viết tay ở đó bị bỏ sót, không bao giờ báo nhầm.
- [x] Ca test ghim: `<p><b>Name</b>{a}, {b}</p>` và `<p>Hello<br />{a}, {b}</p>` không báo gì, còn `<p><b>{x}</b>{a}, {b}</p>` vẫn báo `}, {`.
- [x] Mọi test có sẵn của `token-guard` xanh (`token-guard.test.ts` 28, gồm ca mới); `pnpm lint:tokens` trên repo không đổi kết quả ("no styling that bypasses the tokens").

#### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --diff` (@ `9ae604f`):

- L15 `packages/ui/src/token-guard.ts` **[T-341 #969]** NIT comment của `types` chưa nêu thẻ đóng / tự đóng dính chữ JSX và hậu quả: đã sửa (mục 1, kèm ca ghim ở mục 2).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Không cần nhãn `build-exe` (không chạm Rust, Cargo, `package.json`, lockfile hay cấu hình build).

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-341 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #965 — T-341 (#969, PR #971, `REVIEW: PASS` @`13ab842`):
  - #965 NIT, `packages/ui/src/token-guard.ts` (`findHardcodedSeparators`, comment của `types`): comment nêu thẻ mở, thẻ đóng và thẻ tự đóng viết dính một chữ của văn bản JSX (`one<b>`, `one</b>`, `one<br />`) đều bị tính như đối số kiểu, và hậu quả: `{` ngay sau thẻ đó đọc là code, nên dấu nối viết tay ở đó (`one</b>{a}, {b}`) bị bỏ sót; bộ đếm chỉ có thể làm bỏ sót, không bao giờ báo nhầm. Code của hàm không đổi. Ca "takes a closing or self-closing tag written against a word of JSX text for type arguments" ở `packages/ui/src/token-guard.test.ts` ghim `<p><b>Name</b>{a}, {b}</p>` và `<p>Hello<br />{a}, {b}</p>` (không báo gì), `<p><b>{x}</b>{a}, {b}</p>` (vẫn báo `}, {`); trên `token-guard.ts` trước PR #965 cả ba dòng đều báo.

---

# Issue #973 — T-342: Mục sổ G7: bảng PR vượt ngưỡng của Phase 6 đếm bổ sung tới nay (gồm #944), ca ghim thẻ mở dính chữ JSX của bộ chặn ký hiệu

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Xử lý nốt hai mục OPEN cuối cùng của sổ ghi chú review, để sổ OPEN trống trước v1.0.

1. **Bảng PR vượt ngưỡng của Phase 6, đếm bổ sung tới nay.**
   - Mục "Kích thước PR vượt ngưỡng" của số đo Phase 6 hiện chỉ phủ các PR tới #858 (T-307, 27/10). Câu đầu mục hẹn "PR sửa của vòng review toàn bộ code ghi thêm sau".
   - Task đếm tiếp, theo đúng luật của mục, mọi PR merge vào `main` từ #859 tới PR merge cuối cùng trước khi mở PR của task. PR vượt ngưỡng vào bảng chính / bảng phụ; PR chỉ tài liệu vượt 800 dòng vào gạch "Không xét".
   - Trong đó có PR #944 (T-335, pipeline `auto-issues`), lý do: Owner chấp nhận cỡ (review #944).
   - Câu đầu mục và gạch tổng ghi mốc mới. PR chốt số đo cuối G7 chỉ còn nối tiếp từ mốc này.
2. **Ca ghim của bộ chặn ký hiệu có cả dạng thẻ mở dính chữ JSX** (review #971, NIT).
   - Comment của bộ đếm `types` nêu ba dạng `one<b>`, `one</b>`, `one<br />`, nhưng ca ghim của T-341 chỉ có thẻ đóng và thẻ tự đóng.
   - Thêm dòng thẻ mở vào ca đó. Hành vi không đổi.

##### Bối cảnh

- G7 Phase 6. Owner 23/10: sửa hết sổ OPEN trước v1.0.
- **Owner 03/11:** "tạo issue xử lý nốt 2 mục open". Với mục 1, Owner chọn đếm bổ sung bảng tới nay. Hai phương án không chọn: chỉ thêm dòng #944 (bảng lệch: có #944 mà chưa có các PR vượt ngưỡng trước nó); để mục cho PR chốt số đo cuối G7.
- **Ước lượng của phiên viết Issue** (03/11). Luật đếm gần đúng: `classifyFile`, cộng dòng thêm với dòng xóa, chưa tách khối codemap hay `#[cfg(test)]`. Task phải đếm lại theo đúng luật của mục.
  - Khoảng #859…#972: 82 PR merge, 25 PR có code hoặc test.
  - Vượt ngưỡng, bảng chính:

    | PR | Task | SP | Tổng diff |
    |---|---|---|---|
    | #917 | T-322 | 465 | 938 |
    | #937 | T-329 | 1 451 | 3 431 |
    | #939 | T-330 | 441 | 690 |
    | #944 | T-335 | 394 | 1 297 |

  - Không PR nào ở biên.
  - PR chỉ tài liệu vượt 800 dòng: #863, #894.
- PR #944: Owner chấp nhận cỡ ngày 01/11, lúc PR còn 1 078 dòng. Mục sổ ghi 1 297 dòng tổng diff: code công cụ 394 (trong ngưỡng), test 503, skill 334, tài liệu 66.
- Mục 2: T-341 (#969, PR #971) thêm comment và ca ghim. Thử ở `main` `d688c6c`: `<p>one<b>{a}, {b}</b></p>` không báo gì; trên bộ chặn trước PR #965 thì báo `}, {`.
- Gợi ý sửa bộ đếm thay vì ghi giới hạn đã ở ACCEPTED (Issue #969 chốt không đổi hành vi), không thuộc task này.
- Hai file không nằm trong rào "không tự sửa" của pipeline `auto-issues`, nên pipeline nhận được Issue này.

##### Tài liệu cần đọc

- `docs/metrics/phase-6.md` § "Kích thước PR vượt ngưỡng": câu phạm vi, luật đếm (nguồn, phân loại, không tính, không xét, bảng phụ "ở biên"), hai bảng, hai gạch cuối mục
- Thân PR #859 (T-307): lệnh đếm (`fetch-files.mjs`, `count.mjs`), output và phần kiểm số; task dùng lại cách đếm này
- `tools/size-report-core.mjs`: `classifyFile`
- Comment `6560983167` trên PR #944 (Owner chấp nhận cỡ); thân của từng PR vượt ngưỡng, cho ô "Lý do nêu trong PR"
- `docs/state/review-notes.md`: hai mục OPEN (review #944, review #971); mục ACCEPTED "Issue #969 (T-341), review #971"
- `packages/ui/src/token-guard.test.ts`: ca "takes a closing or self-closing tag written against a word of JSX text for type arguments"
- `packages/ui/src/token-guard.ts`: `findHardcodedSeparators`, comment của `types`

##### File / thư mục được phép sửa

- `docs/metrics/phase-6.md` (chỉ mục "Kích thước PR vượt ngưỡng")
- `packages/ui/src/token-guard.test.ts` (chỉ ca ghim của T-341)

##### Ghi chú OPEN liên quan

Theo `node tools/notes-for.mjs --files` với hai đường dẫn trên (sổ @ `d688c6c`):

- **Gộp** mục [G7] của review #944 (PR #944 chưa có trong bảng PR vượt ngưỡng; lý do: Owner chấp nhận cỡ). Mục hẹn làm "khi chốt số đo của G7"; Owner 03/11 cho làm ở đây, cùng phần đếm bổ sung.
- **Gộp** mục [G7] của review #971 (ca ghim chưa có dạng thẻ mở dính chữ).
- PR sổ gắn nhãn sổ đổi nhãn hai mục này thành [T-342]. Không có mục nào để lại.

##### Interface / hợp đồng

- Bảng giữ năm cột (PR, Task, Code sản phẩm, Tổng diff, Lý do nêu trong PR) và định dạng ô như các dòng có sẵn, vd. `497 (+442 / −55)` và `958 (test 461)`. Luật đếm của mục không đổi.
- `findHardcodedSeparators(source)` và code của bộ chặn không đổi; chỉ thêm một dòng vào một ca test có sẵn.

##### Test chấp nhận

- [ ] Bảng chính và bảng phụ có mọi PR có code hoặc test vượt ngưỡng trong khoảng mới (#859 tới PR merge cuối cùng trước khi mở PR của task), đếm theo đúng luật của mục như T-307, xếp theo số PR.
- [ ] Có dòng #944 (T-335); ô lý do ghi Owner chấp nhận cỡ ngày 01/11.
- [ ] Gạch "Không xét" kể thêm các PR chỉ tài liệu vượt 800 dòng của khoảng mới.
- [ ] Câu đầu mục ghi mốc mới: ngày, task, khoảng PR, số PR merge, số PR có code hoặc test; PR sau mốc được ghi thêm ở PR chốt số đo cuối G7.
- [ ] Gạch tổng ("… / … PR có code vượt ngưỡng") khớp hai bảng.
- [ ] Thân PR ghi lệnh đếm và output để kiểm lại được, như thân PR #859.
- [ ] Ca ghim thêm dòng `<p>one<b>{a}, {b}</b></p>` (thẻ mở dính chữ), không báo gì. Tên ca nêu cả thẻ mở. Kết quả vẫn chỉ một lần báo `}, {`, ở dòng `<p><b>{x}</b>{a}, {b}</p>`.
- [ ] Mọi test có sẵn của `token-guard` xanh; `pnpm lint:tokens` không đổi kết quả.

Ước lượng: ~35 dòng tổng diff. Tài liệu ~30: 4 dòng bảng, câu phạm vi, gạch "Không xét", gạch tổng. Test ~3.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #975 — docs: count the oversized Phase 6 PRs on to #974, pin an opening tag against JSX text (T-342)

Trạng thái: MERGED · merge 2026-11-03T07:11:30Z · commit `ace10ee5ef890189ee245b926483f0bae072405c` · nhánh `task/T-342-g7-notes-pr-size-table` · nhãn: risk:low

Closes #973

Phiên code: coding-ses2 (auto-issues)

#### Thay đổi

1. **`docs/metrics/phase-6.md`, mục "Kích thước PR vượt ngưỡng"**, đếm tiếp từ #859 tới #974 (PR merge cuối cùng trước khi mở PR này; 83 PR, 25 có code hoặc test), theo đúng luật của mục:
   - câu đầu mục ghi mốc mới: 03/11/2026 (T-342), #515 tới #974, 324 PR merge, 112 có code hoặc test; tách phần của T-307 (tới #858) và phần đếm tiếp; PR merge sau #974 ghi thêm ở PR chốt số đo cuối G7. Lệnh đếm của phần tiếp trỏ về thân PR này;
   - bảng chính thêm 4 dòng, xếp theo số PR: #917 (T-322), #937 (T-329), #939 (T-330), #944 (T-335). Ô lý do lấy từ mục cỡ trong thân từng PR; #944: Owner chấp nhận cỡ ngày 01/11 (comment `6560983167`, lúc PR còn 1 078 dòng);
   - bảng phụ "ở biên": không thêm dòng nào;
   - gạch "Không xét": thêm kế hoạch lượt 4 #863 (1 040 dòng) và báo cáo gốc lượt 4 #894 (16 633 dòng), "Bốn PR" thành "Sáu PR";
   - gạch tổng: **23 / 112**, 19 ở bảng chính; hai gạch con cho từng phần (tới #858: 19 / 87, như cũ; từ #859: 4 / 25).
2. **`packages/ui/src/token-guard.test.ts`**: ca ghim của T-341 thêm dòng đầu `<p>one<b>{a}, {b}</b></p>` (thẻ mở dính chữ JSX, không báo gì); tên ca nêu cả thẻ mở. Báo cáo duy nhất vẫn là `}, {` ở dòng `<p><b>{x}</b>{a}, {b}</p>`, nay là dòng 4. Code của bộ chặn không đổi.
   - Ca có nghĩa: chạy cùng bốn dòng trên bộ chặn trước PR #965 (`7b6dbd1^`) báo cả 4 dòng; trên `main` chỉ báo dòng 4.

Đổi một file test → CI chạy (Verify + e2e). Không đụng file của nhãn `build-exe`.

##### Đếm lại so với ước lượng của Issue

- **Cùng 4 PR ở bảng chính**, không PR nào ở biên, cùng hai PR chỉ tài liệu (#863, #894).
- **#937: tổng 3 428, Issue ước lượng 3 431.** 3 dòng ở khối codemap của `packages/ai/CLAUDE.md` không tính (ước lượng của Issue chưa tách khối codemap).
- Ba PR còn lại khớp số Issue ghi, và khớp số thân PR của chính chúng (#917 SP 465 / tổng 938; #939 SP 441 / tổng 690; #944 SP 394 / tổng 1 297). #937 không ghi số cả PR, chỉ số theo từng commit với `-M` (+37 / −20, +5 / −5, +281 / −263), cộng thành +323 / −288 ở ô lý do.

##### Lệnh đếm và rà

Chạy từ gốc repo, `main` @ `bc8ace3`, cùng cách của thân PR #859 (T-307) với chỗ đổi mà mục đã ghi: phía cũ đọc ở `git merge-base <base.sha> <head>` thay vì `git merge-base origin/main <head>`.

1. `gh pr list --state merged --search "merged:>=2026-10-26" --limit 1000 --json number,title,mergedAt,headRefOid,additions,deletions,changedFiles > prs.json`. Ranh giới: không PR số ≤ 858 nào merge sau #858 (27/10 07:53Z), không PR số > 858 nào merge trước nó. PR cuối: #974 (03/11 05:55Z); lúc mở PR này không PR nào khác mở hay merge sau #974.
2. `node fetch-files.mjs`: gọi `gh api repos/AlexH-AI/Project-2C/pulls/<n>/files --paginate --slurp` và `gh api repos/AlexH-AI/Project-2C/pulls/<n> --jq .base.sha` cho 83 PR.
3. `git fetch origin refs/pull/<n>/head` cho 5 PR có file Rust, `CLAUDE.md` của package hay migration SQL: #861, #937, #946, #956 (khối codemap), #915 (`storage.rs`). Không PR nào của khoảng có migration SQL.
4. `node count.mjs`: in bảng chính (vượt > 6 %), bảng phụ (≤ 6 %), PR chỉ tài liệu vượt ngưỡng, và PR có code gần ngưỡng (SP > 360 hoặc tổng > 720; khoảng này không có).

Kiểm số:
- Cộng `additions` / `deletions` và số file theo `pulls/<n>/files` khớp số của PR ở cả 83 / 83 PR.
- Mỗi lần tách dòng (Rust, codemap) cộng lại đúng số của file; script ném lỗi nếu lệch, và ném lỗi nếu không tìm được merge base.
- 25 PR có code hoặc test: #861, #871, #878, #882, #888, #907, #911, #913, #915, #917, #920, #922, #924, #926, #937, #939, #941, #944, #946, #954, #956, #958, #963, #965, #971.

<details><summary><code>fetch-files.mjs</code></summary>

```js
// Fetch `pulls/<n>/files` (all pages) and `base.sha` for every merged PR after #858 in prs.json,
// cached as files/<n>.json and bases.json.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const here = import.meta.dirname;
const dir = join(here, 'files');
mkdirSync(dir, { recursive: true });
const prs = JSON.parse(readFileSync(join(here, 'prs.json'), 'utf8'))
  .map((p) => p.number)
  .filter((n) => n > 858)
  .sort((a, b) => a - b);
const gh = (args) =>
  execFileSync('gh', args, {
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
const basesFile = join(here, 'bases.json');
const bases = existsSync(basesFile) ? JSON.parse(readFileSync(basesFile, 'utf8')) : {};
for (const n of prs) {
  const out = join(dir, `${n}.json`);
  if (!existsSync(out)) {
    const raw = gh(['api', `repos/AlexH-AI/Project-2C/pulls/${n}/files`, '--paginate', '--slurp']);
    writeFileSync(out, JSON.stringify(JSON.parse(raw).flat()));
  }
  if (!bases[n]) bases[n] = gh(['api', `repos/AlexH-AI/Project-2C/pulls/${n}`, '--jq', '.base.sha']).trim();
  process.stdout.write(`${n} `);
}
writeFileSync(basesFile, JSON.stringify(bases, null, 1));
console.log(`\ndone: ${prs.length} PRs`);
```

</details>

<details><summary><code>count.mjs</code></summary>

```js
// Size of every merged Phase 6 PR after #858, by the counting rule of T-307 (#851), old side read
// at `git merge-base <base.sha> <head>` (docs/metrics/phase-6.md, "Kích thước PR vượt ngưỡng").
// Input: prs.json (`gh pr list --state merged --json number,title,headRefOid,…`),
// files/<n>.json (`gh api repos/AlexH-AI/Project-2C/pulls/<n>/files --paginate --slurp`) and
// bases.json (`gh api repos/AlexH-AI/Project-2C/pulls/<n> --jq .base.sha`).
// Run from the repo root: the PR heads must be fetched (`git fetch origin refs/pull/<n>/head`).
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const here = import.meta.dirname;
const { classifyFile } = await import(
  pathToFileURL(join(process.cwd(), 'tools/size-report-core.mjs')).href
);

const prs = JSON.parse(readFileSync(join(here, 'prs.json'), 'utf8'))
  .filter((p) => p.number > 858)
  .sort((a, b) => a.number - b.number);

// Not counted at all (ADR-0001 appendix): lock files, drizzle-kit snapshots / journal, the static
// seed tables, icons; drizzle-kit SQL (a migration without the custom-migration header) is decided
// per file below, the codemap block of a package CLAUDE.md per line.
const GENERATED = [
  /(?:^|\/)(?:pnpm-lock\.yaml|Cargo\.lock)$/,
  /^packages\/db\/migrations\/meta\//,
  /^packages\/db\/src\/seed-data\.ts$/,
  /^apps\/desktop\/src-tauri\/icons\//,
];
const MIGRATION_SQL = /^packages\/db\/migrations\/[^/]+\.sql$/;
const CUSTOM_MIGRATION = '-- Custom SQL migration file';
const RUST_TESTS = /^[ \t]*#\[cfg\(test\)\]/;

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
}

const bases = JSON.parse(readFileSync(join(here, 'bases.json'), 'utf8'));
const mergeBases = new Map();
function mergeBase(pr) {
  if (!mergeBases.has(pr.number)) {
    const base = git(['merge-base', bases[pr.number], pr.headRefOid])?.trim() ?? null;
    if (!base) throw new Error(`#${pr.number}: no merge base`);
    mergeBases.set(pr.number, base);
  }
  return mergeBases.get(pr.number);
}

const show = (sha, path) => (sha ? git(['show', `${sha}:${path}`]) : null);

/** 1-based [from, to] of a file's region, or null: Rust tests to the end, codemap block. */
function region(text, kind) {
  if (text === null) return null;
  const lines = text.split('\n');
  if (kind === 'rust') {
    const at = lines.findIndex((l) => RUST_TESTS.test(l));
    return at < 0 ? null : [at + 1, Infinity];
  }
  const from = lines.findIndex((l) => l.includes('<!-- codemap:start -->'));
  const to = lines.findIndex((l) => l.includes('<!-- codemap:end -->'));
  return from < 0 || to < 0 ? null : [from + 1, to + 1];
}

/** Added / deleted lines of a patch, each with its line number on its side. */
function patchLines(patch) {
  const out = [];
  let oldNo = 0;
  let newNo = 0;
  for (const line of patch.split('\n')) {
    const hunk = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);
    if (hunk) {
      oldNo = Number(hunk[1]);
      newNo = Number(hunk[2]);
    } else if (line.startsWith('+')) {
      out.push({ side: 'new', no: newNo++ });
    } else if (line.startsWith('-')) {
      out.push({ side: 'old', no: oldNo++ });
    } else if (!line.startsWith('\\')) {
      oldNo++;
      newNo++;
    }
  }
  return out;
}

const inside = (r, no) => r !== null && no >= r[0] && no <= r[1];

/** Split one file's lines: `{ in: {add, del}, out: {add, del} }` by a region of each side. */
function splitByRegion(pr, file, kind) {
  const base = mergeBase(pr);
  const oldR = region(show(base, file.previous_filename ?? file.filename), kind);
  const newR = region(show(pr.headRefOid, file.filename), kind);
  const res = { in: { add: 0, del: 0 }, out: { add: 0, del: 0 } };
  for (const l of patchLines(file.patch)) {
    const hit = l.side === 'new' ? inside(newR, l.no) : inside(oldR, l.no);
    res[hit ? 'in' : 'out'][l.side === 'new' ? 'add' : 'del'] += 1;
  }
  if (res.in.add + res.out.add !== file.additions || res.in.del + res.out.del !== file.deletions) {
    throw new Error(`#${pr.number} ${file.filename}: patch does not add up`);
  }
  return res;
}

const rows = [];
for (const pr of prs) {
  const files = JSON.parse(readFileSync(join(here, 'files', `${pr.number}.json`), 'utf8'));
  const sum = {
    product: { add: 0, del: 0 },
    test: { add: 0, del: 0 },
    other: { add: 0, del: 0 },
    generated: { add: 0, del: 0 },
  };
  const generatedFiles = [];
  const put = (kind, add, del) => {
    sum[kind].add += add;
    sum[kind].del += del;
  };
  for (const f of files) {
    const path = f.filename;
    if (f.additions + f.deletions === 0) continue;
    if (GENERATED.some((r) => r.test(path))) {
      put('generated', f.additions, f.deletions);
      generatedFiles.push(path);
      continue;
    }
    if (MIGRATION_SQL.test(path)) {
      const text = show(pr.headRefOid, path) ?? '';
      if (text.includes(CUSTOM_MIGRATION)) {
        put('product', f.additions, f.deletions);
      } else {
        put('generated', f.additions, f.deletions);
        generatedFiles.push(path);
      }
      continue;
    }
    if (/(?:^|\/)CLAUDE\.md$/.test(path) && path !== 'CLAUDE.md') {
      const s = splitByRegion(pr, f, 'codemap');
      put('generated', s.in.add, s.in.del);
      if (s.in.add + s.in.del) generatedFiles.push(`${path} (codemap)`);
      put('other', s.out.add, s.out.del);
      continue;
    }
    const kind = classifyFile(path);
    if (kind === null) {
      put('other', f.additions, f.deletions);
    } else if (kind.kind === 'product' && path.endsWith('.rs')) {
      const s = splitByRegion(pr, f, 'rust');
      put('test', s.in.add, s.in.del);
      put('product', s.out.add, s.out.del);
    } else if (kind.kind === 'generated') {
      throw new Error(`#${pr.number} ${path}: generated file without a rule`);
    } else {
      put(kind.kind, f.additions, f.deletions);
    }
  }
  const lines = (k) => sum[k].add + sum[k].del;
  const product = lines('product');
  const total = product + lines('test') + lines('other');
  rows.push({
    number: pr.number,
    title: pr.title,
    mergedAt: pr.mergedAt,
    product,
    test: lines('test'),
    other: lines('other'),
    total,
    sum,
    generatedFiles,
    docsOnly: product + lines('test') === 0,
  });
}

writeFileSync(join(here, 'counts.json'), JSON.stringify(rows, null, 1));
const over = (r) => r.product > 400 || r.total > 800;
const far = (r) => r.product > 424 || r.total > 848;
const fmt = (r) =>
  `#${r.number} SP ${r.product} (+${r.sum.product.add}/-${r.sum.product.del}) test ${r.test} (+${r.sum.test.add}/-${r.sum.test.del}) other ${r.other} (+${r.sum.other.add}/-${r.sum.other.del}) TOTAL ${r.total} gen ${r.sum.generated.add + r.sum.generated.del}${r.generatedFiles.length ? ` [${r.generatedFiles.join(', ')}]` : ''} | ${r.title.slice(0, 70)}`;
console.log('== main (over by > 6 %)');
for (const r of rows.filter((r) => !r.docsOnly && far(r))) console.log(fmt(r));
console.log('== edge (over by <= 6 %)');
for (const r of rows.filter((r) => !r.docsOnly && over(r) && !far(r))) console.log(fmt(r));
console.log('== docs-only over');
for (const r of rows.filter((r) => r.docsOnly && over(r))) console.log(fmt(r));
console.log('== near (code, SP > 360 or total > 720, not over)');
for (const r of rows.filter((r) => !r.docsOnly && !over(r) && (r.product > 360 || r.total > 720)))
  console.log(fmt(r));
```

</details>

<details><summary>Output của <code>count.mjs</code> (bỏ tên PR)</summary>

```
== main (over by > 6 %)
#917 SP 465 (+387/-78) test 465 (+406/-59) other 8 (+7/-1) TOTAL 938 gen 0
#937 SP 1451 (+735/-716) test 1977 (+996/-981) other 0 (+0/-0) TOTAL 3428 gen 3 [packages/ai/CLAUDE.md (codemap)]
#939 SP 441 (+328/-113) test 232 (+208/-24) other 17 (+10/-7) TOTAL 690 gen 0
#944 SP 394 (+389/-5) test 503 (+503/-0) other 400 (+396/-4) TOTAL 1297 gen 0
== edge (over by <= 6 %)
== docs-only over
#863 SP 0 (+0/-0) test 0 (+0/-0) other 1040 (+1029/-11) TOTAL 1040 gen 0
#894 SP 0 (+0/-0) test 0 (+0/-0) other 16633 (+16633/-0) TOTAL 16633 gen 0
== near (code, SP > 360 or total > 720, not over)
```

</details>

#### Test chấp nhận

- [x] Bảng chính và bảng phụ có mọi PR có code hoặc test vượt ngưỡng từ #859 tới #974 (PR merge cuối cùng trước khi mở PR này), đếm theo luật của mục như T-307, xếp theo số PR (lệnh ở mục "Lệnh đếm và rà").
- [x] Có dòng #944 (T-335); ô lý do ghi Owner chấp nhận cỡ ngày 01/11.
- [x] Gạch "Không xét" kể thêm #863, #894.
- [x] Câu đầu mục ghi mốc mới: 03/11/2026, T-342, #515 tới #974, 324 PR merge, 112 có code hoặc test; PR sau mốc ghi thêm ở PR chốt số đo cuối G7.
- [x] Gạch tổng "23 / 112 PR có code vượt ngưỡng, 19 ở bảng chính" khớp hai bảng (19 dòng bảng chính + 4 dòng bảng phụ).
- [x] Thân PR ghi lệnh đếm và output.
- [x] Ca ghim có dòng `<p>one<b>{a}, {b}</b></p>`, không báo gì; tên ca nêu cả thẻ mở; vẫn chỉ một lần báo `}, {`, ở dòng `<p><b>{x}</b>{a}, {b}</p>`.
- [x] Mọi test có sẵn của `token-guard` xanh (28 ca); `pnpm lint:tokens` (trong `pnpm verify`) không đổi kết quả, vì code của bộ chặn và file nguồn nó quét không đổi.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `bc8ace3`), 2 mục "Trùng file", đều [T-342]:

- L13 `docs/metrics/phase-6.md:247` (chưa có PR #944 ở "Kích thước PR vượt ngưỡng"): **đã sửa**, bảng chính (SP 394, tổng 1 297), lý do: Owner chấp nhận cỡ ngày 01/11; cùng phần đếm tiếp tới #974.
- L15 NIT `packages/ui/src/token-guard.test.ts:175` (ca ghim chưa có thẻ mở dính chữ): **đã sửa**, thêm dòng `<p>one<b>{a}, {b}</b></p>`.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (không đổi dependency)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-342 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #944, #971 — T-342 (#973, PR #975, `REVIEW: PASS` @`1182e24`):
  - #944, `docs/metrics/phase-6.md` ("Kích thước PR vượt ngưỡng"): đếm bổ sung từ #859 tới #974 theo luật của mục, như T-307 (83 PR merge, 25 có code hoặc test; lệnh và output ở thân PR #975, phía cũ đọc theo `base.sha`). Bảng chính thêm #917, #937, #939 và #944; dòng #944: code sản phẩm 394, tổng diff 1 297 (test 503), lý do Owner chấp nhận cỡ ngày 01/11 (comment `6560983167`, lúc PR còn 1 078 dòng). Bảng phụ "ở biên" không thêm dòng. Gạch "Không xét" thêm #863, #894. Câu đầu mục ghi mốc 03/11/2026 (T-342, #515 tới #974, 324 PR merge, 112 có code hoặc test), PR merge sau #974 ghi thêm ở PR chốt số đo cuối G7; gạch tổng 23 / 112, 19 ở bảng chính.
  - #971 NIT, `packages/ui/src/token-guard.test.ts` (ca "takes an opening, closing or self-closing tag written against a word of JSX text for type arguments"): ca thêm dòng đầu `<p>one<b>{a}, {b}</b></p>` (thẻ mở dính chữ JSX, không báo gì), tên ca nêu cả thẻ mở. Báo cáo duy nhất vẫn là `}, {` ở dòng `<p><b>{x}</b>{a}, {b}</p>`; trên `packages/ui/src/token-guard.ts` trước PR #965 cả bốn dòng đều báo. Code của bộ chặn không đổi.

---

# Issue #977 — T-343: Chụp lại ảnh hướng dẫn sau đợt sửa lượt 4 (ô chọn, discovery@5)

Trạng thái: CLOSED · nhãn: type:task, risk:low

##### Mục tiêu

Ảnh hướng dẫn sử dụng khớp app ở `main` `3e3f5bc` (sau đợt sửa lượt 4 và đợt sửa sổ OPEN), trước nghiệm thu NT-HD-01 trên exe phát hành. Chạy lại bộ chụp, commit các ảnh đổi.

Lần chạy thử trên `3e3f5bc` (Home PC) đổi 8 / 28 ảnh:

- **Ô chọn theo `.choice` của mockup** (T-324, L4-F, DR6-149): `03-ket-qua`, `04-chuyen-nhom`, `04-khach-hang-moi`, `08-nhan-su-moi`, `09-cai-dat-ai`.
- **Prompt `discovery@5`** (đợt G5 lượt 4, PR #909, #913): `06-ai-phan-tich`.
- **Khóa i18n cho "{trường}: {giá trị}"** (T-324, DR6-145 (a)): `05-du-kien-kyc`, `05-ho-so-kh`.

##### Bối cảnh

- Bản tổng hợp lượt 4 §8.1 bước 5 và HANDOFF (G7): chụp lại ảnh mà đợt sửa đổi màn ("ô chọn của L4-F có ở nhiều hộp").
- Lần chụp toàn bộ trước: T-312 (#867, PR #882), ở `76601fd`.
- Bộ chụp chạy tay, không chạy trong CI.

##### Tài liệu cần đọc

- `e2e/guide/shots.guide.ts`, `e2e/guide/check.guide.ts` (giới hạn cỡ), `playwright.guide.config.ts` (viewport, lệnh chạy)
- `docs/design/phase-6-hoan-thien.md` §4.3 (giới hạn ảnh)
- `docs/user-guide/*.md`: đoạn gắn với ảnh đổi (`03-lich-hen.md` hộp Kết quả cuộc gặp, `04-khach-hang.md` Khách hàng mới / Chuyển nhóm, `06-ai.md` chip prompt, `08-team.md` Nhân sự mới, `09-cai-dat.md` Cài đặt → AI)

##### File / thư mục được phép sửa

- `docs/user-guide/img/**`
- `docs/user-guide/*.md` (chỉ khi câu chữ lệch ảnh)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files 'docs/user-guide/img/**' 'e2e/guide/shots.guide.ts' 'docs/user-guide/*.md'` (sổ @ `3e3f5bc`): không có.

##### Interface / hợp đồng

Không đổi code; chỉ ảnh.

##### Test chấp nhận

- [ ] `pnpm exec playwright test -c playwright.guide.config.ts` xanh; mỗi ảnh ≤ 150 KiB, tổng ≤ 4 MiB (`check.guide.ts`).
- [ ] Chạy lệnh chụp hai lần liền: 28 ảnh trùng từng byte.
- [ ] PR liệt kê ảnh nào đổi, đổi gì, và ảnh nào trùng byte với `main`.
- [ ] Ô chọn trong ảnh theo mockup: ô đang chọn in đậm, ô tắt gạch ngang (OpenCode ở `09-cai-dat-ai`, nhóm hiện tại ở `04-chuyen-nhom`).
- [ ] Câu chữ các trang hướng dẫn khớp ảnh mới.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không có.

## PR #978 — docs: reshoot the user guide after the round 4 fixes (T-343)

Trạng thái: MERGED · merge 2026-11-03T09:58:48Z · commit `fffe3e5fcba144abf1d17051ff3efcca9d9d0a7c` · nhánh `task/T-343-reshoot-guide` · nhãn: risk:low

Closes #977

#### Thay đổi

Chụp lại toàn bộ ảnh hướng dẫn trên `main` `3e3f5bc`, sau đợt sửa lượt 4 và đợt sửa sổ OPEN. Dùng `playwright.guide.config.ts` trên Home PC (`DESKTOP-KDURKJP`), không `PW_REUSE`. App không đổi. Bộ chụp không đổi. Câu chữ hướng dẫn không đổi.

- Có 8 / 28 ảnh đổi, commit ở đây. 20 ảnh còn lại trùng từng byte với `main`.
- Chạy lệnh chụp hai lần liền (mỗi lần tự build): 28 ảnh trùng từng byte giữa hai lần.
- Cỡ ảnh: lớn nhất `04-khach-hang` 141 536 B (không đổi). Tổng 28 ảnh 1 939 611 B (trước 1 942 246 B).

##### Ảnh: đổi gì so với `main`

So từng điểm ảnh bằng Edge + canvas (script tạm, ngoài repo). Ảnh trên `main` chụp ở #882 (T-312, `76601fd`, 28/10).

| Nguồn đổi | Ảnh | Đổi gì |
|---|---|---|
| Ô chọn theo `.choice` của mockup (T-324, L4-F, DR6-149) | `03-ket-qua` (448 × 768 → 774) | Ô Trạng thái và Nhóm sau cuộc gặp: nền sáng hơn hộp, bo nhỏ hơn, đệm 5 / 11. "Đã gặp" in đậm. Mỗi hàng ô cao thêm 2 px nên hộp cao thêm 6 px. Hộp vẫn vừa cửa sổ, đủ câu help Case size |
| | `04-chuyen-nhom` (398 → 402) | Ô N3 "hiện tại" tắt: mờ và gạch ngang |
| | `04-khach-hang-moi` (604 → 608) | Ô Giới tính và Nhóm ban đầu. "Chưa rõ", "N4" in đậm |
| | `08-nhan-su-moi` (342 → 344) | Ô Vai trò. "RE" in đậm |
| | `09-cai-dat-ai` (1 440 × 900) | Ô Provider: "Mock" in đậm, "OpenCode" (chỉ có ở exe) mờ và gạch ngang. Phần dưới dịch xuống 2 px. Chữ không đổi |
| Prompt `discovery@5` (đợt G5 lượt 4, PR #909, #913) | `06-ai-phan-tich` (376 × 1 001) | Chip `kyc v2 · discovery@4 · Mock` → `discovery@5`; cột Prompt của Lịch sử phân tích `discovery @4` → `@5`. Tiêu đề bảng lệch 1–2 px theo bề rộng cột |
| Khóa i18n "{trường}: {giá trị}" (T-324, DR6-145 (a)) | `05-du-kien-kyc`, `05-ho-so-kh` | Chữ như cũ. Chỉ khác ở điểm ảnh của vài dòng dữ kiện (phóng to 3× đã xem: "Giới tính: Nữ", "Nơi sinh sống: Quận 1, TP.HCM"…), vì chữ nay dựng từ một chuỗi |

Không có ảnh nào có ô chọn mà vẫn trùng byte. Các hộp khác của bộ chụp đều trùng byte:

- `03-dat-lich`, `03-doi-lich`, `05-hop-dong-moi`: hộp không dùng `Choices`.
- `05-ghi-chu-kyc`: chụp lúc ô Trường còn "Chọn trường", nên hộp chưa có ô chọn.

##### Câu chữ hướng dẫn

Đã đối chiếu các đoạn gắn với ảnh đổi, không cần sửa:

- `06-ai.md:49` và `11-thuat-ngu.md:93` đã ghi `discovery@5`.
- `04-khach-hang.md:61` ghi "nhóm hiện tại ghi 'hiện tại'", khớp ô N3 tắt ở `04-chuyen-nhom`.
- `09-cai-dat.md`: phần AI không tả hình ô Provider.

#### Test chấp nhận

- [x] `pnpm exec playwright test -c playwright.guide.config.ts` xanh (13 passed): mỗi ảnh ≤ 150 KiB, tổng ≤ 4 MiB.
- [x] Chạy lệnh chụp hai lần liền: 28 ảnh trùng từng byte.
- [x] PR liệt kê ảnh nào đổi, đổi gì, và ảnh nào trùng byte với `main` (bảng trên).
- [x] Ô chọn trong ảnh theo mockup: ô đang chọn in đậm. Ô tắt gạch ngang: OpenCode ở `09-cai-dat-ai`, N3 "hiện tại" ở `04-chuyen-nhom`.
- [x] Câu chữ các trang hướng dẫn khớp ảnh mới.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `6d86c92`: Không có.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

PR chỉ đụng `docs/**`, nên CI không chạy.

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-343 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #980 — T-344: Mục sổ G7: bảng đối chiếu của hướng dẫn, hàng Chuyển nhóm ghi mockup vẽ hộp (customer-forms.html 5d–5e)

Trạng thái: CLOSED · nhãn: type:task, risk:low

##### Mục tiêu

Sửa mục sổ G7 NIT `docs/user-guide/README.md:75` (`docs/state/review-notes.md`, ghi chú review PR #978): bảng "Hộp thoại", hàng "Chuyển nhóm", cột Mockup ghi `customer.html`, nhưng hộp Chuyển nhóm vẽ ở `customer-forms.html` 5d (KH đang mở) và 5e (KH đã đóng); `customer.html` chỉ có nút "Chuyển nhóm ▾" (`docs/design/mockups/customer.html:261`). Ghi `customer-forms.html` 5d–5e.

##### Bối cảnh

- Có từ PR #547 (T-212), ngoài diff của PR #978.
- Các hàng khác của bảng ghi file vẽ hộp (Khách hàng mới, Sửa hồ sơ, Xóa KH → `customer-forms.html`); `docs/testing/nghiem-thu-v1.md` ghi khoảng mục theo cách `customer-forms.html` 5a–5f.

##### Tài liệu cần đọc

- `docs/design/mockups/customer-forms.html` (5d, 5e), `docs/design/mockups/customer.html:261`
- `docs/state/review-notes.md` (mục OPEN của `docs/user-guide/README.md`)

##### File / thư mục được phép sửa

- `docs/user-guide/README.md`

##### Ghi chú OPEN liên quan

Mục [G7] `docs/user-guide/README.md:75` ở trên: sửa trong task này.

##### Interface / hợp đồng

Không đổi code; một ô của bảng.

##### Test chấp nhận

- [ ] Hàng "Chuyển nhóm" của bảng "Hộp thoại" ghi `customer-forms.html` 5d–5e.
- [ ] Không đổi hàng nào khác.

##### Định nghĩa hoàn thành

- [ ] Review phiên sạch: PASS (PR chỉ sửa docs, không chạy CI)

##### Rủi ro

risk:low

##### Bị chặn bởi

Không có.

## PR #981 — docs: name the mockup that draws the move-stage dialog in the guide table (T-344)

Trạng thái: MERGED · merge 2026-11-03T10:37:26Z · commit `57d633001aa24e541b005b8616f7e1c3e7ff03ce` · nhánh `task/T-344-guide-move-stage-mockup` · nhãn: risk:low

Closes #980

#### Thay đổi

- `docs/user-guide/README.md:75`, bảng "Hộp thoại", hàng "Chuyển nhóm": cột Mockup `customer.html` → `customer-forms.html` 5d–5e. Hộp Chuyển nhóm vẽ ở `customer-forms.html` 5d (KH đang mở) và 5e (KH đã đóng); `customer.html` chỉ có nút "Chuyển nhóm ▾" (`docs/design/mockups/customer.html:261`). Cách ghi khoảng mục theo `docs/testing/nghiem-thu-v1.md` (`customer-forms.html` 5a–5f).

#### Test chấp nhận

- [x] Hàng "Chuyển nhóm" của bảng "Hộp thoại" ghi `customer-forms.html` 5d–5e.
- [x] Không đổi hàng nào khác (diff 1 dòng).

#### Ghi chú OPEN liên quan

- L14 `docs/user-guide/README.md` **[G7]** NIT `docs/user-guide/README.md:75` (hàng "Chuyển nhóm" ghi `customer.html`): đã sửa.

#### Kiểm tra

- [x] PR chỉ sửa docs: không chạy CI, không cần `pnpm verify`
- [x] Không thêm dependency
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-344 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #978 — T-344 (#980, PR #981, `REVIEW: PASS` @`eed63c8`):
  - #978 NIT, `docs/user-guide/README.md:75` (bảng "Hộp thoại", hàng "Chuyển nhóm"): cột Mockup ghi `customer-forms.html` 5d–5e, file vẽ hộp Chuyển nhóm (5d KH đang mở, 5e KH đã đóng), như các hàng Khách hàng mới, Sửa hồ sơ, Xóa KH; dấu gạch U+2013 như `docs/testing/nghiem-thu-v1.md` (`customer-forms.html` 5a–5f). Link mục hướng dẫn và ảnh giữ nguyên.

---

# Issue #983 — T-345: Probe hiệu năng: Lịch hẹn kỳ Tháng lùi về tháng gần nhất có đủ ngày Đã gặp

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Probe hiệu năng trên exe chạy được ở mọi ngày trong tháng. Ở Lịch hẹn kỳ Tháng, probe chọn lịch "Đã gặp" trong lịch **tháng hiện tại**, nên tháng đó phải có ít nhất `PERF_RUNS` (5) ngày có lịch Đã gặp. Đầu tháng, hoặc khi dữ liệu tải neo ở tháng trước, điều kiện này không đạt và probe dừng giữa chừng. Sửa: khi tháng đang xem chưa đủ ngày Đã gặp, probe bấm "Kỳ trước" (không đo) tới tháng gần nhất có đủ, rồi đo như cũ.

##### Bối cảnh

- G7, NT-HN-01 (Owner 03/11/2026: đo trên Home PC; chọn "Tạo Issue sửa probe"). Lần đo 03/11 trên exe `eaa83c3`, dữ liệu tải mặc định (neo 12/10/2026): probe dừng ở `appointments.select-day-month` (`TimeoutError` chờ nút /Đã gặp/ trong vùng "Lịch tháng …"). Tháng 11 chưa có lịch Đã gặp nào; dữ liệu neo hôm nay cũng chỉ có tối đa 3 ngày (1–3/11). Các mốc trước (13/10, 17/10, 18/10, 20/10, 29/10) đều đo giữa / cuối tháng 10 nên không gặp.
- Phần đã đo được trước chỗ dừng (`app.open-data`, `reload.*`, đổi kỳ / sắp / chọn dòng kỳ Năm, mở lần đầu, mở lại, Dọn sạch Thùng rác, kích thước) đều trong ngưỡng, không xấu hơn mốc sau #656. Số tạm giữ ngoài repo trên Home PC; ghi vào tài liệu nghiệm thu / số đo sau khi đo lại đủ, không thuộc task này.
- Kỳ của màn Lịch hẹn là state riêng của màn (khởi tạo ở tháng chứa hôm nay mỗi lần màn được dựng), không dùng chung với Tổng quan / Báo cáo. Bước "Tạo lịch hẹn tiếp theo" ở kỳ Tháng (`appointments.next-month`) cũng chọn lịch Đã gặp trong lịch tháng, nên cùng lỗi.

##### Tài liệu cần đọc

- `e2e/perf/probe.perf.ts`: `appointments`, `nextAppointment`, các helper `kind` / `calendar` / `inDay` / `click`, vòng chính của `test`
- `e2e/perf/README.md`: "Các bước", "Đo gì, đo thế nào"
- `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx`: lịch tháng (`monthGrid`, ô ngày và tên nút của nó), thanh kỳ (nút "Kỳ trước"); `apps/desktop/src/routes/period-labels.ts`
- `docs/testing/nghiem-thu-v1.md`: dòng NT-HN-01
- `docs/metrics/phase-6.md`: mục "Mốc Home PC sau #656" (cách đo, `PERF_BASE`)

##### File / thư mục được phép sửa

- `e2e/perf/probe.perf.ts`
- `e2e/perf/README.md`

##### Ghi chú OPEN liên quan

Không có (`node tools/notes-for.mjs --files e2e/perf/probe.perf.ts e2e/perf/README.md`: không mục nào trùng file, sổ OPEN trống @`eaa83c3`).

##### Interface / hợp đồng

- Không đổi tên thao tác, ngưỡng, biến môi trường hay định dạng JSON kết quả: `appointments.select-day-month`, `appointments.select-row-month`, `appointments.next-month` giữ tên; lần đo trước (mốc) vẫn so được.
- Bấm "Kỳ trước" để tìm tháng không tính vào thời gian đo.

##### Test chấp nhận

- [ ] Khi lịch tháng đang xem có ít hơn `PERF_RUNS` ngày có lịch Đã gặp, probe bấm "Kỳ trước" (không đo) tới tháng gần nhất có đủ, ở cả `appointments` (chọn ngày / chọn lịch kỳ Tháng) và `nextAppointment` kỳ Tháng; tháng hiện tại đủ ngày thì probe không lùi, chọn như trước.
- [ ] Lùi tối đa 12 kỳ. Không tháng nào đủ thì probe dừng ngay với thông báo nêu số ngày Đã gặp nhiều nhất tìm được, `PERF_RUNS`, và cách sửa (sinh dữ liệu tải với `--anchor` gần hôm nay, hoặc giảm `PERF_RUNS`), không chờ hết timeout của locator.
- [ ] Các thao tác khác đo như trước: Tổng quan / Báo cáo Lọc kỳ Tháng vẫn là tháng chứa hôm nay; đổi kỳ Ngày / Tuần / Tháng / Năm và các thao tác kỳ Năm không đổi.
- [ ] README ghi: Lịch hẹn kỳ Tháng đo ở tháng gần nhất (từ tháng hiện tại lùi về) có đủ `PERF_RUNS` ngày Đã gặp, vì sao (dữ liệu tải mặc định neo 12/10/2026), và giới hạn 12 kỳ.
- [ ] Chạy probe trên exe release build ở head của PR, dữ liệu tải mặc định (`node tools/load-data.mjs`, neo 12/10/2026), `PERF_RUNS=5`, `PERF_BASE` là mốc của máy chạy (Home PC: `perf-home-pc-sau-656.json`; Office Laptop: `perf.json`): probe chạy hết, đủ các thao tác như mốc. Thân PR dán bảng probe in ra, ghi máy, ngày, SHA của exe và tháng probe đã dùng cho kỳ Tháng. (Probe không chạy trong CI.)
- [ ] `pnpm e2e` xanh (`e2e/perf/stats.spec.ts` không đổi).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #984 — test: step the perf probe back to a month with enough met days (T-345)

Trạng thái: MERGED · merge 2026-11-03T12:02:18Z · commit `0212bb6a469dbcb854e07f37e727bcac894a5c77` · nhánh `task/T-345-perf-met-month` · nhãn: risk:low

Closes #983

#### Thay đổi

- `e2e/perf/probe.perf.ts`: helper `metDays()`. Ở Lịch hẹn kỳ Tháng, khi lịch tháng đang xem có ít hơn `PERF_RUNS` ngày có lịch Đã gặp, probe bấm "Kỳ trước" (bấm thường, không đo) và chờ tiêu đề "Lịch tháng …" đổi, tới tháng gần nhất có đủ; tháng hiện tại đủ thì không lùi. Dùng ở `appointments` (`appointments.select-day-month`, `appointments.select-row-month`) và `nextAppointment` kỳ Tháng (`appointments.next-month`). Probe in tháng đã dùng mỗi lần (`Lịch tháng 10/2026, 1 back: … days met`).
- Lùi tối đa 12 kỳ (`MONTHS_BACK`). Không tháng nào đủ thì dừng ngay (không chờ timeout của locator), thông báo nêu số ngày Đã gặp nhiều nhất tìm được và tháng đó, `PERF_RUNS`, cách sửa: sinh dữ liệu tải với `--anchor` gần hôm nay, nạp và đặt `PERF_BACKUP`, hoặc giảm `PERF_RUNS`.
- Không đổi tên thao tác, ngưỡng, biến môi trường hay JSON kết quả. Các thao tác khác giữ kỳ như trước: mỗi `appointments(i)` mở lại màn (kỳ về tháng chứa hôm nay) trước khi đổi kỳ Ngày / Tuần / Tháng / Năm; sau `next-month`, lịch mới tạo hôm nay đưa kỳ về tháng chứa hôm nay, nên `next-year` vẫn ở năm chứa hôm nay. Tổng quan / Báo cáo có kỳ riêng, không đụng.
- `e2e/perf/README.md`: đoạn "Lịch hẹn kỳ Tháng đo ở tháng gần nhất có đủ ngày Đã gặp" (vì sao: dữ liệu tải mặc định neo 12/10/2026; giới hạn 12 kỳ; cách sửa) và ghi chú ở dòng bảng của thao tác.

#### Test chấp nhận

- [x] **Lùi tới tháng gần nhất có đủ, ở cả `appointments` và `nextAppointment` kỳ Tháng; tháng hiện tại đủ thì không lùi.** Lần đo đủ dưới đây: cả 10 lần (5 `appointments` + 5 `nextAppointment` kỳ Tháng) in `Lịch tháng 10/2026, 1 back: 10 days met`. Không lùi: bản probe tạm (không commit, chỉ chạy `appointments(0)`) trên dữ liệu tải neo 03/11/2026, `PERF_RUNS=1` in `Lịch tháng 11/2026, 0 back: 1 days met` rồi đo `select-day-month` ở 11/2026; cùng dữ liệu, `PERF_RUNS=2` lùi về 10/2026 (`1 back: 31 days met`).
- [x] **Lùi tối đa 12 kỳ, không tháng nào đủ thì dừng ngay.** Bản probe tạm, dữ liệu tải mặc định, `PERF_RUNS=40`: dừng sau 1,1 s ở `appointments` (tính cả 7 thao tác trước đó) và 1,0 s ở `nextAppointment` kỳ Tháng, không chờ timeout:
  ```
  Error: Lịch hẹn: no month from this one to 12 back has PERF_RUNS (40) days with a met appointment (Đã gặp); the most is 30, in Lịch tháng 09/2026. Write the load data with node tools/load-data.mjs --anchor <a date near today>, import it and set PERF_BACKUP to it (e2e/perf/README.md, steps 1 and 3), or lower PERF_RUNS.
  ```
- [x] **Các thao tác khác đo như trước.** Bảng dưới đủ 36 dòng như mốc. Đổi kỳ Ngày / Tuần / Tháng / Năm, sắp và chọn dòng kỳ Năm chạy trên màn vừa mở lại (kỳ ở tháng chứa hôm nay), như trước. Tổng quan / Báo cáo Lọc kỳ Tháng dùng kỳ của màn đó, không đổi.
- [x] **README** ghi: đo ở tháng gần nhất (từ tháng hiện tại lùi về) có đủ `PERF_RUNS` ngày Đã gặp, vì sao (dữ liệu tải mặc định neo 12/10/2026), giới hạn 12 kỳ, cách sửa.
- [x] **Probe trên exe release ở head, dữ liệu tải mặc định, `PERF_RUNS=5`, `PERF_BASE` của máy chạy: chạy hết, đủ thao tác như mốc.**
  - Máy: Home PC `DESKTOP-KDURKJP`. Ngày: 03/11/2026.
  - Exe: release build ở `77a4d33` (head của PR), 5 649 408 byte, sha256 `1FCB2702…1741E17`, chép ra `C:\perf-exe\` mới (lần mở đầu sinh seed demo).
  - Dữ liệu tải: `node tools/load-data.mjs` (neo 12/10/2026, seed 6), `tables` sha256 `e256e4f1…b345a2`. Nhập trong exe (Cài đặt → Dữ liệu ghi "4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ", bằng mốc), đóng exe, mở lại cùng thư mục rồi nối probe ngay (cách của mốc).
  - `PERF_BASE=docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json`. Kỳ Tháng dùng **10/2026** (lùi 1 kỳ từ 11/2026; 10 ngày Đã gặp). Probe chạy hết trong 2,8 phút; mọi thao tác màn trong ngưỡng, không dòng nào ⚠️.
  - Số này chỉ để chứng minh probe chạy hết; số đo NT-HN-01 ghi vào tài liệu nghiệm thu / số đo ở việc riêng (Issue: "không thuộc task này").

| Thao tác | Lần | Trung vị | Min | Max | Ngưỡng | Nền | Δ |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 375 ms | 375 ms | 375 ms | — | 387 ms | −12 ms (−3%) |
| `backup.read` | 5 | 975 ms | 970 ms | 1017 ms | — | 835 ms | +140 ms (+17%) |
| `backup.import` | 5 | 43 ms | 40 ms | 50 ms | — | 43 ms | +1 ms (+1%) |
| `db.save` | 15 | 147 ms | 146 ms | 155 ms | — | 151 ms | −4 ms (−2%) |
| `reload.overview` | 5 | 396 ms | 392 ms | 450 ms | — | 398 ms | −3 ms (−1%) |
| `reload.appointments` | 5 | 388 ms | 383 ms | 399 ms | — | 391 ms | −3 ms (−1%) |
| `reload.customers` | 5 | 314 ms | 309 ms | 317 ms | — | 336 ms | −23 ms (−7%) |
| `reload.reports` | 5 | 367 ms | 365 ms | 387 ms | — | 376 ms | −9 ms (−2%) |
| `reload.team` | 5 | 352 ms | 350 ms | 366 ms | — | 355 ms | −2 ms (−1%) |
| `reload.settings` | 5 | 279 ms | 275 ms | 295 ms | — | 283 ms | −5 ms (−2%) |
| `appointments.period-day` | 5 | 6 ms | 6 ms | 9 ms | < 200 ms ✅ | 8 ms | −2 ms (−24%) |
| `appointments.period-week` | 5 | 13 ms | 13 ms | 19 ms | < 200 ms ✅ | 12 ms | +2 ms (+15%) |
| `appointments.period-month` | 5 | 5 ms | 5 ms | 5 ms | < 200 ms ✅ | 13 ms | −8 ms (−64%) |
| `appointments.period-year` | 5 | 11 ms | 10 ms | 15 ms | < 200 ms ✅ | 17 ms | −6 ms (−36%) |
| `appointments.sort-date-asc` | 5 | 17 ms | 17 ms | 21 ms | < 200 ms ✅ | 17 ms | +0 ms (+1%) |
| `appointments.sort-date-desc` | 5 | 13 ms | 12 ms | 19 ms | < 200 ms ✅ | 11 ms | +1 ms (+11%) |
| `appointments.select-row-year` | 5 | 6 ms | 6 ms | 9 ms | < 200 ms ✅ | 6 ms | +0 ms (+5%) |
| `appointments.select-day-month` | 5 | 7 ms | 3 ms | 8 ms | < 200 ms ✅ | 9 ms | −2 ms (−27%) |
| `appointments.select-row-month` | 5 | 5 ms | 4 ms | 9 ms | < 200 ms ✅ | 7 ms | −2 ms (−32%) |
| `customers.view-table` | 5 | 19 ms | 18 ms | 21 ms | < 200 ms ✅ | 20 ms | −1 ms (−3%) |
| `customers.sort-name` | 5 | 23 ms | 18 ms | 24 ms | < 200 ms ✅ | 23 ms | 0 ms (−1%) |
| `customer.open-ai` | 5 | 20 ms | 19 ms | 21 ms | < 200 ms ✅ | 19 ms | +1 ms (+6%) |
| `customer.ai-history` | 5 | 3 ms | 2 ms | 15 ms | < 200 ms ✅ | 2 ms | +1 ms (+25%) |
| `overview.filter-year` | 5 | 17 ms | 16 ms | 21 ms | < 200 ms ✅ | 16 ms | +2 ms (+10%) |
| `overview.filter-month` | 5 | 14 ms | 13 ms | 15 ms | < 200 ms ✅ | 14 ms | 0 ms (−1%) |
| `reports.filter-year` | 5 | 9 ms | 8 ms | 10 ms | < 200 ms ✅ | 10 ms | −1 ms (−6%) |
| `reports.filter-month` | 5 | 10 ms | 9 ms | 10 ms | < 200 ms ✅ | 10 ms | +0 ms (+1%) |
| `reports.table-re` | 5 | 17 ms | 17 ms | 18 ms | < 200 ms ✅ | 17 ms | +0 ms (+0%) |
| `trash.kind-appointments` | 5 | 8 ms | 7 ms | 12 ms | < 200 ms ✅ | 6 ms | +2 ms (+34%) |
| `memory.js-heap` | 1 | 16,6 MB | 16,6 MB | 16,6 MB | — | 16,5 MB | +0,1 MB (+1%) |
| `trash.open` | 5 | 33 ms | 32 ms | 35 ms | < 200 ms ✅ | 34 ms | −1 ms (−4%) |
| `reports.export-excel` | 5 | 28 ms | 18 ms | 73 ms | — | 20 ms | +9 ms (+44%) |
| `backup.export` | 5 | 429 ms | 413 ms | 438 ms | — | 438 ms | −9 ms (−2%) |
| `appointments.next-month` | 5 | 111 ms | 109 ms | 113 ms | — | 101 ms | +10 ms (+10%) |
| `appointments.next-year` | 5 | 109 ms | 105 ms | 111 ms | — | 107 ms | +1 ms (+1%) |

- [x] `pnpm e2e` xanh ở local (324 test; `e2e/perf/stats.spec.ts` không đổi).

#### Ghi chú OPEN liên quan

Không có (`node tools/notes-for.mjs --diff` @ `77a4d33`: không mục nào trùng file).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (130 file, 4 381 test)
- [x] `pnpm e2e` xanh ở local (324 test; `e2e/perf/stats.spec.ts` không đổi)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-345 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #986 — T-346: Mục sổ G7: probe hiệu năng — kỳ Năm lùi về năm có đủ lịch Đã gặp, kiểm sớm trước vòng nhập backup

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Sửa bốn mục sổ G7 của review PR #984 (T-345) ở probe hiệu năng (`docs/state/review-notes.md`, nhóm "Bốn ghi chú không chặn của review PR #984"):

1. **Kỳ Năm lùi về năm có đủ lịch Đã gặp**, như T-345 đã làm cho kỳ Tháng. Hôm nay probe chọn dòng trong danh sách **năm chứa hôm nay**; dữ liệu tải chỉ có lịch Đã gặp trong 365 ngày trước ngày neo, nên từ năm sau năm neo (dữ liệu tải mặc định: từ 01/2027) năm đó không có lịch Đã gặp nào và probe chờ hết timeout của locator. Sửa: khi năm đang xem không đủ, probe bấm "Kỳ trước" (không đo) tới năm gần nhất có đủ, rồi đo như cũ.
2. **Kiểm sớm**: thiếu tháng / năm đủ lịch Đã gặp hiện chỉ lộ ra trong `appointments(0)`, sau `PERF_RUNS` lần nhập backup và mọi `reload.*` (vài phút trên exe). Kiểm một lần (không đo) trước vòng nhập backup và dừng ngay khi không đủ.
3. NIT: thông báo khi không đủ trỏ "steps 1 and 3" cho việc đặt `PERF_BACKUP`, nhưng biến này ở bảng của bước 4 của README → "steps 1, 3 and 4".
4. NIT: trong vòng lùi kỳ của `metDays`, lần chờ tiêu đề lịch tháng hiện ra chạy mỗi vòng, dù từ vòng 2 lần chờ tiêu đề đổi chữ đã chờ nó → chờ một lần trước vòng lặp.

##### Bối cảnh

- G7, NT-HN-01. T-345 (#983, PR #984, squash `0212bb6`) cho Lịch hẹn kỳ Tháng lùi về tháng gần nhất có đủ `PERF_RUNS` ngày Đã gặp (tối đa 12 kỳ); Issue #983 chốt kỳ Năm không đổi, nên mục 1 không phải hồi quy. Review #984 (`REVIEW: PASS` @`77a4d33`) ghi bốn mục [G7] vì không Issue G7 nào đang mở cho sửa file này (PR sổ #985).
- Mục 1, hướng sửa: review nêu hai hướng (lùi năm như `metDays`, hoặc ghi giới hạn vào README). Issue này chọn **lùi năm**, cùng cơ chế với kỳ Tháng, để probe chạy được quanh năm với dữ liệu tải mặc định mà không phải sinh lại dữ liệu.
- Kỳ Năm có hai chỗ chọn dòng trong danh sách năm chứa hôm nay: `appointments.select-row-year` (sắp cột Ngày rồi chọn dòng thứ *i*) và `appointments.next-year` (sắp tăng rồi chọn dòng Đã gặp thứ *i*). Năm sau năm neo, danh sách năm đó trống (lịch hẹn sắp tới của dữ liệu tải chỉ kéo 24 ngày sau ngày neo), nên `appointments.sort-date-*` và `appointments.select-row-year` cũng hỏng như `appointments.next-year`. Cả ba thao tác cùng đo ở năm đã lùi; `appointments.period-year` (đổi kỳ) vẫn đo ở năm chứa hôm nay.
- Giới hạn lùi năm: lịch sử của dữ liệu tải dài 365 ngày và kỳ Tháng lùi tối đa 12 kỳ, nên khi kỳ Tháng đạt thì năm có lịch Đã gặp cách năm hiện tại tối đa 1 kỳ.
- Kiểm sớm đọc dữ liệu exe đang giữ (đã qua `checkLoadData`, cùng file `PERF_BACKUP` mà probe nhập lại; nhập backup và tạo lịch hẹn tiếp theo không đổi số lịch Đã gặp của tháng / năm đã qua), ở cùng Góc nhìn "Toàn bộ" mà probe đặt trước vòng nhập. Có thể tính số kỳ phải lùi một lần ở bước kiểm sớm rồi lùi đúng số đó ở mỗi thao tác, hoặc giữ vòng tìm ở mỗi thao tác; phiên làm task chọn.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: OPEN, nhóm "Bốn ghi chú không chặn của review PR #984"
- `e2e/perf/probe.perf.ts`: `metDays`, `MONTHS_BACK`, `appointments`, `nextAppointment`, các helper `kind` / `list` / `calendar` / `dateHeader` / `byDate`, vòng chính của `test` (thứ tự `connect` → `appOpen` → `checkLoadData` → Góc nhìn "Toàn bộ" → nhập backup)
- `e2e/perf/README.md`: "Các bước" (bước 1, 3, 4), đoạn "Lịch hẹn kỳ Tháng đo ở tháng gần nhất có đủ ngày Đã gặp", bảng "Đo gì, đo thế nào"
- `packages/db/src/seed.ts`: `HISTORY_DAYS`, `FUTURE_DAYS`, `SeedOptions.anchorDate` (lịch Đã gặp chỉ có trước ngày neo)
- `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx`: danh sách kỳ Năm (bảng "Danh sách lịch hẹn", sắp cột Ngày), thanh kỳ (nút "Kỳ trước")
- PR #984: thân PR (cách chạy probe trên exe, bảng đã dán)

##### File / thư mục được phép sửa

- `e2e/perf/probe.perf.ts`
- `e2e/perf/README.md`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files e2e/perf/probe.perf.ts e2e/perf/README.md` @`a76fea0`, "Trùng file" (4), gộp cả bốn vào task này:

- [G7] `e2e/perf/probe.perf.ts:443` (`nextAppointment` kỳ Năm, cùng loại lỗi T-345 sửa cho kỳ Tháng): mục 1 của Mục tiêu.
- [G7] NIT `e2e/perf/probe.perf.ts:230` (thông báo của `metDays` trỏ "steps 1 and 3"): mục 3.
- [G7] `e2e/perf/probe.perf.ts:225` (`metDays`, thiếu tháng đủ ngày Đã gặp chỉ lộ ra sau vòng nhập backup và tải lại): mục 2.
- [G7] NIT `e2e/perf/probe.perf.ts:217` (`metDays`, lần chờ tiêu đề thừa trong vòng lùi kỳ): mục 4.

##### Interface / hợp đồng

- Không đổi tên thao tác, ngưỡng, biến môi trường hay định dạng JSON kết quả; lần đo trước (mốc) vẫn so được.
- Bấm "Kỳ trước" để tìm tháng / năm, và lần kiểm sớm, không tính vào thời gian đo.
- Kỳ Tháng giữ hành vi của T-345 (tháng gần nhất có đủ `PERF_RUNS` ngày Đã gặp, tối đa 12 kỳ).

##### Test chấp nhận

- [ ] Kỳ Năm: khi năm đang xem không có đủ lịch Đã gặp cho lần đo (lần đo thứ *i* chọn dòng Đã gặp thứ *i* khi sắp tăng), probe bấm "Kỳ trước" (không đo) tới năm gần nhất có đủ, cho cả `appointments.sort-date-asc` / `-desc`, `appointments.select-row-year` và `appointments.next-year`; năm hiện tại đủ thì probe không lùi, chọn như trước. Probe in năm đã dùng và số kỳ đã lùi, như dòng của kỳ Tháng. `appointments.period-year` vẫn đo ở năm chứa hôm nay.
- [ ] Lùi năm tối đa 1 kỳ. Không năm nào đủ thì probe dừng ngay với thông báo nêu số lịch Đã gặp nhiều nhất tìm được, `PERF_RUNS`, và cách sửa, không chờ hết timeout của locator.
- [ ] Trước lần Nhập backup đầu tiên, probe kiểm (không đo) cả kỳ Tháng và kỳ Năm; không đủ thì dừng ngay với thông báo như trên, không có số đo `backup.*` nào.
- [ ] Mọi thông báo "không đủ" (kỳ Tháng, kỳ Năm) trỏ README "steps 1, 3 and 4" cho việc sinh / nạp dữ liệu tải và đặt `PERF_BACKUP`.
- [ ] Trong vòng lùi kỳ Tháng, chờ tiêu đề lịch tháng hiện ra một lần trước vòng lặp; mỗi vòng sau "Kỳ trước" chỉ chờ tiêu đề đổi chữ.
- [ ] README ghi: kỳ Năm đo ở năm gần nhất có đủ lịch Đã gặp (thao tác nào, vì sao, giới hạn 1 kỳ), bước kiểm sớm trước vòng nhập; đoạn của kỳ Tháng giữ nội dung T-345.
- [ ] Chạy probe trên exe release build ở head của PR, `PERF_BASE` là mốc của máy chạy (Home PC: `perf-home-pc-sau-656.json`; Office Laptop: `perf.json`), ghi máy, ngày, SHA của exe vào thân PR:
  - (a) dữ liệu tải mặc định (`node tools/load-data.mjs`, neo 12/10/2026), `PERF_RUNS=5`: probe chạy hết, đủ các thao tác như mốc; dán bảng probe in ra và tháng / năm probe đã dùng.
  - (b) dữ liệu tải neo ở tháng 12 năm trước (vd. `node tools/load-data.mjs --anchor 2025-12-20` khi chạy trong 11–12/2026; nạp vào exe, đặt `PERF_BACKUP` tới file đó), `PERF_RUNS=5`: probe chạy hết, kỳ Năm lùi 1 kỳ, kỳ Tháng lùi về tháng 12 năm trước; dán các dòng tháng / năm đã dùng.
  - (c) dữ liệu tải mặc định, `PERF_RUNS=40`: probe dừng trước lần Nhập backup đầu tiên, với thông báo "không đủ"; dán thông báo và thời gian chạy.
  (Probe không chạy trong CI.)
- [ ] `pnpm e2e` xanh (`e2e/perf/stats.spec.ts` không đổi).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #988 — test: step the perf probe's year back and check its periods before the imports (T-346)

Trạng thái: MERGED · merge 2026-11-03T14:12:45Z · commit `6d9ae0e86f76df0bffcefb6ae8c9178311629a52` · nhánh `task/T-346-perf-year-early-check` · nhãn: risk:low

Closes #986

#### Thay đổi

- `e2e/perf/probe.perf.ts`:
  - **Kỳ Năm lùi về năm có đủ lịch Đã gặp** (`metYear`, `toMetYear`, `YEARS_BACK = 1`): năm gần nhất, từ năm chứa hôm nay lùi về tối đa 1 kỳ, có ít nhất `PERF_RUNS` dòng Đã gặp trong danh sách năm sắp tăng, tức đúng các dòng mà `appointments.next-year` chọn (dòng thứ *i*). `appointments.sort-date-asc` / `-desc`, `appointments.select-row-year` và `appointments.next-year` đo ở năm đó; năm hiện tại đủ thì không lùi, chọn như trước. `appointments.period-year` vẫn đo ở năm chứa hôm nay (lùi sau lần đổi kỳ). Probe in năm đã dùng như dòng của kỳ Tháng (`Lịch năm …, N back: … met`). Không năm nào đủ thì dừng ngay; thông báo nêu số dòng Đã gặp nhiều nhất, năm đó, `PERF_RUNS` và cách sửa.
  - **Kiểm sớm** (`checkPeriods`): ngay sau khi đặt Góc nhìn "Toàn bộ", trước lần Nhập backup đầu tiên, probe tìm năm (`metYear`) rồi tháng (`metDays`) một lần, không đo. Không đủ thì dừng ở đó, không có số đo `backup.*` nào.
  - Cách chọn (Issue để phiên làm task chọn): kỳ Tháng giữ vòng tìm ở mỗi thao tác như T-345 (chỉ đếm nút trong lịch tháng). Kỳ Năm tìm một lần ở bước kiểm sớm, rồi mỗi thao tác lùi đúng số kỳ đó (`toMetYear`, kiểm tiêu đề "Lịch năm …" đúng năm đã tìm, để không đo nhầm năm). Lý do: muốn đếm dòng Đã gặp phải sắp danh sách, mà `appointments()` đo `sort-date-asc` / `-desc` từ thứ tự lúc màn mở (mới nhất trước).
  - Từ năm đã lùi, bấm kỳ Tháng sẽ mở tháng 1 của năm đó (`switchKind` lấy ngày đầu kỳ khi kỳ không chứa hôm nay), trong khi `metDays` lùi từ tháng chứa hôm nay. Vì vậy `appointments()` và `checkPeriods` bấm "Kỳ sau" đúng số năm đã lùi trước khi sang kỳ Tháng (`stepYears`); không lùi năm thì không bấm gì.
    - **Không dùng "Hôm nay"**: bản đầu (`be904e4`) bấm nút này. Ở ca (a) bên dưới, nút không đổi kỳ, nhưng `appointments.select-row-month` vẫn chậm đều ở cả 5 lần: 10,6–17,6 ms (trung vị 13,9), so với 4,4–8,8 ms (trung vị 4,9) ở lần đo T-345 trên cùng máy. Bỏ cú bấm thì về lại 4,1–10,7 ms (trung vị 5,1). Ca (b) quay về bằng "Kỳ sau": 4–5 ms. Không tìm ra lý do trong code của nút; comment của `stepYears` ghi lại việc này.
  - Helper `oldestFirst()` (vòng bấm cột Ngày tới sắp tăng, trước đây nằm trong `nextAppointment`), dùng ở `metYear` và `nextAppointment`. Helper `previous()` cho nút "Kỳ trước".
  - NIT: thông báo "không đủ" của kỳ Tháng và kỳ Năm dùng chung `MORE_MET`, trỏ README "steps 1, 3 and 4". Trong `metDays`, chờ tiêu đề lịch tháng hiện ra một lần trước vòng lặp; mỗi vòng sau "Kỳ trước" chỉ chờ tiêu đề đổi chữ.
- `e2e/perf/README.md`: thêm đoạn "Lịch hẹn kỳ Năm đo ở năm gần nhất có đủ lịch Đã gặp" (thao tác nào, vì sao, giới hạn 1 kỳ) và đoạn "Kiểm sớm"; hai dòng bảng ghi "năm nào: đoạn dưới bảng". Đoạn kỳ Tháng giữ nội dung T-345. Câu cuối của nó ("Các thao tác khác giữ kỳ như trước…") chuyển xuống cuối đoạn kỳ Năm, bỏ "các thao tác kỳ Năm quanh hôm nay" (nay đã sai).
- Không đổi tên thao tác, ngưỡng, biến môi trường hay JSON kết quả.

#### Test chấp nhận

- [x] **Kỳ Năm lùi tới năm gần nhất có đủ, cho cả sắp, chọn dòng và `next-year`; năm hiện tại đủ thì không lùi; in năm và số kỳ đã lùi; `period-year` ở năm chứa hôm nay.** Ca (a): `Lịch năm 2026, 0 back: 79 met`, không lùi, bảng khớp mốc. Ca (b): `Lịch năm 2025, 1 back: 80 met`; probe chạy hết, đủ 5 lần `sort-date-*`, `select-row-year`, `next-year`.
- [x] **Lùi năm tối đa 1 kỳ; không năm nào đủ thì dừng ngay.** Dữ liệu tải mặc định, `PERF_RUNS=100` (danh sách hiện 100 dòng nên không năm nào đủ): dừng sau 427 ms ở bước kiểm sớm, không chờ timeout:
  ```
  Error: Lịch hẹn: no year from this one to 1 back has PERF_RUNS (100) met appointments (Đã gặp) in its list shown oldest first; the most is 79, in Lịch năm 2026. Write the load data with node tools/load-data.mjs --anchor <a date near today>, import it and set PERF_BACKUP to it (e2e/perf/README.md, steps 1, 3 and 4), or lower PERF_RUNS.
  ```
- [x] **Kiểm sớm cả kỳ Tháng và kỳ Năm trước lần Nhập backup đầu tiên.** Ca (c) bên dưới: dừng trước lần nhập, log không có dòng `backup.*` nào. Ca (a) và (b) in dòng năm và dòng tháng của lần kiểm trước mọi số đo.
- [x] **Mọi thông báo "không đủ" trỏ README "steps 1, 3 and 4".** Xem thông báo ở ca (c) và ở ca `PERF_RUNS=100`.
- [x] **Vòng lùi kỳ Tháng chờ tiêu đề lịch tháng hiện ra một lần, trước vòng lặp.** Xem diff của `metDays`.
- [x] **README** ghi: kỳ Năm đo ở năm gần nhất có đủ lịch Đã gặp (thao tác nào, vì sao, giới hạn 1 kỳ), bước kiểm sớm trước vòng nhập. Đoạn kỳ Tháng giữ nội dung T-345.
- [x] **Probe trên exe release**, máy Home PC `DESKTOP-KDURKJP`, ngày 03/11/2026:
  - Exe: release build ở `be904e4`, 5 649 408 byte, sha256 `3312BBD4…39DEC73F2`, chép ra thư mục mới `C:\perf-exe-986\` (lần mở đầu sinh seed demo). Head `4fbb048` chỉ sửa `e2e/perf/probe.perf.ts` và `e2e/perf/README.md`, không file nào vào exe (`git diff be904e4 4fbb048 --stat`), nên exe này là exe của head. Probe chạy ở code của `4fbb048`.
  - Nạp dữ liệu: Nhập backup qua cổng debug (ô chọn file của webview, như probe), rồi kiểm dòng "Nội dung" ở Cài đặt → Dữ liệu.
  - **(a)** Dữ liệu tải mặc định (`node tools/load-data.mjs`, neo 12/10/2026, seed 6; "4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ", bằng mốc). Đóng exe, mở lại cùng thư mục rồi nối probe ngay (cách của mốc). `PERF_RUNS=5`, `PERF_BASE=docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json`. Probe chạy hết trong 2,8 phút, đủ 35 thao tác như mốc, mọi thao tác màn trong ngưỡng, không dòng ⚠️ nào. Dòng đã dùng: `Lịch năm 2026, 0 back: 79 met` (một lần, ở bước kiểm sớm) và `Lịch tháng 10/2026, 1 back: 10 days met` (11 lần: kiểm sớm + 5 `appointments` + 5 `nextAppointment` kỳ Tháng).
  - **(b)** Dữ liệu tải neo 20/12/2025 (`node tools/load-data.mjs --anchor 2025-12-20`, `tables` sha256 `9155abf2…8e29c05f`), nạp vào exe, `PERF_BACKUP=.local/load-data/load-2025-12-20-seed6.p2cbackup`, `PERF_RUNS=5`. Probe chạy hết trong 2,8 phút, 34 thao tác: không có `app.open-data`, vì trang đã tải lại sau lần nhập (README: chỉ có khi exe vừa mở). Dòng đã dùng:
    ```
    Lịch năm 2025, 1 back: 80 met
    Lịch tháng 12/2025, 11 back: 18 days met
    ```
    (dòng năm một lần; dòng tháng 11 lần như ca a)
  - **(c)** Dữ liệu tải mặc định (nạp lại), `PERF_RUNS=40`: dừng ở bước kiểm sớm, trước lần Nhập backup đầu tiên, sau 1,0 s thời gian test (cả lệnh 1,9 s):
    ```
      Lịch năm 2026, 0 back: 79 met
    Error: Lịch hẹn: no month from this one to 12 back has PERF_RUNS (40) days with a met appointment (Đã gặp); the most is 30, in Lịch tháng 09/2026. Write the load data with node tools/load-data.mjs --anchor <a date near today>, import it and set PERF_BACKUP to it (e2e/perf/README.md, steps 1, 3 and 4), or lower PERF_RUNS.
    ```
  - Số này chỉ để chứng minh probe chạy hết; số đo NT-HN-01 làm ở việc riêng của G7.

Bảng của ca (a):

| Thao tác | Lần | Trung vị | Min | Max | Ngưỡng | Nền | Δ |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 328 ms | 328 ms | 328 ms | — | 387 ms | −59 ms (−15%) |
| `backup.read` | 5 | 987 ms | 962 ms | 1088 ms | — | 835 ms | +152 ms (+18%) |
| `backup.import` | 5 | 44 ms | 43 ms | 48 ms | — | 43 ms | +1 ms (+3%) |
| `db.save` | 15 | 147 ms | 144 ms | 160 ms | — | 151 ms | −4 ms (−3%) |
| `reload.overview` | 5 | 395 ms | 390 ms | 449 ms | — | 398 ms | −3 ms (−1%) |
| `reload.appointments` | 5 | 384 ms | 382 ms | 385 ms | — | 391 ms | −7 ms (−2%) |
| `reload.customers` | 5 | 311 ms | 306 ms | 322 ms | — | 336 ms | −25 ms (−8%) |
| `reload.reports` | 5 | 366 ms | 365 ms | 378 ms | — | 376 ms | −10 ms (−3%) |
| `reload.team` | 5 | 350 ms | 348 ms | 381 ms | — | 355 ms | −5 ms (−1%) |
| `reload.settings` | 5 | 286 ms | 279 ms | 292 ms | — | 283 ms | +3 ms (+1%) |
| `appointments.period-day` | 5 | 10 ms | 6 ms | 17 ms | < 200 ms ✅ | 8 ms | +2 ms (+20%) |
| `appointments.period-week` | 5 | 12 ms | 11 ms | 14 ms | < 200 ms ✅ | 12 ms | +0 ms (+0%) |
| `appointments.period-month` | 5 | 5 ms | 5 ms | 5 ms | < 200 ms ✅ | 13 ms | −8 ms (−64%) |
| `appointments.period-year` | 5 | 10 ms | 10 ms | 12 ms | < 200 ms ✅ | 17 ms | −7 ms (−39%) |
| `appointments.sort-date-asc` | 5 | 17 ms | 17 ms | 22 ms | < 200 ms ✅ | 17 ms | +0 ms (+1%) |
| `appointments.sort-date-desc` | 5 | 12 ms | 11 ms | 23 ms | < 200 ms ✅ | 11 ms | +0 ms (+1%) |
| `appointments.select-row-year` | 5 | 6 ms | 6 ms | 8 ms | < 200 ms ✅ | 6 ms | +0 ms (+3%) |
| `appointments.select-day-month` | 5 | 7 ms | 3 ms | 7 ms | < 200 ms ✅ | 9 ms | −2 ms (−27%) |
| `appointments.select-row-month` | 5 | 5 ms | 4 ms | 5 ms | < 200 ms ✅ | 7 ms | −3 ms (−36%) |
| `customers.view-table` | 5 | 20 ms | 16 ms | 21 ms | < 200 ms ✅ | 20 ms | +0 ms (+1%) |
| `customers.sort-name` | 5 | 24 ms | 23 ms | 24 ms | < 200 ms ✅ | 23 ms | +1 ms (+5%) |
| `customer.open-ai` | 5 | 20 ms | 19 ms | 22 ms | < 200 ms ✅ | 19 ms | +1 ms (+6%) |
| `customer.ai-history` | 5 | 4 ms | 2 ms | 12 ms | < 200 ms ✅ | 2 ms | +2 ms (+105%) |
| `overview.filter-year` | 5 | 17 ms | 16 ms | 20 ms | < 200 ms ✅ | 16 ms | +1 ms (+6%) |
| `overview.filter-month` | 5 | 14 ms | 13 ms | 15 ms | < 200 ms ✅ | 14 ms | 0 ms (−3%) |
| `reports.filter-year` | 5 | 10 ms | 10 ms | 10 ms | < 200 ms ✅ | 10 ms | 0 ms (−3%) |
| `reports.filter-month` | 5 | 10 ms | 9 ms | 11 ms | < 200 ms ✅ | 10 ms | +0 ms (+0%) |
| `reports.table-re` | 5 | 18 ms | 17 ms | 18 ms | < 200 ms ✅ | 17 ms | +0 ms (+2%) |
| `trash.kind-appointments` | 5 | 8 ms | 6 ms | 13 ms | < 200 ms ✅ | 6 ms | +2 ms (+31%) |
| `memory.js-heap` | 1 | 16,6 MB | 16,6 MB | 16,6 MB | — | 16,5 MB | +0,1 MB (+1%) |
| `trash.open` | 5 | 33 ms | 32 ms | 36 ms | < 200 ms ✅ | 34 ms | −1 ms (−4%) |
| `reports.export-excel` | 5 | 20 ms | 18 ms | 68 ms | — | 20 ms | +0 ms (+1%) |
| `backup.export` | 5 | 429 ms | 420 ms | 439 ms | — | 438 ms | −10 ms (−2%) |
| `appointments.next-month` | 5 | 111 ms | 110 ms | 113 ms | — | 101 ms | +11 ms (+11%) |
| `appointments.next-year` | 5 | 108 ms | 106 ms | 125 ms | — | 107 ms | +1 ms (+1%) |

- [x] `pnpm e2e` xanh ở local (324 test, ở `be904e4`; `4fbb048` chỉ sửa probe và README của nó, `pnpm e2e` không chạy probe; `e2e/perf/stats.spec.ts` không đổi).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `4fbb048`, "Trùng file" (4), cả bốn đã sửa:

- L14 [T-346 #986] `nextAppointment` kỳ Năm chọn dòng Đã gặp ở năm chứa hôm nay: đã sửa (kỳ Năm lùi về năm có đủ, cả sắp / chọn dòng / `next-year`).
- L15 [T-346 #986] NIT thông báo của `metDays` trỏ "steps 1 and 3": đã sửa (`MORE_MET`, "steps 1, 3 and 4").
- L16 [T-346 #986] thiếu tháng đủ ngày Đã gặp chỉ lộ ra sau vòng nhập: đã sửa (`checkPeriods` trước lần Nhập backup đầu tiên, kiểm cả năm).
- L17 [T-346 #986] NIT lần chờ tiêu đề thừa trong vòng lùi kỳ: đã sửa (chờ một lần trước vòng lặp).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (130 file, 4 381 test; ở `4fbb048`)
- [x] `pnpm e2e` xanh ở local (324 test)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-346 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #984 — T-346 (#986, PR #988, `REVIEW: PASS` @`4fbb048`):
  - #984, `e2e/perf/probe.perf.ts` (`nextAppointment` kỳ Năm): `metYear` tìm năm gần nhất, từ năm chứa hôm nay lùi tối đa 1 kỳ (`YEARS_BACK`), có ít nhất `PERF_RUNS` dòng Đã gặp trong danh sách sắp tăng; `toMetYear` lùi đúng số kỳ đó trước `appointments.sort-date-*`, `appointments.select-row-year` và `appointments.next-year`; `appointments.period-year` vẫn đo ở năm chứa hôm nay. Không năm nào đủ thì dừng ngay. `e2e/perf/README.md` có đoạn "Lịch hẹn kỳ Năm đo ở năm gần nhất có đủ lịch Đã gặp".
  - #984 NIT, `e2e/perf/probe.perf.ts` (thông báo "không đủ"): kỳ Tháng và kỳ Năm dùng chung `MORE_MET`, trỏ "steps 1, 3 and 4".
  - #984, `e2e/perf/probe.perf.ts` (`checkPeriods`): trước lần Nhập backup đầu tiên, probe tìm năm (`metYear`) rồi tháng (`metDays`) một lần, không đo, và dừng ngay khi không đủ; `e2e/perf/README.md` có đoạn "Kiểm sớm".
  - #984 NIT, `e2e/perf/probe.perf.ts` (`metDays`): chờ tiêu đề lịch tháng hiện ra một lần trước vòng lặp; mỗi vòng sau "Kỳ trước" chỉ chờ tiêu đề đổi chữ.

---

# Issue #990 — T-347: Mục sổ G7: probe hiệu năng — một locator cho dòng Đã gặp kỳ Năm, kiểm tháng chứa hôm nay trước khi lùi kỳ Tháng

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Sửa hai mục sổ G7 của review PR #988 (T-346) ở probe hiệu năng (`docs/state/review-notes.md`, nhóm "Hai ghi chú không chặn của review PR #988"):

1. **Một locator cho dòng Đã gặp của kỳ Năm.** Hôm nay bước kiểm sớm (`metYear`) đếm dòng Đã gặp bằng một bản chép của locator mà `nextAppointment` kỳ Năm dùng để chọn dòng thứ *i*. Hai chỗ phải luôn là cùng một tập: sửa một bản mà quên bản kia thì bước kiểm sớm đạt trong khi `appointments.next-year` chờ hết timeout của locator, đúng lỗi T-346 gỡ. Sửa: một helper dùng chung (vd. `metRows()` cạnh `list()`), cả hai chỗ gọi nó.
2. **Kỳ Tháng kiểm tháng chứa hôm nay trước khi lùi.** Cả ba nơi gọi `metDays` (`checkPeriods`, `appointments`, `nextAppointment` kỳ Tháng) đều phải bắt đầu từ lịch tháng của tháng chứa hôm nay. Ở `nextAppointment` kỳ Tháng, từ lần thứ hai, điều đó chỉ đúng nhờ màn Lịch hẹn đưa kỳ về ngày của lịch hẹn vừa tạo ở kỳ Năm (năm chứa hôm nay), và không có kiểm. Nếu không còn đúng, với năm lùi 1 kỳ thì kỳ Tháng mở tháng 1 của năm trước và `metDays` lùi từ đó: `appointments.next-month` đo tháng khác mà không báo. Sửa: trước khi lùi, probe kiểm (không đo) lịch tháng đang ở tháng chứa hôm nay; không phải thì dừng ngay với thông báo nêu tháng đang hiện và tháng chờ đợi, như `toMetYear` đã làm cho kỳ Năm.

##### Bối cảnh

- G7, NT-HN-01. T-346 (#986, PR #988, squash `6d9ae0e`) cho kỳ Năm lùi về năm gần nhất có đủ lịch Đã gặp (`metYear`, `toMetYear`, `YEARS_BACK = 1`) và thêm bước kiểm sớm `checkPeriods` trước vòng nhập backup. Review #988 (`REVIEW: PASS` @`4fbb048`) ghi hai mục [G7] vì không Issue G7 nào đang mở cho sửa file này (PR sổ #989).
- Mục 2 hôm nay chạy đúng: ở ca (b) của PR #988 (dữ liệu tải neo 20/12/2025, năm lùi 1 kỳ), dòng tháng in "11 back" cả 11 lần, tức mọi lần đều lùi từ tháng chứa hôm nay. Mục này chỉ thêm chốt chặn để probe dừng thay vì đo nhầm tháng, không đổi số đo.
- Mục 2, chỗ đặt kiểm: đầu `metDays` thì chặn cả ba nơi gọi; chỉ trước lời gọi ở `nextAppointment` thì đúng chỗ review nêu. Phiên làm task chọn, ghi lý do ở thân PR.
- Tiêu đề lịch tháng là "Lịch tháng MM/YYYY" (`appointments.calendar`); exe và probe chạy cùng máy, nên "hôm nay" của probe và của exe là một ngày (trừ khi lần chạy vắt qua nửa đêm cuối tháng: khi đó dừng là đúng).

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: OPEN, nhóm "Hai ghi chú không chặn của review PR #988"
- `e2e/perf/probe.perf.ts`: `list`, `calendar`, `metDays`, `metYear`, `stepYears`, `toMetYear`, `checkPeriods`, `appointments`, `nextAppointment`
- `e2e/perf/README.md`: đoạn "Lịch hẹn kỳ Tháng đo ở tháng gần nhất có đủ ngày Đã gặp", "Lịch hẹn kỳ Năm đo ở năm gần nhất có đủ lịch Đã gặp", "Kiểm sớm"
- `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx`: `show` (sau khi tạo lịch hẹn), `MonthCalendar` (tiêu đề lịch tháng)
- `apps/desktop/src/routes/appointments/appointments-view.ts`: `pickDay`
- `packages/domain/src/period.ts`: `switchKind` (đổi loại kỳ lấy ngày đầu kỳ khi kỳ không chứa hôm nay)
- PR #988: thân PR (cách chạy probe trên exe, ca a / b / c)

##### File / thư mục được phép sửa

- `e2e/perf/probe.perf.ts`
- `e2e/perf/README.md`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files e2e/perf/probe.perf.ts e2e/perf/README.md` @`e85f9b8`, "Trùng file" (2), gộp cả hai vào task này:

- [G7] *Duplicated Code* `e2e/perf/probe.perf.ts:267` (`metYear`, locator dòng Đã gặp chép ở `nextAppointment`): mục 1 của Mục tiêu.
- [G7] `e2e/perf/probe.perf.ts:530` (`nextAppointment` kỳ Tháng về tháng chứa hôm nay chỉ nhờ lần tạo lịch hẹn ở kỳ Năm, không có kiểm): mục 2.

##### Interface / hợp đồng

- Không đổi tên thao tác, ngưỡng, biến môi trường hay định dạng JSON kết quả; lần đo trước (mốc) vẫn so được.
- Lần kiểm mới không bấm gì và không tính vào thời gian đo.
- Kỳ Tháng và kỳ Năm giữ hành vi của T-345 / T-346 (tháng lùi tối đa 12 kỳ, năm tối đa 1 kỳ, kiểm sớm trước vòng nhập backup).

##### Test chấp nhận

- [ ] `metYear` (đếm) và `nextAppointment` kỳ Năm (chọn dòng thứ *i*) dùng chung một helper cho dòng Đã gặp của danh sách; không còn bản chép của locator đó trong file.
- [ ] Trước khi `metDays` lùi kỳ (ở mọi nơi gọi, hoặc ít nhất ở `nextAppointment` kỳ Tháng; thân PR ghi chỗ đã chọn và lý do), probe kiểm lịch tháng đang ở tháng chứa hôm nay. Không phải thì dừng ngay, không chờ hết timeout của locator, với thông báo nêu tháng đang hiện và tháng chờ đợi.
- [ ] Nhánh lỗi của lần kiểm: chạy một lần bản probe tạm (không commit), bấm "Kỳ trước" một lần ngay trước lời gọi `metDays` có kiểm; dán thông báo probe in ra và thời gian chạy.
- [ ] README: nêu lần kiểm tháng chứa hôm nay trong đoạn của kỳ Tháng (hoặc "Kiểm sớm"), nếu chỗ đặt kiểm làm đổi điều README tả; đoạn của kỳ Tháng / kỳ Năm giữ nội dung T-345 / T-346.
- [ ] Chạy probe trên exe release build ở head của PR (hoặc exe của một commit mà từ đó tới head chỉ đổi file probe, ghi `git diff --stat`), `PERF_BASE` là mốc của máy chạy (Home PC: `perf-home-pc-sau-656.json`; Office Laptop: `perf.json`), ghi máy, ngày, SHA của exe vào thân PR:
  - (a) dữ liệu tải mặc định (`node tools/load-data.mjs`, neo 12/10/2026), `PERF_RUNS=5`: probe chạy hết, đủ các thao tác như mốc, không dòng ⚠️ mới so với lần đo của PR #988; dán bảng và các dòng tháng / năm đã dùng.
  - (b) dữ liệu tải neo ở tháng 12 năm trước (vd. `node tools/load-data.mjs --anchor 2025-12-20`; nạp vào exe, đặt `PERF_BACKUP` tới file đó), `PERF_RUNS=5`: probe chạy hết, kỳ Năm lùi 1 kỳ, mọi lần `appointments.next-month` lùi từ tháng chứa hôm nay; dán các dòng tháng / năm đã dùng.
  (Probe không chạy trong CI.)
- [ ] `pnpm e2e` xanh (`e2e/perf/stats.spec.ts` không đổi).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #992 — test: share the perf probe's met rows and check the month of today before stepping back (T-347)

Trạng thái: MERGED · merge 2026-11-03T15:43:13Z · commit `1ce3c61018772954e57d5ee15ee61ec7ca17fae7` · nhánh `task/T-347-perf-probe-met-rows` · nhãn: risk:low

Closes #990

Phiên code: coding-ses2 (auto-issues)

#### Thay đổi

- `e2e/perf/probe.perf.ts`:
  - **Một locator cho dòng Đã gặp của danh sách** (`metRows()`, cạnh `list()`): `metYear` đếm và `nextAppointment` kỳ Năm chọn dòng thứ *i* qua cùng helper. Không còn bản chép `list().getByRole('row').filter({ hasText: 'Đã gặp' })` nào trong file.
  - **Kiểm tháng chứa hôm nay trước khi lùi kỳ Tháng**, đặt ở đầu `metDays`: đọc tiêu đề lịch tháng một lần (không bấm, không chờ, không đo), so với `Lịch tháng MM/YYYY` của hôm nay theo đồng hồ máy chạy probe; khác thì dừng ngay, thông báo nêu tháng đang hiện và tháng chờ đợi.
  - **Chỗ đặt kiểm: đầu `metDays`, nên chặn cả ba nơi gọi** (`checkPeriods`, `appointments`, `nextAppointment` kỳ Tháng). Lý do: cả ba đều giả định lịch tháng mở ở tháng chứa hôm nay, mỗi nơi nhờ một điều khác của màn. `checkPeriods` và `appointments()` nhờ `switchKind` lấy tháng chứa hôm nay sau `stepYears(inYear.back)`. `nextAppointment` thì nhờ màn mở ở tháng hôm nay, và từ lần thứ hai nhờ `show()` đưa kỳ về ngày của lịch vừa tạo. Kiểm một chỗ là đúng hợp đồng của `metDays`, và cũng phủ nơi gọi thêm sau này. Lần kiểm chỉ tốn một lần đọc chữ, nằm ngoài thời gian đo.
  - Comment: `metDays` nêu lần kiểm. `nextAppointment` kỳ Tháng nêu vì sao kỳ mở ở tháng hôm nay, và rằng `metDays` kiểm điều đó. `checkPeriods`: "which metDays checks and steps back from".
- `e2e/perf/README.md`: đoạn kỳ Tháng thêm một câu về lần kiểm tháng hiện tại (đọc tiêu đề, không bấm, không đo; dừng ngay, nêu tháng đang hiện và tháng chờ đợi). Nội dung T-345 của đoạn kỳ Tháng và T-346 của đoạn kỳ Năm / "Kiểm sớm" giữ nguyên.
- Không đổi tên thao tác, ngưỡng, biến môi trường hay JSON kết quả. Kỳ Tháng vẫn lùi tối đa 12 kỳ, kỳ Năm tối đa 1 kỳ, vẫn kiểm sớm trước vòng nhập.

#### Test chấp nhận

- [x] **`metYear` và `nextAppointment` kỳ Năm dùng chung một helper cho dòng Đã gặp; không còn bản chép locator.** Xem diff (`metRows()`). `Đã gặp` chỉ còn trong `metRows`, nút ngày của `metDays` (`/Đã gặp/`) và các thông báo / comment.
- [x] **Trước khi `metDays` lùi kỳ, probe kiểm lịch tháng đang ở tháng chứa hôm nay, dừng ngay khi không phải, nêu tháng đang hiện và tháng chờ đợi.** Đặt ở đầu `metDays`, tức ở mọi nơi gọi (lý do ở trên).
- [x] **Nhánh lỗi**: bản probe tạm (không commit) bấm "Kỳ trước" một lần trong `checkPeriods`, ngay trước lời gọi `metDays` (chờ tiêu đề đổi chữ). Dữ liệu tải mặc định trong exe. Probe dừng ở bước kiểm sớm, trước lần Nhập backup đầu tiên, sau **403 ms** thời gian test (cả lệnh 1,4 s), không chờ timeout 15 s của expect / action:
  ```
    app.open-data #1: 331.6 ms
    Lịch năm 2026, 0 back: 79 met
  Error: Lịch hẹn: Tháng shows Lịch tháng 10/2026, not the month of today (Lịch tháng 11/2026) that the probe steps back from for days with a met appointment (Đã gặp): it would measure another month.
      at metDays (C:\workspace\Project-2C\e2e\perf\probe.perf.ts:242:11)
      at checkPeriods (C:\workspace\Project-2C\e2e\perf\probe.perf.ts:342:3)
  ```
  Bản tạm đã gỡ trước commit (`git diff` chỉ còn phần của PR).
- [x] **README** nêu lần kiểm trong đoạn kỳ Tháng. Đoạn kỳ Tháng / kỳ Năm giữ nội dung T-345 / T-346.
- [x] **Probe trên exe release**, máy Home PC `DESKTOP-KDURKJP`, ngày 03/11/2026:
  - Exe: release build ở `be904e4` (exe của PR #988), sha256 `3312BBD4E2722626FD81F9534DAA5FE8AB50751AD3DA00AE3BF746939DEC73F2`, ở `C:\perf-exe-986\`. Từ `be904e4` tới head `4ef5673` chỉ đổi file probe và sổ, không file nào vào exe:
    ```
    $ git diff --stat be904e4 4ef5673
     docs/state/review-notes.md | 15 ++++++-----
     e2e/perf/README.md         |  6 ++---
     e2e/perf/probe.perf.ts     | 63 ++++++++++++++++++++++++++++++++--------------
     3 files changed, 56 insertions(+), 28 deletions(-)
    ```
    Mọi lần chạy probe dưới đây (nhánh lỗi, ca a, ca b) ở cây làm việc trước commit. Cây đó chỉ khác head `4ef5673` ở chữ của một comment trong `nextAppointment`, sửa sau các lần chạy.
  - **(a)** Dữ liệu tải mặc định (`node tools/load-data.mjs`, neo 12/10/2026, seed 6; "4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ"). Đóng exe, mở lại cùng thư mục rồi nối probe ngay. `PERF_RUNS=5`, `PERF_BASE=docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json`.
    - Lần 1 chạy hết trong 2,8 phút, đủ 35 thao tác. Có **một dòng ⚠️, ở `reports.export-excel`**: trung vị 31 ms, min 20, max 67, so với nền 20 ms (+12 ms, +60 %).
      - Thao tác này đo Xuất Excel khi đã ngắt debugger. PR không đổi gì trên đường đo của nó.
      - Trên cùng exe `be904e4`, các lần chạy của T-346 cho trung vị 19,8–32,4 ms (file `.local/perf/perf-t346-a*.json`, `-b.json`); lần chạy đầu của T-346 (32,4 ms) cũng sẽ có ⚠️ này. Vì vậy đây là nhiễu.
    - Lần 2, đóng và mở lại exe: chạy hết trong 2,8 phút, đủ 35 thao tác, **không dòng ⚠️ nào**, mọi thao tác màn trong ngưỡng. Bảng ở dưới.
    - Cả hai lần, dòng đã dùng: `Lịch năm 2026, 0 back: 79 met` (một lần, ở bước kiểm sớm) và `Lịch tháng 10/2026, 1 back: 10 days met` (11 lần: kiểm sớm + 5 `appointments` + 5 `nextAppointment` kỳ Tháng). Lần kiểm mới đạt cả 11 lần.
  - **(b)** Dữ liệu tải neo 20/12/2025 (`.local/load-data/load-2025-12-20-seed6.p2cbackup`, sha256 file `1434C2EE…6EC9E1E8F4`, cùng file T-346 sinh hôm nay). Nạp vào exe qua cổng debug (ô chọn file của webview, như probe), rồi kiểm dòng "Nội dung": "4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ". `PERF_BACKUP` tới file đó, `PERF_RUNS=5`. Probe chạy hết trong 2,8 phút, 34 thao tác (không có `app.open-data`: trang đã tải lại sau lần nhập). Dòng đã dùng:
    ```
    Lịch năm 2025, 1 back: 80 met
    Lịch tháng 12/2025, 11 back: 18 days met
    ```
    Dòng năm in một lần. Dòng tháng in 11 lần, đều "11 back", tức mọi lần `appointments.next-month` (và `appointments()`, kiểm sớm) lùi từ tháng chứa hôm nay. Sau ca (b) đã nạp lại dữ liệu tải mặc định vào exe, như trước khi chạy.
  - Số này chỉ để chứng minh probe chạy hết. Số đo NT-HN-01 làm ở việc riêng của G7.

Bảng của ca (a), lần 2:

| Thao tác | Lần | Trung vị | Min | Max | Ngưỡng | Nền | Δ |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 343 ms | 343 ms | 343 ms | — | 387 ms | −44 ms (−11%) |
| `backup.read` | 5 | 975 ms | 957 ms | 987 ms | — | 835 ms | +140 ms (+17%) |
| `backup.import` | 5 | 45 ms | 42 ms | 54 ms | — | 43 ms | +2 ms (+4%) |
| `db.save` | 15 | 147 ms | 146 ms | 154 ms | — | 151 ms | −4 ms (−2%) |
| `reload.overview` | 5 | 398 ms | 395 ms | 449 ms | — | 398 ms | +0 ms (+0%) |
| `reload.appointments` | 5 | 384 ms | 384 ms | 394 ms | — | 391 ms | −6 ms (−2%) |
| `reload.customers` | 5 | 313 ms | 310 ms | 315 ms | — | 336 ms | −23 ms (−7%) |
| `reload.reports` | 5 | 369 ms | 366 ms | 379 ms | — | 376 ms | −7 ms (−2%) |
| `reload.team` | 5 | 352 ms | 349 ms | 366 ms | — | 355 ms | −3 ms (−1%) |
| `reload.settings` | 5 | 281 ms | 277 ms | 288 ms | — | 283 ms | −3 ms (−1%) |
| `appointments.period-day` | 5 | 8 ms | 6 ms | 10 ms | < 200 ms ✅ | 8 ms | 0 ms (−1%) |
| `appointments.period-week` | 5 | 12 ms | 11 ms | 14 ms | < 200 ms ✅ | 12 ms | +0 ms (+0%) |
| `appointments.period-month` | 5 | 5 ms | 4 ms | 5 ms | < 200 ms ✅ | 13 ms | −8 ms (−64%) |
| `appointments.period-year` | 5 | 10 ms | 10 ms | 12 ms | < 200 ms ✅ | 17 ms | −7 ms (−40%) |
| `appointments.sort-date-asc` | 5 | 19 ms | 17 ms | 24 ms | < 200 ms ✅ | 17 ms | +2 ms (+11%) |
| `appointments.sort-date-desc` | 5 | 12 ms | 11 ms | 13 ms | < 200 ms ✅ | 11 ms | +0 ms (+2%) |
| `appointments.select-row-year` | 5 | 6 ms | 6 ms | 8 ms | < 200 ms ✅ | 6 ms | +0 ms (+7%) |
| `appointments.select-day-month` | 5 | 7 ms | 3 ms | 7 ms | < 200 ms ✅ | 9 ms | −2 ms (−27%) |
| `appointments.select-row-month` | 5 | 5 ms | 5 ms | 6 ms | < 200 ms ✅ | 7 ms | −2 ms (−35%) |
| `customers.view-table` | 5 | 19 ms | 17 ms | 21 ms | < 200 ms ✅ | 20 ms | −1 ms (−3%) |
| `customers.sort-name` | 5 | 23 ms | 23 ms | 24 ms | < 200 ms ✅ | 23 ms | +1 ms (+2%) |
| `customer.open-ai` | 5 | 20 ms | 19 ms | 22 ms | < 200 ms ✅ | 19 ms | +1 ms (+6%) |
| `customer.ai-history` | 5 | 3 ms | 2 ms | 18 ms | < 200 ms ✅ | 2 ms | +1 ms (+25%) |
| `overview.filter-year` | 5 | 17 ms | 16 ms | 21 ms | < 200 ms ✅ | 16 ms | +2 ms (+10%) |
| `overview.filter-month` | 5 | 14 ms | 13 ms | 15 ms | < 200 ms ✅ | 14 ms | 0 ms (−3%) |
| `reports.filter-year` | 5 | 10 ms | 9 ms | 10 ms | < 200 ms ✅ | 10 ms | 0 ms (−2%) |
| `reports.filter-month` | 5 | 10 ms | 7 ms | 10 ms | < 200 ms ✅ | 10 ms | +0 ms (+2%) |
| `reports.table-re` | 5 | 17 ms | 15 ms | 18 ms | < 200 ms ✅ | 17 ms | 0 ms (−1%) |
| `trash.kind-appointments` | 5 | 8 ms | 7 ms | 13 ms | < 200 ms ✅ | 6 ms | +2 ms (+32%) |
| `memory.js-heap` | 1 | 16,6 MB | 16,6 MB | 16,6 MB | — | 16,5 MB | +0,1 MB (+1%) |
| `trash.open` | 5 | 32 ms | 31 ms | 37 ms | < 200 ms ✅ | 34 ms | −2 ms (−5%) |
| `reports.export-excel` | 5 | 28 ms | 20 ms | 82 ms | — | 20 ms | +8 ms (+41%) |
| `backup.export` | 5 | 435 ms | 427 ms | 446 ms | — | 438 ms | −3 ms (−1%) |
| `appointments.next-month` | 5 | 112 ms | 108 ms | 114 ms | — | 101 ms | +12 ms (+12%) |
| `appointments.next-year` | 5 | 108 ms | 107 ms | 111 ms | — | 107 ms | +1 ms (+1%) |

- [x] `pnpm e2e` xanh ở local (324 test, ở `4ef5673`; `e2e/perf/stats.spec.ts` không đổi).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `4ef5673`, "Trùng file" (2), cả hai đã sửa:

- L14 [T-347 #990] *Duplicated Code* `e2e/perf/probe.perf.ts:267` (`metYear`, locator dòng Đã gặp chép ở `nextAppointment`): đã sửa (`metRows()` dùng chung cho đếm và chọn).
- L15 [T-347 #990] `e2e/perf/probe.perf.ts:530` (`nextAppointment` kỳ Tháng về tháng chứa hôm nay không có kiểm): đã sửa (kiểm ở đầu `metDays`, chặn cả ba nơi gọi; comment ở `nextAppointment` nêu sự phụ thuộc).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local (130 file, 4 381 test; ở `4ef5673`)
- [x] `pnpm e2e` xanh ở local (324 test)
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-347 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #988 — T-347 (#990, PR #992, `REVIEW: PASS` @`4ef5673`):
  - #988 (*Duplicated Code*), `e2e/perf/probe.perf.ts` (`metYear`, `nextAppointment` kỳ Năm): helper `metRows()` cạnh `list()` (`list().getByRole('row').filter({ hasText: 'Đã gặp' })`); `metYear` đếm và `nextAppointment` kỳ Năm chọn dòng thứ *i* qua cùng helper, file không còn bản chép của locator.
  - #988, `e2e/perf/probe.perf.ts` (`metDays`, `nextAppointment` kỳ Tháng): đầu `metDays`, trước khi lùi, probe đọc tiêu đề lịch tháng một lần (không bấm, không chờ, không đo) và so với "Lịch tháng MM/YYYY" của hôm nay; khác thì dừng ngay, thông báo nêu tháng đang hiện và tháng chờ đợi. Kiểm ở đầu `metDays` nên chặn cả ba nơi gọi (`checkPeriods`, `appointments`, `nextAppointment` kỳ Tháng); comment ở `nextAppointment` nêu vì sao kỳ mở ở tháng chứa hôm nay. `e2e/perf/README.md` thêm câu về lần kiểm vào đoạn kỳ Tháng. Nhánh lỗi chạy tay bằng bản probe tạm ở thân PR #992 (dừng ở bước kiểm sớm sau 403 ms thời gian test).

---

# Issue #994 — T-348: Ghi số đo NT-HN-01 trên Home PC (G7)

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Ghi kết quả NT-HN-01 (hiệu năng trên exe release, Home PC) vào tài liệu nghiệm thu và số đo Phase 6: probe đủ 35 thao tác so với mốc của máy, mở lần đầu / mở lại, Dọn sạch Thùng rác đo tay, `size-report`.

##### Bối cảnh

- G7 (HANDOFF, "Bước kế tiếp chính xác" 1): NT-HN-01 đo lại đủ trên Home PC bằng probe đã sửa (T-345…T-347). Lần đo 03/11 trên exe `eaa83c3` dừng ở `appointments.select-day-month` (lý do của T-345); phần đo được giữ ngoài repo.
- Owner 03/11/2026 bảo đo lại đủ, so với mốc `perf-home-pc-sau-656.json`, đo tay Dọn sạch, chạy lại `size-report`, rồi ghi số.
- Đã đo 03/11/2026 23:01–23:08 trên Home PC `DESKTOP-KDURKJP`, exe release build tại máy ở `main` `233c77e`, dữ liệu tải mặc định (neo 12/10/2026, seed 6), `PERF_RUNS=5`. Cách đo như lượt 4 (một script: mở lần đầu ×3, nạp dữ liệu tải, mở lại ×3, probe, Dọn sạch). Bằng chứng (log, JSON) giữ ngoài repo trên Home PC.
- Kết quả: probe chạy hết, không dòng nào ⚠️ so mốc sau #656, mọi thao tác trong ngưỡng.

##### Tài liệu cần đọc

- `docs/testing/nghiem-thu-v1.md`: "Ghi kết quả", "Các lượt thử", dòng NT-HN-01
- `docs/metrics/phase-6.md`: "Thời gian thao tác" (ngưỡng), "Bộ nhớ webview", "Kích thước", "Mốc Home PC sau #656", "Số đo deep review lượt 4"
- `e2e/perf/README.md`: "Đo gì, đo thế nào", "Đọc kết quả"

##### File / thư mục được phép sửa

- `docs/testing/nghiem-thu-v1.md`
- `docs/metrics/phase-6.md`

##### Ghi chú OPEN liên quan

Không có (`node tools/notes-for.mjs --files docs/testing/nghiem-thu-v1.md docs/metrics/phase-6.md` @`233c77e`: sổ OPEN trống).

##### Interface / hợp đồng

Chỉ tài liệu. Không đổi ngưỡng, mốc (`perf-home-pc-sau-656.json` vẫn là mốc của Home PC), tên thao tác hay mã dòng nghiệm thu.

##### Test chấp nhận

- [ ] `phase-6.md` có mục số đo G7 NT-HN-01: máy, ngày, SHA và cỡ / sha256 của exe, dữ liệu tải (`tables` sha256, Nội dung sau khi nhập), cách đo, kỳ Tháng / kỳ Năm probe đã dùng; bảng probe 35 thao tác so mốc sau #656 kèm ngưỡng; mở lần đầu (LCP, 3 lần) so số tham chiếu; mở lại (3 lần) so ngưỡng ≤ 1 s; Dọn sạch so ngưỡng ≤ 500 ms; kích thước so lượt 4 và `b139d8a`, phần tăng có giải thích.
- [ ] Mọi số trong tài liệu khớp output của lần đo (probe, `first-open`, mở lại, `purge-exe`, `size-report`).
- [ ] `nghiem-thu-v1.md`: dòng NT-HN-01 có kết quả theo luật "Ghi kết quả" và trỏ tới mục số đo; bảng "Các lượt thử" có lượt đó.
- [ ] Đoạn mở đầu của `phase-6.md` nhắc mục mới.

##### Định nghĩa hoàn thành

- [ ] PR docs (không chạy CI)
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #995 — docs: record the NT-HN-01 measurements on Home PC (T-348)

Trạng thái: MERGED · merge 2026-11-03T16:18:52Z · commit `ffdea655d81b4395e2e433f2f4d3e396e2dbeaf1` · nhánh `task/T-348-nt-hn-01-home-pc` · nhãn: risk:low

Closes #994

#### Thay đổi

- `docs/metrics/phase-6.md`: mục mới "Số đo G7, NT-HN-01 (T-348, 03/11/2026)" trước "Kiểm tra trên `main`": máy, code, exe (cỡ, sha256), dữ liệu tải, cách đo, bảng probe 35 thao tác so mốc sau #656 kèm ngưỡng, bảng đo ngoài probe (mở lần đầu, mở lại, Dọn sạch, `trash.open` trước / sau), ghi chú các dòng tăng, bảng kích thước so `b139d8a` và lượt 4. Đoạn mở đầu nhắc mục mới.
- `docs/testing/nghiem-thu-v1.md`: bảng "Các lượt thử" điền L1 (03/11/2026, Home PC, exe `233c77e`, dữ liệu tải, phạm vi NT-HN-01); dòng NT-HN-01: `L1 ✅` và tóm tắt số kèm trỏ tới mục mới.

Cách gán lượt: chưa lượt thử nào được ghi, nên lần đo này là L1 với phạm vi NT-HN-01; lượt Owner nghiệm thu các dòng khác lấy số kế tiếp (luật "Ghi kết quả": các lượt nối nhau trong cùng ô).

#### Lần đo

Home PC `DESKTOP-KDURKJP`, 03/11/2026 23:01–23:08. `main` `233c77e`, `pnpm build:exe` tại máy: 5 649 408 byte, sha256 `94443F0772637B9694B4AB7954C67D41A0E439C5A32F46E0C75DF2662D468115`. Dữ liệu tải `node tools/load-data.mjs` mặc định (neo 12/10/2026, seed 6), `tables` sha256 `e256e4f18699f4a4e494b59a92ef46865eb4d2c9887f4ff1e7a6b872b4b345a2`. Một script như lượt 4 (`deep-review-1-6-r4\common\perf\run-exe.ps1`, thêm 3 lần mở lại như lần đo dừng giữa chừng trước đó cùng ngày): mở lần đầu ×3 → nhập dữ liệu tải → mở lại ×3 → mở lại, probe (`PERF_RUNS=5`, `PERF_BASE=docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json`) → Dọn sạch trên exe. Log và JSON ở Home PC `C:\workspace\g7-home-pc\lan-2\`.

Probe in kỳ đã dùng: `Lịch năm 2026, 0 back: 79 met`; `Lịch tháng 10/2026, 1 back: 10 days met`. `1 passed (2.8m)`.

Ngoài probe (`perf\run-exe.log`, `perf\first-open.log`, `perf\purge-exe.log`):

```
first-open  run1 launchToLcp 3420  demoSeed 2825  dataOpen 2978  dbSave 123
            run2 launchToLcp 3408  demoSeed 2847  dataOpen 2994  dbSave 123
            run3 launchToLcp 3462  demoSeed 2904  dataOpen 3050  dbSave 121
reopen      run1 launchToLcp 625   dataOpen 326
            run2 launchToLcp 605   dataOpen 317
            run3 launchToLcp 617   dataOpen 316
purge       trash.open before 32.0 / 30.6 / 30.1 ms; trash.purge 130.5 ms (save 150.4 ms); after 1.9 / 1.9 / 2.0 ms
            db bytes 14102528 → 13438976; content before = after: 4 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ
```

`node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` (sau `pnpm build:exe`, `233c77e`): exe 5 649 408 (+235 008); JS / CSS 2 366 449 (+2 166; `index.js` 892 177, `index.css` 30 295); tệp khác 1 022 121 (+172 925); dòng code sản phẩm 39 055, test 55 734.

#### Test chấp nhận

- [x] `phase-6.md` có mục số đo G7 NT-HN-01 đủ các phần của Issue (máy, ngày, exe, dữ liệu tải, cách đo, kỳ probe dùng, bảng probe so mốc kèm ngưỡng, mở lần đầu / mở lại / Dọn sạch so ngưỡng, kích thước có giải thích).
- [x] Số khớp output lần đo (bảng probe chép nguyên từ bảng `tables.mjs` in so mốc sau #656, chỉ đổi tên cột cuối thành "Ngưỡng"; số ngoài probe ở khối trên).
- [x] `nghiem-thu-v1.md`: NT-HN-01 có `L1 ✅` và trỏ tới mục số đo; "Các lượt thử" có L1.
- [x] Đoạn mở đầu của `phase-6.md` nhắc mục mới.

#### Ghi chú OPEN liên quan

Không có (`node tools/notes-for.mjs --diff` @`806bdab`: không ghi chú OPEN nào nêu hai file này).

#### Kiểm tra

- [x] PR chỉ sửa `docs/**` (không phải file trong `CODE_DOCS`): không chạy CI, không cần `pnpm verify`; `prettier --check` hai file xanh
- [x] Không thêm dependency
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-348 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #997 — T-349: Mục sổ G7: số đo NT-HN-01 — Ghi chú NT-HN-01 không chép số, Cách đo nêu bước mở lại mới so lượt 4

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Sửa hai mục sổ G7 của review PR #995 (T-348) ở tài liệu số đo NT-HN-01 (`docs/state/review-notes.md`, nhóm "Hai ghi chú không chặn của review PR #995"):

1. **Ghi chú của NT-HN-01 không chép số.** Ở `docs/testing/nghiem-thu-v1.md`, đoạn L1 trong cột Ghi chú của NT-HN-01 chép số kết quả và hai ngưỡng ("mở lần đầu 3 420 ms, mở lại 617 ms (≤ 1 s), Dọn sạch Thùng rác 130,5 ms (≤ 500 ms) … bundle +8 022 B"). Câu đầu §14 của file lại ghi "Một dòng mỗi mục, không chép số: số nền và ngưỡng ở `docs/metrics/phase-6.md`". Sửa: đoạn L1 chỉ giữ kết quả bằng chữ và câu trỏ tới mục số đo.
2. **Cách đo nêu bước mới so lượt 4.** Ở `docs/metrics/phase-6.md`, mục "Số đo G7, NT-HN-01", dòng **Cách đo** ghi "như lượt 4" rồi liệt kê bước 3 "mở lại trên dữ liệu tải 3 lần", nhưng lượt 4 không có bước này. Sửa: dòng đó nói rõ bước 3 là bước thêm so lượt 4.

##### Bối cảnh

- G7, NT-HN-01. T-348 (#994, PR #995, squash `ffdea65`) ghi số đo NT-HN-01 trên Home PC. Review #995 (`REVIEW: PASS` @`806bdab`, mức low) ghi hai mục không chặn, gắn [G7] vì không Issue G7 nào đang mở cho sửa hai file này (PR sổ #996).
- Owner 03/11/2026: "tạo issue cho các task open". OPEN chỉ còn hai mục này, cùng gốc T-348 và đều là sửa chữ trong tài liệu, nên gom vào một Issue.
- Lượt 4 đo trên exe theo bốn việc: mở lần đầu ×3, nhập dữ liệu tải, probe, Dọn sạch; không đo mở lại (`docs/reviews/raw/2026-10-31/common-baseline.md`, mục "Đo trên exe (bước 7…)"). Bảng "Đo ngoài probe" của mục G7 cũng ghi mốc mở lại là "chưa đo cách này".
- Không đổi số đo nào. Số đủ vẫn nằm ở `phase-6.md` mục "Số đo G7, NT-HN-01".
- Hai file nằm ngoài rào "không tự sửa" của `auto-issues`, nên pipeline nhận được.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: OPEN, nhóm "Hai ghi chú không chặn của review PR #995"
- `docs/testing/nghiem-thu-v1.md`: "Ghi kết quả", "Các lượt thử", câu đầu §14 và dòng NT-HN-01
- `docs/metrics/phase-6.md`: mục "Số đo G7, NT-HN-01 (T-348, 03/11/2026)"
- `docs/reviews/raw/2026-10-31/common-baseline.md`: mục "Đo trên exe (bước 7…)" (cách đo của lượt 4)

##### File / thư mục được phép sửa

- `docs/testing/nghiem-thu-v1.md`
- `docs/metrics/phase-6.md`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files docs/testing/nghiem-thu-v1.md docs/metrics/phase-6.md` @`d8baa36`, "Trùng file" (2), gộp cả hai vào task này:

- [G7] `docs/testing/nghiem-thu-v1.md:385` (cột Ghi chú của NT-HN-01 chép số kết quả và ngưỡng, trái câu đầu §14): mục 1 của Mục tiêu.
- [G7] NIT `docs/metrics/phase-6.md:249` (dòng **Cách đo** của mục "Số đo G7, NT-HN-01" ghi "như lượt 4", nhưng bước 3 (mở lại 3 lần) lượt 4 không có): mục 2.

##### Interface / hợp đồng

Chỉ tài liệu. Không đổi số đo, ngưỡng, mốc, mã dòng nghiệm thu hay kết quả `L1 ✅` của NT-HN-01; bảng "Các lượt thử" giữ nguyên.

##### Test chấp nhận

- [ ] Cột Ghi chú của NT-HN-01: đoạn L1 không còn số đo hay ngưỡng (ms, byte, "≤ …", "+… B"). Đoạn giữ kết quả bằng chữ: probe chạy hết, không dòng nào ⚠️ so `perf-home-pc-sau-656.json`; mở lần đầu, mở lại, Dọn sạch Thùng rác trong ngưỡng; kích thước tăng có giải thích. Đoạn giữ cả câu trỏ tới `phase-6.md` mục "Số đo G7, NT-HN-01". Phần đầu của ô (ngưỡng mở lần đầu, số tham chiếu ở mục "Mở app lần đầu, đo lại") không đổi.
- [ ] Dòng **Cách đo** của mục "Số đo G7, NT-HN-01" ở `phase-6.md` nói rõ bước 3 (mở lại trên dữ liệu tải 3 lần) là bước thêm so lượt 4. Các bước, bảng và số khác của mục không đổi.
- [ ] Thân PR trả lời hai mục "Trùng file" (đã sửa).

##### Định nghĩa hoàn thành

- [ ] PR docs (không chạy CI); `prettier --check` hai file xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #999 — docs: drop the NT-HN-01 numbers from the acceptance note and mark the extra reopen step (T-349)

Trạng thái: MERGED · merge 2026-11-03T17:04:38Z · commit `570b1105d8e3106c446037ab8cd61a07ce903945` · nhánh `task/T-349-nt-hn-01-notes` · nhãn: type:task, risk:low

Closes #997

#### Thay đổi

- `docs/testing/nghiem-thu-v1.md`, cột Ghi chú của NT-HN-01: đoạn L1 bỏ số đo và ngưỡng (3 420 ms, 617 ms (≤ 1 s), 130,5 ms (≤ 500 ms), +8 022 B). Giữ kết quả bằng chữ: probe chạy hết 35 thao tác, không dòng nào ⚠️ so `perf-home-pc-sau-656.json`; mở lần đầu, mở lại, Dọn sạch Thùng rác trong ngưỡng; exe bằng lượt 4, bundle tăng có giải thích; câu trỏ "Số đủ: `phase-6.md` mục "Số đo G7, NT-HN-01"" giữ nguyên. Phần đầu của ô (ngưỡng mở lần đầu, số tham chiếu) không đổi. "35 thao tác" là số dòng của bảng probe, không phải số đo hay ngưỡng (hướng sửa của mục sổ giữ nó).
- `docs/metrics/phase-6.md`, mục "Số đo G7, NT-HN-01", dòng **Cách đo**: "như lượt 4, thêm bước 3 (mở lại 3 lần; lượt 4 không đo mở lại), …". Lượt 4 chỉ có bốn việc: mở lần đầu ×3, nhập dữ liệu tải, probe, Dọn sạch (`docs/reviews/raw/2026-10-31/common-baseline.md`, mục "Đo trên exe (bước 7…)"). Các bước, bảng và số khác không đổi.

Không đổi số đo, ngưỡng, mốc, mã dòng hay kết quả `L1 ✅`; bảng "Các lượt thử" giữ nguyên.

#### Test chấp nhận

- [x] Cột Ghi chú của NT-HN-01: đoạn L1 không còn số đo hay ngưỡng (ms, byte, "≤ …", "+… B"); giữ kết quả bằng chữ và câu trỏ tới `phase-6.md` mục "Số đo G7, NT-HN-01"; phần đầu của ô không đổi.
- [x] Dòng **Cách đo** của mục "Số đo G7, NT-HN-01" nói rõ bước 3 (mở lại trên dữ liệu tải 3 lần) là bước thêm so lượt 4; các bước, bảng và số khác không đổi.
- [x] Thân PR trả lời hai mục "Trùng file" (mục dưới).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @`12140d3`, "Trùng file" (2):

- L14 **[T-349 #997]** `docs/testing/nghiem-thu-v1.md:385` (cột Ghi chú của NT-HN-01 chép số kết quả và ngưỡng): đã sửa.
- L15 **[T-349 #997]** NIT `docs/metrics/phase-6.md:249` (dòng **Cách đo** ghi "như lượt 4" nhưng bước 3 lượt 4 không có): đã sửa.

#### Kiểm tra

- [x] PR chỉ sửa `docs/**` (không chạy CI, không gọi `pnpm verify`); `pnpm exec prettier --check docs/testing/nghiem-thu-v1.md docs/metrics/phase-6.md` xanh
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-349 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #995 — T-349 (#997, PR #999, `REVIEW: PASS` @`4474752`):
  - #995, `docs/testing/nghiem-thu-v1.md:385` (cột Ghi chú của NT-HN-01): đoạn L1 bỏ số đo và ngưỡng, chỉ giữ kết quả bằng chữ (probe chạy hết 35 thao tác, không dòng nào ⚠️ so `perf-home-pc-sau-656.json`; mở lần đầu, mở lại, Dọn sạch Thùng rác trong ngưỡng; exe bằng lượt 4, bundle tăng có giải thích) và câu trỏ "Số đủ: `phase-6.md` mục "Số đo G7, NT-HN-01"". Phần đầu của ô và kết quả `L1 ✅` không đổi.
  - #995 (NIT), `docs/metrics/phase-6.md:249` (mục "Số đo G7, NT-HN-01", dòng **Cách đo**): thành "như lượt 4, thêm bước 3 (mở lại 3 lần; lượt 4 không đo mở lại), …". Các bước, bảng và số khác của mục không đổi.

---

# Issue #1001 — T-350: Thùng rác ghi lịch Dự kiến đã qua là Chưa ghi kết quả (NT-TR-07)

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Ở Thùng rác, một lịch **Dự kiến** có ngày trước hôm nay đang ghi "Dự kiến", trong khi mọi màn khác ghi nó là **Chưa ghi kết quả**. Sửa để nó ghi "Chưa ghi kết quả" ở hai chỗ:

- dòng của lịch trong cột "Bản ghi";
- dòng "Trạng thái" của hộp khôi phục.

Lỗi tìm thấy ở lượt nghiệm thu L2, dòng **NT-TR-07**, trên exe ứng viên `1ce3c61` (artifact CI run 41666800294, exe 1.0.0) tại Home PC `DESKTOP-KDURKJP`, ngày 04/11/2026. Các bước:

1. Seed demo neo 04/11/2026. Bấm **+ Lịch hẹn** và nhập bù một lịch ngày đã qua: 01/11/2026 10:00, một KH bất kỳ. Lịch hiện ở nhóm **Chưa ghi kết quả**.
2. Xóa lịch đó. Hộp xóa ghi "Chưa ghi kết quả".
3. Vào Cài đặt → Thùng rác. Dòng của lịch ghi "01/11/2026 10:00 · Dự kiến".
4. Bấm **Khôi phục…**. Dòng Trạng thái của hộp ghi "Dự kiến", còn khung hệ quả ghi "Không đổi nhóm KH" (đúng).
5. Khôi phục. Lịch về lại nhóm Chưa ghi kết quả (đúng).

Phần khôi phục chạy đúng. Chỉ nhãn ở bước 3 và 4 trái với các màn khác. Lỗi nhỏ về giao diện, nên gắn `risk:low` theo mục "Ghi kết quả" của `nghiem-thu-v1.md`.

##### Bối cảnh

- Spec Phase 6, TR-5 và ca E11: lịch Dự kiến ngày đã qua khôi phục được và hiện ở "chưa ghi kết quả".
- Mọi màn khác hiện trạng thái lịch qua `statusLabel(a, today)` của `appointments-view.ts`. Hàm này gọi lịch Dự kiến trước hôm nay là "Chưa ghi kết quả" và chỉ đổi phần hiển thị, trạng thái lưu giữ nguyên. Các màn đó gồm danh sách và chi tiết ở Lịch hẹn, hộp xóa, hộp dời lịch, hộp lịch hẹn và hồ sơ KH.
- `trash-view.ts` thì in thẳng trạng thái lưu, `t(\`appointmentStatus.${row.status}\`)`, không xét ngày. Có hai chỗ như vậy: `recordTitle` (dòng 87) và `appointmentRestore` (dòng 419).
- **Mockup lệch với quy tắc trên.** Ở `trash.html`, dòng lịch "06/10/2026 14:00 · Dự kiến" (của KH Trịnh Minh Anh, đã xóa) vẽ một lịch đã qua là "Dự kiến". Lịch đó bị xóa ngày 08/10/2026, và các dòng của màn đã xóa tới 10/10/2026. Vì nhãn và mockup mâu thuẫn, Issue này đã chờ Owner chọn hướng (G3). **Owner 04/11/2026 chọn (a)** (comment trên Issue):
  - **(a), Owner chọn.** App ghi "Chưa ghi kết quả" như mọi màn khác. Sửa dòng đó của `trash.html` trong cùng PR.
  - **(b), không chọn.** Giữ "Dự kiến", tức trạng thái lưu, như mockup. Khi đó không sửa code: thêm một mục vào "Lệch mockup đã biết" của `nghiem-thu-v1.md` và đóng Issue.
- Phần dưới viết cho hướng (a).

##### Tài liệu cần đọc

- `docs/testing/nghiem-thu-v1.md`: dòng NT-TR-07 (cột Ghi chú, đoạn L2), mục "Ghi kết quả", mục "Lệch mockup đã biết"
- `docs/design/phase-6-hoan-thien.md`: TR-5, TR-8, ca E11 ở bảng ca khôi phục, mục cột "Bản ghi"
- `docs/design/mockups/trash.html`: dòng lịch "06/10/2026 14:00 · Dự kiến"
- `apps/desktop/src/routes/trash-view.ts`: `recordTitle`, `restoreView` / `appointmentRestore`
- `apps/desktop/src/routes/appointments/appointments-view.ts`: `statusLabel`, `appointmentGroup`
- `apps/desktop/src/routes/SettingsTrash.tsx` (đã có `useToday`), `apps/desktop/src/routes/RestoreDialog.tsx`
- `apps/desktop/src/routes/trash-view.test.ts`

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/trash-view.ts`
- `apps/desktop/src/routes/trash-view.test.ts`
- `apps/desktop/src/routes/SettingsTrash.tsx`
- `apps/desktop/src/routes/RestoreDialog.tsx`
- `docs/design/mockups/trash.html` (chỉ dòng lịch nói trên, hướng a)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files apps/desktop/src/routes/trash-view.ts apps/desktop/src/routes/trash-view.test.ts apps/desktop/src/routes/SettingsTrash.tsx apps/desktop/src/routes/RestoreDialog.tsx` @`9a2e25f`: không có ghi chú OPEN nào nêu các file này.

##### Interface / hợp đồng

- `recordTitle` và `restoreView` nhận thêm `today: CalendarDate`. `SettingsTrash.tsx` truyền `useToday()` vào cả chỗ vẽ cột "Bản ghi" lẫn chỗ dùng nó làm giá trị cột (dòng 106). `RestoreDialog.tsx` cũng truyền ngày hôm nay.
- Quy tắc nhãn lấy đúng quy tắc của `statusLabel` / `appointmentGroup` (lịch Dự kiến có ngày trước hôm nay thì ghi "Chưa ghi kết quả"), không viết một quy tắc thứ hai. Dùng chung hàm có sẵn, hoặc tách phần so ngày ra một hàm dùng chung nếu kiểu dòng Thùng rác không khớp `AppointmentRecord`.
- Không đổi trạng thái lưu, luật khôi phục, khung hệ quả ("Không đổi nhóm KH") hay thông báo sau khi khôi phục.

##### Test chấp nhận

- [ ] Lịch Dự kiến có ngày trước hôm nay: `recordTitle` cho "dd/mm/yyyy HH:MM · Chưa ghi kết quả", và có ngày, không giờ khi lịch không có giờ. Dòng Trạng thái của `restoreView` ghi "Chưa ghi kết quả".
- [ ] Lịch Dự kiến hôm nay hoặc sau hôm nay vẫn ghi "Dự kiến" ở cả hai chỗ.
- [ ] Lịch Đã gặp, Không đến, Dời lịch, Hủy không đổi nhãn. Lịch Đã gặp vẫn hiện kết quả và nhóm như cũ.
- [ ] Khung hệ quả của lịch Dự kiến đã qua vẫn là "Không đổi nhóm KH". Khôi phục xong, lịch ở nhóm Chưa ghi kết quả.
- [ ] Dòng lịch "06/10/2026 14:00" của `trash.html` ghi "Chưa ghi kết quả".

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #1011 — fix: write a past planned appointment as unrecorded in Thùng rác (T-350)

Trạng thái: MERGED · merge 2026-11-04T03:12:16Z · commit `3d237b0d2b795599d27e6ce00421f0eeffa53c9a` · nhánh `task/T-350-trash-overdue-label` · nhãn: risk:low

Closes #1001

Phiên code: coding-ses2 (auto-issues)

#### Thay đổi

Thùng rác ghi lịch **Dự kiến** có ngày trước hôm nay là **Chưa ghi kết quả**, như mọi màn khác (NT-TR-07, Owner chọn hướng (a) ngày 04/11/2026). Trạng thái lưu, luật khôi phục, khung hệ quả và thông báo sau khôi phục giữ nguyên.

- `trash-view.ts`: `recordTitle(row, today)` và `restoreView(row, today)` (qua `appointmentRestore`) ghi trạng thái lịch bằng `statusLabel(row, today).text` của `appointments-view.ts`, tức đúng quy tắc của `appointmentGroup`. Không có quy tắc thứ hai. `restoreLabel(row, coded, today)` nhận thêm `today` vì tên nút "Khôi phục…" đọc từ dòng đầu của "Bản ghi" (`recordTitle`), để tên nút vẫn khớp chữ trong ô.
- `SettingsTrash.tsx`: `trashColumns` nhận `today` (`useToday()` đã có) và truyền vào cả ô "Bản ghi" (`RecordCell`), giá trị cột (`value`) lẫn tên nút. `useMemo` của cột phụ thuộc thêm `today`.
- `RestoreDialog.tsx`: gọi `useToday()` rồi truyền vào `restoreView`.
- `docs/design/mockups/trash.html`: dòng lịch "06/10/2026 14:00 · Dự kiến" thành "06/10/2026 14:00 · Chưa ghi kết quả". Chỉ đổi dòng đó, theo hướng (a) của Issue.

##### File ngoài danh sách của Issue (P-2)

Hai chỗ chỉ đổi kiểu, không đổi hành vi. Dòng Thùng rác (`TrashRow` kind `appointment`) có `date` và `status` nhưng không phải `AppointmentRecord` / `Appointment`, nên không truyền thẳng vào hàm có sẵn được. Issue mục "Interface" cho tách phần so ngày ra hàm dùng chung trong trường hợp này. Tôi nới kiểu tham số để dùng lại đúng hàm có sẵn, thay cho ép kiểu hay viết lại phép so ngày:

- `packages/domain/src/appointment-counts.ts`: `appointmentGroup(appointment: Pick<Appointment, 'status' | 'date'>, today)`. Hàm vốn chỉ đọc hai trường này. Mọi lời gọi cũ vẫn truyền `Appointment` đầy đủ.
- `apps/desktop/src/routes/appointments/appointments-view.ts`: `statusLabel(a: Pick<AppointmentRecord, 'status' | 'date'>, today)`, cùng lý do.

##### Phạm vi kiểm

- E2E không đổi: bản build e2e ghim hôm nay ở 15/09/2026, và lịch bị xóa trong `e2e/trash.spec.ts` là lịch hôm nay, nên vẫn ghi "Dự kiến" (dòng 145, 232, 279, 303).
- Không đổi chuỗi i18n: dùng lại `appointments.statusUnrecorded` qua `statusLabel`.

#### Test chấp nhận

Test ở `apps/desktop/src/routes/trash-view.test.ts`. Hằng `TODAY` = 11/10/2026, ngày của Thùng rác mockup 11a (sau lần xóa cuối 10/10/2026), nay dùng chung ở đầu file thay cho hằng cùng giá trị trong `describe('restoreRow')`.

- [x] Lịch Dự kiến có ngày trước hôm nay: `recordTitle` cho "dd/mm/yyyy HH:MM · Chưa ghi kết quả", và chỉ có ngày khi lịch không có giờ. Dòng Trạng thái của `restoreView` ghi "Chưa ghi kết quả". Các test: "a planned appointment before today: no outcome recorded yet, with or without a time", "E11: another appointment leaves the stage", và tên nút ở "names an appointment or a policy by its day, its status and its customer".
- [x] Lịch Dự kiến hôm nay hoặc sau hôm nay vẫn ghi "Dự kiến" ở cả hai chỗ: "a planned appointment of today or later: still planned", "E11: a planned appointment of today or later is still planned", và tên nút với hôm nay 06/10.
- [x] Lịch Đã gặp, Không đến, Dời lịch, Hủy không đổi nhãn: "an appointment of another status before today: its status, as before", "E11: an appointment of another status before today keeps its status". Lịch Đã gặp vẫn hiện kết quả và nhóm như cũ: các test E5, E7, E18 và `recordDetail`, chạy với `TODAY` sau ngày gặp.
- [x] Khung hệ quả của lịch Dự kiến đã qua vẫn là "Không đổi nhóm KH". Khôi phục xong, lịch ở nhóm Chưa ghi kết quả: "E11: a planned appointment of a past day reads and comes back as no outcome recorded yet". Test này dùng DB thật: nhập bù lịch 08/10/2026 10:00, xóa, đọc ở `listTrash`, kiểm dòng "Bản ghi" và hộp khôi phục, rồi `restoreRow`. Sau đó lịch vẫn `SCHEDULED` và `appointmentGroup` = `unrecorded`.
- [x] Dòng lịch "06/10/2026 14:00" của `trash.html` ghi "Chưa ghi kết quả": `grep -n "06/10/2026 14:00" docs/design/mockups/trash.html` → dòng 192 `06/10/2026 14:00 · Chưa ghi kết quả`. Fixture `planned` của test là dòng này, và `recordTitle(planned, TODAY)` cũng cho đúng chữ đó.

Test đỏ trước khi sửa code: 5 test hỏng, đều vì nhận "Dự kiến" ở chỗ cần "Chưa ghi kết quả".

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @`587a3df` (7 file): không có ghi chú OPEN nào nêu các file này.

- Không có

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-350 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #1002 — T-351: Ghi kết quả nghiệm thu lượt L2 trên exe ứng viên 1ce3c61 (G7)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Ghi kết quả lượt nghiệm thu **L2** vào danh sách nghiệm thu v1.0. Lượt chạy ngày 04/11/2026 tại Home PC `DESKTOP-KDURKJP`, trên exe ứng viên `1ce3c61` (artifact CI run 41666800294, exe 1.0.0).

Cần ghi ba thứ:

- Mỗi dòng đã chạy có một mục `L2 …` ở cột Đạt / Lỗi.
- Các dòng đặc biệt có ghi chú `L2: …` ở cột Ghi chú.
- Bảng "Các lượt thử" có thêm một dòng L2.

##### Bối cảnh

- G7. Owner 04/11/2026: "nghiệm thu trên exe ứng viên (nghiem-thu-v1.md)". L1 (T-348) chỉ có NT-HN-01.
- Cách chạy: Claude điều khiển exe qua cổng debug của WebView2 (CDP, như probe `e2e/perf`). NT-EX-05 dùng phím và nút chuột thật của Windows. NT-DB dùng PowerShell trong thư mục thử riêng. NT-EX-08/09 nâng cấp từ exe Phase 5 `3d6c7fc`.
- Kết quả: 222 ✅ · 1 ⚠️ · 1 ❌ · 18 —. NT-HN-01 đã đo ở L1, không chạy lại.
  - **❌ NT-TR-07**: Thùng rác ghi lịch đã qua chưa ghi kết quả là "Dự kiến". Lỗi ở #1001 (T-350, `risk:low`, chờ Owner chọn hướng vì mockup `trash.html` cũng vẽ "Dự kiến").
  - **⚠️ NT-LH-19**: gõ `29/02` trong năm 2026 thì app báo "Ngày này không tồn tại.". Code đúng DR-39 (chỉ gợi ý khi năm sau có 29/02), nhưng dòng nghiệm thu và mockup 6b ghi câu "Năm 2026 không có ngày 29/02…". Owner quyết sửa dòng / mockup hay sửa app. Task này chỉ ghi kết quả, không đổi dòng.
  - **18 dòng `L2 —`** cần Owner làm:
    - Office Laptop, Windows Sandbox, hai máy: NT-EX-02, 03, 10, 11, 12.
    - OpenCode / ChatGPT: NT-AI-15, 21, 22, 23, 25; NT-DB-06.
    - Key thật của máy: NT-CA-04–07.
    - Tốn hạn mức: NT-EV-01.
    - Đối chiếu hướng dẫn: NT-HD-01.
    - USB: NT-DB-16.
- Mục "Ghi kết quả" của file: kết quả lượt thử commit qua PR docs sửa đúng file này.

##### Tài liệu cần đọc

- `docs/testing/nghiem-thu-v1.md`: "Cách dùng" (Dữ liệu, Ghi kết quả, Các lượt thử), mọi dòng `NT-*`, "Lệch mockup đã biết"

##### File / thư mục được phép sửa

- `docs/testing/nghiem-thu-v1.md`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files docs/testing/nghiem-thu-v1.md` @`9a2e25f`: không có ghi chú OPEN nào nêu file này.

##### Interface / hợp đồng

Chỉ tài liệu. Không đổi mã dòng, cột Thao tác hay Kết quả mong đợi của dòng nào. Mục L1 của NT-HN-01 giữ nguyên.

Thêm một ý vào mục "Dữ liệu" vì cả lượt dựa vào nó: seed vừa sinh không có lịch Chưa ghi kết quả (tạo bằng nhập bù), và seed có KH trùng tên (chọn KH theo mã K-xxxx).

##### Test chấp nhận

- [ ] Mỗi dòng `NT-*`, trừ NT-HN-01, có đúng một mục `L2` ở cột Đạt / Lỗi: 222 ✅, NT-LH-19 ⚠️, NT-TR-07 `❌ #1001`, 18 dòng `—`. Mỗi dòng `—` ghi lý do ở Ghi chú.
- [ ] Bảng "Các lượt thử" có dòng L2 với ngày, máy, SHA exe kèm run CI, dữ liệu, phạm vi, kết quả khớp số trên.
- [ ] Ghi chú `L2:` của NT-LH-19, NT-TR-07, NT-AI-03 (dòng ghi thừa liên kết "Xem ở Dữ kiện KYC →"), NT-LH-28 (chỉ đúng khi lịch dời là hôm nay / đã qua) nêu đúng điều thấy trên exe.
- [ ] `prettier --check docs/testing/nghiem-thu-v1.md` xanh. Mỗi dòng bảng vẫn đủ cột.

##### Định nghĩa hoàn thành

- [ ] PR docs (không chạy CI)
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #1003 — docs: record acceptance run L2 on the release candidate exe (T-351)

Trạng thái: MERGED · merge 2026-11-04T00:34:11Z · commit `ccea84fcb455ebcd54f0ed0f87e787e7c761d431` · nhánh `task/T-351-nghiem-thu-l2` · nhãn: type:task, risk:low

Closes #1002

#### Thay đổi

PR chỉ sửa `docs/testing/nghiem-thu-v1.md`:

- **Dữ liệu:** thêm một ý. Seed vừa sinh không có lịch Chưa ghi kết quả, nên các dòng cần nó (NT-LH-03, 21, 22, 26, NT-TR-07, NT-TM-15) tạo lịch đó bằng **+ Lịch hẹn** với ngày đã qua (nhập bù). Seed có KH trùng tên, nên chọn KH theo mã K-xxxx.
- **Các lượt thử:** thêm dòng L2.
  - 04/11/2026, Home PC.
  - Exe `1ce3c61` (artifact CI run 41666800294, exe 1.0.0, SHA256 `AAC1ADF4…FC59`); exe Phase 5 `3d6c7fc` cho NT-EX-08/09.
  - Dữ liệu: seed demo, thêm dữ liệu tải cho NT-DB-03 và 05.
  - Cách chạy và phạm vi: mọi dòng, trừ NT-HN-01 (đã đo ở L1) và các dòng cần Owner.
  - Kết quả: 222 ✅ · 1 ⚠️ · 1 ❌ · 18 —.
- **Cột Đạt / Lỗi:** 242 dòng có thêm mục `L2 …`, nối sau mục cũ của ô theo luật "Ghi kết quả". NT-HN-01 giữ nguyên `L1 ✅`.
- **Cột Ghi chú:** các dòng đặc biệt có thêm ghi chú `L2: …`.
  - **NT-TR-07 ❌ #1001:** nhãn "Dự kiến" ở Thùng rác cho lịch đã qua chưa ghi kết quả. Mockup `trash.html` cũng vẽ như vậy, nên Issue chờ Owner chọn hướng.
  - **NT-LH-19 ⚠️:** `29/02` năm 2026 báo "Ngày này không tồn tại." theo DR-39, lệch câu của dòng và mockup 6b. Chờ Owner.
  - **NT-AI-03, NT-LH-28:** dòng ghi chưa khớp app; app đúng.
  - **NT-TQ-12, NT-CD-05, NT-CD-06, NT-CH-09, NT-EX-01, 05, 13, NT-AI-24, NT-TR-22, NT-DB-03, 05:** phần đã làm, và phần Owner nhìn hoặc làm tay.
  - **NT-EX-08, 09:** nâng cấp từ Phase 5.
  - **NT-TQ-01:** màn đầu là màn dùng cuối (`p2c.lastRoute`).
  - **18 dòng `L2 —`:** mỗi dòng ghi lý do và "Owner".

Không đổi mã dòng, cột Thao tác hay Kết quả mong đợi của dòng nào.

#### Lượt L2

Claude điều khiển exe thật trong `C:\nghiem-thu\L2` qua cổng debug của WebView2 (`--remote-debugging-port`, Playwright `connectOverCDP`), như probe `e2e/perf`. Dữ liệu là seed demo neo 04/11/2026.

- **NT-EX-05:** gửi phím và nút chuột thật của Windows (SendKeys, keybd_event, mouse_event XBUTTON).
- **NT-DB:** làm bằng PowerShell trong thư mục thử riêng `C:\nghiem-thu\ben`: khóa file, chỉ đọc, ACL cấm ghi, file hỏng, tắt cứng lúc nhập / xuất.
- **NT-EX-08/09:** KH tạo trên exe Phase 5 `3d6c7fc`, rồi mở bằng exe v1.0.
- Provider AI luôn là Mock. Không bấm Phân tích hay Kiểm tra kết nối với OpenCode. Không đọc, ghi hay xóa key của Credential Manager.

Dòng ❌ / ⚠️:

- **NT-TR-07:** khôi phục đúng, nhưng dòng Thùng rác và hộp khôi phục ghi "01/11/2026 10:00 · Dự kiến", trong khi hộp xóa ghi "Chưa ghi kết quả". Nguyên nhân: `trash-view.ts:87` và `:419` dùng trạng thái lưu, còn các màn khác dùng `statusLabel(a, today)` → #1001 (T-350).
- **NT-LH-19:** các ý khác đạt (`5/1`, `28-9`, `25:00`, Trigger, không tạo khi lỗi). Riêng `29/02` thì lệch câu như trên.

#### Test chấp nhận

- [x] Mỗi dòng `NT-*`, trừ NT-HN-01, có đúng một mục `L2` ở cột Đạt / Lỗi: 222 ✅, NT-LH-19 ⚠️, NT-TR-07 `❌ #1001`, 18 dòng `—` có lý do ở Ghi chú. Đếm bằng script trên 243 dòng của file.
- [x] Bảng "Các lượt thử" có dòng L2, kết quả khớp số trên.
- [x] Ghi chú `L2:` của NT-LH-19, NT-TR-07, NT-AI-03, NT-LH-28 nêu đúng điều thấy trên exe.
- [x] `prettier --check docs/testing/nghiem-thu-v1.md` xanh. Mỗi dòng bảng vẫn đủ 8 phần khi tách bằng `|`.

#### Ghi chú OPEN liên quan

Không có (`node tools/notes-for.mjs --diff` @`252c3d1`: không có ghi chú OPEN nào nêu file này).

#### Kiểm tra

- [x] PR chỉ sửa `docs/**`, không phải file trong `CODE_DOCS`: không chạy CI, không cần `pnpm verify`. `prettier --check` xanh.
- [x] Không thêm dependency.
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`.

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-351 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #1004 — T-352: Mục sổ G7: nghiệm thu sau L2 — mục Dữ liệu, phạm vi dòng L2, chú giải ⚠️, NT-AI-03 và bảng cổng KYC của hướng dẫn

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Sửa các mục sổ G7 của review PR #1003 (T-351) ở danh sách nghiệm thu, để lượt cuối G7 không vấp lại đúng những chỗ lượt L2 đã thấy (sổ ghi chú review, nhóm "Ba ghi chú không chặn của review PR #1003", các mục `[T-352]`):

1. **Mục "Dữ liệu" thiếu hai dòng.** Ý "Seed vừa sinh không có lịch Chưa ghi kết quả" liệt kê các dòng cần lịch đó: NT-LH-03, 21, 22, 26, NT-TR-07, NT-TM-15. Danh sách thiếu NT-LH-15 và NT-KH-09, hai dòng có Thao tác cũng cần một lịch Chưa ghi kết quả. Thêm hai mã này.
2. **Dòng L2 của "Các lượt thử" chưa nêu phần Owner của các dòng ✅.** Ô Phạm vi ghi "mọi dòng trừ NT-HN-01 (đo ở L1) và các dòng cần Owner (`L2 —`)". Nhưng theo cột Ghi chú, còn 6 dòng `L2 ✅` có một phần Owner phải làm hoặc tự nhìn:
   - NT-CH-09: kéo tay cửa sổ về nhỏ nhất;
   - NT-CD-06: file > 100 MB;
   - NT-AI-24: OpenCode / ChatGPT web;
   - NT-EX-01: SmartScreen;
   - NT-EX-05: menu chuột phải;
   - NT-EX-13: icon ở taskbar / Alt+Tab / thanh tiêu đề.

   Ô Phạm vi nêu tên 6 dòng này.
3. **Chú giải "Ghi kết quả" chưa có ⚠️.** L2 ghi NT-LH-19 là `L2 ⚠️`, nhưng chú giải chỉ có ✅, ❌ #n và —. Thêm ⚠️ kèm nghĩa của nó.
4. **NT-AI-03 ghi thừa một liên kết.** Kết quả mong đợi của NT-AI-03 (cổng `KYC_INSUFFICIENT`) có "**Xem ở Dữ kiện KYC →** (cuộn tới thẻ)". Mockup `ai.html` 2c không có liên kết này; chỉ 2b (cổng mâu thuẫn) có. App cũng chỉ hiện nó ở cổng mâu thuẫn. Bỏ ý này khỏi dòng.

   Hướng dẫn sử dụng có cùng lỗi: bảng "Cổng KYC" ở mục "Khi nào phân tích được" của chương KYC Intelligence đặt "Bấm **Xem ở Dữ kiện KYC →**" ở hàng `KYC_INSUFFICIENT`. Chuyển ý đó sang hàng `CONFLICT_RESOLUTION`, để NT-HD-01 (đối chiếu hướng dẫn với exe) không vấp.

##### Bối cảnh

- G7. T-351 (#1002, PR #1003, squash `ccea84f`) ghi kết quả lượt nghiệm thu L2 trên exe ứng viên `1ce3c61`. Review #1003 (`REVIEW: PASS` @`252c3d1`, mức low) có ba ghi chú không chặn.
- Owner 04/11/2026: "tạo issue cho các mục open mới".
- Ghi chú thứ ba của review nêu ba dòng mà ghi chú `L2:` nói lệch app. Sau khi #1002 đóng, không Issue nào theo dõi ba dòng này.
  - NT-AI-03 không cần Owner chọn: dòng trái mockup đã duyệt (2c), còn app theo mockup. Dòng này nằm ở Issue này.
  - NT-LH-19 và NT-LH-28 cần Owner chọn sửa dòng hay sửa app, nên tách ra Issue riêng T-353 (#1005, nhãn `gate`).
- Lỗi của hướng dẫn sử dụng tìm thấy khi viết Issue này, cùng gốc với NT-AI-03. `KycIntelligence` chỉ hiện liên kết `aiPanel.toKyc` khi cổng là `CONFLICT_RESOLUTION`.
- Không đổi kết quả của lượt L2: dòng nào cũng giữ mục `L2` của nó.
- Cả hai file nằm ngoài rào "không tự sửa" của `auto-issues`, nên pipeline nhận được.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: OPEN, nhóm "Ba ghi chú không chặn của review PR #1003" (các mục `[T-352]`)
- `docs/testing/nghiem-thu-v1.md`: "Dữ liệu", "Ghi kết quả", "Các lượt thử" (dòng L2); dòng NT-LH-15, NT-KH-09, NT-AI-03; cột Ghi chú của 6 dòng ở mục 2 của Mục tiêu
- `docs/design/mockups/ai.html`: khối 2b, 2c
- `docs/user-guide/06-ai.md`: mục "Khi nào phân tích được" (bảng "Cổng KYC")
- `apps/desktop/src/routes/customers/KycIntelligence.tsx`: khối báo cổng chặn (liên kết `aiPanel.toKyc`)

##### File / thư mục được phép sửa

- `docs/testing/nghiem-thu-v1.md`
- `docs/user-guide/06-ai.md` (chỉ bảng "Cổng KYC")

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs 1004` (sổ @ `5974e61`, sau PR sổ #1006) ra 4 mục "Trùng file", đều của review #1003:

- L14 [T-352 #1004]: danh sách dòng cần lịch Chưa ghi kết quả ở mục "Dữ liệu" thiếu NT-LH-15, NT-KH-09. **Gộp**: mục 1 của Mục tiêu.
- L15 [T-352 #1004]: ô Phạm vi của dòng L2 chưa nêu 6 dòng ✅ còn phần Owner. **Gộp**: mục 2.
- L17 [T-352 #1004]: NT-AI-03 ghi thừa liên kết; chú giải "Ghi kết quả" chưa có ⚠️; cùng lỗi liên kết ở bảng "Cổng KYC" của hướng dẫn. **Gộp**: mục 3 và 4.
- L18 [T-353 #1005]: NT-LH-19 và NT-LH-28 lệch app. **Để lại**: chờ Owner chọn hướng ở T-353 (nhãn `gate`). Hai Issue cùng sửa danh sách nghiệm thu nhưng ở các dòng khác nhau.

##### Interface / hợp đồng

Chỉ tài liệu.

- Không đổi mã dòng hay cột Thao tác của dòng nào, cũng không đổi mục `L1` / `L2` ở cột Đạt / Lỗi. Chỉ NT-AI-03 đổi Kết quả mong đợi.
- Ghi chú `L2:` của NT-AI-03 giữ nguyên, thêm một câu cho biết dòng đã sửa ở T-352.
- Bảng "Các lượt thử": chỉ ô Phạm vi của dòng L2 đổi. Ô Kết quả giữ "222 ✅ · 1 ⚠️ NT-LH-19 · 1 ❌ NT-TR-07 (#1001) · 18 —".
- Ở hướng dẫn, chỉ chuyển ý "Bấm **Xem ở Dữ kiện KYC →**" giữa hai hàng. Câu báo của hai cổng giữ nguyên, kể cả liên kết tới mục Mâu thuẫn.

##### Test chấp nhận

- [ ] Ý "Seed vừa sinh không có lịch Chưa ghi kết quả" của mục "Dữ liệu" nêu đủ 8 dòng có Thao tác cần lịch Chưa ghi kết quả: NT-LH-03, 15, 21, 22, 26, NT-KH-09, NT-TR-07, NT-TM-15.
- [ ] Ô Phạm vi của dòng L2 ở "Các lượt thử" nêu 6 dòng ✅ còn phần Owner: NT-CH-09, NT-CD-06, NT-AI-24, NT-EX-01, NT-EX-05, NT-EX-13. Ô Kết quả không đổi.
- [ ] Chú giải "Ghi kết quả" có ⚠️ kèm nghĩa: dòng hoặc mockup lệch app, chờ Owner chọn sửa bên nào; Ghi chú nêu lệch gì.
- [ ] Kết quả mong đợi của NT-AI-03 không còn "Xem ở Dữ kiện KYC →", phần còn lại của ô không đổi. Ghi chú `L2:` của dòng còn nguyên và có câu nói dòng đã sửa ở T-352.
- [ ] Bảng "Cổng KYC" của hướng dẫn: hàng `CONFLICT_RESOLUTION` có "**Xem ở Dữ kiện KYC →**", hàng `KYC_INSUFFICIENT` không có. Câu báo của hai cổng không đổi.
- [ ] `prettier --check` hai file xanh. Mỗi dòng bảng `NT-*` vẫn đủ 8 phần khi tách bằng `|`.
- [ ] Thân PR trả lời các mục "Trùng file" của `notes-for --diff`.

##### Định nghĩa hoàn thành

- [ ] PR docs (không chạy CI); `prettier --check` hai file xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #1007 — docs: fix the acceptance list after run L2 and the KYC gate table of the guide (T-352)

Trạng thái: MERGED · merge 2026-11-04T02:32:18Z · commit `46ffe6294f3859ef71ec4d9e55e5bab4d996f200` · nhánh `task/T-352-l2-acceptance-notes` · nhãn: type:task, risk:low

Closes #1004

Phiên code: coding-ses2 (auto-issues)

#### Thay đổi

Sửa các mục sổ `[T-352]` của review PR #1003 (lượt nghiệm thu L2). PR chỉ sửa hai file docs.

`docs/testing/nghiem-thu-v1.md`:

- **Dữ liệu:** ý "Seed vừa sinh không có lịch Chưa ghi kết quả" thêm NT-LH-15 và NT-KH-09. Danh sách nay đủ 8 dòng: NT-LH-03, 15, 21, 22, 26, NT-KH-09, NT-TR-07, NT-TM-15.
- **Ghi kết quả:** chú giải cột Đạt / Lỗi thêm `L1 ⚠️`: dòng hoặc mockup lệch app, chờ Owner chọn sửa bên nào; Ghi chú nêu lệch gì.
- **Các lượt thử, dòng L2:** ô Phạm vi thêm một câu nêu 6 dòng `L2 ✅` còn phần Owner làm hoặc tự nhìn:
  - NT-CH-09: kéo tay cửa sổ về nhỏ nhất;
  - NT-CD-06: file > 100 MB;
  - NT-AI-24: OpenCode / ChatGPT web;
  - NT-EX-01: SmartScreen;
  - NT-EX-05: menu chuột phải;
  - NT-EX-13: icon ở taskbar / Alt+Tab / thanh tiêu đề.

  Ô Kết quả không đổi.
- **NT-AI-03:** Kết quả mong đợi bỏ "+ **Xem ở Dữ kiện KYC →** (cuộn tới thẻ)". Mockup `ai.html` 2c không có liên kết này, chỉ 2b có. App cũng chỉ hiện liên kết ở cổng mâu thuẫn (`KycIntelligence.tsx`, `conflict && …`). Ghi chú `L2:` giữ nguyên, thêm câu "Dòng đã sửa ở T-352: bỏ liên kết khỏi Kết quả mong đợi". Mục `L2 ✅` giữ nguyên.

`docs/user-guide/06-ai.md`, bảng "Cổng KYC": chuyển "Bấm **Xem ở Dữ kiện KYC →**" từ hàng `KYC_INSUFFICIENT` sang hàng `CONFLICT_RESOLUTION`. Câu báo của hai cổng giữ nguyên, kể cả liên kết tới mục Mâu thuẫn.

Không đổi mã dòng, cột Thao tác, hay mục `L1` / `L2` ở cột Đạt / Lỗi của dòng nào.

#### Test chấp nhận

Kiểm bằng script node: đọc hai file, tách ô theo `|`, so từng điều kiện dưới (16/16 ok).

- [x] Ý "Seed vừa sinh không có lịch Chưa ghi kết quả" nêu đủ 8 dòng: NT-LH-03, 15, 21, 22, 26, NT-KH-09, NT-TR-07, NT-TM-15.
- [x] Ô Phạm vi của dòng L2 nêu NT-CH-09, NT-CD-06, NT-AI-24, NT-EX-01, NT-EX-05, NT-EX-13. Ô Kết quả vẫn là "222 ✅ · 1 ⚠️ NT-LH-19 · 1 ❌ NT-TR-07 (#1001) · 18 —".
- [x] Chú giải "Ghi kết quả" có ⚠️ kèm nghĩa: dòng hoặc mockup lệch app, chờ Owner chọn sửa bên nào; Ghi chú nêu lệch gì.
- [x] Kết quả mong đợi của NT-AI-03 không còn "Xem ở Dữ kiện KYC →", phần còn lại của ô không đổi. Ghi chú `L2:` còn nguyên và có câu nói dòng đã sửa ở T-352.
- [x] Bảng "Cổng KYC": hàng `CONFLICT_RESOLUTION` có "**Xem ở Dữ kiện KYC →**", hàng `KYC_INSUFFICIENT` không có. Câu báo của hai cổng không đổi.
- [x] `prettier --check` hai file xanh. Mỗi dòng bảng `NT-*` vẫn đủ 8 phần khi tách bằng `|`.
- [x] Thân PR trả lời các mục "Trùng file" của `notes-for --diff` (mục dưới).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @`5974e61`) ra 4 mục "Trùng file":

- L14 [T-352 #1004], mục "Dữ liệu" thiếu NT-LH-15, NT-KH-09: **đã sửa**.
- L15 [T-352 #1004], ô Phạm vi của dòng L2 chưa nêu 6 dòng ✅ còn phần Owner: **đã sửa**.
- L17 [T-352 #1004], NT-AI-03 ghi thừa liên kết; chú giải chưa có ⚠️; cùng lỗi ở bảng "Cổng KYC" của hướng dẫn: **đã sửa** cả ba ý.
- L18 [T-353 #1005], NT-LH-19 và NT-LH-28 lệch app: **để lại**. Chờ Owner chọn sửa dòng hay sửa app ở T-353 (nhãn `gate`). PR này không đụng hai dòng đó.

#### Kiểm tra

- [x] PR chỉ sửa `docs/**`, không có file trong `CODE_DOCS`: không chạy CI. `pnpm verify` xanh ở local, `prettier --check` hai file xanh.
- [x] Không thêm dependency.
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`.

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-352 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #1003 — T-352 (#1004, PR #1007, `REVIEW: PASS` @`9e96338`):
  - #1003, `docs/testing/nghiem-thu-v1.md:23` (mục "Dữ liệu", ý "Seed vừa sinh không có lịch Chưa ghi kết quả"): danh sách thêm NT-LH-15 và NT-KH-09, nay đủ 8 dòng (NT-LH-03, 15, 21, 22, 26, NT-KH-09, NT-TR-07, NT-TM-15).
  - #1003, `docs/testing/nghiem-thu-v1.md:39` (dòng L2 của "Các lượt thử"): ô Phạm vi thêm một câu nêu 6 dòng `L2 ✅` còn phần Owner làm hoặc tự nhìn, mỗi dòng kèm phần đó: NT-CH-09, NT-CD-06, NT-AI-24, NT-EX-01, NT-EX-05, NT-EX-13. Ô Kết quả không đổi.
  - #1003, `docs/testing/nghiem-thu-v1.md:204` (NT-AI-03) và `:29` (chú giải "Ghi kết quả"): Kết quả mong đợi bỏ "+ **Xem ở Dữ kiện KYC →** (cuộn tới thẻ)"; ghi chú `L2:` giữ nguyên, thêm câu "Dòng đã sửa ở T-352: bỏ liên kết khỏi Kết quả mong đợi". Chú giải thêm `L1 ⚠️` (dòng hoặc mockup lệch app, chờ Owner chọn sửa bên nào; Ghi chú nêu lệch gì). Phần T-352 gộp thêm: bảng "Cổng KYC" của `docs/user-guide/06-ai.md` (`:29`, `:30`) chuyển "Bấm **Xem ở Dữ kiện KYC →**" từ hàng `KYC_INSUFFICIENT` sang hàng `CONFLICT_RESOLUTION`; câu báo của hai cổng không đổi.

---

# Issue #1005 — T-353: Mục sổ G7: NT-LH-19 (29/02) và NT-LH-28 (Dời lịch ở Các lần hẹn trước) lệch app — Owner chọn sửa dòng hay sửa app

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Lượt nghiệm thu L2 (T-351, PR #1003) thấy hai dòng của danh sách nghiệm thu không khớp exe. Lượt cuối G7 sẽ vấp lại, nên phải sửa trước. Mỗi dòng có hai hướng. **Owner 04/11/2026 chọn (a) cho cả hai dòng: giữ app, chỉ sửa tài liệu.**

1. **NT-LH-19: gõ `29/02` khi năm nay không nhuận.** Ba nơi ghi ba câu khác nhau:
   - Dòng ghi: "Năm yyyy không có ngày 29/02. Ý anh là …?".
   - Mockup 6b ghi: "Năm 2026 không có ngày 29/02. Gõ kèm năm, vd. 29/02/2028.".
   - App làm theo luật DR-39: chỉ gợi ý 29/02 năm sau khi năm sau có ngày đó và tháng 2 đã qua quá 60 ngày. Ví dụ gõ sau 29/04/2027 thì app báo "Năm 2027 không có ngày 29/02. Ý anh là 29/02/2028?". Năm 2026 thì năm sau (2027) cũng không nhuận, nên app báo "Ngày này không tồn tại." như với mọi ngày không có thật.

   Vì vậy gõ trong năm 2026 thì dòng này không bao giờ đạt. Hai hướng:
   - **(a), Owner chọn.** Giữ app. Sửa dòng theo DR-39 và ghi câu của mockup 6b vào "Lệch mockup đã biết".
   - **(b), không chọn.** Sửa app theo mockup 6b: gõ `29/02` ở năm không nhuận mà không có gợi ý năm sau thì báo "Năm yyyy không có ngày 29/02. Gõ kèm năm, vd. 29/02/<năm nhuận kế tiếp>."; dòng ghi theo câu đó. Hướng này đụng `parseQuickDate`, câu lỗi của các hộp gõ ngày nhanh, và ca e2e đang chờ câu "Ngày này không tồn tại.".
2. **NT-LH-28: dòng "Dời lịch" ở "Các lần hẹn trước" khi dời một lịch tương lai.**
   - Dòng ghi: dời "một lịch Dự kiến tương lai"; sau khi lưu, "Các lần hẹn trước" của KH có "dd/mm · Dời lịch · Ghi chú: <lý do>".
   - App: "Các lần hẹn trước" chỉ gồm lịch hôm nay trở về trước (NT-LH-17, Owner 29/09/2026). Lịch cũ còn ở tương lai nên chưa vào danh sách cho tới ngày của nó. L2 phải thử bằng một lịch hôm nay.
   - Nhưng hộp Dời lịch, hễ đã gõ lý do, luôn hiện câu "Trong "Các lần hẹn trước": dd/mm · Dời lịch · Ghi chú: …", kể cả với lịch tương lai. Mockup 6e cũng vẽ như vậy: lịch 28/09, trong khi hôm nay của mockup là 26/09. Dòng đang ghi theo câu này.

   Hai hướng:
   - **(a), Owner chọn.** Giữ app và mockup 6e, chỉ sửa dòng.
   - **(b), không chọn.** Sửa app: hộp chỉ hiện câu đó khi lịch cũ là hôm nay hoặc đã qua. Sửa mockup 6e (G3) và dòng theo đó.

##### Bối cảnh

- G7, lượt nghiệm thu L2: T-351 (#1002, PR #1003, squash `ccea84f`), exe ứng viên `1ce3c61`.
- Ghi chú thứ ba của review #1003 (`REVIEW: PASS` @`252c3d1`, mức low): sau khi #1002 đóng, ba dòng mà ghi chú `L2:` nói lệch app không còn Issue nào theo dõi. NT-AI-03 không cần Owner chọn, vì mockup 2c quyết định, nên nằm ở T-352 (#1004). Owner 04/11/2026: "tạo issue cho các mục open mới".
- `CLAUDE.md` § "Nhãn UI hiểu theo nghĩa thường": chỉ hỏi Owner khi nhãn và mockup thật sự mâu thuẫn. Hai dòng này có mâu thuẫn thật:
  - NT-LH-19: mockup 6b, câu của dòng và luật DR-39 (deep review Phase 1–4; Owner chọn "sửa hết" 06/10/2026) cho ba câu khác nhau.
  - NT-LH-28: mockup 6e vẽ câu "Trong "Các lần hẹn trước"" cho một lịch tương lai, nhưng luật "Các lần hẹn trước = hôm nay trở về trước" (Owner 29/09/2026) có sau mockup đó.
- Code liên quan:
  - Luật DR-39 nằm ở nhánh ngày không có thật của `parseQuickDate`. Câu "Ngày này không tồn tại." là khóa `date.error.invalid-date`.
  - Câu đọc lại của hộp Dời lịch là khóa `reschedule.historyRead`. `RescheduleFields` hiện câu này khi có lý do, không xét ngày.
  - Danh sách "Các lần hẹn trước" lấy từ `priorMeetings`.
- Cùng loại với #1001 (T-350, NT-TR-07, nhãn `gate`).
- **Owner 04/11/2026 chọn (a) cho cả hai dòng** (comment trên Issue): giữ app và mockup 6e, chỉ sửa tài liệu. Phần dưới viết cho hướng đó.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: OPEN, nhóm "Ba ghi chú không chặn của review PR #1003" (mục `[T-353]`)
- `docs/testing/nghiem-thu-v1.md`: "Ghi kết quả"; dòng NT-LH-17, NT-LH-19, NT-LH-28, kể cả ghi chú `L2:`; "Lệch mockup đã biết"
- `docs/design/mockups/appointment-forms.html`: khối 6b (ca biên ngày / giờ), 6e (Dời lịch)
- `docs/decisions/0007-dinh-nghia-chi-so-va-vong-doi.md`: mục Nhập liệu (W8) và phụ lục "Ngày nhanh đầu năm", nơi nhắc tới DR-39
- `packages/domain/src/period.ts`: `parseQuickDate`
- `apps/desktop/src/routes/appointments/RescheduleFields.tsx`: chỗ hiện câu `reschedule.historyRead`
- `apps/desktop/src/routes/appointments/appointment-form.ts`: `priorMeetings`
- `e2e/appointments.spec.ts`: ca "a day long past without a year offers next year; the RE picks"

##### File / thư mục được phép sửa

- `docs/testing/nghiem-thu-v1.md` (dòng NT-LH-19, NT-LH-28; "Lệch mockup đã biết")

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs 1005` (sổ @ `5974e61`, sau PR sổ #1006) ra 4 mục "Trùng file", đều của review #1003:

- L18 [T-353 #1005]: NT-LH-19 (`29/02`) và NT-LH-28 (dòng "Dời lịch" ở "Các lần hẹn trước", câu đọc lại của hộp Dời lịch) lệch app. **Gộp**: chính là việc của Issue này.
- L14, L15, L17 [T-352 #1004]: mục "Dữ liệu", ô Phạm vi của dòng L2, NT-AI-03 và chú giải ⚠️. **Để lại**: thuộc T-352 (#1004). Hai Issue cùng sửa danh sách nghiệm thu nhưng ở các dòng khác nhau.

##### Interface / hợp đồng

Chỉ tài liệu.

- NT-LH-19: chỉ đổi phần `29/02` ở Thao tác và Kết quả mong đợi. Các ý `5/1`, `28-9`, `25:00`, Trigger và "Không tạo lịch nào" giữ nguyên.
- NT-LH-28: Thao tác giữ ca lịch Dự kiến tương lai và thêm một ca lịch Dự kiến hôm nay. Chỉ câu cuối của Kết quả mong đợi đổi, tách theo hai ca.
- Không đổi mã dòng hay mục `L2` ở cột Đạt / Lỗi; NT-LH-19 giữ `L2 ⚠️`. Ghi chú `L2:` của hai dòng giữ nguyên, mỗi ô thêm một câu cho biết dòng đã sửa ở T-353.

##### Test chấp nhận

- [ ] NT-LH-19 ghi đúng luật DR-39:
  - năm sau cũng không nhuận (như khi gõ trong năm 2026): `29/02` → "Ngày này không tồn tại.", không có nút **Dùng …**;
  - câu "Năm yyyy không có ngày 29/02. Ý anh là 29/02/(yyyy+1)?" kèm nút **Dùng …** chỉ hiện khi năm sau nhuận và tháng 2 đã qua quá 60 ngày.

  Các ý khác của dòng không đổi.
- [ ] "Lệch mockup đã biết" có một mục cho mockup 6b: app không có câu "Năm 2026 không có ngày 29/02. Gõ kèm năm, vd. 29/02/2028."; app theo DR-39 (dòng NT-LH-19).
- [ ] NT-LH-28 ghi đủ ba ý:
  - hộp Dời lịch có câu đọc lại "Trong "Các lần hẹn trước": dd/mm · Dời lịch · Ghi chú: <lý do>", như mockup 6e;
  - lịch cũ ở tương lai: ngay sau khi lưu, "Các lần hẹn trước" của KH chưa có dòng "Dời lịch"; dòng đó vào danh sách từ ngày của lịch cũ (luật NT-LH-17);
  - lịch cũ là hôm nay: sau khi lưu, "Các lần hẹn trước" có ngay "dd/mm · Dời lịch · Ghi chú: <lý do>".
- [ ] Ghi chú `L2:` của NT-LH-19 và NT-LH-28 còn nguyên, mỗi ô có câu nói dòng đã sửa ở T-353. NT-LH-19 giữ `L2 ⚠️`.
- [ ] `prettier --check docs/testing/nghiem-thu-v1.md` xanh. Mỗi dòng bảng `NT-*` vẫn đủ 8 phần khi tách bằng `|`.
- [ ] Thân PR trả lời các mục "Trùng file" của `notes-for --diff`.

##### Định nghĩa hoàn thành

- [x] Owner chọn hướng cho NT-LH-19 và NT-LH-28: (a) cho cả hai (comment trên Issue, 04/11/2026); bỏ nhãn `gate`
- [ ] PR docs (không chạy CI); `prettier --check docs/testing/nghiem-thu-v1.md` xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #1009 — docs: align acceptance rows NT-LH-19 and NT-LH-28 with the app (T-353)

Trạng thái: MERGED · merge 2026-11-04T02:45:33Z · commit `daa8651f6abf588c4c6e65a55bbce2359146fddf` · nhánh `task/T-353-nt-lh-19-28-rows` · nhãn: type:task, risk:low

Closes #1005

Phiên code: coding-ses1 (auto-issues)

#### Thay đổi

Owner 04/11/2026 chọn hướng (a) cho cả hai dòng: giữ app, chỉ sửa tài liệu. Chỉ sửa `docs/testing/nghiem-thu-v1.md`.

- **NT-LH-19:** chỉ đổi phần `29/02` của Kết quả mong đợi, ghi theo DR-39 (`parseQuickDate`, `packages/domain/src/period.ts`; câu `appointmentForm.suggestMissing` ở `DateSuggestion`):
  - luôn có "Ngày này không tồn tại."; năm sau cũng không nhuận (gõ trong năm 2026) thì không có nút **Dùng …**;
  - câu "Năm yyyy không có ngày 29/02. Ý anh là 29/02/(yyyy+1)?" + nút **Dùng …** chỉ hiện thêm khi năm sau nhuận và ngày cuối tháng 2 năm nay đã qua quá 60 ngày (vd. từ 30/04/2027: 28/02/2027 → 30/04/2027 là 61 ngày, 29/04 là 60 ngày nên chưa gợi ý). Câu này không kèm "App không tự đổi năm …" (`DateSuggestion` chỉ hiện câu đó khi có ngày đọc được; `DateSuggestion.test.tsx` kiểm không có "nhập bù").
  - Thao tác, các ý `5/1`, `28-9`, `25:00`, Trigger, "Không tạo lịch nào" giữ nguyên; giữ `L2 ⚠️`.
- **NT-LH-28:** Thao tác giữ ca (a) lịch Dự kiến tương lai, thêm ca (b) lịch Dự kiến hôm nay (không có thì tạo bằng **+ Lịch hẹn**). Chỉ câu cuối của Kết quả mong đợi đổi:
  - trong hộp, khi đã gõ lý do: câu đọc lại "Trong "Các lần hẹn trước": dd/mm · Dời lịch · Ghi chú: <lý do>" ở cả hai ca, như mockup 6e (`reschedule.historyRead`, `RescheduleFields.tsx` hiện khi có lý do, không xét ngày);
  - (a) ngay sau khi lưu, "Các lần hẹn trước" chưa có dòng "Dời lịch"; dòng đó vào danh sách từ ngày của lịch cũ (luật NT-LH-17, `priorMeetings` lọc `isPastOrToday`);
  - (b) có ngay "dd/mm · Dời lịch · Ghi chú: <lý do>".
- Ghi chú `L2:` của hai dòng giữ nguyên, mỗi ô thêm một câu: Owner 04/11/2026 chọn giữ app, dòng sửa ở T-353 (#1005).
- **"Lệch mockup đã biết":** thêm mục "Hộp 6b, `29/02` khi năm nay không nhuận": app không có câu "Năm 2026 không có ngày 29/02. Gõ kèm năm, vd. 29/02/2028." của mockup; app theo DR-39 (dòng NT-LH-19).

#### Test chấp nhận

- [x] NT-LH-19 ghi đúng luật DR-39: năm sau cũng không nhuận (gõ trong năm 2026) → "Ngày này không tồn tại.", không có nút **Dùng …**; câu "Năm yyyy không có ngày 29/02. Ý anh là 29/02/(yyyy+1)?" + nút **Dùng …** chỉ khi năm sau nhuận và tháng 2 đã qua quá 60 ngày. Các ý khác không đổi.
- [x] "Lệch mockup đã biết" có mục cho mockup 6b (câu "Năm 2026 không có ngày 29/02. Gõ kèm năm, vd. 29/02/2028."; app theo DR-39, dòng NT-LH-19).
- [x] NT-LH-28 ghi đủ ba ý: câu đọc lại của hộp Dời lịch như mockup 6e; lịch cũ ở tương lai: chưa có dòng "Dời lịch" ngay sau khi lưu, có từ ngày của lịch cũ (luật NT-LH-17); lịch cũ hôm nay: có ngay.
- [x] Ghi chú `L2:` của NT-LH-19 và NT-LH-28 còn nguyên, mỗi ô có câu nói dòng đã sửa ở T-353; NT-LH-19 giữ `L2 ⚠️`.
- [x] `prettier --check docs/testing/nghiem-thu-v1.md` xanh; mọi dòng bảng `NT-*` tách bằng `|` đủ 8 phần (`node -e`, 0 dòng lệch).
- [x] Thân PR trả lời các mục "Trùng file" của `notes-for --diff` (dưới).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `46bfcd1`) ra 3 mục "Trùng file":

- L15 **[T-353 #1005]** NT-LH-19 (`29/02` theo DR-39, lệch câu của dòng và mockup 6b) và NT-LH-28 (dòng "Dời lịch" ở "Các lần hẹn trước"): **đã sửa**, chính là việc của PR này.
- L17 **[G7]** NT-TR-12 (Thao tác cần lịch đã qua chưa có kết quả; seed không có): **để lại**, ngoài phạm vi: Issue #1005 chỉ cho sửa dòng NT-LH-19, NT-LH-28 và "Lệch mockup đã biết" (mục cũng ghi vậy).
- L18 **[G7]** NIT NT-AI-03 (dấu chấm sau ngoặc kép ở Kết quả mong đợi): **để lại**, ngoài phạm vi như L17.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

PR chỉ sửa docs: không chạy CI, không cần nhãn `build-exe`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-353 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #1003 — T-353 (#1005, PR #1009, `REVIEW: PASS` @`235b01e`):
  - #1003, `docs/testing/nghiem-thu-v1.md:133` (NT-LH-19) và `:142` (NT-LH-28): Owner 04/11 chọn (a) cho cả hai dòng, giữ app và mockup 6e, chỉ sửa dòng. NT-LH-19: phần `29/02` của Kết quả mong đợi ghi theo DR-39 (`parseQuickDate`, `packages/domain/src/period.ts`): luôn có "Ngày này không tồn tại."; câu "Năm yyyy không có ngày 29/02. Ý anh là 29/02/(yyyy+1)?" + nút **Dùng …** chỉ hiện thêm khi năm sau nhuận và ngày cuối tháng 2 năm nay đã qua quá 60 ngày (vd. gõ từ 30/04/2027), không kèm "App không tự đổi năm …"; giữ `L2 ⚠️`. Câu của mockup 6b ghi ở "Lệch mockup đã biết" (`:396`). NT-LH-28: Thao tác thêm ca (b) lịch Dự kiến hôm nay. Kết quả mong đợi ghi câu đọc lại của hộp Dời lịch ở cả hai ca, như mockup 6e (`apps/desktop/src/routes/appointments/RescheduleFields.tsx:139`). Với (a) lịch cũ tương lai, dòng "Dời lịch" vào "Các lần hẹn trước" từ ngày của lịch cũ (luật NT-LH-17); với (b) lịch cũ hôm nay, dòng đó có ngay. Ghi chú `L2:` của hai dòng giữ nguyên, mỗi ô thêm một câu về T-353.

---

# Issue #1012 — T-354: Mục sổ G7: nghiệm thu sau T-352 — NT-TR-12 vào danh sách cần lịch Chưa ghi kết quả, dấu câu NT-AI-03

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Sửa hai mục sổ G7 của review PR #1007 (T-352) ở danh sách nghiệm thu (`docs/state/review-notes.md`, nhóm "Hai ghi chú không chặn của review PR #1007"):

1. **NT-TR-12 cần một lịch Chưa ghi kết quả mà mục "Dữ liệu" chưa nêu.** Thao tác của NT-TR-12 là "Ghi kết quả Đã gặp (giữ nguyên nhóm) một lịch đã qua với Người đánh giá IS Thử 2". Seed vừa sinh không có lịch đã qua nào chưa có kết quả, nên lịch đã qua chỉ có nút **Sửa kết quả** (NT-LH-15). NT-TM-15 (b) cùng dạng và đã có trong danh sách 8 dòng cần lịch Chưa ghi kết quả của mục "Dữ liệu". NT-TR-12 thì chưa. Sửa: thêm NT-TR-12 vào danh sách đó, thành 9 dòng. Thao tác của NT-TR-12 giữ nguyên.
2. **Dấu câu ở Kết quả mong đợi của NT-AI-03.** Khi PR #1007 bỏ liên kết, câu còn lại là `…ở thẻ Dữ kiện KYC.". Lịch sử phân tích…`: câu báo đã có dấu chấm trong ngoặc kép, ngay sau ngoặc lại thêm một dấu chấm nữa. Các dòng cùng nhóm viết `"…." <câu sau>` (NT-AI-01) hoặc `"…."; <câu sau>` (NT-AI-02). Sửa thành `…KYC."; Lịch sử phân tích…`, như NT-AI-02.

##### Bối cảnh

- G7. T-352 (#1004, PR #1007, squash `46ffe62`) sửa danh sách nghiệm thu sau lượt L2. Review #1007 (`REVIEW: PASS` @`9e96338`, mức low) có hai ghi chú không chặn. Hai ghi chú gắn [G7] vì lúc đó Issue đang mở (#1001, #1005) không cho sửa các chỗ này của file (PR sổ #1008).
- Owner 04/11/2026 duyệt đề xuất gom sổ của pipeline `auto-issues`: một Issue. Với NT-TR-12, chọn thêm dòng vào danh sách ở mục "Dữ liệu" thay vì đổi Thao tác sang "Sửa kết quả một lịch Đã gặp đã qua". Kết quả `L2 ✅` của dòng được lấy theo Thao tác hiện tại, nên giữ Thao tác thì kết quả đó vẫn đúng với cách đã thử.
- Rà cột Thao tác lúc viết Issue: ngoài 8 dòng đã có trong danh sách, chỉ NT-TR-12 dùng một lịch đã qua chưa có kết quả mà không tự tạo nó (NT-TR-18…20 tự tạo lịch bằng **+ Lịch hẹn**).
- Không đổi kết quả của lượt nào: mục `L1` / `L2` của mọi dòng giữ nguyên.
- File nằm ngoài rào "không tự sửa" của `auto-issues`, nên pipeline nhận được.

##### Tài liệu cần đọc

- `docs/state/review-notes.md`: OPEN, nhóm "Hai ghi chú không chặn của review PR #1007"
- `docs/testing/nghiem-thu-v1.md`: mục "Dữ liệu" (ý "Seed vừa sinh không có lịch Chưa ghi kết quả"); dòng NT-LH-15, NT-TM-15, NT-TR-12; dòng NT-AI-01, NT-AI-02, NT-AI-03

##### File / thư mục được phép sửa

- `docs/testing/nghiem-thu-v1.md`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files docs/testing/nghiem-thu-v1.md` @`3d237b0`, "Trùng file" (2), gộp cả hai vào task này:

- L14 [G7] `docs/testing/nghiem-thu-v1.md:316` (NT-TR-12 cần một lịch Chưa ghi kết quả mà danh sách ở `:23` chưa nêu): mục 1 của Mục tiêu.
- L15 [G7] NIT `docs/testing/nghiem-thu-v1.md:204` (NT-AI-03: dấu chấm thừa sau câu báo ở Kết quả mong đợi): mục 2.

##### Interface / hợp đồng

Chỉ tài liệu. Không đổi mã dòng, cột Thao tác, cột Đạt / Lỗi hay cột Ghi chú của dòng nào. Bảng "Các lượt thử" giữ nguyên. Ở NT-AI-03 chỉ đổi dấu câu ngay sau câu báo, chữ của ô giữ nguyên.

##### Test chấp nhận

- [ ] Ý "Seed vừa sinh không có lịch Chưa ghi kết quả" của mục "Dữ liệu" nêu đủ 9 dòng: NT-LH-03, 15, 21, 22, 26, NT-KH-09, NT-TR-07, NT-TR-12, NT-TM-15. Phần còn lại của ý không đổi.
- [ ] Dòng NT-TR-12 không đổi.
- [ ] Kết quả mong đợi của NT-AI-03 viết `…ở thẻ Dữ kiện KYC."; Lịch sử phân tích…`, không còn `.".`. Phần còn lại của dòng không đổi.
- [ ] `prettier --check` file xanh. Mỗi dòng bảng `NT-*` vẫn đủ 8 phần khi tách bằng `|`.
- [ ] Thân PR trả lời hai mục "Trùng file" của `notes-for --diff` (đã sửa).

##### Định nghĩa hoàn thành

- [ ] PR docs (không chạy CI); `prettier --check` file xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #1014 — docs: list NT-TR-12 among rows needing an unrecorded appointment, fix NT-AI-03 punctuation (T-354)

Trạng thái: MERGED · merge 2026-11-04T03:47:07Z · commit `b1cacf7c1ca15a13a5b99a28510c88a424b80057` · nhánh `task/T-354-acceptance-notes` · nhãn: risk:low

Closes #1012

#### Thay đổi

Chỉ sửa `docs/testing/nghiem-thu-v1.md`, hai mục sổ G7 của review PR #1007 (T-352):

- **Mục "Dữ liệu", ý "Seed vừa sinh không có lịch Chưa ghi kết quả" (`:23`):** danh sách dòng cần một lịch Chưa ghi kết quả thêm NT-TR-12, thành 9 dòng (NT-LH-03, 15, 21, 22, 26, NT-KH-09, NT-TR-07, NT-TR-12, NT-TM-15). Phần còn lại của ý không đổi. Dòng NT-TR-12 (`:316`) giữ nguyên, kể cả Thao tác (Owner 04/11/2026 chọn thêm vào danh sách thay vì đổi Thao tác).
- **NT-AI-03 (`:204`), Kết quả mong đợi:** `…ở thẻ Dữ kiện KYC.". Lịch sử phân tích…` thành `…ở thẻ Dữ kiện KYC."; Lịch sử phân tích…`, như NT-AI-02. Chữ của ô, cột Đạt / Lỗi và Ghi chú không đổi.

Ngoài phạm vi, không sửa: hai dòng khác trong file cũng có dấu chấm ngay sau câu trong ngoặc kép (`.".`), ở NT-KH (`:164`, "…chuyển sang RE mới.". KH chuyển…") và NT-CD (`:279`, "…Nhập không gộp dữ liệu.". Hủy…"). Issue chỉ cho đổi dấu câu của NT-AI-03.

#### Test chấp nhận

- [x] Ý "Seed vừa sinh không có lịch Chưa ghi kết quả" của mục "Dữ liệu" nêu đủ 9 dòng: NT-LH-03, 15, 21, 22, 26, NT-KH-09, NT-TR-07, NT-TR-12, NT-TM-15. Phần còn lại của ý không đổi.
- [x] Dòng NT-TR-12 không đổi.
- [x] Kết quả mong đợi của NT-AI-03 viết `…ở thẻ Dữ kiện KYC."; Lịch sử phân tích…`, không còn `.".`. Phần còn lại của dòng không đổi.
- [x] `prettier --check docs/testing/nghiem-thu-v1.md` xanh. Mỗi dòng bảng `NT-*` vẫn đủ 8 phần khi tách bằng `|` (`node -e`: 243 dòng, 0 dòng lệch).
- [x] Thân PR trả lời hai mục "Trùng file" của `notes-for --diff` (dưới).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `652db6f`) ra 2 mục "Trùng file":

- L14 **[T-354 #1012]** `docs/testing/nghiem-thu-v1.md:316` (NT-TR-12 cần một lịch Chưa ghi kết quả mà danh sách ở `:23` chưa nêu): **đã sửa**, mục 1 của Issue.
- L15 **[T-354 #1012]** NIT `docs/testing/nghiem-thu-v1.md:204` (NT-AI-03: dấu chấm thừa sau câu báo ở Kết quả mong đợi): **đã sửa**, mục 2 của Issue.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

PR chỉ sửa docs: không chạy CI, không cần nhãn `build-exe`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-354 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #1007 — T-354 (#1012, PR #1014, `REVIEW: PASS` @`9e06386`):
  - #1007, `docs/testing/nghiem-thu-v1.md:23` (mục "Dữ liệu", ý "Seed vừa sinh không có lịch Chưa ghi kết quả"): danh sách thêm NT-TR-12, nay đủ 9 dòng (NT-LH-03, 15, 21, 22, 26, NT-KH-09, NT-TR-07, NT-TR-12, NT-TM-15). Dòng NT-TR-12 (`:316`) giữ nguyên, kể cả Thao tác: Owner 04/11 chọn thêm dòng vào danh sách thay vì đổi Thao tác sang "Sửa kết quả một lịch Đã gặp đã qua".
  - #1007 NIT, `docs/testing/nghiem-thu-v1.md:204` (NT-AI-03, Kết quả mong đợi): `…ở thẻ Dữ kiện KYC.". Lịch sử phân tích…` thành `…ở thẻ Dữ kiện KYC."; Lịch sử phân tích…`, như NT-AI-02 (`:203`). Chữ của ô, cột L2 và cột Ghi chú không đổi.

---

# Issue #1017 — T-355: Nghiệm thu lượt L3 trên exe ứng viên 3d237b0: NT-TR-07, vùng Thùng rác, NT-LH-19/28, NT-HD-01 (G7)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Chạy lượt nghiệm thu **L3** trên exe ứng viên mới `3d237b0` và ghi kết quả vào danh sách nghiệm thu v1.0. Exe là artifact của CI run 41765637293: lần push lên `main` sau PR #1011, job "Build portable exe" xanh. Sau `3d237b0`, `main` chỉ đổi tài liệu, nên exe này cũng là bản của `main` hiện tại.

Phạm vi L3 (Claude chạy):

1. **NT-TR-07**: lỗi `L2 ❌ #1001`, đã sửa ở T-350 (PR #1011).
2. **Vùng Thùng rác, NT-TR-01…23**: chạy lại để bắt hồi quy, vì T-350 đổi màn Thùng rác và hộp Khôi phục. Dòng khác mà Thao tác của NT-TR trỏ tới (KH, lịch, HĐ, nhân sự do dòng trước tạo) chạy trước làm bước chuẩn bị.
3. **NT-LH-19, NT-LH-28**: hai dòng T-353 (PR #1009) sửa sau L2. Chạy lại theo chữ mới: NT-LH-19 thay cho `L2 ⚠️`; NT-LH-28 chạy cả ca (a) lẫn ca (b).
4. **NT-HD-01**: đối chiếu hướng dẫn sử dụng với exe. L2 chưa chạy dòng này.

Gộp thêm mục sổ [G7] của review #1014 (Owner 04/11/2026: gộp vào lần sửa sau của file): dấu chấm thừa sau câu trong ngoặc kép ở Kết quả mong đợi của NT-KH-09 và NT-CD-04.

##### Bối cảnh

- G7. L2 (T-351, PR #1003) chạy trên exe `1ce3c61`, kết quả 222 ✅ · 1 ⚠️ NT-LH-19 · 1 ❌ NT-TR-07 (#1001) · 18 —.
- Sau L2 chỉ có một PR code: T-350 (#1001, PR #1011, theo hướng (a) Owner chọn 04/11).
  - Thùng rác (dòng "Bản ghi", tên nút khôi phục) và dòng "Trạng thái" của hộp Khôi phục nay ghi lịch Dự kiến đã qua là "Chưa ghi kết quả", qua `statusLabel` như các màn khác.
  - Ngoài các chỗ đó, PR chỉ nới kiểu tham số của `appointmentGroup` và `statusLabel`; trạng thái lưu và luật khôi phục không đổi.
  - T-352, T-353, T-354 (PR #1007, #1009, #1014) chỉ sửa dòng nghiệm thu.
- Cách chạy như L2 (thân PR #1003, mục "Lượt L2"):
  - thư mục mới chỉ để thử, seed demo neo ngày chạy;
  - Claude điều khiển exe qua cổng debug của WebView2 (CDP), mở exe như probe hiệu năng;
  - provider AI là Mock; không đọc, ghi hay xóa key của Credential Manager.
- Ghi vào bảng "Các lượt thử": version của exe và SHA256 của file đã tải.
- NT-HD-01: phần nào của hướng dẫn cần OpenCode, key thật hay máy khác thì ghi ở Ghi chú là phần Owner, như 6 dòng `L2 ✅` còn phần Owner.
- Ngoài phạm vi:
  - 18 dòng `L2 —` cần Owner (Office Laptop, Windows Sandbox, hai máy, OpenCode / ChatGPT, key thật, tốn hạn mức, USB);
  - phần Owner của 6 dòng `L2 ✅` (NT-CH-09, NT-CD-06, NT-AI-24, NT-EX-01, NT-EX-05, NT-EX-13).

  Owner làm các dòng này trên cùng exe `3d237b0`, kết quả ghi ở PR sau. Task này không chạy lại các dòng khác.

##### Tài liệu cần đọc

- `docs/testing/nghiem-thu-v1.md`:
  - "Cách dùng" (Dữ liệu, Ghi kết quả, Các lượt thử);
  - dòng NT-LH-19, NT-LH-28, NT-HD-01, NT-KH-09, NT-CD-04;
  - vùng NT-TR và các dòng mà Thao tác của NT-TR trỏ tới;
  - "Lệch mockup đã biết".
- `docs/user-guide/README.md`: "Bảng đối chiếu màn / hộp ↔ mục hướng dẫn", rồi `docs/user-guide/01-bat-dau.md` … `docs/user-guide/11-thuat-ngu.md` (cho NT-HD-01).
- `e2e/perf/README.md`: phần mở exe với cổng debug WebView2 (`WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS`), và đoạn "Debugger làm chậm lệnh ghi qua IPC".
- `docs/state/review-notes.md`: OPEN, nhóm "Một ghi chú không chặn của review PR #1014".

##### File / thư mục được phép sửa

- `docs/testing/nghiem-thu-v1.md`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files docs/testing/nghiem-thu-v1.md docs/user-guide/` @`e72f8c9`, "Trùng file" (1), gộp vào task này:

- L14 [G7] NIT `docs/testing/nghiem-thu-v1.md:164` (NT-KH-09) và `:279` (NT-CD-04): dấu chấm thừa sau câu trong ngoặc kép ở Kết quả mong đợi. Owner 04/11 chọn gộp vào lần sửa sau của file.

##### Interface / hợp đồng

- Chỉ tài liệu. Không đổi mã dòng, Thao tác hay Kết quả mong đợi của dòng nào. Ngoại lệ duy nhất: dấu câu ở NT-KH-09 và NT-CD-04 (`.".` thành `.";`, như NT-AI-02, NT-AI-03).
- Mục L1 / L2 giữ nguyên. L3 nối sau trong cùng ô theo "Ghi kết quả".
- App lệch dòng hoặc lệch mockup → ghi `L3 ⚠️` kèm Ghi chú, không sửa dòng: Owner chọn sửa bên nào.
- Lỗi app → mở Issue lỗi (mã dòng, SHA exe, máy, các bước), ghi `L3 ❌ #n`, nhãn `risk:*` theo luật "Lỗi → Issue thường".
- NT-HD-01: chỗ hướng dẫn lệch exe ghi ở Ghi chú (và Issue riêng khi cần sửa). Task này không sửa `docs/user-guide/`.

##### Test chấp nhận

- [ ] Bảng "Các lượt thử" có dòng L3, đủ các ô:
  - ngày, máy;
  - exe `3d237b0`, kèm CI run 41765637293, version và SHA256;
  - dữ liệu, phạm vi (gồm các dòng chuẩn bị có ghi L3);
  - kết quả đếm theo ✅ / ⚠️ / ❌ / —, khớp số mục L3 ở cột Đạt / Lỗi.
- [ ] Mỗi dòng sau có đúng một mục `L3 …`, nối sau mục cũ của ô (vd. `L2 ❌ #1001 · L3 ✅`): NT-TR-01…23, NT-LH-19, NT-LH-28, NT-HD-01.
  - Dòng chuẩn bị chỉ có mục L3 khi đã kiểm đủ Kết quả mong đợi của nó.
  - Các dòng khác không thêm mục L3.
- [ ] Dòng `L3 ❌` trỏ tới Issue lỗi mới. Dòng `L3 ⚠️`, `L3 —`, và dòng `L3 ✅` còn phần Owner có ghi chú `L3: …` nêu điều thấy hoặc lý do.
- [ ] Ở Kết quả mong đợi của NT-KH-09 và NT-CD-04, `.".` sau câu trong ngoặc kép thành `.";`. Phần còn lại của hai dòng không đổi.
- [ ] Mục L1 / L2, mã dòng, Thao tác, Kết quả mong đợi (trừ dấu câu trên) của mọi dòng không đổi.
- [ ] `prettier --check` file xanh. Mỗi dòng bảng `NT-*` vẫn đủ 8 phần khi tách bằng `|`.
- [ ] Thân PR trả lời mục "Trùng file" của `notes-for --diff`.

##### Định nghĩa hoàn thành

- [ ] PR docs (không chạy CI); `prettier --check` file xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #1020 — docs: record the L3 acceptance run on candidate exe 3d237b0 (T-355)

Trạng thái: MERGED · merge 2026-11-04T05:07:45Z · commit `abd10b981b9a1094ef18a1335fae485a049609fa` · nhánh `task/T-355-nghiem-thu-l3` · nhãn: type:task, risk:low

Closes #1017

#### Thay đổi

PR chỉ sửa `docs/testing/nghiem-thu-v1.md`:

- **Các lượt thử:** thêm dòng L3.
  - 04/11/2026, Home PC.
  - Exe `3d237b0`: artifact CI run 41765637293, exe 1.0.0, SHA256 `B69D2782…45B1`. Sau `3d237b0`, `main` chỉ đổi tài liệu, nên đây cũng là exe của `main` hiện tại.
  - Dữ liệu là seed demo neo 04/11/2026.
  - Phạm vi gồm các dòng của Issue và 13 dòng chuẩn bị đã kiểm đủ.
  - Kết quả: 38 ✅ · 0 ⚠️ · 1 ❌ · 0 —.
- **Cột Đạt / Lỗi:** 39 dòng có thêm mục `L3 …`, nối sau mục cũ của ô:
  - phạm vi của Issue: NT-TR-01…23, NT-LH-19, NT-LH-28, NT-HD-01;
  - dòng chuẩn bị: NT-TM-05, 06, 07, 14, 15, 16, NT-LH-22, 33, NT-KH-14, 15, NT-HS-13, 14, 18.
- **Cột Ghi chú:** thêm ghi chú `L3: …` ở NT-HD-01 (❌, và phần Owner), NT-LH-19 (ý không thử được), NT-TR-07 (lỗi L2 đã sửa), NT-TR-22 (cách kiểm bản backup).
- **Dấu câu:** ở Kết quả mong đợi của NT-KH-09 và NT-CD-04, `.".` thành `.";` (mục sổ L14).

Không đổi mã dòng, Thao tác hay Kết quả mong đợi của dòng nào (trừ dấu câu trên), không đổi mục L1 / L2.

#### Lượt L3

Claude điều khiển exe thật trong `C:\nghiem-thu\L3` qua cổng debug của WebView2 (`--remote-debugging-port`, Playwright `connectOverCDP`), như L2. Provider AI là Mock. Không đọc, ghi hay xóa key của Credential Manager: hộp "Xóa API key OpenCode?" chỉ mở ra đọc chữ rồi đóng bằng Escape, thẻ vẫn ghi "Đã có key".

- **NT-TR-04** chạy trước lần xóa đầu tiên.
- Các dòng chuẩn bị chạy trước dòng NT-TR dùng chúng:
  - Team: team Thử NT, TL Thử, RE Thử, IS Tạm, IS Hỗ trợ, RE Thùng rác.
  - Lịch Đã gặp tính RF của K-3KSM.
  - KH K-W1P4.
  - HĐ của K-GWK3.
- **NT-TR-07** (lỗi L2 #1001, sửa ở T-350) đạt:
  - Lịch nhập bù 01/11/2026 10:00 của K-HHTF, sau khi xóa, ghi "01/11/2026 10:00 · Chưa ghi kết quả" ở dòng Thùng rác, ở tên nút "Khôi phục…" và ở dòng Trạng thái của hộp khôi phục.
  - Khôi phục xong, lịch về nhóm Chưa ghi kết quả: ô 01/11 và dòng đếm ở Lịch hẹn, ô Lịch hẹn ở Tổng quan.
  - Lịch Dự kiến tương lai (19/11 của NT-TR-06, 07/11 của NT-TR-11) vẫn ghi "Dự kiến".
- **NT-TR-22:** bản backup của lần dọn được chép thành `project2c.db` cạnh một bản exe khác (`C:\nghiem-thu\L3-ban-backup`) rồi mở bằng exe. Thùng rác có đủ 8 bản ghi như trước lúc dọn.
- **NT-LH-19:** ý `29/02` khi năm sau nhuận (gõ từ 30/04/2027) không thử được, vì ngày máy là năm 2026 và không đổi đồng hồ máy. Các ý khác đạt, kể cả `29/02` không có nút **Dùng …**.
- **NT-LH-28:**
  - Ca (a) dùng lịch 06/11 15:00 của K-YDWK: ngay sau khi lưu, "Các lần hẹn trước" chưa có dòng Dời lịch.
  - Ca (b) dùng lịch hôm nay 04/11 11:00 của K-8Z07: có ngay "04/11 · Dời lịch · Ghi chú: …".
  - Hai lịch thử không có người phối hợp.
- **NT-HD-01:**
  - Lấy mọi chữ in đậm, trong ngoặc kép và câu trích dẫn của 12 file hướng dẫn, so với chuỗi trong code của `3d237b0`. Chỗ không khớp nguyên văn đều là câu ghép số / tên hoặc chữ in đậm đầu đoạn.
  - Chụp lại trên exe đúng 28 khung của `e2e/guide/shots.guide.ts`, viewport 1 440 × 900, chỉ mở hộp rồi Hủy / Escape, rồi so từng cặp với ảnh của hướng dẫn: trùng bố cục. Khác là số liệu, hoặc phần exe / web mà hướng dẫn đã ghi.
  - Thử trên exe các phần "(bản exe)": thư mục `Project2C-data\`, chân sidebar "Đã lưu" khi mới mở, thẻ File dữ liệu ("Lưu lần cuối" "—" khi mới mở), xuất / nhập backup, Nạp lại, Xuất Excel (`bao-cao_2026-11_toan-bo_2026-11-04.xlsx`, câu báo + **Mở thư mục**), Dọn sạch.

Dòng ❌:

- **NT-HD-01 → #1019 (T-356, `risk:low`).** Chương 1 ("Chạy app (bản exe)") và câu đầu chương 2 nói mở app là vào Tổng quan. Exe mở lại màn dùng lần cuối:
  - mở lại sau khi đóng ở Cài đặt → AI thì vào Cài đặt → AI;
  - lần mở đầu của thư mục thử mới vào Team & nhân sự, vì `p2c.lastRoute` nằm trong profile WebView2 chung mọi bản exe trên máy.

  Hành vi này có chủ ý (e2e "reopening the app returns to the last screen"), nên Issue chỉ sửa hướng dẫn và ngoặc ở Thao tác của NT-TQ-01.

Phần của NT-HD-01 không làm, ghi ở cột Ghi chú:

- Phần Owner: OpenCode (gói, key, Kiểm tra kết nối, Phân tích), ChatGPT web, icon exe.
- Trang lỗi lúc mở và dải lỗi lưu (chương 1, 10): chỉ so chữ, không gây lại lỗi file. Code từ `1ce3c61` tới `3d237b0` chỉ đổi Thùng rác, và L2 đã chạy các ca đó ở NT-DB.

Một việc xảy ra trong lượt, không thuộc dòng nào:

- Ngay sau lần chạy NT-LH-22 / NT-LH-33, cổng debug của WebView2 ngừng trả lời. App vẫn vẽ màn và chân sidebar ghi "Đã lưu 11:16".
- Gửi WM_CLOSE thì cửa sổ không đóng. Bấm mở exe lần nữa thì cửa sổ mới báo "Project-2C đang mở ở một cửa sổ khác", đúng NT-EX-06. Tiến trình WebView2 của cửa sổ đầu thoát, màn thành đen.
- Đã tắt hẳn tiến trình exe thử. File `project2c.db` đã lưu lúc 11:16:39, sau bước xóa cuối của NT-LH-33. Mở lại thì dữ liệu đủ: K-3KSM về N3, lịch nằm ở Thùng rác.
- Việc này xảy ra khi Playwright vừa ngắt CDP, sau đó không lặp lại. Không mở Issue, vì chưa tách được nó khỏi debugger.

#### Test chấp nhận

- [x] Bảng "Các lượt thử" có dòng L3 đủ các ô: ngày, máy; exe `3d237b0` kèm CI run 41765637293, version 1.0.0, SHA256; dữ liệu; phạm vi (gồm các dòng chuẩn bị có ghi L3); kết quả 38 ✅ · 0 ⚠️ · 1 ❌ · 0 —, khớp số mục L3 ở cột Đạt / Lỗi.
- [x] Mỗi dòng NT-TR-01…23, NT-LH-19, NT-LH-28, NT-HD-01 có đúng một mục `L3 …`, nối sau mục cũ của ô. Dòng chuẩn bị chỉ có mục L3 khi đã kiểm đủ Kết quả mong đợi (13 dòng trên); các dòng khác không có mục L3.
  - Đếm bằng script so với `main`: 39 dòng có đúng một mục L3, gồm 38 ✅ và 1 ❌.
  - Mọi thay đổi ở cột Đạt / Lỗi và Ghi chú chỉ là nối thêm.
- [x] Dòng `L3 ❌` (NT-HD-01) trỏ tới Issue mới #1019. Không có dòng `L3 ⚠️` hay `L3 —`. Dòng `L3 ✅` còn phần Owner: không có. NT-HD-01 ghi phần Owner ở ghi chú `L3: …`.
- [x] Ở Kết quả mong đợi của NT-KH-09 và NT-CD-04, `.".` thành `.";`; phần còn lại của hai dòng không đổi.
- [x] Mục L1 / L2, mã dòng, Thao tác, Kết quả mong đợi (trừ dấu câu trên) của mọi dòng không đổi. Script so với `main`: ngoài các dòng `NT-*`, chỉ thêm dòng L3 của bảng lượt thử.
- [x] `prettier --check docs/testing/nghiem-thu-v1.md` xanh. Mỗi dòng bảng `NT-*` vẫn đủ 8 phần khi tách bằng `|`.
- [x] Thân PR trả lời mục "Trùng file" của `notes-for --diff` (dưới).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @`331e7a0`, "Trùng file" (1):

- L14 `docs/testing/nghiem-thu-v1.md` [T-355 #1017] NIT dấu chấm thừa sau câu trong ngoặc kép ở NT-KH-09 và NT-CD-04: **đã sửa** (`.".` thành `.";`, như NT-AI-02, NT-AI-03).

#### Kiểm tra

- [x] PR chỉ sửa `docs/**`, không phải file trong `CODE_DOCS`: không chạy CI, không cần `pnpm verify`. `prettier --check` xanh.
- [x] Không thêm dependency.
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-355 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #1014 — T-355 (#1017, PR #1020, `REVIEW: PASS` @`20a6019`):
  - #1014 NIT, `docs/testing/nghiem-thu-v1.md:165` (NT-KH-09, Kết quả mong đợi) và `:280` (NT-CD-04, Kết quả mong đợi): `…chuyển sang RE mới.". KH chuyển sang Kanban…` thành `…chuyển sang RE mới."; KH chuyển sang Kanban…`, và `…"Nhập không gộp dữ liệu.". Hủy → …` thành `…"Nhập không gộp dữ liệu."; Hủy → …`, như NT-AI-02 (`:204`) và NT-AI-03 (`:205`). Phần còn lại của hai dòng không đổi.

---

# Issue #1019 — T-356: Hướng dẫn: mở app vào màn dùng lần cuối, không phải luôn Tổng quan (NT-HD-01)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Sửa câu của hướng dẫn sử dụng nói mở app là vào màn **Tổng quan**. Exe mở lại **màn dùng lần cuối**; chỉ lần mở đầu tiên trên một máy mới vào Tổng quan.

Chỗ lệch tìm thấy ở lượt nghiệm thu L3, dòng **NT-HD-01**, trên exe ứng viên `3d237b0` (artifact CI run 41765637293, exe 1.0.0) tại Home PC `DESKTOP-KDURKJP`, ngày 04/11/2026. Các bước:

1. Mở exe, vào **Cài đặt → AI**.
2. Đóng app bằng nút X.
3. Mở lại exe. Màn đầu là Cài đặt → AI (tiêu đề "Cài đặt · Heritas L-CRM"), không phải Tổng quan.

Thư mục thử mới cũng vậy: lần mở đầu của thư mục `C:\nghiem-thu\L3` (chưa có `Project2C-data\`, app sinh seed demo) vào thẳng **Team & nhân sự**, là màn dùng cuối của một bản exe khác trên cùng máy.

Hai câu của hướng dẫn lệch exe:

- Chương 1, mục "Chạy app (bản exe)": "Lúc mở, app hiện "Đang mở dữ liệu…" rồi vào màn **Tổng quan**."
- Chương 2, câu đầu: "Màn đầu tiên khi mở app: …".

Lỗi tài liệu, không phải lỗi app, nên gắn `risk:low` theo mục "Ghi kết quả" của `nghiem-thu-v1.md`.

Gộp thêm mục sổ [G7] của review PR #1020 (Owner 04/11/2026: gộp mục OPEN còn lại vào Issue đang chờ). Ô Exe (SHA) của dòng L3, bảng "Các lượt thử", ghi "cũng là exe của `main` hiện tại". Đây là mốc theo thời gian, sẽ sai khi `main` có commit code sau này, nên đổi thành mốc SHA.

##### Bối cảnh

- App nhớ màn đang mở trong `localStorage` (khóa `p2c.lastRoute`). Lúc mở, hash trống thì app mở lại màn đó; chưa có thì mở Tổng quan.
- Đây là hành vi có chủ ý. Có e2e "reopening the app returns to the last screen", và review lượt 4 (bằng chứng F2) đã ghi là có chủ ý. Vì vậy sửa hướng dẫn, không sửa app.
- `localStorage` nằm trong profile WebView2 của máy, dùng chung cho mọi bản exe trên máy đó. Mở exe ở thư mục khác, hay một bản exe mới, cũng vào màn dùng cuối của bản trước.
- Dòng NT-TQ-01 của `nghiem-thu-v1.md` có Thao tác "Mở app (màn đầu là Tổng quan)". L2 đã ghi chú điều này ở cột Ghi chú. Task này sửa luôn ngoặc đó cho khớp.
- Nếu Owner muốn app luôn mở Tổng quan thì đó là đổi hành vi (code và e2e), không thuộc Issue này.

##### Tài liệu cần đọc

- `docs/user-guide/01-bat-dau.md`: mục "Chạy app (bản exe)"
- `docs/user-guide/02-tong-quan.md`: câu đầu, trước ảnh
- `docs/user-guide/README.md`: đoạn đầu (quy ước chữ in đậm / trong ngoặc kép)
- `apps/desktop/src/shell/useRoute.ts`
- `e2e/navigation.spec.ts`: ca "reopening the app returns to the last screen"
- `docs/testing/nghiem-thu-v1.md`: mục "Ghi kết quả", bảng "Các lượt thử" (dòng L3), dòng NT-TQ-01, dòng NT-HD-01 (cột Ghi chú, đoạn L3)
- `docs/state/review-notes.md`: OPEN, nhóm "Một ghi chú không chặn của review PR #1020"

##### File / thư mục được phép sửa

- `docs/user-guide/01-bat-dau.md`
- `docs/user-guide/02-tong-quan.md`
- `docs/testing/nghiem-thu-v1.md`, chỉ hai chỗ:
  - ngoặc "(màn đầu là Tổng quan)" ở Thao tác của NT-TQ-01;
  - câu "cũng là exe của `main` hiện tại (…)" ở ô Exe (SHA) của dòng L3, bảng "Các lượt thử".

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files docs/user-guide/01-bat-dau.md docs/user-guide/02-tong-quan.md docs/testing/nghiem-thu-v1.md` @`9bfd7c9`, "Trùng file" (1), gộp vào task này:

- L14 [G7] NIT `docs/testing/nghiem-thu-v1.md:40` (dòng L3 của "Các lượt thử", ô Exe (SHA)): "cũng là exe của `main` hiện tại (sau `3d237b0` chỉ đổi tài liệu)" là mốc theo thời gian. Owner 04/11 chọn gộp vào task này.

##### Interface / hợp đồng

- Chương 1: lần mở đầu trên một máy, app vào Tổng quan. Các lần sau, app mở lại màn dùng lần cuối. Điều này đúng cả với thư mục dữ liệu khác hay bản exe khác trên cùng máy, vì app nhớ màn theo máy. Giữ câu "Đang mở dữ liệu…".
- Chương 2: câu đầu không còn gọi Tổng quan là màn đầu khi mở app mà không kèm điều kiện.
- NT-TQ-01: chỉ đổi ngoặc ở Thao tác cho khớp chương 1. Mã dòng, Kết quả mong đợi, cột Đạt / Lỗi, cột Ghi chú giữ nguyên.
- Dòng L3 của "Các lượt thử": ở ô Exe (SHA), "cũng là exe của `main` hiện tại (sau `3d237b0` chỉ đổi tài liệu)" thành "cũng là exe của `main` tới `331e7a0` (sau `3d237b0` chỉ đổi tài liệu)". `331e7a0` là `main` lúc chạy L3, tức base của PR #1020. Phần còn lại của ô, các ô khác của dòng L3 và dòng L1 / L2 giữ nguyên.
- Không đổi ảnh, không chụp lại ảnh.

##### Test chấp nhận

- [ ] Mục "Chạy app (bản exe)" của chương 1 nói lần mở đầu trên máy vào Tổng quan, các lần sau mở lại màn dùng lần cuối, nhớ theo máy, chung mọi bản exe trên máy.
- [ ] Câu đầu của chương 2 không còn nói Tổng quan là màn đầu khi mở app mà không kèm điều kiện.
- [ ] Thao tác của NT-TQ-01 không còn "(màn đầu là Tổng quan)" vô điều kiện. Các phần khác của dòng không đổi.
- [ ] Ô Exe (SHA) của dòng L3 ở "Các lượt thử" ghi "cũng là exe của `main` tới `331e7a0` (sau `3d237b0` chỉ đổi tài liệu)", không còn "`main` hiện tại". Các ô khác của dòng L3 và dòng L1 / L2 không đổi.
- [ ] `prettier --check` xanh cho các file đã sửa. Mỗi dòng bảng `NT-*` vẫn đủ 8 phần khi tách bằng `|`.
- [ ] Thân PR trả lời mục "Trùng file" của `notes-for --diff`.

##### Định nghĩa hoàn thành

- [ ] PR docs (không chạy CI); `prettier --check` xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không. #1017 (T-355) đã đóng: PR #1020 merge 04/11 (`abd10b9`).

## PR #1023 — docs: say the app reopens the last screen, pin the L3 exe to a main SHA (T-356)

Trạng thái: MERGED · merge 2026-11-04T05:22:23Z · commit `382967de4a72ef00deceb36a41e4365066557167` · nhánh `task/T-356-guide-last-screen` · nhãn: type:task, risk:low

Closes #1019

#### Thay đổi

- `docs/user-guide/01-bat-dau.md`, mục "Chạy app (bản exe)": bước 2 nói app hiện "Đang mở dữ liệu…" rồi vào màn dùng lần cuối; lần mở đầu tiên trên một máy vào **Tổng quan**. Thêm một đoạn: app nhớ màn theo máy, không theo file exe hay thư mục dữ liệu, chung mọi bản exe trên máy (bản exe mới, hay exe ở thư mục khác kể cả lần mở đầu của thư mục đó, cũng vào màn dùng lần cuối của bản trước). Khớp `apps/desktop/src/shell/useRoute.ts` (`p2c.lastRoute`, chưa có thì `DEFAULT_ROUTE` = overview) và e2e "reopening the app returns to the last screen".
- `docs/user-guide/02-tong-quan.md`, câu đầu: thôi gọi Tổng quan là màn đầu khi mở app; thêm "Lần mở app đầu tiên trên một máy vào màn này; các lần sau app mở lại màn dùng lần cuối", trỏ về mục "Chạy app (bản exe)" của chương 1.
- `docs/testing/nghiem-thu-v1.md`, chỉ hai chỗ:
  - NT-TQ-01, ngoặc ở Thao tác: "(màn đầu là Tổng quan)" thành "(lần mở đầu trên máy vào Tổng quan; các lần sau vào màn dùng lần cuối, khi đó bấm **Tổng quan** ở sidebar)". Mã dòng, Kết quả mong đợi, Đạt / Lỗi, Ghi chú không đổi.
  - Dòng L3 của "Các lượt thử", ô Exe (SHA): "cũng là exe của `main` hiện tại" thành "cũng là exe của `main` tới `331e7a0`". `331e7a0` là base của PR #1020; `git diff --name-only 3d237b0 331e7a0` chỉ có `docs/state/review-notes.md` và `docs/testing/nghiem-thu-v1.md`. Các ô khác và dòng L1 / L2 không đổi.
- Không đổi ảnh.

#### Test chấp nhận

- [x] Chương 1, "Chạy app (bản exe)": lần mở đầu trên máy vào Tổng quan, các lần sau mở lại màn dùng lần cuối, nhớ theo máy, chung mọi bản exe trên máy.
- [x] Câu đầu chương 2 không còn nói Tổng quan là màn đầu khi mở app mà không kèm điều kiện.
- [x] Thao tác của NT-TQ-01 không còn "(màn đầu là Tổng quan)" vô điều kiện; các phần khác của dòng không đổi.
- [x] Ô Exe (SHA) của dòng L3 ghi "cũng là exe của `main` tới `331e7a0` (sau `3d237b0` chỉ đổi tài liệu)"; các ô khác của dòng L3 và dòng L1 / L2 không đổi.
- [x] `prettier --check` xanh cho ba file đã sửa. Mọi dòng `| NT-` của `nghiem-thu-v1.md` đủ 8 phần khi tách bằng `|` (0 dòng lệch).
- [x] Thân PR trả lời mục "Trùng file" của `notes-for --diff` (mục dưới).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @`fa7e17c`, "Trùng file" (1):

- L14 **[T-356 #1019]** NIT `docs/testing/nghiem-thu-v1.md:40` (dòng L3, ô Exe (SHA), "`main` hiện tại"): đã sửa, neo `331e7a0`.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

PR chỉ sửa docs: không chạy CI, không cần nhãn `build-exe`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-356 (`docs/state/review-notes.md` ở `37a80b6`, nguyên văn)

- Ghi chú review PR #1020 — T-356 (#1019, PR #1023, `REVIEW: PASS` @`22e2216`):
  - #1020 NIT, `docs/testing/nghiem-thu-v1.md:40` (dòng L3 của "Các lượt thử", ô Exe (SHA)): "cũng là exe của `main` hiện tại (sau `3d237b0` chỉ đổi tài liệu)" thành "cũng là exe của `main` tới `331e7a0` (sau `3d237b0` chỉ đổi tài liệu)"; `331e7a0` là base của PR #1020. Các ô khác của dòng L3 và dòng L1 / L2 không đổi.
