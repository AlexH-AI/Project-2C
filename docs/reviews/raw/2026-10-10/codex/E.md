# Deep review Phase 5 — gói E (Codex)

- Ngày: 10/10/2026.
- Repo: `C:\workspace\Project-2C-review-2`.
- SHA đầu và cuối phiên: `0df3606fb783cc89b1b9c413c02810340e273a4f` (đúng SHA ghim).
- Phạm vi: tools eval + fixture, e2e AI và support, thay đổi CI / ranh giới module / coverage / codemap trong `3e84ce8..0df3606`.
- Kết quả: **5 phát hiện mới, đều CONFIRMED: 3 Medium, 2 Low**. Hai mục đã có trong `common/known.md` được tái hiện và ghi riêng, không tính mới.
- Đây chỉ là báo cáo gói E; không kết luận G7 thay gói F, không tạo Issue, không đề xuất merge.

Review thực hiện trong phiên chính, không subagent. Chỉ đọc repo và ba tài liệu common; không đọc / liệt kê / tìm trong thư mục báo cáo của bên kia, không đọc báo cáo review khác. Không chạy `pnpm eval:ai`, không truy cập Credential Manager, không dùng key thật, không mở chatgpt.com. Mọi fetch trong probe đều tiêm hàm giả; trình duyệt probe chỉ được truy cập localhost.

