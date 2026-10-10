# Review lại Phase 5 (vòng 2) — Claude, gói C: UI + data desktop + e2e

- **SHA:** `705ea7c`. Đã kiểm `git rev-parse HEAD` = `705ea7c0e76d…` lúc đầu và lúc cuối phiên. Worktree `C:\workspace\Project-2C-review`, Home PC.
- **Reviewer:** Claude Opus 5.5, phiên sạch, không subagent. Không mở / liệt kê `deep-review-5-r2\codex\`. Đã đọc `claude\A.md`, `claude\B.md` (vòng 2). Không có mục nào của A / B trùng phạm vi C. Riêng phần `kyc.ts` của DR5-15 / 48, A đã kiểm phía `db`; ở đây chỉ kiểm phía panel / UI.
- **Không gọi AI thật:** chỉ dùng Mock, IPC giả `asExe` của e2e (`ai_complete` giả, key trong bộ nhớ) và clipboard / `window.open` giả. Không đụng Credential Manager, không mở chatgpt.com.
- **Cách probe:** mọi thứ nằm ở `C:\workspace\deep-review-5-r2\claude\C\` (phụ lục §7):
  - Playwright chạy bằng config riêng (`pw.config.mjs`, Edge, cổng 4183). Config này dựng bản web bằng `serve-fast.mjs`, tức `vite build` + `vite preview` chép từ `e2e/serve.mjs`.
  - Vitest chạy bằng config riêng (`vitest.probe.config.mjs`). Test probe nằm ngoài repo.
  - Gỡ sửa / đột biến bằng `mutate.mjs` (37 phép). Mỗi phép áp vào worktree, chạy unit của gói C (17 file, 285 test) và / hoặc e2e (`customer-ai*`, `settings-ai`, `customer-kyc`, `appointments`: 64 test), rồi `git checkout --` ngay.
  - Cuối phiên `git status --short` của worktree **sạch**. `apps/desktop/dist/` (bị gitignore) được dựng lại từ HEAD.

## 1. Bảng R

| DR5 | Issue | Kết luận | Bằng chứng (tái hiện cũ ra gì; test nào đỏ khi gỡ sửa) | Ghi chú |
|---|---|---|---|---|
| 30 | #486 T-193 | **ĐÃ SỬA** | Tái hiện vòng 1 bằng e2e với IPC giả. `AI_HTTP` 502 "Bad gateway" ra "OpenCode báo lỗi (HTTP 502): Bad gateway" ở cả panel lẫn AI trích xuất; 429 / 401 kèm "(HTTP n)". Panel, trích xuất và Cài đặt dùng chung `errorText` (`ai-error-view.ts`). Gỡ phần giữ mã ở `aiFailure` → **3 unit + 1 e2e đỏ**. Đưa `extractFromNote` về chỉ giữ `code` → **1 unit + 1 e2e đỏ** | — |
| 31 | #486 | **ĐÃ SỬA** | Dòng đang chạy đọc `job.settings`, chụp lúc bấm (`use-ai-job.ts:44–47`, `ai-jobs.ts:54–57`). Có e2e: đổi model sang Kimi rồi sang Mock trong lúc chạy, dòng vẫn ghi DeepSeek. Đọc Cài đặt hiện tại ở panel → **1 e2e đỏ**. `analyseCustomer` / `extractFromNote` chạy với `app.ai.call()` lúc trả lời thay cho `call` lúc bấm → **1 unit đỏ** mỗi chỗ | Hủy giữ `settings` (`{...job, cancelled}`) |
| 32 | #486 | **ĐÃ SỬA** | Ô key là `type="password"`, `spellcheck="false"`, `autocomplete="off"`. Đổi lại `type="text"` → **1 e2e đỏ** | — |
| 33 | #489 T-195 | **ĐÃ SỬA** (hai đường Issue nêu); còn biến thể → CL2-C3, CL2-C4 | Vùng `aria-live` có sẵn trong panel và dưới mỗi ghi chú. Phân tích Mock xong thì có `role=status` "Phân tích xong: đã lưu kết quả."; trích xuất có đề xuất thì có "AI trích xuất xong…" (e2e). Bỏ câu ở panel → **2 e2e đỏ** (Mock, ChatGPT web). Bỏ câu ở trích xuất → **1 e2e đỏ** | Câu từ chối tại khung dán không được báo (CL2-C3). "0 đề xuất" vẫn là `role=status` sinh cùng lúc với chữ (CL2-C4) |
| 36 | #484 T-191 | **ĐÃ SỬA** | Test của PR tái hiện cả ca CX-F1: DB có F5, nhập backup chỉ có F1–F4 → `discarded`, không có dòng nào. Bỏ kiểm `generation` → **2 unit đỏ** (nhập backup ID trùng, ca F5). Tăng `generation` trước khi thay xong → **1 unit đỏ** (thay lỗi thì vẫn phải lưu). Biến thể (probe `r36-variants`): seed lỗi khi Nạp lại → `generation` 0 → 0, kết quả vẫn lưu ACCEPTED; nhập hai lần liên tiếp → `discarded`; lần chạy mới sau khi thay → lưu bình thường; yêu cầu thứ hai trong lúc chạy → `AI_BUSY`. Đường thay DB chỉ có `replace` (Nạp lại, Nhập backup; `git grep "db ="`) | Đột biến "đọc `generation` sau một `await`" bị giết nhưng do đổi thời điểm (test Hủy đỏ), không tính. Phiên ChatGPT web sống trong panel; Nạp lại / Nhập chỉ có ở Cài đặt nên panel đã unmount, đúng Issue. Trích xuất không tự lưu: Xác nhận chạy trên DB hiện tại |
| 37 | #486 | **ĐÃ SỬA** | `acted` ref chặn trạng thái key về muộn (cả nhánh lỗi). Bỏ chặn → **1 e2e đỏ** (e2e giữ `ai_key_status`) | — |
| 38 | #489 | **ĐÃ SỬA**; biến thể link 2b → CL2-C6 | Enter trên mã F → focus tới `span#fact-Fn` (`tabIndex=-1`, e2e `toBeFocused`). Bỏ `focus()` → **1 e2e đỏ**. Bỏ `tabIndex` → **1 e2e đỏ** | Link "Xem ở Dữ kiện KYC →" (2b) vẫn chỉ cuộn (CL2-C6) |
| 39 | #483 T-190 | **ĐÃ SỬA** | `NoteEvent` tắt khi `running \|\| webOpen`. Phiên của KH A tắt nút của A, KH B không ảnh hưởng (e2e). Bỏ `webOpen` → **1 e2e đỏ**. Spec §3.1 mục 4 đã thêm AI trích xuất | Nút Thử lại của lỗi trích xuất cũng theo `busy` này |
| 40 | #489 | **ĐÃ SỬA** | `busyElsewhere = busy && !blocked && !running && !webOpen`. Cho luôn `false` → **1 unit + 1 e2e đỏ**. Cho hiện cả khi chính panel đang chạy → **1 unit + 1 e2e đỏ** | Câu khớp mockup 2d (dòng thêm 10/10) |
| 41 | #489 | **ĐÃ SỬA** | Dòng help theo provider / gói / model, đếm dữ kiện đúng tập `buildAnalysisInput` gửi (bỏ `superseded`). Bỏ dòng → **2 e2e đỏ** ở `customer-ai`. Đếm cả dữ kiện `superseded` → **2 unit đỏ**, e2e 0 (e2e không có dữ kiện bị thay) | Lần gỡ này còn làm đỏ 2 test `customer-appointments`. Chạy riêng 2 test đó và test `appointments.spec.ts:848` 6 lần × 4 worker: 36 / 36 xanh, nên coi là chập chờn do tải (§4 trục T) |
| 42 | #489 | **ĐÃ SỬA**; TSX không có test → CL2-C5 | `appointmentAiView.source` dùng chung `AiPanelSource`. Bỏ badge web ở view → **1 unit đỏ**. Đưa TSX `AppointmentAi` về chỉ badge Mock → **0 test đỏ** | — |
| 43 | #489 | **ĐÃ SỬA** (đúng hai đường Issue nêu); còn biến thể → CL2-C2 | Phiên web đóng (lưu / Hủy) → focus về nút "Phân tích bằng ChatGPT web". Đóng "0 đề xuất" → focus về nút "AI trích xuất" (e2e). Bỏ effect ở panel → **2 e2e đỏ**. Bỏ `focus()` ở trích xuất → **1 e2e đỏ** | Probe bàn phím: 6 đường khác vẫn rơi về `body` (CL2-C2) |
| 44 | #486 | **ĐÃ SỬA** | `AI_NO_KEY` ở panel / trích xuất có link `#/settings/ai`. Bấm link mở Cài đặt → mục AI (`aria-current`, e2e). Chỉ `AI_NO_KEY` có link, khớp mockup 2f / 2l / 4c. Bỏ link → **1 unit + 1 e2e đỏ** | Cài đặt hiện cùng câu nhưng không có link (`errorText` thường), hợp lý vì đang ở chính màn đó |
| 45 | #489 | **ĐÃ SỬA**; TSX một phần không có test → CL2-C5 | Badge đầu = `MODE_GATES[webMode]` trong phiên (mockup 4e). Đổi KYC trong lúc phiên mở, badge vẫn `PROFILE_DISCOVERY` (e2e). Bỏ → **1 unit + 1 e2e đỏ**. Để lại `SourceBadge` trong phiên → **0 test đỏ** | — |
| 46 | #486 | **ĐÃ SỬA** | `setOutcome(undefined)` trước khi kiểm ô. Lưu key xong rồi lưu với ô trống thì chỉ còn "Chưa nhập key." (e2e). Đưa về thứ tự cũ → **1 e2e đỏ** | — |
| 47 | #489 | **ĐÃ SỬA** | `codes.join(t('sep.slash'))`. `git grep "' / '"` trong `routes/**/*.tsx` cho 0 kết quả. Không có test riêng, vì đây chỉ là chuyển chuỗi vào i18n | — |
| 48 | #490 T-196 | **ĐÃ SỬA**; TSX không có test → CL2-C5 | Mọi chỗ hiện số phiên bản (chip, lịch sử, banner, chip phiên web, dòng thời gian, `kyc.meta`, `kycNote.sub`, `kycNote.after` / `kycResolve.after`, khối lịch hẹn) đều đọc `seq`. `git grep versions.length` chỉ còn điều kiện "có / chưa có phiên bản". Đánh số theo vị trí ở panel / dòng thời gian / phiên kế tiếp → **1 unit đỏ** mỗi chỗ. `kyc.meta` / `kycNote.sub` (TSX) dùng `versions.length` → **0 test đỏ** | Dữ liệu e2e có `seq` liền nhau nên đột biến TSX tương đương trên seed. Chỉ backup có `seq` hở mới khác |
| 50 | #490 | **ĐÃ SỬA** | Nạp lại chép dòng `ai` sang DB seed mới (`app-data.ts:278–279, 363`). JSON hỏng → không chép, đọc như mặc định (đúng spec §4.1 mới). Không chép → **2 unit + 1 e2e đỏ**. Seed lỗi → `replace` ném trước khi đổi DB, Cài đặt giữ nguyên (probe `r36-variants` ca 2) | Cài đặt hợp lệ JSON nhưng sai (vd. `gpt-6`) được chép nguyên, nên dòng 1g còn. Nhất quán với "giữ nguyên giá trị" |
| 15 (panel) | #490 | **ĐÃ SỬA** ở panel; khối lịch hẹn lệch → CL2-C1 | `factInEffect` ánh xạ mã cũ sang dữ kiện cùng trường + giá trị. Mức bằng chứng chỉ ánh xạ khi CURRENT. e2e: sửa ngày sinh cùng năm → vẫn CURRENT, F1 tới F6, không có "không còn hiệu lực". Bỏ ánh xạ → **2 unit + 1 e2e đỏ**. Mức theo ngày cũ → **1 unit đỏ**. Ánh xạ cả STALE → **1 unit đỏ**. Cuộn tới mã cũ → **1 e2e đỏ** | `kycHash` so `[field, value, status]` sau `normalizeKycValue`, nên `===` ở `factInEffect` khớp đúng luật "không tạo phiên bản" |

