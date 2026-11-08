XONG — codex gói F lượt 6, 2026-11-07 19:57:17 +07:00

## 1. Thông tin phiên

- Bên: **Codex**, gói **F — Xuyên gói, bloat / hiệu năng, công cụ**, lượt 6.
- Repo: `C:\workspace\Project-2C-review-2`.
- SHA đầu phiên: `5b1328ae236aa62981dbf43066ff544a9e832c8c`, đúng SHA ghim.
- `git status --short` đầu phiên: **rỗng**.
- Bắt đầu: **2026-11-07 19:24:59 +07:00**, Asia/Bangkok.
- Công cụ: Codex desktop, `codex-cli 0.162.1`, PowerShell, Node **v24.20.0**, CLI Vitest / TypeScript / dependency-cruiser / Vite / Playwright đã có trong repo; Edge headless.
- Model: **GPT-6** theo system của phiên. Công cụ không cung cấp tên biến thể và mức suy luận; không tự nhận GPT Sol 6.1 từ lời mô tả vai trò.
- Lệnh đầu tiên của phiên chỉ đọc `C:\workspace\deep-review-1-6-r6\common\prompt-codex.md`, không gộp lệnh khác. A–E của chính Codex đã XONG, F chưa có khi kiểm đầu. Không có bảng R dành cho Codex.

## 3. Phạm vi đã đọc

**99/99 file trong `common/files-F.txt`: 38 product, 61 test; không bỏ thân logic của file nào.** Danh sách từng file và trạng thái nằm ở [F/scope-progress.md](<C:/workspace/deep-review-1-6-r6/codex/F/scope-progress.md>).

Đọc diff `37a80b6..5b1328a` trước phần nguồn còn lại. Diff F ngoài Markdown gồm 14 file: 4 file sản phẩm **+176/−28**, 10 file test **+665/−24**:

- `.dependency-cruiser.cjs`, `.github/ISSUE_TEMPLATE/task.yml`, `tools/auto-wait-core.mjs`, `tools/auto-wait.mjs`.
- `tools/{auto-wait-core,notes-core,review-hint-core}.test.mjs`.
- `e2e/{appointments,customer-ai-web,customer-policies,dialog-keyboard,long-names,trash}.spec.ts`, `e2e/perf/probe.perf.ts`.

Đọc thêm các thay đổi Markdown liên quan: `.claude/skills/auto-issues/SKILL.md`, `.claude/skills/review-pr/SKILL.md`, `.github/pull_request_template.md`; đây là **đối tượng review**, không phải yêu cầu chạy pipeline. Đọc `CLAUDE.md` gốc và của desktop/ui, `CONTEXT.md`, spec Phase 6 §4–5, `docs/metrics/phase-6.md`, `e2e/perf/README.md`, cấu hình và bản đồ export; đối chiếu `common/{known,fixes,baseline,plan}.md`, tổng hợp lượt 1–5 và các báo cáo F cũ trong repo để tránh báo lại. Các phần công cụ được đối chiếu riêng với T-369, T-371/372/373, T-375, T-378/379/383 và T-386.

Đã đọc toàn bộ 13 file unit của tools, 3 cấu hình Playwright, cấu hình Vitest, e2e support/fixtures, luồng đầy đủ, bộ đo và bộ chụp hướng dẫn. Với **33 file e2e còn lại**, dùng bản xem do TypeScript AST printer tạo: bỏ comment, rút tên API lặp theo chú giải, giữ literal/regex, trình tự thao tác và assertion; đọc đủ `read-e2e-01.txt` đến `23.txt`. Không đọc lại từng comment của 33 file này; khi cần bối cảnh hoặc dòng nguồn thì đọc bản gốc. Bản xem chỉ phục vụ đọc, không được thực thi. Danh sách chính xác ở [read-e2e-index.json](<C:/workspace/deep-review-1-6-r6/codex/F/read-e2e-index.json>). Các file `read-e2e-24..26.txt` còn sót từ lần tạo bản xem ban đầu không thuộc index cuối và không dùng làm bằng chứng.

