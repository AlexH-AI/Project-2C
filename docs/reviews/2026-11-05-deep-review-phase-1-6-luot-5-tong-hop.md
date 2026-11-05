# Tổng hợp deep review Phase 1–6, lượt 5 — Claude, Codex, DeepSeek (Home PC)

- **Ngày tổng hợp:** 2026-11-05 · **SHA được review:** `37a80b6` (`37a80b662861d308a110d1e2b0f65ad13b91fb51`) · kế hoạch `docs/process/deep-review-phase-1-6.md` §L5 (T-357 #1025, Owner duyệt G1 04/11) · Issue T-362 #1042 (`gate`).
- **18 báo cáo = 3 bên × 6 gói** (A lõi dữ liệu · B file và Rust · C AI · D màn nhập liệu · E lịch hẹn, chỉ số, quản lý · F xuyên gói, bloat / hiệu năng, công cụ), hai đợt trên **Home PC `DESKTOP-KDURKJP`**. Bước chuẩn bị 04/11 21:40 → 22:05. Code ở SHA ghim trùng exe ứng viên L3 `3d237b0`. Giờ máy, lấy từ log phiên:
  - **Claude** (đợt 1, 04–05/11): A 22:08–22:33 · B 22:34–23:04 · C 23:12–23:57 · D 00:09–00:49 · E 00:49–01:18 · F 01:19–02:14.
  - **Codex** (đợt 1, 04–05/11): A 22:09–22:30 · B 22:30–22:48 · C 23:12–23:29 · D 23:31–23:49 · E 00:10–00:27 · F 00:28–00:47.
  - **DeepSeek** (đợt 2, 05/11): A 09:48–10:06 · B 10:08–10:30 · C 10:33–10:56 · D 10:59–11:15 · E 11:59–12:21 · F 12:24–12:41.
- **Reviewer:**
  - Claude Opus 5.5 (`claude-opus-5-5`), mỗi gói một phiên sạch, mức `xhigh` ở cả 6 phiên (trường `effort` của transcript; báo cáo A, C, F ghi "không đọc được"), ultracode tắt (không subagent / Workflow).
  - Codex (Owner chạy; Codex Desktop). Log ghi model `gpt-6.1-sol`, mức `xhigh`, app-server `0.166.0-alpha.6`; báo cáo ghi `codex-cli 0.162.1`, là bản CLI cài trên máy. Mỗi gói còn một phiên `codex-auto-review` (bộ duyệt lệnh của Codex, mức `low`, 0 lệnh).
  - DeepSeek V4.1 Flash, bản 1017 (Owner chạy; `DeepSeek-V4.1-Flash`, context 1M, reasoning Max) trong app desktop WorkBuddy v5.9.4, gói WorkBuddy Pro, chế độ quyền **Default**. Mỗi gói một task qua **Code review expert** (`CodeReviewExpert`). Prompt cho dùng agent phụ của app: 0 gói dùng.
- **ID:** phát hiện `CLR5-<gói><số>` (Claude), `CXR5-…` (Codex), `DSR5-…` (DeepSeek); vấn đề đã gộp đánh số tiếp lượt 4: **`DR6-158…177`**.
- **Báo cáo gốc:** PR docs riêng #1043 → `docs/reviews/raw/2026-11-05/{claude,codex,deepseek}/{A…F}.md` + `common-known.md`, `common-baseline.md`, `common-fixes.md`. `common\plan.md` và ba `common\prompt-*.md` trùng kế hoạch ở `37a80b6` nên không chép. Bằng chứng (probe, đột biến, ảnh, log phiên của cả ba bên) ở `C:\workspace\deep-review-1-6-r5\` trên Home PC, giữ tới phát hành v1.0.

**Cách kiểm (ADR-0001 M2, M12):** phiên tổng hợp (Claude Opus 5.5, phiên chính; Owner không bật subagent) đọc đủ 18 báo cáo. Ba bảng R1 gộp thành một bảng 25 dòng, ba bảng R2 thành một bảng 28 dòng. Phiên đối chiếu trên code ở checkout chính (`main` = `37a80b6`, sạch) các mục sau: mọi kết luận khác ĐÃ SỬA, mọi chỗ các bên chấm khác nhau, và **mọi** phát hiện mới, kể cả của Codex và DeepSeek (dữ liệu tham khảo). 41 phát hiện gộp thành 20 vấn đề; 1 phát hiện bị bác. Cột "Kiểm":

- ✅ đọc đúng chỗ code, khớp mô tả;
- 🔁 phiên tổng hợp tự chạy lại (probe Node trên mã của repo qua `tools/ts-hooks.mjs`);
- 📏 số đo / probe của reviewer; 🧪 đột biến của reviewer; 📄 lệch tài liệu / mockup / spec.

Mức trong bảng là **mức chốt** theo thước plan §4.3, không theo mức bên đó gán.

## 1. Kết luận

| Bên | Kết luận ở gói F | Lý do chính |
|---|---|---|
| Claude | **CHƯA SẴN SÀNG** | 0 Critical / High / Medium; 16 phát hiện (9 Low, 7 Nit); DR6-145 SỬA MỘT PHẦN; K47 (sửa hết rồi G7) |
| Codex | **CHƯA SẴN SÀNG** | 0 Critical / High / Medium; 20 phát hiện (18 Low, 2 Nit); R1 2 SỬA MỘT PHẦN (DR6-139, 145), R2 5 SỬA MỘT PHẦN; K47 |
| DeepSeek | **CHƯA SẴN SÀNG** | 0 Critical / High / Medium; 5 phát hiện (3 Low, 2 Nit); DR6-145 SỬA MỘT PHẦN; K47 |

**Kết luận hợp nhất: CHƯA SẴN SÀNG cho v1.0 ở `37a80b6`.** Có ba lý do:

- quyết định "sau tổng hợp sửa hết mọi phát hiện, rồi G7" (Owner 04/11, K47);
- một dòng R1 còn SỬA MỘT PHẦN (DR6-145);
- 20 vấn đề mới.

Không có Critical / High / Medium. Tiêu chí spec Phase 6 §1 mục 3 ("mọi phát hiện từ Medium trở lên đã sửa") vì vậy đạt ở `37a80b6`. Phần còn lại Owner đã quyết sửa hết: 8 nhóm (§8.2), rồi G7 trên SHA sau đợt sửa.

Lần đầu cả ba bên cùng kết luận đúng. DeepSeek đã áp K47 theo bài học ghi trong prompt; ở review Phase 5 và lượt 4 nó kết luận SẴN SÀNG.

- **Ba đợt sau lượt 4 (đợt sửa lượt 4, mục sổ [G7], G7) không làm hỏng chỗ nào trước đó đúng: 0 HỒI QUY** (lượt 2: 3; lượt 3: 0; lượt 4: 0).
  - Mọi dòng R có code đều có test đỏ khi gỡ phần sửa. Ngoại lệ là các dòng chỉ tài liệu, ảnh hay nghiệm thu (đối chiếu chữ, số với app) và các chỗ hở đã thành phát hiện T.
  - Refactor không đổi hành vi: T-329 cho 61 703 / 61 703 dòng so sánh giống hệt. `readsBackAsIs` cho 0 khác trên 200 020 chuỗi. `listeners.ts` giữ thứ tự gọi. `byName` giữ thứ tự của `2e51e25`. Dữ liệu tải chỉ khác cột `prompt_version` (K43).
- **Bảng R1 (25 dòng): 24 ĐÃ SỬA · 1 SỬA MỘT PHẦN (DR6-145) · 0 CHƯA SỬA · 0 HỒI QUY. Bảng R2 (28 Issue): 28 ĐÃ SỬA** (§3).
  - DR6-145: cả ba bên chấm SỬA MỘT PHẦN. Mô tả DR6-145 (b) ở tổng hợp lượt 4 §6.4 có `←`, `–`, `…`, ngoặc kép cong và ký hiệu viết bằng escape. Issue #901 thu hẹp phạm vi: escape "ngoài phạm vi", không nêu bốn ký hiệu. Không quyết định Owner nào chốt bỏ phần này. Phần còn vào DR6-169.
  - Codex chấm khác ở 6 dòng (DR6-139; T-330, T-336, T-338, T-339, T-346). Phiên tổng hợp chốt ĐÃ SỬA cả 6: mô tả của DR6 và mục tiêu, test chấp nhận của Issue đều đạt; phần Codex thấy còn hở là biến thể ngoài mô tả, thành vấn đề mới (§3.1).
- **Phát hiện mới: 41 (Claude 16, Codex 20, DeepSeek 5) → 20 vấn đề `DR6-158…177`: 0 Medium · 13 Low · 7 Nit**; 1 phát hiện bị bác (CXR5-B1, §5.1); 0 mục KNOWN có bằng chứng mới.
  - 11 vấn đề có phần mới do ba đợt sau lượt 4: 9 hẳn (158, 164, 165, 167, 171, 174, 175, 176, 177), 2 một phần (166, 169). 9 có từ trước, lượt 1–4 bỏ sót.
  - Bảy mục chênh mức: CLR5-D1, CLR5-E3, DSR5-D2 Nit → Low; CXR5-A1, CXR5-C1, CXR5-C2, CXR5-F2 Low → Nit (§5.1).
  - Một phát hiện P: DR6-165 (Mock trích xuất sau T-330 / T-336). Lần gọi đầu và lượt trên cả bộ ghi chú thật chậm quá luật nhiễu, dưới ngưỡng 200 ms.
  - Phần lớn là hiển thị với đầu vào hiếm (tên liền dài, chữ dán có ký tự vô hình) và test hở của chính phần sửa. Không phát hiện nào làm mất hay sai dữ liệu đã lưu ở thao tác thường.
- **Ba bên bổ sung nhau** (§2.2). Claude thấy 13 / 20 vấn đề, Codex 11, DeepSeek 4. Mỗi bên có vấn đề chỉ mình thấy:
  - Claude 7: test hợp đồng capability, `isLabel`, phép thử chữ cái `worded`, chi phí Mock trích xuất, ô tìm, test hở gói E, test hở công cụ;
  - Codex 5: hai lần ghi chồng nhau khi listener gọi lệnh lồng, Mock bỏ lỡ đề xuất, rule `test-support` từ desktop, `auto-wait --since`, probe đếm "Đã gặp";
  - DeepSeek 2: dán chuỗi chỉ có ký tự vô hình vào khung ChatGPT web, nhánh chết của hàng đợi lưu.
- **Số đo (§7):** so ba mốc cùng máy (mốc sau #656, G7, lượt 4), không dòng nào ⚠️; mọi thao tác trong ngưỡng `phase-6.md`.
  - Mở lần đầu LCP 3 535 ms (mốc 3 663). Mở lại LCP 710 ms (G7 617). Dọn sạch 128,0 ms (≤ 500).
  - Lần lưu DB đầu 150 ms vượt luật nhiễu so mốc (119 ms). Đo cặp xen kẽ exe lượt 4 ↔ exe ghim cùng lúc ra 188,5 / 185,1 ms, nên chênh đó là do máy / thư mục lúc đo, không do code (Claude B K7).
  - Exe 5 649 408 B, bằng lượt 4 và G7. JS / CSS +8 029 B so lượt 4, phần lớn là `packages/ai` (+5 607 B: Mock trích xuất K42, G5 `@5` K43).
- **Kiểm log phiên (§10):** không nhiễm, không vi phạm chỉ đọc. Lệnh đầu của cả 18 phiên gói chỉ đọc file prompt. Phiên gói của DeepSeek 0 lần bị ACL từ chối. Có năm lệch nhỏ so với chữ quy tắc, không cái nào ảnh hưởng kết quả (§10.1):
  - DeepSeek gọi `node` trần sau khi đặt PATH; 14 lệnh `node -e` không đặt PATH;
  - DeepSeek F làm `gh` thật chạy qua `auto-wait.mjs` (`gh` đã đăng xuất);
  - Codex: Corepack thử tải `pnpm`, DNS của sandbox chặn;
  - Claude đọc dữ liệu tải và exe ở `-r4\common`;
  - Claude D liệt kê thư mục lượt 4 của chính nó.
- **Còn trước G7:**
  - 8 Issue sửa theo §8.2 (#1045–#1052, §8.5; Owner 05/11 đồng ý cả 4 đề xuất của §9): ≈ 85–195 dòng SP + ≈ 500 dòng test, phần lớn là test.
  - Các điều kiện ngoài review (spec §1 mục 2, 4):
    - nghiệm thu trên exe phát hành, gồm NT-HD-01 còn `L3 ❌ #1019` và các dòng có màn mà đợt sửa đổi (K46);
    - eval AI thật (NT-EV-01) với version prompt cuối;
    - chụp lại ảnh hướng dẫn có màn bị đổi;
    - cổng trên SHA phát hành.

## 2. Số liệu

### 2.1 Theo báo cáo (mức do chính bên đó gán)

| Bên | Phát hiện | Low / Nit | KNOWN có bằng chứng mới | PLAUSIBLE | Bảng R của bên | Kịch bản mới | Đột biến (bị giết / tổng) | Lệnh công cụ (log) | Thời gian (log) |
|---|---|---|---|---|---|---|---|---|---|
| Claude | 16 (A 3 · B 1 · C 2 · D 4 · E 4 · F 2) | 9 / 7 | 0 | 0 | R1 24 ĐS · 1 SMP (DR6-145); R2 28 ĐS | 82 (A 18 · B 10 · C 15 · D 13 · E 12 · F 14) | 161 / 184 (A 9 / 12 · B 28 / 37 · C 31 / 32 · D 34 / 34 · E 24 / 29 · F 35 / 40); F thêm 5 đột biến bộ chụp ảnh, 6 cấu hình dependency-cruiser × 7 ca, probe hiệu năng `2e51e25` trên exe | 994 | ≈ 3 h 44 (25–55 phút mỗi gói) |
| Codex | 20 (A 3 · B 2 · C 4 · D 5 · E 3 · F 3) | 18 / 2 | 0 | 0 | R1 23 ĐS · 2 SMP (DR6-139, 145); R2 23 ĐS · 5 SMP (T-330, 336, 338, 339, 346) | 54 (A 8 · B 7 · C 11 · D 9 · E 11 · F 8) | 79 / 81 (A 6 / 7 · B 17 / 17 · C 15 / 16 · D 11 / 11 · E 19 / 19 · F 11 / 11) | 404 | ≈ 1 h 51 (17–21 phút mỗi gói) |
| DeepSeek | 5 (A 0 · B 1 · C 1 · D 2 · E 1 · F 0) | 3 / 2 | 0 | 0 | R1 24 ĐS · 1 SMP (DR6-145); R2 28 ĐS | 55 (A 11 · B 10 · C 10 · D 8 · E 7 · F 9) | 65 / 66 (A 5 / 6 · B 14 / 14 · C 10 / 10 · D 14 / 14 · E 13 / 13 · F 9 / 9) | 891 | ≈ 1 h 59 (16–23 phút mỗi gói) |

- Chỉ tiêu ≥ 5 kịch bản mới mỗi gói đạt ở cả 18 báo cáo.
- Chỉ tiêu gói F ≥ 5 chuỗi nhiều bước qua nhiều gói: Claude đạt (F2–F6), Codex đạt (F01–F04, F06). DeepSeek F có 3 chuỗi dữ liệu (§4 mục 1–3); 6 kịch bản còn lại là công cụ, tài liệu hay một gói.
- Đột biến sống không tương đương đều thành phát hiện T:
  - Claude: A2, B1, C1, E4, F1, F2;
  - Codex: A3, C3.
  - DeepSeek A ghi bản `2e51e25` của `byName` "sống về test" (hành vi không đổi) mà không nêu thành phát hiện; Claude A2, Codex A3 nêu đúng chỗ hở đó (DR6-158).
  - Đột biến sống còn lại có lý do ghi trong báo cáo (tương đương, hay test ở gói khác giữ).
- Cách đếm đột biến mỗi bên một khác, nên chỉ so được độ dày, không so được tỉ lệ:
  - Claude đếm cả đột biến e2e, file build, cấu hình;
  - Codex gộp đột biến theo dòng R;
  - DeepSeek D đếm M5 / M7 hai lần (unit sống, e2e giết).

### 2.2 Theo vấn đề đã gộp (20) — bảng so ba bên

Cách đếm như lượt 4 §2.2: một bên được tính là thấy DR6-xx nếu có ít nhất một phát hiện mô tả đúng vấn đề đó (cột "Ai thấy" ở §6).

| Chỉ số | Claude Opus 5.5 | Codex GPT Sol 6.1 | DeepSeek V4.1 Flash |
|---|---|---|---|
| Phát hiện mới (bên đó gán M / L / N) | 16 (0 / 9 / 7) | 20 (0 / 18 / 2) | 5 (0 / 3 / 2) |
| Phát hiện bị bác (sai) | 0 | 1 (CXR5-B1) | 0 |
| Vấn đề thấy / 20 | **13 (65 %)** | 11 (55 %) | 4 (20 %) |
| Chỉ mình thấy | **7** (159, 161, 164, 165, 172, 174, 175) | 5 (162, 166, 167, 176, 177) | 2 (163, 168) |
| Thấy cùng bên khác | 6 (158, 160, 169, 170, 171, 173) | 6 (158, 160, 169, 170, 171, 173) | 2 (169, 173) |
| Dòng R chấm khác chốt | 0 | 6 (DR6-139; T-330, 336, 338, 339, 346) | 0 |
| Chênh mức khi kiểm | 2 / 16 (D1, E3 lên) | 4 / 20 (A1, C1, C2, F2 xuống) | 1 / 5 (D2 lên) |
| PLAUSIBLE | 0 | 0 | 0 |
| KNOWN có bằng chứng mới | 0 | 0 | 0 |
| Kết luận G7 | CHƯA (đúng) | CHƯA (đúng) | CHƯA (đúng; lượt 4 và review Phase 5: SẴN SÀNG, sai) |
| Thời gian A–F (log) | ≈ 3 h 44 (22:08 → 02:14) | ≈ 1 h 51 làm việc (22:09 → 00:47) | ≈ 1 h 59 làm việc (09:48 → 12:41, gồm 44 phút nghỉ giữa D và E) |
| Owner can thiệp trong phiên | mở 6 phiên | mở 6 phiên | mở 6 task qua expert; app ghi 44 lần "Sandbox bypassed (escalation-approved)" (A 2 · B 6 · C 18 · D 8 · E 8 · F 2) |
| Token (log) | không đo | không đo | ra 600 645 (suy luận 346 831) qua 845 lượt; đầu vào một lượt tới 448 562, 99,2 % trúng cache |
| Tốc độ ra token | — | — | 121,7 token/s chung; 129,5–141,8 ở lượt ≥ 200 token (§2.3) |
| Chi phí | gói Claude của Owner | gói Codex của Owner | 187,38 credit WorkBuddy cho 6 gói (A 33,12 · B 41,53 · C 55,22 · D 16,69 · E 18,74 · F 22,08); hai task thử 13,33; cả đợt 2 200,71 (gói Pro, không mua thêm) |
| Tuân thủ "chỉ đọc" | đạt (đột biến qua hook `load` / bản chép; C vá worktree rồi trả nguyên byte, kiểm sha256) | đạt (chạy bản chép) | đạt (vá rồi trả trong cùng lệnh, kiểm sha256 / `git status`; C tạo tạm file test trong worktree rồi xóa; F chụp lại ảnh rồi `git checkout`) |
| Tuân thủ độc lập | đạt | đạt | đạt (ACL; 0 lần bị từ chối ở phiên gói) |

- **Claude** vẫn là bên thấy nhiều nhất (lượt 2–5), nhất là test hở của chính phần sửa (5 trong 7 vấn đề chỉ Claude thấy) và chi phí đo được (DR6-165).
- **Codex** lượt này thấy nhiều hơn lượt 4 (8 → 20 phát hiện, 5 → 11 vấn đề). Nó là bên duy nhất thấy lỗi cơ chế ở hàng đợi lưu (DR6-162) và ở công cụ pipeline (DR6-176). Một phát hiện bị bác và năm dòng R chấm hẹp hơn mô tả là điểm yếu.
- **DeepSeek** ít phát hiện nhất (8 → 5), nhưng mọi phát hiện đều đúng và có 2 vấn đề chỉ mình thấy. Lần này nó theo đủ các bài học của lượt 4: kết luận áp K47, dòng R1 kiểm theo mô tả DR6 (DR6-145 SMP, DR6-37 ĐS theo vị trí lượt 1), Node 24 cho mọi lệnh đo, Playwright `--output`.
- So lượt 4: tổng phát hiện 34 → 41, vấn đề 23 → 20 trên diff bằng khoảng 1/3. Ba bên trùng nhau ở 2 vấn đề (lượt 4: 0).

### 2.3 Tốc độ ra token và credit của DeepSeek (`deep-review-1-6-r4\common\ds-tps.mjs`)

Đo trên log Owner đã chép ra (`deepseek\<gói>\session\`), cách tính như lượt 4 §2.3.

| Gói | Log (giờ VN) | Lượt | Token ra (suy luận) | Đầu vào lớn nhất | TPS chung | Trung vị theo lượt | TPS lượt ≥ 200 token (số lượt) | Credit |
|---|---|---:|---:|---:|---:|---:|---|---:|
| A | 09:47:42 → 10:06:14 (18,5′) | 134 | 96 357 (55 501) | 314 472 | 120,7 | 85,8 | 135,5 (91) | 33,12 |
| B | 10:08:01 → 10:30:22 (22,4′) | 141 | 108 321 (71 235) | 397 380 | 121,2 | 74,9 | 139,4 (87) | 41,53 |
| C | 10:32:32 → 10:55:40 (23,1′) | 172 | 123 519 (73 467) | 448 562 | 122,6 | 88,1 | 137,0 (121) | 55,22 |
| D | 10:59:12 → 11:14:59 (15,8′) | 110 | 83 887 (48 508) | 331 466 | 129,7 | 97,1 | 141,8 (84) | 16,69 |
| E | 11:59:00 → 12:21:11 (22,2′) | 137 | 87 931 (47 628) | 354 394 | 119,1 | 94,4 | 129,5 (105) | 18,74 |
| F | 12:23:47 → 12:41:01 (17,2′) | 151 | 100 630 (50 492) | 413 911 | 118,3 | 84,7 | 133,2 (104) | 22,08 |
| **Cả 6 gói** | 119,2′ | 845 | 600 645 (346 831) | — | **121,7** (4 935 s các lượt) | — | — | **187,38** |

- Trúng cache 223 296 896 / 225 086 033 token đầu vào (99,2 %). Tổng thời gian các lượt 82 phút trên 119 phút log; phần còn lại là chạy lệnh (vitest, cargo, Playwright) và chờ app.
- Credit không tỉ lệ với token: A, B, C (33 / 42 / 55 credit) tốn gấp 1,5–3 lần D, E, F (17–22 credit) với số token cùng cỡ. WorkBuddy không công bố cách tính. Owner chỉ ghi credit đã dùng, không ghi credit trước / sau.
- Điểm dừng chi phí sau mỗi gói A–E (§L5.7) không lần nào chạm.
- So lượt 4 (cùng model; app v5.9.3, tính 0.00x): token ra 591 729 → 600 645, lượt 867 → 845, TPS 116,9 → 121,7, thời gian log 212 → 119 phút.

## 3. Bảng R gộp

### 3.1 Chỗ các bên chấm khác nhau

| Dòng | Claude | Codex | DeepSeek | Chốt | Kiểm | Lý do |
|---|---|---|---|---|---|---|
| DR6-139 | ĐS | SMP | ĐS | **ĐS** | ✅ | Mô tả DR6-139 (tổng hợp lượt 4 §6.2, Issue #898 mục 1) là "một lần thay bắt đầu trong lúc `flush()` đang chờ lần ghi thì không được chờ". Phần đó đã hết: vòng `while (running \|\| tracked.size > 0)` (`persist-queue.ts:133`), test đỏ khi gỡ (cả ba bên). Codex chấm SMP vì probe gốc DSR4-B1 vẫn ra `destroy` trước `backup`. Probe đó gọi `flush()` rồi Nạp lại **trong cùng một lượt JS** khi hàng đợi rảnh. Ca đó đúng hợp đồng đã ghi của `flush()` ("at once when nothing is unsaved", `:21-26`) và không có đường vào từ UI (§5.1, CXR5-B1) |
| DR6-145 | SMP | SMP | SMP | **SMP** | ✅ 🔁 📄 | Cả ba cùng chấm. (a) và (c) xong; các dạng nối mà Issue #901 nêu đã bị báo. 🔁 `'x ← y'`, `'x – y'`, `'x…'`, `'x “y”'`, `'\u00d7'`, `&times;` trong chữ JSX vẫn trả `[]` (`token-guard.ts:98-99`). Phần còn: DR6-169 |
| T-330 | ĐS | SMP | ĐS | **ĐS** | ✅ 📄 | Codex: nhánh `otherDeaths` đọc "bé" của "nhỏ bé" là con (CXR5-C1). Issue #931 đặt ngoại lệ "bé" nghĩa nhỏ ở **luật 4** (luật người khác, `fixes.md`, #931 mục 4). Luật 3 ghi "dạng khác ('con út đã mất', 'mất một con') thì bỏ đề xuất Số con". Code đúng chữ Issue; 9 ca chấp nhận đúng (DeepSeek C), R330a–i bị giết (Claude C). Ngoại lệ ở luật 3 là biến thể mới: DR6-166 |
| T-336 | ĐS | SMP | ĐS | **ĐS** | ✅ 🔁 | Codex: gạch ngang U+2013 không là dấu đầu dòng (CXR5-C2). Issue #950 mục 1 mang KH qua dấu đầu dòng có sẵn (`BULLET` = `-*•+`, "1)"), không nêu "–". Bốn câu của quyết định 02/11 đúng; 🔁 "–" không ra đề xuất cả khi chỉ một dòng, tức có từ trước #956. Biến thể: DR6-166 |
| T-338 | ĐS | SMP | ĐS | **ĐS** | ✅ 📏 | Test chấp nhận của Issue #952 mục 3: "chỉ có run tạo trước mốc → chưa xong; có run tạo sau mốc và mọi check xong → xong", đạt (W05, W05b bị giết). Codex cho thấy một run `workflow_dispatch` hay một run bị hủy cũng thỏa điều kiện "có run sau mốc" trong khi rollup còn check cũ (CXR5-F1): biến thể ngoài test chấp nhận, DR6-176 |
| T-339 | ĐS | SMP | ĐS | **ĐS** | ✅ 📏 | Issue #960 mục 3: một hằng chung, neo ở `/test-support`, cho hai rule. Test chấp nhận chỉ xét file trong package `ai`; đạt (Claude F P2–P6, DeepSeek F). Rule có từ #956 chỉ xét `from` trong `packages/ai`, nên app desktop import được `test-support` (CXR5-C3): biến thể, DR6-167 |
| T-346 | ĐS | SMP | ĐS | **ĐS** | ✅ 📏 | Mục tiêu của Issue #986 (kỳ Năm lùi về năm đủ lịch Đã gặp, kiểm sớm trước vòng nhập backup) đạt trên exe (probe `2e51e25` đỏ, probe ghim xanh, Claude F). `metRows` lọc "Đã gặp" trên cả dòng có từ lượt 4; T-346 dùng nó để đếm (CXR5-F2): DR6-177 |

### 3.2 Bảng R1 đủ 25 dòng

ĐS = ĐÃ SỬA, SMP = SỬA MỘT PHẦN. "Gói" là gói kiểm (gói đầu là gói chính, `known.md` phần 4). Cột cuối là vấn đề lượt 5 liên quan. Biến thể còn hở ghi thành vấn đề riêng; dòng R giữ ĐÃ SỬA khi phần mô tả của DR6 đã hết, như thước §L5.4.

| DR6 | Mức L4 | Issue → PR | Gói | Claude | Codex | DeepSeek | **Chốt** | Bằng chứng chính (lượt 5) | Lượt 5 |
|---|---|---|---|---|---|---|---|---|---|
| 135 | L | #896 → #907 | A | ĐS | ĐS | ĐS | **ĐS** | Xóa / sửa / hủy cuộc gặp khi cuộc gặp khác cùng ngày giữ nhóm → `STAGE_KEPT_BY_MEETING`; `date > ?` → 1 test đỏ (cả ba bên); chuỗi D7 qua khôi phục / nhập backup / dời ngày đúng | — |
| 136 | L | #896 → #907 | A, F (đo) | ĐS | ĐS | ĐS | **ĐS** | Sắp 10 255 lịch hẹn theo KH: 11,2–12,2 ms (`2e51e25` 64–72 ms, collator trần 8,1–9,7 ms) ở cả ba bên; thứ tự trùng `2e51e25`; bản web 25,7 ms (lượt 4: 60,4) | **158** |
| 137 | L | #896 → #907 (+ #933 → #946) | A, C | ĐS | ĐS | ĐS | **ĐS** | Ba nhãn model hỏng → `AI_ANALYSIS_INVALID`; `readsBackAsIs` ⇔ "đọc lại y như lưu" trên 200 020 chuỗi (Claude A), ma trận 38 cột chữ (DeepSeek A); gỡ → 2–9 test đỏ | **159**; 170 (ô model) |
| 138 | L | #897 → #915 | B | ĐS | ĐS | ĐS | **ĐS** | 8 đột biến lượt 4 (CSP, `identifier`, `is_file`, `DISK_FULL`) nay bị giết (cả ba bên); seam `backup_with` 14 trạng thái trùng từng dòng bản cũ | **161** |
| 139 | L | #898 → #911 | B | ĐS | SMP | ĐS | **ĐS** | §3.1. Tái hiện lượt 4: code ghim xong `flush` sau lần thay, `2e51e25` trước; gỡ vòng → 2 test đỏ (cả ba bên) | — (CXR5-B1 bác) |
| 140 | N | #898 → #911 (+ #933 → #946) | B | ĐS | ĐS | ĐS | **ĐS** | Vòng gọi trần → test DR6-140 đỏ; listener ném / tự gỡ không làm `reloadDemoData` reject | — |
| 141 | L | #899 → #917 (+ #930, #931, #950, #960) | C | ĐS | ĐS | ĐS | **ĐS** | 20 câu sai của lượt 4 → 0 đề xuất (cả ba bên); bỏ cổng câu kể đơn → 127–218 test đỏ; 3 556 ghi chú thật chỉ thêm 640 "Ly hôn" (có chủ ý, T-330) | **164, 165, 166** |
| 142 | L | #900 → #909, #913 (+ #930) | C | ĐS | ĐS | ĐS | **ĐS** | NUL ở 6 dạng → V3–V6 chặn; gỡ → 16–18 test đỏ; phần "Mất" §14.5 đúng như K43 | — |
| 143 | N | #900 → #909, #913 (+ #930) | C | ĐS | ĐS | ĐS | **ĐS** | "môi / ranh / biên / thế giới Luật …" → V6; "giới luật Phật giáo" qua; gỡ → 8–9 test đỏ | — |
| 144 | N | #899 → #917 (+ #933 → #946) | C | ĐS | ĐS | ĐS | **ĐS** | Lỗi giữ lại hết sau Nhập backup / Nạp lại (`generation`), còn sau Dọn sạch (cùng dữ liệu); gỡ → 3 test đỏ | — |
| 145 | L | #901 → #920 (+ #934, #969, #973) | D | SMP | SMP | SMP | **SMP** | §3.1 | **169** |
| 146 | L | #902 → #922 (a), #898 → #911 (b) | D | ĐS | ĐS | ĐS | **ĐS** | R109c, RB2c (sống ở lượt 4) nay bị giết (cả ba bên) | — |
| 147 | L | #898 → #911 | D, B | ĐS | ĐS | ĐS | **ĐS** | Tái hiện K1, K7 lượt 4 trên bản build: focus về `H1`, hộp tự đóng, sự kiện cuối `save, destroy`; gỡ → e2e / unit đỏ | — |
| 148 | L | #902 → #922 (+ #932, #951) | D, E | ĐS | ĐS | ĐS | **ĐS** | Bốn chỗ của mô tả hết tràn (So sánh team 3 005 → 1 100 px; Báo cáo cột ghim 1 770 → 257 px); đột biến D1, T1–T6, E148c, E148d bị giết | **170**, 174 (c) |
| 149 | L | #901 → #920 (+ #905, #935) | D | ĐS | ĐS | ĐS | **ĐS** | Sáu điểm của mô tả khớp `.choice`; 9a, 7c cũng khớp; lùi class → e2e `theme` đỏ | **171** (7c) |
| 150 | L | #903 → #924 (+ #933, #951) | E | ĐS | ĐS | ĐS | **ĐS** | Case size chỉ có ký tự vô hình lưu được; `trim()` lại ở `readCaseSize` / ba `pending` → test đỏ | **172, 173** |
| 151 | N | #903 → #924 (+ #933 → #946) | E, A | ĐS | ĐS | ĐS | **ĐS** | Thùng rác 1 313 dòng: 42 KH mang mã, 0 tên KH dùng chung (lượt 4: 21); nhân sự có vai trò / team; gỡ → test đỏ | **160** |
| 152 | N | #903 → #924 | E | ĐS | ĐS | ĐS | **ĐS** | `PURGE_REMINDER` không còn `export` | — |
| 153 | L | #903 → #924 | E | ĐS | ĐS | ĐS | **ĐS** | RB2e, T305b (sống ở lượt 4) nay bị giết | — |
| 154 | L | #903 → #924 (+ #933, #951) | E | ĐS | ĐS | ĐS | **ĐS** | Lúc chạy focus ở nút `aria-disabled` "Đang …" (lượt 4: `BODY`); Enter / Space / click lúc chạy → 1 backup; E154a–c bị giết | **174** (a) |
| 155 | N | #904 → #926 | F | ĐS | ĐS | ĐS | **ĐS** | T83c bị giết; gỡ `style` của bộ chụp ảnh → đỏ ở "foot of the part in the shot" (cả ba bên) | — |
| 156 | L | #904 → #926 (+ #934 → #965) | F | ĐS | ĐS | ĐS | **ĐS** | `packages/*/src/schema.ts` thấy ghi chú `packages/ai/src/` (`2e51e25`: không); gỡ → 2 test đỏ | **175** |
| 157 | L | #904 → #926 | F | ĐS | ĐS | ĐS | **ĐS** | `.sqlite` 9 969 664 B không vào "Tệp khác" (`2e51e25`: có); gỡ → test đỏ | — |
| 37 | N | #790 → #845, #901 → #920 | D, E | ĐS | ĐS | ĐS | **ĐS** | Theo mô tả lượt 1 (L·CL-D5, L·CL-E5): vị trí đầu "{trường}: {giá trị}" mà lượt 4 sót nay là `kyc.factLine`; tám chỗ của gói E qua i18n; đặt lại → bộ chặn bắt (cả ba bên) | 169 (qua DR6-145) |
| CLR4-F2 | KNOWN | #905 → #928 (tài liệu) | F | ĐS | ĐS | ĐS | **ĐS** (tài liệu) | NT-EX-08 / 09 có câu ngoại lệ; exe ghim từ chối bản xuất của exe lượt 3 và bản tự xuất sau nâng cấp tại chỗ, đúng câu 10b (Claude F K1); hành vi vẫn là K1 | — |

Đếm: **24 ĐÃ SỬA** (gồm dòng CLR4-F2 sửa bằng tài liệu, đã đối chiếu exe) · **1 SỬA MỘT PHẦN** (DR6-145) · 0 CHƯA SỬA · 0 HỒI QUY.

### 3.3 Bảng R2 đủ 28 dòng

| Issue | PR | Gói | Claude | Codex | DeepSeek | **Chốt** | Bằng chứng chính (lượt 5) | Lượt 5 |
|---|---|---|---|---|---|---|---|---|
| #930 T-329 | #937 | C | ĐS | ĐS | ĐS | **ĐS** | `97876b4` ↔ `b6d4388`: 61 703 / 61 703 dòng giống hệt (Claude C); 0 khác trên 5 672 + 4 195 ghi chú (Codex C); 556 chuỗi (DeepSeek C) | — |
| #931 T-330 | #939 | C | ĐS | SMP | ĐS | **ĐS** | §3.1. R330a–i bị giết; ca chấp nhận của Issue đúng | 166 |
| #932 T-331 | #941 | D, E | ĐS | ĐS | ĐS | **ĐS** | `th` của cột ẩn `relative`; `flex-wrap`, `items-baseline`, phụ đề; gỡ → unit / e2e đỏ | 170 |
| #933 T-332 | #946 | E, A, B, D, C | ĐS | ĐS | ĐS | **ĐS** | Đủ sáu mục: ô Giờ, focus 10a / 10b, khóa `customer.withCode`, chú thích e2e, `readsBackAsIs`, `listeners.ts`; gỡ từng phần → test đỏ | — |
| #934 T-333 | #965 | D, F | ĐS | ĐS | ĐS | **ĐS** | Bộ đếm `types`, `\` trước CRLF, đoạn glob có `**` lẫn chữ; gỡ → test đỏ; 0 báo nhầm trên 356 file (Claude D) | 169 (c), 175 |
| #935 T-334 | #948 | F | ĐS | ĐS | ĐS | **ĐS** (tài liệu) | Năm test chấp nhận có trên file ở SHA ghim | 171 (7c) |
| #942 T-335 | #944 | F | ĐS | ĐS | ĐS | **ĐS** | 21 / 23 đột biến phần #944 bị giết (Claude F); mã thoát, `--once` (DeepSeek F) | 175 |
| #950 T-336 | #956 | C, F | ĐS | SMP | ĐS | **ĐS** | §3.1. R336a–c bị giết; dependency-cruiser báo `vitest` ở file SP (`2e51e25`: không) | 164, 166, 167 |
| #951 T-337 | #958 | E, D | ĐS | ĐS | ĐS | **ĐS** | Ô Giờ dán U+200B + `14:00` lưu 14:00; cặp `aria-disabled:` ở `Button`; gỡ → test đỏ | — |
| #952 T-338 | #954 | F | ĐS | SMP | ĐS | **ĐS** | §3.1. `--since`, khối app của gợi ý review; W05, W05b, W19, H1, H5 bị giết | 175, 176 |
| #960 T-339 | #963 | C, F | ĐS | SMP | ĐS | **ĐS** | §3.1. Mẫu bậc hai làm đỏ 4–12 hàng thời gian; ca qua dòng; hằng `AI_TEST_FILES` neo | 167 |
| #961 T-340 | #967 | F | ĐS | ĐS | ĐS | **ĐS** (tài liệu) | Brief §3.8 chạy lại `notes-for --diff`; câu trỏ dòng của §4 | — |
| #969 T-341 | #971 | D | ĐS | ĐS | ĐS | **ĐS** | Cách sửa của mục ACCEPTED làm ca ghim đỏ (ca có cắn) | — |
| #973 T-342 | #975 | D, F | ĐS | ĐS | ĐS | **ĐS** | Đếm lại #859…#974: 83 PR, 25 có code / test, 4 vượt ngưỡng, trùng bảng (Claude F); ca ghim thẻ mở | — |
| #977 T-343 | #978 | F | ĐS | ĐS | ĐS | **ĐS** (ảnh) | Bộ chụp ở SHA ghim cho 28 / 28 ảnh trùng byte (cả ba bên) | — |
| #980 T-344 | #981 | D | ĐS | ĐS | ĐS | **ĐS** (tài liệu) | Hàng "Chuyển nhóm" khớp `customer-forms.html` 5d–5e | — |
| #983 T-345 | #984 | F | ĐS | ĐS | ĐS | **ĐS** | Probe `2e51e25` đỏ ở `select-day-month` trên exe ghim; probe ghim xanh (Claude F) | — |
| #986 T-346 | #988 | F | ĐS | SMP | ĐS | **ĐS** | §3.1. Lùi về năm 2026 có 79 lịch Đã gặp; kiểm trước vòng nhập | 177 |
| #990 T-347 | #992 | F | ĐS | ĐS | ĐS | **ĐS** | Một `metRows`; kiểm tháng chứa hôm nay; bỏ chốt → đỏ | 177 |
| #994 T-348 | #995 | F | ĐS | ĐS | ĐS | **ĐS** (số đo) | 35 / 35 dòng bảng probe G7 trùng `perf-g7.json` | — |
| #997 T-349 | #999 | F | ĐS | ĐS | ĐS | **ĐS** (tài liệu) | NT-HN-01 không chép số; Cách đo có bước mở lại | — |
| #1001 T-350 | #1011 | E, A | ĐS | ĐS | ĐS | **ĐS** | Lịch Dự kiến đã qua là "Chưa ghi kết quả" ở dòng, tên nút, hộp khôi phục, qua nửa đêm; 588 phép so bộ đếm 0 lệch; gỡ → 4–17 test đỏ | 174 (b) |
| #1002 T-351 | #1003 | F | ĐS | ĐS | ĐS | **ĐS** (nghiệm thu) | Đếm lại L2: 222 ✅ · 1 ⚠️ · 1 ❌ · 18 — | — |
| #1004 T-352 | #1007 | F, D | ĐS | ĐS | ĐS | **ĐS** (tài liệu) | Mục Dữ liệu; bảng cổng KYC của hướng dẫn khớp bản web | — |
| #1005 T-353 | #1009 | E | ĐS | ĐS | ĐS | **ĐS** (tài liệu) | NT-LH-19 (cả 30/04/2027 mà L3 không thử được), NT-LH-28 khớp màn | — |
| #1012 T-354 | #1014 | F | ĐS | ĐS | ĐS | **ĐS** (tài liệu) | NT-TR-12 trong danh sách; dấu câu NT-AI-03 | — |
| #1017 T-355 | #1020 | F | ĐS | ĐS | ĐS | **ĐS** (nghiệm thu) | Đếm lại L3: 38 ✅ · 1 ❌ (NT-HD-01) | — |
| #1019 T-356 | #1023 | D | ĐS | ĐS | ĐS | **ĐS** (tài liệu) | `01-bat-dau.md`, `02-tong-quan.md` khớp `p2c.lastRoute`; NT-HD-01 còn `L3 ❌` chờ lượt nghiệm thu sau T-356 (G7) | — |

Đếm: **28 ĐÃ SỬA** (16 có code hoặc test, 12 tài liệu / ảnh / số đo / nghiệm thu).

**Refactor và hiệu năng không đổi hành vi** (plan §L5.4):

- **T-329:** Mock trước / sau khi tách file cho 61 703 dòng so sánh giống hệt (regex dựng lúc nạp, Mock trên 60 681 ghi chú, V3–V6 trên 812 chuỗi; Claude C).
- **T-332:** `listeners.ts` giữ thứ tự gọi của ba vòng cũ khi listener tự gỡ / gỡ listener khác / thêm listener (Claude B, DeepSeek B). `readsBackAsIs` cho 0 khác so với điều kiện viết tại chỗ của #907, trên 200 020 chuỗi (Claude A).
- **`byName` (DR6-136):** cùng thứ tự `2e51e25` trên 1 481 KH, 10 255 lịch hẹn, tên có chữ số toàn khổ / Ả Rập, 20 002 và 39 987 tên (ba bên).
- **Dữ liệu tải:** sinh bằng `2e51e25` ↔ `37a80b6` chỉ khác `ai_analyses.prompt_version` 103 / 103 dòng (`@4` → `@5`, K43; Claude F F9). Đây là cả lý do `tables` đổi từ `ad82051b…` sang `e256e4f1…`.

## 4. Lượt 5 kiểm được gì (không có lỗi)

Ngoài 53 dòng R, các kịch bản mới không lộ lỗi dữ liệu nào. Những chỗ đáng kể:

- **Nâng cấp tại chỗ và bản xuất của exe cũ:**
  - thư mục và bản xuất của exe lượt 4 mở / nhập được ở exe ghim; Thùng rác đọc nhãn mới; tự xuất rồi nhập lại được (Claude F F2, Claude B K5, Codex A N6);
  - thư mục của exe lượt 3 mở được; bản xuất có chữ chỉ gồm ký tự vô hình bị từ chối đúng như ghi chú NT-EX-08 / 09 (KNOWN K1, Claude F F1).
- **Lưu, thay và đóng app chồng nhau (S2-6):**
  - đóng app ngay sau Nhập backup, cả với X lần hai (Claude F F3);
  - hai lần Nạp lại xếp hàng; lần thay bị từ chối vì backup lỗi; Dọn sạch sau lần lưu bị giữ (Claude B K2, DeepSeek B K1–K7).
  - File cuối luôn là một trạng thái đủ.
- **D7 cùng ngày nhiều bước:** xóa / khôi phục ngược thứ tự, dời ngày hai phía, nhập backup giữa chuỗi, ba cuộc gặp cùng giữ nhóm (Claude A K1–K6, Codex A N1, DeepSeek A 1–4).
- **Đi bộ ngẫu nhiên 300 bước** trên lõi dữ liệu, xuất rồi nhập sau mỗi bước: 0 lần nhập hỏng (DeepSeek A). Ma trận 38 cột chữ × 5 dạng chữ hỏng: lệnh và luật nhập không lệch nhau (DeepSeek A, Codex A N3).
- **AI:**
  - G5 `@5` trên 17 673 đoạn chữ thật (eval, docs, `vi.ts`, KYC): 0 đoạn đổi kết quả chặn (Claude C K9);
  - 50 ví dụ của spec §10 khớp Mock (DeepSeek C);
  - chuỗi trích xuất → Xác nhận → thẻ KYC → xóa KH → khôi phục trên màn (Claude C K13, Claude F F4, Codex F F01).
- **Một nghĩa "Chưa ghi kết quả"** ở năm nơi (màn, Excel, Thùng rác, hộp, Tổng quan) qua xóa / khôi phục / bàn giao (Claude F F5, F6; Codex E E04).
- **Exe:** Ctrl / Shift / chuột giữa lên link không mở cửa sổ thứ hai (Claude B K9); mở lại màn dùng cuối khi file DB đã đổi (Claude B K10).
- **Bộ chặn ký hiệu:** 0 báo nhầm trên 356 file của repo so với cây cú pháp TypeScript; 116 / 116 file kết thúc ở trạng thái sạch (Claude D K2, K3).
- **Cổng:** bước chuẩn bị 4 387 unit, 120 Rust, 324 e2e qua, không flaky. Bộ chụp ảnh hướng dẫn cho 28 / 28 ảnh trùng byte ở cả ba bên.

## 5. Phát hiện mới — kiểm lại

### 5.1 Chỗ phiên tổng hợp chấm khác reviewer

| Phát hiện | Reviewer | Chốt | Lý do |
|---|---|---|---|
| CXR5-B1 | Low (R), "DR6-139 SMP" | **Bác (không phải lỗi)** | Hàng đợi rảnh, gọi `close` rồi Nạp lại **cùng một lượt JS** → `flush()` xong trước khi lần thay được theo dõi. Ba lý do: (1) đúng hợp đồng đã ghi của `flush()`: "Resolves once … no work tracked or write is left, work tracked after the call too (**at once when nothing is unsaved**)" (`persist-queue.ts:21-26`). (2) Lần thay được `track` đồng bộ ngay lúc gọi (`inTurn`, `app-data.ts:391-398`). `closeAfterSaving` gọi `destroy` trong cùng tác vụ, chỉ qua microtask (`close-guard.ts:21-36`), nên không sự kiện người dùng nào chen vào giữa; DeepSeek B tự xét và loại ca này. (3) Dữ liệu cũ vẫn đủ. Codex tự ghi "chưa tái hiện bằng hai thao tác tay". Đây chính là probe gốc DSR4-B1 mà tổng hợp lượt 4 đã thay bằng đường thật (lần thay bắt đầu trong lúc `flush()` chờ lần ghi) |
| CLR5-E3 | Nit | **Low** (DR6-173) | Chỉ sai hiển thị (lỗi bắt buộc hiện trước khi bấm Lưu): thước §4.3 xếp vào Low, như DR6-150. Codex, DeepSeek cùng chấm Low |
| CXR5-A1 | Low | **Nit** (DR6-160) | Cần file backup sửa tay (hai mã KH chỉ khác số dấu cách; app sinh mã `K-` + 4 ký tự). Hậu quả chỉ là tên nút trùng cho trình đọc màn hình, họ DR6-151 / DR6-119 (Nit) |
| CXR5-C1, CXR5-C2 | Low | **Nit** (DR6-166) | Mock trích xuất (chỉ cho demo / e2e / máy chưa có key) bỏ lỡ đề xuất, hướng an toàn (CX-A4): không đề xuất sai giá trị nào. Khác DR6-141 (đề xuất sai) |
| CXR5-F2 | Low | **Nit** (DR6-177) | Probe hiệu năng chỉ chạy trên dữ liệu tải do `load-data` sinh; tên KH ở đó không chứa "Đã gặp". Gặp tên như vậy thì probe dừng chờ nút, không đo sai lặng lẽ |
| CXR5-A2 | Nit | **Nit** (DR6-160), nhận | Claude E (K12) và DeepSeek E thấy cùng ca nhưng không nêu: hai dòng nhân sự giống hệt nhau ở "Bản ghi" / "Thuộc", chỉ khác cột "Xóa lúc". Phiên tổng hợp nhận vì tên nút vẫn trùng cho trình đọc màn hình; cách sửa ở Q1 |
| CLR5-D1, DSR5-D2 | Nit | **Low** (gộp vào DR6-169) | Gộp với CXR5-D1, DSR5-D1, CLR5-D2 (Low) vào một vấn đề của bộ chặn ký hiệu, như DR6-145 lượt 4 |
| CLR5-F1, CLR5-F2 | Nit (Claude tự hỏi thống nhất) | **Nit** (DR6-175) | Test hở của công cụ phát triển, như DR6-155 lượt 4. Test hở của sản phẩm vẫn là Low (DR6-158, 161, 164, 174) |

### 5.2 Gộp

| DR6 | Gộp từ (mức gốc) | Lý do |
|---|---|---|
| 158 | CLR5-A2 (L), CXR5-A3 (L) | Cùng chỗ hở: không test nào giữ bộ nhớ khóa của `byName` |
| 160 | CLR5-A1 (N), CXR5-A1 (L), CXR5-A2 (N) | Tên nút khôi phục ở Thùng rác còn trùng ở ba ca ngoài DR6-151; một nơi sửa (`restoreLabel`) |
| 166 | CXR5-C1 (L), CXR5-C2 (L) | Mock trích xuất bỏ lỡ đề xuất; cùng file, cùng §10 |
| 169 | CLR5-D1 (N), CXR5-D1 (L), DSR5-D1 (L), CLR5-D2 (L), CXR5-D5 (L), CXR5-D2 (L), DSR5-D2 (N) | Bộ chặn ký hiệu (`findHardcodedSeparators`): phần còn của DR6-145, dạng nối JSX bị Prettier ngắt dòng, báo nhầm |
| 170 | CLR5-D3 (L), CLR5-E1 (L), CXR5-D3 (L), CXR5-D4 (L), CXR5-E1 (L), CXR5-E2 (L), CXR5-C4 (L) | Chuỗi liền dài còn tràn ở các chỗ DR6-117 / 148 chưa phủ; cùng cách sửa |
| 171 | CLR5-D4 (N), CXR5-F3 (N) | Hai dòng của `nghiem-thu-v1.md` chưa theo đợt sửa sau lượt 4 |
| 173 | CLR5-E3 (N), CXR5-E3 (L), DSR5-E1 (L) | `PolicyDialogs.tsx:79`, cả ba bên |
| 175 | CLR5-F1 (N), CLR5-F2 (N) | Test hở của công cụ phát triển |

## 6. Bảng đầy đủ DR6-158…177

Mức: L = Low, N = Nit. "Ai thấy" ghi mức gốc. "Mới" = mới do ba đợt sau lượt 4 (đợt sửa lượt 4, mục sổ [G7], G7); "trước" = có từ trước, lượt 1–4 bỏ sót. Nhóm sửa: §8.2.

### 6.1 Lõi dữ liệu (gói A)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 158 | Không test nào giữ phần sửa của DR6-136. (a) Đổi `name-order.ts` về bản `2e51e25` (đúng lỗi DR6-136: bảng Lịch hẹn chậm ×6) thì cả 1 477 test `domain` + `db` vẫn xanh: phần sửa là sửa hiệu năng, không có ca thời gian hay ca đếm lần tính khóa, và probe `e2e/perf` không có bước sắp bảng Lịch hẹn theo tên. (b) Ca 20 002 tên (`name-order.test.ts:93-101`) chỉ phủ dòng: tên của ca cho cùng thứ tự với tên trần, nên đột biến "quá trần thì trả tên trần" sống. Đột biến đó đưa lại đúng lỗi DR6-112 (thứ tự đi vòng với tên trộn chữ số) sau 20 000 tên đầu của phiên. Mới (#907) | CLR5-A2 (L), CXR5-A3 (L) | L | ✅ 🧪 📏 | L5-A |
| 159 | `isLabel` (`common.ts:104-106`) hỏi "trống" bằng `String.prototype.trim`, không bỏ U+200B / U+2060 / U+0085 / U+3164 / U+180E. Nhãn model chỉ gồm các ký tự đó qua lệnh `recordAiAnalysis` và luật nhập 12; lịch sử phân tích hiện ô model rỗng. Mọi chỗ khác hỏi "trống" bằng `normalizeText` (K20, K25, DR6-150). Chỉ với file backup sửa tay (model chọn trong danh sách đóng). 🔁 `isLabel('\u200b')`, `isLabel('\u3164')` → `true`; NBSP → `false`. Trước | CLR5-A3 (N) | N | ✅ 🔁 | L5-A |
| 160 | Tên nút khôi phục ở Thùng rác còn trùng cho trình đọc màn hình ở ba ca ngoài DR6-151. (a) Lịch hẹn / HĐ của hai KH cùng tên khác mã: `ofCustomer` ghép "của KH <tên>" chỉ từ tên (`trash-view.ts:239-242`; `TrashRef` không có mã, `trash.ts:29-39`). (b) Hai nhân sự trùng cả tên, vai trò, team: hai dòng chỉ khác cột "Xóa lúc". (c) Hai mã KH chỉ khác số dấu cách (backup sửa tay): tên truy cập gộp khoảng trắng. Họ DR6-119 / 151. Trước | CLR5-A1 (N), CXR5-A1 (L), CXR5-A2 (N) | N | ✅ 📏 | L5-F (Q1) |

### 6.2 File, Rust, lưu (gói B)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 161 | Test hợp đồng của bản build chỉ so mảng `permissions` của `capabilities/default.json` (`tauri-contract.test.ts:338-356`). Tauri nạp mọi file `capabilities/**/*` khi `tauri.conf.json` không khai `app.security.capabilities`; khi có khai thì dùng danh sách đó, kể cả capability viết thẳng. Thêm file capability thứ hai, capability inline trong `tauri.conf.json`, hay `remote` / `windows` trong `default.json` đều để 18 / 18 xanh. Exe debug có `extra.json` cho `set_size` / `maximize` chạy được từ trang. Bản web của e2e không có ACL, nên ca này là chốt chặn duy nhất của quyền webview (K37). Quyền hiện tại đúng. Trước (#617) | CLR5-B1 (L) | L | ✅ 🧪 📏 | L5-B |
| 162 | Hàng đợi lưu: một listener nghe "lưu xong" mà gọi đồng bộ hai lệnh ghi thì hai lượt ghi chạy chồng nhau. `drain` đặt `running = undefined` trước khi gọi listener (`persist-queue.ts:99-100`). Lệnh thứ nhất mở một `drain` mới; lệnh thứ hai để `waiting`, và `drain` cũ lấy nó trong vòng `while (waiting)` (`:84`). Một lượt có thể bỏ cờ bận trong khi lượt kia còn giữ snapshot chưa lưu; đóng app lúc đó (`flush()` thấy `running` rỗng) để file thiếu thay đổi cuối. Listener của sản phẩm không làm vậy (React chỉ đọc lại; DeepSeek B K6: một lệnh trong listener không chồng). Code `2e51e25` cùng kết quả. Trước | CXR5-B2 (L) | L | ✅ 📏 | L5-B |
| 163 | Nhánh `if (!storage) return;` ở đầu hàm ghi của hàng đợi (`app-data.ts:282`) không bao giờ chạy: `persist` chỉ được nối khi có `storage` (`:311-316`, `:349`). Coverage 0 / 262. Trước | DSR5-B1 (N) | N | ✅ 📏 | L5-B |

### 6.3 AI (gói C)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 164 | Phép thử chữ cái của `worded` (`mock-extraction.ts:760-767`, `:780`) không ca nào giữ. Đổi nó thành "vế không ở vị trí 0" thì "1. Khách đã kết hôn.", "... Hai vợ chồng đã kết hôn, có 2 con." và mọi ghi chú mở bằng số thứ tự / "..." / "?" rồi "Khách / Hai vợ chồng / Chị nói" mất đề xuất (đúng §10: "Ở đầu ghi chú…"), mà 701 / 701 ca Mock xanh. 🔁 code ghim đúng ở cả ba câu. Mới (#917) | CLR5-C1 (L) | L | ✅ 🔁 🧪 | L5-C |
| 165 | Mock trích xuất viết lại (T-330, T-336) tốn hơn `2e51e25` trên chính ghi chú thật. Lần gọi đầu của tiến trình (regex chạy lần đầu, như lần bấm AI trích xuất đầu sau khi mở app) 9,20 → 28,48 ms; cả bộ 3 551 ghi chú RE 62,17 → 103,47 ms (×1,66); lần bấm đầu trên màn 31 → 53 ms (+22 ms). Quá luật nhiễu, dưới ngưỡng 200 ms; các lần sau +0,01 ms. Mới (#917, #939, #956) | CLR5-C2 (L, P) | L | 📏 | L5-C / L5-H (Q2) |
| 166 | Mock trích xuất bỏ lỡ đề xuất ở hai dạng, hướng an toàn. (a) Nhánh `otherDeaths` dùng `CHILD` trực tiếp (`:342-370`), nên "bé" nghĩa nhỏ cùng một chữ "mất" làm mất Số con. 🔁 "KH có 3 con. Vụ mất điện ở căn nhà nhỏ bé." → không đề xuất ("… mất mát nhỏ." → 3). Ngoại lệ "bé nghĩa nhỏ" của luật 4 (#931) không áp cho "dạng khác" của luật 3. (b) `BULLET` (`:244`) chỉ nhận `-*•+` và "1)", không nhận gạch ngang U+2013 mà Word / tài liệu hay dùng. 🔁 "– KH đã kết hôn" → không đề xuất, cả khi chỉ một dòng ("- KH…" → Đã kết hôn). (a) mới (#939), (b) trước | CXR5-C1 (L), CXR5-C2 (L) | N | ✅ 🔁 | L5-C |
| 167 | Rule `ai-test-support-only-in-tests` (`.dependency-cruiser.cjs:31-36`) chỉ xét `from` trong `packages/ai`, nên file sản phẩm của app desktop import được `packages/ai/src/test-support.ts` (có `vitest`) mà `lint:deps` xanh. Codex thử: import từ `apps/desktop/src` → exit 0; cùng import từ `packages/ai/src` → exit 1. Hợp đồng ghi ở Issue #960 là "chỉ test của package ai import file hỗ trợ test". Repo hiện không có cạnh như vậy. Mới (#956) | CXR5-C3 (L) | L | ✅ 📏 | L5-C |
| 168 | Khung dán câu trả lời ChatGPT web hỏi "trống" bằng `trim()` (`web.ts:145`, nút ở `KycWebSession.tsx:175`). Chuỗi chỉ có U+200B / U+2060 (dán một vùng trông rỗng) làm nút bật, rồi tính một lần thử (V1). Hai lần như vậy ghi một dòng `ai_analyses` REJECTED; panel ghi "Lần phân tích … bị loại". Dòng phân tích không xóa được. Spec §3.1 mục 3 ghi "rỗng sau khi cắt khoảng trắng → nút tắt, không tính lần thử", trong khi mọi ô khác của app coi chữ chỉ có ký tự vô hình là rỗng (K25). Playwright xác nhận trên bản build. Trước | DSR5-C1 (L) | L | ✅ 🔁 📏 📄 | L5-C |

### 6.4 Màn nhập liệu (gói D, và tên dài ở gói C / E)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 169 | Bộ chặn ký hiệu `findHardcodedSeparators` (`packages/ui/src/token-guard.ts`), phần còn của DR6-145 và hai lỗ mới. (a) Không bắt `←`, `–`, `…`, ngoặc kép cong (tập ký hiệu ở `:98-99`), ký hiệu viết bằng escape `\uXXXX` trong chuỗi, thực thể HTML (`&times;`, `&middot;`, `&rarr;`, `&#183;`) trong chữ JSX: phần (b) của mô tả DR6-145 mà Issue #901 thu hẹp. (b) Luật dấu nối JSX (`:146-150`) chỉ nhận `}` `, ` `{` liền nhau. Dạng Prettier viết khi dòng dài (`{a},{' '}`⏎`{b}`, `{a}`⏎`, {b}`, `,{' '}` một dòng), `{a}:{' '}{b}` và dấu nối cạnh một phần tử (`{t('a')}: <b>{v}</b>`) đều lọt: 387 / 510 lần cắm thử trên 67 file thật. (c) Báo nhầm: `Promise<<T>() => T>` làm bộ đếm `types` đóng sớm nên thân hàm sau thành JSX (`:135`, `:155`); `JOINER` báo `text.split(', ')`, `text.replace(', ', '; ')` (`:53`, `:107`). 🔁 cả ba phần. App hiện không có dạng nào của (a), (b); (c) không có chỗ nào trong repo (0 báo nhầm trên 356 file). (a) trước, (b) mới (#920), (c) mới (#920, #965) | CLR5-D1 (N), CXR5-D1 (L), DSR5-D1 (L), CLR5-D2 (L), CXR5-D5 (L), CXR5-D2 (L), DSR5-D2 (N) | L | ✅ 🔁 📏 | L5-D (Q3) |
| 170 | Chuỗi liền dài (tên không có trần độ dài; `requireName` chỉ kiểm rỗng) còn kéo trang cuộn ngang ở các chỗ DR6-117 / 148 chưa phủ:<br>(1) Khách hàng → Bảng: ô Họ tên / RE (`CustomersScreen.tsx:53-73`, bảng không trong khung cuộn `:193-202`); KH 81 chữ → trang 1 329 px ở 1 100, RE 160 chữ → 1 889 px cả ở 1 440;<br>(2) dòng meta của hồ sơ KH (`CustomerProfile.tsx:173`): +299 px ở 1 100;<br>(3) bảng và khung chi tiết Lịch hẹn (`AppointmentsScreen.tsx:316-320`, `:669`): 2 038 / 2 324 px;<br>(4) bảng Thùng rác, ô "Thuộc" (`SettingsTrash.tsx:70-80`, `:372`): 1 992 px;<br>(5) tên RE ở thẻ Hợp đồng (`CustomerPolicies.tsx:89`): 1 392 px ở 1 100;<br>(6) ô chọn "RE của góc nhìn" (`ScopePicker.tsx:49-57`, `SelectField.tsx:55-63`): rộng 1 367–2 409 px, đẩy thanh trên của Tổng quan / Báo cáo / Lịch hẹn / Khách hàng ra ngoài cả ở 1 440;<br>(7) dòng "Đang xem" của Báo cáo (`FilterBar.tsx:70-81`) với team 160 chữ: `main` 868 → 2 134 px;<br>(8) tiêu đề chart team ở Tổng quan (`StageBlock.tsx:73-77`): 254 → 2 136 px, đè sang cột bên;<br>(9) ô nguồn / model ở lịch sử phân tích AI (`KycHistory.tsx:87-92`) với nhãn model 100 chữ (chỉ backup sửa tay): bảng 1 513 px.<br>Tên dài có dấu cách (RE 46 chữ, team 49, KH 61) không tràn ở đâu. Không sai dữ liệu. Trước | CLR5-D3 (L), CLR5-E1 (L), CXR5-D3 (L), CXR5-D4 (L), CXR5-E1 (L), CXR5-E2 (L), CXR5-C4 (L) | L | ✅ 📏 | L5-E (Q4) |
| 171 | Hai dòng của `docs/testing/nghiem-thu-v1.md` chưa theo đợt sửa sau lượt 4. (a) Mục "Ô chọn" của "Lệch mockup đã biết" (`:407`) ghi hộp 7d vẽ hàng `.radio` mà app dùng ô chọn; hộp 7c cũng vẽ hai hàng `.radio` có mô tả riêng (`kyc-forms.html:241-248`), còn app vẽ hai ô chọn và một dòng help chung. K44 đòi mọi lệch còn lại của ô chọn nằm ở mục này. (b) Ghi chú của NT-AI-17 (`:219`) vẫn ghi Mock "chỉ nhận '<n> con', 'đã kết hôn', 'độc thân'", trong khi §10 nay có Ly hôn / Góa / Ly thân, con đã mất, "bé". Kết quả mong đợi của dòng vẫn đúng. Mới (#928, #948; #939, #956) | CLR5-D4 (N), CXR5-F3 (N) | N | ✅ 📄 | L5-H |

### 6.5 Lịch hẹn, Thùng rác, Hợp đồng (gói E)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 172 | Hai ô tìm của gói E so chữ gõ qua `trim()` rồi bỏ dấu: chọn KH ở 6b (`searchCustomers`, `appointment-form.ts:165`; `AppointmentDialog.tsx:378`) và "Tìm theo tên" ở Thùng rác (`filterTrash`, `trash-view.ts:74`). Tên đã lưu qua `normalizeText` (gộp mọi khoảng trắng Unicode, bỏ ký tự vô hình), nên tên dán kèm U+200B, NBSP thay dấu cách hay hai dấu cách liền không bao giờ khớp: "Không có KH khớp." dù KH có. Trước | CLR5-E2 (L) | L | ✅ 📏 | L5-F |
| 173 | Hộp Hợp đồng 8a–8d hỏi "ô trống" bằng `trim()` (`PolicyDialogs.tsx:79`, `shown`), nên ô Ngày / FYP chỉ có ký tự vô hình hiện lỗi bắt buộc ngay, trước khi bấm Lưu; ô trống thật chờ lần bấm Lưu. Ở 6b / 6c / 6e, DR6-150 đã cho ô như vậy chờ như ô trống. Bấm Lưu vẫn chặn đúng. Trước | CLR5-E3 (N), CXR5-E3 (L), DSR5-E1 (L) | L | ✅ 📏 | L5-F |
| 174 | Test hở của đợt sửa gói E. (a) Hộp 10a: chỉ điều kiện `!running` của `onSubmit` (`SettingsBackup.tsx:243-245`) chặn lần nhập thứ hai khi nút "Đang nhập…" nhận focus và bấm được (#924). Không ca nào bấm nút lúc chạy; đột biến E154d làm Enter / Space / click nhập 4 lần mà 45 / 45 ca xanh. (b) T-350: phần màn truyền `today` vào cột Thùng rác và hộp khôi phục (`SettingsTrash.tsx:291`, `:304`; `RestoreDialog.tsx:27-28`) không ca nào giữ; e2e Thùng rác chỉ xóa lịch của hôm nay. (c) Span `max-w-60` ở cột Team của Theo RE (`ReportTable.tsx:119-123`, #922) không ca nào giữ. Hành vi hiện tại đúng ở cả ba. Mới (#924, #1011, #922) | CLR5-E4 (L) | L | ✅ 🧪 | L5-F (a, b), L5-E (c) |

### 6.6 Công cụ (gói F)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 175 | Test hở của công cụ phát triển. (a) `globMeetsFolder` (`tools/notes-core.mjs:207`, `return parts.length > names.length`): đổi thành `return true` thì 4 387 test xanh, mà ghi chú thư mục hiện thừa với đích như `e2e/*`, `packages/*/src`. (b) `tools/auto-wait-core.mjs`: lần đọc tốt đặt lại số lần lỗi liên tiếp (`:231`), lookbehind của `titleRegExp` (`:199`). (c) `tools/review-hint-core.mjs:19`: khối app khớp không tham lam. Đột biến W15, W13b, H6 sống cả bộ. Code hiện tại đúng. Mới (#926 / #965, #944, #954) | CLR5-F1 (N), CLR5-F2 (N) | N | ✅ 🧪 | L5-G |
| 176 | `auto-wait ci --since` (`tools/auto-wait-core.mjs:129-149`) chỉ cần một workflow run nào đó tạo sau mốc cho cùng SHA, rồi lấy kết quả từ rollup. Sau `close` + `reopen`, rollup còn check cũ đã xong. Một run `workflow_dispatch` (ci.yml có), hay run của chính lần reopen bị hủy trước khi có check, làm lệnh báo "CI green" theo check cũ. Phiên điều phối có thể sang review sớm; `merge-pr` vẫn kiểm riêng. Mới (#954) | CXR5-F1 (L) | L | ✅ 📏 | L5-G |
| 177 | Probe hiệu năng: `metRows` lọc `hasText: 'Đã gặp'` trên cả dòng của bảng Lịch hẹn (`e2e/perf/probe.perf.ts:207`), không chỉ ô Trạng thái. Phép đếm kỳ Năm (`:287`, T-346) và việc chọn dòng thứ i (`:556-558`) đếm cả lịch Dự kiến có tên KH chứa cụm đó; probe khi đó dừng chờ nút "Tạo lịch hẹn tiếp theo". Dữ liệu tải không có tên như vậy. Mới (#988) | CXR5-F2 (L) | N | ✅ 📏 | L5-G |

## 7. Bloat và hiệu năng

### 7.1 Exe release ở SHA ghim: mọi thao tác trong ngưỡng

`common\baseline.md` (probe `e2e/perf` của bước chuẩn bị, Home PC; plan §L5.6). Ba mốc cùng máy: mốc sau #656 (`docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json`), G7 (`perf-g7.json`, cùng bản probe), lượt 4 (`perf-ref-r4.json`, probe trước T-345…T-347: hai dòng kỳ Tháng / Năm so tham khảo).

| Thao tác | Mốc sau #656 (`dae9df3`) | Lượt 4 (`2e51e25`) | G7 (`233c77e`) | Lượt 5 (`37a80b6`) | Ngưỡng `phase-6.md` | |
|---|---|---|---|---|---|---|
| `app.open-data` | 387 ms | 370 ms | 320 ms | 330 ms | ≤ 600 ms | ✅ |
| `reload.*` (6 màn) | 283–398 ms | 279–405 ms | 280–395 ms | 285–407 ms | < 500 ms | ✅ |
| `trash.open` | 34 ms | 32 ms | 33 ms | 33 ms | < 200 ms | ✅ |
| `customer.open-ai` / `customer.ai-history` | 19 / 2 ms | 20 / 2 ms | 20 / 2 ms | 20 / 2 ms | < 200 ms | ✅ |
| Các thao tác màn còn lại (lịch hẹn, KH, Tổng quan, Báo cáo, lọc Thùng rác) | 6–23 ms | 6–24 ms | 5–23 ms | 5–24 ms | < 200 ms | ✅ |
| `backup.read` / `backup.import` / `backup.export` | 835 / 43 / 438 ms | 977 / 47 / 436 ms | 975 / 44 / 435 ms | 983 / 50 / 438 ms | ≤ 2 000 / 500 / 1 000 ms | ✅ |
| `reports.export-excel` | 20 ms | 29 ms | 25 ms | 21 ms | ≤ 500 ms | ✅ |
| `appointments.next-month` / `next-year` | 101 / 107 ms | 108 / 113 ms | 112 / 109 ms | 111 / 108 ms | ≤ 300 ms; Năm − Tháng ≤ 50 ms | ✅ |
| `db.save` | 151 ms | 149 ms | 148 ms | 150 ms | ≤ 400 ms | ✅ |
| JS heap | 16,5 MB | 16,6 MB | 16,7 MB | 16,7 MB | ≤ 21 MB | ✅ |
| Mở lần đầu (gọi exe → màn đầu có số liệu, LCP) | 3 663 ms | 3 521 ms | 3 420 ms | 3 535 ms | xấu hơn khi > 4 396 ms; "không chậm hơn exe Phase 4" > 4 724 ms | ✅ |
| Mở lại trên dữ liệu tải (LCP) | — | không đo | 617 ms | 710 ms | xấu hơn khi > 740 ms | ✅ |
| Dọn sạch: bấm "Backup rồi dọn sạch" → thông báo 11j (dữ liệu tải) | — | 123,3 ms | 130,5 ms | 128,0 ms | ≤ 500 ms (K30) | ✅ |
| `trash.open` trước → sau khi dọn (đã ngắt DevTools) | — | 34,1 → 2,0 ms | — | 30,1 → 2,0 ms | — | |

So ba mốc: **không dòng nào ⚠️**.

- `backup.read` +148 ms (+18 %) so mốc sau #656, dưới luật nhiễu, bằng G7 và lượt 4: chi phí của luật nhập 7 (K33), như lượt 4 §7.1. Claude F chạy probe lần hai trên cùng exe: 872 ms.
- **Lần lưu DB đầu của lần mở đầu** (`p2c:db-save`, seed demo) 150 ms so 119 / 119 / 123 ms: quá luật nhiễu ở mốc phụ này. Claude B (K7) đo xen kẽ exe lượt 4 ↔ exe ghim, 3 lần mỗi bản, cùng điều kiện: 188,5 / 185,1 ms. Hai bản bằng nhau, nên chênh của bước chuẩn bị là do máy / thư mục lúc đo, không do code; đường lưu không đổi từ G7 (`git diff 233c77e 37a80b6 -- apps/desktop/src-tauri apps/desktop/src/data` rỗng). Không phải phát hiện P.

### 7.2 Hàm thuần trong Node

| Hàm (dữ liệu tải) | Lượt 5 | So | Ngưỡng / luật nhiễu |
|---|---|---|---|
| `importBackup` | 909,6 ms (`2e51e25` cùng file, cùng tiến trình: 862,4) | +47 ms (+5 %); `validateBackupInvariants` +14 ms (+8 %) | ≤ 1 100 ms ✅, dưới luật nhiễu |
| `listTrash` 113 / 1 313 dòng | 24,7 / 157,4 ms (`2e51e25` 24,3 / 144,3) | +0,4 / +13 ms (+9 %) | màn < 200 ms ✅ |
| Dọn sạch (`purgeTrash` cả `VACUUM`) 113 / 1 313 dòng | 88,5 / 117,5 ms (`baseline.md`) | lượt 4: 85,2 / 129,8 | trên exe ≤ 500 ✅ |
| `previewPurge` 113 / 1 313 dòng | 1,0 / 6,1 ms | lượt 4: 1,0 / 7,4 | ✅ |
| `byName`: sắp 10 255 lịch hẹn theo KH | 11,2–12,2 ms (ba bên; `2e51e25` 64–72; collator trần 8,1–9,7) | **−54 ms**, 1,16–1,42× collator trần (Issue #896: ≤ ≈ 2×) | ✅ DR6-136 hết |
| Mock trích xuất, cả bộ 3 551 ghi chú RE | 103,5 ms (`2e51e25` 62,2) | **×1,66, +41 ms** ⚠️ | mỗi ghi chú 0,03 ms ✅ → **DR6-165** |
| Mock trích xuất, lần gọi đầu của tiến trình | 28,5 ms (`2e51e25` 9,2) | **×3,1, +19 ms** ⚠️ | < 200 ms ✅ → **DR6-165** |
| Phần AI của hồ sơ, `validateOutput`, `checkWebAnswer`, `extractJson` | như lượt 4 trong nhiễu | ≈ | ✅ |
| `openAppData` + `flush` từ file 14,1 MB | 105,2 ms | lượt 4: 105,7 | ✅ |

Số đo Node của ba bên chạy khác giờ (đợt 1 Claude / Codex song song, đợt 2 DeepSeek một mình). Chỉ kết luận từ cặp xen kẽ cũ ↔ mới cùng tiến trình và từ ngưỡng.

### 7.3 Bundle và exe

| Phần | Lượt 5 | So lượt 4 (`2e51e25`) | Nguyên nhân |
|---|---|---|---|
| `assets/index.js` | 892 184 B (gzip 264 291) | +7 486 B (G7: +7 B, chuỗi neo) | Cấu thành theo package (Claude F, bản dựng tách chunk): `pkg-ai` +5 607 B (Mock trích xuất K42, G5 `@5` K43; esbuild riêng của Claude C: +5 712), `app-routes` +960, `app-data-shell` +548 (`listeners.ts`, `flush`), `app-i18n` +29, `pkg-db` +28 |
| `assets/index.css` | 30 295 B | +543 B | class mới: `has-checked:font-semibold`, `has-disabled:line-through`, `aria-disabled:*`, đệm của ô chọn (DR6-149) |
| Tổng JS / CSS | 2 366 456 B (gzip 699 761) | +8 029 B (gzip +2 627) | — |
| Tệp khác | 1 022 121 B | 0 | — |
| Exe | 5 649 408 B | 0 (= G7) | không dependency, quyền, icon mới |
| Dependency | — | không thêm / bớt / đổi phiên bản; mọi chunk dependency trùng từng byte lượt 4 | — |

### 7.4 Phát hiện P

Một phát hiện P: **DR6-165** (Mock trích xuất). Không thao tác chính nào vượt ngưỡng `phase-6.md` trên dữ liệu tải. Ghi để theo dõi, không phải phát hiện:

- Mock trích xuất trên ghi chú tổng hợp một dòng ≈ 180 000 ký tự: 17,7–48,9 ms trong Node (`2e51e25` 1,0–32,0), tới 153 ms trên màn (lượt 4: 152): tuyến tính, dưới ngưỡng (Claude C).
- Thùng rác 1 313 dòng trên bản web gắn DevTools 419 ms (lượt 4: 510–621): triệu chứng DR6-84 mà Owner chữa bằng Dọn sạch và câu nhắc từ 1 000 bản ghi (Claude E).
- Bộ chặn ký hiệu trên 115 file: 13,5 ms (bản regex `2e51e25`: 6,2 ms); cả lệnh `check-tokens` 0,2 s. Công cụ, không ngưỡng (Claude D, DeepSeek D).

### 7.5 Bloat: không có code chết chạy được có chi phí đo được

| Đã chạy / đo | Kết quả | DR6 |
|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` (mọi package + app + e2e) | 0 | — |
| `pnpm lint:deps` | 0 vi phạm; 354 module / 1 582 phụ thuộc (lượt 4: 341 / 1 435) | — |
| Export ↔ nơi dùng (cả ba bên) | không export chết mới; `PURGE_REMINDER` đã hết (DR6-152); seam test và helper e2e như lượt 4 | — |
| Nhánh không chạy được (coverage) | một nhánh chết ở `app-data.ts:282` | 163 |
| Code lặp (Claude F) | thân hàm trùng nguyên văn ≥ 25 token: **0 nhóm** (216 file, 1 128 thân hàm); theo cấu trúc: đúng 6 nhóm của lượt 4, không nhóm mới. Vòng gọi listener nay một nơi (`listeners.ts`), "giới" / "định" một hàm `unlessAfter` | — |
| Khóa i18n | 1 194 khóa, 0 không dùng, 0 chỉ test dùng; mã lỗi thiếu câu đúng 5 mã như lượt 1–4 | — |
| Coverage | 99,21 / 97,4 / 99,13 / 99,38 % (lượt 4: 99,18 / 97,27 / 99,17 / 99,35) | — |
| Cổng ở SHA ghim | `pnpm verify` 4 387 test; `verify:rust` 120 test; `pnpm e2e` 324 qua, không flaky | — |

Đề xuất refactor bloat: DR6-163 (một dòng hay một chú thích). Công cụ nên có (G4, chỉ đề xuất, như lượt 4): visualizer bundle, `cargo-bloat`.

### 7.6 Chất lượng test

- Ba bên gỡ tạm phần sửa ở mọi dòng R có code: Claude 161 / 184 đột biến bị giết, Codex 79 / 81, DeepSeek 65 / 66. Mọi luật sửa có test đỏ khi gỡ, trừ các chỗ đã thành phát hiện T.
- Đột biến sống không tương đương đã thành DR6-158, 161, 164, 167, 174, 175. Chỗ hở tập trung ở:
  - sửa hiệu năng không có ca thời gian (DR6-158);
  - hợp đồng bản dựng (DR6-161) và cấu hình ranh giới (DR6-167);
  - chỗ nối TSX ↔ hành vi (`today` của T-350, nút đang chạy của 10a): Vitest không có DOM (thêm là G4), nên chỉ e2e giữ được;
  - công cụ phát triển (DR6-175).
- Cổng e2e ổn định: 324 qua không flaky ở bước chuẩn bị; Claude E chạy lại cả bộ 312 / 312 trên bản dựng ngoài repo.

## 8. Kế hoạch xử lý

### 8.1 Việc còn lại của T-362

1. **PR docs báo cáo gốc** #1043 → `docs/reviews/raw/2026-11-05/` (mở trước PR này).
2. **Kiểm độc lập bằng log phiên:** xong (§10).
3. **PR này** ghi thêm:
   - số đo và kết quả lượt 5 vào `docs/metrics/phase-6.md`;
   - ghi chú quy trình của đợt 2 vào kế hoạch (Phụ lục V, "Ghi chú sau lượt 5"; Issue #1042 Mục tiêu 7);
   - các quyết định Owner trong đợt 2 vào `docs/PROJECT-STATE.md`.
4. **Owner trả lời §9:** xong 05/11, đồng ý cả 4 đề xuất. 8 Issue theo §8.2 đã tạo (mẫu Task, milestone Phase 6, ≤ ~400 / ~800 dòng): bảng ở §8.5; quyết định ở `PROJECT-STATE.md` (2026-11-05).
5. **Sau đợt sửa: G7.** Gồm:
   - nghiệm thu lại trên exe phát hành các dòng NT có màn hay hành vi đổi (K46): tên dài ở các màn của DR6-170, hộp Hợp đồng, hai ô tìm, tên nút khôi phục, khung dán ChatGPT web; cùng NT-HD-01 (còn `L3 ❌ #1019`);
   - chụp lại ảnh hướng dẫn có màn bị đổi. Tên thường không đổi hình ở DR6-170; bộ kiểm ảnh báo nếu khác;
   - eval AI thật (NT-EV-01) với version prompt cuối;
   - chạy lại cổng và probe trên SHA phát hành, so mốc sau #656.

### 8.2 Nhóm sửa (sửa hết, Owner 04/11, K47)

| Nhóm | DR6 | Việc | Cỡ ước lượng | File chính | Test chấp nhận | Rủi ro / nhãn | Bị chặn bởi |
|---|---|---|---|---|---|---|---|
| **L5-A** Lõi dữ liệu | 158, 159 | Ca test `byName`: lấp bộ nhớ khóa quá trần bằng tên khác rồi sắp 2 022 tên của ca DR6-112, đòi một thứ tự; ca đếm số lần tính khóa theo số tên khác nhau (bền với runner chậm hơn ca thời gian). `isLabel` hỏi "trống" bằng `normalizeText`; lệnh và luật nhập 12 cùng đổi; dữ liệu giả lập nạp lại (K1) | ≈ 1–3 SP + ≈ 40 test | `packages/domain/src/name-order.test.ts`, `packages/db/src/common.ts` (+ test) | Đột biến "quá trần trả tên trần" và "cả file về `2e51e25`" bị giết; model `'\u200b'`, `'\u3164'` → lệnh và luật 12 từ chối | med (luật nhập 12, như #907) | — |
| **L5-B** Lưu và hợp đồng bản dựng | 161, 162, 163 | Ca hợp đồng: liệt kê `capabilities/` (đệ quy), đòi đúng một file `default.json`, `app.security.capabilities` không có, so cả object của `default.json`. Hàng đợi: một `drain` duy nhất lấy snapshot kế tiếp (hay `drain` cũ dừng khi `running` không còn là nó); ca listener gọi hai lệnh ghi lồng. Nhánh chết: bỏ, hay chú thích | ≈ 10–25 SP + ≈ 60 test | `apps/desktop/src/data/{tauri-contract.test.ts,persist-queue.ts,app-data.ts}` (+ test) | CAP1–CAP4 của Claude B bị giết; probe của CXR5-B2 (listener lồng hai lệnh, giữ từng lần ghi) → không lượt ghi chồng, file lúc đóng có mọi thay đổi | med (hàng đợi lưu) | — |
| **L5-C** AI | 164, 165 (theo Q2), 166, 167, 168 | Ca `worded` ("1. Khách đã kết hôn.", "... Hai vợ chồng …", đối chứng "Gặp. Khách đã kết hôn."). Mock: ngoại lệ "bé nghĩa nhỏ" áp cả cho dạng khác của luật 3; `BULLET` nhận "–" (U+2013) theo cùng điều kiện khoảng trắng; §10 ghi hai điểm. Rule `ai-test-support-only-in-tests` xét mọi file không phải test của package `ai` ở bên nhập, kể cả `apps/`. Khung dán ChatGPT web hỏi "trống" như ô khác (bỏ ký tự vô hình theo tập K20 rồi cắt khoảng trắng), ở `checkWebAnswer` và ở nút; sửa chữ spec §3.1 mục 3 | ≈ 15–30 SP + ≈ 60 test | `packages/ai/src/{mock-extraction.ts,web.ts}` (+ test), `apps/desktop/src/routes/customers/KycWebSession.tsx`, `.dependency-cruiser.cjs`, `docs/design/phase-5-ai.md` (§3.1, §10) | Đột biến T6 của Claude C bị giết; hai câu của CXR5-C1, C2 ra đề xuất; import `test-support` từ `apps/desktop/src` → `lint:deps` đỏ; dán U+200B / U+2060 → `EMPTY`, không tính lần thử; 1 972 đề xuất trên ghi chú thật chỉ thêm, không mất | med; review mức high (`packages/ai`). Không G5: không đổi prompt, validator hay danh sách chặn | — |
| **L5-D** Bộ chặn ký hiệu | 169 (theo Q3) | Thêm `←–…“”‘’` vào tập ký hiệu. Theo Q3: bắt escape `\uXXXX` trong chuỗi / template và thực thể HTML trong chữ JSX. Luật dấu nối JSX bỏ qua khoảng trắng, xuống dòng và một `{' '}` / `{" "}` giữa `}` và dấu nối, xét cả dấu nối đứng trước `<` của một phần tử. Bộ đếm `types` đếm `<` lồng của kiểu hàm generic. `JOINER` chỉ báo khi chuỗi là đối số của `.join(` (hay ghi giới hạn vào doc) | ≈ 15–35 SP + ≈ 60 test | `packages/ui/src/token-guard.ts` (+ test) | Mọi dạng 🔁 ở §6.4 (a), (b) bị báo, (c) không báo; `ast-compare` 0 báo nhầm trên mọi file của repo; `plant-forms` của Claude D: 510 / 510 lần cắm bị báo | low | — |
| **L5-E** Chuỗi liền dài | 170 (theo Q4), 174 (c) | Bọc `block max-w-60 wrap-anywhere` / `min-w-0 wrap-anywhere` ở chín chỗ (cách của DR6-117 / 148; tên thường không đổi hình); ô chọn góc nhìn giới hạn bề rộng, lựa chọn vẫn hiện đủ khi mở. Ca e2e theo Q4. Ca cột Team của Theo RE ≤ 240 px | ≈ 15–25 SP + ≈ 100 e2e | `apps/desktop/src/routes/{customers/CustomersScreen.tsx,customers/CustomerProfile.tsx,customers/CustomerPolicies.tsx,customers/KycHistory.tsx,appointments/AppointmentsScreen.tsx,SettingsTrash.tsx,FilterBar.tsx,overview/StageBlock.tsx}`, `apps/desktop/src/shell/ScopePicker.tsx` hay `packages/ui/src/components/SelectField.tsx`, `e2e/long-names.spec.ts` | KH 81 chữ, RE / team 160 chữ liền, nhãn model 100 chữ ở 1 100 / 1 440: không màn nào cuộn ngang; E148e bị giết | low | — |
| **L5-F** Gói E: Thùng rác, ô tìm, hộp HĐ, test hở | 160 (theo Q1), 172, 173, 174 (a, b) | Tên nút khôi phục theo Q1. `searchCustomers` / `filterTrash` so trên `normalizeText` (một hàm "chuỗi tìm" dùng chung), `AppointmentDialog.tsx:378` hỏi trống bằng `normalizeText`. `PolicyDialogs` `shown` dùng `normalizeText`. e2e: Enter / click nút "Đang nhập…" của 10a → một backup; Thùng rác nhập bù lịch Dự kiến ngày trước hôm nay, xóa → dòng / tên nút / hộp 11b "Chưa ghi kết quả" | ≈ 15–40 SP + ≈ 120 test / e2e | `apps/desktop/src/routes/{trash-view.ts,appointments/appointment-form.ts,appointments/AppointmentDialog.tsx,customers/PolicyDialogs.tsx}` (+ test), `packages/db/src/{trash.ts,backup-validation.ts}` (theo Q1), `e2e/{dialog-keyboard,trash,customer-policies}.spec.ts`, `docs/design/phase-3-du-lieu.md` (luật mã KH) | Ca của Q1 có tên nút khác nhau; mã KH sai khuôn → nhập từ chối; U+200B / NBSP / hai dấu cách → tìm ra; ô HĐ chỉ có ký tự vô hình chờ Lưu như ô trống; E154d, E350c, E350d bị giết | med (Q1 (a) thêm luật nhập mã KH) | — |
| **L5-G** Công cụ | 175, 176, 177 | Ca cho `globMeetsFolder` (`packages/*/src`, `packages/a*/src`), `waitFor` (lỗi xen lần đọc tốt), `titleState` (số dính trước), `reviewedPr` (yêu cầu kẹp giữa hai khối). `ci --since`: chỉ tính run `pull_request` của đúng PR tạo sau mốc, và kết luận theo check của run đó (hay đòi run đó xong không `cancelled`). `metRows` lọc theo ô Trạng thái | ≈ 10–30 SP + ≈ 60 test | `tools/{notes-core,auto-wait-core,review-hint-core}.test.mjs`, `tools/auto-wait-core.mjs`, `tools/auto-wait.mjs`, `e2e/perf/probe.perf.ts` | R156b, W15, W13b, H6 bị giết; ca `workflow_dispatch` / run hủy → chưa xong; KH tên chứa "Đã gặp" không vào phép đếm | low. `tools/auto-wait*`, `review-hint-core`, `notes-core` (qua `notes-for`) thuộc rào "không tự sửa" của `auto-issues`: làm ngoài pipeline (K45) | — |
| **L5-H** Tài liệu | 171, 165 (theo Q2 (a)) | Thêm 7c vào câu 7d ở mục "Ô chọn"; ghi chú NT-AI-17 trỏ §10 (hay liệt kê ngắn). Theo Q2 (a): ghi mốc Mock trích xuất vào `phase-6.md` | tài liệu | `docs/testing/nghiem-thu-v1.md`, `docs/metrics/phase-6.md` | Dòng ghi có, khớp app / mockup | low | — |

Tổng: **8 Issue**, ≈ 85–195 dòng SP + ≈ 500 dòng test, phần lớn là test. Không nhóm nào cần `build-exe`: L5-B chỉ đọc `src-tauri/capabilities` trong test, không sửa. Không G5. Bốn nhóm `risk:med`: L5-A, L5-B, L5-F (luật nhập mã KH theo Q1 (a)) và L5-C (review nâng lên mức high vì chạm `packages/ai/**`).

### 8.3 Thứ tự, ước lượng

1. Owner trả lời §9 (xong 05/11).
2. Tám nhóm làm song song được, vì khác file. L5-E và L5-F cùng chạm màn Thùng rác: L5-E ở ô "Thuộc" của `SettingsTrash.tsx`, L5-F ở `trash-view.ts`. PR nào merge sau thì `gh pr update-branch` như thường.
3. G7 sau khi cả 8 nhóm merge (§8.1 mục 5).

Mỗi Issue một phiên, review phiên sạch như thường; L5-G làm ngoài pipeline `auto-issues`. Ước ≈ 1,5–2 ngày làm, tùy số PR Owner phải merge (bốn PR `risk:med`: L5-A, L5-B, L5-C, L5-F).

### 8.4 KNOWN có bằng chứng mới, không đánh số DR6

Không có. Các ca chạm KNOWN mà reviewer tự xếp đúng:

- câu sau nói vợ / chồng KH mất theo cách khác vẫn ra "Đã kết hôn" (Owner 01/11, §10; Claude C K1);
- dữ liệu exe trước v1.0 bị luật mới từ chối (K1, NT-EX-08 / 09; Claude F F1, Codex F F06);
- tên TL dài ở hàng tiêu đề thẻ team (ACCEPTED 02/11; DeepSeek D).

### 8.5 Issue sửa đã tạo (05/11)

| Nhóm | Issue | Task | Rủi ro / nhãn | Bị chặn bởi |
|---|---|---|---|---|
| L5-A | #1045 | T-363 Test `byName` giữ sửa DR6-136, nhãn model hỏi trống bằng `normalizeText` | med | — |
| L5-B | #1046 | T-364 Test hợp đồng capability đủ, hàng đợi lưu không chồng lượt, nhánh chết `app-data` | med | — |
| L5-C | #1047 | T-365 Mock trích xuất (`worded`, "bé", gạch "–"), rule `test-support`, khung dán ChatGPT web trống | med (review mức high) | — |
| L5-D | #1048 | T-366 Bộ chặn ký hiệu bắt đủ ký hiệu, escape, thực thể HTML, dấu nối JSX, bỏ báo nhầm | low | — |
| L5-E | #1049 | T-367 Chuỗi liền dài ở chín chỗ và e2e quét mọi màn | low | — |
| L5-F | #1050 | T-368 Tên nút khôi phục, luật nhập mã KH, hai ô tìm, hộp HĐ, e2e 10a và Thùng rác | med | — |
| L5-G | #1051 | T-369 Công cụ: test `notes-core` / `auto-wait` / `review-hint`, `ci --since`, `metRows` của probe | low (ngoài pipeline `auto-issues`) | — |
| L5-H | #1052 | T-370 Tài liệu nghiệm thu (7c, NT-AI-17) và mốc Mock trích xuất | low | — |

Mọi Issue có `type:task`, `ready-for-agent`, milestone Phase 6. Mục "Ghi chú OPEN liên quan" của từng Issue lấy theo `notes-for --files` (sổ @ `37a80b6`): sổ OPEN rỗng nên không có mục nào. Không Issue nào chặn Issue nào: L5-E và L5-F cùng chạm màn Thùng rác nhưng khác file (§8.3).

## 9. Câu hỏi cần Owner quyết

**Owner trả lời 05/11: đồng ý cả 4 đề xuất**: Q1 (a), Q2 (a), Q3 (a), Q4 (a). Ghi ở `docs/PROJECT-STATE.md` (2026-11-05); Issue theo §8.5.

Mỗi câu có đề xuất; Owner đồng ý mà không ghi gì khác thì lấy đề xuất. Mọi câu chỉ là **chọn cách sửa** (Owner đã chốt sửa hết, K47).

1. **DR6-160 — tên nút khôi phục ở Thùng rác** (mở rộng Q3 (a) của lượt 4).
   - (a) Sửa cả ba ca:
     - lịch hẹn / HĐ: khi tên KH của dòng trùng tên một KH khác có dòng trong Thùng rác, vế "của KH <tên>" thêm mã KH theo khuôn `customer.withCode` của 9b;
     - hai nhân sự trùng cả tên, vai trò và team: tên nút thêm giờ xóa như cột "Xóa lúc";
     - mã KH: luật nhập backup chỉ nhận mã dạng app sinh (`K-` + 4 ký tự). Đây là một luật nhập mới; dữ liệu giả lập nạp lại (K1).
   - (b) Chỉ phần lịch hẹn / HĐ. Hai ca còn lại ghi ACCEPTED vào sổ, với lý do: hai dòng nhân sự giống nhau ở mọi cột trừ giờ xóa; mã KH chỉ khác dấu cách chỉ có ở backup sửa tay.
   - (c) Giữ như nay, ghi cả ba ACCEPTED.

   **Đề xuất: (a).** Owner đã chốt sửa hết. Mỗi phần nhỏ; luật mã KH cũng chặn mọi mã lạ khác của file sửa tay.
2. **DR6-165 — Mock trích xuất chậm hơn quá luật nhiễu** (dưới ngưỡng).
   - (a) Chấp nhận chi phí, ghi mốc mới vào `phase-6.md`, không đổi code:
     - lần gọi đầu của tiến trình 28,5 ms;
     - cả bộ 3 551 ghi chú thật 103,5 ms;
     - lần bấm AI trích xuất đầu trên màn 53 ms.

     Lần bấm đầu của mỗi phiên app thêm ≈ 20 ms trên thao tác ≈ 30–50 ms; Mock chỉ cho demo / e2e / máy chưa có key.
   - (b) Tối ưu Mock (dựng regex khi gọi lần đầu, giảm lookbehind lồng). Phải chứng minh lại đủ 1 972 đề xuất trên ghi chú thật.

   **Đề xuất: (a).** Đây là sửa bằng tài liệu, như Q4 (a) của lượt 4; lợi ích của (b) người dùng không nhận ra.
3. **DR6-169 (a) — ký hiệu viết bằng escape và thực thể HTML** (phần Issue #901 để ngoài).
   - (a) Bộ chặn bắt cả escape `\uXXXX` của các ký hiệu trong tập (trong chuỗi / template) và thực thể HTML có tên hay số (`&times;`, `&middot;`, `&rarr;`, `&#183;`…) trong chữ JSX. Bỏ câu "nor a mark written as a Unicode escape" khỏi doc của hàm.
   - (b) Chỉ thêm `←–…“”‘’`; escape và thực thể ghi là giới hạn trong doc của hàm, như regex literal.

   **Đề xuất: (a).** ≈ 10 dòng; app hiện không có dạng nào nên không báo nhầm, và cam kết "ký hiệu chỉ ở `vi.ts`" giữ đủ.
4. **DR6-170 — chuỗi liền dài** (lượt thứ ba tìm thêm chỗ: DR6-117 lượt 3, DR6-148 lượt 4).
   - (a) Sửa chín chỗ, thêm **một ca e2e quét mọi màn chính** (Tổng quan, Lịch hẹn, Khách hàng bảng / Kanban / hồ sơ, Báo cáo, Team, Cài đặt → Thùng rác, lịch sử AI). Ca dùng KH 81 chữ, RE / team 160 chữ liền, cả khi chọn góc nhìn RE / team, ở 1 100 / 1 440, và đòi trang lẫn `main` không cuộn ngang. Màn mới sau này có tràn thì CI đỏ.
   - (b) Sửa chín chỗ, e2e riêng từng chỗ như DR6-148.
   - (c) Chặn ở lệnh: tên không có chuỗi liền quá N ký tự. Đây là luật dữ liệu mới (lệnh + luật nhập, K1, G2) và không sửa chỗ nào đang tràn với dữ liệu cũ.

   **Đề xuất: (a).** Ca quét chặn được lượt tìm thứ tư.

## 10. Kiểm độc lập và tuân thủ quy trình

Theo nội dung báo cáo:

- **SHA và `git status`:** cả 18 báo cáo ghi `37a80b6` và `git status --short` rỗng ở đầu / cuối phiên. Phiên tổng hợp kiểm lại 05/11: checkout chính ở `37a80b6`, sạch. Bước 7 đợt 2: `Project-2C-review` sạch sau từng gói DeepSeek.
- **Không gọi AI thật, không đọc key:** probe AI dùng Mock, adapter / clipboard giả hay server loopback. Probe trình duyệt / exe chặn mạng ngoài 127.0.0.1 / localhost từ lần chạy đầu.
- **Khuôn báo cáo:** đủ 9 mục ở cả 18 báo cáo. Gói F của cả ba bên có bảng R1 gộp 25 dòng, bảng R2 gộp 28 dòng và kết luận.

### 10.1 Kiểm bằng log phiên (plan §8, §L4.10, §L5.10)

Làm 05/11 trên Home PC. Log đọc bằng script `node`, không gọi model. Script quét **đầu vào lệnh công cụ** theo danh sách quét của §L4.10 với các đổi của §L5.10. Không quét prompt hay kết quả trả về, trừ phần "bị từ chối" của DeepSeek. Với Write / Edit chỉ quét đường dẫn file. Phiên tổng hợp xét tay từng chỗ khớp. Log thô không vào repo.

| Bên | Log | Phiên | Lệnh công cụ |
|---|---|---|---|
| Claude | `.claude\projects\C--workspace-Project-2C-review\*.jsonl`; thư mục tạm của phiên ở `deep-review-1-6-r5\claude\_temp-9baf74bac889a6ec\` (6 phiên gói: 13 file `tasks\*.output`, 0 chỗ khớp danh sách quét; các thư mục khác trong đó là phiên trước lượt 5) | 6 phiên gói (mức `xhigh`, model `claude-opus-5-5` ở mọi bản ghi); 0 transcript subagent. Phiên `9b51e7b5-…` (21:24–22:06) là bước chuẩn bị, không tính | 994 (A 122 · B 151 · C 161 · D 175 · E 168 · F 217) |
| Codex | `.codex\sessions\2026\11\{04,05}\rollout-*.jsonl` | 6 phiên chính (`gpt-6.1-sol`, `xhigh`) + 6 phiên `codex-auto-review` (0 lệnh) | 404 (A 79 · B 59 · C 71 · D 66 · E 54 · F 75) |
| DeepSeek | bản Owner chép ra `deepseek\<gói>\session\<id phiên>.jsonl` + `tool-results\`; hai task thử ở `deepseek\thu\session\` | 6 task gói, tin nhắn đầu "Gói X." đúng gói; 0 thư mục `subagents\` ở phiên gói | 891 (A 138 · B 141 · C 182 · D 120 · E 160 · F 150); task thử 64 + 35 |

**Không phát hiện nhiễm và không phát hiện vi phạm chỉ đọc.**

- **Lệnh đầu tiên:** cả 18 phiên gói chỉ đọc file prompt của bên đó.
- **Thư mục và dữ liệu của bên khác, liệt kê / tìm kiếm cấp gốc:** 0 lần ở 18 phiên gói. Mọi chỗ khớp đường dẫn bị chặn nằm ở hai task thử của DeepSeek: đó là các lần đọc thử mà task phải làm (`baseline.md`, đợt 2).
- **Thư mục lượt 1–4:**
  - Claude A–F đọc / chép theo tên probe lượt 4 của chính Claude (`-r4\claude\<gói>\`; F thêm exe lượt 3 ở `-r3\claude\F\`); quy tắc 3 cho phép. Claude D tự ghi đã `ls` hai thư mục `-r4\claude\`, `-r4\claude\D\` ở đầu phiên: chỉ thư mục của chính Claude, lệch chữ quy tắc 2 ("không liệt kê trên `deep-review-1-6-r4\`").
  - Claude A, B, F mở theo tên `-r4\common\load\load-2026-10-12-seed6.p2cbackup` (dữ liệu tải lượt 4, để so cùng file) và `-r4\common\exe\project2c.exe`. `-r4\common` không có trong danh sách "chỉ đọc" của quy tắc 3; đó là dữ liệu chung của lượt 4, không phải bài của bên khác.
  - Codex, DeepSeek: 0 lần.
- **ACL của đợt 2:** phiên gói của DeepSeek 0 lần bị ACL từ chối, tức không thử mở chỗ bị chặn. Các chữ "Access is denied" / EPERM trong log là nội dung file nó đọc (test, báo cáo lượt 4, kế hoạch) hay probe tự dựng (B: `rename_probe`). Bước 7.5: 12 báo cáo của Claude / Codex không đổi hash.
- **Ghi vào worktree** (quy tắc chung 1: "buộc phải patch trong repo thì gỡ ngay sau khi chạy và kiểm lại bằng `git status` / sha256"):
  - Claude: 0 lệnh Write / Edit ngoài `claude\`. Đột biến qua hook `load` của Vite hay bản dựng ngoài repo; C vá worktree rồi trả nguyên byte, kiểm sha256 (`mut.mjs`, như lượt 3–4).
  - Codex chạy bản chép trong `codex\<gói>\`, chỉ sửa bản chép (vd. `e2e/serve.mjs` của bản chép ở E, F).
  - DeepSeek vá rồi trả trong cùng lệnh (`git checkout --` hay bản `.orig`), mỗi lần in sha256 hay `git status`. C tạo tạm trong worktree `packages/ai/src/zz-old-mock.ts`, `zz-new-t329.ts` (từ `git show`) và `e2e/zz-dsr5c-*.spec.ts`, xóa ngay trong cùng lệnh. F chụp lại 28 ảnh hướng dẫn vào worktree (trùng byte) rồi `git checkout -- docs/user-guide/img`.
  - Ghi ra ngoài thư mục của bên đó mà ngoài repo: chỉ thư mục tạm và thư mục build / cache bị ignore (`apps\desktop\dist`, `target\`, `.vite`).
  - File chung ở `common\` sửa lần cuối 21:47 ngày 04/11, trước lệnh đầu tiên của đợt 1 (22:08), trừ `baseline.md` (phiên chuẩn bị đợt 2, phiên thử, task kiểm expert và Claude ở bước 7 ghi thêm, tới 12:52 ngày 05/11).
- **`pnpm`:**
  - Claude 0 lần.
  - DeepSeek B chạy `pnpm --filter @p2c/desktop build:web` (dựng lại `dist` không biến riêng), E chạy `pnpm lint:tokens` qua `pnpm.cjs`; cả hai trong worktree `Project-2C-review`, không trong bản chép.
  - Codex chạy `pnpm -v` (B, E) và `pnpm build:web` (F) trong worktree `Project-2C-review-2`. Corepack thử tải bản `pnpm` ghim, DNS của sandbox chặn, không tải được; Codex chuyển sang gọi thẳng CLI trong `node_modules`.
- **`gh`, `git push`, git ghi khác:**
  - 0 lần ở phiên gói của Claude, Codex. Lệnh `git` khớp mẫu đều là đọc (`merge-base`, `diff`, `show`, `rev-parse`).
  - DeepSeek F chạy `node tools/auto-wait.mjs ci 1 --once` và các biến thể để thử mã thoát. Lệnh đó gọi `gh` thật, vì shim `gh` giả của nó không được dùng (`spawnSync` không phân giải `gh.cmd` theo PATH). Suốt đợt 2 `gh` đã đăng xuất (bước 2), nên mọi lần đều exit 3 "read failed", không đọc được gì. Lệch quy tắc riêng 4 ("không chạy `gh`") theo cách gián tiếp, không có tác dụng.
- **Node và Playwright của DeepSeek (quy tắc riêng 8):**
  - Mọi lệnh chạy vitest, Playwright, probe đo hay đột biến đặt `C:\Program Files\nodejs` lên đầu PATH trong cùng lệnh. Mọi lần Playwright chạy test có `--output` vào `deepseek\<gói>\…`; chỉ các lần `--list` không có. Số đo của DeepSeek lượt này vì vậy dùng Node 24, so được với mốc.
  - Gạch đầu "mọi lệnh `node` gọi bằng đường dẫn đủ" không được theo: sau khi đặt PATH, DeepSeek gọi `node` trần ở phần lớn lệnh (A 25 · B 28 · C 55 · D 20 · E 35 · F 50 lệnh). Lệnh vẫn chạy Node 24, vì PATH đã đặt trong cùng lệnh.
  - 14 lệnh `node -e` không đặt PATH (C 10, E 4), nên chạy Node 22. Chúng chỉ đọc `package.json`, sửa chuỗi trong probe / báo cáo của chính nó, hay chép tạm file từ `git show`; không lệnh nào chạy test hay đo.
- **Đổi quyền:** Claude B, F đặt `icacls /deny` trên thư mục probe của chính mình (`claude\<gói>\exe\…`) rồi gỡ, kiểm lại 0 dòng DENY. 0 lần trên repo hay thư mục khác; 0 lần chạy `dot2.mjs`.
- **AI của sản phẩm, Credential Manager, chatgpt.com, mạng ngoài:** 0 lần. `Invoke-WebRequest` / `curl` chỉ tới 127.0.0.1. WebSearch / WebFetch của app chỉ ở phiên thử (việc 10).
- **DeepSeek đụng `.workbuddy*`, skill, connector, đổi chế độ quyền, Agent:** 0 lần ở đầu vào lệnh của 6 phiên gói. Chữ `.workbuddy` trong log là đường dẫn `tool-results` app tự ghi vào kết quả lệnh.
- **Mẫu key:** quét 230 file trước khi chép (`sk-`, `gh?_`, `github_pat_`, `Bearer`, `Authorization`): 18 báo cáo, `known.md`, `baseline.md`, `fixes.md`, `plan.md`, mọi file trong `deepseek\*\session\`. Kết quả: 0 chỗ.

**Ghi nhận quy trình** (không đổi phát hiện nào; Issue #1042 Mục tiêu 7, ghi vào kế hoạch ở Phụ lục V, "Ghi chú sau lượt 5"):

1. **`dot2.mjs` chỉ chặn `%TEMP%\claude\<tên thư mục làm việc>`.** Claude Code bản hiện tại để thư mục tạm của phiên ở `%TEMP%\claude\<mã băm của thư mục làm việc>\<id phiên>\`. Lượt 5, phiên chuẩn bị đợt 2 chuyển tay `%TEMP%\claude\9baf74bac889a6ec\` (18 thư mục phiên, 95 file) sang `-r5\claude\_temp-9baf74bac889a6ec\` (Owner chọn 05/11), để `deny` chặn cùng `claude\`.
2. **`deny` coi hard link giữa hai mục cùng bị chặn là link ra ngoài.** Hai thư mục `file-history` của phiên `review-1` và phiên rẽ nhánh của nó chung một file, nên `deny --dry-run` in `STOP` cả lệnh. Lượt 5 thay một link bằng bản chép.
3. **Thư mục gốc `-r4` và `deep-review-1-6` liệt kê được** vì bị tách quanh mục của tài khoản khác (Phụ lục V điểm 3), khác chữ "→ bị từ chối" ở §L5.9 bước 5. Liệt kê chỉ thấy tên mục con; mọi mục con của Owner bị chặn. Đây là kết quả đúng thiết kế, không phải chỗ hở.
4. **Phiên thử không chạy qua Code review expert**, nên có thêm một task kiểm ACL qua expert như lượt 4 (3,59 credit); 30 / 30 lần thử mục bị chặn bị từ chối.
5. **`scan` dừng ở 2 transcript Claude ở checkout chính** mà Owner đã chấp nhận: phiên chuẩn bị đợt 2 in dòng đầu 12 báo cáo, và phiên T-359 có chuỗi mẫu giả của bộ thử `dot2.mjs`.
6. **Giờ trong dòng đầu báo cáo DeepSeek A** ("10:38") muộn hơn giờ sửa file (10:05) và hết log (10:06): giờ model tự ghi, sai. Bảng §2 lấy giờ từ log.

**Cho lần sau:**

- `dot2.mjs` chặn cả thư mục tạm theo mã băm của worktree review, và coi một hard link có mọi đường dẫn nằm trong các mục chặn cả là bên trong.
- §L5.9 bước 5 ghi kết quả dự kiến của thư mục bị tách: "liệt kê được tên mục con, mục con bị từ chối".
- Phiên thử tạo qua Code review expert ngay từ đầu.
- Phiên hỗ trợ đợt 2 không in dòng đầu báo cáo của Claude / Codex. Bộ thử của `dot2.mjs` dựng chuỗi mẫu bằng cách ghép, không viết nguyên văn.
- Prompt DeepSeek, quy tắc 8: giữ "PATH trước", bỏ gạch "đường dẫn đủ" vì PATH đã đủ; hay đòi cả `node -e` cũng đặt PATH. Quy tắc 4: nêu rõ không chạy công cụ của repo gọi `gh` (`auto-wait`, `pr-status`, `merge-pr`).
- Prompt Codex: không gọi `pnpm` (Corepack tải mạng); gọi thẳng CLI trong `node_modules`, như quy tắc chung 1 đã ghi cho bản chép.

## 11. Ghi chú phương pháp

- Phiên tổng hợp (Home PC, 05/11) đọc đủ 18 báo cáo: bảng R, phát hiện, số đo, phần tuân thủ. Phát hiện gộp theo vị trí code + hậu quả; mọi phát hiện kiểm trên code ở `37a80b6`.
- 🔁 một probe Node chạy lại (`tools/ts-hooks.mjs`, repo không đổi):
  - `mockExtractionOutput` trên câu của CXR5-C1, CXR5-C2 và CLR5-C1 (DR6-164, 166);
  - `findHardcodedSeparators` trên các dạng của DR6-169 (a), (b), (c);
  - `isLabel` với U+200B, U+3164, NBSP (DR6-159);
  - dòng hỏi "trống" của `checkWebAnswer` (DR6-168).
- Đọc lịch sử và hợp đồng để chấm sáu dòng R mà Codex chấm khác: thân Issue #898, #931, #950, #952, #960, #986 (`common\fixes.md`); spec Phase 5 §10, §3.1. Đọc `flush()` / `inTurn` / `closeAfterSaving` để bác CXR5-B1, và `drain` để nhận CXR5-B2.
- Các phát hiện còn lại: đọc lại đúng chỗ code + bằng chứng (probe / đột biến / ảnh) của reviewer; với test hở, đọc test hiện có để thấy chỗ hở khớp mô tả. Không đo lại exe: bước chuẩn bị và Claude F đo cùng máy, số khớp.
- Phiên tổng hợp:
  - bác một phát hiện (CXR5-B1);
  - chênh mức bảy mục;
  - chấm sáu dòng R khác Codex;
  - nhận một ca mà Claude E, DeepSeek E thấy nhưng không nêu (CXR5-A2).

## Phụ lục — đối chiếu ID của từng báo cáo ↔ DR6

Mỗi phát hiện của 18 báo cáo (41) có đúng một chỗ ở đây.

| Báo cáo | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| **Claude** (16) | A1→160 · A2→158 · A3→159 | B1→161 | C1→164 · C2→165 | D1→169 · D2→169 · D3→170 · D4→171 | E1→170 · E2→172 · E3→173 · E4→174 | F1→175 · F2→175 |
| **Codex** (20) | A1→160 · A2→160 · A3→158 | B1→bác · B2→162 | C1→166 · C2→166 · C3→167 · C4→170 | D1→169 · D2→169 · D3→170 · D4→170 · D5→169 | E1→170 · E2→170 · E3→173 | F1→176 · F2→177 · F3→171 |
| **DeepSeek** (5) | — | B1→163 | C1→168 | D1→169 · D2→169 | E1→173 | — |
