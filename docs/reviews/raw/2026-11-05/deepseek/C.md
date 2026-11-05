XONG — deepseek gói C lượt 5, 10:56 05/11/2026

# DeepSeek — gói C (AI), deep review Phase 1–6 lượt 5

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | deepseek (`DSR5`) |
| Gói | C. AI — `packages/ai/**`, file AI của app (`ai-*`, `*-ai-*`, `*Ai.tsx`, `KycExtraction`, `KycIntelligence`, `KycWebSession`, `KycHistory`, `extraction-view`) |
| SHA đầu phiên | `37a80b662861d308a110d1e2b0f65ad13b91fb51` (`37a80b6`) — khớp SHA ghim trong `common\baseline.md` |
| `git status --short` đầu phiên | rỗng (0 dòng) |
| Giờ bắt đầu | 10:32 05/11/2026 (SEAST, GMT+7) |
| App | WorkBuddy **v5.9.4** (theo `common\baseline.md`, mục "Kiểm ACL với Code review expert") |
| Expert | **CodeReviewExpert** (khối expert của ngữ cảnh phiên) |
| Model | **DeepSeek-V4.1-Flash** (dòng "This conversation is powered by DeepSeek-V4.1-Flash") |
| Context | 1M (Owner ghi từ giao diện app, `baseline.md`) |
| Mức suy luận | Max (Owner ghi, `baseline.md`) |
| Node | `"C:\Program Files\nodejs\node.exe" --version` → **v24.20.0** (≥ 24, đi tiếp); mọi lệnh `node` / vitest / Playwright đặt `C:\Program Files\nodejs` lên đầu PATH trong cùng lệnh |
| Chế độ quyền | Default; Playwright chạy được (app ghi "Sandbox bypassed (escalation-approved)" như `baseline.md`) |
| Phiên trước | `C.md` chưa có → làm mới (A, B đã `XONG`) |

## 2. Bảng R

