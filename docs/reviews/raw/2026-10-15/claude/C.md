XONG — claude gói C, 2026-10-14 11:31

# Deep review Phase 1–6, lượt 1 — Claude, gói C (AI)

## 1. Đầu phiên

- Bên: Claude (Opus 5.5), phiên sạch, chỉ đọc.
- Gói: **C — AI** (`packages/ai/**` + file AI của app).
- Máy: Office Laptop `D13_THINKPAD`.
- SHA đầu phiên (`git rev-parse HEAD`): `885534549808f42aec7f9af5743bbf86642ee4bd`.
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 2026-10-14 10:51.
- Bước 0: chữ gói `C` hợp lệ; `claude\C.md` chưa có; `claude\A.md` (XONG 10:08), `claude\B.md` (XONG 10:47) đủ, không còn `ĐANG LÀM`.

### ⚠️ Sự cố trong phiên: probe đã mở chatgpt.com (vi phạm quy tắc chung 2, do sơ suất)

- **Lúc nào:** 11:04–11:06, hai lần chạy probe `C\c5-edge-ai.mjs` (bản đầu) trên bản build web ở Edge headless (cổng 4291, server tĩnh của tôi).
- **Chuyện gì:** bước B của probe bấm "Phân tích bằng ChatGPT web" để đo "Kiểm tra và lưu". Ở bản web, nút này gọi `window.open('https://chatgpt.com/', '_blank', 'noopener')` (`apps/desktop/src/data/ai-analysis.ts:86`), và probe **chưa** chặn mạng ngoài localhost / chưa thay `window.open`. Kết quả: Edge headless (hồ sơ trình duyệt mới, không cookie, không đăng nhập) mở tab `https://chatgpt.com/` **9 lần** (3 + 6). Không có dữ liệu nào trong URL (URL hằng số, spec §3.1 mục 1); tin nhắn của app chỉ nằm ở clipboard của trang headless; không có key, không gọi OpenCode / dịch vụ AI của sản phẩm.
- **Đã làm:** ghi ngay vào đây; từ bản sau, probe chặn mọi request không phải `127.0.0.1` (`context.route`) và thay `window.open` bằng hàm ghi lại lời gọi (`addInitScript`), kiểm lại bằng số request bị chặn (§7). Số đo của hai lần chạy đầu (bước B) **không dùng** (tab chatgpt.com đang tải làm nhiễu CPU).

## 2. Phạm vi đã đọc

Đọc hết (từng dòng) ở `8855345`:

- `packages/ai/src/` — sản phẩm: `index.ts` (11), `errors.ts` (56), `adapter.ts` (43), `models.ts` (35), `code-points.ts` (45), `extract-json.ts` (84), `input.ts` (29), `schema.ts` (356), `validator.ts` (269), `text-match.ts` (74), `blocklists.ts` (108), `prompts/{analysis,discovery,extraction,connection,retry}.ts` (48 + 43 + 27 + 14 + 63), `run.ts` (428), `web.ts` (150), `settings.ts` (86), `mock-adapter.ts` (112), `test-support.ts` (69), `raw.d.ts`; `package.json`, `tsconfig.json`, `CLAUDE.md`.
- File AI của app: `src/data/ai-analysis.ts` (333), `ai-jobs.ts` (82), `ai-tauri.ts` (75); `src/routes/SettingsAi.tsx` (387), `settings-ai-view.ts` (87), `ai-error-view.ts` (66); `routes/appointments/AppointmentAi.tsx` (86), `appointment-ai-view.ts` (49); `routes/customers/KycIntelligence.tsx` (572), `ai-panel-view.ts` (622), `KycWebSession.tsx` (191), `KycHistory.tsx` (154), `KycExtraction.tsx` (180), `extraction-view.ts` (106), `use-ai-job.ts` (53).
- Chỗ gói khác mà gói C nối vào (đọc phần liên quan): `packages/db/src/ai-analyses.ts` (337, cả file), `packages/domain/src/kyc-fact.ts` (`normalizeKycValue`), `kyc-gate.ts` (`evaluateKycGate`), `apps/desktop/src/data/app-data.ts` (`replace` / `swap` / `run` / `generation`, cấu hình `ai`, :195–440), `routes/Screen.tsx`, `CustomerProfile.tsx` (khóa `key` của panel), `Settings.tsx` / `SettingsBackup.tsx` (hộp Nạp lại / Nhập backup), `packages/ui/src/components/Dialog.tsx` (`showModal`).
- Tài liệu: `docs/design/phase-5-ai.md` (cả file), `docs/design/phase-5-prompts.md` (cả file, gồm §8 danh sách chặn và §10 đợt G5 Phase 6), spec Phase 6 §4.1 (S2-1…S2-6), `docs/reviews/2026-10-10-deep-review-phase-5-tong-hop.md` (DR5-36), `common\known.md`, `common\baseline.md`, `claude\A.md`, `claude\B.md` (chỉ để không báo trùng).
- Test đọc thêm khi cần (ghi ở từng phát hiện / §6).