## 2. Phát hiện

```
ID: CL2-C1
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/appointments/appointment-ai-view.ts:35 (analysisContent không có facts),
  AppointmentAi.tsx:33–40; so với KycIntelligence.tsx:174 / ai-panel-view.ts:430–445 (705ea7c)
Tình trạng: CONFIRMED
Liên quan: DR5-15 · mới do đợt sửa (PR #505 chỉ truyền dữ kiện hiện hành cho panel)
Mô tả: Sau khi RE xác nhận lại cùng giá trị một dữ kiện được trích, panel tính mức bằng chứng của
  phân tích CURRENT theo dữ kiện hiện hành ("mới nhất 27/09/2026"). Khối KYC Intelligence ở chi tiết
  lịch hẹn hiện cùng phân tích CURRENT đó, cùng dòng "Mức bằng chứng: … mới nhất …", nhưng vẫn tính theo
  ngày trong input_json cũ ("mới nhất 01/06/2025"). Hai chỗ cùng tính một thứ mà ra khác nhau.
Tái hiện / bằng chứng: unit/r15-appointment.test.ts. KH có 3 dữ kiện xác nhận 01/06/2025, phân tích
  Mock (CURRENT), rồi xác nhận lại cả ba cùng giá trị ngày 27/09/2026:
    "Hỏi sâu thêm về điều khách hàng đã chia…"
      lịch hẹn: LOW · 1 dữ kiện · mới nhất 2025-06-01
      panel   : LOW · 1 dữ kiện · mới nhất 2026-09-27
    items with evidence: 2, differing panel vs appointment: 1
  Với phần tử có 2 dữ kiện cũ (> 1 năm), mức cũng lệch theo luật hạ một mức (§6.3), ví dụ "trung bình
  (hạ)" thành "thấp" ở một bên. Đọc code: evidenceLevel nhận ngày khác nhau.
Ảnh hưởng: RE xác nhận lại dữ kiện khi gặp KH (thao tác thường), rồi mở lịch hẹn kế tiếp, sẽ thấy ngày
  "mới nhất" (có khi cả mức) khác với Hồ sơ KH cho cùng một phân tích CURRENT. Không mất dữ liệu.
Đề xuất: AppointmentAi đọc thêm getKycProfile(db, customerId).facts và truyền vào appointmentAiView
  → analysisContent(shown, versions, facts). Thêm 1 ca unit ở appointment-ai-view.test.ts. Cỡ ≈ 5 dòng
  SP + 1 test.
```

