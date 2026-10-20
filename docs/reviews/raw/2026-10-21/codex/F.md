XONG — codex gói F lượt 3, 2026-10-21 00:36:09 +07:00

# Deep review Phase 1–6, lượt 3 — Codex, gói F

## 1. Thông tin phiên

- Bên: Codex; gói F — Xuyên gói, bloat / hiệu năng, công cụ. SHA đầu/cuối **119e2e45cbce54d8a3943757bd826a7f1e9b694f**, detached tại `C:/workspace/Project-2C-review-2`.
- Git status đầu: `?? .agents/`, `?? .codex/`, `?? AGENTS.md`; các mục có sẵn, giữ nguyên.
- Bắt đầu **20/10/2026 20:08:39 +07:00**. Phiên bị ngắt sau khi dispatch mutation; **làm tiếp ngày 21/10/2026** theo tin nhắn “tiếp tục” của anh, từ control/mutation đã xong. Không làm lại hay ghi đè phát hiện đã ghi; lịch sử tiến độ nguyên văn ở `F/progress-history.md`.
- Máy **DESKTOP-KDURKJP**, Node v24.20.0. Công cụ Codex desktop, PowerShell, Node/Git/rg, Vitest 5.0.1, TypeScript 6.0.3, Playwright/Edge, WebView2/sql.js và dependency sẵn có. Model GPT-6 theo ngữ cảnh hệ thống; runtime không công bố biến thể/mức effort, không tự gán hay đổi cấu hình Owner.
- Không subagent, gh, Issue, PR, merge, commit, nghi thức phiên, AI thật, key thật hay ChatGPT thật; không cài công cụ/dependency. Các script dev có gọi GitHub chỉ được đọc hoặc chạy qua I/O giả trong unit test. Không truy cập các thư mục reviewer bị cấm hoặc Project-2.
- Đầu phiên kiểm từng đường dẫn: F chưa có, A–E đều XONG. F chỉ dùng A–E lượt 3 của **chính Codex** để gộp R/kết luận; không đọc báo cáo lượt 3 bên khác.
- Mọi bản chép/probe/log nằm ở `C:/workspace/deep-review-1-6-r3/codex/F/`. Repo không bị patch. Bản chép dùng junction dependency hiện có, Git index riêng để test đọc `git ls-files`; không commit/pnpm install.
- Browser web probe chặn request ngoài hostname `127.0.0.1`, thay `window.open` trước goto. Exe mở với DNS ngoài localhost bị chặn từ lúc launch; sau attach CDP chờ document Tauri, cài route cùng giới hạn và stub window.open trước tương tác. `legacy-results.json` ghi externalBlocked=[]; không gọi chức năng AI của exe.

**Kết quả riêng F:** 7/7 mục R ĐÃ SỬA; **1 Low CONFIRMED**, trục T. **10/10 đột biến** bị test bắt. 323 test tools xanh; E20 và fixture múi giờ xanh; E2E cuối **55/55 xanh**. Năm chuỗi mới AppData qua nhiều gói xanh; thêm mở DB exe cũ bằng exe mới và ca qua nửa đêm. Không xác nhận mất/sai dữ liệu hay P/B mới.

## 2. Bảng R riêng gói F

| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| 69 | #652 → #666 | ĐÃ SỬA | E20 control 6/6; R69-mutant bỏ seq làm 3 test đỏ. A replay clock bằng/lùi qua export/import cũng chặn. | Cùng instant/clock lùi và chuyển trước xóa; xem R69-R92.json, A §2. |
| 76 | #657 → #680 | ĐÃ SỬA | Tools control 55/55 (trong 323 tools); bỏ lớp đọc thứ hai: 4 test đỏ. Core thêm 56 ca: 28 chặn/28 che; B kiểm Rust. | Trộn escape theo từng ký tự, key 1/2/3/21 ký tự, message Unicode sát 200; ba lớp ngoài K23. |
| 84 | #662 → #707/#709/#710 | ĐÃ SỬA | Purge 113/1.313 dòng, 5 DB mới/cỡ: 0 rác/0 kept; N1–N6 giữ dữ liệu sống/KPI/backup/migration. A/B/E có mutation lệnh/hàng đợi/màn đỏ. | 95,2/106,9ms Node; exe common 151,8ms tới notice, trash.open 38,9→9,6ms; xem §6b. |
| 85 | #660 → #689 | ĐÃ SỬA | 6/6 pr-status control; bỏ paginate: 3 đỏ; bỏ guard count: 2 đỏ. Không gọi gh thật. | 251 commit, code lâu nhất; 250/251 hoặc count=null chặn; 0 commit qua. API giả theo contract, không xác minh GitHub live. |
| 86 | #660 → #689 | ĐÃ SỬA | 17/17 retro control; bỏ đa config/khử trùng: 3/2 test đỏ. CLI fixture thực hai config + junction/uppercase chỉ in 2 phiên. | realpathSync.native; unit có spelling8.3/trailing separator, không tuyên bố tạo alias8.3 thực. |
| 92 | #660 → #689; #691 → #702 liên quan | ĐÃ SỬA | imports again xanh UTC−11 và UTC+12; trả clock11h→10h làm ca UTC−11 đỏ. Sinh lại tải CLI hash chuẩn. | R92 JSON/log; A cùng kết luận. Không mở rộng bảo đảm sang UTC+13 KNOWN. |
| 98 | #665/#695 → #696; #660 → #689 | ĐÃ SỬA | Metrics có mốc Home PC sau integrity_check; README/probe đo trash.open detached sau memory. BaselineJSON: không dòng nào xấu hơn sau #656. | So R2 app.open-data tăng do K24; trash.open cũ gắn DevTools không so trực tiếp. 9 stats test Playwright xanh. |

Mục sửa tài liệu R98 kiểm dòng đã có và so số thật; không tạo đột biến vô nghĩa cho văn bản. R84 là quyết định **dọn tay K27**, không phải yêu cầu bỏ mọi chi phí tuyến tính của Thùng rác. Các biến thể mới của A–E và F không tự đổi kết luận về đường lỗi gốc.

### 2.1 Bảng R gộp đủ 39 DR6 của chính Codex

Bằng chứng nguyên văn rút từ bảng R A–E, bổ sung phần F. “Nguồn” chỉ báo cáo lượt 3 của Codex trong cùng thư mục; đây không phải tổng hợp các reviewer. Các kết luận “phần A/B/D” được đối chiếu với báo cáo gói cùng kiểm trước khi chốt chung. **39/39 ĐÃ SỬA; 0 SỬA MỘT PHẦN, 0 CHƯA SỬA, 0 HỒI QUY.**

| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-17 | #661 → #698 (8f7355b) | ĐÃ SỬA | core-results.json R17: NFD + U+200B trước dấu ở V3/V4/V5/V6 đều bị chặn; Điều/Luật/điểm với ký tự vô hình ở khoảng giữa cũng chặn. Gỡ cleanText mới (R17a): 12/211 test đỏ; đổi các mẫu V6 về khoảng trắng bắt buộc (R17b): 8/171 đỏ. Test web của PR bắt tin nhắn khung/thử lại NFD + ZWSP. Nguồn C §2. | K1: 140 tổ hợp từng chữ đúng dấu/không dấu, khoảng trắng và tập vô hình mở rộng: 0 lọt. Dấu tách dòng Unicode của tin nhắn dán là biến thể khác → CX3-C1. |
| DR6-23 | #661 → #698 | ĐÃ SỬA | core R23: “Định hướng nơi ở”, “KH nghĩ định cư”, “khách nông thôn”, “sẵn sàng kỹ lưỡng”, “cùng mệnh giá”, “bỏ luật sư” đều đạt. R23 thay text-match.ts bằng bản trước sửa: 27/171 đỏ, gồm các câu thường C62–C66. Nguồn C §2. | Chữ không dấu và trộn từng âm tiết vẫn chặn ở ma trận K1. Corpus hai eval: 1.085 text, 0 thay đổi chặn; catalogue vi.ts: 2.318 literal, 0 thay đổi bộ mã chặn. |
| DR6-24 | #661 → #698 | ĐÃ SỬA | core R24: thiếu themes → “thiếu, cần array”; mã f12 → dạng F12; MBTI → PSYCHOLOGY, ESOTERIC. R24 dùng validator.ts trước sửa: 12/93 đỏ. Test run.ts của PR kiểm cả detail vào message thử lại. Nguồn C §2. | Đọc thêm test thiếu khóa enum/value, value trích xuất rỗng/quá trần, union sai kiểu; không chỉ kiểm schema trực tiếp. |
| DR6-68 | #652 → #666 | ĐÃ SỬA | `scenarios.mjs` R68: ghi bù → xóa → khôi phục → backup nhập được. Gỡ fallback của stageOnDay: 1 test đỏ; gỡ fallback isStageOfDay: 2 test đỏ. Nguồn A §2, E §2. | KH tạo N3 ngày 10/10, hiện đã N1 từ 12/10; cuộc gặp 05/10 vẫn giữ N3, KH giữ N1. Đổi N2 trước ngày tạo vẫn D10. |
| DR6-69 | #652 → #666 | ĐÃ SỬA | E20 control 6/6; R69-mutant bỏ seq làm 3 test đỏ. A replay clock bằng/lùi qua export/import cũng chặn. Nguồn A §2, F §2. | Cùng instant/clock lùi và chuyển trước xóa; xem R69-R92.json, A §2. |
| DR6-70 | #653 → #667 | ĐÃ SỬA | Nguyên e2e DR6-70 xanh; gỡ khung Khi lưu (M70-ui) → 1 e2e đỏ. M70 bỏ undoneMove → 2/34 unit đỏ. Nguồn E §2. | UI R70: N2→N1 (không RF), dời về trước chuyển tay N3→N2: khung nói về N2 và RF không đổi; lưu đúng. Ca rút RF gốc có ở nguyên e2e. |
| DR6-71 | #652 → #666 | ĐÃ SỬA | R71: file chéo KH bị BACKUP_INVALID rule 4; đường restore không đổi chuyển nhóm/KH khác. Gỡ filter KH và gỡ luật nhập: mỗi mutant 1 test đỏ. Nguồn A §2. | Probe SQL thô chỉ kết luận về lệnh. Biến thể còn transition hợp lệ của X: chỉ X được khôi phục, Y nguyên. |
| DR6-72 | #659 → #686 | ĐÃ SỬA | 4.207 code point của tập bỏ về rỗng; mọi Unicode White_Space gộp đúng. KYC/tên được chuẩn hóa; backup chưa chuẩn hóa bị từ chối. Mutant text/note: 4/1 test đỏ. Nguồn A §2, D §2. | NFD có ký tự vô hình giữa chữ và dấu; variation selector ngoài BMP; U+0085/U+2028/U+2029 trong ghi chú; kiểm UTF-16 hỏng ở baseline. |
| DR6-73 | #656 → #674 (`c5a40e1`) | ĐÃ SỬA | Control TS 130/130. Đổi kiểm tại app về quick_check làm riêng test chỉ mục DR6-73 đỏ: 1 failed, 71 passed (R73-quick.log). Tái hiện trên file tải 14.069.760 B: quick_check = ok, integrity_check = row 2 missing from index teams_active_name (index-damage.json). Exe từ chối bằng màn File dữ liệu bị hỏng, không backup, hash file không đổi (E-index). Nguồn B §2. | Dùng file lớn thật và chỉ lật một byte trong khóa chỉ mục. Kiểm sau migration là KNOWN (#620); migration 0011 chỉ đổi trigger, không dựng lại bảng/index nên không mở rộng rủi ro đã biết đó. |
| DR6-74 | #656 → #674 | ĐÃ SỬA | Rust control 104/104. Bỏ readonly → test open_reports_a_read_only_database_file_as_access_denied đỏ (R74-readonly.log). Exe với attrib +R từ chối: App không có quyền ghi vào thư mục dữ liệu; không backup, hash nguyên (E-readonly). Nguồn B §2. | Biến thể file bị giữ vẫn báo FILE_IN_USE trên exe (E-held), không bị gộp nhầm vào file hỏng. Test Rust còn kiểm gỡ chỉ đọc rồi mở lại được. |
| DR6-75 | #656 → #674 | ĐÃ SỬA | Các câu startup đều qua startup-error.test.ts (17 ca trong control). Gỡ chữ đóng cửa sổ này ở openFailedHelp → 2 test đỏ (R75-help.log). Exe readonly/index/held đều hiện hướng dẫn đóng cửa sổ này trước khi mở lại (exe-results.json). Nguồn B §2, D §2. | Đã đọc cả ALREADY_OPEN (đóng cả hai), DISK_FULL, backup lỗi, schema mới hơn; không thêm nút hay đổi G3. |
| DR6-76 | #657 → #680 | ĐÃ SỬA | Tools control 55/55 (trong 323 tools); bỏ lớp đọc thứ hai: 4 test đỏ. Core thêm 56 ca: 28 chặn/28 che; B kiểm Rust. Nguồn B §2, F §2. | Trộn escape theo từng ký tự, key 1/2/3/21 ký tự, message Unicode sát 200; ba lớp ngoài K23. |
| DR6-77 | #661 → #698 | ĐÃ SỬA | 300 chữ + 700 U+200B đạt; thêm một U+200B hoặc 650.000 U+200B → V1. R77 bỏ hiệu lực trần 1.000: 6/262 test đỏ. Hai file test DB ai-analyses và backup-invariants: 170/170 xanh, có ca từ chối 650.000 ký tự vô hình ở ghi dòng ACCEPTED và nhập backup. Nguồn C §2. | 300 chữ NFD + 100 ký tự vô hình, U+3164 chỉ có khoảng trống, chữ xen U+0085 đều có test. Không báo lại REJECTED/khóa lạ/khoảng trắng đầu-cuối của backup sửa tay: KNOWN G5 §11.8. |
| DR6-78 | #658 → #682 (1502c5e) | ĐÃ SỬA | core R78: ông nội, anh rể, vợ cũ, “2 con chó”, “nếu đã kết hôn…” → 0 đề xuất; bác sĩ có hai đề xuất đúng. R78 dùng Mock trước sửa: 25/74 đỏ. Nguồn C §2. | K2: bảy ghi chú mới qua dấu câu, tên nghề, phủ định và giả định ở câu trước: đúng. Giới hạn “ba ruột/ba nuôi”, thú cưng ngoài danh sách, “sắp/sẽ”, “giả thử”, U+2026… đã là KNOWN, không báo lại. |
| DR6-79 | #658 → #682 | ĐÃ SỬA | 36.003 ký tự: trung vị 1,83 ms (“độc thân”) / 0,46 ms (“có 2 con và”), dưới 50 ms. R79 đưa wordBefore về quét ngược mỗi vị trí: đúng hai test thời gian đỏ, tốt nhất 4.092 / 459 ms. Nguồn C §2. | corpus-probe: 5.672 ghi chú tải, thuật toán mới và bản quét ngược với **cùng luật ngữ nghĩa mới** cho đề xuất giống hệt, 0 khác biệt. Tách kiểm thuật toán khỏi việc mở rộng luật ở DR6-78. |
| DR6-80 | #654 → #669 | ĐÃ SỬA | inUseHelp unit và e2e 9b xanh; R80 dùng câu chung cho reviewer/coordinator → 1 test đỏ. Nguồn D §2. | N5: 5 KH đã xóa, cả RE và IS đếm đủ, ba tên + 2 KH khác; sau khôi phục/xóa/dọn số đúng. Câu inUseTrash/inUseSupportTrash có vế dọn sạch. |
| DR6-81 | #654 → #669 | ĐÃ SỬA | navigation.spec.ts control xanh; R81 bỏ scrollTo → expect scrollY đỏ. Nguồn D §2. | Control giữ cả đường về thẻ vừa xem; sidebar/hồ sơ không kế thừa cuộn màn trước. |
| DR6-82 | #654 → #669 | ĐÃ SỬA | e2e URL 108 ký tự ở 1440/1100 xanh; R82-note và R82-fact bỏ wrap-anywhere → Range vượt mép thẻ, cả hai đỏ. Nguồn D §2. | N3: chuỗi dài sau lưu không tràn; hàng dữ kiện đang soạn chưa ngắt → CX3-D2. Biến thể tên hồ sơ → CX3-D3. Không chấm lỗi mới ở đường cũ đã sửa. |
| DR6-83 | #655 → #693 | ĐÃ SỬA | Control các luồng 6c/6g/6h/8a/8b/khôi phục/7a/7d xanh; R83-focus 2 unit đỏ, R83-Dialog e2e 6c đỏ, R83-7a Bỏ dữ kiện đỏ. Nguồn D §2, E §2. | N1 thêm/xóa TL còn BODY ở màn Team, ngoài danh sách Issue #655 → CX3-D1. Hủy 9b và 5f vẫn trả focus đúng. |
| DR6-84 | #662 → #707/#709/#710 | ĐÃ SỬA | Purge 113/1.313 dòng, 5 DB mới/cỡ: 0 rác/0 kept; N1–N6 giữ dữ liệu sống/KPI/backup/migration. A/B/E có mutation lệnh/hàng đợi/màn đỏ. Nguồn A §2, B §2, E §2, F §2. | 95,2/106,9ms Node; exe common 151,8ms tới notice, trash.open 38,9→9,6ms; xem §6b. |
| DR6-85 | #660 → #689 | ĐÃ SỬA | 6/6 pr-status control; bỏ paginate: 3 đỏ; bỏ guard count: 2 đỏ. Không gọi gh thật. Nguồn F §2. | 251 commit, code lâu nhất; 250/251 hoặc count=null chặn; 0 commit qua. API giả theo contract, không xác minh GitHub live. |
| DR6-86 | #660 → #689 | ĐÃ SỬA | 17/17 retro control; bỏ đa config/khử trùng: 3/2 test đỏ. CLI fixture thực hai config + junction/uppercase chỉ in 2 phiên. Nguồn F §2. | realpathSync.native; unit có spelling8.3/trailing separator, không tuyên bố tạo alias8.3 thực. |
| DR6-87 | #652 → #666 | ĐÃ SỬA | R16: bỏ nhánh previewHandover trả 0 khi cùng RE → test “hands over only…” đỏ `expected 1 to be +0`. Baseline xanh. Nguồn A §2. | Test có lịch của RE khác, nên số đếm không tự bằng 0 một cách tình cờ. |
| DR6-88 | #656 → #674 | ĐÃ SỬA | G07d bỏ mapping tạo thư mục → test đỏ. Bỏ Drop → test mới đỏ. Cả 3 cấu hình về 0.1.0 → test version đỏ. Giảm MAX_MODEL_CHARS = 8 / bỏ dấu chấm trong Rust → test AI_MODELS contract đỏ (mutations.json). Control giữ version 1.0.0. Nguồn B §2. | J5 được Owner chấp nhận K29: comment app-data.ts nay nói đúng subscriber biết DB mới trước close, không hứa test giữ nhịp setTimeout. Không mở lại mục đã ACCEPTED. |
| DR6-89 | #658 → #682 | ĐÃ SỬA | Control Edge: 2/2 xanh, sau khôi phục lại 2/2 xanh. R89d dời đọc generation xuống sau hai await: 1/58 unit đỏ, chính test PR. R89b bỏ lọc generation của panel: e2e toBeHidden đỏ, Received visible. R89c bỏ faded của Item chi tiết lịch hẹn: test tương phản đỏ, 4,4411186 < 4,5. Nguồn C §2. | Đủ ba đột biến R15b/R15d/R21c mà lượt 2 bỏ sót. Không suy từ việc dùng chung Item hoặc coverage. |
| DR6-90 | #654 → #669 | ĐÃ SỬA | R90-BR3 (bỏ checkbox khỏi selector thật) unit đỏ; R90-team/person, R90-note/day đều e2e đỏ. R90-add làm mất lỗi Ngày/Ghi chú cũng đỏ. Nguồn D §2. | Không tính lỗi import/build là bị giết. Đã đọc bộ so khớp selector mới; selector lạ không được cho qua. Control cuối 208 unit và 9 e2e xanh. |
| DR6-91 | #653 → #667 | ĐÃ SỬA | N1/N2/R04g (tên đột biến cũ): mỗi cái 1/34 unit đỏ. R38c/R38d/R38e, R43e: mỗi cái làm nguyên e2e PR sửa đỏ. Control 31/31. Nguồn E §2. | Đã kiểm cả helper và phần nối TSX. E2E qua 31/12→01/01; không dùng lỗi build/import làm bằng chứng giết đột biến. |
| DR6-92 | #660 → #689; #691 → #702 liên quan | ĐÃ SỬA | imports again xanh UTC−11 và UTC+12; trả clock11h→10h làm ca UTC−11 đỏ. Sinh lại tải CLI hash chuẩn. Nguồn A §2, F §2. | R92 JSON/log; A cùng kết luận. Không mở rộng bảo đảm sang UTC+13 KNOWN. |
| DR6-93 | #653 → #667 | ĐÃ SỬA | UI R93/E18: dòng nhóm sau N3 · không đổi nhóm KH, hộp Không đổi nhóm KH; khôi phục không thêm transition. M93 gỡ nhánh → 1/68 unit đỏ. Nguồn E §2. | E18 sau chuyển tay ngày sau giữ KH N2; nguyên e2e E18 cũng xanh. |
| DR6-94 | #653 → #667 | ĐÃ SỬA | UI R94/E20: lịch 18/10, chuyển tay cùng ngày ghi sau xóa, câu ghi sau lúc xóa cuộc hẹn này, nút tắt. M94 gỡ nhánh → 2/68 unit đỏ. Nguồn E §2. | Nhánh ngày sau vẫn câu sau ngày cuộc hẹn này; unit kiểm cả hai, gồm case AppData thật. |
| DR6-95 | #653 → #667 | ĐÃ SỬA | trash.html:268 đã dùng chuyển tay 02/10/2026 cùng ngày, ghi sau xóa; không còn ví dụ 10/10 cũ. Khớp E7 spec :151, nghiệm thu NT-TR-09 và restoreView E7 (unit xanh). Nguồn E §2. | Sửa tài liệu: kiểm nội dung/hành vi; không tạo đột biến sản phẩm cho dòng tài liệu. E6 ngày sau vẫn chặn, E20 cùng ngày khác nhóm chặn như R94. |
| DR6-96 | #663 → #700 | ĐÃ SỬA | nghiem-thu-v1.md có NT-EX-05 (:333), NT-KH-16, NT-TM-15/16 (:263–264); đối chiếu câu với vi.ts và e2e control. Nguồn D §2. | NT-TR-23 kiểm hộp 9b sau dọn; N5 chạy thêm chuỗi đó. EX-05 phần phím/chuột phần cứng vẫn là nghiệm thu G7, không giả đã tự thử phần cứng. |
| DR6-97 | #663 → #700 | ĐÃ SỬA | core R97 đối chiếu chuỗi nguyên văn: docs/user-guide/10-su-co.md và aiError.AI_TOO_LARGE đều “Dữ liệu gửi AI quá lớn (quá 200.000 ký tự) — rút gọn ghi chú hoặc dữ kiện rồi thử lại.” Nguồn C §2. | Đây là sửa tài liệu; kiểm chữ trực tiếp, không gán test hành vi hay mutation không cần thiết. |
| DR6-98 | #665/#695 → #696; #660 → #689 | ĐÃ SỬA | Metrics có mốc Home PC sau integrity_check; README/probe đo trash.open detached sau memory. BaselineJSON: không dòng nào xấu hơn sau #656. Nguồn F §2. | So R2 app.open-data tăng do K24; trash.open cũ gắn DevTools không so trực tiếp. 9 stats test Playwright xanh. |
| DR6-99 | #653 → #667 | ĐÃ SỬA | restoreLabel có FYP; test hai HĐ cùng KH/cùng ngày, FYP 24tr và 100tr xanh. M99 gỡ FYP → 2/68 unit đỏ. Nguồn E §2. | Phạm vi sửa là nút khôi phục. Biến thể mới ở nút Phát hành/Sửa HĐ còn sống ghi riêng CX3-E1; không đổi kết luận R99. |
| DR6-100 | #655 → #693 | ĐÃ SỬA | Control cột Thao tác có tên và rộng ≤1px. R100-old-customer/team trả header rỗng → cả hai đỏ ở count=1. Nguồn D §2. | R100-customer/team làm header hiện ra cũng bị giết ở boundingBox width. Đã kiểm headerHidden và sortable=false của cả hai nơi. |
| DR6-101 | #654 → #669 | ĐÃ SỬA | kyc-view.test.ts xanh; R101 bỏ normalizeText → null khác 6.000.000.000 ₫ (6 tỷ), test đỏ. Nguồn D §2. | N8: ba trường tiền × 6+U+3164+tỷ, 1+NEL+tỷ+U+034F+2, chữ tự do. Hint/describedby có khi hiểu được, không có khi chữ tự do; 3f dùng cùng FactValue/helper. |
| DR6-102 | #661 → #698 | ĐÃ SỬA | “Giữ kỉ luật Thép”, “qui luật Thị trường”, KỈ/QUI chữ hoa đều đạt; “Theo Luật Kinh doanh bảo hiểm” vẫn V6. R102 gỡ hai ngoại lệ i: 6/171 đỏ. Nguồn C §2. | Cả cách viết i/y, hoa/thường và tên luật thật đều có đối chứng. |
| DR6-103 | #653 → #667 | ĐÃ SỬA | Một meetingKeepingMove có ba caller: lệnh, seed, outcomeLock. Trên tải: **3.254 move** so luật cũ/mới, **1.040 khóa latest** so outcomeLock, **0 lệch**. Bỏ chặn D7: 1 test đỏ. Nguồn A §2, E §2. | Helper có 3 ca trực tiếp; seed/hash/golden xanh trong baseline. Biên trước ngày tạo thuộc sửa có chủ ý R68. |

