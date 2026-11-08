# Tổng hợp deep review Phase 1–6, lượt 6 — Claude, Codex, agent WorkBuddy (Home PC)

- **Issue:** #1131 (T-389). Kế hoạch: T-385 #1117, `docs/process/deep-review-phase-1-6.md` §L6 (Owner duyệt G1 07/11/2026). ADR-0001 phụ lục M13.
- **SHA ghim:** `5b1328a` (`5b1328ae236aa62981dbf43066ff544a9e832c8c`). Máy: Home PC `DESKTOP-KDURKJP`.
- **Báo cáo gốc:** `docs/reviews/raw/2026-11-08/{claude,codex,workbuddy}/` (cùng PR với bản tổng hợp); bằng chứng, probe, log ở `C:\workspace\deep-review-1-6-r6\` (Home PC, giữ tới v1.0).
- **Bên review:**
  - Claude Opus 5.5 (`claude-opus-5-5` ở mọi bản ghi): 9 phiên sạch ở `Project-2C-review`, gói A–F rồi chủ đề G (rà gọn), H (chữ người dùng nhập / hiển thị), I (bất đồng bộ và thứ tự), 07/11 12:04–22:47. Sáu phiên dùng subagent (14 lần gọi, `opus` / `sonnet`, mức `xhigh`); không Workflow, không ultracode.
  - Codex, model GPT Sol 6.1: 6 phiên ở `Project-2C-review-2`, 07/11 12:03–19:57.
  - Agent WorkBuddy qua Code review expert, quyền Default, đợt 2 (07/11 23:42 – 08/11 13:29), sau khi ACL chặn thư mục của hai bên kia. **Model theo log phiên** (`providerData.model`): gói A và phiên B bị cắt `hy4-free` (Hy4); phiên B làm tiếp và C–F `deepseek-v4.1-flash-sg` (DeepSeek V4.1 Flash). Lệch §L6.7 ("mọi gói dùng cùng model", Hy4 hoặc GLM 5.3), xem §10.

**Cách kiểm (ADR-0001 M2, M13):** phiên tổng hợp (Claude Opus 5.5, phiên chính; Owner không bật subagent) đọc đủ 21 báo cáo: phần phát hiện, bảng đếm, bảng R của Claude A–F và bảng R gộp của Claude F, mục Bloat / Hiệu năng của gói F và G, kết luận của gói F. Đối chiếu trên code ở checkout chính (`main` = `5b1328a`, code không đổi từ SHA ghim):

- **5 vấn đề chặn:** đọc lại code ở mọi vị trí nêu, quét lại cùng mẫu (§4).
- **Phát hiện của Codex và WorkBuddy (23):** đọc lại code ở vị trí nêu (dữ liệu tham khảo, M2); cả 23 đúng. Sáu phát hiện WorkBuddy (C1–C3, D1, D2, F1) lúc đầu bị script đếm của phiên tổng hợp bỏ sót vì đề mục khác dạng; đã đọc, kiểm trên code và gộp vào họ có sẵn trước khi merge; không đổi kết luận, không đổi số DR6.
- **Phát hiện không chặn của Claude (76):** mỗi phát hiện có probe hay đột biến do phiên gói chạy lại (phát hiện của subagent được phiên chính kiểm lại trước khi ghi, mục 1 và 9 của báo cáo). Phiên tổng hợp đọc lại mô tả, bằng chứng, trường "Cùng mẫu", và đọc code ở các chỗ quyết định trục (CLR6-C2, D11, D13, E6, E10, H1, I1).
- 0 phát hiện bị bác; 0 KNOWN báo lại sai; 1 KNOWN có bằng chứng mới (CLR6-F9, mục OPEN [sau v1.0] của sổ).

## 1. Kết luận

**CHƯA SẴN SÀNG cho v1.0 ở `5b1328a`** theo K48: còn **5 vấn đề chặn phát hành**, đều Low (4 trục D, 1 trục G); **0 Critical / High / Medium**.

| DR6 | Vấn đề | Mức · trục | Từ |
|---|---|---|---|
| DR6-178 | Khôi phục lịch hẹn nhận lần rút chuyển nhóm theo mốc `deleted_at`: hai lệnh cùng mili giây thì khôi phục ghi nhóm / RF / snapshot sai, hoặc chặn nhầm | Low · D | Codex A |
| DR6-179 | Bản xuất `.p2cbackup` của app không giữ trần 100 MB mà nhập đòi: dữ liệu lớn xuất được mà không nhập lại được | Low · D | Claude A |
| DR6-180 | V3 / V6 lọt "sẵn sàng / tiềm năng mua (F12)" và tên luật trong ngoặc kép / ngoặc đơn | Low · G | Claude C |
| DR6-181 | Ô "+ thêm" người phối hợp (6a / 6b / 6h / 6f) thêm một người ở mỗi phím mũi tên trên ô đang đóng, rồi được lưu | Low · D | Claude E (Claude F chạy lại) |
| DR6-182 | Ô ghi chú 6c / 6f đổi sang ô một dòng khi chọn Hủy / Không đến; sửa ô rồi lưu thì ghi chú mất xuống dòng | Low · D | Claude H (S1, S2 cùng tìm) |

- **Bảng R:** R1 **20 / 20 ĐÃ SỬA**, R2 **14 / 14 ĐÃ SỬA**; 0 SỬA MỘT PHẦN, 0 CHƯA SỬA, 0 HỒI QUY (§3). Phần còn hở của các dòng là biến thể Low / Nit, đã ghi thành phát hiện mới không chặn.
- **103 phát hiện mới** (Claude 80, Codex 8, WorkBuddy 15) → **35 vấn đề DR6-178…212**: 5 chặn, **30 không chặn** (25 Low, 5 Nit theo mức chốt của họ) → sổ ghi chú review, OPEN, nhãn **[sau v1.0]**, không sửa trước G7 (K48).
- **Số đo:** exe ở SHA ghim không dòng nào ⚠️ so mốc sau #656, G7 và lượt 5; bundle +2 773 B (+0,12 %), exe 0 B; không phát hiện P (§7).
- **Sau tổng hợp:** Owner trả lời §9 → 5 Issue sửa theo họ (T-386: test đỏ khi gỡ phần sửa, quét cùng mẫu, ngân sách dòng) → merge. Không có Medium trở lên nên **không cần phiên review lại vùng** (§L6.10). Rồi G7 (§8).

## 2. Số liệu

### 2.1 Theo báo cáo (mức do chính bên đó gán)

| Bên | A | B | C | D | E | F | G | H | I | Cộng | Low | Nit | Đề xuất chặn |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Claude | 6 | 1 | 13 | 17 | 15 | 14 | 4 | 7 | 3 | **80** | 44 | 36 | 4 (A5, C1, E4, H3) |
| Codex | 1 | 1 | 1 | 2 | 2 | 1 | — | — | — | **8** | 6 | 2 | 1 (A1) |
| WorkBuddy | 6 | 2 | 3 | 2 | 1 | 1 | — | — | — | **15** | 10 | 5 | 0 |
| **Cộng** | | | | | | | | | | **103** | 60 | 43 | 5 |

0 Critical / High / Medium ở cả ba bên. Mọi đề xuất chặn của reviewer trùng kết luận của tổng hợp (5 / 5); không vấn đề chặn nào chỉ do tổng hợp đổi trục.

### 2.2 Theo vấn đề đã gộp (35) — bảng so ba bên

| | Claude | Codex | WorkBuddy |
|---|---|---|---|
| Phát hiện | 80 | 8 | 15 |
| Đúng / KNOWN có bằng chứng mới / sai | 79 / 1 / 0 | 8 / 0 / 0 | 15 / 0 / 0 |
| Chạm DR6 (trong 35) | 31 | 6 | 11 |
| Vấn đề chặn tìm được (trong 5) | 4 | 1 | 0 |
| Chỉ bên này thấy (DR6) | 20 | 2 (DR6-178, 201) | 2 (DR6-197, 199) |
| Thời gian (giờ máy, từ log) | A–F 5 h 15 (A 55′ · B 34′ · C 69′ · D 58′ · E 44′ · F 55′); G 30′ · H 58′ · I 40′ | A 34′ · B 18′ · C 27′ · D 24′ · E 4 h 52 có nghỉ (14:09–19:02) · F 33′ | A 32′ · B 2′ + 45′ · C 25′ · D 22′ · E 10′ · F 12′ (≈ 2 h 28) |
| Lệnh gọi công cụ (phiên chính · subagent) | 1 874 · 1 946 | 488 | 878 · 205 (A) |

- Vấn đề chặn duy nhất Claude không thấy (DR6-178) do Codex A tìm; theo Codex, Claude A lượt 3 từng thấy helper chọn dòng cũ khi hai mốc trùng nhưng ca đó vẫn ghi chuyển nhóm hợp lệ nên không báo (`docs/reviews/raw/2026-10-21/claude/A.md:172`).
- WorkBuddy B–F chạy DeepSeek V4.1 Flash, nhanh hơn lượt 5 (lượt 5 cùng model: ≈ 1 h 59 cho 6 gói) và ra ít phát hiện hơn Claude (B 2, C 3, D 2, E 1, F 1). Gói A (Hy4) ra 6.
- Credit WorkBuddy: Owner chưa báo; không có bản ghi `credit-usage` trong log của 7 phiên đã chép.

### 2.3 Độ trùng giữa các bên, ước số còn sót (chỉ xem xu hướng, §L6.0)

- Cùng một vấn đề ở hai bên (mức phát hiện): Claude ∩ Codex **4** (CLR6-C4 ≈ CXR6-C1; CLR6-E1 ≈ CXR6-E1; CLR6-F2 (cùng mục bổ sung của H: câu của 9a / 9b / 9c) ≈ một phần CXR6-D1; CLR6-F8 = CXR6-F1); Claude ∩ WorkBuddy **2** (CLR6-D3 ≈ WBR6-D2; CLR6-F2 / mục bổ sung của H ≈ WBR6-D1); Codex ∩ WorkBuddy **1** (CXR6-D1 ≈ WBR6-D1); cả ba **1** (tên liền dài trong câu của hộp 9a / 9b / 9c).
- Ước bắt – thả – bắt lại theo cặp: Claude – Codex 80 × 8 / 4 ≈ **160**; Claude – WorkBuddy 80 × 15 / 2 ≈ **600**; Codex – WorkBuddy 8 × 15 / 1 ≈ **120** phát hiện cỡ này. Như §L6.0 mục 1: số này thô (các bên không độc lập, cỡ phát hiện khác nhau, phần trùng rất nhỏ) và chỉ nói rằng một lượt vẫn là một lần lấy mẫu; đuôi Low / Nit còn dài. K48 không dùng số này làm điều kiện dừng.
- Theo họ (DR6): 20 / 35 họ chỉ Claude thấy, 2 chỉ Codex, 2 chỉ WorkBuddy; họ "tên liền dài" (DR6-183) và "tên truy cập trùng" (DR6-184) cả ba bên cùng chạm.

## 3. Bảng R gộp

Bằng chứng đủ ở mục 2 của `claude/A.md` … `E.md` và mục 2.3, 2.4 của `claude/F.md`. Codex, WorkBuddy và Claude G–I coi mọi dòng R là KNOWN (§L6.4); không bên nào báo phần sửa hỏng.

### 3.1 Bảng R1 (20 dòng)

| Mã | Mức lượt 5 | Kết luận (gói kiểm) | Cách kiểm chính | Phần còn hở → DR6 |
|---|---|---|---|---|
| DR6-158 | L | ĐÃ SỬA (A) | Tái hiện lượt 5; gỡ sửa `R158-old-file`, `R158-past-max-raw` KILLED | — |
| DR6-159 | N | ĐÃ SỬA (A) | 7 ký tự vô hình → `isLabel` false; `R159-isLabel-trim` KILLED 8 | — |
| DR6-160 | N | ĐÃ SỬA (A, E) | Tên nút mang mã / giờ xóa, 14 / 14 tên khác nhau trên bản web; luật 15 KILLED 9; đột biến e2e KILLED | Hoa / thường, chỗ đặt dấu thanh (CLR6-A1), cùng giây (CXR6-E2), bản ghi giống khít (WBR6-E1) → DR6-184 |
| DR6-161 | L | ĐÃ SỬA (B) | CAP1–CAP5 và nguồn của thân PR KILLED (sống trên test `37a80b6`); exe chép xác nhận quyền | `generate_context!`, `--config` qua `pnpm build:exe`, nhãn cửa sổ, dạng import (CLR6-B1, WBR6-B1, B2) → DR6-204 |
| DR6-162 | L | ĐÃ SỬA (B) | Probe CXR5-B2: `maxInFlight 1`, file lúc đóng đủ ba team; Q1 KILLED | — |
| DR6-163 | N | ĐÃ SỬA (B) | Nhánh `if (!storage) return;` không còn | — |
| DR6-164 | L | ĐÃ SỬA (C) | `R164-T6` KILLED 5 | — |
| DR6-165 | L | ĐÃ SỬA (C, F) | Mốc ở `phase-6.md:348-362`; Node xen kẽ trong nhiễu; trên màn trung vị 49 ms (mốc 53) | — |
| DR6-166 | N | ĐÃ SỬA (C) | `R166a`, `R166b` KILLED; 3 551 ghi chú thật: 1 972 → 1 972 đề xuất | — |
| DR6-167 | L | ĐÃ SỬA (C, F) | Cây thử chặn 8 / 8 cạnh (lượt 5: 1 / 8) | Gỡ rule không test nào đỏ; `vitest` từ file sản phẩm (CLR6-C5) → DR6-205 |
| DR6-168 | L | ĐÃ SỬA (C) | `R168-trim` KILLED 4, `E168-button-trim` KILLED | — |
| DR6-169 | L | ĐÃ SỬA (D) | 11 / 11 ký hiệu, 507 / 507 dấu nối bị báo; 356 file đối chiếu cây cú pháp: 0 sót; 23 đột biến KILLED | Năm ký hiệu của `vi.ts`, `` ` `` trong regex (CLR6-D1, D2), đối số có ngoặc (CXR6-D2) → DR6-207 |
| DR6-170 | L | ĐÃ SỬA (D, E, C) | Trang = cửa sổ ở 1 100 / 1 440 với tên 81 / 160 chữ ở mọi chỗ lượt 5; đột biến bị `long-names.spec.ts:357` giết | Dòng sau thao tác, thân hộp, lỗi AI, tooltip (CLR6-C4, E1, F2, H5; CXR6-C1, D1, E1) → DR6-183; trần `max-w-60` không ca giữ (CLR6-D3) → DR6-206 |
| DR6-171 | N | ĐÃ SỬA (F) | Hai dòng `nghiem-thu-v1.md` khớp app / mockup / spec | — |
| DR6-172 | L | ĐÃ SỬA (E) | 6b, Thùng rác khớp với U+200B / NBSP / hai dấu cách; `R172a/b/c` KILLED | Chữ số toàn khổ (WBR6-A1) → DR6-197 |
| DR6-173 | L | ĐÃ SỬA (E) | `R173a` KILLED | — |
| DR6-174 | L | ĐÃ SỬA (E) | Ba đột biến sống lượt 5 nay KILLED | Phần màn của T-380 không ca giữ (CLR6-E2) → DR6-206 |
| DR6-175 | N | ĐÃ SỬA (F) | Bốn đột biến sống lượt 5 nay KILLED | Nhánh khác của công cụ (CLR6-F6) → DR6-210 |
| DR6-176 | L | ĐÃ SỬA (F) | Tái hiện CXR5-F1 trên 11 bộ đầu vào; S01–S10 KILLED | — |
| DR6-177 | N | ĐÃ SỬA (F) | Bản web: locator cũ chọn dòng Dự kiến, `metRows` = DOM | — |

