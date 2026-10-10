# Deep review Phase 5 — Gói D (UI) — Muse (MS)

- SHA ghim: `0df3606fb783cc89b1b9c413c02810340e273a4f` (`git rev-parse HEAD` đầu phiên khớp `0df3606`; cuối phiên kiểm lại: không đổi).
- Worktree: `C:\workspace\Project-2C-review-2` (detached HEAD, chỉ đọc; không sửa/commit file repo).
- git status đầu phiên và cuối phiên (giống nhau):
  - `?? .agents/`, `?? .codex/`, `?? AGENTS.md`, `?? opencode.json`
- Nguồn đúng: spec `docs/design/phase-5-ai.md`, `docs/design/phase-5-prompts.md` (G5), mockup `docs/design/mockups/ai.html` + `customer.html` + `appointments.html` (G3), `docs/golden/ai-eval.md`, ADR-0009 (D-1, G5, W-1), `CONTEXT.md`. Spec/golden mâu thuẫn code thì code sai.
- Ghi chú môi trường: sandbox của phiên chặn ghi file ngoài workspace, nên (1) báo cáo này ghi một lần cuối phiên thay vì ghi dần; (2) probe tạm chạy từ một file `.test.ts` trong repo rồi **xóa ngay sau khi chạy** (nguồn giữ ở Phụ lục A và file kèm `muse\D\zz-msd-probe.test.ts`); `git status` cuối phiên đã kiểm lại: sạch như đầu.

## 1. Phạm vi đã đọc (ở SHA trên)

Đọc toàn bộ (dòng 1 → hết file):

- `apps/desktop/src/data/ai-analysis.ts` (1–304), `ai-jobs.ts` (1–76), `ai-tauri.ts` (1–75)
- `apps/desktop/src/routes/customers/use-ai-job.ts` (1–48), `ai-panel-view.ts` (1–521), `KycIntelligence.tsx` (1–445), `KycWebSession.tsx` (1–172), `KycHistory.tsx` (1–154), `KycExtraction.tsx` (1–134), `extraction-view.ts` (1–83)
- `apps/desktop/src/routes/SettingsAi.tsx` (1–357), `settings-ai-view.ts` (1–107)
- `apps/desktop/src/routes/appointments/AppointmentAi.tsx` (1–81), `appointment-ai-view.ts` (1–41)
- Chỗ nối vào: `customers/CustomerKyc.tsx` (1–284), `customers/kyc-view.ts` (1–235), `customers/KycDialogs.tsx` (1–490, hộp 3f `ConfirmFactDialog` ở 412–490), `customers/CustomerProfile.tsx` (1–263), `i18n/index.ts` (1–132), `packages/ui/src/components/Dialog.tsx` (1–82), `packages/ui/src/components/TextField.tsx` (1–81)
- Test vùng gói: `ai-analysis.test.ts` (1–677), `ai-jobs.test.ts` (1–100), `ai-tauri.test.ts` (1–102), `ai-panel-view.test.ts` (1–787), `extraction-view.test.ts` (1–137), `appointment-ai-view.test.ts` (1–120), `settings-ai-view.test.ts` (1–123)
- Tài liệu: `CONTEXT.md`, `docs/design/phase-5-ai.md` (1–430), `docs/design/phase-5-prompts.md` (1–345), `docs/golden/ai-eval.md` (1–120), `docs/decisions/0009-ai-copilot-provider-va-guardrail.md` (1–82), `apps/desktop/CLAUDE.md`, `docs/design/mockups/ai.html` (1–996), `common/plan.md`, `common/baseline.md`, `common/known.md`, `common/build-web.log`, `common/prompt-muse.md`

Đọc một phần / tìm kiếm (đối chiếu seam, không review sâu vì thuộc gói khác):

