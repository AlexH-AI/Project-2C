# Review độc lập Phase 5 — gói A

- Ngày: 10/10/2026 (Asia/Bangkok).
- SHA kiểm trước và sau review: **0df3606fb783cc89b1b9c413c02810340e273a4f**, detached HEAD.
- Phạm vi: packages/ai + phần Phase 5 của domain; đọc thêm đúng các điểm nối để kiểm hợp đồng.
- Kết quả: **5 phát hiện mới CONFIRMED (4 Medium, 1 Low)** và **1 bổ sung KNOWN có bằng chứng mới (Low)**. Không có Critical/High; không kết luận G7 vì phiên này chỉ làm A.
- Độc lập: không đọc, mở, liệt kê hay tìm trong thư mục báo cáo của bên còn lại; không đọc báo cáo review khác cho đợt này. Không tạo Issue, không merge, không gọi AI thật, không mở ChatGPT, không đọc Credential Manager.
- Repo không bị sửa. Mọi probe, mutation và log ở thư mục A cạnh báo cáo này. Bản sao mutation đã hoàn nguyên, kiểm byte-for-byte với nguồn. **Worktree vốn chưa sạch từ đầu**: ba mục untracked có sẵn .agents/, .codex/, AGENTS.md; cuối phiên giữ nguyên ba mục này. git diff và git diff --cached đều rỗng. Không xóa chúng để làm giả trạng thái sạch.

## Bằng chứng kiểm tra

- Bộ test hiện có: 15 file / **281 test đạt** (packages/ai và evidence-level/kyc-fact của domain).
- Probe bổ sung: 9 test đạt; phép đo hiệu năng đã chạy và đạt trước đó, được bỏ qua ở lần cuối để không đo lặp. Nguồn/log đầy đủ lưu ở phụ lục.
- Corpus độc lập đọc G5 trực tiếp: **171 mục cụm từ, 990 phép kiểm** — nguyên văn, viết hoa, NFD, NBSP, xuống dòng, bỏ dấu theo từng cột G5. Không thiếu mục cụm từ trong code. Các regex được đối chiếu bằng đọc từng mẫu và ca kiểm G5 C1–C19 cùng probe pháp lý/Unicode.
- Mutation: 8 thay đổi độc lập trên bản sao; 4 bị bộ test hiện có bắt, **4 sống sót**. Test đối chứng mới bắt cả 4 mutation sống sót.
- tsc --noUnusedLocals --noUnusedParameters của ai/domain: đạt. codemap:check: đạt. lint:deps: 0 vi phạm (297 module, 1.156 phụ thuộc).
- Không chạy pnpm eval:ai; không chạy e2e/UI, kiểm key thật, hay clippy (ngoài gói A). Không coi test gói A là chứng minh cho các gói B–F.

## Phát hiện

### CX-A1 — Quét JSON lặp từ mỗi dấu mở làm output bẩn khóa luồng JS

- **Mức:** Medium
- **Trục:** P (chính); E, S
- **Vị trí:** packages/ai/src/extract-json.ts:10–17,23–34; packages/ai/src/prompts/retry.ts:38; packages/ai/src/web.ts:102 (0df3606)
- **Tình trạng:** CONFIRMED
- **Mô tả:** Mỗi dấu mở không có dấu đóng khiến closingBrace quét lại toàn bộ phần còn lại. Chuỗi n dấu mở cần gần n(n+1)/2 lượt đọc ký tự; kiểm câu trả lời dán và câu trả lời adapter chạy đồng bộ trên cùng luồng JS.
- **Tái hiện / bằng chứng:** Probe “measures pathological extractJson work…” gọi extractJson('{'.repeat(n)), khởi động 1.000 ký tự rồi đo 3 lần/mức; số dưới là trung vị. Máy i9-12900K, Node v24.20.0 x64; raw ASCII nên số ký tự bằng số byte.

| Ký tự / byte | Trung vị (ms) |
|---:|---:|
| 1.000 | 1,17 |
| 5.000 | 23,19 |
| 10.000 | 91,79 |
| 20.000 | 362,92 |
| 40.000 | 1.457,83 |
| 80.000 | 5.874,98 |

