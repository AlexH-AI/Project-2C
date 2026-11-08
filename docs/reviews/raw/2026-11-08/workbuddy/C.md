XONG — workbuddy gói C lượt 6, 11:42 08/11/2026

# Báo cáo deep review Phase 1–6, lượt 6 — gói C (AI), bên workbuddy

## 1. Bên, gói, môi trường

- **Bên / gói:** workbuddy, gói **C — AI** (`packages/ai/**`; file AI của app: `ai-*`, `*-ai-*`, `*Ai.tsx`, `KycExtraction`, `KycIntelligence`, `KycWebSession`, `KycHistory`, `extraction-view`). Reviewer độc lập, chỉ đọc (ADR-0001 phụ lục M13); **không làm bảng R1 / R2** — theo `common\prompt-workbuddy.md` (Việc của gói mục 1) và `common\known.md` phần 4, 5, mọi dòng R1 (DR6-164…168) và R2 (T-375) là KNOWN.
- **SHA đầu phiên:** `5b1328ae236aa62981dbf43066ff544a9e832c8c` (`git rev-parse HEAD`), đúng SHA ghim `5b1328a`.
- **`git status --short` đầu phiên:** rỗng (không có dòng nào).
- **Giờ bắt đầu:** 11:16 08/11/2026; **giờ xong:** 11:42 08/11/2026 (máy `DESKTOP-KDURKJP`, Home PC, GMT+7).
- **Công cụ:** app desktop WorkBuddy (bản theo `common\baseline.md`; baseline không ghi số bản của lượt 6, và phiên này không đọc thư mục dữ liệu của app), shell Git Bash của app, công cụ đọc / ghi file. **Không dùng agent phụ** (khối lượng đọc vừa, tự đọc hết). Không cài skill, không connector, không mạng ngoài, không `gh`, không đọc thư mục cấm.
- **Expert:** `CodeReviewExpert` (đã chọn trong phiên; mã không thấy).
- **Model:** ngữ cảnh phiên ghi `Deepseek-V4.1-Flash`; Owner chọn **Hy4** cho gói A–F (`common\baseline.md`, ghi chú sau phiên thử ≈ 23:35 07/11). Ghi cả hai, không khẳng định thay Owner.
- **Context:** không thấy trong ngữ cảnh phiên. **Mức suy luận:** không thấy trong ngữ cảnh phiên.
- **Bản Node đã dùng:** `v24.20.0` — lệnh đầu phiên đặt `export PATH="/c/Program Files/nodejs:$PATH"` rồi `node --version` in `v24.20.0` (≥ 24). Mọi lệnh có `node` / vitest đặt PATH ngay trong lệnh. Không chạy Playwright, không `pnpm`, không build.

## 2. Bảng R1 / R2

Không áp dụng (agent WorkBuddy không làm bảng R). Các phát hiện dưới đây là lỗ hổng test mới và lệch hợp đồng mới, có "Liên quan" tới vùng của DR6-166 / DR6-168 nhưng không phải dòng R.

## 3. Phạm vi đã đọc

### Diff `37a80b6..5b1328a` của gói C

`git diff --numstat 37a80b6 5b1328a -- packages/ai apps/desktop/src/routes/customers/{KycHistory,KycIntelligence,KycWebSession}.tsx` → **8 file, +113 / −23** (sản phẩm +46 / −16 · 5 file; test +65 / −5 · 2 file; `packages/ai/CLAUDE.md` +2 / −2), khớp `common\baseline.md` dòng gói C. Bản diff đầy đủ ở `workbuddy\C\diff-C.diff` (178 dòng) và `diff-C-test.diff`, đã đọc hết.

