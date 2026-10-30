XONG — codex gói F lượt 4, 2026-10-29 21:28:05 +07:00

## 1. Thông tin phiên

- Bên: Codex; gói F — Xuyên gói, bloat / hiệu năng, công cụ; phiên mới.
- SHA đầu phiên: `2e51e25eb0125f56d3d938b97ef18d6873dae076` (đúng mốc).
- `git status --short` đầu phiên: rỗng.
- Bắt đầu: 2026-10-29 20:37:07 +07:00 (Asia/Bangkok).
- Công cụ: Codex desktop; `codex --version` trả `codex-cli 0.162.1` (kèm cảnh báo không tạo PATH alias / dọn arg0 vì Access denied).
- Model: runtime hệ thống ghi GPT-6; công cụ không công bố model ID cụ thể hay mức suy luận. Không tự suy diễn tên Sol 6.1 hoặc mức suy luận từ kế hoạch.
- Giới hạn: chỉ đọc repo, probe trong thư mục kết quả Codex; không gọi AI thật, không dùng gh, không đọc vùng báo cáo bị cấm.

## 2. Bảng R1 và R2

ĐÃ SỬA áp cho mô tả gốc/mục tiêu đã duyệt; biến thể và lỗ kiểm mới ghi riêng. Gộp chỉ báo cáo A–E của chính Codex, không báo cáo lượt4 bên khác. Test/gate bổ sung của reviewer được gọi đúng tên, không nhận là test do PR đã có.

### 2.1 R1 riêng F — 6 dòng

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-129 | #719 → #736; #772 → #792; #793 → #815 | ĐÃ SỬA | Control fixture/full-cycle; bỏ clock: test đỏ với chênh 3.842.499.461 ms. Bỏ zone, tính giao thừa từ 09:30 và bỏ lint import động đều đỏ. e2e-final.log 11/11. | Honolulu, UTC+14, +11 phút → reload → trang mới; guide callback Honolulu. Không chỉnh đồng hồ Windows hay giả nhận đã chạy lúc nửa đêm máy. |
| DR6-130 | #719 → #736 | ĐÃ SỬA | R130-folder / brace / separator: mỗi mẫu 1/28 test đỏ; control notes-core 28/28 trong unit-final. Tái hiện T61f/T61k đúng như lượt 3. | U+2028/2029 giữ dòng, brace nhiều nhóm mở đủ. Biến thể glob ở cấp package là F1 riêng. |
| DR6-25 | #781 → #830; #831 → #837 | ĐÃ SỬA — phần bundle | Baseline không biến riêng: index.js 884.698 B, giảm 43.234 B so R3; #830 riêng giảm 62.735 B min. A/C đã so kết quả mini/full và gỡ import làm lint đỏ; F T304-lint bỏ luật → 1/78 đỏ. | Không gán toàn bộ giảm index.js cho zod. Font/logo/favicon/icon tách tại mục 6. |
| DR6-66 | #655 → #693; #775 → #801; #777 → #812; #790 → #845 | ĐÃ SỬA — toàn phạm vi các mục đã liệt kê | Năm tsc noUnused exit0, codemap --check exit0; A/C/D/E ghi rõ mutant export/helper bị codemap hoặc tsc giết. API PersistQueue không còn unsaved; markName/ConfirmProposal/TokenReader/ShowMoreFoot/TokenViolation/PLAIN_SLOTS không còn export bị nêu. | Không suy từ noUnused rằng đã chứng minh mọi export không có caller của toàn thế giới là cần thiết. |
| DR6-67 | #774/#775/#777/#782/#790 → #799/#801/#812/#807/#845 | ĐÃ SỬA | Class CARD/ALERT/LINK/HEADING/BADGE một nơi ở classes.ts; 17 cột báo cáo một nơi; hàm dùng chung domain/db/AI/Rust có mutant hành vi trong A–E. F scan 189 file: 0 nhóm thân hàm y hệt ≥3 nơi, tối thiểu120 ký tự. | Scan chính xác sau bỏ comment/whitespace, không phải detector clone ngữ nghĩa. Refactor tương đương không buộc runtime test phải đỏ. |
| CL3-A29 | #722 → #742; #776 → #805 | ĐÃ SỬA | Gỡ nhánh rác trống → 1 test gốc đỏ; bỏ0012 → 1 test lookup gốc đỏ. listTrash mới/cũ trên cùng handle:18,927/20,636 ms; bỏ index:25,247 ms;113 dòng và purgePlan deepEqual. | Đủ cả hai phần theo T311; 5 lần dọn ở113/1.313 dòng không hồi quy qua hai mốc nhiễu. |

### 2.2 R2 riêng F — 14 dòng

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-283 | #772 → #792 | ĐÃ SỬA — phần F | Helper chung dùng lại; fixture, seed sẵn/seed lại và perf/stats 11/11;5f kiểm RF/KYC chính xác xanh. T283-zone/eve/tested/renamed-data đỏ đúng assertion; lint fixture xanh. | Link span nhiều backtick, base=0 → không Infinity. Mẫu renamed đầu chỉ đụng giao thức mock, loại khỏi chứng minh hành vi; mẫu renamed-data giữ query mock và làm1/10 đỏ. |
| T-287 | #776 → #805 | ĐÃ SỬA — phần đo | CL3-A29 đo cặp, gỡ index và early-return đều có test gốc đỏ;113/1.313 dòng dọn, cùng plan/kết quả. | Phần person references, seed, RF trong A/D; F không chấm thay bằng đo đơn lẻ. |
| T-292 | #781 → #830 | ĐÃ SỬA — phần bundle | DR6-25; thống kê baseline và phần A/C mini/full. Bỏ luật chặn classic trong bản chép làm test gốc đỏ. | Gói dependency không đổi; K38 cho chữ lỗi mặc định khác. |
| T-300 | #789 → #843 | ĐÃ SỬA — phần tooling | CLI token guard exit0; T300-flex cho flex:1 lọt →1/16 test đỏ. tsc/codemap/deps sạch. | D kiểm màu/field/table/focus; F không nhận đã đo lại UI tương phản. |
| T-301 | #790 → #845/#846 | ĐÃ SỬA — phần tooling/toàn repo | T301-mark bỏ chặn dấu →1/16 đỏ; tsc năm vùng, class chung/17 cột/API đã đọc. A/E đối chứng dữ liệu/refactor; F N1–N5 giữ tables/report khi thay, lỗi và dọn. | Phép kiểm cấu trúc tách khỏi behavioral mutation. Không báo logo copy ACCEPTED thành bloat. |
| T-302 | #793 → #815 | ĐÃ SỬA | Bỏ dynamic-import rule → e2e lint đỏ (expected1/received0); trả parser docsRead về cách đọc ngoặc cũ →2/78 unit đỏ. | Spec/helper, quote/backtick, TS import type, module khác qua đúng luật. Hai giới hạn docsRead của K/ACCEPTED giữ nguyên. |
| T-304 | #831 → #837 | ĐÃ SỬA — phần lint | Bỏ paths:zod →1/78 unit đỏ; control78 xanh. static/type/re-export/full subpath bị chặn; mini qua. | Default arrays/detailV1 được C kiểm. Dynamic import và Zod/ZOD không thêm vào phạm vi; K38/ACCEPTED. |
| T-305 | #849 → #855 | ĐÃ SỬA — phần guide | Chạy nguyên callback beforeEach của guide tại Honolulu: control xanh; đổi anchorMorning(timezoneId) về ANCHOR_MORNING → reviewer test đỏ. guide13/13,28 PNG tái sinh trùng từng byte. | Log probe đầu ReferenceError do eval/import của reviewer, đã sửa truyền dependency rõ và chạy lại; không tính làm lỗi sản phẩm. Class/recordBadge/WEB_MODE phần D/E. |
| T-307 | #851 → #859 | ĐÃ SỬA — tài liệu/số đo | metrics-audit:241 PR/87 code,19 vượt;19/19 số SP/tổng khớp phase-6.md.15 chính+4 biên. integrity_check14,1/20,0/25,4 MB và366/453/546 ms khớp nguồn R3. | Dùng lịch sử Git first-parent cục bộ, không gh. Dòng review đóng phase có hai đợt sửa; chỉ tài liệu, không mutant sản phẩm. |
| T-310 | #865 → #871 | ĐÃ SỬA — phần classifier | Bỏ pattern classes/money-view →3/74 test đỏ; control74 xanh. scope không còn file chưa xếp gói;96 F, D87/E52. | Tên/logo/lang/stageBadge/HEADING có kiểm B/D/E; ảnh logo trùng là ACCEPTED. |
| T-311 | #866 → #870 | ĐÃ SỬA — phần F tài liệu | phase-6.md:239 có playwright*.config.ts/vitest.config.ts, :234 nói base.sha; đếm lại #709/#845 khớp860/1103. CL3-A29 gồm cả early-return và0012. K21/K31, chữ4 lượt có trong common/plan hiện tại. | Đối chiếu .brand→NT-CH-09 được D kiểm. Phần quy trình không chạy nghi thức, không ghi lại thành phát hiện. |
| T-312 | #867 → #882 | ĐÃ SỬA — code và ảnh; còn lỗ kiểm mới F2 | Guide gốc13/13;28 ảnh đúng từng byte ảnh commit, tổng1.942.246 B,max141.536 B. Bỏ style:13/13 vẫn xanh, ảnh KYC hụt chân8 hàng. Kiểm ảnh bổ sung của reviewer:control exit0/mutant exit1. | Ghi rõ test PR chưa giết mutant này → CXR4-F2. Kết luận đường lỗi ảnh hiện đã sửa; không dùng checker của reviewer để nhận PR đã có test hồi quy. |
| T-314 | #876 → #878 | ĐÃ SỬA — chỉ phần e2e | customer-ai.spec.ts:312 chờ heading Cài đặt trước goBack để thật sự unmount. Ca chạy3/3 không retry, IPC AI giả, không mạng. Gỡ await chờ heading:3/3 đỏ vì alert còn; control sau hoàn nguyên xanh (T314-no-wait.log,T314-final-control.log). | Đây là sửa chính test; đã gỡ và tái hiện cả3 lượt với server READY. phần kế hoạch/dot2 là quy trình, ngoài R2 sản phẩm. |
| T-316 | #884 → #888 | ĐÃ SỬA — chỉ phần guide | Nguyên helper nguồn trích ra: scroll3312px → clip vẫn{x232,y0,width1208,height4212}. Bỏ scroll trước boundingBox → reviewer e2e đỏ; control cuối xanh. | Hai callsite guide gốc hiện không làm lộ lỗi: một goto mới, một height600; dùng probe có cuộn thật để kiểm. Phần Memory/ACL/dot2 là quy trình. |

### 2.3 R1 gộp — đủ 37 dòng