- checkWebAnswer với đúng **20.000** dấu mở được phép vào parser; timer 0 ms chỉ chạy sau **373,34 ms**. Đây là đo event loop Node, không phải FPS hay thời gian render WebView. 1.000 output hợp lệ qua validator mất tổng 136,72 ms, để đối chứng đường bình thường.
- **Ảnh hưởng:** RE dán output bẩn bị treo thao tác khoảng vài trăm ms ở trần web. Output OpenCode được cho phép thân đến 2 MiB và không có giới hạn riêng trước parser; probe 80 KB đã chiếm gần 6 giây. Không ngoại suy số giây ở 2 MiB và không đã đo trên trình duyệt.
- **Đề xuất:** Parser một lượt hoặc thuật toán giữ vị trí dấu mở, không quét lại mọi hậu tố; thêm ngân sách xử lý output và ca tải nhiều dấu mở. Ước lượng ≤400 dòng SP, không cần dependency mới. Giữ hành vi đã duyệt: bỏ prose/fence và lấy khối JSON đầu tiên.

### CX-A2 — Biến thể vô hình / chữ tương tự lọt V3–V6 và thành ACCEPTED

- **Mức:** Medium
- **Trục:** G (chính); S, E
- **Vị trí:** packages/ai/src/text-match.ts:17–24,31–32,37–38; packages/ai/src/blocklists.ts:51,80,83; packages/ai/src/validator.ts:184–195 (0df3606)
- **Tình trạng:** CONFIRMED
- **Mô tả:** NFC + bỏ dấu + gộp whitespace không loại U+200B, không chuẩn hóa fullwidth/homoglyph; mẫu số pháp lý chỉ nhận chữ số ASCII. Các ý thuộc danh sách chặn vẫn có thể được lưu dưới dạng output được chấp nhận.
- **Tái hiện / bằng chứng:** Probe “records actual accepted bypasses…” đặt từng câu vào hypotheses[0].text, evidence F3 tồn tại. Cả validateOutput trả [] và checkWebAnswer trả row.status = ACCEPTED trong **10/10 ca**. Các escape dưới biểu diễn chính xác ký tự trong nguồn probe, không phải chuỗi backslash gửi model.

| Luật | Câu / biến thể đi qua |
|---|---|
| V3 | KH có 70 percent cơ hội đồng ý |
| V3 | KH có xác\u200bsuất đồng ý lớn |
| V3 | KH có ７０％ cơ hội đồng ý (fullwidth) |
| V4 | Đề xuất P\u200brudential cho KH |
| V4 | Đề xuất ＡＩＡ cho KH (fullwidth) |
| V4 | Đề xuất Manυlife cho KH (υ = U+03C5) |
| V5 | KH có mã I\u200bNTJ |
| V5 | KH có mệnh\u200bKim |
| V6 | Theo Lu\u200bật Kinh doanh bảo hiểm |
| V6 | Theo Điều ٣٥ (U+0663,U+0665) |

- **Ảnh hưởng:** Câu trả lời model hoặc câu trả lời dán chủ động né luật có thể hiện trong phân tích chính; không cần phá evidence hay schema. Không chứng minh đã có model thật trả các câu này, không có ghi DB trong probe, không suy ra AI tự ghi KYC hay tự mua sản phẩm.
- **Đối chiếu nguồn đúng:** Code chép đúng thuật toán G5 §7 ở các ca chuẩn; đây là **khoảng hở guardrail**, không phải thiếu mục blocklist. Golden ai-eval §2.2 R1 đã coi ý trong danh sách viết cách khác để né (“70 percent”, tên hãng biến thể…) là vi phạm. Không gán lỗi cho “phong thủy”, “sẽ mua nhà”, hay từ nằm ngoài G5.
- **Đề xuất:** Thêm corpus đối kháng cố định; duyệt qua G5 quy tắc xử lý ký tự vô hình/compatibility/chữ số và cách nói phần trăm trước khi đổi matcher. Không tự đổi golden hay chuẩn hóa quá rộng gây chặn nhầm. Phần cơ chế cơ bản dự kiến ≤400 dòng SP; không coi việc phát hiện mọi diễn đạt đồng nghĩa là giải quyết xong bằng regex.

### CX-A3 — Coverage không bảo vệ sự đầy đủ của blocklist G5

