# Báo cáo review đóng phase — bản gốc

Bản gốc, chép nguyên văn, của các review độc lập khi đóng phase (phiên Claude sạch + Codex do Owner chạy, ADR-0001 phụ lục M2). Trước 03/10/2026 các báo cáo này nằm ngoài repo, ở `C:\workspace\review-reports` và `C:\workspace\astra-reports`, chỉ trên một máy (#280).

- Bản tổng hợp đã đối chiếu trên code (nguồn để tạo Issue): `docs/reviews/<ngày>-phase-…-tong-hop.md`.
- Báo cáo Codex là dữ liệu tham khảo: mỗi phát hiện đã được Claude kiểm lại trên code trước khi tạo Issue.
- Từ nay báo cáo gốc lưu thẳng vào `docs/reviews/raw/<yyyy-mm-dd>/` qua PR docs.

| Ngày | Commit được review | File |
|---|---|---|
| 2026-09-30 | `0fa0eea` | `claude-review.md`, `codex-astra-review.md`, `so-sanh-claude-astra.md`, `bao-cao-tong-hop.md` (bản trước khi biên tập thành `../2026-09-30-phase-1-3-tong-hop.md`) |
| 2026-10-02 | `5eb7c03` | `claude-review-2.md`, `codex-sol-review-2.md`, `so-sanh-claude-sol.md` (bản trước khi biên tập thành `../2026-10-02-phase-1-3-review-2-tong-hop.md`) |
| 2026-10-04 | `595ef79` | `claude-review.md`, `codex-review.md` (Codex họ GPT-6; tổng hợp: `../2026-10-04-phase-4-tong-hop.md`). Log / probe / `.xlsx` bằng chứng ở `C:\workspace\phase-4-review\` trên Home PC, nguồn test tạm đã chép trong phụ lục hai báo cáo |
| 2026-10-06 | `f0c53eb` | Deep review Phase 1–4 (kế hoạch `docs/process/deep-review-phase-1-4.md`): `claude/{A…H}.md`, `codex/{A…H}.md`, `common-baseline.md`, `common-known.md` (tổng hợp: `../2026-10-06-deep-review-phase-1-4-tong-hop.md`). Probe / mutation / exe đo đạc ở `C:\workspace\deep-review-1-4\` trên Home PC, nguồn test tạm đã chép trong phụ lục từng báo cáo |