Máy kiểm tự động `R-combined.json`: 39 ID duy nhất, đúng tập 17/23/24 và 68…103, không thiếu/không thừa. DR6-01/04/19/30/49/60/62 lượt 1 kiểm qua mã phần còn lại của lượt 2; không tạo dòng R trùng. DR6-25/37/53/66/67 và J5 giữ KNOWN theo sổ/Owner.

## 3. Phạm vi đã đọc / rà

Phân loại bằng `classifyFile` tại SHA ghim: **91 file F, 4.340 dòng SP / 14.165 test-hỗ trợ / 4.628 sinh tự động**. Bảng dưới là file và chiều dài nguồn đã dùng để rà; `scope.json` lưu hash. Đọc logic công cụ/CI/hook/cấu hình, luồng I/O và lỗi; với test/e2e rà setup/helper/assertion/wait, AST map từng file và đọc sâu phần sửa/nguy cơ giả xanh. Không đánh đồng số assertion hay coverage với chứng minh mọi nhánh đúng.

- Diff **4217ed4..119e2e4** lưu `reviewed-diff.patch`; đọc kỹ #678 (`notes-*`, mẫu Issue/PR), #680 (escape key), #689 (phân trang/count/retro/perf), #702 (hash seed), #705 (TS hooks), và e2e của #666/#667/#669/#693/#698/#710. `.claude/settings.json` bỏ deny Agent theo M8/K17 là có chủ ý; không phải lỗ bảo mật được suy ra từ việc bật công cụ.
- Nguồn đúng: CLAUDE.md gốc/các package tại điểm nối, CONTEXT.md; Phase 3 §4/§6, Phase 4 chỉ số/Excel, Phase 5 guardrail/web, Phase 6 §4.1 S-2/§4.2 TR-11…13/D1…D13/§5; ADR-0007/0008/0009/0016, golden chỉ số/KYC/lịch hẹn, mockup trash 11h–11j và nghiệm thu. Không sửa spec/golden/mockup cho khớp code.
- Đã đọc common prompt/plan (trục, thước mức, L3)/known/fixes/baseline; hai bản tổng hợp 15/10 và 17/10, báo cáo raw F lượt 1 của các bên và F lượt 2 của Codex/Claude **trong repo**, cùng kịch bản trước đó để tránh báo lại. Probe cũ dùng lại thuật toán/cách dựng sau khi đổi toàn bộ đường ghi sang F lượt 3; không chạy script cũ có đường ghi cũ.
- Điểm nối: AppData/inTurn/backUp/run/generation/persist/tables, commands customer/team/appointment/policy/KYC/AI, purge/keptRecords/migration 0011, backup và integrity, overview/report/workbook, startup/UI. Kết luận chỉ số/màn đi qua AppData/tables hoặc exe; SQL thô chỉ đọc schema/kiểm lệnh trên bản chép.
- File sinh `pnpm-lock.yaml`: kiểm không đổi trong diff, manifest/dependency; không audit source vendor. Tài liệu/JSON ngoài cách đếm gồm template GitHub, `.claude/settings.json`, launch/rules, manifest/tsconfig của package, config gốc; không chạy skill phát triển từ các file ấy.

