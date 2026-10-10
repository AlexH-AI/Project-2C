# Deep review Phase 5 — Gói A — DeepSeek

- **SHA:** `0df3606fb783cc89b1b9c413c02810340e273a4f` (`git rev-parse HEAD`, khớp kế hoạch `0df3606`)
- **Phạm vi gói A:** `packages/ai/src/**`; phần Phase 5 của `packages/domain` (mức bằng chứng, `normalizeKycValue`)
- **Báo cáo này:** chỉ đọc, không sửa repo. Test tạm ở `C:\workspace\deep-review-5\deepseek\A\`.

`git status --short` đầu phiên:

```
?? opencode.json
```

## Phạm vi đã đọc

**`packages/ai/src` — mã nguồn (19 file, ≈ 1 575 dòng):**

| File | Dòng đã đọc |
|---|---|
| `adapter.ts` | 1–37 |
| `blocklists.ts` | 1–92 |
| `errors.ts` | 1–46 |
| `extract-json.ts` | 1–36 |
| `index.ts` | 1–11 |
| `input.ts` | 1–132 |
| `mock-adapter.ts` | 1–170 |
| `models.ts` | 1–35 |
| `prompts/analysis.ts` | 1–48 |
| `prompts/connection.ts` | 1–13 |
| `prompts/discovery.ts` | 1–43 |
| `prompts/extraction.ts` | 1–27 |
| `prompts/retry.ts` | 1–51 |
| `raw.d.ts` | 1–5 |
| `run.ts` | 1–394 |
| `schema.ts` | 1–159 |
| `settings.ts` | 1–86 |
| `test-support.ts` | 1–69 |
| `web.ts` | 1–121 |

**`packages/ai/src` — test (13 file, ≈ 2 300 dòng):** `errors.test.ts`, `extract-json.test.ts`, `input.test.ts`, `mock-adapter.test.ts`, `models.test.ts`, `run.test.ts`, `schema.test.ts`, `settings.test.ts`, `validator.test.ts`, `validator-blocklists.test.ts`, `validator-extraction.test.ts`, `web.test.ts`, `prompts/prompts.test.ts` — đọc toàn bộ.

**`packages/domain` — phần gói A:** `src/evidence-level.ts` (1–52), `src/evidence-level.test.ts` (1–121), `src/kyc-fact.ts` (1–57), `src/kyc-fact.test.ts` (1–39), `src/kyc-gate.ts` (1–85), `src/kyc-catalog.ts` (1–155), `src/index.ts` (kiểm export). Đối chiếu nền Phase 1–4 chỗ gói A nối vào: `kyc-gate.ts` (`warningFields`, `missingCategories`), `kyc-catalog.ts` (`fromProfile`, `core`).

**Tài liệu chuẩn:** `docs/design/phase-5-ai.md` (1–430), `docs/design/phase-5-prompts.md` (1–345, từng bảng §8), `docs/golden/ai-eval.md` (1–119), `docs/decisions/0009-ai-copilot-provider-va-guardrail.md` (1–82, gồm D-1 / G5 / W-1), `CONTEXT.md`, `packages/ai/CLAUDE.md`, `packages/domain/CLAUDE.md`, `vitest.config.ts`, `.dependency-cruiser.cjs` (phần `ai*`), `packages/ai/package.json`, `packages/ai/tsconfig.json`, `apps/desktop/src/i18n/vi.ts:86–125`, `packages/db/src/seed-data.ts:260–345`.

**Lệnh đã chạy (đọc / chạy, không sửa):**

| Lệnh | Kết quả |
|---|---|
| `git rev-parse HEAD` | `0df3606fb783cc89b1b9c413c02810340e273a4f` |
| `pnpm exec vitest run packages/ai packages/domain` | **33 file, 1005 test pass** (nền xanh tại SHA) |
| `pnpm exec tsc -p packages/ai/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` (+ domain) | không lỗi (0 unused) |
| `pnpm lint:deps` | `no dependency violations found (297 modules, 1156 dependencies)` |
| `pnpm codemap:check` | `Export maps are up to date.` |
| `node probes/lists.mjs` | `G5 phrase rows: 171 · code phrase rows: 171 … problems: 0` |
| `node probes/labels.mjs` | `fields: 21, categories: 8, problems: 0` |
| Probe vitest gói A (`probes/guardrail.test.ts`, `probes/perf.test.ts`, `probes/odds.test.ts`) | kết quả ở từng phát hiện dưới đây |
| Mutation 3 ca trên bản chép (`probes/mutate.mjs`, `mut/*`) | cả 3 ca **suite RED (bị bắt)** |

## Phát hiện

### DS-A1 — Ký tự vô hình (zero-width, soft hyphen), ký tự tương hình và ký tự fullwidth lọt qua V3–V6

```
ID: DS-A1
Mức: Medium
Trục: G
Vị trí: packages/ai/src/text-match.ts:22–24 (matchText; fold ở 17–19) (0df3606)
Tình trạng: CONFIRMED (đã tái hiện bằng probe)
```

**Mô tả:** Bộ so khớp V3–V6 chuẩn hóa NFC → chữ thường → gộp khoảng trắng (`\s+`), nên cụm bị chặn viết kèm ký tự định dạng vô hình (ZWSP U+200B, ZWNJ U+200C, word joiner U+2060, soft hyphen U+00AD), ký tự fullwidth (％ U+FF05) hoặc ký tự tương hình (х Cyrillic trong “xác suất”) **không bị bắt** — `\s` của JavaScript không gồm các ký tự này. Chuỗi có ký tự vô hình nằm giữa cụm từ cũng phá ranh giới từ. Đây là lớp phòng cuối của guardrail (`ai-eval.md` §2.2 R1 yêu cầu 0 vi phạm V3–V6 lọt qua, tính cả các cách viết né), lỗi im lặng vì ký tự không nhìn thấy, và dữ liệu vẫn được lưu `ACCEPTED` + hiện cho RE.

**Tái hiện / bằng chứng** — `vitest run --config vitest.probe.config.ts probes/guardrail.test.ts --silent=false` (nguồn ở phụ lục):

```
=== BYPASS CANDIDATES (expect V3/V6, got []) ===
ZWSP inside "xác suất" :: []
ZWSP+space inside "xác suất" :: []
soft hyphen inside :: []
word joiner inside :: []
ZWNJ inside :: []
ZWSP inside "khả năng chốt" :: []
fullwidth percent :: []
Cyrillic х in "xác" :: []
=== CONTROL (plain forms must be blocked / normal words must pass) ===
plain :: ["V3"] · upper case :: ["V3"] · newline :: ["V3"] · tab :: ["V3"] · NBSP :: ["V3"] · NFD :: ["V3"] · percent :: ["V3"]
```

(NFC/NFD, hoa/thường, xuống dòng, tab, NBSP, `%` đều bắt đúng — lỗ hổng chỉ ở nhóm ký tự “vô hình / tương hình / fullwidth”.)

**Ảnh hưởng:** model trả “KH có 70%…” viết thành “xác〈ZWSP〉suất” hoặc “khả〈ZWSP〉năng chốt” (một số tokenizer hay chèn ZWSP khi mã hóa chữ ngoài ASCII) → validator không thấy lỗi → lưu `ai_analyses` trạng thái `ACCEPTED`, panel hiện cho RE nội dung đáng lẽ bị chặn. Cùng lớp rủi ro khi trích xuất văn bản từ web dán (ChatGPT) mang theo ký tự vô hình.

**Đề xuất:** trong `matchText`/`fold` (hoặc một bước chuẩn hóa chung trước NFC) loại ký tự định dạng `\p{Cf}` (ít nhất U+200B–U+200D, U+2060, U+00AD, U+FEFF) và có thể thêm NKFC để đồng nhất fullwidth trước khi so; thêm ca test cho từng ký tự. Cỡ ≤ 40 dòng + test. Lưu ý: cách so khớp là phần “Cách so khớp chung” của G5 §7 — nếu Owner coi là đổi luật so khớp thì xử lý qua G5 (tăng `prompt_version` không cần vì chữ danh sách không đổi), còn nếu coi là gia cố kỹ thuật đúng tinh thần G5/R1 thì sửa thẳng trong code.

### DS-A2 — Cụm “quyết định số” chặn nhầm câu thường “quyết định số lượng”

```
ID: DS-A2
Mức: Low
Trục: G
Vị trí: packages/ai/src/blocklists.ts:86 (danh sách V6) — chép đúng docs/design/phase-5-prompts.md:290 (0df3606)
Tình trạng: CONFIRMED (đã tái hiện bằng probe)
```

**Mô tả:** V6 có mục cụm “quyết định số” (để bắt số hiệu văn bản như “Quyết định số 46/…”) nhưng cụm so theo ranh giới từ nên câu nghiệp vụ bình thường “Cùng KH quyết định số lượng buổi gặp tiếp theo” bị chặn V6 và tính là một lần sai → đốt 1 trong 2 lần thử. Đây là mục mới cùng lớp với các ca chặn nhầm đã ghi `KNOWN` ở `known.md` (#420: “để chốt”, “khoản 2 điều kiện”…), chưa có trong danh sách KNOWN.

**Tái hiện / bằng chứng** — cùng probe trên:

```
"quyết định số lượng" :: ["V6"]
"công văn số liệu" :: ["V6"]
"khả năng tài chính" :: []   ← nhóm bình thường khác không bị chặn
```

**Ảnh hưởng:** RE nhận báo lỗi/tăng REJECTED oan khi model viết câu chứa “quyết định số lượng” (hay gặp ở `nextBestActions`/`discoveryStrategy`).

**Đề xuất:** sửa ở G5 (không sửa code lệch danh sách): đổi mục “quyết định số” thành mẫu cần chữ số theo sau (`quyết định\s+số\s+\d`) hoặc bỏ mục này và trông vào regex số hiệu; tương tự cân nhắc “công văn số”. Cỡ ≤ 20 dòng tại G5 + version (thuộc G5, không phải SP code).

### DS-A3 — `extractJson` quét bậc hai: chuỗi nhiều `{` không đóng làm treo luồng xử lý

```
ID: DS-A3
Mức: Low
Trục: P
Vị trí: packages/ai/src/extract-json.ts:10–12 (vòng lặp ứng viên), closingBrace 23–36 (0df3606)
Tình trạng: CONFIRMED (đã đo)
```

**Mô tả:** mỗi ứng viên `{` không parse được thì `closingBrace` quét tới hết chuỗi, rồi thử tiếp ứng viên kế tiếp → tổng chi phí O(n²) với nội dung nhiều `{` chưa đóng. Nội dung trả lời do Rust đọc tối đa **2 MB** (spec §5.2) và không có trần riêng cho bước lấy JSON; vòng lặp chạy trên luồng webview, không hủy được.

**Tái hiện / bằng chứng** — `vitest run … probes/perf.test.ts -t 'unmatched braces'`:

```
extractJson n=5000 braces: 28.9 ms
extractJson n=10000 braces: 113.8 ms     (~x3.9)
extractJson n=20000 braces: 454.7 ms     (~x4.0)
extractJson n=40000 braces: 1817.3 ms    (~x4.0)
extractJson n=100000 braces: 11367.7 ms  (~x6.3; đo bậc hai)
```

Extrapolate theo bậc hai cho mức trần 2 MB: cỡ 4 000 × thời gian của 100 000 ký tự → hàng chục phút treo. Với nội dung bẩn “thật” nhỏ (18 KB dạng JSON đứt đoạn) đo được **35 ms** — không đáng lo; rủi ro chỉ ở nội dung rất lớn/nhiều `{` (trả lời méo của model hoặc máy chủ lỗi), là đầu vào **không tin cậy** nên trần 2 MB không đủ bảo vệ.

**Ảnh hưởng:** app treo (main thread) khi nhận trả lời méo cỡ lớn; RE không hủy được (extractJson đồng bộ); xảy ra trước cả bước lưu và không có mã lỗi nào.

**Đề xuất:** quét một lượt O(n) bằng ngăn xếp vị trí `{` mở (khi gặp `}` khớp ngăn xếp thì thử parse khối vừa đóng, sai thì nới tiếp — không quét lại từ đầu); hoặc chặn số ứng viên quét (vd. 200) và coi phần còn lại là không có JSON. Kèm ca test chuỗi `'{'.repeat(n)` lớn và đo lại. Cỡ ≤ 40 dòng + test.

### DS-A4 — Đếm/ cắt theo code point bằng `Array.from` trên chuỗi rất dài của người dùng (dán) và của model

```
ID: DS-A4
Mức: Low
Trục: P
Vị trí: packages/ai/src/web.ts:101 (khung dán), packages/ai/src/run.ts:342 (raw_output) (0df3606)
Tình trạng: CONFIRMED (đã đo)
```

**Mô tả:** `checkWebAnswer` chống quá 20 000 ký tự bằng `Array.from(pasted).length`; `rawOutput` cắt 20 000 bằng `Array.from(content).slice(…)`. Hai chỗ đều vật chất hóa toàn bộ chuỗi thành mảng ký tự trước khi biết kết quả, dù `pasted.length ≤ 20 000` đã đủ kết luận “nhận” (code unit ≥ code point) và `length > 40 000` đủ kết luận “quá dài”.

**Tái hiện / bằng chứng** — `vitest run … probes/perf.test.ts -t 'huge paste'`:

```
paste 1000000 chars: 5.7 ms → {"kind":"unusable","reason":"TOO_LONG"} heapΔ≈8 MB
paste 5000000 chars: 28.2 ms → {"kind":"unusable","reason":"TOO_LONG"} heapΔ≈37 MB
paste 20000000 chars: 113.2 ms → {"kind":"unusable","reason":"TOO_LONG"} heapΔ≈140 MB
```

**Ảnh hưởng:** RE dán nhầm văn bản rất lớn (tài liệu dài) → mỗi lần bấm “Kiểm tra và lưu” tạo khối rác ~100 MB và khựng UI (máy chậm còn lâu hơn); chuỗi 2 MB từ Rust ở `rawOutput` cũng cùng dạng nhưng nhẹ hơn. Kết quả trả về thì vẫn đúng (`TOO_LONG`) — đây là vấn đề chi phí, không sai logic.

**Đề xuất:** nhanh-kết-thúc bằng `pasted.length <= MAX_RAW_OUTPUT` (nhận luôn) và `pasted.length > 2 * MAX_RAW_OUTPUT` (từ chối luôn, code point ≤ nửa độ dài), chỉ đếm chính xác khi ở giữa hai mốc bằng vòng `for (const ch of pasted)` dừng sớm khi vượt; `rawOutput` thay `Array.from(...).slice` bằng một vòng cắt tối đa 20 000 code point. Cỡ ≤ 30 dòng + test biên (đã có ca 20 000 emoji).

### DS-A5 — Bảng nhãn tiếng Việt của AI bị chép hai bản máy (ai + db) bên cạnh bản i18n gốc

```
ID: DS-A5
Mức: Low
Trục: B
Vị trí: packages/ai/src/input.ts:20–54 (KYC_CATEGORY_LABELS + KYC_FIELD_LABELS) và packages/db/src/seed-data.ts:308–345 (0df3606)
Tình trạng: CONFIRMED (đã so bằng script)
```

**Mô tả:** cùng 21 nhãn trường + 8 nhãn hạng mục tồn tại **ba nơi**: bản gốc hiển thị `apps/desktop/src/i18n/vi.ts:92–120`, bản của `ai` (nhãn gửi model), bản của `db` (nhãn dựng `input_json` seed, dùng ở `seed.ts:482,492,507`). Hai bản máy hiện giống nhau tuyệt đối và giống bản i18n, nhưng không có gì chặn lệch (ai không được import apps; db chỉ được import `@p2c/ai/schema`). Đổi nhãn i18n ở một nơi → model nhận nhãn cũ / seed lệch màn hình mà không test nào đỏ.

**Tái hiện / bằng chứng** — `node probes/labels.mjs`:

```
fields: 21, categories: 8, problems: 0
```

và so `ai` với `db` (nguồn ở phụ lục): `KYC_FIELD_LABELS identical: true · KYC_CATEGORY_LABELS identical: true`.

**Ảnh hưởng:** lệch nhãn giữa ba nguồn khi sửa i18n; lỗi âm thầm (nhãn chỉ là chữ gửi model/seed, không chặn chức năng) nhưng khó phát hiện về sau.

**Đề xuất:** gom hai bản máy vào một chỗ dùng chung mà cả `ai` và `db` được import — `@p2c/ai/schema` là chỗ sẵn có (`db` đã import, module vẫn chỉ phụ thuộc `zod` + `domain`; thêm hằng chuỗi không phạm ranh giới) — và thêm một test ở `apps/desktop` (nơi import được cả hai) so nhãn dùng chung với `vi.ts`. Cỡ ≤ 80 dòng (2 package + test).

## Bảng đếm mức × trục

| Mức | E | G | C | D | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Low | 0 | 1 | 0 | 0 | 0 | 2 | 1 | 0 | 0 | 4 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng** | 0 | 2 | 0 | 0 | 0 | 2 | 1 | 0 | 0 | **5** |

## Đã xét, không thấy

- **E — Edge case.** Rỗng / 1 / mảng dài: `schema.test.ts` phủ ranh giới từng khối (1–5, 1–6, 0–3, 0–4, ≤ 20) + probe `{}` trả 6 lỗi V1 theo từng khối thiếu (output ở phụ lục). Unicode: NFD/NFC, hoa/thường, tab/xuống dòng, NBSP đều bắt đúng (probe nhóm CONTROL, DS-A1); zero-width/homoglyph/fullwidth → DS-A1. Ngày: `evidence-level.test.ts` phủ B01–B11 gồm mốc đúng ngày (B09), trước một ngày (B10), 29/02 → 28/02 (B11); `analysisInputSchema` từ chối `2026-02-30`, `07/10/2026` (test). Hai thao tác chồng nhau / Hủy / lỗi giữa chừng / `AI_BUSY` kể cả sau Hủy: `run.test.ts` "the shared runner" (10 ca) + đọc `run.ts:94–121` — không thấy lỗi. Tải lại webview / thay DB khi AI đang chạy: ngoài `packages/ai` (vòng đời job và DB ở `apps/desktop`, gói D); package chỉ bảo đảm `busy` giữ tới khi adapter trả và bỏ kết quả sau Hủy — đúng spec §5.2.
- **G — Guardrail.** So từng mục: script `lists.mjs` đối chiếu 171/171 cụm với cột “Bỏ dấu” của G5 §8.1–§8.4 — **0 lệch, 0 thiếu, 0 thừa**; 9 dòng regex hand-check khớp §8.2b/§8.3/§8.4 (gồm điều kiện “pháp luật” Q6 và “khoản <số>” Q4). Ca C1–C19 của G5 §8.5 + V2/V5/V7: `validator-blocklists.test.ts`, `validator.test.ts`, `validator-extraction.test.ts` pass tại SHA. Thử lại 2 lần → REJECTED, mức bằng chứng, AI không ghi thẳng dữ liệu: test `run.test.ts`, `evidence-level.test.ts`, và `ai` không có đường nào tới `db` (depcruise `ai-only-on-domain-and-zod` xanh) — không thấy lỗi, ngoài DS-A1/A2. Các ca chặn nhầm đã ghi `known.md` #420 đã chạy lại (đều tái hiện: “để chốt” → V3, “khoản 2 điều kiện” → V6, “điểm sơ bộ” → V3, “báo mình” → V4, “khả năng kỹ thuật” → V3) — không có bằng chứng mới nên không báo lại.
- **C — Đúng hợp đồng.** Chữ prompt `analysis@1`/`discovery@1`/`extraction@1`, message thử lại §5, Kiểm tra kết nối §6 và bọc `web@1` so trực tiếp với tài liệu G5 bằng `?raw` (`prompts.test.ts`, `web.test.ts`) — pass tại SHA. `AnalysisRow` đối chiếu §7.1 từng cột (mode/gateState/provider/model/reasoning/attempts/input/output/rawOutput/validator/token): `run.ts:293–337`, `web.ts:98–121` — khớp, kể cả cặp Mock/ChatGPT web ⇔ model-reasoning-token `null` và `prompt_version` `+web@<n>`. Nhãn trường/hạng mục `ai` khớp `vi.ts` (script `labels.mjs`, 0 lệch) — phần trùng lặp ghi ở DS-A5. Đầu vào tối thiểu §6.1: test “sends no name, code, RE, birth year, note…” đủ. Không thấy mâu thuẫn spec ↔ code khác.
- **D — Dữ liệu.** `ai` không ghi DB (ranh giới); `row` trả cho `recordAiAnalysis` đúng hình dạng §7.1; `input_json` do `buildAnalysisInput` sinh qua `analysisInputSchema` (test); `raw_output` ≤ 20 000 code point, REJECTED rỗng lưu `EMPTY_RAW_OUTPUT` non-empty, ACCEPTED `null`; `validator_json` là mảng `{attempt, errors}`. Luật nhập backup / migration / seed thuộc gói B. Không thấy lỗi trong phần A.
- **S — An toàn.** `packages/ai` không có `fetch`/`invoke`/DOM (grep chỉ ra comment) — không tự gọi mạng, `sessionId` ngẫu nhiên 128-bit không chứa dữ liệu KH và không vào `row`. Settings chỉ đọc đúng 4 khóa, không bao giờ trả key (test “keeps only the four settings” + đọc `settings.ts`). Nội dung gửi model: chỉ dữ kiện + cổng (test PRIVATE) trừ ghi chú ở trích xuất (đúng spec, có dòng cảnh báo ở Settings theo §9.3 — UI gói D). Prompt injection: `JSON.stringify` giữ ghi chú / giá trị là chuỗi JSON (không phá cấu trúc message — đọc `input.ts`/`run.ts`); câu trả lời dán đi thẳng qua `extractJson` + validator, không render; `retryMessage` và `buildWebMessage` xử lý ký tự `$` an toàn (probe: các mẫu $&, $`, $$ giữ nguyên). CSP / capabilities / URL ngoài thuộc gói C. Không thấy lỗi khác ngoài DS-A1.
- **P — Hiệu năng.** Chỉ hai chỗ có số đo đáng kể → DS-A3, DS-A4. Còn lại: `validateOutput` chạy 171 mẫu cụm + 9 regex cho mỗi `text` với regex dựng sẵn một lần (`blocklists.ts` + `text-match.ts`) — 1005 test của 2 package chạy 1,1 s trong đó transform chiếm 55%, không thấy điểm nóng; `evidenceLevel` O(n) (đọc + test). Không thấy vấn đề khác cần số đo.
- **B — Bloat.** `tsc --noUnusedLocals --noUnusedParameters` sạch cho cả hai package; `pnpm lint:deps` 0 vi phạm; `pnpm codemap:check` khớp. `text-match.ts`/`blocklists.ts` không bị re-export ra public API (`index.ts` 11 dòng — đọc). Các trùng lặp đã có trong `known.md` (#448 `newSessionId` ↔ `newPage`; #455 `MAX_RAW_OUTPUT` ↔ `MAX_AI_RAW_OUTPUT`; #455 `comparable` ↔ `collapseSpaces`; phạm vi export `run.ts`) đã đối chiếu, không có bằng chứng mới. Chỉ thêm DS-A5.
- **T — Chất lượng test.** Mutation 3 ca độc lập trên bản chép trong thư mục tạm (nguồn ở phụ lục): bỏ V5 mọi khối → **RED** (9 test đỏ: C8/C9, ca bỏ dấu, ca từ đơn, ca MBTI/nhóm máu); bỏ hạ mức bằng chứng → **RED** (B04/B08/B10/B11); đổi ranh giới 20 000 thành `>=` → **RED** (ca biên emoji). Test không phụ thuộc đồng hồ (`TODAY` cố định, ngày truyền tay), adapter kịch bản thay vì mock framework (không mock quá tay), `web.test`/`prompts.test` so trực tiếp tài liệu G5. Không thấy test yếu cần báo, ngoài việc thiếu ca test cho lỗ hổng DS-A1 (đề xuất kèm sửa).
- **A — Trợ năng / i18n.** `packages/ai` không có UI (không JSX, không DOM — grep); `detail` của validator bằng tiếng Việt là theo thiết kế G5 §5 (đi tới model, không tới màn hình — mã lỗi dịch ở UI gói D); nhãn i18n trùng ba nơi → DS-A5; phần `aria-live`/tab/`dangerouslySetInnerHTML` thuộc gói D. Không thấy vấn đề trợ năng trong phạm vi A.

**Đối chiếu `known.md` (không báo lại):** #420 (chặn nhầm “để chốt”/“khoản–điều”/“điểm sơ”/“báo mình”/“khả năng kỹ” + `text-match.ts` detail giữ chữ mục + `validator.ts:190` trùng issue) — tái hiện được, không có hậu quả mới; các mục ChatGPT web (#455), `run.ts` (#448), `ai-schema` (#465), lần chạy giữ ở app (#468) đã đọc, không thêm bằng chứng.

## Phụ lục — nguồn test tạm

Tất cả nằm trong `C:\workspace\deep-review-5\deepseek\A\` (không sửa gì trong repo; `A\node_modules` là junction tới `node_modules` của repo để vitest chạy được):

- `vitest.probe.config.ts` — config vitest trỏ vào `probes/**/*.test.ts`.
- `probes/guardrail.test.ts` — biến thể ký tự / câu chặn nhầm (DS-A1, DS-A2, đối chiếu #420). Chạy:
  `C:\workspace\Project-2C-review\node_modules\.bin\vitest.cmd run --config vitest.probe.config.ts --silent=false --reporter=verbose`
- `probes/perf.test.ts` — đo `extractJson` (bậc hai) và khung dán 20 000 (DS-A3, DS-A4).
- `probes/odds.test.ts` — `$` trong message, khóa thừa đầu ra bị zod loại, V7 khoảng trắng/NFD, `{}` là lỗi V1.
- `probes/lists.mjs` — so 171 cụm + cột bỏ dấu giữa G5 §8.1–§8.4 và `blocklists.ts`.
- `probes/labels.mjs` — so 21 nhãn trường + 8 nhãn hạng mục giữa `ai/input.ts` và `i18n/vi.ts`.
- `probes/setup-mut.mjs` + `mut.config.ts` + `probes/mutate.mjs` — bản chép `mut/ai`, `mut/domain` và 3 mutation; kết quả: cả 3 ca bị suite bắt (`>>> … suite RED (caught)`).
- `lists.mjs`/`labels.mjs` chạy bằng `node`; các probe chạy bằng vitest 5.0.1 của repo. Nguồn đo nền: `node --version` → `v24.20.0`.

## Trạng thái cuối phiên

`git status --short` cuối phiên (trong repo `C:\workspace\Project-2C-review`):

```
?? opencode.json
```
