# Hướng dẫn sử dụng Project-2C

Project-2C là app quản lý khách hàng (KH), lịch hẹn, hợp đồng (HĐ) và chỉ số cho đội tư vấn bảo hiểm: RE ghi lịch hẹn và kết quả cuộc gặp, ghi KYC của KH, ghi HĐ nộp / phát hành; TL và Owner xem chỉ số theo team, theo RE, theo kỳ. App có phần AI (KYC Intelligence) gợi ý hướng khám phá nhu cầu KH từ dữ kiện KYC đã xác nhận.

Hướng dẫn viết theo việc cần làm. Chữ trong ngoặc kép hoặc **in đậm** là nhãn đúng như trên màn. Thuật ngữ ngành (RE, TL, KYC, FYP, RF…) giữ tiếng Anh, giải thích ở [11. Thuật ngữ](11-thuat-ngu.md).

## Mục lục

| Mục | Nội dung |
|---|---|
| [1. Bắt đầu](01-bat-dau.md) | Chạy exe, thư mục `Project2C-data\`, dữ liệu giả lập lúc mở lần đầu, báo lỗi lưu, góc nhìn Toàn bộ / Team / RE |
| [2. Tổng quan](02-tong-quan.md) | Chọn kỳ, Lọc, ô Lịch hẹn, 6 chỉ số + so kỳ trước, KH theo nhóm, So sánh team |
| [3. Lịch hẹn](03-lich-hen.md) | Lịch tháng / năm, đặt lịch, ghi kết quả, hẹn tiếp, dời lịch, sửa / xóa |
| [4. Khách hàng](04-khach-hang.md) | Kanban / Bảng, tạo / sửa / xóa KH, chuyển nhóm tay |
| [5. Hồ sơ KH](05-ho-so-kh.md) | Dữ kiện KYC, ghi chú KYC, mâu thuẫn, dòng thời gian, hợp đồng, lịch hẹn của KH |
| [6. KYC Intelligence](06-ai.md) | Phân tích AI, CURRENT / STALE, mã F và mức bằng chứng, lịch sử, ChatGPT web, AI trích xuất, giới hạn của AI |
| [7. Báo cáo](07-bao-cao.md) | Tổng hợp / Theo team / Theo RE / Theo mốc, xuất Excel |
| [8. Team & nhân sự](08-team.md) | Vai trò RE / TL / IS / BD / BDM, tạo / đổi tên / xóa team, thêm / sửa / xóa người |
| [9. Cài đặt](09-cai-dat.md) | Dữ liệu (file, xuất / nhập backup, nạp lại), AI (provider, gói, model, key), Thùng rác |
| [10. Khi có lỗi](10-su-co.md) | Lỗi lúc mở app, mở lại từ backup, lỗi lưu, lỗi xuất file, lỗi AI thường gặp |
| [11. Thuật ngữ](11-thuat-ngu.md) | RE, TL, IS, BD, BDM, KH N4–N1, RF, FYP, KYC, CURRENT / STALE… |

## Bản exe và bản web

- **Bản exe** (dùng hằng ngày): một file exe chạy thẳng, không cần cài. Dữ liệu lưu vào file trong thư mục `Project2C-data\` cạnh file exe, tự backup mỗi lần mở app. Chỉ bản exe gọi được AI qua OpenCode và giữ API key. Các phần chỉ có ở bản exe ghi "(bản exe)".
- **Bản web**: cùng giao diện, chạy trong trình duyệt để thử app. Dữ liệu chỉ nằm trong trình duyệt và **mất khi tải lại trang**; mỗi lần mở là dữ liệu giả lập mới. Không có OpenCode, không lưu key. Ảnh trong hướng dẫn chụp từ bản web, ngày 15/09/2026.

## Làm trên hai máy

App chưa đồng bộ giữa hai máy. Dữ liệu chuyển bằng file backup `.p2cbackup`:

1. Trước khi rời máy A: **Cài đặt → Dữ liệu → Xuất backup**. File nằm trong `Project2C-data\exports\` (bản exe). Chép file sang máy B (USB, OneDrive…).
2. Ở máy B: **Cài đặt → Dữ liệu → Nhập backup → Chọn file…**, xem hộp "Thay toàn bộ dữ liệu?" rồi bấm **Backup rồi thay dữ liệu**.
3. Làm ở máy B. Khi quay lại máy A, làm ngược lại.

**Bản nhập sau thắng.** Nhập backup *thay toàn bộ* dữ liệu, không gộp. Nếu đã sửa ở cả hai máy mà chưa xuất / nhập, phần sửa ở máy bị nhập đè sẽ mất khỏi app (bản trước khi nhập vẫn còn trong `Project2C-data\backups\`). Vì vậy mỗi lúc chỉ làm trên một máy, và luôn xuất trước khi đổi máy. Chi tiết ở [9. Cài đặt → Nhập backup](09-cai-dat.md#nhập-backup).

API key OpenCode không đi theo backup: mỗi máy nhập key riêng.

## Bảng đối chiếu màn / hộp ↔ mục hướng dẫn

Mỗi màn ở sidebar, mỗi mục Cài đặt và mỗi hộp thoại có trong mockup đã duyệt có ít nhất một đoạn hướng dẫn (spec Phase 6 §4.3).

### Màn hình

| Màn | Mục hướng dẫn | Ảnh |
|---|---|---|
| Sidebar, góc nhìn Toàn bộ / Team / RE | [1. Bắt đầu → Sidebar và góc nhìn](01-bat-dau.md#sidebar-và-góc-nhìn) | [01-bat-dau-sidebar](img/01-bat-dau-sidebar.png) |
| Tổng quan | [2. Tổng quan](02-tong-quan.md) | [02-tong-quan](img/02-tong-quan.png), [02-tong-quan-so-sanh-team](img/02-tong-quan-so-sanh-team.png) |
| Lịch hẹn | [3. Lịch hẹn](03-lich-hen.md) | [03-lich-hen](img/03-lich-hen.png), [03-lich-hen-thang](img/03-lich-hen-thang.png), [03-lich-hen-nam](img/03-lich-hen-nam.png), [03-chi-tiet-lich-hen](img/03-chi-tiet-lich-hen.png) |
| Khách hàng | [4. Khách hàng](04-khach-hang.md) | [04-khach-hang](img/04-khach-hang.png), [04-khach-hang-bang](img/04-khach-hang-bang.png) |
| Hồ sơ KH | [5. Hồ sơ KH](05-ho-so-kh.md) | [05-ho-so-kh](img/05-ho-so-kh.png), [05-du-kien-kyc](img/05-du-kien-kyc.png) |
| Hồ sơ KH → KYC Intelligence | [6. KYC Intelligence](06-ai.md) | [06-ai-phan-tich](img/06-ai-phan-tich.png) |
| Báo cáo | [7. Báo cáo](07-bao-cao.md) | [07-bao-cao](img/07-bao-cao.png), [07-bao-cao-theo-moc](img/07-bao-cao-theo-moc.png) |
| Team & nhân sự | [8. Team & nhân sự](08-team.md) | [08-team](img/08-team.png) |
| Cài đặt → Dữ liệu | [9. Cài đặt → Dữ liệu](09-cai-dat.md#cài-đặt--dữ-liệu) | [09-cai-dat-du-lieu](img/09-cai-dat-du-lieu.png) |
| Cài đặt → AI | [9. Cài đặt → AI](09-cai-dat.md#cài-đặt--ai) | [09-cai-dat-ai](img/09-cai-dat-ai.png) |
| Cài đặt → Thùng rác | [9. Cài đặt → Thùng rác](09-cai-dat.md#cài-đặt--thùng-rác) | [09-cai-dat-thung-rac](img/09-cai-dat-thung-rac.png) |

### Hộp thoại

| Hộp | Mockup | Mục hướng dẫn | Ảnh |
|---|---|---|---|
| Lịch hẹn mới | `appointment-forms.html` | [3. Đặt lịch hẹn](03-lich-hen.md#đặt-lịch-hẹn) | [03-dat-lich](img/03-dat-lich.png) |
| Kết quả cuộc gặp | `appointment-forms.html` | [3. Ghi kết quả cuộc gặp](03-lich-hen.md#ghi-kết-quả-cuộc-gặp) | [03-ket-qua](img/03-ket-qua.png) |
| Lịch hẹn tiếp theo | `appointment-forms.html` | [3. Hẹn tiếp](03-lich-hen.md#hẹn-tiếp) | |
| Sửa kết quả cuộc gặp | `appointment-forms.html` | [3. Sửa kết quả](03-lich-hen.md#sửa-kết-quả) | |
| Dời lịch | `appointment-forms.html` | [3. Dời lịch](03-lich-hen.md#dời-lịch) | [03-doi-lich](img/03-doi-lich.png) |
| Xóa lịch hẹn | `appointment-forms.html`, `trash.html` 11f | [3. Xóa lịch hẹn](03-lich-hen.md#xóa-lịch-hẹn) | [09-xoa-lich-hen](img/09-xoa-lich-hen.png) |
| Khách hàng mới | `customer-forms.html` | [4. Tạo KH](04-khach-hang.md#tạo-kh) | [04-khach-hang-moi](img/04-khach-hang-moi.png) |
| Sửa hồ sơ | `customer-forms.html` | [4. Sửa hồ sơ KH](04-khach-hang.md#sửa-hồ-sơ-kh) | |
| Xóa KH | `customer-forms.html`, `trash.html` 11f | [4. Xóa KH](04-khach-hang.md#xóa-kh) | |
| Chuyển nhóm | `customer.html` | [4. Chuyển nhóm tay](04-khach-hang.md#chuyển-nhóm-tay) | [04-chuyen-nhom](img/04-chuyen-nhom.png) |
| Ghi chú KYC | `kyc-forms.html` | [5. Ghi chú KYC](05-ho-so-kh.md#ghi-chú-kyc) | [05-ghi-chu-kyc](img/05-ghi-chu-kyc.png) |
| + Dữ kiện (xác nhận) | `kyc-forms.html`, `ai.html` §3 | [6. AI trích xuất](06-ai.md#ai-trích-xuất) | |
| Giải quyết mâu thuẫn | `kyc-forms.html` | [5. Mâu thuẫn](05-ho-so-kh.md#mâu-thuẫn) | |
| Hợp đồng mới · đã nộp | `policy-forms.html` | [5. Ghi HĐ nộp](05-ho-so-kh.md#ghi-hđ-nộp) | [05-hop-dong-moi](img/05-hop-dong-moi.png) |
| Phát hành HĐ | `policy-forms.html` | [5. Phát hành HĐ](05-ho-so-kh.md#phát-hành-hđ) | |
| Sửa HĐ | `policy-forms.html` | [5. Sửa, xóa HĐ](05-ho-so-kh.md#sửa-xóa-hđ) | |
| Xóa HĐ | `policy-forms.html` | [5. Sửa, xóa HĐ](05-ho-so-kh.md#sửa-xóa-hđ) | |
| AI trích xuất | `ai.html` §3 | [6. AI trích xuất](06-ai.md#ai-trích-xuất) | |
| Luồng ChatGPT web | `ai.html` §4 | [6. Phân tích bằng ChatGPT web](06-ai.md#phân-tích-bằng-chatgpt-web) | |
| Lần phân tích bị loại | `ai.html` §2 | [6. Lần phân tích bị loại](06-ai.md#lần-phân-tích-bị-loại) | |
| Xóa API key OpenCode | `ai.html` §1 | [9. API key OpenCode](09-cai-dat.md#api-key-opencode-bản-exe) | |
| Team mới / Đổi tên team / Xóa team | `team.html` | [8. Tạo, đổi tên, xóa team](08-team.md#tạo-đổi-tên-xóa-team) | |
| Nhân sự mới / Sửa nhân sự / Xóa nhân sự | `team.html` | [8. Thêm người](08-team.md#thêm-người), [Sửa người](08-team.md#sửa-người), [Xóa người](08-team.md#xóa-người) | [08-nhan-su-moi](img/08-nhan-su-moi.png) |
| Thay toàn bộ dữ liệu? | `settings-data.html` | [9. Nhập backup](09-cai-dat.md#nhập-backup) | |
| Không nhập được file | `settings-data.html` | [9. Nhập backup](09-cai-dat.md#nhập-backup) | |
| Nạp lại dữ liệu giả lập? | `settings-data.html` | [9. Nạp lại dữ liệu giả lập](09-cai-dat.md#nạp-lại-dữ-liệu-giả-lập) | [09-nap-lai](img/09-nap-lai.png) |
| Chưa lưu được thay đổi (bản exe) | `settings-data.html` | [1. Khi app chưa lưu được](01-bat-dau.md#khi-app-chưa-lưu-được-bản-exe) | |
| Trạng thái lưu, không mở được file lúc khởi động (bản exe) | `settings-data.html` | [1. App tự lưu](01-bat-dau.md#app-tự-lưu), [10. Lỗi lúc mở app](10-su-co.md#lỗi-lúc-mở-app-bản-exe) | |
| Khôi phục bản ghi | `trash.html` 11b–11d | [9. Khôi phục](09-cai-dat.md#khôi-phục), [Khi không khôi phục được](09-cai-dat.md#khi-không-khôi-phục-được) | |
| Dọn sạch Thùng rác? | `trash.html` 11i | [9. Dọn sạch Thùng rác](09-cai-dat.md#dọn-sạch-thùng-rác) | |
| Xuất Excel | `reports.html` 2f | [7. Xuất Excel](07-bao-cao.md#xuất-excel) | |

---

Ảnh chụp tự động trên bản web, ngày neo 15/09/2026, khung 1440 × 900: `pnpm exec playwright test -c playwright.guide.config.ts` (chụp lại rồi kiểm link / ảnh trong thư mục này).
