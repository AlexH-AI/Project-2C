XONG — codex gói E lượt 6, 2026-11-07 19:01:19 +07:00

## 1. Thông tin phiên

- Bên: Codex; gói E — Lịch hẹn, chỉ số, quản lý; lượt 6.
- Repo: `C:\workspace\Project-2C-review-2`; SHA đầu phiên và cuối phiên: `5b1328ae236aa62981dbf43066ff544a9e832c8c` (detached).
- `git status --short` đầu phiên: rỗng. Cuối phiên: rỗng, giữ nguyên trạng thái đầu phiên.
- Bắt đầu: **2026-11-07 14:10:10 +07:00**; giờ xong: **2026-11-07 19:01:19 +07:00** (Asia/Bangkok).
- Công cụ: Codex desktop, PowerShell; `codex-cli 0.162.1`; Node **v24.20.0**; Vitest **5.0.1**; Playwright **1.63.0**, Edge headless. CLI có cảnh báo không tạo được PATH aliases do quyền nhưng thoát 0.
- Model theo thông tin hệ thống: **GPT-6 (Codex)**. Công cụ không công bố mã model chi tiết hay mức suy luận; không tự ghi là GPT Sol 6.1 theo tên dự kiến trong kế hoạch.
- Phiên trước bị gián đoạn ở bước ghi bản báo cáo cuối: bộ xét duyệt tự động hết hạn mức, lệnh chưa được thực thi; không phải kết luận thao tác không an toàn. Mốc ghi báo cáo cuối trước gián đoạn là **2026-11-07 14:33:56 +07:00** (`LastWriteTimeUtc` 07:33:56); công cụ không trả giờ dừng chính xác. Owner nhắn làm tiếp; tiếp tục lúc **2026-11-07 18:53:14 +07:00**, cùng công cụ/model hệ thống; mức suy luận vẫn không được công bố. Đã đọc lại phần đang dở, giữ cả hai phát hiện, kiểm lại SHA/status, không chạy lại test đã qua khi chưa có thay đổi hay nghi vấn mới.
- Chỉ đọc repo; probe/build/log chỉ ở `C:\workspace\deep-review-1-6-r6\codex\E\`. Không sửa code, không commit, không tạo Issue/PR, không gọi `pnpm`, `gh` hay dịch vụ AI. Codex không làm bảng R. Không đọc báo cáo lượt 6 bên khác.

**Kết quả gói E:** 2 phát hiện CONFIRMED: 1 Low/E và 1 Nit/A; đề xuất **0 chặn, 2 không chặn** theo K48, đưa cả hai vào sau v1.0. Chưa kết luận toàn dự án sẵn sàng phát hành; việc đó thuộc gói F.

## 3. Phạm vi đã đọc

Đã đọc kỹ **52/52 file** trong `C:\workspace\deep-review-1-6-r6\common\files-E.txt`: **38 file sản phẩm / 8.466 dòng**, **14 file test / 5.024 dòng** (dòng vật lý). **Không có file trong danh sách bỏ qua hoặc chỉ đọc lướt.** Bảng từng file, loại và số dòng: [scope.md](C:/workspace/deep-review-1-6-r6/codex/E/scope.md).

Đã đọc diff `37a80b6..5b1328a` của gói trước phần còn lại: **14 file, +608/−90**; lưu [diff-E.patch](C:/workspace/deep-review-1-6-r6/codex/E/diff-E.patch). Đọc kỹ các nhánh mới về phân biệt tên khôi phục/mốc xóa, câu chỉ team chặn, truy vấn tìm và các hộp hợp đồng. Đã đọc toàn bộ các nhóm lịch hẹn/kết quả/dời lịch, HĐ, Tổng quan/chặng/team, báo cáo/Excel, bộ lọc/kỳ và Cài đặt/backup/Thùng rác, cùng 14 file test tương ứng.

Nguồn đối chiếu đã đọc:

- `C:\workspace\Project-2C-review-2\CLAUDE.md`, `apps\desktop\CLAUDE.md`, `CONTEXT.md`; dùng làm ngữ cảnh, không chạy nghi thức phát triển của Claude.
- `C:\workspace\deep-review-1-6-r6\common\plan.md` (thước mức, trục và các quy tắc lượt 6), `known.md` (K1–K50, KNOWN/OPEN/ACCEPTED), `fixes.md` (nhất là T-377/T-380/T-382 và các mục liên quan), `baseline.md`.
- Spec Phase 3 phần lịch/HĐ và mô hình dữ liệu liên quan; Phase 4 toàn bộ; Phase 6 §4.1/4.2/5; ADR-0013 tại `C:\workspace\Project-2C-review-2\docs\decisions\0013-huong-ui-dark-mode.md`.
- Mockup index, Thùng rác, dữ liệu, lịch/hộp lịch, HĐ, Tổng quan, báo cáo và `forms.css` phần `.choice`, trong `C:\workspace\Project-2C-review-2\docs\design\mockups\`.
- `C:\workspace\Project-2C-review-2\docs\testing\nghiem-thu-v1.md`: Các lượt thử, Lệch mockup đã biết và NT-LH-04; các phần gói E liên quan trong tổng hợp lượt 1–5 và báo cáo gốc đã lưu trong repo, gồm báo cáo E cũ của Codex. Không dùng lại KNOWN làm phát hiện mới.

Đọc thêm các điểm nối cần cho chuỗi thử và quét cùng mẫu: `openAppData`/lệnh `app.run`, import/export/purge; formatter và chuẩn hóa ở domain; `Dialog`, class dùng chung, chuỗi i18n; màn KH và hồ sơ KH, bàn giao, nhãn trạng thái của các màn khác; ca e2e tên dài. Bằng chứng về màn đều qua lớp dữ liệu app và bản web thật, không chèn SQL thô để kết luận UI.

## 4. Kịch bản đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| E01 | Chạy trực tiếp 14 file unit trong danh sách gói E bằng Node/Vitest | **14 file, 364 test qua**, 6,06 s. Lần sandbox ban đầu lỗi cache SSR chưa chạy 13 suite; cùng lệnh chạy ngoài sandbox qua. | — |
| E02 | Tạo HĐ nộp 20/10/2026 FYP 123 triệu → phát hành 02/11 FYP 125 triệu → xóa → khôi phục qua `restoreRow`/app | JSON bảng policies trước/sau bằng nhau: giữ cả hai ngày và hai FYP. | — |
| E03 | Nhập dữ liệu tải; 7 kỳ × 8 góc nhìn; kiểm tổng RE/team, cộng theo mốc và snapshot chặng; dọn Thùng rác rồi xuất/nhập lại | **56 tổ hợp** giữ nguyên toàn bộ report rows, TeamCompare và KPI ở cả ba trạng thái; Thùng rác **113 → 0**. | — |
| E04 | Hộp HĐ 8a/8b/8d: các ô ngày/tiền nhận chuỗi trống Unicode U+200B/U+0085/U+2060; kiểm trước/sau bấm Lưu | Trước gửi chưa báo sai; sau gửi lần lượt 2/2/4 ô `aria-invalid`; hủy hộp, không lưu dữ liệu sai. | — |
| E05 | Dời lịch 06/11/2026 → 02/01/2027; xem bảng, chi tiết và hồ sơ KH | Kết quả `Dời sang 02/01` đúng khuôn NT-LH-04; link chuỗi và ngày lịch tương lai có năm 2027. Không ghi lại thành lỗi. | — |
| E06 | Tên team/RE/KH 160 chữ liền hợp lệ; xóa rồi nhập backup; lần lượt khôi phục team → RE → KH → lịch → HĐ ở 1100/1440 px | Thông báo thành công của cả năm loại tràn ngang, kéo document rộng hơn viewport. | CXR6-E1 |
| E07 | Mở hộp khôi phục của cả năm loại trên fixture tên dài, hai cỡ cửa sổ | Dữ kiện hộp nhân sự/KH tràn; hộp team/lịch/HĐ không tràn; tiêu đề/phụ đề Dialog đã ngắt đúng. | CXR6-E1 |
| E08 | Ở góc nhìn RE ngắn, tạo KH tên dài cho RE tên dài ngoài góc nhìn; tạo lịch cho KH của RE đó | Dòng thông báo sau tạo ở hai màn tràn trang tại 1100 px; với 160 chữ, 1440 px không tràn. | CXR6-E1 |
| E09 | Lịch RE ngắn → dời sang 08/11 → bàn giao KH sang RE tên dài → bấm link lịch con ngoài góc nhìn | Lịch con đúng RE và ngày; dòng giải thích ngoài góc nhìn tràn tại 1100 px. | CXR6-E1 |
| E10 | Hai IS cùng tên xóa ở .010/.990 trong cùng giây; hai team cùng tên xóa cùng giây, một RE chờ team đầu; nhập fixture và đọc UI | Hai cặp tên nút trùng; câu TR-1 và Thuộc cũng không phân biệt được hai team. Dữ liệu/id vẫn tách biệt. | CXR6-E2 |

E03 dùng `C:\workspace\deep-review-1-6-r6\common\load\load-2026-10-12-seed6.p2cbackup` qua `app.readBackup`/`app.importBackup`. Bảy kỳ: ngày/tuần/tháng/năm tại 12/10/2026, tùy chọn 15/12/2025–15/02/2026, năm 1900, năm 2100; tám góc nhìn: toàn bộ, bốn team, ba RE đầu. Kiểm cộng 5 loại đếm lịch và RF/HĐ nộp/case size/HĐ phát hành/doanh thu; chặng cuối bằng summary. Dọn 15 KH (kèm 83 lịch/5 HĐ/49 ghi chú/1 phân tích AI), cùng 76 lịch/18 HĐ/3 nhân sự/1 team đã xóa riêng. Đây là kiểm tính đúng, **không phải phép đo hiệu năng**.

Các probe trình duyệt phục vụ bản build riêng tại **127.0.0.1:4196**, Edge headless, `vi-VN`, `Asia/Bangkok`, đồng hồ 07/11/2026 10:00, viewport cao 1000 px. Chặn mọi request có hostname khác `127.0.0.1` và thay `window.open` ngay từ init script đầu; kết quả cuối đều `blocked=[]`, `errors=[]`; đóng server/browser sau mỗi probe.

## 5. Phát hiện mới

### CXR6-E1 — Tên liền dài còn tràn ở hộp khôi phục và thông báo sau thao tác

**ID:** CXR6-E1  
**Mức:** Low  
**Trục:** E  
**Tình trạng:** CONFIRMED

**Vị trí (5b1328a):**

- `C:\workspace\Project-2C-review-2\apps\desktop\src\routes\SettingsTrash.tsx:210` (chữ ở dòng 211–212).
- `C:\workspace\Project-2C-review-2\apps\desktop\src\routes\RestoreDialog.tsx:58`.
- `C:\workspace\Project-2C-review-2\apps\desktop\src\routes\appointments\AppointmentsScreen.tsx:280`.
- `C:\workspace\Project-2C-review-2\apps\desktop\src\routes\customers\CustomersScreen.tsx:190` (điểm nối gói D trong cùng họ).

**Liên quan:** DR6-170, DR6-148 · có từ trước, lượt 1–5 bỏ sót các trạng thái/vị trí này. Phần sửa tên dài sau lượt 5 chưa bao phủ chúng; không gọi là hồi quy mới do PR #1070.

**Mô tả:** Chữ người dùng được ghép vào thông báo và dữ kiện nhưng thiếu quy tắc ngắt chuỗi liền dài. `Done` có `min-w-0` ở khối chữ nhưng chưa cho ngắt từ; dữ kiện `dd` của hộp khôi phục thiếu khả năng co/ngắt; hai thông báo ngoài góc nhìn dùng `ALERT` cũng không ngắt token. Tên hợp lệ có thể chồng vào nút Mở hoặc vượt khỏi cửa sổ.

**Tái hiện / bằng chứng:**

1. `long-fixture.mjs` tạo team/RE/KH có tên 160 chữ liền qua `openAppData` + `app.run`, tạo lịch/HĐ rồi xóa lịch → HĐ → KH → RE → team, xuất `long-fixture.p2cbackup` bằng app.
2. `notice-probe.mjs` nhập fixture qua UI, khôi phục từng loại theo thứ tự phụ thuộc, đo trước/sau và chụp ảnh ở 1100 và 1440 px. `notice-results.json` ghi `clientWidth/scrollWidth`:

| Viewport | Trạng thái | Document | Main | Thông báo |
|---:|---|---:|---:|---:|
| 1100 | Trước khôi phục | 1100/1100 | 868/868 | — |
| 1100 | Sau team | 1100/1649 | 868/1417 | 624/1215 |
| 1100 | Sau nhân sự | 1100/1651 | 868/1419 | 624/1217 |
| 1100 | Sau KH | 1100/1652 | 868/1420 | 624/1218 |
| 1100 | Sau lịch hoặc HĐ | 1100/1588 | 868/1356 | 624/1154 |
| 1440 | Trước khôi phục | 1440/1440 | 1208/1208 | — |
| 1440 | Sau team | 1440/1649 | 1208/1417 | 700/1215 |
| 1440 | Sau nhân sự | 1440/1651 | 1208/1419 | 700/1217 |
| 1440 | Sau KH | 1440/1652 | 1208/1420 | 700/1218 |
| 1440 | Sau lịch hoặc HĐ | 1440/1588 | 1208/1356 | 700/1154 |

3. Cùng probe mở từng hộp trước khôi phục. Ở cả hai viewport: hộp nhân sự **446/1274**, hộp KH **446/1275**; các hộp team/lịch/HĐ **446/446**. Dữ kiện team/RE là chỗ tràn; tiêu đề/phụ đề dùng `Dialog` đã có `wrap-anywhere`, không phải nguồn lỗi. Xem `dialog-*.json` và `restore-dialog-*.png`.
4. `outside-fixture.mjs` + `outside-probe.mjs` tạo KH/lịch ngoài góc nhìn, rồi đi theo lịch đã dời và bàn giao. Tại 1100 px: trước thao tác document **1100/1100**, main **868/868**; sau tạo KH hoặc lịch **1100/1392**, **868/1160**; sau đi link lịch con **1100/1388**, **868/1156**. Tại 1440 px, các ca này với 160 chữ giữ document **1440/1440**, main **1208/1208**. Không quy kết tràn ở viewport không tái hiện.

Lệnh chạy: `node C:\workspace\deep-review-1-6-r6\codex\E\long-fixture.mjs`, `node ...\notice-probe.mjs`, `node ...\outside-fixture.mjs`, `node ...\outside-probe.mjs`; mỗi lần đặt Node 24 đầu PATH như phụ lục. Log cuối thoát 0; không lỗi trang hay request ngoài. Đã xem ảnh thực tế [notice-customer-1100.png](C:/workspace/deep-review-1-6-r6/codex/E/notice-customer-1100.png), trong đó tên vượt khối chữ/nút và ra ngoài viewport.

**Cùng mẫu:** Đã quét routes/shell rồi mở rộng toàn repo bằng:

```powershell
rg -n 'restoredNotice|NoticeLine|<Done|role="status"|role="alert"' --glob '*.tsx' --glob '!*.test.*'
```

Đọc nội dung động và class ở các điểm khớp; đối chiếu thêm `ALERT`, dữ kiện `RestoreDialog` và `Dialog` chung. Danh sách cùng họ **đã tái hiện** là toàn bộ bốn vị trí trên: `Done` dùng cho cả năm loại, dữ kiện hộp nhân sự/KH, thông báo KH ngoài góc nhìn, thông báo lịch sau tạo và sau đi link. Không tách mỗi loại thành một phát hiện. Thông báo xuất backup (`SettingsBackup.tsx:148`) và Excel (`reports\ReportExport.tsx:79`) có `break-all`; `Dialog` chung chỉ bọc phần đầu bằng `wrap-anywhere`. Các dải tĩnh không có token tên dài; không nâng những dải lỗi khác chỉ đọc, chưa probe, thành CONFIRMED.

**Ảnh hưởng:** Người dùng có tên team/nhân sự/KH không có khoảng trắng khoảng 160 chữ gặp sai hiển thị, cuộn ngang và chữ chồng nút. Khôi phục, phân công, ngày lịch và dữ liệu lưu vẫn đúng.

**Chặn phát hành:** **không** — Low trục E, theo K48; đề xuất **sau v1.0**.

**Đề xuất:** Dùng chung một quy tắc ngắt chuỗi và co khối chữ cho thông báo/dữ kiện chứa tên; áp dụng hết danh sách, giữ nút riêng. Mở rộng ca e2e tên dài hiện có qua bước mở hộp/khôi phục/tạo ngoài góc nhìn/đi link thay vì chỉ kiểm trạng thái đầu màn. Ước lượng **6–12 dòng sản phẩm / 45–75 dòng e2e**. Đây là đề xuất, không thực hiện refactor trước phát hành theo K49.

### CXR6-E2 — Cùng giây vẫn làm trùng tên nút khôi phục và câu chỉ team chặn

**ID:** CXR6-E2  
**Mức:** Nit  
**Trục:** A  
**Tình trạng:** CONFIRMED

**Vị trí (5b1328a):** `C:\workspace\Project-2C-review-2\apps\desktop\src\routes\trash-view.ts:239` (`byDeletion`; nhóm cùng phút tại dòng 244–245), hai nhánh gọi dòng 277/280; `deletionWords` dòng 310–313 và `deletedAtText` dòng 362–363. Chuỗi dùng lại ở `teamsDeletedAt:293`, `ownerParts:200–201`, lý do chặn dòng 384–385.

**Liên quan:** DR6-160, T-377, T-380, T-382 · có từ trước ở họ dùng thời điểm xóa. Đây là biến thể **cùng giây**, khác ca cùng phút/khác giây đã biết; việc thêm giây và dùng chung vế thời điểm của PR #1088 vẫn để hở biến thể này. Không gọi là hồi quy mới do PR.

**Mô tả:** Hai bản ghi cùng tên/role/team có `deletedAt` khác phần nghìn giây nhưng cùng giây nhận tên nút giống hệt nhau. Với team, câu TR-1 và Thuộc dùng cùng chữ tới giây nên cũng không chỉ được team nào đang chặn.

**Tái hiện / bằng chứng:**

- `data-probe.mjs` tạo hai IS tên Nguyễn An, không team, xóa ở **10:00:00.010** và **10:00:00.990**. `data-results.json` ghi hai id/thời điểm khác nhau, cùng tên nút: `Khôi phục nhân sự Nguyễn An · IS · xóa lúc 07/11/2026 10:00:00`.
- `same-second-probe.mjs` nhập fixture qua app, dùng clock được tiêm vào `openAppData`; tạo/xóa hai team Đồng tên tại **10:01:00.010/.990**. Team đầu có RE Người chờ đã xóa, đang chờ khôi phục team; mọi lệnh đi qua `app.run`, không sửa `deletedAt` hay chèn SQL. Xuất backup hợp lệ.
- `same-second-browser.mjs` nhập backup bằng UI và đọc năm dòng thực tế. Hai nút team đều là `Khôi phục team Đồng tên · xóa lúc 07/11/2026 10:01:00`; hai nút IS vẫn trùng như trên. Dòng RE bị chặn hiện `Khôi phục team Đồng tên (xóa lúc 07/11/2026 10:01:00) trước.`; Thuộc hiện `Team Đồng tên (đã xóa lúc 07/11/2026 10:01:00)`.
- Lệnh: `node C:\workspace\deep-review-1-6-r6\codex\E\data-probe.mjs`, `node ...\same-second-probe.mjs`, `node ...\same-second-browser.mjs` (Node 24 đầu PATH). Kết quả `same-second-results.json`, `same-second-browser-results.json`; log cuối thoát 0, `blocked=[]`, `errors=[]`; [same-second-all.png](C:/workspace/deep-review-1-6-r6/codex/E/same-second-all.png).

**Cùng mẫu:**

```powershell
rg -n 'toldApart|restoreLabel|byDeletion|formatLocalDateTime\(' apps packages --glob '*.ts' --glob '*.tsx' --glob '!*.test.*'
```

`byDeletion` có đúng hai nơi gọi: nhân sự tại `trash-view.ts:277`, team tại `:280`; đã thử cả hai. `teamsDeletedAt:293` chuyển cùng chữ sang lý do chặn `:384–385` và `ownerParts:200–201`, đã xác minh cả hai trong UI. KH/lịch/HĐ dùng mã KH để phân biệt không thuộc mẫu thời điểm này; các chỗ format giờ lưu/xuất backup không có nghĩa vụ tạo tên nút duy nhất. Một nguyên nhân nên giữ một phát hiện.

**Ảnh hưởng:** Ca hiếm khi bản ghi trùng tên được xóa rất sát nhau hoặc clock làm tròn. Người dùng, nhất là khi chọn theo tên truy cập, mất thông tin phân biệt hai dòng và chỉ dẫn team. Không xác nhận sai dữ liệu hay thao tác khôi phục nhầm; giữ mức Nit cho thiếu thông tin nhãn, không nâng mức vì hậu quả giả định.

**Chặn phát hành:** **không** — Nit/A theo K48; đề xuất **sau v1.0**.

**Đề xuất:** Nếu cần tên phân biệt đầy đủ, phát hiện va chạm của chuỗi thời điểm đã format và có fallback xác định (phần nghìn giây hoặc hậu tố khi vẫn trùng) dùng chung cho nút/lý do/Thuộc. Không đổi formatter toàn app chỉ vì ca hiếm này. Ước lượng **10–20 dòng sản phẩm / 25–45 dòng test** cho cả hai nhánh; giữ quyết định làm sau theo K49.

## 7. Bảng đếm mức × trục

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| Tổng | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 2 |

**CONFIRMED 2; PLAUSIBLE 0; không đếm KNOWN. Chặn 0 / không chặn 2.** Không có tỉ lệ PLAUSIBLE cao; không có phát hiện Critical/High/Medium hoặc Low ở D/S/G trong gói này. Không lập bảng R hoặc tổng hợp kết quả của bên khác.

## 8. Đã xét, không thấy thêm

| Trục | Đã đọc/chạy và giới hạn kết luận |
|---|---|
| E — edge case | Đọc mọi parser/ngày/giờ/FYP, kỳ/góc nhìn, chọn KH/RE, nhánh sửa/kết quả/dời/xóa/khôi phục; 14 file unit, Unicode 8a/8b/8d, chuỗi qua năm và ngoài góc nhìn. Ngoài E1 và biến thể nhãn xếp A ở E2, không xác nhận lỗi mới. |
| C — hợp đồng/spec/mockup | Đối chiếu Phase 3/4/6, mockup, nhãn KPI/chặng/báo cáo/Excel và lệch đã duyệt; đọc test cho workbook, chart, tổng theo RE/team. E05 khớp NT-LH-04 nên không đổi spec theo code hoặc tạo phát hiện trùng KNOWN. |
| D — dữ liệu | E02 giữ nguyên JSON HĐ qua xóa/khôi phục; E03 so tổng và toàn bộ kết quả trước dọn/sau dọn/sau xuất nhập trên 56 tổ hợp. Đọc luồng UI gọi lệnh, fallback/nhánh lỗi và xử lý số; không thấy sai dữ liệu mới trong phạm vi. |
| G — guardrail AI | Đọc điểm nối từ chi tiết lịch/hồ sơ và việc hiển thị phân tích AI; gói E không có đường tự áp output AI thành dữ liệu. Không gọi AI thật, không kiểm lại toàn bộ guardrail của gói C, không suy rộng thành chứng nhận AI toàn dự án. |
| S — ranh giới | Đọc kiểm kích cỡ/preview/thay backup, xuất file và các chuỗi đi vào workbook/chart. Test workbook giữ chữ thành cell kiểu string, test tooltip escape HTML đều qua trong bộ unit. Trình duyệt không có request ngoài; không thấy đường thực thi dữ liệu nhập mới trong phần đã xét. |
| P — hiệu năng | Đọc cách nhóm/map/memo của lịch/chặng/team/báo cáo và cách dựng dữ liệu lọc. Dữ liệu tải dùng để kiểm tính đúng ở E03; không đo benchmark riêng và không dùng số hình học làm số hiệu năng. Không có phát hiện P; các mốc cổng/bundle/exe có ở baseline, phép đo tổng thể thuộc F. |
| B — bloat | Đọc diff và các helper của gói, nhất là dùng chung `deletionWords` và các nơi gọi; không tìm được chi phí bloat mới có bằng chứng cần báo. Không đề xuất refactor trước v1.0; không đo bundle riêng để suy ra chi phí của các helper. |
| T — chất lượng test | Đọc trọn 14 file test/5.024 dòng, chạy 364 test. Nhận diện thiếu trạng thái sau thao tác của e2e tên dài và gộp đề xuất kiểm hành vi trong E1, không đếm lại thành lỗi T riêng. Không làm đột biến/gỡ fix của bảng R vì Codex không phụ trách bảng này. |
| A — trợ năng/i18n | Đọc label/aria/status/focus và đường khôi phục, đối chiếu nhãn UI, kiểm tên nút thực tế ở E10; có E2. Không xác nhận vấn đề mới khác về nhãn trong phạm vi đã đọc; không tuyên bố đã thử mọi phần mềm đọc màn hình. |

## 9. Phụ lục: lệnh, nguồn và trạng thái cuối

### Lệnh chính

Mọi lệnh Node đều đặt `C:\Program Files\nodejs` đầu PATH. Ví dụ lệnh unit (cwd `C:\workspace\Project-2C-review-2`):

```powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
$testFiles = Get-Content -LiteralPath 'C:\workspace\deep-review-1-6-r6\common\files-E.txt' | Where-Object { $_ -match '\ttest$' } | ForEach-Object { ($_ -split "`t")[0] }
node node_modules/vitest/vitest.mjs run @testFiles
```

Build (cwd `C:\workspace\Project-2C-review-2\apps\desktop`):

```powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
node node_modules/vite/bin/vite.js build --outDir C:\workspace\deep-review-1-6-r6\codex\E\web
```

Không đặt `VITE_DEMO_ANCHOR` hoặc biến build riêng; không ghi `dist` của repo. Các probe Node nằm ngoài repo, nạp TS qua `C:\workspace\Project-2C-review-2\tools\ts-hooks.mjs` khi cần. Chạy tuần tự data-probe → browser-probe; long-fixture → notice-probe; outside-fixture → outside-probe; same-second-probe → same-second-browser. Mẫu lệnh:

```powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
node C:\workspace\deep-review-1-6-r6\codex\E\notice-probe.mjs
```

### Nguồn/bằng chứng đã lưu

Tất cả dưới **`C:\workspace\deep-review-1-6-r6\codex\E\`**:

| Nguồn | Kết quả / dữ liệu |
|---|---|
| `work-log.md` | Bản chép báo cáo ghi dần, có mốc gián đoạn/làm tiếp; giữ lịch sử các bước đã chạy. |
| `scope.md`, `diff-E.patch` | 52 file đã đọc, diff sau lượt 5. |
| `unit.log`, `build.log`, `web\` | Unit 364/364; bản build web của SHA ghim cho probe. |
| `data-probe.mjs` | `data-probe.log`, `data-results.json`, `fixture.p2cbackup`, `fixture-info.json`: HĐ, 56 tổ hợp, hai IS, dời qua năm. |
| `browser-probe.mjs` | `browser-probe.log`, `browser-results.json`, `cross-year.png`, `same-second.png`: hộp HĐ, lịch/hồ sơ, nhãn IS. |
| `long-fixture.mjs`, `notice-probe.mjs` | `long-fixture.p2cbackup`, `long-info.json`, `notice-probe.log`, `notice-results.json`; `dialog-{kind}-{width}.json`, `notice-{kind}-{width}.png`, `restore-dialog-{person,customer}-{width}.png`. |
| `outside-fixture.mjs`, `outside-probe.mjs` | `outside-fixture.p2cbackup`, `outside-info.json`, `outside-probe.log`, `outside-results.json`; `outside-{customers,appointments,linked}-{width}.png`. |
| `same-second-probe.mjs`, `same-second-browser.mjs` | `same-second-probe.log`, `same-second-results.json`, `same-second-fixture.p2cbackup`, `same-second-browser.log`, `same-second-browser-results.json`, `same-second-all.png`. |

Máy tham chiếu Home PC `DESKTOP-KDURKJP`; không chạy phép đo P mới. Số cổng/bundle/exe của SHA ghim lấy từ `C:\workspace\deep-review-1-6-r6\common\baseline.md`, không giả nhận đã chạy lại. Không cài công cụ mới. Không chạy toàn bộ gates, mutation testing hay test gỡ fix; không có đột biến để xếp bị giết/sống.

Các lần lỗi của harness đã xử lý trước kết quả cuối: unit sandbox không truy cập được cache SSR; chọn nhầm Vite CLI ở node_modules gốc; đầu vào fixture dùng sai tên `date`/thiếu `teamId:null`; selector import/save chưa đúng nhãn thật; lần lặp viewport phải chọn lại mục Dữ liệu trước import; lỗi quote khi soạn probe đã sửa. Đây không phải lỗi sản phẩm. Log cuối dùng làm bằng chứng đều thành công; các giới hạn được ghi ngay ở kịch bản/trục liên quan.

Cuối phiên kiểm lại `git rev-parse HEAD`: **`5b1328ae236aa62981dbf43066ff544a9e832c8c`**; `git status --short`: **rỗng**, như đầu phiên. Không có thay đổi sản phẩm, commit, Issue/PR hoặc tổng hợp ngoài gói. Hoàn tất: **2026-11-07 19:01:19 +07:00**.
