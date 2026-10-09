# Sổ ghi chú review

> Tách khỏi `HANDOFF.md` ngày 03/10/2026 (#280). Phiên review đóng phase và skill `review-pr` đối chiếu sổ này trước khi ghi một phát hiện là MỚI. Ghi chú review không chặn của PR task ghi vào đây (OPEN), không ghi vào HANDOFF.

Quy tắc (review đóng Phase 3, P-3): ghi chú review không chặn nằm ở đây, chia **OPEN** (còn phải làm), **RESOLVED** (đã sửa, ghi PR), **ACCEPTED** (Owner hoặc spec chấp nhận, không sửa). Khi đóng mỗi phase, kiểm lại từng dòng OPEN trên code và chuyển nhóm. Review sau đối chiếu sổ này trước khi ghi một phát hiện là MỚI. Đối chiếu lần này: `main` `3e84ce8`, 07/10 (đóng Phase 4, sau 22 Issue sửa deep review Phase 1–4 T-138…T-159; lần trước: `1625568`, 05/10). Mã T-d…T-i, S-1, S-2 là task Đợt 2/3 trong báo cáo tổng hợp 30/09 §4; T-j và R2-xx ở báo cáo 02/10 §4–§5.

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
- Panel KYC Intelligence, `apps/desktop/src/routes/customers/ai-panel-view.ts` (#438, T-168A phần 2a, không chặn). Gộp vào lần chạm sau của file: T-176 #440, nếu còn chỗ.
  - `runAfter` dùng nhánh `default` cho `saved` / `blocked` / `discarded`, nên một `kind` mới thêm vào `AnalysisOutcome` vẫn qua typecheck và thành idle → liệt kê từng `kind`, kiểm `never`.
  - `dayAndTime` lấy giờ bằng cách tách chuỗi của `formatLocalDateTime` (phụ thuộc dạng chuỗi) → thêm hàm `dd/mm HH:MM` vào `packages/domain` `period.ts` khi task được sửa domain.
  - Chip: `versions.findIndex(...) + 1` ra "kyc v0" khi không thấy phiên bản, không báo gì. Luật nhập 1 đã ngăn, rủi ro thấp → ném lỗi thay vì 0.
  - Đã chuyển đi: `input_json` không được kiểm khi nhập backup → T-176 #440; chip suy "Mock" từ `model === null` (sai với `CHATGPT_WEB`) → comment trên T-174 #433.
- Panel KYC Intelligence, `apps/desktop/src/routes/customers/KycIntelligence.tsx` (#439, T-168A phần 2b, không chặn). Gộp vào T-167 #408 (lúc có độ trễ thật) hoặc T-168B #410:
  - Trạng thái chạy chỉ nằm trong component (`useState` / `useRef`, `~218`): rời Hồ sơ KH giữa lúc chạy rồi quay lại thì không còn "Đang phân tích…" / Hủy, chỉ thấy nút tắt không lý do tới khi yêu cầu kết thúc (OpenCode: tối đa ~4 phút) → giữ lần chạy ở runner / context app, hoặc hiện lý do khi `busy`.
  - Chưa có test component cho phần nối dây (`~226-240`): effect đưa "Đang hủy…" về idle khi runner nhả `busy`, chốt `running.current === controller`, dòng chạy / lỗi. Repo đã có test `.tsx` (`CustomersScreen.test.tsx`) → test với adapter giữ câu trả lời, viết khi T-167 đổi adapter.
  - Lần chạy lưu REJECTED: panel không báo gì (về idle, vẫn hiện bản ACCEPTED cũ hoặc "Chưa có phân tích") → dòng 2i của T-168B #410.
  - Mùi *Duplicated Code*: `vi.ts` `aiPanel.blocked.KYC_INSUFFICIENT` chép câu `KYC_INSUFFICIENT_MESSAGE` của `domain` (ADR-0008 Q9) mà thẻ Dữ kiện KYC hiện qua `gate.message`; domain đổi câu thì hai nơi lệch.
  - Không sửa: `BADGE_COLORS` của panel không gộp với `GATE_COLORS` (`CustomerKyc.tsx`) vì mockup tô `PAIN_POINT_ANALYSIS` khác nhau (panel `c-info`, thẻ KYC `c-ok`). Chip theo `provider` đã sửa trong chính #439 (commit `6a3f242`) → comment chuyển đi trên T-174 #433 chỉ còn việc thêm tên "ChatGPT web".
- Cài đặt → AI, `apps/desktop/src/routes/SettingsAi.tsx` (#444, T-167 phần 2, không chặn). Gộp vào PR kế tiếp chạm file (dòng ChatGPT web hợp với T-174 #433):
  - Dòng cảnh báo 1g (cấu hình AI đã lưu hỏng, `~65`) khó xóa khi ở Mock: cả khối về mặc định Mock, ô Model / Mức suy luận tắt, bấm lại Mock không phát `onChange` (`~87`) → phải bấm OpenCode rồi Mock; bản web không lưu được gì nên cảnh báo ở lại suốt phiên. Hướng: cho bấm lại lựa chọn đang chọn cũng lưu khi có `problem`, hoặc thêm nút "Lưu mặc định" trên dòng 1g — **cần Owner chọn** nếu thêm nút (mockup 1g chỉ có một dòng chữ).
  - Kết quả "Kết nối được" của lần kiểm trước (`~322`) còn hiện sau khi đổi gói / model / provider, trong khi meta thẻ ghi "theo gói đang chọn" (câu có tên gói đã chạy nên không sai, chỉ dễ đọc nhầm) → đưa `shown` về `idle` khi ba trường đổi (vd. `key` của `ConnectionCard` theo `provider` / `opencodePlan` / `model`).
  - Dòng ChatGPT web ở thẻ "Dữ liệu gửi đi" (`~352`) thiếu phần đầu in đậm **"Phân tích bằng ChatGPT web:"** như mockup 4a → tách `settingsAi.sentChatgptLead` như `sentAnalysisLead` (`~345`); e2e "web mode" kiểm cả câu bằng `toContainText` nên vẫn xanh nếu giữ khoảng trắng.
  - Dòng 1g chỉ có test hàm `problemText`, chưa có e2e trên màn → e2e `asExe` ghi `settings.ai` hỏng (vd. model `gpt-6`) trước khi mở Cài đặt → AI, kiểm `role=note` đúng chữ 1g và mất sau khi chọn lại. #452 (T-180) đã có e2e 1g trên bản web (nhập backup có model `deepseek-v4-pro`, kiểm chữ 1g); còn thiếu phần "mất sau khi chọn lại".
- Mockup `docs/design/mockups/ai.html` (#452, T-180, không chặn): dòng help mẫu 1a / 4a (`:327`, `:800`) vẫn liệt kê "DeepSeek V4 Pro", trong khi `AI_MODELS` và spec §4.2 đã bỏ model này (Owner 09/10/2026). App sinh dòng help từ `AI_MODELS` nên màn thật đúng; mockup G3 đã duyệt nên PR không sửa → bỏ "DeepSeek V4 Pro" khỏi hai dòng ở lần sửa mockup `ai.html` kế tiếp.
- `packages/ai/src/run.ts` (#448, T-178, không chặn): có thể là *Duplicated Code* — `newSessionId` (`run.ts:148`) giống hệt `newPage` (`apps/desktop/src/data/tauri-storage.ts:18`), cùng 128 bit ngẫu nhiên dạng hex qua `crypto.getRandomValues`. Ranh giới `ai → domain + zod` nên `ai` không import được hàm của app → nếu có id ngẫu nhiên thứ ba thì đưa hàm vào `@p2c/domain`, hai nơi dùng chung.
- ChatGPT web ở `ai` / `db` (#455, T-173, không chặn). Gộp vào task sau chạm `packages/ai` / `packages/db` (T-174 #433, T-176 #440 nếu còn chỗ); chip tên rỗng với `CHATGPT_WEB` đã giao T-174 #433, không ghi ở đây:
  - Có thể là *Shotgun Surgery*: tập "provider không có model / token" nằm ở `AI_ANALYSIS_NO_MODEL` (`packages/db/src/schema.ts:308`), còn `ai` tự đặt `null` riêng ở `packages/ai/src/web.ts:113` và `packages/ai/src/run.ts:329` (`mock`) → đặt danh sách trong `@p2c/ai/schema` cạnh `AI_ANALYSIS_PROVIDERS`, `db` và `ai` dùng chung.
  - Có thể là *Duplicated Code*: giới hạn 20 000 có hai hằng `MAX_RAW_OUTPUT` (`packages/ai/src/run.ts:255`, `web.ts` dùng để từ chối dán) và `MAX_AI_RAW_OUTPUT` (`packages/db/src/schema.ts:313`) → giữ một hằng trong `@p2c/ai/schema`, `db` import lại.
  - Có thể là *Divergent Change*: `packages/ai/src/prompts/retry.ts` vốn là chữ G5 nguyên văn, nay thêm `checkAnswer` (`:34`) / `nextRetry` (`:47`) (lấy JSON + đếm lần thử) → tách logic sang module riêng (vd. `src/attempts.ts`), `retry.ts` chỉ còn chữ G5.
  - Có thể là *Data Clumps*: cặp `customerId` + `kycVersionId` đi cùng trong `AnalysisRequest` (`run.ts:216`), `AnalysisRow` (`run.ts:225`), `WebSession` (`web.ts:47`), `WebAnalysisRequest` (`web.ts:56`). Chỉ ghi lại, sửa khi có lý do khác.
  - Phạm vi export: `takeAnalysisInput`, `checkAnalysisAnswer`, `analysisOutcome`, `ANALYSIS_PROMPTS`, `MAX_RAW_OUTPUT` (`run.ts:255–293`) export để `web.ts` dùng, nên qua `export * from './run'` (`index.ts:9`) thành API công khai của `@p2c/ai` → đưa vào module dùng chung không re-export từ `index.ts`.
  - NIT: `packages/db/src/backup-validation.ts:372` dòng doc comment dài 136 ký tự, lệch cách ngắt dòng của khối comment.

Nhắc khi viết `docs/metrics/phase-5.md` (chỉ ghi nhận, không phải việc sửa code):
- PR #444 (T-167 phần 2) vượt ngưỡng kích thước: mã sản phẩm ~600 dòng, tổng diff ~1.090 dòng so với ~400 / ~800 (ADR-0001 phụ lục); PR đã nêu lý do.

## RESOLVED

- **Deep review Phase 1–4** (06/10, `docs/reviews/2026-10-06-deep-review-phase-1-4-tong-hop.md`): 88 vấn đề DR-01…DR-88 sửa hết trừ DR-43 (ACCEPTED), 22 Issue T-138…T-159 (#349–#370) theo §12, PR #372–#386, #388–#394 (07/10). Kéo theo hai ghi chú cũ: `CloseGuard.tsx` có e2e phần nối React (Escape, đóng exe khi lưu lỗi, `e2e/dialog-keyboard.spec.ts`) và dùng `Button` của `@p2c/ui` thay chuỗi class `BUTTON` (T-141 #375).

- Coverage, test, doc comment (T-137 #343): coverage đo cả các file thuần của `routes` (`*-view.ts`, `applied-filter.ts`, `report-workbook.ts`, `stage-chart.ts`) với ngưỡng riêng 99 / 92 / 99 / 99 (phần còn lại của F-08); `database.test.ts` so với `LATEST_SCHEMA_VERSION`; JSDoc `stageSnapshotter` khớp nơi dùng; `markIndexer` kiểm mốc sau bắt đầu sau khi mốc trước kết thúc (`[T1, T3, T2, T4]` giờ ném `RangeError`, có test); doc comment `ErrorBoundary` nói `resetKey` đổi cả khi teams / people đọc lại; e2e escape tên RE trước `new RegExp` (#236); hai file svg có dòng trống cuối (#128).

- Lịch hẹn (T-136 #342): bảng sắp theo ngày rồi giờ (`thenBy` của cột `DataTable`, `compareCellsThen`, cả màn Lịch hẹn lẫn tab của hồ sơ KH); `outcomeChoices` khóa mọi lựa chọn cho lịch `RESCHEDULED`; `caused` của `DeleteAppointmentDialog` là prop tùy chọn; gỡ lặp: `readCaseSize`, `withoutError`, `FailureAlert`, `dateTime` dùng `withTime`. `weekdayOf` / `periodOf('week')` đã dùng chung một phép tính thứ từ trước, không phải sửa.
- Tooling (T-135 #341, PR #344): hook `review-pr-hint.mjs` không còn nhận "issue #N" thành PR (logic ở `tools/review-hint-core.mjs`, có test); `session-end.ps1` chỉ commit `-Paths`, không `git add -A` (R4); `merge-pr.mjs --owner` để comment "Merged on Owner request" trên PR (P-1); dòng T-116 của bảng "Sửa cục bộ" ghi đã bị dòng T-122 thay (#297).
- Đóng Phase 4 (05/10), ghi chú không chặn của PR sửa Phase 4: lịch đã qua còn Đã lên lịch ghi "Chưa ghi kết quả" cả ở phụ đề Hẹn tiếp / Dời lịch / Xóa lịch và timeline KYC (phần "Chưa làm" của PR #328 → T-133 #336, PR #338); dòng "Đã xuất báo cáo" so kỳ / góc nhìn theo giá trị (`sameSelection`) và `setBusy` trong `finally` (review #327), `updatePerson` + luật 5 nhập backup dùng `REVIEWER_ROLES` (review #330), thông báo `RangeError` kỳ Tùy chọn đọc `CUSTOM_RANGE_MAX_MONTHS` (review #331) → T-134 #337, PR #339.
- Review đóng Phase 4 (04/10), sửa trước G7 (bảng §2 của `docs/reviews/2026-10-04-phase-4-tong-hop.md`): P1 so với kỳ trước ở ngày cuối kỳ (T-125 #317, PR #325); P2 nửa đêm — ngày của app đi theo đồng hồ ở mọi màn (T-126 #318, PR #334); P3 / P4 slug ≤ 60, câu lỗi theo bước, thông báo sau Lọc — ba ghi chú review #316 (T-127 #319, PR #327); P5 `expected_case_size` ≤ 0 khi nhập backup, phần sót của F-01 (T-128 #320, PR #326); P6, P9–P11 dọn hiển thị (T-129 #321, PR #328); P7 trần kỳ Tùy chọn 3 tháng (T-130 #322, PR #331) và Theo mốc một lượt (T-131 #323, PR #332); đổi D9 người đánh giá chỉ IS / TL / BDM / BD (T-132 #329, PR #330).
- Review đóng Phase 4 (04/10): T-f / F-14 — `MAX_YEAR = 2100`, `canShift` tắt ‹ ›, `addDays` kiểm miền và ném `RangeError` thay `NaN` (#256, PR #300); T-i / F-18 — `stage-chart.ts` escape mọi chuỗi qua `encodeHtml`, có test (PR #312); `Overview.tsx` lấy hôm nay qua `useAppData().today()` (PR #309; phần ngày cũ khi app mở qua nửa đêm → T-126 #318).
- T-h phần 2 (F-13, F-15, F-19 phần `t()`, R2-03, R2-04, R2-05): "Lưu kết quả" khi chưa chọn trạng thái báo "Chọn trạng thái."; `·` / `→` qua `sep.*` + `joinParts`, `lint:tokens` chặn phân cách cứng; `t()` chỉ đọc tên riêng của params (`Object.hasOwn`) và nhóm nghìn số ở ô đếm (`COUNT_SLOTS`, test bắt ô mới chưa phân loại); `eslint --max-warnings 0`; `CARD` dùng chung từ `appointments-view.ts`, thứ tự import `FOCUS` (#259).

- T-h phần 1 (F-11, F-12, F-19 phần `getPolicy`): helper `today(db)` thay 4 chỗ `fromLocalDate(db.now())`; tạo KH, sửa nhóm tay, nộp / phát hành HĐ sau hôm nay → `DATE_IN_FUTURE`, nhập backup kiểm luật 10 (Owner quyết 04/10); câu `error.KYC_PROFILE_FIELD_REQUIRED` và test phủ `error.*` cho mọi mã UI chạm được; `getPolicy` truy vấn theo id (#258, PR #303).
- T-e (F-06, F-07): `stats.ts` dựng index một lần cho mỗi danh sách đầu vào (`Map` người → team, `Set` lịch chuyển RF, `WeakMap`), chữ ký công khai giữ nguyên; `rfCount` lọc phạm vi trước kỳ. Seed: một kỳ toàn bộ 21,6 → 1,3 ms; 12 tháng × 30 RE 374 → 82 ms. `monthToDate` trong `period.ts`, G18 kiểm bằng hàm này (#255, T-099).
- T-j (R2-01, R2-02): nhập backup kiểm thêm luật 1 (transition đầu `appointment_id` null), luật 5 (RE **chưa xóa**), luật 8 (fact `SYSTEM` năm sinh / giới tính `conflict` khớp hồ sơ), luật 9 nhân sự (≤ 1 TL chưa xóa / team; IS/BD/BDM không team; người chưa xóa → team chưa xóa). Lệnh: `TEAM_NOT_ALLOWED` cho IS/BD/BDM có team; `withdrawAppointmentTransition` → `INVALID_TRANSITION` thay lỗi SQLite thô; `resolveKycConflict` so giá trị `SYSTEM` với hồ sơ. Thay ghi chú #231 (IS/BD/BDM có team, TL thứ hai). DB dev có dữ liệu sai: nạp lại dữ liệu giả lập (#252, T-096).
- T-d (F-05, R2-06): e2e local giới hạn worker (≤ 4), không dùng lại server cũ ở cổng 4173 (chỉ khi `PW_REUSE=1`), server preview chạy một tiến trình (`e2e/serve.mjs`) nên dừng sạch, `trackConsoleErrors` một chỗ (`e2e/support.ts`), ngưỡng `SLOW` của `seed.test.ts` nâng 60 s → 180 s (#251, T-095).
- Ghi chú #244: `now` gọi `new Date()` hai lần (có thể lệch qua nửa đêm) và không đi qua `clock` → đọc một lần qua `clock` (#245, PR #246).
- `useScope()` chết sau B3 → bỏ (#237, PR #238). Số ngày ô lịch `padStart` → `formatDayOfMonth` / `formatDayMonth` của `domain` (#239).
- `formatCount` tách khỏi `money.ts` → `domain/number.ts`; `": "` cứng ở `SettingsBackup.tsx` → i18n (#185).
- So chuỗi `'RELOAD_UNSAVED_CHANGES'` lặp → `isUnsavedChangesError` (`app-data.ts`).
- Danh sách cột `columns.map(quote).join` lặp ở `backup.ts` → `columnList`.
- `CloseGuard.tsx` cờ `closing` không reset khi `destroy()` lỗi → có `finally` (#125).
- "NẠP LẠI" so `===` không `normalize('NFC')` → `Settings.tsx:81` chuẩn hóa (R4).
- `useDatabase()` chưa có nơi gọi → `CustomerDialogs.tsx` dùng (#96); i18n chèn tham số bằng `.replace` → `t(key, params)` (#96).
- Comment `tauri-storage.ts` "empty only when the file does not exist" → đã sửa đúng (#87). Hai lần xuất trùng tên ghi chung `name.tmp` → claim + hậu tố `-2` (#185, #187–#192).
- Hộp "Nhân sự mới" chọn IS/BD/BDM vẫn giữ team → tự bỏ team (`PersonDialogs.tsx:~95`, e2e `team.spec.ts:159`) (#144).
- R1/R2: sửa kết quả cuộc gặp từng phần (D7) → #166/#170; DB mới hơn app mở im lặng → `SCHEMA_TOO_NEW` (#184).
- Phép tính ngày tự viết ở màn Team → `addDays` (#146); tiêu đề năm cứng trong e2e (#144).
- F-01…F-04 (big review) → #202–#204, #210. Nhãn kỳ, `parseVnd`, bootstrap PS 5.1, CI main (R3/R4) → #105–#110.
- 4 chỗ lệch mockup 5a–5c (#140) → #142. Link "+ Ghi chú KYC từ cuộc gặp này" (6c) → #180. Nút xóa lịch Dự kiến → #173.

## ACCEPTED

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