```
ID: CL2-C2
Mức: Low
Trục: A
Vị trí: apps/desktop/src/routes/customers/KycExtraction.tsx:113–124 (Bỏ / Xác nhận → handle),
  KycIntelligence.tsx:466–490 (Hủy trong BusyLine, Thử lại trong alert), :499–509 (← Về bản mới nhất)
  (705ea7c)
Tình trạng: CONFIRMED
Liên quan: DR5-43 · có từ trước; phần sửa #504 chỉ phủ hai đường Issue nêu (phiên web đóng, Đóng "0 đề
  xuất"). Vòng 1 Claude D ghi nhận đường Hủy nhưng không báo.
Mô tả: Nhiều nút tự biến mất khi được bấm. Dùng bằng bàn phím, focus rơi về <body>, đúng lỗi DR5-43
  đã sửa cho hai đường kia.
Tái hiện / bằng chứng: probes/focus.spec.ts (Edge, bản build, Enter trên nút đang focus):
    extraction · Bỏ (đề xuất 1 / 2)               → BODY
    extraction · Xác nhận (đề xuất cuối), lưu hộp  → BODY
    extraction · Bỏ (đề xuất cuối)                → BODY
    panel · ← Về bản mới nhất                     → BODY
    panel · Hủy (đang chạy)                       → BODY  (sau khi "Đang hủy…" xong: vẫn BODY)
    panel · Thử lại (trong alert lỗi)             → BODY
  Đối chứng: Escape trong hộp 3f trả focus về nút "Xác nhận" (Dialog tự làm); lỗi hiện sau "Phân tích
  lại" thì focus ở nguyên nút.
Ảnh hưởng: người dùng bàn phím / trình đọc màn hình. Sau mỗi đề xuất Bỏ / Xác nhận, hay sau khi Hủy /
  Thử lại, phải Tab lại từ đầu trang.
Đề xuất: dùng lại cách của #504. Đề xuất bị gỡ → focus đề xuất kế tiếp, hết đề xuất thì focus nút "AI
  trích xuất" của ghi chú. Hủy / Thử lại / Về bản mới nhất → focus tiêu đề panel (đã có tabIndex=-1) hoặc
  nút chính khi bật. Cỡ ≈ 15–25 dòng SP + e2e bàn phím. Hợp với #493 (T-200) hoặc một Issue trợ năng
  nhỏ sau G7.
```

