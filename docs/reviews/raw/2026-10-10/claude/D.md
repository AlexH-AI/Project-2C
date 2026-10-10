# Deep review Phase 5 — gói D (UI: panel KYC Intelligence, ChatGPT web, AI trích xuất, Cài đặt → AI, khối AI ở Lịch hẹn) — Claude

- **SHA:** `0df3606fb783cc89b1b9c413c02810340e273a4f` (kiểm `git rev-parse HEAD` trong `C:\workspace\Project-2C-review` đầu phiên: khớp).
- **Phiên:** Claude Opus 5.5, phiên sạch, 10/10/2026, không subagent. Không mở / đọc / liệt kê `deep-review-5\codex\`. Đã đọc `common\` (plan, baseline, known) và báo cáo Claude gói A, B, C (`claude\A.md`, `B.md`, `C.md`) để không báo trùng.
- **Không gọi AI thật:** probe chạy trên bản build web của worktree (`e2e/serve.mjs`, Edge, ngày ghim 15/09/2026) với Mock, `asExe` (IPC Tauri giả của `e2e/support.ts`) và `ai_complete` giả trả câu do probe soạn. Không chạy `pnpm eval:ai`, không đụng key / Credential Manager, không mở chatgpt.com (`window.open` / clipboard bị thay trong trang).
- **Worktree:** probe ở `C:\workspace\deep-review-5\claude\D\` (config Playwright riêng, `testDir` ở đây; trong lúc chạy có junction `node_modules` → worktree, **đã gỡ** cuối phiên để phiên tổng hợp chép thư mục không kéo theo `node_modules`). 36 đột biến unit + 12 đột biến TSX (qua e2e) ghi đè file rồi khôi phục từng byte trong `finally`; `dist/` sinh lại bởi build (bị ignore). `git status --short` cuối phiên: **sạch**, HEAD vẫn `0df3606`.

## 1. Phạm vi đã đọc

| File (0df3606) | Dòng | Cách đọc |
|---|---|---|
| `apps/desktop/src/data/ai-analysis.ts` | 1–304 (hết) | đọc từng dòng + đột biến M19–M22, M36 + probe D-E2…D-E4 |
| `apps/desktop/src/data/ai-jobs.ts`, `ai-tauri.ts` | 1–76, 1–75 (hết) | đọc + đột biến M23–M26 |
| `apps/desktop/src/data/app-data.ts`, `main.tsx` | diff Phase 5 (`run`, `ai`, `AI_SETTINGS`, `tauriOpenCode`) | đọc |
| `apps/desktop/src/routes/SettingsAi.tsx`, `settings-ai-view.ts`, `Settings.tsx` | 1–357, 1–107 (hết), diff Phase 5 của `Settings.tsx` | đọc + probe D-E1, D-E3, D-M1 + đột biến M14–M18, X4, X10 |
| `apps/desktop/src/routes/customers/KycIntelligence.tsx` | 1–445 (hết) | đọc + probe D-W*, D-A*, D-M2 + đột biến X2, X5, X6, X9, X11, X12 |
| `.../customers/ai-panel-view.ts` | 1–521 (hết) | đọc + đột biến M1–M8, M28–M35 |
| `.../customers/KycWebSession.tsx`, `KycHistory.tsx` | 1–172, 1–154 (hết) | đọc + probe D-W1…D-W4 + đột biến X1, X3 |
| `.../customers/KycExtraction.tsx`, `extraction-view.ts`, `use-ai-job.ts` | 1–134, 1–83, 1–48 (hết) | đọc + probe D-E5, D-E6 + đột biến M9–M13, X8 |
| `.../customers/KycDialogs.tsx` | diff Phase 5 (`NextVersion`, `FactValue`, `ConfirmFactDialog` 411–490) | đọc + probe D-E5, D-E6 |
| `.../customers/CustomerProfile.tsx`, `CustomerKyc.tsx`, `kyc-view.ts` | diff Phase 5 (panel, `showFact` / `marked`, mã F, `renderNote`, `factCodeTarget`) | đọc + đột biến M32 |
| `apps/desktop/src/routes/appointments/AppointmentAi.tsx`, `appointment-ai-view.ts`, `AppointmentsScreen.tsx` | 1–81, 1–41, diff (dòng 649) | đọc + đột biến M27, X7 |
| `apps/desktop/src/i18n/vi.ts`, `i18n/index.ts` | mọi khóa Phase 5 (`aiPanel.*`, `aiError.*`, `settingsAi.*`, `extraction.*`, `kycConfirm.*`, `appointments.ai.*`), `PLAIN_SLOTS`, `fillSlots` | đọc, so với mockup |
| Test: `ai-analysis.test.ts`, `ai-jobs.test.ts`, `ai-tauri.test.ts`, `ai-panel-view.test.ts`, `extraction-view.test.ts`, `settings-ai-view.test.ts`, `appointment-ai-view.test.ts`; e2e `customer-ai.spec.ts`, `customer-ai-web.spec.ts`, `settings-ai.spec.ts`, `appointments.spec.ts:855–890`, `support.ts` | danh sách ca + đoạn liên quan | đọc để biết phủ gì |
| Chỗ nối (đọc hợp đồng): `packages/ai/src/run.ts:30–45, 95–125, 150–180`, `errors.ts`, `settings.ts:40–95`, `models.ts`, `prompts/connection.ts`; `packages/domain/src/kyc-gate.ts:35–85`; `packages/db/src/kyc.ts:120–200`; `packages/ui/src/components/TextField.tsx` | | |
| Spec / mockup: `docs/design/phase-5-ai.md` §1–§5, §6.1–§6.4, §7.2–§7.3, §8, §9, §12; `docs/design/mockups/ai.html` §1 (1a, 1d), §2 (2d–2f, 2l), §3 (3a–3f), §4 (4e–4i) | | |

Chạy: 9 file test unit của gói D → **163 test xanh** (1,6 s). `tsc -p apps/desktop --noEmit --noUnusedLocals --noUnusedParameters`: **0 lỗi**. Bộ e2e AI (`customer-ai`, `customer-ai-web`, `settings-ai`, `appointments`) trên code gốc: 56 test xanh (là mốc của mọi lần chạy đột biến TSX).

## 2. Phát hiện

### CL-D1 — Lỗi `AI_HTTP` ở panel và AI trích xuất chỉ ghi "OpenCode báo lỗi.", mất mã HTTP và thông điệp server

```
ID: CL-D1
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/customers/ai-panel-view.ts:186–199, 212–216 (AiPanelRun chỉ giữ mã);
        apps/desktop/src/routes/customers/KycIntelligence.tsx:390; extraction-view.ts:53; KycExtraction.tsx:122;
        apps/desktop/src/data/ai-analysis.ts:231–232 (extractFromNote bỏ httpStatus / serverMessage);
        so với settings-ai-view.ts:75–84 (Cài đặt có)