Nguồn: A–E §2 và §2.1 trên. DR6-132 gộp cả (a)/(b); DR6-69 nằm trong105, không thêm dòng thứ38.

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-104 | #720 → #740 (+ TR-3 #850 → #857) | ĐÃ SỬA | **A**: E7 trước/cùng/sau ngày; baseline trash; M01 đỏ 3/5 ca E7. | **A**: Mốc trước ngày vẫn được; N05 không làm đổi luật E7. |
| DR6-105 | #720 → #740 (+ #781 → #830) | ĐÃ SỬA | **A**: M02 bỏ precision: 3 → 3 test backup đỏ; N06: 5 dạng sai bị từ chối, đúng .000Z được nhận. | **A**: Đóng cả ghép mốc rút và thứ tự Thùng rác bằng từ chối dạng khác app ghi. |
| DR6-106 | #720 → #740 | ĐÃ SỬA | **A**: Hai test TR-3 trong baseline xanh; M03 bỏ thứ tự seq → 4 test đỏ. | **A**: TR-3 có câu giữ chỗ seq; khôi phục theo thứ tự ghi được, ngược thứ tự bị chặn. |
| DR6-107 | #721 → #738 | ĐÃ SỬA | **A**: M04 bỏ chặn BOM đầu → 5 test backup đỏ; N03 raw FEFF được xử lý và roundtrip. | **A**: BOM giữa chuỗi tùy chọn vẫn giữ khi có chữ (N02); nhánh model là phát hiện riêng A1. |
| DR6-108 | #721 → #738 | ĐÃ SỬA | **A**: M05 bỏ thay surrogate → 1 test raw đỏ; N03 đọc x�đuôi, xuất/nhập nguyên byte.<br>**C**: Qua openAppData → analyseCustomer → recordAiAnalysis: raw nửa surrogate + NUL + đuôi + emoji đọc lại đúng `�đuôi�sau😀`, xuất / đọc backup lại được. M108 gỡ sửa surrogate → **1/23 test đỏ**. | **A**: Kiểm cả nửa cao/thấp và biên dài trong bộ ai-analyses; nhãn model không thuộc raw_output.<br>**C**: Đuôi không mất; cặp emoji không bị cắt đôi. |
| DR6-109 | #721 → #738 | ĐÃ SỬA | **D**: CustomerDialogs gửi tên gốc, KycDialogs gửi ghi chú gốc tới lớp lệnh; ca “broken in a paste” của customer-forms/customer-kyc qua. R109-name/R109-note chuẩn hóa trước lệnh làm e2e đỏ. | **D**: N5 thử BOM+VT/FF và tiền chứa ký tự vô hình. Không nuốt đầu vào lỗi trước kiểm của lệnh. |
| DR6-110 | #721 → #738 | ĐÃ SỬA | **A**: M06 bỏ normalizeText tiền → 14 đỏ; M07 ngày → 6 đỏ.<br>**D**: birthYear trong customers-view dùng normalizeText; control25 test qua, R110-birth làm2 test đỏ. Domain money/period và nhập ngày/tiền UI qua.<br>**E**: U110-money bỏ normalizeText: 11/155 test parser đỏ; U110-date: 6/160 đỏ. Đối chứng cuối 647/647 unit xanh, gồm 14 file E + hai parser. | **A**: Tiền/ngày dán chữ vô hình, White_Space, NFC; N09 biên năm mới.<br>**D**: N5: `1tr\u200b5` gợi ý1.500.000₫, lưu1tr5. Parser cùng kiểm A, màn lịch E.<br>**E**: readCaseSize/readFyp/readScheduleDate nối đúng parser chung; khoảng trắng Unicode, ký tự vô hình, NFD có test gốc. |
| DR6-111 | #721 → #738 (+ G5 §7 #728 → #762) | ĐÃ SỬA | **A**: M08 bỏ Cc khỏi INVISIBLE → 3 test text đỏ; baseline common/KYC xanh.<br>**C**: R111 quét **58** C0/C1 không phải White_Space/NUL chen trong cụm: đều bị V3 chặn. M111domain bỏ luật Cc → **3/24 test đỏ**. | **A**: NUL vẫn từ chối trước chuẩn hóa; N02 phân biệt NEL/VT/FF có chữ thật.<br>**C**: M111 chạy riêng validator-blocklists xanh; cùng đột biến bị bộ text dùng chung bắt. Không ghi thành lỗ test. |
| DR6-112 | #721 → #738 (+ luật 6 #780 → #828) | ĐÃ SỬA | **A**: M09 bỏ phân xử code unit → 3 đỏ; M25 bỏ đổi chữ số → 2 đỏ. | **A**: N08: 500.000 bộ ba trên 700 tên có số astral/NFD/dấu nối, 0 chu trình phát hiện. |
| DR6-113 | #722 → #742 (+ #776 → #805) | ĐÃ SỬA | **A**: M10 tắt recursive_triggers → test REPLACE đỏ; baseline kiểm trước/sau export. | **A**: D11 kiểm cả KH sống và KH đã xóa; N05 dọn/nhập lại được. |
| DR6-114 | #722 → #742, #776 → #805 | ĐÃ SỬA | **A**: M11 bỏ reviewer khỏi danh sách → 4/5 test person-references đỏ; baseline đủ năm kind. | **A**: POINTS_TO dùng chung cho ownsRecords và luật 5; KEPT_PEOPLE không có nhánh reviewer viết riêng. |
| DR6-115 | #723 → #744 (+ #788 → #841) | ĐÃ SỬA | **D**: Câu9b chỉ nói chuyển lịch Dự kiến sau khôi phục; team-view control13 qua. R115-trash khôi phục câu quá rộng làm3 test đỏ. | **D**: N3: bốn KH xóa có lịch vẫn giữ RE; câu đúng, ba tên có mã và1KH khác. |
| DR6-116 | #723 → #744 (+ #788 → #841) | ĐÃ SỬA | **D**: DialogFocusFallback tìm tiêu đề thẻ còn tồn tại; e2e DR6-116 qua. R116-fallback bỏ đích dự phòng làm3 ca đỏ. | **D**: N3: đổi RE sang IS làm hàng mất, focus H2#team-members-title. Đổi team giữ sort, trở về100 hàng. |
| DR6-117 | #724 → #746 | ĐÃ SỬA | **D**: Tên KH81 chữ, nội dung thẻ Lịch hẹn, dữ kiện7a/7c/7d tại1100/1440 qua. R117-name làm Sửa hồ sơ vượt1100; R117-dialogs làm7a tràn161,015625px. | **D**: N1: tiêu đề chung Dialog còn tràn, **CXR4-D1**. N2: màn Team ngoài mô tả cũ, **CXR4-D2**. Không gọi biến thể ngoài mô tả là chưa sửa đường cũ. |
| DR6-118 | #724 → #746 | ĐÃ SỬA | **C**: Đúng test của PR `e2e/customer-ai-web.spec.ts:408` xanh; gỡ `wrap-anywhere` ở Item (M118) → đỏ **“panel scrolls sideways”, Expected false / Received true**. | **C**: Probe tải: 1100×700, 1280×720, 1440×900 đều **0 px** tràn trang / panel với text liền 290 chữ; test gốc còn kiểm email, F1/…/F20 và chi tiết lịch hẹn. |
| DR6-119 | #725 → #748 (+ #785 → #833) | ĐÃ SỬA | **E**: E2E hai HĐ cùng ngày khác FYP; hai HĐ cùng FYP khác trạng thái; tên khôi phục theo ô đều xanh. P119-FYP bỏ FYP của nút phát hành → e2e đỏ; U305-badge bỏ badge khỏi tên khôi phục → unit đỏ. | **E**: FYP dùng dạng đồng đầy đủ; trạng thái HĐ được nói cả ở tên Sửa; khớp recordBadge/recordTitle. |
| DR6-120 | #726 → #750, #752 → #764 (+ #782 → #807, #783 → #817) | ĐÃ SỬA | **B**: Rust storage 73/73. `R120-readonly` bỏ mapping READ_ONLY: 2 test đỏ; `R120-folder` bỏ FOLDER_READ_ONLY: 1 đỏ. Tái hiện cũ ACL cho đọc nhưng cấm thay và readonly giữa phiên qua test filesystem Windows thật; file cũ nguyên, bỏ quyền cấm thì lưu được. `saveFailure` và các câu UI qua unit/browser.<br>**D**: SaveWarning/CloseGuard phân biệt file/thư mục chỉ đọc, đầy ổ, lỗi khác; R120-cause làm2 unit đỏ. Save-state và startup error control qua. | **B**: Chương trình giữ file với share 0 / share đọc+ghi vẫn là lỗi Windows; chỉ cấm ghi nội dung nhưng vẫn cho rename thì không bị chặn nhầm. N1 đổi liên tiếp nguyên nhân lỗi, Thử lại cập nhật đúng câu; N7 đóng qua hai nguyên nhân rồi mở lại có dữ liệu mới nhất.<br>**D**: N7 đổi DISK_FULL→READ_ONLY→FOLDER_READ_ONLY rồi lưu được, giữ focus đã chuyển. Quyền file thật/Rust thuộc B. |
| DR6-121 | #727 → #753, #778 → #809, #777 → #812 | ĐÃ SỬA | **C**: **415 test Mock** nền xanh, gồm sáu dạng gốc và các ca T-289/T-288. Trả thuật toán về 119e2e4 (M121) → **142/415 đỏ**. | **C**: **5.672 ghi chú tải: 0 khác đề xuất** so thuật toán lượt 3. Phủ định bằng “là sai” ở vế sau là biến thể mới → CXR4-C1. |
| DR6-122 | #728 → #762, #766 | ĐÃ SỬA | **C**: R122 **15 biến thể** dấu lạc: V3/V6 chặn đúng; M122 giữ dấu lạc thay vì đọc thành cách → **16/227 đỏ**. | **C**: Dấu đứng trên nguyên âm không tự coi là dấu lạc; giới hạn đó theo G5 §12.8. |
| DR6-123 | #728 → #762, #766 | ĐÃ SỬA | **C**: R123 **16 ca** tin đầu / tin thử lại với tám dạng xuống dòng đều OWN_MESSAGE. Edge: VT/FF/NEL/LS/PS dán lại năm lần, **0 dòng phân tích**. M123 quay về CR/LF → **13/58 đỏ**. | **C**: Kiểm cả dấu `＞` toàn khổ trước dòng mốc; lần thử không bị tiêu hao. |
| DR6-124 | #728 → #762, #766 | ĐÃ SỬA | **C**: Sáu câu thường qua, sáu câu cần chặn bị chặn; bỏ danh sách đóng M124a → **8/227 đỏ**, gỡ miễn “giới” M124b → **2/227 đỏ**. | **C**: `quy/qui định Luật` vẫn V6; “định luật Pareto”, “giới luật Phật giáo” qua. |
| DR6-125 | #722 → #742 | ĐÃ SỬA | **A**: M12 bỏ đệ quy: 2 đỏ; M31 D3: 1; M32 D11: 1; M33 firstOfEach: 1; M13/M34 SYSTEM: mỗi mutant 1 đỏ. | **A**: Test baseline đủ tập giữ nhiều tầng, D3, D11 và đếm SYSTEM; đã thử mẫu đột biến chính, không tuyên bố mutation coverage toàn bộ. |
| DR6-126 | #720 → #740 (a, b, d), #721 → #738 (e, f), #722 → #742 (c) | ĐÃ SỬA | **A**: a M14: 2 đỏ; b M15: 1; c M30: 2; d M16: 1; e M17/M18/M35: mỗi mutant 1; f M06: 14, M36 toàn A: 1. | **A**: M36 chỉ 5 test kyc-fact xanh, nhưng test lệnh KYC trong toàn A bắt 2.0/1e1/0x10/+2; không báo test hở giả. |
| DR6-127 | #724 → #746 | ĐÃ SỬA | **D**: CustomerKyc giữ wrap-anywhere dòng cuộc gặp; ca108 chữ qua. R127-meeting bỏ class làm timeline tràn185,4375px tại1440. | **D**: N6 đổi filter Lịch hẹn/KYC vẫn giữ đề xuất Mock; không lỗi mới ở dòng cuộc gặp. |
| DR6-128 | #725 → #748 | ĐÃ SỬA | **E**: P128-reminder/canPurge/trim/NFC/Escape/cancel/6f: 7/7 đột biến làm nguyên test gốc đỏ; control thuộc e2e-base-2.log xanh. | **E**: Bộ lọc không khớp vẫn dọn mọi dòng; NFD đúng bật; Escape/Hủy khi backup giữ không đóng; E19 khóa đúng nhóm đã giữ. |
| DR6-129 | #719 → #736 (+ #772 → #792, #793 → #815) | ĐÃ SỬA | **F**: Control fixture/full-cycle; bỏ clock: test đỏ với chênh 3.842.499.461 ms. Bỏ zone, tính giao thừa từ 09:30 và bỏ lint import động đều đỏ. e2e-final.log 11/11. | **F**: Honolulu, UTC+14, +11 phút → reload → trang mới; guide callback Honolulu. Không chỉnh đồng hồ Windows hay giả nhận đã chạy lúc nửa đêm máy. |
| DR6-130 | #719 → #736 | ĐÃ SỬA | **F**: R130-folder / brace / separator: mỗi mẫu 1/28 test đỏ; control notes-core 28/28 trong unit-final. Tái hiện T61f/T61k đúng như lượt 3. | **F**: U+2028/2029 giữ dòng, brace nhiều nhóm mở đủ. Biến thể glob ở cấp package là F1 riêng. |
| DR6-131 | #729 → #755 (+ #756 → #758) | ĐÃ SỬA | **E**: Mockup appointment-forms.html:244 và NT-LH-25 :137 ghi 1,234 tr = 1.234.000.000 ₫, 0,500 tr = 500.000 ₫; kiểm tĩnh R131-doc xanh; money.test xanh. | **E**: Sửa tài liệu, không có đột biến code phải giết. Không đổi quyết định Owner #106. |
| DR6-132 | #729 → #755 (a), #722 → #742 (b) (+ #756 → #758) | ĐÃ SỬA | **A**: packages/db/CLAUDE.md nêu đúng DROP/tạo lại ba trigger trước khi dựng lại customers; schema.ts nêu ngoại lệ TR-11.<br>**D**: Năm nơi ghi ngoại lệ Dọn sạch: CONTEXT, spec3/5, hướng dẫn05, mockup7a; structural-checks xác nhận. Khớp TR-11/D11, copy app, N9 dọn KH kèm lịch. | **A**: Đối chiếu 0011: cả ba trigger đọc OLD.customer_id trong customers; đây là dòng tài liệu, không đặt đột biến hành vi giả.<br>**D**: Chỉ tài liệu, không cần mutant hành vi. Phần(b) trigger/db-CLAUDE thuộc A. |
| DR6-133 | #729 → #755 (+ `@4`: #728 → #766) | ĐÃ SỬA | **C**: `docs/user-guide/06-ai.md:49` lấy ví dụ **discovery@4**, khớp PROMPT_VERSIONS và chip mới của app. | **C**: Mục sửa tài liệu: kiểm chữ có và khớp app; không đột biến hành vi. |
| DR6-134 | #720 → #740 (+ #775 → #804) | ĐÃ SỬA | **A**: stagesOfDay dùng cho lệnh, luật nhập 4 và outcome-form; M14 làm test nhóm tạo KH đỏ.<br>**E**: meetingDay gọi stagesOfDay; U134-day bỏ fallback ngày trước tạo KH → 1/34 unit đỏ. N7: 343 tổ hợp helper cũ/mới trùng. | **A**: stageAtEndOf/stageSnapshot vẫn bỏ KH trước ngày tạo khi đếm chỉ số; fallback của cuộc gặp nhập bù là hợp đồng khác có chủ ý.<br>**E**: Snapshot trước ngày tạo KH không đếm KH; fallback chỉ phục vụ nhóm của cuộc gặp. |
| DR6-25 | #781 → #830 (+ #831 → #837) | ĐÃ SỬA | **A**: Chỉ import zod/mini; M38 đổi về zod → ESLint exit 1; so envelope/timestamp classic–mini: 63 đầu vào phân biệt, 0 lệch.<br>**C**: **4.500 ca vi sai** mini ↔ schema ngay trước #830: cùng success, data, mã/path/detail V1. Gỡ import mini (M25) → ESLint đỏ. Bundle chuẩn giảm **43.234 B index.js** so lượt 3.<br>**F**: Baseline không biến riêng: index.js 884.698 B, giảm 43.234 B so R3; #830 riêng giảm 62.735 B min. A/C đã so kết quả mini/full và gỡ import làm lint đỏ; F T304-lint bỏ luật → 1/78 đỏ. | **A**: 20.000 lần parse là lặp 54 envelope + 9 timestamp, không phải 20.000 ca độc lập. Bundle dùng số chung.<br>**C**: Số giảm riêng khi merge #830 là 62.735 B min theo fixes/baseline; không lấy bundle probe có instrumentation làm số chuẩn.<br>**F**: Không gán toàn bộ giảm index.js cho zod. Font/logo/favicon/icon tách tại mục 6. |
| DR6-37 | #655 → #693 (một phần), #790 → #845 | ĐÃ SỬA | **D**: Ký hiệu/dấu nối qua khóa i18n; i18n/token-guard control qua. R37-mark đổi dấu hiện diện về literal✓ làm CLI check-tokens đỏ.<br>**E**: Ký hiệu nút bỏ người phối hợp và So sánh team qua i18n. S37 trả ký hiệu về JSX → kiểm tĩnh tiêu chí Issue đỏ. | **D**: Kiểm cấu trúc cho rollback tương đương hành vi, không tuyên bố runtime test phân biệt cùng một dấu. N4 HTML hiện như chữ.<br>**E**: P-raw-37-equivalent vẫn e2e xanh: ký hiệu giữ nguyên nên đây là đột biến tương đương, không phải lỗ test hành vi. |
| DR6-66 | #655 → #693 (một phần), #775 → #801, #777 → #812, #790 → #845 | ĐÃ SỬA | **A**: rg không còn getter/mark/monthToDate/stageOn trong source A; M39 đưa lại đúng monthToDate cũ → codemap --check exit 1.<br>**C**: Không còn export AI_LOCAL_ERROR_CODES; ConfirmProposal là type nội bộ. Trả export đầu về (M66), baseline codemap xanh → **codemap:check đỏ** ở packages/ai/CLAUDE.md.<br>**D**: Export đối chiếu callers/codemap; codemap --check qua. R66-export tái export TokenReader làm gate đỏ.<br>**E**: markName không export; S66 phục hồi export → kiểm tĩnh tiêu chí Issue đỏ. tsc-unused exit 0; bỏ PLAIN_SLOTS khỏi API theo T-301.<br>**F**: Năm tsc noUnused exit0, codemap --check exit0; A/C/D/E ghi rõ mutant export/helper bị codemap hoặc tsc giết. API PersistQueue không còn unsaved; markName/ConfirmProposal/TokenReader/ShowMoreFoot/TokenViolation/PLAIN_SLOTS không còn export bị nêu. | **A**: Kiểm cấu trúc/API; gate codemap không tự chứng minh mọi dạng dead code đều bị chặn.<br>**C**: API barrel không lộ attempts/analysis-steps; xét danh sách của DR6-66/Issue, không coi mọi helper có test là code chết.<br>**D**: Đã xem PLAIN_SLOTS/chart-theme/index UI; export domain/db/ai và toàn repo thuộc A/C/F.<br>**E**: Thu hẹp API không đổi kết quả runtime; không ép unit phải phân biệt hai export tương đương.<br>**F**: Không suy từ noUnused rằng đã chứng minh mọi export không có caller của toàn thế giới là cần thiết. |
| DR6-67 | #774 → #799, #775 → #801, #777 → #812, #782 → #807, #790 → #845 | ĐÃ SỬA | **A**: updateRow/findRow/requireRow/lastSeq và helper domain một nơi; M40 đưa lại updateTeamRow cũ không caller → TS6133; M19 thay hành vi helper bị seed hash giết.<br>**B**: `entries` thay các vòng read_dir; `remove_interrupted` dùng chung exports/backups; `refuses` dùng chung quyền file/thư mục. Control 73 xanh. `R67-cleanup` bỏ nhánh dọn backup: test `open_removes_the_tmp_of_a_backup_cut_short_and_keeps_everything_else` đỏ. `T293-backups` nuốt lỗi entries: ca backups không đọc được đỏ.<br>**C**: AiErrorDetails/AiErrorResult/errorDetails dùng chung ở runner, cầu Tauri và màn lỗi. M288 làm helper mất serverMessage → **2/9 đỏ**; typecheck/deps xanh.<br>**D**: classes.ts/money-view.ts/stage-badge.tsx gom chỗ dùng. R67-amount làm1/2 unit đỏ; R67-CARD tái tạo hằng local làm kiểm chấp nhận cấu trúc đỏ. UI/noUnused qua.<br>**E**: Phần E: CARD/ALERT/LINK/HEADING/PANEL dùng chung, 17 REPORT_COLUMNS dùng ở màn/Excel/reportCells. U301-column tách lệch header workbook → unit đỏ; N9: 9 sheet cũ/mới cùng ô và định dạng.<br>**F**: Class CARD/ALERT/LINK/HEADING/BADGE một nơi ở classes.ts; 17 cột báo cáo một nơi; hàm dùng chung domain/db/AI/Rust có mutant hành vi trong A–E. F scan 189 file: 0 nhóm thân hàm y hệt ≥3 nơi, tối thiểu120 ký tự. | **A**: Bản list của schema giữ riêng vì import vòng: ngoại lệ được Issue cho phép, không báo lại.<br>**B**: Đối chứng refactor: inline lại hai vòng dọn **tương đương** vẫn 73/73 (`R67-inline.log`), đúng dự kiến. Không gọi đây là test hở: runtime test không phát hiện code lặp khi hành vi y hệt. Đột biến mất tác dụng thật của helper bị giết. Predicate tên, file/thư mục, lần mở đầu và reload được giữ.<br>**C**: Luật thử lại / kiểm / dựng row dùng chung ở attempts và analysis-steps, không chép OpenCode ↔ web.<br>**D**: Tiền compact/full/bằng nhau, class/badge giữ hành vi. T-305/T-310 nối HEADING/BADGE; không kết luận thay gói khác.<br>**E**: N7 so 343 tổ hợp trước/sau refactor; không lệch dữ liệu. N1/N2 là lỗi bố trí có từ trước, ghi riêng.<br>**F**: Scan chính xác sau bỏ comment/whitespace, không phải detector clone ngữ nghĩa. Refactor tương đương không buộc runtime test phải đỏ. |
| CL3-A29 | #722 → #742 (một phần: bỏ CTE khi không có lịch đã xóa), #776 → #805 (chỉ mục `0012`) | ĐÃ SỬA | **A**: M27 bỏ index mới → test lookup migration đỏ; perf-paired: listTrash 26,171 → 24,184 ms; preview 1,792 → 0,937 ms.<br>**F**: Gỡ nhánh rác trống → 1 test gốc đỏ; bỏ0012 → 1 test lookup gốc đỏ. listTrash mới/cũ trên cùng handle:18,927/20,636 ms; bỏ index:25,247 ms;113 dòng và purgePlan deepEqual. | **A**: Cùng kết quả listTrash/preview với mã cũ, và cùng dòng khi bỏ cả hai index; CROSS JOIN đọc từ lịch đã xóa.<br>**F**: Đủ cả hai phần theo T311; 5 lần dọn ở113/1.313 dòng không hồi quy qua hai mốc nhiễu. |
| CL3-B2 | #783 → #817 (nút Thử lại) | ĐÃ SỬA | **B**: Có nút Thử lại gọi `saves.flush()`. `CL3B2-retry` bỏ ghi lại lost: 3/12 test đỏ. Ca e2e PR sửa: Nạp lại bị từ chối → Thử lại khi còn lỗi → hết lỗi → Thử lại → Nạp lại thành công.<br>**D**: Thử lại gọi saves.flush; save-state qua, T294-retry thay promise rỗng làm đỏ. Sidebar lấy cùng trạng thái lưu.<br>**E**: E2E trash D7 → Thử lại → dọn xanh; P-B2-retry bỏ flush của Thử lại → nguyên test đỏ (alert expected 0, received 1). | **B**: N2 bấm hai lần khi write bị giữ: chỉ một lần ghi thành công, dữ liệu không lùi; điều hướng trong khi thử lại giữ focus người dùng. N3/N4 kiểm tiếp Nhập/Dọn với close. Không báo lại hai giới hạn giao diện ACCEPTED của #819.<br>**D**: N7 lỗi nhiều nguyên nhân rồi lưu được; N8/N9 đóng giữa thay dữ liệu chờ save mới. Bytes/queue thuộc B.<br>**E**: N5 qua Nạp lại: lỗi lưu được hướng dẫn và thử lại; app không thay dữ liệu khi D7 từ chối. |