### 3.2 Bảng R2 (14 dòng)

| Issue | Kết luận (gói) | Cách kiểm chính | Phần còn hở → DR6 |
|---|---|---|---|
| T-371 #1054 | ĐÃ SỬA (F) | Đếm lại bảng §5.1 tổng hợp lượt 5: đúng bảy mục chênh | — |
| T-372 #1058 | ĐÃ SỬA (F) | Chỉ đổi tên biến; không test nào đỏ được (đúng Issue) | — |
| T-373 #1059 | ĐÃ SỬA (F) | F01, F06 KILLED | — |
| T-374 #1079 | ĐÃ SỬA (B) | Q4–Q6, T374a–d KILLED | → DR6-204 |
| T-375 #1080 | ĐÃ SỬA (C, F) | `R375-no-cap`, `R375-no-words` KILLED; rule chung | Phần nút (CLR6-C6), rule (CLR6-C5) → DR6-205; chữ spec (CLR6-C11) → DR6-212 |
| T-376 #1081 | ĐÃ SỬA (D) | `T376-concat`, `T376-cell-nowrap` KILLED | `T376-cell-nocap` sống (CLR6-D3) → DR6-206 |
| T-377 #1082 | ĐÃ SỬA (A, E) | `T377-search-no-normalize` KILLED 5; `T377a–d` KILLED | — |
| T-378 #1083 | ĐÃ SỬA (F) | F02, F04, F05, S01 KILLED | — |
| T-379 #1085 | ĐÃ SỬA (F) | G01–G06 KILLED; skill khớp `auto-wait` | — |
| T-380 #1094 | ĐÃ SỬA (E) | `T380a–d` KILLED | Phần màn (`T380s1–s4` sống, CLR6-E2) → DR6-206 |
| T-381 #1095 | ĐÃ SỬA (B) | T381a, T381b KILLED | `--config` qua `pnpm build:exe`, `tauri_config` (CLR6-B1) → DR6-204 |
| T-382 #1101 | ĐÃ SỬA (B, E) | T382b–d, TM2, `T382a/b` KILLED | Composite action (CLR6-B1) → DR6-204 |
| T-383 #1107 | ĐÃ SỬA (F) | B01, B02, F03 KILLED; B03 sống, gần tương đương | — |
| T-384 #1111 | ĐÃ SỬA (B) | T384a–c, TM1 KILLED | `node …/tauri.js` (CLR6-B1) → DR6-204 |

