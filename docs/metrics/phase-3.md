# Chỉ số Phase 3 — Nghiệp vụ & màn hình

Theo bảng chỉ số của `docs/COMPARISON.md`. Mục ghi **(chờ Owner)** là số liệu Owner cung cấp trước G7.

- **Milestone:** "Phase 3 — Nghiệp vụ & màn hình" — 43 Issue (#57 → #210), 42 đã đóng khi viết file này, còn #72 (file này, G7)
- **Bắt đầu:** 2026-09-26 (G2 #57 → PR #58, spec `docs/design/phase-3-du-lieu.md` + ADR-0016) · **Task cuối merge:** 2026-09-30 (PR #211, `main` `abdff20`) · **Đóng milestone:** (chờ Owner, G7)
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
| #99, #101 (+ R3, R4) | Review theo vùng R1–R4 (ADR-0017 phụ lục) | — | — | — |
| #100, #105, #106, #109, #110, #119 | Sửa từ R1–R4: D10, i18n kỳ, `parseVnd`, bootstrap PS 5.1, CI `main`, nhãn `build-exe` | #102, #107, #112, #115, #116, #122 | low / med | PASS ×6 |
| #131 | Màn Nhân sự (tách từ #65) | #144 | med | PASS |
| #142, #145, #151 | Form KH sát mockup, `addDays` công khai, một nguồn cho trường KYC hồ sơ | #177, #146, #152 | med, low, med | PASS ×3 |
| #173, #180, #186 | Xóa lịch Dự kiến, link Ghi chú KYC 6c, card File dữ liệu | #179, #183, #194 | low | PASS ×3 |
| #187, #189, #191, #195 | Sửa từ review #185 / #188 / #190 / #194: file xuất dở, đóng DB cũ, đường dẫn có dấu phẩy | #188, #190, #192, #196 | high ×3, low | PASS ×4 |
| #198 | Codex chỉ review khi đóng phase (ADR-0001 M2) | #199, #201 | low | — (docs) |
| #202, #203, #204, #210 | Đợt 1 của review đóng phase (F-01…F-04) | #206, #208, #209, #211 | high ×3, low | PASS ×4 |
| #72 | Đóng phase (file này) | (PR này) | low · G7 | — |

## Chỉ số

| Nhóm | Chỉ số | Giá trị |
|---|---|---|
| Chất lượng | % test chấp nhận pass lần đầu | PR code: **50/62 (81%)** PASS ở review vòng đầu. Theo Issue: **31/37 (84%)** Issue code không có PR nào bị CHANGES vòng đầu (6 Issue có: #61, #63, #66, #68, #69, #71). Golden G01–G22, K01–K15 chạy qua DB, fixture không sửa |
| Chất lượng | Lỗi Owner phát hiện khi duyệt | (chờ Owner) — Claude không ghi nhận lỗi code nào do Owner tìm; Owner quyết các lệch mockup do review nêu (#171, #186, 6c) |
| Chất lượng | Lỗi sau merge | **Do review tìm, không do người dùng gặp:** review theo vùng R1–R4 → 6 task sửa (#100, #105, #106, #109, #110, #119); review PR sau → #88–#91, #187–#195; review đóng phase (Claude + Codex) → 1 High (F-01 nhập backup bỏ qua bất biến), 5 Medium, 12 Low, 2 Nit — F-01…F-04 sửa ở Đợt 1 (#202–#204, #210). Owner kiểm tay exe: (chờ Owner) |
| Chất lượng | Coverage `packages/domain` | 100% (ngưỡng gộp của `vitest.config.ts`; ép riêng theo gói là F-08, Đợt 2). `packages/db/src`: 99,33% statements / 97,8% branches / 100% functions / 99,71% lines. Toàn bộ: 757 test, 99,49 / 98,4 / 100 / 99,78 (`main` `abdff20`) |
| UI/UX | Điểm Owner (1–10): thẩm mỹ dark mode / độ rõ số liệu / tốc độ thao tác nhập liệu | (chờ Owner) / (chờ Owner) / (chờ Owner). Mockup màn nhập liệu Owner duyệt ở G3 (#59) |
| Tiến độ | Ngày bắt đầu / kết thúc | 26/09 → 30/09/2026 (task cuối); đóng milestone: (chờ Owner) |
| Tiến độ | Số phiên làm việc | (chờ Owner) — 140 PR merge từ 26/09 tới 30/09 trên cả repo, trong đó 62 PR code của Phase 3 |
| Chi phí | Mức dùng hạn mức Claude | (chờ Owner) |
| Công sức Owner | Can thiệp ngoài cổng G1–G8 | (chờ Owner) |
| Kỹ thuật | Kích thước exe | (chờ Owner, đo khi kiểm tay) — artifact `Project-2C-abdff201d0c347d0175436b6668d26e3ec667ccb` là file zip 2,16 MB (2.160.444 byte); Phase 1 đo 3,85 MB exe |
| Kỹ thuật | Thời gian khởi động | (chờ Owner, đo khi kiểm tay) |
| Kỹ thuật | Vi phạm ranh giới module | 0 (`pnpm lint:deps`: 177 module, 670 phụ thuộc) |

## Kiểm tra trên `main` `abdff20` (30/09/2026, Home PC)

| Lệnh | Kết quả |
|---|---|
| `pnpm verify` | ✅ Prettier, ESLint, `lint:deps` 0 vi phạm, `lint:tokens`, typecheck, 47 file / 757 test, coverage như trên |
| `pnpm e2e` | ✅ 95/95 (Edge, 1,3 phút; lần này không có test vượt 30 s — F-05 vẫn để Đợt 2) |
| CI `main` (build exe, `cargo fmt` / `clippy` / `test`) | ✅ run `36732226056` |
| Kiểm tay exe | (chờ Owner) — danh sách trong `docs/state/HANDOFF.md` "Chờ Owner" |

## Review đóng phase

- **Big review Phase 1→3** (30/09/2026, SHA `0fa0eea`): hai review độc lập — Claude Code (phiên sạch, được chạy test) và **Codex Astra** (Owner chạy, chỉ đọc; lần đầu áp dụng ADR-0001 phụ lục M2). Claude hợp nhất thành F-01…F-19, kiểm lại từng điểm khác nhau trên code, rồi lập kế hoạch 3 đợt. Báo cáo tổng hợp: `docs/reviews/2026-09-30-phase-1-3-tong-hop.md`.
- **Đóng góp của Codex:** tìm thêm các điểm lệch tài liệu Claude bỏ sót (PLAN, HANDOFF, mockup Tổng quan dùng công thức tỉ lệ chốt cũ, mockup 10c), `note_id` trỏ ghi chú KH khác (F-01), bằng chứng review không khớp head (F-16). Codex không chạy test nên không thấy e2e chập chờn (F-05) và không đo hiệu năng; Codex xếp F-04 là Medium, bản tổng hợp hạ xuống Low sau khi đo.
- **Kết quả:** không có lỗi Critical; 1 High, 5 Medium, 12 Low, 2 Nit. Đợt 1 (bảo vệ dữ liệu) sửa trước G7: #202–#204, #210. #72 làm F-10 (tài liệu), P-1…P-3 (quy trình), checklist F-18.

## Thay đổi quy trình từ review đóng phase

- **P-1:** `REVIEW: PASS` chỉ có giá trị cho SHA head ghi trong comment; head đổi → review lại; phiên review không commit (skill `review-pr` §1, §5; `CLAUDE.md` bước 5).
- **P-2:** ước lượng cỡ khi viết Issue gồm cả i18n + e2e, vượt ngưỡng thì tách từ đầu; PR liệt kê mọi file ngoài danh sách được phép (`docs/agents/issue-tracker.md`, checklist §1).
- **P-3:** ghi chú review trong `HANDOFF.md` chia OPEN / RESOLVED / ACCEPTED, kiểm lại mỗi lần đóng phase.

## Việc hoãn sang phase sau

- **Phase 4 (Đợt 2):** e2e local ổn định (F-05, làm đầu tiên); G2 cách đếm lịch dự kiến / đã gặp + chuỗi dời, miền năm (F-14), sửa mockup Tổng quan theo ADR-0007 (F-10); index chỉ số + MTD (F-06, F-07); coverage riêng domain / db + ghim SHA Actions (F-08, F-09); dọn UI / i18n / lệnh DB (F-11, F-12, F-13, F-15, F-19); escape formatter ECharts ở task dashboard đầu tiên (F-18).
- **Phase 5:** quyết định gọi mạng + lưu key trước `packages/ai` (D-1, G4 / G6).
- **Phase 6:** màn **"Thùng rác"** khôi phục bản ghi xóa mềm (comment Owner trên #72: làm chung nhóm quản lý dữ liệu, sau khi mọi loại xóa mềm đã có UI, chốt quy tắc khôi phục chéo — D10, người / KH đã xóa — một lần ở G1/G2); snapshot mỗi bảng một file (S-1); tuần tự hóa thay DB / lưu / xuất / đồng bộ (S-2); gộp backup / phát hiện xung đột; đồng bộ `Project-2C-data`.
- Ghi chú review không chặn còn mở: sổ OPEN trong `docs/state/HANDOFF.md`.

## Ghi chú

- Phase 3 dài hơn dự kiến ở phần sau (#71 → #72) vì review phát hiện các đường dữ liệu không tin cậy (nhập backup, file xuất dở, thay DB) — 8 Issue sửa sau khi #71 merge (#187, #189, #191, #195, #202–#204, #210), 6 trong đó `risk:high`.
- PR vượt ngưỡng P1 (F-17): #74, #87, #139, #144, #155, #185 (đều tự khai trong PR); #96 sửa `playwright.config.ts` ngoài danh sách mà không khai → thành quy tắc P-2.
- Chuyển máy giữa Home PC và Office Laptop nhiều lần trong phase qua `HANDOFF.md`; báo cáo review đóng phase nằm ngoài repo trên một máy cho tới #72 (Owner chép sang Home PC).