### 2.4 R2 gộp — đủ 32 Issue

Nguồn: A–E §2 và §2.2 trên; thứ tự đúng known.md phần5. Không thêm T313/315/317 là quy trình.

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-280 | #735 → #760 | ĐÃ SỬA | **D**: 9ca topbar-focus qua tại1100/1440: Shift+Tab, heading/lịch/AI link, trong dialog. T280-margin bỏ scroll-margin làm Shift+Tab đỏ. | **D**: N3 fallback heading; N7 focus đã rời Thử lại. |
| T-283 | #772 → #792 | ĐÃ SỬA | **F**: Helper chung dùng lại; fixture, seed sẵn/seed lại và perf/stats 11/11;5f kiểm RF/KYC chính xác xanh. T283-zone/eve/tested/renamed-data đỏ đúng assertion; lint fixture xanh. | **F**: Link span nhiều backtick, base=0 → không Infinity. Mẫu renamed đầu chỉ đụng giao thức mock, loại khỏi chứng minh hành vi; mẫu renamed-data giữ query mock và làm1/10 đỏ. |
| T-284 | #773 → #795 | ĐÃ SỬA | **D**: G3/thẻ#t284 khớp; token control #687890 ở app/mockup; panel/help theo token duyệt. structural-checks/theme qua.<br>**E**: Mockup 8d có dòng −1/+1 HĐ theo tháng/năm; app policyChange/effectText và e2e 8d xanh; U296-count bỏ dòng số HĐ → 2/24 unit đỏ. | **D**: Issue mockup/tài liệu; HĐ8d thuộc E. T-300 kiểm token bằng mutant riêng.<br>**E**: Phần E của G3 là 8d. Viền điều khiển và panel AI thuộc D/C; lệch in đậm của 8d đã KNOWN, không báo lại. |
| T-285 | #774 → #799 | ĐÃ SỬA | **A**: Helper ngày/ISO/bỏ dấu/gộp khoảng trắng/hex và previous KYC đúng API mới; baseline domain/seed xanh; M37 làm material sai → 1 test đỏ. | **A**: N11: 00:00/23:59 qua năm mới và seed roundtrip tại UTC, UTC−11, UTC+14, Bangkok đều đạt; thay parseDate là chủ ý. |
| T-286 | #775 → #801, #804 | ĐÃ SỬA | **A**: Gộp row/seq/live; bỏ getter chỉ test; mã lỗi/params và stage đầu được baseline giữ; M19 bỏ updatedAt → 1/1.470 test đỏ (hash seed). | **A**: M19 riêng Team 31/31 xanh chưa đủ kết luận; đã mở rộng toàn A. Nhánh normalizeKycValue còn chặn INVALID_TEXT. |
| T-287 | #776 → #805 | ĐÃ SỬA | **A**: Danh sách năm kind/POINTS_TO; M11 đỏ 4, M27 đỏ 1, M29 đếm RF sai đỏ 1; test migration có dữ liệu và plan trong baseline xanh.<br>**D**: 9b dùng danh sách tham chiếu db; tên trùng thêm mã, tối đa3ví dụ. T287-codes bỏ mã tên trùng làm1unit đỏ.<br>**F**: CL3-A29 đo cặp, gỡ index và early-return đều có test gốc đỏ;113/1.313 dòng dọn, cùng plan/kết quả. | **A**: N05 dọn–giữ–khôi phục–dọn tiếp; listTrash/preview cũ–mới bằng nhau; bỏ index không đổi dòng; empty-trash không đọc refs thừa theo test.<br>**D**: N3 nhập4KH trùng có lịch trong rác:3mã khác nhau+1KH khác,4lịch. Chỉ mục/seed/query/đo thuộc A/F.<br>**F**: Phần person references, seed, RF trong A/D; F không chấm thay bằng đo đơn lẻ. |
| T-288 | #777 → #812 | ĐÃ SỬA | **A**: MAX_AI_RAW_OUTPUT/AI_ANALYSIS_NO_MODEL chỉ định nghĩa ở ai/schema; db import cho CHECK và toRow; M28 nâng trần raw thêm 1 → 2 test đỏ.<br>**C**: Một nguồn MAX_AI_RAW_OUTPUT/AI_ANALYSIS_NO_MODEL; retry chỉ giữ chữ G5, module nội bộ không qua barrel, AnalysisSubject/errorDetails dùng chung. M288 đỏ **2/9**, M66 đỏ codemap. | **A**: Chỉ kết luận phần lưu DB/hằng và seed. Chi tiết Mock/retry/validator được gói C kiểm; không gọi AI thật.<br>**C**: Prompt/version test xanh; corpus Mock tải không đổi. |
| T-289 | #778 → #809 | ĐÃ SỬA | **C**: Các ca PEOPLE, KH_SUBJECT, OWN_PARTNER, câu hỏi/phỏng đoán, AFTER_CHO/NOT_OF_ANYONE có trong 415 test xanh; M121 gỡ thuật toán về trước đợt sửa → **142 đỏ**. | **C**: Biến thể mới không thuộc tám nhóm ví dụ gốc: CXR4-C1. |
| T-290 | #779 → #820, #822 | ĐÃ SỬA | **C**: Sáu ca detail có İ/emoji/dash trích đúng chữ; M290merge bỏ gộp vị trí → **8/227 đỏ**. JSON đủ sau `{` lời văn lấy được; JSON cụt thật vẫn không lấy; M290cut → **5/35 đỏ**. | **C**: DR5-09 kiểm giới hạn đọc thay timing. Lần gọi assistant rỗng: chỉ đọc bằng chứng Owner trong fixes.md (Credit/deepseek nhận; hai model khác chưa kiểm); phiên này không gọi lại. |
| T-291 | #780 → #824, #828 | ĐÃ SỬA | **A**: Hash/canonical output/chữ tùy chọn/gợi ý năm trước/thứ tự tên/VT-FF: M20 7 đỏ, M21 5, M22 1, M23 1, M24 3, M25 2, M26 1.<br>**C**: Phần C: output lưu đúng dạng, REJECTED lớn, VT/FF, `{}` trong lời văn, test đếm matcher. Biên **19.999/20.000/20.001** code point đúng; UI báo output quá lớn, output null. M291 **1/56 đỏ**; canonical **5/182 đỏ**; bỏ sunlife **1/524 đỏ**.<br>**D**: Đọc bảy luật/phần D: Unicode/ngày/tiền/sort; domain bổ sung/form qua. T291-VTFF bỏ VT/FF khỏi LINE_BREAK làm text.test đỏ.<br>**E**: Phần E luật 4/5: U291-reason và U291-previous đều đỏ khi gỡ sửa; e2e đầu năm 6b/6e/6h xanh. | **A**: N01–N03, N07–N09; dòng do app ghi nhập được. Giới hạn output theo code point, REJECTED được giữ khóa/thứ tự khác. Mục AI 11–12 của Issue thuộc C.<br>**C**: Luật hash/ngày/tên và chữ tùy chọn ngoài AI thuộc gói tương ứng. ACCEPTED/REJECTED round trip và chuỗi K10 qua AppData đều đúng.<br>**D**: N5 UI: BOM bỏ, VT/FF→LF, tiền vô hình đúng. Luật nhập/precision/output thuộc A/C.<br>**E**: 6e không tự tick Nhập bù; 6h không gợi ý năm trước. Luật nhập/output/hash được A/C kiểm. |
| T-292 | #781 → #830 | ĐÃ SỬA | **A**: Mini đúng envelope và precision:3 trên 54+9 ca phân biệt; 20.000 parse lặp 0 lệch success/data/code/path; baseline mã BACKUP_INVALID giữ; M38 lint đỏ khi quay về classic.<br>**C**: 4.500 ca mini/full không khác kết quả và detail V1; M25 đưa full zod lại → lint đỏ. Schema/validator/backup test cuối xanh.<br>**F**: DR6-25; thống kê baseline và phần A/C mini/full. Bỏ luật chặn classic trong bản chép làm test gốc đỏ. | **A**: Không so chữ lỗi tiếng Anh mặc định vì K38 đổi có chủ ý; detail V1 toàn phần thuộc C, bundle thuộc F.<br>**C**: Không đổi package dependency. Các mảng mặc định được kiểm thêm qua T-304.<br>**F**: Gói dependency không đổi; K38 cho chữ lỗi mặc định khác. |
| T-293 | #782 → #807 | ĐÃ SỬA | **B**: Rust 116/116 (73 storage, 43 AI). `T293-backups`: 1 đỏ; `T293-json-only` đổi lượt JSON-only về All: 2/43 đỏ, đúng hai đường chặn 2xx/che thông điệp. Bỏ quyền set-title: contract 1/17 đỏ.<br>**D**: AppShell đặt `<Màn> · Heritas L-CRM`; navigation qua. T293-title bỏ setTitle làm đỏ; startup/save cause qua. | **B**: Lần mở đầu cấm WD, file hỏng/mất cùng WD và backups cấm RD được test Windows thật; không sinh seed đè. Cách đọc dùng Rc chia lượt 1, bộ 16.099 ca và fingerprint không đổi; key giả chứa backslash/% qua JSON.stringify bị giữ. Tiêu đề theo màn qua IPC giả trên build web ở N5; không chạy lại exe native trong phiên này.<br>**D**: Đổi màn/lỗi mở đã kiểm; ACL/backup thật thuộc B. |
| T-294 | #783 → #817, #819 | ĐÃ SỬA | **B**: Store `status()` chung. `T294-track` bỏ track(turn): 2/77 đỏ; `T294-listener` để listener ném ra ngoài: 1/12 đỏ; control unit 153/153. Browser 5 ca chấp nhận save-state xanh.<br>**D**: Sidebar Đang lưu/Đã lưu, alert/Thử lại, đóng có guard qua save-state. T294-retry bỏ flush làm đỏ. | **B**: N1/N2/N6/N7: đổi nguyên nhân, retry đồng thời, work thêm khi flush đang chờ, listener/failed/newest snapshot. N3/N4: close chờ backup rồi save mới; purge chờ đủ hai save (transaction và VACUUM). N9: lượt giữa lỗi không làm kẹt hàng đợi hoặc close. Hai điểm #819 là KNOWN, không mở lại.<br>**D**: N7 giữ focus; N8 backup→save→destroy; N9 backup→save→save→destroy. Native giả kiểm D, file thật thuộc B. |
| T-295 | #784 → #825 | ĐÃ SỬA | **B**: `T295-check` bỏ kiểm trước migrate: 3/77 đỏ, gồm file schema 10 có chỉ mục mà migration 11 dựng lại; không backup/lưu file hỏng. `T295-duplicate` luôn lưu openFrom: 1/77 đỏ; `T295-measures` bỏ clearMeasures: 1/77 đỏ.<br>**C**: Phần C: nhập lại cùng backup trong lúc copy / open chờ → **discarded**, opens **0/1** tương ứng. M295 gỡ kiểm sau copy → **1/60 đỏ**.<br>**E**: Số liệu 10c + SCHEMA_TOO_NEW + đổi notice cũ đều có e2e xanh trong demo-data/backup; P295-10c đặt số KH=0 → e2e đỏ. N5 kiểm notice và lỗi lưu. | **B**: N8: file schema 12 chứa dữ liệu tải mở lên 13, backup nguyên byte, đúng một save, tables/listTrash không đổi, integrity sạch. Timeline được test 120 lần lưu và luôn ≤50. Test contract nhận pre-release. Hộp 10c/notice và generation ChatGPT web thuộc E/C; không nhận đã review trọn các phần đó.<br>**C**: Copy đã bắt đầu thì không thu lại clipboard; không mở tiếp sau khi generation đổi ở copy. Kiểm file trước migrate/số liệu 10c ngoài C.<br>**E**: Phần E: hộp và DataSections. integrity_check/openFrom/AI generation thuộc B/C. |
| T-296 | #785 → #833 | ĐÃ SỬA | **E**: ConfirmWordDialog chung, P128 NFC/khóa hộp đều đỏ; U296-plan/E20/count đỏ. Unit đếm keptRecords khi mở/dọn xanh; N8 kế hoạch từ listTrash bằng preview và kết quả dọn 113 dòng. | **E**: U305-badge bảo vệ tên theo ô; HĐ cùng ngày/cùng FYP khác trạng thái phân biệt được; số ghi chú KYC có slot riêng. |
| T-297 | #786 → #835 | ĐÃ SỬA | **C**: M297 bỏ giữ lỗi → **1/12 đỏ**. Edge: timeout khi ở màn khác, quay lại thấy lỗi + Thử lại một lần; rời/quay lại nữa không còn. E2e gốc giữ lỗi, trích xuất/3f, chọn lại cấu hình hỏng, đổi model đều xanh.<br>**D**: Filter timeline, mãF/version, chữ từ chối3f đối chiếu mockup/kyc-view/e2e. T297-filter cho mọi event vào KYC làm đỏ. | **C**: start trùng khóa/Hủy giữ khóa có test; các bộ lọc dòng thời gian thuộc phần D.<br>**D**: N6 Mock, ẩn/hiện giữ2đề xuất. Jobs/provider thuộc C. |
| T-298 | #787 → #838 | ĐÃ SỬA | **D**: 5d lên/xuống/khóa lý do; thẻ Lịch hẹn một dòng1440, trạng thái/RF; table compact/fixed/width qua customer-forms/appointments/data-table. T298-direction đảo chiều làm đỏ.<br>**E**: E2E 6a history/6h không history xanh; P298-days bỏ tên ngày ngoài tháng/khoảng → e2e đỏ. Test writtenDay/DateSuggestion xanh. | **D**: Nội dung thẻ dài trong khung. Màn6a/6h/6d/ngày ngoài tháng thuộc E.<br>**E**: Phần E: lịch và hộp; 5d/thẻ lịch KH thuộc D. Focus khung Chi tiết đã có ca bàn phím xanh. |
| T-299 | #788 → #841 | ĐÃ SỬA | **D**: Hỏi thay đổi nhân sự chưa lưu trước Xóa; T299-ask bỏ hỏi làm đỏ. T299-sort remount Members làm giữ sort đỏ. PeriodPicker/Chart/UI qua.<br>**E**: Bảng trợ năng chart + tóm tắt xanh; P299-table bỏ bảng → locator không còn, test gốc đỏ. P299-blur-effective gỡ guard nội bộ → aria-invalid false/true, đỏ; control xanh. | **D**: N3 105RE→Hiện thêm→đổi vai trò→sort giảm→đổi team→reset100, giữ sort. Màn dùng chart/kỳ thuộc E.<br>**E**: N3, N4: chỉnh cặp ngày rồi đổi loại, ẩn cả bốn nhóm. Lần P299-blur đầu không có hiệu lực do junction, loại khỏi thống kê. |
| T-300 | #789 → #843 | ĐÃ SỬA | **D**: Viền field/mũi tên unsorted 3:1; table-view/token-guard/favicon/topbar qua. T300-border trả màu cũ làm tương phản đỏ.<br>**F**: CLI token guard exit0; T300-flex cho flex:1 lọt →1/16 test đỏ. tsc/codemap/deps sạch. | **D**: Ô khóa border-strong+dashed theo T-303; tooling/helpers thuộc F.<br>**F**: D kiểm màu/field/table/focus; F không nhận đã đo lại UI tương phản. |
| T-301 | #790 → #845, #846 | ĐÃ SỬA | **D**: Class/tiền/ký hiệu/dead export qua R37/R66/R67; noUnused/codemap qua. Ba gate cấu trúc đỏ khi rollback; R67-amount unit đỏ.<br>**E**: markName private, class/i18n/cột một nơi; S66/S37 đỏ theo kiểm tĩnh, U301-column đỏ; N7/N9 không đổi kết quả so 119e2e4.<br>**F**: T301-mark bỏ chặn dấu →1/16 đỏ; tsc năm vùng, class chung/17 cột/API đã đọc. A/E đối chứng dữ liệu/refactor; F N1–N5 giữ tables/report khi thay, lỗi và dọn. | **D**: Control115e2e qua; không đổi hành vi/chữ/class ngoài quyết định duyệt. Không đòi behavioral test phân biệt hằng cùng giá trị.<br>**E**: Test giữ hành vi, kiểm tĩnh giữ cấu trúc. Lỗi tên dài N1/N2 đã tồn tại trước refactor.<br>**F**: Phép kiểm cấu trúc tách khỏi behavioral mutation. Không báo logo copy ACCEPTED thành bloat. |
| T-302 | #793 → #815 | ĐÃ SỬA | **F**: Bỏ dynamic-import rule → e2e lint đỏ (expected1/received0); trả parser docsRead về cách đọc ngoặc cũ →2/78 unit đỏ. | **F**: Spec/helper, quote/backtick, TS import type, module khác qua đúng luật. Hai giới hạn docsRead của K/ACCEPTED giữ nguyên. |
| T-303 | #797 → #811 | ĐÃ SỬA | **D**: Mockup ô khóa border-strong+dashed khớp LOCKED tại appointments-view.ts:63; #contrast ngoài phạm vi Choices. Hai kiểm tài liệu qua. | **D**: Chỉ mockup/chữ, không gỡ hành vi app để mutant. |
| T-304 | #831 → #837 | ĐÃ SỬA | **C**: M304 đặt check ngoài _default → **2/93 đỏ**; parse độc lập không dùng chung mảng. M25 import full bị ESLint chặn.<br>**F**: Bỏ paths:zod →1/78 unit đỏ; control78 xanh. static/type/re-export/full subpath bị chặn; mini qua. | **C**: Lỗ Zod/ZOD và import động thuộc ACCEPTED / phạm vi đã chốt; không báo lại.<br>**F**: Default arrays/detailV1 được C kiểm. Dynamic import và Zod/ZOD không thêm vào phạm vi; K38/ACCEPTED. |
| T-305 | #849 → #855 | ĐÃ SỬA | **D**: HEADING/BADGE chung, badge tiền/số HĐ giữ cỡ. T305-HEADING đưa hằng local về làm kiểm chấp nhận đỏ. Theme/UI/tsc qua.<br>**E**: recordBadge dùng ở ô và tên khôi phục; U305-badge bỏ phần tên → test đỏ. HEADING/BADGE/WEB_MODE.tone đọc một nguồn.<br>**F**: Chạy nguyên callback beforeEach của guide tại Honolulu: control xanh; đổi anchorMorning(timezoneId) về ANCHOR_MORNING → reviewer test đỏ. guide13/13,28 PNG tái sinh trùng từng byte. | **D**: nHĐ py-0.5 có chủ ý; recordBadge E, đồng hồ chụp F.<br>**E**: Đã đọc diff class giữ chuỗi; chụp ảnh hướng dẫn/đồng hồ thuộc F.<br>**F**: Log probe đầu ReferenceError do eval/import của reviewer, đã sửa truyền dependency rõ và chạy lại; không tính làm lỗi sản phẩm. Class/recordBadge/WEB_MODE phần D/E. |
| T-306 | #850 → #857 | ĐÃ SỬA | **B**: Spec S2-6 và dòng test chấp nhận ghi chờ lần thay/lưu; lần thay lỗi giữ dữ liệu cũ đủ. NT-DB-23…25 có WD lúc mở/giữa phiên, readonly giữa phiên, Thử lại và kết quả đúng mã/câu. Đối chiếu Rust test, close/SSR và browser.<br>**E**: Kiểm tĩnh T306-plan-doc xanh: S2-6 lỗi thì dữ liệu cũ đủ; 11i dùng purgePlan; TR-3 giải thích D10; ảnh 150 KiB; hướng dẫn dùng 01–06/09 và 14–20/09. | **B**: Dòng lệch 10d/11j ghi đúng dải ngang, câu theo nguyên nhân, trạng thái Đã lưu chưa có giờ, vế Thử lại của D7. N3/N4/N7/N9 khớp câu đóng app. Chỉ tài liệu nên không đặt đột biến code cho dòng này. Những phần E/D của Issue để gói tương ứng kiểm.<br>**E**: Tài liệu và lệch 8d/10c khớp app; không đột biến sản phẩm cho dòng tài liệu. ACL/ràng buộc file thuộc B. |
| T-307 | #851 → #859 | ĐÃ SỬA | **F**: metrics-audit:241 PR/87 code,19 vượt;19/19 số SP/tổng khớp phase-6.md.15 chính+4 biên. integrity_check14,1/20,0/25,4 MB và366/453/546 ms khớp nguồn R3. | **F**: Dùng lịch sử Git first-parent cục bộ, không gh. Dòng review đóng phase có hai đợt sửa; chỉ tài liệu, không mutant sản phẩm. |
| T-308 | #852 → #861 | ĐÃ SỬA | **B**: productName/window title/Cargo description là Heritas L-CRM; `T308-name` đưa productName về Project-2C: 1/17 đỏ. Đã xem icon.png và đọc header/hash năm icon; 32/128/256/512 px, ICO 6 ảnh. N5 title/1100×700 xanh.<br>**D**: Brand có tên truy cập, slogan Playfair cục bộ/token; theme1100×700 thấy Cài đặt/trạng thái lưu, title/favicon đúng. T308-font trả sans làm đỏ. | **B**: CSP không đổi so 119e2e4, identifier vẫn dev.alexh.project2c; cargo binary project2c, DATA_DIR, DB_FILE, KEY_SERVICE và BACKUP_FORMAT giữ tên mã, đúng K39. Icon là cây trên ô trắng bo góc. Mỹ thuật khối logo/font chi tiết thuộc D; dùng baseline chuẩn bị cho cỡ exe.<br>**D**: Stat font21.884B/logo149.070B khớp baseline. Icon/exe/config thuộc B. |
| T-310 | #865 → #871 | ĐÃ SỬA | **B**: Ca `names the app as the sidebar does...` đọc các file cấu hình, so với `t('app.title')`. `T310-title` chỉ đưa title cửa sổ về Project-2C: 1/17 đỏ; control 17/17.<br>**D**: HEADING sót/stageBadge/lang=en/app.title khớp. T310-name đổi title HTML làm tauri-contract đỏ; T310-lang đổi vi làm theme đỏ.<br>**E**: Bốn tiêu đề E dùng HEADING; S310 trả một tiêu đề Lịch hẹn về chuỗi cũ → kiểm tĩnh đỏ. Ô Thùng rác dùng stageBadge(label) và recordBadge đúng.<br>**F**: Bỏ pattern classes/money-view →3/74 test đỏ; control74 xanh. scope không còn file chưa xếp gói;96 F, D87/E52. | **B**: Đường kết nối B là test tên app một nguồn, không phải đổi runtime Rust. Các phần HEADING/stageBadge/lang/PACKAGES được giao D/E/F, không chấm thay.<br>**D**: 6mockup lang=en; logo copy đúng byte ACCEPTED. PACKAGES nhận file D mới (87file); tooling F.<br>**E**: Gói E chỉ kiểm tiêu đề và ô Thùng rác; tên app/quyền/ảnh/logo/bộ đếm thuộc B/D/F.<br>**F**: Tên/logo/lang/stageBadge/HEADING có kiểm B/D/E; ảnh logo trùng là ACCEPTED. |
| T-311 | #866 → #870 | ĐÃ SỬA | **D**: 6mockup appointments/customers/customer/team/settings-data/trash có `.brand→CH-09`; NT-CH-09 khớp brand/title/1100×700; structural-checks đủ6dòng.<br>**F**: phase-6.md:239 có playwright*.config.ts/vitest.config.ts, :234 nói base.sha; đếm lại #709/#845 khớp860/1103. CL3-A29 gồm cả early-return và0012. K21/K31, chữ4 lượt có trong common/plan hiện tại. | **D**: Chỉ tài liệu. Luật đếm phase-6.md, K21/K31 và tổng hợp thuộc F.<br>**F**: Đối chiếu .brand→NT-CH-09 được D kiểm. Phần quy trình không chạy nghi thức, không ghi lại thành phát hiện. |
| T-312 | #867 → #882 | ĐÃ SỬA | **F**: Guide gốc13/13;28 ảnh đúng từng byte ảnh commit, tổng1.942.246 B,max141.536 B. Bỏ style:13/13 vẫn xanh, ảnh KYC hụt chân8 hàng. Kiểm ảnh bổ sung của reviewer:control exit0/mutant exit1. | **F**: Ghi rõ test PR chưa giết mutant này → CXR4-F2. Kết luận đường lỗi ảnh hiện đã sửa; không dùng checker của reviewer để nhận PR đã có test hồi quy. |
| T-314 | #876 → #878 | ĐÃ SỬA | **F**: customer-ai.spec.ts:312 chờ heading Cài đặt trước goBack để thật sự unmount. Ca chạy3/3 không retry, IPC AI giả, không mạng. Gỡ await chờ heading:3/3 đỏ vì alert còn; control sau hoàn nguyên xanh (T314-no-wait.log,T314-final-control.log). | **F**: Đây là sửa chính test; đã gỡ và tái hiện cả3 lượt với server READY. phần kế hoạch/dot2 là quy trình, ngoài R2 sản phẩm. |
| T-316 | #884 → #888 | ĐÃ SỬA | **F**: Nguyên helper nguồn trích ra: scroll3312px → clip vẫn{x232,y0,width1208,height4212}. Bỏ scroll trước boundingBox → reviewer e2e đỏ; control cuối xanh. | **F**: Hai callsite guide gốc hiện không làm lộ lỗi: một goto mới, một height600; dùng probe có cuộn thật để kiểm. Phần Memory/ACL/dot2 là quy trình. |