## 4. Vấn đề chặn phát hành (5)

Mỗi vấn đề một Issue sửa theo T-386 (Issue có "Ngân sách" và "Quét cùng mẫu"; PR có "Test đỏ khi gỡ phần sửa", "Quét cùng mẫu", "Cỡ so ngân sách"). Issue tạo sau khi Owner chọn cách sửa ở §9. Ngân sách là cỡ ước lượng, SP = dòng sản phẩm.

### DR6-178 — Khôi phục lịch hẹn nhận lần rút chuyển nhóm theo mốc xóa (CXR6-A1)

- **Vị trí:** `packages/db/src/customers.ts:465-481` (`transitionWithdrawnAt`: `eq(stageTransitions.deletedAt, at)` rồi `.get()`); dùng ở `appointments.ts:259` (xóa), `:274`, `:289-292`, `:315-316` (khôi phục), `trash.ts:144` (hiệu ứng Thùng rác). `db.now()` lấy thẳng đồng hồ (`database.ts:83`, `:102`).
- **Cơ chế:** lần xóa lịch hẹn đóng dấu transition nó rút bằng chính mốc của lần xóa; khôi phục tìm lại bằng mốc đó. Khi một lần rút cũ (sửa kết quả thành Hủy) có cùng mili giây với lần xóa sau, helper nhận dòng cũ, kể cả khi lần xóa không rút gì. Codex dựng bằng đồng hồ đứng qua `openAppData` / `app.run`: khôi phục thêm chuyển nhóm N3→N2 ngày 05/10 gắn lịch, RF = 1, snapshot 05/10 đổi N3 = 1 → N2 = 1, bản sai vào backup và được nhập lại; biến thể khác chặn nhầm `TRANSITION_BEFORE_LATEST`. Đồng hồ tăng đều: đúng.
- **Kiểm của tổng hợp:** đọc `customers.ts:369-481`, `database.ts`: đúng như mô tả. Hai lệnh cùng mili giây chỉ xảy ra khi đồng hồ máy đứng hay lùi đúng mốc đó. File sửa tay có một transition cùng mốc với lần xóa thì app đọc theo định dạng (lần xóa rút transition đó), không phải lỗi; nhưng luật nhập vẫn nhận hai transition của cùng lịch hẹn cùng `deleted_at` (mơ hồ).
- **K48:** Low (đồng hồ bất thường, §4.3 "điều kiện hiếm") · **D** (khôi phục ghi nhóm / RF / snapshot trái "trả đúng lúc xóa", lan vào backup) → **chặn**.
- **Hướng sửa (Q1):** (a) đồng hồ của DB không lặp, không lùi trong một lần mở: `db.now()` trả mốc sau mốc trước (một chỗ trong `database.ts`, đóng cả họ "mốc làm khóa quan hệ"), cộng luật nhập: hai transition của cùng lịch hẹn không cùng `deleted_at` (K1). (b) lưu id transition bị rút cùng bản ghi xóa (cột mới, migration, luật nhập), như Codex đề xuất.
- **Quét cùng mẫu:** `git grep -n -E "eq\([a-zA-Z]+\.deletedAt, |deleted_at = \?|deletedAt === " -- 'packages/db/src/*.ts' ':!*.test.ts'` → chỉ `customers.ts:477` ghép quan hệ bằng mốc (`trash.ts:190` chỉ sắp thứ tự). `kyc.ts:131-138` ghép `createdAt` nhưng đã kiểm trùng mốc rồi bỏ khi mơ hồ (Codex). `db.now()` có 26 chỗ gọi trong `packages/db/src` (ngoài test): hướng (a) đổi chung cho mọi chỗ.
- **Ngân sách:** (a) ≈ 15–25 SP + 40–70 dòng test (đồng hồ đứng / lùi, hai biến thể của Codex, xuất → nhập); (b) ≈ 40–90 SP + 100–160 test (ước của Codex).

### DR6-179 — Bản xuất backup không giữ trần mà luật nhập đòi (CLR6-A5)

- **Vị trí:** `packages/db/src/backup.ts:44-66` (`exportBackup` không so cỡ), `:80-83` (`importBackup` từ chối `BACKUP_TOO_LARGE`); `apps/desktop/src/data/app-data.ts:456-461` (xuất của app tính `size`, không so trần); `SettingsBackup.tsx:75` (nhập so `file.size`); spec `phase-3-du-lieu.md:215` (trần 100 MB, Owner 30/09).
- **Bằng chứng:** Claude A S2 (`s2\p4-export-over-limit.log`): 11 lần `recordKycNote` 10 triệu ký tự → xuất 110 003 682 ký tự thành công → `importBackup(exportBackup(d))` → `BACKUP_TOO_LARGE`. Dữ liệu tải xuất 16 034 517 byte = 0,153 trần. Claude F đọc lại code: khớp.
- **K48:** Low (dữ liệu cỡ ≈ 6,5× dữ liệu tải; chưa chạm được với dữ liệu v1.0) · **D** (§4.1: "lệnh và luật nhập backup cùng luật"; bản backup của app không khôi phục được) → **chặn**. Lỗi hiện rõ lúc nhập, có `project2c.db` / `backups\*.db` để chép tay, nhưng K48 không hạ theo đường vòng.
- **Hướng sửa (Q2):** (a) xuất so số byte với `MAX_BACKUP_BYTES` (cùng thước với hộp 10b) và từ chối, không ghi file, với câu riêng chỉ bản `.db` trong `backups\`; (b) vẫn ghi file nhưng báo "file này không nhập lại được"; (c) nâng trần nhập (đổi quyết định Owner 30/09).
- **Quét cùng mẫu:** `rg "const MAX_[A-Z_]* *=" packages/*/src apps/desktop/src apps/desktop/src-tauri/src` (Claude A S2): chỉ `MAX_BACKUP_BYTES` có trần ở phía đọc mà phía ghi không giữ (`MAX_AI_RAW_OUTPUT` cắt lúc ghi, `MAX_FEE_VND` ở lệnh + nhập, `MAX_MESSAGE_CHARS` có câu `AI_TOO_LARGE` riêng). `git grep -n "exportBackup("`: một đường xuất của app (`app-data.ts:456`).
- **Ngân sách:** (a) ≈ 10–15 SP + 1 khóa i18n + 15–25 dòng test.

### DR6-180 — V3 / V6 lọt mã dữ kiện và tên luật trong ngoặc (CLR6-C1)

- **Vị trí:** `packages/ai/src/blocklists.ts:35-38` (lớp sau "(sẵn sàng|tiềm năng) mua" chỉ `[.,;:!?)]`), `:108` (`LAW_NAME` đòi `\p{Lu}` ngay sau "luật\s*"); G5 `docs/design/phase-5-prompts.md:470` (§8.1 V3: chặn khi theo sau là "hết câu / dấu câu"), §8.4 (V6).
- **Bằng chứng:** Claude C S1 (`C\s1\p04-followers.log`, phiên chính chạy lại; `validateOutput('analysis', …)`): "KH sẵn sàng mua (F12)", "KH tiềm năng mua [F12]", "Theo Luật “Kinh doanh bảo hiểm”", "Theo Luật "Đất đai"", "Theo Luật (sửa đổi) Đất đai" → `[]` (lọt); "KH sẵn sàng mua.", "…)", "Theo Luật Kinh doanh bảo hiểm" → bị chặn. Kho eval thật: 0 câu dạng này.
- **Kiểm của tổng hợp:** đọc hai regex ở `5b1328a`: đúng. Phần Owner đã nhận ở G5 §10.10 là "không kèm từ sản phẩm nhưng có chữ khác theo sau" (`phase-5-prompts.md:553`); mã dữ kiện trong ngoặc là dấu câu theo chữ §8.1, và tên luật trong ngoặc không nằm trong phần "Mất" nào của §11–§14.
- **K48:** Low (chỉ khi model trái quy tắc 6 / 9 của prompt) · **G** → **chặn**.
- **Hướng sửa (Q3, cổng G5):** (a) V3 thêm `(`, `[`, ngoặc kép vào lớp sau cụm; V6 nhận ngoặc kép / ngoặc đơn trước tên luật; thêm ca §8.5; version `analysis@6` / `discovery@6` (cách đếm version như §12, §14); NT-EV-01 chạy với version cuối. (b) Owner ghi hai dạng vào phần "Mất" của G5 (§10.10) → ACCEPTED, không sửa code.
- **Quét cùng mẫu:** S1 thử mọi nhánh chốt khác của V3–V6 ("chốt được", "Điều <số>", "khoản <số>, Điều"): không lọt ngoài các ca trên. Hai regex dùng chung cho analysis và discovery (`pattern(…, 'both')`).
- **Ngân sách:** (a) ≈ 2–4 SP + 6–10 dòng test + mục mới ở `phase-5-prompts.md` (CODE_DOCS: tính là code).

### DR6-181 — Ô "+ thêm" người phối hợp thêm người theo phím mũi tên (CLR6-E4)

- **Vị trí:** `apps/desktop/src/routes/appointments/AppointmentDialog.tsx:244-251` (`<SelectField value="" … onChange={(id) => id && onChange([...ids, id])} />` của `CoordinatorsField`), dùng ở 6a / 6b / 6h và 6f (`EditOutcomeDialog.tsx:252`). Không vùng `aria-live` nào trong hộp.
- **Cơ chế:** `<select>` đang đóng trên Chromium Windows (cũng là WebView2 của exe) đổi giá trị và bắn `change` ở mỗi ArrowDown / ArrowUp; ô coi mỗi `change` là "thêm người này" rồi về "+ thêm". Người dùng bàn phím duyệt danh sách là thêm mọi người mình đi qua; trình đọc màn hình chỉ nghe lại "+ thêm".
- **Bằng chứng:** Claude E (`p55-coordinator-arrows-save.log`): 6b, ArrowDown ×2 → hai chip → "Tạo lịch hẹn" → Chi tiết "Phối hợp IS Bùi Văn Nga, BDM Hoàng Minh Quang". Claude F chạy lại độc lập (`web\p-e4-arrows.log`): cùng kết quả.
- **Kiểm của tổng hợp:** đọc `AppointmentDialog.tsx:214-255`: đúng.
- **K48:** Low (chip hiện trên màn trước khi lưu, bỏ được; lịch Dự kiến đã lưu thì chỉ còn đường xóa rồi tạo lại) · **D** (app lưu người phối hợp người dùng không chọn; người đó bị chặn xóa / đổi vai trò, `PERSON_IN_USE`, `COORDINATOR_IN_USE`) → **chặn**.
- **Hướng sửa (Q4):** (a) ô chọn giữ lựa chọn trong state, thêm bằng nút "Thêm" cạnh ô (thêm một nút so mockup → ghi "Lệch mockup đã biết"), `aria-live` "Đã thêm <người>"; (b) giữ ô như nay, bỏ qua `change` đến từ phím điều hướng trên ô đang đóng, chỉ thêm khi chọn bằng chuột hay Enter trên danh sách mở; `aria-live` như (a).
- **Quét cùng mẫu:** `git grep -n 'value=""' -- 'apps/desktop/src/**/*.tsx' 'packages/ui/src/**/*.tsx'` → chỉ `AppointmentDialog.tsx:247` (`SelectField.tsx:75` là option giữ chỗ). 14 `<SelectField` khác giữ giá trị trong state hay chỉ đổi phần đang xem (ô lọc, góc nhìn), không ghi dữ liệu (Claude E S1).
- **Ngân sách:** ≈ 10–20 SP + 15–25 dòng e2e (ArrowDown trên ô đang đóng không thêm ai; thêm bằng bàn phím được).