### 2.1 R1 — theo mã

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-137 | #896 → #907 (+ #933 → #946) | **ĐÃ SỬA** | `probe-r1.mjs` (log `C\probe-r1.log`): `isLabel('x'×99 + nửa surrogate)` **false**, `isLabel('\uFEFFgpt-5')` **false**, `isLabel('gpt\u00005')` **false**, `isLabel('gpt-5')` true, 100 ký tự true. Gỡ phần sửa (`readsBackAsIs` → `isStorableText`, bỏ kiểm U+FEFF) ở **M3**: **8 test đỏ** (`common.test.ts` "refuses a NUL, a lone surrogate half and a U+FEFF that starts the text", `ai-analyses.test.ts` "refuses an analysis whose provider…", `backup.test.ts` 5 ca theo cột, "reads a model name at the import (rule 12)…"); gỡ xong trả byte, sha256 `39e8e489…6be9c` | `isLabel` và `valueOf` của luật nhập 12 cùng gọi `readsBackAsIs` (`packages/db/src/common.ts:96`); chữ chỉ khoảng trắng vẫn bị từ chối; NUL bị từ chối ở cả hai đường |
| DR6-141 | #899 → #917 (+ #930 → #937, #931 → #939, #950 → #956, #960 → #963) | **ĐÃ SỬA** | `probe-r1.mjs`: **18 / 18 câu của CLR4-C1 (lượt 4)** nay ra **∅** (đâu có / làm gì có / "đâu" cuối vế / "là sai" / "Trước đây…" / "con dấu, con tem" / "định, tính sinh con" / "chuẩn bị kết hôn" / "khi…thì" / "đến lúc…" / danh sách chọn). `probe-spec.mjs`: **50 ví dụ của spec Phase 5 §10** (bản `37a80b6`) — 0 lệch thật (5 dòng in ra chỉ khác thứ tự field hoặc kỳ vọng của tôi sai; xem phụ lục). Gỡ cổng "câu kể đơn" (`simpleStatement` → `true`) ở **M4**: **127 test đỏ** (`mock-extraction.test.ts`), gồm mọi ca DR6-141 | Biến thể mới (câu tự dựng, `probe-r1.mjs`): "KH góa vợ, có 3 con, 2 con đã mất." → Góa + 1; "KH đã kết hôn, ly thân 2 năm, nay độc thân." → Độc thân (luật giá trị cuối); "KH có 2 con nuôi, đã kết hôn." → ∅; "KH đã kết hôn, vợ chưa kết hôn lần nào." → Đã kết hôn; "Theo hồ sơ cũ KH đã kết hôn, nay KH độc thân." → Độc thân. Không câu nào ra giá trị trái nghĩa |
| DR6-142 | #900 → #909, #913 (+ #930 → #937) | **ĐÃ SỬA** | `probe-r1.mjs`: "Khách có phần\u0000trăm chốt cao." → **V3 "phầntrăm"**; "xác\u0000suất" → **V3**; "phần\u0000 trăm" → **V3 "phần trăm"**; bản có dấu cách vẫn V3. Gỡ `text.replaceAll('\0','')` khỏi `cleanText` ở **M1**: **16 test đỏ** (`validator-blocklists.test.ts` C80/C81, gồm "phần\u0000trăm", "xác\u0000suất", "P\u0000rudential", "I\u0000NTJ", "Lu\u0000ật Kinh doanh…") | Chỉ đổi bản so khớp, không đổi chữ lưu: V1 vẫn nhận chữ có NUL (K25 giữ NUL cho chỗ lưu); `detail` trích bản đã bỏ NUL — đúng §14.2 |
| DR6-143 | #900 → #909, #913 (+ #930 → #937) | **ĐÃ SỬA** | `probe-r1.mjs`: "Môi giới Luật Kinh doanh bảo hiểm.", "Ranh giới…", "Biên giới…", "Thế giới…" → **V6 "Luật K"**; "Giới luật Phật giáo." và "GIỚI LUẬT Phật giáo." → **0 issue**; "Định luật Pareto." → 0. Gỡ `unlessAfter('giới', GIOI_OF)` (dùng `ci('giới')`) ở **M2**: **9 test đỏ** (`blocklists.test.ts`, `validator-blocklists.test.ts` C82, gồm "MÔI GIỚI LUẬT", "Ranh giới Luật Đất đai", "biên giới Luật Hải quan", "thế giới Luật Thừa kế") | `LAW_NAME` vẫn dựng bằng `unlessAfter` cho cả "giới" và "định" (T-329); chuỗi regex không đổi so với trước PR (xem T-329) |
| DR6-144 | #899 → #917 (+ #933 → #946) | **ĐÃ SỬA** | `probe-scenarios.mjs` (S2): `AiJobs.start` một lỗi `AI_TIMEOUT` với `keptFailures` → `jobs.kept('analysis:x')` trả lỗi; **generation 0 → 1** → `kept` trả **undefined**. Gỡ kiểm generation trong `kept()` ở **M5**: **3 test đỏ** (`ai-jobs.test.ts` "keeps a failure only for the data it ended on…", `ai-analysis.test.ts` hai ca "…not once the data is replaced by Nạp lại / by an import of a backup of the same data"). 5 file test AI của app (157 ca) xanh | Đường cũ của lượt 4 (mở lại hồ sơ sau Nhập backup / Nạp lại vẫn thấy lỗi cũ) không còn: `kept` đọc `generation` tại lúc job xong và so lại mỗi lần đọc; `start` và `drop` vẫn xoá mục đã giữ |