Tình trạng: CONFIRMED
```

- **Mô tả:** spec §5.3 ghi thông báo `AI_HTTP` là "OpenCode báo lỗi (mã HTTP)" và "chỉ mã HTTP và tối đa 200 ký tự đầu của thông điệp lỗi từ server"; mockup 2l (G3) ghi bảng thông báo "dùng chung panel, trích xuất, Cài đặt" với dòng `AI_HTTP` = "OpenCode Go báo lỗi (HTTP 502): ≤ 200 ký tự đầu thông điệp của server". `runAnalysis` đã trả `httpStatus` / `serverMessage` trong kết quả lỗi (`run.ts:36–41, 165–172`), nhưng panel chỉ giữ `code` (`runAfter` → `{ phase: 'error', error }`) và hiện `t('aiError.AI_HTTP')`; `extractFromNote` tự dựng `{ kind: 'error', code }` nên trích xuất cũng mất. Chỉ Cài đặt → AI dùng `errorText` có mã.
- **Tái hiện** (`probe-exe.spec.ts` D-E3, `asExe`, `ai_complete` từ chối `{ code: 'AI_HTTP', httpStatus: 502, message: 'Bad gateway' }`):

| Nơi | Chữ hiện |
|---|---|
| Panel KYC Intelligence | `OpenCode báo lỗi.` + Thử lại |
| Cài đặt → Kiểm tra kết nối (cùng lỗi) | `OpenCode báo lỗi (HTTP 502): Bad gateway` |

- **Ảnh hưởng:** RE / Owner gặp 5xx, 404 (model bị gỡ), 400 của OpenCode khi Phân tích hay AI trích xuất thì không biết mã / lý do, phải sang Cài đặt kiểm kết nối để thấy. Không mất dữ liệu.
- **Đề xuất:** cho `AiPanelRun` / `ExtractionView` lỗi giữ `httpStatus` + `serverMessage`, `extractFromNote` chuyển nguyên kết quả lỗi, hai màn dùng chung `errorText` (đưa khỏi `settings-ai-view.ts` sang chỗ chung). Cỡ: ~25 dòng SP + ~30 dòng test, có thể gộp CL-D6.

### CL-D2 — Ô nhập API key là ô chữ thường: key hiện rõ khi dán và còn hiện sau lần lưu lỗi

```
ID: CL-D2
Mức: Low
Trục: S
Vị trí: apps/desktop/src/routes/SettingsAi.tsx:220–227 (TextField không type); packages/ui/src/components/TextField.tsx:3–53 (không có prop type / spellCheck)
Tình trạng: CONFIRMED
```

- **Mô tả:** spec §4.3 / ADR-0009 D-1 mục 4: "Ô nhập key **chỉ ghi**: không bao giờ hiện lại giá trị". Code không hiện key đã lưu (đúng), nhưng ô nhập là `<input>` mặc định (`type` không đặt = `text`), không tắt `spellcheck`: key hiện nguyên văn trên màn khi dán, và khi `ai_key_set` lỗi (`AI_KEYRING`) code giữ `text` để thử lại nên key vẫn nằm trên màn cùng thông báo lỗi.
- **Tái hiện** (`probe-exe.spec.ts` D-E1): `getAttribute('type')` = `null`, `autocomplete` = `off`, `spellcheck` = `null`; dán `sk-probe-SECRET-0123456789`, cho `ai_key_set` từ chối `AI_KEYRING` → `inputValue()` vẫn là `sk-probe-SECRET-0123456789`, hiện trong ô.
- **Ảnh hưởng:** chia sẻ màn hình / quay màn / người đứng cạnh thấy key OpenCode (gói Credit tốn tiền theo yêu cầu). Key không lọt vào DOM văn bản khác, DB, backup (e2e `settings-ai.spec.ts` đã kiểm `page.content()` sau khi lưu thành công).
- **Đề xuất:** thêm prop `type` (và `spellCheck`) cho `TextField`, ô key dùng `type="password"` + `spellCheck={false}`; giữ hành vi giữ chữ khi lưu lỗi (đã che). Cỡ: ~10 dòng SP (`packages/ui` + `SettingsAi.tsx`) + 1 dòng e2e.

### CL-D3 — Phân tích xong không được báo cho trình đọc màn hình

```
ID: CL-D3
Mức: Low
Trục: A
Vị trí: apps/desktop/src/routes/customers/KycIntelligence.tsx:218–232 (BusyLine role=status), 371–380, 422–428 (kết quả không nằm trong vùng live)
Tình trạng: CONFIRMED
```

- **Mô tả:** lúc chạy, `BusyLine` có `role="status"` nên "Đang phân tích…" được đọc; lỗi có `role="alert"`. Khi lưu xong (ACCEPTED hay REJECTED), `BusyLine` biến mất và kết quả / dòng "bị loại" hiện ở chỗ không phải vùng live → người dùng trình đọc màn hình không được báo đã xong (trạng thái chạy tới 2 × 120 s). Cùng khuôn ở AI trích xuất: kết quả đề xuất (`KycExtraction.tsx:87–112`) không có vùng live, chỉ ca "0 đề xuất" có `role="status"`.
- **Tái hiện** (`probe-web.spec.ts` D-W5, Mock, `MutationObserver` ghi mọi thay đổi trong `[role=status],[role=alert],[aria-live]`): suốt lần phân tích chỉ có một thay đổi `status: Đang phân tích…Hủy`; khi CURRENT hiện ra: không thay đổi nào trong vùng live.
- **Ảnh hưởng:** RE dùng trình đọc màn hình phải tự dò panel để biết đã xong / bị loại.
- **Đề xuất:** một vùng `role="status"` (có thể `sr-only`) trong panel nói "Đã lưu phân tích" / "Lần phân tích bị loại" khi `ended.kind === 'saved'`; tương tự "AI đề xuất n dữ kiện" ở trích xuất. Cỡ: ~15 dòng SP + i18n; cần e2e kiểm vai `status`.

### CL-D4 — 13 / 48 đột biến của gói D sống, 9 có nghĩa (1 unit, 8 TSX chỉ có e2e phủ)

```
ID: CL-D4
Mức: Low
Trục: T
Vị trí: xem bảng; unit: apps/desktop/src/data/ai-analysis.ts:165; TSX: KycIntelligence.tsx, KycWebSession.tsx, SettingsAi.tsx
Tình trạng: CONFIRMED
```

- **Mô tả / bằng chứng:** `node mutate.mjs` (36 đột biến unit, 163 test) và `node mutate-e2e.mjs` (12 đột biến TSX, 56 test e2e AI, build lại mỗi lần). Kết quả đầy đủ ở `D\mutate-out.txt`, `D\mutate-e2e-out.txt`. Đột biến sống có nghĩa:

| # | Đột biến | Hậu quả khi code sai mà test vẫn xanh |
|---|---|---|
| M21 | `GONE` bỏ `KYC_VERSION_NOT_FOUND` | Nhập backup cũ hơn (KH còn, phiên bản mới nhất không còn) khi AI đang chạy → panel báo "Có lỗi trong app…" và `reportError` thay vì lặng lẽ bỏ. Test "Nạp lại" chỉ phủ ca KH không còn |
| X2 | nút AI không tắt trong lúc copy / mở trình duyệt (`startingWeb`) | bấm đúp "Phân tích bằng ChatGPT web" mở hai lần copy + mở trang |
| X3 | bỏ chốt "copy chậm chỉ cập nhật đúng phiên của nó" (`KycWebSession.tsx:59–60`) | copy chậm của phiên cũ ghi đè `manual` của phiên / lần thử mới (review PR 459 đã sửa, không test giữ) |
| X5 | dòng REJECTED hiện cả khi phiên web đang mở | hai thông báo lỗi chồng nhau (review PR 459) |
| X6 | bỏ `analysis.clear()` khi mở phiên web | lỗi Phân tích cũ nằm cạnh phiên web (review PR 459) |
| X9 | nút Thử lại của lỗi không tắt khi runner bận | Thử lại trong lúc yêu cầu khác chạy → `AI_BUSY` |
| X10 | nút "Xóa key…" hiện cả khi chưa có key | (mockup 1d) |
| X11 | dòng lỗi mở phiên web hiện cả khi phiên đã mở | thông báo lỗi cũ còn lại |
| X12 | bản cũ không mờ khi đang chạy | (mockup 2d) |

  Sống nhưng tương đương / đã có e2e: M7 (`unusable` EMPTY không tới được từ UI vì nút tắt khi rỗng), M28 (dữ kiện cùng trường của cảnh báo mâu thuẫn phụ luôn là `conflict`), M31 (DB buộc token `null` với Mock / ChatGPT web), M36 (`takenAt` — e2e kiểm "chụp 15/09 hh:mm"). Đột biến bị loại khỏi đếm: lần chạy đầu của M19 (lỗi `ReferenceError`, chạy lại: bị giết) và X2 bản đầu (`tsc` đỏ vì biến thừa, chạy lại bản khác: sống).
- **Ảnh hưởng:** các sửa của review PR 459 / 468 ở phần TSX chỉ được giữ bằng đọc code; hồi quy sẽ không bị CI bắt.
- **Đề xuất:** thêm 1 ca unit `analyseCustomer` (KH còn, phiên bản bị thay → `discarded`); 3–4 ca e2e: bấm đúp nút ChatGPT web (kiểm `copied.length === 1`), Thử lại tắt khi runner bận (`holdAi` + Kiểm tra kết nối), dòng REJECTED / lỗi cũ ẩn khi phiên web mở, nút "Xóa key…" chỉ khi đã có key. Cỡ: ~100 dòng test.

### CL-D5 — Dòng "Đang phân tích… · <model>" ghi model của Cài đặt hiện tại, không phải model của yêu cầu đang chạy

```
ID: CL-D5
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/customers/KycIntelligence.tsx:322, 374–380
Tình trạng: CONFIRMED
```

- **Mô tả:** `settings = app.ai.settings()` đọc lại mỗi lần render; yêu cầu thì chạy với cài đặt đọc lúc bấm (`ai.call()`).
- **Tái hiện** (`probe-exe.spec.ts` D-E2, `holdAi`): bấm Phân tích với DeepSeek V4.1 Flash (`aiCalls[0].model` = `deepseek-v4.1-flash`), sang Cài đặt đổi model Kimi K3, quay lại → "Đang phân tích… · Kimi K3 · tối đa 2 phút mỗi lần thử"; đổi provider sang Mock → phần chi tiết mất hẳn dù yêu cầu OpenCode vẫn chạy. Dòng lưu sau đó ghi đúng "DeepSeek V4.1 Flash".
- **Ảnh hưởng:** chỉ chữ trạng thái sai trong lúc chờ.
- **Đề xuất:** giữ `settings` của lần bấm trong job (`AiJobs` entry) và hiện từ đó. Cỡ: ~10 dòng.

### CL-D6 — Thông báo `AI_NO_KEY` không có liên kết tới Cài đặt → AI như mockup 2f / 2l

```
ID: CL-D6
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/customers/KycIntelligence.tsx:388–395; KycExtraction.tsx:119–128; vi.ts `aiError.AI_NO_KEY`
Tình trạng: CONFIRMED
```

- **Mô tả:** mockup 2f và bảng 2l (G3) có "nhập ở <a>Cài đặt → AI</a>"; app hiện chữ phẳng.
- **Tái hiện:** D-E3: alert `AI_NO_KEY` của panel có 0 liên kết.
- **Đề xuất:** khuôn câu có chỗ cho link (`withNames`-style) tới `#/settings` mục AI. Cỡ: ~10 dòng; gộp với CL-D1.

