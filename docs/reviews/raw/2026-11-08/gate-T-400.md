# Gate T-400 (#1169): review lại phần code đổi sau deep review lượt 6

- **Diff đã review:** `5b1328a..a1e6a20` (SHA ghim lượt 6 → code cuối của `main`), phần ngoài `docs/**` và `*.md`: 46 file, +631 / −481. `git log 5b1328a..a1e6a20 -- . ':!docs/**' ':!*.md'` ra đúng 10 commit của bảng Issue.
- **SHA đã checkout và chạy:** `a1e6a20c5396503fe87cfe6574c25670eba3ad2c` (worktree `C:\workspace\Project-2C-review`, detached, sạch trước và sau phiên).
- **Phiên:** phiên sạch, Claude Opus 5.5, ngày 08–09/11/2026, Home PC. Chỉ đọc: không sửa file trong repo, không commit / push / nhánh / PR. Đột biến và probe chạy trong một worktree tạm detached ở scratchpad, đã gỡ (`git worktree remove` + `prune`); script giữ cạnh báo cáo này (`mutate.mjs`, `gate-t400-probe.test.ts`).
- **Thước:** K48 (chặn phát hành = Critical / High / Medium, hoặc Low ở trục D, S, G; còn lại → đề xuất [sau v1.0]); không báo lại mục đã có trong `docs/state/review-notes.md` (OPEN / ACCEPTED) khi không có bằng chứng mới.

## 1. Đã chạy / đọc gì

1. Đọc toàn bộ `git diff 5b1328a a1e6a20 -- . ':!docs/**' ':!*.md'` và code quanh mỗi chỗ đổi: `database.ts` (`connect`, `withSources`, `transaction`, `migrate`), `common.ts` (`today`, `storedPastDate`, `stampDeleted`), `customers.ts` (`appendTransition`, `checkTransition`, `withdrawAppointmentTransition`, `transitionWithdrawnAt`, `reinstateTransition`, `unmovedMeetingsFrom`, `plannedOff`), `appointments.ts` (`recordMeetingOutcome`, `recordOutcomeWithNext`, `editMeetingOutcome`, `softDeleteAppointment`, `restoreAppointment`, `checkRestoreAppointment`, `applyOutcome`, `requireOutcomeDay`), `backup.ts` / `backup-validation.ts` (luật 1–4, 7, 10, 14, 16), `ai-analyses.ts` (`recordAiAnalysis`, `analysisContentFits`), `seed.ts` (`withSources` của seed và của `aiSimulation`), `app-data.ts` (đồng hồ ghim, `exportBackup`, `StoragePort.backup`), `trash-view.ts` / `SettingsTrash.tsx` / `RestoreDialog.tsx`, `AppointmentDialog.tsx` (`CoordinatorsField`), `Button.tsx` (mặc định `type="button"`), `Dialog.tsx` (form), `OutcomeDialog.tsx` / `EditOutcomeDialog.tsx`, `blocklists.ts`, prompt `analysis.ts` / `discovery.ts`, `schema.ts` (`PROMPT_VERSIONS`), `eslint.config.js`, `vitest.config.ts`, các e2e đổi và `e2e/support.ts`.
2. G5: so `blocklists.ts` (V3 dòng 36, `LAW_NAME` dòng 109) với `docs/design/phase-5-prompts.md` §15.2, §15.3, §15.4; version ở §2, §3, `docs/golden/ai-eval.md:5`; `git grep "analysis@5|discovery@5"` ngoài docs: 0 dòng.
3. Unit test ở `a1e6a20`: `pnpm exec vitest run packages/db packages/ai packages/domain apps/desktop` → **109 file, 4 030 ca, xanh** (90 s). Không chạy e2e (CI của từng PR đã chạy; phiên này không đổi code).
4. Đột biến (gỡ từng phần sửa trên bản chép, chạy test liên quan, trả file):

   | Đột biến | Kết quả |
   |---|---|
   | M1 T-398: `today` đọc lại `db.now()` | đỏ 5 ca (common, appointments, customers, backup) |
   | M2 T-399: chốt T-232 chỉ chạy khi ngày trước hôm nay (như trước PR) | đỏ 1 ca (`appointments.test.ts` "refuses a stage change dated before a met appointment after the clock was set back") |
   | M3 T-390: `steadyClock` trả nguyên đồng hồ máy | đỏ 6 ca (database, appointments DR6-178 ×2, common) |
   | M4 T-390: luật nhập 16 tắt | đỏ 1 ca (`backup-invariants.test.ts` "refuses 16") |
   | M5 T-391: bỏ kiểm cỡ khi xuất | đỏ 1 ca (`app-data.test.ts` DR6-179) |
   | M6 T-392: lớp dấu câu V3 về `.,;:!?)` | đỏ 5 ca C84 |
   | M7 T-392: `LAW_NAME` bỏ cặp ngoặc đơn và ngoặc kép mở | đỏ 3 ca C85 |

   T-393, T-394 (UI) và T-395–T-397 (refactor / test) không đột biến lại: phần sửa UI có e2e đỏ trên `5b1328a` theo test chấp nhận của Issue (review từng PR đã kiểm), phần refactor không đổi hành vi (test cũ xanh ở `a1e6a20`).