| File ở 119e2e4 | Dòng | Loại |
|---|---:|---|
| .claude/hooks/handoff-context.mjs | 1–25 | product |
| .claude/hooks/review-pr-hint.mjs | 1–29 | product |
| .dependency-cruiser.cjs | 1–72 | product |
| .githooks/pre-push | 1–13 | product |
| .github/ISSUE_TEMPLATE/config.yml | 1–1 | product |
| .github/ISSUE_TEMPLATE/task.yml | 1–82 | product |
| .github/workflows/ci.yml | 1–157 | product |
| apps/desktop/vite.config.ts | 1–29 | product |
| e2e/anchor.ts | 1–22 | test |
| e2e/appointment-outcome.spec.ts | 1–647 | test |
| e2e/appointments.spec.ts | 1–921 | test |
| e2e/backup.spec.ts | 1–218 | test |
| e2e/chart.spec.ts | 1–69 | test |
| e2e/customer-ai-web.spec.ts | 1–374 | test |
| e2e/customer-ai.spec.ts | 1–838 | test |
| e2e/customer-appointments.spec.ts | 1–149 | test |
| e2e/customer-forms.spec.ts | 1–402 | test |
| e2e/customer-kyc.spec.ts | 1–403 | test |
| e2e/customer-policies.spec.ts | 1–241 | test |
| e2e/customers.spec.ts | 1–156 | test |
| e2e/data-table.spec.ts | 1–199 | test |
| e2e/demo-data.spec.ts | 1–71 | test |
| e2e/dialog-keyboard.spec.ts | 1–188 | test |
| e2e/full-cycle.spec.ts | 1–362 | test |
| e2e/guide/check.guide.ts | 1–21 | test |
| e2e/guide/links.ts | 1–56 | test |
| e2e/guide/shots.guide.ts | 1–216 | test |
| e2e/navigation.spec.ts | 1–332 | test |
| e2e/overview.spec.ts | 1–234 | test |
| e2e/perf/probe.perf.ts | 1–483 | test |
| e2e/perf/stats.spec.ts | 1–161 | test |
| e2e/perf/stats.ts | 1–213 | test |
| e2e/period-picker.spec.ts | 1–301 | test |
| e2e/reports.spec.ts | 1–238 | test |
| e2e/screen-error.spec.ts | 1–73 | test |
| e2e/seed-timing.spec.ts | 1–19 | test |
| e2e/seeded-snapshot.spec.ts | 1–56 | test |
| e2e/seeded-snapshot.ts | 1–12 | test |
| e2e/serve.mjs | 1–43 | test |
| e2e/settings-ai.spec.ts | 1–337 | test |
| e2e/smoke.spec.ts | 1–36 | test |
| e2e/support.ts | 1–368 | test |
| e2e/team.spec.ts | 1–604 | test |
| e2e/theme.spec.ts | 1–74 | test |
| e2e/trash.spec.ts | 1–549 | test |
| eslint.config.js | 1–50 | product |
| packages/ui/scripts/check-tokens.ts | 1–37 | product |
| playwright.config.ts | 1–47 | test |
| playwright.guide.config.ts | 1–38 | test |
| playwright.perf.config.ts | 1–19 | test |
| pnpm-lock.yaml | 1–4628 | generated |
| pnpm-workspace.yaml | 1–7 | product |
| tools/bootstrap.ps1 | 1–211 | product |
| tools/codemap-core.mjs | 1–200 | product |
| tools/codemap-core.test.mjs | 1–197 | test |
| tools/codemap.mjs | 1–95 | product |
| tools/eval-ai-core.mjs | 1–801 | product |
| tools/eval-ai-core.test.mjs | 1–1324 | test |
| tools/eval-ai.mjs | 1–38 | product |
| tools/fixtures/ai-eval.mjs | 1–314 | test |
| tools/handoff.mjs | 1–160 | product |
| tools/load-data-core.mjs | 1–104 | product |
| tools/load-data-core.test.mjs | 1–162 | test |
| tools/load-data.mjs | 1–33 | product |
| tools/merge-pr.mjs | 1–160 | product |
| tools/notes-core.mjs | 1–253 | product |
| tools/notes-core.test.mjs | 1–360 | test |
| tools/notes-for.mjs | 1–95 | product |
| tools/pr-core.mjs | 1–338 | product |
| tools/pr-core.test.mjs | 1–789 | test |
| tools/pr-status.mjs | 1–169 | product |
| tools/pr-status.test.mjs | 1–177 | test |
| tools/retro-core.mjs | 1–260 | product |
| tools/retro-core.test.mjs | 1–214 | test |
| tools/retro.mjs | 1–73 | product |
| tools/review-hint-core.mjs | 1–27 | product |
| tools/review-hint-core.test.mjs | 1–42 | test |
| tools/session-core.mjs | 1–120 | product |
| tools/session-core.test.mjs | 1–211 | test |
| tools/session-end.ps1 | 1–78 | product |
| tools/session-end.test.mjs | 1–69 | test |
| tools/session-io.mjs | 1–14 | product |
| tools/session-start.ps1 | 1–72 | product |
| tools/size-report-core.mjs | 1–358 | product |
| tools/size-report-core.test.mjs | 1–299 | test |
| tools/size-report.mjs | 1–48 | product |
| tools/status.mjs | 1–77 | product |
| tools/ts-hooks-core.mjs | 1–45 | product |
| tools/ts-hooks-core.test.mjs | 1–131 | test |
| tools/ts-hooks.mjs | 1–9 | product |
| vitest.config.ts | 1–86 | test |