| File | +/− | Nội dung |
|---|---|---|
| `packages/ai/src/web.ts` | +16 / −5 | `isBlankWebAnswer` (luật trống dùng `normalizeText`, chặn `MAX_READ`), `checkWebAnswer` dùng nó (T-365, T-375; DR6-168) |
| `packages/ai/src/mock-extraction.ts` | +19 / −6 | `BULLET` nhận gạch ngang U+2013; `CHILD` nhận "đứa / thằng", trừ "nhỏ bé" (T-365, T-375; DR6-166) |
| `apps/desktop/src/routes/customers/KycWebSession.tsx` | +5 / −2 | nút "Kiểm tra và lưu" tắt theo `isBlankWebAnswer` (T-365) |
| `apps/desktop/src/routes/customers/KycIntelligence.tsx` | +2 / −1 | chip `min-w-0 wrap-anywhere` (DR6-170) |
| `apps/desktop/src/routes/customers/KycHistory.tsx` | +4 / −2 | ô nguồn / model dùng `CELL_NAME` (DR6-170) |
| `packages/ai/src/web.test.ts` | +38 / −5 | 5 ca `checkWebAnswer` theo lý do, khối `isBlankWebAnswer` mới |
| `packages/ai/src/mock-extraction.test.ts` | +27 / −0 | "–" làm dấu đầu dòng, `worded` (DR6-164), "nhỏ bé" / "đứa / thằng" |

Thay đổi sản phẩm đọc kỹ nhất (dòng ở `5b1328a`):
- `web.ts:117-131` — `isBlankWebAnswer(pasted)` = `pasted.length <= MAX_READ && normalizeText(pasted) === ''`; `MAX_READ = 2 × MAX_AI_RAW_OUTPUT` (`:108`).
- `web.ts:151-157` — thứ tự `checkWebAnswer`: hết phiên (ném) → `isOwnMessage` → `pasted.length > MAX_READ` → `isBlankWebAnswer` → `codePointsOver` → kiểm câu trả lời.
- `mock-extraction.ts:247` — `BULLET` thêm `–`; `:351-354` — `CHILD` thêm `đứa|thằng` + lookbehind `(?<!(?<!\p{L})nhỏ bé)`; `:365-383` — `otherDeaths` tìm `CHILD` **trong vế của cái chết**.
- `KycWebSession.tsx:175-180` — nút tắt theo `isBlankWebAnswer`, không còn `pasted.trim() === ''`.
- `KycIntelligence.tsx:209-217`, `KycHistory.tsx:88-95` — trần tên model dài (DR6-170).

### `common\files-C.txt`

65 file: **39 product, 26 test**.

- **39 file sản phẩm: đọc hết.** `packages/ai/src`: `adapter`, `analysis-steps`, `attempts`, `blocklists`, `code-points`, `errors`, `extract-json`, `index`, `input`, `mock-adapter`, `mock-extraction`, `models`, `raw.d.ts` (5 dòng khai báo `*?raw`), `run`, `schema`, `settings`, `text-match`, `validator`, `web`, `prompts/{analysis,connection,discovery,extraction,retry}` (24 file). App: `data/{ai-analysis,ai-jobs,ai-tauri}`, `routes/{SettingsAi,ai-error-view,settings-ai-view}`, `routes/appointments/{AppointmentAi,appointment-ai-view}`, `routes/customers/{KycExtraction,KycHistory,KycIntelligence,KycWebSession,ai-panel-view,extraction-view,use-ai-job}` (15 file).
- **26 file test:** đọc kỹ `web.test.ts` (diff + cả khối `isBlankWebAnswer` mới + bảng `checkWebAnswer`), `mock-extraction.test.ts` (diff + các ca "nhỏ bé" / "đứa / thằng" / `worded` / dấu đầu dòng), `prompts.test.ts`, `ai-panel-view.test.ts` (các ca `webAfter`, `analysisSource`), `blocklists.test.ts` (đầu file: nguồn đúng là file G5). Các file còn lại **không đọc từng dòng**: `packages/ai/src/{blocklists,code-points,errors,extract-json,input,mock-adapter,models,run,schema,settings,validator-blocklists,validator-extraction,validator-union,validator}.test.ts` và 7 file test app (`ai-analysis`, `ai-jobs`, `ai-tauri`, `ai-error-view`, `appointment-ai-view`, `extraction-view`, `settings-ai-view`). **Lý do:** không nằm trong diff `37a80b6..5b1328a`, không chứa nhánh sản phẩm mới; đã **chạy hết** (17 file / 1 646 test của `packages/ai`; 8 file / 203 test app-side, đều xanh) và quét bằng `rg` theo từng mẫu ở mục 5.

### Chỗ code gói khác mà gói C nối vào (đã đọc)