5. Probe tương tác đồng hồ (T-390 × T-398 × T-399), `gate-t400-probe.test.ts`, đồng hồ máy 08/11 00:05 lùi về 07/11 23:55 trong một lần mở:
   - **P1:** MET 08/11 chuyển N3 → N2; lùi giờ; xóa lịch (rút transition ở mốc `steadyClock`) → Thùng rác chặn khôi phục `OUTCOME_IN_FUTURE {08/11/2026}`; ghi MET 07/11 N3 → N2 được nhận; xuất → nhập ở 23:55 **nhận**; qua 08/11 00:10 khôi phục lịch đã xóa → nhận, không thêm transition (KH đã ở N2, E7); xuất → nhập **nhận**. Transition cuối: `[null→N3 01/10, N3→N2 07/11]`.
   - **P2:** MET 08/11 giữ N3; lùi giờ; `changeStageManually` N2 ngày 07/11 → `TRANSITION_BEFORE_MEETING`; MET 07/11 N3 → N2 → `TRANSITION_BEFORE_MEETING`; MET 07/11 giữ N3 được nhận; xuất → nhập ở 23:55 → `BACKUP_INVALID {rule: 10}` (MET còn sống ngày 08/11 sau "hôm nay"); nhập lúc 08/11 12:00 → **nhận**.
   - P2 lúc 23:55 là luật 10 làm đúng spec (`docs/design/phase-3-du-lieu.md:236`: ngày của lần nhập đọc đồng hồ gốc, Owner 08/11/2026, T-398); trước đợt sửa cũng vậy (lần nhập mở DB mới, đồng hồ mới). Từ chối tạm, tự hết khi qua ngày, không đổi dữ liệu đang có: không phải phát hiện.

## 2. Bảng 10 PR

