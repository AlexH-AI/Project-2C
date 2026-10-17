# KNOWN — deep review Phase 1–6, lượt 2

Dựng ở bước chuẩn bị (kế hoạch `plan.md` §L2.5, §L2.9 bước 4), 17/10/2026, máy `DESKTOP-KDURKJP` (Home PC). Phát hiện trùng một mục dưới đây gắn `KNOWN`, chỉ nêu khi có **bằng chứng mới** (hậu quả nặng hơn ghi chú, đường vào mới).

Ba phần: (1) nguyên văn mục OPEN và ACCEPTED của `docs/state/review-notes.md` ở SHA ghim `4217ed4`; (2) quyết định Owner còn hiệu lực K1–K21; (3) bảng 67 DR6 của lượt 1.

> Sau `4217ed4`, `review-notes.md` chỉ đổi ở PR docs #649 (hai ghi chú không chặn về chữ trong `docs/metrics/phase-6.md:90` và `docs/design/phase-6-hoan-thien.md:252`, và câu "Cờ đo cho lượt 2" nay nói đo lại trên máy chạy lượt 2 thay vì chỉ Office Laptop, như `plan.md` §L2.6). Không đổi gì về code.

---

# Phần 1 — `docs/state/review-notes.md` ở `4217ed4`: OPEN và ACCEPTED (nguyên văn)

### OPEN

Theo task đã có chỗ trong kế hoạch:
- **S-1 / D-1 (probe Codex Sol 02/10):** nhập backup nhận `kyc_versions.hash` sai → tính lại hoặc kiểm hash khi nhập snapshot.

