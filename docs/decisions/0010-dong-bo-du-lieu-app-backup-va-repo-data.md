# ADR-0010: Đồng bộ dữ liệu app — file backup + snapshot qua repo `Project-2C-data`

- **Trạng thái:** Accepted (G1)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §7.1 (Q2b)
- **Commit / PR:** `20e9c5e` · PR: —

## Bối cảnh

App một người dùng, SQLite local (ADR-0004), nhưng Owner làm trên 2 máy và cần dữ liệu nhập tay có ở cả hai.

## Quyết định

Phương án **B + D**:

- **B:** Xuất/nhập file backup thủ công (Phase 3).
- **D:** Snapshot JSON dạng text commit/push vào repo GitHub private **`Project-2C-data`** (tách khỏi repo code và khỏi `Project-2-data`) (Phase 6).

Yêu cầu thiết kế:

- Snapshot sắp xếp ổn định: mỗi bảng 1 file, bản ghi theo ID → diff đọc được.
- Có `schema_version`: cũ hơn → migrate; mới hơn → từ chối, yêu cầu cập nhật app.
- Mở app: remote mới hơn → hỏi có kéo về không. Đóng app: hỏi có đẩy lên không.
- Phát hiện **xung đột** (cùng dữ liệu sửa trên cả 2 máy kể từ lần đồng bộ trước) → không tự ghi đè; Owner chọn.
- App dùng Git có sẵn trên máy; **không lưu token GitHub trong app**.

## Phương án đã cân nhắc

- **A. Chỉ seed** — loại: mất dữ liệu nhập tay.
- **C. Thư mục dữ liệu trên OneDrive/Google Drive** — loại: SQLite trên thư mục đồng bộ dễ hỏng/xung đột.

## Lý do

Cùng cơ chế GitHub Owner đã dùng; có lịch sử và diff; B là đường dự phòng không phụ thuộc dịch vụ.

## Hệ quả

- Cần tạo repo `Project-2C-data` (private) trước Phase 6.
- Cần định dạng snapshot và logic phát hiện xung đột có test.

## Phụ lục — phương án D ra khỏi v1.0 (Owner quyết 11/10/2026)

Dữ liệu v1 là dữ liệu giả lập, nên **chưa làm đồng bộ qua `Project-2C-data`** ở v1.0 (repo này chưa tạo). Khi chuyển sang dữ liệu nhập liệu, chọn phương án backup lên cloud phù hợp hơn và ghi ADR mới (có thể thay phương án D). Kéo theo, snapshot mỗi bảng một file (S-1) và phát hiện xung đột giữa hai máy cũng xét lại khi đó. v1.0 chỉ có phương án **B** (xuất / nhập file backup thủ công).
