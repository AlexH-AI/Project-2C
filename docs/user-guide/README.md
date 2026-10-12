# Hướng dẫn sử dụng Project-2C

> Khung mục lục (T-212, #533). Nội dung chữ viết ở #534 (T-213); mỗi file dưới đây thành link khi được viết.

## Mục lục

| File | Nội dung |
|---|---|
| `01-bat-dau.md` | Chạy exe portable, thư mục `Project2C-data\`, lần mở đầu có dữ liệu giả lập, trạng thái lưu ở góc sidebar, góc nhìn Toàn bộ / Team / RE |
| `02-tong-quan.md` | Tổng quan: chọn kỳ, Lọc, ô Lịch hẹn 4 nhóm, 6 KPI + so kỳ trước, KH theo nhóm, so sánh team / RE |
| `03-lich-hen.md` | Lịch hẹn: 4 nhóm, lịch tháng / năm, đặt lịch, ghi kết quả, hẹn tiếp, dời lịch, sửa / xóa |
| `04-khach-hang.md` | Khách hàng: Kanban / bảng, tạo / sửa / xóa KH, chuyển nhóm tay |
| `05-ho-so-kh.md` | Hồ sơ KH: dữ kiện KYC, ghi chú + xác nhận, mâu thuẫn, dòng thời gian, hợp đồng, lịch hẹn của KH |
| `06-ai.md` | KYC Intelligence: phân tích, discovery, lịch sử, mã F, STALE, AI trích xuất, ChatGPT web |
| `07-bao-cao.md` | Báo cáo: Tổng hợp / Theo team / Theo RE / Theo mốc, xuất Excel |
| `08-team.md` | Team & nhân sự: tạo team, thêm / sửa / xóa người, vai trò |
| `09-cai-dat.md` | Cài đặt → Dữ liệu, → AI, → Thùng rác |
| `10-su-co.md` | Khi có lỗi |
| `11-thuat-ngu.md` | Thuật ngữ |

## Bảng đối chiếu màn / hộp ↔ mục hướng dẫn

Mỗi màn ở sidebar, mỗi mục Cài đặt và mỗi hộp thoại có trong mockup đã duyệt có ít nhất một đoạn hướng dẫn (spec Phase 6 §4.3). Cột "Mục hướng dẫn" điền ở #534.

### Màn hình

| Màn | Mục hướng dẫn | Ảnh |
|---|---|---|
| Sidebar, góc nhìn Toàn bộ / Team / RE | | [01-bat-dau-sidebar](img/01-bat-dau-sidebar.png) |
| Tổng quan | | [02-tong-quan](img/02-tong-quan.png), [02-tong-quan-so-sanh-team](img/02-tong-quan-so-sanh-team.png) |
| Lịch hẹn | | [03-lich-hen](img/03-lich-hen.png), [03-lich-hen-thang](img/03-lich-hen-thang.png), [03-lich-hen-nam](img/03-lich-hen-nam.png), [03-chi-tiet-lich-hen](img/03-chi-tiet-lich-hen.png) |
| Khách hàng | | [04-khach-hang](img/04-khach-hang.png), [04-khach-hang-bang](img/04-khach-hang-bang.png) |
| Hồ sơ KH | | [05-ho-so-kh](img/05-ho-so-kh.png), [05-du-kien-kyc](img/05-du-kien-kyc.png) |
| Hồ sơ KH → KYC Intelligence | | [06-ai-phan-tich](img/06-ai-phan-tich.png) |
| Báo cáo | | [07-bao-cao](img/07-bao-cao.png), [07-bao-cao-theo-moc](img/07-bao-cao-theo-moc.png) |
| Team & nhân sự | | [08-team](img/08-team.png) |
| Cài đặt → Dữ liệu | | [09-cai-dat-du-lieu](img/09-cai-dat-du-lieu.png) |
| Cài đặt → AI | | [09-cai-dat-ai](img/09-cai-dat-ai.png) |
| Cài đặt → Thùng rác | | [09-cai-dat-thung-rac](img/09-cai-dat-thung-rac.png) |

### Hộp thoại

| Hộp | Mockup | Mục hướng dẫn | Ảnh |
|---|---|---|---|
| Lịch hẹn mới | `appointment-forms.html` | | [03-dat-lich](img/03-dat-lich.png) |
| Kết quả cuộc gặp | `appointment-forms.html` | | [03-ket-qua](img/03-ket-qua.png) |
| Lịch hẹn tiếp theo | `appointment-forms.html` | | |
| Sửa kết quả cuộc gặp | `appointment-forms.html` | | |
| Dời lịch | `appointment-forms.html` | | [03-doi-lich](img/03-doi-lich.png) |
| Xóa lịch hẹn | `appointment-forms.html`, `trash.html` 11f | | [09-xoa-lich-hen](img/09-xoa-lich-hen.png) |
| Khách hàng mới | `customer-forms.html` | | [04-khach-hang-moi](img/04-khach-hang-moi.png) |
| Sửa hồ sơ | `customer-forms.html` | | |
| Xóa KH | `customer-forms.html`, `trash.html` 11f | | |
| Chuyển nhóm | `customer.html` | | [04-chuyen-nhom](img/04-chuyen-nhom.png) |
| Ghi chú KYC | `kyc-forms.html` | | [05-ghi-chu-kyc](img/05-ghi-chu-kyc.png) |
| + Dữ kiện (xác nhận) | `kyc-forms.html` | | |
| Giải quyết mâu thuẫn | `kyc-forms.html` | | |
| Hợp đồng mới · đã nộp | `policy-forms.html` | | [05-hop-dong-moi](img/05-hop-dong-moi.png) |
| Phát hành HĐ | `policy-forms.html` | | |
| Sửa HĐ | `policy-forms.html` | | |
| Xóa HĐ | `policy-forms.html` | | |
| AI trích xuất | `ai.html` §3 | | |
| Luồng ChatGPT web | `ai.html` §4 | | |
| Lần phân tích bị loại | `ai.html` §2 | | |
| Xóa API key OpenCode | `ai.html` §1 | | |
| Team mới / Đổi tên team / Xóa team | `team.html` | | |
| Nhân sự mới / Sửa nhân sự / Xóa nhân sự | `team.html` | | [08-nhan-su-moi](img/08-nhan-su-moi.png) |
| Thay toàn bộ dữ liệu? | `settings-data.html` | | |
| Không nhập được file | `settings-data.html` | | |
| Nạp lại dữ liệu giả lập? | `settings-data.html` | | [09-nap-lai](img/09-nap-lai.png) |
| Chưa lưu được thay đổi (bản exe) | `settings-data.html` | | |
| Khôi phục bản ghi | `trash.html` 11b–11d | | |
| Xuất Excel | `reports.html` 2f | | |

---

Ảnh chụp tự động trên bản web, ngày neo 15/09/2026, khung 1440 × 900: `pnpm exec playwright test -c playwright.guide.config.ts` (chụp lại rồi kiểm link / ảnh trong thư mục này).