`packages/db/src/ai-analyses.ts` (record, `toRow`, `analysisLabelsFit`, `analysisContentFits`, `storedRawOutput`), `packages/db/src/backup-validation.ts` (luật 11–14), `packages/db/src/schema.ts` (`ai_analyses` và các CHECK, gồm `ai_analyses_model`), `packages/db/src/seed-data.ts` (`KYC_VALUES`: nhãn "Hôn nhân", "Số con"), `packages/domain/src/{text,kyc-gate,kyc-fact,evidence-level}.ts` (`normalizeText`, `LINE_BREAK`, `normalizeNote`, `collapseSpaces`, `evaluateKycGate`, `normalizeKycValue`, `evidenceLevel`), `apps/desktop/src/routes/customers/kyc-view.ts` (`factInEffect`, `factCodeTarget`), `apps/desktop/src/routes/customers/CustomerProfile.tsx` (`onWebOpen`), `packages/ui/src/components/{Dialog,Choices}.tsx`, `apps/desktop/src/i18n/{index,vi}.ts`, `apps/desktop/src/routes/classes.ts`, e2e `customer-ai.spec.ts`, `customer-ai-web.spec.ts`, `long-names.spec.ts` (phần lịch sử AI), `appointments.spec.ts:1027-1035`.

### Đọc trước

`docs/design/phase-5-ai.md` (§3, §3.1, §6.1, §7.1, §9.1, §9.2, §10), `docs/design/phase-5-prompts.md` (§5, §6a, §7, §8.1–§8.4, §11–§14), `docs/golden/ai-eval.md` (E01–E20, X01–X05), ADR-0009 (D-1, W-1), `CLAUDE.md` gốc + `packages/ai/CLAUDE.md`, `CONTEXT.md`, `common\known.md`, `common\fixes.md` (T-365, T-375), `common\baseline.md`, `common\plan.md` (§L6.0–§L6.11, §4), tổng hợp lượt 5 §2.2, §6.3, §9, §10.1 và các báo cáo gốc gói C ở `docs/reviews/raw/2026-10-15`, `…-10-17`, `…-10-21`, `…-10-31`, `…-11-05`.