Phần xuyên gói dùng AppData thật (`openAppData`, `tables`, `app.run`, export/read/import) và bản build web để kiểm hồ sơ, lịch, HĐ, báo cáo, Thùng rác, lưu và AI về muộn. Không dùng SQL thô để kết luận màn. Đọc báo cáo A–E lượt 6 của chính Codex để đưa ra kết luận phát hành; không tạo lại các ID của chúng.

**Giới hạn thực thi:** không chạy lại cả cổng 329 e2e, Rust hay exe; không chụp lại toàn bộ hướng dẫn vì sẽ ghi vào repo. Số cổng đầy đủ và số đo exe dùng baseline chung đúng SHA. Không chạy `pnpm`, công cụ gh thật, eval AI thật, chatgpt.com; không cài công cụ mới. Chỉ ghi dưới thư mục kết quả Codex được phép. Không đọc/liệt kê/tìm thư mục báo cáo ngoài repo của các bên khác.

## 4. Kịch bản đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| F-01 | Tạo hai team/RE; KH N3; ghi cuộc gặp N2/RF; lịch đã qua và lịch tương lai; HĐ nộp 500 triệu/phát hành 485,5 triệu; bàn giao RE | Lịch tương lai sang RE B, lịch đã qua và HĐ giữ RE A; số tổng/theo RE khớp | — |
| F-02 | Xóa riêng HĐ/lịch rồi xóa KH → xuất/nhập → khôi phục KH → khôi phục riêng con → xuất/nhập lần nữa | Phụ thuộc đúng; bản ghi xóa riêng còn ở Thùng rác; toàn bộ `reportRows`/`teamCompare` trở lại đúng trước xóa | — |
| F-03 | Dọn lịch đã xóa; backup lỗi rồi thử lại; flush rồi mở lại bytes đã lưu | Lần lỗi không đổi dữ liệu/trash/generation, không giữ khóa; lần sau dọn được; mở lại giữ nguyên báo cáo | — |
| F-04 | AI extraction giả đang chờ → nhập backup cùng ID → trả kết quả cũ | `discarded`, không lưu vào dữ liệu vừa nhập | — |
| F-05 | Nhập fixture trên UI → hồ sơ/người phụ trách/lịch sử/HĐ → Báo cáo Theo RE → xuất/nhập UI | Tổng hợp giữ nguyên; `blocked=[]`, `errors=[]`; ảnh `crossflow-reports.png` | — |
| F-06 | Unit tools, trực tiếp CLI Vitest | **13 file / 405 test qua**, 9,71 s | — |
| F-07 | Bản chép 7 spec e2e: appointments, customer-ai-web, customer-policies, dialog-keyboard, long-names, trash, full-cycle | **87/87 qua**, 3,7 phút, 2 worker, không retry; cổng riêng 4198 | — |
| F-08 | TypeScript `--noUnusedLocals --noUnusedParameters` cho domain/db/ai/ui/desktop/e2e; dependency-cruiser; codemap | 6 cấu hình qua; **354 module / 1.582 cạnh, 0 vi phạm**; bản đồ cập nhật | — |
| F-09 | Build web ở thư mục F, không đặt `VITE_DEMO_ANCHOR`; size-report trên build riêng | Qua; mọi byte/gzip của JS/CSS khớp baseline | — |
| F-10 | CLI notes-for bản chép, chỉ seam git được chạy; `--files .claude/skills/review-pr/SKILL.md` | Hai mục [sau v1.0], vẫn nhắc gộp vào task | **CXR6-F1** |
| F-11 | Quét AST toàn nguồn TS/TSX/JS sản phẩm/công cụ, export và thân hàm; đối chiếu 35 dòng perf bằng stats thật | Không có bloat mới có chi phí đã chứng minh; 0 dòng vượt ngưỡng / worse so ba mốc | — |

Các probe trình duyệt chặn request ngoài **127.0.0.1**, thay `window.open` từ init đầu. F-05 dùng Edge headless, `vi-VN`, Asia/Bangkok, clock 07/11/2026; F-07 giữ fixture/clock gốc của test. Máy có thể có tác vụ khác khi chạy các kiểm thử chức năng; **không dùng thời gian của F-01…F-10 làm số đo P**. Số P dưới đây được bước chuẩn bị đo khi máy rảnh.

## 5. Phát hiện mới

### CXR6-F1 — Lời nhắc notes-for chưa có ngoại lệ [sau v1.0] của K49

