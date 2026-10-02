# Chỉ số Phase 3 — Nghiệp vụ & màn hình

Theo bảng chỉ số của `docs/COMPARISON.md`. Số liệu Owner (ước lượng, điểm UI/UX, kiểm tay exe) lấy từ comment của Owner trên #72, 30/09/2026; kiểm tay exe lần 2 Owner báo trong phiên 02/10/2026.

- **Milestone:** "Phase 3 — Nghiệp vụ & màn hình" — 57 Issue (#57 → #245), 56 đã đóng khi viết file này, còn #72 (file này, G7). 14 Issue thêm sau 30/09: gói A + B phản hồi Owner 01/10 (#214–#217, #222–#228), #237, #243, #245
- **Bắt đầu:** 2026-09-26 (G2 #57 → PR #58, spec `docs/design/phase-3-du-lieu.md` + ADR-0016) · **Task cuối merge:** 2026-10-02 (PR #247, `main` `5eb7c03`) · **Đóng milestone:** 2026-10-02 (G7)
- **Máy:** Home PC (`DESKTOP-KDURKJP`) và Office Laptop (`D13_THINKPAD`), chuyển qua lại bằng `HANDOFF.md`
- **Ngưỡng cỡ task đổi từ Phase 3** (G1 P1, ADR-0001 phụ lục, PR #58): ≤ ~400 dòng code sản phẩm và ≤ ~800 dòng tổng diff kể cả test, không tính file sinh tự động (Phase 1–2: ≤ ~400 dòng diff)

## Task

"Review vòng đầu": kết luận của comment `REVIEW:` đầu tiên trên mỗi PR (skill `review-pr`, phiên sạch). `CHANGES` = có mục chặn phải sửa rồi review lại.

| Issue | Việc | PR | Risk | Review vòng đầu |
|---|---|---|---|---|
| #57 | G2 mô hình dữ liệu + lưu trữ (spec, ADR-0016, P1) | #58 | med · G2 | — (Owner duyệt) |
| #59 | G3 mockup màn nhập liệu | #75, #81 | med · G3 | CHANGES (#75) — Owner duyệt G3 |
| #60 | Nền `packages/db` | #74 | med | PASS |
| #61 | DB: KH, chuyển nhóm, lịch hẹn, HĐ + golden G01–G22 qua DB | #76–#79 | med | PASS, PASS, CHANGES, CHANGES |
| #62 | DB: KYC + golden K01–K15 qua DB | #83–#85 | med | PASS ×3 |
| #63 | Lưu file DB trong exe + backup khi khởi động | #87 | high | CHANGES |
| #64 | Seed 3 × 10 RE × 12 tháng | #94–#96 | med | PASS ×3 |
| #65 | Màn Team | #132, #133 | med | PASS ×2 |
| #66 | Khách hàng: danh sách / kanban, tạo / sửa, sửa nhóm tay | #138–#141 | med | CHANGES, PASS, CHANGES, PASS |
| #67 | Hồ sơ KH — KYC | #148–#150 | med | PASS ×3 |
| #68 | Lịch hẹn | #155, #156, #158, #162–#165 | med | CHANGES, CHANGES, PASS, CHANGES, CHANGES, PASS, PASS |
| #69 | Ghi kết quả cuộc gặp | #166, #168–#171 | med | PASS, CHANGES, PASS, CHANGES, PASS |
| #70 | Hợp đồng | #174, #175 | med | PASS ×2 |
| #71 | Xuất / nhập backup `.p2cbackup` | #184, #185 | high | CHANGES, PASS |
| #88, #89, #90, #91 | Việc tách từ review #87: cargo test trong CI, chặn exe thứ hai, dọn backup theo thứ tự ghi, không mất dữ liệu khi đóng | #118, #134, #136, #125 | low, med ×3 | PASS ×4 |
| #99 (R1), #101 (R2); R3 #103, R4 #108 ngoài milestone | Review theo vùng R1–R4 (ADR-0017 phụ lục) | — | — | — |
| #100, #105, #106, #109, #110, #119 | Sửa từ R1–R4: D10, i18n kỳ, `parseVnd`, bootstrap PS 5.1, CI `main`, nhãn `build-exe` | #102, #107, #112, #115, #116, #122 | low / med | PASS ×6 |
| #131 | Màn Nhân sự (tách từ #65) | #144 | med | PASS |
| #142, #145, #151 | Form KH sát mockup, `addDays` công khai, một nguồn cho trường KYC hồ sơ | #177, #146, #152 | med, low, med | PASS ×3 |
| #173, #180, #186 | Xóa lịch Dự kiến, link Ghi chú KYC 6c, card File dữ liệu | #179, #183, #194 | low | PASS ×3 |
| #187, #189, #191, #195 | Sửa từ review #185 / #188 / #190 / #194: file xuất dở, đóng DB cũ, đường dẫn có dấu phẩy | #188, #190, #192, #196 | high ×3, low | PASS ×4 |
| #198 | Codex chỉ review khi đóng phase (ADR-0001 M2) | #199, #201 | low | — (docs) |
| #202, #203, #204, #210 | Đợt 1 của review đóng phase (F-01…F-04) | #206, #208, #209, #211 | high ×3, low | PASS ×4 |
| #214, #215, #216 | Gói A phản hồi Owner 01/10: chữ hiển thị, sắp RE theo team, bộ chọn góc nhìn | #221, #229, #230 | low | PASS ×3 |
| #217 | G3 mockup gói B | #220 | low · G3 | — (Owner duyệt G3) |
| #222, #223 | B1 Team: TL ở đầu bảng, "Người hỗ trợ"; B1b mỗi team tối đa 1 TL | #231, #233 | low | CHANGES, PASS |
| #224, #225 | B2 / B3 hàng chọn RE ở Khách hàng và Lịch hẹn (dùng chung) | #234, #236 | med, low | PASS ×2 |
| #226, #227, #228 | B4 lịch tháng (ngày chọn, hôm nay, dải kỳ) · B5 tô ô Ngày · B6 lưới 12 tháng kỳ Năm | #239, #240, #247 | low, low, med | PASS ×3 |
| #237 | Bỏ `useScope()` chết | #238 | low | PASS |
| #243, #245 | Đồng hồ DB theo ngày của app; đọc một lần qua `clock` (ghi chú review #244) | #244, #246 | low | PASS ×2 |
| #72 | Đóng phase (file này) | #212, #213, (PR này) | low · G7 | — |

## Chỉ số

| Nhóm | Chỉ số | Giá trị |
|---|---|---|
| Chất lượng | % test chấp nhận pass lần đầu | PR code: **62/75 (83%)** PASS ở review vòng đầu (tới 30/09: 50/62; gói A + B và #237 / #243 / #245: 12/13). Theo Issue: **43/50 (86%)** Issue code không có PR nào bị CHANGES vòng đầu (7 Issue có: #61, #63, #66, #68, #69, #71, #222). Golden G01–G22, K01–K15 chạy qua DB, fixture không sửa |
| Chất lượng | Lỗi Owner phát hiện khi duyệt | **0** (Owner quyết, 30/09) — không có lỗi code nào do Owner tìm; Owner quyết các lệch mockup do review nêu (#171, #186, 6c). Kiểm exe 01/10 Owner gửi 16 ý **góp ý giao diện / tính năng** (không phải lỗi) → gói A + B làm trong Phase 3, ý 9 sang Phase 4 |
| Chất lượng | Lỗi sau merge | **Do review tìm, không do người dùng gặp:** review theo vùng R1–R4 → 6 task sửa (#100, #105, #106, #109, #110, #119); review PR sau → #88–#91, #187–#195; review đóng phase (Claude + Codex) → 1 High (F-01 nhập backup bỏ qua bất biến), 5 Medium, 12 Low, 2 Nit — F-01…F-04 sửa ở Đợt 1 (#202–#204, #210). Owner kiểm tay exe (30/09, `abdff20`): **0 lỗi**. Review đóng phase lần 2 (02/10, Claude + Codex Sol): 0 Critical / High; 2 Medium (R2-01 nhập backup còn lọt — chỉ với file sửa tay, R2-02 nhân sự cũ ẩn), 4 Low, 1 Nit — hoãn sang Phase 4 (T-j, T-h, T-d). Owner kiểm tay exe lần 2 (02/10, `5eb7c03`): **0 lỗi** |
| Chất lượng | Coverage `packages/domain` | 100% (ngưỡng gộp của `vitest.config.ts`; ép riêng theo gói là F-08, Đợt 2). `packages/db/src`: 99,33% statements / 97,8% branches / 100% functions / 99,71% lines. Toàn bộ: 782 test, 99,49 / 98,41 / 100 / 99,78 (`main` `5eb7c03`; tại `abdff20`: 757 test) |
| UI/UX | Điểm Owner (1–10): thẩm mỹ dark mode / độ rõ số liệu / tốc độ thao tác nhập liệu | **8 / 8 / 8** (Owner chấm chung một điểm 8/10 cho cả 3 tiêu chí). Mockup màn nhập liệu Owner duyệt ở G3 (#59) |
| Tiến độ | Ngày bắt đầu / kết thúc | 26/09 → 02/10/2026 (task cuối, PR #247); đóng milestone: 02/10/2026. Kế hoạch ban đầu xong 30/09; 01–02/10 làm gói A + B phản hồi Owner và review lần 2 |
| Tiến độ | Số phiên làm việc | **~180 phiên** (Owner ước lượng từ số PR, gồm cả PR docs / handoff và phiên review) — 140 PR merge từ 26/09 tới 30/09 trên cả repo, trong đó 62 PR code của Phase 3; tới 02/10: 162 PR merge, 75 PR code. Owner chưa ước lượng lại cho 01–02/10 |
| Chi phí | Mức dùng hạn mức Claude | **~2 tuần hạn mức** (Owner ước lượng) |
| Công sức Owner | Can thiệp ngoài cổng G1–G8 | **~3 lần** (Owner ước lượng) |
| Kỹ thuật | Kích thước exe | **3,93 MB** (3.933.184 byte, `project2c.exe`, SHA256 `300F485F…365A72B6`) từ artifact `Project-2C-abdff201d0c347d0175436b6668d26e3ec667ccb` (zip 2,16 MB); Phase 1 đo 3,85 MB |
| Kỹ thuật | Thời gian khởi động | Lần đầu **~2 s** tới UI đầy đủ; mở lại **~1 s** (Owner đo, 30/09) |
| Kỹ thuật | Vi phạm ranh giới module | 0 (`pnpm lint:deps`: 179 module, 680 phụ thuộc tại `5eb7c03`; 177 / 670 tại `abdff20`) |

## Kiểm tra trên `main` `abdff20` (30/09/2026, Home PC)

| Lệnh | Kết quả |
|---|---|
| `pnpm verify` | ✅ Prettier, ESLint, `lint:deps` 0 vi phạm, `lint:tokens`, typecheck, 47 file / 757 test, coverage như trên |
| `pnpm e2e` | ✅ 95/95 (Edge, 1,3 phút; lần này không có test vượt 30 s — F-05 vẫn để Đợt 2) |
| CI `main` (build exe, `cargo fmt` / `clippy` / `test`) | ✅ run `36732226056` |
| Kiểm tay exe | ✅ Owner, 30/09 (comment trên #72): mở lại giữ dữ liệu · chặn exe thứ hai · lưu lỗi → thử lại / đóng · xuất trùng tên · nhập (cả file hỏng, file > 100 MB) / nạp lại · Cài đặt → Dữ liệu (#186) · Mở thư mục với đường dẫn có dấu phẩy / khoảng trắng (#195) — tất cả đúng mô tả, 0 lỗi |

## Kiểm tra trên `main` `5eb7c03` (02/10/2026, Home PC, review lần 2)

| Lệnh | Kết quả |
|---|---|
| `pnpm verify` | ✅ ESLint 0 lỗi, 1 cảnh báo (R2-05), `lint:deps` 0 vi phạm, 47 file / 782 test, coverage như trên |
| `pnpm verify:rust` | ✅ `cargo fmt --check`, clippy `-D warnings`, 36/36 test |
| `pnpm e2e` (`CI=1`) | ✅ 113 + 1 flaky / 114 (`customer-forms.spec.ts:136`, pass ở retry; R2-06 → T-d) |
| CI `main` (build exe) | ✅ run `37010438107` |
| Kiểm tay exe | ✅ Owner, 02/10: bản cuối của `main` sau gói A + B, không có vấn đề |

## Review đóng phase

- **Big review Phase 1→3** (30/09/2026, SHA `0fa0eea`): hai review độc lập — Claude Code (phiên sạch, được chạy test) và **Codex Astra** (Owner chạy, chỉ đọc; lần đầu áp dụng ADR-0001 phụ lục M2). Claude hợp nhất thành F-01…F-19, kiểm lại từng điểm khác nhau trên code, rồi lập kế hoạch 3 đợt. Báo cáo tổng hợp: `docs/reviews/2026-09-30-phase-1-3-tong-hop.md`.
- **Đóng góp của Codex:** tìm thêm các điểm lệch tài liệu Claude bỏ sót (PLAN, HANDOFF, mockup Tổng quan dùng công thức tỉ lệ chốt cũ, mockup 10c), `note_id` trỏ ghi chú KH khác (F-01), bằng chứng review không khớp head (F-16). Codex không chạy test nên không thấy e2e chập chờn (F-05) và không đo hiệu năng; Codex xếp F-04 là Medium, bản tổng hợp hạ xuống Low sau khi đo.
- **Kết quả:** không có lỗi Critical; 1 High, 5 Medium, 12 Low, 2 Nit. Đợt 1 (bảo vệ dữ liệu) sửa trước G7: #202–#204, #210. #72 làm F-10 (tài liệu), P-1…P-3 (quy trình), checklist F-18.
- **Review lần 2 Phase 1→3** (02/10/2026, SHA `5eb7c03`, sau gói A + B): hai review độc lập — Claude Code (phiên sạch) và **Codex Sol 6.1** (Owner chạy). Claude tái hiện các ca chỉ Sol tìm được (4/4) rồi hợp nhất thành R2-01…R2-07. Báo cáo tổng hợp: `docs/reviews/2026-10-02-phase-1-3-review-2-tong-hop.md`.
  - **Kết quả:** 0 Critical / High. R2-01 (Medium): nhập backup còn lọt 4 ca — `re_id` trỏ RE đã xóa, transition đầu gắn `appointment_id` (xóa lịch ném lỗi SQLite thô), fact `SYSTEM` năm sinh / giới tính `conflict` sai giá trị (sau khi giải quyết, app tự xuất ra backup không nhập lại được), người sống thuộc team đã xóa. R2-02 (Medium): nhân sự cũ ẩn (2 TL / team, IS/BD/BDM có team). R2-03…R2-06 Low / Nit, R2-07 tài liệu (sửa trong #72).
  - **Đóng góp của Codex Sol:** hai ca nặng nhất của R2-01 (lỗi SQLite thô khi xóa lịch, backup tự sinh không nhập lại được) mà Claude không thấy; hậu quả "không sửa được tên cả hai TL". Claude thêm: team đã xóa còn người sống, số đếm > 999 không qua `formatCount`, e2e chập chờn khi tải nặng. Sol kết luận "chưa sẵn sàng" vì R2-01 và chưa kiểm exe; sau khi Owner kiểm exe và chọn xếp R2-01 vào Phase 4, kết luận hợp nhất là đóng G7 được.
  - **Quyết định Owner (02/10):** R2-01 sửa sau G7 — T-j là task dữ liệu đầu tiên của Phase 4, ngay sau T-d. R2-02: dữ liệu hiện có là giả lập nên **xóa dữ liệu sai lệch**, không migration hay UI cho dữ liệu cũ; gộp vào T-j thành luật 9 "nhân sự" (≤ 1 TL chưa xóa / team; IS/BD/BDM luôn không có team — đổi spec §3.3; người chưa xóa thuộc team chưa xóa).

## Thay đổi quy trình từ review đóng phase

- **P-1:** `REVIEW: PASS` chỉ có giá trị cho SHA head ghi trong comment; head đổi → review lại; phiên review không commit (skill `review-pr` §1, §5; `CLAUDE.md` bước 5).
- **P-2:** ước lượng cỡ khi viết Issue gồm cả i18n + e2e, vượt ngưỡng thì tách từ đầu; PR liệt kê mọi file ngoài danh sách được phép (`docs/agents/issue-tracker.md`, checklist §1).
- **P-3:** ghi chú review trong `HANDOFF.md` chia OPEN / RESOLVED / ACCEPTED, kiểm lại mỗi lần đóng phase.

## Việc hoãn sang phase sau

- **Phase 4 (Đợt 2):** e2e local ổn định (F-05, R2-06, làm đầu tiên); validator nhập lần 3 + luật 9 nhân sự (T-j: R2-01, R2-02, ngay sau T-d); G2 cách đếm lịch dự kiến / đã gặp + chuỗi dời, miền năm (F-14), sửa mockup Tổng quan theo ADR-0007 (F-10); index chỉ số + MTD (F-06, F-07); coverage riêng domain / db + ghim SHA Actions (F-08, F-09); dọn UI / i18n / lệnh DB (F-11, F-12, F-13, F-15, F-19, R2-03…R2-05); escape formatter ECharts ở task dashboard đầu tiên (F-18).
- **Phase 5:** quyết định gọi mạng + lưu key trước `packages/ai` (D-1, G4 / G6).
- **Phase 6:** màn **"Thùng rác"** khôi phục bản ghi xóa mềm (comment Owner trên #72: làm chung nhóm quản lý dữ liệu, sau khi mọi loại xóa mềm đã có UI, chốt quy tắc khôi phục chéo — D10, người / KH đã xóa — một lần ở G1/G2); snapshot mỗi bảng một file (S-1); tuần tự hóa thay DB / lưu / xuất / đồng bộ (S-2); gộp backup / phát hiện xung đột; đồng bộ `Project-2C-data`.
- Ghi chú review không chặn còn mở: sổ OPEN trong `docs/state/HANDOFF.md`.

## Ghi chú

- Phase 3 dài hơn dự kiến ở phần sau (#71 → #72) vì review phát hiện các đường dữ liệu không tin cậy (nhập backup, file xuất dở, thay DB) — 8 Issue sửa sau khi #71 merge (#187, #189, #191, #195, #202–#204, #210), 6 trong đó `risk:high`.
- PR vượt ngưỡng P1 (F-17): #74, #87, #139, #144, #155, #185 (đều tự khai trong PR); #96 sửa `playwright.config.ts` ngoài danh sách mà không khai → thành quy tắc P-2.
- Chuyển máy giữa Home PC và Office Laptop nhiều lần trong phase qua `HANDOFF.md`; báo cáo review đóng phase nằm ngoài repo trên một máy cho tới #72 (Owner chép sang Home PC).