- `apps/desktop/src/i18n/vi.ts`: toàn bộ key AI (`aiPanel.*` ~122–221, `aiError.*` 223–234, `settingsAi.*` 239–312, `extraction.*` 367–379, `kycConfirm.*` 380–385, `appointments.ai.*` 522–524) + tìm chuỗi vắng mặt cho MS-D2
- `apps/desktop/src/data/app-data.ts`: 290–381 (store AI, `run`, `replace`, `revision`) + tìm `ai|Ai`
- `packages/ai/src/run.ts`: 25–174, 240–394 (kiểu `Failed`/`AnalysisResult`, `busy`, `checkConnection`); `schema.ts`: 37–44 (`factCode`); `errors.ts`: 27–43 (`AiError`)
- `packages/db/src/ai-analyses.ts`: tìm thứ tự sắp xếp (`ORDER BY seq DESC`, dòng 270)
- `docs/design/mockups/customer.html`: 383–467 (panel CURRENT); `appointments.html`: 415–456 (khối AI)
- e2e: chỉ đọc tên test trong `customer-ai.spec.ts` (6), `customer-ai-web.spec.ts` (5), `settings-ai.spec.ts` (6) để đối chiếu phủ test (thuộc gói E)

## 2. Phát hiện

```
ID: MS-D1
Mức: Medium
Trục: C
Vị trí: apps/desktop/src/data/ai-analysis.ts:139-144, :213-218; apps/desktop/src/routes/customers/ai-panel-view.ts:186-199, :212-226; apps/desktop/src/routes/customers/KycIntelligence.tsx:388-395; apps/desktop/src/routes/customers/KycExtraction.tsx:119-128; apps/desktop/src/i18n/vi.ts:230 (0df3606)
Tình trạng: CONFIRMED
Mô tả: Panel KYC Intelligence và AI trích xuất hiển thị lỗi AI_HTTP chỉ là câu chung "OpenCode báo lỗi.", làm mất mã HTTP và thông điệp server mà spec §5.3 và mockup 2l yêu cầu, dù dữ liệu có sẵn ở runtime.
Tái hiện / bằng chứng: probe tạm (nguồn ở Phụ lục A; lệnh `pnpm vitest run apps/desktop/src/routes/customers/zz-msd-probe.test.ts`, file đã xóa sau khi chạy) cho adapter từ chối `AiError('AI_HTTP', {httpStatus: 502, serverMessage: 'Bad gateway'})`. Kết quả thật:
  outcome = {"kind":"error","code":"AI_HTTP","httpStatus":502,"serverMessage":"Bad gateway"}
  runAfter = {"phase":"error","error":"AI_HTTP"}
  panel renders = "OpenCode báo lỗi."
  Chuỗi runtime giữ đủ chi tiết vì `analyseCustomer` trả nguyên `result` của `runAnalysis` (`packages/ai/src/run.ts:247-252`, `Failed` ở :36-41 mang `httpStatus?`/`serverMessage?`, giữ ở :161-173; `ai-tauri.ts` cũng giữ — có test). Nhưng kiểu `AnalysisOutcome`/`ExtractionOutcome` nhánh error chỉ khai `code`, `runAfter`/`panelError` chỉ giữ `code`, panel/trích xuất render `t('aiError.AI_HTTP')` — câu này không có chỗ cho status/message. Trong khi đó cùng một lỗi ở Cài đặt → Kiểm tra kết nối lại hiện đủ qua `errorText` (`settings-ai-view.ts:75-84`, có test: "OpenCode báo lỗi (HTTP 502): Bad gateway").
Ảnh hưởng: RE và người hỗ trợ không thấy mã HTTP thật khi OpenCode lỗi ở màn làm việc chính; muốn biết phải tái hiện ở Cài đặt → AI → Kiểm tra kết nối. Liên quan T-164 (Owner cần đọc mã thật khi gói hết hạn / hết credit).
Đề xuất: mở rộng nhánh error của `AnalysisOutcome`/`ExtractionOutcome` với `httpStatus?`/`serverMessage?` (theo mẫu `AiFailure` ở `settings-ai-view.ts:65-69`); panel và trích xuất render qua `errorText` dùng chung; thêm test chuỗi hiển thị ở `ai-panel-view.test.ts`. Ước lượng nhỏ (≤ 400 dòng SP; thực tế vài chục dòng + test).
```