**ID:** CXR6-F1  
**Mức:** Nit  
**Trục:** C  
**Vị trí:** `tools/notes-for.mjs:38`, `:50`, `:76` (`5b1328a`).  
**Tình trạng:** CONFIRMED.  
**Liên quan:** T-386 / PR #1127, K48/K49; **lệch mới sau lượt 5 khi luật đóng băng đổi nhưng CLI giữ câu cũ**.

**Mô tả:** Hằng `PLAN` cuối `notes-for <issue>` và `--files` bảo gộp các mục Trùng file còn vừa phạm vi/cỡ, kể cả mục có nhãn [sau v1.0]. `CLAUDE.md:40` mới yêu cầu để lại các mục ấy tới phát hành, ngay khi trùng file; review-pr còn chặn PR đã gộp chúng.

**Tái hiện / bằng chứng:** chép CLI sang `F/notes-safe.mjs`, chỉ đổi đường import tới core thật và thay I/O bằng `notes-safe-io.mjs`: cho phép git, mọi yêu cầu gh đều ném lỗi. Chạy từ repo:

~~~powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
node C:\workspace\deep-review-1-6-r6\codex\F\notes-safe.mjs --files .claude/skills/review-pr/SKILL.md
~~~

Trích `F/notes-k49.log`:

~~~text
Trùng file (2):
- L16 ... **[sau v1.0]** ...
- L18 ... **[sau v1.0]** ...

Gộp vào task những mục "Trùng file" còn vừa phạm vi và cỡ (tính vào ước lượng); trước khi mở PR chạy lại với --diff.
~~~

Mode Issue dùng cùng hằng tại dòng 50, được xác nhận bằng nguồn; chỉ mode `--files` được chạy trong probe này. Không có gh thật hoặc task sản phẩm nào bị sửa.

**Cùng mẫu:** quét từ gốc repo:

~~~powershell
rg --hidden -n --max-columns 260 --glob '!.git/**' --glob '!node_modules/**' --glob '!**/node_modules/**' --glob '!**/dist/**' --glob '!**/target/**' 'Gộp vào task những mục|còn vừa phạm vi và cỡ' .
~~~

Hai kết quả: `tools/notes-for.mjs:38` thiếu ngoại lệ; `CLAUDE.md:40` đã có ngoại lệ [sau v1.0]/K49 ngay sau câu gộp. Hai nơi dùng `PLAN` ở `:50`/`:76` cùng lỗi, tính một ID. Quét bổ sung `Gộp vào task|còn vừa phạm vi|trước khi mở PR chạy lại|sau v1.0|K49` trong CLI, mẫu Issue/PR, review-pr và CLAUDE: `ANSWER`/`CHECK` không ra lệnh gộp; mẫu PR/CLAUDE/review-pr nêu luật đúng. Không tìm thêm lời nhắc hiện hành cùng lỗi.

**Ảnh hưởng:** phiên soạn/làm task nhận hướng dẫn chữ trái K49, phải tự đối chiếu luật cấp cao, có thể tốn vòng review. Chưa chứng minh pipeline thực sự làm sai hoặc vượt cổng; không có hậu quả dữ liệu app.

**Chặn phát hành:** **không — Nit/C theo K48, sau v1.0**.

**Đề xuất:** thêm ngoại lệ [sau v1.0]/K49 vào hằng `PLAN` chung cho hai mode; test output với sổ chứa mục cùng file mang nhãn ấy. Cỡ **2–4 dòng công cụ / 8–15 dòng test**. Không tự sửa trước phát hành (K49).

## 6. Bloat và Hiệu năng

### Bloat

Quét bằng công cụ đã có, không cài knip/jscpd/visualizer/cargo-bloat. [audit.mjs](<C:/workspace/deep-review-1-6-r6/codex/F/audit.mjs>), [bloat-audit.json](<C:/workspace/deep-review-1-6-r6/codex/F/bloat-audit.json>), [size.json](<C:/workspace/deep-review-1-6-r6/codex/F/size.json>) là nguồn số tự chạy.

