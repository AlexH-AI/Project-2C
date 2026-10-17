XONG — claude gói A lượt 2, 2026-10-17 02:39 (+07, giờ máy)

# Deep review Phase 1–6 lượt 2 — Claude — gói A (Lõi dữ liệu)

## 1. Phiên

- Bên: Claude (reviewer, phiên sạch, chỉ đọc). Gói: **A — Lõi dữ liệu** (`packages/domain/**`, `packages/db/**`).
- Worktree: `C:\workspace\Project-2C-review`, detached.
- SHA đầu phiên: `4217ed4cd3300af1d63aa61db9eb13902fe75f16` (khớp SHA ghim).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 2026-10-17 01:57:03 +0700 (đồng hồ máy).
- Máy: Home PC (`DESKTOP-KDURKJP`, theo HANDOFF / `baseline.md`).
- Công cụ / model / mức: Claude Code (desktop app, tab Code), model Claude Opus 5.5 (`claude-opus-5-5`), mức suy luận do Owner chọn cho phiên (không ghim); không subagent.
- Song song: phiên Codex của gói A ở `Project-2C-review-2` (Owner chạy cùng lúc); không chạy `pnpm e2e`, không đo trên exe.
- Bước 0: gói A là gói đầu (không có gói trước phải kiểm); `claude\A.md` chưa có → làm mới.

## 2. Bảng R