```
ID: MS-D2
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/customers/KycIntelligence.tsx:426-428; đối chiếu docs/design/mockups/ai.html:479 (2a), :874 (4d) (0df3606)
Tình trạng: PLAUSIBLE (đọc code + tìm i18n, chưa chạy app)
Mô tả: Panel ở trạng thái trống (được gọi AI, chưa có phân tích) chỉ hiện "Chưa có phân tích AI cho KH này.", thiếu dòng help của mockup 2a/4d ("Phân tích: gửi N dữ kiện tới OpenCode · <gói> · <model>…" + câu giải thích ChatGPT web).
Tái hiện / bằng chứng: nhánh render trống chỉ gồm `t('aiPanel.empty')`, không có dòng thứ hai; tìm trong `apps/desktop/src/i18n/vi.ts` không có key nào chứa câu này (mẫu `dữ kiện đã xác nhận tới|đổi ở Cài đặt → AI\)` cho 0 kết quả).
Ảnh hưởng: lần đầu dùng, RE không biết lần Phân tích sắp tới chạy bằng provider/gói/model nào và gửi gì đi; phải mở Cài đặt → AI mới biết.
Đề xuất: thêm dòng help theo 4d (đếm dữ kiện từ `facts` hiện tại; provider/gói/model từ `app.ai.settings()`; nêu rõ khi bản web ép Mock). Nhỏ.
```

```
ID: MS-D3
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/appointments/AppointmentAi.tsx:52; apps/desktop/src/routes/appointments/appointment-ai-view.ts:12, :35; đối chiếu apps/desktop/src/routes/customers/KycHistory.tsx:16-21, KycIntelligence.tsx:335 (0df3606)
Tình trạng: PLAUSIBLE (đọc code, chưa chạy app)
Mô tả: Khối AI ở chi tiết lịch hẹn gắn badge "Mock" cho kết quả Mock nhưng không gắn badge "ChatGPT web" cho kết quả ChatGPT web; `appointment-ai-view` chỉ giữ cờ `mock: boolean` nên không phân biệt nổi OPENCODE_GO với CHATGPT_WEB.
Tái hiện / bằng chứng: `AppointmentAi.tsx:52` chỉ render badge khi `view.mock`; panel (`SourceBadge`) và cột lịch sử đều có badge xanh ChatGPT web. ADR-0009 W-1 mục 4: "Kết quả hiện chip 'ChatGPT web' để không lẫn với lần gọi OpenCode". Chiều ngược cần ghi nhận: spec §9.2 liệt kê nội dung khối không nhắc badge provider (badge Mock hiện tại cũng là thêm ngoài §9.2, theo §4.1 "luôn gắn chip 'Mock'").
Ảnh hưởng: đọc khối ở màn lịch hẹn, RE không biết kết quả tới từ ChatGPT web hay OpenCode.
Đề xuất: thay `mock: boolean` bằng `source: AiPanelSource` dùng chung với panel, render `SourceBadge`; thêm test ở `appointment-ai-view.test.ts`. Nhỏ.
```

```
ID: MS-D4
Mức: Low
Trục: A
Vị trí: apps/desktop/src/routes/customers/KycIntelligence.tsx:337-346; apps/desktop/src/routes/customers/KycExtraction.tsx:57-65; đối chiếu apps/desktop/src/routes/SettingsAi.tsx:319-321; apps/desktop/src/data/ai-jobs.ts:1-6 (0df3606)
Tình trạng: PLAUSIBLE (đọc code + test jobs, chưa chạy app với provider thật)
Mô tả: Các nút Phân tích / ChatGPT web / AI trích xuất tắt khi runner bận nhưng không nêu lý do khi yêu cầu đang chạy thuộc về nơi khác (KH khác, hoặc Kiểm tra kết nối ở Cài đặt): panel không có BusyLine của mình, ghi chú cũng không.
Tái hiện / bằng chứng: `enabled` chỉ là boolean gộp (`aiPanelView.ts:86`; `NoteEvent` dùng `busy` thô); `ConnectionCard` là nơi duy nhất hiện gợi ý khi busy (`SettingsAi.tsx:319-321`). Kịch bản cụ thể: bấm Phân tích ở KH A (yêu cầu thật chạy lâu) → mở KH B → mọi nút AI của B tắt mà không một dòng giải thích (job của A sống qua màn theo thiết kế `AiJobs`). E2e hiện có chỉ phủ "quay lại đúng màn đang chạy" (`customer-ai.spec.ts:179`), không phủ màn KH khác.
Ảnh hưởng: RE tưởng nút hỏng; với yêu cầu thật có thể chờ tới ~2 phút mà không hiểu vì sao.
Đề xuất: khi nút tắt vì busy mà không có job của chính mình, hiện dòng gợi ý như SettingsAi ("Đang có một yêu cầu AI khác — chờ xong rồi thử lại.") ở panel và ghi chú; hoặc AppAi mở thông tin job đang chạy để nêu đúng chỗ. Nhỏ–vừa.
```

