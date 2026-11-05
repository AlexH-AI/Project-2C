XONG — claude gói A lượt 5, 2026-11-04 22:33 (+07:00)

# Deep review Phase 1–6 lượt 5 — Claude — gói A (Lõi dữ liệu)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | claude (ID `CLR5`) |
| Gói | A — Lõi dữ liệu (`packages/domain/**`, `packages/db/**`) |
| SHA đầu phiên | `37a80b662861d308a110d1e2b0f65ad13b91fb51` (`git rev-parse HEAD` ở `C:\workspace\Project-2C-review`, khớp SHA ghim) |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-11-04 22:08 (+07:00), Home PC `DESKTOP-KDURKJP` |
| Công cụ | Claude Code (app desktop, tab Code), phiên mới, worktree `C:\workspace\Project-2C-review` (detached HEAD) |
| Model | Claude Opus 5.5 (`claude-opus-5-5`) |
| Mức suy luận | do Owner chọn ở app; phiên không đọc được giá trị |
| Ultracode / subagent / Workflow | tắt (tin nhắn mở phiên không bật) — không subagent, không Workflow; mọi việc làm trong phiên chính |
| Phiên làm tiếp? | không — phiên đầu của gói A |
| Node | v24.20.0 (`C:\Program Files\nodejs`, đầu PATH của shell) |

## 2. Bảng R

