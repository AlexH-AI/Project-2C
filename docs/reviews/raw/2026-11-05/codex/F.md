XONG — codex gói F lượt 5, 2026-11-05 00:46:52 +07:00

## 1. Phiên review

- Bên Codex, gói F, lượt 5.
- SHA đầu phiên: 37a80b662861d308a110d1e2b0f65ad13b91fb51 (detached theo chỉ dẫn).
- git status --short đầu phiên: rỗng.
- Giờ bắt đầu: 2026-11-05 00:28:03 +07:00 (Asia/Bangkok).
- Công cụ: codex-cli 0.162.1. Model được môi trường xác nhận là Codex dựa trên GPT-6; chỉ dẫn phiên ghi GPT Sol 6.1 do Owner chọn. Mức suy luận không hiển thị trong công cụ phiên.

## 2. Bảng R

### 2.1 R1 gói F — 5 dòng

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-136 | #896 → #907 | **ĐÃ SỬA** | `node F/byname.mjs`: 10.255 lịch, trung vị theo KH 63,52 → 11,21 ms, collator trần 8,06 ms. Đặt lại bộ so cũ làm chốt số lần tính khóa đỏ 246.782 ≠ 1.269. | Thứ tự trùng lượt 4 và đối chứng có chuẩn hóa, gồm tên chữ số toàn khổ, Ả Rập và ngoài BMP. Test unit hiện có vẫn xanh với đột biến, xem CXR5-A3. |
| DR6-155 | #904 → #926 | **ĐÃ SỬA** | Đếm `paths.length` trên file đổi tên làm assertion nhận “Read 2 of the 2 files” thay “Read 1 of the 2 files”. Hai vòng guide 13/13. Gỡ `style` làm đỏ “foot of the part in the shot”. | Đổi từ code sang docs vẫn được tính là code. Bộ chụp kiểm cả đầu và chân theo viewport; ảnh cao hơn viewport vẫn là ảnh cuộn. |
| DR6-156 | #904 → #926; #934 → #965 | **ĐÃ SỬA** | `packages/*/src/schema.ts` gặp ghi chú `packages/ai/src/`: area=1. Trả `notes-core` về lượt 4 làm 2/31 đỏ. | `a/b**/c.ts` không gặp `a/x/`, có gặp `a/bx/sub/`. `a/**/c.ts` vẫn gặp `a/x/`. |
| DR6-157 | #904 → #926 | **ĐÃ SỬA** | `bundleReport` trên dist thêm `.sqlite` 9.969.664 B và `.wasm` 4 B: Tệp khác chỉ tăng 4 B, từ 1.022.121 B lên 1.022.125 B. Bản trước sửa đỏ 1/75. | Ảnh, font, wasm và HTML vào Tệp khác; dữ liệu E2E đứng ngoài. |
| CLR4-F2 | #905 → #928 | **ĐÃ SỬA** | NT-EX-08/09 ở `nghiem-thu-v1.md:343–344` ghi ngoại lệ K1. F04 bản xuất sạch nhập được. F06 chỉ đổi `note` của lịch Dời lịch thành U+200B U+0085 U+200B: hộp 10b báo File hỏng hoặc không phải backup Project-2C, số bản ghi giữ nguyên. | Sửa bằng tài liệu theo Q4(a). Đường exe cũ ghi thật là chứng cứ lượt 4 §8.4; lượt này dùng bản xuất native lượt 4 làm đối chứng và chỉ thay một ô trong bản chép. |

### 2.2 R2 gói F — 18 dòng

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-333 | #934 → #965 | **ĐÃ SỬA** | `a/b**/c.ts` với `a/x/` → 0 và với `a/bx/sub/` → 1. Trả code trước #965 làm 1/31 đỏ. | `a/**/c.ts` vẫn khớp; phần generic và CRLF ở D. |
| T-334 | #935 → #948 | **ĐÃ SỬA** | Đối chiếu #948 với báo cáo gốc và ba câu ở tổng hợp lượt 4. `phase-6.md:411` ghi từ sau lượt 3. `phase-5-ai.md:311` ghi 100 code unit UTF-16. `PROJECT-STATE.md` ghi quyết định #917 và #920. | Đoạn Ô chọn ở `nghiem-thu-v1.md:407` tách riêng 7d khỏi trường hợp nowrap. Đối chiếu guide và bằng chứng ô chọn gói D. |
| T-335 | #942 → #944 | **ĐÃ SỬA** | Unit auto-wait 40/40. Gỡ kiểm workflow còn chạy làm 2 test đỏ. Probe F07 lỗi mạng 3 lần rồi pending rồi xong, khoảng cách 30 s trên đồng hồ giả. PR đổi tên từ code vào docs vẫn chờ check. | Kiểm các mã thoát, `--once`, mode title/review/pr, hook, và brief pipeline theo ADR-0001 M11. Ca chạy thật trên PR lấy từ thân #944 đã lưu; phiên này dùng dữ liệu gh giả lập ở ranh giới hàm. |
| T-336 | #950 → #956 | **ĐÃ SỬA** | Phần F: baseline đồ thị 354 module / 1.582 cạnh, 0 lỗi. Bỏ miễn `test-support` trong cấu hình bản chép làm đỏ cạnh `test-support.ts` → `vitest/dist/index.d.ts`. Cấu hình chỉ bỏ thư mục build của repo. | F01 qua dấu • và nối câu. Gói C chấm riêng phần Mock, còn CXR5-C2. |
| T-338 | #952 → #954 | **SỬA MỘT PHẦN** | Gỡ điều kiện `since` làm đỏ 1/40; gỡ lọc khối app làm đỏ 2/9. Brief giữ nhánh local bằng checkout, merge main, push và kiểm lại. Ca không có check và PR code đổi tên vẫn chờ. | CXR5-F1: run không thuộc lần reopen, hoặc run mới đã hủy đi cùng rollup xanh cũ, vẫn trả 0. Đọc §4 và biến thể task-notification/side-sessions-event. |
| T-339 | #960 → #963 | **SỬA MỘT PHẦN** | Hai rule dùng hằng có neo. Đột biến bỏ miễn làm đúng cạnh vitest đỏ; đồ thị hiện tại sạch. Gói C đã dựng cạnh desktop → test-support vẫn lọt. | CXR5-C3. Ràng buộc “chỉ test của package ai import file hỗ trợ test” còn hở ngoài ai. |
| T-340 | #961 → #967 | **ĐÃ SỬA** | So diff `6be4dee`: brief §3.8 chạy lại `notes-for --diff` và cập nhật mục OPEN nếu đổi. §4 trỏ đúng dòng Đóng, mở lại PR và chờ CI. | Cùng điều kiện cập nhật như brief §3.4; phần này chỉ tài liệu. |
| T-342 | #973 → #975 | **ĐÃ SỬA** | `tool-variants.mjs`: `61ab39a..bc8ace3` có 83 commit first-parent, 25 đổi code/test, khớp danh sách. Bảng ghi #917/#937/#939/#944 và lý do của #944. Trả bộ chặn trước #965 làm đỏ 3/28, gồm ca thẻ mở. | Đối chiếu số 23/112 và 19 dòng chính với phép cộng hai đợt trong tài liệu; đối chiếu cách bỏ khối codemap theo thân PR. |
| T-343 | #977 → #978 | **ĐÃ SỬA** | Hai lượt chụp Edge 13/13, 28/28 ảnh trùng byte giữa hai lượt và với repo. Tổng 1.939.611 B, max 141.536 B, link đều hợp lệ. | Git đổi đúng 8 PNG. Đối chiếu ảnh ô chọn, chân thẻ và discovery@5 với #978. Gỡ style trong bộ chụp làm ca guide đỏ. |
| T-345 | #983 → #984 | **ĐÃ SỬA** | Edge không ghim ngày, dữ liệu tải, 11/2026 → 10/2026, 1 kỳ, 10 ngày có Đã gặp. Giới hạn 0 thay 12 làm đỏ ngay với 0 ngày ở 11/2026. | Số đo exe chuẩn bị cũng dùng tháng 10. Chốt kiểm chạy ngoài phần bấm tính giờ. |
| T-346 | #986 → #988 | **SỬA MỘT PHẦN** | Đổi đồng hồ trình duyệt sang 05/01/2027: lùi 1 kỳ về 2026 với 79 dòng. Đổi giới hạn 1 thành 0 làm ca đỏ với 0 lịch ở 2027, báo đúng PERF_RUNS và bước README. `checkPeriods` nằm trước vòng import. | CXR5-F2: phép đếm dòng bằng cả nội dung hàng nhận chữ Đã gặp từ tên KH. Khi gặp dữ liệu như F05, đầu vào có thể bị tính là đủ sai. |
| T-347 | #990 → #992 | **ĐÃ SỬA** | Một helper `metRows` dùng ở hai nơi. Chủ động lùi sai tháng trước `metDays` làm ca nhận lỗi đúng. Bỏ guard, hàm trả tháng 10 với `0 back` và assertion đỏ. | Kiểm sửa chia sẻ locator và chốt tháng. Locator chọn lịch theo cả dòng đã có ở lượt 4. T-346 dùng thêm phép lọc đó để đếm mẫu. T-347 dùng chung helper, xem CXR5-F2. Ca benchmark toàn exe lấy từ baseline và #992; Edge chỉ đối chứng chọn kỳ. |
| T-348 | #994 → #995 | **ĐÃ SỬA** | `docs-audit.json`: 35 dòng probe G7; đọc các trị số LCP 3.420 ms, mở lại 617 ms, Dọn sạch 130,5 ms và exe 5.649.408 B. Hash tables, số bản ghi, kỳ Tháng/Năm và L1 khớp output lưu ở #995. | So ba mốc ở §6. Dữ liệu G7 và lượt 5 cùng hash tables. |
| T-349 | #997 → #999 | **ĐÃ SỬA** | `nghiem-thu-v1.md`, NT-HN-01: đoạn L1 giữ kết quả bằng chữ và trỏ mục G7. `phase-6.md:249` ghi rõ bước 3 mở lại là bước thêm so lượt 4. | Đối chiếu mốc lượt 4 chỉ có bốn việc; không lấy lần mở lại G7 làm số đo lượt 4. |
| T-351 | #1002 → #1003 | **ĐÃ SỬA** | Đếm L2 qua 243 dòng NT, 222 ✅, 1 ⚠️, 1 ❌, 18 —. SHA `1ce3c61`, CI run 41666800294, dữ liệu và phạm vi khớp thân #1003. | NT-TR-07 được sửa về sau ở T-350 và L3; L2 giữ kết quả lịch sử. F02 đối chiếu hành vi hiện tại. |
| T-352 | #1004 → #1007 | **ĐÃ SỬA** | Đối chiếu mục Dữ liệu, sáu dòng cần Owner, chú giải ⚠️, NT-AI-03 và hai hàng bảng Cổng KYC. `docs-audit.mjs` xác nhận hàng conflict có liên kết, hàng insufficient không có; D N7 kiểm qua UI. | Danh sách tám dòng được T-354 thêm NT-TR-12 thành chín; tổng L2 giữ nguyên. |
| T-354 | #1012 → #1014 | **ĐÃ SỬA** | `nghiem-thu-v1.md:23,205,317`: NT-TR-12 có trong chuẩn bị, thao tác vẫn Ghi kết quả trên lịch đã qua, NT-AI-03 bỏ dấu chấm thừa sau ngoặc kép. | F02 tái hiện việc tạo lịch qua ngày rồi mới Ghi kết quả. Câu dấu ở NT-KH-09/NT-CD-04 được xử lý sau tại T-355. |
| T-355 | #1017 → #1020 | **ĐÃ SỬA** | Đếm L3 38 ✅ và 1 ❌ NT-HD-01 (#1019). Bảng có ngày, máy, exe `3d237b0`, version, hash rút gọn, CI run 41765637293. Hai dòng NT-KH-09/NT-CD-04 đã chỉnh dấu. Diff ngoài tài liệu từ `3d237b0` rỗng. | Giữ lịch sử L2 và phần Owner. Đối chiếu cách mở màn lần cuối với T-356 (D N2). F không lặp các thao tác cần Owner, key thật hoặc máy khác. |

