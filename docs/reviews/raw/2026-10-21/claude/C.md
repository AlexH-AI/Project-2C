XONG — claude gói C lượt 3, 2026-10-20 21:16

# Deep review Phase 1–6, lượt 3 — Claude, gói C (AI)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên / ID | `claude` / `CL3` |
| Gói | C — AI: `packages/ai/**`; file AI của app (`ai-*`, `*-ai-*`, `*Ai.tsx`, `KycExtraction`, `KycIntelligence`, `KycWebSession`, `KycHistory`, `extraction-view`) |
| SHA đầu phiên | `119e2e45cbce54d8a3943757bd826a7f1e9b694f` (`119e2e4`), worktree `C:\workspace\Project-2C-review` detached |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-10-20 20:18 (`Get-Date`) |
| Máy | Home PC `DESKTOP-KDURKJP` |
| Công cụ / model / mức suy luận | Claude Code CLI · Opus 5.5 (`claude-opus-5-5`) · max |
| Ultracode | tắt — không subagent, không Workflow; mọi việc làm trong phiên chính |
| Bước 0 | chữ gói `C` hợp lệ; `claude\C.md` chưa có (`Test-Path` → False) → làm mới; `claude\A.md` dòng đầu `XONG — claude gói A lượt 3, 2026-10-20 19:20`, `claude\B.md` dòng đầu `XONG — claude gói B lượt 3, 2026-10-20 20:12` |
| Song song | tiến trình app Codex (2 `codex` + tiến trình phụ) mở; CPU 0–4 % lúc đo. Không chạy `pnpm e2e` cổng 4173, không chạy exe; e2e chạy trên bản dựng ngoài repo, cổng 4491–4493 |

## 2. Bảng R

