# Kế hoạch deep review Phase 5 (AI copilot)

- **Soạn:** 10/10/2026, theo yêu cầu Owner (chat 10/10): Claude và Codex review **độc lập, đồng thời**, chỉ đọc, không đọc báo cáo của nhau, tìm thật kỹ edge case, xuất báo cáo đầy đủ; xong cả hai, Claude tổng hợp và đề xuất sửa.
- **SHA ghim: `0df3606`** (`main` sau #480). Cả hai worktree detached ở SHA này, đã `pnpm install`.
- **Khuôn:** như deep review Phase 1–4 (`docs/process/deep-review-phase-1-4.md` trong repo) và ADR-0001 phụ lục M2. File này nằm ngoài repo; khi tổng hợp sẽ chép vào `docs/reviews/raw/<ngày>/` cùng báo cáo gốc.

## 1. Phạm vi

Code Phase 5: diff `3e84ce8..0df3606` (số liệu ở `baseline.md`), cộng chỗ code Phase 1–4 mà Phase 5 nối vào (nhập / xuất backup, thay DB, phiên bản KYC, dòng thời gian, Cài đặt). Tài liệu chuẩn để đối chiếu:

- Spec `docs/design/phase-5-ai.md` (G1 / G2), prompt + danh sách chặn `docs/design/phase-5-prompts.md` (G5), mockup `docs/design/mockups/ai.html` (G3), hồ sơ eval `docs/golden/ai-eval.md` (G2), ADR-0009 (phụ lục D-1, G5, W-1), `CONTEXT.md`.
- Golden và spec là nguồn đúng: không đề xuất sửa golden / spec cho khớp code. Chỗ spec mâu thuẫn nhau thì báo là phát hiện, trục C.

Tìm, theo thứ tự ưu tiên:

1. **Lỗi đúng-sai và edge case** (rỗng, một phần tử, lớn, Unicode / dấu tiếng Việt, ranh giới ngày, hai thao tác chồng nhau, Hủy giữa chừng, tải lại / thay DB khi AI đang chạy).
2. **Guardrail AI**: validator V1–V7 so với G5 (lọt qua và chặn nhầm), schema zod, quy tắc thử lại (2 lần → REJECTED), mức bằng chứng, AI không bao giờ ghi thẳng vào dữ liệu KYC.
3. **Toàn vẹn dữ liệu**: `ai_analyses` (lệnh, CURRENT / STALE / REJECTED, xóa mềm), luật nhập backup, migration, seed.
4. **An toàn** (rộng hơn đợt Phase 1–4): API key (chỉ ở Rust / Windows Credential Manager, không lọt vào webview, DB, backup, log, thông báo lỗi), gọi mạng (URL cố định, timeout, header, TLS), dữ liệu gửi đi tối thiểu (spec §6.1), prompt injection từ ghi chú KYC và từ câu trả lời dán của ChatGPT web, hiển thị output model (chèn HTML / link), CSP và `capabilities` Tauri, mở URL ngoài.
5. **Hiệu năng** (có số đo), **code thừa / lặp**, **test yếu**, **trợ năng / i18n**.

Không báo lại mục trong `common/known.md`: gắn `KNOWN`, chỉ nêu khi có bằng chứng mới.

## 2. Vai trò và quy tắc độc lập

| Bên | Chỗ làm | Thư mục kết quả |
|---|---|---|
| Claude (phiên sạch, mỗi gói một phiên, tuần tự A → F, không subagent) | `C:\workspace\Project-2C-review` | `C:\workspace\deep-review-5\claude\` |
| Codex (Owner chạy, cùng lúc với Claude) | `C:\workspace\Project-2C-review-2` | `C:\workspace\deep-review-5\codex\` |
| Claude (phiên tổng hợp, sau cùng, khi Owner yêu cầu) | checkout chính `C:\workspace\Project-2C` | `docs/reviews/` qua PR docs |

- **Chỉ đọc.** Không sửa file trong repo, không commit, không sửa lỗi. Test tạm / probe / patch "phá code" để trong thư mục kết quả của mình (chạy bằng đường dẫn tuyệt đối hoặc chép vào thư mục tạm), xong thì `git status` của worktree phải sạch (`dist/`, `coverage/` bị ignore thì không sao).
- **Cấm đọc kết quả của nhau.** Phiên Claude không mở / đọc / liệt kê / tìm trong `codex\`; phiên Codex không làm vậy với `claude\`. Phiên Claude gói sau chỉ đọc báo cáo Claude gói trước.
- **Không gọi dịch vụ AI thật.** Không chạy `pnpm eval:ai`, không bấm "Kiểm tra kết nối" với key thật, không đọc / in key trong Windows Credential Manager, không mở chatgpt.com. Dùng adapter Mock, test với `fetch` / HTTP giả, hoặc server HTTP local tự dựng trong thư mục của mình. Key thật của Owner và hạn mức gói Go không được đụng tới.
- **Không tự tổng hợp.** Xong phần mình thì dừng, báo Owner tên file. Phiên tổng hợp chỉ bắt đầu khi Owner yêu cầu, sau khi cả hai bên nộp đủ.
- Trong lúc review không merge gì vào `main` (nếu bắt buộc, ghi SHA đổi).

## 3. Chia gói

| Gói | Phạm vi | Trọng tâm riêng |
|---|---|---|
| **A. `packages/ai` + domain** | `packages/ai/src/**` (schema, validator, `blocklists.ts`, `text-match.ts`, `extract-json.ts`, `input.ts`, `run.ts`, `web.ts`, `mock-adapter.ts`, `models.ts`, `settings.ts`, `errors.ts`, `prompts/**`); phần Phase 5 của `packages/domain` (mức bằng chứng, `normalizeKycValue`) | So từng luật V1–V7 và từng mục danh sách chặn với G5 (`phase-5-prompts.md`): lọt qua (biến thể dấu, hoa / thường, NFC / NFD, ký tự zero-width, khoảng trắng lạ, homoglyph, xuống dòng, JSON lồng) và chặn nhầm câu thường. Schema strict, khóa thừa / thiếu, mảng rỗng / quá dài. `extract-json` với output bẩn (fence, nhiều khối JSON, chuỗi rất dài). Runner một lượt: Hủy, lỗi, timeout, hai lời gọi chồng nhau, `AI_BUSY`. Đầu vào gửi AI: tối thiểu dữ liệu (§6.1), năm sinh gửi dạng tuổi, ngày phân tích |
| **B. db** | `packages/db/src/ai-analyses.ts`, `schema.ts`, `migrations.ts` + migration mới, `backup-validation.ts` (luật liên quan AI), `seed.ts` phần AI | CURRENT / STALE / REJECTED đúng spec §7.2 (phiên bản KYC mới, xóa mềm, nhiều dòng cùng thời điểm); lệnh và nhập backup kiểm cùng luật (schema đầu vào / đầu ra theo `mode`, `evidence`, provider `CHATGPT_WEB` không model / token, giới hạn 20 000); backup không bao giờ chứa key; migration trên DB Phase 4 có dữ liệu |
| **C. Rust** | `apps/desktop/src-tauri/src/ai.rs`, phần AI của `lib.rs`, `Cargo.toml`, `tauri.conf.json` (CSP), `capabilities/*.json` | Key chỉ ở Credential Manager, không lọt vào lỗi / log / giá trị trả; URL cố định (Go / Credit), header `x-opencode-session` / `User-Agent`; timeout 120 s, Hủy, cờ `AI_BUSY` luôn được trả (cả khi panic / lỗi mạng); ánh xạ mã HTTP → mã lỗi (§5.3, 401 / 403 / 429 / 5xx / body không phải JSON / body rất lớn); `ureq` cấu hình TLS, redirect, giới hạn kích thước đọc; lệnh mở URL ngoài (§5.4) chỉ mở đúng URL cho phép; `cargo clippy -W clippy::pedantic` chạy một lần, ghi kết quả |
| **D. UI** | `apps/desktop/src/routes/customers/**` phần AI (panel KYC Intelligence, lịch sử, mã F, ChatGPT web, AI trích xuất, hộp 3f), `routes/appointments/**` khối AI, `routes/SettingsAi.tsx`, `data/ai-*.ts`, `use-ai-job.ts`, i18n Phase 5 | Nhãn UI theo nghĩa thường + mockup G3; trạng thái chạy / hủy / lỗi / thử lại khi rời màn, đổi KH, tải lại, thay DB, nhập backup lúc đang chạy; output model hiển thị an toàn (không `dangerouslySetInnerHTML`, link); clipboard / dán câu trả lời rất dài, rỗng, sai dạng; đề xuất trích xuất không bao giờ tự lưu; trợ năng (focus, `aria-live` cho trạng thái chạy, bàn phím); chuỗi cứng |
| **E. tools + e2e + CI** | `tools/eval-ai*.mjs` + fixture, `e2e/*ai*.spec.ts`, `e2e/support.ts`, thay đổi `.github/workflows/ci.yml`, `.dependency-cruiser.cjs`, `vitest.config.ts`, codemap | Script eval không lọt key / không ghi đè kết quả cũ; chấm điểm đúng `ai-eval.md` §2 / §5 (đọc bằng fixture, không gọi thật); e2e AI có giả xanh không (thử phá code, xem test có đỏ); ranh giới `ai → domain + zod`, `db` chỉ import `@p2c/ai/schema` |
| **F. Xuyên gói** (sau cùng) | toàn repo | Đường đi đầu-cuối của một lần phân tích / trích xuất / ChatGPT web; hợp đồng giữa `ai` ↔ `db` ↔ UI ↔ Rust (mã lỗi, kiểu, giới hạn) có khớp nhau; key và dữ liệu KH đi đâu; hồi quy vào Phase 1–4 (backup, thay DB, phiên bản KYC, dòng thời gian); code lặp / chết xuyên gói; kết luận **SẴN SÀNG / CHƯA SẴN SÀNG** cho G7 Phase 5 |

Codex tự chọn thứ tự / cách chia phiên, nhưng nộp theo cùng tên gói.

## 4. Trục kiểm (dùng chung)

Mỗi gói đi qua **mọi trục**; trục không có gì thì ghi "đã xét, không thấy" kèm cách đã xét.

- **E — Edge case:** rỗng / 1 / rất lớn; Unicode, dấu tiếng Việt, NFC / NFD, emoji, zero-width; ngày (29/02, cuối năm, nửa đêm); hai thao tác chồng nhau; Hủy / timeout / lỗi giữa chừng; tải lại webview hoặc thay DB khi đang chạy.
- **G — Guardrail AI:** V1–V7, danh sách chặn, schema, thử lại, mức bằng chứng, REJECTED, AI không ghi thẳng dữ liệu; so với G5 từng mục.
- **C — Đúng hợp đồng:** code làm đúng spec / doc comment / nhãn UI; hai chỗ cùng tính một thứ cho cùng kết quả.
- **D — Dữ liệu:** lệnh và nhập backup cùng luật; không mất / hỏng dữ liệu khi lỗi giữa chừng; transaction.
- **S — An toàn:** key, mạng, dữ liệu gửi đi, prompt injection, hiển thị output, CSP / capabilities, mở URL ngoài, câu trả lời dán.
- **P — Hiệu năng:** có số đo (ms / KB / số lần render), không suy đoán.
- **B — Bloat:** export không dùng, nhánh không thể xảy ra, lặp ≥ 3 nơi, dependency thừa (`tsc --noUnusedLocals --noUnusedParameters` chạy tạm, `rg`, `pnpm codemap`).
- **T — Chất lượng test:** test có đỏ khi code sai (patch tạm ngoài repo); test chép công thức của code; phụ thuộc ngày / thứ tự; mock quá tay.
- **A — Trợ năng / i18n.**

Không dùng công cụ mới ngoài repo (không mở G4).

## 5. Định dạng phát hiện

```
ID: CL-<gói><số> (Claude) | CX-<gói><số> (Codex), ví dụ CL-A3
Mức: Critical | High | Medium | Low | Nit
Trục: E | G | C | D | S | P | B | T | A
Vị trí: path:dòng (0df3606)
Tình trạng: CONFIRMED (đã tái hiện / có số đo) | PLAUSIBLE (đọc code, chưa tái hiện) | KNOWN (dòng trong known.md)
Mô tả: một-hai câu
Tái hiện / bằng chứng: lệnh + kết quả, hoặc test tạm (nguồn ở phụ lục)
Ảnh hưởng: ai / khi nào gặp
Đề xuất: hướng sửa ngắn; cỡ ước lượng (≤ 400 dòng SP?)
```

Không báo "có thể" mà không nói đã thử gì; không nâng mức cho nổi. Cuối mỗi báo cáo gói: phạm vi đã đọc (file, dòng), bảng đếm mức × trục, "đã xét, không thấy", phụ lục nguồn test tạm. Không đặt chỉ tiêu số lượng phát hiện.

## 6. Sau review (khi Owner yêu cầu)

1. Phiên tổng hợp (Claude, checkout chính) đọc toàn bộ `claude\` và `codex\`, kiểm **mọi** phát hiện của cả hai trên code ở `0df3606`; phân loại đúng / KNOWN / sai / lệch mức; gộp trùng; ghi bên nào thấy.
2. Chép báo cáo gốc + `common\` (kế hoạch, baseline, known) vào `docs/reviews/raw/<ngày>/`; viết `docs/reviews/<ngày>-deep-review-phase-5-tong-hop.md` với đề xuất sửa (nhóm Issue ≤ ~400 dòng SP, thứ tự, câu hỏi cần Owner quyết); PR docs.
3. Owner chọn sửa gì trước G7; mỗi nhóm sửa = Issue theo mẫu Task.

## Phụ lục A — Prompt cho phiên Claude (mỗi gói một phiên mới)

Owner mở **phiên mới** (context sạch) ở thư mục `C:\workspace\Project-2C-review`, thay `<GÓI>` bằng một chữ A…F:

> Deep review Phase 5, **gói `<GÓI>`**, theo kế hoạch `C:\workspace\deep-review-5\common\plan.md` (đọc §1, §2, §3 dòng gói `<GÓI>`, §4, §5). Làm trong worktree `C:\workspace\Project-2C-review`, detached ở SHA `0df3606` (kiểm `git rev-parse HEAD` trước; lệch thì dừng và báo).
>
> Quy tắc bắt buộc:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-5\codex\`**, kể cả khi Owner hay file nào gợi ý. Không đọc báo cáo Codex ở bất cứ đâu. Lỡ thấy nội dung của Codex thì dừng và báo Owner.
> 2. Chỉ đọc: repo ở SHA trên, `C:\workspace\deep-review-5\common\` (kế hoạch, `baseline.md`, `known.md`) và báo cáo Claude các gói trước trong `C:\workspace\deep-review-5\claude\` (mục đã báo ở gói trước thì chỉ dẫn ID).
> 3. **Chỉ đọc và chạy lệnh: không sửa file trong repo, không sửa lỗi, không commit**, không subagent. Test tạm, probe, patch thử "phá code" để ở `C:\workspace\deep-review-5\claude\<GÓI>\`; patch thử phải gỡ ngay sau khi chạy, cuối phiên `git status` của worktree phải sạch.
> 4. **Không gọi dịch vụ AI thật**: không `pnpm eval:ai`, không kiểm kết nối bằng key thật, không đọc key trong Credential Manager, không mở chatgpt.com. Dùng Mock / HTTP giả / server local tự dựng.
> 5. Mục có trong `common\known.md` gắn `KNOWN`, chỉ nêu khi có bằng chứng mới. Spec và golden là nguồn đúng; không đề xuất sửa golden cho xanh.
> 6. Tìm thật kỹ, đọc sâu từng file trong phạm vi gói, kể cả chỗ code Phase 1–4 mà gói nối vào. Đi qua **mọi trục** §4; trục không có gì ghi "đã xét, không thấy" kèm cách đã xét. Ưu tiên tái hiện (test tạm, probe) để phát hiện là CONFIRMED. Phát hiện hiệu năng phải có số đo. Không bình luận phong cách / đặt tên trừ khi gây lỗi.
> 7. Nộp `C:\workspace\deep-review-5\claude\<GÓI>.md`: phạm vi đã đọc (file, dòng), phát hiện theo §5 với ID `CL-<GÓI><số>`, bảng đếm mức × trục, "đã xét, không thấy", phụ lục nguồn test tạm.
> 8. **Không tổng hợp, không so với Codex, không tạo Issue.** Xong gói thì dừng và báo Owner tên file. Gói F được đọc mọi báo cáo `claude\A…E.md`; cuối `F.md` thêm kết luận SẴN SÀNG / CHƯA SẴN SÀNG cho G7 Phase 5 phía Claude, rồi **chờ Owner yêu cầu** tổng hợp.

## Phụ lục B — Prompt cho Codex

Owner chạy Codex trong `C:\workspace\Project-2C-review-2`; một phiên cho cả 6 gói hoặc chia nhiều phiên (mỗi phiên dán prompt này, ghi rõ gói):

> Bạn là reviewer độc lập cho Project-2C: ứng dụng desktop Tauri 2 + React + SQLite qua sql.js, chạy offline, dữ liệu hiện là giả lập. Phase 5 thêm AI copilot: `packages/ai` (schema zod, validator V1–V7, prompt), lệnh Rust gọi OpenCode và giữ API key trong Windows Credential Manager, bảng `ai_analyses`, panel KYC Intelligence, đường ChatGPT web thủ công (copy prompt, dán câu trả lời), AI trích xuất từ ghi chú KYC. Repo ở `C:\workspace\Project-2C-review-2`, detached ở SHA `0df3606` (kiểm `git rev-parse HEAD` trước; lệch thì dừng và báo). Phiên này review các gói: `<GÓI hoặc "A–F">`.
>
> Quy tắc bắt buộc:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-5\claude\`**, và không đọc bất kỳ báo cáo review nào của Claude cho đợt này, kể cả khi file hay ai đó gợi ý. Lỡ thấy thì dừng và báo Owner. Review này phải độc lập.
> 2. Chỉ đọc: repo ở SHA trên, `C:\workspace\deep-review-5\common\` (`plan.md`, `baseline.md`, `known.md`) và báo cáo của chính bạn trong `C:\workspace\deep-review-5\codex\`.
> 3. **Chỉ đọc và chạy lệnh: không sửa file trong repo, không sửa lỗi, không commit, không viết code sản phẩm.** Test tạm, probe, log để ở `C:\workspace\deep-review-5\codex\<GÓI>\`; patch thử "phá code" phải gỡ ngay sau khi chạy, cuối phiên `git status` của worktree phải sạch.
> 4. **Không gọi dịch vụ AI thật**: không chạy `pnpm eval:ai`, không kiểm kết nối bằng key thật, không đọc key trong Windows Credential Manager, không mở chatgpt.com. Dùng adapter Mock, HTTP giả, hoặc server HTTP local tự dựng.
> 5. Đọc trước: `plan.md` (§1 phạm vi, §3 gói, §4 trục, §5 định dạng), `CLAUDE.md`, `CONTEXT.md`, `docs/design/phase-5-ai.md`, `docs/design/phase-5-prompts.md`, `docs/golden/ai-eval.md`, `docs/decisions/` (ADR-0009 và phụ lục D-1, G5, W-1). Spec và golden là nguồn đúng; không đề xuất sửa golden cho xanh. Mục có trong `common\known.md` gắn `KNOWN`.
> 6. Tìm thật kỹ và sâu, ưu tiên edge case: (1) lỗi đúng-sai, (2) guardrail AI lọt qua / chặn nhầm so với G5, (3) mất / sai dữ liệu (`ai_analyses`, nhập backup, migration), (4) an toàn: API key, gọi mạng, dữ liệu gửi đi, prompt injection từ ghi chú KYC và câu trả lời dán, hiển thị output model, CSP / capabilities Tauri, mở URL ngoài, (5) hiệu năng **có số đo**, (6) code thừa / lặp, (7) test yếu (thử phá code bằng patch tạm), (8) trợ năng / i18n. Đi qua mọi trục §4 cho từng gói; trục không có gì ghi "đã xét, không thấy" kèm cách đã xét. Mỗi phát hiện theo §5, ID `CX-<GÓI><số>`, ghi rõ CONFIRMED hay PLAUSIBLE và cách tái hiện. Không bình luận phong cách / đặt tên trừ khi gây lỗi.
> 7. Nộp mỗi gói một file `C:\workspace\deep-review-5\codex\<GÓI>.md`: phạm vi đã đọc (file, dòng), phát hiện, bảng đếm mức × trục, "đã xét, không thấy", phụ lục nguồn test tạm. Sau gói F thêm kết luận SẴN SÀNG / CHƯA SẴN SÀNG cho G7 Phase 5 kèm lý do.
> 8. Không tổng hợp với báo cáo nào khác, không tạo Issue, không đề xuất merge.