## 4. Kịch bản đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | `probe-1-mock.mjs`: 30 câu ghi chú tự dựng — "đứa / thằng", "nhỏ bé", "bé nhỏ / Tí / gái", dấu đầu dòng `–`, `—`, `▪`, `•`, `-\t`, "1.", "1.Khách", "2020.", "...", "Ghi chú:", "Chú thích:", "Gặp." | `đứa/thằng … đã mất` → không đề xuất (đúng); `nhỏ bé` → giữ Số con 3; `—` / `▪` không là dấu đầu dòng; `–`, `•`, `-`, `1.`, `...`, "Ghi chú:" đều đề xuất; "Gặp. Khách…" không (đúng DR6-164) | — |
| 2 | `probe-2-debug.mjs` / `probe-3-someone.mjs`: xuất nội bộ `SOMEONE_ELSE`, `CHILD`, `NAMES_NO_ONE`, `namingPeople` từ bản chép `mock-debug.ts` | "Đứa nhỏ (bé) đã mất" → `[]` vì `at` của cái chết là vị trí **"Đứa"** (trước "bé"), không phải sau; "Đứa nhỏ, bé, đã mất" → `2` (xem WBR6-C2) | WBR6-C2 |
| 3 | `probe-4-perf.mjs`: `isBlankWebAnswer` trên 20 000 / 40 000 / 400 000 ký tự (chữ và dấu cách) | 0,04 / 0,08 / 0,00 ms (400 000 vượt `MAX_READ` nên trả ngay); không có chi phí đáng đo | — |
| 4 | `probe-5-chain.mjs`: chuỗi thật `createAppAi` → `extractFromNote` → `extractionView` trên 8 câu; `startWebAnalysis` → `checkWebAnswer` với tin nhắn của app (LF / CRLF), câu dán trống, 20 001 dấu cách | "Đứa nhỏ, bé, đã mất." → `childrenCount=2`, panel `proposals`; "Con út, bé út, đã mất." → `2`; dạng ngoặc / một vế → `empty`; tin nhắn app dán lại (LF và CRLF) → `OWN_MESSAGE`; trống → `EMPTY`; 20 001 dấu cách → `EMPTY` (không phải `TOO_LONG`) | WBR6-C1, C2 |
| 5 | `probe-8-nul.mjs`: câu dán chỉ có NUL (1 và 5), NUL + dấu cách, 20 001 dấu cách, 20 001 chữ "x" | `isBlankWebAnswer` = `false` cho NUL → `checkWebAnswer` trả `retry` với `attempts` = 1 (V1), tức **có** tính lần thử; 20 001 dấu cách → `unusable/EMPTY`; 20 001 "x" → `TOO_LONG` | WBR6-C1 |
| 6 | `probe-6-real-notes.mjs`: nhập `common\load\load-2026-10-12-seed6.p2cbackup` (16 034 517 B, sha256 `F952E062…13A0`), chạy `mockExtractionOutput` trên **cả 5 672 ghi chú** | 113,9 ms (0,020 ms/ghi chú), **0 lần ném**, 1 619 ghi chú có đề xuất — **tất cả `maritalStatus`**, 0 `childrenCount`; 0 ghi chú có "—" đầu dòng | WBR6-C3 |
| 7 | `probe-7-notes-sample.mjs`: 6 ghi chú seed có "con" / `Số con:` | Ghi chú seed là dạng "Hôn nhân: …; Số con: 2; …"; Mock chỉ nhận dòng "Hôn nhân:" (đúng §10), không nhận "Số con:" | WBR6-C3 |
| 8 | `node node_modules/vitest/vitest.mjs run packages/ai/src` và 8 file test AI của app | 17 file / **1 646 test** xanh; 8 file / **203 test** xanh; 0 đỏ | — |
| 9 | Đột biến trên bản chép / vá tạm rồi trả byte (mục 9): M1 bỏ `đứa|thằng`; M2 bỏ lookbehind "nhỏ bé"; M3 bỏ `–`; M4 `trim()`; M5 bỏ chặn `MAX_READ`; M6 thêm `—`; M7 `worded` = `clause.start > 0`; M11 thêm bỏ NUL vào luật trống; M12 đảo thứ tự trống / quá dài | M1 3 đỏ, M2 1, M3 2, M4 4, M5 1, M7 5 → **bị giết**; **M6, M11, M12 sống** (704/704, 70/70, 70/70) | WBR6-C1 |
| 10 | `git status --short` sau mỗi lần vá và cuối phiên | rỗng; sha256 từng file trùng lại sau khi trả | — |

## 5. Phát hiện mới

