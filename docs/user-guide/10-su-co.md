# 10. Khi có lỗi

[← Mục lục](README.md)

Mục này gom các thông báo lỗi và cách xử lý. Phần lớn lỗi về file chỉ có ở bản exe. Khi một lỗi lặp lại, chụp màn hình kèm dòng "Chi tiết kỹ thuật:" (nếu có) gửi người hỗ trợ.

## Lỗi lúc mở app (bản exe)

Lúc mở, app đọc file dữ liệu, kiểm tra file không hỏng, rồi sao lưu vào `Project2C-data\backups\` trước khi ghi gì vào file. Gặp lỗi, app không vào màn chính mà hiện một trang báo lỗi:

| Tiêu đề trên màn | Nghĩa | Làm gì |
|---|---|---|
| **Project-2C đang mở ở một cửa sổ khác** | Thư mục dữ liệu này đang được một cửa sổ app khác dùng | Dùng cửa sổ đó, đóng cửa sổ này. App không đọc, không ghi gì ở cửa sổ này. Cửa sổ đó đang báo lỗi mở dữ liệu thì đóng cả hai cửa sổ rồi mở lại app |
| **File dữ liệu đang bị chương trình khác giữ** | Một chương trình khác (phần mềm sao lưu, đồng bộ, diệt virus hay công cụ mở file SQLite) đang mở file trong `Project2C-data`. File dữ liệu không hỏng | Đóng chương trình đó, rồi đóng cửa sổ báo lỗi và mở lại app. **Không** chép backup đè lên file: file đang dùng được, bản backup thiếu các thay đổi gần nhất |
| **App không có quyền ghi vào thư mục dữ liệu** | Windows không cho app ghi vào `Project2C-data` cạnh file exe: thư mục hay file trong đó (kể cả chính `project2c.db`) chỉ đọc, tài khoản Windows đang dùng không có quyền tạo, ghi hay xóa file trong đó, hoặc app chạy từ ổ chỉ đọc hay thư mục cần quyền quản trị như `Program Files`. File dữ liệu không hỏng | Bỏ chỉ đọc ở thư mục `Project2C-data` và các file trong đó, kiểm quyền ghi và xóa của tài khoản đang dùng; app chạy từ ổ chỉ đọc hay `Program Files` thì chép cả thư mục app (exe cùng `Project2C-data`) sang chỗ khác. Rồi đóng cửa sổ báo lỗi và mở lại app. **Không** chép backup đè lên file |
| **Không sao lưu được file dữ liệu** | App không chép được bản sao lưu trước khi mở. File dữ liệu không bị đổi | Kiểm tra ổ đĩa còn chỗ trống, thư mục `backups\` không chỉ đọc hay bị chương trình khác giữ, rồi đóng cửa sổ báo lỗi và mở lại app |
| **Ổ đĩa đã đầy, không sao lưu được file dữ liệu** | Ổ chứa thư mục app hết chỗ. File dữ liệu không bị đổi | Xóa bớt file trên ổ đó (ví dụ file cũ trong `Project2C-data\exports\`), rồi đóng cửa sổ báo lỗi và mở lại app |
| **File dữ liệu do bản app mới hơn tạo** | File đã được bản app mới hơn mở và nâng cấp | Đóng cửa sổ báo lỗi rồi dùng bản app mới hơn. App này không đổi gì trong file |
| **File dữ liệu bị hỏng** | File mở được nhưng hỏng bên trong (lúc mở app kiểm tra toàn bộ file). App không chép file hỏng vào `backups\` | [Mở lại từ backup](#mở-lại-từ-backup); bản mới nhất vẫn báo lỗi thì chép bản liền trước. App chưa ghi gì vào file |
| **Không mở được file dữ liệu** | File dữ liệu rỗng hoặc hỏng tới mức không mở được, không phải file của app, hoặc bị mất trong khi `backups\` vẫn còn bản sao | [Mở lại từ backup](#mở-lại-từ-backup). App chưa ghi gì vào file |

### Mở lại từ backup

App giữ 10 bản sao lưu mới nhất trong `Project2C-data\backups\`, tên dạng `project2c-s00000012-20260915-093000.db`: số sau `s` càng lớn là bản càng mới, phần sau là ngày giờ sao lưu.

1. Đóng app.
2. Mở thư mục `Project2C-data\backups\`, chọn bản có số lớn nhất.
3. Chép bản đó ra `Project2C-data\`, đổi tên thành `project2c.db` (thay file đang lỗi; nếu muốn giữ file lỗi để gửi người hỗ trợ, đổi tên nó trước).
4. Mở app.

Lúc mở, app chỉ chép file vào `backups\` khi đã đọc được và kiểm tra không hỏng, nên bản mới nhất thường dùng được. Bản đó vẫn báo lỗi thì lặp lại với bản liền trước, rồi các bản cũ hơn. Mỗi bản thiếu các thay đổi làm sau lúc nó được chép.

Cùng cách này dùng để lấy lại dữ liệu trước một lần **Nhập backup** hay **Nạp lại** dữ liệu giả lập.

## Chưa lưu được vào file (bản exe)

Dải cảnh báo "Chưa lưu được dữ liệu vào file…" ở đầu màn và hộp **Chưa lưu được thay đổi** khi đóng app: xem [1. Bắt đầu → Khi app chưa lưu được](01-bat-dau.md#khi-app-chưa-lưu-được-bản-exe). Câu trên dải và trong hộp cho biết nguyên nhân:

| Câu ghi | Nghĩa | Làm gì |
|---|---|---|
| "…chương trình khác…" | Một chương trình khác (diệt virus, đồng bộ đám mây, công cụ mở file SQLite) đang giữ `project2c.db` | Đóng chương trình đó |
| "…ổ đĩa chứa thư mục app đã đầy…" | Ổ chứa thư mục app hết chỗ | Xóa bớt file trên ổ đó (ví dụ file cũ trong `Project2C-data\exports\`) |
| "…file Project2C-data\project2c.db đang ở chế độ chỉ đọc, hoặc tài khoản Windows đang dùng không có quyền ghi / xóa file đó…" | File chuyển sang chỉ đọc lúc app chạy, hoặc quyền của tài khoản bị rút | Chuột phải file → Properties → bỏ chọn Read-only, hoặc nhờ người quản trị máy cấp lại quyền |
| "…thư mục Project2C-data không cho tài khoản Windows đang dùng tạo file mới trong đó…" | Quyền của tài khoản trên thư mục bị rút lúc app chạy. Mỗi lần lưu, app ghi một file mới rồi mới thay file cũ, nên không lưu được dù `project2c.db` không chỉ đọc | Nhờ người quản trị máy cấp lại quyền ghi vào thư mục `Project2C-data` |

Cả bốn trường hợp: dữ liệu vẫn còn trong app, dải cảnh báo tự mất khi lưu được. Nếu file đã chỉ đọc, hay file hoặc thư mục đã bị rút quyền từ trước khi mở app, app không vào màn chính mà hiện trang "App không có quyền ghi vào thư mục dữ liệu" (xem [Lỗi lúc mở app](#lỗi-lúc-mở-app-bản-exe)).

## Một màn không hiện được

Màn ghi **Màn này gặp lỗi và không hiển thị được**: dữ liệu đã lưu không bị ảnh hưởng. Chọn màn khác ở sidebar để làm tiếp. Lỗi lặp lại thì gửi dòng chi tiết kỹ thuật trên màn cho người hỗ trợ.

## Đang thay toàn bộ dữ liệu

Trong lúc **Nhập backup** hoặc **Nạp lại** dữ liệu giả lập, app không nhận thay đổi khác. Lưu trong lúc đó báo "Đang thay toàn bộ dữ liệu (Nạp lại / Nhập backup). Thay đổi này chưa được ghi — thử lại khi xong." Chờ việc thay xong rồi lưu lại. Khôi phục trong Thùng rác cũng vậy.

## Lỗi khi lưu trong hộp

Hộp không lưu được thì báo ngay trong hộp, dữ liệu không đổi. Thường gặp:

| Thông báo | Làm gì |
|---|---|
| "Chưa lưu được — … ô cần sửa" | Sửa các ô có chữ đỏ |
| "… không còn trong dữ liệu (có thể đã bị xóa)." | Bản ghi vừa bị xóa (ví dụ ở Thùng rác hay khi nhập backup). Đóng hộp, xem lại danh sách |
| "Ngày này sau hôm nay: chỉ ghi việc đã xảy ra, từ hôm nay trở về trước." | Kết quả, HĐ, chuyển nhóm chỉ ghi cho ngày đã qua hoặc hôm nay |
| "Chưa lưu được thay đổi. Dữ liệu không bị đổi." | Thử lại; lặp lại thì đóng và mở lại app |

Lỗi riêng của từng việc giải thích ở mục đó: lịch hẹn ([3](03-lich-hen.md)), KH ([4](04-khach-hang.md)), KYC và HĐ ([5](05-ho-so-kh.md)), team và nhân sự ([8](08-team.md)), nhập backup và Thùng rác ([9](09-cai-dat.md)).

## Lỗi xuất file

- **Xuất backup**: "Chưa xuất được backup. Kiểm tra ổ đĩa và quyền ghi thư mục Project2C-data\exports\ rồi thử lại."
- **Xuất Excel**: **Không xuất được báo cáo**, xem [7. Báo cáo → Xuất Excel](07-bao-cao.md#xuất-excel).

Dữ liệu trong app không bị ảnh hưởng.

## Lỗi AI thường gặp

Lỗi khi gọi AI hiện trong thẻ KYC Intelligence (hoặc dưới ghi chú khi AI trích xuất, hoặc ở Kiểm tra kết nối), kèm **Thử lại**. Lỗi không lưu gì và không tính là một lần thử.

| Thông báo | Làm gì |
|---|---|
| "Chưa có API key OpenCode — nhập ở Cài đặt → AI." | Nhập key ở [Cài đặt → AI](09-cai-dat.md#api-key-opencode-bản-exe) |
| "Key không hợp lệ hoặc hết hạn. Gói Go đã hết hạn → chọn gói Credit ở Cài đặt → AI." | Kiểm tra key; gói Go hết hạn thì chọn **Credit** ở **Gói OpenCode**, hoặc gia hạn gói |
| "Đã chạm giới hạn gói Go hoặc hết credit OpenCode — thử lại sau, hoặc đổi gói / nạp credit." | Chờ rồi thử lại, đổi gói, hoặc nạp credit trên dashboard OpenCode |
| "AI không trả lời trong 2 phút." | Thử lại; lặp lại thì chọn model khác hoặc mức suy luận thấp hơn |
| "Không kết nối được OpenCode." | Kiểm tra mạng, rồi thử lại |
| "OpenCode báo lỗi (HTTP …)…" | Lỗi từ phía OpenCode: thử lại sau; lặp lại thì đổi model |
| "Trả lời của OpenCode không đọc được." | Thử lại |
| "Đang có một yêu cầu AI khác — chờ xong rồi thử lại." | Mỗi lúc chỉ một yêu cầu AI; chờ yêu cầu đang chạy (có thể ở KH khác) |
| "Không đọc / ghi được key trong Windows Credential Manager." | Mở lại app; vẫn lỗi thì kiểm tra Credential Manager của Windows |
| "Dữ liệu gửi AI quá lớn (quá 200.000 ký tự) — rút gọn ghi chú hoặc dữ kiện rồi thử lại." | Thường gặp ở AI trích xuất với ghi chú rất dài |
| "Có lỗi trong app khi gọi AI — thử lại; nếu lặp lại, báo cho người hỗ trợ." | Thử lại; lặp lại thì báo người hỗ trợ |

Lần phân tích **bị loại** (AI trả lời nhưng không đạt kiểm tra) không phải lỗi kết nối: xem [6. KYC Intelligence → Lần phân tích bị loại](06-ai.md#lần-phân-tích-bị-loại).

Bản web không có OpenCode: dùng Mock hoặc ChatGPT web.

## Bản web mất dữ liệu

Bản web giữ dữ liệu trong trình duyệt và **mất khi tải lại trang** (F5, đóng tab): mỗi lần mở là dữ liệu giả lập mới. Đây không phải lỗi. Muốn giữ dữ liệu đã nhập ở bản web, **Xuất backup** trước khi tải lại rồi **Nhập backup** sau.

[← 9. Cài đặt](09-cai-dat.md) · [11. Thuật ngữ →](11-thuat-ngu.md)