### 2.3 R1 gộp — 25/25 dòng

Cột kết luận lấy mức còn thiếu nhất trong các gói kiểm. Khi kết luận theo phần khác nhau, giữ cả hai ở cột bằng chứng. Các dòng từ A–E dẫn đúng dòng trong báo cáo của chính Codex.

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-135 | #896 → #907 | **ĐÃ SỬA** | **A.md:15** — Ca mới `appointments.test.ts:1027` xanh ở SHA ghim. M1 đổi `date >= ?` thành `date > ?`, đỏ đúng ca cùng ngày, 1/71. | **A** — N1 thử xóa, sửa thành Hủy, đổi nhóm và đổi ngày, cả bốn từ chối đúng ngày 05/10. Xóa B rồi A, nhập backup, khôi phục sai thứ tự bị chặn, khôi phục đúng trả N2 và nhập lại được. |
| DR6-136 | #896 → #907 | **ĐÃ SỬA** | **A.md:16** — 10.255 lịch sắp theo KH, trung vị 64,15 → 11,45 ms, collator đối chứng 8,06 ms. Thứ tự trùng `2e51e25`. Thử trả comparator cũ làm chốt đếm khóa của probe đỏ 246.782 ≠ 1.269.<br>**F §2** — `node F/byname.mjs`: 10.255 lịch, trung vị theo KH 63,52 → 11,21 ms, collator trần 8,06 ms. Đặt lại bộ so cũ làm chốt số lần tính khóa đỏ 246.782 ≠ 1.269. | **A** — Cả 9 unit vẫn xanh với mã cũ (M2). Khoảng hở kiểm hồi quy ở CXR5-A3. Tên thật, tên trộn số toàn khổ/Ả Rập và số ngoài BMP cho kết quả đúng trên mẫu.<br>**F** — Thứ tự trùng lượt 4 và đối chứng có chuẩn hóa, gồm tên chữ số toàn khổ, Ả Rập và ngoài BMP. Test unit hiện có vẫn xanh với đột biến, xem CXR5-A3. |
| DR6-137 | #896 → #907 (+ #933 → #946) | **ĐÃ SỬA** | **A.md:17** — M3 trả `isLabel` cũ, đỏ 2/218, ở lệnh và ở lời gọi riêng của luật 12. N3 chặn nửa surrogate tại biên 100 đơn vị và U+FEFF đầu ở lệnh; file hỏng bị `BACKUP_INVALID` trước luật 12.<br>**C.md:19** — Chạy lại probe CXR4-A1 qua recordAiAnalysis. Cả hai nửa surrogate ở đơn vị thứ 100 và U+FEFF ở đầu đều trả AI_ANALYSIS_INVALID. Bỏ kiểm đọc lại nguyên văn ở isLabel làm 2 test đỏ, gồm ca lệnh và ca luật 12. | **A** — NUL và cả hai nửa surrogate bị từ chối. Nhãn đúng 100 đơn vị chứa cặp surrogate hợp lệ, U+FEFF giữa/cuối và U+0085 giữa đọc lại nguyên.<br>**C** — U+FEFF giữa và cuối, cùng nhãn 98 chữ + emoji (100 đơn vị UTF-16), được giữ nguyên khi đọc và xuất → nhập → xuất. Ca backup có BOM đầu bị chặn ở bước nạp VALUE. CXR5-C4 là vấn đề hiển thị với một nhãn hợp lệ. |
| DR6-138 | #897 → #915 | **ĐÃ SỬA** | **B.md:23** — Đối chứng Rust 77/77, TS 228/228. Nới 6 cấu hình CSP gốc và đổi identifier: mỗi bản chép 1/18 đỏ đúng ca; bỏ lọc chỉ file: 3/77 đỏ; bỏ ánh xạ ổ đầy: 1/77 đỏ đúng ca. | **B** — Thêm worker-src *: 1/18 đỏ. Các ca thư mục phủ khởi động, chọn bản mới nhất và giữ đúng số backup. |
| DR6-139 | #898 → #911 | **SỬA MỘT PHẦN** | **B.md:24** — Bỏ vòng lặp cuối hoặc chỉ chờ ghi: mỗi lần 2/92 đỏ. Với lần ghi đang chạy, probe qua AppData chờ cả lượt nhập tới muộn và lượt ghi mới. | **B** — Probe gốc DSR4-B1 còn lộ khi ban đầu rảnh, gọi đóng rồi Nạp lại cùng lượt JavaScript, backup bị giữ. CXR5-B1, kịch bản 1. |
| DR6-140 | #898 → #911 (+ #933 → #946) | **ĐÃ SỬA** | **B.md:25** — Gọi listener trần như cũ: 1/79 đỏ ở đúng ca DR6-140 (Error: listener bug). Đối chứng trả kết quả, ghi team, báo lỗi một lần và gọi listener sau. | **B** — Probe AppData: tự gỡ chỉ gọi một lần, hai lệnh trả kết quả và hai lượt ghi đều xong. |
| DR6-141 | #899 → #917 (+ #930 → #937, #931 → #939, #950 → #956, #960 → #963) | **ĐÃ SỬA** | **C.md:20** — Cả 18 câu CLR4-C1 và 2 câu CXR4-C1 tái hiện đề xuất cũ ở 2e51e25, còn 37a80b6 trả 0/20 qua runExtraction. Câu “Thông tin KH độc thân là sai.” trên Edge hiện trạng thái không tìm thấy. Bỏ RETRACTED làm 6 test đỏ. | **C** — Ghi chú tải và seed chỉ đổi ở nhãn Hôn nhân: Ly hôn (§4). Các ca mới về dấu đầu dòng và chữ “bé” ở R2. |
| DR6-142 | #900 → #909, #913 (+ #930 → #937) | **ĐÃ SỬA** | **C.md:21** — “phần\u0000trăm”, “xác\u0000suất” trước lọt, nay V3. Bỏ loại NUL làm 18 test đỏ ở validator và web. Edge từ chối tin nhắn gốc và tin sửa có chèn NUL ở cả hai lượt, còn phiên, 0 dòng. | **C** — BEL vẫn V3. NUL giữa chữ ở V5 và V6 bị chặn. Ca mất ranh giới trước cụm, cùng thay đổi “Atomic”, đúng §14.5/K43. So 1.199 chuỗi vi.ts, 0 thay đổi mã chặn. Chấp nhận kết quả 1.085 chuỗi eval thật từ số đo PR #913 trong fixes.md vì bộ output thô ấy không có trong nguồn phiên được phép đọc. |
| DR6-143 | #900 → #909, #913 (+ #930 → #937) | **ĐÃ SỬA** | **C.md:22** — Các câu cũ “môi giới / ranh giới Luật …” từ lọt sang V6. Miễn “giới” không điều kiện như cũ làm 8 test đỏ. | **C** — “biên giới”, “THẾ-GIỚI_LUẬT”, NUL trong “môi” hoặc “luật” cũng V6. “giới luật Phật giáo” ở hai cách viết hoa, “định luật Pareto” và ví dụ khoản vay/ngày E18 đều qua. “quy định Luật Đất đai” vẫn V6. |
| DR6-144 | #899 → #917 (+ #933 → #946) | **ĐÃ SỬA** | **C.md:23** — Edge: cho adapter giả timeout sau khi rời hồ sơ. Quay lại dữ liệu cũ hiện đúng một lần. Lặp rồi nhập backup có cùng ID, generation 0→1 và 0 cảnh báo cũ. Bỏ so generation làm 3 test đỏ, có cả Nạp lại và Nhập backup. | **C** — Lỗi AI trích xuất được giữ khi còn cùng dữ liệu, mất sau Nhập backup rồi vẫn mất sau Nạp lại (generation 2). |
| DR6-145 | #901 → #920 (+ #934 → #965, #969 → #971, #973 → #975) | **SỬA MỘT PHẦN** | **D.md:19** — `guard-probe.log` chạy lại dạng nối bằng chuỗi, template và JSX cùng ba biên `//`, `/*`, `*/` trong chuỗi. Gỡ phần #920 làm 9/28 test đỏ. N7 kiểm phần (a) trên màn. | **D** — Mô tả DR6 gốc còn `← – … “ ” ‘ ’` và escape Unicode. Cả hai mẫu hợp lệ đều trả `[]` ở SHA ghim. #920 ghi các nhóm này ngoài phạm vi Issue. CXR5-D1. |
| DR6-146 | #902 → #922 (a), #898 → #911 (b) | **ĐÃ SỬA** | **D.md:20** — Hai ca `customer-forms:387` và `save-state:177` đều xanh. Gỡ riêng theo R109c và RB2c làm cả hai đỏ. 5c mất lỗi INVALID_TEXT do hộp đóng khi lưu. Nhánh Tab bị lấy focus khỏi nút + Nhân sự. | **D** — Tab ra khỏi dải giữ focus ở nút tiếp theo. Click khoảng trống làm focus rơi về trang, lúc lưu xong chuyển về h1. Ca 5a dán cùng dạng hỏng cũng qua. |
| DR6-147 | #898 → #911 | **ĐÃ SỬA** | **D.md:21** — `save-state:202`, `:225` xanh. Một lần ghi khác thành công đưa focus từ Thử lại về h1, hoặc gỡ câu hỏi rồi phát `save, destroy`. Lùi SaveWarning và CloseGuard về trước #911 làm cả hai đỏ, h1 không focus và sự kiện cuối là `save, save`.<br>**B.md:26** — Playwright build web/Exe giả: dải gỡ, focus lên H1; OpenCode giả lưu được, hộp gỡ, hai sự kiện cuối là save → destroy, MutationObserver không thấy câu chương trình khác. Gỡ trả focus: ca gốc và ca đổi team đều đỏ ở H1. Gỡ tự trả lời: e2e đỏ ở save/destroy, unit 1/8 đỏ. | **D** — N3 thử đóng khi 5a còn bản nháp. Escape trả focus về ô tên và giữ bản nháp. Các ca lỗi lại/đổi nguyên nhân và đóng lúc Nạp lại cũng xanh.<br>**B** — Biến thể lỗi lần thử lại đổi READ_ONLY → DISK_FULL; Escape giữ cửa sổ; bấm X lại khi file ghi được thì save → destroy. |
| DR6-148 | #902 → #922 (+ #932 → #941, #951 → #958) | **ĐÃ SỬA** | **D.md:22** — Sáu ca `long-names` xanh tại 1 100/1 440, gồm title/subtitle, Team với IS/TL dài, So sánh team, cuộn tới cột số Báo cáo. Bỏ `wrap-anywhere` của Dialog làm hai ca title/subtitle đỏ tại 1 100.<br>**E.md:17** — 6 ca `long-names.spec.ts` xanh ở 1.100 và 1.440 px, gồm tiêu đề/phụ đề, Team, bảng So sánh team và Báo cáo Theo team/RE ở cuối vùng cuộn. Trả riêng `TeamCompare.tsx` và `ReportTable.tsx` về `2e51e25` làm đúng hai ca bảng đỏ ở 1.100 px. | **D** — N1 và N6 tìm thêm hai vị trí ngoài bốn chỗ của DR6-148, CXR5-D3/D4.<br>**E** — Dòng Đang xem và tiêu đề biểu đồ ở góc nhìn Team là hai đường hiển thị khác, E05 / E09, CXR5-E1 / E2. |
| DR6-149 | #901 → #920 (+ #905 → #928, #935 → #948) | **ĐÃ SỬA** | **D.md:23** — E2E theme đối chiếu 5a/5d với `forms.css:261`, đo nền, viền, bo, đệm, chữ, độ tương phản, trọng lượng và gạch ngang. Lùi Choices làm đỏ bo góc, 10 thay 6 px. | **D** — Áp K44, đo viền ≥3:1 ở ô đang chọn. Đối chiếu ba lệch đã ghi về xuống dòng, opacity hộp AI 1c và kiểu hàng 7d tại `nghiem-thu-v1.md:407`. Các ca thao tác 5a/5d và ca bàn phím của bộ nút chuyển đã qua. |
| DR6-150 | #903 → #924 (+ #933 → #946, #951 → #958) | **ĐÃ SỬA** | **E.md:18** — E2E hiện có tái hiện U+200B/U+0085/U+2060 ở Case size, ngày 6b/6c/6e và giờ trống 6b. Trả `trim()` vào Case size làm 2 unit test đỏ với `error: 'empty'`. Trả `trim()` vào `pending` của 6b làm e2e đỏ vì đã có `aria-invalid` trước Lưu. E07/E10 lưu 6f và nhập bù lịch rồi ghi 6d với Case size trống. | **E** — E07: dán giờ có BOM / U+200B / U+2060 vẫn lưu đúng phút. E08: thời điểm báo lỗi của ô bắt buộc HĐ khác các ô ngày đã sửa, CXR5-E3. |
| DR6-151 | #903 → #924 (+ #933 → #946) | **ĐÃ SỬA** | **E.md:19** — E2E hai KH cùng tên và cùng N4 có mã riêng. R151 truyền tập mã rỗng vào `SettingsTrash`, test đợi 2 nút có mã nhưng nhận 0. Test nhân sự cùng tên khác vai trò/team xanh. R151-person bỏ vai trò/team, test đỏ, mất `· TL · Sao Mai`.<br>**A.md:18** — Phần A, `listTrash` trả mã KH. M4 bỏ mã làm đỏ 1/125. Edge tái hiện hai ca gốc. Hai KH cùng tên/cùng nhóm có hai tên nút với mã app sinh. Nhân sự cùng tên khác vai trò/team có hai tên nút khác nhau. | **E** — E11 lọc theo tên, khôi phục một KH, nút của dòng duy nhất còn lại bỏ mã. Test `trash-view.test.ts` có KH khác nhóm và người không có team. Khớp K41 Q3.<br>**A** — K41 Q3(a) được giữ. Hai biến thể ngoài ca gốc ở CXR5-A1 và CXR5-A2. |
| DR6-152 | #903 → #924 | **ĐÃ SỬA** | **E.md:20** — `static.mjs exports` báo `exposed:false, consumers:[]`. Thêm lại `export` làm kiểm tĩnh tiêu chí Issue đỏ. Ca nhắc 1.000 của `trash-view.test.ts` và e2e xanh. | **E** — Thêm export không làm đổi hành vi lúc chạy, nên đột biến này dùng kiểm tĩnh. Ngưỡng 999 → 1.000 vẫn được unit test giữ. |
| DR6-153 | #903 → #924 | **ĐÃ SỬA** | **E.md:21** — Tái hiện RB2e bằng cách bỏ vế Thử lại, `save-state.spec.ts:126` đỏ vì thiếu đúng vế đó. Tái hiện T305b bằng cách bỏ huy hiệu nhóm, `trash.spec.ts:197` đỏ ở ô Bản ghi. Hai ca xanh trên SHA ghim. | **E** — Nhập lại sau Thử lại thành công, và ca huy hiệu HĐ phân biệt Đã nộp / Đã phát hành xanh. |
| DR6-154 | #903 → #924 (+ #933 → #946, #951 → #958) | **ĐÃ SỬA** | **E.md:22** — `dialog-keyboard.spec.ts` và `trash.spec.ts` giữ focus ở nút Đang nhập / Đang nạp lại / Đang dọn và giữ hộp khi bấm Escape. R154 thêm `disabled` thật lúc chạy, ca 10a đỏ ở `toBeFocused`. | **E** — E06 thử Enter và Space lặp khi đang chạy, hai Tab và hai Escape, chỉ 1 backup, sau đó focus về nút mở. Nút mờ 0,5 và có tên đọc được qua vai trò/nút trên Edge. |
| DR6-155 | #904 → #926 | **ĐÃ SỬA** | **F §2** — Đếm `paths.length` trên file đổi tên làm assertion nhận “Read 2 of the 2 files” thay “Read 1 of the 2 files”. Hai vòng guide 13/13. Gỡ `style` làm đỏ “foot of the part in the shot”. | **F** — Đổi từ code sang docs vẫn được tính là code. Bộ chụp kiểm cả đầu và chân theo viewport; ảnh cao hơn viewport vẫn là ảnh cuộn. |
| DR6-156 | #904 → #926 (+ #934 → #965) | **ĐÃ SỬA** | **F §2** — `packages/*/src/schema.ts` gặp ghi chú `packages/ai/src/`: area=1. Trả `notes-core` về lượt 4 làm 2/31 đỏ. | **F** — `a/b**/c.ts` không gặp `a/x/`, có gặp `a/bx/sub/`. `a/**/c.ts` vẫn gặp `a/x/`. |
| DR6-157 | #904 → #926 | **ĐÃ SỬA** | **F §2** — `bundleReport` trên dist thêm `.sqlite` 9.969.664 B và `.wasm` 4 B: Tệp khác chỉ tăng 4 B, từ 1.022.121 B lên 1.022.125 B. Bản trước sửa đỏ 1/75. | **F** — Ảnh, font, wasm và HTML vào Tệp khác; dữ liệu E2E đứng ngoài. |
| DR6-37 | #790 → #845, #901 → #920 | **ĐÃ SỬA** | **D.md:18** — Đối chiếu CL-D5 và CL-E5 ở `6.4 lượt 4 và bản gốc lượt 1. Thẻ Dữ kiện dùng `kyc.factLine`. Câu nối danh sách, giá trị đang có và ngoặc kép của hộp giải quyết đã qua i18n. Ca KYC xác nhận và giải quyết mâu thuẫn qua. Thay riêng `CustomerKyc.tsx` bằng bản cũ làm token lint exit 1 tại dòng 95 với `}: {`.<br>**E.md:16** — Đối chiếu L·CL-E5 và L·CL-D5 lượt 1, cùng phần còn thiếu §3.1 lượt 4. `static.mjs sep` báo 0 trên 38 file SP E và `CustomerKyc.tsx`. Trả lại cặp mũi tên bảng So sánh team, × trong 6b, dấu nối và gạch ngang trong 6a thì bộ chặn bắt cả ba. Trả lại mẫu `{trường}: {giá trị}` trong JSX của `CustomerKyc.tsx:95` thì R37-KYC bắt `}: {` đúng dòng. | **D** — N7 thấy `Số con: 2`, rồi cổng mâu thuẫn có liên kết đúng. Ca KYC cũng kiểm ngoặc kép và mã nguồn của giá trị. Đối chiếu `sep.list`, dấu ×, ▾/▸ và dấu — của các đường nối E theo CL-E5. Lỗ của chính công cụ nằm ở DR6-145.<br>**E** — Kiểm cả fallback cột Thuộc trong Thùng rác và dấu gạch ngang của chi tiết lịch. Khuôn KYC dùng `kyc.factLine` trong `vi.ts:98`. Dấu cùng chữ trên màn được e2e giữ theo hành vi, bộ chặn giữ việc đặt chữ ở i18n. |
| CLR4-F2 | #905 → #928 (tài liệu) | **ĐÃ SỬA** | **F §2** — NT-EX-08/09 ở `nghiem-thu-v1.md:343–344` ghi ngoại lệ K1. F04 bản xuất sạch nhập được. F06 chỉ đổi `note` của lịch Dời lịch thành U+200B U+0085 U+200B: hộp 10b báo File hỏng hoặc không phải backup Project-2C, số bản ghi giữ nguyên. | **F** — Sửa bằng tài liệu theo Q4(a). Đường exe cũ ghi thật là chứng cứ lượt 4 §8.4; lượt này dùng bản xuất native lượt 4 làm đối chứng và chỉ thay một ô trong bản chép. |