`test-audit.json` giữ test case, dòng, số expect và các mẫu cần đọc ở **54 file test/hỗ trợ**. Không có `.only`; skip duy nhất có điều kiện thiếu pwsh của session-end, hai ca đó thực tế chạy ở control. `waitForTimeout(6000)` của Hủy reload kiểm một việc **không** được chạy; `toBeDefined` của mã KH đi kèm kiểm CURRENT/dữ liệu; các catch trong eval kiểm nội dung lỗi, không nuốt lỗi làm xanh.

## 4. Kịch bản mới đã thử

N1–N5 là năm chuỗi mới qua AppData và nhiều gói, có thao tác dọn hẳn chưa có ở lượt 1–2. N6–N9 bổ sung, không dùng thay chỉ tiêu năm chuỗi.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| N1 | Nhập tải → xóa thêm 12 KH → dọn → Excel → xuất/nhập backup → mở lại bytes đã lưu → mở lại bản backup tự động trước dọn → so chỉ số | PASS: Thùng rác 125→0; live tables và 147 tổ hợp kỳ/góc nhìn giữ nguyên; workbook thật 4 sheet đọc được. Backup trước dọn giữ 125 dòng, đúng dữ liệu trước đó. | — |
| N2 | Cùng hàng đợi: purge → import bản preview trước dọn → purge; giữ backup lần đầu, thử ghi và xuất khi đang chờ; mở lại từng bản tự động | PASS: ghi bị DATA_REPLACING; file xuất nhập được; ba backup có 113/0/113 dòng rác theo thứ tự; cuối 0, generation=2 (chỉ hai lần import tính từ đầu fixture), live tables bằng nhau. | — |
| N3 | AI Mock đang chờ cho KH → xóa KH → dọn hẳn → tạo KH mới trùng tên → AI về → xuất/nhập backup → Báo cáo | PASS: discarded; ID mới khác, không có phân tích ghi cho KH mới hoặc KH đã dọn; còn đúng 1 KH, báo cáo dựng được. | — |
| N4 | Chuỗi dời 3 lịch → bàn giao → nhập file chứa hai tiền thân đã xóa và RE cũ đã xóa → dọn phần còn được giữ → khôi phục RE/lịch → backup roundtrip → xóa KH/dọn → xóa RE/dọn | PASS: giữ đúng 2 lịch + 1 người và chỉ số; các bước sau giải phóng hết phụ thuộc; Thùng rác rỗng, nhân sự cũ xóa hẳn được. File biến thể vào bằng app.readBackup/importBackup, không chèn SQL tạo màn. | — |
| N5 | KH có KYC đã xóa → backup trước dọn ném DISK_FULL → kiểm tables → tạo KH khác → dọn lại → nhập preview cũ → mở file và Báo cáo | PASS: lần lỗi tables không đổi, mở khóa; hàng đợi phục hồi; preview cũ phục hồi đúng 1 KH rác, bỏ KH mới theo K12; file mở và báo cáo hợp lệ. | — |
| N6 | Chép DB vật lý do exe lượt 2 4217ed4 tạo → mở bằng exe lượt 3 119e2e4 → xem Cài đặt → đọc backup tự động → kiểm file mới và export/import | PASS: schema 11→12 (migration 0011); integrity sạch; UI 4 team/51 người/1.481 KH/10.255 lịch/1.674 HĐ; backup khớp hash file cũ; nguồn cũ không đổi, roundtrip OK. | — |
| N7 | Nguyên full-cycle UI với đồng hồ ghim → đối chứng tiến 24h trước đọc chỉ số | Control 1 passed; ca qua ngày 1 failed, nhận MTD 16/09 thay 15/09. Production baseline cũng có chính lỗi này qua nửa đêm thật. | CX3-F1 |
| N8 | Key giả dài 1/2/3/21 ký tự, trộn cách escape theo từng ký tự, 2xx rồi lỗi 500 có prefix Unicode sát trần; retro CLI với hai config và junction alias khác hoa/thường | 56 ca key: 28 chặn + 28 che; không gọi fetch thật. Retro chỉ đọc hai fixture, in 2 phiên một lần mỗi phiên, không trùng nguồn alias. Unit riêng phủ spelling 8.3 giả, không nhận đã tạo 8.3 thật. | — |
| N9 | OPEN notes có mục cha/con, shorthand/brace + file mới/test; chạy notes-for --files thật; load-data CLI dùng hooks mới; E2E dọn/9b/giao thừa | Parser phân biệt exact/area và RESOLVED; CLI báo 5 mục thật đúng nguồn. Sinh lại file tải hash trùng chuẩn; E2E cuối 55/55, gồm 9 stats thuần. | — |