```
ID: WBR6-C1
Mức: Low
Trục: T
Vị trí: packages/ai/src/web.ts:129-131 (isBlankWebAnswer), :156-157 (thứ tự trong checkWebAnswer); packages/ai/src/web.test.ts:544-566 (khối isBlankWebAnswer), :277-290 (bảng checkWebAnswer) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-168 (luật câu dán trống, T-365 / T-375) — hai chỗ biên của luật ấy không ca nào giữ; mới do đợt sửa sau lượt 5 (PR #1066, #1086)
Mô tả: Luật "câu dán trống" có hai hành vi biên mà không test nào ghim: (a) câu dán chỉ có NUL **không** là trống — NUL không thuộc tập vô hình K20 (`normalizeText` giữ NUL, `INVISIBLE` của `domain/text.ts:19-21` loại trừ nó), nên nó phải tính một lần thử và ra V1; (b) câu dán vừa trống vừa quá 20 000 code point (vd. 20 001 dấu cách) ra `EMPTY`, không ra `TOO_LONG`, vì `checkWebAnswer` hỏi trống trước khi hỏi quá dài. Cả hai đổi được mà không test nào đỏ.
Tái hiện / bằng chứng: hai đột biến trên `web.ts`, chạy `node node_modules/vitest/vitest.mjs run packages/ai/src/web.test.ts`, và `probe-8-nul.mjs` cho hành vi hiện tại:
  - M11: `normalizeText(pasted)` → `normalizeText(pasted.replaceAll('\0', ''))` (NUL thành trống) → **70/70 xanh** (dòng 130 đã đổi, sha256 đổi rồi trả lại đúng).
  - M12: đảo hai dòng `if (isBlankWebAnswer…)` và `if (codePointsOver…)` → **70/70 xanh**.
  - Hành vi hiện tại (probe-8): `isBlankWebAnswer('\0')` = `false`; `checkWebAnswer(session, '\0')` → `{kind:'retry'}` với `session.attempts.length = 1` (một lần thử, V1 "không có khối JSON") — đúng K20 (NUL không là trống); `checkWebAnswer(session, ' '.repeat(20_001))` → `{kind:'unusable', reason:'EMPTY'}`; `'x'.repeat(20_001)` → `TOO_LONG`.
Cùng mẫu: `rg -n "isBlankWebAnswer|codePointsOver\(pasted" packages/ai/src` → 2 chỗ sản phẩm (`web.ts:130`, `:157`) và 1 chỗ gọi ở app (`KycWebSession.tsx:178`); khối test `web.test.ts:544-566` chỉ có rỗng / khoảng trắng / U+200B+U+2060+U+3164+U+0085 / 40 000 dấu cách (trống) và chữ / "." / 40 001 dấu cách (không trống); bảng `checkWebAnswer` (`:277-290`) không có ca NUL và không có ca "trống nhưng 20 001–40 000 ký tự"; e2e `customer-ai-web.spec.ts:63-69` chỉ ghim dạng vô hình U+200B / U+2060 / U+3164. Không chỗ nào khác cùng mẫu.
Ảnh hưởng: hôm nay không có lỗi người dùng; nhưng một lần sửa sau (thêm NUL vào tập trống, hay đảo thứ tự kiểm) đổi hành vi mà CI vẫn xanh: câu dán chỉ có NUL sẽ không còn tính lần thử (trái §3.1 mục 3: NUL không thuộc K20), hoặc câu dán 20 001 dấu cách hiện lỗi "quá 20 000 ký tự" thay vì nút tắt.
Chặn phát hành: không — Low ở trục T; hành vi hiện tại đúng spec, chỉ là test hở.
Đề xuất: thêm 3 ca vào `web.test.ts`: `isBlankWebAnswer('\0')` → `false`; `checkWebAnswer(session, '\0')` → `kind: 'retry'` và `session.attempts.length === 1` (một lần thử, V1); `checkWebAnswer(session, ' '.repeat(20_001))` → `{kind:'unusable', reason:'EMPTY'}` (ghim thứ tự đã chọn). Cỡ: ~12 dòng test, 0 dòng sản phẩm.
```

```
ID: WBR6-C2
Mức: Low
Trục: C
Vị trí: packages/ai/src/mock-extraction.ts:365-383 (otherDeaths: chỉ tìm CHILD trong vế của cái chết), :433-480 (luật Số con); docs/design/phase-5-ai.md:381 (luật §10) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-166 (Mock trích xuất bỏ lỡ đề xuất), DR6-141 / K42 (CX-A4: thà không đề xuất còn hơn đề xuất sai); có từ trước, lượt 1–5 bỏ sót (đo lại trên dữ liệu tải và trên chuỗi UI ở lượt này)
Mô tả: Một cái chết của con nêu ở **vế sau dấu phẩy** không được buộc vào chữ chỉ con ở vế trước: "KH có 2 con. Đứa nhỏ, bé, đã mất." → Mock đề xuất **Số con 2**. Luật §10 xét theo "vế", nên câu chữ được theo đúng; nhưng nguyên tắc CX-A4 mà chính §10 nêu ("thà không đề xuất còn hơn đề xuất sai") bị vi phạm — ghi chú nói một con đã mất, đề xuất lại là 2.
Tái hiện / bằng chứng: `probe-1-mock.mjs` và `probe-5-chain.mjs` (qua `extractFromNote` + `extractionView`, tức đúng đường UI):
  - "KH có 2 con. Đứa nhỏ, bé, đã mất." → `childrenCount=2 [2 con]`, panel `proposals`;
  - "KH có 2 con. Đứa nhỏ, bé gái, đã mất." → `2`;
  - "KH có 2 con. Con út, bé út, đã mất." → `2`;
  - đối chứng đúng: "…Đứa nhỏ đã mất." / "…Đứa nhỏ (bé) đã mất." / "…Con út đã mất." → không đề xuất.
  Nguyên nhân: `otherDeaths` lấy `clauseAt(death.index)` rồi `part.text.search(CHILD)`; dấu phẩy là `CLAUSE_END` (`:628`), nên vế " đã mất" không có "con / bé / đứa / thằng".
Cùng mẫu: `rg -n "clauseAt|otherDeaths|CHILD" packages/ai/src/mock-extraction.ts` → chỉ `otherDeaths` đọc cái chết; mọi dạng đặt chữ chỉ con ở vế trước, cái chết ở vế sau (3 dạng ở trên) đều sai; dạng ngoặc, dạng cùng vế, dạng "Một con đã mất" đúng. Không có chỗ khác cùng mẫu trong repo.
Ảnh hưởng: RE thấy "AI đề xuất: Số con: 2" trên ghi chú nói một con đã mất; xác nhận thì ghi 2 thay vì 1 (hoặc không đề xuất). Chỉ Mock (demo / e2e / máy chưa có key — provider mặc định), và RE xác nhận từng đề xuất; dữ liệu hiện là giả lập (K1).
Chặn phát hành: không — Low ở trục C, và đây là quyết định chữ nghĩa của §10 (sửa là quyết định hành vi mới, K49 cấm trước v1.0); phiên tổng hợp chốt.
Đề xuất: trong `otherDeaths`, khi vế của cái chết không có `CHILD`, xét vế ngay trước nó trong cùng câu (dấu phẩy giữa hai vế) cho một chữ chỉ con; có thì coi là cái chết của con (không đề xuất Số con), hướng an toàn CX-A4. Cỡ: ~10 dòng sản phẩm + 3 ca test.
```