### 2.4 R2 gộp — 28/28 dòng

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-329 | #930 → #937 | **ĐÃ SỬA** | **C.md:29** — Đối chiếu 97876b4→b6d4388: LAW_NAME, THE_KH, KH_NAMED giống từng ký tự. 0 khác biệt trước/sau khi tách qua runExtraction ở 5.672 ghi chú tải, 4.195 ghi chú seed và X01–X05. Bỏ truyền danh sách fields từ adapter làm 202 test đỏ. | **C** — Trường được phép có tác dụng và “Độc thân: KH đã kết hôn.” không đề xuất. NUL dùng chung, chú thích ownLine và codemap khớp. Git diff -M mặc định hiện tách thành file mới vì adapter vẫn tồn tại. git diff -C nhận bản sao 89% cho nguồn, 85% cho test, git log --follow vẫn đến #917/#822, khớp cách #937 ghi. |
| T-330 | #931 → #939 | **SỬA MỘT PHẦN** | **C.md:30** — Qua runExtraction: lấy giá trị cuối, thêm Ly hôn, Góa, Ly thân, một con mất, cả hai mất và “bé” chỉ trẻ em đều có đối chứng đạt. Giữ giá trị đầu thay cuối làm 62 test đỏ. Trên Edge, “1) KH có 3 bé. / 2) Một bé qua đời.” cho Số con 2. | **C** — CXR5-C1, nhánh nhận cái chết dùng “bé” mang nghĩa kích thước trái luật 4. Ghi chú tải/seed đổi đúng nhóm nhãn Ly hôn. Giữ các giới hạn K42 đã chốt. |
| T-331 | #932 → #941 | **ĐÃ SỬA** | **D.md:29** — `ui-datatable.test.tsx:38` giữ `th.relative` của ô tiêu đề ẩn, bỏ class làm đỏ. Khung Team dùng `overflow-x-auto`. Các ca tên team/TL, vị trí mũi tên và số đếm, phụ đề dài xanh.<br>**E.md:28** — Test markup của DataTable giữ `relative` ở `th` tiêu đề ẩn. E2E giữ tiêu đề/phụ đề, TL 160 chữ, hai nút trong thẻ, tên TL thường một dòng, số đếm và mũi tên ở dòng đầu. T331 trả mũi tên về `items-center`, lệch 64,625 px thay vì tối đa 3 px. | **D** — Tên TL thường vẫn một dòng cạnh tên team dài. TL 160 chữ giữ nút trong thẻ và tiêu đề team ngắn một dòng ở cả hai bề rộng.<br>**E** — Báo cáo với tên RE và team cùng dài vẫn đọc được các cột số khi cuộn hết. E05/E09 thử riêng hai vị trí ngoài bảng. |
| T-332 | #933 → #946 | **ĐÃ SỬA** | **E.md:29** — T332-time bỏ chuẩn hóa chuỗi trắng, `parseTime` trả `{ ok: false }` thay `{ ok: true, time: null }`. T332 đổi nút Chọn file… về `disabled` lúc đọc, ca focus 10a/10b đỏ. Bản chuẩn: Hủy, Escape, Đóng 10b và nhập xong đều trả focus đúng. Test giữ số lần mở file chooser.<br>**A.md:24** — Phần A, `isLabel` và `valueOf` cùng gọi `readsBackAsIs`. M5 bỏ chặn U+FEFF đầu làm đỏ 9/299 ở helper, lệnh và nhập. N3 thử 380 giá trị hỏng trên 95 cột chữ thuộc 12 bảng.<br>**B.md:32** — Ba store dùng notify; dời catch ra ngoài vòng lặp: 4/108 đỏ, một ở helper và một ở mỗi store (AppData, PersistQueue, AiJobs).<br>**D.md:30** — Focus 10a Hủy/Escape và 10b Đóng về Chọn file. Ca giữ đọc file kiểm không mở thêm file chooser. `customer.withCode` dùng ở 9b và Thùng rác, bỏ mã làm đỏ hai test về trùng tên. Codemap khớp.<br>**C.md:31** — Phần gói C: AiJobs dùng notify, vẫn báo lỗi listener và cho listener sau chạy. Thay bằng vòng gọi trần làm 1 test đỏ. 6 suite tích hợp DB/dữ liệu/listener qua 209 test. | **E** — Một khóa `customer.withCode` dùng ở `restoreLabel` và `inUseHelp`. Chú thích nằm trên ca Dọn sạch. Test `listeners.test.ts` giữ việc listener sau vẫn chạy khi listener trước ném. Kiểm sâu lớp dữ liệu/listener thuộc A/B/C.<br>**A** — M7 bỏ bọc listener làm đỏ 4/108, gồm helper, AppData, hàng đợi lưu và AiJobs. N4 tự gỡ rồi ném, listener kế tiếp vẫn nhận cả hai lượt; hai lệnh vẫn trả bản ghi đã lưu. N5 kiểm chung khuôn tên + mã ở đường Thùng rác. Ô Giờ/focus thuộc D/E.<br>**B** — Probe tự gỡ và ném qua AppData/hàng đợi lưu giữ thứ tự listener và kết quả lệnh. CXR5-B2 là lỗi hàng đợi có sẵn khi listener gọi lệnh lồng.<br>**D** — N5 kiểm Tab/Shift+Tab, Enter/Space và cây trợ năng. Unit ô Giờ, DB, ba store và probe listener tự gỡ + listener ném đều xanh. E2E ô Giờ vô hình lưu được. Chú thích TR-11/11i ở ca Dọn sạch.<br>**C** — Listener tự gỡ rồi ném, log theo thứ tự self → sentinel → other → other. Công việc trả done và được gỡ. Hai nhánh isLabel và backup dùng readsBackAsIs, đối chứng ở DR6-137. Focus và ô nhập thuộc gói tương ứng. |
| T-333 | #934 → #965 | **ĐÃ SỬA** | **D.md:31** — Lùi `token-guard.ts` về trước #965, đỏ cả ca `Promise<void>`/generic và CRLF. Ở bản ghim, generic lồng `Map` cho `[]` và chuỗi tiếp qua CRLF đếm đúng dòng 3.<br>**F §2** — `a/b**/c.ts` với `a/x/` → 0 và với `a/bx/sub/` → 1. Trả code trước #965 làm 1/31 đỏ. | **D** — Generic có đối số kiểu hàm generic là biến thể còn hở, CXR5-D2. `notes-core.test.mjs` chạy xanh, phần glob thuộc F.<br>**F** — `a/**/c.ts` vẫn khớp; phần generic và CRLF ở D. |
| T-334 | #935 → #948 | **ĐÃ SỬA** | **F §2** — Đối chiếu #948 với báo cáo gốc và ba câu ở tổng hợp lượt 4. `phase-6.md:411` ghi từ sau lượt 3. `phase-5-ai.md:311` ghi 100 code unit UTF-16. `PROJECT-STATE.md` ghi quyết định #917 và #920. | **F** — Đoạn Ô chọn ở `nghiem-thu-v1.md:407` tách riêng 7d khỏi trường hợp nowrap. Đối chiếu guide và bằng chứng ô chọn gói D. |
| T-335 | #942 → #944 | **ĐÃ SỬA** | **F §2** — Unit auto-wait 40/40. Gỡ kiểm workflow còn chạy làm 2 test đỏ. Probe F07 lỗi mạng 3 lần rồi pending rồi xong, khoảng cách 30 s trên đồng hồ giả. PR đổi tên từ code vào docs vẫn chờ check. | **F** — Kiểm các mã thoát, `--once`, mode title/review/pr, hook, và brief pipeline theo ADR-0001 M11. Ca chạy thật trên PR lấy từ thân #944 đã lưu; phiên này dùng dữ liệu gh giả lập ở ranh giới hàm. |
| T-336 | #950 → #956 | **SỬA MỘT PHẦN** | **C.md:32** — Ca dấu kết câu, dòng trống, emoji/số thứ tự, danh sách “-” hoặc “•” có đúng giá trị cuối. Vế có chữ ngắt mang KH. Ca cả hai con mất và một con mất đạt. Bỏ bỏ qua dấu đầu dòng khi mang KH làm 2 test đỏ.<br>**F §2 (ĐÃ SỬA)** — Phần F: baseline đồ thị 354 module / 1.582 cạnh, 0 lỗi. Bỏ miễn `test-support` trong cấu hình bản chép làm đỏ cạnh `test-support.ts` → `vitest/dist/index.d.ts`. Cấu hình chỉ bỏ thư mục build của repo. | **C** — CXR5-C2, dấu gạch ngang U+2013 đầu dòng giữ nguyên khi lưu nhưng không được xét như dấu đầu dòng. Kiểm phần test-support với T-339. CLAUDE.md, sổ quyết định và §10 ghi luật; giới hạn chữ được công nhận nằm ở regex.<br>**F** — F01 qua dấu • và nối câu. Gói C chấm riêng phần Mock, còn CXR5-C2. |
| T-337 | #951 → #958 | **ĐÃ SỬA** | **E.md:30** — T337 trả regex đọc giờ về `trim()` nhưng giữ chuẩn hóa kiểm rỗng, test dán giờ đỏ ở `14:00`. Test markup Button và e2e độ mờ 0,5 của nút đang chạy xanh. Ca TL 160 chữ giữ tiêu đề Team Bình Minh một dòng ở hai cỡ cửa sổ.<br>**D.md:32** — `ui-button.test.tsx:14` đỏ khi gỡ cặp class `aria-disabled:`. Hai chỗ gọi dùng class chung. E2E tiêu đề team một dòng ở cả hai cỡ. Unit `parseTime` qua các ca U+200B/U+2060 dính với giờ và giờ sai. | **E** — E02/E03 dán vào 6e, E07 dán vào 6b/6f. Giờ ngoài miền vẫn bị từ chối. E06 Enter/Space không khởi động thêm lượt.<br>**D** — N5 cho thấy nút đang đọc có opacity 0,5, cây trợ năng báo disabled, Tab rồi Shift+Tab về nút, Enter và Space không mở thêm bộ chọn. Đọc cây trợ năng Chromium. |
| T-338 | #952 → #954 | **SỬA MỘT PHẦN** | **F §2** — Gỡ điều kiện `since` làm đỏ 1/40; gỡ lọc khối app làm đỏ 2/9. Brief giữ nhánh local bằng checkout, merge main, push và kiểm lại. Ca không có check và PR code đổi tên vẫn chờ. | **F** — CXR5-F1: run không thuộc lần reopen, hoặc run mới đã hủy đi cùng rollup xanh cũ, vẫn trả 0. Đọc §4 và biến thể task-notification/side-sessions-event. |
| T-339 | #960 → #963 | **SỬA MỘT PHẦN** | **C.md:33** — Bỏ kiểm vế có chữ trước vế không chủ ngữ làm 2 test đỏ, có ca đúng như Issue. Thêm quét ngược bậc hai làm 12 ca thời gian đỏ, ví dụ 1.067 ms so trần 60 ms. depcruise chặn latest-support.ts, web-test-support.ts và code sản phẩm trong ai import test-support. Bỏ miễn thì cạnh test-support → vitest đỏ.<br>**F §2** — Hai rule dùng hằng có neo. Đột biến bỏ miễn làm đúng cạnh vitest đỏ; đồ thị hiện tại sạch. Gói C đã dựng cạnh desktop → test-support vẫn lọt. | **C** — CXR5-C3, luật ghi chỉ test của ai được import, nhưng mã sản phẩm desktop import trực tiếp vẫn xanh. Không thấy cạnh thật trong baseline.<br>**F** — CXR5-C3. Ràng buộc “chỉ test của package ai import file hỗ trợ test” còn hở ngoài ai. |
| T-340 | #961 → #967 | **ĐÃ SỬA** | **F §2** — So diff `6be4dee`: brief §3.8 chạy lại `notes-for --diff` và cập nhật mục OPEN nếu đổi. §4 trỏ đúng dòng Đóng, mở lại PR và chờ CI. | **F** — Cùng điều kiện cập nhật như brief §3.4; phần này chỉ tài liệu. |
| T-341 | #969 → #971 | **ĐÃ SỬA** | **D.md:33** — Comment ghi thẻ đóng/tự đóng dính chữ và hậu quả. Ca ghim chỉ báo dòng đối chứng có thẻ đóng sau biểu thức. Gỡ phép đếm generic làm chính ca ghim đỏ, có thêm hai dòng đóng/tự đóng. | **D** — Đây là hợp đồng tài liệu/test về giới hạn được Owner chốt. Ca đối chứng giữ hành vi với thẻ không dính chữ. |
| T-342 | #973 → #975 | **ĐÃ SỬA** | **D.md:34** — Ca T-341 ghim thêm thẻ mở dính chữ, đúng một báo cáo ở dòng 4. Gỡ phép đếm generic làm ca đó đỏ với báo cáo thừa ở dòng 1. Token lint xanh.<br>**F §2** — `tool-variants.mjs`: `61ab39a..bc8ace3` có 83 commit first-parent, 25 đổi code/test, khớp danh sách. Bảng ghi #917/#937/#939/#944 và lý do của #944. Trả bộ chặn trước #965 làm đỏ 3/28, gồm ca thẻ mở. | **D** — Bảng `phase-6.md:366` có #944 và lý do chấp nhận cỡ, câu tổng ở dòng 380 tới #974. Kiểm phần guard của D, phần đếm PR thuộc F.<br>**F** — Đối chiếu số 23/112 và 19 dòng chính với phép cộng hai đợt trong tài liệu; đối chiếu cách bỏ khối codemap theo thân PR. |
| T-343 | #977 → #978 | **ĐÃ SỬA** | **F §2** — Hai lượt chụp Edge 13/13, 28/28 ảnh trùng byte giữa hai lượt và với repo. Tổng 1.939.611 B, max 141.536 B, link đều hợp lệ. | **F** — Git đổi đúng 8 PNG. Đối chiếu ảnh ô chọn, chân thẻ và discovery@5 với #978. Gỡ style trong bộ chụp làm ca guide đỏ. |
| T-344 | #980 → #981 | **ĐÃ SỬA** | **D.md:35** — `docs/user-guide/README.md:75` chỉ đúng `customer-forms.html` 5d–5e, git diff của #981 chỉ một hàng. Mockup vẽ hộp cho KH mở và KH đã đóng. | **D** — Hai ca đổi nhóm tay và mở lại KH đã đóng về N3 của `customer-forms` chạy xanh. Issue tài liệu. |
| T-345 | #983 → #984 | **ĐÃ SỬA** | **F §2** — Edge không ghim ngày, dữ liệu tải, 11/2026 → 10/2026, 1 kỳ, 10 ngày có Đã gặp. Giới hạn 0 thay 12 làm đỏ ngay với 0 ngày ở 11/2026. | **F** — Số đo exe chuẩn bị cũng dùng tháng 10. Chốt kiểm chạy ngoài phần bấm tính giờ. |
| T-346 | #986 → #988 | **SỬA MỘT PHẦN** | **F §2** — Đổi đồng hồ trình duyệt sang 05/01/2027: lùi 1 kỳ về 2026 với 79 dòng. Đổi giới hạn 1 thành 0 làm ca đỏ với 0 lịch ở 2027, báo đúng PERF_RUNS và bước README. `checkPeriods` nằm trước vòng import. | **F** — CXR5-F2: phép đếm dòng bằng cả nội dung hàng nhận chữ Đã gặp từ tên KH. Khi gặp dữ liệu như F05, đầu vào có thể bị tính là đủ sai. |
| T-347 | #990 → #992 | **ĐÃ SỬA** | **F §2** — Một helper `metRows` dùng ở hai nơi. Chủ động lùi sai tháng trước `metDays` làm ca nhận lỗi đúng. Bỏ guard, hàm trả tháng 10 với `0 back` và assertion đỏ. | **F** — Kiểm sửa chia sẻ locator và chốt tháng. Locator chọn lịch theo cả dòng đã có ở lượt 4. T-346 dùng thêm phép lọc đó để đếm mẫu. T-347 dùng chung helper, xem CXR5-F2. Ca benchmark toàn exe lấy từ baseline và #992; Edge chỉ đối chứng chọn kỳ. |
| T-348 | #994 → #995 | **ĐÃ SỬA** | **F §2** — `docs-audit.json`: 35 dòng probe G7; đọc các trị số LCP 3.420 ms, mở lại 617 ms, Dọn sạch 130,5 ms và exe 5.649.408 B. Hash tables, số bản ghi, kỳ Tháng/Năm và L1 khớp output lưu ở #995. | **F** — So ba mốc ở §6. Dữ liệu G7 và lượt 5 cùng hash tables. |
| T-349 | #997 → #999 | **ĐÃ SỬA** | **F §2** — `nghiem-thu-v1.md`, NT-HN-01: đoạn L1 giữ kết quả bằng chữ và trỏ mục G7. `phase-6.md:249` ghi rõ bước 3 mở lại là bước thêm so lượt 4. | **F** — Đối chiếu mốc lượt 4 chỉ có bốn việc; không lấy lần mở lại G7 làm số đo lượt 4. |
| T-350 | #1001 → #1011 | **ĐÃ SỬA** | **E.md:31** — Đổi hai chỗ `statusLabel(row, today)` về nhãn enum cũ làm 5/86 test `trash-view` đỏ, gồm tiêu đề, tên nút, hộp và chuỗi khôi phục. E04 qua nửa đêm, kiểm ô Bản ghi, tên trợ năng, hộp Không đổi nhóm KH, đếm trên lịch và chi tiết 6a sau khôi phục. Mockup `trash.html:192` khớp.<br>**A.md:25** — Phần A, `appointmentGroup` đọc trạng thái và ngày. M6 trả nhãn cũ ở Thùng rác làm đỏ 5/86. Edge thấy nhãn ở dòng, nút và hộp khôi phục; thao tác khôi phục thành công. Mockup 11a, `trash.html:192`, cùng chữ. | **E** — Unit kiểm cả hôm nay, ngày sau, có giờ / không giờ và trạng thái khác. Qua nửa đêm trước khi bấm Khôi phục, hộp đã mở cập nhật chữ cùng bảng.<br>**A** — N2 kiểm lịch con của chuỗi Dời lịch, hôm nay/kế tiếp/đã qua, có và không có giờ theo bộ test. Trước khôi phục tổng 1, sau khôi phục tổng 2 gồm một Dời lịch và một Chưa ghi kết quả. Lịch tháng, lịch năm, số theo góc nhìn/mốc khớp. |
| T-351 | #1002 → #1003 | **ĐÃ SỬA** | **F §2** — Đếm L2 qua 243 dòng NT, 222 ✅, 1 ⚠️, 1 ❌, 18 —. SHA `1ce3c61`, CI run 41666800294, dữ liệu và phạm vi khớp thân #1003. | **F** — NT-TR-07 được sửa về sau ở T-350 và L3; L2 giữ kết quả lịch sử. F02 đối chiếu hành vi hiện tại. |
| T-352 | #1004 → #1007 | **ĐÃ SỬA** | **F §2** — Đối chiếu mục Dữ liệu, sáu dòng cần Owner, chú giải ⚠️, NT-AI-03 và hai hàng bảng Cổng KYC. `docs-audit.mjs` xác nhận hàng conflict có liên kết, hàng insufficient không có; D N7 kiểm qua UI.<br>**D.md:36** — Kiểm mục Dữ liệu, sáu dòng Owner của L2, tổng kết L2, chú giải ⚠️, NT-AI-03, hình dạng cột và Prettier. N7 khớp hai hàng bảng cổng, chỉ mâu thuẫn có liên kết tới Dữ kiện. | **F** — Danh sách tám dòng được T-354 thêm NT-TR-12 thành chín; tổng L2 giữ nguyên.<br>**D** — NT-TR-12 bổ sung về sau ở T-354. Lịch sử kết quả L2 giữ nguyên. Issue tài liệu. |
| T-353 | #1005 → #1009 | **ĐÃ SỬA** | **E.md:32** — Issue tài liệu. `nghiem-thu-v1.md:134`, `:143` và `:397` có đủ dòng sửa, ghi chú L2 và lệch mockup 6b. E01 kiểm 2026 và biên 60/61 ngày năm 2027. E02/E03 kiểm câu đọc lại 6e, lịch cũ hôm nay vào lịch sử ngay, lịch tương lai vào lịch sử từ ngày đó. | **E** — Giữ kết quả và ghi chú L2. Gợi ý ngày nhuận được chạy bằng đồng hồ Playwright, bổ sung ca mà L3 ghi chưa thử được trên ngày máy năm 2026. |
| T-354 | #1012 → #1014 | **ĐÃ SỬA** | **F §2** — `nghiem-thu-v1.md:23,205,317`: NT-TR-12 có trong chuẩn bị, thao tác vẫn Ghi kết quả trên lịch đã qua, NT-AI-03 bỏ dấu chấm thừa sau ngoặc kép. | **F** — F02 tái hiện việc tạo lịch qua ngày rồi mới Ghi kết quả. Câu dấu ở NT-KH-09/NT-CD-04 được xử lý sau tại T-355. |
| T-355 | #1017 → #1020 | **ĐÃ SỬA** | **F §2** — Đếm L3 38 ✅ và 1 ❌ NT-HD-01 (#1019). Bảng có ngày, máy, exe `3d237b0`, version, hash rút gọn, CI run 41765637293. Hai dòng NT-KH-09/NT-CD-04 đã chỉnh dấu. Diff ngoài tài liệu từ `3d237b0` rỗng. | **F** — Giữ lịch sử L2 và phần Owner. Đối chiếu cách mở màn lần cuối với T-356 (D N2). F không lặp các thao tác cần Owner, key thật hoặc máy khác. |
| T-356 | #1019 → #1023 | **ĐÃ SỬA** | **D.md:37** — Hai chương hướng dẫn, NT-TQ-01 và mốc L3 `331e7a0` khớp. E2E `navigation:63` mở lại màn trước trong cùng profile. N2 còn nhớ đúng tiểu mục Thùng rác. | **D** — Hash lưu chứa UTF-8 hỏng → Tổng quan. Hash hợp lệ chỉ rõ tiểu mục thắng tuyến đã lưu. Phần dùng chung profile WebView2 đối chiếu với cấu hình và ghi chú nghiệm thu, phép thử mới chạy Edge. Issue tài liệu. |

