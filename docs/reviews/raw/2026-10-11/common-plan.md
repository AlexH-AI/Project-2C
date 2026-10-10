# Kế hoạch review lại Phase 5 (vòng 2, sau đợt sửa)

- **Soạn:** 11/10/2026, theo yêu cầu Owner (chat 11/10): sau khi sửa xong 8 Issue đợt 1 + I-6 của deep review 10/10, Claude và Codex review lại Phase 5 **độc lập, đồng thời**, chỉ đọc, không đọc báo cáo vòng 2 của nhau. Xong cả hai, Claude tổng hợp và đề xuất (sửa thêm hay sang G7).
- **SHA ghim: `705ea7c`** (`main` sau #505, T-196). Hai worktree `C:\workspace\Project-2C-review` và `C:\workspace\Project-2C-review-2` đã detached ở SHA này, đã `pnpm install`.
- **Khuôn:** như deep review 10/10 (`docs/reviews/raw/2026-10-10/common-plan.md`) và ADR-0001 phụ lục M2. Vòng 2 chỉ có Claude + Codex (không DeepSeek / Muse). File này nằm ngoài repo; khi tổng hợp sẽ chép vào `docs/reviews/raw/2026-10-11/` (hoặc ngày tổng hợp) cùng báo cáo gốc.

## 1. Mục tiêu và phạm vi

Ba việc, theo thứ tự ưu tiên:

1. **Trục R — kiểm lại đợt sửa.** Mỗi vấn đề DR5 đã giao cho Issue đóng ở Phase 5 (bảng §3) đã sửa **đúng và đủ** chưa: đọc code, chạy lại tái hiện cũ (probe / ca trong tổng hợp), gỡ tạm phần sửa xem test mới có đỏ không. Kết luận mỗi DR5: `ĐÃ SỬA` · `SỬA MỘT PHẦN` · `CHƯA SỬA` · `HỒI QUY` (sửa làm hỏng chỗ khác).
2. **Review sâu diff sửa** `0df3606..705ea7c` (≈ 2 550 dòng thêm / 400 dòng xóa ngoài `docs/`, 61 file; số liệu ở `baseline.md`): lỗi mới do đợt sửa gây ra, edge case của code mới (thế hệ DB, nhận diện tin nhắn của app, kiểm `ai_analyses` ở lệnh, đọc thân sau giải nén, key `Local`, `errorText` chung, `role="status"` / focus, Nạp lại giữ Cài đặt AI, `seq` thật, ánh xạ mã F khi xác nhận lại).
3. **Quét lại toàn bộ Phase 5** (diff `3e84ce8..705ea7c`) tìm điều vòng 1 bỏ sót — **không chỉ dò lại danh sách cũ**. Vòng 1: mỗi lỗi Medium chỉ một bên thấy, nên chỗ "đã xét, không thấy" ở vòng 1 vẫn đáng xét lại.

Tài liệu chuẩn: spec `docs/design/phase-5-ai.md`, G5 `docs/design/phase-5-prompts.md`, mockup `docs/design/mockups/ai.html`, eval `docs/golden/ai-eval.md`, ADR-0009 (D-1, G5, W-1), `CONTEXT.md`, quyết định Owner 10/10 trong `docs/PROJECT-STATE.md`. Mô tả từng DR5 và phương án Owner chọn: tổng hợp `docs/reviews/2026-10-10-deep-review-phase-5-tong-hop.md` (§3–§5 mô tả, §7 lộ trình, §8 câu hỏi) + thân Issue #482–#490, #500. Golden / spec là nguồn đúng: không đề xuất sửa golden / spec cho khớp code; chỗ spec mâu thuẫn nhau báo ở trục C.

Không báo lại mục trong `known.md` (gắn `KNOWN`, chỉ nêu khi có bằng chứng mới). Mục DR5 giao cho Phase 6 (§3 bảng 2) là KNOWN.

## 2. Vai trò và quy tắc độc lập

| Bên | Chỗ làm | Thư mục kết quả |
|---|---|---|
| Claude (phiên sạch, mỗi gói một phiên, tuần tự A → D, không subagent) | `C:\workspace\Project-2C-review` | `C:\workspace\deep-review-5-r2\claude\` |
| Codex (Owner chạy, cùng lúc với Claude) | `C:\workspace\Project-2C-review-2` | `C:\workspace\deep-review-5-r2\codex\` |
| Claude (phiên tổng hợp, khi Owner yêu cầu) | checkout chính `C:\workspace\Project-2C` | `docs/reviews/` qua PR docs |

- **Chỉ đọc.** Không sửa file trong repo, không commit, không sửa lỗi. Test tạm / probe / patch "phá code" để trong thư mục kết quả của mình; patch gỡ ngay sau khi chạy; cuối phiên `git status` của worktree phải sạch (riêng `review-2` có sẵn `.agents/`, `.codex/`, `AGENTS.md` chưa track — cấu hình Codex của Owner, để nguyên).
- **Độc lập vòng 2.** Phiên Claude không mở / đọc / liệt kê / tìm trong `deep-review-5-r2\codex\`; Codex không làm vậy với `deep-review-5-r2\claude\`. Được đọc mọi thứ trong repo, kể cả báo cáo vòng 1 ở `docs/reviews/raw/2026-10-10/` (đã công khai và gộp). Phiên Claude gói sau đọc báo cáo Claude vòng 2 gói trước.
- **Không gọi dịch vụ AI thật.** Không `pnpm eval:ai`, không "Kiểm tra kết nối" với key thật, không đọc / in key trong Windows Credential Manager, không mở chatgpt.com. Dùng Mock, `fetch` / HTTP giả, server HTTP local tự dựng. Test key `Local` chỉ dùng tên dịch vụ / tài khoản tạm của riêng mình và xóa sau đó — không đụng mục key của app.
- **Không tự tổng hợp.** Xong phần mình thì dừng, báo Owner tên file.
- Trong lúc review không merge gì vào `main` (nếu bắt buộc, ghi SHA đổi).

## 3. Bảng DR5

**Bảng 1 — đã sửa ở Phase 5, phải kiểm lại (trục R):**

| Issue | PR | Nội dung | DR5 | Gói kiểm chính |
|---|---|---|---|---|
| #482 T-189 | #496 | Tài liệu G5 tính là code ở CI | 57 | D |
| #483 T-190 | #497 | Từ chối tin nhắn ChatGPT web của chính app dán lại; nút AI trích xuất khi phiên web chờ | 49 (a), 39 | A (`web.ts`), C (UI) |
| #484 T-191 | #498 | Bỏ kết quả AI về sau khi DB bị thay, kể cả ID trùng | 36 | C (`ai-analysis.ts`, `app-data.ts`) |
| #485 T-192 | #499 | Lệnh kiểm `ai_analyses` như luật nhập backup; NUL; `prompt_version`; `isIssue` | 13, 14, 16, 35 | A |
| #486 T-193 | #502 | Mã HTTP ở mọi lỗi AI, cài đặt chụp lúc bấm, ô key | 30, 31, 32, 37, 44, 46 | C |
| #487 T-194 | #503 | Rust: 2 MB sau giải nén, mã lỗi, key `Local`, `finish_reason` | 20, 21, 22, 24, 25, 26, 27, 28, 29, (05 phần Rust) | B |
| #489 T-195 | #504 | Panel AI theo mockup, bàn phím, trình đọc màn hình | 33, 38, 40, 41, 42, 43, 45, 47 | C |
| #490 T-196 | #505 | Nạp lại giữ Cài đặt AI, `seq` thật, mã F khi xác nhận lại | 15, 48, 50 | C (+ A phần `kyc.ts`) |
| #500 T-202 | #501 | Gỡ `WEB_PROMPT_VERSION` | — | A |

**Bảng 2 — giao Phase 6, là KNOWN:** #488 T-198 (I-7, script eval: DR5-52…56, 58, 59, 62–64) · #491 T-197 (đợt G5: 01, 02, 08, 23, 49 (b)) · #492 T-199 (I-11: 04, 05, 06, 07, 09) · #493 T-200 (I-9 test: 03, 12, 17, 34, 60, 61) · #494 T-201 (I-10: 10, 11, 18, 19, 51). Chỉ nêu khi có bằng chứng hậu quả nặng hơn tổng hợp đã ghi.

## 4. Chia gói

| Gói | Phạm vi | Trọng tâm |
|---|---|---|
| **A. `packages/ai` + `packages/db` + domain** | `packages/ai/src/**`, `packages/db/src/**` phần AI (`ai-analyses.ts`, `backup-validation.ts`, `backup.ts`, `kyc.ts`, `seed*.ts` phần AI), phần Phase 5 của `packages/domain` | R: 13, 14, 16, 35, 49 (a), 15 (phần `kyc.ts`), T-202. Nhận diện tin nhắn của app: khung `=== … ===` bị đổi khoảng trắng / dấu / NFD / CRLF, dán một phần, dán tin nhắn rồi thêm câu trả lời thật phía sau, câu trả lời thật có trích lại khung → có chặn nhầm không. Lệnh và luật nhập backup giờ dùng chung kiểm tra: còn đường nào hai bên lệch (`mode`, `provider`, `attempts`, `prompt_version`, NUL ở mọi bảng và mọi cột chữ). Rồi quét lại guardrail V1–V7, schema, runner như vòng 1 |
| **B. Rust + hợp đồng Tauri** | `apps/desktop/src-tauri/src/ai.rs`, phần AI của `lib.rs`, `Cargo.toml`, `tauri.conf.json`, `capabilities/*.json`, `apps/desktop/src/data/ai-tauri*.ts`, `tauri-contract.test.ts` | R: 20, 21, 22, 24–29, 05 (phần Rust). Server local thật: gzip / deflate / br (nếu ureq bật), `Content-Encoding` sai, thân đúng 2 MB / 2 MB + 1 sau giải nén, chunked không có độ dài, redirect, header lặp, connect / resolve / read timeout, key xuất hiện trong `content` / `server_message` dạng biến thể (cắt, hoa thường, URL-encode). Key `Local`: đọc / ghi / xóa, máy chưa có key, key cũ kiểu cũ (nếu có), lỗi Credential Manager → mã nào. `AI_BUSY` luôn được trả khi panic / lỗi. `cargo clippy -W clippy::pedantic` một lần, so với vòng 1 |
| **C. UI + data desktop + e2e** | `apps/desktop/src/data/ai-*.ts`, `app-data.ts`, `routes/customers/**` phần AI, `routes/appointments/**` khối AI, `routes/SettingsAi.tsx`, `Settings.tsx`, `ai-error-view.ts`, `settings-ai-view.ts`, `shell/routes.ts`, `packages/ui/src/components/TextField.tsx`, `i18n/vi.ts`, `e2e/*ai*.spec.ts` | R: 30–33, 36–48, 50, 15 (panel), 39. "Thế hệ" DB: mọi đường thay DB (Nạp lại, Nhập backup, khôi phục, lỗi giữa chừng khi thay) đều tăng thế hệ; phân tích / trích xuất / Kiểm tra kết nối về sau khi thay → bỏ; đổi KYC trong cùng DB vẫn lưu STALE; Hủy không lưu. Lỗi AI ở panel / trích xuất / Cài đặt hiện cùng câu (§5.3, mockup 2l). Nạp lại giữ Cài đặt AI: cả khi seed lỗi, khi Cài đặt cũ không hợp lệ. Trợ năng thật bằng bàn phím trên bản build (Playwright / Edge): focus, `role="status"`, Escape. Nhãn UI theo nghĩa thường + mockup G3; chuỗi cứng |
| **D. Xuyên gói + CI / tools** (sau cùng) | toàn repo; `.github/workflows/ci.yml`, `tools/pr-core.mjs`, `tools/codemap-core.mjs`, `.claude/rules/ci.md` | R: 57 (PR chỉ đổi hai tài liệu G5 có chạy CI không; `merge-pr` có coi là code không; hai danh sách có test giữ khớp). Đường đi đầu-cuối OpenCode / Mock / ChatGPT web / trích xuất sau đợt sửa; hợp đồng `ai` ↔ `db` ↔ UI ↔ Rust (mã lỗi mới, `finish_reason`, `httpStatus`); hồi quy vào Phase 1–4 (backup, thay DB, phiên bản KYC, dòng thời gian, Cài đặt); code lặp / chết do đợt sửa sinh ra; tổng hợp bảng R của A–C thành một bảng đủ 35 DR5; kết luận **SẴN SÀNG / CHƯA SẴN SÀNG** cho G7 Phase 5 |

Codex tự chọn thứ tự / cách chia phiên, nhưng nộp theo cùng tên gói.

## 5. Trục kiểm

Mỗi gói đi qua **mọi trục**; trục không có gì ghi "đã xét, không thấy" kèm cách đã xét.

- **R — Kiểm lại sửa (mới ở vòng 2):** với từng DR5 của gói: chạy lại tái hiện vòng 1; gỡ tạm phần sửa (patch ngoài repo) xem test của PR có đỏ; tìm biến thể gần của cùng lỗi mà phần sửa bỏ sót.
- **E — Edge case:** rỗng / 1 / rất lớn; Unicode, dấu tiếng Việt, NFC / NFD, zero-width, CRLF; ngày (29/02, cuối năm, nửa đêm); hai thao tác chồng nhau; Hủy / timeout / lỗi giữa chừng; tải lại webview hoặc thay DB khi đang chạy.
- **G — Guardrail AI:** V1–V7, danh sách chặn, schema, thử lại, mức bằng chứng, REJECTED, AI không ghi thẳng dữ liệu KYC.
- **C — Đúng hợp đồng:** code đúng spec / doc comment / nhãn UI / phương án Owner chọn ở §8 tổng hợp; hai chỗ cùng tính một thứ cho cùng kết quả.
- **D — Dữ liệu:** lệnh và nhập backup cùng luật; không mất / hỏng dữ liệu khi lỗi giữa chừng; transaction.
- **S — An toàn:** key (giờ kiểu `Local`), mạng, dữ liệu gửi đi (§6.1), prompt injection, hiển thị output, CSP / capabilities, mở URL ngoài, câu trả lời dán.
- **P — Hiệu năng:** có số đo, không suy đoán.
- **B — Bloat:** export không dùng, nhánh không thể xảy ra, lặp ≥ 3 nơi (`pnpm codemap`, `tsc --noUnusedLocals --noUnusedParameters` chạy tạm, `rg`).
- **T — Chất lượng test:** test có đỏ khi code sai; chép công thức của code; phụ thuộc ngày / thứ tự; mock quá tay.
- **A — Trợ năng / i18n.**

Không dùng công cụ mới ngoài repo (không mở G4).

## 6. Định dạng

**Bảng R** (đầu mỗi báo cáo gói, mọi DR5 của gói):

```
| DR5 | Issue | Kết luận (ĐÃ SỬA / SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY) | Bằng chứng (tái hiện cũ ra gì; test nào đỏ khi gỡ sửa) | Ghi chú |
```

`SỬA MỘT PHẦN` / `CHƯA SỬA` / `HỒI QUY` thì thêm một phát hiện theo khuôn dưới.

**Phát hiện:**

```
ID: CL2-<gói><số> (Claude) | CX2-<gói><số> (Codex), ví dụ CL2-A3
Mức: Critical | High | Medium | Low | Nit
Trục: R | E | G | C | D | S | P | B | T | A
Vị trí: path:dòng (705ea7c)
Tình trạng: CONFIRMED (đã tái hiện / có số đo) | PLAUSIBLE (đọc code, chưa tái hiện) | KNOWN (dòng trong known.md)
Liên quan: DR5-xx (nếu có) · mới do đợt sửa (PR #…) | có từ trước, vòng 1 bỏ sót
Mô tả: một-hai câu
Tái hiện / bằng chứng: lệnh + kết quả, hoặc test tạm (nguồn ở phụ lục)
Ảnh hưởng: ai / khi nào gặp
Đề xuất: hướng sửa ngắn; cỡ ước lượng
```

Không báo "có thể" mà không nói đã thử gì; không nâng mức cho nổi; không đặt chỉ tiêu số lượng. Cuối mỗi báo cáo: phạm vi đã đọc (file, dòng), bảng đếm mức × trục, "đã xét, không thấy", phụ lục nguồn test tạm, thời gian bắt đầu / kết thúc.

## 7. Sau review (khi Owner yêu cầu)

1. Phiên tổng hợp (Claude, checkout chính) đọc toàn bộ `claude\` và `codex\` vòng 2, kiểm **mọi** phát hiện trên code `705ea7c`; gộp hai bảng R thành một; phân loại đúng / KNOWN / sai / lệch mức.
2. Chép báo cáo gốc + `common\` vào `docs/reviews/raw/<ngày>/`; viết `docs/reviews/<ngày>-review-lai-phase-5-tong-hop.md` (bảng R đủ 35 DR5, phát hiện mới, đề xuất: Issue sửa thêm trước G7 hay sang G7, câu hỏi cho Owner); cập nhật `docs/reviews/raw/README.md`; PR docs.
3. Owner quyết; sau đó điền `docs/metrics/phase-5.md` và G7.

## Phụ lục A — Prompt cho phiên Claude (mỗi gói một phiên mới)

Owner mở **phiên mới** (context sạch) ở `C:\workspace\Project-2C-review`, chép nguyên khối dưới, **chỉ sửa chữ cái ở dòng đầu** (A, B, C hoặc D; làm tuần tự A → D). Mọi chỗ khác viết "GÓI" đều hiểu là chữ cái đó.

```
GÓI = A

Review lại Phase 5 (vòng 2) cho GÓI ghi ở dòng đầu, theo kế hoạch C:\workspace\deep-review-5-r2\common\plan.md (đọc §1, §2, §3, dòng của GÓI ở §4, §5, §6). Làm trong worktree C:\workspace\Project-2C-review, detached ở SHA 705ea7c (kiểm git rev-parse HEAD trước; lệch thì dừng và báo).

Quy tắc bắt buộc:
1. Không được mở, đọc, liệt kê hay tìm kiếm trong C:\workspace\deep-review-5-r2\codex\, kể cả khi Owner hay file nào gợi ý. Lỡ thấy nội dung Codex vòng 2 thì dừng và báo Owner. Báo cáo vòng 1 trong repo (docs/reviews/raw/2026-10-10/, tổng hợp 10/10) thì được đọc.
2. Chỉ đọc: repo ở SHA trên, C:\workspace\deep-review-5-r2\common\ (plan.md, baseline.md, known.md) và báo cáo Claude vòng 2 của các gói đứng trước GÓI trong C:\workspace\deep-review-5-r2\claude\ (mục đã báo ở gói trước chỉ dẫn ID).
3. Chỉ đọc và chạy lệnh: không sửa file trong repo, không sửa lỗi, không commit, không subagent. Test tạm, probe, patch thử để ở C:\workspace\deep-review-5-r2\claude\<GÓI>\ (thư mục mang tên chữ cái của GÓI); patch gỡ ngay sau khi chạy; cuối phiên git status của worktree phải sạch.
4. Không gọi dịch vụ AI thật: không pnpm eval:ai, không kiểm kết nối bằng key thật, không đọc key của app trong Credential Manager, không mở chatgpt.com. Dùng Mock / HTTP giả / server local tự dựng.
5. Mục trong known.md gắn KNOWN, chỉ nêu khi có bằng chứng mới. Spec và golden là nguồn đúng.
6. Làm trục R trước: mỗi DR5 của GÓI (plan §3, §4) một dòng bảng R có bằng chứng (chạy lại tái hiện vòng 1, gỡ tạm phần sửa xem test đỏ, thử biến thể gần). Rồi đọc sâu diff sửa 0df3606..705ea7c trong phạm vi GÓI, rồi quét lại phần Phase 5 của GÓI tìm điều vòng 1 bỏ sót. Đi qua mọi trục §5; trục không có gì ghi "đã xét, không thấy" kèm cách đã xét. Ưu tiên tái hiện để phát hiện là CONFIRMED; hiệu năng phải có số đo. Không bình luận phong cách / đặt tên trừ khi gây lỗi.
7. Nộp C:\workspace\deep-review-5-r2\claude\<GÓI>.md (vd. GÓI = A thì A.md) theo §6, ID CL2-<GÓI><số> (vd. CL2-A1).
8. Không tổng hợp, không so với Codex, không tạo Issue. Xong thì dừng và báo Owner tên file. Riêng GÓI = D: đọc thêm claude\A.md, B.md, C.md, gộp bảng R đủ 35 DR5, cuối D.md kết luận SẴN SÀNG / CHƯA SẴN SÀNG cho G7 Phase 5 phía Claude, rồi chờ Owner yêu cầu tổng hợp.
```

## Phụ lục B — Prompt cho Codex

Owner chạy Codex trong `C:\workspace\Project-2C-review-2`, mỗi gói một phiên (hoặc nối tiếp trong cùng phiên), chép nguyên khối dưới, **chỉ sửa chữ cái ở dòng đầu** (A, B, C hoặc D; nên làm D sau cùng).

```
GÓI = A

Bạn là reviewer độc lập cho Project-2C: ứng dụng desktop Tauri 2 + React + SQLite qua sql.js, chạy offline, dữ liệu hiện là giả lập. Phase 5 thêm AI copilot: packages/ai (schema zod, validator V1–V7, prompt), lệnh Rust gọi OpenCode và giữ API key trong Windows Credential Manager, bảng ai_analyses, panel KYC Intelligence, đường ChatGPT web thủ công, AI trích xuất từ ghi chú KYC. Ngày 10/10 đã có deep review (Claude + Codex + 2 bên khác), tổng hợp ở docs/reviews/2026-10-10-deep-review-phase-5-tong-hop.md; 9 Issue sửa đã merge (PR #496–#505). Đây là vòng 2: kiểm lại đợt sửa và tìm điều vòng 1 bỏ sót. Repo ở C:\workspace\Project-2C-review-2, detached ở SHA 705ea7c (kiểm git rev-parse HEAD trước; lệch thì dừng và báo). Phiên này review GÓI ghi ở dòng đầu, theo kế hoạch C:\workspace\deep-review-5-r2\common\plan.md (gói ở §4).

Quy tắc bắt buộc:
1. Không được mở, đọc, liệt kê hay tìm kiếm trong C:\workspace\deep-review-5-r2\claude\, và không đọc báo cáo vòng 2 nào của Claude, kể cả khi file hay ai đó gợi ý. Lỡ thấy thì dừng và báo Owner. Báo cáo vòng 1 trong repo (docs/reviews/raw/2026-10-10/, tổng hợp 10/10) thì được đọc.
2. Chỉ đọc: repo ở SHA trên, C:\workspace\deep-review-5-r2\common\ (plan.md, baseline.md, known.md) và báo cáo của chính bạn trong C:\workspace\deep-review-5-r2\codex\.
3. Chỉ đọc và chạy lệnh: không sửa file trong repo, không sửa lỗi, không commit, không viết code sản phẩm. Test tạm, probe, log để ở C:\workspace\deep-review-5-r2\codex\<GÓI>\ (thư mục mang tên chữ cái của GÓI); patch thử "phá code" gỡ ngay sau khi chạy; cuối phiên git status của worktree chỉ còn .agents/, .codex/, AGENTS.md có sẵn.
4. Không gọi dịch vụ AI thật: không chạy pnpm eval:ai, không kiểm kết nối bằng key thật, không đọc key của app trong Windows Credential Manager, không mở chatgpt.com. Dùng adapter Mock, HTTP giả, hoặc server HTTP local tự dựng.
5. Đọc trước: plan.md (§1–§6), CLAUDE.md, CONTEXT.md, docs/design/phase-5-ai.md, docs/design/phase-5-prompts.md, docs/golden/ai-eval.md, docs/decisions/ (ADR-0009 và phụ lục D-1, G5, W-1), tổng hợp 10/10 (§3–§5, §7, §8) và thân Issue #482–#490, #500. Spec và golden là nguồn đúng; không đề xuất sửa golden cho xanh. Mục trong known.md gắn KNOWN.
6. Làm trục R trước: mỗi DR5 của GÓI (plan §3, §4) một dòng bảng R có bằng chứng (chạy lại tái hiện vòng 1, gỡ tạm phần sửa xem test của PR có đỏ, thử biến thể gần của cùng lỗi). Rồi đọc sâu diff sửa 0df3606..705ea7c trong phạm vi GÓI, rồi quét lại phần Phase 5 của GÓI (diff 3e84ce8..705ea7c) tìm điều vòng 1 bỏ sót: (1) lỗi đúng-sai, (2) guardrail AI lọt qua / chặn nhầm so với G5, (3) mất / sai dữ liệu, (4) an toàn: API key, gọi mạng, dữ liệu gửi đi, prompt injection, hiển thị output, CSP / capabilities, mở URL ngoài, (5) hiệu năng có số đo, (6) code thừa / lặp, (7) test yếu, (8) trợ năng / i18n. Đi qua mọi trục §5; trục không có gì ghi "đã xét, không thấy" kèm cách đã xét. Mỗi phát hiện theo §6, ID CX2-<GÓI><số> (vd. CX2-A1), ghi CONFIRMED hay PLAUSIBLE và cách tái hiện. Không bình luận phong cách / đặt tên trừ khi gây lỗi.
7. Nộp C:\workspace\deep-review-5-r2\codex\<GÓI>.md (vd. GÓI = A thì A.md) theo §6. Riêng GÓI = D: đọc thêm codex\A.md, B.md, C.md, gộp bảng R đủ 35 DR5 và thêm kết luận SẴN SÀNG / CHƯA SẴN SÀNG cho G7 Phase 5 kèm lý do.
8. Không tổng hợp với báo cáo nào khác, không tạo Issue, không đề xuất merge.
```
