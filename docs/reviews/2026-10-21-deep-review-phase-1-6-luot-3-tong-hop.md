# Tổng hợp deep review Phase 1–6, lượt 3 — Claude, Codex (Home PC)

- **Ngày tổng hợp:** 2026-10-21 · **SHA được review:** `119e2e4` · kế hoạch `docs/process/deep-review-phase-1-6.md` §L3 (T-266 #713) · Issue T-267 #714 (`gate`).
- **12 báo cáo = 2 bên × 6 gói** (A lõi dữ liệu · B file và Rust · C AI · D màn nhập liệu · E lịch hẹn, chỉ số, quản lý · F xuyên gói, bloat / hiệu năng, công cụ), một đợt trên **Home PC `DESKTOP-KDURKJP`**. Bước chuẩn bị 19/10 23:54 → 20/10 00:12. Giờ máy:
  - **Claude:** A 01:37–07:23 (cắt ≈ 03:40 vì hết hạn mức, làm tiếp 06:21, dừng lần hai ≈ 07:23; phiên làm tiếp 18:58–19:20) · B 19:21–20:12 · C 20:18–21:16 · D 21:30–22:08 · E 22:10–23:35 · F 23:44–00:35 (21/10).
  - **Codex:** A 00:57–01:17 · B 01:19–01:40 · C 01:41–07:32 (log lặng 01:55–07:26, làm tiếp theo tin nhắn "tiếp tục" của Owner) · D 18:56–19:19 · E 19:21–19:46 · F 20:08–00:36 (21/10; hai lần ngắt, log lặng 20:12–22:33 và ≈ 1 h 45 sau đó).
- **Reviewer:**
  - Claude Opus 5.5, **mỗi gói một phiên sạch như lượt 2** (Owner quyết 20/10, thay cách chạy Workflow của plan §L3.7, Phụ lục I; `common\prompt-claude.md` sửa theo). Gói A phiên đầu `xhigh`, Owner bật ultracode: phiên chính chạy 2 Workflow (10 rồi 69 lượt subagent, kiểm đối kháng từng phát hiện). Gói A phiên làm tiếp và B–F: `max`, không subagent.
  - Codex (Owner chạy; Codex desktop, model "GPT-6" theo hệ thống, công cụ không cho biết mức suy luận).
- **ID:** phát hiện `CL3-<gói><số>` (Claude), `CX3-<gói><số>` (Codex); vấn đề đã gộp đánh số tiếp lượt 2: **`DR6-104…134`**.
- **Báo cáo gốc:** PR docs riêng → `docs/reviews/raw/2026-10-21/{claude,codex}/{A…F}.md` + `common-known.md`, `common-baseline.md`, `common-fixes.md`, `common-prompt-claude.md` (bản đã dùng, sửa 20/10, khác Phụ lục I). `common\plan.md` trùng bản trong repo ở `98d0016` nên không chép. Không có `common\workflow-run.md` vì không có phiên điều phối. Bằng chứng (probe, đột biến, log, ảnh) ở `C:\workspace\deep-review-1-6-r3\<bên>\<gói>\` trên Home PC, giữ tới phát hành v1.0.

**Cách kiểm (ADR-0001 M2):** phiên tổng hợp đọc đủ 12 báo cáo, gộp hai bảng R thành một bảng 39 DR6, rồi đối chiếu trên code ở checkout chính (`main` `98d0016`: từ `119e2e4` chỉ đổi `docs/**` + `CLAUDE.md` gốc, code giống hệt) các kết luận khác ĐÃ SỬA, mọi chỗ hai bên chấm khác nhau và **mọi** phát hiện mới. 54 phát hiện gộp thành 31 vấn đề, thêm 3 mục KNOWN có bằng chứng mới. Cột "Kiểm":

- ✅ đọc đúng chỗ code, khớp mô tả;
- 🔁 phiên tổng hợp tự chạy lại (probe Node trên `@p2c/domain` / `sql.js` của repo, hook nạp TypeScript `tools/ts-hooks.mjs`);
- 📏 số đo / probe của reviewer; 🧪 đột biến của reviewer; 📄 lệch giữa tài liệu / mockup đã duyệt.

Mức trong bảng là **mức chốt** theo thước plan §4.3, không theo mức bên đó gán. **0 phát hiện bị bác.**

## 1. Kết luận

| Bên | Kết luận ở gói F | Lý do chính |
|---|---|---|
| Claude | **CHƯA SẴN SÀNG** | 0 Critical / High / Medium; 48 Low / Nit; 2 DR6 chấm SỬA MỘT PHẦN (69, 91); Owner đã chốt sửa hết |
| Codex | **CHƯA SẴN SÀNG** | 0 Critical / High / Medium; 6 Low / Nit; 39 / 39 ĐÃ SỬA; Owner đã chốt sửa hết |

**Kết luận hợp nhất: CHƯA SẴN SÀNG cho v1.0 ở `119e2e4`, chỉ vì quyết định "sau lượt 3 sửa hết"** (Owner 19/10, plan §L3.11 câu 4). Không có Critical / High / Medium. Tiêu chí spec Phase 6 §1 mục 3 ("mọi phát hiện từ Medium trở lên đã sửa") vì vậy đạt ở `119e2e4`; phần còn lại Owner đã quyết là sửa hết → 11 Issue (§8.2), rồi G7 trên SHA sau đợt sửa.

- **Đợt sửa lượt 2 không làm hỏng chỗ nào trước đó đúng** (lượt 2 có 3 hồi quy, trong đó Medium duy nhất).
  - Mọi tái hiện lượt 2 (lượt 1 với DR6-17, 23, 24) nay ra đúng; cùng probe trên bản chép `4217ed4` ra lỗi cũ.
  - Mọi phần sửa có test đỏ khi gỡ, trừ các chỗ nối đã thành phát hiện T.
  - Gần với hồi quy nhất: DR6-122. #698 bỏ "bản bỏ dấu cả câu" nên dấu viết rời giữa hai chữ nay lọt V3–V6. G5 §11.3 đã chấp nhận một nhóm "Mất" cùng loại nhưng chưa liệt kê dạng này → Q4.
- **Bảng R (39 DR6): 38 ĐÃ SỬA · 1 SỬA MỘT PHẦN (DR6-69) · 0 CHƯA SỬA · 0 HỒI QUY** (§3).
  - DR6-69: E20 theo `seq` đúng ở mọi ca lượt 2. Phần "mốc không phần nghìn giây" của Issue #652 và phần thứ tự Thùng rác của mô tả còn hở → DR6-105.
  - DR6-91: Claude chấm SỬA MỘT PHẦN, phiên tổng hợp chấm ĐÃ SỬA; chỗ còn hở là code mới → DR6-128 (§3.1).
- **Phát hiện mới: 54 (Claude 48, Codex 6) → 31 vấn đề `DR6-104…134`: 0 Medium · 21 Low · 10 Nit**, thêm 3 mục KNOWN có bằng chứng mới (CL3-A29, B2, C7; §8.4).
  - Một mục hạ mức: CL3-A1, Low → Nit. Code đúng quyết định Owner 27/09; chỉ mockup 6d và NT-LH-25 lệch.
  - Một mục reviewer coi là KNOWN mà phiên tổng hợp không nhận: U+2028 trong tin nhắn dán (DR6-123) không có trong `known.md` (§5.1).
- **Dọn sạch Thùng rác** (`risk:high`, lần đầu được review): **không lỗi dữ liệu** ở mọi đường đã thử (§4).
  - Lệnh: fuzz 612 lần dọn, lỗi ở 11 vị trí giữa chừng không đổi gì.
  - Hàng đợi thay thế, tắt / giết app giữa lúc dọn: cả hai bên, trên exe.
  - Màn 11h–11j: mọi số Tổng quan / Báo cáo / Excel 0 khác.
  - Nâng cấp từ thư mục dữ liệu của exe lượt 1, lượt 2, Phase 5 rồi dọn.
  - Điểm yếu: test hở (DR6-125, 128) và một lỗ của lưới an toàn append-only (DR6-113).
- **Số đo (§7):** so mốc Home PC sau #656 không dòng nào ⚠️, mọi thao tác trong ngưỡng `phase-6.md`; mở lần đầu LCP 3 614 ms (mốc 3 663). Dọn sạch trên exe ≈ 150 ms ở cả 113 và 1 313 bản ghi; `trash.open` sau dọn 3,7–9,6 ms. Không phát hiện P vượt ngưỡng.
- **Kiểm log phiên (§10):** không nhiễm. Hai lệch đã tự khai:
  - Claude A lỡ liệt kê tên / cỡ file trong `codex\` (01:34, trước khi đọc quy tắc 1; không đọc nội dung, phiên dừng báo Owner).
  - Codex C chạy `pnpm exec` trong bản chép, làm 8 junction `@p2c` trỏ sang bản chép (tự khôi phục) — lặp bài học lượt 2.
- **Còn trước G7:**
  - Owner trả lời §9: 6 câu, đều là chọn cách sửa khi có nhiều phương án.
  - Đợt sửa lượt 3: 11 Issue, ≈ 110–245 dòng SP + ≈ 1 000 dòng test (§8). Nên làm DR6-129 (e2e qua nửa đêm) trước, vì mọi PR sau và cổng của SHA phát hành chạy e2e.
  - Các điều kiện ngoài review (spec §1 mục 2, 4): nghiệm thu trên exe phát hành (gồm NT-EX-08 / 09 trên exe Phase 5), eval AI thật với version prompt sau đợt sửa, chụp lại ảnh hướng dẫn, cổng trên SHA phát hành.

## 2. Số liệu

### 2.1 Theo báo cáo (mức do chính bên đó gán)

| Bên | Phát hiện | Low / Nit | KNOWN có bằng chứng mới | PLAUSIBLE | Bảng R của bên | Kịch bản mới | Đột biến (bị giết / tổng) | Thời gian |
|---|---|---|---|---|---|---|---|---|
| Claude | 48 (A 29 · B 2 · C 7 · D 4 · E 4 · F 2) | 31 / 17 | 3 (A29, B2, C7) | 0 | 37 ĐÃ SỬA · 2 SỬA MỘT PHẦN (69, 91) | 233 (A 165 · B 19 · C 14 · D 12 · E 11 · F 12) | 503 / 591 (A 325 / 396 · B 29 / 29 · C 42 / 45 · D 29 / 34 · E 37 / 44 · F 41 / 43) | ≈ 8 h 10 (A ≈ 3 h 25 qua ba phiên, B–F 38 phút – 1 h 25 mỗi gói) |
| Codex | 6 (A 0 · B 0 · C 1 · D 3 · E 1 · F 1) | 5 / 1 | 0 | 0 | 39 ĐÃ SỬA | 60 (A 11 · B 12 · C 8 · D 10 · E 10 · F 9) | 91 / 91 (A 15 · B 14 · C 11 · D 20 · E 21 · F 10) | A, B, D, E 20–25 phút mỗi gói; C, F bị ngắt rồi làm tiếp |

- Chỉ tiêu ≥ 5 kịch bản mới mỗi gói (gói F ≥ 5 chuỗi nhiều bước qua nhiều gói) đạt ở cả 12 báo cáo.
- Đột biến sống của Claude đều có lý do ghi trong báo cáo: tương đương, KNOWN (#709 nhánh `VACUUM` lỗi), hoặc thành phát hiện T.
- Số đột biến gói A lớn vì phiên đầu chạy Workflow: 10 subagent tìm song song, rồi 35 người kiểm đối kháng (2 người cho mục hành vi).
- Codex A, B không có phát hiện mới.

### 2.2 Theo vấn đề đã gộp (31)

| | Claude | Codex |
|---|---|---|
| Số vấn đề bên đó thấy | **30** (97 %) | 5 (16 %) |
| Chỉ bên đó thấy | 26 | 1 (DR6-123), thêm phần tên KH của DR6-117 |
| Medium | 0 | 0 |

- **Cả hai bên (4):** DR6-116 (focus màn Team, khác thao tác), DR6-117 (chuỗi liền dài: Claude thẻ Lịch hẹn + 7a / 7c / 7d, Codex 7a + tên KH), DR6-119 (tên nút HĐ cùng ngày), DR6-129 (e2e qua nửa đêm).
- So lượt 2 (Claude 34 / 36, Codex 10 / 36): khoảng cách hai bên rộng hơn. Codex chạy mỗi gói ≈ 20–25 phút và đọc gói A, B mà không có phát hiện. Claude gói A một mình có 29 phát hiện, 10 trong đó là test hở.

## 3. Bảng R gộp đủ 39 DR6

### 3.1 Chỗ hai bên chấm khác nhau

| DR6 | Claude | Codex | Chốt | Kiểm | Lý do |
|---|---|---|---|---|---|
| 69 | SỬA MỘT PHẦN | ĐÃ SỬA | **SỬA MỘT PHẦN** | ✅ 📄 | E20 theo `seq` đúng ở cùng mili giây, đồng hồ lùi, hai máy lệch giờ (cả hai bên). Nhưng Issue #652 mục 2 hứa E20 "đúng cả khi … file có mốc không phần nghìn giây", thân PR #666 ghi "mốc không phần nghìn giây không còn đổi kết quả khôi phục", và mô tả DR6-69 gồm CL2-A5 ("E20 **và thứ tự Thùng rác** so mốc thời gian bằng so chữ"). Còn hai chỗ so chữ: `transitionWithdrawnAt` ghép mốc xóa của cuộc gặp và của chuyển nhóm nó rút bằng `eq(deletedAt, at)` (`customers.ts:470`), Thùng rác xếp bằng so chữ (`trash.ts:187-189`); luật nhập nhận mọi độ chính xác (`backup-validation.ts:30`). Probe của Codex dùng mốc cùng dạng nên không thấy → DR6-105 |
| 91 | SỬA MỘT PHẦN | ĐÃ SỬA | **ĐÃ SỬA** | ✅ | R04g lượt 2 là đột biến của phép tính `kept` trong hộp 6f (`git show 4217ed4:apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx`, dòng 87–89). #667 chuyển đúng phép tính đó vào `editedDay` (`outcome-form.ts:133-145`) có unit test, và đột biến ở đó bị giết (cả hai bên). R04g-tsx của Claude đổi lời gọi `editedDay` của hộp (`EditOutcomeDialog.tsx:88`): đây là code mới của #667, chưa e2e nào mở 6f của ca E19, nên là biến thể còn hở, ghi phát hiện riêng (DR6-128), không phải phần sửa chưa làm. Khác DR6-62 lượt 2 (BR3), nơi chính đột biến lượt 1 còn sống |

### 3.2 Bảng đủ 39 DR6

"Gỡ sửa" = đột biến "gỡ tạm phần sửa" / áp lại đột biến sống của lượt trước, Claude / Codex (K = bị giết, S = sống). Cột cuối là vấn đề lượt 3 liên quan.

| DR6 | Mức L2 | Issue → PR | Claude | Codex | **Chốt** | Bằng chứng chính (lượt 3) | Gỡ sửa | Lượt 3 |
|---|---|---|---|---|---|---|---|---|
| 17 | L | #661 → #698 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | NFD + U+200B trước mỗi dấu → V3 / V4 / V5 / V6 (`4217ed4`: đạt cả 5); câu dán ChatGPT web NFD + ZWSP → thử lại; 140 tổ hợp từng chữ 0 lọt (Codex) | K 8 / K 2 | 122, 123 |
| 23 | N | #661 → #698 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Câu thường chặn nhầm lượt 1 nay đạt; chữ không dấu vẫn chặn; 10 637 đoạn chữ thật 0 khớp trộn (Claude), 1 085 text eval + 2 318 chuỗi `vi.ts` 0 thay đổi (Codex) | K 5 / K 1 | 122, 124 |
| 24 | N | #661 → #698 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | `detail` V1 nêu dạng đúng ("cần mã dữ kiện dạng F12", danh sách giá trị, "thiếu, cần array"), hiện đúng trên màn | K 6 · S 1 (tương đương) / K 1 | — |
| 68 | M | #652 → #666 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | KH tạo N3 10/10, ghi Đã gặp 05/10 giữ N3: OK (lượt 2: `TRANSITION_BEFORE_LATEST`); luật nhập nhận; 6c khóa ở nhóm tạo KH; fuzz lượt 2 chạy lại 0 lỗi; Báo cáo không đếm KH trước ngày tạo (Codex) | K 6 / K 3 | 126, 134 |
| 69 | L | #652 → #666 | SMP | ĐÃ SỬA | **SỬA MỘT PHẦN** | §3.1 | K 2 · S 1 (V69c tương đương) / K 3 | **105**, 106 |
| 70 | L | #653 → #667 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | W8 lượt 2: 6f nay có khung "Khi lưu · Nhóm KH N2 → về N3 (hủy chuyển nhóm 15/09) · RF bớt 1"; Lưu ra đúng câu | K 4 / K 2 | — |
| 71 | L | #652 → #666 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | File sửa tay của CL2-A4 → `BACKUP_INVALID {rule:4}`; khôi phục không đổi KH khác | K 4 / K 2 | — |
| 72 | L | #659 → #686 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | 7 ký tự của DR6-72 → rỗng; "Sao Mai" + U+3164 → `TEAM_NAME_TAKEN`; 4 207 code point của tập bỏ (Codex); hộp 5a / 9c / 7a theo luật mới | K 13 · S 1 (ở màn, luật giữ ở test `domain` / `db`) / K 3 | 107–111, 126 |
| 73 | L | #656 → #674 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | 257 / 257 ca `quick_check` "ok" mà `integrity_check` bắt: khởi động từ chối, 0 backup, 0 lưu; exe "File dữ liệu bị hỏng" (cả hai bên) | K 2 / K 1 | — |
| 74 | L | #656 → #674 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Thuộc tính chỉ đọc → `ACCESS_DENIED`; exe trang lỗi, file không đổi (cả hai bên) | K 2 / K 1 | 120 |
| 75 | L | #656 → #674 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Câu "…rồi đóng cửa sổ này và mở lại app", "đóng cả hai cửa sổ"; lần mở thứ ba vào được; 7 trang lỗi `role="alert"` + `h1` | K 3 / K 2 | — |
| 76 | L | #657 → #680 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Rust: JSON→JSON, URL→URL, trộn theo từng ký tự → `AI_BAD_RESPONSE`, 401 che; 30 000 ca ngẫu nhiên có dấu cách 0 lọt (Claude), 4 020 + 56 ca (Codex). Script eval: 8 dạng → 0 lần key trong file kết quả. Ba lớp: ngoài mô hình (K23) | K 17 / K 4 | — |
| 77 | L | #661 → #698 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | 300 chữ + 701 / 650 000 × U+200B → V1; `recordAiAnalysis` và nhập backup từ chối | K 7 / K 1 | KNOWN C7 |
| 78 | L | #658 → #682 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | 22 câu của lượt 2 → 0 đề xuất; câu đúng về KH giữ đề xuất | K 8 / K 1 | 121 |
| 79 | L | #658 → #682 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Ghi chú một dòng 36 003 ký tự 1,8 ms (`4217ed4` 2 219 ms); Edge 37 ms; **0 / 3 551** (Claude) và **0 / 5 672** (Codex) ghi chú thật cho đề xuất khác | K 2 · S 2 (R79c ≤ 127 ms, R79d tương đương) / K 1 | — |
| 80 | L | #654 → #669 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | 7 / 7 người hỗ trợ nay có câu làm được; 9b = lệnh ở 51 người | K 9 / K 1 | 115 |
| 81 | L | #654 → #669 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Hồ sơ mở ở `scrollY 0`; 6 lần đổi màn đều 0 | K 1 / K 1 | — |
| 82 | L | #654 → #669 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Link 108 ký tự trong ghi chú KYC / dữ kiện không còn tràn cột ở 1 440 / 1 100 | K 2 · S 4 (R82a, d, f gần tương đương; R82e → DR6-127) / K 2 | 117, 118, 127 |
| 83 | L | #655 → #693 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | 6 ca `BODY` lượt 2 → đích dự phòng (tiêu đề chi tiết, khung trống, dòng 11e, tiêu đề Hợp đồng); 7a "Bỏ", 7d | K 12 / K 6 | 116 |
| 84 | L | #662 → #707, #709, #710 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Thùng rác có lối ra (Dọn sạch, Q8 c): lệnh D1–D13 (A), hàng đợi (B), màn 11h–11j (E), exe 1 313 dòng `trash.open` 151,9 → 3,7 ms (F); §4 | K ≈ 175 · S có lý do / K ≈ 11 | 113, 114, 125, 128 |
| 85 | L | #660 → #689 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | 251 commit, commit cũ nhất là code → chặn (lượt 2: `ready`); thiếu `total_commits` → chặn | K 10 / K 2 | — |
| 86 | L | #660 → #689 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Ba thư mục `.claude*` đọc đủ; 8.3 / khác hoa thường / junction đếm một lần | K 5 (+ I/O chạy thật) / K 2 | — |
| 87 | L | #652 → #666 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | R16 lượt 2 (sống) nay bị giết `customers.test.ts:217` | K 1 / K 1 | — |
| 88 | L | #656 → #674 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | G07d, `Drop`, phiên bản 0.1.0, `AI_MODELS` ↔ Rust nay bị giết; J5 = K29, comment khớp | K 6 / K 5 | — |
| 89 | L | #658 → #682 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | R15d (unit), R15b, R21c (e2e trên bản dựng ngoài repo) nay bị giết | K 3 / K 3 | — |
| 90 | L | #654 → #669 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | R33c–e, R90f, BR3 (selector thật), BR3b nay bị giết | K 7 / K 6 | — |
| 91 | L | #653 → #667 | SMP | ĐÃ SỬA | **ĐÃ SỬA** | §3.1 | K 8 · S 1 (R04g-tsx) / K 7 | **128** |
| 92 | N | #660 → #689 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Cả bộ unit 3 159 / 3 159 ở UTC−11 và UTC+12 | K 1 / K 2 | — |
| 93 | N | #653 → #667 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Dòng "15/09/2026 · Đã gặp · nhóm sau N3 · không đổi nhóm KH" | K 2 / K 1 | — |
| 94 | N | #653 → #667 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | "… ghi sau lúc xóa cuộc hẹn này" khi cùng ngày; khác ngày vẫn câu E6 | K 2 / K 1 | — |
| 95 | N | #653 → #667 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** (tài liệu) | Mockup 11c = spec E7 = NT-TR-09, khớp app | — | — |
| 96 | N | #663 → #700 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** (tài liệu) | NT-EX-05, NT-KH-16, NT-TM-11 / 15 / 16 khớp `vi.ts` từng câu | — | 115 (NT-TM-16 chép đúng cặp câu) |
| 97 | N | #663 → #700 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** (tài liệu) | `10-su-co.md:82` "200.000" = `vi.ts` | — | 133 |
| 98 | N | #665, #695 → #696, #660 → #689 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** (tài liệu + probe) | Mốc sau #656 có trong `phase-6.md` + JSON; probe đo `trash.open` khi đã ngắt DevTools (38 ms) | — | — |
| 99 | N | #653 → #667 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Tên nút khôi phục HĐ có FYP | K 1 / K 1 | 119 |
| 100 | N | #655 → #693 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | `columnheader` "Thao tác" ẩn ở hai bảng | K 3 / K 4 | — |
| 101 | N | #654 → #669 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | "6" + ZWSP + "tỷ" → "6.000.000.000 ₫"; 18 biến thể 0 lệch | K 1 / K 1 | 110 |
| 102 | N | #661 → #698 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | "kỉ luật Thép", "qui luật Thị trường" đạt; "Theo Luật Kinh doanh bảo hiểm" vẫn V6 | K 3 / K 1 | 124 |
| 103 | N | #653 → #667 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Một hàm `meetingKeepingMove` cho lệnh / seed / màn; dữ liệu tải 3 254 lịch giống hệt `4217ed4`; 6f ↔ lệnh 0 lệch trên 7 503 cuộc gặp | K 6 · S 1 (tương đương) / K 2 | 126, 134 |

Đếm: **38 ĐÃ SỬA** (gồm bốn mục sửa bằng tài liệu 95–98, đã đối chiếu dòng ghi với app / số đo) · **1 SỬA MỘT PHẦN** (69) · 0 CHƯA SỬA · 0 HỒI QUY. Bảy DR6 lượt 1 kiểm qua mã lượt 2 (01, 04, 19, 30, 49, 60, 62): phần còn lại đúng ở các dòng 93, 68, 79, 82, 72, 88, 90.

**Refactor / hiệu năng không đổi hành vi (plan §L3.4):**

- **DR6-79:** nhanh hơn ×400–2 000 trên ghi chú một dòng dài; đề xuất giống hệt bản trước trên mọi ghi chú thật (0 / 3 551, 0 / 5 672).
- **DR6-103:** gộp luật mà hành vi không đổi: 3 254 lịch giống hệt; 3 254 lần chuyển nhóm + 1 040 khóa 0 lệch (Codex).
- **DR6-73:** `integrity_check` lúc mở +33–34 ms, trong ≈ +30–40 ms của K24.
- **#705:** `load-data` sinh lại dữ liệu tải với hash trùng plan §L3.6; test `tools/` và `eval-ai-core` xanh.
- **DR6-84 → Dọn sạch:** `trash.open` sau dọn 3,7–9,6 ms; cỡ file sau `VACUUM` ở §7.3.

## 4. Lượt 3 kiểm được gì (không có lỗi)

- **Dọn sạch Thùng rác, lệnh** (Claude A, Codex A):
  - D1–D13, TR-11–TR-13; một tập giữ lại cho `listTrash` / `previewPurge` / `purgeTrash`.
  - Fuzz: Claude 612 lần dọn, 9 912 dòng giữ lại, 16 000 lệnh + 140 000 bước quanh nhóm của ngày; Codex 3 000 bước, 200 lần dọn. Lần nào cũng: số đếm = số dòng xóa thật, phần đang dùng (cả chuyển nhóm đã rút của lịch sống) giống hệt, luật nhập nhận, `foreign_key_check` rỗng.
  - Lỗi giữa chừng (11 vị trí × 2 cách ném, `foreign_key_check`, COMMIT, lần lưu): DB không đổi, khóa ngoại bật lại, lệnh sau chạy được.
  - Migration 0011 trên dữ liệu tải giữ mọi dòng và hash mọi bảng. Trigger chỉ nới cho dòng của KH đã xóa mềm: thử với KH đang dùng, đã xóa, xóa rồi khôi phục.
- **Dọn sạch, hàng đợi và file** (Claude B, Codex B):
  - Chờ lưu, backup trước, chặn ghi, lần lưu trước lỗi (D7), `VACUUM` lỗi, kết quả AI về trong / sau lúc dọn.
  - Đóng cửa sổ ngay sau cú bấm; giết tiến trình 100–1 500 ms sau cú bấm (exe), 40 lần ở tầng Rust, 9 lần Node, 5 lần exe (Codex). File luôn là một trong ba trạng thái nguyên (trước dọn · đã dọn · đã `VACUUM`), backup không bao giờ dở, `.tmp` dọn ở lần mở.
  - File bị chương trình khác giữ lúc dọn → lưu lỗi, bỏ thay đổi thì dữ liệu như trước khi dọn.
- **Dọn sạch, màn** (Claude E, Codex E):
  - Số Tổng quan / Báo cáo / Excel / Lịch hẹn 0 khác trước / sau dọn và sau xuất → nhập lại: 8 kỳ × 9 góc nhìn ở hai cỡ (Claude), 343 tổ hợp + workbook từng ô (Codex).
  - Chữ xác nhận (9 cách gõ), "Đang dọn…" qua 3 lần Escape, D7 / D8, câu nhắc 999 / 1 000, bộ lọc không giới hạn phạm vi dọn, khôi phục dòng giữ lại; tương phản chữ mới ≥ 6,17:1.
- **Nâng cấp và nhiều phiên bản** (Claude F, Codex F) — đường dữ liệu của NT-EX-07…09:
  - Exe lượt 3 mở thư mục exe lượt 2 (schema 11) và dữ liệu code lượt 1 (schema 9): backup lúc mở là file trước migration (sha256 trùng), dọn đúng; lấy lại dữ liệu bằng bản backup trước lúc dọn (`09-cai-dat.md:187`) trùng từng chữ.
  - Dữ liệu Phase 5 (`3d6c7fc`) ở 6 ngày neo × 3 biến thể: nhập / mở / khôi phục / xuất → nhập 18 / 18.
  - Exe cũ mở thư mục schema 12: trang lỗi, không ghi gì. Hai máy khác phiên bản: `SCHEMA_TOO_NEW`.
- **Chuỗi nhiều bước qua nhiều gói** (Claude F K1–K7, Codex F N1–N5, Claude A `f-chain`, Codex A): xóa → dọn → Excel → xuất / nhập → mở lại bản backup tự động → chỉ số; AI đang chờ → xóa KH → dọn → tạo KH trùng tên; chuỗi dời 3 lịch → bàn giao → nhập file có tiền thân đã xóa → dọn → khôi phục. Không chuỗi nào lộ lỗi dữ liệu.
- **Khóa ngoại khi dọn:** tắt trong lúc xóa là đúng — bật thì dọn 1 313 dòng mất ≈ 3 s, như chú thích `purge.ts:144-147`.
- **Múi giờ:** cả bộ unit 3 159 / 3 159 ở UTC−11…+12. Chatham (+13:45) và Kiritimati (+14) đỏ đúng các ca ngoài khoảng mà `test-support.ts` hứa.

## 5. Phát hiện mới — kiểm lại

### 5.1 Chỗ phiên tổng hợp chấm khác reviewer

| Phát hiện | Reviewer | Chốt | Lý do |
|---|---|---|---|
| CL3-A1 | Low (C) | **Nit** (DR6-131) | Code đúng **quyết định Owner 27/09/2026 (G8, Issue #106, T-060)**: "Dấu phẩy theo sau bởi 3 chữ số là dấu ngăn nghìn, **kể cả khi có đơn vị**: `1,500 tỷ` = `1.500 tỷ`". Mockup 6d (#75, cùng ngày, trước #112) còn câu help cũ, NT-LH-25 (#577, 13/10) chép theo mockup. 🔁 `parseVnd('1,234 tr')` → 1 234 000 000. Phương án (a) của reviewer (đổi code theo mockup) trái quyết định đó → chỉ sửa tài liệu |
| CX3-C1 | Low (Codex); Claude C coi là KNOWN ("đã bị bác ở review đối kháng #698") | **Low, không KNOWN** (DR6-123) | Không có trong `known.md` (sổ OPEN / ACCEPTED, K1–K29). Thân PR #698 xếp nó vào "4 phát hiện bị bác (đúng luật đã duyệt hoặc có từ trước, không hồi quy)", tức chỉ không phải hồi quy của #698; G5 §11.8 không nhắc. `isOwnMessage` tách dòng chỉ ở CR / LF (`web.ts:103`), trong khi `normalizeNote` tách ở U+0085 / U+2028 / U+2029 (K25) |
| CL3-C7 | Low, KNOWN có bằng chứng mới | **KNOWN** (giữ K1) | Quy tắc Owner R2-02 (`CLAUDE.md`): siết luật thì áp ở mọi nơi và nạp lại dữ liệu giả lập; "không viết migration, cảnh báo hay UI để hiện / sửa dữ liệu cũ sai". Đề xuất `safeParse` của reviewer đúng là loại UI đó → Q5 |
| CL3-A19 | Nit (hai người kiểm: Low / REFUTED) | **Nit** (DR6-106) | Codex A K11 chạy cùng chuỗi, kết luận "không trái phép so `seq` của K22". Trạng thái cuối trùng "ghi R rồi X, không xóa gì"; chỉ thiếu câu spec → Q1 |
| CL3-A9 | Low (một người kiểm đề Nit) | **Low** (DR6-113) | Không có đường vào trong app, nhưng là lỗ của lưới an toàn append-only mà ADR-0008 và D11 viết là chặn mọi câu SQL sửa / xóa. Mọi trigger chỉ `RAISE` (0003, 0006, 0008, 0011), nên bật `recursive_triggers` không gây đệ quy |

### 5.2 Gộp và chênh mức

| DR6 | Gộp từ (mức gốc) | Lý do |
|---|---|---|
| 105 | CL3-A28 (L), CL3-A21 (N) | Cùng gốc: luật nhập nhận mọi độ chính xác của mốc, code so chữ. Một dòng sửa (`z.iso.datetime({ precision: 3 })`) đóng cả hai |
| 114 | CL3-A27 (N), CL3-A25 (N) | Cùng các câu SQL trỏ tới nhân sự (`USAGE`, `IN_TRASH`, `KEPT_PEOPLE`) |
| 115 | CL3-A3 (L), CL3-D1 (L) | Cùng câu Thùng rác của 9b (`vi.ts:1213-1216`, `team-view.ts:113-135`), một cho RE, một cho người hỗ trợ |
| 116 | CL3-D2 (L), CX3-D1 (L) | `TeamScreen` không có đích focus dự phòng; mỗi bên một nhóm thao tác |
| 117 | CL3-D3 (L), CX3-D2 (L), CX3-D3 (L) | Chuỗi liền dài ở chỗ #669 chưa phủ, cùng cách sửa (`min-w-0`, `wrap-anywhere`) |
| 119 | CL3-E1 (N), CX3-E1 (N), CL3-E2 (N) | Tên nút trùng cho trình đọc màn hình, họ DR6-99 |
| 124 | CL3-C4 (N), CL3-C5 (N) | Chặn nhầm câu thường, cùng đợt G5 |
| 125 | CL3-A10, A11, A12, A18 (L) | Test hở của lệnh Dọn sạch |
| 126 | CL3-A13, A14, A15, A16, A17 (L), CL3-A20 (N) | Các test hở còn lại của gói A (như DR6-87…91 lượt 2: test hở gom theo gói) |
| 128 | CL3-E3, CL3-E4 (L) | Test hở gói E |
| 129 | CL3-F1 (L), CX3-F1 (L) | Cùng nguyên nhân |
| 132 | CL3-A23 (N), CL3-A22 (N) | Tài liệu chưa theo Dọn sạch (0011) |

## 6. Bảng đầy đủ DR6-104…134

Mức: L = Low, N = Nit. "Ai thấy" ghi mức gốc. Nhóm sửa: §8.2.

### 6.1 Lõi dữ liệu: khôi phục, mốc thời gian (gói A)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 104 | Khôi phục cuộc gặp đã rút chuyển nhóm đi đường E7 (không ghi lại chuyển nhóm, mất RF) dù KH tới nhóm sau cuộc gặp vào **ngày sau** ngày cuộc hẹn. Lọt khi nhóm đó cũng là một nhóm của ngày cuộc hẹn: nhóm đầu ngày, hoặc tới giữa ngày rồi rời. TR-3 / bảng E7 viết "tới nhóm đó vào ngày sau → từ chối như E6"; nhánh `move.to === null` chỉ kiểm `isStageOfDay` (`appointments.ts:304-312`). Chuỗi hiếm làm được trên màn; hộp báo trước "không tính RF". Có từ #616 | CL3-A2 (L) | L | ✅ 📏 | L3-A |
| 105 | Luật nhập nhận mốc thời gian mọi độ chính xác (`z.iso.datetime()`, `backup-validation.ts:30`), mà code so chữ: (a) `transitionWithdrawnAt` ghép mốc xóa của cuộc gặp với mốc của chuyển nhóm nó rút bằng `eq(deletedAt, at)` (`customers.ts:470`). File viết hai mốc cùng thời điểm khác dạng (`…01Z` / `…01.000Z`): Thùng rác báo "không đổi nhóm", khôi phục bị chặn `STAGE_NOT_ON_DAY`, hoặc lọt E20. (b) Thùng rác xếp "mới xóa nhất trên" bằng so chữ (`trash.ts:187-189`). Phần còn của DR6-69. Chỉ file sửa tay | CL3-A28 (L), CL3-A21 (N) | L | ✅ 📏 | L3-A |
| 106 | Chuỗi "xóa R, ghi X cùng ngày, xóa X, khôi phục R rồi X": R quay lại với `seq` cũ nên E20 không chặn X; X ghi chuyển nhóm mới với nhóm trước / RF khác lúc xóa. Trạng thái cuối trùng "ghi R rồi X, không xóa gì"; khôi phục ngược thứ tự thì bị chặn. TR-3 chưa nói chuyển nhóm được đưa lại có tính là "ghi sau lúc xóa" không; PR #666 tự nêu ca này ở "Ngoài phạm vi" | CL3-A19 (N); Codex A K11 (cùng chuỗi, "không trái K22") | N | ✅ 📏 | L3-A (Q1) |

### 6.2 Chữ, tiền, nhập backup (gói A, D)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 107 | Nhập backup nhận chuỗi bắt đầu bằng U+FEFF. sql.js bỏ BOM đầu chuỗi khi đọc nhưng byte ở lại (🔁 `"\uFEFFBến"` đọc lại `"Bến"`, hex `EFBBBF42E1BABF6E`): luật nhập thấy chữ đã mất BOM, còn chỉ mục duy nhất và phép so SQL thấy chữ có BOM. Hậu quả: hai team cùng tên, ngày so SQL sai (bàn giao chuyển cả lịch đã qua), KH có id mang BOM không mở được, bản xuất không nhập lại được. `raw_output` chỉ gồm BOM cũng vậy. Chỉ file sửa tay / output suy biến | CL3-A4 (L) | L | 🔁 📏 | L3-B |
| 108 | `raw_output` của phân tích AI nhận nửa surrogate lẻ: `storedRawOutput` chỉ thay NUL (`ai-analyses.ts:183-185`). sql.js ghi lệch; 🔁 đọc lại thành U+FFFD ×3 và mất đuôi chuỗi. Chữ gần 20 000 ký tự thì mọi bản xuất sau đó bị nhập từ chối (CHECK độ dài). Đường vào: dán vào ChatGPT web chữ có nửa lẻ, hai lần sai → REJECTED | CL3-A5 (L) | L | 🔁 📏 | L3-B |
| 109 | Hộp 5a / 5c và 7a gửi lệnh chữ **đã** `normalizeText` / `normalizeNote` (`CustomerDialogs.tsx:225`, `:234`; `KycDialogs.tsx:252`, `:263`), trái spec Phase 3 §6 dòng 175 ("UI kiểm rỗng bằng cùng hàm, không tự chuẩn hóa chữ gửi lệnh"). Bỏ ký tự vô hình kẹp giữa hai nửa surrogate lẻ thì hai nửa ghép thành ký tự khác (😀) và được lưu, trong khi lệnh trên chữ gốc trả `INVALID_TEXT`; hộp team / nhân sự gửi chữ gốc | CL3-A6 (L) | L | ✅ 📏 | L3-B |
| 110 | `parseVnd` / `parseQuickDate` đọc chữ gốc (NFC + `\s` của JS). Số / ngày dán kèm ký tự vô hình hay U+0085 ở ô FYP, case size, ngày lịch hẹn / ghi chú / ngày sinh bị báo "không đọc được"; dòng đọc lại tiền KYC (sau `normalizeText`, DR6-101) đọc được cùng chuỗi. 🔁 `"500tr\u200B"`: format lỗi ↔ 500 000 000 | CL3-A7 (L) | L | 🔁 | L3-B |
| 111 | Ký tự điều khiển C0 / C1 (`\p{Cc}` ngoài White_Space, trừ NUL) không thuộc tập K25 nên được giữ (🔁 `normalizeText("Sao Mai\u0007")` giữ U+0007). "Sao Mai" và "Sao Mai" + U+0007 là hai team; Excel bỏ ký tự đó nên ra hai dòng "Sao Mai". Giá trị KYC chỉ gồm Cc làm hạng mục "đã có". Mở rộng K25 cần Owner (G2) | CL3-A8 (L) | L | 🔁 📏 | L3-B (Q2) |
| 112 | `byName` (collator `numeric`) coi "Team 01" / "Team 1", chữ số toàn khổ / Ả Rập, ký tự điều khiển là bằng nhau (🔁 0), trái doc comment "Only the same name ties" (`name-order.ts:6`). Chỉ hai nơi có đầu vào khác thứ tự xếp cặp hòa khác nhau | CL3-A24 (N) | N | 🔁 | L3-B |

### 6.3 Dọn sạch: lưới an toàn, SQL nhân sự (gói A)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 113 | `INSERT OR REPLACE` / `REPLACE INTO` lách trigger chỉ thêm của `kyc_notes` / `kyc_facts` / `ai_analyses`. Khi `recursive_triggers` tắt (mặc định; `database.ts:196-198` chỉ bật `foreign_keys`), REPLACE xóa dòng cũ mà không chạy trigger BEFORE DELETE: sửa được chữ ghi chú, `value_json`, `prompt_version` của KH đang dùng. Không lệnh nào của app dùng REPLACE trên ba bảng; là lỗ của lưới append-only (ADR-0008, D11), có từ 0003 | CL3-A9 (L) | L | ✅ 📏 | L3-C |
| 114 | Ba câu SQL mới lại liệt kê các cột trỏ tới nhân sự: `USAGE`, `IN_TRASH` (#669), `KEPT_PEOPLE` (#709); thêm bản ở luật nhập 5 là ×4. `KEPT_PEOPLE` có nhánh `outcome_reviewer_id` không thể xảy ra: lịch giữ lại luôn là Dời lịch, mà CHECK chỉ cho người đánh giá ở lịch Đã gặp. TR-12 cũng nêu vế "người đánh giá" của ca đó | CL3-A27 (N), CL3-A25 (N) | N | ✅ | L3-C |

### 6.4 Màn: câu 9b, focus, tràn khung, tên nút (gói A, C, D, E)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 115 | Câu Thùng rác của hộp 9b hứa khôi phục KH là gỡ được. (a) RE: "Khôi phục KH … rồi chuyển sang RE khác" (`person.inUseTrash`) sai khi dữ liệu là cuộc gặp đã có kết quả, lịch đã qua hay HĐ, vì các bản ghi đó giữ RE đã ghi (K19). (b) Người hỗ trợ: "Khôi phục KH … thì mới sửa được các lịch đó" (`inUseSupportTrash`) trái câu ngay trên ("Người phối hợp của lịch Dời lịch / Dự kiến không đổi được") khi lịch là Dự kiến / Dời lịch. Làm theo câu thì KH quay lại danh sách và chỉ số, nhân sự vẫn không xóa được, hộp mất luôn câu "dọn sạch". NT-TM-16 chép đúng cặp câu này. Mới do #669, #710 | CL3-A3 (L), CL3-D1 (L) | L | ✅ 📏 | L3-D (Q3) |
| 116 | Màn Team & nhân sự không có đích focus dự phòng (`TeamScreen.tsx` không đặt `DialogFocusFallback`). Xóa nhân sự (9b), đổi vai trò làm người đó rời bảng, Lưu ở "+ Thêm TL", xóa TL → focus về `body`. Xóa team → focus ở nút "Xóa team" nay của team khác (React dùng lại phần tử). Cùng loại DR6-83; Issue #655 không liệt kê màn này | CL3-D2 (L), CX3-D1 (L) | L | ✅ 📏 | L3-D |
| 117 | Chuỗi liền dài còn tràn ở chỗ #669 chưa phủ: (a) thẻ "Lịch hẹn" của hồ sơ, khi ghi chú cuộc gặp là link: đè 342 px sang cột KYC Intelligence ở 1 440, trang cuộn ngang 346 px ở 1 100; (b) dòng dữ kiện đang soạn của 7a (nút Bỏ ra ngoài hộp 258 px), 7c "Đang có", 7d lựa chọn; (c) tên KH liền dài đẩy bốn nút của hồ sơ ra ngoài cửa sổ (`CustomerProfile.tsx:141-154`) | CL3-D3 (L), CX3-D2 (L), CX3-D3 (L) | L | ✅ 📏 | L3-E |
| 118 | Panel KYC Intelligence và khối AI chi tiết lịch hẹn tràn khung. (a) Ở cửa sổ mặc định 1 440 (3 cột từ DR6-30), sau một lần lưu từ ChatGPT web, bảng "Lịch sử phân tích" 5 cột không co (ô Prompt `discovery@3+web@1`): badge CURRENT tràn 17 px. (b) `Item` in nguyên chữ AI, không `wrap-anywhere`: một chuỗi liền (mã "F1/F2/…", email, link không có `-`) làm trang cuộn ngang 117–1 994 px | CL3-C1 (L) | L | ✅ 📏 | L3-E |
| 119 | Tên nút trùng cho trình đọc màn hình (họ DR6-99). Thẻ Hợp đồng: "Phát hành HĐ nộp {date}", "Sửa HĐ nộp {date}" thiếu FYP (`CustomerPolicies.tsx:96`, `:105`), hai HĐ cùng ngày nghe như nhau. Thùng rác: tên nút khôi phục không có trạng thái, hai lịch cùng ngày giờ (Hủy / Không đến) hay hai HĐ cùng ngày, cùng FYP (một đã phát hành) cùng tên | CL3-E1 (N), CX3-E1 (N), CL3-E2 (N) | N | ✅ 📏 | L3-F |

### 6.5 File, Rust (gói B)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 120 | Lưu lỗi `PermissionDenied` mà không do "chương trình khác": ACL của `project2c.db` cấm ghi / xóa nhưng cho đọc, hoặc thuộc tính chỉ đọc bật giữa phiên. `open` chỉ xét thuộc tính chỉ đọc (`storage.rs:147-154`), `save` chỉ tách lỗi đầy đĩa. App mở bình thường, mọi lần lưu lỗi, dải lưu và hộp đóng app bảo đóng "chương trình khác", Thử lại không bao giờ được: đúng triệu chứng DR6-74 trước #674. Thấy trên exe | CL3-B1 (L) | L | ✅ 📏 | L3-G |

### 6.6 AI (gói C)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 121 | Mock trích xuất còn đề xuất sai cho KH ở sáu dạng câu ngoài DR6-78 và ngoài ghi chú "chỉ ghi lại" của #682: câu hỏi có từ phủ định đứng sau ("…đã kết hôn chưa", "…có 2 con không?"); phỏng đoán ("Có lẽ", "Hình như", "Nghe nói"); người khác nêu sau cụm ("2 con của anh trai"); "đã kết hôn nhưng đã ly hôn"; chủ thể chung ("gói cho người đã kết hôn"); "con" của đồ vật ngoài danh sách ("3 con Lexus"). Các luật chỉ xét chữ đứng **trước** cụm (`mock-adapter.ts:117-132`). Đề xuất không tự lưu; OpenCode không bị | CL3-C2 (L) | L | ✅ 📏 | L3-H |
| 122 | Sau #698, câu lọt V3–V6 khi có dấu viết rời giữa hai chữ của một mục ("xác ́suất"), dấu thừa trên chữ ("xáć suất") hay `´` / `¨` (NFKC → dấu cách + dấu). Bản cũ chặn nhờ "bản bỏ dấu cả câu". G5 §11.3 liệt kê phần "Mất" (sai dấu, giữ `đ` bỏ dấu thanh, hai dấu chồng) nhưng không có dạng này. Output suy biến; 0 lần trong 1 085 chuỗi eval. Mới do #698 | CL3-C3 (L) | L | ✅ 📏 | L3-I (G5, Q4) |
| 123 | Nhận diện tin nhắn của app (G5 §6a, "mỗi dòng") chỉ tách dòng ở CR / LF (`web.ts:103`). Tin nhắn dán lại mà dấu xuống dòng đã thành U+0085 / U+2028 / U+2029 bị tính là câu trả lời: tốn hai lần thử, thêm một dòng REJECTED. `normalizeNote` tách dòng ở cả ba ký tự (K25). Có từ trước | CX3-C1 (L) | L | ✅ 📏 | L3-I (G5, Q4) |
| 124 | V3–V6 chặn nhầm câu thường. (a) Mục "Bỏ dấu: có" mà dạng không dấu của một chữ là âm tiết thật: "khách am hiểu" → "khách ấm", "khách lanh lợi" → "khách lạnh", "noi theo" → "hướng nội", "làm IT" → "ít khả năng". (b) V6 "luật <Tên>" chặn "định luật Pareto", "giới luật Phật giáo" (chỉ miễn sau "pháp", "kỷ / kỉ", "quy / qui"). 0 lần trong eval thật | CL3-C4 (N), CL3-C5 (N) | N | ✅ 📏 | L3-I (G5, Q4) |

### 6.7 Test hở (đột biến sống không tương đương)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 125 | Lệnh Dọn sạch: (a) tập giữ lại TR-12 chỉ có test một tầng — 13 đột biến sống: bỏ đệ quy làm dọn bị từ chối mãi, nới điều kiện làm đếm / giữ lại sai, bỏ `firstOfEach`; (b) D3 không so chuyển nhóm đã rút của cuộc gặp còn dùng: đột biến xóa cả chúng sống; (c) D11 không thử KH đang dùng khi Thùng rác có KH: M10, M12 của 0011 sống; (d) không test nào ghim việc 11b / 5f và 11i đếm cùng ghi chú SYSTEM (hai câu đếm riêng) | CL3-A10, A11, A12, A18 (L) | L | 🧪 📏 | L3-C |
| 126 | Gói A còn lại: (a) nhánh "nhóm tạo KH" của `stageOnDay` khi KH đã đổi nhóm sau ngày tạo — đột biến làm DR6-68 quay lại mà CI xanh; (b) `latest.seq < withdrawn.seq` của `reinstateTransition`: bản đột biến để lại dữ liệu luật nhập 3 từ chối; (c) `updatePerson` chặn RE rời vai trò khi còn lịch hẹn; (d) `ORDER BY date` của `liveAppointmentsOf` (DR6-103); (e) chữ K25: CR đứng một mình, NFC chứ không NFKC, thứ tự "kiểm storable trước"; (f) `parseVnd` gom khoảng trắng, `normalizeKycValue` chỉ nhận chữ số | CL3-A13, A14, A15, A16, A17 (L), CL3-A20 (N) | L | 🧪 ✅ | L3-A (a, b, d), L3-B (e, f), L3-C (c) |
| 127 | Gói D: dòng cuộc gặp của Dòng thời gian (`wrap-anywhere` của #669) không test nào giữ; gỡ đi thì link trong ghi chú cuộc gặp tràn 189 px mà e2e xanh | CL3-D4 (L) | L | 🧪 📏 | L3-E |
| 128 | Gói E: (a) màn Dọn sạch — dọn "không theo bộ lọc", chữ xác nhận đúng nghĩa (chữ thường, dấu cách, NFC), hộp "Đang dọn…" không đóng được / Hủy tắt: 6 đột biến sống cả e2e. Hộp Nạp lại có e2e cho phần này (`dialog-keyboard.spec.ts:135`); hộp dọn chép khung (KNOWN #710) mà không chép test. (b) Chỗ nối hộp 6f ↔ `editedDay` (DR6-91): đổi lời gọi thì ca E19 hiện lại chuyển nhóm giả mà cả 237 e2e xanh | CL3-E3, CL3-E4 (L) | L | 🧪 📏 | L3-F |
| 129 | Bộ e2e không ghim đồng hồ. Từ T-126, ngày ghim chạy theo đồng hồ máy (`app-data.ts:254-260`), và 22 / 27 file spec không đặt `page.clock`. Test vắt qua nửa đêm đọc 16/09 thay 15/09 và đỏ: chính là hai flaky của cổng bước chuẩn bị (`full-cycle.spec.ts:178`, `team.spec.ts:458`). `e2e/anchor.ts:3-4` ("expectations never read the machine clock") sai từ T-126. Cục bộ `retries` 0 → đỏ thật | CL3-F1 (L), CX3-F1 (L) | L | ✅ 📏 | L3-J |
| 130 | Công cụ `notes-core` (T-261): đường dẫn thư mục trùng thư mục của Issue, ngoặc nhiều nhóm — 2 đột biến sống cả bộ | CL3-F2 (N) | N | 🧪 | L3-J |

### 6.8 Tài liệu, bloat (Nit)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 131 | Mockup 6d (`appointment-forms.html:244`) và NT-LH-25 (`nghiem-thu-v1.md:135`) ghi "1,234 tr → 1.234.000 ₫". App đọc 1.234.000.000 ₫, đúng quyết định Owner 27/09 (§5.1). Mockup viết trước quyết định, nghiệm thu chép theo mockup, nên Owner chạy NT-LH-25 ở G7 sẽ thấy "sai" | CL3-A1 (L) | N | 🔁 📄 | L3-K |
| 132 | Tài liệu / chú thích chưa theo Dọn sạch. (a) Còn nói ghi chú KYC / dữ kiện / phân tích AI không bao giờ xóa (`CONTEXT.md:38`, spec Phase 3 §2, §3.8, §3.9, `phase-5-ai.md:295`, `schema.ts:237`, `:257`, `:326`, `05-ho-so-kh.md:24`, mockup `kyc-forms.html:134`), trái phụ lục ADR-0008 + TR-11. (b) `packages/db/CLAUDE.md:13` chưa nói trigger 0011 đọc bảng `customers`, nên migration "dựng lại bảng" `customers` sau này sẽ hỏng ở RENAME (phải DROP / tạo lại trigger) | CL3-A23 (N), CL3-A22 (N) | N | ✅ 📄 | L3-K (tài liệu), L3-C (`schema.ts`, `packages/db/CLAUDE.md`) |
| 133 | `docs/user-guide/06-ai.md:49` lấy ví dụ chip `discovery@2`; app nay ghi `discovery@3` (K28) | CL3-C6 (N) | N | ✅ | L3-K |
| 134 | Luật DR-43 "trước ngày tạo KH, nhóm của ngày = nhóm tạo KH" viết ba lần (`stageOnDay` SQL, `isStageOfDay`, `outcome-form.ts:106`), trong khi cùng đợt sửa vừa gộp D7 ×3 (DR6-103). Bản ở `stageOnDay` không test nào giữ (DR6-126). Ba bản hiện lệch 0 / 5 924 lần | CL3-A26 (N) | N | ✅ 📏 | L3-A |

## 7. Bloat và hiệu năng

### 7.1 Exe release ở SHA ghim — mọi thao tác trong ngưỡng

`common\baseline.md` (probe `e2e/perf`, Home PC; mốc so: `docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json`, plan §L3.6):

| Thao tác | Mốc sau #656 (`dae9df3`) | Lượt 2 (`4217ed4`) | Lượt 3 (`119e2e4`) | Ngưỡng `phase-6.md` | |
|---|---|---|---|---|---|
| `app.open-data` | 387 ms | 301 ms | 373 ms (−4 % so mốc; +24 % ⚠️ so lượt 2 = `integrity_check`, K24) | ≤ 600 ms | ✅ |
| `reload.*` (6 màn) | 283–398 ms | 247–355 ms | 280–392 ms | < 500 ms | ✅ |
| `trash.open` | 34 ms (đã ngắt DevTools) | 73 ms (gắn DevTools, không so được) | 38 ms | < 200 ms | ✅ |
| `customer.open-ai` / `customer.ai-history` | 19 / 2 ms | 18 / 2 ms | 19 / 2 ms | < 200 ms | ✅ |
| Các thao tác màn còn lại (lịch hẹn, KH, Tổng quan, Báo cáo, lọc Thùng rác) | 6–23 ms | 5–22 ms | 6–22 ms | < 200 ms | ✅ |
| `backup.read` / `backup.import` / `backup.export` | 835 / 43 / 438 ms | 814 / 43 / 422 ms | 827 / 47 / 425 ms | ≤ 2 000 / 500 / 1 000 ms | ✅ |
| `reports.export-excel` | 20 ms | 27 ms | 23 ms | ≤ 500 ms | ✅ |
| `appointments.next-month` / `next-year` | 101 / 107 ms | 99 / 106 ms | 103 / 106 ms | ≤ 300 ms; Năm − Tháng ≤ 50 ms | ✅ |
| `db.save` | 151 ms | 147 ms | 146 ms | ≤ 400 ms | ✅ |
| JS heap | 16,5 MB | 16,5 MB | 16,6 MB | ≤ 21 MB | ✅ |
| Mở lần đầu (gọi exe → màn đầu có số liệu, LCP) | 3 663 ms | 3 526 ms | 3 614 ms | xấu hơn khi > 4 396 ms; "không chậm hơn exe Phase 4" > 4 724 ms | ✅ |

So mốc sau #656: **không dòng nào ⚠️**. So lượt 2 cùng máy chỉ `app.open-data` ⚠️ (1 mẫu); `reload.*` +34…+38 ms. Cả hai cùng hướng với chi phí `integrity_check` có chủ ý (K24), mà mốc sau #656 đã gồm.

### 7.2 Hàm thuần trong Node (dữ liệu tải lượt 3; so lượt 2 cùng máy)

| Hàm | Lượt 3: Claude F (Codex, khi có) | Lượt 2 Home PC | Ngưỡng / luật nhiễu |
|---|---|---|---|
| `importBackup` | 728,5 ms (Codex A 760,4) | 731,1 | ≤ 1 100 ms ✅ |
| `listAppointments` (10 255 lịch) | 44,1 ms (Codex A lần đầu 59,0; đo cặp cũ / mới cùng DB: 48,1 / 48,0 — nhiễu) | 44,7 | ≤ 65 ms ✅ |
| `teamCompare` năm / tháng | 2,64 / 1,49 ms (Codex E 2,66 / 1,45) | 2,95 / 1,46 | ≤ 15 ms ✅ |
| `reportRows` năm / tháng | 7,94 / 5,52 ms (Codex E 8,15 / 6,22) | 7,51 / 5,93 | ≤ 15 ms ✅ |
| `monthGrid` | 0,76 ms | 0,77 | ≤ 2 ms ✅ |
| `countRecords` | 4,69 ms | 5,02 | ≤ 15 ms ✅ |
| `listTrash` (113 dòng) | 25,3 ms (Claude A 25,5; Codex E 26,4; Codex đo cặp 25,6 so 19,9) | 20,95 | +4–6 ms (+21–28 %), dưới 10 ms → trong nhiễu; là `keptRecords` mới (KNOWN #709, CL3-A29) |
| `exportBackup` | 165,5 ms | 170,4 | exe ≤ 1 000 ms ✅ |
| Một lệnh ghi + đọc lại đủ 6 bảng | 65,9 ms | 66,9 | màn < 200 ms ✅ |
| Phần AI của hồ sơ KH (KH nhiều phân tích nhất) | 0,37 ms | 0,37 | ✅ |
| Bộ nhớ: 8 lần `readBackup` + `importBackup` | `rss` 491–495 MB, heap 55,6–56,0 MB, không tăng | 502–506 / 55,6–55,9 | không rò |

- Không hàm nào xấu hơn lượt 2 cùng máy theo luật nhiễu (> 20 % **và** > 10 ms). Vòng đo vi mô `stageOnDay` × 1 481 KH (+10,5 ms, ≈ 7 µs mỗi lần) không phải thao tác người dùng.
- Code mới trong hộp: 6f +0,06 ms trung vị mỗi phím; Thùng rác 0,27 ms mỗi lần render; mở hộp 11i 13–18 ms (web).
- 9b đọc `personUsage` bằng SQL: 1,5–9 ms (KNOWN #669).
- Mọi thao tác màn của gói D, E trên bản web với dữ liệu tải ≤ 77 ms trung vị.

### 7.3 Dọn sạch Thùng rác (mới, chưa có mốc)

| Đo | Dữ liệu tải: 113 dòng | Thùng rác lớn: 1 313 dòng (+1 200 KH xóa) |
|---|---|---|
| Node `listTrash` trước khi dọn | 32,6 ms | 140,7 ms |
| Node `previewPurge` | 5,6 ms | 9,9 ms |
| Node `purgeTrash` cả `VACUUM` (transaction / `VACUUM`) | 93,8 ms (29,4 / 64,4) | 109,8 ms (105,3 / 5,0) |
| Node `listTrash` sau khi dọn | 10,8 ms | 2,1 ms |
| Cỡ file trước → sau | 14 069 760 → 13 410 304 B (−4,7 %) | 14 118 912 → 1 486 848 B (−89,5 %) |
| Exe: bấm "Backup rồi dọn sạch" → khung hình có thông báo 11j | 151,8 ms (`baseline.md`) | 148 / 150 ms (Claude B); 153,9 ms (Claude F, file exe lượt 2 qua 0011) |
| Exe: `trash.open` trước → sau (đã ngắt DevTools) | 38,9 → 9,6 ms | 151,9 → 3,7 ms |

- Số Node của `baseline.md` (5 lần) trùng trong nhiễu với số của Claude A, Codex A / B / E / F đo lại.
- So thao tác cùng đường hàng đợi thay thế, cùng máy: `backup.import` 47 ms, `backup.export` 425 ms, `backup.read` 827 ms, `db.save` 146 ms. Dọn sạch ≈ 150 ms, cùng cỡ một lần lưu.
- Spec không đặt ngưỡng (plan §L3.6) → đề xuất ở Q6.

### 7.4 Phát hiện P

Không có phát hiện P vượt ngưỡng hay xấu hơn mốc cùng máy. Chỉ có CL3-A29 (KNOWN #709, §8.4). Ghi để theo dõi, không phải phát hiện:

- `integrity_check` tăng tuyến tính theo cỡ file, ≈ 7,5 ms / MB (Claude B). Trên exe, `p2c:data-open` 366 / 453 / 546 ms ở 1× / 2× / 3× dữ liệu tải, nên chạm 600 ms ở ≈ 2× cỡ dữ liệu tải. Ngưỡng ≤ 600 ms chỉ áp cho dữ liệu tải → ghi vào `phase-6.md`.
- Thùng rác 1 313 dòng mở 449 ms trên bản web khi gắn DevTools; trên exe 152 ms. Đúng triệu chứng DR6-84 mà Owner chọn chữa bằng Dọn sạch (Q8 c); dọn xong còn 3–10 ms.

### 7.5 Bloat — không có code chết chạy được có chi phí đo được

| Đã chạy / đo | Kết quả | DR6 |
|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` (mọi package + app + e2e; hai bên) | 0 | — |
| `pnpm lint:deps` | 0 vi phạm, 320 module / 1 312 phụ thuộc (lượt 2: 315 / 1 277) | — |
| Export ↔ nơi dùng (cả hai bên) | Export mới của đợt sửa đều có nơi dùng sản phẩm; `PURGE_REMINDER`, `PurgeView` chỉ dùng trong file (họ DR6-66, KNOWN) | — |
| Code lặp (Claude F `dup-scan`) | Nguyên thân hàm: 1 nhóm (lượt 2: 2; hook `resolve` của `eval-ai.mjs` ≡ `load-data.mjs` đã hết nhờ T-265). Theo cấu trúc: 7 nhóm (lượt 2: 9; họ DR6-67). Mới của đợt sửa: luật DR-43 ×3, cột trỏ tới nhân sự ×4, đếm "kèm …" ×2, `PurgeDialog` ≈ `ReloadDialog` (KNOWN #710) | 114, 125, 134 |
| Code chết | Chỉ nhánh người đánh giá của `KEPT_PEOPLE` (≈ 70 B trong `index.js`) | 114 |
| Bundle (`pnpm build:web` của bước chuẩn bị) | JS / CSS 2 400 393 B (**+18 357**, gzip +4 645). Theo package (Claude F `split-build`): `app-routes` +5 748, `pkg-db` +5 403 (`purge.ts` ≈ +4 KB), `app-i18n` +4 087, `pkg-ai` +1 480, migration +1 414 (0011)…; **mọi dependency giống từng byte lượt 2** | — |
| Exe | 5 408 768 B (+4 096 so lượt 2); `cargo clippy -W pedantic` lib 20 cảnh báo (lượt 2: 19; mới một `doc_markdown` ở `ai.rs:341`), không cái nào là lỗi | — |
| Dependency | Không thêm / bớt / đổi phiên bản | — |
| Khóa i18n | 1 154 khóa (+41), 0 khóa không dùng, 0 khóa chỉ test dùng | — |
| Coverage | 99,05 / 97,04 / 98,97 / 99,28 % (lượt 2: 99,03 / 96,99 / 98,93 / 99,28) | — |

Đề xuất refactor bloat: DR6-114, DR6-134 (gộp khi chạm file, như DR6-103 lượt 2). DR6-25, 66, 67 vẫn hoãn (KNOWN). Công cụ nên có (G4, chỉ đề xuất): visualizer bundle, `cargo-bloat`.

### 7.6 Chất lượng test

- Hai bên áp lại đột biến sống của lượt 2 và "gỡ tạm" phần sửa của 13 PR code. Mọi luật sửa có test đỏ khi gỡ: Claude 503 / 591 đột biến bị giết, Codex 91 / 91.
- Đột biến sống không tương đương đã thành DR6-125…130. Chỗ hở tập trung ở **code mới của Dọn sạch**: tập giữ lại, D3, D11, màn 11h–11j.
- Còn hở ở **chỗ nối TSX**: dòng cuộc gặp của Dòng thời gian, lời gọi `editedDay` của 6f. Như lượt 2, Vitest không có DOM (thêm là G4), nên chỗ nối chỉ giữ được bằng e2e.
- Cổng e2e không ổn định qua nửa đêm (DR6-129).

## 8. Kế hoạch xử lý

### 8.1 Việc còn lại của T-267

1. **PR docs báo cáo gốc** → `docs/reviews/raw/2026-10-21/` (PR riêng, mở cùng lúc với PR này).
2. **Kiểm độc lập bằng log phiên** — xong (§10).
3. **Owner trả lời §9** → tạo 11 Issue theo §8.2: mẫu Task, milestone Phase 6, ≤ ~400 / ~800 dòng, "Bị chặn bởi" theo file dùng chung, kèm ghi chú OPEN cùng file (`notes-for`).
4. **PR riêng sau khi Owner quyết:**
   - `docs/state/review-notes.md`: sửa ghi chú #709 theo CL3-A29; thêm đường vào Dọn sạch cho mục OPEN #96; các quyết định §9.
   - `docs/metrics/phase-6.md`: số liệu deep review lượt 3, số Dọn sạch (§7.3), ngưỡng nếu Owner chọn (Q6), ghi chú `integrity_check` theo cỡ file (§7.4).
5. **Sau đợt sửa:** G7 — chạy lại cổng và probe trên SHA phát hành, chụp lại ảnh hướng dẫn, nghiệm thu, eval AI thật.

### 8.2 Nhóm sửa (sửa hết, Owner 19/10)

| Nhóm | DR6 | Việc | Cỡ ước lượng | File chính | Test chấp nhận | Rủi ro / nhãn | Bị chặn bởi |
|---|---|---|---|---|---|---|---|
| **L3-A** Khôi phục, mốc thời gian, nhóm của ngày | 104, 105, 106 (Q1), 134, 126 (a, b, d) | Nhánh E7 của khôi phục: chuyển nhóm sống mới nhất mang ngày sau ngày cuộc hẹn → `TRANSITION_BEFORE_LATEST`. Luật nhập chỉ nhận mốc dạng app ghi (`precision: 3`), đóng luôn thứ tự Thùng rác. Theo Q1: câu TR-3 + test ghim hai thứ tự khôi phục. Một hàm thuần "nhóm của ngày" cho lệnh / luật nhập / 6c–6f. Test: KH đổi nhóm sau ngày tạo, `reinstateTransition` seq, `ORDER BY date` | ≈ 15–30 SP + ≈ 150 test | `packages/db/src/{appointments,customers,backup-validation,trash}.ts` (+ test), `apps/desktop/src/routes/appointments/outcome-form.ts`, spec Phase 6 TR-3 | Ca A / B của CL3-A2 bị chặn, E7 cùng ngày vẫn qua; file có hai mốc khác dạng → `BACKUP_INVALID`; đột biến V68e, S05, `la-no-order` bị giết | med, `gate` (G2: TR-3) | — |
| **L3-B** Chữ, tiền, nhập backup | 107, 108, 109, 110, 111 (Q2), 112, 126 (e, f) | `valueOf` từ chối chuỗi bắt đầu bằng U+FEFF; `storedRawOutput` thay `\p{Cs}` bằng U+FFFD; 5a / 5c / 7a gửi chữ gốc; `parseVnd` / `parseQuickDate` / `parseBirthDate` đọc trên `normalizeText`; theo Q2 xử lý `\p{Cc}`; `byName` phân xử hòa bằng so mã. Dữ liệu giả lập nạp lại (K1) | ≈ 15–30 SP + ≈ 120 test | `packages/domain/src/{text,money,period,name-order}.ts` (+ test), `packages/db/src/{backup,ai-analyses,common}.ts` (+ test), `apps/desktop/src/routes/customers/{CustomerDialogs,KycDialogs}.tsx`, `customers-view.ts` | Các chuỗi của DR6-107…112 ra đúng ở lệnh, nhập backup, màn; đột biến `nn-no-cr`, `x-nfkc`, T7 / T8, MO8, KF3 bị giết | med, `gate` (G2: K25) | — |
| **L3-C** Dọn sạch: lưới an toàn và test | 113, 114, 125, 126 (c), 132 (b + chú thích `schema.ts`) | `PRAGMA recursive_triggers = ON` cạnh `foreign_keys` (+ ca `INSERT OR REPLACE` ở D11); một danh sách cột trỏ tới nhân sự dùng chung, bỏ nhánh người đánh giá; test tập giữ lại nhiều tầng, D3 với chuyển nhóm đã rút của cuộc gặp còn dùng, D11 khi Thùng rác có KH, đếm ghi chú SYSTEM, `updatePerson`; câu `packages/db/CLAUDE.md` về trigger đọc `customers`. Gộp ghi chú OPEN #709 cùng file (nhánh `VACUUM` lỗi, lần lưu sau `VACUUM`, `rowsOf`) | ≈ 10–30 SP + ≈ 200 test | `packages/db/src/{database,purge,team,counts,schema}.ts` (+ test), `packages/db/CLAUDE.md` | Mọi đột biến sống của DR6-125 bị giết; REPLACE trên dòng của KH đang dùng bị trigger chặn | med | — |
| **L3-D** Câu 9b, focus màn Team | 115 (Q3), 116 | Câu Thùng rác của 9b theo Q3; `DialogFocusFallback` cho các hộp của `TeamScreen`, `Members` khóa theo team | ≈ 10–30 SP + ≈ 60 test / e2e | `apps/desktop/src/i18n/vi.ts`, `routes/team/{team-view.ts,TeamScreen.tsx}` (+ test), `e2e/team.spec.ts`, NT-TM-16, `docs/user-guide/08-team.md` | Câu 9b đúng ở các ca C1–C8 của CL3-A3 và ca NT-TM-16; e2e bàn phím: sau 9a / 9b / 9c / thêm TL, `activeElement` ≠ `BODY`, không nằm trên nút của team khác | low | L3-C (nếu Q3 b: `team.ts`) |
| **L3-E** Chuỗi liền dài, panel AI | 117, 118, 127 | `min-w-0 wrap-anywhere` cho ô Ghi chú thẻ Lịch hẹn, giá trị 7a / 7c / 7d, tên KH, `Item` của panel AI; bảng lịch sử cho ô Prompt xuống dòng, badge không co | ≈ 10–20 SP + ≈ 60 e2e | `routes/customers/{CustomerAppointments,KycDialogs,CustomerProfile,KycHistory,KycIntelligence}.tsx`, e2e `customer-kyc`, `customer-ai-web` | Link 108 ký tự ở ghi chú cuộc gặp, 7a, tên KH và chữ AI không tràn ở 1 440 / 1 100; badge CURRENT trong khung ở 1 440; R82e bị giết | low | L3-B (cùng `KycDialogs.tsx`) |
| **L3-F** Tên nút, test màn Dọn sạch và 6f | 119, 128 | FYP trong `policies.issueLabel` / `editLabel`; trạng thái trong tên nút khôi phục; e2e hộp dọn: bộ lọc + ô tìm, chữ xác nhận (thường, dấu cách, NFD), đang dọn (Escape ×3, Hủy tắt); e2e 6f ca E19 | ≈ 5–10 SP + ≈ 120 e2e | `routes/customers/CustomerPolicies.tsx`, `routes/trash-view.ts` (+ test), `vi.ts`, e2e `trash`, `customer-policies`, `appointment-outcome` | Hai HĐ cùng ngày khác tên nút; R84e–j, R04g-tsx bị giết | low | L3-D (cùng `vi.ts`) |
| **L3-G** Lưu file: quyền ghi | 120 | Lúc mở thử quyền ghi + xóa của `project2c.db` (ACL lẫn thuộc tính) → `ACCESS_DENIED`; lúc lưu, đổi tên lỗi mà file chỉ đọc / không có quyền xóa → mã riêng + câu dải lưu riêng | ≈ 20–40 SP (Rust) + ≈ 60 test | `apps/desktop/src-tauri/src/storage.rs` (+ test), `apps/desktop/src/data/tauri-storage.ts`, `shell/SaveWarning.tsx`, `vi.ts` | ACL cấm ghi / xóa → từ chối mở; chỉ đọc bật giữa phiên → câu riêng, không "chương trình khác" | med, `build-exe` | L3-F (cùng `vi.ts`) |
| **L3-H** AI Mock trích xuất | 121 | Bỏ cụm khi trong câu có (sau cụm) "chưa / không" của câu hỏi hay "?", từ phỏng đoán, "của <người khác>" sau "<n> con / cháu", "ly hôn" sau "kết hôn", "người" trước "đã kết hôn / độc thân", "con" + đồ vật. Gộp ghi chú OPEN #682 cùng file ("chỉ ghi lại" + test hở) | ≈ 15–30 SP + ≈ 60 test | `packages/ai/src/mock-adapter.ts` (+ test) | Các câu của CL3-C2 và của ghi chú #682 → 0 đề xuất; ghi chú thật cho đề xuất như cũ (0 / 3 551 khác) | low | — |
| **L3-I** Đợt G5 lượt 3 | 122, 123, 124 (Q4) | PR docs G5 trước (§12 mới của `phase-5-prompts.md`), rồi code: bước 0 bỏ dấu tổ hợp không đứng sau chữ cái; nhận diện tin nhắn của app tách dòng ở U+0085 / U+2028 / U+2029; chữ có dạng không dấu là âm tiết thật chỉ khớp không dấu khi cả cụm không dấu; miễn "định", "giới" trước "luật". Version prompt theo G5 | ≈ 10–20 SP + ≈ 80 test | `docs/design/phase-5-prompts.md`, `packages/ai/src/{text-match,blocklists,web}.ts` (+ test) | Các câu của DR6-122…124 ra đúng; 1 085 chuỗi eval và `vi.ts` không đổi kết quả | med, `gate` (G5) | — |
| **L3-J** Đồng hồ e2e, công cụ | 129, 130 | Mọi test e2e ghim đồng hồ trang lúc mở (fixture chung, `page.clock.install` ở giữa buổi sáng ngày neo); test cần qua nửa đêm tự `fastForward`; sửa comment `anchor.ts`. Hai ca test `notes-core` | ≈ 0–5 SP + ≈ 40–80 test | `e2e/{support,anchor}.ts`, các spec dùng fixture, `tools/notes-core.test.mjs` | `full-cycle.spec.ts` xanh khi bắt đầu 23:59:50 (`timezoneId`); T61f, T61k bị giết | low | — (**làm trước**) |
| **L3-K** Tài liệu | 131, 132 (a), 133 | Mockup 6d (câu help) + NT-LH-25 theo quyết định Owner 27/09; vế "trừ Dọn sạch Thùng rác (TR-11, phụ lục ADR-0008)" ở `CONTEXT.md` và spec / hướng dẫn / mockup của DR6-132; `06-ai.md` `discovery@3`. Gộp ghi chú OPEN tài liệu cùng file (spec Phase 3 dòng 175 còn luật K20 cũ, `phase-5-ai.md:78`, `docs/README.md:22`, `mockups/index.html:150`) | tài liệu | `docs/design/mockups/{appointment-forms,kyc-forms}.html`, `docs/testing/nghiem-thu-v1.md`, `CONTEXT.md`, `docs/design/phase-{3-du-lieu,5-ai}.md`, `docs/user-guide/{05-ho-so-kh,06-ai}.md` | Mỗi dòng của DR6-131…133 khớp app | low | — |

Tổng: **11 Issue**, ≈ 110–245 dòng SP + ≈ 1 000 dòng test, phần lớn là test. Một nhóm `build-exe` (L3-G); ba nhóm có cổng (L3-A G2, L3-B G2, L3-I G5).

### 8.3 Thứ tự, ước lượng

1. Owner trả lời §9 (một lượt).
2. **L3-J trước** (đồng hồ e2e), vì mọi PR sau và cổng SHA phát hành đều chạy e2e.
3. Song song theo file: L3-A, L3-B, L3-C, L3-H; L3-I (PR docs G5 trước, Owner duyệt, rồi PR code).
4. Sau đó, theo file dùng chung: L3-E sau L3-B (`KycDialogs.tsx`); L3-D → L3-F → L3-G (`vi.ts`; L3-G build exe một lần); L3-K bất kỳ lúc nào.
5. G7: chạy lại cổng và probe trên SHA phát hành (so mốc sau #656), chụp lại ảnh hướng dẫn, nghiệm thu, eval AI thật với version prompt cuối.

Mỗi Issue một phiên, review phiên sạch như thường. Ước ≈ 2–3 ngày làm, tùy số PR `risk:med` Owner phải merge (L3-A, B, C, G, I).

### 8.4 KNOWN có bằng chứng mới, không đánh số DR6

| Phát hiện | KNOWN | Bằng chứng mới | Đề xuất |
|---|---|---|---|
| CL3-A29 (N, P) | Sổ OPEN #709 `purge.ts:185` ("`KEPT_PEOPLE` quét cả bảng `appointments` ba lần") | Query plan: SQLite đẩy `json_each` vào từng nhánh, `KEPT_PEOPLE` / `KEPT_TEAMS` chỉ 0,05 / 0,02 ms; phần tốn là bước gốc của `KEPT_APPOINTMENTS` (`SCAN a`, ≈ 4,5 ms mỗi lần `listTrash`, kể cả khi Thùng rác trống) | Sửa chữ ghi chú sổ theo số đo (PR sổ của T-267). Tối ưu khi chạm file (L3-C có thể bỏ qua CTE khi không có lịch đã xóa); +4–6 ms nằm trong nhiễu |
| CL3-B2 (N, C) | Sổ OPEN #96 / #87: sau một lần lưu lỗi, "Nạp lại" bị từ chối mà không có cách thử lưu lại | Đường vào mới do #710: Dọn sạch dùng chung `backUp`, câu 11j D7 chép mẫu của Nạp lại / Nhập | Q5 |
| CL3-C7 (L, D) | K1 + quy tắc R2-02 | File dữ liệu lượt 2 có dòng AI mà V1 cũ cho qua: panel AI và chi tiết lịch hẹn của KH đó ném `ZodError` khi render (không chỉ nhập backup bị từ chối) | Q5 |
| Claude F K2 (không ghi phát hiện) | K1 | Dữ liệu tải của code lượt 1 mở được, nhưng bản xuất của nó không qua luật nhập 4 mới (K18 / K22) | Không làm (dữ liệu giả lập nạp lại) |

## 9. Câu hỏi cần Owner quyết

Mỗi câu có đề xuất; Owner đồng ý mà không ghi gì khác thì lấy đề xuất. Mọi câu chỉ là **chọn cách sửa** (Owner đã chốt sửa hết).

1. **DR6-106 — khôi phục "R rồi X cùng ngày".** (a) Giữ hành vi (trạng thái cuối trùng "ghi R rồi X, không xóa gì"; ngược thứ tự thì bị chặn như E20). Thêm câu vào TR-3: "chuyển nhóm được đưa lại khi khôi phục giữ chỗ của nó trong thứ tự ghi; khôi phục theo thứ tự đã ghi thì được, ngược lại bị chặn như E20". Thêm test ghim hai thứ tự (≈ 20 dòng). (b) Đổi luật (G2): khi đưa lại dòng đã rút mà KH còn dòng đã rút có `seq` lớn hơn, cấp `seq` mới để E20 chặn X (≈ 3–6 dòng SP + 30–40 dòng test). **Đề xuất: (a).**
2. **DR6-111 — ký tự điều khiển C0 / C1 trong tên / giá trị KYC (mở rộng K25, G2).** (a) `normalizeText` bỏ mọi `\p{Cc}` còn lại (như ký tự vô hình; khoảng trắng như tab, xuống dòng vẫn gộp như nay). (b) Coi là `INVALID_TEXT` như NUL. (c) Giữ như nay. Cả (a), (b): lệnh, nhập backup, UI cùng hàm; G5 §11.2 (V3–V6 dùng `normalizeText`) nhận luôn; dữ liệu giả lập nạp lại (K1). **Đề xuất: (a).**
3. **DR6-115 — câu Thùng rác của hộp 9b.** (a) Chỉ sửa chữ, câu luôn đúng: đưa "dọn sạch Thùng rác" lên trước và nói rõ phạm vi của vế khôi phục. RE: "…; khôi phục KH rồi chuyển sang RE khác chỉ chuyển được lịch Dự kiến". Người hỗ trợ: "…; khôi phục KH thì sửa được lịch đã có kết quả (Sửa kết quả), lịch Dự kiến / Dời lịch chỉ dọn sạch mới gỡ". Sửa NT-TM-16, `08-team.md`, test (≈ 5–10 dòng SP). (b) `personUsage` báo thêm loại bản ghi của KH đã xóa, hộp chỉ nêu vế khôi phục khi nó gỡ được (≈ 20–40 dòng SP + test, chạm `team.ts`). **Đề xuất: (a).**
4. **DR6-122, 123, 124 — đợt G5 lượt 3.** (a) Sửa cả ba trong một đợt G5 (§12 mới của `phase-5-prompts.md`, Owner duyệt ở PR docs trước PR code):
   - bước 0 bỏ dấu tổ hợp không đứng sau chữ cái (sau NFKC);
   - nhận diện tin nhắn của app tách dòng ở U+0085 / U+2028 / U+2029 như `normalizeNote`;
   - chữ của mục "Bỏ dấu: có" mà dạng không dấu là âm tiết thật ("ấm", "lạnh", "nội", "ít") chỉ khớp dạng không dấu khi cả cụm không dấu;
   - miễn "định", "giới" đứng trước "luật".

   Version prompt theo quyết định G5 (đổi luật kiểm như `@3` thì `@4`; eval AI thật ở G7 chạy với version cuối). (b) Không sửa code: ghi các dạng này vào phần "Mất" / "chặn nhầm đã biết" của G5. **Đề xuất: (a).**
5. **Hai mục KNOWN có bằng chứng mới (§8.4).**
   - CL3-B2: (a) giữ mục OPEN #96 (sau một lần lưu lỗi, người dùng làm một thay đổi khác hoặc đóng app thì có Thử lại), thêm đường vào Dọn sạch vào ghi chú sổ. (b) Làm nút "Thử lưu lại" (`saves.flush()`) cạnh câu từ chối của Nạp lại, Nhập backup và Dọn sạch (G3, ≈ 20–30 dòng).
   - CL3-C7: (a) giữ K1 + R2-02 (dữ liệu giả lập; xem lại khi có dữ liệu khách hàng thật). (b) `analysisContent` đọc bằng `safeParse`, dòng không đọc được hiện như REJECTED (≈ 10 dòng).

   **Đề xuất: (a) cả hai.**
6. **Ngưỡng Dọn sạch (plan §L3.6 giao phiên tổng hợp đề xuất).** (a) Thêm vào `phase-6.md`: "bấm Backup rồi dọn sạch → thông báo 11j ≤ 500 ms trên dữ liệu tải (exe)" — như `backup.import`, ≈ 3× số đo 150 ms. Ở G7 đo tay như lượt này. (b) Như (a) và thêm thao tác `trash.purge` vào probe `e2e/perf` (L3-J, ≈ 30 dòng). (c) Không đặt ngưỡng. **Đề xuất: (a).**

## 10. Kiểm độc lập và tuân thủ quy trình

Theo nội dung báo cáo:

- **SHA và `git status`:** cả 12 báo cáo ghi `119e2e4` đầu / cuối phiên. `git status --short` đầu / cuối như nhau: `Project-2C-review` rỗng; `Project-2C-review-2` chỉ có `AGENTS.md`, `.codex/`, `.agents/` của Codex (plan §8). Phiên tổng hợp kiểm lại 21/10: cả hai worktree ở `119e2e4`, status như trên.
- **Không gọi AI thật, không đọc key:**
  - Mọi probe AI dùng Mock, `fetch` giả hoặc server loopback, key giả.
  - Mọi probe trình duyệt / exe chặn mạng ngoài 127.0.0.1 và thay `window.open` từ lần chạy đầu ("requests blocked: []", `externalBlocked=[]`).
  - Exe chạy bản chép với cổng debug riêng (9371 / 9372, 9381, 9447, 9467); không đo khi bên kia đang đo; không ai dùng cổng 4173 / 9222 ngoài bước chuẩn bị.
- **Khuôn báo cáo:** đủ mục §L3.8 ở cả 12 báo cáo; gói F của cả hai có bảng R gộp 39 DR6 và kết luận.

### 10.1 Kiểm bằng log phiên (plan §8, §L2.10, §L3.10)

Làm 21/10 trên Home PC. Log đọc bằng CLI local, không gọi model. Script `node` quét **đầu vào lệnh công cụ** (không quét prompt hay kết quả trả về) theo danh sách §8, §L2.10, §L3.10, rồi xét tay từng chỗ khớp.

| Bên | Log | Phiên | Lệnh công cụ |
|---|---|---|---|
| Claude | transcript `projects\C--workspace-Project-2C-review\*.jsonl`. Ở `.claude-c`: A lần đầu (01:34, 4 lệnh), A phiên chính (01:37–07:26, 123 lệnh, 3 lần gọi Workflow) + 79 transcript subagent, A làm tiếp, B, C, F, một phiên mở trống 21:27 (0 lệnh). Ở `.claude-b`: D. Ở `.claude`: E | 8 phiên gói + 1 phiên trống; 79 subagent | 4 679 (A 4 + 123 + 3 320 subagent + 125 · B 187 · C 215 · D 194 · E 296 · F 215) |
| Codex | `.codex\sessions\2026\10\20\rollout-*.jsonl` (C, F làm tiếp ngày 21/10 vẫn ghi vào file cũ) | 6 phiên chính + 6 phiên con 0 lệnh (mỗi gói một, như lượt 1–2) | 416 (A 71 · B 63 · C 67 · D 74 · E 83 · F 58) |

**Không phát hiện nhiễm và không phát hiện vi phạm chỉ đọc.**

- **Thư mục của bên kia:**
  - Claude, 1 lần: lệnh gộp `cat prompt-claude.md; ls -la common/ claude/ codex/` lúc 01:34, chạy trước khi đọc quy tắc 1. Kết quả chỉ là tên / cỡ / giờ của `codex\A.md`, `A\`, `B.md`, `B\`; không mở file nào. Phiên dừng ngay, ghi memory "lệnh đầu chỉ đọc file prompt", báo Owner. Gói A làm ở phiên mới (01:37).
  - Một subagent đo hiệu năng của Workflow 2 thấy chuỗi đường dẫn `…-r3\codex\C\server.mjs` trong danh sách tiến trình khi kiểm tải máy (tự khai, không mở).
  - Codex: 0 lần.
  - → Không nội dung nào của Codex lọt vào Claude: tên file không cho biết phát hiện, và Codex A, B không có phát hiện nào. Ghi là lệch quy tắc 1 ở mức thủ tục.
- **Liệt kê / tìm kiếm cấp gốc** (`C:\workspace\`, `deep-review-1-6*\`): 0 lần; chỗ khớp là chữ trong báo cáo. Claude E chạy một `Grep` trên `common\` (thư mục được phép đọc; tự khai).
- **Ghi vào worktree:**
  - Claude B (`mutpatch.mjs`, 3 file test đọc bằng `readFileSync`) và Claude C (`mut.mjs`, `build-dist.mjs`): vá → chạy test → trả nguyên byte, kiểm sha256 = `HEAD`. Quy tắc chung 1 cho phép.
  - Claude A, D, E, F dùng `load` hook của Vite: 0 lần ghi.
  - Codex không vá repo (chạy bản chép); Codex B chạy `cargo test --target-dir` vào thư mục build bị ignore của repo.
- **`gh`, `git push`, git ghi:** 0 lần. Chỗ khớp là git chỉ đọc (`diff`, `show`, `log`, `blame`, `grep`, `status`, `merge-base`) và chữ trong báo cáo.
- **Đổi quyền:** Claude B dùng `icacls /deny` và `attrib +R` trên bản chép trong thư mục của mình (`claude\B\rs\`, `exe\`) để dựng ca ACL / chỉ đọc (K12, K13), gỡ ngay sau mỗi ca. Không chạm repo hay thư mục khác.
- **AI của sản phẩm:** 0 lần chạy `eval:ai` / `eval-ai.mjs` / `cmdkey` / chatgpt.com; chỗ khớp là `git diff` của `tools/eval-ai*.mjs` và chữ báo cáo.
- **Lồng subagent:** 0 lệnh Agent / Workflow trong 79 transcript subagent của Claude A.
- **`pnpm` trong bản chép:** Codex C (tự khai) chạy `pnpm exec vitest` ở bản chép. pnpm tự kiểm cài đặt, đổi 8 junction `@p2c` trong `node_modules` của `Project-2C-review-2` sang bản chép. Codex C tự khôi phục từng junction, rồi kiểm deps 320 / 1 312, typecheck và 929 unit xanh trên nguồn gốc; Codex F kiểm lại 8 junction trỏ về repo. Không ảnh hưởng Claude (worktree khác). Claude: 0.

**Ghi nhận quy trình** (không đổi phát hiện nào):

1. **Owner đổi cách chạy phần Claude 20/10:** mỗi gói một phiên sạch như lượt 2, effort / ultracode do Owner chọn từng phiên, thay Workflow A → F của §L3.7 / Phụ lục I. PR này ghi quyết định vào plan §L3, ADR-0001 M9, spec Phase 6 §6, `PROJECT-STATE.md`, `CLAUDE.md`, `docs/decisions/README.md`.
2. **Claude A, phiên đầu, ultracode + 2 Workflow** (đúng `prompt-claude.md` bản 20/10: chỉ phiên chính làm bước 0 và ghi `A.md`).
   - Bị cắt hai lần: hết hạn mức ≈ 03:40, resume cùng phiên 06:21 bằng `resumeFromRunId`; dừng ≈ 07:23 khi hai agent chưa trả kết quả.
   - Phiên làm tiếp 18:58 (`max`, không ultracode) chạy lại probe của hai agent đó rồi viết mục 6.2.
   - 4 mục (A26–A29) chưa qua người kiểm thứ hai của Workflow; phiên tổng hợp đã kiểm trên code (§6).
3. **Codex C, F bị ngắt**, làm tiếp theo tin nhắn "tiếp tục" của Owner (log lặng: C 01:55 → 07:26; F 20:12 → 22:33 và ≈ 1 h 45 sau đó). Cả hai tự ghi việc làm tiếp ở mục 1.
4. **Thư mục cấu hình `.claude*`:** D ở `.claude-b`, E ở `.claude`, các gói khác ở `.claude-c`. Mỗi gói một phiên, nên không phiên nào đổi thư mục giữa chừng (khác lượt 2).
5. **Hai flaky e2e của bước chuẩn bị** (`full-cycle.spec.ts:178`, `team.spec.ts:458`) là DR6-129, không phải lỗi môi trường.
6. **Bước chuẩn bị:** dữ liệu tải nhập vào exe bằng script qua cổng debug (`perf\import-load.mjs`) thay Owner bấm tay (Owner đồng ý 20/10).
7. **Codex không ghi được model / mức suy luận** ("GPT-6 theo hệ thống"), như lượt 1–2.

**Cho lần sau:**

- Prompt nên ghi "lệnh đầu tiên chỉ đọc file này, không gộp lệnh khác". Lỗi 01:34 xảy ra trước khi đọc tới quy tắc 1; memory chỉ có trên Home PC.
- Trong bản chép repo, không chạy `pnpm` kể cả `pnpm exec`: gọi thẳng `node node_modules/<gói>/<cli>`, như Codex làm sau sự cố. Bài học lượt 2 chỉ nói `pnpm install`.
- Tới khi DR6-129 sửa: không chạy cổng e2e vắt qua nửa đêm.

## 11. Ghi chú phương pháp

- Phiên tổng hợp (Home PC, 21/10) đọc đủ 12 báo cáo, gộp theo vị trí code + hậu quả, rồi kiểm mọi phát hiện trên code ở `98d0016` (code = `119e2e4`).
- 🔁 chạy lại hai probe Node (`tools/ts-hooks.mjs`, `sql.js` của repo):
  - `sql.js` ghi / đọc `"\uFEFFBến"`, `"B\uFEFFến"`, `"\uD83D\u200B\uDE00"`, `"x\uD800y"`: BOM đầu chuỗi mất khi đọc nhưng còn trong byte; nửa lẻ đọc thành U+FFFD và mất đuôi (DR6-107, 108);
  - `parseVnd('1,234 tr')`, `parseVnd` với U+200B / U+0085 / U+2800 / U+2060 trên chữ gốc và chữ đã `normalizeText`, `normalizeText` với U+0007 / U+0001, `normalizeNote('a\rb')`, `byName('Team 01', 'Team 1')` (DR6-131, 110, 111, 126, 112).
- Đọc lịch sử để chấm hai mục: Issue #106 (quyết định G8 27/09 về dấu phẩy) cho DR6-131; `git show 4217ed4:…/EditOutcomeDialog.tsx` cho DR6-91.
- Các phát hiện còn lại: đọc lại đúng chỗ code + bằng chứng (probe / đột biến / ảnh) của reviewer. Với test hở, đọc test hiện có để thấy chỗ hở khớp mô tả. Không đo lại exe: bước chuẩn bị và hai bên đo cùng máy, số khớp nhau.
- Số đo Node của hai bên chạy song song, có lúc trùng thời gian; chỉ so ngưỡng và so lượt 2 cùng máy theo luật nhiễu. Hai bên đều đo lại `listTrash` theo cặp cũ / mới cùng DB để tách phần `keptRecords`.
- Không bác phát hiện nào. Phiên tổng hợp hạ một mức (CL3-A1), đổi một kết luận R (DR6-91), không nhận một mục KNOWN mà reviewer nêu (CX3-C1), giữ một mục KNOWN mà reviewer muốn sửa (CL3-C7, theo R2-02).

## Phụ lục — đối chiếu ID của từng báo cáo ↔ DR6

Mỗi phát hiện của 12 báo cáo (54) có đúng một dòng ở đây.

| Báo cáo | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| **Claude** (48) | A1→131 · A2→104 · A3→115 · A4→107 · A5→108 · A6→109 · A7→110 · A8→111 · A9→113 · A10→125 · A11→125 · A12→125 · A13→126 · A14→126 · A15→126 · A16→126 · A17→126 · A18→125 · A19→106 · A20→126 · A21→105 · A22→132 · A23→132 · A24→112 · A25→114 · A26→134 · A27→114 · A28→105 · A29→KNOWN #709 | B1→120 · B2→KNOWN #96 | C1→118 · C2→121 · C3→122 · C4→124 · C5→124 · C6→133 · C7→KNOWN K1 | D1→115 · D2→116 · D3→117 · D4→127 | E1→119 · E2→119 · E3→128 · E4→128 | F1→129 · F2→130 |
| **Codex** (6) | — | — | C1→123 | D1→116 · D2→117 · D3→117 | E1→119 | F1→129 |