### CL-D7 — Trong phiên ChatGPT web, đầu panel không hiện badge chế độ của ảnh chụp

```
ID: CL-D7
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/customers/ai-panel-view.ts:89; KycIntelligence.tsx:334
Tình trạng: CONFIRMED
```

- **Mô tả:** spec §9.1 dòng "Phiên web: chờ dán": "badge chế độ + 'kyc v<seq>' của ảnh chụp"; mockup 4e có badge `PAIN_POINT_ANALYSIS` ở đầu panel. Code luôn tính badge đầu theo bản đã lưu (CURRENT / STALE) hoặc cổng **hiện tại**; chế độ của ảnh chụp chỉ còn trong tên prompt của chip.
- **Tái hiện** (`probe-more.spec.ts` D-M2): KH có bản Mock CURRENT, mở phiên web → badge đầu "CURRENT"; thêm dữ kiện cho cổng sang `PAIN_POINT_ANALYSIS` trong lúc phiên (chụp ở discovery) còn mở → badge "STALE", chip "kyc v2 · discovery@1+web@1 · chụp 15/09 14:24".
- **Ảnh hưởng:** dễ đọc nhầm chế độ của câu trả lời sắp dán; dữ liệu lưu đúng (gắn ảnh chụp).
- **Đề xuất:** khi `web` mở, badge đầu = `web.session.input.mode` → `gate_state` của ảnh chụp. Cỡ: ~5 dòng + 1 ca unit.