| Commit | PR | Task | Kết luận | Ghi chú của phiên này |
|---|---|---|---|---|
| `430eef2` | #1145 | T-390 | **Đúng** | `steadyClock` (`database.ts:164`) chỉ cho đồng hồ của lần mở; `withSources` trả đồng hồ được truyền, `finally` trả lại `own` nên `sources === own` đúng sau mọi lối ra. Luật 16 (`backup-validation.ts:196`) khớp khóa duy nhất dùng mốc rút làm khóa (`transitionWithdrawnAt`, `customers.ts:463`; quét `eq(*.deletedAt, …)` cả `packages/db/src`: chỉ chỗ này). Seed: đồng hồ seed tự tăng `tick`, `aiSimulation` đứng yên nhưng chỉ ghi phân tích, không rút transition. `migrate` lấy một mốc cho mọi migration. M3, M4 đỏ. |
| `1630c78` | #1147 | T-391 | **Đúng**, một ghi chú mới không chặn (F1) | So byte (`app-data.ts:465`) cùng thước với nhập (`backup.ts:81` đếm ký tự ≤ byte; `SettingsBackup.tsx:80` `file.size`). Không ghi file khi quá trần. M5 đỏ. Câu `settings.backup.exportTooLarge`: F1. |
| `b85376d` | #1149 | T-392 | **Đúng** (G5 khớp §15) | V3 `[.,;:!?)(\["“”]` và `LAW_NAME` `\s*(\([^()]*\)\s*)?["“]?(?!(kh|re|sư)\b)\p{Lu}` đúng nguyên văn §15.2, §15.3; C84–C86 ở test; version `@6` ở prompt, `PROMPT_VERSIONS`, §2 / §3, `ai-eval.md`. Luật nhập 13 (`analysisContentFits`, `ai-analyses.ts:254`) không chạy lại V3–V6 trên phân tích đã lưu, nên phân tích `@5` cũ vẫn nhập lại được. Regex mới tuyến tính (không lồng lượng từ). M6, M7 đỏ. |
| `144d7c7` | #1151 | T-393 | **Đúng** | `Button` mặc định `type="button"` (`Button.tsx:20`), nên "Thêm" trong `<form>` của `Dialog` không gửi form; `add` bỏ qua khi người chọn không còn trong danh sách. Chọn mà chưa bấm "Thêm" rồi Lưu thì không thêm ai: đúng test chấp nhận 1 của #1137. |
| `b2ef600` | #1153 | T-394 | **Đúng** | Hai hộp dùng `rows={met \|\| note.includes('\n') ? 3 : undefined}`; các ghi chú còn lại (CR đứng một mình, mất focus khi xóa LF cuối, lặp luật) đã ở sổ [sau v1.0]. |
| `d970448` | #1155 | T-395 | **Đúng** | `trashNames` (`trash-view.ts:267`) cho cùng chữ như `toldApart` + `teamsDeletedAt` cũ: khóa `team:<id>` (`teamDeletedAt`, `:293`), `when` giây / phút như `deletionWords`; `coded` (KH, bản ghi) và `byDeletion` (người, team) không chồng nhau. `restoreRow` bỏ `teams` theo ý (c) của #1140 (hộp khôi phục chỉ mở cho dòng không bị chặn). Bảng ca `trashNames: teams of one name` giữ chữ của ba chỗ. |
| `04a0cad` | #1157 | T-396 | **Đúng** | `git mv` nguyên nội dung; `check-tokens.ts` import `./token-guard.ts`; vitest thêm `packages/*/scripts/**`. Bỏ `globals` khỏi khối TS: hệ quả `no-global-assign` và coverage đã ở sổ [sau v1.0]. |
| `8accedd` | #1159 | T-397 | **Đúng** | Ma trận ký tự vô hình còn ở `text.test.ts` (thêm U+180E); mỗi chỗ gọi giữ một hai ca. `openProfile` / `pickTeam` chung ở `e2e/support.ts`, bản cũ trong bốn spec đã gỡ. |
| `4422431` | #1163 | T-398 | **Đúng** | `today` đọc `clockNow()` (`common.ts:129`); cả 9 chỗ gọi `today(db)` (lệnh, luật nhập 10 / 14, `plannedOff`) đổi chung. Không chỗ nào so một cột ngày (`today`) với một mốc `steadyClock` (`created_at` / `deleted_at`): luật nhập không đối chiếu hai loại; `ai_analyses.date` lấy `today(db)`. M1 đỏ. |
| `a1e6a20` | #1167 | T-399 | **Đúng** | Câu `MAX(date) … status = 'MET' … date > ?` luôn chạy (`customers.ts:313`). Không hồi quy ngoài ca đồng hồ lùi: với ngày ≥ hôm nay, MET sau ngày đó chỉ có khi đồng hồ lùi (lệnh chặn MET tương lai bằng `requireOutcomeDay`, nhập chặn bằng luật 10). Có chỉ mục `appointments_customer`. `DEMO_HASH` đổi vì bớt một lần đọc đồng hồ seed mỗi lần chuyển nhóm: Owner duyệt 08/11 (comment quyết định trên #1165, ghi ở `seed.test.ts:91`). Quét cùng mẫu (giả định "MET không sau hôm nay"): `unmovedMeetingsFrom`, `meetingKeepingMove`, `checkRestoreAppointment` không giới hạn theo hôm nay. M2 đỏ. |

## 3. Tương tác giữa các PR