Đột biến "gỡ phần sửa" (`C\mut.mjs` + `C\mut-list.mjs`, log `C\mut.log`, đầu ra `C\mut-out\<id>.out`): vá một hay nhiều file của worktree (sửa chữ, hoặc cả file như ở `4217ed4`), chạy test của PR sửa (`packages/ai` cả bộ, thêm test `db` / app khi cần), ghi lại nguyên byte, so sha256 với `git show HEAD:` trước / sau; dòng cuối mỗi lần chạy `git status --short after: ""`. Đối chứng ở SHA ghim trước đó: 23 file test gói C, **929 / 929** xanh (2,8 s). Hai đột biến TSX chạy e2e của repo trên bản dựng **ngoài repo** (`C\build-dist.mjs`: vá → `vite build --outDir` → trả nguyên byte → sha256 = `HEAD`; `C\serve-dist.mjs` cổng 4491–4493; `C\pw.config.mjs`; không dùng cổng 4173). Tái hiện lượt 1–2 chạy trên bản ghim **và** bản chép `4217ed4` (`git archive` → `C\old-4217ed4\`, ngoài repo) trong cùng một tiến trình (`C\hooks-any.mjs`).

| DR6 | Issue → PR | Kết luận | Bằng chứng (tái hiện lượt 1–2 nay ra gì; test nào đỏ khi gỡ phần sửa) | Biến thể / ghi chú (ID phát hiện) |
|---|---|---|---|---|
| 17 | #661 → #698 | **ĐÃ SỬA** | `C\p02-v1-guard.mjs` (log `.log` / `.old.log`). Ca L·CX-C1 (NFD, U+200B trước mỗi dấu): "KH dễ chốt" / "Đề xuất Bảo Việt" / "KH có thể tuổi Tý" / "Theo Điều 35" / "Nghị quyết 12" → V3 / V4 / V5 / V6 / V6 (`4217ed4`: đạt cả 5). Qua ChatGPT web: câu dán NFD + ZWSP → `retry` V4 / V6 (`4217ed4`: `record ACCEPTED`); lần 2 dán lại message thử lại / tin nhắn `web@1` viết NFD + ZWSP → `unusable OWN_MESSAGE` (`4217ed4`: `record REJECTED`). Ca H·CL-C1: "Điều" + U+200B / U+2060 + "35", "Luật" + U+200B + "Kinh doanh…", "khoản 2" + U+200B + "điều 35" → V6 (`4217ed4`: đạt). Gỡ sửa: **R17a** (`cleanText` = NFKC rồi bỏ `\p{Cf}`) → KILLED 12 test (`web.test.ts` "does not count it written NFD with a ZWSP before each mark", "…with a Hangul filler…", "…retry message pasted back written NFD…"; C55); **R17c** (đúng thứ tự, chỉ `\p{Cf}`) → KILLED 5 (C59 U+3164 / U+0085, Hangul filler); **R17d** (`ownLine` của `web.ts` như cũ) → KILLED 3; **R17b** (bốn mẫu V6 về `\s+`) → KILLED 11; từng mẫu riêng R17e (luật) / R17f (Điều) / R17g (khoản) / R17h (điểm) → KILLED 3 / 3 / 3 / 2 | U+3164 / U+0085 / U+2800 / U+034F giữa chữ: chặn (C59, C60, test U+2800). Ký tự trống có bề rộng làm dấu cách đầu cụm: KNOWN G5 §11.8. Dấu viết rời / dấu `´` `¨` giữa hai chữ nay lọt (bản cũ chặn qua bản bỏ dấu cả câu): **CL3-C3** |
| 23 | #661 → #698 | **ĐÃ SỬA** | Ca L·CL-C5: "Tìm hiểu định hướng nơi ở…", "RE chuyển hướng nói…", "Định hướng ngoài giờ…", "…suy nghĩ định hướng…", "…nghĩ định cư…", "khách nông thôn", "sẵn sàng kỹ lưỡng" → **đạt** (`4217ed4`: V5 / V5 / V5 / V6 / V6 / V3 / V3); chữ viết không dấu vẫn chặn: "Xac suat KH dong y cao" V3, "KH la khach nong" V3, "Theo nghi dinh moi" V6. Gỡ sửa: **R23a** (`text-match.ts` như `4217ed4`) → KILLED 30 (C62–C66…); **R23b** (không bản không dấu) → KILLED 84; **R23c** (chỉ bản không dấu) → KILLED 104; **R23d** (TOKEN bỏ nhánh lớp ký tự) → regex lỗi cú pháp lúc nạp `blocklists.ts` (`[a-zà-ỹđ]` thành dải ngược), mọi file test nạp nó không chạy, chỉ 149 / 740 test chạy (bị giết); **R23f** (mục "Bỏ dấu: không" cũng khớp không dấu) → KILLED 56 | Trên 10 637 đoạn chữ thật (K1): 0 khớp trộn, 0 khớp chỉ bản mới. Còn chặn nhầm câu thường có âm tiết **viết đúng không dấu** trùng dạng không dấu của mục ("khách am hiểu" → V3 "khách ấm"…): **CL3-C4** |
| 24 | #661 → #698 | **ĐÃ SỬA** | Ca L·MU-C2 (`p02`): `F0` → "sai định dạng, cần mã dữ kiện dạng F12"; `HOROSCOPE` → "giá trị không hợp lệ, cần một trong: PSYCHOLOGY, ESOTERIC"; thiếu `needs` → "thiếu, cần array"; `hypotheses` là chuỗi → "sai kiểu, cần array"; `HOBBIES` → "…cần một trong: IDENTITY, …, CONCERNS"; `value` null / thiếu → "sai kiểu / thiếu, cần string, number hoặc boolean" (`4217ed4`: "sai định dạng", "giá trị không hợp lệ", "sai kiểu, cần array" cho khối thiếu). Trên màn (K12, `p10`): danh sách "Câu trả lời chưa đạt — còn 1 lần thử" hiện đúng hai `detail` mới, không tràn. Gỡ sửa: **R24a** (`validator.ts` như `4217ed4`) → KILLED 12 (gồm `run.test.ts` "names the right form of each V1 issue in the retry"); R24b (không bao giờ "thiếu") → 4; R24c (`value` chuỗi sai luật báo "sai kiểu") → 3; R24e (`isAt` coi khóa `undefined` là có) → 1; R24f (bỏ danh sách giá trị) → 4; R24g (`invalid_format` về "sai định dạng") → 3. **R24d** (`in` thay `Object.hasOwn`) sống: tương đương (đầu vào từ `JSON.parse`, đường dẫn chỉ gồm khóa schema), như PR #698 ghi | Nhánh `default` coi mọi `invalid_format` là mã F: KNOWN (#698, *Shotgun Surgery*), không bằng chứng mới |
| 77 | #661 → #698 | **ĐÃ SỬA** | Ca lượt 2 K3 (`p02`): 300 chữ + N × U+200B: N = 0 / 700 đạt, lưu ACCEPTED (`output_json` 1 125 / 3 225 B); N = 701 / 1 000 / 20 000 / 650 000 → V1 "quá 1 000 ký tự kể cả ký tự vô hình" (0,1–0,3 ms) và `recordAiAnalysis` từ chối `AI_ANALYSIS_INVALID` (`4217ed4`: mọi N đạt, 650 000 → `output_json` 1 951 125 B, xuất → nhập nhận). Nhập backup (`C\p04-versions.mjs` phần 3, dòng ACCEPTED sửa tay trong file): 300 + 700 nhận; 300 + 701 và 300 + 650 000 → `BACKUP_INVALID` (552 / 596 ms). Gỡ sửa: **R77a** (bỏ trần) → KILLED 13 (`schema.test.ts`, `validator*.test.ts`, `ai-analyses.test.ts`, `backup-invariants.test.ts`); R77b (trần không `abort`) → 4; R77c (trần 10 000) → 9; R77d (`<` thay `<=`) → 4; R77e (`visible` như cũ) → 10; R77f (chữ cái xét trên chuỗi gốc) → 2; R77g (300 đếm trên chuỗi gốc) → 8 | Dòng REJECTED và nhập backup có khóa lạ / U+FEFF hai đầu (650 842 / 650 831 ký tự, nhận): KNOWN G5 §11.8. File dữ liệu lượt 2 có dòng mà V1 cũ cho qua: màn ném lỗi — **CL3-C7** (KNOWN K1, bằng chứng mới) |
| 78 | #658 → #682 | **ĐÃ SỬA** | `C\p03-mock-extraction.mjs` (log `.log`): qua adapter Mock với message của app và `runExtraction` (Mock + V1 + V7) như app. 18 câu lượt 2 (CL2-C2) + 4 câu CX2-C1 ("Anh rể KH…", "Vợ cũ của KH…", "…nếu đã kết hôn…", "-2 con…") → **0 đề xuất** (`4217ed4`: Số con 9 / 7 / 3 / 5 / 2 / 3 / 10…, Độc thân, Đã kết hôn). Câu đúng về KH giữ nguyên ("KH đã kết hôn, có 2 con." → 2 đề xuất). Gỡ sửa: **R78a** (`mock-adapter.ts` như `4217ed4`) → KILLED 25; R78b (bỏ con vật / đồ vật) → 5; R78c (bỏ giả định) → 2; R78d (`NOT_SO` bỏ ước muốn) → 2; R78e (bỏ dòng ông / bà / cô…) → 4; R78f ("vợ chồng" không còn ngoại lệ) → 4; R78g ("độc thân" không cần là từ riêng) → 1; R78h (chỉ "." hết câu, N19d) → 4 | Còn đề xuất sai ở dạng câu ngoài DR6-78 và ngoài KNOWN #628 / #682 (câu hỏi "…đã kết hôn chưa", "có lẽ / hình như", "2 con **của** anh trai", "đã kết hôn nhưng đã ly hôn", "gói cho người đã kết hôn", "3 con Lexus"), giống hệt `4217ed4`: **CL3-C2** |
| 79 | #658 → #682 | **ĐÃ SỬA** | Node (`C\p07-perf.mjs`, CPU 0–2 %): ghi chú một dòng "KH " + "độc thân " × n: 1 803 / 4 503 / 18 003 / **36 003** / 72 003 / 198 003 ký tự → 0,26 / 0,29 / 1,16 / **1,81** / 3,66 / 11,1 ms (`4217ed4` cùng tiến trình: 6,2 / 35,2 / 559,8 / **2 219** ms); "có 2 con và " × 3 000 (36 003) → 0,49 ms (`4217ed4` 902 ms); 198 003 → 2,3 ms. Edge trên bản dựng (`C\p08-mock-long-note.mjs`, cổng 4491): bấm AI trích xuất → đề xuất: 4 503 / 18 003 / 36 003 / 72 003 / 180 003 ký tự → 26 / 32 / **37** / 40 / 91 ms, long task 0 ms (lượt 2: 36 003 → 2 298 ms, long task 2 271 ms). **Đề xuất không đổi** (plan §L3.4): mọi ghi chú RE của dữ liệu tải lượt 3 + seed 3 ngày neo (20/10/2026, 28/02/2026, 31/12/2027): **3 551 ghi chú khác nhau, 0 ghi chú cho đề xuất khác `4217ed4`** (1 332 = 1 332 đề xuất). Gỡ sửa: **R79a** (`wordBefore` tìm lại phần cho mỗi cụm) → KILLED `mock-adapter.test.ts` "reads a one-line note of 36 000 characters … in under 50 ms" (12 976 ms); R79b (quét từ đầu phần tới cụm, như lượt 2) → KILLED (6 436 ms) | R79c (đi lại từ phần đầu cho mỗi cụm) sống: chỉ tốn ở ghi chú nhiều câu, tối đa 127 ms ở 195 000 ký tự (bản ghim 14 ms, `C\p07c-mutant-time.mjs`) — dưới ngưỡng, không ghi phát hiện |
| 89 | #658 → #682 | **ĐÃ SỬA** | **R15d** (`startChatGptWeb` đọc `generation` sau copy / mở trình duyệt) → KILLED `ai-analysis.test.ts` "ties the session to the data its input was taken from, though replaced while it copies (DR6-15)". **R15b** (panel giữ phiên bất kể `generation`) → e2e trên `dist-R15b` (cổng 4492): **1 failed** `customer-ai-web.spec.ts:244` "the session leaves the panel once the data is replaced under it (DR6-15)" (`toBeHidden` failed), 8 passed. **R21c** (`faded={faded && false}` ở `AppointmentAi.tsx:29`) → e2e trên `dist-R21c` (cổng 4493): **1 failed** `appointments.spec.ts:852`, `lowestContrast` **4,44** < 4,5 (dòng 909), 38 passed. Đối chứng bản ghim `dist-base` (cổng 4491): `customer-ai-web` + `appointments` + `customer-appointments` **48 / 48** xanh (25,8 s) | — |
| 97 | #663 → #700 | **ĐÃ SỬA** | `docs/user-guide/10-su-co.md:82` "Dữ liệu gửi AI quá lớn (quá 200.000 ký tự) — rút gọn ghi chú hoặc dữ kiện rồi thử lại." = `vi.ts` `aiError.AI_TOO_LARGE`. `C\guide-quotes.mjs` (probe lượt 2): 23 câu trích trong bảng của `docs/user-guide/*.md` so với `vi.ts`, chỉ còn `09-cai-dat.md:166` (ví dụ đã điền khe của `trash.blocked.TEAM_HAS_LEAD`, khớp) | Ví dụ chip `discovery@2` ở `06-ai.md:49`: **CL3-C6** |
| 102 | #661 → #698 | **ĐÃ SỬA** | Ca lượt 2 K4 (`p02`): "Giữ kỉ luật Thép của KH", "KH tin vào qui luật Thị trường", "Giữ KỈ LUẬT Thép", "KH tin vào QUI LUẬT Thị trường" → **đạt** (`4217ed4`: V6 "luật T" / "LUẬT T"); "Theo Luật Kinh doanh bảo hiểm" vẫn V6. Gỡ sửa: **R102a** (bỏ kỉ, qui) → KILLED 6; R102b (bỏ kỉ) → 3; R102c (bỏ qui) → 3 | "định luật Pareto / Murphy", "giới luật Phật giáo" vẫn bị V6 chặn: **CL3-C5** |

**Đếm bảng R: 9 / 9 ĐÃ SỬA**, 0 SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY. Mục sửa bằng tài liệu (DR6-97): dòng ghi có, khớp `vi.ts`. DR6-79 "nhanh hơn mà đề xuất không đổi": đúng (0 / 3 551 ghi chú khác). Đột biến của bảng R: 43 unit (40 bị giết; sống R24d, R79d tương đương, R79c chỉ tốn ≤ 127 ms) + 2 e2e (bị giết).

## 3. Phạm vi đã đọc

- **Danh sách gói C** (`C\list.mjs` = probe lượt 2, luật `classifyFile` của `tools/size-report-core.mjs`; log `C\list.log`): 60 file, **5 357 SP / 6 464 test** = plan §L3.3.
- **Diff sửa của gói C** (`git diff --numstat 4217ed4 119e2e4` trên 60 file): SP **+199 / −92 ở 9 file**, test **+377 / −23 ở 10 file** (= plan §L3.3). 3 commit chạm gói: `8f7355b` (#698, G5 `@3`), `1502c5e` (#682, Mock trích xuất), `1f71029` (#669: `KycExtraction.tsx` thêm `wrap-anywhere` / `min-w-0`, DR6-82 do gói D kiểm). Đọc từng hunk: `text-match.ts`, `blocklists.ts`, `schema.ts`, `validator.ts`, `web.ts`, `prompts/{analysis,discovery}.ts` (chỉ đổi `version`, chữ prompt không đổi), `mock-adapter.ts`, `KycExtraction.tsx`; test `blocklists.test.ts`, `run.test.ts`, `schema.test.ts`, `validator.test.ts`, `validator-blocklists.test.ts`, `mock-adapter.test.ts`, `web.test.ts`, `prompts.test.ts`, `ai-panel-view.test.ts`, `ai-analysis.test.ts`.
- **Đọc hết ở SHA ghim:** `packages/ai/src/` — `schema.ts` (385), `validator.ts` (295), `text-match.ts` (90), `blocklists.ts` (113), `run.ts` (428), `web.ts` (150), `mock-adapter.ts` (185), `extract-json.ts` (84), `prompts/retry.ts` (63), `settings.ts` (86), `models.ts` (35), `input.ts`, `code-points.ts`, `adapter.ts`, `errors.ts`, `prompts/connection.ts`. App — `data/ai-analysis.ts` (355), `ai-jobs.ts` (82), `ai-tauri.ts` (75); `routes/customers/KycIntelligence.tsx` (595), `KycWebSession.tsx` (188), `KycHistory.tsx` (154), `KycExtraction.tsx` (190), `ai-panel-view.ts` (631), `extraction-view.ts` (106), `use-ai-job.ts` (53); `routes/appointments/AppointmentAi.tsx` (103), `appointment-ai-view.ts` (49); `routes/ai-error-view.ts` (66), `settings-ai-view.ts` (87). `SettingsAi.tsx` (388): không đổi từ lượt 1 ngoài comment DR6-22 (`git diff --stat` rỗng từ `4217ed4`), lượt 1–2 đã đọc hết; lượt này chỉ đọc chỗ dùng `settings-ai-view.ts`.
- **Chỗ gói khác nối vào:** `packages/domain/src/text.ts` (`normalizeText`, K25), `kyc-fact.ts` (`normalizeKycValue`), `kyc-catalog.ts`; `packages/db/src/ai-analyses.ts` (export, `recordAiAnalysis` → `liveCustomer`), `purge.ts` (export), `backup.ts` (định dạng phong bì), `schema.ts` (`kyc_notes`, `kyc_facts`), `customers.ts` (`softDeleteCustomer`); `apps/desktop/src/data/app-data.ts:90–220`, `:370–500` (`generation`, `replacing`, `inTurn`, `replace`, `purgeTrash`); `CustomerProfile.tsx:161`, `:205` (lưới `lg:grid-cols-2 wide:grid-cols-3`); `packages/ui/src/theme.css:63–64` (`--breakpoint-wide: 90rem`); `apps/desktop/src-tauri/tauri.conf.json:17–20` (cửa sổ 1 440 × 900, tối thiểu 1 100 × 700); `playwright.config.ts`, `e2e/serve.mjs`, `e2e/appointments.spec.ts:852–921`; `apps/desktop/src/i18n/vi.ts` (khóa `aiPanel.*`, `aiError.*`).
- **Tài liệu:** `CLAUDE.md` gốc, `packages/ai/CLAUDE.md`, `apps/desktop/CLAUDE.md`, `packages/domain/CLAUDE.md`, `.claude/rules/{i18n-ui,tests}.md`; `docs/design/phase-5-prompts.md` §1, §4–§11 (đủ §8 bảng, §11); `docs/design/phase-5-ai.md` §3, §3.1, §6, §7 (đọc), §8–§12; `docs/design/phase-6-hoan-thien.md` (dòng TR-4, TR-9, TR-11, D1–D13 nói về AI); `docs/golden/ai-eval.md:5`; ADR-0008 phụ lục dọn sạch (`:54–56`); `docs/design/mockups/customer.html:452–461`, `ai.html` (2j, 4i); `docs/user-guide/06-ai.md`, `10-su-co.md`; tổng hợp lượt 2 (§1–§11) và lượt 1 (dòng DR6-16 / 17 / 19 / 22 / 23 / 24, H·MU-C1); báo cáo gốc gói C lượt 2 (Claude, Codex) và lượt 1 (6 báo cáo hai máy); `common\{plan.md §4, §L2.4, §L2.8, §L3.1–§L3.11, known.md, fixes.md (#658 / #682, #661 / #698, #663 / #700), baseline.md}`; `claude\A.md`, `claude\B.md` lượt 3: dòng đầu (bước 0), rồi tìm theo từ khóa (AI, `ai_analyses`, "chỉ thêm", `CONTEXT.md`, tràn…) để không báo trùng — thấy CL3-A23 (tài liệu "không bao giờ xóa") và f-chain-K5 / K6 (AI + dọn sạch) của gói A.

## 4. Kịch bản mới đã thử

| # | Kịch bản (các bước, dữ liệu) | Kết quả | ID |
|---|---|---|---|
| K1 | Cách so "bỏ dấu theo từng chữ" (#698) trên văn bản tiếng Việt thật của repo, bản ghim so `4217ed4` cùng tiến trình (`C\p05-bare-scan.mjs`): 160 mục cụm (116 "Bỏ dấu: có") + 175 matcher; 10 637 đoạn = 1 085 chuỗi `text` của hai lần eval thật (mỗi chuỗi ở đúng khối của nó), mọi dòng `docs/**/*.md` (trừ `docs/reviews`, G5), mọi giá trị `vi.ts`, ghi chú / dữ kiện KYC của seed. Mỗi lần khớp xếp: đúng như mục / toàn không dấu / trộn | Chuỗi eval bị chặn: 0 / 0 (mới / cũ). 149 lần khớp đúng như mục, 3 toàn không dấu, **0 trộn**, **0 lần chỉ bản mới chặn**; 3 lần chỉ bản cũ chặn (đều ở dòng `review-notes.md:256` chép câu chặn nhầm của DR6-23) | không thấy |
| K2 | Âm tiết **đúng chính tả không dấu** trùng dạng không dấu của một chữ trong mục "Bỏ dấu: có" (`C\p06-edges.mjs` a): "khách am hiểu", "khách am tường", "khách lanh lợi", "định hướng noi theo", "làm IT khả năng…" | Bị chặn V3 "khách ấm" / "khách ấm" / "khách lạnh", V5 "hướng nội", V3 "ít khả năng" — giống hệt `4217ed4`; 0 lần trong eval / `vi.ts` | CL3-C4 |
| K3 | "luật" sau một chữ G5 không miễn, trước chữ hoa (`p06` b): "định luật Pareto / Murphy / Parkinson", "giới luật Phật giáo"; đối chứng "quy luật Pareto", "đạo luật Doanh nghiệp", "luật chơi" | "định luật …", "giới luật …" → V6 "luật P / M / P"; "quy luật Pareto" đạt; "đạo luật Doanh nghiệp" V6 (đúng: văn bản pháp lý); giống `4217ed4`; 0 lần trong eval | CL3-C5 |
| K4 | Dấu viết rời / ký tự NFKC viết thành dấu cách + dấu, trong hoặc giữa các chữ của một mục (`p06` c): "xác" + U+0301 + " suất", "xác " + U+0301 + "suất", "xác" + U+00B4 + "suất", "xác" + U+00A8 + "suất", "Prude" + U+0301 + "ntial", "Đie" + 2 × U+0300 + "u 35" | `4217ed4`: V3 "xác suất" cả bốn ca đầu (bản bỏ dấu cả câu bỏ mọi dấu); **bản ghim: đạt cả bốn**. "Prudéntial" vẫn V4 (mẫu `pru [a-z…]`); "Điè̀u 35" đạt ở cả hai | CL3-C3 |
| K5 | Mock trích xuất, đề xuất cũ ↔ mới trên ghi chú thật (`C\p03-mock-extraction.mjs` phần 2): mọi ghi chú nguồn RE của dữ liệu tải lượt 3 (2 292 khác nhau) + seed demo 3 ngày neo (20/10/2026, 28/02/2026, 31/12/2027) | 3 551 ghi chú khác nhau, **0 khác** (1 332 = 1 332 đề xuất: 670 "Độc thân", 662 "Đã kết hôn") | không thấy |
| K6 | Mock trích xuất, dạng câu chưa có ở lượt 1–2 và KNOWN #628 / #682 (`p03` phần 3, 22 câu): câu hỏi có / không ("Lần gặp sau hỏi KH đã kết hôn chưa.", "Cần hỏi lại KH có 2 con không?"), phỏng đoán / nghe nói ("Có lẽ…", "Hình như…", "Nghe nói…"), người khác nêu **sau** cụm ("nuôi 2 con của anh trai", "chăm 3 cháu của chị gái"), "đã kết hôn nhưng đã ly hôn", chủ thể chung ("gói cho người đã kết hôn", "dành cho người độc thân"), "con" của đồ vật ngoài danh sách ("3 con Lexus", "2 con robot") | Mỗi câu ra 1–2 đề xuất sai cho KH, **giống hệt `4217ed4`**; "Chưa rõ…", "Không biết…" đúng 0; câu đúng về KH giữ đề xuất | CL3-C2 |
| K7 | `prompt_version` sau `@3` (`C\p04-versions.mjs`): seed 3 ngày neo + dữ liệu tải lượt 3; một backup **do code lượt 2** (`4217ed4`: seed + `exportBackup` của bản chép) nhập bằng code ghim → panel / lịch sử → Phân tích Mock + câu dán ChatGPT web hôm nay cùng KH → xuất → nhập | Seed / dữ liệu tải chỉ `analysis@3`, `discovery@3` (22 + 41; 45 + 58). Backup lượt 2: `@2` giữ nguyên chữ, `aiPanelView` CURRENT `analysis@2`, `historyRows` ["analysis@2","CURRENT","kyc v11"]; lần chạy mới ghi `analysis@3` và `analysis@3+web@1`; xuất → nhập giữ cả `@2` lẫn `@3` | không thấy |
| K8 | DR6-77 ở luật nhập backup (`p04` phần 3): dòng ACCEPTED sửa tay trong file backup, `text` = 300 chữ + 700 / 701 / 650 000 × U+200B | 700 nhận (570 ms); 701, 650 000 → `BACKUP_INVALID` (552 / 596 ms). Hai dạng G5 §11.8 (khóa lạ, U+FEFF hai đầu) nhận: KNOWN | không thấy |
| K9 | AI và Dọn sạch Thùng rác, qua `openAppData` + storage giả + adapter giữ yêu cầu (`C\p09-purge-ai.mjs`): S1 phân tích KH X → xóa X → dọn → AI về; S2 phân tích KH Y đang dùng, AI về **trong lúc** dọn (backup bị giữ); S3 AI về sau khi dọn; S4 phiên ChatGPT web của Y lưu trong / sau khi dọn; S5 phiên web của X sau khi X bị dọn; S6 AI trích xuất ghi chú của X; S7 X bị dọn rồi nhập backup cũ trước khi AI về | S1 `discarded` (lịch sử X: `CUSTOMER_NOT_FOUND`); S2 `replacing()` = true, `discarded`, Phân tích lại sau đó `saved ACCEPTED` (D10, S2-3); S3 `saved ACCEPTED`, `generation` 0 (spec TR-11: "Lần chạy AI của KH chưa xóa về sau lúc dọn vẫn lưu"); S4 `replacing` rồi `saved ACCEPTED`; S5 `discarded`; S6 trả đề xuất (không lưu, không màn nào hiện); S7 `discarded` (`generation` 1). `reportError`: 0 lần ở cả 7 ca. (S1–S3, S5 trùng ý f-chain-K5, K6 của gói A lượt 3, chạy độc lập; S4 lưu **trong lúc** dọn, S6, S7 là phần thêm) | không thấy |
| K10 | Chi phí V3–V6 sau khi đổi cách so (`C\p07-perf.mjs`, `C\p07b-cold.mjs`): phân tích lớn nhất schema cho (35 chuỗi) với 299 chữ có dấu / chuỗi NFD / 300 + 700 U+200B; `checkWebAnswer` 19 990 ký tự; lần kiểm đầu tiên của tiến trình (dịch regex), 7 tiến trình mỗi bản | `validateOutput` 2,0 / 2,3 / 2,9 ms (`4217ed4` 2,7 / 2,3 / 3,1); `checkWebAnswer` 2,8 ms (3,0); lần kiểm đầu **136 ms** (`4217ed4` 196 ms) — regex mới chạy trên một bản thay vì hai | không thấy |
| K11 | Mock trích xuất trên Edge với ghi chú rất dài (`C\p08-mock-long-note.mjs`, bản dựng ghim, cổng 4491): 4 503 → 180 003 ký tự | 26 → 91 ms bấm → đề xuất, long task 0 ms, 0 lỗi trang, 0 request ra ngoài | không thấy |
| K12 | Panel KYC Intelligence và khối AI chi tiết lịch hẹn, Edge trên bản dựng ghim, qua màn: KH có dữ kiện → Phân tích bằng ChatGPT web → dán câu trả lời → Kiểm tra và lưu (`C\p10-panel-layout.mjs`, `p10b`, `p10c`, ảnh `p10d-*.png`): câu trả lời thường; mọi `text` là link có `-` / `?&=`, chuỗi mã `F1/F2/…/F20` (90 ký tự), một email 70 ký tự, 290 chữ liền (V1 cho qua); ở 1 440 × 900 (cỡ cửa sổ exe), 1 280 × 720, 1 100 × 800, 1 600, 1 920 | Câu trả lời thường, **1 440 × 900**: bảng "Lịch sử phân tích" có hàng `discovery@3+web@1` · "ChatGPT web" làm badge **CURRENT tràn 17 px ra ngoài khung panel** (khung 376 px, cuộn trong 24 px; badge "ChatGPT web" gãy hai dòng); 1 600 / 1 920 không tràn. Link có `-` / `?&=` xuống dòng được. `F1/…/F20`: chữ chạy **141 px** ra ngoài panel, trang cuộn ngang **117 px** (1 440); khối AI chi tiết lịch hẹn **181 px**, trang cuộn **157 px** (cả 1 440 lẫn 1 280); email: 144 / 184 px. 290 chữ liền: trang cuộn ngang **1 994 / 1 370 / 1 550 px** (1 440 / 1 280 / 1 100). 0 lỗi trang, 0 request ra ngoài | CL3-C1 |
| K13 | File dữ liệu do **code lượt 2** ghi, có dòng ChatGPT web mà V1 cũ cho qua (300 chữ + 701 U+200B; `text` chỉ U+3164), mở bằng lớp dữ liệu bản ghim như exe mở `project2c.db` (`C\p12-old-file.mjs`) → view của panel, lịch sử, khối AI chi tiết lịch hẹn → xuất rồi đọc lại | Mở được (schema 12). `aiPanelView`, `historyRows` chạy; **`analysisContent` và `appointmentAiView` ném `ZodError`** ("quá 1 000 ký tự kể cả ký tự vô hình" / "chuỗi rỗng") → `Analysis` / `AppointmentAi` ném khi render. Xuất → đọc lại: `BACKUP_INVALID` | CL3-C7 |
| K14 | Đột biến thêm ở phần sửa DR6-79 không có trong PR (`mut-list.mjs`: R79c, R79d), cộng đo chi phí (`C\p07c-mutant-time.mjs`) trên ghi chú nhiều câu ("KH độc thân. " × 15 000 = 195 000 ký tự; "Em trai KH độc thân, KH có 2 con; " × 5 500) | R79c (đi lại các phần từ đầu cho mỗi cụm) sống cả bộ `mock-adapter.test.ts` (74 / 74): 127 ms so 14 ms ở 195 000 ký tự, 16 ms so 5 ms ở câu trộn — dưới ngưỡng 200 ms ở cỡ ghi chú lớn nhất (≈ 198 000 ký tự, trên nữa là `AI_TOO_LARGE`). R79d (phần bắt đầu ở chính dấu câu) sống: tương đương | không thấy |

## 5. Phát hiện mới

### CL3-C1 — Panel KYC Intelligence và khối AI chi tiết lịch hẹn tràn khung: bảng lịch sử ở cửa sổ mặc định 1 440 khi có hàng ChatGPT web; chữ AI có chuỗi liền dài làm cả trang cuộn ngang

```
ID: CL3-C1
Mức: Low
Trục: C (E, A)
Vị trí: apps/desktop/src/routes/customers/KycHistory.tsx:49-52 (bảng 5 cột `w-full border-collapse`), :86 (ô Prompt `{row.prompt}`), :95 (badge trạng thái); apps/desktop/src/routes/customers/KycIntelligence.tsx:165-169 (`Item`: `<li>` + `{item.text}`, không `wrap-anywhere` / `min-w-0`); apps/desktop/src/routes/appointments/AppointmentAi.tsx:29 (dùng chung `Item`); packages/ui/src/theme.css:64 (`--breakpoint-wide: 90rem`); apps/desktop/src-tauri/tauri.conf.json:17-18 (cửa sổ 1 440 × 900) (119e2e4)
Tình trạng: CONFIRMED
Liên quan: DR6-82 (cùng loại "chuỗi liền tràn cột": #669 chỉ thêm `wrap-anywhere` cho chữ ghi chú KYC và dòng đề xuất trích xuất), DR6-30 (bố cục 3 cột từ #623) · có từ trước, lượt 1–2 bỏ sót
Kịch bản: K12
```

- **Mô tả:** Từ DR6-30, hồ sơ KH có 3 cột từ 1 440 px (`wide:`), đúng cỡ cửa sổ mặc định của exe; panel KYC Intelligence còn ≈ 376 px. (a) Bảng "Lịch sử phân tích" 5 cột (mockup `ai.html` 2j / 4i; `customer.html` để "đủ cột" cho 2j) không co được dưới bề rộng tối thiểu của ô Prompt `discovery@3+web@1` (một chuỗi liền) và hai badge, nên sau một lần lưu từ ChatGPT web, badge CURRENT tràn ra ngoài khung panel và badge "ChatGPT web" gãy hai dòng. (b) `Item` in nguyên `text` của AI trong `<li>` không có `overflow-wrap`; một chuỗi liền (mã "F1/F2/…", email, link không có `-` / `?&=`, hay ≤ 300 chữ liền mà V1 cho qua) chạy ra ngoài panel / khối AI của chi tiết lịch hẹn (≈ 336 px) và làm cả trang cuộn ngang. #669 sửa đúng loại lỗi này cho cột ghi chú KYC nhưng không chạm hai component này.
- **Tái hiện / bằng chứng:** Edge, bản dựng ghim (`C\build-dist.mjs` → `dist-base`, cổng 4491), mọi bước qua màn: tạo KH + ghi chú KYC có 3 dữ kiện → "Phân tích bằng ChatGPT web" → dán câu trả lời → "Kiểm tra và lưu".
  ```
  node p10c-history-width.mjs 4491   (câu trả lời thường, đo phần tử lá vượt mép phải khung panel)
  1440×900 after a Mock analysis:        {"cardWidth":376,"scroll":0,"pageScrollX":0,"past":[]}
  1440×900 after a ChatGPT web answer:   {"cardWidth":376,"scroll":24,"pageScrollX":0,"past":[{"tag":"span","past":17,"text":"CURRENT"}]}
  1600×900 after a ChatGPT web answer:   {"cardWidth":429,"scroll":0,"pageScrollX":0,"past":[]}
  $env:P10_TEXT='Hỏi lại các dữ kiện F1/F2/…/F20'; node p10b-link-layout.mjs 4491
  1440×900 panel, link 90 ký tự:              {"pageScrollX":117,"width":376,"scroll":142,"textPastBox":141}
  1440×900 appointment detail AI block:       {"pageScrollX":157,"width":336,"scroll":182,"textPastBox":181}
  1280×720 appointment detail AI block:       {"pageScrollX":157,"width":336,"scroll":182,"textPastBox":181}
  node p10-panel-layout.mjs 4491   (290 chữ liền)
  1440×900 290 chữ liền (295 ký tự): {"pageScrollX":1994,"panelWidth":376,"panelScroll":2019,"itemPastCard":2036}
  1280×720 290 chữ liền (295 ký tự): {"pageScrollX":1370,"panelWidth":1000,"panelScroll":1395,"itemPastCard":1412}
  ```
  Ảnh: `C\p10d-history-1440.png` (badge CURRENT vượt viền khung, "ChatGPT web" gãy dòng), `C\p10d-run-1440.png` (chữ chạy ra ngoài màn). Link có `-` hay `?&=` thì xuống dòng được (`p10b`: 0 px).
- **Ảnh hưởng:** (a) mọi RE dùng exe ở cỡ cửa sổ mặc định và từng lưu một phân tích ChatGPT web: khung panel lệch, badge chạm mép cửa sổ (chỉ sai hiển thị). (b) chỉ khi câu trả lời có một chuỗi liền ≳ 45 ký tự (mã nối bằng "/", email, link lạ; ChatGPT web có thể kèm link nguồn) — trang hồ sơ / màn Lịch hẹn có thanh cuộn ngang tới hàng trăm hay ≈ 2 000 px.
- **Đề xuất:** thêm `min-w-0 wrap-anywhere` cho chữ của `Item` (như #669 làm ở `KycExtraction.tsx:105`, `:141`); bảng lịch sử cho ô Prompt xuống dòng (`wrap-anywhere` / `break-all`) và badge không co (`whitespace-nowrap`), hoặc gộp KYC · Prompt · Provider vào một ô ở bố cục 3 cột như `customer.html:457`. ≈ 3–6 dòng SP + một ca e2e đo `scrollWidth` ở 1 440 (cùng mẫu e2e DR6-82).

### CL3-C2 — Mock trích xuất còn đề xuất sai cho KH ở sáu dạng câu ngoài danh sách DR6-78 và ngoài ghi chú KNOWN #628 / #682

```
ID: CL3-C2
Mức: Low
Trục: C (E)
Vị trí: packages/ai/src/mock-adapter.ts:117-132 (SOMEONE_ELSE, SUPPOSED, NOT_SO: chỉ xét từ đứng TRƯỚC cụm), :163-170 (aboutTheKh), :73-77 (NOT_CHILDREN), :93-100 (mẫu "đã kết hôn", "độc thân") (119e2e4)
Tình trạng: CONFIRMED
Liên quan: DR6-78 (biến thể còn hở); cùng họ ghi chú KNOWN #682 "Chỉ ghi lại: … vẫn còn đề xuất sai ngoài danh sách DR6-78" — bằng chứng mới: các dạng câu dưới không có trong danh sách đó · có từ trước, lượt 1–2 bỏ sót (giống hệt `4217ed4`)
Kịch bản: K6
```

- **Mô tả:** Sau #682, Mock chỉ bỏ cụm khi người khác / giả định / phủ định–ước muốn đứng **trước** cụm trong câu (vế). Các dạng sau vẫn cho đề xuất sai về KH — trái quy tắc 1 của `extraction@1` ("chỉ đề xuất điều ghi chú nói rõ về khách hàng") mà Mock mô phỏng: câu hỏi có / không mà từ phủ định đứng **sau** ("…đã kết hôn chưa", "…có 2 con không?"); phỏng đoán / nghe nói ("Có lẽ…", "Hình như…", "Nghe nói…"); người khác nêu sau cụm ("2 con **của** anh trai", "3 cháu của chị gái"); đã kết hôn rồi ly hôn; chủ thể chung ("gói cho người đã kết hôn"); "con" là loại từ của đồ vật ngoài danh sách ("3 con Lexus", "2 con robot").
- **Tái hiện:** `node p03-mock-extraction.mjs` (log `C\p03-mock-extraction.log`, phần 3), qua `runExtraction` (Mock + V1 + V7) như app; cột trái = `4217ed4`, phải = bản ghim (`=` là giống hệt):
  ```
  "Lần gặp sau hỏi KH đã kết hôn chưa."        = maritalStatus=Đã kết hôn «kết hôn»
  "Cần hỏi lại KH có 2 con không?"              = childrenCount=2 «2 con»
  "Có lẽ KH đã kết hôn."                        = maritalStatus=Đã kết hôn «kết hôn»
  "Hình như KH có 2 con."                       = childrenCount=2 «2 con»
  "KH đang nuôi 2 con của anh trai đã mất."     = childrenCount=2 «2 con»
  "KH chăm 3 cháu của chị gái."                 = childrenCount=3 «3 cháu»
  "KH đã kết hôn nhưng đã ly hôn năm 2020."     = maritalStatus=Đã kết hôn «kết hôn»
  "KH hỏi về gói cho người đã kết hôn."         = maritalStatus=Đã kết hôn «kết hôn»
  "KH sở hữu 3 con Lexus."                      = childrenCount=3 «3 con»
  "KH mua 2 con robot hút bụi."                 = childrenCount=2 «2 con»
  "Chưa rõ KH đã kết hôn." / "Không biết KH đã kết hôn chưa."  = 0 (đúng)
  ```
  Ghi chú thật (dữ liệu tải + seed, K5): 3 551 ghi chú, 0 khác `4217ed4` — các dạng trên không có trong dữ liệu giả lập hiện nay.
- **Ảnh hưởng:** RE dùng Mock (provider mặc định khi chưa có key, bản web, nghiệm thu) thấy đề xuất sai, phải tự Bỏ; đề xuất không tự lưu (spec §8) nên không sai dữ liệu đã lưu. Dạng "…hỏi KH đã kết hôn chưa" là câu việc-cần-làm hay gặp trong ghi chú sau buổi gặp. OpenCode thật không bị ảnh hưởng.
- **Đề xuất:** giữ "Narrow on purpose": bỏ cụm khi trong cùng câu có (sau cụm) "chưa / không" ở cuối câu hỏi hay dấu "?", có từ phỏng đoán ("có lẽ", "hình như", "nghe nói", "chắc là"), "của <người khác>" ngay sau "<n> con / cháu", "ly hôn" sau "đã kết hôn", "người" trước "đã kết hôn / độc thân"; thêm các câu trên vào `mock-adapter.test.ts`. ≈ 10–20 dòng SP + 15 dòng test.

### CL3-C3 — Sau #698, dấu viết rời hoặc dấu `´` `¨` chen giữa / trong các chữ của một mục cho câu lọt V3–V6 (bản cũ chặn)

```
ID: CL3-C3
Mức: Low
Trục: G
Vị trí: packages/ai/src/text-match.ts:34-37 (matchText: chỉ còn bản gốc và bản có dấu), :84-90 (bareToo: mỗi chữ "đúng như mục hoặc không dấu"); 4217ed4 text-match.ts có `folded: fold(accented)` bỏ mọi `\p{M}` của cả câu (119e2e4)
Tình trạng: CONFIRMED
Liên quan: DR6-23, DR6-17 (cùng họ "ký tự làm lọt V3–V6") · mới do đợt sửa lượt 2 (PR #698)
Kịch bản: K4
```

- **Mô tả:** #698 bỏ "bản bỏ dấu của cả câu" để hết chặn nhầm (DR6-23). Bản đó cũng là chỗ duy nhất bỏ được dấu tổ hợp không ghép vào chữ nào: dấu đứng sau một dấu cách, hay ký tự tương thích mà NFKC viết thành dấu cách + dấu (U+00B4 `´` → " ́", U+00A8 `¨` → " ̈"). Nay một dấu như vậy giữa hai chữ của cụm, hay một dấu thừa trên chữ ("xáć"), làm cụm không khớp. G5 §11.3 đã liệt kê phần "Mất" là chữ viết sai dấu, giữ `đ` bỏ dấu thanh, hai dấu thanh chồng nhau; dạng dấu rời **giữa hai chữ** (không thuộc chữ nào) và ký tự `´` `¨` không có trong danh sách đó.
- **Tái hiện:** `node p06-edges.mjs` (log `C\p06-edges.log`, phần c), `validateOutput('analysis', …)` với một `hypotheses[0].text`, cột trái `4217ed4`, phải bản ghim:
  ```
  "KH có xáć suất đồng ý cao"      V3 có "xác suất"  →  đạt
  "KH có xác ́suất đồng ý cao"     V3 có "xác suất"  →  đạt
  "KH có xác´suất đồng ý cao"      V3 có "xác suất"  →  đạt
  "KH có xác¨suất đồng ý cao"      V3 có "xác suất"  →  đạt
  ```
- **Ảnh hưởng:** chỉ khi câu trả lời (model hoặc câu dán ChatGPT web) có dấu rời đúng chỗ đó — output suy biến (G5 §10.10: model không đối kháng); trên màn RE vẫn đọc ra "xác suất". 0 lần trong 1 085 chuỗi eval thật (K1).
- **Đề xuất:** ở bước 0 (`cleanText`) bỏ thêm dấu tổ hợp không đứng sau chữ cái sau NFKC (`/(?<!\p{L}\p{M}*)\p{M}+/gu`), hoặc ghi dạng này vào phần "Mất" của G5 §11.3 / §11.8 nếu Owner chấp nhận (đổi luật so khớp là G5). ≈ 1–3 dòng SP + 4 ca kiểm.

### CL3-C4 — Mục "Bỏ dấu: có" vẫn chặn câu thường có âm tiết **đúng chính tả không dấu** trùng dạng không dấu của chữ trong mục ("khách am hiểu" → "khách ấm")

```
ID: CL3-C4
Mức: Nit
Trục: G
Vị trí: packages/ai/src/text-match.ts:84-90 (bareToo); G5 §7 mục 2 docs/design/phase-5-prompts.md:223; mục packages/ai/src/blocklists.ts:40-43 ("khách nóng · khách lạnh · khách ấm…"), :70-73 ("hướng nội…"), :27 ("…ít khả năng") (119e2e4)
Tình trạng: CONFIRMED
Liên quan: DR6-23 (biến thể còn hở: #698 hết chặn nhầm chữ có dấu khác, không xét chữ không dấu là chữ thật) · có từ trước, lượt 1–2 bỏ sót
Kịch bản: K1, K2
```

- **Mô tả:** Luật mới cho mỗi chữ "đúng như mục hoặc viết không dấu". Nhiều âm tiết tiếng Việt vốn không có dấu ("am" trong "am hiểu", "lanh" trong "lanh lợi", "noi" trong "noi theo", "IT"), nên câu viết đúng chính tả vẫn được coi là bản không dấu của mục.
- **Tái hiện:** `node p06-edges.mjs` (phần a): "KH là khách am hiểu tài chính…" → V3 "khách ấm"; "Nhóm khách am tường thị trường…" → V3 "khách ấm"; "KH là khách lanh lợi…" → V3 "khách lạnh"; "Hỏi KH về định hướng noi theo…" → V5 "hướng nội"; "KH làm IT khả năng tăng thu nhập…" → V3 "ít khả năng" (giống `4217ed4`). Quét K1: 0 lần trong 1 085 chuỗi eval, `docs`, `vi.ts`, seed.
- **Ảnh hưởng:** model viết đúng câu đó → tốn một lần thử, lặp lại thì REJECTED; chưa gặp trong eval thật.
- **Đề xuất:** gộp vào đợt G5 sau: với chữ của mục mà dạng không dấu là một âm tiết thật ("ấm" → "am", "lạnh" → "lanh", "nội" → "noi", "ít" → "it"), chỉ nhận dạng không dấu khi **mọi** chữ của cụm cùng không dấu ("khach am"), hoặc chuyển riêng các chữ đó sang "Bỏ dấu: không". ≈ 5–10 dòng + ca kiểm §8.5.

### CL3-C5 — V6 "luật <Tên>" chặn "định luật Pareto", "giới luật Phật giáo" (chỉ miễn sau "pháp", "kỷ / kỉ", "quy / qui")

```
ID: CL3-C5
Mức: Nit
Trục: G
Vị trí: packages/ai/src/blocklists.ts:95 (LAW_NAME) — đúng chữ G5 §8.4 docs/design/phase-5-prompts.md:302 (119e2e4)
Tình trạng: CONFIRMED
Liên quan: DR6-102 (cùng loại: chữ đứng trước "luật" mà G5 chưa miễn) · có từ trước, lượt 1–2 bỏ sót
Kịch bản: K3
```

- **Mô tả:** "định luật" (quy luật tự nhiên / kinh nghiệm), "giới luật" (tôn giáo) không phải văn bản pháp lý nhưng theo sau là tên riêng viết hoa nên khớp mục V6; "quy luật Pareto" (cùng nghĩa) thì đạt.
- **Tái hiện:** `node p06-edges.mjs` (phần b): "KH chi tiêu theo định luật Pareto…" → V6 "luật P" (kèm V3 "%" của câu); "KH tin vào định luật Murphy…" → V6 "luật M"; "KH áp dụng định luật Parkinson…" → V6 "luật P"; "KH giữ giới luật Phật giáo…" → V6 "luật P"; "KH tin vào quy luật Pareto…" → đạt; "Theo đạo luật Doanh nghiệp" → V6 (đúng). Giống `4217ed4`; 0 lần trong eval / `vi.ts`.
- **Ảnh hưởng:** model nhắc "định luật Pareto" (nguyên tắc 80/20, hay gặp khi bàn chi tiêu) → tốn một lần thử, lặp lại thì REJECTED.
- **Đề xuất:** đợt G5 sau thêm "định", "giới" vào danh sách chữ đứng trước "luật" được miễn (như "kỉ", "qui" ở §11.4). 1 dòng + 2 ca kiểm.

### CL3-C6 — Hướng dẫn sử dụng còn ví dụ chip `discovery@2`, app nay ghi `discovery@3`

```
ID: CL3-C6
Mức: Nit
Trục: C
Vị trí: docs/user-guide/06-ai.md:49 ("chế độ và phiên bản prompt (ví dụ `discovery@2`)") ↔ packages/ai/src/schema.ts:309-313 (`PROMPT_VERSIONS` `@3`) (119e2e4)
Tình trạng: CONFIRMED
Liên quan: K28 · mới do đợt sửa lượt 2 (PR #698 đổi `@3`; Issue #661 không có file hướng dẫn trong danh sách)
Kịch bản: K7
```

- **Mô tả:** `06-ai.md:49` tả chip "kyc v… · … · … · …" của panel, lấy ví dụ `discovery@2`; mọi phân tích mới (seed, Mock, OpenCode) nay ghi `discovery@3` / `analysis@3`, ChatGPT web `…@3+web@1`. (Phần spec Phase 5 §7.1 / `CONTEXT.md:38` vẫn nói phân tích AI "chỉ thêm, không xóa" trái phụ lục ADR-0008 + TR-11: gói A đã báo, **CL3-A23** — không báo lại.)
- **Tái hiện / bằng chứng:** `git grep -n -E "(analysis|discovery)@[0-9]" -- docs/user-guide` → `06-ai.md:49` (`discovery@2`), `11-thuat-ngu.md:93` (ví dụ dạng chung `analysis@1`, `discovery@2` — đúng nghĩa từ điển, không phải câu trên màn); `p04-versions.log`: seed 3 ngày neo và lần chạy hôm nay ghi `@3`.
- **Ảnh hưởng:** người đọc hướng dẫn thấy ví dụ khác chip trên màn (ảnh `06-ai-phan-tich.png` chụp lại ở G7 theo HANDOFF).
- **Đề xuất:** PR docs: đổi ví dụ ở `06-ai.md:49` thành `discovery@3` (hoặc bỏ số phiên bản khỏi ví dụ). 1 dòng.

### CL3-C7 — File dữ liệu lượt 2 có dòng AI mà V1 cũ cho qua: bản v1.0 mở được file nhưng panel AI và chi tiết lịch hẹn của KH đó ném lỗi khi render, bản xuất không nhập lại được

```
ID: CL3-C7
Mức: Low
Trục: D (E)
Vị trí: apps/desktop/src/routes/customers/ai-panel-view.ts:467, :497, :510 (`analysisInputSchema` / `analysisOutputSchema` / `discoveryOutputSchema.parse` của schema hiện tại trên dòng đã lưu), apps/desktop/src/routes/appointments/appointment-ai-view.ts:37 (gọi `analysisContent`); packages/ai/src/schema.ts:119-134 (V1 mới) (119e2e4)
Tình trạng: KNOWN (K1: "siết luật … Owner nạp lại; Schema AI đổi thì nạp lại") — bằng chứng mới: hậu quả là màn lỗi, không chỉ nhập backup bị từ chối
Liên quan: DR6-77 · mới do đợt sửa lượt 2 (PR #698: V1 chặt hơn), có thể gặp ở mọi lần siết schema AI sau này
Kịch bản: K13
```

- **Mô tả:** #698 siết V1 (trần 1 000 ký tự gốc, phần thấy được theo K20). Dòng `ACCEPTED` do bản cũ lưu mà nay trái V1 không bị kiểm lại khi mở file (chỉ nhập backup kiểm), nhưng panel đọc `output_json` bằng `analysisOutputSchema.parse` của schema hiện tại, nên ném `ZodError` khi vẽ bản phân tích của KH đó (và khối AI ở chi tiết mọi lịch hẹn của KH đó).
- **Tái hiện:** `node p12-old-file.mjs` (log `C\p12-old-file.log`): code `4217ed4` ghi hai dòng ChatGPT web ACCEPTED (`text` = 300 chữ + 701 U+200B; `text` = U+3164) → `d.export()` → `openAppData` bản ghim với storage trả file đó:
  ```
  round 2 code saved for Khách Dài   ACCEPTED discovery@2+web@1
  pinned app opened the round 2 file schema 12
    aiPanelView                      ["CURRENT","ACCEPTED"]
    analysisContent                  THROWS ZodError: … "message": "quá 1 000 ký tự kể cả ký tự vô hình"
    appointmentAiView                THROWS ZodError: … "quá 1 000 ký tự kể cả ký tự vô hình"
    (Khách Lấp) analysisContent      THROWS ZodError: … "chuỗi rỗng"
  export → read of that data         từ chối BACKUP_INVALID
  ```
- **Ảnh hưởng:** chỉ với `Project2C-data\` do exe trước #698 ghi **và** có câu trả lời AI suy biến (hàng trăm ký tự vô hình, hay chỉ U+3164) — dữ liệu giả lập hiện nay không có (K5, K7). Khi gặp: mở hồ sơ KH đó hay chọn lịch hẹn của KH đó → hộp lỗi màn (ErrorBoundary); xuất backup được nhưng không nhập lại được.
- **Đề xuất:** Owner xác nhận K1 vẫn đủ cho v1.0 (nạp lại dữ liệu giả lập, không có dữ liệu thật); nếu muốn chặt hơn trước khi có dữ liệu thật: `analysisContent` đọc bằng `safeParse` và hiện dòng như REJECTED / "không đọc được" thay vì ném (≈ 10 dòng SP + 1 ca test).

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `pnpm exec tsc -p packages/ai/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters`; cùng lệnh cho `apps/desktop/tsconfig.json` | SHA ghim | exit 0, 0 dòng cả hai | — |
| `pnpm codemap:check` | bản đồ export | "Export maps are up to date." | — |
| Nơi dùng mọi export (`C\exports.mjs` = scanner lượt 2, `git grep -w` ở `HEAD`; log `C\exports.log`) | 36 file SP của gói C | 20 export không có nơi dùng SP ngoài file, **đúng danh sách lượt 2** (kiểu dữ liệu; `issueLine`, `runAfter`, `WebTools`, `AiSettingsStore` chỉ test dùng; `ConfirmProposal` = DR6-66 KNOWN). `packages/ai`: mọi export có nơi dùng; `fold` (vẫn export) dùng trong `bareToo` và `blocklists.test.ts`; `MatchText.folded` đã bỏ | — |
| Dependency | `git diff --stat 4217ed4 119e2e4 -- packages/ai/package.json apps/desktop/package.json pnpm-lock.yaml` | không đổi | — |
| `pnpm lint:deps` | `common\baseline.md` | 0 vi phạm (320 module, 1 312 phụ thuộc); `schema.ts` thêm `normalizeText` của `@p2c/domain`: đúng ranh giới `ai-schema-standalone` | — |
| Phần `packages/ai` trong bundle: esbuild có sẵn trong `node_modules` (`C\b1-ai-bundle.mjs`, minify, `zod` / `@p2c/domain` để ngoài) | bản ghim ↔ `4217ed4` | `index.ts` 46 881 B (gzip 14 624) so 45 085 B (13 856): **+1 796 B / +768 B gzip**; `mock-adapter.ts` +1 194 B, `validator.ts` +699 B, `text-match.ts` +119 B. Trong +18 263 B của `assets/index.js` so lượt 2 (`baseline.md`) | — |
| Code lặp | diff của gói | Đã có ở KNOWN: `nfdZw` ×2 + chuỗi ZWSP lặp ở test (#698), `visible = (s) => normalizeText(s)` (*Middle Man*, #698), `aboutTheKh` chia câu hai lần (#682). Không thêm khối lặp ≥ 3 nơi | — |
| Cỡ dòng | `size-report` (`baseline.md`) | C: SP 5 357 (+107 so lượt 2), test 6 464 (+354), 60 file (0) | — |

Không có phát hiện B.

### 6.2 Hiệu năng

Máy Home PC `DESKTOP-KDURKJP`, Node v24.20.0; đo 20:40–21:05, CPU 0–4 % trước mỗi lần chạy, tiến trình app Codex mở nhưng nhàn, 3 server `vite preview` của phiên (cổng 4491–4493) nhàn. Dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (lượt 3) qua `importBackup`: 103 `ai_analyses` (ACCEPTED, MOCK), 96 KH có phân tích, tối đa 20 phiên bản KYC / 19 dữ kiện mỗi KH. Mốc: lượt 2 Claude C (cùng máy, `docs/reviews/raw/2026-10-17/claude/C.md` §6.2), exe: `common\baseline.md` (probe trên exe ghim so mốc sau #656). Luật nhiễu: xấu hơn khi quá 20 % **và** quá 10 ms.

| Thao tác | Lần | Lượt 3 trung vị (min–max) | Lượt 2 (cùng máy) | Δ | Ngưỡng | ID |
|---|---:|---|---|---|---|---|
| Phần AI của hồ sơ KH (đọc + cổng + view + nội dung + lịch sử + dòng help), mỗi KH sống có phân tích (`C\p11-panel-perf.mjs` = probe lượt 2) | 95 | 0,40 ms (0,25–4,47) | 0,36 ms | +0,04 ms | thao tác màn < 200 ms ✅ | — |
| Như trên, KH nhiều phân tích nhất / riêng phần tính lúc render | 20 | 0,34 / 0,05 ms | 0,32 / 0,03 ms | trong nhiễu | ✅ | — |
| Khối AI chi tiết lịch hẹn | 20 | 0,30 ms | 0,28 ms | trong nhiễu | ✅ | — |
| `validateOutput` phân tích lớn nhất schema cho (35 × 299 ký tự) | 20 | 1,99 ms (1,92–124,1 lần đầu dịch regex) | 2,79 ms | −0,8 ms | ✅ | — |
| Lần kiểm V3–V6 đầu tiên của một tiến trình (`p07b`, 7 tiến trình) | 7 | 136,2 ms (131,9–139,7) | `4217ed4` cùng lúc: 196,2 ms | −60 ms | một lần mỗi phiên app | — |
| `checkWebAnswer` dán 12 446 / 19 750 ký tự toàn `{` | 20 | 2,72 / 0,11 ms | 3,00 / 0,11 ms | trong nhiễu | bấm Kiểm tra và lưu ✅ | — |
| `extractJson` câu suy biến 100 800 ký tự | 5 | 1,10 ms | 1,10 ms | 0 | ✅ | — |
| `validateOutput` một `text` 300 chữ + 0 / 200 000 / 650 000 U+200B | 5 | 0,20 / 0,08 / 0,06 ms (từ chối ở trần) | 0,49 / 3,93 / 12,36 ms (nhận) | nhanh hơn | ✅ | — |
| Mock trích xuất, ghi chú thật ×40 (4 640 ký tự) | 5 | 0,37 ms | 0,50 ms | trong nhiễu | ✅ | — |
| Mock trích xuất một dòng 18 003 / 36 003 / 72 003 / 180 003–198 003 ký tự | 3 / 5 / 5 / 3 | 1,2–1,5 / 1,8 / 3,7–5,5 / 5,3–11,1 ms | 570 / 2 042 / 8 759 / 22 311 ms | ×400–2 000 nhanh hơn | < 200 ms ✅ | — (DR6-79) |
| Edge, bản dựng: bấm AI trích xuất → đề xuất, ghi chú 4 503 / 18 003 / 36 003 / 72 003 / 180 003 ký tự | 1 | 26 / 32 / 37 / 40 / 91 ms, long task 0 | 73 / 512 / 2 298 ms | nhanh hơn | < 200 ms ✅ | — |
| Exe (`baseline.md`): `customer.open-ai` / `customer.ai-history` | 5 | 19 / 2 ms | mốc sau #656: 19 / 2 ms | 0 / 0 | < 200 ms ✅ | — |
| Mutant R79c (nhiều câu, 195 000 ký tự) — chỉ để biết giá của một hồi quy test không bắt | 1 | 127 ms | bản ghim 14 ms | — | < 200 ms | — |

Không có phát hiện P: không thao tác nào của gói C xấu hơn lượt 2 cùng máy theo luật nhiễu; cờ exe của `baseline.md` (so lượt 2: `app.open-data` ⚠️, K24) không thuộc gói C.

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | | CL3-C1, CL3-C2 | CL3-C7 (KNOWN) | CL3-C3 | | | | | | 4 |
| Nit | | | CL3-C6 | | CL3-C4, CL3-C5 | | | | | | 3 |
| **Tổng** | 0 | 0 | 3 | 1 | 3 | 0 | 0 | 0 | 0 | 0 | **7** |

Đếm theo trục chính (trục phụ trong khuôn: CL3-C1 thêm E, A; CL3-C2 thêm E; CL3-C7 thêm E). **6 CONFIRMED, 0 PLAUSIBLE, 1 KNOWN có bằng chứng mới** (CL3-C7, K1). Bảng R: 9 / 9 ĐÃ SỬA. Phát hiện "mới do đợt sửa lượt 2": CL3-C3 (#698), CL3-C6 (#698), CL3-C7 (#698, KNOWN K1); biến thể còn hở của phần sửa / có từ trước: CL3-C1 (DR6-82), CL3-C2 (DR6-78), CL3-C4 (DR6-23), CL3-C5 (DR6-102).

## 8. Đã xét, không thấy

- **R:** 9 DR6 (17, 23, 24, 77, 78, 79, 89, 97, 102) đều ĐÃ SỬA (mục 2). 45 đột biến: 42 bị giết (40 unit, 2 e2e), 3 sống (R24d, R79d tương đương; R79c chỉ tốn ≤ 127 ms). Không phần sửa nào làm hỏng chỗ trước đó đúng ở đường thường: K1 (0 / 10 637 đoạn chữ thật bị bản mới chặn mà bản cũ không), K5 (0 / 3 551 ghi chú cho đề xuất Mock khác), e2e AI đối chứng 48 / 48, vitest gói C 929 / 929.
- **E:** phiên web và AI qua Dọn sạch Thùng rác ở mọi thời điểm (K9: 7 ca); dữ liệu cũ `@2` nhập vào bản mới (K7); file cũ mở thẳng (K13 → CL3-C7); V1 ở biên 700 / 701 / 1 000 ký tự, NFD 900, U+3164, U+0085, chạy dài khoảng trắng (đã có test + `p02`); Mock trên ghi chú 198 000 ký tự và nhiều câu (K11, K14); dấu rời / ký tự tương thích (K4 → CL3-C3). Chuỗi dán chỉ ký tự vô hình vẫn tính một lần thử (`checkWebAnswer` dùng `trim()` của JS): đã bị bác ở review đối kháng #698 (G5 §11.8 / thân PR), không bằng chứng mới. Dòng phân cách U+2028 / U+0085 không tách dòng khi nhận diện tin nhắn của app: như trên.
- **C:** spec Phase 5 §3.1, §6.2, §6.4, §8 ↔ code sau #698 / #682: khớp (trừ §3.1 mục 3 — KNOWN #698; §7.1 "chỉ thêm" trái phụ lục ADR-0008 — gói A đã báo, CL3-A23). G5 §2 / §3 chữ prompt: `git diff 4217ed4 119e2e4 -- packages/ai/src/prompts/` chỉ đổi dòng `version` + comment; `prompts.test.ts` so nguyên văn. G5 §5, §11.6 ↔ `schemaDetail`: khớp từng dòng bảng §11.6 (`p02`). `docs/golden/ai-eval.md:5` đã ghi `@3`. Mockup `ai.html` 2j / 4i ↔ bảng lịch sử: đúng cột, nhưng tràn ở 3 cột (CL3-C1). Nhãn panel / trích xuất không đổi.
- **D:** AI chỉ ghi `ai_analyses` qua `app.run(recordAiAnalysis)`; dọn sạch xóa phân tích của KH đã xóa mềm (S1, S5, S7 của K9) mà không đụng KH đang dùng (S3, S4: lưu ACCEPTED); nhập backup kiểm V1 mới (K8); `@2` giữ nguyên chữ qua xuất / nhập (K7). Seed / dữ liệu tải ghi đúng `PROMPT_VERSIONS` (`@3`). Thấy CL3-C7 (KNOWN K1).
- **G:** V1 mới (trần, K20), V3–V6 sau bước 0 mới và bản không dấu theo từng chữ (K1–K4), `LAW_NAME` (K3), nhận diện tin nhắn của app NFD + ZWSP (`p02`), `detail` V1 mới đi vào message thử lại và danh sách lỗi trên màn (`p02`, `p10`). Thấy CL3-C3, CL3-C4, CL3-C5. Chữ tương hình (Cyrillic…), ký tự trống làm dấu cách đầu cụm, REJECTED lưu output lớn: KNOWN G5 §10.10 / §11.8.
- **S:** không đổi từ lượt 2: key chỉ qua lệnh Rust (`ai-tauri.ts`), `AppAi.save` 4 trường, URL ChatGPT hằng, câu trả lời model hiện bằng text node (e2e `customer-ai-web.spec.ts:361` xanh trên bản dựng, 48 / 48). Regex mới (`bareToo`) dựng từ danh sách tĩnh lúc nạp module, không từ dữ liệu người dùng; regex Mock tuyến tính (K11, K14). Mọi probe trình duyệt chặn mạng ngoài 127.0.0.1 từ lần chạy đầu (`context.route` + `--host-resolver-rules`, thay `window.open` / clipboard): "blocked requests: 0" ở mọi log; không chạy exe, không gọi OpenCode, không đọc key.
- **P:** mục 6.2; không thấy.
- **B:** mục 6.1; không thấy.
- **T:** test của #698 / #682 đỏ khi gỡ đúng phần sửa (mục 2). Chỗ sống: R24d (tương đương), R79d (tương đương), R79c (giá ≤ 127 ms — test DR6-79 chỉ giữ ghi chú một dòng, đủ cho mục tiêu Issue). Các test hở Mock đã ghi ở KNOWN #682 không đếm lại. Test gói C không phụ thuộc ngày hệ thống (dùng `TODAY` / đồng hồ ghim).
- **A:** focus, `aria-live`, vai trò của panel / phiên web / trích xuất không đổi từ lượt 2 (diff gói C không chạm phần này ngoài `KycExtraction.tsx` thêm class); tương phản khối mờ giữ ≥ 4,5 (R21c bị e2e giết). Bố cục tràn: CL3-C1 (trục phụ A).

## 9. Phụ lục

### 9.1 Probe, log

Mọi file ở `C:\workspace\deep-review-1-6-r3\claude\C\` (41 MB, gồm ba bản dựng `dist-*` và `pw-results\`). Probe Node nạp TypeScript của repo qua hook, chỉ đọc repo, chỉ ghi trong thư mục này.

| File | Việc | Log / đầu ra | Dùng ở |
|---|---|---|---|
| `hooks.mjs` | hook nạp TS (chép từ `r2\claude\C\hooks.mjs`, `LOAD` = dữ liệu tải lượt 3) | — | `p11` |
| `hooks-any.mjs` | hook nạp TS cho bản ghim **và** `old-4217ed4\` trong cùng tiến trình; gói `@p2c/*` nạp từ cây cũ thì lấy của cây cũ | — | p02–p12, b1 |
| `old-4217ed4\` | `git archive 4217ed4 packages/{domain,db,ai}/src packages/db/migrations apps/desktop/src tools/size-report-core.mjs` (282 file) | — | mọi so sánh cũ ↔ mới |
| `list.mjs` | 60 file gói C theo `classifyFile` (probe lượt 2) | `list.log` | mục 3 |
| `mut.mjs`, `mut-list.mjs` | đột biến: vá → vitest → trả nguyên byte → sha256 = `HEAD` | `mut.log`, `mut-out\<id>.out` | mục 2, K14 |
| `build-dist.mjs`, `serve-dist.mjs`, `pw.config.mjs`, `browser.mjs` | bản dựng ngoài repo (`VITE_DEMO_ANCHOR=15/09/2026` như `playwright.config.ts`, snapshot demo như `e2e/serve.mjs`), `vite preview` cổng 4491 (`dist-base`) / 4492 (`dist-R15b`) / 4493 (`dist-R21c`), Playwright Edge chặn mạng ngoài 127.0.0.1 (`--host-resolver-rules`, `context.route`), thay `window.open` / clipboard | `build-dist.log`, `serve-449x.*.log`, `serve-pids.txt`, `e2e-base.log`, `e2e-R15b.log`, `e2e-R21c.log`, `pw-results\` | DR6-89, K11, K12 |
| `p02-v1-guard.mjs` | tái hiện lượt 1–2 của DR6-17 / 23 / 24 / 77 / 102 | `p02-v1-guard.log`, `.old.log` | mục 2 |
| `p03-mock-extraction.mjs` | Mock trích xuất: câu lượt 2, ghi chú thật cũ ↔ mới, câu mới | `p03-mock-extraction.log`, `p03-diffs.json` (rỗng) | DR6-78, K5, K6, CL3-C2 |
| `p04-versions.mjs` | `prompt_version` seed / tải / backup lượt 2; DR6-77 ở nhập backup | `p04-versions.log` | K7, K8 |
| `p05-bare-scan.mjs` | quét V3–V6 cũ ↔ mới trên 10 637 đoạn chữ thật | `p05-bare-scan.log` | K1 |
| `p06-edges.mjs` | âm tiết không dấu, "định luật", dấu viết rời | `p06-edges.log` | K2–K4, CL3-C3–C5 |
| `p07-perf.mjs`, `p07b-cold.mjs`, `p07c-mutant-time.mjs` | chi phí Mock / V1–V6 / `checkWebAnswer` cũ ↔ mới; lần kiểm đầu; giá của R79c | `p07-perf.log`, `p07b-cold.log`, `p07c-mutant-time.log` | DR6-79, K10, K14, mục 6.2 |
| `p08-mock-long-note.mjs` | Mock trích xuất trên Edge, ghi chú dài (từ probe lượt 2) | `p08-mock-long-note.log` | DR6-79, K11 |
| `p09-purge-ai.mjs` | AI và Dọn sạch qua `openAppData` | `p09-purge-ai.log` | K9 |
| `p10-panel-layout.mjs`, `p10b-link-layout.mjs`, `p10c-history-width.mjs`, `p10d-shots.mjs` | bố cục panel / khối AI chi tiết lịch hẹn | `p10-panel-layout.log`, `p10b-link-layout.log`, `p10b-codes-layout.log`, `p10b-email-layout.log`, `p10c-history-width.log`, `p10d-history-1440.png`, `p10d-run-1440.png` | K12, CL3-C1 |
| `p11-panel-perf.mjs` | = `r2\claude\C\p07-perf.mjs` (phần AI của hồ sơ trên dữ liệu tải) | `p11-panel-perf.log` | mục 6.2 |
| `p12-old-file.mjs` | file dữ liệu do code lượt 2 ghi, mở bằng bản ghim | `p12-old-file.log` | K13, CL3-C7 |
| `guide-quotes.mjs` | câu trích trong hướng dẫn ↔ `vi.ts` (probe lượt 2) | `guide-quotes.log` | DR6-97 |
| `exports.mjs` | nơi dùng mọi export (probe lượt 2) | `exports.log` | mục 6.1 |
| `b1-ai-bundle.mjs` | cỡ thu gọn của `packages/ai` cũ ↔ mới (esbuild sẵn có) | `b1-ai-bundle.log` | mục 6.1 |

Lần chạy lỗi của probe (lỗi probe, không phải sản phẩm): `p05` lần 1 (cột `value` không có, đúng là `value_json`), lần 2 (PowerShell làm hỏng chuỗi SQL khi sửa) → sửa bằng Edit; `p04` / `p03` lần 1 (seed của cây cũ nạp `@p2c/ai/schema` của bản ghim nên ghi `@3`) → `hooks-any.mjs` thêm ánh xạ gói của cây cũ, chạy lại; `p10b` lần 1 đo `document.querySelector('aside')` (có thể trúng sidebar) → đo qua locator của chính panel / khối chi tiết.

### 9.2 Đột biến (45)

Chạy `node mut.mjs` 20:32–20:35 (41) và `node mut.mjs R79c R79d` 21:03 (2); e2e của hai đột biến TSX 20:51–20:53. Lệnh test: `pnpm exec vitest run <file…>` ở gốc repo (`packages/ai` = 740 test; thêm `ai-analysis.test.ts` → 798; thêm `ai-analyses.test.ts` + `backup-invariants.test.ts` → 910; `mock-adapter.test.ts` riêng = 74).

- **KILLED (42):** R17a (12), R17b (11), R17c (5), R17d (3), R17e (3), R17f (3), R17g (3), R17h (2); R23a (30), R23b (84), R23c (104), R23d (regex lỗi khi nạp, 149 / 740 test chạy), R23f (56); R24a (12), R24b (4), R24c (3), R24e (1), R24f (4), R24g (3); R77a (13), R77b (4), R77c (9), R77d (4), R77e (10), R77f (2), R77g (8); R78a (25), R78b (5), R78c (2), R78d (2), R78e (4), R78f (4), R78g (1), R78h (4); R79a (1, 12 976 ms), R79b (1, 6 436 ms); R102a (6), R102b (3), R102c (3); R15d (1); e2e: R15b (`customer-ai-web.spec.ts:244`), R21c (`appointments.spec.ts:852`, 4,44 < 4,5).
- **SỐNG (3):** R24d (`in` thay `Object.hasOwn`: tương đương, PR #698 đã nêu), R79d (phần bắt đầu ở chính dấu câu: tương đương), R79c (đi lại các phần từ đầu: chỉ tốn ≤ 127 ms ở ghi chú lớn nhất, K14).
- Dòng cuối cả hai lần chạy `mut.log`: `git status --short after: ""`; ba lần `build-dist.mjs`: "restored (sha256 = HEAD)", `git status --short after: ""`.

### 9.3 Cuối phiên

- Ba server `vite preview` (PID 28208 / 27820 / 10528, cổng 4491–4493) đã tắt; cổng 4491–4495 không còn nghe. Không mở exe, không chạy `pnpm e2e` (cổng 4173), không gọi OpenCode / chatgpt.com, không đọc key; mọi log trình duyệt "blocked requests: 0".
- Không mở / liệt kê / tìm kiếm `…\codex\` hay `…\muse\` của lượt nào, không liệt kê `C:\workspace\`, `deep-review-1-6*\`. File ngoài repo đã mở theo tên đầy đủ: `common\{prompt-claude.md, plan.md, known.md, fixes.md, baseline.md, load\load-2026-10-12-seed6.p2cbackup}`, `claude\A.md`, `claude\B.md` (lượt 3: dòng đầu, rồi tìm theo từ khóa), `deep-review-1-6-r2\claude\C\{hooks.mjs, list.mjs, mut.mjs, p02-v1-lawname.mjs, p03-mock-extraction.mjs, p07-perf.mjs, p08-mock-long-note.mjs, browser.mjs, build-dist.mjs, serve-dist.mjs, pw.config.mjs, guide-quotes.mjs, exports.mjs}` (probe lượt 2 của chính Claude); ba file memory của phiên.
- `git status --short` cuối phiên (`C:\workspace\Project-2C-review`, 21:14 và 21:16): rỗng (như đầu phiên); `git rev-parse HEAD` → `119e2e45cbce54d8a3943757bd826a7f1e9b694f`.
- Giờ xong: 2026-10-20 21:16 (+07, `Get-Date`).