```
ID: CL2-C3
Mức: Low
Trục: A
Vị trí: apps/desktop/src/routes/customers/KycWebSession.tsx:141–152 (TextField error), packages/ui/src/
  components/TextField.tsx:76–79 (705ea7c)
Tình trạng: CONFIRMED (cây trợ năng + DOM; không có trình đọc màn hình thật trong phiên)
Liên quan: DR5-49 (a) phần UI (#497) · DR5-33 (#504) · câu OWN_MESSAGE mới do đợt sửa, TOO_LONG có từ
  trước (vòng 1 bỏ sót)
Mô tả: Bấm "Kiểm tra và lưu" với câu dán bị từ chối tại khung ("Đây là tin nhắn của app — hãy copy
  câu trả lời của ChatGPT." / "dài quá 20.000 ký tự") thì câu báo chỉ là lỗi của ô (aria-describedby +
  aria-invalid). Câu không nằm trong vùng live / alert, và focus ở nguyên nút. Không lưu gì, không tính
  lần thử, nên với trình đọc màn hình bấm nút là không có gì xảy ra. Đây đúng là câu mà quyết định Owner
  10/10 muốn RE nghe được.
Tái hiện / bằng chứng: probes/web-refused.spec.ts:
    REFUSED OWN_MESSAGE: {"liveAncestor":null,"ownRole":null,"describedBy":true,"invalid":"true","focus":"Kiểm tra và lưu"}
    REFUSED TOO_LONG:    {"liveAncestor":null,"ownRole":null,"describedBy":true,"invalid":"true","focus":"Kiểm tra và lưu"}
  ariaSnapshot: `textbox "Dán kết quả" [invalid]` rồi một `text:` thường. Các nhánh khác của phiên
  (lần 1 sai: role=alert; lỗi app: role=alert) đều được báo.
Ảnh hưởng: RE dùng trình đọc màn hình dán nhầm tin nhắn của app thì không biết vì sao không có gì xảy
  ra. Dữ liệu không sai.
Đề xuất: khi `web.refused` khác null, hiện thêm câu trong vùng role="alert" (hoặc vùng live có sẵn của
  panel), hoặc đưa focus về ô dán để lỗi được đọc qua describedby. Cỡ ≈ 3–5 dòng SP + 1 dòng e2e.
```

```
ID: CL2-C4
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/customers/KycExtraction.tsx:100–102 (vùng live chỉ cho 'proposals'),
  :129–134 (<p role="status"> của "0 đề xuất") (705ea7c)
Tình trạng: PLAUSIBLE (đọc code + DOM; không thử được bằng NVDA / Narrator trong phiên)
Liên quan: DR5-33 · mới do đợt sửa (PR #504 làm vùng live "có sẵn trước khi điền" cho kết quả có đề
  xuất, không cho kết quả "0 đề xuất")
Mô tả: Trích xuất kết thúc theo hai cách. Có đề xuất: câu báo vào vùng aria-live đã có sẵn, theo đúng
  comment "Present before it is filled". Không có đề xuất: câu báo là một <p role="status"> sinh ra cùng
  lúc với chữ của nó. Nhiều cặp trình đọc màn hình / trình duyệt không đọc vùng live mới tạo đã có sẵn
  nội dung, tức cùng lý do khiến PR làm vùng có sẵn.
Tái hiện / bằng chứng: đọc JSX. e2e chỉ kiểm vai `status` có chữ, không kiểm có được đọc hay không.
Ảnh hưởng: có thể RE dùng trình đọc màn hình không nghe "AI không tìm thấy dữ kiện mới" khi trích xuất
  xong.
Đề xuất: đưa câu "0 đề xuất" vào cùng vùng live có sẵn (giữ nút Đóng ở ngoài). Cỡ 2–3 dòng SP.
```

