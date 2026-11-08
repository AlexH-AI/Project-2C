XONG — claude gói C lượt 6, 2026-11-07 14:44 (+07:00)

# Deep review Phase 1–6, lượt 6 — Claude, gói C (AI)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | Claude (reviewer Claude, phiên sạch, chỉ đọc). ID phát hiện `CLR6-C<số>` |
| Gói | C — AI (`packages/ai/**`; file AI của app: `ai-*`, `*-ai-*`, `*Ai.tsx`, `KycExtraction`, `KycIntelligence`, `KycWebSession`, `KycHistory`, `extraction-view`) |
| SHA đầu phiên | `5b1328ae236aa62981dbf43066ff544a9e832c8c` (`git rev-parse HEAD` ở `C:\workspace\Project-2C-review`, khớp SHA ghim) |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-11-07 13:35 (+07:00), Home PC `DESKTOP-KDURKJP` |
| Công cụ | Claude Code (app desktop, tab Code), phiên mới, worktree `C:\workspace\Project-2C-review` (detached HEAD); PowerShell 7 + Node v24.20.0 (`C:\Program Files\nodejs` đầu PATH ở mọi lệnh); Edge 156 / 157 qua Playwright của repo |
| Model / mức suy luận | Claude Opus 5.5 (`claude-opus-5-5`); mức suy luận **max** (thông tin phiên) |
| Ultracode / Workflow | không dùng. Không dùng skill `review-pr` / `code-review` |
| Phiên làm tiếp? | không — phiên đầu của gói C |
| Bước 0 | `C` thuộc thứ tự A → I; `claude\C.md` chưa có → làm mới; `A.md` (dòng đầu `XONG …` 12:58), `B.md` (`XONG …` 13:33) đủ |
| Chạy song song | Codex đợt 1 ở `Project-2C-review-2` (kế hoạch §L6.9); 10 tiến trình `node` trên máy lúc đo (13:49); CPU 8–15 % |

**Subagent: 2 lần**, công cụ Agent, `subagent_type: general-purpose`, `model: opus` (Claude Opus 5.5), `effort: xhigh`, chạy nền song song với phiên chính. Tin nhắn giao việc nêu đường dẫn đủ `C:\workspace\deep-review-1-6-r6\common\prompt-claude.md`, chữ gói C, bảo đọc quy tắc riêng 2–4 và phần chung trước khi làm; không subagent nào gọi subagent khác, không ghi `C.md`, không in `XONG`.