```
ID: WBR6-C3
Mức: Nit
Trục: C
Vị trí: packages/ai/src/mock-extraction.ts:285-288 (FIELD_LINE: chỉ "Hôn nhân:"), :433-480 (luật Số con); packages/db/src/seed-data.ts:241-242 (nhãn seed "Hôn nhân", "Số con") (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-171 (b) (dòng NT-AI-17 ghi Mock "chỉ nhận '<n> con'…", nay §10 rộng hơn), T-330 / T-375; có từ trước, lượt 1–5 bỏ sót (đo mới trên 5 672 ghi chú của dữ liệu tải)
Mô tả: Ghi chú seed viết mọi trường theo dạng "Nhãn: giá trị; …" ("Hôn nhân: Đã kết hôn; Số con: 2; …"). Mock nhận **đúng một** dòng trường như thế — "Hôn nhân:" (`FIELD_LINE`) — nên trên chính ghi chú của app nó **không bao giờ** đề xuất Số con (hay bất kỳ trường nào khác), dù ghi chú ghi rõ "Số con: 2".
Tái hiện / bằng chứng: `probe-6-real-notes.mjs` trên dữ liệu tải (5 672 ghi chú: 4 033 RE, 1 639 SYSTEM): 1 619 ghi chú có đề xuất, **tất cả `maritalStatus`**, `childrenCount` = 0, 0 lần ném, 113,9 ms. `probe-7-notes-sample.mjs`: 6/6 ghi chú mẫu dạng "Hôn nhân: …; Số con: 2; …" → chỉ `maritalStatus`; 0 ghi chú nào có dạng "<n> con" mà luật Số con nhận.
Cùng mẫu: `rg -n "FIELD_LINE|hôn nhân" packages/ai/src/mock-extraction.ts` → một dòng trường duy nhất; 20 trường còn lại không có luật dòng trường (đúng §10, chỉ "Dòng 'Hôn nhân: …' như seed ghi").
Ảnh hưởng: màn AI trích xuất trên ghi chú seed (đường demo mặc định, provider Mock) chỉ đề xuất được Hôn nhân; tính năng trông mỏng trong demo. Không có dữ liệu sai, không chặn việc chính.
Chặn phát hành: không — Nit ở trục C; thêm luật là hành vi mới (K49 cấm trước v1.0).
Đề xuất: Owner quyết. Nếu muốn demo đủ: thêm dòng trường "Số con:" như "Hôn nhân:" (một `FIELD_LINE` + một luật Số con, ~10 dòng + 3 ca); nếu không, ghi giới hạn này vào §10 (và sửa dòng NT-AI-17 đang ghi thiếu, DR6-171 b). Cỡ: ~10 dòng sản phẩm / test, hoặc 1 dòng spec.
```

## 6. Bloat / Hiệu năng

