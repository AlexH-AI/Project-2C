XONG — claude gói C, 14/10/2026 00:04

# Deep review Phase 1–6, lượt 1 — Claude, gói C (AI)

## 1. Đầu phiên

| | |
|---|---|
| Bên | Claude (Claude Code, model Opus 5.5), phiên sạch, chỉ đọc |
| Gói | **C. AI** — `packages/ai/**` + file AI của app (`ai-*`, `*-ai-*`, `*Ai.tsx`, `KycExtraction`, `KycIntelligence`, `KycWebSession`, `KycHistory`, `extraction-view`) |
| Worktree | `C:\workspace\Project-2C-review` |
| SHA đầu phiên | `885534549808f42aec7f9af5743bbf86642ee4bd` (`git rev-parse HEAD`) = SHA ghim |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 13/10/2026 23:17 (+07:00) |
| Bước 0 | chữ gói `C` hợp lệ; `claude\C.md` chưa có (`Test-Path` → False) → làm mới; `claude\A.md` dòng đầu `XONG — claude gói A, 13/10/2026 22:44`, `claude\B.md` dòng đầu `XONG — claude gói B, 13/10/2026 23:16` |
| Máy | Home PC `DESKTOP-KDURKJP`, Node v24.20.0 |

## 2. Phạm vi đã đọc

Danh sách file gói C lấy đúng luật `classifyFile` của `tools/size-report-core.mjs` (`claude\C\list.mjs`): 60 file, **5 129 dòng SP / 5 985 dòng test** (khớp `plan.md` §3).

**Code sản phẩm (đọc hết từng dòng, ở SHA ghim):**

- `packages/ai/src`: `schema.ts` (356), `validator.ts` (269), `text-match.ts` (74), `blocklists.ts` (108), `run.ts` (428), `web.ts` (150), `extract-json.ts` (84), `code-points.ts` (45), `errors.ts` (56), `adapter.ts` (43), `input.ts` (29), `mock-adapter.ts` (112), `models.ts` (35), `settings.ts` (86), `index.ts` (11), `raw.d.ts` (5), `prompts/retry.ts` (63), `prompts/connection.ts` (14), `prompts/extraction.ts` (27), `prompts/analysis.ts` (48), `prompts/discovery.ts` (43; đầu / cuối file, chữ prompt do `prompts.test.ts` so với G5).
- App: `src/data/ai-analysis.ts` (333), `ai-jobs.ts` (82), `ai-tauri.ts` (75); `src/routes/SettingsAi.tsx` (387), `settings-ai-view.ts` (87), `ai-error-view.ts` (66); `routes/customers/KycIntelligence.tsx` (572), `ai-panel-view.ts` (622), `KycWebSession.tsx` (191), `KycHistory.tsx` (154), `KycExtraction.tsx` (180), `extraction-view.ts` (106), `use-ai-job.ts` (53); `routes/appointments/AppointmentAi.tsx` (86), `appointment-ai-view.ts` (49).

**Code gói khác mà gói C nối vào (chỉ chỗ nối):** `packages/domain/src/kyc-gate.ts` (hết), `kyc-fact.ts` (hết, `normalizeKycValue`), `kyc-catalog.ts` (`KYC_FIELDS`); `packages/db/src/kyc.ts` (danh sách lệnh, chỗ ghi phiên bản), `ids.ts`; `apps/desktop/src/data/app-data.ts:280-436` (`replace` / `swap`, `generation`, `replacing`, `reloadDemoData`, `ai`), `AppDataContext.tsx`; `routes/Settings.tsx:100-175` (hộp Nạp lại), `routes/Screen.tsx`, `routes/customers/CustomerProfile.tsx` (chỗ gắn `KycIntelligence key={customer.id}`); `shell/block-reload.ts`; `i18n/index.ts` (`fillSlots`); `packages/ui/src/components/TextField.tsx` (không có `maxLength`).

**Tài liệu:** `CLAUDE.md` gốc + `packages/ai/CLAUDE.md`, `apps/desktop/CLAUDE.md`; `docs/design/phase-5-ai.md` (hết), `docs/design/phase-5-prompts.md` (hết, gồm §10), ADR-0009 (hết, phụ lục D-1, G5, W-1); `common\plan.md` §1–§12, `known.md`, báo cáo `claude\A.md`, `claude\B.md` (để không báo lại).

Thêm: `docs/golden/ai-eval.md` (hết), `docs/design/phase-6-hoan-thien.md` (các dòng nói về AI: §4.1 S2-3, §4.2 TR-4 / TR-9), ADR-0013 (dòng tương phản), mockup `docs/design/mockups/ai.html` (đối chiếu chữ các mục 1f, 2a, 2e, 2k, 4d–4h; lớp `.faded`), `db/src/ai-analyses.ts` (hết: lệnh ghi, luật 12–13, CURRENT / STALE), `routes/customers/KycDialogs.tsx:426-500` (`ConfirmFactDialog`, đường Xác nhận đề xuất trích xuất), `routes/customers/kyc-view.ts:74-100` (`factInEffect`, `factCodeTarget`), `shell/useRoute.ts` (router nghe `hashchange`), `i18n/vi.ts` (mọi khóa `aiPanel.*`, `extraction.*`, `settingsAi.*`, `aiError.*`, `appointments.ai.*`), `packages/ui/src/tokens.css` (token màu).