Cách làm chung (probe, log, nguồn ở `C:\workspace\deep-review-1-6-r5\claude\A\`):

- **Probe:** `hooks.mjs`, `mut.mjs`, `mutant-config.mjs` chép từ `deep-review-1-6-r4\claude\A\` (chỉ đổi chú thích và `LOAD` sang `-r5\common\load\…`). Probe nạp TypeScript của repo; `P2C_REPO` trỏ một cây chép (`git archive` của `packages/{domain,db,ai}/src` + `packages/db/migrations`): `old-2e51e25\` (code lượt 4), `tree-37a80b6\` (SHA ghim) và các cây đột biến chép từ nó (`tree-mut-unmoved\`, `tree-mut-pastmax\`).
- **Gỡ tạm phần sửa:** `mut.mjs mut-r1.mjs` — vitest chạy trên worktree ghim, hook `load` của Vite phục vụ bản đột biến của đúng một file (repo không đổi byte nào). Chỉ tính **bị giết** khi có `[mutant] served` và có test đỏ. 12 đột biến: 9 bị giết, 2 sống không tương đương, 1 sống tương đương (`mut-r1.stdout.txt`, `mut-mut-r1.log`, `mut-src\<id>.out.txt`).

### 2.1 Bảng R1 (4 dòng của gói A)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-135 | #896 → #907 | **ĐÃ SỬA** | Tái hiện lượt 4 (`r1\same-day-kept.mjs` = `r2\same-day-kept.mjs` lượt 4, chỉ đổi đường dẫn `hooks.mjs`): code ghim → xóa A / sửa A thành Hủy / sửa A thành N1 đều `refused STAGE_KEPT_BY_MEETING {"date":"05/10/2026"}`, KH N2, xuất → nhập nhận. Cây `tree-mut-unmoved\` (`date >= ?` → `date > ?`, `customers.ts:445`): cả ba `OK`, KH N3 / N3 / N1, `importBackup(exportBackup) từ chối BACKUP_INVALID {"rule":4}` (log `r1\same-day-kept.{37a80b6,mutant}.log`). Gỡ sửa `R135-unmoved-day-after` (cả `packages/domain` + `packages/db`, 1 477 test): **bị giết**, 1 đỏ — đúng ca mới "H·CL-F3: keeps the move of a meeting while a meeting of the same day kept the stage (D7)" (`appointments.test.ts:1027`) | Biến thể (mục 4, K1–K6): xóa B rồi A và khôi phục ngược thứ tự, dời ngày ở 6f, sửa giờ / ghi chú ở 6f, cuộc gặp giữ nhóm ghi **trước** A cùng ngày, nhập backup giữa chuỗi, xóa / khôi phục KH: đều đúng luật D7 / `STAGE_NOT_ON_DAY`, dữ liệu sau mỗi bước nhập lại được |
| DR6-136 | #896 → #907 | **ĐÃ SỬA** (đường chậm đã hết; gỡ phần sửa không test nào đỏ → **CLR5-A2**) | `perf\byname-r5.mjs` (Node v24.20.0, dữ liệu tải, trung vị 41 lần, collator trần / `2e51e25` / ghim xen kẽ): sắp 10 255 lịch hẹn sống theo KH rồi giờ **9,67 / 71,87 / 11,19 ms (1,16× trần)**; theo RE 6,55 / 64,85 / 7,89; 1 481 tên KH 1,00 / 7,31 / 1,18 (Issue: ≤ ~2× trần ✅). Thứ tự: mới = `2e51e25` trên 1 481 KH, 51 nhân sự, 4 team, 4 443 tên có số ASCII / toàn khổ / Ả Rập, 19 253 và 39 987 tên (quá trần 20 000), lịch hẹn theo KH / RE / ghi chú, 5 lần xáo mỗi bộ: **0 khác**; mới = collator trần trên mọi bộ toàn tên LATIN: 0 khác. Gỡ sửa: `R136-old-file` (cả file về `2e51e25`) **sống** cả 1 477 test (sửa hiệu năng, không có ca thời gian); `R136-cache-swapped` (`keys.set(key, name)`) **bị giết** 2 đỏ (ca 2 022 tên và ca 20 002 tên); `R136-past-max-raw` (quá trần trả tên trần) **sống**, không tương đương (`r1\byname-past-max.mjs`: sau 20 000 tên khác, 2 022 tên trộn chữ số ra 20 thứ tự / 20 lần xáo, code ghim 1); `R136-past-max-nocache` (quá trần không nhớ thêm) sống, tương đương (khóa vẫn đúng, chỉ không nhớ) | Lần sắp đầu khi bộ nhớ khóa có sẵn 19 999 tên khác (trần xóa giữa lần sắp): 10,74 ms. 39 987 tên (quá trần): 79,19 ms (1,62× trần; `2e51e25` 352,46). Bộ nhớ khóa giữ chuỗi qua lần thay dữ liệu: trên dữ liệu tải tối đa 1 342 chuỗi / 17 674 ký tự (mục 6.1), không có chi phí đo được |
| DR6-137 | #896 → #907 (+ #933 → #946) | **ĐÃ SỬA** | Tái hiện (CXR4-A1 của lượt 4; Claude lượt 4 không có probe riêng) `r1\label-repro.mjs`: `recordAiAnalysis` OPENCODE_GO với model `'x'×99 + '\uD800'`, `'\uDC00glm-5.3'`, `'\u{FEFF}alpha'` → code ghim `AI_ANALYSIS_INVALID` cả ba; `'g'×98 + '😀'` (100 đơn vị) nhận, đọc lại 100, xuất → nhập nhận. `old-2e51e25\`: cả ba nhận, đọc lại 102 / 10 / 5 đơn vị, ca biên 100 xuất → nhập `BACKUP_INVALID {"rule":12}` (log `r1\label-repro.log`). Gỡ sửa `R137-isLabel-old` (về "không rỗng, không NUL"): **bị giết**, 2 đỏ (`ai-analyses.test.ts` "refuses an analysis whose provider, attempts or outcome do not fit together", "reads a model name at the import (rule 12) as the command does"); `R137-readback-no-bom` 9 đỏ; `R137-readback-no-storable` 9 đỏ | `r2\readback-truth.mjs`: `readsBackAsIs` ⇔ "sql.js đọc lại y như lưu" trên 200 020 chuỗi (NUL, nửa surrogate, cặp đúng / ngược, U+FEFF đầu / giữa / cuối / hai lần, U+FFFE, U+FFFF, U+FFFD, U+0085, U+2028, U+200B, chuỗi ≤ 16 byte và tới 3 016 ký tự): luật nhận mà đọc lại khác **0**, luật từ chối mà đọc lại y nguyên **0**. Biến thể còn hở khác hướng: nhãn chỉ có ký tự vô hình qua `isLabel` và luật 12 → **CLR5-A3** (Nit) |
| DR6-151 (phần A: mã KH của `TrashRow`) | #903 → #924 (+ #933 → #946) | **ĐÃ SỬA** (phần gói A; tên nút ở màn: gói E) | `r1\trash-code.mjs`: dữ liệu tải (113 dòng, 15 KH) và Thùng rác lớn (`deep-review-1-6-r4\claude\A\r2\kept-big.p2cbackup`: dữ liệu tải + 1 200 KH xóa, 1 313 dòng, 1 215 KH): `code` của mọi dòng KH = mã của KH đó (sai 0), 1 215 / 1 215 mã khác nhau; 21 nhóm tên + nhóm trùng (42 KH) → 42 KH có mã trong tên nút, tên nút trùng 0 (vd. "Khôi phục KH Đặng Minh An (K-SNNA) · Tạm hoãn" / "(K-AA5G)"). Gỡ sửa `R151-code-is-name` (`code: row.name`): **bị giết**, 1 đỏ (`trash.test.ts` "E1: restores a customer with every record not deleted on its own") | Biến thể gần: lịch hẹn / HĐ của **hai KH cùng tên (khác mã)** trong Thùng rác vẫn cùng tên nút khôi phục (dựng qua `openAppData`, `r1\trash-label-appdata.mjs`) → **CLR5-A1** (Nit). Mô tả DR6-151 (KH cùng tên cùng nhóm; nhân sự cùng tên) và Q3 (a) đã làm đủ |

### 2.2 Bảng R2 (2 Issue của gói A)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-332 (phần A: `readsBackAsIs`, mục 5) | #933 → #946 | **ĐÃ SỬA** | Mục tiêu: `isLabel` và `valueOf` (`backup.ts:197`) cùng gọi `readsBackAsIs` (`common.ts:96-98`), nhận / từ chối như trước. `r2\readback-truth.mjs`: `isLabel` mới ↔ bản #907 (điều kiện viết tại chỗ) **0 khác**, điều kiện chữ của `valueOf` mới ↔ bản #907 **0 khác** trên 200 020 chuỗi. Test chấp nhận "chữ bắt đầu bằng U+FEFF vẫn bị từ chối ở cả hai": gỡ phần chung `R137-readback-no-bom` **bị giết** 9 đỏ (gồm `common.test.ts` "refuses a NUL, a lone surrogate half and a U+FEFF that starts the text", `backup.test.ts` "refuses teams.name / kyc_notes.text / appointments.date that starts with it", `ai-analyses.test.ts` rule 12); `valueOf` bỏ luật chung `T332-valueOf-any-text` **bị giết** 12 đỏ; `valueOf` chỉ chặn NUL `T332-valueOf-storable-only` **bị giết** 9 đỏ | Ghi chú sổ gom (review #907, "điều kiện chép hai nơi"): `git grep -n "u{FEFF}" -- packages/db/src ':!*.test.ts'` → chỉ `common.ts:97` (luật chung) và `ai-analyses.ts:202` (`storedRawOutput` bỏ U+FEFF đầu của output bị từ chối trước khi lưu — việc khác, có chủ ý). Đường nhập đầy đủ: file của exe lượt 4 / Phase 5 / lượt 3 nhận (mục 4, K18). Phần `listeners.ts` (gói B), ô Giờ (gói E), khóa i18n (gói D), `ai-jobs.ts` (gói C): không xét ở đây |
| T-350 (phần A: `appointmentGroup` chỉ nhận `status`, `date` của lịch qua `Pick`) | #1001 → #1011 | **ĐÃ SỬA** (phần gói A) | `appointment-counts.ts:18-32`: chỉ nới kiểu, thân hàm như cũ; `tsc --noEmit` của `domain` / `db` sạch. Dữ liệu tải, hôm nay 12/10/2026 (`r2\t350-groups.mjs`): 10 255 lịch sống, `statusLabel` lệch `appointmentGroup` 0; Thùng rác: Dự kiến 01/10 10:00, 11/10 09:00, 11/10 không giờ → "… · Chưa ghi kết quả" ở "Bản ghi" và hộp khôi phục; 12/10 (hôm nay), 13/10 → "Dự kiến". Đột biến `T350-group-today-unrecorded` (`< 0` → `<= 0`): **bị giết**, 12 đỏ (`appointment-counts.test.ts`, golden lịch hẹn A02 / A03 / A05…, `trash-view.test.ts`) | Cùng hàm ở mọi chỗ dùng: `appointmentCounts` ↔ `appointmentCountsByScope` ↔ `appointmentCountsByMark` ↔ 12 lần `appointmentCounts` theo tháng, 49 góc nhìn × 4 "hôm nay" (12/10, 04/11, 31/12/2026, 15/06/2027; Chưa ghi kết quả 0 / 589 / 635 / 635): 588 phép so, **0 lệch** (`r2\counts-agree.mjs`). Thùng rác của dữ liệu tải: 76 lịch, 0 Dự kiến đã qua. Phần màn (nhãn, hộp khôi phục trên bản build): gói E |

## 3. Phạm vi đã đọc

**Diff sửa của gói A** (`git diff 2e51e25..37a80b6 -- packages/domain packages/db`: 12 file, +164 / −44 kể cả test và khối codemap; 4 commit #907, #924, #946, #1011), đọc từng hunk: `domain/src/name-order.ts` (+ test), `domain/src/appointment-counts.ts`, `db/src/common.ts`, `db/src/backup.ts`, `db/src/trash.ts`, các hunk test `appointments.test.ts`, `ai-analyses.test.ts`, `backup-invariants.test.ts`, `common.test.ts`, `trash.test.ts`, `packages/db/CLAUDE.md`.

**Đọc lại ở `37a80b6` (chỗ đợt sửa chạm và luật nó dựa vào):** `name-order.ts` (đủ), `appointment-counts.ts` (đủ), `settings.ts` (đủ), `common.ts:85-106`, `backup.ts:186-199`, `trash.ts:25-60`, `:78-135`, `customers.ts:290-330` (`checkTransition`), `:380-470` (`withdrawAppointmentTransition`, `meetingKeepingMove`, `unmovedMeetingsFrom`), `appointments.ts:201-330`, `:357-375` (`editMeetingOutcome`, `rescheduleAppointment`, `softDelete` / `restoreAppointment`, `checkRestoreAppointment`, `restoreStageMove`, `keepsTransition`), `ai-analyses.ts:1-40`, `:130-260` (`toRow`, `storedRawOutput`, `analysisLabelsFit`), `name-order.test.ts:40-101`, `ai-analyses.test.ts:20-135`, `:370-400`. Các file khác của gói A (≈ 8 700 dòng SP) đã đọc trọn ở lượt 1–4 và không đổi sau `2e51e25`; lượt này không đọc lại từng dòng mà chạy kịch bản qua chúng (mục 4).

**Chỗ gói khác nối vào (chỉ đọc chỗ nối):** `packages/ui/src/components/compare-cells.ts` (mọi cột chữ của `DataTable` đi qua `byName`); cột chữ của `AppointmentsScreen.tsx:160-210`, `CustomerAppointments.tsx:105-160`; `trash-view.ts:84-110`, `:204-242` (`recordTitle`, `codedCustomers`, `restoreLabel`, `ofCustomer`), `SettingsTrash.tsx:130-140`, `:290-305`; `appointments-view.ts:105-112` (`statusLabel`); `ai-panel-view.ts:545-564` (`analysisSource`, `modelLabel`); `app-data.ts:86-194` (`AppData`, `openAppData`).

**Tài liệu:** `CLAUDE.md` gốc, `packages/{db,domain}/CLAUDE.md`, `.claude/rules/tests.md`; spec Phase 3 `phase-3-du-lieu.md:22` (D7), `:181`, `:183`, `:188`, `:225-229` (luật nhập 4); `common\{prompt-claude.md, known.md (phần 1–5), fixes.md (T-319, T-326, T-332, T-350), baseline.md (đủ), plan.md §L5.2–§L5.8}`; tổng hợp lượt 4 §4–§7; báo cáo gốc Claude A lượt 4 (đủ); `docs/reviews/raw/2026-10-31/{claude,deepseek}/E.md` (dòng DR6-119 / DR6-151, để không báo trùng).

## 4. Kịch bản mới đã thử

Probe ở `C:\workspace\deep-review-1-6-r5\claude\A\`, cwd = repo, code ở `37a80b6` trừ khi ghi khác; không chạy `pnpm`, không gọi dịch vụ AI, không mở trình duyệt, không chạy e2e.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| K1 | D7 cùng ngày, nhiều bước (`r2\d7-chains.mjs` (a)): A 05/10 N3 → N2, B cùng ngày ghi sau giữ N2; xóa B rồi xóa A; khôi phục B trước A; rồi A; rồi B; xóa A lần nữa | Xóa được cả hai (B trước); Thùng rác ghi dòng B `STAGE_NOT_ON_DAY`; khôi phục B trước → `STAGE_NOT_ON_DAY {05/10/2026}`; A rồi B → OK, KH N2, nhập nhận; xóa A lần nữa → `STAGE_KEPT_BY_MEETING` | — |
| K2 | D7, dời ngày ở 6f ((b)): B 06/10 giữ N2; dời A 05/10 → 06/10 (đúng ngày B) và → 07/10 | Cả hai `STAGE_KEPT_BY_MEETING {06/10/2026}`, dữ liệu không đổi. Dời sang đúng ngày B cũng chặn: đúng chữ D7 (ô ngày khóa khi bị chặn) | — |
| K3 | D7, 6f chỉ sửa giờ / ghi chú / bước tiếp của A khi B cùng ngày giữ N2 ((c)) | OK, không rút transition (`keepsTransition` + cùng ngày) | — |
| K4 | D7, cuộc gặp C giữ N3 ghi **trước** A (N3 → N2) cùng ngày ((d)) | Xóa A được (N3 là nhóm của ngày khi không có A), KH N3; khôi phục A được, KH N2; nhập nhận mỗi bước | — |
| K5 | D7, nhập backup giữa chuỗi ((e)): B, A trong Thùng rác → xuất → nhập → khôi phục trên DB nhập | DB nhập giữ dòng chặn; B trước bị chặn, A rồi B được | — |
| K6 | D7, xóa / khôi phục KH khi B cùng ngày giữ N2 ((f)) | Xóa A vẫn `STAGE_KEPT_BY_MEETING` | — |
| K7 | `readsBackAsIs` ⇔ sự thật trên sql.js (`r2\readback-truth.mjs`): 200 020 chuỗi ghi vào bảng tạm rồi đọc lại | Luật ≠ sự thật: 0 / 0 (chi tiết dòng DR6-137) | — |
| K8 | `isLabel`, điều kiện chữ của `valueOf` mới ↔ bản #907 (cùng 200 020 chuỗi) | 0 khác | — |
| K9 | Nhãn model chỉ có ký tự vô hình (`r2\label-blank.mjs`, `r2\label-blank-import.mjs`): U+200B / U+2060 / U+0085 / U+3164 / U+180E qua `isLabel`, luật 12, `importBackup`, lịch sử phân tích | Nhận ở cả ba; NBSP / U+3000 / dấu cách bị chặn (JS `trim`); lịch sử hiện model rỗng | **CLR5-A3** |
| K10 | Thùng rác: lịch hẹn / HĐ của hai KH cùng tên khác mã, cùng ngày giờ / cùng FYP (`r1\trash-label-variants.mjs`; qua `openAppData` ở `r1\trash-label-appdata.mjs`) | Hai cặp tên nút trùng (2 / 4) | **CLR5-A1** |
| K11 | Mã KH của `TrashRow` trên dữ liệu tải và Thùng rác lớn 1 313 dòng (`r1\trash-code.mjs`) | Mã đúng 1 215 / 1 215; tên nút KH trùng 0 | — |
| K12 | `byName` sau khi bộ nhớ khóa đầy 20 000 tên khác, rồi sắp 2 022 tên trộn chữ số (`r1\byname-past-max.mjs`), code ghim ↔ đột biến "quá trần trả tên trần" | Ghim 1 thứ tự; đột biến 20 thứ tự / 20 lần xáo, mà không test nào đỏ | **CLR5-A2** |
| K13 | `byName` mới ↔ `2e51e25` ↔ collator trần: tên thật, tên có chữ số toàn khổ / Ả Rập, ≥ 20 000 tên, lịch hẹn theo KH / RE / ghi chú (`perf\byname-r5.mjs`) | 0 khác | — |
| K14 | `byName` thời gian, kể cả 39 987 tên (quá trần) và lần sắp đầu khi bộ nhớ khóa có 19 999 tên khác | ≤ 1,62× collator trần; bảng Lịch hẹn 1,16× (mục 6.2) | — |
| K15 | Bộ nhớ khóa giữ chuỗi qua lần thay dữ liệu (`perf\byname-heap.mjs`, `--expose-gc`): sắp 4 cột chữ của 10 255 lịch hẹn rồi bỏ dữ liệu | Tối đa 1 342 chuỗi / 17 674 ký tự (≈ 35 KB UTF-16); số heap đo được nhiễu (mục 6.1) — không có chi phí đo được | — |
| K16 | T-350: lịch Dự kiến xóa ở biên hôm qua / hôm nay / ngày mai, có / không giờ, đọc "Bản ghi" và hộp khôi phục (`r2\t350-groups.mjs`) | Đúng nghĩa thường ở cả hai chỗ | — |
| K17 | `appointmentCounts` ↔ `ByScope` ↔ `ByMark` ↔ theo tháng, 49 góc nhìn × 4 "hôm nay" làm Dự kiến thành Chưa ghi kết quả (`r2\counts-agree.mjs`) | 588 phép so, 0 lệch | — |
| K18 | File do code `2e51e25` (exe lượt 4) xuất, dựng bằng `gen\gen.mjs` trên `old-2e51e25\`: dữ liệu tải có Thùng rác (`tables` `ad82051b…` = mốc lượt 4) và demo có Thùng rác (`d983aa91…`); thêm file dữ liệu tải thật của lượt 4, `r3-load` (schema 12), `p5-demo` (schema 9) của lượt 4 → nhập bằng code ghim (`gen\import.mjs`) | Cả năm **nhận** (669–972 ms), Thùng rác 113 / 73 / 113 / 113 / 0 dòng. Exe ứng viên L3 `3d237b0`: code trùng SHA ghim (`baseline.md`), nên file của nó là file của chính code ghim | — |

## 5. Phát hiện mới

Ba phát hiện, cả ba CONFIRMED; 0 Critical / High / Medium. Không có KNOWN nào có bằng chứng mới.

### CLR5-A1 — Thùng rác: lịch hẹn / HĐ của hai KH cùng tên có cùng tên nút khôi phục

```
ID: CLR5-A1
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/trash-view.ts:220-242 (restoreLabel; ofCustomer ghép "của KH <tên>" chỉ từ TrashRef.name); packages/db/src/trash.ts:29-39 (TrashRef / TrashOwner: tham chiếu KH của dòng lịch hẹn / HĐ chỉ có id, name, deleted), :151, :175 (owner.customer = ref.customer(…)) (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-151 (#903 → #924), DR6-119 · có từ trước, lượt 1–4 bỏ sót (DR6-151 chỉ xét dòng KH và nhân sự; DR6-119 chỉ xét HĐ của cùng một KH)
Kịch bản: K10
```

- **Mô tả:** Q3 (a) và PR #924 tách tên nút của hai KH cùng tên cùng nhóm bằng mã KH, và của hai nhân sự cùng tên bằng vai trò / team. Dòng lịch hẹn và HĐ thì ghép "… của KH <tên>" chỉ bằng tên KH, nên hai KH cùng tên (mã khác nhau) có lịch cùng ngày giờ, cùng trạng thái, hay HĐ cùng ngày nộp, cùng FYP, cùng trạng thái trong Thùng rác thì hai nút có cùng tên cho trình đọc màn hình. Ô "Bản ghi" của hai dòng cũng giống nhau; chỉ cột "Thuộc" khác (RE).
- **Tái hiện / bằng chứng:** `node r1\trash-label-appdata.mjs` (qua `openAppData` bản web, seed demo neo 12/10/2026; lệnh bằng `app.run`; đọc như `SettingsTrash`: `listTrash(app.db())`, `codedCustomers`, `aria-label = restoreLabel(row, coded, today)`; log `r1\trash-label-appdata.log`): hai KH "Trần Thu Hà" N3 (K-GBYX, RE Hồ Ngọc Yến; K-5R8A, RE Trần Văn Tuấn), mỗi KH một lịch 20/10/2026 09:00 và một HĐ nộp 05/10 FYP 12 000 000, xóa cả bốn → aria-label hai lịch đều "Khôi phục lịch hẹn 20/10/2026 09:00 · Dự kiến của KH Trần Thu Hà", hai HĐ đều "Khôi phục HĐ Nộp 05/10/2026 · 12.000.000 ₫ · Đã nộp của KH Trần Thu Hà"; "Thuộc": `KH Trần Thu Hà · RE Hồ Ngọc Yến` ↔ `… · RE Trần Văn Tuấn`; "tên nút trùng 2" / 4 dòng. Cùng kết quả bằng lệnh `db` + `trash-view` (`r1\trash-label-variants.mjs`). Trên Thùng rác lớn 1 313 dòng của lượt 4 không có cặp như vậy (K11: trùng 0).
- **Ảnh hưởng:** người dùng trình đọc màn hình ở Thùng rác khi hai KH cùng tên (họ tên Việt hay trùng) cùng có lịch / HĐ đã xóa trùng ngày (giờ) và trạng thái / FYP; Tab qua hai nút nghe cùng một câu. Không sai dữ liệu.
- **Đề xuất:** theo cách Q3 (a) cho KH: khi tên + nhóm KH của dòng lịch / HĐ trùng một KH khác có dòng trong Thùng rác (hay khi "Bản ghi" + tên KH trùng một dòng khác), ghép mã KH vào vế "của KH <tên> (<mã>)" bằng khóa `customer.withCode`; `TrashRef` của KH (`trash.ts`) thêm `code`. Cần Owner chọn điều kiện thêm mã (mở rộng Q3). ≈ 10–15 dòng SP + 2 ca unit; `risk:low`.

### CLR5-A2 — DR6-136: không test nào giữ phần sửa của `byName` (gỡ bộ nhớ khóa vẫn xanh; ca 20 002 tên không kiểm khóa sau khi xóa)

```
ID: CLR5-A2
Mức: Low
Trục: T
Vị trí: packages/domain/src/name-order.ts:50-61 (keys, MAX_KEYS, keyOf); packages/domain/src/name-order.test.ts:93-101 (ca "sorts more names than it keeps the keys of in the same order") (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-136 (#896 → PR #907), DR6-112 · mới do đợt sửa sau lượt 4 (PR #907)
Kịch bản: K12
```

- **Mô tả:** (a) Phần sửa của DR6-136 là sửa hiệu năng, nhưng không có ca thời gian nào (khác ca thời gian của Mock trích xuất, T-339) và probe `e2e/perf` không có bước sắp bảng Lịch hẹn theo cột tên (lượt 4 đã ghi; `customers.sort-name` 1 481 tên chỉ chênh ≈ 6 ms, dưới luật nhiễu). Đổi `name-order.ts` về bản `2e51e25` (đúng lỗi DR6-136: bảng Lịch hẹn ×6,4 chậm hơn) thì cả 1 477 test `domain` + `db` xanh. (b) Ca 20 002 tên mà thân PR #907 nêu để giữ nhánh `keys.clear()` chỉ phủ dòng (coverage 100 %), không kiểm khóa sau trần: tên của ca là `KH n` / `KH <số Ả Rập n>`, mà collator `numeric` đã đọc chữ số Ả Rập theo giá trị, nên tên trần và tên đổi chữ số cho cùng thứ tự. Đột biến "quá trần thì trả tên trần" (`if (keys.size >= MAX_KEYS) return name;`) sống, dù nó đưa lại đúng lỗi DR6-112 (thứ tự đi vòng với tên trộn chữ số) cho mọi tên mới sau 20 000 tên đầu của phiên.
- **Tái hiện / bằng chứng:**
  - `node mut.mjs mut-r1.mjs` (`mut-r1.stdout.txt`): `R136-old-file	SURVIVED	served=1	1477 passed (1477)`; `R136-past-max-raw	SURVIVED	served=1	9 passed (9)`; đối chiếu `R136-cache-swapped	KILLED … 2 failed` (ca 2 022 tên và ca 20 002 tên).
  - `r1\byname-past-max.mjs` (log `r1\byname-past-max.log`): lấp bộ nhớ khóa bằng 20 000 tên `x<i>` rồi sắp 2 022 tên của ca DR6-112, 20 lần xáo: code ghim "1 thứ tự"; `P2C_REPO=tree-mut-pastmax\` "**20 thứ tự**".
  - Số đo của (a): `perf\byname-r5.mjs` — 10 255 lịch hẹn theo KH: `2e51e25` 71,87 ms, ghim 11,19 ms.
- **Ảnh hưởng:** chỉ khi `name-order.ts` bị sửa lệch về sau (tối ưu tiếp, đổi cách xóa bộ nhớ): CI xanh trong khi bảng Lịch hẹn chậm lại ×6 (DR6-136) hay thứ tự tên trộn chữ số đi vòng sau 20 000 tên (DR6-112). Code hiện tại đúng.
- **Đề xuất:** (b) ca test lấp bộ nhớ khóa quá trần bằng tên khác rồi sắp 2 022 tên của ca DR6-112, đòi một thứ tự (giết `R136-past-max-raw`); (a) một ca thời gian bền với runner chậm như T-339 (vd. sắp 10 000 tên lặp ≤ 3× collator trần), hoặc bước `appointments.sort-customer` trong `e2e/perf`. ≈ 0 dòng SP + 20–30 dòng test; `risk:low`.

### CLR5-A3 — `isLabel` hỏi "trống" bằng `String.prototype.trim`: nhãn model chỉ có ký tự vô hình được lưu và nhập

```
ID: CLR5-A3
Mức: Nit
Trục: C
Vị trí: packages/db/src/common.ts:104-106 (isLabel: text.trim() !== ''), dùng ở packages/db/src/ai-analyses.ts:156 (lệnh) và :242 (luật nhập 12); hiển thị apps/desktop/src/routes/customers/ai-panel-view.ts:554-564 (analysisSource → modelLabel trả nguyên chữ) (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-137 (#896 → #907, + T-332 #946), họ DR6-150 / ô Giờ của T-332 (hỏi "trống" bằng normalizeText) · có từ trước, lượt 1–4 bỏ sót
Kịch bản: K9
```

- **Mô tả:** mọi chỗ khác của app hỏi "trống" bằng `normalizeText` (K20, K25; DR6-150, `parseTime` của T-332). `isLabel` dùng `trim()` của JS, mà `trim()` không bỏ U+200B, U+2060, U+0085, U+3164, U+180E. Nhãn model chỉ gồm các ký tự đó qua lệnh `recordAiAnalysis`, qua luật nhập 12 và được nhập; lịch sử phân tích hiện ô model rỗng. NBSP, U+3000, dấu cách thì bị chặn (JS `trim` bỏ chúng), nên hai loại khoảng trắng vô hình xử khác nhau.
- **Tái hiện / bằng chứng:** `node r2\label-blank.mjs` (log): `"\u200b" normalizeText="" · isLabel=true · luật 12=true · lịch sử hiện {"model":"\u200b"}`, như vậy với U+2060 / U+0085 / U+3164 / U+180E; `" "` (NBSP) `isLabel=false · luật 12=false`. `node r2\label-blank-import.mjs` (dữ liệu tải, một dòng `ai_analyses` ACCEPTED đổi sang OPENCODE_GO, `reasoning` DEFAULT, token 1 200 / 300): model `glm-5.3` nhận; **U+200B nhận, đọc lại dài 1; U+3164 nhận, dài 1**; NBSP → `BACKUP_INVALID {"rule":12}`.
- **Ảnh hưởng:** chỉ với file backup sửa tay (model của app chọn trong danh sách đóng `AI_MODELS`); hậu quả chỉ là ô model trống ở "Lịch sử phân tích". Không sai dữ liệu khác, file vẫn nhập lại được.
- **Đề xuất:** `isLabel` hỏi "trống" bằng `normalizeText(text) !== ''` như phần còn lại của app (lệnh và luật 12 cùng đổi vì cùng gọi `isLabel`); ca unit cho U+200B / U+3164. Dữ liệu giả lập nạp lại (K1). ≈ 1 dòng SP + 5 dòng test; `risk:low` (đụng luật nhập 12 → có thể `risk:med` theo thói quen của #907).

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đo | Trên | Kết quả | ID |
|---|---|---|---|
| `node node_modules/typescript/bin/tsc -p packages/{domain,db}/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` | src + test của hai package | exit 0 cả hai | — |
| Export mới của đợt sửa ↔ nơi dùng | `readsBackAsIs` (`common.ts`), `TrashRow.code`, kiểu `Pick` của `appointmentGroup` | `readsBackAsIs`: `common.ts` + `backup.ts`; `code`: `trash-view.ts` (`restoreLabel` qua `customer.withCode`); không export thừa mới. `LATIN` vẫn export chỉ cho test (đã ghi ở lượt 4) | — |
| Code lặp (đọc diff) | điều kiện "đọc lại đúng như lưu" | Còn một nơi (`git grep -n "u{FEFF}" -- packages/db/src ':!*.test.ts'` → `common.ts:97` và `storedRawOutput` của `ai-analyses.ts:202`, việc khác); bộ lọc SQL `unmovedMeetingsFrom` ↔ luật JS `meetingKeepingMove` vẫn hai nơi có chủ ý (PR #805), nay có test cả hai (DR6-135) | — |
| Bộ nhớ khóa của `byName` (`perf\byname-heap.mjs`, `node --expose-gc`) | dữ liệu tải: sắp cột KH / RE / ghi chú / trigger của 10 255 lịch hẹn, rồi bỏ dữ liệu | Bộ nhớ giữ tối đa 1 342 chuỗi / 17 674 ký tự (≈ 35 KB UTF-16; trần 20 000 chuỗi). Heap đo được 18,61 → 16,78 MB sau khi lấp bộ nhớ bằng tên ngắn: chênh do GC các đối tượng khác, không tách được phần của bộ nhớ khóa → không có chi phí đo được | — |
| Dependency | `git diff 2e51e25 37a80b6 -- packages/{db,domain}/package.json pnpm-lock.yaml` | rỗng | — |
| Cỡ gói A (`baseline.md`) | `2e51e25` → `37a80b6` | SP 8 748 (+29), test 15 805 (+91), sinh 341 (0), 104 file (0); diff sửa SP +53 / −24 (5 file), test +110 / −19 (6 file) | — |
| `pnpm lint:deps`, coverage (`baseline.md`, cổng ở SHA ghim) | — | 0 vi phạm (354 module); `packages/db/src` 99,6 / 97,74 / 100 / 99,8 % như lượt 4; `packages/domain/src` 100 % | — |

Không đề xuất refactor bloat.

### 6.2 Hiệu năng

**Máy và điều kiện.** Home PC `DESKTOP-KDURKJP`, Node v24.20.0, hàm của `@p2c/db` / `@p2c/domain`. Chạy song song: phiên Codex gói A (worktree `-review-2`; tiến trình `codex*`), app desktop Claude; không e2e, không build, không exe. CPU máy 2 s trước mỗi lần chạy 2,5–11,6 %. Luật nhiễu: xấu hơn khi > 20 % **và** > 10 ms.

`perf\run5.mjs` chạy `perf\p-r5.mjs` (= `p-r4.mjs` của lượt 4, chỉ đổi đường dẫn) 3 vòng, mỗi vòng xen kẽ: code `2e51e25` (`old-2e51e25\`) trên file dữ liệu tải lượt 4 (`-r4\common\load\…`, `tables` `ad82051b…`), code ghim trên cùng file, code ghim trên file dữ liệu tải lượt 5; mỗi phép đo trung vị của n lần sau một lần khởi động, bảng lấy trung vị 3 vòng (`perf\runs.jsonl`, `perf\run5.out.txt`; 22:24–22:27).

| Đo (Node, dữ liệu tải) | `2e51e25` | `37a80b6` (cùng file) | Δ | `37a80b6` (file lượt 5) | Lượt 4 (Claude A, 29/10) | Ngưỡng / kết luận |
|---|---:|---:|---|---:|---:|---|
| `importBackup` | 862,4 ms | 909,6 | +47,2 ms (+5 %) | 892,1 | 834,1 | ≤ 1 100 ms ✅; dưới luật nhiễu |
| — `validateBackupValues` | 208,9 | 214,6 | +5,7 (+3 %) | 207,1 | 203,0 | ✅ |
| — `validateBackupInvariants` | 189,0 | 203,2 | +14,2 (+8 %) | 197,1 | 177,9 | ✅ dưới luật nhiễu |
| `exportBackup` | 183,1 | 196,2 | +13,2 (+7 %) | 185,9 | 177,3 | exe ≤ 1 000 ✅ |
| `countRecords` / `listCustomers` / `listStageTransitions` / `listAppointments` | 4,98 / 5,86 / 10,32 / 45,65 | 4,94 / 5,83 / 11,15 / 46,00 | ≤ +0,83 ms | 4,95 / 5,44 / 11,31 / 44,77 | 4,77 / 5,10 / 9,80 / 44,48 | ✅ |
| `listTrash` 113 dòng / `previewPurge` | 24,34 / 0,73 | 24,74 / 0,77 | +0,4 / +0,04 | 23,40 / 0,83 | 23,4 / 0,76 | ✅ (`code` mới của dòng KH: không đổi số) |
| `listTrash` / `previewPurge` / `personUsage`, Thùng rác + 1 200 KH | 144,3 / 6,05 / 3,77 | 157,4 / 6,27 / 3,82 | +13,1 (+9 %) / +4 % / +1 % | 150,0 / 5,90 / 3,67 | 143,5 / 5,7 / 3,53 | màn < 200 ✅; dưới luật nhiễu |
| `purgeTrash` cả `VACUUM`: dữ liệu tải / + 1 200 KH | 100,4 / 132,3 | 97,1 / 137,4 | −3,3 / +5,1 | 88,6 / 126,1 | 85,7 / 119,4 | ≤ 500 ✅ |
| `normalizeText` + `normalizeNote` | 8,86 | 8,75 | −0,1 | 8,68 | 8,42 | ✅ |
| Lệnh `scheduleAppointment` / `recordMeetingOutcome` / `softDelete…` / `restore…` | 0,21 / 0,26 / 0,15 / 0,17 | 0,26 / 0,28 / 0,15 / 0,17 | ≤ +0,05 ms | 0,23 / 0,29 / 0,14 / 0,18 | 0,21 / 0,26 / 0,14 / 0,18 | ✅ |
| `byName`: sắp 1 481 tên KH | 7,64 | **1,41** | **−6,2 ms (−82 %)** | 1,40 | 7,20 | DR6-136 ✅ |

`byName` trong bộ so của `DataTable` (`perf\byname-r5.mjs`, trung vị 41 lần, collator trần / `2e51e25` / ghim xen kẽ):

| Sắp (dữ liệu tải) | Collator trần | `2e51e25` | `37a80b6` | Lượt 4 (`2e51e25`, Node) | Mốc trước #828 |
|---|---:|---:|---:|---:|---:|
| 10 255 lịch hẹn theo KH rồi giờ | 9,67 ms | 71,87 | **11,19 (1,16×)** | 65,2 | 9,4 |
| 10 255 lịch hẹn theo RE rồi giờ | 6,55 | 64,85 | 7,89 (1,21×) | 62,5 | 6,8 |
| 10 255 lịch hẹn theo ghi chú rồi giờ | 13,56 | 109,86 | 9,53 | — | — |
| 1 481 tên KH | 1,00 | 7,31 | 1,18 | 7,20 | 0,98 |
| 19 253 tên | 22,31 | 159,26 | 30,02 (1,35×) | 153,3 | 20,4 |
| 39 987 tên (quá trần 20 000) | 48,98 | 352,46 | 79,19 (1,62×) | — | — |
| 10 255 lịch theo KH, bộ nhớ khóa có sẵn 19 999 tên khác | — | — | 10,74 | — | — |

Số exe (probe `e2e/perf`, Dọn sạch 128,0 ms, mở app lần đầu LCP 3 535 ms, mở lại LCP 710 ms) ở `common\baseline.md`: so mốc sau #656, G7 và lượt 4 không dòng nào ⚠️; gói A không đo lại trên exe. `p2c:db-save` lần đầu +31 ms (+26 %) so mốc sau #656 (dòng phụ `baseline.md` để gói A / F xét): lần lưu đó là `db.export()` của sql.js trên DB seed demo rồi Rust ghi file; diff `2e51e25..37a80b6` của gói A không chạm `openDatabase`, `seed.ts` hay đường lưu, và `db.export()` trong Node sau Dọn sạch 2,1 ms như lượt 4 (`baseline.md`, `purge-node`). Gói A không tách được thêm; để gói F (đo exe) kết luận. **Kết luận: không phát hiện P ở gói A**; DR6-136 về gần mốc trước #828.

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | | | | | | | | A2 | | 1 |
| Nit | | | A3 | | | | | | | A1 | 2 |
| **Tổng** | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | **3** |

- 3 / 3 CONFIRMED, 0 PLAUSIBLE, 0 KNOWN có bằng chứng mới.
- Trục R: 4 / 4 dòng R1 và 2 / 2 dòng R2 **ĐÃ SỬA**; không SỬA MỘT PHẦN, CHƯA SỬA hay HỒI QUY. Phát hiện kèm: DR6-136 → A2 (test hở của chính phần sửa); DR6-137 → A3 (biến thể khác hướng); DR6-151 → A1 (biến thể gần).
- 12 đột biến: 9 bị giết, 2 sống không tương đương (→ A2), 1 sống tương đương (`R136-past-max-nocache`: khóa vẫn đúng, chỉ không nhớ thêm).

## 8. Đã xét, không thấy (theo trục)

- **R:** mục 2: mỗi dòng có tái hiện (probe lượt 4 chạy lại, cùng probe trên `2e51e25` / cây đột biến ra lỗi cũ), gỡ phần sửa (bị giết, trừ DR6-136 → A2) và biến thể; refactor T-332 không đổi hành vi (K8: 0 khác trên 200 020 chuỗi).
- **E:** D7 cùng ngày qua xóa / sửa 6f / khôi phục ngược thứ tự / nhập backup / xóa KH (K1–K6); `byName` với tên toàn khổ / Ả Rập, quá trần 20 000, trần xóa giữa lần sắp (K12–K14); nhóm lịch ở biên hôm nay / hôm qua / ngày mai, có / không giờ (K16); "hôm nay" làm Dự kiến thành Chưa ghi kết quả ở 49 góc nhìn (K17).
- **C:** D7 khớp chữ spec Phase 3 `:22` (ô ngày khóa khi bị chặn, K2), `:188` (`STAGE_NOT_ON_DAY`, K1); T-350 khớp nghĩa thường "Chưa ghi kết quả" (K16); luật nhập 4 giữ sau mọi chuỗi D7. Ngoài A3: không thấy.
- **D:** mọi chuỗi D7 để lại dữ liệu xuất → nhập được; file của code `2e51e25` / lượt 3 / Phase 5 nhập được (K18); `readsBackAsIs` đúng với sql.js (K7), nên không chữ nào được nhập mà xuất lại khác.
- **G:** gói A chỉ lưu kết quả AI: nhãn model (DR6-137, A3), luật 12; nội dung G5 thuộc gói C.
- **S:** bước nạp backup từ chối mọi chữ sql.js không đọc lại nguyên (K7, 0 lệch hai chiều); câu SQL đợt sửa không đổi (chỉ `listTrash` thêm cột `code` đã có trong `customers`).
- **P:** mục 6.2 — không gì vượt luật nhiễu ở thao tác người dùng; DR6-136 về 1,16× collator trần.
- **B:** mục 6.1.
- **T:** ngoài A2: 9 / 12 đột biến bị giết; `R151-code-is-name` bị test `db` giết.
- **A:** gói A không có UI; tên nút của Thùng rác đọc từ `TrashRow` → A1. Không mã `DbError` mới.

## 9. Phụ lục

### 9.1 Cách chạy và nơi để bằng chứng

Mọi file ở `C:\workspace\deep-review-1-6-r5\claude\A\`. Repo chỉ đọc; vitest gọi thẳng `node node_modules/vitest/vitest.mjs` trong worktree (qua `mut.mjs`), không `pnpm`. Không mở trình duyệt, không gọi dịch vụ AI, không chạy e2e, không đo trên exe.

| Thư mục / file | Việc |
|---|---|
| `hooks.mjs`, `mut.mjs`, `mutant-config.mjs` | chép từ `deep-review-1-6-r4\claude\A\` (đổi chú thích và `LOAD`) |
| `old-2e51e25\`, `tree-37a80b6\`, `tree-mut-unmoved\`, `tree-mut-pastmax\` | cây chép (`git archive`) và hai cây đột biến (một dòng đổi mỗi cây) |
| `mut-r1.mjs`, `mut-r1.stdout.txt`, `mut-mut-r1.log`, `mut-src\` | 12 đột biến gỡ phần sửa và kết quả |
| `r1\` | `same-day-kept.mjs` (+ `.37a80b6.log`, `.mutant.log`), `label-repro.mjs`, `trash-code.mjs`, `trash-label-variants.mjs`, `trash-label-appdata.mjs`, `byname-past-max.mjs` (+ `.log`) |
| `r2\` | `d7-chains.mjs`, `readback-truth.mjs`, `label-blank.mjs`, `label-blank-import.mjs`, `t350-groups.mjs`, `counts-agree.mjs` (+ `.log`) |
| `gen\` | `gen.mjs`, `import.mjs` (chép từ lượt 4), `r4-load.p2cbackup`, `r4-demo.p2cbackup`, `gen.log`, `import-pinned.log` |
| `perf\` | `byname-r5.mjs`, `byname-heap.mjs`, `p-r5.mjs`, `run5.mjs`, `runs.jsonl`, `run5.out.txt` (+ `.log`) |

### 9.2 Đột biến

| Id | File | Đổi | Kết quả |
|---|---|---|---|
| `R135-unmoved-day-after` | `db/src/customers.ts` | `date >= ?` → `date > ?` (`unmovedMeetingsFrom`) | KILLED, 1 / 1 477 |
| `R136-old-file` | `domain/src/name-order.ts` | cả file về `2e51e25` | **SURVIVED** 1 477 / 1 477 (→ A2) |
| `R136-cache-swapped` | như trên | `keys.set(name, key)` → `keys.set(key, name)` | KILLED, 2 |
| `R136-past-max-raw` | như trên | quá trần → `return name` | **SURVIVED** (→ A2; không tương đương, `r1\byname-past-max.mjs`) |
| `R136-past-max-nocache` | như trên | quá trần → không nhớ thêm | SURVIVED, tương đương |
| `R137-isLabel-old` | `db/src/common.ts` | `isLabel` về "không rỗng, không NUL" | KILLED, 2 |
| `R137-readback-no-bom` | như trên | `readsBackAsIs` bỏ U+FEFF đầu | KILLED, 9 |
| `R137-readback-no-storable` | như trên | `readsBackAsIs` bỏ `isStorableText` | KILLED, 9 |
| `T332-valueOf-any-text` | `db/src/backup.ts` | `valueOf` nhận mọi chữ | KILLED, 12 |
| `T332-valueOf-storable-only` | như trên | `valueOf` chỉ chặn NUL | KILLED, 9 |
| `R151-code-is-name` | `db/src/trash.ts` | `code: row.name` | KILLED, 1 |
| `T350-group-today-unrecorded` | `domain/src/appointment-counts.ts` | `< 0` → `<= 0` | KILLED, 12 |

### 9.3 Cuối phiên

`git status --short` của `C:\workspace\Project-2C-review` cuối phiên (22:32): **rỗng**, như đầu phiên; `git rev-parse HEAD` = `37a80b662861d308a110d1e2b0f65ad13b91fb51`. Lệnh ghi duy nhất của phiên ra ngoài thư mục kết quả là cache của vitest / Vite trong `node_modules` (bị ignore). Liệt kê thư mục chỉ ở repo, ở `…-r5\claude\A\` và ở thư mục probe lượt 4 của chính Claude (`deep-review-1-6-r4\claude\A\`, `r2\`, `perf\`); file của `…-r5\common\` và `…-r4\claude\A\gen\`, `…-r4\common\load\` mở theo tên đầy đủ; bước 0 kiểm `…-r5\claude\A.md` bằng `Test-Path`. Không liệt kê / tìm kiếm trên `C:\workspace\` hay gốc `deep-review-1-6*\`; không mở thư mục `codex\` / `deepseek\` / `muse\` nào; báo cáo lượt 4 của bên khác chỉ đọc bản trong repo (`docs/reviews/raw/2026-10-31/deepseek/E.md`, qua `grep` trên `docs/reviews/raw/2026-10-31/*/E.md`). Giờ xong: **2026-11-04 22:33 (+07:00)**.
