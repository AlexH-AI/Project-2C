XONG — deepseek gói C lượt 4, 2026-10-30 20:37 (+07:00)

# Gói C — AI (`packages/ai/**`, file AI của app) — deep review Phase 1–6, lượt 4

## 1. Bên, gói, SHA, trạng thái, giờ, công cụ

- **Bên:** deepseek (reviewer độc lập DeepSeek, lượt 4). **Gói:** C — AI: `packages/ai/**`; file AI của app (`ai-*`, `*-ai-*`, `*Ai.tsx`, `KycExtraction`, `KycIntelligence`, `KycWebSession`, `KycHistory`, `extraction-view`).
- **Repo:** `C:\workspace\Project-2C-review` (worktree review), detached.
- **SHA đầu phiên:** `2e51e25eb0125f56d3d938b97ef18d6873dae076` (`git rev-parse HEAD` lúc 19:49 +07:00; khớp `common\baseline.md`).
- **`git status --short` đầu phiên:** rỗng.
- **Giờ:** bắt đầu 19:49, xong 20:37 (+07:00), 30/10/2026.
- **App / model / context / mức suy luận:** WorkBuddy **v5.9.3** (bản ghi ở `common\baseline.md`, bước 4 đợt 2); model **DeepSeek V4.1 Flash** (`Deepseek-V4.1-Flash`); context **1M**; Thinking effort **Max**; chạy qua Expert **Code review expert** (`ex_uZzSAScSy7FZ`, model Deepseek-V4.1-Flash), đường expert đã kiểm ACL 30/10 18:40 (24/24 lần đọc mục bị chặn đều `EPERM`).
- **Công cụ:** Read/Grep/Glob trong repo; Git Bash; `node` **v24.20.0** (`C:\Program Files\nodejs\node.exe` — bản `node` trong PATH của shell là v22.22.2, xem ghi chú ở §6 và §9); `node node_modules/vitest/vitest.mjs`; script tạm `.mjs` trong `…-r4\deepseek\C\`. Không gọi dịch vụ AI của sản phẩm, không mạng ngoài, không cài gì.

## 2. Bảng R1 và R2

### R1 — theo mã (gói C kiểm 11 dòng)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-108 | #721 → PR #738 (phần `ai`) | ĐÃ SỬA | `packages/ai/src/analysis-steps.ts:114-118` cắt `raw_output` theo code point; `packages/db/src/ai-analyses.ts:201-204` (`storedRawOutput`) thay `[\0\p{Cs}]` bằng U+FFFD, bỏ U+FEFF đầu. Đọc cả hai phía | Đột biến M12 không liên quan; test của `db` thuộc gói A |
| DR6-111 | #721 → PR #738 | ĐÃ SỬA | Probe 1: `xác\u0007suất` → V3 (`xácsuất`), `xác\u0085suất` → V3, `phần\u001btrăm` → V3 (`phầntrăm`, dấu cách trong cụm khớp 0/1) | **Còn hở:** NUL — `phần\u0000trăm` → không V3; phát hiện **DSR4-C1** |
| DR6-118 | #724 → PR #746 | ĐÃ SỬA (đọc code) | `KycIntelligence.tsx:163` `wrap-anywhere` trên `Item`; `KycHistory.tsx:86` `wrap-anywhere` trên ô Prompt; `min-w-0` ở `KycExtraction.tsx:163`, `KycDialogs.tsx:331` | **Không dựng bản web** (xem §9, mục "chưa làm"); kết luận này chỉ dựa trên lớp CSS + e2e lượt 3, không phải số đo mới |
| DR6-121 | #727 → PR #753, #809, #812 | ĐÃ SỬA | Probe 2 (30 câu): câu hỏi / phỏng đoán / người khác → không đề xuất; "KH đã kết hôn và có 2 con" → cả hai; "KH độc thân, sống một mình" → Độc thân. Đột biến M10 (bỏ neo đầu vế của `KH_SUBJECT`) → **6 ca đỏ** | Đề xuất mất đi đúng bảng của PR #809 ("KH 35 tuổi, có vợ và 2 con." → không); "KH có 2 con sắp sinh." → Số con 2, đúng mục "Quan sát ngoài phạm vi" của PR #809 |
| DR6-122 | #728 → PR #766 | ĐÃ SỬA | Probe 1: 5 dạng dấu lạc (U+0301 trên "c", sau dấu cách, `´`, `¨`, giữa chữ) đều ra V3. Đột biến M1 (`VOWEL.test(...) ? marks : ' '` → `marks`) → **16 ca đỏ** | `đ\u0301` → "đ" (dấu trên phụ âm đọc là dấu cách, đúng §12.2) |
| DR6-123 | #728 → PR #766 | ĐÃ SỬA | Probe 2: dán lại tin nhắn `web@1` với LF, CRLF, CR, U+0085, U+2028, U+2029, VT, FF → **`OWN_MESSAGE` cả 8**; dán chỉ phần ĐẦU VÀO (nguyên, đổi U+2028, bọc `>`) → `OWN_MESSAGE` cả 3. Đột biến M2 (`split(LINE_BREAK)` → `/\r\n|\r|\n/`) → **13 ca đỏ** | Bỏ hết dấu xuống dòng (một dòng) → `retry`: đúng, không còn dòng mốc nào |
| DR6-124 | #728 → PR #766 | ĐÃ SỬA | Probe 1: "khách am hiểu", "khách lanh lợi", "noi theo", "làm IT" → không chặn; "khach am" → V3; "định luật Pareto", "giới luật Phật giáo" → không chặn; "quy định luật Kinh doanh", "Theo Luật Kinh doanh" → V6. Đột biến M3 (bỏ `giới`) → **2 ca đỏ**; M4 (bỏ `ấm` khỏi danh sách đóng) → **4 ca đỏ** | Khớp đúng bảng §12.4, §12.5 và C76–C79 |
| DR6-133 | #729 → PR #755 | ĐÃ SỬA | `docs/user-guide/06-ai.md:49` ghi `discovery@4`; `apps/desktop/src/i18n/vi.ts:233` dùng slot `{count}` cho câu 20 000 | — |
| DR6-25 | #781 → PR #830 | ĐÃ SỬA | `grep "from 'zod"` trên `packages`, `apps`, `e2e`, `tools`: chỉ `zod/mini` (5 chỗ); `zod` bản đầy đủ chỉ còn trong **chuỗi** ca lint của `tools/pr-core.test.mjs:272-287`. Bundle `assets/index.js` 884 698 B (lượt 3: 927 932 B, −43 234 B) | Số tách phần `zod` lấy từ #830 (−62 735 B min), không đo lại |
| DR6-66 | #790 → PR #845 | ĐÃ SỬA | `packages/ai/src/errors.ts:25` `type AiLocalErrorCode` **không** export; `index.ts` chỉ re-export 11 module công khai (không `analysis-steps`, `attempts`) | Đột biến M12 (export lại `AiLocalErrorCode`) → **9/9 test xanh**: đúng loại bloat, không có test canh, không phải test hở |
| DR6-67 | #790 → PR #845 | ĐÃ SỬA | `errorDetails` (`errors.ts:45`) dùng ở `run.ts:171`, `apps/desktop/src/data/ai-tauri.ts:42`, `apps/desktop/src/routes/ai-error-view.ts:23`; kiểu `AiErrorDetails` / `AiErrorResult` là một | — |

### R2 — theo Issue (gói C kiểm 8 Issue)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-288 | #777 → PR #812 | ĐÃ SỬA | Một định nghĩa `MAX_AI_RAW_OUTPUT = 20_000` (`schema.ts:56`, không chỗ thứ hai trong `packages/*/src`); `AI_ANALYSIS_NO_MODEL` (`schema.ts:50`); `prompts/retry.ts` chỉ còn `RETRY_TEMPLATE` + `retryMessage` (16 dòng); `index.ts` không re-export `analysis-steps` / `attempts`; `factCodeString` mang message §11.6; `ownLine` = `cleanText(...).replace(...).trim()` | `pnpm vitest run packages/ai` 16 file / **1 297 test xanh**; `tsc --noUnusedLocals --noUnusedParameters` cho `packages/ai` sạch |
| T-289 | #778 → PR #809 | ĐÃ SỬA | Đột biến M10 → 6 ca đỏ; probe 2 ở DR6-121; 8 chữ của danh sách mới có ca (M3/M4 đỏ khi gỡ) | `mock-adapter.test.ts` 415 test xanh; 10 ca "36 000 ký tự" < 5 ms (bảng §6) |
| T-290 | #779 → PR #820, #822 | ĐÃ SỬA | Probe 2 (12 ca `extractJson`): `Ghi chú { chưa đóng. {"a":1} rồi…` (cut) → `{"a":1}`; `{"hypotheses": […` cut → `none`; `Lưu ý {"mẫu" chưa đóng…` → `none`; `Lưu ý { x "y. {…"{}"…}` cut **và** không cut → lấy cả câu trả lời. Đột biến M5 (`piece` → `cut ? 0 : Infinity`) → **5 ca đỏ**; M6 (bỏ gộp chỗ trùng trong `placesOf`) → **8 ca đỏ** | Probe 7: `detail` trích đúng chữ viết — `"XÁC SUẤT"`, `"Dai-ichi"`, `"Dai--ichi"`, `"İİ xác suất"` → `"xác suất"`, `"Điều\u200b35"` → `"Điều35"` |
| T-291 | #780 → PR #824, #828 (phần `ai`) | ĐÃ SỬA | Luật 3: `analysis-steps.ts:102-106` (`rejectedOutput`) + `ai-panel-view.ts:263-266` (`outputTooLarge`). Đột biến M9 → **1 ca đỏ**; M11 → **1 ca đỏ**. Luật 7: `LINE_BREAK` của `domain` dùng chung với `web.ts:118` (M2 đỏ). Mục 11: `extract-json.ts` (M5). Mục 12: `blocklists.test.ts` ca đếm (M3/M4 đỏ) | `db` (`analysisContentFits`, luật 2) thuộc gói A; phần `ai` ghi `row.output` đúng `JSON.stringify` của dữ liệu schema đọc ra |
| T-292 | #781 → PR #830 | ĐÃ SỬA | 5 chỗ `zod/mini`; `schemaDetail` đọc `issue.message`; `AI_OUTPUT_SCHEMAS satisfies Record<AiMode, z.ZodMiniType>` | `detail` V1 không đổi: 1 297 test xanh, không sửa kỳ vọng nào |
| T-295 | #784 → PR #825 (phần `ai`) | ĐÃ SỬA | `ai-analysis.ts:313-317`: so lại `generation` sau `await copy` **và** sau `await openChatGpt`. Đột biến M13 (bỏ lần kiểm thứ hai) → **1 ca đỏ** | `replacing()` **không** kiểm ở đây, đúng S2-4 (lần thay có thể lỗi) — `ai-analysis.test.ts` có ca riêng |
| T-297 | #786 → PR #835 (phần `ai`) | ĐÃ SỬA | `ai-jobs.ts:70-96` (`keep`, `kept`, `drop`, `kept.delete` khi start); `use-ai-job.ts:30-36` đọc `jobs.kept` bằng `useSyncExternalStore`, chép vào state lúc render, effect chỉ `drop`. Đột biến M8 (`keep?.(outcome)` → `false`) → **1 ca đỏ** | `ai-jobs.test.ts` 12 test; `onWebOpen={setWebOpen}` (setter ổn định) nên effect `webOpen` không lặp render |
| T-304 | #831 → PR #837 | ĐÃ SỬA | `schema.ts:180-191` `_default` bọc **ngoài** mọi `.check`; comment import "Checks go inside `_default`, not on it"; `eslint.config.js:55-56` `paths: zod` + `patterns: ['zod/*','!zod/mini']` | Đột biến M7 (thêm `.check()` sau `_default` của `personalityNotes`) → **2 ca đỏ** |

## 3. Phạm vi đã đọc

**Đọc trọn (SP):** `packages/ai/src/` — `adapter.ts`, `analysis-steps.ts`, `attempts.ts`, `blocklists.ts`, `code-points.ts`, `errors.ts`, `extract-json.ts`, `index.ts`, `input.ts`, `mock-adapter.ts`, `models.ts`, `run.ts`, `schema.ts`, `settings.ts`, `text-match.ts`, `validator.ts`, `web.ts`, `prompts/{analysis,connection,discovery,extraction,retry}.ts`, `raw.d.ts`, `test-support.ts`; `packages/ai/CLAUDE.md`, `package.json`.

**File AI của app:** `data/ai-analysis.ts`, `data/ai-jobs.ts`, `data/ai-tauri.ts`; `routes/SettingsAi.tsx`, `routes/settings-ai-view.ts`, `routes/ai-error-view.ts`; `routes/customers/{KycExtraction,KycHistory,KycIntelligence,KycWebSession}.tsx`, `{ai-panel-view,extraction-view,use-ai-job}.ts`; `routes/appointments/{AppointmentAi.tsx,appointment-ai-view.ts}`.

**Diff `119e2e4..2e51e25` của gói** (`git diff --numstat`): 40 file, +2 214 / −668 — đọc kỹ `extract-json.ts` (+25/−11), `text-match.ts` (+90/−26), `blocklists.ts` (+12/−7), `validator.ts` (+42/−24), `schema.ts` (+87/−54), `mock-adapter.ts` (+389/−59), `run.ts` (+31/−122), `analysis-steps.ts` (mới, 126), `attempts.ts` (mới, 51), `web.ts` (+46/−34), `errors.ts` (+31/−8), `prompts/retry.ts` (+2/−49), `ai-jobs.ts` (+38/−9), `use-ai-job.ts` (+16/−5), `ai-panel-view.ts` (+40/−28), `ai-analysis.ts` (+9/−8), `KycIntelligence.tsx` (+99/−52), `KycExtraction.tsx` (+52/−45), `SettingsAi.tsx` (+57/−34).

**Spec / golden:** `docs/design/phase-5-prompts.md` §1–§8.5 (đối chiếu từng dòng bảng V3–V6 với `blocklists.ts`), §10–§13 (đợt G5 `@4`, bảy luật T-291); `docs/design/phase-5-ai.md` §6.1, §7.1, §7.3; `docs/user-guide/06-ai.md`; `docs/state/review-notes.md` (qua `known.md`).

**Lượt trước:** tổng hợp lượt 3 §3, §6, §8.4, §9; `common\fixes.md` các Issue #777, #778, #779, #780, #781, #784, #786, #831; `common\baseline.md` (số cổng, bundle, exe).

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | Dấu tổ hợp lạc ở 7 dạng (trên phụ âm, sau dấu cách, `´`, `¨`, giữa chữ, trên "đ", cuối chuỗi) qua `validateOutput` | 5/5 dạng "xác suất" bị V3; dấu trên phụ âm đọc là dấu cách | — |
| 2 | Chặn nhầm: 11 câu thường có chữ trong danh sách đóng / "định" / "giới" | 4 câu thường không bị chặn; "khach am", "quy định Luật" vẫn bị; đúng §12.4–§12.5 | — |
| 3 | Ký tự điều khiển trong cụm bị chặn: BEL, NEL, NUL, ESC | BEL/NEL/ESC vẫn ra V3; **NUL lọt** | DSR4-C1 |
| 4 | Dán lại tin nhắn `web@1` với 8 kiểu xuống dòng + dán riêng phần ĐẦU VÀO (3 dạng) | 11/11 `OWN_MESSAGE`; bỏ hết xuống dòng → `retry` (không còn dòng mốc) | — |
| 5 | `extractJson` với 12 ca cắt / không cắt, gồm `{}` trong `text` của câu trả lời và `{"mẫu"` chưa đóng | Đúng spec §6.1 cả 12 ca | — |
| 6 | Mock trích xuất trên 30 câu (hỏi, đoán, người khác, "của", đảo vế, "KH" không mở vế, "và" nối) | Khớp bảng "Đề xuất mất đi" của PR #809; 0 đề xuất sai mới | — |
| 7 | `detail` V3–V6 với chữ hoa, `-`/`_`, `--`, `İ` (lowercase ra 2 code unit), U+200B, full-width `％` | Trích đúng chữ model viết ở cả 13 ca | — |
| 8 | Đo lại 10 ca "ghi chú một dòng 36 000 ký tự" của `mock-adapter.test.ts` + `extractJson` 300 000 ký tự + `validateOutput` 30 chỗ chặn | 1,7–4,5 ms (ngưỡng 50 ms); `extractJson` 0,0 / 1,1 ms | — |
| 9 | Đột biến 13 bản trên 8 file, chạy đúng test của PR sửa | 12 bản bị diệt; 1 bản sống (M12, export-only, đúng loại bloat) | — |

## 5. Phát hiện mới

```
ID: DSR4-C1
Mức: Low
Trục: G
Vị trí: packages/ai/src/text-match.ts:43-52 (cleanText), packages/ai/src/schema.ts:121 (visible = normalizeText)
Tình trạng: CONFIRMED
Liên quan: DR6-111 (đã sửa) · có từ trước, lượt 1–3 bỏ sót
Kịch bản: 3
Mô tả: `normalizeText` giữ NUL có chủ ý (`isStorableText` từ chối NUL, nên lệnh không bao giờ lưu), nhưng
  đường AI không đi qua `isStorableText`: một `text` của model có NUL vẫn qua V1 (chuỗi khác rỗng, có chữ)
  và NUL không phải khoảng trắng nên cụm bị chặn đứng hai bên NUL không khớp — V3–V6 lọt.
Tái hiện / bằng chứng: probe 1 (`…-r4\deepseek\C\probe1.mjs`), Node 24.20.0, `validateOutput('analysis', …)`:
  "xác\u0007suất"        -> ["V3 có \"xácsuất\""]
  "phần\u0000trăm"       -> []
  "phần\u001btrăm"       -> ["V3 có \"phầntrăm\""]
  "xác\u0085suất"        -> ["V3 có \"xác suất\""]
  (BEL, ESC bị `\p{Cc}` của K25 bỏ; U+0085 là White_Space nên thành dấu cách; NUL được giữ.)
  Phần "lưu được" là **đọc code, chưa chạy**: `JSON.stringify` viết NUL thành `\u0000` nên chuỗi lưu không
  mang NUL thật, và `analysisContentFits` của `db` (luật 13) so chuỗi đó với `JSON.stringify` của chính
  dữ liệu schema đọc ra — hai bên bằng nhau, nên dòng ACCEPTED đi qua; panel hiện "phầntrăm" (NUL không vẽ ra gì).
Ảnh hưởng: chỉ khi model viết một chuỗi có escape `\u0000` (output suy biến) — khi đó một câu nói "phần trăm"
  / "xác suất" đi qua guardrail V3 và được lưu như một phân tích ACCEPTED. Không hỏng dữ liệu, không lộ key.
Đề xuất: bỏ NUL ở `cleanText` (thêm `\0` vào bước thay ký tự vô hình, cùng chỗ với `\p{Cc}`) — một dòng,
  không đổi chữ G5 (bước 0 đã nói "bỏ ký tự vô hình theo K20"; NUL là ngoại lệ của K20 vì lý do *lưu trữ*,
  không phải vì lý do *so khớp*). Hoặc chặt hơn: V1 từ chối `text` có NUL (`z.refine(!s.includes('\0'))`),
  nhưng như vậy đổi `detail` V1 nên cần G5. Cỡ ≤ 5 dòng SP.
```

Không có phát hiện Medium / High / Critical nào trong gói. Hai chỗ đã xét kỹ và **không** báo: (a) `detail` V4 của tiền tố "pru" chỉ trích "PRUL" / "PRU-H" — đúng bằng đoạn regex §8.2 b khớp, không phải lỗi; (b) `cleanText` tách "Škoda" / "Curaçao" ở bản so khớp — đã ghi là tác dụng phụ đã biết ở §12.2.

## 6. Bloat và Hiệu năng

### Bloat

| Đã chạy / đo gì | Trên cái gì | Số | ID |
|---|---|---|---|
| `tsc -p packages/ai/tsconfig.json --noUnusedLocals --noUnusedParameters` | `packages/ai/src` (19 file SP) | 0 lỗi | — |
| `grep "from 'zod"` trên `packages`, `apps`, `e2e`, `tools` | toàn repo | 5 chỗ `zod/mini`; `zod` đầy đủ chỉ trong chuỗi ca lint `tools/pr-core.test.mjs` | — |
| `grep "AI_LOCAL_ERROR_CODES\|AiLocalErrorCode"` | `packages`, `apps` | 2 dòng, đều nội bộ `errors.ts` | DR6-66 |
| `grep "errorDetails("` | `packages/ai/src`, `apps/desktop/src` | 1 định nghĩa + 3 chỗ dùng | DR6-67 |
| `grep "20_000\|20000"` | `packages/ai/src`, `packages/db/src` (trừ test) | 1 định nghĩa (`schema.ts:56`) | DR6-25 |
| `node …/tsc` + 1 297 test `packages/ai` | — | xanh | — |
| Bundle `assets/index.js` | bản dựng `build:exe` ở bước chuẩn bị (`baseline.md`) | 884 698 B thô / 261 767 B gzip; lượt 3: 927 932 / 271 662 → **−43 234 B thô / −9 895 B gzip** | DR6-25 |

Không thấy bloat mới trong gói: 40 file diff của gói là +2 214 / −668, trong đó 566 dòng thêm vào ba file (`mock-adapter` +389, `analysis-steps` +126 mới, `attempts` +51 mới) và khoảng 130 dòng dời nguyên văn khỏi `run.ts` / `retry.ts` (mỗi dòng tính hai lần).

### Hiệu năng

Máy Home PC `DESKTOP-KDURKJP`, **Node v24.20.0**, không chạy gì song song; `performance.now()`, best of 5; dữ liệu: chuỗi dựng trong script (không phải dữ liệu tải — gói C không có đường đọc dữ liệu tải, xem ghi chú).

| Việc | Số | Mốc so sánh | ID |
|---|---|---|---|
| Mock trích xuất: `"KH"` + 36 000 dấu cách + `"độc thân"` | **1,7 ms** | ngưỡng test 50 ms; PR #809 ghi ≤ 3,0 ms | — |
| Mock trích xuất: `"chưa"` + 36 000 dấu cách | **2,4 ms** | như trên (PR #809: 4,6 ms cho ca "KH là người…") | — |
| Mock trích xuất: 36 000 ký tự `"độc thân "` | **4,5 ms** | DR6-79: 3,9 ms ở `e9a073a` | — |
| Mock trích xuất: ghi chú thường 200 ký tự | **0,0 ms** | — | — |
| `extractJson`: 300 000 ký tự, không có khối, `cut` | **0,0 ms** | T-290: "bản nay ≈ 1–2 ms" | — |
| `extractJson`: khối JSON 200 000 ký tự | **1,1 ms** | — | — |
| `validateOutput`: 1 text có 30 chỗ bị chặn | **0,1 ms** | — | — |
| `validateOutput`: text 300 ký tự sạch | **0,2 ms** | — | — |

Không có phát hiện P. **Ghi chú quan trọng cho các bên sau:** chạy `vitest` bằng `node` **v22.22.2** (bản trong PATH của shell này) làm **4 ca "36 000 ký tự" của `mock-adapter.test.ts` đỏ** (646–649 ms, ngưỡng 50 ms) vì V8 của Node 22 xử lý lookbehind chậm hơn nhiều; cùng mã, cùng máy, `node` **v24.20.0** (bản `package.json` yêu cầu `>=24 <25`, và là bản `baseline.md` dùng) cho 1,7–4,5 ms và **16 file / 1 297 test xanh**. Không phải hồi quy hiệu năng; nhưng nếu ai chạy cổng bằng Node 22 thì sẽ thấy đỏ giả.

## 7. Đếm mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

1 phát hiện, **1 CONFIRMED**, 0 PLAUSIBLE. Tỉ lệ PLAUSIBLE = 0 %: mọi kết luận ở bảng R đều có lệnh chạy lại được (probe 1–8, đột biến M1–M13).

## 8. Đã xét, không thấy

- **R (kiểm phần đã sửa):** 11 dòng R1 + 8 dòng R2 ở §2; 13 đột biến, 12 bị diệt. Không dòng nào CHƯA SỬA / SỬA MỘT PHẦN / HỒI QUY.
- **E (edge case):** `extractJson` với `{}` trong `text` (cut / không cut), `{"mẫu"` chưa đóng, khối sau `{` của lời văn, `{` lồng nhau, `{}` rỗng; `checkWebAnswer` với câu dán rỗng / toàn khoảng trắng / 20 000 / 40 000 code unit / > 40 000; `cleanText` với dấu ở đầu chuỗi, trên "đ", chuỗi NFD; `inOriginal` với `İ` (2 code unit) và dấu cách đôi từ `--`. Không thấy lỗi mới ngoài DSR4-C1.
- **C (hợp đồng / spec / nhãn):** đối chiếu **từng dòng** bảng §8.1–§8.4 với `blocklists.ts` (V3 15 dòng, V4 4, V5 12, V6 9): khớp cả thứ tự lẫn cột "Bỏ dấu"; C73–C79 có đủ trong `validator-blocklists.test.ts:166-195`; `maxTokens` 24 000 / 12 000 / 1 024 và `analysis@4` / `discovery@4` / `extraction@1` / `web@1` khớp §1, §2, §3, §4, §6a; `06-ai.md:49` khớp chip thật.
- **D (dữ liệu):** `buildAnalysisInput` (lọc `superseded`, thứ tự catalog rồi `seq`, tuổi thay năm sinh, nhãn hạng mục) khớp §1.1; `analysisOutcome` ghi `output` / `raw_output` / `validator` đúng §7.1; `filterExtraction` (V7) bỏ từng dữ kiện, không bỏ cả câu trả lời. Không thấy lỗi.
- **G (guardrail):** V1 (300/1 000 ký tự, chuỗi rỗng, không có chữ, mã F, trùng mã, `missingCategory`), V2 (mã lạ, hạng mục không thiếu), V3–V6 (bảng §8 + 7 ca dấu lạc), V7; `capped` 30 lỗi; `CUT_ANSWER` tách khỏi `NO_JSON`. Một chỗ hở: DSR4-C1.
- **S (an toàn ranh giới):** `errors.ts` không mang key / header / body; `errorDetails` chỉ nhận số và chuỗi; `serverMessage` cắt 200 code point; `ai-tauri.ts` đọc `{code,httpStatus,message}` và quy mọi thứ khác về `AI_BAD_REQUEST`; `CHATGPT_URL` cố định, không dữ liệu trong URL; `web@1` không gọi mạng. Không thấy lỗi.
- **P (hiệu năng):** bảng §6; không có phát hiện.
- **B (bloat):** bảng §6; không có phát hiện.
- **T (chất lượng test):** 13 đột biến; 12 bị diệt. Bản sống duy nhất (M12, export lại `AiLocalErrorCode`) là bloat không có test canh — đúng bản chất, không phải test hở. `blocklists.test.ts` có ca đếm matcher (M3/M4 đỏ), nên bỏ một mục khỏi bảng §8 là đỏ.
- **A (trợ a11y / i18n):** `aria-live` cho kết quả chạy (panel + ghi chú), `role="alert"` cho lỗi, focus sau Hủy / Thử lại / Đóng (DR5-43), `aria-current` ở bảng lịch sử, nhãn `aria-label` cho bảng và vùng; mọi câu qua `t()` (không chuỗi viết cứng trong file AI). Không thấy lỗi mới.

## 9. Phụ lục

**Nguồn probe / test tạm** (đều trong `…-r4\deepseek\C\`, không file nào trong repo):

| File | Việc |
|---|---|
| `probe1.mjs` | DR6-122, 124, 111, `cleanText`, T-290 (phần đầu) |
| `probe2.mjs` | DR6-123 (8 kiểu xuống dòng + 3 dạng dán riêng), T-290 (12 ca), Mock 30 câu |
| `probe3.mjs`, `probe4.mjs` | 10 ca "36 000 ký tự" theo đúng thứ tự test (phát hiện bẫy Node 22) |
| `probe5.mjs`, `probe6.mjs` | Cô lập chỗ tốn: `MARRIED` (`(?<=… đã\s+)`) là O(n²) trên dãy dấu cách — **chỉ trên V8 của Node 22**; Node 24 nhanh gấp ~380 lần ở ca này |
| `probe7.mjs` | `detail` V3–V6 (13 ca chữ viết) |
| `probe8.mjs` | Số đo bảng §6 |
| `mutate.mjs`, `mutate13.mjs` | 13 đột biến: vá tạm, chạy test của PR sửa, trả nguyên byte, in sha256 trước/sau |

**Đột biến — bản nào bị giết, bản nào sống** (mỗi bản chạy đúng file test của PR sửa, `--reporter=dot`):

| # | Dòng R | Sửa gì | Kết quả |
|---|---|---|---|
| M1 | DR6-122 | `cleanText`: dấu lạc → giữ nguyên thay vì dấu cách | 16 ca đỏ |
| M2 | DR6-123 | `web.ts`: `split(LINE_BREAK)` → `/\r\n|\r|\n/` | 13 ca đỏ |
| M3 | DR6-124 | bỏ `giới` khỏi `LAW_NAME` | 2 ca đỏ |
| M4 | DR6-124 | bỏ `'ấm'` khỏi `BARE_IS_A_WORD` | 4 ca đỏ |
| M5 | T-290 | `piece` → `cut ? 0 : Infinity` | 5 ca đỏ |
| M6 | T-290 | `placesOf` không gộp chỗ trùng | 8 ca đỏ |
| M7 | T-304 | `.check()` sau `_default` của `personalityNotes` | 2 ca đỏ |
| M8 | T-297 | `keep?.(outcome)` → `false` | 1 ca đỏ |
| M9 | T-291 | `rejectedOutput` luôn trả `parsed` | 1 ca đỏ |
| M10 | T-289 | bỏ neo đầu vế của `KH_SUBJECT` | 6 ca đỏ |
| M11 | T-291 | `outputTooLarge` → `false` | 1 ca đỏ |
| M12 | DR6-66 | export lại `AiLocalErrorCode` | **sống** — bloat không có test canh, đúng bản chất |
| M13 | T-295 | bỏ lần kiểm `generation` sau khi mở trình duyệt | 1 ca đỏ |

Sau mỗi bản: file trả nguyên byte (sha256 trước = sau), `git status --short` rỗng.

**Chưa làm (và vì sao):** không dựng bản web / không chạy Playwright cho DR6-118 (tràn khung panel AI). Lý do: gói C chỉ có một dòng R1 là hình thức; bản dựng `apps/desktop/dist` đã bị xóa ở bước chuẩn bị nên phải `pnpm build:web` + `vite preview` trên cổng 4173 rồi dựng một ca Playwright mới (chọn KH có phân tích trong dữ liệu seed) — quá ngân sách phiên so với một dòng `wrap-anywhere`; kết luận DR6-118 vì vậy ghi rõ là "đọc code", không phải số đo. Không đo trên exe (không cần cho gói C: không có đường đọc dữ liệu tải). Không chạy `pnpm e2e` (cổng 4173; bảng số cổng ở SHA ghim đã có trong `baseline.md`).

**`git status --short` cuối phiên:** rỗng.

**Giờ xong:** 2026-10-30 20:37 (+07:00).