Theo file, gộp vào lần chạm sau cùng file (hoặc T-h nếu còn chỗ):
- `storage.rs` (#196, #192): `explorer_arg` (`~377`) không có `#[cfg(any(windows, test))]` → build ngoài Windows báo `dead_code`; `open_lock_file` dùng `Some(32)` thay hằng `SHARING_VIOLATION`; ngoài Windows closure `map_err` thành identity.
- `backup.ts` (#184): `valueOf` chỉ nhận cột `integer`/`text` (thêm cột `real` sẽ thành `BACKUP_INVALID`); `ORDER BY` dựa vào khóa chính → nên có test mọi bảng có PK. `database.ts`: hai khối `try/catch sqlite.close()` có thể gộp.
- `SettingsBackup.tsx` (#185): nhánh `SCHEMA_TOO_NEW` của hộp 10b chưa có test.
- Đọc bảng dùng chung (#386, T-151, không chặn):
  - `backup.ts` `load`: statement `prepare` của mỗi bảng không `free()`. Hiện không rò vì DB tạm được `export()` rồi `close()` (sql.js giải phóng mọi statement còn mở, kể cả khi `throw invalid()` giữa chừng) → `try { … } finally { insert.free(); }`.
  - `apps/desktop/src/data/tables.ts`: getter lười đọc từ `db` lúc tạo, nên một `Tables` giữ qua `replace` (nạp lại / nhập) rồi mới hỏi bảng chưa đọc sẽ đọc DB cũ đã `close()`. Chưa có đường nào như vậy (màn nhận snapshot mới khi re-render, trước khi DB cũ đóng) → ghi cảnh báo "không giữ qua `await`" vào JSDoc `Tables` / `useTables`.
- Lịch hẹn, ô ngoài tháng / ngoài khoảng là `aria-hidden` nên trình đọc màn hình không đọc số lịch ngày đó (#156).
- Lịch hẹn (#162–#168):
  - #165: mockup tô "RF" màu accent và đưa năm khác xuống dòng giờ, code viết chuỗi phẳng.
  - #163: nhóm trước → sau trong 6a hiện bằng chữ (mockup: badge); hộp 6h hiện thêm "Các lần hẹn trước"; e2e chưa kiểm link "Xem tất cả (n)" khi > 5 lịch.
- Team & nhân sự (#144): `role === 'RE' || role === 'TL'` lặp ở `PersonDialogs.tsx`; lọc theo `reId` lặp ở `staffMetrics` và `personUsage`; "Xóa nhân sự" trong hộp Sửa bỏ thay đổi chưa lưu mà không báo.
- Khách hàng (#141): dòng "Sau khi lưu: N2 → N3" thiếu "· hạ nhóm / lên nhóm" như mockup 5d; khối cảnh báo "Chuyển tay không bao giờ tính RF" hiện cả khi KH đã đóng; `error.INVALID_TRANSITION` chỉ nói "KH đã đóng" dù cũng bắn khi trùng nhóm hiện tại; `CustomerDialogs.tsx:~300` lặp `CLOSED_STAGES.includes` (dùng `!isPipelineStage`); `CustomerProfile.tsx:110` dựng `StageBadge` tay; 3 helper `badge` riêng (`MetFields.tsx:16`, `CustomerDialogs.tsx:42`, `CustomerKyc.tsx:155`) → *Duplicated Code*, T-h.
- `CloseGuard.tsx` (#125): bấm X lúc đang seed "Nạp lại" thì app đóng trước khi lưu bản mới (không mất dữ liệu); không có dấu hiệu "đang lưu" khi chờ `flush()`.
- Cài đặt (#96, #87): sau một lần lưu lỗi, "Nạp lại" bị từ chối mà không có cách thử lưu lại; hộp 10c thiếu số lượng dữ liệu sắp thay; `backups\` không đọc được thì app coi như lần đầu. NIT (#87): listener ném lỗi (`.tmp` sót và thư mục tạm của test Rust: đã sửa ở #620, xem RESOLVED).
- `PeriodPicker.tsx` (R4): ô ngày Tùy chọn báo đỏ sớm khi Tab (áp dụng ở `onBlur` từng ô).
- Review đóng Phase 4 (04/10, P8 / T2):
  - Chart N4–N1 (`packages/ui/src/components/Chart.tsx` `role="img"`, `StageBlock.tsx`) không có số liệu cho trình đọc màn hình → bảng ẩn `sr-only` sinh từ `StageChart.columns` (`aria-describedby`), hoặc ghi chú mockup rằng Báo cáo → Theo mốc là bản dạng bảng.
- Theo mốc một lượt (#332, T-131, không chặn):
  - Mùi *Duplicated Code*: `reports-view.ts` (`reportRows`, Theo mốc) và `stage-view.ts` (`stageBlock`) cùng dựa vào bất biến "mốc sau hôm nay luôn ở cuối" để ghép kết quả với mốc theo chỉ số (`flatMap(… ?? [])` rồi `[index]`). Đúng hiện nay (`countedWindow` / `snapshotDate` chỉ null khi `today < mark.start`), test tương đương trên seed báo đỏ nếu lệch → làm helper khi có nơi thứ ba.
- `public/favicon.svg` (#128) là bản sao `app-icon.svg` → đổi icon phải sửa cả hai.
- `DataTable` (Phase 1): chưa có test `sortable: false` và bảng rỗng; kiểm lại cột Giờ có `tabular-nums` (cột không phải `text` đã có). `cellClass` (#240) chỉ có e2e phủ — repo chưa có công cụ test component (thêm là G4).
- Lưới năm (#247, không chặn):
  - `token-guard.ts:26` regex miễn trừ nhận mọi `style={{ flex: <định danh hoặc số> }}`, kể cả hằng `flex: 1`; doc comment `token-guard.ts:3` dài (NIT);
- `AppointmentsScreen.tsx` (#239, không chặn): nhánh `!pickable` vẫn có thể gắn `bg-period-band` về lý thuyết; `inPeriod` ⇒ `pickable` nên không xảy ra.
- Domain (R3): API `nextKycVersion`; ngày nhanh đầu năm (gợi ý năm trước?).
- Token G3 (R4, Owner cân nhắc): viền ô nhập / mũi tên sắp xếp dưới 3:1.
- Còn lại từ ghi chú chặn nhầm #420 (code, không cần G5; phần G5 đã xử lý ở #516, xem RESOLVED): `text-match.ts` `phrase()` ghi tên mục có dấu vào `detail` thay vì đoạn model đã viết (lần thử lại model có thể không tìm thấy cụm; `pattern()` đã trả `regex.exec(...)[0]`); `validator.ts` mục trùng phần nhau sinh hai issue cho một chỗ ("PRUDENTIAL" → `prudential` + `prud`).
- Hàm ngày còn thiếu trong `packages/domain` `period.ts` (không chặn). Gộp vào task đầu tiên được sửa `packages/domain`:
  - `apps/desktop/src/routes/customers/ai-panel-view.ts:509` `dayAndTime` (#438, T-168A phần 2a) lấy giờ bằng cách tách chuỗi của `formatLocalDateTime` (phụ thuộc dạng chuỗi) → thêm hàm `dd/mm HH:MM` vào `period.ts`.
  - Có thể là *Duplicated Code* (#465, T-176): `packages/ai/src/schema.ts:47` `isoDate` lặp mẫu `try { fromIsoDate } catch` của `validDate` (`packages/db/src/backup-validation.ts:96`). `ai` không import được `db` → thêm `isIsoDate` vào `period.ts` cho cả hai dùng.
- `packages/db/src/backup-invariants.test.ts:824` (#465, T-176, không chặn): ca "13: evidence when the input has no facts list" (`input_json` = `{facts: 'F1, F3'}`) giờ bị schema đầu vào chặn trước đoạn kiểm `evidence`, nên tên ca không còn đúng điều nó kiểm và trùng các ca schema mới → đổi tên (vd. "13: an input that is not an analysis input") hoặc bỏ. Gộp vào lần chạm sau của file.
- Lần chạy AI giữ ở app, `apps/desktop/src/data/ai-jobs.ts` + `apps/desktop/src/routes/customers/use-ai-job.ts` (#468, T-170 phần 1, không chặn). Gộp vào lần chạm sau của hai file (#469 chỉ thêm kiểu `extraction` vào `use-ai-job.ts`, không làm hai mục dưới):
  - `use-ai-job.ts:23` kết quả lần chạy (`ended`) nằm trong component: lần chạy kết thúc **lỗi** (vd. `AI_TIMEOUT`) trong lúc RE ở màn khác thì quay lại panel chỉ thấy idle, không có câu §5.3, không có gì được lưu. Trước #468 cũng vậy (không phải regression) → nếu muốn, `AiJobs` giữ kết quả lỗi tới khi màn đọc.
  - `ai-jobs.ts:48–52` `start` ghi đè job đang có cùng khóa mà không kiểm. Hiện không xảy ra (mọi nút AI tắt khi runner `busy`); nếu một đường gọi `start` trên khóa còn entry `cancelled` thì "Đang hủy…" mất → trả `AI_BUSY` khi khóa đã có job.
- AI trích xuất trên ghi chú KYC, `apps/desktop/src/routes/customers/` (#469, T-170 phần 2, không chặn). Gộp vào lần chạm sau của cùng file:
  - `KycDialogs.tsx:448` `ConfirmFactDialog` (3f): preview `refused` (vd. "ba" cho Số con, hoặc Đánh dấu mâu thuẫn với giá trị trùng giá trị đang có) chỉ làm khung "Sau khi lưu" biến mất, lý do hiện sau khi bấm "Xác nhận dữ kiện" (`INVALID_KYC_VALUE` / `KYC_NO_CONFLICT`) → báo ngay như `KycNoteDialog` (`kycNote.error.refused`).
  - Có thể là *Duplicated Code*: khối đang chạy / đang hủy / lỗi + Thử lại của `KycExtraction.tsx:76–128` lặp markup của panel `KycIntelligence.tsx:351–394` → một `AiJobStatus` nhỏ (running / cancelling / error + retry) dùng chung.
  - `KycExtraction.tsx:55` chọn nhãn "Ghi chú KYC" / "Ghi chú hệ thống" theo việc có nút trích xuất (`button ?`), nên đổi luật nút sẽ đổi nhãn → chọn theo `note.source === 'SYSTEM'`.
  - NIT `KycExtraction.tsx:96`: dấu `:` của "AI đề xuất: <trường>: <giá trị>" viết thẳng trong JSX → đưa cả khuôn câu vào `vi.ts`, `<b>` tách riêng.
  - Có thể là *Duplicated Code* (nhẹ): `comparable` (`extraction-view.ts:80`) và `collapseSpaces` (`packages/ai/src/validator.ts:121`) cùng chuẩn hóa NFC + gộp khoảng trắng; `comparable` còn cắt + chữ thường. Chỉ ghi lại; gộp khi có nơi thứ ba.
- Cài đặt → AI, `apps/desktop/src/routes/SettingsAi.tsx` (#444, T-167 phần 2, không chặn). Gộp vào PR kế tiếp chạm file:
  - Dòng cảnh báo 1g (cấu hình AI đã lưu hỏng, `~65`) khó xóa khi ở Mock: cả khối về mặc định Mock, ô Model / Mức suy luận tắt, bấm lại Mock không phát `onChange` (`~87`) → phải bấm OpenCode rồi Mock; bản web không lưu được gì nên cảnh báo ở lại suốt phiên. Hướng: cho bấm lại lựa chọn đang chọn cũng lưu khi có `problem`, hoặc thêm nút "Lưu mặc định" trên dòng 1g — **cần Owner chọn** nếu thêm nút (mockup 1g chỉ có một dòng chữ).
  - Kết quả "Kết nối được" của lần kiểm trước (`~322`) còn hiện sau khi đổi gói / model / provider, trong khi meta thẻ ghi "theo gói đang chọn" (câu có tên gói đã chạy nên không sai, chỉ dễ đọc nhầm) → đưa `shown` về `idle` khi ba trường đổi (vd. `key` của `ConnectionCard` theo `provider` / `opencodePlan` / `model`).
  - Dòng ChatGPT web ở thẻ "Dữ liệu gửi đi" (`~352`) thiếu phần đầu in đậm **"Phân tích bằng ChatGPT web:"** như mockup 4a → tách `settingsAi.sentChatgptLead` như `sentAnalysisLead` (`~345`); e2e "web mode" kiểm cả câu bằng `toContainText` nên vẫn xanh nếu giữ khoảng trắng.
  - Dòng 1g chỉ có test hàm `problemText`, chưa có e2e trên màn → e2e `asExe` ghi `settings.ai` hỏng (vd. model `gpt-6`) trước khi mở Cài đặt → AI, kiểm `role=note` đúng chữ 1g và mất sau khi chọn lại. #452 (T-180) đã có e2e 1g trên bản web (nhập backup có model `deepseek-v4-pro`, kiểm chữ 1g); còn thiếu phần "mất sau khi chọn lại".
- Mockup `docs/design/mockups/ai.html` (#452, T-180, không chặn): dòng help mẫu 1a / 4a (`:334`, `:809`) vẫn liệt kê "DeepSeek V4 Pro", trong khi `AI_MODELS` và spec §4.2 đã bỏ model này (Owner 09/10/2026). App sinh dòng help từ `AI_MODELS` nên màn thật đúng; mockup G3 đã duyệt nên PR không sửa → bỏ "DeepSeek V4 Pro" khỏi hai dòng ở lần sửa mockup `ai.html` kế tiếp. #632 (T-238) sửa `ai.html` cho DR6-21 / DR6-22 nhưng chưa gộp mục này (ngoài phạm vi Issue #599).
- `packages/ai/src/run.ts` (#448, T-178, không chặn): có thể là *Duplicated Code* — `newSessionId` (`run.ts:148`) giống hệt `newPage` (`apps/desktop/src/data/tauri-storage.ts:18`), cùng 128 bit ngẫu nhiên dạng hex qua `crypto.getRandomValues`. Ranh giới `ai → domain + zod` nên `ai` không import được hàm của app → nếu có id ngẫu nhiên thứ ba thì đưa hàm vào `@p2c/domain`, hai nơi dùng chung.
- ChatGPT web ở `ai` / `db` (#455, T-173, không chặn). Gộp vào task sau chạm `packages/ai` / `packages/db` (#465, T-176, chỉ làm NIT ngắt dòng doc comment `aiRule`); chip tên rỗng với `CHATGPT_WEB` đã sửa ở T-174 (#458), không ghi ở đây:
  - Có thể là *Shotgun Surgery*: tập "provider không có model / token" nằm ở `AI_ANALYSIS_NO_MODEL` (`packages/db/src/schema.ts:308`), còn `ai` tự đặt `null` riêng ở `packages/ai/src/web.ts:113` và `packages/ai/src/run.ts:329` (`mock`) → đặt danh sách trong `@p2c/ai/schema` cạnh `AI_ANALYSIS_PROVIDERS`, `db` và `ai` dùng chung.
  - Có thể là *Duplicated Code*: giới hạn 20 000 có hai hằng `MAX_RAW_OUTPUT` (`packages/ai/src/run.ts:255`, `web.ts` dùng để từ chối dán) và `MAX_AI_RAW_OUTPUT` (`packages/db/src/schema.ts:313`) → giữ một hằng trong `@p2c/ai/schema`, `db` import lại.
  - Có thể là *Divergent Change*: `packages/ai/src/prompts/retry.ts` vốn là chữ G5 nguyên văn, nay thêm `checkAnswer` (`:34`) / `nextRetry` (`:47`) (lấy JSON + đếm lần thử) → tách logic sang module riêng (vd. `src/attempts.ts`), `retry.ts` chỉ còn chữ G5.
  - Có thể là *Data Clumps*: cặp `customerId` + `kycVersionId` đi cùng trong `AnalysisRequest` (`run.ts:216`), `AnalysisRow` (`run.ts:225`), `WebSession` (`web.ts:47`), `WebAnalysisRequest` (`web.ts:56`). Chỉ ghi lại, sửa khi có lý do khác.
  - Phạm vi export: `takeAnalysisInput`, `checkAnalysisAnswer`, `analysisOutcome`, `ANALYSIS_PROMPTS`, `MAX_RAW_OUTPUT` (`run.ts:255–293`) export để `web.ts` dùng, nên qua `export * from './run'` (`index.ts:9`) thành API công khai của `@p2c/ai` → đưa vào module dùng chung không re-export từ `index.ts`.
- Mã F trên dòng thời gian (#462, T-168B, không chặn): mã `F{seq}` chưa hiện trên dòng thời gian (`CustomerKyc.tsx`), trong khi ghi chú cuối mockup `ai.html` muốn mã F "ở mọi nơi: Dữ kiện KYC, bằng chứng, dòng thời gian". Issue #410 và spec §6.1 chỉ yêu cầu danh sách dữ kiện; dòng thời gian hiện tách ghi chú và phiên bản thành hai mục, khác mockup `customer.html` → **Owner quyết** có cần Issue riêng không.
- Script eval AI `tools/eval-ai.mjs` (#474, T-171, không chặn; các mục khác của #474 đã sửa ở #517, xem RESOLVED). Gộp vào lần chạm sau của script:
  - `eval-ai.mjs:21`: hook `resolve` bỏ qua mọi specifier kết thúc bằng `.\w+`, nên một import không đuôi như `./golden/kyc.fixture` sẽ không được thử thêm `.ts`. Hiện chưa lỗi vì chỉ file test import kiểu đó, còn cây import thật nạp được → thử thêm `.ts` cho cả specifier có dấu chấm khi không trỏ tới file có thật.
- `packages/ai` độ bền đầu vào (#521, T-199, review @`4f28b3c` và @`262f71a`, không chặn):
  - `extract-json.ts` (`cut`): khi trả lời bị cắt, một khối JSON đủ nằm sau dấu `{` chưa đóng của lời văn bị bỏ, dù chỗ cắt ở lời văn sau khối (`Ghi chú { chưa đóng. {"a":1} rồi lời văn…` → `CUT_ANSWER`, tốn một lần thử). Khớp chữ spec §6.1; ca hiếm.
  - `apps/desktop/src/routes/customers/ai-panel-view.ts` (`issueLine`): nhận ra "bị cắt" bằng so chuỗi `CUT_ANSWER.detail` đã lưu trong `validator_json`; đổi chữ đó sau này thì dòng cũ hiện "Không có khối JSON hợp lệ". Dữ liệu giả lập nên chấp nhận được (R2-02); đổi chữ thì nạp lại dữ liệu.
  - `run.ts` (`converse`, lần thử lại): message `assistant` có thể rỗng — trả lời rỗng bị cắt (R2-16, Rust gửi `content: ""` + `length`) hoặc `room` = 0 khi đầu vào sát trần 200 000. Rust nhận, nhưng một số backend kiểu OpenAI từ chối `content` rỗng của `assistant` → `AI_HTTP` thay cho thử lại / REJECTED. Chưa kiểm với OpenCode thật → thử một lần ở 6C (lần gọi thật); nếu bị từ chối thì gửi một ký tự giữ chỗ (đổi G5 §1, cần Owner duyệt).
  - `web.ts` (`checkWebAnswer`): kiểm > 40 000 code unit (`TOO_LONG`) chạy trước kiểm rỗng / tin nhắn của app, nên dán lại tin nhắn `web@1` của một hồ sơ rất lớn báo "quá dài" thay cho "Đây là tin nhắn của app…". Cả hai đều không tính lần thử, spec §3.1 mục 3 không ép thứ tự; chỉ khác câu báo. Sửa nếu cần: chỉ xét tin nhắn của app trên các dòng ngắn trước khi từ chối theo độ dài.
- Test của T-200 (#524, review @`73ba89a`, không chặn; mục `e2e/customer-ai.spec.ts:663` đã chuyển sang RESOLVED). Gộp vào lần chạm sau của cùng file:
  - `tools/pr-core.test.mjs:102` (R2-21): regex chỉ nhận đường dẫn `.md` viết thẳng dạng `./` / `../` (import `?raw`, `new URL(…)`); test đọc docs qua `join(root, 'docs/…')` hay `'docs/…'` theo cwd thì lọt, `CODE_DOCS` có thể thiếu file mà PR docs-only bỏ qua CI. Hiện mọi test đọc docs đều dùng hai dạng trên → mở rộng regex (chuỗi bắt đầu bằng `docs/` và kết thúc `.md`) khi có test đọc docs kiểu khác.
- `apps/desktop/src/data/app-data.test.ts:723` (#537, T-214, review @`0c617ec`, không chặn): hai ca S2-4 "a save before failed" (`reloadDemoData` / `importBackup`) chỉ kiểm `rejects.toThrow()`, không kiểm mã `RELOAD_UNSAVED_CHANGES` như test chấp nhận của #536. Bước chuẩn bị đã khẳng định `saves.failed()` nên gần như chắc là đúng nhánh → siết bằng `rejects.toSatisfy(isUnsavedChangesError)` cho hai ca này ở lần chạm sau của file.
- Hai ghi chú không chặn của review PR #539 (T-208, #529, review @`b5bee4d`) — gộp vào lần chạm sau của từng file (`packages/db`; ghi chú `trash.ts:159` đã chuyển sang RESOLVED, ghi chú `test-support.ts:10` chia sang RESOLVED (comment DR-15) và ACCEPTED (ca TR-5)):
  - `packages/db/src/trash.ts:225` (`refs`): mỗi lần `listTrash` đọc toàn bộ bảng teams / people / customers, kể cả khi Thùng rác trống. Nhỏ với dữ liệu hiện tại; nếu số đo nền ở 6C thấy chậm, chỉ đọc các id mà bản ghi xóa trỏ tới.
  - Nhắc khi viết `docs/metrics/phase-6.md`: PR #539 ≈ 969 dòng tổng diff (≈ 434 dòng sản phẩm), vượt ngưỡng ~800 / ~400; PR đã nêu lý do không tách. Ghi vào bảng "Kích thước PR vượt ngưỡng".
- Hai ghi chú không chặn của review PR #541 (T-209, #530, review @`7a48feb`) — gộp vào lần chạm sau của từng file:
  - `e2e/customer-forms.spec.ts:245`: e2e hộp 5f chỉ kiểm số lần tính RF và số ghi chú KYC dạng `\d+`; số chính xác chỉ ghim ở `packages/db/src/counts.test.ts`. Dialog ghép nhầm slot RF / KYC thì e2e vẫn xanh → thêm unit test cho dòng hiển thị, hoặc đọc số KYC từ hồ sơ trong e2e (checklist §2).
  - Có thể là *Primitive Obsession* nhẹ ở `packages/db/src/counts.ts:71`: `rf` đếm **chuyển nhóm** RF còn hiệu lực, còn `isRfAppointment` đếm **cuộc hẹn**; chỉ khớp nhờ bất biến "mỗi cuộc hẹn tối đa một chuyển nhóm còn hiệu lực" của các lệnh (`withdrawAppointmentTransition` trước mỗi lần ghi lại), không có ràng buộc DB. Code chuyển nguyên từ T-208 → `COUNT(DISTINCT t.appointment_id)` để khớp đúng định nghĩa.
- Năm ghi chú không chặn của review PR #543 (T-210, #531, review @`d4e9fa1`) — gộp vào lần chạm sau của từng file (#532 T-211 chạm cùng màn):
  - Lệch mockup chưa ghi ở PR: `apps/desktop/src/routes/trash-view.ts:103` — dòng lịch Đã gặp **bị chặn** hiện "nhóm sau N2", mockup `trash.html` 11a (dòng 28/09 bị chặn) hiện "N3 → N2". Cách làm đúng ghi chú review #539 (`TrashRow` không có nhóm trước cuộc gặp nên không dựng được "N3 → N2"). Nhắc khi review đóng Phase 6 / G3: coi là lệch đã biết, hoặc thêm nhóm trước cuộc gặp vào `listTrash` nếu Owner muốn đúng mockup.
  - `apps/desktop/src/routes/trash-view.test.ts:150`: "mới xóa nhất trên" chỉ test qua việc `filterTrash` giữ thứ tự đầu vào; e2e chỉ có một dòng. Chưa test nào dựng ≥ 2 dòng và kiểm thứ tự do `initialSort: deletedAt desc` của `DataTable` tạo ra → thêm vào e2e của #532 (vd. xóa hai lịch, kiểm dòng mới xóa đứng đầu). "Hiện thêm sau 100 dòng" chỉ test chữ `TRASH_MORE`, cơ chế dựa vào test của `DataTable` ở `packages/ui`.
  - Có thể là *Duplicated Code*: `trash-view.ts:35` `plain` (bỏ dấu cho ô tìm) lặp `appointments/appointment-form.ts:112` (và biến thể ở `reports/report-workbook.ts:228`) → một hàm chung khi chạm lần sau.
  - Có thể là *Mysterious Name*: `vi.ts` `trash.customer.with` dùng slot `{count}` cho số ghi chú KYC cạnh `{appointments}` / `{policies}` (để không sửa `COUNT_SLOTS` ngoài danh sách file) → thêm slot `kycNotes` vào `COUNT_SLOTS` khi #532 chạm `i18n/index.ts`.
  - `apps/desktop/src/routes/SettingsTrash.tsx:46`: `OwnerCell` đặt `key={owner.text}`; phần team của KH là tên team trần nên về lý thuyết có thể trùng chữ phần khác → chỉ cảnh báo key của React. Đổi sang key theo index.
  - Nhắc khi viết `docs/metrics/phase-6.md`: PR #543 ≈ 910 dòng tổng diff (≈ 430 dòng sản phẩm), vượt ngưỡng ~800 / ~400; PR đã nêu lý do không tách. Ghi vào bảng "Kích thước PR vượt ngưỡng".
- Hai ghi chú không chặn của review PR #545 (T-211, #532, review @`a18f09b`) — gộp vào lần chạm sau của file:
  - Có thể là *Mysterious Name*: `apps/desktop/src/routes/trash-view.ts` `restoredWith` (thông báo 11e) dùng khóa `trash.restore.leftAppointments` ("{count} lịch hẹn" của các lịch **còn lại** trong Thùng rác) để đếm lịch **đã về**. Đổi câu "còn lại" sau này sẽ đổi luôn thông báo 11e → một khóa trung tính (vd. `trash.restore.appointmentCount`) dùng cho cả hai.
  - Nhắc khi viết `docs/metrics/phase-6.md`: PR #545 ≈ 811 dòng tổng diff (≈ 444 dòng sản phẩm, gồm doc comment), vượt ngưỡng ~800 / ~400; PR đã nêu lý do (hộp khôi phục cho đủ 5 loại), review không đòi tách. Ghi vào bảng "Kích thước PR vượt ngưỡng".
- Ba ghi chú không chặn của review PR #547 (T-212, #533, review @`b486030`). Gộp vào lần chụp lại ảnh ở 6D hoặc lần chạm sau của file:
  - `e2e/guide/check.guide.ts:7`: 150 KB tính là 150 × 1024 byte. `04-khach-hang-bang.png` = 151 306 byte, chỉ qua khi hiểu KB = 1024 byte (spec §4.3 không nói đơn vị) → ghi rõ "150 KiB" trong comment / spec khi chụp lại; ảnh vượt thì chụp phần trên như `05-ho-so-kh`.
  - `e2e/guide/links.ts:18`: chỉ bỏ code span một dấu backtick; code span mở bằng hai dấu backtick có link bên trong vẫn bị kiểm. Sửa khi #534 hoặc nội dung sau dùng dạng này.
  - Issue #533 ghi "spec chụp ảnh không nằm trong `testDir` của `playwright.config.ts`" nhưng lại chỉ định `e2e/guide/**` (nằm dưới `testDir: 'e2e'`); PR tách bằng đuôi `*.guide.ts` ngoài `testMatch` mặc định nên `pnpm e2e` không chạy. Không cần sửa code; đổi `testMatch` của e2e sang dạng nhận cả `*.ts` sẽ kéo spec chụp ảnh vào e2e.
- Một ghi chú không chặn của review PR #549 (T-213 PR 1/2, #534, review @`30ed95c`). Sửa ở PR 2 của #534 hoặc lần chạm sau của spec: `docs/design/phase-6-hoan-thien.md` §4.3, dòng `01-bat-dau.md` của Mục lục, còn ghi "trạng thái lưu ở góc sidebar", nhưng app không có chỉ báo lưu ở sidebar (chỉ có dải `storage.saveFailed` ở đầu màn khi lưu lỗi và "Lưu lần cuối" ở Cài đặt → Dữ liệu). Hướng dẫn đã tả đúng app → sửa câu spec cho khớp, để lượt kiểm hướng dẫn ở G7 không đối chiếu theo câu cũ.
- Hai ghi chú không chặn của review PR #552 (T-215, #551, review @`cf3f9e5`) — gộp vào lần chạm sau của file:
  - `tools/merge-pr.mjs:12-13`: comment đầu file vẫn ghi lệnh từ chối khi "the latest REVIEW is not PASS for the current head SHA" mà không nhắc ngoại lệ PR chỉ sửa sổ ghi chú → thêm một vế để header khớp `mergeBlockers` (`tools/pr-core.mjs`).
  - `tools/pr-status.mjs:94`: dòng `(review notes only: not needed)` chưa có test (`pr-status.mjs` chưa có file test). PR sổ ghi chú có REVIEW cũ lệch head sẽ in cả "NOT the head: review again before merge" lẫn "not needed" → hơi lẫn, dù verdict bên dưới vẫn đúng; bỏ dòng "NOT the head" khi `isNotesOnly`.
- Một ghi chú không chặn của review PR #554 (T-213 PR 2/2, #534, review @`01ad1c1`). Sửa ở lần chụp lại ảnh 6D hoặc lần chạm sau của file: `docs/user-guide/07-bao-cao.md:51`, `:55` ghi ví dụ mốc "01-06/09 (T3-CN)", "14-20/09 (tới 15/09)" bằng gạch nối `-`, còn app ghép bằng `reports.mark.range` / `reports.mark.weekdays` = `'{from}–{to}'` (gạch ngang `–`) → đổi thành "01–06/09 (T3–CN)", "14–20/09 (tới 15/09)" cho trùng màn.
- Bốn ghi chú không chặn của review PR #566 (T-216, #556, review @`c95ca04`) — gộp vào lần chạm sau của từng file:
  - `tools/load-data.mjs:53`: `--out` tương đối tính từ gốc repo, không từ thư mục đang đứng (comment trong code đã ghi; đường dẫn tuyệt đối và mặc định không bị ảnh hưởng) → ghi thêm vào dòng usage / comment đầu file để người chạy từ thư mục con không tìm nhầm chỗ.
  - `packages/db/src/seed.ts:383` (`fillTrash`): dùng `res[0]!` mà không kiểm `SeedScale`; `teams: 0` hoặc `resPerTeam: 0` kèm `trash: true` ném TypeError. Lệnh không gặp (`LOAD_SCALE` cố định) → kiểm quy mô (≥ 1 team, ≥ 1 RE, `meetingDays` tăng dần) đầu `seedDemoData` nếu có nơi gọi thứ hai.
  - Có thể là *Duplicated Code*: hook `resolve` của `tools/load-data.mjs:19` chép từ `tools/eval-ai.mjs` (cùng lỗi "bỏ qua specifier có dấu chấm" ghi ở mục #474 trên) → tách một module nạp TypeScript dùng chung trong `tools/` (kèm hook `?raw`), sửa lỗi #474 một chỗ cho cả hai lệnh.
  - `packages/db/src/seed-invariants.test.ts:36`: bộ tải quy mô nhỏ chỉ kiểm bất biến trên bản ghi đang dùng (`listCustomers` / `listAppointments` bỏ bản ghi đã xóa); dòng trong Thùng rác chỉ được kiểm gián tiếp qua `listTrash` và kiểm khi `importBackup`. Thêm một ca cho bản ghi đã xóa nếu `fillTrash` đổi.
  - Nhắc khi viết `docs/metrics/phase-6.md`: PR #566 ≈ 835 dòng tổng diff (≈ 272 dòng sản phẩm), vượt ngưỡng ~800 vì thụt lề `describe.each` (`git diff -w` ≈ 560); PR đã nêu. Ghi vào bảng "Kích thước PR vượt ngưỡng".
- Một ghi chú không chặn của review PR #570 (T-226, #569, review @`04fe07b`). Xem lại khi chạm `packages/ai/src/extract-json.test.ts` hoặc khi CI đổi máy: ngưỡng 500 ms của `reads 100 000 characters of %s in one pass` (`:117`) chỉ cao hơn ca bậc hai yếu nhất của bản cũ (`braces in a long text`, 1 224–1 327 ms đo trên hai máy) khoảng 2,4 lần, nên máy nhanh hơn nhiều có thể để riêng ca đó lọt. Bốn ca bậc hai còn lại (6,7–11,4 s) vẫn bắt hồi quy, nên cả bộ vẫn giữ được mục tiêu của Issue → chưa cần sửa; nếu muốn chắc thì tăng độ dài đầu vào của ca đó (thời gian bản cũ tăng theo bình phương, bản mới tăng tuyến tính).
- Bốn ghi chú không chặn của review PR #572 (T-218, #558, review @`a3d67d5`) — gộp vào lần chạm sau của từng file (T-219 #559 dùng probe này; mục `stats.ts:153` đã chuyển sang RESOLVED):
  - `e2e/perf/probe.perf.ts:22`: `PERF_RUNS` không được kiểm; giá trị không phải số hoặc `0` cho `NaN` / `0`, mọi vòng bị bỏ qua và probe vẫn ghi một JSON "hợp lệ" chỉ có `app.open-data` + `memory.js-heap` → dừng khi `!Number.isInteger(RUNS) || RUNS < 1`.
  - `e2e/perf/probe.perf.ts:228` (`importBackup`): nếu `dataset.picked` không được đặt thì `start = NaN`, chốt 60 s không bao giờ kích hoạt và vòng chờ hộp xác nhận treo tới timeout 30 phút. Không xảy ra khi `setInputFiles` phát `change` như bình thường → trả `undefined` khi `start` không phải số.
  - `apps/desktop/src/data/app-data.ts:249`: mỗi lần lưu file DB thêm một `PerformanceMeasure` `p2c:db-save` vào timeline của app thật, không gì dọn; nhỏ nhưng tăng không giới hạn trong một phiên dài. Chấp nhận được; nếu muốn thì probe đọc rồi `performance.clearMeasures('p2c:db-save')`, hoặc app giữ tối đa N mục.
  - Nhắc khi viết `docs/metrics/phase-6.md`: PR #572 ≈ 925 dòng tổng diff (8 dòng sản phẩm, còn lại probe / test / README), vượt ngưỡng ~800; PR đã nêu lý do, review nâng lên `med`. Ghi vào bảng "Kích thước PR vượt ngưỡng".
- Bốn ghi chú không chặn của review PR #620 (T-234, #595, review @`caefe3e`, mức high) — gộp vào lần chạm sau của từng file:
  - `apps/desktop/src/data/app-data.ts` (`openAppData`, nhánh có file): `quickCheck()` chạy trên DB **đã migrate**, không phải file như đang lưu. Migration 0007 dựng lại `ai_analyses` (INSERT…SELECT, `DROP TABLE`, `RENAME`), nên file ở schema ≤ 6 hỏng đúng trong bảng / index cũ đó có thể được migration "che": kiểm ra `ok` và `backup()` chép file hỏng trên đĩa thành backup mới nhất (trái DR-51). Hiện không xảy ra (mọi file ở schema mới nhất, dữ liệu giả lập). Nếu cần chặt: kiểm trước khi migrate (mở với `migrations: []`, hoặc `quick_check` trong `openDatabase` trước `migrate`). Xem lại khi có migration mới hoặc dữ liệu khách hàng thật.
  - `apps/desktop/src/i18n/vi.ts` `close.unsavedBody`: hộp đóng app vẫn nói "file có thể đang bị chương trình khác mở" cả khi lần lưu lỗi vì đĩa đầy (dải lỗi lưu đã có câu riêng `storage.saveDiskFull`) → chọn câu theo `saveError()` như `SaveFailed`.
  - `app-data.ts` `openFrom`: nay luôn `db.export()` thêm một lần; khi có migration, snapshot giống nhau có thể được ghi hai lần (Nạp lại / Nhập). Chi phí nhỏ.
  - Mùi: `storage.rs` `remove_interrupted_backups` lặp vòng của `remove_interrupted_exports` (một helper nhận hàm khớp tên; cùng mục `read_dir` ×3 của DR6-67); `saveError` nằm ở `AppData` cạnh `PersistQueue.failed()` nên `SaveWarning` đọc hai store (PR nêu lý do: `persist-queue.ts` ngoài danh sách file) → đưa lỗi cuối vào `PersistQueue` khi được sửa file đó. `ACCESS_DENIED` gom mọi `PermissionDenied` của `open` (kể cả `project2c.db` là thư mục) — PR đã nêu, chấp nhận.
- Hai ghi chú không chặn của review PR #626 (T-247, #625, review @`6594572`, mức low) — gộp vào lần chạm sau của `e2e/guide/shots.guide.ts`:
  - `shots.guide.ts:30` (hàm `shot`): CSS `header.sticky { position: static !important; }` dựa vào class Tailwind `sticky` của header ở `apps/desktop/src/shell/AppShell.tsx:35`. Header bỏ / đổi class đó thì CSS im lặng hết tác dụng, ảnh phần cao (`06-ai-phan-tich`) lại bị header che dòng đầu mà không test nào báo → dùng `header { position: static !important; }` (app chỉ có một `<header>` sticky) hoặc thêm `data-*` ổn định cho header.
  - NIT `shots.guide.ts:28–29`: comment ghi "a part taller than the window", nhưng điều kiện thật là "phần Playwright phải cuộn tới" (phần thấp hơn cửa sổ nằm dưới nếp gấp cũng bị che) → sửa câu.
- Năm ghi chú không chặn của review PR #628 (T-237, #598, review @`ac486e6`, mức high) — gộp vào lần chạm sau của từng file (điểm "đang thay" của `saveChatGptAnswer` ở ACCEPTED):
  - `packages/ai/src/mock-adapter.ts:99` (`SOMEONE_ELSE`): "con" / "cháu" / "bạn" ở bất kỳ chỗ nào trước cụm trong câu đều bị coi là người khác, nên con của chính KH nêu trước làm rơi dữ kiện của KH: "KH có 2 con, đã kết hôn." → chỉ đề xuất Số con, mất "Đã kết hôn"; "KH đã kết hôn với bạn học cũ, có 2 con." → mất "2 con" (tái hiện bằng bản chép regex chạy Node). Âm tính giả, không đề xuất sai, hợp "Narrow on purpose (CX-A4)" của Mock; e2e không bị ảnh hưởng. Nếu muốn chặt: chỉ coi "con" / "cháu" là người khác khi đi kèm từ chỉ người ("con trai", "con gái"…) hoặc đứng đầu chủ ngữ.
  - `apps/desktop/src/data/ai-analysis.ts:303` (`startChatGptWeb`): chụp `generation` trước các `await` copy / mở trình duyệt nhưng không kiểm lại sau đó. Thay dữ liệu xong đúng trong khoảng đó thì tin nhắn của dữ liệu cũ vẫn được copy, chatgpt.com vẫn mở, còn panel ẩn phiên ngay (mốc lệch) mà không báo. Không ghi sai dữ liệu (lưu trả `discarded`); cửa sổ rất hẹp, đường vào (Back trong lúc Nạp lại) đóng ở T-242 → nếu cần, kiểm `generation` sau `await` và trả `discarded`.
  - `apps/desktop/src/routes/customers/ai-panel-view.test.ts:398`: test "takes kyc v<n> of its chip from the input taken…" gần như hiển nhiên, vì `webChip` không còn nhận danh sách phiên bản; vẫn đúng chữ test chấp nhận của #598. Phần chống lưu vào dữ liệu mới đã có test thật ở `ai-analysis.test.ts`.
  - `packages/ai/CLAUDE.md` (phần viết tay, "File hay tìm", dòng Validator): câu "V1: `text` … đếm độ dài theo NFC" chưa nói đã bỏ `\p{Cf}` và cắt khoảng trắng trước khi đếm (DR6-16, G5 §10.4) → thêm vài chữ ở lần sửa file sau (file đã sát trần ký tự của `codemap`).
  - Mùi: có thể là *Mysterious Name* ở `apps/desktop/src/routes/customers/KycIntelligence.tsx:331` `const [opened, setWeb]` (state tên `opened`, setter tên `setWeb`, còn `web` là giá trị suy ra) → đổi thành cặp tên khớp nhau (vd. `[kept, setWeb]`). `PROMPT_VERSIONS` (`packages/ai/src/schema.ts:294`) chép chuỗi version của `prompts/*.ts` vì `schema.ts` không được import prompt; đã có test giữ khớp (`schema.test.ts`) → chấp nhận.
- Năm ghi chú không chặn của review PR #630 (T-240, #601, review @`03ab435`, mức high) — gộp vào lần chạm sau của từng file:
  - Mùi: có thể là *Duplicated Code* ở `apps/desktop/src/routes/Settings.tsx:70`, `:85-86` và `SettingsBackup.tsx:49-50`: mỗi section giữ thông báo `last` riêng rồi lọc qua `showsNotice` (DR6-45). Một state `{ from, notice }` ở `DataSections` làm cùng việc, không giữ bản ẩn trong từng section, và section thứ ba có thông báo không phải chép lại bộ ba `last` / `showsNotice` / `onNotice`.
  - Mùi: có thể là *Shotgun Surgery* ở `packages/db/src/ai-analyses.test.ts:654-655`: test migration `ai_analyses` gỡ ngược bằng `DROP INDEX` theo tên ba chỉ mục của `0009_lookup_indexes`, nên mỗi migration sau thêm bảng / chỉ mục / trigger lại phải sửa danh sách này trong một test không liên quan → dựng DB cũ bằng `MIGRATIONS.filter((m) => m.id < first)` rồi seed, thay vì gỡ ngược.
  - `packages/ui/src/components/DataTable.tsx:21` (`headerHidden`): JSDoc nói "a column that does not sort", nhưng cột vẫn sắp được thì cờ bị bỏ qua mà không báo (tiêu đề vẫn hiện thành nút sắp) → ghi rõ "chỉ khi `sortable: false`" hoặc ràng bằng kiểu.
  - NIT `apps/desktop/src/routes/SettingsTrash.tsx:166`: `useCallback((db) => listTrash(db), [today])` + `eslint-disable` đưa ngày vào qua một dependency mà callback không đọc (cùng mẫu `revision` của `useQuery`). Đúng hành vi; một lần "dọn" về `useQuery(listTrash)` sẽ làm TR-5 hỏng lại mà chỉ e2e `trash.spec.ts` bắt được → giữ comment, hoặc cho `useQuery` nhận deps.
  - NIT `apps/desktop/src/routes/trash-view.ts:167`, `:172` (`restoreLabel`): `row.owner.customer?.name ?? ''` cho tên nút "… của KH " khi thiếu KH. Khóa ngoại làm trường hợp này không xảy ra; chỉ ghi lại.
- Ba ghi chú không chặn của review PR #632 (T-238, #599, review @`765c1ad`, mức low) — gộp vào lần chạm sau của từng file:
  - `e2e/customer-ai.spec.ts:21` (`lowestContrast`): lớp nền trong suốt một phần đầu tiên bên trong một nhóm có `opacity` bị coi như nền đặc (`paint`, nhánh `color` còn null), và màu computed dạng `color(srgb …)` / `oklab(…)` (Tailwind `bg-x/10`) bị `rgba()` đọc sai số. Panel KYC Intelligence hiện không có trường hợp nào (không class `/<số>` trong `routes/customers`), kết quả khớp số tính từ token (4,81; giả lập trạng thái cũ ra 2,38) → sửa trước khi dùng lại helper ở màn khác: trộn theo `background.a` cả khi chưa có nền bên dưới trong nhóm; chuẩn hóa màu bằng cách vẽ lên canvas 1×1 rồi đọc `getImageData`.
  - `apps/desktop/src/routes/customers/KycIntelligence.tsx:260`: ở trạng thái mờ, khung "Thông tin tham khảo" (viền đứt `border-border-strong`) và thẻ phần tử bên trong (nay cũng viền đứt `border-border-strong`, DR6-21) thành hai lớp viền đứt lồng nhau. Vẫn đọc được; mockup 2h không có khối này nên không lệch mockup. Muốn gọn thì đổi kiểu viền của một trong hai lớp khi mờ (đổi hình thức → G3).
  - NIT `KycIntelligence.tsx:210` (`Analysis`): khi không mờ, class có khoảng trắng thừa ở cuối (`'flex flex-col text-sm '`). Vô hại; bỏ khi chạm file.
- Một ghi chú không chặn của review PR #634 (T-239, #600, review @`c6fb597`, mức low) — gộp vào lần chạm sau của `apps/desktop/src/routes/customers/policy-form.ts`:
  - `policy-form.ts:131-201` (`policyChange`, `monthEffects`): "Ảnh hưởng chỉ số" của hộp 8d chỉ liệt kê FYP nộp / FYP phát hành. Dời ngày nộp / phát hành sang tháng khác cũng chuyển HĐ đó giữa hai tháng trong số đếm "HĐ nộp" / "HĐ phát hành" (`policyMetrics.submittedCount`, `issuedCount`, `packages/domain/src/stats.ts:92`), nhưng hộp không nói. Issue #600 chỉ nêu FYP (tháng cũ −X, tháng mới +X) và mockup 8d chỉ có dòng FYP, nên không chặn. Nếu muốn thêm dòng số HĐ thì phải đổi hình thức hộp 8d (G3), Owner chọn.
- Ba ghi chú không chặn của review PR #636 (T-241, #602, review @`db4ee5a`, mức low) — gộp vào lần chạm sau của từng file:
  - `apps/desktop/src/routes/team/PersonDialogs.tsx:195-200`: RE vừa còn KH / lịch / HĐ vừa là người phối hợp giờ thấy **hai** câu hướng dẫn (`person.inUseHelp` + `person.inUseSupportHelp`). Mẫu 9b (`docs/design/mockups/team.html:158-165`) vẽ đúng ca này (RE, "5 lịch hẹn là người phối hợp") mà chỉ có câu của RE. Cách làm hợp với Issue #602 ("câu hướng dẫn của người phối hợp / người đánh giá là câu riêng"), và câu của RE không nói cách gỡ phần phối hợp, nên không chặn. Nhưng phần "Lệch so với Issue / mockup" của PR chỉ ghi dòng người đánh giá → lượt 2 / G3 xem: giữ hai câu (sửa mẫu 9b) hay chỉ một câu khi người đó là RE.
  - `apps/desktop/src/i18n/vi.ts` `error.PERSON_IN_USE` vẫn chỉ nói về RE ("… Giữ vai trò RE …"), và câu này vẫn tới được với IS / TL. Màn Team đếm từ `listAppointments`, hàm này bỏ lịch của KH đã xóa (`packages/db/src/appointments.ts:114-115`, `c.deleted_at IS NULL`); còn `isPersonInUse` đếm mọi lịch chưa xóa (`packages/db/src/team.ts:256-273`). Vì vậy một IS chỉ đánh giá / phối hợp lịch của KH đã xóa vẫn thấy Xóa bật ở 9b, rồi bị từ chối bằng câu của RE. Khoảng hở đã có từ trước (comment review R1 trên dòng i18n); DR6-26 có nêu câu này, nhưng Issue #602 chỉ giao câu hướng dẫn của hộp. Sửa: tách câu theo vai, hoặc để màn đếm cả lịch của KH đã xóa như lệnh.
  - `apps/desktop/src/routes/customers/KycDialogs.tsx:219-237` (`add()` của hộp 7a): các nhánh lỗi gọi `setErrors({ fact: … })`, nên xóa luôn lỗi Ngày (và lỗi Ghi chú) đang hiện sau Lưu, ngược ý comment `:214` ("The note's own fields keep theirs until they change"). Ví dụ: gõ `3` vào ô Ngày → Lưu (ô đỏ) → bấm "Thêm" khi chưa chọn Trường → lỗi Ngày mất dù ô vẫn sai, tới lần Lưu kế mới hiện lại. Trước PR lỗi Ngày là lỗi sống (`date.error`) nên không mất kiểu này; lỗi Ghi chú thì đã vậy từ trước. Không mất dữ liệu (Lưu vẫn chặn ngày sai). Sửa: `setErrors((prev) => ({ text: prev.text, date: prev.date, fact: … }))` ở bốn chỗ.
- Hai ghi chú không chặn của review PR #638 (T-242, #603, review @`14ebd09`, mức low; mục sau là giới hạn PR đã ghi) — mục đầu làm ở lượt thử tay G7, mục sau Owner chọn:
  - `apps/desktop/src/shell/block-reload.ts` (DR6-34): e2e chỉ kiểm Alt+← / Alt+→ qua `defaultPrevented`, vì Playwright gửi phím vào Edge không làm trang lùi kể cả khi không chặn. Nút chuột Back / Forward thì kiểm được thật (CDP `Input.dispatchMouseEvent`, Edge lùi trang khi không chặn). Chưa thử trên WebView2 của exe thật với chuột 5 nút và phím BrowserBack / BrowserForward của bàn phím → thêm vào lượt thử tay G7: mở hộp 7a (Ghi chú KYC), gõ chữ, bấm Alt+←, Alt+→, nút chuột 4 / 5, phím Back / Forward → hộp còn mở, chữ còn, màn không đổi.
  - Thanh tiêu đề cửa sổ exe vẫn là "Project-2C": Tauri 2 không tự đồng bộ `document.title`, giờ là "tên màn · Project-2C" (`apps/desktop/src/shell/AppShell.tsx`, `useScreenFocus`). Trình đọc màn hình vẫn đọc đúng tên tài liệu. Muốn thanh tiêu đề đổi theo màn thì cần quyền `core:window:allow-set-title` trong `src-tauri/capabilities` để gọi `getCurrentWindow().setTitle()`, hoặc `on_document_title_changed` phía Rust. Cách nào cũng chạm `src-tauri` → mức high, nhãn `build-exe`.
- Sáu ghi chú không chặn của review PR #640 (T-243, #604, review @`01515c5`, mức high, nâng từ `risk:med` vì có migration) — gộp vào lần chạm sau của từng file:
  - `packages/domain/src/text.ts:24` (`normalizeText`): bỏ mọi `\p{Cf}` thì bỏ cả U+200D (ZWJ) và U+200C (ZWNJ), nên tên có emoji ghép (👨‍👩‍👧) được lưu thành các emoji rời. Owner đã chọn đúng luật này ("bỏ `\p{Cf}`", Issue #604) → chỉ xem lại nếu có tên thật dùng emoji ghép: giữ U+200D / U+200C khi nằm giữa hai ký tự nhìn thấy.
  - `packages/domain/src/text.ts:36` (`normalizeNote`): chỉ tách dòng ở CR / LF. U+2028 / U+2029 thuộc `\s` nên bị gộp thành dấu cách, và ghi chú KYC dán từ nguồn dùng hai ký tự này mất xuống dòng (trái quyết định 1 của Owner 16/10: ghi chú giữ xuống dòng) → tách cả ở ` ` / ` `.
  - `packages/db/src/common.ts:56` (`optionalText`: ghi chú / bước tiếp theo của lịch hẹn, lý do dời): vẫn chỉ chặn NUL. Nửa surrogate lẻ được nhận rồi sql.js lưu thành U+FFFD, không báo lỗi, trong khi `cleanText` / `cleanNote` đã trả `INVALID_TEXT`. Ngoài phạm vi DR6-49 (tên / KYC), PR đã nêu → dùng `isStorableText` như `cleanText`.
  - `packages/db/src/backup-invariants.test.ts:867`: nhãn "a KYC note with a line of spaces kept" không khớp dữ liệu. Dữ liệu là dấu cách ở cuối một dòng (`'Du học 2029 \nCon thứ hai'`), không phải một dòng toàn dấu cách → đổi nhãn thành "a KYC note with a space at the end of a line".
  - Mùi: có thể là *Duplicated Code* ở `packages/db/src/customers.ts:119` (`createCustomer`): nhóm được kiểm bằng `requireStage` trong `values` của câu chèn, rồi `appendTransition` → `checkTransition` lại kiểm một lần nữa → kiểm một lần trước khi chèn hàng.
  - `packages/db/src/kyc.ts:389` (`normalizeKycValue` của `db`): gọi `cleanText(value)` chỉ để có `INVALID_TEXT` rồi bỏ kết quả. Hàm này chạy hết các bước chuẩn hóa, sau đó hàm của `domain` lại chuẩn hóa thêm một lần → chỉ kiểm `isStorableText` ở chỗ này.
- Năm ghi chú không chặn của review PR #642 (T-244, #605, review @`b8e23a0`, mức med) — mục `CLAUDE.md:49` / `ci.md` đã chuyển sang RESOLVED, các mục còn lại gộp vào lần chạm sau của từng file:
  - `tools/pr-core.mjs:177` (`mergeBlockers`): `testedBase.slice(0, 7)` ném `TypeError` khi `testedBase` là `null` mà `mainSince` có commit code. Hôm nay không xảy ra vì `loadMainSince` (`tools/pr-status.mjs`) trả `[]` khi chưa có SHA, và JSDoc có ghi → làm chắc bằng `testedBase?.slice(0, 7) ?? '?'`, hoặc bỏ qua `mainSince` khi `testedBase` null.
  - `tools/pr-status.mjs:47` (`loadTestedBase`): PR không còn mở thì trả `null`, nên `pr-status` của một PR code đã merge / đóng in thêm "noted no tested main … gh pr reopen" cạnh "PR is MERGED". Chỉ là nhiễu → chỉ thêm chặn "noted no tested" khi `pr.state === 'OPEN'`.
  - `tools/pr-status.mjs:68` (`loadPr`): `changedFiles` (GraphQL, `gh pr view`) và danh sách file (REST) đọc ở hai lệnh. Có push xen giữa hai lệnh thì báo "Read n of m files" giả. Lỗi theo hướng an toàn (chặn), chạy lại là hết → chỉ ghi lại.
  - `tools/retro-core.mjs:200` (`projectRoots`): khử trùng bằng so chuỗi sau `resolve`. Trên Windows, `CLAUDE_CONFIG_DIR` trỏ `~/.claude` mà khác hoa / thường thì đọc một thư mục hai lần, và mỗi phiên bị đếm hai lần trong báo cáo → so theo chữ thường trên `win32`.
- Ba ghi chú không chặn của review PR #644 (T-245, #606, review @`393ad72`, mức low; mục cuối là giới hạn PR đã ghi) — gộp vào lần chạm sau của từng file:
  - `e2e/perf/stats.ts:154` (`markdownTable`): `percent` vẫn được tính khi `change.base === 0` (ra `Infinity` / `NaN`, rồi bỏ đi). Kết quả in đúng `(—)` → chỉ tính `percent` trong nhánh nền khác 0.
  - `vitest.config.ts:79`: ngưỡng nhánh của `packages/ui/src/**` là 92 (theo số đo, đúng Issue), do hai nhánh chưa có test: `packages/ui/src/token-guard.ts:63`, `packages/ui/src/components/compare-cells.ts:37` → thêm hai ca đó rồi nâng ngưỡng lên 100.
  - `apps/desktop/src/routes/customers/CustomerProfile.tsx:122`, `:248`: việc hồ sơ KH dùng `stageSince` (dòng "từ …" và hộp 5d) chỉ giữ bằng đọc code và e2e; vitest chưa có DOM (thêm là G4), như `cellClass` của `DataTable` ở trên.
- Deep review Phase 1–6 lượt 1 (T-223 #563, tổng hợp `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §8.5), **hoãn sau v1.0** (Owner 15/10, §9 Q5, Q10). Các DR6 khác có Issue sửa #592–#607 (§8.7):
  - **DR6-17 (cần G5):** ký tự vô hình làm lọt V3–V6. `cleanText` của `packages/ai/src/text-match.ts` chạy NFKC **trước** khi bỏ `\p{Cf}`, nên chữ NFD có U+200B chen trước dấu tổ hợp còn NFD sau khi lọc → lọt các mục không so bản bỏ dấu ("KH dễ chốt", "Bảo Việt", "tuổi Tý", "Điều 35"), kể cả nhận diện tin nhắn của app ở `checkWebAnswer` (L·CX-C1). Mẫu V6 `Điều\s+…`, `Luật\s+…`, `khoản\s+… điều` (`blocklists.ts:93-98`) không khớp khi giữa chỉ có U+200B / U+2060 (H·CL-C1). Cần một đợt G5: chuẩn hóa lại sau khi bỏ `\p{Cf}`, khoảng trắng của ba mẫu khớp cả chỗ có ký tự vô hình.
  - **DR6-23 (G5):** bản bỏ dấu khớp nhầm câu thường: "định hướng nơi ở / chuyển hướng nói" → "hướng nội", "định hướng ngoài giờ" → "hướng ngoại", "suy nghĩ định hướng / nghĩ định cư" → "nghị định", "khách nông thôn" → "khách nóng", "sẵn sàng kỹ" → "sẵn sàng ký" (L·CL-C5; 0 / 1 101 câu eval thật). Đợt G5 sau: xét chuyển "hướng nội / hướng ngoại", "nghị định" sang "Bỏ dấu: không" như "nghị quyết".
  - **DR6-24:** chi tiết V1 (`validator.ts`, `schemaDetail`) không nêu dạng đúng (mã `F12`, giá trị enum `PSYCHOLOGY` / `ESOTERIC`) → lần thử lại dễ trượt tiếp thành REJECTED (L·MU-C2). Đổi chữ `detail` đi vào message thử lại G5 §5.
  - **DR6-25:** `zod` bản đầy đủ ≈ 89 KB min (10 % `assets/index.js`, gồm ≈ 17 KB sinh JSON Schema không dùng); `zod/mini` cùng gói ≈ −60 KB nhưng phải đổi cú pháp `packages/ai/src/schema.ts`, `packages/db/src/backup.ts`, `backup-validation.ts` (≈ 120–300 dòng; H·CL-C3, L·CL-F). Lợi vài ms lúc mở app.
  - **DR6-37:** dấu nối / ký hiệu viết cứng trong JSX thay vì `sep.*` / khóa i18n: `CustomerKyc.tsx:84, :153, :245`, `KycDialogs.tsx:115-116, :398`, `AppointmentsScreen.tsx:67, :600-604`, `AppointmentDialog.tsx:234` (`×`), `TeamCompare.tsx:91` (`▾` / `▸`), `SettingsTrash.tsx:55` (`—`) (L·CL-D5, L·CL-E5) → sửa khi chạm file.
  - **DR6-66:** hàm `db` chỉ test dùng (`getAppointment` + `isCustomerLive`, `getPolicy`, `getTeam`, `getPerson`, `markKycVersionMaterial`), `monthToDate` (`period.ts`), bí danh export `liveCustomer` ở `customers.ts`; `PersistQueue.unsaved()`; export không ai import: `markName` (`reports-view.ts`), `AI_LOCAL_ERROR_CODES`, `ConfirmProposal`, `TokenReader`, `ShowMoreFoot`, `TokenViolation`; `class="dark"` của `apps/desktop/index.html` không tác dụng; khóa `birth.error.empty` không tới được; `PLAIN_SLOTS` (`i18n/index.ts`) chỉ test dùng; `useMemo` cột ở `CustomerAppointments.tsx` vô tác dụng vì `onNext` mới mỗi lần render. Bỏ / thu hẹp khi chạm file.
  - **DR6-67 (Duplicated Code):** `update<X>Row` ×5, `nextSeq` theo KH ×5, `find / live<X>` ×6, `yearBefore` (`evidence-level.ts`) ≈ `sameDayYearBefore` (`compare.ts`), số ngày tự làm của `seed.ts` (`DAY_MS`, `dayNumber`) thay hàm của `domain`; hằng class `CARD` / `ALERT` / `LINK` khai lại ở nhiều màn (`appointments-view.ts` đã export `CARD`, `LINK`); 17 cột báo cáo khai ba lần (`ReportTable.tsx`, `report-workbook.ts`, `reportCells`); kiểu "lỗi AI có mã HTTP" ×5 và phép chép `httpStatus` / `serverMessage` ×3; bỏ dấu ×4 (`plain` ×2, `slug`, `fold` của `packages/ai` — chỗ chung đúng là `domain`, bổ sung mục `plain` #543 ở trên); `read_dir(...).into_iter().flatten().flatten()` ×3 ở `storage.rs`.
  - **Cờ đo cho lượt 2:** `app.open-data` trên exe Home PC 279 ms so nền cùng máy 188,5 ms (+48 %, Codex F Home PC; đo thêm 230–283 ms, vẫn dưới 600 ms), chưa quy được nguyên nhân (cùng exe, khác profile WebView2) → lượt 2 đo lại cùng cách trên Office Laptop.

### ACCEPTED

- Ghi chú review #539, ca "TR-5: blocks a policy issued after today" (`packages/db/src/trash.test.ts`, HĐ phát hành 12/10) đỏ khi `TZ=Pacific/Auckland`: Issue #606 (DR6-65) chốt đồng hồ `setup()` chỉ bảo đảm múi giờ UTC−11…+12, Auckland giờ mùa hè (UTC+13) nằm ngoài. PR #644 giữ nguyên ca này, comment DR-15 nêu khoảng bảo đảm. CI và hai máy ở UTC+7.
- Panel KYC Intelligence (#439): `BADGE_COLORS` của panel không gộp với `GATE_COLORS` (`CustomerKyc.tsx`) vì mockup tô `PAIN_POINT_ANALYSIS` khác nhau (panel `c-info`, thẻ KYC `c-ok`). Chip theo `provider` đã sửa trong chính #439 (commit `6a3f242`) → comment chuyển đi trên T-174 #433 chỉ còn việc thêm tên "ChatGPT web".

- **DR-43 (Owner quyết 06/10, deep review §11 điểm 5):** HĐ / cuộc gặp MET mang ngày hoặc nhóm trước ngày tạo KH là **nhập bù hợp lệ** — không thêm luật ở lệnh hay khi nhập backup. Câu báo khi MET đổi nhóm bị chặn mang đúng ngày chặn (DR-64, T-144 #378).

- Review #334 (T-126): `apps/desktop/src/data/today.ts` `untilMidnight` tự tính `new Date(y, m, d + 1)` ngoài `packages/domain` — chỉ ra mili giây cho hẹn giờ, không parse / format; đưa vào `domain` nếu nơi khác cần. Ngày được chọn của màn Lịch hẹn không tự nhảy sang ngày mới qua nửa đêm (Issue #318 "Hệ quả thêm").
- **Owner quyết 30/09 (#171):** lịch Dời lịch không có nút xóa (chuỗi dời, cần quy tắc riêng G1/G2); ô **Giờ** ở hộp 6f giữ; câu "Xóa mềm, khôi phục được" ở 6g giữ — màn "Thùng rác" xếp Phase 6 (xem comment Owner trên #72).
- Hộp lỗi màn hình chỉ hiện `String(error)`, không stack (#206 vòng 1; React 19 tự `console.error` kèm stack).
- `storage.rs`: đường dẫn kết thúc bằng `\` sẽ thành `"…\"` — không xảy ra vì `folder()` luôn trả `…\exports|backups` (#196); `rename` trên Windows ghi đè đích, chỉ tránh nhờ claim (chương trình ngoài tạo trùng tên trong vài ms thì bị ghi đè) (#192).
- Lịch hẹn: chưa có cây Team → RE ở cột trái (góc nhìn dùng bộ chọn chung; "Trong ngày" đảm nhận team → RE); tóm tắt tháng / trigger / chuyển nhóm của mockup là chỉ số Phase 4 (#156/#158). Biến thể "không đổi nhóm KH" của hộp xóa hiện bảng 3 dòng cả cho lịch Hủy / Không đến (#179).
- #227 (PR #240): test unit tùy chọn "`DataTable` gắn class của cột vào ô" thay bằng e2e (`appointments.spec.ts:189`) — mâu thuẫn spec với hạ tầng test, review chấp nhận.
- Hai file ngoài danh sách của #68 (`domain/period.ts` `formatDayMonth`, `db/appointments.ts` `coordinatorsByAppointment`) — Owner ghi nhận (#155).
- Hành vi theo spec, lớp gọi phải tuân (#33, #36, #44, #62):
  - `suggestedQuestions` trả cho mọi hạng mục thiếu ở cả 4 trạng thái (UI quyết định hiện); trường mâu thuẫn xếp theo `KYC_FIELDS`.
  - "Mới nhất" theo thứ tự thao tác, không theo `confirmedDate`; lớp nhập liệu chuẩn hóa kiểu giá trị theo trường.
  - `isRfAppointment` dựa vào `StageTransition.appointmentId` → db/UI luôn tạo transition gắn `appointmentId` khi ghi "nhóm sau cuộc gặp".
  - `markKycConflict` đổi mọi lỗi của `markConflict` thành `KYC_NO_CONFLICT`; chuỗi "Cập nhật KYC dd/mm/yyyy" có ở cả `db/kyc.ts` và `domain/kyc.ts`; ghi chú `SYSTEM` là dữ liệu DB, UI không dịch lại; đổi ngày sinh cùng năm vẫn tạo ghi chú + dữ kiện thay thế, không tạo phiên bản.
- R1: `PERSON_IN_USE` đếm cả KH xóa mềm (câu báo ở T-046); năm > 9999 (gộp vào miền năm T-f).
- ADR-0003 còn nói `/resume` và branch protection — Owner để nguyên (ADR đã Accepted); `CLAUDE.md` và PLAN là bản đúng.
- **DR6-53 (Owner 15/10, deep review Phase 1–6 lượt 1 §8.5):** `ulid` (`packages/db/src/ids.ts`) với đồng hồ trước 1970 cho mã 16–17 ký tự (`time % 32` âm → `charAt` rỗng), mốc 1900 và 1969 trùng phần thời gian (H·MU-A1). Cần đồng hồ máy sai trước 1970; mã vẫn khác nhau nhờ phần ngẫu nhiên → chấp nhận, không sửa.
- **PR #628 (T-237, #598, review @`ac486e6`):** bấm Kiểm tra và lưu trong lúc **đang** thay dữ liệu (Nạp lại / Nhập backup), `saveChatGptAnswer` (`apps/desktop/src/data/ai-analysis.ts:347`) trả `replacing` và giữ phiên, không trả `discarded` như chữ Issue #598 ("đã thay hoặc đang thay (như `analyseCustomer`)"). Kiểm tra và lưu là lệnh ghi do người dùng bấm nên theo S2-2 (spec Phase 6, `docs/design/phase-6-hoan-thien.md:63`), khác câu trả lời AI tới lúc đang thay (S2-3). Không ghi vào dữ liệu khác: đang thay thì `run` từ chối; thay xong thì `generation` đổi → `discarded`, panel bỏ phiên; thay lỗi thì phiên lưu được (S2-4). Review nêu điểm này cho Owner trước khi merge; Owner bảo merge 15/10.

---

# Phần 2 — Quyết định Owner còn hiệu lực (hành vi có chủ ý, không phải lỗi)

K1–K17: `plan.md` §5 (giữ nguyên chữ); K18–K21: `plan.md` §L2.5.

| # | Quyết định | Nguồn |
|---|---|---|
| K1 | Dữ liệu là giả lập: siết luật thì áp ở lệnh + nhập backup, Owner nạp lại; không migration / cảnh báo / UI cho dữ liệu cũ sai. Schema AI đổi thì nạp lại; `db` chỉ import module schema của `@p2c/ai` | R2-02, #402, `CLAUDE.md` |
| K2 | HĐ / cuộc gặp Đã gặp mang ngày hoặc nhóm trước ngày tạo KH là nhập bù hợp lệ | DR-43 (ACCEPTED) |
| K3 | Trần 100 tỷ đồng mỗi số tiền (lệnh + nhập backup); ô tiền nhận "VNĐ", "1tr5", "1 tỷ 2", nhóm nghìn bằng dấu cách | Owner 06/10 |
| K4 | Bảng lớn dùng "Hiện thêm" (100 dòng), không ảo hóa | DR-03, Owner 06/10 |
| K5 | Người phối hợp chỉ TL / IS / BD / BDM; người đánh giá chỉ IS / TL / BDM / BD | ADR-0007, DR-47, D9 |
| K6 | "Lịch hẹn lần n" chỉ đánh số lịch đã gặp; lịch Dời lịch không có nút xóa | DR-67, #171 |
| K7 | Một yêu cầu AI tại một thời điểm; Hủy giữ khóa tới khi Rust xong (≤ 120 s); lỗi key / mạng không tự chuyển Mock | spec Phase 5 §5.2, D-1 |
| K8 | Key chỉ ở Credential Manager, kiểu lưu `Local`; Rust chặn cả dạng escape JSON / URL-encode của key | DR5-25, R2-10 |
| K9 | Gói Go hết hạn: Owner gia hạn, không xử lý / không mã HTTP riêng; rủi ro chính sách gói Go đã chấp nhận | #408, ADR-0009 W-1 mục 7 |
| K10 | Xác nhận lại cùng giá trị giữ phân tích CURRENT, panel ánh xạ mã F cũ; "Nạp lại" giữ Cài đặt → AI; phiên ChatGPT web chờ dán thì nút AI trích xuất của KH đó tắt; nút AI tắt vì bận nơi khác có dòng giải thích | Owner 10/10 (tổng hợp Phase 5 §8) |
| K11 | G5: chặn loại sản phẩm bảo hiểm; không chặn tên ngân hàng / quỹ / mã chứng khoán; nhãn tính cách cho phép trong `personalityNotes`. Không thêm đợt G5 cho chất lượng output E16 / E17 (không vi phạm) | G5 07/10, eval 11/10 |
| K12 | Ra khỏi v1.0: `Project-2C-data`, S-1 (`kyc_versions.hash` khi nhập snapshot — dòng OPEN), gộp backup / xung đột; làm trên hai máy là "bản nhập sau thắng", không cảnh báo khi nhập | spec §4, Owner 11/10 |
| K13 | S-2: khóa mọi lệnh ghi trong lúc thay dữ liệu; xuất không vào hàng đợi; đóng app không chờ (S2-1…S2-6) | spec §4.1 (G2) |
| K14 | Thùng rác: không khôi phục dây chuyền, không xóa vĩnh viễn / tự dọn, không theo góc nhìn, luôn hỏi trước khi khôi phục (TR-1…TR-10) | spec §4.2 (G2 / G3) |
| K15 | Mở app lần đầu ≈ 3–4 s (gần hết là sinh seed demo, drizzle dựng câu SQL) là chấp nhận; ngưỡng là "không chậm hơn exe Phase 4 đo cùng cách, cùng máy"; không tối ưu seed ở v1.0 | #574, `phase-6.md` |
| K16 | Hướng dẫn sử dụng là Markdown + PNG trong repo, không có nút trong app, không PDF / HTML | spec §4.3 |
| K17 | Không phải phát hiện: PR vượt ngưỡng kích thước (ghi ở `docs/metrics/`), cách làm "chỉ Claude, không subagent" (ADR-0001), việc dùng công cụ mới (G4) | ADR-0001, spec §6.3 |
| K18 | Khôi phục cuộc gặp Đã gặp **về như lúc xóa**: cuộc gặp giữ nhóm không ghi chuyển nhóm, không kiểm D10 (E18–E20 của TR-3). Một luật **"nhóm của KH tại ngày cuộc hẹn"** cho ghi / sửa / xóa / khôi phục cuộc gặp và chuyển tay lùi ngày, kèm luật nhập backup (K1: dữ liệu cũ nạp lại, hash `tables` của dữ liệu tải đã đổi) | Owner 15/10 Q1, Q2; spec Phase 6 §4.2, spec Phase 3 §4 |
| K19 | Bàn giao KH (5c) chuyển lịch **Dự kiến** sang RE mới trong cùng transaction; "Hẹn tiếp" (6h) và "Hẹn lần tiếp theo" (6c) lấy RE hiện tại của KH; lịch đã có kết quả và HĐ giữ RE cũ (ADR-0007) | Owner 15/10 Q3; spec Phase 3 §4 dòng `updateCustomerProfile` |
| K20 | Chữ: tên team / nhân sự / KH và giá trị KYC gộp mọi khoảng trắng Unicode thành một dấu cách, bỏ mọi `\p{Cf}`, từ chối UTF-16 hỏng; **ghi chú KYC giữ xuống dòng**, chỉ gộp trong từng dòng; giá trị liệt kê sai → `INVALID_CHOICE`; cùng một hàm ở lệnh, nhập backup và UI | Owner 16/10 (Issue #604) |
| K21 | Các đề xuất còn lại của §9 tổng hợp lượt 1: tiền KYC đọc lại khi `parseVnd` hiểu được, giữ chữ tự do khi không (Q4); NT-TQ-06 theo golden "100%" / "60%" (Q4); V1 / `LAW_NAME` sửa đúng chữ G5, không G5 mới (Q6); STALE mờ mà ≥ AA (Q7); case size chỉ của cuộc gặp Đã gặp gần nhất (Q8); hồ sơ 3 cột ở 1 440 (Q9); phiên bản 1.0.0 (Q12); điểm ghi "Lệch mockup đã biết" của `nghiem-thu-v1.md` (#619) | Owner 15/10 |

---

# Phần 3 — Bảng 67 DR6 của lượt 1

Mô tả đầy đủ: tổng hợp lượt 1 `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §3–§5. **59 DR6 có Issue sửa** vào bảng R của gói kiểm (không báo lại thành phát hiện); **8 DR6 hoãn / chấp nhận** (17, 23, 24, 25, 37, 53, 66, 67) là KNOWN.

Mức: M = Medium, L = Low, N = Nit. "Gói kiểm": gói ghi bảng R cho DR6 đó; gói đầu là gói chính.

| DR6 | Mức | Vấn đề (ngắn) | Quyết định Owner 15/10 | Issue → PR | Gói kiểm |
|---|---|---|---|---|---|
| 01 | M | Khôi phục cuộc gặp giữ nhóm bị D10 chặn khi KH đổi nhóm sau ngày gặp | Sửa (Q1 a, E18) | #592 → #614 | A, E |
| 02 | M | Bàn giao KH: lịch Dự kiến / hẹn tiếp ở RE cũ | Sửa (Q3 a) | #594 → #618 | A, D, E |
| 03 | L | Khôi phục khi đã có chuyển tay cùng ngày | Sửa (Q2, E19) | #592 → #614 | A |
| 04 | L | 6c / 6f lấy nhóm hiện tại làm "giữ nguyên"; dời ngày không kiểm D10 | Sửa (Q2) | #593 → #616 | E, A |
| 05 | L | D7 / chuyển tay lùi ngày qua cuộc gặp giữ nhóm | Sửa (Q2, E20) | #593 → #616 | A |
| 06 | L | DB hỏng một trang vẫn mở, chép thành backup mới nhất | Sửa | #595 → #620 | B |
| 07 | L | Câu lỗi khởi động / lưu sai hướng (file bị giữ, không ghi được, đĩa đầy) | Sửa | #595 → #620 | B |
| 08 | L | `openFrom` lưu bytes chưa migrate | Sửa | #595 → #620 | B |
| 09 | N | `backups\*.db.tmp` sót; thư mục tạm của test Rust | Sửa | #595 → #620 | B |
| 10 | L | Key URL-encode rồi JSON-escape `%` lọt kiểm key | Sửa | #596 → #617 | B |
| 11 | L | `check()` không giới hạn tên model | Sửa | #596 → #617 | B |
| 12 | N | Phiên bản `0.1.0` | Sửa (Q12: 1.0.0) | #596 → #617 | B |
| 13 | L | `crate-type` thừa: +11,5 s mỗi build release | Sửa | #596 → #617 | B |
| 14 | N | `core:default` cấp lệnh thừa; CSP thiếu `base-uri` / `form-action` | Sửa | #596 → #617 | B |
| 15 | L | Phiên ChatGPT web không mang mốc `generation` | Sửa | #598 → #628 | C |
| 16 | L | V1 đếm trên chuỗi còn `\p{Cf}`; `LAW_NAME` miễn KH / RE chỉ chữ hoa | Sửa đúng chữ G5 (Q6) | #598 → #628 | C |
| 17 | L | Ký tự vô hình lọt V3–V6 | **Hoãn sau v1.0** (Q5, cần G5) | — | KNOWN |
| 18 | L | Seed ghi `prompt_version` `@1` | Sửa | #598 → #628 | C |
| 19 | L | Mock trích xuất nhận sai ngữ cảnh | Sửa | #598 → #628 | C |
| 20 | L | Hủy / Thử lại trích xuất làm focus về `body` | Sửa | #603 → #638 | C |
| 21 | L | Bản STALE mờ dưới AA | Sửa (Q7 a, G3) | #599 → #632 | C |
| 22 | N | Chữ cũ "64 token", `ai-eval.md:13`, "200 000" | Sửa | #598 → #628, #599 → #632 (mockup) | C |
| 23 | N | Bản bỏ dấu khớp nhầm câu thường | **Hoãn** (G5 sau) | — | KNOWN |
| 24 | N | Chi tiết V1 không nêu dạng đúng | **Hoãn** | — | KNOWN |
| 25 | L | `zod` bản đầy đủ ≈ 10 % `index.js` | **Hoãn** | — | KNOWN |
| 26 | L | Hộp 9b không đếm người đánh giá | Sửa | #602 → #636 | D |
| 27 | L | Tiền KYC không đọc lại (NT-HS-05) | Sửa (Q4) | #597 → #623 | D |
| 28 | L | Hộp 7d thiếu mã F (NT-HS-08) | Sửa (Q4) | #597 → #623 | D |
| 29 | L | Dòng thời gian thiếu "tính / không tính RF", nhãn "thay đổi quan trọng"; thẻ Lịch hẹn thiếu ô Kỳ | Sửa code; ô Kỳ ghi lệch đã biết | #597 → #623, #607 → #619 | D |
| 30 | L | Hồ sơ 2 cột ở 1 440 × 900 | Sửa (Q9: 3 cột) | #597 → #623 | D |
| 31 | L | Tạo KH cho RE ngoài góc nhìn không báo | Sửa | #602 → #636 | D |
| 32 | L | Đổi team không đưa bảng về 100 dòng | Sửa | #602 → #636 | D |
| 33 | L | Lỗi form: ô Ngày 7a, Giới tính, nút Xóa team / nhân sự | Sửa | #602 → #636 | D |
| 34 | L | Back chuột / Alt+← khi hộp mở: mất bản nháp | Sửa | #603 → #638 | D |
| 35 | L | Đổi màn / nút tự gỡ làm mất focus | Sửa | #603 → #638 | D |
| 36 | N | Lệch mockup nhỏ của D chưa ghi | Ghi lệch đã biết | #607 → #619 | D |
| 37 | N | Dấu nối / ký hiệu cứng trong JSX | **Hoãn** (lần chạm sau) | — | KNOWN |
| 38 | L | Ngày điền sẵn đọc lại theo năm mới qua giao thừa | Sửa | #600 → #634 | E |
| 39 | L | Case size "cuộc gặp gần nhất" lấy số cuộc gặp cũ | Sửa (Q8 a) | #600 → #634 | E |
| 40 | L | Sửa HĐ: "khác FYP nộp" so FYP đã lưu | Sửa | #600 → #634 | E |
| 41 | L | Đổi tháng phát hành / nộp không hiện "Ảnh hưởng chỉ số" | Sửa | #600 → #634 | E |
| 42 | L | Ghi kết quả kèm hẹn tiếp không chuyển tới lịch mới | Sửa | #600 → #634 | E |
| 43 | L | Thùng rác: sắp cột "Bản ghi", nút không `aria-label`, không tính lại khi sang ngày | Sửa | #601 → #630 | E |
| 44 | L | `listTrash` tuyến tính theo KH đã xóa, thiếu chỉ mục | Sửa (migration `0009`) | #601 → #630 | E, A, F (đo) |
| 45 | L | Cài đặt → Dữ liệu: hai thông báo cùng hiện | Sửa | #601 → #630 | E |
| 46 | L | "Đang xem" kỳ Năm thiếu "·" (NT-TQ-22) | Sửa (Q4) | #597 → #623 | E |
| 47 | N | Cách viết tỉ lệ chốt (NT-TQ-06) | Docs: giữ golden, sửa NT-TQ-06 (Q4) | #607 → #619 | E |
| 48 | N | Lệch mockup nhỏ của E chưa ghi | Ghi lệch đã biết | #607 → #619 | E |
| 49 | L | `cleanText` chỉ NFC + trim (khoảng trắng / ký tự vô hình / surrogate) | Sửa (+ K20) | #604 → #640 | A |
| 50 | L | Nhập backup nhận mâu thuẫn KYC hai giá trị trùng | Sửa | #604 → #640 | A |
| 51 | N | Enum sai → lỗi `CHECK` thô | Sửa (`INVALID_CHOICE`) | #604 → #640 | A |
| 52 | N | CHECK `people` không giữ "IS / BD / BDM không có team" | Sửa (migration `0010`) | #604 → #640 | A |
| 53 | N | `ulid` với đồng hồ trước 1970 | **Chấp nhận** (ACCEPTED) | — | KNOWN |
| 54 | N | Golden L-09 và comment trái DR-47 | Ghi chú golden (G2) + sửa comment | #607 → #619, #604 → #640 | A |
| 55 | L | Script eval có thể ghi key vào file kết quả | Sửa | #605 → #642 | F |
| 56 | L | Script eval bỏ `finish_reason` / `content: null` + `length` | Sửa | #605 → #642 | F |
| 57 | L | Cổng merge: Re-run CI dùng SHA cũ; `files` chỉ 100 | Sửa (cổng "tested base") | #605 → #642 (+ #646) | F |
| 58 | L | `retro.mjs` bỏ `CLAUDE_CONFIG_DIR` | Sửa | #605 → #642 | F |
| 59 | L | Test hở gói A (`kycHash`, M15, M10, N19) | Thêm test | #606 → #644 | A |
| 60 | L | Test hở gói B (RS4 / R8, RS9, MJ15, A14, `sync_all`, J5) | Thêm test | #595 → #620, #596 → #617, #606 → #644 | B |
| 61 | L | Test hở gói C (`LAW_NAME`, trần TS ↔ Rust, V4 / V6 `personalityNotes`) | Thêm test | #598 → #628 | C |
| 62 | L | Test hở gói D (X5, X6, BR3 / BR4, `coverage.include`, D6) | Thêm test | #606 → #644 | D |
| 63 | L | Test hở gói E (`restoreRow` HĐ, AV8) | Thêm test | #606 → #644 | E |
| 64 | L | Test hở gói F (P3, P5, S3, S9) | Thêm test | #605 → #642 | F |
| 65 | N | KNOWN có bằng chứng mới: `tables.test.ts` theo múi giờ, `+Infinity%`, "1984" | Sửa test / comment; ca TR-5 Auckland ACCEPTED | #606 → #644 | F |
| 66 | N | Export / hàm chỉ test dùng | **Hoãn** (dọn khi chạm file) | — | KNOWN |
| 67 | N | Code lặp ≥ 3 nơi | **Hoãn** (dọn khi chạm file) | — | KNOWN |

Đếm: 2 M · 48 L · 17 N = 67 (khớp tổng hợp lượt 1 §1). Có Issue sửa: 59; hoãn: 7 (17, 23, 24, 25, 37, 66, 67); chấp nhận: 1 (53).