### CL-D8 — Lưu key với ô trống ngay sau khi lưu thành công hiện cùng lúc "Chưa nhập key." và "Đã lưu key."

```
ID: CL-D8
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/SettingsAi.tsx:164–171
Tình trạng: CONFIRMED
```

- **Mô tả:** nhánh lỗi tại ô `return` trước `setOutcome(undefined)`, nên kết quả lần trước còn hiện.
- **Tái hiện** (D-M1): lưu key → "Đã lưu key."; bấm Lưu key lần nữa (ô đã trống) → thẻ ghi "… Chưa nhập key. … Đã lưu key. …".
- **Đề xuất:** `setOutcome(undefined)` trước khi kiểm ô. 1 dòng.

### CL-D9 — Dấu phân cách " / " viết cứng trong câu mâu thuẫn phụ

```
ID: CL-D9
Mức: Nit
Trục: A (i18n)
Vị trí: apps/desktop/src/routes/customers/KycIntelligence.tsx:174
Tình trạng: CONFIRMED (đọc code)
```

- `codes.join(' / ')` thay vì khóa `sep.*` như mọi chỗ khác (`joinParts`, `t('sep.list')`). Đề xuất: thêm `sep.slash` hoặc đưa vào khuôn `aiPanel.conflict`. 1–2 dòng.

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | G | C | D | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | | 0 |
| High | | | | | | | | | | 0 |
| Medium | | | | | | | | | | 0 |
| Low | | | 1 (D1) | | 1 (D2) | | | 1 (D4) | 1 (D3) | 4 |
| Nit | | | 4 (D5, D6, D7, D8) | | | | | | 1 (D9) | 5 |
| **Tổng** | 0 | 0 | 5 | 0 | 1 | 0 | 0 | 1 | 2 | **9** |

