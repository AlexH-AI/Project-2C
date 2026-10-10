# Chỉ số Phase 5 — AI copilot

Theo bảng chỉ số của `docs/COMPARISON.md`. Số đo lần 1 trên `main` `2b4f43d` (10/10/2026, Home PC `DESKTOP-KDURKJP`), sau khi mọi Issue của milestone đã đóng và **trước** review đóng phase (Claude + Codex) và G7. Số chỉ Owner biết (điểm UI/UX, ước lượng phiên / hạn mức, can thiệp ngoài cổng, thời gian khởi động, kiểm tay exe) để trống, Owner điền ở G7; Claude không tự ước.

- **Milestone:** "Phase 5 — AI copilot" — **30 Issue**, 0 mở: 13 Issue tách từ spec (#401–#413, T-160…T-171) và 17 Issue thêm trong phase (#425, #432–#434, #440, #445–#447, #450, #456, #460, #463, #466, #470, #472, #475, #477: T-172…T-188). **51 PR merge** từ #398 tới #479.
- **Bắt đầu:** 2026-10-07 (D-1 G4 / G6 #398, spec G1 / G2 #399; mở milestone sau G7 Phase 4) · **Task code cuối merge:** 2026-10-10 giờ VN (PR #478, T-188, `main` `d9d9282`) · **Task cuối merge:** 2026-10-10 giờ VN (PR #479, ghi lần chạy eval đầu, `main` `2b4f43d`) · **Đóng milestone:** chưa (chờ review đóng phase + G7).
- **Máy:** chủ yếu Home PC. Owner kiểm tay exe `c97234f` (09/10, tìm ra T-178 / T-179) và `7113aa7` (10/10, dẫn tới T-188).
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
| — | Đóng phase lần 1 (file này) | PR này | low | — (docs) |

Phân loại 51 PR: 27 PR code của task sản phẩm, 12 PR cổng / spec (kể cả T-175), 11 PR ghi chú review, 1 PR ghi kết quả eval (#479).

## Chỉ số

| Nhóm | Chỉ số | Giá trị |
|---|---|---|
| Chất lượng | % test chấp nhận pass lần đầu | PR code của task sản phẩm: **21/27 (78%)** PASS ở review vòng đầu (6 CHANGES: #416, #418, #420, #437, #459, #469; không tính PR cổng / docs). Phase 4: 51/55 (93%); Phase 3: 62/75 (83%). #416 (khung `packages/ai`) cần 3 vòng `CHANGES` rồi mới PASS, vượt mức "sửa tối đa 2 vòng" của ADR-0001; Owner merge (`--owner`). Golden Phase 2–4 không đổi; golden mới của phase là hồ sơ eval AI (G2 #428), fixture eval chép từ golden, không sửa "cho xanh" |
| Chất lượng | Eval AI (golden, spec §11) | Lần chạy thật đầu 10/10 (`docs/metrics/ai-eval-2026-10-10.md`, gói Go, `deepseek-v4.1-flash`, reasoning `HIGH`): **A1 19/20 ĐẠT** (≥ 18/20; E10 REJECTED do V3 ở lần 2), A2 20/20, A3 0, **R1 0 vi phạm ĐẠT**, **X 5/5 ĐẠT**. **6/20** hồ sơ cần lần thử 2 (E01, E04, E10, E15, E16, E17); lỗi lần 1 phần lớn là V1 ở `nextBestActions` (E01, E10, E15, E16), V1 `evidence` chỉ ở E04, E17 do V5 (nhãn tính cách ngoài `personalityNotes`). Ghi chú X01 cũng cần 2 lần. Tổng token vào / ra 71.913 / 95.565, 606 s. Bảng đọc tay R1–R7 do Claude soạn từ output, Owner duyệt — coi là phần đọc tay của Owner |
| Chất lượng | Lỗi Owner phát hiện khi duyệt | _(Owner xác nhận ở G7.)_ Ghi nhận từ repo: kiểm tay exe `c97234f` (09/10) — **gói Go trả HTTP 400** vì thiếu `x-opencode-session` (T-178, lỗi thật: yêu cầu của OpenCode Go chưa có trong spec); ô Mức suy luận tắt với mọi model (T-179 — đúng spec §4.2 "chưa kiểm thì tắt", là việc kiểm chưa có Issue). Khi kiểm T-179 thấy `deepseek-v4-pro` trả 403 trên gói Credit (T-180, phía nhà cung cấp; app báo nhầm "Key không hợp lệ"). Kiểm exe `7113aa7` (10/10): chữ "material" khiến người dùng hiểu sai → đổi chữ (T-188, đổi yêu cầu G3, không phải lỗi) |
| Chất lượng | Lỗi sau merge | Do review tìm, không do người dùng gặp: review #424 → T-172 (runner kẹt `busy` / nuốt lỗi, sửa trước khi app dùng runner); review #438 → T-176 (`input_json` chỉ kiểm là JSON hợp lệ). Review đóng phase: _chưa chạy_ |
| Chất lượng | Coverage | `packages/domain` **100%**, `packages/ai` **100%** (ngưỡng 100 ép theo gói); `packages/db/src` 99,45 / 98,64 / 100 / 99,76; toàn bộ **98,89 / 97,43 / 98,86 / 99,13** (statements / branches / functions / lines). Phase 4 (07/10): toàn bộ 98,79 / 97,08 / 98,58 / 99,04, db 99,39 / 98,48 / 100 / 99,73. Thấp nhất: `apps/desktop/src/shell` 80% vì `useRoute.ts` 0% (như Phase 4) |
| Chất lượng | Số test | **2.152** test / 102 file (Phase 4: 1.630 / 77). e2e **182/182** pass, 0 flaky, `CI=1`, Edge, **1,6 phút** trên Home PC (Phase 4: 163 trong 1,5 phút trên Office Laptop). Rust **73/73** (Phase 4: 50) |
| UI/UX | Điểm Owner (1–10): thẩm mỹ dark mode / độ rõ số liệu / tốc độ thao tác nhập liệu | _(Owner điền ở G7.)_ Phase 4: 8 / 8 / 8. Mockup AI Owner duyệt ở G3 (#427, bổ sung #431) |
| Tiến độ | Ngày bắt đầu / kết thúc | 07/10 → 10/10/2026 giờ VN (task code cuối PR #478, docs cuối PR #479 ngày 10/10); đóng milestone: chờ review đóng phase + G7 |
| Tiến độ | Số phiên làm việc | _(Owner ước lượng ở G7.)_ Dữ liệu tham khảo: 51 PR merge (27 PR code, 24 PR docs / cổng); `retro.mjs` trên Home PC thấy 10 phiên task + 20 phiên review trong 30 phiên gần nhất (07/10 → 08/10) |
| Chi phí | Mức dùng hạn mức Claude | _(Owner điền ở G7.)_ Phase 4: ~3 tuần hạn mức. Dịch vụ ngoài của sản phẩm: gói OpenCode Go (Owner trả, hết hạn 11/10, Owner gia hạn) dùng cho eval và kiểm tay; không tính vào chi phí làm repo |
| Công sức Owner | Can thiệp ngoài cổng G1–G8 | _(Owner điền ở G7.)_ Ghi nhận từ repo: kiểm tay exe hai lần giữa phase (09/10, 10/10) và báo lỗi gói Go / ô Mức suy luận / chữ "material"; chọn bỏ `deepseek-v4-pro` (T-180); quyết gia hạn gói Go thay vì xử lý ca hết hạn (#408); chạy eval thật (T-171) |
| Kỹ thuật | Kích thước exe | `project2c.exe` build release tại máy từ `2b4f43d` (10/10): **5,15 MB** (5.395.968 byte; Phase 4 `3e84ce8`: 3,99 MB). Artifact CI của `main` `d9d9282` (run `37981987832`, commit code cuối) là zip **2,96 MB** (3.106.113 byte; Phase 4 `3e84ce8`: 2.401.116 byte). Phần tăng (+1,16 MB exe) đến cùng lúc với crate `ureq` (+ `rustls`) và `keyring` của D-1; chưa tách phần của từng crate |
| Kỹ thuật | Thời gian khởi động | _(Owner đo ở G7.)_ Phase 4: lần đầu ~2 s, mở lại ~1 s |
| Kỹ thuật | Vi phạm ranh giới module | 0 (`pnpm lint:deps`: 297 module, 1.156 phụ thuộc; Phase 4: 230 / 883). `packages/ai` chỉ phụ thuộc `domain` + `zod`; `db` chỉ import `@p2c/ai/schema` (#402) |

## Kiểm tra trên `main` `2b4f43d` (10/10/2026, Home PC)

| Lệnh | Kết quả |
|---|---|
| `pnpm verify` | ✅ Prettier, ESLint `--max-warnings 0`, `lint:deps` 0 vi phạm (297 module), `lint:tokens`, `codemap:check`, typecheck, 102 file / 2.152 test, coverage như trên |
| `pnpm verify:rust` | ✅ `cargo fmt --check`, clippy `-D warnings`, 73/73 test |
| `pnpm e2e` (`CI=1`) | ✅ 182/182 pass, 0 flaky, 1,6 phút |
| CI `main` (build exe) | ✅ run `37981987832` trên `d9d9282` (commit code cuối; `2b4f43d` chỉ đổi docs nên không chạy CI) |
| Eval AI thật | ✅ 10/10, đạt mọi ngưỡng (mục Chỉ số; `docs/metrics/ai-eval-2026-10-10.md`) |
| Kiểm tay exe | _(Owner, G7.)_ Giữa phase: `c97234f` (09/10) và `7113aa7` (10/10) — các việc phát sinh đã sửa (T-178, T-179, T-180, T-188) |

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

_Chưa chạy._ Theo ADR-0001 M2: Claude (phiên sạch) + Codex (Owner chạy); báo cáo gốc vào `docs/reviews/raw/<ngày>/`, tổng hợp ở `docs/reviews/`. Phạm vi gợi ý: diff `3e84ce8..2b4f43d` (61 commit, 154 file, +27.359 / −363 dòng), trọng tâm `packages/ai`, lệnh Rust `ai_complete` + key (`keyring`), `ai_analyses` (lệnh + nhập backup), panel KYC Intelligence, ChatGPT web, AI trích xuất; đối chiếu `docs/state/review-notes.md` trước khi ghi một phát hiện là MỚI.

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
- **Sửa prompt (G5) sau eval đầu:** ghi nhận R2–R7 trong file eval (E14 con giáp sai, E17 ý "hướng nội" sang `painPoints`, ESOTERIC yếu căn cứ, gợi ý phân bổ ở E12 / E16 / E19) là căn cứ cho `prompt_version` sau; không mở Issue khi chưa có lệnh Owner.
- **Phase 6:** màn Thùng rác, snapshot mỗi bảng một file (S-1), tuần tự hóa thay DB / lưu / xuất / đồng bộ (S-2), đồng bộ `Project-2C-data`.

## Ghi chú

- Phase 5 ngắn (07/10 → 10/10) dù là package mới: mọi cổng thiết kế (D-1, spec, G5, G3, G2 eval) duyệt trong hai ngày đầu, rồi task đi theo thứ tự domain → `ai` → db → Rust → UI. W-1 (08/10, gói Credit + ChatGPT web) thêm 2 task (T-173, T-174) và mockup bổ sung.
- Số PR ghi chú review (11) gần bằng một nửa số PR code: mỗi review có ghi chú không chặn đều sinh một PR docs. Nên xem lại ở retro (vd. gộp ghi chú vào PR sửa kế tiếp).
- Dependency mới (G4, D-1): `zod` 4.6.5 (`packages/ai`); crate `keyring` 4.x (chỉ kho Windows), `ureq` 3.x.
- Ghi chú review #479: body PR ghi "7/20 hồ sơ cần lần thử 2, phần lớn V1 thiếu `evidence`"; đúng là 6/20 và lỗi V1 lần 1 phần lớn ở `nextBestActions` (file kết quả đúng; số ở mục Chỉ số đã sửa).
- `docs/COMPARISON.md` không đổi (phải giống hệt Project-2).
- **G7:** _chờ_ — review đóng phase, Owner kiểm tay exe, điền các số Owner ở trên, chốt đóng Phase 5 và phát hành exe.
