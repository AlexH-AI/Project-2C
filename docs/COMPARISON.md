# Giao thức so sánh Project-2C ↔ Project-2

Status: **ACCEPTED** · Owner quyết định 2026-09-26 · File này giống hệt nhau ở cả hai repo; sửa ở repo này thì sửa y hệt ở repo kia.

## Mục đích

So sánh **sản phẩm cuối** khi cùng một yêu cầu được làm theo hai cách:

| Nhánh | Repo | Cách thực hiện |
|---|---|---|
| **2C (đối chứng)** | `AlexH-AI/Project-2C` → `C:\workspace\Project-2C` | **Claude Code làm chính**, **không subagent**; model và effort do Owner chọn từng phiên (tới 29/09/2026: Opus 5.5, effort *medium*; ADR-0001 phụ lục M1). Không dùng OpenCode, Muse Code, Cursor để viết/review code. Từ 30/09/2026 Codex được phép viết/review code (ADR-0001 phụ lục M2). |
| **2 (đa agent)** | `AlexH-AI/Project-2` → `C:\workspace\Project-2` | Opus 5.5 làm kiến trúc sư/điều phối; các agent khác Claude (OpenCode, Muse, Cursor, Codex) làm task theo `docs/PROJECT-PLAN.md`. |

**Thứ tự:** làm **2C trước**, xong 2C mới làm Project-2.

## Giữ giống nhau (hằng số)

- Yêu cầu sản phẩm và toàn bộ quyết định Q1–Q16 (xem `docs/PROJECT-PLAN.md` §7 của mỗi repo).
- Stack (Tauri 2 + React/TS + SQLite), cấu trúc monorepo, lộ trình phase, cổng duyệt G1–G8.
- AI trong sản phẩm: **OpenCode Go** + Mock (đây là runtime của app, không phải công cụ viết code).
- Test chấp nhận và golden examples cho chỉ số.
- Plugin: Superpowers + mattpocock/skills.
- Giao thức làm việc liên tục giữa 2 máy.

## Được phép khác nhau (biến)

- Ai viết code, ai review.
- **Thiết kế UI**: mỗi repo tự thiết kế, Owner duyệt riêng (G3) → so sánh được cả UI/UX.

## Quy tắc cách ly

1. **Không copy code, test, mockup giữa hai repo.** Khi làm Project-2, không mở code 2C làm tham chiếu (và ngược lại).
2. Chỉ **tài liệu yêu cầu** được dùng chung. Mọi thay đổi yêu cầu phát sinh ghi vào **Nhật ký thay đổi yêu cầu** bên dưới, ở cả hai repo.
3. Mỗi repo có bộ nhớ Claude riêng (theo đường dẫn thư mục); không chép memory giữa hai repo.
4. Rủi ro đã biết: vì 2C làm trước, Owner và Opus có thể "học" từ 2C khi làm Project-2. Ghi nhận thẳng thắn trong đánh giá cuối; không coi là lỗi của nhánh nào.

## Chỉ số ghi nhận (mỗi phase, file `docs/metrics/phase-<N>.md` trong từng repo)

| Nhóm | Chỉ số |
|---|---|
| Chất lượng | % test chấp nhận pass lần đầu; số lỗi Owner phát hiện khi duyệt; số lỗi sau merge; coverage `domain` |
| UI/UX | Điểm Owner chấm 1–10 cho: thẩm mỹ dark mode, độ rõ số liệu, tốc độ thao tác nhập liệu |
| Tiến độ | Ngày bắt đầu/kết thúc phase; số phiên làm việc |
| Chi phí | Mức dùng hạn mức Claude (ước lượng theo phiên); với Project-2 thêm mức dùng các dịch vụ khác |
| Công sức Owner | Số lần Owner phải can thiệp ngoài các cổng G1–G8 |
| Kỹ thuật | Kích thước exe, thời gian khởi động, số vi phạm ranh giới module |

## Đánh giá cuối

Sau khi cả hai đạt v1.0: Owner chạy cùng một kịch bản demo (3 team × 10 RE) trên cả hai bản, chấm theo bảng chỉ số trên, ghi kết luận vào `docs/metrics/FINAL.md` ở cả hai repo.

## Nhật ký thay đổi yêu cầu

| Ngày | Thay đổi | Áp dụng 2C | Áp dụng 2 |
|---|---|---|---|
| 2026-09-26 | Khởi tạo: yêu cầu = Q1–Q16 của Project-2 | ✅ | ✅ |
| 2026-09-30 | Không phải thay đổi yêu cầu — đổi **biến** cách làm của 2C: Codex được phép viết/review code (ADR-0001 M2 của 2C). Ghi các lần dùng Codex trong `phase-<N>.md` để đánh giá cuối tách được phần đóng góp | ✅ | ⬜ Owner chép dòng này + câu ở bảng nhánh 2C sang bản ở Project-2 (Claude 2C không mở repo kia) |
