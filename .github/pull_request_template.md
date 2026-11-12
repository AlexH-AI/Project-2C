Closes #

## Thay đổi

-

## Test chấp nhận

- [ ]

## Ghi chú OPEN liên quan

<!-- `node tools/notes-for.mjs --diff`: mỗi mục "Trùng file" một dòng, `L<dòng>` + đầu mục → đã sửa, hoặc để lại + lý do. Mục mang nhãn của Issue này ([T-… #<issue>], tìm cả mục không trùng file: `rg -n "#<issue>\]" docs/state/review-notes.md`) phải đã sửa; vượt cỡ hay cần cổng G… thì ghi nhãn đích mới cùng loại (PR sổ đổi nhãn). Mục mang nhãn việc khác: "để lại → <nhãn>". Không có mục nào: ghi "Không có". Thiếu dòng là mục chặn của review; mục đã sửa chuyển sang RESOLVED ở PR sổ sau review (T-261). -->

-

<!-- Ba mục dưới chỉ điền cho PR sửa phát hiện: PR đóng Issue có mục "Ngân sách" (vấn đề deep review DR6-*, ghi chú của sổ). PR khác xóa cả ba mục. Thiếu mục, hay mục không khớp diff, là mục chặn của review; cỡ vượt 1,5 lần ngân sách thì REVIEW: CHANGES, trừ khi thân PR trích câu Owner đồng ý, nguyên văn, có ngày (skill review-pr §3.A, T-386). -->

## Test đỏ khi gỡ phần sửa

<!-- Lệnh và kết quả: test của PR đỏ khi gỡ phần sửa, xanh khi có. PR chỉ sửa tài liệu: "không áp dụng". -->

-

## Quét cùng mẫu

<!-- Lệnh `rg` / probe đã chạy; mọi chỗ cùng mẫu (`path:dòng`), gồm các chỗ ở mục "Quét cùng mẫu" của Issue; quyết định từng chỗ: đã sửa / không cùng lỗi / để lại + lý do. -->

-

## Cỡ so ngân sách

<!-- Dòng thêm + xóa của `git diff --numstat -M origin/<base>...HEAD` (<base> là base của PR, như review tính), xếp bằng `classifyFile` của `tools/size-report-core.mjs`; tài liệu, file sinh tự động không tính. Tính tay: file Rust tách theo hunk (dòng đổi trong khối `#[cfg(test)]` là test, còn lại là sản phẩm); file đổi tên lấy đường dẫn mới. Ngân sách là khoảng thì so với cận trên; ngân sách thiếu số của một loại (hay bằng 0) thì không so loại đó, chỉ ghi số thực tế (skill review-pr §3.A). -->

- Sản phẩm: … / ngân sách … (… lần)
- Test: … / ngân sách … (… lần)

## Kiểm tra

- [ ] `pnpm verify` xanh ở local
- [ ] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low` / `risk:med` / `risk:high`