## 3. Phạm vi đã đọc / rà

Gói F theo classifier: **96 file, 4.440 dòng SP, 16.860 dòng test/hỗ trợ, 4.628 dòng sinh**. Diff `119 e2e4..2e51e25`: SP **+152/−52, 7 file**; test **+2.967/−272, 46 file** (baseline; diff-F.patch giữ toàn diff F). Đọc kỹ các nhánh đổi trong eslint, notes-core, pr-core/pr-status, eval-ai-core, size-report-core, check-tokens; setup/clock/helper/assertion và chỗ nối của e2e. Test cũ được rà theo ca/assertion, báo cáo cũ và hợp đồng màn; không dùng coverage thay đọc đường đi. test-audit.json lưu từng file, case, **2.879 match expect tĩnh** và các điểm cần xem, không nhận đó là số test thực thi.

| File | Loại | Phạm vi dòng |
|---|---|---|
| `.claude/hooks/handoff-context.mjs` | product | 1–25 |
| `.claude/hooks/review-pr-hint.mjs` | product | 1–29 |
| `.dependency-cruiser.cjs` | product | 1–72 |
| `.githooks/pre-push` | product | 1–13 |
| `.github/ISSUE_TEMPLATE/config.yml` | product | 1–1 |
| `.github/ISSUE_TEMPLATE/task.yml` | product | 1–82 |
| `.github/workflows/ci.yml` | product | 1–157 |
| `apps/desktop/vite.config.ts` | product | 1–29 |
| `e2e/anchor.ts` | test | 1–59 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/appointment-outcome.spec.ts` | test | 1–809 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/appointments.spec.ts` | test | 1–1009 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/backup.spec.ts` | test | 1–262 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/chart.spec.ts` | test | 1–127 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/customer-ai-web.spec.ts` | test | 1–465 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/customer-ai.spec.ts` | test | 1–974 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/customer-appointments.spec.ts` | test | 1–294 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/customer-forms.spec.ts` | test | 1–449 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/customer-kyc.spec.ts` | test | 1–576 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/customer-policies.spec.ts` | test | 1–311 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/customers.spec.ts` | test | 1–156 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/data-table.spec.ts` | test | 1–199 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/demo-data.spec.ts` | test | 1–107 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/dialog-keyboard.spec.ts` | test | 1–219 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/fixtures.spec.ts` | test | 1–85 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/fixtures.ts` | test | 1–57 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/full-cycle.spec.ts` | test | 1–364 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/guide/check.guide.ts` | test | 1–22 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/guide/links.spec.ts` | test | 1–23 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/guide/links.ts` | test | 1–58 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/guide/shots.guide.ts` | test | 1–234 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/navigation.spec.ts` | test | 1–374 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/overview.spec.ts` | test | 1–234 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/perf/probe.perf.ts` | test | 1–483 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/perf/stats.spec.ts` | test | 1–161 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/perf/stats.ts` | test | 1–218 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/period-picker.spec.ts` | test | 1–340 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/reports.spec.ts` | test | 1–238 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/save-state.spec.ts` | test | 1–153 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/screen-error.spec.ts` | test | 1–73 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/seed-timing.spec.ts` | test | 1–23 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/seeded-snapshot.spec.ts` | test | 1–73 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/seeded-snapshot.ts` | test | 1–20 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/serve.mjs` | test | 1–43 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/settings-ai.spec.ts` | test | 1–405 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/smoke.spec.ts` | test | 1–40 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/support.ts` | test | 1–447 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/team.spec.ts` | test | 1–773 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/theme.spec.ts` | test | 1–226 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/topbar-focus.spec.ts` | test | 1–257 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `e2e/trash.spec.ts` | test | 1–698 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `eslint.config.js` | product | 1–110 |
| `packages/ui/scripts/check-tokens.ts` | product | 1–37 |
| `playwright.config.ts` | test | 1–47 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `playwright.guide.config.ts` | test | 1–38 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `playwright.perf.config.ts` | test | 1–19 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `pnpm-lock.yaml` | generated | Số dòng/phân loại; không review lại lockfile như logic sản phẩm |
| `pnpm-workspace.yaml` | product | 1–7 |
| `tools/bootstrap.ps1` | product | 1–211 |
| `tools/codemap-core.mjs` | product | 1–200 |
| `tools/codemap-core.test.mjs` | test | 1–197 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `tools/codemap.mjs` | product | 1–95 |
| `tools/eval-ai-core.mjs` | product | 1–808 |
| `tools/eval-ai-core.test.mjs` | test | 1–1325 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `tools/eval-ai.mjs` | product | 1–38 |
| `tools/fixtures/ai-eval.mjs` | test | 1–314 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `tools/handoff.mjs` | product | 1–160 |
| `tools/load-data-core.mjs` | product | 1–104 |
| `tools/load-data-core.test.mjs` | test | 1–162 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `tools/load-data.mjs` | product | 1–33 |
| `tools/merge-pr.mjs` | product | 1–160 |
| `tools/notes-core.mjs` | product | 1–267 |
| `tools/notes-core.test.mjs` | test | 1–401 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `tools/notes-for.mjs` | product | 1–95 |
| `tools/pr-core.mjs` | product | 1–340 |
| `tools/pr-core.test.mjs` | test | 1–918 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `tools/pr-status.mjs` | product | 1–175 |
| `tools/pr-status.test.mjs` | test | 1–227 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `tools/retro-core.mjs` | product | 1–260 |
| `tools/retro-core.test.mjs` | test | 1–214 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `tools/retro.mjs` | product | 1–73 |
| `tools/review-hint-core.mjs` | product | 1–27 |
| `tools/review-hint-core.test.mjs` | test | 1–42 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `tools/session-core.mjs` | product | 1–120 |
| `tools/session-core.test.mjs` | test | 1–211 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `tools/session-end.ps1` | product | 1–78 |
| `tools/session-end.test.mjs` | test | 1–69 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `tools/session-io.mjs` | product | 1–14 |
| `tools/session-start.ps1` | product | 1–72 |
| `tools/size-report-core.mjs` | product | 1–369 |
| `tools/size-report-core.test.mjs` | test | 1–321 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `tools/size-report.mjs` | product | 1–48 |
| `tools/status.mjs` | product | 1–77 |
| `tools/ts-hooks-core.mjs` | product | 1–45 |
| `tools/ts-hooks-core.test.mjs` | test | 1–131 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |
| `tools/ts-hooks.mjs` | product | 1–9 |
| `vitest.config.ts` | test | 1–86 (setup, ca/assertion và diff; phần nối theo hợp đồng từng màn) |