## 3. Phát hiện

### CL-C1

```
ID: CL-C1
Mức: Low
Trục: C
Vị trí: packages/ai/src/schema.ts:106-110 (const text: refine thứ hai đếm `Array.from(s.normalize('NFC')).length` trên chuỗi còn ký tự \p{Cf}) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** G5 §10.4 (Owner duyệt 11/10, phương án A) ghi: mỗi `text` "sau khi **bỏ `\p{Cf}`** và cắt khoảng trắng hai đầu, phải dài 1–300 ký tự đếm theo NFC". Code chỉ bỏ `\p{Cf}` cho phép kiểm "chuỗi rỗng"; phép đếm 300 chạy trên chuỗi **còn** ký tự định dạng, nên một câu ≤ 300 ký tự thấy được kèm vài U+200B / U+00AD (soft hyphen) bị V1 "quá 300 ký tự". Doc comment `schema.ts:103-104` cũng chỉ nói "once trimmed, 1–300 characters counted in NFC".
- **Tái hiện / bằng chứng:** `node --import ./hooks.mjs c1-validator.mjs` (`C\c1-validator.log`, nguồn §7):
  ```
  295 chữ                                              → đạt
  295 chữ + 10 × U+200B ở giữa (sau khi bỏ Cf: 295)     → V1 discoveryStrategy[0].text: quá 300 ký tự
  295 chữ + 6 × U+00AD (soft hyphen)                    → V1 discoveryStrategy[0].text: quá 300 ký tự
  ```
  `schema.test.ts:87-115` chỉ thử 301 chữ, 300 chữ có khoảng trắng hai đầu và 250 chữ NFD — không ca nào có `\p{Cf}`.
- **Ảnh hưởng:** chỉ khi câu trả lời có ký tự định dạng và dài sát 300 (output suy biến; câu dán từ ChatGPT web có thể mang U+200B). Tốn một lần thử; lần 2 cũng vậy thì lưu REJECTED (bảng chỉ thêm). `db` dùng cùng schema khi nhập backup nên lệnh ↔ nhập vẫn cùng luật.
- **Đề xuất:** đếm trên `s.replace(FORMAT_CHARS, '')` (một dòng) + một ca test 295 chữ + 10 × U+200B. ≈ 5 dòng.

### CL-C2

```
ID: CL-C2
Mức: Low
Trục: T
Vị trí: packages/ai/src/blocklists.ts:93 (LAW_NAME: ngoại lệ "kỷ", "quy", "RE"); test: packages/ai/src/validator-blocklists.test.ts:77 (C28), :188-193; packages/ai/src/blocklists.test.ts:96-97 (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** G5 §8.4 (và §10.3) ghi mục "luật …" **không** khớp sau "pháp", "kỷ", "quy" và trước "KH", "RE", "sư", kèm ví dụ không khớp "kỷ luật KH", "quy luật Thị trường". Ba trong sáu ngoại lệ không ca test nào ghim: bỏ "kỷ", bỏ "quy" hay bỏ "RE" khỏi regex thì cả 598 test của `packages/ai` vẫn xanh. Ca C28 "kỷ luật KH" chỉ đạt nhờ ngoại lệ "KH" (từ sau "luật"), không nhờ "kỷ"; ví dụ "quy luật Thị trường" của chính G5 không có trong test (`blocklists.test.ts:97` chỉ thử một ca khớp "Theo luật Đất đai").
- **Tái hiện / bằng chứng:** `node m-run.mjs C25 C25b C26` (`C\m-run.log`):
  ```
  C25  V6 luật after kỷ blocked:  SURVIVED — Tests 598 passed (598)
  C25b V6 luật after quy blocked: SURVIVED — Tests 598 passed (598)
  C26  V6 luật RE blocked:        SURVIVED — Tests 598 passed (598)
  C25c V6 luật after pháp blocked: KILLED — 3 failed (C18, C30)
  ```
- **Ảnh hưởng:** sửa regex sau này có thể làm "quy luật Thị trường", "kỷ luật Thép", "luật RE…" bị V6 chặn nhầm (thêm lần thử / REJECTED) mà CI không báo. Hiện code đúng G5.
- **Đề xuất:** thêm 3 ca vào bảng test V6 (`'quy luật Thị trường'`, `'kỷ luật Thép của KH'`, một câu có "luật RE…") → `[]`. Chỉ test, ≈ 5 dòng; không đổi G5.

### CL-C3

```
ID: CL-C3
Mức: Low
Trục: C (hợp đồng ai ↔ Rust), T
Vị trí: packages/ai/src/run.ts:184 (MAX_MESSAGE_CHARS = 200_000), packages/ai/src/prompts/{analysis,discovery}.ts:8 (maxTokens 24_000), extraction.ts:8 (12_000), connection.ts:13 (1_024) ↔ apps/desktop/src-tauri/src/ai.rs:36 (MAX_TOKENS = 32_000), :38 (MAX_MESSAGE_CHARS = 200_000); test hợp đồng: apps/desktop/src/data/tauri-contract.test.ts:18, :185 (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** Hai trần phải khớp giữa TS và Rust: `maxTokens` của mọi prompt ≤ `MAX_TOKENS` của `ai.rs`, và trần ký tự `MAX_MESSAGE_CHARS` của `run.ts` = của `ai.rs` (TS báo `AI_TOO_LARGE` trước Rust — spec §5.3). `tauri-contract.test.ts` đã đọc nguồn `ai.rs` để so tên tham số và danh sách mã lỗi, nhưng không so hai trần này; test Rust chỉ ghim 32 000 / 32 001 phía Rust, test TS chỉ ghim 24 000 theo G5. Đợt G5 Phase 6 (§10.7) đã gặp đúng chỗ nối này (Rust từ chối > 16 000, phải sửa tay `ai.rs` cùng PR).
- **Tái hiện / bằng chứng:** đột biến trên `ai.rs` (gỡ ngay, kiểm hash), chạy `tauri-contract.test.ts`, `ai-tauri.test.ts`, `packages/ai/src`:
  ```
  C74 Rust max_tokens cap back to 16 000 (below analysis@2 24 000): SURVIVED — Tests 618 passed (618)
  C75 Rust message cap 100 000 (TS still sends up to 200 000):      SURVIVED — Tests 618 passed (618)
  ```
  Chiều ngược lại cũng không có gì chặn: một đợt G5 nâng `maxTokens` > 32 000 (sửa prompt + `prompts.test.ts` + tài liệu G5 cùng lúc, đúng quy trình) vẫn xanh mọi test TS.
- **Ảnh hưởng:** chỉ khi một trong hai phía đổi trần mà phía kia không đổi. Khi đó **mọi** lần Phân tích / trích xuất OpenCode trả `AI_BAD_REQUEST` → panel hiện "Có lỗi trong app khi gọi AI" (lỗi chung), chỉ thấy khi gọi thật (e2e dùng adapter giả, eval là Owner chạy).
- **Đề xuất:** thêm vào `tauri-contract.test.ts` (đã có cách đọc `ai.rs`): parse `MAX_TOKENS` / `MAX_MESSAGE_CHARS`, kiểm `max(maxTokens của 4 prompt) ≤ MAX_TOKENS` và hai trần ký tự bằng nhau (export `MAX_MESSAGE_CHARS` của `run.ts` hoặc đọc nguồn). ≈ 15 dòng test, không đổi code sản phẩm.

### CL-C4

```
ID: CL-C4
Mức: Low
Trục: C, D
Vị trí: packages/db/src/seed.ts:535 (promptVersion: `${mode}@1`) ↔ packages/ai/src/prompts/analysis.ts:7, discovery.ts:7 (version 'analysis@2' / 'discovery@2'), packages/ai/src/schema.ts:8-9 ("The seed of db writes Mock analyses as the app does"); e2e ghim chữ cũ: e2e/customer-ai.spec.ts:162-164, :175, :183 (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** Seed giả lập ghi các phân tích Mock "như app" (I-10, DR5-18: cùng `buildAnalysisInput`, cùng câu Mock, cùng schema mới nhất), nhưng `prompt_version` vẫn cứng `analysis@1` / `discovery@1` từ T-163 (#419), trước đợt G5 Phase 6 (T-197, 11/10) đổi prompt thành `@2`. App bấm Phân tích (Mock) hôm nay ghi `@2`. Sau Nạp lại, Lịch sử phân tích và chip của KH mẫu hiện `analysis@1` — tên một prompt không còn trong code — cạnh dòng `@2` của lần bấm mới, dù cả hai cùng là Mock, cùng schema, cùng ngày.
- **Tái hiện / bằng chứng:** `node --import ./hooks.mjs c7-seed-version.mjs` (`C\c7-seed-version.log`):
  ```
  seeded demo data (seed 1, anchor 14/10/2026): [["analysis@1","MOCK",22],["discovery@1","MOCK",41]]
  prompts in code: analysis@2 discovery@2
  Mock run in the app now writes: discovery@2
  ```
  Dữ liệu tải cũng vậy (103 dòng, sinh bằng cùng `seedDemoData`). e2e `customer-ai.spec.ts:162-183` ghim `analysis@1` / `discovery@1` của seed nên không báo.
- **Ảnh hưởng:** chỉ sai hiển thị trên dữ liệu giả lập (chip "kyc vN · analysis@1 · Mock", cột Prompt), nhưng đây là dữ liệu Owner dùng để nghiệm thu G7 và chụp ảnh hướng dẫn (`docs/user-guide/`): người đọc thấy hai phiên bản prompt cho cùng một việc. G5 §10.1 chỉ nói "phân tích **đã lưu** với `@1` vẫn hiện như đã ghi", không nói dữ liệu sinh mới.
- **Đề xuất:** `db` chỉ được import `@p2c/ai/schema`, nên đưa version prompt của hai chế độ vào `schema.ts` (vd. `ANALYSIS_PROMPT_VERSIONS`, prompt file đọc lại từ đó) hoặc để seed nhận version qua tham số; sửa 5 dòng e2e. Đổi dữ liệu sinh ra → Owner nạp lại (K1). ≈ 10–15 dòng SP.

### CL-C5

```
ID: CL-C5
Mức: Nit
Trục: G
Vị trí: packages/ai/src/blocklists.ts:70-73 (V5 "hướng nội · hướng ngoại", bỏ dấu: có), :101 (V6 "nghị định", bỏ dấu: có), :42 (V3 "khách nóng"), :38 (V3 "sẵn sàng ký") — đúng chữ G5 §8.1, §8.3, §8.4 (8855345)
Tình trạng: CONFIRMED (hành vi), 0 / 1 101 câu eval thật bị ảnh hưởng
```

- **Mô tả:** Bản bỏ dấu của vài mục "Bỏ dấu: có" trùng câu tiếng Việt thường mà model có thể viết ở `discoveryStrategy` / `nextBestActions`, cùng loại với các câu G5 §10.3 đã gỡ ("khả năng kỹ thuật", "suy nghĩ quyết định"): "định hướng **nơi** ở / nơi học" và "chuyển hướng **nói** sang…" → V5 "hướng nội"; "định hướng **ngoài** giờ" → V5 "hướng ngoại"; "suy **nghĩ định** hướng", "**nghĩ định** cư" → V6 "nghị định"; "khách **nông** thôn" → V3 "khách nóng"; "sẵn sàng **kỹ**" → V3 "sẵn sàng ký".
- **Tái hiện / bằng chứng:** `c1-validator.log` §2 (mỗi câu một dòng, ví dụ):
  ```
  Tìm hiểu định hướng nơi ở của gia đình KH sau khi nghỉ hưu → V5 discoveryStrategy[0].text: có "hướng nội"
  KH có thể cần thời gian suy nghĩ định hướng đầu tư        → V6 discoveryStrategy[0].text: có "nghị định"
  KH có thể đang nghĩ định cư cùng con ở nước ngoài          → V6 discoveryStrategy[0].text: có "nghị định"
  ```
  Đối chiếu dữ liệu thật: `c2-eval-texts.mjs` lấy 1 101 chuỗi `text` trong hai báo cáo eval của repo (`docs/metrics/ai-eval-2026-10-1{0,1}.md`), chạy V3–V6: 40 dòng khớp, **39 nằm trong `personalityNotes`** (V5 không áp) và 1 là "nhiều khả năng" (V3 đúng, E10); không câu nào chứa "hướng nơi / hướng nói / nghĩ định"; "định hướng" có 6 câu, đều không theo sau bởi "nơi". Tức là chưa gặp trong eval.
- **Ảnh hưởng:** nếu gặp: một lần thử lại; model lặp lại → REJECTED (chỉ thêm), RE bấm Phân tích lại. Không sai dữ liệu.
- **Đề xuất:** không sửa code (danh sách là G5 đã duyệt, K11). Ghi để Owner xét nếu có đợt G5 sau: "hướng nội / hướng ngoại", "nghị định" sang "Bỏ dấu: không" như "nghị quyết" ở §10.3.

### CL-C6

```
ID: CL-C6
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/SettingsAi.tsx:309 ("no Hủy, the request is 64 tokens at most"); docs/design/mockups/ai.html:458 (ghi chú mockup "Không có Hủy: yêu cầu tối đa 64 token.") ↔ packages/ai/src/prompts/connection.ts:13 (maxTokens 1_024), G5 §6 / §10.5 (8855345)
Tình trạng: CONFIRMED (đọc + grep)
```

- **Mô tả:** Kiểm tra kết nối dùng `maxTokens` 1 024 từ đợt G5 Phase 6 (§10.5, DR5-23). Doc comment của `ConnectionCard` và ghi chú dưới mockup 1f vẫn nói 64 token — lý do "không có Hủy" dựa trên con số cũ. Màn không hiện chữ này (`vi.ts` không có), nên chỉ là tài liệu lệch.
- **Tái hiện / bằng chứng:** `grep -rn "64 tokens\|64 token" apps/desktop/src packages/ai/src docs/design/mockups/ai.html` → đúng hai dòng trên; `connection.ts:13` `maxTokens: 1_024`.
- **Ảnh hưởng:** người sửa sau đọc nhầm chi phí / thời gian của một lần kiểm (với model suy luận, 1 024 token vẫn ngắn nên "không Hủy" vẫn hợp lý).
- **Đề xuất:** sửa comment ("≤ 1 024 tokens"); mockup là G3 đã duyệt → nhắc khi sửa `ai.html` lần sau (như ghi chú #452 về "DeepSeek V4 Pro"). 1 dòng.

## 4a. Bloat

| Đã chạy / đọc gì | Trên gì | Kết quả | Phát hiện |
|---|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` | `packages/ai`, `apps/desktop` | Hai cờ đã bật trong `tsconfig.base.json:12-13` (cả hai tsconfig đều `extends`), `pnpm typecheck` xanh ở SHA ghim (`baseline.md`) → 0 biến / tham số thừa; không chạy lại | — |
| Quét nơi dùng mọi export (`C\b1-exports.mjs`, log `b1-exports.log`) | 215 export: bản đồ codemap `packages/ai` + `export` của 23 file AI của app | 46 không có nơi dùng ở code sản phẩm ngoài file của nó: gần hết là **type** công khai (`AnalysisRequest`, `AiPanelView`…), hằng / hàm dùng trong chính file và export cho test (`runAfter`, `issueLine`, `buildWebMessage`, `EMPTY_RAW_OUTPUT`, `CHATGPT_URL`), `test-support.ts` (chỉ test). Không có hàm chạy thật nào chết. Export thừa qua `index.ts` của `run.ts` là KNOWN (#455) | — |
| `pnpm lint:deps` | toàn repo | baseline: 0 vi phạm; `ai` chỉ `@p2c/domain` + `zod`; `db` chỉ `@p2c/ai/schema` | — |
| Dependency của `packages/ai` | `package.json` ↔ import | `zod` 4.6.5, `@p2c/domain`: đều dùng | — |
| Code lặp ≥ 3 nơi | gói C | Đếm code point bằng `Array.from(x).length` ở `schema.ts:110`, `settings-ai-view.ts:34`, `extraction-view.ts:19` (+ `db/ai-analyses.ts:184`) song song `code-points.ts` (không cấp phát, DR5-09). Đo (`c8-arrayfrom.log`): một `text` 2 000 000 ký tự 28,7 ms, dán key 10 000 000 ký tự 62,7 ms — không đáng kể → không nêu. Khối lỗi / đang chạy lặp ở panel và trích xuất: KNOWN (#469) | — |
| Bundle | `apps/desktop/dist/assets/index-DvfluxND.js` (891 942 B) | AI nằm trong chunk chính (không tách). Chữ prompt G5: 2 prompt `Bạn là trợ lý…` 11 312 B + extraction 1 600 B ≈ 1,4 % chunk; ~175 matcher V3–V6 dựng `RegExp` lúc nạp module (dịch lười). Không có gì đáng tách | — |

## 4b. Hiệu năng

Máy: Office Laptop `D13_ThinkPad`, Node v24.20.0, Edge (Playwright `channel: 'msedge'`, headless); 10:58–11:20 ngày 14/10; song song: phiên Codex đợt 1 ở `Project-2C-review-2` (không rõ đang chạy gì). Dữ liệu: `common\load\load-2026-10-12-seed6.p2cbackup` (Node: `importBackup`; Edge: Cài đặt → Dữ liệu → Nhập backup trên bản build web). Không đo trên exe (số exe lấy từ `perf-ref.json`: `customer.open-ai` 23 ms, `customer.ai-history` 7 ms).

| Đo gì | Dữ liệu | Kết quả | So ngưỡng / tham chiếu | Phát hiện |
|---|---|---|---|---|
| Đọc + dựng mọi view AI của hồ sơ (`getKycProfile` + `listKycVersions` + `listAiAnalyses` + `aiPanelView` + `analysisContent` + `historyRows` + `appointmentAiView`), KH nhiều dữ kiện nhất (19) / nhiều phân tích nhất (2) — Node, `c3` | tải | 0,32 / 0,40 ms (trung vị 7) | < 200 ms ✅ | — |
| Panel trên mọi KH có phân tích (95 KH, 102 dòng: 44 CURRENT, 58 STALE) + 1 KH khôi phục từ Thùng rác — `c3` | tải | 0 ngoại lệ | — | — |
| `runAnalysis` Mock lần **đầu** của tiến trình / các lần sau — Node, `c4` (3 tiến trình) | `test-support` | 225 / 236 / 251 ms; sau đó 0,7–1,3 ms. Tách (`c4b`): lượt đầu qua 175 matcher V3–V6 152–154 ms, lượt 2 ≈ 50 ms (V8 dịch regex lười / tier-up), zod lần đầu 2,8 ms | Node, không phải thao tác màn | — |
| Bấm **Phân tích** (Mock) → khung hình sau "Phân tích xong" — Edge, `c5c` | tải | lần đầu của trang 106,9 ms; 5 lần sau 20,6–26,6 ms | < 200 ms ✅ | — |
| Bấm **Kiểm tra và lưu** (ChatGPT web) → khung hình sau "Phân tích xong" — Edge, `c5c` (mạng ngoài bị chặn) | tải | lần đầu 105,3 ms; 5 lần sau 19,2–22,1 ms | < 200 ms ✅ | — |
| ↳ hai lần chạy đầu `c5` / `c5b` (chưa chặn mạng, tab chatgpt.com mở): 333–907 ms | — | **bỏ** (nhiễu do sự cố ở đầu báo cáo) | — | — |
| `startWebAnalysis` + tin nhắn `web@1` (dài nhất trên dữ liệu tải: 7 685 ký tự) | tải | 0,03 ms | ✅ | — |
| `checkWebAnswer` 19 999 ký tự (lời văn + JSON cuối) / 40 000 ký tự (TOO_LONG) | — | 0,8 / 0,15 ms | ✅ | — |
| `extractJson` 2 MB một khối / 2 000 000 ký tự toàn `{` chưa đóng | — | 5,1 / 28,0 ms | trần Rust 2 MB ✅ | — |
| `validateOutput` 20 000 phần tử `hypotheses` (V1 quá 5) | — | 19,1 ms | ✅ | — |
| `recordAiAnalysis` một dòng | tải | 3,65 ms | ✅ | — |
| Mock trên mọi KH cổng cho phép (995 KH: 435 analysis + 560 discovery) — `c6` | tải | 995 / 995 ACCEPTED lần 1, 995 `recordAiAnalysis` nhận; dán lại tin nhắn app 995 / 995 `OWN_MESSAGE`; dán câu Mock 995 / 995 ACCEPTED; toàn bộ 3,1 s | — | — |

Không có phát hiện P: chi phí lần đầu (dịch regex V3–V6) ≈ 105 ms trên Edge, dưới ngưỡng.

## 5. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 3 (CL-C1, CL-C3, CL-C4) | 0 | 0 | 0 | 0 | 0 | 1 (CL-C2) | 0 | 4 |
| Nit | 0 | 1 (CL-C6) | 0 | 1 (CL-C5) | 0 | 0 | 0 | 0 | 0 | 2 |
| **Tổng** | 0 | 4 | 0 | 1 | 0 | 0 | 0 | 1 | 0 | **6** |

Trục chính của mỗi phát hiện (CL-C3 có thêm T, CL-C4 thêm D). 6 / 6 CONFIRMED (probe / đột biến / grep), 0 PLAUSIBLE, 0 KNOWN.

## 6. Đã xét, không thấy (theo trục)

- **E — Edge case:** `extractJson` (khối lồng, `{` không đóng, ngoặc kép lẻ, bị cắt, 2 MB, 2 000 000 `{`), `code-points` (cặp surrogate ở biên), `checkWebAnswer` (rỗng, 20 000 / 40 000 ký tự, tin nhắn app dán lại trên 995 hồ sơ thật, dán lại ở lần 2), `buildAnalysisInput` (bỏ superseded, tuổi, nhãn), Mock trên 995 hồ sơ cổng cho phép, `normalizeKycValue` qua V7 (số âm / thập phân / chữ số toàn độ rộng → bỏ). Ngoài CL-C1 không thấy.
- **C — Hợp đồng / spec / nhãn:** danh sách chặn `blocklists.ts` ↔ G5 §8.1–§8.4 từng mục (khớp); 4 prompt + `web@1` + retry do `prompts.test.ts` so nguyên văn; spec §3, §3.1, §5.3, §6.1–§6.4, §8, §9.1 ↔ `run.ts`, `web.ts`, `ai-analysis.ts`, panel; nhãn `vi.ts` của panel / trích xuất / lỗi theo nghĩa thường ("AI không tìm thấy dữ kiện mới" khi mọi đề xuất trùng dữ kiện đang có hoặc bị V7 bỏ — đúng §8.6). Thấy CL-C1, CL-C3, CL-C4, CL-C6.
- **D — Dữ liệu:** `analysisOutcome` / `recordAiAnalysis` (995 dòng Mock nhận), REJECTED giữ `raw_output` ≤ 20 000 và output đã parse, `Settings → AI` chỉ ghi 4 trường (đột biến C55 bị giết), Nạp lại chép dòng `ai`. Kịch bản nhiều bước đã xét: AI về sau khi KH bị xóa (→ `discarded`) rồi khôi phục (→ lưu, KYC không đổi, đúng); KYC đổi / "xác nhận lại cùng giá trị" trong phiên ChatGPT web (→ STALE / CURRENT ánh xạ mã, đúng §6.1, K10); khôi phục KH có phân tích từ Thùng rác → panel đọc được (c3). `saveChatGptAnswer` không kiểm thế hệ DB như `analyseCustomer` (DR5-36), nhưng thay dữ liệu chỉ chạy từ hộp **modal** ở Cài đặt (`Dialog` `showModal`) và vào Cài đặt là unmount panel giữ phiên, nên không có đường UI thường (chỉ khi điều hướng lùi bằng phím / chuột trong lúc hộp modal chạy — chưa thử) → không nêu.
- **G — Guardrail AI:** V1–V7 + danh sách chặn (75 đột biến, §7), 1 101 câu eval thật (c2: 0 chặn nhầm ngoài `personalityNotes`), AI không ghi KYC (đề xuất trích xuất không lưu, qua `ConfirmFactDialog` + lệnh thường), REJECTED không hiện như kết quả (C65 bị giết). Ký tự định dạng / bidi (U+202E…) được giữ trong `text` và hiện ra; V3–V6 so sau khi bỏ `\p{Cf}` nên chữ đảo hiển thị có thể khác chữ đã kiểm — cùng loại "model không đối kháng" G5 §10.2 / §10.10 đã chấp nhận, không nêu. Chỉ CL-C5.
- **S — Ranh giới:** key: `OpenCodeClient` không có lệnh đọc key, ô key `type="password"`, `save` chỉ 4 trường (C55), lỗi chỉ `code / httpStatus / message` đã che ở Rust; output model hiện bằng text node React (e2e `customer-ai-web.spec.ts:328` thử HTML); `open_chatgpt` / `window.open` URL hằng, không dữ liệu trong URL; tin nhắn ChatGPT web chỉ dữ kiện + mã F (không tên / mã KH, test `run.test.ts:445`); prompt injection từ ghi chú KYC chỉ ra được đề xuất phải qua V7 + RE xác nhận. Không thấy.
- **P — Hiệu năng:** §4b; không phát hiện.
- **B — Bloat:** §4a; không phát hiện mới (KNOWN #455, #469).
- **T — Test:** 77 lần đột biến (§7): 69 bị giết, 8 sống — C25 / C25b / C26 → CL-C2; C74 / C75 → CL-C3; C34 (`$` trong detail: detail không bao giờ chứa `$` — mã F chỉ chữ số, cụm chặn không có `$` → tương đương); C36 (`room` = 0: KNOWN #521 "message assistant có thể rỗng"); C53 (`KYC_VERSION_NOT_FOUND` → `discarded`: phiên bản không bao giờ bị xóa và thay DB đã bị chặn trước bởi `replaced()` → không đường nào tới, tương đương). Component TSX không có unit test (G4), e2e phủ (32 test AI) — không đột biến TSX vì `pnpm e2e` dùng chung cổng 4173 với bên kia.
- **A — Trợ năng / i18n:** quét chuỗi cứng trong 6 file TSX AI: chỉ KNOWN (`KycExtraction.tsx` dấu `:`); `aria-live` có sẵn trước khi điền, `role=status` / `alert`, focus sau Hủy / Thử lại / Đóng (R2-05, DR5-43), bảng lịch sử có nút trong ô đầu và `aria-current`. Không thấy.

## 7. Phụ lục

### 7.1 Probe, log, đột biến

Mọi file ở `C:\workspace\deep-review-1-6\claude\C\`. Probe import thẳng nguồn TS của repo ở SHA ghim qua `hooks.mjs` (chép từ `claude\A\hooks.mjs`), không sửa repo.

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `c1-validator.mjs` | V1–V6 trên ca biên tự viết (độ dài + `\p{Cf}`, câu thường trùng bản bỏ dấu, retry message) | `c1-validator.log` | CL-C1, CL-C5 |
| `c2-eval-texts.mjs` | 1 101 chuỗi `text` của hai báo cáo eval trong repo qua V3–V6 | `c2-eval-texts.log` | CL-C5, §6 G |
| `c3-panel-load.mjs` | view AI của app trên dữ liệu tải + sau khôi phục Thùng rác; thời gian | `c3-panel-load.log` | §4b |
| `c4-first-run.mjs`, `c4b-split.mjs` | chi phí lần chạy đầu (Node) | `c4-first-run.log`, `c4b-split.log` | §4b |
| `c5-edge-ai.mjs` | bấm Phân tích / Kiểm tra và lưu trên Edge, bản build web, dữ liệu tải (bản cuối: chặn mạng ngoài, thay `window.open`) | `c5-edge-ai.log`, `c5b-edge-same.log` (bỏ), `c5c-edge-safe.log` | §4b; sự cố đầu báo cáo |
| `c5-edge-ai.v1-unsafe.mjs.txt` | bản probe trước khi chặn mạng (giữ làm bằng chứng sự cố) | — | sự cố |
| `c6-mock-all.mjs` | Mock + ChatGPT web trên 995 KH cổng cho phép | `c6-mock-all.log` | §4b, §6 |
| `c7-seed-version.mjs` | `prompt_version` của seed so với app | `c7-seed-version.log` | CL-C4 |
| `c8-arrayfrom.mjs` | chi phí `Array.from` trên chuỗi rất dài | `c8-arrayfrom.log` | §4a |
| `b1-exports.mjs` | nơi dùng của 215 export | `b1-exports.log` | §4a |
| `m-list.mjs` + `m-run.mjs` | đột biến: vá một file, `pnpm exec vitest run <test>`, trả lại nguyên byte + kiểm sha256 trong `finally` | `m-run.log`, `m-run.out`, `m-table.txt` | §6 T, CL-C2, CL-C3 |

Nguồn đầy đủ nằm trong các file trên (cùng thư mục, giữ tới khi phát hành v1.0 theo `plan.md` §8).

### 7.2 Đột biến (77 lần: 69 bị giết, 8 sống)

Chạy 11:10–11:22. Lệnh test theo từng đột biến: `packages/ai/src` (598 test), thêm `packages/db/src/ai-analyses.test.ts` + `backup-invariants.test.ts` cho `schema.ts`, 9 file test AI của app (246 test) cho file app, `tauri-contract.test.ts` + `ai-tauri.test.ts` cho `ai.rs`. Danh sách đủ (mã, file, ý, kết quả) ở `C\m-table.txt` / `m-run.log`. Tóm tắt:

- `schema.ts` C01–C09: 9 / 9 giết · `validator.ts` C10–C17: 8 / 8 · `text-match.ts` C18–C22: 5 / 5 · `blocklists.ts` C23–C29, C25b, C25c: 6 / 9 (sống C25, C25b, C26) · `extract-json.ts` C30–C32: 3 / 3 · `retry.ts` C33–C34: 1 / 2 (sống C34) · `run.ts` C35–C42: 7 / 8 (sống C36) · `web.ts` C43–C46: 4 / 4 · `settings.ts`, `mock-adapter.ts` C47–C49: 3 / 3 · `ai-analysis.ts` C50–C56: 6 / 7 (sống C53) · `ai-jobs.ts`, `ai-tauri.ts` C57–C59: 3 / 3 · view app C60–C73: 14 / 14 · `ai.rs` (chỉ test TS) C74–C75: 0 / 2.

### 7.3 Cuối phiên

- `git status --short` cuối phiên (`C:\workspace\Project-2C-review`): rỗng (như đầu phiên); `C\pending.json` không còn (mọi file vá đã trả lại, kiểm sha256).
- Server tĩnh cổng 4291 và Edge headless của probe đã đóng.
- Giờ xong: 2026-10-14 11:31.