Đếm R1 23 ĐÃ SỬA, 2 SỬA MỘT PHẦN. R2 23 ĐÃ SỬA, 5 SỬA MỘT PHẦN. Không có dòng CHƯA SỬA hoặc HỒI QUY. Các dòng còn thiếu là DR6-139, DR6-145, T-330, T-336, T-338, T-339, T-346.

## 3. Phạm vi đã đọc

- SHA ghim `37a80b6`. Danh sách file và khoảng dòng phân theo sản phẩm, test và file sinh ở `F/scope.json` (100 file theo classifier). Đối chiếu `F/diff-F.patch` với `git diff 2e51e25..37a80b6`. Toàn repo ngoài tài liệu có 93 file đổi, +5.761 / −1.533. F có +460 / −14 ở sản phẩm, +1.597 / −30 ở test theo bộ phân loại.
- Đọc sâu các vùng đổi: `tools/auto-wait-core.mjs:1–265`, `tools/auto-wait.mjs:1–123`, test tương ứng, `pr-status.mjs:20–115`, `pr-core.mjs:40–70,128–170` và các ca file đổi tên, `notes-core.mjs:178–245`, `review-hint-core.mjs:1–46`, `size-report-core.mjs:98–193`, các ca của chúng, `.dependency-cruiser.cjs`, `.claude/skills/auto-issues/SKILL.md`, `e2e/guide/{shots.guide.ts,check.guide.ts,links.ts}`, `e2e/perf/{README.md,probe.perf.ts,stats.ts,stats.spec.ts}`, các nhánh mới của e2e lịch hẹn, tên dài, theme, focus, lưu và Thùng rác. Kiểm đường nối qua AppData, đội/RE/KH, KYC, lịch hẹn, backup, hàng đợi lưu và chỉ số.
- Đối chiếu `CLAUDE.md`, `CONTEXT.md`, spec Phase 6 §4–5, metrics, ADR-0001 M11, ADR-0006, ADR-0016, nghiệm thu và mockup liên quan. Đọc bốn tổng hợp lượt 1–4 và các báo cáo gốc ở bốn thư mục ngày trong repo theo mã và các bảng kịch bản, tập trung gói F và phần giao A–E. Đối chiếu §L5 của plan, common/known, fixes và baseline. Rà lại cấu hình gốc, workflow và hook, các lệnh công cụ còn lại theo giao diện, cổng, ca test và diff. Phần test cũ không đổi được rà theo ca/hợp đồng và kết quả chạy, chưa đọc lại từng dòng của toàn bộ e2e cũ.

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| F01 | Tạo KH → thêm dữ kiện đủ cổng → ghi chú dài 19.250 ký tự, câu sau dấu • → Mock trích xuất → xác nhận → phân tích → xóa KH → Thùng rác → khôi phục | Còn ghi chú, Số con 1 và phân tích CURRENT sau khôi phục. | CXR5-F3 (đối chiếu tài liệu) |
| F02 | Đặt lịch tương lai → qua ngày → xóa → Thùng rác → khôi phục → ghi kết quả giữ N4 → danh sách lịch | Trước xóa là Chưa ghi kết quả. Dòng Thùng rác cùng nhãn. Sau khôi phục có thể ghi kết quả, bảng lịch ghi Đã gặp. | — |
| F03 | Xuất backup → lỗi lưu khi thêm team → nhập bị từ chối → Thử lại → nhập với backup bị giữ → yêu cầu đóng → thả backup | Khi đang giữ chưa destroy. Chuỗi cuối `backup, save, destroy`. Dùng seam exe của repo trên Edge. | — |
| F04 | Bản xuất native từ exe lượt 4 → nhập bằng màn Dữ liệu của bản web ghim → xuất lại → so tables | Tệp 10.936.651 B, mọi bảng trùng. Dùng tệp do gói A tạo từ exe lượt 4 dựng lại. A N6 đã thử thêm đường nhập bằng exe thật cùng code L3. | — |
| F05 | Tạo KH có “Đã gặp” trong tên → tạo lịch tương lai → xem bảng ngày → chạy locator của probe → kiểm nút hẹn tiếp | Dòng trạng thái Dự kiến bị locator `metRows` nhận. Chi tiết lịch tương lai không có nút Tạo lịch hẹn tiếp theo. | CXR5-F2 |
| F06 | Bản xuất sạch native lượt 4 → chép và thay ghi chú lịch dời bằng U+200B U+0085 U+200B → nhập → đóng 10b → kiểm nội dung đang có | Hộp từ chối đúng K1 và số bản ghi trước/sau không đổi. Đối chứng sạch F04 qua trên cùng ngày của app. | CLR4-F2, dòng R1 |
| F07 | Rollup xanh cũ → đóng/mở PR giả lập → run cùng SHA khác sự kiện hoặc run mới bị hủy → chờ CI; biến thể ba lần lỗi mạng | Cả hai biến thể run đều ra exit 0. Ba lỗi mạng xen trạng thái pending vẫn thử lại, 5 lần đọc và 4 khoảng 30 s. | CXR5-F1 |
| F08 | Nhập dữ liệu tải → chọn kỳ Tháng 11/2026 → lùi về 10/2026 → mô phỏng qua năm 2027 → kiểm kỳ Năm → chủ động xuất phát sai tháng | 10 ngày Đã gặp ở tháng 10, năm 2026 có 79 dòng khi lùi từ 2027, sai tháng bị chặn. Ba đột biến làm đỏ ca đối chứng. | — |