1. **T-390 ↔ T-398 ↔ T-399 (đồng hồ):** sau ba PR, mỗi lần mở có hai đồng hồ: `now()` (mốc thời gian, id; không lặp, không lùi) và `clockNow()` (ngày của lệnh và của lần nhập; theo máy). Ba điểm có thể vỡ khi trộn hai đồng hồ, đều đã kiểm:
   - Khóa theo mốc: chỉ `transitionWithdrawnAt` dùng `deleted_at` làm khóa; xóa lịch truyền đúng một mốc cho lịch và transition (`softDeleteAppointment`, `stampDeleted`), nên khôi phục tìm đúng transition kể cả khi đồng hồ máy đứng (ca DR6-178 ×2) hay lùi (P1).
   - Ngày so với mốc: không luật / lệnh nào đối chiếu cột ngày với mốc `steadyClock`; mốc đi trước máy chỉ hiện ra ở chỗ hiển thị (`takenAt` của phiên ChatGPT web, cột "Xóa lúc") — mục đã ACCEPTED ("mốc thời gian đi trước đồng hồ máy", Owner 08/11), không có bằng chứng mới.
   - Chốt T-232 sau khi ngày theo máy: T-398 mở đường MET ngày "mai" trong một lần mở, T-399 đóng nó cho mọi lệnh ghi transition qua `checkTransition` (`changeStageManually`, `recordMeetingOutcome` / `editMeetingOutcome` qua `appendTransition`, khôi phục lịch). P2 cho thấy dữ liệu sau chuỗi lệnh vẫn qua luật 4 khi nhập (lúc 08/11 12:00), tức lỗi luật 4 của review #1163 không còn. Luật 10 từ chối tạm lúc 23:55 là đúng spec (mục 1.5).
   - `withSources` (seed): `clockNow()` cũng là đồng hồ được truyền, nên mỗi lần đọc "hôm nay" trong seed làm đồng hồ seed tăng một `tick`; đây là lý do T-399 đổi `DEMO_HASH` (Owner đã duyệt). Cơ chế có từ T-232 và ghi ở `seed.test.ts:89`; không phải phát hiện.
2. **T-395 ↔ T-397 (Thùng rác, e2e chung):** T-397 chỉ đổi ca `filterTrash` (`trash-view.test.ts:254`, `:258`) sau khi T-395 gộp tên dòng; hai phần không chạm cùng hàm. `openProfile` / `pickTeam` của `e2e/support.ts` không dùng ở e2e Thùng rác. Test `trash-view.test.ts` xanh ở `a1e6a20`.
3. **T-393 ↔ T-397 (e2e lịch hẹn):** `appointments.spec.ts` nhận cả ca "Thêm" (T-393) và `pickTeam` chung (T-397); ca "a coordinator filter hiding the new appointment" đã thêm bước bấm "Thêm".
4. **T-392 ↔ T-390 / T-398 (phân tích AI và ngày):** `recordAiAnalysis` lưu `date` theo `today(db)` (ngày máy) và `created_at` theo `now()`; luật 14 so `date`, nên phân tích ghi sau khi đồng hồ lùi vẫn nhập lại được cùng ngày. Seed ghi `PROMPT_VERSIONS` mới (`@6`), hash seed không đọc version (T-288).
5. **T-391 ↔ T-390:** `exportedAt` nay lấy mốc `steadyClock`; các test so file xuất đã bỏ `exportedAt` khi so. Kiểm cỡ đo trên chính chuỗi xuất. Không tương tác khác.

## 4. Phát hiện

**Chặn phát hành (K48): 0.**

**Không chặn: 1.**

### F1 — Câu "xuất quá 100 MB" bảo dùng bản `.db` của `backups\` mà không nói bản đó là dữ liệu lúc mở app

