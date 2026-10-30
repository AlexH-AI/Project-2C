# Tổng hợp deep review Phase 1–6, lượt 4 — Claude, Codex, DeepSeek (Home PC)

- **Ngày tổng hợp:** 2026-10-31 · **SHA được review:** `2e51e25` · kế hoạch `docs/process/deep-review-phase-1-6.md` §L4 (T-309 #854, Owner duyệt G1 28/10) · Issue T-318 #893 (`gate`).
- **18 báo cáo = 3 bên × 6 gói** (A lõi dữ liệu · B file và Rust · C AI · D màn nhập liệu · E lịch hẹn, chỉ số, quản lý · F xuyên gói, bloat / hiệu năng, công cụ), hai đợt trên **Home PC `DESKTOP-KDURKJP`**. Bước chuẩn bị 29/10 00:10 → 00:42. Giờ máy, lấy từ log phiên:
  - **Claude** (đợt 1, 29/10): A 01:02–02:08 · B 02:10–03:09 · C 07:29–08:23 · D 09:00–10:04 · E 10:25–11:21 · F 11:33–12:46.
  - **Codex** (đợt 1, 29/10): A 01:04–01:38 · B 02:10–02:38 · C 07:29–08:08 · D 09:00–09:43 rồi 13:44–13:54 (dừng vì hết hạn mức Codex, làm tiếp theo tin nhắn của Owner) · E 15:09–15:50 · F 20:36–21:28.
  - **DeepSeek** (đợt 2, 30/10): A 18:56–19:23 · B 19:25–19:39 · C 19:49–20:37 · D 20:58–21:27 · E 21:28–22:11 · F 22:12–23:02.
- **Reviewer:**
  - Claude Opus 5.5, mỗi gói một phiên sạch, mức `max`, ultracode tắt (không subagent / Workflow).
  - Codex (Owner chạy; Codex desktop, `codex-cli 0.162.1`). Owner chọn GPT Sol 6.1; công cụ chỉ ghi "GPT-6" và không cho biết mức suy luận.
  - DeepSeek V4.1 Flash (Owner chạy; `Deepseek-V4.1-Flash`, context 1M, Thinking effort Max) trong app desktop WorkBuddy v5.9.3, gói WorkBuddy Pro, chế độ quyền **Default**. Mỗi gói một task qua **Code review expert** của app. Tin nhắn mở mỗi gói có ngoại lệ Owner cho quy tắc riêng 4: được dùng agent phụ và Code review expert.
- **ID:** phát hiện `CLR4-<gói><số>` (Claude), `CXR4-…` (Codex), `DSR4-…` (DeepSeek); vấn đề đã gộp đánh số tiếp lượt 3: **`DR6-135…157`**.
- **Báo cáo gốc:** PR docs riêng #894 → `docs/reviews/raw/2026-10-31/{claude,codex,deepseek}/{A…F}.md` + `common-known.md`, `common-baseline.md`, `common-fixes.md`. `common\plan.md` và ba `common\prompt-*.md` trùng kế hoạch ở `2e51e25` nên không chép. Bằng chứng (probe, đột biến, ảnh, log phiên của cả ba bên) ở `C:\workspace\deep-review-1-6-r4\` trên Home PC, giữ tới phát hành v1.0.

**Cách kiểm (ADR-0001 M2, M10):** phiên tổng hợp (Claude Opus 5.5, phiên chính; Owner không bật subagent) đọc đủ 18 báo cáo. Ba bảng R1 gộp thành một bảng 37 dòng, ba bảng R2 thành một bảng 32 dòng. Phiên đối chiếu trên code ở checkout chính (`main` = `2e51e25`, sạch): các kết luận khác ĐÃ SỬA, mọi chỗ các bên chấm khác nhau, và **mọi** phát hiện mới, kể cả của Codex và DeepSeek (dữ liệu tham khảo). 34 phát hiện gộp thành 23 vấn đề, thêm 1 mục KNOWN có bằng chứng mới. Cột "Kiểm":

- ✅ đọc đúng chỗ code, khớp mô tả;
- 🔁 phiên tổng hợp tự chạy lại (probe Node trên mã của repo qua `tools/ts-hooks.mjs`);
- 📏 số đo / probe của reviewer; 🧪 đột biến của reviewer; 📄 lệch tài liệu / mockup đã duyệt.

Mức trong bảng là **mức chốt** theo thước plan §4.3, không theo mức bên đó gán. **0 phát hiện bị bác.**

## 1. Kết luận

| Bên | Kết luận ở gói F | Lý do chính |
|---|---|---|
| Claude | **CHƯA SẴN SÀNG** | 0 Critical / High / Medium; 18 phát hiện (11 Low, 7 Nit; trong đó 1 KNOWN có bằng chứng mới); DR6-37 chấm SỬA MỘT PHẦN; Owner đã chốt sửa hết |
| Codex | **CHƯA SẴN SÀNG** | 0 Critical / High / Medium; 8 Low; 37 / 37 + 32 / 32 ĐÃ SỬA; Owner đã chốt sửa hết |
| DeepSeek | **SẴN SÀNG** | 0 Critical / High / Medium; 7 Low + 1 Nit, "không chặn v1.0, nên vào sổ ghi chú"; 37 / 37 + 32 / 32 ĐÃ SỬA |

**Kết luận hợp nhất: CHƯA SẴN SÀNG cho v1.0 ở `2e51e25`.** Có hai lý do: quyết định "sau tổng hợp: sửa hết như lượt 3, rồi G7" (Owner 27/10, plan §L4.11 đề xuất 6), và một dòng R1 còn SỬA MỘT PHẦN (DR6-37). Không có Critical / High / Medium. Tiêu chí spec Phase 6 §1 mục 3 ("mọi phát hiện từ Medium trở lên đã sửa") vì vậy đạt ở `2e51e25`. Phần còn lại Owner đã quyết sửa hết: 10 nhóm (§8.2), rồi G7 trên SHA sau đợt sửa.

DeepSeek kết luận SẴN SÀNG vì không áp đề xuất 6, và không thấy chỗ còn hở của DR6-37. Như ở review Phase 5, kết luận G7 của DeepSeek sai; còn 8 phát hiện của nó đều đúng.

- **Đợt sửa sau lượt 3 không làm hỏng chỗ nào trước đó đúng: 0 HỒI QUY** (lượt 2: 3; lượt 3: 0). Mọi dòng R có test đỏ khi gỡ phần sửa. Ngoại lệ là các dòng chỉ tài liệu (đối chiếu chữ với app) và các chỗ hở đã thành phát hiện T.
- **Bảng R1 (37 dòng): 36 ĐÃ SỬA · 1 SỬA MỘT PHẦN (DR6-37) · 0 CHƯA SỬA · 0 HỒI QUY. Bảng R2 (32 Issue): 32 ĐÃ SỬA** (§3).
  - DR6-37 chỉ Claude thấy. Dòng "{trường}: {giá trị}" của thẻ Dữ kiện KYC, vị trí đầu tiên mà L·CL-D5 lượt 1 nêu, vẫn viết dấu `: ` thẳng trong JSX. Issue #790 mục 3 không liệt kê vị trí này, nên Codex và DeepSeek chấm ĐÃ SỬA theo danh sách của Issue (§3.1). Phần còn: DR6-145.
- **Phát hiện mới: 34 (Claude 18, Codex 8, DeepSeek 8) → 23 vấn đề `DR6-135…157`: 0 Medium · 17 Low · 6 Nit**, thêm 1 mục KNOWN có bằng chứng mới (CLR4-F2, K1; §8.4).
  - 9 vấn đề mới do đợt sửa sau lượt 3 (135, 136, 139, 143, 144, 146, 147, 153, 155); 14 có từ trước, lượt 1–3 bỏ sót.
  - Ba mục chênh mức: CLR4-D2 Nit → Low, CXR4-F2 Low → Nit, DSR4-E1 Low → Nit (§5.1).
  - Một phát hiện P: DR6-136 (`byName`). Sắp bảng Lịch hẹn chậm đi quá mức luật nhiễu cho phép, nhưng vẫn dưới ngưỡng 200 ms.
- **Ba bên bổ sung nhau** (§2.2): Claude thấy 15 / 23 vấn đề, DeepSeek 8, Codex 5. Mỗi bên có vấn đề chỉ mình thấy:
  - Claude 10;
  - DeepSeek 5: đóng app giữa lúc `flush()` chờ, NUL lọt V3–V6, ô chọn khác mockup, `size-report` đếm file `.sqlite` của e2e, listener của `AppData`;
  - Codex 3: tên liền dài tràn khung ở bốn màn, nhãn model nhận UTF-16 hỏng, glob cấp package của `notes-core`.
- **Số đo (§7):** so mốc Home PC sau #656, không dòng nào ⚠️; mọi thao tác trong ngưỡng `phase-6.md`. Mở lần đầu LCP 3 521 ms (mốc 3 663), Dọn sạch 123,3 ms (≤ 500).
  - `backup.read` +142 ms so mốc là số của hai ngày đo khác nhau. Đo theo cặp cùng lúc thì +55 ms (+6,9 %): chi phí có chủ ý của luật nhập 7 (K33).
- **Kiểm log phiên (§10):** không nhiễm, không vi phạm chỉ đọc. Lệnh đầu của cả 18 phiên gói chỉ đọc file prompt. Phiên gói của DeepSeek không lần nào bị ACL từ chối, tức không thử mở chỗ bị chặn.
- **Còn trước G7:**
  - Owner trả lời §9 (4 câu, đều là chọn cách sửa); rồi đợt sửa lượt 4: 10 Issue theo §8.2, ≈ 185–350 dòng SP + ≈ 700 dòng test, phần lớn là test.
  - Các điều kiện ngoài review (spec §1 mục 2, 4): nghiệm thu trên exe phát hành; eval AI thật (NT-EV-01) với version prompt sau đợt sửa; chụp lại ảnh hướng dẫn mà đợt sửa đổi màn; cổng trên SHA phát hành.

## 2. Số liệu

### 2.1 Theo báo cáo (mức do chính bên đó gán)

| Bên | Phát hiện | Low / Nit | KNOWN có bằng chứng mới | PLAUSIBLE | Bảng R của bên | Kịch bản mới | Đột biến (bị giết / tổng) | Lệnh công cụ (log) | Thời gian (log) |
|---|---|---|---|---|---|---|---|---|---|
| Claude | 18 (A 2 · B 3 · C 3 · D 3 · E 5 · F 2) | 11 / 7 | 1 (F2) | 0 | R1 36 ĐÃ SỬA · 1 SỬA MỘT PHẦN (DR6-37); R2 32 ĐÃ SỬA | 87 (A 16 · B 22 · C 12 · D 12 · E 13 · F 12) | 307 / 333 (A 77 / 80 · B 50 / 61 · C 38 / 42 · D 48 / 52 · E 51 / 54 · F 43 / 44) | 1 561 | ≈ 6 h 13 (55–73 phút mỗi gói) |
| Codex | 8 (A 1 · B 0 · C 1 · D 2 · E 2 · F 2) | 8 / 0 | 0 | 0 | 37 + 32 ĐÃ SỬA | ≈ 63 (9–11 mỗi gói) | 139 / 144 (A 37 / 37 · B 14 / 15 · C 19 / 20 · D 27 / 27 · E 23 / 25 · F 19 / 20) | 494 | ≈ 4 h 05 (28–52 phút mỗi gói; D dừng 4 h vì hết hạn mức) |
| DeepSeek | 8 (A 1 · B 2 · C 1 · D 2 · E 1 · F 1) | 7 / 1 | 0 | 0 | 37 + 32 ĐÃ SỬA | 59 (A 10 · B 10 · C 9 · D 10 · E 10 · F 10) | 95 / 97 (A 29 / 30 · B 10 / 10 · C 12 / 13 · D 18 / 18 · E 11 / 11 · F 15 / 15) | 943 | ≈ 3 h 32 (14–50 phút mỗi gói) |

- Chỉ tiêu ≥ 5 kịch bản mới mỗi gói (gói F ≥ 5 chuỗi nhiều bước qua nhiều gói) đạt ở cả 18 báo cáo.
- Đột biến sống không tương đương đều thành phát hiện T: Claude A1, B1–B3, D2, E4, F1; Codex F2. Các đột biến sống còn lại có lý do ghi trong báo cáo (tương đương, hay test ở gói khác giữ).
- Cách đếm đột biến mỗi bên một khác (Claude đếm cả đột biến e2e và cấu hình lint; Codex tách đột biến hành vi khỏi phép kiểm cấu trúc), nên chỉ so được độ dày, không so được tỉ lệ.

### 2.2 Theo vấn đề đã gộp (23) — bảng so ba bên

Cách đếm như review Phase 5 (`2026-10-10-danh-gia-deepseek-muse.md` §2): một bên được tính là thấy DR6-xx nếu có ít nhất một phát hiện mô tả đúng vấn đề đó (cột "Ai thấy" ở §6).

| Chỉ số | Claude Opus 5.5 | Codex GPT Sol 6.1 | DeepSeek V4.1 Flash |
|---|---|---|---|
| Phát hiện mới (bên đó gán M / L / N) | 18 (0 / 11 / 7) | 8 (0 / 8 / 0) | 8 (0 / 7 / 1) |
| Phát hiện bị bác (sai) | 0 | 0 | 0 |
| Vấn đề thấy / 23 | **15 (65 %)** | 5 (22 %) | 8 (35 %) |
| Chỉ mình thấy | **10** | 3 | 5 |
| Thấy cùng bên khác | 5 (136, 141, 145, 151, 155) | 2 (141, 155) | 3 (136, 145, 151) |
| Dòng R chấm khác chốt | 0 | 1 (DR6-37) | 1 (DR6-37); DR6-118 kết luận bằng đọc code, không dựng bản web như quy tắc chung 6 |
| Chênh mức khi kiểm | 1 / 18 (D2 lên) | 1 / 8 (F2 xuống) | 1 / 8 (E1 xuống) |
| PLAUSIBLE | 0 | 0 | 0 |
| KNOWN có bằng chứng mới | 1 (F2: luật T-291 gặp dữ liệu exe lượt 3 ghi) | 0 | 0 |
| Kết luận G7 | CHƯA (đúng) | CHƯA (đúng) | SẴN SÀNG (sai: không áp "sửa hết", bỏ sót DR6-37) |
| Thời gian A–F (log) | ≈ 6 h 13 | ≈ 4 h 05 làm việc (đồng hồ 01:04 → 21:28, D dừng 4 h) | ≈ 3 h 32 (18:56 → 23:02) |
| Owner can thiệp trong phiên | mở 6 phiên | mở 6 phiên; 1 lần "tiếp tục" sau khi hết hạn mức (D) | mở 6 task qua expert; app ghi 14 lần "Sandbox bypassed (escalation-approved)" ở lệnh Playwright (D 5, E 6, F 3) |
| Token (log) | không đo | không đo | ra 591 729 (suy luận 323 350) qua 867 lượt; đầu vào một lượt tới 462 000, 99,2 % trúng cache |
| Tốc độ ra token | — | — | 116,9 token/s chung; 119,5–151,0 ở lượt ≥ 200 token (§2.3) |
| Chi phí | gói Claude của Owner | gói Codex của Owner | không ghi credit (Owner): V4.1 Flash tính 0.00x tới hết 31/10; credit tặng lúc bắt đầu 380 |
| Tuân thủ "chỉ đọc" | đạt (C vá worktree rồi trả nguyên byte, kiểm sha256) | đạt (chạy bản chép) | đạt (A–F vá rồi trả trong cùng lệnh, kiểm sha256 / `git status`; B thêm hai file test tạm rồi xóa) |
| Tuân thủ độc lập | đạt | đạt | đạt ở A–F (ACL); phiên thử 1, chạy trước khi đặt ACL, đọc dòng đầu hai báo cáo gói A (§10.1) |

- **Claude** vẫn là bên thấy nhiều nhất (như lượt 2–3), nhất là test hở và chỗ nối TSX ↔ hành vi (focus, hộp đóng app, hộp xác nhận đang chạy).
- **DeepSeek** thấy 5 vấn đề không bên nào thấy, ở cả lõi lẫn công cụ, trong ≈ 3,5 h, không phát hiện sai. Điểm yếu:
  - kết luận G7 bỏ qua quyết định của Owner mà prompt dẫn tới;
  - một dòng R kết luận bằng đọc code;
  - số đo hiệu năng của gói A dùng Node 22 bản của app (repo đòi Node 24), không so được với mốc.
- **Codex** có ít phát hiện nhất nhưng là bên duy nhất dựng tên liền dài trên bốn màn còn lại. Ba vấn đề chỉ Codex thấy đều có từ trước.
- So review Phase 5 (cùng DeepSeek V4.1 Flash, qua OpenCode): 8 / 8 đúng (Phase 5: 21 / 22); lần này tuân thủ độc lập đạt nhờ ACL.

### 2.3 Tốc độ ra token của DeepSeek (`common\ds-tps.mjs`)

Đo lại cả 6 gói trên log Owner đã chép ra (`deepseek\<gói>\session\`). Một lượt tính từ đầu vào cuối cùng model nhận (tin nhắn hay kết quả công cụ) tới bản ghi có số token cuối của lượt. Vì gồm cả độ trễ đầu lượt, "TPS chung" thấp hơn tốc độ sinh thật; cột "lượt ≥ 200 token" ít lệch hơn. Số Claude đo giữa đợt 2 là của phiên `32562b99-…`, tức gói B, không phải gói A (`baseline.md`, đính chính ở bước 7).

| Gói | Log (giờ VN) | Lượt | Token ra (suy luận) | Đầu vào lớn nhất | TPS chung | Trung vị theo lượt | TPS lượt ≥ 200 token (số lượt) |
|---|---|---:|---:|---:|---:|---:|---|
| A | 18:56:14 → 19:23:48 (27,6′) | 179 | 111 861 (51 177) | 461 950 | 114,2 | 67,4 | 139,9 (100) |
| B | 19:25:03 → 19:39:02 (14,0′) | 83 | 85 034 (56 226) | 362 086 | 133,9 | 111,4 | 144,7 (63) |
| C | 19:49:29 → 20:37:53 (48,4′) | 95 | 89 376 (52 888) | 356 918 | 133,6 | 81,2 | 151,0 (60) |
| D | 20:58:20 → 21:27:41 (29,4′) | 182 | 117 800 (64 551) | 457 406 | 113,1 | 84,7 | 125,9 (131) |
| E | 21:28:56 → 22:11:35 (42,6′) | 184 | 101 830 (57 946) | 423 100 | 105,7 | 80,4 | 119,5 (127) |
| F | 22:12:45 → 23:02:38 (49,9′) | 144 | 85 828 (40 562) | 411 875 | 110,9 | 68,7 | 132,7 (87) |
| **Cả 6 gói** | 211,9′ | 867 | 591 729 (323 350) | — | **116,9** (5 063 s các lượt) | — | — |

Phần lớn thời gian của DeepSeek không nằm ở sinh token. Tổng thời gian các lượt là 84 phút trên 212 phút log; phần còn lại là chạy lệnh (vitest, cargo, Playwright) và chờ app.

## 3. Bảng R gộp

### 3.1 Chỗ các bên chấm khác nhau

| DR6 | Claude | Codex | DeepSeek | Chốt | Kiểm | Lý do |
|---|---|---|---|---|---|---|
| 37 | SỬA MỘT PHẦN | ĐÃ SỬA | ĐÃ SỬA | **SỬA MỘT PHẦN** | ✅ 📄 | Mô tả DR6-37 (tổng hợp lượt 1, dòng 37) là "dấu nối / ký hiệu viết cứng trong JSX (`', '`, `'; '`, `—`, `×`, `▾`) thay `sep.*`", gộp từ L·CL-D5 và L·CL-E5. Vị trí đầu tiên của L·CL-D5 là "{trường}: {giá trị}" của thẻ Dữ kiện KYC (`CustomerKyc.tsx:84` ở `8855345`). Issue #790 mục 3 chỉ liệt kê ✓ / ○ và hai `join(', ')` của thẻ KYC, × của hộp lịch hẹn, ▾ / ▸ của So sánh team. `CustomerKyc.tsx:95` ở `2e51e25` vẫn là `` {t(`kycField.${fact.field}`)}: {factText(…)} ``. Codex, DeepSeek kiểm theo danh sách của Issue nên không thấy. Như DR6-69 lượt 3: dòng R là SỬA MỘT PHẦN, phần còn thành vấn đề mới (DR6-145, gộp với hai lỗ của bộ chặn) |
| 118 | ĐÃ SỬA | ĐÃ SỬA | ĐÃ SỬA (đọc code) | **ĐÃ SỬA** | 📏 🧪 | Cùng kết luận, khác độ chắc. Claude C, Codex C dựng bản web: panel và khối AI của lịch hẹn không tràn (0 px ở 1 100 / 1 280 / 1 440), gỡ `wrap-anywhere` thì e2e đỏ (E118a, E118b; M118). DeepSeek C tự ghi "không dựng bản web cho dòng này", trái quy tắc chung 6 của prompt ("không có môi trường DOM thì dựng bản build, không dừng ở PLAUSIBLE"). Chốt theo bằng chứng của hai bên kia |

### 3.2 Bảng R1 đủ 37 dòng

ĐS = ĐÃ SỬA, SMP = SỬA MỘT PHẦN. "Gói" là gói kiểm (gói đầu là gói chính, `known.md` phần 4). Cột cuối là vấn đề lượt 4 liên quan (biến thể còn hở ghi thành vấn đề riêng; dòng R giữ ĐÃ SỬA khi phần mô tả của DR6 đã hết, như thước §L4.4).

| DR6 | Mức L3 | Issue → PR | Gói | Claude | Codex | DeepSeek | **Chốt** | Bằng chứng chính (lượt 4) | Lượt 4 |
|---|---|---|---|---|---|---|---|---|---|
| 104 | L | #720 → #740 (+ #850 → #857) | A | ĐS | ĐS | ĐS | **ĐS** | Tái hiện lượt 3 nay `TRANSITION_BEFORE_LATEST`; gỡ chặn E7 → 3 test đỏ (cả ba bên); E7 cùng ngày vẫn khôi phục được (đúng TR-3) | — |
| 105 | L | #720 → #740 (+ #781 → #830) | A | ĐS | ĐS | ĐS | **ĐS** | Mốc khác dạng app ghi → `BACKUP_INVALID`; bỏ `precision: 3` → 3–4 test `backup` đỏ. DR6-69 kiểm qua dòng này | — |
| 106 | N | #720 → #740 | A | ĐS | ĐS | ĐS | **ĐS** | R rồi X được, X rồi R bị chặn; câu TR-3 có ở spec; ép đưa lại bằng chuyển nhóm mới → 4–5 test đỏ | — |
| 107 | L | #721 → #738 | A | ĐS | ĐS | ĐS | **ĐS** | U+FEFF đầu chuỗi → `BACKUP_INVALID`; gỡ → 5 test đỏ | 137 (nhãn model) |
| 108 | L | #721 → #738 | A, C | ĐS | ĐS | ĐS | **ĐS** | Nửa surrogate → U+FFFD, đuôi giữ, xuất / nhập lại được (C đi qua `openAppData` → `recordAiAnalysis`); gỡ → test đỏ | — |
| 109 | L | #721 → #738 | D | ĐS | ĐS | ĐS | **ĐS** | 5c / 9a / 9c / 7a gửi chữ gốc, lệnh từ chối `INVALID_TEXT`; chuẩn hóa trước lệnh ở 5a, 7a → e2e đỏ | 146 (a) (đường 5c) |
| 110 | L | #721 → #738 | A, D, E | ĐS | ĐS | ĐS | **ĐS** | Tiền / ngày dán kèm ký tự vô hình đọc đúng ở lệnh và màn; bỏ `normalizeText` → 11–14 test `money`, 6 test `period` đỏ | 150 (ô Case size) |
| 111 | L | #721 → #738 (+ #728 → #762) | A, C | ĐS | ĐS | ĐS | **ĐS** | `\p{Cc}` bị bỏ; C0 / C1 chen giữa cụm bị V3 chặn (Codex quét 58 ký tự); gỡ → 3 test `text` đỏ | 142 (NUL ở V3–V6) |
| 112 | N | #721 → #738 (+ #780 → #828) | A | ĐS | ĐS | ĐS | **ĐS** | `byName` không còn hòa; gỡ phân xử → 3 test đỏ; 500 000 bộ ba không có chu trình (Codex) | 136 (chi phí) |
| 113 | L | #722 → #742 (+ #776 → #805) | A | ĐS | ĐS | ĐS | **ĐS** | `recursive_triggers` bật sau mở / `export()` / dọn; gỡ → test REPLACE đỏ | — |
| 114 | N | #722 → #742, #776 → #805 | A | ĐS | ĐS | ĐS | **ĐS** | Một `PERSON_REFERENCES` / `POINTS_TO`; bỏ người đánh giá / người phối hợp → 2–11 test đỏ | — |
| 115 | L | #723 → #744 (+ #788 → #841) | D | ĐS | ĐS | ĐS | **ĐS** | Câu 9b đúng hành vi khôi phục / dọn sạch (4 KH xóa có lịch, Codex); gỡ → 3 test đỏ | — |
| 116 | L | #723 → #744 (+ #788 → #841) | D | ĐS | ĐS | ĐS | **ĐS** | Focus về tiêu đề (lượt 3: `BODY` ×4); gỡ đích dự phòng → e2e đỏ | — |
| 117 | L | #724 → #746 | D | ĐS | ĐS | ĐS | **ĐS** | Tên KH 81 chữ liền, ghi chú link, 7a / 7c / 7d không tràn ở 1 440 / 1 100; gỡ → e2e đỏ | 148 (bốn màn khác) |
| 118 | L | #724 → #746 | C | ĐS | ĐS | ĐS (đọc code) | **ĐS** | §3.1 | — |
| 119 | N | #725 → #748 (+ #785 → #833) | E | ĐS | ĐS | ĐS | **ĐS** | Tái hiện lượt 3 ra tên khác nhau; bỏ FYP / huy hiệu khỏi tên → test đỏ | 151 |
| 120 | L | #726 → #750, #752 → #764 (+ #782 → #807, #783 → #817) | B, D | ĐS | ĐS | ĐS | **ĐS** | Rust + exe (ACL cấm ghi, chỉ đọc giữa phiên, thư mục cấm tạo file) đúng nguyên nhân; câu dải / hộp theo nguyên nhân; 10 / 10 đột biến Rust, gỡ ánh xạ → 2–3 test đỏ | 147 |
| 121 | L | #727 → #753, #778 → #809, #777 → #812 | C | ĐS | ĐS | ĐS | **ĐS** | 14 câu sai của lượt 3 → 0 đề xuất; 3 551 / 5 672 ghi chú thật không đổi đề xuất; trả thuật toán về `119e2e4` → 142 / 415 test đỏ (Codex) | 141 |
| 122 | L | #728 → #762, #766 | C | ĐS | ĐS | ĐS | **ĐS** | 15 biến thể dấu viết rời bị V3 / V6 chặn; giữ dấu lạc → 16 test đỏ | — |
| 123 | L | #728 → #762, #766 (+ VT / FF #780 → #828) | C | ĐS | ĐS | ĐS | **ĐS** | Tin nhắn dán lại với CR, LF, U+0085 / U+2028 / U+2029, VT / FF đều `OWN_MESSAGE`, không tốn lần thử; quay về CR / LF → 13 test đỏ | — |
| 124 | N | #728 → #762, #766 | C | ĐS | ĐS | ĐS | **ĐS** | Câu thường qua ("khách am hiểu", "định luật Pareto", "giới luật Phật giáo"); bỏ danh sách đóng / miễn "giới" → test đỏ | 143 ("môi giới Luật …") |
| 125 | L | #722 → #742 | A | ĐS | ĐS | ĐS | **ĐS** | 18 đột biến tập giữ lại / D3 / D11 / đếm SYSTEM bị giết (Claude); đột biến của Codex, DeepSeek cũng bị giết | — |
| 126 | L | #720 → #740, #721 → #738, #722 → #742 | A | ĐS | ĐS | ĐS | **ĐS** | Đột biến (a)–(f) của lượt 3, viết lại trên code ghim, đều bị giết | — |
| 127 | L | #724 → #746 | D | ĐS | ĐS | ĐS | **ĐS** | Gỡ `wrap-anywhere` dòng cuộc gặp → `customer-kyc.spec.ts:114` đỏ (tràn 185 px) | — |
| 128 | L | #725 → #748 (+ #785 → #833) | E | ĐS | ĐS | ĐS | **ĐS** | Đột biến sống lượt 3 (R84e–j, R04g-tsx) nay bị giết; Codex 7 / 7 | 154 |
| 129 | L | #719 → #736 (+ #772 → #792, #793 → #815) | F | ĐS | ĐS | ĐS | **ĐS** | `full-cycle.spec.ts` bắt đầu 23:59:44 giờ trình duyệt (Bogota): bản repo xanh, bản chép bỏ đồng hồ trang đỏ đúng chữ lượt 3 (Claude); bỏ `clock.install` → `fixtures.spec.ts` đỏ (cả ba); cổng bước chuẩn bị 308 e2e không flaky | — |
| 130 | N | #719 → #736 | F | ĐS | ĐS | ĐS | **ĐS** | T61f, T61k (sống ở lượt 3) nay bị giết; U+2028 trong mục, ngoặc nhiều nhóm | 156 (glob cấp package) |
| 131 | N | #729 → #755 (+ #756 → #758) | E | ĐS | ĐS | ĐS | **ĐS** (tài liệu) | Mockup 6d và NT-LH-25 ghi "1,234 tr = 1.234.000.000 ₫", khớp `parseVnd` | — |
| 132 | N | #729 → #755 (a), #722 → #742 (b) (+ #756 → #758) | D, A | ĐS | ĐS | ĐS | **ĐS** | (a) câu dọn sạch ở `CONTEXT.md`, spec, hướng dẫn, mockup; (b) `packages/db/CLAUDE.md` nêu trigger 0011 đọc `customers` | — |
| 133 | N | #729 → #755 (+ #728 → #766) | C | ĐS | ĐS | ĐS | **ĐS** (tài liệu) | `06-ai.md:49` lấy ví dụ `discovery@4` = `PROMPT_VERSIONS` | — |
| 134 | N | #720 → #740 (+ #775 → #804) | A, E | ĐS | ĐS | ĐS | **ĐS** | Một `stagesOfDay` cho lệnh, luật nhập, 6c–6f; gỡ → test đỏ (A, E); 343 tổ hợp cũ ↔ mới trùng (Codex) | — |
| 25 | L | #781 → #830 (+ #831 → #837) | C, A, F | ĐS | ĐS | ĐS | **ĐS** | `dep-zod` 89 716 → 27 220 B; dựng lại cùng SHA mà đọc `zod` đầy đủ thì +62 589 B (Claude F). `zod` ↔ `zod/mini` 0 khác (A 400 000 đầu vào; C 60 000 / 4 500 ca); luật lint chặn `zod` đầy đủ | — |
| 37 | N | #655 → #693 (một phần), #790 → #845 | D, E | **SMP** | ĐS | ĐS | **SMP** | §3.1. Phần E hết: bộ chặn bắt 6 / 6 ký hiệu đặt lại | **145** |
| 66 | N | #655 → #693, #775 → #801, #777 → #812, #790 → #845 | F, A, C, D, E | ĐS | ĐS | ĐS | **ĐS** | Mọi tên của DR6-66 lượt 1 → 0 dòng `git grep`; codemap / tsc giết đột biến export | 152 (`PURGE_REMINDER`, ngoài danh sách DR6-66) |
| 67 | N | #774 → #799, #775 → #801, #777 → #812, #782 → #807, #790 → #845 | F, A–E | ĐS | ĐS | ĐS | **ĐS** | Chỗ lặp ≥ 3 nơi của từng gói đã gộp; thân hàm trùng nguyên văn toàn repo 0 nhóm (lượt 3: 1); refactor không đổi hành vi | 138 (b) (`backup_names` viết lại ở #807) |
| CL3-A29 | N | #722 → #742, #776 → #805 | A, F | ĐS | ĐS | ĐS | **ĐS** | `KEPT_APPOINTMENTS` 4,475 → 0,076 ms, plan dùng chỉ mục `0012`; `listTrash` cặp xen kẽ −7 / −8 ms; gỡ chỉ mục / nhánh Thùng rác trống → test đỏ | — |
| CL3-B2 | N | #783 → #817 | B, D, E | ĐS | ĐS | ĐS | **ĐS** | Chuỗi exe: lưu lỗi → Dọn sạch bị từ chối → Thử lại → dọn được; bỏ `flush` của Thử lại → test đỏ | 146 (b), 147, 153 (a) |

Đếm: **36 ĐÃ SỬA** (gồm ba dòng sửa bằng tài liệu 131–133, đã đối chiếu với app) · **1 SỬA MỘT PHẦN** (DR6-37) · 0 CHƯA SỬA · 0 HỒI QUY.

### 3.3 Bảng R2 đủ 32 dòng

| Issue | PR | Gói | Claude | Codex | DeepSeek | **Chốt** | Bằng chứng chính (lượt 4) | Lượt 4 |
|---|---|---|---|---|---|---|---|---|
| #735 T-280 | #760 | D | ĐS | ĐS | ĐS | **ĐS** | Tiêu đề ở 84 px, đáy thanh 59 px; bỏ `scroll-margin` → e2e `topbar-focus` đỏ | — |
| #772 T-283 | #792 | F | ĐS | ĐS | ĐS | **ĐS** | Đồng hồ trang, `anchorMorning`, `CODE_SPAN`, `ratio()`, luật lint: gỡ → đỏ; helper dùng chung thay chỗ chép; `pr-status` / `merge-pr` với `gh` giả trên file đổi tên đúng | 155 (a) |
| #773 T-284 | #795 | D, E | ĐS | ĐS | ĐS | **ĐS** | `--border-control` #687890 ở app = mockup; 8d có dòng số HĐ (bỏ → 2 test đỏ) | — |
| #774 T-285 | #799 | A | ĐS | ĐS | ĐS | **ĐS** | Hàm dùng chung ↔ bản cũ 0 khác dưới 8 múi giờ; gỡ → test đỏ | — |
| #775 T-286 | #801, #804 | A | ĐS | ĐS | ĐS | **ĐS** | Lệnh cũ ↔ mới cùng kết quả (12 seed × 2 000 lệnh); bỏ `updatedAt` → hash seed đỏ | — |
| #776 T-287 | #805 | A, D, F | ĐS | ĐS | ĐS | **ĐS** | Một danh sách tham chiếu nhân sự, chỉ mục `0012`, đếm RF; gỡ → test đỏ; 9b tên trùng có mã | 135 |
| #777 T-288 | #812 | C, A | ĐS | ĐS | ĐS | **ĐS** | Hằng chung `ai` ↔ `db`, CHECK trùng DDL; gỡ → 2 test đỏ | — |
| #778 T-289 | #809 | C | ĐS | ĐS | ĐS | **ĐS** | Mỗi câu ví dụ của sổ là một ca; 415 test Mock xanh | 141 |
| #779 T-290 | #820, #822 | C | ĐS | ĐS | ĐS | **ĐS** | `detail` theo vị trí, JSON đủ sau `{` của lời văn; gỡ → 5–8 test đỏ; fuzz 59 703 issue 0 sai | — |
| #780 T-291 | #824, #828 | A, C, D, E | ĐS | ĐS | ĐS | **ĐS** | Bảy luật ở lệnh / nhập / màn: 14 / 14 đột biến bị giết, fuzz lệnh ↔ nhập 0 lệch (Claude A); biên 19 999 / 20 000 / 20 001 code point (Codex C) | 136, 150; KNOWN CLR4-F2 |
| #781 T-292 | #830 | C, A, F | ĐS | ĐS | ĐS | **ĐS** | Như DR6-25 | — |
| #782 T-293 | #807 | B, D | ĐS | ĐS | ĐS | **ĐS** | `backups\` không đọc được → lỗi riêng, không sinh seed đè; tiêu đề cửa sổ theo màn (exe); bỏ quyền `set-title` → test hợp đồng đỏ | — |
| #783 T-294 | #817, #819 | B, D | ĐS | ĐS | ĐS | **ĐS** | Một nguồn trạng thái lưu; exe: đóng app chờ Nạp lại / Nhập / Dọn sạch rồi lần lưu (S2-6); bỏ `track` → 2 test đỏ | 139, 147, 146 (b), 138 (c) |
| #784 T-295 | #825 | B, E, C | ĐS | ĐS | ĐS | **ĐS** | File hỏng chặn trước migrate (schema 10 có chỉ mục mà migration 11 dựng lại); `openFrom` ghi một lần; 10c; gỡ → 1–3 test đỏ | — |
| #785 T-296 | #833 | E | ĐS | ĐS | ĐS | **ĐS** | Hộp xác nhận dùng chung, `purgePlan` = `previewPurge` = 11j, tên nút theo ô, E20, 8d | 151, 154 |
| #786 T-297 | #835 | D, C | ĐS | ĐS | ĐS | **ĐS** | Dòng thời gian theo mockup; lỗi AI giữ khi đổi màn (bỏ giữ → test đỏ); 3f | 144 |
| #787 T-298 | #838 | D, E | ĐS | ĐS | ĐS | **ĐS** | 5d, 6a / 6h, 6d, thẻ Lịch hẹn một dòng ở 1 440, ô ngoài tháng; gỡ → test đỏ | — |
| #788 T-299 | #841 | D, E | ĐS | ĐS | ĐS | **ĐS** | Hộp nhân sự hỏi thay đổi chưa lưu, sắp giữ khi đổi team, bảng số cho chart N4–N1; gỡ → test đỏ | — |
| #789 T-300 | #843 | D, F | ĐS | ĐS | ĐS | **ĐS** | Token tương phản, `table-view`, token-guard; ngưỡng nhánh `ui` 100: bỏ một ca → 97,72 %, coverage báo lỗi | — |
| #790 T-301 | #845, #846 | D, E, F | ĐS | ĐS | ĐS | **ĐS** | Mã chết, hằng lặp, ký hiệu theo danh sách của Issue; class cũ ↔ mới chỉ khác chỗ PR nêu; 17 cột Báo cáo / Excel 0 khác. Phần DR6-37 ngoài danh sách: R1 | 145 |
| #793 T-302 | #815 | F | ĐS | ĐS | ĐS | **ĐS** | Ba dạng `import()` động của `@playwright/test` bị báo, gỡ luật thì không; `docsRead` gỡ → test đỏ | — |
| #797 T-303 | #811 | D | ĐS | ĐS | ĐS | **ĐS** (mockup) | `.input.locked` của mockup = `LOCKED` của app | — |
| #831 T-304 | #837 | F, C | ĐS | ĐS | ĐS | **ĐS** | 8 dạng `zod` đầy đủ bị báo ở 7 loại file; mặc định của schema AI | — |
| #849 T-305 | #855 | D, E, F | ĐS | ĐS | ĐS | **ĐS** | `HEADING` / `BADGE` một nơi; `recordBadge`; bộ chụp ảnh đọc `anchorMorning(timezoneId)` (máy Honolulu vẫn 09:30 giờ VN) | 153 (b) |
| #850 T-306 | #857 | B, E | ĐS | ĐS | ĐS | **ĐS** (tài liệu) | S2-6, NT-DB-23…25, TR-3 E7, "Mô hình dữ liệu của dọn sạch" khớp app / exe | — |
| #851 T-307 | #859 | F | ĐS | ĐS | ĐS | **ĐS** (tài liệu) | Đếm lại #833, #835, #828, #817 bằng `classifyFile`: trùng bảng `phase-6.md` | — |
| #852 T-308 | #861 | D, B | ĐS | ĐS | ĐS | **ĐS** | Chỉ phần nhìn thấy đổi; CSP và `identifier` giữ; icon, VersionInfo exe | 138 (a) |
| #865 T-310 | #871 | D, E, F, B | ĐS | ĐS | ĐS | **ĐS** | Tên app một nguồn (năm chỗ), `lang`, `stageBadge`, `PACKAGES` không còn file chưa xếp gói | — |
| #866 T-311 | #870 | F, D | ĐS | ĐS | ĐS | **ĐS** (tài liệu) | Luật đếm `phase-6.md` khớp `classifyFile`, `base.sha`; NT-CH-09 khớp app | — |
| #867 T-312 | #882 | F | ĐS | ĐS | ĐS | **ĐS** (ảnh) | 28 ảnh, lớn nhất 141 536 B, tổng 1 942 246 B; chạy lại bộ chụp ra ảnh trùng byte | 155 (b) |
| #876 T-314 | #878 | F | ĐS | ĐS | ĐS | **ĐS** (phần e2e) | Ca T-297 48 / 48 xanh; bỏ bước chờ → 20 / 48 đỏ | — |
| #884 T-316 | #888 | F | ĐS | ĐS | ĐS | **ĐS** (phần e2e) | `rightOfSidebar` cho cùng clip ở cuộn 0 / 300; bản trước #888 hụt đúng 300 px | — |

Đếm: **32 ĐÃ SỬA**.

**Refactor và hiệu năng không đổi hành vi** (plan §L4.4):

- **Dữ liệu tải:** sinh bằng code `119e2e4` ↔ code ghim chỉ khác cột `prompt_version` (Claude F). Mọi refactor của ba đợt sửa không đổi dữ liệu seed.
- **T-285, T-286, T-288:** hàm chung ↔ bản cũ 0 khác dưới 8 múi giờ; lệnh cũ ↔ mới cùng kết quả trên 12 seed × 2 000 lệnh; CHECK dựng từ hằng chung trùng DDL.
- **T-301, T-305, T-310:** class cũ ↔ mới của màn gói D, E chỉ khác chỗ PR nêu. 17 cột Báo cáo / Excel và 9 sheet: 0 ô khác (Claude E, Codex E).
- **`zod/mini`** (DR6-25, T-292): 0 khác về `success`, dữ liệu, mã, `path`, `detail` V1.
- **Chỉ mục `0012`:** `listTrash` / `previewPurge` cùng dòng như bản cũ, nhanh hơn (dòng CL3-A29).

## 4. Lượt 4 kiểm được gì (không có lỗi)

Ngoài 69 dòng R, các kịch bản mới không lộ lỗi dữ liệu nào. Những chỗ đáng kể:

- **Bảy luật T-291 ở lệnh, nhập backup và màn** (Claude A, Codex A / C, DeepSeek A): 14 / 14 đột biến bị giết; fuzz lệnh ↔ nhập 0 lệch; biên 19 999 / 20 000 / 20 001 code point của `raw_output` đúng ở cả hai đường; dòng do app ghi luôn nhập lại được.
- **Dọn sạch với chuỗi giữ lại nhiều tầng** (Codex A, DeepSeek A): dọn → giữ lại → khôi phục → dọn tiếp; RE đã bàn giao rồi bị xóa cùng team; file sau dọn vẫn nhập lại được.
- **Trạng thái lưu một nguồn (T-294) trên exe** (Claude B / F, Codex B, Claude D):
  - đóng app ngay sau "Backup rồi nạp lại" chờ seed và lần lưu (3 443 ms);
  - Thử lại khi file bị giữ, thư mục cấm tạo file, ổ đầy; đổi liên tiếp nguyên nhân lỗi rồi lưu được, focus giữ;
  - hai lần bấm Thử lại khi lần ghi bị giữ: một lần ghi, dữ liệu không lùi.
- **Nâng cấp tại chỗ** (Claude F, Codex B):
  - exe lượt 4 mở thư mục do exe lượt 3 ghi (kiểm trước migrate, backup, `0012`, `integrity_check`): 489 ms ≤ 600; dọn rồi mở lại bản backup lấy lại;
  - file schema 12 chứa dữ liệu tải mở lên 13, backup trùng byte, đúng một lần lưu.
  - Chỗ hở duy nhất là KNOWN CLR4-F2 (§8.4).
- **e2e qua nửa đêm** (DR6-129): múi giờ trình duyệt khác múi giờ máy (Bogota, Honolulu, UTC+14); luật lint chặn `test` của Playwright cả dạng tĩnh lẫn `import()` động.
- **Tên app Heritas L-CRM** (Claude B, D; Codex B): chỉ phần nhìn thấy đổi; CSP trùng `119e2e4`, `identifier` giữ (K39); icon sáu lớp, VersionInfo của exe đúng.
- **Cổng:** bước chuẩn bị 308 e2e qua, không flaky (lượt 3: 2 flaky qua nửa đêm). DeepSeek F chạy lại đủ bộ, 308 qua.

## 5. Phát hiện mới — kiểm lại

### 5.1 Chỗ phiên tổng hợp chấm khác reviewer

| Phát hiện | Reviewer | Chốt | Lý do |
|---|---|---|---|
| CLR4-D2 | Nit (T) | **Low** (DR6-146) | Test hở của sản phẩm (đường 5c của DR6-109, nhánh focus của Thử lại). Thước §4.3 xếp test hở vào Low, như DR6-125…128 lượt 3. Claude F tự nêu rằng các gói chấm test hở không đều |
| CXR4-F2 | Low (T) | **Nit** (DR6-155) | Test hở của bộ chụp ảnh hướng dẫn (công cụ phát triển, như DR6-130 lượt 3 và CLR4-F1). Ảnh đang commit đúng, và G7 xem lại ảnh bằng mắt khi chụp lại. Ảnh đi vào `huong-dan-su-dung.zip` nên khi sửa vẫn làm như mọi mục |
| DSR4-E1 | Low (A) | **Nit** (DR6-151) | Họ DR6-119 (tên nút trùng cho trình đọc màn hình, Nit) |
| DSR4-E1, phần ghi chú | "Hai KH cùng tên cùng nhóm vẫn trùng tên, nhưng Owner 25/10 đã chấp nhận (ghi chú #833)" | **Không nhận** | Quyết định 25/10 (sổ RESOLVED, nhóm review #846) chỉ chốt khuôn "Khôi phục KH <tên> · <nhóm>" cho ca hai KH cùng tên **khác** nhóm. Không có ghi chép nào chấp nhận ca cùng nhóm. Ca đó là CLR4-E2, gộp vào DR6-151 |
| DSR4-A1 | Low (P), "+3,7 ms, dưới luật nhiễu" | **Low**, gộp CLR4-A2 (DR6-136) | Cùng chỗ code. Đo ở bảng Lịch hẹn 10 255 dòng (bộ so của `DataTable`) thì vượt luật nhiễu: 🔁 6,9 → 65,6 ms. Số của DeepSeek đo bằng Node 22 của app, không so được với mốc (Node 24) |
| DSR4-C1 | Low (G), phần "lưu được" là đọc code | **Low** (DR6-142) | 🔁 phần validator: "phần\u0000trăm", "xác\u0000suất" qua V3 (bản có dấu cách bị chặn). Phần lưu: `analysisContentFits` so `JSON.stringify(result.data)` với `output_json`, NUL nằm trong JSON dưới dạng escape `\u0000`, nên dòng ACCEPTED qua (đọc code, khớp) |
| CLR4-F2 | Low, KNOWN có bằng chứng mới | **KNOWN** (K1) | Quy tắc Owner R2-02 / K1: siết luật thì áp ở lệnh và nhập backup, dữ liệu giả lập nạp lại, không migration hay UI cho dữ liệu cũ. Bằng chứng mới là đường vào (UI thường của exe lượt 3) và hậu quả (v1.0 từ chối bản xuất của chính nó sau khi nâng cấp tại chỗ) → Q4 |

### 5.2 Gộp

| DR6 | Gộp từ (mức gốc) | Lý do |
|---|---|---|
| 136 | CLR4-A2 (L), DSR4-A1 (L) | Cùng chỗ `name-order.ts:39-44`, cùng cách sửa (đổi chữ số một lần cho mỗi tên) |
| 138 | CLR4-B1, B2, B3 (L) | Test hở gói B: hợp đồng bản dựng và `storage.rs` (như DR6-126 lượt 3 gom test hở theo gói) |
| 141 | CLR4-C1 (L), CXR4-C1 (L) | Mock trích xuất: các luật chỉ xét chữ đứng trước cụm |
| 145 | CLR4-D1 (N), DSR4-D1 (L) | Phần còn của DR6-37 và hai lỗ của bộ chặn giữ DR6-37 (`findHardcodedSeparators`) |
| 148 | CXR4-D1, D2, E1, E2 (L) | Tên liền dài tràn khung ở bốn màn DR6-117 chưa phủ; cùng cách sửa |
| 151 | CLR4-E2 (N), DSR4-E1 (L → N) | Tên nút khôi phục trùng ở Thùng rác (họ DR6-119) |
| 155 | CLR4-F1 (N), CXR4-F2 (L → N) | Test hở của công cụ phát triển (`pr-core`, bộ kiểm ảnh hướng dẫn) |

## 6. Bảng đầy đủ DR6-135…157

Mức: L = Low, N = Nit. "Ai thấy" ghi mức gốc. "Mới" = mới do đợt sửa sau lượt 3; "trước" = có từ trước, lượt 1–3 bỏ sót. Nhóm sửa: §8.2.

### 6.1 Lõi dữ liệu (gói A)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 135 | Test hở: bộ lọc ngày trong SQL của `unmovedMeetingsFrom` (`customers.ts:441-458`, `date >= ?` ở :445; mới ở #805) giữ luật D7 cho cuộc gặp **cùng ngày**. Đổi `>=` thành `>` thì cả 3 975 test xanh, mà xóa / sửa ở 6f một cuộc gặp khi cuộc gặp khác cùng ngày đã giữ nhóm sẽ để lại dữ liệu luật nhập 4 từ chối (`BACKUP_INVALID {rule:4}`). Luật JS cùng ngày của `meetingKeepingMove` có test; ca D7 của `appointments.test.ts:1003-1036` chỉ dùng cuộc gặp ngày sau. Mới (#805) | CLR4-A1 (L) | L | ✅ 🧪 | L4-A |
| 136 | `byName` (luật 6 của T-291) gọi `asciiDigits`, tức `LATIN.test`, cho cả hai tên ở **mỗi lần so** (`name-order.ts:39-44`). Sắp bảng Lịch hẹn 10 255 dòng theo KH / RE: Node 9,4 → 65,2 ms (🔁 6,9 → 65,6 ms), bản web 54–60 ms; 1 496 tên KH 1,0 → 9,1 ms. Vượt luật nhiễu (> 20 % và > 10 ms), dưới ngưỡng 200 ms. Thân PR #828 ghi "< 1 ms chênh" và "17 → ~31 ms" cho 20 000 tên; đo lại không ra như vậy (19 448 tên: 20 → 153 ms). Đổi chữ số một lần cho mỗi tên thì 1 496 tên còn 1,79 ms, cùng thứ tự. Mới (#828) | CLR4-A2 (L), DSR4-A1 (L) | L | ✅ 🔁 📏 | L4-A |
| 137 | Nhãn model của phân tích AI (`isLabel`, `common.ts:89`) chỉ kiểm rỗng và NUL, không kiểm UTF-16 hỏng hay U+FEFF đầu chuỗi. Lệnh nhận model `'x'×99 + nửa surrogate`; sql.js đọc lại thành U+FFFD ×3, 100 → 102 đơn vị > `MAX_MODEL`, nên mọi bản xuất có dòng đó bị luật nhập 12 từ chối (`analysisLabelsFit`, `ai-analyses.ts:242`). Không có đường từ màn (model chọn trong danh sách đóng). Họ DR6-107 / 108. Trước | CXR4-A1 (L) | L | ✅ 📏 | L4-A |

### 6.2 File, Rust, lưu (gói B)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 138 | Test hở gói B: (a) ca CSP của `tauri-contract.test.ts:357-369` chỉ đòi bốn chỉ thị có mặt (`arrayContaining`): nới `script-src` / `img-src` / `font-src` hay thêm `frame-src` vẫn xanh, dù tên ca nói "no other host"; `identifier` (K39 giữ `dev.alexh.project2c`) không ca nào đọc. Bản web của e2e không có CSP, nên ca này là chốt chặn duy nhất của CSP exe. (b) Bộ lọc "chỉ file" của `backup_names` (`storage.rs:549`, viết lại ở #807) không test nào giữ: bỏ nó thì một thư mục mang tên backup làm mất một bản backup thật, chặn lần mở đầu và thành "Backup mới nhất". (c) Ánh xạ ổ đầy → `DISK_FULL` của `backup` (`storage.rs:252`) không test nào đi qua: bỏ thì ổ đầy lúc mở app ra trang lỗi chung kèm lỗi thô. Code hiện tại đúng ở cả ba. Trước | CLR4-B1, B2, B3 (L) | L | ✅ 🧪 | L4-B |
| 139 | `flush()` (`persist-queue.ts:129-137`) chỉ hỏi `tracked` trước `await idle()`. Một lần thay bắt đầu trong lúc `flush()` đang chờ lần ghi thì không được chờ, nên `closeAfterSaving` (`close-guard.ts:21-36`) hủy cửa sổ giữa lúc Nạp lại / Nhập backup / Dọn sạch, trái S2-6. 🔁 hàng đợi ghi 50 ms, `track` một việc 200 ms sau khi `flush()` bắt đầu: `flush()` xong khi việc chưa xong. Cần hai thao tác chồng nhau (bấm X trong lúc một lần lưu đang chạy, rồi xác nhận một lần thay trước khi lưu xong); file vẫn là dữ liệu cũ đủ. Mới (#817) | DSR4-B1 (L) | L | ✅ 🔁 | L4-C |
| 140 | `changed()` của `AppData` (`app-data.ts:373-377`) gọi từng listener không bọc `try`, khác `persist-queue` (NIT #87). Một listener ném lỗi làm `run()` ném **sau** khi lệnh đã ghi, trái hợp đồng "lệnh bị từ chối thì không đổi gì" (`:113-117`). Listener hiện có (React) không ném. Trước | DSR4-B2 (N) | N | ✅ 📏 | L4-C |

### 6.3 AI (gói C)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 141 | Mock trích xuất còn đề xuất sai cho KH ở các dạng câu ngoài DR6-121 / T-289, vì các luật bỏ cụm chỉ xét chữ đứng **trước** cụm (`mock-adapter.ts:305` `NEGATED`, :483-487). Claude: 18 / 28 câu sai, gồm phủ định khẩu ngữ ("KH đâu có 2 con", "làm gì có"), "định / tính sinh 2 con", "con dấu / con tem", người đi cùng, trạng thái cũ ("Trước đây KH độc thân, năm ngoái đã kết hôn" ra hai giá trị trái nhau), điều kiện "khi …", danh sách lựa chọn. Codex: bác bỏ ở vế sau ("Thông tin KH độc thân là sai." → Độc thân), thấy trên màn. Giống hệt `119e2e4`; đề xuất không tự lưu, OpenCode không dùng thuật toán này. Trước | CLR4-C1 (L), CXR4-C1 (L) | L | ✅ 📏 | L4-D (Q1) |
| 142 | NUL trong chữ của model làm V3–V6 lọt: `cleanText` = `normalizeText` giữ NUL (K25 chỉ từ chối NUL ở chỗ lưu), nên cụm bị chặn đứng hai bên NUL không khớp. V1 cũng qua (`schema.ts:121` `visible = normalizeText`). 🔁 "phần\u0000trăm", "xác\u0000suất" → 0 issue, còn bản có dấu cách bị V3 chặn. `analysisContentFits` nhận dòng ACCEPTED vì NUL nằm trong JSON dưới dạng escape. Cần output suy biến (model viết `\u0000`); 0 lần trong eval. Sửa bước 0 của so khớp là đổi luật G5. Trước | DSR4-C1 (L) | L | ✅ 🔁 | L4-E (G5, Q2) |
| 143 | V6 "luật <Tên>" sau "môi giới", "ranh giới", "biên giới" nay lọt: `LAW_NAME` miễn "giới" ở mọi từ ghép (`blocklists.ts:100`; G5 §12.5), trong khi "định" chỉ được miễn khi không đứng sau "quy / qui". G5 §12.8 chỉ ghi phần "Mất" cho "định". "Môi giới Luật Kinh doanh bảo hiểm" đúng nghiệp vụ của app; kho chữ thật 0 lần. Mới (#766) | CLR4-C2 (N) | N | ✅ 📏 | L4-E (G5, Q2) |
| 144 | Lỗi AI mà `AiJobs` giữ cho màn hiện lại (T-297) sống qua Nhập backup / Nạp lại: khóa `analysis:<id KH>` không gắn với dữ liệu (`ai-jobs.ts:52`, :86), một `AppAi` cho cả `AppData` (`app-data.ts:485-491`). Mở hồ sơ sau khi dữ liệu đã thay vẫn báo lỗi của lần chạy trên dữ liệu cũ, một lần; Thử lại chạy trên dữ liệu hiện tại. Chỗ khác của app tách theo `generation` (DR5-36, DR6-15). Mới (#835) | CLR4-C3 (N) | N | ✅ 📏 | L4-D |

### 6.4 Màn nhập liệu (gói D, và tên dài ở gói E)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 145 | Phần còn của DR6-37 và bộ chặn giữ nó (`findHardcodedSeparators`, `token-guard.ts:53-85`). (a) "{trường}: {giá trị}" của thẻ Dữ kiện KYC viết `: ` trong JSX (`CustomerKyc.tsx:95`). (b) Bộ chặn không bắt `` .join(`, `) ``, `a + ', ' + b`, template `${a}, ${b}`, chữ JSX `}, {` / `}; {` / `}: {`, `←`, `–`, `…`, ngoặc kép cong, ký hiệu viết bằng escape. (c) Bộ chặn cắt comment bằng `indexOf('//')` / `'/*'` không biết chuỗi: một URL `'https://…'` làm mất phần còn lại của dòng, một `'/*'` trong chuỗi làm mất tới `*/` (có khi hết file); `ai-analysis.ts:68` đã có một dòng như vậy. Trước (Issue #790 thu hẹp phạm vi; #845 mở rộng luật) | CLR4-D1 (N), DSR4-D1 (L) | L | ✅ 📏 | L4-F |
| 146 | Test hở gói D: (a) đường 5c của DR6-109 (sửa hồ sơ gửi tên gốc, `CustomerDialogs.tsx:234`): đột biến R109c sống cả bộ 296 e2e; (b) nhánh "focus đã chuyển đi trong lúc lưu" của Thử lại (`SaveWarning.tsx:32-36`): RB2c sống. Hành vi hiện tại đúng. Mới (#738, #817) | CLR4-D2 (N) | L | ✅ 🧪 | L4-G (a), L4-C (b) |
| 147 | Một lần lưu khác thành công trong lúc dải lưu lỗi hay hộp đóng app đang hiện. (a) Dải gỡ khi `failed` về false; chỉ đường Thử lại đưa focus về tiêu đề, nên focus đang ở "Thử lại" rơi về `body` (`SaveWarning.tsx:28-43`). (b) Hộp "Chưa lưu được thay đổi" đọc `error` hiện tại của hàng đợi (`CloseGuard.tsx`): lỗi về `undefined` thì câu đổi sang "file có thể đang bị chương trình khác mở", trong khi sidebar ghi "Đã lưu"; hộp vẫn mời "Đóng và bỏ thay đổi chưa lưu". Hai việc chồng nhau (phân tích AI ghi xong đúng lúc đó); không mất dữ liệu. Mới (#750, #817) | CLR4-D3 (L) | L | ✅ 📏 | L4-C |
| 148 | Tên liền dài (tên không có trần độ dài; `requireName` chỉ kiểm rỗng) tràn khung ở bốn chỗ DR6-117 chưa phủ. (a) Tiêu đề hộp thoại (`Dialog.tsx:84`, h2 không ngắt): tên KH 81 chữ ở 6 hộp, `scrollWidth` 616 > 446. (b) Màn Team (`TeamScreen.tsx:51` `whitespace-nowrap`, nút team :166-174, tiêu đề :293): chữ đè thẻ, "Đổi tên / Xóa team", "Sửa" ra ngoài cửa sổ 1 100. (c) Bảng So sánh team của Tổng quan (`TeamCompare.tsx:16` `whitespace-nowrap`): trang rộng 3 005 px ở 1 100. (d) Cột tên RE ghim của Báo cáo (`ReportTable.tsx:24-27`, không giới hạn rộng): cột ghim 1 770 px che mọi số, kể cả khi cuộn hết. Mockup `reports.html` để cột tên "lấy phần còn lại", không tính tên dài. Đường vòng: xuất Excel. Trước | CXR4-D1, D2, E1, E2 (L) | L | ✅ 📏 | L4-G |
| 149 | Ô chọn (`Choices.tsx:51-53`) khác `.choice` của mockup đã duyệt (`forms.css:261-284`) ở sáu điểm: nền `--bg-0` thay `--bg-2` (ô tối hơn hộp thoại, mockup sáng hơn), viền `--border` thay `--border-strong`, bo 10 px thay 6 px, đệm 4 / 10 thay 5 / 11, chữ `--text` thay `--text-2`, và ô đang chọn không đậm (`.choice.on` 600); ô tắt mờ 50 % không gạch ngang (`.choice.off`). Input ẩn nên ô đang chọn chỉ phân biệt bằng màu. Ảnh hưởng 5a, 5d, 7b / 7c / 7d, 3f, Cài đặt → AI. Không có trong "Lệch mockup đã biết" hay sổ. Trước (#375) | DSR4-D2 (L) | L | ✅ 📏 📄 | L4-F |

### 6.5 Lịch hẹn, Thùng rác, hộp xác nhận (gói E)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 150 | Ô Case size tùy chọn ("để trống = chưa ước lượng") chỉ có ký tự vô hình (U+200B / U+0085 / U+2060 dán vào) báo "Chưa nhập số tiền." và chặn Lưu của 6c / 6d / 6f: `readCaseSize` hỏi "trống" bằng `text.trim()` (`outcome-form.ts:33`), còn `parseVnd` đọc `normalizeText`. Ô ngày sinh 5a cùng kiểu đọc là "không có". Ba `pending` của ô ngày 6b / 6e / 6c cũng dùng `trim()` (đọc code). Trước (#738 đổi câu báo) | CLR4-E1 (L) | L | ✅ 📏 | L4-H |
| 151 | Tên nút khôi phục ở Thùng rác trùng nhau cho trình đọc màn hình, dù ô "Bản ghi" / "Thuộc" khác: (a) hai KH cùng tên, cùng nhóm (21 cặp ở Thùng rác 1 313 dòng); (b) hai nhân sự cùng tên khác vai trò / team: `restoreLabel` ghép `recordTitle` với chữ của `recordBadge`, mà `recordBadge` trả `null` cho nhân sự (`trash-view.ts:110-117`, :192-202). Họ DR6-119. Trước | CLR4-E2 (N), DSR4-E1 (L) | N | ✅ 📏 | L4-H (Q3) |
| 152 | `PURGE_REMINDER` (`trash-view.ts:518`) vẫn export mà không file nào import; test viết thẳng `1_000`. Họ DR6-66 (lượt 3 đã nêu, Issue #790 không liệt kê) | CLR4-E3 (N) | N | ✅ | L4-H |
| 153 | Test hở gói E: (a) câu từ chối có vế "Thử lại" của Nhập backup (`SettingsBackup.tsx:203-209`, chọn câu trong TSX): RB2e sống cả bộ e2e, trong khi Nạp lại và Dọn sạch có ca giữ; (b) huy hiệu nhóm trong ô "Bản ghi" của KH ở Thùng rác (`SettingsTrash.tsx:50-56`): T305b sống. Mới (#817, #855, #871) | CLR4-E4 (L) | L | ✅ 🧪 | L4-H |
| 154 | Lúc hộp xác nhận đang chạy (Nạp lại 10c, Dọn sạch 11i, Nhập backup 10a), ô chữ, Hủy và nút xác nhận đều tắt (`ConfirmWordDialog.tsx:38-64` `disabled={running}`; `SettingsBackup.tsx:229-247`), nên focus rơi về `body`: Tab không vào lại hộp, trình đọc màn hình không nghe "Đang …". Xong thì focus về đúng chỗ. Trước (code `119e2e4` tắt cùng ba phần tử) | CLR4-E5 (L) | L | ✅ 📏 | L4-H |

### 6.6 Công cụ (gói F)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 155 | Test hở của công cụ phát triển: (a) câu chặn "Read n of the m files" của `mergeBlockers` (`tools/pr-core.mjs:144-148`) đếm theo file; không ca nào có file đổi tên trong một PR đọc thiếu, nên đếm theo đường dẫn (T83c) vẫn xanh cả bộ. (b) Bộ kiểm ảnh hướng dẫn (`e2e/guide/check.guide.ts`) chỉ kiểm link và cỡ: gỡ `style` của `shots.guide.ts:34` (sửa của T-312) thì 13 / 13 vẫn xanh, ảnh thẻ cao hụt 8 hàng chân. Ảnh đang commit đúng. Mới (#792, #882) | CLR4-F1 (N), CXR4-F2 (L) | N | ✅ 🧪 | L4-I |
| 156 | `notes-core` bỏ sót ghi chú thư mục khi đích là glob ở cấp package: với `packages/*/src/schema.ts` và ghi chú `packages/ai/src/`, `covers` chỉ xét phần trước dấu `*` đầu và chỉ cho qua khi đích có `**` (`tools/notes-core.mjs:194-198`), nên `notes-for --files` in "Không có ghi chú OPEN nào". Sổ OPEN hiện rỗng. Trước | CXR4-F1 (L) | L | ✅ 📏 | L4-I |
| 157 | `size-report` đếm vào dòng "Tệp khác" mọi file không phải `.js` / `.css` trong `dist` (`tools/size-report-core.mjs:181`), kể cả `demo-<ngày>.sqlite` (9 969 664 B) mà `e2e/serve.mjs:32` ghi và không xóa. Chạy `pnpm e2e` rồi đo thì "Tệp khác" tăng ≈ 10 MB, và `size.json` ghi lúc đó thành mốc sai. Exe không bị (`build:web` xóa `dist`). Trước | DSR4-F1 (L) | L | ✅ 📏 | L4-I |

## 7. Bloat và hiệu năng

### 7.1 Exe release ở SHA ghim: mọi thao tác trong ngưỡng

`common\baseline.md` (probe `e2e/perf`, Home PC; mốc so `docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json`, plan §L4.6):

| Thao tác | Mốc sau #656 (`dae9df3`) | Lượt 3 (`119e2e4`) | Lượt 4 (`2e51e25`) | Ngưỡng `phase-6.md` | |
|---|---|---|---|---|---|
| `app.open-data` | 387 ms | 373 ms | 370 ms | ≤ 600 ms | ✅ |
| `reload.*` (6 màn) | 283–398 ms | 280–392 ms | 279–405 ms | < 500 ms | ✅ |
| `trash.open` | 34 ms | 38 ms | 32 ms | < 200 ms | ✅ |
| `customer.open-ai` / `customer.ai-history` | 19 / 2 ms | 19 / 2 ms | 20 / 2 ms | < 200 ms | ✅ |
| Các thao tác màn còn lại (lịch hẹn, KH, Tổng quan, Báo cáo, lọc Thùng rác) | 6–23 ms | 6–22 ms | 6–24 ms | < 200 ms | ✅ |
| `backup.read` / `backup.import` / `backup.export` | 835 / 43 / 438 ms | 827 / 47 / 425 ms | 977 / 47 / 436 ms | ≤ 2 000 / 500 / 1 000 ms | ✅ |
| `reports.export-excel` | 20 ms | 23 ms | 29 ms | ≤ 500 ms | ✅ |
| `appointments.next-month` / `next-year` | 101 / 107 ms | 103 / 106 ms | 108 / 113 ms | ≤ 300 ms; Năm − Tháng ≤ 50 ms | ✅ |
| `db.save` | 151 ms | 146 ms | 149 ms | ≤ 400 ms | ✅ |
| JS heap | 16,5 MB | 16,6 MB | 16,6 MB | ≤ 21 MB | ✅ |
| Mở lần đầu (gọi exe → màn đầu có số liệu, LCP) | 3 663 ms | 3 614 ms | 3 521 ms | xấu hơn khi > 4 396 ms; "không chậm hơn exe Phase 4" > 4 724 ms | ✅ |
| Dọn sạch: bấm "Backup rồi dọn sạch" → thông báo 11j (dữ liệu tải) | — | 151,8 ms | 123,3 ms | ≤ 500 ms (Owner 21/10) | ✅ |
| `trash.open` trước → sau khi dọn (đã ngắt DevTools) | — | 38,9 → 9,6 ms | 34,1 → 2,0 ms | — | |

So mốc sau #656 và so lượt 3: **không dòng nào ⚠️**. `backup.read` +142 ms (+17 %) so mốc, gần luật nhiễu. Đo theo cặp cùng lúc (Claude F, exe lượt 3 ↔ lượt 4 xen kẽ, mỗi bên 10 lần) thì +55 ms (+6,9 %); bản web +58 ms (+5,5 %, Claude D); Node +87 ms (Claude F). Gói A tách phần tăng vào hai bước kiểm của luật nhập (`validateBackupValues` +22 ms, `validateBackupInvariants` +35 ms: luật 7 tính lại hash 13 114 phiên bản KYC). Đây là chi phí có chủ ý của K33; phần còn lại là chênh giữa hai ngày đo.

### 7.2 Hàm thuần trong Node

| Hàm (dữ liệu tải) | Lượt 4 | So | Ngưỡng / luật nhiễu |
|---|---|---|---|
| `importBackup` | 854,1 / 842,6 ms (cặp xen kẽ; cũ 753,7 / 768,5) | +87 ms (+11,5 %): luật 7 (K33) | ≤ 1 100 ms ✅ |
| `listTrash` 113 / 1 313 dòng | 23,3 / 119,7 ms (cũ 29,4 / 128,2) | −7 / −8 ms (`0012`) | màn < 200 ms ✅ |
| `listAppointments`, `teamCompare`, `reportRows`, `exportBackup`, phần AI của hồ sơ | như cũ trong nhiễu (cặp xen kẽ) | ≈ | ✅ |
| Dọn sạch (`purgeTrash` cả `VACUUM`) 113 / 1 313 dòng | 85,2 / 129,8 ms (`baseline.md`) | lượt 3: 93,8 / 109,8 ms; 1 313 dòng +20 ms, một lần lệch xa (192,8 ms) | không ngưỡng riêng; trên exe ≤ 500 ✅ |
| `previewPurge` 113 / 1 313 dòng | 1,0 / 7,4 ms | lượt 3: 5,6 / 9,9 ms | ✅ |
| `byName`: sắp 10 255 lịch hẹn theo KH | 65,2 ms (cũ 9,4) | **+55,8 ms (×6,9)** ⚠️ | < 200 ms → **DR6-136** |
| Bộ nhớ: 8 lần `readBackup` + `importBackup` | rss 510–546 MB, heap 55,4–55,8 MB | không tăng | không rò |

Số đo Node của ba bên chạy khác giờ (đợt 1 song song Claude / Codex, đợt 2 DeepSeek một mình). Chỉ kết luận từ cặp xen kẽ cũ ↔ mới cùng tiến trình và từ ngưỡng.

### 7.3 Bundle và exe: tách phần font, icon, `zod/mini` (plan §L4.6)

| Phần | Lượt 4 | So lượt 3 (`119e2e4`) | Nguyên nhân |
|---|---|---|---|
| `assets/index.js` | 884 698 B | **−43 234 B** | `zod/mini` (K38): dựng lại cùng SHA mà đọc `zod` đầy đủ thì +62 589 B thô / +16 912 B gzip (#830 đo 62 735 B); code mới của các đợt sửa +21 259 B theo bản tách của Claude F (`app-i18n`, `pkg-ai`, `app-routes`, `app-data-shell`, `pkg-db`…) |
| `assets/index.css` | 29 752 B | +1 268 B | class mới (logo, token) |
| Tổng JS / CSS | 2 358 427 B (gzip 697 134) | −41 966 B (gzip −9 620) | — |
| Tệp khác | 1 022 121 B | +172 925 B | font Playfair Display 21 884 + ba ảnh logo 149 070 + favicon PNG 2 465 − `favicon.svg` 494 (K39, G3 / G4 đã duyệt) |
| Exe | 5 649 408 B | +240 640 B | `icon.ico` 16 625 → 87 968 B (+71 343, sáu lớp); phần còn lại là asset web nhúng (exe nhúng bản nén) và Rust mới (`storage.rs`). Tách thêm cần `cargo-bloat` (G4) |
| Dependency | — | không thêm / bớt / đổi phiên bản; mọi chunk dependency trùng từng byte lượt 3 | — |

### 7.4 Phát hiện P

Một phát hiện P: **DR6-136** (`byName`). Không thao tác chính nào vượt ngưỡng `phase-6.md` trên dữ liệu tải. Ghi để theo dõi, không phải phát hiện:

- Mock trích xuất trên ghi chú tổng hợp một dòng ≥ 180 000 ký tự: 152 ms trên màn (+61 ms so lượt 3), 23,8 ms trong Node ở 198 003 ký tự (×2,1). Ghi chú thật: ×1,09. Đây là các luật đọc câu mới của T-276 / T-288 / T-289 (Claude C).
- Thùng rác 1 313 dòng trên bản web gắn DevTools 510–525 ms: triệu chứng DR6-84 mà Owner chữa bằng Dọn sạch và câu nhắc từ 1 000 bản ghi.
- `personUsage` (hộp 9b) +2–3 ms vì một danh sách tham chiếu nhân sự (T-287).
- Đo "Tệp khác" sau `pnpm e2e` cộng thêm file `.sqlite` 10 MB của e2e (DR6-157): số của `baseline.md` đo ngay sau `build:exe` nên đúng.

### 7.5 Bloat: không có code chết chạy được có chi phí đo được

| Đã chạy / đo | Kết quả | DR6 |
|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` (mọi package + app; `pnpm typecheck` đã bật sẵn hai cờ) | 0 | — |
| `pnpm lint:deps` | 0 vi phạm; 341 module / 1 435 phụ thuộc (lượt 3: 320 / 1 312) | — |
| Export ↔ nơi dùng (cả ba bên) | một export thừa (`PURGE_REMINDER`); còn lại là seam test, helper e2e chỉ spec dùng | 152 |
| Code lặp (Claude F) | thân hàm trùng nguyên văn ≥ 25 token: **0 nhóm** (lượt 3: 1); theo cấu trúc: 6 nhóm (lượt 3: 7), không nhóm nào thuộc DR6-67, mỗi bản vài dòng | — |
| Khóa i18n | 1 193 khóa, 0 khóa không dùng; mã lỗi thiếu câu: đúng 5 mã như lượt 1–3, mỗi mã có đường hiện riêng | — |
| Coverage | 99,18 / 97,27 / 99,17 / 99,35 % (lượt 3: 99,05 / 97,04 / 98,97 / 99,28); `packages/ui/src/**` nhánh 100 % | — |
| Cổng ở SHA ghim | `pnpm verify` 3 975 test; `verify:rust` 116 test; `pnpm e2e` 308 qua, không flaky | — |

Đề xuất refactor bloat: DR6-152 (một dòng). Sáu nhóm trùng cấu trúc gộp khi chạm file. Công cụ nên có (G4, chỉ đề xuất): visualizer bundle, `cargo-bloat`.

### 7.6 Chất lượng test

- Ba bên "gỡ tạm" phần sửa ở mọi dòng R: Claude 307 / 333 đột biến bị giết, Codex 139 / 144, DeepSeek 95 / 97. Mọi luật sửa có test đỏ khi gỡ.
- Đột biến sống không tương đương đã thành DR6-135, 138, 146, 153, 155. Chỗ hở tập trung ở:
  - chỗ nối TSX (đường 5c, nhánh focus, câu Nhập backup, huy hiệu ô): Vitest không có DOM (thêm là G4), nên chỉ e2e giữ được;
  - Rust (`storage.rs`) và hợp đồng bản dựng;
  - công cụ phát triển.
- Cổng e2e ổn định qua nửa đêm từ DR6-129 (lượt 3 có 2 flaky).

## 8. Kế hoạch xử lý

### 8.1 Việc còn lại của T-318

1. **PR docs báo cáo gốc** #894 → `docs/reviews/raw/2026-10-31/` (mở cùng lúc với PR này).
2. **Kiểm độc lập bằng log phiên:** xong (§10).
3. **PR này** còn ghi:
   - các quyết định Owner của đợt 2 vào `docs/PROJECT-STATE.md`;
   - ghi chú quy trình về `dot2.mjs` vào kế hoạch (Phụ lục P);
   - số đo và kết quả lượt 4 vào `docs/metrics/phase-6.md`.
4. **Owner trả lời §9** → tạo Issue sửa theo §8.2 (mẫu Task, milestone Phase 6, ≤ ~400 / ~800 dòng, "Bị chặn bởi" theo file dùng chung); ghi các quyết định vào `PROJECT-STATE.md`.
5. **Sau đợt sửa:** G7. Gồm:
   - chụp lại ảnh hướng dẫn mà đợt sửa đổi màn (ô chọn của L4-F có ở nhiều hộp);
   - nghiệm thu trên exe phát hành;
   - eval AI thật với version prompt cuối;
   - chạy lại cổng và probe trên SHA phát hành, so mốc sau #656.

### 8.2 Nhóm sửa (sửa hết, Owner 27/10, đề xuất 6)

| Nhóm | DR6 | Việc | Cỡ ước lượng | File chính | Test chấp nhận | Rủi ro / nhãn | Bị chặn bởi |
|---|---|---|---|---|---|---|---|
| **L4-A** Lõi dữ liệu | 135, 136, 137 | Ca D7 "hai cuộc gặp cùng ngày" (A đổi nhóm, B cùng ngày giữ nhóm đó; xóa A, sửa A thành Hủy / nhóm khác → `STAGE_KEPT_BY_MEETING`). `byName` đổi chữ số một lần cho mỗi tên (nhớ theo tên, hay khóa dựng trước khi sắp), cùng thứ tự. `isLabel` từ chối nửa surrogate (`isStorableText`) và U+FEFF đầu chuỗi, ở lệnh và luật nhập 12; dữ liệu giả lập nạp lại (K1) | ≈ 10–20 SP + ≈ 70 test | `packages/domain/src/name-order.ts` (+ test), `packages/db/src/{common,ai-analyses}.ts` (+ test), `packages/db/src/appointments.test.ts` | Đột biến `date > ?` của `unmovedMeetingsFrom` bị giết; sắp 10 255 dòng theo KH trong Node không quá ≈ 2× collator trần, cùng thứ tự với bản cũ trên dữ liệu tải; model `'x'×99` + nửa surrogate → lệnh từ chối, không ghi dòng | med (luật nhập) | — |
| **L4-B** Test hợp đồng bản dựng và `storage.rs` | 138 | Ca CSP so cả chuỗi (hay đủ mảng chỉ thị) và đọc `identifier`; test Rust: thư mục mang tên backup giữa 10 bản; seam lỗi ổ đầy cho `backup` + test "a backup that finds the disk full is reported as disk full" | ≈ 10 SP (seam Rust) + ≈ 50 test | `apps/desktop/src/data/tauri-contract.test.ts`, `apps/desktop/src-tauri/src/storage.rs` (+ test) | NC7–NC11, NC13, D4, DF2 của Claude B bị giết | low, `build-exe` | — |
| **L4-C** Lưu và đóng app | 139, 140, 147, 146 (b) | `flush()` lặp tới khi không còn việc theo dõi và không còn lần ghi. `AppData.changed` bọc từng listener như `persist-queue`. `SaveWarning` đưa focus về tiêu đề khi dải sắp gỡ mà focus ở trong dải. `CloseGuard` giữ `error` của lần hỏi, hay tự trả lời "Thử lại" khi `failed` về false trong lúc hỏi. e2e Thử lại khi focus đã chuyển đi | ≈ 30–45 SP + ≈ 120 test / e2e | `apps/desktop/src/data/{persist-queue,app-data}.ts` (+ test), `apps/desktop/src/shell/{SaveWarning,CloseGuard}.tsx` (+ test), `e2e/save-state.spec.ts` | Việc `track` sau khi `flush()` bắt đầu được chờ (probe 🔁 của DR6-139 đỏ trước khi sửa); listener ném thì `run()` không ném; K1 / K7 của Claude D: focus ở tiêu đề, câu hộp giữ nguyên nhân; RB2c bị giết | med | — |
| **L4-D** AI: Mock trích xuất, lỗi giữ lại | 141 (Q1), 144 | Theo Q1. `AiJobs` ghi `generation` lúc job kết thúc, bỏ kết quả giữ lại của `generation` khác | Q1 (a): ≈ 35–70 SP + ≈ 80 test | `packages/ai/src/mock-adapter.ts` (+ test), `apps/desktop/src/data/ai-jobs.ts` (+ test), `routes/customers/use-ai-job.ts` | Các câu của CLR4-C1 và CXR4-C1 → 0 đề xuất; ghi chú thật giữ đủ 1 332 đề xuất (`p03-mock` của Claude C); lỗi giữ lại không hiện sau Nhập backup / Nạp lại | low | — |
| **L4-E** Đợt G5 lượt 4 | 142, 143 (Q2) | PR docs G5 trước (§14 mới của `phase-5-prompts.md`), rồi code: bước 0 của so khớp bỏ NUL như ký tự vô hình; miễn "giới" trước "luật" trừ khi đứng sau "môi / ranh / biên / thế" (như "định" sau "quy / qui"). Version prompt theo G5 | ≈ 5–15 SP + ≈ 40 test | `docs/design/phase-5-prompts.md`, `packages/ai/src/{text-match,blocklists}.ts` (+ test) | Câu của DR6-142, 143 bị chặn đúng; "giới luật Phật giáo", "GIỚI LUẬT Phật giáo" vẫn qua; 1 085 chuỗi eval và `vi.ts` không đổi kết quả | med, `gate` (G5) | — |
| **L4-F** Ký hiệu, ô chọn | 145, 149 | Khóa i18n cho "{trường}: {giá trị}" (hay dùng lại `extraction.proposed` nếu cùng nghĩa). `findHardcodedSeparators` cắt comment bằng máy trạng thái biết chuỗi / template, bắt thêm `', '` / `'; '` đứng riêng trong chuỗi / template và chữ JSX `}, {` / `}; {` / `}: {`. `Choices` theo `.choice` của mockup: nền, viền, bo, đệm, chữ, đậm khi chọn, gạch ngang khi tắt | ≈ 30–55 SP + ≈ 60 test | `packages/ui/src/{token-guard.ts,components/Choices.tsx}` (+ test), `apps/desktop/src/routes/customers/CustomerKyc.tsx`, `apps/desktop/src/i18n/vi.ts`, e2e `theme` | Các dạng "missed" của CLR4-D1 và ba ca của DSR4-D1 bị báo; `getComputedStyle` của ô chọn 5a / 5d khớp mockup; tương phản ≥ AA | low | — |
| **L4-G** Tên liền dài | 148, 146 (a) | `min-w-0` / `wrap-anywhere` cho tiêu đề `Dialog`, tên team / nhân sự và tiêu đề màn Team, ô tên của So sánh team; ô tên ghim của Báo cáo giới hạn bề rộng và ngắt chuỗi liền (tên thường không đổi hình). e2e 5c dán tên hỏng | ≈ 20–40 SP + ≈ 100 e2e | `packages/ui/src/components/Dialog.tsx`, `apps/desktop/src/routes/team/TeamScreen.tsx`, `routes/overview/TeamCompare.tsx`, `routes/reports/ReportTable.tsx`, e2e `team`, `overview`, `reports`, `customer-forms` | Tên 81–160 chữ liền ở 1 100 / 1 440: trang không cuộn ngang, nút trong thẻ, số của Báo cáo đọc được; R109c bị giết | low | — |
| **L4-H** Lịch hẹn, Thùng rác, hộp xác nhận | 150, 151 (Q3), 152, 153, 154 | `readCaseSize` và ba `pending` hỏi "trống" bằng `normalizeText`. Tên nút khôi phục theo Q3. Bỏ `export` của `PURGE_REMINDER`. e2e câu Nhập backup sau lưu lỗi và huy hiệu ô KH ở Thùng rác. Hộp xác nhận lúc chạy giữ focus trong hộp và đọc "Đang …" (`role="status"`, hay `aria-disabled` thay `disabled`) | ≈ 25–35 SP + ≈ 80 test / e2e | `apps/desktop/src/routes/appointments/{outcome-form.ts,AppointmentDialog.tsx,RescheduleFields.tsx,OutcomeDialog.tsx}`, `routes/{trash-view.ts,ConfirmWordDialog.tsx,SettingsBackup.tsx,SettingsTrash.tsx}`, `vi.ts`, e2e `trash`, `save-state`, `appointment-outcome` | U+200B / U+0085 ở ô Case size → lưu được, case size trống; hai KH cùng tên cùng nhóm và hai nhân sự cùng tên có tên nút khác nhau; RB2e, T305b bị giết; lúc hộp chạy, `activeElement` nằm trong hộp | low | L4-C (`e2e/save-state.spec.ts`) |
| **L4-I** Công cụ | 155, 156, 157 | Ca "Read n of the m files" có file đổi tên. Bộ kiểm ảnh hướng dẫn giữ chân thẻ cao (so ảnh đã commit, hay seam đo khung chụp). `covers` so glob với thư mục theo từng đoạn. `bundleReport` chỉ đếm đuôi của asset (hay `serve.mjs` ghi snapshot ngoài `dist`) | ≈ 20–60 SP + ≈ 90 test | `tools/{pr-core.test.mjs,notes-core.mjs,size-report-core.mjs}` (+ test), `e2e/guide/check.guide.ts` hay `e2e/serve.mjs` | T83c bị giết; `notes-for --files 'packages/*/src/schema.ts'` thấy ghi chú `packages/ai/src/`; `size-report` sau `pnpm e2e` không đổi "Tệp khác"; gỡ `style` của `shots.guide.ts` thì bộ kiểm đỏ | low | — |
| **L4-J** Tài liệu nghiệm thu | KNOWN CLR4-F2 (Q4) | Theo Q4 (a): một dòng ở NT-EX-08 / 09 | tài liệu | `docs/testing/nghiem-thu-v1.md` | Dòng ghi có, khớp hành vi | low | — |

Tổng: **10 Issue**, ≈ 185–350 dòng SP + ≈ 700 dòng test, phần lớn là test. Một nhóm `build-exe` (L4-B). Cổng: G5 của L4-E (nhãn `gate`, PR docs §14 trước PR code). L4-F và L4-H cùng sửa `vi.ts` nhưng khác khóa (`kyc.*`; `trash.restoreLabel.*` và chữ của hộp xác nhận), nên không chặn nhau; PR nào merge sau thì `gh pr update-branch` như thường.

### 8.3 Thứ tự, ước lượng

1. Owner trả lời §9.
2. Làm song song được (khác file): L4-A, L4-B, L4-C, L4-D, L4-F, L4-G, L4-I, L4-J, và PR docs G5 của L4-E.
3. Sau L4-C: L4-H (cùng `e2e/save-state.spec.ts`). Sau khi Owner duyệt §14: PR code của L4-E.
4. G7: chạy lại cổng và probe trên SHA phát hành (so mốc sau #656; đo `size-report` sau khi L4-I xong), chụp lại ảnh hướng dẫn, nghiệm thu, eval AI thật với version prompt cuối.

Mỗi Issue một phiên, review phiên sạch như thường. Ước ≈ 2–3 ngày làm, tùy số PR `risk:med` Owner phải merge (L4-A, L4-C, L4-E).

### 8.4 KNOWN có bằng chứng mới, không đánh số DR6

| Phát hiện | KNOWN | Bằng chứng mới | Đề xuất |
|---|---|---|---|
| CLR4-F2 (L, D) | K1 + quy tắc R2-02; "Claude F K2" lượt 3 (bản xuất dữ liệu tải code lượt 1 không qua luật nhập 4) | Đường vào mới: UI thường của exe lượt 3. Lý do dời chỉ gồm ký tự vô hình được lưu nguyên vì `optionalText` của `119e2e4` chỉ `trim`. Hậu quả mới: sau khi nâng cấp tại chỗ, exe v1.0 từ chối nhập lại chính bản nó xuất, và câu 10b nói "File hỏng hoặc không phải backup Project-2C". Đường vòng: chép bản backup tự động `.db` thành `project2c.db` (`09-cai-dat.md:188`), hay Nạp lại | Q4 (a): giữ K1, thêm một dòng ở NT-EX-08 / 09 (L4-J) |

## 9. Câu hỏi cần Owner quyết

Mỗi câu có đề xuất; Owner đồng ý mà không ghi gì khác thì lấy đề xuất. Mọi câu chỉ là **chọn cách sửa** (Owner đã chốt sửa hết).

1. **DR6-141 — Mock trích xuất.**
   - (a) Đảo thành danh sách cho phép (hướng của T-289): chỉ đề xuất khi vế là câu kể đơn về chính KH ("KH [đã / đang / hiện] kết hôn / độc thân", "KH có N con / bé") và vế không còn chữ nào ngoài danh sách chữ đệm; mọi dạng khác không đề xuất. ≈ 30–60 dòng SP + ca kiểm; giữ đủ 1 332 đề xuất trên ghi chú thật.
   - (b) Thêm từng chữ / cụm ("đâu", "làm gì", "định", "tính", "chuẩn bị", "khi" không có "thì", "đến lúc", "trước đây", "hồi", "dấu", "tem", "người / khách đi cùng", danh sách "/", "là sai" ở vế sau). ≈ 15–25 dòng; sẽ còn dạng khác.
   - (c) Ghi giới hạn vào spec Phase 5 §10 (Mock là heuristic minh họa, đề xuất không tự lưu) và dừng sửa từng dạng.

   **Đề xuất: (a).** Ba lượt liền đều thấy thêm dạng câu mới, nên (b) khó khép lại. (c) là không sửa, trái "sửa hết".
2. **DR6-142, 143 — đợt G5 lượt 4.**
   - (a) Một đợt G5 (§14 mới của `phase-5-prompts.md`, Owner duyệt ở PR docs trước PR code):
     - bước 0 của so khớp bỏ NUL như ký tự vô hình (chỉ ở bản so khớp, không đổi chữ lưu);
     - "giới" chỉ được miễn trước "luật" khi không đứng sau "môi", "ranh", "biên", "thế" (như "định" sau "quy / qui").

     Version prompt theo quyết định G5: đổi luật kiểm như §12 thì `analysis@5`, `discovery@5`. Eval AI thật ở G7 chạy với version cuối.
   - (b) Không sửa code: ghi hai dạng vào phần "Mất" của G5 (§12.8).

   **Đề xuất: (a).**
3. **DR6-151 — tên nút khôi phục ở Thùng rác** (đổi khuôn Owner chốt 25/10).
   - (a) Nhân sự: tên nút luôn thêm vai trò và team như dòng thứ hai của ô "Bản ghi" ("Khôi phục nhân sự <tên> · <vai trò> · <team>"). KH: chỉ khi tên + nhóm trùng một dòng KH khác đang có trong Thùng rác thì thêm mã KH theo khuôn của hộp 9b ("<tên> (<mã>)").
   - (b) Như (a), nhưng KH luôn có mã trong tên nút.
   - (c) Giữ như nay; ghi ACCEPTED.

   **Đề xuất: (a).** Tên nút thường không dài thêm, và mã KH đã là cách app tách hai KH trùng tên ở 9b.
4. **CLR4-F2 — KNOWN K1 có bằng chứng mới** (§8.4).
   - (a) Giữ K1, không sửa code. Thêm một dòng vào NT-EX-08 / 09: dữ liệu tạo ở exe trước v1.0 mà ô tùy chọn của lịch hẹn chỉ có ký tự vô hình thì ở v1.0 không xuất / nhập lại được; nạp lại dữ liệu giả lập.
   - (b) Giữ K1, không ghi gì.
   - (c) Câu 10b nêu đúng nguyên nhân, hay chuẩn hóa dữ liệu cũ lúc mở. Cả hai trái K1 / R2-02.

   **Đề xuất: (a).**

## 10. Kiểm độc lập và tuân thủ quy trình

Theo nội dung báo cáo:

- **SHA và `git status`:** cả 18 báo cáo ghi `2e51e25` đầu / cuối phiên và `git status --short` rỗng ở đầu / cuối. Lần này `Project-2C-review-2` không có file Codex tự sinh (lượt 3 có `AGENTS.md`, `.codex/`, `.agents/`). Phiên tổng hợp kiểm lại 31/10: cả hai worktree ở `2e51e25`, status rỗng.
- **Không gọi AI thật, không đọc key:** probe AI dùng Mock, `fetch` giả hay server loopback; probe trình duyệt / exe chỉ tới 127.0.0.1 / localhost.
- **Khuôn báo cáo:** đủ 9 mục ở cả 18 báo cáo; gói F của cả ba bên có bảng R1 gộp 37 dòng, bảng R2 gộp 32 dòng và kết luận.

### 10.1 Kiểm bằng log phiên (plan §8, §L2.10, §L3.10, §L4.10)

Làm 31/10 trên Home PC. Log đọc bằng script `node`, không gọi model. Script quét **đầu vào lệnh công cụ** (không quét prompt hay kết quả trả về, trừ phần "bị từ chối" của DeepSeek) theo danh sách quét của kế hoạch, rồi phiên tổng hợp xét tay từng chỗ khớp. Log thô không vào repo.

| Bên | Log | Phiên | Lệnh công cụ |
|---|---|---|---|
| Claude | transcript `.claude\projects\C--workspace-Project-2C-review\*.jsonl` (lượt này chỉ có thư mục `.claude`) | 6 phiên gói; 0 transcript subagent | 1 561 (A 247 · B 195 · C 230 · D 312 · E 289 · F 288) |
| Codex | `.codex\sessions\2026\10\29\rollout-*.jsonl` | 6 phiên chính + 7 phiên "guardian" (bộ duyệt lệnh của Codex, 0 lệnh; gói D có hai, phiên thứ hai sau lần hết hạn mức) | 494 (A 63 · B 53 · C 84 · D 113 · E 87 · F 94) |
| DeepSeek | bản Owner chép ra `deepseek\<gói>\session\<id phiên>.jsonl` + `tool-results\`; ba phiên thử ở `deepseek\thu\session\` | 6 task gói, tin nhắn đầu "Gói X." đúng gói; 0 thư mục `subagents\` | 943 (A 185 · B 96 · C 110 · D 211 · E 196 · F 145); phiên thử 46 + 51 + 29 |

**Không phát hiện nhiễm và không phát hiện vi phạm chỉ đọc.**

- **Lệnh đầu tiên:** cả 18 phiên gói chỉ đọc file prompt của bên đó (lượt 3: một lệnh gộp của Claude A liệt kê nhầm thư mục bên kia).
- **Thư mục và dữ liệu của bên khác, liệt kê / tìm kiếm cấp gốc:** 0 lần ở 18 phiên gói.
  - Claude A, B, D, F đọc probe lượt 3 của chính Claude trong `…-r3\claude\`; Codex E chép `loader.mjs` của chính Codex lượt 3. Quy tắc 3 của prompt cho phép.
  - Mọi chỗ khớp còn lại nằm ở ba phiên thử của DeepSeek: đó là các lần đọc thử mục bị chặn mà phiên thử phải làm (`baseline.md`, đợt 2).
- **Phiên thử 1 của DeepSeek** (29/10 22:11) chạy khi chưa làm đợt 2 bước 1–4, nên chưa có ACL. Nó đọc được dòng đầu của `claude\A.md`, `codex\A.md` và một tên mục ở mỗi thư mục lượt 1–3 (`baseline.md`, ghi chú sau phiên thử lần 1).
  - Kiểm lại trên 6 báo cáo và 6 log gói của DeepSeek: 0 ID phát hiện lượt 4 của Claude / Codex (`CLR4-…`, `CXR4-…`), 0 dòng `XONG` của hai bên đó ở lượt 4. Hai chỗ "XONG — claude" trong log gói E là báo cáo lượt 3 trong `docs/reviews/raw/2026-10-21/`, mà prompt cho đọc. Ngược lại, 0 chỗ `DSR4-` trong 12 báo cáo kia.
  - → Lệch ở mức thủ tục; không nội dung phát hiện nào lọt. Memory của app đã tắt, và mỗi gói là một task mới.
- **ACL của đợt 2:** phiên gói của DeepSeek 0 lần bị ACL từ chối, tức không thử mở chỗ bị chặn. Các chữ "Access is denied" / EPERM trong log là nội dung file nó đọc (code, test, kế hoạch) hay probe tự dựng (B: thư mục tạm bị `icacls /deny`, file giữ `share_mode(0)`). Bước 7.5: 12 báo cáo của Claude / Codex không đổi hash.
- **Ghi vào worktree** (quy tắc chung 1: "buộc phải patch trong repo thì gỡ ngay sau khi chạy và kiểm lại bằng `git status` / sha256"):
  - Claude: C vá worktree rồi trả nguyên byte, kiểm sha256 (`mut.mjs`, như lượt 3); A, D, E, F dùng hook `load` của Vite hay bản chép (0 ghi). Claude không có lệnh Write / Edit nào ngoài `claude\`.
  - Codex chạy bản chép trong `codex\<gói>\`; 0 ghi vào repo, chỉ đọc từ `common\`.
  - DeepSeek A–F vá worktree rồi trả trong cùng lệnh (`git checkout --` hay bản `.bak`), mỗi lần in sha256 trước / sau hay `git status`. A có dấu trả ở 21 / 22 lần (lần còn lại output dài lưu ra `tool-results`); B, C, D, E, F đủ.
  - DeepSeek B thêm hai file test tạm `apps/desktop/src/data/dsr4b-probe{,2}.test.ts` (tồn tại ≈ 40 s và ≈ 5 s) rồi xóa. Nó cũng nối module test Rust vào `storage.rs` rồi trả bằng `git checkout --`, kiểm sha256 sau mỗi lần. DeepSeek F tạo tạm `tools/probe.mjs` cho một probe lint rồi xóa.
  - Ghi ra ngoài thư mục của bên đó mà ngoài repo: chỉ thư mục tạm (`/tmp`, `%TEMP%\p2c-dsr4b-*`) và thư mục build / cache bị ignore (`target\` của `cargo test`).
  - File chung ở `common\` (kế hoạch, prompt, `known.md`, `fixes.md`, `dot2.mjs`) sửa lần cuối 00:21–00:26 ngày 29/10, trước lệnh đầu tiên của đợt 1 (01:02). `baseline.md` chỉ do phiên thử (theo việc được giao) và Claude ở bước 7 ghi thêm.
- **`pnpm`:** Claude, Codex 0 lần chạy. DeepSeek B chạy `pnpm lint:deps`, C chạy `pnpm exec node -v`, cả hai trong worktree `Project-2C-review` chứ không trong bản chép, nên không thuộc điều cấm của quy tắc chung 1.
- **`gh`, `git push`, git ghi khác:** 0 lần ở phiên gói. Claude F dùng `gh` giả (`fake-gh.mjs`) cho `pr-status` / `merge-pr --dry-run`. Phiên thử của DeepSeek chạy `gh auth status` (việc 7; lần 2 đã đăng xuất).
- **Đổi quyền:** Claude B, F đặt `icacls /deny`, `attrib +R` trên bản chép exe trong thư mục mình rồi gỡ ngay, và kiểm lại không còn luật chặn nào của probe. DeepSeek B đặt `icacls /deny` trong probe Rust trên thư mục tạm. 0 lần trên repo hay thư mục khác; 0 lần chạy `dot2.mjs`.
- **AI của sản phẩm, Credential Manager, chatgpt.com, mạng ngoài:** 0 lần; chỗ khớp là chữ báo cáo, hay `head tools/eval-ai.mjs` chỉ đọc. WebSearch / WebFetch của app chỉ ở phiên thử (việc 8).
- **DeepSeek đụng `.workbuddy*`:** 1 lần ở gói A, đọc một file `tool-results` của chính phiên đó (app lưu output dài ra file trong thư mục dữ liệu của app rồi đưa đường dẫn cho model). Ở phiên gói không có skill, connector, đổi chế độ quyền, Agent / giao việc.
- **Mẫu key:** 0 trong 18 báo cáo và các file chung. Hai chỗ khớp trong log DeepSeek F là chuỗi mẫu `Bearer ${…}` của code nó đọc, không phải key.

**Ghi nhận quy trình** (không đổi phát hiện nào):

1. **DeepSeek chạy chế độ Default ở cả 6 gói.** App ghi 14 lần "Sandbox bypassed (escalation-approved)" ở lệnh Playwright (D 5, E 6, F 3); A–C không lần nào.
2. **Tin nhắn mở mỗi gói DeepSeek có ngoại lệ Owner cho quy tắc riêng 4** (agent phụ, Code review expert), theo quyết định G6 30/10. Log: 0 lệnh Agent, 0 thư mục `subagents\` ở phiên gói; expert chạy trong phiên chính.
3. **Codex D dừng 09:43 vì hết hạn mức của Codex** ("usage limit"), làm tiếp 13:44 theo tin nhắn Owner; mục 1 của báo cáo ghi việc làm tiếp.
4. **Shell của app WorkBuddy có Node v22.22.2 trong PATH**, trong khi repo đòi Node ≥ 24. DeepSeek C ghi: chạy `vitest` bằng Node 22 làm 4 ca "36 000 ký tự" của `mock-adapter.test.ts` đỏ giả. Gói F đo bằng `C:\Program Files\nodejs\node.exe` v24.20.0; số của DSR4-A1 đo bằng Node 22.
5. **Shim `safe-delete` của app chặn Playwright ghi `test-results\`** khi quá 50 file; DeepSeek đổi `--output` sang thư mục của mình. `deepseek\F\pw-full` giữ ≈ 8 300 file artifact (571 MB) trên Home PC, ngoài repo.
6. **`dot2.mjs remove` dừng ở 16 mục do tài khoản sandbox của Codex làm chủ.**
   - Owner duyệt chạy `dot2-unlock.ps1` dưới quyền SYSTEM (30/10), rồi tự tính lại quyền thừa kế cho 9 file trong `.codex\.sandbox-bin` bằng quyền chủ file.
   - Mở thử mọi mục bằng tài khoản Owner đạt; chỉ `.codex\.sandbox-bin` không mở được, do ACL riêng của Codex.
   - Ghi chú quy trình đã thêm vào kế hoạch (Phụ lục P, sau mục "Script đợt 2").
7. **Không chép 9 file `<id phiên>.file-rollback.ndjson`** (chỉ mục hoàn tác của công cụ sửa file, không khớp mẫu key): Claude đề xuất không chép, Owner không yêu cầu chép.
8. **Không ghi credit WorkBuddy** (Owner): V4.1 Flash tính 0.00x tới hết 31/10.

**Cho lần sau:**

- Script ACL (như `dot2.mjs`) xem chủ sở hữu từng mục trước khi chặn. Mục do tài khoản khác làm chủ (sandbox của Codex) thì không chặn riêng, hoặc ghi lại để gỡ bằng quyền SYSTEM. `remove` liệt kê hết mục chưa trả được thay vì dừng ở mục đầu.
- Phiên thử chỉ chạy sau khi đã đặt ACL (phiên thử 1 chạy trước bước 1–4).
- Prompt của DeepSeek: gọi Node bằng đường dẫn đủ (`C:\Program Files\nodejs\node.exe`), và Playwright luôn `--output` ra thư mục của mình.
- Đo `size-report` sau `pnpm e2e` chỉ đúng khi DR6-157 đã sửa.

## 11. Ghi chú phương pháp

- Phiên tổng hợp (Home PC, 31/10) đọc đủ 18 báo cáo: bảng R, phát hiện, số đo, phần tuân thủ. Phát hiện gộp theo vị trí code + hậu quả; mọi phát hiện kiểm trên code ở `2e51e25`.
- 🔁 một probe Node chạy lại (`tools/ts-hooks.mjs`, repo không đổi):
  - `byName` so với collator trần trên 1 496 tên và 10 255 dòng có tên lặp (DR6-136);
  - `createPersistQueue` với `track` gọi sau khi `flush()` bắt đầu (DR6-139);
  - `validateOutput('analysis', …)` với NUL, BEL, dấu cách giữa hai chữ của cụm V3 (DR6-142).
- Đọc lịch sử để chấm hai mục:
  - DR6-37: mô tả ở tổng hợp lượt 1, báo cáo gốc L·CL-D5, thân Issue #790 (`common\fixes.md`);
  - ghi chú của DSR4-E1: sổ RESOLVED, nhóm review #846 (#833).
- Các phát hiện còn lại: đọc lại đúng chỗ code + bằng chứng (probe / đột biến / ảnh) của reviewer; với test hở, đọc test hiện có để thấy chỗ hở khớp mô tả. Không đo lại exe: bước chuẩn bị và Claude F đo cùng máy, số khớp.
- Không bác phát hiện nào. Phiên tổng hợp:
  - chênh mức ba mục;
  - chấm DR6-37 theo Claude, khác hai bên kia;
  - không nhận một ghi chú của DeepSeek về quyết định Owner (DSR4-E1);
  - giữ một mục KNOWN mà reviewer nêu (CLR4-F2, Q4).

## Phụ lục — đối chiếu ID của từng báo cáo ↔ DR6

Mỗi phát hiện của 18 báo cáo (34) có đúng một chỗ ở đây.

| Báo cáo | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| **Claude** (18) | A1→135 · A2→136 | B1→138 · B2→138 · B3→138 | C1→141 · C2→143 · C3→144 | D1→145 · D2→146 · D3→147 | E1→150 · E2→151 · E3→152 · E4→153 · E5→154 | F1→155 · F2→KNOWN K1 |
| **Codex** (8) | A1→137 | — | C1→141 | D1→148 · D2→148 | E1→148 · E2→148 | F1→156 · F2→155 |
| **DeepSeek** (8) | A1→136 | B1→139 · B2→140 | C1→142 | D1→145 · D2→149 | E1→151 | F1→157 |