- **Mức:** Medium
- **Trục:** T (chính); G
- **Vị trí:** packages/ai/src/validator-blocklists.test.ts:45–167; packages/ai/src/blocklists.ts:28,40,63,86 (0df3606)
- **Tình trạng:** CONFIRMED
- **Mô tả:** Các test mẫu phủ mã matcher nhưng không bảo vệ từng mục đã được duyệt. Bỏ riêng một mục ở mỗi V3–V6 không làm test gói A đỏ.
- **Tái hiện / bằng chứng:** node A/mutations.mjs chạy 281 test hiện có, chỉ phá bản sao và hoàn nguyên bằng finally sau từng lần.

| Mutation | Sai lệch cố ý | Test hiện có |
|---|---|---|
| M1 | bỏ “tiềm năng mua” khỏi V3 | 281/281 xanh |
| M2 | bỏ “hanwha” khỏi V4 | 281/281 xanh |
| M3 | bỏ “ngũ hành” khỏi V5 | 281/281 xanh |
| M4 | bỏ “công văn số” khỏi V6 | 281/281 xanh |
| M5 | bỏ kiểm evidence V2 | 13 đỏ |
| M6 | bỏ kiểm quote trong ghi chú V7 | 2 đỏ |
| M7 | mở busy ngay khi Hủy | 2 đỏ |
| M8 | cố tình bỏ JSON có khóa a | 3 đỏ |

- Test đối chứng corpus-proof.test.ts: baseline 4/4 xanh; dưới M1–M4, từng mutant có đúng 1/4 đỏ. Như vậy các mutation sống sót thực sự làm hỏng luật, không phải thay đổi tương đương. Không chạy toàn bộ 2.152 test dưới mutant và không công bố mutation score toàn repo.
- **Ảnh hưởng:** Sửa nhầm hoặc làm rơi một mục G5 có thể qua kiểm gói A, dù baseline công bố coverage ai 100%. Không có bằng chứng blocklist ở SHA này đang thiếu mục.
- **Đề xuất:** Test độc lập từng mục G5 và từng cột Bỏ dấu, ranh giới từ, khối áp dụng; thêm kiểm nguyên văn/parity như prompt đang có. Nên đọc nguồn spec đã ghim hoặc fixture được đối chiếu với spec, không dựng expected từ BLOCKLISTS. ≤400 dòng SP; chủ yếu test.

### CX-A4 — Mock trích xuất gán con/cháu và hôn nhân sai nghĩa ghi chú

- **Mức:** Low
- **Trục:** C (chính); E
- **Vị trí:** packages/ai/src/mock-adapter.ts:136–145,156–168; packages/ai/src/mock-adapter.test.ts:125–138,145–154 (0df3606)
- **Tình trạng:** CONFIRMED
- **Mô tả:** Mẫu “<n> cháu” không phân biệt cháu ngoại; mẫu kết hôn chỉ loại vài phủ định ngay sát. Mock đề xuất giá trị trái ghi chú, rồi V7 giữ vì chỉ kiểm kiểu và quote.
- **Tái hiện / bằng chứng:** runExtraction với createMockAdapter, qua chính V1 và filterExtraction; cả bốn kết quả có dropped = [].

| Ghi chú | Đề xuất sai còn lại |
|---|---|
| KH có 2 cháu ngoại, cả hai đang học tiểu học. | childrenCount = 2, quote “2 cháu” |
| KH chưa đăng ký kết hôn, hiện sống độc thân. | Đã kết hôn + Độc thân |
| KH không muốn kết hôn, đang ưu tiên công việc. | Đã kết hôn |
| KH vừa ly hôn sau 12 năm kết hôn. | Đã kết hôn |

- **Ảnh hưởng:** Demo/offline dùng Mock có đề xuất sai, dễ tạo mâu thuẫn cốt lõi nếu RE xác nhận nhầm. App vẫn cần RE xác nhận; không tự ghi dữ kiện. Vì chỉ Mock và có bước xác nhận nên xếp Low.
- **Đối chiếu:** G5 extraction quy tắc 1 yêu cầu ghi chú nói rõ, không suy từ ngữ cảnh; spec §10 yêu cầu Mock dựa vào đầu vào. Không yêu cầu Mock hiểu mọi ngôn ngữ; trường hợp không chắc nên trả ít đề xuất.
- **Đề xuất:** Giữ bộ mẫu hẹp, loại cháu nội/ngoại và tình trạng phủ định/đã ly hôn, dùng quote chứa đủ ngữ cảnh. Thêm ca cụ thể trên; không mở rộng thành parser NLP. ≤400 dòng SP.