```
ID: CL2-C5
Mức: Nit
Trục: T
Vị trí: apps/desktop/src/routes/appointments/AppointmentAi.tsx:53; KycIntelligence.tsx:422;
  CustomerKyc.tsx:138; KycDialogs.tsx:244 (705ea7c)
Tình trạng: CONFIRMED
Liên quan: DR5-42, 45, 48 · mới do đợt sửa (PR #504, #505); cùng loại với DR5-34 (KNOWN, #493 T-200)
  nhưng là code mới
Mô tả: Phần TSX của bốn mục sửa không có test nào đỏ khi đưa về hành vi cũ. Test chỉ ghim hàm view;
  e2e không có KH với phân tích ChatGPT web ở lịch hẹn, cũng không có backup với seq hở.
Tái hiện / bằng chứng: mutate.mjs (unit 285 + e2e 64 test):
    r42 AppointmentAi only Mock badge (TSX)      e2e 0 red
    r45 source badge kept in session (TSX)       e2e 0 red
    r48 KYC card meta by count (TSX)             e2e 0 red
    r48 note dialog sub by count (TSX)           e2e 0 red
  Đối chứng: phần view tương ứng đều có unit đỏ (§1).
Ảnh hưởng: không ai gặp hôm nay. Chỉ là một lần sửa TSX sau có thể làm mất badge "ChatGPT web" ở lịch
  hẹn, hoặc đưa "v<n>" về đếm theo vị trí, mà CI vẫn xanh.
Đề xuất: thêm vào #493 (T-200): 1 e2e ChatGPT web → mở lịch hẹn, thấy badge; 1 e2e nhập backup có seq
  10 / 20 → kiểm "v20" ở thẻ KYC và "KYC hiện tại v20" ở hộp Ghi chú KYC. Cỡ ≈ 40 dòng test.
```

```
ID: CL2-C6
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/customers/KycIntelligence.tsx:93–102 (705ea7c)
Tình trạng: CONFIRMED
Liên quan: DR5-38 · có từ trước, vòng 1 bỏ sót (cùng loại "chỉ cuộn, không đưa focus")
Mô tả: Ở cổng CONFLICT_RESOLUTION (mockup 2b), link "Xem ở Dữ kiện KYC →" chỉ gọi scrollIntoView tới
  #kyc-facts. Focus ở lại link, trong khi mã F (DR5-38) giờ đã đưa focus tới dữ kiện.
Tái hiện / bằng chứng: probes/focus.spec.ts, Enter trên link → activeElement = A "Xem ở Dữ kiện KYC →".
Ảnh hưởng: người dùng bàn phím / trình đọc màn hình không được dẫn tới thẻ có dữ kiện mâu thuẫn cần
  giải quyết.
Đề xuất: focus tiêu đề / vùng #kyc-facts (tabIndex=-1) sau khi cuộn, như showFact. Cỡ 2–3 dòng.
```

## 3. Đọc sâu diff sửa `0df3606..705ea7c` (phạm vi C) và quét lại Phase 5

Đã đọc trọn diff 38 file của phạm vi C (+1 491 / −215), gồm 3 file e2e. Đã đọc thân Issue #483, #484, #486, #489, #490 và quyết định Owner 10/10 (`PROJECT-STATE.md:63`).

- **`app-data.ts`:**
  - `generation++` nằm ngay sau `db = await next()`, nên thay lỗi thì không tăng (có test, có đột biến bị giết).
  - `reloadDemoData` đọc dòng `ai` trong `next()`, tức sau backup, nên lấy giá trị mới nhất.
  - `parseJson` bỏ dòng hỏng.
  - Không còn đường nào khác gán `db`.
- **`ai-analysis.ts`:**
  - `generation` được chụp đồng bộ trước `takeProfile` và so ngay trước `save`, không có `await` ở giữa.
  - `extractFromNote` trả nguyên `result` lỗi, nên `httpStatus` / `serverMessage` đi tới view.
  - `call` mặc định `app.ai.call()` giữ hành vi cũ cho người gọi khác.
- **`ai-jobs.ts`, `use-ai-job.ts`:** `settings` theo entry. Hủy chép entry nên giữ `settings`. `start` lấy `call` lúc bấm và truyền đúng `call.settings`.
- **`ai-error-view.ts`:** một `errorText` cho ba chỗ. `errorParts` chỉ tách link cho `AI_NO_KEY`, nên `serverMessage` có chữ "Cài đặt → AI" không sinh link. Route `#/settings/ai`: `parseHash` chỉ nhận đúng `ai`, `Settings key={section}`. Không thấy lỗi.
- **`ai-panel-view.ts`:**
  - `busyElsewhere`, `MODE_GATES`, `aiPanelHelp`, `panelDone`, `isIssue` (A đã kiểm), `versionNumber` theo `seq`.
  - `analysisContent` chỉ ánh xạ khi CURRENT; `factCodeTarget` ánh xạ cả khi STALE. Đây là chủ ý của doc comment: link tới dữ kiện cùng giá trị, mức giữ như lúc phân tích.
  - Chỉ có CL2-C1 ở nơi gọi khác.
- **`KycIntelligence.tsx`, `KycExtraction.tsx`, `KycWebSession.tsx`:**
  - Effect focus của phiên web chỉ chạy khi `body` đang giữ focus.
  - `onWebOpen` có cleanup khi panel unmount.
  - Vùng live có sẵn.
  - Có CL2-C2, C3, C4, C6.