**Trạng thái worktree:** `git diff --exit-code` và `git diff --cached --exit-code` đều 0. Không sửa file tracked, không commit. Tuy nhiên `git status --porcelain=v1` có ba mục untracked: `AGENTS.md`, `.agents/`, `.codex/`. Cả ba có CreationTime / LastWriteTime 10/10/2026 12:51:11, trước các lượt kiểm chứng của review (unit test lúc 14:16). Chúng không phải output do probe tạo; giữ nguyên theo yêu cầu chỉ đọc. Vì vậy **không tuyên bố git status hoàn toàn sạch**. Mọi nguồn probe, log và kết quả do review tạo đều ở `C:\workspace\deep-review-5\codex\E\`. Mutation chỉ diễn ra qua Vite transform vào build ngoài repo; server đã đóng và các build tạm được dọn.

## 1. Kiểm chứng

| Kiểm | Kết quả |
|---|---|
| `pnpm exec vitest run tools/eval-ai-core.test.mjs tools/codemap-core.test.mjs tools/pr-core.test.mjs` | 3 file, **102 test xanh**, tổng 896 ms |
| `pnpm lint:deps` | 0 vi phạm; 297 module / 1.156 dependency |
| `pnpm codemap:check` | Export maps are up to date |
| `pnpm typecheck` | xanh, gồm compiler flag `noUnusedLocals` / `noUnusedParameters` đã bật ở tsconfig.base |
| 3 file e2e AI trên production build gốc | **18/18 xanh**, 35,7 s; 2 worker, không retry |
| E2E khối AI lịch hẹn + các luồng bàn phím dùng support chung | **7/7 xanh**, 10,8 s |
| Mutation render model output thành HTML | **18/18 vẫn xanh**, 38,0 s; probe riêng tìm thấy phần tử HTML do model cung cấp |
| Mutation đối chứng đổi chữ output | **1/1 đỏ**, tại customer-ai.spec.ts:101; test bắt sai nội dung tham khảo |
| 10 cạnh dependency giả dùng chính validator dependency-cruiser và cấu hình repo | Tất cả khớp kỳ vọng: cho domain / zod / db→schema, chặn ai→db / app / Node / React, db→index / run, schema→validator |
| Bộ eval Mock đầy đủ, 1 warm-up + 10 mẫu | median 13,27 ms, max 19,54 ms; format report median 0,47 ms, max 0,81 ms; report 44.914 byte |

E2E dùng config tạm: giữ production build, Edge, locale vi-VN, ngày seed 15/09/2026, dữ liệu snapshot dựng bằng code app; output / trace ngoài repo. Không chạy toàn bộ 182 e2e hay toàn bộ `pnpm verify` trong phiên này. Số coverage / Rust / full e2e trong baseline là số đo được cung cấp ở common, không giả thành số đo mới của review.

## 2. Phát hiện mới

### CX-E1 — Chấm trích xuất không cùng cách chuẩn hóa với V7: có cả trượt nhầm và đạt nhầm

- **Mức:** Medium.
- **Trục:** C; liên quan E / G / T.
- **Vị trí (0df3606):** `tools/eval-ai-core.mjs:221–239`, đặc biệt 226; `tools/fixtures/ai-eval.mjs:284–285`. Seam: `packages/ai/src/validator.ts:121–157`, `packages/domain/src/kyc-fact.ts:33`.
- **Tình trạng:** CONFIRMED.
- **Mô tả:** V7 chấp nhận quote sau NFC và gộp khoảng trắng, nhưng `gradeNote` chỉ lowercase rồi tìm chuỗi thô. Predicate “Không được có” của X02 cũng tìm nguyên cụm `bác sĩ`, nên không bắt cùng nghề khi có xuống dòng / nhiều khoảng trắng.
- **Tái hiện / bằng chứng:** chạy `node C:\workspace\deep-review-5\codex\E\grading-edge.mjs`.
  1. X01 có đủ residence, maritalStatus, childrenCount=2, primaryGoal; quote residence là NFD của “Đà Nẵng”, quote số con là `hai\ncon`. Qua toàn bộ `runExtraction → V1 → V7`: status OK, 4 kept, 0 dropped. Phần chấm vẫn trả `pass:false`, báo thiếu residence và childrenCount.
  2. X02 có đủ ba dòng bắt buộc, thêm `occupation="Bác\nsĩ"`, quote đúng nguyên văn `Chồng chị là bác sĩ`. Sau V1/V7, đề xuất nghề của chồng còn trong kept; `gradeNote` trả `forbidden:[]`, `pass:true`. Bản cùng nội dung với dấu cách thường bị bắt. NFD **trong value** riêng lẻ không qua mặt được predicate vì domain đã chuẩn hóa value về NFC; đã kiểm và không báo sai ca này.
- **Ảnh hưởng:** số ghi chú “đạt phần script” và danh sách thiếu / cấm có thể sai khi model trả Unicode tương đương hoặc xuống dòng. Phần đọc tay của Owner vẫn cần thiết; đây chưa phải bằng chứng kết quả eval thật được cung cấp trong baseline là sai.
- **Đối chiếu:** golden `docs/golden/ai-eval.md` §5 yêu cầu script chấm field / keyword / số / boolean và cột “Không được có”; spec §6.4 cho V7 gộp khoảng trắng. Không đổi golden để hợp code.
- **Đề xuất:** chuẩn hóa NFC + lowercase + gộp khoảng trắng cho quote, keyword và các phép tìm cụm trong predicate cấm; giữ nguyên so giá trị số / boolean và phần đọc tay giá trị chữ. Thêm ca đối chứng NFC/NFD, newline, NBSP. Khoảng 30–70 dòng, dưới 400 dòng sản phẩm.

### CX-E2 — Hai lượt eval đồng thời ghi đè kết quả của nhau dù cả hai báo thành công

- **Mức:** Medium.
- **Trục:** D; liên quan E / C / T.
- **Vị trí (0df3606):** `tools/eval-ai-core.mjs:563–576`; `tools/eval-ai.mjs:49–50`.
- **Tình trạng:** CONFIRMED.
- **Mô tả:** kiểm `exists` xảy ra trước toàn bộ lượt gọi AI; lúc ghi dùng `writeFileSync` mặc định có thể truncate file đã xuất hiện. Hai tiến trình / hai lần gọi cùng model trong cùng ngày có thể cùng qua kiểm rồi lượt sau thay toàn bộ kết quả lượt trước.
- **Tái hiện / bằng chứng:** `probes.mjs` gọi `Promise.all([evalMain(GO), evalMain(CREDIT)])`, chỉ dùng key giả / fetch Mock; path metrics được ánh xạ sang một file trong codex/E.
  - Cả hai lần kiểm: `exists:false`.
  - 50 request giả được thực hiện.
  - Lượt GO ghi 44.943 byte; CREDIT ghi tiếp 44.947 byte vào cùng file.
  - Exit code: `[0,0]`; file cuối mang kết quả CREDIT, kết quả GO bị thay.
  - File bằng chứng: `E/overwrite-reproduction.md`; không ghi gì vào docs/metrics trong repo.
- **Ảnh hưởng:** Owner mở hai terminal chạy cùng ngày/model, hoặc một lượt chậm đang chạy và khởi động lượt khác, có thể mất kết quả đã trả phí. Tên file không phân biệt plan/reasoning làm hai cấu hình này cũng tranh cùng đích.
- **Đối chiếu:** comment evalMain “refuses to overwrite a result” và test `tools/eval-ai-core.test.mjs:610–615` chỉ xét file có sẵn trước lúc chạy.
- **Đề xuất:** claim tên file / lock bằng thao tác tạo độc quyền trước khi gọi mạng, hoặc ghi kết quả theo tên duy nhất và đảm bảo write không ghi đè. Khi claim thất bại phải dừng trước request; xử lý dọn claim khi lỗi. Khoảng 40–100 dòng và test hai lượt chồng nhau, không cần dependency mới.

### CX-E3 — Giới hạn response 2 MB chỉ kiểm sau khi Node đã đọc và cấp phát toàn bộ body

- **Mức:** Medium.
- **Trục:** S; liên quan P / C.
- **Vị trí (0df3606):** `tools/eval-ai-core.mjs:95–96,138–155`, đặc biệt `response.text()` ở 151.
- **Tình trạng:** CONFIRMED, có số đo.
- **Mô tả:** MAX_BODY không giới hạn số byte được đọc: toàn bộ response được chuyển thành string rồi mới dùng Buffer.byteLength để từ chối. Đây là adapter của script eval; không quy phát hiện này cho transport Rust của desktop.
- **Tái hiện / bằng chứng:** `probes.mjs` tiêm fetch trả `Response(ReadableStream)` gồm 32 chunk, mỗi chunk 1 MiB. Không gọi HTTP thật.
  - **33.554.432 byte (32 MiB) được đọc hết**, stream không bị cancel.
  - Sau đó mới trả AI_BAD_RESPONSE.
  - Một mẫu tại Node v24.20.0: 58,04 ms; RSS tăng 71.630.848 byte, khoảng **68,3 MiB**. Heap delta âm do GC nên không dùng heap delta để khẳng định lượng cấp phát.
  - Trần cấu hình là 2.097.152 byte: probe đọc gấp 16 lần trước khi chặn.
- **Ảnh hưởng:** lỗi upstream / proxy trả body quá lớn có thể làm script ăn bộ nhớ / bị kết thúc trước khi lưu các kết quả đã trả phí. Timeout 120 s giới hạn thời gian, không giới hạn bộ nhớ của body được đọc trong khoảng đó.
- **Đối chiếu:** adapter tự công bố làm như ai_complete; spec §5.2 yêu cầu “thân trả lời đọc tối đa 2 MB”. Test hiện tại chỉ kiểm mã lỗi sau khi body dài đã được tạo / đọc.
- **Đề xuất:** đọc stream theo chunk, kiểm tổng byte khi đang đọc, cancel reader ngay khi vượt trần, rồi decode / parse. Không chỉ tin Content-Length. Test kiểm số byte consumed và cancel, ngoài mã lỗi. Khoảng 40–90 dòng, dưới 400 dòng sản phẩm.

### CX-E4 — Adapter eval nhận token âm trong khi Rust coi cùng dữ liệu là 0

- **Mức:** Low.
- **Trục:** C.
- **Vị trí (0df3606):** `tools/eval-ai-core.mjs:117–121`; đối chiếu `apps/desktop/src-tauri/src/ai.rs:225–229`.
- **Tình trạng:** CONFIRMED.
- **Mô tả:** Node chỉ dùng Number.isInteger nên giữ token âm; Rust dùng serde_json as_u64().unwrap_or(0), không nhận số âm. Cùng response thành công tạo metrics khác nhau giữa CLI và exe.
- **Tái hiện / bằng chứng:** `extra-probes.mjs` tiêm response 200 có content `{}`, usage `prompt_tokens:-7, completion_tokens:-4`. Node trả `promptTokens:-7, completionTokens:-4`. Rust tại seam nêu trên trả 0 cho hai trường đó; chưa chạy request Rust thật.
- **Ảnh hưởng:** khi upstream gửi usage hỏng, A4 có tổng token âm; không ảnh hưởng validator hay ghi dữ liệu desktop qua Rust.
- **Đề xuất:** chỉ nhận integer không âm, có xử lý rõ cho giá trị ngoài miền số an toàn của JavaScript; fallback / từ chối thống nhất với hợp đồng Rust. Thêm các ca usage âm, fractional, sai kiểu. Khoảng 10–30 dòng.

### CX-E5 — E2E xanh khi lớp render output model bị đổi sang HTML

- **Mức:** Low (khoảng trống test; code tại SHA ghim đang render an toàn).
- **Trục:** T; liên quan S.
- **Vị trí (0df3606):** `e2e/customer-ai-web.spec.ts:40–52,67–103`; `e2e/customer-ai.spec.ts:31–50,86–102`; phạm vi coverage `vitest.config.ts:19–23,58–67`. Điểm mutation: `apps/desktop/src/routes/customers/KycIntelligence.tsx:120`.
- **Tình trạng:** CONFIRMED bằng mutation ngoài repo.
- **Mô tả:** các output trong e2e đều là chữ thường; test kiểm nội dung không chứng minh model output vẫn được render như text. Lớp JSX này cũng không nằm trong các glob coverage thuần view/form.
- **Tái hiện / bằng chứng:**
  1. Baseline: 18/18 AI e2e xanh.
  2. Vite plugin trong `mutations.mjs` thay duy nhất `{item.text}` bằng `<span dangerouslySetInnerHTML={{ __html: item.text }} />` ở bản build ngoài repo. **18/18 vẫn xanh**.
  3. Probe dán discovery JSON hợp lệ với text `<b data-review="model-html">KH có thể ưu tiên gia đình</b>`; bản mutant lưu CURRENT và có **1 phần tử b[data-review="model-html"]**. DOM được lưu ở `html-mutation-dom.txt`.
  4. Bản gốc với cùng câu trả lời có **0 phần tử** đó và DOM chứa `&lt;b …&gt;` (xem `html-baseline-dom.txt`).
  5. Đối chứng thay text bằng “REVIEW MUTANT CONTENT”: ca analysis with the Mock đỏ tại dòng 101, cho thấy harness thật sự chạy bản biến đổi.
- **Ảnh hưởng:** hồi quy render HTML / link do model trả có thể lọt qua nhóm e2e AI này. **Không phát hiện XSS đang tồn tại tại 0df3606; không tuyên bố đã chạy toàn bộ CI trên mutant.**
- **Đề xuất:** thêm e2e dán output có HTML / URL, kiểm câu nguyên văn được hiển thị, không có node/link/event do model dựng. Dùng JSON mẫu và clipboard/window.open giả như hiện tại. Khoảng 25–60 dòng test; không đổi sản phẩm.

## 3. Mục KNOWN đã tái hiện, không tính phát hiện mới

### CX-E6 — Lần thử thứ hai lỗi chỉ được phản ánh qua trạng thái ERROR

- **Mức:** Low.
- **Trục:** C.
- **Vị trí:** `tools/eval-ai-core.mjs:180–192,314–318,509`.
- **Tình trạng:** **KNOWN · CONFIRMED** bằng probe; đúng mục eval trong common/known.md.
- **Mô tả:** recording chỉ giữ câu trả lời có về; trường attempts trong báo cáo không đếm một call bị lỗi.
- **Bằng chứng:** `probes.mjs`: lần đầu trả “bad”, lần hai ném AiError(AI_TIMEOUT); adapter được gọi 2 lần, reported attempts=1, status=ERROR.
- **Ảnh hưởng:** người đọc có thể hiểu cột số lần thử là số request, trong khi thực tế nó đếm output đã về; không làm ACCEPTED sai. Spec §3 cũng nói lỗi mạng không tính lần thử validator, nên cần phân biệt hai loại số đếm.
- **Đề xuất:** nếu xử lý mục đã biết, ghi riêng số request / “lần gọi thứ 2 lỗi”, giữ đúng luật validator; dưới 400 dòng. Không mở Issue trong review này.

### CX-E7 — formatReport không dùng được noteSpecs tùy biến mà runEval nhận

- **Mức:** Low.
- **Trục:** C.
- **Vị trí:** `tools/eval-ai-core.mjs:267,443`.
- **Tình trạng:** **KNOWN · CONFIRMED** bằng probe; đúng mục phụ thuộc EVAL_NOTES toàn cục trong common/known.md.
- **Mô tả:** runEval nhận bộ noteSpecs tiêm vào, nhưng formatter tìm note bằng id trong EVAL_NOTES mặc định.
- **Bằng chứng:** `probes.mjs` dùng X03 với id CUSTOM; runEval thành công, formatReport ném `Cannot read properties of undefined (reading 'note')`.
- **Ảnh hưởng:** đường CLI mặc định không gặp; seam mở rộng / test / bộ note riêng có thể mất bước format.
- **Đề xuất:** mang note vào result hoặc đưa cùng noteSpecs vào formatter; khoảng 10–30 dòng. Không mở Issue.

Các mục đã biết khác của eval (detail validator chưa escape HTML, prompt version ghi cứng, resolver bỏ import không đuôi có dấu chấm) đã đối chiếu code với common. Không có bằng chứng hậu quả mới nên không báo lại thành phát hiện mới. Không dùng các vấn đề output model đã ghi trong common để suy ra lỗi mới ở validator / prompt.

## 4. Bảng đếm mức × trục

Mỗi phát hiện mới chỉ đếm theo **trục chính**, để không cộng lặp. KNOWN ở dòng riêng.

| Mức | E | G | C | D | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 3 |
| Low | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| KNOWN (không tính mới) | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |

## 5. Đi qua mọi trục; “đã xét, không thấy”

| Trục | Cách xét và kết quả |
|---|---|
| E — biên | Đã xét rỗng / cổng chặn / 1 lần / 2 lần / lỗi lần hai qua unit và probe; body lớn, NFC/NFD, newline, hai eval chồng nhau bằng probe. Có CX-E1/E2/E3. Ngày eval cố định, ngày đặt tên dùng domain; không thấy lỗi mới ở ngày. Hủy / rời màn / lỗi mạng trong e2e Mock / IPC giả chạy xanh. Reload / đổi DB giữa AI có test ở tầng app theo seam; không nhận đây là một đợt review toàn bộ gói D/F. |
| G — guardrail | Đã xét fixture 20 profile / 5 note đối chiếu golden; mode 14 analysis / 6 discovery; F1/F2 bị thay ở E09 không gửi; chấm X sau V7, numeric / boolean so đúng; dùng flow runAnalysis/runExtraction thật của app với adapter giả. Có chấm sai CX-E1. R1 và giá trị chữ vẫn được ghi rõ là đọc tay; **đã xét, không thấy** script tự tuyên bố R1 đạt hay chấm giá trị chữ bằng heuristic. Không thay golden. |
| C — hợp đồng | Đã so body / URL / session header / reasoning / timeout / status code của eval với spec và seam Rust; A1=18/20, A2 mode, A3 thiếu khóa, A4 tokens/time, phần X và bảng đọc tay. Có CX-E1/E4 và hai KNOWN. **Đã xét, không thấy** lỗi mới ở fixture, danh sách package codemap, danh sách CI/pr-core hoặc bảng ngưỡng A1. |
| D — dữ liệu | Có CX-E2 trên file kết quả eval. Kiểm refuses existing file qua unit, fallback stdout khi write lỗi qua unit, các e2e CURRENT/STALE/REJECTED và trích xuất Xác nhận/Bỏ. **Đã xét, không thấy** script eval ghi DB/KYC hay fixture chứa key; eval không dùng DB sản phẩm. Migration/backup invariants toàn diện thuộc gói B/F, không suy “đã kiểm đủ” từ suite E. |
| S — an toàn | Key giả 401 được mask thành “Bad ***”; network failure bị ánh xạ, redirect:'error', URL Go/Credit cố định, env key không đưa vào messages/report ở ca thông thường; CI không chạy eval và không cấp key. Có CX-E3; khoảng trống e2e CX-E5. Bản gốc thoát HTML trong model output đã kiểm bằng DOM. **Đã xét, không thấy** leak key mới hay gọi AI thật trong tool/e2e/CI ở phạm vi này. CSP/capabilities/openURL Rust toàn diện thuộc gói C, không kiểm key thật hay browser thật. |
| P — hiệu năng | Đo toàn bộ eval Mock, format và số byte report; đo 32 MiB response và RSS ở CX-E3. **Đã xét, không thấy** nút thắt mới ở tính toán/format với corpus chuẩn (median 13,27/0,47 ms). Không lấy độ trễ Mock làm độ trễ model thật; RSS một mẫu là bằng chứng resource bound bị vượt, không phải ước lượng tải khách hàng. |
| B — code thừa/lặp | Đã đọc tools/codemap, thay đổi pr-core, dùng rg và typecheck có noUnused. asExe đã được kéo về support dùng chung; không thấy dependency mới ở delta CI/config. **Đã xét, không thấy** bloat mới đủ tác động để thành phát hiện. Những hằng prompt / resolver / EVAL_NOTES đã biết được giữ ở mục KNOWN, không báo lại phong cách. |
| T — test | 102 tools unit xanh; 25 e2e xanh. Mutation renderer HTML sống sót, mutation nội dung bị bắt: CX-E5. Unit của grade chỉ dùng từ khóa dạng chuẩn; unit overwrite chỉ xét exists trước run; unit response dài chỉ xét mã lỗi, tương ứng E1/E2/E3. **Đã xét, không thấy** giả xanh mới ở codemap/dependency boundaries: 10 cạnh giả đúng và codemap check xanh. Không suy coverage 100% là đủ semantics. |
| A — trợ năng/i18n | Tools CLI/report dùng tiếng Việt; không có UI sản phẩm mới do script tạo. E2E chọn role / nhãn, kiểm status/alert/aria-current; 6 e2e bàn phím dùng support đã chạy xanh. **Đã xét, không thấy** lỗi trợ năng/i18n mới do thay đổi gói E; điều này không thay audit a11y các panel ở gói D. |

## 6. Phạm vi đã đọc (file, dòng)

Dòng theo 0df3606; các mục “delta” chỉ đọc diff của Phase 5 và đoạn nối cần thiết.

| File | Dòng / phạm vi |
|---|---|
| tools/eval-ai.mjs | 1–52 |
| tools/eval-ai-core.mjs | 1–584, toàn bộ |
| tools/eval-ai-core.test.mjs | 1–645, toàn bộ |
| tools/fixtures/ai-eval.mjs | 1–314, toàn bộ |
| tools/codemap.mjs | 1–95 |
| tools/codemap-core.mjs | 1–199 |
| tools/codemap-core.test.mjs | 1–197 |
| tools/pr-core.mjs | 1–45 và delta CODEMAP_DOCS |
| tools/pr-core.test.mjs | import / 31–90 và delta kiểm codemap, CI paths; suite toàn file đã chạy |
| e2e/support.ts | 1–173 |
| e2e/customer-ai.spec.ts | 1–386 |
| e2e/customer-ai-web.spec.ts | 1–214 |
| e2e/settings-ai.spec.ts | 1–233 |
| e2e/appointments.spec.ts | 816–901 (AI), delta bộ chọn heading ở các đoạn trước |
| e2e/appointment-outcome.spec.ts | delta heading và dòng timeline KYC |
| e2e/customer-kyc.spec.ts | delta “thay đổi quan trọng” và timeline AI trích xuất |
| e2e/dialog-keyboard.spec.ts | delta tách asExe; tên/đường kiểm bàn phím 26–188; cả 6 ca đã chạy |
| e2e/serve.mjs, e2e/anchor.ts | 1–43, 1–8 |
| playwright.config.ts | 1–47 |
| .github/workflows/ci.yml | 1–140 và diff Phase 5 |
| .dependency-cruiser.cjs | 1–72 và diff Phase 5 |
| vitest.config.ts | 1–70 và diff Phase 5 |
| package.json, tsconfig.base.json, e2e/tsconfig.json, apps/desktop/vite.config.ts | toàn file cấu hình để chọn seam chạy, compiler flag và build |
| packages/ai/CLAUDE.md | toàn file, ranh giới và codemap |
| apps/desktop/CLAUDE.md | phần vai trò/ranh giới/file hay tìm; không review codemap toàn app thủ công |
| packages/ai/src/validator.ts | 1–100, 105–160, 171–233 |
| packages/ai/src/run.ts | 1–180 (runner / lỗi / dựng request) |
| packages/ai/src/web.ts | 61–125 (kiểm/lưu pasted answer) |
| packages/ai/src/schema.ts | 1–90 |
| packages/domain/src/kyc-fact.ts | 1–69 (đặc biệt normalizeKycValue) |
| packages/domain/src/golden/kyc.fixture.ts | 1–65, nguồn E01–E10 và ngày xác nhận |
| apps/desktop/src/data/ai-analysis.ts | phần WebTools/createAppAi, startChatGptWeb/saveChatGptAnswer (75–145,262–306); đoạn còn lại đọc theo seam nối e2e |
| apps/desktop/src/data/ai-analysis.test.ts | tìm các seam đổi DB / settings whitelist (239,593–608); không review toàn file |
| apps/desktop/src/routes/customers/KycIntelligence.tsx | 1–185, Item 114–139 là điểm mutation |
| apps/desktop/src-tauri/src/ai.rs | 202–231 (reply / token), tìm vị trí max body / timeout / token test; không chạy Credential Manager |
| .claude/rules/tests.md, .claude/rules/ci.md | toàn file; chỉ quy tắc trong repo, không đọc báo cáo review |

Nguồn đúng đọc trước: `CLAUDE.md`, `CONTEXT.md`, `docs/design/phase-5-ai.md`, `docs/design/phase-5-prompts.md`, `docs/golden/ai-eval.md`, `docs/decisions/0009-ai-copilot-provider-va-guardrail.md` (gồm D-1/G5/W-1); `common/plan.md` §1–5, `baseline.md`, `known.md`. Không đọc báo cáo review hiện thời hoặc lịch sử của bên khác.

## 7. Phụ lục nguồn probe và kết quả

Thư mục nguồn: `C:\workspace\deep-review-5\codex\E\`. Các file nguồn dưới đây giữ nguyên thao tác fake fetch / Mock / Vite transform; không cần key hay mạng ngoài để tái hiện.

| Nguồn | Làm gì | Bằng chứng |
|---|---|---|
| [probes.mjs](E/probes.mjs) | Loader TS từ repo; hai evalMain chồng nhau; Response stream 32 MiB; mask key giả; V7/grade; lỗi lần 2; custom note | [probe-results.json](E/probe-results.json), [overwrite-reproduction.md](E/overwrite-reproduction.md) |
| [extra-probes.mjs](E/extra-probes.mjs) | Toàn flow V1/V7/grade; benchmark 10 mẫu sau warm-up; validator dependency-cruiser với 10 cạnh; token âm | [extra-results.json](E/extra-results.json) |
| [grading-edge.mjs](E/grading-edge.mjs) | X01 quote NFD/newline và X02 nghề của chồng chứa newline | [grading-edge-results.json](E/grading-edge-results.json) |
| [mutations.mjs](E/mutations.mjs) | Build source gốc hoặc transform Item ngoài repo; chạy nguyên 18 AI e2e; đối chứng 1 ca; probe HTML | [e2e-baseline.log](E/e2e-baseline.log), [e2e-unsafe-output.log](E/e2e-unsafe-output.log), [e2e-positive-control.log](E/e2e-positive-control.log); mutation-*.json; html-mutation-dom.txt |
| [baseline-html.mjs](E/baseline-html.mjs) | Probe cùng HTML trên build gốc; 7 e2e support/appointment/keyboard | [support-e2e.log](E/support-e2e.log), [html-baseline-dom.txt](E/html-baseline-dom.txt), html-baseline.json |
| playwright-*.config.mjs | Config tạm, testDir chỉ trỏ e2e trong repo; Edge, không retry; output riêng ngoài repo | test-results-positive-control gồm screenshot / trace của mutation đã bị bắt |

Lệnh chính:

```powershell
node C:\workspace\deep-review-5\codex\E\probes.mjs
node C:\workspace\deep-review-5\codex\E\grading-edge.mjs
node C:\workspace\deep-review-5\codex\E\extra-probes.mjs
node C:\workspace\deep-review-5\codex\E\mutations.mjs baseline
node C:\workspace\deep-review-5\codex\E\mutations.mjs unsafe-output
node C:\workspace\deep-review-5\codex\E\mutations.mjs positive-control
node C:\workspace\deep-review-5\codex\E\baseline-html.mjs
```

`probes.mjs` chủ động từ chối khi file overwrite-reproduction.md đã tồn tại: để chạy lại giữ bằng chứng cũ, đổi racePath sang tên khác trong thư mục Codex. Các harness xuất log theo mode nên cần dùng thư mục / tên output mới nếu muốn giữ nhiều lượt. Baseline HTML probe có literalMarkup=0 vì locator exact bao gồm các span bằng chứng; kết luận escaping dựa trên injectedElementCount=0 và DOM có &lt;b…, không dựa vào trường literalMarkup đó.

Lần khởi động harness đầu gặp lỗi import named export từ entry CommonJS của Playwright; đã chỉnh sang default import trước khi chạy baseline 18/18. Đây là lỗi probe, không tính lỗi sản phẩm. JSON e2e-baseline.json được lượt 7 test support dùng lại config ghi sau; bằng chứng baseline 18 test nằm ở e2e-baseline.log và mutation-baseline.json. Không dùng file JSON đã ghi sau để suy số đếm baseline.

Các build tạm dùng để chạy probe đã dọn sau khi server kết thúc; giữ script / log / DOM / trace làm nguồn tái hiện. Không có patch nào cần restore trong repo.