Không áp dụng cho gói C (mục bắt buộc chỉ ở gói F và chủ đề G của Claude). Số đo P đã lấy, không thấy phát hiện mới:
- `isBlankWebAnswer` (chạy mỗi lần render khung dán, tức mỗi phím): 20 000 ký tự 0,04 ms; 40 000 ký tự 0,08 ms; 400 000 ký tự 0,00 ms (vượt `MAX_READ`, trả ngay) — dưới xa ngưỡng 200 ms.
- `mockExtractionOutput` trên cả 5 672 ghi chú thật: 113,9 ms (0,020 ms/ghi chú) — cùng cỡ mốc DR6-165 đã chấp nhận (Q2 (a): 103,5 ms cho 3 551 ghi chú; dữ liệu tải ở đây 5 672 ghi chú), dưới ngưỡng 200 ms.
- Diff sản phẩm của gói: +46 / −16 · 5 file; không có file mới, không code chết thêm.

## 7. Đếm

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 2 |
| Nit | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| **Tổng** | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | **3** |

3 phát hiện; **0 xếp chặn phát hành**, 3 không chặn. **0 PLAUSIBLE** — cả 3 CONFIRMED bằng probe chạy thật (C1 thêm hai đột biến sống, C3 thêm số đo trên 5 672 ghi chú của dữ liệu tải). Không có Critical / High / Medium.

## 8. Đã xét, không thấy