## 5. Phát hiện mới

### CXR5-F1 — Chờ reopen có thể báo CI xanh theo check cũ

- ID: CXR5-F1
- Mức: Low
- Trục: R
- Vị trí: `tools/auto-wait.mjs:48–54,77`, `tools/auto-wait-core.mjs:129–149` (37a80b6).
- Tình trạng: CONFIRMED, qua phản hồi API giả lập.
- Liên quan: T-338, mới do #954 sau lượt 4.
- Kịch bản: F07.
- Mô tả: `--since` chỉ cần một workflow run có giờ tạo đủ mới cho cùng SHA. Kết quả xanh lại lấy từ rollup có thể còn là check cũ, vì code không nối run với PR, sự kiện hoặc kết luận của chính lượt vừa mở lại.
- Tái hiện / bằng chứng: `node F/tool-variants.mjs`, log `tool-variants.log`. Chỉ run cũ → `done:false`. Thêm run `workflow_dispatch` đã xong hoặc một run đúng PR đã kết thúc `cancelled` → cả hai `{"done":true,"code":0,"text":"CI green @abc1234: 1 pass"}`. Run đúng PR còn chạy → tiếp tục chờ.
- Ảnh hưởng: phiên điều phối có thể bước sang review sớm khi mở lại PR để dựng exe. Cổng merge còn kiểm thêm check và base theo quy tắc riêng, nên probe này chỉ chứng minh báo xanh sớm.
- Đề xuất: xác định run CI của đúng PR và sự kiện reopen rồi đối chiếu trạng thái, kết luận và các check của run đó. Giữ nhánh docs-only. Dưới 400 dòng SP.