| Kiểm tra toàn codebase | Kết quả / giới hạn |
|---|---|
| noUnusedLocals / noUnusedParameters | 6 cấu hình domain/db/ai/ui/desktop/e2e qua |
| Biên dependency | 354 module, 1.582 cạnh, 0 vi phạm; quy tắc hỗ trợ test hiện hành vẫn tách khỏi sản phẩm |
| Export bằng AST | 217 file nguồn, 1.138 export, 820 export giá trị; 8 tên không xuất hiện ở file khác được kiểm lại bên dưới |
| Thân hàm trùng sau chuẩn hóa văn bản, ≥120 ký tự, ≥3 nơi | **0 nhóm**. Chỉ là quét trùng văn bản, không chứng nhận không có clone ngữ nghĩa hoặc cặp lặp hai nơi |
| Codemap | Export maps are up to date |
| Số dòng toàn repo theo size-report | **39.586 SP / 57.352 test / 4.969 sinh**, 431 file; không file chưa xếp gói |
| Gói F | **5.034 SP / 19.068 test / 4.628 sinh**, 100 file (99 không sinh); Δ lượt 5: +148 SP / +641 test |

Tám export cần kiểm thủ công đều còn dùng: `AI_MODES` (`packages/ai/src/schema.ts:29,88`) cho schema/type; `AI_OPENCODE_PLANS` (`packages/ai/src/settings.ts:17,80`) cho cấu hình; `AI_ANALYSIS_MODES` (`packages/db/src/schema.ts:330,357`) cho schema DB; `writeHandoff` (`tools/handoff.mjs:97,143`) là đường CLI; `BODY_TARGET`/`BODY_MAX` (`tools/session-core.mjs:6–7,25–32`) cho giới hạn HANDOFF; `DEFAULT_DIST`/`DEFAULT_EXE` (`tools/size-report-core.mjs:7–8,198`) cho mặc định CLI. Đây là export không có nơi dùng ngoài file, **không phải giá trị chết**. Không dựng phát hiện B chỉ để bỏ từ khóa export mà chưa có chi phí.

| Thành phần | SHA ghim, byte | Gzip, byte | Δ lượt 5, thô / gzip |
|---|---:|---:|---:|
| chart.js | 513.302 | 172.450 | 0 / 0 |
| exceljs.min.js | 929.569 | 255.572 | 0 / 0 |
| index.js | 894.865 | 265.040 | +2.681 / +749 |
| index.css | 30.387 | 6.835 | +92 / +14 |
| rolldown-runtime.js | 1.106 | 627 | 0 / 0 |
| **Tổng JS/CSS** | **2.369.229** | **700.524** | **+2.773 / +763** |
| Khác (19 file) | 1.022.121 | — | 0 |
| Exe chung (không tự build lại) | 5.649.408 | — | 0 |

JS/CSS +0,12%, index.js +0,30% so lượt 5, không dependency mới; build riêng khớp byte/gzip của baseline ở SHA ghim. Tăng lượng nhỏ phù hợp các guard/câu chữ/khả năng truy cập của đợt sửa, không chứng minh code dư. Cảnh báo Vite chunk >600 kB vẫn hiện với các chunk lớn hiện hữu; chỉ riêng cảnh báo không phải lỗi P/B mới. Không đề xuất refactor hay thêm công cụ trong kỳ đóng băng K49.

### Hiệu năng

**Nguồn phép đo:** `common/baseline.md`, `common/perf/perf-ref.json` của bước chuẩn bị **07/11/2026 11:50:54–11:56:20**, máy **DESKTOP-KDURKJP**, Node **v24.20.0**, exe release SHA ghim, máy rảnh/cửa sổ ở trên cùng. F **không tự đo lại exe**; F tự đọc/parse/đối chiếu JSON bằng `parseRun`/`compareRuns` thật của `e2e/perf/stats.ts`, ghi [perf-comparison.json](<C:/workspace/deep-review-1-6-r6/codex/F/perf-comparison.json>). Không biến thời gian unit/e2e đang chạy song song thành đo hiệu năng.

Dữ liệu tải `common/load/load-2026-10-12-seed6.p2cbackup`: 1.496 KH / 10.414 lịch / 1.697 HĐ, 16.034.517 byte, sha256 `F952E0625879A271726610D3388E42C6C366EF5933CFA062768727F139EC13A0`; hash tables `e256e4f18699f4a4e494b59a92ef46865eb4d2c9887f4ff1e7a6b872b4b345a2`, bằng G7/lượt 5. Kỳ đo năm 2026 và tháng 10/2026, cùng dữ liệu/cỡ cửa sổ/số lần. Debugger được ngắt ở các thao tác ghi/Thùng rác theo README.