- **`SettingsAi.tsx`, `TextField.tsx`:** `acted` không bao giờ reset trong một lần mount, đúng ý (client không đổi). `type` chỉ áp cho `input`. Không thấy lỗi.
- **`kyc-view.ts`, `CustomerKyc.tsx`, `KycDialogs.tsx`:**
  - `nextVersionNumber` = `seq` cuối + 1, khớp lệnh `db` (A: `max + 1`).
  - Dòng thời gian theo `seq`.
  - `OutcomeDialog` dùng `KycNoteDialog` nên cũng theo `seq`.
- **Quét lại Phase 5** (`3e84ce8..705ea7c`, 44 file trong `routes` / `data` / `ui` / `e2e`):
  - Đã đọc lại `KycHistory.tsx` (trọn), `KycIntelligence.tsx` (trọn), `KycExtraction.tsx` (trọn), `KycWebSession.tsx` (trọn), `AppointmentAi.tsx`, `CustomerProfile.tsx` (phần AI), `ai-analysis.ts:1–330`, `ai-jobs.ts` (trọn), `extraction-view.ts` (trọn).
  - Đối chiếu mockup `ai.html` 2a–2l, 3e–3f, 4c–4e và spec §3, §3.1, §4.1, §5.2–§5.3, §6.3, §7.2–§7.3, §8, §9.1–§9.3.
  - Điều vòng 1 bỏ sót: CL2-C2 (phần trích xuất), CL2-C3 (TOO_LONG), CL2-C6. Ngoài ra chỉ còn các mục KNOWN (#468, #469, #444 trong `known.md`), không có bằng chứng mới.

## 4. Đã xét, không thấy

- **E — Edge case:**
  - **Thay DB:**
    - Nạp lại (ID mới, `GONE`) và Nhập backup cùng ID (`generation`) đều cho `discarded`.
    - Hai lần nhập liên tiếp → `discarded`; lần chạy sau khi thay thì lưu bình thường.
    - Seed lỗi giữa chừng: `generation` giữ nguyên, kết quả vẫn lưu.
    - Đổi KYC trong cùng DB → STALE (test có sẵn). Hủy → không lưu (test có sẵn).
  - **Kiểm tra kết nối** không ghi gì, nên không cần thế hệ.
  - **Phiên web** không qua được `replace`, vì Nạp lại / Nhập chỉ có ở màn Cài đặt (panel đã unmount).
  - **Nạp lại khi Cài đặt cũ:** hỏng JSON → mặc định; sai giá trị → chép nguyên (1g còn).
  - **Rời / quay lại màn khi đang chạy:** dòng đang chạy vẫn ghi model chụp lúc bấm (e2e #439 + DR5-31).
  - **Bấm "Cài đặt → AI" từ lỗi trích xuất:** Settings mở mục AI. Back / Forward giữ route.
  - Không có ca ngày / Unicode mới trong phạm vi C.
- **G — Guardrail AI:**
  - Đợt sửa không thêm đường ghi KYC từ AI: đề xuất trích xuất vẫn chỉ là state, Xác nhận đi qua hộp 3f.
  - Output / câu dán / `serverMessage` vẫn hiện dạng chữ: `AiErrorText` chỉ ghép chuỗi, link là hằng.
  - REJECTED vẫn không hiện `raw_output`.
- **C — Hợp đồng:**
  - Chữ khớp mockup: dòng help 2a / 4d (gộp đúng hai bản), câu `AI_BUSY` dưới đầu panel (2d, dòng mới 10/10), badge 4e, link 2f / 2l chỉ ở `AI_NO_KEY`.
  - Khớp spec §4.1 (Nạp lại giữ `ai`, Nhập lấy của backup) và §3.1 mục 3–4 (OWN_MESSAGE, AI trích xuất tắt).
  - Ngoài CL2-C1, không thấy hai chỗ tính lệch nhau.
- **D — Dữ liệu:** Cài đặt chỉ chép dòng `ai`, không có key. `putSetting` chạy trên DB seed tạm trước `export()`, nên file lưu luôn trọn vẹn. Lưu kết quả AI vẫn qua `app.run` trong transaction của lệnh.
- **S — An toàn:**
  - Ô key là password, không spellcheck, `autocomplete=off`.
  - Câu lỗi chỉ có mã + `serverMessage` đã che ở Rust (B).
  - Link duy nhất mới là route nội bộ `#/settings/ai`.
  - Không thêm `innerHTML` / `window.open`: `git grep` trong `apps/desktop/src` ra 0 chỗ mới.
- **P — Hiệu năng** (probe `unit/perf-panel`, Node, trung bình 20 lần), thêm `factInEffect` vào `analysisContent`:
  - 30 dữ kiện / 10 mã × 9 phần tử: **0,15 ms** (không ánh xạ 0,07 ms).
  - 300 / 100: **1,71 ms** (0,43 ms).
  - 2 000 / 500: **28,9 ms** (1,19 ms). Bậc hai theo số mã × số dữ kiện, nhưng cỡ này không thực tế (đầu vào bị trần 200 000 ký tự ở Rust; KH thật vài chục dữ kiện). Panel chỉ tính lại khi panel render, không theo từng phím ở ô dán.
  - `aiPanelHelp` ≤ 0,02 ms. `historyRows` 500 dòng 0,21 ms.
  - Không có vấn đề.
- **B — Thừa / lặp:**
  - `tsconfig` của app đã bật `noUnusedLocals` / `noUnusedParameters`, `pnpm verify` xanh (baseline).
  - Quét khóa i18n của các màn AI (`unused-keys.mjs`, 195 khóa, tính cả tiền tố template): 0 khóa thừa. Khóa cũ `settingsAi.checkHttp*`, `aiPanel.web.tooLong`, hàm `panelError` đã bỏ hẳn.
  - `AiShownCode` được export nhưng chỉ dùng trong `ai-error-view.ts`: không gây lỗi, không báo.
  - Lặp markup đang chạy / lỗi giữa trích xuất và panel là KNOWN (#469).
- **T — Test:**
  - 33 / 37 phép gỡ sửa / đột biến bị test giết (§1, phụ lục). 4 phép sống đều ở TSX (CL2-C5). Một phép bị giết vì lý do khác (đổi thời điểm, §1 dòng 36).
  - Test unit dùng ngày ghim. e2e DR5-37 chờ 100 ms trước khẳng định phủ định, nhưng đột biến vẫn bị giết.
  - Test `appointments.spec.ts:848` (Phase 5 §9.2) đỏ 1 / 3 lượt khi chạy 4 spec với 4 worker trên máy này. Chạy riêng 36 lần thì xanh hết, nên chưa đủ bằng chứng để báo. CI có `retries: 1`.
- **A — Trợ năng / i18n:**
  - Mọi chuỗi mới qua `vi.ts` (`aiPanel.help.*`, `aiPanel.done.*`, `extraction.done`, `aiError.http*`, `aiError.settingsLink`, `sep.slash`). Không thấy chuỗi cứng mới trong TSX.
  - Escape ở hộp 3f trả focus về nút mở. Tiêu đề panel có `tabIndex=-1` làm đích focus dự phòng.
  - Ngoài CL2-C2, C3, C4, C6, không thấy gì.
- **KNOWN trong phạm vi C:**
  - `use-ai-job.ts:23` (kết quả lỗi mất khi ở màn khác) và `ai-jobs.ts` `start` ghi đè: vẫn như cũ. #484 / #486 chỉ thêm `settings`.
  - Các mục #469 / #444 không đổi.
  - Không có mục "KNOWN đã sửa".

## 5. Bảng đếm

| Mức \ Trục | R | E | G | C | D | S | P | B | T | A | Cộng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Low | | | | 1 (C1) | | | | | | 2 (C2, C3) | 3 |
| Nit | | | | | | | | | 1 (C5) | 2 (C4, C6) | 3 |
| **Cộng** | | | | 1 | | | | | 1 | 4 | **6** |

Không có Critical / High / Medium. 5 phát hiện CONFIRMED, 1 PLAUSIBLE (C4). Bảng R: **19 / 19 dòng ĐÃ SỬA**, không HỒI QUY. Biến thể gần các phần sửa bỏ sót: C1 (15), C2 (43), C3 / C4 (33, 49 a), C5 (42, 45, 48), C6 (38).

## 6. Phạm vi đã đọc

- `common\plan.md`, `known.md`, `baseline.md`. `claude\A.md`, `claude\B.md` (vòng 2). Tổng hợp vòng 1 (trọn). Báo cáo vòng 1 `raw/2026-10-10/claude/D.md` (§2 CL-D3, D7, §4), `codex/D.md` (CX-D6, D7), `muse/D.md` (MS-D2 … D5). Thân Issue #483, #484, #486, #489, #490. `PROJECT-STATE.md` dòng 10/10.
- Spec `phase-5-ai.md` §3, §3.1, §4.1, §5.2–§5.4, §6.3, §7.2–§7.3, §8, §9.1–§9.3. Mockup `ai.html` 2a–2l, 3e–3f, 4c–4e. ADR-0009 W-1 (qua spec / Issue).
- Code (`705ea7c`, đọc qua `git show HEAD:` trong lúc chạy đột biến):
  - Data: `app-data.ts:180–420`, `ai-analysis.ts:1–330`, `ai-jobs.ts` (trọn), `use-ai-job.ts` (trọn).
  - Panel: `ai-panel-view.ts` (diff trọn + các hàm nêu trên), `KycIntelligence.tsx` (trọn), `KycWebSession.tsx:40–175`, `KycExtraction.tsx` (trọn), `KycHistory.tsx` (trọn), `extraction-view.ts` (trọn), `kyc-view.ts` (diff + `factInEffect`).
  - Lịch hẹn, Cài đặt, route: `AppointmentAi.tsx`, `appointment-ai-view.ts`, `CustomerProfile.tsx:36–210`, `CustomerKyc.tsx` (diff), `KycDialogs.tsx` (diff), `SettingsAi.tsx` (diff + `KeyCard`), `settings-ai-view.ts` (diff), `ai-error-view.ts` (trọn), `Settings.tsx`, `Screen.tsx`, `shell/routes.ts`, `useRoute.ts`.
  - Còn lại: `packages/ui/src/components/TextField.tsx`, `i18n/vi.ts` (khóa AI), `packages/ai/src/input.ts`, `packages/domain/src/evidence-level.ts`, `kyc.ts:100–164`, `kyc-fact.ts:25–46`.
- Test: diff `e2e/customer-ai.spec.ts`, `customer-ai-web.spec.ts`, `settings-ai.spec.ts`, `e2e/support.ts` (trọn `asExe`), `appointments.spec.ts:815–900`, `ai-analysis.test.ts` (DR5-30 / 31 / 36 / 50), `ai-panel-view.test.ts` (DR5-40 / 45 / 33), `kyc-view.test.ts` (DR5-15 / 48), `app-data.test.ts` (DR5-50).

## 7. Phụ lục — nguồn probe (`C:\workspace\deep-review-5-r2\claude\C\`)

| File | Làm gì | Lệnh (từ worktree) |
|---|---|---|
| `serve-fast.mjs`, `pw.config.mjs`, `package.json` (`type: module`), `node_modules` (junction tới `node_modules` của worktree) | Playwright Edge trên bản build web (`vite build`, không `tsc`), cổng 4183. `PW_DIR=probes` chạy probe, không đặt thì chạy `e2e/` của repo | `node_modules/.bin/playwright test -c <C>\pw.config.mjs [lọc]` |
| `vitest.probe.config.mjs` | Vitest, root = worktree, alias `@p2c/*` tới `src` | `node_modules/.bin/vitest run --config <C>\vitest.probe.config.mjs` |
| `mutate.mjs`, `mutate-out.txt`, `mutate-log.txt` | 37 phép gỡ sửa / đột biến (r30…r50, r15). Áp → unit (17 file) và / hoặc e2e (64 test) → `git checkout --`. Kết quả nêu ở §1 | `node <C>\mutate.mjs [tiền tố]` |
| `unit/r15-appointment.test.ts` | CL2-C1: cùng phân tích CURRENT, mức bằng chứng ở panel và ở lịch hẹn sau khi xác nhận lại | (vitest như trên) |
| `unit/r36-variants.test.ts` | DR5-36: seed lỗi khi Nạp lại, hai lần nhập, `AI_BUSY`, lần chạy sau khi thay | (vitest) |
| `unit/perf-panel.test.ts` | Trục P: `analysisContent` có / không ánh xạ, `aiPanelHelp`, `historyRows` | (vitest) |
| `probes/focus.spec.ts` | CL2-C2, CL2-C6: focus sau Bỏ / Xác nhận / Escape (trích xuất), ← Về bản mới nhất, Hủy, Thử lại, link 2b | `PW_DIR=probes … focus` |
| `probes/web-refused.spec.ts` | CL2-C3: câu từ chối tại khung dán (OWN_MESSAGE, TOO_LONG). Vùng live, `aria-describedby`, focus, `ariaSnapshot` | `PW_DIR=probes … web-refused` |
| `unused-keys.mjs` | Trục B: khóa i18n AI không dùng (đọc HEAD qua `git show`) | `node <C>\unused-keys.mjs` |
| `out\` | JSON / kết quả Playwright, Vitest; xóa được | — |

Kết quả gỡ sửa / đột biến (số test đỏ, unit / e2e):

| Phép | Đỏ | Phép | Đỏ |
|---|---|---|---|
| r30 `aiFailure` bỏ mã | 3 / 1 | r41 bỏ dòng help | — / 2 (+2 chập chờn) |
| r30 trích xuất chỉ giữ `code` | 1 / 1 | r41 đếm cả `superseded` | 2 / 0 |
| r31 panel đọc Cài đặt hiện tại | — / 1 | r42 view bỏ badge web | 1 / — |
| r31 phân tích theo Cài đặt lúc trả lời | 1 / — | r42 TSX chỉ badge Mock | — / **0** |
| r31 trích xuất theo Cài đặt lúc trả lời | 1 / — | r43 phiên web không chuyển focus | — / 2 |
| r32 ô key `text` | — / 1 | r43 Đóng không chuyển focus | — / 1 |
| r33 vùng live panel rỗng | — / 2 | r44 bỏ link | 1 / 1 |
| r33 vùng live trích xuất rỗng | — / 1 | r45 badge bỏ chế độ phiên | 1 / 1 |
| r36 bỏ kiểm thế hệ | 2 / — | r45 giữ `SourceBadge` trong phiên | — / **0** |
| r36 tăng thế hệ trước khi thay xong | 1 / — | r46 xóa kết quả sau khi kiểm ô | — / 1 |
| r36 đọc thế hệ sau `await` (không hợp lệ) | 1 / — | r48 panel / dòng thời gian / kế tiếp theo vị trí | 1 / 0, 1 / 0, 1 / — |
| r37 trạng thái key muộn đè | — / 1 | r48 TSX `kyc.meta`, `kycNote.sub` | — / **0**, **0** |
| r38 không focus / không `tabIndex` | — / 1, 1 | r50 Nạp lại bỏ Cài đặt AI | 2 / 1 |
| r39 trích xuất bỏ qua phiên web | — / 1 | r15 bỏ ánh xạ / mức ngày cũ / ánh xạ cả STALE / cuộn mã cũ | 2 / 1, 1 / —, 1 / —, — / 1 |
| r40 `busyElsewhere` luôn tắt / bật cả khi tự chạy | 1 / 1, 1 / 1 | | |

## 8. Thời gian

Bắt đầu ≈ 02:00, kết thúc ≈ 02:40 (11/10/2026, giờ máy Home PC). Cuối phiên: `git rev-parse HEAD` = `705ea7c`, `git status --short` của worktree **sạch**.