### 2.2 R2 — theo Issue

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-329 | #930 → #937 | **ĐÃ SỬA** (refactor, không đổi hành vi) | `probe-t329c.mjs`: Mock của `b6d4388^` (adapter cũ) so với `b6d4388` (sau T-329) trên **556 chuỗi** lấy từ hai file test Mock → **0 khác**. `git show --stat -M eefcd8e` ghi `{mock-adapter.ts => mock-extraction.ts}` và `{mock-adapter.test.ts => mock-extraction.test.ts}` (đổi tên thuần; `b6d4388` là commit merge nên `git show --stat` không in diff); `index.ts` vẫn chỉ `export * from './mock-adapter'`, `mock-extraction` không qua index. `mock-adapter.ts` còn **72 dòng** (chỉ adapter + `allowedFields`). Đột biến `namingTheKh` (bỏ nhánh `saysKh`, **M6**): **2 test đỏ** ("KH giới thiệu anh Nam, hai vợ chồng đã kết hôn 5 năm." và bản hai câu) — tức hai khuôn vẫn khác nhau đúng như trước | `LAW_NAME`/`NUL`/`ownLine`/`aboutTheKh` đều nằm trong cùng PR; ca "Độc thân: KH đã kết hôn." → ∅ có test trong `mock-extraction.test.ts`. `pnpm codemap:check` xanh ở `baseline.md` |
| T-330 | #931 → #939 | **ĐÃ SỬA** | `probe-spec.mjs`: 50 ví dụ §10 (bản đã viết lại theo bốn luật) khớp code; `probe-r1.mjs`: các ca chấp nhận của Issue — "KH độc thân. Nay KH đã kết hôn." → Đã kết hôn; "KH đã kết hôn. Đã ly hôn năm 2020." → Ly hôn; "KH đã kết hôn nhưng vợ đã mất." → Góa; "KH đã kết hôn nhưng đang ly thân." → Ly thân; "KH có 2 con. Một con đã mất." → 1; "KH có 2 con nhưng đều đã mất." → 0; "KH có 2 bé đã lớn, độc thân." → chỉ 2; "KH có 2 con. Thực ra chỉ 1 con." → ∅; "KH có 2 con. Anh Nam có 3 con." → ∅. Gỡ luật 3 (`lessBy` → `undefined`) ở **M11**: **9 test đỏ** | Luật 1–4 và ":" / "endedBy" đều có bảng ca trong `mock-extraction.test.ts` (684 ca); 14 ca có sẵn đổi kết quả đúng bảng thân PR #939 (kiểm lại "KH có 2 con. Một con đã mất." và "đều đã mất"); ghi chú "lớp mới" của PR (câu sau không chủ ngữ) có ca ghim |
| T-332 | #933 → #946 | **ĐÃ SỬA** (phần gói C) | **M9** (`notify` bỏ `try`): **2 test đỏ** ("still calls the listeners after one that throws…", "reports a listener that throws, still telling the others, and gives the job it started"). **M5** (bỏ generation của `kept`): 3 test đỏ. 5 file test AI của app **157 / 157 xanh**; `listeners.ts` 15 dòng, `notify` được `AppData`, hàng đợi lưu và `AiJobs` cùng gọi (`grep`), cách báo lỗi giữ nguyên (`console.error` ×2, `reportError` ×1) | Phần `readsBackAsIs` của T-332 kiểm ở dòng DR6-137 (M3). `parseTime` / `SettingsBackup` / khóa i18n thuộc gói D / E, không làm lại ở đây |
| T-336 | #950 → #956 | **ĐÃ SỬA** | **M7** (bỏ phép thử `\p{L}` của `carried`): **2 test đỏ** — "KH đã kết hôn.\nSống ở quận 7.\nCó 2 con." (ca T-339 thêm) và "KH đã kết hôn, sống ở quận 7. Có 2 con.". `probe-r1.mjs`: "KH đã kết hôn.\nĐã ly hôn năm 2020." và "- KH đã kết hôn\n- Đã ly hôn năm 2020." → Ly hôn; "KH có 2 con.\nMột con đã mất." → 1 | `CHILD_WORD` / `WIDOWED` gom một hằng (đọc code + 684 ca xanh); `.dependency-cruiser.cjs` thuộc gói F, `pnpm lint:deps` xanh ở `baseline.md` |
| T-339 | #960 → #963 | **ĐÃ SỬA** | Đưa mẫu bậc hai vào `mockExtractionOutput` (quét lại `note[0..at)` cho mỗi cụm, **M10**): **4 / 32 hàng** của bảng "36 000 ký tự … in linear time" **đỏ** ("độc thân", "đã kết hôn", "vợ đã mất, ", "đã kết hôn, " after one "KH"), 28 hàng còn lại xanh; gỡ đột biến, 684 ca xanh. Test dùng tỉ lệ **< 10 × mốc** đo cùng máy cùng lần chạy, mốc sàn 5 ms (`Date.now()`), 3 lần lấy min — đúng mô tả PR | Đo lại (máy này, `node -e` cùng công thức của test): 4 dạng 36 000 ký tự **4,4–6,0 ms** (min 7 lần); `shortNote` 316 ký tự **0,054 ms**/lần đọc, 114 lần đọc để phủ 36 006 ký tự = **5,35 ms** ⇒ tỉ lệ **0,79**, cách trần 10 khoảng 12 lần; mẫu bậc hai của M10 cho 200–350 ms/hàng |

## 3. Phạm vi đã đọc