KNOWN không nêu lại (probe không cho bằng chứng mới): kết quả lỗi của lần chạy mất khi rời màn (`use-ai-job.ts:23`, #468); `AiJobs.start` ghi đè khóa (#468); `ConfirmFactDialog` báo `refused` muộn, nhãn "Ghi chú KYC" theo nút, dấu `:` cứng, khối đang chạy lặp giữa `KycExtraction` / `KycIntelligence`, `comparable` ↔ `collapseSpaces` (#469); dòng 1g khó xóa, kết quả kiểm kết nối cũ còn hiện, thiếu phần đậm "Phân tích bằng ChatGPT web:", e2e 1g (#444, #452); `dayAndTime` tách chuỗi (#438); mã F trên dòng thời gian (#462). Liên quan gói trước: panel ném `ZodError` khi `output` sai schema (CL-B1), chip hiện `model` dài nguyên văn (CL-B4), `extractJson` O(n²) (CL-A5 — đo thêm ở UI: dán `{`×20 000 vào khung ChatGPT web, "Kiểm tra và lưu" mất **419 ms**, cùng gốc, không báo thêm).

## 4. Đã xét, không thấy

- **E — Edge case:**
  - **Bấm đúp "Kiểm tra và lưu"** (A ghi `checkWebAnswer` thuần, chống đúp phải ở UI): D-W1 `dblclick` → lịch sử **1** dòng (click là sự kiện rời rạc, React flush đồng bộ nên lần 2 gặp phiên đã đóng).
  - **Nạp lại khi AI đang chạy** (D-E4, `holdAi`): nút Nạp lại vẫn bấm được (spec không cấm), dữ liệu thay, thả `ai_complete` → không lỗi console, không ghi gì (KH không còn → `discarded`, `ai-analysis.ts:207–211`); runner vẫn bận tới khi Rust trả (P5). Thay bằng dữ liệu có cùng KH + phiên bản (backup cùng DB) thì kết quả ghi vào DB mới — nhất quán vì phiên bản KYC bất biến theo id.
  - **Rời / quay lại Hồ sơ KH**: `CustomerProfile` có `key={route.id}` (`Screen.tsx:18`), panel `key={customer.id}` → phiên web, `ended`, `picked` không lẫn giữa KH. Dòng thời gian khóa `key={event.id}` → trạng thái đề xuất trích xuất không lệch sang ghi chú khác khi có ghi chú `SYSTEM` mới.
  - **Đổi KYC trong lúc phiên web mở / cổng sang chặn**: phiên vẫn lưu được, gắn ảnh chụp (STALE) — đúng §3.1 điểm 6 (e2e có); badge xem CL-D7.
  - **Dán rỗng / chỉ khoảng trắng / > 20 000 / 2 MB** (D-W3, chữ `a`): 20 000 → tính lần thử (V1), 20 001 / 200 000 / 2 000 000 → báo tại khung, không tính lần thử. Số đo ở trục P.
  - **Copy không bao giờ trả lời** (D-W4, `writeText` treo): cả hai nút tắt mãi, không thông báo, tới khi rời màn. Không báo thành phát hiện: không tái hiện được trên WebView2 thật (clipboard của Tauri trả ngay hoặc từ chối), chỉ ghi lại.
  - **20 đề xuất × 300 ký tự** (D-E6): hiện đủ 20, Xác nhận một cái còn 19, hộp 3f lần 2 đúng trường. Đề xuất không bao giờ tự lưu: chỉ `ConfirmFactDialog` gọi `confirmKycFact` / `markKycConflict` sau khi RE bấm (đọc `KycExtraction.tsx:100`, `KycDialogs.tsx:449–459`).
  - **Tải lại webview khi AI chạy trong exe**: runner mới không bận, Rust còn cờ → lần bấm tiếp nhận `AI_BUSY` và hiện câu §5.3 (đúng vai "chốt thứ hai" §5.2); đọc code, không tái hiện được trên exe thật trong phiên chỉ đọc.
- **G — Guardrail:** UI không có đường nào ghi dữ liệu KYC từ AI: đề xuất chỉ nằm trong state của `NoteEvent`, phân tích chỉ qua `recordAiAnalysis`; REJECTED chỉ hiện báo cáo validator, không hiện `raw_output` (hộp 2k, e2e kiểm). Chip Mock / "ChatGPT web" theo `provider`, không theo `model === null` (`analysisSource`).
- **C — Hợp đồng:** nhãn theo nghĩa thường khớp: "Lịch sử phân tích" mới nhất trên theo `seq` (M30 bị giết), REJECTED không bao giờ là kết quả (M27, M33–M35 bị giết), "Còn 1 lần thử", "Lần thử 1 / 2", "(lần thử 2 / 2)" khớp số lần thử thật, "Hạng mục còn thiếu" chỉ lấy hạng mục tối thiểu của cổng (`KYC_INSUFFICIENT` luôn có ít nhất một, `kyc-gate.ts:43`). Ngoài CL-D1, D5–D8, chữ i18n khớp mockup 1a–1g, 2b–2l, 3b–3f, 4d–4i (đã trừ KNOWN).
- **D — Dữ liệu:** Cài đặt → AI chỉ ghi 4 trường (`ai-analysis.ts:123–124`, M19 bị giết), đọc lại theo `db` hiện hành sau Nạp lại / Nhập (closure `let db`). Mọi ghi qua `app.run` → `changed()` → màn đọc lại; panel hiện theo `listAiAnalyses`, không theo kết quả trả về (review PR 437).
- **S — An toàn:**
  - Output model và câu dán chỉ hiện dạng chữ: D-W2 dán `<img src=x onerror="window.__xss=1">Khách <b>đậm</b>` và `[Mở trang](javascript:…)` → hiện nguyên văn, 0 `img`, 0 link `javascript:`, `__xss` = null; D-E5 trích xuất có `value` = `<a href="javascript:…">Huế</a>` và `quote` là thẻ `<img onerror>` (lấy từ ghi chú) → hiện chữ ở đề xuất, ô giá trị hộp 3f và sau khi lưu; 0 `img`, 0 link. Không có `dangerouslySetInnerHTML` / `innerHTML` trong `apps/desktop/src` (rg).
  - Key: không lệnh nào trả key; `ai.save` lọc 4 trường; thông báo lỗi Cài đặt chỉ có mã HTTP + `serverMessage` (≤ 200, gói C lo che); ô key xem CL-D2.
  - Mở URL ngoài: web mode `window.open(CHATGPT_URL, '_blank', 'noopener')` (M22 bị giết), exe gọi `open_chatgpt` không tham số; tin nhắn copy không chứa tên KH (e2e kiểm).
- **P — Hiệu năng** (D-W3, Edge, build production, chữ `a`): dán 20 000 ký tự: `fill` 6–12 ms, một phím 8–10 ms, "Kiểm tra và lưu" 28–35 ms; 200 000: 72 / 34 / 32 ms; 2 000 000: 228 / **194** / 77 ms (ô điều khiển bởi React chậm khi dán cả 2 MB, nhưng đó là câu trả lời sai vẫn bị từ chối tại khung — không báo). Lịch sử dài không đo lại ở UI: B đo `listAiAnalyses` 2 000 dòng 25,5 ms; bảng lịch sử không ảo hóa nhưng một KH vài chục lần phân tích là thực tế.
- **B — Thừa / lặp:** `tsc --noUnusedLocals --noUnusedParameters` trên `apps/desktop`: 0 lỗi. Lặp markup đang chạy / lỗi giữa trích xuất và panel là KNOWN (#469). Không thấy export thừa mới.
- **T — Test:** 31 / 36 đột biến unit và 4 / 12 đột biến TSX bị giết; 13 sống, trong đó 9 có nghĩa (CL-D4) (M7, M28, M31, M36 sống nhưng tương đương / có e2e — xem CL-D4). Test unit không phụ thuộc ngày thật (ngày ghim), e2e dùng `VITE_DEMO_ANCHOR`.
- **A — Trợ năng / i18n:**
  - Bàn phím (D-A1, D-A2): Enter trên Phân tích → focus ở nút (đã tắt), Tab tới Hủy; xong yêu cầu khi focus đang ở Hủy → Hủy biến mất, focus về `body` (hành vi trình duyệt khi phần tử bị gỡ; không báo riêng). Mở phiên web → Tab tới khung "Dán kết quả".
  - Bảng lịch sử: dòng mở được bằng nút ở ô đầu (`aria-label` "Xem lần …"), cột trạng thái có tiêu đề `sr-only`, dòng đang xem `aria-current`. Thông báo lỗi `role="alert"`, trạng thái chạy `role="status"` (thiếu báo xong: CL-D3). Nút AI tắt ở KH khác khi runner bận không có câu giải thích — mockup 2d chỉ yêu cầu tắt, không báo.
  - Chuỗi cứng: quét JSX của 7 file TSX gói D (`>text<`, `join('…')`): ngoài CL-D9 và KNOWN (`:` ở `KycExtraction.tsx:96`), `'; '` ở `KycDialogs.tsx:109` là code Phase 4 chuyển chỗ (không mới).

## 5. Phụ lục — nguồn probe (trong `C:\workspace\deep-review-5\claude\D\`)

Chạy: tạo lại junction `node_modules` → `C:\workspace\Project-2C-review\node_modules` (`New-Item -ItemType Junction`), rồi trong `D\`: `node node_modules/@playwright/test/cli.js test <file>`; config dựng bản web bằng `e2e/serve.mjs` của worktree ở cổng 4183, ngày ghim 15/09/2026.

| File | Làm gì |
|---|---|
| `playwright.config.ts`, `package.json` | config riêng (`testDir` = `D\`, Edge), đánh dấu ESM để import `e2e/support.ts` của worktree |
| `probe-web.spec.ts` | D-W1 bấm đúp Kiểm tra và lưu; D-W2 HTML / markdown trong câu dán; D-W3 cỡ câu dán (thời gian); D-W4 copy treo; D-W5 vùng live khi phân tích Mock (CL-D3) |
| `probe-exe.spec.ts` | `asExe` + `ai_complete` theo kịch bản: D-E1 ô key (CL-D2); D-E2 dòng đang chạy (CL-D5); D-E3 `AI_HTTP` / `AI_NO_KEY` ở panel và Cài đặt (CL-D1, CL-D6); D-E4 Nạp lại khi AI chạy; D-E5 HTML trong trích xuất; D-E6 20 đề xuất |
| `probe-a11y.spec.ts` | D-A1, D-A2 focus bàn phím |
| `probe-more.spec.ts` | D-M1 thẻ key (CL-D8); D-M2 badge đầu trong phiên web (CL-D7) |
| `mutate.mjs` (+ `mutate-out.txt`) | 36 đột biến một chỗ trên `ai-panel-view.ts`, `extraction-view.ts`, `settings-ai-view.ts`, `ai-analysis.ts`, `ai-jobs.ts`, `ai-tauri.ts`, `appointment-ai-view.ts`, `kyc-view.ts`; chạy 9 file test unit; khôi phục từng byte — `node D\mutate.mjs [Mx …]` (cwd worktree) |
| `mutate-e2e.mjs` (+ `mutate-e2e-out.txt`, `mutate-e2e-run.log`) | 12 đột biến TSX; mỗi lần chạy 4 spec e2e AI của repo (`--project edge --no-deps`, build lại); khôi phục từng byte — `node D\mutate-e2e.mjs [Xn …]` (cwd worktree) |

### Đầu ra chính (rút gọn)

```
D-W1 rows after dblclick: 1
D-W2 img in panel: 0 · links in panel: 0 · __xss: null
D-W3 size 2000000: fill 228 ms, one key 194 ms, check 77 ms
D-W3 size 200000: fill 72 ms, one key 34 ms, check 32 ms
D-W3 size 20001: fill 12 ms, one key 8 ms, check 35 ms
D-W3 size 20000: fill 6 ms, one key 10 ms, check 28 ms → counted as attempt 1 (V1)
D-W4 after 3 s: web button disabled true · analyse disabled true · any status/alert text: []
D-W5 live-region changes: ["status: Đang phân tích…Hủy"]
D-E1 input type: null · autocomplete: off · spellcheck: null
D-E1 field value after the failed save: sk-probe-SECRET-0123456789
D-E2 model sent: deepseek-v4.1-flash · running line now: Đang phân tích… · Kimi K3 · tối đa 2 phút mỗi lần thử
D-E2 after switching to Mock, running line: Đang phân tích…
D-E3 panel alert: OpenCode báo lỗi. | Thử lại
D-E3 AI_NO_KEY links in alert: 0
D-E3 settings alert: OpenCode báo lỗi (HTTP 502): Bad gateway
D-E4 Nạp lại enabled while the AI runs: true · errors: []
D-E5 proposal text: AI đề xuất: Nơi sinh sống: <a href="javascript:window.__xss=2">Huế</a> ("<img src=x onerror="window.__xss=1">")
D-E5 img / js links in main: 0 0 · __xss: null
D-E6 proposals shown: 20 · left after one Xác nhận: 19
D-A1 focus while running: BUTTON:Phân tích · after one Tab: BUTTON:Hủy · after the answer: BODY
D-A2 focus in the session: BODY · after one Tab: TEXTAREA
D-M1 card says: … Chưa nhập key. … Đã lưu key. …
D-M2 head badge in the session: CURRENT · after the KYC change: STALE · chip: kyc v2 · discovery@1+web@1 · chụp 15/09 14:24
(CL-A5, UI) '{'×20000: check 419 ms
```