### CX-A5 — Bổ sung KNOWN: V6 chặn nhầm luật sư khi viết hoa

- **Mức:** Low
- **Trục:** G (chính); C, E
- **Vị trí:** packages/ai/src/blocklists.ts:83; packages/ai/src/text-match.ts:22,57 (0df3606)
- **Tình trạng:** **KNOWN — bằng chứng mới tái hiện CONFIRMED**, cùng lớp “G5 chặn nhầm câu thường” ở common/known.md:43–47. Không tính là phát hiện mới độc lập.
- **Mô tả:** G5 C16 cho phép hỏi về luật sư, nhưng viết “LUẬT SƯ” hoặc “Luật Sư” bị mẫu luật + chữ hoa hiểu thành tên luật. Ngoại lệ “pháp luật” cũng chỉ nhận ba kiểu chữ liệt kê, nên pHáp/PhÁp bị chặn.
- **Tái hiện / bằng chứng:** Probe “V6 exempt phrase capitalization…” dán hai lần output chỉ có câu **“Hỏi KH đã có LUẬT SƯ gia đình chưa”**, evidence hợp lệ. Lần đầu retry V6; lần hai row REJECTED, attempts = 2, detail có “LUẬT S”. “Đúng pháp luật Việt Nam” đạt; “Đúng pHáp luật Việt Nam” và “Đúng PhÁp luật Việt Nam” trượt V6. Nguồn/log/results đều có.
- **Ảnh hưởng:** Model hoặc RE dán nội dung viết hoa thông thường bị loại và mất một lần thử dù ý câu thuộc ngoại lệ đã duyệt. Chưa có dữ liệu tần suất thực tế; xếp Low.
- **Đề xuất:** Bổ sung C16 viết hoa và ngoại lệ mixed case vào lần chỉnh G5 tiếp theo; quyết quy tắc phân biệt tên văn bản với nghề luật sư rồi đổi matcher. Code hiện chép đúng regex G5; không tự sửa danh sách/golden cho xanh. Cỡ cơ chế ≤400 dòng SP.

### CX-A6 — Thử lại gửi raw output vượt ngân sách Rust, làm mất lịch sử REJECTED

- **Mức:** Medium
- **Trục:** C (chính); E, D
- **Vị trí:** packages/ai/src/run.ts:203–209,317–320; packages/ai/src/prompts/retry.ts:38–40; điểm nối apps/desktop/src-tauri/src/ai.rs:25–29,138–155,217–224 (0df3606)
- **Tình trạng:** CONFIRMED tại hợp đồng bằng adapter giả, chưa gọi Rust/mạng thật.
- **Mô tả:** Rust cho phép thân trả lời tới 2 MiB, nhưng tổng message yêu cầu chỉ 200.000 ký tự. converse gửi nguyên content sai thành message assistant mà không kiểm ngân sách; một output được tầng response chấp nhận có thể khiến chính lần retry không còn là request hợp lệ.
- **Tái hiện / bằng chứng:** Probe “retry that exceeds the documented Rust message budget” dùng adapter giả áp đúng tổng code point của ai.rs. Lần đầu trả 'x'.repeat(210000), không JSON; lần hai tự từ chối nếu message >200000.
  - Request đầu: system + user, **5.136** ký tự.
  - Retry: system + user + assistant + user, **215.395** ký tự.
  - runAnalysis trả **{ kind: 'error', code: 'AI_BAD_REQUEST' }**, không row; chỉ lần đầu có thể gọi mạng theo hợp đồng Rust.
  - Chuỗi ASCII 210 KB, cộng envelope vẫn dưới 2 MiB. Đối chiếu ai.rs: kiểm response không có trần 200.000 cho content; check(request) kiểm tổng message trước đọc key/gọi mạng.