Nguồn N1–N5: `cross.mjs`, `cross-final.log`, `cross-results.json`; N6 `legacy.mjs`/`legacy-results.json`/`legacy-ui.txt`; N7 `clock-probe.mjs`/`clock-results.json` và hai log; N8–N9 `core-probe.mjs`, `core-results.json`, các audit log/E2E. Các số và pass là kết quả lần cuối đã đọc; lỗi probe ban đầu được giữ ở phụ lục, không tính là lỗi app.

## 5. Phát hiện mới riêng F

### CX3-F1 — Full-cycle phụ thuộc đồng hồ qua nửa đêm

ID: CX3-F1
Mức: Low
Trục: T
Vị trí: e2e/full-cycle.spec.ts:105, :178 (119e2e4).
Tình trạng: CONFIRMED
Liên quan: có từ trước, lượt 1–2 bỏ sót; #698 chỉ đổi prompt_version trong test, không gây lỗi đồng hồ này.
Kịch bản: N7 — full-cycle qua nửa đêm.
Mô tả: test kỳ vọng MTD luôn kết thúc 15/09 và snapshot trước/sau bằng nhau, nhưng chỉ ghim ngày mở app, không ghim đồng hồ. App cố ý chuyển hôm nay qua nửa đêm, nên test đỏ khi chạy bắc qua ngày thật.
Tái hiện / bằng chứng: node F/clock-probe.mjs trên bản chép: clock-control (page.clock ghim buổi sáng) 1 passed; clock-rollover tiến 24h trước figures: 1 failed bằng assertion, Expected …15/09/2026 · Team, Received …16/09/2026 · Team (4 team). common/baseline.md ghi chính test này flaky ở lượt chạy production 23:58→00:00. Thay đồng hồ là probe môi trường; không sửa code app hay expectation. Lượt control gốc F cũng xanh 13,9s trong e2e-control.log.
Ảnh hưởng: CI/lần nghiệm thu khởi chạy gần nửa đêm có thể báo lỗi giả, chạy lại mới xanh; dữ liệu app không sai. Không gộp timeout điều hướng của dev harness vào bằng chứng này.
Đề xuất: cài đồng hồ cố định trước lần mở trang đầu của full-cycle; giữ các test qua ngày chuyên biệt. Khoảng 2–6 dòng test, 0 dòng SP; không đổi golden/spec.

Không phát hiện mới P/B/S/D được xác nhận ở F. Các điểm còn thấy thuộc OPEN/ACCEPTED: bỏ `previous_filename`, compare snapshot giữa các trang, shorthand/mục chứa U+2028 của notes, `refs`/`keptRecords` đọc dư, module export/API chỉ test dùng, plain/newSessionId/markup lặp. Không cấp ID mới cho chúng khi chưa có hậu quả mới.

## 6. Bloat

| Đã chạy / đọc | Phạm vi/dữ liệu | Kết quả / số | ID |
|---|---|---|---|
| tsc --noUnusedLocals --noUnusedParameters --noEmit | domain/db/ai/ui/desktop/e2e, cấu hình không đổi | 6/6 exit 0, không diagnostic | — |
| codemap --check; dependency-cruiser; token guard | Toàn apps/packages và map export/route | Exit 0; 320 module/1.312 dependency, 0 vi phạm; map đúng, token guard sạch | — |
| AST exports + rg caller toàn repo | 195 file SP TS/TSX/MJS; cùng thuật toán lượt 2 | 1.047 export; 74 value +112 type không có hit tên ở file khác sau bỏ barrel; **không phải 186 đoạn code chết** | KNOWN |
| So candidate với lượt 2, đọc chỗ dùng | Export value mới duy nhất PURGE_REMINDER | Dùng ngay trong purgeReminder cùng module, ngưỡng 1.000; không phải dead code. Nhóm thân ≥160 ký tự trùng nguyên văn ở ≥3 file: 0 | — |
| Size report theo Git; diff lockfile/manifest | 398 file theo cách đếm size-report | Tổng 35.178 SP/45.635 test/4.967 sinh; lượt 2 33.788/41.633/4.939: +1.390/+4.002/+28. F +401 SP/+1.748 test, 84→91 file | — |
| Bundle chuẩn bị không env riêng | common/baseline.md, SHA ghim; F không build lại | JS/CSS 2.400.393 B raw /706.754 B gzip; so lượt 2 +18.357/+4.645 B. index 927.932/271.662; chart 513.302/172.450; Excel 929.569/255.572; CSS 28.484/6.443 B. Chart/Excel không tăng | — |
| Exe release | common/exe/project2c.exe, hash kiểm ở final-check.json | 5.408.768 B; so lượt 2 5.404.672 **+4.096 B**, bằng mốc sau #656. SHA256 E93C8BAA2BACA8EEC30B230EE7375888E109CB28EF6A202BE42D662D4F720CE1 | — |

`size.log` của F ghi bundle=null vì worktree chưa có dist; **số bundle trên lấy nguồn chuẩn bị**, không giả F tự build. Không có đề xuất refactor B mới; không đổi behavior/golden hoặc thêm công cụ. Những nhóm lặp đã hoãn giữ KNOWN.

## 6b. Hiệu năng

Máy DESKTOP-KDURKJP; Node v24.20.0. Dữ liệu tải chuẩn `common/load/load-2026-10-12-seed6.p2cbackup`, **tables SHA256 1c0a43fb9d5711df4700cb688a256ac50bb44eed1c0fd00218fa36f0746d003f**. F sinh lại bằng CLI #705 và assert cùng hash. 1.496 KH tổng/10.414 lịch thô; 1.481 KH/10.255 lịch sống, 113 dòng rác. Không dùng file tải cũ để kết luận P.

Đo Node: mỗi cỡ **5 DB mới**, cỡ lớn thêm xóa 1.200 KH đầu theo id; thời gian gồm VACUUM bọc ở handle riêng, không patch repo. Không test/E2E/build/exe của F chạy đồng thời; Vite 4207 rảnh. Không quan sát hoạt động ngoài phiên. Đây là số lệnh Node, không phải thời gian vẽ màn/IPC.

| Đo Node, ms | 113 dòng: trung vị (min–max) | 1.313 dòng: trung vị (min–max) | Mốc common 113 /1.313 | ID |
|---|---:|---:|---:|---|
| listTrashBefore | 34,054 (30,347–43,556) | 151,553 (146,161–188,896) | 32.6 / 140.7 | — |
| previewPurge | 5,822 (5,612–5,916) | 10,100 (9,684–10,535) | 5.6 / 9.9 | — |
| purgeTrash | 95,238 (91,591–98,183) | 106,862 (104,528–109,287) | 93.8 / 109.8 | — |
| purgeTrashWithoutVacuum | 32,818 (30,860–34,200) | 102,335 (100,732–103,770) | 29.4 / 105.3 | — |
| vacuum | 62,421 (59,813–65,727) | 3,797 (3,764–5,517) | 64.4 / 5 | — |
| export | 2,051 (2,016–2,201) | 0,368 (0,353–0,454) | 2.1 / 0.4 | — |
| listTrashAfter | 10,918 (9,256–11,626) | 1,897 (1,616–2,312) | 10.8 / 2.1 | — |

Cỡ file: 113 dòng **14.069.760→13.410.304 B**; 1.313 dòng **14.118.912→1.486.848 B**; tất cả 10 mẫu còn 0 rác/0 kept, plan/counts khớp. Không số nào xấu hơn baseline chuẩn bị theo **quá 20% VÀ quá 10ms**. Dọn chưa có ngưỡng tuyệt đối; không tự áp <200ms của thao tác màn cho toàn transaction/file.