- **E (edge case):** 30 câu ghi chú tự dựng (đứa / thằng, nhỏ bé, bé nhỏ / Tí / gái, dấu đầu dòng `–` `—` `▪` `•` `-` `1.` `1)` `...`, "Ghi chú:" / "Chú thích:" / "Gặp.", câu có dấu phẩy, ngoặc, "đều đã mất", "vợ đã mất"); 5 672 ghi chú thật; biên của khung dán (rỗng, khoảng trắng, U+200B / U+2060 / U+3164 / U+0085, NUL, CRLF, 20 001 và 40 001 dấu cách, 20 000 / 40 000 / 400 000 ký tự). Không thấy lỗi mới ngoài WBR6-C1 / C2; `—` và `▪` không phải dấu đầu dòng **theo đúng** §10 (tập "-", "–", "*", "•", "+", "1)"), nên không báo.
- **C (hợp đồng / spec / nhãn):** §3.1 mục 3 (luật trống, tin nhắn của app, 20 000 ký tự), §9.1 (mọi trạng thái panel, chip, lịch sử, dòng REJECTED, "Output quá lớn"), §9.2 (khối AI ở lịch hẹn), §10 (mọi vế của Mock); `web@1` và 4 prompt so từng chữ với file G5 (test `prompts.test.ts:22-28`, `web.test.ts:126`); nhãn i18n của panel / Settings / lỗi; mockup `ai.html` 2f / 2i / 2j / 4e–4i. WBR6-C2, C3 là hai chỗ lệch; ngoài ra không thấy.
- **D (dữ liệu):** chuỗi `extractFromNote` → `extractionView` (8 câu), `filterExtraction` V7 (trường, kiểu, trích dẫn), `analysisOutcome` (ACCEPTED / REJECTED, `output` null khi quá 20 000, `raw_output` rỗng → `(empty)`), `recordAiAnalysis` (`toRow`, CHECK `ai_analyses_model` / `_outcome`), `storedRawOutput` (NUL, surrogate lẻ, U+FEFF), `factInEffect` / `evidenceLevel`. Không thấy.
- **G (guardrail AI):** V1–V7; `BLOCKLISTS` so từng dòng với bảng G5 §8.1–§8.4 (`blocklists.test.ts` đọc file duyệt); V2 evidence / hạng mục; V5 chỉ miễn trong `personalityNotes`; trần 30 issue, 5 mã sai, 40 ký tự trích; `MAX_AI_RAW_OUTPUT`, `MAX_WRITTEN`, 300 ký tự. Không thấy.
- **S (an toàn ranh giới):** key chỉ ở Rust (`ai-tauri`, `checkKey` 1–512 ASCII in hoa thường, `KEY_CHARS`); lỗi AI không mang key / header / body (`AiError` chỉ code + status + 200 ký tự server); `AI_BAD_REQUEST` là bug của app → câu chung; `save` chỉ ghi 4 trường; `startWebAnalysis` không gọi mạng; `CHATGPT_URL` cố định, `noopener`. Không thấy.
- **P (hiệu năng):** mục 6. Không thấy.
- **B (bloat):** gói C không phải mục bắt buộc; diff +46 / −16, không file mới, không code chết. Không thấy.
- **T (chất lượng test):** 9 đột biến (mục 4 #9): 6 bị giết, 3 sống (M6 ngoài spec; M11 / M12 → WBR6-C1). Không thấy test hở khác: `webAfter` / `manual` / `analysisSource` / `issueLine` / `outputTooLarge` đều có ca (`ai-panel-view.test.ts`), đường dẫn dài của model có e2e (`long-names.spec.ts:357-520`), phím / focus của panel và trích xuất có e2e (`customer-ai.spec.ts:865-974`).
- **A (trợ năng / i18n):** `aria-live` cho kết quả, `role="alert"` cho lỗi, focus sau Hủy / Thử lại / đóng phiên, `aria-label` ô copy tay, mô tả lỗi của khung dán, bảng lịch sử có tiêu đề cột (state là `sr-only`), link "Cài đặt → AI" chỉ ở `AI_NO_KEY`. Không thấy.

## 9. Phụ lục

**Nguồn probe / test tạm / đột biến** (đều trong `C:\workspace\deep-review-1-6-r6\workbuddy\C\`):
- `probe-1-mock.mjs` (+ `.log`): 30 câu ghi chú, `mockExtractionOutput`.
- `mock-debug.ts` (bản chép `mock-extraction.ts` + `export` nội bộ), `probe-2-debug.mjs`, `probe-3-someone.mjs` (+ log): vì sao "Đứa nhỏ (bé)" đúng.
- `probe-4-perf.mjs` (+ log): chi phí `isBlankWebAnswer`.
- `probe-5-chain.mjs` (+ log): `createAppAi` → `extractFromNote` → `extractionView`; `startWebAnalysis` → `checkWebAnswer` (LF / CRLF / trống / 20 001 dấu cách).
- `probe-6-real-notes.mjs`, `probe-7-notes-sample.mjs`, `probe-8-nul.mjs` (+ log): dữ liệu tải, 5 672 ghi chú; biên NUL / 20 001 dấu cách.
- `mutate.sh` (+ `mutate.log`), `mut/orig*.ts`: 9 đột biến, mỗi lần `sha256` trước / sau và trả nguyên byte.
- `diff-C.diff`, `diff-C-test.diff`: bản diff đã đọc.

**Đột biến — cái bị test giết, cái sống** (chạy `packages/ai/src/mock-extraction.test.ts` hoặc `web.test.ts`, mỗi lần trả file rồi so sha256 = đúng):
| Mã | Đột biến | Kết quả |
|---|---|---|
| M1 | `CHILD` bỏ `đứa|thằng` | 3 đỏ → giết |
| M2 | `CHILD` bỏ lookbehind `nhỏ bé` | 1 đỏ → giết |
| M3 | `BULLET` bỏ `–` | 2 đỏ → giết |
| M4 | `isBlankWebAnswer` → `pasted.trim() === ''` | 4 đỏ → giết |
| M5 | `isBlankWebAnswer` bỏ chặn `MAX_READ` | 1 đỏ → giết |
| M6 | `BULLET` thêm `—` | 704/704 xanh → **sống** (ngoài spec §10: không phải lỗ, không báo) |
| M7 | `worded ||= /\p{L}/u.test(...)` → `worded ||= clause.start > 0` | 5 đỏ → giết (DR6-164 được ghim) |
| M11 | `isBlankWebAnswer` thêm `replaceAll('\0', '')` | 70/70 xanh → **sống** → WBR6-C1 (a) |
| M12 | đảo thứ tự trống / quá dài trong `checkWebAnswer` | 70/70 xanh → **sống** → WBR6-C1 (b) |

**Test đã chạy:** `packages/ai/src` 17 file / 1 646 test xanh; 8 file test AI của app 203 test xanh; `git status --short` sau mỗi lần vá và cuối phiên: **rỗng**. Không chạy Playwright, không `pnpm`, không build; không đo exe (gói C không cần).

**`git status --short` cuối phiên:** rỗng.
**Giờ xong:** 11:42 08/11/2026.