### DR6-182 — Ô ghi chú 6c / 6f bỏ xuống dòng khi đổi trạng thái (CLR6-H3)

- **Vị trí:** `apps/desktop/src/routes/appointments/OutcomeDialog.tsx:182-187` (`rows={met ? 3 : undefined}` :186), `EditOutcomeDialog.tsx:234-239` (`rows={status === 'MET' ? 3 : undefined}` :238); `packages/ui/src/components/TextField.tsx:62` (`rows ? 'textarea' : 'input'`); lệnh lưu chữ như gõ (`packages/db/src/common.ts:75-78`, K33 (4)).
- **Cơ chế:** đổi Đã gặp → Hủy / Không đến làm ô ghi chú thành `<input>` một dòng; luật làm sạch giá trị của `<input>` bỏ LF; gõ thêm một ký tự thì `onChange` lấy chữ đã dính và lệnh lưu đúng chữ đó.
- **Bằng chứng:** Claude H S1 và S2 tìm độc lập; phiên chính chạy lại: 6f "… hưu tríDòng hai: …(sửa)" được lưu; 6c gõ hai dòng → Không đến → gõ " gấp" → "…hưu tríDòng hai: vợ làm giáo viên gấp".
- **Kiểm của tổng hợp:** `rg -n "rows=\{"`: đúng hai chỗ đổi kiểu ô theo trạng thái.
- **K48:** Low (thấy chữ dính trong ô trước khi lưu, đường ít gặp) · **D** (chữ người dùng đã lưu bị đổi ngoài ý) → **chặn**.
- **Hướng sửa (Q5):** (a) giữ `textarea` khi chữ đang có xuống dòng (`rows={met || note.includes('\n') ? 3 : undefined}` ở cả hai hộp): mockup giữ nguyên ở ca thường; (b) ô ghi chú luôn là `textarea` (2 dòng khi không phải Đã gặp): lệch mockup 6c / 6f.
- **Quét cùng mẫu:** `rg -n "rows=\{" apps/desktop/src packages/ui/src` → chỉ `OutcomeDialog.tsx:186`, `EditOutcomeDialog.tsx:238` đổi kiểu ô theo trạng thái; `KycDialogs.tsx:302`, `KycWebSession.tsx:138`, `:154` cố định. **Để ngoài, ghi sổ [sau v1.0]:** ô một dòng nạp chữ đã lưu (Mô tả trigger 6h / 6f, Việc tiếp theo) chỉ có LF khi chữ đến từ backup sửa tay (cùng cơ chế, chưa dựng; K1).
- **Ngân sách:** (a) ≈ 2–4 SP + 15–25 dòng e2e.

**Cộng ngân sách** (theo phương án đề xuất): ≈ 40–70 SP, ≈ 90–160 dòng test.

## 5. Vấn đề không chặn (30) → sổ OPEN [sau v1.0]

Mức · trục là của họ (cao nhất trong các phát hiện gộp). Cỡ ước lấy từ báo cáo. Không sửa trước G7 (K48, K49) trừ khi Owner kéo vào ở Q6.