- **`packages/ai/src` — đọc hết:** `mock-extraction.ts` (950), `mock-extraction.test.ts` (1 162, đọc phần bảng luật 1–4, bảng 36 000 ký tự, `shortNote`), `mock-adapter.ts` (72), `mock-adapter.test.ts` (155), `blocklists.ts` (126), `blocklists.test.ts` (206), `text-match.ts` (155), `validator.ts` (313), `validator-blocklists.test.ts` (517, các ca C80–C82), `web.ts` (162), `web.test.ts` (533), `schema.ts` (418, phần `mockAnalysisOutput`, `PROMPT_VERSIONS`, `buildAnalysisInput`), `test-support.ts` (111), `input.ts`, `attempts.ts`, `analysis-steps.ts`, `run.ts` (307–321), `prompts/{analysis,discovery}.ts` (dòng `version`), `index.ts`, `CLAUDE.md`.
- **App — đọc hết:** `data/ai-jobs.ts` (132), `data/ai-analysis.ts` (370), `data/listeners.ts` (15), `data/ai-tauri.ts` (73), `routes/customers/use-ai-job.ts` (66), `KycIntelligence.tsx` (642), `KycExtraction.tsx` (197), `KycWebSession.tsx` (193), `KycHistory.tsx` (159), `extraction-view.ts` (104), `ai-panel-view.ts` (643, phần `aiPanelView`, `issueLine`, `analysisContent`, `historyRows`), `routes/SettingsAi.tsx` (411, phần đầu + `KeyCard`), `routes/customers/CustomerProfile.tsx` (chỗ nối `NoteEvent` / `KycIntelligence`), `i18n/vi.ts` (khóa `kyc.factLine`, `customer.withCode`).
- **Diff `2e51e25..37a80b6` của gói C:** **11 file SP + 10 file test**, **+1 051 / −498 SP, +1 396 / −733 test** — khớp `baseline.md`. Đọc từng hunk của `mock-extraction.ts` (mới, 950 dòng), `mock-adapter.ts` (còn 72 dòng), `blocklists.ts`, `text-match.ts`, `test-support.ts`, `prompts/*`, `schema.ts`, `web.ts`, `ai-jobs.ts`, `ai-analysis.ts`, `use-ai-job.ts`; đọc thêm file của gói khác nối vào (`app-data.ts`, `persist-queue.ts`, `listeners.ts`, `tauri-contract.test.ts`, `CustomerKyc.tsx` — +5/−2, +8/−10, +15/−0, +20/−8, +4/−1).
- **Chỗ gói khác nối vào:** `packages/db/src/{common,ai-analyses,backup,kyc}.ts` (`isLabel`, `readsBackAsIs`, `analysisLabelsFit`, `recordKycNote`, `listAiAnalyses`), `packages/domain/src/text.ts` (`normalizeText`), `apps/desktop/src/data/{app-data,persist-queue}.ts` (generation, `notify`).
- **Tài liệu:** `docs/design/phase-5-ai.md` §10 (đủ, đối chiếu 50 ví dụ), `docs/design/phase-5-prompts.md` §14 (đọc phần "Mất", bước 0), `docs/golden/ai-eval.md` (chỉ đọc; Mock không chạy eval X01–X05), `CLAUDE.md` gốc + `packages/ai/CLAUDE.md`, `common\{known.md, fixes.md (T-329, 330, 332, 336, 339 + 5 nhóm RESOLVED), baseline.md, plan.md §4, §L5.1–§L5.8}`, tổng hợp lượt 4 §3.1, §6, §8.4; báo cáo gốc lượt 4 `docs/reviews/raw/2026-10-31/{claude,codex}/C.md` (phần CLR4-C1 / CXR4-C1).
- **Không đọc** thư mục cấm nào (quy tắc riêng 2); không đọc báo cáo lượt 5 của bên khác.

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| K1 | Ghi chú → AI trích xuất (Mock qua `extractFromNote`) → Xác nhận một đề xuất (`recordKycNote`) → trích xuất lại → `extractionView` với dữ kiện mới (`probe-scenarios.mjs` S1) | Lần 1: 2 đề xuất (Đã kết hôn, 2 con). Xác nhận Hôn nhân → lần 2 Mock vẫn đề xuất cả hai (không nhớ), nhưng view **ẩn** đề xuất đã có (`hidden: 1`) và chỉ còn Số con — đúng §8 item 4 | không thấy |
| K2 | Job AI lỗi (`AI_TIMEOUT`) → `kept` → dữ liệu thay (`generation` 0 → 1) → đọc lại `kept` (S2) | `kept` trả lỗi; sau khi generation đổi → `undefined`; `start` lại cùng khóa xoá mục đã giữ | không thấy |
| K3 | Dán vào ô ChatGPT web một chuỗi **chỉ có ký tự vô hình** (U+200B ×2 + U+2060), hai lần (S3, rồi trên bản build web bằng Playwright) | `trim()` không rỗng → nút "Kiểm tra và lưu" **bật**; lần 1 tính một lần thử ("còn 1 lần thử"), lần 2 **ghi một dòng REJECTED** ("Lần phân tích 15/09 bị loại: … (V1)") — chuỗi chỉ có 3 code point, không nhìn thấy gì | **DSR5-C1** |
| K4 | 18 câu của CLR4-C1 (lượt 4) chạy lại qua Mock | 18 / 18 ra ∅; trước lượt 4 cả 18 đều ra đề xuất sai | không thấy (dòng R1 DR6-141) |
| K5 | 50 ví dụ trong spec §10 (bản `37a80b6`), gồm câu có dấu ":", dấu đầu dòng, dòng trống, "cả hai", "đều đã mất", "bé nhỏ", "vợ KH đã mất" | 0 lệch thật; 5 dòng in ra lệch chỉ vì thứ tự field hoặc vì kỳ vọng của tôi sai (spec không nói vậy) | không thấy |
| K6 | NUL ở bước 0 của so khớp: 6 dạng (giữa chữ, cạnh dấu cách, trước chữ hoa, trong "Luật K…") | Mọi dạng bị chặn đúng V3–V6; bản không NUL cho cùng kết quả | không thấy (dòng R1 DR6-142) |
| K7 | "giới" trước "luật": 4 từ ghép (môi / ranh / biên / thế), "giới luật" viết hoa, "định luật", "quy định Luật …" | 4 từ ghép → V6; "giới luật Phật giáo" (thường / hoa) → 0; "định luật" → 0; "quy định Luật …" → V6 | không thấy (dòng R1 DR6-143) |
| K8 | Ghi chú kiểu seed một dòng, ngăn bằng "; " (`probe-order.mjs` phần C) | "KH đã kết hôn; có 2 con; …" → Đã kết hôn + 2; "Hôn nhân: Ly hôn; …" → Ly hôn; "KH góa vợ năm 2020; có 3 con, một con đã mất." → Góa + 2; "KH độc thân, 34 tuổi; …" → Độc thân | không thấy |
| K9 | Câu có người khác / con đã mất ở vị trí khác nhau (`probe-order.mjs` phần A–B) | "KH có 2 con, con út đã mất." → ∅; thêm câu sau "KH đã kết hôn." → chỉ Đã kết hôn (không có Số con); "KH là bác sĩ, Lan là y tá, độc thân." (có / không có câu con mất phía sau) → ∅ | không thấy |
| K10 | Panel AI trên bản build web: `e2e/customer-ai.spec.ts` (18 ca, Edge) | **18 / 18 passed** (36,7 s), gồm trích xuất → Xác nhận → dữ kiện, Hủy / Thử lại giữ focus, ChatGPT web xoá lỗi | không thấy |