- **K48:** không chặn → đề xuất **[sau v1.0]**. **Mức:** Low. **Trục:** C (câu hướng dẫn khớp hành vi thật).
- **Vị trí:** `apps/desktop/src/i18n/vi.ts:1126` (`settings.backup.exportTooLarge`, T-391 thêm; hiện ở `apps/desktop/src/routes/SettingsBackup.tsx:69`). Bản `.db` trong `backups\` chỉ được ghi lúc mở app và trước khi thay dữ liệu (`apps/desktop/src/data/app-data.ts:41`–`:44`, `:366`, `:409`).
- **Mô tả:** câu nói "Dùng bản .db trong Project2C-data\backups\ thay cho file này: chép bản đó thành Project2C-data\project2c.db khi app đã đóng". "Thay cho file này" hứa một bản tương đương file xuất (dữ liệu hiện tại), nhưng bản mới nhất trong `backups\` là dữ liệu lúc mở app, thiếu mọi thay đổi trong phiên đang mở. Câu cùng loại cho Dọn sạch (`vi.ts:368`) có ghi "(mất các thay đổi sau lúc dọn)"; câu mới không có vế tương tự.
- **Kịch bản:** dữ liệu quá 100 MB; mở app 08:00, sửa cả buổi; 17:00 bấm "Xuất backup" → câu trên; người dùng lấy bản `.db` mới nhất trong `backups\` (lúc 08:00) làm bản sao lưu / mang sang máy khác, chép thành `project2c.db` → mất các thay đổi 08:00–17:00. Không cần đồng hồ lạ hay thao tác bất thường; chỉ cần đúng hướng dẫn.
- **Vì sao không chặn:** app không đổi / mất dữ liệu đã lưu (không thuộc định nghĩa trục D ở `docs/process/deep-review-phase-1-6.md` §4.1: lệnh, luật nhập, transaction, khôi phục ở Thùng rác); mất chỉ xảy ra ở bước chép tay sau đó. Trần 100 MB khó tới ở v1.0 (dữ liệu tải ≈ 16 MB). Hướng câu theo Q2 (a) của Owner 08/11 ("dùng bản `.db` trong thư mục `backups\`"). Nếu phiên điều phối / Owner coi hậu quả là trục D thì mục này thành chặn theo K48 — phiên này xếp C.
- **Sửa (≈ 1 dòng i18n):** thêm vế như "Bản mới nhất là dữ liệu lúc mở app: đóng rồi mở lại app để có bản của dữ liệu hiện tại", hoặc chỉ thẳng file `Project2C-data\project2c.db` (khi app đã đóng). Đổi chữ là đổi code (K49) nên để sau v1.0, trừ khi Owner kéo vào.
- **Không trùng sổ:** hai ghi chú của review #1147 (dòng 66, 67 của sổ) nói về test nhánh `catch` và phép đổi MB lặp, không về nội dung câu; comment review #1147 chỉ xét và bỏ phần "bản web không có thư mục `backups\`".

### Đã xét, không báo (đã có trong sổ hoặc đúng thiết kế)

- Mốc `steadyClock` đi trước máy (hiển thị `takenAt`, "Xóa lúc") sau khi đồng hồ lùi: ACCEPTED (Owner 08/11, review #1145); probe không cho bằng chứng mới đổi mức.
- Luật 10 từ chối tạm file có việc đã xảy ra ngày "mai" khi đồng hồ máy lùi qua nửa đêm (P2): đúng spec luật 10 sau T-398.
- Hai lần `today(db)` trong một lần nhập: DR6-202 [sau v1.0].
- Dòng `role="status"` giữ chữ cũ (T-393), CR đứng một mình / mất focus / luật lặp (T-394), `no-global-assign` / coverage / chú thích ESLint (T-396), `openProfile` của `dialog-keyboard.spec.ts` và `FILLER` (T-397), khối dựng probe lặp ba nơi (T-398), test nhánh `catch` và phép đổi MB lặp (T-391), regex §15 "Mất" / " - " (T-392): đều đã ở sổ [sau v1.0].

## 5. Kết luận

Mười PR của đợt sửa đúng phần sửa, đủ họ theo mục "Quét cùng mẫu", không thấy hồi quy; test của từng phần sửa đỏ khi gỡ phần sửa (M1–M7); ba PR đồng hồ T-390 / T-398 / T-399 khớp nhau khi chạy cùng (P1, P2). Không phát hiện chặn phát hành theo K48; một phát hiện không chặn (F1, Low / C, đề xuất [sau v1.0]).

GATE: SẴN SÀNG G7
