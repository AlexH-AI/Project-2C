XONG — claude gói C lượt 5, 2026-11-04 23:57 (+07:00)

# Deep review Phase 1–6, lượt 5 — Claude, gói C (AI)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | claude (ID `CLR5`) |
| Gói | C — AI (`packages/ai/**`; file AI của app) |
| SHA đầu phiên | `37a80b662861d308a110d1e2b0f65ad13b91fb51` (khớp SHA ghim) |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-11-04 23:12 (+07:00) |
| Công cụ | Claude Code, app desktop (tab Code), Windows 11, worktree `C:\workspace\Project-2C-review` |
| Model | Claude Opus 5.5 (`claude-opus-5-5`) |
| Mức suy luận | do Owner chọn trong app; phiên không đọc được giá trị cụ thể |
| Ultracode | tắt (tin nhắn mở phiên không bật; không dùng subagent / Workflow) |
| Bước 0 | `{GÓI}` = C; `claude\C.md` chưa có → làm mới; `A.md`, `B.md` đều dòng đầu `XONG` |

## 2. Bảng R

**Cách làm.** Probe Node nạp TypeScript của repo (`C\hooks-any.mjs`), chạy bản ghim và bản chép `2e51e25` (`git archive` → `C\old-2e51e25\`, ngoài repo) trong cùng tiến trình. Đột biến "gỡ phần sửa" (`C\mut.mjs` + `C\mut-list.mjs`, log `C\mut.log`, đầu ra `C\mut-out\<id>.out`): vá file của worktree, chạy `node node_modules/vitest/vitest.mjs run <file…>` ở gốc worktree (không qua `pnpm`), trả nguyên byte, so sha256 với `git show HEAD:` trước / sau; dòng cuối lần chạy: `git status --short after: ""`. Đối chứng ở SHA ghim: `packages/ai/src` + `ai-jobs` + `ai-analysis` + `listeners` + `routes/customers` **1 855 / 1 855** xanh (23:20). Lần chạy 23:20–23:22: **25 đột biến, 25 bị giết, 0 sống**. Node v24.20.0 (`C:\Program Files\nodejs` đặt đầu PATH).

### 2.1 Bảng R1

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-137 (phần C) | #896 → #907 (+ #933 → #946) | **ĐÃ SỬA** (phần gói C) | Bằng chứng chính ở `claude\A.md` (dòng DR6-137: lệnh và luật nhập 12, đột biến `R137-*` bị giết). Phần `ai`: nhãn mà app ghi được (`C\p15-labels.mjs`, log `p15-labels.log`): 3 model của `AI_MODELS` (`glm-5.3`, `kimi-k3`, `deepseek-v4.1-flash`) qua `isLabel` / `readsBackAsIs`; `MOCK`, `CHATGPT_WEB` ghi `model` null (`AI_ANALYSIS_NO_MODEL`); 4 `prompt_version` (`analysis@5`, `discovery@5`, `…+web@1`) qua `isLabel` | Nhãn chỉ có ký tự vô hình: `claude\A.md` CLR5-A3 (không có đường từ màn: model chọn trong danh sách đóng) |
| DR6-141 | #899 → #917 (+ #930 → #937, #931 → #939, #950 → #956, #960 → #963) | **ĐÃ SỬA** | Tái hiện lượt 4 (`C\p03-mock.mjs` phần 1a, log `p03-mock.log`; qua `runExtraction` = Mock + V1 + V7 như app): 18 câu sai của CLR4-C1 + 2 câu của CXR4-C1 ("Thông tin KH độc thân là sai.", "Khẳng định KH có 2 con là sai.") `2e51e25` ra đề xuất → ghim **0 ở cả 20**. Mô tả DR6 ở tổng hợp lượt 4 §6.3 (luật chỉ xét chữ đứng trước cụm; phủ định / bác bỏ ở vế sau) đã đổi thành danh sách cho phép. Gỡ phần sửa: **R141a** (`mock-adapter.ts` như `2e51e25`) KILLED 218 / 701; **R141b** (bỏ cổng câu kể đơn) KILLED 127; **R141c** (bỏ `RETRACTED`) KILLED 6 | 23 câu DR6-121 (phần 1b): 19 giữ kết quả; đổi có chủ ý theo K42 / PR #917, #939: "KH đã kết hôn nhưng đã ly hôn năm 2020." 0 → Ly hôn (luật 2), "KH đã kết hôn hai lần, hiện đã ly hôn và độc thân." Độc thân → 0 và "KH có 1 con riêng và 1 con chung." 1 → 0 (hướng an toàn, thân PR #917 ghi). Ghi chú thật (phần 2): 3 556 ghi chú RE khác nhau (dữ liệu tải lượt 5 + seed 3 ngày neo + X01–X05 của `ai-eval.md`): 640 đổi, **cả 640 chỉ thêm "Ly hôn" từ dòng "Hôn nhân: Ly hôn"** (thân PR #939: +640); 1 332 → 1 972 đề xuất (670 Độc thân, 662 Đã kết hôn, 640 Ly hôn); X01–X05: 0 đề xuất ở cả hai bản. Biến thể mới: mục 4, 5 |
| DR6-142 | #900 → #909, #913 (+ #930 → #937) | **ĐÃ SỬA** | Tái hiện DSR4-C1 (`C\p06-g5.mjs` phần a, log `p06-g5.log`), `2e51e25` → ghim: "phần" + NUL + "trăm" đạt → V3 `có "phầntrăm"`; "xác" + NUL + "suất" đạt → V3; "IN" + NUL + "TJ" đạt → V5; "Điều" + NUL + "35" đạt → V6; "Lu" + NUL + "ật Kinh doanh" đạt → V6; "Pru" + NUL + "dential" V4 `có "Pru"` → V4 `có "Prudential"`. Gỡ phần sửa: **R142a** (`cleanText` giữ NUL) KILLED 18 (C80, C81…); **R142b** (NUL thành dấu cách) KILLED 12 | Biến thể: NUL giữa từng chữ của "xác suất", NUL + U+200B + NUL, NUL trước dấu NFD ("xa" + NUL + U+0301 + "c suất") → V3 như bản không NUL; 50 NUL đầu chuỗi → V3; `text` chỉ NUL / NUL + U+200B → V1 "không có chữ" (như trước); "KH thích" + NUL + "đọc sách" đạt. Phần "Mất" §14.5 (NUL làm dấu cách ngay cạnh cụm: "KH có" + NUL + "xác suất cao" V3 → đạt, V4 / V6 tương tự) và "Được" ("Ato" + NUL + "mic") đúng như Owner chấp nhận (K43). Dán lại tin nhắn `web@1` có NUL đầu / cuối / giữa mỗi dòng: `2e51e25` retry (lần 2 REJECTED) → ghim `OWN_MESSAGE` ở lần 1 và lần 2 (`p06-g5c.log`); NUL thay mọi dấu xuống dòng → retry ở cả hai bản (cả tin nhắn thành một dòng, như dán đã nối dòng), không ghi phát hiện |
| DR6-143 | #900 → #909, #913 (+ #930 → #937) | **ĐÃ SỬA** | Tái hiện CLR4-C2 (`p06-g5` phần b): "KH dùng dịch vụ môi giới Luật Kinh doanh bảo hiểm cho phép", "Ranh giới Luật Đất đai…", "Môi giới Luật Kinh doanh bảo hiểm 2022", "Vùng biên giới Luật Biên phòng…", "…thế giới Luật Thừa kế…" `2e51e25` đạt → ghim V6. Gỡ phần sửa: **R143a** ("giới" luôn được miễn, như `@4`) KILLED 9 (C82, ô §8.4); **R143b** (bỏ "thế") KILLED 2 | Biến thể bị chặn đúng: viết hoa toàn bộ / "Môi Giới", nhiều dấu cách, `-` / `_`, U+200B / NUL / NBSP / xuống dòng giữa "môi" và "giới", NFD. Giữ đạt (C78, C83): "giới luật Phật giáo", "GIỚI LUẬT Phật giáo", "định luật Pareto"; "tranh giới Luật …" đạt (ranh giới từ, có ca của PR); "quy định Luật …" V6 (C79). Tác dụng phụ đã duyệt: "Vì thế giới luật Phật giáo…" và "KH thích thế giới luật Phật giáo" nay V6 (K43); "nữ giới Luật Lao động…" vẫn đạt ("Mất" §14.3, K43) |
| DR6-144 | #899 → #917 (+ #933 → #946) | **ĐÃ SỬA** | Tái hiện CLR4-C3 (`C\p09-kept.mjs`, log `p09-kept.log`; `openAppData` + storage giả + adapter ném `AI_TIMEOUT`, job khởi chạy như `useAiJob` với `keptFailures(app)`): S1 lỗi giữ lại rồi Nhập backup **cùng dữ liệu** → `kept` null (lượt 4: còn lỗi); S2 rồi Nạp lại → null. Gỡ phần sửa: **R144a** (`kept` bỏ so `generation`) KILLED 3; **R144b** (`keptFailures` trả `generation` hằng) KILLED 2 (ca qua `openAppData` của `ai-analysis.test.ts`); **R144c** (đọc `generation` lúc bắt đầu job thay vì lúc kết thúc) KILLED 1 | Biến thể: S3 lỗi giữ lại rồi Dọn sạch Thùng rác (cùng DB, `generation` giữ) → vẫn hiện (đúng: cùng dữ liệu); S4 Nhập backup hỏng ở bước backup (dữ liệu không đổi) → vẫn hiện (đúng); S5 lỗi của AI trích xuất (`extraction:<id ghi chú>`) rồi Nhập backup → null; S6 job đang chạy khi Nhập backup bắt đầu, lỗi về sau khi nhập → `discarded`, không giữ (DR5-36) |

Đếm R1 (5 dòng gói C): **5 / 5 ĐÃ SỬA** (DR6-137: phần gói C; phần `db` ở `claude\A.md`), 0 SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY.

### 2.2 Bảng R2

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-329 | #930 → #937 | **ĐÃ SỬA** | Mục tiêu "không đổi hành vi" (`C\t329-parity.mjs`, log `t329-parity.log`): hai bản chép `97876b4` (ngay trước #937) và `b6d4388` (#937), mỗi bản một tiến trình, ghi (1) mọi `RegExp` dựng lúc nạp `@p2c/ai` (Proxy như thân PR), (2) Mock trích xuất trên 681 chuỗi của hai file test Mock ở `b6d4388` và 60 000 ghi chú ghép đôi từ chúng, (3) V3–V6 trên 812 chuỗi của test G5: **61 703 / 61 703 dòng giống hệt** (210 regex cùng thứ tự). Code ở SHA ghim: `unlessAfter(word, before)` dựng cả hai ngoại lệ (`blocklists.ts:97-98`, `:108`; file không đổi từ `b6d4388`); `NUL` chỉ khai ở `test-support.ts:23`; chú thích `ownLine` nêu NUL (`web.ts:84-86`); `namingTheKh` (`mock-extraction.ts:216-228`); `aboutTheKh` không còn (tách thành `saysOfTheKh` / `simpleStatement` ở T-330), chú thích "Độc thân: KH đã kết hôn." ở `:857-861`; `mockExtractionOutput` không qua `index.ts`. Gỡ phần sửa: refactor không có đường lỗi để gỡ; các dòng T-330 / T-336 dưới gỡ trên file tách | `git log --follow` của `mock-extraction.ts` thấy lịch sử cũ (thân PR); merge squash nên `git blame` cần `-C` (ghi chú sổ đã RESOLVED). Hành vi đổi sau đó là của T-330, T-336 (K42) |
| T-330 | #931 → #939 | **ĐÃ SỬA** | Mọi câu test chấp nhận của Issue là ca của `mock-extraction.test.ts`; bốn luật và các ca vòng sửa @`aa1d257` đều đỏ khi gỡ: **R330a** (giá trị đầu thắng, luật 1) KILLED 62; **R330b** (không Ly hôn) KILLED 20; **R330c** (Góa từ "vợ đã mất" không cần "Đã kết hôn" trước) KILLED 2; **R330d** (không trừ con đã mất) KILLED 11; **R330e** ("bé" ngoài `PEOPLE`) KILLED 5; **R330f** (không nhận "li") KILLED 3; **R330g** (bỏ luật ":") KILLED 3; **R330h** ("bé nhỏ" sau số đếm cũng là cỡ) KILLED 3; **R330i** (cụm bị `endedBy` kết thúc để giá trị trước đứng) KILLED 3. Seed / dữ liệu tải: +640 Ly hôn, không đổi khác (dòng DR6-141) | Biến thể của các ghi chú sổ gom (RESOLVED #917, #937): "KH đã kết hôn, Lan độc thân." → 0, "KH đã kết hôn rồi ạ." → 0 (`p03b`, mục 4). Câu mới quanh bốn luật: mục 4 (K1–K5) |
| T-332 (phần C: `AiJobs` qua `notify`) | #933 → #946 | **ĐÃ SỬA** (phần gói C) | `ai-jobs.ts:72` `const changed = () => notify(listeners, reportError);`. Gỡ: **R332c** (vòng gọi trần, không `try`) KILLED "reports a listener that throws, still telling the others, and gives the job it started (review of PR 911)" | Phần `listeners.ts` và hai store khác: `claude\B.md` dòng T-332; phần `readsBackAsIs`: `claude\A.md` |
| T-336 | #950 → #956 | **ĐÃ SỬA** (phần gói C) | Test chấp nhận có đủ trong `mock-extraction.test.ts` (bốn câu của quyết định 02/11, ba ca ghim ∅ cũ nay Ly hôn, "!!", hai ca "chỉ vế không có chữ cái", hai ca ngoại lệ Số con của luật 3). Gỡ: **R336a** (KH chỉ mang sang vế liền sau, như trước #956) KILLED 7; **R336b** (không bỏ dấu đầu dòng) KILLED 2; **R336c** (`NAMES_NO_ONE` bỏ "góa vợ / chồng", đường mà ghi chú gỡ chép nêu) KILLED 1. `WIDOWED` khai một lần (`:131`) và dùng lại ở `NAMES_NO_ONE` (`:143`); `CHILD_WORD` ở `PEOPLE`, `COUNT`, `DEAD_CHILDREN`, `CHILD`, mẫu số con (`:88`, `:109`, `:182`, `:334`, `:342`, `:425`) | Phần `.dependency-cruiser.cjs` và "File hay tìm": gói F. Biến thể quanh luật mang KH: mục 4 (K3) |
| T-339 | #960 → #963 | **ĐÃ SỬA** (phần gói C) | (1) Bảng 36 000 ký tự đo so với ghi chú ngắn: **R339b** (quét ngược tới đầu câu cho mỗi cụm, như trước #682) KILLED 9 hàng (1 217–1 609 ms), đúng 9 hàng PR nêu. (2) Ca qua dòng "KH đã kết hôn.\nSống ở quận 7.\nCó 2 con.": **R339a** (`carried = !!last?.endsOnTheKh`, đột biến của Issue) KILLED 2 (ca mới và ca một dòng) | Phần hằng `AI_TEST_FILES` của dependency-cruiser: gói F. Thời gian thật của bảng: mục 6.2 |

Đếm R2 (5 Issue của gói C): **5 / 5 ĐÃ SỬA** (T-332, T-336, T-339: phần gói C). Refactor T-329 không đổi hành vi (61 703 dòng giống hệt); `listeners.ts` qua `AiJobs` giữ hợp đồng (R332c).

## 3. Phạm vi đã đọc

- **Gói C ở SHA ghim** (`common\baseline.md`, luật xếp gói của `tools/size-report-core.mjs`): 65 file, 6 580 SP / 8 202 test. **Diff `2e51e25..37a80b6` của gói C** (`git diff --numstat -M`): SP +1 051 / −498 ở 11 file, test +1 396 / −733 ở 10 file (= `baseline.md`); 7 commit: `1eab296` (#913), `5d13f5a` (#917), `b6d4388` (#937), `36a63e7` (#939), `66019cc` (#946), `a7877e5` (#956), `ee01e41` (#963).
- **Đọc hết ở SHA ghim (phần diff đọc từng hunk):** `packages/ai/src/mock-extraction.ts` (950, cả file), `mock-adapter.ts` (73), `test-support.ts` (đầu file tới `mockRequest` / `completeMock`), `blocklists.ts` (`QUY`, `GIOI_OF`, `unlessAfter`, `LAW_NAME`), `text-match.ts` (`cleanText` và chú thích đầu file), `web.ts` (`startWebAnalysis`, `ownLine`, `checkWebAnswer`), `schema.ts` (`AI_ANALYSIS_NO_MODEL`, `PROMPT_VERSIONS`), `prompts/{analysis,discovery,extraction}.ts` (dòng `version`), `validator.ts` (`filterExtraction`, `valueOf`); app: `data/ai-jobs.ts` (cả file), `data/listeners.ts`, `data/ai-analysis.ts` (`analyseCustomer`, `replaced`, `lost`, `keptFailures`, `extractFromNote`), `routes/customers/use-ai-job.ts` (cả file), `extraction-view.ts` (`extractionView`, `held`), `KycExtraction.tsx` (chỗ gọi `extractFromNote`, `onConfirm`). Diff của `ai-analysis.ts`, `use-ai-job.ts`, `text-match.ts`, `blocklists.ts`, `web.ts`, `schema.ts`, hai file prompt: đọc đủ (`git diff 2e51e25 37a80b6`). Test: tên và cấu trúc của `mock-extraction.test.ts` (36 khối, 701 ca cùng `mock-adapter.test.ts`), các ca mà đột biến chạm (mục 9).
- **Chỗ gói khác nối vào:** `packages/db/src/common.ts` (`cleanNote`, `isLabel`, `readsBackAsIs`), `db/src/kyc.ts` (`normalizeKycValue`), `db/src/ai-analyses.ts` (luật model), `db/src/seed.ts` (`kycSimulation`: ghi chú seed nối dòng bằng "; "), `seed-data.ts` (`maritalStatus` 'Độc thân' / 'Đã kết hôn' / 'Ly hôn'); `packages/domain/src/text.ts` (`LINE_BREAK`, `normalizeNote`), `kyc-fact.ts` (`childrenCount` số nguyên, 0 hợp lệ); `apps/desktop/src/data/app-data.ts:395-425` (`replace`, `generation++`); `apps/desktop/src/i18n/vi.ts` (khóa `extraction.*`); `e2e/customer-ai.spec.ts` (ca Xác nhận đề xuất).
- **Tài liệu:** `CLAUDE.md` gốc, `packages/ai/CLAUDE.md`, `packages/db/CLAUDE.md`; `docs/design/phase-5-ai.md` §10 (dòng 370–387); `docs/design/phase-5-prompts.md` §14 (tiêu đề, §14.5 đủ); `docs/golden/ai-eval.md` (§5 X01–X05); tổng hợp lượt 4 §6.1, §6.3, §8.2; báo cáo gốc lượt 4 gói C của Claude (đủ) và CXR4-C1 của Codex (`docs/reviews/raw/2026-10-31/codex/C.md` mục 5); `common\{prompt-claude.md, known.md (đủ), fixes.md (bảng đầu; Issue + PR + RESOLVED của T-319, T-322, T-323, T-329, T-330, T-332, T-336, T-339), baseline.md (đủ), plan.md §L5.4, §L5.6–§L5.8}`; `claude\A.md` (dòng DR6-137, T-332 phần A, ID phát hiện), `claude\B.md` (dòng T-332 phần B, ID phát hiện). Probe lượt 4 của chính Claude chép theo tên đầy đủ từ `deep-review-1-6-r4\claude\C\` vào `C\r4-probes\`.

## 4. Kịch bản mới đã thử

| # | Kịch bản (các bước, dữ liệu) | Kết quả | ID |
|---|---|---|---|
| K1 | Câu sau nói vợ / chồng KH mất hay chia tay theo cách khác "vợ / chồng đã mất" liền nhau (`C\p03b-new.mjs` nhóm A, 16 câu): "Vợ KH đã mất", "Vợ mất năm 2020", "Ông xã / Bà xã đã mất", "Vợ của KH đã mất", "Hai vợ chồng đã chia tay"; cùng câu và câu sau; đối chiếu với Số con | Câu sau ra "Đã kết hôn", cùng câu ra 0 (`endedBy`); Số con có lưới `otherDeaths` ("KH có 2 con. Một con của KH đã mất." → 0). Đúng chữ §10 (`phase-5-ai.md:382`, "KH đã kết hôn. Vợ KH đã mất." → Đã kết hôn, Owner 01/11/2026) và K42 | không thấy (KNOWN, quyết định Owner) |
| K2 | "nên / vì" mở câu sau (J2 + luật 1): "KH đã kết hôn. Nên có 2 con.", "KH có 2 con. Nên độc thân.", "KH độc thân. Nên kết hôn sớm." (nhóm B) | "Nên" mở câu sau được đọc như chữ nối: Số con 2 / Độc thân, như khi đứng sau dấu phẩy (J2, Owner 31/10); "nên" = "cần" chỉ bị loại ngay sau KH ("KH nên có 2 con") như PR #917 chọn. Hai cách đọc của "Nên" mở câu đều có trong tiếng Việt; theo luật đã duyệt | không thấy |
| K3 | Vế không có chữ cái và dấu đầu dòng (T-336) với dấu khác (nhóm C, 13 câu): "---", năm "2020" đứng riêng, emoji, "a) / b)", "(…)", ngoặc kép, gạch dài, ":" | "---" và "2020" trong suốt (đúng chữ "dãy dấu", "số thứ tự"); emoji, "(", "\"", "—" đứng đầu vế, "a)" và ":" làm vế không đề xuất (hướng an toàn); không câu nào ra giá trị sai | không thấy |
| K4 | Luật 3 ở biên (nhóm D, 15 câu): "2 con đã mất" sau "có 2 con" (→ 0), k lớn hơn số con, hai câu con mất liên tiếp, "Mười con", chữ hoa, "mất việc", "các cụ / bố mẹ đều đã mất", "Còn 1 con đã mất" | Đúng §10; k > số con → không đề xuất; "đều đã mất việc", "Một con đã mất việc" → không đề xuất (hướng an toàn); người khác "đều đã mất" giữ Số con. Đề xuất "Số con 0" qua V7 thành số nguyên 0 (`filterExtraction` → `normalizeKycValue`), giá trị hợp lệ của trường | không thấy |
| K5 | Luật 2 ở biên (nhóm E, 23 câu): "Hiện ly thân", "Đang ly thân" sau Số con, người khác ly hôn / góa / mất ("Bố mẹ", "Mẹ", "Bố chồng"), "Ly hôn: chưa", "Ly hôn?", "Sắp / Muốn / Không" ở câu sau, dòng "Hôn nhân: Góa / Ly thân / Ly dị", chữ hoa, "goá" | Đúng §10 và K42 (câu sau chỉ hỏi / phủ định / dự định giữ đề xuất trước: ACCEPTED). "Hôn nhân: Ly thân" → 0 đúng chữ §10 | không thấy |
| K6 | Luật 1 với người khác ở câu sau (nhóm F, 12 câu): "Người yêu đã kết hôn", "Còn em gái KH…", "Theo vợ KH thì có 3 con", "Chị Lan nói: có 3 con", "Có 2 con với vợ trước", "2 con trai đã kết hôn" | Không câu nào ra giá trị của người khác cho KH; "Theo vợ KH thì có 3 con" giữ Số con 2 (luật người khác nêu trước cụm, §10) | không thấy |
| K7 | "bé" (luật 4) ở biên (nhóm G): "2 bé tí / gái / thỏ / hamster", "căn hộ bé", "Bé út đã mất", "Bé Lan (KH)", "2 BÉ" | Đúng §10; "bé" của cỡ trước cụm làm vế không đề xuất (hướng an toàn) | không thấy |
| K8 | Ghi chú mở bằng một vế không có chữ cái rồi "Khách / Hai vợ chồng / Chị nói" (`C\p03c-worded.mjs`): "1. Khách đã kết hôn.", "... Khách…", "?\nKhách…", "2020. Khách…"; rồi đột biến **T6** (`worded` theo vị trí, không theo chữ cái) | Ghim: ra Đã kết hôn (`OPENS`, "ở đầu ghi chú"). T6 làm cả 6 câu ra 0 mà **701 / 701** test Mock xanh | **CLR5-C1** |
| K9 | G5 `@4` → `@5` trên văn bản thật (`C\p05-corpus.mjs`): 17 673 đoạn = 1 085 chuỗi `text` eval thật theo khối, 9 548 dòng `docs/**/*.md` (ngoài `docs/reviews`, file G5), 1 773 giá trị `vi.ts`, 5 267 ghi chú / giá trị KYC của seed và dữ liệu tải lượt 5 | 0 đoạn đổi kết quả chặn; eval 0 → 0 chuỗi bị chặn ("chặn nhầm": không) | không thấy |
| K10 | Tin nhắn `web@1` dán lại với NUL (đầu / cuối / giữa mỗi dòng, thay dấu xuống dòng) ở lần 1 và message thử lại ở lần 2 (`p06-g5` phần c) | Ghim: `OWN_MESSAGE` ở cả hai lần (2e51e25: retry, rồi REJECTED); NUL thay mọi dấu xuống dòng → retry (cả tin nhắn một dòng, như dán đã nối dòng) | không thấy |
| K11 | Lỗi AI giữ lại × thay dữ liệu không đổi `generation` hay thay hỏng (`p09-kept` S3, S4), × AI trích xuất (S5), × job đang chạy khi Nhập backup bắt đầu (S6) | Dọn sạch / Nhập backup hỏng: lỗi vẫn hiện (cùng dữ liệu, đúng); trích xuất: bỏ sau Nhập backup; job chạy qua Nhập backup: `discarded`, không giữ | không thấy |
| K12 | Refactor T-329 trên 61 703 dòng so sánh (regex, Mock trên 60 681 ghi chú, V3–V6 trên 812 chuỗi) giữa `97876b4` và `b6d4388` (`t329-parity.mjs`) | 0 khác | không thấy |
| K13 | Chuỗi trên màn (Edge, bản dựng ngoài repo, `C\p17-confirm-chain.mjs`): ghi chú "KH có 2 con nhưng đều đã mất." → AI trích xuất (Mock) → Xác nhận → hộp "+ Dữ kiện · Số con" điền "0" → Xác nhận dữ kiện; rồi "KH đã kết hôn. Vợ đã mất năm 2020." → Góa; rồi dòng seed "Hôn nhân: Ly hôn; Nghề nghiệp: Bác sĩ" → Ly hôn; mỗi ghi chú bấm AI trích xuất lần hai | Thẻ KYC ghi "Số con: 0", "Tình trạng hôn nhân: Góa" rồi "Ly hôn"; lần hai "AI không tìm thấy dữ kiện mới…" (đề xuất trùng dữ kiện đang có ẩn, §8 mục 4); 0 lỗi trang, 0 request ra ngoài | không thấy |
| K14 | Ghi chú dài nhiều dòng ở hộp 7a (`C\p16-note-lines.mjs`, `p16b-plain.mjs`): 1 / 500 / 2 000 / 4 000 dòng, ~36 000–172 000 ký tự | `fill` của Playwright tăng bậc hai theo số dòng (4 000 dòng 16,8 s), **cả trên `<textarea>` trần không có code app** (15,4 s); trong app một sự kiện input 4 000 dòng: handler 3 ms, tới khung hình kế 36 ms; Lưu → đóng ≤ 106 ms. Không phải lỗi app | không thấy |
| K15 | Lần AI trích xuất đầu của phiên (regex chạy lần đầu): Node, mỗi lần một tiến trình mới (`C\p07e-cold.mjs`, 9 tiến trình mỗi bản) trên ghi chú RE dài nhất của dữ liệu tải; Edge, trang mới, ba ghi chú dạng seed (`C\p18-first-click.mjs`) | Node: lần gọi đầu 9,20 → 28,48 ms, lần hai 3,55 → 12,31 ms (`2e51e25` → ghim); Edge: lần bấm 1 / 2 / 3 trung vị 40 / 34 / 33 ms (trang đầu 49 ms) | **CLR5-C2** |

## 5. Phát hiện mới

### CLR5-C1 — Không test nào giữ phép thử chữ cái của `worded`: ghi chú mở bằng một vế không có chữ cái ("1.", "...", "?") rồi "Khách" / "Hai vợ chồng" / "Chị nói" mất đề xuất mà cả bộ test Mock vẫn xanh

```
ID: CLR5-C1
Mức: Low
Trục: T
Vị trí: packages/ai/src/mock-extraction.ts:760-767 (`worded`, `looked`), :780 (`opening(clause, first, !worded)`), :687-694 (`opening`: `OPENS` khi chưa có chữ nào đứng trước, không thì `OPENS_AFTER`); packages/ai/src/mock-extraction.test.ts (không ca nào) (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-141, T-322 (luật `OPENS` / `OPENS_AFTER`) · mới do đợt sửa sau lượt 4 (PR #917)
Kịch bản: K8
```

- **Mô tả:** `clausesOf` chọn `OPENS` (nhận "KH", "Khách", "Hai vợ chồng", "Vợ chồng", "Chị nói…") cho vế đọc đầu tiên khi trước nó **chưa có chữ cái nào** của ghi chú (`worded` thử `\p{L}` trên phần ghi chú đứng trước), còn sau chữ khác thì chỉ `OPENS_AFTER` (chỉ cách gọi có "KH"), đúng §10 (`docs/design/phase-5-ai.md:376`, "Ở đầu ghi chú…"). Phép thử chữ cái này không có ca test: đổi nó thành "vế không ở vị trí 0" (đột biến T6) thì "1. Khách đã kết hôn." và mọi ghi chú mở bằng số thứ tự, "...", "?" rồi "Khách / Hai vợ chồng / Chị nói" mất đề xuất, mà 701 / 701 ca của `mock-extraction.test.ts` + `mock-adapter.test.ts` xanh.
- **Tái hiện / bằng chứng:** `node mut.mjs T6` (`C\mut.log`): `T6 SURVIVED — the note always worded before a clause (OPENS never tried past the start) — 701 passed (701)`. `node mut-probe.mjs T6 p03c-worded.mjs lib` (`C\p03c-worded-T6.log`, vá rồi trả nguyên byte, `git status --short after: ""`):
  ```
  ghim (p03c-worded.log)                         T6
  "1. Khách đã kết hôn."                → Đã kết hôn   → 0
  "1. Hai vợ chồng đã kết hôn, có 2 con." → Đã kết hôn ; Số con 2 → 0
  "... Khách đã kết hôn."               → Đã kết hôn   → 0
  "?\nKhách đã kết hôn."                → Đã kết hôn   → 0
  "1.\nChị nói đã kết hôn."             → Đã kết hôn   → 0
  "2020. Khách đã kết hôn."             → Đã kết hôn   → 0
  "Khách đã kết hôn."                   → Đã kết hôn   = (ca có test)
  ```
  `git log -S worded` → `5d13f5a` (#917), `b6d4388` (#937).
- **Ảnh hưởng:** chưa có lỗi ở code hiện tại; một lần sửa sau làm hỏng nhánh này (vd. đổi cách tính `worded` khi chỉnh luật mang KH như T-336) thì Mock mất đề xuất trên ghi chú viết dạng danh sách đánh số mà CI không báo. Chỉ Mock, hướng an toàn.
- **Đề xuất:** thêm 2–3 ca vào bảng mở vế của `mock-extraction.test.ts`: "1. Khách đã kết hôn." → Đã kết hôn, "... Hai vợ chồng đã kết hôn, có 2 con." → hai đề xuất, đối chứng "Gặp. Khách đã kết hôn." → 0; ≈ 5 dòng test, 0 dòng SP.

### CLR5-C2 — Mock trích xuất sau T-330 / T-336: lần trích xuất đầu của phiên và lượt trên cả bộ ghi chú thật chậm hơn `2e51e25` quá luật nhiễu (dưới ngưỡng)

```
ID: CLR5-C2
Mức: Low
Trục: P
Vị trí: packages/ai/src/mock-extraction.ts:878-950 (`mockExtractionOutput`: mọi trường được đọc, `saysOfTheKh` hai lượt, `otherDeaths`, `simpleStatement`), :395-525 (`EXTRACTION_PATTERNS`: 9 khuôn, 6 khuôn mới của T-330), :57-64, :142-145, :379-385 (lookbehind `KH_SUBJECT`, `NOT_OF_ANYONE`, `NAMES_NO_ONE`, `maritalWord`) (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-141, T-330, T-336 · mới do đợt sửa sau lượt 4 (PR #917, #939, #956)
Kịch bản: K15
```

- **Mô tả:** Mock trích xuất viết lại (danh sách cho phép, giá trị cuối về KH, bốn khuôn Hôn nhân / Số con mới, vế trong suốt) tốn hơn bản `2e51e25` trên chính ghi chú thật. Lần gọi đầu của một tiến trình (các regex chạy lần đầu, như lần bấm AI trích xuất đầu sau khi mở app) và lần thứ hai chậm hơn quá luật nhiễu (> 20 % và > 10 ms); lượt ấm trên cả bộ 3 551 ghi chú thật cũng vậy. Mọi số dưới ngưỡng 200 ms của thao tác màn.
- **Tái hiện / bằng chứng** (Home PC, Node v24.20.0, CPU 2–9 % trước mỗi lần chạy; không phiên đo nào khác chạy song song trên máy theo quan sát của phiên này):
  - `node p07e-cold.mjs` (`C\p07e-cold.log`), mỗi lần một tiến trình mới, xen kẽ hai bản, 9 tiến trình mỗi bản, trên ghi chú RE dài nhất của dữ liệu tải ("Nghề nghiệp: Kiến trúc sư; Thu nhập năm: Trên 10 tỷ; …", 173 ký tự):
    ```
    real  first call: 2e51e25 9.20 ms (9.01–9.45) → pinned 28.48 ms (27.95–29.88); second call 3.547 → 12.309 ms
    long  first call: 2e51e25 12.68 ms (11.55–12.95) → pinned 22.98 ms (21.87–24.13); second call 1.002 → 1.634 ms
    ```
  - `node p07d-ab.mjs` (`C\p07d-ab.log`), cùng tiến trình, xen kẽ, 7 vòng: cả bộ 3 551 ghi chú RE khác nhau (dữ liệu tải lượt 5 + seed 3 ngày neo) `2e51e25` 62,17 ms (55,79–78,99) → ghim **103,47 ms** (90,40–154,69), ×1,66, +41,3 ms (≈ 17,5 → 29 µs mỗi ghi chú); ghi chú dài nhất khi ấm 0,02 → 0,03 ms.
  - Trên màn (Edge, bản dựng ngoài repo): lần bấm đầu của trang trên ghi chú 4 503 ký tự, đo như lượt 4 (một trang, `p08-same-page.log`): 52 / 54 / 53 ms, lượt 4 cùng máy 31 ms (+22 ms, +71 %); ghi chú dạng seed (`p18-first-click.log`): lần bấm 1 / 2 / 3 trung vị 40 / 34 / 33 ms, trang đầu 49 ms.
- **Ảnh hưởng:** lần AI trích xuất đầu của mỗi phiên app thêm ≈ 15–20 ms (Node) trên một thao tác vốn ≈ 30–50 ms; các lần sau ≈ +0,01 ms. Người dùng không nhận ra; ghi vì vượt luật nhiễu trên dữ liệu tải (prompt phần "Hiệu năng").
- **Đề xuất:** Owner chấp nhận và ghi số đo (mốc mới) vào `docs/metrics/phase-6.md`; không đáng tối ưu (Mock chỉ cho demo / e2e / máy chưa có key). Nếu cần: dựng khuôn khi gọi lần đầu không đổi được chi phí dịch regex; giảm lookbehind lồng (`NOT_OF_ANYONE` trong `maritalWord`) là đổi luật, phải chứng minh lại 1 332 / 1 972 đề xuất. 0 dòng SP nếu chấp nhận.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `node node_modules/typescript/bin/tsc -p packages/ai/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters`; cùng lệnh cho `apps/desktop/tsconfig.json` | SHA ghim | exit 0, 0 dòng cả hai (1 s / 4 s) | — |
| Nơi dùng mọi export (`C\exports.mjs`, `git grep -w` ở `HEAD`; log `exports.log`) | file SP của gói C | `packages/ai`: mọi export có nơi dùng sản phẩm (`mockExtractionOutput` chỉ `mock-adapter.ts` dùng, không qua `index.ts`). App: 19 export không có nơi dùng sản phẩm ngoài file (lượt 4: 19), đều là kiểu hay hàm dùng trong file mà test cũng gọi; `AiJobKeep` mới có nơi dùng (`ai-analysis.ts`) | — |
| Code lặp | `git grep` | Vòng gọi listener chỉ ở `listeners.ts` (`claude\B.md`); `NUL` của test một nơi (`test-support.ts:23`); `WIDOWED`, `CHILD_WORD` một khai báo (dòng T-336); "giới" / "định" một hàm `unlessAfter` | — |
| Dependency | `git diff --stat 2e51e25 37a80b6 -- packages/ai/package.json apps/desktop/package.json` | rỗng | — |
| Phần `packages/ai` thu gọn (`C\b1-ai-bundle.mjs`, esbuild có sẵn trong `node_modules`, minify, `zod` / `@p2c/domain` để ngoài; log `b1-ai-bundle.log`) | ghim ↔ `2e51e25` | `index.ts` 57 352 B (gzip 18 659) so 51 640 B (16 576): **+5 712 B / +2 083 B gzip**; trong đó `mock-adapter.ts` (gồm `mock-extraction.ts`) 11 920 → 17 500 B (+5 580), `blocklists.ts` +111, `validator.ts` +115, `web.ts` +116, `text-match.ts` +20. Là mã của các luật Owner chọn (K42, K43), không mã chết | — |
| Bundle | `common\baseline.md`; bản dựng của phiên (`C\dist-base`, `VITE_DEMO_ANCHOR=15/09/2026`) | `assets/index.js` 892 184 B (+7 486 B so lượt 4), bản của phiên 892,19 kB: phần `packages/ai` +5 712 B là phần lớn | — |
| `pnpm lint:deps`, `codemap:check` | `common\baseline.md` (cổng `pnpm verify`) | 0 vi phạm (354 module); bản đồ export khớp | — |

Không có phát hiện B (cỡ Mock trích xuất 950 dòng SP là luật Owner chọn; K42 ghi Owner chấp nhận cỡ PR #917, #939).

### 6.2 Hiệu năng

Máy Home PC `DESKTOP-KDURKJP`, Node v24.20.0; đo 23:32–23:55 (+07:00), CPU 2–9 % trước mỗi lần chạy, không chạy `pnpm e2e` hay exe; mỗi số lấy từ log trên đĩa. Dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (lượt 5) qua `importBackup`: 103 `ai_analyses` (ACCEPTED, MOCK), 96 KH có phân tích, 2 292 ghi chú RE khác nhau (cộng seed 3 ngày neo: 3 551). Mốc: lượt 4 Claude C cùng máy (`docs/reviews/raw/2026-10-31/claude/C.md` §6.2), A/B với `2e51e25` cùng tiến trình; exe: `common\baseline.md`. Luật nhiễu: > 20 % **và** > 10 ms.

| Thao tác | Lần | Lượt 5 trung vị (min–max) | Mốc (lượt 4 cùng máy / `2e51e25` cùng tiến trình) | Δ | Ngưỡng | ID |
|---|---:|---|---|---|---|---|
| Phần AI của hồ sơ KH, mỗi KH sống có phân tích (`C\p11-panel-perf.mjs`) | 95 | 0,42 ms (0,27–4,49) | 0,42 ms | 0 | thao tác màn < 200 ms ✅ | — |
| KH nhiều phân tích nhất / riêng phần render | 20 | 0,35 / 0,05 ms | 0,35 / 0,05 ms | 0 | ✅ | — |
| Khối AI chi tiết lịch hẹn | 20 | 0,34 ms | 0,32 ms | trong nhiễu | ✅ | — |
| `validateOutput` phân tích lớn nhất (35 × 299 ký tự) / `checkAnalysisAnswer` | 20 | 2,52 / 2,50 ms | 2,55 / 2,55 ms | trong nhiễu | ✅ | — |
| `checkWebAnswer` dán 12 446 / 19 750 ký tự | 20 | 3,68 / 0,14 ms | 4,15 / 0,15 ms | trong nhiễu | ✅ | — |
| `extractJson` câu suy biến 100 800 ký tự | 5 | 1,16 ms | 1,23 ms | trong nhiễu | ✅ | — |
| **Mock trích xuất, cả bộ 3 551 ghi chú thật** (`p07d-ab` c, 7 vòng xen kẽ) | 7 | 103,47 ms (90,40–154,69) ≈ 29 µs / ghi chú | `2e51e25` 62,17 ms (55,79–78,99) | **+41,3 ms (×1,66) ⚠️** | mỗi ghi chú 0,03 ms ✅ | CLR5-C2 |
| **Mock trích xuất, lần gọi đầu của tiến trình**, ghi chú RE dài nhất (173 ký tự) / lần hai (`p07e-cold`, 9 tiến trình) | 9 | 28,48 / 12,31 ms | `2e51e25` 9,20 / 3,55 ms | **+19,3 ms (×3,1) ⚠️** / +8,8 ms | ✅ | CLR5-C2 |
| Mock trích xuất, ghi chú 4 503 ký tự, lần gọi đầu của tiến trình | 9 | 22,98 ms | `2e51e25` 12,68 ms | +10,3 ms (×1,81) ⚠️ | ✅ | CLR5-C2 |
| Mock trích xuất một dòng 72 003 / 198 003 ký tự ("độc thân") | 5 | 13,41 / 36,01 ms | `2e51e25` 10,43 / 23,65 ms; lượt 4: 8,39 / 23,78 ms | +3,0 / +12,4 ms (×1,52) | < 200 ms ✅ | — (tổng hợp, ghi số) |
| Mock trích xuất, dạng mới sau lượt 4 ~36 000 ký tự (12 dạng: con mất, "đều đã mất", "vợ đã mất", "góa", "bé nhỏ", danh sách "1.", dấu đầu dòng, "...", dòng "Hôn nhân: Ly hôn", "con mất việc") | 5 | 3,55–9,47 ms | `2e51e25` 0,17–6,15 ms | tới ×32 (đường có cụm mới), ≤ +8,8 ms | < 200 ms; test DR6-79 ✅ | — |
| Như trên, ~180 000 ký tự | 5 | 17,72–48,94 ms (cao nhất: "đã kết hôn.\n1. " 48,94, "- Đã ly hôn\n" 48,35) | `2e51e25` 0,97–31,99 ms | ≤ +44,5 ms | < 200 ms ✅, tuyến tính | — (tổng hợp, ghi số) |
| Edge, bản dựng: bấm AI trích xuất → kết quả, "độc thân" 4 503 / 18 003 / 36 003 / 72 003 / 180 003 ký tự, một trang như lượt 4 (`p08-same-page.log`) | 3 | 53 / 35 / 51 / 55 / 153 ms; long task tối đa 69 ms | lượt 4: 31 / 40 / 46 / 48 / 152 ms | **+22 ms (+71 %) ⚠️** ở lần bấm đầu; còn lại trong nhiễu | < 200 ms ✅ | CLR5-C2 |
| Edge, dạng mới ~180 000 ký tự, mỗi ca một trang mới (`p08-mock-long-note.log`) | 3 | "- Đã ly hôn\n" 111, "Hôn nhân: Ly hôn; " 86, "góa vợ " 135, "đã kết hôn.\n1. " 99 ms; long task ≤ 83 ms | — | — | < 200 ms ✅ | — |
| Edge, ghi chú dạng seed, lần bấm 1 / 2 / 3 của trang (`p18-first-click.log`) | 5 | 40 / 34 / 33 ms (trang đầu 49) | — | — | < 200 ms ✅ | CLR5-C2 |
| Exe (`baseline.md`): `customer.open-ai` / `customer.ai-history` | 5 | 20 / 2 ms | sau #656 19 / 2; G7 20 / 2; lượt 4 20 / 2 ms | +1 / 0 ms | < 200 ms ✅ | — |

Không thao tác nào của gói C vượt ngưỡng `phase-6.md`. Phát hiện P: **CLR5-C2** (Low), vì vượt luật nhiễu trên ghi chú của dữ liệu tải (lần gọi đầu của phiên, cả bộ). Các dòng ghi chú tổng hợp một dòng 72 000–198 000 ký tự chỉ ghi số, như lượt 4.

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | | | | | | CLR5-C2 | | CLR5-C1 | | 2 |
| Nit | | | | | | | | | | | 0 |
| **Tổng** | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | **2** |

**2 CONFIRMED, 0 PLAUSIBLE, 0 KNOWN có bằng chứng mới.** Bảng R: R1 5 / 5, R2 5 / 5 ĐÃ SỬA (phần gói C); không SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY. Cả hai phát hiện "mới do đợt sửa sau lượt 4" (#917; #917, #939, #956).

## 8. Đã xét, không thấy

- **R:** 5 dòng R1, 5 dòng R2 (mục 2). Đột biến: 32 (25 gỡ phần sửa + 7 trục T), **31 bị giết, 1 sống** (T6 → CLR5-C1). Không phần sửa nào làm hỏng chỗ trước đó đúng ở đường thường: ghi chú thật 3 556, chỉ thêm 640 Ly hôn có chủ ý; kho chữ G5 0 / 17 673 đoạn đổi; T-329 0 / 61 703 dòng khác; đối chứng vitest 1 855 / 1 855.
- **E:** mục 4 (K1–K8, K10, K11, K14). Ca câu sau báo vợ / chồng mất hay chia tay theo cách khác giữ "Đã kết hôn": KNOWN, Owner 01/11 (`phase-5-ai.md:382`). "Nên" mở câu sau mang KH (J2 + luật 1): theo luật đã duyệt. "a)" không là dấu đầu dòng (`BULLET` chỉ "-*•+", "1)"): ghi chú danh sách chữ không ra đề xuất, hướng an toàn.
- **C:** §10 (`phase-5-ai.md:370-387`) ↔ `mock-extraction.ts`: mọi câu ví dụ của §10 mà phiên chạy (nhóm A, C, D, E, F của `p03b`) ra đúng chữ; G5 §14.2, §14.3, §14.5 ↔ `text-match.ts`, `blocklists.ts`, `web.ts`: khớp (`p06-g5`); version `@5` ở `prompts/*.ts`, `PROMPT_VERSIONS`, `docs/README.md:22`, `ai-eval.md:5`, `06-ai.md:49`, `11-thuat-ngu.md:93`. Thẻ KYC hiện đúng "Số con: 0", "Góa", "Ly hôn" sau Xác nhận (K13).
- **D:** AI trích xuất không tự lưu; đề xuất "Số con 0" qua V7 thành số nguyên 0 rồi `normalizeKycValue` (K4, K13); nhãn model / prompt version mà app ghi đều đọc lại nguyên văn (dòng DR6-137); lỗi AI giữ lại không sống qua thay dữ liệu, vẫn sống qua Dọn sạch / Nhập backup hỏng (cùng dữ liệu) (K11).
- **G:** V3–V6 trên 17 673 đoạn chữ thật (K9), NUL ở mọi vị trí (dòng DR6-142), "giới" sau bốn chữ ở mọi kiểu viết (dòng DR6-143), dán lại tin nhắn có NUL (K10). Phần "Mất" / tác dụng phụ đã duyệt (K43) đúng như ghi.
- **S:** không chạy exe, không gọi OpenCode, không đọc key; trình duyệt chặn mạng ngoài 127.0.0.1 từ lần chạy đầu (`--host-resolver-rules`, `context.route`, thay `window.open` / clipboard): mọi log "blocked 0". `CHATGPT_URL` / `noopener` không đổi từ lượt 4 (`git diff` rỗng ở phần đó).
- **P:** mục 6.2; CLR5-C2. Mọi thao tác trong ngưỡng.
- **B:** mục 6.1; không thấy.
- **T:** test của các PR sửa đỏ khi gỡ đúng phần sửa (mục 2); thêm 7 đột biến trục T trên code mới (T1–T7): 6 bị giết, T6 sống → CLR5-C1. Test thời gian của bảng 36 000 ký tự bắt đúng mẫu bậc hai (R339b).
- **A:** dòng kết quả rỗng của AI trích xuất có hai bản (vùng `status` cho trình đọc màn hình và dòng hiện ra, `p08-debug`); không đổi từ lượt 4; e2e bàn phím của trích xuất xanh ở cổng (`baseline.md`, `pnpm e2e` 324 passed).

## 9. Phụ lục

### 9.1 Probe, log

Mọi file ở `C:\workspace\deep-review-1-6-r5\claude\C\`. Probe Node nạp TypeScript của repo qua hook, chỉ đọc repo, chỉ ghi trong thư mục này. Node `C:\Program Files\nodejs\node.exe` v24.20.0.

| File | Việc | Log / đầu ra | Dùng ở |
|---|---|---|---|
| `hooks-any.mjs` | hook nạp TS của bản ghim và một bản chép ngoài repo trong cùng tiến trình (`old-2e51e25\` mặc định, `P2C_OLD` cho bản khác) | — | mọi probe Node |
| `old-2e51e25\`, `t329-97876b4\`, `t329-b6d4388\` | `git archive 2e51e25 packages/{domain,db,ai}/src packages/db/migrations apps/desktop/src` (303 file); `git archive 97876b4` / `b6d4388` `packages/{domain,ai}/src` | — | so cũ ↔ mới; T-329 |
| `mut.mjs` (chép lượt 4), `mut-list.mjs`, `mut-probe.mjs` | đột biến: vá → `node node_modules/vitest/vitest.mjs run` → trả nguyên byte → sha256 = `HEAD`; `mut-probe` chạy một probe dưới một đột biến | `mut.log`, `mut-out\<id>.out`, `p03c-worded-T6.log` | mục 2, CLR5-C1 |
| `p03-mock.mjs`, `p03b-new.mjs`, `p03c-worded.mjs` | Mock: câu DR6-141 / CLR4-C1 / CXR4-C1, ghi chú thật cũ ↔ mới, câu mới quanh K42, ghi chú mở bằng vế không chữ | `p03-mock.log`, `p03-diffs.json`, `p03b-new.log` (đầu file lặp phần 1–2 của `p03-mock`), `p03c-worded.log` | DR6-141, T-330, K1–K8 |
| `p05-corpus.mjs` (chép lượt 4) | V3–V6 `@4` ↔ `@5` trên 17 673 đoạn chữ thật (nhãn trong log còn ghi "@3 → @4" của bản lượt 4) | `p05-corpus.log` | K9 |
| `p06-g5.mjs` | tái hiện DSR4-C1, CLR4-C2 và biến thể; dán tin nhắn `web@1` có NUL | `p06-g5.log`, `p06-g5c.log` | DR6-142, 143, K10 |
| `p09-kept.mjs` | lỗi AI giữ lại × Nhập backup / Nạp lại / Dọn sạch / nhập hỏng / trích xuất / job chạy qua lần nhập, qua `openAppData` | `p09-kept.log` | DR6-144, K11 |
| `p15-labels.mjs` | nhãn model / prompt version app ghi được qua `isLabel` | `p15-labels.log` | DR6-137 |
| `t329-parity.mjs` | regex, Mock, V3–V6 của `97876b4` ↔ `b6d4388` | `t329-97876b4.ndjson`, `t329-b6d4388.ndjson`, `t329-parity.log` | T-329, K12 |
| `p07d-ab.mjs`, `p07e-cold.mjs`, `p11-panel-perf.mjs` (chép lượt 4) | chi phí Mock `2e51e25` ↔ ghim (ghi chú dài, dạng mới, 3 551 ghi chú thật, lần gọi đầu của tiến trình); phần AI của hồ sơ trên dữ liệu tải | `p07d-ab.log`, `p07e-cold.log` (`p07e-notes.json` tạm), `p11-panel-perf.log` | mục 6.2, CLR5-C2 |
| `build-dist.mjs`, `serve-dist.mjs`, `browser.mjs` (chép lượt 4) | bản dựng ngoài repo (`vite build --outDir` qua CLI của vite, `VITE_DEMO_ANCHOR=15/09/2026`, snapshot demo), `vite preview` 127.0.0.1:4591, Edge chặn mạng ngoài 127.0.0.1 | `build-dist.log`, `dist-base\`, `serve-4591*.log`, `serve-pids.txt` | K13–K15, mục 6.2 |
| `p08-mock-long-note.mjs`, `p08-debug.mjs` | AI trích xuất trên Edge, ghi chú dài (mỗi ca một trang mới; `SAME_PAGE=1`: năm ca đầu một trang như lượt 4) | `p08-mock-long-note.log`, `p08-same-page.log`, `p08-run*-stop.png` (lần chạy hỏng của probe) | mục 6.2 |
| `p16-note-lines.mjs`, `p16b-plain.mjs` | `fill` hộp 7a theo số dòng; `<textarea>` trần; một sự kiện input trong app | `p16-note-lines.log`, `p16b-plain.log` | K14 |
| `p17-confirm-chain.mjs` | chuỗi AI trích xuất → Xác nhận → thẻ KYC trên Edge | `p17-confirm-chain.log`, `p17-stop.png` (lần chạy hỏng của probe) | K13 |
| `p18-first-click.mjs` | lần bấm AI trích xuất 1 / 2 / 3 của trang, ghi chú dạng seed | `p18-first-click.log` | K15, CLR5-C2 |
| `b1-ai-bundle.mjs`, `exports.mjs` (chép lượt 4, đổi bản so) | cỡ thu gọn `packages/ai` ghim ↔ `2e51e25`; nơi dùng export | `b1-ai-bundle.log`, `exports.log` | mục 6.1 |
| `r4-probes\` | probe lượt 4 của chính Claude, chép theo tên đầy đủ từ `deep-review-1-6-r4\claude\C\` | — | nguồn chỉnh lại |

Lần chạy hỏng của probe (lỗi probe, không phải sản phẩm): `p06-g5` phần c lần 1 (`startWebAnalysis` trả `kind: 'session'`, probe đợi `'started'`; một dòng `split('\n')` bị chèn xuống dòng thật khi vá) → sửa; `t329-parity` lần 1 (đọc `text-match.test.ts` không có) → bỏ khỏi danh sách; `p15-labels` lần 1 (`AI_ANALYSIS_NO_MODEL` là danh sách provider, không phải nhãn); `p08` ba lần đầu (locator theo tên nút đổi lúc chạy; dòng rỗng có hai bản → `strict mode`; KH thứ 7 không hiện trong 6 thẻ Kanban → tải lại trang mỗi ca; `fill` 15 000 dòng quá 30 s → K14, đặt giá trị bằng script); `p17` lần 1 (ghi chú đổi tiêu đề thành "Cập nhật KYC" sau Xác nhận); `p18` hai lần đầu (nút "Bảng" trùng tên; dò KH qua bảng) → dựng KH ba ghi chú.

### 9.2 Đột biến (32)

Chạy `node mut.mjs` 23:20–23:22 (25) và `node mut.mjs T1 … T7` 23:31 (7).

- **KILLED (31):** R141a (218), R141b (127), R141c (6), R142a (18), R142b (12), R143a (9), R143b (2), R144a (3), R144b (2), R144c (1), R330a (62), R330b (20), R330c (2), R330d (11), R330e (5), R330f (3), R330g (3), R330h (3), R330i (3), R336a (7), R336b (2), R336c (1), R339a (2), R339b (9 hàng, 1 217–1 609 ms), R332c (1), T1 (1), T2 (1), T3 (11), T4 (2), T5 (8), T7 (7).
- **SỐNG (1):** T6 (`worded` theo vị trí thay vì theo chữ cái) → CLR5-C1.
- Dòng cuối mỗi lần chạy `mut.log`: `git status --short after: ""`; `mut-probe` T6: `git status --short after: ""`; `build-dist.mjs`: `git status --short after: ""`.

### 9.3 Cuối phiên

- Máy chủ `vite preview` của phiên (cổng 4591, mỗi lần một tiến trình, PID ghi ở `serve-pids.txt`) đã tắt sau mỗi lần đo; 23:56 cổng 4591 không còn nghe, không còn tiến trình `node` nào của probe / máy chủ / vitest / Playwright của phiên. Không mở exe, không chạy `pnpm e2e` (cổng 4173), không gọi OpenCode / chatgpt.com, không đọc key; mọi log trình duyệt "blocked 0".
- Không mở / liệt kê / tìm kiếm `…\codex\`, `…\deepseek\` hay `…\muse\` của lượt nào, không liệt kê / tìm kiếm `C:\workspace\`, `deep-review-1-6*\`. File ngoài repo đã mở theo tên đầy đủ: `common\{prompt-claude.md, known.md, fixes.md (theo đoạn), baseline.md, plan.md (§L5.4, §L5.6–§L5.8), load\load-2026-10-12-seed6.p2cbackup}`, `claude\A.md` (dòng đầu; dòng DR6-137, T-332; ID phát hiện), `claude\B.md` (dòng đầu; dòng T-332; ID phát hiện), `claude\C.md` (kiểm có / chưa), 21 probe lượt 4 của chính Claude trong `deep-review-1-6-r4\claude\C\` (chép theo tên đầy đủ: `hooks-any, mut, mut-list, p03-mock, p05-corpus, p06-g5, p06b-good, p07-perf, p07d-ab, p08-mock-long-note, p09-kept, build-dist, serve-dist, pw.config, browser, exports, b1-ai-bundle, list, p13-detail-fuzz, p14-web-chain, p11-panel-perf`, đuôi `.mjs`). Lệnh liệt kê / tìm kiếm chỉ chạy trong repo (`git grep`, `grep` trên file của repo) và trong thư mục của chính phiên (`claude\C\`: `grep` trên probe của mình, `find old-2e51e25 -type f | wc -l`).
- `git rev-parse HEAD` cuối phiên (23:56): `37a80b662861d308a110d1e2b0f65ad13b91fb51`; `git status --short` (`C:\workspace\Project-2C-review`): **rỗng** (như đầu phiên).
- Giờ xong: 2026-11-04 23:57 (+07:00).
