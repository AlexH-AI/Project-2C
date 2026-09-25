# ADR-0002: Project-2C là nhánh đối chứng, cách ly với Project-2

- **Trạng thái:** Accepted (G1)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/COMPARISON.md`; `docs/PROJECT-PLAN.md` §7.2 (C5, C6, C7)
- **Commit / PR:** `20e9c5e` · PR: —

## Bối cảnh

Owner muốn so sánh sản phẩm cuối khi cùng một yêu cầu được làm theo hai cách: chỉ Claude Code (2C) và đa agent (Project-2).

## Quyết định

1. **Làm 2C trước**; xong 2C mới làm Project-2 (C5).
2. **Hằng số** giữa hai repo: yêu cầu Q1–Q16, stack, cấu trúc monorepo, lộ trình phase, cổng G1–G8, AI runtime (OpenCode Go + Mock), test chấp nhận và golden examples, plugin (Superpowers + mattpocock/skills), giao thức 2 máy.
3. **Biến**: ai viết/review code; **thiết kế UI** (mỗi repo tự thiết kế, Owner duyệt riêng ở G3 — C6).
4. **Cách ly** (C7): không copy code/test/mockup giữa hai repo, không mở code repo kia làm tham chiếu; chỉ tài liệu yêu cầu được dùng chung; memory Claude riêng theo thư mục.
5. Mọi thay đổi yêu cầu ghi vào **Nhật ký thay đổi yêu cầu** trong `docs/COMPARISON.md` ở cả hai repo; file này giữ giống hệt nhau ở hai repo.
6. Cuối mỗi phase ghi `docs/metrics/phase-<N>.md`; sau v1.0 của cả hai ghi `docs/metrics/FINAL.md`.

## Phương án đã cân nhắc

- **Làm song song hai nhánh** — loại: Owner chỉ có một luồng chú ý, và nhiễm chéo khó kiểm soát hơn.
- **Làm Project-2 trước** — loại theo C5.

## Lý do

So sánh công bằng cần cố định mọi thứ trừ biến đang đo.

## Hệ quả

- Rủi ro đã biết: Owner và Opus có thể "học" từ 2C khi làm Project-2 — ghi nhận thẳng thắn trong đánh giá cuối.
- Mọi thay đổi hằng số (vd. plugin, stack) phải được áp dụng/ghi nhận ở cả hai repo.