| Subagent | Việc giao | Probe | Thời gian |
|---|---|---|---|
| S1 | Tìm lỗi mới ở lõi và guardrail của `packages/ai/src` (`validator`, `blocklists`, `text-match`, `extract-json`, `schema`, `run`, `attempts`, `analysis-steps`, `errors`, `settings`, `models`, `code-points`, `input`, `adapter`, `index`, `prompts/*`, phần `web.ts` ngoài `isBlankWebAnswer`) và test của chúng, đối chiếu spec Phase 5 §3–§8, G5 §1–§8, §10–§14 | `C\s1\` | 13:50–14:11 (1 273 s, 116 lần gọi công cụ) |
| S2 | Tìm lỗi mới ở file AI của app (`data/ai-{analysis,jobs,tauri}`, `SettingsAi`, `ai-error-view`, `settings-ai-view`, `AppointmentAi`, `appointment-ai-view`, `KycExtraction`, `KycHistory`, `KycIntelligence`, `KycWebSession`, `ai-panel-view`, `extraction-view`, `use-ai-job`) và test, chuỗi nhiều bước qua lớp dữ liệu và bản web (cổng riêng 4941–4945) | `C\s2\` | 13:51–14:10 (1 195 s, 124 lần gọi công cụ) |

Phiên chính làm bảng R, diff `37a80b6..5b1328a` của gói, Mock trích xuất (`mock-extraction.ts` cả 963 dòng, `mock-adapter.ts`, `input.ts`), `web.ts`, `KycWebSession.tsx`, `ai-analysis.ts`, và **kiểm lại mọi phát hiện của S1, S2 trên code trước khi ghi**: đọc lại từng vị trí ở `5b1328a`, chạy lại probe / đột biến của chúng (S1-1: Node tái hiện, **Edge / WebView2 không tái hiện → không ghi**; S1-2: 4 + 4 đột biến chạy lại, cả bộ 4 493 test; S1-3: 8 đột biến chạy lại cả bộ — W8 bị một ca của app giết nên bỏ khỏi phát hiện; S1-4: chạy lại probe; S1-5: đọc; S2-1: chạy lại probe (b) trên bản web của phiên chính; S2-2, S2-3: đọc code + log; S2-4: U1, U17 chạy lại cả bộ). Phát hiện của subagent mang ID `CLR6-C…` ở mục 5, ghi rõ ai tìm.

Probe / log của phiên: `C:\workspace\deep-review-1-6-r6\claude\C\` (phụ lục 9). Công cụ chép theo tên đầy đủ từ probe lượt 5 của chính Claude (`deep-review-1-6-r5\claude\C\` và `…\D\`, đường dẫn ghi ở báo cáo gốc `docs/reviews/raw/2026-11-05/claude/{C,D}.md`) vào `C\r5copy\`; bản dùng ở `C\` chỉ đổi thư mục, cổng (4931 bản ghim, 4932–4939 bản đột biến) và cây so (`C\old-37a80b6\` = `git archive 37a80b6` của `packages/{domain,ai,db}/src`, `packages/db/migrations`, `apps/desktop/src`).

## 2. Bảng R

Cách làm chung: probe Node nạp TypeScript của worktree ghim qua `C\hooks.mjs`, chạy song song bản chép `37a80b6` trong cùng tiến trình (`C\mock-lib.mjs`: mỗi ghi chú qua adapter với message app dựng, bản ghim qua `runExtraction` = Mock + V1 + V7 như app). Đột biến "gỡ phần sửa" không ghi repo: vitest qua hook `load` của Vite (`C\mutant-config.mjs`, `C\mutjs.mjs`, định nghĩa `C\mut-defs.mjs`; chỉ tính khi có `[mutant] served`; sống ở test nhắm thì chạy lại cả bộ 4 493 test); TSX qua bản web đột biến ngoài repo (`C\build-dist.mjs` + `C\serve-dist.mjs` cổng 4932–4934, chạy spec e2e của repo bằng `C\pw.config.mjs`, Edge, mọi host khác 127.0.0.1 / localhost bị chặn). Đối chứng: vitest Mock + web 3 file **791 / 791** (`C\logs\vitest-control-ai3.log`); e2e `customer-ai-web.spec.ts` trên `C\dist-base` :4931 **10 / 10** (`C\e2e-mut.log`). Màn: bản web ghim `C\dist-base` (Vite `build()` của worktree, `outDir` ngoài repo, neo 15/09/2026 như e2e), Edge qua `C\browser.mjs` (chặn mạng ngoài 127.0.0.1 và thay `window.open` / clipboard từ lần chạy đầu; mọi log "requests blocked: []"). Dòng cuối mọi lần chạy đột biến / dựng: `git status --short after: ""`.

### 2.1 Bảng R1 (5 dòng của gói C)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-164 | #1047 → #1066 | **ĐÃ SỬA** | Tái hiện CLR5-C1 (`C\r1-mock.mjs` nhóm 1, `C\logs\r1-mock.log`): "1. Khách đã kết hôn.", "1. Hai vợ chồng đã kết hôn, có 2 con.", "... Khách…", "?\nKhách…", "1.\nChị nói đã kết hôn.", "2020. Khách…" → Đã kết hôn (và Số con 2), như `37a80b6` (phần sửa chỉ thêm test); "Gặp. Khách đã kết hôn." → 0. Màn (`C\p-extract-screen.mjs`): "1. Khách đã kết hôn, sống ở quận 7." → "AI đề xuất: Tình trạng hôn nhân: Đã kết hôn ("kết hôn")". **Gỡ phần sửa** (`C\mutjs.log`): **R164-T6** (đột biến T6 của lượt 5: `worded = worded \|\| clause.start > 0`) **bị giết**, 5 đỏ — đúng 5 ca mới của `mock-extraction.test.ts` ("1. Khách…", "... Hai vợ chồng…", "?\nKhách…", "1.\nChị nói…", "2020. Khách…") | Biến thể gần: R164-digit (chữ số tính như chữ cái) bị giết 3; R164-mark (mọi dấu không phải khoảng trắng tính như chữ) bị giết 5. Câu (`r1-mock` nhóm 2): "٣.", "Ⅱ.", "#1.", "1)\n", "--\n", U+200B rồi xuống dòng → đề xuất (đúng §10 "trước mọi chữ cái"); "I.", "a)", "(1)", "1/", emoji đứng đầu vế → 0 (hướng an toàn: "I", "a" là chữ cái; "(", "/", emoji không là dấu đầu dòng của §10; lượt 5 K3 đã xét) |
| DR6-165 | #1052 → #1074 (tài liệu) | **ĐÃ SỬA** | `docs/metrics/phase-6.md:348-362`, mục "Mốc Mock trích xuất (DR6-165, T-370)": Q2 (a) của Owner; ba số mốc ở `37a80b6` 28,5 / 103,5 / 53 ms (so `2e51e25` 9,2 / 62,2 / 31); máy Home PC, Node v24.20.0; nguồn CLR5-C2; "mốc so cho lần đo sau" theo luật nhiễu; ngưỡng < 200 ms giữ. **Số đo lượt 6 cùng máy**, xen kẽ với `37a80b6` (`C\p65-cold.mjs`, `C\p65-ab.mjs` = probe lượt 5 chỉ đổi hook / bản so; 13:49–13:50, CPU 8–15 %): lần gọi đầu của tiến trình (ghi chú RE dài nhất, 173 ký tự; 9 tiến trình mỗi bản) `37a80b6` **29,52 ms** (28,81–30,15) → ghim **28,20 ms** (27,43–30,38); cả bộ 3 551 ghi chú RE **74,51 → 77,30 ms** (×1,04, +2,8 ms; 7 vòng); ghi chú dài nhất khi ấm 0,02 = 0,02 ms. Trong luật nhiễu; khớp mốc | Dòng "Sau mốc" (`phase-6.md:362`) chỉ nêu T-365; T-375 (#1086) cũng đổi `CHILD` của Mock — số đo trên gồm cả hai đợt, trong nhiễu. Không ghi phát hiện. Phần đo trên màn (53 ms) là của gói F |
| DR6-166 | #1047 → #1066 (+ #1080 → #1086) | **ĐÃ SỬA** | Tái hiện CXR5-C1, C2 (`r1-mock` nhóm 3, 5): "KH có 3 con. Vụ mất điện ở căn nhà nhỏ bé." `37a80b6` 0 → ghim **Số con 3** ("… mất mát nhỏ." 3 ở cả hai); "– KH đã kết hôn" 0 → **Đã kết hôn**; "– KH đã kết hôn\n– Đã ly hôn năm 2020." 0 → **Ly hôn**; "–KH…", "-KH…" → 0 (đúng §10). Màn: hai ghi chú này ra đúng đề xuất; Xác nhận "Số con: 3" → hộp "+ Dữ kiện · Số con" điền 3 → thẻ KYC "Số con: 3". **Gỡ**: **R166a-nho-be** (bỏ ngoại lệ "nhỏ bé" của `CHILD`) bị giết 1; **R166b-en-dash** (bỏ "–" khỏi `BULLET`) bị giết 2; R166b-no-space (không cần khoảng trắng sau dấu) bị giết 2; R166a-all-sizes (miễn mọi chữ cỡ của luật 4 như commit đầu `8a35a2c`, trái quyết định (b)) bị giết 7 | Biến thể (a): "NHỎ BÉ", "Căn nhà nhỏ bé bị mất điện.", "… nhỏ bé xíu.", "nhà nhỏ bé nên hay mất điện" → 3; "… căn nhà bé nhỏ." → 0 (quyết định (b) 05/11). (b): "—" U+2014, "‒", "−", "‐", "·", "◦", "▪", "‣", "⁃", "→" đầu vế → 0 như `37a80b6` (danh sách đóng của §10: "-", "–", "*", "•", "+", "1)"; hướng an toàn); "•\t", "–" + NBSP, "–\t" → đề xuất; "–" ở dòng "Hôn nhân:", sau tiêu đề, KH tự nói, vế mang sang như "-" (`C\p-bullet-lines.mjs`). Cả **66 câu ví dụ của §10** khớp spec (`C\p-spec10.mjs`; 4 câu đổi so `37a80b6`, đúng chủ ý). **3 551 ghi chú thật: 1 972 → 1 972 đề xuất, 0 ghi chú khác** (`C\p-corpus.mjs`; 1 390 ghi chú có "–" dạng khoảng "1–2 tỷ", 0 có "đứa / thằng" hay "nhỏ bé") |
| DR6-167 | #1047 → #1066 (+ #1080 → #1086) | **ĐÃ SỬA** (rule; phần còn hở → **CLR6-C5**) | Tái hiện CXR5-C3 trên cây thử ngoài repo (`C\dc-probe.mjs`, `C\logs\dc-probe.log`: cùng bố cục `apps/`, `packages/`, `node_modules/vitest` giả; dependency-cruiser 18.4.0 của repo như `depcruise apps packages`): file sản phẩm `apps/desktop/src` re-export `packages/ai/src/test-support.ts` → cấu hình ghim báo `test-files-only-in-tests`, cấu hình `37a80b6` không báo. Ghim chặn **8 / 8** cạnh tới file test / test-support (của ai, db, domain, ui, app; cả `import()` động và `import type`); `.test.ts` / `.test.tsx` import thì được. `509b785` (T-365): 3 / 8; `37a80b6`: 1 / 8. **Gỡ phần sửa:** bỏ hẳn rule (`C\dc-mut.cjs`) → `depcruise apps packages` trên code repo vẫn "✔ no dependency violations found (354 modules, 1582 dependencies cruised)", exit 0: **không test nào đỏ** (Issue #1047 / #1080 chốt test chấp nhận là probe ghi ở thân PR) | Còn hở (→ CLR6-C5): (1) rule không có test giữ; (2) file sản phẩm của `apps/desktop`, `packages/db`, `packages/ui` import thẳng `vitest` → **0 vi phạm** ở cả ba cấu hình (chỉ `ai`, `domain` có rule chặn), trong khi chú thích `TEST_FILES` (`.dependency-cruiser.cjs:3-6`) ghi "They may use vitest; no other file may." ESLint không có luật nào về `vitest` (`eslint.config.js`). Repo hôm nay: 0 file ngoài `TEST_FILES` import `vitest` (`git grep`) |
| DR6-168 | #1047 → #1066 (+ #1080 → #1086) | **ĐÃ SỬA** | Tái hiện DSR5-C1 **trên màn** (`C\p-web-blank.mjs`, `C\logs\p-web-blank.log`; phiên ChatGPT web của KH discovery, dán bằng đặt giá trị như dán): U+200B U+2060 → nút "Kiểm tra và lưu" **tắt**, vẫn "Lần thử 1 / 2"; cũng tắt với U+3164 U+0085 U+2800 · U+FEFF U+00AD U+034F U+180E · U+115F U+1160 U+FFA0 · U+3000 NBSP U+2028 tab. Unit: `checkWebAnswer` trả `EMPTY`, không tính lần thử ở lần 1 lẫn lần 2. **Gỡ**: **R168-trim** (`isBlankWebAnswer` về `pasted.trim() === ''`) bị giết 4 (`web.test.ts`: hai ca `checkWebAnswer` "only invisible characters", "invisible characters and white space", hai ca `isBlankWebAnswer`); R375-check-trim (`checkWebAnswer` hỏi trống bằng `trim()`) bị giết 2; **E168-button-trim** (nút theo `trim()`, như trước T-365) bị giết bởi e2e `customer-ai-web.spec.ts:39` (9 qua / 1 đỏ). Spec §3.1 mục 3 ghi "rỗng như mọi ô khác … `normalizeText`" | Biến thể: 40 000 dấu cách (đúng `MAX_READ`) → nút tắt; câu dán vừa trống vừa dài hơn `MAX_READ` → xem T-375 và CLR6-C11. Câu dán chỉ có NUL không trống theo `normalizeText` (chủ ý, `packages/domain/src/text.ts:20-21`); văn bản clipboard của Windows dừng ở NUL nên không dán được — không ghi |

Đếm R1 (5 dòng): **5 ĐÃ SỬA**, 0 SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY. Đường lỗi cũ của cả 5 đã hết. Phần sửa của DR6-167 không có test đỏ khi gỡ → ghi ở CLR6-C5.

### 2.2 Bảng R2 (1 Issue của gói C)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-375 | #1080 → #1086 | **ĐÃ SỬA** (mọi mục; hai phần không có test đỏ khi gỡ → **CLR6-C5**, **CLR6-C6**; chữ spec §3.1 → **CLR6-C11**) | **(1) Một luật câu dán trống:** `isBlankWebAnswer` (`packages/ai/src/web.ts:129-131`: `pasted.length <= MAX_READ && normalizeText(pasted) === ''`), export qua `index.ts`, bản đồ export `packages/ai/CLAUDE.md:55`; `checkWebAnswer` dùng ở bước `EMPTY` (`:156`), thứ tự `OWN_MESSAGE` → `TOO_LONG` theo `MAX_READ` → `EMPTY` → `TOO_LONG` theo code point giữ (`:153-157`); nút dùng nó (`KycWebSession.tsx:178`), màn không import `normalizeText`. Gỡ: **R375-no-cap** (chuẩn hóa câu dán mọi độ dài) bị giết 1 (`isBlankWebAnswer > takes a paste with white space longer than is read as not blank`); R375-cap-1 (`<` thay `<=`) bị giết 1. Màn: 40 001 dấu cách và 40 001 U+200B → nút **bật**, bấm → ô báo "Câu trả lời dài quá 20.000 ký tự — kiểm tra đã copy đúng câu trả lời chưa.", vẫn "Lần thử 1 / 2" (không tính lần thử); "x" × 20 001 như vậy. **(2) Mock "đứa / thằng … đã mất"** (`mock-extraction.ts:351-354`): tái hiện L21 (`r1-mock` nhóm 7): "KH có 2 con. Đứa nhỏ đã mất.", "… Thằng út đã mất." `37a80b6` Số con 2 → ghim 0; "Đứa nhỏ bé đã mất." 0; "… nhỏ bé." 3 giữ; màn: hai ghi chú → "AI không tìm thấy dữ kiện mới trong ghi chú này." Gỡ: **R375-no-words** bị giết 3, R375-no-dua 2, R375-no-thang 1. §10 (`phase-5-ai.md:381`) ghi luật, ba ví dụ, nguồn Owner 06/11. **(3) Rule chung** `test-files-only-in-tests` (`.dependency-cruiser.cjs:33-40`): cây thử chặn ai → domain test, db → test-support, app → db test-support (dòng DR6-167) | Gỡ phần nút: **E375-button-normalize** (nút theo `normalizeText(pasted) === ''` của cả câu dán, bản T-365) **sống**: e2e `customer-ai-web.spec.ts` 10 / 10 xanh → **CLR6-C6**. Gỡ rule: lint vẫn xanh → CLR6-C5. Biến thể Mock (`r1-mock` nhóm 8): "Đứa út đã qua đời năm 2020", "ĐỨA NHỎ ĐÃ MẤT", "Một đứa / 1 đứa đã mất" → 0; "Thằng bạn KH / Đứa em họ đã mất" → 0 (bỏ Số con, hướng an toàn như Issue chốt). "Cháu út / Cháu lớn / Cu Tí / Nhóc út đã mất" ở câu sau → Số con 2 như `37a80b6`: "cháu" là chữ người khác của luật §10 (`PEOPLE`), luật Owner 06/11 chỉ thêm "đứa", "thằng" — đúng spec, không ghi phát hiện (mục 4, K10) |

Đếm R2 (1 Issue): **1 ĐÃ SỬA**; phần còn hở: hai chỗ test không giữ phần sửa (CLR6-C5, CLR6-C6) và chữ spec §3.1 mục 3 chưa theo (CLR6-C11).

## 3. Phạm vi đã đọc

**Diff `37a80b6..5b1328a` của gói C** (`git diff --numstat -M 37a80b6 5b1328a -- <65 file của files-C.txt>`): SP **+46 / −16 ở 5 file** (`packages/ai/src/mock-extraction.ts` +19 / −6, `web.ts` +16 / −5, `apps/desktop/src/routes/customers/KycWebSession.tsx` +5 / −2, `KycHistory.tsx` +4 / −2, `KycIntelligence.tsx` +2 / −1), test **+65 / −5 ở 2 file** (`mock-extraction.test.ts` +27, `web.test.ts` +38 / −5); ngoài danh sách: `packages/ai/CLAUDE.md` +2 / −2 (bản đồ export), `.dependency-cruiser.cjs` (gói F; dòng DR6-167). Commit: `509b785` (#1066, T-365), `dd5ae56` (#1070, T-367), `e0806b8` (#1086, T-375), `64720db` (#1092, T-376). Đọc từng hunk và cả file sau đổi (phiên chính: Mock, `web.ts`, `KycWebSession.tsx`, hai file test; S2: `KycHistory.tsx`, `KycIntelligence.tsx`).

**File của `common\files-C.txt` (65: 39 SP, 26 test):**

| File | Ai đọc, đọc thế nào |
|---|---|
| `packages/ai/src/mock-extraction.ts` (963 dòng), `mock-adapter.ts`, `input.ts`, `web.ts`, `analysis-steps.ts`, `blocklists.ts`, `extract-json.ts`, `adapter.ts`, `prompts/retry.ts`; `apps/desktop/src/data/ai-analysis.ts`, `routes/customers/KycWebSession.tsx` | phiên chính, đủ |
| `validator.ts`, `text-match.ts`, `schema.ts`, `run.ts`, `attempts.ts`, `errors.ts`, `settings.ts`, `models.ts`, `code-points.ts`, `index.ts`, `raw.d.ts`, `prompts/{analysis,discovery,extraction,connection}.ts`, `test-support.ts`, `prompts/prompts.test.ts` | S1, đủ (cùng các file phiên chính đọc ở dòng trên) |
| `data/ai-jobs.ts`, `data/ai-tauri.ts`, `routes/SettingsAi.tsx`, `ai-error-view.ts`, `settings-ai-view.ts`, `appointments/AppointmentAi.tsx`, `appointment-ai-view.ts`, `customers/{KycExtraction,KycHistory,KycIntelligence}.tsx`, `ai-panel-view.ts`, `extraction-view.ts`, `use-ai-job.ts`, `ai-jobs.test.ts` | S2, đủ (cùng `ai-analysis.ts`, `KycWebSession.tsx`) |
| `mock-extraction.test.ts` (1 152 dòng), `mock-adapter.test.ts`, `web.test.ts` | phiên chính: tên mọi ca, đủ phần diff; độ giữ đo bằng **113 đột biến** Mock / `web.ts` (mục 9.2) thay đọc từng dòng |
| `validator.test.ts`, `validator-blocklists.test.ts`, `validator-extraction.test.ts`, `validator-union.test.ts`, `schema.test.ts`, `input.test.ts`, `settings.test.ts`, `errors.test.ts`, `models.test.ts`, `code-points.test.ts`, `extract-json.test.ts`, `run.test.ts`, `blocklists.test.ts` | **không đọc kỹ thân test** (S1 đọc tên ca, `blocklists.test.ts` 1–80): độ giữ đo bằng 123 đột biến của S1, phiên chính chạy lại 16 con sống (12 trên cả bộ; mục 9.2) |
| `ai-analysis.test.ts` (949 dòng), `ai-panel-view.test.ts` (1 000 dòng), `extraction-view.test.ts`, `settings-ai-view.test.ts`, `ai-error-view.test.ts`, `appointment-ai-view.test.ts`, `ai-tauri.test.ts` | **không đọc kỹ thân test** (S2 đọc tên ca, một phần `ai-analysis.test.ts`): độ giữ đo bằng 26 đột biến unit + 4 đột biến TSX của S2 |

**Chỗ gói khác nối vào:** `packages/domain/src/text.ts` (đủ: `normalizeText`, `LINE_BREAK`, `normalizeNote`), `packages/db/src/ai-analyses.ts` (`toRow`, `storedRawOutput`; S2 đủ), `.dependency-cruiser.cjs`, `eslint.config.js`, `e2e/customer-ai-web.spec.ts` (ca 1, ca 10), `e2e/customer-ai.spec.ts` (AI trích xuất), `e2e/long-names.spec.ts` (phần AI; S2), `docs/metrics/phase-6.md` (mốc Mock), `apps/desktop/src/i18n/vi.ts` (khóa `aiPanel.*`, `aiError.*`, `settingsAi.*`; S2).

**Tài liệu:** `CLAUDE.md` gốc, `packages/ai/CLAUDE.md`, `apps/desktop/CLAUDE.md`, `packages/db/CLAUDE.md`, `.claude/rules/{i18n-ui,tests}.md`; spec `phase-5-ai.md` (§3.1, §8, §9.1, §10 đủ; S1 cả file); G5 `phase-5-prompts.md` (§7, §8 đủ, §10.10, §11.8, §12.8, §13.6, §14.5; S1 §1–§8, §10–§14); `common\{prompt-claude.md (đủ), plan.md (§4, §L6.0–§L6.8), known.md (phần 1: hai mục OPEN và mọi mục ACCEPTED — đoạn đầu OPEN 46 855 ký tự chỉ đọc 3 000 ký tự đầu; phần 2–5 đủ), fixes.md (bảng đầu; #1047 / #1066, #1052 / #1074, #1080 / #1086 và nhóm RESOLVED T-375), baseline.md (đủ), files-C.txt}`; tổng hợp lượt 5 (§1, §5, §6, §7); báo cáo gốc lượt 5 `claude/C.md` (đủ), `codex/C.md`, `deepseek/C.md` (mục lục, ID), lượt 4 `claude/C.md`, `codex/C.md` (khuôn CLR4-C1, CXR4-C1), `docs/reviews/raw/2026-10-10/deepseek/D.md` (DS-D2); `claude\A.md`, `B.md` lượt 6 (mục 1–2, ID). **Không đọc:** ADR-0009, `docs/golden/ai-eval.md` ngoài §1–§2 (S1), mockup `ai.html` ngoài bảng 2l / 4c và `customer.html` (S2).

## 4. Kịch bản đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| K1 | Tái hiện lượt 5 của DR6-164, 166, 168 và L21 của T-375 (`r1-mock`, `p-web-blank`, `p-extract-screen`) | đúng ở ghim; mục 2 | — (bảng R) |
| K2 | 66 câu ví dụ của spec §10 (`phase-5-ai.md:376-384`) qua Mock ghim như app, so kết quả spec ghi (`p-spec10`) | 66 / 66 khớp; 4 câu đổi so `37a80b6`, đều là phần sửa | — |
| K3 | Đề xuất `37a80b6` ↔ ghim trên 3 551 ghi chú RE (dữ liệu tải + seed 3 ngày neo; `p-corpus`) | 1 972 → 1 972, 0 ghi chú khác | — |
| K4 | "–" (T-365) ở các đường khác dùng `BULLET`: dòng "Hôn nhân:", tiêu đề "Ghi chú:", KH tự nói, "Hai vợ chồng", vế mang sang, "–" giữa câu, "– –" (`p-bullet-lines`) | như "-" ở mọi đường | — |
| K5 | Màn: ghi chú → AI trích xuất → Xác nhận → hộp + Dữ kiện → thẻ KYC (`p-extract-screen`) | đề xuất đúng; "Số con: 3" vào thẻ KYC; 0 lỗi trang | — |
| K6 | Màn: khung dán ChatGPT web với 6 nhóm ký tự vô hình, 40 000 / 40 001 dấu cách, 40 001 U+200B, 20 001 "x" (`p-web-blank`) | nút tắt / bật đúng `isBlankWebAnswer`; quá dài báo ở ô, không tính lần thử | — |
| K7 | Ba đột biến TSX của nút "Kiểm tra và lưu" trên bản web đột biến (`e2e-mut`) | `trim()` và "luôn bật" bị giết; **bản T-365 (`normalizeText` cả câu) sống** | CLR6-C6 |
| K8 | dependency-cruiser trên cây thử, ba cấu hình; gỡ rule trên code repo (`dc-probe`, `dc-mut.cjs`) | ghim chặn 8 / 8; gỡ rule vẫn xanh; `vitest` từ sản phẩm `apps` / `db` / `ui` không bị chặn | CLR6-C5 |
| K9 | Chi phí Mock ghim ↔ `37a80b6` (lần gọi đầu, cả bộ; `p65-cold`, `p65-ab`) | trong luật nhiễu | — (DR6-165) |
| K10 | Chữ chỉ con khác "đứa / thằng" ở câu sau: "Cháu út / Cháu lớn / Cu Tí / Nhóc út đã mất" (`r1-mock` nhóm 8) | Số con 2 như `37a80b6`; "cháu" là chữ người khác của §10 (`PEOPLE`), luật Owner 06/11 chỉ thêm "đứa", "thằng": đúng spec | không ghi |
| K11 | Dấu đầu dòng khác "—", "‒", "−", "‐", "·", "◦", "▪", "‣", "⁃", "→", "1/", "a)", "(1)" (`r1-mock` nhóm 2, 6) | 0 (hướng an toàn); danh sách đóng §10 | không ghi |
| K12 | 82 đột biến "bỏ một chữ / dấu" của các danh sách §10 trong Mock; câu chứng cho mỗi con sống (`mut-lists`, `p-mut-witness`) | 58 bị giết, **24 sống**, cả 24 đổi đề xuất | CLR6-C7 |
| K13 | 17 đột biến "bỏ hẳn một luật chặn" của Mock; câu chứng; so 3 833 ghi chú / câu (`mut-guards`, `p-guard-witness`, `p-guard-corpus`) | 8 bị giết; 5 sống có tác dụng (`SUPPOSED`, "khi … thì", `EITHER`, `NOT_ASKED`, `OF_SOMEONE_ELSE`); 4 sống không đổi gì trên 3 833 ghi chú (`PARTNER_FIRST`, `DENIED` / `BUT`, `WISHED`, `NOT_PLANNED`: mục 8 trục B) | CLR6-C7, CLR6-C2 |
| K14 | "hay / hoặc" + cụm khác sau dấu phẩy, cùng câu; đối chứng không dấu phẩy, "hay chưa", "?", câu sau (`p-either`, `p-either-screen`) | dạng có dấu phẩy ra đề xuất khả năng đầu, trên màn cũng vậy | CLR6-C2 |
| K15 | Khối JSON lồng mảng sâu dán ChatGPT web hai lần (S1-1): Node; Edge (`p-deep-web`) | Node: `JSON.stringify` ném `RangeError` từ ≈ 4 785 tầng, `analysisOutcome` ném (S1 `p01-deep.log`, phiên chính chạy lại). **Edge 156 / 157** (= WebView2 của exe trên máy, `C:\Program Files (x86)\Microsoft\EdgeWebView\Application\{156.0.4314.58,157.0.4341.42}`): `JSON.stringify` nhận mảng sâu 2 000 000 tầng; dán độ sâu tối đa còn dưới 20 000 ký tự (9 986) → lần 2 "Phân tích xong nhưng kết quả bị loại", dòng REJECTED lưu, 0 lỗi | không ghi (chỉ trong Node của test) |
| K16 | Dòng "của app" (`OWN_LINES`) có dòng rỗng không (`probe-ownlines`) | không: 4 dòng, không dòng rỗng | không thấy |
| K17 | Câu dán chỉ NUL | không trống theo `normalizeText` (chủ ý); không dán được qua clipboard Windows | không ghi |
| S1-a | (S1) ChatGPT web, `runAnalysis`, `saveChatGptAnswer` với khối lồng sâu trong Node; luật nhập 13 với output REJECTED sâu; câu trả lời đúng + khóa lạ / `__proto__` | Node ném (K15); nhập backup → `BACKUP_INVALID` (đúng); khóa lạ bị schema bỏ (đúng) | — |
| S1-b | (S1) Biên TOO_LONG 20 000 / 20 001 code point (ASCII, emoji); "%‰" chạm nhau; cắt 30 issue với mã lẫn; chi phí `isBlankWebAnswer` / `checkWebAnswer` ở 40 000 code unit (6 dạng) | đúng; trung vị ≤ 0,8 / ≤ 7,7 ms; test hở → CLR6-C9 | CLR6-C9 |
| S1-c | (S1) Chữ theo sau "sẵn sàng / tiềm năng mua" và "Luật" qua `validateOutput` (`p04-followers`, phiên chính chạy lại) | "(F12)", "[F12]", ngoặc kép / ngoặc đơn quanh tên luật lọt | CLR6-C1 |
| S1-d | (S1) 125 đột biến lõi / regex G5 (`mutants.mjs`, `mutants-alt.mjs`) | 89 bị giết; sống không tương đương → CLR6-C8, C9 (sau khi phiên chính chạy lại cả bộ) | CLR6-C8, C9 |
| S1-e | (S1) `buildWebMessage`, `OWN_LINES`, `retryMessage`, `connectionCheck`, `maxTokens`, `PROMPT_VERSIONS` so G5 §1, §5, §6, §6a; `evidenceLevel` so §6.3; `reasoning` gửi Rust chữ thường; `AI_OPEN_BROWSER` | khớp | — |
| S2-a | (S2) Phiên ChatGPT web: mở, dán sai, dán lại tin nhắn app, Hủy, REJECTED; focus và vùng live (`s2\p01`) | đúng (R2-06, DR5-33) | — |
| S2-b | (S2) Mã F 39 ký tự trong `detail` V2; model 300 ký tự trong hàng `settings` `ai` của backup sửa tay; `AI_HTTP` với link dài và với cụm hex 104 ký tự (`s2\p02`, `p04`, `p04b`) | link xuống dòng; cụm liền làm trang cuộn ngang | CLR6-C4 |
| S2-c | (S2) Kiểm tra kết nối bị giữ (`holdAi`), đổi mục / màn rồi quay lại (`s2\p03`) | câu "yêu cầu AI khác" sai; kết quả mất | CLR6-C3 |
| S2-d | (S2) Hai lần phân tích trong cùng một phút (`s2\p05`) | hai nút "Xem lần 15/09 09:30" | CLR6-C13 |
| S2-e | (S2) Chuỗi thay dữ liệu × AI (`replaced`, `generation`, `keptFailures` × Nạp lại / Nhập backup / Dọn sạch / xóa, khôi phục KH; Hủy lúc đang thay; qua nửa đêm): đọc code, đối chiếu test `ai-analysis.test.ts:294-436`, `:494-526`, `:864-947` | đúng; lượt 5 K11 đã chạy ở lớp dữ liệu | — |
| S2-f | (S2) 26 đột biến unit + 4 TSX (X1 DR6-170 `CELL_NAME` / chip, X2 DR6-15, X3 T-297, X4 DR6-168) | X1–X4 bị giết bởi e2e; U1, U17 sống → CLR6-C10; U6, U24 tương đương | CLR6-C10 |

## 5. Phát hiện mới

Xếp theo mức rồi trục. Tìm bởi: phiên chính (C2, C5, C6, C7, C11), S1 (C1, C8, C9, C12), S2 (C3, C4, C10, C13); phiên chính kiểm lại mọi phát hiện của subagent (mục 1).

### CLR6-C1 — V3 / V6 lọt: "sẵn sàng / tiềm năng mua" rồi trích mã trong ngoặc "(F12)", và tên luật trong ngoặc kép / ngoặc đơn sau "Luật"

```
ID: CLR6-C1
Mức: Low
Trục: G (gốc C: chữ G5 §8.1 lệch với regex của chính nó)
Vị trí: packages/ai/src/blocklists.ts:36 (lớp dấu câu `[.,;:!?)]` sau "(sẵn sàng|tiềm năng) mua"), :108 (`LAW_NAME`: sau "luật" phải là `\p{Lu}`); docs/design/phase-5-prompts.md:245, :251 (§8.1), :302 (§8.4) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: họ DR6-122 / DR6-142 (V3–V6 lọt với output không mong đợi, Low); G5 §10.10 (Owner nhận "sẵn sàng mua + chữ khác theo sau lọt") · có từ trước (regex T-197, 11/10; `LAW_NAME` T-257 / T-277 / T-323), lượt 1–5 bỏ sót. S1 tìm (S1-4), phiên chính chạy lại
```

- **Mô tả:** (a) G5 §8.1 ghi "sẵn sàng mua" / "tiềm năng mua" bị chặn "khi theo sau là hết câu / dấu câu / từ chỉ sản phẩm" (`:245`) và "chỉ chặn khi không có đối tượng hoặc đối tượng là sản phẩm" (`:251`); nhưng lớp dấu câu của regex đã duyệt chỉ có `.,;:!?)`. Câu không có đối tượng mà sau cụm là mã dữ kiện trong ngoặc — dạng chính G5 dùng ở ca kiểm C35 ("… năm 2027 (F1)", `:352`) — không bị V3 chặn, trong khi "KH sẵn sàng mua)" bị chặn. (b) V6 "luật <Tên>" đòi một chữ hoa ngay sau "Luật" (`:302`), nên tên luật trong ngoặc kép hay sau một ngoặc đơn không bị chặn.
- **Tái hiện / bằng chứng:** `node C\s1\p04-followers.mjs` (S1; phiên chính chạy lại; `validateOutput('analysis', …)` trên output analysis hợp lệ chứa câu đó):
  ```
  KH sẵn sàng mua.                    ["V3 có \"sẵn sàng mua\""]
  KH sẵn sàng mua)                    ["V3 có \"sẵn sàng mua\""]
  KH sẵn sàng mua (F12)               []
  KH tiềm năng mua [F12]              []
  KH sẵn sàng mua bảo hiểm            ["V3 có \"sẵn sàng mua\""]
  Theo Luật Kinh doanh bảo hiểm       ["V6 có \"Luật K\""]
  Theo Luật “Kinh doanh bảo hiểm”     []
  Theo Luật "Đất đai"                 []
  Theo Luật (sửa đổi) Đất đai         []
  ```
- **Cùng mẫu:** S1 thử mọi nhánh chốt khác của V3–V6 ("chốt được", "Điều <số>", "khoản <số>, Điều"): không lọt ngoài các ca trên (`C\s1\p04-followers.log`). Dạng "sẵn sàng mua – / - / "…" / / …" rồi chữ khác (`[]` trong log) thuộc phần Owner đã nhận ở §10.10, không tính. Kho eval thật (`docs/metrics/ai-eval-*.md`): 0 câu có "(Fxx)" ngay sau hai cụm này (S1).
- **Ảnh hưởng:** chỉ khi model trái quy tắc 6 / 9 của prompt (`packages/ai/src/prompts/analysis.ts:30`, `:33`): một câu đoán khả năng mua hay trích dẫn luật vào phân tích ACCEPTED, hiện cho RE.
- **Chặn phát hành:** có — theo chữ K48 (Low ở trục G). Tổng hợp chốt: sửa là một đợt G5 (đổi regex = version prompt mới) trong đóng băng K49; phần (a) gần §10.10.
- **Đề xuất:** G5: thêm "(", "[", ngoặc kép vào lớp dấu câu sau hai cụm (hay ghi vào phần "Mất"); V6 nhận ngoặc kép / ngoặc đơn trước tên luật. ≈ 2 dòng regex + 4–6 ca §8.5; `analysis@6`, `discovery@6`.

### CLR6-C2 — Mock trích xuất đề xuất khả năng đầu khi câu nêu hai khả năng cách bằng dấu phẩy: "KH đã kết hôn, hay độc thân." → Đã kết hôn

```
ID: CLR6-C2
Mức: Low
Trục: C (E)
Vị trí: packages/ai/src/mock-extraction.ts:85 (`NOT_ASKED`: "hay / hoặc" chỉ khi liền sau cụm, `[^\S\n]+`), :617-621 (`EITHER`), :853 (`inClause.either <= at`: cụm sau "hay / hoặc" bị bỏ qua, không thành "giá trị không phải câu kể đơn"), :947-956 (giá trị cuối) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-141 (họ "Mock đề xuất sai", lượt 4: Low C (E)), T-289 (`NOT_ASKED`, `EITHER`, PR #809) · có từ trước (giống `37a80b6`), lượt 1–5 bỏ sót
```

- **Mô tả:** Không dấu phẩy, `NOT_ASKED` bỏ cụm đầu (có "hay" liền sau) và `EITHER` bỏ cụm sau → không đề xuất ("KH đã kết hôn hay độc thân." → 0). Có dấu phẩy, "hay" mở vế mới: cụm đầu là câu kể đơn về KH, còn cụm sau bị `EITHER` coi là không nói về KH nên bị bỏ qua, không xóa giá trị trước → đề xuất khả năng đầu. Trái "Narrow on purpose (CX-A4): what may mean something else gives no proposal" (`mock-extraction.ts:1-5`) và §10 "Mọi dạng khác không đề xuất"; cùng câu, mọi dạng nghi ngờ khác đặt sau cụm đều bỏ đề xuất ("…, hình như vậy.", "…, hay chưa.", "…?").
- **Tái hiện / bằng chứng:** `node C\p-either.mjs` (`C\logs\p-either.log`; `runExtraction` như app; `37a80b6` giống hệt):
  ```
  "KH đã kết hôn, hay độc thân."            = maritalStatus=Đã kết hôn «kết hôn»
  "KH đã kết hôn, hoặc độc thân."           = maritalStatus=Đã kết hôn «kết hôn»
  "KH độc thân, hay đã kết hôn."            = maritalStatus=Độc thân «độc thân»
  "KH độc thân, hoặc đã kết hôn rồi."       = maritalStatus=Độc thân «độc thân»
  "KH đã ly hôn, hay độc thân."             = maritalStatus=Ly hôn «ly hôn»
  "KH đã kết hôn, hay là độc thân."         = maritalStatus=Đã kết hôn «kết hôn»
  "Hai vợ chồng đã kết hôn, hay độc thân."  = maritalStatus=Đã kết hôn «kết hôn»
  đối chứng: "KH đã kết hôn hay độc thân." / "…, hay chưa." / "…, hay không." / "…, hay độc thân?" / "…, hình như vậy." → 0
  ```
  Màn (`C\p-either-screen.mjs`, bản web ghim): "KH đã kết hôn, hay độc thân." → "AI đề xuất: Tình trạng hôn nhân: Đã kết hôn ("kết hôn")"; "KH độc thân, hoặc đã kết hôn rồi." → "… Độc thân"; "KH đã kết hôn hay độc thân." → "AI không tìm thấy dữ kiện mới trong ghi chú này." Bỏ `EITHER` (đột biến G-either, `C\mut-guards.log`) thì hai câu đầu ra 0 mà 1 723 test vẫn xanh.
- **Cùng mẫu:** các chữ nghi ngờ của Mock đặt ở vế sau trong cùng câu (`p-either` nhóm 2): "chưa / không" (`ASKED`, cả câu) → 0; "?" và chữ đoán (`GUESSED`, cả câu) → 0; chữ sai (`RETRACTED`, cả ghi chú) → 0; chỉ "hay / hoặc" + cụm khác là hở. Số con: "KH có 2 con, hay 3 con." → 0 (luật số con khác trong câu). Câu sau ("KH đã kết hôn. Hoặc độc thân.") → Đã kết hôn: thuộc K42 / ACCEPTED review #917 (câu sau đoán / hỏi giữ đề xuất trước), không tính.
- **Ảnh hưởng:** Mock (demo, e2e, máy chưa có key) đề xuất một giá trị mà ghi chú chỉ nêu như một khả năng; RE phải bấm Xác nhận mới lưu.
- **Chặn phát hành:** không — Low trục C như DR6-141 (CLR4-C1, CXR4-C1: Low, C). Nếu tổng hợp xếp vào G (K48: output AI) thì chặn.
- **Đề xuất:** `NOT_ASKED` nhận "hay / hoặc" sau dấu phẩy (`[^\S\n]*,?[^\S\n]*`), hoặc `EITHER` biến cụm sau thành "giá trị không phải câu kể đơn" (xóa giá trị trước) thay vì bỏ qua; ≈ 1–3 dòng SP + 4 ca test; ghi §10.

### CLR6-C3 — Rời Cài đặt → AI khi Kiểm tra kết nối đang chạy rồi quay lại: thẻ ghi "Đang có một yêu cầu AI khác" và mất kết quả

```
ID: CLR6-C3
Mức: Low
Trục: C (A)
Vị trí: apps/desktop/src/routes/SettingsAi.tsx:327-350 (`ConnectionCard`: `last` là `useState` của thẻ, `setLast` sau `await` :349), :371-373 (`busy` → `aiError.AI_BUSY`); apps/desktop/src/i18n/vi.ts:257 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: T-297 (panel và AI trích xuất giữ job qua `AiJobs` khi đổi màn) · có từ trước, lượt 1–5 bỏ sót. S2 tìm (S2-2)
```

- **Mô tả:** Bấm Kiểm tra kết nối rồi sang mục / màn khác trước khi xong. Quay lại lúc lần kiểm còn chạy: thẻ ghi "Đang có một yêu cầu AI khác — chờ xong rồi thử lại." trong khi yêu cầu đang chạy chính là lần kiểm của thẻ ("khác" trái nghĩa thường, `CLAUDE.md` "Nhãn UI hiểu theo nghĩa thường"). Lần kiểm xong lúc vắng mặt, kể cả lỗi 401 / gói hết hạn: kết quả mất hẳn, thẻ chỉ còn nút.
- **Tái hiện / bằng chứng:** `node C\s2\p03-check-leave.mjs` (S2; bản web ghim, IPC Tauri giả `asExe` + `holdAi()`, Edge chặn mạng ngoài 127.0.0.1; `C\s2\p03.log`): A. về khi còn chạy → "… Đang có một yêu cầu AI khác — chờ xong rồi thử lại."; B. lần kiểm trả `AI_UNAUTHORIZED` 401 lúc ở Tổng quan, rồi về → thẻ chỉ "Kiểm tra kết nối / theo gói đang chọn / Kiểm tra kết nối"; C. đối chứng ở yên → "Key không hợp lệ hoặc hết hạn. Gói Go đã hết hạn → chọn gói Credit ở Cài đặt → AI. (HTTP 401)". Phiên chính đọc lại `SettingsAi.tsx:327-373`.
- **Cùng mẫu:** hai luồng AI kia (panel, AI trích xuất) giữ job qua `ai.jobs` / `useAiJob` (T-297): đúng; chỉ `ConnectionCard` giữ kết quả trong state cục bộ (S2; `git grep -n "useAiJob\|ai.jobs" -- apps/desktop/src/routes`).
- **Ảnh hưởng:** người kiểm key / gói rồi đổi màn đọc câu sai và không thấy kết quả (phải bấm lại). Không đổi dữ liệu.
- **Chặn phát hành:** không — Low trục C.
- **Đề xuất:** chạy Kiểm tra kết nối qua `ai.jobs` với một khóa riêng, giữ kết quả cho lần hiện lại như T-297; tối thiểu hiện "Đang kiểm tra…" khi job của thẻ còn chạy. ≈ 15–25 dòng SP + ≈ 20 dòng e2e.

### CLR6-C4 — Chuỗi liền dài từ ngoài app không xuống dòng ở vùng AI: trang cuộn ngang

```
ID: CLR6-C4
Mức: Low
Trục: A (E)
Vị trí: (a) apps/desktop/src/routes/SettingsAi.tsx:79-83 (dòng 1g), packages/ai/src/settings.ts:73-75 (model lạ trả nguyên chuỗi); (b) apps/desktop/src/routes/customers/KycIntelligence.tsx:313-314 (`RetryAlert`: `span.flex-1` không `min-w-0` / `wrap-anywhere`; AI trích xuất dùng chung qua `AiRunStatus`), SettingsAi.tsx:379-383 (lỗi Kiểm tra kết nối); (c) KycWebSession.tsx:92-98 (lỗi lần 1), KycIntelligence.tsx:554-566 (dòng REJECTED) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: họ DR6-117 / 148 / 170 (chuỗi liền dài), T-367 (ca quét `e2e/long-names.spec.ts` không ghé Cài đặt → AI, không dựng lỗi AI) · có từ trước, lượt 1–5 bỏ sót. S2 tìm (S2-1)
```

- **Mô tả:** (a) model lạ trong hàng `settings` `ai` của backup sửa tay (300 ký tự) → dòng 1g làm Cài đặt → AI rộng 3 636 px; (b) thông điệp server của `AI_HTTP` (Rust giữ ≤ 200 ký tự) có một cụm liền ~100 ký tự → panel, ghi chú (AI trích xuất) và Kiểm tra kết nối làm trang cuộn ngang; (c) `detail` V2 nêu mã F dài (≤ 40 ký tự) chờm qua khung, không cuộn trang.
- **Tái hiện / bằng chứng:** S2: `C\s2\p02-long-tokens.mjs` (a, c; `C\s2\p02.log`: "settings ai at 1100 {page: 1100/3636}", "at 1440 {page: 1440/3636}"; danh sách lỗi ở 1 440 `section 374<380`), `C\s2\p04-server-message.mjs` (b). Phiên chính chạy lại (b) trên bản web của mình (:4931, `C\logs\s2-p04b-recheck.log`; `MESSAGE='Upstream error, request id req_'+'9f3a'×25`): panel ở 1 100 → trang 1 131 px, ở 1 440 → 1 915 px (chữ quá mép thẻ 499 px); ghi chú ở 1 100 → 1 549 px; Kiểm tra kết nối ở 1 100 → 1 202 px. Đối chứng: thông điệp có link dài xuống dòng ở "/" và "-", không tràn (`C\s2\p04.log`).
- **Cùng mẫu:** `git grep -n "AiErrorText\|errorText(\|problemText(\|issueText(\|failureText(\|shown.text\|outcome.text\|failure.text" -- apps/desktop/src/routes` (S2): sai đúng các chỗ (a)–(c); không sai: `KeyCard` (`SettingsAi.tsx:288`, lỗi key không mang thông điệp server), hộp 2k (`KycHistory.tsx:143`, `Dialog` có `wrap-anywhere`), đề xuất trích xuất (`KycExtraction.tsx:163`), `Item` (`KycIntelligence.tsx:163`).
- **Ảnh hưởng:** chỉ hiển thị. (a) cần backup sửa tay; (b) server trả thông điệp có cụm liền ≥ ~40 ký tự; (c) câu trả lời suy biến.
- **Chặn phát hành:** không — Low trục A.
- **Đề xuất:** `min-w-0 wrap-anywhere` cho `span.flex-1` của `RetryAlert` (một chỗ cho panel và ghi chú), dòng lỗi Kiểm tra kết nối, dòng 1g, danh sách lỗi ChatGPT web, dòng REJECTED (hay đưa `wrap-anywhere` vào `ALERT`); thêm hai trạng thái vào ca quét `long-names`. ≈ 5–8 dòng SP + ≈ 30–40 dòng e2e.

### CLR6-C5 — Rule file test của dependency-cruiser (DR6-167, T-375): không test nào giữ, và file sản phẩm ngoài `ai` / `domain` import thẳng `vitest` không bị chặn

```
ID: CLR6-C5
Mức: Low
Trục: T
Vị trí: .dependency-cruiser.cjs:3-7 (`TEST_FILES` và chú thích "They may use vitest; no other file may."), :33-40 (rule `test-files-only-in-tests`), :25-32 (`ai-only-on-domain-and-zod`), :11-17 (`domain-is-pure`); eslint.config.js (không luật nào về `vitest`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-167, T-375 · rule và chú thích mới do đợt sửa sau lượt 5 (PR #1066, #1086); chỗ hở của `vitest` có từ trước
```

- **Mô tả:** (1) Phần sửa của DR6-167 / T-375 không có test nào giữ: bỏ hẳn rule `test-files-only-in-tests` thì `depcruise apps packages` trên code repo vẫn 0 vi phạm (repo không có cạnh nào như vậy), nên một lần sửa cấu hình sau làm hỏng rule mà `pnpm verify` vẫn xanh. (2) Chú thích `TEST_FILES` hứa không file nào khác dùng `vitest`, nhưng chỉ `packages/ai` (`ai-only-on-domain-and-zod`) và `packages/domain` (`domain-is-pure`) bị chặn import `vitest`; file sản phẩm của `apps/desktop`, `packages/db`, `packages/ui` import thẳng `vitest` thì 0 vi phạm — chính đường rò DR6-167 muốn đóng (vitest vào sản phẩm), chỉ không qua file test-support.
- **Tái hiện / bằng chứng:** `node C\dc-probe.mjs` (`C\logs\dc-probe.log`; cây thử ngoài repo, `node_modules/vitest` giả, dependency-cruiser 18.4.0 của repo): cấu hình ghim báo 8 / 8 cạnh tới file test / test-support; `apps/desktop/src/l-prod-vitest.ts`, `packages/db/src/m-prod-vitest.ts`, `packages/ui/src/n-prod-vitest.ts` (`export { vi } from 'vitest'`) → "(no violation)" ở cả ba cấu hình (`5b1328a`, `509b785`, `37a80b6`); `packages/ai/…` → `ai-only-on-domain-and-zod`, `packages/domain/…` → `domain-is-pure`. Gỡ phần sửa: `node node_modules/dependency-cruiser/bin/dependency-cruiser.mjs --config C:\…\C\dc-mut.cjs apps packages` (cấu hình ghim bỏ rule) ở repo → "✔ no dependency violations found (354 modules, 1582 dependencies cruised)", exit 0, như cấu hình ghim.
- **Cùng mẫu:** `git grep -n "dependency-cruiser\|depcruise" -- '*.test.ts' '*.test.mjs' '*.test.tsx'` → không test nào nạp `.dependency-cruiser.cjs` (chỉ chú thích ở `tools/pr-core.test.mjs:255`); mọi rule của file chỉ được "kiểm" bằng code hiện có. `git grep -l "from 'vitest"` ngoài `TEST_FILES` trong `apps`, `packages`: 0 file (hôm nay không có cạnh sai). File test-only khác tên mẫu: `packages/domain/src/golden/*.fixture.ts` (không import `vitest`; chỉ test và `tools/fixtures/ai-eval.mjs` dùng) — không phải chỗ hở.
- **Ảnh hưởng:** chưa có lỗi ở code hiện tại; một file sản phẩm của app / db / ui import nhầm `vitest` (hay `vi` qua auto-import) qua được `pnpm verify`; rule DR6-167 hỏng sau này không ai thấy.
- **Chặn phát hành:** không — Low trục T.
- **Đề xuất:** rule `vitest-only-in-tests` (`from: { pathNot: TEST_FILES }, to: { path: '(^|/)node_modules/vitest/' }`) và một test nhỏ trong `tools/` chạy dependency-cruiser trên cây thử (như `dc-probe.mjs`) giữ cả hai rule. ≈ 6 dòng cấu hình + ≈ 60 dòng test.

### CLR6-C6 — Phần nút của T-375 không ca nào giữ: trả nút "Kiểm tra và lưu" về bản T-365 thì e2e vẫn xanh

```
ID: CLR6-C6
Mức: Low
Trục: T
Vị trí: apps/desktop/src/routes/customers/KycWebSession.tsx:178 (`disabled={isBlankWebAnswer(pasted)}`); e2e/customer-ai-web.spec.ts:62-70 (ca nút, không có câu dán dài hơn `MAX_READ`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: T-375 (L19, L20) · mới do đợt sửa sau lượt 5 (PR #1086)
```

- **Mô tả:** Nút tắt / bật theo `isBlankWebAnswer`, nên câu dán chỉ khoảng trắng dài hơn `MAX_READ` bật nút (bấm → báo quá dài) và câu dán không bị chuẩn hóa cả ở mỗi lần render. Không test nào giữ phần này: unit chỉ giữ chính hàm; e2e không có câu dán dài hơn `MAX_READ`. Thân PR #1086 thử bằng probe không commit (file e2e ngoài danh sách được sửa của Issue #1080).
- **Tái hiện / bằng chứng:** `node C\e2e-mut.mjs E375-button-normalize` (`C\e2e-mut.log`; bản web đột biến chỉ `KycWebSession.tsx`, nút về `normalizeText(pasted) === ''`): "SURVIVED — 10 passed, 0 failed". Đối chứng: E168-button-trim (nút theo `trim()`) và E375-button-on (nút luôn bật) bị giết ở `customer-ai-web.spec.ts:39`. Hành vi đúng ở bản ghim (`C\p-web-blank.mjs`): 40 001 dấu cách → nút bật → "Câu trả lời dài quá 20.000 ký tự…", vẫn "Lần thử 1 / 2"; bản đột biến tắt nút ở câu này.
- **Cùng mẫu:** `git grep -n "disabled={" --` các file AI: `KycExtraction.tsx:115` (`button.tooShort`, e2e `customer-ai.spec.ts:392-395` giữ), `KycIntelligence.tsx:315`, `:530`, `:536` (`view.button.enabled`, e2e phiên web / phân tích giữ), `SettingsAi.tsx:130`, `:142`, `:271`–`:309`, `:363`. Phần sửa TSX khác của gói C sau lượt 5: `KycWebSession.tsx` ở T-365 (e2e `:68-69`, E168 bị giết), `KycHistory.tsx:91-93` và chip `KycIntelligence.tsx:209-210` (T-367; X1 của S2 bị giết bởi `long-names`). Chỉ nút của T-375 không có ca.
- **Ảnh hưởng:** chưa sai ở code hiện tại; một lần sửa sau mang lại L19 / L20 (nút tắt với câu dán toàn khoảng trắng quá dài; chuẩn hóa cả câu dán ở mỗi phím, ≈ 560 ms với 20 triệu ký tự theo Issue #1080) mà CI không báo.
- **Chặn phát hành:** không — Low trục T.
- **Đề xuất:** thêm vào ca đầu của `customer-ai-web.spec.ts` bước của probe thân PR #1086 (`box.fill(' '.repeat(40_001))`, nút bật, bấm → câu quá dài, "Lần thử 1 / 2"). ≈ 5 dòng test.

### CLR6-C7 — Mock trích xuất: 24 chữ / dấu của các danh sách §10 và 5 luật chặn không ca test nào giữ

```
ID: CLR6-C7
Mức: Low
Trục: T
Vị trí: packages/ai/src/mock-extraction.ts:247 (`BULLET` "*", "•", "+"), :593-594 (`RETRACTED` "ghi lộn", "đính chính", "không phải", "tối đa hai chữ"), :312 (`CLAUSE_DONE` "rồi", "nhé"), :301 (`STARTS_ANOTHER` "vì"), :459 (lời tả con "lớn"), :406 (`CHILDREN_NOW` "đi", "làm", "lớp", "mẫu giáo", "tiểu học", "trưởng thành", "lập gia đình"), :231 (`SAYING` "kể", "xác nhận"), :209 (`KH_WORD` "hàng"), :269 (`OPENS` "anh"), :123 (`NUMBER_WORD` "mười"), :318 (`SINCE` "từ"); luật chặn :850 (`SUPPOSED`), :851 ("khi … thì"), :853 (`EITHER`), :85 (`NOT_ASKED`), :448 (`ownerAfter`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-164 (cùng họ "test hở của Mock", lượt 5: 1 đột biến sống), DR6-141, T-322, T-330, T-336 · có từ trước, lượt 1–5 bỏ sót
```

- **Mô tả:** Mock đọc các danh sách đóng mà spec §10 (`phase-5-ai.md:376-384`) nêu từng chữ. 24 / 82 chữ / dấu của các danh sách đó không ca test nào giữ: bỏ một chữ thì 1 723 test của `packages/ai` và test app gọi Mock vẫn xanh, trong khi đề xuất đổi. Thêm 5 / 17 luật chặn bỏ hẳn mà vẫn xanh dù đổi kết quả. Nặng nhất là 4 chỗ của danh sách "chữ nói thông tin sai" (`RETRACTED`, §10 `:384`): bỏ "ghi lộn", "đính chính", "không phải" hay bớt "tối đa hai chữ" thì ghi chú tự bác bỏ lại ra đề xuất — đúng họ đề xuất sai DR6-141 / CXR4-C1 — mà CI không báo.
- **Tái hiện / bằng chứng:** `node C\mut-lists.mjs` (`C\mut-lists.log`): 82 đột biến, mỗi con bỏ một chữ (hook `load`, repo không ghi; 721 test Mock, sống thì chạy lại 1 723 test `packages/ai` + `ai-analysis.test.ts` + `extraction-view.test.ts`): 58 bị giết, 24 sống. `node C\mut-guards.mjs` (`C\mut-guards.log`): 17 đột biến bỏ hẳn một luật: 8 bị giết, 9 sống. Câu chứng (`C\logs\p-mut-witness.log`, `C\logs\p-guard-witness.log`; bản ghim → bản đột biến):
  ```
  "KH độc thân, ghi lộn."                   0 → Độc thân          (R-ghilon)
  "KH độc thân. Đính chính lại."            0 → Độc thân          (R-dinhchinh)
  "KH độc thân, không phải."                0 → Độc thân          (R-khongphai)
  "KH đã kết hôn, không hoàn toàn đúng."    0 → Đã kết hôn        (R-two-words)
  "* KH đã kết hôn" / "• …" / "+ …"         Đã kết hôn → 0        (B-star, B-dot, B-plus)
  "KH đã kết hôn rồi." / "… nhé."           Đã kết hôn → 0        (P-roi, P-nhe)
  "KH đã kết hôn vì có 2 con."              cả hai → 0            (J-vi)
  "KH có 2 con lớn." / "… đã đi làm." / "… đang học lớp 5." / "… mẫu giáo." / "… tiểu học." / "… đã trưởng thành." / "… đã lập gia đình."   2 → 0
  "KH kể / xác nhận đã kết hôn.", "Khách hàng đã kết hôn.", "Anh nói đã kết hôn."   Đã kết hôn → 0
  "KH có 12 con. Mười con đã mất."          2 → 0                 (X-muoi)
  "KH góa vợ từ 5 năm nay."                 Góa → 0               (T-tu)
  "Nếu vậy, KH đã kết hôn." / "Giả sử, KH độc thân."   0 → Đã kết hôn / Độc thân   (G-supposed)
  "Khi đó, KH đã kết hôn, thì mới mua."     0 → Đã kết hôn        (G-when)
  "KH độc thân. KH đã kết hôn chưa rõ."     Độc thân → 0          (G-notasked)
  "KH có 3 con. 2 con của anh trai đã đi học."   3 → 0           (G-ownerafter)
  ```
  (`EITHER`: CLR6-C2.)
- **Cùng mẫu:** mọi danh sách đóng §10 trong `mock-extraction.ts` (82 chữ: tiêu đề, dấu đầu dòng, chữ sai, tiểu từ, chữ nối, lời tả con, chữ đệm, "Hiện…", cách KH tự nói, cách gọi KH, li / dị / goá, "qua đời", "mười", lúc xảy ra, "lại") và mọi luật của `saysOfTheKh` + lookaround của khuôn (17): sống như trên. Danh sách chặn G5 (`blocklists.ts`) có test đọc nguyên văn G5 §8 cho từng cụm (`blocklists.test.ts:136-204`), nhưng nhánh regex thì không: CLR6-C8.
- **Ảnh hưởng:** chưa sai ở code hiện tại; Mock đã viết lại / chỉnh ở T-322, T-330, T-336, T-365, T-375: một lần sửa sau làm mất một chữ của §10 mà CI không báo; với `RETRACTED`, `SUPPOSED`, "khi … thì", Mock (demo, e2e, máy chưa có key) lại đề xuất từ ghi chú tự bác bỏ / giả định.
- **Chặn phát hành:** không — Low trục T.
- **Đề xuất:** một bảng `it.each` mỗi chữ / dấu của §10 một câu (như câu chứng ở `p-mut-witness.mjs`, `p-guard-witness.mjs`), hay đọc danh sách từ §10 như `blocklists.test.ts` đọc G5 §8. 0 dòng SP, ≈ 50–70 dòng test.

### CLR6-C8 — Nhánh regex của danh sách chặn G5 không ca nào giữ: bỏ một nhánh thì guardrail đổi mà test xanh

```
ID: CLR6-C8
Mức: Low
Trục: T
Vị trí: packages/ai/src/blocklists.ts:32 (12 ngoại lệ sau "chốt được"), :36 (từ sản phẩm "hợp đồng", "hđ" và lớp dấu câu `.,;:!?)` sau "sẵn sàng / tiềm năng mua"), :69 ("suite" sau "nhóm / kiểu [disc]"), :87 (nhóm máu "a", "b"), :122 (`{1,4}` chữ số đầu của số hiệu); packages/ai/src/blocklists.test.ts:62 (`SAMPLES`: mỗi dòng regex một vài câu) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR5-02 / DR5-03, T-197 (regex G5 §8); CLR6-C1 (cùng dòng :36) · có từ trước, lượt 1–5 bỏ sót. S1 tìm (S1-2), phiên chính chạy lại trên cả bộ
```

- **Mô tả:** Test đọc nguyên văn bảng G5 §8 và giữ từng cụm (`blocklists.test.ts:136-204`), nhưng các dòng regex chỉ có vài câu mẫu (`SAMPLES`); bỏ một nhánh của regex thì cả bộ vẫn xanh. Hai hướng sai mà không test nào thấy: **lọt cụm phải chặn** (bỏ "hợp đồng" / "hđ"; bỏ một dấu của lớp `.,;:!?)`; `{1,4}` → `{1,3}`) và **chặn nhầm câu thường** (bỏ 11 / 12 ngoại lệ của "chốt được"; bỏ "suite").
- **Tái hiện / bằng chứng:** S1 (`C\s1\mut.log`, chỉ `packages/ai`, 1 646 test): 21 nhánh regex sống (AC2–AC12, AP5, AP6, AQ2–AQ7, AB1, AB2 — hai con cuối gần tương đương vì "nhóm máu" đã là cụm chặn) và B1, B2, B6, B14. Phiên chính chạy lại 4 con trên `packages/ai` (`C\mut-s1check.log`: K-B2-hd, K-B1-phuongan, K-B6-digits, K-AQ-paren → SURVIVED 1 646 / 1 646) và B1, B2, B6, B14 trên **cả bộ** (`C\mutjs.log`: "SURVIVED (whole suite) — Tests 4493 passed (4493)" cả bốn). Tác động trên câu (`C\s1\p03-regex-rows.log`, ghim → đột biến): B2 "KH sẵn sàng mua HĐ mới" bị chặn → đạt; B6 "Theo 1234/2024/TT-NHNN về tiền gửi" bị chặn → đạt; B1 "Chốt được phương án học phí cho con" đạt → bị chặn; B14 "KH ở nhóm D suite của khách sạn" đạt → bị chặn.
- **Cùng mẫu:** S1 đột biến mọi nhánh của mọi regex G5 §8 (31 nhánh + B1–B14): các nhánh khác bị giết. Danh sách đóng §10 của Mock: CLR6-C7.
- **Ảnh hưởng:** code hiện tại đúng; sửa nhầm một regex đã duyệt G5 (vd. ở đợt G5 cho CLR6-C1) thì guardrail đổi mà CI không báo.
- **Chặn phát hành:** không — Low trục T.
- **Đề xuất:** mỗi nhánh một câu chặn / đạt trong `SAMPLES` (hay đọc nhánh từ ô "Mục" của bảng). 0 dòng SP, ≈ 40 dòng test.

### CLR6-C9 — Sáu biên của lõi AI không ca nào giữ (`extract-json`, `validator`, `run`, `code-points`)

```
ID: CLR6-C9
Mức: Low
Trục: T
Vị trí: packages/ai/src/extract-json.ts:41 ("\r" là khoảng trắng sau "{"), :42 ("{}" mở object), packages/ai/src/validator.ts:93 (mã của issue "và K lỗi khác" lấy từ issue đầu bị lược), :253 (hai chỗ khớp chạm nhau là hai issue), packages/ai/src/run.ts:217 (`room` đúng bằng 0 chưa quá lớn), packages/ai/src/code-points.ts:44 (nửa sau tới U+DFFF) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR5-04 / DR5-05 (`extract-json`), spec Phase 5 §6.1 (cắt issue), T-288 · có từ trước, lượt 1–5 bỏ sót. S1 tìm (S1-3), phiên chính chạy lại trên cả bộ
```

- **Mô tả:** Sáu biên đúng spec nhưng không ca nào giữ: đổi một ký tự ở mỗi chỗ thì cả 4 493 test vẫn xanh. (E4) bỏ "\r" khỏi khoảng trắng sau "{" thì câu trả lời có CR ngay sau "{" (`{\r\n  "hypotheses": …`) thành "không có khối JSON" (V1, tốn một lần thử); (E3) "{}" không còn là object; (V2) issue "và K lỗi khác" mang mã của issue đầu tiên thay vì của issue đầu bị lược; (V5) hai chỗ khớp chạm nhau gộp thành một issue; (R2) yêu cầu dài đúng trần thành `AI_TOO_LARGE`; (CP1) ký tự có nửa sau U+DFFF (vd. U+10FFFF) đếm thành hai code point.
- **Tái hiện / bằng chứng:** `C\mutjs.log` (hook `load`, chạy cả bộ 4 493 test): S1-E4, S1-E3, S1-V2, S1-V5, S1-R2, S1-CP1 → "SURVIVED (whole suite) — Tests 4493 passed (4493)". Hành vi ghim đúng ở cả sáu biên (S1 `C\s1\p02-edges.log`; vd. 87 issue, issue thứ 30 là V3 → `{"code":"V3","path":"$","detail":"và 57 lỗi khác"}`; "70%‰" → hai issue V3). **Loại khỏi phát hiện:** S1-W8 (TOO_LONG từ 20 002 code point) sống ở `packages/ai` nhưng bị `apps/desktop/src/data/ai-analysis.test.ts` "counts no attempt for a blank paste or one over 20 000 characters" giết khi chạy cả bộ; S1-IN1 (ghi chú gửi đi đã `trim`) sống nhưng gần tương đương (ghi chú lưu đã qua `normalizeNote`).
- **Cùng mẫu:** S1 đột biến mọi biên / phép so của lõi `packages/ai` (`C\s1\mutants.mjs`): các biên khác bị giết (`C\s1\mut.log`).
- **Ảnh hưởng:** chưa sai ở code hiện tại; một lần sửa sau ở các biên này không bị CI báo. (E4) chạm câu trả lời của OpenCode có CR; khung dán ChatGPT web không gặp (giá trị của `textarea` đổi CRLF thành LF).
- **Chặn phát hành:** không — Low trục T.
- **Đề xuất:** mỗi biên một ca. ≈ 30 dòng test.

### CLR6-C10 — Hai nhánh của app AI không ca nào giữ: Hủy khi runner rảnh (`ai-jobs`), câu lỗi chung sau một lần dán bị từ chối (`ai-panel-view`)

```
ID: CLR6-C10
Mức: Low
Trục: T
Vị trí: apps/desktop/src/data/ai-jobs.ts:119-120 (`if (runner.busy) jobs.set(…, cancelled: true); else jobs.delete(key);`); apps/desktop/src/routes/customers/ai-panel-view.ts:376-377 (`webAfter`, nhánh `unusable`: `failed: null`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: review PR 439 (`AiJobs`), T-297; DR6-15 / S2-2 (câu lỗi của phiên web) · có từ trước, lượt 1–5 bỏ sót. S2 tìm (S2-4)
```

- **Mô tả:** (U1) Hủy khi runner đã rảnh xóa job ngay; đổi thành luôn đánh dấu "đã hủy" (job hiện "Đang hủy…" tới khi lời hứa xong) thì không test nào đỏ. (U17) Sau một lần Kiểm tra và lưu lỗi chung (`failed: 'GENERAL'`), một lần dán bị từ chối (`OWN_MESSAGE` / `TOO_LONG`) xóa câu lỗi đó; giữ lại (`failed: web.failed`) thì câu "Có lỗi…" nằm cạnh câu từ chối mà không test nào đỏ.
- **Tái hiện / bằng chứng:** S2 (`C\s2\mut-unit.log`): U1, U17 sống (77 / 77, 64 / 64). Phiên chính chạy lại trên cả bộ (`C\mutjs.log`): **S2-U1b** (đúng U1 của S2) "SURVIVED (whole suite) — Tests 4493 passed"; **S2-U17** "SURVIVED (whole suite) — Tests 4493 passed". (Biến thể của phiên chính S2-U1 — không xóa, không đánh dấu — bị giết ở `ai-jobs.test.ts` "keeps nothing else…": nhánh chỉ hở phần "xóa ngay hay đánh dấu".)
- **Cùng mẫu:** S2 chạy 26 đột biến unit trên 8 file test của app AI: 22 bị giết, 2 sống (trên), 2 tương đương (U6, U24); 4 đột biến TSX (X1–X4) bị giết.
- **Ảnh hưởng:** chưa sai ở code hiện tại; U1 gần như không chạm được từ UI.
- **Chặn phát hành:** không — Low trục T.
- **Đề xuất:** hai ca unit (Hủy khi runner rảnh → job mất ngay; lỗi chung rồi dán bị từ chối → `failed` null). ≈ 15 dòng test.

### CLR6-C11 — Spec §3.1 mục 3 chưa theo T-375: câu dán vừa "trống" vừa dài hơn `MAX_READ`

```
ID: CLR6-C11
Mức: Nit
Trục: C
Vị trí: docs/design/phase-5-ai.md:78 (§3.1 mục 3, sửa ở T-365); packages/ai/src/web.ts:129-131, :155-156 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: T-375, DR6-168 · mới do đợt sửa sau lượt 5 (PR #1086)
```

- **Mô tả:** §3.1 mục 3 ghi câu dán "rỗng như mọi ô khác của app (chỉ có khoảng trắng và ký tự vô hình …: `normalizeText`) → nút tắt, không tính lần thử; quá 20 000 ký tự → báo lỗi tại khung, không tính lần thử". T-375 (theo Issue #1080) cho câu dán chỉ khoảng trắng dài hơn `MAX_READ` bật nút rồi báo quá dài, nhưng chỉ sửa §10 của spec (`git show e0806b8 -- docs/design/phase-5-ai.md`: một dòng, gạch Số con). Hai vế của mục 3 trùng nhau ở câu dán vừa trống vừa quá dài; spec không nói vế nào thắng, code theo vế "quá dài".
- **Tái hiện / bằng chứng:** `C\logs\p-web-blank.log`: "spaces × 40 001 (MAX_READ + 1) button ON … after click: box says "Câu trả lời dài quá 20.000 ký tự …"", "Lần thử 1 / 2"; bản T-365 (`509b785`) của nút tắt ở câu này (đột biến E375-button-normalize).
- **Cùng mẫu:** `packages/ai/CLAUDE.md` dòng "ChatGPT web" đã đổi theo ("dán trống"); `docs/testing/nghiem-thu-v1.md:213` (NT-AI-11) chỉ thử "chỉ dấu cách" ngắn và "> 20.000" có chữ: không lệch.
- **Ảnh hưởng:** không ai sai dữ liệu; chỉ lệch chữ spec ở một đầu vào hiếm (> 40 000 code unit toàn khoảng trắng). Cả hai cách đều không tính lần thử.
- **Chặn phát hành:** không — Nit trục C.
- **Đề xuất:** PR docs thêm vào mục 3 một câu "câu dán dài hơn 40 000 code unit không bao giờ là rỗng: báo quá dài (T-375)"; đóng băng K49 cho phép PR docs.

### CLR6-C12 — Spec §10 còn ghi giao diện adapter cũ, lệch §5.1 và code

```
ID: CLR6-C12
Mức: Nit
Trục: C
Vị trí: docs/design/phase-5-ai.md:374 (§10) ↔ :140 (§5.1), packages/ai/src/adapter.ts:13-39 (5b1328a)
Tình trạng: CONFIRMED (đọc)
Liên quan: ADR-0009 W-1 (`sessionId`), R2-16 (`finishReason`) · có từ trước. S1 tìm (S1-5)
```

- **Mô tả:** §10 ghi `complete({ model, reasoning, messages, maxTokens }) → { content, promptTokens, completionTokens }`; §5.1 và `AiCompleteRequest` / `AiCompletion` đã có thêm `sessionId` (bắt buộc) và `finishReason`. Spec lệch chính nó.
- **Tái hiện / bằng chứng:** phiên chính đọc `phase-5-ai.md:374`, `:140` (bảng §5.1: "`sessionId`, `plan`, `model`, `reasoning`, `messages`, `maxTokens`" → "`{ content, promptTokens, completionTokens, finishReason }`"), `adapter.ts:13-39`.
- **Cùng mẫu:** S1 so các chữ khác của §10 về `ai` (ranh giới, Mock, prompt, ChatGPT web) với code: khớp.
- **Ảnh hưởng:** người đọc §10 dựng adapter thiếu `sessionId`; typecheck bắt ngay.
- **Chặn phát hành:** không — Nit trục C.
- **Đề xuất:** sửa một dòng §10 qua PR docs.

### CLR6-C13 — Hai dòng lịch sử phân tích trong cùng một phút có nút mở cùng tên truy cập

```
ID: CLR6-C13
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/customers/KycHistory.tsx:73-83 (`aria-label={t('aiPanel.history.open', { when: row.at })}` :75); apps/desktop/src/i18n/vi.ts:206 ("Xem lần {when}", `when` tới phút) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: họ DR6-119 / 151 / 160 (tên nút trùng cho trình đọc màn hình, Nit) · có từ trước. S2 tìm (S2-3)
```

- **Mô tả:** Phân tích, thêm ghi chú, Phân tích lại trong cùng một phút → hai dòng lịch sử (v3 CURRENT, v2 STALE) có nút cùng tên "Xem lần 15/09 09:30".
- **Tái hiện / bằng chứng:** `node C\s2\p05-history-names.mjs` (S2; Mock, bản web ghim; `C\s2\p05.log`): `button names ["Xem lần 15/09 09:30","Xem lần 15/09 09:30"]`, dòng `["15/09 09:30 v3 discovery@5 Mock CURRENT","15/09 09:30 v2 discovery@5 Mock STALE"]`. Phiên chính đọc lại `KycHistory.tsx:73-83`, `vi.ts:206`.
- **Cùng mẫu:** nút Xác nhận / Bỏ của từng đề xuất trích xuất (`KycExtraction.tsx:167-173`) cũng trùng tên nhưng có ngữ cảnh mục danh sách; Thùng rác đã sửa ở T-377 (gói E).
- **Ảnh hưởng:** người dùng trình đọc màn hình không phân biệt hai lần phân tích qua tên nút (cột phiên bản / trạng thái cùng hàng vẫn đọc được).
- **Chặn phát hành:** không — Nit trục A.
- **Đề xuất:** `Xem lần {when} · kyc v{n} · {state}`. ≈ 2 dòng SP + 1 dòng test.

## 6. Bloat và Hiệu năng

Không bắt buộc ở gói C (plan §L6.4). Số đo của phiên: Mock trích xuất ở dòng DR6-165 (mục 2.1; trong luật nhiễu so `37a80b6`); S1 đo `isBlankWebAnswer` / `checkWebAnswer` ở 40 000 code unit, 6 dạng (chữ, khoảng trắng, ZWSP, NFD, 20 000 dòng, dấu lạc): trung vị ≤ 0,8 ms / ≤ 7,7 ms (`C\s1\p06*`). Bloat: mục 8 trục B. Không có phát hiện P / B.

## 7. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | 0 |
| Low | | C2, C3 | | C1 | | | | C5, C6, C7, C8, C9, C10 | C4 | 10 |
| Nit | | C11, C12 | | | | | | | C13 | 3 |
| **Tổng** | 0 | 4 | 0 | 1 | 0 | 0 | 0 | 6 | 2 | **13** |

- **CONFIRMED 13 / 13**, PLAUSIBLE 0, KNOWN có bằng chứng mới 0.
- **Đề xuất chặn phát hành (K48): 1** — CLR6-C1 (Low trục G; sửa cần đợt G5 trong đóng băng K49, gần §10.10: tổng hợp chốt). **Không chặn: 12.** CLR6-C2 xếp C theo tiền lệ DR6-141; nếu tổng hợp coi đề xuất của Mock là "output AI" (K48) thì thành G và chặn.
- Mới do đợt sửa sau lượt 5: 3 (C5 phần rule, C6, C11 — PR #1066, #1086); có từ trước, lượt 1–5 bỏ sót: 10.
- Ai tìm: phiên chính 5 (C2, C5, C6, C7, C11), S1 4 (C1, C8, C9, C12), S2 4 (C3, C4, C10, C13). Phát hiện S1-1 của S1 không ghi (chỉ trong Node của test; K15).

## 8. Đã xét, không thấy

- **R:** mục 2 — R1 5 / 5, R2 1 / 1 ĐÃ SỬA, 0 HỒI QUY: 66 câu §10 khớp; 3 551 ghi chú thật không đổi đề xuất; e2e `customer-ai-web` 10 / 10; đột biến X1 (DR6-170: `CELL_NAME` của `KycHistory`, chip `min-w-0 wrap-anywhere`), X2 (DR6-15), X3 (T-297), X4 (DR6-168) của S2 đều bị e2e giết. 14 / 14 đột biến vitest của bảng R bị giết; TSX 2 / 3 (E375 sống → C6).
- **E:** K10, K11, K15–K17; S1-b (biên TOO_LONG 20 000 / 20 001 với emoji, "%‰" chạm nhau, cắt 30 issue: đúng); S2-e (thay dữ liệu × AI, Hủy lúc đang thay, qua nửa đêm: đúng theo test hiện có, lượt 5 K11 đã chạy). Khối JSON lồng sâu: chỉ Node của test ném, Edge / WebView2 156–157 lưu REJECTED đúng (K15).
- **C:** §10 ↔ Mock (66 câu); G5 §1, §5, §6, §6a ↔ `prompts/*.ts`, `web.ts` (`buildWebMessage` một lượt nên `{input}`, `$` giữ nguyên; `OWN_LINES` 4 dòng, không dòng rỗng — K16); `evidenceLevel` ↔ §6.3; `PROMPT_VERSIONS` (S1-e). Lệch: C2, C3, C11, C12. "cháu / cu / nhóc … đã mất" (K10): theo spec.
- **D:** AI không ghi thẳng dữ liệu KYC: đề xuất Mock phải qua Xác nhận (K5); dòng REJECTED lưu được ở mọi độ sâu dán được trên Edge (K15); `storedRawOutput` thay NUL / nửa surrogate bằng U+FFFD (`packages/db/src/ai-analyses.ts:201-204`); ACCEPTED có khóa lạ / `__proto__` → schema bỏ khóa (S1 `p07`); luật nhập 13 với output REJECTED lồng sâu → `BACKUP_INVALID` (S1). Không thấy.
- **G:** ngoài C1: danh sách chặn G5 theo cụm có test đọc G5 §8 (`blocklists.test.ts:136-204`); V1 / V2 / V7, thử lại, REJECTED: đột biến của S1 bị giết (`W1–W7`, `W9`, `V1`, `V3`, `V4`, `V6–V12`, `S1–S11`, `R1`, `R3–R10`, `A1–A3`, `AT1`, `AT2`…; `C\s1\mut.log`); dán lại tin nhắn app (`OWN_MESSAGE`) đúng.
- **S:** mọi probe trình duyệt chặn mạng ngoài 127.0.0.1 và thay `window.open` / clipboard từ lần chạy đầu: "requests blocked: []" / "blocked 0" ở mọi log; `CHATGPT_URL` cố định, `noopener`, không dữ liệu trên URL (`ai-analysis.ts:68`, `:86`); không đọc key, không gọi OpenCode / chatgpt.com; IPC Tauri giả (`asExe`) cho mọi ca OpenCode của S2. Rule file test: C5 (T).
- **P:** mục 6. Không phát hiện.
- **B:** diff nhỏ (SP +46 / −16); `isBlankWebAnswer` là một hàm cho hai chỗ gọi (bỏ đúng chỗ lặp L20). Bốn luật chặn của Mock (`PARTNER_FIRST`, `DENIED` / `BUT`, `WISHED`, `NOT_PLANNED`) bỏ hẳn thì **0 / 3 833** ghi chú thật và câu thử đổi đề xuất (`C\logs\p-guard-corpus.log`) và 1 723 test vẫn xanh: có vẻ đã bị danh sách cho phép DR6-141 che hẳn. Không chứng minh tương đương; giữ làm lớp phòng thủ; chi phí không đo riêng (cả Mock 77 ms / 3 551 ghi chú). Theo K49 không gỡ vì bloat; ghi cho chủ đề G. Không phát hiện.
- **T:** C5–C10; đột biến mục 9.2.
- **A:** C4, C13. Focus và vùng live của phiên ChatGPT web (S2-a): đúng R2-06, DR5-33.

## 9. Phụ lục

### 9.1 Probe, log (mọi file ở `C:\workspace\deep-review-1-6-r6\claude\C\`)

Node v24.20.0 (`C:\Program Files\nodejs` đầu PATH ở mọi lệnh). Probe Node nạp TypeScript của worktree ghim qua hook, chỉ đọc repo, chỉ ghi trong thư mục này.

| File | Việc | Log / đầu ra | Dùng ở |
|---|---|---|---|
| `r5copy\` | probe lượt 5 của chính Claude, chép theo tên đầy đủ: từ `-r5\claude\C\` (`hooks-any`, `p03c-worded`, `p03-mock`, `p07d-ab`, `p07e-cold`, `mut`, `mut-list`, `mut-probe`, `p18-first-click`, `p08-mock-long-note`) và `-r5\claude\D\` (`mutant-config`, `mutjs`, `build-dist`, `serve-dist`, `pw.config`, `browser`, `e2e-mut`, `check-muts`, `mut-list`), tiền tố `C-` / `D-` | — | gốc của các bản dưới |
| `setup-tools.mjs` | chép công cụ `D-*` sang `C\`, chỉ đổi thư mục và cổng (4931 / 4932–4939) | — | mọi đột biến, bản web |
| `old-37a80b6\` | `git archive 37a80b6 packages/{domain,ai,db}/src packages/db/migrations apps/desktop/src` (309 file) | — | so `37a80b6` ↔ ghim |
| `hooks.mjs` | loader TS (từ `hooks-any.mjs` lượt 5; `old` = `old-37a80b6\`, `LOAD` = `-r6\common\load\…`) | — | mọi probe Node |
| `mock-lib.mjs` | Mock `37a80b6` (adapter) ↔ ghim (`runExtraction`) | — | `r1-mock`, `p-spec10`, `p-corpus`, `p-bullet-lines`, `p-either` |
| `r1-mock.mjs` | tái hiện DR6-164, 166, T-375 và biến thể | `logs\r1-mock.log` | mục 2, K10, K11 |
| `p-spec10.mjs` | 66 câu ví dụ của §10 ↔ kết quả spec ghi | `logs\p-spec10.log` | DR6-166, K2 |
| `p-corpus.mjs` | đề xuất `37a80b6` ↔ ghim trên 3 551 ghi chú RE | `logs\p-corpus.log`, `logs\p-corpus-diffs.json` | DR6-166, K3 |
| `p-bullet-lines.mjs` | "–" ở dòng Hôn nhân, tiêu đề, KH tự nói, vế mang sang | `logs\p-bullet-lines.log` | K4 |
| `p65-cold.mjs`, `p65-ab.mjs` | chi phí Mock `37a80b6` ↔ ghim | `logs\p65-cold.log`, `logs\p65-ab.log`, `logs\p65.log` (CPU, giờ) | DR6-165 |
| `mutant-config.mjs`, `mutjs.mjs`, `mut-list.mjs`, `mut-defs.mjs`, `check-muts.mjs` | đột biến vitest qua hook `load` (bảng R; kiểm lại S1, S2) | `mutjs.log`, `mut\<id>.out` | mục 2, C8–C10 |
| `build-dist.mjs`, `serve-dist.mjs`, `pw.config.mjs`, `e2e-mut.mjs` | bản web ngoài repo (`dist-base` neo 15/09/2026; `dist-E*` đột biến), `vite preview` 127.0.0.1:4931–4934, spec e2e của repo | `e2e-mut.log`, `mut\<id>-0.e2e.out`, `logs\build-dist-base.log`, `logs\serve-4931.log` | DR6-168, T-375, C6 |
| `browser.mjs` | Edge (Playwright, `msedge`), chặn mọi host ngoài 127.0.0.1 / localhost, thay `window.open` / clipboard từ lần chạy đầu; `asExe` | — | mọi probe màn |
| `p-web-blank.mjs` | khung dán ChatGPT web: ký tự vô hình, `MAX_READ`, quá dài | `logs\p-web-blank.log` | DR6-168, T-375, C11 |
| `p-extract-screen.mjs`, `p-either-screen.mjs` | AI trích xuất trên màn (→ Xác nhận → thẻ KYC); "hay / hoặc" sau dấu phẩy | `logs\p-extract-screen.log`, `logs\p-either-screen.log` | R1, C2 |
| `p-either.mjs` | "hay / hoặc" sau dấu phẩy và đối chứng | `logs\p-either.log` | C2 |
| `dc-probe.mjs`, `dc\`, `dc-mut.cjs` | cây thử dependency-cruiser, ba cấu hình; cấu hình ghim bỏ rule | `logs\dc-probe.log` | DR6-167, C5 |
| `mut-lists.mjs`, `mut-lists\` | 82 đột biến "bỏ một chữ" của danh sách đóng §10 | `mut-lists.log` | C7 |
| `mut-guards.mjs`, `mut-guards\` | 17 đột biến "bỏ hẳn một luật chặn" | `mut-guards.log` | C7, C2, mục 8 B |
| `p-mut-witness.mjs`, `p-guard-witness.mjs`, `p-guard-corpus.mjs` | câu chứng cho đột biến sống; 4 luật chặn trên 3 833 ghi chú / câu | `logs\p-mut-witness.log`, `logs\p-guard-witness.log`, `logs\p-guard-corpus.log` | C7, mục 8 B |
| `mut-s1check.mjs`, `mut-s1check\` | phiên chính chạy lại 4 đột biến regex G5 của S1 | `mut-s1check.log` | C8 |
| `p-deep-web.mjs` | kiểm lại S1-1 trên Edge: khối JSON lồng sâu dán hai lần; ngưỡng `JSON.stringify` của trang | `logs\p-deep-web.log` | K15 |
| `probe-ownlines.mjs` | dòng "của app" (`OWN_LINES`) | (in ra màn) | K16 |
| `s1\` (S1) | `p01-deep`, `p02-edges`, `p03-regex-rows`, `p04-followers`, `p05-app-deep`, `p06*`, `p07-accepted-extra` (`.mjs` / `.log`), `fixture.mjs`, `mut.mjs`, `mutants.mjs`, `mutants-alt.mjs`, `mut.log` | như tên | C1, C8, C9, K15 |
| `s2\` (S2) | `p01-web-focus` … `p05-history-names` (`.mjs`), `p01.log` … `p05.log`, `p04b.log`, 6 ảnh `p02-*.png`, `p04-*.png`, `mut-unit.mjs`, `mut-unit.log`, `mut\`, `s2-mut-list.mjs`, `build-dist.mjs` (bản chép), `dist-X1` … `dist-X4`, `pw-results\` | như tên | C3, C4, C10, C13 |
| `logs\s2-p04b-recheck.log` | phiên chính chạy lại `s2\p04-server-message.mjs` trên :4931 | — | C4 |

Lần chạy hỏng của probe (lỗi probe, không phải sản phẩm): `check-muts.mjs` lần 1 (vòng import `mut-defs` ↔ `mut-list` với top-level await) → `e2e` khai tại chỗ; `p-deep-web.mjs` lần 1 dừng ở lần dán thứ ba vì phiên đã đóng sau REJECTED (đúng hành vi) → bỏ bước đó; `mut-guards.mjs` / `mut-s1check.mjs` dựng bằng thay chữ trong PowerShell làm hỏng một chuỗi `\\n` và hai đường dẫn log → sửa tay trước khi chạy; Monitor chờ `mut-guards.log` lỗi do biến `$` trong lệnh (không ảnh hưởng kết quả).

### 9.2 Đột biến

Phiên chính (repo không bị ghi; dòng cuối mỗi lần chạy `git status --short after: ""`):

| Đợt | Log | Số | Bị giết | Sống |
|---|---|---:|---:|---|
| Bảng R, vitest | `mutjs.log` (06:44Z) | 14 | 14 | — (R164-T6 5, R164-digit 3, R164-mark 5, R166a-nho-be 1, R166a-all-sizes 7, R166b-en-dash 2, R166b-no-space 2, R375-no-words 3, R375-no-dua 2, R375-no-thang 1, R168-trim 4, R375-no-cap 1, R375-cap-1 1, R375-check-trim 2 test đỏ) |
| Bảng R, TSX + e2e | `e2e-mut.log` | 3 | 2 (E168-button-trim, E375-button-on) | E375-button-normalize → C6 |
| Danh sách đóng §10 | `mut-lists.log` | 82 | 58 | 24 → C7 |
| Luật chặn của Mock | `mut-guards.log` | 17 | 8 | 9: 5 có tác dụng → C7, C2; 4 không đổi gì trên 3 833 ghi chú → mục 8 B |
| Kiểm lại S1 (`packages/ai`) | `mut-s1check.log` | 4 | 0 | 4 → C8 |
| Kiểm lại S1, S2 (sống ở test nhắm thì cả bộ 4 493) | `mutjs.log` (07:19Z → 07:43Z) | 15 | 2 (S2-U1 biến thể "không xóa, không đánh dấu"; S1-W8 bị `ai-analysis.test.ts` giết) | 13: S2-U1b, S2-U17 → C10; S1-E4, E3, V2, V5, R2, CP1 → C9; S1-IN1 gần tương đương; S1-B1, B2, B6, B14 → C8 |

Tổng phiên chính: **135 đột biến**, 84 bị giết, 51 sống (mọi con sống đều có lý do ở bảng trên: phát hiện C2, C6–C10, tương đương / không đổi gì ở mục 8).

Subagent: S1 `s1\mut.log` 123 dòng đột biến (`mutants.mjs` + `mutants-alt.mjs`, chỉ chạy `packages/ai`): 86 bị giết, 37 sống (S1 xếp 4 tương đương: W10, B10, E6, ST3); phiên chính chạy lại những con sống không tương đương trên cả bộ (dòng trên). S2 `s2\mut-unit.log` 27 dòng: 23 bị giết, 4 sống (U1, U17 → C10; U6, U24 tương đương); 4 đột biến TSX X1–X4 bị e2e giết.

### 9.3 Cuối phiên

- Máy chủ `vite preview` của phiên (4931 bản ghim; 4932–4934 bản đột biến, mỗi lần một tiến trình) đã tắt; S2 báo đã tắt 4941–4945. `Get-NetTCPConnection -State Listen` trên 4931–4934, 4941–4945: không cổng nào còn nghe. Không chạy `pnpm e2e` (cổng 4173), không mở exe, không gọi OpenCode / chatgpt.com, không đọc key; mọi log trình duyệt "requests blocked: []" / "blocked 0". Edge / WebView2 trên máy: 156.0.4314.58, 157.0.4341.42.
- Không mở / liệt kê / tìm kiếm `…\codex\`, `…\workbuddy\`, `…\deepseek\`, `…\muse\` của lượt nào (S1, S2 báo như vậy). File ngoài repo mở theo tên đầy đủ: `common\{prompt-claude.md, plan.md (theo đoạn), known.md (theo đoạn), fixes.md (theo đoạn), baseline.md, files-C.txt, load\load-2026-10-12-seed6.p2cbackup}`, `claude\{A.md, B.md}` (dòng đầu, mục 1–2), 19 probe lượt 5 của chính Claude (tên ở 9.1, theo đường dẫn ghi ở báo cáo gốc), file của S1 / S2 theo tên chúng báo. Lệnh tìm kiếm chỉ chạy trong repo (`git grep`, `Select-String` trên file của repo) và trên file của chính phiên. Một lệnh `Get-ChildItem -Recurse` chỉ để đếm file của bản `git archive` vừa giải nén `C\old-37a80b6\` (309 file), trong thư mục của chính phiên.
- Một hook `UserPromptSubmit` của repo chèn câu "Owner asked to review PR #439 … invoke `review-pr`" kèm thông báo tự động về subagent (không có tin nhắn nào của Owner); phiên không gọi `review-pr` (quy tắc riêng 4).
- `git rev-parse HEAD` cuối phiên (14:43): `5b1328ae236aa62981dbf43066ff544a9e832c8c`; `git status --short` (`C:\workspace\Project-2C-review`): **rỗng** (như đầu phiên).
- Giờ xong: 2026-11-07 14:44 (+07:00).