**Test (đọc tên mọi ca, đọc kỹ chỗ cần):** `run.test.ts`, `web.test.ts` (ca tin nhắn của app :255-380), `validator.test.ts`, `validator-blocklists.test.ts`, `blocklists.test.ts` (đọc bảng G5 từ file), `prompts.test.ts`, `ai-analysis.test.ts` (helper :1-137, ca xóa / thay dữ liệu :286-356), `ai-panel-view.test.ts`, `extraction-view.test.ts`, `ai-jobs.test.ts`; tên ca e2e `customer-ai.spec.ts`, `customer-ai-web.spec.ts`, `settings-ai.spec.ts`.

## 3. Phát hiện

### CL-C1 — V6 lọt khi giữa "Điều" / "Luật" / "khoản n" và phần sau chỉ có ký tự vô hình

```
ID: CL-C1
Mức: Low
Trục: G
Vị trí: packages/ai/src/blocklists.ts:93 (LAW_NAME: `${ci('luật')}\s+…`), :97 (`(Điều|ĐIỀU)\s+${D}+`), :98 (`khoản\s+${D}+[,]?\s+điều\s+${D}+`); packages/ai/src/text-match.ts:22-24 (cleanText bỏ \p{Cf} trước khi so) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** bước 0 của G5 §7 bỏ mọi ký tự `\p{Cf}` trước khi so, rồi G5 §7 mục 4 / §10.2 cho khoảng trắng *trong cụm* và *dấu cách viết trong mẫu* khớp 0 hoặc 1 dấu cách, để "xác" + U+200B + "suất" vẫn bị chặn (DR5-01). Nhưng ba mẫu V6 dùng `\s+` (không phải dấu cách viết), nên khi giữa hai phần chỉ có U+200B / U+2060 thì sau bước 0 hai phần dính nhau và mẫu không khớp. Code đúng chữ bảng G5 §8.4; chỗ hở nằm giữa ý của G5 §10.2 và chữ của bảng.
- **Tái hiện:** `node p1-validator.mjs` (log `claude\C\p1-validator.log`), `validateOutput('analysis', …)` với một `hypotheses[0].text`:
  - `"Theo Điều 35 thì KH cần lưu ý"` → `V6 hypotheses[0].text có "Điều 35"`; `"Theo Điều\u200B35 …"` → **đạt**; `"Theo Điều\u206035 …"` → **đạt**.
  - `"Theo Luật Kinh doanh bảo hiểm"` → `V6 … có "Luật K"`; `"Theo Luật\u200BKinh doanh bảo hiểm"` → **đạt**.
  - `"Theo khoản 2\u200Bđiều 35"` → **đạt**.
  - Đối chứng: cụm / mẫu có dấu cách viết vẫn chặn: `"Nghị\u200Bđịnh 46"` → `V6 … có "nghị định"`, `"Quyết định số\u200B123/QĐ"` → `V6 … có "quyết định số1"`, `"bảo hiểm\u200Btrọn đời"` → `V4`.
- **Ảnh hưởng:** chỉ khi model (hoặc câu trả lời dán từ ChatGPT web) viết ký tự vô hình đúng chỗ đó — output suy biến, model không đối kháng (G5 §10.10). Trên màn, U+200B không hiện nên RE đọc thấy "Điều35", "LuậtKinh doanh bảo hiểm": vẫn là một trích dẫn pháp lý lọt qua V6.
- **Đề xuất:** **cần G5** (đổi danh sách chặn): cho phần khoảng trắng của ba mẫu khớp cả 0 ký tự khi chỗ đó có ký tự `\p{Cf}` bị bỏ (vd. thay `\p{Cf}` bằng một dấu cách đánh dấu trước khi so, hoặc `\s*` cho "Điều"/"khoản" vì sau chúng là chữ số). ≈ 5 dòng SP + 3 ca kiểm (C55–C57) ở `validator-blocklists.test.ts`; không đổi chữ prompt.

### CL-C2 — Bản phân tích STALE (và lúc đang chạy / cổng chặn) hiện mờ 50 %: chữ dưới WCAG AA, dòng "Mức bằng chứng" chỉ 2,38:1

```
ID: CL-C2
Mức: Low
Trục: A, C
Vị trí: apps/desktop/src/routes/customers/KycIntelligence.tsx:433-437, :545 (opacity-50 khi STALE / đang chạy / đang hủy / cổng chặn); apps/desktop/src/routes/appointments/AppointmentAi.tsx:68 (opacity-50 khi STALE); docs/design/mockups/ai.html:147-149 (.faded { opacity: 0.5 }) — so với docs/decisions/0013-huong-ui-dark-mode.md:19 (8855345)
Tình trạng: CONFIRMED (tính tương phản từ token)
```

- **Mô tả:** mockup G3 cho bản STALE "mờ" bằng `opacity: 0.5`; app làm đúng mockup bằng `opacity-50` trên cả khối phân tích. ADR-0013 (G3) chốt "Mọi cặp chữ/nền đạt WCAG AA (thấp nhất 4,89:1)". Mờ 50 % kéo mọi cặp chữ/nền trong khối xuống dưới 4,5:1, trong khi khối STALE vẫn là nội dung RE phải đọc (spec §9.1 "Hiện bản đó mờ + lời nhắc"; khối lịch hẹn §9.2 cũng hiện STALE). Mockup và ADR mâu thuẫn nhau.
- **Bằng chứng:** `node p5-contrast.mjs` (log `claude\C\p5-contrast.log`), token tối của `packages/ui/src/tokens.css:7-17`, độ mờ của nhóm phủ lên nền thẻ `--bg-1`:
  - chữ phần tử (`--text` trên `--bg-2`): 13,79:1 → **4,43:1**;
  - dòng "Bằng chứng … · Mức bằng chứng …" (`text-fg-3`): 5,61:1 → **2,38:1**;
  - chip "kyc v… · prompt · model · giờ" (`text-fg-2`): 8,17:1 → **3,04:1**; badge chế độ (`--info`): 7,41:1 → 2,80:1.
- **Ảnh hưởng:** RE xem hồ sơ có phân tích STALE (mọi lần KYC đổi sau phân tích — rất thường), hoặc lúc đang phân tích lại; khó đọc nhất là dòng mức bằng chứng. Chỉ sai hiển thị / trợ năng → Low.
- **Đề xuất:** Owner chọn ở G3: giữ "mờ" nhưng không dưới AA (vd. chỉ làm mờ viền / nền, hoặc `opacity` ≥ 0,75 và kiểm lại từng cặp), hoặc ghi ngoại lệ AA cho khối STALE vào ADR-0013. ≈ 2 dòng SP (2 file) + sửa mockup `ai.html`.

### CL-C3 — `zod` bản đầy đủ (≈ 78 KB min) trong `index.js` chỉ để dùng vài kiểu schema; `zod/mini` cùng gói cho cùng việc ≈ 17 KB

```
ID: CL-C3
Mức: Low
Trục: B
Vị trí: packages/ai/src/schema.ts:22 (`import { z } from 'zod'`); packages/db/src/backup.ts:7, packages/db/src/backup-validation.ts:19 (phong bì / kiểm backup, cũng `zod` đầy đủ); bundle `assets/index.js` 891 942 B (common\baseline.md) (8855345)
Tình trạng: CONFIRMED (đo bundle tạm ngoài repo)
```

- **Mô tả:** `schema.ts` (và phong bì backup của `db`) dùng API chuỗi phương thức của `zod` 4 (`z.string().trim().refine…`). API này gắn mọi phương thức vào mỗi lớp schema nên bundler không bỏ được phần không dùng. `zod@4.6.5` (đã duyệt ở ADR-0005) có sẵn `zod/mini` cùng gói: API hàm, bundler bỏ được phần không dùng. App chỉ dùng `strictObject`, `object`, `array`, `string`, `enum`, `union`, `number`, `boolean`, `trim`, `refine`, `regex`, `min` / `max`, `default`, `optional`.
- **Bằng chứng:** `claude\C\bundle\` (ngoài repo), `vite build` của repo (`apps/desktop/node_modules/vite`), một schema nhỏ cùng loại (strictObject + string.trim.refine + array.regex.max + enum.optional), minify như build app:
  - `import { z } from 'zod'` → `out-full/full.js` **78 211 B** (gzip 22 206 B);
  - `import * as z from 'zod/mini'`, cùng schema → `out-mini/mini.js` **17 377 B** (gzip 5 849 B).
  - Chênh ≈ 61 KB min ≈ 6,8 % của `assets/index.js` (891 942 B, `common\baseline.md`). Tách chính xác phần `zod` trong `index.js` cần visualizer (G4), nên số trên là phần của một schema tối thiểu.
- **Ảnh hưởng:** exe nạp và parse thêm ≈ 61 KB JS mỗi lần mở (ổ cục bộ, vài ms); không đổi hành vi.
- **Đề xuất (refactor giữ hành vi):** chuyển `packages/ai/src/schema.ts` và `packages/db/src/backup.ts`, `backup-validation.ts` sang `zod/mini` (phải đổi cả ba: còn một nơi dùng bản đầy đủ thì bundle vẫn mang nó) (≈ 120 dòng SP sửa cách viết, không đổi luật; không thêm dependency). Test giữ hành vi: `schema.test.ts`, `validator*.test.ts`, `input.test.ts`, `backup*.test.ts`, `ai-analyses.test.ts`, toàn bộ `pnpm verify`; đo lại `assets/index.js` bằng `node tools/size-report.mjs --compare`. Ưu tiên thấp.

### CL-C4 — Ba chỗ chữ lệch quyết định G5 / spec sau này: "tối đa 64 token", "`reasoningEffort: false`", "200 000"

```
ID: CL-C4
Mức: Nit
Trục: C, A
Vị trí: apps/desktop/src/routes/SettingsAi.tsx:308-309; docs/design/mockups/ai.html:458; docs/golden/ai-eval.md:13; apps/desktop/src/i18n/vi.ts:248-249 (8855345)
Tình trạng: CONFIRMED (đọc code / tài liệu)
```

- **Mô tả:**
  - Comment `ConnectionCard` "no Hủy, the request is 64 tokens at most" và ghi chú mockup 1f "Không có Hủy: yêu cầu tối đa 64 token." — G5 §10.5 (Owner 11/10) đã nâng Kiểm tra kết nối lên **1 024** token (`prompts/connection.ts:13`). Lý do "không cần Hủy" vẫn đúng (model trả "OK" thì dừng), chỉ con số cũ.
  - `docs/golden/ai-eval.md:13` "Eval gửi `reasoning_effort: high` dù `models.ts` còn để `reasoningEffort: false` cho model này" — `models.ts:29` nay là `true` cho `deepseek-v4.1-flash` (T-179, spec §4.2). Mục 6 "Owner duyệt (G2)" của file vẫn để `[ ]` cả năm ô dù đầu file ghi đã duyệt.
  - `aiError.AI_TOO_LARGE` viết "quá 200 000 ký tự" (dấu cách) trong khi câu cùng loại `aiPanel.web.refused.TOO_LONG` viết "20.000 ký tự" và app định dạng số bằng dấu chấm (`groupThousands`, ADR-0013).
- **Đề xuất:** sửa comment; ghi chú mockup / golden sửa ở lần chạm sau (tài liệu đã duyệt — Owner quyết); `vi.ts` viết "200.000". ≈ 3 dòng.

### CL-C5 — Kiểu "lỗi AI có mã HTTP" khai 5 lần, phép chép `httpStatus` / `serverMessage` có điều kiện lặp 3 lần

```
ID: CL-C5
Mức: Nit
Trục: B
Vị trí: packages/ai/src/run.ts:39-44 (Failed), :171-177; packages/ai/src/errors.ts:37-42; apps/desktop/src/data/ai-analysis.ts:145-150; apps/desktop/src/routes/ai-error-view.ts:13-17, :20-24, :29-36; apps/desktop/src/data/ai-tauri.ts:37-45 (8855345)
Tình trạng: CONFIRMED (đọc code, `git grep`)
```

- **Mô tả:** cùng hình `{ code, httpStatus?, serverMessage? }` khai ở `run.ts` (`Failed`, không export), `ai-analysis.ts` (nhánh `error` của `AnalysisOutcome`), `ai-error-view.ts` (`AiFailure` và `Failed`), cộng các trường của `AiError`; đoạn `...(httpStatus !== undefined && { httpStatus }), ...(serverMessage !== undefined && { serverMessage })` chép ở `run.ts:175-176`, `ai-error-view.ts:33-34` và biến thể `typeof … === 'number'` ở `ai-tauri.ts:42-43`.
- **Đề xuất:** export một kiểu `AiFailed` (và hàm `failedOf(error: AiError)`) từ `@p2c/ai`, app dùng lại (≈ −15 dòng). Test giữ hành vi: `run.test.ts`, `ai-error-view.test.ts`, `ai-tauri.test.ts`, `ai-analysis.test.ts`. Không có chi phí đo được.

### CL-C6 — Phiên ChatGPT web không mang mốc `generation`: phiên lấy trong lúc Nạp lại sống qua lần thay dữ liệu, rồi hoặc lưu vào dữ liệu mới, hoặc làm hồ sơ KH sập (RangeError)

```
ID: CL-C6
Mức: Low
Trục: E, D
Vị trí: apps/desktop/src/data/ai-analysis.ts:288-304 (startChatGptWeb: không đọc generation), :321-333 (saveChatGptAnswer: không kiểm replaced); apps/desktop/src/routes/customers/ai-panel-view.ts:388-395 (webChip), :606-614 (versionNumber ném RangeError); apps/desktop/src/routes/customers/KycWebSession.tsx:57; apps/desktop/src/routes/customers/CustomerProfile.tsx:202-203 (KycIntelligence key={customer.id}); apps/desktop/src/routes/Settings.tsx:140-141 (hộp Nạp lại không đóng được khi chạy, nhưng không chặn Back); apps/desktop/src/shell/useRoute.ts:24 (router theo hashchange) (8855345)
Tình trạng: CONFIRMED phần dữ liệu / render (probe Node); PLAUSIBLE đường UI (bấm Back của trình duyệt — Alt+← hoặc nút Back của chuột — trong lúc hộp Nạp lại đang chạy; chưa thử trên exe)
```

- **Mô tả:** Phân tích và AI trích xuất đọc `generation` lúc bấm và bỏ kết quả khi dữ liệu đã bị thay hoặc đang thay (DR5-36, S2-3: `ai-analysis.ts:193`, `:257`, `:208-209`). Phiên ChatGPT web thì không: `startChatGptWeb` không ghi mốc, `saveChatGptAnswer` lưu vào DB đang mở ở lúc bấm "Kiểm tra và lưu". Bình thường không sao vì phiên chỉ sống trong panel, và muốn Nạp lại / Nhập phải sang Cài đặt (panel bị gỡ). Nhưng hộp Nạp lại chỉ chặn đóng hộp (`Settings.tsx:140-141`), không chặn lịch sử trình duyệt; router đổi màn theo `hashchange`, nên trong vài giây sinh seed (K15: ≈ 3–4 s ở lần mở đầu, gần hết là seed) người dùng bấm Back là về hồ sơ KH trên **dữ liệu cũ** và mở được phiên web. Seed demo cùng ngày cho cùng id KH và id phiên bản KYC đã seed, `KycIntelligence` chỉ khóa theo `customer.id`, nên phiên sống sang dữ liệu mới.
- **Tái hiện (Node, lớp dữ liệu của app):** `node p6-reload-web.mjs` (log `claude\C\p6-reload-web.log`): `openAppData` với seed demo, `reloadDemoData()` bắt đầu (chưa chờ), `replacing()` = `true`, gọi `startChatGptWeb` → `session`, chờ Nạp lại xong:
  - KYC của KH **giữ nguyên như seed**: `same customer id / session version still there [true,true]`, `webChip` → `{"version":8,…}`, `saveChatGptAnswer` → `{"kind":"saved","status":"ACCEPTED"}`, dòng lưu `["CHATGPT_WEB","CURRENT",true]` — kết quả lấy từ dữ liệu cũ được lưu vào dữ liệu mới (ở đây trùng nội dung vì seed tất định, nên không sai số; nhưng đi ngược nguyên tắc DR5-36 "câu trả lời từ dữ liệu khác không bao giờ được lưu").
  - KH **đã có thêm một phiên bản KYC sau lần Nạp lại trước** (RE ghi chú mới — id ngẫu nhiên): `[true,false]`, `webChip on the new data THROWS RangeError: Not a KYC version of the customer: 01M4V37X3HE6JSK8H0JXQXC1Q4` → lần render kế của `KycWebSession` (`:57`) ném lỗi, `ErrorBoundary` thay cả màn hồ sơ bằng hộp lỗi; `saveChatGptAnswer` (nếu tới được) → `discarded` (nhờ `KYC_VERSION_NOT_FOUND` trong `GONE`, `ai-analysis.ts:177`).
  - Đối chứng: phân tích / trích xuất chạy cùng lúc đó bị bỏ đúng (`ai-analysis.test.ts:306-356`, `:581-621`).
- **Test hở đi kèm:** đột biến A6 (bỏ `KYC_VERSION_NOT_FOUND` khỏi `GONE`) sống qua cả 2 755 test: nhánh đó chỉ tới được bằng đúng đường này.
- **Ảnh hưởng:** cần chuỗi thao tác hiếm (Back trong vài giây Nạp lại + bấm ChatGPT web); hậu quả: hộp lỗi màn (tải lại màn là hết, không mất dữ liệu) hoặc một dòng `CHATGPT_WEB` lưu vào dữ liệu mới mà nội dung vẫn khớp. → Low.
- **Đề xuất:** ghi `generation` vào phiên lúc `startChatGptWeb` (vd. trường của `WebStartOutcome` / `AiPanelWeb`), `saveChatGptAnswer` trả `discarded` khi `generation` đổi hoặc `replacing()` như `analyseCustomer`; panel bỏ phiên khi `generation` đổi (hoặc khóa `KycIntelligence` theo `customer.id` + `generation`), và `webChip` không ném khi phiên bản không còn. ≈ 15 dòng SP + 2 ca ở `ai-analysis.test.ts` (Nạp lại / nhập cùng id trong lúc phiên mở → `discarded`) + 1 ca `ai-panel-view.test.ts`. Có thể cân nhắc thêm: chặn đổi route khi đang thay dữ liệu (gói D/E).

### CL-C7 — Không test nào giữ luật "V4, V6 vẫn áp cho `personalityNotes`" (đột biến V3, V14 sống)

```
ID: CL-C7
Mức: Low
Trục: T, G
Vị trí: packages/ai/src/validator.ts:228-230 (chỉ bỏ V5 cho personalityNotes); packages/ai/src/validator-blocklists.test.ts:56-58 (C8b, C9b, C9c — chỉ C9c kiểm V3) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** G5 §7 mục 6 / §8.3 và ADR-0009 phụ lục G5 mục 1: "V3, V4, V6 vẫn áp cho `personalityNotes`". Code đúng (chỉ lọc V5). Nhưng chỉ có ca C9c ("KH có 80% là INTJ" → V3) cho khối này; không ca nào đặt tên hãng / loại sản phẩm (V4) hay trích dẫn pháp lý (V6) vào `personalityNotes`.
- **Tái hiện:** `node mutate.mjs` (log `claude\C\mutate.log`, `mutate2.log`): `V3 V6 skipped in personalityNotes → SURVIVED (package C tests and the whole vitest suite: 2755 passed)`; `V14 V4 skipped in personalityNotes → SURVIVED (… 2755 passed)`. Đối chứng: `V2 V3 skipped in personalityNotes → killed — … C9c`.
- **Ảnh hưởng:** sửa `phraseIssues` sau này (vd. mở rộng ngoại lệ của khối tham khảo) có thể để "KH tuổi Tý nên hợp Prudential" hay "theo Điều 35" lọt vào khối "Thông tin tham khảo" mà không test nào đỏ. Hành vi hiện tại đúng.
- **Đề xuất:** thêm vào bảng ca G5 §8.5 của `validator-blocklists.test.ts` hai ca `personalityNotes` → `["V4"]`, `["V6"]` (≈ 4 dòng test; nếu muốn ghi vào G5 §8.5 thì là ca kiểm mới, không đổi danh sách chặn).