```
ID: MS-D5
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/customers/KycIntelligence.tsx:349; apps/desktop/src/routes/customers/KycExtraction.tsx:113-118; đối chiếu packages/ui/src/components/Dialog.tsx:37-42 (0df3606)
Tình trạng: PLAUSIBLE (đọc code, chưa kiểm bằng trình đọc màn hình)
Mô tả: Khi phiên ChatGPT web đóng (lưu xong/Hủy) hoặc dòng "AI không tìm thấy…" được Đóng, phần tử đang focus biến mất mà focus không được chuyển về chỗ hợp lý (rơi về body).
Tái hiện / bằng chứng: các nhánh này unmount mà không quản lý focus; các Dialog trong cùng màn đều tự trả focus về phần tử mở (`Dialog.tsx:37-42`).
Ảnh hưởng: người dùng bàn phím/trình đọc màn hình mất vị trí, phải Tab lại từ đầu trang.
Đề xuất: sau khi phiên đóng, focus nút "Phân tích bằng ChatGPT web"; sau Đóng ở trích xuất, focus nút "AI trích xuất" của ghi chú đó. Nhỏ.
```

```
ID: MS-D6
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/customers/KycIntelligence.tsx:322, :371-380; đối chiếu apps/desktop/src/data/ai-analysis.ts:125-133 (0df3606)
Tình trạng: PLAUSIBLE (đọc code, chưa chạy app)
Mô tả: Dòng "Đang phân tích… · <model>" đọc settings ở lúc render, không phải settings của lần chạy (đã chốt ở lúc bấm): đổi model/provider giữa chừng làm dòng này ghi sai model đang chạy.
Tái hiện / bằng chứng: `const settings = app.ai.settings()` trong thân render, dùng cho `runningDetail`; trong khi `call()` chốt adapter/settings một lần ở lúc bấm và kết quả lưu vẫn đúng theo settings lúc bấm.
Ảnh hưởng: nhãn gây hiểu nhầm thoáng qua; dữ liệu lưu không sai.
Đề xuất: `useAiJob` giữ tên model/provider lúc `start` và truyền cho dòng running; hoặc bỏ tên model khỏi dòng running. Nhỏ.
```

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | G | C | D | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Medium | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Low | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 1 | 3 |
| Nit | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 2 |
| Tổng | 0 | 0 | 4 | 0 | 0 | 0 | 0 | 0 | 2 | 6 |

## 4. KNOWN

Đã đọc `common/known.md`. Các mục chạm gói D sau đây được kiểm lại trên code ở SHA trên và **không có bằng chứng mới**, nên không nhắc lại thành phát hiện: `ai-jobs.ts` `start` ghi đè không kiểm + `ended` mất khi lỗi ở màn khác; `ConfirmFactDialog` preview `refused`; trùng lặp khối chạy/lỗi giữa `KycExtraction` và panel; nhãn "Ghi chú KYC/hệ thống" theo `button?`; dấu `:` JSX ở `KycExtraction.tsx:96`; cụm 1g ở `SettingsAi` (khó xóa ở Mock, kết quả kiểm cũ còn hiện, dòng ChatGPT web thiếu in đậm, thiếu e2e "mất sau khi chọn lại"); `dayAndTime` tách chuỗi `formatLocalDateTime` (`ai-panel-view.ts:517-521`); mã F vắng trên dòng thời gian (chờ Owner); `comparable`/`collapseSpaces`. Riêng MS-D3 không trùng mục chip T-174 (mục đó về panel/lịch sử, đã sửa).## 5. Đã xét, không thấy (mọi trục §4)