**Đối chứng lượt 2:** số F listTrash 34,1ms so lịch sử 20,65ms chạm cả hai mốc nhiễu, nên không bỏ qua. Chạy thêm `perf-paired.mjs`: nguồn hàm từ 4217ed4 qua git show, chỉ đổi import sang cùng runtime/dependency và cùng DB tải mới; 3 warmup +11 mẫu, xen kẽ lượt cũ/mới, assert kết quả deepEqual. Đây là đối chứng phần hàm, không giả chạy nguyên exe cũ.

| Hàm | Cũ / mới trung vị, ms | Kết quả |
|---|---:|---|
| listAppointments | 44,020 / 44,300 | output deepEqual; thân hàm hash bằng nhau |
| listTrash | 19,934 / 25,570 | output deepEqual; thêm keptRecords theo K27 |

Chênh listTrash trong đối chứng khoảng 5,64ms, không qua đồng thời hai mốc; phần quét keptRecords mới là **OPEN #709, known.md:210**, không phát hiện mới. Cùng hướng số A (28,488→33,636) và E (26,356ms). Không chuyển chênh hai buổi đo thành hồi quy khi đối chứng không xác nhận.

**Exe — dùng lại số chuẩn đã được prompt cho phép**, không tự chạy lại cả perf exe: `common/perf/perf-ref.json` so `docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json`; `perf-compare.json` ghi các dòng và phép so. R98 kiểm script đo trash.open bằng detached, sau memory; mọi dòng không xấu hơn mốc sau #656.

| Đo exe | 119e2e4 | Sau #656 | Lượt 2 cùng máy / ngưỡng |
|---|---:|---:|---|
| app.open-data | 373ms | 387ms | 301ms; +72ms so R2, chi phí integrity_check K24 có chủ ý, ≤600ms |
| reload overview/appointments/customers/reports/team/settings | 392/383/307/366/348/280ms | 398/391/336/376/355/283ms | R2 355/349/272/328/311/247ms; đều <500ms |
| trash.open (detached) | 38ms | 34ms | R2 73ms còn gắn debugger, **không so trực tiếp**; <200ms |
| backup.read/import/export | 827/47/425ms | 835/43/438ms | R2 814/43/422ms; ≤2.000/500/1.000ms |
| db.save / Excel | 146/23ms | 151/20ms | R2 147/27ms; ≤400/500ms |
| next-month / next-year | 103/106ms | 101/107ms | ≤300ms, năm−tháng 3ms≤50ms |
| memory.js-heap | 16,6MB | 16,5MB | R2 16,5MB; ≤21MB |
| Mở lần đầu LCP, 3 lần | 3.614ms | 3.663ms | R2 3.526ms; dưới luật nhiễu 4.396ms và ngưỡng Phase 4 4.724ms |
| Dọn trên exe, 113 dòng | 151,8ms tới 11j; lần lưu đầu 147,4ms | Chưa có mốc | File 14.069.760→13.410.304 B; trash.open trước/sau 38,9→9,6ms, ba mẫu mỗi bên |

19 thao tác màn còn lại trong khoảng 2–22ms và dưới 200ms. Con số dọn exe là **một mẫu của common**, không trung vị do F đo. Chuỗi exe N6 của F chỉ kiểm migration/độ bền/counts, không dùng làm benchmark UI vì DNS/CDP có cấu hình khác phép chuẩn. A–E có số thuần từng gói trong báo cáo tương ứng; không thấy P mới cần gộp.

## 7. Đếm mức × trục

Chỉ đếm phát hiện riêng F; R không đếm lại. 1/1 **CONFIRMED**, 0 PLAUSIBLE; không có tỉ lệ PLAUSIBLE cao.

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

Để kết luận v1.0, sáu gói **của Codex** còn 6 phát hiện mới CONFIRMED: **5 Low +1 Nit**, 0 Critical/High/Medium. Nguồn: C1 Low/E, D1 Low/A, D2–D3 Low/E, E1 Nit/A, F1 Low/T. Không gộp hay so với bên review khác.

## 8. Đã xét, không thấy

| Trục | Đã chạy/đọc và giới hạn kết luận |
|---|---|
| R | 7 mục F với replay/test cũ, gỡ sửa trên copy, biến thể; gộp đủ 39 từ A–E. Không mục chưa sửa/một phần/hồi quy theo bằng chứng hiện có. |
| E | N1–N6 liên chuỗi/queue/failure/AI/kept/migration; điều khiển đồng hồ N7 tìm lỗi test riêng. Ngày/giao thừa trong E2E gốc xanh; không phát biểu mọi hoán vị đã thử. |
| C | Đối chiếu TR-11…13/D1…D13/S2, E20 theo seq, G5@3, UI labels/counts qua AppData/E2E/exe; chỉ số 147 tổ hợp và workbook/backup giữ. Lệch mockup đã duyệt giữ KNOWN. |
| D | File backup nguyên bản trước migration; nguồn cũ hash không đổi; saved DB schema12/integrity/roundtrip; purge/queue và mở lại N1–N6 không mất dữ liệu. A/B đã kiểm rollback/crash/trigger; không giả F tự thực hiện mọi ca của A/B. |
| G | Eval unit/Mock/fetch giả, N3 discarded cho KH bị purge; đọc đường nối runner/prompt/validator. Guardrail nội dung ở C có C1; không lấy F làm thay eval AI thật. |
| S | CI/hook/merge/notes/ts-hooks đọc kỹ, API phân trang qua stub; 56 key giả, I/O eval unit, config retro fixture. Không key/network thật. Các rủi ro previous_filename/pagination race đã KNOWN, không báo lại. |
| P | Hai cỡ tải mới, paired old/new; bảng số Node/exe tách riêng, so mốc đúng máy; chênh lịch sử có kiểm thích nghi. Không phát hiện P mới. |
| B | noUnused sáu vùng, deps/tokens/codemap/AST+caller, manifest/lockfile/size; thêm PURGE_REMINDER dùng nội bộ. Không xác nhận chi phí bloat mới. |
| T | 323 tools, E20/zone, 10 mutant, 55 E2E cuối; map/rà 54 file test. F1 có bằng chứng đỏ có kiểm soát. Không coi import/config error là mutant bị giết. |
| A | E2E keyboard/focus/headerHidden/purge notice/9b/6f, i18n và tiền/ngày qua domain; D/E có 4 vấn đề hiển thị/trợ năng riêng, không báo lại ở F. Chưa chạy screen reader thực. |

## 9. Phụ lục

### 9.1 Nguồn và cách tái chạy

Mọi đường dẫn dưới thuộc `C:/workspace/deep-review-1-6-r3/codex/F/` trừ khi ghi rõ. Repo luôn đúng SHA ghim.

