# Chỉ số Phase 5 — AI copilot

Theo bảng chỉ số của `docs/COMPARISON.md`. Số đo lần 1 trên `main` `2b4f43d` (10/10/2026, Home PC `DESKTOP-KDURKJP`), trước review đóng phase. **Đo lại lần 2 trên `main` `3d6c7fc` (11/10/2026, Home PC)** sau deep review (10/10), review lại vòng 2 (11/10) và 11 Issue sửa (T-189…T-196, T-202…T-204); số Owner điền ở G7 (11/10).

- **Milestone:** "Phase 5 — AI copilot" — **41 Issue**, 0 mở: 13 Issue tách từ spec (#401–#413, T-160…T-171), 17 Issue thêm trong phase (#425, #432–#434, #440, #445–#447, #450, #456, #460, #463, #466, #470, #472, #475, #477: T-172…T-188) và 11 Issue sửa sau review đóng phase (#482–#487, #489, #490, #500, #507, #508: T-189…T-196, T-202…T-204). **67 PR merge** từ #398 tới #513 (chưa tính PR đóng phase này).
- **Bắt đầu:** 2026-10-07 (D-1 G4 / G6 #398, spec G1 / G2 #399; mở milestone sau G7 Phase 4) · **Task code cuối merge:** 2026-10-11 giờ VN (PR #513, T-204, `main` `3d6c7fc`) · **Đóng milestone:** 2026-10-11 (G7).
- **Máy:** chủ yếu Home PC. Owner kiểm tay exe `c97234f` (09/10, tìm ra T-178 / T-179), `7113aa7` (10/10, dẫn tới T-188) và ở G7 exe `3d6c7fc` (11/10, artifact CI run `38117986342`): mọi mục hoạt động bình thường.
- **Spec:** `docs/design/phase-5-ai.md` (G1 / G2 07/10, PR #399, #400); D-1 gọi mạng + lưu key (G4 / G6, ADR-0009 phụ lục D-1, PR #398); prompt + danh sách chặn `docs/design/phase-5-prompts.md` (G5 07/10, PR #414, #417, #422); mockup `docs/design/mockups/ai.html` (G3 08/10, PR #427, #429; bổ sung W-1 §9.5, PR #431); hồ sơ eval `docs/golden/ai-eval.md` (G2 08/10, PR #428); ADR-0009 phụ lục W-1 — gói OpenCode Go / Credit + đường ChatGPT web thủ công (G1 / G5 08/10, PR #430).

## Task

"Review vòng đầu": kết luận của comment `REVIEW:` đầu tiên trên mỗi PR (skill `review-pr`, phiên sạch). `CHANGES` = có mục chặn phải sửa rồi review lại.

| Issue | Việc | PR | Risk | Review vòng đầu |
|---|---|---|---|---|
| — | D-1 gọi mạng + lưu API key (G4 / G6); spec Phase 5 (G1 / G2) + một yêu cầu AI tại một thời điểm | #398, #399, #400 | low · cổng | — (Owner duyệt) |
| — | G5 prompt + danh sách chặn, làm rõ ghi chú G5, chặn nhầm của G5 | #414, #417, #422 | low · G5 | — (Owner duyệt) |
| — | G3 mockup AI + ghi duyệt; G2 hồ sơ eval E01–E20, X01–X05; ADR-0009 W-1; G3 bổ sung W-1 | #427, #429, #428, #430, #431 | cổng | — (Owner duyệt; #428, #429 có `REVIEW: CHANGES` trước khi Owner duyệt) |
| #401 | T-160: mức bằng chứng, `normalizeKycValue` ở domain | #415 | low | PASS |
| #402 | T-161: khung `packages/ai` — schema zod, adapter, Mock, ranh giới | #416 | med (review `high`, `build-exe`) | CHANGES (**3 vòng** `CHANGES` trước PASS) |
| #403 | T-162: bảng `ai_analyses`, CURRENT / STALE / REJECTED | #418 | med (review `high`) | CHANGES |
| #404 | T-163: backup + seed cho `ai_analyses` | #419 | med | PASS |
| #405 | T-164: lệnh Rust `ai_complete` + key trong Windows Credential Manager (`keyring`, `ureq`) | #436 | high | PASS |
| #406 | T-165: validator V1–V7 + danh sách chặn G5 | #420 | high | CHANGES |
| #407 | T-166: prompt G5, dựng đầu vào AI; điều phối + runner một lượt | #423, #424 | high ×2 | PASS ×2 |
| #425 | T-172: runner không kẹt `busy`, không nuốt lỗi (từ review #424) | #426 | high | PASS |
| #408 | T-167: lưu Cài đặt → AI + gọi OpenCode qua Rust; màn Cài đặt → AI | #443, #444 | med ×2 | PASS ×2 |
| #409 | T-168A: runner dùng chung + một lần phân tích; logic panel; panel KYC Intelligence | #437, #438, #439 | med ×3 | CHANGES, PASS, PASS |
| #410 | T-168B: lịch sử phân tích, mã `F{seq}` trên dữ kiện | #462 | med | PASS |
| #411 | T-169: khối AI ở chi tiết lịch hẹn | #454 | low | PASS |
| #412 | T-170: lần chạy AI giữ ở app + dọn ghi chú panel; AI trích xuất trên ghi chú KYC | #468, #469 | med ×2 | PASS, CHANGES |
| #413 | T-171: `pnpm eval:ai` + lần chạy eval đầu | #474, #479 | med, low | PASS, PASS (kèm ghi chú; #479 là docs) |
| #432 | T-173: ChatGPT web — tin nhắn `web@1`, kiểm câu trả lời dán, `CHATGPT_WEB` ở db | #455 | high | PASS |
| #433 | T-174: luồng Phân tích bằng ChatGPT web (dữ liệu; panel) | #458, #459 | med ×2 | PASS, CHANGES |
| #440 | T-176: kiểm `input_json` theo schema đầu vào (lệnh + nhập backup; từ review #438) | #465 | high | PASS |
| #446 | T-178: gửi `x-opencode-session` + `User-Agent` để gói Go nhận yêu cầu (Owner kiểm exe) | #448 | high (`build-exe`) | PASS |
| #447 | T-179: kiểm `reasoning_effort` từng model, bật ô Mức suy luận | #451 | high | PASS |
| #450 | T-180: bỏ `deepseek-v4-pro` (403 trên gói Credit) | #452 | med | PASS |
| #477 | T-188: chữ "material" → "thay đổi quan trọng" (Owner kiểm exe `7113aa7`) | #478 | low | PASS |
| #434 | T-175: ghi W-1 §9.5 đã duyệt, đổi chữ OpenCode Go hiện cho người dùng | #435 | low | — (docs) |
| #445, #456, #460, #463, #466, #470, #472, #475 | T-177, T-181…T-187: ghi chú review không chặn vào `docs/state/review-notes.md` | #449, #457, #461, #464, #467, #471, #473, #476 (+ #441, #442, #453 không có Issue riêng) | low | — (docs) |
| #482 | T-189: tài liệu G5 tính là code ở CI | #496 | low | PASS |
| #483 | T-190: chặn dán lại tin nhắn ChatGPT web của app | #497 | med | PASS |
| #484 | T-191: bỏ kết quả AI về sau khi DB bị thay | #498 | med | PASS |
| #485 | T-192: kiểm `ai_analyses` ở lệnh như khi nhập backup | #499 | low | PASS |
| #500 | T-202: gỡ `WEB_PROMPT_VERSION` không còn dùng | #501 | low | PASS |
| #486 | T-193: thông báo lỗi AI có mã HTTP, ô key dạng mật khẩu | #502 | low | PASS |
| #487 | T-194: Rust — trần 2 MB sau giải nén, mã lỗi, key `Local` | #503 | med (`build-exe`) | PASS |
| #489 | T-195: panel AI theo mockup và trợ năng | #504 | low | PASS |
| #490 | T-196: nạp lại giữ Cài đặt → AI, seq thật, mã F khi xác nhận lại | #505 | low | PASS |
| #507 | T-203: khép phần UI của đợt sửa 10/10 | #512 | med | PASS |
| #508 | T-204: Rust — key không sang webview, giữ mã HTTP, test đường thật | #513 | med (`build-exe`) | PASS |
| — | Chỉ số lần 1; tổng hợp deep review + quyết định Owner; tổng hợp review lại vòng 2 + quyết định Owner; đóng phase ở G7 (PR này) | #480, #481, #495, #506, #511, PR này | low | — (docs) |

Phân loại 67 PR: 38 PR code của task sản phẩm (27 trước review đóng phase + 11 PR sửa), 12 PR cổng / spec (kể cả T-175), 11 PR ghi chú review, 6 PR docs khác (#479 kết quả eval, #480 chỉ số lần 1, #481 / #506 tổng hợp review, #495 / #511 quyết định Owner).

## Chỉ số

| Nhóm | Chỉ số | Giá trị |
|---|---|---|
| Chất lượng | % test chấp nhận pass lần đầu | PR code của task sản phẩm: **32/38 (84%)** PASS ở review vòng đầu — 21/27 trước review đóng phase (6 CHANGES: #416, #418, #420, #437, #459, #469; không tính PR cổng / docs), 11/11 PR sửa sau review đóng phase. Phase 4: 51/55 (93%); Phase 3: 62/75 (83%). #416 (khung `packages/ai`) cần 3 vòng `CHANGES` rồi mới PASS, vượt mức "sửa tối đa 2 vòng" của ADR-0001; Owner merge (`--owner`). Golden Phase 2–4 không đổi; golden mới của phase là hồ sơ eval AI (G2 #428), fixture eval chép từ golden, không sửa "cho xanh" |
| Chất lượng | Eval AI (golden, spec §11) | Lần chạy thật đầu 10/10 (`docs/metrics/ai-eval-2026-10-10.md`, gói Go, `deepseek-v4.1-flash`, reasoning `HIGH`): **A1 19/20 ĐẠT** (≥ 18/20; E10 REJECTED do V3 ở lần 2), A2 20/20, A3 0, **R1 0 vi phạm ĐẠT**, **X 5/5 ĐẠT**. **6/20** hồ sơ cần lần thử 2 (E01, E04, E10, E15, E16, E17); lỗi lần 1 phần lớn là V1 ở `nextBestActions` (E01, E10, E15, E16), V1 `evidence` chỉ ở E04, E17 do V5 (nhãn tính cách ngoài `personalityNotes`). Ghi chú X01 cũng cần 2 lần. Tổng token vào / ra 71.913 / 95.565, 606 s. Bảng đọc tay R1–R7 do Claude soạn từ output, Owner duyệt — coi là phần đọc tay của Owner |
| Chất lượng | Lỗi Owner phát hiện khi duyệt | G7 (11/10, exe `3d6c7fc`): **0** — mọi mục kiểm tay hoạt động bình thường. Giữa phase: kiểm tay exe `c97234f` (09/10) — **gói Go trả HTTP 400** vì thiếu `x-opencode-session` (T-178, lỗi thật: yêu cầu của OpenCode Go chưa có trong spec); ô Mức suy luận tắt với mọi model (T-179 — đúng spec §4.2 "chưa kiểm thì tắt", là việc kiểm chưa có Issue). Khi kiểm T-179 thấy `deepseek-v4-pro` trả 403 trên gói Credit (T-180, phía nhà cung cấp; app báo nhầm "Key không hợp lệ"). Kiểm exe `7113aa7` (10/10): chữ "material" khiến người dùng hiểu sai → đổi chữ (T-188, đổi yêu cầu G3, không phải lỗi) |
| Chất lượng | Lỗi sau merge | Do review tìm, không do người dùng gặp: review #424 → T-172 (runner kẹt `busy` / nuốt lỗi, sửa trước khi app dùng runner); review #438 → T-176 (`input_json` chỉ kiểm là JSON hợp lệ). Review đóng phase (mục dưới): deep review 10/10 **64** vấn đề (2 Medium), review lại vòng 2 11/10 **21** phát hiện mới (11 Low, 10 Nit) + 2 hồi quy của đợt sửa; phần chọn sửa trước G7 xong trong 11 Issue T-189…T-196, T-202…T-204, phần còn lại sang Phase 6 |
| Chất lượng | Coverage | `packages/domain` **100%**, `packages/ai` **100%** (ngưỡng 100 ép theo gói); `packages/db/src` 99,45 / 98,42 / 100 / 99,76; toàn bộ **98,9 / 97,44 / 98,87 / 99,15** (statements / branches / functions / lines; lần 1 `2b4f43d`: 98,89 / 97,43 / 98,86 / 99,13). Phase 4 (07/10): toàn bộ 98,79 / 97,08 / 98,58 / 99,04, db 99,39 / 98,48 / 100 / 99,73. Thấp nhất: `apps/desktop/src/shell` 80% vì `useRoute.ts` 0% (như Phase 4) |
| Chất lượng | Số test | **2.220** test / 103 file (lần 1: 2.152 / 102; Phase 4: 1.630 / 77). e2e **190/190** pass, 0 flaky, `CI=1`, Edge, **1,6 phút** trên Home PC (lần 1: 182; Phase 4: 163 trong 1,5 phút trên Office Laptop). Rust **90/90** (lần 1: 73; Phase 4: 50) |
| UI/UX | Điểm Owner (1–10): thẩm mỹ dark mode / độ rõ số liệu / tốc độ thao tác nhập liệu | **8 / 8 / 8** (Owner, G7 11/10). Phase 4: 8 / 8 / 8. Mockup AI Owner duyệt ở G3 (#427, bổ sung #431) |
| Tiến độ | Ngày bắt đầu / kết thúc | 07/10 → 11/10/2026 giờ VN (task code trước review đóng phase xong 10/10, PR #478; task sửa cuối PR #513 ngày 11/10); đóng milestone 11/10 (G7) |
| Tiến độ | Số phiên làm việc | **~200** (Owner ước lượng, G7). Dữ liệu tham khảo: 51 PR merge (27 PR code, 24 PR docs / cổng); `retro.mjs` trên Home PC thấy 10 phiên task + 20 phiên review trong 30 phiên gần nhất (07/10 → 08/10) |
| Chi phí | Mức dùng hạn mức Claude | **~2 tuần** hạn mức (Owner, G7). Phase 4: ~3 tuần hạn mức. Dịch vụ ngoài của sản phẩm: gói OpenCode Go (Owner trả, hết hạn 11/10, Owner gia hạn) dùng cho eval và kiểm tay; không tính vào chi phí làm repo |
| Công sức Owner | Can thiệp ngoài cổng G1–G8 | **~2 lần** (Owner, G7). Ghi nhận từ repo: kiểm tay exe hai lần giữa phase (09/10, 10/10) và báo lỗi gói Go / ô Mức suy luận / chữ "material"; chọn bỏ `deepseek-v4-pro` (T-180); quyết gia hạn gói Go thay vì xử lý ca hết hạn (#408); chạy eval thật (T-171) |
| Kỹ thuật | Kích thước exe | `project2c.exe` build release tại máy từ `2b4f43d` (10/10): **5,15 MB** (5.395.968 byte; Phase 4 `3e84ce8`: 3,99 MB). Artifact CI của exe phát hành `3d6c7fc` (run `38117986342`) là zip **2,97 MB** (3.110.465 byte; lần 1 `d9d9282`: 3.106.113 byte; Phase 4 `3e84ce8`: 2.401.116 byte); exe release chưa build lại tại máy sau đợt sửa. Phần tăng (+1,16 MB exe) đến cùng lúc với crate `ureq` (+ `rustls`) và `keyring` của D-1; chưa tách phần của từng crate |
| Kỹ thuật | Thời gian khởi động | Lần đầu **~2 s**, mở lại **~1 s** (Owner, G7, exe `3d6c7fc`). Phase 4: lần đầu ~2 s, mở lại ~1 s |
| Kỹ thuật | Vi phạm ranh giới module | 0 (`pnpm lint:deps`: 299 module, 1.171 phụ thuộc; lần 1: 297 / 1.156; Phase 4: 230 / 883). `packages/ai` chỉ phụ thuộc `domain` + `zod`; `db` chỉ import `@p2c/ai/schema` (#402) |

## Kiểm tra trên `main` `3d6c7fc` (11/10/2026, Home PC)

Lần 1 trên `2b4f43d` (10/10) cũng xanh hết (2.152 test, Rust 73, e2e 182).

| Lệnh | Kết quả |
|---|---|
| `pnpm verify` | ✅ Prettier, ESLint `--max-warnings 0`, `lint:deps` 0 vi phạm (299 module), `lint:tokens`, `codemap:check`, typecheck, 103 file / 2.220 test, coverage như trên |
| `pnpm verify:rust` | ✅ `cargo fmt --check`, clippy `-D warnings`, 90/90 test |
| `pnpm e2e` (`CI=1`) | ✅ 190/190 pass, 0 flaky, 1,6 phút |
| CI `main` (build exe) | ✅ run `38117986342` trên `3d6c7fc` |
| Eval AI thật | ✅ 10/10, đạt mọi ngưỡng (mục Chỉ số; `docs/metrics/ai-eval-2026-10-10.md`); đợt sửa không đổi prompt G5 nên chưa chạy lại |
| Kiểm tay exe | ✅ Owner, G7 11/10: exe `3d6c7fc` hoạt động bình thường. Giữa phase: `c97234f` (09/10) và `7113aa7` (10/10) — các việc phát sinh đã sửa (T-178, T-179, T-180, T-188) |

## Kích thước PR vượt ngưỡng

Ngưỡng ADR-0001 phụ lục: ≤ ~400 dòng code sản phẩm, ≤ ~800 dòng tổng diff (không tính file sinh tự động). Ghi theo sổ ghi chú review:

| PR | Task | Code sản phẩm | Tổng diff | Lý do nêu trong PR |
|---|---|---|---|---|
| #416 | T-161 | — | ~1.080 dòng (ngoài lockfile) | khung `packages/ai` (schema, adapter, Mock, ranh giới) |
| #444 | T-167 phần 2 | ~600 | ~1.090 | có |
| #462 | T-168B | ~480 | 836 (4 dòng codemap) | không nêu |
| #469 | T-170 phần 2 | +482 / −53 | ~876 | có (hộp 3f, tách `FactValue` / `NextVersion`); task đã tách hai PR |
| #474 | T-171 | ~580 (`eval-ai-core.mjs` 584, `eval-ai.mjs` 52) | 1.596 (fixture chép từ golden 314, test 645) | có (phần lớn là dựng file kết quả) |

## Review đóng phase

Theo ADR-0001 M2: Claude (phiên sạch) + Codex (Owner chạy); báo cáo gốc ở `docs/reviews/raw/<ngày>/`.

- **Deep review 10/10** trên `0df3606` (gói A–F; Claude + Codex, thêm DeepSeek v4.1 Flash và Muse Spark để so sánh — ngoại lệ của Owner, `CLAUDE.md` không đổi): `docs/reviews/2026-10-10-deep-review-phase-5-tong-hop.md`, báo cáo gốc `docs/reviews/raw/2026-10-10/`. **64** vấn đề sau khi kiểm, **2 Medium** (dán lại tin nhắn ChatGPT web của app lưu được bản CURRENT; kết quả AI về muộn ghi vào DB vừa khôi phục cùng ID). Owner chọn phương án C (#495): sửa 8 Issue T-189…T-196 trước G7, phần còn lại sang Phase 6. Đánh giá hai model thêm: `docs/reviews/2026-10-10-danh-gia-deepseek-muse.md`.
- **Review lại vòng 2 11/10** trên `705ea7c` (Claude + Codex): `docs/reviews/2026-10-11-review-lai-phase-5-tong-hop.md`, báo cáo gốc `docs/reviews/raw/2026-10-11/`. 35 DR5: 30 đã sửa, 3 một phần, 2 hồi quy; **21** phát hiện mới (11 Low, 10 Nit, không có Medium trở lên). Owner chọn phương án B (#511): khép trong T-203 (UI) và T-204 (Rust) trước G7, phần còn lại sang Phase 6.

## Điều hướng (riêng 2C, `docs/metrics/README.md`)

Đo bằng `node tools/retro.mjs` trên Home PC, 30 phiên gần nhất (07/10 → 08/10, đầu Phase 5).

| Chỉ số | Mục tiêu | Phase 4 (cuối) | Phase 5 (đầu) |
|---|---|---|---|
| Số lệnh dò trước lần sửa đầu (trung vị phiên task) | **≤ 5** | 13 | **12** (10 phiên task; ✗ chưa đạt, phiên review trung vị 14) |
| Context ở lượt 3 | theo dõi | 73,2k (task), 74,9k (review) | **72,7k** (task), 75,5k (review) |
| Dò sai đường | → 0 | 0 | trung vị **0** (3 phiên có 1 lần) |
| Số lần nạp HANDOFF mỗi phiên | **1** | trung vị 1 | trung vị **1** (3 phiên 3–4 lần) |
| Độ dài HANDOFF | < 10.000 ký tự | 3.683 | **3.865** (Issue #284) |
| PR chỉ để sửa HANDOFF | **0** | 0 | **0** |

Nhận xét: số lệnh dò vẫn ≈ Phase 4 (12 so với 13), xa mục tiêu ≤ 5; Phase 5 là package mới (`packages/ai`) và nhiều task chạm cả Rust + db + UI, nên đọc nhiều hơn là dự kiến. Không chặn G7.

## Việc hoãn sang phase sau

- **Sổ OPEN** (`docs/state/review-notes.md`): ghi chú không chặn của Phase 5 theo file (`packages/ai`, `ai_analyses`, panel, Cài đặt → AI, script eval) gộp vào lần chạm sau; G5 chặn nhầm câu thường (#420) chỉ sửa qua G5. Mã F trên dòng thời gian (#462) và nút "Lưu mặc định" ở dòng 1g (#444) chờ Owner quyết.
- **Đợt G5 #491 T-197** (milestone Phase 6, làm ngay sau G7): sửa prompt / danh sách chặn — ghi nhận R2–R7 của eval đầu (E14 con giáp sai, E17 ý "hướng nội" sang `painPoints`, ESOTERIC yếu căn cứ, gợi ý phân bổ ở E12 / E16 / E19), phần ví dụ prompt của DR5-49, R2-04 (dán lại "Copy yêu cầu sửa").
- **Phần còn lại của hai vòng review đóng phase** (milestone Phase 6): #488 T-198, #492 T-199, #493 T-200, #494 T-201, #509 T-205 (trợ năng), #510 T-206 (phạm vi `pnpm verify` khi PR chỉ đổi docs).
- **Phase 6:** màn Thùng rác, snapshot mỗi bảng một file (S-1), tuần tự hóa thay DB / lưu / xuất / đồng bộ (S-2), đồng bộ `Project-2C-data`.

## Ghi chú

- Phase 5 ngắn (07/10 → 11/10, task trước review đóng phase xong 10/10) dù là package mới: mọi cổng thiết kế (D-1, spec, G5, G3, G2 eval) duyệt trong hai ngày đầu, rồi task đi theo thứ tự domain → `ai` → db → Rust → UI. W-1 (08/10, gói Credit + ChatGPT web) thêm 2 task (T-173, T-174) và mockup bổ sung.
- Số PR ghi chú review (11) gần bằng một nửa số PR code: mỗi review có ghi chú không chặn đều sinh một PR docs. Nên xem lại ở retro (vd. gộp ghi chú vào PR sửa kế tiếp).
- Dependency mới (G4, D-1): `zod` 4.6.5 (`packages/ai`); crate `keyring` 4.x (chỉ kho Windows), `ureq` 3.x.
- Ghi chú review #479: body PR ghi "7/20 hồ sơ cần lần thử 2, phần lớn V1 thiếu `evidence`"; đúng là 6/20 và lỗi V1 lần 1 phần lớn ở `nextBestActions` (file kết quả đúng; số ở mục Chỉ số đã sửa).
- `docs/COMPARISON.md` không đổi (phải giống hệt Project-2).
- **G7 (11/10/2026):** Owner kiểm tay exe `3d6c7fc` (artifact CI run `38117986342`, sau T-203 / T-204) — mọi mục hoạt động bình thường; điền số Owner ở trên; chốt đóng Phase 5. Exe đó là bản phát hành Phase 5 (artifact CI). Kế tiếp: Phase 6, bắt đầu bằng đợt G5 #491.