## 4. Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `npx tsc -p packages/ai/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` (log `claude\C\tsc-unused-ai.log`, chạy khi `packages/ai` đã trả nguyên trạng — `git diff --stat` rỗng) | `packages/ai` | exit 0, 0 dòng (hai cờ vốn bật ở `tsconfig.base.json`). Phần app của gói C nằm trong lần `tsc` app của gói B (exit 0) | — |
| `node exports.mjs` (log `exports.log`): mọi `export` của file SP gói C, tìm nơi dùng ngoài file bằng `git grep -w` ở `HEAD` (không bị ảnh hưởng bởi đột biến) | `packages/ai/src`, file AI của app | `packages/ai`: mọi export đều có nơi dùng SP ngoài file. App: chỉ còn kiểu (không tốn gì lúc chạy) và hai hàm `issueLine`, `runAfter` (`ai-panel-view.ts`) export cho test nhưng vẫn dùng trong chính file — không phải code chết | — |
| Khóa i18n của AI: 189 khóa `aiPanel.*`, `extraction.*`, `settingsAi.*`, `aiError.*`, `appointments.ai.*`; `git grep` khóa viết thẳng (`ai-keys.txt`, `ai-keys-dynamic.txt`) | `vi.ts` ↔ `apps/desktop/src` | 153 khóa viết thẳng; 36 khóa dựng động (`aiPanel.done.${…}`, `aiError.${code}`, `settingsAi.reasoning.${level}`…) đều ứng đúng một giá trị của kiểu liệt kê → 0 khóa thừa | — |
| Dependency | `packages/ai/package.json` | chỉ `@p2c/domain` + `zod@4.6.5`, đều dùng. `zod` bản đầy đủ: bundle tạm (`claude\C\bundle\`, `vite build` của repo) 78 211 B min / 22 206 B gzip, so với `zod/mini` cùng schema 17 377 B / 5 849 B | CL-C3 |
| Code lặp ≥ 3 nơi | gói C | kiểu "lỗi AI có mã HTTP" ×5, phép chép `httpStatus` / `serverMessage` có điều kiện ×3. Các mục *Duplicated Code* khác của gói C đã có trong sổ (KNOWN: `newSessionId`, `comparable` / `collapseSpaces`, khối đang chạy / hủy / lỗi của `KycExtraction` / `KycIntelligence`, hai hằng 20 000, tập provider không model) — không nhắc lại | CL-C5 |
| Bundle | `common\baseline.md` | code gói C nằm trong `assets/index.js` (891 942 B); chữ prompt + danh sách chặn ≈ 15 KB nguồn. Không tách được theo module nếu không có visualizer (G4) | CL-C3 |
| Đề xuất refactor | — | CL-C3 (≈ 120 dòng sửa cách viết, −61 KB min), CL-C5 (≈ −15 dòng). Test giữ hành vi ghi trong từng mục; không đổi golden / G5 | CL-C3, CL-C5 |

## 4b. Hiệu năng

Máy: Home PC (i9-12900K), Node v24.20.0, đo 23:59 13/10. Lúc đo: CPU 5 %, đang mở `codex` (3), `opencode` (1), 16 `node` (một phần của bên khác). Dữ liệu: `common\load\load-2026-10-12-seed6.p2cbackup` nhập bằng `importBackup` (103 `ai_analyses`, đều ACCEPTED / MOCK; 96 KH có phân tích, tối đa 2 phân tích / KH, tối đa 20 phiên bản KYC và 19 dữ kiện / KH). Hàm thuần của `@p2c/db` + view của app (không React). `node p3-perf.mjs`, log `claude\C\p3-perf.log`. Trung vị (min–max), n lần.

| Thao tác | n | Trung vị | Min–max | So với | ID |
|---|---:|---:|---|---|---|
| Phần AI của hồ sơ KH: `listAiAnalyses` + `listKycVersions` + `getKycProfile` + cổng + `aiPanelView` + `analysisContent` + `historyRows` + `aiPanelHelp`, mỗi KH sống có phân tích một lần | 95 | 0,36 ms | 0,22–4,36 | exe `customer.open-ai` 19,6 ms, `customer.ai-history` 12,4 ms (`perf-ref.json`, gồm render); ngưỡng < 200 ms | — |
| Như trên, KH nhiều phân tích nhất / riêng phần tính lúc render | 20 | 0,34 / 0,03 ms | 0,31–0,53 / 0,02–0,15 | | — |
| Khối AI ở chi tiết lịch hẹn (3 lần đọc + `appointmentAiView`), chạy lại mỗi revision khi chi tiết đang mở | 20 | 0,30 ms | 0,28–1,25 | | — |
| Phần tính lúc render với 60 dòng lịch sử (giả lập, cùng dữ liệu) | 20 | 0,06 ms | 0,05–0,11 | | — |
| `validateOutput` câu trả lời analysis lớn nhất schema cho phép (35 chuỗi × 299 ký tự, JSON 12 418 ký tự) | 20 | 2,83 ms | 2,72–174,46 (lần đầu dựng regex) | trong một lần chạy AI tới 120 s | — |
| `checkWebAnswer` dán 12 446 ký tự (câu trả lời trên trong rào json) / `checkAnalysisAnswer` cùng câu | 20 | 3,01 / 2,68 ms | 2,88–3,74 / 2,61–3,48 | bấm "Kiểm tra và lưu" | — |
| `checkWebAnswer` dán 19 751 ký tự toàn `{` chưa đóng | 20 | 0,10 ms | 0,10–0,58 | | — |
| `extractJson` câu trả lời suy biến 100 800 ký tự (≈ trần 24 000 token) | 5 | 1,10 ms | 1,10–4,91 | test sẵn có: 100 000 ký tự < 500 ms | — |
| Tin nhắn `web@1` của hồ sơ 21 dữ kiện | — | 7 832 ký tự | | trần dán 20 000 | — |

Không có phát hiện P: mọi phép của gói C trên dữ liệu tải dưới 5 ms (xa ngưỡng 200 ms); không có phép bậc hai (`extract-json.ts`: một lượt + tối đa 3 lần đọc lại, 100 lần parse lỗi; `blocklists.ts` / `text-match.ts`: regex dựng một lần lúc nạp module). Phần tốn nhất của panel trên exe là render React (ngoài phạm vi đo Node; `perf-ref.json` đã có 19,6 ms).

## 5. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | 0 |
| Low | CL-C6* | (CL-C2) | (CL-C6) | CL-C1, (CL-C7) | | | CL-C3 | CL-C7* | CL-C2* | 5 |
| Nit | | CL-C4* | | | | | CL-C5 | | (CL-C4) | 2 |

\* gắn hai trục, đếm một lần ở trục chính (trục phụ trong ngoặc). CONFIRMED 7 / 7; riêng CL-C6 có phần đường UI (Back trong lúc Nạp lại) là PLAUSIBLE, phần dữ liệu / render đã chạy. Tỉ lệ PLAUSIBLE thấp.

## 6. Đã xét, không thấy

- **E — edge case.** `node p1-validator.mjs` (log `p1-validator.log`): NBSP / U+3000 / ZWSP+NBSP / hai dấu cách / xuống dòng giữa "xác suất" → V3; "70 %" → V3; ZWSP trong "bảo hiểm trọn đời" → V4; chuỗi chỉ U+FEFF / U+3000 / U+180E → V1 "chuỗi rỗng"; 300 ký tự + U+200B → V1 "quá 300"; NFD đếm theo NFC. Ngoài CL-C1 chỉ thấy: chuỗi chỉ gồm U+115F / U+3164 (chữ lấp chỗ Hangul, loại `Lo`, vô hình) qua V1 vì là "chữ cái" — output suy biến, G5 §10.4 chọn `\p{L}`, không báo; "I N T J" có dấu cách và chữ Kirin "АIА" lọt — G5 §10.2 / §10.10 đã loại khỏi phạm vi. `extractJson`: BOM trước khối, `__proto__`, khóa trùng, `}` lẻ trước khối, chuỗi có `\"}` → đúng doc comment; NBSP sau `{` → không có JSON (JSON không nhận NBSP). Luồng nhiều bước (`p2-flows.mjs`, log `p2-flows.log`): F1 phân tích đang chạy, KH bị xóa rồi khôi phục từ Thùng rác trước khi AI trả → `saved` ACCEPTED / CURRENT, không báo lỗi (vẫn cùng một bộ dữ liệu; TR-9 nói cơ chế bỏ là `CUSTOMER_NOT_FOUND` lúc lưu, nên đúng); F2 đánh mâu thuẫn cốt lõi trong lúc chạy → lưu STALE, panel hiện câu cổng chặn, không lời nhắc / dòng bị loại, khối lịch hẹn STALE; F3 phiên web, xác nhận lại cùng giá trị một dữ kiện được trích → lưu CURRENT, mã cũ F7 dẫn tới F8, mức bằng chứng tính theo ngày mới (DR5-15); F4 trích xuất Mock "3 con, đã kết hôn" → hai đề xuất. Qua nửa đêm / qua năm trong phiên web: đầu vào và tuổi chụp lúc bấm, `date` của dòng là ngày lưu (đọc `run.ts`, `web.ts`, `ai-analyses.ts`) — không lệch luật nhập 4. Dán chỉ ZWSP: tính một lần thử V1 (JS `trim()` không bỏ U+200B) — cần cố ý dán, không báo.
- **C — hợp đồng / spec.** Đối chiếu spec Phase 5 §3, §3.1 (mục 1–8), §4.1–§4.3, §5.1–§5.3 (phần webview), §6.1–§6.4, §7.2, §8 (mục 1–6), §9.1–§9.3 với code: khớp. `blocklists.ts` so từng mục với bảng G5 §8.1–§8.4 (cột "Bỏ dấu", từng regex): khớp (test `blocklists.test.ts` còn đọc thẳng file G5). Chữ prompt / message thử lại / `web@1` do `prompts.test.ts` / `web.test.ts` so nguyên văn. Mockup `ai.html` (1f, 2a, 2e, 2k, 4d–4h) so chữ với `vi.ts`: khớp, trừ các mục đã có trong sổ (dòng ChatGPT web thiếu phần in đậm, "DeepSeek V4 Pro" trong mockup) và CL-C2, CL-C4. Phiên web không giữ khóa runner nhưng nút web tắt khi runner bận — đúng §9.1 "tắt khi đang có yêu cầu AI".
- **D — dữ liệu.** AI chỉ ghi `ai_analyses` (`recordAiAnalysis` qua `app.run`), trích xuất chỉ trả đề xuất; Xác nhận đi qua `confirmKycFact` / `markKycConflict` với `noteId` của ghi chú nguồn và ngày hôm nay (`KycDialogs.tsx:464-466`). `p4-stored.mjs` (log `p4-stored.log`): 102 dòng của KH sống trong dữ liệu tải và 63 dòng của seed demo 13/10, đọc lại như app rồi chạy lại `validateOutput` với chính `input` của dòng → 0 dòng ACCEPTED trượt, 0 lỗi khi dựng panel / lịch sử / khối lịch hẹn. `analysisOutcome` lưu `output` qua `parse` của schema (bỏ khóa lạ) khi ACCEPTED; REJECTED lưu JSON thô nhưng không bao giờ hiện (đột biến U2, U15, R7 bị giết). Thay dữ liệu trong lúc AI chạy: đột biến A1–A3, A7 bị giết; ngoại lệ là phiên web (CL-C6).
- **G — guardrail.** V1–V7, thử lại, CUT_ANSWER, trần 30 issue / 5 mã / 40 ký tự, `MAX_ATTEMPTS`, phiên web (tin nhắn của app, quá dài): 70 đột biến trên `validator.ts`, `schema.ts`, `text-match.ts`, `blocklists.ts`, `run.ts`, `retry.ts`, `extract-json.ts`, `web.ts`, `settings.ts`, `mock-adapter.ts`, `code-points.ts`, `errors.ts` — chỉ V3 / V14 sống (CL-C7) và P3 (tương đương). Mức bằng chứng tính ở `domain` (`evidenceLevel`), không do AI ghi. Đầu vào không có tên / mã KH / RE / ghi chú (đột biến S9 "gửi năm sinh nguyên" bị giết bởi test và golden seed). Ngoài CL-C1 không thấy đường lọt nào không cần ký tự lạ.
- **S — ranh giới.** Key: chỉ đi `KeyCard` → lệnh Rust (`ai_key_set` / `delete` / `status`), ô `type="password"`, xóa chữ sau khi lưu; `ai.save` chỉ ghi 4 trường (đột biến A4 bị giết); lỗi từ Rust không phải đối tượng có mã → `AI_BAD_REQUEST`, bỏ chuỗi gốc (A12 bị giết). Mạng: webview chỉ `invoke`; ChatGPT web mở `CHATGPT_URL` hằng, không dữ liệu trên URL, chỉ ghi clipboard, không đọc. Hiển thị output model: chữ thường qua React (e2e `customer-ai-web.spec.ts:328` kiểm HTML / link); `fillSlots` thay một lượt bằng hàm nên `$` / `{…}` trong thông điệp server không bị diễn giải. Prompt injection qua ghi chú / dữ kiện: mọi output qua V1–V6; trích xuất qua V7 + RE xác nhận từng đề xuất. Ký tự điều khiển hướng (U+202E) trong output được lưu / hiện nguyên trong khi validator bỏ chúng trước khi so — chỉ khai thác được bằng output cố ý đối kháng (G5 §10.10), không báo.
- **P — hiệu năng.** Bảng §4b.
- **B — bloat.** Bảng §4.
- **T — test.** Đột biến 97 cái (§7): 92 bị giết, 5 sống → CL-C7 (V3, V14), CL-C6 (A6); P3 (tương đương: không `detail` nào tới được chứa `$&` / `$'` / `` $` `` / `$$` — đã xét mọi nguồn `detail`: chữ cố định, mã `F…` đã qua regex, tên mục danh sách chặn, đoạn khớp regex không có `$`) và U7 (tương đương: `db` buộc token `null` với Mock / ChatGPT web, `isTokenCount` ở `ai-analyses.ts`). Test đo thời gian `extract-json.test.ts:117` là KNOWN. Không thấy test của gói C phụ thuộc ngày hệ thống (dùng `TODAY` cố định của `test-support.ts` / `calendarDate`).
- **A — trợ năng / i18n.** `grep` chuỗi cứng trong 6 file TSX của gói C: chỉ có trong comment. Vai trò: `role="status"` cho dòng đang chạy / xong, `role="alert"` cho lỗi, vùng `aria-live` có sẵn trước khi điền, tiêu đề panel `tabIndex={-1}` làm đích focus, hàng lịch sử có nút riêng với `aria-label`, `aria-current` cho dòng đang xem, cột trạng thái có tiêu đề `sr-only`. Ngoài CL-C2 (tương phản khi mờ) và CL-C4 (định dạng "200 000") không thấy gì.

## 7. Phụ lục

**Probe / script (thư mục `claude\C\`, đều chỉ đọc repo ở SHA ghim, chỉ ghi trong `claude\C\`):**

- `hooks.mjs` — chép từ `claude\B\hooks.mjs` (nạp TypeScript của repo trong Node).
- `list.mjs` — danh sách file gói C theo `classifyFile`.
- `p1-validator.mjs` → `p1-validator.log` (CL-C1, §6 E).
- `p2-flows.mjs` → `p2-flows.log` (F1–F4, §6 E / D). Lần chạy đầu thiếu `web` giả cho clipboard / trình duyệt (Node không có) nên F3 ra `failed` rồi dừng; đã thêm `web` giả vào `setup` và chạy lại — log là lần sau.
- `p3-perf.mjs` → `p3-perf.log` (§4b).
- `p4-stored.mjs` → `p4-stored.log` (§6 D).
- `p5-contrast.mjs` → `p5-contrast.log` (CL-C2).
- `p6-reload-web.mjs` → `p6-reload-web.log` (CL-C6).
- `exports.mjs` → `exports.log`; `ai-keys.txt`, `ai-keys-dynamic.txt` (§4).
- `bundle\` — `vite build` tạm hai entry `zod` / `zod/mini` (CL-C3): `out-full\`, `out-mini\`.
- `tsc-unused-ai.log` (§4).
- `mutate.mjs` → `mutate.log`, `mutate-results-run1.json` (= `mutate-results.json`); lần 2 chỉ V14 → `mutate2.log`, `mutate-results-run2.json`; bản gốc trước đột biến ở `orig\`.

**Đột biến** (`mutate.mjs`: patch một file SP trong worktree, chạy test gói C — `packages/ai`, `packages/db/src/{ai-analyses,backup,seed}*`, `apps/desktop/src/{data/ai*,routes,i18n}` — với `--bail=1`, sống thì chạy cả bộ vitest; trả file về từng byte, so `git show HEAD:` trước / sau; e2e **không** chạy vì cổng 4173 dùng chung). 23:30–23:58, 97 đột biến (96 lần 1 + V14 lần 2):

- **Sống (5):** V3 (V6 không áp cho `personalityNotes`) và V14 (V4 như vậy) → CL-C7; A6 (bỏ `KYC_VERSION_NOT_FOUND` khỏi `GONE`) → CL-C6; P3 (thay `{issues}` bằng chuỗi thay vì hàm) và U7 (đếm token cho mọi provider) — tương đương với đầu vào tới được (§6 T).
- **Bị giết (92):** V1, V2, V4–V13; S1–S12; T1–T6; B1–B4; R1–R16; P1, P2; J1–J4; K1, K2; W1–W6; G1–G3; A1–A5, A7–A12; U1–U6, U8–U15. Tên test giết từng đột biến ở `mutate.log`.
- Dòng cuối `mutate.log` và `mutate2.log`: `git status --short after: ""`.

**Tác dụng phụ ngoài repo:** không có; không mở exe, không gọi dịch vụ AI, không đọc key, không chạy `pnpm e2e`.

**`git status --short` cuối phiên** (14/10/2026 00:02): rỗng; `git rev-parse HEAD` → `885534549808f42aec7f9af5743bbf86642ee4bd`.

**Giờ xong:** 14/10/2026 00:04 (+07:00).
