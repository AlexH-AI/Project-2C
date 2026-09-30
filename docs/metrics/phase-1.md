# Chỉ số Phase 1 — Nền móng

Theo bảng chỉ số của `docs/COMPARISON.md`.

- **Milestone:** "Phase 1 — Nền móng"
- **Bắt đầu:** 2026-09-26 (commit đầu `20e9c5e`) · **Code xong:** 2026-09-26 (PR #23, T-007.5) · **Kiểm exe ở văn phòng:** 2026-09-28 (#9)
- **Máy:** Home PC (`DESKTOP-KDURKJP`) làm toàn bộ code; Office Laptop (`D13_ThinkPad`) kiểm exe

## Task

| Issue | Việc | PR | Risk | Test chấp nhận pass lần đầu |
|---|---|---|---|---|
| #1 | Quy tắc repo, giao thức phiên, bootstrap | #10 | low | ✅ |
| #2 | Skeleton monorepo, chế độ web, CI build exe | #10 | low | ✅ |
| #3 | Branch protection cho `main` | #10 | med · gate | — GitHub Free không có branch protection cho repo private → Owner chọn hook `pre-push` |
| #4 | Cấu hình mattpocock skills | #11 | low | ✅ |
| #5 | Playwright e2e smoke chế độ web + CI | #12 | low | ✅ |
| #6 | Mockup dark mode 4 màn hình (G3) | #13 | med · G3 | — (Owner chấm 8/10, ADR-0013) |
| #8 | Chọn thư viện chart → ECharts | #15 | low · G4 | — (Owner duyệt ADR-0014) |
| #7 | `packages/ui` + app shell (7.1–7.5) | #16, #18, #19, #20, #22, #23 | med · gate | ✅ |
| #9 | Exe chạy trên 2 máy + file này | (PR này) | low · gate | ✅ |
| #17 | Favicon / app icon màu ADR-0013 | #128 | low | ✅ (merge 28/09, sau khi file này được viết lần đầu) |

## Chỉ số

| Nhóm | Chỉ số | Giá trị |
|---|---|---|
| Chất lượng | % test chấp nhận pass lần đầu | 100% ở các task code đã merge |
| Chất lượng | Lỗi Owner phát hiện khi duyệt | 0 đã ghi nhận |
| Chất lượng | Lỗi sau merge | 0 (kiểm exe ở Home PC và Office Laptop không phát hiện lỗi) |
| Chất lượng | Coverage `packages/domain` | Chỉ có `period` (T-007.3a); không đo riêng ở Phase 1 |
| UI/UX | Điểm Owner (1–10): thẩm mỹ dark mode / độ rõ số liệu / tốc độ nhập liệu | 8/10 tổng thể (G3 vòng 1, ADR-0013; Owner giữ nguyên khi kiểm ở văn phòng) / không chấm riêng / không áp dụng (chưa có màn nhập) |
| Tiến độ | Số phiên làm việc | Không ghi nhận |
| Chi phí | Mức dùng hạn mức Claude | Không ghi nhận |
| Công sức Owner | Can thiệp ngoài cổng G1–G8 | Không ghi nhận |
| Kỹ thuật | Kích thước exe | 3,85 MB (`project2c.exe` 3.848.192 byte, artifact `Project-2C-86b4e2c` — bản `main` 28/09, đã gồm Phase 2–3 tới T-057) |
| Kỹ thuật | Thời gian khởi động | 1–2 giây (Owner ước lượng, Office Laptop) |
| Kỹ thuật | Vi phạm ranh giới module | 0 (`pnpm lint:deps`) |

## Kiểm exe trên 2 máy (#9)

| Máy | Artifact | Kết quả |
|---|---|---|
| Home PC | `Project-2C-86b4e2c…` (Owner kiểm tay khi merge T-057, 28/09) | ✅ |
| Office Laptop | `Project-2C-86b4e2c952c5274497a2c30dbcb5fde9b4a7a556` (run `36343058615`), Owner kiểm 28/09 | ✅ không lỗi |

Danh sách kiểm ở Office Laptop: sidebar (PR #18), PeriodPicker (PR #20), DataTable sắp xếp (PR #22), Chart đúng màu (PR #23), lưu khi đóng exe (T-057, PR #125).

## Ghi chú

- Việc kiểm ở văn phòng hoãn từ 26/09 tới 28/09 theo quyết định Owner; Phase 2 và đầu Phase 3 làm song song trên Home PC, nên exe được kiểm là bản mới hơn cuối Phase 1.
- Số phiên, hạn mức Claude và can thiệp ngoài cổng của Phase 1 không được ghi lúc đó; Owner không nhớ để ước lượng lại (28/09).
- #3: thay branch protection bằng hook `pre-push` (26/09); từ 28/09 repo public nên có thêm ruleset `protect-main`.