| Nguồn | Lệnh/đầu ra |
|---|---|
| prepare.mjs; manifest.json | Chép 743 tracked file, junction dependencies. Manifest 91 file F đầu phiên; không pnpm install. Nhãn console E của prepare kế thừa từ probe E nhưng filter/manifest thực tế là F (91 file). |
| mutations.mjs; tools-vitest.config.mjs | `node F/mutations.mjs`; control-tools.json 323/323; mutations.json; control-final.json 115/115. Từng mutant finally trả source copy. |
| R69-R92.mjs; db-vitest.config.mjs | `node F/R69-R92.mjs`; 6 E20 control, 2 múi giờ ×1 ca; mutant và JSON/log từng id. |
| core-probe.mjs | `node F/core-probe.mjs`; key HTTP giả hoàn toàn, retro-home fixture/junction, notes; core-results.json/core-final.log. Native CLI retro chỉ thay homedir/git root, logic CLI/core giữ nguyên. |
| cross.mjs; loader.mjs | `node F/cross.mjs`; cross-results.json, cross-final.log, N1.xlsx. AppData thật, port file RAM; không gọi thẳng DB ngoài run để kết luận màn. |
| legacy.mjs | `node F/legacy.mjs`; cổng debug9467, exe/common + DB từ own R2/B/exe chép vào legacy-exe. legacy-results.json/UI/log; nguồn SHA256 864b4d8cd5ab72c3e0aabc3305d595a2f7c9bcc4a663db4dc38202186992c6d7 giữ nguyên. Chỉ dừng child exe của F. |
| e2e-server.mjs; e2e.config.mjs; copy/e2e/probe-safe.ts | Server localhost4207, Vite source/CSS thật, snapshot từ buildDemoSnapshot, VITE_DEMO_ANCHOR=15/09/2026. Chạy `node node_modules/@playwright/test/cli.js test -c F/e2e.config.mjs`: **55/55**; không dùng harness dev làm số bundle/perf production. |
| clock-probe.mjs | `node F/clock-probe.mjs`; control 1 xanh, advance1day 1 đỏ; clock-rollover.log giữ expectation/received thật. Chỉ patch test copy, finally trả nguyên. |
| purge-node.mjs | Chép script common/perf, chạy với repo/backup/output/runs=5; purge-node.json/log. Thao tác SQL chỉ ở probe lệnh, không suy ra UI. |
| perf-paired.mjs | `node F/perf-paired.mjs`; git show nguồn4217ed4, cùng dependency/DB mới; perf-paired.json/final.log, r2-*-original.ts/r2-*.ts. Không phải toàn runtime/exe cũ. |
| audit.mjs; bloat.mjs; test-audit.mjs | audit-commands.json, unused-*.log, deps/tokens/codemap/notes/size/load-regenerated.log; export-refs.json/bloat.json/test-audit.json; reviewed-diff.patch/scope.json. |
| write-report.mjs; report-template.md; final-check.mjs | R-combined.json, perf-compare.json, final-check.json; kiểm đủ39, SHA/status/hash/links/đột biến đã hoàn nguyên trước đánh XONG. |

### 9.2 Đột biến trên bản chép

| ID | Gỡ/làm sai trên copy | Test đỏ /xanh | Kết quả |
|---|---|---:|---|
| R85-pagination | Bỏ --paginate | 3 / 3 | KILLED |
| R85-count | Bỏ kiểm thiếu count/commit | 2 / 4 | KILLED |
| R86-roots | Chỉ đọc config hiện tại | 3 / 14 | KILLED |
| R86-dedup | Bỏ Set realpath | 2 / 15 | KILLED |
| R76-two-layers | Bỏ lượt unescape thứ hai | 4 / 51 | KILLED |
| N-notes-accepted | Đọc tràn OPEN sang RESOLVED/ACCEPTED | 11 / 13 | KILLED |
| N-ts-index | Bỏ thử /index.ts | 4 / 9 | KILLED |
| N-ts-raw | Bỏ JSON.stringify raw text | 1 / 12 | KILLED |
| R69-mutant | Bỏ latest.seq > afterSeq | 3 / 3 | KILLED |
| R92-mutant | Clock10h UTC thay11h | 1 / 0 | KILLED |

**10/10 test bắt được; 0 mutant sống trong tập này.** N-ts-index còn đỏ do hàm được gọi trực tiếp không còn trả đường dẫn index.ts như hợp đồng, khác lỗi import/config ngoài test. N-ts-raw trả source không JSON hợp lệ nên ca kiểm nguyên văn bắt được. Không suy từ mười đột biến này thành “toàn bộ code không thể sai”.

### 9.3 Lỗi harness đã xử lý và giới hạn

- tools baseline lần đầu đưa nhầm hai file Playwright vào Vitest và copy chưa có Git index: lỗi runner + một ca `git ls-files` không chạy được. Đã sửa config/copy index, control 323/323 trước khi nhận bất kỳ mutant. `tools-baseline.*` giữ để truy vết, không dùng làm kết quả sản phẩm.
- cross N3 lần đầu gọi listAiAnalyses cho KH đã purge nên CUSTOMER_NOT_FOUND đúng hợp đồng; đổi assertion probe và đọc backup để kiểm không còn row. cross-final đủ5/5. Retro fixture lần đầu đặt sai tên thư mục mã hóa; sửa riêng fixture, CLI cuối 2 phiên/2 nguồn.
- Legacy lần đầu custom loader xung đột require CJS/file URL, sau đó cần chờ document Tauri qua navigation; chuyển hooks chuẩn + file URL và chờ URL. Chỉ legacy-results.json/legacy-final.log thành công được dùng kết luận. Không sửa sản phẩm để vượt probe.
- E2E lượt đầu 54/55, một ca Team chuyển hash tới Cài đặt timeout trong dev harness; chạy riêng 3/3 xanh và cả bộ cuối55/55. Không đủ bằng chứng gán timeout đó cho sản phẩm; giữ log gốc. F1 có nguyên nhân/tái hiện riêng, không lấy timeout này làm bằng chứng nửa đêm.
- audit ban đầu đọc dependency-cruiser/package.json qua exports bị chặn; đọc metadata bằng fs và chạy tiếp phần còn lại, không lặp các kiểm noUnused/codemap đã xanh. Paired lần đầu thiếu drizzle-orm từ thư mục ngoài repo; thêm junction **chỉ của F** tới dependency DB sẵn có, rồi assert output và đo lại.
- Baseline chung đã chạy pnpm verify/Rust/full production e2e/build exe ở SHA ghim; F dùng kết quả được cho phép, **không tự nhận** đã chạy lại toàn bộ3159 TS/104 Rust/247 e2e hay benchmark exe đầy đủ. Raw logs giữ ở common/gates.

### 9.4 Trạng thái cuối

- SHA cuối: **119e2e45cbce54d8a3943757bd826a7f1e9b694f**, đúng SHA đầu.
- Git status cuối trùng đầu:

~~~text
?? .agents/
?? .codex/
?? AGENTS.md
~~~

- Hash 91 file F của repo trùng manifest đầu; **743 file tracked trong copy trùng byte repo**, không còn mutant. Không nhận source bị lỗi runner là mutation giết được.
- 8 junction @p2c được kiểm, đều về packages của repo gốc; không có link sang copy/F.
- Đã dừng server F4207 và child exe F9467; không dừng tiến trình phiên khác. Cache/build/probe riêng giữ lại để kiểm chứng.
- **Giờ xong: 2026-10-21 00:36:09 +07:00** (Asia/Bangkok). final-check.json chứa SHA/status/hash/links/Rcount và số dòng đo.

## 10. Kết luận v1.0 ở 119e2e4

**CHƯA SẴN SÀNG** theo tiêu chí Owner đã chọn sửa hết trước G7. Bảng R **39/39 đã sửa**; không có Critical/High/Medium mới được chính Codex xác nhận. Các chuỗi dọn hẳn, backup/migration, chỉ số/Excel và các ngưỡng hiệu năng đã kiểm đều đạt trong phạm vi nêu trên.

Còn **6 phát hiện mới CONFIRMED của Codex**: C1 (dấu tách dòng Unicode trong phiên web), D1 (focus thêm/xóa TL), D2 (hàng dữ kiện đang soạn tràn), D3 (tên KH dài đẩy nút), E1 (tên nút HĐ còn sống trùng), F1 (full-cycle phụ thuộc nửa đêm). Năm Low và một Nit này cần được xử lý theo quyết định sửa hết; không diễn giải mức Low/Nit thành lỗi mất dữ liệu.

Đây là kết luận tham khảo của Gói F trên **báo cáo Codex**; không so/gộp với bên khác, không tạo Issue, không đề xuất merge hay tự quyết phát hành. Chờ Owner yêu cầu tổng hợp.