### CXR5-F2 — Probe kỳ Năm đếm một lịch Dự kiến là Đã gặp nếu tên KH chứa cụm đó

- ID: CXR5-F2
- Mức: Low
- Trục: R
- Vị trí: `e2e/perf/probe.perf.ts:207,287,556–558` (37a80b6).
- Tình trạng: CONFIRMED.
- Liên quan: T-346 (#988) thêm phép đếm dùng lại mẫu đã dùng để chọn dòng ở lượt 4. T-347 (#992) gom hai nơi gọi chung một helper.
- Kịch bản: F05.
- Mô tả: `metRows` tìm “Đã gặp” trên cả dòng, gồm tên KH và các cột chữ khác. Cả phép đếm kỳ Năm lẫn thao tác chọn dòng thứ i dùng tập kết quả đó.
- Tái hiện / bằng chứng: `node node_modules/@playwright/test/cli.js test --project=edge --no-deps e2e/review-f.spec.ts -g F05` trong bản chép. `cross-final.log` ghi `16/09/2026 … Khách Đã gặp Gói F … Dự kiến` được locator chọn. Chi tiết đúng lịch đó có 0 nút Tạo lịch hẹn tiếp theo.
- Ảnh hưởng: probe có thể chọn sai năm đủ mẫu, đo sai kịch bản hoặc dừng chờ nút khi dữ liệu có chữ trùng ở ngoài cột trạng thái. Bảng baseline trên dữ liệu tải chung đã chạy hết.
- Đề xuất: lọc ô trạng thái bằng selector của cột và tên chính xác, thêm đối chứng chữ trùng trong tên KH. Dưới 400 dòng SP.

### CXR5-F3 — Ghi chú NT-AI-17 thu hẹp sai phạm vi Mock trích xuất

- ID: CXR5-F3
- Mức: Nit
- Trục: C
- Vị trí: `docs/testing/nghiem-thu-v1.md:219` (37a80b6).
- Tình trạng: CONFIRMED.
- Liên quan: ghi chú cũ còn sau T-330/T-336 (#939, #956).
- Kịch bản: F01.
- Mô tả: Cột Ghi chú vẫn ghi Mock “chỉ nhận” ba dạng cụm cũ. Spec Phase 5 §10 có thêm Ly hôn, Góa, Ly thân và trường hợp mất con.
- Tái hiện / bằng chứng: `node node_modules/@playwright/test/cli.js test --project=edge --no-deps e2e/review-f.spec.ts -g F01`, `cross-final.log`: “KH có 2 con. • Một con đã mất.” qua lưu ghi chú và xác nhận cho Số con 1. Gói C §4 cũng chạy ca Ly hôn trên Edge.
- Ảnh hưởng: người nghiệm thu đọc phạm vi sai ở cột Ghi chú. Kết quả mong đợi của ví dụ NT-AI-17 vẫn khớp.
- Đề xuất: trỏ §10 hoặc cập nhật ngắn phạm vi ở cột Ghi chú. Một dòng tài liệu.

## 6. Bloat và Hiệu năng

### Bloat

| Đã chạy hoặc đối chiếu | Dữ liệu | Số và so mốc | ID |
|---|---|---|---|
| TypeScript `--noUnusedLocals --noUnusedParameters` | 5 tsconfig app/package và e2e | 6/6 sạch, log unused theo từng vùng. `node tools/codemap.mjs --check` sạch. | — |
| Depcruise, token guard, đối chiếu export | Toàn app và packages | 354 module, 1.582 cạnh, 0 lỗi (lượt 4: 341 / 1.435). Token guard xanh. Lỗ test-support xem CXR5-C3. | CXR5-C3 |
| Cỡ nguồn | Tệp tracked, classifier hiện tại | F 4.886 SP / 18.427 test / 4.628 sinh, 100 file. So lượt 4 +446 SP / +1.567 test / 0 sinh / +4 file. Toàn repo 39.077 SP / 55.828 test, +1.311 / +2.917. G7 39.055 SP / 55.734 test theo #995. | — |
| JS/CSS `size-report` sau build trực tiếp, không đặt neo demo | 5 mục bundle | 2.366.456 B thô / 699.761 B gzip. So lượt 4 +8.029 / +2.627 B. So G7 +7 B thô (2.366.449 B ở #995). So `b139d8a` +2.173 / +2.690 B. `index.js` 892.184 B, +7.486 B so lượt 4, +7 B so G7. Chart và Excel không tăng. | — |
| Asset web | 19 file, kiểm thêm file giả sqlite | 1.022.121 B, bằng lượt 4 và G7. +172.925 B so `b139d8a`, đã giải thích ở metrics bởi font và tài sản logo. | DR6-157, R1 |
| Exe release đã dựng ở bước chuẩn bị | `common/exe/project2c.exe`, hash đã kiểm | 5.649.408 B, bằng lượt 4 và G7, +235.008 B so `b139d8a`. SHA-256 `167d4b3ba7cb2644e5544bcdf68300d293a4290fbbdf214fae971f37be75832a`. | — |
| Ảnh hướng dẫn | 28 PNG, chụp hai lần | 1.939.611 B, −2.635 B so bộ trước #978. Lớn nhất 141.536 B, trong ngưỡng 150 KiB/ảnh và 4 MiB cả bộ. | — |

Các delta tải chính sau lượt 4 tập trung ở index và CSS. Các module mới ở tools chạy ngoài app. Đã rà phần tách Mock và dùng chung listener, codemap, bộ lọc test-support, tài sản build và giới hạn cache tên. Chưa thấy bloat mới có chi phí vượt mức hoặc bằng chứng code chết phải báo riêng.

### Hiệu năng

Home PC DESKTOP-KDURKJP, Node v24.20.0. Dữ liệu `common/load/load-2026-10-12-seed6.p2cbackup` SHA-256 `b3c9903321abccdf3301818d35dad7d7c6eac48d73814286694b554c94c77293`. Phép sắp chạy riêng sau các ca chính, tiến trình quan sát được ghi ở `F/perf-processes.log` (Codex và Edge mở). Số exe dưới đây từ phép đo chuẩn bị ở đúng SHA, cùng máy, dữ liệu tải và probe. F chạy lại các đường chọn kỳ trên Edge để kiểm đúng hành vi, dùng kết quả exe chuẩn bị để so ngưỡng. Luật nhiễu >20% và >10 ms, bộ nhớ >5 MB.

| Thao tác và nguồn | Lượt 5 | Mốc sau #656 / G7 / lượt 4 | Ngưỡng, ID |
|---|---|---|---|
| Sắp 10.255 lịch theo KH, Node, 15 lượt xen kẽ | 11,21 ms (11,07–11,48), 1.269 lần tính khóa | Đối chứng collator 8,06 ms và số trước #828 9,4 ms / — / bản lượt 4 đo cùng lượt 63,52 ms và 246.782 lần tính khóa | Số hiện tại +3,15 ms so collator. DR6-136 ở R1. |
| Sắp 10.255 lịch theo RE và 1.496 tên KH, Node | 6,11 / 1,64 ms | Collator trần 5,03 / 1,03 ms / — / bản lượt 4 cùng probe 49,13 / 7,33 ms | Đúng thứ tự của bản cũ; trong luật nhiễu so collator. |
| `app.open-data` và `reload.appointments`, exe | 330 / 391 ms | 387 / 391 ms · 320 / 385 ms · 370 / 393 ms | ≤600 / <500 ms. |
| `backup.read` / `backup.import`, exe | 983 / 50 ms | 835 / 43 ms · 975 / 44 ms · 977 / 47 ms | ≤2.000 / ≤500 ms. Đọc +18% so #656. |
| `db.save` trên dữ liệu tải | 150 ms | 151 / 148 / 149 ms | ≤400 ms. |
| `appointments.next-month` / `next-year`, exe | 111 / 108 ms | 101 / 107 ms · 112 / 109 ms · 108 / 113 ms | ≤300 ms. Mẫu kỳ của lượt 4 khác, so tham khảo. |
| `customers.sort-name`, exe | 24 ms | 23 / 23 / 24 ms | <200 ms. |
| Dọn sạch 113 dòng → 11j, exe | 128,0 ms | — / 130,5 / 123,3 ms | ≤500 ms. |
| Dọn sạch trong Node, chuẩn bị, 113 / 1.313 dòng | 88,5 / 117,5 ms | — / — / 85,2 / 129,8 ms | 5 lần mỗi cỡ, cả hai trong ngưỡng. |
| JS heap sau đi hết màn, exe | 16,7 MB | 16,5 / 16,7 / 16,6 MB | ≤21 MB. |
| LCP mở lần đầu, exe (seed) | 3.535 ms | 3.663 / 3.420 / 3.521 ms | Trong luật nhiễu, dưới 4.724 ms của exe Phase 4. |
| LCP mở lại, exe (dữ liệu tải) | 710 ms | — / 617 / — ms | ≤1 s. +15% so G7. |

Bảng đầy đủ 35 thao tác ở `common/baseline.md` và `common/perf/perf-ref.json`. Không thao tác chính nào vượt ngưỡng hoặc vượt cả hai vế của luật nhiễu. Mốc phụ lưu file DB lần đầu trên **seed demo** là 150 ms so 119 / 123 / 119 ms, vượt luật nhiễu ở cả ba mốc. Tổng LCP vẫn đạt và lượt ghi trên dữ liệu tải là 150 ms so 151 / 148 / 149 ms. Ghi số phụ để theo dõi, không nâng thành phát hiện P trên dữ liệu tải.

## 7. Mức × trục của gói F

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| Nit | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

3 CONFIRMED. Không có PLAUSIBLE hoặc KNOWN mới riêng F. CXR5-C3 giữ ở gói C, chỉ dẫn lại ở bảng R2. Các bảng R gộp giữ nguyên phát hiện liên quan của từng gói.

## 8. Đã xét, không thấy thêm

| Trục | Đã chạy hoặc đọc |
|---|---|
| R | 5 dòng R1, 18 dòng R2 của F. Kiểm lại đúng các ca cũ, đột biến và biến thể ở §2 và §9. |
| E | F02 qua ngày, F03 lần lưu lỗi rồi thay/đóng, F04/F06 nhập hợp lệ và lỗi. Unit lệnh chờ đọc lỗi lẻ, lỗi liên tục, PR đổi tên và chờ job đến muộn. |
| C | Spec Phase 6 và K41–K47, so ảnh và chữ, số nghiệm thu, help của probe. Thêm một dòng tài liệu ở CXR5-F3. |
| D | F04 so toàn bảng qua xuất → nhập → xuất, F06 từ chối rồi kiểm nguyên dữ liệu, F01 kiểm ghi chú/dữ kiện/phân tích sau khôi phục. |
| G | Mock ở F01, xác nhận chủ động và phân tích CURRENT. Đối chiếu report C về @5 và việc tách adapter. |
| S | Không gọi dịch vụ AI. Edge chặn request ngoài localhost, stub window.open từ init script, đường lưu/thay qua seam. Đối chiếu ranh giới depcruise, cách chọn file PR đổi tên và cổng CI ghim SHA. |
| P | Đo sắp tên trên dữ liệu tải, đối chiếu 35 số exe, ngưỡng bộ nhớ, LCP và Dọn sạch. CXR5-F2 là cách chọn mẫu của công cụ, không phải số chậm của app. |
| B | Cỡ file/nguồn và các cổng ở §6. |
| T | 416 unit trên worktree, 79 ca e2e tập trung được đối chứng, 26 lượt test guide đối chứng, chuỗi xuyên gói và đột biến ở §9. |
| A | F02 kiểm tên nút Khôi phục theo vai trò, guide kiểm đầu/chân ảnh, đọc lại các ca focus lúc chạy và đối chiếu E/D. |

## 9. Phụ lục

| Nguồn hoặc log trong F/ | Kết quả |
|---|---|
| `setup.mjs`, `scope.json`, `diff-F.patch` | Chép 826 file tracked, nối thư viện sẵn có; chỉ sửa cấu hình bản chép. Cổng 4197–4200 riêng. Chạy CLI bằng Node. |
| `unit-repo.log`, `deps-repo.log`, `tokens.log`, `codemap.log` | 14 file / 416 test xanh. Bản chép không có .git làm ca liệt kê file ở pr-core đỏ khi chạy cả suite, nên lấy đối chứng unit ở worktree. Junction làm depcruise trên bản chép trỏ nhầm đường tương đối, phép kiểm đồ thị dùng worktree với cấu hình ngoài cho mutant. |
| `mutations.mjs`, `R155-rename.log`, `R156-glob.log`, `R157-assets.log`, `R333-glob.log` | Trả gốc bằng finally. Đột biến tên file đỏ tại đúng assertion Read 1/2, ngoài lỗi .git của harness. Ba đột biến còn lại đỏ 2/31, 1/75, 1/31. |
| `R335-late-job.log`, `R338-since.log`, `R338-hook.log`, `R342-jsx.log`, `R336-R339-deps.log` | Lần lượt đỏ 2/40, 1/40, 2/9, 3/28 và đúng 1 cạnh từ test-support tới vitest. |
| `guide-first.log`, `guide-second.log`, `guide-summary.json`, `R155-guide.log` | Hai lượt 13/13. Bỏ style làm đỏ tại chân ảnh. So hash ảnh chỉ chạy trên bản chép. |
| `cross.spec.ts`, `cross-final.log`, `cross-r4.log` | F01/F02/F03/F05 qua ở log thứ nhất. F04/F06 qua ở log thứ hai với đồng hồ được đổi sau khi app đã mở, để ngày app đúng với dữ liệu native. Probe ban đầu vướng locator nút Cài đặt, chọn kỳ và radio bắt buộc; đã sửa harness. |
| `perf-periods-live.mjs`, `perf-periods-live.log`, `R345-zero-month.log`, `R346-year-live.log`, `R347-guard-live.log` | 3/3 Edge không ghim ngày, mỗi đột biến làm một ca tương ứng đỏ. Chạy bản ghim ngày trước đó không dùng làm bằng chứng do lệch ngày app và ngày file tải. |
| `tool-variants.mjs`, `tool-variants.log`, `docs-audit.mjs`, `docs-audit.json` | CI giả lập, glob, asset, đối chiếu số PR và dòng nghiệm thu. T-348/L2/L3 đối chiếu tài liệu và log trong nguồn đã cấp, cùng phép thử đại diện, không chạy lại toàn bộ nghiệm thu. |
| `byname.mjs`, `byname.json`, `R136-cache.log`, `perf-processes.log` | 15 mẫu mỗi bộ so. Đột biến thay bằng bộ so lượt 4 đỏ 246.782 ≠ 1.269. CXR5-A3 giữ riêng vì test unit của repo chưa bắt được chi phí đó. |
| `focused-e2e.log`, `theme-host.log` | Bộ 79 ca gốc chạy trên bản chép: 77 qua, 2 ca theme mong hostname localhost trong khi harness dùng 127.0.0.1. Chạy lại đúng hai ca với hostname của harness, 2/2 qua. Gồm full-cycle, appointment-outcome, dialog-keyboard, long-names, save-state, theme, trash và perf/stats. |

Corepack thử tìm pnpm ghim nhưng DNS sandbox từ chối. Dùng toolchain có sẵn qua Node, không cài thêm. `common/baseline.md` ghi cổng chuẩn bị đầy đủ 4.387 unit, 120 Rust và 324 e2e. Phiên F dùng các phép kiểm tập trung và số chuẩn bị cho cổng toàn bộ, không tính chúng thành lần tự chạy mới.

### Kết luận phát hành

**CHƯA SẴN SÀNG cho v1.0 ở SHA `37a80b6`.** Áp K47, Owner yêu cầu xử lý hết phát hiện rồi G7. Bảng R1 còn DR6-139 và DR6-145 sửa một phần. Bảng R2 còn T-330, T-336, T-338, T-339 và T-346 sửa một phần. Gói F có hai phát hiện Low và một Nit đã tái hiện. Các ngưỡng trên dữ liệu tải đạt theo số bước chuẩn bị và các đối chứng đã nêu.

### Trạng thái cuối phiên

- SHA cuối `37a80b662861d308a110d1e2b0f65ad13b91fb51`.
- `git status --short` rỗng như đầu phiên, `git diff --check` exit 0.
- Giờ xong 2026-11-05 00:46:52 +07:00. Các server loopback riêng của gói đã dừng.