| DR6 | Họ / vấn đề | Phát hiện | Mức · trục | Vì sao không chặn | Cỡ ước |
|---|---|---|---|---|---|
| DR6-183 | Chuỗi liền dài còn tràn ở trạng thái sau thao tác, thân hộp, lỗi / cảnh báo AI, tooltip chart (họ DR6-170) | CLR6-C4, E1, F2 (+ nhánh lỗi 9a / 9b / 9c, mục bổ sung của H), H5; CXR6-C1, D1, E1; WBR6-D1 | Low · E | Chỉ hiển thị, tên / thông điệp liền dài bất thường | ≈ 30–60 SP + e2e quét theo trạng thái |
| DR6-184 | Tên truy cập / nhãn trùng giữa bản ghi trùng tên hay giống khít (họ DR6-119 / 151 / 160) | CLR6-A1, C13, D5, E3, F1, H2; CXR6-E2; WBR6-E1 | Low · A (F1: Low C) | Trợ năng / chữ trên màn; khôi phục nhầm đảo ngược được | ≈ 30–50 SP + e2e |
| DR6-185 | Hai RE trùng họ tên cùng team: mọi ô chọn người hiện hai lựa chọn giống hệt | CLR6-D13 | Low · E | Lệnh lưu đúng người được chọn; chỗ hỏng là nhãn; sửa cần luật mới (nhãn phân biệt hay cấm trùng, G2) | ≈ 10–20 SP |
| DR6-186 | Nút tự gỡ / tự tắt làm focus rơi về `body` | CLR6-E7, E8 | Low · A | Bàn phím / trình đọc màn hình; không sai dữ liệu | ≈ 30–50 SP + e2e |
| DR6-187 | Trình đọc màn hình: đọc lựa chọn hai lần, chip dính chữ, "Đang có" không nối mô tả, cấp tiêu đề | CLR6-D4, D15, D16, E14 | Nit · A | Chữ trợ năng | ≈ 10 SP |
| DR6-188 | Dòng đang xem ở Lịch hẹn không được tô (mockup `tr.selected`) | CLR6-E9 | Low · C | Hiển thị | ≈ 10 SP + 10 e2e |
| DR6-189 | Câu từ chối của 6c / 6f hiện ngoài tầm nhìn khi hộp cuộn; `INVALID_TEXT` không nói ô nào | CLR6-H6 | Low · A | Lệnh từ chối, DB không đổi | ≈ 10–15 SP |
| DR6-190 | Dòng thời gian gộp ghi chú nhiều dòng; ký tự ngắt dòng hiếm; thứ tự chuyển nhóm trong ngày | CLR6-H4, H7, D17 | Low · E | Hiển thị | ≈ 5–10 SP |
| DR6-191 | Excel của Báo cáo: tên có U+FFFE / U+FFFF làm file không phải XML hợp lệ; tên dạng `_xHHHH_` đọc ra chữ khác | CLR6-H1, E10 | Low · E | Chỉ file báo cáo xuất ra (không phải dữ liệu đã lưu / backup); đầu vào hiếm | ≈ 5–8 SP + 6 test |
| DR6-192 | Kỳ Tùy chọn qua ranh tháng rơi vào CN / T2: lịch tháng không tới tháng kia | CLR6-E5 | Low · E | Có đường vòng (Tháng / Tuần) | ≈ 15–30 SP + 30 test |
| DR6-193 | Năm của ngày: 6c / 6i không gợi ý năm sau (W8); "Dời sang dd/mm" không ghi năm | CLR6-E6, E11 | Low · C | Ô báo lỗi, không lưu nhầm | ≈ 3–5 SP + 15 e2e |
| DR6-194 | Lệch chữ mockup: khung "Khi lưu" 6e / 6i, câu tháng của hộp 8b, chữ cần gõ không đậm | CLR6-E12, E13, E15 | Nit · C | Chữ | ≈ 5–10 SP |
| DR6-195 | Câu nói sai nghĩa: "yêu cầu AI khác" khi chính lần kiểm đang chạy, đổi vai trò sang RE, lý do v1 KYC, 5d gọi ngày tạo KH là "lần đổi nhóm" | CLR6-C3, D7, D11, D12 | Low · C | Chữ; lệnh / dữ liệu đúng | ≈ 30–45 SP |
| DR6-196 | Team & nhân sự: góc nhìn tự nhảy team / RE sau đổi tên / tạo mới; dấu cách cuối tên là "chưa lưu"; hash lạ ở bản web | CLR6-D6, D9, D10 | Low · E | Không sai dữ liệu | ≈ 10–20 SP |
| DR6-197 | Ô tìm (`searchText`) không gập chữ số toàn khổ như `byName` | WBR6-A1 | Low · E | Có đường vòng; hiếm | ≈ 3 SP + 2 ca |
| DR6-198 | Mock trích xuất: đề xuất khả năng đầu khi câu nêu hai khả năng cách dấu phẩy; con đã mất nêu ở vế sau dấu phẩy vẫn ra Số con; chỉ nhận dòng trường "Hôn nhân:" nên ghi chú seed không bao giờ ra Số con | CLR6-C2; WBR6-C2, C3 | Low · C | Mock (demo, e2e, máy chưa có key); RE phải Xác nhận; không phải guardrail (như DR6-141); thêm luật là hành vi mới (K49) | ≈ 15–25 SP + 10 ca |
| DR6-199 | V7 so trích dẫn bằng `collapseSpaces`: trích dẫn có U+200B / U+0085 bị bỏ | WBR6-A2 | Low · E | Chiều an toàn (bỏ đề xuất đúng, không lọt sai); cần output suy biến | ≈ 3 SP + 2 ca |
| DR6-200 | "Nạp lại…" bấm được lúc đang đọc file backup: 10a chồng 10c, 10c giữ số cũ | CLR6-I1 | Low · E | Hai thao tác chồng nhau; người dùng gõ xác nhận; exe có backup trước khi nạp | ≈ 5–10 SP + 5 e2e |
| DR6-201 | `watchToday`: tự hủy trong callback nửa đêm vẫn đặt lại timer | CXR6-B1 | Low · E | Không đường UI nào gặp | ≈ 3–7 SP + 15–25 test |
| DR6-202 | Kiểm khi nhập backup: hai lần đọc "hôm nay" (luật 10 / 14), luật 15 không gắn số với mã không phải chuỗi, không ca giữ thứ tự luật | WBR6-A3, A6; CLR6-A6 | Low · E | Hàng được nhận qua nửa đêm đã là "hôm nay" khi nhập xong; tham số chẩn đoán | ≈ 2–5 SP + 3 ca |
| DR6-203 | Test hở lõi domain: `switchKind` ngày cuối kỳ, điểm % lẻ, trường số rỗng | CLR6-A2, A3, A4 | Low · T | Code đúng | ≈ 12 dòng test |
| DR6-204 | Test hở hợp đồng capability (họ DR6-161): `generate_context!`, `--config` qua `pnpm build:exe`, nhãn cửa sổ, dạng import | CLR6-B1; WBR6-B1, B2 | Low · T | Quyền exe ở SHA ghim đúng | ≈ 10–30 dòng test |
| DR6-205 | Test hở AI: rule dependency-cruiser, nút T-375, chữ §10 của Mock, nhánh regex G5, biên lõi AI, nhánh app AI, biên luật câu dán trống (NUL, trống mà quá dài) | CLR6-C5…C10; WBR6-C1 | Low · T | Code đúng | ≈ 70–130 dòng test |
| DR6-206 | Test hở màn: trần `max-w-60` / `max-w-80`, 9a / `Segmented`, công tắc thay đổi quan trọng, phần màn T-380, phím → vòng, trần 5 dòng, cờ `closing` | CLR6-D3, D8, D14, E2, F4, F5, I2; WBR6-D2 | Low · T | Code đúng | ≈ 60–100 dòng test |
| DR6-207 | Bộ chặn ký hiệu (họ DR6-169): năm ký hiệu của `vi.ts`, `` ` `` trong regex, đối số có ngoặc | CLR6-D1, D2; CXR6-D2 | Low · T | Công cụ kiểm, không vào exe | ≈ 10–25 SP công cụ + test |
| DR6-208 | Hook gợi ý review đọc báo cáo subagent / phiên con là lời Owner khi thẻ đóng có thuộc tính | CLR6-F3 | Low · C | Công cụ phát triển; K45 rào "không tự sửa", K49 | ≈ 2–5 dòng công cụ + ca |
| DR6-209 | `notes-for` chưa có ngoại lệ [sau v1.0] của K49; cỡ "so ngân sách" lệch ở PR xếp chồng (KNOWN) | CLR6-F8, F9; CXR6-F1 | Nit · C | Công cụ / mẫu | ≈ 2–4 dòng + 8–15 test |
| DR6-210 | Test hở công cụ / e2e / CI: nhánh cổng merge, bộ kiểm link, bảng so probe, hai ca đọc `dist`, luật lint `test` chỉ `.ts`, vitest treo không `timeout-minutes`, bộ giả `asExe` không trả lời `open_folder` | CLR6-F6, F7, F10, F13, F14, I3; WBR6-F1 | Low · T (WBR6-F1; còn lại Nit) | Công cụ phát triển / e2e, code ghim đúng | ≈ 55–95 dòng |
| DR6-211 | Bloat: helper e2e chép, `globals` ESLint vô tác dụng, họ tên nút Thùng rác nặng nhất diff, bộ chặn ký hiệu trong package sản phẩm, ma trận ký tự vô hình chép, hai bộ quét chữ viết tay | CLR6-F11, F12, G1, G2, G3, G4 | Nit · B | K49: không gỡ / gộp vì bloat trước v1.0 | (đề xuất của G: §7.2) |
| DR6-212 | Tài liệu: spec §3.1 / §10 AI lệch code, ADR-0008:19 bốn hạng mục cốt lõi, ô "Owner duyệt" của `chi-so.md` / `ai-eval.md` chưa tick | CLR6-C11, C12; WBR6-A4, A5 | Nit · C | Chữ tài liệu (golden / ADR đã duyệt: Owner chốt cách ghi) | 0 SP |

Đếm: 30 họ (25 Low, 5 Nit); 98 phát hiện. Mức chốt của từng phát hiện giữ như reviewer ghi (§6).

## 6. Cách áp K48 ở tổng hợp

K48 chặn Low ở trục D, S, G; "Low có hậu quả lên dữ liệu đã lưu, backup, key hay output AI thì xếp D / S / G, dù reviewer ghi trục khác" (§L6.1). Phiên tổng hợp đọc câu đó như sau, rồi áp đều:

- **D:** app tự lưu / giữ dữ liệu khác điều người dùng làm hay muốn, hoặc tạo bản backup chính nó không lấy lại được, do lỗi của app (không phải do lựa chọn rõ ràng của người dùng). → DR6-178, 179, 181, 182.
- **G:** guardrail để lọt thứ G5 bảo chặn, hay AI ghi thẳng dữ liệu KYC. Guardrail chặt hơn cần (bỏ một đề xuất đúng) và độ chính xác của Mock (đề xuất phải được RE xác nhận) không tính. → DR6-180 chặn; DR6-198, 199 không.
- **S:** không phát hiện nào có lỗ ở ranh giới hôm nay (test hở của hợp đồng capability là T).

Các chỗ giáp ranh và lý do:

| Phát hiện | Reviewer | Tổng hợp | Lý do |
|---|---|---|---|
| CXR6-A1 | Low · D, chặn | giữ | Khôi phục ghi nhóm / RF / snapshot sai, lan vào backup |
| CLR6-A5 | Low · D, chặn ("có thể hạ") | giữ | K48 xếp theo mức và trục, không theo việc dữ liệu v1.0 chưa chạm ngưỡng |
| CLR6-E4 | Low · D (A), chặn nếu D | D, chặn | App lưu người dùng không chọn; chip thấy trên màn chỉ làm mức Low, không đổi trục |
| CLR6-H3 | Low · D (E), chặn nếu D | D, chặn | Chữ đã lưu đổi ngoài ý |
| CLR6-D13 | Low · E (A), chặn nếu coi là hậu quả dữ liệu | E, không chặn | Lệnh lưu đúng người được chọn; mọi màn cũng không phân biệt hai người, nên chỗ hỏng là nhãn; sửa cần luật mới (G2) |
| CLR6-I1 | Low · E | giữ | Người dùng gõ xác nhận thay dữ liệu; exe có backup ngay trước khi nạp |
| CLR6-C2, WBR6-C2 | Low · C (C2: "chặn nếu G") | C, không chặn | Mock, không phải guardrail; RE phải Xác nhận; nhất quán DR6-141 (lượt 4) |
| WBR6-A2 | Low · E | giữ | Guardrail chặt hơn (chiều an toàn) |
| WBR6-A3 | Low · E | giữ | Hàng mang ngày D+1 được nhận khi lần đọc thứ hai đã là D+1, tức đúng lúc nhập xong |
| CLR6-H1, E10 | Low · E | giữ | File Excel xuất ra không phải dữ liệu đã lưu hay backup |
| CLR6-F6, F7 | Nit (subagent đề xuất Low) | Nit | Như DR6-155, DR6-175: test hở của công cụ phát triển là Nit |

Không phát hiện nào đổi mức.

## 7. Bloat và hiệu năng

### 7.1 Số đo (bước chuẩn bị ở SHA ghim, `common-baseline.md`; Claude F đối chiếu)

Exe release `5b1328a` trên Home PC, cùng script với G7 / lượt 5. **Không dòng nào ⚠️** ở cả ba bảng (so mốc sau #656, G7 `233c77e`, lượt 5 `37a80b6`); mọi thao tác trong ngưỡng `phase-6.md`:

| Thao tác (exe) | Lượt 6 | Lượt 5 | G7 | Mốc sau #656 | Ngưỡng |
|---|---|---|---|---|---|
| Mở lần đầu → LCP | 3 612 ms | 3 535 | 3 420 | 3 663 | ≤ 4 396 (luật nhiễu) ✅ |
| Mở lại trên dữ liệu tải (LCP) | 688 ms | 710 | 617 | — | ≤ 740 (luật nhiễu so G7) ✅ |
| `app.open-data` / `db.save` | 364 / 147 ms | 330 / 150 | 320 / 148 | 387 / 151 | ≤ 600 / ≤ 400 ✅ |
| `reload.*` (6 màn) | 281–406 ms | 285–407 | 280–395 | 283–398 | < 500 ✅ |
| Thao tác màn còn lại (20 dòng) | 4–33 ms | 2–33 | 2–33 | 2–34 | < 200 ✅ |
| `backup.read` / `import` / `export` | 979 / 44 / 427 ms | 983 / 50 / 438 | 975 / 44 / 435 | 835 / 43 / 438 | ≤ 2 000 / 500 / 1 000 ✅ |
| `appointments.next-month` / `next-year` | 109 / 107 ms | 111 / 108 | 112 / 109 | 101 / 107 | ≤ 300 ✅ |
| JS heap | 16,8 MB | 16,7 | 16,7 | 16,5 | ≤ 21 MB ✅ |
| Dọn sạch: bấm → 11j | 120,5 ms | 128,0 | 130,5 | — | ≤ 500 ✅ |

- Dữ liệu tải `tables` sha256 = lượt 5 / G7. Cổng ở SHA ghim xanh: `pnpm verify` 4 493 test, Rust 120, e2e 329.
- **Hàm thuần trong Node** (Claude F S3, A/B xen kẽ `37a80b6` ↔ ghim): `searchText` (T-377) làm mỗi phím ở hai ô tìm chậm ≈ 1,7×, tuyệt đối ≤ 12,8 ms ở ca xấu nhất (1 481 KH, tên ≈ 129 ký tự); dựng mọi dòng Thùng rác 2 626 dòng +2,95 ms. Không dòng nào > 20 % và > 10 ms.
- **DR6-165 trên màn:** lần bấm AI trích xuất đầu trung vị 49 ms (mốc 53 ms).
- **Không phát hiện P.**

### 7.2 Bloat (Claude F toàn codebase, Claude G diff `37a80b6..5b1328a`)

- Bundle JS / CSS 2 369 229 B (+2 773 so lượt 5, +0,12 %); `index.js` 894 865 B (+2 681); exe 5 649 408 B (= lượt 5, lượt 4, G7); mọi chunk dependency trùng từng byte lượt 5; không dependency đổi; không code test / công cụ trong bundle.
- Gần 2 / 3 phần bundle tăng là cụm tên nút / dòng lý do của Thùng rác (họ DR6-160, Nit): ≈ 1 787 B; lớp chống tràn tên liền dài ≈ 600 B.
- 0 thân hàm trùng ≥ 25 token; 6 nhóm trùng cấu trúc như lượt 4–5; 1 197 khóa i18n, 0 không dùng.
- Phát hiện B (Nit, không chặn, K49 không gỡ trước v1.0): CLR6-F11, F12, G1–G4 (DR6-211). Claude G ước: gộp luồn `told` / `teams` của Thùng rác thành một chỗ; chuyển `token-guard.ts` ra khỏi `packages/ui/src`; một bảng ký tự vô hình dùng chung cho test; thay hai bộ quét chữ viết tay bằng AST khi có lượt sửa tới (chi tiết và cỡ ở `claude/G.md` mục 5–6). Mặc định [sau v1.0] (Q7).

## 8. Kế hoạch xử lý

1. **Owner trả lời §9** (Q1–Q5 cách sửa, Q6, Q7).
2. **Đợt sửa:** 5 Issue (T-390…T-394), mỗi Issue một DR6 chặn, theo T-386. DR6-180 qua cổng G5 trước khi code. Bốn Issue trục D (DR6-178, 179, 181, 182) độc lập nhau, chạy được qua pipeline `auto-issues` (K45). Không có Medium trở lên → không có Issue `gate` review lại vùng (§L6.10).
3. **PR sổ** (không cần review): 30 DR6 không chặn vào OPEN của `docs/state/review-notes.md`, nhãn **[sau v1.0]**, mỗi họ một mục; phần DR6-182 để ngoài cũng vào sổ. Mục Owner kéo vào ở Q6 mang nhãn `[T-… #…]` thay.
4. **G7** (§L6.10 "Rồi G7"): exe phát hành ở `main` sau đợt sửa; nghiệm thu lại các dòng NT có màn / hành vi đổi (6b / 6h / 6f người phối hợp, 6c / 6f ghi chú, Xuất backup, khôi phục lịch hẹn ở Thùng rác; K46), cùng NT-HD-01; chụp lại ảnh hướng dẫn có màn đổi; NT-EV-01 (eval AI thật, Owner bấm, G4) với version prompt cuối (`@6` nếu Q3 (a)); cổng và probe so mốc sau #656. Lỗi G7 tìm ra xếp theo K48; đóng băng K49 giữ tới phát hành.

### 8.1 Issue sửa đã tạo (08/11)

| Issue | DR6 | Việc | Rủi ro | Ngân sách |
|---|---|---|---|---|
| #1134 T-390 | DR6-178 | Đồng hồ của DB không lặp / không lùi trong một lần mở; luật nhập: hai transition của cùng lịch hẹn không cùng `deleted_at` | med | ≈ 15–25 SP + 40–70 test |
| #1135 T-391 | DR6-179 | Xuất backup từ chối khi quá 100 MB, câu riêng chỉ bản `.db` | low | ≈ 10–15 SP + 15–25 test |
| #1136 T-392 | DR6-180 | V3 / V6 chặn mã và tên luật trong ngoặc; `analysis@6` / `discovery@6`; Owner duyệt G5 ở PR | med | ≈ 2–4 SP + 6–10 test + G5 |
| #1137 T-393 | DR6-181 | Ô người phối hợp chỉ thêm khi bấm "Thêm"; `aria-live`; dòng "Lệch mockup đã biết" | low | ≈ 10–20 SP + 15–25 e2e |
| #1138 T-394 | DR6-182 | Ô ghi chú 6c / 6f là `textarea` khi chữ có xuống dòng | low | ≈ 2–4 SP + 15–25 e2e |

Năm Issue độc lập nhau, nhãn `ready-for-agent`; Owner 08/11 chọn chạy qua pipeline `auto-issues`, sau PR tổng hợp này.

**Giảm dòng code trước G7** (Owner 08/11, sau §9: "Làm trước G7" cho DR6-211; ngoại lệ K49, `PROJECT-STATE.md`). Chạy sau năm Issue trên:

| Issue | Phần của DR6-211 | Việc | Rủi ro | Ngân sách (ròng) |
|---|---|---|---|---|
| #1140 T-395 | CLR6-G1 | Thùng rác một chỗ đặt tên thay `told` / `teams` luồn tay; chữ giữ từng byte | med | SP −20…−40, test −60…−90 |
| #1141 T-396 | CLR6-G2, F12 | Chuyển `token-guard` sang `packages/ui/scripts/`; bỏ `globals` ESLint vô tác dụng | low | SP −226 (sang công cụ), cấu hình ≤ 0 |
| #1142 T-397 | CLR6-G3, F11 | Ma trận ký tự vô hình chỉ ở test hàm chung; một bản `openProfile` / `pickTeam` | low | test −55…−75, SP 0 |

**CLR6-G4 để [sau v1.0]:** phần capability cần thêm bước kiểm quyền trên exe vào job build của CI ngay trước khi phát hành (công cụ mới trong đóng băng), số dòng ròng chỉ ≈ −20…−50; phần bộ chặn ký hiệu là sửa CLR6-D1, không giảm dòng. Tổng ba Issue: SP sản phẩm thật ≈ −20…−40 dòng (cộng 226 dòng chuyển sang công cụ), test ≈ −115…−165 dòng; bundle ≈ −0,3…−0,5 KB; exe không đổi.

## 9. Câu hỏi cho Owner

**Owner trả lời 08/11/2026: "Chọn như ghi"** — cả bảy câu theo đề xuất: Q1 (a), Q2 (a), Q3 (a), Q4 (a), Q5 (a); Q6 không kéo vấn đề nào; Q7 [sau v1.0]. Issue ở §8.1. **Sau đó cùng ngày, Owner đổi Q7: "Làm trước G7"** (ngoại lệ K49): G1, G2, G3, F11, F12 thành ba Issue #1140–#1142; G4 vẫn [sau v1.0] (§8.1).

Mỗi câu một lựa chọn; đề xuất của tổng hợp ghi trước.

- **Q1 — DR6-178 (khôi phục theo mốc xóa):** (a) **[đề xuất]** đồng hồ của DB không lặp / không lùi trong một lần mở + luật nhập "hai transition của cùng lịch hẹn không cùng `deleted_at`": một chỗ, đóng cả họ, không đổi schema, ≈ 15–25 SP; (b) lưu id transition bị rút cùng bản ghi xóa: chặt nhất nhưng thêm cột, migration, luật nhập, ≈ 40–90 SP.
- **Q2 — DR6-179 (trần backup):** (a) **[đề xuất]** xuất từ chối khi quá 100 MB, không ghi file, câu riêng chỉ bản `.db` trong `backups\`; (b) xuất vẫn ghi, cảnh báo không nhập lại được; (c) nâng trần nhập.
- **Q3 — DR6-180 (G5):** (a) **[đề xuất]** sửa hai regex, `analysis@6` / `discovery@6`, thêm ca §8.5 (Owner duyệt G5 ở PR sửa); (b) ghi hai dạng vào phần "Mất" của G5 → ACCEPTED, không sửa code.
- **Q4 — DR6-181 (ô "+ thêm" người phối hợp):** (a) **[đề xuất]** giữ lựa chọn trong state, thêm bằng nút "Thêm", `aria-live` báo đã thêm ai; ghi "Lệch mockup đã biết" cho nút; (b) giữ ô như nay, bỏ qua `change` do phím điều hướng trên ô đang đóng.
- **Q5 — DR6-182 (ô ghi chú 6c / 6f):** (a) **[đề xuất]** ô là `textarea` khi chữ đang có xuống dòng, mockup giữ ở ca thường; (b) luôn `textarea`.
- **Q6 — Kéo vấn đề không chặn vào đợt sửa:** mặc định **không**. Nếu kéo, tổng hợp gợi ý xét trước: DR6-185 (RE trùng tên: bản ghi có thể gắn nhầm người mà không ai nhận ra), DR6-191 (Excel hỏng file), DR6-200 (Nạp lại chồng Nhập backup).
- **Q7 — Đề xuất gỡ / gộp của phiên G và gói F (DR6-211):** mặc định **[sau v1.0]** (K49).

## 10. Kiểm độc lập và tuân thủ quy trình

### 10.1 Kiểm bằng log phiên (§L6.10, §L5.10, §L4.10)

Script của phiên tổng hợp đọc mọi lệnh gọi công cụ (cả của subagent / agent phụ) và quét theo danh sách: thư mục `-r6` của bên khác; thư mục lượt 1–5; liệt kê / tìm kiếm trên `C:\workspace`, `deep-review-1-6*\`; `icacls`, `takeown`, `Set-Acl`, `dot2.mjs`; `gh` và công cụ repo gọi GitHub; mạng ngoài 127.0.0.1 / localhost; dữ liệu của bên khác (`.codex`, `.claude*\projects`, `file-history`, `%APPDATA%\Claude`, `.workbuddy*`); Credential Manager; `eval:ai`; `git` ghi; `pnpm`; WorkBuddy: `node` / vitest / Playwright không đặt `C:\Program Files\nodejs` trong cùng lệnh (quy tắc riêng 8), agent phụ không kèm quy tắc; Claude: `model` / `effort` của mọi lần gọi Agent, Workflow, subagent gọi subagent, tin giao việc có đường dẫn `prompt-claude.md`. Mọi chỗ khớp được đọc lại bằng tay.

| Bên | Log | Phiên | Kết quả |
|---|---|---|---|
| Claude | `.claude\projects\C--workspace-Project-2C-review\*.jsonl` sửa sau mốc `baseline`, cả `<id>\subagents\` | 9 phiên gói / chủ đề; 1 874 lệnh phiên chính, 1 946 lệnh subagent | Lệnh đầu của 9 phiên: đọc `prompt-claude.md`. 14 lần gọi Agent (A, C, D, E, H mỗi phiên 2; F 4): `opus` ×13, `sonnet` ×1, cả 14 `effort: xhigh`, `general-purpose`, tin giao việc có đường dẫn `prompt-claude.md`; 0 Workflow, 0 subagent gọi subagent. Thư mục lượt cũ: chỉ probe lượt 5 của chính Claude, chép theo danh sách tên file (không liệt kê). Các chỗ khớp còn lại là chữ trong probe / báo cáo / lời cấm của tin giao việc, hay `curl` / `Invoke-WebRequest` tới 127.0.0.1 / localhost. Claude B chạy `pnpm` 12.6.0 (bản cache của Corepack) trên workspace giả ngoài repo để thử chuyển tiếp đối số (CLR6-B1). **0 vi phạm.** |
| Claude (khác) | cùng thư mục | `d246be5e-…`, `97e7a9bd-…` (review PR #1127, #1128) | Bản ghi 07/11 09:39–09:59, trước mốc `baseline` (11:41); giờ sửa file 19:58 là bản ghi `last-prompt` / `cost-state` lúc tiến trình thoát. Không thuộc lượt 6. |
| Codex | `.codex\sessions\2026\11\07\rollout-*.jsonl` | 6 phiên gói (488 lệnh) + 9 rollout phụ 0 lệnh | Lệnh đầu đọc `prompt-codex.md`. 0 `pnpm` (chữ "pnpm" chỉ ở lời giải thích xin chạy ngoài sandbox), 0 `gh`, 0 đọc chéo, 0 mạng ngoài. Một số lệnh xin `require_escalated` (chạy ngoài sandbox của Codex, qua cơ chế xin quyền của app) để dựng bản web / chạy vitest, kèm lời giải thích "không dùng pnpm hay mạng". **0 vi phạm.** |
| WorkBuddy | bản chép `workbuddy\<gói>\session\` (§10.2) | 7 phiên gói (B hai phiên); 878 lệnh + 205 lệnh của 4 agent phụ (A) | Lệnh đầu đọc `prompt-workbuddy.md`. Agent phụ (chỉ A): 4 tin giao việc đều kèm khối quy tắc (gồm quy tắc Node). Vá rồi trả file trong worktree (B `persist-queue.ts`, D, E `trash-view.ts`) theo quy tắc chung 1; `Project-2C-review` sạch lúc đóng. F `pnpm build:web` có đặt PATH (ghi `apps/desktop/dist` bị ignore). **Lệch quy tắc riêng 8: 2 lệnh** `node -e` không đặt PATH, chỉ đọc `scripts` của `package.json` (B, F); Node trần v22.22.2 không đổi kết quả. 0 `gh`, 0 mạng ngoài, 0 đọc thư mục bị chặn. |

Quét mẫu key (`sk-…`, `gh[opsu]_…`, `github_pat_…`, `Bearer …`) trên 21 báo cáo, ba file chung và log WorkBuddy: 0 chỗ.

### 10.2 Lệch quy trình của đợt 2 (ghi ở `common-baseline.md` "Bước 7")

- **Model WorkBuddy:** Owner chọn Hy4 cho A–F (07/11 23:35). Log: A và phiên B bị cắt chạy `hy4-free`; phiên B làm tiếp và C–F chạy `deepseek-v4.1-flash-sg`. Báo cáo B, C, D, F ghi "ngữ cảnh phiên ghi `Deepseek-V4.1-Flash`"; báo cáo E ghi Hy4 / `claude-opus-6`, khác log. Phiên tổng hợp chưa biết lý do đổi (Owner xác nhận khi trả lời §9). Lệch §L6.7 ("mọi gói dùng cùng model").
- **Phiên thử:** baseline ghi phiên thử chạy GLM 5.3; log cho thấy task ghi các việc 1–15 (`1026bd70-…`, 23:05–23:25) chạy `hy4-free`, task thử thứ hai (`8c2e2423-…`, 23:26–23:35) chạy `glm-5.3`.
- **Chép log phiên (7.3):** Owner bảo Claude chạy (08/11, "Em chạy giúp"), lệch lượt 4–5 (Owner chạy). Lệnh `common\copy-sessions.mjs` từ chối khi app còn chạy; chỉ đọc `<id>.jsonl` sửa sau 07/11 22:30 để nhận gói, chỉ chép `<id>.jsonl`, `tool-results\`, `subagents\`; không mở file nào khác của thư mục dữ liệu app.
- **`gh auth login` trước `remove`** (Owner, sau khi thoát app): không agent nào chạy lúc đó.
- **`scan` đợt 2 dừng ở một transcript** của phiên "review-2" có chuỗi lượt 6 từ trước mốc: Owner chấp nhận 07/11 23:00 (như lượt 5).
- **Hai đợt, ACL:** `deny` 251 mục, phiên thử kiểm mọi mục bị chặn bị từ chối; `remove` 252 mục `OK`; hash 15 báo cáo không đổi.

## 11. Ghi chú phương pháp

- **Độ sâu kiểm của tổng hợp** khác nhau theo hậu quả: vấn đề chặn và mọi phát hiện của Codex / WorkBuddy đọc lại code; phát hiện không chặn của Claude dựa vào bằng chứng probe / đột biến mà phiên gói đã chạy lại, cộng đọc code ở chỗ quyết định trục. Một phát hiện không chặn mà sai chỉ tốn một dòng sổ [sau v1.0]; sổ sẽ được xét lại sau v1.0.
- **Lượt 6 so lượt 5:** nhiều phát hiện hơn hẳn (103 so 41), có lẽ vì phiên Claude dùng subagent, có ba phiên chủ đề, và không còn chỉ tiêu "≥ 5 kịch bản"; mức không cao hơn: 0 Medium lần thứ tư liền, 43 / 103 là Nit. Ba chủ đề G, H, I ra 14 phát hiện, trong đó một vấn đề chặn (DR6-182, chủ đề H).
- **Đợt sửa lượt 5 sinh ít lỗi mới:** 0 hồi quy; phần còn hở của đợt sửa là biến thể Low / Nit (§3). Vấn đề chặn đều "có từ trước, lượt 1–5 bỏ sót".
- **Ba bên ít trùng** như lượt 4–5 (§2.3). Codex ra ít nhất nhưng tìm vấn đề chặn mà hai bên kia không thấy; WorkBuddy 15 phát hiện, đều đúng, không vấn đề chặn nào.

## Phụ lục — đối chiếu ID của từng báo cáo ↔ DR6

| ID | DR6 | ID | DR6 | ID | DR6 | ID | DR6 |
|---|---|---|---|---|---|---|---|
| CLR6-A1 | 184 | CLR6-D6 | 196 | CLR6-E12 | 194 | CLR6-H1 | 191 |
| CLR6-A2 | 203 | CLR6-D7 | 195 | CLR6-E13 | 194 | CLR6-H2 | 184 |
| CLR6-A3 | 203 | CLR6-D8 | 206 | CLR6-E14 | 187 | CLR6-H3 | 182 |
| CLR6-A4 | 203 | CLR6-D9 | 196 | CLR6-E15 | 194 | CLR6-H4 | 190 |
| CLR6-A5 | 179 | CLR6-D10 | 196 | CLR6-F1 | 184 | CLR6-H5 | 183 |
| CLR6-A6 | 202 | CLR6-D11 | 195 | CLR6-F2 | 183 | CLR6-H6 | 189 |
| CLR6-B1 | 204 | CLR6-D12 | 195 | CLR6-F3 | 208 | CLR6-H7 | 190 |
| CLR6-C1 | 180 | CLR6-D13 | 185 | CLR6-F4 | 206 | CLR6-I1 | 200 |
| CLR6-C2 | 198 | CLR6-D14 | 206 | CLR6-F5 | 206 | CLR6-I2 | 206 |
| CLR6-C3 | 195 | CLR6-D15 | 187 | CLR6-F6 | 210 | CLR6-I3 | 210 |
| CLR6-C4 | 183 | CLR6-D16 | 187 | CLR6-F7 | 210 | CXR6-A1 | 178 |
| CLR6-C5 | 205 | CLR6-D17 | 190 | CLR6-F8 | 209 | CXR6-B1 | 201 |
| CLR6-C6 | 205 | CLR6-E1 | 183 | CLR6-F9 | 209 | CXR6-C1 | 183 |
| CLR6-C7 | 205 | CLR6-E2 | 206 | CLR6-F10 | 210 | CXR6-D1 | 183 |
| CLR6-C8 | 205 | CLR6-E3 | 184 | CLR6-F11 | 211 | CXR6-D2 | 207 |
| CLR6-C9 | 205 | CLR6-E4 | 181 | CLR6-F12 | 211 | CXR6-E1 | 183 |
| CLR6-C10 | 205 | CLR6-E5 | 192 | CLR6-F13 | 210 | CXR6-E2 | 184 |
| CLR6-C11 | 212 | CLR6-E6 | 193 | CLR6-F14 | 210 | CXR6-F1 | 209 |
| CLR6-C12 | 212 | CLR6-E7 | 186 | CLR6-G1 | 211 | WBR6-A1 | 197 |
| CLR6-C13 | 184 | CLR6-E8 | 186 | CLR6-G2 | 211 | WBR6-A2 | 199 |
| CLR6-D1 | 207 | CLR6-E9 | 188 | CLR6-G3 | 211 | WBR6-A3 | 202 |
| CLR6-D2 | 207 | CLR6-E10 | 191 | CLR6-G4 | 211 | WBR6-A4 | 212 |
| CLR6-D3 | 206 | CLR6-E11 | 193 | | | WBR6-A5 | 212 |
| CLR6-D4 | 187 | | | | | WBR6-A6 | 202 |
| CLR6-D5 | 184 | | | | | WBR6-B1 | 204 |
| | | | | | | WBR6-B2 | 204 |
| | | | | | | WBR6-C1 | 205 |
| | | | | | | WBR6-C2 | 198 |
| | | | | | | WBR6-C3 | 198 |
| | | | | | | WBR6-D1 | 183 |
| | | | | | | WBR6-D2 | 206 |
| | | | | | | WBR6-E1 | 184 |
| | | | | | | WBR6-F1 | 210 |

103 dòng: Claude 80 (A 6, B 1, C 13, D 17, E 15, F 14, G 4, H 7, I 3), Codex 8, WorkBuddy 15 (A 6, B 2, C 3, D 2, E 1, F 1).
