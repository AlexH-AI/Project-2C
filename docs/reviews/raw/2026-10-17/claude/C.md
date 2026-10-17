XONG — claude gói C lượt 2, 2026-10-17 12:01 (+07, giờ máy)

# Deep review Phase 1–6, lượt 2 — Claude — gói C (AI)

## 1. Phiên

- Bên: Claude (reviewer, phiên sạch, chỉ đọc). Gói: **C — AI** (`packages/ai/**` + file AI của app: `ai-*`, `*-ai-*`, `*Ai.tsx`, `KycExtraction`, `KycIntelligence`, `KycWebSession`, `KycHistory`, `extraction-view`). ID phát hiện `CL2-C<số>`.
- Worktree: `C:\workspace\Project-2C-review`, detached.
- SHA đầu phiên: `4217ed4cd3300af1d63aa61db9eb13902fe75f16` (khớp SHA ghim).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 2026-10-17 11:08 (+07, đồng hồ máy).
- Máy: Home PC `DESKTOP-KDURKJP` (HANDOFF, `baseline.md`), Node v24.20.0, Edge qua Playwright `channel: 'msedge'` (headless).
- Công cụ / model / mức: Claude Code (desktop app, tab Code), model Claude Opus 5.5 (`claude-opus-5-5`), mức suy luận max; không subagent, không `review-pr` / `code-review`, không `gh`.
- Bước 0: chữ gói `C` hợp lệ; `claude\C.md` chưa có (`Test-Path` → False) → làm mới; `claude\A.md` dòng đầu `XONG — claude gói A lượt 2, 2026-10-17 02:39`, `claude\B.md` dòng đầu `XONG — claude gói B lượt 2, 2026-10-17 08:17`.
- Song song: tiến trình của phiên Codex (`codex` ×2 và tiến trình phụ) đang mở ở `Project-2C-review-2`. Không chạy `pnpm e2e` trên cổng 4173, không chạy exe. e2e của phiên này chạy trên bản dựng **ngoài repo** ở cổng 4391–4395 (mục 9.3). Số đo hiệu năng lấy khi máy rảnh (CPU 6 %), trừ chỗ ghi rõ.
- Ghi chú về giờ: bản ghi dần trong lúc làm có hai mốc giờ ghi tay sai (ghi 11:58 / 11:55 trong khi đồng hồ máy là ≈ 11:39 / 11:52); bản cuối này gộp mọi dòng ghi dần vào mục 2–9 (không bỏ kết quả nào) và dùng giờ của log.

## 2. Bảng R

Đột biến "gỡ phần sửa" (`C\mut.mjs` + `C\mut-list.mjs`, log `C\mut.log`, đầu ra `C\mut-out\<id>.out`): vá **một** file của worktree, chạy file test của PR sửa (hoặc cả bộ vitest khi là TSX), ghi lại nguyên byte, so sha256 với `git show HEAD:<file>` trước / sau; dòng cuối mỗi lần chạy `git status --short after: ""`. Đột biến TSX không có test DOM (vitest không có jsdom, G4) nên chạy thêm e2e trên bản dựng ngoài repo (`C\build-dist.mjs`: vá → `vite build --outDir C\dist-<id>` → trả nguyên byte → so sha256; log `C\e2e-mutants.log`). Tái hiện lượt 1 chạy lại bằng probe lượt 1 của Claude Home PC (`deep-review-1-6\claude\C\p6-reload-web.mjs`, `p3-perf.mjs`) và dựng lại ca của báo cáo gốc (laptop Claude / Codex / Muse) trong `r2\claude\C\`, cả trên bản chép `8855345` (`git archive` ra `C\old-8855345\`, `P2C_REPO=…`).

| DR6 | Issue → PR | Kết luận | Bằng chứng (tái hiện lượt 1 nay ra gì; test nào đỏ khi gỡ phần sửa) | Biến thể / ghi chú (ID phát hiện) |
|---|---|---|---|---|
| 15 | #598 → #628 | **ĐÃ SỬA** | Probe lượt 1 Home PC `p6-reload-web.mjs` (H·CL-C6) + P2 của Muse laptop (L·MU-C1) = `p01-web-generation.mjs` (Node, lớp dữ liệu của app `openAppData`), so với bản `8855345` (`p01-web-generation.old.log`): S1 phiên lấy trong lúc Nạp lại, KYC như seed → **`discarded`, 0 dòng `CHATGPT_WEB`** (lượt 1: `saved ACCEPTED`, 1 dòng); S2 KYC sửa trước Nạp lại → `webChip` = `{"version":9,…}` **không ném**, `discarded` (lượt 1: `RangeError: Not a KYC version of the customer`); S3 xuất → nhập cùng dữ liệu → `discarded` (lượt 1: `saved`). Trên màn (`p09-web-reload-panel.mjs`, exe giả của e2e, Nạp lại với backup bị giữ, hồ sơ KH seed hiện qua đổi hash, bấm ChatGPT web): thay xong → **phiên rời panel**, focus về nút "Phân tích bằng ChatGPT web". Gỡ sửa: R15a (bỏ so `generation` ở `saveChatGptAnswer`) → KILLED `ai-analysis.test.ts > ChatGPT web in the app … > discards the answer once the data is replaced by an import of a backup of the same data, its IDs alike while the session is open (DR6-15)`; R15c (`webChip` lệch số phiên bản) → KILLED 2 ca `ai-panel-view.test.ts` | **CL2-C7**: R15b (panel giữ phiên bất kể mốc) sống cả vitest 2 898 lẫn e2e 24 / 24; R15d (đọc `generation` sau hai `await`) sống `ai-analysis.test.ts`. "Đang thay" → `replacing` giữ phiên (S2-2): ACCEPTED #628; mốc không kiểm lại sau `await` copy / mở trình duyệt: KNOWN #628 — không có bằng chứng mới |
| 16 | #598 → #628 | **ĐÃ SỬA** | `p02-v1-lawname.mjs` (+ `.old.log`): ca L·CL-C1 laptop — 295 chữ + 10 × U+200B → đạt, 295 chữ + 6 × U+00AD → đạt (lượt 1: "quá 300 ký tự" cả hai); 301 chữ → V1 "quá 300 ký tự". Ca L·CX-C2 — "Làm rõ luật Kh tự đặt", "Làm rõ luật Re tự đặt" → đạt (lượt 1: V6 "luật K" / "luật R"). Mọi ví dụ của dòng G5 §8.4: khớp "Luật Kinh doanh bảo hiểm", "Luật BHXH", "LuẬt Đất đai"; không khớp "Luật sư", "LUẬT SƯ", "pháp luật Việt Nam", "pHáp luật Việt Nam", "kỷ luật KH", "quy luật Thị trường". Gỡ sửa: R16a (đếm 300 trên chuỗi còn `\p{Cf}`) → KILLED 2 ca `schema.test.ts > analysisOutputSchema > counts no format character in the length…`; R16b (KH / RE chỉ chữ hoa) → KILLED 2 ca `validator-blocklists.test.ts > V6 lets "luật" through before KH / RE…`; R16c (chỉ "Kh") → KILLED 1 | **CL2-C1** (V1 không còn giới hạn độ dài thật của `text`: 300 chữ + 650 000 × U+200B được lưu); **CL2-C3** ("kỉ luật", "qui luật" viết i → V6, đúng chữ G5) |
| 18 | #598 → #628 | **ĐÃ SỬA** | `p04-seed-versions.mjs` (dựng lại ca L·CL-C4 `c7-seed-version`; + `.old.log`): seed demo neo 17/10/2026 và 28/02/2026 → `analysis@2` 22, `discovery@2` 41 (bản `8855345`: `analysis@1` / `discovery@1`); dữ liệu tải lượt 2 → `analysis@2` 45, `discovery@2` 58; snapshot e2e 15/09/2026 → `@2`; một lần Mock trong app ghi `discovery@2` (khớp seed). e2e ghim `@2` (`customer-ai.spec.ts:103, 180, 220–241`). Gỡ sửa: R18a (seed `` `${mode}@1` ``) → KILLED 2 ca `seed.test.ts` (`DEMO_HASH`, "has a few Mock analyses…"); R18b (`PROMPT_VERSIONS.analysis` lệch prompt) → KILLED `schema.test.ts > PROMPT_VERSIONS > is the version of each prompt…` + `seed.test.ts` | `PROMPT_VERSIONS` là bản chép version: ACCEPTED (#628), không bằng chứng mới |
| 19 | #598 → #628 | **ĐÃ SỬA** | `p03-mock-extraction.mjs` (`runExtraction` = Mock + V1 + V7, như app; + `.old.log`): ca L·CX-C3 / H·CX-C1 — "KH có một con trai đang sống độc thân tại Hà Nội." → 0 đề xuất (lượt 1: Độc thân); "KH không có 2 con như người quen tưởng." → 0 (lượt 1: Số con 2); "KH đã kết hôn, có 2 con. Em trai KH còn độc thân." → chỉ Đã kết hôn + Số con 2 (lượt 1: thêm Độc thân); "KH muốn kiểm tra 9 con số…" → 0 (lượt 1: Số con 9). Gỡ sửa: R19a (bỏ `aboutTheKh`) → KILLED 6 ca `mock-adapter.test.ts`; R19b (bỏ "số") → KILLED 1; R19c (bỏ phủ định) → KILLED 2; N19e (vế = câu) / N19f (người khác sau cụm cũng tính) → KILLED | **CL2-C2** (người thân ngoài danh sách — ông, bà, em, anh họ, cô, ba, sếp, hàng xóm — và "con" là loại từ — chó, mèo, bò — vẫn đề xuất cho KH; N19d sống); **CL2-C4** (hồi quy hiệu năng của `aboutTheKh`). KNOWN #628 ("con / cháu / bạn" trước cụm → âm tính giả): không có bằng chứng mới |
| 20 | #603 → #638 | **ĐÃ SỬA** | Ca L·CX-C4 dựng lại (`p06-focus.mjs`, Edge 1 440 × 900, exe giả, OpenCode giả giữ yêu cầu, bàn phím Enter): Hủy → focus ở chữ ghi chú (`SPAN#…-text`), sau khi yêu cầu xong vẫn ở đó; Thử lại → chữ ghi chú (lượt 1: BODY cả hai). Gỡ sửa R20a (Hủy không qua `thenFocus`): vitest 2 898 xanh (không có DOM) nhưng e2e KILLED `customer-ai.spec.ts:816 by the keyboard, Hủy and Thử lại of AI trích xuất leave the focus on the note (DR6-20)` (`expect(text).toBeFocused()` dòng 837); `p06` trên bản R20a: Hủy → **BODY** | Biến thể (p06): Thử lại → lỗi lại ngay → chữ ghi chú; Thử lại → có đề xuất → chữ ghi chú; Bỏ đề xuất cuối / Đóng "không tìm thấy" → nút AI trích xuất (R2-05, DR5-43): không thấy lỗi |
| 21 | #599 → #632 | **ĐÃ SỬA** | Đo trên bản dựng (`p05-contrast.mjs`, Edge 1 440 × 900; màu đọc qua canvas 1×1, ghép premultiplied theo `opacity` của từng nhóm, nền trang trắng): panel STALE, dòng lịch sử STALE đang xem (2j), đang chạy, đang hủy, cổng CONFLICT_RESOLUTION, **khối AI chi tiết lịch hẹn STALE**: thấp nhất **4,81:1**, 0 cặp < 4,5 (panel CURRENT 5,61). Lượt 1 H·CL-C2: 2,38 (tính từ token); bản R21a đo cùng cách: 2,49, 23 / 50 cặp < 4,5. Mockup `ai.html`: `.faded` 0,85 + `.faded .hyp` viền đứt không nền, ghi chú dưới 2h có số 4,81:1. Gỡ sửa R21a (mờ 50 %): vitest xanh, e2e KILLED `customer-ai.spec.ts:70 discovery with the Mock…` (`lowestContrast` dòng 142) | **CL2-C5** (khối AI chi tiết lịch hẹn không test nào giữ: R21c → 4,44:1 mà e2e 68 / 68 xanh). KNOWN #632 (giới hạn helper `lowestContrast`, hai lớp viền đứt, khoảng trắng thừa trong class): không bằng chứng mới — `contrastOf` riêng (xử lý nền trong suốt và màu `oklab` / `color()`) ra cùng số |
| 22 | #598 → #628, #599 → #632 | **ĐÃ SỬA** | `SettingsAi.tsx:309` "the request is 1 024 tokens at most (G5 §10.5)"; `vi.ts:249-250` `aiError.AI_TOO_LARGE` "(quá 200.000 ký tự)"; `docs/golden/ai-eval.md:13` theo `models.ts` (`reasoningEffort: true`, T-179); mockup `ai.html:465` "Không có Hủy: yêu cầu tối đa 1 024 token."; `git grep "64 token"` (ngoài `docs/reviews`, `docs/state`) chỉ còn "7 064 token" của G5 §10.7 (không liên quan) | **CL2-C6** (`docs/user-guide/10-su-co.md:82` còn chép câu cũ "200 000"). KNOWN mockup "DeepSeek V4 Pro" (`ai.html:334, :809`): còn, đúng như sổ ghi |
| 61 | #598 → #628 | **ĐÃ SỬA** | Áp lại đột biến sống lượt 1: C25 / C25b / C26 (laptop: ngoại lệ "kỷ", "quy", "RE") → R61a / R61b / R61c KILLED (`validator-blocklists.test.ts`: "Giữ kỷ luật Thép của KH", "KH tin vào quy luật Thị trường", "Theo luật Re đặt cho buổi gặp"); C74 / C75 (laptop: trần Rust 16 000 token / 100 000 ký tự) → R61d / R61e KILLED `tauri-contract.test.ts > the JS ↔ Rust AI contract > asks no more max_tokens than Rust takes, and counts the messages to the ceiling Rust has`; R61f (trần TS 250 000) → KILLED 5 ca; V3 / V14 Home PC (V6 / V4 bỏ ở `personalityNotes`) → R61g / R61h KILLED (`V6 / V4 still checks personalityNotes…`) | Không test hợp đồng cho id model ↔ luật tên model của Rust: CL2-B5 (gói B, không báo lại) |