Nguồn đối chiếu: CLAUDE.md gốc, packages/ui/CLAUDE.md, CONTEXT.md; spec Phase 6 §4 S-2/TR/D và §5; docs/metrics/phase-6.md; e2e/perf/README.md; ba tổng hợp lượt 1/2/3 và raw F/các ca nối trong docs/reviews/raw/2026-10-15, 17, 21 (nằm trong repo, được phép). common/known.md đủ K1–K40, ACCEPTED/lệch mockup/R1/R2; fixes.md đọc mục tiêu, chấp nhận, PR và ghi chú của các Issue giao F; baseline.md và plan.md L4.2–L4.8. Không thực thi quy trình Claude, hook, skill phát triển hay lệnh gh.

Chỗ nối đọc/chạy thêm: AppData/openAppData, persist-queue/tables/demo-snapshot, commands/team/backup/purge/trash/migration0012, period/reportRows, schema/AI attempts và adapter eval. Báo cáo A–E của chính Codex dùng cho phần kiểm gộp; không đối chiếu báo cáo lượt 4 bên khác. Không đọc cây bị cấm ở ngoài repo. Các công cụ có thể đọc transcript hoặc gọi GitHub chỉ đọc source, không chạy wrapper đó; unit dùng fixture/mock có sẵn.

