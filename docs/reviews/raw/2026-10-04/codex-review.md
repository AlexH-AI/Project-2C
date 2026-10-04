# Review độc lập Project-2C — Phase 4 (Codex)

- Ngày: **04/10/2026, UTC+07**. Bằng chứng có giờ từ 18:56:10.658; chốt lúc 2026-10-04T19:50:01.531+07:00.
- Reviewer: **Codex, họ model GPT-6**. Công cụ phiên này không cung cấp tên biến thể hoặc effort để xác minh thêm.
- Worktree: `C:\workspace\Project-2C-review-2`, detached HEAD.
- Snapshot: **`595ef7906d1f40a14498831418d47d535998147d`**.
- Diff: **`5eb7c03..595ef79`, 38 commit**. Đã đọc code nguồn và test trong `packages/domain`, `packages/db`, `apps/desktop/src`, `apps/desktop/src-tauri/src`, `e2e/`, kể cả phần không đổi trong diff. Đã đối chiếu CLAUDE.md gốc/package, `.claude/rules`, CONTEXT, spec Phase 4, ba mockup, ADR-0005/0011/0016, golden và checklist. Giới hạn với file sinh tự động và kiểm UI ghi ở §5.
- GitHub: đã lấy và đọc body của **30 Issue** thuộc milestone: #251–259, #263, #268–277, #280, #283, #286–289, #294, #296, #307, #310. Cả 30 đang CLOSED ở lần đọc. Chỉ dùng lệnh đọc.
- Artifact: [project2c.exe](C:/workspace/phase-4-review/exe/Project-2C-595ef7906d1f40a14498831418d47d535998147d/project2c.exe), **4.166.656 byte**, từ [CI run 37198749364](https://github.com/AlexH-AI/Project-2C/actions/runs/37198749364) trên đúng SHA; run có kết luận success.
- SHA256: **`d8b16031dc9c484201389c2c469a2dcc214369a7616ebcabc31fd6111b3640a4`**.
- Chỉ review. Không sửa file tracked, commit, push hoặc ghi GitHub. Không đọc báo cáo Phase 4 của reviewer đang làm song song. Các test/probe tạm được chép ở §6 rồi xóa.

## 1. Kết luận G7

**CHƯA SẴN SÀNG** theo đánh giá của reviewer. Cần xử lý hai lỗi Medium: cửa sổ so sánh sai vào ngày cuối tháng và nút Hôm nay dùng ngày cũ khi app mở qua nửa đêm. Chúng có đầu vào thực tế, có tái hiện và ảnh hưởng phần dashboard vừa triển khai. Quyết định đóng G7 thuộc Owner.

Không có Critical hoặc High đã chứng minh. Ba lỗi Low gồm bảng Tổng của kỳ tương lai khi không còn team, xuất Excel với tên RE quá dài và đường nhập backup còn nhận case size dự kiến âm. Có thể gom các lỗi Low vào cùng các file sửa hoặc ghi quyết định xử lý riêng; báo cáo này không tự tạo task.

| Severity | NEW | KNOWN | Tổng |
|---|---:|---:|---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 2 | 0 | 2 |
| Low | 2 | 1 | 3 |
| Nit | 0 | 0 | 0 |
| **Tổng** | **4** | **1** | **5** |

Chỉ năm CX4 dưới đây được cộng vào bảng. Probe số tiền vượt miền số nguyên an toàn, các ghi chú OPEN cũ và cảnh báo build không được cộng thêm.

## 2. Bằng chứng đã chạy

Mọi giờ trong bảng là **04/10/2026 UTC+07**. Log nằm trong `C:\workspace\phase-4-review\`; `evidence.jsonl` giữ nguyên lệnh, thời điểm đầy đủ và exit code. Dùng `pnpm.cmd` khi runner gọi PowerShell lồng nhau để tránh policy của shim `pnpm.ps1`.

| Lệnh / log | Bắt đầu → kết thúc | Thời gian | Exit / kết quả |
|---|---|---:|---|
| `pnpm.cmd verify` — `verify-1.log` | 18:56:48.650 → 18:58:42.303 | 113,653 s | **0**. 64 file, **1.125/1.125 test**. Format, ESLint, token guard, codemap, typecheck và ranh giới module xanh. 212 module, 834 dependency, 0 vi phạm. |
| `pnpm.cmd verify:rust` — `verify-rust-1.log` | 18:56:51.669 → 18:58:32.135 | 100,466 s | **0**. fmt, clippy `-D warnings`, **37/37 test**. |
| Kiểm cổng 4173 trống; `$env:CI='1'; pnpm.cmd e2e` — `e2e-1.log` | 18:59:42.039 → 19:01:48.715 | 126,676 s | **0**. **137 passed / 0 flaky / 0 failed**. |
| Cùng lệnh, kiểm cổng lại trước lần 2 — `e2e-2.log` | 19:02:45.280 → 19:04:48.144 | 122,864 s | **0**. **137 passed / 0 flaky / 0 failed**. |
| `gh issue list --milestone … --state all` — `issues.log` | 18:56:51.052 → 18:56:53.555 | 2,503 s | **0**, 30 Issue. |
| `gh run list --branch main` — `runs.log` | 18:56:53.653 → 18:56:55.977 | 2,324 s | **0**, tìm đúng run/SHA thành công. |
| `gh run download 37198749364 …; Get-FileHash …` — `artifact.log` | 18:58:31.030 → 18:58:40.985 | 9,955 s | **1 của wrapper**: tải artifact xong, bước hash thất bại vì `Get-FileHash` không có trong PowerShell lồng. SHA256 được kiểm lại bằng Node bên dưới; không ghi lệnh này là exit 0. |
| `gh issue view` từng Issue, lưu JSON — `issue-views.log` | 19:13:24.278 → 19:13:44.672 | 20,394 s | **0**, đủ 30 body. |
| `vitest run …/phase4.codex.test.ts` — `codex-probes-1.log` | 19:01:50.620 → 19:01:51.899 | 1,279 s | **1**, 4 test đỏ: MTD, Tổng kỳ tương lai, số tiền cực lớn và độ dài tên file. Test số tiền cực lớn chỉ chẩn đoán; ngưỡng 245 của probe tên file là ngân sách dự phòng, không phải giới hạn đã ghi trong spec. CX4-004 dựa thêm vào lỗi Windows thật. |
| `vitest run packages/db/src/phase4.codex.test.ts` — `codex-db-probes-3.log` | 19:12:55.408 → 19:12:56.635 | 1,227 s | **0**, 2 test xác nhận case size âm vẫn nhập được và tên RE 260 ký tự được lệnh nhận. |
| `rustc --edition 2021 --crate-name storage_codex --test …` + chạy harness — `codex-rust-probes-3.log` | 19:13:51.067 → 19:13:52.300 | 1,233 s | **0**, **40/40** = 37 test storage có sẵn + 3 probe. Tên dài lỗi OS 123; 8 lần xuất đồng thời giữ đủ file; đường dẫn 318 ký tự với thành phần ngắn ghi được. |
| `node .review-scratch/midnight.mjs` — `codex-midnight-2.log` | 19:17:09.352 → 19:17:13.795 | 4,443 s | **0**, quan sát Hôm nay vẫn tháng 10 sau khi đồng hồ sang 01/11; chuyển màn mới sang tháng 11. Web download và lazy ExcelJS được xác nhận. |
| `vitest run …/integration.codex.test.ts` — `codex-integration.log` | 19:18:49.701 → 19:18:55.779 | 6,078 s | **0**, 2 test seed, đối chiếu dữ liệu, đọc lại Excel và đo hiệu năng. |
| `vitest run …/edge.codex.test.ts` — `codex-edge.log` | 19:27:02.890 → 19:27:04.146 | 1,256 s | **0**, 4 test ghi nhận kết quả thực tế: delta sai 30/04, ca 28/02, Tổng kỳ tương lai, 2.412 tháng liên tục ở miền năm tối đa. |
| HEAD/status/diff + số commit + golden log + hash/coverage Node — `snapshot.log` | 19:35:42.514 → 19:35:42.922 | 0,408 s | **0**, đúng SHA; 38 commit; diff tracked rỗng; hash và coverage dưới đây. Test tạm còn hiện tại thời điểm này, đã dọn ở §7. |
| Kiểm cuối sau dọn test — `final-state.log` | 19:50:01.370 → 19:50:01.531 | 0,161 s | **0**, xem §7. |

**Coverage** theo thứ tự statements / branches / functions / lines, lấy từ baseline `verify-1`, trước khi tạo test tạm:

| Vùng được cấu hình đo | Statements | Branches | Functions | Lines |
|---|---:|---:|---:|---:|
| Toàn bộ vùng coverage | 98,38% | 97,66% | 98,10% | 98,76% |
| Domain, 19 file | 100% (516/516) | 100% (339/339) | 100% (152/152) | 100% (433/433) |
| DB, 18 file | 99,35% (1.227/1.235) | 97,90% (653/667) | 100% (343/343) | 99,71% (1.066/1.069) |
| App data, 3 file | 96,62% (143/148) | 91,48% (43/47) | 92,45% (49/53) | 98,43% (126/128) |
| App shell TS, 6 file | 75,94% (60/79) | 86,67% (52/60) | 78,13% (25/32) | 76,12% (51/67) |

Vitest in một số số shell bằng cách cắt phần thập phân: branches 86,66 / functions 78,12 / lines 76,11. Bảng trên tính lại từ số đếm, làm tròn hai chữ số. Đây là coverage của các glob cấu hình, không phải toàn bộ React TSX. Ngưỡng riêng hiện tại đều qua.

**Cảnh báo:** verify và Rust baseline không có cảnh báo lint/clippy. Hai lượt E2E có Node `NO_COLOR` bị `FORCE_COLOR` ghi đè và Vite báo chunk trên 600 kB. Chunk ExcelJS riêng khoảng 929,56 kB thô / 256,44 kB gzip; chart khoảng 527,11 / 178,51 kB gzip, dưới acceptance 250 KiB gzip. Cảnh báo không làm test fail và không phải phát hiện bảo mật. Harness Rust riêng có `DATA_DIR` unused do chỉ kéo module storage vào; baseline clippy không có cảnh báo này.

**Lần chạy không hợp lệ / chỉnh probe:** hai lệnh `pnpm` đầu lúc 18:56:10 bị policy `pnpm.ps1` chặn nhưng wrapper trả 0. Không tính chúng là verify thành công. Probe DB lần đầu unpack sai `importBackup`; lần hai giả định formatter tiền âm ném lỗi, thực tế formatter hợp lệ với số âm. Đã sửa probe và chỉ dùng lần 3 làm bằng chứng. Rust hai lần đầu thiếu crate name/edition, chưa chạy test. Probe browser đầu đọc nhãn ngay sau chuyển route, trước React ổn định; lần 2 dùng `toHaveText` chờ đúng trạng thái. Log các lần này được giữ trong `evidence.jsonl`, không quy lỗi harness cho sản phẩm.

**Golden:** log phạm vi golden có đúng bốn commit: `0b0e884` (G2 + bảng mới), `b16f632` (hàm MTD), `250db4a` (4 nhóm lịch), `38e6531` (snapshot/chart/report marks). `metrics.fixture.ts` không đổi trong diff; test cũ không đổi expected, chỉ thêm kiểm G18 qua `monthToDate`. Các bảng/test A/S/M mới tương ứng spec G2/G3. Không thấy sửa fixture cũ để cho xanh.

## 3. Phát hiện

Đường dẫn và dòng dưới đây thuộc đúng snapshot `595ef79`. File:dòng dùng đường dẫn tương đối để tra trong worktree đã ghi ở metadata.

### CX4-001 — Ngày cuối tháng so MTD với cả tháng trước dài hơn — Medium · NEW · REPRODUCED

- **File:dòng:** [packages/domain/src/compare.ts:45](C:/workspace/Project-2C-review-2/packages/domain/src/compare.ts:45); nhãn vẫn ghi MTD ở [apps/desktop/src/routes/overview/overview-view.ts:220–227](C:/workspace/Project-2C-review-2/apps/desktop/src/routes/overview/overview-view.ts:220). Điểm quyết định là `compareDates(today, period.end) >= 0`.
- **Tái hiện:** hôm nay **30/04/2027**, kỳ Tháng 04. Cửa sổ hiện tại 01–30/04. Hàm trả kỳ trước **01–31/03**, thay vì **01–30/03**. Dữ liệu chỉ có một HĐ nộp ngày 31/03, FYP 100 triệu; tháng 4 không có HĐ. Ô HĐ nộp của tháng 4 hiện **▼ 1**, Case size hiện **▼ 100 tr**, ghi so với tới 31/03. Với cửa sổ cùng số ngày, cả hai phải hiện **=**. Ngày **28/02/2027** cũng so cả 31 ngày tháng 1 thay vì 28 ngày.
- **Spec bị vi phạm:** [docs/design/phase-4-chi-so.md:104](C:/workspace/Project-2C-review-2/docs/design/phase-4-chi-so.md:104): “cùng số ngày”; `:107`: “Kỳ chưa hết … n ngày đầu của kỳ liền trước”. C02 `:115` gọi chính ngày cuối tháng 31/03 là MTD. `viewingText` cũng nhận ngày cuối kỳ là đang trong kỳ. Chỉ sau ngày cuối kỳ mới thuộc nhánh “kỳ đã hết” `:106`.
- **Bằng chứng:** test kỳ vọng 30/03 trong `phase4.codex.test.ts` đỏ, actual 31/03. `edge.codex.test.ts` xác nhận các delta và nhãn thực tế, cùng ca 28/02; 4/4 pass. Chúng kiểm cả cửa sổ lẫn view model KPI.
- **Hậu quả:** người dùng bị báo giảm HĐ/Case size chỉ do tháng trước có thêm ngày. MTD vẫn mang nhãn cùng số ngày. Lỗi ở ca biên cuối tháng nên xếp Medium, không nâng thành sai số mọi ngày.
- **Đề xuất:** phân biệt ngày cuối kỳ với ngày sau kỳ; dùng cửa sổ cùng số ngày khi hôm nay còn nằm trong kỳ. Giữ nhánh cả kỳ cho kỳ đã qua. Phạm vi: `compare.ts`, `compare.test.ts`, `overview-view.test.ts`. Thêm ca 30/04 vs tháng 3, 28/02 và 29/02 vs tháng 1, tuần bị cắt ở MAX_YEAR; giữ các golden hiện có. Không sửa expected theo hành vi sai.

### CX4-002 — Hôm nay không cập nhật khi màn mở qua nửa đêm — Medium · NEW · REPRODUCED

- **File:dòng:** [apps/desktop/src/routes/Overview.tsx:38–42](C:/workspace/Project-2C-review-2/apps/desktop/src/routes/Overview.tsx:38); cùng mẫu tại `routes/reports/ReportsScreen.tsx:48–52`; [packages/ui/src/components/PeriodPicker.tsx:143–144](C:/workspace/Project-2C-review-2/packages/ui/src/components/PeriodPicker.tsx:143). Ngày được đọc lúc render, callback dùng prop `today` đã chụp; nếu kỳ đích trùng giá trị cũ thì không gọi `change`.
- **Tái hiện:** mở bản web build không ghim `VITE_DEMO_ANCHOR`, Edge ở Asia/Bangkok, đồng hồ **31/10/2026 23:59 UTC+07**. Màn Tổng quan hiện Tháng 10/2026. Đổi đồng hồ thành **01/11/2026 00:01**, giữ nguyên màn và bấm **Hôm nay**. Nhãn vẫn **Tháng 10/2026**. Chuyển sang Báo cáo, chờ render xong thì nhãn thành **Tháng 11/2026**. 0 pageerror.
- **Mong đợi:** Hôm nay chọn kỳ chứa 01/11/2026, theo loại kỳ đang chọn; vẫn giữ nguyên quy tắc bấm Lọc để áp số của Tổng quan/Báo cáo.
- **Quy tắc/spec:** nhãn UI hiểu theo nghĩa thường (`CLAUDE.md`, “Quy tắc Owner đã chốt”). Issue **#310 T-124** quy định Hôm nay theo `app.today()`, custom về tháng. Code đã sửa nguồn đồng hồ ở lần render; chưa có cơ chế làm ngày mới tới component khi app để mở lâu.
- **Bằng chứng:** `midnight.mjs`, `codex-midnight-2.log`, exit 0. Probe dùng `page.clock.setFixedTime`, không sửa code app hoặc chèn mock API sản phẩm. Lần chuyển màn chứng minh nguồn ngày mới đọc được khi component render lại.
- **Hậu quả:** người dùng sáng hôm sau bấm Hôm nay mà vẫn ở kỳ hôm qua/tháng trước. Ngày cũ cũng được dùng bởi các memo đếm tới hôm nay cho đến render tiếp. Báo cáo chỉ chứng minh đường Tổng quan qua nửa đêm; các màn khác có cùng kiểu đọc cần được kiểm khi sửa.
- **Đề xuất:** có một nguồn ngày lịch phản ứng trong app, cập nhật ở mốc đổi ngày và khi lấy lại focus; hoặc đọc ngày mới trong thao tác Hôm nay và truyền tới màn. Phạm vi: lớp AppData/context hoặc hook ngày dùng chung, Overview, ReportsScreen, AppointmentsScreen, PeriodPicker và E2E clock. Kiểm thêm đổi múi giờ và focus sau khi máy sleep. Không để việc cập nhật ngày tự áp kỳ/góc nhìn chưa bấm Lọc.

### CX4-003 — Tổng so sánh team hiện 0 trong kỳ tương lai khi danh sách team rỗng — Low · NEW · REPRODUCED

- **File:dòng:** [apps/desktop/src/routes/overview/team-compare-view.ts:73–88](C:/workspace/Project-2C-review-2/apps/desktop/src/routes/overview/team-compare-view.ts:73), gọi tại `:118`. `rows.some` trên mảng rỗng là false; hàm cộng dựng metrics bằng 0 dù kỳ chưa bắt đầu.
- **Tái hiện:** dữ liệu hợp lệ rỗng, `teams=[]`, hôm nay **04/10/2026**, kỳ **Tháng 11/2026**. Sáu KPI Tổng quan là **—**, Tổng hợp Báo cáo có `metrics=null`; dòng Tổng của So sánh team lại có RF=0, HĐ nộp=0, Case size=0, HĐ phát hành=0, Doanh số=0 và tỉ lệ chốt=null.
- **Mong đợi:** kết quả của kỳ chưa bắt đầu phải là **—**, cả khi chưa có dòng team. Với kỳ đã bắt đầu và không có dữ liệu, 0 là đúng.
- **Spec/mockup:** spec §4.1 quy định kết quả tới hôm nay; [docs/design/mockups/overview.html:1075–1085](C:/workspace/Project-2C-review-2/docs/design/mockups/overview.html:1075) ghi “Kỳ chưa bắt đầu” với KPI **—**. Bộ cộng Báo cáo ở `reports/reports-view.ts:101–121` đã giữ trạng thái có kết quả từ kỳ, thay vì suy từ số dòng.
- **Bằng chứng:** `phase4.codex.test.ts` kỳ vọng `null` đỏ; `edge.codex.test.ts` kiểm trực tiếp bất nhất với report và sáu KPI, pass. Không cần backup hỏng; DB trống là đầu vào hợp lệ.
- **Hậu quả:** hai bảng cùng kỳ/góc nhìn phân biệt 0 và chưa có kết quả khác nhau. Cần hết team mới gặp nên Low.
- **Đề xuất:** truyền trạng thái `counted !== null` vào hàm cộng, tương tự `sumFigures` của Báo cáo. Phạm vi: `team-compare-view.ts`, test của nó. Thêm bảng rỗng ở kỳ hiện tại/quá khứ/tương lai, không đổi trường hợp đã có team.

### CX4-004 — Tên RE hợp lệ quá dài làm xuất Excel trên Windows thất bại — Low · NEW · REPRODUCED

- **File:dòng:** [apps/desktop/src/routes/reports/report-workbook.ts:165–172,194–196](C:/workspace/Project-2C-review-2/apps/desktop/src/routes/reports/report-workbook.ts:165); [packages/db/src/common.ts:15–18](C:/workspace/Project-2C-review-2/packages/db/src/common.ts:15); [apps/desktop/src-tauri/src/storage.rs:167–183](C:/workspace/Project-2C-review-2/apps/desktop/src-tauri/src/storage.rs:167); thông báo ở `routes/reports/ReportExport.tsx:58–59,69–75` và `i18n/vi.ts:553–555`.
- **Tái hiện:** tạo RE có tên `'a'.repeat(260)`, lệnh DB nhận thành công. Tên góc nhìn `RE <260 chữ a>`, kỳ 10/2026, ngày xuất 04/10/2026. `reportFileName` sinh tên **295 ký tự**; file `.claim` cần thành phần **301 ký tự**. Gọi `storage::write_export` thật trên Windows trả **OS 123 / InvalidFilename**, thư mục exports không có file nào.
- **Mong đợi:** tên người được app nhận không được làm hỏng thao tác xuất. Rút ngắn phần slug trong tên file; giữ đầy đủ tên người trong nội dung Excel. Nếu ghi thất bại, thông báo phải hướng tới nguyên nhân phù hợp.
- **Spec/mockup:** spec Phase 4 §4.4 và mockup `reports.html` 2f yêu cầu xuất các bảng thành `.xlsx`, tên theo kỳ/góc nhìn/ngày. `report-workbook.ts:190–192` triển khai chính hợp đồng này. Quy tắc tên hiện chỉ chặn rỗng, không có giới hạn 255 ký tự cho tên người.
- **Bằng chứng:** test DB 260 ký tự pass; probe TS in `LONG_REPORT_NAME 295`; Rust test trên cùng module snapshot in lỗi OS 123. Ca đối chứng **đường dẫn tổng 318 ký tự nhưng mỗi thành phần ngắn** ghi được, nên không quy toàn bộ lỗi cho MAX_PATH.
- **Hậu quả:** xuất Excel theo RE/team có tên dài thất bại. Code nuốt lỗi và hướng dẫn “đầy ổ đĩa hoặc không có quyền”, trong khi nguyên nhân là thành phần tên file; đọc code xác nhận câu này, chưa quan sát dialog trong exe. Đây là ca khó gặp, không mất dữ liệu và không phải path traversal.
- **Đề xuất:** giới hạn slug theo ngân sách thành phần Windows, tính cả `.xlsx`, hậu tố tới `-1000`, `.claim`/`.tmp` và các phần kỳ/ngày cố định. Thêm mã lỗi có thể phân biệt tên không hợp lệ với lỗi ghi. Phạm vi: report-workbook, ReportExport, i18n và test; có thể thêm guard/tests ở storage. Không cần giới hạn tên người trong DB chỉ để vừa tên file.
- **Phân loại:** NEW vì đường tạo tên `.xlsx` theo tên RE/team được thêm ở Phase 4. F-04 cũ là giới hạn dung lượng đọc backup; không phải lỗi ghép thành phần tên file này.

### CX4-005 — Nhập backup còn nhận case size dự kiến âm — Low · KNOWN (F-01, còn thiếu) · REPRODUCED

- **File:dòng:** [packages/db/src/schema.ts:124](C:/workspace/Project-2C-review-2/packages/db/src/schema.ts:124) chưa có CHECK cho `expected_case_size`; `backup-validation.ts:43–49` không kiểm cột này. Lệnh chuẩn lại gọi `requireAmount` tại `appointments.ts:284–289`, định nghĩa `common.ts:63–66`. Giá trị đi vào hồ sơ qua `routes/customers/policy-form.ts:122–128` và `CustomerPolicies.tsx:41`.
- **Tái hiện:** tạo KH N3, lịch 01/09/2026, ghi MET giữ N3 với case size 100. Lệnh ghi trực tiếp **-1** bị từ chối bằng `INVALID_AMOUNT`. Xuất backup, đổi `appointments[0].expected_case_size` thành **-1**, rồi nhập. `importBackup` nhận và `listAppointments` trả **-1**; `formatVndCompact` in **-1 ₫**. Formatter không crash.
- **Mong đợi:** nullable hoặc số nguyên đồng dương như lệnh nghiệp vụ; -1/0 bị `BACKUP_INVALID` trước thay DB. Áp cho bản ghi đã xóa mềm như các kiểm giá trị khác.
- **Spec bị vi phạm:** [docs/design/phase-3-du-lieu.md:211–217](C:/workspace/Project-2C-review-2/docs/design/phase-3-du-lieu.md:211): “Kiểm giá trị … mọi hàng” và “tiền là số nguyên dương: CHECK của schema”. CHECK này có cho FYP nhưng thiếu tại cột case size dự kiến.
- **Bằng chứng:** [packages/db/src/phase4.codex.test.ts](C:/workspace/Project-2C-review-2/packages/db/src/phase4.codex.test.ts), `codex-db-probes-3.log`, 2/2 pass; log `BACKUP_NEGATIVE_CASE_SIZE -1`, `BACKUP_NEGATIVE_FORMATTED -1 ₫`.
- **Hậu quả:** backup không tin cậy đưa giá trị tiền mà lệnh từ chối vào dữ liệu tham khảo của cuộc gặp/hồ sơ. **Không làm sai KPI Case size** của dashboard, vì KPI cộng FYP nộp. Không chứng minh mất dữ liệu hoặc crash, nên Low.
- **KNOWN:** F-01 trong tổng hợp 30/09 là lớp lỗi “nhập backup bỏ qua bất biến nghiệp vụ”; sổ review-notes ghi F-01…F-04 RESOLVED. Đây là **phần kiểm giá trị còn thiếu**, không đổi thành NEW, cũng không cho rằng mọi sửa F-01 cũ thất bại.
- **Đề xuất:** bổ sung kiểm nullable/positive safe integer cho cột này khi nhập, cùng test -1, 0 và round-trip giá trị hợp lệ. Phạm vi: backup-validation và test backup/appointments. Giữ luật ở lệnh. Theo quyết định dữ liệu giả lập, từ chối backup sai và nạp lại seed; không đề xuất migration hoặc UI sửa dữ liệu cũ.

### Đã kiểm, không thành phát hiện

| Chủ đề | Kết quả / bằng chứng và phạm vi |
|---|---|
| Ngày 1, 29/02, tuần vắt kỳ | `compare.test.ts`, `period.test.ts` và `calendar-grid.test.ts` kiểm ngày đầu, leap day, tuần T2–CN và cắt biên. Ngoại lệ cùng ngày/tháng của kỳ Năm đúng C07. Lỗi ngày cuối tháng được tách CX4-001. |
| Custom ngược / một ngày / rất dài | custom ngược bị từ chối; một ngày hợp lệ, không so kỳ trước. Probe toàn miền 01/01/1900–31/12/2100 tạo **2.412 tháng liên tục**, đầu/cuối đúng; không rớt mốc. Chưa đo DOM với 2.412 dòng. |
| Biên 1900/2100 | `MAX_YEAR=2100`, `canShift`, parse và kiểm backup đã dùng cùng miền. E2E picker tắt nút ở biên. `addDays` rất lớn ném RangeError thay NaN. T-f/F-14 đã được xử lý trong phạm vi đã test. |
| Local so với UTC | Domain dùng ngày lịch, DB đọc `fromLocalDate(db.now())`; app lấy `app.today()`. Unit giữ ngày local; browser probe cố định Asia/Bangkok qua nửa đêm. Không kết luận đã kiểm đổi múi giờ Windows thật. |
| 0 RF / >100% / làm tròn | Golden và unit giữ tỉ lệ dưới dạng numerator/denominator; 0 RF là null/—, >100% không bị chặn sai. Tổng dùng Σ issued ÷ Σ RF, không lấy trung bình. Tiền tỷ và số đếm >999 dùng formatter domain. |
| Tổng quan ↔ Báo cáo ↔ Excel | Probe seed đối chiếu sáu giá trị KPI/view model với Tổng hợp cho scope all/team/re và Excel số. Tổng team/RE khớp Tổng hợp; Tổng So sánh team khớp report all. **Lưu ý spec §4.3:** Tổng quan ở góc nhìn Team cộng mọi team, còn Báo cáo Team chọn một team. Test raw `kpiTiles(scope:team)` không phải bằng chứng rằng UI Tổng quan Team chọn riêng một team; đối chiếu UI phải qua `metricsScope` (Team → all). Không coi khác biệt đã chốt này là lỗi. |
| Theo mốc | Lịch hẹn và chỉ số luồng được cộng theo các mốc liên tục. KH cuối kỳ là ảnh chụp mỗi mốc, không được cộng các tháng để so với KH cuối năm. Unit/golden A/S/M và reports-view test phủ việc này. |
| Stage snapshot | Dựa transition mới nhất chưa xóa theo ngày/seq; xóa mềm bỏ KH, đóng/mở lại đi theo lịch sử; mốc tương lai không giả ra ảnh chụp. Unit/golden và DB round-trip xanh. |
| Lịch dời, hủy, không đến | Dời giữ lịch cũ và liên kết lịch mới; missed gồm cả RESCHEDULED/CANCELLED/NO_SHOW, planned chỉ hôm nay/tương lai, lịch cũ chưa ghi kết quả tách unrecorded. Unit/E2E các luồng tiếp theo, sửa/xóa, chain và rollback xanh. |
| Nhân sự / scope | Luật ≤1 TL, support không team, người sống → team sống, bản ghi sống → RE sống đã được validator + lệnh giữ. Test nhập→thao tác→xuất→nhập, team không RE, đổi RE/team và scope trỏ bản ghi đã xóa có phủ. Không có lịch sử team theo thời gian trong model; spec dùng team hiện tại, không tự yêu cầu phân bổ theo team cũ. |
| Chuỗi từ DB vào chart | `stage-chart.ts:49–51,69–74` escape tên team/title và label khi tạo tooltip HTML; marker do ECharts sinh, không lấy từ tên DB. React render tên như text. T-i/F-18 đã được áp dụng; unit chart kiểm formatter/escaping. Không chứng minh lỗ XSS. |
| Chuỗi vào Excel | Probe 10 tên: =, +, @, -, 007, HTML/script, regex, emoji, chữ Nhật và 260 chữ Latin. Đọc lại giữ **String**, không thành formula. Trong report Excel là xlsx typed cells, không áp phỏng đoán CSV formula injection. Tên file được ASCII slug nên không có traversal; lỗi chiều dài tách CX4-004. |
| Đọc lại xlsx | Seed: scope all/team/re có **4/3/2 sheet**. Ô RF/Case size/Doanh số/tỉ lệ là numeric, format **#,##0 / 0.0%**. Web tải file `bao-cao_2026-11_toan-bo_2026-11-01.xlsx`; đọc lại 4 sheet Tổng hợp, Theo team, Theo RE, Theo mốc; dòng đầu có 01/11/2026. File mẫu và JSON đọc lại được lưu ngoài repo. |
| Rust export / claim/tmp | 37 test baseline giữ tên/hậu tố, kiểm hậu tố, dọn exports khi startup, không dọn claim của lần export đang chạy khi webview reload. Probe thêm **8 thread × 64 KiB**: 8 đường dẫn khác nhau, bytes đầy đủ, 0 claim/tmp sót. Các tên traversal/extension sai bị từ chối qua test storage. |
| Web export / lazy load | Probe browser thấy **0 request ExcelJS trước export**, sau export có request chunk riêng; download đọc lại được; 0 pageerror. |
| Lọc / notice | `useAppliedFilter` tách picked/applied; unit và E2E giữ số đến khi bấm Lọc. Notice export giữ file đã xuất khi đổi kỳ là kết quả của thao tác trước, có tên/path rõ; chưa đủ cơ sở gọi đó là lỗi. |
| i18n / a11y / tabular-nums | Lint tokens và test COUNT_SLOTS/i18n xanh. Bảng có header/sort ARIA, chart có label và fallback table, ô stage có pressed; E2E kiểm keyboard sort, accessible description, font tabular và màu. Không thay thế kiểm screen reader thủ công hoặc audit WCAG. |
| Seed / kỳ Năm / Toàn bộ | Seed **3 team, 36 người, 1.200 KH, 970 HĐ, 6.241 lịch, 3.330 transition**, seed 42, anchor 15/09/2026. Sau 3 lần warm-up, 25 mẫu: `periodMetrics` median **0,826 ms**, p95 **0,868**; report năm **26,200 / 26,803 ms**; So sánh team **10,900 / 11,360 ms**. Seed **3.328,786 ms**. Không thấy regression thực tế trên cỡ seed này; không suy ra mọi thuật toán đều tuyến tính. |
| Tiền cực lớn | Probe tổng `MAX_SAFE_INTEGER + 1` làm formatter ném RangeError. Đó là tổng trên 9 triệu tỷ đồng; không cộng phát hiện ở quy mô demo. Miền tổng tiền chưa được spec chốt riêng. Source/log vẫn giữ ở phụ lục để người xử lý biết giới hạn số. NaN không đi qua kiểm số nguyên của đường nhập bình thường. |
| Backup / Tauri | Backup dùng staging, migrate rồi validate trước replace; SQL lấy tên cột/bảng từ schema, không từ dữ liệu người dùng; giới hạn 100 MB. Lệnh Rust chỉ ghi trong data/exports với allowlist tên/hậu tố. Chưa có RCE/traversal/data loss đã chứng minh. Case size âm là lỗ kiểm giá trị riêng CX4-005. |

Các điểm code/test để tra các kết luận “đã kiểm” ở đúng snapshot:

- Ngày/kỳ: [packages/domain/src/period.ts:38](C:/workspace/Project-2C-review-2/packages/domain/src/period.ts:38), `:47`, `:76`, `:266`, `:369`; [packages/domain/src/period.test.ts:145](C:/workspace/Project-2C-review-2/packages/domain/src/period.test.ts:145), `:200`, `:206`, `:216`, `:442`; [packages/domain/src/compare.test.ts:31](C:/workspace/Project-2C-review-2/packages/domain/src/compare.test.ts:31), `:38`, `:80`. MTD ngày cuối được kiểm riêng CX4-001.
- Chỉ số và stage: [packages/domain/src/stats.ts:119](C:/workspace/Project-2C-review-2/packages/domain/src/stats.ts:119), `:139`; [packages/domain/src/stage-snapshot.test.ts:30](C:/workspace/Project-2C-review-2/packages/domain/src/stage-snapshot.test.ts:30), `:112`, `:140`; [apps/desktop/src/routes/overview/overview-view.ts:100](C:/workspace/Project-2C-review-2/apps/desktop/src/routes/overview/overview-view.ts:100), `:201`; [apps/desktop/src/routes/reports/reports-view.ts:106](C:/workspace/Project-2C-review-2/apps/desktop/src/routes/reports/reports-view.ts:106). Probe integration ở §6 giữ toàn bộ các assertion số và file đọc lại.
- Lịch và dữ liệu nhập: [packages/domain/src/appointment-counts.test.ts:25](C:/workspace/Project-2C-review-2/packages/domain/src/appointment-counts.test.ts:25), `:30`, `:38`; [packages/db/src/backup-invariants.test.ts:136](C:/workspace/Project-2C-review-2/packages/db/src/backup-invariants.test.ts:136), `:155`, `:461`; [packages/db/src/backup.ts:99](C:/workspace/Project-2C-review-2/packages/db/src/backup.ts:99), `:187`; [apps/desktop/src-tauri/src/lib.rs:68](C:/workspace/Project-2C-review-2/apps/desktop/src-tauri/src/lib.rs:68).
- UI/xuất: [apps/desktop/src/routes/FilterBar.tsx:29](C:/workspace/Project-2C-review-2/apps/desktop/src/routes/FilterBar.tsx:29); [apps/desktop/src/routes/overview/stage-chart.test.ts:137](C:/workspace/Project-2C-review-2/apps/desktop/src/routes/overview/stage-chart.test.ts:137); [apps/desktop/src/routes/overview/StageBlock.tsx:34](C:/workspace/Project-2C-review-2/apps/desktop/src/routes/overview/StageBlock.tsx:34); [apps/desktop/src/routes/reports/report-workbook.test.ts:57](C:/workspace/Project-2C-review-2/apps/desktop/src/routes/reports/report-workbook.test.ts:57), `:119`, `:134`, `:147`; [e2e/data-table.spec.ts:65](C:/workspace/Project-2C-review-2/e2e/data-table.spec.ts:65); [e2e/theme.spec.ts:62](C:/workspace/Project-2C-review-2/e2e/theme.spec.ts:62); [e2e/chart.spec.ts:62](C:/workspace/Project-2C-review-2/e2e/chart.spec.ts:62); [apps/desktop/src-tauri/src/storage.rs:139](C:/workspace/Project-2C-review-2/apps/desktop/src-tauri/src/storage.rs:139), `:158`, `:202`, `:420`.

## 4. Đối chiếu review-notes (OPEN liên quan Phase 4)

Nguồn: [docs/state/review-notes.md](C:/workspace/Project-2C-review-2/docs/state/review-notes.md) ở snapshot. Bảng này là đề nghị cập nhật trạng thái; reviewer **không sửa sổ** và không cộng các dòng cũ vào số NEW.

| Mã / dòng OPEN | Đối chiếu snapshot | Đề nghị |
|---|---|---|
| **T-f / F-14** — thiếu MAX_YEAR, shift văng ngoài miền, addDays rất lớn ra NaN | T-100 #256 đã có MAX_YEAR/canShift và test. Không tái hiện các lỗi cũ qua bộ test biên. | Chuyển phần đã sửa sang RESOLVED, dẫn PR/task. CX4-001 là lỗi so sánh kỳ mới, không phải lỗi shift cũ. |
| **T-i / F-18** — escape formatter ECharts | `stage-chart.ts` encodeHtml tên DB/title; chart test xanh. | Có thể RESOLVED cho chart Phase 4; giữ checklist khi thêm formatter mới. |
| **Overview R4** — lấy đồng hồ máy thay `app.today()` | Overview hiện lấy `useAppData().today()`. #310 đã xử lý nguồn ngày; thiếu refresh qua nửa đêm là CX4-002. | Đóng phần lấy sai nguồn. Mở riêng phần hành vi ngày cũ sau nửa đêm. |
| **#165** — cùng ngày sort tăng vẫn giờ muộn trước; style RF/năm khác | Các helper comparator vẫn ưu tiên thứ tự cũ cho lịch cùng ngày; E2E sort ngày chưa bắt thứ tự giờ khi tie. Đây là ghi chú cũ, không lập CX4 NEW. | Giữ OPEN và thêm acceptance tie ngày/giờ khi chạm file. |
| **#156/#179** — ô ngoài kỳ aria-hidden, caused undefined | Hành vi/prop vẫn theo ghi chú cũ; không tạo số liệu sai trong Phase 4. | Giữ OPEN theo file; cần quyết định thông tin ngoài kỳ cho screen reader khi sửa UI. |
| **Lịch hẹn #162–#168** — outcomeChoices + duplicated code | API chặn INVALID_STATUS dù UI không mở outcome cho RESCHEDULED; helper/cảnh báo lặp là nợ cũ. | Giữ ghi chú theo file, không nâng thành lỗi người dùng mới. |
| **S-1 / D-1** — hash KYC không được xác minh khi nhập | Bộ kiểm chưa tính lại hash version; ngoài tính toán dashboard hiện tại. | Giữ cho AI/sync phase sau. Không đưa vào số phát hiện Phase 4. |
| **S-2 #96/#192/#206** — replace/save cửa sổ async | Test hiện có phủ giữ DB cũ khi mở mới lỗi; chưa chứng minh toàn bộ serialize ghi muộn/replace chồng nhau. | Giữ OPEN cho sync; không tuyên bố đã giải quyết chỉ vì unit baseline xanh. |
| **storage.rs** — portability/helper và phần tmp cũ | Windows clippy/test xanh; cleanup exports đã có, cleanup backups và portability ngoài Windows còn giới hạn cũ. | Tách phần exports đã được test khỏi phần OPEN ngoài Windows/backups. |
| **DataTable** — bảng rỗng/sortable:false, cellClass chỉ E2E | E2E sort/cellClass và tabular xanh; chưa có seam unit component mới. | Giữ phần unit chưa phủ, không tạo dependency chỉ để review. |
| **G3 contrast / token-guard / regex tên seed E2E** | Vẫn là nợ/điểm cân nhắc đã ghi, không có tên seed regex làm E2E fail ở hai lượt. | Giữ theo nhóm hiện tại; không đóng từ kết quả test không liên quan. |
| **F-01 ở RESOLVED** | Kiểm ngày/KYC/nhân sự cũ đã sửa; expected_case_size âm vẫn lọt. | Ghi “F-01 còn thiếu: case size dự kiến”, dẫn CX4-005. Không đổi cả nhóm thành NEW. |

Các ghi chú tooling, icon, bootstrap, template docs và việc sửa UI Phase 3 không chạm số liệu dashboard được giữ ngoài đánh giá G7 này. Không đề xuất migration dữ liệu giả lập.

## 5. Giới hạn

- Chưa chạy **exe UI thật/WebView2**, NVDA, Explorer hay kiểm đóng/mở app bằng tay. Artifact được tải/hash; Rust chạy IO Windows thật và E2E chạy web Edge. Không gọi đây là UAT exe.
- Không tạo đĩa đầy/ACL lỗi ở OS cho lượt review này. Unit mocks và test storage có sẵn phủ lỗi ghi; câu báo lỗi tên dài được suy từ đường catch/i18n, không từ dialog exe đã quan sát.
- Nửa đêm được tái hiện bằng clock của browser Asia/Bangkok. Chưa đổi timezone Windows thật, chưa kiểm sleep/resume và sự kiện focus ngoài browser probe.
- Đã đọc source/tests của năm vùng yêu cầu. Metadata JSON migration sinh tự động không được rà từng dòng; đối chiếu schema/SQL/journal và test migration. Mockup được đối chiếu nội dung/hành vi, chưa audit pixel, mọi breakpoint hoặc tỷ lệ tương phản AA bằng công cụ đo.
- Coverage không phủ mọi React TSX. Hai lượt E2E đều xanh chỉ chứng minh bộ test hiện có; CX4-001/002/003 là các ca còn thiếu của bộ đó. Không dùng số 100% domain để kết luận không còn edge case.
- Perf là 25 mẫu trong Node/sql.js trên máy này, không phải React DOM/WebView2. Chưa đo dataset lớn hơn seed hoặc render custom 201 năm. Không chứng minh không có O(n²) ở mọi đường gọi.
- Probe tiền vượt số nguyên an toàn là dữ liệu cực đoan, không được đếm. Các giả thuyết về seed neo tận 1900/2100, vòng reschedule bất thường hoặc i64 offset từ IPC không có bằng chứng đủ để lập phát hiện và không được trình bày như lỗi đã tái hiện.
- `git fetch origin`, detach đúng SHA và `pnpm install --frozen-lockfile` đã chạy thành công khi chuẩn bị. Không có logger giờ cho ba bước ban đầu; không dựng lại thời điểm giả. Các lệnh bằng chứng bắt buộc trong §2 có mốc giờ thực.
- `read-ledger.jsonl` chỉ ghi các lượt đọc qua helper; vài lượt đọc trực tiếp trước đó không có trong ledger. Đầu ra bị cắt đã được đọc bù theo đoạn. Ledger không được dùng một mình làm bằng chứng đọc toàn bộ.
- Worktree có `.agents/`, `.codex/`, `AGENTS.md` untracked từ trước phiên. Giữ nguyên cấu hình của anh; trạng thái cuối không rỗng hoàn toàn dù không còn file review tạo mới và không có thay đổi tracked. Chi tiết §7.

## 6. Phụ lục — test / probe tạm (đã xóa)

Các nguồn dưới đây được chép nguyên nội dung bản cuối đã chạy, trước khi xóa. Test đầu `phase4.codex.test.ts` cố ý dùng expected theo hợp đồng để chỉ ra lỗi. Test observation `edge.codex.test.ts` xác nhận hành vi thực tế, không biến hành vi sai thành acceptance sản phẩm.

Thứ tự chạy để tái hiện: baseline install/build → server web không ghim demo anchor ở cổng 4173 trống → browser probe tạo `web-export.xlsx` → integration probe đọc file này → các unit probe. Rust harness kéo trực tiếp `storage.rs` của snapshot bằng `#[path]`; biên dịch edition 2021/crate-name như §2. Probe Rust tự dọn thư mục dữ liệu riêng. Các helper đọc/log chỉ phục vụ review, không phải patch sản phẩm.

### 6.1. C:/workspace/Project-2C-review-2/apps/desktop/src/routes/phase4.codex.test.ts

SHA256 nguồn: `1d1306ca06a82774fb02e0f017e6c5180ca865ce89419115c6bfc96c5cd35517`.

```typescript
import { describe, expect, it } from 'vitest';
import { calendarDate as d, comparisonWindows, periodOf, type MetricsData } from '@p2c/domain';
import { teamCompare } from './overview/team-compare-view';
import { kpiTiles, viewingText } from './overview/overview-view';
import { reportRows } from './reports/reports-view';
import { reportFileName } from './reports/report-workbook';

const empty = { people: [], teams: [], customers: [], policies: [], appointments: [], transitions: [] };

describe('Phase 4 independent review probes', () => {
  it('month ending today compares the same number of days: 30 April vs 1-30 March', () => {
    const today = d(2027, 4, 30);
    const period = periodOf('month', today);
    expect(viewingText({ period, scope: { kind: 'all' } }, today, [], []).mtd).toBe(true);
    expect(comparisonWindows(period, today)?.previous.end).toEqual(d(2027, 3, 30));
  });
  it('a future period with no team has no KPI in the overview total, as in the report', () => {
    const today = d(2026, 10, 4);
    const period = periodOf('month', d(2026, 11, 1));
    expect(reportRows(empty, period, { kind: 'all' }, today).summary.metrics).toBeNull();
    expect(teamCompare(empty, period, today).total.metrics).toBeNull();
  });
  it('allowed integer amounts whose sum is unsafe must not crash KPI formatting (diagnostic)', () => {
    const today = d(2026, 10, 4);
    const policy = { id: 'p', customerId: 'c', reId: 'r', submittedDate: today, submittedFyp: Number.MAX_SAFE_INTEGER, issuedDate: null, issuedFyp: null };
    const data: MetricsData = { ...empty, policies: [policy, { ...policy, id: 'p2', submittedFyp: 1 }] };
    expect(() => kpiTiles(data, periodOf('month', today), { kind: 'all' }, today)).not.toThrow();
  });
  it('records the length of a file name built from a permitted 260-character RE name', () => {
    const today = d(2026, 10, 4);
    const name = reportFileName(periodOf('month', today), 'RE ' + 'a'.repeat(260), today);
    console.log('LONG_REPORT_NAME', name.length, name);
    expect(name.length).toBeLessThanOrEqual(245);
  });
});
```

### 6.2. C:/workspace/Project-2C-review-2/apps/desktop/src/routes/edge.codex.test.ts

SHA256 nguồn: `b7c540ae689a92428710468eecde94718a88f0a2e9c0b7a0d8a2c699b2bbf3fb`.

```typescript
import { describe, expect, it } from 'vitest';
import { calendarDate as d, comparisonWindows, customPeriod, reportMarks, periodOf } from '@p2c/domain';
import { kpiTiles, viewingText } from './overview/overview-view';
import { teamCompare } from './overview/team-compare-view';
import { reportRows } from './reports/reports-view';

const empty = { people: [], teams: [], customers: [], policies: [], appointments: [], transitions: [] };
describe('Independent review: observed edge results', () => {
  it('shows a false decrease caused solely by 31 March when viewing April MTD on 30 April', () => {
    const today = d(2027, 4, 30), period = periodOf('month', today);
    const policy = { id: 'p', customerId: 'c', reId: 'r', submittedDate: d(2027, 3, 31), submittedFyp: 100_000_000, issuedDate: null, issuedFyp: null };
    const tiles = kpiTiles({ ...empty, policies: [policy] }, period, { kind: 'all' }, today);
    expect(viewingText({ period, scope: { kind: 'all' } }, today, [], []).mtd).toBe(true);
    expect(comparisonWindows(period, today)!.previous.end).toEqual(d(2027, 3, 31));
    expect(tiles[1]!.value).toBe('0');
    expect(tiles[1]!.delta).toEqual({ tone: 'down', text: '▼ 1' });
    expect(tiles[1]!.note).toContain('31/03');
    expect(tiles[2]!.delta).toEqual({ tone: 'down', text: '▼ 100 tr' });
  });
  it('also compares 28 February against all 31 January days on the last day', () => {
    const today = d(2027, 2, 28);
    expect(comparisonWindows(periodOf('month', today), today)!.previous.end).toEqual(d(2027, 1, 31));
  });
  it('distinguishes no future metrics in report/KPI from zero in an empty-team comparison total', () => {
    const today = d(2026, 10, 4), period = periodOf('month', d(2026, 11, 1));
    expect(reportRows(empty, period, { kind: 'all' }, today).summary.metrics).toBeNull();
    expect(kpiTiles(empty, period, { kind: 'all' }, today).every(tile => tile.value === '—')).toBe(true);
    expect(teamCompare(empty, period, today).total.metrics).toEqual({ submittedCount: 0, caseSize: 0, issuedCount: 0, revenue: 0, rfCount: 0, closeRate: null });
  });
  it('splits the whole supported custom range into contiguous 2412 months', () => {
    const period = customPeriod(d(1900, 1, 1), d(2100, 12, 31));
    const marks = reportMarks(period);
    expect(marks).toHaveLength(2412);
    expect(marks[0]!.start).toEqual(period.start);
    expect(marks.at(-1)!.end).toEqual(period.end);
  });
});
```

### 6.3. C:/workspace/Project-2C-review-2/packages/db/src/phase4.codex.test.ts

SHA256 nguồn: `a322d0e694e217a17a1dabb80e382fb56aa1cc7e9036f122a1f4898726394744`.

```typescript
import { describe, expect, it } from 'vitest';
import { calendarDate, formatVndCompact } from '@p2c/domain';
import { setup, codeOf } from './test-support';
import { createCustomer } from './customers';
import { scheduleAppointment, recordMeetingOutcome, listAppointments } from './appointments';
import { exportBackup, importBackup } from './backup';
import { createPerson } from './team';

describe('Phase 4 backup and valid-name probes', () => {
  it('accepts an expected_case_size of -1 from a backup although the command rejects it', async () => {
    const { db, re } = await setup();
    const date = calendarDate(2026, 9, 1);
    const customer = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date });
    const ap = scheduleAppointment(db, { customerId: customer.id, reId: re.id, date, triggerType: 'REFERRAL' });
    const outcome = { status: 'MET' as const, stageAfter: 'N3' as const, nextStep: 'Next', expectedCaseSize: -1 };
    expect(codeOf(() => recordMeetingOutcome(db, ap.id, outcome))).toBe('INVALID_AMOUNT');
    recordMeetingOutcome(db, ap.id, { ...outcome, expectedCaseSize: 100 });
    const backup = JSON.parse(exportBackup(db));
    backup.tables.appointments[0].expected_case_size = -1;
    const { db: imported } = await importBackup(JSON.stringify(backup), { now: db.now });
    const actual = listAppointments(imported)[0]!.expectedCaseSize;
    console.log('BACKUP_NEGATIVE_CASE_SIZE', actual);
    expect(actual).toBe(-1);
    console.log('BACKUP_NEGATIVE_FORMATTED', formatVndCompact(actual!));
    expect(() => formatVndCompact(actual!)).not.toThrow();
  });
  it('permits an RE name containing 260 Latin characters', async () => {
    const { db, team } = await setup();
    const name = 'a'.repeat(260);
    expect(createPerson(db, { name, role: 'RE', teamId: team.id }).name).toBe(name);
  });
});
```

### 6.4. C:/workspace/Project-2C-review-2/apps/desktop/src/routes/integration.codex.test.ts

SHA256 nguồn: `5783feda039c411828dce6582a2dcd201e8de5fe4a7def7e18a1e9540d16e55e`.

```typescript
import { describe, expect, it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import ExcelJS from 'exceljs';
import { calendarDate as d, periodOf, periodMetrics, type Scope } from '@p2c/domain';
import { listAppointments, listCustomers, listPeople, listPolicies, listStageTransitions, listTeams, openDatabase, seedDemoData } from '@p2c/db';
import { kpiTiles, viewingText } from './overview/overview-view';
import { teamCompare } from './overview/team-compare-view';
import { reportCells, reportRows } from './reports/reports-view';
import { buildReportWorkbook, reportWorkbookMeta } from './reports/report-workbook';

describe('Phase 4 seeded equality / export / performance probes', () => {
  it('matches all six KPI, team/RE totals and numeric Excel cells for a full seed', async () => {
    const today = d(2026, 9, 15);
    const db = await openDatabase({ now: () => new Date('2026-09-15T12:00:00Z') });
    const t0 = performance.now();
    seedDemoData(db, { anchorDate: today, seed: 42 });
    const seedMs = performance.now() - t0;
    const data = { people: listPeople(db), teams: listTeams(db), customers: listCustomers(db), policies: listPolicies(db), appointments: listAppointments(db), transitions: listStageTransitions(db) };
    const period = periodOf('year', today);
    const scopes: Scope[] = [{ kind: 'all' }, { kind: 'team', teamId: data.teams[0]!.id }, { kind: 're', reId: data.people.find(p => p.role === 'RE')!.id }];
    for (const scope of scopes) {
      const rows = reportRows(data, period, scope, today);
      const shown = kpiTiles(data, period, scope, today).map(t => t.value + (t.unitSpaced && t.unit ? ' ' : '') + t.unit);
      expect(shown).toEqual(reportCells(rows.summary).slice(5, 11));
      const { default: Excel } = await import('exceljs');
      const workbook = new Excel.Workbook();
      const bytes = await buildReportWorkbook(rows, reportWorkbookMeta(viewingText({ period, scope }, today, data.people, data.teams), today));
      await workbook.xlsx.load(bytes);
      expect(workbook.worksheets.length).toBe(scope.kind === 'all' ? 4 : scope.kind === 'team' ? 3 : 2);
      const sheet = workbook.worksheets[0]!;
      expect(sheet.getCell(4, 7).value).toBe(rows.summary.metrics!.rfCount);
      expect(sheet.getCell(4, 9).value).toBe(rows.summary.metrics!.caseSize);
      expect(sheet.getCell(4, 11).value).toBe(rows.summary.metrics!.revenue);
      expect(sheet.getCell(4, 12).value).toBe(rows.summary.metrics!.closeRate!.numerator / rows.summary.metrics!.closeRate!.denominator);
      expect(sheet.getCell(4, 9).numFmt).toBe('#,##0');
      expect(sheet.getCell(4, 12).numFmt).toBe('0.0%');
      if (rows.byTeam) expect(rows.byTeam.total.metrics).toEqual(rows.summary.metrics);
      if (rows.byRe) expect(rows.byRe.total.metrics).toEqual(rows.summary.metrics);
      for (const key of ['met','missed','unrecorded','planned','total'] as const) expect(rows.byMark.reduce((s,r) => s+r.appointments[key],0)).toBe(rows.summary.appointments[key]);
      if (scope.kind === 'all') {
        expect(teamCompare(data, period, today).total.metrics).toEqual(rows.summary.metrics);
        writeFileSync('C:/workspace/phase-4-review/seed-export.xlsx', bytes);
      }
    }
    const bench = (fn: () => unknown) => {
      for(let n=0;n<3;n++) fn();
      const samples = Array.from({length:25}, () => {const start = performance.now();fn();return performance.now()-start;}).sort((a,b)=>a-b);
      return { medianMs:samples[12],p95Ms:samples[23],maxMs:samples[24] };
    };
    const result = {seedMs,counts:Object.fromEntries(Object.entries(data).map(([k,v])=>[k,v.length])), periodMetrics:bench(()=>periodMetrics(data,period,{kind:'all'})),reportsYear:bench(()=>reportRows(data,period,{kind:'all'},today)),overviewCompare:bench(()=>teamCompare(data,period,today))};
    writeFileSync('C:/workspace/phase-4-review/benchmark.json',JSON.stringify(result,null,2));
    db.sqlite.close();
  },180_000);
  it('keeps suspicious DB names as string cells and reads the browser export back',async () => {
    const today = d(2026, 10, 4), period = periodOf('month',today);
    const names = ['=1+1','+SUM(A1:A2)','@evil','-123','007','<script>alert(1)</script>','[a-z]+(x)?','😀','東京','a'.repeat(260)];
    const data = { teams:[{id:'t',name:'=Team'}],people:names.map((name,i)=>({id:`r${i}`,name,role:'RE' as const,teamId:'t'})),customers:[],policies:[],appointments:[],transitions:[] };
    const rows = reportRows(data,period,{kind:'all'},today);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await buildReportWorkbook(rows,{period:'Tháng 10',scope:'Toàn bộ',exported:'04/10/2026'}));
    const sheet = workbook.getWorksheet('Theo RE')!;
    for(const [index,row] of rows.byRe!.rows.entries()) {
      const cell = sheet.getCell(index+4,2);
      expect(cell.value).toBe(row.name);expect(cell.type).toBe(ExcelJS.ValueType.String);
    }
    const web = new ExcelJS.Workbook();
    await web.xlsx.load(new Uint8Array(readFileSync('C:/workspace/phase-4-review/web-export.xlsx')));
    expect(web.worksheets).toHaveLength(4);
    expect(web.worksheets[0]!.getCell(1,1).value).toContain('01/11/2026');
    writeFileSync('C:/workspace/phase-4-review/excel-readback.json',JSON.stringify({sheets:web.worksheets.map(s=>s.name),firstRow:web.worksheets[0]!.getCell(1,1).value,suspiciousNames:names.length,cellType:'String'},null,2));
  });
});
```

### 6.5. C:/workspace/Project-2C-review-2/.review-scratch/midnight.mjs

SHA256 nguồn: `c938e872650518e8a34389c054e17186b0bb6c7d3f4b7f2839d92323823e9f96`.

```javascript
import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ timezoneId: 'Asia/Bangkok' });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const excelRequests = [];
  page.on('request', r => { if (r.url().includes('exceljs')) excelRequests.push(r.url()); });
  await page.clock.setFixedTime(new Date('2026-10-31T23:59:00+07:00'));
  await page.goto('http://localhost:4173/#/overview');
  const picker = page.getByRole('group', { name: 'Kỳ thống kê' });
  await picker.waitFor();
  const label = picker.getByRole('status');
  assert.equal(await label.textContent(), 'Tháng 10/2026');
  await page.clock.setFixedTime(new Date('2026-11-01T00:01:00+07:00'));
  await picker.getByRole('button', { name: 'Hôm nay', exact: true }).click();
  console.log('MIDNIGHT_TODAY_BUTTON', await label.textContent());
  assert.equal(await label.textContent(), 'Tháng 10/2026');
  await page.getByRole('link', { name: 'Báo cáo', exact: true }).click();
  await expect(page.getByRole('group', { name: 'Kỳ thống kê' }).getByRole('status')).toHaveText('Tháng 11/2026');
  console.log('MIDNIGHT_AFTER_REMOUNT', 'Tháng 11/2026', 'pageErrors', errors);
  assert.equal(excelRequests.length, 0);
  const waiting = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất Excel', exact: true }).click();
  const downloaded = await waiting;
  console.log('WEB_DOWNLOAD', downloaded.suggestedFilename(), 'excel_chunk_requests', excelRequests.length);
  assert.ok(excelRequests.length > 0);
  await downloaded.saveAs('C:/workspace/phase-4-review/web-export.xlsx');
  assert.equal(errors.length, 0);
} finally {
  await browser.close();
}
```

### 6.6. C:/workspace/phase-4-review/storage.codex.rs

SHA256 nguồn: `56ffa97e55d224a9460dc22df80c4558badfca8a66ab9b045d9e52ef220e7861`.

```rust
#[path = "C:/workspace/Project-2C-review-2/apps/desktop/src-tauri/src/storage.rs"]
mod storage;
use std::{fs, path::PathBuf, sync::{Arc, Barrier}, thread};
fn dir(tag: &str) -> PathBuf {
 let p=PathBuf::from("C:/workspace/phase-4-review/rust-probe-data").join(format!("{tag}-{}",std::process::id()));
 fs::create_dir_all(&p).unwrap(); p
}
#[test]
fn codex_long_valid_name_fails_on_windows() {
 let p=dir("long"); let name=format!("bao-cao_2026-10_re-{}_2026-10-04.xlsx","a".repeat(260));
 let result=storage::write_export(&p,&name,b"whole xlsx");
 println!("LONG_NAME len={} result={:?}",name.len(),result);
 assert!(result.is_err()); assert_eq!(fs::read_dir(p.join("exports")).unwrap().count(),0);
 fs::remove_dir_all(p).unwrap();
}
#[test]
fn codex_concurrent_exports_keep_whole_files() {
 let p=dir("parallel"); let barrier=Arc::new(Barrier::new(8));
 let joins:Vec<_>=(0..8).map(|n| {let path=p.clone(); let b=barrier.clone();thread::spawn(move||{
 b.wait(); let bytes=vec![n as u8;65536]; let file=storage::write_export(&path,"bao-cao.xlsx",&bytes).unwrap();
 assert_eq!(fs::read(&file).unwrap(),bytes); file
 })}).collect();
 let paths:std::collections::HashSet<_>=joins.into_iter().map(|j|j.join().unwrap()).collect();
 assert_eq!(paths.len(),8); assert_eq!(fs::read_dir(p.join("exports")).unwrap().count(),8);
 println!("CONCURRENT_EXPORTS unique=8 whole=8 claim_tmp=0"); fs::remove_dir_all(p).unwrap();
}
#[test]
fn codex_long_directory_with_short_component_succeeds() {
 let root=dir("deep"); let p=root.join("x".repeat(80)).join("y".repeat(80)).join("z".repeat(80));
 let file=storage::write_export(&p,"bao-cao.xlsx",b"whole").unwrap(); assert_eq!(fs::read(&file).unwrap(),b"whole");
 println!("LONG_PATH chars={} succeeded",file.to_string_lossy().len()); fs::remove_dir_all(root).unwrap();
}
```

### 6.7. C:/workspace/Project-2C-review-2/.review-scratch/snapshot.mjs

SHA256 nguồn: `8ce0cbcf2878b09a9f769f4f49daef481eaefa172c028e8920cc56f456699ecb`.

```javascript
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const exe = 'C:/workspace/phase-4-review/exe/Project-2C-595ef7906d1f40a14498831418d47d535998147d/project2c.exe';
const bytes = readFileSync(exe);
console.log('ARTIFACT', JSON.stringify({ path: exe, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') }));
const coverage = JSON.parse(readFileSync('coverage/coverage-final.json', 'utf8'));
for (const [label, part] of [['domain', '/packages/domain/src/'], ['db', '/packages/db/src/'], ['app-data', '/apps/desktop/src/data/'], ['app-shell', '/apps/desktop/src/shell/']]) {
  const counts = { statements: [0, 0], branches: [0, 0], functions: [0, 0], lines: [0, 0] };
  let files = 0;
  for (const [path, value] of Object.entries(coverage)) {
    if (!path.replaceAll('\\', '/').includes(part)) continue;
    files++;
    for (const [key, map] of [['statements', value.s], ['branches', Object.values(value.b).flat()], ['functions', value.f]]) {
      for (const count of Object.values(map)) {
        counts[key][1]++;
        if (count > 0) counts[key][0]++;
      }
    }
    const lines = {};
    for (const [id, statement] of Object.entries(value.statementMap)) {
      const line = statement.start.line;
      lines[line] = Math.max(lines[line] ?? 0, value.s[id]);
    }
    for (const count of Object.values(lines)) {
      counts.lines[1]++;
      if (count > 0) counts.lines[0]++;
    }
  }
  console.log('COVERAGE', label, JSON.stringify({ files, counts }));
}
```

### 6.8. C:/workspace/Project-2C-review-2/.review-scratch/read.mjs

SHA256 nguồn: `a0c93c5ad9b7c6f27973a4ddbe7c8ba96ae71a59efb6e5682258b15cdd0c527f`.

```javascript
import { readFileSync, appendFileSync } from 'node:fs';
for (const arg of process.argv.slice(2)) {
  const [file, fromText, toText] = arg.split(':');
  const lines = readFileSync(file, 'utf8').split('\n');
  const from = fromText ? Number(fromText) : 1;
  const to = toText ? Number(toText) : lines.length;
  console.log('\nFILE ' + file + ' ' + from + '-' + to + ' / ' + lines.length);
  console.log(lines.slice(from - 1, to).map((line, i) => `${i + from}: ${line}`).join('\n'));
  appendFileSync('C:/workspace/phase-4-review/read-ledger.jsonl', JSON.stringify({ file, from, to, lines: lines.length }) + '\n');
}
```


## 7. Cuối phiên — HEAD đúng SHA, không còn thay đổi do review

Kiểm lúc **2026-10-04T19:50:01.531+07:00 UTC+07**, sau khi xóa test/probe tạm. Lệnh có mốc giờ trong `final-state.log` và `evidence.jsonl`.

```text
git rev-parse HEAD (exit 0)
595ef7906d1f40a14498831418d47d535998147d

git status --short (exit 0)
?? .agents/
?? .codex/
?? AGENTS.md

git diff --exit-code (exit 0)
(không có output)

git diff --cached --exit-code (exit 0)
(không có output)

rg temporary tests (exit 1)
(không có output)

port 4173 (exit 0)
PORT_4173_EMPTY
```

`git diff --exit-code` và `git diff --cached --exit-code` đều exit 0. HEAD vẫn đúng snapshot. Không còn `*.codex.test.ts` hoặc `.review-scratch/` do phiên này tạo; Rust harness tạm cũng đã xóa sau khi chép phụ lục. Cổng 4173 trống sau khi dừng đúng server probe do phiên này khởi động.

**`git status --short` không rỗng hoàn toàn:** ba dòng `.agents/`, `.codex/`, `AGENTS.md` là baseline trước review. Không xóa, không thêm gitignore và không dùng exclude để che chúng. Với phần tracked và file tạm của review, trạng thái sạch. Ngoài repo chỉ còn báo cáo, log, dữ liệu bằng chứng và artifact đã yêu cầu.
