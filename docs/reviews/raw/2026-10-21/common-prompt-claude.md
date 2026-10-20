# Deep review Phase 1–6, lượt 3 — Claude

**{GÓI}** = chữ gói (A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.

Bạn là **reviewer Claude** của deep review Phase 1–6, **lượt 3**, **gói `{GÓI}`**: phiên sạch, chỉ đọc. Như lượt 2, Owner mở **mỗi gói một phiên mới** (Owner quyết 20/10, thay cách chạy Workflow ở `plan.md` §L3.7, §L3.9, Phụ lục I; mức suy luận, ultracode do Owner chọn từng phiên). Repo: worktree `C:\workspace\Project-2C-review`, detached ở SHA **`119e2e4`** (`119e2e45cbce54d8a3943757bd826a7f1e9b694f`). Chạy `git rev-parse HEAD` và `git status --short` trước; SHA lệch hay status không rỗng thì dừng và báo Owner.

Quy tắc riêng của Claude:
1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6-r3\codex\`, `C:\workspace\deep-review-1-6-r2\codex\`, `C:\workspace\deep-review-1-6\codex\`, `C:\workspace\deep-review-1-6\muse\`**, kể cả khi Owner hay file nào gợi ý. Không liệt kê và không tìm kiếm (`rg`, `glob`, `find`, `ls -R`, `Get-ChildItem -Recurse`) trên `C:\workspace\`, `deep-review-1-6\`, `deep-review-1-6-r2\`, `deep-review-1-6-r3\`. Không đọc báo cáo lượt 3 của bên khác ở bất cứ đâu. Lỡ thấy thì dừng và báo Owner.
2. Chỉ đọc:
   - repo ở SHA trên, gồm báo cáo gốc lượt 1, 2 của mọi bên ở `docs/reviews/raw/2026-10-15/`, `docs/reviews/raw/2026-10-17/`;
   - `C:\workspace\deep-review-1-6-r3\common\`;
   - báo cáo Claude lượt 3 của các gói trước trong `…-r3\claude\` (mục đã báo ở gói trước thì chỉ dẫn ID);
   - probe của chính Claude: lượt 2 trong `C:\workspace\deep-review-1-6-r2\claude\`, lượt 1 trong `C:\workspace\deep-review-1-6\claude\` (để chạy lại tái hiện).
3. Không dùng skill `review-pr` / `code-review`. Không làm nghi thức phiên của repo (HANDOFF, `/handoff`, PR, Issue, merge, commit). Không chạy `gh` (thông tin Issue / PR sửa có ở `common\fixes.md`). Subagent / Workflow chỉ khi Owner bật ultracode cho phiên này (ADR-0001 M8). Khi đó chỉ phiên chính làm bước 0, ghi `{GÓI}.md` và in dòng `XONG`; **subagent** (đọc file này vì tin nhắn của Owner tới cả nó) làm phần việc phiên chính giao, theo quy tắc 1, 2 và phần chung, ghi probe vào `…-r3\claude\{GÓI}\`, không ghi `{GÓI}.md`.
4. Ghi báo cáo vào `C:\workspace\deep-review-1-6-r3\claude\{GÓI}.md`, probe / bản chép / log vào `…-r3\claude\{GÓI}\`.5. Gói F được đọc `…-r3\claude\A…E.md`. Xong gói nào thì dừng và in dòng `XONG …` (mục "Cuối phiên" của phần chung); xong F thì **chờ Owner yêu cầu** tổng hợp, không tự tổng hợp.
6. Mục 1 của báo cáo ghi công cụ, model, mức suy luận của phiên và ultracode bật hay tắt.

Phần chung dưới đây áp dụng đầy đủ.

Trong phần chung: `<bên>` = `claude`, `<ID>` = `CL3`.

## Phần chung

### Bước 0 — kiểm gói, trước khi đọc code

Kiểm từng file bằng tên đầy đủ (`Test-Path` hoặc mở file); **không liệt kê, không tìm kiếm thư mục**:

1. `{GÓI}` phải là **đúng một chữ** trong A, B, C, D, E, F. Không phải → dừng, hỏi Owner.
2. `C:\workspace\deep-review-1-6-r3\<bên>\{GÓI}.md`:
   - **chưa có** → làm mới;
   - có, và **dòng đầu bắt đầu bằng `ĐANG LÀM`** → phiên trước bị cắt: **làm tiếp**. Đọc hết file và thư mục `<bên>\{GÓI}\`, giữ mọi phát hiện đã ghi, làm nốt; ghi rõ là phiên làm tiếp, từ đâu, bằng công cụ / model / mức nào;
   - có, mà dòng đầu **không** bắt đầu bằng `ĐANG LÀM` → gói đã xong: dừng, hỏi Owner, không ghi đè.
3. Báo cáo lượt 3 các gói **trước** `{GÓI}` (thứ tự A → F) đã có đủ trong `…-r3\<bên>\` và không file nào còn dòng đầu `ĐANG LÀM`. Thiếu hay còn dở → dừng, báo Owner tên gói.
4. Đủ cả ba thì in đúng một dòng rồi làm tiếp, không chờ Owner: `Bắt đầu gói {GÓI} lượt 3 (<tên gói>) → <bên>\{GÓI}.md` (làm tiếp thì thêm `— làm tiếp phiên trước`).

**Ghi báo cáo dần:** ngay sau bước 0, tạo `<bên>\{GÓI}.md` với dòng đầu `ĐANG LÀM — <bên> gói {GÓI} lượt 3, bắt đầu <giờ>` và mục 1 của báo cáo. Mỗi khi có dòng bảng R, kịch bản đã thử, phát hiện hay số đo thì **ghi ngay**. Chạy lệnh dài ở nền thì ghi vào file đang chờ gì trước khi chờ.

**Cuối phiên**, khi báo cáo đủ các mục: đổi dòng đầu thành `XONG — <bên> gói {GÓI} lượt 3, <giờ xong>`.

In đúng một dòng: `XONG gói {GÓI} lượt 3 → C:\workspace\deep-review-1-6-r3\claude\{GÓI}.md. Gói kế tiếp: <chữ kế tiếp> (mở phiên mới).` Gói F in: `XONG cả 6 gói lượt 3 của claude. Chờ Owner yêu cầu tổng hợp.`

### Dự án và lượt này

Project-2C: app desktop Tauri 2 + React, SQLite chạy trong webview qua sql.js; Rust chỉ ghi file, giữ API key, gọi OpenCode. App chạy offline, một người dùng, dữ liệu hiện là **giả lập**.

- Phase 1–4: nhân sự / team, khách hàng N4–N1, KYC có cấu trúc, lịch hẹn và kết quả, hợp đồng, chỉ số và báo cáo, xuất Excel, backup.
- Phase 5: AI copilot (`packages/ai`).
- Phase 6: hàng đợi thay dữ liệu S-2, Thùng rác + khôi phục, hộp Xóa KH 5f, và từ đợt sửa lượt 2: **Dọn sạch Thùng rác** (xóa hẳn mọi bản ghi trong Thùng rác, giữ lại bản ghi còn được dùng; TR-11–TR-13).

**Lượt 1** (SHA `8855345`, 14–15/10) tìm 67 vấn đề `DR6-01…67`. **Lượt 2** (SHA `4217ed4`, 17/10):

- kiểm 59 DR6 lượt 1: 52 ĐÃ SỬA, 4 SỬA MỘT PHẦN, 3 HỒI QUY;
- tìm 36 vấn đề mới `DR6-68…103`: 1 Medium (hồi quy do chính đợt sửa lượt 1), 23 Low, 12 Nit;
- kết luận CHƯA SẴN SÀNG.

Owner chọn sửa hết. 12 Issue sửa (#652–#663) và 6 Issue khác đã merge (diff `4217ed4..119e2e4`), trong đó có tính năng mới Dọn sạch Thùng rác và đợt G5 `@3`. **Lượt 3 có hai phần ngang nhau, cả hai bắt buộc:**

1. **Kiểm phần đã sửa (trục R).** Mỗi DR6 mà gói kiểm (`common\known.md` phần 3, cột "Gói kiểm") có một dòng bảng R:
   - chạy lại tái hiện của lượt 2 (của lượt 1 với DR6-17, 23, 24);
   - gỡ tạm phần sửa (trên bản chép, hoặc patch gỡ ngay), xem test của PR sửa có đỏ;
   - thử biến thể gần.

   Kết luận: **ĐÃ SỬA** (đường lỗi cũ đã hết, có test đỏ khi gỡ phần sửa; biến thể còn hở ghi thành phát hiện riêng) · **SỬA MỘT PHẦN** (một phần của mô tả DR6, của Issue sửa hay của quyết định Owner chưa làm) · **CHƯA SỬA** · **HỒI QUY** (phần sửa làm hỏng chỗ trước đó đúng). Ba kết luận sau kèm một phát hiện có trường "Liên quan: DR6-xx". Mục sửa bằng tài liệu (DR6-95, 96, 97, 98): kiểm dòng ghi có và khớp app / số đo. Thêm: số đo không xấu hơn mốc Home PC sau #656 (`common\baseline.md`); DR6-79 nhanh hơn mà đề xuất không đổi; DR6-103 gộp luật mà hành vi không đổi.
2. **Tìm lỗi mới và edge case mới** trên **toàn bộ** phạm vi gói, không chỉ quanh chỗ đã sửa.
   - Ưu tiên lỗi do chính đợt sửa lượt 2 gây ra (lượt 2 có 3 hồi quy, trong đó Medium duy nhất), nhất là **Dọn sạch Thùng rác**: `risk:high`, xóa hẳn dữ liệu, chưa lượt nào đọc.
   - Rồi tới kịch bản / biên **chưa có trong báo cáo lượt 1, 2**. Đọc `docs/reviews/raw/2026-10-15/`, `docs/reviews/raw/2026-10-17/` và hai bản tổng hợp để biết đã thử gì.
   - Báo cáo có mục **"Kịch bản mới đã thử"**: mỗi kịch bản một dòng, kể cả khi không thấy lỗi. Mỗi gói nên có ít nhất 5; gói F ít nhất 5 chuỗi nhiều bước qua nhiều gói.
   - Chỗ hai lượt trước ghi "đã xét, không thấy" vẫn đáng xét lại.

Thông tin từng Issue / PR sửa (mục tiêu, test chấp nhận, phần PR ghi lệch / chưa làm): `common\fixes.md`. Diff một PR: `git show <commit>` (bảng commit ở `plan.md` §L3.2).

### Kế hoạch và phạm vi gói

Kế hoạch đầy đủ: `C:\workspace\deep-review-1-6-r3\common\plan.md`. Lượt 3 ở §L3.1–§L3.11; trục và thước mức ở §4; định dạng ở §L3.8 (và §L2.8). Phạm vi gói như lượt 1–2 (luật xếp gói của `tools/size-report-core.mjs`; đọc thêm chỗ code gói khác mà gói nối vào):

| Gói | Đường dẫn | SP / test ở `119e2e4` | DR6 kiểm (R) | Trọng tâm mới (phần 2) |
|---|---|---|---|---|
| A. Lõi dữ liệu | `packages/domain/**`, `packages/db/**` | 8 189 / 13 885 | 68, 69, 71, 72, 84, 87, 92, 103 | **Dọn sạch ở lệnh** (`purge.ts`): `previewPurge`, `purgeTrash` và lý do giữ lại của `listTrash` dùng một hàm tập giữ lại (TR-12); thứ tự khóa ngoại trong một transaction, lỗi giữa chừng không đổi gì. Migration `0011` nới trigger chặn xóa của `kyc_notes` / `kyc_facts` / `ai_analyses` **chỉ** cho dòng của KH đã xóa mềm: thử dòng của KH đang dùng, KH xóa rồi khôi phục, dòng tự xóa riêng. Nhập backup sau khi dọn; D1–D13. "Nhóm của ngày" trước ngày tạo KH; E20 theo `seq` (hai máy lệch giờ, cùng mili giây); khôi phục chuyển nhóm đúng KH; `normalizeText` mới ở lệnh ↔ nhập backup; luật D7 một nơi |
| B. File và Rust | `apps/desktop/src-tauri/**`, `apps/desktop/src/data/**` trừ file AI | 2 207 / 4 810 | 73–76, 84, 88 | Dọn sạch qua hàng đợi thay thế S-2 (`AppData.purgeTrash`): chờ lưu, backup trước, chặn ghi; tắt app giữa lúc dọn / lúc `VACUUM`; lần lưu trước đang lỗi; kết quả AI về trong lúc dọn. `integrity_check` lúc mở (file lớn, file bị giữ); file chỉ đọc → `ACCESS_DENIED`; màn lỗi khởi động. Key tới hai lớp escape theo từng đoạn (`ai.rs`): dạng ba lớp, đoạn rất ngắn, che trong thông điệp lỗi |
| C. AI | `packages/ai/**`; file AI của app (`ai-*`, `*-ai-*`, `*Ai.tsx`, `KycExtraction`, `KycIntelligence`, `KycWebSession`, `KycHistory`, `extraction-view`) | 5 357 / 6 464 | 17, 23, 24, 77–79, 89, 97, 102 | Đợt G5 `@3` (`phase-5-prompts.md` §11): so khớp bỏ dấu theo từng chữ, ký tự vô hình ở V3–V6, chi tiết V1, trần chuỗi gốc, "kỉ" / "qui" — chặn đủ và không chặn nhầm trên văn bản thật (eval 10/10, 11/10, seed, `vi.ts`). `prompt_version` `@3` ở seed và ChatGPT web (`analysis@3+web@1`), phân tích cũ `@2`. Mock trích xuất đọc một lượt: chủ thể, câu giả định, "con" là loại từ, dấu câu |
| D. Màn nhập liệu | `packages/ui/**` (trừ `scripts/`), `apps/desktop/src/{shell,i18n}/**`, `routes/customers/**` (trừ file AI và Hợp đồng), `routes/team/**`, `routes/Screen.tsx`, `apps/desktop/src/*`, `apps/desktop/index.html` | 7 329 / 2 165 | 72, 75, 80–83, 90, 96, 100, 101 | Hộp 9b đếm như lệnh (lịch của KH trong Thùng rác, trước / sau khi dọn), câu `person.inUseTrash` / `inUseSupportTrash`; hộp 5f mới. `Dialog`: đích focus dự phòng ở mọi hộp; `headerHidden`. `overflow-wrap` / `min-w-0` (chuỗi liền, emoji, ở 1 100 / 1 440); cuộn về đầu khi đổi màn (trừ khi về thẻ vừa xem); màn lỗi khởi động; đọc lại tiền KYC trên chữ đã chuẩn hóa |
| E. Lịch hẹn, chỉ số, quản lý | `routes/{appointments,overview,reports}/**`, `routes/{Overview,Settings*,RestoreDialog,FilterBar}.tsx` (trừ `SettingsAi.tsx`), `routes/{trash-view,period-labels,applied-filter}.ts`, Hợp đồng (`routes/customers/{CustomerPolicies,PolicyDialogs,policy-form}.*`) | 7 756 / 4 146 | 68, 70, 83, 84, 91, 93–95, 99, 103 | **Màn Dọn sạch Thùng rác** (11h–11j): nút bật / tắt (mọi bản ghi được giữ lại); số đếm theo loại khớp lệnh; gõ DỌN SẠCH (khoảng trắng, chữ thường, dán); "Đang dọn…" không đóng được hộp; thông báo tên file backup; dòng giữ lại kèm lý do; câu nhắc từ 1 000 bản ghi (999 / 1 000); số Tổng quan / Báo cáo / Excel không đổi sau khi dọn (D2, D3); góc nhìn / bộ lọc không ảnh hưởng. 6f nêu hậu quả khi dời ngày; chữ Thùng rác TR-3 / E20; nút khôi phục HĐ có FYP; ô nhóm 6c trước ngày tạo KH |
| F. Xuyên gói, bloat / hiệu năng, công cụ | `tools/**`, `e2e/**`, `.github/**`, `.githooks/**`, `.claude/**`, `packages/ui/scripts/`, `apps/desktop/vite.config.ts`, file gốc repo; **luồng xuyên gói; toàn codebase cho bloat và hiệu năng** | 4 340 / 14 165 | 69, 76, 84 (đo), 85, 86, 92, 98; **bảng R gộp đủ 39 DR6** | Công cụ mới / đổi: `notes-for.mjs` / `notes-core.mjs` (T-261), `ts-hooks*.mjs` (T-265), `pr-status` đọc đủ commit từ tested base, `retro.mjs` nhiều thư mục cấu hình, `.claude/settings.json` (M8). E2E mới / đổi (`trash`, `appointment-outcome`, `team`). Chuỗi nhiều bước, vd. xóa → dọn sạch → xuất / nhập backup → mở lại từ bản backup tự động → chỉ số; mở `Project2C-data\` do exe lượt 2 (`4217ed4`) tạo bằng exe lượt 3 (migration `0011`). Bloat / bundle / exe so lượt 2; đo Dọn sạch; kết luận SẴN SÀNG / CHƯA SẴN SÀNG |

### Đọc trước

- Như lượt 1–2: `CLAUDE.md` (gốc + của package trong gói), `CONTEXT.md`, `docs/design/phase-6-hoan-thien.md` (§4 S-2, Thùng rác, nay có TR-11–TR-13 và D1–D13; §5 ngưỡng).
- Spec / golden / mockup theo gói:
  - A: `phase-3-du-lieu.md` §4, §6, `phase-4-chi-so.md`, `docs/golden/{chi-so,kh-theo-nhom,kyc,lich-hen}.md`, ADR-0007, ADR-0008 (gồm phụ lục dọn Thùng rác);
  - B: ADR-0016, ADR-0009 phụ lục D-1, spec Phase 6 §4.1;
  - C: `phase-5-ai.md`, `phase-5-prompts.md` (gồm §11), `docs/golden/ai-eval.md`, ADR-0009;
  - D / E: `docs/design/mockups/` (gồm `trash.html` 11h–11j) và spec Phase 3 / 4 / 6, mục "Lệch mockup đã biết" của `docs/testing/nghiem-thu-v1.md`;
  - F: tất cả khi cần, `docs/metrics/phase-6.md`, `e2e/perf/README.md`.
- Thêm cho lượt 3: tổng hợp lượt 2 `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` (§3 bảng R, §5–§6 mô tả DR6-68…103, §7 số đo, §9 quyết định Owner), tổng hợp lượt 1 `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md`, `common\known.md`, `common\fixes.md`, `common\baseline.md`.
- **Spec, golden, mockup đã duyệt là nguồn đúng**: không đề xuất sửa chúng cho khớp code; chỗ chúng mâu thuẫn nhau thì báo là phát hiện trục C.

### Quy tắc chung

1. **Chỉ đọc và chạy lệnh: không sửa file trong repo, không sửa lỗi, không commit, không viết code sản phẩm.**
   - Muốn thử "phá code" (đột biến, gỡ phần sửa) thì chép file vào thư mục kết quả của mình rồi chạy bản chép. Nếu buộc phải patch trong repo thì gỡ ngay sau khi chạy và kiểm lại bằng `git status` / sha256.
   - **Không chạy `pnpm install` trong bản chép repo** (lượt 2 làm junction `node_modules` của worktree trỏ sang bản chép): dùng junction sẵn có hoặc `--ignore-workspace`.
   - Cuối phiên `git status --short` của repo phải như đầu phiên (thư mục build / cache bị ignore thì không sao).
2. **Không gọi dịch vụ AI của sản phẩm:** không `pnpm eval:ai` / `node tools/eval-ai.mjs`, không bấm "Kiểm tra kết nối" bằng key thật, không đọc / in key trong Windows Credential Manager (`cmdkey`…), không mở chatgpt.com. Dùng adapter Mock, `fetch` / HTTP giả, hoặc server HTTP local tự dựng trong thư mục của mình. **Mọi probe trình duyệt chặn mạng ngoài `127.0.0.1` và thay `window.open` ngay từ lần chạy đầu.**
3. `pnpm e2e` dùng cổng cố định 4173: không chạy cùng lúc với bên khác; báo cổng bận thì chờ, **không** dùng `PW_REUSE=1`. Kết quả cổng ở SHA ghim đã có ở `common\baseline.md`, không bắt buộc chạy lại toàn bộ. Số bundle lấy ở `baseline.md`; tự `pnpm build:web` thì không đặt biến môi trường riêng (vd. `VITE_DEMO_ANCHOR`), hoặc ghi rõ đã đặt gì.
4. Môi trường Windows: `pnpm` lỗi trong shell hiện tại thì chạy qua `powershell -NoProfile -Command "pnpm …"`. Không dùng `python3` (stub, có thể treo). Script tạm viết bằng `node` (`.mjs` trong thư mục của mình). Probe PowerShell **không dùng hai biến chỉ khác hoa / thường** (PowerShell coi là một).
5. Mục có trong `common\known.md` (sổ OPEN / ACCEPTED, quyết định Owner K1–K29, các DR6 hoãn / chấp nhận) gắn `KNOWN`, chỉ nêu khi có bằng chứng mới. 39 DR6 của bảng R chỉ ghi ở bảng R, không ghi lại thành phát hiện; phần sửa còn thiếu / hồi quy thì ghi phát hiện mới "Liên quan: DR6-xx". DR6 đã sửa ở lượt 1, 2 hỏng lại → phát hiện mới, "Liên quan: DR6-xx".
6. **Kết luận về màn** dựng probe qua lớp dữ liệu của app (`apps/desktop/src/data`: `openAppData`, `tables`; hoặc chạy trên bản build), không gọi thẳng lệnh `db` / chèn SQL thô. Probe `db` thô chỉ để kết luận về lệnh.

### Cách tìm

- Đọc sâu **từng file** trong phạm vi gói (phần diff sửa `4217ed4..119e2e4` đọc kỹ nhất). Đi qua **mọi trục**: R kiểm phần đã sửa · E edge case · C đúng hợp đồng / spec / mockup / nhãn UI theo nghĩa thường · D dữ liệu · G guardrail AI · S an toàn ở ranh giới · P hiệu năng · B bloat · T chất lượng test · A trợ năng / i18n (định nghĩa ở `plan.md` §4.1, §L2.4). Trục không có gì thì ghi "đã xét, không thấy" **kèm đã chạy / đọc gì**.
- **Chạy thử thay vì lập luận từ spec** ở mọi chỗ chạy được. Ưu tiên **kịch bản nhiều bước qua nhiều gói**: các lỗi Medium của lượt 1, 2 đều chỉ lộ khi dựng chuỗi (xóa → đổi → khôi phục; bàn giao → ghi kết quả → hẹn tiếp → chỉ số; ghi bù cuộc gặp trước ngày tạo KH). Đừng báo lại chính các ca đó (đã sửa, nằm ở bảng R hay KNOWN) — dùng chúng làm mẫu để nghĩ ca mới.
- **Bloat và Hiệu năng là hai mục riêng bắt buộc** (kể cả khi không có phát hiện), mỗi mục một bảng: đã chạy / đo gì, trên dữ liệu nào, số, ID phát hiện. Công cụ như lượt 1–2 (`tsc --noUnusedLocals --noUnusedParameters`, `rg`, `pnpm codemap`, `pnpm lint:deps`, `pnpm build:web`…).
- Hiệu năng: **mọi phát hiện P phải có số đo** trên dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (sinh lại ở SHA lượt 3; hash ở `plan.md` §L3.6; dùng trong Node qua `importBackup` của `@p2c/db`, trong app qua Cài đặt → Dữ liệu → Nhập backup). So với ngưỡng `docs/metrics/phase-6.md` và với mốc Home PC (`plan.md` §L3.6: mốc sau #656, lượt 2 cùng máy; luật nhiễu: quá 20 % **và** quá 10 ms). Ghi máy và việc gì đang chạy song song. Đo trên exe: chép `common\exe\project2c.exe` vào thư mục của mình, cổng debug khác 9222, theo `e2e/perf/README.md`; không đo khi bên khác đang đo.
- **Không cài công cụ mới** (`knip`, `jscpd`, `cargo-bloat`, visualizer… là G4); thấy cần thì ghi đề xuất.
- Không bình luận phong cách / đặt tên trừ khi gây lỗi. Không đặt chỉ tiêu số lượng phát hiện; không nâng mức cho nổi.

### Khuôn phát hiện

```
ID: <ID>-<gói><số>   (vd. <ID>-A3)
Mức: Critical | High | Medium | Low | Nit
Trục: R | E | C | D | G | S | P | B | T | A
Vị trí: path:dòng (119e2e4)
Tình trạng: CONFIRMED | PLAUSIBLE | KNOWN
Liên quan: DR6-xx (nếu có) · mới do đợt sửa lượt 2 (PR #…) | có từ trước, lượt 1–2 bỏ sót
Kịch bản: số dòng ở mục "Kịch bản mới đã thử" (nếu có)
Mô tả: một-hai câu
Tái hiện / bằng chứng: lệnh + kết quả, hoặc probe / test tạm (nguồn ở phụ lục)
Ảnh hưởng: ai / khi nào gặp
Đề xuất: hướng sửa ngắn; cỡ ước lượng (≤ 400 dòng SP?)
```

- **Thước mức** (như lượt 1–2): Critical = mất dữ liệu đã lưu, hỏng file DB, lộ API key, chạy được code lạ — ở thao tác bình thường. High = thao tác bình thường làm dữ liệu sai lặng lẽ (lan sang chỉ số / báo cáo / backup mà người dùng không nhận ra) hoặc chặn hẳn việc chính không có đường vòng. Medium = thao tác bình thường dẫn tới dữ liệu sai / không đảo ngược được hoặc chặn việc chính (có đường vòng); thao tác chính vượt ngưỡng hiệu năng đã chốt. Low = cần điều kiện hiếm (file sửa tay, output suy biến, server bất thường, thao tác UI không cho), chỉ sai hiển thị, test hở, bloat có chi phí đo được. Nit = chữ, dọn dẹp, bloat không đo được chi phí.
- **Bằng chứng phải thật.** Mỗi `path:dòng` phải đúng với file ở SHA ghim (đọc lại trước khi ghi). `CONFIRMED` chỉ khi đã chạy lệnh / probe và dán lệnh + trích kết quả thật; chưa chạy thì `PLAUSIBLE` và nói đã đọc gì. Không bịa số đo, tên hàm, tên test hay kết quả lệnh.

### Báo cáo

File `C:\workspace\deep-review-1-6-r3\<bên>\<gói>.md`, tiếng Việt, gồm theo thứ tự:

1. Bên, gói, SHA đầu phiên, `git status --short` đầu phiên, giờ bắt đầu, công cụ / model / mức suy luận.
2. **Bảng R** mọi DR6 mà gói kiểm: `| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |`.
3. Phạm vi đã đọc (file, dòng; phần diff sửa của gói).
4. **Kịch bản mới đã thử**: `| # | Kịch bản | Kết quả | ID |`.
5. Phát hiện mới theo khuôn trên.
6. Mục **Bloat** và mục **Hiệu năng** (bảng số, so mốc sau #656 và lượt 2).
7. Bảng đếm mức × trục; nói rõ nếu tỉ lệ PLAUSIBLE cao.
8. "Đã xét, không thấy" theo từng trục.
9. Phụ lục: nguồn probe / test tạm / đột biến (cái nào bị test giết, cái nào sống), `git status --short` cuối phiên, giờ xong.

**Gói F** thêm **bảng R gộp đủ 39 DR6** (từ báo cáo A–E lượt 3 của chính bạn + phần F) và kết luận **SẴN SÀNG / CHƯA SẴN SÀNG cho v1.0 ở SHA `119e2e4`** kèm lý do.

Xong gói thì làm như mục "Cuối phiên" của Bước 0. Không tổng hợp, không so với bên khác, không tạo Issue, không đề xuất merge.