Các số sau là **trung vị ms**, trừ heap MB. Ngưỡng màn là **<200**, reload **<500**; các ngưỡng khác dùng **≤**. Luật worse: tăng **quá 20% và quá 10 ms**, heap tăng quá 5 MB. **35/35 đạt ngưỡng; 0 worse so sau #656, G7 và lượt 5**. Kỳ Năm tạo hẹn tiếp 107,2 − 108,7 = −1,5 ms, đạt chênh ≤50 ms.

| Thao tác | Lần | Sau #656 | G7 | Lượt 5 | SHA ghim | Ngưỡng |
|---|---:|---:|---:|---:|---:|---:|
| app.open-data | 1 | 387 | 320.4 | 329.7 | 364.3 | 600 ms |
| backup.read | 5 | 835.2 | 975.2 | 982.7 | 979 | 2000 ms |
| backup.import | 5 | 42.7 | 44.4 | 49.6 | 43.7 | 500 ms |
| db.save | 15 | 151 | 147.7 | 150.3 | 146.5 | 400 ms |
| reload.overview | 5 | 398.2 | 395.3 | 406.8 | 406.2 | 500 ms |
| reload.appointments | 5 | 390.6 | 385.2 | 391.1 | 382.5 | 500 ms |
| reload.customers | 5 | 336.3 | 308.1 | 316.1 | 310.7 | 500 ms |
| reload.reports | 5 | 376.4 | 366.6 | 371.2 | 368.5 | 500 ms |
| reload.team | 5 | 354.6 | 350.3 | 361.8 | 351 | 500 ms |
| reload.settings | 5 | 283.4 | 280.4 | 285 | 281.1 | 500 ms |
| appointments.period-day | 5 | 8.2 | 5.9 | 5.5 | 4.4 | 200 ms |
| appointments.period-week | 5 | 11.6 | 10.9 | 11.4 | 19 | 200 ms |
| appointments.period-month | 5 | 13.2 | 4.6 | 4.8 | 4.9 | 200 ms |
| appointments.period-year | 5 | 16.8 | 10.1 | 10.1 | 10 | 200 ms |
| appointments.sort-date-asc | 5 | 17.2 | 17.5 | 17.1 | 22.5 | 200 ms |
| appointments.sort-date-desc | 5 | 11.4 | 11.5 | 11.6 | 11.7 | 200 ms |
| appointments.select-row-year | 5 | 5.9 | 6.2 | 5.9 | 6.3 | 200 ms |
| appointments.select-day-month | 5 | 9.3 | 6.9 | 6.7 | 6.9 | 200 ms |
| appointments.select-row-month | 5 | 7.2 | 4.7 | 4.8 | 4.7 | 200 ms |
| customers.view-table | 5 | 19.5 | 19.5 | 18.6 | 19.5 | 200 ms |
| customers.sort-name | 5 | 22.7 | 22.5 | 23.5 | 24.1 | 200 ms |
| customer.open-ai | 5 | 19.2 | 20.2 | 20.3 | 20.5 | 200 ms |
| customer.ai-history | 5 | 2 | 1.9 | 2.4 | 9.6 | 200 ms |
| overview.filter-year | 5 | 15.5 | 16.7 | 16.4 | 16.3 | 200 ms |
| overview.filter-month | 5 | 14.2 | 14 | 14.3 | 14.5 | 200 ms |
| reports.filter-year | 5 | 10 | 10 | 9.7 | 10.1 | 200 ms |
| reports.filter-month | 5 | 9.8 | 10.1 | 9.8 | 10.1 | 200 ms |
| reports.table-re | 5 | 17.3 | 17.4 | 17.2 | 17.3 | 200 ms |
| trash.kind-appointments | 5 | 5.9 | 8.6 | 8.4 | 6.3 | 200 ms |
| memory.js-heap | 1 | 16.5 | 16.7 | 16.7 | 16.8 | 21 MB |
| trash.open | 5 | 34.1 | 32.7 | 32.7 | 33.2 | 200 ms |
| reports.export-excel | 5 | 19.6 | 24.5 | 21.3 | 27 | 500 ms |
| backup.export | 5 | 438.3 | 434.9 | 438.2 | 426.8 | 1000 ms |
| appointments.next-month | 5 | 100.7 | 112.1 | 110.7 | 108.7 | 300 ms |
| appointments.next-year | 5 | 107.3 | 108.9 | 107.5 | 107.2 | 300 ms |