- **E — Edge case (đã xét, không thấy):** bấm đúp Phân tích/Kiểm tra kết nối (sự kiện rời rạc, React render lại giữa các click; `runner.run` bật `busy` đồng bộ ở `packages/ai/src/run.ts:97`; nhánh bị từ chối có test ở `ai-jobs.test.ts:79`); bấm đúp "Kiểm tra và lưu" (lưu xong unmount, lần 1 sai thì `pasted` bị xóa ở `KycWebSession.tsx:69-74` nên nút tắt); phiên web + Nạp lại/Nhập backup (rời Hồ sơ KH là unmount, state phiên không sống qua `replace`; `viewing`/`gone` đều có chốt phiên bản); chạy trích xuất lại khi hộp Xác nhận đang mở (Dialog `showModal` chặn tương tác nền — `Dialog.tsx:15-16`); biên 20 ký tự ghi chú (test 19/20 + emoji ngoài BMP), biên 20.000 ký tự dán (UI chỉ hiện outcome, đếm ở gói A); ghi chú SYSTEM không nút; dán rỗng/chỉ khoảng trắng (nút tắt, không tính lần thử); Unicode/dấu tiếng Việt hiện dạng text thuần; ngày 29/02/nửa đêm (dùng hàm `domain`); `viewing`/`report` khi thêm phiên bản KYC (versions chỉ tăng trong phiên màn, id ổn định); `startWeb` gặp cổng chặn/xóa KH giữa chừng (bỏ qua đúng vì panel đọc lại từ facts mới); `navigator.clipboard.writeText` ném đồng bộ khi API vắng (đi nhánh `failed` thay vì ô copy tay — chỉ xảy ra ngoài secure context, Tauri webview và localhost đều secure).
- **G — Guardrail AI (đã xét, không thấy):** không nơi nào render `raw_output` (`analysisContent` chỉ đọc input/output đã qua schema; `rejectedReport` chỉ đọc validator — có test `JSON.stringify(report)` không chứa output thô); đề xuất trích xuất không tự lưu (state component, rời màn mất; test revision không đổi); cổng chặn thì nút tắt và kiểm lại ở lúc bấm (`takeProfile` → `runAnalysis` → `blocked`; phiên web igualmente); nội dung V1–V7/danh sách chặn thuộc gói A; câu dán vào và chi tiết validator hiện dạng text thuần (textarea/React text), không render HTML/Markdown.
- **C — Đúng hợp đồng (đã xét; 4 phát hiện ở §2):** đối chiếu từng mục mockup 2b–2l, 3a–3f, 4a–4i, CURRENT ở `customer.html:383-463`, khối lịch hẹn ở `appointments.html:431-456` và spec §3/§3.1/§4/§8/§9.1/§9.2 — các mục sau khớp: nút chính/phụ và điều kiện tắt (P5, phiên web), BusyLine chạy/hủy, lỗi + Thử lại, 4/3 khối + bằng chứng + mức + "Thông tin tham khảo", chip `kyc v·prompt·nguồn·dd/mm hh:mm`, cảnh báo mâu thuẫn phụ, lời nhắc STALE material/minor, dòng REJECTED + hộp 2k (validator, token chỉ OpenCode), lịch sử (sắp theo `seq`, badge, banner "Đang xem…"), mã F `F{seq}` + bấm tới dữ kiện + "không còn hiệu lực", nút trích xuất theo ghi chú + đề xuất/Xác nhận/Bỏ/0-đề-xuất/lỗi, hộp 3f điền sẵn + Cập nhật/Mâu thuẫn, key chỉ ghi + trạng thái từ Rust, Kiểm tra kết nối theo gói, dòng dữ liệu gửi đi (trừ mục KNOWN), copy lỗi → ô chỉ đọc, lần 1 sai → "Copy yêu cầu sửa", chip/history "ChatGPT web". Khối lịch hẹn: chỉ đọc, NBA+DS, badge CURRENT/STALE, `v3 · 14/09`, rỗng thì link về Hồ sơ KH. Mã F thứ hai hiện ngày xác nhận thay vì mã ghi chú kiểu `N-0914` của mockup 3a: app không có mã N- ở bất cứ đâu (kể cả trước Phase 5) nên đây là ánh xạ hợp lý, không ghi phát hiện.
- **D — Dữ liệu (đã xét, không thấy):** lưu xong panel đọc lại qua `run` → `changed()` → `useQuery` (không tin outcome); settings chỉ ghi 4 trường, đi theo backup, không key (có test); key không qua DB; bỏ qua đúng khi KH bị xóa/Nạp lại giữa chừng (`discarded`, có test, không báo bug); UI không có giao dịch nhiều bước; `takenAt` lấy giờ DB.
- **S — An toàn (đã xét, không thấy):** tìm `dangerouslySetInnerHTML|innerHTML|outerHTML|insertAdjacentHTML|window.open` trong 7 file component AI: 0 kết quả (`window.open` duy nhất ở `ai-analysis.ts:85` với URL hằng + `'noopener'`, có test; bản exe qua lệnh Rust không tham số); output model/validator/trích dẫn hiện dạng text; key không bao giờ hiện lại (ô nhập xóa sau khi lưu, chỉ đọc boolean trạng thái); thông báo lỗi không chứa key/header/nội dung gửi (lỗi ô key không dội key; `errorText` chỉ code/status/message server ≤200 ký tự do Rust cắt); clipboard chỉ ghi không đọc; không đưa dữ liệu lên URL; không link ngoài ở UI AI; trích xuất gửi nguyên văn ghi chú và ChatGPT web do người dùng tự dán đều đã công khai ở thẻ "Dữ liệu gửi đi".
- **P — Hiệu năng (đã xét, không thấy; có số đo từ probe Phụ lục A):** `analysisContent` với output cực đại (35 phần tử × 300 ký tự) trung bình **0,086 ms/lần** (200 lần = 17,1 ms); `historyRows` với **500 dòng = 0,7 ms**. Không có vấn đề hiệu năng ở phía view.
- **B — Bloat (đã xét, không thấy):** `tsc --noEmit --noUnusedLocals --noUnusedParameters` trên `apps/desktop`: **0 lỗi**; rà soát export các file AI: mọi export đều có nơi dùng (`ITEMS`/`Item`/`BusyLine`/`BADGE_COLORS` dùng ở `AppointmentAi`/`KycExtraction`, `modelLabel` dùng ở `settings-ai-view`, `CHATGPT_URL` dùng + test, `issueText`/`SourceBadge`/`factCodeTarget` dùng chéo panel); nhánh `checkShown` cancelled và `modelLabel('')` là phòng thủ 1 dòng, giữ. Các mục trùng lặp đã ở KNOWN nên không nhắc lại.
- **T — Chất lượng test (đã xét, không thấy vấn đề đáng kể):** 140/140 test vùng AI xanh tại SHA này (xem Phụ lục B); assertion ghi cứng chuỗi kỳ vọng (không chép công thức code); ngày dựng local-nhất-quán (`new Date(y,m,d,h,mi)` + `formatLocalDateTime`); dùng runner/DB/Mock thật, mock tối thiểu (adapter giữ, clipboard Ghi); component React và `useAiJob` không có unit test vì repo chưa có hạ tầng test component (KNOWN, thêm là G4), được phủ bằng e2e (`customer-ai` 6 test, `customer-ai-web` 5 test, `settings-ai` 6 test — chỉ đọc tên để đối chiếu, không review sâu). Nhánh `webAfter` với `EMPTY` chưa có test riêng nhưng UI không bao giờ sinh ra (nút tắt khi khung rỗng) — không ghi phát hiện.
- **A — Trợ năng / i18n (đã xét; 1 Low + 1 Nit ở §2):** BusyLine `role="status"` (aria-live ngầm định) cho chạy/hủy, lỗi `role="alert"`, tin mã F hết hiệu lực `role="status"`; `TextField` có label + `aria-describedby` cho lỗi, textarea copy tay có `aria-label`; nút ghi chú ngắn có cả `title` lẫn chữ hiện; bảng lịch sử có header, nút mở từng dòng (`aria-label`), `aria-current` dòng đang xem; hàng `<tr>` chỉ gắn `onClick` chuột, bàn phím dùng nút trong ô ngày (không lồng interactive); Dialog modal tự focus `[data-autofocus]` và trả focus khi đóng; tìm chữ tiếng Việt trong 14 file AI chỉ còn comment (không chuỗi UI cứng — trừ dấu `:` ở `KycExtraction.tsx:96` đã KNOWN); tên khối/badge tiếng Anh theo đúng mockup G3; slot đếm/i18n qua `t()` + `COUNT_SLOTS`.