## 4. Kịch bản mới đã thử

N1–N5 là năm chuỗi nhiều bước qua lớp dữ liệu app, DB/domain và báo cáo/backup/lưu; không chèn SQL thô để kết luận màn. N6/N7/N9/N10 chạy trên build web riêng, `VITE_DEMO_ANCHOR=15/09/2026`, Edge, 127.0.0.1:4316. Mọi context chặn mạng ngoài127.0.0.1 và thay window.open trước điều hướng đầu. Không dịch vụ AI thật. Số bundle của bản probe có biến riêng không dùng làm baseline.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| N1 | Sinh backup bằng source 119 e2e4 → AppData R4 đọc/nhập → report Năm → xuất → AppData thứ hai nhập → report | PASS: giữ nguyên cả12 bảng của backup cũ và báo cáo;4 team/51 người/1.481 KH/10.255 lịch/1.674 HĐ sống | — |
| N2 | File DB thật do source R3 ghi → mở qua AppData R4 → check trước migrate → backup →0012 → lưu → đọc tables/report | PASS: events đúng backup,save; đúng1 lần save; mọi bảng nguyên, integrity_check không có lỗi | — |
| N3 | Nhập tải → tạo team trong lúc DISK_FULL → xuất dữ liệu chưa lưu → thử nhập bị D7 → hết lỗi/Thử lại → nhập chính bản xuất → flush | PASS: D7 không đổi generation; team mới còn; saving=false,failed=false và file14.102.528 B | — |
| N4 | Nhập tải → xếp Dọn sạch bị lỗi backup → xếp ngay Nhập hợp lệ → chờ/flush → báo cáo | PASS: lần đầu BACKUP_LOCKED, lần sau thành công; generation2; hàng đợi hết bận, số sống và report nguyên | — |
| N5 | Nhập tải → đổi hash KYC mới nhất của bản backup thử → đọc bị từ chối → preview/dọn bản hợp lệ → báo cáo → xuất/nhập → báo cáo | PASS: backup sai BACKUP_INVALID, generation không đổi; dọn113 dòng,kept0,rác0; report trước/sau giống nhau | — |
| N6 | UTC+14: mở Tổng quan → clock+11 phút → reload → mở trang Báo cáo mới cùng context | PASS:09:41 ngày15/09/2026, trang mới cùng ngày. Kết hợp callback guide tại Honolulu, control/rollback cho đúng giờ | — |
| N7 | KH → Bảng100 dòng → cuộn3312px → rightOfSidebar → chụp | PASS: clip trước/sau đều x232,y0,w1208,h4212; gỡ cuộn trước đo làm reviewer e2e đỏ | — |
| N8 | OPEN note nêu folder packages/ai/src/ → targetPatterns với glob ở cấp package → relatedNotes → formatRelated | Sai: glob packages/*/src/schema.ts báo không có ghi chú; đổi glob cụ thể hoặc ** thì thấy1. Source119e2e4 cũng sai | CXR4-F1 |
| N9 | Chụp đủ guide hiện tại → đối chiếu28 PNG commit → bỏ style bảo vệ chân ảnh → chạy lại13 check → so pixel | Control28/28 byte giống; mutant vẫn13/13 xanh nhưng ảnh KYC hụt8 hàng chân thẻ. Checker ảnh của reviewer đỏ | CXR4-F2 |
| N10 | AI request giả lỗi trong lúc ở Settings → trở lại thấy lỗi → rời sang Settings rồi trở lại | PASS3/3 không retry: chờ heading thật làm unmount, lỗi chỉ nói một lần; không gọi API thật | — |
| N11 | Cùng DB tải mới → xen kẽ query listTrash R3/R4 → bỏ hai index0012 → listTrash/preview lần nữa | PASS:113 dòng và toàn plan deepEqual; số đo ở mục6 | — |

**Dữ liệu tải đối chiếu hai SHA:** R3 sinh lại từ Git119e2e4 với bộ alias của riêng bản chép (không vô tình import @p2c hiện tại), hash `1c0a43fb9d5711df4700cb688a256ac50bb44eed1c0fd00218fa36f0746d003f`. R4 common hash `ad82051b19415726ff2be3d86357aeb463b9f13205a30d4531667aa5a9492e25`. Cùng số dòng ở12 bảng; **chỉ103 ai_analyses.prompt_version khác**, @3→@4 (K31). Mọi cột của appointments/coordinators/customers/KYC/people/policies/transitions/teams/settings bằng nhau, kể cả thứ tự dòng. Không phải chỉ so counts/hash rồi suy đoán nguyên nhân. N1 chứng minh backup do R3 xuất vẫn qua bảy luật nhập R4 trên dữ liệu hợp lệ này; không khẳng định mọi file từng sửa tay hay mọi backup Phase5 đều được nhận (K1).

## 5. Phát hiện mới riêng F

**2 Low, đều CONFIRMED;0 PLAUSIBLE.** Không nâng mức do giả định hậu quả chưa chạy. CXR4-F1 có từ trước; CXR4-F2 là lỗ kiểm của phần sửa ảnh mới sau lượt 3. Các lỗi chức năng cũ trong bảng R không ghi lại ở đây.

### CXR4-F1 — Glob ở cấp package bỏ sót ghi chú cho thư mục bên trong

ID: CXR4-F1  
Mức: Low  
Trục: E  
Vị trí: tools/notes-core.mjs:198, trong covers tại:194 (2e51e25); chỗ dùng relatedNotes:220  
Tình trạng: CONFIRMED  
Liên quan: có từ trước, lượt 1–3 bỏ sót; biến thể gần DR6-130, ngoài hai mô tả cũ thư mục trùng/brace lồng. Không phải hồi quy của #736.  
Kịch bản: N8

Mô tả: khi note là folder, covers chỉ xét phần tiền tố trước dấu * đầu tiên và chỉ cho qua vế sau nếu target có **. Một dấu * khớp đúng cấp package vì vậy không tìm ra folder thực sự nằm trong glob.

Tái hiện / bằng chứng: chạy `node C:\workspace\deep-review-1-6-r4\codex\F\notes-glob.mjs` (exit0; notes-glob.json). Danh sách repo thử có packages/ai/src/schema.ts và packages/db/src/schema.ts; OPEN `- \`packages/ai/src/\`: kiểm schema.` được openNotes nhận đúng. targetPatterns(['packages/*/src/schema.ts']) giữ glob, nhưng relatedNotes trả exact=[],area=[]; formatRelated in **“Không có ghi chú OPEN nào nêu các file này.”** Hai đối chứng packages/ai/src/*.ts và packages/**/schema.ts đều trả area một mục. bloat-scan.mjs dùng notes-core lấy từ119 e2e4 cho cùng kết quả sai (notes-glob-r3.json). Không chạy CLI gh hay đổi ledger repo.

Ảnh hưởng: khi soạn Issue/dùng notes-for --files hoặc trường allowed paths có wildcard ở cấp package, người phát triển có thể không thấy ghi chú OPEN trong vùng cần đọc. Đây là bỏ sót **Trong vùng**, không phải lách một mục Trùng file bắt buộc; sổ hiện tại OPEN rỗng, không có thao tác người dùng app mất dữ liệu.