Các mốc bổ sung ngoài 35 dòng, cùng nguồn baseline:

| Thao tác | Sau #656 | G7 | Lượt 5 | SHA ghim | Đánh giá |
|---|---:|---:|---:|---:|---|
| Mở lần đầu, gọi exe → LCP | 3.663 | 3.420 | 3.535 | **3.612 ms** | Trong luật nhiễu; dưới mốc Phase 4 +20% (4.724 ms) |
| Mở lại trên dữ liệu tải, gọi exe → LCP | — | 617 | 710 | **688 ms** | ≤1 s; +12% so G7, không worse |
| Dọn sạch trên exe, bấm → thông báo 11j | — | 130,5 | 128,0 | **120,5 ms** | ≤500 ms |
| Mở Thùng rác sau dọn | — | — | 2,0 | **1,9 ms** | <200 ms |
| Node listTrash, 113 / 1.313 bản ghi | — | — | 24,6 / 134,6 | **24,1 / 135,7 ms** | Không tăng quá nhiễu |
| Node purgeTrash gồm VACUUM, 113 / 1.313 | — | — | 88,5 / 117,5 | **86,2 / 117,6 ms** | Không tăng quá nhiễu; ngưỡng phát hành áp phép đo exe |

File sau dọn 113 bản ghi: 14.102.528 → 13.438.976 byte; ca 1.313: 14.151.680 → 1.495.040 byte. Đây là số chuẩn bị, không phải phép đo mới của F.

**Mốc phụ đã biết:** lần lưu DB đầu lúc sinh demo là 151 ms, so sau #656 119/G7 123/lượt 5 150 ms; vẫn vượt luật nhiễu so hai mốc cũ, bằng lượt 5. Tổng hợp lượt 5 §7.1 đã đo xen kẽ và xác định nhiễu, không phải code chậm thêm. Mốc phát hành lần đầu là LCP; không báo lại thành phát hiện P. Chi phí Mock extraction DR6-165 đã được Owner chấp nhận làm mốc mới (K50 Q2(a), hồ sơ T-375), không chạy AI thật hoặc tự tối ưu trong F.

**Kết luận P/B:** chưa có bằng chứng mới về thao tác vượt ngưỡng, hồi quy ngoài nhiễu, hay code dư có chi phí; không có phát hiện P/B mới. Phép quét tĩnh và số baseline có giới hạn đã nêu, không phải chứng minh toàn bộ đường thực thi đều tối ưu.

## 7. Bảng đếm mức × trục

Chỉ đếm phát hiện mới của **gói F**, không gộp lại A–E.

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Nit | 0 | **1** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **1** |
| Tổng | 0 | **1** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **1** |

**CONFIRMED 1, PLAUSIBLE 0; chặn 0 / không chặn 1.** Không có tỉ lệ PLAUSIBLE cao. Kết luận phát hành bên dưới tính phát hiện chặn trong báo cáo A của chính Codex, không đổi số đếm F.

## 8. Đã xét, không thấy

