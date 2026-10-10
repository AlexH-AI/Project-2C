# KNOWN — deep review Phase 5

Trích nguyên văn mục OPEN và ACCEPTED của `docs/state/review-notes.md` ở SHA `0df3606` (10/10/2026). Phát hiện trùng một dòng dưới đây gắn `KNOWN`, chỉ nêu khi có bằng chứng mới (vd. hậu quả nặng hơn ghi chú). Mục RESOLVED của sổ đã sửa, đọc ở repo nếu cần.

Thêm (không có trong sổ, đã ghi ở `docs/metrics/ai-eval-2026-10-10.md` và `docs/metrics/phase-5.md`):
- Chất lượng output model ở lần eval đầu (R2–R7: E14 con giáp sai, E17 ý "hướng nội" sang `painPoints`, ESOTERIC yếu căn cứ, gợi ý phân bổ ở E12 / E16 / E19): việc sửa prompt qua G5, không phải lỗi code.
- PR vượt ngưỡng kích thước (#416, #444, #462, #469, #474): đã ghi ở `phase-5.md`.
- Quyết định Owner: gói Go hết hạn thì gia hạn, không xử lý ca hết hạn / không ghi mã HTTP riêng (#408); rủi ro chính sách gói Go đã chấp nhận (ADR-0009 W-1 mục 7); dữ liệu giả lập, schema đổi thì nạp lại (R2-02, #402).

## OPEN

Theo task đã có chỗ trong kế hoạch:
- **S-1 / D-1 (probe Codex Sol 02/10):** nhập backup nhận `kyc_versions.hash` sai → tính lại hoặc kiểm hash khi nhập snapshot.
- **S-2 (Đợt 3), phần JS:** ghi muộn trong khoảng chờ backup → thay DB (#96); hai `replace` chồng nhau đóng DB cũ hai lần (#192); chưa có test cho cửa sổ `opening` (#206). Phần Rust (lệnh file chạy tuần tự dưới một khóa, `.tmp` riêng) xong ở T-142 (#376).

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
- Cài đặt (#96, #87): sau một lần lưu lỗi, "Nạp lại" bị từ chối mà không có cách thử lưu lại; hộp 10c thiếu số lượng dữ liệu sắp thay; `backups\` không đọc được thì app coi như lần đầu. NIT (#87): file `.tmp` sót trong `backups\`/`exports\`, listener ném lỗi, dọn thư mục tạm của test Rust.
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
- **G5 chặn nhầm câu thường** (#420, T-165, không chặn; chỉ sửa được qua G5 — code chép đúng `docs/design/phase-5-prompts.md`). Owner cân nhắc khi chạy eval (T-171 #413) hoặc khi lên `prompt_version` sau:
  - Do so bản bỏ dấu: "Hẹn KH **để chốt** lịch" → V3 "dễ chốt" (dễ gặp ở `nextBestActions`, có thể tăng thử lại / REJECTED); "KH **báo mình** sẽ đi công tác" → V4 "bảo minh"; "**khả năng kỹ** thuật" → V3 "khả năng ký"; "**Điểm sơ** bộ" → "điểm số"; "**Nhóm C**-level" → "nhóm c"; "**Chốt được** lịch hẹn" → "chốt được".
  - Do regex V6 `\bkhoản\s+\d+[,]?\s+điều\b`: "Hỏi KH về **khoản 2 điều** kiện vay" khớp vì ranh giới từ ngay sau "điều".
  - Ứng viên sửa: "dễ chốt", "bảo minh" sang "Bỏ dấu: không"; regex khoản–Điều thêm `(?!\s*kiện)` hoặc bắt `\s+\d+` sau "điều".
  - Liên quan (code, không cần G5): `text-match.ts:46–49` `detail` ghi tên mục có dấu thay vì đoạn model đã viết (lần thử lại model có thể không tìm thấy cụm) → trả `regex.exec(...)[0]`; `validator.ts:190` mục trùng phần nhau sinh hai issue cho một chỗ ("PRUDENTIAL" → `prudential` + `prud`).
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
- Mockup `docs/design/mockups/ai.html` (#452, T-180, không chặn): dòng help mẫu 1a / 4a (`:327`, `:800`) vẫn liệt kê "DeepSeek V4 Pro", trong khi `AI_MODELS` và spec §4.2 đã bỏ model này (Owner 09/10/2026). App sinh dòng help từ `AI_MODELS` nên màn thật đúng; mockup G3 đã duyệt nên PR không sửa → bỏ "DeepSeek V4 Pro" khỏi hai dòng ở lần sửa mockup `ai.html` kế tiếp.
- `packages/ai/src/run.ts` (#448, T-178, không chặn): có thể là *Duplicated Code* — `newSessionId` (`run.ts:148`) giống hệt `newPage` (`apps/desktop/src/data/tauri-storage.ts:18`), cùng 128 bit ngẫu nhiên dạng hex qua `crypto.getRandomValues`. Ranh giới `ai → domain + zod` nên `ai` không import được hàm của app → nếu có id ngẫu nhiên thứ ba thì đưa hàm vào `@p2c/domain`, hai nơi dùng chung.
- ChatGPT web ở `ai` / `db` (#455, T-173, không chặn). Gộp vào task sau chạm `packages/ai` / `packages/db` (#465, T-176, chỉ làm NIT ngắt dòng doc comment `aiRule`); chip tên rỗng với `CHATGPT_WEB` đã sửa ở T-174 (#458), không ghi ở đây:
  - Có thể là *Shotgun Surgery*: tập "provider không có model / token" nằm ở `AI_ANALYSIS_NO_MODEL` (`packages/db/src/schema.ts:308`), còn `ai` tự đặt `null` riêng ở `packages/ai/src/web.ts:113` và `packages/ai/src/run.ts:329` (`mock`) → đặt danh sách trong `@p2c/ai/schema` cạnh `AI_ANALYSIS_PROVIDERS`, `db` và `ai` dùng chung.
  - Có thể là *Duplicated Code*: giới hạn 20 000 có hai hằng `MAX_RAW_OUTPUT` (`packages/ai/src/run.ts:255`, `web.ts` dùng để từ chối dán) và `MAX_AI_RAW_OUTPUT` (`packages/db/src/schema.ts:313`) → giữ một hằng trong `@p2c/ai/schema`, `db` import lại.
  - Có thể là *Divergent Change*: `packages/ai/src/prompts/retry.ts` vốn là chữ G5 nguyên văn, nay thêm `checkAnswer` (`:34`) / `nextRetry` (`:47`) (lấy JSON + đếm lần thử) → tách logic sang module riêng (vd. `src/attempts.ts`), `retry.ts` chỉ còn chữ G5.
  - Có thể là *Data Clumps*: cặp `customerId` + `kycVersionId` đi cùng trong `AnalysisRequest` (`run.ts:216`), `AnalysisRow` (`run.ts:225`), `WebSession` (`web.ts:47`), `WebAnalysisRequest` (`web.ts:56`). Chỉ ghi lại, sửa khi có lý do khác.
  - Phạm vi export: `takeAnalysisInput`, `checkAnalysisAnswer`, `analysisOutcome`, `ANALYSIS_PROMPTS`, `MAX_RAW_OUTPUT` (`run.ts:255–293`) export để `web.ts` dùng, nên qua `export * from './run'` (`index.ts:9`) thành API công khai của `@p2c/ai` → đưa vào module dùng chung không re-export từ `index.ts`.
- Mã F trên dòng thời gian (#462, T-168B, không chặn): mã `F{seq}` chưa hiện trên dòng thời gian (`CustomerKyc.tsx`), trong khi ghi chú cuối mockup `ai.html` muốn mã F "ở mọi nơi: Dữ kiện KYC, bằng chứng, dòng thời gian". Issue #410 và spec §6.1 chỉ yêu cầu danh sách dữ kiện; dòng thời gian hiện tách ghi chú và phiên bản thành hai mục, khác mockup `customer.html` → **Owner quyết** có cần Issue riêng không.
- Script eval AI `tools/eval-ai-core.mjs` + `tools/eval-ai.mjs` (#474, T-171, không chặn). Gộp vào lần chạm sau của script (vd. PR sửa sau lần chạy eval đầu của Owner):
  - `eval-ai-core.mjs:409` (`issueLines`) và `:451` (dòng V7 bỏ): `detail` của validator chứa tới 40 ký tự chữ do model viết (V3–V6 `có "…"`, V7 `trường "…" không được phép`), nhưng được ghi thẳng vào file kết quả, không qua `plain()`. Điều này trái quy tắc ở `:365` ("no HTML gets through"): model đề xuất `field` là `</details>…` thì khối `<details>` của ghi chú bị đóng sớm (GitHub lọc script nên không phải XSS) → bọc `plain()` cho `detail` (có thể cả `path`).
  - `eval-ai-core.mjs:180–192` / `:314–318`: `recording` chỉ ghi các câu trả lời có về, nên lần thử 2 lỗi (timeout, 5xx) không được đếm. Khi đó cột "Lần thử" ghi 1 dù đã gọi 2 lần (thời gian có thể tới ~240 s) → đếm cả lần gọi lỗi, hoặc ghi "lần 2 lỗi" trong ô kết quả.
  - `eval-ai-core.mjs:490`: tên prompt `analysis@1`, `discovery@1`, `extraction@1` ghi cứng trong đầu file kết quả, nên G5 tăng version thì file ghi sai prompt đã dùng → đọc từ `ANALYSIS_PROMPTS[mode].version` / `row.promptVersion` (prompt trích xuất thì từ `prompts/extraction.ts`).
  - `eval-ai.mjs:21`: hook `resolve` bỏ qua mọi specifier kết thúc bằng `.\w+`, nên một import không đuôi như `./golden/kyc.fixture` sẽ không được thử thêm `.ts`. Hiện chưa lỗi vì chỉ file test import kiểu đó, còn cây import thật nạp được → thử thêm `.ts` cho cả specifier có dấu chấm khi không trỏ tới file có thật.
  - Có thể là *Duplicated Code* / phụ thuộc ngầm: `eval-ai-core.mjs:443` `noteDetails` tìm chữ ghi chú trong `EVAL_NOTES` toàn cục, trong khi `runEval` nhận `noteSpecs` tiêm vào. Chạy với ghi chú ngoài bộ golden thì `formatReport` ném `TypeError` → giữ `note` trong kết quả của từng ghi chú.


## ACCEPTED

- Panel KYC Intelligence (#439): `BADGE_COLORS` của panel không gộp với `GATE_COLORS` (`CustomerKyc.tsx`) vì mockup tô `PAIN_POINT_ANALYSIS` khác nhau (panel `c-info`, thẻ KYC `c-ok`). Chip theo `provider` đã sửa trong chính #439 (commit `6a3f242`) → comment chuyển đi trên T-174 #433 chỉ còn việc thêm tên "ChatGPT web".

- **DR-43 (Owner quyết 06/10, deep review §11 điểm 5):** HĐ / cuộc gặp MET mang ngày hoặc nhóm trước ngày tạo KH là **nhập bù hợp lệ** — không thêm luật ở lệnh hay khi nhập backup. Câu báo khi MET đổi nhóm bị chặn mang đúng ngày chặn (DR-64, T-144 #378).

- `app-data.ts` `open` (#206, kiểm lại ở T-137 #343): `mine === current || mine === opening` **không** tương đương `mine >= current` khi hai lần mở chồng nhau (hai `replace` chồng nhau, #192): `current` = 1, mở 2 rồi mở 3 (`opening` = 3) → bản 2 không lưu migration của nó, còn `mine >= current` sẽ lưu. Giữ code; cửa sổ `opening` và `replace` chồng nhau xử lý ở S-2.

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