## 5. Phát hiện mới

### DSR5-C1 — Chuỗi chỉ có ký tự vô hình dán vào ô ChatGPT web bị tính là một lần thử, hai lần thì ghi một dòng REJECTED

```
ID: DSR5-C1
Mức: Low
Trục: E (C)
Vị trí: packages/ai/src/web.ts:145 (`if (pasted.trim() === '') return … 'EMPTY'`), apps/desktop/src/routes/customers/KycWebSession.tsx:175 (`disabled={pasted.trim() === ''}`) (37a80b6)
Tình trạng: CONFIRMED
Liên quan: họ DR6-150 / T-332 (ô chữ chỉ có ký tự vô hình đọc là rỗng), T-337; mới do đợt sửa sau lượt 4 (T-332 sửa `parseTime` nhưng không sửa ô dán) — có từ trước, lượt 1–4 bỏ sót
Kịch bản: K3
```

- **Mô tả:** Ô dán câu trả lời ChatGPT web hỏi "trống" bằng `trim()` của JS, mà `trim()` không bỏ U+200B / U+2060 / U+0085. Một chuỗi chỉ có các ký tự đó (dán từ tài liệu có định dạng, hoặc copy một vùng trông rỗng) làm nút "Kiểm tra và lưu" bật, rồi `checkWebAnswer` coi là một câu trả lời thật: V1 "không có khối JSON", tính một lần thử. Hai lần như vậy → ghi một dòng `ai_analyses` **REJECTED** (`raw_output` là chuỗi vô hình), phiên web kết thúc, panel ghi "Lần phân tích … bị loại: … (V1)". Trái luật của chính app ở chỗ khác: K25 / K33 coi chữ chỉ có ký tự vô hình là rỗng (`normalizeText`), và spec §3.1 item 3 nói "dán rỗng … không tính lần thử".
- **Tái hiện / bằng chứng:**
  - Node (`C\probe-scenarios.log`, S3): `trim()` của `"\u200B\u200B\u2060"` là chính nó (độ dài 3); `checkWebAnswer(session, chuỗi)` → `retry` với issue `V1`; lần hai → `record`, `row.status = 'REJECTED'`.
  - Bản build web, Playwright (Edge), probe tạm `e2e/zz-dsr5c-inv.spec.ts` (đã xoá; log `C\pw-invisible.log`): `box.fill('\u200B\u200B\u2060')` → `save.isEnabled()` **true**; bấm lần 1 → panel "Câu trả lời chưa đạt — còn 1 lần thử"; bấm lần 2 → panel khớp `/bị loại: .+ \(V1\)/`; **1 passed (14,2 s)**.