- **Ảnh hưởng:** Output bẩn/dài gây “lỗi lập trình” thay vì xử lý validator; lỗi V1 lần đầu và raw output không vào ai_analyses. Đường extraction dùng cùng converse cũng bị. Đây là mất lịch sử lần phân tích dự kiến, không phải hỏng/xóa KYC hay DB.
- **Đề xuất:** Làm rõ hợp đồng kích thước giữa response, retry đầy đủ G5 và trần message, rồi xử lý có chủ đích trước adapter (giới hạn response phù hợp hoặc quy tắc trạng thái khi không thể retry). Cần giữ G5 “nguyên content lần sai” hoặc xin duyệt thay đổi đó; không cắt tùy ý rồi vẫn gọi là cùng hợp đồng. ≤400 dòng SP, có test boundary tổng kích thước.

## Bảng đếm mức × trục

Đếm theo **trục chính**, mỗi ID chỉ một lần. CX-A5 là KNOWN bổ sung, bao gồm trong tổng 6 để thấy đầy đủ nhưng tách khỏi 5 phát hiện mới.

| Mức | E | G | C | D | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 1 | 1 | 0 | 0 | 1 | 0 | 1 | 0 | 4 |
| Low | 0 | 1* | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 2 | 2 | 0 | 0 | 1 | 0 | 1 | 0 | 6 |

*1 Low ở G = bổ sung KNOWN.

## Đi qua mọi trục; “đã xét, không thấy” và giới hạn

| Trục | Đã xét / kết quả |
|---|---|
| E | Rỗng, array 0/1/20/21, thiếu/thừa khóa, text 300/301, evidence trùng/sai, nested JSON/fence/prose/nhiều khối, NFD/NFC/NBSP/Unicode, ngày nhuận, tuổi, hai lời gọi chồng nhau, Hủy, lỗi lần hai. Có CX-A1/A2/A4/A5/A6. Ngoài các mục đó, đã xét, không thấy lỗi mới. Runner giữ busy sau Hủy, không retry output muộn; bỏ key/name/id khỏi input. Tải lại/thay DB thuộc lớp app/DB gói B/D/F, A không giữ DB. |
| G | Đối chiếu từng luật V1–V7, 171 mục cụm G5, regex và ca C1–C19. Có CX-A2/A3/A5. Đã xét, không thấy lỗi mới ở V2 (codes/hạng mục), phần V7 đúng kiểu/quote/field và retry 2 lần bình thường. V3/V4/V6 vẫn áp personalityNotes; riêng V5 miễn khối đó. R2–R7 kiểm ý bằng tay theo golden; không coi việc V7 giữ residence Hà Nội với quote “có 2 con” là vi phạm luật V7, vì V7 không kiểm quan hệ ngữ nghĩa. |
| C | Prompt analysis/discovery/extraction/retry/web đối chiếu nguyên văn G5 bằng đọc và test; version/model/reasoning/settings fallback đúng spec. Có CX-A4/A6; CX-A5 liên quan. Output extra keys được **strip**, không strict như input; có test cố ý strip khối analysis khỏi discovery. Đã xét, không thấy hậu quả sai/unsafe mới từ việc strip: analysisOutcome lưu bản parse đã strip. |
| D | A chỉ trả row/proposal; không import DB, không tự ghi KYC. Snapshot input độc lập profile, F thay thế không gửi; Mock/web không lưu model/reasoning/token; raw cuối bị cắt 20.000 code point, lỗi mạng/Hủy không trả row. Có thiếu lịch sử ở CX-A6. Ngoài đó, đã xét, không thấy lỗi dữ liệu mới trong A. Migration/backup/transaction/CURRENT-STALE cần review B/F, chưa kết luận ở đây. |
| S | Kiểm input whitelist, tuổi thay năm sinh, fields extraction trừ birthYear/gender, ghi chú gửi nguyên văn đúng cảnh báo spec; no key/network/invoke/URL trong lõi A, lỗi giữ mã + thông điệp tối đa 200 code point. Output là dữ liệu parse, không eval/HTML interpreter. Có Unicode né guardrail CX-A2 và chặn JS CX-A1. Prompt injection trong note/fact không thể thêm role qua JSON.stringify; **không chứng minh model không nghe lệnh trong dữ liệu**, vì không gọi thật. Quote/evidence có thật cũng không chứng minh ý output đúng (golden đọc tay). CSP/capabilities, URL và masking key của Rust/DOM rendering dành C/D/F; không tuyên bố đã kiểm xong. |
| P | Đã đo parser, delay timer và validator; có CX-A1. Đường validator output hợp lệ khoảng 0,137 ms/lần trong batch này; ngoài parser đã xét, không thấy vấn đề hiệu năng mới có số đo. Không dùng baseline bundle để suy tốc độ WebView. |
| B | tsc noUnused đạt; rg các export/callsite, index, schema, settings, prompt, adapter và dependency-cruiser; codemap check đạt. Đã xét, không thấy bloat mới có tác hại. Các vấn đề đã ghi common/known.md:50,67–73 (isoDate, session id, 20.000, API export nội bộ, provider metadata, retry module) là KNOWN; không lập lại phát hiện khi không có bằng chứng mới. Lặp nhãn ai/i18n hiện đúng và là 2 nơi, không thỏa điều kiện lặp ≥3 của kế hoạch. |
| T | 281 test baseline; thử 8 mutation, test đối chứng 4 guardrail; có CX-A3. Các seam evidence/quote/Hủy/extract JSON thực sự đỏ khi phá. Ngày fixture cố định, Mock xác định; đã xét, không thấy test mới phụ thuộc đồng hồ/thứ tự trong các file đọc. Không nâng coverage 100% thành chứng minh đầy đủ đầu vào. |
| A | Đối chiếu 8 nhãn hạng mục + 21 nhãn trường input.ts với vi.ts:92–120, chi tiết lỗi tiếng Việt, nhãn mode/system qua mã cho lớp UI; đã xét, không thấy sai i18n mới. A không có DOM/focus/aria; không có bề mặt trợ năng trực tiếp để test, cần D. Regex phần trăm/chữ pháp lý đã xét ở G/E, không đánh đồng với nhãn UI. |