Đề xuất: so glob với phần thư mục theo từng segment, hoặc mở glob trên danh sách file repo trước khi đối chiếu folder và giữ quy tắc cho file tương lai; thêm hai đối chứng single*/**. Ước ≤50 dòng SP, dưới400.

### CXR4-F2 — Bộ kiểm ảnh không bắt việc bỏ sửa giữ chân thẻ của T-312

ID: CXR4-F2  
Mức: Low  
Trục: T (phụ R)  
Vị trí: e2e/guide/check.guide.ts:15–21; phần sửa cần giữ ở e2e/guide/shots.guide.ts:34 (2e51e25)  
Tình trạng: CONFIRMED  
Liên quan: T-312 → PR #882; lỗ kiểm của phần sửa mới sau lượt 3.  
Kịch bản: N9

Mô tả: các check hiện tại chỉ kiểm link, ảnh tồn tại và ngân sách byte. Gỡ style `header { position: static… } main * { scroll-margin-top:0… }` vẫn qua toàn bộ bộ chụp/check, dù đường chụp thẻ cao lại mất phần chân mà PR sửa.

Tái hiện / bằng chứng: `node C:\workspace\deep-review-1-6-r4\codex\F\guide-style-mutate.mjs`, bản chép, finally trả nguyên source/ảnh. T312-style.log: **13 passed**, exit0,0 retry. Control28 PNG trùng byte ảnh commit. Chỉ 05-du-kien-kyc.png khác: cả hai376×828 px; control76.038 B, mutant75.813 B. Đã mở xem hai ảnh. guide-pixels.mjs/ T312-pixels.json giải mã ảnh bằng canvas: **2.942 pixel khác, chỉ ở y820…827**, chân/viền cuối thẻ hụt8 hàng; không có bằng chứng mất chữ KYC ở mẫu này. Reviewer thêm image-regression-check.mjs so baseline ảnh đã có trong repo: control exit0, mutant exit1, log T312-reviewer-check.log. Checker này chưa có trong repo và không được nhận là test mà PR #882 đã thêm.

Ảnh hưởng: một lần sửa helper sau này có thể làm ảnh hướng dẫn cụt chân mà mọi kiểm hướng dẫn vẫn xanh. **Ảnh đang commit và ảnh hiện tại đều đúng**; đây là lỗ kiểm hồi quy, không phải hồi quy đã xảy ra ở app hay mất dữ liệu. Không áp dụng mức Medium cho lỗi kiểm hình thức này.

Đề xuất: bổ sung một kiểm hồi quy cho ảnh thẻ cao gần chiều cao cửa sổ, kiểm cả chân thẻ bằng baseline/pixel hoặc một seam vẽ kiểm được; chứng minh gỡ style làm test đỏ. Tránh chỉ kiểm tên class/style hay thêm thư viện mới. Ước0–20 SP +30–60 dòng test; dưới400 SP.

## 6. Bloat

| Đã chạy / đo | Dữ liệu / phạm vi | Số / kết quả | ID |
|---|---|---|---|
| Classifier và diff | Tracked ở SHA ghim | F4.440 SP(+100 soR3),16.860 test(+2.695),4.628sinh,96 file(+5); SPdiff+152/−52 | — |
| tsc --noUnusedLocals --noUnusedParameters --noEmit | domain/db/ai/ui/desktop | Năm project exit0; log unused-*.log | — |
| codemap --check, dependency-cruiser | Toàn apps/packages | Export maps up to date;341 module/1.435 dependency,0violation | — |
| check-tokens CLI và test | App/UI | Exit0; flex1/mark mutants mỗi mẫu1/16 đỏ | — |
| AST scan thân hàm chính xác |189 file SP TypeScript/TSX; bỏ comment/whitespace,≥120 ký tự |0 nhóm cùng thân≥3 nơi; không chứng minh hết clone ngữ nghĩa | — |
| CARD/ALERT/LINK/HEADING/BADGE/cột báo cáo | Toàn app, nối D/E | Năm class khai một nơi;17 cột dùng cho màn/Excel; không thấy mục DR6-66/67 cũ còn sót trong danh sách | — |
| JS chính | Baseline build chuẩn, không biến riêng |884.698 B, R3 927.932:−43.234 B; riêng #830 đã đo−62.735 B min | — |
| CSS/tổngJS-CSS | Cùng baseline |29.752 B(+1.268);tổng2.358.427 B(−41.966),gzip697.134 B(−9.620 soR3) | — |
| Asset web mới | T-308, đã duyệt |Font21.884 B+logo149.070 B+favicon2.465 B−SVG494B=+172.925 B;wasm/font Be Vietnam Pro không đổi | — |
| Exe/icon | Baseline common/exe |5.649.408 B so5.408.768:+240.640 B;ICO87.968 so16.625:+71.343;169.297 B còn lại là asset nhúng và Rust, không tách giả | — |
| Guide/ảnh logo trùng |28 ảnh source hiện tại, cả bộ tái sinh |1.942.246 B,max 141.536 B;28/28 trùng byte. Logo mockup copy là ACCEPTED có lý do hợp đồng G3 | — |

Không phát hiện B mới có chi phí đo được. Không gọi giữ nguyên tài sản thương hiệu được duyệt là bloat. T-285/286/288/301/305 có đối chứng hành vi trong A–E; N1–N5 và đối chiếu dữ liệu tải không thấy thay dữ liệu ngoài103 version prompt có chủ ý. Không cài công cụ mới. Build phục vụ browser có anchor riêng; số cỡ chuẩn lấy baseline đã dựng đúng SHA/không biến riêng, không trộn hai bản.

## 6b. Hiệu năng

Máy **DESKTOP-KDURKJP/Home PC**, Nodev24.20.0. Dữ liệu đúng common/load/load-2026-10-12-seed6.p2cbackup, hash đã kiểm ở mục4. Đo Node hai cỡ5 DB mới mỗi cỡ; cùng probe purge-node.mjs của common. Khi đo không build/e2e/benchmark nào của phiên chạy song song; Codex desktop và server loopback đang mở, server rảnh. Không đọc hoạt động phiên khác; không tự đo exe mới để gây tranh cổng/máy. Log và toàn mẫu giữ nguyên, không chọn số thuận lợi rồi bỏ số chậm.

| Node, ms | R4:113 dòng, median(min–max) | R3 Codex F | R4:1.313 dòng, median(min–max) | R3 Codex F |
|---|---:|---:|---:|---:|
| listTrashBefore | 24.189 (22.428–37.475) | 34.054 | 133.059 (132.469–143.236) | 151.553 |
| previewPurge | 0.953 (0.924–1.184) | 5.822 | 5.963 (5.872–6.117) | 10.100 |
| purgeTrash | 83.511 (82.783–90.262) | 95.238 | 116.051 (114.133–118.575) | 106.862 |
| purgeTrashWithoutVacuum | 23.978 (21.366–26.397) | 32.818 | 111.705 (110.047–113.878) | 102.335 |
| vacuum | 62.107 (59.364–63.865) | 62.421 | 4.345 (4.086–4.697) | 3.797 |
| export | 2.346 (2.022–3.399) | 2.051 | 0.396 (0.375–0.458) | 0.368 |
| listTrashAfter | 1.988 (0.913–2.489) | 10.918 | 0.648 (0.610–0.699) | 1.897 |

Không dòng Node nào tăng vượt đồng thời **20% và10 ms** so số Codex F R3 cùng đường gọi. Cỡ113:14.102.528→13.438.976 B; cỡ1.313:14.151.680→1.495.040 B;10/10 mẫu về0rác,0kept. So common R3 cũng không có cờ. Các số Node không dùng thay thời gian từ nút bấm tới khung hình trên exe.

**CL3-A29/T-287 đối chứng cặp** (index-perf.json,21:02:16+07,7 mẫu xen kẽ mỗi bên, cùng DB tải/current handle): listTrash R4 **18,927**(18,057–20,304)ms; source query R3 trên cùng handle **20,636**(19,704–21,861); bỏ hai index0012 **25,247**(24,458–26,190). Cùng113 dòng/toàn nội dung và cùng purgePlan. Đây là cô lập đường query, không giả chạy toàn exe cũ. Bỏ early-return hoặc0012 có test gốc đỏ; `CROSS JOIN` bắt đầu từ dòng đã xóa theo test query plan.

**Exe — dùng số chuẩn bị common được prompt cho phép**, không nhận là F đo mới. perf-compare.json đối chiếu đủ các op với mốc sau#656 và R3: không op nào vượt cả hai điều kiện nhiễu; mọi op đạt ngưỡng. Chỉ số giới hạn MB giữ5 MB; thao tác màn<200 ms; reload<500 ms. Bảng dưới ghi số gốc JSON, đơn vị ở tên.

| Exe, dữ liệu tải | Sau #656 | R3 | R4 | Ngưỡng |
|---|---:|---:|---:|---|
| `app.open-data` (ms) | 387 | 372.9 | 370.3 | — |
| `backup.read` (ms) | 835.2 | 826.5 | 977.4 | — |
| `backup.import` (ms) | 42.7 | 46.6 | 47.4 | — |
| `db.save` (ms) | 151 | 146.4 | 148.7 | — |
| `reload.overview` (ms) | 398.2 | 392.4 | 405.1 | — |
| `reload.appointments` (ms) | 390.6 | 383.3 | 392.9 | — |
| `reload.customers` (ms) | 336.3 | 307.3 | 317 | — |
| `reload.reports` (ms) | 376.4 | 365.5 | 372.5 | — |
| `reload.team` (ms) | 354.6 | 348.2 | 359.4 | — |
| `reload.settings` (ms) | 283.4 | 280.3 | 279.2 | — |
| `appointments.period-day` (ms) | 8.2 | 8.1 | 6.9 | 200 |
| `appointments.period-week` (ms) | 11.6 | 13.4 | 12.7 | 200 |
| `appointments.period-month` (ms) | 13.2 | 13.7 | 10.5 | 200 |
| `appointments.period-year` (ms) | 16.8 | 17.5 | 17.2 | 200 |
| `appointments.sort-date-asc` (ms) | 17.2 | 17.7 | 17.1 | 200 |
| `appointments.sort-date-desc` (ms) | 11.4 | 12 | 11.2 | 200 |
| `appointments.select-row-year` (ms) | 5.9 | 6.4 | 6.5 | 200 |
| `appointments.select-day-month` (ms) | 9.3 | 8.3 | 9.4 | 200 |
| `appointments.select-row-month` (ms) | 7.2 | 6.1 | 7 | 200 |
| `customers.view-table` (ms) | 19.5 | 19.2 | 19.3 | 200 |
| `customers.sort-name` (ms) | 22.7 | 21.7 | 23.9 | 200 |
| `customer.open-ai` (ms) | 19.2 | 18.8 | 20.1 | 200 |
| `customer.ai-history` (ms) | 2 | 2 | 2.3 | 200 |
| `overview.filter-year` (ms) | 15.5 | 15.1 | 17 | 200 |
| `overview.filter-month` (ms) | 14.2 | 14.3 | 17.1 | 200 |
| `reports.filter-year` (ms) | 10 | 9.3 | 9.5 | 200 |
| `reports.filter-month` (ms) | 9.8 | 9.9 | 10.2 | 200 |
| `reports.table-re` (ms) | 17.3 | 17 | 17.2 | 200 |
| `trash.kind-appointments` (ms) | 5.9 | 5.8 | 6.2 | 200 |
| `memory.js-heap` (MB) | 16.5 | 16.6 | 16.6 | — |
| `trash.open` (ms) | 34.1 | 37.6 | 31.9 | 200 |
| `reports.export-excel` (ms) | 19.6 | 23.4 | 28.9 | — |
| `backup.export` (ms) | 438.3 | 424.6 | 435.7 | — |
| `appointments.next-month` (ms) | 100.7 | 103 | 108.3 | — |
| `appointments.next-year` (ms) | 107.3 | 106.2 | 113.3 | — |

Ngoài ops: mở lần đầu LCP **3.521 ms**, sau#6563.663,R3 3.614; dưới mốc nhiễu4.396 và ngưỡng Phase 4 4.724 ms. Dọn exe113 dòng **123,3 ms** tới 11j (một mẫu common), R3 151,8 ms, ngưỡng ≤500; lần lưu đầu146,0 ms; không gọi một mẫu là trung vị. Số common Node cỡ lớn có nhiễu (listTrash158,2,purge129,8), nhưng so commonR3 chỉ+12%/+18%, không đủ luật; phép Node F mới133,1/116,1 ms cũng không xác nhận hồi quy. Không có phát hiện P mới.

## 7. Đếm mức × trục

Chỉ phát hiện mới riêng F, không đếm các dòng R hay checker reviewer như phát hiện nữa. **2/2 CONFIRMED,0 PLAUSIBLE,0 KNOWN mới**.

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical |0|0|0|0|0|0|0|0|0|0|0|
| High |0|0|0|0|0|0|0|0|0|0|0|
| Medium |0|0|0|0|0|0|0|0|0|0|0|
| Low |0|1|0|0|0|0|0|0|1|0|2|
| Nit |0|0|0|0|0|0|0|0|0|0|0|

Riêng đếm phục vụ kết luận của chính Codex A–F: **8 Low**,0 Medium/High/Critical/Nit, đều CONFIRMED; E3,C3,D1,T1. Không gộp với bất kỳ bên khác.

## 8. Đã xét, không thấy / kết luận v1.0

| Trục | Đã chạy / đọc, kết luận có giới hạn |
|---|---|
| R | R1 đủ37/R2 đủ32, từng dòng có nguồn A–E/F; gỡ sửa các phần F, ghi riêng checker PR/reviewer và mutant sống. Đường lỗi gốc đã sửa; lỗ kiểm ảnh mới làF2, không che bằng checker bổ sung. |
| E | N1–N11, queue thất bại/tiếp tục, Unicode ledger, brace/timezone/reload; ngoàiF1 không thấy lỗi mới trong ca đã chạy. |
| C | SpecS2/TR/D, hợp đồng app↔db, guide/metrics và tên mới nối A–E.28 ảnh đúng byte,19/19 số PR khớp. Không sửa spec/golden/mockup cho hợp code. |
| D | Toàn12bảng trước/sau hai SHA giải thích được; backupR3/FileR3 và vòng xuất/nhập/purge giữ dữ liệu sống/report; N3D7 không thay dữ liệu, N4 lỗi không kẹt. |
| G | Eval code đi qua validator/attempts chung; controltools dùng fetch giả, không evalAI thật. Phần guard/schema chuyên sâu lấy C; không khẳng định chất lượng mọi câu trả lời model thật. |
| S | Đọc đường secret/body/error/escape/cap của eval và raw tests; không gọi wrapperAI/GitHub. Browser chặn mạng, IPC giả,window.open thay sớm; không đọc key. Không thấy đường lộ key mới trong code/test đã xét. |
| P | Đo tải đúng hash/cùng máy, đủ mẫu ở mục6b, so hai nền/luật nhiễu; không hồi quy đủ bằng chứng. |
| B | Năm noUnused/deps/codemap, ASTscan/callers/class/export, splitbundle/font/icon; không bloat mới có chi phí đo được. |
| T | Unitfinal416/416, e2e-final11/11,helper11/11,T314 repeat3/3 và control cuối1/1,guide13/13. Mutant và control thật; test guide còn hởF2. waitForTimeout6000 của Hủy reload kiểm việc không được xảy ra; catch của eval đi kèmassert loại lỗi/nội dung, không giả xanh. |
| A | Role/nhãn/i18n và helper contrast/focus/table được đối chiếu các ca D/E; F kiểm clock/helper/guide, không đo lại toàn bộ contrast/keyboardnative. Không thấy phát hiện A mới trong phạm vi F. |

**CHƯA SẴN SÀNG cho v1.0 ở SHA2e51e25**, theo quyết định Owner sửa hết trước G7/v1.0 (K32/K40), vì còn tám phát hiện Low của chính Codex cần xử lý. Không có bằng chứng Medium trở lên hay thao tác vượt ngân sách hiệu năng đã chốt. Không biến “các cổng xanh” thành kết luận mọi việc đã xong.

| Nguồn Codex lượt 4 | Phát hiện còn lại để kết luận | Mức / trục |
|---|---|---|
| A.md §5 | CXR4-A1: model label UTF-16/BOM, lệnh nhận nhưng backup có thể bị từ chối | Low/D; chưa có đường tạo từ UI hiện tại |
| B.md §5 | Không phát hiện mới | — |
| C.md §5 | CXR4-C1: Mock lấy một thông tin ghi chú nói “là sai” | Low/C; đề xuất còn cần RE xác nhận |
| D.md §5 | CXR4-D1: title dialog tên KH dài; CXR4-D2: tên team/người hỗ trợ tràn |2 Low/E |
| E.md §5 | CXR4-E1: bảng team tràn; CXR4-E2: cột RE ghim che số |2 Low/C |
| F.md §5 | CXR4-F1: glob bỏ sót notefolder; CXR4-F2: test ảnh không bắt chân thẻ cụt |2 Low/E,T |

Bảng R gộp kết luận sửa **đường lỗi/mục tiêu cũ**; phần test ảnh của T312 hiện có chưa bắt mutant, đã nói rõ trong dòng R vàF2. Không nhận code/ảnh hiện tại sai. Không tạo Issue/PR, không đề xuất merge và không tổng hợp với bên khác; chờ Owner yêu cầu bước tổng hợp sau đủ gói.

## 9. Phụ lục bằng chứng / kiểm cuối

### 9.1 Lệnh và nguồn

Tất cả file dưới đây ở C:\workspace\deep-review-1-6-r4\codex\F\, trừ repo/common ghi rõ. Không chạy pnpm trong bản chép. Node/Playwright/Vitest/TypeScript/dependency-cruiser dùng bản đã cài.

| Nguồn / lệnh chính | Đầu ra / ý nghĩa |
|---|---|
| setup.mjs,inventory.mjs | Bản chép793file tracked,junction node_modules có sẵn; scope.json,size-lines.json,diff-F.patch,inherited-rows.json. Lượt setup đầu so sai kiểu trả về classifier cho scope0, inventory sửa đúng .pkg→96; không dùng số0 làm kết luận. |
| node node_modules/vitest/vitest.mjs run tools packages/ui/src/token-guard.test.ts | unit-control.log:13 file/357 test xanh ở repo; unit-final.log thêm purge/database,15 file/416 test xanh ở copy |
| mutate.mjs,extra-mutations.mjs,trash-mutate.mjs | mutations.json,extra-mutations.json,trash-mutations.json và từng log; finally trả bytes nguồn |
| browser-setup.mjs,server.mjs,review.config.ts | Build/HTTP riêng4316; build-web.log; fixture context chặn mạng/window.open trước mở. Lượt server đầu static-import TS trước hook lỗi, sửa dynamicimport đúng rồi mới chạy browser. |
| browser-mutate.mjs | browser-mutations.json,R129-no-clock/T283-zone/T283-eve/T302-dynamic/T316-clip.log |
| node …/@playwright/test/cli.js test -c F/review.config.ts … | e2e-control7/7;guide-control-2 hai ca bổ sung xanh;e2e-final11/11. Probe clip đầu dùng màn chưa có độ cuộn thật, bịassertscroll0; đổi sang Bảng100dòng, control/mutant có ý nghĩa. |
| guide-clock-check.mjs,guide-clock-repeat.mjs | T305-clock-control-2.log exit0,T305-clock-mut-2.log exit1; lượt đầu lỗi probe ReferenceError được loại |
| guide-run-setup.mjs + guide.config.ts | guide-all.log:13/13; ảnh tại copy/docs/user-guide/img,nguồn repo không đổi |
| guide-style-mutate.mjs,guide-pixels.mjs,guide-image-audit.mjs | T312-style.json/log,pixels.json,guide-images.json;guide-good/guide-style-mut giữ đôiảnh;image-regression-check.mjs và T312-reviewer-check.log |
| prepare-r3.mjs,build-old-load.mjs,load-compare.mjs | ref-r3/,load-r3.p2cbackup,data-r3.db,load-r3-meta.json,load-diff.json; tái tạo SHA R3 đúng hash |
| cross-data.mjs | cross-data.log/json:N1–N5 qua AppData/tables,không kết luậnmàn từSQLthô |
| purge-node.mjs repo common/load/… F/purge-node.json 5 | purge-node.log/json:10 mẫu,đủ min/max/median; số ở6b |
| index-perf.mjs | index-perf.json:7 mẫu/cặp,đủ nội dung cùng plan,khi bỏ index chỉ DB thử |
| bloat-gates.mjs,bloat-scan.mjs | unused-*.log,codemap.log,tokens.log,deps-final.log,duplicates.json; lượtdepsđầu gọi nhầm tênCLI lỗiMODULE_NOT_FOUND, chạy đúngbin/dependency-cruiser.mjs exit0 |
| metrics-audit.mjs,test-audit.mjs | metrics-audit.json,metrics-match.json:241/87/19 và19/19khớp;test-audit.json. Lượt parserđầu trộnnumstatmặcđịnhvớiunified0 lệch#617; đồng bộunified3/đếmcontext,asserttừngpatch, chạy lạiexit0. |
| notes-glob.mjs,bloat-scan.mjs | notes-glob.json,notes-glob-r3.json:bằng chứngF1;chỉdữ liệugiả,cũng đúng code R3 |
| report-build.mjs,report-tail.md,report-counts.json | Rgộp tự kiểm37/32,không thêm69;progress.md giữnhật kýghi dần |

### 9.2 Đột biến và loại bằng chứng

| Mẫu | Kết quả kiểm sau gỡ | Loại / log |
|---|---|---|
| R130-folder / brace / separator | Mỗi mẫu1/28đỏ | Test gốc notes-core |
| T283-tested |1/10đỏ | Test gốc formatStatus |
| T283-renamed-data |1/10đỏ | Test gốc dữ liệuđổitên,giữ nguyênquerymock |
| T302-docs |2/78đỏ | Test gốc parser docsRead |
| T304-lint |1/78đỏ | Test gốc ESLint |
| T310-package |3/74đỏ | Test gốc classifier |
| T300-flex / T301-mark | Mỗi mẫu1/16đỏ | Test gốc token-guard |
| R129-no-clock / T283-zone / T283-eve / T302-dynamic | Mỗi mẫu1e2e đỏ | Test gốc fixture/lint |
| CL3-empty / CL3-index | Mỗi mẫu1unit đỏ | Test gốc purge/database; hai phần sửa độc lập |
| T316-clip |1 e2e đỏ | Reviewer test,nguyên helper nguồn trích ra; chưa phải testPR |
| T305-clock | Control0/mutant1 exit | Reviewer test,nguyên callback guide tại Honolulu |
| T314-no-wait |3/3 e2e đỏ; control sau hoàn nguyên1/1 xanh | Test đã sửa, không chờ Settings làm alert còn |
| T312-style | **SỐNG:13/13 test gốcxanh** | F2; checkerảnh reviewer control0/mutant1exit; không tính checker này để che mutant sống |
| T283-renamed ban đầu |9/10đỏdo fake mock không nhận queryđổi | **Loại**:giao thức mock,khôngphảichứng minh hành vi; đã thay bằng renamed-data |

Bộ chọn có **20 đột biến có nghĩa**: **19 bị test/gate tương ứng giết** (trong đó 2 bằng e2e bổ sung của reviewer), **1 sống ở bộ test gốc** (T312-style). Checker ảnh bổ sung của reviewer làm mẫu sống này đỏ. Một mẫu mock-protocol bị loại. Lượt T314 đầu chạy khi server đã dừng chỉ lỗi kết nối, được giữ riêng tại T314-no-wait-server-stopped.log và loại khỏi bằng chứng; đã chạy lại khi server READY. Không gọi 20 mẫu là mutation coverage toàn repo. Các rollback class/export tương đương hành vi của A–E là kiểm cấu trúc; không ép behavioral test phân biệt hai cách viết cùng kết quả.

### 9.3 Kiểm cuối

- Nguồn worktree sản phẩm không sửa. SHA/status cuối và manifest ở final-check.json; phải đúng SHA ghim và status rỗng như đầu phiên.
- Control sau hoàn nguyên: **416/416 unit**, **11/11 e2ecuối**,helper11/11,T314 repeat3/3 và control cuối1/1,guide13/13. Gốc baseline còn verify3.975 unit/Rust116/e2e308, không nhận đã chạy lại cả ba cổng này.
- Không có pnpm trong copy,không cài tool,không gh,không gọi dịch vụ AI thật,không mở chatgpt.com/đọc key,không tác động báo cáo bên khác.
- Máy chủ4316 của phiên được dừng sau kiểm, không giữ cổng 4173/9222 hay mởexe mới.
- Giờ xong: 2026-10-29 21:28:05 +07:00 (Asia/Bangkok).

Kiểm đóng báo cáo: SHA cuối `2e51e25eb0125f56d3d938b97ef18d6873dae076`; `git status --short` rỗng; `git diff --exit-code` exit0; server4316 đã dừng;36 file SP của F và các file đột biến bổ sung trong bản chép đều trả nguyên byte. Giờ xong 2026-10-29 21:28:05 +07:00.