- **Ảnh hưởng:** RE dán một vùng trông rỗng (hiếm, nhưng không có gì báo là đã dán sai) mất cả hai lần thử và để lại một dòng REJECTED trong lịch sử phân tích, kèm câu "AI trả kết quả không đọc được" — dữ liệu sai nghĩa (một lần "phân tích" chưa từng có câu trả lời), không đảo ngược được (không xoá được dòng phân tích). Không mất dữ liệu KYC.
- **Đề xuất:** hỏi "trống" bằng đúng luật của app: `cleanText(pasted) === ''` (hoặc `normalizeText(pasted).trim() === ''`) ở `checkWebAnswer`, và cùng điều kiện cho `disabled` của nút trong `KycWebSession`; thêm một ca `web.test.ts` (chuỗi U+200B / U+2060 → `EMPTY`, không thêm attempt). Cỡ ≤ 10 dòng SP + 1 ca.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đo gì | Trên đâu | Kết quả | ID |
|---|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` (đã bật trong `tsconfig.base.json`; `pnpm typecheck` ở `baseline.md` xanh) | `packages/ai`, `apps/desktop` | 0 biến / tham số / import thừa | — |
| Quét export của `packages/ai/src` + 3 thư mục app AI: đếm tên ngoài file khai báo (`probe-bloat.mjs`, log `C\probe-bloat.log`) | 325 export | **34** tên chỉ có trong file của nó; tất cả là **type** (bị xoá khi build) trừ `AI_MODES` (`schema.ts:29`) và `AI_OPENCODE_PLANS` (`settings.ts:17`) — hai hằng chỉ dùng trong file mình, vẫn nằm trong API công khai của `@p2c/ai`. Không có hàm / hằng runtime chết | — |
| `mock-adapter.ts` sau T-329 | 72 dòng | Chỉ còn `createMockAdapter`, đọc input, `allowedFields`; không còn luật trích xuất nào | — |
| Bundle web (`baseline.md`) | `apps/desktop/dist` ở SHA ghim | `index.js` 892 184 B (+7 486 so lượt 4), `index.css` 30 295 B (+543); không tách được phần riêng của gói C (một chunk). `mock-extraction.ts` 950 dòng là phần lớn +553 SP của gói | — |

Không đề xuất refactor: phần chép đã gỡ ở T-329 / T-332 / T-336; `mock-extraction.ts` chia theo luật, mỗi khuôn một khối.

### 6.2 Hiệu năng

Máy: Home PC `DESKTOP-KDURKJP`, Node **v24.20.0**, máy rảnh (không chạy gì song song), 05/11/2026 10:52–10:54. Dữ liệu: `common\load\load-2026-10-12-seed6.p2cbackup` (nhập bằng `importBackup`, 936 ms). Script `C\probe-perf.mjs` (log `C\probe-perf.log`).

| Đo | Dữ liệu | Trung vị | Ngưỡng / so sánh | ID |
|---|---|---:|---|---|
| `mockExtractionOutput`, ghi chú 36 003 ký tự ("độc thân" ×4 000) | câu tự dựng | **6,0 ms** (min 7 lần) | bảng test "in linear time" cho phép < 10 × mốc (~80 ms); DR6-79 cũ 2 042 ms | — |
| `mockExtractionOutput`, 36 006 ký tự ("đã kết hôn" ×3 273) | câu tự dựng | **4,4 ms** | như trên | — |
| `mockExtractionOutput`, 36 412 ký tự ("1 con đã mất" ×2 800) | câu tự dựng | **4,4 ms** | như trên | — |
| `mockExtractionOutput`, 36 022 ký tự (dấu "." rồi "Đã kết hôn") | câu tự dựng | **4,9 ms** | như trên | — |
| `mockExtractionOutput`, ghi chú dài nhất của dữ liệu tải | 173 ký tự | **0,01 ms** | màn < 200 ms | — |
| `aiPanelView` (KH nhiều phân tích nhất: 2 phân tích, 14 dữ kiện, 13 phiên bản) | dữ liệu tải | **0,00 ms** (50 lần) | < 200 ms | — |
| `historyRows` cùng KH | dữ liệu tải | **0,00 ms** | < 200 ms | — |
| `analysisContent` (bản ACCEPTED mới nhất) | dữ liệu tải | **0,05 ms** | < 200 ms | — |
| `aiPanelHelp` | dữ liệu tải | **0,00 ms** | — | — |
| `validateOutput('analysis', …)` 7 khối, mỗi text ~2 000 ký tự | output tự dựng | **0,04 ms** (20 lần) | — | — |

Không có phát hiện P. Số đo mở app / màn / exe của gói C nằm ở `baseline.md` (mọi thao tác trong ngưỡng, `customer.open-ai` 20 ms, `customer.ai-history` 2 ms); tôi không đo lại exe.

## 7. Đếm mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

Chỉ 1 phát hiện mới, CONFIRMED (không có PLAUSIBLE). Không nâng mức cho đủ số: các dòng R1 / R2 đều ĐÃ SỬA, các biến thể còn hở đều theo hướng an toàn (không đề xuất) và đã nằm trong quyết định K42 / CX-A4.

## 8. Đã xét, không thấy

- **R:** 5 dòng R1 + 5 dòng R2 ở mục 2; mỗi dòng có đột biến riêng (M1–M11) và biến thể gần. Không dòng nào SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY.
- **E:** 18 câu CLR4-C1; 50 ví dụ §10; ~25 câu tự dựng (người khác, con nuôi, "cả hai", "đều", "bé nhỏ", "vợ KH", trạng thái cũ, danh sách chọn, tiếng Anh); NUL; dấu đầu dòng / dòng trống / "..." / "?" đứng riêng; CRLF; ghi chú 36 000 ký tự; ghi chú một dòng kiểu seed. Các dạng còn hở đều ra **∅** (hướng an toàn, CX-A4), trừ DSR5-C1 (ô dán).
- **C:** spec §10 khớp code ở 50 ví dụ (0 lệch thật); `PROMPT_VERSIONS` `analysis@5` / `discovery@5` khớp `prompts/*.ts` và `prompts.test.ts`; API `@p2c/ai` không đổi sau T-329 (`index.ts`); `web@1` + `analysis@5` → `webPromptVersion` đúng chữ G5 §6a.
- **D:** trích xuất không ghi gì (chỉ đề xuất, `filterExtraction` giữ / bỏ từng đề xuất); Xác nhận đi qua `recordKycNote` như mọi dữ kiện; `AiJobs.kept` gắn `generation`; không có lệnh ghi mới trong gói C.
- **G:** V3–V6 với NUL (6 dạng) và "giới" (8 dạng); V7 kiểm `quote` sau `collapseSpaces`; `RETRACTED` / `GUESSED` / `WANTED`… giữ nguyên; prompt injection từ ghi chú không đổi kết quả vì output vẫn qua V1–V7 và không tự lưu; Mock không sinh giá trị ngoài `KYC_VALUES`.
- **S:** key chỉ ở Rust (`ai-tauri.ts` không có lệnh đọc key); `openChatGpt` chỉ mở URL hằng số; dán bị chặn > `MAX_AI_RAW_OUTPUT` (2 × `MAX_READ` code unit) và nhận diện tin nhắn của app; không gọi mạng trong gói C.
- **P:** bảng 6.2; không phát hiện.
- **B:** bảng 6.1; không phát hiện.
- **T:** 11 đột biến, tất cả bị giết (M1 16, M2 9, M3 8, M4 127, M5 3, M6 2, M7 2, M9 2, M10 4, M11 9 test đỏ); 0 đột biến sống. Test thời gian của T-339 vẫn bắt mẫu bậc hai (M10). Không thấy test chép công thức của code trong phần mới.
- **A:** khóa i18n `kyc.factLine` dùng chung (`CustomerKyc.tsx`), `customer.withCode` dùng chung (`trash-view`, `team-view`); `extraction.proposed` tách `{field}`; `pnpm lint:tokens` xanh ở `baseline.md`; không thêm chuỗi cứng trong file AI của app.

## 9. Phụ lục

- **Nguồn probe / test tạm** (đều trong `C:\workspace\deep-review-1-6-r5\deepseek\C\`):
  - `probe-r1.mjs` + `probe-r1.log` — 18 câu CLR4-C1, ca chấp nhận T-330, 13 câu tự dựng, NUL (6), "giới" (8), `isLabel` (6).
  - `probe-spec.mjs` + `probe-spec.log` — 50 ví dụ §10. 5 dòng in "LỆCH": 2 dòng chỉ khác **thứ tự** field (`childrenCount` trước `maritalStatus`); 3 dòng kỳ vọng của tôi sai so với chữ spec ("Độc thân và có 2 con: …" → spec nói cụm thành tiêu đề nên **không** đề xuất; "…có 2 con nhỏ: một trai, một gái." → spec nói cả vế là tiêu đề; "KH đã kết hôn, Lan độc thân." → spec ghi rõ "không đề xuất Hôn nhân"). Code khớp spec ở cả ba.
  - `probe-order.mjs` + `probe-order.log` — thứ tự đọc clause (nghi vấn `readerOf` đọc lùi: **không tái hiện**, mỗi consumer một reader riêng), câu kiểu seed.
  - `probe-scenarios.mjs` + `probe-scenarios.log` — S1 trích xuất → xác nhận → trích xuất lại; S2 `kept` theo generation; S3 dán vô hình.
  - `probe-perf.mjs` + `probe-perf.log` — bảng 6.2.
  - `probe-bloat.mjs` + `probe-bloat.log` — quét 325 export.
  - `probe-t329c.mjs` + `probe-t329c.log` — Mock `b6d4388^` ↔ `b6d4388` trên 556 chuỗi.
  - `mock-extraction-debug.ts` — bản chép của `mock-extraction.ts` (thêm một dòng log), chỉ để xem `says` / `deaths`; không sửa file repo.
  - Playwright: `C\pw-customer-ai.log` (18 ca `customer-ai`, Edge, bản build web), `C\pw-invisible.log` (probe tạm `e2e/zz-dsr5c-inv.spec.ts`, đã xoá; `git status` sạch sau đó).
- **Đột biến (bảng R + R2), tất cả trên repo rồi trả bằng `git checkout --`, kiểm sha256 sau mỗi lần:**

| Mã | File | Đột biến | Test đỏ | Trả lại (sha256) |
|---|---|---|---:|---|
| M1 | `packages/ai/src/text-match.ts` | bỏ `text.replaceAll('\0','')` | 16 | `755a2006…196ff` ✅ |
| M2 | `packages/ai/src/blocklists.ts` | `unlessAfter('giới', GIOI_OF)` → `ci('giới')` | 9 | `45bfae4c…2f786` ✅ |
| M3 | `packages/db/src/common.ts` | `readsBackAsIs` bỏ kiểm U+FEFF | 8 | `39e8e489…6be9c` ✅ |
| M4 | `packages/ai/src/mock-extraction.ts` | `simpleStatement` → luôn true (như trước #917) | 127 | `c805fab0…e8f41` ✅ |
| M5 | `apps/desktop/src/data/ai-jobs.ts` | `kept()` bỏ so `generation` | 3 | `cd65042a…4aa5` ✅ |
| M6 | `packages/ai/src/mock-extraction.ts` | `namingTheKh` bỏ nhánh `saysKh` | 2 | `c805fab0…e8f41` ✅ |
| M7 | `packages/ai/src/mock-extraction.ts` | `carried` bỏ phép thử `\p{L}` | 2 | `c805fab0…e8f41` ✅ |
| M9 | `apps/desktop/src/data/listeners.ts` | `notify` bỏ `try` / `report` | 2 | `e66b2f7f…cef80` ✅ |
| M10 | `packages/ai/src/mock-extraction.ts` | thêm quét `note[0..at)` cho mỗi cụm | 4 hàng thời gian | `c805fab0…e8f41` ✅ |
| M11 | `packages/ai/src/mock-extraction.ts` | luật 3: `lessBy` → `undefined` | 9 | `c805fab0…e8f41` ✅ |

- **`git status --short` cuối phiên:** rỗng (kiểm sau từng đột biến và sau khi xoá probe Playwright); HEAD vẫn `37a80b6`.
- **Giờ xong:** 10:56 05/11/2026.