## Phạm vi đã đọc (file, dòng)

Tất cả vị trí thuộc SHA ghim. Manifest A/source-manifest.json ghi hash và số dòng chính xác; 38 file nguồn/test A đã so nguồn repo với git show HEAD và bản sao hoàn nguyên.

| File (prefix packages/ai/src/) | Dòng đã đọc |
|---|---|
| adapter.ts; blocklists.ts | 1–37; 1–92 |
| errors.ts; errors.test.ts | 1–46; 1–55 |
| extract-json.ts; extract-json.test.ts | 1–36; 1–41 |
| index.ts; raw.d.ts; test-support.ts | 1–11; 1–5; 1–69 |
| input.ts; input.test.ts | 1–132; 1–158 |
| mock-adapter.ts; mock-adapter.test.ts | 1–170; 1–183 |
| models.ts; models.test.ts | 1–35; 1–27 |
| settings.ts; settings.test.ts | 1–86; 1–94 |
| run.ts; run.test.ts | 1–394; 1–619 |
| schema.ts; schema.test.ts | 1–159; 1–324 |
| text-match.ts | 1–60 |
| validator.ts; validator.test.ts | 1–228; 1–176 |
| validator-blocklists.test.ts; validator-extraction.test.ts | 1–167; 1–127 |
| web.ts; web.test.ts | 1–121; 1–286 |
| prompts/analysis.ts; prompts/discovery.ts | 1–48; 1–43 |
| prompts/extraction.ts; prompts/connection.ts | 1–27; 1–13 |
| prompts/retry.ts; prompts/prompts.test.ts | 1–51; 1–55 |

Phần domain:
- evidence-level.ts:1–52; evidence-level.test.ts:1–121.
- kyc-fact.ts:1–57; kyc-fact.test.ts:1–39; index.ts:47–56 và diff Phase 5.
- kyc-catalog.ts, kyc-gate.ts: toàn file (điểm nối cổng/trường).
- period.ts:1–61,100–147 (CalendarDate, miền năm, format/parse/compare).