## 6. Phụ lục A — Probe tạm (nguồn + lệnh + kết quả thật)

Probe chạy từ file tạm `apps/desktop/src/routes/customers/zz-msd-probe.test.ts` (đã xóa ngay sau khi chạy; bản sao lưu ở `muse\D\zz-msd-probe.test.ts`). Lý do đặt trong repo: sandbox chặn ghi ngoài workspace nên không thể đặt probe ở `muse\D\` để vitest trong repo chạy được; `git status` sau khi xóa đã kiểm: sạch.

Lệnh (pwsh, TEMP trỏ sang thư mục sandbox vì temp mặc định bị chặn ghi — xem Phụ lục B):

```
pnpm vitest run apps/desktop/src/routes/customers/zz-msd-probe.test.ts
```

Kết quả thật (trích stdout, exit 0, 2 passed):

```
outcome = {"kind":"error","code":"AI_HTTP","httpStatus":502,"serverMessage":"Bad gateway"}
runAfter = {"phase":"error","error":"AI_HTTP"}
panel renders = "OpenCode báo lỗi."
analysisContent x200 = 17.1ms (avg 0.086ms)
historyRows x500 rows = 0.7ms
```

Nguồn probe: xem file kèm `muse\D\zz-msd-probe.test.ts` (nội dung 1–1 với file đã chạy; tóm tắt: test 1 dựng app thật + adapter từ chối `AiError('AI_HTTP', {httpStatus: 502, serverMessage: 'Bad gateway'})`, gọi `analyseCustomer`, Ghi `outcome`/`runAfter`/`t('aiError.AI_HTTP')`; test 2 dựng output cực đại 35 phần tử × 300 ký tự và 500 dòng lịch sử, đo `analysisContent` ×200 và `historyRows`).

## 7. Phụ lục B — Lệnh kiểm tra đã chạy

1. `git -c safe.directory=C:/workspace/Project-2C-review-2 rev-parse HEAD` → `0df3606fb783cc89b1b9c413c02810340e273a4f` (đầu và cuối phiên giống nhau).
2. `git -c safe.directory=C:/workspace/Project-2C-review-2 status --short` → 4 dòng `?? .agents/`, `?? .codex/`, `?? AGENTS.md`, `?? opencode.json` (đầu và cuối phiên giống nhau; cần `-c safe.directory` vì sandbox chạy dưới user khác).
3. Unit test vùng AI (7 file, TEMP/TMP trỏ sang thư mục sandbox vì `mkdir` temp mặc định bị EPERM):
   `pnpm vitest run apps/desktop/src/data/ai-analysis.test.ts apps/desktop/src/data/ai-jobs.test.ts apps/desktop/src/data/ai-tauri.test.ts apps/desktop/src/routes/customers/ai-panel-view.test.ts apps/desktop/src/routes/customers/extraction-view.test.ts apps/desktop/src/routes/appointments/appointment-ai-view.test.ts apps/desktop/src/routes/settings-ai-view.test.ts`
   → `Test Files 7 passed (7)`, `Tests 140 passed (140)`.
4. `pnpm --filter @p2c/desktop exec tsc --noEmit --noUnusedLocals --noUnusedParameters -p tsconfig.json` → không Ghi lỗi nào.
5. Tìm `dangerouslySetInnerHTML|innerHTML|outerHTML|insertAdjacentHTML|window.open` trong 7 file component AI → 0 kết quả. Tìm chữ tiếng Việt trong 14 file AI → chỉ còn comment. Tìm chuỗi help 2a/4d trong `vi.ts` → 0 kết quả (bằng chứng MS-D2).

— Hết báo cáo gói D. Không tổng hợp, không so với bên khác, không tạo Issue, không đề xuất merge (theo mục 10 prompt phiên).