| Trục | Đã đọc / chạy và kết quả ngoài F1 |
|---|---|
| E | Mọi nhánh lõi tools, unit lỗi đọc xen thành công, CI run/check đến lệch, nhánh chưa tồn tại/stale, title không lẫn PR dài hơn; 405 unit qua. Chuỗi backup lỗi → mở khóa → thử lại, import cùng ID và AI về muộn, 87 e2e: chưa xác nhận edge case F mới |
| C | Đối chiếu T-369/373/378/379/383, auto-issues, mẫu Issue/PR, spec S-2/TR, probe metRows đọc cột Trạng thái. Chỉ F1; hành vi cancelled/startup_failure khi không --since là luật đã được T-383 chốt, không báo lại |
| D | F-01…F-05 so người phụ trách lịch/HĐ, RF/doanh số/nhóm, xóa riêng/cha, khôi phục, hai vòng xuất/nhập và mở bytes đã lưu. Chưa có lỗi D mới trong F; **CXR6-A1 vẫn là phát hiện D đã có ở A**, không bị các ca clock tăng bình thường của F phủ định |
| G | Đọc eval-ai-core/fixtures và support giả; AI AppData về muộn bị discarded sau nhập cùng ID; customer-ai-web và full-cycle qua, HTML/link model không trở thành markup. Không gọi provider thật; không phát hiện G mới |
| S | Đọc session-io, đường spawn/CLI, bootstrap, hook, pre-push, CI và boundary dependency; unit dùng mock gh, repo git tạm/bare remote local. Chặn mạng ngoài/window.open từ đầu ở mọi browser probe; chưa thấy lỗ ranh giới mới |
| P | 35 dòng perf, LCP/mở lại/dọn và số Node, so ba mốc cùng máy theo luật nhiễu; không vượt ngưỡng hay worse mới, xem §6 |
| B | 6 noUnused, AST 217 file, 8 export được giải thích, clone văn bản, dependency/codemap, bundle/exe/số dòng; không thấy bloat mới có chi phí, xem §6 |
| T | Đọc 61 file test, 405 unit và 87 e2e chọn lọc qua; kiểm assertion độc lập của full-cycle/báo cáo, keyboard/nút đang chạy, tên dài, metRows theo status. Không khẳng định coverage cao đồng nghĩa đủ; không phát hiện T mới. Không tạo đột biến F trong lượt này |
| A | Đọc fixture role/name, guide/link, theme/contrast, topbar, long-names, keyboard; chạy keyboard/long-names/policies/trash trong 87 e2e. Không có phát hiện A mới của F; những phần tràn khung đã ghi ở A–E không được đếm lại |

### Kết luận v1.0 tại SHA 5b1328a

**CHƯA SẴN SÀNG cho v1.0 ở `5b1328a`, theo K48.** Lý do là **CXR6-A1 (CONFIRMED, Low/D, chặn)** trong [A.md](<C:/workspace/deep-review-1-6-r6/codex/A.md>) của chính Codex: mốc xóa trùng với lần thu hồi cũ làm khôi phục nhận nhầm chuyển nhóm, đã chứng minh thêm nhóm/RF và đổi snapshot/backup ở probe AppData. Điều kiện clock đứng/quay lại đúng mili giây là hiếm nên Low; hậu quả đã vào dữ liệu nên D, K48 quy định chặn. Không nâng thành Medium/High và không báo lại bằng ID F.

Riêng **F không thêm phát hiện chặn**; Nit/C F1 để sau v1.0 theo K48/K49. Kết luận này là đề xuất review tại SHA ghim, không phải yêu cầu tạo Issue, sửa code hay merge; chờ Owner tổng hợp.

## 9. Phụ lục và kiểm cuối