Điểm nối đọc có chủ đích:
- apps/desktop/src-tauri/src/ai.rs:25–65,125–235 (hợp đồng size/check/reply phục vụ A6; không review mạng/key thật).
- packages/db/src/kyc.ts:370–389 (wrapper normalize); ai-analyses.ts:85–154 và các kết quả rg rawOutput (không review DB toàn diện).
- apps/desktop/src/i18n/vi.ts:92–120 qua rg, đối chiếu nhãn.
- Callsite tìm bằng rg trong apps/packages/tools/e2e, chỉ tập trung API A và bốn mục mutation. Không tìm trong thư mục báo cáo.
- CLAUDE.md, CONTEXT.md, packages/ai/CLAUDE.md, packages/domain/CLAUDE.md: toàn file.
- phase-5-ai.md:1–430; phase-5-prompts.md:1–345; ai-eval.md:toàn file; ADR-0009:toàn file gồm D-1/G5/W-1.
- common/plan.md (§1–5 và quy tắc), baseline.md, known.md: đọc; không dựa báo cáo của reviewer khác.
- package.json; packages/ai/package.json; ai/domain tsconfig; tsconfig.base.json; vitest.config.ts: toàn file liên quan chạy và ranh giới.

## Phụ lục — nguồn probe, patch và lệnh tái hiện

Tất cả đường dẫn dưới tương đối với C:\workspace\deep-review-5\codex\A\. Script chỉ dùng dependency đã có trong repo.

- probe.test.ts: nguồn 10 probe; probe.config.mjs: alias đến nguồn **repo không sửa**.
- probe-results.json: corpus 990 ca, 10 bypass và trạng thái web, V6, V7/schema, Mock, runner, retry budget, số đo.
- probe-measurements.json: số đo trước lần cập nhật dữ liệu đối kháng; probe-first.log và probe-second.log giữ cả ứng viên bị chặn (Pru\u200bdential bị V4 “pru”, “nhóm I\u200bNTJ” bị V5 “nhóm i”). Hai ứng viên này **không** bị báo là bypass.
- probe.log: lần cuối 9 xanh / 1 phép đo bỏ qua. Phép đo trong probe-second.log đạt, 24,02 s tổng test đo; chỉ corpus candidate test của lần đó thất bại. Không giấu các lần điều chỉnh probe.
- mutations.mjs; mutation-M1…M8.json: nội dung patch thử chính xác; mutation-baseline.log, mutation-M1…M8.log; mutation-results.json: trạng thái và số test.
- corpus-proof.test.ts, corpus.config.mjs, corpus-proof.mjs, corpus-proof-baseline.log, corpus-proof-M1…M4.log, corpus-proof-results.json: chứng minh mutation sống sót làm hỏng đúng luật.
- mirror/: bản sao nguồn ai/domain + G5 dùng chạy test hiện có. Đã hoàn nguyên; không phải code đề xuất sửa.
- manifest.mjs; source-manifest.json: metadata máy, SHA, status, SHA-256 từng file và đối chiếu byte với git/mirror.

Chạy từ C:\workspace\Project-2C-review-2 (PowerShell):

~~~powershell
# Baseline gói A, không dịch vụ thật.
pnpm exec vitest run packages/ai/src packages/domain/src/evidence-level.test.ts packages/domain/src/kyc-fact.test.ts --reporter=dot

# Nhanh: dùng số đo đã lưu, chạy các probe logic.
$env:CX_A_SKIP_PERF = '1'
pnpm exec vitest run --config 'C:\workspace\deep-review-5\codex\A\probe.config.mjs' --reporter=verbose

# Chạy lại phép đo nếu cần; chưa đo 2 MiB vì có thể khóa JS lâu.
Remove-Item Env:CX_A_SKIP_PERF -ErrorAction SilentlyContinue
pnpm exec vitest run --config 'C:\workspace\deep-review-5\codex\A\probe.config.mjs' --testNamePattern 'measures pathological' --reporter=verbose

# Chỉ phá bản sao, finally luôn phục hồi.
node 'C:\workspace\deep-review-5\codex\A\mutations.mjs'
node 'C:\workspace\deep-review-5\codex\A\corpus-proof.mjs'

pnpm exec tsc -p packages/ai --noUnusedLocals --noUnusedParameters
pnpm exec tsc -p packages/domain --noUnusedLocals --noUnusedParameters
pnpm codemap:check
pnpm lint:deps
node 'C:\workspace\deep-review-5\codex\A\manifest.mjs'
git rev-parse HEAD
git diff --exit-code
git diff --cached --exit-code
git status --short
~~~

Kết thúc gói A tại SHA ghim, không sửa lỗi và không chuyển sang gói khác.