Đột biến "gỡ phần sửa" (`A\mut.mjs` + `mut-list.mjs`, log `A\mut.log`): vá **một** file của worktree, chạy file test của PR sửa, ghi lại nguyên byte, so sha256 với `git show HEAD:<file>` trước / sau mỗi lần; dòng cuối log `git status --short after: ""`. Tái hiện lượt 1 chạy lại bằng chính probe lượt 1 (chép sang `r2\claude\A\`, đổi đường nạp) và so với bản chép `8855345` (`git archive` ra `A\old-8855345\`, `P2C_REPO=…`).

| DR6 | Issue → PR | Kết luận | Bằng chứng (tái hiện lượt 1 nay ra gì; test nào đỏ khi gỡ phần sửa) | Biến thể / ghi chú (ID phát hiện) |
|---|---|---|---|---|
| 01 (phần A: lệnh, `listTrash`) | #592 → #614 | **ĐÃ SỬA** | Ca của phiên tổng hợp lượt 1 trên dữ liệu tải lượt 2 (`p02-load-restore.mjs`, `importBackup`, đồng hồ 12/10/2026): xóa rồi khôi phục ngay từng cuộc gặp Đã gặp sống — giữ nhóm **4 249 / 4 249 khôi phục được, 0 bị từ chối** (lượt 1: 2 690 / 4 254 bị từ chối); có chuyển nhóm 637 / 637 (2 214 `TRANSITION_NOT_LATEST` + 403 `STAGE_KEPT_BY_MEETING` không cho xóa); **0 lần** khôi phục không về như cũ (chuyển nhóm, nhóm KH, dòng lịch so từng cột trừ dấu xóa). Gỡ sửa: R01 (khôi phục so với nhóm hiện tại như `8855345`) → KILLED 3 test (E18, E19, `restore-roundtrip`); R03 (bỏ kiểm nhóm của ngày) → KILLED 2; R04 (luôn thêm chuyển nhóm mới) → KILLED 3; R04b (lần xóa đọc đồng hồ hai lần) → KILLED 14 | Fuzz K2: 333 lần "xóa → khôi phục ngay = như cũ" trên trạng thái ngẫu nhiên, 0 lệch; 903 lần `effect` / `blocked` của Thùng rác ↔ lệnh, 0 lệch. DB file cũ (`8855345`) mở bằng code mới (K4): 7 cuộc gặp có chuyển nhóm đã xóa bằng code cũ (hai mốc thời gian lệch) hiện "không đổi nhóm" và bị chặn `STAGE_NOT_ON_DAY`, không khôi phục được — cùng loại ghi chú của PR #614 + K1 (nạp lại), không ghi phát hiện. Phần màn: gói E |
| 02 (phần A: lệnh) | #594 → #618 | **ĐÃ SỬA** | Ca phiên tổng hợp lượt 1 (KH của RE A, lịch Dự kiến hôm nay, đổi RE → B, ghi N3 → N2 kèm hẹn tiếp): `p08-handover.mjs` H2 → `12/10 MET B`, `30/10 SCHEDULED B` (lượt 1: cả hai ở A). Gỡ sửa: R11 (không chuyển lịch) → KILLED 3; R12 (lịch tiếp giữ RE lịch vừa ghi) → KILLED 1; R13 (chuyển cả lịch đã qua) / R14 (cả lịch có kết quả) / R15 (cả lịch đã xóa) → KILLED 1 mỗi cái; **R16 (`previewHandover` bỏ "0 khi KH đã là của RE đó") → SỐNG** | **CL2-A3** (test hở R16). Fuzz K2: 313 lần đổi RE, 0 lịch Dự kiến còn ở RE khác, `previewHandover` = số lịch chuyển. Theo spec, không phải phát hiện: dời (6e) lịch Chưa ghi kết quả của RE cũ và khôi phục lịch Dự kiến đã xóa trước bàn giao tạo / đưa lại lịch Dự kiến ở RE cũ (spec Phase 3 §4 dòng `updateCustomerProfile`, TR-3); lịch Dự kiến cố ý đặt cho RE thứ ba cũng chuyển ("mọi lịch Dự kiến"); hộp 5c mở qua nửa đêm có thể nói số cũ (K5 H4, chỉ chữ). Phần 5c / 6h: gói D / E |
| 03 | #592 → #614 | **ĐÃ SỬA** | Probe lượt 1 `p1-restore.mjs` / `p5-restore-sameday.mjs` (laptop) chạy lại (`p03-restore-sameday.mjs`, log có cả bản `8855345`): P1a / P1b (ca a) Thùng rác `{"kind":"none"}`, khôi phục không thêm chuyển nhóm, RF 0 (lượt 1 P1b: thêm `N3→N2 (lịch)`, RF 1); P5a (ca b, E20) `blocked TRANSITION_BEFORE_LATEST {"date":"02/10/2026"}` (lượt 1: khôi phục hạ N1 → N2, mất RF); P5b (E6) như cũ. Gỡ sửa: R02 (bỏ `recordedAfter`) → KILLED (E20); R01 → KILLED (E19) | P5d (chuyển tay đúng tới nhóm sau, cùng ngày, sau lúc xóa) khôi phục không chuyển nhóm, cuộc gặp mất RF — đúng E7 của spec ("cuộc hẹn này không tính RF"), không phải lỗi. **CL2-A5** (so mốc thời gian dạng chữ, file sửa tay) |
| 04 (phần A: lệnh) | #593 → #616 | **ĐÃ SỬA** | `s2-scenarios.mjs` S1 / S2 lượt 1 (Home PC CL-A2) chạy lại (`p12-rerun.mjs`): S1 dời cuộc gặp giữ N3 qua chuyển tay → ghi `#3 N2→N3 2026-09-20 (cuộc gặp)` như ghi mới (lượt 1: OK mà không chuyển nhóm, trái dòng thời gian); S2 dời về trước chuyển tay → `TRANSITION_BEFORE_LATEST {"date":"15/09/2026"}` (lượt 1: OK). H·CL-E4: ghi bù 05/09 nhóm sau N2 → từ chối, N3 → nhận, giữ nhóm. Gỡ sửa: R05 (`applyOutcome` so nhóm hiện tại) → KILLED 5; R06 (6f không kiểm lại khi dời ngày cuộc gặp giữ nhóm) → KILLED 2 | **CL2-A1** (biến thể / hồi quy DR-43: cuộc gặp trước ngày tạo KH luôn bị từ chối). Fuzz K2: 386 lần hộp 6c ↔ lệnh, chỉ lệch đúng ca CL2-A1. Phần 6c / 6f: gói E |
| 05 | #593 → #616 | **ĐÃ SỬA** | Probe lượt 1 Home PC `p10-manual-backdate.mjs` chạy lại (`p09-dr605-rerun.mjs`): chuyển tay lùi ngày qua cuộc gặp giữ N3 → `refused TRANSITION_BEFORE_MEETING {"date":"07/10/2026"}` (lượt 1: nhận); `p8-invariants.mjs` trên dữ liệu tải lượt 2: `metKeepStageOffTheStageOfItsDay: 0` (lượt 1: 1 ca do `fillTrash`), 0 chuyển nhóm sống của lịch đã xóa / không Đã gặp. Gỡ sửa: R07 (bỏ `TRANSITION_BEFORE_MEETING`) → KILLED; R08 (bỏ `STAGE_KEPT_BY_MEETING`) → KILLED; R09 (`fillTrash` bỏ luật D7 mới) → hai bộ test dữ liệu tải đỏ (`seed-invariants.test.ts > on the load data`, `load-data-core.test.mjs`: seed ném `DbError: STAGE_KEPT_BY_MEETING`, log `mut-R09.out`); R10 (luật nhập 4 bỏ `isStageOfDay`) → KILLED | Fuzz K2: 366 lần khóa D7 của màn (`outcomeLock`) ↔ `softDeleteAppointment`, 0 lệch. Trên dữ liệu tải 403 cuộc gặp có chuyển nhóm nay không xóa được vì cuộc gặp giữ nhóm sau (D7 mở rộng chạy) |
| 44 (phần A: chỉ mục, migration) | #601 → #630 | **ĐÃ SỬA** | Cùng DB, cùng lần chạy (`p11-trash-index.mjs`, dữ liệu tải + 150 KH xóa = 165 KH, 263 dòng): `listTrash` **35,6 ms** có chỉ mục 0009 / **374,9 ms** khi bỏ 3 chỉ mục (như `8855345`); `countCustomerRecords` 0,07 / 2,06 ms mỗi KH; **kết quả giống hệt** (JSON `listTrash` + đếm từng KH). So lượt 1 Home PC (`p10-perf.mjs`): 100 KH xóa 211,2 → **31,6 ms**, 400 KH 814,8 → **59,2 ms**. Migration trên DB v9 có dữ liệu tải (K4): 51 ms, mọi bảng giữ nguyên dòng, ba truy vấn dùng chỉ mục. Gỡ sửa: R17 / R17b (bỏ một chỉ mục khỏi 0009) → KILLED 2 mỗi cái | Hiệu năng tốt lên, hành vi không đổi: ✅. Đo trên exe: gói F |
| 49 | #604 → #640 | **ĐÃ SỬA** | `text-probe.mjs` + S3 / S4 lượt 1 chạy lại (`p12-rerun.mjs`): "Sao Mai\u200B", "Sao Mai" NFD, "Bình  Minh" sau "Bình\u00A0Minh" → `TEAM_NAME_TAKEN`; tên chỉ `\u200B` / `\u2060` / `\uFEFF` / NBSP → `NAME_REQUIRED`; ghi chú KYC `\u200B` → `KYC_NOTE_EMPTY`; giá trị KYC `\u200B` → `INVALID_KYC_VALUE`; "A\uD800", "\uDC00B" → `INVALID_TEXT` (lượt 1: tất cả nhận, surrogate thành U+FFFD). `s2-zw-gate.mjs`: U+200B không còn đổi cổng (K3). Gỡ sửa: R18 (giữ `\p{Cf}`) KILLED 10, R19 (giữ khoảng trắng) KILLED 6, R20 (surrogate lưu được) KILLED 4, R21 (ghi chú mất xuống dòng) KILLED 3, R22 (bỏ Cf sau NFC) KILLED 1, R23 (`valueOf` như cũ) KILLED 1, R24 (giá trị KYC chỉ NFC + trim) KILLED 3 | **CL2-A2** (ký tự vô hình không thuộc `\p{Cf}`: U+3164, U+034F, U+FE0F, U+2800 vẫn lọt, đổi cổng). Hai hàm ổn định trên 137 154 chuỗi ngẫu nhiên (K3). KNOWN #640: ZWJ / ZWNJ, U+2028 trong ghi chú, `optionalText` — không có bằng chứng mới |
| 50 | #604 → #640 | **ĐÃ SỬA** | Ca L·CX-A1 / H·CX-A1 (file sửa tay, `p12-rerun.mjs`): mâu thuẫn `childrenCount` 2 / 2 → `BACKUP_INVALID {"rule":7}`; 2 / `2.0` → rule 7 (lượt 1: nhận); 2 / 3 do lệnh → nhận. Gỡ sửa: R25 (bỏ kiểm giá trị khác nhau) KILLED 3; R26 (so chữ JSON thay giá trị) KILLED 1 | — |
| 51 | #604 → #640 | **ĐÃ SỬA** | Ca L·MU-A1 (`p12-rerun.mjs`): giới tính "X", vai trò "ADMIN" → `INVALID_CHOICE`; nhóm "N9" / chuyển tay "N0" / nhóm sau "N7" → `INVALID_TRANSITION {"to":…}`; trigger "X" → `INVALID_TRIGGER`, trạng thái "LOST" → `INVALID_STATUS` (lượt 1: lỗi `CHECK constraint` thô). Gỡ sửa: R27 (`requireChoice` không kiểm) KILLED 2; R28 (`requireStage` không kiểm) KILLED 2 | — |
| 52 | #604 → #640 | **ĐÃ SỬA** | DB v9 dữ liệu tải mở bằng code mới (K4): `INSERT` IS có team bằng SQL thô → `CHECK constraint failed: people_team_none` (lượt 1: nhận); mọi dòng `people` giữ nguyên, `foreign_key_check` rỗng. Gỡ sửa: R29 (0010 không có CHECK) → KILLED 5 | — |
| 54 | #607 → #619, #604 → #640 | **ĐÃ SỬA** (ghi lệch đã biết) | `docs/golden/lich-hen.md:61` có ghi chú L-09 / A09 "dữ liệu trước DR-47", bảng số và fixture không đổi (`git diff --stat 8855345 4217ed4 -- packages/domain/src/golden` rỗng); `model.ts:76` "never an RE (DR-47)", `appointment-counts.ts:35` bỏ "even RE", JSDoc thừa của `seed.ts` đã về đúng `profile`. Khớp app (`p12-rerun.mjs`): RE phối hợp → `INVALID_COORDINATOR {"name":"Bình","role":"RE"}`; file có RE phối hợp → `BACKUP_INVALID {"rule":5}`, đúng câu ghi chú "lệnh và luật nhập backup đều từ chối RE" | — |
| 59 | #606 → #644 | **ĐÃ SỬA** | Áp lại đột biến lượt 1: A-M31 (`kycHash` bỏ `status`) KILLED 2 (ghim K10, K14); A-M15 (bỏ `t.deleted_at IS NULL`) KILLED 1; A-M10 (`valueOf` nhận số lẻ) KILLED 2 (hai cột token); A-N19 (`rf: true`) KILLED 1 (lượt 1: cả bốn sống) | — |

## 3. Phạm vi đã đọc

**Diff sửa của gói A** (`git diff --numstat 8855345 4217ed4 -- packages/domain/src packages/db/src`): SP +496 / −102, test +985 / −25 (trùng plan §L2.3). Đọc từng hunk của: `appointments.ts`, `customers.ts`, `common.ts`, `kyc.ts`, `team.ts`, `schema.ts`, `database.ts`, `errors.ts`, `migrations.ts`, `index.ts`, `backup.ts`, `backup-validation.ts`, `trash.ts`, `seed.ts`; `domain/src/{text,kyc-fact,model,appointment-counts,index}.ts`; migration `0009_lookup_indexes.sql`, `0010_people_team_none.sql`; danh sách ca test mới của mọi file test trong diff.

**Đọc hết file ở SHA ghim:** `packages/db/src/appointments.ts` (594 dòng), `customers.ts` (541), `trash.ts` (255), `backup-validation.ts` (460), `backup.ts` (207), `common.ts` (188), `database.ts` (246), `packages/domain/src/text.ts` (41), `kyc-fact.ts` (74), `customer-lifecycle.ts` (64), `restore-roundtrip.test.ts` (118). Đọc phần: `team.ts` 60–320, `kyc.ts` 100–340 + 382–395, `seed.ts` 395–430 (`fillTrash`) + diff, `counts.ts` 50–90, `policies.ts` 1–60, `database.test.ts` (diff: `quickCheck`, migration v9 / v10 có dữ liệu), `customers.test.ts` 180–241, `appointments.test.ts` 725–760. Không đọc lại toàn bộ phần không đổi từ lượt 1 (`period.ts`, `money.ts`, `stats.ts`, `stage-snapshot.ts`, golden fixture: `git diff 8855345 4217ed4` rỗng cho các file này), `ai-analyses.ts` (không đổi), `seed-data.ts`.

**Chỗ gói khác nối vào (chỉ đọc chỗ nối):** `apps/desktop/src/routes/appointments/outcome-form.ts` 1–150 (`outcomeLock`, `meetingDay`, `heldStage`, dùng lại trong fuzz K2), `OutcomeDialog.tsx` (dòng 55–76, 170), `routes/customers/CustomerDialogs.tsx` 120–215, 300–310 (`useHandover`, ô Ngày), `routes/trash-view.ts` 185–230 (`blockedReason`), `i18n/vi.ts` (khóa `error.*` của 4 mã mới, `trash.blocked.*`), `data/app-data.ts` (`quickCheck` lúc mở).

**Tài liệu:** `CLAUDE.md` gốc, `packages/{db,domain}/CLAUDE.md`, `apps/desktop/CLAUDE.md`, `.claude/rules/{tests,i18n-ui}.md`; spec Phase 6 §4.2 (TR-1…TR-10, E1–E20), spec Phase 3 D7, D10, §4 (dòng `updateCustomerProfile`, `changeStageManually`, `recordMeetingOutcome`, `softDelete…`/`restore…`), §6 luật 4; `docs/golden/lich-hen.md` (L-09, ghi chú mới); DR-43 trong `docs/state/review-notes.md` và tổng hợp Phase 1–4 §11–§12; tổng hợp lượt 1 §1–§5.6, §7; báo cáo gốc lượt 1 Claude A cả hai máy, H·CL-F3 (Home PC F); `common\{plan.md §L2, known.md, fixes.md (#592–#594, #601, #604, #606, #607), baseline.md}`.

## 4. Kịch bản mới đã thử

| # | Kịch bản (các bước, dữ liệu) | Kết quả | ID |
|---|---|---|---|
| K1 | Ghi bù cuộc gặp **trước ngày tạo KH** (DR-43 / K2): KH tạo N3 ngày 10/10, lịch 05/10 → ghi Đã gặp nhóm sau N3 (giữ), N2 (đổi), Không đến; nộp HĐ 05/10; so với bản chép `8855345`; kiểm luật nhập trên dữ liệu "giữ nhóm trước ngày tạo"; hàm `meetingDay` / `heldStage` của 6c (`p01-before-creation.mjs`) | `4217ed4`: Đã gặp N3 **bị từ chối** `TRANSITION_BEFORE_LATEST {date: 10/10/2026}` (ở `8855345`: OK); nhập backup từ chối luật 4 (ở `8855345`: nhận); 6c `from: null` → hộp hiện "nhóm trước" = nhóm hiện tại, không khóa | CL2-A1 |
| K2 | Fuzz lệnh lượt 2 (`fuzz2.mjs`, mở rộng `fuzz.mjs` lượt 1): 8 seed (31–38) × 2 000 lệnh công khai của `db` trên seed nhỏ có Thùng rác, đồng hồ đi tới (12/10 → 27/10–05/11). Sau mỗi lệnh: lệnh bị từ chối không đổi dữ liệu; lệnh nhận để lại dữ liệu luật nhập nhận; **mới:** xóa lịch → khôi phục ngay trên bản chép = như cũ trừ `updated_at` / `deleted_at` (333 lần); đổi RE → không còn lịch Dự kiến ở RE khác và `previewHandover` = số lịch chuyển (313 lần); ô "nhóm sau" mà hộp 6c bắt đầu / khóa (`meetingDay` / `heldStage`, `from ?? customer.stage`) được lệnh nhận (386 lần); khóa D7 của màn (`outcomeLock`) ↔ `softDeleteAppointment` (366 lần); mỗi 100 bước `blocked` / `effect` của Thùng rác ↔ lệnh khôi phục trên bản chép (744 KH, 903 cuộc gặp) và khôi phục xong luật nhập vẫn nhận; mỗi 250 bước xuất → nhập → xuất | 4 phát hiện, cả 4 là ca CL2-A1 (`sub: fromNull`: lịch trước ngày tạo KH, hộp 6c bắt đầu từ nhóm hiện tại, lệnh `TRANSITION_BEFORE_LATEST`); 0 lệch ở mọi thuộc tính khác; 0 lỗi không phải `DbError` | CL2-A1 |
| K3 | Chữ sau #640 (K20): (a) 200 000 chuỗi ngẫu nhiên (chữ, dấu tổ hợp NFD, ký tự `\p{Cf}`, NBSP / U+2028 / U+3000 / tab / xuống dòng, U+3164, U+034F, U+FE0F, U+0085, surrogate) → `normalizeText` / `normalizeNote` có ổn định không (luật nhập chỉ nhận chữ mà làm sạch lần nữa không đổi, `storedAs`); (b) tên team / KH và giá trị KYC chỉ gồm ký tự vô hình **không** thuộc `\p{Cf}` / khoảng trắng; (c) lặp probe `s2-zw-gate.mjs` lượt 1 (KH 5 dữ kiện + năm sinh, giới tính, cổng PROFILE_DISCOVERY) với U+200B rồi U+3164 (`p05-text.mjs`) | (a) 137 154 chuỗi lưu được, 0 chuỗi không ổn định ở cả hai hàm. (b) team tên là một U+3164, team "Sao Mai" + U+3164 (khi đã có "Sao Mai"), team "Sao Mai" + U+FE0F, KH tên là một U+2800 đều được tạo. (c) U+200B nay `INVALID_KYC_VALUE` (DR6-49 đã sửa); U+3164 → dữ kiện, cổng PROFILE_DISCOVERY → PAIN_POINT_ANALYSIS; hai U+2800 → thêm một hạng mục; nhập backup nhận | CL2-A2 |
| K4 | Mở **file DB** (không phải backup) do code `8855345` ghi — dữ liệu tải ở schema 9, có Thùng rác (`p04a-make-db.mjs` trên bản chép cũ) — bằng code ghim, như lần mở đầu của exe v1.0 (`p04b-open-old.mjs`): migration 0009 / 0010, so hash từng bảng trước / sau, chỉ mục được dùng, CHECK mới, `foreign_key_check`, `quickCheck`; Thùng rác của các cuộc gặp code cũ đã xóa; file backup cũ của cùng dữ liệu qua `importBackup` | Mở + migrate 51 ms, schema 9 → 11, **0 bảng đổi dòng**, ba truy vấn `SEARCH … USING (COVERING) INDEX`, `foreign_key_check` 0, `quickCheck` `[]`, IS có team bằng SQL thô → `CHECK constraint failed: people_team_none`. 41 cuộc gặp giữ nhóm đã xóa: hiệu ứng "không đổi nhóm", khôi phục được; 7 cuộc gặp có chuyển nhóm đã xóa bằng code cũ: "không đổi nhóm" + chặn `STAGE_NOT_ON_DAY` (mốc thời gian lệch, K1). Backup cũ: `BACKUP_INVALID {"rule":4}` (K1, như PR #616 ghi) | — (K1) |
| K5 | Bàn giao nhiều bước (`p08-handover.mjs`): H1 A → B → A khi có lịch Dự kiến cố ý đặt cho RE C; H2 bàn giao rồi dời (6e) lịch Chưa ghi kết quả của A, khôi phục lịch Dự kiến đã xóa trước bàn giao, ghi kết quả + hẹn tiếp, rồi xuất → nhập; H3 bàn giao rồi xóa RE cũ / RE mới; H4 xem trước lúc 23:59, lưu lúc 00:00:01 | H1: lịch của C cũng chuyển sang B rồi sang A (đúng "mọi lịch Dự kiến"); `previewHandover` 2 / 0 đúng. H2: `12/10 MET B`, `30/10 SCHEDULED B`; lịch dời 15/10 và lịch khôi phục 25/10 ở A — đúng spec (6e "cùng RE", TR-3), KH thuộc B mà còn 2 lịch Dự kiến ở A; xuất → nhập nhận. H3: xóa A được khi A không còn bản ghi; xóa B bị `PERSON_IN_USE`. H4: hộp nói "1 lịch chuyển", lưu sau nửa đêm thì lịch 12/10 (nay đã qua) ở lại A — đúng luật, chữ hộp cũ (không ghi phát hiện) | — |
| K6 | `quickCheck` (#620) với chỉ mục mới `appointments_customer` lệch bảng (ẩn chỉ mục bằng `writable_schema`, thêm 3 lịch, trả chỉ mục về trang gốc cũ — hỏng kiểu ghi dở), so `integrity_check`, đọc qua chỉ mục; đo `quick_check` / `integrity_check` trên dữ liệu tải (`p06-quickcheck.mjs`) | `quickCheck()` → `["wrong # of entries in index appointments_customer"]` (bắt được, app chặn mở); đọc qua chỉ mục ra 3 thay vì 6 lịch. Dữ liệu tải: `quick_check` 65,8 ms, `integrity_check` 97,4 ms | không thấy |
| K7 | `stageOnDay` (SQL theo `seq`) ↔ `stageOn` (domain, theo ngày) trên dữ liệu tải: mọi KH × mọi ngày cuộc hẹn và ngày trước / sau mỗi chuyển nhóm; `isStageOfDay` của mọi cuộc gặp giữ nhóm (`p07-stageonday.mjs`) | 21 086 cặp (KH, ngày), **0 lệch**; 4 249 cuộc gặp giữ nhóm, 0 cuộc ghi nhóm không có trong ngày | không thấy |
| K8 | Trên dữ liệu tải: xóa rồi khôi phục ngay **mọi** cuộc gặp Đã gặp sống (7 503), so dòng chuyển nhóm / nhóm KH / dòng lịch trước và sau (`p02-load-restore.mjs`) | Giữ nhóm 4 249 / 4 249; có chuyển nhóm 637 / 637 về như cũ; 2 214 + 403 bị D7 chặn xóa (403 là luật `STAGE_KEPT_BY_MEETING` mới); 0 lần không về như cũ | không thấy |
| K9 | E20 so mốc thời gian dạng chữ (`latest.createdAt > recordedAfter`): file sửa tay chỉ đổi `created_at` của một chuyển tay cùng ngày, ghi **trước** lúc xóa, từ `…13:00:00.001Z` thành `…13:00:00Z` (cùng định dạng `z.iso.datetime()` nhận) (`p13-timestamps.mjs`) | App như ghi: không chặn (đúng E20 câu 2). File sửa: nhập nhận, rồi Thùng rác chặn `TRANSITION_BEFORE_LATEST {"date":"02/10/2026"}` dù chuyển tay ghi trước lúc xóa | CL2-A5 |
| K10 | File sửa tay: chuyển nhóm **đã rút** của KH Y trỏ vào cuộc gặp đã xóa của KH X, cùng `deleted_at` với lần xóa của X; nhập, xem Thùng rác, khôi phục cuộc gặp của X (`p14-foreign-withdrawn.mjs`) | Nhập nhận; Thùng rác hứa "X: N3 → N2, tính 1 RF"; khôi phục → **Y lên N2** (chuyển nhóm của Y quay lại, trỏ vào cuộc gặp của X), X vẫn N3 dù cuộc gặp ghi N2; sau đó xuất → nhập bị từ chối luật 4 | CL2-A4 |
| K11 | Hiệu năng đường lệnh đã sửa trên dữ liệu tải (`p10-perf.mjs`): ghi / sửa / dời / xóa / khôi phục cuộc gặp, chuyển tay lùi ngày (bị từ chối), `previewHandover`, bàn giao 3 lịch, `countCustomerRecords`; `listTrash` 15 → 400 KH xóa | Mọi lệnh ≤ 0,8 ms trung vị (max 1,8 ms); `listTrash` 23,4 → 59,2 ms (mục 6) | không thấy |

## 5. Phát hiện mới

### CL2-A1 — Ghi bù cuộc gặp Đã gặp mang ngày trước ngày tạo KH nay luôn bị từ chối (trái DR-43 / K2), luật nhập backup cũng từ chối

```
ID: CL2-A1
Mức: Low
Trục: R, C
Vị trí: packages/db/src/appointments.ts:405-409 (applyOutcome → stageOnDay), :332-336 (outcomeStage: "none before the customer's creation"); packages/db/src/customers.ts:324-336 (stageOnDay null trước ngày tạo), :343-355 (isStageOfDay: start undefined → false); packages/db/src/backup-validation.ts:220-226 (luật 4) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-04 (biến thể), DR-43 / K2 (ACCEPTED) · mới do đợt sửa (PR #616)
Kịch bản: K1
```

- **Mô tả:** T-232 so "nhóm sau" với nhóm của KH **tại ngày cuộc hẹn** (`stageOnDay`). Trước ngày tạo KH, hàm trả `null`, nên mọi "nhóm sau" đều là "đổi nhóm" → `appendTransition` ở ngày trước transition tạo KH → D10 từ chối. Trước đợt sửa, cuộc gặp **giữ nhóm** trước ngày tạo KH được nhận — đúng quyết định Owner 06/10 (DR-43 ACCEPTED, K2: "HĐ / cuộc gặp Đã gặp mang ngày … trước ngày tạo KH là nhập bù hợp lệ — không thêm luật ở lệnh hay khi nhập backup"). Luật nhập 4 mới (`isStageOfDay`) cũng từ chối đúng dữ liệu đó. Spec Phase 3 §4 dòng `recordMeetingOutcome` (T-232, "so với nhóm tại ngày cuộc hẹn (`stageOn`)") và DR-43 nay mâu thuẫn nhau ở ca này; PR #616 / Issue #593 không nhắc DR-43.
- **Tái hiện:** `node p01-before-creation.mjs` (log `A\p01-before-creation.log`) và cùng probe trên bản chép `8855345` (`P2C_REPO=…\old-8855345\`, log `p01-before-creation.old.log`):

  | Bước (KH tạo N3 ngày 10/10, lịch 05/10) | `8855345` | `4217ed4` |
  |---|---|---|
  | Ghi Đã gặp 05/10, nhóm sau N3 (giữ nhóm) | `OK` | `refused TRANSITION_BEFORE_LATEST {"date":"10/10/2026"}` |
  | Ghi Đã gặp 05/10, nhóm sau N2 | `refused TRANSITION_BEFORE_LATEST` | `refused TRANSITION_BEFORE_LATEST` |
  | Ghi Không đến 05/10 / nộp HĐ 05/10 | `OK` / `OK` | `OK` / `OK` |
  | Luật nhập trên DB có cuộc gặp giữ N3 ngày 05/10 | `nhập backup nhận` | `nhập backup từ chối BACKUP_INVALID {"rule":4}` |
  | Đối chứng: cùng ca, lịch ngày 10/10 (= ngày tạo) | `OK` | `OK` |

  Hàm của hộp 6c (`apps/desktop/src/routes/appointments/outcome-form.ts` `meetingDay`, chạy trong probe): `meetingDay(05/10)` → `{"from":null,"change":{…10/10…}}`, `heldStage` → không có; `OutcomeDialog.tsx:170` dùng `from={onDay.from ?? customer.stage}` nên hộp ghi "nhóm trước N3", cho chọn "giữ nguyên" mà không khóa, rồi Lưu nhận câu `error.TRANSITION_BEFORE_LATEST` "Ngày chuyển trước lần đổi nhóm gần nhất (10/10/2026)." — trong khi 10/10 là ngày tạo KH, không phải một lần đổi nhóm (phần màn: đọc code + hàm thuần, chưa chạy trên bản build).
- **Ảnh hưởng:** RE tạo KH trong app sau buổi gặp đầu (ô Ngày của hộp tạo KH mặc định hôm nay, `CustomerDialogs.tsx:194` `useDateField(today)`) rồi ghi bù buổi gặp đó: không ghi được Đã gặp ở bất kỳ nhóm nào; đường vòng là xóa và tạo lại KH với ngày tạo sớm hơn (mất bản ghi đã nhập), hoặc ghi sai trạng thái. Không mất dữ liệu đã lưu; cần ngày gặp trước ngày tạo nên chấm Low. Dữ liệu cũ đúng DR-43 nay bị nhập backup từ chối (K1: nạp lại).
- **Đề xuất:** Owner chọn (G2): (a) giữ DR-43 — trước ngày tạo, "nhóm của ngày" là nhóm tạo KH (transition đầu): `stageOnDay` / `isStageOfDay` / `meetingDay` lấy transition đầu khi ngày trước nó (≈ 5–10 dòng SP + test lệnh, luật nhập, `outcome-form`); hoặc (b) bỏ DR-43 cho cuộc gặp: ghi vào ACCEPTED / spec Phase 3 §4, hộp 6c khóa ô và nói rõ "trước ngày tạo KH" thay câu D10. Test giữ: `appointments.test.ts`, `backup-invariants.test.ts` (ca trước ngày tạo), `outcome-form.test.ts`.

### CL2-A2 — Ký tự vô hình không thuộc `\p{Cf}` (U+3164 HANGUL FILLER, U+115F, U+FFA0, U+034F, U+FE0F, U+2800) vẫn làm tên / giá trị KYC "có chữ": cổng KYC đổi như lượt 1

```
ID: CL2-A2
Mức: Low
Trục: E
Vị trí: packages/domain/src/text.ts:22-28 (normalizeText chỉ bỏ \p{Cf} và gộp \s), :2-5 (doc comment "text with nothing to see is empty"); packages/domain/src/kyc-fact.ts:44-61 (normalizeKycValue); packages/db/src/common.ts:26-28, :49-53 (cleanText, requireName) (4217ed4)
Tình trạng: CONFIRMED (lệnh, luật nhập, cổng); "hiển thị trống" theo thuộc tính Unicode, chưa chụp màn
Liên quan: DR6-49 (biến thể gần), K20 · có từ trước, phần sửa #640 chưa phủ
Kịch bản: K3
```

- **Mô tả:** #640 bỏ mọi `\p{Cf}` và gộp khoảng trắng, nên U+200B / U+2060 / NBSP của lượt 1 nay bị chặn. Nhưng Unicode còn các ký tự **vô hình không phải Cf / khoảng trắng**: U+3164, U+115F, U+FFA0 (Lo), U+034F, U+FE00–U+FE0F (Mn) thuộc `Default_Ignorable_Code_Point` (trình duyệt không vẽ gì), U+2800 (So) vẽ ô trống. `normalizeText` giữ nguyên chúng, nên một giá trị KYC chỉ gồm các ký tự này vẫn thành dữ kiện, tên team / KH chỉ gồm chúng không phải "rỗng", và "Sao Mai" + U+3164 là một team mới. Doc comment `text.ts:2-3` hứa "text with nothing to see is empty".
- **Tái hiện:** `node p05-text.mjs` (log `A\p05-text.log`): với U+3164 → `\p{Cf}=false \s=false \p{DI}=true`, `normalizeText` trả lại đúng ký tự đó (tương tự U+115F, U+FFA0, U+034F, U+FE0F; U+2800 `\p{DI}=false`); `createTeam` tên là một U+3164 → `OK`; tên "Sao Mai" + U+3164 khi đã có "Sao Mai" → `OK`; `createCustomer` tên là một U+2800 → `OK`. KYC (ca `s2-zw-gate.mjs` của lượt 1, KH có 5 dữ kiện + năm sinh, giới tính): `cổng trước: PROFILE_DISCOVERY · thiếu ["RISK_APPETITE","EXISTING_PROTECTION","CONCERNS"]` → `riskProfile` = U+200B: `refused INVALID_KYC_VALUE` (DR6-49 đã sửa) → `riskProfile` = U+3164: `OK`, `cổng: PAIN_POINT_ANALYSIS · thiếu ["EXISTING_PROTECTION","CONCERNS"]` → `mainConcern` = hai U+2800 (ghi chú là một U+3164): `OK`, thiếu còn `["EXISTING_PROTECTION"]`; `nhập backup nhận`. Hộp 7a kiểm rỗng bằng cùng `normalizeText` (`KycDialogs.tsx`, K20 "cùng một hàm ở lệnh, nhập backup và UI"), nên màn cũng nhận.
- **Ảnh hưởng:** như DR6-49 lượt 1, chỉ với ký tự khác: dán một giá trị chỉ có ký tự vô hình (U+3164 hay gặp trong "tên trống" của mạng xã hội) làm hạng mục KYC thành "đã có", cổng lên PAIN_POINT_ANALYSIS, panel AI phân tích trên một khẩu vị rủi ro không đọc được; hai team / KH trông trùng tên. Cần dán đúng ký tự đó → Low.
- **Đề xuất:** `normalizeText` bỏ `\p{Default_Ignorable_Code_Point}` (gồm sẵn `\p{Cf}` và U+3164, U+034F, U+FE0F…) thay cho `\p{Cf}`, có thể thêm U+2800; nếu muốn giữ ZWJ / ZWNJ trong emoji ghép (KNOWN #640) thì loại trừ hai ký tự đó. Đổi luật chữ là quyết định Owner (K20) → hỏi Owner; ≈ 2 dòng SP + ca test ở `text.test.ts`, `kyc.test.ts`, `team.test.ts`; dữ liệu cũ nạp lại (K1).

### CL2-A4 — Khôi phục một cuộc gặp đưa lại chuyển nhóm đã rút mà không kiểm nó thuộc cùng KH: file sửa tay làm khôi phục đổi nhóm của KH khác

```
ID: CL2-A4
Mức: Low
Trục: S, D
Vị trí: packages/db/src/customers.ts:411-423 (transitionWithdrawnAt: chỉ lọc appointment_id + deleted_at), :430-453 (reinstateTransition: `follows` không so customer_id / appointment_id với lịch được khôi phục, rồi updateCustomerRow(withdrawn.customerId)); packages/db/src/backup-validation.ts:210-239 (luật 4 chỉ xét chuyển nhóm còn hiệu lực) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-01 / DR6-03 · mới do đợt sửa (PR #614)
Kịch bản: K10
```

- **Mô tả:** trước #614 chuyển nhóm đã rút không bao giờ quay lại, nên luật nhập chỉ cần kiểm chuyển nhóm còn hiệu lực. Nay khôi phục một cuộc gặp lấy lại "chuyển nhóm mà lần xóa đã rút" chỉ theo `appointment_id` + đúng `deleted_at`, rồi bỏ `deleted_at` của nó và đặt nhóm cho `withdrawn.customerId` — không kiểm chuyển nhóm đó là của chính KH của lịch hẹn. Luật nhập không xét chuyển nhóm đã rút, nên file sửa tay mang một chuyển nhóm như vậy được nhận.
- **Tái hiện:** `node p14-foreign-withdrawn.mjs` (log `A\p14-foreign-withdrawn.log`): hai KH X, Y cùng có cuộc gặp 02/10 N3 → N2 đã xóa; file sửa: chuyển nhóm đã rút của Y trỏ vào cuộc gặp của X, `deleted_at` = lần xóa của X → `hand-edited file: importBackup accepted`; Thùng rác của cuộc gặp X: `{"kind":"stageChange","from":"N3","to":"N2",…,"rf":true}`, không chặn; khôi phục → `restore X meeting: OK`, sau đó `X: N3 … [rút]` · `Y: N2 #1 ∅→N3 2026-10-01 | #2 N3→N2 2026-10-02 (cuộc gặp)`; `nhập backup từ chối BACKUP_INVALID {"rule":4}` (chính dữ liệu app vừa tạo không xuất → nhập lại được).
- **Ảnh hưởng:** chỉ với file sửa tay (lệnh của app luôn rút chuyển nhóm của chính KH) → Low; khi gặp thì lặng lẽ đổi nhóm / RF của một KH khác, và file xuất sau đó bị từ chối.
- **Đề xuất:** `reinstateTransition` chỉ đưa lại khi `withdrawn.customerId === row.customerId` (thêm vào `follows`, hoặc lọc ở `transitionWithdrawnAt`), ngoài ra coi như không có chuyển nhóm đã rút; và / hoặc luật nhập 4 xét cả chuyển nhóm đã rút có `appointment_id`: cùng KH với lịch hẹn. ≈ 2–6 dòng SP + một ca `backup-invariants.test.ts` / `trash.test.ts`.

### CL2-A3 — Không test nào giữ nhánh "0 khi KH đã là của RE đó" của `previewHandover` (đột biến R16 sống)

```
ID: CL2-A3
Mức: Low
Trục: T
Vị trí: packages/db/src/customers.ts:164-171 (previewHandover, :165); test packages/db/src/customers.test.ts:190-191, :206, :228-229 (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-02 · mới do đợt sửa (PR #618)
```

- **Mô tả:** bỏ dòng `if (liveCustomer(db, id).reId === reId) return 0;` mà mọi test vẫn xanh: các ca gọi `previewHandover` với RE hiện tại đều là KH không có lịch Dự kiến ở RE khác, nên `plannedOff(…, reId)` cũng ra 0. Hộp 5c gọi hàm này ngay với RE đang chọn — lúc mở hộp chính là RE hiện tại (`CustomerDialogs.tsx:188` `useState(customer?.reId …)`, `:207` `useHandover`, `:307` hiện câu khi > 0), và lịch Dự kiến cho RE khác là hợp lệ (mockup 6a / 6h, test `customers.test.ts:218-224`).
- **Tái hiện:** `node mut.mjs R16` → `R16 SURVIVED — DR6-02: previewHandover counts though the customer is already that RE's — 17 passed (17)` (`A\mut.log`).
- **Ảnh hưởng:** một lần sửa sau làm hộp 5c, ngay khi mở, báo "Khi lưu: 1 lịch hẹn Dự kiến chuyển sang RE mới" dù không đổi RE và lưu không chuyển gì; không test nào đỏ.
- **Đề xuất:** thêm ở `customers.test.ts` ca KH của RE A có một lịch Dự kiến đặt cho RE B → `previewHandover(c, A) === 0` (≈ 5 dòng test).

### CL2-A5 — E20 và thứ tự Thùng rác so mốc thời gian bằng so chữ: `created_at` / `deleted_at` không có phần nghìn giây (file sửa tay) cho kết quả sai

```
ID: CL2-A5
Mức: Nit
Trục: E
Vị trí: packages/db/src/customers.ts:286 (sameDayLater = latest.createdAt > recordedAfter); packages/db/src/trash.ts:177-179 (sắp theo deletedAt dạng chữ); packages/db/src/backup-validation.ts:30, :63 (z.iso.datetime() nhận mọi số chữ số thập phân) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-03 (E20) · mới do đợt sửa (PR #614) cho phần E20; thứ tự Thùng rác có từ trước
Kịch bản: K9
```

- **Mô tả:** app luôn ghi `toISOString()` (`…:00.000Z`), nên so chữ đúng thứ tự. Luật nhập lại nhận mọi dạng `z.iso.datetime()`: `…T13:00:00Z` (cùng thời điểm `…00.000Z`) đứng **sau** `…T13:00:00.500Z` khi so chữ (`'Z'` > `'.'`).
- **Tái hiện:** `node p13-timestamps.mjs`: chuyển tay N3 → N4 ngày 02/10 ghi lúc `…13:00:00.001Z`, cuộc gặp 02/10 N4 → N2, xóa lúc `…13:00:00.501Z` → app: `blocked null` (đúng E20 câu 2). File chỉ đổi `created_at` chuyển tay thành `2026-10-12T13:00:00Z` → `import accepted; blocked {"code":"TRANSITION_BEFORE_LATEST","params":{"date":"02/10/2026"}}`.
- **Ảnh hưởng:** chỉ file sửa tay / do công cụ khác ghi; cuộc gặp không khôi phục được với lý do sai, hoặc Thùng rác xếp lệch vài mili giây.
- **Đề xuất:** luật nhập nhận đúng dạng app ghi (`z.iso.datetime({ precision: 3 })`), hoặc so bằng `Date.parse`. ≈ 1–3 dòng SP + một ca test.

### CL2-A6 — Luật "cuộc gặp giữ nhóm sau giữ chuyển nhóm" (D7 mở rộng) viết ba lần

```
ID: CL2-A6
Mức: Nit
Trục: B
Vị trí: packages/db/src/customers.ts:386-408 (withdrawAppointmentTransition + keptMeetings); packages/db/src/seed.ts:409-418 (keptAfter của fillTrash); apps/desktop/src/routes/appointments/outcome-form.ts:76-90 (outcomeLock, keptBy) (4217ed4)
Tình trạng: CONFIRMED (đọc code; fuzz K2 thấy ba bản cho cùng kết quả 366 / 366 lần ở màn ↔ lệnh)
Liên quan: DR6-05 · mới do đợt sửa (PR #616); cùng loại DR6-67 (KNOWN, hoãn)
```

- **Mô tả:** cùng một luật (cuộc gặp Đã gặp không có chuyển nhóm, từ ngày của chuyển nhóm trở đi, mà "nhóm sau" không còn là nhóm của ngày nếu rút chuyển nhóm) được viết ở lệnh (SQL + `isStageOfDay`), ở seed (lọc trên `listAppointments` / `listStageTransitions`) và ở màn (6f / 6g). Chung được `isStageOfDay`; phần chọn cuộc gặp và "trừ chuyển nhóm ra" lặp lại.
- **Ảnh hưởng:** đổi luật D7 phải sửa ba chỗ; seed lệch lệnh thì sinh dữ liệu tải ném lỗi (đột biến R09: bộ test dữ liệu tải đỏ, nên lệch seed ↔ lệnh có test giữ); màn lệch lệnh thì chỉ e2e bắt. Không đo được chi phí chạy.
- **Đề xuất:** một hàm thuần `heldByKeptMeeting(transitions, appointments, move)` (vd. ở `customers.ts`, xuất qua `@p2c/db` như `isStageOfDay`) cho cả ba nơi (≈ −15 dòng); giữ hành vi: `appointments.test.ts` "the stage on the meeting day", `outcome-form.test.ts`, `seed-invariants.test.ts`, hash dữ liệu tải không đổi. Gộp khi chạm file (như DR6-67).

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` | `tsconfig.base.json:12-13` vẫn bật sẵn hai cờ → `pnpm typecheck` trong `pnpm verify` (xanh ở SHA ghim, `common\baseline.md`) là phép kiểm này | 0 biến / tham số thừa (không chạy lại) | — |
| Nơi dùng mọi export mới của đợt sửa (`git grep -l -w` trên `packages`, `apps`, `tools`, bỏ test và `CLAUDE.md`) | `restoreStageMove`, `transitionWithdrawnAt`, `reinstateTransition`, `stageOnDay`, `isStageOfDay`, `requireStage`, `previewHandover`, `requireChoice`, `cleanNote`, `CUSTOMER_STAGES`, `normalizeNote`, `normalizeText`, `isStorableText`, `quickCheck`, `checkRestoreAppointment` | Mỗi hàm có nơi dùng sản phẩm ngoài file của nó; `outcomeStage` thôi export (đúng PR #614). Export chỉ test dùng của lượt 1 (`getAppointment`, `getPolicy`…) vẫn còn — DR6-66 KNOWN, không có bằng chứng mới | — |
| Code lặp (đọc) | luật D7 mở rộng; kiểm nhóm; chuẩn hóa giá trị KYC | D7 mở rộng ×3 (lệnh, seed, màn); `requireStage` hai lần ở `createCustomer` và `normalizeKycValue` của `db` chuẩn hóa hai lần (KNOWN #640, không có bằng chứng mới) | CL2-A6 |
| `pnpm lint:deps` | `common\baseline.md` | 0 vi phạm (315 module, 1 277 phụ thuộc); `domain` không import gì | — |
| Dependency | `git diff 8855345 4217ed4 -- packages/{db,domain}/package.json` | rỗng: không thêm dependency | — |
| Cỡ dòng | `node tools/size-report.mjs` (baseline) | A: SP 7 867 (+394), test 12 807 (+960), sinh 311 (+22, 2 migration + snapshot), 98 file (+5) | — |
| Bundle | `common\baseline.md` (không dựng lại) | `assets/index.js` 909 669 B (+17 727, gzip +5 034) cho cả app; phần gói A không tách được nếu không có visualizer (G4, chỉ đề xuất) | — |

Đề xuất refactor: chỉ CL2-A6 (≈ −15 dòng, gộp khi chạm file, test giữ hành vi ghi ở phát hiện). Không có chi phí đo được.

### 6.2 Hiệu năng

Máy Home PC `DESKTOP-KDURKJP`, Node v24.20.0, hàm thuần của `@p2c/db` / `@p2c/domain` trên `common\load\load-2026-10-12-seed6.p2cbackup` (lượt 2, `importBackup`). `p10-perf.mjs` chạy 02:28 (giờ máy), CPU ≈ 13 % lúc bắt đầu, phiên Codex đang mở ở `Project-2C-review-2`; fuzz / đột biến của phiên này đã xong. Mốc so: báo cáo lượt 1 Claude A **Home PC** §4b (cùng máy, `8855345`). Luật nhiễu: xấu hơn khi quá 20 % **và** quá 10 ms. Không đo trên exe (gói B / F; exe ở `common\baseline.md`).

| Thao tác (Node) | Lần | Lượt 2 trung vị (min–max) | Lượt 1 Home PC | Δ | Ngưỡng | ID |
|---|---:|---|---|---|---|---|
| `importBackup` dữ liệu tải | 3 (+1 khởi động) | 727,8 ms (724,9–751,1) | 686,6 ms | +41 ms (+6 %) | ≤ 1 100 ms (Phase 4) ✅ | — |
| `exportBackup` | 3 | 177,3 ms | 169,3 ms | +8 ms (+5 %) | ≤ 1 000 ms (exe `backup.export`) ✅ | — |
| `db.export()` | 3 | 2,3 ms | 2,2 ms | 0 | — | — |
| `listCustomers` / `listStageTransitions` / `listAppointments` / `listPolicies` | 7 | 4,8 / 10,1 / 45,1 / 6,9 ms | 5,2 / 9,7 / 45,4 / 6,9 ms | trong nhiễu | `listAppointments` ≤ 65 ms ✅ | — |
| `countRecords` | 7 | 5,3 ms | 4,7 ms | +0,6 ms | ≤ 15 ms ✅ | — |
| `listTrash` 15 KH xóa (dữ liệu tải) | 5 | 23,4 ms (113 dòng) | 43,9 ms (117 dòng) | −47 % | màn < 200 ms ✅ | DR6-44 |
| `listTrash` 50 / 100 / 200 / 400 KH xóa | 5 | 25,5 / **31,6** / 41,7 / **59,2** ms | 114,9 / **211,2** / 412,3 / **814,8** ms | −78 … −93 % | < 200 ms ✅ (lượt 1 vượt từ 100 KH) | DR6-44 |
| `listTrash` 165 KH xóa, có / bỏ 3 chỉ mục 0009, cùng DB (`p11`) | 7 | **35,6** / 374,9 ms, cùng kết quả | — | ×10,5 | ✅ | DR6-44 |
| `countCustomerRecords` (hộp 5f, 1 KH) | 20 | 0,2 ms (`p11`: 0,07 / 2,06 ms có / bỏ chỉ mục) | 1,95 ms | −90 % | ✅ | DR6-44 |
| Lệnh: `createCustomer` / `scheduleAppointment` / `recordMeetingOutcome` (RF) / `editMeetingOutcome` (dời ngày) / `recordKycNote` | 20 | 0,5 / 0,2 / 0,6 / 0,8 / 0,4 ms | 0,62 / 0,24 / 0,45 / 0,85 / 0,35 ms | ≤ +0,15 ms | màn < 200 ms ✅ | — |
| Lệnh: `softDeleteAppointment` / `restoreAppointment` / `softDeleteCustomer` / `restoreCustomer` / `softDeletePerson` (từ chối) | 20 | 0,5 / 0,8 / 0,1 / 0,2 / 0,1 ms | 0,56 / 0,45 / 0,10 / 0,16 / 0,16 ms | `restoreAppointment` +0,35 ms (< 10 ms: nhiễu) | ✅ | — |
| Đường mới: dời cuộc gặp giữ nhóm / chuyển tay lùi ngày (bị `TRANSITION_BEFORE_MEETING`) / `previewHandover` / bàn giao 3 lịch | 20 | 0,4 / 0,2 / 0,1 / 0,3 ms (max 0,7) | — | — | ✅ | — |
| `PRAGMA quick_check` / `integrity_check` dữ liệu tải (`p06`) | 5 | 65,8 / 97,4 ms | — (Issue #595: `quick_check` ≈ 79 ms) | — | trong `app.open-data` ≤ 600 ms | — |
| Mở file DB v9 dữ liệu tải + migrate 0009 / 0010 (`p04b`) | 1 | 51 ms | — | — | — | — |
| Sinh dữ liệu tải (`seedDemoData` cỡ `LOAD_SCALE`, `p04a`) | 1 | 5 664 ms (code ghim) / 6 376 ms (bản chép `8855345`, cùng phiên) | — | — | công cụ, không có ngưỡng (K15) | — |

Không có phát hiện P: không thao tác nào xấu hơn lượt 1 cùng máy theo luật nhiễu; mọi lệnh ≤ 1 ms trung vị. Cờ `reload.*` / `app.open-data` của `baseline.md` (exe) không giải thích được bằng hàm gói A: `importBackup`, các `list*`, `countRecords` trong Node đều trong nhiễu so lượt 1 cùng máy (gói B / F xét trên exe).

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | CL2-A1* | CL2-A2 | (CL2-A1*) | (CL2-A4*) | | CL2-A4* | | | CL2-A3 | | 4 |
| Nit | | CL2-A5 | | | | | | CL2-A6 | | | 2 |

\* CL2-A1 gắn R + C, CL2-A4 gắn S + D: đếm một lần ở trục đầu. 6 / 6 CONFIRMED, 0 PLAUSIBLE. Hai chỗ chưa chạy trên màn, ghi rõ trong phát hiện: CL2-A1 phần hộp 6c (đọc `OutcomeDialog.tsx` + chạy hàm thuần `meetingDay` / `heldStage`), CL2-A2 phần "hiển thị trống" (thuộc tính Unicode `Default_Ignorable_Code_Point`). Bảng R: 12 / 12 DR6 của gói A **ĐÃ SỬA**.

## 8. Đã xét, không thấy

- **R:** 12 DR6 (01–05, 44, 49–52, 54, 59) đều ĐÃ SỬA (mục 2). 41 đột biến "gỡ phần sửa" / lượt 1: 39 KILLED, R09 làm hai bộ test dữ liệu tải đỏ, R16 sống (CL2-A3). Biến thể còn hở: CL2-A1 (DR6-04), CL2-A2 (DR6-49), CL2-A4, CL2-A5 (DR6-01 / 03). Hiệu năng DR6-44 tốt lên mà kết quả không đổi (`p11`, `cùng kết quả: true`).
- **E:** cuộc gặp **cùng** ngày tạo KH (P01b) nhận; ngày gặp trước ngày tạo → CL2-A1. Nửa đêm khi bàn giao (K5 H4) đúng luật. Chữ: 137 154 chuỗi ngẫu nhiên, `normalizeText` / `normalizeNote` ổn định (luật nhập `storedAs` không tự mâu thuẫn); NFD + U+200B trước dấu → "Bà" (R22 giữ); U+0085 (NEL, Cc, không thuộc `\s` / `\p{Cf}`) được giữ trong tên ("Sao\u0085Mai" là team khác "Sao Mai"); chưa kiểm màn vẽ ký tự này thế nào, không ghi phát hiện. Mốc thời gian → CL2-A5. Ngày / tiền / kỳ của `domain` không đổi từ lượt 1 (`git diff` rỗng ở `period.ts`, `money.ts`, `stats.ts`), không đo lại.
- **C:** đối chiếu TR-3 + E5–E20 (spec Phase 6 §4.2) và spec Phase 3 D7 / §4 / §6 luật 4 với code: khớp, trừ DR-43 (CL2-A1). Hai câu TR-3 (dòng 94 "tới nhóm đó ngay trong ngày cuộc hẹn → khôi phục" và dòng 95 "cùng ngày nhưng ghi sau lúc xóa tính như ngày sau") đọc riêng thì vênh ở ca E7, nhưng bảng E7 chốt rõ "khôi phục được, không thêm chuyển nhóm" và code làm đúng bảng (P5d) — không ghi phát hiện. Câu golden L-09 khớp app (mục 2, DR6-54). `quickCheck` (doc comment "an index out of step") bắt được chỉ mục thiếu dòng (K6).
- **D:** fuzz K2 16 000 lệnh: lệnh bị từ chối không đổi dữ liệu (0 lần), lệnh nhận luôn để lại dữ liệu luật nhập nhận (0 lần), khôi phục xong luật nhập vẫn nhận (0 lần), xuất → nhập → xuất giữ nguyên `tables`, 0 lỗi không phải `DbError`; xóa → khôi phục = như cũ (333 + 637 + 4 249 lần, K2 / K8); migration giữ mọi dòng (K4); `stageOnDay` ≡ `stageOn` (K7). Transaction của bàn giao: lệnh bị từ chối không chuyển lịch nào (fuzz + test `hands over only when the RE changes, and saves nothing when refused`). DB file cũ có Thùng rác do code cũ: 7 cuộc gặp không khôi phục được (K1, mục 2 DR6-01).
- **G:** gói A chỉ lưu kết quả AI; `ai-analyses.ts` không đổi trong đợt sửa; seed ghi `promptVersion: PROMPT_VERSIONS[mode]` (DR6-18 thuộc gói C). Không thấy gì mới.
- **S:** nhập backup: `valueOf` dùng `isStorableText` (R23 giữ), tên / ghi chú KYC kiểm bằng cùng hàm lệnh (`storedAs`), mâu thuẫn trùng giá trị (R25 / R26), CHECK `people_team_none` lúc nạp. Hở: CL2-A4 (chuyển nhóm đã rút của KH khác), CL2-A5 (dạng mốc thời gian). Không thấy SQL ghép từ dữ liệu file mới (`stageOnDay`, `keptMeetings`, `TRANSITION_BEFORE_MEETING` đều dùng tham số `?`).
- **P:** mục 6.2; không có phát hiện P.
- **B:** mục 6.1; CL2-A6.
- **T:** ngoài CL2-A3: test mới của #614 / #616 / #618 / #640 / #644 / #630 đỏ khi gỡ đúng phần sửa (mục 2); `restore-roundtrip.test.ts` là test thuộc tính lượt 1 còn thiếu, nay có và giết R01 / R04 / R04b. Không test nào giữ hành vi DR-43 (cuộc gặp giữ nhóm trước ngày tạo KH), nên hồi quy CL2-A1 lọt (đề xuất thêm ca ở phát hiện). Coverage `packages/db/src` 99,63 / 97,76 / 100 / 99,85, `domain` 100 (`baseline.md`). Test mới dùng `setup()` / đồng hồ ghim; `database.test.ts` "keeps queries working across an export" đã ghim đồng hồ (PR #640).
- **A:** gói A không có UI. Bốn mã lỗi mới (`INVALID_CHOICE`, `TRANSITION_BEFORE_MEETING`, `STAGE_KEPT_BY_MEETING`, `STAGE_NOT_ON_DAY`) có câu `error.*` ở `vi.ts` (dòng 616–620, 1162); `i18n/index.test.ts:119` kiểm đủ `DB_ERROR_CODES`; Thùng rác dùng câu `error.*` khi không có câu `trash.blocked.*` riêng (`trash-view.ts:188-190`).

## 9. Phụ lục

### 9.1 Probe, log, đột biến

Mọi file ở `C:\workspace\deep-review-1-6-r2\claude\A\`. Probe nạp TypeScript của repo qua `hooks.mjs` (chép từ `deep-review-1-6\claude\A\hooks.mjs` của chính Claude lượt 1, thêm `P2C_REPO` để chạy trên bản chép `old-8855345\` = `git archive 8855345 packages/{domain,db,ai}/src packages/db/migrations apps/desktop/src/{routes,i18n}`), không ghi gì vào repo. Probe trình duyệt: không dùng.

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `p01-before-creation.mjs` | cuộc gặp trước ngày tạo KH (cả trên `8855345`) | `p01-before-creation.log`, `.old.log` | K1, CL2-A1 |
| `fuzz2.mjs` | fuzz lệnh lượt 2 (dựa `fuzz.mjs` lượt 1 + 4 thuộc tính mới) | `fuzz2-31.log` … `fuzz2-38.log` | K2, mục 2 |
| `p02-load-restore.mjs` | xóa → khôi phục ngay mọi cuộc gặp Đã gặp trên dữ liệu tải | `p02-load-restore.log` | DR6-01, K8 |
| `p03-restore-sameday.mjs` | `p1-restore` + `p5-restore-sameday` lượt 1 (+ P5d, P5e) | `p03-restore-sameday.log`, `.old.log` | DR6-03 |
| `p04a-make-db.mjs`, `p04b-open-old.mjs` | file DB dữ liệu tải ở `8855345` → mở bằng code ghim | `p04a-make-db.{old,new}.log`, `p04b-open-old.log` (file `old-8855345-load.{db,p2cbackup}`, `new-4217ed4-load.*`) | K4, DR6-44, DR6-52 |
| `p05-text.mjs` | ổn định của hai hàm chữ, ký tự vô hình không thuộc Cf, cổng KYC | `p05-text.log` | K3, CL2-A2 |
| `p06-quickcheck.mjs` | chỉ mục lệch bảng, `quick_check` / `integrity_check` | `p06-quickcheck.log` | K6 |
| `p07-stageonday.mjs` | `stageOnDay` ↔ `stageOn` trên dữ liệu tải | `p07-stageonday.log` | K7 |
| `p08-handover.mjs` | bàn giao nhiều bước H1–H4 | `p08-handover.log` | DR6-02, K5 |
| `p09-dr605-rerun.mjs` | `p10-manual-backdate` + `p8-invariants` lượt 1 (Home PC F) | `p09-dr605-rerun.log` | DR6-05 |
| `p10-perf.mjs` | hiệu năng (perf / perf-trash / perf-cmd lượt 1 + đường mới) | `p10-perf.log` | mục 6.2, K11 |
| `p11-trash-index.mjs` | `listTrash` có / bỏ chỉ mục 0009, cùng kết quả | `p11-trash-index.log` | DR6-44 |
| `p12-rerun.mjs` | S1 / S2 / H·CL-E4, `text-probe`, S3 / S4, DR6-50 / 51 / 54 | `p12-rerun.log` | mục 2 |
| `p13-timestamps.mjs` | so mốc thời gian dạng chữ | `p13-timestamps.log` | K9, CL2-A5 |
| `p14-foreign-withdrawn.mjs` | chuyển nhóm đã rút của KH khác | `p14-foreign-withdrawn.log` | K10, CL2-A4 |
| `mut.mjs` + `mut-list.mjs` | 41 đột biến, vá / trả / kiểm sha256 | `mut.log`, `mut-results.json`, `mut-R09.out` | mục 2, CL2-A3 |

### 9.2 Đột biến (41)

Lệnh test: `pnpm exec vitest run <file…>` ở gốc repo; mỗi đột biến vá một file, trả nguyên byte trong `finally`, so sha256 với `git show HEAD:<file>` trước và sau. Chạy trong phiên, sau khi fuzz K2 xong và trước các probe K3–K11, nên không probe nào đọc repo lúc file đang vá.

- **KILLED (39):** R01, R02, R03, R04, R04b, R05, R06, R07, R08, R10, R11, R12, R13, R14, R15, R17, R17b, R18, R19, R20, R21, R22, R23, R24, R25, R26, R27, R28, R29, A-M31, A-M15, A-M10, A-N19, Q01, Q02 (số test đỏ và tên test ở `mut.log`; vd. `R02 KILLED — … — 1 failed | 27 passed (28) — E20: blocks a met appointment once the stage was moved on its day after the deletion`).
- **Bộ test đỏ khi nạp (1):** R09 — `FAIL tools/load-data-core.test.mjs > the load data of the command`, `FAIL packages/db/src/seed-invariants.test.ts > on the load data`, `DbError: STAGE_KEPT_BY_MEETING` (`mut-R09.out`): seed lệch luật D7 mới thì lệnh từ chối, bộ test đỏ — tính là bị giết.
- **SỐNG (1):** R16 → CL2-A3.
- Dòng cuối `mut.log` (cả hai lần chạy): `git status --short after: ""`.

### 9.3 Cuối phiên

`git status --short` cuối phiên (2026-10-17 02:38:50 +0700): rỗng; `git rev-parse HEAD` → `4217ed4cd3300af1d63aa61db9eb13902fe75f16`. Thư mục `A\` còn các file ghép báo cáo (`part-*.md`, `fix-report.mjs`) — không phải bằng chứng. Giờ xong: 2026-10-17 02:39 (+07, giờ máy).