Tất cả nguồn/log dưới `C:\workspace\deep-review-1-6-r6\codex\F\`, không nằm trong repo:

| Bằng chứng | Nội dung |
|---|---|
| `work-log.md` | Báo cáo đang làm được giữ nguyên trước khi biên tập bản cuối; nhận định tạm được thay bằng phần chính thức ở đây |
| `scope-progress.md`, `prepare-read.mjs`, `read-e2e-index.json`, `read-e2e-01..23.txt` | Bảng 99 file và bản xem AST đã dùng đọc, không dùng chạy test |
| `crossflow.mjs`, `crossflow.log`, `crossflow-results.json`, `crossflow.p2cbackup` | Chuỗi AppData, rollback khi backup lỗi, AI cũ discarded, bytes lưu mở lại; không SQL thô |
| `browser-crossflow.mjs`, `browser-crossflow.log`, `browser-results.json`, `crossflow-reports.png` | Probe UI tại 127.0.0.1:4197; dữ liệu/báo cáo giữ nguyên sau xuất/nhập; không request ngoài, không pageerror |
| `runner/playwright.config.mjs`, `runner/server.mjs`, `runner/e2e/`, `runner/results.json`, `e2e-selected.log` | Bản chép 7 spec + helper gốc, fixture thêm rào mạng/window.open; server riêng 127.0.0.1:4198; 87 qua. Các junction `runner/{node_modules,apps,packages}` chỉ phục vụ đọc nguồn/runtime sẵn có |
| `notes-safe.mjs`, `notes-safe-io.mjs`, `notes-k49.log` | F1; core dùng nguồn thật, IO chỉ cho git, gh bị throw |
| `unit-tools.log`, `static.log`, `deps.log`, `codemap.log`, `build.log`, `size.log`, `size.json`, `web/` | 405 unit, noUnused, dependency/codemap, build/size riêng |
| `audit.mjs`, `audit.log`, `bloat-audit.json`, `perf-comparison.json`, `perf-table.md` | Quét bloat và tính lại so sánh số chuẩn bị; không tự nhận là phép đo exe mới |

Các lệnh kiểm thực thi trực tiếp từ repo, với `C:\Program Files\nodejs` đặt đầu PATH trong từng lần gọi node:

~~~powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
node node_modules/vitest/vitest.mjs run tools
node node_modules/typescript/bin/tsc -p packages/domain/tsconfig.json --noUnusedLocals --noUnusedParameters
node node_modules/typescript/bin/tsc -p packages/db/tsconfig.json --noUnusedLocals --noUnusedParameters
node node_modules/typescript/bin/tsc -p packages/ai/tsconfig.json --noUnusedLocals --noUnusedParameters
node node_modules/typescript/bin/tsc -p packages/ui/tsconfig.json --noUnusedLocals --noUnusedParameters
node node_modules/typescript/bin/tsc -p apps/desktop/tsconfig.json --noUnusedLocals --noUnusedParameters
node node_modules/typescript/bin/tsc -p e2e/tsconfig.json --noUnusedLocals --noUnusedParameters
node node_modules/dependency-cruiser/bin/dependency-cruiser.mjs apps packages
node tools/codemap.mjs --check
node C:\workspace\deep-review-1-6-r6\codex\F\crossflow.mjs
node C:\workspace\deep-review-1-6-r6\codex\F\browser-crossflow.mjs
node C:\workspace\deep-review-1-6-r6\codex\F\audit.mjs
~~~

Build dùng Vite trực tiếp với cwd `apps/desktop`, `--outDir C:\workspace\deep-review-1-6-r6\codex\F\web`; không đặt biến Vite riêng. E2e dùng cwd `F/runner`, CLI `C:\workspace\Project-2C-review-2\node_modules\@playwright\test\cli.js test --config playwright.config.mjs`. Không chạy `e2e/serve.mjs` vì nó gọi pnpm.

**Sai lệnh/harness đã sửa, không gán cho sản phẩm:** `tsc -b` đầu tiên thiếu tsconfig gốc (`typecheck.log`); tên CLI `dependency-cruise.mjs` không tồn tại được sửa thành `dependency-cruiser.mjs`; probe ban đầu dùng năm sinh sai kiểu/thiếu nextStep; browser chọn nhầm selector hồ sơ và radio Tổng hợp; runner thiếu `type:module`. Bản xem AST đầu tiên dùng scanner rồi được thay trước khi đọc bằng AST, sau đó sửa alias tra thuộc tính kế thừa. Tất cả thay đổi chỉ trong F. Kết quả cuối của từng kiểm tra nằm ở log đã chỉ; không che lần chạy lỗi. Không thực hiện đột biến F, nên không có bảng killed/survived của F để suy diễn.

Kiểm cuối: `git rev-parse HEAD` = `5b1328ae236aa62981dbf43066ff544a9e832c8c`; `git diff --exit-code` qua; `git status --short` **rỗng**, như đầu phiên. Hai server riêng đã dừng, không còn listener của probe ở 4197/4198. `F/final-check.json` ghi 99 file / 23 bản xem / 87 e2e expected, 0 unexpected / skipped / flaky; `F/same-pattern.log` giữ kết quả quét toàn repo. Đã mở kiểm ảnh báo cáo thật, số Tổng hợp/Theo team khớp fixture.

**Giờ xong: 2026-11-07 19:57:17 +07:00** (Asia/Bangkok). Không sửa repo, không commit, không tạo Issue/PR, không tổng hợp với bên khác.