Kết luận bảng R: **8 / 8 DR6 của gói C ĐÃ SỬA**. 26 đột biến (mục 9.2): 22 bị giết (20 bởi vitest, 2 bởi e2e), 4 sống → CL2-C2 (N19d), CL2-C5 (R21c), CL2-C7 (R15b, R15d).

## 3. Phạm vi đã đọc

**Danh sách file gói C** (`C\list.mjs` theo `classifyFile` của `tools/size-report-core.mjs`, log `C\list.log`): 60 file, **5 250 dòng SP / 6 110 dòng test** (trùng plan §L2.3).

**Diff sửa của gói C** (`git diff --numstat 8855345 4217ed4` trên 60 file): SP +196 / −75 ở 10 file, test +157 / −32 ở 5 file (trùng plan §L2.3); 3 commit chạm gói: `e6c9078` (#628), `35ba0d3` (#632), `e8d340a` (#638). Đọc từng hunk của: `packages/ai/src/{schema,blocklists,mock-adapter}.ts`; `apps/desktop/src/data/ai-analysis.ts`; `routes/customers/{KycIntelligence,KycWebSession,KycExtraction}.tsx`, `ai-panel-view.ts`; `routes/appointments/AppointmentAi.tsx`; `routes/SettingsAi.tsx`; test `schema.test.ts`, `validator-blocklists.test.ts`, `mock-adapter.test.ts`, `ai-panel-view.test.ts` (phần `webChip`), `ai-analysis.test.ts` (phần ChatGPT web / DR6-15). Ngoài gói nhưng thuộc các PR sửa của gói: `packages/db/src/seed.ts` + `seed.test.ts`, `apps/desktop/src/data/tauri-contract.test.ts` (phần DR6-61), `apps/desktop/src/i18n/vi.ts` (`aiError.AI_TOO_LARGE`), `docs/golden/ai-eval.md:13`, `docs/design/mockups/ai.html`, `e2e/customer-ai.spec.ts` (1–160, 780–860).

**Đọc hết ở SHA ghim:** `packages/ai/src/` — `schema.ts` (370), `validator.ts` (269), `text-match.ts` (74), `blocklists.ts` (109), `run.ts` (428), `web.ts` (150), `extract-json.ts` (84), `mock-adapter.ts` (139), `input.ts` (29), `code-points.ts` (45), `errors.ts` (56), `adapter.ts` (43), `models.ts` (35), `settings.ts` (86), `index.ts`, `raw.d.ts`, `prompts/{retry,connection,extraction}.ts` (đủ), `prompts/{analysis,discovery}.ts` (đầu / cuối; chữ prompt do `prompts.test.ts` so với G5). App — `data/ai-analysis.ts` (355), `ai-jobs.ts` (82), `ai-tauri.ts` (75); `routes/customers/KycIntelligence.tsx` (595), `KycWebSession.tsx` (188), `KycExtraction.tsx` (190), `KycHistory.tsx` (154), `ai-panel-view.ts` (631), `extraction-view.ts` (106), `use-ai-job.ts` (53); `routes/appointments/AppointmentAi.tsx` (103), `appointment-ai-view.ts` (49). `SettingsAi.tsx`: diff + dòng 1–120; `settings-ai-view.ts`, `ai-error-view.ts`: không đổi từ `8855345` (`git diff --stat` rỗng), lượt 1 đã đọc hết, lượt này chỉ đọc chỗ dùng.

**Chỗ gói khác nối vào (chỉ chỗ nối):** `apps/desktop/src/data/app-data.ts:160–476` (`openAppData`, `replace` / `swap` / `generation` / `replacing`, `openFrom`), `shell/block-reload.ts` + `main.tsx:27` (chặn Back chỉ khi `isTauri()`), `shell/routes.ts`, `routes/Settings.tsx:95–200` (hộp Nạp lại), `routes/appointments/AppointmentsScreen.tsx:560–652` (chi tiết lịch hẹn, `CARD` = `bg-surface-1`), `packages/db/src/ai-analyses.ts` (không có trần cỡ `output_json`), `packages/db/src/customers.ts` (`createCustomer`), `packages/ui/src/tokens.css`, `theme.css` (map màu), `e2e/support.ts`, `e2e/serve.mjs`, `e2e/anchor.ts`, `playwright.config.ts`, `e2e/appointments.spec.ts:820–890`, `docs/user-guide/10-su-co.md:70–90`, `docs/design/mockups/appointments.html` (khối AI chỉ có trạng thái CURRENT).

**Tài liệu:** `CLAUDE.md` gốc, `packages/ai/CLAUDE.md`, `apps/desktop/CLAUDE.md`, `packages/ui/CLAUDE.md`, `.claude/rules/{i18n-ui,tests}.md`; `docs/design/phase-5-ai.md` (hết), `docs/design/phase-5-prompts.md` (hết, gồm §7, §8.4, §10.4), `docs/golden/ai-eval.md` §1–§2, spec Phase 6 (các dòng S2-1…S2-6, TR-4, TR-9, §6.2 bảng gói); tổng hợp lượt 1 §3, §4.2–§4.5, §5.3, §5.8, §7, §8.7, §9; báo cáo gốc lượt 1 gói C của Claude, Codex, Muse cả hai máy (`docs/reviews/raw/2026-10-15/{,home-pc/}{claude,codex,muse}/C.md`); `common\{plan.md (§4, §L2.1–§L2.11), known.md (phần 1–2), fixes.md (#598 / #628, #599 / #632, #603 / #638), baseline.md}`; `claude\A.md`, `claude\B.md` lượt 2 (để không báo lại).

## 4. Kịch bản mới đã thử

| # | Kịch bản (các bước, dữ liệu) | Kết quả | ID |
|---|---|---|---|
| K1 | Phiên ChatGPT web theo `generation` ngoài các ca lượt 1 (`p01-web-generation.mjs`, Node, `openAppData` + seed demo 17/10/2026, câu trả lời Mock đúng): S4 phiên lấy **trong lúc** Nạp lại, Kiểm tra và lưu trong lúc thay rồi sau khi thay xong; S5 Nạp lại **bị từ chối** (`RELOAD_UNSAVED_CHANGES`, lần lưu trước lỗi — storage giả) khi phiên đang mở; S6 Nhập backup **dữ liệu khác** (seed neo 02/03/2026) khi phiên đang mở | S4: trong lúc thay → `{"kind":"replacing"}` (giữ phiên, S2-2), thay xong → `discarded` (bản `8855345`: `saved`); S5: `generation` giữ 0, panel giữ phiên, lưu → `saved ACCEPTED` (đúng S2-4); S6: KH không còn, panel bỏ phiên, `discarded` | không thấy |
| K2 | DR6-15 **trên màn thật**, bản ghim và bản R15b (`p09-web-reload-panel.mjs`, Edge, exe giả của e2e): Cài đặt → Nạp lại… → xác nhận khi `window.exe.holdBackup()` (UI chạy, `replacing()` = true) → đổi hash tới hồ sơ KH seed có cổng cho phép → bấm "Phân tích bằng ChatGPT web" → thả backup (seed, thay, `generation` + 1) → chờ 6 s → nếu phiên còn: dán câu trả lời Mock đúng, Kiểm tra và lưu | Bản ghim: phiên rời panel, focus về nút ChatGPT web. Bản R15b: phiên còn; Kiểm tra và lưu → phiên đóng, không lưu dòng nào, không báo gì. Ghi chú: seed demo chạy đồng bộ (`app-data.ts` `demoData`: `seed(db, anchor)` không có `await`), nên trong lúc seed không thao tác nào chen vào được — thử CPU ×30 (CDP) thì bấm nút không tới được trong 30 s; cửa sổ thật của đường DR6-15 là lúc chờ backup (exe) | CL2-C7 (test hở) |
| K3 | V1 sau DR6-16 với **rất nhiều** ký tự định dạng (`p02-v1-lawname.mjs`): `text` = 300 chữ + N × U+200B (N = 0 / 1 000 / 20 000 / 200 000 / 650 000) → `validateOutput` → `recordAiAnalysis` (CHATGPT_WEB) → `exportBackup` → `importBackup`; cùng chuỗi qua dán ChatGPT web | Mọi N đạt V1, ACCEPTED; `output_json` 1 125 / 4 125 / 61 125 / 601 125 / **1 951 125 B**; xuất → nhập nhận. Bản `8855345`: N ≥ 1 000 → V1 "quá 300 ký tự". Dán ChatGPT web bị chặn ở 20 000 code point (`TOO_LONG`) | CL2-C1 |
| K4 | `LAW_NAME` sau DR6-16: mọi ví dụ G5 §8.4, chữ hoa / thường lẫn ("kH", "Kh,", "KH."), "luật Reo hò", "Luật Khoa học…", chính tả i ("kỉ luật Thép", "qui luật Thị trường"), "KỶ" / "QUY" hoa (`p02`); tìm "kỉ / kỷ / qui / quy luật" trong 2 báo cáo eval thật của repo | Đúng G5 ở mọi ví dụ; "kỉ luật Thép", "qui luật Thị trường" → V6 "luật T" (G5 chỉ liệt kê "kỷ", "quy"); 0 lần xuất hiện trong eval thật | CL2-C3 |
| K5 | Mock trích xuất sau DR6-19 (`p03-mock-extraction.mjs`, `runExtraction` như app): người thân không có trong `SOMEONE_ELSE` (chồng, vợ, ông nội, bà ngoại, em, anh họ, cô, sếp, ba, hàng xóm); "con" loại từ (chó, mèo, xe, bò); phủ định / thời gian ("chưa từng ly hôn", "không ngại chia sẻ:", "sắp có 2 con", "từng độc thân"); câu kết thúc bằng "?", ";", "!", xuống dòng | "Ông nội KH có 9 con." → Số con 9; "Bà ngoại KH có 7 con…" → 7; "Sếp của KH có 3 con." → 3; "Ba của KH có 5 con." → 5; "Em KH vẫn còn độc thân." / "Cô của KH độc thân cả đời." → Độc thân; "Anh họ KH đã kết hôn…" / "Hàng xóm KH đã kết hôn…" → Đã kết hôn; "KH nuôi 2 con chó…" → 2; "Nhà KH có 3 con mèo." → 3; "…10 con bò sữa…" → 10 (bản `8855345` giống hệt). "không ngại chia sẻ: đã kết hôn" → mất "Đã kết hôn" (âm tính giả, cùng loại KNOWN #628). Đột biến N19d sống | CL2-C2 |
| K6 | Chi phí Mock trích xuất trên ghi chú **một dòng dài** (`p03`, `p07`, `p08`): "KH " + "độc thân " × n, "có 2 con và " × n; ghi chú thật 40 câu; trên Edge bấm AI trích xuất (provider mặc định Mock), đo bấm → đề xuất và long task | Node (máy rảnh): 1 803 ký tự 6,9 ms · 4 503 → 35,8 ms · 18 003 → **570 ms** · 72 003 → **8 759 ms** · 180 003 → **22 311 ms**; ghi chú thật 4 640 ký tự 0,5 ms; bản `8855345`: 1 / 3 / 7 ms. Edge: 18 003 → **512 ms (long task 484 ms)**; 36 003 → **2 298 ms (long task 2 271 ms)** | CL2-C4 |
| K7 | Tương phản **mọi** khối mờ trên bản dựng (`p05-contrast.mjs`): panel CURRENT, STALE, lịch sử chọn dòng STALE cũ (2j), đang chạy (OpenCode giả giữ), đang hủy, cổng CONFLICT_RESOLUTION, khối AI chi tiết lịch hẹn STALE; cùng các bước trên bản R21a và R21c | Bản ghim: thấp nhất 4,81:1 mọi trạng thái mờ (CURRENT 5,61), 0 cặp < 4,5. R21a: 2,49 (23 / 50 cặp < 4,5). R21c: khối lịch hẹn 4,44 (11 / 25 cặp < 4,5), panel vẫn 4,81 | CL2-C5 (test hở) |
| K8 | Focus sau các nút tự gỡ của AI trích xuất (`p06-focus.mjs`, bàn phím, OpenCode giả): Hủy khi yêu cầu còn "ở Rust", sau khi yêu cầu xong; lỗi → Thử lại → lỗi lại ngay; Thử lại → có đề xuất; Bỏ đề xuất cuối; Đóng "không tìm thấy" | Chữ ghi chú / chữ ghi chú / (lỗi: nút AI trích xuất) / chữ ghi chú / chữ ghi chú / nút AI trích xuất / nút AI trích xuất — không lần nào rơi về BODY (bản R20a: Hủy → BODY) | không thấy |
| K9 | `prompt_version` của mọi nguồn dữ liệu giả lập (`p04`): seed demo hai ngày neo (17/10, 28/02), dữ liệu tải lượt 2, snapshot e2e 15/09, một lần Mock trong app | Tất cả `@2`, khớp prompt và lần chạy trong app | không thấy |
| K10 | Câu báo trích trong bảng của hướng dẫn sử dụng ↔ `vi.ts` (`guide-quotes.mjs`: 23 câu trong `docs/user-guide/*.md`, khe `{x}` và "…" là chỗ trống) | 1 câu không khớp: `10-su-co.md:82` "(quá 200 000 ký tự)" — app "200.000" sau DR6-22 (dòng `09-cai-dat.md:166` là ví dụ đã điền khe, khớp) | CL2-C6 |
| K11 | Chuỗi nhiều gói có AI (`p10-chain.mjs`, Node, `openAppData`): KH có KYC → mở phiên ChatGPT web → trong lúc chờ **bàn giao KH** sang RE B (5c, K19) và thêm một ghi chú KYC (phiên bản mới) → dán câu trả lời → lịch hẹn của **RE B** → khối AI chi tiết lịch hẹn → **xóa KH** (5f) → Phân tích (Mock) khi KH đã xóa → Thùng rác → **khôi phục** → xuất → **nhập** → Phân tích lại | Lưu `ACCEPTED`, STALE, chip kyc v2 (bản đã chụp), lời nhắc nhỏ; khối lịch hẹn của RE B: STALE, v2, "ChatGPT web"; KH đã xóa → `discarded`; Thùng rác 1 dòng KH; khôi phục, xuất → nhập: lịch sử nguyên vẹn; phân tích lại → CURRENT kyc v3 | không thấy |
| K12 | Đột biến TSX của đợt sửa chạy trên e2e của repo (bản dựng ngoài repo, cổng 4392–4395): R15b, R20a, R21a, R21c; đối chứng bản ghim 24 / 24 | R20a, R21a bị giết (đúng test của PR); **R15b** sống (`customer-ai*.spec.ts` 24 / 24), **R21c** sống (5 spec có nhắc "KYC Intelligence": 60 / 60 + 8 / 8 = 68 / 68) | CL2-C5, CL2-C7 |

## 5. Phát hiện mới

### CL2-C1 — Sau DR6-16, V1 không còn giới hạn độ dài thật của `text`: 300 chữ + 650 000 ký tự định dạng được nhận, lưu ≈ 2 MB vô hình vào `ai_analyses` và backup

```
ID: CL2-C1
Mức: Low
Trục: G (E)
Vị trí: packages/ai/src/schema.ts:100-113 (FORMAT_CHARS, visible, text: refine "quá 300 ký tự" đếm trên visible(s)) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-16 · mới do đợt sửa (PR #628)
Kịch bản: K3
```

- **Mô tả:** DR6-16 đổi V1 cho đúng G5 §10.4: đếm 1–300 ký tự **sau khi bỏ** `\p{Cf}`. Nhưng giá trị lưu vẫn giữ nguyên các ký tự định dạng (schema không bỏ chúng, chỉ `trim`), và không còn trần nào cho chuỗi gốc: một `text` 300 chữ thấy được kèm hàng trăm nghìn U+200B đạt V1, được `recordAiAnalysis` nhận (không có trần cỡ `output_json`, `packages/db/src/ai-analyses.ts`) và luật nhập backup 3 (cùng schema) nhận. Trước PR, mỗi `text` ≤ 300 code point kể cả ký tự định dạng, nên một phân tích tối đa ≈ 35 × 300 ký tự.
- **Tái hiện:** `node p02-v1-lawname.mjs` (log `C\p02-v1-lawname.log`; bản `8855345`: `.old.log`), `text` của `needs[0]` = 150 "a" + N × U+200B + 150 "a":
  ```
  300 visible + 0 × U+200B       {"V1":"đạt","saved":"ACCEPTED","outputJsonBytes":1125,"backup":"export 4058 B, import nhận …"}
  300 visible + 20000 × U+200B   {"V1":"đạt","saved":"ACCEPTED","outputJsonBytes":61125,"backup":"export 64058 B, import nhận …"}
  300 visible + 200000 × U+200B  {"V1":"đạt","saved":"ACCEPTED","outputJsonBytes":601125,"backup":"export 604058 B, import nhận …"}
  300 visible + 650000 × U+200B  {"V1":"đạt","saved":"ACCEPTED","outputJsonBytes":1951125,"backup":"export 1954058 B, import nhận 29 ms"}
  (8855345) 300 visible + 1000 × U+200B   {"V1":"quá 300 ký tự","saved":"n/a",…}
  ```
  `validateOutput` của chuỗi 650 000 ký tự: 12,4 ms (`p07-perf.log`) — không chậm, chỉ to.
- **Ảnh hưởng:** chỉ khi model trả output suy biến — OpenCode: thân trả lời ≤ 2 MB nên tối đa ≈ 650 000 U+200B mỗi phân tích; ChatGPT web: câu dán ≤ 20 000 code point (đã thử: 19 000 U+200B → `TOO_LONG`). Khi gặp: một dòng `ai_analyses` (chỉ thêm, không xóa được) mang ≈ 2 MB vô hình, nằm trong mọi file DB / backup sau đó, và mỗi lần lưu file chở thêm (`db.save` 147 ms cho 14 MB, `baseline.md`). Không sai số liệu. Ghi thêm: spec §6.2 chỉ nói "1–300 ký tự (đếm theo NFC) sau khi cắt khoảng trắng", G5 §10.4 / quyết định Q6 nói đếm sau khi bỏ `\p{Cf}` — code theo G5.
- **Đề xuất:** cần G5 (đổi luật V1): thêm trần cho chuỗi gốc (vd. ≤ 600 code point kể cả ký tự định dạng), hoặc lưu `text` đã bỏ `\p{Cf}` (transform của schema; cũng bỏ luôn ký tự điều khiển hướng U+202E mà lượt 1 nêu ở "đã xét"). ≈ 5 dòng SP + 2 ca `schema.test.ts`.

### CL2-C2 — Mock trích xuất sau DR6-19 vẫn đề xuất cho KH điều nói về ông, bà, em, anh họ, cô, sếp, hàng xóm…, và đọc "2 con chó" là hai con

```
ID: CL2-C2
Mức: Low
Trục: C (E, T)
Vị trí: packages/ai/src/mock-adapter.ts:78 (childrenCount: chỉ trừ "nội / ngoại / số"), :99-100 (SOMEONE_ELSE), :117-121 (aboutTheKh); test packages/ai/src/mock-adapter.test.ts:165-193 (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-19 · biến thể còn hở của phần sửa (PR #628)
Kịch bản: K5
```

- **Mô tả:** DR6-19 sửa đúng ba câu lượt 1 bằng một danh sách người khác (`con|cháu|em trai|em gái|anh trai|chị gái|bố|mẹ|cha|bạn|người quen|đồng nghiệp|người thân|họ hàng`) và một ngoại lệ "con số". Các từ chỉ người thân / người khác thường gặp khác (ông, bà, em, anh họ, cô, chú, ba, sếp, hàng xóm…) và "con" là loại từ của con vật / đồ vật vẫn cho đề xuất về KH — trái quy tắc 1 của prompt `extraction@1` ("chỉ đề xuất điều ghi chú nói rõ về khách hàng") mà Mock mô phỏng, và trái mục tiêu Issue #598 ("chỉ nhận câu có chủ thể là KH").
- **Tái hiện:** `node p03-mock-extraction.mjs` (log `C\p03-mock-extraction.log`), qua `runExtraction` (Mock + V1 + V7) như app:
  ```
  "Ông nội KH có 9 con."                        childrenCount=9 «9 con»
  "Bà ngoại KH có 7 con, KH là cháu đích tôn."  childrenCount=7 «7 con»
  "Sếp của KH có 3 con."                        childrenCount=3 «3 con»
  "Ba của KH có 5 con."                         childrenCount=5 «5 con»
  "Em KH vẫn còn độc thân."                     maritalStatus=Độc thân «độc thân»
  "Cô của KH độc thân cả đời."                  maritalStatus=Độc thân «độc thân»
  "Anh họ KH đã kết hôn năm ngoái."             maritalStatus=Đã kết hôn «kết hôn»
  "Hàng xóm KH đã kết hôn tuần trước."          maritalStatus=Đã kết hôn «kết hôn»
  "KH nuôi 2 con chó Phú Quốc."                 childrenCount=2 «2 con»
  "Nhà KH có 3 con mèo."                        childrenCount=3 «3 con»
  "KH sở hữu 10 con bò sữa ở trang trại."       childrenCount=10 «10 con»
  ```
  Test: đột biến N19d (`startOf(note, at, /[.]/)`: câu chỉ kết thúc ở ".") sống `mock-adapter.test.ts` 38 / 38 — không ca nào giữ "!", "?", ";", xuống dòng là ranh giới câu.
- **Ảnh hưởng:** RE dùng Mock — provider mặc định khi chưa nhập key OpenCode, bản web, demo / nghiệm thu — thấy đề xuất sai và phải tự Bỏ; đề xuất không tự lưu (§8), nên không sai dữ liệu đã lưu. OpenCode thật không bị ảnh hưởng.
- **Đề xuất:** thêm từ chỉ người khác thường gặp vào `SOMEONE_ELSE`; với số con chỉ nhận "<n> con / bé / cháu" khi theo sau là hết câu, dấu câu hoặc "trai / gái / nhỏ / lớn" (hoặc loại thêm danh từ con vật / đồ vật); thêm các câu trên và một câu cho mỗi dấu kết thúc vào `mock-adapter.test.ts`. ≈ 10 dòng SP + 20 dòng test.

### CL2-C3 — Ngoại lệ "luật" sau "kỷ", "quy" chỉ nhận chính tả y: "kỉ luật Thép", "qui luật Thị trường" bị V6 chặn nhầm

```
ID: CL2-C3
Mức: Nit
Trục: G
Vị trí: packages/ai/src/blocklists.ts:94 (LAW_NAME, ci('kỷ') | ci('quy')) — đúng chữ G5 docs/design/phase-5-prompts.md:301 (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-16 (cùng mục LAW_NAME), cùng loại DR6-23 (KNOWN, chờ đợt G5 sau) · có từ trước, lượt 1 bỏ sót
Kịch bản: K4
```

- **Mô tả:** "kỉ luật" / "qui luật" là cách viết i hợp chuẩn (sách giáo khoa hiện dùng "kỉ"), cùng nghĩa với "kỷ luật" / "quy luật" mà G5 miễn; mục V6 chỉ liệt kê "kỷ", "quy", nên cách viết i theo sau là một từ viết hoa bị chặn như tên luật.
- **Tái hiện:** `p02-v1-lawname.log`: `Giữ kỉ luật Thép của KH → V6 có "luật T"`; `KH tin vào qui luật Thị trường → V6 có "luật T"`; đối chứng `Giữ Kỷ luật Thép của KH → đạt`, `KH tin vào QUY LUẬT Thị trường → đạt`. `grep -i "k[ỉỷ] luật|q[uU][iyý] luật"` trên `docs/metrics/ai-eval-2026-10-1{0,1}.md`: 0 lần.
- **Ảnh hưởng:** model viết kiểu i trước một từ viết hoa → tốn một lần thử, lặp lại thì REJECTED; chưa gặp trong eval thật.
- **Đề xuất:** gộp vào đợt G5 sau (cùng DR6-23): thêm "kỉ", "qui" vào ngoại lệ (mọi kiểu chữ), 1 dòng + 2 ca kiểm; đổi danh sách = version mới + G5.

### CL2-C4 — Hồi quy hiệu năng của Mock trích xuất (DR6-19): ghi chú một dòng dài làm trang đứng 0,5 s tới hàng chục giây

```
ID: CL2-C4
Mức: Low
Trục: P
Vị trí: packages/ai/src/mock-adapter.ts:106-121 (startOf: quét ngược từng ký tự, aboutTheKh: SOMEONE_ELSE / NEGATION trên cả đoạn), :125-132 (gọi cho mọi cụm khớp, trước khi cắt 20) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-19 · mới do đợt sửa (PR #628)
Kịch bản: K6
```

- **Mô tả:** Với mỗi cụm khớp, `aboutTheKh` quét ngược tới đầu câu và đầu vế (mỗi ký tự một `RegExp.test`) rồi chạy hai regex trên đoạn đó; ghi chú dài không có dấu kết thúc câu với nhiều cụm khớp cho chi phí bậc hai, chạy đồng bộ trong `complete` của Mock trên luồng chính của webview. Bản `8855345` tuyến tính.
- **Tái hiện / số đo:** `p07-perf.mjs` (Node, máy rảnh CPU 6 %, log `C\p07-perf.log`):
  ```
  Mock extraction, "độc thân" × 200 (1803 chars, one line)        median 6.93 ms
  Mock extraction, "độc thân" × 500 (4503 chars, one line)        median 35.82 ms
  Mock extraction, "độc thân" × 2000 (18003 chars, one line)      median 569.56 ms
  Mock extraction, "độc thân" × 8000 (72003 chars, one line)      median 8758.98 ms
  Mock extraction, "có 2 con và" × 15000 (180003 chars, one line) median 22311.41 ms
  Mock extraction, realistic note ×40 (4640 chars)                median 0.50 ms
  ```
  Bản `8855345` cùng máy (`p03-mock-extraction.old.log`, đo lúc vitest chạy nền): 18 003 / 72 003 / 180 003 ký tự → 1 / 3 / 7 ms. Trên Edge, bản dựng ghim (`p08-mock-long-note.mjs`, log `C\p08-mock-long-note.log`): ghi chú 18 003 ký tự → bấm AI trích xuất → đề xuất **512 ms, long task 484 ms**; 36 003 ký tự → **2 298 ms, long task 2 271 ms** (trang không nhận thao tác, Hủy cũng không bấm được).
- **Ảnh hưởng:** chỉ Mock (provider mặc định), chỉ khi ghi chú là một khối dài không dấu chấm / xuống dòng với hàng trăm cụm "độc thân" / "<n> con" / "đã kết hôn" — điều kiện hiếm (ghi chú thật 4 640 ký tự: 0,5 ms). Khi gặp, vượt ngưỡng thao tác màn < 200 ms (`docs/metrics/phase-6.md`) từ ≈ 1 000 cụm; trần là ghi chú ≈ 198 000 ký tự (lớn hơn → `AI_TOO_LARGE`).
- **Đề xuất:** tính đầu câu / đầu vế cho mọi vị trí trong một lượt (mảng "dấu kết thúc gần nhất") và chỉ xét `SOMEONE_ELSE` / `NEGATION` trên đoạn giới hạn; hoặc dừng khi đã có 20 cụm được nhận (output vốn cắt ở 20). ≈ 15 dòng SP + 1 ca test thời gian (như `extract-json.test.ts:117`).

### CL2-C5 — Không test nào giữ tương phản của khối AI ở chi tiết lịch hẹn khi STALE (DR6-21): gỡ "thẻ rỗng" ở đó → 4,44:1 mà e2e xanh

```
ID: CL2-C5
Mức: Low
Trục: T (A)
Vị trí: apps/desktop/src/routes/appointments/AppointmentAi.tsx:29 (<Item … faded={faded} />), :77-88 (Block … faded={stale}); e2e/appointments.spec.ts:872-878 (chỉ kiểm chữ "STALE") (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-21 · test hở của phần sửa (PR #632)
Kịch bản: K7, K12
```

- **Mô tả:** DR6-21 dựa vào hai thứ: cả khối 85 % **và** thẻ phần tử rỗng (không nền `--bg-2`). Khối AI của chi tiết lịch hẹn tự truyền `faded` cho `Item`; e2e `lowestContrast` chỉ đo panel Hồ sơ KH (PR #632 ghi "phần dùng chung giống hệt"), còn e2e của chi tiết lịch hẹn chỉ kiểm chữ "STALE". Một sửa đổi làm khối này không truyền `faded` sẽ đưa nó dưới AA mà không test nào báo.
- **Tái hiện:** đột biến R21c (`faded={false}` cho `Item` của `AppointmentAi`, dựng ngoài repo bằng `C\build-dist.mjs`, sha256 file trả về = `HEAD`): vitest 2 898 xanh; e2e của cả 5 spec có nhắc "KYC Intelligence" (`git grep -l "KYC Intelligence\|appointment-ai\|Chưa có phân tích AI" e2e/*.spec.ts`: `appointments`, `customer-ai`, `customer-ai-web`, `customer-kyc`, `full-cycle`) **68 / 68 xanh** (60 + 8, `C\e2e-mutants.log`). Đo trên bản R21c (`p05-contrast-R21c.log`): `appointment detail AI block STALE min 4.44 · <4.5: 11/25` (bản ghim: 4,81, 0 / 25).
- **Ảnh hưởng:** chỉ chất lượng test; code hiện đúng (4,81:1).
- **Đề xuất:** đưa `lowestContrast` về `e2e/support.ts` và thêm `expect(await lowestContrast(ai)).toBeGreaterThanOrEqual(4.5)` sau `appointments.spec.ts:877`. ≈ 5 dòng test.

### CL2-C6 — Hướng dẫn sử dụng còn chép câu lỗi AI cũ "(quá 200 000 ký tự)" sau khi DR6-22 đổi thành "200.000"

```
ID: CL2-C6
Mức: Nit
Trục: C
Vị trí: docs/user-guide/10-su-co.md:82 ↔ apps/desktop/src/i18n/vi.ts:249-250 (aiError.AI_TOO_LARGE) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-22 · mới do đợt sửa (PR #628 đổi câu, hướng dẫn chưa đổi theo)
Kịch bản: K10
```

- **Mô tả:** bảng "lỗi AI thường gặp" của hướng dẫn chép nguyên văn câu trên màn để người dùng tra; câu `aiError.AI_TOO_LARGE` nay viết "200.000", hướng dẫn vẫn "200 000".
- **Tái hiện:** `node guide-quotes.mjs` (log `C\guide-quotes.log`): 23 câu báo trích trong bảng của `docs/user-guide/*.md` so với giá trị `vi.ts` → `10-su-co.md:82  "Dữ liệu gửi AI quá lớn (quá 200 000 ký tự) — rút gọn ghi chú hoặc dữ kiện rồi thử lại."` không khớp (`vi.ts:250` "…(quá 200.000 ký tự)…"). Dòng còn lại script báo (`09-cai-dat.md:166`) là ví dụ đã điền khe của `trash.blocked.TEAM_HAS_LEAD`, khớp.
- **Ảnh hưởng:** người dùng tìm câu trên màn trong hướng dẫn không thấy trùng chữ; lượt kiểm hướng dẫn ở G7 sẽ thấy lệch.
- **Đề xuất:** sửa một dòng hướng dẫn thành "200.000" (PR docs).

### CL2-C7 — Hai phần của DR6-15 không test nào giữ: panel bỏ phiên khi dữ liệu thay, và thứ tự "đọc `generation` trước khi lấy đầu vào"

```
ID: CL2-C7
Mức: Low
Trục: T
Vị trí: apps/desktop/src/routes/customers/KycIntelligence.tsx:349-351 (web = opened?.generation === generation ? opened : null); apps/desktop/src/data/ai-analysis.ts:308-316 (generation đọc trước takeProfile và trước hai await) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-15 · test hở của phần sửa (PR #628)
Kịch bản: K2, K12
```

- **Mô tả:** (a) Panel bỏ phiên khi `generation` đổi — chỉ có ở component, vitest không có DOM, e2e không có ca thay dữ liệu khi phiên đang mở. (b) `startChatGptWeb` đọc `generation` trước khi lấy đầu vào; nếu lần đọc bị dời ra sau `await app.ai.web.copy` / `openChatGpt`, một lần thay xong trong lúc chờ sẽ gắn đầu vào của dữ liệu cũ với mốc của dữ liệu mới, và câu trả lời được lưu vào dữ liệu mới — đúng lỗi DR6-15. Không test nào giữ thứ tự này.
- **Tái hiện:** R15b (`const web = generation >= 0 ? opened : null`): vitest 2 898 xanh, e2e `customer-ai.spec.ts` + `customer-ai-web.spec.ts` 24 / 24 xanh (`C\e2e-mutants.log`); `p09-web-reload-panel-R15b.log`: `6 s after the backup: session still in the panel true` (bản ghim: `false`). R15d (đọc `generation` sau hai `await`): `ai-analysis.test.ts` 57 / 57 xanh (`C\mut.log`).
- **Ảnh hưởng:** chỉ chất lượng test; code hiện đúng. Mất (a) chỉ ảnh hưởng trải nghiệm (`saveChatGptAnswer` vẫn trả `discarded`, p09 trên R15b); mất (b) đưa lại DR6-15. Đường vào cần thay dữ liệu xong khi phiên đang mở (Back nay bị chặn trên exe, DR6-34).
- **Đề xuất:** (a) e2e như `p09` (exe giả, `holdBackup`, đổi hash tới hồ sơ, bấm ChatGPT web, `releaseBackup` → khung "Dán kết quả" biến mất); (b) ca unit ở `ai-analysis.test.ts`: `web.copy` trả promise chờ, Nạp lại / nhập xong trong lúc đó, rồi `saveChatGptAnswer` → `discarded`. ≈ 40 dòng test.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `pnpm exec tsc -p packages/ai/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters`; cùng lệnh cho `apps/desktop/tsconfig.json` | SHA ghim | exit 0, 0 dòng cả hai (hai cờ vốn bật ở `tsconfig.base.json`) | — |
| Nơi dùng mọi export (`C\exports.mjs` = scanner lượt 1 Home PC, `git grep -w` ở `HEAD`; log `C\exports.log`) | 36 file SP của gói C | 20 export không có nơi dùng SP ngoài file: đúng danh sách lượt 1 (kiểu dữ liệu, `issueLine` / `runAfter` / `WebTools` / `AiSettingsStore` chỉ test dùng, `ConfirmProposal` = DR6-66 KNOWN). Export mới của đợt sửa đều có nơi dùng SP: `PROMPT_VERSIONS` (`db/seed.ts`), `FADED` + prop `faded` của `Item` (`AppointmentAi.tsx`), `AppWebSession` (`ai-panel-view.ts`); `KycWebSession` đã bỏ prop / import `versions` thừa | — |
| `pnpm lint:deps` | `common\baseline.md` | 0 vi phạm (315 module, 1 277 phụ thuộc) | — |
| Dependency | `git diff 8855345 4217ed4 -- packages/ai/package.json apps/desktop/package.json` | `packages/ai` không đổi; `apps/desktop` chỉ đổi `version` 1.0.0 (DR6-12) | — |
| Code lặp | diff của gói | `PROMPT_VERSIONS` chép chuỗi version của `prompts/*.ts` (ACCEPTED #628, có test giữ khớp); `FADED` / `Item` dùng chung panel ↔ lịch hẹn (bớt lặp); không thêm khối lặp ≥ 3 nơi | — |
| Cỡ dòng | `size-report` ở `baseline.md` | C: SP 5 250 (+121), test 6 110 (+125), 60 file (0) | — |
| Bundle | `baseline.md` + bản dựng của phiên (`C\dist-base`, có `VITE_DEMO_ANCHOR`) | `assets/index.js` 909 669 B (+17 727 cả app); CSS: `.opacity-85` thay `.opacity-50` (không class `opacity-50` nào còn dùng). Không tách phần AI được nếu không có visualizer (G4, chỉ đề xuất) | — |

Không có phát hiện B.

### 6.2 Hiệu năng

Máy Home PC `DESKTOP-KDURKJP`, Node v24.20.0; `p07-perf.mjs` (= probe lượt 1 Home PC `p3-perf.mjs`, cùng máy) chạy 11:40 (giờ máy), CPU 6 %, tiến trình Codex mở nhưng nhàn, 5 server `vite preview` của phiên (cổng 4391–4395) nhàn. Dữ liệu: `common\load\load-2026-10-12-seed6.p2cbackup` (lượt 2) qua `importBackup` — 103 `ai_analyses` (ACCEPTED, MOCK), 96 KH có phân tích, tối đa 20 phiên bản KYC / 19 dữ kiện mỗi KH (như lượt 1). Mốc so: báo cáo lượt 1 Claude C **Home PC** §4b (cùng máy, `8855345`); exe: `common\baseline.md` (probe trên exe ghim, Home PC) so `perf-ref-r1.json`. Luật nhiễu: xấu hơn khi quá 20 % **và** quá 10 ms.

| Thao tác | Lần | Lượt 2 trung vị (min–max) | Lượt 1 Home PC | Δ | Ngưỡng | ID |
|---|---:|---|---|---|---|---|
| Phần AI của hồ sơ KH (đọc + cổng + view + nội dung + lịch sử + dòng help), mỗi KH sống có phân tích | 95 | 0,36 ms (0,22–4,41) | 0,36 ms | 0 | thao tác màn < 200 ms ✅ | — |
| Như trên, KH nhiều phân tích nhất / riêng phần tính lúc render | 20 | 0,32 / 0,03 ms | 0,34 / 0,03 ms | trong nhiễu | ✅ | — |
| Khối AI chi tiết lịch hẹn (3 lần đọc + `appointmentAiView`) | 20 | 0,28 ms | 0,30 ms | trong nhiễu | ✅ | — |
| Render-only với 60 dòng lịch sử | 20 | 0,06 ms | 0,06 ms | 0 | ✅ | — |
| `validateOutput` phân tích lớn nhất schema cho (35 × 299 ký tự) | 20 | 2,79 ms (2,64–175,09 lần đầu dựng regex) | 2,83 ms | trong nhiễu | ✅ | — |
| `extractJson` câu trả lời đó (12 418 ký tự) / câu suy biến 100 800 ký tự | 20 / 5 | 0,25 / 1,10 ms | 0,17 / 1,10 ms | +0,08 ms (< 10 ms) | ✅ | — |
| `checkWebAnswer` dán 12 446 ký tự / 19 750 ký tự toàn `{` / `checkAnalysisAnswer` | 20 | 3,00 / 0,11 / 2,74 ms | 3,01 / 0,10 / 2,68 ms | trong nhiễu | bấm Kiểm tra và lưu ✅ | — |
| Exe (`baseline.md`): `customer.open-ai` / `customer.ai-history` | 5 | 18 / 2 ms | 20 / 12 ms (`perf-ref-r1`) | −2 / −10 ms | < 200 ms ✅ | — |
| Mock trích xuất, ghi chú thật 40 câu (4 640 ký tự) | 5 | 0,50 ms | — | — | ✅ | — |
| Mock trích xuất, ghi chú **một dòng**: 1 803 / 4 503 / 18 003 / 72 003 / 180 003 ký tự | 3 / 3 / 3 / 1 / 1 | 6,9 / 35,8 / **570** / **8 759** / **22 311** ms | (code `8855345`, cùng máy, lúc vitest chạy nền: 18 003 / 72 003 / 180 003 → 1 / 3 / 7 ms) | ⚠️ ×500–3 000 | < 200 ms ❌ từ ≈ 1 000 cụm khớp | CL2-C4 |
| Edge, bản dựng: bấm AI trích xuất (Mock) → đề xuất hiện, ghi chú 4 503 / 18 003 / 36 003 ký tự | 1 | 73 / **512** / **2 298** ms (long task 0 / 484 / 2 271 ms) | — | — | < 200 ms ❌ | CL2-C4 |
| `validateOutput` một `text` 300 chữ + 0 / 200 000 / 650 000 U+200B | 5 | 0,49 / 3,93 / 12,36 ms | (code `8855345`: V1 từ chối) | — | ✅ (cỡ lưu: CL2-C1) | CL2-C1 |

Ngoài CL2-C4 (hồi quy chỉ khi ghi chú suy biến), không thao tác nào của gói C xấu hơn lượt 1 cùng máy theo luật nhiễu. Cờ `reload.*` / `app.open-data` của `baseline.md` không thuộc gói C (gói B: CL2-B7).

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | | CL2-C2 | | CL2-C1 | | CL2-C4 | | CL2-C5, CL2-C7 | | 5 |
| Nit | | | CL2-C6 | | CL2-C3 | | | | | | 2 |
| **Tổng** | 0 | 0 | 2 | 0 | 2 | 0 | 1 | 0 | 2 | 0 | **7** |

Đếm theo trục chính (trục phụ trong khuôn: CL2-C1 thêm E, CL2-C2 thêm E / T, CL2-C5 thêm A). **7 / 7 CONFIRMED**, 0 PLAUSIBLE, 0 KNOWN báo lại. Bảng R: 8 / 8 DR6 ĐÃ SỬA, không SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY; ba phát hiện "mới do đợt sửa" (CL2-C1, CL2-C4, CL2-C6), ba biến thể / test hở của phần sửa (CL2-C2, CL2-C5, CL2-C7), một có từ trước (CL2-C3).

## 8. Đã xét, không thấy

- **R:** 8 DR6 (15, 16, 18, 19, 20, 21, 22, 61) đều ĐÃ SỬA (mục 2); 26 đột biến: 22 bị giết, 4 sống (N19d → CL2-C2, R21c → CL2-C5, R15b / R15d → CL2-C7). Không phần sửa nào làm hỏng chỗ trước đó đúng: e2e AI đối chứng 24 / 24, vitest 2 898 (không đột biến) xanh, bảng hiệu năng trong nhiễu (trừ CL2-C4, đường mới của chính phần sửa).
- **E:** phiên web ở mọi thời điểm so với lần thay (trước / trong / sau, thay lỗi, dữ liệu khác: K1, K2); V1 với 0–650 000 ký tự định dạng, U+FEFF hai đầu, dấu cách kẹp giữa hai U+200B (K3); `LAW_NAME` mọi kiểu chữ, dấu câu sau "KH" (K4); Mock trên 25 câu biên (K5) và ghi chú dài (K6); focus ở 7 bước (K8). Ngoài CL2-C1 / C2 / C3 / C4 không thấy. Ghi chú: dán chỉ U+200B vẫn tính một lần thử (JS `trim()` không bỏ U+200B) — lượt 1 đã nêu "cần cố ý dán", không có bằng chứng mới.
- **C:** spec Phase 5 §3.1 (mục 1–8), §6.2, §6.4, §9.1, §9.2 ↔ code sau sửa: khớp; G5 §8.4 (mọi ví dụ của dòng `luật`), §10.4 ↔ `schema.ts` / `blocklists.ts`: khớp chữ; mockup `ai.html` `.faded` + ghi chú 2h ↔ `FADED` / `Item`: khớp; `appointments.html` chỉ vẽ khối AI CURRENT nên không mâu thuẫn ghi chú 2h; nhãn panel / trích xuất không đổi (không khóa i18n mới ngoài câu `AI_TOO_LARGE`). Thấy CL2-C2, CL2-C6.
- **D:** chuỗi K11 (bàn giao → phiên web → ghi chú mới → khối lịch hẹn RE mới → xóa / khôi phục KH → xuất / nhập → phân tích lại): dữ liệu đúng ở mọi bước; mọi đường thay dữ liệu bỏ câu trả lời của dữ liệu cũ (K1, K2); thay lỗi giữ phiên và lưu đúng (S2-4); seed / dữ liệu tải / snapshot cùng `@2` (K9). Thấy CL2-C1 (cỡ dòng lưu).
- **G:** V1 (đếm sau `\p{Cf}`), V4 / V6 ở `personalityNotes` (R61g / R61h bị giết), ngoại lệ `LAW_NAME` (R61a–c bị giết), trần TS ↔ Rust (R61d–f bị giết). DR6-17 (KNOWN, hoãn G5): `text-match.ts` và các mẫu V6 `Điều` / `khoản` không đổi từ lượt 1 (`git diff` chỉ chạm dòng `LAW_NAME`), không có bằng chứng mới. Thấy CL2-C1, CL2-C3.
- **S:** đường key (`ai-tauri.ts`, `SettingsAi` lưu 4 trường) không đổi từ lượt 1; `AppWebSession.generation` chỉ ở bộ nhớ; URL ChatGPT hằng (`CHATGPT_URL`), không dữ liệu trên URL; output model hiện bằng text node (e2e `customer-ai-web.spec.ts:328` xanh trên bản dựng). Mọi probe trình duyệt của phiên chặn mạng ngoài 127.0.0.1 từ lần chạy đầu (`context.route` + `--host-resolver-rules`, thay `window.open` / clipboard): **0 request bị chặn** được ghi ở mọi lần chạy (không lần nào gọi ra ngoài); không chạy exe, không gọi OpenCode, không đọc key.
- **P:** mục 6.2; ngoài CL2-C4 không thấy.
- **B:** mục 6.1; không thấy.
- **T:** CL2-C5, CL2-C7, N19d (trong CL2-C2). Test mới của #628 đỏ khi gỡ đúng phần sửa (R15a, R15c, R16a–c, R18a–b, R19a–c); e2e mới của #632 / #638 đỏ khi gỡ (R21a, R20a). Test của gói C không phụ thuộc ngày hệ thống (dùng `TODAY` / đồng hồ ghim).
- **A:** tương phản mọi khối mờ ≥ 4,81:1 (K7); focus sau Hủy / Thử lại / Bỏ / Đóng không rơi về BODY (K8); chữ ghi chú `tabIndex={-1}` chỉ là đích focus, không vào thứ tự Tab; khi phiên web bị bỏ do thay dữ liệu, focus về nút ChatGPT web (K2). Không thấy.

## 9. Phụ lục

### 9.1 Probe, log

Mọi file ở `C:\workspace\deep-review-1-6-r2\claude\C\`. Probe Node nạp TypeScript của repo qua `hooks.mjs` (chép từ `r2\claude\A\hooks.mjs`, thêm `P2C_REPO` để chạy trên `old-8855345\` = `git archive 8855345 packages/{domain,db,ai}/src packages/db/migrations apps/desktop/src`); không ghi gì vào repo.

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `list.mjs` | danh sách 60 file gói C theo `classifyFile` | `list.log` | mục 3 |
| `p01-web-generation.mjs` | DR6-15: `p6-reload-web` lượt 1 + P2 Muse + S4–S6 | `p01-web-generation.log`, `.old.log` | DR6-15, K1 |
| `p02-v1-lawname.mjs` | DR6-16: V1 + `LAW_NAME`; ký tự định dạng tới 650 000 qua lưu / backup | `p02-v1-lawname.log`, `.old.log` | DR6-16, K3, K4, CL2-C1, CL2-C3 |
| `p03-mock-extraction.mjs` | DR6-19: câu lượt 1 + 25 câu biên + ghi chú dài | `p03-mock-extraction.log`, `.old.log` | DR6-19, K5, CL2-C2 |
| `p04-seed-versions.mjs` | DR6-18: `prompt_version` của seed / tải / snapshot | `p04-seed-versions.log`, `.old.log` | DR6-18, K9 |
| `browser.mjs` | bộ trình duyệt: Edge, chặn mạng ngoài 127.0.0.1, thay `window.open` / clipboard, exe giả (port từ `e2e/support.ts` `asExe`), `contrastOf` | — | p05, p06, p08, p09 |
| `p05-contrast.mjs` | DR6-21: tương phản mọi khối mờ trên bản dựng | `p05-contrast.log`, `-R21a.log`, `-R21c.log` | DR6-21, K7, CL2-C5 |
| `p06-focus.mjs` | DR6-20: focus sau Hủy / Thử lại / Bỏ / Đóng | `p06-focus.log`, `-R20a.log` | DR6-20, K8 |
| `p07-perf.mjs` | = `p3-perf.mjs` lượt 1 Home PC + phần Mock dài / V1 ký tự định dạng | `p07-perf.log` | mục 6.2, CL2-C4 |
| `p08-mock-long-note.mjs` | Mock trích xuất ghi chú dài trên Edge, long task | `p08-mock-long-note.log` | CL2-C4 |
| `p09-web-reload-panel.mjs` | DR6-15 trên màn: Nạp lại (backup giữ) + phiên web | `p09-web-reload-panel.log`, `-R15b.log` | DR6-15, K2, CL2-C7 |
| `p10-chain.mjs` | chuỗi bàn giao → phiên web → xóa / khôi phục → xuất / nhập | `p10-chain.log` | K11 |
| `guide-quotes.mjs` | câu báo trong hướng dẫn ↔ `vi.ts` | `guide-quotes.log` | K10, CL2-C6 |
| `exports.mjs` | nơi dùng mọi export (scanner lượt 1 Home PC) | `exports.log` | mục 6.1 |

Lần chạy lỗi của probe (lỗi probe, không phải sản phẩm): `p09` hai lần đầu (chờ "Đang nạp lại…" khi seed đã xong ≈ 1 s; CPU ×30 làm hash đổi chỉ được xử lý sau seed; nút xác nhận ở exe giả là "Backup rồi nạp lại") → bản cuối dùng `holdBackup`; `guide-quotes.mjs` lần đầu (heredoc làm hỏng regex; giá trị `vi.ts` chỉ có khe khớp mọi chuỗi) → viết lại.

### 9.2 Đột biến (26)

`mut.mjs` + `mut-list.mjs` (log `mut.log`, đầu ra từng đột biến `mut-out\<id>.out`). Lệnh: `pnpm exec vitest run <file…>` ở gốc repo (TSX: cả bộ). Chạy nối tiếp: 11:22:23–11:23:45 (22 đột biến) rồi 11:23:47–≈ 11:29 (4 đột biến TSX, cả bộ vitest mỗi cái). Trong lần thứ hai có chạy song song `p02`, `p03` (chỉ nạp `packages/ai`, `packages/db`, không nạp file TSX đang vá); số đo thời gian của `p03` lúc đó chỉ dùng làm mốc thô, số đo chính lấy ở `p07` khi máy rảnh.

- **KILLED bởi vitest (20):** R15a, R15c, R16a, R16b, R16c, R18a, R18b, R19a, R19b, R19c, N19e, N19f, R61a, R61b, R61c, R61d, R61e, R61f, R61g, R61h (số test đỏ, tên test: mục 2 và `mut.log`).
- **Sống vitest, chạy e2e trên bản dựng ngoài repo (4):** R20a → **KILLED** e2e `customer-ai.spec.ts:816`; R21a → **KILLED** e2e `customer-ai.spec.ts:70`; **R15b SỐNG** (e2e 24 / 24); **R21c SỐNG** (e2e 68 / 68, 5 spec).
- **SỐNG vitest, không phải TSX (2):** **R15d** (`ai-analysis.test.ts` 57 / 57), **N19d** (`mock-adapter.test.ts` 38 / 38).
- Dòng cuối của cả hai lần chạy `mut.log`: `git status --short after: ""`.

### 9.3 e2e ngoài repo (không dùng cổng 4173)

- `build-dist.mjs <outDir> [id]`: `pnpm exec vite build --outDir <outDir> --emptyOutDir` trong `apps/desktop` với **`VITE_DEMO_ANCHOR=15/09/2026`** (như `playwright.config.ts`), rồi ghi snapshot demo `demo-2026-09-15.sqlite` như `e2e/serve.mjs`; với đột biến: vá → dựng → trả nguyên byte → so sha256 với `HEAD` (cả 4 lần: "restored (sha256 = HEAD)", `git status --short after: ""`). Bản ghim `dist-base`: `index-DewnZKfC.js` 909,67 kB (khác tên băm với `baseline.md` vì có biến môi trường anchor; số bundle của báo cáo lấy ở `baseline.md`). Đã kiểm đột biến vào bản dựng: `dist-R21a` có `.opacity-50`, các bản khác `.opacity-85`, `index-*.js` khác băm.
- `serve-dist.mjs <outDir> <port>`: `vite preview` 127.0.0.1:4391 (ghim), 4392 (R15b), 4393 (R20a), 4394 (R21a), 4395 (R21c; mở lại một lần để chạy thêm `customer-ai-web.spec.ts`); đã tắt cả 5 (theo dòng lệnh `serve-dist.mjs`), không cổng nào trong 4391–4395 còn nghe.
- `pw.config.mjs`: `testDir` = `e2e` của repo, `outputDir` ngoài repo (`C\pw-results`), Edge, `--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE localhost , EXCLUDE 127.0.0.1`, 2 worker. Đối chứng bản ghim `customer-ai.spec.ts` + `customer-ai-web.spec.ts`: 24 / 24 xanh (36,5 s).
- Thư mục `dist-*`, `pw-results` nằm trong `C\` (67 MB cả thư mục), không phải bằng chứng cần giữ ngoài log.

### 9.4 Cuối phiên

- `git status --short` cuối phiên (`C:\workspace\Project-2C-review`, 2026-10-17 12:00:04): rỗng (như đầu phiên); `git rev-parse HEAD` → `4217ed4cd3300af1d63aa61db9eb13902fe75f16`.
- Không mở / liệt kê / tìm kiếm thư mục của bên khác; chỉ mở theo tên đầy đủ: `common\*`, `claude\A.md`, `claude\B.md`, `claude\A\hooks.mjs`, `claude\A\mut.mjs`, `claude\A\mut-list.mjs` (lượt 2, của Claude) và `deep-review-1-6\claude\C\{hooks.mjs,p6-reload-web.mjs,p3-perf.mjs,p3-perf.log,exports.mjs}` (lượt 1, của Claude, máy này).
- Giờ xong: 2026-10-17 12:01 (+07, giờ máy).
