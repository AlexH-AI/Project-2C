# Kế hoạch deep review Phase 1–6 (6D)

- **Trạng thái:** lượt 1 — **Owner duyệt 13/10/2026** (Issue #562 T-222, nhãn `gate`), trả lời §12: hai đợt; Muse chạy `--yolo` (§7.1). **Owner đổi 14/10/2026** (ADR-0001 phụ lục M6): Home PC không truy cập được → **làm lại cả lượt 1 trên Office Laptop** `D13_THINKPAD` từ bước chuẩn bị §9; Muse dùng **Muse Spark 1.3** có sẵn trên laptop thay Muse Wonder.
- **Lần chạy bỏ (13–14/10, Home PC):** đợt 1 đã chạy một phần trên Home PC (Claude A–E, Codex A–E, F của cả hai chưa xong). 10 báo cáo đó **không dùng** cho tổng hợp (khác máy với số đo, F không chạy tiếp được); thư mục `C:\workspace\deep-review-1-6\` trên Home PC Owner xóa khi quay lại máy đó, không chép sang.
- **Soạn:** 13/10/2026, bước 0 của lượt 1 (spec `docs/design/phase-6-hoan-thien.md` §6.3). Lượt 2 (T-224 #564) sửa trên cùng file: thêm mục "Lượt 2" và prompt lượt 2, giữ nguyên phần lượt 1.
- **Lượt 2:** soạn 17/10/2026 (T-224 #564) — **Owner duyệt 17/10/2026** (PR #647, nhãn `gate`; https://github.com/AlexH-AI/Project-2C/pull/647#issuecomment-6221359110). **Owner trả lời §L2.11 ngày 17/10/2026** (ADR-0001 phụ lục M7): bỏ Muse, lượt 2 chỉ **Claude và Codex**, chạy **một đợt**; chạy trên máy nào cũng được, số đo so với mốc cùng máy; các câu còn lại theo đề xuất. Toàn bộ ở phần **Lượt 2** cuối file: §L2.1–§L2.11, prompt Phụ lục E, F, H (không có Phụ lục G). Phần lượt 1 (§1–§12, Phụ lục A–D) giữ nguyên, lượt 2 chỉ dẫn tới khi dùng lại.
- **Lượt 3:** Owner thêm 19/10/2026, trước G7 (T-266 #713, ADR-0001 phụ lục M9): **Claude và Codex**, đủ 6 gói như lượt 2, phần Claude chạy bằng **Workflow** (mỗi gói một subagent context sạch, tuần tự A → F), sau tổng hợp sửa hết. Toàn bộ ở phần **Lượt 3** cuối file: §L3.1–§L3.11, script và prompt ở Phụ lục I, J, K. Phần lượt 1, lượt 2 giữ nguyên.
- **Lượt 4:** Owner thêm 26–27/10/2026, trước G7 (T-309 #854, ADR-0001 phụ lục M10): **Claude Opus 5.5, Codex (GPT Sol 6.1) và DeepSeek v4.1 Flash (OpenCode)**, đủ 6 gói như lượt 2–3, phần Claude mỗi gói một phiên sạch như lượt 3. Chỉ chạy khi mọi ghi chú OPEN của sổ đã sửa hết (Owner 27/10). Kiểm các đợt sửa sau lượt 3 (đợt sửa lượt 3, đợt sửa sổ OPEN, T-305…T-308, đợt sửa mục OPEN còn lại) và tìm lỗi mới trên toàn bộ code. Toàn bộ ở phần **Lượt 4** cuối file: §L4.1–§L4.11, prompt ở Phụ lục L, M, N, O, cấu hình OpenCode ở Phụ lục P (không có script Workflow). Phần lượt 1–3 giữ nguyên.
- **Lượt 5:** Owner thêm 04/11/2026, trong G7 (T-357 #1025, ADR-0001 phụ lục M12): ba bên như lượt 4, **Claude Opus 5.5, Codex (GPT Sol 6.1) và DeepSeek V4.1 Flash (app desktop WorkBuddy)**, đủ 6 gói. SHA ghim là `main` lúc bước chuẩn bị; sau tổng hợp sửa hết rồi G7; DeepSeek chỉ dùng credit của gói WorkBuddy Pro. Kiểm đợt sửa lượt 4 và các đợt sau đó (mục sổ [G7], G7) và tìm lỗi mới trên toàn bộ code. Toàn bộ ở phần **Lượt 5** cuối file: §L5.1–§L5.11, prompt ở Phụ lục Q, S, T, U, app WorkBuddy và `dot2.mjs` lượt 5 ở Phụ lục V (không có Phụ lục R). Phần lượt 1–4 giữ nguyên.
- **Lượt 6:** Owner thêm 06–07/11/2026, trước G7 (T-385 #1117, ADR-0001 phụ lục M13): **Claude Opus 5.5, Codex (GPT Sol 6.1) và một agent trong app WorkBuddy** (model Owner chọn), lượt deep review toàn bộ code cuối cùng trước G7. Đổi cách làm (§L6.0): tiêu chí xong chốt trước khi chạy, chỉ Critical / High / Medium và Low ở trục D / S / G chặn phát hành, phần còn lại vào sổ "sau v1.0" (K48, thay "sửa hết"); đóng băng code tới phát hành (K49); bảng R chỉ Claude làm; Claude thêm ba phiên chủ đề G, H, I (gồm "rà gọn"); không ultracode / Workflow, subagent chỉ Sonnet 5.5 / Opus 5.5 mức `xhigh`. **Owner duyệt G1 ngày 07/11/2026** (PR #1118, §L6.11). Toàn bộ ở phần **Lượt 6** cuối file: §L6.0–§L6.11, prompt ở Phụ lục W, X, Y, Z. Phần lượt 1–5 giữ nguyên.
- **Nguồn:** spec Phase 6 §2, §5.1, §6 (G1 #515); khuôn deep review Phase 1–4 (`deep-review-phase-1-4.md`) và Phase 5 (`docs/reviews/raw/2026-10-10/common-*.md`); bài học DeepSeek / Muse (`docs/reviews/2026-10-10-danh-gia-deepseek-muse.md` §6–§7); tổng hợp Phase 5 §9–§10; ADR-0001 phụ lục M2, M4, M5.
- **Owner đổi bên review (13/10, ADR-0001 phụ lục M5):** bỏ DeepSeek v4.1 Flash (chỉ số benchmark trí tuệ không đủ cao cho deep review toàn codebase); Muse dùng model **Muse Wonder** (mới ra, benchmark cao hơn Spark 1.3). Lượt 1 còn **3 bên**: Claude, Codex, Muse → 6 gói × 3 = **18 báo cáo**. **14/10 (M6):** Muse về lại **Muse Spark 1.3** (`muse-spark-1.3-contributor`, Muse Code 1.3.0 trên Office Laptop, như Phase 5).

| Yêu cầu của #562 | Mục |
|---|---|
| 1. SHA ghim, cách dựng worktree / thư mục | §2, §9 |
| 2. 6 gói, phạm vi, cỡ dòng đo lại, thứ tự phiên Claude | §3 |
| 3. Trục, gồm bloat và hiệu năng | §4 |
| 4. Prompt nguyên văn của các bên | Phụ lục A–D |
| 5. KNOWN | §5 |
| 6. Số đo nền, lệnh sinh dữ liệu tải và probe | §6 |
| 7. Cấu hình Muse | §7 |
| 8. Thư mục bằng chứng, kiểm độc lập, lưu báo cáo gốc | §8 |
| 9. Ước lượng, câu hỏi cho Owner | §11, §12 |

## 1. Mục tiêu và phạm vi (lượt 1)

Đọc **toàn bộ code Phase 1–6** ở SHA ghim, trước v1.0. Ba bên review độc lập, chỉ đọc; Claude phiên tổng hợp (T-223 #563) kiểm lại từng phát hiện trên code rồi đề xuất sửa (spec §6.1). Tìm, theo thứ tự ưu tiên:

1. Lỗi đúng-sai và edge case, nhất là **kịch bản nhiều bước qua nhiều gói** (hai lỗi Medium của Phase 5 đều thuộc loại này và chỉ frontier thấy).
2. Mất / sai dữ liệu: lệnh ghi, nhập / xuất backup, thay DB (S-2), Thùng rác, migration, seed, ghi file qua Rust.
3. Guardrail AI và an toàn ở ranh giới (key, mạng, dữ liệu gửi đi, prompt injection, output model, CSP / capabilities, đường dẫn file).
4. **Bloat code** và **hiệu năng** — hai trục bắt buộc ghi riêng ở mọi gói (§4.2); gói F làm cho toàn codebase (spec §2, §6.2).
5. Test yếu, trợ năng / i18n, khớp spec / mockup / nhãn UI theo nghĩa thường.

**Ngoài phạm vi:** thiết kế tính năng mới, đổi mockup / spec đã duyệt, việc đã ra khỏi v1.0 (đồng bộ `Project-2C-data`, S-1, gộp backup / xung đột — spec §4), nội dung `docs/user-guide/` (kiểm ở G7 theo `docs/testing/nghiem-thu-v1.md`), quy trình phát triển (ADR-0001, chỉ Claude viết code).

## 2. SHA ghim, vai trò, chỗ làm

**SHA ghim: `8855345`** (`885534549808f42aec7f9af5743bbf86642ee4bd`, `main` 13/10/2026 sau #581). Mọi Issue 6C đã đóng (#556–#561; #561 đóng 13/10 06:34 UTC). Từ số đo nền `b139d8a` tới đây chỉ thêm `e2e/full-cycle.spec.ts`, `e2e/support.ts` (T-220) và tài liệu: code sản phẩm giống hệt `b139d8a`, nên số đo nền T-219 dùng được nguyên (§6).

Trong suốt lượt 1 **không merge code vào `main`**. PR chỉ đụng `docs/**` (vd. sổ ghi chú review, sửa `nghiem-thu-v1.md`) merge được, không đổi SHA ghim vì reviewer chỉ đọc code ở SHA ghim. Lỡ có code mới trên `main` trước khi chạy: ghim lại, đo lại §3 và chạy lại bước chuẩn bị §9.

| Bên | Ai chạy | Đợt | Làm ở | Thư mục kết quả | ID |
|---|---|---|---|---|---|
| Claude (phiên sạch mỗi gói, tuần tự A → F, không subagent) | Owner mở phiên | 1 | `C:\workspace\Project-2C-review` | `C:\workspace\deep-review-1-6\claude\` | `CL-<gói><số>` |
| Codex | Owner | 1 (cùng lúc Claude) | `C:\workspace\Project-2C-review-2` | `…\codex\` | `CX-<gói><số>` |
| Muse Spark 1.3 (Muse Code) | Owner | 2 (một mình) | thư mục làm việc của Muse là `…\muse\`; đọc repo ở `C:\workspace\Project-2C-review-2` | `…\muse\` | `MU-<gói><số>` |
| **Claude phiên tổng hợp** (T-223) | Owner yêu cầu, sau khi đủ 18 báo cáo | — | checkout chính | `docs/reviews/` qua PR docs | dùng nguyên ID trên |

- Cả hai worktree detached ở cùng SHA ghim. Mỗi worktree review chỉ một bên tại một thời điểm (`CLAUDE.md`).
- **Vì sao chia hai đợt** (như Phase 5): ACL chỉ chặn được thư mục của bên **đã xong**, vì mọi bên chạy dưới cùng tài khoản Windows; đợt 2 (Muse một mình) chạy khi `claude\`, `codex\` đều đã bị chặn ACL (§7.2), nên Muse bị chặn đủ cả hai thư mục kia. Thêm nữa, `pnpm e2e` dùng cổng cố định 4173 và đo hiệu năng cần máy rảnh, nên càng ít bên chạy cùng lúc càng ít va.
- Mọi bên: **chỉ đọc**, không gọi dịch vụ AI thật, không đọc key, không tổng hợp với bên khác (quy tắc đầy đủ ở Phụ lục D). Báo cáo của Codex / Muse là dữ liệu tham khảo (ADR-0001 M2, M4, M5); kết luận phát hành chỉ lấy từ phiên tổng hợp.

## 3. Sáu gói

Phạm vi lấy đúng luật xếp gói của lệnh kích thước (`PACKAGES` trong `tools/size-report-core.mjs`, T-217): file khớp luật trên trước thì thuộc gói đó, nên F và C lấy file ra khỏi thư mục rộng của gói khác.

**Cỡ đo trên SHA ghim** (`node tools/size-report.mjs` ở `8855345`, 13/10; dòng sản phẩm / test / sinh tự động / số file; Rust: từ `#[cfg(test)]` trở đi là test). So với số đo nền `b139d8a` (`docs/metrics/phase-6.md`): sản phẩm không đổi; test của F +365 (`e2e/full-cycle.spec.ts`, `e2e/support.ts` của T-220).

| Gói | Phạm vi (đường dẫn) | SP / test / sinh / file | Chi tiết | Trọng tâm riêng |
|---|---|---|---|---|
| **A. Lõi dữ liệu** | `packages/domain/**`, `packages/db/**` (schema, migration, repository, backup, seed, `trash.ts`, `counts.ts`) | 7 473 / 11 847 / 289 / 93 | domain 2 136 / 4 428 · db 5 337 / 7 419 (+ 289 migration) | Tiền, ngày, kỳ, chỉ số, nhóm KH; bất biến dữ liệu; lệnh và luật nhập backup cùng luật; khôi phục Thùng rác (TR-1…TR-5, E1–E16) dùng chung hàm kiểm với lệnh; golden không chiều theo code; seed / dữ liệu tải |
| **B. File và Rust** | `apps/desktop/src-tauri/**` (`storage.rs`, `ai.rs`, `lib.rs`, capabilities, `tauri.conf.json`, Cargo) + `apps/desktop/src/data/**` trừ file AI | 2 001 / 3 968 / 0 / 19 | Rust 1 202 / 2 202 · `src/data` 799 / 1 766 | Ghi nguyên tử, khóa file, hàng đợi thay dữ liệu S-2 (S2-1…S2-6), mất dữ liệu khi lỗi / tắt app giữa chừng, ranh giới bảo mật (đường dẫn, CSP, capabilities, key không sang webview); `cargo clippy -W clippy::pedantic` một lần |
| **C. AI** | `packages/ai/**` + file AI của app (tên khớp `ai-*`, `*-ai-*`, `*Ai.tsx`, `KycExtraction` / `KycIntelligence` / `KycWebSession` / `KycHistory`, `extraction-view`) ở `src/data`, `routes`, `routes/customers`, `routes/appointments` | 5 129 / 5 985 / 0 / 60 | `packages/ai` 2 086 / 3 242 · app 3 043 / 2 743 | Guardrail G5 (V1–V7, danh sách chặn), validator, thử lại, STALE / CURRENT, ChatGPT web, AI trích xuất không tự lưu, key không sang webview, kết quả AI về trong lúc thay dữ liệu (S2-3) |
| **D. Màn nhập liệu** | `packages/ui/**` (trừ `scripts/`), `apps/desktop/src/{shell,i18n}/**`, `routes/customers/**` (trừ file AI và Hợp đồng), `routes/team/**`, `routes/Screen.tsx`, file gốc `apps/desktop/src/*`, `apps/desktop/index.html` | 6 820 / 1 748 / 0 / 73 | ui 1 499 / 284 · shell 781 / 508 · i18n 1 330 / 141 · customers 2 377 / 656 · team 732 / 129 | Khớp mockup / nhãn, form và lỗi, hộp Xóa KH 5f, trợ năng (focus, bàn phím, `aria-*`), i18n thiếu / thừa / cứng |
| **E. Lịch hẹn, chỉ số, quản lý** | `routes/{appointments,overview,reports}/**`, `routes/{Overview,Settings*,RestoreDialog,FilterBar}.tsx` (trừ `SettingsAi.tsx` → C), `routes/{trash-view,period-labels,applied-filter}.ts`, Hợp đồng (`routes/customers/{CustomerPolicies,PolicyDialogs,policy-form}.*`) | 7 032 / 3 545 / 0 / 51 | appointments 2 964 / 1 100 · overview 983 / 825 · reports 949 / 702 · Settings / Thùng rác / bộ lọc 1 535 / 745 · Hợp đồng 601 / 173 | Đếm / lọc đúng nghĩa nhãn, số khớp giữa các màn và với Excel, kỳ và nửa đêm, Thùng rác (màn, hộp khôi phục 11a–11g), Cài đặt → Dữ liệu |
| **F. Xuyên gói, bloat / hiệu năng, công cụ** | `tools/**`, `e2e/**` (gồm `perf/`, `guide/`), `.github/**`, `.githooks/**`, `.claude/**` (hook), `packages/ui/scripts/`, `apps/desktop/vite.config.ts`, file gốc repo (`package.json`, cấu hình); **luồng xuyên gói; toàn codebase cho bloat và hiệu năng** | 3 761 / 11 263 / 4 628 / 84 | tools 3 279 / 3 135 · e2e 0 / 7 954 · CI / hook 289 / 0 · gốc 193 / 174 (+ 4 628 lockfile) | Code chết / lặp / export thừa toàn repo, dependency, bundle / exe, đo trên dữ liệu tải, test yếu / giả xanh, CI, an toàn của script; đường đi đầu-cuối (nhập liệu → chỉ số → AI → Thùng rác → backup → nạp lại / nhập); hợp đồng giữa `domain` ↔ `db` ↔ `ai` ↔ UI ↔ Rust; kết luận SẴN SÀNG / CHƯA SẴN SÀNG |
| **Tổng** | | 32 216 / 38 356 / 4 917 / 380 | | |

- Cỡ lệch spec §6.2 (B: spec ước 3 100 dòng Rust tính cả test trong file; đo đúng luật thì Rust 1 202 SP + 2 202 test). B nhẹ nhất nên phiên B xét kỹ thêm hợp đồng lệnh Tauri ↔ JS và kịch bản tắt app / lỗi đĩa.
- **Thứ tự phiên Claude: A → B → C → D → E → F.** Lõi dữ liệu trước vì mọi gói khác dựa vào; F cuối vì đọc báo cáo A–E của chính Claude và làm phần xuyên gói. Codex và Muse cũng mỗi gói một phiên mới, tuần tự A → F (§9.1; bước 0 của phần chung kiểm đủ báo cáo các gói trước).
- Đo lại khi cần: `node tools/size-report.mjs` (thêm `--compare docs/metrics/phase-6-baseline/size.json` để có cột Δ).

## 4. Trục

### 4.1 Trục dùng chung

Mỗi gói đi qua **mọi trục**; trục không có gì thì ghi "đã xét, không thấy" **kèm đã chạy / đọc gì** (không kết luận từ spec ở chỗ chạy thử được — bài học Muse F, Phase 5).

- **E — Edge case:** rỗng / 1 / rất lớn; ngày (29/02, 31 → tháng 30 ngày, cuối năm, nửa đêm, múi giờ máy khác); số (0, âm, trần 100 tỷ, làm tròn); chuỗi (dài, Unicode, NFC / NFD, emoji, zero-width, `\`); trùng tên; hai thao tác chồng nhau; Hủy / lỗi / tắt app giữa chừng; tải lại webview, Nạp lại, Nhập backup khi đang có việc chạy.
- **C — Đúng hợp đồng:** code làm đúng spec / doc comment / nhãn UI theo nghĩa thường (`CLAUDE.md`); hai chỗ cùng tính một thứ cho cùng kết quả; khớp mockup đã duyệt từng dòng.
- **D — Dữ liệu:** lệnh và luật nhập backup cùng luật; transaction; không mất / hỏng khi lỗi giữa chừng; khôi phục và xóa mềm giữ bất biến; backup không chứa key.
- **G — Guardrail AI** (chủ yếu gói C, F): V1–V7, danh sách chặn so với G5 từng mục, schema, thử lại, mức bằng chứng, REJECTED, AI không ghi thẳng dữ liệu KYC.
- **S — An toàn ở ranh giới:** nhập backup (file sửa tay, rất lớn, sai kiểu), đường dẫn / tên file Tauri, CSP và `capabilities`, API key (chỉ ở Rust / Credential Manager, không lọt vào webview, DB, backup, log, câu lỗi), gọi mạng (URL cố định, timeout, giới hạn cỡ), dữ liệu gửi đi tối thiểu, prompt injection từ ghi chú KYC và câu dán của ChatGPT web, hiển thị output model, mở URL ngoài, script trong `tools/` (đè dữ liệu, `git`, `$LASTEXITCODE`).
- **P — Hiệu năng** (bắt buộc, §4.2).
- **B — Bloat code** (bắt buộc, §4.2).
- **T — Chất lượng test:** test có đỏ khi code sai (đột biến trên **bản chép** ngoài repo, hoặc patch gỡ ngay — luật chỉ đọc ở Phụ lục D); test chép lại công thức của code; phụ thuộc ngày hệ thống / thứ tự / ngẫu nhiên; e2e giả xanh.
- **A — Trợ năng / i18n:** nhãn, `aria-*`, thứ tự Tab, bẫy focus trong hộp, `role="status"`, tương phản, chuỗi cứng, định dạng số / ngày.

### 4.2 Hai trục bắt buộc ghi riêng: bloat và hiệu năng

Mỗi báo cáo gói có **hai mục riêng** "Bloat" và "Hiệu năng" (kể cả khi không có phát hiện), mỗi mục một bảng: đã chạy / đo gì, trên dữ liệu nào, kết quả (số), phát hiện liên quan (ID). Gói A–E làm trong phạm vi của mình; **gói F làm cho toàn codebase** và tổng hợp số của chính bên đó.

- **Bloat:** export không ai import (`rg` + bản đồ `pnpm codemap` trong `CLAUDE.md` của package); hàm / tham số / prop / khóa i18n / CSS không dùng (`tsc --noUnusedLocals --noUnusedParameters` chạy tạm bằng lệnh, không sửa cấu hình); nhánh không thể xảy ra; abstraction chỉ một nơi dùng; code lặp ≥ 3 nơi (và các mục *Duplicated Code* đã ghi ở sổ — §5); dependency không dùng hoặc nặng hơn việc nó làm; cấu thành bundle (`pnpm build:web`, kích thước từng chunk) và exe. Mỗi đề xuất refactor ghi: cỡ ước lượng, file đụng tới, test nào giữ hành vi (spec §6.3: refactor giữ nguyên hành vi, test cũ xanh trước và sau, không đổi golden).
- **Hiệu năng:** **mọi phát hiện P phải có số đo** (ms / KB / MB / số lần render / số câu SQL), không suy đoán. Đo trên **dữ liệu tải** (§6). So với ngưỡng đã chốt (`docs/metrics/phase-6.md`: thao tác màn < 200 ms, các ngưỡng "Owner chốt 13/10") hoặc với số tham chiếu **cùng máy** (§6); lượt 1 chạy ở Office Laptop, cùng máy với số đo nền T-219, nên so trực tiếp được với số đó. Ghi máy và việc gì đang chạy song song lúc đo. Chỗ cần xem: thuật toán bậc hai trên dữ liệu cỡ N, tính lại trong render, truy vấn thiếu chỉ mục / N+1, đọc cả bảng khi chỉ cần vài dòng (vd. `listTrash` — §5), mở / lưu / nhập / xuất DB, bộ nhớ, bundle nạp sớm.
- **Công cụ:** chỉ thứ đã có trong repo hoặc đi kèm toolchain (`pnpm verify`, `pnpm lint:deps`, `pnpm test:coverage`, `pnpm e2e`, `pnpm verify:rust`, `pnpm codemap`, `tsc`, `cargo clippy`, `cargo tree`, `vite build`, `node tools/size-report.mjs`, `node tools/load-data.mjs`, probe `e2e/perf/`, script `node` tự viết, DevTools / profile V8). **Không cài công cụ mới** (`knip`, `jscpd`, `cargo-bloat`, `rollup-plugin-visualizer`… là G4, spec §6.3); thấy cần thì ghi đề xuất trong báo cáo.

### 4.3 Thước mức

Theo thước đã dùng ở Phase 1–4 / Phase 5 (tổng hợp Phase 5 §10), ghi trong mọi prompt để các bên chấm cùng thước (Codex thổi phồng 11 / 12 Medium ở Phase 5):

- **Critical:** mất dữ liệu đã lưu, hỏng file DB, lộ API key, hoặc chạy được code lạ — ở thao tác bình thường.
- **High:** thao tác bình thường làm dữ liệu sai **lặng lẽ** (lan sang chỉ số / báo cáo / backup mà người dùng không nhận ra) hoặc chặn hẳn một việc chính không có đường vòng.
- **Medium:** thao tác bình thường dẫn tới dữ liệu sai / không đảo ngược được, hoặc chặn việc chính (có đường vòng); thao tác chính vượt ngưỡng hiệu năng đã chốt.
- **Low:** cần điều kiện hiếm (file sửa tay, output suy biến, server bất thường, hai thao tác chồng nhau mà UI không cho), chỉ sai hiển thị, test hở, bloat có chi phí đo được.
- **Nit:** chữ, dọn dẹp, bloat không đo được chi phí.

## 5. KNOWN

`common\known.md` (dựng ở bước chuẩn bị §9) gồm hai phần. Phát hiện trùng một mục gắn `KNOWN`, chỉ nêu khi có **bằng chứng mới** (hậu quả nặng hơn ghi chú, đường vào mới).

1. **Nguyên văn mục OPEN và ACCEPTED** của `docs/state/review-notes.md` ở SHA ghim (mục RESOLVED đã sửa, đọc ở repo khi cần). Gồm các mục mới của Phase 6: `listTrash` đọc cả ba bảng mỗi lần (#539), lệch mockup 11a "nhóm sau N2" (#543), ghi chú probe / `PerformanceMeasure` `p2c:db-save` (#572), các ghi chú *Duplicated Code* (`plain`, hook `resolve` của `tools/`, `newSessionId`…).
2. **Quyết định của Owner còn hiệu lực** (hành vi có chủ ý, không phải lỗi):

| # | Quyết định | Nguồn |
|---|---|---|
| K1 | Dữ liệu là giả lập: siết luật thì áp ở lệnh + nhập backup, Owner nạp lại; không migration / cảnh báo / UI cho dữ liệu cũ sai. Schema AI đổi thì nạp lại; `db` chỉ import module schema của `@p2c/ai` | R2-02, #402, `CLAUDE.md` |
| K2 | HĐ / cuộc gặp Đã gặp mang ngày hoặc nhóm trước ngày tạo KH là nhập bù hợp lệ | DR-43 (ACCEPTED) |
| K3 | Trần 100 tỷ đồng mỗi số tiền (lệnh + nhập backup); ô tiền nhận "VNĐ", "1tr5", "1 tỷ 2", nhóm nghìn bằng dấu cách | Owner 06/10 |
| K4 | Bảng lớn dùng "Hiện thêm" (100 dòng), không ảo hóa | DR-03, Owner 06/10 |
| K5 | Người phối hợp chỉ TL / IS / BD / BDM; người đánh giá chỉ IS / TL / BDM / BD | ADR-0007, DR-47, D9 |
| K6 | "Lịch hẹn lần n" chỉ đánh số lịch đã gặp; lịch Dời lịch không có nút xóa | DR-67, #171 |
| K7 | Một yêu cầu AI tại một thời điểm; Hủy giữ khóa tới khi Rust xong (≤ 120 s); lỗi key / mạng không tự chuyển Mock | spec Phase 5 §5.2, D-1 |
| K8 | Key chỉ ở Credential Manager, kiểu lưu `Local`; Rust chặn cả dạng escape JSON / URL-encode của key | DR5-25, R2-10 |
| K9 | Gói Go hết hạn: Owner gia hạn, không xử lý / không mã HTTP riêng; rủi ro chính sách gói Go đã chấp nhận | #408, ADR-0009 W-1 mục 7 |
| K10 | Xác nhận lại cùng giá trị giữ phân tích CURRENT, panel ánh xạ mã F cũ; "Nạp lại" giữ Cài đặt → AI; phiên ChatGPT web chờ dán thì nút AI trích xuất của KH đó tắt; nút AI tắt vì bận nơi khác có dòng giải thích | Owner 10/10 (tổng hợp Phase 5 §8) |
| K11 | G5: chặn loại sản phẩm bảo hiểm; không chặn tên ngân hàng / quỹ / mã chứng khoán; nhãn tính cách cho phép trong `personalityNotes`. Không thêm đợt G5 cho chất lượng output E16 / E17 (không vi phạm) | G5 07/10, eval 11/10 |
| K12 | Ra khỏi v1.0: `Project-2C-data`, S-1 (`kyc_versions.hash` khi nhập snapshot — dòng OPEN), gộp backup / xung đột; làm trên hai máy là "bản nhập sau thắng", không cảnh báo khi nhập | spec §4, Owner 11/10 |
| K13 | S-2: khóa mọi lệnh ghi trong lúc thay dữ liệu; xuất không vào hàng đợi; đóng app không chờ (S2-1…S2-6) | spec §4.1 (G2) |
| K14 | Thùng rác: không khôi phục dây chuyền, không xóa vĩnh viễn / tự dọn, không theo góc nhìn, luôn hỏi trước khi khôi phục (TR-1…TR-10) | spec §4.2 (G2 / G3) |
| K15 | Mở app lần đầu ≈ 3–4 s (gần hết là sinh seed demo, drizzle dựng câu SQL) là chấp nhận; ngưỡng là "không chậm hơn exe Phase 4 đo cùng cách, cùng máy"; không tối ưu seed ở v1.0 | #574, `phase-6.md` |
| K16 | Hướng dẫn sử dụng là Markdown + PNG trong repo, không có nút trong app, không PDF / HTML | spec §4.3 |
| K17 | Không phải phát hiện: PR vượt ngưỡng kích thước (ghi ở `docs/metrics/`), cách làm "chỉ Claude, không subagent" (ADR-0001), việc dùng công cụ mới (G4) | ADR-0001, spec §6.3 |

## 6. Số đo nền và dữ liệu tải

- **Số đo nền:** `docs/metrics/phase-6.md` mục "Số đo nền" (T-219, Office Laptop `D13_THINKPAD`, code `b139d8a` = code của SHA ghim) với ngưỡng Owner chốt 13/10; JSON `docs/metrics/phase-6-baseline/perf.json` (probe) và `size.json` (kích thước). Mở lần đầu: mục "Mở app lần đầu, đo lại" (T-227, Home PC).
- **Dữ liệu tải:** `node tools/load-data.mjs` (mốc mặc định `2026-10-12`, seed `6`) → 1 496 KH, 10 414 lịch hẹn, 54 nhân sự, 103 `ai_analyses`, có bản ghi trong Thùng rác; `tables` sha256 `1e69a97f664708d91932a1158c3a9ddd4e4d4aebb689f9c912ac3c4d0962e3fd`. Bước chuẩn bị sinh sẵn một bản ở `common\load\load-2026-10-12-seed6.p2cbackup` và kiểm hash. Dùng trong Node: `importBackup` của `@p2c/db` (xem `tools/load-data-core.mjs`); dùng trong app: Cài đặt → Dữ liệu → Nhập backup.
- **Probe hiệu năng trên exe:** `e2e/perf/README.md` (T-218): exe release mở với cổng debug WebView2, nhập dữ liệu tải, `pnpm exec playwright test -c playwright.perf.config.ts` với `PERF_BACKUP`, `PERF_OUT`, `PERF_BASE`, `PERF_CDP`. Kích thước: `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json`.
- **Số tham chiếu cùng máy:** bước chuẩn bị chạy probe một lần trên máy chạy lượt 1 ở SHA ghim (máy rảnh) → `common\perf\perf-ref.json`, kèm exe release ở `common\exe\project2c.exe`. Reviewer so số mình đo với file này (hoặc với chính số mình đo trước / sau một thay đổi trên bản chép). Lượt 1 chạy ở **Office Laptop** (Owner đổi 14/10, M6), cùng máy với số đo nền T-219, nên so được với cả `perf-ref.json` lẫn `docs/metrics/phase-6-baseline/perf.json`; `perf-ref.json` là số đo cùng lúc, cùng exe với lượt này nên ưu tiên. Mở app lần đầu: số tham chiếu Phase 4 ở `phase-6.md` đo trên Home PC, không so trực tiếp (lượt 2 đo lại exe Phase 4 ở laptop nếu cần). Lượt 2 cũng chạy ở Office Laptop và so với `perf-ref.json` này (`PERF_BASE`).
- **Reviewer không bắt buộc chạy lại probe.** Muốn đo trên exe thì chép `common\exe\project2c.exe` vào thư mục kết quả của mình (exe ghi `Project2C-data\` cạnh nó), dùng cổng debug khác 9222 (`WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS`, `PERF_CDP`) và `PERF_OUT` trong thư mục của mình. Probe cần cửa sổ exe ở trên cùng nên **không chạy khi bên khác đang đo**; ghi giờ đo.
- **Bảng hàm thuần trong Node của Phase 4** (`importBackup`, `listAppointments`, `teamCompare` / `reportRows`, `monthGrid`, `countRecords` — `phase-6.md` cuối mục thời gian): **gói F đo lại** trên dữ liệu tải (cả hàm mới: `listTrash`, phần AI của hồ sơ KH), ghi máy; không so với số Phase 4 (khác máy, probe cũ ngoài repo), chỉ so ngưỡng Nhóm C và giữa các hàm.
- **Kết quả cổng ở SHA ghim** (bước chuẩn bị ghi vào `common\baseline.md`, reviewer không phải chạy lại toàn bộ): `pnpm verify` (số file / test, `lint:deps`), coverage theo vùng, `pnpm verify:rust` (số test Rust), `pnpm e2e` (`CI=1`), `pnpm build:web` (chunk), `pnpm build:exe` (cỡ exe).

## 7. Cấu hình Muse

### 7.1 Muse Spark 1.3 (Muse Code) — chạy không hỏi (`--yolo`)

Phase 5 tốn 45 lần Owner duyệt tay (gói A 32 lần): Muse hỏi quyền đọc / chạy lệnh liên tục, rất mất công theo dõi. **Owner chọn 13/10: Muse chạy `--yolo`** (tắt hỏi duyệt và sandbox, tin workspace cho lần chạy đó). Muse Code trên **Office Laptop** `D13_THINKPAD` — máy chạy lượt 1 (kiểm 14/10): `1.3.0 (1.3.0-R3401.1)`, có cờ `--yolo`, `--model`, `--reasoning-effort`. Bước chuẩn bị (§9 bước 1) kiểm lại phiên bản Muse và `settings.json` ngay trước khi chạy.

Tắt sandbox thì Muse đọc / ghi / chạy được mọi thứ tài khoản Windows của Owner làm được. Các lớp chặn còn lại:

| Rủi ro | Chặn bằng |
|---|---|
| Đọc báo cáo của Claude / Codex | **ACL** (§7.2) — do Windows áp, không phụ thuộc sandbox của Muse; phiên thử bước 4.1 kiểm. Owner là chủ thư mục nên lệnh `icacls … /remove:d` / `takeown` (chạy dưới tài khoản Owner, không sandbox) gỡ được ACL: prompt cấm (Phụ lục C luật 1), quét log (§8) bắt `icacls`, `takeown`, và Owner kiểm ACL còn sau mỗi gói (§7.2) |
| Ghi / sửa file trong repo, `git checkout` / `reset` / `commit` | Prompt (Phụ lục C luật 3); `git status --short` của `Project-2C-review-2` đầu / cuối mỗi gói (báo cáo ghi, Owner xem nhanh); quét log (§8). Worktree review chỉ để đọc, lỡ bẩn thì dọn được (`git status` → báo Claude), không mất gì |
| Gọi dịch vụ AI thật / mạng (`eval:ai`, chatgpt.com) | Prompt (Phụ lục D luật 2); quét log (§8) |
| `git push`, `gh` | Prompt; `main` có ruleset + hook `pre-push`; quét log (§8) |

1. **Model:** `muse-spark-1.3-contributor`, mức suy luận `max` (Owner chọn 14/10, ADR-0001 M6; cùng model và mức với Phase 5). `~/.config/muse/settings.json` trên Office Laptop đã đặt `"model": "muse-spark-1.3-contributor"`, `"reasoning_effort": "max"`, `default_profile: ":unrestricted"` (kiểm 14/10). `default_profile` để nguyên: `--yolo` đè lên hồ sơ quyền.
2. **Thư mục làm việc = `C:\workspace\deep-review-1-6\muse\`**: báo cáo, probe, bản chép để đột biến ghi ở đây. Repo `C:\workspace\Project-2C-review-2` nằm ngoài, **chỉ đọc theo prompt**.
3. Chạy (mỗi gói một phiên mới, thoát rồi chạy lại):

   ```powershell
   cd C:\workspace\deep-review-1-6\muse; muse --yolo --model muse-spark-1.3-contributor --reasoning-effort max
   ```

   HUD phải hiện model `muse-spark-1.3-contributor` và mức `max`. Giữ cùng mức cho cả 6 gói.
4. **Phiên thử trước gói A** (sau khi đặt ACL §7.2; bỏ đi sau khi thử, mở phiên mới cho gói A). Gõ lần lượt:
   1. "Liệt kê `C:\workspace\deep-review-1-6\codex`" và "… `\claude`" → `Access is denied`. Liệt kê được → **dừng**, ACL chưa đặt đúng.
   2. "Chạy `pnpm vitest run packages/domain` với thư mục làm việc `C:\workspace\Project-2C-review-2`" → chạy không hỏi; ghi lại số test. Muse thường cần `git -c safe.directory=…` và `TEMP` / `TMP` trỏ vào thư mục của nó (Phase 5).
   3. `git -C C:\workspace\Project-2C-review-2 status --short` phải như đầu phiên (chỉ thư mục build / cache bị ignore được đổi).
5. Sau **mỗi gói**: Owner xem dòng `git status --short` cuối phiên trong báo cáo (hoặc tự chạy lệnh ở bước 4.3) và chạy lại lệnh kiểm ACL (§7.2). Khác đầu phiên → báo Claude trước khi mở gói sau; không tự xóa.
6. Contributor mode bật → Muse báo nội dung có thể được dùng để cải tiến sản phẩm: repo public, dữ liệu giả lập — chấp nhận như Phase 5 (ADR-0001 M4).

### 7.2 ACL cho đợt 2

Trước khi mở phiên Muse đầu tiên (kể cả phiên thử), sau khi Claude và Codex đã nộp đủ F (Owner chạy trong PowerShell):

```powershell
icacls C:\workspace\deep-review-1-6\claude /deny "${env:USERNAME}:(OI)(CI)(R)"
```

```powershell
icacls C:\workspace\deep-review-1-6\codex /deny "${env:USERNAME}:(OI)(CI)(R)"
```

Kiểm: `Get-ChildItem C:\workspace\deep-review-1-6\codex` báo `Access is denied`. Chạy lại lệnh kiểm này (cả với `claude`) **sau mỗi gói Muse**, cùng lúc xem `git status` (§7.1 bước 5): liệt kê được → ACL đã bị gỡ, báo Claude trước khi mở gói sau; báo cáo gói đó đánh dấu "nhiễm". Gỡ sau khi Muse nộp F (chủ thư mục luôn gỡ được):

```powershell
icacls C:\workspace\deep-review-1-6\claude /remove:d "${env:USERNAME}"
```

```powershell
icacls C:\workspace\deep-review-1-6\codex /remove:d "${env:USERNAME}"
```

Đợt 2 chỉ có Muse nên ACL chặn đủ cả hai thư mục của bên khác; kiểm log ở §8 là lớp thứ hai.

## 8. Bằng chứng, kiểm độc lập, lưu báo cáo

**Thư mục bằng chứng ngoài repo** (máy chạy lượt 1): `C:\workspace\deep-review-1-6\`

```
common\    plan.md (bản đã duyệt của file này), known.md, baseline.md, prompt-{claude,codex,muse}.md,
           load\ (dữ liệu tải), exe\ (exe release ở SHA ghim), perf\ (tham chiếu cùng máy)
claude\    A.md … F.md + A\ … F\ (probe, bản chép đột biến, log)
codex\     như trên
muse\      như trên + <gói>\session.json (xuất ở phiên tổng hợp)
```

Lượt 2 dùng `C:\workspace\deep-review-1-6-r2\` cùng cấu trúc (T-224).

**Kiểm độc lập bằng log phiên** (phiên tổng hợp làm cho **cả ba bên**, Phase 5 mới làm cho hai bên): xuất / tìm log phiên bằng CLI local (không gọi model):

| Bên | Log |
|---|---|
| Claude | transcript Claude Code của worktree review (`%USERPROFILE%\.claude*\projects\C--workspace-Project-2C-review\*.jsonl`) |
| Codex | log phiên Codex của Owner (thư mục `sessions` của Codex; Owner chỉ chỗ nếu khác) |
| Muse | `muse export` (phiên của từng gói) → `muse\<gói>\session.json` |

Một script `node` của phiên tổng hợp quét **đầu vào lệnh công cụ** (không quét chữ prompt, vốn có tên các thư mục cấm) tìm: đường dẫn `deep-review-1-6[\\/](claude|codex|muse)` của bên khác, liệt kê `C:\workspace` / `deep-review-1-6`, lệnh ghi vào worktree review (`git commit` / `checkout` / `reset`, tạo / sửa file trong repo), `git push`, `gh`, lệnh đổi quyền thư mục (`icacls`, `takeown`, `Set-Acl`), lệnh gọi AI của sản phẩm (`eval:ai`, `cmdkey`, chatgpt.com). Muse chạy `--yolo` (§7.1) nên với Muse đây là lớp kiểm chính cho các lệnh ghi. Có kết quả → báo cáo gói đó đánh dấu "nhiễm" hoặc "vi phạm chỉ đọc", phiên tổng hợp xét riêng. Thêm: `git status --short` của hai worktree đầu / cuối mỗi gói (mỗi báo cáo ghi); khác rỗng (ngoài file Codex tự sinh như `AGENTS.md`, `.codex/`, `.agents/` ở `Project-2C-review-2`) → báo, không tự xóa.

**Báo cáo gốc lưu ở repo** (phiên tổng hợp T-223, PR docs): `docs/reviews/raw/<ngày tổng hợp>/{claude,codex,muse}/<gói>.md` nguyên văn, cùng `common-plan.md` (chỉ khi khác bản trong repo), `common-known.md`, `common-baseline.md`; tổng hợp ở `docs/reviews/<ngày>-deep-review-phase-1-6-luot-1-tong-hop.md`. Không chép `session.json`, exe, dữ liệu tải (lớn, có đường dẫn máy): giữ ở máy chạy lượt 1 tới khi phát hành v1.0, rồi Owner xóa. Nguồn probe / đột biến nằm trong phụ lục báo cáo nên không mất.

## 9. Chuẩn bị và chạy

**Bước chuẩn bị — Claude, sau khi Owner duyệt kế hoạch** (một phiên; không review, không ghi phát hiện):

1. Chạy trên **Office Laptop** `D13_THINKPAD` (Owner đổi 14/10, M6). Kiểm `main` chưa có code mới: `git diff --name-only 8855345 origin/main` chỉ có `docs/**` và `CLAUDE.md` gốc (tài liệu, không có khối codemap). Có file khác → dừng, báo Owner (§2). Kiểm Muse ở máy này (§7.1): `muse --version`, `~/.config/muse/settings.json` có model `muse-spark-1.3-contributor`; khác thì báo Owner. Máy không có quyền admin: không cần cho bước nào ở đây (ACL §7.2 đặt trên thư mục của chính Owner). Thư mục `C:\workspace\deep-review-1-6\` chưa có trên laptop (kiểm 14/10); có rồi thì dừng, báo Owner.
2. Tạo `C:\workspace\deep-review-1-6\{common,claude,codex,muse}`.
3. Hai worktree về SHA ghim: `git -C C:\workspace\Project-2C-review checkout --detach 8855345` (tương tự `-review-2`), `pnpm install --frozen-lockfile` ở mỗi worktree (PowerShell); `git status --short` rỗng.
4. Chép vào `common\`: `plan.md` (file này, bản đã merge), `known.md` (§5: OPEN + ACCEPTED nguyên văn ở SHA ghim + bảng K1–K17), `prompt-<bên>.md` (Phụ lục A / B / C, mỗi file nối thêm nguyên văn Phụ lục D).
5. Dữ liệu tải: `node tools/load-data.mjs --out C:\workspace\deep-review-1-6\common\load\load-2026-10-12-seed6.p2cbackup`; hash `tables` phải bằng §6.
6. Cổng ở SHA ghim (trong `Project-2C-review`): `pnpm verify`, `pnpm verify:rust`, `pnpm e2e` (`CI=1`), `pnpm build:exe`, `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` → `common\baseline.md`; chép exe vào `common\exe\`.
7. Probe tham chiếu cùng máy (cần Owner: nhập dữ liệu tải trong exe theo `e2e/perf/README.md` bước 3, rồi không dùng máy ≈ 5 phút) → `common\perf\perf-ref.json`, bảng vào `baseline.md`.
8. Báo Owner: sẵn sàng đợt 1.

**Owner chạy:**

| Bước | Việc |
|---|---|
| Đợt 1 | Claude: 6 phiên mới ở `C:\workspace\Project-2C-review`, lần lượt A → F. Cùng lúc: Codex ở `C:\workspace\Project-2C-review-2`, cũng 6 phiên mới, lần lượt A → F. Tin nhắn mở phiên ở §9.1. |
| Giữa hai đợt | ACL (§7.2); cấu hình Muse + phiên thử (§7.1). |
| Đợt 2 | Muse Spark 1.3: 6 phiên mới (§7.1 bước 3), lần lượt A → F, tin nhắn mở phiên ở §9.1. Owner ghi giờ bắt đầu / xong mỗi gói (để so thời gian). |
| Sau đợt 2 | Gỡ ACL; trả `~/.config/muse/settings.json` về bản sao lưu nếu muốn. Gõ yêu cầu tổng hợp (T-223). |

Không phiên nào tự tổng hợp, kể cả khi một bên xong sớm.

### 9.1 Tin nhắn mở phiên — chỉ đổi một chữ

Mỗi bên có **một** tin nhắn cố định; mỗi gói mở **phiên mới** và dán tin nhắn đó, chỉ đổi chữ `A` thành `B`, `C`, `D`, `E`, `F`. Mọi khác biệt giữa các gói (phạm vi, trọng tâm, gói F đọc báo cáo A–E và ra kết luận) nằm sẵn trong file prompt.

Claude — phiên mới ở `C:\workspace\Project-2C-review`:

```text
Gói A. Đọc và làm đúng C:\workspace\deep-review-1-6\common\prompt-claude.md
```

Codex — phiên mới ở `C:\workspace\Project-2C-review-2`:

```text
Gói A. Đọc và làm đúng C:\workspace\deep-review-1-6\common\prompt-codex.md
```

Muse Spark 1.3 — phiên mới theo §7.1 bước 3:

```text
Gói A. Đọc và làm đúng C:\workspace\deep-review-1-6\common\prompt-muse.md
```

**Chống sót / nhầm** (bước 0 của phần chung, Phụ lục D): đầu phiên, bên review tự kiểm chữ gói là đúng một chữ A–F, báo cáo gói đó chưa có (hoặc còn `ĐANG LÀM` thì làm tiếp), và báo cáo các gói trước trong thư mục của mình đã có đủ, không gói nào còn dở; sai một điều thì dừng và báo Owner trước khi đọc code. Báo cáo được **ghi dần** từ đầu phiên, dòng đầu `ĐANG LÀM` tới khi xong (thêm 13/10 sau khi phiên Claude gói A bị đóng giữa chừng và mất cả báo cáo). Cuối phiên, bên review in một dòng `XONG gói <X> → <file>. Gói kế tiếp: <Y>` (gói F: `XONG cả 6 gói`), nên Owner chỉ cần làm theo dòng đó.

**Chỉ coi một gói là xong khi thấy dòng `XONG gói …`.** Phiên đứng yên lâu thường là đang chờ lệnh chạy nền (fuzzer, test): không đóng / `/clear`; nghi thì hỏi "tiến độ?". Lỡ đóng thì mở phiên mới và dán lại **cùng chữ gói**: bước 0 thấy `ĐANG LÀM` và làm tiếp.

Bảng đánh dấu của Owner (18 ô):

| Bên | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| Claude | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Codex | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Muse Spark 1.3 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

## 10. Định dạng phát hiện và báo cáo

```
ID: <bên>-<gói><số>   (CL | CX | MU; ví dụ CL-A12, CX-B03, MU-E7)
Mức: Critical | High | Medium | Low | Nit   (thước §4.3)
Trục: E | C | D | G | S | P | B | T | A
Vị trí: path:dòng (8855345)
Tình trạng: CONFIRMED (đã tái hiện / có số đo, dán lệnh + kết quả thật) | PLAUSIBLE (đọc code, chưa tái hiện — nói đã đọc gì) | KNOWN (mục trong known.md, kèm bằng chứng mới)
Mô tả: một-hai câu
Tái hiện / bằng chứng: lệnh + kết quả, hoặc probe / test tạm (nguồn ở phụ lục)
Ảnh hưởng: ai / khi nào gặp
Đề xuất: hướng sửa ngắn; cỡ ước lượng (≤ 400 dòng SP?); với refactor bloat: test nào giữ hành vi
```

Mỗi báo cáo gói (`<bên>\<gói>.md`, tiếng Việt):

1. Đầu: bên, gói, SHA (`git rev-parse HEAD` đầu phiên), `git status --short` đầu phiên, giờ bắt đầu.
2. **Phạm vi đã đọc** (file, dòng), kể cả chỗ code gói khác mà gói nối vào.
3. **Phát hiện** theo khuôn trên.
4. **Bloat** và **Hiệu năng** — hai mục riêng (§4.2), mỗi mục một bảng số.
5. Bảng đếm mức × trục; tỉ lệ PLAUSIBLE nếu cao thì nói rõ.
6. **Đã xét, không thấy** theo từng trục, kèm đã chạy / đọc gì.
7. Phụ lục: nguồn probe / test tạm / đột biến (đột biến nào bị test giết, nào sống); `git status --short` cuối phiên; giờ xong.
8. Gói F thêm: kết luận **SẴN SÀNG / CHƯA SẴN SÀNG cho v1.0 ở SHA ghim** của bên đó, kèm lý do (tham khảo; kết luận thật ở phiên tổng hợp).

Không đặt chỉ tiêu số lượng phát hiện; không nâng mức cho nổi; không bình luận phong cách / đặt tên trừ khi gây lỗi.

## 11. Sau lượt 1 và ước lượng

**Sau lượt 1 (T-223 #563, khi Owner yêu cầu):** phiên tổng hợp đọc đủ 18 báo cáo, kiểm **mọi** phát hiện trên code ở SHA ghim (đúng / KNOWN / sai / lệch mức), gộp trùng, ghi bên nào thấy; phần bloat / hiệu năng: số đo, phát hiện, đề xuất refactor; kiểm độc lập (§8); đề xuất nhóm sửa (Issue ≤ ~400 dòng SP, phát hiện P kèm số **trước** và ngưỡng **sau**) và câu hỏi cho Owner. Owner chọn → sửa (Issue thường, review phiên sạch). Lượt 2 (T-224) chạy trên SHA sau đợt sửa, cũng ở Office Laptop, so hiệu năng với `common\perf\perf-ref.json` của lượt 1 (`PERF_BASE`, cùng máy) và kích thước với `size-report --compare`.

**Ước lượng lượt 1** (spec §6.4; Phase 5: mỗi bên ≈ 2–3 giờ cho phạm vi ≈ 13 000 dòng; lượt này ≈ 32 000 dòng SP + 38 000 dòng test):

| Bên | Thời gian (đồng hồ) | Chi phí | Owner can thiệp |
|---|---|---|---|
| Claude | 1 phiên chuẩn bị + 6 phiên × ≈ 35–50 phút ≈ 4–5 giờ | gói Claude của Owner | mở 7 phiên; ≈ 5 phút rảnh máy cho probe |
| Codex | ≈ 3–4 giờ (song song Claude) | gói Codex của Owner | mở 6 phiên |
| Muse Spark 1.3 | ≈ 3–4 giờ (Phase 5, cùng model; laptop yếu hơn Home PC nên có thể lâu hơn) | theo hạn mức Muse của Owner, contributor mode bật (HUD hiện cost / quota) | mở 6 phiên + phiên thử; không duyệt tay (`--yolo`; Phase 5: 45 lần); xem `git status` cuối mỗi gói |
| Tổng hợp (T-223) | 1–2 phiên Claude | — | yêu cầu tổng hợp, chọn việc sửa |

Đợt 1 ≈ nửa ngày, đợt 2 ≈ nửa ngày; cả lượt 1 ≈ 1–1,5 ngày làm việc của Owner tính cả tổng hợp.

## 12. Câu hỏi cho Owner

Mỗi câu có đề xuất; Owner duyệt kế hoạch mà không nói gì khác thì lấy đề xuất.

**Owner trả lời 13/10:** câu 1 — hai đợt; câu 2 — **Home PC** (khác đề xuất; §6, §7.1, §9, §11 đã sửa theo); câu 3 — Muse chạy **`--yolo`** (khác đề xuất; §7.1, Phụ lục C đã sửa theo).

**Owner đổi 14/10 (ADR-0001 phụ lục M6):** Home PC không truy cập được → câu 2 thành **Office Laptop** (như đề xuất ban đầu), **làm lại cả lượt 1** từ bước chuẩn bị §9, bỏ 10 báo cáo đã chạy trên Home PC; Muse dùng **Muse Spark 1.3** có sẵn trên laptop thay Muse Wonder. §2, §4.2, §6, §7.1, §9, §11, Phụ lục C, D đã sửa theo.

1. **Hai đợt** (Claude + Codex trước, Muse sau, như Phase 5) hay cả ba cùng lúc (nhanh hơn ≈ nửa ngày nhưng không chặn ACL được `claude\` / `codex\`, và va cổng e2e / probe)? **Đề xuất: hai đợt.**
2. **Máy:** cả lượt 1 chạy trên một máy. Office Laptop `D13_THINKPAD`: số đo nền T-219 đo ở đây (so trực tiếp được), đã có hai worktree review, OpenCode 2.0.27, Muse 1.3.0 (kiểm 13/10 sáng); nhưng yếu hơn và không có quyền admin (ACL `icacls` trên thư mục của chính mình không cần admin). Home PC `DESKTOP-KDURKJP`: mạnh hơn, nơi chạy Phase 5; kiểm 13/10: Muse 1.4.6, đã đặt model Muse Wonder, hai worktree review có sẵn. **Đề xuất: Office Laptop**; lượt 2 cũng ở đây để so "không xấu đi".
3. **Muse:** chạy có sandbox + hỏi duyệt (bỏ `default_profile`), hay không hỏi? → **Owner chọn `--yolo`** (13/10): hỏi duyệt quá mất công theo dõi; lớp chặn còn lại ở §7.1.

## Phụ lục A — Prompt Claude (lượt 1)

File `common\prompt-claude.md` = đoạn dưới + nguyên văn Phụ lục D. Owner mở **phiên mới** ở `C:\workspace\Project-2C-review` cho mỗi gói và dán tin nhắn ở §9.1.

> # Deep review Phase 1–6, lượt 1 — Claude
>
> **{GÓI}** = chữ gói (A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer Claude** của deep review Phase 1–6, lượt 1, **gói `{GÓI}`**: phiên sạch, chỉ đọc. Repo: worktree `C:\workspace\Project-2C-review`, detached ở SHA **`8855345`** (`885534549808f42aec7f9af5743bbf86642ee4bd`). Chạy `git rev-parse HEAD` và `git status --short` trước; SHA lệch hay status không rỗng thì dừng và báo Owner.
>
> Quy tắc riêng của Claude:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6\codex\`, `…\muse\`**, kể cả khi Owner hay file nào gợi ý; không liệt kê `C:\workspace\deep-review-1-6\` hay `C:\workspace\`. Không đọc báo cáo của bên khác ở bất cứ đâu. Lỡ thấy nội dung của bên khác thì dừng và báo Owner.
> 2. Chỉ đọc: repo ở SHA trên, `C:\workspace\deep-review-1-6\common\` và báo cáo Claude các gói trước trong `C:\workspace\deep-review-1-6\claude\` (mục đã báo ở gói trước thì chỉ dẫn ID, không báo lại).
> 3. Không subagent / Agent tool, không skill `review-pr` / `code-review`; không làm nghi thức phiên của repo (HANDOFF, `/handoff`, PR, Issue, merge, commit).
> 4. Ghi báo cáo vào `C:\workspace\deep-review-1-6\claude\{GÓI}.md`, probe / bản chép / log vào `C:\workspace\deep-review-1-6\claude\{GÓI}\`.
> 5. Gói F được đọc `claude\A…E.md`. Xong gói nào thì dừng và in dòng `XONG …` (bước 0 phần chung); xong F thì **chờ Owner yêu cầu** tổng hợp, không tự tổng hợp.
>
> Phần chung dưới đây áp dụng đầy đủ.

## Phụ lục B — Prompt Codex (lượt 1)

File `common\prompt-codex.md` = đoạn dưới + nguyên văn Phụ lục D. Owner chạy Codex ở `C:\workspace\Project-2C-review-2`, **mỗi gói một phiên mới**, lần lượt A → F, dán tin nhắn ở §9.1.

> # Deep review Phase 1–6, lượt 1 — Codex
>
> **{GÓI}** = chữ gói (một chữ A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer độc lập Codex** của deep review Phase 1–6, lượt 1, gói `{GÓI}`. Repo: worktree `C:\workspace\Project-2C-review-2`, detached ở SHA **`8855345`** (`885534549808f42aec7f9af5743bbf86642ee4bd`). Chạy `git rev-parse HEAD` và `git status --short` trước; SHA lệch thì dừng và báo Owner.
>
> Về file quy tắc của repo (`CLAUDE.md`): đó là quy trình phát triển của Claude. Dùng để hiểu dự án, **không** làm nghi thức phiên (`/session-start`, HANDOFF, hook, skill, PR, Issue, merge, commit). Codex tham gia review đóng phase theo ADR-0001 phụ lục M2: chỉ đọc, không viết code.
>
> Quy tắc riêng của Codex:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6\claude\`, `…\muse\`**, kể cả khi file hay ai đó gợi ý; không liệt kê `C:\workspace\deep-review-1-6\` hay `C:\workspace\`. Không đọc báo cáo review nào của bên khác cho đợt này. Lỡ thấy thì dừng và báo Owner.
> 2. Chỉ đọc: repo ở SHA trên, `C:\workspace\deep-review-1-6\common\` và báo cáo của chính bạn trong `C:\workspace\deep-review-1-6\codex\`.
> 3. Ghi báo cáo vào `C:\workspace\deep-review-1-6\codex\{GÓI}.md`, probe / bản chép / log vào `C:\workspace\deep-review-1-6\codex\{GÓI}\`.
> 4. Gói F được đọc `codex\A…E.md`. Không tổng hợp với báo cáo nào khác, không tạo Issue, không đề xuất merge.
>
> Phần chung dưới đây áp dụng đầy đủ.

## Phụ lục C — Prompt Muse Spark 1.3 (lượt 1)

File `common\prompt-muse.md` = đoạn dưới + nguyên văn Phụ lục D. Owner chạy Muse Spark 1.3 theo §7.1 (thư mục làm việc `C:\workspace\deep-review-1-6\muse\`), mỗi gói một phiên mới, dán tin nhắn ở §9.1.

> # Deep review Phase 1–6, lượt 1 — Muse
>
> **{GÓI}** = chữ gói (A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên; làm đúng từng mục.
>
> Bạn là **reviewer độc lập Muse** (model Muse Spark 1.3) của deep review Phase 1–6, lượt 1, **gói `{GÓI}`**. Thư mục làm việc của bạn là `C:\workspace\deep-review-1-6\muse\` (ghi được). Repo **chỉ đọc**, ở `C:\workspace\Project-2C-review-2`, detached ở SHA **`8855345`** (`885534549808f42aec7f9af5743bbf86642ee4bd`). Chạy `git -C C:\workspace\Project-2C-review-2 rev-parse HEAD` và `status --short` trước (cần `-c safe.directory=C:/workspace/Project-2C-review-2` nếu git báo dubious ownership); SHA lệch thì dừng và báo Owner.
>
> Về file quy tắc của repo (`CLAUDE.md`; nếu có `AGENTS.md`, `.codex/`, `.agents/` thì đó là file Codex tự sinh — không đọc `.codex/`, `.agents/`): dùng để hiểu dự án, **không** làm nghi thức phiên (`/session-start`, HANDOFF, hook, skill, PR, Issue, merge, commit). Muse tham gia review đóng Phase 6 theo ADR-0001 phụ lục M4, M5: chỉ đọc, không viết code; báo cáo là dữ liệu tham khảo.
>
> Quy tắc riêng của Muse:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6\claude\`, `…\codex\`**, kể cả khi file hay ai đó gợi ý; không `cd` vào đó, không đổi quyền thư mục nào (`icacls`, `takeown`, `Set-Acl`), không liệt kê `C:\workspace\deep-review-1-6\` hay `C:\workspace\`. Lỡ thấy nội dung hay tên file của bên khác thì dừng và báo Owner.
> 2. Chỉ đọc: repo ở SHA trên, `C:\workspace\deep-review-1-6\common\` và báo cáo của chính bạn trong thư mục làm việc.
> 3. **Không ghi bất cứ gì vào repo**, kể cả file probe / test tạm rồi xóa, hay `CARGO_TARGET_DIR` trong worktree (Phase 5 đã làm cả hai). Test tạm, probe, bản chép để đột biến đặt trong `C:\workspace\deep-review-1-6\muse\{GÓI}\`; cần chạy test của repo trên bản chép thì chép cả file cần thiết vào đó. Phiên này chạy **không sandbox, không hỏi duyệt**, nên không có gì chặn lệnh ghi thay bạn: tự giữ luật này. Chạy lệnh test / build trong repo chỉ được khi nó chỉ ghi vào thư mục build / cache git đã ignore (`node_modules\.vite`, `coverage`, `dist`, `test-results`, `src-tauri\target`). Không `git commit / checkout / reset / restore / stash / clean / push`, không `gh`. Đầu và cuối phiên ghi `git -C C:\workspace\Project-2C-review-2 status --short` vào báo cáo; khác nhau thì nói rõ vì sao.
> 4. Không đọc file đăng nhập của Muse Code hay OpenCode (`~/.config/muse/auth.json`, `~/.local/share/opencode`), không chạy lệnh `muse` hay `opencode`, không dùng subagent.
> 5. Ghi báo cáo **dần** vào `C:\workspace\deep-review-1-6\muse\{GÓI}.md` trong lúc làm (tạo file sớm, thêm từng phát hiện). Viết tiếng Việt, không chen từ của ngôn ngữ khác.
> 6. Gói F được đọc `muse\A…E.md`. Không tổng hợp, không so với bên khác, không tạo Issue, không đề xuất merge. Xong gói thì dừng và in dòng `XONG …` (bước 0 phần chung).
>
> Phần chung dưới đây áp dụng đầy đủ.

## Phụ lục D — Phần chung của mọi prompt (lượt 1)

Nối nguyên văn vào cuối cả ba file `prompt-<bên>.md`. `<bên>` = thư mục kết quả của bên đó (`claude`, `codex`, `muse`), `<ID>` = `CL`, `CX`, `MU`.

> ## Phần chung
>
> ### Bước 0 — kiểm gói, trước khi đọc code
>
> Tin nhắn mở phiên chỉ có một chữ gói (`Gói A. Đọc và làm đúng …`); Owner chỉ đổi chữ đó giữa các phiên, nên bạn tự kiểm để tránh nhầm / sót. Kiểm từng file bằng tên đầy đủ (`Test-Path` hoặc mở file), không liệt kê thư mục:
>
> 1. `{GÓI}` phải là **đúng một chữ** trong A, B, C, D, E, F. Không phải → dừng, hỏi Owner.
> 2. `C:\workspace\deep-review-1-6\<bên>\{GÓI}.md`:
>    - **chưa có** → làm mới;
>    - có và **dòng đầu bắt đầu bằng `ĐANG LÀM`** → phiên trước bị cắt giữa chừng: **làm tiếp**, không làm lại từ đầu. Đọc hết file đó và thư mục `<bên>\{GÓI}\` (probe, log đã có), giữ nguyên mọi phát hiện đã ghi, làm nốt phần còn thiếu theo mục "Báo cáo" bên dưới; ghi rõ trong báo cáo là phiên làm tiếp và từ đâu;
>    - có mà dòng đầu **không** bắt đầu bằng `ĐANG LÀM` → gói đã xong: dừng, hỏi Owner (nhầm chữ hay muốn chạy lại); không ghi đè.
> 3. Báo cáo các gói **trước** `{GÓI}` theo thứ tự A → F đã có đủ trong `C:\workspace\deep-review-1-6\<bên>\` (vd. gói D cần `A.md`, `B.md`, `C.md`; gói A không cần gì) và **không** file nào còn dòng đầu `ĐANG LÀM`. Thiếu hay còn dở → dừng, báo Owner tên gói.
> 4. Đủ cả ba thì in đúng một dòng rồi làm tiếp, không chờ Owner: `Bắt đầu gói {GÓI} (<tên gói theo bảng dưới>) → <bên>\{GÓI}.md` (làm tiếp thì thêm `— làm tiếp phiên trước`).
>
> **Ghi báo cáo dần** (để phiên bị cắt — context hết, Owner đóng nhầm — không mất việc đã làm): ngay sau bước 0, tạo `<bên>\{GÓI}.md` với **dòng đầu** `ĐANG LÀM — <bên> gói {GÓI}, bắt đầu <giờ>` và phần đầu báo cáo (mục 1). Trong lúc làm, mỗi khi có phát hiện hay kết quả đo / probe thì **ghi ngay** vào file (phát hiện theo khuôn, số đo vào mục Bloat / Hiệu năng), không để dồn tới cuối. Khi chạy lệnh dài ở nền, ghi vào file đang chờ gì trước khi chờ.
>
> Cuối phiên, khi báo cáo đã đủ các mục: đổi dòng đầu thành `XONG — <bên> gói {GÓI}, <giờ xong>`, rồi in đúng một dòng: `XONG gói {GÓI} → C:\workspace\deep-review-1-6\<bên>\{GÓI}.md. Gói kế tiếp: <chữ kế tiếp> (mở phiên mới).` Gói F in: `XONG cả 6 gói của <bên>. Chờ Owner yêu cầu tổng hợp.`
>
> ### Dự án
>
> Project-2C: app desktop Tauri 2 + React, SQLite chạy trong webview qua sql.js, Rust chỉ ghi file / giữ API key / gọi OpenCode; chạy offline, một người dùng, dữ liệu hiện là **giả lập**. Phase 1–4: nhân sự / team, khách hàng N4–N1, KYC có cấu trúc, lịch hẹn và kết quả, hợp đồng, chỉ số và báo cáo, xuất Excel, backup. Phase 5: AI copilot (`packages/ai`: schema, validator V1–V7, prompt G5; panel KYC Intelligence, ChatGPT web thủ công, AI trích xuất). Phase 6: hàng đợi thay dữ liệu S-2, Thùng rác + khôi phục, hộp Xóa KH 5f. Đây là deep review toàn bộ code Phase 1–6 trước bản v1.0: tìm lỗi còn nằm sâu, edge case, bloat code và điểm nghẽn hiệu năng.
>
> ### Kế hoạch và phạm vi gói
>
> Kế hoạch đầy đủ: `C:\workspace\deep-review-1-6\common\plan.md` (§1 mục tiêu, §3 gói, §4 trục và thước mức, §5 KNOWN, §6 số đo, §10 định dạng). Phạm vi gói (đúng luật xếp gói của `tools/size-report-core.mjs`; file khớp gói trên trước thì thuộc gói đó, đọc thêm chỗ code gói khác mà gói nối vào):
>
> | Gói | Đường dẫn | Dòng SP / test | Trọng tâm |
> |---|---|---|---|
> | A. Lõi dữ liệu | `packages/domain/**`, `packages/db/**` | 7 473 / 11 847 | Tiền, ngày, kỳ, chỉ số, nhóm KH; bất biến; lệnh ↔ luật nhập backup; khôi phục Thùng rác; golden; seed / dữ liệu tải |
> | B. File và Rust | `apps/desktop/src-tauri/**`, `apps/desktop/src/data/**` trừ file AI | 2 001 / 3 968 | Ghi nguyên tử, khóa, S-2, tắt app / lỗi đĩa, đường dẫn, CSP, capabilities, key; `cargo clippy -W clippy::pedantic` một lần |
> | C. AI | `packages/ai/**`; file AI của app (`ai-*`, `*-ai-*`, `*Ai.tsx`, `KycExtraction`, `KycIntelligence`, `KycWebSession`, `KycHistory`, `extraction-view`) | 5 129 / 5 985 | Guardrail G5, validator, thử lại, STALE, ChatGPT web, trích xuất không tự lưu, key, AI về trong lúc thay dữ liệu |
> | D. Màn nhập liệu | `packages/ui/**` (trừ `scripts/`), `apps/desktop/src/{shell,i18n}/**`, `routes/customers/**` (trừ file AI và Hợp đồng), `routes/team/**`, `routes/Screen.tsx`, `apps/desktop/src/*`, `apps/desktop/index.html` | 6 820 / 1 748 | Khớp mockup / nhãn, form, hộp Xóa KH 5f, trợ năng, i18n |
> | E. Lịch hẹn, chỉ số, quản lý | `routes/{appointments,overview,reports}/**`, `routes/{Overview,Settings*,RestoreDialog,FilterBar}.tsx` (trừ `SettingsAi.tsx`), `routes/{trash-view,period-labels,applied-filter}.ts`, Hợp đồng (`routes/customers/{CustomerPolicies,PolicyDialogs,policy-form}.*`) | 7 032 / 3 545 | Đếm / lọc đúng nghĩa nhãn, số khớp giữa màn và Excel, kỳ / nửa đêm, Thùng rác 11a–11g, Cài đặt → Dữ liệu |
> | F. Xuyên gói, bloat / hiệu năng, công cụ | `tools/**`, `e2e/**`, `.github/**`, `.githooks/**`, `.claude/**`, `packages/ui/scripts/`, `apps/desktop/vite.config.ts`, file gốc repo; **luồng xuyên gói; toàn codebase cho bloat và hiệu năng** | 3 761 / 11 263 | Code chết / lặp / export thừa, dependency, bundle / exe, đo trên dữ liệu tải (gồm bảng hàm thuần Phase 4 + `listTrash`), test yếu / giả xanh, CI, script; hợp đồng `domain` ↔ `db` ↔ `ai` ↔ UI ↔ Rust; kết luận SẴN SÀNG / CHƯA SẴN SÀNG |
>
> ### Đọc trước
>
> `CLAUDE.md` (gốc + của package trong gói: có bản đồ export), `CONTEXT.md`, `docs/design/phase-6-hoan-thien.md` (§4 S-2, Thùng rác; §5 ngưỡng), spec theo gói: A — `docs/design/phase-3-du-lieu.md`, `phase-4-chi-so.md`, `docs/golden/{chi-so,kh-theo-nhom,kyc,lich-hen}.md`, ADR-0007, ADR-0008; B — ADR-0016, ADR-0009 phụ lục D-1, spec Phase 6 §4.1; C — `docs/design/phase-5-ai.md`, `phase-5-prompts.md`, `docs/golden/ai-eval.md`, ADR-0009 (phụ lục D-1, G5, W-1); D / E — mockup `docs/design/mockups/` (mục lục `README.md`) và spec Phase 3 / 4 / 6; F — tất cả ở trên khi cần, `docs/metrics/phase-6.md`, `e2e/perf/README.md`. **Spec, golden, mockup đã duyệt là nguồn đúng**: không đề xuất sửa chúng cho khớp code; chỗ chúng mâu thuẫn nhau thì báo là phát hiện trục C.
>
> ### Quy tắc chung
>
> 1. **Chỉ đọc và chạy lệnh: không sửa file trong repo, không sửa lỗi, không commit, không viết code sản phẩm.** Muốn thử "phá code" (đột biến) thì chép file vào thư mục kết quả của mình rồi chạy bản chép; nếu buộc phải patch trong repo (Claude, Codex) thì gỡ ngay sau khi chạy. Cuối phiên `git status --short` của repo phải như đầu phiên (thư mục build / cache bị ignore thì không sao).
> 2. **Không gọi dịch vụ AI của sản phẩm:** không `pnpm eval:ai` / `node tools/eval-ai.mjs`, không bấm "Kiểm tra kết nối" bằng key thật, không đọc / in key trong Windows Credential Manager (`cmdkey`…), không mở chatgpt.com. Dùng adapter Mock, `fetch` / HTTP giả, hoặc server HTTP local tự dựng trong thư mục của mình.
> 3. `pnpm e2e` dùng cổng cố định 4173: không chạy cùng lúc với bên khác; báo cổng bận thì chờ, **không** dùng `PW_REUSE=1` (sẽ test nhầm server của worktree khác). Kết quả cổng ở SHA ghim đã có ở `common\baseline.md`, không bắt buộc chạy lại toàn bộ.
> 4. Môi trường Windows: `pnpm` lỗi trong shell hiện tại thì chạy qua `powershell -NoProfile -Command "pnpm …"`. Không dùng `python3` (stub, có thể treo). Script tạm viết bằng `node` (`.mjs` trong thư mục của mình).
> 5. Mục có trong `common\known.md` (sổ OPEN / ACCEPTED + quyết định Owner K1–K17) gắn `KNOWN`, chỉ nêu khi có bằng chứng mới.
>
> ### Cách tìm
>
> - Đọc sâu **từng file** trong phạm vi gói. Đi qua **mọi trục**: E edge case · C đúng hợp đồng / spec / mockup / nhãn UI theo nghĩa thường · D dữ liệu · G guardrail AI · S an toàn ở ranh giới · P hiệu năng · B bloat · T chất lượng test · A trợ năng / i18n (định nghĩa ở `plan.md` §4.1). Trục không có gì thì ghi "đã xét, không thấy" **kèm đã chạy / đọc gì**.
> - **Chạy thử thay vì lập luận từ spec** ở mọi chỗ chạy được. Ưu tiên dựng **kịch bản nhiều bước qua nhiều gói**, vì lỗi Medium của các đợt trước đều thuộc loại này, ví dụ: kết quả AI về đúng lúc nhập lại backup cùng ID; dán lại chính tin nhắn của app vào khung dán; hai thao tác thay dữ liệu chồng nhau; khôi phục một bản ghi khi bản ghi cha vừa đổi; số trên Tổng quan ↔ Báo cáo ↔ Excel ↔ Thùng rác sau một chuỗi xóa / khôi phục. Đừng báo lại chính các ca này (đã sửa) — dùng chúng làm mẫu để nghĩ ca mới.
> - **Bloat và Hiệu năng là hai mục riêng bắt buộc** trong báo cáo (kể cả khi không có phát hiện), mỗi mục một bảng: đã chạy / đo gì, trên dữ liệu nào, số, ID phát hiện. Bloat: `tsc --noUnusedLocals --noUnusedParameters` chạy tạm, `rg` tìm nơi import của từng export, bản đồ `pnpm codemap`, `pnpm lint:deps`, code lặp ≥ 3 nơi, dependency, chunk của `pnpm build:web`; đề xuất refactor ghi cỡ và test nào giữ hành vi. Hiệu năng: **mọi phát hiện P phải có số đo** trên dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (≈ 1 500 KH, 10 400 lịch hẹn, 54 nhân sự, 103 phân tích AI, có Thùng rác; dùng trong Node qua `importBackup` của `@p2c/db`, trong app qua Cài đặt → Dữ liệu → Nhập backup); so với ngưỡng ở `docs/metrics/phase-6.md` (thao tác màn < 200 ms) hoặc số tham chiếu cùng máy `common\perf\perf-ref.json` (đo ở Office Laptop, máy chạy lượt này; cùng máy với số đo nền trong `phase-6.md` nên so được cả với số đó, trừ mục mở app lần đầu đo ở Home PC). Ghi máy và việc gì đang chạy song song. Đo trên exe: chép `common\exe\project2c.exe` vào thư mục của mình, cổng debug khác 9222, theo `e2e/perf/README.md`; không đo khi bên khác đang đo.
> - **Không cài công cụ mới** (`knip`, `jscpd`, `cargo-bloat`, visualizer… là G4); thấy cần thì ghi đề xuất.
> - Không bình luận phong cách / đặt tên trừ khi gây lỗi. Không đặt chỉ tiêu số lượng; không nâng mức cho nổi.
>
> ### Khuôn phát hiện
>
> ```
> ID: <ID>-<gói><số>   (vd. <ID>-A3)
> Mức: Critical | High | Medium | Low | Nit
> Trục: E | C | D | G | S | P | B | T | A
> Vị trí: path:dòng (8855345)
> Tình trạng: CONFIRMED | PLAUSIBLE | KNOWN
> Mô tả: một-hai câu
> Tái hiện / bằng chứng: lệnh + kết quả, hoặc probe / test tạm (nguồn ở phụ lục)
> Ảnh hưởng: ai / khi nào gặp
> Đề xuất: hướng sửa ngắn; cỡ ước lượng (≤ 400 dòng SP?)
> ```
>
> - **Thước mức:** Critical = mất dữ liệu đã lưu, hỏng file DB, lộ API key, chạy được code lạ — ở thao tác bình thường. High = thao tác bình thường làm dữ liệu sai lặng lẽ (lan sang chỉ số / báo cáo / backup mà người dùng không nhận ra) hoặc chặn hẳn việc chính không có đường vòng. Medium = thao tác bình thường dẫn tới dữ liệu sai / không đảo ngược được hoặc chặn việc chính (có đường vòng); thao tác chính vượt ngưỡng hiệu năng đã chốt. Low = cần điều kiện hiếm (file sửa tay, output suy biến, server bất thường, thao tác UI không cho), chỉ sai hiển thị, test hở, bloat có chi phí đo được. Nit = chữ, dọn dẹp, bloat không đo được chi phí.
> - **Bằng chứng phải thật.** Mỗi `path:dòng` phải đúng với file ở SHA ghim (đọc lại trước khi ghi). `CONFIRMED` chỉ khi đã chạy lệnh / probe và dán lệnh + trích kết quả thật; chưa chạy thì `PLAUSIBLE` và nói đã đọc gì. Không bịa số đo, tên hàm, tên test hay kết quả lệnh.
>
> ### Báo cáo
>
> File `C:\workspace\deep-review-1-6\<bên>\<gói>.md`, tiếng Việt, gồm theo thứ tự: (1) bên, gói, SHA đầu phiên, `git status --short` đầu phiên, giờ bắt đầu; (2) phạm vi đã đọc (file, dòng); (3) phát hiện theo khuôn trên; (4) mục **Bloat** và mục **Hiệu năng** (bảng số); (5) bảng đếm mức × trục, nói rõ nếu tỉ lệ PLAUSIBLE cao; (6) "đã xét, không thấy" theo từng trục; (7) phụ lục nguồn probe / test tạm / đột biến (cái nào bị test giết, cái nào sống), `git status --short` cuối phiên, giờ xong. **Gói F** thêm kết luận **SẴN SÀNG / CHƯA SẴN SÀNG cho v1.0 ở SHA `8855345`** kèm lý do.
>
> Xong gói thì dừng và in dòng `XONG …` (Bước 0). Không tổng hợp, không so với bên khác, không tạo Issue, không đề xuất merge.

---

# Lượt 2

Kế hoạch lượt 2 (T-224 #564), soạn 17/10/2026 trên Home PC; sửa cùng ngày theo trả lời của Owner (§L2.11). Mục nào không nói khác thì giữ như lượt 1 (§1–§12, Phụ lục A–D).

| Yêu cầu của #564 | Mục |
|---|---|
| 1. SHA ghim lượt 2 = `main` sau khi mọi Issue sửa lượt 1 đóng | §L2.2 |
| 2. Prompt hai phần ngang nhau: kiểm phần đã sửa + tìm lỗi / edge case mới | §L2.4, Phụ lục E, F, H |
| 3. KNOWN lượt 2 = KNOWN lượt 1 + mọi vấn đề lượt 1, kèm quyết định Owner | §L2.5 |
| 4. Cỡ dòng từng gói đo lại; cấu hình Muse / OpenCode theo chỗ vướng ở lượt 1 (lượt 2 bỏ Muse, M7: chỉ giữ bài học áp dụng cho Claude / Codex) | §L2.3, §L2.7 |
| Lệnh so số đo với baseline | §L2.6 |
| Báo cáo có bảng trạng thái theo ID `DR6-*`, rồi phát hiện mới với ID mới theo bên | §L2.8 |

## L2.1 Mục tiêu, bên review

Spec Phase 6 §6.3: lượt 2 chạy trên SHA sau đợt sửa lượt 1, **cùng 6 gói**, bên review theo ADR-0001 phụ lục M7 (dưới), có **hai phần ngang nhau** (Owner chốt 11/10):

1. **Kiểm phần đã sửa (trục R):** trạng thái từng vấn đề `DR6-*` của lượt 1 (đã sửa / một phần / chưa sửa / hồi quy); refactor và sửa hiệu năng không đổi hành vi; số đo không xấu hơn nền (§L2.6).
2. **Tìm lỗi mới và edge case mới** trên **toàn bộ** phạm vi gói, không chỉ quanh chỗ đã sửa: mỗi bên thử kịch bản / biên chưa có trong báo cáo lượt 1, ghi lại từng kịch bản đã thử (§L2.4).

**Hai bên:** Claude, Codex → 6 gói × 2 bên = **12 báo cáo**, chạy **một đợt** (hai bên song song). Issue #564 viết "4 bên" (soạn trước 13/10); ADR-0001 phụ lục M5 đã bỏ DeepSeek, và **Owner bỏ Muse ngày 17/10/2026** (phụ lục M7, §L2.11). Chạy **một bộ** trên một máy, máy nào cũng được (laptop hay Home PC); số đo so với mốc **cùng máy** (§L2.6). Không chạy thêm bản tham khảo trên máy thứ hai như lượt 1.

Kết luận lượt 2 chỉ lấy từ phiên tổng hợp T-225 #565 (spec §6.1). Sau tổng hợp: Owner chọn → sửa (Issue thường) → G7 (spec §7).

## L2.2 SHA ghim, đợt sửa, chỗ làm

**SHA ghim lượt 2: `4217ed4`** (`4217ed4cd3300af1d63aa61db9eb13902fe75f16`, `main` 16/10/2026 sau #646). Mọi Issue sửa lượt 1 đã đóng: #592–#607 (16 Issue, T-231…T-246) và #625 (T-247, chụp lại ảnh hướng dẫn); #563 (tổng hợp lượt 1) đã đóng. Từ `83e0515` (#644, PR sửa cuối) tới SHA ghim chỉ có tài liệu: `docs/**`, `CLAUDE.md` gốc và `.claude/rules/ci.md` (#646: tả cổng merge "tested base").

**Đợt sửa = diff `8855345..4217ed4`:** ngoài `docs/**` và mọi file `*.md` có 136 file, +8 260 / −835 dòng (`git diff --numstat 8855345 4217ed4`; tính cả `CLAUDE.md` gốc thì 137 file, +8 262 / −837); hai migration mới `0009_lookup_indexes`, `0010_people_team_none`.

| Issue | Việc | DR6 | PR | Commit |
|---|---|---|---|---|
| #592 T-231 | Khôi phục cuộc gặp Đã gặp về như lúc xóa | 01, 03 | #614 (+ spec E18–E20 #615) | `23eed54` (`b752bc4`) |
| #593 T-232 | Ghi, sửa, xóa cuộc gặp theo nhóm tại ngày cuộc hẹn | 04, 05 | #616 | `b563604` |
| #594 T-233 | Bàn giao KH chuyển lịch Dự kiến sang RE mới | 02 | #618 | `5d2443f` |
| #595 T-234 | Lớp file: DB hỏng, câu lỗi, `openFrom`, `.tmp` | 06–09 (+ Rust của 60) | #620 (+ hướng dẫn #621) | `9acef55` (`0446180`) |
| #596 T-235 | Rust AI + phát hành: key hai lớp, model, 1.0.0, `crate-type`, quyền | 10–14 (+ A14 của 60) | #617 | `1531b71` |
| #597 T-236 | Hồ sơ KH và Tổng quan khớp nghiệm thu G7 | 27–30, 46 | #623 (+ hướng dẫn #624) | `bf87d71` (`123f846`) |
| #598 T-237 | AI: phiên ChatGPT web, V1 / `LAW_NAME`, seed, Mock | 15, 16, 18, 19, 22 (+ 61) | #628 | `e6c9078` |
| #599 T-238 | STALE vẫn mờ nhưng đạt AA (G3) | 21 (+ mockup của 22) | #632 | `35ba0d3` |
| #600 T-239 | Hộp lịch hẹn và HĐ | 38–42 | #634 | `ffc1db7` |
| #601 T-240 | Thùng rác và Cài đặt → Dữ liệu | 43–45 | #630 | `43e6696` |
| #602 T-241 | Team và Khách hàng | 26, 31–33 | #636 | `ba3ca2d` |
| #603 T-242 | Điều hướng và trợ năng | 20, 34, 35 | #638 | `e8d340a` |
| #604 T-243 | Chữ và nhập backup | 49–52 (+ comment của 54) | #640 | `d3797d7` |
| #605 T-244 | Công cụ: eval, cổng merge, `retro.mjs` | 55–58 (+ 64) | #642 (+ #646) | `30e12c4` (`4217ed4`) |
| #606 T-245 | Test giữ các luật đột biến còn sống | 59, 62, 63, 65 (+ TS của 60) | #644 | `83e0515` |
| #607 T-246 | Tài liệu: lệch mockup đã biết, NT-TQ-06, golden L-09 | 29 (ô Kỳ), 36, 47, 48, 54 | #619 | `13f62d6` |
| #625 T-247 | Chụp lại hai ảnh hướng dẫn (không phải DR6) | — | #626 | `d887a82` |

Trong suốt lượt 2 **không merge code vào `main`** (như §2). PR docs merge được, không đổi SHA ghim.

| Bên | Ai chạy | Làm ở | Thư mục kết quả | ID |
|---|---|---|---|---|
| Claude (phiên sạch mỗi gói, tuần tự A → F, không subagent) | Owner mở phiên | `C:\workspace\Project-2C-review` | `C:\workspace\deep-review-1-6-r2\claude\` | `CL2-<gói><số>` |
| Codex (cùng lúc Claude) | Owner | `C:\workspace\Project-2C-review-2` | `…-r2\codex\` | `CX2-<gói><số>` |
| **Claude phiên tổng hợp** (T-225 #565) | Owner yêu cầu, sau khi đủ 12 báo cáo | checkout chính | `docs/reviews/` qua PR docs | dùng nguyên ID trên |

**Máy:** Office Laptop `D13_THINKPAD` hoặc Home PC `DESKTOP-KDURKJP`, máy nào cũng được (Owner 17/10, §L2.11 câu 1); bước chuẩn bị, cả hai bên và mọi số đo trên **cùng một máy**, và số đo chỉ so với mốc của máy đó (§L2.6). Thư mục lượt 1 `C:\workspace\deep-review-1-6\` có trên cả hai máy (HANDOFF: giữ tới v1.0): trên laptop là bộ chính thức, trên Home PC là bộ tham khảo của lượt 1. Mỗi bên dùng lại probe lượt 1 của chính mình ở máy đang chạy; probe của bộ máy kia lấy ở phụ lục nguồn trong báo cáo gốc (`docs/reviews/raw/2026-10-15/`, `…/home-pc/`).

**Một đợt:** lượt 1 chia hai đợt để Muse chạy một mình khi thư mục `claude\`, `codex\` đã bị chặn ACL (§2 "Vì sao chia hai đợt", §7.2). Lượt 2 không có Muse: Claude và Codex chạy song song như đợt 1 của lượt 1, không ACL (§7 không dùng). Va cổng e2e 4173 và đo trên exe giữ luật của Phụ lục H (quy tắc chung 3, mục Hiệu năng).

## L2.3 Sáu gói, cỡ đo lại, diff sửa theo gói

Phạm vi từng gói **giữ đúng §3** (luật `PACKAGES` của `tools/size-report-core.mjs` không đổi từ lượt 1). Thứ tự phiên vẫn A → F.

**Cỡ đo trên SHA ghim** (`node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` ở `4217ed4`, 16/10, Home PC; số dòng không phụ thuộc máy). Δ so với số đo nền `b139d8a`. **Diff sửa** = dòng thêm / xóa của `git diff --numstat 8855345 4217ed4`, xếp gói bằng `classifyFile` (Rust: test trong file tính là SP).

| Gói | SP (Δ) | Test (Δ) | Sinh (Δ) | File (Δ) | Diff sửa SP | Diff sửa test | DR6 kiểm chính (bảng R, §L2.5) |
|---|---:|---:|---:|---:|---|---|---|
| A. Lõi dữ liệu | 7 867 (+394) | 12 807 (+960) | 311 (+22) | 98 (+5) | +496 / −102 · 19 file | +985 / −25 · 14 file | 01–05, 44, 49–52, 54, 59 |
| B. File và Rust | 2 162 (+161) | 4 433 (+465) | 0 | 19 (0) | +518 / −83 · 4 file | +196 / −5 · 3 file | 06–14, 60 |
| C. AI | 5 250 (+121) | 6 110 (+125) | 0 | 60 (0) | +196 / −75 · 10 file | +157 / −32 · 5 file | 15, 16, 18–22, 61 |
| D. Màn nhập liệu | 7 196 (+376) | 2 023 (+275) | 0 | 74 (+1) | +492 / −116 · 18 file | +308 / −33 · 6 file | 02, 26–36, 62 |
| E. Lịch hẹn, chỉ số, quản lý | 7 374 (+342) | 3 843 (+298) | 0 | 51 (0) | +493 / −151 · 14 file | +341 / −43 · 5 file | 01, 02, 04, 38–48, 63 |
| F. Xuyên gói, bloat / hiệu năng, công cụ | 3 939 (+178) | 12 417 (+1 519) | 4 628 (0) | 84 (+1) | +265 / −87 · 7 file | +1 229 / −75 · 21 file | 44 (đo), 55–58, 64, 65; **bảng R gộp đủ 59 DR6** |
| **Tổng** | 33 788 (+1 572) | 41 633 (+3 642) | 4 939 (+22) | 386 (+7) | | | |

- Một DR6 có thể thuộc hai, ba gói (vd. DR6-02: lệnh ở A, hộp 5c ở D, "Hẹn tiếp" 6h ở E): mỗi gói kiểm phần của mình; gói F gộp.
- Bước chuẩn bị (§L2.9 bước 6) đo lại trên máy chạy lượt 2 bằng cùng lệnh, kèm bundle và exe; số dòng phải trùng bảng trên.

## L2.4 Hai phần của mỗi gói

Mỗi gói làm **cả hai phần**, ghi riêng trong báo cáo. Phần 2 không được rút ngắn vì phần 1 dài: lượt 1 cho thấy lỗi Medium nằm ở chuỗi nhiều bước mà bên nào đó chưa thử, không ở chỗ đã biết.

### Phần 1 — kiểm phần đã sửa (trục R)

Với **mỗi DR6 mà gói kiểm** (cột "Gói kiểm" §L2.5), một dòng bảng R có bằng chứng:

1. **Chạy lại tái hiện của lượt 1** (probe / ca trong báo cáo gốc `docs/reviews/raw/2026-10-15/` của cả hai máy, phụ lục nguồn probe; tổng hợp lượt 1 §3–§5) trên SHA ghim: còn ra kết quả sai không.
2. **Gỡ tạm phần sửa** (trên bản chép, hoặc patch gỡ ngay — luật chỉ đọc ở Phụ lục H): test của PR sửa có đỏ không. Không đỏ → test hở, ghi phát hiện trục T.
3. **Biến thể gần** của cùng lỗi mà phần sửa bỏ sót (cùng hàm khác đường vào, cùng luật ở lệnh khác / ở nhập backup / ở màn khác).
4. Với mục Owner chọn **ghi lệch đã biết** thay vì sửa code (DR6-29 ô Kỳ, 36, 47, 48, 54): dòng ghi trong `docs/testing/nghiem-thu-v1.md` / golden có, và khớp app.

Kết luận mỗi DR6 (thước của tổng hợp review lại Phase 5, `docs/reviews/2026-10-11-review-lai-phase-5-tong-hop.md` §2):

- **ĐÃ SỬA:** đường lỗi lượt 1 báo đã hết, có test đỏ khi gỡ phần sửa. Biến thể gần còn hở (nếu có) ghi thành phát hiện mới riêng, DR6 vẫn ĐÃ SỬA.
- **SỬA MỘT PHẦN:** một phần của chính mô tả DR6, của Issue sửa, hoặc của quyết định Owner 15/10 (tổng hợp lượt 1 §9) chưa làm.
- **CHƯA SỬA:** đường lỗi lượt 1 còn nguyên.
- **HỒI QUY:** phần sửa làm hỏng chỗ trước đó đúng.

Ba kết luận sau kèm một phát hiện theo khuôn (§L2.8), trường "Liên quan: DR6-xx".

**Refactor / hiệu năng không đổi hành vi:** đợt sửa chỉ có hai việc thuần hiệu năng / build — DR6-44 (chỉ mục `customer_id`, migration `0009`) và DR6-13 (`crate-type`). Kiểm hai điều: số đo tốt lên như PR nói, so với số lượt 1 **cùng máy** (tổng hợp lượt 1 §7.1: laptop `listTrash` 75 KH đã xóa → 197 ms, 150 → 368 ms, build release +11,5 s; Home PC `listTrash` 100 KH → 211 ms, 400 → 815 ms, chưa có số build lượt 1 — chạy trên Home PC thì kiểm DR6-13 bằng `Cargo.toml` và cỡ `target`, thời gian build chỉ ghi lại), và hành vi không đổi (test cũ xanh, `listTrash` trả cùng dòng trước / sau trên dữ liệu tải). Refactor bloat (DR6-25, 66, 67) đã hoãn sau v1.0, nên không có gì khác để kiểm ở mục này.

### Phần 2 — lỗi mới và edge case mới

Trên **toàn bộ phạm vi gói** (không chỉ diff sửa), như lượt 1: đọc sâu từng file, đi qua mọi trục §4.1, chạy thử thay vì suy từ spec. Thêm:

- **Code mới của đợt sửa là chỗ đáng xét trước** (lỗi mới do chính phần sửa gây ra, như R2-09 / R2-14 của Phase 5): trọng tâm từng gói ở bảng Phụ lục H.
- **Kịch bản / biên chưa có trong báo cáo lượt 1.** Báo cáo có mục bắt buộc **"Kịch bản mới đã thử"**: mỗi kịch bản một dòng (các bước, dữ liệu, kết quả: thấy lỗi → ID, không thấy → "không thấy" + đã chạy gì). Mỗi gói nên có ít nhất 5 kịch bản mới; gói F ít nhất 5 chuỗi nhiều bước qua nhiều gói. Đây là chỉ tiêu kịch bản phải thử, không phải chỉ tiêu phát hiện.
- Chỗ "đã xét, không thấy" ở lượt 1 vẫn đáng xét lại: ở lượt 1, mỗi Medium chỉ một bên thấy.
- Không báo lại DR6 hay mục KNOWN (§L2.5), trừ khi có bằng chứng mới.

## L2.5 KNOWN lượt 2

`common\known.md` (bước chuẩn bị §L2.9 bước 4) gồm **ba phần**:

1. **Nguyên văn mục OPEN và ACCEPTED** của `docs/state/review-notes.md` ở SHA ghim. So với lượt 1 có thêm: các DR6 hoãn / chấp nhận (#608) và ghi chú không chặn của 16 PR sửa (#620–#644), ví dụ `quickCheck()` chạy trên DB đã migrate (#620), `normalizeText` bỏ cả ZWJ (#640), hai câu hướng dẫn ở 9b (#636, ghi "lượt 2 / G3 xem"), `testedBase` null ở `mergeBlockers` (#642).
2. **Quyết định Owner còn hiệu lực:** K1–K17 của §5 (giữ nguyên chữ), cộng:

| # | Quyết định | Nguồn |
|---|---|---|
| K18 | Khôi phục cuộc gặp Đã gặp **về như lúc xóa**: cuộc gặp giữ nhóm không ghi chuyển nhóm, không kiểm D10 (E18–E20 của TR-3). Một luật **"nhóm của KH tại ngày cuộc hẹn"** cho ghi / sửa / xóa / khôi phục cuộc gặp và chuyển tay lùi ngày, kèm luật nhập backup (K1: dữ liệu cũ nạp lại, hash `tables` của dữ liệu tải đã đổi) | Owner 15/10 Q1, Q2; spec Phase 6 §4.2, spec Phase 3 §4 |
| K19 | Bàn giao KH (5c) chuyển lịch **Dự kiến** sang RE mới trong cùng transaction; "Hẹn tiếp" (6h) và "Hẹn lần tiếp theo" (6c) lấy RE hiện tại của KH; lịch đã có kết quả và HĐ giữ RE cũ (ADR-0007) | Owner 15/10 Q3; spec Phase 3 §4 dòng `updateCustomerProfile` |
| K20 | Chữ: tên team / nhân sự / KH và giá trị KYC gộp mọi khoảng trắng Unicode thành một dấu cách, bỏ mọi `\p{Cf}`, từ chối UTF-16 hỏng; **ghi chú KYC giữ xuống dòng**, chỉ gộp trong từng dòng; giá trị liệt kê sai → `INVALID_CHOICE`; cùng một hàm ở lệnh, nhập backup và UI | Owner 16/10 (Issue #604) |
| K21 | Các đề xuất còn lại của §9 tổng hợp lượt 1: tiền KYC đọc lại khi `parseVnd` hiểu được, giữ chữ tự do khi không (Q4); NT-TQ-06 theo golden "100%" / "60%" (Q4); V1 / `LAW_NAME` sửa đúng chữ G5, không G5 mới (Q6); STALE mờ mà ≥ AA (Q7); case size chỉ của cuộc gặp Đã gặp gần nhất (Q8); hồ sơ 3 cột ở 1 440 (Q9); phiên bản 1.0.0 (Q12); điểm ghi "Lệch mockup đã biết" của `nghiem-thu-v1.md` (#619) | Owner 15/10 |

3. **Bảng 67 DR6 của lượt 1** (dưới), cùng mô tả đầy đủ ở tổng hợp lượt 1 §3–§5 (`docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md`). **59 DR6 có Issue sửa** vào bảng R của gói kiểm (§L2.4 phần 1), không báo lại thành phát hiện; **8 DR6 hoãn / chấp nhận** là KNOWN, chỉ nêu khi có bằng chứng mới (hậu quả nặng hơn, đường vào mới).

Mức: M = Medium, L = Low, N = Nit. "Gói kiểm": gói ghi bảng R cho DR6 đó; gói đầu là gói chính.

| DR6 | Mức | Vấn đề (ngắn) | Quyết định Owner 15/10 | Issue → PR | Gói kiểm |
|---|---|---|---|---|---|
| 01 | M | Khôi phục cuộc gặp giữ nhóm bị D10 chặn khi KH đổi nhóm sau ngày gặp | Sửa (Q1 a, E18) | #592 → #614 | A, E |
| 02 | M | Bàn giao KH: lịch Dự kiến / hẹn tiếp ở RE cũ | Sửa (Q3 a) | #594 → #618 | A, D, E |
| 03 | L | Khôi phục khi đã có chuyển tay cùng ngày | Sửa (Q2, E19) | #592 → #614 | A |
| 04 | L | 6c / 6f lấy nhóm hiện tại làm "giữ nguyên"; dời ngày không kiểm D10 | Sửa (Q2) | #593 → #616 | E, A |
| 05 | L | D7 / chuyển tay lùi ngày qua cuộc gặp giữ nhóm | Sửa (Q2, E20) | #593 → #616 | A |
| 06 | L | DB hỏng một trang vẫn mở, chép thành backup mới nhất | Sửa | #595 → #620 | B |
| 07 | L | Câu lỗi khởi động / lưu sai hướng (file bị giữ, không ghi được, đĩa đầy) | Sửa | #595 → #620 | B |
| 08 | L | `openFrom` lưu bytes chưa migrate | Sửa | #595 → #620 | B |
| 09 | N | `backups\*.db.tmp` sót; thư mục tạm của test Rust | Sửa | #595 → #620 | B |
| 10 | L | Key URL-encode rồi JSON-escape `%` lọt kiểm key | Sửa | #596 → #617 | B |
| 11 | L | `check()` không giới hạn tên model | Sửa | #596 → #617 | B |
| 12 | N | Phiên bản `0.1.0` | Sửa (Q12: 1.0.0) | #596 → #617 | B |
| 13 | L | `crate-type` thừa: +11,5 s mỗi build release | Sửa | #596 → #617 | B |
| 14 | N | `core:default` cấp lệnh thừa; CSP thiếu `base-uri` / `form-action` | Sửa | #596 → #617 | B |
| 15 | L | Phiên ChatGPT web không mang mốc `generation` | Sửa | #598 → #628 | C |
| 16 | L | V1 đếm trên chuỗi còn `\p{Cf}`; `LAW_NAME` miễn KH / RE chỉ chữ hoa | Sửa đúng chữ G5 (Q6) | #598 → #628 | C |
| 17 | L | Ký tự vô hình lọt V3–V6 | **Hoãn sau v1.0** (Q5, cần G5) | — | KNOWN |
| 18 | L | Seed ghi `prompt_version` `@1` | Sửa | #598 → #628 | C |
| 19 | L | Mock trích xuất nhận sai ngữ cảnh | Sửa | #598 → #628 | C |
| 20 | L | Hủy / Thử lại trích xuất làm focus về `body` | Sửa | #603 → #638 | C |
| 21 | L | Bản STALE mờ dưới AA | Sửa (Q7 a, G3) | #599 → #632 | C |
| 22 | N | Chữ cũ "64 token", `ai-eval.md:13`, "200 000" | Sửa | #598 → #628, #599 → #632 (mockup) | C |
| 23 | N | Bản bỏ dấu khớp nhầm câu thường | **Hoãn** (G5 sau) | — | KNOWN |
| 24 | N | Chi tiết V1 không nêu dạng đúng | **Hoãn** | — | KNOWN |
| 25 | L | `zod` bản đầy đủ ≈ 10 % `index.js` | **Hoãn** | — | KNOWN |
| 26 | L | Hộp 9b không đếm người đánh giá | Sửa | #602 → #636 | D |
| 27 | L | Tiền KYC không đọc lại (NT-HS-05) | Sửa (Q4) | #597 → #623 | D |
| 28 | L | Hộp 7d thiếu mã F (NT-HS-08) | Sửa (Q4) | #597 → #623 | D |
| 29 | L | Dòng thời gian thiếu "tính / không tính RF", nhãn "thay đổi quan trọng"; thẻ Lịch hẹn thiếu ô Kỳ | Sửa code; ô Kỳ ghi lệch đã biết | #597 → #623, #607 → #619 | D |
| 30 | L | Hồ sơ 2 cột ở 1 440 × 900 | Sửa (Q9: 3 cột) | #597 → #623 | D |
| 31 | L | Tạo KH cho RE ngoài góc nhìn không báo | Sửa | #602 → #636 | D |
| 32 | L | Đổi team không đưa bảng về 100 dòng | Sửa | #602 → #636 | D |
| 33 | L | Lỗi form: ô Ngày 7a, Giới tính, nút Xóa team / nhân sự | Sửa | #602 → #636 | D |
| 34 | L | Back chuột / Alt+← khi hộp mở: mất bản nháp | Sửa | #603 → #638 | D |
| 35 | L | Đổi màn / nút tự gỡ làm mất focus | Sửa | #603 → #638 | D |
| 36 | N | Lệch mockup nhỏ của D chưa ghi | Ghi lệch đã biết | #607 → #619 | D |
| 37 | N | Dấu nối / ký hiệu cứng trong JSX | **Hoãn** (lần chạm sau) | — | KNOWN |
| 38 | L | Ngày điền sẵn đọc lại theo năm mới qua giao thừa | Sửa | #600 → #634 | E |
| 39 | L | Case size "cuộc gặp gần nhất" lấy số cuộc gặp cũ | Sửa (Q8 a) | #600 → #634 | E |
| 40 | L | Sửa HĐ: "khác FYP nộp" so FYP đã lưu | Sửa | #600 → #634 | E |
| 41 | L | Đổi tháng phát hành / nộp không hiện "Ảnh hưởng chỉ số" | Sửa | #600 → #634 | E |
| 42 | L | Ghi kết quả kèm hẹn tiếp không chuyển tới lịch mới | Sửa | #600 → #634 | E |
| 43 | L | Thùng rác: sắp cột "Bản ghi", nút không `aria-label`, không tính lại khi sang ngày | Sửa | #601 → #630 | E |
| 44 | L | `listTrash` tuyến tính theo KH đã xóa, thiếu chỉ mục | Sửa (migration `0009`) | #601 → #630 | E, A, F (đo) |
| 45 | L | Cài đặt → Dữ liệu: hai thông báo cùng hiện | Sửa | #601 → #630 | E |
| 46 | L | "Đang xem" kỳ Năm thiếu "·" (NT-TQ-22) | Sửa (Q4) | #597 → #623 | E |
| 47 | N | Cách viết tỉ lệ chốt (NT-TQ-06) | Docs: giữ golden, sửa NT-TQ-06 (Q4) | #607 → #619 | E |
| 48 | N | Lệch mockup nhỏ của E chưa ghi | Ghi lệch đã biết | #607 → #619 | E |
| 49 | L | `cleanText` chỉ NFC + trim (khoảng trắng / ký tự vô hình / surrogate) | Sửa (+ K20) | #604 → #640 | A |
| 50 | L | Nhập backup nhận mâu thuẫn KYC hai giá trị trùng | Sửa | #604 → #640 | A |
| 51 | N | Enum sai → lỗi `CHECK` thô | Sửa (`INVALID_CHOICE`) | #604 → #640 | A |
| 52 | N | CHECK `people` không giữ "IS / BD / BDM không có team" | Sửa (migration `0010`) | #604 → #640 | A |
| 53 | N | `ulid` với đồng hồ trước 1970 | **Chấp nhận** (ACCEPTED) | — | KNOWN |
| 54 | N | Golden L-09 và comment trái DR-47 | Ghi chú golden (G2) + sửa comment | #607 → #619, #604 → #640 | A |
| 55 | L | Script eval có thể ghi key vào file kết quả | Sửa | #605 → #642 | F |
| 56 | L | Script eval bỏ `finish_reason` / `content: null` + `length` | Sửa | #605 → #642 | F |
| 57 | L | Cổng merge: Re-run CI dùng SHA cũ; `files` chỉ 100 | Sửa (cổng "tested base") | #605 → #642 (+ #646) | F |
| 58 | L | `retro.mjs` bỏ `CLAUDE_CONFIG_DIR` | Sửa | #605 → #642 | F |
| 59 | L | Test hở gói A (`kycHash`, M15, M10, N19) | Thêm test | #606 → #644 | A |
| 60 | L | Test hở gói B (RS4 / R8, RS9, MJ15, A14, `sync_all`, J5) | Thêm test | #595 → #620, #596 → #617, #606 → #644 | B |
| 61 | L | Test hở gói C (`LAW_NAME`, trần TS ↔ Rust, V4 / V6 `personalityNotes`) | Thêm test | #598 → #628 | C |
| 62 | L | Test hở gói D (X5, X6, BR3 / BR4, `coverage.include`, D6) | Thêm test | #606 → #644 | D |
| 63 | L | Test hở gói E (`restoreRow` HĐ, AV8) | Thêm test | #606 → #644 | E |
| 64 | L | Test hở gói F (P3, P5, S3, S9) | Thêm test | #605 → #642 | F |
| 65 | N | KNOWN có bằng chứng mới: `tables.test.ts` theo múi giờ, `+Infinity%`, "1984" | Sửa test / comment; ca TR-5 Auckland ACCEPTED | #606 → #644 | F |
| 66 | N | Export / hàm chỉ test dùng | **Hoãn** (dọn khi chạm file) | — | KNOWN |
| 67 | N | Code lặp ≥ 3 nơi | **Hoãn** (dọn khi chạm file) | — | KNOWN |

Đếm: 2 M · 48 L · 17 N = 67 (khớp tổng hợp lượt 1 §1). Có Issue sửa: 59; hoãn: 7 (17, 23, 24, 25, 37, 66, 67); chấp nhận: 1 (53).

## L2.6 Số đo: so với nền và với lượt 1

- **Dữ liệu tải sinh lại ở SHA ghim** (luật nhập backup đổi ở #616, #640 nên hash đổi; file lượt 1 `deep-review-1-6\common\load\…` **không dùng**): `node tools/load-data.mjs` (mốc `2026-10-12`, seed `6`) → số dòng như lượt 1 (1 496 KH, 10 414 lịch hẹn, 54 nhân sự, 103 `ai_analyses`…), **`tables` sha256 `1c306cfb8203409337a5fa33c48306694581cb70355eb5526e4cf4f543589591`** (đo 16/10 ở `4217ed4`; lệnh tất định nên mọi máy ra cùng hash). Cỡ file 15,3 MB.
- **Máy và mốc so** (Owner 17/10, §L2.11 câu 1): chạy trên máy nào thì chỉ so với số **cùng máy**. Ngưỡng tuyệt đối ở `docs/metrics/phase-6.md` áp dụng trên cả hai máy. Mọi bảng số ghi tên máy.

  | Mốc | Office Laptop `D13_THINKPAD` | Home PC `DESKTOP-KDURKJP` |
  |---|---|---|
  | Probe trên exe: nền | `docs/metrics/phase-6-baseline/perf.json` (T-219, `b139d8a`; spec §5.1) | không có nền T-219 (đo ở laptop): **không so**, chỉ so ngưỡng `phase-6.md` |
  | Probe trên exe: lượt 1 cùng máy | `C:\workspace\deep-review-1-6\common\perf\perf-ref.json` của laptop (exe `8855345`, 14/10) | `C:\workspace\deep-review-1-6\common\perf\perf-ref.json` của Home PC (exe `8855345` release, 13/10, ghi chú `DESKTOP-KDURKJP (Home PC), exe 8855345 release, 6D round 1 reference`; đã kiểm có 17/10) |
  | Mở app lần đầu | `p2c:data-open` lần đầu của T-219 (3 140 ms) | T-227 (`phase-6.md` mục "Mở app lần đầu, đo lại"): LCP, exe Phase 4 max 3 937 ms |
  | Bảng hàm thuần (Node) | cột Laptop của tổng hợp lượt 1 §7.1 | cột Home PC của tổng hợp lượt 1 §7.1 |

  Thư mục `C:\workspace\deep-review-1-6\` giữ trên cả hai máy tới v1.0 (HANDOFF). Bước chuẩn bị chép `perf-ref.json` lượt 1 của máy đang chạy thành `…-r2\common\perf\perf-ref-r1.json`.
- **"Xấu hơn"** theo luật nhiễu của probe (Owner chốt 13/10): trung vị lớn hơn mốc **quá 20 % và quá 10 ms** (bộ nhớ: quá 5 MB), cột ⚠️ của bảng.
- **Lệnh** (bước chuẩn bị chạy một lần, reviewer dùng lại kết quả trong `common\baseline.md`):

  ```powershell
  node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json
  ```

  Probe, **laptop** (cột Nền = T-219):

  ```powershell
  $env:PERF_BASE = 'docs\metrics\phase-6-baseline\perf.json'; $env:PERF_BACKUP = 'C:\workspace\deep-review-1-6-r2\common\load\load-2026-10-12-seed6.p2cbackup'; $env:PERF_OUT = 'C:\workspace\deep-review-1-6-r2\common\perf\perf-ref.json'; $env:PERF_NOTE = 'D13_THINKPAD, exe 4217ed4, deep review luot 2'; pnpm exec playwright test -c playwright.perf.config.ts
  ```

  Probe, **Home PC** (cột Nền = lượt 1 Home PC):

  ```powershell
  $env:PERF_BASE = 'C:\workspace\deep-review-1-6-r2\common\perf\perf-ref-r1.json'; $env:PERF_BACKUP = 'C:\workspace\deep-review-1-6-r2\common\load\load-2026-10-12-seed6.p2cbackup'; $env:PERF_OUT = 'C:\workspace\deep-review-1-6-r2\common\perf\perf-ref.json'; $env:PERF_NOTE = 'DESKTOP-KDURKJP, exe 4217ed4, deep review luot 2'; pnpm exec playwright test -c playwright.perf.config.ts
  ```

  Trên laptop thêm bảng so lượt 1: script `node` trong `common\perf\` gọi `parseRun` rồi `markdownTable(r2, r1)` của `e2e/perf/stats.ts` trên `perf-ref.json` và `perf-ref-r1.json` (cùng bảng, cột Nền = lượt 1). Trên Home PC bảng của probe đã là bảng so lượt 1.
- **Mở app lần đầu:** đo theo cách T-227 (`phase-6.md` mục "Mở app lần đầu, đo lại": exe ở thư mục mới chưa có `Project2C-data\`, nối CDP sau 12 s, đọc `p2c:demo-seed`, `p2c:data-open`, LCP), 3 lần. **Laptop:** so `p2c:data-open` với 3 140 ms của T-219, xấu hơn khi trung vị > 3 768 ms. **Home PC:** so LCP ("gọi exe → màn đầu có số liệu") với exe Phase 4 max 3 937 ms của T-227, xấu hơn khi trung vị > 4 724 ms (số tham chiếu cho lượt 2 ghi sẵn ở `phase-6.md`). Không build lại exe Phase 4 (câu 3, §L2.11).
- **Cờ `app.open-data`** (review-notes, Codex F Home PC lượt 1: 279 ms so 188,5 ms, +48 %): probe của bước chuẩn bị là lần đo lại. Home PC: so thẳng với 188,5 ms của `perf-ref` lượt 1 Home PC (cùng máy với cờ). Laptop: lượt 1 272,5 ms, nền 251 ms. Ngưỡng ≤ 600 ms.
- **Bảng hàm thuần trong Node** (gói F đo lại, như §6): `importBackup`, `listAppointments`, `teamCompare` / `reportRows` (tháng / năm), `monthGrid`, `countRecords`, `listTrash` (dữ liệu tải; và Thùng rác 75 / 150 / 300 KH đã xóa), một lệnh ghi + đọc lại đủ bảng, phần AI của hồ sơ KH. **So với số lượt 1 cùng máy** (tổng hợp lượt 1 §7.1 có cột laptop và cột Home PC) theo luật nhiễu trên, ngoài ngưỡng Phase 4.
- Reviewer muốn đo lại trên exe: như §6 (chép `common\exe\project2c.exe` vào thư mục của mình, cổng debug khác 9222, không đo khi bên khác đang đo).

## L2.7 Cấu hình Codex và bài học từ lượt 1

Lượt 2 không có Muse (ADR-0001 phụ lục M7), nên §7 (cấu hình Muse, ACL) và các bài học riêng của Muse ở tổng hợp lượt 1 §10.1 không dùng. Giữ những bài học áp dụng cho Claude / Codex (tổng hợp lượt 1 §10.1 "Cho lượt 2", §11):

| Lượt 1 vướng | Lượt 2 làm |
|---|---|
| Liệt kê / tìm kiếm trên `C:\workspace` (Codex C: `rg --files -g AGENTS.md 'C:\workspace'`), `ls -la` trên `deep-review-1-6\` (Claude E) | Prompt cấm rõ: không liệt kê **và không tìm kiếm** (`rg`, `glob`, `find`, `Get-ChildItem -Recurse`, `dir /s`) trên `C:\workspace`, `deep-review-1-6\`, `deep-review-1-6-r2\`; bước 0 chỉ dùng `Test-Path` với tên file đầy đủ |
| Probe trình duyệt mở `https://chatgpt.com/` (Claude C, 2 lần chạy đầu) | Mọi probe trình duyệt **chặn mạng ngoài `127.0.0.1` và thay `window.open` ngay từ bản đầu** |
| 3 phát hiện sai (đều Muse Home PC): probe gọi thẳng lệnh `db` / chèn SQL thô thay vì đi qua lớp dữ liệu của app; luật đúng cho mọi bên | Kết luận về màn phải dựng probe qua `apps/desktop/src/data` (`openAppData`, `tables`, `useTables` đã sắp theo tên) hoặc chạy trên bản build; probe `db` thô chỉ để kết luận về lệnh |
| `apps/desktop/dist` của `-review-2` còn bản dựng của Codex gói D (`VITE_DEMO_ANCHOR`); phiên sau đọc số bundle từ đó (+10 byte) | Số bundle lấy ở `common\baseline.md`; ai tự `pnpm build:web` thì dựng không biến môi trường riêng, hoặc ghi rõ biến đã dùng. Bước chuẩn bị xóa `apps/desktop/dist` (thư mục build bị ignore) ở cả hai worktree trước khi chạy cổng |

Codex: như lượt 1 (Owner chạy, mỗi gói một phiên mới); báo cáo ghi phiên bản Codex ở mục 1.

## L2.8 Báo cáo lượt 2

Khuôn phát hiện như §10, thêm hai trường và trục R:

```
ID: <bên>2-<gói><số>   (CL2 | CX2; ví dụ CL2-A3, CX2-E1)
Mức: Critical | High | Medium | Low | Nit   (thước §4.3)
Trục: R | E | C | D | G | S | P | B | T | A
Vị trí: path:dòng (4217ed4)
Tình trạng: CONFIRMED | PLAUSIBLE | KNOWN
Liên quan: DR6-xx (nếu có) · mới do đợt sửa (PR #…) | có từ trước, lượt 1 bỏ sót
Kịch bản: số dòng ở mục "Kịch bản mới đã thử" (nếu phát hiện từ đó)
Mô tả / Tái hiện / Ảnh hưởng / Đề xuất: như §10
```

Mỗi báo cáo gói (`<bên>\<gói>.md`, tiếng Việt), theo thứ tự:

1. Đầu: bên, gói, SHA đầu phiên, `git status --short` đầu phiên, giờ bắt đầu; **máy; công cụ, model, mức suy luận** (Codex: phiên bản Codex).
2. **Bảng R** — mọi DR6 mà gói kiểm (§L2.5):

   ```
   | DR6 | Issue → PR | Kết luận (ĐÃ SỬA / SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY) | Bằng chứng (tái hiện lượt 1 nay ra gì; test nào đỏ khi gỡ phần sửa) | Biến thể / ghi chú (ID phát hiện) |
   ```
3. Phạm vi đã đọc (file, dòng; phần diff sửa `8855345..4217ed4` của gói).
4. **Kịch bản mới đã thử** (§L2.4 phần 2): bảng `| # | Kịch bản (các bước, dữ liệu) | Kết quả | ID |`.
5. **Phát hiện mới** theo khuôn trên.
6. **Bloat** và **Hiệu năng** — hai mục riêng (§4.2); hiệu năng có cột so với mốc cùng máy (§L2.6: nền T-219 khi chạy trên laptop; lượt 1 cùng máy) và ngưỡng `phase-6.md`.
7. Bảng đếm mức × trục (gồm R); tỉ lệ PLAUSIBLE nếu cao thì nói rõ.
8. Đã xét, không thấy — theo từng trục, kèm đã chạy / đọc gì.
9. Phụ lục: nguồn probe / test tạm / đột biến; `git status --short` cuối phiên; giờ xong.
10. **Gói F** thêm: **bảng R gộp đủ 59 DR6** (từ báo cáo A–E của chính bên đó + phần F); kết luận **SẴN SÀNG / CHƯA SẴN SÀNG cho v1.0 ở SHA `4217ed4`** kèm lý do (tham khảo; kết luận thật ở T-225).

## L2.9 Chuẩn bị và chạy

**Bước chuẩn bị — Claude, sau khi Owner duyệt kế hoạch lượt 2** (một phiên trên **máy Owner chọn chạy lượt 2**, laptop hoặc Home PC; không review, không ghi phát hiện):

1. Ghi tên máy (`hostname`) vào `common\baseline.md`; mọi bước dưới và cả hai bên chạy trên máy này. Kiểm `main` chưa có code mới: `git diff --name-only 4217ed4 origin/main` chỉ có `docs/**` và `CLAUDE.md` gốc; có file khác → dừng, báo Owner (§2). Kiểm `C:\workspace\deep-review-1-6-r2\` chưa có (có rồi → dừng, báo Owner) và `C:\workspace\deep-review-1-6\common\perf\perf-ref.json` có, trường `note` đúng máy này (§L2.6).
2. Tạo `C:\workspace\deep-review-1-6-r2\{common,claude,codex}`.
3. Hai worktree về SHA ghim: `git -C C:\workspace\Project-2C-review checkout --detach 4217ed4` (tương tự `-review-2`), xóa `apps\desktop\dist` ở mỗi worktree, `pnpm install --frozen-lockfile` (PowerShell); `git status --short` rỗng (ngoài file Codex tự sinh ở `-review-2`, §8).
4. Chép vào `common\`:
   - `plan.md` (file này, bản đã merge);
   - `known.md` (§L2.5: OPEN + ACCEPTED nguyên văn ở SHA ghim, K1–K21, bảng 67 DR6);
   - `fixes.md`: thân 17 Issue #592–#607, #625 (mục tiêu, test chấp nhận) và thân PR sửa (§L2.2: mục "Lệch so với Issue", "Chưa làm") bằng `gh issue view` / `gh pr view --json body`, để hai bên có cùng thông tin mà không chạy `gh` (prompt cấm);
   - `prompt-<bên>.md` = Phụ lục E / F, mỗi file nối thêm nguyên văn Phụ lục H.
5. Dữ liệu tải: `node tools/load-data.mjs --out C:\workspace\deep-review-1-6-r2\common\load\load-2026-10-12-seed6.p2cbackup`; hash `tables` phải bằng §L2.6.
6. Cổng ở SHA ghim (trong `Project-2C-review`): `pnpm verify`, `pnpm verify:rust`, `pnpm e2e` (`CI=1`), `pnpm build:exe`, `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` (số dòng phải trùng §L2.3) → `common\baseline.md`; chép exe vào `common\exe\`. Ghi thêm thời gian build release (so DR6-13 khi chạy trên laptop, §L2.4).
7. Probe (cần Owner: nhập dữ liệu tải trong exe theo `e2e/perf/README.md` bước 3, rồi không dùng máy ≈ 5 phút): chép `perf-ref.json` lượt 1 của máy này thành `common\perf\perf-ref-r1.json`, rồi chạy lệnh probe **đúng máy** ở §L2.6 → `common\perf\perf-ref.json`. Vào `baseline.md`: laptop — hai bảng (so nền T-219, so lượt 1 laptop); Home PC — bảng so lượt 1 Home PC (không so T-219). Cả hai máy ghi thêm cột ngưỡng `phase-6.md`. Mở lần đầu 3 lần, so mốc đúng máy (§L2.6: laptop — T-219; Home PC — T-227) → `baseline.md`.
8. Báo Owner: sẵn sàng chạy lượt 2 (tên máy).

**Owner chạy:** như bảng §9 phần đợt 1 (Claude và Codex cùng lúc), với thư mục `deep-review-1-6-r2` và file prompt lượt 2. Không có đợt 2, không ACL, không phiên thử Muse.

Thư mục kết quả lượt 2 của bên kia: prompt cấm mở (quy tắc riêng 1 ở Phụ lục E, F), kiểm lại bằng log phiên (§L2.10). Thư mục lượt 1 `C:\workspace\deep-review-1-6\`: báo cáo trong đó đã công khai ở `docs/reviews/raw/2026-10-15/` (cả `home-pc/`). Prompt chỉ cho mỗi bên mở thư mục lượt 1 của **chính mình** (dùng lại probe).

**Tin nhắn mở phiên** — như §9.1, chỉ đổi chữ gói:

```text
Gói A. Đọc và làm đúng C:\workspace\deep-review-1-6-r2\common\prompt-claude.md
```

```text
Gói A. Đọc và làm đúng C:\workspace\deep-review-1-6-r2\common\prompt-codex.md
```

Bảng đánh dấu của Owner (12 ô):

| Bên | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| Claude | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Codex | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

## L2.10 Sau lượt 2, kiểm độc lập, ước lượng

**Tổng hợp (T-225 #565, khi Owner yêu cầu):** đọc đủ 12 báo cáo; **gộp hai bảng R thành một bảng đủ 59 DR6**, kiểm trên code ở SHA ghim từng kết luận khác ĐÃ SỬA và mọi chỗ các bên chấm khác nhau; kiểm mọi phát hiện mới (đúng / KNOWN / sai / lệch mức), gộp trùng (đề xuất đánh số tiếp `DR6-68…`); so số đo với mốc cùng máy (§L2.6); đề xuất nhóm sửa và câu hỏi cho Owner; kết luận SẴN SÀNG / CHƯA SẴN SÀNG cho G7.

**Kiểm độc lập bằng log phiên** như §8, cho cả hai bên, thêm vào danh sách quét: đường dẫn `deep-review-1-6-r2[\\/](claude|codex)` của bên kia; `deep-review-1-6[\\/](claude|codex|muse)` không phải của chính bên đó; liệt kê **hoặc tìm kiếm** (`rg`, `glob`, `find`, `Get-ChildItem -Recurse`) trên `C:\workspace`, `deep-review-1-6\`, `deep-review-1-6-r2\`. Lượt 2 không có ACL nên đây là lớp kiểm chính cho việc đọc chéo; có kết quả thì xử như §8 (đánh dấu "nhiễm", phiên tổng hợp xét riêng).

**Báo cáo gốc lưu ở repo** (PR docs của T-225): `docs/reviews/raw/<ngày tổng hợp>/{claude,codex}/<gói>.md` nguyên văn, `common-plan.md` (chỉ khi khác bản trong repo), `common-known.md`, `common-baseline.md`, `common-fixes.md`; tổng hợp `docs/reviews/<ngày>-deep-review-phase-1-6-luot-2-tong-hop.md`. Thư mục bằng chứng `deep-review-1-6-r2\` giữ trên máy chạy lượt 2 tới v1.0.

**Ước lượng** (lượt 1 trên laptop: Claude 09:43 → 19:41, Codex 09:50 → 21:47 song song): cùng phạm vi cộng bảng R ≈ 59 dòng và mục kịch bản mới, nên mỗi bên ≈ như lượt 1 hoặc dài hơn ≈ 10–20 %. Một đợt ≈ một ngày làm việc (≈ 10–14 giờ, Codex là bên dài hơn); tổng hợp đọc 12 báo cáo thay vì 18 nên ngắn hơn lượt 1. Cả lượt 2 ≈ 1–1,5 ngày tính cả chuẩn bị và tổng hợp (bản soạn đầu với Muse: ≈ 1,5 ngày). Home PC mạnh hơn laptop nên có thể nhanh hơn; thời gian bộ tham khảo Home PC của lượt 1 không lấy làm ước lượng (A–E và F chạy ở hai tối khác nhau). Owner can thiệp: mở 12 phiên (6 Claude, 6 Codex), ≈ 5 phút rảnh máy cho probe, ghi giờ bắt đầu / xong mỗi gói.

## L2.11 Quyết định của Owner (17/10/2026)

Bản soạn đầu có 5 câu hỏi (máy; hai đợt; mốc mở app lần đầu; Muse Code trục trặc; đọc báo cáo lượt 1). Owner trả lời 17/10/2026 (PR #647); các mục trên đã sửa theo, ghi ở ADR-0001 phụ lục M7 và `docs/PROJECT-STATE.md`:

1. **Máy:** "không quan trọng chạy máy nào, miễn đủ số lượt". Chạy một bộ trên laptop hoặc Home PC; số đo chỉ so với mốc **cùng máy**: laptop — nền T-219 và `perf-ref` lượt 1 của laptop; Home PC — `perf-ref` lượt 1 của Home PC và ngưỡng `phase-6.md`, không so nền T-219 (§L2.2, §L2.6, §L2.9).
2. **Bên review:** "Bỏ Muse, chỉ dùng Claude và Codex" → 12 báo cáo, **một đợt** (hai bên song song), không ACL, không phiên thử Muse, không Phụ lục G (§L2.1, §L2.2, §L2.7, §L2.9).
3. **Mở app lần đầu:** theo đề xuất — không build lại exe Phase 4. Mốc theo máy (câu 1): laptop so `p2c:data-open` lần đầu của T-219 (3 140 ms); Home PC so LCP với exe Phase 4 của T-227 (3 937 ms) (§L2.6).
4. **Muse Code trục trặc giữa gói:** "Bỏ Muse" — câu hỏi không còn.
5. **Đọc báo cáo lượt 1:** theo đề xuất — mọi bên được đọc tổng hợp lượt 1 và báo cáo gốc lượt 1 của **cả ba bên** lượt 1 (Claude, Codex, Muse; hai máy) trong repo (`docs/reviews/raw/2026-10-15/`, đã công khai), để biết lượt 1 đã thử gì và chọn kịch bản mới; cấm đọc báo cáo **lượt 2** của bên kia (như review lại Phase 5).

## Phụ lục E — Prompt Claude (lượt 2)

File `common\prompt-claude.md` = đoạn dưới + nguyên văn Phụ lục H. Owner mở **phiên mới** ở `C:\workspace\Project-2C-review` cho mỗi gói và dán tin nhắn ở §L2.9.

> # Deep review Phase 1–6, lượt 2 — Claude
>
> **{GÓI}** = chữ gói (A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer Claude** của deep review Phase 1–6, **lượt 2**, **gói `{GÓI}`**: phiên sạch, chỉ đọc. Repo: worktree `C:\workspace\Project-2C-review`, detached ở SHA **`4217ed4`** (`4217ed4cd3300af1d63aa61db9eb13902fe75f16`). Chạy `git rev-parse HEAD` và `git status --short` trước; SHA lệch hay status không rỗng thì dừng và báo Owner.
>
> Quy tắc riêng của Claude:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6-r2\codex\`, `C:\workspace\deep-review-1-6\codex\`, `C:\workspace\deep-review-1-6\muse\`**, kể cả khi Owner hay file nào gợi ý. Không liệt kê và không tìm kiếm (`rg`, `glob`, `find`, `ls -R`) trên `C:\workspace\`, `deep-review-1-6\`, `deep-review-1-6-r2\`. Không đọc báo cáo lượt 2 của bên khác ở bất cứ đâu. Lỡ thấy thì dừng và báo Owner.
> 2. Chỉ đọc: repo ở SHA trên (gồm báo cáo gốc lượt 1 của Claude, Codex, Muse, hai máy, ở `docs/reviews/raw/2026-10-15/`), `C:\workspace\deep-review-1-6-r2\common\`, báo cáo Claude lượt 2 các gói trước trong `…-r2\claude\` (mục đã báo ở gói trước thì chỉ dẫn ID), và probe lượt 1 của chính Claude trên máy này trong `C:\workspace\deep-review-1-6\claude\` (để chạy lại tái hiện; probe của máy kia lấy ở phụ lục báo cáo gốc).
> 3. Không subagent / Agent tool, không skill `review-pr` / `code-review`; không làm nghi thức phiên của repo (HANDOFF, `/handoff`, PR, Issue, merge, commit). Không chạy `gh` (thông tin Issue / PR sửa có ở `common\fixes.md`).
> 4. Ghi báo cáo vào `C:\workspace\deep-review-1-6-r2\claude\{GÓI}.md`, probe / bản chép / log vào `…-r2\claude\{GÓI}\`.
> 5. Gói F được đọc `…-r2\claude\A…E.md`. Xong gói nào thì dừng và in dòng `XONG …` (bước 0 phần chung); xong F thì **chờ Owner yêu cầu** tổng hợp, không tự tổng hợp.
>
> Phần chung dưới đây áp dụng đầy đủ.

## Phụ lục F — Prompt Codex (lượt 2)

File `common\prompt-codex.md` = đoạn dưới + nguyên văn Phụ lục H. Owner chạy Codex ở `C:\workspace\Project-2C-review-2`, **mỗi gói một phiên mới**, lần lượt A → F.

> # Deep review Phase 1–6, lượt 2 — Codex
>
> **{GÓI}** = chữ gói (một chữ A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer độc lập Codex** của deep review Phase 1–6, **lượt 2**, gói `{GÓI}`. Repo: worktree `C:\workspace\Project-2C-review-2`, detached ở SHA **`4217ed4`** (`4217ed4cd3300af1d63aa61db9eb13902fe75f16`). Chạy `git rev-parse HEAD` và `git status --short` trước; SHA lệch thì dừng và báo Owner.
>
> Về file quy tắc của repo (`CLAUDE.md`): đó là quy trình phát triển của Claude. Dùng để hiểu dự án, **không** làm nghi thức phiên (`/session-start`, HANDOFF, hook, skill, PR, Issue, merge, commit). Codex tham gia review đóng phase theo ADR-0001 phụ lục M2: chỉ đọc, không viết code.
>
> Quy tắc riêng của Codex:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6-r2\claude\`, `C:\workspace\deep-review-1-6\claude\`, `C:\workspace\deep-review-1-6\muse\`**, kể cả khi file hay ai đó gợi ý. Không liệt kê và không tìm kiếm (`rg --files`, `rg -g`, `Get-ChildItem -Recurse`, `dir /s`) trên `C:\workspace\`, `deep-review-1-6\`, `deep-review-1-6-r2\` — lượt 1 có một lần `rg --files -g AGENTS.md 'C:\workspace'`, không lặp lại. Không đọc báo cáo lượt 2 của bên khác. Lỡ thấy thì dừng và báo Owner.
> 2. Chỉ đọc: repo ở SHA trên (gồm báo cáo gốc lượt 1 của Claude, Codex, Muse, hai máy, ở `docs/reviews/raw/2026-10-15/`), `C:\workspace\deep-review-1-6-r2\common\`, báo cáo của chính bạn trong `…-r2\codex\`, và probe lượt 1 của chính Codex trên máy này trong `C:\workspace\deep-review-1-6\codex\` (probe của máy kia lấy ở phụ lục báo cáo gốc).
> 3. Ghi báo cáo vào `C:\workspace\deep-review-1-6-r2\codex\{GÓI}.md`, probe / bản chép / log vào `…-r2\codex\{GÓI}\`.
> 4. Gói F được đọc `…-r2\codex\A…E.md`. Không tổng hợp với báo cáo nào khác, không tạo Issue, không đề xuất merge, không chạy `gh` (thông tin Issue / PR sửa có ở `common\fixes.md`).
>
> Phần chung dưới đây áp dụng đầy đủ.

## Phụ lục H — Phần chung của mọi prompt (lượt 2)

Nối nguyên văn vào cuối cả hai file `prompt-<bên>.md` của lượt 2. `<bên>` = thư mục kết quả của bên đó (`claude`, `codex`), `<ID>` = `CL2`, `CX2`. (Lượt 2 không có Phụ lục G: prompt Muse bỏ theo ADR-0001 phụ lục M7; chữ H giữ để khỏi đổi tham chiếu.)

> ## Phần chung
>
> ### Bước 0 — kiểm gói, trước khi đọc code
>
> Như lượt 1, với thư mục `C:\workspace\deep-review-1-6-r2\<bên>\`. Kiểm từng file bằng tên đầy đủ (`Test-Path` hoặc mở file); **không liệt kê, không tìm kiếm thư mục**:
>
> 1. `{GÓI}` phải là **đúng một chữ** trong A, B, C, D, E, F. Không phải → dừng, hỏi Owner.
> 2. `C:\workspace\deep-review-1-6-r2\<bên>\{GÓI}.md`: **chưa có** → làm mới; có và **dòng đầu bắt đầu bằng `ĐANG LÀM`** → phiên trước bị cắt: **làm tiếp** (đọc hết file và thư mục `<bên>\{GÓI}\`, giữ mọi phát hiện đã ghi, làm nốt; ghi rõ là phiên làm tiếp, từ đâu, bằng công cụ / model / mức nào); có mà dòng đầu **không** bắt đầu bằng `ĐANG LÀM` → gói đã xong: dừng, hỏi Owner, không ghi đè.
> 3. Báo cáo lượt 2 các gói **trước** `{GÓI}` (thứ tự A → F) đã có đủ trong `…-r2\<bên>\` và không file nào còn dòng đầu `ĐANG LÀM`. Thiếu hay còn dở → dừng, báo Owner tên gói.
> 4. Đủ cả ba thì in đúng một dòng rồi làm tiếp, không chờ Owner: `Bắt đầu gói {GÓI} lượt 2 (<tên gói>) → <bên>\{GÓI}.md` (làm tiếp thì thêm `— làm tiếp phiên trước`).
>
> **Ghi báo cáo dần:** ngay sau bước 0, tạo `<bên>\{GÓI}.md` với dòng đầu `ĐANG LÀM — <bên> gói {GÓI} lượt 2, bắt đầu <giờ>` và mục 1 của báo cáo. Mỗi khi có dòng bảng R, kịch bản đã thử, phát hiện hay số đo thì **ghi ngay**. Chạy lệnh dài ở nền thì ghi vào file đang chờ gì trước khi chờ.
>
> Cuối phiên, khi báo cáo đủ các mục: đổi dòng đầu thành `XONG — <bên> gói {GÓI} lượt 2, <giờ xong>`, rồi in đúng một dòng: `XONG gói {GÓI} lượt 2 → C:\workspace\deep-review-1-6-r2\<bên>\{GÓI}.md. Gói kế tiếp: <chữ kế tiếp> (mở phiên mới).` Gói F in: `XONG cả 6 gói lượt 2 của <bên>. Chờ Owner yêu cầu tổng hợp.`
>
> ### Dự án và lượt này
>
> Project-2C: app desktop Tauri 2 + React, SQLite chạy trong webview qua sql.js, Rust chỉ ghi file / giữ API key / gọi OpenCode; chạy offline, một người dùng, dữ liệu hiện là **giả lập**. Phase 1–4: nhân sự / team, khách hàng N4–N1, KYC có cấu trúc, lịch hẹn và kết quả, hợp đồng, chỉ số và báo cáo, xuất Excel, backup. Phase 5: AI copilot (`packages/ai`). Phase 6: hàng đợi thay dữ liệu S-2, Thùng rác + khôi phục, hộp Xóa KH 5f.
>
> **Lượt 1** (SHA `8855345`, 14–15/10) tìm 67 vấn đề `DR6-01…67` (2 Medium, 48 Low, 17 Nit), kết luận CHƯA SẴN SÀNG. Owner chọn sửa hết trừ phần hoãn; 16 Issue sửa đã merge (diff `8855345..4217ed4`). **Lượt 2 có hai phần ngang nhau, cả hai bắt buộc:**
>
> 1. **Kiểm phần đã sửa (trục R):** mỗi DR6 mà gói kiểm (`common\known.md` phần 3, cột "Gói kiểm") một dòng bảng R: chạy lại tái hiện của lượt 1; gỡ tạm phần sửa (trên bản chép, hoặc patch gỡ ngay) xem test của PR sửa có đỏ; thử biến thể gần. Kết luận: **ĐÃ SỬA** (đường lỗi lượt 1 đã hết, có test đỏ khi gỡ sửa; biến thể còn hở ghi thành phát hiện riêng) · **SỬA MỘT PHẦN** (một phần của mô tả DR6, Issue sửa hay quyết định Owner chưa làm) · **CHƯA SỬA** · **HỒI QUY** (phần sửa làm hỏng chỗ trước đó đúng). Ba kết luận sau kèm phát hiện có trường "Liên quan: DR6-xx". Mục Owner chọn ghi lệch đã biết (DR6-29 ô Kỳ, 36, 47, 48, 54): kiểm dòng ghi có và khớp app. Thêm: số đo không xấu hơn mốc cùng máy (`common\baseline.md`), DR6-44 / DR6-13 nhanh hơn như PR nói mà hành vi không đổi.
> 2. **Tìm lỗi mới và edge case mới** trên **toàn bộ** phạm vi gói, không chỉ quanh chỗ đã sửa. Ưu tiên lỗi do chính đợt sửa gây ra, rồi kịch bản / biên **chưa có trong báo cáo lượt 1** (đọc `docs/reviews/raw/2026-10-15/` và tổng hợp lượt 1 để biết lượt 1 đã thử gì). Báo cáo có mục **"Kịch bản mới đã thử"**: mỗi kịch bản một dòng, kể cả khi không thấy lỗi; mỗi gói nên có ít nhất 5, gói F ít nhất 5 chuỗi nhiều bước qua nhiều gói. Chỗ lượt 1 ghi "đã xét, không thấy" vẫn đáng xét lại.
>
> Thông tin từng Issue / PR sửa (mục tiêu, test chấp nhận, phần PR ghi lệch / chưa làm): `common\fixes.md`; diff một PR: `git show <commit>` (bảng commit ở `plan.md` §L2.2).
>
> ### Kế hoạch và phạm vi gói
>
> Kế hoạch đầy đủ: `C:\workspace\deep-review-1-6-r2\common\plan.md` — lượt 2 ở §L2.1–§L2.11; trục và thước mức ở §4; định dạng ở §L2.8. Phạm vi gói như lượt 1 (luật xếp gói của `tools/size-report-core.mjs`; đọc thêm chỗ code gói khác mà gói nối vào):
>
> | Gói | Đường dẫn | SP / test ở `4217ed4` | DR6 kiểm (R) | Trọng tâm mới (phần 2) |
> |---|---|---|---|---|
> | A. Lõi dữ liệu | `packages/domain/**`, `packages/db/**` | 7 867 / 12 807 | 01–05, 44, 49–52, 54, 59 | Luật "nhóm của KH tại ngày cuộc hẹn" ở mọi lệnh ghi / sửa / xóa / khôi phục cuộc gặp, chuyển tay lùi ngày và luật nhập backup (E18–E20); bàn giao chuyển lịch Dự kiến trong transaction (lịch Dời lịch, KH / RE đã xóa, bàn giao hai lần); hàm chữ chung `domain/text.ts` ở lệnh ↔ nhập backup; migration `0009`, `0010` trên DB cũ có dữ liệu; `quick_check` ở `database.ts`; test mới của #644 có đỏ khi code sai |
> | B. File và Rust | `apps/desktop/src-tauri/**`, `apps/desktop/src/data/**` trừ file AI | 2 162 / 4 433 | 06–14, 60 | Chặn DB hỏng lúc mở, mã lỗi file bị giữ / không ghi được / đĩa đầy, dọn `.tmp`; `openFrom` sau migrate; key hai lớp (giới hạn số lượt giải, dạng lồng khác), tên model; quyền / CSP mới (thử tay đóng cửa sổ, mở link ngoài, xuất / mở thư mục); phiên bản 1.0.0 ở mọi chỗ; `cargo clippy -W clippy::pedantic` so lượt 1 |
> | C. AI | `packages/ai/**`; file AI của app (`ai-*`, `*-ai-*`, `*Ai.tsx`, `KycExtraction`, `KycIntelligence`, `KycWebSession`, `KycHistory`, `extraction-view`) | 5 250 / 6 110 | 15, 16, 18–22, 61 | Phiên ChatGPT web theo `generation` (mở trước / sau / trong lúc thay dữ liệu, `webChip`); V1 đếm sau khi bỏ `\p{Cf}` và `LAW_NAME` mọi kiểu chữ so chữ G5; version prompt của seed; Mock trích xuất (chủ thể, phủ định, câu ghép); STALE ≥ AA ở mọi khối mờ; focus sau Hủy / Thử lại |
> | D. Màn nhập liệu | `packages/ui/**` (trừ `scripts/`), `apps/desktop/src/{shell,i18n}/**`, `routes/customers/**` (trừ file AI và Hợp đồng), `routes/team/**`, `routes/Screen.tsx`, `apps/desktop/src/*`, `apps/desktop/index.html` | 7 196 / 2 023 | 02, 26–36, 62 | Đọc lại tiền KYC (`parseVnd` hiểu / không hiểu), mã F ở 7d / 7c, dòng thời gian RF / thay đổi quan trọng, 3 cột ở 1 440 và 1 100; hộp 5c nói số lịch Dự kiến chuyển; 9b người đánh giá; KH ngoài góc nhìn; focus `h1` + `document.title` khi đổi màn; chặn Back / Forward (phím, chuột 4 / 5) trên exe |
> | E. Lịch hẹn, chỉ số, quản lý | `routes/{appointments,overview,reports}/**`, `routes/{Overview,Settings*,RestoreDialog,FilterBar}.tsx` (trừ `SettingsAi.tsx`), `routes/{trash-view,period-labels,applied-filter}.ts`, Hợp đồng (`routes/customers/{CustomerPolicies,PolicyDialogs,policy-form}.*`) | 7 374 / 3 843 | 01, 02, 04, 38–48, 63 | 6c / 6f lấy nhóm tại ngày gặp, khóa ô nhóm; "Hẹn tiếp" theo RE hiện tại; ngày điền sẵn qua giao thừa / nửa đêm; case size; FYP và ảnh hưởng hai tháng; Thùng rác (sắp, `aria-*`, sang ngày, khôi phục E18–E20 trên màn); một thông báo ở Cài đặt → Dữ liệu; số Tổng quan ↔ Báo cáo ↔ Excel theo RE sau bàn giao |
> | F. Xuyên gói, bloat / hiệu năng, công cụ | `tools/**`, `e2e/**`, `.github/**`, `.githooks/**`, `.claude/**`, `packages/ui/scripts/`, `apps/desktop/vite.config.ts`, file gốc repo; **luồng xuyên gói; toàn codebase cho bloat và hiệu năng** | 3 939 / 12 417 | 44 (đo), 55–58, 64, 65; **bảng R gộp đủ 59 DR6** | Cổng merge "tested base" (`pr-core.mjs`, `pr-status.mjs`, `merge-pr.mjs`), file PR qua REST phân trang; script eval (key, `finish_reason`); `retro.mjs`; chuỗi nhiều bước mới qua nhiều gói (vd. bàn giao → ghi kết quả → xóa / khôi phục → xuất / nhập backup → chỉ số theo RE; mở `Project2C-data\` do exe lượt 1 tạo bằng exe lượt 2); bảng hàm thuần đo lại so lượt 1; bloat / bundle / exe so nền; kết luận SẴN SÀNG / CHƯA SẴN SÀNG |
>
> ### Đọc trước
>
> Như lượt 1: `CLAUDE.md` (gốc + của package trong gói), `CONTEXT.md`, `docs/design/phase-6-hoan-thien.md` (§4 S-2, Thùng rác — nay có E18–E20 ở TR-3; §5 ngưỡng), spec / golden / mockup theo gói (A — `phase-3-du-lieu.md` §4, §6, `phase-4-chi-so.md`, `docs/golden/{chi-so,kh-theo-nhom,kyc,lich-hen}.md`, ADR-0007, ADR-0008; B — ADR-0016, ADR-0009 phụ lục D-1, spec Phase 6 §4.1; C — `phase-5-ai.md`, `phase-5-prompts.md`, `docs/golden/ai-eval.md`, ADR-0009; D / E — `docs/design/mockups/` và spec Phase 3 / 4 / 6, mục "Lệch mockup đã biết" của `docs/testing/nghiem-thu-v1.md`; F — tất cả khi cần, `docs/metrics/phase-6.md`, `e2e/perf/README.md`). Thêm cho lượt 2: tổng hợp lượt 1 `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` (§3–§5 mô tả DR6, §7 số đo, §9 quyết định Owner), `common\known.md`, `common\fixes.md`, `common\baseline.md`. **Spec, golden, mockup đã duyệt là nguồn đúng**: không đề xuất sửa chúng cho khớp code; chỗ chúng mâu thuẫn nhau thì báo là phát hiện trục C.
>
> ### Quy tắc chung
>
> 1. **Chỉ đọc và chạy lệnh: không sửa file trong repo, không sửa lỗi, không commit, không viết code sản phẩm.** Muốn thử "phá code" (đột biến, gỡ phần sửa) thì chép file vào thư mục kết quả của mình rồi chạy bản chép; nếu buộc phải patch trong repo (Claude, Codex) thì gỡ ngay sau khi chạy và kiểm lại bằng `git status` / sha256. Cuối phiên `git status --short` của repo phải như đầu phiên (thư mục build / cache bị ignore thì không sao).
> 2. **Không gọi dịch vụ AI của sản phẩm:** không `pnpm eval:ai` / `node tools/eval-ai.mjs`, không bấm "Kiểm tra kết nối" bằng key thật, không đọc / in key trong Windows Credential Manager (`cmdkey`…), không mở chatgpt.com. Dùng adapter Mock, `fetch` / HTTP giả, hoặc server HTTP local tự dựng trong thư mục của mình. **Mọi probe trình duyệt chặn mạng ngoài `127.0.0.1` và thay `window.open` ngay từ lần chạy đầu.**
> 3. `pnpm e2e` dùng cổng cố định 4173: không chạy cùng lúc với bên khác; báo cổng bận thì chờ, **không** dùng `PW_REUSE=1`. Kết quả cổng ở SHA ghim đã có ở `common\baseline.md`, không bắt buộc chạy lại toàn bộ. Số bundle lấy ở `baseline.md`; tự `pnpm build:web` thì không đặt biến môi trường riêng (vd. `VITE_DEMO_ANCHOR`), hoặc ghi rõ đã đặt gì.
> 4. Môi trường Windows: `pnpm` lỗi trong shell hiện tại thì chạy qua `powershell -NoProfile -Command "pnpm …"`. Không dùng `python3` (stub, có thể treo). Script tạm viết bằng `node` (`.mjs` trong thư mục của mình).
> 5. Mục có trong `common\known.md` (sổ OPEN / ACCEPTED, quyết định Owner K1–K21, 8 DR6 hoãn / chấp nhận) gắn `KNOWN`, chỉ nêu khi có bằng chứng mới. 59 DR6 có Issue sửa chỉ ghi ở bảng R, không ghi lại thành phát hiện; phần sửa còn thiếu / hồi quy thì ghi phát hiện mới "Liên quan: DR6-xx".
> 6. **Kết luận về màn** dựng probe qua lớp dữ liệu của app (`apps/desktop/src/data`: `openAppData`, `tables`; hoặc chạy trên bản build), không gọi thẳng lệnh `db` / chèn SQL thô — lượt 1 có 3 phát hiện sai vì vậy. Probe `db` thô chỉ để kết luận về lệnh.
>
> ### Cách tìm
>
> - Đọc sâu **từng file** trong phạm vi gói (phần diff sửa đọc kỹ nhất). Đi qua **mọi trục**: R kiểm phần đã sửa · E edge case · C đúng hợp đồng / spec / mockup / nhãn UI theo nghĩa thường · D dữ liệu · G guardrail AI · S an toàn ở ranh giới · P hiệu năng · B bloat · T chất lượng test · A trợ năng / i18n (định nghĩa ở `plan.md` §4.1, §L2.4). Trục không có gì thì ghi "đã xét, không thấy" **kèm đã chạy / đọc gì**.
> - **Chạy thử thay vì lập luận từ spec** ở mọi chỗ chạy được. Ưu tiên **kịch bản nhiều bước qua nhiều gói**: hai lỗi Medium của lượt 1 (khôi phục cuộc gặp giữ nhóm sau khi KH đổi nhóm; bàn giao KH để lịch ở RE cũ) đều chỉ lộ khi dựng chuỗi xóa → đổi → khôi phục, bàn giao → ghi kết quả → hẹn tiếp → chỉ số. Đừng báo lại chính các ca đó (đã sửa, nằm ở bảng R) — dùng chúng làm mẫu để nghĩ ca mới.
> - **Bloat và Hiệu năng là hai mục riêng bắt buộc** (kể cả khi không có phát hiện), mỗi mục một bảng: đã chạy / đo gì, trên dữ liệu nào, số, ID phát hiện. Công cụ như lượt 1 (`tsc --noUnusedLocals --noUnusedParameters`, `rg`, `pnpm codemap`, `pnpm lint:deps`, `pnpm build:web`…). Hiệu năng: **mọi phát hiện P phải có số đo** trên dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (sinh lại ở SHA lượt 2; hash ở `plan.md` §L2.6; dùng trong Node qua `importBackup` của `@p2c/db`, trong app qua Cài đặt → Dữ liệu → Nhập backup); so với ngưỡng `docs/metrics/phase-6.md` và với mốc **cùng máy** (`plan.md` §L2.6: lượt 1 cùng máy `common\perf\perf-ref-r1.json` và số lượt 1 ở tổng hợp lượt 1 §7.1; nền T-219 chỉ khi chạy trên laptop; luật nhiễu: quá 20 % **và** quá 10 ms). Máy chạy ghi ở `common\baseline.md`. Ghi máy và việc gì đang chạy song song. Đo trên exe: chép `common\exe\project2c.exe` vào thư mục của mình, cổng debug khác 9222, theo `e2e/perf/README.md`; không đo khi bên khác đang đo.
> - **Không cài công cụ mới** (`knip`, `jscpd`, `cargo-bloat`, visualizer… là G4); thấy cần thì ghi đề xuất.
> - Không bình luận phong cách / đặt tên trừ khi gây lỗi. Không đặt chỉ tiêu số lượng phát hiện; không nâng mức cho nổi.
>
> ### Khuôn phát hiện
>
> ```
> ID: <ID>-<gói><số>   (vd. <ID>-A3)
> Mức: Critical | High | Medium | Low | Nit
> Trục: R | E | C | D | G | S | P | B | T | A
> Vị trí: path:dòng (4217ed4)
> Tình trạng: CONFIRMED | PLAUSIBLE | KNOWN
> Liên quan: DR6-xx (nếu có) · mới do đợt sửa (PR #…) | có từ trước, lượt 1 bỏ sót
> Kịch bản: số dòng ở mục "Kịch bản mới đã thử" (nếu có)
> Mô tả: một-hai câu
> Tái hiện / bằng chứng: lệnh + kết quả, hoặc probe / test tạm (nguồn ở phụ lục)
> Ảnh hưởng: ai / khi nào gặp
> Đề xuất: hướng sửa ngắn; cỡ ước lượng (≤ 400 dòng SP?)
> ```
>
> - **Thước mức** (như lượt 1): Critical = mất dữ liệu đã lưu, hỏng file DB, lộ API key, chạy được code lạ — ở thao tác bình thường. High = thao tác bình thường làm dữ liệu sai lặng lẽ (lan sang chỉ số / báo cáo / backup mà người dùng không nhận ra) hoặc chặn hẳn việc chính không có đường vòng. Medium = thao tác bình thường dẫn tới dữ liệu sai / không đảo ngược được hoặc chặn việc chính (có đường vòng); thao tác chính vượt ngưỡng hiệu năng đã chốt. Low = cần điều kiện hiếm (file sửa tay, output suy biến, server bất thường, thao tác UI không cho), chỉ sai hiển thị, test hở, bloat có chi phí đo được. Nit = chữ, dọn dẹp, bloat không đo được chi phí.
> - **Bằng chứng phải thật.** Mỗi `path:dòng` phải đúng với file ở SHA ghim (đọc lại trước khi ghi). `CONFIRMED` chỉ khi đã chạy lệnh / probe và dán lệnh + trích kết quả thật; chưa chạy thì `PLAUSIBLE` và nói đã đọc gì. Không bịa số đo, tên hàm, tên test hay kết quả lệnh.
>
> ### Báo cáo
>
> File `C:\workspace\deep-review-1-6-r2\<bên>\<gói>.md`, tiếng Việt, gồm theo thứ tự: (1) bên, gói, SHA đầu phiên, `git status --short` đầu phiên, giờ bắt đầu, công cụ / model / mức suy luận; (2) **bảng R** mọi DR6 mà gói kiểm (`| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |`); (3) phạm vi đã đọc (file, dòng; phần diff sửa của gói); (4) **Kịch bản mới đã thử** (`| # | Kịch bản | Kết quả | ID |`); (5) phát hiện mới theo khuôn trên; (6) mục **Bloat** và mục **Hiệu năng** (bảng số, so nền và lượt 1); (7) bảng đếm mức × trục, nói rõ nếu tỉ lệ PLAUSIBLE cao; (8) "đã xét, không thấy" theo từng trục; (9) phụ lục nguồn probe / test tạm / đột biến (cái nào bị test giết, cái nào sống), `git status --short` cuối phiên, giờ xong. **Gói F** thêm **bảng R gộp đủ 59 DR6** (từ báo cáo A–E lượt 2 của chính bạn + phần F) và kết luận **SẴN SÀNG / CHƯA SẴN SÀNG cho v1.0 ở SHA `4217ed4`** kèm lý do.
>
> Xong gói thì dừng và in dòng `XONG …` (Bước 0). Không tổng hợp, không so với bên khác, không tạo Issue, không đề xuất merge.

# Lượt 3

Kế hoạch lượt 3 (T-266 #713), soạn 19/10/2026 trên Home PC, sau khi mọi Issue sửa lượt 2 đã đóng. Owner thêm lượt này ngay trước G7 (ADR-0001 phụ lục M9, §L3.11). Mục nào không nói khác thì giữ như lượt 2 (§L2.1–§L2.11, Phụ lục E, F, H), và qua đó như lượt 1.

| Yêu cầu của #713 | Mục |
|---|---|
| 1. SHA ghim lượt 3 = `main` sau khi mọi Issue sửa lượt 2 đóng | §L3.2 |
| 2. Prompt hai phần: kiểm phần đã sửa + tìm lỗi / edge case mới | §L3.4, Phụ lục I, J, K |
| 3. KNOWN lượt 3; bảng R khớp tổng hợp lượt 2 | §L3.5 |
| 4. Lệnh so số đo với mốc Home PC sau #656 | §L3.6 |
| 5. Cách chạy Workflow cho phần Claude; kiểm độc lập bằng log của subagent | §L3.7, §L3.9, §L3.10, Phụ lục I |

## L3.1 Mục tiêu, bên review

Owner chốt 19/10/2026 (§L3.11):

- **Hai bên Claude, Codex** → 6 gói × 2 bên = **12 báo cáo**, một đợt (hai bên song song), như lượt 2.
- **Hai phần ngang nhau** như lượt 2: (1) **kiểm phần đã sửa** (trục R) — 39 DR6 sửa ở đợt sửa lượt 2 (§L3.5); (2) **tìm lỗi mới và edge case mới** trên **toàn bộ** phạm vi gói.
- **Phần Claude chạy bằng Workflow** (ADR-0001 M8, M9). Owner mở một phiên ở `C:\workspace\Project-2C-review` và chạy script ở Phụ lục I. Script gọi 6 subagent tuần tự A → F, mỗi gói một context sạch. Mỗi subagent nhận cùng tin nhắn giao việc như một phiên sạch của lượt 2 (đổi thư mục), nên mỗi gói vẫn là một lần review độc lập.
- **Sửa 20/10/2026 (Owner, trước khi chạy): phần Claude chạy như lượt 2.**
  - Owner mở **mỗi gói một phiên sạch** ở `C:\workspace\Project-2C-review`, tin nhắn một dòng `Gói X. Đọc và làm đúng C:\workspace\deep-review-1-6-r3\common\prompt-claude.md`.
  - Mức suy luận và ultracode do Owner chọn từng phiên. Bật ultracode thì phiên chính được dùng subagent / Workflow cho việc của gói, chỉ phiên chính làm bước 0 và ghi `{GÓI}.md`. Lượt 3 chỉ gói A bật.
  - Không có phiên điều phối, không chạy `workflow-claude.mjs`.
  - `prompt-claude.md` sửa theo. Bản đã dùng ở `docs/reviews/raw/2026-10-21/common-prompt-claude.md`.
  - Phần về phiên điều phối ở §L3.7, §L3.9, §L3.10 và Phụ lục I giữ chữ của bản duyệt 19/10 nhưng không áp dụng. Kết quả: tổng hợp lượt 3 `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §10.
- **Sau tổng hợp** (T-267 #714): **sửa hết** (Owner chốt trước), rồi G7.

**Vì sao cần lượt 3:** đợt sửa lượt 2 lớn: 119 file code, +7 742 / −1 050 dòng (gồm test), 17 commit code. Trong đó có tính năng `risk:high` "Dọn sạch Thùng rác" (#662: migration `0011`, xóa hẳn dữ liệu) và đợt G5 `@3`, chưa lượt deep review nào đọc. Lượt 2 cho thấy đợt sửa có thể sinh lỗi mới: 3 hồi quy, trong đó có Medium duy nhất của lượt 2 (DR6-68, do #616).

## L3.2 SHA ghim, đợt sửa, chỗ làm

**SHA ghim lượt 3: `119e2e4`** (`119e2e45cbce54d8a3943757bd826a7f1e9b694f`, `main` 19/10/2026 sau #712). Mọi Issue sửa lượt 2 đã đóng: #652–#663; #662 đóng 19/10 qua #709, #710. Milestone Phase 6 không còn Issue mở nào ngoài #713, #714. Code giống `6526793` (#710); sau đó chỉ có `docs/state/review-notes.md` (#712). Cổng ở SHA ghim xanh 19/10 trên Home PC (phiên G7): `pnpm verify` (3 159 test), `pnpm verify:rust` (fmt, clippy, 104 test), `pnpm e2e` (247 test, có `full-cycle`). Exe CI của `6526793`: run `39275519681`, 5 408 768 byte. Bước chuẩn bị vẫn chạy lại cổng (§L3.9).

**Đợt sửa = diff `4217ed4..119e2e4`:** ngoài `docs/**` và mọi file `*.md` có 119 file, +7 742 / −1 050 dòng (`git diff --numstat`, tính cả test, migration, `.claude/settings.json`); một migration mới `0011_trash_purge`.

| Issue | Việc | DR6 | PR | Commit |
|---|---|---|---|---|
| #652 T-248 | Cuộc gặp trước ngày tạo KH, E20 theo thứ tự ghi, khôi phục chuyển nhóm đúng KH | 68, 69, 71, 87 | #666 | `d6c2350` |
| #653 T-249 | Hộp 6f nêu hậu quả, chữ Thùng rác, luật D7 một nơi | 70, 91, 93, 94, 95, 99, 103 | #667 | `d0a97ec` |
| #654 T-250 | Màn nhập liệu: link dài, hộp 9b đếm như lệnh, cuộn về đầu, tiền KYC | 80, 81, 82, 90, 101 (+ ghi chú #636) | #669 | `1f71029` |
| #655 T-251 | Focus không rơi về `body`, tên cột nút | 83, 100 | #693 | `f9fb70f` |
| #656 T-252 | Lớp file: `integrity_check`, file chỉ đọc, màn lỗi khởi động, test hở | 73, 74, 75, 88 | #674 | `c5a40e1` |
| #657 T-253 | Key qua mọi tổ hợp hai lớp escape, Rust và script eval | 76 | #680 | `217cef6` |
| #658 T-254 | AI Mock: trích xuất một lượt, bớt đề xuất sai, test panel | 78, 79, 89 | #682 | `1502c5e` |
| #659 T-255 | K20 mở rộng: khoảng trắng và ký tự vô hình Unicode | 72 | #686 | `9ac20cf` |
| #660 T-256 | Công cụ: cổng tested base, `retro.mjs`, múi giờ, probe Thùng rác | 85, 86, 92, 98 (probe) | #689 | `bbb20b1` |
| #661 T-257 | Đợt G5 lượt 2: `analysis@3`, `discovery@3` | 17, 23, 24 (lượt 1), 77, 102 | #698 | `8f7355b` |
| #662 T-258 | Dọn sạch Thùng rác | 84 (Q8 c) | #707 (spec, G1 / G2 / G3), #709 (lệnh `db`), #710 (màn) | `b4aebfa`, `29aca69` (`96c3953`), `6526793` |
| #663 T-259 | Tài liệu: nghiệm thu hành vi mới, hướng dẫn "200.000" | 96, 97 | #700 | `16a28f0` |
| #671 T-260 | Cho phép subagent / Workflow (M8) | — | #672 | `29b68e2` |
| #676 T-261 | Mỗi task thấy ghi chú OPEN của file nó sửa (`notes-for`) | — | #678 (+ #677) | `a48a319` |
| #683 T-262 | E2E mở hồ sơ KH chờ đúng `h2` của hồ sơ | — | #684 | `ce6de0a` |
| #691 T-263 | Test seed cố định múi giờ khi so hash | — | #702 (+ #692) | `2b0a7aa` |
| #695 T-264 | Mốc Home PC sau `integrity_check` | 98 (phần `phase-6.md`) | #696 | `8f202bc` |
| #704 T-265 | Module nạp TypeScript dùng chung cho `tools/` (#474) | — | #705 | `1f0489f` |

Mỗi PR code có PR sổ ghi chú review ngay sau (#668…#712); ghi chú không chặn của chúng nằm trong KNOWN phần 1 (§L3.5).

Trong suốt lượt 3 **không merge code vào `main`** (như §2). PR docs merge được, không đổi SHA ghim.

| Bên | Ai chạy | Làm ở | Thư mục kết quả | ID |
|---|---|---|---|---|
| Claude (Workflow: phiên điều phối Owner mở; mỗi gói một subagent context sạch, tuần tự A → F) | Owner mở phiên, phiên chạy script Phụ lục I | `C:\workspace\Project-2C-review` | `C:\workspace\deep-review-1-6-r3\claude\` | `CL3-<gói><số>` |
| Codex (cùng lúc Claude) | Owner, mỗi gói một phiên mới | `C:\workspace\Project-2C-review-2` | `…-r3\codex\` | `CX3-<gói><số>` |
| **Claude phiên tổng hợp** (T-267 #714) | Owner yêu cầu, sau khi đủ 12 báo cáo | checkout chính | `docs/reviews/` qua PR docs | dùng nguyên ID trên |

**Máy: Home PC `DESKTOP-KDURKJP`**: mốc hiệu năng mới nhất (sau `integrity_check`, #656) chỉ có ở máy này (§L3.6); Office Laptop không có mốc nào sau #656. Bước chuẩn bị, cả hai bên và mọi số đo chạy trên cùng máy. Thư mục lượt 1, lượt 2 (`C:\workspace\deep-review-1-6\`, `deep-review-1-6-r2\`) có trên Home PC, giữ tới v1.0 (HANDOFF). Lượt 2 chạy trên Home PC nên probe lượt 2 của mỗi bên trong `deep-review-1-6-r2\<bên>\` là probe cùng máy, dùng lại được.

## L3.3 Sáu gói, cỡ đo lại, diff sửa theo gói

Phạm vi từng gói **giữ đúng §3** (luật `PACKAGES` của `tools/size-report-core.mjs` không đổi). Thứ tự vẫn A → F.

**Cỡ đo trên SHA ghim** (`node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` ở `119e2e4`, 19/10, Home PC). Δ so với lượt 2 (`4217ed4`, §L2.3). **Diff sửa** = dòng thêm / xóa của `git diff --numstat 4217ed4 119e2e4`, xếp gói bằng `classifyFile` (không tính file sinh tự động).

| Gói | SP (Δ) | Test (Δ) | Sinh (Δ) | File (Δ) | Diff sửa SP | Diff sửa test | DR6 kiểm chính (bảng R, §L3.5) |
|---|---:|---:|---:|---:|---|---|---|
| A. Lõi dữ liệu | 8 189 (+322) | 13 885 (+1 078) | 339 (+28) | 101 (+3) | +455 / −133 · 12 file | +1 095 / −17 · 13 file | 68, 69, 71, 72, 84, 87, 92, 103 |
| B. File và Rust | 2 207 (+45) | 4 810 (+377) | 0 | 19 (0) | +282 / −84 · 3 file | +228 / −4 · 2 file | 73–76, 84, 88 |
| C. AI | 5 357 (+107) | 6 464 (+354) | 0 | 60 (0) | +199 / −92 · 9 file | +377 / −23 · 10 file | 17, 23, 24, 77–79, 89, 97, 102 |
| D. Màn nhập liệu | 7 329 (+133) | 2 165 (+142) | 0 | 76 (+2) | +291 / −158 · 14 file | +199 / −57 · 5 file | 72, 75, 80–83, 90, 96, 100, 101 |
| E. Lịch hẹn, chỉ số, quản lý | 7 756 (+382) | 4 146 (+303) | 0 | 51 (0) | +540 / −158 · 8 file | +308 / −5 · 2 file | 68, 70, 83, 84, 91, 93–95, 99, 103 |
| F. Xuyên gói, bloat / hiệu năng, công cụ | 4 340 (+401) | 14 165 (+1 748) | 4 628 (0) | 91 (+7) | +530 / −129 · 15 file | +1 933 / −185 · 21 file | 69, 76, 84 (đo), 85, 86, 92, 98; **bảng R gộp đủ 39 DR6** |
| **Tổng** | 35 178 (+1 390) | 45 635 (+4 002) | 4 967 (+28) | 398 (+12) | | | |

- Một DR6 có thể thuộc nhiều gói (vd. DR6-84: lệnh dọn ở A, hàng đợi thay thế ở B, màn ở E, số đo ở F): mỗi gói kiểm phần của mình; gói F gộp.
- Bước chuẩn bị (§L3.9 bước 6) đo lại bằng cùng lệnh, kèm bundle và exe; số dòng phải trùng bảng trên.

## L3.4 Hai phần của mỗi gói

Như §L2.4, với các thay đổi dưới.

**Phần 1 — kiểm phần đã sửa (trục R).** Bảng R gồm **39 DR6** (§L3.5 phần 3): 36 vấn đề DR6-68…103 của lượt 2, và DR6-17, 23, 24 của lượt 1 (hoãn ở lượt 1, sửa ở đợt G5 #661). Bốn bước của §L2.4 giữ nguyên:

1. Chạy lại tái hiện của lượt 2 (lượt 1 với DR6-17, 23, 24). Nguồn: báo cáo gốc `docs/reviews/raw/2026-10-17/` (và `…/2026-10-15/`), tổng hợp lượt 2 §5–§6, phụ lục nguồn probe; probe lượt 2 của chính bên mình ở `C:\workspace\deep-review-1-6-r2\<bên>\`.
2. Gỡ tạm phần sửa, xem test của PR sửa có đỏ.
3. Thử biến thể gần.
4. Mục sửa bằng tài liệu (DR6-95, 96, 97, 98): dòng ghi có, và khớp app / số đo.

Thước kết luận như §L2.4. Bảy DR6 của lượt 1 mà lượt 2 chấm SỬA MỘT PHẦN / HỒI QUY (01, 04, 19, 30, 49, 60, 62) được kiểm qua mã lượt 2 của phần còn lại (93, 68, 79, 82, 72, 88, 90), không có dòng R riêng.

**Refactor / hiệu năng không đổi hành vi:**

- DR6-79 (Mock trích xuất đọc một lượt): đề xuất giống bản trước trên các câu của lượt 1–2; thời gian tuyến tính theo độ dài ghi chú.
- DR6-103 (luật D7 một nơi): lệnh, seed và màn cho cùng kết quả.
- DR6-73 (`integrity_check`): chi phí lúc mở như #674 đo (≈ +30–40 ms).
- #705 (module nạp TypeScript dùng chung): `load-data`, `eval-ai` và test `tools/` chạy như trước.
- DR6-84 → Dọn sạch Thùng rác: `trash.open` sau khi dọn, cỡ file sau `VACUUM` (§L3.6).

**Phần 2 — lỗi mới và edge case mới.** Như §L2.4 phần 2: ít nhất 5 kịch bản mới mỗi gói, gói F ít nhất 5 chuỗi nhiều bước qua nhiều gói. Kịch bản phải chưa có trong báo cáo **lượt 1 và lượt 2** (đọc `docs/reviews/raw/2026-10-15/`, `…/2026-10-17/` và hai bản tổng hợp). Xét trước:

- **Code mới của đợt sửa lượt 2**, nhất là **Dọn sạch Thùng rác**. Nguồn: #709, #710; spec §4.2 TR-6, TR-11–TR-13, D1–D13; phụ lục ADR-0008; mockup `trash.html` 11h–11j. Đây là tính năng `risk:high` duy nhất chưa lượt nào đọc: nó xóa hẳn dữ liệu, và migration `0011` nới trigger chặn xóa.
- Trọng tâm từng gói ở bảng Phụ lục K.

## L3.5 KNOWN lượt 3

`common\known.md` (bước chuẩn bị §L3.9 bước 4) gồm **ba phần**:

1. **Nguyên văn mục OPEN và ACCEPTED** của `docs/state/review-notes.md` ở SHA ghim. So với lượt 2 có thêm: quyết định lượt 2 ghi ở #664, và ghi chú không chặn của các PR sửa #666–#710 (sổ #668…#712).
2. **Quyết định Owner còn hiệu lực:** K1–K21 (§5, §L2.5) giữ nguyên chữ, **trừ K14 và K17**, ghi vào `known.md` theo chữ đã sửa dưới đây (chữ cũ trái với quyết định sau). K21 thêm chỉ dẫn "(Q6 lượt 1; đợt G5 lượt 2: K28)" sau vế "V1 / `LAW_NAME` sửa đúng chữ G5, không G5 mới", vì đợt G5 lượt 2 đã có (ghi chú review PR #715; `known.md` của bước chuẩn bị đã ghi vậy):

   - **K14 (sửa theo K27, TR-6 mới):** Thùng rác: không khôi phục dây chuyền, không tự dọn (chỉ dọn tay mọi bản ghi theo K27, không xóa từng dòng), không theo góc nhìn, luôn hỏi trước khi khôi phục (TR-1…TR-13). Bỏ vế "không xóa vĩnh viễn" duyệt 11/10 (spec §4.2 TR-6).
   - **K17 (sửa theo M8, M9):** Không phải phát hiện: PR vượt ngưỡng kích thước (ghi ở `docs/metrics/`); cách làm "chỉ Claude viết code" (ADR-0001), kể cả việc phần Claude của lượt 3 chạy bằng Workflow subagent (M9); việc dùng công cụ mới (G4).

   Cộng thêm:

| # | Quyết định | Nguồn |
|---|---|---|
| K22 | Trước ngày tạo KH, "nhóm của ngày" = nhóm tạo KH: cuộc gặp Đã gặp giữ nhóm trước ngày tạo ghi / khôi phục / nhập được (DR-43, K2); đổi nhóm trước ngày tạo vẫn bị D10. E20 so **thứ tự ghi** (`seq`), không so mốc thời gian. Khôi phục chỉ đưa lại chuyển nhóm của chính KH đó | Owner 17/10 Q1 (a); spec Phase 3 §4; #652 → #666 |
| K23 | Nhận diện / che key: mọi tổ hợp tới **hai lớp** escape (JSON, URL), kể cả dạng trộn theo từng đoạn, ở `ai.rs` và script eval | Owner 17/10 Q2 (a) + Q9; #657 → #680 |
| K24 | `integrity_check` mỗi lần mở dữ liệu có file: chi phí ≈ +30–40 ms là có chủ ý. `project2c.db` chỉ đọc → từ chối mở (`ACCESS_DENIED`). Màn lỗi khởi động bảo đóng cửa sổ lỗi rồi mở lại | Owner 17/10 Q3 (a); #656 → #674 |
| K25 | K20 mở rộng: `normalizeText` gộp mọi Unicode White_Space (gồm U+0085), bỏ mọi `\p{Default_Ignorable_Code_Point}` và U+2800; lệnh, nhập backup, UI dùng cùng hàm; dữ liệu giả lập nạp lại (K1) | Owner 17/10 Q4; #659 → #686 |
| K26 | Hộp 9b đếm như lệnh (gồm lịch của KH trong Thùng rác) và nêu KH đã xóa; câu cho người hỗ trợ theo Q5 (a). Hộp 6f nêu hậu quả khi dời ngày làm rút một chuyển nhóm (Q6 a). Chữ Thùng rác: dòng cuộc gặp giữ nhóm ghi "nhóm sau N3 · không đổi nhóm KH"; có câu chặn riêng khi ngày đổi nhóm trùng ngày cuộc hẹn (Q7 a, spec TR-3 / E20) | Owner 17/10 Q5–Q7 và câu thêm về xóa nhân sự; #653 → #667, #654 → #669 |
| K27 | **Dọn sạch Thùng rác** (TR-6 mới, TR-11–TR-13, D1–D13, mockup 11h–11j, phụ lục ADR-0008): không tự dọn; một nút dọn **mọi** bản ghi, không dọn từng dòng; hộp đếm theo loại, gõ DỌN SẠCH; chạy qua hàng đợi thay thế (chờ lưu, backup trước, chặn ghi); một transaction rồi `VACUUM` ngoài transaction; bản ghi còn được dùng thì giữ lại, kèm lý do trên dòng; câu nhắc từ 1 000 bản ghi; trigger chặn xóa của ghi chú KYC, dữ kiện, phân tích AI chỉ cho đi dòng của KH đã xóa mềm. Hộp 5f không còn nói ghi chú KYC không bao giờ xóa | Owner 17/10 Q8 (c); G1 / G2 / G3 19/10 (PR #707); #662 → #709, #710 |
| K28 | Đợt G5 lượt 2: `analysis@3`, `discovery@3` (`phase-5-prompts.md` §11): so khớp bỏ dấu theo từng chữ, ký tự vô hình ở V3–V6, chi tiết V1, trần chuỗi gốc, "kỉ" / "qui". Chữ prompt không đổi so với `@2` | Owner duyệt G5 18/10; #661 → #698 |
| K29 | J5 của DR6-60 được chấp nhận (đột biến gần tương đương ở React 19); comment `app-data.ts` sửa theo | Owner 17/10 Q10; #656 → #674 |

3. **Bảng DR6.**
   - **39 DR6 vào bảng R** (bảng dưới) của gói kiểm (§L3.4 phần 1), không báo lại thành phát hiện.
   - **52 DR6 lượt 1 ĐÃ SỬA ở lượt 2**, và 7 DR6 lượt 1 kiểm qua mã lượt 2 (§L3.4): không báo lại. Mô tả ở tổng hợp lượt 1 §3–§5, bảng §L2.5, tổng hợp lượt 2 §3. Phần sửa của lượt 1 hỏng lại → phát hiện mới, "Liên quan: DR6-xx".
   - **KNOWN, chỉ nêu khi có bằng chứng mới** (hậu quả nặng hơn, đường vào mới): DR6-25, 37, 66, 67 (hoãn sau v1.0); DR6-53 (chấp nhận); J5 của DR6-60 (K29).

Mức: M = Medium, L = Low, N = Nit. "Gói kiểm": gói ghi bảng R cho DR6 đó; gói đầu là gói chính. Mô tả đầy đủ ở tổng hợp lượt 2 §5–§6 (DR6-68…103) và tổng hợp lượt 1 §3–§5 (DR6-17, 23, 24).

| DR6 | Mức | Vấn đề (ngắn) | Issue → PR | Gói kiểm |
|---|---|---|---|---|
| 17 | L | Ký tự vô hình lọt V3–V6 | #661 → #698 | C |
| 23 | N | Bản bỏ dấu khớp nhầm câu thường | #661 → #698 | C |
| 24 | N | Chi tiết V1 không nêu dạng đúng | #661 → #698 | C |
| 68 | M | Cuộc gặp Đã gặp ghi bù trước ngày tạo KH bị từ chối (hồi quy DR6-04 do #616) | #652 → #666 | A, E |
| 69 | L | E20 so mốc thời gian thay vì thứ tự ghi | #652 → #666 | A, F |
| 70 | L | 6f dời ngày cuộc gặp đã chuyển nhóm: rút chuyển nhóm + RF mà hộp không nói | #653 → #667 | E |
| 71 | L | Khôi phục đưa lại chuyển nhóm đã rút không kiểm cùng KH; luật nhập 4 | #652 → #666 | A |
| 72 | L | `normalizeText`: U+0085, ký tự vô hình ngoài `\p{Cf}`, U+2800 (phần còn của DR6-49) | #659 → #686 | A, D |
| 73 | L | `quick_check` không bắt chỉ mục lệch nội dung | #656 → #674 | B |
| 74 | L | `project2c.db` chỉ đọc: mở được rồi mọi lần lưu lỗi | #656 → #674 | B |
| 75 | L | Màn lỗi khởi động giữ khóa; câu "mở lại app" | #656 → #674 | B, D |
| 76 | L | Key hai lớp escape cùng loại / trộn từng đoạn | #657 → #680 | B, F |
| 77 | L | V1 không còn trần cho chuỗi gốc (≈ 2 MB vô hình vào `ai_analyses`) | #661 → #698 | C |
| 78 | L | Mock trích xuất đề xuất điều về người khác, "con" loại từ, câu giả định | #658 → #682 | C |
| 79 | L | Mock trích xuất chậm bậc hai (hồi quy DR6-19) | #658 → #682 | C |
| 80 | L | Câu 9b cho người hỗ trợ không làm được | #654 → #669 | D |
| 81 | L | Đổi màn giữ vị trí cuộn của màn trước | #654 → #669 | D |
| 82 | L | Chuỗi liền dài tràn cột hồ sơ 3 cột (hồi quy DR6-30) | #654 → #669 | D |
| 83 | L | Focus rơi về `body` khi nút mở hộp / nút bấm tự gỡ | #655 → #693 | D, E |
| 84 | L | Thùng rác mở chậm tuyến tính → Dọn sạch Thùng rác (Q8 c) | #662 → #707, #709, #710 | A, B, E, F (đo) |
| 85 | L | Cổng tested base đọc `compare` một trang | #660 → #689 | F |
| 86 | L | `retro.mjs` một thư mục cấu hình; khử trùng dạng 8.3 | #660 → #689 | F |
| 87 | L | Test hở: `previewHandover` (R16) | #652 → #666 | A |
| 88 | L | Test hở gói B (G07d, `Drop`, phiên bản, `AI_MODELS`, J5) | #656 → #674 | B |
| 89 | L | Test hở gói C (R15b, R15d, R21c) | #658 → #682 | C |
| 90 | L | Test hở gói D (R33c–e, BR3) | #654 → #669 | D |
| 91 | L | Test hở gói E (N1, N2, R04g, R38c–e, R43e) | #653 → #667 | E |
| 92 | N | `backup-invariants.test.ts` đặt 10:00 UTC, đỏ ở UTC−11 | #660 → #689 | A, F |
| 93 | N | Dòng Thùng rác của cuộc gặp giữ nhóm không nói nhóm (phần còn DR6-01) | #653 → #667 | E |
| 94 | N | Câu chặn E20 "sau ngày cuộc hẹn" khi cùng ngày | #653 → #667 | E |
| 95 | N | Mockup 11c còn ví dụ E7 cũ | #653 → #667 | E |
| 96 | N | Danh sách nghiệm thu thiếu hành vi mới (Back / Forward, KH ngoài góc nhìn, 9b) | #663 → #700 | D |
| 97 | N | Hướng dẫn còn "200 000" | #663 → #700 | C |
| 98 | N | Mốc Home PC sau `quick_check` / `integrity_check`; probe `trash.open` gắn DevTools | #665, #695 → #696, #660 → #689 | F |
| 99 | N | Tên nút khôi phục HĐ trùng (thiếu FYP) | #653 → #667 | E |
| 100 | N | Cột nút không có tiêu đề ẩn | #655 → #693 | D |
| 101 | N | Đọc lại tiền KYC trên chữ chưa chuẩn hóa | #654 → #669 | D |
| 102 | N | `LAW_NAME` chặn nhầm "kỉ", "qui" | #661 → #698 | C |
| 103 | N | Luật D7 mở rộng viết ba nơi | #653 → #667 | A, E |

Đếm: 1 M · 24 L · 14 N = 39 (36 của tổng hợp lượt 2 §6 + 3 của lượt 1 trong #661).

## L3.6 Số đo: so với mốc Home PC sau #656

- **Dữ liệu tải sinh lại ở SHA ghim:** `node tools/load-data.mjs` (mốc `2026-10-12`, seed `6`). Số dòng như lượt 1, 2 (1 496 KH, 10 414 lịch hẹn, 54 nhân sự, 103 `ai_analyses`…). **`tables` sha256 `1c0a43fb9d5711df4700cb688a256ac50bb44eed1c0fd00218fa36f0746d003f`** (đo 19/10 ở `119e2e4`, Home PC). Hash này khác `1c306cfb…589591` của lượt 2 và của mốc sau #656 (`dae9df3`), còn số dòng thì như cũ. Cỡ file 15,3 MB.
- **Mốc so (Home PC):**

  | Mốc | Nguồn |
  |---|---|
  | Probe trên exe: mốc chính | `docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json` (exe `dae9df3`, 18/10, T-264; `phase-6.md` mục "Mốc Home PC sau #656"). Mốc này đã gồm `integrity_check`, nên `app.open-data` / `reload.*` không còn ngoại lệ ⚠️ như khi so với `perf.json` |
  | Probe trên exe: lượt 2 cùng máy (tham khảo) | `docs/metrics/phase-6-baseline/perf-home-pc-luot-2.json` (exe `4217ed4`, 17/10), trùng byte `C:\workspace\deep-review-1-6-r2\common\perf\perf-ref.json` (sha256 `85E82FEA…C44348`, so 19/10 trên Home PC). Bước chuẩn bị §L3.9 (bước 1, 7) dùng bản ngoài repo; lần sau dùng bản trong repo |
  | Mở app lần đầu (LCP, cách T-227, 3 lần) | Mốc sau #656: 3 663 ms (3 656–3 746). Xấu hơn theo luật nhiễu khi trung vị > 4 396 ms; ngưỡng "không chậm hơn exe Phase 4" là > 4 724 ms |
  | Hàm thuần trong Node | Số lượt 2 Home PC, tổng hợp lượt 2 §7.2 |

- **"Xấu hơn"** theo luật nhiễu (Owner chốt 13/10): trung vị lớn hơn mốc **quá 20 % và quá 10 ms** (bộ nhớ: quá 5 MB). Ngưỡng tuyệt đối ở `docs/metrics/phase-6.md` vẫn áp dụng.
- **Lệnh** (bước chuẩn bị chạy một lần, reviewer dùng lại kết quả trong `common\baseline.md`):

  ```powershell
  node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json
  ```

  ```powershell
  $env:PERF_BASE = 'docs\metrics\phase-6-baseline\perf-home-pc-sau-656.json'; $env:PERF_BACKUP = 'C:\workspace\deep-review-1-6-r3\common\load\load-2026-10-12-seed6.p2cbackup'; $env:PERF_OUT = 'C:\workspace\deep-review-1-6-r3\common\perf\perf-ref.json'; $env:PERF_NOTE = 'DESKTOP-KDURKJP, exe 119e2e4, deep review luot 3'; pnpm exec playwright test -c playwright.perf.config.ts
  ```

  Bảng so lượt 2: script `node` trong `common\perf\` gọi `parseRun` rồi `markdownTable(r3, r2)` của `e2e/perf/stats.ts` trên `perf-ref.json` và `perf-ref-r2.json` (cột Nền = lượt 2).
- **Dọn sạch Thùng rác** (mới, chưa có mốc). Đo trong Node:
  - `previewPurge`, `purgeTrash`, `VACUUM` và `db.export()`;
  - cỡ `project2c.db` trước / sau khi dọn;
  - `listTrash` sau khi dọn.

  Đo ở hai cỡ: dữ liệu tải (113 dòng Thùng rác) và Thùng rác lớn (dữ liệu tải + 1 200 KH xóa ≈ 1 313 dòng, như DR6-84). Trên exe chạy một lần với dữ liệu tải qua cổng debug: thời gian từ lúc bấm "Backup rồi dọn sạch" tới khi 11j hiện; `trash.open` trước / sau khi dọn. Spec không đặt ngưỡng cho thao tác này nên chỉ ghi số. Phiên tổng hợp so với Nạp lại / Nhập backup cùng máy (cùng đường hàng đợi thay thế) và đề xuất ngưỡng nếu cần.
- **Reviewer muốn đo lại trên exe:** như §6 (chép `common\exe\project2c.exe` vào thư mục của mình, cổng debug khác 9222, không đo khi bên khác đang đo).

## L3.7 Workflow cho phần Claude, Codex, bài học từ lượt 2

**Workflow** (ADR-0001 M8, M9; script ở Phụ lục I). *Không áp dụng từ 20/10 (§L3.1): phần Claude chạy mỗi gói một phiên như lượt 2; bảng bài học cuối mục vẫn áp dụng.*

- **Phiên điều phối.** Owner mở một phiên Claude Code mới ở `C:\workspace\Project-2C-review`, chọn model / mức suy luận (M1; subagent dùng cùng model và mức của phiên) và chế độ quyền như các phiên Claude lượt 2, rồi dán tin nhắn ở §L3.9. Phiên điều phối chỉ gọi công cụ Workflow với `scriptPath` = `C:\workspace\deep-review-1-6-r3\common\workflow-claude.mjs`. Nó không tự review, không đọc báo cáo, không mở `codex\`. Nó ghi vào `common\workflow-run.md`: `runId`, thư mục transcript mà Workflow trả về, model và mức suy luận của phiên.
- **Mỗi gói một subagent context sạch.** Subagent nạp `CLAUDE.md` của worktree như một phiên mới và nhận đúng tin nhắn giao việc của lượt 2 (`Gói X. Đọc và làm đúng …\prompt-claude.md`, thư mục `-r3`).
- **Tuần tự A → F.** Gói sau chỉ bắt đầu khi gói trước trả `XONG`. Không chạy song song, vì:
  - F đọc báo cáo A–E;
  - các gói dùng chung worktree, cổng e2e 4173, thư mục `apps/desktop/dist` và máy đo.
- **Kết quả có khuôn.** Mỗi subagent trả `{pkg, status: XONG | DỪNG, report, note}` thay cho dòng in `XONG …` (Phụ lục I quy tắc riêng 6). Trả `DỪNG` (bước 0 không qua, SHA lệch, lỡ thấy thư mục cấm…) thì script dừng và báo lý do. Owner xử lý xong thì chạy lại từ gói đó (`args: {"from": "<gói>"}`).
- **Bị cắt giữa chừng:**
  - **Phiên điều phối còn mở** (Workflow bị dừng, lỗi API): dừng hẳn lần chạy cũ (TaskStop), rồi chạy lại trong **chính phiên đó** với `resumeFromRunId`. Resume chỉ dùng được trong cùng phiên. Gói đã xong trả lại kết quả đã lưu; gói dở chạy lại, và bước 0 thấy `ĐANG LÀM` nên làm tiếp.
  - **Phiên điều phối đã đóng** (đóng cửa sổ, máy tắt): mở phiên điều phối mới và chạy mới với `args {"from": "<gói dở>"}`. Bước 0 của gói dở thấy `ĐANG LÀM` nên làm tiếp; các gói trước đã `XONG` không chạy lại.
- **Không lồng:** subagent không gọi Agent tool / Workflow. Các quy tắc riêng khác của Claude (Phụ lục I) giữ như Phụ lục E.

**Codex:** như §L2.7. Owner chạy mỗi gói một phiên mới; báo cáo ghi phiên bản Codex ở mục 1.

**Bài học từ lượt 2** (tổng hợp lượt 2 §10.1 "Cho lần sau"; giữ mọi bài học §L2.7):

| Lượt 2 vướng | Lượt 3 làm |
|---|---|
| Codex F chạy `pnpm` trong bản chép repo, làm 8 junction `@p2c` của `node_modules` trong worktree trỏ sang bản chép (tự khôi phục) | Không chạy `pnpm install` trong bản chép repo: dùng junction sẵn có hoặc `--ignore-workspace` (Phụ lục K quy tắc chung 1) |
| Claude E dùng `$E` và `$e` trong PowerShell (cùng một biến), liệt kê nhầm thư mục lượt 1 | Probe PowerShell không dùng biến chỉ khác hoa / thường (Phụ lục K quy tắc chung 4) |
| Phiên bị cắt, đổi thư mục cấu hình `.claude*` giữa gói; mức suy luận "không đọc được" ở A, B, F | Workflow chạy trong một phiên điều phối; `common\workflow-run.md` ghi model / mức của phiên; phiên tổng hợp vẫn quét mọi `.claude*` |
| `baseline.md` ghi ngày sai chữ ("17–18/10") | Bước chuẩn bị ghi ngày giờ bằng `Get-Date`, không gõ tay |

## L3.8 Báo cáo lượt 3

Khuôn như §L2.8, đổi:

- ID `CL3-<gói><số>` / `CX3-<gói><số>`; `Vị trí: path:dòng (119e2e4)`.
- `Liên quan: DR6-xx (nếu có) · mới do đợt sửa lượt 2 (PR #…) | có từ trước, lượt 1–2 bỏ sót`.
- Bảng R: mọi DR6 mà gói kiểm trong 39 DR6 của §L3.5, cùng cột như §L2.8.
- Phạm vi đã đọc gồm phần diff `4217ed4..119e2e4` của gói.
- Mục 1 (đầu báo cáo) của Claude ghi "subagent của Workflow lượt 3"; model / mức suy luận ghi như biết được, hoặc dẫn tới `common\workflow-run.md`.
- **Gói F:** bảng R gộp đủ 39 DR6 (từ báo cáo A–E lượt 3 của chính bên đó + phần F), và kết luận **SẴN SÀNG / CHƯA SẴN SÀNG cho v1.0 ở SHA `119e2e4`** kèm lý do (tham khảo; kết luận thật ở T-267).

## L3.9 Chuẩn bị và chạy

**Bước chuẩn bị — Claude, sau khi Owner duyệt kế hoạch lượt 3** (một phiên trên Home PC; không review, không ghi phát hiện):

1. Ghi `hostname` và ngày giờ (`Get-Date`) vào `common\baseline.md`.
   - Kiểm `main` chưa có code mới: `git diff --name-only 119e2e4 origin/main` chỉ có `docs/**` và `CLAUDE.md` gốc. Có file khác → dừng, báo Owner (§2).
   - Kiểm `C:\workspace\deep-review-1-6-r3\` chưa có (có rồi → dừng, báo Owner), và `C:\workspace\deep-review-1-6-r2\common\perf\perf-ref.json` có.
2. Tạo `C:\workspace\deep-review-1-6-r3\{common,claude,codex}`.
3. Đưa hai worktree về SHA ghim:
   - `git -C C:\workspace\Project-2C-review checkout --detach 119e2e4`, tương tự với `-review-2`;
   - xóa `apps\desktop\dist` ở mỗi worktree;
   - `pnpm install --frozen-lockfile` (PowerShell);
   - `git status --short` rỗng (ngoài file Codex tự sinh ở `-review-2`, §8).
4. Chép vào `common\`:
   - `plan.md` (file này, bản đã merge);
   - `known.md` (§L3.5: OPEN + ACCEPTED nguyên văn ở SHA ghim, K1–K29 với K14, K17 theo chữ đã sửa ở §L3.5, bảng 39 DR6 và danh sách KNOWN);
   - `fixes.md`: thân 18 Issue của §L3.2 và thân PR sửa (mục "Lệch so với Issue", "Chưa làm", "Ghi chú OPEN liên quan"), lấy bằng `gh issue view` / `gh pr view --json body`;
   - `prompt-claude.md` = đoạn prompt của Phụ lục I + nguyên văn Phụ lục K; `prompt-codex.md` = Phụ lục J + nguyên văn Phụ lục K;
   - `workflow-claude.mjs` = script của Phụ lục I, nguyên văn.
5. Dữ liệu tải: `node tools/load-data.mjs --out C:\workspace\deep-review-1-6-r3\common\load\load-2026-10-12-seed6.p2cbackup`; hash `tables` phải bằng §L3.6.
6. Chạy cổng ở SHA ghim (trong `Project-2C-review`): `pnpm verify`, `pnpm verify:rust`, `pnpm e2e` (`CI=1`), `pnpm build:exe`, và `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` (số dòng phải trùng §L3.3). Kết quả ghi vào `common\baseline.md`; chép exe vào `common\exe\`.
7. Đo hiệu năng. Cần Owner: nhập dữ liệu tải trong exe theo `e2e/perf/README.md` bước 3, rồi không dùng máy ≈ 5 phút.
   - Chép `deep-review-1-6-r2\common\perf\perf-ref.json` thành `common\perf\perf-ref-r2.json`.
   - Chạy lệnh probe §L3.6 → `common\perf\perf-ref.json`.
   - Ghi vào `baseline.md` hai bảng: so mốc sau #656 (bảng của probe) và so lượt 2, cả hai có thêm cột ngưỡng `phase-6.md`.
   - Mở app lần đầu 3 lần (cách T-227), so mốc §L3.6.
   - Đo Dọn sạch Thùng rác theo §L3.6 (Node hai cỡ; exe một lần với dữ liệu tải) → `baseline.md`.
8. Báo Owner: sẵn sàng chạy lượt 3.

**Owner chạy** (hai bên cùng lúc):

- **Codex:** như lượt 2, ở `C:\workspace\Project-2C-review-2`, mỗi gói một phiên mới, lần lượt A → F:

  ```text
  Gói A. Đọc và làm đúng C:\workspace\deep-review-1-6-r3\common\prompt-codex.md
  ```

- **Claude:** một phiên mới ở `C:\workspace\Project-2C-review`:

  ```text
  ultracode. Chạy công cụ Workflow với scriptPath C:\workspace\deep-review-1-6-r3\common\workflow-claude.mjs và args {"from": "A"}. Phiên này chỉ điều phối: không tự review, không đọc báo cáo, không mở thư mục codex\. Ghi runId, thư mục transcript Workflow trả về, model và mức suy luận của phiên này vào C:\workspace\deep-review-1-6-r3\common\workflow-run.md. Khi Workflow xong hoặc dừng, in nguyên kết quả nó trả về.
  ```

  Workflow dừng ở một gói → Owner xem lý do (`note`), xử lý, rồi bảo phiên điều phối chạy lại với `args {"from": "<gói>"}`. Bị cắt giữa chừng: phiên điều phối còn mở thì resume trong chính phiên đó (`resumeFromRunId`); phiên đã đóng thì mở phiên mới, chạy với `from` = gói dở (§L3.7).

  *Sửa 20/10 (§L3.1):* thay tin nhắn trên, mỗi gói một phiên mới, lần lượt A → F, như lượt 2: `Gói A. Đọc và làm đúng C:\workspace\deep-review-1-6-r3\common\prompt-claude.md`. Phiên bị cắt (dòng đầu vẫn `ĐANG LÀM`) thì mở phiên mới với đúng tin nhắn của gói đó; bước 0 tự làm tiếp. Bước chuẩn bị 7: Owner đồng ý 20/10 để script nhập dữ liệu tải vào exe qua cổng debug (`perf\import-load.mjs`) thay Owner bấm tay.

Bảng đánh dấu của Owner (12 ô):

| Bên | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| Claude (Workflow) | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Codex | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

## L3.10 Sau lượt 3, kiểm độc lập, ước lượng

**Tổng hợp (T-267 #714, khi Owner yêu cầu):** như §L2.10, đổi:

- Đọc đủ 12 báo cáo.
- Gộp hai bảng R thành một bảng đủ 39 DR6; kiểm trên code ở SHA ghim mọi kết luận khác ĐÃ SỬA và mọi chỗ hai bên chấm khác nhau.
- Kiểm mọi phát hiện mới, gộp trùng, đánh số tiếp `DR6-104…`.
- So số đo với mốc cùng máy (§L3.6).
- Kết luận SẴN SÀNG / CHƯA SẴN SÀNG cho G7.
- Owner đã chốt sửa hết (§L3.11): mọi vấn đề có Issue sửa; phần câu hỏi cho Owner chỉ còn cách sửa khi có nhiều phương án.

Phiên tổng hợp được dùng Workflow để kiểm từng phát hiện khi Owner bật (M8); phân loại cuối và kết luận vẫn do phiên tổng hợp ra.

**Kiểm độc lập bằng log phiên:** như §8, §L2.10, cho cả hai bên.

- **Log Claude:** transcript của phiên điều phối và của từng subagent: mọi `*.jsonl` dưới thư mục transcript ghi ở `common\workflow-run.md`, và dưới `%USERPROFILE%\.claude*\projects\C--workspace-Project-2C-review\` từ giờ bắt đầu lượt 3. *Sửa 20/10 (§L3.1):* không có phiên điều phối nên không có `workflow-run.md`; log là transcript của các phiên gói và của subagent ở phiên nào Owner bật ultracode, cùng thư mục trên.
- **Danh sách quét thêm:**
  - `deep-review-1-6-r3[\\/](claude|codex)` của bên kia;
  - `deep-review-1-6-r2[\\/]…` và `deep-review-1-6[\\/]…` không phải của chính bên đó;
  - liệt kê hoặc tìm kiếm trên `C:\workspace`, `deep-review-1-6*\`;
  - lệnh gọi Agent tool / Workflow trong transcript của subagent (không được lồng);
  - lệnh ghi của phiên điều phối ngoài `common\workflow-run.md`.

**Báo cáo gốc lưu ở repo** (PR docs của T-267):

- `docs/reviews/raw/<ngày tổng hợp>/{claude,codex}/<gói>.md` nguyên văn;
- `common-known.md`, `common-baseline.md`, `common-fixes.md`, `common-workflow-run.md`; `common-plan.md` chỉ khi khác bản trong repo (*sửa 20/10, §L3.1:* không có `common-workflow-run.md` vì không có phiên điều phối; thêm `common-prompt-claude.md`, bản đã dùng);
- bản tổng hợp `docs/reviews/<ngày>-deep-review-phase-1-6-luot-3-tong-hop.md`.

Thư mục bằng chứng `deep-review-1-6-r3\` giữ trên Home PC tới v1.0.

**Ước lượng** (lượt 2 trên Home PC: Claude ≈ 6 h, 10 phiên rải 01:57–17:50; Codex ≈ 5 h):

- Phạm vi lượt 3 như lượt 2. Bảng R ngắn hơn (39 dòng so 59), nhưng thêm phần mới của Dọn sạch Thùng rác, nên mỗi bên ≈ 5–7 h.
- Workflow chạy liền A → F, không chờ Owner mở phiên giữa các gói.
- Cả lượt 3 ≈ 1–1,5 ngày tính cả chuẩn bị và tổng hợp, rồi tới đợt sửa.
- Owner can thiệp: mở 1 phiên Claude + 6 phiên Codex; nhập dữ liệu tải và để máy rảnh ≈ 5 phút ở bước 7; ghi giờ bắt đầu / xong mỗi gói của Codex.

## L3.11 Quyết định của Owner (19/10/2026)

Ngay sau khi #662 đóng và cổng trên `119e2e4` xanh, Owner: "anh muốn làm 1 deep review lần 3 trước khi release 1.0". Owner trả lời bốn câu cùng ngày, trong phiên G7 (ADR-0001 phụ lục M9, `docs/PROJECT-STATE.md`):

1. **Bên review:** Claude + Codex, như lượt 2 → 12 báo cáo.
2. **Cách chạy phần Claude:** Workflow subagent: một phiên, mỗi gói một subagent context sạch, thay cho 6 phiên Owner mở.
3. **Phạm vi:** đủ 6 gói như lượt 2, không chỉ phần đổi sau lượt 2.
4. **Sau lượt 3:** sửa hết, như lượt 2. Đề xuất lúc hỏi là "Medium trở lên chặn, Low / Nit Owner chọn"; Owner chọn sửa hết.

Phần còn lại của kế hoạch (máy Home PC, SHA ghim `119e2e4`, mốc so §L3.6, script Phụ lục I) Owner duyệt ở PR của #713 (G1).

## Phụ lục I — Workflow và prompt Claude (lượt 3)

*Không dùng (Owner 20/10, §L3.1). `prompt-claude.md` đã dùng có quy tắc riêng sửa theo cách chạy lượt 2 (mỗi gói một phiên; subagent / Workflow chỉ khi Owner bật ultracode, chỉ phiên chính ghi báo cáo): `docs/reviews/raw/2026-10-21/common-prompt-claude.md`.*

Hai file trong `common\`:

- `workflow-claude.mjs` = script dưới, nguyên văn. Phiên điều phối chạy nó bằng công cụ Workflow (`scriptPath`, §L3.9).
- `prompt-claude.md` = đoạn prompt dưới + nguyên văn Phụ lục K. Mỗi subagent đọc file này.

```js
export const meta = {
  name: 'deep-review-1-6-luot-3-claude',
  description: 'Deep review Phase 1–6 lượt 3, phần Claude: gói A → F, mỗi gói một subagent context sạch, tuần tự',
  phases: [{ title: 'Review', detail: 'gói A → F, tuần tự, mỗi gói một subagent' }],
}

const ROOT = 'C:\\workspace\\deep-review-1-6-r3'
const ALL = ['A', 'B', 'C', 'D', 'E', 'F']
const from = (args && args.from) || 'A'
if (!ALL.includes(from)) throw new Error(`from phải là một chữ A…F, nhận: ${from}`)

const RESULT = {
  type: 'object',
  properties: {
    pkg: { type: 'string', description: 'chữ gói' },
    status: { type: 'string', enum: ['XONG', 'DỪNG'] },
    report: { type: 'string', description: 'đường dẫn báo cáo' },
    note: { type: 'string', description: 'XONG: một dòng tóm tắt; DỪNG: lý do và việc Owner cần làm' },
  },
  required: ['pkg', 'status', 'report', 'note'],
}

phase('Review')
const done = []
for (const pkg of ALL.slice(ALL.indexOf(from))) {
  const r = await agent(`Gói ${pkg}. Đọc và làm đúng ${ROOT}\\common\\prompt-claude.md`, {
    label: `gói ${pkg}`,
    phase: 'Review',
    schema: RESULT,
  })
  if (!r || r.status !== 'XONG' || r.pkg !== pkg) {
    log(`Dừng ở gói ${pkg}: ${r ? r.note : 'subagent không trả kết quả'}`)
    return { done, stoppedAt: pkg, result: r }
  }
  done.push(r)
  log(`XONG gói ${pkg} → ${r.report}`)
}
return { done }
```

Prompt:

> # Deep review Phase 1–6, lượt 3 — Claude
>
> **{GÓI}** = chữ gói (A…F) ở đầu tin nhắn giao việc; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn.
>
> Bạn là **reviewer Claude** của deep review Phase 1–6, **lượt 3**, **gói `{GÓI}`**, chạy như **một subagent của Workflow**: context sạch như một phiên sạch, chỉ đọc. Repo: worktree `C:\workspace\Project-2C-review`, detached ở SHA **`119e2e4`** (`119e2e45cbce54d8a3943757bd826a7f1e9b694f`). Chạy `git rev-parse HEAD` và `git status --short` trước; SHA lệch hay status không rỗng thì dừng (quy tắc riêng 6).
>
> Quy tắc riêng của Claude:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6-r3\codex\`, `C:\workspace\deep-review-1-6-r2\codex\`, `C:\workspace\deep-review-1-6\codex\`, `C:\workspace\deep-review-1-6\muse\`**, kể cả khi file nào gợi ý. Không liệt kê và không tìm kiếm (`rg`, `glob`, `find`, `ls -R`, `Get-ChildItem -Recurse`) trên `C:\workspace\`, `deep-review-1-6\`, `deep-review-1-6-r2\`, `deep-review-1-6-r3\`. Không đọc báo cáo lượt 3 của bên khác ở bất cứ đâu. Lỡ thấy thì dừng (quy tắc riêng 6).
> 2. Chỉ đọc:
>    - repo ở SHA trên, gồm báo cáo gốc lượt 1, 2 của mọi bên ở `docs/reviews/raw/2026-10-15/`, `docs/reviews/raw/2026-10-17/`;
>    - `C:\workspace\deep-review-1-6-r3\common\`;
>    - báo cáo Claude lượt 3 của các gói trước trong `…-r3\claude\` (mục đã báo ở gói trước thì chỉ dẫn ID);
>    - probe của chính Claude: lượt 2 trong `C:\workspace\deep-review-1-6-r2\claude\`, lượt 1 trong `C:\workspace\deep-review-1-6\claude\` (để chạy lại tái hiện).
> 3. Không gọi Agent tool / Workflow (không lồng subagent), không dùng skill `review-pr` / `code-review`. Không làm nghi thức phiên của repo (HANDOFF, `/handoff`, PR, Issue, merge, commit). Không chạy `gh` (thông tin Issue / PR sửa có ở `common\fixes.md`).
> 4. Ghi báo cáo vào `C:\workspace\deep-review-1-6-r3\claude\{GÓI}.md`, probe / bản chép / log vào `…-r3\claude\{GÓI}\`.
> 5. Gói F được đọc `…-r3\claude\A…E.md`. Không tổng hợp với bên nào khác.
> 6. **Kết quả trả về**, thay cho việc in dòng `XONG …` và "dừng, hỏi / báo Owner" của phần chung:
>    - `pkg` = `{GÓI}`;
>    - `status` = `XONG` khi báo cáo đủ mục và dòng đầu đã đổi thành `XONG — …`; `DỪNG` khi bước 0 không qua hoặc gặp điều phải hỏi Owner;
>    - `report` = đường dẫn báo cáo;
>    - `note` = một dòng tóm tắt (số phát hiện theo mức) khi XONG, hoặc lý do dừng và việc Owner cần làm.
> 7. Mục 1 của báo cáo ghi "Claude, subagent của Workflow lượt 3"; model / mức suy luận ghi như biết được, hoặc "theo phiên điều phối (`common\workflow-run.md`)".
>
> Phần chung dưới đây áp dụng đầy đủ.

## Phụ lục J — Prompt Codex (lượt 3)

File `common\prompt-codex.md` = đoạn dưới + nguyên văn Phụ lục K. Owner chạy Codex ở `C:\workspace\Project-2C-review-2`, **mỗi gói một phiên mới**, lần lượt A → F.

> # Deep review Phase 1–6, lượt 3 — Codex
>
> **{GÓI}** = chữ gói (một chữ A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer độc lập Codex** của deep review Phase 1–6, **lượt 3**, gói `{GÓI}`. Repo: worktree `C:\workspace\Project-2C-review-2`, detached ở SHA **`119e2e4`** (`119e2e45cbce54d8a3943757bd826a7f1e9b694f`). Chạy `git rev-parse HEAD` và `git status --short` trước; SHA lệch thì dừng và báo Owner.
>
> Về file quy tắc của repo (`CLAUDE.md`): đó là quy trình phát triển của Claude. Dùng để hiểu dự án, **không** làm nghi thức phiên (`/session-start`, HANDOFF, hook, skill, PR, Issue, merge, commit). Codex tham gia review đóng phase theo ADR-0001 phụ lục M2: chỉ đọc, không viết code.
>
> Quy tắc riêng của Codex:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6-r3\claude\`, `C:\workspace\deep-review-1-6-r2\claude\`, `C:\workspace\deep-review-1-6\claude\`, `C:\workspace\deep-review-1-6\muse\`**, kể cả khi file hay ai đó gợi ý. Không liệt kê và không tìm kiếm (`rg --files`, `rg -g`, `Get-ChildItem -Recurse`, `dir /s`) trên `C:\workspace\`, `deep-review-1-6\`, `deep-review-1-6-r2\`, `deep-review-1-6-r3\`. Không đọc báo cáo lượt 3 của bên khác. Lỡ thấy thì dừng và báo Owner.
> 2. Chỉ đọc:
>    - repo ở SHA trên, gồm báo cáo gốc lượt 1, 2 của mọi bên ở `docs/reviews/raw/2026-10-15/`, `docs/reviews/raw/2026-10-17/`;
>    - `C:\workspace\deep-review-1-6-r3\common\`;
>    - báo cáo của chính bạn trong `…-r3\codex\`;
>    - probe của chính Codex: lượt 2 trong `C:\workspace\deep-review-1-6-r2\codex\`, lượt 1 trong `C:\workspace\deep-review-1-6\codex\`.
> 3. Ghi báo cáo vào `C:\workspace\deep-review-1-6-r3\codex\{GÓI}.md`, probe / bản chép / log vào `…-r3\codex\{GÓI}\`.
> 4. Gói F được đọc `…-r3\codex\A…E.md`. Không tổng hợp với báo cáo nào khác, không tạo Issue, không đề xuất merge, không chạy `gh` (thông tin Issue / PR sửa có ở `common\fixes.md`).
>
> Phần chung dưới đây áp dụng đầy đủ.

## Phụ lục K — Phần chung của mọi prompt (lượt 3)

Nối nguyên văn vào cuối cả hai file `prompt-<bên>.md` của lượt 3. `<bên>` = thư mục kết quả của bên đó (`claude`, `codex`), `<ID>` = `CL3`, `CX3`.

> ## Phần chung
>
> ### Bước 0 — kiểm gói, trước khi đọc code
>
> Kiểm từng file bằng tên đầy đủ (`Test-Path` hoặc mở file); **không liệt kê, không tìm kiếm thư mục**:
>
> 1. `{GÓI}` phải là **đúng một chữ** trong A, B, C, D, E, F. Không phải → dừng, hỏi Owner.
> 2. `C:\workspace\deep-review-1-6-r3\<bên>\{GÓI}.md`:
>    - **chưa có** → làm mới;
>    - có, và **dòng đầu bắt đầu bằng `ĐANG LÀM`** → phiên trước bị cắt: **làm tiếp**. Đọc hết file và thư mục `<bên>\{GÓI}\`, giữ mọi phát hiện đã ghi, làm nốt; ghi rõ là phiên làm tiếp, từ đâu, bằng công cụ / model / mức nào;
>    - có, mà dòng đầu **không** bắt đầu bằng `ĐANG LÀM` → gói đã xong: dừng, hỏi Owner, không ghi đè.
> 3. Báo cáo lượt 3 các gói **trước** `{GÓI}` (thứ tự A → F) đã có đủ trong `…-r3\<bên>\` và không file nào còn dòng đầu `ĐANG LÀM`. Thiếu hay còn dở → dừng, báo Owner tên gói.
> 4. Đủ cả ba thì in đúng một dòng rồi làm tiếp, không chờ Owner: `Bắt đầu gói {GÓI} lượt 3 (<tên gói>) → <bên>\{GÓI}.md` (làm tiếp thì thêm `— làm tiếp phiên trước`).
>
> Với Claude (subagent của Workflow), "dừng, hỏi / báo Owner" là trả kết quả `DỪNG` kèm lý do (quy tắc riêng 6 của Claude).
>
> **Ghi báo cáo dần:** ngay sau bước 0, tạo `<bên>\{GÓI}.md` với dòng đầu `ĐANG LÀM — <bên> gói {GÓI} lượt 3, bắt đầu <giờ>` và mục 1 của báo cáo. Mỗi khi có dòng bảng R, kịch bản đã thử, phát hiện hay số đo thì **ghi ngay**. Chạy lệnh dài ở nền thì ghi vào file đang chờ gì trước khi chờ.
>
> **Cuối phiên**, khi báo cáo đủ các mục: đổi dòng đầu thành `XONG — <bên> gói {GÓI} lượt 3, <giờ xong>`.
>
> - **Codex** in đúng một dòng: `XONG gói {GÓI} lượt 3 → C:\workspace\deep-review-1-6-r3\codex\{GÓI}.md. Gói kế tiếp: <chữ kế tiếp> (mở phiên mới).` Gói F in: `XONG cả 6 gói lượt 3 của codex. Chờ Owner yêu cầu tổng hợp.`
> - **Claude** trả kết quả `XONG` (quy tắc riêng 6).
>
> ### Dự án và lượt này
>
> Project-2C: app desktop Tauri 2 + React, SQLite chạy trong webview qua sql.js; Rust chỉ ghi file, giữ API key, gọi OpenCode. App chạy offline, một người dùng, dữ liệu hiện là **giả lập**.
>
> - Phase 1–4: nhân sự / team, khách hàng N4–N1, KYC có cấu trúc, lịch hẹn và kết quả, hợp đồng, chỉ số và báo cáo, xuất Excel, backup.
> - Phase 5: AI copilot (`packages/ai`).
> - Phase 6: hàng đợi thay dữ liệu S-2, Thùng rác + khôi phục, hộp Xóa KH 5f, và từ đợt sửa lượt 2: **Dọn sạch Thùng rác** (xóa hẳn mọi bản ghi trong Thùng rác, giữ lại bản ghi còn được dùng; TR-11–TR-13).
>
> **Lượt 1** (SHA `8855345`, 14–15/10) tìm 67 vấn đề `DR6-01…67`. **Lượt 2** (SHA `4217ed4`, 17/10):
>
> - kiểm 59 DR6 lượt 1: 52 ĐÃ SỬA, 4 SỬA MỘT PHẦN, 3 HỒI QUY;
> - tìm 36 vấn đề mới `DR6-68…103`: 1 Medium (hồi quy do chính đợt sửa lượt 1), 23 Low, 12 Nit;
> - kết luận CHƯA SẴN SÀNG.
>
> Owner chọn sửa hết. 12 Issue sửa (#652–#663) và 6 Issue khác đã merge (diff `4217ed4..119e2e4`), trong đó có tính năng mới Dọn sạch Thùng rác và đợt G5 `@3`. **Lượt 3 có hai phần ngang nhau, cả hai bắt buộc:**
>
> 1. **Kiểm phần đã sửa (trục R).** Mỗi DR6 mà gói kiểm (`common\known.md` phần 3, cột "Gói kiểm") có một dòng bảng R:
>    - chạy lại tái hiện của lượt 2 (của lượt 1 với DR6-17, 23, 24);
>    - gỡ tạm phần sửa (trên bản chép, hoặc patch gỡ ngay), xem test của PR sửa có đỏ;
>    - thử biến thể gần.
>
>    Kết luận: **ĐÃ SỬA** (đường lỗi cũ đã hết, có test đỏ khi gỡ phần sửa; biến thể còn hở ghi thành phát hiện riêng) · **SỬA MỘT PHẦN** (một phần của mô tả DR6, của Issue sửa hay của quyết định Owner chưa làm) · **CHƯA SỬA** · **HỒI QUY** (phần sửa làm hỏng chỗ trước đó đúng). Ba kết luận sau kèm một phát hiện có trường "Liên quan: DR6-xx". Mục sửa bằng tài liệu (DR6-95, 96, 97, 98): kiểm dòng ghi có và khớp app / số đo. Thêm: số đo không xấu hơn mốc Home PC sau #656 (`common\baseline.md`); DR6-79 nhanh hơn mà đề xuất không đổi; DR6-103 gộp luật mà hành vi không đổi.
> 2. **Tìm lỗi mới và edge case mới** trên **toàn bộ** phạm vi gói, không chỉ quanh chỗ đã sửa.
>    - Ưu tiên lỗi do chính đợt sửa lượt 2 gây ra (lượt 2 có 3 hồi quy, trong đó Medium duy nhất), nhất là **Dọn sạch Thùng rác**: `risk:high`, xóa hẳn dữ liệu, chưa lượt nào đọc.
>    - Rồi tới kịch bản / biên **chưa có trong báo cáo lượt 1, 2**. Đọc `docs/reviews/raw/2026-10-15/`, `docs/reviews/raw/2026-10-17/` và hai bản tổng hợp để biết đã thử gì.
>    - Báo cáo có mục **"Kịch bản mới đã thử"**: mỗi kịch bản một dòng, kể cả khi không thấy lỗi. Mỗi gói nên có ít nhất 5; gói F ít nhất 5 chuỗi nhiều bước qua nhiều gói.
>    - Chỗ hai lượt trước ghi "đã xét, không thấy" vẫn đáng xét lại.
>
> Thông tin từng Issue / PR sửa (mục tiêu, test chấp nhận, phần PR ghi lệch / chưa làm): `common\fixes.md`. Diff một PR: `git show <commit>` (bảng commit ở `plan.md` §L3.2).
>
> ### Kế hoạch và phạm vi gói
>
> Kế hoạch đầy đủ: `C:\workspace\deep-review-1-6-r3\common\plan.md`. Lượt 3 ở §L3.1–§L3.11; trục và thước mức ở §4; định dạng ở §L3.8 (và §L2.8). Phạm vi gói như lượt 1–2 (luật xếp gói của `tools/size-report-core.mjs`; đọc thêm chỗ code gói khác mà gói nối vào):
>
> | Gói | Đường dẫn | SP / test ở `119e2e4` | DR6 kiểm (R) | Trọng tâm mới (phần 2) |
> |---|---|---|---|---|
> | A. Lõi dữ liệu | `packages/domain/**`, `packages/db/**` | 8 189 / 13 885 | 68, 69, 71, 72, 84, 87, 92, 103 | **Dọn sạch ở lệnh** (`purge.ts`): `previewPurge`, `purgeTrash` và lý do giữ lại của `listTrash` dùng một hàm tập giữ lại (TR-12); thứ tự khóa ngoại trong một transaction, lỗi giữa chừng không đổi gì. Migration `0011` nới trigger chặn xóa của `kyc_notes` / `kyc_facts` / `ai_analyses` **chỉ** cho dòng của KH đã xóa mềm: thử dòng của KH đang dùng, KH xóa rồi khôi phục, dòng tự xóa riêng. Nhập backup sau khi dọn; D1–D13. "Nhóm của ngày" trước ngày tạo KH; E20 theo `seq` (hai máy lệch giờ, cùng mili giây); khôi phục chuyển nhóm đúng KH; `normalizeText` mới ở lệnh ↔ nhập backup; luật D7 một nơi |
> | B. File và Rust | `apps/desktop/src-tauri/**`, `apps/desktop/src/data/**` trừ file AI | 2 207 / 4 810 | 73–76, 84, 88 | Dọn sạch qua hàng đợi thay thế S-2 (`AppData.purgeTrash`): chờ lưu, backup trước, chặn ghi; tắt app giữa lúc dọn / lúc `VACUUM`; lần lưu trước đang lỗi; kết quả AI về trong lúc dọn. `integrity_check` lúc mở (file lớn, file bị giữ); file chỉ đọc → `ACCESS_DENIED`; màn lỗi khởi động. Key tới hai lớp escape theo từng đoạn (`ai.rs`): dạng ba lớp, đoạn rất ngắn, che trong thông điệp lỗi |
> | C. AI | `packages/ai/**`; file AI của app (`ai-*`, `*-ai-*`, `*Ai.tsx`, `KycExtraction`, `KycIntelligence`, `KycWebSession`, `KycHistory`, `extraction-view`) | 5 357 / 6 464 | 17, 23, 24, 77–79, 89, 97, 102 | Đợt G5 `@3` (`phase-5-prompts.md` §11): so khớp bỏ dấu theo từng chữ, ký tự vô hình ở V3–V6, chi tiết V1, trần chuỗi gốc, "kỉ" / "qui" — chặn đủ và không chặn nhầm trên văn bản thật (eval 10/10, 11/10, seed, `vi.ts`). `prompt_version` `@3` ở seed và ChatGPT web (`analysis@3+web@1`), phân tích cũ `@2`. Mock trích xuất đọc một lượt: chủ thể, câu giả định, "con" là loại từ, dấu câu |
> | D. Màn nhập liệu | `packages/ui/**` (trừ `scripts/`), `apps/desktop/src/{shell,i18n}/**`, `routes/customers/**` (trừ file AI và Hợp đồng), `routes/team/**`, `routes/Screen.tsx`, `apps/desktop/src/*`, `apps/desktop/index.html` | 7 329 / 2 165 | 72, 75, 80–83, 90, 96, 100, 101 | Hộp 9b đếm như lệnh (lịch của KH trong Thùng rác, trước / sau khi dọn), câu `person.inUseTrash` / `inUseSupportTrash`; hộp 5f mới. `Dialog`: đích focus dự phòng ở mọi hộp; `headerHidden`. `overflow-wrap` / `min-w-0` (chuỗi liền, emoji, ở 1 100 / 1 440); cuộn về đầu khi đổi màn (trừ khi về thẻ vừa xem); màn lỗi khởi động; đọc lại tiền KYC trên chữ đã chuẩn hóa |
> | E. Lịch hẹn, chỉ số, quản lý | `routes/{appointments,overview,reports}/**`, `routes/{Overview,Settings*,RestoreDialog,FilterBar}.tsx` (trừ `SettingsAi.tsx`), `routes/{trash-view,period-labels,applied-filter}.ts`, Hợp đồng (`routes/customers/{CustomerPolicies,PolicyDialogs,policy-form}.*`) | 7 756 / 4 146 | 68, 70, 83, 84, 91, 93–95, 99, 103 | **Màn Dọn sạch Thùng rác** (11h–11j): nút bật / tắt (mọi bản ghi được giữ lại); số đếm theo loại khớp lệnh; gõ DỌN SẠCH (khoảng trắng, chữ thường, dán); "Đang dọn…" không đóng được hộp; thông báo tên file backup; dòng giữ lại kèm lý do; câu nhắc từ 1 000 bản ghi (999 / 1 000); số Tổng quan / Báo cáo / Excel không đổi sau khi dọn (D2, D3); góc nhìn / bộ lọc không ảnh hưởng. 6f nêu hậu quả khi dời ngày; chữ Thùng rác TR-3 / E20; nút khôi phục HĐ có FYP; ô nhóm 6c trước ngày tạo KH |
> | F. Xuyên gói, bloat / hiệu năng, công cụ | `tools/**`, `e2e/**`, `.github/**`, `.githooks/**`, `.claude/**`, `packages/ui/scripts/`, `apps/desktop/vite.config.ts`, file gốc repo; **luồng xuyên gói; toàn codebase cho bloat và hiệu năng** | 4 340 / 14 165 | 69, 76, 84 (đo), 85, 86, 92, 98; **bảng R gộp đủ 39 DR6** | Công cụ mới / đổi: `notes-for.mjs` / `notes-core.mjs` (T-261), `ts-hooks*.mjs` (T-265), `pr-status` đọc đủ commit từ tested base, `retro.mjs` nhiều thư mục cấu hình, `.claude/settings.json` (M8). E2E mới / đổi (`trash`, `appointment-outcome`, `team`). Chuỗi nhiều bước, vd. xóa → dọn sạch → xuất / nhập backup → mở lại từ bản backup tự động → chỉ số; mở `Project2C-data\` do exe lượt 2 (`4217ed4`) tạo bằng exe lượt 3 (migration `0011`). Bloat / bundle / exe so lượt 2; đo Dọn sạch; kết luận SẴN SÀNG / CHƯA SẴN SÀNG |
>
> ### Đọc trước
>
> - Như lượt 1–2: `CLAUDE.md` (gốc + của package trong gói), `CONTEXT.md`, `docs/design/phase-6-hoan-thien.md` (§4 S-2, Thùng rác, nay có TR-11–TR-13 và D1–D13; §5 ngưỡng).
> - Spec / golden / mockup theo gói:
>   - A: `phase-3-du-lieu.md` §4, §6, `phase-4-chi-so.md`, `docs/golden/{chi-so,kh-theo-nhom,kyc,lich-hen}.md`, ADR-0007, ADR-0008 (gồm phụ lục dọn Thùng rác);
>   - B: ADR-0016, ADR-0009 phụ lục D-1, spec Phase 6 §4.1;
>   - C: `phase-5-ai.md`, `phase-5-prompts.md` (gồm §11), `docs/golden/ai-eval.md`, ADR-0009;
>   - D / E: `docs/design/mockups/` (gồm `trash.html` 11h–11j) và spec Phase 3 / 4 / 6, mục "Lệch mockup đã biết" của `docs/testing/nghiem-thu-v1.md`;
>   - F: tất cả khi cần, `docs/metrics/phase-6.md`, `e2e/perf/README.md`.
> - Thêm cho lượt 3: tổng hợp lượt 2 `docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` (§3 bảng R, §5–§6 mô tả DR6-68…103, §7 số đo, §9 quyết định Owner), tổng hợp lượt 1 `docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md`, `common\known.md`, `common\fixes.md`, `common\baseline.md`.
> - **Spec, golden, mockup đã duyệt là nguồn đúng**: không đề xuất sửa chúng cho khớp code; chỗ chúng mâu thuẫn nhau thì báo là phát hiện trục C.
>
> ### Quy tắc chung
>
> 1. **Chỉ đọc và chạy lệnh: không sửa file trong repo, không sửa lỗi, không commit, không viết code sản phẩm.**
>    - Muốn thử "phá code" (đột biến, gỡ phần sửa) thì chép file vào thư mục kết quả của mình rồi chạy bản chép. Nếu buộc phải patch trong repo thì gỡ ngay sau khi chạy và kiểm lại bằng `git status` / sha256.
>    - **Không chạy `pnpm install` trong bản chép repo** (lượt 2 làm junction `node_modules` của worktree trỏ sang bản chép): dùng junction sẵn có hoặc `--ignore-workspace`.
>    - Cuối phiên `git status --short` của repo phải như đầu phiên (thư mục build / cache bị ignore thì không sao).
> 2. **Không gọi dịch vụ AI của sản phẩm:** không `pnpm eval:ai` / `node tools/eval-ai.mjs`, không bấm "Kiểm tra kết nối" bằng key thật, không đọc / in key trong Windows Credential Manager (`cmdkey`…), không mở chatgpt.com. Dùng adapter Mock, `fetch` / HTTP giả, hoặc server HTTP local tự dựng trong thư mục của mình. **Mọi probe trình duyệt chặn mạng ngoài `127.0.0.1` và thay `window.open` ngay từ lần chạy đầu.**
> 3. `pnpm e2e` dùng cổng cố định 4173: không chạy cùng lúc với bên khác; báo cổng bận thì chờ, **không** dùng `PW_REUSE=1`. Kết quả cổng ở SHA ghim đã có ở `common\baseline.md`, không bắt buộc chạy lại toàn bộ. Số bundle lấy ở `baseline.md`; tự `pnpm build:web` thì không đặt biến môi trường riêng (vd. `VITE_DEMO_ANCHOR`), hoặc ghi rõ đã đặt gì.
> 4. Môi trường Windows: `pnpm` lỗi trong shell hiện tại thì chạy qua `powershell -NoProfile -Command "pnpm …"`. Không dùng `python3` (stub, có thể treo). Script tạm viết bằng `node` (`.mjs` trong thư mục của mình). Probe PowerShell **không dùng hai biến chỉ khác hoa / thường** (PowerShell coi là một).
> 5. Mục có trong `common\known.md` (sổ OPEN / ACCEPTED, quyết định Owner K1–K29, các DR6 hoãn / chấp nhận) gắn `KNOWN`, chỉ nêu khi có bằng chứng mới. 39 DR6 của bảng R chỉ ghi ở bảng R, không ghi lại thành phát hiện; phần sửa còn thiếu / hồi quy thì ghi phát hiện mới "Liên quan: DR6-xx". DR6 đã sửa ở lượt 1, 2 hỏng lại → phát hiện mới, "Liên quan: DR6-xx".
> 6. **Kết luận về màn** dựng probe qua lớp dữ liệu của app (`apps/desktop/src/data`: `openAppData`, `tables`; hoặc chạy trên bản build), không gọi thẳng lệnh `db` / chèn SQL thô. Probe `db` thô chỉ để kết luận về lệnh.
>
> ### Cách tìm
>
> - Đọc sâu **từng file** trong phạm vi gói (phần diff sửa `4217ed4..119e2e4` đọc kỹ nhất). Đi qua **mọi trục**: R kiểm phần đã sửa · E edge case · C đúng hợp đồng / spec / mockup / nhãn UI theo nghĩa thường · D dữ liệu · G guardrail AI · S an toàn ở ranh giới · P hiệu năng · B bloat · T chất lượng test · A trợ năng / i18n (định nghĩa ở `plan.md` §4.1, §L2.4). Trục không có gì thì ghi "đã xét, không thấy" **kèm đã chạy / đọc gì**.
> - **Chạy thử thay vì lập luận từ spec** ở mọi chỗ chạy được. Ưu tiên **kịch bản nhiều bước qua nhiều gói**: các lỗi Medium của lượt 1, 2 đều chỉ lộ khi dựng chuỗi (xóa → đổi → khôi phục; bàn giao → ghi kết quả → hẹn tiếp → chỉ số; ghi bù cuộc gặp trước ngày tạo KH). Đừng báo lại chính các ca đó (đã sửa, nằm ở bảng R hay KNOWN) — dùng chúng làm mẫu để nghĩ ca mới.
> - **Bloat và Hiệu năng là hai mục riêng bắt buộc** (kể cả khi không có phát hiện), mỗi mục một bảng: đã chạy / đo gì, trên dữ liệu nào, số, ID phát hiện. Công cụ như lượt 1–2 (`tsc --noUnusedLocals --noUnusedParameters`, `rg`, `pnpm codemap`, `pnpm lint:deps`, `pnpm build:web`…).
> - Hiệu năng: **mọi phát hiện P phải có số đo** trên dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (sinh lại ở SHA lượt 3; hash ở `plan.md` §L3.6; dùng trong Node qua `importBackup` của `@p2c/db`, trong app qua Cài đặt → Dữ liệu → Nhập backup). So với ngưỡng `docs/metrics/phase-6.md` và với mốc Home PC (`plan.md` §L3.6: mốc sau #656, lượt 2 cùng máy; luật nhiễu: quá 20 % **và** quá 10 ms). Ghi máy và việc gì đang chạy song song. Đo trên exe: chép `common\exe\project2c.exe` vào thư mục của mình, cổng debug khác 9222, theo `e2e/perf/README.md`; không đo khi bên khác đang đo.
> - **Không cài công cụ mới** (`knip`, `jscpd`, `cargo-bloat`, visualizer… là G4); thấy cần thì ghi đề xuất.
> - Không bình luận phong cách / đặt tên trừ khi gây lỗi. Không đặt chỉ tiêu số lượng phát hiện; không nâng mức cho nổi.
>
> ### Khuôn phát hiện
>
> ```
> ID: <ID>-<gói><số>   (vd. <ID>-A3)
> Mức: Critical | High | Medium | Low | Nit
> Trục: R | E | C | D | G | S | P | B | T | A
> Vị trí: path:dòng (119e2e4)
> Tình trạng: CONFIRMED | PLAUSIBLE | KNOWN
> Liên quan: DR6-xx (nếu có) · mới do đợt sửa lượt 2 (PR #…) | có từ trước, lượt 1–2 bỏ sót
> Kịch bản: số dòng ở mục "Kịch bản mới đã thử" (nếu có)
> Mô tả: một-hai câu
> Tái hiện / bằng chứng: lệnh + kết quả, hoặc probe / test tạm (nguồn ở phụ lục)
> Ảnh hưởng: ai / khi nào gặp
> Đề xuất: hướng sửa ngắn; cỡ ước lượng (≤ 400 dòng SP?)
> ```
>
> - **Thước mức** (như lượt 1–2): Critical = mất dữ liệu đã lưu, hỏng file DB, lộ API key, chạy được code lạ — ở thao tác bình thường. High = thao tác bình thường làm dữ liệu sai lặng lẽ (lan sang chỉ số / báo cáo / backup mà người dùng không nhận ra) hoặc chặn hẳn việc chính không có đường vòng. Medium = thao tác bình thường dẫn tới dữ liệu sai / không đảo ngược được hoặc chặn việc chính (có đường vòng); thao tác chính vượt ngưỡng hiệu năng đã chốt. Low = cần điều kiện hiếm (file sửa tay, output suy biến, server bất thường, thao tác UI không cho), chỉ sai hiển thị, test hở, bloat có chi phí đo được. Nit = chữ, dọn dẹp, bloat không đo được chi phí.
> - **Bằng chứng phải thật.** Mỗi `path:dòng` phải đúng với file ở SHA ghim (đọc lại trước khi ghi). `CONFIRMED` chỉ khi đã chạy lệnh / probe và dán lệnh + trích kết quả thật; chưa chạy thì `PLAUSIBLE` và nói đã đọc gì. Không bịa số đo, tên hàm, tên test hay kết quả lệnh.
>
> ### Báo cáo
>
> File `C:\workspace\deep-review-1-6-r3\<bên>\<gói>.md`, tiếng Việt, gồm theo thứ tự:
>
> 1. Bên, gói, SHA đầu phiên, `git status --short` đầu phiên, giờ bắt đầu, công cụ / model / mức suy luận.
> 2. **Bảng R** mọi DR6 mà gói kiểm: `| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |`.
> 3. Phạm vi đã đọc (file, dòng; phần diff sửa của gói).
> 4. **Kịch bản mới đã thử**: `| # | Kịch bản | Kết quả | ID |`.
> 5. Phát hiện mới theo khuôn trên.
> 6. Mục **Bloat** và mục **Hiệu năng** (bảng số, so mốc sau #656 và lượt 2).
> 7. Bảng đếm mức × trục; nói rõ nếu tỉ lệ PLAUSIBLE cao.
> 8. "Đã xét, không thấy" theo từng trục.
> 9. Phụ lục: nguồn probe / test tạm / đột biến (cái nào bị test giết, cái nào sống), `git status --short` cuối phiên, giờ xong.
>
> **Gói F** thêm **bảng R gộp đủ 39 DR6** (từ báo cáo A–E lượt 3 của chính bạn + phần F) và kết luận **SẴN SÀNG / CHƯA SẴN SÀNG cho v1.0 ở SHA `119e2e4`** kèm lý do.
>
> Xong gói thì làm như mục "Cuối phiên" của Bước 0. Không tổng hợp, không so với bên khác, không tạo Issue, không đề xuất merge.

# Lượt 4

Kế hoạch lượt 4 (T-309 #854), soạn 27/10/2026 trên Home PC, sau khi T-305…T-308 (#849–#852) đóng. ADR-0001 phụ lục M9 coi lượt 3 là lượt cuối trước G7; Owner thêm lượt 4 ngày 26–27/10 (phụ lục M10, §L4.11). Mục nào không nói khác thì giữ như lượt 3 theo bản sửa 20/10 (§L3.1–§L3.11: mỗi gói một phiên sạch, không phiên điều phối), và qua đó như lượt 1–2.

Owner bổ sung 27/10, sau khi bản nháp đã soạn (§L4.11 mục B1, B2):

- **thêm DeepSeek v4.1 Flash** làm bên review thứ ba;
- **lượt 4 chỉ chạy khi mọi ghi chú OPEN của sổ đã sửa hết.** SHA ghim vì vậy chưa biết lúc soạn. Số đo trong phần này lấy ở `a59ef07` (`main` lúc soạn); bước chuẩn bị đo lại ở SHA ghim. Prompt ghi `{SHA}`, bước chuẩn bị thay bằng SHA ghim (§L4.9 bước 4).

| Yêu cầu | Mục |
|---|---|
| #854 test 1: SHA ghim lượt 4 sau khi #849–#852 đóng; từ đó tới lúc chạy chỉ có docs | §L4.2, §L4.9 bước 1 |
| #854 test 2: prompt các bên đủ hai phần; KNOWN lượt 4 đủ nguồn; lệnh so số đo với mốc Home PC sau #656 | §L4.4, §L4.5, §L4.6, Phụ lục L, M, N, O |
| #854 test 3: bảng R khớp tổng hợp lượt 3 (§3, §6, §8.4, §8.5) và các Issue sửa sau đó | §L4.5 phần 4, 5 |
| #854 test 4: đề xuất ghi rõ Owner chọn gì, có ngày | §L4.11 |
| #854 hợp đồng: bảng R theo mã `DR6-*`, rồi phát hiện mới với ID theo bên, không trùng `CL4-*` / `CX4-*`; ghi model các bên | §L4.2, §L4.8, Phụ lục L, M, N, O |
| Owner 27/10: thêm DeepSeek v4.1 Flash | §L4.1, §L4.2, §L4.7, §L4.9, Phụ lục O, P |
| Owner 27/10: chỉ chạy khi sổ OPEN rỗng | §L4.2, §L4.5 phần 1, §L4.9 bước 1 |
| Owner 28/10: DeepSeek qua app desktop WorkBuddy, gói WorkBuddy Pro (T-315 #880, thay T-313 #868) | §L4.1, §L4.2, §L4.7, §L4.8, §L4.9, §L4.10, §L4.11, Phụ lục O, P |

## L4.1 Mục tiêu, bên review

Owner chốt 26–27/10/2026 (§L4.11 mục 1, 2, B1, B2), và đổi cách chạy DeepSeek hai lần ngày 28/10 (§L4.11):

- **Một vòng deep review toàn bộ code trước G7** (26/10), sau khi các mục sổ OPEN làm được trước vòng này đã xong (T-305…T-308).
- **Chỉ chạy khi mọi ghi chú OPEN của sổ đã sửa hết** (27/10), kể cả các mục [G7]. Ở `a59ef07` sổ còn 14 mục [G7]; chúng sửa ở một đợt trước lượt 4 (§L4.2, đề xuất 8).
- **Ba bên:**
  - **Claude Opus 5.5** (27/10): như lượt 3, Owner mở **mỗi gói một phiên sạch** ở `C:\workspace\Project-2C-review`. Mức suy luận và ultracode Owner chọn từng phiên (M1, M8). Phiên bật ultracode được dùng subagent / Workflow cho việc của gói; chỉ phiên chính làm bước 0, ghi `{GÓI}.md` và in dòng `XONG`.
  - **Codex, model GPT Sol 6.1** (27/10): Owner chạy, mỗi gói một phiên mới, chỉ đọc, không viết code (M2).
  - **DeepSeek v4.1 Flash** (Owner bổ sung 27/10), trong **app desktop WorkBuddy** của Tencent, dùng model gắn sẵn của gói **WorkBuddy Pro** bản quốc tế. Owner chọn ngày 28/10, thay cách chạy của bản 27/10 và bản sửa đầu ngày 28/10 (§L4.11); G4 / G6 duyệt 28/10 ở #880. Owner chạy, mỗi gói một task mới, chỉ đọc, không viết code. Báo cáo là dữ liệu tham khảo như Codex (M2, M10). Bỏ DeepSeek ở lượt 1 (M5, 13/10) không còn áp cho lượt 4.
  - 6 gói × 3 bên = **18 báo cáo**, chạy **hai đợt** như lượt 1 và review Phase 5 (đề xuất 9, Owner chọn 27/10): đợt 1 Claude + Codex song song; đợt 2 DeepSeek một mình, khi thư mục của hai bên kia đã bị chặn ACL.
- **Hai phần ngang nhau** như lượt 2–3:
  1. **kiểm phần đã sửa** (trục R): mọi DR6 và mục KNOWN đã sửa sau lượt 3, và từng Issue gom ghi chú sổ (§L4.4);
  2. **tìm lỗi mới và edge case mới** trên **toàn bộ** phạm vi gói.
- **Sau tổng hợp:** đề xuất sửa hết như lượt 3, rồi G7 (đề xuất 6).

**Vì sao cần lượt 4:** từ SHA ghim lượt 3 (`119e2e4`) tới nay có ba đợt mà chưa lượt deep review nào đọc trọn.

- **Đợt sửa lượt 3** (21–23/10): 11 Issue #719–#729 cho DR6-104…134, cùng #735 (T-280), #752 (T-281), #756 (T-282, tài liệu).
- **Đợt sửa sổ OPEN trước v1.0** (23–26/10; Owner 23/10, #771): 22 Issue T-283…T-304, mỗi Issue gom nhiều ghi chú sổ. 8 PR của đợt này vượt ngưỡng cỡ (`docs/metrics/phase-6.md` mục "Kích thước PR vượt ngưỡng": #801, #805, #812, #828, #833, #835, #845; #817 ở biên).
- **Trước vòng review** (27/10): T-305…T-308, gồm đổi tên hiển thị sang Heritas L-CRM (T-308: khối logo, font slogan, icon, tiêu đề cửa sổ, file build exe).

Thêm đợt sửa mục OPEN còn lại trước lượt 4 (đề xuất 8). Ba đợt đã merge: diff `119e2e4..a59ef07` ngoài `docs/**` và mọi file `*.md` có 269 file, +14 559 / −3 383 dòng. Đợt sửa lượt 2 mà lượt 3 kiểm chỉ có 119 file, +7 742 / −1 050. Ba đợt có thêm:

- một migration (`0012_trash_lookups`);
- luật mới ở nhập backup (bảy luật T-291, mốc `precision: 3`, U+FEFF);
- đợt G5 `@4`, và `zod/mini` thay `zod` đầy đủ;
- trạng thái lưu mới: chỉ báo ở sidebar, nút Thử lại, đóng app chờ lần thay đang chạy;
- hộp gõ chữ xác nhận dùng chung cho Nạp lại và Dọn sạch.

Các lượt trước cho thấy đợt sửa sinh lỗi mới. Lượt 2 có 3 hồi quy, trong đó có Medium duy nhất. Lượt 3 không có hồi quy, nhưng chỗ hở nằm nhiều ở code mới của đợt sửa trước nó: DR6-125, 128 (Dọn sạch), DR6-115 (câu 9b, #669 / #710), DR6-122 (G5 `@3`, #698).

## L4.2 SHA ghim, đợt sửa, chỗ làm

**SHA ghim lượt 4 = `main` khi sổ OPEN rỗng** (Owner 27/10, B2): mục OPEN của `docs/state/review-notes.md` ở `main` không còn mục lá nào. Thứ tự:

1. PR kế hoạch này merge (G1), rồi PR sổ ghi chú review của nó.
2. Đợt sửa mục OPEN (đề xuất 8): sửa 14 mục [G7] ở `a59ef07`, ghi chú không chặn mà review kế hoạch này ghi thêm, và ghi chú mới của review các PR sửa đó.
3. Sổ OPEN rỗng → bước chuẩn bị ghim `main` lúc đó (§L4.9 bước 1).

Từ SHA ghim tới lúc chạy chỉ có thay đổi docs.

**Lúc soạn:** `a59ef07` (`a59ef0762f0023c9771f3fedb7f4b1c393179f2f`, `main` 27/10/2026 sau #862).

- Mọi Issue của ba đợt đã đóng; #852 (T-308) đóng 27/10 15:26 UTC qua #861. Milestone Phase 6 không còn Issue mở nào ngoài #854.
- Code giống `c4eec8b` (#861); sau đó chỉ có `docs/state/review-notes.md` (#862).
- CI của PR #861 xanh ở head `97e9420`, cây trùng `c4eec8b` (`git diff 97e9420 c4eec8b` rỗng): run `40519703994`, job Verify (`pnpm verify` + `pnpm e2e`) và Build portable exe (fmt, clippy, `cargo test`, `pnpm build:exe`).
- Mọi số đo của §L4.2, §L4.3, §L4.6 lấy ở `a59ef07`. Bước chuẩn bị đo lại ở SHA ghim và chạy lại cổng (§L4.9 bước 5, 6); số ở `common\baseline.md` là số dùng.

**Đợt sửa = diff `119e2e4..{SHA}`.** Lúc soạn (`119e2e4..a59ef07`), ngoài `docs/**` và mọi file `*.md`: 269 file, +14 559 / −3 383 dòng (`git diff --numstat`, tính cả test, migration; 12 file nhị phân: icon, font, ảnh logo). Một migration mới `0012_trash_lookups` (hai chỉ mục, không đổi dữ liệu). 35 PR có code hoặc test; #845 merge bằng `--merge` (ba commit).

Đợt sửa lượt 3 (Owner duyệt cách sửa 21/10, tổng hợp lượt 3 §9; cột DR6 là vấn đề lượt 3 mà Issue sửa):

| Issue | Việc | DR6 | PR | Commit |
|---|---|---|---|---|
| #719 T-268 | Đồng hồ e2e cố định, test công cụ `notes-core` | 129, 130 | #736 | `1276ccd` |
| #720 T-269 | Khôi phục theo E7, mốc thời gian dạng app ghi, một hàm nhóm của ngày | 104–106, 126 (a, b, d), 134 | #740 | `33b6c33` |
| #721 T-270 | Chữ và tiền: U+FEFF, nửa surrogate, hộp gửi chữ gốc, ký tự điều khiển | 107–112, 126 (e, f) | #738 | `d3e51d0` |
| #722 T-271 | Dọn sạch: REPLACE không lách trigger, cột trỏ tới nhân sự một nơi, test tập giữ lại | 113, 114, 125, 126 (c), 132 (b) | #742 | `213a13e` |
| #723 T-272 | Câu Thùng rác của hộp 9b, focus màn Team & nhân sự | 115, 116 | #744 | `e63270f` |
| #724 T-273 | Chuỗi liền dài không tràn khung, panel AI vừa khung | 117, 118, 127 | #746 | `3fcdd4d` |
| #725 T-274 | Tên nút HĐ / Thùng rác phân biệt được, e2e hộp Dọn sạch và 6f | 119, 128 | #748 | `efbfa88` |
| #726 T-275 | Lưu file: nhận ra mất quyền ghi lúc mở, câu lỗi file chỉ đọc | 120 | #750 | `b91cc73` |
| #727 T-276 | Mock trích xuất bớt đề xuất sai | 121 | #753 | `cbdb590` |
| #728 T-277 | Đợt G5 lượt 3: `analysis@4`, `discovery@4` | 122–124 | #762 (G5 §12), #766 | `8b5ff6f`, `405ded1` |
| #729 T-278 | Tài liệu: tiền gõ dấu phẩy, ngoại lệ Dọn sạch, ví dụ chip prompt | 131, 132 (a), 133 | #755 | `4cc2a23` |
| #730 T-279 | Nâng mức `code-review` của skill `review-pr` (quy trình) | — | #731 | `cece0f9` |
| #735 T-280 | Thanh trên cùng không che phần tử nhận focus (mục KNOWN lượt 3, Owner 21/10 cho làm trước G7) | — | #760 | `018fdc4` |
| #752 T-281 | Thư mục dữ liệu cấm tạo file vẫn báo "chương trình khác" (phần còn của DR6-120, review #750) | 120 | #764 | `3753932` |
| #756 T-282 | Tài liệu: ghi chú không chặn của review #755 | 131–133 | #758 | `da0d3c8` |

Đợt sửa sổ OPEN trước v1.0 (Owner 23/10: sửa hết sổ trước v1.0; rà sổ, quyết định và nhãn ở #769, #770, #771, #791):

| Issue | Việc | PR | Commit |
|---|---|---|---|
| #772 T-283 | e2e / `tools`: helper dùng chung, đồng hồ / múi giờ, luật import, `pr-status`; ghi quyết định 23/10 | #792 | `f469639` |
| #773 T-284 | G3: mockup và token cho bốn chỗ đổi hình thức (tương phản, hộp 8d, panel mờ, dòng help 1a / 4a) | #795 | `f2465f8` |
| #774 T-285 | Hàm dùng chung vào `packages/domain` (ngày giờ, ngày ISO, bỏ dấu, chuẩn hóa so sánh, id ngẫu nhiên), API `nextKycVersion` | #799 | `7d5029a` |
| #775 T-286 | `packages/db`: gộp hàm lặp của lệnh, bỏ hàm chỉ test dùng (DR6-66, 67) | #801, #804 (spec, golden) | `228acac`, `931b9b8` |
| #776 T-287 | `packages/db`: tham chiếu nhân sự, Thùng rác / Dọn sạch, đếm RF, seed và test (migration `0012`) | #805 | `597c632` |
| #777 T-288 | `packages/ai`: hằng dùng chung với `db`, tách logic khỏi `retry.ts`, phạm vi export, version prompt trong test | #812 | `a5ff382` |
| #778 T-289 | Mock trích xuất: bớt đề xuất sai còn lại của review #753 | #809 | `33f7891` |
| #779 T-290 | `packages/ai`: cụm khớp trong `detail`, trích JSON khi bị cắt, ngưỡng test, message assistant rỗng | #820 (spec), #822 | `ccd07d7`, `d1a75e7` |
| #780 T-291 | Bảy luật duyệt 23/10 (G2 / G5): hash KYC và `output_json` khi nhập backup, output REJECTED lớn, chữ chỉ có ký tự vô hình, ngày nhanh đầu năm, thứ tự tên, VT / FF | #824 (spec), #828 | `cc65196`, `7cdc432` |
| #781 T-292 | `zod/mini` thay `zod` đầy đủ (DR6-25) | #830 | `78370a0` |
| #782 T-293 | Rust: `storage.rs`, `backups\` không đọc được, test `ai.rs`, tiêu đề cửa sổ exe theo màn | #807 | `f36935e` |
| #783 T-294 | Trạng thái lưu: chỉ báo lưu 10d, nút Thử lại trên dải lưu lỗi, đóng app khi đang lưu | #817, #819 (ghi chấp nhận) | `e7a11ba`, `0e1ac42` |
| #784 T-295 | Cài đặt → Dữ liệu và mở file: số liệu hộp 10c, kiểm file trước migrate, thông báo của mục, ChatGPT web | #825 | `10b5bd7` |
| #785 T-296 | Thùng rác và HĐ: hộp xác nhận dùng chung, tên nút theo ô, trạng thái HĐ, câu E20, hộp 8d | #833 | `b71239a` |
| #786 T-297 | KYC và AI: dòng thời gian theo mockup (bộ lọc, mã F), lỗi AI giữ khi đổi màn, hộp 3f, Cài đặt → AI | #835 | `f5fa622` |
| #787 T-298 | Hồ sơ KH và Lịch hẹn: hộp 5d, 6a / 6h, 6d, thẻ Lịch hẹn, ô ngoài tháng, focus khung Chi tiết | #838 | `49fcd2a` |
| #788 T-299 | Team, Báo cáo, Tổng quan: hộp nhân sự, bảng thành viên giữ cách sắp, bảng số cho chart N4–N1, bộ chọn kỳ | #841 | `b226cb9` |
| #789 T-300 | `packages/ui` và vỏ: token tương phản, `DataTable`, token-guard, ngưỡng nhánh, favicon, thanh trên cùng | #843 | `ff03c8a` |
| #790 T-301 | Dọn app: mã chết, hằng lặp, ký hiệu viết cứng (DR6-37, phần app của DR6-66, 67) | #845, #846 | `ab7e6e7`, `1976a66`, `df35e3c` (merge `5abef68`), `1fd8e9e` |
| #793 T-302 | Luật lint bắt `import()` động của `@playwright/test`; `docsRead` | #815 | `17601a3` |
| #797 T-303 | G3: mockup ô khóa, câu ngoài phạm vi của token viền ô nhập | #811 | `bb29ab6` |
| #831 T-304 | Luật lint chặn `zod` đầy đủ; mặc định của schema AI là mảng mới mỗi lần parse | #837 | `4f9082a` |

Trước vòng review (rà sổ 26–27/10, #853):

| Issue | Việc | PR | Commit |
|---|---|---|---|
| #849 T-305 | Class tiêu đề / huy hiệu ở `classes.ts`, `recordBadge`, `WEB_MODE.tone`, đồng hồ bộ chụp ảnh hướng dẫn | #855 | `fc40dfa` |
| #850 T-306 | Tài liệu: spec Phase 6 (S2-6, TR-3, hộp 11i, 150 KiB), nghiệm thu, hướng dẫn | #857 | `fa4023e` |
| #851 T-307 | Số đo Phase 6: bảng PR vượt ngưỡng, `integrity_check` theo MB, kết quả đợt sửa lượt 3 | #859 | `9f9d90e` |
| #852 T-308 | Tên và nhận diện Heritas L-CRM: khối logo, font slogan, icon, tiêu đề | #861 | `c4eec8b` |

**Đợt sửa mục OPEN trước lượt 4** (B2; chia Issue theo đề xuất 8, tạo sau G1; số T- dự kiến):

| Issue (dự kiến) | Mục OPEN ở `a59ef07` | Loại |
|---|---|---|
| T-310 PR nhỏ | Review #855: 4 tiêu đề còn viết thẳng `HEADING`; doc comment `stage-badge.tsx`. Review #861: `lang="en"` cho slogan (`Brand.tsx` và 6 mockup); hai token thương hiệu trong bảng token của `docs/design/mockups/index.html`; dòng `e2e/navigation.spec.ts:33`; một ca unit buộc tên "Heritas L-CRM" ở năm chỗ khớp nhau; ảnh logo trùng byte giữa mockup và app (chọn cách trong task). Thêm ghi chú code của review kế hoạch này nếu có (vd. năm file mới vào `PACKAGES` của `tools/size-report-core.mjs`, §L4.3) | code, `risk:low` |
| T-311 tài liệu | Review #859: danh sách "Test" của luật đếm thiếu `playwright*.config.ts`, `vitest.config.ts`; lệnh đếm dùng `base.sha` cho PR xếp chồng (`docs/metrics/phase-6.md`). Review #861: khối `.brand` vào bảng "Đối chiếu mockup → mã dòng" (`docs/testing/nghiem-thu-v1.md`). Thêm ghi chú tài liệu của review kế hoạch này nếu có | docs, `risk:low` |
| T-312 ảnh hướng dẫn | Review #760 (dòng đầu ảnh khi Playwright phải cuộn), #825 (`09-nap-lai.png`), #838 (`03-ket-qua.png`), #861 (`05-ho-so-kh.png` dưới 150 KiB với logo mới): chụp lại toàn bộ ảnh hướng dẫn với logo mới | ảnh + `e2e/guide`, `risk:low`, sau T-310 |

Ghi chú không chặn mà review các PR này ghi thêm cũng sửa trước khi ghim SHA (B2). Ảnh chụp ở T-312 là ảnh trước lượt 4. Đợt sửa lượt 4 đổi màn nào thì G7 chụp lại ảnh đó: NT-HD-01 so hướng dẫn với exe phát hành.

Mỗi PR code có PR sổ ghi chú review ngay sau. Ghi chú không chặn của chúng nằm ở KNOWN phần 1 nếu còn ACCEPTED, ở `fixes.md` nếu đã chuyển RESOLVED (§L4.5, §L4.9 bước 4).

Trong suốt lượt 4 **không merge code vào `main`** (như §2). PR docs merge được, không đổi SHA ghim.

| Bên | Ai chạy | Đợt | Làm ở | Thư mục kết quả | ID |
|---|---|---|---|---|---|
| Claude Opus 5.5 (mỗi gói một phiên sạch, tuần tự A → F) | Owner mở phiên | 1 | `C:\workspace\Project-2C-review` | `C:\workspace\deep-review-1-6-r4\claude\` | `CLR4-<gói><số>` |
| Codex, model GPT Sol 6.1 | Owner, mỗi gói một phiên mới | 1 (cùng lúc Claude) | `C:\workspace\Project-2C-review-2` | `…-r4\codex\` | `CXR4-<gói><số>` |
| DeepSeek v4.1 Flash (app desktop WorkBuddy, model gắn sẵn của gói WorkBuddy Pro) | Owner, mỗi gói một task mới trong app | 2 (một mình, đề xuất 9) | `C:\workspace\Project-2C-review` (Claude đã xong), là workspace của task; app chạy với cài đặt của Phụ lục P | `…-r4\deepseek\` | `DSR4-<gói><số>` |
| **Claude phiên tổng hợp** (Issue tạo sau khi lượt 4 chạy xong) | Owner yêu cầu, sau khi đủ 18 báo cáo | — | checkout chính | `docs/reviews/` qua PR docs | dùng nguyên ID trên |

- **ID theo bên:** `CL4-*` / `CX4-*` là ID của review đóng Phase 4 (`docs/reviews/2026-10-04-phase-4-tong-hop.md`), và review Phase 5 dùng `DS-*` cho DeepSeek. Lượt 4 dùng `CLR4-*` / `CXR4-*` / `DSR4-*` ("R4" = lượt 4; `rg` trên `docs/` ngày 27/10: 0 chỗ). Vấn đề đã gộp đánh số tiếp `DR6-135…`.
- **Vì sao hai đợt** (như lượt 1 §2 và review Phase 5): mọi bên chạy dưới cùng tài khoản Windows. ACL chỉ chặn được thư mục của bên **đã xong**, vì bên đang chạy còn phải ghi vào thư mục của mình. Đợt 2 chạy khi `claude\`, `codex\` của lượt 4 đã bị chặn ACL. App WorkBuddy không có luật chặn đọc theo đường dẫn (Phụ lục P), nên ACL là lớp duy nhất giữ DeepSeek khỏi hai thư mục đó, khỏi các bản sao của chúng (log phiên, bản sao file, scratchpad) và khỏi thư mục lượt 1–3 (§L4.9 đợt 2 bước 3). Phase 5 cũng cho thấy cần lớp này: DeepSeek gói E từng liệt kê thư mục gốc bị cấm (`docs/reviews/2026-10-10-danh-gia-deepseek-muse.md` §6). Thêm nữa, đợt 2 không va cổng e2e 4173 hay máy đo với hai bên kia.
- **Máy: Home PC `DESKTOP-KDURKJP`** (đề xuất 7). Mốc hiệu năng sau #656 và số đo lượt 3 cùng máy chỉ có ở máy này; app WorkBuddy phải cài trên máy này trước đợt 2 (Phụ lục P). Bước chuẩn bị, cả ba bên và mọi số đo chạy trên cùng máy.
- Thư mục lượt 1–3 (`C:\workspace\deep-review-1-6\`, `-r2\`, `-r3\`) có trên Home PC, giữ tới v1.0 (HANDOFF). Probe lượt 3 của Claude và Codex trong `deep-review-1-6-r3\<bên>\` là probe cùng máy, dùng lại được. DeepSeek chưa có probe nào ở 6D; ở đợt 2 cả ba thư mục bị chặn ACL.

## L4.3 Sáu gói, cỡ đo lại, diff sửa theo gói

Phạm vi từng gói **giữ đúng §3** (luật `PACKAGES` của `tools/size-report-core.mjs` không đổi từ lượt 1). Thứ tự vẫn A → F.

Năm file mới ở `apps/desktop/src/routes/` (đợt sổ OPEN) không khớp luật nào, nên `size-report` xếp vào dòng "Chưa xếp gói". Lượt 4 xếp tay:

- **D:** `classes.ts` (class dùng chung: tiêu đề, huy hiệu, focus, link…; T-301, T-305), `stage-badge.tsx` (huy hiệu nhóm), `money-view.ts` + `money-view.test.ts` (dòng đọc lại số tiền dưới ô của 6c / 6d, 7b / 7c, 8a / 8b): 54 dòng SP, 18 dòng test;
- **E:** `ConfirmWordDialog.tsx` (hộp gõ chữ xác nhận của Nạp lại 10c và Dọn sạch 11i, T-296): 67 dòng SP.

Gói kia đọc chỗ nối, vd. E đọc cách 6c / 6d, 8a / 8b gọi `money-view.ts`. Thêm năm file này vào `PACKAGES` là sửa code: ghi vào sổ ở PR sổ sau review của kế hoạch này, nên đợt sửa mục OPEN (T-310) làm luôn. Khi đó bước chuẩn bị bỏ dòng "Chưa xếp gói" và phần xếp tay.

**Cỡ đo lúc soạn** (`node tools/size-report.mjs` ở `a59ef07`, 27/10, Home PC; số dòng không phụ thuộc máy). Δ so với lượt 3 (`119e2e4`, §L3.3). Bước chuẩn bị đo lại ở SHA ghim (§L4.9 bước 6); đợt sửa mục OPEN nhỏ nên số đổi ít.

**Diff sửa** = dòng thêm / xóa của `git diff --numstat 119e2e4 a59ef07`, xếp gói bằng `classifyFile`. Không tính file sinh tự động; file Rust tính cả phần test trong file là SP, như §L3.3.

| Gói | SP (Δ) | Test (Δ) | Sinh (Δ) | File (Δ) | Diff sửa SP | Diff sửa test | R1 (mã DR6, mục KNOWN đã sửa) | R2 (Issue) |
|---|---:|---:|---:|---:|---|---|---|---|
| A. Lõi dữ liệu | 8 719 (+530) | 15 714 (+1 829) | 341 (+2) | 104 (+3) | +1 117 / −587 · 29 file | +2 116 / −287 · 25 file | 104–108, 110–114, 125, 126, 132 (b), 134, 25, 66, 67, CL3-A29 | T-285, 286, 287, 288, 291, 292 |
| B. File và Rust | 2 426 (+219) | 5 408 (+598) | 0 | 19 (0) | +740 / −218 · 7 file | +361 / −66 · 4 file | 120, 67, CL3-B2 | T-293, 294, 295, 306, 308 |
| C. AI | 6 027 (+670) | 7 539 (+1 075) | 0 | 63 (+3) | +1 290 / −620 · 28 file | +1 232 / −157 · 16 file | 108, 111, 118, 121–124, 133, 25, 66, 67 | T-288, 289, 290, 291, 292, 295, 297, 304 |
| D. Màn nhập liệu | 7 940 (+611) | 2 802 (+637) | 0 | 83 (+7) | +1 062 / −451 · 34 file | +679 / −42 · 12 file | 109, 110, 115–117, 120, 127, 132 (a), 37, 66, 67, CL3-B2 | T-280, 284, 287, 291, 293, 294, 297–301, 303, 305, 308 |
| E. Lịch hẹn, chỉ số, quản lý | 8 093 (+337) | 4 556 (+410) | 0 | 51 (0) | +906 / −569 · 28 file | +456 / −46 · 9 file | 110, 119, 128, 131, 134, 37, 66, 67, CL3-B2 | T-284, 291, 295, 296, 298, 299, 301, 305, 306 |
| F. Xuyên gói, bloat / hiệu năng, công cụ | 4 429 (+89) | 16 829 (+2 664) | 4 628 (0) | 96 (+5) | +137 / −48 · 6 file | +2 935 / −271 · 45 file | 129, 130, 25 (bundle), 66, 67, CL3-A29 (đo); **R1 gộp đủ 37 dòng** | T-283, 287 (đo), 292 (bundle), 300, 301, 302, 304, 305, 307; **R2 gộp đủ mọi dòng** |
| Chưa xếp gói (xếp tay ở trên) | 121 (+121) | 18 (+18) | 0 | 5 (+5) | +121 / −0 · 4 file | +18 / −0 · 1 file | | |
| **Tổng** | 37 755 (+2 577) | 52 866 (+7 231) | 4 969 (+2) | 421 (+23) | | | | |

Ngoài bảng: 20 file không đếm dòng, +1 387 / −21 (icon, font, ảnh logo, `tauri.conf.json`, `Cargo.toml`, `capabilities/default.json`, snapshot / journal của drizzle-kit). Các Issue của đợt sửa mục OPEN vào cột R2 của gói có file Issue đó sửa.

- Một mục có thể thuộc nhiều gói, vd. DR6-120 (Rust ở B, dải lưu ở D) hay T-291 (luật nhập ở A, `output_json` ở C, ô ngày nhanh ở D / E). Mỗi gói kiểm phần của mình; gói F gộp.
- B đọc thêm ba file build không đếm dòng mà #807, #861 sửa:
  - `apps/desktop/src-tauri/capabilities/default.json` (quyền `core:window:allow-set-title`, G6);
  - `tauri.conf.json` (`productName`, `title`, icon);
  - `Cargo.toml` (`description`).
- D đọc tài sản mới không đếm dòng: `apps/desktop/src/assets/brand/*.png`, `packages/ui/src/fonts/playfair-display-latin-400-italic.woff2`.
- Bước chuẩn bị (§L4.9 bước 6) đo lại ở SHA ghim bằng cùng lệnh, kèm bundle và exe; số ở `baseline.md` là số dùng.

## L4.4 Hai phần của mỗi gói

Như §L3.4 (và §L2.4), với các thay đổi dưới.

### Phần 1 — kiểm phần đã sửa (trục R), hai bảng

**Bảng R1 — theo mã** (§L4.5 phần 4), 37 dòng:

- DR6-104…134: 31 vấn đề lượt 3, đều có Issue sửa (tổng hợp lượt 3 §8.5). DR6-69 (SỬA MỘT PHẦN ở lượt 3) kiểm qua DR6-105, không có dòng riêng, như bảy DR6 lượt 1 ở lượt 3.
- DR6-25, 37, 66, 67: hoãn ở lượt 1 (KNOWN ở lượt 2–3), sửa trong đợt sổ OPEN.
- Hai mục KNOWN có bằng chứng mới của lượt 3 (tổng hợp lượt 3 §8.4) mà sau đó có Issue sửa: CL3-A29 (#742 một phần, #805), CL3-B2 (#817). Hai mục còn lại của §8.4 (CL3-C7, Claude F K2) vẫn là KNOWN (K1).

Bốn bước của §L2.4 giữ nguyên:

1. Chạy lại tái hiện của lượt 3 (DR6-25, 37, 66, 67: của lượt 1). Nguồn: báo cáo gốc `docs/reviews/raw/2026-10-21/` (và `…/2026-10-15/`), tổng hợp lượt 3 §6, §8.4, phụ lục nguồn probe; Claude, Codex dùng thêm probe lượt 3 của chính bên mình ở `C:\workspace\deep-review-1-6-r3\<bên>\`.
2. Gỡ tạm phần sửa, xem test của PR sửa có đỏ.
3. Thử biến thể gần.
4. Mục sửa bằng tài liệu (DR6-131, 132 (a), 133): dòng ghi có, và khớp app.

**Bảng R2 — theo Issue** (§L4.5 phần 5): T-280, 22 Issue của đợt sổ OPEN (T-283…T-304), T-305…T-308 (27 dòng), và mỗi Issue của đợt sửa mục OPEN trước lượt 4 (đề xuất 8: 3 Issue). Các Issue này gom ghi chú sổ, không có mã DR6. Mỗi dòng:

1. Mục tiêu và test chấp nhận của Issue (`common\fixes.md`) đúng trên code ở SHA ghim; ca nào chạy được thì chạy.
2. Gỡ tạm ít nhất một phần sửa chính, xem test của PR có đỏ.
3. Thử biến thể gần của các ghi chú sổ mà Issue gom (mục RESOLVED chép ở `fixes.md`).
4. Issue chỉ tài liệu / mockup / ảnh (T-284, T-303, T-306, T-307, và T-311, T-312 nếu theo đề xuất 8): dòng ghi có, khớp app / số đo. Mockup G3 khớp code làm theo nó (T-284 → T-296, T-297, T-300; T-303 → T-300).

Phần DR6 của một Issue (vd. DR6-25 của T-292; DR6-37, 66, 67 của T-301) ghi ở R1, không ghi lại ở R2. Một ghi chú sổ đã RESOLVED mà hỏng lại → phát hiện mới, "Liên quan: T-xxx (ghi chú review #…)".

Kết luận mỗi dòng theo thước §L2.4: **ĐÃ SỬA** · **SỬA MỘT PHẦN** (một phần của mô tả DR6, của Issue sửa hay của quyết định Owner chưa làm) · **CHƯA SỬA** · **HỒI QUY**. Ba kết luận sau kèm một phát hiện có trường "Liên quan".

**Refactor / hiệu năng không đổi hành vi:**

- Refactor của đợt sổ OPEN (T-285 #799, T-286 #801, T-288 #812, T-301 #845 / #846, T-305 #855): test cũ xanh, hành vi không đổi.
- Dữ liệu tải sinh ở `119e2e4` và ở SHA ghim khác hash (§L4.6). Gói F so hai bản theo bảng / cột: mọi chỗ khác phải giải thích được bằng một luật đổi có chủ ý (K30–K39), không do refactor.
- `zod/mini` (T-292, DR6-25): mọi phép kiểm cho cùng kết quả (`detail` V1, mã lỗi nhập backup); `assets/index.js` nhỏ đi như #830 đo (940 771 → 878 036 B, bản min).
- Chỉ mục `0012` và `CROSS JOIN` của `KEPT_APPOINTMENTS` (T-287, CL3-A29): `listTrash` / `previewPurge` trả cùng dòng trước / sau trên dữ liệu tải; thời gian như #805 đo.
- Trạng thái lưu một nguồn (T-294): `db.save` không xấu hơn mốc.

### Phần 2 — lỗi mới và edge case mới

Như §L2.4 phần 2: ít nhất 5 kịch bản mới mỗi gói, gói F ít nhất 5 chuỗi nhiều bước qua nhiều gói. Kịch bản phải chưa có trong báo cáo **lượt 1–3**: đọc `docs/reviews/raw/2026-10-15/`, `…/2026-10-17/`, `…/2026-10-21/` và ba bản tổng hợp. Xét trước:

- **Code mới sau lượt 3** (diff `119e2e4..{SHA}`), nhất là các PR vượt ngưỡng cỡ (#801, #805, #812, #817, #828, #833, #835, #845), và hành vi mới:
  - **nhập backup chặt hơn** (bảy luật T-291, mốc `precision: 3` của T-269, U+FEFF của T-270): file do exe lượt 3 / Phase 5 xuất còn nhập được không; câu từ chối nêu đúng luật; lệnh nhận mà nhập từ chối (DR5-13) hay ngược lại;
  - **trạng thái lưu và đóng app chờ** (T-294, S2-6 sửa 25/10): Thử lại khi file còn bị giữ, thư mục cấm tạo file, ổ đầy; đóng app giữa lúc seed / nhập / dọn;
  - **kiểm file trước migrate** (T-295): file hỏng, file đang mở dở, `openFrom` ghi một lần;
  - **đợt G5 `@4`** (T-277) và **trả lời AI bị cắt** (T-290): chặn đủ, không chặn nhầm trên văn bản thật;
  - **tham chiếu nhân sự một danh sách có kiểu** và chỉ mục `0012` (T-287): xóa / khôi phục / dọn nhân sự, luật nhập 5;
  - **tên hiển thị Heritas L-CRM** (T-308):
    - tiêu đề cửa sổ theo màn (quyền `core:window:allow-set-title`, G6);
    - font cục bộ và CSP; icon;
    - khối logo ở cửa sổ nhỏ nhất 1 100 × 700;
    - chữ "Project-2C" chỉ còn ở những chỗ K39 giữ.
- Code của đợt sửa mục OPEN trước lượt 4 (đề xuất 8), dù nhỏ.
- Trọng tâm từng gói ở bảng của Phụ lục N.

## L4.5 KNOWN lượt 4

`common\known.md` (bước chuẩn bị §L4.9 bước 4) **dựng mới** ở SHA ghim, không chép `known.md` lượt 3 (`docs/reviews/raw/2026-10-21/common-known.md`). Gồm **năm phần**.

**1. Mục OPEN và ACCEPTED** của `docs/state/review-notes.md` ở SHA ghim.

- **OPEN rỗng** (B2; bước chuẩn bị kiểm, §L4.9 bước 1). 14 mục [G7] ở `a59ef07` sửa ở đợt sửa mục OPEN, nên vào bảng R2, không vào KNOWN:
  - 4 mục của lần chụp lại ảnh hướng dẫn (review #760, #825, #838, #861);
  - 7 mục "PR nhỏ G7" (review #855 ×2, review #861 ×5);
  - 2 mục `phase-6.md` (review #859), 1 mục nghiệm thu (review #861).
- **ACCEPTED nguyên văn.** So với lượt 3 có thêm:
  - các mục Owner chấp nhận 23–25/10 (review #760, #815, #817, #828, #837; mục `DataTable` của review #843);
  - các mục "chỉ ghi lại" chuyển từ OPEN ở rà sổ 23/10.
- Dòng "`public/favicon.svg` (#128) là bản sao `app-icon.svg` → đổi icon phải sửa cả hai" của KNOWN lượt 1–3 **không còn**: mục đó đã RESOLVED (T-300 bỏ bản sao, #861 bỏ `app-icon.svg`). Nguồn icon nay ghi ở phụ lục 27/10 của ADR-0013: một PNG 1024 px (`apps/desktop/app-icon.png`), `tauri icon` sinh bộ icon của exe, favicon là icon 32 px trong bộ đó.
- Ghi chú sổ thêm sau SHA ghim (nếu có, chỉ PR docs) ghi ở đầu `known.md`, như lượt 3.

**2. Quyết định Owner còn hiệu lực:** K1–K29 (§5, §L2.5, §L3.5) giữ nguyên chữ, **trừ K12, K13, K14, K17, K21**. Năm mục này ghi vào `known.md` theo chữ dưới, vì chữ cũ trái với quyết định sau:

- **K12 (sửa theo K33, T-291):** Ra khỏi v1.0: `Project-2C-data`, S-1 (định dạng snapshot mỗi bảng một file, D-2), gộp backup / xung đột; làm trên hai máy là "bản nhập sau thắng", không cảnh báo khi nhập. Kiểm `kyc_versions.hash` khi nhập backup đã làm ở T-291 (luật nhập 7, K33): dòng sổ "S-1 / D-1" (probe Codex Sol 02/10) đã RESOLVED. Bỏ vế "`kyc_versions.hash` khi nhập snapshot — dòng OPEN" của chữ cũ.
- **K13 (sửa theo K35, S2-6 sửa 25/10):** S-2: khóa mọi lệnh ghi trong lúc thay dữ liệu; xuất không vào hàng đợi; đóng app trong lúc thay (Nạp lại, Nhập backup, Dọn sạch) chờ lần thay xong và dữ liệu mới lưu xong rồi mới đóng (S2-1…S2-6). Bỏ vế "đóng app không chờ" duyệt 11/10.
- **K14:** như §L3.5 (theo K27, TR-6 mới).
- **K17 (sửa theo M10):** Không phải phát hiện:
  - PR vượt ngưỡng kích thước (ghi ở `docs/metrics/`);
  - cách làm "chỉ Claude viết code" (ADR-0001), kể cả subagent / Workflow ở phiên gói Owner bật ultracode (M8–M10), và việc Codex, DeepSeek review chỉ đọc (M2, M10);
  - mức `code-review` của `review-pr` (ADR-0017, phụ lục 21/10);
  - việc dùng công cụ mới (G4).
- **K21:** như §L3.5, ngoặc sau vế "V1 / `LAW_NAME` sửa đúng chữ G5, không G5 mới" nay là "(Q6 lượt 1; đợt G5 lượt 2: K28; đợt G5 lượt 3: K31)".

Cộng thêm:

| # | Quyết định | Nguồn |
|---|---|---|
| K30 | Quyết định lượt 3 (21/10, mọi đề xuất). Q1 (a): khôi phục "R rồi X cùng ngày" giữ hành vi; chuyển nhóm được đưa lại giữ chỗ trong thứ tự ghi, khôi phục theo thứ tự đã ghi thì được, ngược lại bị chặn như E20 (TR-3). Q2 (a): `normalizeText` bỏ cả `\p{Cc}` không phải White_Space, mở rộng K25. Q3 (a): câu Thùng rác của 9b chỉ sửa chữ (dọn sạch trước, rồi phạm vi của vế khôi phục); `personUsage` không đổi. Q5 (a): CL3-C7 giữ K1 + R2-02. Q6 (a): bấm "Backup rồi dọn sạch" → thông báo 11j ≤ 500 ms trên dữ liệu tải (exe), đo tay ở G7 | tổng hợp lượt 3 §9; #720, #721, #723 |
| K31 | Đợt G5 lượt 3 (Owner duyệt 23/10, "duyệt hết"; `phase-5-prompts.md` §12): `analysis@4`, `discovery@4`, giữ `extraction@1`, `web@1`. Ở dạng tách dấu, dấu không đứng sau nguyên âm đọc như một dấu cách. Nhận diện tin nhắn của app tách dòng ở CR, LF, U+0085, U+2028, U+2029 (VT, FF từ §13.4, K33). Danh sách đóng "ấm", "lạnh", "nội", "ít" chỉ khớp dạng không dấu khi cả cụm không dấu. V6 miễn "giới", và miễn "định" trừ khi đứng sau "quy" / "qui". Việc không làm: §12.8 | #728 → #762, #766 |
| K32 | Sổ ghi chú (Owner 23/10): sửa hết mục OPEN trước v1.0; 12 mục "Owner chọn không sửa" 15/10 giữ; khoảng chờ nghiệm thu lượt L1 ghi là lệch chấp nhận (`nghiem-thu-v1.md`). Cổng duyệt cùng kế hoạch: G2 / G5 cho bảy luật T-291 và luật T-290 (chữ vào spec qua PR docs trước PR code); G4 cho một lần gọi OpenCode thật (T-290) và **không** thêm thư viện test component (T-300); G6 cho quyền đặt tiêu đề cửa sổ (T-293); G3 gom ở T-284 (thêm T-303 ngày 24/10) | `PROJECT-STATE.md` 23/10; #769–#771, #791 |
| K33 | Bảy luật T-291 (G2 / G5 23/10; chữ ở PR #824): (1) nhập backup tính lại hash phiên bản KYC mới nhất của mỗi KH, sai thì từ chối; Owner 25/10 thêm luật dạng hash của mọi phiên bản (spec Phase 3 §6 luật 7); (2) chỉ nhận `output_json` đúng dạng app ghi; (3) dòng REJECTED có output trên 20 000 ký tự thì không lưu output, panel báo "output quá lớn"; (4) chữ tùy chọn của lịch hẹn chỉ có ký tự vô hình là rỗng; (5) gõ ngày nhanh đầu năm: ngày đó năm nay chưa tới mà năm trước mới qua không quá 60 ngày thì gợi ý năm trước, app không tự đổi năm (ADR-0007 phụ lục); (6) sắp tên đổi chữ số toàn khổ / Ả Rập về chữ số thường trước khi so; (7) VT / FF trong ghi chú tính là xuống dòng. Version prompt không đổi. Dữ liệu cũ sai: K1 | #780 → #824, #828 |
| K34 | Trả lời AI bị cắt (G5 23/10, spec Phase 5 §6.1): sau một `{` của lời văn (ký tự sau nó không phải `"`) mà còn một khối JSON đủ thì dùng khối đó; `{` mà ngay sau là `"` tính là mở object, khối trong nó không lấy. Loại ca lời văn có `{` không đóng rồi `"{}"` trong nháy: ACCEPTED (Owner 25/10, review #828) | #779 → #820, #822 |
| K35 | Trạng thái lưu (Owner 25/10, T-294). Một nguồn trạng thái lưu. Chỉ báo 10d ở chân sidebar: "Đã lưu HH:MM", "Đang lưu…", "Chưa lưu được vào file"; mở app chưa lưu gì trong phiên thì "Đã lưu", không giờ. Nút Thử lại trên dải lưu lỗi chỉ ghi lại bản đang có. Câu từ chối D7 của Nạp lại / Nhập backup / Dọn sạch thêm vế bấm "Thử lại". Đóng app chờ lần thay đang chạy (S2-6 sửa 25/10, K13). Hai điểm mockup không vẽ, Owner giữ như mockup: ACCEPTED (review #817) | #783 → #817, #819; spec Phase 6 §4.1 |
| K36 | G3 (Owner 23/10, T-284; 24/10, T-303). Token `--border-control` #687890 cho viền ô nhập, ô ngày Tùy chọn và mũi tên sắp xếp chưa chọn (≥ 3:1, chỉ theme tối). Ô khóa giữ viền đứt `--border-strong`: WCAG 1.4.11 không đòi 3:1 cho thành phần không thao tác được. Hộp 8d có dòng số HĐ khi dời tháng. Khối "Thông tin tham khảo" mờ (2h): khung viền liền, thẻ trong viền đứt. Dòng help 1a / 4a khớp `AI_MODELS` | #773 → #795; #797 → #811; `docs/design/mockups/README.md` |
| K37 | G6 (Owner 23/10, T-293): `capabilities/default.json` thêm đúng một quyền `core:window:allow-set-title`, để `AppShell` đặt tiêu đề cửa sổ theo màn ("<Màn> · Heritas L-CRM" từ T-308) | #782 → #807 |
| K38 | `zod/mini` thay `zod` đầy đủ (DR6-25): cùng gói `zod` của ADR-0005, không thêm dependency; chữ lỗi mặc định chỉ còn "Invalid input" vì không `detail` V1 nào dùng chữ mặc định. Luật lint chặn import `zod` đầy đủ (T-304); lỗ tên viết hoa `Zod` / `ZOD`: ACCEPTED (Owner 25/10, review #837) | #781 → #830; #831 → #837 |
| K39 | Tên v1.0 (Owner 26–27/10, ADR-0013 phụ lục 27/10): app hiện là **Heritas L-CRM**, slogan "Where legacy meets trust". Chỉ đổi phần nhìn thấy: khối logo ở góc sidebar, icon exe / taskbar / tab, tiêu đề cửa sổ, `productName`, `<title>`, `description` của `Cargo.toml`. Tên mã Project-2C giữ ở mọi chỗ khác: repo, `gh`, `@p2c/*`, `project2c.exe`, `Project2C-data\`, `project2c.db`, tên / đuôi / định dạng backup (`BACKUP_FORMAT`), câu báo lỗi (bốn câu có chữ "Project-2C"), `KEY_SERVICE`, `identifier`. Logo cách (c) (G3); font Playfair Display nghiêng 400, bộ Latin, đóng gói cục bộ, OFL (G4) | #852 → #861; `PROJECT-STATE.md` 26–27/10 |
| K40 | Sổ ghi chú trước lượt 4 (Owner 27/10, B2): lượt 4 chỉ chạy khi mọi mục OPEN của sổ đã sửa, kể cả mục [G7]. Quyết định này thay quyết định trước đó cùng ngày: "mục [G7] làm sau khi xong mọi task". Ghi chú không chặn mới của review các PR sửa cũng sửa trước khi ghim SHA | `PROJECT-STATE.md` 26–27/10 |

**3. Mục "Lệch mockup đã biết" của `docs/testing/nghiem-thu-v1.md`**, nguyên văn ở SHA ghim, gồm cả hai khối con:

- các điểm đã được mockup sau thay, và các lệch ghi từ T-294…T-298, T-306: huy hiệu "n HĐ" của thẻ KH ở Kanban (rà sổ 26/10); thẻ Lịch hẹn của hồ sơ một dòng ở 1 440 (Owner 26/10);
- **12 điểm "Owner chọn không sửa"** (15/10; DR6-29, 36, 47, 48);
- **2 điểm "Owner chọn ghi là lệch chấp nhận"** (23/10, thay câu hỏi để lại cho lượt L1).

**4. Bảng R1** (dưới): 35 DR6 và 2 mục KNOWN đã sửa vào bảng R1 của gói kiểm (§L4.4), không báo lại thành phát hiện. Ngoài bảng:

- **Các DR6 khác** (DR6-01…103, đã sửa ở lượt 1–3, trừ các mục KNOWN dưới): không báo lại. Phần sửa hỏng lại → phát hiện mới, "Liên quan: DR6-xx". DR6-69 kiểm qua DR6-105.
- **KNOWN, chỉ nêu khi có bằng chứng mới** (hậu quả nặng hơn, đường vào mới):
  - DR6-53 (chấp nhận);
  - J5 của DR6-60 (K29);
  - CL3-C7 (K1, R2-02; Q5 a);
  - Claude F K2 của lượt 3: bản xuất của dữ liệu tải code lượt 1 không qua luật nhập 4 mới (K1).

Mức: L = Low, N = Nit (mức chốt ở tổng hợp lượt 3 §6, §8.4 và tổng hợp lượt 1). "Gói kiểm": gói ghi dòng R1; gói đầu là gói chính. Mô tả đầy đủ ở tổng hợp lượt 3 §6, §8.4 (DR6-104…134, CL3-A29, CL3-B2) và tổng hợp lượt 1 §3–§5 (DR6-25, 37, 66, 67). Cột "Issue → PR" kể cả PR sau chạm cùng vấn đề (trong ngoặc).

| Mã | Mức | Vấn đề (ngắn) | Issue → PR | Gói kiểm |
|---|---|---|---|---|
| DR6-104 | L | Khôi phục cuộc gặp đã rút chuyển nhóm đi đường E7 khi KH tới nhóm sau cuộc gặp vào ngày sau ngày cuộc hẹn | #720 → #740 (+ TR-3 #850 → #857) | A |
| DR6-105 | L | Luật nhập nhận mốc mọi độ chính xác mà code so chữ (`transitionWithdrawnAt`, thứ tự Thùng rác); phần còn của DR6-69 | #720 → #740 (+ #781 → #830) | A |
| DR6-106 | N | "Xóa R, ghi X cùng ngày, xóa X, khôi phục R rồi X" (Q1 a: câu TR-3, test hai thứ tự) | #720 → #740 | A |
| DR6-107 | L | Nhập backup nhận chuỗi bắt đầu bằng U+FEFF | #721 → #738 | A |
| DR6-108 | L | `raw_output` nhận nửa surrogate lẻ | #721 → #738 | A, C |
| DR6-109 | L | Hộp 5a / 5c / 7a gửi lệnh chữ đã chuẩn hóa | #721 → #738 | D |
| DR6-110 | L | `parseVnd` / `parseQuickDate` đọc chữ gốc | #721 → #738 | A, D, E |
| DR6-111 | L | Ký tự điều khiển C0 / C1 (Q2 a) | #721 → #738 (+ G5 §7 #728 → #762) | A, C |
| DR6-112 | N | `byName` coi tên khác nhau là bằng | #721 → #738 (+ luật 6 #780 → #828) | A |
| DR6-113 | L | `INSERT OR REPLACE` lách trigger chỉ thêm | #722 → #742 (+ #776 → #805) | A |
| DR6-114 | N | Cột trỏ tới nhân sự liệt kê bốn nơi; nhánh người đánh giá không thể xảy ra | #722 → #742, #776 → #805 | A |
| DR6-115 | L | Câu Thùng rác của 9b (Q3 a) | #723 → #744 (+ #788 → #841) | D |
| DR6-116 | L | Màn Team & nhân sự không có đích focus dự phòng | #723 → #744 (+ #788 → #841) | D |
| DR6-117 | L | Chuỗi liền dài tràn: thẻ Lịch hẹn, 7a / 7c / 7d, tên KH | #724 → #746 | D |
| DR6-118 | L | Panel KYC Intelligence, khối AI của chi tiết lịch hẹn tràn khung | #724 → #746 | C |
| DR6-119 | N | Tên nút trùng cho trình đọc màn hình (HĐ, Thùng rác) | #725 → #748 (+ #785 → #833) | E |
| DR6-120 | L | Lưu lỗi `PermissionDenied` không do chương trình khác (ACL, chỉ đọc giữa phiên) | #726 → #750, #752 → #764 (+ #782 → #807, #783 → #817) | B, D |
| DR6-121 | L | Mock trích xuất đề xuất sai ở sáu dạng câu | #727 → #753, #778 → #809, #777 → #812 | C |
| DR6-122 | L | Dấu viết rời giữa hai chữ lọt V3–V6 (G5) | #728 → #762, #766 | C |
| DR6-123 | L | Nhận diện tin nhắn của app tách dòng chỉ ở CR / LF (G5) | #728 → #762, #766 | C |
| DR6-124 | N | V3–V6 chặn nhầm câu thường (G5) | #728 → #762, #766 | C |
| DR6-125 | L | Test hở của lệnh Dọn sạch (tập giữ lại, D3, D11, đếm ghi chú SYSTEM) | #722 → #742 | A |
| DR6-126 | L | Test hở còn lại của gói A (a–f) | #720 → #740 (a, b, d), #721 → #738 (e, f), #722 → #742 (c) | A |
| DR6-127 | L | `wrap-anywhere` của dòng cuộc gặp ở Dòng thời gian không test nào giữ | #724 → #746 | D |
| DR6-128 | L | Test hở gói E: màn Dọn sạch; chỗ nối 6f ↔ `editedDay` | #725 → #748 | E |
| DR6-129 | L | Bộ e2e không ghim đồng hồ | #719 → #736 (+ #772 → #792, #793 → #815) | F |
| DR6-130 | N | Test hở của `notes-core` | #719 → #736 | F |
| DR6-131 | N | Mockup 6d và NT-LH-25 ghi "1,234 tr → 1.234.000 ₫" | #729 → #755 (+ #756 → #758) | E |
| DR6-132 | N | Tài liệu / chú thích chưa theo Dọn sạch; `packages/db/CLAUDE.md` về trigger đọc `customers` | #729 → #755 (a), #722 → #742 (b) (+ #756 → #758) | D, A |
| DR6-133 | N | `06-ai.md` lấy ví dụ chip prompt cũ | #729 → #755 (+ `@4`: #728 → #766) | C |
| DR6-134 | N | Luật DR-43 viết ba nơi | #720 → #740 (+ #775 → #804) | A, E |
| DR6-25 | L | `zod` bản đầy đủ ≈ 10 % `index.js` (lượt 1, hoãn) | #781 → #830 (+ #831 → #837) | C, A, F (bundle) |
| DR6-37 | N | Dấu nối / ký hiệu viết cứng trong JSX (lượt 1, hoãn) | #655 → #693 (một phần), #790 → #845 | D, E |
| DR6-66 | N | Export / hàm chỉ test dùng (lượt 1, hoãn) | #655 → #693 (một phần), #775 → #801, #777 → #812, #790 → #845 | F, A, C, D, E |
| DR6-67 | N | Code lặp ≥ 3 nơi (lượt 1, hoãn) | #774 → #799, #775 → #801, #777 → #812, #782 → #807, #790 → #845 | F, A, B, C, D, E |
| CL3-A29 | N | `KEPT_APPOINTMENTS` quét cả bảng `appointments` mỗi lần `listTrash` (KNOWN #709, bằng chứng mới lượt 3) | #722 → #742 (một phần: bỏ CTE khi không có lịch đã xóa), #776 → #805 (chỉ mục `0012`) | A, F (đo) |
| CL3-B2 | N | Sau một lần lưu lỗi, Nạp lại / Nhập backup / Dọn sạch bị từ chối mà không có cách thử lưu lại (KNOWN #96, đường vào Dọn sạch) | #783 → #817 (nút Thử lại) | B, D, E |

Đếm: 35 DR6 (22 L · 13 N; 31 của lượt 3 và 4 của lượt 1) và 2 mục KNOWN đã sửa = 37 dòng.

**5. Bảng R2** (dưới): mỗi Issue một dòng. Mục tiêu, test chấp nhận và ghi chú sổ đã gom (mục RESOLVED) ở `common\fixes.md`.

| Issue | Việc (theo tên Issue) | PR | Gói kiểm |
|---|---|---|---|
| #735 T-280 | Thanh trên cùng không che phần tử nhận focus (WCAG 2.4.11) | #760 | D |
| #772 T-283 | e2e / `tools`: helper dùng chung, đồng hồ / múi giờ, luật import, `pr-status` | #792 | F |
| #773 T-284 | G3: mockup và token cho bốn chỗ đổi hình thức | #795 | D, E |
| #774 T-285 | Hàm dùng chung vào `domain`, API `nextKycVersion` | #799 | A |
| #775 T-286 | `db`: gộp hàm lặp, bỏ hàm chỉ test dùng | #801, #804 | A |
| #776 T-287 | `db`: tham chiếu nhân sự, Thùng rác / Dọn sạch, đếm RF, seed và test | #805 | A, D, F (đo) |
| #777 T-288 | `ai`: hằng dùng chung với `db`, `retry.ts`, phạm vi export, version prompt trong test | #812 | C, A |
| #778 T-289 | Mock trích xuất: đề xuất sai còn lại của review #753 | #809 | C |
| #779 T-290 | `ai`: cụm khớp trong `detail`, trích JSON khi bị cắt, ngưỡng test, message assistant rỗng | #820, #822 | C |
| #780 T-291 | Bảy luật duyệt 23/10 | #824, #828 | A, C, D, E |
| #781 T-292 | `zod/mini` thay `zod` đầy đủ | #830 | C, A, F (bundle) |
| #782 T-293 | Rust: `storage.rs`, `backups\` không đọc được, test `ai.rs`, tiêu đề cửa sổ theo màn | #807 | B, D |
| #783 T-294 | Trạng thái lưu: chỉ báo 10d, nút Thử lại, đóng app khi đang lưu | #817, #819 | B, D |
| #784 T-295 | Cài đặt → Dữ liệu và mở file: số liệu 10c, kiểm file trước migrate, thông báo, ChatGPT web | #825 | B, E, C |
| #785 T-296 | Thùng rác và HĐ: hộp xác nhận dùng chung, tên nút theo ô, trạng thái HĐ, câu E20, hộp 8d | #833 | E |
| #786 T-297 | KYC và AI: dòng thời gian theo mockup, lỗi AI giữ khi đổi màn, hộp 3f, Cài đặt → AI | #835 | D, C |
| #787 T-298 | Hồ sơ KH và Lịch hẹn: 5d, 6a / 6h, 6d, thẻ Lịch hẹn, ô ngoài tháng, focus khung Chi tiết | #838 | D, E |
| #788 T-299 | Team, Báo cáo, Tổng quan: hộp nhân sự, bảng thành viên, bảng số cho chart N4–N1, bộ chọn kỳ | #841 | D, E |
| #789 T-300 | `packages/ui` và vỏ: token tương phản, `DataTable`, token-guard, ngưỡng nhánh, favicon, thanh trên cùng | #843 | D, F |
| #790 T-301 | Dọn app: mã chết, hằng lặp, ký hiệu viết cứng | #845, #846 | D, E, F |
| #793 T-302 | Luật lint `import()` động của `@playwright/test`; `docsRead` | #815 | F |
| #797 T-303 | G3: mockup ô khóa, câu ngoài phạm vi của token viền | #811 | D |
| #831 T-304 | Luật lint chặn `zod` đầy đủ; mặc định của schema AI | #837 | F, C |
| #849 T-305 | `classes.ts` (`HEADING`, `BADGE`), `recordBadge`, `WEB_MODE.tone`, đồng hồ bộ chụp ảnh | #855 | D, E, F |
| #850 T-306 | Tài liệu: spec Phase 6, nghiệm thu, hướng dẫn | #857 | B, E |
| #851 T-307 | Số đo Phase 6: bảng PR vượt ngưỡng, `integrity_check` theo MB | #859 | F |
| #852 T-308 | Tên Heritas L-CRM: khối logo, font slogan, icon, tiêu đề | #861 | D, B |

Đếm lúc soạn: 27 Issue (T-280, 22 của đợt sổ OPEN, T-305…T-308). Bước chuẩn bị thêm một dòng cho mỗi Issue của đợt sửa mục OPEN trước lượt 4 (đề xuất 8: T-310…T-312), gói kiểm theo file Issue đó sửa. Không có dòng R2: T-279 (quy trình, K17), T-281 (ở R1, DR6-120), T-282 (ở R1, DR6-131…133).

## L4.6 Số đo: so với mốc Home PC sau #656

- **Dữ liệu tải sinh lại ở SHA ghim:** `node tools/load-data.mjs` (mốc `2026-10-12`, seed `6`). Lúc soạn (`a59ef07`, 27/10, Home PC): số dòng như lượt 1–3 (1 496 KH, 10 414 lịch hẹn, 54 nhân sự, 103 `ai_analyses`…), **`tables` sha256 `ad82051b19415726ff2be3d86357aeb463b9f13205a30d4531667aa5a9492e25`**, cỡ file 15,3 MB. Hash khác `1c0a43fb…746d003f` của lượt 3, cùng số dòng (gói F giải thích, §L4.4). Đợt sửa mục OPEN không đổi luật dữ liệu nên dự kiến hash không đổi; bước chuẩn bị ghi hash đo được ở SHA ghim.
- **Mốc so (Home PC):**

  | Mốc | Nguồn |
  |---|---|
  | Probe trên exe: mốc chính | `docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json` (exe `dae9df3`, 18/10; `phase-6.md` mục "Mốc Home PC sau #656") |
  | Probe trên exe: lượt 3 cùng máy (tham khảo) | `C:\workspace\deep-review-1-6-r3\common\perf\perf-ref.json` (exe `119e2e4`, 20/10; 5 155 B, sha256 `7A59FE40FCA3CAE86696F27DC3597C67F5CDBD34E67CD5D6070C864D073F8241`, đo 27/10). Không có bản trong repo; bảng của nó ở `docs/reviews/raw/2026-10-21/common-baseline.md` |
  | Mở app lần đầu (LCP, cách T-227, 3 lần) | Mốc sau #656: 3 663 ms; lượt 3: 3 614 ms. Xấu hơn theo luật nhiễu khi trung vị > 4 396 ms; ngưỡng "không chậm hơn exe Phase 4" là > 4 724 ms |
  | Dọn sạch Thùng rác (exe: bấm "Backup rồi dọn sạch" → khung hình đầu có thông báo 11j) | Ngưỡng ≤ 500 ms trên dữ liệu tải (Owner 21/10, K30). Lượt 3: 151,8 ms (113 dòng), 148–154 ms (1 313 dòng) |
  | Hàm thuần trong Node | Số lượt 3 Home PC, tổng hợp lượt 3 §7.2, §7.3 |

- **"Xấu hơn"** theo luật nhiễu (Owner chốt 13/10): trung vị lớn hơn mốc **quá 20 % và quá 10 ms** (bộ nhớ: quá 5 MB). Ngưỡng tuyệt đối ở `docs/metrics/phase-6.md` vẫn áp dụng. `app.open-data` ≤ 600 ms chỉ áp cho dữ liệu tải; `integrity_check` theo cỡ file là ghi chú, không phải ngưỡng.
- **Lệnh** (bước chuẩn bị chạy một lần, reviewer dùng lại kết quả trong `common\baseline.md`):

  ```powershell
  node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json
  ```

  ```powershell
  $env:PERF_BASE = 'docs\metrics\phase-6-baseline\perf-home-pc-sau-656.json'; $env:PERF_BACKUP = 'C:\workspace\deep-review-1-6-r4\common\load\load-2026-10-12-seed6.p2cbackup'; $env:PERF_OUT = 'C:\workspace\deep-review-1-6-r4\common\perf\perf-ref.json'; $env:PERF_NOTE = 'DESKTOP-KDURKJP, exe {SHA}, deep review luot 4'; pnpm exec playwright test -c playwright.perf.config.ts
  ```

  Bảng so lượt 3: script `node` trong `common\perf\` gọi `parseRun` rồi `markdownTable(r4, r3)` của `e2e/perf/stats.ts` trên `perf-ref.json` và `perf-ref-r3.json` (cột Nền = lượt 3), như §L3.6.
- **Cỡ bundle và exe, ghi riêng phần font và icon mới** (T-308; đề xuất 7). So lượt 3 (`119e2e4`: JS / CSS 2 400 393 B, exe 5 408 768 B; tổng hợp lượt 3 §7.5). Bước chuẩn bị tách:
  - JS: `assets/index-*.js`, trong đó phần `zod/mini` (#830 đo 940 771 → 878 036 B, bản min); CSS;
  - font `playfair-display-latin-400-italic.woff2` (21 884 B trong repo);
  - ba ảnh logo `heritas-tree.png`, `heritas-wordmark.png`, `heritas-lcrm.png` (92 185 + 44 834 + 12 051 = 149 070 B trong repo);
  - favicon `32x32.png` (2 465 B; lượt 3 là `public/favicon.svg` 494 B, bản sao `app-icon.svg`);
  - exe: Δ so lượt 3, trong đó icon nhúng vào exe (`icons/icon.ico` 16 625 → 87 968 B).

  Bundle đo trên `apps\desktop\dist` build lại ở SHA ghim (`pnpm build:web`, không biến môi trường riêng), exe build lại ở SHA ghim. Không dùng bản có sẵn trên máy: `dist` của checkout chính là bản build 26/10 (trước T-305…T-308, có DB demo), exe là bản 24/10.
- **Dọn sạch Thùng rác:** đo như §L3.6 (Node hai cỡ: dữ liệu tải 113 dòng, Thùng rác lớn ≈ 1 313 dòng; exe một lần với dữ liệu tải), so ngưỡng ≤ 500 ms và số lượt 3. `listTrash` / `trash.open` so lượt 3, sau chỉ mục `0012` (#805).
- **Reviewer muốn đo lại trên exe:** như §6 (chép `common\exe\project2c.exe` vào thư mục của mình, cổng debug khác 9222, không đo khi bên khác đang đo).

## L4.7 Ba bên, bài học từ lượt 3 và review Phase 5

- **Claude Opus 5.5:** như lượt 3 sau 20/10 (§L3.1). Mỗi gói một phiên sạch Owner mở ở `C:\workspace\Project-2C-review`, tin nhắn một dòng (§L4.9). Mức suy luận, ultracode do Owner chọn từng phiên. Không có phiên điều phối, không có script Workflow: Phụ lục L viết theo đúng cách chạy này.
- **Codex, model GPT Sol 6.1:** như §L2.7. Owner chạy mỗi gói một phiên mới ở `C:\workspace\Project-2C-review-2`. Mục 1 của báo cáo ghi phiên bản Codex và model như công cụ cho biết; lượt 1–3 Codex chỉ ghi được "GPT-6 theo hệ thống". Owner ghi model đã chọn ở bảng đánh dấu (§L4.9).
- **DeepSeek v4.1 Flash:** như review Phase 5 (`docs/reviews/raw/2026-10-10/common-plan-opencode.md`), đổi theo bài học ở bảng dưới. Chạy trong app desktop WorkBuddy trên gói WorkBuddy Pro (Owner 28/10, §L4.11).
  - App WorkBuddy bản quốc tế (Phụ lục P); mỗi gói một task mới, workspace `C:\workspace\Project-2C-review`. Model DeepSeek V4.1 Flash bản 1017, context 1M, mức suy luận cao nhất, chọn tay ở bộ chọn model của từng task (Owner đã thấy đủ ba lựa chọn ngày 28/10). Số bản app ghi ở đợt 2 bước 4 và trước mỗi gói.
  - **Chi phí (G4, Owner 28/10):**
    - Gói WorkBuddy Pro một tháng: 10 USD (tháng đầu 7 USD với người chưa từng đăng ký), 2.000 credit/tháng, thêm 50 credit cho mỗi ngày có dùng (khuyến mãi có thời hạn). Owner đăng ký sát ngày chạy đợt 2, vì credit không cộng dồn và gói tháng không hoàn tiền.
    - **Trần 25 USD:** gói Pro cộng tối đa một gói mua thêm 500 credit (15 USD).
  - **Ước tính** (giả định, không phải số đo):
    - Khối token của DeepSeek ở review Phase 5 là: vào 1,65 tr không cache, 111 tr đọc cache, ra 162 k + suy luận 465 k. Tính theo giá DeepSeek API ngày 28/10 thì ≈ 0,96 USD giờ thấp điểm, ≈ 1,91 USD giờ cao điểm.
    - Lượt 4 đọc toàn bộ code, thêm hai bảng R và mức suy luận cao nhất; giả định gấp 3–5 lần.
    - WorkBuddy không công bố 1 credit bằng bao nhiêu token. Nếu tính đúng giá DeepSeek, với 1 credit = 0,005 USD theo giá gói Pro, lượt 4 tốn ≈ 575–955 credit giờ thấp điểm, ≈ 1.150–1.910 credit giờ cao điểm.
    - Giờ cao điểm của DeepSeek là 08:00–11:00 và 13:00–17:00 giờ Việt Nam, thứ Hai–thứ Sáu. Một bài cộng đồng Tencent (22/10) ghi WorkBuddy tính credit của DeepSeek theo đúng khung này. Chạy đợt 2 ngoài giờ đó.
    - **Số thật và điểm dừng:** credit trên trang Usage của WorkBuddy trước, sau phiên thử và sau từng gói (§L4.9 đợt 2 bước 4–6). Sau mỗi gói ước credit cho các gói còn lại; vượt trần thì dừng, hỏi Owner.
  - **Chặn:** ACL của đợt 2 là lớp chặn đọc duy nhất (§L4.9 đợt 2 bước 3, script `common\dot2.mjs` ở Phụ lục P). ACL chặn báo cáo lượt 4 của Claude và Codex, log phiên, bản sao file và scratchpad của hai bên, thư mục lượt 1–3, worktree của Codex. Trước đó đợt 2 bước 1 dọn những gì đợt 1 để lại ở hai worktree và cache tạm.
    - App không có luật chặn theo đường dẫn. Chế độ quyền Default chạy lệnh trong sandbox của app trước và hỏi Owner ở bước rủi ro. Phiên thử thấy app hỏi ở hầu hết lệnh thường thì Owner chuyển sang Full Access (Phụ lục P).
    - Ghi ngoài `deepseek\` chỉ có prompt, `git status`, hash 12 báo cáo trước / sau đợt 2 và quét log.
    - `gh` đăng xuất trong đợt 2.
    - Prompt (Phụ lục O) cấm subagent, skill, connector, đổi chế độ quyền, `gh`, lệnh git ghi, `pnpm eval:ai`, đổi quyền file, đọc / sửa thư mục dữ liệu của app, file đăng nhập và dữ liệu của Claude / Codex, Windows Credential Manager.
  - Log: phiên của app lưu dưới thư mục dữ liệu của app (`%USERPROFILE%\.workbuddy-ai\projects\` theo nguồn bên thứ ba; phiên thử kiểm). Owner chép ra sau khi đăng xuất (§L4.10).

**Bài học từ lượt 3** (tổng hợp lượt 3 §10.1 "Cho lần sau"; giữ mọi bài học §L2.7, §L3.7):

| Lượt 3 vướng | Lượt 4 làm |
|---|---|
| Claude A gộp `cat prompt-claude.md` với `ls -la common/ claude/ codex/` trong lệnh đầu tiên (01:34), trước khi đọc tới quy tắc 1: thấy tên / cỡ file trong `codex\` | Tin nhắn mở phiên (§L4.9) và quy tắc riêng 1 của Phụ lục L, M, O: lệnh đầu tiên chỉ đọc file prompt, không gộp lệnh khác |
| Codex C chạy `pnpm exec` trong bản chép repo, làm 8 junction `@p2c` của `node_modules` trong worktree trỏ sang bản chép (tự khôi phục), lặp bài học lượt 2 | Trong bản chép repo không chạy `pnpm`, **kể cả `pnpm exec`**: gọi thẳng `node node_modules/<gói>/<cli>` (Phụ lục N, quy tắc chung 1) |
| Hai flaky e2e của cổng bước chuẩn bị, do test vắt qua nửa đêm (DR6-129) | Đã sửa: #736 cho mọi trang ghim đồng hồ sáng ngày neo; #815 chặn lấy `test` ngoài fixture. Kiểm ở bảng R1 (DR6-129); bước chuẩn bị vẫn ghi giờ chạy cổng |
| Owner đổi cách chạy phần Claude ngày 20/10: `prompt-claude.md` sửa tay, khác Phụ lục I (quy tắc riêng 4 và 5 dính một dòng) | Phụ lục L là bản dùng thật; `prompt-claude.md` = Phụ lục L + Phụ lục N, chép nguyên văn ở bước chuẩn bị (chỉ thay `{SHA}`) |

**Bài học về DeepSeek từ review Phase 5** (`docs/reviews/2026-10-10-danh-gia-deepseek-muse.md` §3.1, §6, §7):

| Phase 5 vướng | Lượt 4 làm |
|---|---|
| Không thấy cả hai lỗi Medium, kết luận G7 "SẴN SÀNG" sai: chưa dựng chuỗi nhiều bước qua nhiều gói | Prompt (Phụ lục O) giao rõ: phần 2 dành phần lớn cho chuỗi nhiều bước; kết luận F chỉ là tham khảo, phiên tổng hợp mới ra kết luận (§6.1 spec, M2) |
| Gói D không chạy giao diện ("không có môi trường DOM") nên phát hiện màn chỉ ở PLAUSIBLE | Kết luận về màn chạy trên bản build web bằng Playwright, hoặc trên exe qua cổng debug (Phụ lục N, quy tắc chung 6) |
| DS-E3 đề xuất trái golden đã đọc; DS-A1 khẳng định không có căn cứ | Đọc golden / spec liên quan trước khi đề xuất; điều không chạy được thì ghi PLAUSIBLE, không suy rộng |
| Gói E liệt kê thư mục gốc bị cấm, không báo Owner | ACL đợt 2 (app không chặn đọc theo đường dẫn); prompt cấm liệt kê `C:\workspace`; lỡ thấy tên thư mục cấm thì dừng và báo Owner ngay; quét log (§L4.10) |
| Báo cáo chen từ tiếng Bồ Đào Nha ("produção") | Viết tiếng Việt, thuật ngữ ngành giữ tiếng Anh như repo; không dùng từ của ngôn ngữ khác |
| Ít đột biến (≈ 21, đa số để khẳng định test tốt) | Bước 2 của bảng R (gỡ tạm phần sửa) là bắt buộc ở mọi dòng R1 / R2; đột biến dùng để tìm chỗ hở |

## L4.8 Báo cáo lượt 4

Khuôn như §L3.8 (và §L2.8), đổi:

- ID `CLR4-<gói><số>` / `CXR4-<gói><số>` / `DSR4-<gói><số>` (§L4.2); `Vị trí: path:dòng ({SHA})`.
- `Liên quan: DR6-xx / T-xxx (nếu có) · mới do đợt sửa sau lượt 3 (PR #…) | có từ trước, lượt 1–3 bỏ sót`.
- Hai bảng R, cùng cột như §L2.8 (`| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |`):
  - **R1:** mọi dòng mà gói kiểm trong 37 dòng của §L4.5 phần 4;
  - **R2:** mọi Issue mà gói kiểm trong bảng R2 của `known.md` (§L4.5 phần 5, đủ dòng ở bước chuẩn bị).
- Phạm vi đã đọc gồm phần diff `119e2e4..{SHA}` của gói.
- Mục 1 (đầu báo cáo): Claude ghi model, mức suy luận, ultracode bật hay tắt; Codex ghi phiên bản Codex và model như công cụ cho biết; DeepSeek ghi bản app WorkBuddy (theo `common\baseline.md`), model, context và mức suy luận.
- **Gói F:** bảng R1 gộp đủ 37 dòng và bảng R2 gộp đủ mọi dòng (từ báo cáo A–E lượt 4 của chính bên đó + phần F). Kèm kết luận **SẴN SÀNG / CHƯA SẴN SÀNG cho v1.0 ở SHA ghim** và lý do (tham khảo; kết luận thật ở phiên tổng hợp).

## L4.9 Chuẩn bị và chạy

**Bước chuẩn bị — Claude, sau khi Owner duyệt kế hoạch lượt 4 và đợt sửa mục OPEN đã merge** (một phiên trên Home PC; không review, không ghi phát hiện):

1. Ghi `hostname` và ngày giờ (`Get-Date`) vào `common\baseline.md`.
   - **Kiểm sổ OPEN rỗng** (B2): mục OPEN của `docs/state/review-notes.md` ở `origin/main` không còn mục lá nào. Còn → dừng, báo Owner.
   - **Ghim SHA:** `git rev-parse origin/main` lúc đó là SHA ghim; ghi đủ 40 ký tự vào `baseline.md`.
   - Kiểm `C:\workspace\deep-review-1-6-r4\` chưa có (có rồi → dừng, báo Owner).
   - Kiểm `C:\workspace\deep-review-1-6-r3\common\perf\perf-ref.json` có, sha256 như §L4.6.
   - App WorkBuddy: Owner xác nhận đã đăng xuất app trên máy này (Phụ lục P, ranh giới tài khoản); ghi vào `baseline.md`. Claude không mở app, không đọc thư mục dữ liệu của app.
2. Tạo `C:\workspace\deep-review-1-6-r4\{common,claude,codex,deepseek}`.
3. Đưa hai worktree về SHA ghim:
   - `git -C C:\workspace\Project-2C-review checkout --detach <SHA ghim>`, tương tự với `-review-2`;
   - xóa `apps\desktop\dist` ở mỗi worktree;
   - kiểm `apps\desktop\src-tauri\target\` chưa có ở cả hai worktree. Có thì dừng, hỏi Owner: thư mục này mà có lúc ghi mốc thì đợt 2 bước 1 xóa file build sinh sau mốc trong đó và giữ file cũ (review #878). Chưa có thì thư mục do `pnpm build:exe` ở bước 6 sinh ra bị xóa cả ở đợt 2 bước 1;
   - `pnpm install --frozen-lockfile` (PowerShell);
   - `git status --short` rỗng (ngoài file Codex tự sinh ở `-review-2`, §8).
4. Chép vào `common\`:
   - `plan.md` (file này, bản đã merge);
   - `known.md` dựng mới theo §L4.5 ở SHA ghim (không chép từ `known.md` lượt 3):
     - phần 1 từ `docs/state/review-notes.md` ở SHA ghim (OPEN rỗng, ACCEPTED nguyên văn);
     - K1–K40, với K12, K13, K14, K17, K21 theo chữ ở §L4.5;
     - mục "Lệch mockup đã biết" nguyên văn;
     - bảng R1 kèm danh sách KNOWN; bảng R2 thêm các Issue của đợt sửa mục OPEN;
   - `fixes.md`:
     - thân các Issue ở các bảng của §L4.2, gồm đợt sửa mục OPEN;
     - thân PR sửa: mục "Lệch so với Issue", "Chưa làm", "Sửa sau review", "Ghi chú OPEN liên quan";
     - nguyên văn các nhóm RESOLVED của sổ mà các Issue đó gom (theo nhãn T-xxx, ở SHA ghim);
     - lấy bằng `gh issue view` / `gh pr view --json body`;
   - `prompt-claude.md` = Phụ lục L + Phụ lục N; `prompt-codex.md` = Phụ lục M + Phụ lục N; `prompt-deepseek.md` = Phụ lục O + Phụ lục N. Chép nguyên văn, chỉ thay `{SHA}` bằng 7 ký tự đầu và `{SHA_ĐỦ}` bằng đủ 40 ký tự của SHA ghim (`{GÓI}` để nguyên: reviewer thay theo tin nhắn);
   - `dot2.mjs` = khối code ở mục "Script đợt 2" của Phụ lục P, chép nguyên văn.

   Cuối bước này chạy `node C:\workspace\deep-review-1-6-r4\common\dot2.mjs baseline`. Lệnh ghi `common\dot2-baseline.json`: từng file và thư mục mà git không theo dõi (chưa theo dõi hay bị ignore) của hai worktree lúc này (sau bước 3, trước cổng ở bước 6), kể cả bên trong thư mục bị ignore; không tính `node_modules` và thư mục chứa nó. Đợt 2 bước 1 xóa mọi thứ ngoài mốc này; giờ ghi file là mốc thời gian của `scan`.
5. Dữ liệu tải: `node tools/load-data.mjs --out C:\workspace\deep-review-1-6-r4\common\load\load-2026-10-12-seed6.p2cbackup`; ghi hash `tables` vào `baseline.md`, so §L4.6. Khác hash lúc soạn → ghi Issue nào đổi dữ liệu.
6. Chạy cổng ở SHA ghim (trong `Project-2C-review`):
   - `pnpm verify`, `pnpm verify:rust`, `pnpm e2e` (`CI=1`), `pnpm build:exe`;
   - `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json`: bảng theo gói và diff `119e2e4..<SHA ghim>` như §L4.3; cỡ bundle / exe tách như §L4.6.

   Kết quả ghi vào `common\baseline.md`; chép exe vào `common\exe\`.
7. Đo hiệu năng. Dữ liệu tải vào exe bằng script qua cổng debug như lượt 3 (chép `deep-review-1-6-r3\common\perf\import-load.mjs` sang `-r4\common\perf\`; đề xuất 7). Owner để máy rảnh ≈ 5 phút.
   - Chép `deep-review-1-6-r3\common\perf\perf-ref.json` thành `common\perf\perf-ref-r3.json`.
   - Chạy lệnh probe §L4.6 (thay `{SHA}`) → `common\perf\perf-ref.json`.
   - Ghi vào `baseline.md` hai bảng: so mốc sau #656 (bảng của probe) và so lượt 3, cả hai có thêm cột ngưỡng `phase-6.md`.
   - Mở app lần đầu 3 lần (cách T-227), so mốc §L4.6.
   - Đo Dọn sạch Thùng rác theo §L4.6 (Node hai cỡ; exe một lần với dữ liệu tải), so ngưỡng ≤ 500 ms → `baseline.md`.
8. Báo Owner: sẵn sàng chạy lượt 4.

**Owner chạy đợt 1** (Claude và Codex cùng lúc):

- **Codex** (model GPT Sol 6.1), ở `C:\workspace\Project-2C-review-2`, mỗi gói một phiên mới, lần lượt A → F:

  ```text
  Gói A. Lệnh đầu tiên chỉ đọc C:\workspace\deep-review-1-6-r4\common\prompt-codex.md (không gộp lệnh khác), rồi làm đúng file đó.
  ```

- **Claude** (Claude Opus 5.5), ở `C:\workspace\Project-2C-review`, mỗi gói một phiên mới, lần lượt A → F; mức suy luận và ultracode Owner chọn:

  ```text
  Gói A. Lệnh đầu tiên chỉ đọc C:\workspace\deep-review-1-6-r4\common\prompt-claude.md (không gộp lệnh khác), rồi làm đúng file đó.
  ```

**Owner chạy đợt 2** (DeepSeek một mình). Điều kiện bắt đầu: đủ 12 báo cáo đợt 1 với dòng đầu `XONG`, Codex đã xong, và không còn phiên Claude nào mở ở `Project-2C-review`. Gói WorkBuddy Pro đã đăng ký. Từ bước 4, chỉ Owner dùng app WorkBuddy và đụng tới thư mục dữ liệu của app (Phụ lục P, ranh giới tài khoản).

Bước 1, 3 và 7 chạy `common\dot2.mjs` (Phụ lục P, mục "Script đợt 2") trong PowerShell của Owner. Lệnh in `OK` khi đạt. Không đạt thì in `STOP` kèm lý do: dừng ở đó, báo Claude.

1. Đóng Codex (app và CLI) và mọi phiên Claude ở hai worktree review, rồi dọn những gì đợt 1 để lại:

   ```powershell
   node C:\workspace\deep-review-1-6-r4\common\dot2.mjs clean
   ```

   - Ở hai worktree, lệnh xóa mọi file và thư mục chưa theo dõi hay bị ignore không có trong `dot2-baseline.json`.
     - Lệnh so từng file, nên file đợt 1 thêm vào một thư mục bị ignore đã có lúc ghi mốc (vd. `test-results\`) cũng bị xóa (review #872).
     - `node_modules` và thư mục chứa nó để nguyên. Lệnh in một dòng `kept, holds node_modules` cho mọi thư mục chưa theo dõi hay bị ignore có `node_modules` con (vd. probe có `package.json` và `node_modules` riêng), kể cả thư mục đã có lúc ghi mốc (review #878, #881). Với link (junction), lệnh chỉ xóa chính link, không đụng chỗ nó trỏ tới.
     - File đã có ở mốc mà đợt 1 ghi đè thì giữ; `scan` ở bước 3 đọc các file sửa sau mốc.
     - `apps\desktop\src-tauri\target\` do bước chuẩn bị 6 sinh ra là mục mới nên bị xóa cả (bước chuẩn bị 3 đã kiểm nó chưa có lúc ghi mốc).
   - Lệnh xóa cả cache Vite / Vitest (`node_modules\.vite`, `.vite-temp`) ở gốc worktree, `apps\*`, `packages\*` và các thư mục có dòng `kept` ở trên, vì cache giữ tên file test đã chạy và bản biến đổi của code probe.
   - Lệnh xóa cache tạm có bản biến đổi của code probe: `%TEMP%\playwright*`, `%TEMP%\codex-*`, thư mục `%TEMP%\…\ssr`. Trên Home PC ngày 28/10, các cache này còn giữ mã phát hiện của Codex lượt 3 (review #872).
   - Cuối cùng lệnh kiểm lại hai worktree so với mốc.
2. Chạy `gh auth logout`; sau đó `gh auth status` phải báo chưa đăng nhập. `[Environment]::GetEnvironmentVariable('OPENCODE_GO_KEY', 'User')` và `… 'Machine')` phải rỗng: app chạy với biến môi trường của user, nên không key nào đi qua biến môi trường tới lệnh của model.
3. Ghi hash 12 báo cáo của Claude / Codex, rồi chặn đọc bằng ACL, rồi quét. Hash cần vì ACL chỉ chặn đọc, mà app không có luật chặn ghi (Phụ lục P); bước 7 so lại:

   ```powershell
   $h = Get-FileHash C:\workspace\deep-review-1-6-r4\claude\*.md, C:\workspace\deep-review-1-6-r4\codex\*.md | Select-Object Path, Hash; if ($h.Count -ne 12) { throw "Cần 12 báo cáo, thấy $($h.Count)" }; $h | Export-Csv C:\workspace\deep-review-1-6-r4\common\dot2-reports-hash.csv -NoTypeInformation
   ```

   ```powershell
   node C:\workspace\deep-review-1-6-r4\common\dot2.mjs deny
   ```

   ```powershell
   node C:\workspace\deep-review-1-6-r4\common\dot2.mjs scan
   ```

   `deny` chặn tài khoản của Owner đọc (`icacls /deny`):
   - **Cả thư mục:**
     - `…-r4\claude`, `…-r4\codex`;
     - thư mục lượt 1–3: `deep-review-1-6-r3`, `-r2`, `deep-review-1-6` (DeepSeek không được đọc, Phụ lục O quy tắc riêng 2);
     - transcript Claude của worktree review: `%USERPROFILE%\.claude*\projects\C--workspace-Project-2C-review`;
     - `file-history\<id>` của từng phiên đó: Claude Code giữ ở đây bản sao mọi file phiên đã ghi, gồm `{GÓI}.md` (review #872);
     - scratchpad và output công cụ của các phiên đó: `%TEMP%\claude\C--workspace-Project-2C-review`.
   - **Từng mục con:** `%USERPROFILE%\.codex` (log phiên, `state_5.sqlite`, file đăng nhập `auth.json`) và `C:\workspace\Project-2C-review-2` (worktree của Codex).
     - Hai chỗ này có file trong `node_modules` dùng chung với `node_modules` của ba checkout qua hard link (Home PC ngày 28/10: 44 file trong `.codex`). Chặn đọc một file hard link là chặn mọi đường dẫn của nó.
     - Vì vậy `node_modules`, `.git` và link để ngỏ. Mục con có hard link ra ngoài thì chặn tiếp từng mục con của nó.
   - Thư mục phải chặn cả mà có file hard link ra ngoài → `STOP`, không chặn gì.
   - Danh sách đã chặn ghi ở `common\dot2-acl.json`, cho phiên thử và bước 7. Rồi lệnh kiểm: mỗi mục đều bị từ chối.

   `scan` đọc mọi file sửa sau `dot2-baseline.json` ở những chỗ còn đọc được, tìm mã phát hiện và dòng đầu báo cáo lượt 4 của Claude / Codex:
   - dữ liệu của Claude / Codex: `.claude*`, `.codex`, `%APPDATA%\Claude`, `%LOCALAPPDATA%\Claude`, `%LOCALAPPDATA%\OpenAI`, gói Store của hai app;
   - `%TEMP%`;
   - `C:\workspace`, bỏ `.git`, `.pnpm`, `target`.

   Lệnh chỉ thấy chữ không nén (UTF-8 / UTF-16). Thấy ở chỗ còn đọc được → `STOP` kèm danh sách file. Riêng danh sách phiên của app desktop Claude (`%APPDATA%\Claude\claude-code-sessions`: tiêu đề, vài câu tóm tắt) thì lệnh chỉ in ra, Owner ghi vào `baseline.md`: app đang chạy giữ các file này nên không chặn được (rủi ro ghi ở Phụ lục P).
4. Mở app WorkBuddy (Phụ lục P):
   - Đăng nhập app (bản quốc tế, tài khoản có gói WorkBuddy Pro): Owner tự làm, không phiên Claude nào chạm token. Ghi số bản app (About) vào `baseline.md`.
   - Cài đặt cho đợt 2 (Phụ lục P, mục "Cài đặt app"): tắt Auto Mode; một agent, không dùng chế độ nhóm; tắt cài tự động skill; không connector, điều khiển từ xa hay tác vụ tự động; xem Memory, xóa mục không thuộc lượt 4, ghi số mục còn lại vào `baseline.md`. Mục mới mà các task thử tạo thì dọn ngay trước gói A (bước 5, đoạn "Xong").
   - Ghi **credit trước** vào bảng đánh dấu: số credit ở trang Usage (workbuddy.ai → avatar → Profile → Usage) lúc này, trước phiên thử. Chi phí lượt 4 vì vậy tính cả phiên thử. Trong đợt 2 không dùng tài khoản này cho việc khác.
5. **Phiên thử.** Tạo một task mới: workspace `C:\workspace\Project-2C-review`, chế độ quyền Default, model DeepSeek V4.1 Flash bản 1017, context 1M, mức suy luận cao nhất. Bảo model làm từng việc dưới, ghi kết quả vào `common\baseline.md` dưới một đề mục riêng của task này. App hỏi duyệt việc nào trong danh sách dưới thì Owner duyệt, và đếm số lần hỏi.

   **Ra khác ghi dưới đây thì dừng đợt 2.** Sửa theo, dọn Memory như đoạn "Xong" dưới, rồi thử lại ở một task mới; không sửa được thì báo Claude. Lần đọc thử mục bị chặn nào ra "đọc được" thì trước lần chạy lại, Owner xóa khỏi `baseline.md` mọi thứ các task thử đã chép từ lần đọc đó (nội dung file, tên mục, tóm tắt), ở bất cứ chỗ nào trong file; chỉ giữ dòng "đọc được" của lần đó: việc đã làm, kết quả, thông báo nếu có (review #888).
   - **Model:** task hiện đúng DeepSeek V4.1 Flash bản 1017, context 1M, mức suy luận cao nhất (Owner đã thấy đủ ba lựa chọn ngày 28/10). Ghi tên đúng như app hiện.
   - `Get-Location` (hoặc `pwd`) → `C:\workspace\Project-2C-review`. Kết quả lệnh cho biết shell nào chạy lệnh (PowerShell hay Git Bash).
   - Đọc vài dòng đầu của `C:\workspace\deep-review-1-6-r4\common\plan.md` → đọc được.
   - `node node_modules/vitest/vitest.mjs run packages/domain` → xanh. Lệnh đọc `node_modules` của worktree review, nên bắt được ACL lan qua hard link mà bước 3 bỏ sót.
   - Đọc `common\dot2-acl.json`, rồi làm từng việc dưới, một lần bằng shell, một lần bằng công cụ đọc file của app → mọi lần bị từ chối (ACL; app không có luật theo đường dẫn, nên đọc được thì có thể app chạy lệnh dưới danh tính khác tài khoản của Owner). Mỗi lần, model chỉ ghi vào `baseline.md` việc đã làm (shell hay công cụ, mục nào), "bị từ chối" hay "đọc được", và thông báo lỗi nếu có. Không chép nội dung file, tên mục liệt kê được hay tóm tắt của chúng, kể cả ở lần "đọc được": mọi gói A–F đọc `baseline.md` (Phụ lục N; review #888). Thông báo lỗi cho biết lớp nào chặn: Default chạy lệnh trong sandbox trước, nên một lần bị từ chối có thể do sandbox chặn trước ACL. Lỗi của ACL là lỗi quyền của Windows (vd. `Access is denied`, `EPERM`); thông báo khác (vd. của sandbox) thì lần đó chưa cho biết ACL có chặn không (review #881). Bằng shell, đọc file là chỉ mở, không in nội dung: `node -e "require('fs').closeSync(require('fs').openSync(process.argv[1], 'r'))" <đường dẫn>`.
     - liệt kê `C:\workspace\deep-review-1-6-r4\claude`, `…-r4\codex`, `C:\workspace\deep-review-1-6-r3`, `-r2` và `C:\workspace\deep-review-1-6`;
     - liệt kê mục `projects\…`, một mục `file-history\…` và mục `%TEMP%\claude\…` của danh sách;
     - đọc `…-r4\claude\A.md` và `…-r4\codex\A.md`;
     - với `.codex`, chỉ đọc `version.json` và liệt kê `sessions`, hai mục của danh sách (thiếu mục nào thì bỏ, ghi vào `baseline.md`). Không chọn mục khác: `auth.json` là file đăng nhập, `config.toml` hay `models_cache.json` có thể có thông tin tài khoản. ACL không áp thì công cụ đọc file đưa nội dung vào log của app và tới máy chủ của model (review #872);
     - đọc `C:\workspace\Project-2C-review-2\package.json`.
   - Tạo `C:\workspace\deep-review-1-6-r4\deepseek\_thu\a.txt`, một lần bằng shell, một lần bằng công cụ ghi file của app → tạo được.
   - Bảo model giao một việc cho agent khác → không làm được (một agent, không chế độ nhóm).
   - `gh auth status` → chưa đăng nhập.
   - **Log của app** (Owner): tìm thư mục dữ liệu của app và file `.jsonl` mới nhất ở `projects\<thư mục>\`, không tính thư mục con như `tool-results\` (lệnh dưới; chỗ và định dạng theo nguồn bên thứ ba ở Phụ lục P). Lệnh đọc từng dòng JSON của file rồi in:
     - đường dẫn file;
     - mỗi dòng có chữ `vitest`: số dòng, `type`, `role`, `name`; dòng là lệnh gọi công cụ thì thêm `<- tool call`;
     - `types:` mọi giá trị `type` có trong file;
     - dòng cuối `True` khi có lệnh gọi công cụ mà đầu vào có `vitest`: dòng có `type` là `function_call` (nguồn bên thứ ba), hoặc một phần `tool_use` / `function_call` trong nội dung của dòng; lệnh chỉ xét `arguments` / `input` của bản ghi đó. Tin nhắn của Owner, lời đáp, phần suy luận của model hay kết quả lệnh có chữ `vitest` không tính (review #881).

     Ghi thư mục dữ liệu, thư mục của worktree review, cách đặt tên file phiên và dòng `types:` vào `baseline.md`. §L4.10 chép log theo đúng chỗ và định dạng này.

     ```powershell
     $d = @("$env:USERPROFILE\.workbuddy-ai", "$env:USERPROFILE\.workbuddy") | Where-Object { Test-Path "$_\projects" } | Select-Object -First 1; if (-not $d) { throw 'Không thấy thư mục dữ liệu của app' }; $f = Get-ChildItem "$d\projects" -Recurse -Depth 1 -File -Filter *.jsonl | Sort-Object LastWriteTime -Descending | Select-Object -First 1; if (-not $f) { throw 'Không thấy file .jsonl' }; $f.FullName; node -e "const ls=require('fs').readFileSync(process.argv[1],'utf8').split('\n'),types=new Set();let calls=0;const isCall=(o)=>!!o&&(o.type==='function_call'||o.type==='tool_use')&&/vitest/i.test(JSON.stringify(o.arguments||o.input||''));ls.forEach((s,i)=>{if(!s.trim())return;const r=JSON.parse(s);types.add(String(r.type));if(!/vitest/i.test(s))return;const call=isCall(r)||[].concat((r.message||r).content||[]).some(isCall);calls+=call;console.log('line '+(i+1)+': type='+r.type+(r.role?', role='+r.role:'')+(r.name?', name='+r.name:'')+(call?'  <- tool call':''))});console.log('types: '+[...types].join(', '));console.log(calls?'True':'False')" $f.FullName; if ($LASTEXITCODE) { throw 'Đọc JSON lỗi' }
     ```

     Không thấy thư mục hay file, lỗi đọc JSON, hoặc dòng cuối là `False` → dừng, báo Claude: không có log có lệnh gọi công cụ thì không kiểm độc lập được (§L4.10).
   - **Chế độ quyền** (Owner): ghi số lần app hỏi ở các việc trên, và hỏi ở việc nào. App hỏi ở hầu hết lệnh thường (`git`, `node`, đọc file trong workspace) → Owner chọn Full Access cho các gói (đã duyệt trước, §L4.11); không thì giữ Default. Ghi lựa chọn vào `baseline.md` và bảng đánh dấu.
   - **Kiểm ACL ở Full Access** (Owner, chỉ khi chọn Full Access; review #881): các lần đọc thử ở trên chạy ở Default, còn Full Access không có sandbox, nên ACL là lớp chặn đọc duy nhất. Tạo một task mới như phiên thử, chỉ đổi chế độ quyền sang Full Access. Bảo model đọc `common\dot2-acl.json` rồi làm lại đúng các việc đọc thử mục bị chặn ở trên, một lần bằng shell, một lần bằng công cụ đọc file → mọi lần bị từ chối; ghi vào `baseline.md` như phiên thử (việc đã làm, kết quả, thông báo lỗi; không chép nội dung). Ra khác "bị từ chối" thì dừng đợt 2, báo Claude; trước lần chạy lại, dọn `baseline.md` như đường "Sửa theo …" ở trên (review #888). Mở task này sau khi đã chạy lệnh **Log của app** ở trên: lệnh đó lấy file `.jsonl` mới nhất, mà task này tạo file mới hơn file của phiên thử.
   - **Credit** (Owner): trang Usage → ghi **credit sau phiên thử**, sau cả task kiểm ACL ở Full Access nếu có.

   **Chỉ ghi lại, không dừng:**
   - Bảo model tìm trên web và đọc một trang web → ghi app có công cụ đó không (tài liệu không cho tắt; prompt cấm).
   - Tạo `C:\workspace\deep-review-1-6-r4\_thu_ghi\a.txt` (ngoài workspace, không có ACL) bằng shell → ghi app hỏi, sandbox chặn hay tạo được.
   - Vá rồi trả nguyên byte (Phụ lục O quy tắc riêng 4): bảo model thêm một dòng vào `README.md` bằng công cụ sửa file của app, rồi trả lại đúng nội dung cũ → ghi app có hỏi không, và `git status --short` ngay sau đó. App sao lưu file trước khi sửa (Phụ lục P): bản sao nằm trong worktree thì ghi tên vào `baseline.md` như đoạn "Xong" dưới.
   - Memory: ghi số mục mới xuất hiện sau phiên thử, không chép nội dung mục (các gói đọc `baseline.md`). Đoạn "Xong" dưới xóa các mục này.
   - Probe mà Phụ lục N cần (quy tắc chung 6, đo trên exe):
     - mở một bản chép của `common\exe\project2c.exe` trong `deepseek\_thu\`, với cổng debug khác 9222 (`e2e/perf/README.md`);
     - chạy một probe Playwright trên bản build web. Bước 1 đã xóa `apps\desktop\dist`, nên `pnpm build:web` trước.

     Sandbox của chế độ Default có thể chặn hai việc này. Bị chặn mà Owner giữ Default thì DeepSeek ghi PLAUSIBLE cho phần chỉ kiểm được trên exe hay trình duyệt.

   Xong mọi task thử (phiên thử, mỗi lần chạy lại nó, và task kiểm ACL ở Full Access nếu có):
   - xóa `deepseek\_thu\`, `…-r4\_thu_ghi\` và file thử còn lại. `git -C C:\workspace\Project-2C-review status --short` phải rỗng. App để lại file nào trong worktree thì ghi tên vào `baseline.md`: quy tắc riêng 5 của Phụ lục O cho phép đúng các file đó;
   - **dọn Memory, ngay trước khi mở gói A** (review #881): xóa mọi mục Memory mới so với lúc dọn ở bước 4. Các task thử đưa vào hội thoại danh sách ACL, các lần đọc thử mục bị chặn, yêu cầu tìm web, giao việc cho agent khác, vá `README.md`; Memory không tắt được và tự trích ngữ cảnh từ hội thoại, nên những thứ đó có thể theo vào gói A–F. Ghi vào `baseline.md` số mục đã xóa, không chép nội dung mục.
   - **kiểm `baseline.md`, cùng lúc dọn Memory** (review #888): Owner đọc lại `baseline.md`, nhất là các đề mục của task thử. Mỗi lần đọc thử mục bị chặn chỉ còn việc đã làm, kết quả và thông báo lỗi nếu có; còn gì chép từ mục bị chặn (nội dung file, tên mục, tóm tắt) thì xóa như đường "Sửa theo …". Rồi chạy lại lệnh `scan` của bước 3; `STOP` thì dừng đợt 2, báo Claude. `scan` đọc cả `baseline.md` (file sửa sau mốc) nhưng chỉ bắt mã phát hiện và dòng đầu báo cáo lượt 4 của Claude / Codex; phần không có hai thứ đó (vd. tên mục, nội dung lượt 1–3) thì chỉ việc đọc lại bắt được. Ghi kết quả kiểm vào `baseline.md`, không chép nội dung.
6. Mỗi gói một task mới, lần lượt A → F:
   - Trước khi mở: ghi số bản app. Khác bản ở phiên thử thì ghi lại, không dừng.
   - Tạo task: workspace `C:\workspace\Project-2C-review`, chế độ quyền đã chọn ở phiên thử, model DeepSeek V4.1 Flash bản 1017, context 1M, mức suy luận cao nhất. Rồi gửi:

     ```text
     Gói A. Lệnh đầu tiên chỉ đọc C:\workspace\deep-review-1-6-r4\common\prompt-deepseek.md (không gộp lệnh khác), rồi làm đúng file đó.
     ```

   - Ngay khi mở task của gói, Owner ghi file phiên của gói vào bảng đánh dấu. Đó là file `.jsonl` mới nhất dưới thư mục của worktree review (chỗ ghi ở phiên thử).
   - App hỏi duyệt: Owner từ chối mọi việc ngoài việc review (Phụ lục P).
   - Xong gói: trang Usage → ghi credit.
   - **Điểm dừng chi phí, sau mỗi gói A–E** (trần G4): credit của gói tốn nhiều nhất tới lúc đó nhân số gói còn lại mà vượt credit còn lại (cộng 500 nếu chưa mua gói thêm 500 credit) → dừng, hỏi Owner trước gói kế.
     - Tính lại sau mỗi gói, không chỉ sau gói A: DeepSeek V4.1 Flash miễn phí tới hết 31/10, nên gói chạy trong hạn đó tốn 0 credit và chưa cho số ước nào (review #881).
     - Đã mua gói thêm thì credit còn lại đã gồm 500 credit đó; cộng thêm nữa là vượt trần 25 USD.

7. Xong F, làm theo thứ tự:
   1. **Đăng xuất app**, trước khi ai chép gì vào repo; trang tài khoản WorkBuddy có mục đăng xuất mọi thiết bị thì dùng thêm. Ghi **credit sau** vào bảng đánh dấu (credit trước đã ghi ở bước 4).
   2. Thoát app.
   3. Chép file phiên A–F ra `deepseek\` (§L4.10).
   4. Gỡ ACL:

      ```powershell
      node C:\workspace\deep-review-1-6-r4\common\dot2.mjs remove
      ```

      Lệnh gỡ mọi mục của `dot2-acl.json` và các thư mục của bước 3, rồi mọi mục còn bị chặn ở mọi tầng của `.codex` và `Project-2C-review-2` (cả khi mất `dot2-acl.json`). Sau đó lệnh kiểm từng mục đọc lại được, rồi đổi tên file thành `dot2-acl.removed.json`.
   5. So hash 12 báo cáo với bước 3:

      ```powershell
      & { $ErrorActionPreference = 'Stop'; $old = @(Import-Csv C:\workspace\deep-review-1-6-r4\common\dot2-reports-hash.csv); $new = @(Get-FileHash C:\workspace\deep-review-1-6-r4\claude\*.md, C:\workspace\deep-review-1-6-r4\codex\*.md | Select-Object Path, Hash); if ($old.Count -ne 12 -or $new.Count -ne 12) { throw "Cần 12 báo cáo ở CSV và ở thư mục, thấy $($old.Count) / $($new.Count)" }; if (Compare-Object $old $new -Property Path, Hash) { throw 'Báo cáo của Claude / Codex đã đổi trong đợt 2' }; 'OK: 12 báo cáo không đổi' }
      ```

      Lệnh chỉ in `OK` khi so được đủ 12 cặp và không cặp nào khác. Thiếu CSV, CSV hay thư mục không đủ 12 báo cáo (lệnh in hai số), hay lệnh nào trong khối lỗi → lệnh dừng, không in `OK` (review #881). `$ErrorActionPreference = 'Stop'` chỉ áp trong khối `& { … }`, không đổi cửa sổ PowerShell của Owner.

      Khác hay dừng → báo Claude; phiên tổng hợp tìm trong log của app lệnh đã ghi vào đó.
   6. Đăng nhập lại `gh auth login`.
Phiên bị cắt (dòng đầu báo cáo vẫn `ĐANG LÀM`) thì mở phiên mới với đúng tin nhắn của gói đó; bước 0 tự làm tiếp.

Bảng đánh dấu của Owner (18 ô; ghi thêm giờ bắt đầu / xong mỗi gói của Codex và DeepSeek; với DeepSeek: credit trước (đợt 2 bước 4), sau phiên thử (bước 5), sau từng gói (bước 6) và sau cùng (bước 7.1), số bản app, chế độ quyền, file phiên của từng gói):

| Bên | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| Claude Opus 5.5 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Codex GPT Sol 6.1 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| DeepSeek v4.1 Flash (đợt 2) | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| File phiên của DeepSeek | … | … | … | … | … | … |
| Credit sau gói / số bản app của DeepSeek | … | … | … | … | … | … |

## L4.10 Sau lượt 4, kiểm độc lập, ước lượng

**Tổng hợp** (Issue tạo khi lượt 4 chạy xong; chạy khi Owner yêu cầu, sau khi đã gỡ ACL): như §L3.10, đổi:

- Đọc đủ 18 báo cáo.
- Gộp ba bảng R1 thành một bảng 37 dòng, ba bảng R2 thành một bảng đủ dòng. Kiểm trên code ở SHA ghim mọi kết luận khác ĐÃ SỬA và mọi chỗ các bên chấm khác nhau.
- Kiểm mọi phát hiện mới, gộp trùng, đánh số tiếp `DR6-135…`. Báo cáo DeepSeek là dữ liệu tham khảo như Codex; mọi phát hiện của nó cũng kiểm trên code (Phase 5: 21 / 22 đúng, 1 sai).
- Bảng so ba bên như Phase 5 (`danh-gia-deepseek-muse.md` §2): số phát hiện, đúng / KNOWN / sai, chỉ một bên thấy, thời gian, chi phí DeepSeek (credit WorkBuddy trước / sau).
- So số đo với mốc cùng máy (§L4.6), gồm cỡ bundle / exe tách phần font và icon.
- Kết luận SẴN SÀNG / CHƯA SẴN SÀNG cho G7.
- Phạm vi sửa theo đề xuất 6; phần câu hỏi cho Owner chỉ còn cách sửa khi có nhiều phương án.

Phiên tổng hợp được dùng subagent / Workflow để kiểm từng phát hiện khi Owner bật (M8); phân loại cuối và kết luận vẫn do phiên tổng hợp ra.

**Kiểm độc lập bằng log phiên:** như §8, §L2.10, §L3.10 (bản sửa 20/10), cho cả ba bên.

- **Log Claude:** transcript của các phiên gói, và của subagent ở phiên Owner bật ultracode: mọi `*.jsonl` dưới `%USERPROFILE%\.claude*\projects\C--workspace-Project-2C-review\` từ giờ bắt đầu lượt 4.
- **Log Codex:** `%USERPROFILE%\.codex\sessions\…\rollout-*.jsonl` của các ngày chạy.
- **Log DeepSeek:** phiên của app lưu ở thư mục dữ liệu của app, JSONL không nén: `%USERPROFILE%\.workbuddy-ai\projects\<thư mục của worktree>\<id phiên>.jsonl` theo nguồn bên thứ ba (Phụ lục P). Chỗ và cách đặt tên đã kiểm ở phiên thử; file phiên của từng gói ghi ở bảng đánh dấu (§L4.9 đợt 2 bước 6).
  - Sau khi đăng xuất app (§L4.9 đợt 2 bước 7), **Owner** chép file phiên của từng gói A–F, cùng thư mục `tool-results\` của phiên đó nếu có, vào `deep-review-1-6-r4\deepseek\<gói>\session\`. Tin nhắn đầu của mỗi phiên phải là "Gói X." của đúng gói đó.
  - Không chép gì khác của thư mục dữ liệu của app (`workbuddy.db`, `memory\`, `connectors\`, `security\`, `storage\`, `.master.key`). Không phiên Claude nào đọc trong thư mục đó; Claude chỉ đọc bản Owner đã chép ra.
  - Lệnh dừng khi gói nào chưa có file JSONL:

    ```powershell
    foreach ($g in 'A','B','C','D','E','F') { if (-not (Get-ChildItem "C:\workspace\deep-review-1-6-r4\deepseek\$g\session" -Recurse -Filter *.jsonl -ErrorAction SilentlyContinue)) { throw "Gói $g chưa có log JSONL" } }
    ```
- **Log thô không vào repo** (Owner 28/10, G6 cho log của app; danh sách lưu repo dưới không có log của bên nào): log phiên của ba bên và `common\dot2-*` ở lại `deep-review-1-6-r4\` trên Home PC. Báo cáo và bản tổng hợp chỉ trích đoạn log cần dẫn, sau khi đã quét mẫu key và đã đăng xuất app.
- **Danh sách quét thêm:**
  - `deep-review-1-6-r4[\\/](claude|codex|deepseek)` của bên khác;
  - `deep-review-1-6-r3[\\/]…`, `deep-review-1-6-r2[\\/]…` và `deep-review-1-6[\\/]…` không phải của chính bên đó (DeepSeek: mọi thư mục này);
  - liệt kê hoặc tìm kiếm trên `C:\workspace`, `deep-review-1-6*\`;
  - lệnh đầu tiên của mỗi phiên gói: chỉ đọc file prompt (§L4.7);
  - `pnpm`, kể cả `pnpm exec`, chạy trong bản chép repo;
  - lệnh ghi ngoài thư mục của bên đó, trừ vá rồi trả nguyên byte theo quy tắc chung 1 và thư mục build / cache bị ignore;
  - DeepSeek: lệnh hay công cụ bị ACL hoặc sandbox của app từ chối, và cách model xử lý sau đó (vd. đổi sang lệnh khác để đọc cùng chỗ);
  - DeepSeek: lệnh đụng `.workbuddy*`, cài skill, connector, đổi chế độ quyền, giao việc cho agent khác, `gh`, `git commit` / `push` / `reset` / …, Credential Manager (`cmdkey`, `vaultcmd`, `CredRead`, `CredentialManager`, `Get-StoredCredential`), `eval:ai`, `Project-2C-review-2`, công cụ web, mạng ra ngoài máy (`curl`, `Invoke-WebRequest`, `Invoke-RestMethod`);
  - DeepSeek: lệnh ghi vào `…-r4\claude`, `…-r4\codex` (ACL chỉ chặn đọc; bước 7.5 so hash), `…-r4\common` (giữ file hash và trạng thái ACL);
  - DeepSeek: lệnh đổi quyền file (`icacls`, `Set-Acl`, `takeown`) hay chạy `dot2.mjs`;
  - dữ liệu của bên khác: `.codex`, `.claude*\projects`, `.claude*\file-history`, `%TEMP%\claude`, `%APPDATA%\Claude`, `%LOCALAPPDATA%\OpenAI`;
  - mẫu key (`sk-`, `gho_`, `ghp_`, `github_pat_`) và chuỗi theo sau `Bearer` / `Authorization` trong báo cáo và log của DeepSeek, quét trước khi chép bất cứ gì vào repo.

**Báo cáo gốc lưu ở repo** (PR docs của phiên tổng hợp):

- `docs/reviews/raw/<ngày tổng hợp>/{claude,codex,deepseek}/<gói>.md` nguyên văn;
- `common-known.md`, `common-baseline.md` (gồm bản app, cài đặt app và chế độ quyền đã dùng), `common-fixes.md`; `common-plan.md`, `common-prompt-*.md` chỉ khi khác bản trong repo;
- bản tổng hợp `docs/reviews/<ngày>-deep-review-phase-1-6-luot-4-tong-hop.md`.

Thư mục bằng chứng `deep-review-1-6-r4\` giữ trên Home PC tới v1.0.

**Ước lượng.** Lượt 3 trên Home PC: Claude ≈ 8 h 10 (gói A ≈ 3 h 25 qua ba phiên, B–F 38 phút – 1 h 25 mỗi gói); Codex A, B, D, E 20–25 phút mỗi gói, C và F bị ngắt rồi làm tiếp. DeepSeek ở review Phase 5: 6 gói ≈ 1 h 51 đồng hồ.

- Lượt 4 đọc diff gấp đôi lượt 3 (269 file so 119), bảng R ≥ 67 dòng (37 + 30) so 39.
- Đợt 1: Claude ≈ 8–10 h; Codex tùy model mới. Đợt 2: DeepSeek ≈ 3–5 h.
- Cả lượt 4 ≈ 3 ngày tính cả chuẩn bị, hai đợt và tổng hợp, rồi tới đợt sửa. Trước đó là đợt sửa mục OPEN (3 Issue nhỏ).
- Owner can thiệp:
  - đăng xuất app WorkBuddy trên Home PC trước bước chuẩn bị; đăng ký WorkBuddy Pro sát ngày chạy đợt 2;
  - mở 6 phiên Claude + 6 phiên Codex + 6 task DeepSeek;
  - ở đợt 2: đóng Codex, hash 12 báo cáo, chạy `dot2.mjs` (dọn, chặn ACL, quét, gỡ ACL), `gh auth logout` / `login`, đăng nhập / đăng xuất app, cài đặt app, phiên thử và chọn chế độ quyền, tạo task từng gói, duyệt hay từ chối khi app hỏi, ghi file phiên của từng gói, chép log phiên, so hash báo cáo;
  - để máy rảnh ≈ 5 phút ở bước 7;
  - ghi giờ bắt đầu / xong mỗi gói của Codex và DeepSeek; credit WorkBuddy và số bản app của DeepSeek.

## L4.11 Quyết định của Owner (26–28/10/2026) và đề xuất

**Đã chốt** (Issue #854):

1. **26/10:** có một vòng deep review toàn bộ code trước G7, sau khi xử lý hết các mục sổ OPEN làm được trước vòng này (T-305…T-308, #849–#852).
2. **27/10, bên review:** "Vẫn là Claude Opus 5.5 và GPT Sol 6.1 làm deep review toàn bộ code base".
   - Claude Opus 5.5: như lượt 3, mỗi gói một phiên sạch do Owner mở; mức suy luận và ultracode Owner chọn từng phiên.
   - Codex, model GPT Sol 6.1: Owner chạy, chỉ đọc (ADR-0001 M2).

**Owner bổ sung 27/10** (khi xem bản nháp):

- **B1.** "anh bổ sung kế hoạch review sẽ có thêm deepseek v4.1 flash": DeepSeek v4.1 Flash là bên review thứ ba, chỉ đọc, báo cáo là dữ liệu tham khảo. Lượt 4 có 6 gói × 3 bên = 18 báo cáo. Bỏ DeepSeek của M5 (13/10) không áp cho lượt 4 (ADR-0001 M10). Chạy trên gói OpenCode Go nên tốn hạn mức (G4: Owner yêu cầu). **Đổi 28/10, hai lần:** chạy qua DSH, trả DeepSeek API theo mức dùng; rồi cùng ngày sang gói WorkBuddy Pro, chạy trong app desktop WorkBuddy (dưới).
- **B2.** "anh chỉ làm review lượt 4 khi tất cả các review-notes open đã được sửa hết": lượt 4 chỉ chạy khi sổ OPEN rỗng, kể cả mục [G7]. Quyết định này thay quyết định trước đó cùng ngày ("mục [G7] làm sau khi xong mọi task"). SHA ghim vì vậy là `main` sau đợt sửa mục OPEN, không còn là `a59ef07`.

**Đề xuất, Owner chọn cùng G1** (mục 3–7 của #854; mục 8, 9 thêm do B1, B2). Owner chọn ngày 27/10/2026, trong phiên soạn: cả bảy mục theo đề xuất.

| # | Đề xuất | Mục | Owner chọn |
|---|---|---|---|
| 3 | SHA ghim = `main` khi sổ OPEN rỗng (B2), bước chuẩn bị ghim và đo lại. Số trong kế hoạch lấy ở `a59ef07` (`main` lúc soạn, sau khi #849–#852 đóng; code = `c4eec8b`). Từ SHA ghim tới lúc chạy chỉ có thay đổi docs | §L4.2, §L4.9 bước 1 | Theo đề xuất (27/10/2026) |
| 4 | Phạm vi đủ 6 gói như lượt 2–3, hai phần ngang nhau. Kiểm phần đã sửa bằng hai bảng: R1 (DR6-104…134, DR6-25 / 37 / 66 / 67, CL3-A29, CL3-B2) và R2 (27 Issue + Issue của đợt sửa mục OPEN). Tìm lỗi / edge case mới trên toàn bộ phạm vi gói, xét trước code mới sau lượt 3. Năm file mới chưa xếp gói xếp tay (§L4.3) | §L4.3, §L4.4 | Theo đề xuất (27/10/2026) |
| 5 | KNOWN lượt 4 dựng mới ở SHA ghim: OPEN rỗng + ACCEPTED; K1–K40 (sửa K12, K13, K14, K17, K21); "Lệch mockup đã biết" nguyên văn (12 mục không sửa 15/10, 2 lệch chấp nhận 23/10, huy hiệu "n HĐ"); quyết định đổi tên chỉ phần nhìn thấy (K39) | §L4.5 | Theo đề xuất (27/10/2026) |
| 6 | Sau tổng hợp: sửa hết như lượt 3, rồi G7 | §L4.10 | Theo đề xuất (27/10/2026) |
| 7 | Số đo trên Home PC, so mốc Home PC sau #656 như lượt 3, thêm số lượt 3 cùng máy làm tham khảo. Ghi riêng cỡ exe / bundle do font, icon mới và `zod/mini`. Dữ liệu tải vào exe bằng script qua cổng debug như lượt 3 | §L4.6, §L4.9 | Theo đề xuất (27/10/2026) |
| 8 | Đợt sửa mục OPEN trước lượt 4 (B2): ba Issue tạo sau G1. T-310 PR nhỏ code: 7 mục [G7] code và ghi chú code của review kế hoạch này. T-311 tài liệu: `phase-6.md` ×2, nghiệm thu ×1 và ghi chú tài liệu của review kế hoạch này. T-312 chụp lại ảnh hướng dẫn: 4 mục, làm sau T-310. Ảnh chụp lúc này là ảnh trước lượt 4; đợt sửa lượt 4 đổi màn nào thì G7 chụp lại ảnh đó | §L4.2 | Theo đề xuất (27/10/2026) |
| 9 | DeepSeek chạy đợt 2 một mình, sau khi đủ 12 báo cáo của Claude và Codex. Worktree `Project-2C-review`; ACL chặn `claude\`, `codex\` của lượt 4, cộng `opencode.json` (Phụ lục P bản 27/10, PR #863) như review Phase 5. Model `opencode-go/deepseek-v4.1-flash` qua gói Go, biến thể suy luận cao nhất. Phương án khác: ba bên cùng lúc, DeepSeek ở worktree thứ ba, chỉ `opencode.json` chặn (lách được) | §L4.2, §L4.7, §L4.9 | Theo đề xuất (27/10/2026); **28/10 đổi cách chạy hai lần:** DSH thay OpenCode, rồi app WorkBuddy thay DSH (dưới) |

Owner duyệt G1 ngày 28/10/2026 bằng comment trên PR #863 (như PR #647, #715), kèm một thay đổi.

**Owner đổi ngày 28/10, khi duyệt G1.** Việc này là Issue riêng T-313 (#868); Owner 28/10 không gộp vào T-311. Cùng ngày Owner đổi lần 2 sang gói WorkBuddy Pro (mục sau): phần DSH dưới đây chỉ còn là lịch sử; bộ ACL đợt 2 và `dot2.mjs` của nó giữ.

- "anh duyệt G1, nhưng lần review lượt 4 này với Deepseek sẽ không dùng opencode, mà dùng trực tiếp Deepseek API với deepseek harness". Lý do, Owner nói cùng ngày: "Deepseek Harness (DSH) là công cụ chính thức từ Deepseek, gọi API trực tiếp từ Deepseek trả phí dạng PAYG, không qua 1 bên khác như Opencode, chất lượng model cao hơn khá nhiều".
- G4 / G6, duyệt ngày 28/10 trên #868, theo đề xuất của Claude ở comment cùng ngày: "Duyệt đề xuất G4/G6 trên #868: DSH 0.2.1-rc.2, phương án (b) cùng user, key riêng nạp 10 USD, trần 15 USD, thu hồi key ngay sau gói F, log phiên và phiên thử như đề xuất."
- Đổi so với B1 và mục 9:
  - DeepSeek chạy qua DSH `0.2.1-rc.2` (Phụ lục P mới), trả theo mức dùng thay hạn mức gói Go.
  - Cùng user Windows (phương án (b)): ACL đợt 2 chặn thêm `%USERPROFILE%\.codex` và transcript Claude của worktree review; `gh` đăng xuất trong đợt 2.
  - Key riêng cho lượt 4, thu hồi ngay sau gói F.
- Review #872 (28/10) thấy bộ ACL trên còn hở và có chỗ làm hỏng `node_modules`, nên kế hoạch đổi như dưới. Owner xác nhận G6 cùng ngày (ghi trên #868): "Anh xác nhận G6 cho bộ ACL mới của đợt 2 và việc chạy script dot2.mjs, phương án (a) cho danh sách phiên của app desktop."
  - chặn thêm `file-history` và scratchpad của các phiên Claude ở worktree review, thư mục lượt 1–3, worktree `Project-2C-review-2`;
  - `.codex` và `Project-2C-review-2` chặn theo từng mục con, để ngỏ `node_modules` và `.git`: file trong `node_modules` dùng chung với ba checkout qua hard link;
  - Owner dọn, chặn, quét bản sao và gỡ bằng `common\dot2.mjs` (Phụ lục P), thay các lệnh `icacls` gõ tay;
  - phương án (a): chỗ có mã phát hiện trong danh sách phiên của app desktop Claude (`%APPDATA%\Claude\claude-code-sessions`) chỉ ghi vào `baseline.md`, đợt 2 chạy tiếp; phương án (b), đóng app suốt đợt 2 để chặn cả chỗ này, không chọn;
  - phiên thử thêm: kiểm `node_modules` của worktree review, đọc thử từng loại mục bị chặn; việc giải nén được log DSH trở lại nhóm làm dừng đợt 2, như đề xuất Owner duyệt.
- Phần còn lại của mục 9 giữ nguyên: đợt 2 chạy một mình, ở worktree `Project-2C-review`, có ACL trên `claude\`, `codex\`.

**Owner đổi lần 2 ngày 28/10: gói WorkBuddy Pro, chạy trong app desktop WorkBuddy.** Issue riêng T-315 (#880).

- Owner, trong phiên Claude nghiên cứu WorkBuddy / CodeBuddy cùng ngày: "Chọn workbuddy pro". Lý do, Owner nói cùng phiên:
  - "Về tiêu chí gần với inference chính hãng có lẽ Tencent đáng tin hơn những bên khác và đó là lý do anh muốn sub";
  - "Anh hướng về sub của Workbuddy vì họ tặng credit daily, và dùng được với codebuddy cli".
- Phiên nghiên cứu ghi, Owner đã biết khi chọn:
  - DeepSeek gọi WorkBuddy (gồm CodeBuddy) là "official partners" của V4.1-Flash (10/09); bản 1017 "optimized for … Tencent CodeBuddy, WorkBuddy" (17/10);
  - tài liệu Tencent không ghi model DeepSeek gắn sẵn chạy đường Vendor Direct (DeepSeek phục vụ) hay bản Tencent tự chạy;
  - hai phương án không chọn: giữ DSH; Token Plan của Tencent Cloud (Vendor Direct, credit bằng giá API).
- **Lần duyệt thứ nhất** (#880): chạy bằng CodeBuddy Code CLI, Owner duyệt năm điểm của đề xuất: "Duyệt cả năm điểm, làm PR docs đi". Lần duyệt này thay lần duyệt G4 / G6 cho DSH trên #868. Bản CLI của PR #881 bỏ sau lần làm rõ dưới.
- **Làm rõ cùng ngày,** sau khi Owner tự kiểm CLI: "anh làm rõ lại quyết định, sẽ là workbuddy IDE vì codebuddy CLI không chọn được đúng model và context windows". Owner xác nhận "WorkBuddy IDE" là app desktop WorkBuddy, và đã thấy trong app chọn được đủ DeepSeek V4.1 Flash bản 1017, context 1M và mức suy luận cao nhất.
- **G4** giữ như lần duyệt thứ nhất: gói WorkBuddy Pro một tháng, đăng ký sát ngày chạy đợt 2; trần 25 USD; đo credit ở phiên thử và sau gói A, ước vượt trần thì dừng.
- **G6 duyệt lại** cùng ngày trên #880 (Owner chọn "Duyệt, Default trước"):
  1. App desktop WorkBuddy bản quốc tế; ghi số bản, không ghim.
     - Đăng xuất trước bước chuẩn bị; đăng nhập ở đợt 2 bước 4, sau khi ACL đã đặt; đăng xuất ngay sau gói F. Credit tặng hằng ngày trong thời gian đó lấy trên Office Laptop.
     - Cài đặt app như Phụ lục P.
  2. Chế độ quyền Default trước. Phiên thử thấy app hỏi ở hầu hết lệnh thường thì Owner chuyển sang Full Access cho các gói.
  3. ACL đợt 2, `dot2.mjs`, `gh auth logout` giữ. Thêm: hash 12 báo cáo trước / sau đợt 2; prompt và danh sách quét thêm skill, connector, chế độ quyền, `~/.workbuddy*`.
  4. Log phiên và phiên thử như §L4.9, §L4.10. Không thấy bản ghi phiên có lệnh gọi công cụ thì dừng đợt 2.
- PR docs của T-315 (#881) viết lại Phụ lục P cho app WorkBuddy, sửa §L4.1, §L4.2, §L4.7–§L4.10 và Phụ lục O theo đó.
- Cùng PR sửa hai ghi chú [G7] của review #878:
  - bước chuẩn bị 3 kiểm `target\` chưa có;
  - `clean` xóa cache Vite của thư mục mới được giữ vì chứa `node_modules`, và in một dòng cho mỗi thư mục đó.

## Phụ lục L — Prompt Claude (lượt 4)

File `common\prompt-claude.md` = đoạn dưới + nguyên văn Phụ lục N; bước chuẩn bị chỉ thay `{SHA}` / `{SHA_ĐỦ}` (§L4.9 bước 4). Owner mở mỗi gói một phiên mới ở `C:\workspace\Project-2C-review`, lần lượt A → F. Đoạn này theo bản dùng thật của lượt 3 (`docs/reviews/raw/2026-10-21/common-prompt-claude.md`, sửa 20/10), không theo Phụ lục I.

> # Deep review Phase 1–6, lượt 4 — Claude
>
> **{GÓI}** = chữ gói (A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer Claude** của deep review Phase 1–6, **lượt 4**, **gói `{GÓI}`**: phiên sạch, chỉ đọc. Owner mở **mỗi gói một phiên mới**, model Claude Opus 5.5; mức suy luận và ultracode do Owner chọn từng phiên. Repo: worktree `C:\workspace\Project-2C-review`, detached ở SHA **`{SHA}`** (`{SHA_ĐỦ}`). Đọc xong file này thì chạy `git rev-parse HEAD` và `git status --short`; SHA lệch hay status không rỗng thì dừng và báo Owner.
>
> Quy tắc riêng của Claude:
> 1. **Lệnh đầu tiên của phiên chỉ đọc file này**, không gộp lệnh nào khác (lượt 3: một lệnh gộp đầu phiên liệt kê nhầm thư mục của bên kia).
> 2. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6-r4\codex\`, `C:\workspace\deep-review-1-6-r4\deepseek\`, `C:\workspace\deep-review-1-6-r3\codex\`, `C:\workspace\deep-review-1-6-r2\codex\`, `C:\workspace\deep-review-1-6\codex\`, `C:\workspace\deep-review-1-6\muse\`**, kể cả khi Owner hay file nào gợi ý. Không liệt kê và không tìm kiếm (`rg`, `glob`, `find`, `ls -R`, `Get-ChildItem -Recurse`) trên `C:\workspace\`, `deep-review-1-6\`, `deep-review-1-6-r2\`, `deep-review-1-6-r3\`, `deep-review-1-6-r4\`. Không đọc báo cáo lượt 4 của bên khác ở bất cứ đâu. Lỡ thấy thì dừng và báo Owner.
> 3. Chỉ đọc:
>    - repo ở SHA trên, gồm báo cáo gốc lượt 1–3 của mọi bên ở `docs/reviews/raw/2026-10-15/`, `docs/reviews/raw/2026-10-17/`, `docs/reviews/raw/2026-10-21/`;
>    - `C:\workspace\deep-review-1-6-r4\common\`;
>    - báo cáo Claude lượt 4 của các gói trước trong `…-r4\claude\` (mục đã báo ở gói trước thì chỉ dẫn ID);
>    - probe của chính Claude: lượt 3 trong `C:\workspace\deep-review-1-6-r3\claude\`, lượt 2 trong `C:\workspace\deep-review-1-6-r2\claude\`, lượt 1 trong `C:\workspace\deep-review-1-6\claude\` (để chạy lại tái hiện).
> 4. Không dùng skill `review-pr` / `code-review`. Không làm nghi thức phiên của repo (HANDOFF, `/handoff`, PR, Issue, merge, commit). Không chạy `gh` (thông tin Issue / PR sửa có ở `common\fixes.md`). Subagent / Workflow chỉ khi Owner bật ultracode cho phiên này (ADR-0001 M8). Khi đó chỉ phiên chính làm bước 0, ghi `{GÓI}.md` và in dòng `XONG`. **Subagent** (đọc file này vì tin nhắn của Owner tới cả nó) làm phần việc phiên chính giao, theo quy tắc 2, 3 và phần chung; ghi probe vào `…-r4\claude\{GÓI}\`, không ghi `{GÓI}.md`.
> 5. Ghi báo cáo vào `C:\workspace\deep-review-1-6-r4\claude\{GÓI}.md`, probe / bản chép / log vào `…-r4\claude\{GÓI}\`.
> 6. Gói F được đọc `…-r4\claude\A…E.md`. Xong gói nào thì dừng và in dòng `XONG …` (mục "Cuối phiên" của phần chung). Xong F thì **chờ Owner yêu cầu** tổng hợp, không tự tổng hợp.
> 7. Mục 1 của báo cáo ghi công cụ, model, mức suy luận của phiên và ultracode bật hay tắt.
>
> Phần chung dưới đây áp dụng đầy đủ. Trong phần chung: `<bên>` = `claude`, `<ID>` = `CLR4`.

## Phụ lục M — Prompt Codex (lượt 4)

File `common\prompt-codex.md` = đoạn dưới + nguyên văn Phụ lục N; bước chuẩn bị chỉ thay `{SHA}` / `{SHA_ĐỦ}`. Owner chạy Codex (model GPT Sol 6.1) ở `C:\workspace\Project-2C-review-2`, **mỗi gói một phiên mới**, lần lượt A → F.

> # Deep review Phase 1–6, lượt 4 — Codex
>
> **{GÓI}** = chữ gói (một chữ A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer độc lập Codex** (model GPT Sol 6.1, Owner chọn) của deep review Phase 1–6, **lượt 4**, gói `{GÓI}`. Repo: worktree `C:\workspace\Project-2C-review-2`, detached ở SHA **`{SHA}`** (`{SHA_ĐỦ}`). Đọc xong file này thì chạy `git rev-parse HEAD` và `git status --short`; SHA lệch thì dừng và báo Owner.
>
> Về file quy tắc của repo (`CLAUDE.md`): đó là quy trình phát triển của Claude. Dùng để hiểu dự án, **không** làm nghi thức phiên (`/session-start`, HANDOFF, hook, skill, PR, Issue, merge, commit). Codex tham gia review đóng phase theo ADR-0001 phụ lục M2: chỉ đọc, không viết code.
>
> Quy tắc riêng của Codex:
> 1. **Lệnh đầu tiên của phiên chỉ đọc file này**, không gộp lệnh nào khác.
> 2. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6-r4\claude\`, `C:\workspace\deep-review-1-6-r4\deepseek\`, `C:\workspace\deep-review-1-6-r3\claude\`, `C:\workspace\deep-review-1-6-r2\claude\`, `C:\workspace\deep-review-1-6\claude\`, `C:\workspace\deep-review-1-6\muse\`**, kể cả khi file hay ai đó gợi ý. Không liệt kê và không tìm kiếm (`rg --files`, `rg -g`, `Get-ChildItem -Recurse`, `dir /s`) trên `C:\workspace\`, `deep-review-1-6\`, `deep-review-1-6-r2\`, `deep-review-1-6-r3\`, `deep-review-1-6-r4\`. Không đọc báo cáo lượt 4 của bên khác. Lỡ thấy thì dừng và báo Owner.
> 3. Chỉ đọc:
>    - repo ở SHA trên, gồm báo cáo gốc lượt 1–3 của mọi bên ở `docs/reviews/raw/2026-10-15/`, `docs/reviews/raw/2026-10-17/`, `docs/reviews/raw/2026-10-21/`;
>    - `C:\workspace\deep-review-1-6-r4\common\`;
>    - báo cáo của chính bạn trong `…-r4\codex\`;
>    - probe của chính Codex: lượt 3 trong `C:\workspace\deep-review-1-6-r3\codex\`, lượt 2 trong `C:\workspace\deep-review-1-6-r2\codex\`, lượt 1 trong `C:\workspace\deep-review-1-6\codex\`.
> 4. Ghi báo cáo vào `C:\workspace\deep-review-1-6-r4\codex\{GÓI}.md`, probe / bản chép / log vào `…-r4\codex\{GÓI}\`.
> 5. Gói F được đọc `…-r4\codex\A…E.md`. Không tổng hợp với báo cáo nào khác, không tạo Issue, không đề xuất merge, không chạy `gh` (thông tin Issue / PR sửa có ở `common\fixes.md`).
> 6. Mục 1 của báo cáo ghi phiên bản Codex và model như công cụ cho biết.
>
> Phần chung dưới đây áp dụng đầy đủ. Trong phần chung: `<bên>` = `codex`, `<ID>` = `CXR4`.

## Phụ lục N — Phần chung của mọi prompt (lượt 4)

Nối nguyên văn vào cuối cả ba file `prompt-<bên>.md` của lượt 4; bước chuẩn bị chỉ thay `{SHA}`. `<bên>` = thư mục kết quả của bên đó (`claude`, `codex`, `deepseek`), `<ID>` = `CLR4`, `CXR4`, `DSR4`.

> ## Phần chung
>
> ### Bước 0 — kiểm gói, trước khi đọc code
>
> Kiểm từng file bằng tên đầy đủ (`Test-Path` hoặc mở file); **không liệt kê, không tìm kiếm thư mục**:
>
> 1. `{GÓI}` phải là **đúng một chữ** trong A, B, C, D, E, F. Không phải → dừng, hỏi Owner.
> 2. `C:\workspace\deep-review-1-6-r4\<bên>\{GÓI}.md`:
>    - **chưa có** → làm mới;
>    - có, và **dòng đầu bắt đầu bằng `ĐANG LÀM`** → phiên trước bị cắt: **làm tiếp**. Đọc hết file và thư mục `<bên>\{GÓI}\`, giữ mọi phát hiện đã ghi, làm nốt; ghi rõ là phiên làm tiếp, từ đâu, bằng công cụ / model / mức nào;
>    - có, mà dòng đầu **không** bắt đầu bằng `ĐANG LÀM` → gói đã xong: dừng, hỏi Owner, không ghi đè.
> 3. Báo cáo lượt 4 các gói **trước** `{GÓI}` (thứ tự A → F) đã có đủ trong `…-r4\<bên>\` và không file nào còn dòng đầu `ĐANG LÀM`. Thiếu hay còn dở → dừng, báo Owner tên gói.
> 4. Đủ cả ba thì in đúng một dòng rồi làm tiếp, không chờ Owner: `Bắt đầu gói {GÓI} lượt 4 (<tên gói>) → <bên>\{GÓI}.md` (làm tiếp thì thêm `— làm tiếp phiên trước`).
>
> **Ghi báo cáo dần:** ngay sau bước 0, tạo `<bên>\{GÓI}.md` với dòng đầu `ĐANG LÀM — <bên> gói {GÓI} lượt 4, bắt đầu <giờ>` và mục 1 của báo cáo. Mỗi khi có dòng bảng R, kịch bản đã thử, phát hiện hay số đo thì **ghi ngay**. Chạy lệnh dài ở nền thì ghi vào file đang chờ gì trước khi chờ.
>
> **Cuối phiên**, khi báo cáo đủ các mục: đổi dòng đầu thành `XONG — <bên> gói {GÓI} lượt 4, <giờ xong>`. In đúng một dòng: `XONG gói {GÓI} lượt 4 → C:\workspace\deep-review-1-6-r4\<bên>\{GÓI}.md. Gói kế tiếp: <chữ kế tiếp> (mở phiên mới).` Gói F in: `XONG cả 6 gói lượt 4 của <bên>. Chờ Owner yêu cầu tổng hợp.`
>
> ### Dự án và lượt này
>
> Project-2C: app desktop Tauri 2 + React, SQLite chạy trong webview qua sql.js; Rust chỉ ghi file, giữ API key, gọi OpenCode. App chạy offline, một người dùng, dữ liệu hiện là **giả lập**. Từ 27/10 app hiện tên **Heritas L-CRM** (logo, icon, tiêu đề cửa sổ); tên mã Project-2C giữ ở mọi chỗ khác (`common\known.md` K39).
>
> - Phase 1–4: nhân sự / team, khách hàng N4–N1, KYC có cấu trúc, lịch hẹn và kết quả, hợp đồng, chỉ số và báo cáo, xuất Excel, backup.
> - Phase 5: AI copilot (`packages/ai`).
> - Phase 6: hàng đợi thay dữ liệu S-2, Thùng rác + khôi phục, hộp Xóa KH 5f, **Dọn sạch Thùng rác** (TR-11–TR-13), trạng thái lưu (chỉ báo ở sidebar, nút Thử lại, đóng app chờ lần thay đang chạy).
>
> **Lượt 1** (SHA `8855345`, 14–15/10) tìm 67 vấn đề `DR6-01…67`. **Lượt 2** (`4217ed4`, 17/10) tìm 36 vấn đề mới `DR6-68…103`, trong đó 1 Medium (hồi quy do chính đợt sửa lượt 1). **Lượt 3** (`119e2e4`, 20–21/10):
>
> - kiểm 39 DR6 lượt 2: 38 ĐÃ SỬA, 1 SỬA MỘT PHẦN (DR6-69), 0 HỒI QUY;
> - tìm 31 vấn đề mới `DR6-104…134`: 0 Medium, 21 Low, 10 Nit; thêm 3 mục KNOWN có bằng chứng mới;
> - kết luận CHƯA SẴN SÀNG, chỉ vì Owner đã quyết sửa hết trước G7.
>
> Sau lượt 3 có ba đợt mà chưa lượt nào đọc trọn, rồi một đợt nhỏ sửa nốt mọi ghi chú OPEN của sổ (lượt 4 chạy khi sổ OPEN rỗng). Lúc soạn kế hoạch, diff `119e2e4..a59ef07` ngoài tài liệu có 269 file, +14 559 / −3 383, thêm migration `0012_trash_lookups`; số ở SHA `{SHA}` ghi trong `common\baseline.md`.
>
> - Đợt sửa lượt 3: 11 Issue #719–#729, cùng #735, #752, #756.
> - Đợt sửa sổ ghi chú review trước v1.0: 22 Issue T-283…T-304, mỗi Issue gom nhiều ghi chú; 8 PR vượt ngưỡng cỡ.
> - Trước vòng review: T-305…T-308, gồm đổi tên hiển thị.
> - Đợt sửa mục OPEN còn lại trước lượt 4 (danh sách Issue ở `common\known.md` phần 5).
>
> **Lượt 4 có hai phần ngang nhau, cả hai bắt buộc:**
>
> 1. **Kiểm phần đã sửa (trục R), hai bảng** (`common\known.md` phần 4, 5, cột "Gói kiểm"):
>    - **R1, theo mã:** DR6-104…134; DR6-25, 37, 66, 67 (hoãn ở lượt 1, nay đã sửa); CL3-A29, CL3-B2. Mỗi dòng: chạy lại tái hiện của lượt 3 (của lượt 1 với DR6-25, 37, 66, 67); gỡ tạm phần sửa (trên bản chép, hoặc patch gỡ ngay), xem test của PR sửa có đỏ; thử biến thể gần. DR6-69 kiểm qua DR6-105. Mục sửa bằng tài liệu (DR6-131, 132 (a), 133): dòng ghi có và khớp app.
>    - **R2, theo Issue:** mọi Issue gom ghi chú sổ (T-280, T-283…T-308 và đợt sửa mục OPEN; danh sách đủ ở `known.md`). Mỗi dòng: mục tiêu và test chấp nhận của Issue (`common\fixes.md`) đúng trên code; gỡ tạm ít nhất một phần sửa chính, xem test có đỏ; thử biến thể gần của các ghi chú Issue gom. Issue chỉ tài liệu / mockup / ảnh: dòng ghi có và khớp app / số đo.
>
>    Kết luận: **ĐÃ SỬA** (đường lỗi cũ đã hết, có test đỏ khi gỡ phần sửa; biến thể còn hở ghi thành phát hiện riêng) · **SỬA MỘT PHẦN** (một phần của mô tả DR6, của Issue sửa hay của quyết định Owner chưa làm) · **CHƯA SỬA** · **HỒI QUY** (phần sửa làm hỏng chỗ trước đó đúng). Ba kết luận sau kèm một phát hiện có trường "Liên quan". Thêm:
>    - số đo không xấu hơn mốc Home PC sau #656 (`common\baseline.md`);
>    - refactor của đợt sổ (T-285, T-286, T-288, T-301, T-305) không đổi hành vi;
>    - `zod/mini` cho cùng kết quả kiểm; chỉ mục `0012` cho `listTrash` cùng dòng.
> 2. **Tìm lỗi mới và edge case mới** trên **toàn bộ** phạm vi gói, không chỉ quanh chỗ đã sửa.
>    - Ưu tiên lỗi do chính các đợt sau lượt 3 gây ra. Lượt 2 có 3 hồi quy; lượt 3 thấy chỗ hở nằm nhiều ở code mới của đợt sửa trước nó.
>    - Xét trước các PR lớn của đợt sổ và hành vi mới: nhập backup chặt hơn (bảy luật T-291, mốc `precision: 3`), trạng thái lưu và đóng app chờ (T-294), kiểm file trước migrate (T-295), G5 `@4` (T-277), trả lời AI bị cắt (T-290), tham chiếu nhân sự và chỉ mục `0012` (T-287), tên hiển thị (T-308).
>    - Rồi tới kịch bản / biên **chưa có trong báo cáo lượt 1–3**. Đọc `docs/reviews/raw/2026-10-15/`, `docs/reviews/raw/2026-10-17/`, `docs/reviews/raw/2026-10-21/` và ba bản tổng hợp để biết đã thử gì.
>    - Báo cáo có mục **"Kịch bản mới đã thử"**: mỗi kịch bản một dòng, kể cả khi không thấy lỗi. Mỗi gói nên có ít nhất 5; gói F ít nhất 5 chuỗi nhiều bước qua nhiều gói.
>    - Chỗ các lượt trước ghi "đã xét, không thấy" vẫn đáng xét lại.
>
> Thông tin từng Issue / PR sửa (mục tiêu, test chấp nhận, phần PR ghi lệch / chưa làm, ghi chú sổ đã gom): `common\fixes.md`. Diff một PR: `git show <commit>` (bảng commit ở `plan.md` §L4.2 và `fixes.md`).
>
> ### Kế hoạch và phạm vi gói
>
> Kế hoạch đầy đủ: `C:\workspace\deep-review-1-6-r4\common\plan.md`. Lượt 4 ở §L4.1–§L4.11; trục và thước mức ở §4; định dạng ở §L4.8 (và §L3.8, §L2.8). Phạm vi gói như lượt 1–3 (luật xếp gói của `tools/size-report-core.mjs`; file mới chưa xếp gói thì theo §L4.3; đọc thêm chỗ code gói khác mà gói nối vào). Số dòng dưới là lúc soạn (`a59ef07`); số ở SHA ghim trong `common\baseline.md`:
>
> | Gói | Đường dẫn | SP / test lúc soạn | R1 | R2 (lúc soạn) | Trọng tâm mới (phần 2) |
> |---|---|---|---|---|---|
> | A. Lõi dữ liệu | `packages/domain/**`, `packages/db/**` | 8 719 / 15 714 | 104–108, 110–114, 125, 126, 132 (b), 134, 25, 66, 67, CL3-A29 | T-285, 286, 287, 288, 291, 292 | **Nhập backup chặt hơn:** bảy luật T-291 (hash KYC mới nhất và dạng hash mọi phiên bản, `output_json` đúng dạng app ghi, REJECTED trên 20 000 ký tự, chữ tùy chọn chỉ có ký tự vô hình, VT / FF), mốc `precision: 3`, U+FEFF. Thử file do exe lượt 3 / Phase 5 xuất, file sửa tay; lệnh nhận ↔ nhập nhận (DR5-13). Tham chiếu nhân sự một danh sách có kiểu (`person-references.ts`) ở lệnh, 9b và luật nhập 5; chỉ mục `0012` và `CROSS JOIN` của `KEPT_APPOINTMENTS`. Hàm dùng chung mới của `domain` / `db` (T-285, T-286) làm đúng như các bản cũ bị gộp, kể cả múi giờ và nửa đêm. Khôi phục theo E7 chỉ từ ngày cuộc hẹn; `stageAtEndOf` / `stageSnapshot` cho lệnh, luật nhập và 6c–6f |
> | B. File và Rust | `apps/desktop/src-tauri/**` (gồm `capabilities/`, `tauri.conf.json`, `Cargo.toml`, `icons/`), `apps/desktop/src/data/**` trừ file AI | 2 426 / 5 408 | 120, 67, CL3-B2 | T-293, 294, 295, 306, 308 | **Trạng thái lưu một nguồn** (`persist-queue.ts`: `status()`, `track`, `flush`): Thử lại khi file còn bị giữ / thư mục cấm tạo file / ổ đầy; đóng app giữa lúc seed / nhập / dọn chờ lần thay rồi lần lưu (S2-6 mới); listener lỗi không làm kẹt hàng đợi. Quyền ghi lúc mở và mỗi lần lưu (ACL, chỉ đọc, thư mục cấm tạo file; T-275, T-281, T-293); `backups\` không đọc được. Kiểm file trước migrate, `openFrom` ghi một lần (T-295). Tiêu đề cửa sổ theo màn qua quyền `core:window:allow-set-title` (G6): đổi màn nhanh, lúc lỗi khởi động. `tauri.conf.json` / `Cargo.toml` / icon của T-308: CSP không đổi, `identifier` giữ (K39) |
> | C. AI | `packages/ai/**`; file AI của app (`ai-*`, `*-ai-*`, `*Ai.tsx`, `KycExtraction`, `KycIntelligence`, `KycWebSession`, `KycHistory`, `extraction-view`) | 6 027 / 7 539 | 108, 111, 118, 121–124, 133, 25, 66, 67 | T-288, 289, 290, 291, 292, 295, 297, 304 | **Đợt G5 `@4`** (`phase-5-prompts.md` §12): dấu tổ hợp lạc, tách dòng ở U+0085 / U+2028 / U+2029, danh sách đóng "ấm / lạnh / nội / ít", miễn "giới" / "định". Chặn đủ và không chặn nhầm trên văn bản thật (eval, seed, `vi.ts`). Trả lời bị cắt sau `{` của lời văn (T-290, `extract-json.ts`); `detail` V3–V6 trích đúng chữ model viết, một issue một chỗ. `zod/mini`: schema, `detail` V1, mặc định là mảng mới mỗi lần parse (T-304). Hằng giới hạn dùng chung với `db` (T-288); REJECTED trên 20 000 ký tự (T-291). Lỗi AI giữ khi đổi màn (`ai-jobs.ts`, `use-ai-job.ts`, T-297); ChatGPT web kiểm lại `generation` (T-295). Mock trích xuất (T-276, T-288, T-289) |
> | D. Màn nhập liệu | `packages/ui/**` (trừ `scripts/`), `apps/desktop/src/{shell,i18n}/**`, `routes/customers/**` (trừ file AI và Hợp đồng), `routes/team/**`, `routes/Screen.tsx`, `routes/{classes,money-view}.ts`, `routes/stage-badge.tsx`, file gốc `apps/desktop/src/*`, `apps/desktop/index.html` | 7 940 / 2 802 (+ 54 / 18 xếp tay) | 109, 110, 115–117, 120, 127, 132 (a), 37, 66, 67, CL3-B2 | T-280, 284, 287, 291, 293, 294, 297–301, 303, 305, 308 | **Khối logo, font, tiêu đề** (T-308): `Brand.tsx`, tên cho trình đọc màn hình, slogan, cửa sổ nhỏ nhất 1 100 × 700, font cục bộ, token mới (`--font-brand`, `--brand-slogan`, `--brand-outline`). Chỉ báo lưu ở chân sidebar và nút Thử lại của dải lưu (T-294): focus sau Thử lại, `role`. Token `--border-control` và ô khóa (T-300, K36); `DataTable` (cách sắp, focus khi bảng đổi). Class dùng chung `classes.ts` / `stage-badge.tsx` (T-301, T-305): màn không đổi chữ / class. Thanh trên cùng không che focus (T-280). Dòng thời gian KYC theo mockup: bộ lọc, mã F (T-297). Hộp 5d, thẻ Lịch hẹn một dòng ở 1 440 (T-298); hộp nhân sự, bảng thành viên (T-299) |
> | E. Lịch hẹn, chỉ số, quản lý | `routes/{appointments,overview,reports}/**`, `routes/{Overview,Settings*,RestoreDialog,FilterBar,ConfirmWordDialog}.tsx` (trừ `SettingsAi.tsx`), `routes/{trash-view,period-labels,applied-filter}.ts`, Hợp đồng (`routes/customers/{CustomerPolicies,PolicyDialogs,policy-form}.*`) | 8 093 / 4 556 (+ 67 / 0 xếp tay) | 110, 119, 128, 131, 134, 37, 66, 67, CL3-B2 | T-284, 291, 295, 296, 298, 299, 301, 305, 306 | **Hộp gõ chữ xác nhận dùng chung** (`ConfirmWordDialog.tsx`, T-296) của Nạp lại và Dọn sạch: chữ xác nhận, lúc đang chạy không đóng được, focus. Kế hoạch dọn đọc từ dòng `listTrash` (`purgePlan`) khớp `previewPurge`. Số liệu hộp 10c và một state thông báo của mục Dữ liệu (T-295). Tên nút khôi phục theo ô (`recordBadge`, T-305), trạng thái HĐ, câu E20, dòng số HĐ của 8d (T-296). 6a / 6h / 6d, ô ngoài tháng / ngoài khoảng, tên ngày của lịch tháng (T-298). Bảng số cho chart N4–N1 cho trình đọc màn hình, bộ chọn kỳ áp dụng khi rời cả hai ô (T-299). Ngày nhanh đầu năm ở 6b / 6e (T-291 luật 5) |
> | F. Xuyên gói, bloat / hiệu năng, công cụ | `tools/**`, `e2e/**`, `.github/**`, `.githooks/**`, `.claude/**`, `packages/ui/scripts/`, `apps/desktop/vite.config.ts`, file gốc repo (gồm `eslint.config.js`); **luồng xuyên gói; toàn codebase cho bloat và hiệu năng** | 4 429 / 16 829 | 129, 130, 25 (bundle), 66, 67, CL3-A29 (đo); **R1 gộp đủ 37 dòng** | T-283, 287 (đo), 292 (bundle), 300, 301, 302, 304, 305, 307; **R2 gộp đủ mọi dòng** | Công cụ đổi: luật lint mới ở `eslint.config.js` (`import()` động của `@playwright/test`, chặn `zod` đầy đủ); `pr-status` / `pr-core` (`docsRead`, file đổi tên); `notes-core`; `check-tokens.ts`; helper e2e dùng chung và đồng hồ trang (T-268, T-283); bộ chụp ảnh hướng dẫn (T-305). Dữ liệu tải `119e2e4` ↔ SHA ghim: mọi chỗ khác giải thích được bằng luật đổi có chủ ý (K30–K39). Chuỗi nhiều bước, vd.: lưu lỗi → Thử lại → Nạp lại → đóng app; xuất ở exe lượt 3 (`119e2e4`) → nhập ở exe lượt 4 (bảy luật mới); mở `Project2C-data\` của exe lượt 3 bằng exe lượt 4 (migration `0012`). Bloat / bundle / exe so lượt 3, tách phần font, icon, `zod/mini`; kết luận SẴN SÀNG / CHƯA SẴN SÀNG |
>
> Issue của đợt sửa mục OPEN trước lượt 4 vào cột R2 của gói có file Issue đó sửa (`common\known.md` phần 5).
>
> ### Đọc trước
>
> - Như lượt 1–3: `CLAUDE.md` (gốc + của package trong gói), `CONTEXT.md`, `docs/design/phase-6-hoan-thien.md` (§4: S-2 với S2-6 sửa 25/10, Thùng rác TR-1…TR-13 và D1–D13; §5 ngưỡng).
> - Spec / golden / mockup theo gói:
>   - A: `phase-3-du-lieu.md` §4, §6 (gồm bảy luật T-291), `phase-4-chi-so.md`, `docs/golden/{chi-so,kh-theo-nhom,kyc,lich-hen}.md`, ADR-0007 (gồm phụ lục ngày nhanh đầu năm), ADR-0008 (gồm phụ lục dọn Thùng rác);
>   - B: ADR-0016, ADR-0009 phụ lục D-1, spec Phase 6 §4.1;
>   - C: `phase-5-ai.md` (gồm §6.1, §7), `phase-5-prompts.md` (gồm §11–§13), `docs/golden/ai-eval.md`, ADR-0009;
>   - D / E: `docs/design/mockups/` (gồm thẻ `#t284`, `#contrast` của `index.html`; `trash.html` 11h–11j; `settings-data.html` 10d), spec Phase 3 / 4 / 6, ADR-0013 (gồm phụ lục 27/10), mục "Lệch mockup đã biết" của `docs/testing/nghiem-thu-v1.md`;
>   - F: tất cả khi cần, `docs/metrics/phase-6.md`, `e2e/perf/README.md`.
> - Thêm cho lượt 4: tổng hợp lượt 3 `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` (§3 bảng R, §6 mô tả DR6-104…134, §7 số đo, §8.4 KNOWN, §9 quyết định Owner), tổng hợp lượt 1, 2, `common\known.md`, `common\fixes.md`, `common\baseline.md`.
> - **Spec, golden, mockup đã duyệt là nguồn đúng**: không đề xuất sửa chúng cho khớp code; chỗ chúng mâu thuẫn nhau thì báo là phát hiện trục C.
>
> ### Quy tắc chung
>
> 1. **Chỉ đọc và chạy lệnh: không sửa file trong repo, không sửa lỗi, không commit, không viết code sản phẩm.**
>    - Muốn thử "phá code" (đột biến, gỡ phần sửa) thì chép file vào thư mục kết quả của mình rồi chạy bản chép. Nếu buộc phải patch trong repo thì gỡ ngay sau khi chạy và kiểm lại bằng `git status` / sha256.
>    - **Trong bản chép repo không chạy `pnpm`, kể cả `pnpm exec`** (lượt 2, 3 làm junction `node_modules` của worktree trỏ sang bản chép): dùng junction sẵn có, gọi thẳng `node node_modules/<gói>/<cli>`.
>    - Cuối phiên `git status --short` của repo phải như đầu phiên (thư mục build / cache bị ignore thì không sao).
> 2. **Không gọi dịch vụ AI của sản phẩm:** không `pnpm eval:ai` / `node tools/eval-ai.mjs`, không bấm "Kiểm tra kết nối" bằng key thật, không đọc / in key trong Windows Credential Manager (`cmdkey`…), không mở chatgpt.com. Dùng adapter Mock, `fetch` / HTTP giả, hoặc server HTTP local tự dựng trong thư mục của mình. **Mọi probe trình duyệt chặn mạng ngoài `127.0.0.1` và thay `window.open` ngay từ lần chạy đầu.**
> 3. `pnpm e2e` dùng cổng cố định 4173: không chạy cùng lúc với bên khác; báo cổng bận thì chờ, **không** dùng `PW_REUSE=1`. Kết quả cổng ở SHA ghim đã có ở `common\baseline.md`, không bắt buộc chạy lại toàn bộ. Số bundle lấy ở `baseline.md`; tự `pnpm build:web` thì không đặt biến môi trường riêng (vd. `VITE_DEMO_ANCHOR`), hoặc ghi rõ đã đặt gì.
> 4. Môi trường Windows: `pnpm` lỗi trong shell hiện tại thì chạy qua `powershell -NoProfile -Command "pnpm …"`. Không dùng `python3` (stub, có thể treo). Script tạm viết bằng `node` (`.mjs` trong thư mục của mình). Probe PowerShell **không dùng hai biến chỉ khác hoa / thường** (PowerShell coi là một).
> 5. Mục có trong `common\known.md` gắn `KNOWN`, chỉ nêu khi có bằng chứng mới: sổ ACCEPTED (OPEN rỗng ở SHA ghim), quyết định Owner K1–K40, "Lệch mockup đã biết", các mục KNOWN của phần 4. Dòng của bảng R1 / R2 chỉ ghi ở bảng R, không ghi lại thành phát hiện; phần sửa còn thiếu / hồi quy thì ghi phát hiện mới, "Liên quan: DR6-xx" hay "Liên quan: T-xxx". DR6 đã sửa ở lượt 1–3 hỏng lại → phát hiện mới, "Liên quan: DR6-xx".
> 6. **Kết luận về màn** dựng probe qua lớp dữ liệu của app (`apps/desktop/src/data`: `openAppData`, `tables`), hoặc chạy trên bản build web bằng Playwright, hoặc trên exe qua cổng debug. Không gọi thẳng lệnh `db` / chèn SQL thô; probe `db` thô chỉ để kết luận về lệnh. Không có môi trường DOM thì dựng bản build, không dừng ở PLAUSIBLE.
>
> ### Cách tìm
>
> - Đọc sâu **từng file** trong phạm vi gói (phần diff `119e2e4..{SHA}` đọc kỹ nhất). Đi qua **mọi trục**: R kiểm phần đã sửa · E edge case · C đúng hợp đồng / spec / mockup / nhãn UI theo nghĩa thường · D dữ liệu · G guardrail AI · S an toàn ở ranh giới · P hiệu năng · B bloat · T chất lượng test · A trợ năng / i18n (định nghĩa ở `plan.md` §4.1, §L2.4). Trục không có gì thì ghi "đã xét, không thấy" **kèm đã chạy / đọc gì**.
> - **Chạy thử thay vì lập luận từ spec** ở mọi chỗ chạy được. Ưu tiên **kịch bản nhiều bước qua nhiều gói**: các lỗi Medium của lượt 1, 2 và của review Phase 5 đều chỉ lộ khi dựng chuỗi (xóa → đổi → khôi phục; bàn giao → ghi kết quả → hẹn tiếp → chỉ số; ghi bù cuộc gặp trước ngày tạo KH; dán lại chính tin nhắn của app; khôi phục backup cùng DB giữa lúc AI chạy). Đừng báo lại chính các ca đó (đã sửa, nằm ở bảng R hay KNOWN): dùng chúng làm mẫu để nghĩ ca mới.
> - **Bloat và Hiệu năng là hai mục riêng bắt buộc** (kể cả khi không có phát hiện), mỗi mục một bảng: đã chạy / đo gì, trên dữ liệu nào, số, ID phát hiện. Công cụ như lượt 1–3 (`tsc --noUnusedLocals --noUnusedParameters`, `rg`, `pnpm codemap`, `pnpm lint:deps`, `pnpm build:web`…).
> - Hiệu năng: **mọi phát hiện P phải có số đo** trên dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (sinh lại ở SHA ghim; hash ở `common\baseline.md`; dùng trong Node qua `importBackup` của `@p2c/db`, trong app qua Cài đặt → Dữ liệu → Nhập backup). So với ngưỡng `docs/metrics/phase-6.md` (gồm Dọn sạch ≤ 500 ms) và với mốc Home PC (`plan.md` §L4.6: mốc sau #656, lượt 3 cùng máy; luật nhiễu: quá 20 % **và** quá 10 ms). Ghi máy và việc gì đang chạy song song. Đo trên exe: chép `common\exe\project2c.exe` vào thư mục của mình, cổng debug khác 9222, theo `e2e/perf/README.md`; không đo khi bên khác đang đo.
> - **Không cài công cụ mới** (`knip`, `jscpd`, `cargo-bloat`, visualizer… là G4); thấy cần thì ghi đề xuất.
> - Không bình luận phong cách / đặt tên trừ khi gây lỗi. Không đặt chỉ tiêu số lượng phát hiện; không nâng mức cho nổi.
>
> ### Khuôn phát hiện
>
> ```
> ID: <ID>-<gói><số>   (vd. <ID>-A3)
> Mức: Critical | High | Medium | Low | Nit
> Trục: R | E | C | D | G | S | P | B | T | A
> Vị trí: path:dòng ({SHA})
> Tình trạng: CONFIRMED | PLAUSIBLE | KNOWN
> Liên quan: DR6-xx / T-xxx (nếu có) · mới do đợt sửa sau lượt 3 (PR #…) | có từ trước, lượt 1–3 bỏ sót
> Kịch bản: số dòng ở mục "Kịch bản mới đã thử" (nếu có)
> Mô tả: một-hai câu
> Tái hiện / bằng chứng: lệnh + kết quả, hoặc probe / test tạm (nguồn ở phụ lục)
> Ảnh hưởng: ai / khi nào gặp
> Đề xuất: hướng sửa ngắn; cỡ ước lượng (≤ 400 dòng SP?)
> ```
>
> - **Thước mức** (như lượt 1–3): Critical = mất dữ liệu đã lưu, hỏng file DB, lộ API key, chạy được code lạ — ở thao tác bình thường. High = thao tác bình thường làm dữ liệu sai lặng lẽ (lan sang chỉ số / báo cáo / backup mà người dùng không nhận ra) hoặc chặn hẳn việc chính không có đường vòng. Medium = thao tác bình thường dẫn tới dữ liệu sai / không đảo ngược được hoặc chặn việc chính (có đường vòng); thao tác chính vượt ngưỡng hiệu năng đã chốt. Low = cần điều kiện hiếm (file sửa tay, output suy biến, server bất thường, thao tác UI không cho), chỉ sai hiển thị, test hở, bloat có chi phí đo được. Nit = chữ, dọn dẹp, bloat không đo được chi phí.
> - **Bằng chứng phải thật.** Mỗi `path:dòng` phải đúng với file ở SHA ghim (đọc lại trước khi ghi). `CONFIRMED` chỉ khi đã chạy lệnh / probe và dán lệnh + trích kết quả thật; chưa chạy thì `PLAUSIBLE` và nói đã đọc gì. Không bịa số đo, tên hàm, tên test hay kết quả lệnh.
>
> ### Báo cáo
>
> File `C:\workspace\deep-review-1-6-r4\<bên>\<gói>.md`, tiếng Việt (thuật ngữ ngành giữ tiếng Anh như repo; không chen từ của ngôn ngữ khác), gồm theo thứ tự:
>
> 1. Bên, gói, SHA đầu phiên, `git status --short` đầu phiên, giờ bắt đầu, công cụ / model / mức suy luận.
> 2. **Bảng R1** mọi dòng mà gói kiểm, và **bảng R2** mọi Issue mà gói kiểm, cùng cột: `| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |`.
> 3. Phạm vi đã đọc (file, dòng; phần diff `119e2e4..{SHA}` của gói).
> 4. **Kịch bản mới đã thử**: `| # | Kịch bản | Kết quả | ID |`.
> 5. Phát hiện mới theo khuôn trên.
> 6. Mục **Bloat** và mục **Hiệu năng** (bảng số, so mốc sau #656 và lượt 3).
> 7. Bảng đếm mức × trục; nói rõ nếu tỉ lệ PLAUSIBLE cao.
> 8. "Đã xét, không thấy" theo từng trục.
> 9. Phụ lục: nguồn probe / test tạm / đột biến (cái nào bị test giết, cái nào sống), `git status --short` cuối phiên, giờ xong.
>
> **Gói F** thêm **bảng R1 gộp đủ 37 dòng** và **bảng R2 gộp đủ mọi dòng của `known.md`** (từ báo cáo A–E lượt 4 của chính bạn + phần F), và kết luận **SẴN SÀNG / CHƯA SẴN SÀNG cho v1.0 ở SHA `{SHA}`** kèm lý do.
>
> Xong gói thì làm như mục "Cuối phiên" của Bước 0. Không tổng hợp, không so với bên khác, không tạo Issue, không đề xuất merge.

## Phụ lục O — Prompt DeepSeek (lượt 4)

File `common\prompt-deepseek.md` = đoạn dưới + nguyên văn Phụ lục N; bước chuẩn bị chỉ thay `{SHA}` / `{SHA_ĐỦ}`. Owner chạy DeepSeek ở đợt 2 (§L4.9), mỗi gói một task mới trong app desktop WorkBuddy, lần lượt A → F. Đoạn này theo prompt DeepSeek của review Phase 5 (`docs/reviews/raw/2026-10-10/common-plan-opencode.md` Phụ lục C), đổi theo bài học §L4.7 và theo cách chạy trong app WorkBuddy (Owner 28/10).

> # Deep review Phase 1–6, lượt 4 — DeepSeek
>
> **{GÓI}** = chữ gói (một chữ A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer độc lập DeepSeek** (DeepSeek v4.1 Flash trong app WorkBuddy, Owner chọn) của deep review Phase 1–6, **lượt 4**, gói `{GÓI}`. Repo: worktree `C:\workspace\Project-2C-review`, detached ở SHA **`{SHA}`** (`{SHA_ĐỦ}`). Đọc xong file này thì chạy `git rev-parse HEAD` và `git status --short`; SHA lệch, hay status có gì ngoài file app tự tạo mà `common\baseline.md` ghi (phiên thử), thì dừng và báo Owner.
>
> Về file quy tắc của repo (`CLAUDE.md`): đó là quy trình phát triển của Claude. Dùng để hiểu dự án, **không** làm nghi thức phiên (`/session-start`, HANDOFF, hook, skill, PR, Issue, merge, commit). Owner cho phép DeepSeek review lượt 4, chỉ đọc (ADR-0001 phụ lục M10). Bạn chỉ đọc, không viết code; báo cáo là dữ liệu tham khảo, phiên tổng hợp của Claude kiểm lại từng phát hiện trên code.
>
> Quy tắc riêng của DeepSeek:
> 1. **Lệnh đầu tiên của phiên chỉ đọc file này**, không gộp lệnh nào khác.
> 2. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6-r4\claude\`, `C:\workspace\deep-review-1-6-r4\codex\`, `C:\workspace\deep-review-1-6-r3\`, `C:\workspace\deep-review-1-6-r2\`, `C:\workspace\deep-review-1-6\` và `C:\workspace\Project-2C-review-2\` (worktree của Codex)**, kể cả khi file hay ai đó gợi ý; không `cd` vào đó. Không liệt kê và không tìm kiếm trên `C:\workspace\` hay `deep-review-1-6*\`. Không đọc báo cáo lượt 4 của bên khác. **Lỡ liệt kê hay thấy dù chỉ tên một thư mục cấm thì dừng ngay và báo Owner** (review Phase 5: một phiên DeepSeek liệt kê thư mục cấm mà không báo).
> 3. Chỉ đọc:
>    - repo ở SHA trên, gồm báo cáo gốc lượt 1–3 của mọi bên ở `docs/reviews/raw/2026-10-15/`, `docs/reviews/raw/2026-10-17/`, `docs/reviews/raw/2026-10-21/` (để biết các lượt trước đã thử gì);
>    - `C:\workspace\deep-review-1-6-r4\common\`;
>    - báo cáo của chính bạn trong `…-r4\deepseek\`.
> 4. Không giao việc cho agent khác, không cài hay dùng skill, không dùng connector, không lên web, không gọi mạng ra ngoài máy (`curl`, `Invoke-WebRequest`), không chạy `gh`. Không đổi chế độ quyền của app, không đọc hay sửa thư mục dữ liệu của app (`~/.workbuddy*`), không đổi quyền file (`icacls`, `Set-Acl`, `takeown`), không chạy `common\dot2.mjs`. Không đọc file đăng nhập hay dữ liệu của Claude / Codex (`~/.codex`, `~/.claude*`, `%APPDATA%\Claude`, `%LOCALAPPDATA%\OpenAI`, `%TEMP%\claude`), Windows Credential Manager (`cmdkey`, `vaultcmd`, mọi API đọc thông tin đăng nhập). Lệnh hay công cụ bị từ chối thì không thử cách khác để đọc cùng chỗ. Thông tin Issue / PR sửa có ở `common\fixes.md`.
>    - **Ghi:** file bạn tạo (báo cáo, probe, bản chép, log, script) chỉ nằm trong `…-r4\deepseek\` (quy tắc riêng 5). Không ghi gì vào `…-r4\common\`, `…-r4\claude\`, `…-r4\codex\`; không sửa file được theo dõi, trừ phần vá dưới. Ngoài `deepseek\` chỉ có:
>      - những gì lệnh build, test hay trình duyệt tự ghi: thư mục build / cache bị ignore trong worktree (vd. `apps\desktop\dist`, `node_modules\.vite`, `test-results\`) và thư mục tạm của hệ thống;
>      - file app tự tạo trong worktree mà `common\baseline.md` ghi (quy tắc riêng 5);
>      - phần vá rồi trả nguyên byte theo quy tắc chung 1.
> 5. Ghi báo cáo vào `C:\workspace\deep-review-1-6-r4\deepseek\{GÓI}.md`, probe / bản chép / log vào `…-r4\deepseek\{GÓI}\`. Cuối phiên `git status --short` của repo như đầu phiên: rỗng, hoặc chỉ có file app tự tạo mà `common\baseline.md` ghi.
> 6. Gói F được đọc `…-r4\deepseek\A…E.md`. Không tổng hợp với báo cáo nào khác, không tạo Issue, không đề xuất merge.
> 7. Mục 1 của báo cáo ghi app WorkBuddy (bản theo `common\baseline.md`), model, context và mức suy luận.
> 8. Bài học của chính DeepSeek ở review Phase 5 (`docs/reviews/2026-10-10-danh-gia-deepseek-muse.md` §3.1, §6, §7):
>    - hai lỗi Medium khi đó đều cần **chuỗi nhiều bước qua nhiều gói**, và DeepSeek không dựng chuỗi nào như vậy. Phần 2 dành phần lớn thời gian cho chuỗi; kết luận SẴN SÀNG ở F phải nêu đã thử những chuỗi nào;
>    - gói D khi đó không chạy giao diện ("không có môi trường DOM"): lần này kết luận về màn phải chạy trên bản build web bằng Playwright hoặc trên exe (phần chung, quy tắc chung 6);
>    - một phát hiện đề xuất trái golden đã đọc: đọc golden / spec liên quan trước khi đề xuất, không đề xuất sửa golden;
>    - không khẳng định điều không có căn cứ; không chạy được thì ghi PLAUSIBLE;
>    - bước "gỡ tạm phần sửa" của bảng R là bắt buộc ở mọi dòng; dùng đột biến để tìm chỗ hở, không chỉ để khẳng định test tốt.
>
> Phần chung dưới đây áp dụng đầy đủ. Trong phần chung: `<bên>` = `deepseek`, `<ID>` = `DSR4`.

## Phụ lục P — Cấu hình app desktop WorkBuddy của DeepSeek (lượt 4)

Owner 28/10/2026 (§L4.11; G4 / G6 duyệt trên #880): DeepSeek chạy trong **app desktop WorkBuddy** của Tencent, bản quốc tế, dùng model DeepSeek V4.1 Flash gắn sẵn của gói **WorkBuddy Pro**, cùng user Windows (phương án (b)). Cấu hình của các bản trước (DSH ở PR #872; CodeBuddy Code CLI ở bản đầu của PR #881; §L4.11) bỏ; bộ ACL đợt 2 và `dot2.mjs` giữ.

**Tài liệu nói gì** (`workbuddy.ai/docs/workbuddy/*`, đọc 28/10; nguồn ở comment đề xuất G6 sửa lại trên #880):

- Cài trên Windows 10 1809+ / 11, 64-bit; đăng nhập bản quốc tế bằng Google hay GitHub OAuth (`Installation-Win-Guide`). Tài liệu không nói số bản hay việc tự cập nhật.
- Quyền chỉ có hai chế độ (`Permission-Modes`):
  - **Default:** "Commands run under sandbox constraints first. If they are blocked, WorkBuddy then decides whether confirmation is needed based on risk." App hỏi Owner khi: ghi vào đường dẫn nhạy cảm (key, thông tin đăng nhập, cài đặt bảo mật); xóa file quan trọng hay nhiều file; chạy script / lệnh / chương trình ngoài; truy cập mạng hay năng lực nhạy cảm. Có bảo vệ xóa, và sao lưu file trước khi sửa (chỉ trên Windows).
  - **Full Access:** "turns off the confirmation flow above".
  - Không có danh sách allow / deny cho người dùng.
- Workspace là "the folder where the current task mainly reads and saves files", chọn lúc tạo task (`Permission-Modes`).
- Model chọn ở bộ chọn model trong khung chat; Auto Mode thì app tự chọn model (`Model`). Tài liệu không ghi context hay mức suy luận; Owner đã thấy trong app đủ model bản 1017, context 1M, mức suy luận cao nhất (§L4.11).
- Memory "extracts and saves relevant context from your conversations", "Enabled by default". Tài liệu không có công tắc tắt, chỉ sửa hay xóa từng mục (`Memory`).
- Có cài tự động skill "không rủi ro cao" (`Setting`); có connector (MCP), điều khiển từ xa, tác vụ tự động.
- Log ứng dụng: Help → Open Log Directory; log "may contain data such as conversation records" (`FAQ`).
- Dữ liệu cục bộ (bên thứ ba: `workbuddy-account-migrate`, `workbuddy-chat-exporter`; phiên thử kiểm):
  - thư mục `%USERPROFILE%\.workbuddy-ai` (bản quốc tế) hay `.workbuddy`;
  - `workbuddy.db` (SQLite, bảng `sessions` có `cwd`, model);
  - bản ghi phiên `projects\<thư mục theo cwd>\<id phiên>.jsonl`, có lệnh gọi công cụ (`Bash`, `Read`…), kèm `tool-results\`. Theo `transcript.py` của `workbuddy-chat-exporter` (docstring, commit `b1b14b4` ngày 25/10): mỗi dòng một bản ghi JSON, `type` cho biết loại: `message` (`role` user / assistant), `reasoning`, `function_call` (lệnh gọi công cụ: `name` + `arguments` dạng chuỗi JSON), `function_call_result`, `file-history-snapshot` (bản sao lưu file), và vài loại khác;
  - memory `memory\<uid>_memory.md`; trạng thái đăng nhập `storage\skeleton\account-snapshot.json`; `.master.key`.
- Model gắn sẵn: tài liệu không ghi chạy đường Vendor Direct (DeepSeek phục vụ) hay bản Tencent tự chạy. Owner chấp nhận (§L4.11).

Vì vậy **ACL của đợt 2 là lớp chặn đọc duy nhất**. App không có luật chặn theo đường dẫn. Sandbox của chế độ Default chỉ là lớp thêm, và tài liệu không nói nó chặn gì. Ghi ngoài `deepseek\` chỉ có prompt, `git status`, hash 12 báo cáo và quét log.

**Ranh giới tài khoản** (G6, Owner 28/10), theo thứ tự:

1. App WorkBuddy đã đăng nhập trên Home PC thì Owner đăng xuất trước bước chuẩn bị. Trong đợt 1 không đăng nhập app trên máy này; credit tặng hằng ngày lấy trên Office Laptop.
2. Bước chuẩn bị (Claude) không mở app, không đọc thư mục dữ liệu của app.
3. Owner đăng ký WorkBuddy Pro sát ngày chạy đợt 2.
4. Đợt 2 bước 4: Owner đăng nhập app, sau khi ACL đã đặt. Từ đó chỉ Owner dùng app và đụng tới thư mục dữ liệu của app. Không phiên Claude nào đăng nhập, đọc, in hay lưu token.
5. Xong F: đăng xuất app trước, rồi mới chép log phiên ra (§L4.10).

**Gói và chi phí** (G4, Owner 28/10):

- WorkBuddy Pro một tháng: 10 USD, tháng đầu 7 USD với người chưa từng đăng ký hay dùng thử; 2.000 credit/tháng, không cộng dồn. Thêm 50 credit cho mỗi ngày có chat hay tác vụ trong app WorkBuddy hoặc CodeBuddy (khuyến mãi có thời hạn). Không cần gia hạn thì hủy tự gia hạn ngay sau khi đăng ký; gói vẫn dùng được tới hết kỳ.
- **Trần 25 USD:** gói Pro cộng tối đa một gói mua thêm 500 credit (15 USD, không hoàn tiền).
- WorkBuddy không công bố 1 credit bằng bao nhiêu token. DeepSeek V4.1 Flash miễn phí trên bản quốc tế tới hết 31/10, sau đó hệ số chưa công bố. Vì vậy đo ở phiên thử và sau mỗi gói (§L4.9 đợt 2 bước 5, 6); ước cho các gói còn lại vượt trần thì dừng, hỏi Owner.

**Cài đặt app** (§L4.9 đợt 2 bước 4; Owner làm, ghi vào `baseline.md`):

| Việc | Cài đặt | Nguồn |
|---|---|---|
| Model đúng như Owner chọn, không để app tự chọn | tắt Auto Mode; mỗi task chọn tay DeepSeek V4.1 Flash bản 1017, context 1M, mức suy luận cao nhất | `Model`; Owner kiểm 28/10 |
| Không agent phụ | một agent, không dùng chế độ nhóm chuyên gia | phiên thử kiểm |
| Không cài thêm năng lực trong lúc chạy | tắt "Auto-Install Non-High-Risk Skills"; không cài skill | `Setting` |
| Không nối dịch vụ ngoài | không connector, không điều khiển từ xa (Slack / Telegram / Discord), không tác vụ tự động | `Overview`, `Setting` |
| Không mang ngữ cảnh lạ vào gói | xem Memory trước phiên thử, xóa mục không thuộc lượt 4; ngay trước gói A, xóa mọi mục mới từ lúc đó (các task thử tạo); không tắt được | `Memory`; review #881 |
| Chỗ làm của mọi task | workspace `C:\workspace\Project-2C-review` | `Permission-Modes` |
| Gói chạy lâu (tùy chọn) | bật Prevent Sleep | `Setting` |

**Chế độ quyền** (G6, Owner 28/10: "Duyệt, Default trước"):

- Phiên thử chạy Default, đếm số lần app hỏi và ghi thông báo lỗi của mỗi lần đọc thử bị từ chối (§L4.9 đợt 2 bước 5). Ở Default lệnh chạy trong sandbox trước, nên thông báo lỗi dùng để phân biệt lần ACL chặn với lần sandbox chặn trước (review #881).
- App hỏi ở hầu hết lệnh thường (`git`, `node`, đọc file trong workspace) → Owner chuyển sang Full Access cho các gói, như Muse `--yolo` ở lượt 1 (§7.1). Khi đó không còn sandbox hay hỏi duyệt: ACL là lớp chặn đọc duy nhất. Vì vậy trước gói A, một task Full Access đọc lại mỗi loại mục bị chặn như phiên thử; ra khác "bị từ chối" thì dừng đợt 2 (review #881).
- Không thì giữ Default. App hỏi việc gì ngoài việc review thì Owner từ chối.
- Lựa chọn ghi vào `baseline.md` và bảng đánh dấu.

**Hash 12 báo cáo** (§L4.9 đợt 2 bước 3 và 7.5): ACL chỉ chặn đọc, mà app không có luật chặn ghi, nên lệnh của model ghi đè được báo cáo của Claude / Codex dù không đọc được chúng. Owner ghi hash trước khi chặn, so lại sau khi gỡ.

**Từng luật của bản OpenCode 27/10, nay giữ ở đâu:**

| Luật cũ (`opencode.json`) | Lượt 4 với app WorkBuddy |
|---|---|
| `read` / `glob` / `grep` / `list` / `external_directory` cấm `deep-review-1-6-r4\claude`, `\codex` | ACL đợt 2, cả thư mục |
| (chưa có) | ACL đợt 2: `%USERPROFILE%\.codex` theo từng mục con, transcript Claude của worktree review (review #863; Owner 28/10, phương án (b)); `file-history` và scratchpad của các phiên đó (review #872) |
| Cấm thư mục lượt 1–3 (`deep-review-1-6-r3`, `-r2`, `deep-review-1-6\{claude,codex,muse}`) | ACL đợt 2, cả ba thư mục (review #872); prompt (Phụ lục O quy tắc riêng 2); quét log |
| (chưa có) | `Project-2C-review-2` (worktree của Codex): dọn trước đợt 2; ACL đợt 2 theo từng mục con, để ngỏ `node_modules` và `.git` (review #872); prompt cấm; quét log |
| (chưa có) | Cache tạm có bản biến đổi của code probe (`%TEMP%\playwright*`, `%TEMP%\…\ssr`, `%TEMP%\codex-*`), cache Vite / Vitest trong `node_modules`: xóa ở đợt 2 bước 1; `scan` tìm bản sao còn đọc được (review #872, #878) |
| Liệt kê `C:\workspace`, `deep-review-1-6*` phải hỏi | Prompt cấm; quét log |
| `edit` chỉ được ghi trong `deepseek\` | Nới ra (review #881): prompt (Phụ lục O quy tắc riêng 4) cho file tự tạo chỉ ở `deepseek\`; ngoài đó chỉ thư mục build / cache bị ignore, thư mục tạm, file app tự tạo mà `baseline.md` ghi, vá rồi trả nguyên byte (quy tắc chung 1). Kiểm: `git status` cuối mỗi gói; hash 12 báo cáo; sandbox nếu giữ Default; quét log |
| `task` (subagent) cấm | Một agent (cài đặt app); prompt cấm; quét log |
| `webfetch` / `websearch` cấm | Prompt cấm; quét log. Tài liệu không cho tắt công cụ web; phiên thử ghi lại |
| `git commit` / `push` / `stash` / `switch` / `clean` / `merge` / `rebase` / `checkout` / `restore` / `reset` cấm | Prompt (Phụ lục N quy tắc chung 1). Quét log. `main` có ruleset và hook `pre-push` |
| `gh *` cấm | `gh auth logout` trong đợt 2 |
| `pnpm eval:ai`, `tools/eval-ai.mjs` cấm | Prompt (Phụ lục N quy tắc chung 2). Script cần `OPENCODE_GO_KEY` trong môi trường, mà biến môi trường của user không có biến này (§L4.9 đợt 2 bước 2) |
| `opencode *` và file đăng nhập của OpenCode cấm | Prompt cấm đổi chế độ quyền, đọc / sửa `~/.workbuddy*`; quét log |
| `*auth export*`, `*cmdkey*`, `*CredentialManager*`, `*chatgpt.com*` cấm | Prompt (Phụ lục N quy tắc chung 2, Phụ lục O quy tắc riêng 4); quét log. Phần còn hở đã chấp nhận ở G6 (dưới) |
| `curl` / `Invoke-WebRequest` / `Invoke-RestMethod` phải hỏi | Default hỏi khi truy cập mạng (theo tài liệu), Full Access thì không; prompt cấm gọi ra ngoài máy; quét log |

**Script đợt 2** (`common\dot2.mjs`, review #872). Bước chuẩn bị chép nguyên văn khối code dưới (§L4.9 bước 4); Owner chạy ở đợt 2 bước 1, 3 và 7. Đường dẫn tính từ chỗ đặt script (`C:\workspace\deep-review-1-6-r4\common\`) và từ `%USERPROFILE%`, `%TEMP%`, `%APPDATA%`, `%LOCALAPPDATA%`. Script không đụng tới thư mục dữ liệu của app WorkBuddy.

- `baseline`: ghi `dot2-baseline.json`, gồm từng file và thư mục mà git không theo dõi (`git ls-files --others`: chưa theo dõi hay bị ignore) của hai worktree, kể cả bên trong thư mục bị ignore (review #872).
  - Bỏ `node_modules` và thư mục chứa nó.
  - Git đi xuyên junction; đường dẫn nào nó liệt kê qua một link thì script ghi chính link đó.
- `clean`: xóa file / thư mục ngoài mốc ở hai worktree, cache Vite / Vitest, cache tạm có code probe; rồi kiểm lại. Tầng sâu xóa trước; thư mục chỉ xóa khi đã rỗng; link chỉ xóa chính link. Mọi thư mục chưa theo dõi hay bị ignore có `node_modules` con, kể cả thư mục đã có lúc ghi mốc, thì in một dòng `kept, holds node_modules`, và cache Vite trong `node_modules` đó cũng bị xóa (review #878, #881).
- `deny`:
  - chặn cả thư mục bằng `(OI)(CI)(R)` khi mọi file hard link trong đó có đủ link ở trong. Script so `nlink` với số đường dẫn cùng `ino` tìm thấy, không đi theo junction;
  - với `.codex` và `Project-2C-review-2`: chặn từng mục con không có link ra ngoài, để ngỏ `node_modules`, `.git` và link, đi tiếp vào mục con có link ra ngoài; file chặn bằng `(R)`;
  - ghi `dot2-acl.json` sau mỗi lần chặn, rồi kiểm mỗi mục bị từ chối, kể cả một file trong mỗi thư mục chặn cả. `--dry-run` chỉ in danh sách.
- `scan`: như §L4.9 đợt 2 bước 3. Bỏ qua file cũ hơn mốc, file đăng nhập (`.credentials*`, `auth.json`) và `C:\workspace\Project-2`; in tên file trên 64 MB không đọc. Chỗ thấy trong `%APPDATA%\Claude\claude-code-sessions` chỉ in ra, không `STOP`.
- `remove`: `icacls /remove:d` trên mọi mục của `dot2-acl.json`, rồi trên các thư mục chuẩn và trên mọi mục còn không đọc được ở mọi tầng của `.codex`, `Project-2C-review-2` (phòng khi file trạng thái thiếu; review #872); kiểm đọc lại được.

Đã thử ngày 28/10 trên Home PC (PR #872):
- ACL: deny `(OI)(CI)` trên một thư mục không đi qua junction ở trong, nhưng chặn cả đường dẫn bên ngoài của file hard link ở trong. `/remove:d` trả lại cả hai.
- Script: test đầu-cuối trên cây giả (worktree git, hard link, junction) qua cả năm lệnh, cả khi đường dẫn có dấu cách như `C:\Users\Duong Hoang`.
- `deny --dry-run` trên thư mục thật: 62 mục thư mục và 58 mục file, để ngỏ 4 mục (`node_modules` và `.git` trong `.codex` và trong `Project-2C-review-2`), chạy 1 giây.
- `scan` với mốc 20/10: 69 308 file, 76 giây, không chỗ nào khớp.

Sửa sau review #872 (T-314 #876), thử ngày 28/10 trên Office Laptop. Cây giả nằm trong `%TEMP%`, đường dẫn có dấu cách, `USERPROFILE` / `TEMP` / `APPDATA` / `LOCALAPPDATA` giả; `deny` chỉ chạy sau khi `--dry-run` không liệt kê gì ngoài cây giả.
- `clean`, kịch bản của review #872: file thêm sau mốc vào `test-results\`, `coverage\` có sẵn lúc ghi mốc nay bị xóa; `node_modules` và mục đã có ở mốc còn nguyên; lệnh in `OK`. Bản trước giữ các file đó mà vẫn in `OK`.
- Junction ngoài `node_modules`: bản trước theo junction, xóa cả file được theo dõi và file ngoài worktree. Nay script chỉ xóa chính link.
- `deny`, xóa `dot2-acl.json`, rồi `remove`: mọi mục đọc lại được, kể cả `.codex\.chatgpt-projects\p\other.txt` và thư mục `q` ở tầng 2. Bản trước để lại cả hai mà vẫn in `OK`.

Sửa sau review #878 (T-315 #880), thử ngày 28/10 trên Office Laptop, cùng cách dựng cây giả (đường dẫn có dấu cách; `TEMP`, `USERPROFILE`, `APPDATA`, `LOCALAPPDATA` giả). Đợt 1 giả để lại `probe4\` (`package.json`, `node_modules\.vite`, `.vite-temp`) và `probe6\sub\node_modules\.vite`:
- bản `main` `76601fd`: `clean` giữ cache `.vite` / `.vite-temp` của hai thư mục đó, không in dòng nào về chúng, vẫn in `OK` (đỏ 5 / 14 kiểm tra);
- bản này: in `kept, holds node_modules` cho `probe4\` và `probe6\sub\`, xóa cache của hai thư mục đó, giữ gói trong `node_modules`; mục khác như bản trước (xanh 14 / 14).

**Ghi chú sau lượt 4** (đợt 2 bước 7, 30–31/10; tổng hợp T-318 #893 §10.1, `common\baseline.md` "Bước 7"):

- `remove` dừng ở `STOP` trên 16 mục trong `.codex\.chatgpt-projects\…\specialist-toolkit\` do tài khoản sandbox của Codex (`CodexSandboxOffline`) làm chủ.
  - `dot2.mjs` coi mọi mục nó chặn đều do tài khoản Owner làm chủ. Luật `deny … (R)` lấy cả READ_CONTROL, nên với mục của tài khoản khác, tài khoản Owner không đọc hay sửa lại được ACL, kể cả trong PowerShell admin.
  - Gỡ ở thư mục cũng không lan xuống file con do tài khoản khác làm chủ.
- Owner duyệt (30/10) chạy `common\dot2-unlock.ps1` một lần dưới quyền SYSTEM qua task tạm, rồi tự tính lại quyền thừa kế cho 9 file của `.codex\.sandbox-bin` bằng quyền chủ file. Mọi mục mở lại được bằng tài khoản Owner, trừ `.codex\.sandbox-bin` (ACL riêng của Codex).
- Lần sau: xem chủ sở hữu từng mục trước khi chặn. Mục do tài khoản khác làm chủ thì không chặn riêng, hoặc ghi lại để gỡ bằng quyền SYSTEM. `remove` liệt kê hết mục chưa trả được thay vì dừng ở mục đầu.

```js
// Deep review round 4, wave 2 (plan §L4.9, Appendix P). Run from PowerShell; baseline by the
// preparation session, the rest by the Owner:
//   node dot2.mjs baseline          preparation step 4: untracked / ignored entries of both review worktrees
//   node dot2.mjs clean             wave 2 step 1: delete what wave 1 left beyond that, and probe caches
//   node dot2.mjs deny [--dry-run]  wave 2 step 3: deny the Owner's account reads (ACL), then check
//   node dot2.mjs scan              wave 2 step 3: look for readable copies of Claude / Codex round 4 work
//   node dot2.mjs remove            wave 2 step 7: remove the denies, then check
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const COMMON = path.dirname(fileURLToPath(import.meta.url));
const R4 = path.dirname(COMMON);
const WS = path.dirname(R4);
const { USERPROFILE: HOME, TEMP, APPDATA, LOCALAPPDATA, USERNAME: USER } = process.env;
const REVIEW = path.join(WS, 'Project-2C-review');
const WORKTREES = [REVIEW, path.join(WS, 'Project-2C-review-2')];
// Claude Code names a project folder after its cwd, every other character turned into '-'.
const PROJECT = REVIEW.replace(/[^A-Za-z0-9-]/g, '-');
// Data mixed with packages hard-linked into the checkouts' node_modules: denied child by child.
const SPLIT = [path.join(HOME, '.codex'), path.join(WS, 'Project-2C-review-2')];
const BASELINE = path.join(COMMON, 'dot2-baseline.json');
const STATE = path.join(COMMON, 'dot2-acl.json');
// Round 4 finding IDs and report header lines of Claude / Codex; plan.md and the prompts have neither.
const MARKER = /C[LX]R4-[A-F]\d|(?:ĐANG LÀM|XONG) — (?:claude|codex) gói [A-F] lượt 4/;

class Stop extends Error {}
const exists = (p) => fs.existsSync(p);
const list = (dir) => fs.readdirSync(dir, { withFileTypes: true });
const subdirs = (dir, re = /./) =>
  exists(dir) ? list(dir).filter((e) => e.isDirectory() && re.test(e.name)).map((e) => path.join(dir, e.name)) : [];
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const needBaseline = () => {
  if (!exists(BASELINE)) throw new Stop(`no ${BASELINE}: preparation step 4 runs baseline first`);
};
const writeJson = (p, v) => fs.writeFileSync(p, `${JSON.stringify(v, null, 2)}\n`);
const icacls = (...args) => execFileSync('icacls', [...args, '/Q'], { stdio: ['ignore', 'ignore', 'inherit'] });
// Opening is enough to prove access; large files are not read.
function canOpen(p, kind) {
  try {
    if (kind === 'tree') fs.readdirSync(p);
    else fs.closeSync(fs.openSync(p, 'r'));
    return true;
  } catch (e) {
    if (e.code === 'EPERM' || e.code === 'EACCES') return false;
    throw e;
  }
}

// What git does not track (untracked or ignored): each file and folder (trailing '/'), also inside an
// ignored folder (review #872). Not listed: node_modules, a folder holding one, what a link points at.
// held, when given, gets each such folder whose own node_modules kept it (review #878).
function leftovers(wt, held) {
  const others = (...extra) =>
    execFileSync('git', ['-C', wt, 'ls-files', '-z', '--others', '--exclude-standard', '--directory', ...extra], {
      encoding: 'utf8',
    }).split('\0');
  const found = new Set();
  // True when rel is or holds a node_modules.
  const add = (rel) => {
    if (/(^|\/)node_modules(\/|$)/.test(rel)) return true;
    if (!rel.endsWith('/')) {
      found.add(rel);
      return false;
    }
    let modules = false;
    for (const e of list(path.join(wt, rel))) {
      if (e.name === 'node_modules') held?.add(rel);
      modules = add(`${rel}${e.name}${e.isDirectory() ? '/' : ''}`) || modules;
    }
    if (!modules) found.add(rel);
    return modules;
  };
  for (const e of [...others(), ...others('--ignored')]) {
    // git walks into a junction: what it lists through a link stands for the link itself.
    const parts = e.split('/').filter(Boolean);
    const at = parts.findIndex((_, i) => fs.lstatSync(path.join(wt, ...parts.slice(0, i + 1))).isSymbolicLink());
    if (at >= 0) add(parts.slice(0, at + 1).join('/'));
    else if (e) add(e);
  }
  return [...found].sort();
}

function baseline() {
  if (exists(BASELINE)) throw new Stop(`${BASELINE} already exists`);
  const base = Object.fromEntries(WORKTREES.map((wt) => [wt, leftovers(wt)]));
  writeJson(BASELINE, base);
  for (const wt of WORKTREES) console.log(`${wt}: ${base[wt].length} untracked / ignored entries kept`);
}

function clean() {
  needBaseline();
  const base = readJson(BASELINE);
  const extras = (wt, held) => {
    const kept = new Set(base[wt]);
    return leftovers(wt, held).filter((e) => !kept.has(e));
  };
  const caches = [];
  for (const wt of WORKTREES) {
    const held = new Set();
    const doomed = extras(wt, held);
    const all = new Set(doomed);
    // Deepest first: a folder goes once empty; a link goes, not what it points at.
    for (const e of [...doomed].reverse()) {
      const p = path.join(wt, e);
      if (e.endsWith('/')) {
        if (!exists(p) || list(p).length) continue;
        fs.rmdirSync(p);
      } else fs.rmSync(p, { force: true });
      // One line for a new folder, not one for each file in it.
      if (!all.has(e.replace(/[^/]+\/?$/, ''))) console.log(`deleted ${p}`);
    }
    // A folder kept for its own node_modules, e.g. a probe with a package.json, stays: say so.
    for (const rel of held) console.log(`kept, holds node_modules: ${path.join(wt, rel)}`);
    // Vite / Vitest caches keep the names and results of the test files that ran, and transformed
    // probe code: Vite puts its cache by the nearest package.json, so the kept folders have one too.
    const pkgs = [wt, ...subdirs(path.join(wt, 'apps')), ...subdirs(path.join(wt, 'packages'))];
    for (const pkg of [...pkgs, ...[...held].map((rel) => path.join(wt, rel))])
      caches.push(path.join(pkg, 'node_modules', '.vite'), path.join(pkg, 'node_modules', '.vite-temp'));
  }
  // Transformed copies of probe code: Playwright cache and browser profiles, Vite SSR dumps, Codex artifacts.
  caches.push(...subdirs(TEMP).filter((d) => /^(playwright|codex-)/i.test(path.basename(d)) || exists(path.join(d, 'ssr'))));
  for (const p of caches) {
    if (!exists(p)) continue;
    fs.rmSync(p, { recursive: true, force: true });
    console.log(`deleted ${p}`);
  }
  for (const wt of WORKTREES) {
    const left = extras(wt);
    if (left.length) throw new Stop(`${wt} still has: ${left.join(', ')}`);
  }
  console.log('OK: both worktrees are back to dot2-baseline.json');
}

// Files under root that also have a link outside it; the walk does not follow junctions or symlinks.
function walkTree(root) {
  const links = new Map();
  let sample = null;
  const walk = (dir) => {
    for (const e of list(dir)) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile()) {
        sample ??= p;
        const st = fs.lstatSync(p, { bigint: true });
        if (st.nlink < 2n) continue;
        const key = `${st.dev}:${st.ino}`;
        const seen = links.get(key) ?? { p, nlink: st.nlink, n: 0n };
        seen.n += 1n;
        links.set(key, seen);
      }
    }
  };
  walk(root);
  return { sample, outside: [...links.values()].filter((l) => l.n < l.nlink).map((l) => l.p) };
}

const claudeDirs = () => subdirs(HOME, /^\.claude/);

// Denied whole: reports, transcripts, file copies and scratchpads of the other reviewers.
function treeTargets() {
  const out = [path.join(R4, 'claude'), path.join(R4, 'codex')];
  out.push(...['deep-review-1-6-r3', 'deep-review-1-6-r2', 'deep-review-1-6'].map((n) => path.join(WS, n)));
  for (const c of claudeDirs()) {
    const proj = path.join(c, 'projects', PROJECT);
    if (!exists(proj)) continue;
    out.push(proj);
    // file-history keeps a copy of each file a session wrote, in a folder named after the session.
    for (const id of new Set(list(proj).map((e) => e.name.replace(/\.jsonl$/, '')))) out.push(path.join(c, 'file-history', id));
  }
  out.push(path.join(TEMP, 'claude', PROJECT));
  return out.filter(exists);
}

const keptBySplit = (e) => e.isSymbolicLink() || e.name === 'node_modules' || e.name === '.git';

// Deny each child of dir that has no outside link; node_modules, .git and links stay readable.
function splitEntries(dir, entries, kept) {
  for (const e of list(dir)) {
    const p = path.join(dir, e.name);
    if (keptBySplit(e)) kept.push(p);
    else if (e.isDirectory()) {
      if (walkTree(p).outside.length) splitEntries(p, entries, kept);
      else entries.push({ path: p, kind: 'tree' });
    } else if (e.isFile()) {
      if (fs.lstatSync(p, { bigint: true }).nlink > 1n) kept.push(p);
      else entries.push({ path: p, kind: 'file' });
    }
  }
}

function deny(dryRun) {
  if (exists(STATE)) throw new Stop(`${STATE} exists: run remove first`);
  const entries = [];
  const kept = [];
  const samples = new Map();
  const linked = [];
  for (const t of treeTargets()) {
    const { sample, outside } = walkTree(t);
    if (outside.length) linked.push(`${t}: ${outside.length} file(s) also linked outside it, e.g. ${outside[0]}`);
    entries.push({ path: t, kind: 'tree' });
    if (sample) samples.set(t, sample);
  }
  // A deny on a hard-linked file reaches all its links, e.g. the node_modules of the checkouts.
  if (linked.length) throw new Stop(`nothing denied:\n${linked.join('\n')}`);
  for (const t of SPLIT.filter(exists)) splitEntries(t, entries, kept);
  for (const e of entries) console.log(`${dryRun ? 'would deny' : 'deny'} ${e.kind} ${e.path}`);
  for (const p of kept) console.log(`stays readable ${p}`);
  if (dryRun) return;
  const state = { user: USER, at: new Date().toISOString(), entries: [], kept };
  for (const e of entries) {
    icacls(e.path, '/deny', `${USER}:${e.kind === 'tree' ? '(OI)(CI)(R)' : '(R)'}`);
    state.entries.push(e);
    writeJson(STATE, state);
  }
  const open = entries.filter((e) => canOpen(e.path, e.kind) || (samples.has(e.path) && canOpen(samples.get(e.path), 'file')));
  if (open.length) throw new Stop(`still readable: ${open.map((e) => e.path).join(', ')}; run remove`);
  console.log(`OK: ${entries.length} entries denied, ${kept.length} left readable; state in ${STATE}`);
}

function remove() {
  const state = exists(STATE) ? readJson(STATE) : null;
  if (!state) console.log(`no ${STATE}: removing from the standard targets and from what is still denied in ${SPLIT.join(', ')}`);
  const done = new Map();
  const undo = (p, kind) => {
    if (done.has(p) || !exists(p)) return;
    icacls(p, '/remove:d', USER);
    done.set(p, kind);
  };
  for (const e of [...(state?.entries ?? [])].reverse()) undo(e.path, e.kind);
  // The standard targets too, in case the state file is missing or incomplete.
  for (const c of claudeDirs()) undo(path.join(c, 'projects', PROJECT), 'tree');
  for (const t of treeTargets()) undo(t, 'tree');
  // In .codex and Project-2C-review-2 deny went as deep as the outside links (splitEntries): whatever
  // there still does not read is undone, at any depth, also without the state file (review #872).
  const undoSplit = (dir) => {
    for (const e of list(dir)) {
      const p = path.join(dir, e.name);
      if (keptBySplit(e)) continue;
      if (e.isDirectory()) {
        if (canOpen(p, 'tree')) undoSplit(p);
        else undo(p, 'tree');
      } else if (e.isFile() && !canOpen(p, 'file')) undo(p, 'file');
    }
  };
  for (const t of SPLIT.filter(exists)) undoSplit(t);
  const closed = [...done].filter(([p, kind]) => !canOpen(p, kind)).map(([p]) => p);
  if (closed.length) throw new Stop(`still denied: ${closed.join(', ')}`);
  if (state) fs.renameSync(STATE, path.join(COMMON, 'dot2-acl.removed.json'));
  console.log(`OK: denies removed from ${done.size} entries, all readable again`);
}

function scan() {
  needBaseline();
  // Files older than the baseline (preparation, before wave 1) cannot hold round 4 work.
  const since = fs.statSync(BASELINE).mtimeMs;
  const roots = [
    ...subdirs(HOME, /^\.(claude|codex)/),
    path.join(APPDATA, 'Claude'),
    path.join(LOCALAPPDATA, 'Claude'),
    path.join(LOCALAPPDATA, 'OpenAI'),
    ...subdirs(path.join(LOCALAPPDATA, 'Packages'), /^(Claude|OpenAI)/i),
    TEMP,
    WS,
  ].filter(exists);
  const skipDirs = new Set(['.git', '.pnpm', 'target']);
  const notOpened = path.join(WS, 'Project-2'); // never opened (CLAUDE.md)
  const hits = [];
  const big = [];
  let read = 0;
  let closed = 0;
  const walk = (dir) => {
    let ents;
    try {
      ents = list(dir);
    } catch {
      closed++;
      return;
    }
    for (const e of ents) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!skipDirs.has(e.name) && p !== notOpened) walk(p);
        continue;
      }
      if (!e.isFile() || /^(\.credentials|auth\.json$)/.test(e.name)) continue;
      let buf;
      try {
        const st = fs.statSync(p);
        if (st.mtimeMs < since) continue;
        if (st.size > 64 * 2 ** 20) {
          big.push(p);
          continue;
        }
        buf = fs.readFileSync(p);
      } catch {
        closed++;
        continue;
      }
      read++;
      // UTF-8, and UTF-16LE at either byte alignment (app databases). Node 24.20 crashes on
      // toString('utf16le') of an odd-length view at an odd offset, so that view is cut to even length.
      const odd = buf.subarray(1, 1 + ((buf.length - 1) & ~1));
      const texts = [buf.toString('utf8'), buf.toString('utf16le'), odd.toString('utf16le')];
      if (texts.some((t) => MARKER.test(t))) hits.push(p);
    }
  };
  for (const r of roots) walk(r);
  console.log(`${read} files read; ${closed} folders / files not readable (the denied ones count here)`);
  for (const p of big) console.log(`not read (over 64 MB): ${p}`);
  // Accepted in Appendix P: the desktop app's session list (titles, recaps); the running app keeps it open.
  const appSessions = path.join(APPDATA, 'Claude', 'claude-code-sessions') + path.sep;
  for (const p of hits.filter((h) => h.startsWith(appSessions))) console.log(`accepted, write it in baseline.md: ${p}`);
  const open = hits.filter((h) => !h.startsWith(appSessions));
  if (open.length) throw new Stop(`round 4 IDs or report headers readable in:\n${open.join('\n')}`);
  console.log('OK: no readable copy of Claude / Codex round 4 work found');
}

const [cmd, flag] = process.argv.slice(2);
const commands = { baseline, clean, deny: () => deny(flag === '--dry-run'), scan, remove };
try {
  if (!commands[cmd]) throw new Stop('usage: node dot2.mjs baseline | clean | deny [--dry-run] | scan | remove');
  commands[cmd]();
} catch (e) {
  console.error(`STOP: ${e instanceof Stop ? e.message : e.stack}`);
  process.exit(1);
}
```

**Rủi ro còn lại, đã chấp nhận ở G6** (Owner 28/10, phương án (b); với app WorkBuddy trên #880): lệnh của model đọc được mọi file mà user đọc được ngoài ACL, và mọi mục của Credential Manager. Gồm trạng thái đăng nhập của app WorkBuddy trong thư mục dữ liệu của nó, key OpenCode Go của app Heritas trong Credential Manager, GCM của git, file đăng nhập Claude Code. Phiên đăng nhập WorkBuddy lộ thì người khác dùng được credit của tài khoản tới khi đăng xuất. Giảm bằng:
- đăng xuất app ngay sau gói F, trước khi chép gì vào repo;
- `gh` đăng xuất trong đợt 2;
- prompt cấm đọc `~/.workbuddy*` và Credential Manager; quét log tìm các lệnh đó;
- quét mẫu key trước khi chép bất cứ gì vào repo (§L4.10).

**Còn hở sau review #872** (Owner chấp nhận khi xác nhận G6 ngày 28/10, cùng phần đổi ở §L4.11):
- file hard link trong `node_modules` để ngỏ; đó chỉ là gói npm;
- metadata phiên của app desktop Claude (`%APPDATA%\Claude\claude-code-sessions`: tiêu đề, vài câu tóm tắt) không chặn, vì app đang chạy. `scan` in ra nếu có mã phát hiện, Owner ghi vào `baseline.md`. Muốn chặn cả chỗ này thì phải đóng app desktop Claude suốt đợt 2;
- `scan` chỉ thấy chữ không nén; log hay cơ sở dữ liệu nén của app thì không kiểm được;
- cùng user, nên lệnh của model gỡ được ACL (`icacls /remove`): prompt cấm, quét log tìm;
- nếu app chạy lệnh dưới danh tính khác tài khoản của Owner thì ACL không áp. Phiên thử ở Default chỉ bắt được qua những lần đọc thử mà sandbox không chặn trước (thông báo lỗi cho biết); chọn Full Access thì task kiểm ACL ở chế độ đó bắt được, trước gói A (review #881).

**Còn hở với app WorkBuddy** (Owner chấp nhận ở G6 ngày 28/10, #880):
- app không có luật chặn đọc / ghi theo đường dẫn, như DSH: ACL là lớp chặn đọc duy nhất; ghi ngoài `deepseek\` chỉ có prompt, `git status` cuối mỗi gói, hash 12 báo cáo và quét log;
- Full Access (nếu Owner chọn ở phiên thử): không còn sandbox hay hỏi duyệt; ACL được đọc thử lại ở chính chế độ này trước gói A;
- không tắt được Memory và công cụ web (theo tài liệu); Memory được dọn ở bước 4 và ngay trước gói A, sau mọi task thử; không ghim được bản app;
- chỗ và định dạng log của app chỉ có ở nguồn bên thứ ba: phiên thử kiểm, thiếu thì dừng;
- tài liệu không ghi model gắn sẵn chạy trên hạ tầng nào (§L4.11).

Repo public, dữ liệu giả lập.

# Lượt 5

Kế hoạch lượt 5 (T-357 #1025), soạn 04/11/2026 trên Home PC, trong G7. ADR-0001 phụ lục M10 thêm lượt 4 trước G7; Owner thêm lượt 5 ngày 04/11 (phụ lục M12, §L5.11). Mục nào không nói khác thì giữ như lượt 4 (§L4.1–§L4.11, Phụ lục L–P), và qua đó như lượt 1–3.

Owner chốt ngày 04/11, trong phiên soạn (§L5.11 mục 1–4):

- ba bên như lượt 4;
- sau tổng hợp sửa hết, rồi G7;
- SHA ghim là `main` lúc bước chuẩn bị;
- DeepSeek chỉ dùng credit của gói WorkBuddy Pro, không mua thêm.

Số đo trong phần này lấy ở `571b8b0` (`main` lúc soạn; code trùng `3d237b0`). Bước chuẩn bị đo lại ở SHA ghim. Prompt ghi `{SHA}`; bước chuẩn bị thay bằng SHA ghim (§L5.9 bước 4).

| Yêu cầu | Mục |
|---|---|
| #1025 test 1: SHA ghim là `main` lúc bước chuẩn bị, sổ OPEN rỗng; từ đó tới lúc chạy chỉ có docs | §L5.2, §L5.9 bước 1 |
| #1025 test 2: prompt ba bên đủ hai phần; KNOWN lượt 5 đủ nguồn; lệnh so số đo với mốc Home PC | §L5.4, §L5.5, §L5.6, Phụ lục Q, S, T, U |
| #1025 test 3: bảng R1 khớp tổng hợp lượt 4 (§3, §6, §8.4, §8.5); bảng R2 khớp các Issue T-329…T-356 đã đóng | §L5.5 phần 4, 5 |
| #1025 test 4: chi phí DeepSeek theo quyết định 4 (không mua thêm credit), có điểm dừng | §L5.7, §L5.9 đợt 2 bước 4–6, Phụ lục V |
| #1025 test 5: đề xuất ghi rõ Owner chọn gì, có ngày | §L5.11 |
| #1025 hợp đồng: R1 theo mã `DR6-*`, R2 theo Issue, rồi phát hiện mới với ID theo bên `CLR5-*` / `CXR5-*` / `DSR5-*`; vấn đề gộp đánh số tiếp `DR6-158…`; ghi model các bên | §L5.2, §L5.8, Phụ lục Q, S, T, U |

## L5.1 Mục tiêu, bên review

Owner chốt 04/11/2026 (§L5.11 mục 1–4):

- **Một vòng deep review toàn bộ code nữa trước khi phát hành v1.0 (G7)**, sau đợt sửa lượt 4 và các mục sổ [G7] sau đó. Sổ OPEN rỗng từ `233c77e` (03/11) và vẫn rỗng ở `571b8b0`.
- **Ba bên, như lượt 4** (Owner: "3 bên như round 4: Claude Opus, Codex GPT Sol và Deepseek v4.1 Flash qua Workbuddy"):
  - **Claude Opus 5.5:** như lượt 4, Owner mở **mỗi gói một phiên sạch** ở `C:\workspace\Project-2C-review`. Mức suy luận và ultracode Owner chọn từng phiên (M1, M8). Phiên bật ultracode được dùng subagent / Workflow cho việc của gói; chỉ phiên chính làm bước 0, ghi `{GÓI}.md` và in dòng `XONG`.
  - **Codex, model GPT Sol 6.1:** Owner chạy, mỗi gói một phiên mới, chỉ đọc, không viết code (M2).
  - **DeepSeek V4.1 Flash** trong app desktop WorkBuddy, model gắn sẵn của gói WorkBuddy Pro. Owner chạy, mỗi gói một task mới qua **Code review expert** của app, chỉ đọc, không viết code. Báo cáo là dữ liệu tham khảo như Codex (M2, M10, M12).
  - 6 gói × 3 bên = **18 báo cáo**, chạy **hai đợt** như lượt 4: đợt 1 Claude + Codex song song; đợt 2 DeepSeek một mình, khi thư mục của hai bên kia đã bị chặn ACL.
- **Hai phần ngang nhau** như lượt 2–4:
  1. **kiểm phần đã sửa** (trục R): mọi DR6 và mục KNOWN đã sửa sau lượt 4, và từng Issue sau đó (§L5.4);
  2. **tìm lỗi mới và edge case mới** trên **toàn bộ** phạm vi gói.
- **Sau tổng hợp: sửa hết, rồi G7** (như lượt 3–4).
- **Chi phí DeepSeek (G4):** chỉ credit của gói WorkBuddy Pro, không mua thêm credit. Lượt 4 có trần 25 USD, gồm tối đa một gói mua thêm 500 credit; lượt 5 bỏ phần mua thêm.

**Vì sao cần lượt 5:** từ SHA ghim lượt 4 (`2e51e25`) có ba đợt mà chưa lượt nào đọc trọn.

- **Đợt sửa lượt 4** (31/10–01/11): 10 Issue #896…#905 (T-319…T-328), gồm đợt G5 `@5` và Mock trích xuất theo danh sách cho phép.
- **Mục sổ [G7] sau đợt sửa** (01–03/11): T-329…T-342.
  - Mock trích xuất viết lại thành file riêng (`packages/ai/src/mock-extraction.ts`, 950 dòng) theo các quyết định Owner 31/10–02/11.
  - Pipeline `auto-issues` thêm `tools/auto-wait*` (T-335, T-338).
- **G7** (03–04/11):
  - chụp lại ảnh hướng dẫn (T-343);
  - sửa probe hiệu năng (T-345…T-347) và đo NT-HN-01 (T-348);
  - sửa Thùng rác ghi lịch Dự kiến đã qua (T-350);
  - nghiệm thu L2, L3 trên exe ứng viên và sửa các dòng nghiệm thu (T-349, T-351…T-356).

Diff `2e51e25..571b8b0` ngoài `docs/**` và mọi file `*.md` có 93 file, +5 761 / −1 533 dòng. Đó là khoảng 1/3 đợt mà lượt 4 đọc ở `2e51e25` (`119e2e4..2e51e25`: 271 file, +14 631 / −3 399; `docs/reviews/raw/2026-10-31/common-baseline.md`). Không có migration mới.

Các lượt trước cho thấy code mới của đợt sửa là chỗ hở nhiều nhất: 9 / 23 vấn đề mới của lượt 4 do đợt sửa sau lượt 3 (tổng hợp lượt 4 §1).

## L5.2 SHA ghim, đợt sửa, chỗ làm

**SHA ghim lượt 5 = `origin/main` lúc bước chuẩn bị** (Owner 04/11, mục 3), khi mục OPEN của `docs/state/review-notes.md` không còn mục lá nào (điều kiện của lượt 4, K40). Thứ tự:

1. PR kế hoạch này merge (G1), rồi PR sổ ghi chú review của nó.
2. T-358 (`dot2.mjs` lượt 5, Phụ lục V; tạo sau G1) merge, rồi PR sổ của nó. Ghi chú không chặn mà review hai PR này ghi thêm thì sửa trước khi ghim SHA (K40).
3. Bước chuẩn bị ghim `main` lúc đó (§L5.9 bước 1).

Từ SHA ghim tới lúc chạy chỉ có thay đổi docs. Trong suốt lượt 5 **không merge code vào `main`** (như §2). PR docs merge được, không đổi SHA ghim.

**Lúc soạn:** `571b8b0` (`571b8b0bd91afc4992809784c7f8e30f8d00b3ed`, `main` 04/11/2026 sau #1024).

- Code trùng `3d237b0` (`3d237b0d2b795599d27e6ce00421f0eeffa53c9a`, #1011, T-350); sau đó chỉ có tài liệu. Exe ứng viên `3d237b0` (artifact CI run `41765637293`) là exe của nghiệm thu L3 (`docs/testing/nghiem-thu-v1.md`, "Các lượt thử").
- Milestone Phase 6 không còn Issue mở nào ngoài #1025.
- Mọi số đo của §L5.2, §L5.3, §L5.6 lấy ở `571b8b0`. Bước chuẩn bị đo lại ở SHA ghim và chạy lại cổng (§L5.9 bước 5–7); số ở `common\baseline.md` là số dùng.

**Đợt sửa = diff `2e51e25..{SHA}`.** Lúc soạn (`2e51e25..571b8b0`), ngoài `docs/**` và mọi file `*.md`: 93 file, +5 761 / −1 533 dòng (`git diff --numstat`, tính cả test). Không migration, không file nhị phân. 25 commit có code hoặc test.

Đợt sửa lượt 4 (Owner duyệt cách sửa 31/10, tổng hợp lượt 4 §9; cột DR6 là vấn đề lượt 4 mà Issue sửa):

| Issue | Việc | DR6 | PR | Commit |
|---|---|---|---|---|
| #896 T-319 | Test D7 cùng ngày, `byName` đổi chữ số một lần mỗi tên, nhãn model từ chối UTF-16 hỏng | 135–137 | #907 | `1766cca` |
| #897 T-320 | Test hợp đồng CSP / `identifier`, `storage.rs` (thư mục mang tên backup, ổ đầy lúc backup) | 138 | #915 | `ea2aa34` |
| #898 T-321 | `flush()` chờ lần thay bắt đầu muộn, listener của `AppData`, focus và câu hộp đóng app | 139, 140, 146 (b), 147 | #911 | `59fdfca` |
| #899 T-322 | Mock trích xuất chỉ đề xuất từ câu kể đơn về KH, lỗi AI giữ lại theo dữ liệu | 141, 144 | #917 | `5d13f5a` |
| #900 T-323 | Đợt G5 lượt 4: NUL, "giới" trước "luật"; `analysis@5`, `discovery@5` | 142, 143 | #909 (G5 §14), #913 | `1e500e1`, `1eab296` |
| #901 T-324 | Dấu nối còn lại của DR6-37 và bộ chặn ký hiệu, ô chọn theo mockup | 37, 145, 149 | #920 | `656052f` |
| #902 T-325 | Tên liền dài không tràn ở hộp thoại, màn Team, So sánh team, Báo cáo | 146 (a), 148 | #922 | `06c5a1b` |
| #903 T-326 | Ô Case size trống, tên nút khôi phục, focus lúc hộp xác nhận chạy, test hở gói E | 150–154 | #924 | `4d7e689` |
| #904 T-327 | Công cụ: `pr-core`, bộ kiểm ảnh hướng dẫn, glob của `notes-core`, `size-report` | 155–157 | #926 | `54884d4` |
| #905 T-328 | Nghiệm thu NT-EX-08 / 09 cho dữ liệu exe trước v1.0 (KNOWN CLR4-F2), lệch của ô chọn | — | #928 | `532a93a` |

Mục sổ [G7] sau đợt sửa (gom ghi chú review của các PR trên; gắn nhãn ở #936, #953, #962, #970, #974):

| Issue | Việc | PR | Commit |
|---|---|---|---|
| #930 T-329 | `packages/ai`: gỡ chép ở bộ chặn và test, tách Mock trích xuất ra file riêng (không đổi hành vi) | #937 | `b6d4388` |
| #931 T-330 | Mock trích xuất theo quyết định Owner 31/10–01/11: giá trị cuối về KH, Ly hôn / Góa / Ly thân, con đã mất, "bé" | #939 | `36a63e7` |
| #932 T-331 | Tên dài: `DataTable` trong khung cuộn, hàng tiêu đề thẻ team, So sánh team | #941 | `023cf3b` |
| #933 T-332 | Ô Giờ chỉ có ký tự vô hình, focus sau hộp nhập backup, khóa i18n chung, `listeners.ts` dùng chung | #946 | `66019cc` |
| #934 T-333 | Bộ chặn ký hiệu (kiểu generic, CRLF), `globMeetsFolder` | #965 | `7b6dbd1` |
| #935 T-334 | Tài liệu: tổng hợp lượt 4, `phase-6.md`, quyết định #917 / #920, mục Ô chọn | #948 | `52a9979` |
| #942 T-335 | Pipeline `auto-issues` (ADR-0001 M11): skill, `tools/auto-wait*`, `pr-status`, `review-hint-core` | #944 | `a96d94d` |
| #950 T-336 | Mock trích xuất: khúc không chữ, dấu đầu dòng; luật `dependency-cruiser` cho test-support | #956 | `a7877e5` |
| #951 T-337 | Ô Giờ có ký tự vô hình, dáng nút `aria-disabled` của `Button`, e2e tên TL dài | #958 | `2cc4464` |
| #952 T-338 | Pipeline `auto-issues`: chờ CI sau reopen, giữ nhánh local, gợi ý review bỏ khối app | #954 | `3665328` |
| #960 T-339 | Test Mock trích xuất (thời gian bền với runner chậm, ca qua dòng), ranh giới test-support | #963 | `ee01e41` |
| #961 T-340 | Skill `auto-issues`: làm mới "Ghi chú OPEN liên quan", câu trỏ dòng (chỉ tài liệu) | #967 | `6be4dee` |
| #969 T-341 | Bộ chặn ký hiệu: thẻ đóng / tự đóng dính chữ JSX | #971 | `55086de` |
| #973 T-342 | Bảng PR vượt ngưỡng tới #974; ca thẻ mở dính chữ JSX | #975 | `ace10ee` |

G7 (03–04/11):

| Issue | Việc | PR | Commit |
|---|---|---|---|
| #977 T-343 | Chụp lại ảnh hướng dẫn sau đợt sửa lượt 4 | #978 | `fffe3e5` |
| #980 T-344 | Bảng đối chiếu của hướng dẫn, hàng Chuyển nhóm | #981 | `57d6330` |
| #983 T-345 | Probe hiệu năng: kỳ Tháng lùi về tháng có đủ ngày Đã gặp | #984 | `0212bb6` |
| #986 T-346 | Probe hiệu năng: kỳ Năm lùi về năm có đủ lịch Đã gặp, kiểm sớm trước vòng nhập backup | #988 | `6d9ae0e` |
| #990 T-347 | Probe hiệu năng: một locator cho dòng Đã gặp, kiểm tháng chứa hôm nay | #992 | `1ce3c61` |
| #994 T-348 | Số đo NT-HN-01 trên Home PC | #995 | `ffdea65` |
| #997 T-349 | Ghi chú NT-HN-01 không chép số, Cách đo nêu bước mở lại | #999 | `570b110` |
| #1001 T-350 | Thùng rác ghi lịch Dự kiến đã qua là Chưa ghi kết quả (NT-TR-07) | #1011 | `3d237b0` |
| #1002 T-351 | Nghiệm thu L2 trên exe ứng viên `1ce3c61` | #1003 | `ccea84f` |
| #1004 T-352 | Nghiệm thu sau L2: mục Dữ liệu, phạm vi dòng L2, NT-AI-03, bảng cổng KYC của hướng dẫn | #1007 | `46ffe62` |
| #1005 T-353 | NT-LH-19, NT-LH-28 lệch app: Owner chọn sửa dòng | #1009 | `daa8651` |
| #1012 T-354 | Nghiệm thu: NT-TR-12 vào danh sách cần lịch Chưa ghi kết quả, dấu câu NT-AI-03 | #1014 | `b1cacf7` |
| #1017 T-355 | Nghiệm thu L3 trên exe ứng viên `3d237b0` | #1020 | `abd10b9` |
| #1019 T-356 | Hướng dẫn: mở app vào màn dùng lần cuối (NT-HD-01) | #1023 | `382967d` |

Mỗi PR code có PR sổ ghi chú review ngay sau. Ghi chú không chặn của chúng nằm ở KNOWN phần 1 nếu còn ACCEPTED, ở `fixes.md` nếu đã RESOLVED (§L5.5, §L5.9 bước 4).

| Bên | Ai chạy | Đợt | Làm ở | Thư mục kết quả | ID |
|---|---|---|---|---|---|
| Claude Opus 5.5 (mỗi gói một phiên sạch, tuần tự A → F) | Owner mở phiên | 1 | `C:\workspace\Project-2C-review` | `C:\workspace\deep-review-1-6-r5\claude\` | `CLR5-<gói><số>` |
| Codex, model GPT Sol 6.1 | Owner, mỗi gói một phiên mới | 1 (cùng lúc Claude) | `C:\workspace\Project-2C-review-2` | `…-r5\codex\` | `CXR5-<gói><số>` |
| DeepSeek V4.1 Flash (app desktop WorkBuddy, model gắn sẵn của gói WorkBuddy Pro, qua Code review expert) | Owner, mỗi gói một task mới trong app | 2 (một mình) | `C:\workspace\Project-2C-review` (Claude đã xong), là workspace của task | `…-r5\deepseek\` | `DSR5-<gói><số>` |
| **Claude phiên tổng hợp** (Issue tạo sau khi lượt 5 chạy xong) | Owner yêu cầu, sau khi đủ 18 báo cáo | — | checkout chính | `docs/reviews/` qua PR docs | dùng nguyên ID trên |

- **ID theo bên:** "R5" = lượt 5 (`rg "CLR5-|CXR5-|DSR5-"` trên `docs/` ngày 04/11: 0 chỗ). Vấn đề đã gộp đánh số tiếp `DR6-158…`.
- **Hai đợt, ACL:** lý do như §L4.2. ACL của đợt 2 chặn thêm cả thư mục lượt 4 `deep-review-1-6-r4` (Phụ lục V).
- **Máy: Home PC `DESKTOP-KDURKJP`** như lượt 3–4. Mốc hiệu năng sau #656, số lượt 4 và số G7 cùng máy chỉ có ở máy này; app WorkBuddy đã cài ở đây.
- Thư mục lượt 1–4 (`C:\workspace\deep-review-1-6\`, `-r2\`, `-r3\`, `-r4\`) giữ trên Home PC tới v1.0 (HANDOFF). Probe lượt 4 của Claude và Codex trong `deep-review-1-6-r4\<bên>\` là probe cùng máy, dùng lại được.
  - DeepSeek ở đợt 2 không đọc thư mục lượt 1–4 nào, kể cả probe lượt 4 của chính nó: ACL chặn cả thư mục.
  - Báo cáo lượt 4 của mọi bên đã ở repo (`docs/reviews/raw/2026-10-31/`), mọi bên đọc được.

## L5.3 Sáu gói, cỡ đo lại, diff sửa theo gói

Phạm vi từng gói giữ đúng §3 và luật `PACKAGES` của `tools/size-report-core.mjs` (năm file xếp tay ở §L4.3 đã vào luật ở T-310). Ở `571b8b0` không file nào rơi vào dòng "Chưa xếp gói":

- `packages/ai/src/mock-extraction.ts` (+ test) vào C;
- `tools/auto-wait*` vào F;
- e2e mới `e2e/long-names.spec.ts` vào F.

**Cỡ đo lúc soạn** (`node tools/size-report.mjs` ở `571b8b0`, 04/11, Home PC; số dòng không phụ thuộc máy). Δ so với lượt 4 (`2e51e25`, `docs/reviews/raw/2026-10-31/common-baseline.md`). Bước chuẩn bị đo lại ở SHA ghim (§L5.9 bước 6).

**Diff sửa** = dòng thêm / xóa của `git diff --numstat -M 2e51e25 571b8b0`, xếp gói bằng `classifyFile`. Không tính file sinh tự động; file Rust tính cả phần test trong file là SP, như §L3.3.

| Gói | SP (Δ) | Test (Δ) | Sinh (Δ) | File (Δ) | Diff sửa SP | Diff sửa test | R1 (mã DR6, mục KNOWN đã sửa) | R2 (Issue) |
|---|---:|---:|---:|---:|---|---|---|---|
| A. Lõi dữ liệu | 8 748 (+29) | 15 805 (+91) | 341 (0) | 104 (0) | +53 / −24 · 5 file | +110 / −19 · 6 file | 135–137, 151 | T-332, 350 |
| B. File và Rust | 2 457 (+31) | 5 600 (+178) | 0 (0) | 21 (+2) | +113 / −15 · 4 file | +119 / −8 · 4 file | 138–140, 147 | T-332 |
| C. AI | 6 580 (+553) | 8 202 (+663) | 0 (0) | 65 (+2) | +1 051 / −498 · 11 file | +1 396 / −733 · 10 file | 137, 141–144 | T-329, 330, 332, 336, 339 |
| D. Màn nhập liệu | 8 134 (+135) | 3 094 (+274) | 0 (0) | 89 (+2) | +208 / −73 · 12 file | +276 / −2 · 4 file | 37, 145–149 | T-331, 332, 333, 337, 341, 342, 344, 352, 356 |
| E. Lịch hẹn, chỉ số, quản lý | 8 272 (+117) | 4 700 (+144) | 0 (0) | 52 (0) | +178 / −61 · 13 file | +200 / −56 · 3 file | 37, 148, 150–154 | T-331, 332, 337, 350, 353 |
| F. Xuyên gói, bloat / hiệu năng, công cụ | 4 886 (+446) | 18 427 (+1 567) | 4 628 (0) | 100 (+4) | +460 / −14 · 7 file | +1 597 / −30 · 14 file | 136 (đo), 155–157, CLR4-F2; **R1 gộp đủ 25 dòng** | T-333, 334, 335, 336, 338, 339, 340, 342, 343, 345–349, 351, 352, 354, 355; **R2 gộp đủ mọi dòng** |
| **Tổng** | 39 077 (+1 311) | 55 828 (+2 917) | 4 969 (0) | 431 (+10) | | | | |

- Phần lớn diff SP nằm ở C (Mock trích xuất tách file rồi viết lại) và F (`tools/auto-wait*`, 388 dòng SP).
- Một mục có thể thuộc nhiều gói, vd. DR6-147 (dải lưu ở D, hàng đợi ở B) hay T-332 (ô Giờ ở E, `readsBackAsIs` của `packages/db/src/{common,backup}.ts` ở A, `listeners.ts` ở B, khóa i18n ở D, `ai-jobs.ts` ở C). Mỗi gói kiểm phần của mình; gói F gộp.
- Bước chuẩn bị (§L5.9 bước 6) đo lại ở SHA ghim bằng cùng lệnh, kèm bundle và exe; số ở `baseline.md` là số dùng.

## L5.4 Hai phần của mỗi gói

Như §L4.4 (và §L3.4, §L2.4), với các thay đổi dưới.

### Phần 1 — kiểm phần đã sửa (trục R), hai bảng

**Bảng R1 — theo mã** (§L5.5 phần 4), 25 dòng:

- DR6-135…157: 23 vấn đề lượt 4, đều có Issue sửa (tổng hợp lượt 4 §8.5).
- DR6-37: SỬA MỘT PHẦN ở lượt 4; phần còn (DR6-145 (a)) sửa ở #901.
- KNOWN CLR4-F2 (tổng hợp lượt 4 §8.4): Owner chọn Q4 (a), sửa bằng tài liệu ở #905. Dòng R1 kiểm dòng ghi có và khớp hành vi; hành vi dưới nó vẫn là KNOWN K1.

Bốn bước của §L2.4 giữ nguyên:

1. Chạy lại tái hiện của lượt 4 (DR6-37: của lượt 1 và lượt 4). Nguồn: báo cáo gốc `docs/reviews/raw/2026-10-31/` (và `…/2026-10-15/`), tổng hợp lượt 4 §6, §8.4, §11. Claude, Codex dùng thêm probe lượt 4 của chính bên mình ở `C:\workspace\deep-review-1-6-r4\<bên>\`.
2. Gỡ tạm phần sửa, xem test của PR sửa có đỏ.
3. Thử biến thể gần.
4. Mục sửa bằng tài liệu (CLR4-F2): dòng ghi có, và khớp app.

**Dòng R1 kiểm theo mô tả của DR6** ở tổng hợp và báo cáo gốc, không chỉ theo danh sách việc trong Issue sửa. Lượt 4, Codex và DeepSeek chấm DR6-37 ĐÃ SỬA theo danh sách của Issue #790, trong khi vị trí đầu tiên mà báo cáo lượt 1 nêu chưa sửa (tổng hợp lượt 4 §3.1).

**Bảng R2 — theo Issue** (§L5.5 phần 5), 28 dòng lúc soạn: T-329…T-356 (16 Issue có code hoặc test, 12 Issue chỉ tài liệu / ảnh / nghiệm thu). Mỗi dòng làm bốn bước như §L4.4:

1. Mục tiêu và test chấp nhận của Issue (`common\fixes.md`) đúng trên code ở SHA ghim; ca nào chạy được thì chạy.
2. Gỡ tạm ít nhất một phần sửa chính, xem test của PR có đỏ.
3. Thử biến thể gần của các ghi chú sổ mà Issue gom (mục RESOLVED chép ở `fixes.md`).
4. Issue chỉ tài liệu / ảnh / nghiệm thu: dòng ghi có, khớp app, số đo hay ảnh.

- Issue sau đợt sửa chạm cùng một DR6 (vd. T-330, T-336 với DR6-141; T-333, T-341 với DR6-145) có dòng R2 riêng cho mục tiêu của chính nó. Dòng R1 của DR6 đó xét cả phần mà các Issue này đổi.
- Các Issue của pipeline (T-335, T-338, T-340): kiểm code `tools/auto-wait*`, `review-hint-core`, `pr-status` như mọi công cụ. Cách làm của pipeline là K45, không phải phát hiện.
- Một ghi chú sổ đã RESOLVED mà hỏng lại → phát hiện mới, "Liên quan: T-xxx (ghi chú review #…)".

Kết luận mỗi dòng theo thước §L2.4: **ĐÃ SỬA** · **SỬA MỘT PHẦN** · **CHƯA SỬA** · **HỒI QUY**. Ba kết luận sau kèm một phát hiện có trường "Liên quan".

**Refactor / hiệu năng không đổi hành vi:**

- T-329 (#937) tách Mock trích xuất ra `mock-extraction.ts` và gộp helper `LAW_NAME` / cụm mở đầu KH: test cũ xanh, hành vi không đổi; ở T-330, T-336 hành vi đổi có chủ ý theo K42.
- T-332 (#946) dùng `listeners.ts` chung cho `persist-queue` và `AppData`: một listener ném không làm hỏng việc của listener khác hay của lệnh (DR6-140).
- T-332 (#946) gộp luật "đọc lại đúng như lưu" vào `readsBackAsIs` (`packages/db/src/common.ts`), dùng chung cho `isLabel` và `valueOf` của luật nhập backup (`backup.ts`): hai chỗ nhận / từ chối đúng như trước (DR6-137).
- `byName` (DR6-136): sắp bảng Lịch hẹn 10 255 dòng theo KH về gần số trước #828 (Node 9,4 ms), cùng thứ tự với bản `2e51e25`.
- Dữ liệu tải: G7 sinh ở `233c77e` có `tables` khác lượt 4 (`ad82051b…`), cùng số dòng; `phase-6.md` ghi lý do là prompt lên `@5` (#913). Gói F so hai bản theo bảng / cột như §L4.4: mọi chỗ khác phải giải thích được bằng một luật đổi có chủ ý.

### Phần 2 — lỗi mới và edge case mới

Như §L2.4 phần 2: ít nhất 5 kịch bản mới mỗi gói, gói F ít nhất 5 chuỗi nhiều bước qua nhiều gói. Kịch bản phải chưa có trong báo cáo **lượt 1–4**: đọc `docs/reviews/raw/2026-10-15/`, `…/2026-10-17/`, `…/2026-10-21/`, `…/2026-10-31/` và bốn bản tổng hợp. Xét trước:

- **Code mới sau lượt 4** (diff `2e51e25..{SHA}`), và hành vi mới:
  - **Mock trích xuất viết lại** (`mock-extraction.ts`; T-322, T-329, T-330, T-336, T-339; K42): danh sách cho phép, giá trị cuối về KH, Ly hôn / Góa / Ly thân, con đã mất, "bé", khúc không chữ, dấu đầu dòng. Thử trên câu thật (seed, dữ liệu tải, eval) và trên ghi chú dài 36 000 ký tự;
  - **G5 `@5`** (T-323; `phase-5-prompts.md` §14, K43): NUL ở bước 0, "giới" sau "môi / ranh / biên / thế"; chặn đủ, không chặn nhầm;
  - **lưu và đóng app** (T-321, T-332): `flush()` lặp tới khi hết việc, `listeners.ts`, focus của dải lưu, câu hộp đóng app;
  - **ô chữ có ký tự vô hình** (T-326, T-332, T-337): ô Giờ, Case size, ba `pending` của ô ngày;
  - **bộ chặn ký hiệu** (`token-guard.ts`; T-324, T-333, T-341, T-342): máy trạng thái chuỗi / template / comment / JSX / kiểu generic, cả bỏ sót lẫn báo nhầm;
  - **tên liền dài và `DataTable`** (T-325, T-331, T-337), **ô chọn** (T-324, K44), **nút `aria-disabled`** (T-337), **focus hộp xác nhận lúc chạy** (T-326);
  - **Thùng rác ghi lịch Dự kiến đã qua** (T-350: `appointment-counts.ts`, `trash-view.ts`): nhãn khớp nghĩa thường ở mọi chỗ khác dùng cùng hàm;
  - **`storage.rs`** (T-320): seam ổ đầy, thư mục mang tên backup;
  - **công cụ** (F): `tools/auto-wait*` (T-335, T-338), `review-hint-core`, `pr-status`, glob của `notes-core` (T-327, T-333), `size-report` (T-327), probe hiệu năng (T-345…T-347).
- Trọng tâm từng gói ở bảng của Phụ lục T.

## L5.5 KNOWN lượt 5

`common\known.md` (bước chuẩn bị §L5.9 bước 4) **dựng mới** ở SHA ghim, không chép `known.md` lượt 4 (`docs/reviews/raw/2026-10-31/common-known.md`). Gồm **năm phần**.

**1. Mục OPEN và ACCEPTED** của `docs/state/review-notes.md` ở SHA ghim.

- **OPEN rỗng** (bước chuẩn bị kiểm, §L5.9 bước 1).
- **ACCEPTED nguyên văn.** So với lượt 4 có thêm các mục chấp nhận từ 31/10: đợt sửa lượt 4, mục sổ [G7] sau đó, nghiệm thu G7.
- Ghi chú sổ thêm sau SHA ghim (nếu có, chỉ PR docs) ghi ở đầu `known.md`, như lượt 3–4.

**2. Quyết định Owner còn hiệu lực:** K1–K40 chép từ bảng của `docs/reviews/raw/2026-10-31/common-known.md` (đã có chữ sửa của K12, K13, K14, K17, K21 ở §L4.5), **trừ K17**, ghi theo chữ dưới:

- **K17 (sửa theo M11, M12):** Không phải phát hiện:
  - PR vượt ngưỡng kích thước (ghi ở `docs/metrics/`);
  - cách làm "chỉ Claude viết code" (ADR-0001), kể cả subagent / Workflow ở phiên gói Owner bật ultracode (M8–M10, M12), pipeline `auto-issues` (M11, K45), và việc Codex, DeepSeek review chỉ đọc (M2, M10, M12);
  - mức `code-review` của `review-pr` (ADR-0017, phụ lục 21/10);
  - việc dùng công cụ mới (G4).

Cộng thêm:

| # | Quyết định | Nguồn |
|---|---|---|
| K41 | Quyết định lượt 4 (31/10, mọi đề xuất). Q1 (a): Mock trích xuất chỉ đề xuất từ câu kể đơn về chính KH (danh sách cho phép), mọi dạng khác không đề xuất. Q2 (a): đợt G5 lượt 4 (K43). Q3 (a): tên nút khôi phục nhân sự luôn có vai trò và team; của KH chỉ có mã KH khi tên và nhóm trùng một dòng KH khác trong Thùng rác, như hộp 9b. Q4 (a): CLR4-F2 giữ K1, không sửa code; NT-EX-08 / 09 có một dòng về dữ liệu trước v1.0 | tổng hợp lượt 4 §9; `PROJECT-STATE.md` 31/10; #896…#905 |
| K42 | Mock trích xuất (Owner 31/10–02/11, khi code và review #917, #939, #956; spec Phase 5 §10). Mỗi trường lấy giá trị cuối nói về KH trong ghi chú và chỉ đề xuất khi đó là câu kể đơn. Câu không chủ ngữ ngay sau câu kể đơn về KH là về KH; khúc không có chữ cái là trong suốt; khúc mở bằng dấu đầu dòng được mang KH sang. Tình trạng hôn nhân có Ly hôn, Góa, Ly thân; "<k> con / bé đã mất / qua đời" trừ k khỏi số con; "bé" tính như "con", trừ nghĩa nhỏ. Owner chấp nhận các giới hạn: `RETRACTED` đọc cả ghi chú với đủ danh sách chữ (bỏ cả câu đúng như "KH đã kết hôn. KH đến không đúng giờ."); câu sau chỉ đoán / hỏi lại / phủ định ngoài danh sách đóng giữ đề xuất trước; luật ":" bỏ cả danh sách sau ":"; "vợ / chồng" đứng trước con đã mất ở câu sau thì số con trước vẫn đề xuất. Cỡ PR #917, #939 vượt ngưỡng: Owner chấp nhận | `PROJECT-STATE.md` 31/10–02/11; #899, #931, #950 |
| K43 | Đợt G5 lượt 4 (Owner duyệt 31/10, "duyệt hết"; `phase-5-prompts.md` §14): `analysis@5`, `discovery@5`, giữ `extraction@1`, `web@1`. Bước 0 của so khớp bỏ NUL như ký tự vô hình (chỉ ở bản so khớp, không đổi chữ lưu). "giới" trước "luật" chỉ được miễn khi không đứng sau "môi", "ranh", "biên", "thế". Phần "Mất" (§14.5): NUL đặt làm dấu cách ngay cạnh một cụm bị chặn (Owner 31/10 chấp nhận như §11.8) | #900 → #909, #913 |
| K44 | Ô chọn (G8 01/11, #901). Viền ≥ 3:1 chỉ đo ở ô đang chọn: viền `--accent` 6,9:1, ô đang chọn còn chữ đậm và đổi màu chữ. Ô chưa chọn giữ `--border-strong` như `.choice` của `forms.css`. Các lệch còn lại của ô chọn so với mockup ghi ở "Lệch mockup đã biết" (T-328, T-334) | `PROJECT-STATE.md` 01/11; PR #920, #928, #948 |
| K45 | Pipeline `auto-issues` (ADR-0001 M11, Owner 01–02/11). `/goal` chạy hàng đợi Issue qua bốn phiên con; merge PR mọi mức (`merge-pr --owner`), lặp review tới PASS không trần; `tools/auto-wait.mjs` chờ GitHub ở nền (ngoại lệ có chủ ý của "không poll CI"). Rào "không tự sửa": skill, `tools/auto-wait*`, cổng merge, cổng review, `CLAUDE.md` gốc, `.claude/settings.json`, `.claude/rules/*.md`. Cách làm này không phải phát hiện (K17). Lỗi trong code của `tools/auto-wait*`, `review-hint-core`, `pr-status` vẫn là phát hiện; việc sửa chạy ngoài pipeline | M11; `PROJECT-STATE.md` 01–02/11; #942, #952 |
| K46 | Nghiệm thu G7 (03–04/11). Kết quả các lượt L1–L3 và lệch ghi ở `nghiem-thu-v1.md` ("Các lượt thử", "Lệch mockup đã biết"). NT-LH-19, NT-LH-28: Owner chọn (a) ngày 04/11, giữ app và mockup 6e, sửa dòng (T-353). App mở lại màn dùng lần cuối, không luôn mở Tổng quan (T-356, NT-HD-01). Thùng rác ghi lịch Dự kiến đã qua là "Chưa ghi kết quả" (T-350, NT-TR-07). Đợt sửa lượt 5 đổi màn hay hành vi nào thì nghiệm thu lại dòng đó (§L5.10) | `nghiem-thu-v1.md`; #1001, #1005, #1019 |
| K47 | Lượt 5 (Owner 04/11, `plan.md` §L5.11 mục 2–4). Sau tổng hợp **sửa hết mọi phát hiện, rồi G7**, như lượt 3–4. Vì vậy kết luận v1.0 ở SHA ghim là CHƯA SẴN SÀNG khi còn phát hiện mới hay dòng R chưa ĐÃ SỬA, dù không có Medium. SHA ghim là `main` lúc bước chuẩn bị; trong lượt 5 không merge code. DeepSeek chỉ dùng credit của gói WorkBuddy Pro | `plan.md` §L5.11; #1025 |

**3. Mục "Lệch mockup đã biết" của `docs/testing/nghiem-thu-v1.md`**, nguyên văn ở SHA ghim, gồm mọi khối con: 12 điểm "Owner chọn không sửa" (15/10), 2 điểm "Owner chọn ghi là lệch chấp nhận" (23/10), các lệch của ô chọn (T-328) và các lệch ghi sau nghiệm thu L2, L3.

**4. Bảng R1** (dưới): 23 DR6 lượt 4, DR6-37 và KNOWN CLR4-F2 vào bảng R1 của gói kiểm (§L5.4), không báo lại thành phát hiện. Ngoài bảng:

- **Các DR6 khác** (DR6-01…134, đã sửa ở lượt 1–4, trừ các mục KNOWN dưới): không báo lại. Phần sửa hỏng lại → phát hiện mới, "Liên quan: DR6-xx".
- **KNOWN, chỉ nêu khi có bằng chứng mới** (hậu quả nặng hơn, đường vào mới):
  - DR6-53 (chấp nhận);
  - J5 của DR6-60 (K29);
  - CL3-C7 (K1, R2-02);
  - Claude F K2 của lượt 3 và CLR4-F2: dữ liệu do exe trước v1.0 ghi mà luật mới từ chối (K1, Q4 (a)).

Mức: L = Low, N = Nit (mức chốt ở tổng hợp lượt 4 §6, §8.4 và tổng hợp lượt 1). "Gói kiểm": gói ghi dòng R1; gói đầu là gói chính. Mô tả đầy đủ ở tổng hợp lượt 4 §6, §8.4 (DR6-135…157, CLR4-F2), tổng hợp lượt 1 và tổng hợp lượt 4 §3.1 (DR6-37). Cột "Issue → PR" kể cả PR sau chạm cùng vấn đề (trong ngoặc).

| Mã | Mức | Vấn đề (ngắn) | Issue → PR | Gói kiểm |
|---|---|---|---|---|
| DR6-135 | L | Test hở: bộ lọc ngày `date >= ?` của `unmovedMeetingsFrom` giữ luật D7 cho cuộc gặp cùng ngày | #896 → #907 | A |
| DR6-136 | L | `byName` đổi chữ số cho cả hai tên ở mỗi lần so; sắp bảng Lịch hẹn 10 255 dòng chậm quá luật nhiễu | #896 → #907 | A, F (đo) |
| DR6-137 | L | `isLabel` nhận nhãn model có UTF-16 hỏng / U+FEFF đầu chuỗi, bản xuất bị luật nhập 12 từ chối | #896 → #907 (+ #933 → #946) | A, C |
| DR6-138 | L | Test hở gói B: ca CSP / `identifier`, bộ lọc "chỉ file" của `backup_names`, ổ đầy → `DISK_FULL` của `backup` | #897 → #915 | B |
| DR6-139 | L | `flush()` không chờ lần thay bắt đầu trong lúc nó đang chờ lần ghi (S2-6) | #898 → #911 | B |
| DR6-140 | N | `changed()` của `AppData` không bọc từng listener | #898 → #911 (+ #933 → #946) | B |
| DR6-141 | L | Mock trích xuất đề xuất sai ở các dạng câu ngoài DR6-121 / T-289 | #899 → #917 (+ #930 → #937, #931 → #939, #950 → #956, #960 → #963) | C |
| DR6-142 | L | NUL trong chữ của model làm V3–V6 lọt (G5) | #900 → #909, #913 (+ #930 → #937) | C |
| DR6-143 | N | V6 "luật <Tên>" lọt sau "môi giới", "ranh giới", "biên giới" (G5) | #900 → #909, #913 (+ #930 → #937) | C |
| DR6-144 | N | Lỗi AI mà `AiJobs` giữ lại sống qua Nhập backup / Nạp lại | #899 → #917 (+ #933 → #946) | C |
| DR6-145 | L | Phần còn của DR6-37 ("{trường}: {giá trị}") và các lỗ của bộ chặn ký hiệu | #901 → #920 (+ #934 → #965, #969 → #971, #973 → #975) | D |
| DR6-146 | L | Test hở gói D: (a) đường 5c của DR6-109, (b) nhánh focus của Thử lại | #902 → #922 (a), #898 → #911 (b) | D |
| DR6-147 | L | Lần lưu khác thành công khi dải lưu lỗi / hộp đóng app đang hiện: focus rơi, câu hộp đổi | #898 → #911 | D, B |
| DR6-148 | L | Tên liền dài tràn khung ở hộp thoại, màn Team, So sánh team, cột tên của Báo cáo | #902 → #922 (+ #932 → #941, #951 → #958) | D, E |
| DR6-149 | L | Ô chọn khác `.choice` của mockup (K44) | #901 → #920 (+ #905 → #928, #935 → #948) | D |
| DR6-150 | L | Ô Case size chỉ có ký tự vô hình bị báo "Chưa nhập số tiền"; `pending` của ô ngày dùng `trim()` | #903 → #924 (+ #933 → #946, #951 → #958) | E |
| DR6-151 | N | Tên nút khôi phục trùng ở Thùng rác cho trình đọc màn hình (Q3) | #903 → #924 (+ #933 → #946) | E, A |
| DR6-152 | N | `PURGE_REMINDER` còn export mà không ai import | #903 → #924 | E |
| DR6-153 | L | Test hở gói E: câu từ chối có vế "Thử lại" của Nhập backup, huy hiệu nhóm ở ô "Bản ghi" | #903 → #924 | E |
| DR6-154 | L | Hộp xác nhận lúc chạy tắt mọi phần tử, focus rơi về `body` | #903 → #924 (+ #933 → #946, #951 → #958) | E |
| DR6-155 | N | Test hở của công cụ: câu "Read n of the m files" với file đổi tên; bộ kiểm ảnh hướng dẫn | #904 → #926 | F |
| DR6-156 | L | `notes-core` bỏ sót ghi chú thư mục khi đích là glob cấp package | #904 → #926 (+ #934 → #965) | F |
| DR6-157 | L | `size-report` đếm vào "Tệp khác" file `.sqlite` mà e2e ghi vào `dist` | #904 → #926 | F |
| DR6-37 | N | Dấu nối / ký hiệu viết cứng trong JSX (lượt 1; SỬA MỘT PHẦN ở lượt 4) | #790 → #845, #901 → #920 | D, E |
| CLR4-F2 | KNOWN | Dữ liệu exe trước v1.0 có chữ tùy chọn của lịch hẹn chỉ gồm ký tự vô hình: v1.0 không nhập lại được bản xuất của chính nó (K1; Q4 (a): một dòng ở NT-EX-08 / 09) | #905 → #928 (tài liệu) | F |

Đếm: 23 DR6 lượt 4 (17 L · 6 N), DR6-37 (N) và 1 mục KNOWN sửa bằng tài liệu = 25 dòng.

**5. Bảng R2** (dưới): mỗi Issue một dòng. Mục tiêu, test chấp nhận và ghi chú sổ đã gom (mục RESOLVED) ở `common\fixes.md`.

| Issue | Việc (theo tên Issue) | PR | Gói kiểm |
|---|---|---|---|
| #930 T-329 | `packages/ai`: gỡ chép ở bộ chặn và test, tách Mock trích xuất ra file riêng | #937 | C |
| #931 T-330 | Mock trích xuất theo quyết định Owner 31/10–01/11 | #939 | C |
| #932 T-331 | Tên dài: `DataTable` trong khung cuộn, hàng tiêu đề thẻ team, So sánh team | #941 | D, E |
| #933 T-332 | Ô Giờ chỉ có ký tự vô hình, focus sau hộp nhập backup, khóa i18n chung, `listeners.ts` | #946 | E, A, B, D, C |
| #934 T-333 | Bộ chặn ký hiệu (kiểu generic, CRLF), `globMeetsFolder` | #965 | D, F |
| #935 T-334 | Tài liệu: tổng hợp lượt 4, `phase-6.md`, quyết định #917 / #920, mục Ô chọn | #948 | F |
| #942 T-335 | Pipeline `auto-issues`: `tools/auto-wait*`, `pr-status`, `review-hint-core` | #944 | F |
| #950 T-336 | Mock trích xuất: khúc không chữ, dấu đầu dòng; ranh giới test-support | #956 | C, F |
| #951 T-337 | Ô Giờ có ký tự vô hình, dáng nút `aria-disabled` của `Button`, e2e tên TL dài | #958 | E, D |
| #952 T-338 | Pipeline `auto-issues`: chờ CI sau reopen, giữ nhánh local, gợi ý review | #954 | F |
| #960 T-339 | Test Mock trích xuất, ranh giới test-support | #963 | C, F |
| #961 T-340 | Skill `auto-issues`: "Ghi chú OPEN liên quan", câu trỏ dòng (tài liệu) | #967 | F |
| #969 T-341 | Bộ chặn ký hiệu: thẻ đóng / tự đóng dính chữ JSX | #971 | D |
| #973 T-342 | Bảng PR vượt ngưỡng tới #974; ca thẻ mở dính chữ JSX | #975 | D, F |
| #977 T-343 | Chụp lại ảnh hướng dẫn sau đợt sửa lượt 4 | #978 | F |
| #980 T-344 | Bảng đối chiếu của hướng dẫn, hàng Chuyển nhóm | #981 | D |
| #983 T-345 | Probe hiệu năng: kỳ Tháng | #984 | F |
| #986 T-346 | Probe hiệu năng: kỳ Năm, kiểm sớm | #988 | F |
| #990 T-347 | Probe hiệu năng: locator dòng Đã gặp, tháng chứa hôm nay | #992 | F |
| #994 T-348 | Số đo NT-HN-01 trên Home PC | #995 | F |
| #997 T-349 | Ghi chú NT-HN-01, Cách đo | #999 | F |
| #1001 T-350 | Thùng rác ghi lịch Dự kiến đã qua là Chưa ghi kết quả | #1011 | E, A |
| #1002 T-351 | Nghiệm thu L2 trên exe ứng viên `1ce3c61` | #1003 | F |
| #1004 T-352 | Nghiệm thu sau L2, bảng cổng KYC của hướng dẫn | #1007 | F, D |
| #1005 T-353 | NT-LH-19, NT-LH-28 (Owner chọn sửa dòng) | #1009 | E |
| #1012 T-354 | Nghiệm thu: NT-TR-12, dấu câu NT-AI-03 | #1014 | F |
| #1017 T-355 | Nghiệm thu L3 trên exe ứng viên `3d237b0` | #1020 | F |
| #1019 T-356 | Hướng dẫn: mở app vào màn dùng lần cuối | #1023 | D |

Đếm lúc soạn: 28 Issue. 16 có code hoặc test: T-329…T-333, T-335…T-339, T-341, T-342, T-345…T-347, T-350. 12 chỉ tài liệu / ảnh / nghiệm thu: T-334, T-340, T-343, T-344, T-348, T-349, T-351…T-356. Không có dòng R2: T-319…T-328 (ở R1 theo DR6 và CLR4-F2). Issue code mới trước SHA ghim (nếu có) thì bước chuẩn bị thêm một dòng.

## L5.6 Số đo: so với mốc Home PC sau #656, G7 và lượt 4

- **Dữ liệu tải sinh lại ở SHA ghim:** `node tools/load-data.mjs` (mốc `2026-10-12`, seed `6`). G7 sinh ở `233c77e` (03/11): `tables` sha256 `e256e4f18699f4a4e494b59a92ef46865eb4d2c9887f4ff1e7a6b872b4b345a2`, cùng số dòng như lượt 1–4. Sau `233c77e` không Issue nào đổi luật sinh dữ liệu, nên dự kiến cùng hash; bước chuẩn bị ghi hash đo được ở SHA ghim.
- **Mốc so (Home PC):**

  | Mốc | Nguồn |
  |---|---|
  | Probe trên exe: mốc chính | `docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json` (exe `dae9df3`, 18/10; `phase-6.md` mục "Mốc Home PC sau #656") |
  | Probe trên exe: G7 cùng máy, cùng bản probe (tham khảo chính) | `C:\workspace\g7-home-pc\lan-2\perf\perf-g7.json` (exe `233c77e`, 03/11, probe sau T-347; 5 143 B, sha256 `995E92383FED0A857D255596F9C3246517B7CE53E8B6B6D95B301EA6043CDFEE`). Không có bản trong repo; bảng ở `phase-6.md` mục "Số đo G7, NT-HN-01" |
  | Probe trên exe: lượt 4 cùng máy | `C:\workspace\deep-review-1-6-r4\common\perf\perf-ref.json` (exe `2e51e25`, 29/10; 5 143 B, sha256 `A4E8E4E9872C9487F6C9E991BB86AA2195C2B650FC726A69D834205AB5557BAD`). Probe trước T-345…T-347: hai dòng kỳ Tháng / kỳ Năm của Lịch hẹn chọn lịch khác, so thì ghi rõ |
  | Mở app lần đầu (LCP, cách T-227, 3 lần) | Mốc sau #656: 3 663 ms; lượt 4: 3 521 ms; G7: 3 420 ms. Xấu hơn theo luật nhiễu khi trung vị > 4 396 ms; ngưỡng "không chậm hơn exe Phase 4" là > 4 724 ms |
  | Mở lại trên dữ liệu tải (LCP, 3 lần) | G7: 617 ms, `p2c:data-open` 317 ms. Lượt 4 không đo |
  | Dọn sạch Thùng rác (exe: bấm "Backup rồi dọn sạch" → khung hình đầu có thông báo 11j) | Ngưỡng ≤ 500 ms trên dữ liệu tải (K30). Lượt 4: 123,3 ms; G7: 130,5 ms |
  | Hàm thuần trong Node | Số lượt 4 Home PC, tổng hợp lượt 4 §7.2; `byName` theo DR6-136 |

- **"Xấu hơn"** theo luật nhiễu (Owner chốt 13/10): trung vị lớn hơn mốc **quá 20 % và quá 10 ms** (bộ nhớ: quá 5 MB). Ngưỡng tuyệt đối ở `docs/metrics/phase-6.md` vẫn áp dụng.
- **Lệnh** (bước chuẩn bị chạy một lần, reviewer dùng lại kết quả trong `common\baseline.md`):

  ```powershell
  node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json
  ```

  ```powershell
  $env:PERF_BASE = 'docs\metrics\phase-6-baseline\perf-home-pc-sau-656.json'; $env:PERF_BACKUP = 'C:\workspace\deep-review-1-6-r5\common\load\load-2026-10-12-seed6.p2cbackup'; $env:PERF_OUT = 'C:\workspace\deep-review-1-6-r5\common\perf\perf-ref.json'; $env:PERF_NOTE = 'DESKTOP-KDURKJP, exe {SHA}, deep review luot 5'; pnpm exec playwright test -c playwright.perf.config.ts
  ```

  Bảng so G7 và so lượt 4: script `node` trong `common\perf\` gọi `parseRun` rồi `markdownTable` của `e2e/perf/stats.ts` trên `perf-ref.json` với `perf-g7.json`, rồi với `perf-ref-r4.json`, như §L4.6.
- **Cỡ bundle và exe:** so lượt 4 (`2e51e25`: JS / CSS 2 358 427 B, `index.js` 884 698 B, exe 5 649 408 B; `docs/metrics/phase-6.md` mục "Số đo deep review lượt 4") và G7 (exe 5 649 408 B). Bundle đo trên `apps\desktop\dist` build lại ở SHA ghim (`pnpm build:web`, không biến môi trường riêng); exe build lại ở SHA ghim. DR6-157 đã sửa (#926): "Tệp khác" chỉ đếm asset của bản dựng, nên số đo sau `pnpm e2e` cũng đúng (dòng R1 DR6-157 kiểm).
- **Dọn sạch Thùng rác:** đo như §L4.6 (Node hai cỡ; exe một lần với dữ liệu tải), so ngưỡng ≤ 500 ms, số lượt 4 và G7.
- **Reviewer muốn đo lại trên exe:** như §6 (chép `common\exe\project2c.exe` vào thư mục của mình, cổng debug khác 9222, không đo khi bên khác đang đo).

## L5.7 Ba bên, bài học từ lượt 4

- **Claude Opus 5.5:** như §L4.7 (Phụ lục Q). Lượt 4 chạy mức `max`, ultracode tắt; lượt 5 Owner chọn từng phiên.
- **Codex, model GPT Sol 6.1:** như §L4.7 (Phụ lục S). Lượt 4, gói D dừng 4 giờ vì hết hạn mức Codex; Owner nhắn làm tiếp trong cùng phiên. Mở phiên mới cũng được: bước 0 đọc file còn dòng `ĐANG LÀM` và làm tiếp.
- **DeepSeek V4.1 Flash:** như lượt 4 đã chạy thật (tổng hợp lượt 4 đầu file và §10.1; `PROJECT-STATE.md` 30–31/10), đổi theo bảng bài học dưới.
  - App desktop WorkBuddy bản quốc tế (lượt 4: v5.9.3). Model `Deepseek-V4.1-Flash`, context 1M, Thinking effort Max, chọn tay ở mỗi task. Ghi số bản app và tên model đúng như app hiện.
  - Mỗi gói một task qua **Code review expert** của app (lượt 4: expert dùng cùng model).
  - **Agent phụ của app** (Owner chấp nhận ở G6 ngày 30/10, chỉ cho lượt 4): cài đặt không tắt được công cụ Agent. Điều kiện Owner đặt là ACL chặn đọc và hash 12 báo cáo; lượt 4 không gói nào gọi agent phụ. Lượt 5 giữ quyết định này (đề xuất 8, §L5.11). Prompt (Phụ lục U) cho phép expert và agent phụ, và đòi mọi agent phụ nhận đủ quy tắc riêng 2–5. Không còn ngoại lệ gửi kèm tin nhắn mở gói như lượt 4.
  - Chế độ quyền **Default**, như cả 6 gói của lượt 4 (app ghi 14 lần "Sandbox bypassed (escalation-approved)" ở lệnh Playwright). Phiên thử vẫn đếm số lần app hỏi. App hỏi ở hầu hết lệnh thường thì Owner chọn Full Access như §L4.9, kèm task kiểm ACL ở Full Access.
  - **Chi phí (G4, Owner 04/11): chỉ credit của gói WorkBuddy Pro, không mua thêm credit.**
    - Gói Pro là gói Owner đăng ký cho lượt 4 (một tháng; 2.000 credit/tháng, thêm credit tặng mỗi ngày có dùng; Phụ lục P). Trước đợt 2, Owner kiểm gói còn hạn tới hết gói F. Hết hạn trước hay giữa đợt 2 thì dừng, hỏi Owner: gia hạn là chi phí mới (G4).
    - DeepSeek V4.1 Flash tính 0.00x tới hết 31/10, nên lượt 4 không cho số credit nào. WorkBuddy không công bố 1 credit bằng bao nhiêu token.
    - Khối việc lượt 4: 591 729 token ra (suy luận 323 350) qua 867 lượt; đầu vào một lượt tới 462 000 token, 99,2 % trúng cache (tổng hợp lượt 4 §2.2). Lượt 5 đọc diff bằng khoảng 1/3 và bảng R 53 dòng (lượt 4: 69), nên giả định không quá lượt 4.
    - Đo credit ở trang Usage: trước phiên thử, sau phiên thử, sau từng gói. **Điểm dừng sau mỗi gói A–E:** credit của gói tốn nhiều nhất tới lúc đó nhân số gói còn lại mà vượt credit còn lại → dừng, hỏi Owner trước gói kế. Không mua thêm credit.
    - Hết credit giữa một gói (dòng đầu báo cáo còn `ĐANG LÀM`) → dừng đợt 2, hỏi Owner: chờ credit tặng hằng ngày, hay gia hạn (G4).
    - Giờ cao điểm của DeepSeek (08:00–11:00 và 13:00–17:00 giờ Việt Nam, thứ Hai–thứ Sáu; §L4.7): chạy đợt 2 ngoài giờ đó nếu được.
  - **Chặn:** ACL đợt 2 như §L4.7, thêm cả thư mục lượt 4 `deep-review-1-6-r4` (Phụ lục V). `gh` đăng xuất trong đợt 2.

**Bài học từ lượt 4** (tổng hợp lượt 4 §2.2, §10.1 "Cho lần sau"; giữ mọi bài học §L2.7, §L3.7, §L4.7):

| Lượt 4 vướng | Lượt 5 làm |
|---|---|
| `dot2.mjs remove` dừng ở 16 mục do tài khoản sandbox của Codex làm chủ; Owner phải chạy `dot2-unlock.ps1` dưới quyền SYSTEM (30/10) | `dot2.mjs` lượt 5 (T-358, Phụ lục V): `deny` xem chủ sở hữu từng mục trước khi chặn, không chặn mục của tài khoản khác mà ghi lại; `remove` gỡ hết những gì gỡ được rồi liệt kê mọi mục chưa trả |
| Phiên thử 1 của DeepSeek chạy trước đợt 2 bước 1–4, khi chưa có ACL, và đọc được dòng đầu hai báo cáo gói A | Phiên thử chỉ mở khi `deny` và `scan` của đợt 2 bước 3 đã in `OK` và `common\dot2-acl.json` có (§L5.9 đợt 2 bước 5) |
| Shell của app có Node v22.22.2 trong PATH, repo đòi ≥ 24: 4 ca của `mock-adapter.test.ts` đỏ giả ở gói C; số của DSR4-A1 đo bằng Node 22 | Prompt DeepSeek (Phụ lục U quy tắc riêng 8): mọi lệnh `node` gọi bằng `C:\Program Files\nodejs\node.exe` (Home PC: v24.20.0); mọi lệnh shell chạy `node`, `pnpm`, vitest, Playwright hay công cụ trong `node_modules` đặt `C:\Program Files\nodejs` lên đầu PATH ngay trong lệnh đó, vì tiến trình con (shim `node_modules\.bin\*.cmd`, `webServer` `node e2e/serve.mjs` của Playwright) lấy `node` theo PATH. Kiểm `--version` ≥ 24 ở đầu phiên; phiên thử ghi Node của shell trước và sau khi đặt PATH, và chạy vitest với PATH đã đặt |
| Shim `safe-delete` của app chặn Playwright ghi `test-results\` khi quá 50 file | Prompt DeepSeek: Playwright luôn `--output` ra `…-r5\deepseek\{GÓI}\` |
| Codex và DeepSeek chấm DR6-37 ĐÃ SỬA theo danh sách của Issue, sót vị trí báo cáo lượt 1 nêu | Phụ lục T: dòng R1 kiểm theo mô tả DR6 ở tổng hợp và báo cáo gốc (§L5.4) |
| DeepSeek kết luận SẴN SÀNG ở gói F, cả ở review Phase 5 lẫn lượt 4, vì không áp quyết định "sửa hết" | Phụ lục T: kết luận gói F áp quyết định Owner trong `known.md`; còn phát hiện mới hay dòng R chưa ĐÃ SỬA thì CHƯA SẴN SÀNG |
| DeepSeek kết luận một dòng R (DR6-118) bằng đọc code, không dựng bản web | Giữ quy tắc chung 6; Phụ lục U nhắc lại |
| Ngoại lệ của quy tắc riêng 4 (agent phụ, Code review expert) gửi kèm tin nhắn mở mỗi gói DeepSeek | Phụ lục U ghi thẳng vào quy tắc; tin nhắn mở gói chỉ còn một dòng |
| Bước chuẩn bị lượt 4 chạy `pnpm build:exe` lần 1 hỏng vì script để biến `CI` rỗng cho tiến trình con | §L5.9 bước 6: gỡ hẳn `CI` khỏi môi trường trước `pnpm build:exe` |

## L5.8 Báo cáo lượt 5

Khuôn như §L4.8 (và §L3.8, §L2.8), đổi:

- ID `CLR5-<gói><số>` / `CXR5-<gói><số>` / `DSR5-<gói><số>` (§L5.2); `Vị trí: path:dòng ({SHA})`.
- `Liên quan: DR6-xx / T-xxx (nếu có) · mới do đợt sửa sau lượt 4 (PR #…) | có từ trước, lượt 1–4 bỏ sót`.
- Hai bảng R, cùng cột như §L2.8 (`| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |`):
  - **R1:** mọi dòng mà gói kiểm trong 25 dòng của §L5.5 phần 4;
  - **R2:** mọi Issue mà gói kiểm trong bảng R2 của `known.md` phần 5 (28 dòng lúc soạn; bước chuẩn bị thêm dòng cho Issue code mới trước SHA ghim, §L5.5).
- Phạm vi đã đọc gồm phần diff `2e51e25..{SHA}` của gói.
- Mục 1 (đầu báo cáo): Claude ghi model, mức suy luận, ultracode bật hay tắt; Codex ghi phiên bản Codex và model như công cụ cho biết; DeepSeek ghi bản app WorkBuddy (theo `common\baseline.md`), expert, model, context, mức suy luận và Node của shell.
- **Gói F:** bảng R1 gộp đủ 25 dòng và bảng R2 gộp đủ mọi dòng của `known.md` phần 5 (từ báo cáo A–E lượt 5 của chính bên đó + phần F). Kèm kết luận **SẴN SÀNG / CHƯA SẴN SÀNG cho v1.0 ở SHA ghim** và lý do, áp các quyết định Owner trong `known.md` (tham khảo; kết luận thật ở phiên tổng hợp).

## L5.9 Chuẩn bị và chạy

**Bước chuẩn bị — Claude, sau khi Owner duyệt kế hoạch lượt 5 và T-358 đã merge** (một phiên trên Home PC; không review, không ghi phát hiện):

1. Ghi `hostname` và ngày giờ (`Get-Date`) vào `common\baseline.md`.
   - **Kiểm sổ OPEN rỗng:** mục OPEN của `docs/state/review-notes.md` ở `origin/main` không còn mục lá nào. Còn → dừng, báo Owner.
   - **Ghim SHA:** `git rev-parse origin/main` lúc đó là SHA ghim; ghi đủ 40 ký tự vào `baseline.md`.
   - Ghi `git diff --stat 3d237b0 <SHA ghim> -- . ':(exclude)docs/**' ':(exclude)*.md'`. Rỗng thì code trùng exe ứng viên đã nghiệm thu L3; không rỗng thì ghi Issue nào đổi code, và thêm dòng R2 cho Issue đó.
   - Kiểm `C:\workspace\deep-review-1-6-r5\` chưa có (có rồi → dừng, báo Owner).
   - Kiểm hai file mốc có, sha256 như §L5.6: `C:\workspace\deep-review-1-6-r4\common\perf\perf-ref.json` và `C:\workspace\g7-home-pc\lan-2\perf\perf-g7.json`.
   - App WorkBuddy: Owner xác nhận đã đăng xuất app trên máy này (Phụ lục P, ranh giới tài khoản); ghi vào `baseline.md`. Claude không mở app, không đọc thư mục dữ liệu của app.
2. Tạo `C:\workspace\deep-review-1-6-r5\{common,claude,codex,deepseek}`.
3. Đưa hai worktree về SHA ghim:
   - `git -C C:\workspace\Project-2C-review checkout --detach <SHA ghim>`, tương tự với `-review-2`;
   - xóa `apps\desktop\dist` ở mỗi worktree;
   - xóa `apps\desktop\src-tauri\target\` ở mỗi worktree nếu có, không dừng hỏi. Đây là cache build, sinh lại được; xóa trước khi ghi mốc để đợt 2 bước 1 xóa trọn bản build do bước 6 sinh ra (review #878). §L4.9 dừng hỏi Owner khi có thư mục này (lượt 4 không gặp); đổi này Owner chọn ở đề xuất 10 (§L5.11);
   - `pnpm install --frozen-lockfile` (PowerShell);
   - `git status --short` rỗng (ngoài file Codex tự sinh ở `-review-2`, §8).
4. Chép vào `common\`:
   - `plan.md` (file này, bản đã merge);
   - `known.md` dựng mới theo §L5.5 ở SHA ghim:
     - phần 1 từ `docs/state/review-notes.md` ở SHA ghim (OPEN rỗng, ACCEPTED nguyên văn);
     - K1–K40 chép từ bảng của `docs/reviews/raw/2026-10-31/common-known.md`, K17 theo chữ ở §L5.5; K41–K47;
     - mục "Lệch mockup đã biết" nguyên văn;
     - bảng R1 kèm danh sách KNOWN; bảng R2;
   - `fixes.md`:
     - thân các Issue ở các bảng của §L5.2;
     - thân PR sửa: mục "Lệch so với Issue", "Chưa làm", "Sửa sau review", "Ghi chú OPEN liên quan";
     - nguyên văn các nhóm RESOLVED của sổ mà các Issue đó gom (theo nhãn T-xxx, ở SHA ghim);
     - lấy bằng `gh issue view` / `gh pr view --json body`;
   - `prompt-claude.md` = Phụ lục Q + Phụ lục T; `prompt-codex.md` = Phụ lục S + Phụ lục T; `prompt-deepseek.md` = Phụ lục U + Phụ lục T. Chép nguyên văn, chỉ thay `{SHA}` bằng 7 ký tự đầu và `{SHA_ĐỦ}` bằng đủ 40 ký tự của SHA ghim (`{GÓI}` để nguyên: reviewer thay theo tin nhắn);
   - `dot2.mjs` = khối code của Phụ lục V (thêm ở T-358), chép nguyên văn.

   Cuối bước này chạy `node C:\workspace\deep-review-1-6-r5\common\dot2.mjs baseline`: ghi `common\dot2-baseline.json` như §L4.9 bước 4.
5. Dữ liệu tải: `node tools/load-data.mjs --out C:\workspace\deep-review-1-6-r5\common\load\load-2026-10-12-seed6.p2cbackup`; ghi hash `tables` vào `baseline.md`, so §L5.6. Khác hash G7 → ghi Issue nào đổi dữ liệu.
6. Chạy cổng ở SHA ghim (trong `Project-2C-review`):
   - `pnpm verify`, `pnpm verify:rust`, `pnpm e2e` (`CI=1`);
   - `pnpm build:exe`, sau khi gỡ hẳn biến `CI` khỏi môi trường (`Remove-Item Env:CI -ErrorAction SilentlyContinue`): Tauri CLI đọc `CI` rỗng thành cờ `--ci` và dừng (lượt 4, lần 1);
   - `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json`: bảng theo gói và diff `2e51e25..<SHA ghim>` như §L5.3; cỡ bundle / exe so lượt 4 và G7 (§L5.6).

   Kết quả ghi vào `common\baseline.md`; chép exe vào `common\exe\`.
7. Đo hiệu năng bằng script của G7, một lượt liền; Owner để máy rảnh ≈ 8 phút, cửa sổ exe ở trên cùng.
   - Chép `C:\workspace\g7-home-pc\lan-2\perf\` (các `.ps1`, `.mjs`; không chép kết quả) sang `-r5\common\perf\`. Đổi đường dẫn trong `run-exe.ps1` sang `-r5\common`, tên file kết quả probe sang `perf-ref.json`.
   - Chép `deep-review-1-6-r4\common\perf\perf-ref.json` thành `common\perf\perf-ref-r4.json`, và `g7-home-pc\lan-2\perf\perf-g7.json` thành `common\perf\perf-g7.json`.
   - Script chạy: mở lần đầu 3 lần (cách T-227); nhập dữ liệu tải vào exe qua cổng debug; mở lại 3 lần; probe (lệnh §L5.6, thay `{SHA}`) → `common\perf\perf-ref.json`; Dọn sạch Thùng rác một lần trên exe.
   - Đo Dọn sạch trong Node hai cỡ như §L4.6 (chép `deep-review-1-6-r4\common\perf\purge-node.mjs`).
   - Ghi vào `baseline.md` ba bảng: so mốc sau #656 (bảng của probe), so G7, so lượt 4 (ghi chú hai dòng kỳ Tháng / kỳ Năm). Cả ba có thêm cột ngưỡng `phase-6.md`. Thêm số mở lần đầu, mở lại và Dọn sạch, so §L5.6.
8. Báo Owner: sẵn sàng chạy lượt 5.

**Owner chạy đợt 1** (Claude và Codex cùng lúc):

- **Codex** (model GPT Sol 6.1), ở `C:\workspace\Project-2C-review-2`, mỗi gói một phiên mới, lần lượt A → F:

  ```text
  Gói A. Lệnh đầu tiên chỉ đọc C:\workspace\deep-review-1-6-r5\common\prompt-codex.md (không gộp lệnh khác), rồi làm đúng file đó.
  ```

- **Claude** (Claude Opus 5.5), ở `C:\workspace\Project-2C-review`, mỗi gói một phiên mới, lần lượt A → F; mức suy luận và ultracode Owner chọn:

  ```text
  Gói A. Lệnh đầu tiên chỉ đọc C:\workspace\deep-review-1-6-r5\common\prompt-claude.md (không gộp lệnh khác), rồi làm đúng file đó.
  ```

**Owner chạy đợt 2** (DeepSeek một mình). Điều kiện bắt đầu:

- đủ 12 báo cáo đợt 1 với dòng đầu `XONG`;
- Codex đã xong, và không còn phiên Claude nào mở ở `Project-2C-review`;
- gói WorkBuddy Pro còn hạn tới hết đợt 2 (Owner kiểm; hết hạn thì dừng, hỏi Owner trước khi gia hạn).

Từ bước 4, chỉ Owner dùng app WorkBuddy và đụng tới thư mục dữ liệu của app (Phụ lục P, ranh giới tài khoản). Bước 1, 3 và 7 chạy `common\dot2.mjs` trong PowerShell của Owner. Lệnh in `OK` khi đạt. Không đạt thì in `STOP` kèm lý do: dừng ở đó, báo Claude.

1. Đóng Codex (app và CLI) và mọi phiên Claude ở hai worktree review, rồi dọn những gì đợt 1 để lại (như §L4.9 đợt 2 bước 1):

   ```powershell
   node C:\workspace\deep-review-1-6-r5\common\dot2.mjs clean
   ```

2. Chạy `gh auth logout`; sau đó `gh auth status` phải báo chưa đăng nhập. `[Environment]::GetEnvironmentVariable('OPENCODE_GO_KEY', 'User')` và `… 'Machine')` phải rỗng.
3. Ghi hash 12 báo cáo của Claude / Codex, rồi chặn đọc bằng ACL, rồi quét (như §L4.9 đợt 2 bước 3; ACL chỉ chặn đọc, bước 7 so lại hash):

   ```powershell
   $h = Get-FileHash C:\workspace\deep-review-1-6-r5\claude\*.md, C:\workspace\deep-review-1-6-r5\codex\*.md | Select-Object Path, Hash; if ($h.Count -ne 12) { throw "Cần 12 báo cáo, thấy $($h.Count)" }; $h | Export-Csv C:\workspace\deep-review-1-6-r5\common\dot2-reports-hash.csv -NoTypeInformation
   ```

   ```powershell
   node C:\workspace\deep-review-1-6-r5\common\dot2.mjs deny
   ```

   ```powershell
   node C:\workspace\deep-review-1-6-r5\common\dot2.mjs scan
   ```

   `deny` chặn như §L4.9 đợt 2 bước 3, đổi theo Phụ lục V:
   - **cả thư mục:** `…-r5\claude`, `…-r5\codex`; thư mục lượt 1–4 `deep-review-1-6-r4`, `-r3`, `-r2`, `deep-review-1-6`; transcript, `file-history\<id>` và scratchpad của các phiên Claude ở worktree review;
   - **từng mục con:** `%USERPROFILE%\.codex` và `C:\workspace\Project-2C-review-2`, để ngỏ `node_modules`, `.git` và link;
   - mục do tài khoản khác làm chủ: không chặn, ghi vào `dot2-acl.json` và in ra; thư mục có mục như vậy bên trong thì chặn từng mục con của Owner (Phụ lục V điểm 3);
   - mục tài khoản Owner không đọc được từ trước `deny` (lượt 4: `.codex\.sandbox-bin`): vẫn chặn như trên. Mục như vậy nằm sâu bên trong chỗ bước 7 quét lại thì không có luật riêng. `deny` in cả hai loại và ghi vào `dot2-acl.json`, bước 7 không tính chúng là chưa trả (Phụ lục V điểm 6).

   `scan` tìm mã phát hiện và dòng đầu báo cáo lượt 5 của Claude / Codex ở những chỗ còn đọc được, như §L4.9.
4. Mở app WorkBuddy (Phụ lục P, V):
   - Đăng nhập app (bản quốc tế, tài khoản có gói WorkBuddy Pro): Owner tự làm. Ghi số bản app (About) vào `baseline.md`.
   - **Kiểm gói Pro:** ngày hết hạn sau ngày dự kiến xong gói F. Không thì dừng, hỏi Owner (G4).
   - Cài đặt như Phụ lục P mục "Cài đặt app", đổi theo Phụ lục V: Code review expert, agent phụ của app chấp nhận. Xem Memory, xóa mục không thuộc lượt 5, ghi số mục còn lại vào `baseline.md`.
   - Ghi **credit trước** (trang Usage) vào bảng đánh dấu, trước phiên thử.
5. **Phiên thử**, chỉ khi bước 3 đã xong: `deny` và `scan` in `OK`, và `common\dot2-acl.json` có. Lượt 4, phiên thử 1 chạy trước khi có ACL.

   Tạo một task mới qua Code review expert: workspace `C:\workspace\Project-2C-review`, chế độ quyền Default, model `Deepseek-V4.1-Flash`, context 1M, mức suy luận cao nhất. Ghi model mà expert dùng. Bảo model làm các việc của §L4.9 đợt 2 bước 5, ghi kết quả vào `common\baseline.md` dưới một đề mục riêng của task này, với các đổi:
   - mọi đường dẫn `-r4` của lượt 4 đổi thành `-r5`;
   - liệt kê thêm `C:\workspace\deep-review-1-6-r4` → bị từ chối;
   - bỏ việc "giao một việc cho agent khác → không làm được": agent phụ của app được dùng (Phụ lục V). Thay bằng: bảo model giao cho một agent phụ đúng một lần đọc thử mục bị chặn (liệt kê `…-r5\claude`) → bị từ chối, vì agent phụ chạy cùng tài khoản Windows;
   - `node --version` trong shell của app, và `& 'C:\Program Files\nodejs\node.exe' --version` → ghi cả hai; bản thứ hai phải ≥ 24, không thì dừng, báo Claude;
   - việc vitest của §L4.9 bước 5 chạy như quy tắc riêng 8 của Phụ lục U: Node 24 đầu PATH, đặt ngay trong cùng lệnh, in `node --version` ngay sau khi đặt (phải ≥ 24), rồi gọi vitest bằng `node` đường dẫn đủ. Mỗi shell mà app dùng chạy một lần (lượt 4 app dùng cả Git Bash lẫn PowerShell):
     - PowerShell: `$env:Path = 'C:\Program Files\nodejs;' + $env:Path; node --version; & 'C:\Program Files\nodejs\node.exe' node_modules/vitest/vitest.mjs run packages/domain`;
     - Git Bash: `export PATH="/c/Program Files/nodejs:$PATH"; node --version; "/c/Program Files/nodejs/node.exe" node_modules/vitest/vitest.mjs run packages/domain`;
     - → ghi bản Node in ra và kết quả vitest (xanh). Lượt 4 chạy việc này bằng `node` trần, tức Node 22;
   - chạy một probe Playwright trên bản build web, Node 24 đầu PATH như trên, với `--output` ra `…-r5\deepseek\_thu\` (chỉ ghi lại; sandbox chặn mà Owner giữ Default thì DeepSeek ghi PLAUSIBLE cho phần chỉ kiểm được trên trình duyệt).

   Ra khác §L4.9 thì dừng đợt 2, làm như đường "Sửa theo …" của §L4.9. Lệnh **Log của app**, kiểm ACL ở Full Access (nếu chọn), **credit sau phiên thử** và đoạn "Xong" (dọn file thử, Memory, đọc lại `baseline.md`, chạy lại `scan`) như §L4.9 đợt 2 bước 5.
6. Mỗi gói một task mới qua Code review expert, lần lượt A → F:
   - Trước khi mở: ghi số bản app. Khác bản ở phiên thử thì ghi lại, không dừng.
   - Tạo task: workspace `C:\workspace\Project-2C-review`, chế độ quyền đã chọn ở phiên thử, model như phiên thử. Rồi gửi đúng một dòng, không kèm ngoại lệ:

     ```text
     Gói A. Lệnh đầu tiên chỉ đọc C:\workspace\deep-review-1-6-r5\common\prompt-deepseek.md (không gộp lệnh khác), rồi làm đúng file đó.
     ```

   - Ngay khi mở task của gói, Owner ghi file phiên của gói vào bảng đánh dấu (file `.jsonl` mới nhất dưới thư mục của worktree review, chỗ ghi ở phiên thử).
   - App hỏi duyệt: Owner từ chối mọi việc ngoài việc review (Phụ lục P). Lệnh Playwright / exe của gói mà sandbox chặn thì duyệt được, như lượt 4.
   - Xong gói: trang Usage → ghi credit.
   - **Điểm dừng chi phí, sau mỗi gói A–E** (G4, Owner 04/11): credit của gói tốn nhiều nhất tới lúc đó nhân số gói còn lại mà vượt credit còn lại → dừng, hỏi Owner trước gói kế. **Không mua thêm credit.**
   - Hết credit giữa một gói → dừng đợt 2, hỏi Owner. Khi chạy tiếp, mở task mới với đúng tin nhắn của gói đó; bước 0 tự làm tiếp.
7. Xong F, làm theo thứ tự (như §L4.9 đợt 2 bước 7):
   1. **Đăng xuất app**, trước khi ai chép gì vào repo. Ghi **credit sau** vào bảng đánh dấu.
   2. Thoát app.
   3. Chép file phiên A–F ra `deepseek\<gói>\session\` (§L5.10).
   4. Gỡ ACL:

      ```powershell
      node C:\workspace\deep-review-1-6-r5\common\dot2.mjs remove
      ```

      Lệnh gỡ mọi mục gỡ được, kiểm đọc lại được, rồi in `OK`. Mục không đọc được từ trước `deny` mà vẫn không đọc được thì in riêng, không tính. Còn mục chưa trả thì in danh sách mọi mục đó (đường dẫn, chủ sở hữu) và `STOP`: báo Claude. Gỡ bằng quyền khác (như `dot2-unlock.ps1` dưới quyền SYSTEM của lượt 4) chỉ khi Owner duyệt.
   5. So hash 12 báo cáo với bước 3:

      ```powershell
      & { $ErrorActionPreference = 'Stop'; $old = @(Import-Csv C:\workspace\deep-review-1-6-r5\common\dot2-reports-hash.csv); $new = @(Get-FileHash C:\workspace\deep-review-1-6-r5\claude\*.md, C:\workspace\deep-review-1-6-r5\codex\*.md | Select-Object Path, Hash); if ($old.Count -ne 12 -or $new.Count -ne 12) { throw "Cần 12 báo cáo ở CSV và ở thư mục, thấy $($old.Count) / $($new.Count)" }; if (Compare-Object $old $new -Property Path, Hash) { throw 'Báo cáo của Claude / Codex đã đổi trong đợt 2' }; 'OK: 12 báo cáo không đổi' }
      ```

      Khác hay dừng → báo Claude; phiên tổng hợp tìm trong log của app lệnh đã ghi vào đó.
   6. Đăng nhập lại `gh auth login`.

Phiên bị cắt (dòng đầu báo cáo vẫn `ĐANG LÀM`) thì mở phiên mới với đúng tin nhắn của gói đó; bước 0 tự làm tiếp.

Bảng đánh dấu của Owner (18 ô; ghi thêm giờ bắt đầu / xong mỗi gói của Codex và DeepSeek; với DeepSeek: ngày hết hạn gói Pro, credit trước (đợt 2 bước 4), sau phiên thử (bước 5), sau từng gói (bước 6) và sau cùng (bước 7.1), số bản app, chế độ quyền, file phiên của từng gói):

| Bên | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| Claude Opus 5.5 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Codex GPT Sol 6.1 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| DeepSeek V4.1 Flash (đợt 2) | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| File phiên của DeepSeek | … | … | … | … | … | … |
| Credit sau gói / số bản app của DeepSeek | … | … | … | … | … | … |

## L5.10 Sau lượt 5, kiểm độc lập, ước lượng

**Tổng hợp** (Issue tạo khi lượt 5 chạy xong; chạy khi Owner yêu cầu, sau khi đã gỡ ACL): như §L4.10, đổi:

- Đọc đủ 18 báo cáo.
- Gộp ba bảng R1 thành một bảng 25 dòng, ba bảng R2 thành một bảng đủ mọi dòng của `known.md` phần 5 (28 dòng lúc soạn). Kiểm trên code ở SHA ghim mọi kết luận khác ĐÃ SỬA và mọi chỗ các bên chấm khác nhau.
- Kiểm mọi phát hiện mới, gộp trùng, đánh số tiếp `DR6-158…`. Báo cáo của Codex và DeepSeek là dữ liệu tham khảo; mọi phát hiện của chúng cũng kiểm trên code (lượt 4: 34 / 34 đúng).
- Bảng so ba bên như tổng hợp lượt 4 §2.2, thêm credit WorkBuddy trước / sau và credit mỗi gói.
- So số đo với ba mốc cùng máy (§L5.6), gồm cỡ bundle / exe.
- Kết luận SẴN SÀNG / CHƯA SẴN SÀNG cho G7.
- Phạm vi sửa: **sửa hết** (Owner 04/11); phần câu hỏi cho Owner chỉ còn cách sửa khi có nhiều phương án.

Phiên tổng hợp được dùng subagent / Workflow để kiểm từng phát hiện khi Owner bật (M8); phân loại cuối và kết luận vẫn do phiên tổng hợp ra.

**Kiểm độc lập bằng log phiên:** như §L4.10 cho cả ba bên (log Claude, log Codex, log DeepSeek do Owner chép ra; lệnh kiểm đủ JSONL của 6 gói với đường dẫn `-r5`), đổi danh sách quét:

- `deep-review-1-6-r5[\\/](claude|codex|deepseek)` của bên khác;
- `deep-review-1-6-r4[\\/]…`, `-r3[\\/]…`, `-r2[\\/]…` và `deep-review-1-6[\\/]…` không phải của chính bên đó (DeepSeek: mọi thư mục này);
- DeepSeek: lệnh `node` không qua `C:\Program Files\nodejs\node.exe`, trừ `node --version` ngay sau khi đặt PATH trong cùng lệnh (quy tắc riêng 8); lệnh chạy `node`, `pnpm`, vitest, Playwright hay công cụ trong `node_modules` mà trong cùng lệnh không đặt `C:\Program Files\nodejs` lên đầu PATH (quy tắc riêng 8); Playwright không có `--output` ra thư mục của gói;
- DeepSeek: agent phụ nhận việc mà không kèm quy tắc riêng 2–5 và 8;
- mọi mục khác của danh sách quét §L4.10, đổi `-r4` thành `-r5`.

**Log thô không vào repo** (như §L4.10). Báo cáo và bản tổng hợp chỉ trích đoạn log cần dẫn, sau khi đã quét mẫu key và đã đăng xuất app.

**Báo cáo gốc lưu ở repo** (PR docs của phiên tổng hợp):

- `docs/reviews/raw/<ngày tổng hợp>/{claude,codex,deepseek}/<gói>.md` nguyên văn;
- `common-known.md`, `common-baseline.md` (gồm bản app, cài đặt app, chế độ quyền, credit), `common-fixes.md`; `common-plan.md`, `common-prompt-*.md` chỉ khi khác bản trong repo;
- bản tổng hợp `docs/reviews/<ngày>-deep-review-phase-1-6-luot-5-tong-hop.md`.

Thư mục bằng chứng `deep-review-1-6-r5\` giữ trên Home PC tới v1.0.

**Sau tổng hợp: đợt sửa hết, rồi G7** (Owner 04/11):

- đợt sửa đổi màn hay hành vi nào thì nghiệm thu lại các dòng NT đó trên exe phát hành, và chụp lại ảnh hướng dẫn có màn đó (NT-HD-01; K46);
- NT-EV-01 (eval AI thật, tốn tiền, Owner bấm, G4) chạy sau đợt sửa, với version prompt cuối. Không chạy trong đợt 2: bước 2 kiểm biến môi trường key rỗng;
- chạy lại cổng và probe trên SHA phát hành, so mốc sau #656.

**Ước lượng.** Lượt 4 trên Home PC: Claude ≈ 6 h 13 (55–73 phút mỗi gói); Codex ≈ 4 h 05 làm việc; DeepSeek ≈ 3 h 32 (tổng hợp lượt 4 §2.2).

- Lượt 5 đọc diff bằng khoảng 1/3 lượt 4, bảng R 53 dòng (25 + 28) so 69.
- Đợt 1: Claude ≈ 5–6 h; Codex ≈ 3–4 h. Đợt 2: DeepSeek ≈ 3 h.
- Cả lượt 5 ≈ 2 ngày tính cả chuẩn bị và hai đợt; tổng hợp thêm ≈ nửa ngày; rồi tới đợt sửa. Trước đó là T-358 (một PR docs nhỏ).
- Owner can thiệp:
  - đăng xuất app WorkBuddy trên Home PC trước bước chuẩn bị; kiểm gói Pro còn hạn trước đợt 2;
  - mở 6 phiên Claude + 6 phiên Codex + 6 task DeepSeek;
  - ở đợt 2: đóng Codex, hash 12 báo cáo, chạy `dot2.mjs` (dọn, chặn ACL, quét, gỡ ACL), `gh auth logout` / `login`, đăng nhập / đăng xuất app, cài đặt app, phiên thử, tạo task từng gói, duyệt hay từ chối khi app hỏi, ghi file phiên và credit của từng gói, chép log phiên, so hash báo cáo;
  - để máy rảnh ≈ 8 phút ở bước 7;
  - ghi giờ bắt đầu / xong mỗi gói của Codex và DeepSeek.

## L5.11 Quyết định của Owner (04/11/2026) và đề xuất

**Đã chốt** (Issue #1025; Owner trả lời trong phiên soạn ngày 04/11/2026 trên Home PC):

1. **Bên review:** "lên plan deep code base review round 5 với 3 bên như round 4: Claude Opus, Codex GPT Sol và Deepseek v4.1 Flash qua Workbuddy". Claude Opus 5.5, Codex GPT Sol 6.1, DeepSeek V4.1 Flash trong app desktop WorkBuddy; 18 báo cáo.
2. **Sau lượt 5:** hỏi "Sau lượt 5 deep review, phát hiện xử lý thế nào?", Owner chọn "Sửa hết rồi G7". Như lượt 3–4: exe đổi thì nghiệm thu lại các dòng NT có màn hay hành vi bị đổi, và chụp lại ảnh hướng dẫn liên quan.
3. **SHA ghim:** hỏi "Ghim SHA lượt 5 lúc nào?", Owner chọn "Ghim main khi chuẩn bị". Code lúc soạn trùng `3d237b0`, exe ứng viên đã nghiệm thu L3; trong lượt 5 không merge code.
4. **Chi phí DeepSeek (G4):** hỏi "Trần chi phí nào?" (V4.1 Flash hết miễn phí từ 01/11), Owner chọn "Chỉ credit của gói Pro": không mua thêm credit; hết credit giữa chừng thì dừng các gói còn lại của DeepSeek và hỏi Owner.

Cùng ngày Claude trình thiết kế trong chat (mục tiêu, SHA ghim, phạm vi R1 / R2, KNOWN, số đo, DeepSeek và chi phí, bài học lượt 4, việc sau lượt 5, ước lượng, tài liệu sửa). Owner chọn "Duyệt, viết PR".

**Đề xuất, Owner chọn cùng G1.** Mục 5–8, 10, 11 đã có trong thiết kế Owner duyệt trong chat (trừ phần ACL chặn thêm `-r4` của mục 8); mục 9 và phần đó là mới của PR này.

**Owner duyệt G1 ngày 04/11/2026**, trong chat của phiên sửa PR #1026 sau review `272f6f1`: "chọn đề xuất 5–11 như PR ghi". Owner bảo sửa cùng lúc bốn ghi chú không chặn của review đó. Hai ghi chú đổi đề xuất 10 (Node 24 đầu PATH cho tiến trình con; xóa luôn `target\` ở bước chuẩn bị); cột "Đề xuất" dưới đây đã gồm hai đổi đó.

| # | Đề xuất | Mục | Owner chọn |
|---|---|---|---|
| 5 | Phạm vi đủ 6 gói, hai phần ngang nhau. R1 25 dòng (DR6-135…157, DR6-37, CLR4-F2), R2 28 Issue (T-329…T-356); dòng R1 kiểm theo mô tả DR6. Tìm lỗi / edge case mới trên toàn bộ phạm vi gói, xét trước code mới sau lượt 4 | §L5.3, §L5.4, §L5.5 | Theo đề xuất (04/11/2026) |
| 6 | KNOWN lượt 5 dựng mới ở SHA ghim: OPEN rỗng + ACCEPTED; K1–K40 theo `common-known.md` lượt 4, K17 thêm pipeline; K41–K47; "Lệch mockup đã biết" nguyên văn | §L5.5 | Theo đề xuất (04/11/2026) |
| 7 | Số đo trên Home PC, so mốc sau #656 (chính), G7 `perf-g7.json` (cùng bản probe) và lượt 4. Đo bằng script của G7 (thêm mở lại). Bundle / exe so lượt 4 và G7 | §L5.6, §L5.9 bước 7 | Theo đề xuất (04/11/2026) |
| 8 | Hai đợt và ACL như lượt 4; ACL chặn thêm `deep-review-1-6-r4`. DeepSeek qua Code review expert, chế độ quyền Default; agent phụ của app chấp nhận như G6 30/10, nay ghi trong prompt | §L5.2, §L5.7, §L5.9, Phụ lục U, V | Theo đề xuất (04/11/2026), gồm ACL thêm `-r4` |
| 9 | `dot2.mjs` lượt 5 làm ở Issue riêng T-358 (tạo sau G1): PR docs thêm khối code vào Phụ lục V, thử trên cây giả như T-314, T-315; merge trước bước chuẩn bị | §L5.2, §L5.9, Phụ lục V | Theo đề xuất (04/11/2026) |
| 10 | Bài học lượt 4 (bảng §L5.7): Node 24 bằng đường dẫn đủ và đặt đầu PATH trong mỗi lệnh chạy `node` / `pnpm` / vitest / Playwright (tiến trình con lấy `node` theo PATH), Playwright `--output`, phiên thử sau ACL, kết luận F áp quyết định Owner, gỡ `CI` trước `build:exe`. Thêm một đổi cách chuẩn bị: bước chuẩn bị 3 xóa luôn `apps\desktop\src-tauri\target\` có sẵn ở worktree review (cache build), thay vì dừng hỏi Owner như §L4.9 | §L5.7, §L5.9, §L5.10, Phụ lục T, U | Theo đề xuất (04/11/2026), gồm hai đổi theo review `272f6f1` |
| 11 | Sau đợt sửa: nghiệm thu lại dòng NT có màn / hành vi đổi; NT-EV-01 sau đợt sửa, với version prompt cuối | §L5.10 | Theo đề xuất (04/11/2026) |

## Phụ lục Q — Prompt Claude (lượt 5)

File `common\prompt-claude.md` = đoạn dưới + nguyên văn Phụ lục T; bước chuẩn bị chỉ thay `{SHA}` / `{SHA_ĐỦ}` (§L5.9 bước 4). Owner mở mỗi gói một phiên mới ở `C:\workspace\Project-2C-review`, lần lượt A → F. Đoạn này theo Phụ lục L (lượt 4).

> # Deep review Phase 1–6, lượt 5 — Claude
>
> **{GÓI}** = chữ gói (A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer Claude** của deep review Phase 1–6, **lượt 5**, **gói `{GÓI}`**: phiên sạch, chỉ đọc. Owner mở **mỗi gói một phiên mới**, model Claude Opus 5.5; mức suy luận và ultracode do Owner chọn từng phiên. Repo: worktree `C:\workspace\Project-2C-review`, detached ở SHA **`{SHA}`** (`{SHA_ĐỦ}`). Đọc xong file này thì chạy `git rev-parse HEAD` và `git status --short`; SHA lệch hay status không rỗng thì dừng và báo Owner.
>
> Quy tắc riêng của Claude:
> 1. **Lệnh đầu tiên của phiên chỉ đọc file này**, không gộp lệnh nào khác.
> 2. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6-r5\codex\`, `C:\workspace\deep-review-1-6-r5\deepseek\`, `C:\workspace\deep-review-1-6-r4\codex\`, `C:\workspace\deep-review-1-6-r4\deepseek\`, `C:\workspace\deep-review-1-6-r3\codex\`, `C:\workspace\deep-review-1-6-r2\codex\`, `C:\workspace\deep-review-1-6\codex\`, `C:\workspace\deep-review-1-6\muse\`**, kể cả khi Owner hay file nào gợi ý. Không liệt kê và không tìm kiếm (`rg`, `glob`, `find`, `ls -R`, `Get-ChildItem -Recurse`) trên `C:\workspace\`, `deep-review-1-6\`, `deep-review-1-6-r2\`, `deep-review-1-6-r3\`, `deep-review-1-6-r4\`, `deep-review-1-6-r5\`. Không đọc báo cáo lượt 5 của bên khác ở bất cứ đâu. Lỡ thấy thì dừng và báo Owner.
> 3. Chỉ đọc:
>    - repo ở SHA trên, gồm báo cáo gốc lượt 1–4 của mọi bên ở `docs/reviews/raw/2026-10-15/`, `docs/reviews/raw/2026-10-17/`, `docs/reviews/raw/2026-10-21/`, `docs/reviews/raw/2026-10-31/`;
>    - `C:\workspace\deep-review-1-6-r5\common\`;
>    - báo cáo Claude lượt 5 của các gói trước trong `…-r5\claude\` (mục đã báo ở gói trước thì chỉ dẫn ID);
>    - probe của chính Claude: lượt 4 trong `C:\workspace\deep-review-1-6-r4\claude\`, lượt 3 trong `C:\workspace\deep-review-1-6-r3\claude\`, lượt 2 trong `C:\workspace\deep-review-1-6-r2\claude\`, lượt 1 trong `C:\workspace\deep-review-1-6\claude\` (để chạy lại tái hiện).
> 4. Không dùng skill `review-pr` / `code-review`. Không làm nghi thức phiên của repo (HANDOFF, `/handoff`, PR, Issue, merge, commit). Không chạy `gh` (thông tin Issue / PR sửa có ở `common\fixes.md`). Subagent / Workflow chỉ khi Owner bật ultracode cho phiên này (ADR-0001 M8). Khi đó chỉ phiên chính làm bước 0, ghi `{GÓI}.md` và in dòng `XONG`. **Subagent** (đọc file này vì tin nhắn của Owner tới cả nó) làm phần việc phiên chính giao, theo quy tắc 2, 3 và phần chung; ghi probe vào `…-r5\claude\{GÓI}\`, không ghi `{GÓI}.md`.
> 5. Ghi báo cáo vào `C:\workspace\deep-review-1-6-r5\claude\{GÓI}.md`, probe / bản chép / log vào `…-r5\claude\{GÓI}\`.
> 6. Gói F được đọc `…-r5\claude\A…E.md`. Xong gói nào thì dừng và in dòng `XONG …` (mục "Cuối phiên" của phần chung). Xong F thì **chờ Owner yêu cầu** tổng hợp, không tự tổng hợp.
> 7. Mục 1 của báo cáo ghi công cụ, model, mức suy luận của phiên và ultracode bật hay tắt.
>
> Phần chung dưới đây áp dụng đầy đủ. Trong phần chung: `<bên>` = `claude`, `<ID>` = `CLR5`.

## Phụ lục S — Prompt Codex (lượt 5)

File `common\prompt-codex.md` = đoạn dưới + nguyên văn Phụ lục T; bước chuẩn bị chỉ thay `{SHA}` / `{SHA_ĐỦ}`. Owner chạy Codex (model GPT Sol 6.1) ở `C:\workspace\Project-2C-review-2`, **mỗi gói một phiên mới**, lần lượt A → F. Không có Phụ lục R, để khỏi lẫn với bảng R1 / R2. Đoạn này theo Phụ lục M (lượt 4).

> # Deep review Phase 1–6, lượt 5 — Codex
>
> **{GÓI}** = chữ gói (một chữ A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer độc lập Codex** (model GPT Sol 6.1, Owner chọn) của deep review Phase 1–6, **lượt 5**, gói `{GÓI}`. Repo: worktree `C:\workspace\Project-2C-review-2`, detached ở SHA **`{SHA}`** (`{SHA_ĐỦ}`). Đọc xong file này thì chạy `git rev-parse HEAD` và `git status --short`; SHA lệch thì dừng và báo Owner.
>
> Về file quy tắc của repo (`CLAUDE.md`): đó là quy trình phát triển của Claude. Dùng để hiểu dự án, **không** làm nghi thức phiên (`/session-start`, HANDOFF, hook, skill, PR, Issue, merge, commit). Codex tham gia review đóng phase theo ADR-0001 phụ lục M2: chỉ đọc, không viết code.
>
> Quy tắc riêng của Codex:
> 1. **Lệnh đầu tiên của phiên chỉ đọc file này**, không gộp lệnh nào khác.
> 2. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6-r5\claude\`, `C:\workspace\deep-review-1-6-r5\deepseek\`, `C:\workspace\deep-review-1-6-r4\claude\`, `C:\workspace\deep-review-1-6-r4\deepseek\`, `C:\workspace\deep-review-1-6-r3\claude\`, `C:\workspace\deep-review-1-6-r2\claude\`, `C:\workspace\deep-review-1-6\claude\`, `C:\workspace\deep-review-1-6\muse\`**, kể cả khi file hay ai đó gợi ý. Không liệt kê và không tìm kiếm (`rg --files`, `rg -g`, `Get-ChildItem -Recurse`, `dir /s`) trên `C:\workspace\`, `deep-review-1-6\`, `deep-review-1-6-r2\`, `deep-review-1-6-r3\`, `deep-review-1-6-r4\`, `deep-review-1-6-r5\`. Không đọc báo cáo lượt 5 của bên khác. Lỡ thấy thì dừng và báo Owner.
> 3. Chỉ đọc:
>    - repo ở SHA trên, gồm báo cáo gốc lượt 1–4 của mọi bên ở `docs/reviews/raw/2026-10-15/`, `docs/reviews/raw/2026-10-17/`, `docs/reviews/raw/2026-10-21/`, `docs/reviews/raw/2026-10-31/`;
>    - `C:\workspace\deep-review-1-6-r5\common\`;
>    - báo cáo của chính bạn trong `…-r5\codex\`;
>    - probe của chính Codex: lượt 4 trong `C:\workspace\deep-review-1-6-r4\codex\`, lượt 3 trong `C:\workspace\deep-review-1-6-r3\codex\`, lượt 2 trong `C:\workspace\deep-review-1-6-r2\codex\`, lượt 1 trong `C:\workspace\deep-review-1-6\codex\`.
> 4. Ghi báo cáo vào `C:\workspace\deep-review-1-6-r5\codex\{GÓI}.md`, probe / bản chép / log vào `…-r5\codex\{GÓI}\`.
> 5. Gói F được đọc `…-r5\codex\A…E.md`. Không tổng hợp với báo cáo nào khác, không tạo Issue, không đề xuất merge, không chạy `gh` (thông tin Issue / PR sửa có ở `common\fixes.md`).
> 6. Mục 1 của báo cáo ghi phiên bản Codex và model như công cụ cho biết. Hết hạn mức giữa gói thì ghi giờ dừng; khi Owner nhắn làm tiếp, ghi giờ làm tiếp.
>
> Phần chung dưới đây áp dụng đầy đủ. Trong phần chung: `<bên>` = `codex`, `<ID>` = `CXR5`.

## Phụ lục T — Phần chung của mọi prompt (lượt 5)

Nối nguyên văn vào cuối cả ba file `prompt-<bên>.md` của lượt 5; bước chuẩn bị chỉ thay `{SHA}`. `<bên>` = thư mục kết quả của bên đó (`claude`, `codex`, `deepseek`), `<ID>` = `CLR5`, `CXR5`, `DSR5`. Đoạn này theo Phụ lục N (lượt 4).

> ## Phần chung
>
> ### Bước 0 — kiểm gói, trước khi đọc code
>
> Kiểm từng file bằng tên đầy đủ (`Test-Path` hoặc mở file); **không liệt kê, không tìm kiếm thư mục**:
>
> 1. `{GÓI}` phải là **đúng một chữ** trong A, B, C, D, E, F. Không phải → dừng, hỏi Owner.
> 2. `C:\workspace\deep-review-1-6-r5\<bên>\{GÓI}.md`:
>    - **chưa có** → làm mới;
>    - có, và **dòng đầu bắt đầu bằng `ĐANG LÀM`** → phiên trước bị cắt: **làm tiếp**. Đọc hết file và thư mục `<bên>\{GÓI}\`, giữ mọi phát hiện đã ghi, làm nốt; ghi rõ là phiên làm tiếp, từ đâu, bằng công cụ / model / mức nào;
>    - có, mà dòng đầu **không** bắt đầu bằng `ĐANG LÀM` → gói đã xong: dừng, hỏi Owner, không ghi đè.
> 3. Báo cáo lượt 5 các gói **trước** `{GÓI}` (thứ tự A → F) đã có đủ trong `…-r5\<bên>\` và không file nào còn dòng đầu `ĐANG LÀM`. Thiếu hay còn dở → dừng, báo Owner tên gói.
> 4. Đủ cả ba thì in đúng một dòng rồi làm tiếp, không chờ Owner: `Bắt đầu gói {GÓI} lượt 5 (<tên gói>) → <bên>\{GÓI}.md` (làm tiếp thì thêm `— làm tiếp phiên trước`).
>
> **Ghi báo cáo dần:** ngay sau bước 0, tạo `<bên>\{GÓI}.md` với dòng đầu `ĐANG LÀM — <bên> gói {GÓI} lượt 5, bắt đầu <giờ>` và mục 1 của báo cáo. Mỗi khi có dòng bảng R, kịch bản đã thử, phát hiện hay số đo thì **ghi ngay**. Chạy lệnh dài ở nền thì ghi vào file đang chờ gì trước khi chờ.
>
> **Cuối phiên**, khi báo cáo đủ các mục: đổi dòng đầu thành `XONG — <bên> gói {GÓI} lượt 5, <giờ xong>`. In đúng một dòng: `XONG gói {GÓI} lượt 5 → C:\workspace\deep-review-1-6-r5\<bên>\{GÓI}.md. Gói kế tiếp: <chữ kế tiếp> (mở phiên mới).` Gói F in: `XONG cả 6 gói lượt 5 của <bên>. Chờ Owner yêu cầu tổng hợp.`
>
> ### Dự án và lượt này
>
> Project-2C: app desktop Tauri 2 + React, SQLite chạy trong webview qua sql.js; Rust chỉ ghi file, giữ API key, gọi OpenCode. App chạy offline, một người dùng, dữ liệu hiện là **giả lập**. App hiện tên **Heritas L-CRM** (logo, icon, tiêu đề cửa sổ); tên mã Project-2C giữ ở mọi chỗ khác (`common\known.md` K39).
>
> - Phase 1–4: nhân sự / team, khách hàng N4–N1, KYC có cấu trúc, lịch hẹn và kết quả, hợp đồng, chỉ số và báo cáo, xuất Excel, backup.
> - Phase 5: AI copilot (`packages/ai`), gồm Mock trích xuất dữ kiện KYC.
> - Phase 6: hàng đợi thay dữ liệu S-2, Thùng rác + khôi phục, hộp Xóa KH 5f, Dọn sạch Thùng rác (TR-11–TR-13), trạng thái lưu (chỉ báo ở sidebar, nút Thử lại, đóng app chờ lần thay đang chạy).
>
> **Lượt 1–3** (14–21/10) tìm `DR6-01…134`. **Lượt 4** (`2e51e25`, 29–30/10, ba bên):
>
> - kiểm 37 dòng R1 và 32 dòng R2: 36 + 32 ĐÃ SỬA, 1 SỬA MỘT PHẦN (DR6-37), 0 HỒI QUY;
> - tìm 23 vấn đề mới `DR6-135…157`: 0 Medium, 17 Low, 6 Nit; thêm 1 mục KNOWN có bằng chứng mới (CLR4-F2);
> - kết luận CHƯA SẴN SÀNG, chỉ vì Owner đã quyết sửa hết trước G7.
>
> Sau lượt 4 có ba đợt mà chưa lượt nào đọc trọn. Lúc soạn kế hoạch, diff `2e51e25..571b8b0` ngoài tài liệu có 93 file, +5 761 / −1 533; số ở SHA `{SHA}` ghi trong `common\baseline.md`.
>
> - Đợt sửa lượt 4: 10 Issue #896…#905 (T-319…T-328), gồm đợt G5 `@5`.
> - Mục sổ [G7] sau đó: T-329…T-342, gồm Mock trích xuất viết lại thành `packages/ai/src/mock-extraction.ts` và `tools/auto-wait*` của pipeline `auto-issues`.
> - G7: ảnh hướng dẫn, probe hiệu năng, sửa Thùng rác (T-350), nghiệm thu L1–L3 (T-343…T-356).
>
> **Lượt 5 có hai phần ngang nhau, cả hai bắt buộc:**
>
> 1. **Kiểm phần đã sửa (trục R), hai bảng** (`common\known.md` phần 4, 5, cột "Gói kiểm"):
>    - **R1, theo mã:** DR6-135…157; DR6-37 (SỬA MỘT PHẦN ở lượt 4); KNOWN CLR4-F2 (sửa bằng tài liệu). Mỗi dòng: chạy lại tái hiện của lượt 4 (DR6-37: cả của lượt 1); gỡ tạm phần sửa (trên bản chép, hoặc patch gỡ ngay), xem test của PR sửa có đỏ; thử biến thể gần. **Kiểm theo mô tả của DR6 ở tổng hợp lượt 4 §6 và báo cáo gốc**, không chỉ theo danh sách việc trong Issue sửa: lượt 4, hai bên chấm DR6-37 ĐÃ SỬA theo danh sách của Issue mà sót vị trí đầu tiên báo cáo lượt 1 nêu. Mục sửa bằng tài liệu (CLR4-F2): dòng ghi có và khớp app.
>    - **R2, theo Issue:** T-329…T-356 (danh sách đủ ở `known.md`). Mỗi dòng: mục tiêu và test chấp nhận của Issue (`common\fixes.md`) đúng trên code; gỡ tạm ít nhất một phần sửa chính, xem test có đỏ; thử biến thể gần của các ghi chú Issue gom. Issue chỉ tài liệu / ảnh / nghiệm thu: dòng ghi có và khớp app / số đo / ảnh.
>
>    Kết luận: **ĐÃ SỬA** (đường lỗi cũ đã hết, có test đỏ khi gỡ phần sửa; biến thể còn hở ghi thành phát hiện riêng) · **SỬA MỘT PHẦN** (một phần của mô tả DR6, của Issue sửa hay của quyết định Owner chưa làm) · **CHƯA SỬA** · **HỒI QUY** (phần sửa làm hỏng chỗ trước đó đúng). Ba kết luận sau kèm một phát hiện có trường "Liên quan". Thêm:
>    - số đo không xấu hơn mốc Home PC sau #656 (`common\baseline.md`);
>    - refactor T-329 (tách Mock trích xuất) không đổi hành vi; `listeners.ts` của T-332 không làm hỏng việc của listener khác hay của lệnh.
> 2. **Tìm lỗi mới và edge case mới** trên **toàn bộ** phạm vi gói, không chỉ quanh chỗ đã sửa.
>    - Ưu tiên lỗi do chính các đợt sau lượt 4 gây ra: ở lượt 4, 9 / 23 vấn đề mới do đợt sửa trước nó.
>    - Xét trước code mới và hành vi mới: Mock trích xuất viết lại (`known.md` K42), G5 `@5` (K43), `flush()` và `listeners.ts`, ô chữ có ký tự vô hình (ô Giờ, Case size, ô ngày), bộ chặn ký hiệu `token-guard.ts`, tên liền dài và `DataTable`, ô chọn (K44), nút `aria-disabled`, Thùng rác ghi lịch Dự kiến đã qua (T-350), `storage.rs`, `tools/auto-wait*`.
>    - Rồi tới kịch bản / biên **chưa có trong báo cáo lượt 1–4**. Đọc `docs/reviews/raw/2026-10-15/`, `…/2026-10-17/`, `…/2026-10-21/`, `…/2026-10-31/` và bốn bản tổng hợp để biết đã thử gì.
>    - Báo cáo có mục **"Kịch bản mới đã thử"**: mỗi kịch bản một dòng, kể cả khi không thấy lỗi. Mỗi gói nên có ít nhất 5; gói F ít nhất 5 chuỗi nhiều bước qua nhiều gói.
>    - Chỗ các lượt trước ghi "đã xét, không thấy" vẫn đáng xét lại.
>
> Thông tin từng Issue / PR sửa (mục tiêu, test chấp nhận, phần PR ghi lệch / chưa làm, ghi chú sổ đã gom): `common\fixes.md`. Diff một PR: `git show <commit>` (bảng commit ở `plan.md` §L5.2 và `fixes.md`).
>
> ### Kế hoạch và phạm vi gói
>
> Kế hoạch đầy đủ: `C:\workspace\deep-review-1-6-r5\common\plan.md`. Lượt 5 ở §L5.1–§L5.11; mục nào §L5 không nói khác thì như lượt 4 (§L4); trục và thước mức ở §4; định dạng ở §L5.8 (và §L4.8, §L3.8, §L2.8). Phạm vi gói như lượt 1–4 (luật xếp gói của `tools/size-report-core.mjs`; đọc thêm chỗ code gói khác mà gói nối vào). Số dòng dưới là lúc soạn (`571b8b0`); số ở SHA ghim trong `common\baseline.md`:
>
> | Gói | Đường dẫn | SP / test lúc soạn | R1 | R2 | Trọng tâm mới (phần 2) |
> |---|---|---|---|---|---|
> | A. Lõi dữ liệu | `packages/domain/**`, `packages/db/**` | 8 748 / 15 805 | 135–137, 151 | T-332, 350 | Luật D7 cùng ngày (`unmovedMeetingsFrom`) qua xóa / sửa / khôi phục / nhập backup. `byName` giữ khóa mỗi tên: cùng thứ tự với collator trần trên tên thật và tên có chữ số toàn khổ / Ả Rập, thời gian sắp. `readsBackAsIs` (T-332), luật chung của `isLabel` và luật nhập backup (`valueOf` của `backup.ts`, mọi cột chữ): NUL, UTF-16 hỏng, U+FEFF đầu / giữa / cuối chữ; luật nhập 12. Mã KH của `TrashRow` (T-326, DR6-151). `appointment-counts.ts` của T-350 (lịch Dự kiến đã qua) ở mọi chỗ dùng: chỉ số, Thùng rác, Lịch hẹn. File do exe lượt 4 / exe ứng viên L3 xuất còn nhập được |
> | B. File và Rust | `apps/desktop/src-tauri/**` (gồm `capabilities/`, `tauri.conf.json`, `Cargo.toml`, `icons/`), `apps/desktop/src/data/**` trừ file AI | 2 457 / 5 600 | 138–140, 147 | T-332 | `flush()` lặp tới khi hết việc (T-321) với chuỗi lưu / thay / đóng app chồng nhau. `listeners.ts` dùng chung (T-332): listener ném, listener gỡ mình trong lúc gọi. `storage.rs`: seam ổ đầy, `backup_names` chỉ lấy file (T-320). CSP và `identifier` giữ (K39) |
> | C. AI | `packages/ai/**`; file AI của app (`ai-*`, `*-ai-*`, `*Ai.tsx`, `KycExtraction`, `KycIntelligence`, `KycWebSession`, `KycHistory`, `extraction-view`) | 6 580 / 8 202 | 137, 141–144 | T-329, 330, 332, 336, 339 | **Mock trích xuất viết lại** (`mock-extraction.ts`, K42): danh sách cho phép, giá trị cuối về KH, câu không chủ ngữ, khúc không chữ, dấu đầu dòng, Ly hôn / Góa / Ly thân, con đã mất, "bé". Thử trên câu thật (seed, dữ liệu tải, `docs/golden/ai-eval.md`) và câu tự dựng; thời gian trên ghi chú 36 000 ký tự. **G5 `@5`** (`phase-5-prompts.md` §14): NUL ở bước 0, "giới" sau "môi / ranh / biên / thế"; chặn đủ, không chặn nhầm. Lỗi AI giữ lại theo `generation` (T-322); `ai-jobs.ts` sau T-332 |
> | D. Màn nhập liệu | `packages/ui/**` (trừ `scripts/`), `apps/desktop/src/{shell,i18n}/**`, `routes/customers/**` (trừ file AI và Hợp đồng), `routes/team/**`, `routes/Screen.tsx`, `routes/{classes,money-view}.ts`, `routes/stage-badge.tsx`, file gốc `apps/desktop/src/*`, `apps/desktop/index.html` | 8 134 / 3 094 | 37, 145–149 | T-331, 332, 333, 337, 341, 342, 344, 352, 356 | **Bộ chặn ký hiệu** (`token-guard.ts`): máy trạng thái chuỗi / template / comment / JSX / kiểu generic / CRLF; tìm cả bỏ sót lẫn báo nhầm trên code thật. Khóa i18n "{trường}: {giá trị}" của thẻ Dữ kiện KYC. `Choices` theo `.choice` của mockup (K44). Tên liền dài ở `Dialog`, màn Team, `DataTable` trong khung cuộn (T-331). Nút `aria-disabled` của `Button` (T-337): Tab, Enter, trình đọc màn hình. Dải lưu và hộp đóng app sau một lần lưu khác (T-321) |
> | E. Lịch hẹn, chỉ số, quản lý | `routes/{appointments,overview,reports}/**`, `routes/{Overview,Settings*,RestoreDialog,FilterBar,ConfirmWordDialog}.tsx` (trừ `SettingsAi.tsx`), `routes/{trash-view,period-labels,applied-filter}.ts`, Hợp đồng (`routes/customers/{CustomerPolicies,PolicyDialogs,policy-form}.*`) | 8 272 / 4 700 | 37, 148, 150–154 | T-331, 332, 337, 350, 353 | Ô có ký tự vô hình: Case size, ô Giờ, `pending` của ô ngày (T-326, T-332, T-337). Tên nút khôi phục ở Thùng rác (K41 Q3). Hộp xác nhận lúc chạy: focus, `aria-disabled`, câu "Đang …" (`ConfirmWordDialog`, Nhập backup). Thùng rác ghi lịch Dự kiến đã qua (T-350): nhãn khớp nghĩa thường ở 6a, Thùng rác, chỉ số. So sánh team, Báo cáo với tên dài. NT-LH-19 / 28 (K46) |
> | F. Xuyên gói, bloat / hiệu năng, công cụ | `tools/**`, `e2e/**`, `.github/**`, `.githooks/**`, `.claude/**`, `packages/ui/scripts/`, `apps/desktop/vite.config.ts`, file gốc repo (gồm `eslint.config.js`, `.dependency-cruiser.cjs`); **luồng xuyên gói; toàn codebase cho bloat và hiệu năng** | 4 886 / 18 427 | 136 (đo), 155–157, CLR4-F2; **R1 gộp đủ 25 dòng** | T-333, 334, 335, 336, 338, 339, 340, 342, 343, 345–349, 351, 352, 354, 355; **R2 gộp đủ mọi dòng** | Công cụ đổi: `tools/auto-wait*` (đọc trạng thái CI, chờ, lỗi mạng / `gh`; K45), `review-hint-core`, `pr-status`, `notes-core` (glob, `globMeetsFolder`), `size-report` (asset của bản dựng), test của `pr-core`, bộ kiểm ảnh hướng dẫn, probe hiệu năng (T-345…T-347), luật `dependency-cruiser` cho test-support. Chuỗi nhiều bước, vd.: ghi chú KYC dài → AI trích xuất (Mock) → xác nhận → phân tích → xóa KH → Thùng rác → khôi phục; lịch Dự kiến đã qua → xóa → Thùng rác → khôi phục → chỉ số; lưu lỗi → Thử lại → Nhập backup → đóng app giữa lần thay; xuất ở exe lượt 4 (`2e51e25`) → nhập ở exe SHA ghim. Bloat / bundle / exe so lượt 4 và G7; kết luận SẴN SÀNG / CHƯA SẴN SÀNG |
>
> ### Đọc trước
>
> - Như lượt 1–4: `CLAUDE.md` (gốc + của package trong gói), `CONTEXT.md`, `docs/design/phase-6-hoan-thien.md` (§4: S-2, Thùng rác TR-1…TR-13 và D1–D13; §5 ngưỡng).
> - Spec / golden / mockup theo gói:
>   - A: `phase-3-du-lieu.md` §4, §6, `phase-4-chi-so.md`, `docs/golden/{chi-so,kh-theo-nhom,kyc,lich-hen}.md`, ADR-0007, ADR-0008;
>   - B: ADR-0016, ADR-0009 phụ lục D-1, spec Phase 6 §4.1;
>   - C: `phase-5-ai.md` (gồm §6.1, §7, §10 Mock trích xuất), `phase-5-prompts.md` (gồm §11–§14), `docs/golden/ai-eval.md`, ADR-0009;
>   - D / E: `docs/design/mockups/` (gồm `index.html`, `forms.css` `.choice`, `trash.html`, `settings-data.html`), spec Phase 3 / 4 / 6, ADR-0013, `docs/testing/nghiem-thu-v1.md` ("Các lượt thử", "Lệch mockup đã biết");
>   - F: tất cả khi cần, `docs/metrics/phase-6.md`, `e2e/perf/README.md`, `.claude/skills/auto-issues/SKILL.md` (để hiểu `tools/auto-wait*`).
> - Thêm cho lượt 5: tổng hợp lượt 4 `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` (§3 bảng R, §6 mô tả DR6-135…157, §7 số đo, §8.4 KNOWN, §9 quyết định Owner, §10.1), tổng hợp lượt 1–3, `common\known.md`, `common\fixes.md`, `common\baseline.md`.
> - **Spec, golden, mockup đã duyệt là nguồn đúng**: không đề xuất sửa chúng cho khớp code; chỗ chúng mâu thuẫn nhau thì báo là phát hiện trục C.
>
> ### Quy tắc chung
>
> 1. **Chỉ đọc và chạy lệnh: không sửa file trong repo, không sửa lỗi, không commit, không viết code sản phẩm.**
>    - Muốn thử "phá code" (đột biến, gỡ phần sửa) thì chép file vào thư mục kết quả của mình rồi chạy bản chép. Nếu buộc phải patch trong repo thì gỡ ngay sau khi chạy và kiểm lại bằng `git status` / sha256.
>    - **Trong bản chép repo không chạy `pnpm`, kể cả `pnpm exec`**: dùng junction sẵn có, gọi thẳng `node node_modules/<gói>/<cli>`.
>    - Cuối phiên `git status --short` của repo phải như đầu phiên (thư mục build / cache bị ignore thì không sao).
> 2. **Không gọi dịch vụ AI của sản phẩm:** không `pnpm eval:ai` / `node tools/eval-ai.mjs`, không bấm "Kiểm tra kết nối" bằng key thật, không đọc / in key trong Windows Credential Manager (`cmdkey`…), không mở chatgpt.com. Dùng adapter Mock, `fetch` / HTTP giả, hoặc server HTTP local tự dựng trong thư mục của mình. **Mọi probe trình duyệt chặn mạng ngoài `127.0.0.1` và thay `window.open` ngay từ lần chạy đầu.**
> 3. `pnpm e2e` dùng cổng cố định 4173: không chạy cùng lúc với bên khác; báo cổng bận thì chờ, **không** dùng `PW_REUSE=1`. Kết quả cổng ở SHA ghim đã có ở `common\baseline.md`, không bắt buộc chạy lại toàn bộ. Số bundle lấy ở `baseline.md`; tự `pnpm build:web` thì không đặt biến môi trường riêng (vd. `VITE_DEMO_ANCHOR`), hoặc ghi rõ đã đặt gì.
> 4. Môi trường Windows: `pnpm` lỗi trong shell hiện tại thì chạy qua `powershell -NoProfile -Command "pnpm …"`. Repo cần Node ≥ 24 (Home PC: `C:\Program Files\nodejs\node.exe`); shell có `node` cũ hơn trong PATH thì mỗi lệnh chạy `node`, `pnpm`, vitest hay Playwright đặt `C:\Program Files\nodejs` lên đầu PATH ngay trong lệnh đó (tiến trình con lấy `node` theo PATH). Không dùng `python3` (stub, có thể treo). Script tạm viết bằng `node` (`.mjs` trong thư mục của mình). Probe PowerShell **không dùng hai biến chỉ khác hoa / thường** (PowerShell coi là một).
> 5. Mục có trong `common\known.md` gắn `KNOWN`, chỉ nêu khi có bằng chứng mới: sổ ACCEPTED (OPEN rỗng ở SHA ghim), quyết định Owner K1–K47, "Lệch mockup đã biết", các mục KNOWN của phần 4. Dòng của bảng R1 / R2 chỉ ghi ở bảng R, không ghi lại thành phát hiện; phần sửa còn thiếu / hồi quy thì ghi phát hiện mới, "Liên quan: DR6-xx" hay "Liên quan: T-xxx". DR6 đã sửa ở lượt 1–4 hỏng lại → phát hiện mới, "Liên quan: DR6-xx".
> 6. **Kết luận về màn** dựng probe qua lớp dữ liệu của app (`apps/desktop/src/data`: `openAppData`, `tables`), hoặc chạy trên bản build web bằng Playwright, hoặc trên exe qua cổng debug. Không gọi thẳng lệnh `db` / chèn SQL thô; probe `db` thô chỉ để kết luận về lệnh. Không có môi trường DOM thì dựng bản build, không dừng ở PLAUSIBLE. Dòng R về màn cũng vậy: không kết luận bằng đọc code.
>
> ### Cách tìm
>
> - Đọc sâu **từng file** trong phạm vi gói (phần diff `2e51e25..{SHA}` đọc kỹ nhất). Đi qua **mọi trục**: R kiểm phần đã sửa · E edge case · C đúng hợp đồng / spec / mockup / nhãn UI theo nghĩa thường · D dữ liệu · G guardrail AI · S an toàn ở ranh giới · P hiệu năng · B bloat · T chất lượng test · A trợ năng / i18n (định nghĩa ở `plan.md` §4.1, §L2.4). Trục không có gì thì ghi "đã xét, không thấy" **kèm đã chạy / đọc gì**.
> - **Chạy thử thay vì lập luận từ spec** ở mọi chỗ chạy được. Ưu tiên **kịch bản nhiều bước qua nhiều gói**: các lỗi Medium của lượt 1, 2 và của review Phase 5 đều chỉ lộ khi dựng chuỗi (xóa → đổi → khôi phục; bàn giao → ghi kết quả → hẹn tiếp → chỉ số; ghi bù cuộc gặp trước ngày tạo KH; dán lại chính tin nhắn của app; khôi phục backup cùng DB giữa lúc AI chạy). Đừng báo lại chính các ca đó (đã sửa, nằm ở bảng R hay KNOWN): dùng chúng làm mẫu để nghĩ ca mới.
> - **Bloat và Hiệu năng là hai mục riêng bắt buộc** (kể cả khi không có phát hiện), mỗi mục một bảng: đã chạy / đo gì, trên dữ liệu nào, số, ID phát hiện. Công cụ như lượt 1–4 (`tsc --noUnusedLocals --noUnusedParameters`, `rg`, `pnpm codemap`, `pnpm lint:deps`, `pnpm build:web`…).
> - Hiệu năng: **mọi phát hiện P phải có số đo** trên dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (sinh lại ở SHA ghim; hash ở `common\baseline.md`; dùng trong Node qua `importBackup` của `@p2c/db`, trong app qua Cài đặt → Dữ liệu → Nhập backup). So với ngưỡng `docs/metrics/phase-6.md` (gồm Dọn sạch ≤ 500 ms) và với mốc Home PC (`plan.md` §L5.6: mốc sau #656, G7, lượt 4 cùng máy; luật nhiễu: quá 20 % **và** quá 10 ms). Ghi máy, bản Node và việc gì đang chạy song song. Đo trên exe: chép `common\exe\project2c.exe` vào thư mục của mình, cổng debug khác 9222, theo `e2e/perf/README.md`; không đo khi bên khác đang đo.
> - **Không cài công cụ mới** (`knip`, `jscpd`, `cargo-bloat`, visualizer… là G4); thấy cần thì ghi đề xuất.
> - Không bình luận phong cách / đặt tên trừ khi gây lỗi. Không đặt chỉ tiêu số lượng phát hiện; không nâng mức cho nổi.
>
> ### Khuôn phát hiện
>
> ```
> ID: <ID>-<gói><số>   (vd. <ID>-A3)
> Mức: Critical | High | Medium | Low | Nit
> Trục: R | E | C | D | G | S | P | B | T | A
> Vị trí: path:dòng ({SHA})
> Tình trạng: CONFIRMED | PLAUSIBLE | KNOWN
> Liên quan: DR6-xx / T-xxx (nếu có) · mới do đợt sửa sau lượt 4 (PR #…) | có từ trước, lượt 1–4 bỏ sót
> Kịch bản: số dòng ở mục "Kịch bản mới đã thử" (nếu có)
> Mô tả: một-hai câu
> Tái hiện / bằng chứng: lệnh + kết quả, hoặc probe / test tạm (nguồn ở phụ lục)
> Ảnh hưởng: ai / khi nào gặp
> Đề xuất: hướng sửa ngắn; cỡ ước lượng (≤ 400 dòng SP?)
> ```
>
> - **Thước mức** (như lượt 1–4): Critical = mất dữ liệu đã lưu, hỏng file DB, lộ API key, chạy được code lạ — ở thao tác bình thường. High = thao tác bình thường làm dữ liệu sai lặng lẽ (lan sang chỉ số / báo cáo / backup mà người dùng không nhận ra) hoặc chặn hẳn việc chính không có đường vòng. Medium = thao tác bình thường dẫn tới dữ liệu sai / không đảo ngược được hoặc chặn việc chính (có đường vòng); thao tác chính vượt ngưỡng hiệu năng đã chốt. Low = cần điều kiện hiếm (file sửa tay, output suy biến, server bất thường, thao tác UI không cho), chỉ sai hiển thị, test hở, bloat có chi phí đo được. Nit = chữ, dọn dẹp, bloat không đo được chi phí.
> - **Bằng chứng phải thật.** Mỗi `path:dòng` phải đúng với file ở SHA ghim (đọc lại trước khi ghi). `CONFIRMED` chỉ khi đã chạy lệnh / probe và dán lệnh + trích kết quả thật; chưa chạy thì `PLAUSIBLE` và nói đã đọc gì. Không bịa số đo, tên hàm, tên test hay kết quả lệnh.
>
> ### Báo cáo
>
> File `C:\workspace\deep-review-1-6-r5\<bên>\<gói>.md`, tiếng Việt (thuật ngữ ngành giữ tiếng Anh như repo; không chen từ của ngôn ngữ khác), gồm theo thứ tự:
>
> 1. Bên, gói, SHA đầu phiên, `git status --short` đầu phiên, giờ bắt đầu, công cụ / model / mức suy luận.
> 2. **Bảng R1** mọi dòng mà gói kiểm, và **bảng R2** mọi Issue mà gói kiểm, cùng cột: `| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |`.
> 3. Phạm vi đã đọc (file, dòng; phần diff `2e51e25..{SHA}` của gói).
> 4. **Kịch bản mới đã thử**: `| # | Kịch bản | Kết quả | ID |`.
> 5. Phát hiện mới theo khuôn trên.
> 6. Mục **Bloat** và mục **Hiệu năng** (bảng số, so mốc sau #656, G7 và lượt 4).
> 7. Bảng đếm mức × trục; nói rõ nếu tỉ lệ PLAUSIBLE cao.
> 8. "Đã xét, không thấy" theo từng trục.
> 9. Phụ lục: nguồn probe / test tạm / đột biến (cái nào bị test giết, cái nào sống), `git status --short` cuối phiên, giờ xong.
>
> **Gói F** thêm **bảng R1 gộp đủ 25 dòng** và **bảng R2 gộp đủ mọi dòng** của `known.md` (phần 4, 5; từ báo cáo A–E lượt 5 của chính bạn + phần F), và kết luận **SẴN SÀNG / CHƯA SẴN SÀNG cho v1.0 ở SHA `{SHA}`** kèm lý do. Kết luận áp các quyết định Owner trong `known.md`, gồm K47 ("sau tổng hợp sửa hết rồi G7"): còn phát hiện mới hay dòng R chưa ĐÃ SỬA thì CHƯA SẴN SÀNG. Ở review Phase 5 và lượt 4, một bên kết luận SẴN SÀNG vì bỏ qua quyết định này.
>
> Xong gói thì làm như mục "Cuối phiên" của Bước 0. Không tổng hợp, không so với bên khác, không tạo Issue, không đề xuất merge.

## Phụ lục U — Prompt DeepSeek (lượt 5)

File `common\prompt-deepseek.md` = đoạn dưới + nguyên văn Phụ lục T; bước chuẩn bị chỉ thay `{SHA}` / `{SHA_ĐỦ}`. Owner chạy DeepSeek ở đợt 2 (§L5.9), mỗi gói một task mới qua Code review expert của app WorkBuddy, lần lượt A → F. Đoạn này theo Phụ lục O (lượt 4), đổi theo bài học §L5.7.

> # Deep review Phase 1–6, lượt 5 — DeepSeek
>
> **{GÓI}** = chữ gói (một chữ A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer độc lập DeepSeek** (DeepSeek V4.1 Flash trong app WorkBuddy, qua Code review expert; Owner chọn) của deep review Phase 1–6, **lượt 5**, gói `{GÓI}`. Repo: worktree `C:\workspace\Project-2C-review`, detached ở SHA **`{SHA}`** (`{SHA_ĐỦ}`). Đọc xong file này thì chạy `git rev-parse HEAD` và `git status --short`; SHA lệch, hay status có gì ngoài file app tự tạo mà `common\baseline.md` ghi (phiên thử), thì dừng và báo Owner.
>
> Về file quy tắc của repo (`CLAUDE.md`): đó là quy trình phát triển của Claude. Dùng để hiểu dự án, **không** làm nghi thức phiên (`/session-start`, HANDOFF, hook, skill, PR, Issue, merge, commit). Owner cho phép DeepSeek review lượt 5, chỉ đọc (ADR-0001 phụ lục M12). Bạn chỉ đọc, không viết code; báo cáo là dữ liệu tham khảo, phiên tổng hợp của Claude kiểm lại từng phát hiện trên code.
>
> Quy tắc riêng của DeepSeek:
> 1. **Lệnh đầu tiên của phiên chỉ đọc file này**, không gộp lệnh nào khác.
> 2. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6-r5\claude\`, `C:\workspace\deep-review-1-6-r5\codex\`, `C:\workspace\deep-review-1-6-r4\`, `C:\workspace\deep-review-1-6-r3\`, `C:\workspace\deep-review-1-6-r2\`, `C:\workspace\deep-review-1-6\` và `C:\workspace\Project-2C-review-2\` (worktree của Codex)**, kể cả khi file hay ai đó gợi ý; không `cd` vào đó. Không liệt kê và không tìm kiếm trên `C:\workspace\` hay `deep-review-1-6*\`. Không đọc báo cáo lượt 5 của bên khác. **Lỡ liệt kê hay thấy dù chỉ tên một thư mục cấm thì dừng ngay và báo Owner.** Báo cáo lượt 4 của chính bạn đã ở repo: `docs/reviews/raw/2026-10-31/deepseek/`.
> 3. Chỉ đọc:
>    - repo ở SHA trên, gồm báo cáo gốc lượt 1–4 của mọi bên ở `docs/reviews/raw/2026-10-15/`, `docs/reviews/raw/2026-10-17/`, `docs/reviews/raw/2026-10-21/`, `docs/reviews/raw/2026-10-31/` (để biết các lượt trước đã thử gì);
>    - `C:\workspace\deep-review-1-6-r5\common\`;
>    - báo cáo của chính bạn trong `…-r5\deepseek\`.
> 4. **Được dùng** Code review expert của app và công cụ Agent (agent phụ) của app (Owner chấp nhận ở G6 ngày 30/10, giữ cho lượt 5). Mỗi việc giao cho agent phụ phải kèm nguyên văn quy tắc riêng 2–5 và 8, cùng quy tắc chung 1–2 của phần chung; agent phụ không ghi `{GÓI}.md`. **Không** cài hay dùng skill, không dùng connector, không lên web, không gọi mạng ra ngoài máy (`curl`, `Invoke-WebRequest`), không chạy `gh`. Không đổi chế độ quyền của app, không đọc hay sửa thư mục dữ liệu của app (`~/.workbuddy*`), không đổi quyền file (`icacls`, `Set-Acl`, `takeown`), không chạy `common\dot2.mjs`. Không đọc file đăng nhập hay dữ liệu của Claude / Codex (`~/.codex`, `~/.claude*`, `%APPDATA%\Claude`, `%LOCALAPPDATA%\OpenAI`, `%TEMP%\claude`), Windows Credential Manager (`cmdkey`, `vaultcmd`, mọi API đọc thông tin đăng nhập). Lệnh hay công cụ bị từ chối thì không thử cách khác để đọc cùng chỗ. Thông tin Issue / PR sửa có ở `common\fixes.md`.
>    - **Ghi:** file bạn tạo (báo cáo, probe, bản chép, log, script) chỉ nằm trong `…-r5\deepseek\` (quy tắc riêng 5). Không ghi gì vào `…-r5\common\`, `…-r5\claude\`, `…-r5\codex\`; không sửa file được theo dõi, trừ phần vá dưới. Ngoài `deepseek\` chỉ có:
>      - những gì lệnh build, test hay trình duyệt tự ghi: thư mục build / cache bị ignore trong worktree (vd. `apps\desktop\dist`, `node_modules\.vite`) và thư mục tạm của hệ thống;
>      - file app tự tạo trong worktree mà `common\baseline.md` ghi (quy tắc riêng 5);
>      - phần vá rồi trả nguyên byte theo quy tắc chung 1.
> 5. Ghi báo cáo vào `C:\workspace\deep-review-1-6-r5\deepseek\{GÓI}.md`, probe / bản chép / log vào `…-r5\deepseek\{GÓI}\`. Cuối phiên `git status --short` của repo như đầu phiên: rỗng, hoặc chỉ có file app tự tạo mà `common\baseline.md` ghi.
> 6. Gói F được đọc `…-r5\deepseek\A…E.md`. Không tổng hợp với báo cáo nào khác, không tạo Issue, không đề xuất merge.
> 7. Mục 1 của báo cáo ghi app WorkBuddy (bản theo `common\baseline.md`), expert, model, context, mức suy luận và bản Node đã dùng.
> 8. **Node và Playwright:**
>    - shell của app có Node 22 trong PATH, mà repo cần Node ≥ 24 (lượt 4: 4 ca của `mock-adapter.test.ts` đỏ giả, một số đo không so được với mốc). Mọi lệnh `node` gọi bằng `"C:\Program Files\nodejs\node.exe"`, kể cả khi chạy `vitest`, `eslint`, `tsc`, Playwright qua `node node_modules/<gói>/<cli>`. Ngoại lệ duy nhất: `node --version` chạy ngay sau khi đặt PATH trong cùng lệnh (gạch đầu dưới), để kiểm PATH. Đầu phiên chạy `"C:\Program Files\nodejs\node.exe" --version` và ghi vào mục 1; dưới 24 thì dừng, báo Owner;
>    - gọi `node` bằng đường dẫn đủ chưa đủ: tiến trình con lấy `node` theo PATH, tức Node 22 (shim `node_modules\.bin\*.cmd`, `webServer` của Playwright là `node e2e/serve.mjs`, script mà `pnpm` chạy). Vì vậy **mọi lệnh shell chạy `node`, `pnpm`, vitest, Playwright hay công cụ trong `node_modules` đặt `C:\Program Files\nodejs` lên đầu PATH ngay trong lệnh đó**, kể cả khi lệnh trước đã đặt: PowerShell `$env:Path = 'C:\Program Files\nodejs;' + $env:Path; …`, Git Bash `export PATH="/c/Program Files/nodejs:$PATH"; …`. Lệnh đầu tiên có đặt PATH in thêm `node --version` (phải ≥ 24) và ghi vào mục 1;
>    - Playwright luôn có `--output C:\workspace\deep-review-1-6-r5\deepseek\{GÓI}\pw` (shim xóa file của app chặn ghi `test-results\` khi quá 50 file).
> 9. Bài học của chính DeepSeek ở review Phase 5 và lượt 4 (`docs/reviews/2026-10-10-danh-gia-deepseek-muse.md` §3.1, §6, §7; tổng hợp lượt 4 §2.2):
>    - lỗi Medium của các lượt trước đều cần **chuỗi nhiều bước qua nhiều gói**. Phần 2 dành phần lớn thời gian cho chuỗi; kết luận ở F phải nêu đã thử những chuỗi nào;
>    - kết luận ở F áp quyết định Owner trong `known.md` (K47: "sau tổng hợp sửa hết rồi G7"): ở review Phase 5 và lượt 4, DeepSeek kết luận SẴN SÀNG sai vì bỏ qua quyết định này;
>    - dòng R1 kiểm theo mô tả DR6 ở tổng hợp lượt 4 §6 và báo cáo gốc, không chỉ theo danh sách việc của Issue (lượt 4 sót phần còn của DR6-37);
>    - kết luận về màn và dòng R về màn chạy trên bản build web bằng Playwright hoặc trên exe (quy tắc chung 6). Lượt 4 kết luận DR6-118 bằng đọc code;
>    - đọc golden / spec liên quan trước khi đề xuất, không đề xuất sửa golden; không khẳng định điều không có căn cứ; không chạy được thì ghi PLAUSIBLE;
>    - bước "gỡ tạm phần sửa" của bảng R là bắt buộc ở mọi dòng; dùng đột biến để tìm chỗ hở, không chỉ để khẳng định test tốt.
>
> Phần chung dưới đây áp dụng đầy đủ. Trong phần chung: `<bên>` = `deepseek`, `<ID>` = `DSR5`.

## Phụ lục V — App WorkBuddy và `dot2.mjs` của DeepSeek (lượt 5)

Như Phụ lục P (lượt 4), đổi theo mục dưới. Mục nào không nhắc thì giữ nguyên Phụ lục P: tài liệu của app, ranh giới tài khoản, hash 12 báo cáo, bảng luật cũ của OpenCode, rủi ro và chỗ còn hở đã chấp nhận ở G6.

**Cách chạy theo lượt 4 đã chạy thật** (tổng hợp lượt 4 đầu file, §10.1; `PROJECT-STATE.md` 30–31/10):

- App WorkBuddy bản quốc tế (lượt 4: v5.9.3); model `Deepseek-V4.1-Flash`, context 1M, Thinking effort Max. App không hiện số bản 1017; ghi tên đúng như app hiện.
- Mỗi gói một task qua **Code review expert** (lượt 4: `ex_uZzSAScSy7FZ`, cùng model). Phiên thử chạy qua expert luôn, nên không cần task kiểm ACL riêng cho expert như lượt 4.
- **Agent phụ:** cài đặt không tắt được công cụ Agent của app. Owner chấp nhận ở G6 ngày 30/10, chỉ cho lượt 4 ("Anh ko quan tâm DS gọi subagent hay không, chỉ cần chặn nó không đọc báo cáo claude và codex là được"). Lượt 5 giữ (đề xuất 8). Điều kiện: ACL chặn đọc (agent phụ chạy cùng tài khoản Windows) và hash 12 báo cáo. Dòng "Không agent phụ" của bảng "Cài đặt app" ở Phụ lục P vì vậy không áp.
- **Memory:** như Phụ lục P (xem và dọn ở bước 4, dọn lại ngay trước gói A).

**Gói và chi phí** (G4, Owner 04/11): thay mục "Gói và chi phí" của Phụ lục P.

- Dùng gói WorkBuddy Pro Owner đã đăng ký cho lượt 4 (một tháng; 2.000 credit/tháng, không cộng dồn; thêm credit tặng mỗi ngày có dùng app). **Không mua thêm credit.** Trần 25 USD và gói mua thêm 500 credit của lượt 4 không áp.
- Gói phải còn hạn tới hết gói F (đợt 2 bước 4). Hết hạn trước hay giữa đợt 2 thì dừng, hỏi Owner: gia hạn là chi phí mới (G4).
- Đo credit ở trang Usage trước phiên thử, sau phiên thử, sau từng gói và sau cùng. Điểm dừng sau mỗi gói A–E như §L5.9 đợt 2 bước 6. Hết credit giữa một gói thì dừng đợt 2, hỏi Owner.

**`dot2.mjs` lượt 5** (Issue T-358, tạo sau G1; đề xuất 9). PR docs của T-358 thêm vào cuối phụ lục này một khối code `js`: khối code của Phụ lục P, đổi theo năm điểm dưới (G1 ngày 04/11) và điểm 6 (Owner 04/11, comment trên #1028). T-359 (#1032) sửa khối đó ở điểm 6, cho mục nằm sâu bên trong. Bước chuẩn bị chép nguyên văn khối đó thành `common\dot2.mjs` (§L5.9 bước 4). Khối của Phụ lục P giữ nguyên, vì lượt 4 đã chạy bằng nó.

1. **Đường dẫn và tên lượt:** thư mục gốc `C:\workspace\deep-review-1-6-r5`; chú thích đầu file và thông báo ghi lượt 5.
2. **`deny` chặn thêm cả thư mục lượt 4** `C:\workspace\deep-review-1-6-r4`, như thư mục lượt 1–3. Lệnh vẫn kiểm hard link ra ngoài như Phụ lục P.
3. **`deny` xem chủ sở hữu từng mục trước khi chặn.** Lượt 4, luật `deny … (R)` lấy cả READ_CONTROL, nên với mục do tài khoản khác làm chủ (`CodexSandboxOffline`), tài khoản Owner không đọc hay sửa lại được ACL; `remove` dừng ở 16 mục.
   - Mục do tài khoản khác làm chủ thì không chặn. Lệnh ghi nó vào `dot2-acl.json` (đường dẫn, chủ sở hữu, "không chặn") và in ra.
   - Thư mục cần chặn cả mà có mục con của tài khoản khác thì chặn từng mục con của Owner, như cách Phụ lục P xử lý hard link. Thư mục của tài khoản khác thì `deny` vẫn đi vào, chặn mục con của Owner. Thư mục chặn cả mà bị tách như vậy thì link trong đó để ngỏ, như ở `.codex`. `scan` đọc các mục không chặn như mọi chỗ còn đọc được.
   - Lệnh đọc chủ sở hữu qua một hàm riêng (`foreignOwners`), để test thay được. Hàm đọc một lần cho mọi đường dẫn `deny` có thể chạm, bằng một Windows PowerShell (`GetAccessControl`). Mục không đọc được chủ sở hữu (thiếu READ_CONTROL, mà chủ của mục thì luôn đọc được) cũng coi là của tài khoản khác, ghi chủ sở hữu `?`.
   - `remove` không đụng tới mục không chặn.
4. **`remove` không dừng ở mục đầu không gỡ được.** Lệnh gỡ mọi mục gỡ được, kiểm đọc lại được, rồi in danh sách mọi mục chưa trả (đường dẫn, chủ sở hữu) và `STOP`. Đủ thì in `OK` và đổi tên `dot2-acl.json` như Phụ lục P.
5. **`scan` tìm mã của lượt 5:** `CLR5-`, `CXR5-`, và dòng đầu `ĐANG LÀM — claude|codex gói X lượt 5` / `XONG — claude|codex gói X lượt 5`.
6. **`remove` không tính mục không đọc được từ trước `deny`** (Owner 04/11/2026, comment trên #1028: giữ phần kiểm này của Issue; ngoài năm điểm G1 đã duyệt). Lượt 4, `.codex\.sandbox-bin` có ACL riêng của Codex, tài khoản Owner không liệt kê được, nên bước kiểm cuối của `remove` sẽ luôn báo nó chưa trả.
   - Trước luật đầu tiên, `deny` kiểm từng mục đọc được hay không, qua một hàm riêng (`readableBeforeDeny`, test thay được). Mục không đọc được vẫn bị chặn như Phụ lục P; `deny` in ra.
   - `remove` vẫn gỡ luật trên mục đó. Mục còn không đọc được thì in riêng kèm chủ sở hữu, không vào danh sách chưa trả, không làm `STOP`.
   - Vì sao không tính là an toàn: luật đặt trên thư mục không liệt kê được không lan xuống mục con (thử 04/11 trên thư mục tạm: `icacls` thoát 0, file con giữ nguyên ACL). Bên trong vì vậy không còn luật chặn nào mà `remove` không thấy.
   - Mục đọc được lúc `deny` mà không đọc được lúc `remove` vẫn là chưa trả. Lượt 4 có lẽ là trường hợp này: 9 file trong `.sandbox-bin` mang luật chặn thừa kế (`docs/reviews/raw/2026-10-31/common-baseline.md`, bước 7), tức lúc `deny` thư mục còn liệt kê được và luật đã lan xuống. Lặp lại như vậy thì `remove` vẫn `STOP` ở `.sandbox-bin`. Kết quả đó đúng, vì tài khoản Owner không gỡ được luật trên 9 file đó qua thư mục.
   - Thư mục không liệt kê được thì `deny` không đi vào (khối Phụ lục P dừng ở lỗi `EPERM`), nên không kiểm được link hay chủ sở hữu bên trong. Như trên, luật của `deny` cũng không lan vào đó.
   - **Mục nằm sâu bên trong** (T-359, ghi chú review #1030; Owner 04/11 chọn sửa script). `remove` gỡ luật trên chính các mục chặn, rồi quét sâu ba chỗ: `.codex`, `Project-2C-review-2`, và thư mục chặn cả bị tách quanh mục của tài khoản khác. Gặp thư mục không liệt kê được hay file không mở được ở đó, nó gỡ luật trên mục đó rồi kiểm lại. Trước T-359, mục vốn đã đóng ở đó (vd. `.codex\sessions\<thư mục ACL riêng>`) làm `remove` báo "still denied" và `STOP`, dù chưa từng có luật nào đặt lên nó.
     - Trước luật đầu tiên, `deny` quét đúng những chỗ đó. Bước quét dùng chung hàm của `remove` (`closedUnder`), gọi qua một hàm riêng mà test thay được (`closedBeforeDeny`), và bỏ qua những gì vùng tách để ngỏ.
     - Mọi thư mục không liệt kê được và file không mở được ở đó vào danh sách `unreadableBefore` của `dot2-acl.json`, trừ chính các mục chặn (đã có `readBefore`) và mục của tài khoản khác (`notDenied`). `deny` và `deny --dry-run` in chúng cùng dòng với mục `readBefore: false`.
     - `remove` xử lý chúng như mục `readBefore: false`: vẫn gỡ luật, mục còn đóng thì in riêng kèm chủ sở hữu, không tính là chưa trả, không làm `STOP`. Dòng `OK` đếm cả hai loại.
     - Thư mục chặn cả mà không bị tách (thư mục lượt 1–4, báo cáo, transcript) thì `remove` có file trạng thái không quét bên trong, nên `deny` cũng không quét ở đó.
     - Vì sao vẫn an toàn: luật của `deny` mà lan xuống mục nằm sâu (mục còn nhận ACL thừa kế từ thư mục cha) thì `remove` gỡ cùng lúc với luật trên thư mục cha. Bộ thử của T-359 kiểm sau `remove` không còn ACE chặn nào của tài khoản trên các mục đó.
     - Mục đọc được lúc `deny` mà không đọc được lúc `remove` vẫn là chưa trả, ở mọi độ sâu.
   - **Không có `dot2-acl.json`** (nhánh dự phòng của `remove`): không có dữ liệu để biết mục nào vốn không đọc được, nên nhánh này kiểm như trước T-359.
     - Thư mục chặn cả không bị tách (thư mục lượt 1–4, báo cáo, transcript): nhánh này quét sâu cả bên trong. Mục vốn không đọc được nằm sâu trong đó (vd. `-r3\claude\blind`) vẫn làm `STOP`.
     - `.codex`, `Project-2C-review-2` và thư mục chặn cả bị tách quanh mục của tài khoản khác: nhánh này gỡ luật trên mục con mà `deny` chặn cả, nhưng không quét lại bên trong mục đó. Mục vốn không đọc được nằm sâu trong đó vì vậy không làm `STOP`. Ví dụ: `.codex\sessions\<thư mục ACL riêng>`; `-r4\claude\<thư mục ACL riêng>` khi `-r4` bị tách quanh một mục của tài khoản khác trong `-r4\codex`. Điều này an toàn: `deny` không đặt luật nào sâu hơn mục chặn, còn luật thừa kế được gỡ cùng luật trên mục cha (gạch "Vì sao vẫn an toàn" ở trên).
     - Gặp `STOP` ở nhánh này, Claude kiểm từng mục trong danh sách bằng `icacls <mục>`: không có ACE chặn của tài khoản Owner nghĩa là mục vốn không đọc được, không phải luật chưa gỡ. `icacls` tra tên mục trong thư mục cha, nên thư mục cha phải đọc được; cha còn trong danh sách thì xét cha trước.
   - Chỉ đổi cách kiểm của `remove` và phần `deny` ghi lại để phục vụ phần kiểm đó; bộ ACL và phạm vi dọn giữ nguyên.

`dot2-acl.json` của lượt 5 có bốn danh sách:
- `entries`: mục bị chặn, mỗi mục `path`, `kind`, `owner` (tài khoản Owner), `readBefore` (đọc được trước `deny` hay không);
- `unreadableBefore`: mục không đọc được từ trước `deny`, nằm sâu bên trong chỗ `remove` quét (điểm 6, T-359), mỗi mục `path`, `kind`, `owner`;
- `notDenied`: mục không chặn vì của tài khoản khác ("không chặn"), mỗi mục `path`, `kind`, `owner`;
- `kept`: mục để ngỏ như Phụ lục P.

Test chấp nhận của T-358 (như T-314 #876, T-315 #880): cây giả trong `%TEMP%`, đường dẫn có dấu cách, `USERPROFILE` / `TEMP` / `APPDATA` / `LOCALAPPDATA` giả; `deny` chỉ chạy sau khi `--dry-run` không liệt kê gì ngoài cây giả.

- Mục "của tài khoản khác" dựng bằng cách thay hàm đọc chủ sở hữu: `deny` không chặn mục đó và ghi vào `dot2-acl.json`; `remove` vẫn trả mọi mục khác.
- Một mục không gỡ được (dựng giả) → `remove` gỡ hết phần còn lại, in đủ danh sách, `STOP`.
- Một mục không đọc được từ trước `deny` (dựng bằng ACL trên cây giả) → `remove` in riêng, không `STOP`.
- Năm lệnh còn chạy như Phụ lục P trên cây giả: `baseline`, `clean`, `deny`, `scan`, `remove`.
- `scan` bắt mã `CLR5-…` và dòng đầu `XONG` của Codex gói A lượt 5 trong một file sửa sau mốc.
- Chỉ khi Owner đồng ý: thêm một lần thử thật trên một mục do tài khoản khác làm chủ, Owner dựng bằng PowerShell quyền admin.

Đã thử ngày 04/11/2026 trên Home PC (T-358; lệnh, cây giả và kết quả ở thân PR). Cây giả nằm trong thư mục tạm của phiên, theo cách dựng ở trên.
- Khối dưới: 8 kịch bản đều đạt. Gồm: chạy đủ năm lệnh; `remove` không có file trạng thái; hard link ra ngoài trong `-r4`; mục của tài khoản khác, có và không có file trạng thái; mục không gỡ được; mục không đọc được từ trước `deny`; cây 60 000 file.
- Khối Phụ lục P trên cùng cây:
  - không chặn `-r4`, và `scan` không thấy mã lượt 5;
  - `remove` dừng ở mục đầu không gỡ được: 12 / 20 mục khác còn bị chặn;
  - `deny --dry-run` dừng ở lỗi `EPERM` khi có thư mục không liệt kê được.
- Cây 60 000 file, hai lần: `deny --dry-run` 13 s, `deny` 18–19 s, `remove` 8 s.
- Không thử thật trên mục do tài khoản khác làm chủ: Owner chưa đồng ý.

Thử lại ngày 04/11/2026 trên Home PC sau khi sửa điểm 6 (T-359; lệnh, cây giả và kết quả ở thân PR). Dùng bộ thử của T-358, thêm bốn kịch bản; mục đóng dựng bằng ACL thật như `.sandbox-bin`.
- Khối dưới, 12 kịch bản đều đạt:
  - **Trong `.codex\sessions`** (chặn cả), một thư mục và một file ACL riêng, một file có luật chặn Everyone mà ACL vẫn thừa kế. `deny --dry-run` và `deny` in cả ba, `unreadableBefore` có cả ba. Luật của `deny` lan xuống file thứ ba; `remove` gỡ luật đó, in riêng ba mục, in `OK`.
  - **Trong `deep-review-1-6-r4`** bị tách quanh mục của tài khoản khác, một thư mục và một file ACL riêng: `deny` in cả hai, `remove` in riêng, `OK`.
  - **Một file đóng sau `deny`** (luật chặn Everyone): `STOP`, chỉ liệt kê file đó; `dot2-acl.json` giữ tên.
  - **Không có `dot2-acl.json`:** `STOP` như trước, liệt kê thư mục ACL riêng nằm sâu trong `-r3`.
  - 8 kịch bản của T-358.
- Khối trước T-359 trên cùng cây: `remove` `STOP` ở ba kịch bản đầu, liệt kê cả mục vốn đã đóng.
- Cây 60 000 file, ba lần: `deny --dry-run` 15 s, `deny` 20–21 s, `remove` 8 s. Khối trước T-359, cùng ngày: 13 s, 19 s, 8 s.

**Ghi chú sau lượt 5** (đợt 2 ngày 05/11; tổng hợp T-362 #1042 §10.1; `docs/reviews/raw/2026-11-05/common-baseline.md` "Chuẩn bị đợt 2", "Bước 7"). Đợt 2 đóng đạt: `remove` gỡ 236 mục, `OK`, không cần quyền SYSTEM; hash 12 báo cáo không đổi.

- **Thư mục tạm của phiên Claude.** `dot2.mjs` chặn `%TEMP%\claude\<tên thư mục làm việc>`, mà Claude Code bản hiện tại để thư mục tạm của phiên (scratchpad, `tasks\*.output`) ở `%TEMP%\claude\<mã băm của thư mục làm việc>\<id phiên>\`. Lượt 5, phiên chuẩn bị đợt 2 chuyển tay `%TEMP%\claude\9baf74bac889a6ec\` (mã băm của `Project-2C-review`; 18 thư mục phiên, 95 file) sang `-r5\claude\_temp-9baf74bac889a6ec\` (Owner chọn 05/11), để `deny` chặn cùng `claude\`. Lần sau: `deny` chặn cả thư mục mã băm của hai worktree review.
- **Hard link giữa hai mục cùng bị chặn.** `walkTree` xét từng mục chặn riêng, nên coi một file có link ở hai thư mục `file-history` (phiên `review-1` và phiên rẽ nhánh của nó, cùng ở `Project-2C-review`) là link ra ngoài, và `deny --dry-run` in `STOP: nothing denied`. Lượt 5 thay link ở thư mục thứ hai bằng một bản chép (sha256 trùng, giữ giờ sửa). Lần sau: link có mọi đường dẫn nằm trong các mục chặn cả thì tính là bên trong.
- **Thư mục gốc `-r4` và `deep-review-1-6` liệt kê được**, khác chữ "→ bị từ chối" của §L5.9 bước 5. Đúng thiết kế điểm 3: hai thư mục có mục do tài khoản khác làm chủ (`-r4\common\dot2-unlock.log` của `NT AUTHORITY\SYSTEM`; 12 probe lượt 1 trong `deep-review-1-6\codex\F\` của `CodexSandboxOffline`), nên `deny` chặn từng mục con của Owner. Liệt kê chỉ thấy tên mục con; mọi mục con của Owner bị từ chối. Lần sau: §L5.9 bước 5 ghi kết quả dự kiến này.
- **Phiên thử không chạy qua Code review expert**, nên có thêm một task kiểm ACL qua expert như lượt 4 (3,59 credit; 30 / 30 lần thử mục bị chặn bị từ chối). Lần sau: tạo phiên thử qua expert ngay từ đầu.
- **`scan` dừng ở 2 transcript Claude ở checkout chính**, Owner chấp nhận 05/11: phiên chuẩn bị đợt 2 in dòng đầu 12 báo cáo khi kiểm điều kiện bắt đầu; phiên T-359 có chuỗi mẫu giả của bộ thử `dot2.mjs`. Lần sau: phiên hỗ trợ đợt 2 không in dòng đầu báo cáo; bộ thử dựng chuỗi mẫu bằng cách ghép, không viết nguyên văn.

```js
// Deep review round 5, wave 2 (plan §L5.9, Appendix V; round 4 ran the script of Appendix P). Run
// from PowerShell; baseline by the preparation session, the rest by the Owner:
//   node dot2.mjs baseline          preparation step 4: untracked / ignored entries of both review worktrees
//   node dot2.mjs clean             wave 2 step 1: delete what wave 1 left beyond that, and probe caches
//   node dot2.mjs deny [--dry-run]  wave 2 step 3: deny the Owner's account reads (ACL), then check
//   node dot2.mjs scan              wave 2 step 3: look for readable copies of Claude / Codex round 5 work
//   node dot2.mjs remove            wave 2 step 7: remove the denies, then check
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const COMMON = path.dirname(fileURLToPath(import.meta.url));
const R5 = path.dirname(COMMON);
const WS = path.dirname(R5);
const { USERPROFILE: HOME, TEMP, APPDATA, LOCALAPPDATA, USERNAME: USER, USERDOMAIN } = process.env;
const ME = `${USERDOMAIN}\\${USER}`;
const REVIEW = path.join(WS, 'Project-2C-review');
const WORKTREES = [REVIEW, path.join(WS, 'Project-2C-review-2')];
// Claude Code names a project folder after its cwd, every other character turned into '-'.
const PROJECT = REVIEW.replace(/[^A-Za-z0-9-]/g, '-');
// Data mixed with packages hard-linked into the checkouts' node_modules: denied child by child.
const SPLIT = [path.join(HOME, '.codex'), path.join(WS, 'Project-2C-review-2')];
const BASELINE = path.join(COMMON, 'dot2-baseline.json');
const STATE = path.join(COMMON, 'dot2-acl.json');
// Round 5 finding IDs and report header lines of Claude / Codex; plan.md and the prompts have neither.
const MARKER = /C[LX]R5-[A-F]\d|(?:ĐANG LÀM|XONG) — (?:claude|codex) gói [A-F] lượt 5/;

class Stop extends Error {}
const exists = (p) => fs.existsSync(p);
const list = (dir) => fs.readdirSync(dir, { withFileTypes: true });
const subdirs = (dir, re = /./) =>
  exists(dir) ? list(dir).filter((e) => e.isDirectory() && re.test(e.name)).map((e) => path.join(dir, e.name)) : [];
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const needBaseline = () => {
  if (!exists(BASELINE)) throw new Stop(`no ${BASELINE}: preparation step 4 runs baseline first`);
};
const writeJson = (p, v) => fs.writeFileSync(p, `${JSON.stringify(v, null, 2)}\n`);
const icacls = (...args) => execFileSync('icacls', [...args, '/Q'], { stdio: ['ignore', 'ignore', 'inherit'] });
const refused = (e) => e.code === 'EPERM' || e.code === 'EACCES';
// Opening is enough to prove access; large files are not read.
function canOpen(p, kind) {
  try {
    if (kind === 'tree') fs.readdirSync(p);
    else fs.closeSync(fs.openSync(p, 'r'));
    return true;
  } catch (e) {
    if (refused(e)) return false;
    throw e;
  }
}

// Owner of each path the account running this does not own: path -> account, or '?' when the owner
// does not read (no READ_CONTROL, so not the account's). Paths the account owns are left out. One
// Windows PowerShell for all paths; tests replace this function (Appendix V).
function foreignOwners(paths) {
  if (!paths.length) return new Map();
  const ps = [
    "$ProgressPreference = 'SilentlyContinue'",
    '[Console]::InputEncoding = [Console]::OutputEncoding = New-Object Text.UTF8Encoding $false',
    '$me = [Security.Principal.WindowsIdentity]::GetCurrent().User',
    'foreach ($p in [Console]::In.ReadToEnd().Split([char]0)) {',
    '  if (-not $p) { continue }',
    "  $q = '\\\\?\\' + $p",
    '  try {',
    "    $acl = if ([IO.Directory]::Exists($q)) { [IO.Directory]::GetAccessControl($q, 'Owner') } else { [IO.File]::GetAccessControl($q, 'Owner') }",
    '    $o = $acl.GetOwner([Security.Principal.SecurityIdentifier])',
    '    if ($o -eq $me) { continue }',
    '    try { $n = $o.Translate([Security.Principal.NTAccount]).Value } catch { $n = $o.Value }',
    "  } catch { $n = '?' }",
    '  [Console]::Out.Write("$p`t$n`n")',
    '}',
  ];
  const command = Buffer.from(ps.join('\n'), 'utf16le').toString('base64');
  const out = execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', command], {
    input: paths.join('\0'),
    encoding: 'utf8',
    maxBuffer: 2 ** 30,
    stdio: 'pipe',
  });
  return new Map(out.split('\n').filter(Boolean).map((l) => l.split('\t')));
}

// Whether the account reads an entry before deny touches it: remove does not count an entry that did
// not read before (round 4: .codex\.sandbox-bin, ACL of its own). Tests replace this function too.
function readableBeforeDeny(p, kind) {
  return canOpen(p, kind);
}

// What git does not track (untracked or ignored): each file and folder (trailing '/'), also inside an
// ignored folder (review #872). Not listed: node_modules, a folder holding one, what a link points at.
// held, when given, gets each such folder whose own node_modules kept it (review #878).
function leftovers(wt, held) {
  const others = (...extra) =>
    execFileSync('git', ['-C', wt, 'ls-files', '-z', '--others', '--exclude-standard', '--directory', ...extra], {
      encoding: 'utf8',
    }).split('\0');
  const found = new Set();
  // True when rel is or holds a node_modules.
  const add = (rel) => {
    if (/(^|\/)node_modules(\/|$)/.test(rel)) return true;
    if (!rel.endsWith('/')) {
      found.add(rel);
      return false;
    }
    let modules = false;
    for (const e of list(path.join(wt, rel))) {
      if (e.name === 'node_modules') held?.add(rel);
      modules = add(`${rel}${e.name}${e.isDirectory() ? '/' : ''}`) || modules;
    }
    if (!modules) found.add(rel);
    return modules;
  };
  for (const e of [...others(), ...others('--ignored')]) {
    // git walks into a junction: what it lists through a link stands for the link itself.
    const parts = e.split('/').filter(Boolean);
    const at = parts.findIndex((_, i) => fs.lstatSync(path.join(wt, ...parts.slice(0, i + 1))).isSymbolicLink());
    if (at >= 0) add(parts.slice(0, at + 1).join('/'));
    else if (e) add(e);
  }
  return [...found].sort();
}

function baseline() {
  if (exists(BASELINE)) throw new Stop(`${BASELINE} already exists`);
  const base = Object.fromEntries(WORKTREES.map((wt) => [wt, leftovers(wt)]));
  writeJson(BASELINE, base);
  for (const wt of WORKTREES) console.log(`${wt}: ${base[wt].length} untracked / ignored entries kept`);
}

function clean() {
  needBaseline();
  const base = readJson(BASELINE);
  const extras = (wt, held) => {
    const kept = new Set(base[wt]);
    return leftovers(wt, held).filter((e) => !kept.has(e));
  };
  const caches = [];
  for (const wt of WORKTREES) {
    const held = new Set();
    const doomed = extras(wt, held);
    const all = new Set(doomed);
    // Deepest first: a folder goes once empty; a link goes, not what it points at.
    for (const e of [...doomed].reverse()) {
      const p = path.join(wt, e);
      if (e.endsWith('/')) {
        if (!exists(p) || list(p).length) continue;
        fs.rmdirSync(p);
      } else fs.rmSync(p, { force: true });
      // One line for a new folder, not one for each file in it.
      if (!all.has(e.replace(/[^/]+\/?$/, ''))) console.log(`deleted ${p}`);
    }
    // A folder kept for its own node_modules, e.g. a probe with a package.json, stays: say so.
    for (const rel of held) console.log(`kept, holds node_modules: ${path.join(wt, rel)}`);
    // Vite / Vitest caches keep the names and results of the test files that ran, and transformed
    // probe code: Vite puts its cache by the nearest package.json, so the kept folders have one too.
    const pkgs = [wt, ...subdirs(path.join(wt, 'apps')), ...subdirs(path.join(wt, 'packages'))];
    for (const pkg of [...pkgs, ...[...held].map((rel) => path.join(wt, rel))])
      caches.push(path.join(pkg, 'node_modules', '.vite'), path.join(pkg, 'node_modules', '.vite-temp'));
  }
  // Transformed copies of probe code: Playwright cache and browser profiles, Vite SSR dumps, Codex artifacts.
  caches.push(...subdirs(TEMP).filter((d) => /^(playwright|codex-)/i.test(path.basename(d)) || exists(path.join(d, 'ssr'))));
  for (const p of caches) {
    if (!exists(p)) continue;
    fs.rmSync(p, { recursive: true, force: true });
    console.log(`deleted ${p}`);
  }
  for (const wt of WORKTREES) {
    const left = extras(wt);
    if (left.length) throw new Stop(`${wt} still has: ${left.join(', ')}`);
  }
  console.log('OK: both worktrees are back to dot2-baseline.json');
}

// Files under root that also have a link outside it, what another account owns under it (foreign:
// from foreignOwners) and every path walked. The walk does not follow junctions or symlinks, nor go
// into a folder the account cannot list: icacls cannot reach in there either.
function walkTree(root, foreign = new Map()) {
  const links = new Map();
  const paths = [];
  const others = [];
  let sample = null;
  const walk = (dir) => {
    let ents;
    try {
      ents = list(dir);
    } catch (e) {
      if (refused(e)) return;
      throw e;
    }
    for (const e of ents) {
      const p = path.join(dir, e.name);
      if (!e.isDirectory() && !e.isFile()) continue;
      paths.push(p);
      if (foreign.has(p)) others.push(p);
      if (e.isDirectory()) walk(p);
      else {
        sample ??= p;
        const st = fs.lstatSync(p, { bigint: true });
        if (st.nlink < 2n) continue;
        const key = `${st.dev}:${st.ino}`;
        const seen = links.get(key) ?? { p, nlink: st.nlink, n: 0n };
        seen.n += 1n;
        links.set(key, seen);
      }
    }
  };
  walk(root);
  return { sample, outside: [...links.values()].filter((l) => l.n < l.nlink).map((l) => l.p), others, paths };
}

const claudeDirs = () => subdirs(HOME, /^\.claude/);

// Denied whole: reports, transcripts, file copies and scratchpads of the other reviewers.
function treeTargets() {
  const out = [path.join(R5, 'claude'), path.join(R5, 'codex')];
  out.push(...['deep-review-1-6-r4', 'deep-review-1-6-r3', 'deep-review-1-6-r2', 'deep-review-1-6'].map((n) => path.join(WS, n)));
  for (const c of claudeDirs()) {
    const proj = path.join(c, 'projects', PROJECT);
    if (!exists(proj)) continue;
    out.push(proj);
    // file-history keeps a copy of each file a session wrote, in a folder named after the session.
    for (const id of new Set(list(proj).map((e) => e.name.replace(/\.jsonl$/, '')))) out.push(path.join(c, 'file-history', id));
  }
  out.push(path.join(TEMP, 'claude', PROJECT));
  return out.filter(exists);
}

const keptBySplit = (e) => e.isSymbolicLink() || e.name === 'node_modules' || e.name === '.git';

// Each folder the account cannot list and file it cannot open under dir, as { path, kind }. The walk
// goes into every other folder, not into links, nor in .codex and Project-2C-review-2 (split) into
// node_modules / .git. remove walks so for what is still denied; deny, before its first rule, for
// what does not read already (review #1030).
function closedUnder(dir, split) {
  const out = [];
  const walk = (d) => {
    for (const e of list(d)) {
      const p = path.join(d, e.name);
      if (split ? keptBySplit(e) : e.isSymbolicLink()) continue;
      if (e.isDirectory()) {
        if (canOpen(p, 'tree')) walk(p);
        else out.push({ path: p, kind: 'tree' });
      } else if (e.isFile() && !canOpen(p, 'file')) out.push({ path: p, kind: 'file' });
    }
  };
  walk(dir);
  return out;
}

// What does not read under dir before deny touches anything: remove does not count it either
// (Appendix V point 6, review #1030). Tests replace this function too.
function closedBeforeDeny(dir, split) {
  return closedUnder(dir, split);
}

// Where remove walks (closedUnder), as [dir, split]: in a tree target that deny split around another
// account's entries, and in .codex and Project-2C-review-2, deny went deeper (splitEntries).
function walkRoots(targets, entries) {
  const whole = new Set(entries.filter((e) => e.kind === 'tree').map((e) => e.path));
  const split = targets.filter((t) => !whole.has(t) && canOpen(t, 'tree')).map((t) => [t, false]);
  return [...split, ...SPLIT.filter(exists).map((s) => [s, true])];
}

// Deny each child of dir that has no outside link and nothing another account owns; go down into the
// others. Links stay readable; in .codex and Project-2C-review-2 (split) also node_modules, .git and
// hard-linked files. In a folder denied whole otherwise (a tree target) a hard link stays inside it.
// What another account owns is not denied: its owner keeps the ACL, deny could not be undone (Appendix V).
function splitEntries(dir, out, split) {
  for (const e of list(dir)) {
    const p = path.join(dir, e.name);
    const kind = e.isDirectory() ? 'tree' : 'file';
    if (split ? keptBySplit(e) : e.isSymbolicLink()) out.kept.push(p);
    else if (!e.isDirectory() && !e.isFile()) continue;
    else if (out.foreign.has(p)) {
      out.notDenied.push({ path: p, kind, owner: out.foreign.get(p) });
      if (kind === 'tree' && canOpen(p, 'tree')) splitEntries(p, out, split);
    } else if (kind === 'tree') {
      const { outside, others } = walkTree(p, out.foreign);
      if ((split && outside.length) || others.length) splitEntries(p, out, split);
      else out.entries.push({ path: p, kind });
    } else if (split && fs.lstatSync(p, { bigint: true }).nlink > 1n) out.kept.push(p);
    else out.entries.push({ path: p, kind });
  }
}

function deny(dryRun) {
  if (exists(STATE)) throw new Stop(`${STATE} exists: run remove first`);
  const targets = treeTargets();
  const splits = SPLIT.filter(exists);
  // The owner of every path deny may reach, in one lookup.
  const reach = [...targets, ...targets.flatMap((t) => walkTree(t).paths)];
  for (const s of splits)
    for (const e of list(s).filter((x) => !keptBySplit(x) && (x.isDirectory() || x.isFile()))) {
      const p = path.join(s, e.name);
      reach.push(p, ...(e.isDirectory() ? walkTree(p).paths : []));
    }
  const out = { entries: [], kept: [], notDenied: [], foreign: foreignOwners(reach) };
  const samples = new Map();
  const linked = [];
  for (const t of targets) {
    const { sample, outside, others } = walkTree(t, out.foreign);
    if (outside.length) linked.push(`${t}: ${outside.length} file(s) also linked outside it, e.g. ${outside[0]}`);
    if (out.foreign.has(t)) {
      out.notDenied.push({ path: t, kind: 'tree', owner: out.foreign.get(t) });
      if (canOpen(t, 'tree')) splitEntries(t, out, false);
    } else if (others.length) splitEntries(t, out, false);
    else {
      out.entries.push({ path: t, kind: 'tree' });
      if (sample) samples.set(t, sample);
    }
  }
  // A deny on a hard-linked file reaches all its links, e.g. the node_modules of the checkouts.
  if (linked.length) throw new Stop(`nothing denied:\n${linked.join('\n')}`);
  for (const t of splits) splitEntries(t, out, true);
  // Each entry's owner, and whether it read before deny, for remove (Appendix V).
  for (const e of out.entries) Object.assign(e, { owner: ME, readBefore: readableBeforeDeny(e.path, e.kind) });
  const before = out.entries.filter((e) => !e.readBefore);
  // Deeper, where remove walks: what does not read already is not counted either (review #1030).
  // The entries and what another account owns are listed above.
  const listed = new Set([...out.entries, ...out.notDenied].map((e) => e.path));
  const inside = walkRoots(targets, out.entries)
    .flatMap(([dir, split]) => closedBeforeDeny(dir, split))
    .filter((e) => !listed.has(e.path))
    .map((e) => ({ ...e, owner: out.foreign.get(e.path) ?? ME }));
  for (const e of out.entries) console.log(`${dryRun ? 'would deny' : 'deny'} ${e.kind} ${e.path}`);
  for (const e of [...before, ...inside]) console.log(`unreadable before deny, remove does not count it: ${e.path}`);
  for (const e of out.notDenied) console.log(`not denied, owned by ${e.owner}: ${e.path}`);
  for (const p of out.kept) console.log(`stays readable ${p}`);
  if (dryRun) return;
  const state = {
    user: USER,
    at: new Date().toISOString(),
    entries: [],
    unreadableBefore: inside,
    notDenied: out.notDenied,
    kept: out.kept,
  };
  writeJson(STATE, state);
  for (const e of out.entries) {
    icacls(e.path, '/deny', `${USER}:${e.kind === 'tree' ? '(OI)(CI)(R)' : '(R)'}`);
    state.entries.push(e);
    writeJson(STATE, state);
  }
  const open = out.entries.filter((e) => canOpen(e.path, e.kind) || (samples.has(e.path) && canOpen(samples.get(e.path), 'file')));
  if (open.length) throw new Stop(`still readable: ${open.map((e) => e.path).join(', ')}; run remove`);
  console.log(
    `OK: ${out.entries.length} entries denied (${before.length} unreadable before, ${inside.length} more inside), ` +
      `${out.notDenied.length} not denied (another account's), ${out.kept.length} left readable; state in ${STATE}`,
  );
}

function remove() {
  const state = exists(STATE) ? readJson(STATE) : null;
  if (!state) console.log(`no ${STATE}: removing from the standard targets and from what is still denied under them`);
  const entries = state?.entries ?? [];
  // What deny left to another account is left alone here too.
  const theirs = new Set((state?.notDenied ?? []).map((e) => e.path));
  const done = new Map();
  const undo = (p, kind) => {
    if (done.has(p) || theirs.has(p) || !exists(p)) return;
    done.set(p, kind);
    try {
      icacls(p, '/remove:d', USER);
    } catch {
      // Not the end (round 4 stopped here): icacls says why, the check below lists p (Appendix V).
    }
  };
  for (const e of [...entries].reverse()) undo(e.path, e.kind);
  // The standard targets too, in case the state file is missing or incomplete.
  for (const c of claudeDirs()) undo(path.join(c, 'projects', PROJECT), 'tree');
  const targets = treeTargets();
  for (const t of targets) undo(t, 'tree');
  // In .codex and Project-2C-review-2, and in a tree target that deny split around another account's
  // entries, deny went deeper (splitEntries): whatever there still does not read is undone, at any
  // depth, also without the state file (review #872).
  for (const [dir, split] of walkRoots(targets, entries))
    for (const e of closedUnder(dir, split)) undo(e.path, e.kind);
  const closed = [...done].filter(([p, kind]) => !canOpen(p, kind)).map(([p]) => p);
  const known = new Map(entries.map((e) => [e.path, e]));
  // Did not read before deny either: an entry, or deeper where remove walks (review #1030).
  const unread = [...entries.filter((e) => e.readBefore === false), ...(state?.unreadableBefore ?? [])];
  const before = new Map(unread.map((e) => [e.path, e]));
  const already = closed.filter((p) => before.has(p));
  for (const p of already) console.log(`unreadable before deny too, not counted: ${p} (owner ${before.get(p).owner})`);
  const left = closed.filter((p) => !before.has(p));
  if (left.length) {
    const unknown = left.filter((p) => !known.has(p));
    let found = new Map();
    try {
      found = foreignOwners(unknown);
    } catch {
      found = new Map(unknown.map((p) => [p, '?']));
    }
    const owner = (p) => known.get(p)?.owner ?? found.get(p) ?? ME;
    const lines = left.map((p) => `${p}  owner ${owner(p)}`);
    throw new Stop(`${left.length} of ${done.size} entries still denied (path, owner); ${STATE} kept:\n${lines.join('\n')}`);
  }
  if (state) fs.renameSync(STATE, path.join(COMMON, 'dot2-acl.removed.json'));
  const but = already.length ? ` but the ${already.length} above, which did not read before deny either` : '';
  console.log(`OK: denies removed from ${done.size} entries, all readable again${but}`);
}

function scan() {
  needBaseline();
  // Files older than the baseline (preparation, before wave 1) cannot hold round 5 work.
  const since = fs.statSync(BASELINE).mtimeMs;
  const roots = [
    ...subdirs(HOME, /^\.(claude|codex)/),
    path.join(APPDATA, 'Claude'),
    path.join(LOCALAPPDATA, 'Claude'),
    path.join(LOCALAPPDATA, 'OpenAI'),
    ...subdirs(path.join(LOCALAPPDATA, 'Packages'), /^(Claude|OpenAI)/i),
    TEMP,
    WS,
  ].filter(exists);
  const skipDirs = new Set(['.git', '.pnpm', 'target']);
  const notOpened = path.join(WS, 'Project-2'); // never opened (CLAUDE.md)
  const hits = [];
  const big = [];
  let read = 0;
  let closed = 0;
  const walk = (dir) => {
    let ents;
    try {
      ents = list(dir);
    } catch {
      closed++;
      return;
    }
    for (const e of ents) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!skipDirs.has(e.name) && p !== notOpened) walk(p);
        continue;
      }
      if (!e.isFile() || /^(\.credentials|auth\.json$)/.test(e.name)) continue;
      let buf;
      try {
        const st = fs.statSync(p);
        if (st.mtimeMs < since) continue;
        if (st.size > 64 * 2 ** 20) {
          big.push(p);
          continue;
        }
        buf = fs.readFileSync(p);
      } catch {
        closed++;
        continue;
      }
      read++;
      // UTF-8, and UTF-16LE at either byte alignment (app databases). Node 24.20 crashes on
      // toString('utf16le') of an odd-length view at an odd offset, so that view is cut to even length.
      const odd = buf.subarray(1, 1 + ((buf.length - 1) & ~1));
      const texts = [buf.toString('utf8'), buf.toString('utf16le'), odd.toString('utf16le')];
      if (texts.some((t) => MARKER.test(t))) hits.push(p);
    }
  };
  for (const r of roots) walk(r);
  console.log(`${read} files read; ${closed} folders / files not readable (the denied ones count here)`);
  for (const p of big) console.log(`not read (over 64 MB): ${p}`);
  // Accepted in Appendix P: the desktop app's session list (titles, recaps); the running app keeps it open.
  const appSessions = path.join(APPDATA, 'Claude', 'claude-code-sessions') + path.sep;
  for (const p of hits.filter((h) => h.startsWith(appSessions))) console.log(`accepted, write it in baseline.md: ${p}`);
  const open = hits.filter((h) => !h.startsWith(appSessions));
  if (open.length) throw new Stop(`round 5 IDs or report headers readable in:\n${open.join('\n')}`);
  console.log('OK: no readable copy of Claude / Codex round 5 work found');
}

const [cmd, flag] = process.argv.slice(2);
const commands = { baseline, clean, deny: () => deny(flag === '--dry-run'), scan, remove };
try {
  if (!commands[cmd]) throw new Stop('usage: node dot2.mjs baseline | clean | deny [--dry-run] | scan | remove');
  commands[cmd]();
} catch (e) {
  console.error(`STOP: ${e instanceof Stop ? e.message : e.stack}`);
  process.exit(1);
}
```

# Lượt 6

Kế hoạch lượt 6 (T-385 #1117), soạn 07/11/2026 trên Home PC, trước G7. ADR-0001 phụ lục M13. Mục nào không nói khác thì giữ như lượt 5 (§L5.1–§L5.11, Phụ lục Q–V), và qua đó như lượt 1–4.

**Lượt 6 là lượt deep review toàn bộ code cuối cùng trước G7, và đổi cách làm.** Owner chốt ngày 06–07/11 (§L6.11 mục 1–4):

- tên là **lượt 6** (06/11 Owner gọi "round 7"; 07/11: "Hãy ghi là lượt 6 cho đúng");
- ba bên: Claude Opus 5.5, Codex GPT Sol 6.1, một agent trong app WorkBuddy với model Owner chọn (Hy4 hoặc GLM 5.3);
- đổi cách làm theo bốn hướng (§L6.0): tiêu chí xong chốt trước khi chạy; sửa theo họ lỗi; chặn lỗi ngay ở PR sửa và đóng băng code; nhiều mẫu hẹp thay một mẫu rộng;
- không có bài thi chọn model WorkBuddy: Owner tự chọn.

Số đo trong phần này lấy ở `b3721f4` (`main` lúc soạn). Bước chuẩn bị đo lại ở SHA ghim. Prompt ghi `{SHA}`; bước chuẩn bị thay bằng SHA ghim (§L6.9 bước 4).

| Yêu cầu của #1117 | Mục |
|---|---|
| Test 1: tiêu chí chặn phát hành và hậu quả chốt trước, áp cả sổ ghi chú; không có bước "sửa hết" | §L6.1, §L6.10, K48 |
| Test 2: bảng R chỉ ở prompt Claude; Codex và WorkBuddy chỉ tìm lỗi mới | §L6.4, Phụ lục W, X, Y, Z |
| Test 3: bỏ chỉ tiêu "≥ 5 kịch bản" và bảng bloat / hiệu năng ở A–E; khuôn phát hiện có trường "Cùng mẫu" và "Chặn phát hành" | §L6.4, §L6.8, Phụ lục Y |
| Test 4: phiên theo chủ đề của Claude, gồm "rà gọn" diff `37a80b6..<SHA ghim>` | §L6.3, Phụ lục W, Y |
| Test 5: đóng băng code từ SHA ghim tới phát hành, phạm vi và ngoại lệ | §L6.1, K49 |
| Test 6: không có bài thi chọn model; model WorkBuddy theo lựa chọn của Owner | §L6.7 |
| Test 7: đề xuất ghi rõ Owner chọn gì, có ngày | §L6.11 |

## L6.0 Vì sao lượt 1–5 không ra hết

Phiên soạn đọc lại năm bản tổng hợp (06–07/11):

| Lượt | SHA ghim | Bên | Vấn đề mới | Medium | Do đợt sửa trước lượt | Code đổi từ lượt trước (ngoài `docs/**`, `*.md`) |
|---|---|---|---:|---:|---|---|
| 1 | `8855345` | Claude, Codex, Muse (hai máy) | 67 | 2 | — | — |
| 2 | `4217ed4` | Claude, Codex | 36 | 1 | 3 hồi quy, gồm Medium DR6-68 | 136 file, +8 260 / −835 |
| 3 | `119e2e4` | Claude, Codex | 31 | 0 | 0 hồi quy | 119 file, +7 742 / −1 050 |
| 4 | `2e51e25` | Claude, Codex, DeepSeek | 23 | 0 | 9 / 23 | 271 file, +14 631 / −3 399 |
| 5 | `37a80b6` | Claude, Codex, DeepSeek | 20 | 0 | 11 / 20 (9 hẳn, 2 một phần) | 93 file, +5 761 / −1 533 |
| 6 | ghim lúc chuẩn bị | Claude, Codex, WorkBuddy | | | | lúc soạn: 60 file, +2 252 / −236 |

Bốn nguyên nhân:

1. **Một lượt là một lần lấy mẫu, không quét hết.**
   - Lượt 1, cùng model Claude, cùng prompt, cùng SHA trên hai máy: chỉ 18 / 37 vấn đề của bản Home PC có ở bản laptop (tổng hợp lượt 1 §2.2).
   - Ba bên ít trùng nhau: lượt 4 không vấn đề nào cả ba cùng thấy; lượt 5 chỉ 2 / 20.
   - Ước theo độ trùng giữa hai bên (bắt – thả – bắt lại): lượt 4 có khoảng 37–40 vấn đề, tìm được 23; đúng là lượt 5 tìm thêm 9 vấn đề có từ trước. Ước này thô (các bên không độc lập, lỗi không dễ thấy như nhau, mẫu nhỏ) và thấp hơn thực tế. Chỉ dùng để xem xu hướng, không làm điều kiện dừng.
   - Mỗi phiên đọc vài nghìn dòng sản phẩm và test, làm thêm 50–70 dòng bảng R, trong 20–70 phút; đạt chỉ tiêu "≥ 5 kịch bản" là dừng. Lượt 3, gói A chạy Workflow (10 subagent tìm, 35 subagent kiểm) ra 29 phát hiện (10 là test hở), các gói khác 2–7; nhưng phiên đó dừng vì hết hạn mức, và không có đối chứng cùng gói ở mức `xhigh` / `max` không Workflow, nên không kết luận được Workflow tìm nhiều hơn. Lượt 6 tăng số mẫu bằng phiên chủ đề hẹp (§L6.3), không bằng ultracode (Owner 07/11).
2. **Đợt sửa sinh lỗi cho lượt sau** (cột "Do đợt sửa"). Loại hay gặp nhất là test hở của chính phần sửa (lượt 5: 5 / 7 vấn đề chỉ Claude thấy). Code giữa các lượt không chỉ là sửa: Mock trích xuất viết lại 950 dòng theo quyết định mới (K42), pipeline `auto-issues` (`tools/auto-wait*`).
3. **Sửa từng vị trí, không sửa cả họ.** Issue liệt kê vị trí, PR sửa đúng các vị trí đó, review-pr kiểm theo Issue; chỗ cùng mẫu còn nguyên và quay lại ở lượt sau:
   - chuỗi liền dài tràn khung: DR6-117 (lượt 3) → 148 (lượt 4) → 170 (lượt 5);
   - bộ chặn ký hiệu: DR6-37 (lượt 1) → 145 (lượt 4) → 169 (lượt 5); Issue #790, #901 thu hẹp phạm vi so với mô tả mà không ghi phần để ngoài;
   - tên nút trùng cho trình đọc màn hình: DR6-119 → 151 → 160;
   - hỏi "trống" bằng `trim()` thay `normalizeText`: DR6-150 → 159, 168, 172, 173.

   Đợt sửa lượt 5 đã sửa theo họ ở hai họ: e2e quét mọi màn chính với tên liền dài (T-367); ô chữ hỏi trống qua `normalizeText` (T-363, T-365, T-368). Phiên soạn đọc 13 chỗ `.trim()` còn trong code sản phẩm ở `b3721f4`: không chỗ nào còn hỏi "trống" chữ người dùng nhập bằng `trim()` trần (ô API key có `trim`, nhưng ký tự vô hình bị `NOT_ASCII` chặn).
4. **Tiêu chí dừng không đạt được.** Ba lượt liền 0 Medium; phần còn lại là Low / Nit với đầu vào hiếm, một đuôi gần như không hết. K47 ("sửa hết rồi G7") cộng việc đợt sửa sinh khoảng nửa số vấn đề của lượt sau thành vòng lặp. Vòng thứ hai ở sổ ghi chú review: review từng PR sửa sinh ghi chú không chặn, K40 đòi sổ OPEN rỗng trước khi ghim SHA, nên sau 8 Issue của đợt sửa lượt 5 còn 14 Issue sổ (T-371…T-384).

**Diff từ lượt 5 có làm nặng project không** (Owner hỏi 07/11: "với hơn 60 file thêm, + 2252 dòng, liệu có cách rà soát để tránh làm nặng project không cần thiết không?"). `37a80b6..b3721f4`, ngoài `docs/**` và `*.md`:

| Loại | Thêm / bớt | File |
|---|---|---|
| Sản phẩm (không tính `tools/`) | +509 / −144 | 34 |
| Test (unit, e2e, test của công cụ) | +1 595 / −71 | 24 |
| Công cụ (`tools/auto-wait*`) | +148 / −21 | 2 |

- `size-report` (sản phẩm gồm cả `tools/`): sản phẩm 39 077 → 39 569 (+1,3 %), test 55 828 → 57 352 (+2,7 %), 431 file như lượt 5.
- Tổng hợp lượt 5 ước 8 nhóm sửa ≈ 85–195 dòng sản phẩm + ≈ 500 dòng test. Bảy Issue có code (T-363…T-369) thêm ≈ 325 dòng sản phẩm, ≈ 995 dòng test, 60 dòng công cụ. 14 Issue sổ sau đó thêm ≈ 270 dòng sản phẩm, ≈ 650 dòng test, ≈ 110 dòng công cụ. Số cộng theo từng commit nên lớn hơn diff cuối: có dòng viết rồi viết lại.
- Họ nặng nhất là tên nút khôi phục ở Thùng rác (DR6-160, mức **Nit**): riêng T-377, T-380, T-382 thêm ≈ 200 dòng sản phẩm, ≈ 310 dòng test, chưa tính phần của T-368. Bộ chặn ký hiệu (công cụ kiểm, không vào exe): T-366, T-376 thêm ≈ 110 dòng, ≈ 180 dòng test. `tools/auto-wait*`: ≈ 170 dòng, ≈ 300 dòng test (gồm test công cụ khác của T-369).
- Bundle và exe ở `main` chưa đo lại; bước chuẩn bị đo (§L6.6). Phiên chủ đề G rà gọn diff này (§L6.3); ngân sách dòng của Issue sửa giữ đợt sửa sau lượt 6 không phình (§L6.10).

## L6.1 Mục tiêu, bên review, tiêu chí xong

**Mục tiêu:** một lượt deep review toàn bộ code, lượt cuối trước G7, trên SHA sau đợt sửa lượt 5 và mục sổ G7 (T-363…T-384). Sau lượt 6 không có lượt deep review toàn bộ code nào nữa trước phát hành v1.0 (K48).

**Bên review:**

- **Claude Opus 5.5:** Owner mở mỗi gói một phiên sạch ở `C:\workspace\Project-2C-review`: sáu gói A → F, rồi ba phiên chủ đề G → H → I (§L6.3). Mức suy luận Owner chọn từng phiên (M1). **Không dùng ultracode / Workflow** ở mọi phiên Claude của lượt 6 (Owner 07/11: "1 là nó rất tốn usage, 2 là chưa chắc hiệu quả đem lại đã hơn xhigh và max"). **Được dùng subagent** (công cụ Agent), chỉ model Claude Sonnet 5.5 hoặc Claude Opus 5.5, mức `xhigh` (Owner 07/11: "cho phép dùng subagent nhưng giới hạn ở sonnet 5.5 (xhigh) hoặc opus 5.5 (xhigh), không dùng ultracode"). Chỉ Claude làm bảng R.
- **Codex, model GPT Sol 6.1:** Owner chạy, mỗi gói một phiên mới, chỉ đọc, không viết code (M2). Chỉ tìm lỗi mới.
- **Agent WorkBuddy:** app desktop WorkBuddy, model Owner chọn (Hy4 hoặc GLM 5.3; ghi tên đúng như app hiện), mỗi gói một task mới qua Code review expert của app. Cùng điều kiện như Codex theo M2. Chỉ tìm lỗi mới.
- 6 gói × 3 bên + 3 phiên chủ đề của Claude = **21 báo cáo**, hai đợt như lượt 5: đợt 1 Claude và Codex song song; đợt 2 WorkBuddy một mình, khi thư mục của hai bên kia đã bị chặn ACL. Kết luận phát hành chỉ lấy từ phiên tổng hợp của Claude.

**Tiêu chí xong và hậu quả, chốt trước khi chạy** (K48; thay K47 và điều kiện "sổ OPEN rỗng" của K40):

| Loại vấn đề (mức và trục chốt ở tổng hợp, thước §4.3) | Hậu quả |
|---|---|
| Critical, High, Medium | **Chặn phát hành.** Sửa theo họ (§L6.10), review-pr; rồi một phiên sạch của Claude **review lại đúng vùng đó** (diff của đợt sửa và các chỗ cùng mẫu). Không mở lượt 7 |
| Low ở trục D (dữ liệu), S (an toàn ở ranh giới), G (guardrail AI) | **Chặn phát hành.** Sửa theo họ, review-pr như thường |
| Low ở trục khác (E, C, P dưới ngưỡng, B, T, A), Nit | **Không chặn.** Ghi vào sổ ghi chú review, mục OPEN, nhãn **[sau v1.0]**; không sửa trước G7 |
| Dòng R không ĐÃ SỬA | Phần còn hở thành vấn đề mới, xếp theo các hàng trên theo mức và trục của chính nó |
| Ghi chú không chặn của review các PR từ PR kế hoạch này tới phát hành (gồm T-386, T-387, PR sửa) | Như các hàng trên: chặn thì sửa trong cùng đợt; không chặn thì [sau v1.0] |

- Trục là trục chính phiên tổng hợp chốt. Low có hậu quả lên dữ liệu đã lưu, backup, key hay output AI thì xếp D / S / G, dù reviewer ghi trục khác.
- Owner được kéo một vấn đề không chặn vào đợt sửa khi trả lời câu hỏi của tổng hợp. Mặc định là không.
- Kết luận ở SHA ghim: **CHƯA SẴN SÀNG** khi còn vấn đề chặn; không còn thì **SẴN SÀNG**, kể cả khi có vấn đề [sau v1.0].
- Sau tổng hợp: không có vấn đề chặn → G7 ngay trên SHA ghim. Có → đợt sửa, (Medium trở lên) review lại vùng đó, rồi G7.
- Sổ ghi chú: mục lá OPEN gắn [sau v1.0] không chặn ghim SHA, không chặn G7. Sau v1.0, Owner xét các mục này cùng lần xét lại quy tắc "dữ liệu là giả lập" (`CLAUDE.md`).

**Đóng băng code** (K49), từ SHA ghim tới phát hành v1.0:

- Code sản phẩm, test và công cụ (mọi file ngoài `docs/**` và `*.md`, cộng `CODE_DOCS` của `tools/pr-core.mjs`) chỉ đổi để sửa vấn đề chặn phát hành của lượt 6, hay lỗi mà G7 (nghiệm thu, eval AI thật, cổng) tìm ra, xếp theo cùng bảng trên.
- Không thêm hay đổi công cụ pipeline (`tools/auto-wait*`, skill `auto-issues`), không quyết định hành vi mới, không refactor, không gỡ code chỉ vì bloat. Đề xuất gỡ / gộp của phiên G vào sổ [sau v1.0], trừ khi Owner chọn ở câu hỏi của tổng hợp.
- Ngoại lệ chỉ khi Owner duyệt (G1), ghi ở `docs/PROJECT-STATE.md`.
- PR chỉ tài liệu vẫn merge được (không đổi SHA ghim).
- T-386 (review-pr, mẫu Issue / PR) và T-387 (`dot2.mjs` lượt 6) merge **trước** bước chuẩn bị (§L6.2), nên không vướng đóng băng.

## L6.2 SHA ghim, đợt sửa, chỗ làm

**SHA ghim lượt 6 = `origin/main` lúc bước chuẩn bị**, khi mục OPEN của `docs/state/review-notes.md` không còn mục lá chặn phát hành (mục [sau v1.0] không tính; K48). Thứ tự:

1. PR kế hoạch này merge (G1), rồi PR sổ ghi chú review của nó.
2. T-386 (§L6.10), T-387 (Phụ lục Z) và T-388 (§L6.9 bước chuẩn bị 4, Phụ lục Z; ba ghi chú của review #1123, Owner kéo vào ngày 07/11), tạo sau G1, merge cùng PR sổ của chúng. Ghi chú không chặn của review các PR này xếp theo K48: chặn thì sửa trước khi ghim; không chặn thì [sau v1.0].
3. Bước chuẩn bị ghim `main` lúc đó (§L6.9 bước 1).

Từ SHA ghim tới lúc chạy chỉ có thay đổi docs. Trong lượt 6 **không merge code vào `main`** (như §2); sau lượt 6 là đóng băng (K49).

**Lúc soạn:** `b3721f4` (`b3721f49c1681309bbcc900a4a3d58f001dfaa00`, `main` 06/11/2026 sau #1116). Milestone Phase 6 không còn Issue mở nào ngoài #1117.

**Đợt sửa = diff `37a80b6..{SHA}`.** Lúc soạn, ngoài `docs/**` và mọi file `*.md`: 60 file, +2 252 / −236 dòng (`git diff --numstat`, tính cả test). Không migration, không file nhị phân.

Đợt sửa lượt 5 (Owner duyệt cách sửa 05/11, tổng hợp lượt 5 §9; cột DR6 là vấn đề lượt 5 mà Issue sửa):

| Issue | Việc | DR6 | PR | Commit |
|---|---|---|---|---|
| #1045 T-363 | Test `byName` giữ sửa DR6-136; nhãn model hỏi trống bằng `normalizeText` | 158, 159 | #1063 | `75601dc` |
| #1046 T-364 | Test hợp đồng capability đủ nguồn; hàng đợi lưu không chồng lượt; nhánh chết `app-data` | 161–163 | #1064 | `292a63e` |
| #1047 T-365 | Mock trích xuất (`worded`, "bé", "–"); rule `test-support`; khung dán ChatGPT web trống | 164, 166–168 | #1066 | `509b785` |
| #1048 T-366 | Bộ chặn ký hiệu: đủ ký hiệu, escape, thực thể HTML, dấu nối JSX, bỏ báo nhầm | 169 | #1068 | `31f7fc2` |
| #1049 T-367 | Chuỗi liền dài ở chín chỗ; e2e quét mọi màn | 170, 174 (c) | #1070 | `dd5ae56` |
| #1050 T-368 | Tên nút khôi phục; luật nhập mã KH; hai ô tìm; hộp HĐ; e2e 10a và Thùng rác | 160, 172, 173, 174 (a, b) | #1072 | `e9f2eb1` |
| #1051 T-369 | Công cụ: test `notes-core` / `auto-wait` / `review-hint`; `ci --since`; `metRows` của probe | 175–177 | #1056 | `234eb9e` |
| #1052 T-370 | Tài liệu nghiệm thu (7c, NT-AI-17); mốc Mock trích xuất | 165, 171 | #1074 | `bfc9f47` |

Mục sổ G7 sau đợt sửa (gom ghi chú review của các PR trên; gắn nhãn ở #1055, #1060, #1084, #1096, #1102, #1108, #1112):

| Issue | Việc | PR | Commit |
|---|---|---|---|
| #1054 T-371 | Tổng hợp lượt 5: đếm chênh mức khớp bảng §5.1 (tài liệu) | #1075 | `89028f8` |
| #1058 T-372 | Probe: đổi tên biến `status` trong `metRows` | #1077 | `42f29a5` |
| #1059 T-373 | `auto-wait ci --since`: run failure chưa có check đỏ thì báo đỏ | #1061 | `f4490e1` |
| #1079 T-374 | Hàng đợi lưu: `idle()` chờ lượt ghi do listener mở; ca capability đủ nguồn | #1090 | `bf8dee7` |
| #1080 T-375 | Một luật câu dán trống; Mock nhận "đứa / thằng … đã mất"; rule test-support chung | #1086 | `e0806b8` |
| #1081 T-376 | Bộ chặn ký hiệu bắt `concat(`; trần tên ô bảng một lớp; khung `SelectField` | #1092 | `64720db` |
| #1082 T-377 | Thùng rác: tên nút khôi phục (giây, team trùng tên); `searchText` về domain; e2e hộp 8b | #1088 | `20c51e3` |
| #1083 T-378 | `auto-wait ci` lấy failure của run `pull_request` mới nhất làm sàn khi không `--since` | #1103 | `ebee006` |
| #1085 T-379 | `auto-issues`: phiên điều phối chờ có trần ngắn; `auto-wait ci --not` dừng khi head cũ | #1104 | `88848b9` |
| #1094 T-380 | Dòng lý do TR-1 và ô "Thuộc" nêu giờ xóa khi hai team trùng tên | #1097 | `5d07d5e` |
| #1095 T-381 | Ca capability kiểm config gộp lúc build; helper chung cho hai ca listener của hàng đợi lưu | #1099 | `b2ef4c1` |
| #1101 T-382 | Một helper cho vế "xóa lúc" của Thùng rác; ca capability lọc đúng lệnh tauri | #1109 | `4d38a72` |
| #1107 T-383 | `auto-wait` chờ push khi nhánh của PR chưa có trên GitHub | #1113 | `5e03403` |
| #1111 T-384 | Ca hợp đồng capability nhận mọi cách gọi CLI tauri | #1115 | `a53a1d8` |

Mỗi PR code có PR sổ ghi chú review ngay sau. Ghi chú không chặn của chúng nằm ở KNOWN phần 1 nếu còn ACCEPTED, ở `fixes.md` nếu đã RESOLVED (§L6.5, §L6.9 bước 4).

| Bên | Ai chạy | Đợt | Làm ở | Thư mục kết quả | ID |
|---|---|---|---|---|---|
| Claude Opus 5.5 (mỗi gói / chủ đề một phiên sạch, A → F rồi G → I) | Owner mở phiên | 1 | `C:\workspace\Project-2C-review` | `C:\workspace\deep-review-1-6-r6\claude\` | `CLR6-<gói><số>` |
| Codex, model GPT Sol 6.1 | Owner, mỗi gói một phiên mới | 1 (cùng lúc Claude) | `C:\workspace\Project-2C-review-2` | `…-r6\codex\` | `CXR6-<gói><số>` |
| Agent WorkBuddy (model Owner chọn, qua Code review expert) | Owner, mỗi gói một task mới trong app | 2 (một mình) | `C:\workspace\Project-2C-review` (Claude đã xong), là workspace của task | `…-r6\workbuddy\` | `WBR6-<gói><số>` |
| **Claude phiên tổng hợp** (Issue tạo sau khi lượt 6 chạy xong) | Owner yêu cầu, sau khi đủ 21 báo cáo | — | checkout chính | `docs/reviews/` qua PR docs | dùng nguyên ID trên |

- **ID theo bên:** "R6" = lượt 6 (`rg "CLR6-|CXR6-|WBR6-"` trên `docs/` ngày 07/11: 0 chỗ). Vấn đề đã gộp đánh số tiếp `DR6-178…`.
- **Hai đợt, ACL:** lý do như §L4.2. ACL của đợt 2 chặn thêm cả thư mục lượt 5 `deep-review-1-6-r5` (Phụ lục Z).
- **Máy: Home PC `DESKTOP-KDURKJP`** như lượt 3–5: mốc hiệu năng cùng máy chỉ có ở đây; app WorkBuddy đã cài ở đây.
- Thư mục lượt 1–5 (`C:\workspace\deep-review-1-6\`, `-r2\` … `-r5\`) giữ trên Home PC tới v1.0 (HANDOFF). Báo cáo lượt 1–5 của mọi bên đã ở repo (`docs/reviews/raw/`).

## L6.3 Sáu gói, ba chủ đề, cỡ đo lại

Phạm vi từng gói giữ đúng §3 và luật `PACKAGES` của `tools/size-report-core.mjs`. Ở `b3721f4` không file nào rơi vào dòng "Chưa xếp gói".

**Cỡ đo lúc soạn** (`node tools/size-report.mjs` ở `b3721f4`, 07/11, Home PC). Δ so với lượt 5 (`37a80b6`, §L5.3; code `37a80b6` trùng `571b8b0`). **Diff sửa** = `git diff --numstat -M 37a80b6 b3721f4`, xếp gói bằng `classifyFile`, như §L5.3. Cột R1 / R2 chỉ cho Claude (§L6.4).

| Gói | SP (Δ) | Test (Δ) | Sinh (Δ) | File (Δ) | Diff sửa SP | Diff sửa test | R1 (Claude) | R2 (Claude) |
|---|---:|---:|---:|---:|---|---|---|---|
| A. Lõi dữ liệu | 8 781 (+33) | 15 965 (+160) | 341 (0) | 104 (0) | +41 / −8 · 6 file | +182 / −22 · 7 file | 158, 159, 160 | T-377 |
| B. File và Rust | 2 465 (+8) | 5 762 (+162) | 0 (0) | 21 (0) | +13 / −5 · 2 file | +172 / −10 · 2 file | 161–163 | T-374, 381, 382, 384 |
| C. AI | 6 610 (+30) | 8 262 (+60) | 0 (0) | 65 (0) | +46 / −16 · 5 file | +65 / −5 · 2 file | 164–168 | T-375 |
| D. Màn nhập liệu | 8 230 (+96) | 3 271 (+177) | 0 (0) | 89 (0) | +124 / −28 · 8 file | +177 / −0 · 1 file | 169, 170 | T-376 |
| E. Lịch hẹn, chỉ số, quản lý | 8 466 (+194) | 5 024 (+324) | 0 (0) | 52 (0) | +274 / −80 · 12 file | +334 / −10 · 2 file | 160, 170, 172–174 | T-377, 380, 382 |
| F. Xuyên gói, bloat / hiệu năng, công cụ | 5 017 (+131) | 19 068 (+641) | 4 628 (0) | 100 (0) | +159 / −28 · 3 file | +665 / −24 · 10 file | 165 (đo), 167, 171, 175–177; **R1 gộp đủ 20 dòng** | T-371, 372, 373, 375, 378, 379, 383; **R2 gộp đủ 14 dòng** |
| **Tổng** | 39 569 (+492) | 57 352 (+1 524) | 4 969 (0) | 431 (0) | | | | |

- Phần lớn diff sản phẩm ở E (Thùng rác: `trash-view.ts`, `SettingsTrash.tsx`, `RestoreDialog.tsx`) và F (`tools/auto-wait*`, 148 dòng).
- Bước chuẩn bị (§L6.9 bước 6) đo lại ở SHA ghim bằng cùng lệnh, kèm bundle và exe; số ở `baseline.md` là số dùng.

**Ba chủ đề, chỉ Claude, mỗi chủ đề một phiên sạch sau Claude F.** Hai họ lỗi lặp lại nhiều nhất qua năm lượt (chữ người dùng nhập / hiển thị; lưu, thay, đóng chồng nhau) được đọc **xuyên mọi gói** bởi một phiên chỉ làm họ đó, thay vì sáu phiên mỗi phiên một góc. Phiên G trả lời câu hỏi bloat của Owner (§L6.0).

| Chủ đề | Đọc gì | Hỏi gì | Ra gì |
|---|---|---|---|
| **G. Rà gọn** | diff `37a80b6..{SHA}` (60 file lúc soạn); code của các họ DR6-160, 169, 170 | Mỗi khối thêm vào: (1) đã có hàm / component sẵn làm được chưa (`rg`, bản đồ `pnpm codemap`); (2) code chỉ phục vụ một ca Nit có cân với chi phí giữ không; (3) test lặp giữa unit và e2e, hay ca thừa; (4) code chỉ cho test / công cụ nằm trong package sản phẩm hay lọt vào bundle. Cỡ bundle / exe so lượt 5 (`common\baseline.md`) | Phát hiện trục B kèm cỡ gỡ / gộp ước lượng, rủi ro, test giữ hành vi. Lỗi đúng-sai thấy trên đường ghi như mọi phát hiện. Theo K49, gỡ trước v1.0 chỉ khi Owner chọn |
| **H. Chữ người dùng nhập và hiển thị** | Mọi gói: chỗ đọc chữ người dùng (ô nhập, dán, nhập backup, ô tìm), hỏi trống / độ dài / so sánh, lưu, hiện (bảng, hộp, tên nút, `aria-*`, chart, Excel, câu lỗi) | Mỗi chỗ có đi qua đúng hàm chuẩn của `packages/domain` (`normalizeText`, `searchText`, …) không; chuỗi liền dài, ký tự vô hình, NFC / NFD, emoji, xuống dòng, chữ rất dài; tên truy cập trùng trong cùng danh sách; chữ người dùng vào HTML / chart không escape | Phát hiện kèm bảng quét: lệnh `rg` / probe, mọi chỗ cùng mẫu, chỗ nào sai |
| **I. Bất đồng bộ và thứ tự** | Hàng đợi lưu (`persist-queue.ts`, `listeners.ts`), thay dữ liệu S-2, `close-guard`, `AppData`, `ai-jobs.ts` theo `generation`, `today.ts`, hộp xác nhận lúc chạy | Hai việc chồng nhau; listener gọi lệnh lồng; lỗi giữa chừng; tắt app / Nạp lại / Nhập backup giữa lúc lưu hay AI chạy; qua nửa đêm | Phát hiện kèm chuỗi đã dựng (probe qua lớp dữ liệu của app, bản build web hay exe) |

- Hai họ của H và I: chữ có ở cả năm lượt (vd. DR6-49, 72, 107–112, 117, 142, 145, 148, 150, 159, 168–173); lưu / thay / đóng có ở lượt 4–5 (DR6-139, 140, 147, 162).
- Mỗi chủ đề một phiên sạch, như phiên gói; **không ultracode / Workflow**; subagent chỉ Claude Sonnet 5.5 hoặc Opus 5.5, mức `xhigh` (Owner 07/11, §L6.1). Mức suy luận của phiên chính Owner chọn (`xhigh` hoặc `max`).

## L6.4 Việc của mỗi bên

| Việc | Claude A–F | Claude G–I | Codex A–F | WorkBuddy A–F |
|---|---|---|---|---|
| Bảng R1 / R2 của gói (§L6.5 phần 4, 5) | có; F gộp đủ | không | không | không |
| Tìm lỗi mới, edge case mới | toàn bộ phạm vi gói | theo chủ đề, mọi gói | toàn bộ phạm vi gói | toàn bộ phạm vi gói |
| Mục Bloat, mục Hiệu năng | chỉ F (toàn codebase) | G: bloat của diff | chỉ F | chỉ F |
| Kết luận SẴN SÀNG / CHƯA SẴN SÀNG | F | không | F | F |

- **Bảng R chỉ Claude làm.** Bốn bước của §L5.4 giữ nguyên: chạy lại tái hiện của lượt 5 (báo cáo gốc `docs/reviews/raw/2026-11-05/`, tổng hợp lượt 5 §6; probe lượt 5 của chính Claude ở `C:\workspace\deep-review-1-6-r5\claude\`); gỡ tạm phần sửa, xem test của PR có đỏ; thử biến thể gần; mục tài liệu: dòng ghi có và khớp app. Dòng R1 kiểm theo **mô tả của DR6** ở tổng hợp lượt 5 và báo cáo gốc, không chỉ theo danh sách việc trong Issue. Với Codex, WorkBuddy và Claude G–I, dòng R là KNOWN; phần sửa hỏng thì ghi phát hiện mới, "Liên quan: DR6-xx / T-xxx".
- **Bỏ chỉ tiêu "≥ 5 kịch bản"** (gói F "≥ 5 chuỗi"). Mục "Kịch bản đã thử" giữ làm nhật ký, không có số tối thiểu. Thay bằng **phủ**: bước chuẩn bị ghi danh sách file của từng gói (`common\files-<gói>.txt`); báo cáo ghi file nào trong danh sách không đọc kỹ, và vì sao.
- **Thứ tự đọc:** diff `37a80b6..{SHA}` của gói trước (đợt sửa là chỗ hở nhiều nhất); rồi phần còn lại, từng file; rồi chuỗi nhiều bước qua nhiều gói (nhất là gói F).
- **Bỏ mục Bloat / Hiệu năng bắt buộc ở A–E:** năm lượt không có code chết có chi phí đo được, không thao tác nào vượt ngưỡng; bước chuẩn bị và G7 đã đo. Phát hiện P / B ở A–E vẫn ghi như mọi phát hiện (P phải có số đo). Gói F giữ hai mục cho toàn codebase, dùng số của `baseline.md`, đo thêm chỉ chỗ mình nghi.
- **Khuôn phát hiện thêm hai trường** (Phụ lục Y): **Cùng mẫu** (lệnh `rg` / probe đã chạy để tìm mọi chỗ cùng mẫu trong toàn repo; danh sách `path:dòng`; chỗ nào sai) và **Chặn phát hành** (có / không theo K48, kèm lý do). Nhiều chỗ cùng nguyên nhân là một phát hiện kèm danh sách. Reviewer vẫn báo mọi phát hiện, kể cả Low / Nit; trường "Chặn phát hành" là đề xuất, phiên tổng hợp chốt.

## L6.5 KNOWN lượt 6

`common\known.md` (bước chuẩn bị §L6.9 bước 4) **dựng mới** ở SHA ghim, không chép `known.md` lượt 5. Gồm **năm phần**, như §L5.5.

**1. Mục OPEN và ACCEPTED** của `docs/state/review-notes.md` ở SHA ghim, nguyên văn. OPEN rỗng lúc soạn; nếu có mục [sau v1.0] (từ review PR kế hoạch, T-386, T-387) thì chép cả. Ghi chú sổ thêm sau SHA ghim (chỉ PR docs) ghi ở đầu `known.md`.

**2. Quyết định Owner còn hiệu lực:** K1–K46 chép từ bảng của `docs/reviews/raw/2026-11-05/common-known.md`, với ba đổi:

- **K17 (sửa theo M13):** như chữ của §L5.5, thay "việc Codex, DeepSeek review chỉ đọc (M2, M10, M12)" bằng "việc Codex, DeepSeek, agent WorkBuddy review chỉ đọc (M2, M10, M12, M13)".
- **K40:** thêm câu cuối "Lượt 6: thay bằng K48 (mục [sau v1.0] không chặn ghim SHA)".
- **K47:** không chép nội dung (K48 thay). `known.md` giữ một dòng "K47 — lượt 6: thay bằng K48", để chữ "K1–K50" của quy tắc chung 5 (Phụ lục Y) đúng.

Cộng thêm:

| # | Quyết định | Nguồn |
|---|---|---|
| K48 | Tiêu chí xong của lượt 6 (Owner 07/11, M13), chốt trước khi chạy. Chặn phát hành: Critical / High / Medium; Low ở trục D, S, G. Không chặn: Low ở trục khác, Nit → sổ, OPEN, nhãn [sau v1.0], không sửa trước G7. Dòng R không ĐÃ SỬA: phần còn hở xếp theo mức và trục của nó. Ghi chú không chặn của review PR sửa: cùng luật. Có Medium trở lên thì sửa rồi review lại đúng vùng đó, không lượt 7. Kết luận CHƯA SẴN SÀNG chỉ khi còn vấn đề chặn. Reviewer vẫn báo mọi phát hiện; trường "Chặn phát hành" là đề xuất, phiên tổng hợp chốt. Thay K47 và điều kiện "sổ OPEN rỗng" của K40 | `plan.md` §L6.1; #1117 |
| K49 | Đóng băng code từ SHA ghim lượt 6 tới phát hành v1.0 (Owner 07/11, M13): code chỉ đổi để sửa vấn đề chặn của lượt 6 hay lỗi G7 tìm ra; không công cụ pipeline mới, không quyết định hành vi mới, không refactor, không gỡ code chỉ vì bloat; ngoại lệ chỉ khi Owner duyệt (G1). Đề xuất gỡ / gộp (trục B) không chặn | `plan.md` §L6.1; #1117 |
| K50 | Quyết định lượt 5 (Owner 05/11, tổng hợp lượt 5 §9, mọi đề xuất). Q1 (a): nút khôi phục ở Thùng rác phân biệt ba ca (vế "của KH <tên>" thêm mã KH khi tên KH trùng một KH khác có dòng trong Thùng rác, khuôn `customer.withCode` của 9b; hai nhân sự trùng tên, vai trò, team thêm giờ xóa); luật nhập backup chỉ nhận mã KH dạng app sinh (`K-` + 4 ký tự Crockford base32), luật nhập mới theo K1. Q2 (a): chi phí Mock trích xuất sau T-330 / T-336 chấp nhận, mốc mới ở `phase-6.md`. Q3 (a): bộ chặn ký hiệu bắt cả escape `\uXXXX` trong chuỗi / template và thực thể HTML trong chữ JSX. Q4 (a): chín chỗ tràn, một e2e quét mọi màn chính với tên liền dài ở 1 100 / 1 440 px | `PROJECT-STATE.md` 05/11; #1045…#1052 |

**3. Mục "Lệch mockup đã biết" của `docs/testing/nghiem-thu-v1.md`**, nguyên văn ở SHA ghim, gồm mọi khối con.

**4. Bảng R1** (dưới; chỉ Claude A–F kiểm): 20 vấn đề lượt 5 vào bảng R1 của gói kiểm (§L6.4), không báo lại thành phát hiện. Với Codex, WorkBuddy và Claude G–I, mọi dòng là KNOWN. Ngoài bảng:

- **Các DR6 khác** (DR6-01…157, đã sửa ở lượt 1–5, trừ các mục KNOWN dưới): không báo lại. Phần sửa hỏng lại → phát hiện mới, "Liên quan: DR6-xx".
- **KNOWN, chỉ nêu khi có bằng chứng mới** (như §L5.5): DR6-53 (chấp nhận); J5 của DR6-60 (K29); CL3-C7 (K1, R2-02); Claude F K2 của lượt 3 và CLR4-F2 (dữ liệu do exe trước v1.0 ghi mà luật mới từ chối; K1).

Mức: L = Low, N = Nit (mức chốt ở tổng hợp lượt 5 §6). Mô tả đầy đủ ở tổng hợp lượt 5 §6. Cột "Issue → PR" kể cả PR sau chạm cùng vấn đề (trong ngoặc).

| Mã | Mức | Vấn đề (ngắn) | Issue → PR | Gói kiểm |
|---|---|---|---|---|
| DR6-158 | L | Không test nào giữ phần sửa của DR6-136 (bộ nhớ khóa của `byName`) | #1045 → #1063 | A |
| DR6-159 | N | `isLabel` hỏi "trống" bằng `trim()` | #1045 → #1063 | A |
| DR6-160 | N | Tên nút khôi phục ở Thùng rác còn trùng ở ba ca (KH cùng tên, nhân sự trùng, mã KH chỉ khác dấu cách) | #1050 → #1072 (+ #1082 → #1088, #1094 → #1097, #1101 → #1109) | E, A |
| DR6-161 | L | Test hợp đồng của bản build chỉ so `permissions` của `capabilities/default.json` | #1046 → #1064 (+ #1079 → #1090, #1095 → #1099, #1101 → #1109, #1111 → #1115) | B |
| DR6-162 | L | Hàng đợi lưu: listener gọi hai lệnh ghi thì hai lượt ghi chạy chồng | #1046 → #1064 (+ #1079 → #1090, #1095 → #1099) | B |
| DR6-163 | N | Nhánh `if (!storage) return;` của `app-data.ts` không bao giờ chạy | #1046 → #1064 | B |
| DR6-164 | L | Phép thử chữ cái của `worded` (Mock trích xuất) không ca nào giữ | #1047 → #1066 | C |
| DR6-165 | L | Mock trích xuất viết lại tốn hơn `2e51e25` quá luật nhiễu (Q2 (a): chấp nhận, ghi mốc) | #1052 → #1074 (tài liệu) | C, F (đo) |
| DR6-166 | N | Mock trích xuất bỏ lỡ đề xuất ("bé" nghĩa nhỏ, dạng khác) | #1047 → #1066 (+ #1080 → #1086) | C |
| DR6-167 | L | Rule `ai-test-support-only-in-tests` chỉ xét `from` trong `packages/ai` | #1047 → #1066 (+ #1080 → #1086) | C, F |
| DR6-168 | L | Khung dán ChatGPT web hỏi "trống" bằng `trim()` | #1047 → #1066 (+ #1080 → #1086) | C |
| DR6-169 | L | Bộ chặn ký hiệu: phần còn của DR6-145, escape / thực thể HTML, dấu nối JSX bị Prettier ngắt, báo nhầm | #1048 → #1068 (+ #1081 → #1092) | D |
| DR6-170 | L | Chuỗi liền dài còn tràn ở chín chỗ; e2e quét mọi màn | #1049 → #1070 (+ #1081 → #1092) | D, E |
| DR6-171 | N | Hai dòng `nghiem-thu-v1.md` chưa theo đợt sửa sau lượt 4 (Ô chọn 7c, NT-AI-17) | #1052 → #1074 | F |
| DR6-172 | L | Hai ô tìm của gói E so chữ gõ qua `trim()` | #1050 → #1072 (+ #1082 → #1088) | E |
| DR6-173 | L | Hộp Hợp đồng hỏi ô trống bằng `trim()` | #1050 → #1072 | E |
| DR6-174 | L | Test hở của đợt sửa gói E: (a) nút "Đang nhập…" của 10a bấm được lúc chạy, (b) `today` của cột Thùng rác và hộp khôi phục, (c) span `max-w-60` ở cột Team của Theo RE | #1050 → #1072 (a, b), #1049 → #1070 (c) | E |
| DR6-175 | N | Test hở của công cụ phát triển (`globMeetsFolder`, `auto-wait-core`, …) | #1051 → #1056 | F |
| DR6-176 | L | `auto-wait ci --since` báo xanh theo check cũ của rollup | #1051 → #1056 (+ #1059 → #1061, #1083 → #1103) | F |
| DR6-177 | N | Probe `metRows` lọc "Đã gặp" trên cả dòng, không chỉ ô Trạng thái | #1051 → #1056 (+ #1058 → #1077) | F |

Đếm: 20 DR6 lượt 5 (13 L · 7 N). DR6-145 (SỬA MỘT PHẦN ở lượt 5) không còn dòng riêng: phần còn của nó là DR6-169 (a).

**5. Bảng R2** (dưới; chỉ Claude A–F kiểm): mỗi Issue một dòng. Mục tiêu, test chấp nhận và ghi chú sổ đã gom (mục RESOLVED) ở `common\fixes.md`.

| Issue | Việc (theo tên Issue) | PR | Gói kiểm |
|---|---|---|---|
| #1054 T-371 | Tổng hợp lượt 5: đếm chênh mức khớp §5.1 (tài liệu) | #1075 | F |
| #1058 T-372 | Probe: đổi tên biến `status` trong `metRows` | #1077 | F |
| #1059 T-373 | `auto-wait ci --since`: run failure chưa có check đỏ thì báo đỏ | #1061 | F |
| #1079 T-374 | Hàng đợi lưu `idle()` chờ hết lượt ghi; ca capability đủ nguồn | #1090 | B |
| #1080 T-375 | Một luật câu dán trống; Mock "đứa / thằng … đã mất"; rule test-support chung | #1086 | C, F |
| #1081 T-376 | Bộ chặn ký hiệu `concat(`; trần tên ô bảng; khung `SelectField` | #1092 | D |
| #1082 T-377 | Thùng rác: tên nút khôi phục (giây, team trùng tên); `searchText` về domain; e2e hộp 8b | #1088 | E, A |
| #1083 T-378 | `auto-wait ci`: failure của run `pull_request` mới nhất làm sàn | #1103 | F |
| #1085 T-379 | `auto-issues`: chờ có trần ngắn; `auto-wait ci --not` dừng khi head cũ | #1104 | F |
| #1094 T-380 | Dòng lý do TR-1 và ô "Thuộc" nêu giờ xóa khi hai team trùng tên | #1097 | E |
| #1095 T-381 | Ca capability kiểm config gộp lúc build; helper chung hai ca listener | #1099 | B |
| #1101 T-382 | Helper vế "xóa lúc" của Thùng rác; ca capability lọc đúng lệnh tauri | #1109 | E, B |
| #1107 T-383 | `auto-wait` chờ push khi nhánh của PR chưa có trên GitHub | #1113 | F |
| #1111 T-384 | Ca hợp đồng capability nhận mọi cách gọi CLI tauri | #1115 | B |

Đếm lúc soạn: 14 Issue; 13 có code hoặc test, T-371 chỉ tài liệu. Không có dòng R2: T-363…T-370 (ở R1 theo DR6). Issue code mới trước SHA ghim (nếu có) thì bước chuẩn bị thêm một dòng.

## L6.6 Số đo: so với mốc Home PC sau #656, G7 và lượt 5

Như §L5.6, đổi:

- **Dữ liệu tải sinh lại ở SHA ghim** (`node tools/load-data.mjs`, mốc `2026-10-12`, seed `6`). Lượt 5: `tables` sha256 `e256e4f18699f4a4e494b59a92ef46865eb4d2c9887f4ff1e7a6b872b4b345a2` (= G7). T-368 thêm luật nhập mã KH (K50); dữ liệu tải sinh mã dạng app nên dự kiến cùng hash và nhập được. Bước chuẩn bị ghi hash đo được; khác thì ghi Issue nào đổi.
- **Mốc so (Home PC):** mốc chính sau #656 và G7 như §L5.6. **Lượt 5 cùng máy** thay lượt 4: `C:\workspace\deep-review-1-6-r5\common\perf\perf-ref.json` (exe `37a80b6`, 04/11; 5 155 B, sha256 `1B889F52DFB5E5A5CCA1AD8F9A49E0FCE64EA5A6B9B664E5F5A0C40BA42186B9`). Mở lần đầu (LCP) lượt 5: 3 535 ms; mở lại lượt 5: 710 ms; Dọn sạch lượt 5: 128,0 ms (≤ 500).
- **Cỡ bundle và exe:** so lượt 5 (`37a80b6`: JS / CSS 2 366 456 B, `index.js` 892 184 B, exe 5 649 408 B; `docs/reviews/raw/2026-11-05/common-baseline.md`).
- **Ai đo:** bước chuẩn bị đo một lần (§L6.9 bước 6–7). Reviewer không bắt buộc đo lại; phát hiện P vẫn phải có số đo. Gói F của mỗi bên dùng số ở `baseline.md`, đo thêm chỉ chỗ mình nghi.

## L6.7 Ba bên, bài học từ lượt 5

- **Claude Opus 5.5:** Phụ lục W. Lượt 5 chạy `xhigh` ở cả 6 phiên, ultracode tắt. Lượt 6: mức suy luận Owner chọn từng phiên; không ultracode / Workflow; subagent chỉ Claude Sonnet 5.5 hoặc Opus 5.5, mức `xhigh` (Owner 07/11; Phụ lục W quy tắc riêng 4).
- **Codex, model GPT Sol 6.1:** Phụ lục X. Như lượt 5, thêm: không gọi `pnpm`.
- **Agent WorkBuddy:** Phụ lục Z, theo DeepSeek ở lượt 4–5 đã chạy thật (Phụ lục P, V; tổng hợp lượt 5 §10.1).
  - App desktop WorkBuddy bản quốc tế (lượt 5: v5.9.4). **Model Owner chọn: Hy4 hoặc GLM 5.3** (Owner 07/11: "workbuddy đang làm và anh sẽ tự quyết định model nào"). Không có bài thi chọn model. Ghi tên model, context và mức suy luận đúng như app hiện vào `baseline.md` ở phiên thử; mọi gói dùng cùng model.
  - Mỗi gói một task qua **Code review expert**; phiên thử tạo qua expert ngay từ đầu.
  - **Agent phụ của app:** như lượt 5 (G6 ngày 30/10; điều kiện ACL chặn đọc và hash báo cáo của Claude / Codex). Prompt (Phụ lục Z) cho phép expert và agent phụ, và đòi mọi agent phụ nhận đủ quy tắc riêng 2–5 và 8.
  - Chế độ quyền **Default** như lượt 4–5.
  - **Chi phí (G4, đề xuất 9):** như lượt 5, chỉ credit của gói WorkBuddy Pro, không mua thêm. Gói Pro Owner đăng ký cho lượt 4 (một tháng): Owner kiểm còn hạn tới hết gói F trước đợt 2. Model mới có thể tính credit khác DeepSeek (lượt 5: 187,38 credit cho 6 gói). Đo credit ở trang Usage trước / sau phiên thử, sau từng gói. **Điểm dừng sau mỗi gói A–E:** credit của gói tốn nhiều nhất tới lúc đó nhân số gói còn lại mà vượt credit còn lại → dừng, hỏi Owner trước gói kế. Hết credit giữa một gói hay gói hết hạn → dừng đợt 2, hỏi Owner.
  - **Chặn:** ACL đợt 2 như §L5.9, thêm cả thư mục lượt 5 `deep-review-1-6-r5` (Phụ lục Z). `gh` đăng xuất trong đợt 2.

**Bài học từ lượt 5** (tổng hợp lượt 5 §10.1 "Cho lần sau"; Phụ lục V "Ghi chú sau lượt 5"; giữ mọi bài học §L2.7, §L3.7, §L4.7, §L5.7):

| Lượt 5 vướng | Lượt 6 làm |
|---|---|
| `dot2.mjs` không chặn thư mục tạm của phiên Claude ở `%TEMP%\claude\<mã băm của thư mục làm việc>\`; phiên chuẩn bị đợt 2 chuyển tay 95 file | T-387: `deny` chặn cả thư mục tạm của các phiên ở hai worktree review |
| Hard link giữa hai mục cùng bị chặn bị tính là link ra ngoài; `deny --dry-run` dừng | T-387: link có mọi đường dẫn nằm trong các mục chặn cả thì tính là bên trong |
| Thư mục gốc `-r4`, `deep-review-1-6` liệt kê được (có mục của tài khoản khác bên trong), khác chữ "→ bị từ chối" của §L5.9 bước 5 | §L6.9 đợt 2 bước 5 ghi kết quả dự kiến: liệt kê được tên mục con, mọi mục con của Owner bị từ chối |
| Phiên thử không qua Code review expert; thêm một task kiểm ACL qua expert (3,59 credit) | Phiên thử tạo qua expert ngay từ đầu |
| `scan` dừng ở 2 transcript Claude ở checkout chính: phiên chuẩn bị đợt 2 in dòng đầu 12 báo cáo; bộ thử `dot2.mjs` có chuỗi mẫu | Phiên hỗ trợ đợt 2 không in dòng đầu báo cáo của Claude / Codex (chỉ đếm file, đọc dòng đầu trong script không in); bộ thử của T-387 dựng chuỗi mẫu bằng cách ghép |
| DeepSeek gọi `node` trần sau khi đặt PATH; 14 lệnh `node -e` không đặt PATH | Phụ lục Z quy tắc riêng 8: mọi lệnh có `node`, kể cả `node -e`, đặt Node 24 đầu PATH trong cùng lệnh; bỏ đòi đường dẫn đủ |
| DeepSeek F làm `gh` thật chạy qua `auto-wait.mjs` (`gh` đã đăng xuất) | Phụ lục Y quy tắc chung 7: không chạy công cụ của repo gọi `gh` / GitHub |
| Codex: Corepack thử tải `pnpm`, DNS của sandbox chặn | Phụ lục X: không gọi `pnpm`; gọi thẳng CLI trong `node_modules` |
| Claude đọc dữ liệu tải và exe ở `-r4\common`; Claude D liệt kê thư mục lượt 4 của chính nó | Phụ lục W: dữ liệu tải, exe và số đo chỉ lấy ở `-r6\common`; probe lượt cũ của chính Claude mở theo đường dẫn đủ mà báo cáo gốc ghi, không liệt kê |

## L6.8 Báo cáo lượt 6

Khuôn như §L5.8, đổi:

- ID `CLR6-<gói><số>` / `CXR6-<gói><số>` / `WBR6-<gói><số>`; chủ đề của Claude `CLR6-G<số>`, `CLR6-H<số>`, `CLR6-I<số>`…; `Vị trí: path:dòng ({SHA})`.
- `Liên quan: DR6-xx / T-xxx (nếu có) · mới do đợt sửa sau lượt 5 (PR #…) | có từ trước, lượt 1–5 bỏ sót`.
- Thêm hai trường **Cùng mẫu** và **Chặn phát hành** (§L6.4, Phụ lục Y).
- Hai bảng R chỉ ở báo cáo Claude A–F, cùng cột như §L2.8. Claude F gộp đủ R1 20 dòng và R2 14 dòng.
- Mục Bloat / Hiệu năng chỉ ở gói F (mọi bên) và Claude G (bloat).
- "Phạm vi đã đọc": phần diff `37a80b6..{SHA}` của gói; file của `common\files-<gói>.txt` không đọc kỹ và vì sao (Claude G–I: phạm vi chủ đề đã đi qua).
- Mục 1 ghi như §L5.8; agent WorkBuddy ghi bản app, expert, model, context, mức suy luận và Node của shell.
- **Gói F** (mọi bên): kết luận SẴN SÀNG / CHƯA SẴN SÀNG cho v1.0 ở SHA ghim theo K48 (tham khảo; kết luận thật ở phiên tổng hợp). Claude G–I không kết luận.

## L6.9 Chuẩn bị và chạy

**Bước chuẩn bị — Claude, sau khi Owner duyệt kế hoạch lượt 6 và T-386, T-387, T-388 đã merge** (một phiên trên Home PC; không review, không ghi phát hiện). Như §L5.9, đổi:

1. Ghi `hostname`, ngày giờ vào `common\baseline.md`.
   - **Kiểm sổ:** mục OPEN của `docs/state/review-notes.md` ở `origin/main` không còn mục lá chặn phát hành (mục [sau v1.0] không tính). Còn → dừng, báo Owner.
   - **Ghim SHA:** `git rev-parse origin/main` lúc đó; ghi đủ 40 ký tự.
   - Ghi `git diff --stat 37a80b6 <SHA ghim> -- . ':(exclude)docs/**' ':(exclude)*.md'`; Issue code mới sau `b3721f4` (nếu có, ngoài T-386) thêm dòng R2.
   - Kiểm `C:\workspace\deep-review-1-6-r6\` chưa có (có rồi → dừng, báo Owner).
   - Kiểm file mốc có, sha256 như §L5.6 / §L6.6: `C:\workspace\deep-review-1-6-r5\common\perf\perf-ref.json` và `C:\workspace\g7-home-pc\lan-2\perf\perf-g7.json`.
   - App WorkBuddy: Owner xác nhận đã đăng xuất app trên máy này; ghi vào `baseline.md`.
2. Tạo `C:\workspace\deep-review-1-6-r6\{common,claude,codex,workbuddy}`.
3. Đưa hai worktree về SHA ghim như §L5.9 bước 3.
4. Chép vào `common\`:
   - `plan.md` (file này, bản đã merge);
   - `known.md` dựng mới theo §L6.5;
   - `fixes.md` như §L5.9 bước 4, cho các Issue ở hai bảng của §L6.2;
   - **`files-A.txt` … `files-F.txt`**: mọi file git theo dõi ở SHA ghim mà `classifyFile` xếp vào gói đó, loại sản phẩm hay test (không tính file sinh tự động), mỗi dòng một đường dẫn kèm loại;
   - `prompt-claude.md` = Phụ lục W + Phụ lục Y; `prompt-codex.md` = Phụ lục X + Phụ lục Y; `prompt-workbuddy.md` = phần prompt của Phụ lục Z + Phụ lục Y. Chép nguyên văn, chỉ thay `{SHA}` bằng 7 ký tự đầu và `{SHA_ĐỦ}` bằng đủ 40 ký tự của SHA ghim (`{GÓI}` để nguyên);
   - `dot2.mjs` = khối code của Phụ lục Z (T-387, T-388), chép nguyên văn.

   Cuối bước, **dừng và lưu trữ các phiên có chuỗi lượt 6, rồi mới `baseline`** (T-388; §L6.7, dòng `scan` dừng ở transcript). `scan` ở đợt 2 dừng ở mọi file sửa sau mốc mà `MARKER` khớp, kể cả transcript của một phiên đã có chuỗi đó từ trước mốc rồi còn ghi tiếp.
   - **Đã biết:** thân Issue #1121 (T-387) có một dòng `MARKER` khớp; bản kế hoạch trước T-387 có một ví dụ ID đủ số ở §L6.8. Các phiên đã đọc hoặc viết chúng: phiên tạo #1121 (cũng soạn kế hoạch), phiên điều phối `auto-issues`, `coding-ses1`, `coding-ses2`, `review-2`, và phiên review PR #1118 ở `Project-2C-review`. Transcript của chúng ở `~\.claude\projects\` của checkout chính và của `Project-2C-review-2` (hai chỗ `deny` không chặn mà `scan` quét), và của `Project-2C-review`. Owner dừng và lưu trữ (archive) các phiên đó trong app trước `baseline`. Phiên chuẩn bị là phiên mới, không mở thân #1121.
   - **Chạy** `node C:\workspace\deep-review-1-6-r6\common\dot2.mjs baseline`. Trước khi ghi mốc, lệnh đọc mọi file trên các gốc của `scan`, bất kể tuổi (Home PC 07/11: ≈ 195 000 file, ≈ 4 phút). Lệnh in đường dẫn từng file đã có chuỗi `MARKER` khớp và số file; không in dòng khớp, mã thoát như cũ.
   - **Mỗi file in ra** phải thuộc một phiên đã lưu trữ (id phiên là tên `<id>.jsonl` hay thư mục `<id>` trong đường dẫn, cả ở `file-history` và `%TEMP%\claude\…\<id>`; Owner xác nhận), hoặc là danh sách phiên của app (`claude-code-sessions`, Phụ lục P đã chấp nhận). File của một phiên chưa lưu trữ → Owner lưu trữ phiên đó, xóa `common\dot2-baseline.json`, chạy lại `baseline`. File của chính phiên chuẩn bị, hay không thuộc phiên nào → dừng, báo Owner. Bản kế hoạch trong `Project-2C-review` ở SHA cũ cũng khớp; bước 3 đã đưa worktree về SHA ghim nên lúc này không còn.
   - Không mở file in ra, không in dòng khớp ra màn hình hay transcript (lượt 5: phiên in dòng đầu báo cáo làm `scan` dừng).
5. Dữ liệu tải như §L5.9 bước 5, ra `…-r6\common\load\load-2026-10-12-seed6.p2cbackup`; so hash lượt 5 (§L6.6).
6. Cổng ở SHA ghim như §L5.9 bước 6 (`pnpm build:exe` sau khi gỡ hẳn `CI`). `size-report --compare`: bảng theo gói và diff `37a80b6..<SHA ghim>` như §L6.3; bundle / exe so lượt 5.
7. Đo hiệu năng như §L5.9 bước 7, đổi: chép script từ `C:\workspace\deep-review-1-6-r5\common\perf\` (các `.ps1`, `.mjs`; không chép kết quả), đổi đường dẫn sang `-r6`; chép `-r5\common\perf\perf-ref.json` thành `common\perf\perf-ref-r5.json` và `perf-g7.json` như §L5.9. Ba bảng: so mốc sau #656, so G7, so lượt 5. Owner để máy rảnh ≈ 8 phút.
8. Báo Owner: sẵn sàng chạy lượt 6.

**Owner chạy đợt 1** (Claude và Codex cùng lúc):

- **Codex** (model GPT Sol 6.1), ở `C:\workspace\Project-2C-review-2`, mỗi gói một phiên mới, lần lượt A → F:

  ```text
  Gói A. Lệnh đầu tiên chỉ đọc C:\workspace\deep-review-1-6-r6\common\prompt-codex.md (không gộp lệnh khác), rồi làm đúng file đó.
  ```

- **Claude** (Claude Opus 5.5), ở `C:\workspace\Project-2C-review`, mỗi gói một phiên mới, lần lượt A → F rồi G → H → I; mức suy luận Owner chọn, không bật ultracode:

  ```text
  Gói A. Lệnh đầu tiên chỉ đọc C:\workspace\deep-review-1-6-r6\common\prompt-claude.md (không gộp lệnh khác), rồi làm đúng file đó.
  ```

  Đổi chữ `A` thành `B`…`F`, rồi `G`, `H`, `I`.

**Owner chạy đợt 2** (agent WorkBuddy một mình). Điều kiện bắt đầu: đủ 15 báo cáo đợt 1 (Claude 9, Codex 6) với dòng đầu `XONG`; Codex đã xong, không còn phiên Claude nào mở ở `Project-2C-review`; gói WorkBuddy Pro còn hạn tới hết đợt 2. Các bước như §L5.9 đợt 2, đổi:

1. `node C:\workspace\deep-review-1-6-r6\common\dot2.mjs clean`.
2. `gh auth logout` và kiểm như §L5.9.
3. Hash **15** báo cáo, rồi `deny`, rồi `scan`:

   ```powershell
   $h = Get-FileHash C:\workspace\deep-review-1-6-r6\claude\*.md, C:\workspace\deep-review-1-6-r6\codex\*.md | Select-Object Path, Hash; if ($h.Count -ne 15) { throw "Cần 15 báo cáo, thấy $($h.Count)" }; $h | Export-Csv C:\workspace\deep-review-1-6-r6\common\dot2-reports-hash.csv -NoTypeInformation
   ```

   ```powershell
   node C:\workspace\deep-review-1-6-r6\common\dot2.mjs deny
   ```

   ```powershell
   node C:\workspace\deep-review-1-6-r6\common\dot2.mjs scan
   ```

   `deny` chặn như §L5.9 đợt 2 bước 3, đổi theo Phụ lục Z: thư mục `…-r6\claude`, `…-r6\codex`; thư mục lượt 1–5 `deep-review-1-6-r5`, `-r4`, `-r3`, `-r2`, `deep-review-1-6`; thư mục tạm của các phiên Claude ở hai worktree review. Thư mục tạm nhận theo tên phiên (Phụ lục Z, "Cách làm của T-387"); trên Home PC ngày 07/11 là `%TEMP%\claude\9baf74bac889a6ec`, `…\172d166a8e27758b` và hai thư mục tên cũ `…\C--workspace-Project-2C-review`, `…\C--workspace-Project-2C-review-2`. Dòng `deny tree` dự kiến có những thư mục đó còn trên máy, và không bao giờ có `…\4f7e6602815f66dc` (checkout chính).

   Phiên Claude hỗ trợ đợt 2 (nếu có) không in dòng đầu báo cáo của Claude / Codex; kiểm điều kiện bằng script chỉ in số file đạt.
4. Mở app WorkBuddy như §L5.9 đợt 2 bước 4. Chọn model Owner đã quyết; ghi tên model đúng như app hiện vào `baseline.md`.
5. **Phiên thử** (chỉ khi `deny` và `scan` in `OK`, và `common\dot2-acl.json` có), tạo **qua Code review expert** ngay từ đầu: workspace `C:\workspace\Project-2C-review`, chế độ quyền Default, model đã chọn. Việc như §L5.9 đợt 2 bước 5, đổi `-r5` thành `-r6`, thêm liệt kê `C:\workspace\deep-review-1-6-r5`. **Kết quả dự kiến:** thư mục bị chặn cả → bị từ chối; thư mục gốc có mục của tài khoản khác bên trong (lượt 5: `-r4`, `deep-review-1-6`) → liệt kê được tên mục con, mọi mục con của Owner bị từ chối. Lệnh `node` và vitest theo quy tắc riêng 8 của Phụ lục Z.
6. Mỗi gói một task mới qua Code review expert, lần lượt A → F, như §L5.9 đợt 2 bước 6, với tin nhắn:

   ```text
   Gói A. Lệnh đầu tiên chỉ đọc C:\workspace\deep-review-1-6-r6\common\prompt-workbuddy.md (không gộp lệnh khác), rồi làm đúng file đó.
   ```

   Điểm dừng chi phí sau mỗi gói A–E như §L6.7.
7. Xong F, như §L5.9 đợt 2 bước 7: đăng xuất app, thoát app, chép file phiên A–F ra `workbuddy\<gói>\session\`, `dot2.mjs remove`, so hash 15 báo cáo:

   ```powershell
   & { $ErrorActionPreference = 'Stop'; $old = @(Import-Csv C:\workspace\deep-review-1-6-r6\common\dot2-reports-hash.csv); $new = @(Get-FileHash C:\workspace\deep-review-1-6-r6\claude\*.md, C:\workspace\deep-review-1-6-r6\codex\*.md | Select-Object Path, Hash); if ($old.Count -ne 15 -or $new.Count -ne 15) { throw "Cần 15 báo cáo ở CSV và ở thư mục, thấy $($old.Count) / $($new.Count)" }; if (Compare-Object $old $new -Property Path, Hash) { throw 'Báo cáo của Claude / Codex đã đổi trong đợt 2' }; 'OK: 15 báo cáo không đổi' }
   ```

   rồi `gh auth login`.

Phiên bị cắt (dòng đầu báo cáo vẫn `ĐANG LÀM`) thì mở phiên mới với đúng tin nhắn của gói đó; bước 0 tự làm tiếp.

Bảng đánh dấu của Owner (21 ô; ghi thêm giờ bắt đầu / xong mỗi gói của Codex và WorkBuddy; với WorkBuddy: model, ngày hết hạn gói Pro, credit trước / sau phiên thử / sau từng gói / sau cùng, số bản app, chế độ quyền, file phiên của từng gói):

| Bên | A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|---|
| Claude Opus 5.5 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Codex GPT Sol 6.1 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | — | — | — |
| Agent WorkBuddy (đợt 2; model: …) | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | — | — | — |
| File phiên của WorkBuddy | … | … | … | … | … | … | — | — | — |
| Credit sau gói / số bản app của WorkBuddy | … | … | … | … | … | … | — | — | — |

## L6.10 Sau lượt 6

**Tổng hợp** (Issue tạo khi lượt 6 chạy xong; chạy khi Owner yêu cầu, sau khi đã gỡ ACL). Như §L5.10, đổi:

- Đọc đủ 21 báo cáo. Gộp bảng R1 (20 dòng) và R2 (14 dòng) từ báo cáo Claude; kiểm trên code mọi kết luận khác ĐÃ SỬA. Kiểm mọi phát hiện mới trên code, kể cả của Codex và WorkBuddy (dữ liệu tham khảo).
- **Xếp mỗi vấn đề theo K48** (chặn / không chặn, kèm mức, trục và lý do). Kết luận SẴN SÀNG / CHƯA SẴN SÀNG theo K48.
- **Gộp theo họ.** Vấn đề cùng nguyên nhân hay cùng mẫu thành một họ. Mỗi họ chặn phát hành thành một Issue sửa, với:
  - mục tiêu là một luật, không phải danh sách vị trí: ưu tiên sửa bằng cấu trúc (một hàm / component là đường duy nhất), rồi mới tới máy kiểm trên mọi chỗ. Máy kiểm cũng là code phải review (bộ chặn ký hiệu thành phát hiện ở ba lượt), nên chỉ thêm khi cấu trúc không đủ;
  - lệnh quét và danh sách mọi chỗ cùng mẫu (từ trường "Cùng mẫu" và phiên tổng hợp tự quét lại);
  - phần mô tả mà Issue để ngoài thì ghi rõ vào sổ ([sau v1.0]) hay ACCEPTED, không để im (bài học DR6-37 → 145 → 169);
  - **ngân sách dòng** (sản phẩm / test) = cỡ ước lượng.
- Vấn đề không chặn: một PR sổ ghi vào OPEN với nhãn [sau v1.0] (PR chỉ sửa sổ, không cần review).
- Bảng so ba bên như tổng hợp lượt 5 §2.2, cộng bảng độ trùng giữa các bên và ước số vấn đề còn sót theo từng cặp bên (chỉ để xem xu hướng; §L6.0).
- Câu hỏi cho Owner chỉ gồm: cách sửa vấn đề chặn khi có nhiều phương án; vấn đề không chặn nào Owner muốn kéo vào đợt sửa (mặc định không); đề xuất gỡ / gộp của phiên G (mặc định [sau v1.0], K49).
- Kiểm độc lập bằng log như §L5.10, đổi: đường dẫn `-r6`; danh sách cấm thêm `-r5`; agent WorkBuddy thay DeepSeek; quy tắc riêng 8 mới (mọi lệnh có `node` đặt PATH); quy tắc chung 7 (lệnh chạy công cụ của repo gọi `gh`); phiên Claude: mọi lần gọi Agent có `model` `sonnet` / `opus` và `effort` `xhigh`, không Workflow, subagent không gọi subagent, không subagent nào nhận việc không kèm đường dẫn prompt (tin nhắn giao việc có đường dẫn đủ của `prompt-claude.md` và chữ gói, Phụ lục W quy tắc riêng 4) (transcript của phiên và của subagent).
- Báo cáo gốc lưu ở repo như §L5.10: `docs/reviews/raw/<ngày tổng hợp>/{claude,codex,workbuddy}/<gói>.md`; bản tổng hợp `docs/reviews/<ngày>-deep-review-phase-1-6-luot-6-tong-hop.md`. Thư mục `deep-review-1-6-r6\` giữ trên Home PC tới v1.0.

**T-386 — PR sửa phát hiện** (tạo sau G1, merge trước bước chuẩn bị; đề xuất 10). Làm ngoài pipeline `auto-issues` (cổng review nằm trong rào "không tự sửa", K45). File: `.claude/skills/review-pr/SKILL.md`, `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/task.yml`, `docs/process/REVIEW-CHECKLIST.md`.

- Issue sửa phát hiện (deep review, sổ ghi chú) có hai trường: **ngân sách** (dòng sản phẩm / test) và **quét cùng mẫu** (lệnh và danh sách chỗ cùng mẫu).
- PR sửa có ba mục: **bằng chứng test đỏ khi gỡ phần sửa** (lệnh và kết quả); **quét cùng mẫu** (lệnh `rg` / probe, mọi chỗ cùng mẫu, quyết định từng chỗ); **cỡ so ngân sách**.
- `review-pr` chặn PR sửa khi thiếu một trong ba mục. Cỡ vượt 1,5× ngân sách: review ghi CHANGES, trừ khi thân PR có câu Owner đồng ý.
- `review-pr` xếp ghi chú không chặn theo K48: không chặn phát hành thì ghi sổ với nhãn [sau v1.0].

**Đợt sửa** (chỉ khi có vấn đề chặn): Issue theo họ; PR theo T-386; review-pr; merge như thường. Có vấn đề Medium trở lên: sau khi đợt sửa merge, một phiên sạch của Claude review lại đúng vùng đó: diff `<SHA ghim>..<main sau đợt sửa>` và các chỗ cùng mẫu, theo prompt phiên tổng hợp soạn (một Issue `gate`). Không phải lượt 7.

**Rồi G7** (như §L5.10): exe phát hành ở `main` mới; đợt sửa đổi màn hay hành vi nào thì nghiệm thu lại dòng NT đó (K46) và chụp lại ảnh hướng dẫn có màn đó; NT-EV-01 (eval AI thật, Owner bấm, G4) với version prompt cuối; cổng và probe trên SHA phát hành, so mốc sau #656. Lỗi G7 tìm ra xếp theo K48; đóng băng K49 giữ tới phát hành.

**Ước lượng.** Lượt 5 trên Home PC: Claude ≈ 3 h 44 cho 6 gói; Codex ≈ 1 h 51; DeepSeek ≈ 1 h 59.

- Claude: A–F ≈ 3–4 h (bảng R 34 dòng, lượt 5: 53); G–I ≈ 1–1,5 h mỗi phiên.
- Codex ≈ 2 h (không bảng R). Agent WorkBuddy: chưa có số của model mới; giả định ≈ 2–3 h.
- Cả lượt 6 ≈ 2 ngày tính cả chuẩn bị và hai đợt; tổng hợp thêm ≈ nửa ngày. Đợt sửa chỉ gồm vấn đề chặn (lượt 3–5: 0 Medium).
- Trước đó: PR kế hoạch này, T-386, T-387 (ba PR, cùng PR sổ).

## L6.11 Quyết định của Owner (06–07/11/2026) và đề xuất

**Đã chốt** (Issue #1117; Owner trả lời trong phiên soạn trên Home PC):

1. **Bên review:** 06/11: "chuẩn bị deep code base review round 7, 3 bên: Claude, Codex và 1 agent mạnh từ Workbuddy (có thể là Hy4 hoặc GLM 5.3)". 07/11: "Hãy ghi là lượt 6 cho đúng." Claude Opus 5.5, Codex GPT Sol 6.1, agent WorkBuddy; 21 báo cáo (§L6.1).
2. **Đổi cách làm:** Claude trình phân tích năm lượt và năm hướng; Owner 07/11: "Anh đồng ý với đề xuất 5 hướng đổi cách làm", rồi bảo Claude tự soát lại ("make no mistake, in this situation what could do better?"). Claude sửa bốn chỗ nói quá và thêm ba chỗ thiếu (vòng lặp của sổ ghi chú, chốt hậu quả trước khi chạy, bỏ bớt việc cho lượt không nặng hơn). Owner 07/11: "anh đồng ý, duyệt kế hoạch trừ 1 mục".
3. **Không có bài thi chọn model:** Owner 07/11: "bài thi chọn hy4 hay GLM 5.3 không cần làm, workbuddy đang làm và anh sẽ tự quyết định model nào" (§L6.7).
4. **Rà gọn:** Owner hỏi 07/11: "với hơn 60 file thêm, + 2252 dòng, liệu có cách rà soát để tránh làm nặng project không cần thiết không?" → phiên chủ đề G (§L6.3) và ngân sách dòng của Issue sửa (§L6.10, T-386).

**Đề xuất, Owner chọn cùng G1** (chi tiết của các hướng đã duyệt ở mục 2):

**Owner duyệt G1 ngày 07/11/2026** trong chat của phiên soạn (PR #1118): "Chọn như ghi" cho các đề xuất 5, 6, 8–12; đề xuất 7 Owner đổi trước đó cùng ngày (cột "Owner chọn").

| # | Đề xuất | Mục | Owner chọn |
|---|---|---|---|
| 5 | Tiêu chí K48: bảng §L6.1; trục chốt theo hậu quả; nhãn [sau v1.0] trong sổ; Owner được kéo vấn đề không chặn vào đợt sửa (mặc định không); Medium trở lên thì review lại đúng vùng đó, không lượt 7 | §L6.1, §L6.10 | Theo đề xuất (07/11/2026) |
| 6 | Đóng băng K49: phạm vi và ngoại lệ như §L6.1; đề xuất gỡ / gộp của phiên G mặc định [sau v1.0] | §L6.1 | Theo đề xuất (07/11/2026) |
| 7 | Ba phiên chủ đề của Claude: G (rà gọn), H (chữ người dùng nhập / hiển thị), I (bất đồng bộ và thứ tự), chạy sau Claude F, mỗi chủ đề một phiên sạch | §L6.3 | 07/11: **không dùng ultracode** ở mọi phiên Claude ("1 là nó rất tốn usage, 2 là chưa chắc hiệu quả đem lại đã hơn xhigh và max"); rồi "cho phép dùng subagent nhưng giới hạn ở sonnet 5.5 (xhigh) hoặc opus 5.5 (xhigh), không dùng ultracode" |
| 8 | Phủ bằng "file không đọc kỹ" thay chỉ tiêu kịch bản; bảng R chỉ Claude; bỏ mục Bloat / Hiệu năng ở A–E; trường "Cùng mẫu", "Chặn phát hành" | §L6.4, §L6.8, Phụ lục Y | Theo đề xuất (07/11/2026) |
| 9 | Agent WorkBuddy: hai đợt và ACL như lượt 5, chặn thêm `-r5`; Code review expert, quyền Default, agent phụ như lượt 5; chi phí chỉ credit gói Pro, không mua thêm, điểm dừng sau mỗi gói | §L6.7, §L6.9, Phụ lục Z | Theo đề xuất (07/11/2026) |
| 10 | T-386: review-pr, mẫu Issue / PR cho PR sửa phát hiện (test đỏ khi gỡ phần sửa, quét cùng mẫu, ngân sách dòng, ghi chú không chặn → [sau v1.0]); merge trước bước chuẩn bị | §L6.10 | Theo đề xuất (07/11/2026) |
| 11 | T-387: `dot2.mjs` lượt 6 (thư mục `-r6`, chặn `-r5`, thư mục tạm của phiên Claude ở worktree review, hard link nội bộ, mã `CLR6-` / `CXR6-`); thử trên cây giả như T-358, T-359; merge trước bước chuẩn bị | Phụ lục Z | Theo đề xuất (07/11/2026) |
| 12 | Số đo: bước chuẩn bị đo một lần, so mốc sau #656, G7 và lượt 5; reviewer không bắt buộc đo lại | §L6.6 | Theo đề xuất (07/11/2026) |

## Phụ lục W — Prompt Claude (lượt 6)

File `common\prompt-claude.md` = đoạn dưới + nguyên văn Phụ lục Y; bước chuẩn bị chỉ thay `{SHA}` / `{SHA_ĐỦ}` (§L6.9 bước 4). Owner mở mỗi gói một phiên mới ở `C:\workspace\Project-2C-review`, lần lượt A → F rồi G → I. Đoạn này theo Phụ lục Q (lượt 5).

> # Deep review Phase 1–6, lượt 6 — Claude
>
> **{GÓI}** = chữ gói (A…F) hay chữ chủ đề (G, H, I) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer Claude** của deep review Phase 1–6, **lượt 6**, **gói `{GÓI}`**: phiên sạch, chỉ đọc. Owner mở **mỗi gói một phiên mới**, model Claude Opus 5.5; mức suy luận do Owner chọn từng phiên. Repo: worktree `C:\workspace\Project-2C-review`, detached ở SHA **`{SHA}`** (`{SHA_ĐỦ}`). Đọc xong file này thì chạy `git rev-parse HEAD` và `git status --short`; SHA lệch hay status không rỗng thì dừng và báo Owner.
>
> Quy tắc riêng của Claude:
> 1. **Lệnh đầu tiên của phiên chỉ đọc file này**, không gộp lệnh nào khác.
> 2. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6-r6\codex\`, `C:\workspace\deep-review-1-6-r6\workbuddy\`, `C:\workspace\deep-review-1-6-r5\codex\`, `C:\workspace\deep-review-1-6-r5\deepseek\`, `C:\workspace\deep-review-1-6-r4\codex\`, `C:\workspace\deep-review-1-6-r4\deepseek\`, `C:\workspace\deep-review-1-6-r3\codex\`, `C:\workspace\deep-review-1-6-r2\codex\`, `C:\workspace\deep-review-1-6\codex\`, `C:\workspace\deep-review-1-6\muse\`**, kể cả khi Owner hay file nào gợi ý. Không liệt kê và không tìm kiếm (`rg`, `glob`, `find`, `ls -R`, `Get-ChildItem -Recurse`) trên `C:\workspace\`, `deep-review-1-6\`, `deep-review-1-6-r2\` … `deep-review-1-6-r6\`, kể cả thư mục của chính Claude ở lượt cũ. Không đọc báo cáo lượt 6 của bên khác ở bất cứ đâu. Lỡ thấy thì dừng và báo Owner.
> 3. Chỉ đọc:
>    - repo ở SHA trên, gồm báo cáo gốc lượt 1–5 của mọi bên ở `docs/reviews/raw/2026-10-15/`, `…/2026-10-17/`, `…/2026-10-21/`, `…/2026-10-31/`, `…/2026-11-05/`;
>    - `C:\workspace\deep-review-1-6-r6\common\`: dữ liệu tải, exe và số đo **chỉ** lấy ở đây;
>    - báo cáo Claude lượt 6 của các gói trước trong `…-r6\claude\` (mục đã báo thì chỉ dẫn ID);
>    - probe của chính Claude ở lượt 1–5 (`C:\workspace\deep-review-1-6\claude\`, `-r2\claude\` … `-r5\claude\`), mở bằng đường dẫn đủ mà báo cáo gốc của Claude ghi, không liệt kê thư mục.
> 4. Không dùng skill `review-pr` / `code-review`. Không làm nghi thức phiên của repo (HANDOFF, `/handoff`, PR, Issue, merge, commit). Không chạy `gh` (thông tin Issue / PR sửa có ở `common\fixes.md`). **Không dùng Workflow** (ultracode), kể cả khi phiên có bật ultracode. **Được dùng subagent** qua công cụ Agent (Owner 07/11), với ba điều kiện:
>    - mỗi lần gọi đặt rõ `model` là `sonnet` (Claude Sonnet 5.5) hoặc `opus` (Claude Opus 5.5) và `effort` là `xhigh`; không dùng `subagent_type: "fork"` (fork không nhận hai tham số này), không model khác, không mức khác;
>    - subagent không gọi subagent khác;
>    - chỉ phiên chính làm bước 0, ghi `{GÓI}.md` và in dòng `XONG`. **Tin nhắn giao việc cho subagent** nêu đường dẫn đủ `C:\workspace\deep-review-1-6-r6\common\prompt-claude.md` và chữ gói `{GÓI}`, và bảo subagent đọc quy tắc riêng 2–4 và phần chung của file đó trước khi làm. Subagent làm phần việc phiên chính giao, theo quy tắc 2–4 và phần chung; ghi probe vào `…-r6\claude\{GÓI}\`, không ghi `{GÓI}.md`. Phiên chính kiểm lại phát hiện của subagent trên code trước khi ghi vào báo cáo.
> 5. Ghi báo cáo vào `C:\workspace\deep-review-1-6-r6\claude\{GÓI}.md`, probe / bản chép / log vào `…-r6\claude\{GÓI}\`.
> 6. Gói F được đọc `…-r6\claude\A…E.md`. Chủ đề G, H, I được đọc `…-r6\claude\A…F.md` và báo cáo chủ đề trước. Xong gói nào thì dừng và in dòng `XONG …` (mục "Cuối phiên" của phần chung). Xong I thì **chờ Owner yêu cầu** tổng hợp, không tự tổng hợp.
> 7. Mục 1 của báo cáo ghi công cụ, model và mức suy luận của phiên, và subagent đã dùng: số lần, model, mức, việc giao (không dùng thì ghi "không").
> 8. **Gói A–F** làm cả hai phần của "Việc của gói" (bảng R và tìm lỗi mới). **Chủ đề G, H, I** chỉ tìm lỗi mới theo bảng "Chủ đề của Claude" ở phần chung, trên **mọi gói**; không làm bảng R, không kết luận SẴN SÀNG.
>
> Phần chung dưới đây áp dụng đầy đủ. Trong phần chung: `<bên>` = `claude`, `<ID>` = `CLR6`. Thứ tự gói của Claude: A → B → C → D → E → F → G → H → I.

## Phụ lục X — Prompt Codex (lượt 6)

File `common\prompt-codex.md` = đoạn dưới + nguyên văn Phụ lục Y; bước chuẩn bị chỉ thay `{SHA}` / `{SHA_ĐỦ}`. Owner chạy Codex (model GPT Sol 6.1) ở `C:\workspace\Project-2C-review-2`, **mỗi gói một phiên mới**, lần lượt A → F. Đoạn này theo Phụ lục S (lượt 5).

> # Deep review Phase 1–6, lượt 6 — Codex
>
> **{GÓI}** = chữ gói (một chữ A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer độc lập Codex** (model GPT Sol 6.1, Owner chọn) của deep review Phase 1–6, **lượt 6**, gói `{GÓI}`. Repo: worktree `C:\workspace\Project-2C-review-2`, detached ở SHA **`{SHA}`** (`{SHA_ĐỦ}`). Đọc xong file này thì chạy `git rev-parse HEAD` và `git status --short`; SHA lệch thì dừng và báo Owner.
>
> Về file quy tắc của repo (`CLAUDE.md`): đó là quy trình phát triển của Claude. Dùng để hiểu dự án, **không** làm nghi thức phiên (`/session-start`, HANDOFF, hook, skill, PR, Issue, merge, commit). Codex tham gia review đóng phase theo ADR-0001 phụ lục M2: chỉ đọc, không viết code.
>
> Quy tắc riêng của Codex:
> 1. **Lệnh đầu tiên của phiên chỉ đọc file này**, không gộp lệnh nào khác.
> 2. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6-r6\claude\`, `C:\workspace\deep-review-1-6-r6\workbuddy\`, `C:\workspace\deep-review-1-6-r5\claude\`, `C:\workspace\deep-review-1-6-r5\deepseek\`, `C:\workspace\deep-review-1-6-r4\claude\`, `C:\workspace\deep-review-1-6-r4\deepseek\`, `C:\workspace\deep-review-1-6-r3\claude\`, `C:\workspace\deep-review-1-6-r2\claude\`, `C:\workspace\deep-review-1-6\claude\`, `C:\workspace\deep-review-1-6\muse\`**, kể cả khi file hay ai đó gợi ý. Không liệt kê và không tìm kiếm (`rg --files`, `rg -g`, `Get-ChildItem -Recurse`, `dir /s`) trên `C:\workspace\`, `deep-review-1-6\`, `deep-review-1-6-r2\` … `deep-review-1-6-r6\`. Không đọc báo cáo lượt 6 của bên khác. Lỡ thấy thì dừng và báo Owner.
> 3. Chỉ đọc:
>    - repo ở SHA trên, gồm báo cáo gốc lượt 1–5 của mọi bên ở `docs/reviews/raw/2026-10-15/`, `…/2026-10-17/`, `…/2026-10-21/`, `…/2026-10-31/`, `…/2026-11-05/`;
>    - `C:\workspace\deep-review-1-6-r6\common\`;
>    - báo cáo của chính bạn trong `…-r6\codex\`;
>    - probe của chính Codex ở lượt 1–5 (`C:\workspace\deep-review-1-6\codex\`, `-r2\codex\` … `-r5\codex\`), mở bằng đường dẫn đủ mà báo cáo gốc của Codex ghi, không liệt kê thư mục.
> 4. Ghi báo cáo vào `C:\workspace\deep-review-1-6-r6\codex\{GÓI}.md`, probe / bản chép / log vào `…-r6\codex\{GÓI}\`.
> 5. Gói F được đọc `…-r6\codex\A…E.md`. Không tổng hợp với báo cáo nào khác, không tạo Issue, không đề xuất merge, không chạy `gh` (thông tin Issue / PR sửa có ở `common\fixes.md`).
> 6. Mục 1 của báo cáo ghi phiên bản Codex và model như công cụ cho biết. Hết hạn mức giữa gói thì ghi giờ dừng; khi Owner nhắn làm tiếp, ghi giờ làm tiếp.
> 7. **Không gọi `pnpm`**, kể cả `pnpm exec` và `pnpm vitest`: Corepack sẽ tải `pnpm` từ mạng (lượt 5, DNS của sandbox chặn). Gọi thẳng CLI trong `node_modules` (`node node_modules/vitest/vitest.mjs run …`, `node node_modules/@playwright/test/cli.js test …`). Cổng ở SHA ghim đã có ở `common\baseline.md`.
>
> Phần chung dưới đây áp dụng đầy đủ. Trong phần chung: `<bên>` = `codex`, `<ID>` = `CXR6`. Codex không làm bảng R. Thứ tự gói: A → B → C → D → E → F.

## Phụ lục Y — Phần chung của mọi prompt (lượt 6)

Nối nguyên văn vào cuối cả ba file `prompt-<bên>.md` của lượt 6; bước chuẩn bị chỉ thay `{SHA}`. `<bên>` = thư mục kết quả của bên đó (`claude`, `codex`, `workbuddy`), `<ID>` = `CLR6`, `CXR6`, `WBR6`. Đoạn này theo Phụ lục T (lượt 5), đổi theo §L6.4.

> ## Phần chung
>
> ### Bước 0 — kiểm gói, trước khi đọc code
>
> Kiểm từng file bằng tên đầy đủ (`Test-Path` hoặc mở file); **không liệt kê, không tìm kiếm thư mục**:
>
> 1. `{GÓI}` phải là **đúng một chữ** trong thứ tự gói của bên bạn (phần riêng ở đầu file). Không phải → dừng, hỏi Owner.
> 2. `C:\workspace\deep-review-1-6-r6\<bên>\{GÓI}.md`:
>    - **chưa có** → làm mới;
>    - có, và **dòng đầu bắt đầu bằng `ĐANG LÀM`** → phiên trước bị cắt: **làm tiếp**. Đọc hết file và thư mục `<bên>\{GÓI}\`, giữ mọi phát hiện đã ghi, làm nốt; ghi rõ là phiên làm tiếp, từ đâu, bằng công cụ / model / mức nào;
>    - có, mà dòng đầu **không** bắt đầu bằng `ĐANG LÀM` → gói đã xong: dừng, hỏi Owner, không ghi đè.
> 3. Báo cáo lượt 6 các gói **trước** `{GÓI}` (theo thứ tự gói của bên bạn) đã có đủ trong `…-r6\<bên>\` và không file nào còn dòng đầu `ĐANG LÀM`. Thiếu hay còn dở → dừng, báo Owner tên gói.
> 4. Đủ cả ba thì in đúng một dòng rồi làm tiếp, không chờ Owner: `Bắt đầu gói {GÓI} lượt 6 (<tên gói / chủ đề>) → <bên>\{GÓI}.md` (làm tiếp thì thêm `— làm tiếp phiên trước`).
>
> **Ghi báo cáo dần:** ngay sau bước 0, tạo `<bên>\{GÓI}.md` với dòng đầu `ĐANG LÀM — <bên> gói {GÓI} lượt 6, bắt đầu <giờ>` và mục 1 của báo cáo. Mỗi khi có dòng bảng R, kịch bản đã thử, phát hiện hay số đo thì **ghi ngay**. Chạy lệnh dài ở nền thì ghi vào file đang chờ gì trước khi chờ.
>
> **Cuối phiên**, khi báo cáo đủ các mục: đổi dòng đầu thành `XONG — <bên> gói {GÓI} lượt 6, <giờ xong>`. In đúng một dòng: `XONG gói {GÓI} lượt 6 → C:\workspace\deep-review-1-6-r6\<bên>\{GÓI}.md. Gói kế tiếp: <chữ kế tiếp> (mở phiên mới).` Gói cuối trong thứ tự của bên bạn in: `XONG cả <số gói> gói lượt 6 của <bên>. Chờ Owner yêu cầu tổng hợp.`
>
> ### Dự án và lượt này
>
> Project-2C: app desktop Tauri 2 + React, SQLite chạy trong webview qua sql.js; Rust chỉ ghi file, giữ API key, gọi OpenCode. App chạy offline, một người dùng, dữ liệu hiện là **giả lập**. App hiện tên **Heritas L-CRM** (logo, icon, tiêu đề cửa sổ); tên mã Project-2C giữ ở mọi chỗ khác (`common\known.md` K39).
>
> - Phase 1–4: nhân sự / team, khách hàng N4–N1, KYC có cấu trúc, lịch hẹn và kết quả, hợp đồng, chỉ số và báo cáo, xuất Excel, backup.
> - Phase 5: AI copilot (`packages/ai`), gồm Mock trích xuất dữ kiện KYC.
> - Phase 6: hàng đợi thay dữ liệu S-2, Thùng rác + khôi phục, hộp Xóa KH 5f, Dọn sạch Thùng rác (TR-11–TR-13), trạng thái lưu (chỉ báo ở sidebar, nút Thử lại, đóng app chờ lần thay đang chạy).
>
> **Lượt 1–5** (14/10–05/11) tìm `DR6-01…177`. **Lượt 5** (`37a80b6`, 04–05/11, ba bên): R1 24 / 25 và R2 28 / 28 ĐÃ SỬA, 0 HỒI QUY; 20 vấn đề mới `DR6-158…177`: 0 Medium, 13 Low, 7 Nit. Sau đó: đợt sửa lượt 5 (T-363…T-370) và mục sổ G7 (T-371…T-384). Lúc soạn kế hoạch, diff `37a80b6..b3721f4` ngoài tài liệu có 60 file, +2 252 / −236; số ở SHA `{SHA}` ghi trong `common\baseline.md`.
>
> **Lượt 6 là lượt deep review toàn bộ code cuối cùng trước v1.0, và đổi cách làm** (`plan.md` §L6.0, §L6.1):
>
> - Mỗi lượt trước là một lần lấy mẫu: cùng model chạy hai lần chỉ trùng khoảng một nửa, và lượt sau luôn tìm thêm lỗi có từ trước. **Đọc hết phạm vi**; không dừng khi thấy "đủ".
> - Đợt sửa sinh khoảng một nửa số lỗi của lượt sau (lượt 4: 9 / 23; lượt 5: 11 / 20): code đổi sau lượt 5 đọc kỹ nhất.
> - Họ lỗi quay lại vì chỉ sửa từng vị trí (tên liền dài: DR6-117 → 148 → 170; bộ chặn ký hiệu: DR6-37 → 145 → 169): mỗi phát hiện phải **quét mọi chỗ cùng mẫu** trong toàn repo (trường "Cùng mẫu").
> - Tiêu chí xong (`known.md` K48): chỉ Critical / High / Medium và Low ở trục D, S, G chặn phát hành; phần còn lại vào sổ "sau v1.0". **Vẫn báo mọi phát hiện**, kể cả Low / Nit, với mức đúng thước; trường "Chặn phát hành" là đề xuất của bạn, phiên tổng hợp chốt.
>
> ### Việc của gói
>
> 1. **Chỉ Claude, gói A–F: kiểm phần đã sửa (trục R), hai bảng** (`common\known.md` phần 4, 5, cột "Gói kiểm"):
>    - **R1, theo mã:** DR6-158…177. Mỗi dòng: chạy lại tái hiện của lượt 5; gỡ tạm phần sửa (trên bản chép, hoặc patch gỡ ngay), xem test của PR sửa có đỏ; thử biến thể gần. **Kiểm theo mô tả của DR6 ở tổng hợp lượt 5 §6 và báo cáo gốc**, không chỉ theo danh sách việc trong Issue sửa. Mục sửa bằng tài liệu (DR6-165, DR6-171): dòng ghi có và khớp app / số đo.
>    - **R2, theo Issue:** T-371…T-384 (danh sách đủ ở `known.md`). Mỗi dòng: mục tiêu và test chấp nhận của Issue (`common\fixes.md`) đúng trên code; gỡ tạm ít nhất một phần sửa chính, xem test có đỏ; thử biến thể gần của các ghi chú Issue gom. Issue chỉ tài liệu: dòng ghi có và khớp.
>
>    Kết luận: **ĐÃ SỬA** (đường lỗi cũ đã hết, có test đỏ khi gỡ phần sửa; biến thể còn hở ghi thành phát hiện riêng) · **SỬA MỘT PHẦN** · **CHƯA SỬA** · **HỒI QUY** (phần sửa làm hỏng chỗ trước đó đúng). Ba kết luận sau kèm một phát hiện có trường "Liên quan".
>
>    Codex, agent WorkBuddy và Claude G–I **không làm bảng R**: mọi dòng R là KNOWN. Thấy phần sửa hỏng thì ghi phát hiện mới, "Liên quan: DR6-xx" hay "Liên quan: T-xxx".
> 2. **Mọi bên: tìm lỗi mới và edge case mới** trên **toàn bộ** phạm vi gói (Claude G–I: phạm vi của chủ đề, trên mọi gói), theo thứ tự:
>    - diff `37a80b6..{SHA}` của gói, đọc kỹ nhất (`git diff 37a80b6 {SHA} -- <đường dẫn>`; bảng commit ở `plan.md` §L6.2);
>    - phần còn lại của gói, **từng file** trong `common\files-{GÓI}.txt` (Claude G–I: theo bảng "Chủ đề của Claude");
>    - chuỗi nhiều bước qua nhiều gói, nhất là ở gói F.
>
>    Mục "Kịch bản đã thử" là nhật ký, không có số tối thiểu. Trong "Phạm vi đã đọc", ghi **file nào của `files-{GÓI}.txt` bạn không đọc kỹ, và vì sao**. Chỗ các lượt trước ghi "đã xét, không thấy" vẫn đáng xét lại; báo cáo lượt 1–5 ở `docs/reviews/raw/` cho biết đã thử gì.
>
> Thông tin từng Issue / PR sửa (mục tiêu, test chấp nhận, phần PR ghi lệch / chưa làm, ghi chú sổ đã gom): `common\fixes.md`. Diff một PR: `git show <commit>`.
>
> ### Kế hoạch và phạm vi gói
>
> Kế hoạch đầy đủ: `C:\workspace\deep-review-1-6-r6\common\plan.md`. Lượt 6 ở §L6.0–§L6.11; mục nào §L6 không nói khác thì như lượt 5 (§L5) và các lượt trước; trục và thước mức ở §4; định dạng ở §L6.8. Phạm vi gói như lượt 1–5 (luật xếp gói của `tools/size-report-core.mjs`; danh sách file ở `common\files-<gói>.txt`; đọc thêm chỗ code gói khác mà gói nối vào). Số dòng dưới là lúc soạn (`b3721f4`); số ở SHA ghim trong `common\baseline.md`. Cột R1 / R2 chỉ cho Claude.
>
> | Gói | Đường dẫn | SP / test lúc soạn | R1 | R2 | Code đổi sau lượt 5 (đọc trước) |
> |---|---|---|---|---|---|
> | A. Lõi dữ liệu | `packages/domain/**`, `packages/db/**` | 8 781 / 15 965 | 158, 159, 160 | T-377 | `byName` và bộ nhớ khóa (T-363); `isLabel` hỏi trống qua `normalizeText` (T-363); luật nhập backup chỉ nhận mã KH dạng app sinh (T-368, K50): file do exe lượt 5 / exe ứng viên xuất còn nhập được; `searchText` ở domain (T-377); `trash.ts` cho tên nút khôi phục (T-368, T-377, T-380, T-382) |
> | B. File và Rust | `apps/desktop/src-tauri/**`, `apps/desktop/src/data/**` trừ file AI | 2 465 / 5 762 | 161–163 | T-374, 381, 382, 384 | `persist-queue.ts`: một `drain` mỗi lượt, `idle()` chờ lượt ghi do listener mở (T-364, T-374), với chuỗi lưu / thay / đóng app chồng nhau; `app-data.ts` (T-364); test hợp đồng capability (T-364, T-374, T-381, T-382, T-384): có giữ đúng quyền thật của bản build không |
> | C. AI | `packages/ai/**`; file AI của app (`ai-*`, `*-ai-*`, `*Ai.tsx`, `KycExtraction`, `KycIntelligence`, `KycWebSession`, `KycHistory`, `extraction-view`) | 6 610 / 8 262 | 164–168 | T-375 | Mock trích xuất: `worded`, "bé" nghĩa nhỏ, "–" làm gạch đầu dòng, "đứa / thằng … đã mất" (T-365, T-375; K42, K50), thử trên câu thật và câu tự dựng; luật câu dán trống của ChatGPT web (T-365, T-375); rule `test-support` (T-365, T-375) |
> | D. Màn nhập liệu | `packages/ui/**` (trừ `scripts/`), `apps/desktop/src/{shell,i18n}/**`, `routes/customers/**` (trừ file AI và Hợp đồng), `routes/team/**`, `routes/Screen.tsx`, `routes/{classes,money-view}.ts`, `routes/stage-badge.tsx`, file gốc `apps/desktop/src/*`, `apps/desktop/index.html` | 8 230 / 3 271 | 169, 170 | T-376 | Bộ chặn ký hiệu `token-guard.ts` (ký hiệu, escape, thực thể HTML, dấu nối JSX, `concat(`; T-366, T-376): bỏ sót lẫn báo nhầm trên code thật; `SelectField`, trần tên ô bảng (T-376); tên liền dài ở mọi màn (T-367, `e2e/long-names.spec.ts`) |
> | E. Lịch hẹn, chỉ số, quản lý | `routes/{appointments,overview,reports}/**`, `routes/{Overview,Settings*,RestoreDialog,FilterBar,ConfirmWordDialog}.tsx` (trừ `SettingsAi.tsx`), `routes/{trash-view,period-labels,applied-filter}.ts`, Hợp đồng (`routes/customers/{CustomerPolicies,PolicyDialogs,policy-form}.*`) | 8 466 / 5 024 | 160, 170, 172–174 | T-377, 380, 382 | Tên nút khôi phục và vế "xóa lúc" ở Thùng rác (`trash-view.ts`, `SettingsTrash.tsx`, `RestoreDialog.tsx`; T-368, T-377, T-380, T-382; K50); hai ô tìm (`searchCustomers`, `filterTrash`); hộp HĐ (T-368); ô chọn góc nhìn (T-367) |
> | F. Xuyên gói, bloat / hiệu năng, công cụ | `tools/**`, `e2e/**`, `.github/**`, `.githooks/**`, `.claude/**`, `packages/ui/scripts/`, `apps/desktop/vite.config.ts`, file gốc repo (gồm `eslint.config.js`, `.dependency-cruiser.cjs`); **luồng xuyên gói; toàn codebase cho bloat và hiệu năng** | 5 017 / 19 068 | 165 (đo), 167, 171, 175–177; **R1 gộp đủ 20 dòng** | T-371, 372, 373, 375, 378, 379, 383; **R2 gộp đủ 14 dòng** | `tools/auto-wait*` (T-369, T-373, T-378, T-379, T-383; K45) qua unit test hay `gh` giả, không gọi GitHub thật (quy tắc chung 7); `notes-core`, `review-hint-core`; probe `metRows` (T-369, T-372); `.dependency-cruiser.cjs` (T-365, T-375); e2e mới / đổi (`long-names`, `customer-policies`, `trash`, `appointments`, `dialog-keyboard`). Chuỗi nhiều bước; bloat / bundle / exe so lượt 5; kết luận SẴN SÀNG / CHƯA SẴN SÀNG |
>
> **Chủ đề của Claude** (chỉ Claude, sau gói F; mỗi chủ đề trên **mọi gói**):
>
> | Chủ đề | Đọc gì | Hỏi gì | Ra gì |
> |---|---|---|---|
> | **G. Rà gọn** | diff `37a80b6..{SHA}`; code của các họ DR6-160, 169, 170 | Mỗi khối thêm vào: (1) đã có hàm / component sẵn làm được chưa (`rg`, bản đồ `pnpm codemap` trong `CLAUDE.md` của package); (2) code chỉ phục vụ một ca Nit có cân với chi phí giữ không; (3) test lặp giữa unit và e2e, hay ca thừa; (4) code chỉ cho test / công cụ nằm trong package sản phẩm hay lọt vào bundle. Cỡ bundle / exe so lượt 5 (`baseline.md`) | Phát hiện trục B kèm cỡ gỡ / gộp ước lượng, rủi ro, test giữ hành vi; lỗi đúng-sai thấy trên đường ghi như mọi phát hiện. Đóng băng (K49): gỡ trước v1.0 chỉ khi Owner chọn |
> | **H. Chữ người dùng nhập và hiển thị** | Mọi chỗ đọc chữ người dùng (ô nhập, dán, nhập backup, ô tìm), hỏi trống / độ dài / so sánh, lưu, hiện (bảng, hộp, tên nút, `aria-*`, chart, Excel, câu lỗi) | Có đi qua đúng hàm chuẩn của `packages/domain` (`normalizeText`, `searchText`, …) không; chuỗi liền dài, ký tự vô hình, NFC / NFD, emoji, xuống dòng, chữ rất dài; tên truy cập trùng trong cùng danh sách; chữ người dùng vào HTML / chart có escape không | Phát hiện kèm bảng quét: lệnh `rg` / probe, mọi chỗ cùng mẫu, chỗ nào sai |
> | **I. Bất đồng bộ và thứ tự** | Hàng đợi lưu (`persist-queue.ts`, `listeners.ts`), thay dữ liệu S-2, `close-guard`, `AppData`, `ai-jobs.ts` theo `generation`, `today.ts`, hộp xác nhận lúc chạy | Hai việc chồng nhau; listener gọi lệnh lồng; lỗi giữa chừng; tắt app / Nạp lại / Nhập backup giữa lúc lưu hay AI chạy; qua nửa đêm | Phát hiện kèm chuỗi đã dựng (probe qua lớp dữ liệu của app, bản build web hay exe) |
>
> ### Đọc trước
>
> - Như lượt 1–5: `CLAUDE.md` (gốc + của package trong gói), `CONTEXT.md`, `docs/design/phase-6-hoan-thien.md` (§4: S-2, Thùng rác TR-1…TR-13 và D1–D13; §5 ngưỡng).
> - Spec / golden / mockup theo gói:
>   - A: `phase-3-du-lieu.md` §4, §6, `phase-4-chi-so.md`, `docs/golden/{chi-so,kh-theo-nhom,kyc,lich-hen}.md`, ADR-0007, ADR-0008;
>   - B: ADR-0016, ADR-0009 phụ lục D-1, spec Phase 6 §4.1;
>   - C: `phase-5-ai.md` (gồm §6.1, §7, §10 Mock trích xuất), `phase-5-prompts.md` (gồm §11–§14), `docs/golden/ai-eval.md`, ADR-0009;
>   - D / E: `docs/design/mockups/` (gồm `index.html`, `forms.css` `.choice`, `trash.html`, `settings-data.html`), spec Phase 3 / 4 / 6, ADR-0013, `docs/testing/nghiem-thu-v1.md` ("Các lượt thử", "Lệch mockup đã biết");
>   - F: tất cả khi cần, `docs/metrics/phase-6.md`, `e2e/perf/README.md`, `.claude/skills/auto-issues/SKILL.md` (để hiểu `tools/auto-wait*`).
> - Thêm cho lượt 6: tổng hợp lượt 5 `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md` (§3 bảng R, §6 mô tả DR6-158…177, §7 số đo, §9 quyết định Owner, §10.1), tổng hợp lượt 1–4, `common\known.md`, `common\fixes.md`, `common\baseline.md`.
> - **Spec, golden, mockup đã duyệt là nguồn đúng**: không đề xuất sửa chúng cho khớp code; chỗ chúng mâu thuẫn nhau thì báo là phát hiện trục C.
>
> ### Quy tắc chung
>
> 1. **Chỉ đọc và chạy lệnh: không sửa file trong repo, không sửa lỗi, không commit, không viết code sản phẩm.**
>    - Muốn thử "phá code" (đột biến, gỡ phần sửa) thì chép file vào thư mục kết quả của mình rồi chạy bản chép. Nếu buộc phải patch trong repo thì gỡ ngay sau khi chạy và kiểm lại bằng `git status` / sha256.
>    - **Trong bản chép repo không chạy `pnpm`, kể cả `pnpm exec`**: dùng junction sẵn có, gọi thẳng `node node_modules/<gói>/<cli>`.
>    - Cuối phiên `git status --short` của repo phải như đầu phiên (thư mục build / cache bị ignore thì không sao).
> 2. **Không gọi dịch vụ AI của sản phẩm:** không `pnpm eval:ai` / `node tools/eval-ai.mjs`, không bấm "Kiểm tra kết nối" bằng key thật, không đọc / in key trong Windows Credential Manager (`cmdkey`…), không mở chatgpt.com. Dùng adapter Mock, `fetch` / HTTP giả, hoặc server HTTP local tự dựng trong thư mục của mình. **Mọi probe trình duyệt chặn mạng ngoài `127.0.0.1` và thay `window.open` ngay từ lần chạy đầu.**
> 3. `pnpm e2e` dùng cổng cố định 4173: không chạy cùng lúc với bên khác; báo cổng bận thì chờ, **không** dùng `PW_REUSE=1`. Kết quả cổng ở SHA ghim đã có ở `common\baseline.md`, không bắt buộc chạy lại toàn bộ. Số bundle lấy ở `baseline.md`; tự `pnpm build:web` thì không đặt biến môi trường riêng (vd. `VITE_DEMO_ANCHOR`), hoặc ghi rõ đã đặt gì.
> 4. Môi trường Windows: `pnpm` lỗi trong shell hiện tại thì chạy qua `powershell -NoProfile -Command "pnpm …"` (Codex không gọi `pnpm`: quy tắc riêng 7). Repo cần Node ≥ 24 (Home PC: `C:\Program Files\nodejs\node.exe`); shell có `node` cũ hơn trong PATH thì **mọi lệnh có `node`** (kể cả `node -e`), `pnpm`, vitest hay Playwright đặt `C:\Program Files\nodejs` lên đầu PATH ngay trong lệnh đó (tiến trình con lấy `node` theo PATH). Không dùng `python3` (stub, có thể treo). Script tạm viết bằng `node` (`.mjs` trong thư mục của mình). Probe PowerShell **không dùng hai biến chỉ khác hoa / thường** (PowerShell coi là một).
> 5. Mục có trong `common\known.md` gắn `KNOWN`, chỉ nêu khi có bằng chứng mới: sổ OPEN / ACCEPTED ở SHA ghim, quyết định Owner K1–K50, "Lệch mockup đã biết", các mục KNOWN của phần 4. Dòng của bảng R1 / R2 chỉ ghi ở bảng R của Claude A–F, không ghi lại thành phát hiện; phần sửa còn thiếu / hồi quy thì ghi phát hiện mới, "Liên quan: DR6-xx" hay "Liên quan: T-xxx". DR6 đã sửa ở lượt 1–5 hỏng lại → phát hiện mới, "Liên quan: DR6-xx".
> 6. **Kết luận về màn** dựng probe qua lớp dữ liệu của app (`apps/desktop/src/data`: `openAppData`, `tables`), hoặc chạy trên bản build web bằng Playwright, hoặc trên exe qua cổng debug. Không gọi thẳng lệnh `db` / chèn SQL thô; probe `db` thô chỉ để kết luận về lệnh. Không có môi trường DOM thì dựng bản build, không dừng ở PLAUSIBLE. Dòng R về màn cũng vậy: không kết luận bằng đọc code.
> 7. **Không chạy công cụ của repo gọi `gh` hay GitHub** (`tools/auto-wait.mjs`, `tools/pr-status.mjs`, `tools/merge-pr.mjs`, `tools/handoff.mjs`, `tools/status.mjs` và lệnh tương tự): lượt 5, một lệnh làm `gh` thật chạy qua `auto-wait.mjs`. Kiểm chúng bằng unit test của repo, hay chạy phần lõi (`*-core.mjs`) trên bản chép với `gh` giả.
>
> ### Cách tìm
>
> - Đọc sâu **từng file** trong phạm vi gói (phần diff `37a80b6..{SHA}` đọc kỹ nhất). Đi qua **mọi trục**: E edge case · C đúng hợp đồng / spec / mockup / nhãn UI theo nghĩa thường · D dữ liệu · G guardrail AI · S an toàn ở ranh giới · P hiệu năng · B bloat · T chất lượng test · A trợ năng / i18n (định nghĩa ở `plan.md` §4.1, §L2.4; R chỉ ở bảng R của Claude A–F). Trục không có gì thì ghi "đã xét, không thấy" **kèm đã chạy / đọc gì**.
> - **Chạy thử thay vì lập luận từ spec** ở mọi chỗ chạy được. Ưu tiên **kịch bản nhiều bước qua nhiều gói**: các lỗi Medium của lượt 1, 2 và của review Phase 5 đều chỉ lộ khi dựng chuỗi (xóa → đổi → khôi phục; bàn giao → ghi kết quả → hẹn tiếp → chỉ số; ghi bù cuộc gặp trước ngày tạo KH; dán lại chính tin nhắn của app; khôi phục backup cùng DB giữa lúc AI chạy). Đừng báo lại chính các ca đó: dùng chúng làm mẫu để nghĩ ca mới.
> - **Cùng mẫu:** thấy một lỗi thì tìm **mọi chỗ cùng mẫu trong toàn repo**, không chỉ trong gói: `rg` theo hàm / mẫu code; probe trên mọi màn, mọi cột, mọi lệnh cùng loại. Ghi lệnh đã chạy và danh sách vào trường "Cùng mẫu"; "không có chỗ khác" cũng ghi lệnh. Nhiều chỗ cùng nguyên nhân là **một** phát hiện kèm danh sách. Đề xuất sửa nhắm cả họ: một hàm / component là đường duy nhất, hay máy kiểm trên mọi chỗ.
> - **Bloat và Hiệu năng là hai mục bắt buộc chỉ ở gói F** (cho toàn codebase; số cổng, bundle, exe, probe ở `baseline.md`, đo thêm chỉ chỗ mình nghi) và ở chủ đề G của Claude (bloat của diff). Ở các gói khác, phát hiện P / B ghi như mọi phát hiện.
> - Hiệu năng: **mọi phát hiện P phải có số đo** trên dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (sinh lại ở SHA ghim; hash ở `baseline.md`; dùng trong Node qua `importBackup` của `@p2c/db`, trong app qua Cài đặt → Dữ liệu → Nhập backup). So với ngưỡng `docs/metrics/phase-6.md` (gồm Dọn sạch ≤ 500 ms) và mốc Home PC (`plan.md` §L6.6: mốc sau #656, G7, lượt 5 cùng máy; luật nhiễu: quá 20 % **và** quá 10 ms). Ghi máy, bản Node và việc gì đang chạy song song. Đo trên exe: chép `common\exe\project2c.exe` vào thư mục của mình, cổng debug khác 9222, theo `e2e/perf/README.md`; không đo khi bên khác đang đo.
> - **Không cài công cụ mới** (`knip`, `jscpd`, `cargo-bloat`, visualizer… là G4); thấy cần thì ghi đề xuất.
> - Không bình luận phong cách / đặt tên trừ khi gây lỗi. Không đặt chỉ tiêu số lượng phát hiện; không nâng mức cho nổi.
>
> ### Khuôn phát hiện
>
> ```
> ID: <ID>-<gói><số>   (vd. <ID>-A3)
> Mức: Critical | High | Medium | Low | Nit
> Trục: E | C | D | G | S | P | B | T | A
> Vị trí: path:dòng ({SHA})
> Tình trạng: CONFIRMED | PLAUSIBLE | KNOWN
> Liên quan: DR6-xx / T-xxx (nếu có) · mới do đợt sửa sau lượt 5 (PR #…) | có từ trước, lượt 1–5 bỏ sót
> Mô tả: một-hai câu
> Tái hiện / bằng chứng: lệnh + kết quả, hoặc probe / test tạm (nguồn ở phụ lục)
> Cùng mẫu: lệnh rg / probe đã chạy; mọi chỗ cùng mẫu (path:dòng) và chỗ nào sai
> Ảnh hưởng: ai / khi nào gặp
> Chặn phát hành: có | không — theo K48 (mức + trục), một câu lý do
> Đề xuất: hướng sửa cho cả họ; cỡ ước lượng (dòng sản phẩm / dòng test)
> ```
>
> - **Thước mức** (như lượt 1–5): Critical = mất dữ liệu đã lưu, hỏng file DB, lộ API key, chạy được code lạ — ở thao tác bình thường. High = thao tác bình thường làm dữ liệu sai lặng lẽ (lan sang chỉ số / báo cáo / backup mà người dùng không nhận ra) hoặc chặn hẳn việc chính không có đường vòng. Medium = thao tác bình thường dẫn tới dữ liệu sai / không đảo ngược được hoặc chặn việc chính (có đường vòng); thao tác chính vượt ngưỡng hiệu năng đã chốt. Low = cần điều kiện hiếm (file sửa tay, output suy biến, server bất thường, thao tác UI không cho), chỉ sai hiển thị, test hở, bloat có chi phí đo được. Nit = chữ, dọn dẹp, bloat không đo được chi phí.
> - **Bằng chứng phải thật.** Mỗi `path:dòng` phải đúng với file ở SHA ghim (đọc lại trước khi ghi). `CONFIRMED` chỉ khi đã chạy lệnh / probe và dán lệnh + trích kết quả thật; chưa chạy thì `PLAUSIBLE` và nói đã đọc gì. Không bịa số đo, tên hàm, tên test hay kết quả lệnh.
>
> ### Báo cáo
>
> File `C:\workspace\deep-review-1-6-r6\<bên>\<gói>.md`, tiếng Việt (thuật ngữ ngành giữ tiếng Anh như repo; không chen từ của ngôn ngữ khác), gồm theo thứ tự:
>
> 1. Bên, gói, SHA đầu phiên, `git status --short` đầu phiên, giờ bắt đầu, công cụ / model / mức suy luận.
> 2. (Chỉ Claude A–F) **Bảng R1** mọi dòng mà gói kiểm, và **bảng R2** mọi Issue mà gói kiểm, cùng cột: `| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |`.
> 3. **Phạm vi đã đọc:** phần diff `37a80b6..{SHA}` của gói; file của `common\files-{GÓI}.txt` không đọc kỹ và vì sao (Claude G–I: phạm vi chủ đề đã đi qua).
> 4. **Kịch bản đã thử**: `| # | Kịch bản | Kết quả | ID |`.
> 5. Phát hiện mới theo khuôn trên.
> 6. (Gói F; Claude G) mục **Bloat**; (gói F) mục **Hiệu năng**: bảng số, so mốc sau #656, G7 và lượt 5.
> 7. Bảng đếm mức × trục; số phát hiện bạn xếp chặn / không chặn; nói rõ nếu tỉ lệ PLAUSIBLE cao.
> 8. "Đã xét, không thấy" theo từng trục.
> 9. Phụ lục: nguồn probe / test tạm / đột biến (cái nào bị test giết, cái nào sống), `git status --short` cuối phiên, giờ xong.
>
> **Gói F** (mọi bên): kết luận **SẴN SÀNG / CHƯA SẴN SÀNG cho v1.0 ở SHA `{SHA}`** kèm lý do, theo K48 trong `known.md`: CHƯA SẴN SÀNG khi có phát hiện bạn xếp chặn phát hành (Claude: cả dòng R không ĐÃ SỬA mà phần còn hở chặn); không có thì SẴN SÀNG, kể cả khi còn phát hiện không chặn. Claude F thêm **bảng R1 gộp đủ 20 dòng** và **bảng R2 gộp đủ 14 dòng** (từ báo cáo A–E lượt 6 của chính Claude + phần F). Claude G–I không kết luận.
>
> Xong gói thì làm như mục "Cuối phiên" của Bước 0. Không tổng hợp, không so với bên khác, không tạo Issue, không đề xuất merge.

## Phụ lục Z — Prompt, app và `dot2.mjs` của agent WorkBuddy (lượt 6)

**Prompt.** File `common\prompt-workbuddy.md` = đoạn dưới + nguyên văn Phụ lục Y; bước chuẩn bị chỉ thay `{SHA}` / `{SHA_ĐỦ}`. Owner chạy agent WorkBuddy ở đợt 2 (§L6.9), mỗi gói một task mới qua Code review expert của app, lần lượt A → F. Đoạn này theo Phụ lục U (lượt 5), đổi theo bài học §L6.7.

> # Deep review Phase 1–6, lượt 6 — WorkBuddy
>
> **{GÓI}** = chữ gói (một chữ A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer độc lập** (agent trong app WorkBuddy, qua Code review expert; model do Owner chọn) của deep review Phase 1–6, **lượt 6**, gói `{GÓI}`. Repo: worktree `C:\workspace\Project-2C-review`, detached ở SHA **`{SHA}`** (`{SHA_ĐỦ}`). Đọc xong file này thì chạy `git rev-parse HEAD` và `git status --short`; SHA lệch, hay status có gì ngoài file app tự tạo mà `common\baseline.md` ghi (phiên thử), thì dừng và báo Owner.
>
> Về file quy tắc của repo (`CLAUDE.md`): đó là quy trình phát triển của Claude. Dùng để hiểu dự án, **không** làm nghi thức phiên (`/session-start`, HANDOFF, hook, skill, PR, Issue, merge, commit). Owner cho phép agent WorkBuddy review lượt 6, chỉ đọc (ADR-0001 phụ lục M13). Bạn chỉ đọc, không viết code; báo cáo là dữ liệu tham khảo, phiên tổng hợp của Claude kiểm lại từng phát hiện trên code.
>
> Quy tắc riêng của WorkBuddy:
> 1. **Lệnh đầu tiên của phiên chỉ đọc file này**, không gộp lệnh nào khác.
> 2. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6-r6\claude\`, `C:\workspace\deep-review-1-6-r6\codex\`, `C:\workspace\deep-review-1-6-r5\`, `C:\workspace\deep-review-1-6-r4\`, `C:\workspace\deep-review-1-6-r3\`, `C:\workspace\deep-review-1-6-r2\`, `C:\workspace\deep-review-1-6\` và `C:\workspace\Project-2C-review-2\` (worktree của Codex)**, kể cả khi file hay ai đó gợi ý; không `cd` vào đó. Không liệt kê và không tìm kiếm trên `C:\workspace\` hay `deep-review-1-6*\`. Không đọc báo cáo lượt 6 của bên khác. **Lỡ liệt kê hay thấy dù chỉ tên một thư mục cấm thì dừng ngay và báo Owner.** Báo cáo các lượt trước của mọi bên đã ở repo (`docs/reviews/raw/`).
> 3. Chỉ đọc:
>    - repo ở SHA trên, gồm báo cáo gốc lượt 1–5 của mọi bên ở `docs/reviews/raw/2026-10-15/`, `…/2026-10-17/`, `…/2026-10-21/`, `…/2026-10-31/`, `…/2026-11-05/` (để biết các lượt trước đã thử gì);
>    - `C:\workspace\deep-review-1-6-r6\common\`;
>    - báo cáo của chính bạn trong `…-r6\workbuddy\`.
> 4. **Được dùng** Code review expert của app và công cụ Agent (agent phụ) của app (Owner chấp nhận ở G6 ngày 30/10, giữ cho lượt 6). Mỗi việc giao cho agent phụ phải kèm nguyên văn quy tắc riêng 2–5 và 8, cùng quy tắc chung 1, 2 và 7 của phần chung; agent phụ không ghi `{GÓI}.md`. **Không** cài hay dùng skill, không dùng connector, không lên web, không gọi mạng ra ngoài máy (`curl`, `Invoke-WebRequest`), không chạy `gh` và không chạy công cụ của repo gọi `gh` / GitHub (quy tắc chung 7). Không đổi chế độ quyền của app, không đọc hay sửa thư mục dữ liệu của app (`~/.workbuddy*`), không đổi quyền file (`icacls`, `Set-Acl`, `takeown`), không chạy `common\dot2.mjs`. Không đọc file đăng nhập hay dữ liệu của Claude / Codex (`~/.codex`, `~/.claude*`, `%APPDATA%\Claude`, `%LOCALAPPDATA%\OpenAI`, `%TEMP%\claude`), Windows Credential Manager (`cmdkey`, `vaultcmd`, mọi API đọc thông tin đăng nhập). Lệnh hay công cụ bị từ chối thì không thử cách khác để đọc cùng chỗ. Thông tin Issue / PR sửa có ở `common\fixes.md`.
>    - **Ghi:** file bạn tạo (báo cáo, probe, bản chép, log, script) chỉ nằm trong `…-r6\workbuddy\` (quy tắc riêng 5). Không ghi gì vào `…-r6\common\`, `…-r6\claude\`, `…-r6\codex\`; không sửa file được theo dõi, trừ phần vá dưới. Ngoài `workbuddy\` chỉ có:
>      - những gì lệnh build, test hay trình duyệt tự ghi: thư mục build / cache bị ignore trong worktree (vd. `apps\desktop\dist`, `node_modules\.vite`) và thư mục tạm của hệ thống;
>      - file app tự tạo trong worktree mà `common\baseline.md` ghi (quy tắc riêng 5);
>      - phần vá rồi trả nguyên byte theo quy tắc chung 1.
> 5. Ghi báo cáo vào `C:\workspace\deep-review-1-6-r6\workbuddy\{GÓI}.md`, probe / bản chép / log vào `…-r6\workbuddy\{GÓI}\`. Cuối phiên `git status --short` của repo như đầu phiên: rỗng, hoặc chỉ có file app tự tạo mà `common\baseline.md` ghi.
> 6. Gói F được đọc `…-r6\workbuddy\A…E.md`. Không tổng hợp với báo cáo nào khác, không tạo Issue, không đề xuất merge.
> 7. Mục 1 của báo cáo ghi app WorkBuddy (bản theo `common\baseline.md`), expert, model (tên đúng như app hiện), context, mức suy luận và bản Node đã dùng.
> 8. **Node và Playwright:** shell của app có Node 22 trong PATH (lượt 4–5), mà repo cần Node ≥ 24. **Mọi lệnh shell có `node`** (kể cả `node -e`, `node --version`), `pnpm`, vitest, Playwright hay công cụ trong `node_modules` **đặt `C:\Program Files\nodejs` lên đầu PATH ngay trong lệnh đó**, kể cả khi lệnh trước đã đặt (tiến trình con như shim `node_modules\.bin\*.cmd` hay `webServer` `node e2e/serve.mjs` của Playwright lấy `node` theo PATH): PowerShell `$env:Path = 'C:\Program Files\nodejs;' + $env:Path; …`, Git Bash `export PATH="/c/Program Files/nodejs:$PATH"; …`. Lệnh đầu tiên của phiên có đặt PATH in `node --version`: phải ≥ 24, ghi vào mục 1; dưới 24 thì dừng, báo Owner. Lượt 5, 14 lệnh `node -e` không đặt PATH. Playwright luôn có `--output C:\workspace\deep-review-1-6-r6\workbuddy\{GÓI}\pw` (shim xóa file của app chặn ghi `test-results\` khi quá 50 file).
> 9. Bài học của reviewer chạy trong app WorkBuddy ở review Phase 5, lượt 4 và lượt 5 (`docs/reviews/2026-10-10-danh-gia-deepseek-muse.md` §6, §7; tổng hợp lượt 4 §2.2; tổng hợp lượt 5 §2.2, §10.1):
>    - lỗi Medium của các lượt trước đều cần **chuỗi nhiều bước qua nhiều gói**; kết luận ở F nêu đã thử những chuỗi nào;
>    - kết luận ở F áp quyết định Owner trong `known.md` (K48): ở review Phase 5 và lượt 4, reviewer của app kết luận sai vì bỏ qua quyết định của Owner;
>    - kết luận về màn chạy trên bản build web bằng Playwright hoặc trên exe (quy tắc chung 6), không bằng đọc code;
>    - đọc golden / spec liên quan trước khi đề xuất, không đề xuất sửa golden; không khẳng định điều không có căn cứ; không chạy được thì ghi PLAUSIBLE;
>    - dùng đột biến để tìm chỗ hở, không chỉ để khẳng định test tốt.
>
> Phần chung dưới đây áp dụng đầy đủ. Trong phần chung: `<bên>` = `workbuddy`, `<ID>` = `WBR6`. Agent WorkBuddy không làm bảng R. Thứ tự gói: A → B → C → D → E → F.

**App WorkBuddy.** Như Phụ lục V (và qua đó Phụ lục P), đổi:

- Model Owner chọn (Hy4 hoặc GLM 5.3), chọn tay ở mỗi task, cùng model cho mọi gói; ghi tên, context, mức suy luận đúng như app hiện. Không có bài thi chọn model (Owner 07/11).
- Phiên thử và mọi gói chạy qua Code review expert ngay từ đầu.
- Agent phụ của app: như Phụ lục V (G6 ngày 30/10; ACL chặn đọc và hash 15 báo cáo của Claude / Codex).
- Gói và chi phí: như mục "Gói và chi phí" của Phụ lục V (chỉ credit của gói WorkBuddy Pro, không mua thêm, điểm dừng sau mỗi gói A–E; đề xuất 9).
- Memory: như Phụ lục P.

**`dot2.mjs` lượt 6** (Issue T-387, tạo sau G1; đề xuất 11). PR docs của T-387 thêm vào cuối phụ lục này một khối code `js`: khối của Phụ lục V (sau T-359), đổi theo các điểm dưới. Bước chuẩn bị chép nguyên văn khối đó thành `common\dot2.mjs` (§L6.9 bước 4). Khối của Phụ lục V giữ nguyên, vì lượt 5 đã chạy bằng nó. T-388 sửa khối đó tại chỗ, ở ba chỗ ("Cách làm của T-388").

1. **Đường dẫn và tên lượt:** thư mục gốc `C:\workspace\deep-review-1-6-r6`; chú thích đầu file và thông báo ghi lượt 6.
2. **`deny` chặn thêm cả thư mục lượt 5** `C:\workspace\deep-review-1-6-r5`, như thư mục lượt 1–4.
3. **`deny` chặn thư mục tạm của các phiên Claude ở hai worktree review** (`%TEMP%\claude\<mã băm của thư mục làm việc>\`, nơi Claude Code bản hiện tại để scratchpad và `tasks\*.output`), ngoài `%TEMP%\claude\<tên thư mục làm việc>` đã chặn. Không chặn thư mục tạm của phiên ở checkout chính (phiên hỗ trợ đợt 2). Cách nhận ra thư mục của hai worktree review do T-387 chốt và thử trên máy (lượt 5: `9baf74bac889a6ec` là mã băm của `Project-2C-review`).
4. **Hard link nội bộ:** link có mọi đường dẫn nằm trong các mục chặn cả thì tính là bên trong, không phải link ra ngoài (lượt 5: hai thư mục `file-history` của phiên `review-1` và phiên rẽ nhánh của nó).
5. **`scan` tìm mã của lượt 6:** `CLR6-`, `CXR6-`, và dòng đầu `ĐANG LÀM — claude|codex gói X lượt 6` / `XONG — claude|codex gói X lượt 6`, với X là A–F (Claude thêm G, H, I).

Test chấp nhận của T-387, như T-358, T-359: cây giả trong thư mục tạm của phiên, đường dẫn có dấu cách, `USERPROFILE` / `TEMP` / `APPDATA` / `LOCALAPPDATA` giả; `deny` chỉ chạy sau khi `--dry-run` không liệt kê gì ngoài cây giả. Thêm ca cho điểm 3 (thư mục mã băm của worktree review bị chặn, của checkout chính để ngỏ), điểm 4 (link giữa hai mục chặn cả không làm `deny --dry-run` dừng; link ra ngoài vẫn dừng như cũ) và điểm 5. Bộ thử dựng chuỗi mẫu của `scan` bằng cách ghép, không viết nguyên văn (lượt 5: chuỗi mẫu trong transcript làm `scan` dừng).

**Cách làm của T-387** (07/11/2026, Home PC). Khối của T-387 là khối của Phụ lục V, đổi đúng ở năm điểm trên:

- **Điểm 3, nhận thư mục tạm theo tên phiên** (`reviewTempDirs`, hàm riêng, test thay được).
  - Mã băm không tính lại được từ đường dẫn: sha256 / sha1 / md5 / sha512 của thư mục làm việc ở mọi dạng đã thử (hoa / thường, `\` / `/`, UTF-8 / UTF-16LE) không ra `4f7e6602815f66dc` hay `9baf74bac889a6ec`. Cách băm là chi tiết riêng của Claude Code, có thể đổi giữa các bản.
  - Nên lệnh nhận theo tên phiên. Một thư mục con của `%TEMP%\claude` là của worktree review khi bên trong có một thư mục phiên trùng tên một transcript (`<id phiên>.jsonl` hay thư mục `<id phiên>`) trong `~\.claude*\projects\` của `Project-2C-review` hoặc `Project-2C-review-2`. Một phiên ghi transcript và thư mục tạm theo cùng thư mục làm việc; id phiên là UUID, nên mỗi phiên khớp đúng một dự án.
  - Thử trên Home PC ngày 07/11, chỉ đọc: chép khối, ghim `COMMON` vào `C:\workspace\deep-review-1-6-r6\common` (không tạo), bỏ phần chạy lệnh, chỉ gọi `reviewTempDirs`. Hàm chọn `9baf74bac889a6ec` (`Project-2C-review`; 16 / 19 thư mục phiên khớp), `172d166a8e27758b` (`Project-2C-review-2`; 12 / 13), và hai thư mục tên cũ (Claude Code bản cũ đặt tên theo thư mục làm việc): `C--workspace-Project-2C-review` (đã chặn từ Phụ lục P) và `C--workspace-Project-2C-review-2`. Hàm không chọn `4f7e6602815f66dc` (checkout chính), thư mục không phiên nào khớp, thư mục rỗng.
  - Thư mục tên cũ của `Project-2C-review-2` để ngỏ ở lượt 5; nay bị chặn, vì cũng là thư mục tạm của phiên Claude ở worktree review (đề xuất 9, 11).
  - Thư mục khớp thì bị chặn cả, gồm thư mục phiên không khớp transcript nào bên trong (3 / 19 ở `9baf74bac889a6ec`).
  - Thư mục không liệt kê được thì không nhận: không biết của ai. Không có `dot2-acl.json` thì thư mục `deny` đã chặn cũng không liệt kê được, nên nhánh dự phòng của `remove` gỡ luật trên mọi thư mục con của `%TEMP%\claude` không liệt kê được, rồi kiểm như mục khác. Có file trạng thái thì các thư mục đó đã ở `entries`.
- **Điểm 4, hard link nội bộ.** `deny` đếm link của từng file trên mọi mục chặn cả: thư mục báo cáo lượt 6, thư mục lượt 1–5, transcript, `file-history`, thư mục tạm. Danh sách mục bỏ trùng trước khi đếm; các mục không lồng nhau.
  - Thấy đủ số link của file → tính là bên trong.
  - Thiếu → link ra ngoài: `deny --dry-run` in `STOP: nothing denied` và tên mọi mục chứa link đó, như Phụ lục V. Link sang `.codex` hay `Project-2C-review-2` (vùng tách) vẫn là ra ngoài.
- **Điểm 5:** `MARKER` nhận chữ gói A–I cho cả hai bên. Codex chỉ có A–F; nhận rộng chỉ có thể làm `scan` dừng thêm, không bỏ sót.
  - §L6.8 viết ID của phiên chủ đề dạng `<số>` (trước có ví dụ đủ số), để file này không có chuỗi nào `MARKER` khớp, như chú thích của nó ghi: checkout chính kéo bản mới sau mốc thì `scan` đọc lại file này. Quét mọi file `git ls-files` bằng `MARKER`: 0 dòng.
- Ngoài năm điểm, như Phụ lục V: bộ ACL, phạm vi dọn, năm lệnh, dòng `OK` / `STOP`, mã thoát, bốn danh sách của `dot2-acl.json`.

**Đã thử ngày 07/11/2026 trên Home PC** (T-387; lệnh, cây giả và kết quả ở thân PR). Bộ thử của T-358 và T-359, đổi sang cây `-r6` (thư mục lượt 5 thành lượt cũ). Mọi kịch bản có thư mục tạm theo mã băm của hai worktree review, của checkout chính và của một phiên không rõ. Thêm ba kịch bản. Chuỗi mẫu của `scan` ghép từ mảnh, không viết nguyên văn.

- Khối của T-387: 15 kịch bản đều đạt (306 phép kiểm), hai lần: trên bản đã soạn và trên khối trích từ file này.
  - **`temp`, `temp-nostate`:** thư mục mã băm của hai worktree review bị chặn. Của checkout chính và của phiên không rõ để ngỏ, không có luật chặn nào của tài khoản. `remove` trả cả bốn như trước, có và không có `dot2-acl.json`.
  - **`innerlink`:** link giữa hai thư mục `file-history` (phiên và phiên rẽ nhánh), giữa `-r5` và `-r4`, và một file ba link qua `-r5`, `-r4`, `-r3`. `deny --dry-run` không dừng, `deny` chặn hết, `remove` `OK`. Thêm một link ra ngoài: `STOP: nothing denied`, nêu cả hai thư mục `file-history`.
  - **`base`** thêm: `-r5` chặn cả. `scan` dừng ở mã `CLR6-`, mã `CXR6-`, dòng `XONG` của Claude gói G, dòng `ĐANG LÀM` của Codex, mỗi thứ trong một file sửa sau mốc (một file trong thư mục tạm của checkout chính). Mã và dòng đầu lượt 5 → `OK`.
  - **`linked`:** link ra ngoài ở cả `-r5` và `-r4` → `STOP` nêu cả hai.
  - 8 kịch bản của T-358 và 4 của T-359.
- Khối Phụ lục V trên cùng cây: 7 / 14 kịch bản đỏ. Khối đó không chặn `-r5` và thư mục mã băm, `scan` không thấy mã lượt 6, `deny --dry-run` dừng ở link nội bộ.
- Sáu đột biến của khối T-387, mỗi đột biến làm đỏ kịch bản của nó: bỏ bước gỡ thư mục tạm khi không có file trạng thái; đếm link theo từng mục; bỏ `reviewTempDirs`; chỉ nhận `Project-2C-review`; bỏ `-r5`; `scan` chỉ A–F.
- Cây 60 000 file, hai lần: `deny --dry-run` 14,9–15,2 s, `deny` 20,6–20,7 s, `remove` 7,6–7,8 s (T-359: 15 s, 20–21 s, 8 s).

**Cách làm của T-388** (07/11/2026, Home PC; ba ghi chú của review #1123, Owner kéo vào). Khối dưới là khối của T-387, đổi ở ba chỗ:

- **`treeTargets` bỏ trùng không phân biệt hoa / thường** (L18), như NTFS. `PROJECT` lấy chữ theo đường dẫn gõ khi chạy script, `reviewTempDirs()` trả tên trên đĩa. Ở khối T-387, gõ đường dẫn khác hoa / thường thì thư mục tạm tên cũ của `Project-2C-review` vào danh sách hai lần, link của nó bị đếm hai lần, và một file ở đó có link ra ngoài không làm `deny --dry-run` dừng.
- **`deny` ghi mục vào `dot2-acl.json` trước khi gọi `icacls`** (L19). `deny` dừng ngay sau `icacls` (Ctrl+C, hay `icacls` lỗi sau khi đã đặt luật) thì mục đó vẫn ở file trạng thái; gỡ luật ở mục chưa bị chặn không làm gì. Nên câu "có file trạng thái thì các thư mục đó đã ở `entries`" ở trên đúng cả khi `deny` dừng giữa chừng; chú thích của `remove` ghi lại theo đó. Nhánh dự phòng của `remove` vẫn chỉ chạy khi không có file trạng thái: bộ ACL và phạm vi gỡ không đổi.
- **`baseline` liệt kê file đã có chuỗi lượt 6** (L17, §L6.9 bước chuẩn bị 4). Vòng đọc của `scan` thành hàm `marked(since)`: `scan` gọi với mốc như trước; `baseline` gọi trước khi ghi mốc, với mọi file bất kể tuổi. `baseline` chỉ in đường dẫn và số file, không dừng, mã thoát như cũ: transcript của phiên đã lưu trữ vẫn giữ chuỗi đó mà không còn được ghi, nên nếu `baseline` dừng ở đó thì không bao giờ qua được.
- Ngoài ba chỗ, như T-387.

**Đã thử ngày 07/11/2026 trên Home PC** (T-388; lệnh, cây giả và kết quả ở thân PR). Bộ thử của T-387, thêm bốn kịch bản. Chuỗi mẫu ghép từ mảnh, không viết nguyên văn.

- Khối dưới: 19 kịch bản đều đạt (346 phép kiểm), hai lần: trên bản đã soạn và trên khối trích từ file này.
  - **`case`:** chạy script qua đường dẫn gõ `WS` thay cho `ws`. Thư mục tạm tên cũ của `Project-2C-review` có file link ra ngoài: `deny --dry-run` `STOP`, nêu thư mục đó một lần, như khi gõ đúng chữ. Bỏ link: mỗi mục một dòng `would deny`; `deny` và `remove` qua cùng đường dẫn đều `OK`.
  - **`interrupt`, `interrupt-error`:** bản chép tạm của khối dừng ngay sau khi `icacls` đặt luật trên thư mục mã băm của `Project-2C-review` (`process.exit` như Ctrl+C; hay ném lỗi). `dot2-acl.json` có thư mục đó. `remove` `OK`, cả 26 mục đọc lại được, không còn luật chặn nào của tài khoản.
  - **`marked`:** sáu file có chuỗi lượt 6 trước `baseline` (transcript của checkout chính và của `-review-2`, thư mục tạm của checkout chính, một file UTF-16LE lệch một byte, danh sách phiên của app, một file trong thư mục làm việc). `baseline` in đúng sáu đường dẫn và số file, không dòng nào `MARKER` khớp, mã thoát 0; không có gì thì in `0 file(s)`. Sau mốc, `scan` `OK`; transcript được ghi tiếp → `STOP`, chỉ đường dẫn.
  - 15 kịch bản của T-387.
- Khối T-387 trên cùng cây: bốn kịch bản mới đều đỏ.
- Ba đột biến của khối dưới, mỗi đột biến bỏ một chỗ đổi, làm đỏ kịch bản của nó.
- **Đọc thử trên Home PC, chỉ đọc:** chép khối, ghim `COMMON` vào `C:\workspace\deep-review-1-6-r6\common` (không tạo), chỉ gọi `marked(-Infinity)`; không ghi mốc, không `icacls`. 195 475 file đọc, 244 s. 18 file khớp, chỉ in đường dẫn:
  - transcript, `file-history` và thư mục tạm của sáu phiên: bốn ở checkout chính, một ở `Project-2C-review` (review #1118), một ở `Project-2C-review-2` (review #1123);
  - bản kế hoạch trong `Project-2C-review`, còn ở head của PR #1118 (`e541937`, trước khi T-387 bỏ ví dụ ID đủ số của §L6.8).

```js
// Deep review round 6, wave 2 (plan §L6.9, Appendix Z; round 5 ran the script of Appendix V). Run
// from PowerShell; baseline by the preparation session, the rest by the Owner:
//   node dot2.mjs baseline          preparation step 4: untracked / ignored entries of both review worktrees,
//                                   after listing the files that hold what scan looks for already
//   node dot2.mjs clean             wave 2 step 1: delete what wave 1 left beyond that, and probe caches
//   node dot2.mjs deny [--dry-run]  wave 2 step 3: deny the Owner's account reads (ACL), then check
//   node dot2.mjs scan              wave 2 step 3: look for readable copies of Claude / Codex round 6 work
//   node dot2.mjs remove            wave 2 step 7: remove the denies, then check
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const COMMON = path.dirname(fileURLToPath(import.meta.url));
const R6 = path.dirname(COMMON);
const WS = path.dirname(R6);
const { USERPROFILE: HOME, TEMP, APPDATA, LOCALAPPDATA, USERNAME: USER, USERDOMAIN } = process.env;
const ME = `${USERDOMAIN}\\${USER}`;
const REVIEW = path.join(WS, 'Project-2C-review');
const WORKTREES = [REVIEW, path.join(WS, 'Project-2C-review-2')];
// Claude Code names a project folder after its cwd, every other character turned into '-'.
const projectOf = (cwd) => cwd.replace(/[^A-Za-z0-9-]/g, '-');
const PROJECT = projectOf(REVIEW);
// Data mixed with packages hard-linked into the checkouts' node_modules: denied child by child.
const SPLIT = [path.join(HOME, '.codex'), path.join(WS, 'Project-2C-review-2')];
const BASELINE = path.join(COMMON, 'dot2-baseline.json');
const STATE = path.join(COMMON, 'dot2-acl.json');
// Round 6 finding IDs and report header lines of Claude (A–I) / Codex (A–F); plan.md and the prompts have neither.
const MARKER = /C[LX]R6-[A-I]\d|(?:ĐANG LÀM|XONG) — (?:claude|codex) gói [A-I] lượt 6/;

class Stop extends Error {}
const exists = (p) => fs.existsSync(p);
const list = (dir) => fs.readdirSync(dir, { withFileTypes: true });
const subdirs = (dir, re = /./) =>
  exists(dir) ? list(dir).filter((e) => e.isDirectory() && re.test(e.name)).map((e) => path.join(dir, e.name)) : [];
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const needBaseline = () => {
  if (!exists(BASELINE)) throw new Stop(`no ${BASELINE}: preparation step 4 runs baseline first`);
};
const writeJson = (p, v) => fs.writeFileSync(p, `${JSON.stringify(v, null, 2)}\n`);
const icacls = (...args) => execFileSync('icacls', [...args, '/Q'], { stdio: ['ignore', 'ignore', 'inherit'] });
const refused = (e) => e.code === 'EPERM' || e.code === 'EACCES';
// Opening is enough to prove access; large files are not read.
function canOpen(p, kind) {
  try {
    if (kind === 'tree') fs.readdirSync(p);
    else fs.closeSync(fs.openSync(p, 'r'));
    return true;
  } catch (e) {
    if (refused(e)) return false;
    throw e;
  }
}

// Owner of each path the account running this does not own: path -> account, or '?' when the owner
// does not read (no READ_CONTROL, so not the account's). Paths the account owns are left out. One
// Windows PowerShell for all paths; tests replace this function (Appendix V).
function foreignOwners(paths) {
  if (!paths.length) return new Map();
  const ps = [
    "$ProgressPreference = 'SilentlyContinue'",
    '[Console]::InputEncoding = [Console]::OutputEncoding = New-Object Text.UTF8Encoding $false',
    '$me = [Security.Principal.WindowsIdentity]::GetCurrent().User',
    'foreach ($p in [Console]::In.ReadToEnd().Split([char]0)) {',
    '  if (-not $p) { continue }',
    "  $q = '\\\\?\\' + $p",
    '  try {',
    "    $acl = if ([IO.Directory]::Exists($q)) { [IO.Directory]::GetAccessControl($q, 'Owner') } else { [IO.File]::GetAccessControl($q, 'Owner') }",
    '    $o = $acl.GetOwner([Security.Principal.SecurityIdentifier])',
    '    if ($o -eq $me) { continue }',
    '    try { $n = $o.Translate([Security.Principal.NTAccount]).Value } catch { $n = $o.Value }',
    "  } catch { $n = '?' }",
    '  [Console]::Out.Write("$p`t$n`n")',
    '}',
  ];
  const command = Buffer.from(ps.join('\n'), 'utf16le').toString('base64');
  const out = execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', command], {
    input: paths.join('\0'),
    encoding: 'utf8',
    maxBuffer: 2 ** 30,
    stdio: 'pipe',
  });
  return new Map(out.split('\n').filter(Boolean).map((l) => l.split('\t')));
}

// Whether the account reads an entry before deny touches it: remove does not count an entry that did
// not read before (round 4: .codex\.sandbox-bin, ACL of its own). Tests replace this function too.
function readableBeforeDeny(p, kind) {
  return canOpen(p, kind);
}

// What git does not track (untracked or ignored): each file and folder (trailing '/'), also inside an
// ignored folder (review #872). Not listed: node_modules, a folder holding one, what a link points at.
// held, when given, gets each such folder whose own node_modules kept it (review #878).
function leftovers(wt, held) {
  const others = (...extra) =>
    execFileSync('git', ['-C', wt, 'ls-files', '-z', '--others', '--exclude-standard', '--directory', ...extra], {
      encoding: 'utf8',
    }).split('\0');
  const found = new Set();
  // True when rel is or holds a node_modules.
  const add = (rel) => {
    if (/(^|\/)node_modules(\/|$)/.test(rel)) return true;
    if (!rel.endsWith('/')) {
      found.add(rel);
      return false;
    }
    let modules = false;
    for (const e of list(path.join(wt, rel))) {
      if (e.name === 'node_modules') held?.add(rel);
      modules = add(`${rel}${e.name}${e.isDirectory() ? '/' : ''}`) || modules;
    }
    if (!modules) found.add(rel);
    return modules;
  };
  for (const e of [...others(), ...others('--ignored')]) {
    // git walks into a junction: what it lists through a link stands for the link itself.
    const parts = e.split('/').filter(Boolean);
    const at = parts.findIndex((_, i) => fs.lstatSync(path.join(wt, ...parts.slice(0, i + 1))).isSymbolicLink());
    if (at >= 0) add(parts.slice(0, at + 1).join('/'));
    else if (e) add(e);
  }
  return [...found].sort();
}

function baseline() {
  if (exists(BASELINE)) throw new Stop(`${BASELINE} already exists`);
  // A file that holds a round 6 ID or report header already stops scan once written after the baseline,
  // e.g. the transcript of a session that read one and goes on: such sessions are archived first (plan
  // §L6.9 preparation step 4, T-388). Every file on scan's roots, whatever its age; paths only.
  const { hits } = marked(-Infinity);
  for (const p of hits) console.log(`holds a round 6 ID or report header already: ${p}`);
  console.log(`${hits.length} file(s) on the scan roots hold a round 6 ID or report header already`);
  const base = Object.fromEntries(WORKTREES.map((wt) => [wt, leftovers(wt)]));
  writeJson(BASELINE, base);
  for (const wt of WORKTREES) console.log(`${wt}: ${base[wt].length} untracked / ignored entries kept`);
}

function clean() {
  needBaseline();
  const base = readJson(BASELINE);
  const extras = (wt, held) => {
    const kept = new Set(base[wt]);
    return leftovers(wt, held).filter((e) => !kept.has(e));
  };
  const caches = [];
  for (const wt of WORKTREES) {
    const held = new Set();
    const doomed = extras(wt, held);
    const all = new Set(doomed);
    // Deepest first: a folder goes once empty; a link goes, not what it points at.
    for (const e of [...doomed].reverse()) {
      const p = path.join(wt, e);
      if (e.endsWith('/')) {
        if (!exists(p) || list(p).length) continue;
        fs.rmdirSync(p);
      } else fs.rmSync(p, { force: true });
      // One line for a new folder, not one for each file in it.
      if (!all.has(e.replace(/[^/]+\/?$/, ''))) console.log(`deleted ${p}`);
    }
    // A folder kept for its own node_modules, e.g. a probe with a package.json, stays: say so.
    for (const rel of held) console.log(`kept, holds node_modules: ${path.join(wt, rel)}`);
    // Vite / Vitest caches keep the names and results of the test files that ran, and transformed
    // probe code: Vite puts its cache by the nearest package.json, so the kept folders have one too.
    const pkgs = [wt, ...subdirs(path.join(wt, 'apps')), ...subdirs(path.join(wt, 'packages'))];
    for (const pkg of [...pkgs, ...[...held].map((rel) => path.join(wt, rel))])
      caches.push(path.join(pkg, 'node_modules', '.vite'), path.join(pkg, 'node_modules', '.vite-temp'));
  }
  // Transformed copies of probe code: Playwright cache and browser profiles, Vite SSR dumps, Codex artifacts.
  caches.push(...subdirs(TEMP).filter((d) => /^(playwright|codex-)/i.test(path.basename(d)) || exists(path.join(d, 'ssr'))));
  for (const p of caches) {
    if (!exists(p)) continue;
    fs.rmSync(p, { recursive: true, force: true });
    console.log(`deleted ${p}`);
  }
  for (const wt of WORKTREES) {
    const left = extras(wt);
    if (left.length) throw new Stop(`${wt} still has: ${left.join(', ')}`);
  }
  console.log('OK: both worktrees are back to dot2-baseline.json');
}

// Files under root that also have a link outside it, each hard-linked file (links: file id -> first path,
// link count, links seen under root), what another account owns under it (foreign: from foreignOwners)
// and every path walked. The walk does not follow junctions or symlinks, nor go into a folder the account
// cannot list: icacls cannot reach in there either.
function walkTree(root, foreign = new Map()) {
  const links = new Map();
  const paths = [];
  const others = [];
  let sample = null;
  const walk = (dir) => {
    let ents;
    try {
      ents = list(dir);
    } catch (e) {
      if (refused(e)) return;
      throw e;
    }
    for (const e of ents) {
      const p = path.join(dir, e.name);
      if (!e.isDirectory() && !e.isFile()) continue;
      paths.push(p);
      if (foreign.has(p)) others.push(p);
      if (e.isDirectory()) walk(p);
      else {
        sample ??= p;
        const st = fs.lstatSync(p, { bigint: true });
        if (st.nlink < 2n) continue;
        const key = `${st.dev}:${st.ino}`;
        const seen = links.get(key) ?? { p, nlink: st.nlink, n: 0n };
        seen.n += 1n;
        links.set(key, seen);
      }
    }
  };
  walk(root);
  return { sample, outside: [...links.values()].filter((l) => l.n < l.nlink).map((l) => l.p), links, others, paths };
}

const claudeDirs = () => subdirs(HOME, /^\.claude/);

// Claude Code keeps a session's scratchpad and task output in %TEMP%\claude\<hash of the cwd>\<session id>\
// (round 5: 9baf74bac889a6ec for Project-2C-review). The hash is not worked out here: a folder there is a
// review worktree's when a session folder in it is named after a transcript of either review worktree
// (Appendix Z point 3). The main checkout's stays readable, and so does a folder that does not list.
// Tests may replace this function.
function reviewTempDirs() {
  const sessions = new Set();
  for (const c of claudeDirs())
    for (const wt of WORKTREES) {
      const proj = path.join(c, 'projects', projectOf(wt));
      if (exists(proj)) for (const e of list(proj)) sessions.add(e.name.replace(/\.jsonl$/, ''));
    }
  return subdirs(path.join(TEMP, 'claude')).filter(
    (d) => canOpen(d, 'tree') && list(d).some((e) => e.isDirectory() && sessions.has(e.name)),
  );
}

// Denied whole: reports, transcripts, file copies and scratchpads of the other reviewers.
function treeTargets() {
  const out = [path.join(R6, 'claude'), path.join(R6, 'codex')];
  const rounds = ['deep-review-1-6-r5', 'deep-review-1-6-r4', 'deep-review-1-6-r3', 'deep-review-1-6-r2', 'deep-review-1-6'];
  out.push(...rounds.map((n) => path.join(WS, n)));
  for (const c of claudeDirs()) {
    const proj = path.join(c, 'projects', PROJECT);
    if (!exists(proj)) continue;
    out.push(proj);
    // file-history keeps a copy of each file a session wrote, in a folder named after the session.
    for (const id of new Set(list(proj).map((e) => e.name.replace(/\.jsonl$/, '')))) out.push(path.join(c, 'file-history', id));
  }
  out.push(path.join(TEMP, 'claude', PROJECT), ...reviewTempDirs());
  // NTFS names ignore case: PROJECT is spelt as the script's path was typed, reviewTempDirs as on disk (T-388).
  return [...new Map(out.map((p) => [p.toLowerCase(), p])).values()].filter(exists);
}

const keptBySplit = (e) => e.isSymbolicLink() || e.name === 'node_modules' || e.name === '.git';

// Each folder the account cannot list and file it cannot open under dir, as { path, kind }. The walk
// goes into every other folder, not into links, nor in .codex and Project-2C-review-2 (split) into
// node_modules / .git. remove walks so for what is still denied; deny, before its first rule, for
// what does not read already (review #1030).
function closedUnder(dir, split) {
  const out = [];
  const walk = (d) => {
    for (const e of list(d)) {
      const p = path.join(d, e.name);
      if (split ? keptBySplit(e) : e.isSymbolicLink()) continue;
      if (e.isDirectory()) {
        if (canOpen(p, 'tree')) walk(p);
        else out.push({ path: p, kind: 'tree' });
      } else if (e.isFile() && !canOpen(p, 'file')) out.push({ path: p, kind: 'file' });
    }
  };
  walk(dir);
  return out;
}

// What does not read under dir before deny touches anything: remove does not count it either
// (Appendix V point 6, review #1030). Tests replace this function too.
function closedBeforeDeny(dir, split) {
  return closedUnder(dir, split);
}

// Where remove walks (closedUnder), as [dir, split]: in a tree target that deny split around another
// account's entries, and in .codex and Project-2C-review-2, deny went deeper (splitEntries).
function walkRoots(targets, entries) {
  const whole = new Set(entries.filter((e) => e.kind === 'tree').map((e) => e.path));
  const split = targets.filter((t) => !whole.has(t) && canOpen(t, 'tree')).map((t) => [t, false]);
  return [...split, ...SPLIT.filter(exists).map((s) => [s, true])];
}

// Deny each child of dir that has no outside link and nothing another account owns; go down into the
// others. Links stay readable; in .codex and Project-2C-review-2 (split) also node_modules, .git and
// hard-linked files. In a folder denied whole otherwise (a tree target) a hard link stays inside it.
// What another account owns is not denied: its owner keeps the ACL, deny could not be undone (Appendix V).
function splitEntries(dir, out, split) {
  for (const e of list(dir)) {
    const p = path.join(dir, e.name);
    const kind = e.isDirectory() ? 'tree' : 'file';
    if (split ? keptBySplit(e) : e.isSymbolicLink()) out.kept.push(p);
    else if (!e.isDirectory() && !e.isFile()) continue;
    else if (out.foreign.has(p)) {
      out.notDenied.push({ path: p, kind, owner: out.foreign.get(p) });
      if (kind === 'tree' && canOpen(p, 'tree')) splitEntries(p, out, split);
    } else if (kind === 'tree') {
      const { outside, others } = walkTree(p, out.foreign);
      if ((split && outside.length) || others.length) splitEntries(p, out, split);
      else out.entries.push({ path: p, kind });
    } else if (split && fs.lstatSync(p, { bigint: true }).nlink > 1n) out.kept.push(p);
    else out.entries.push({ path: p, kind });
  }
}

function deny(dryRun) {
  if (exists(STATE)) throw new Stop(`${STATE} exists: run remove first`);
  const targets = treeTargets();
  const splits = SPLIT.filter(exists);
  // The owner of every path deny may reach, in one lookup.
  const reach = [...targets, ...targets.flatMap((t) => walkTree(t).paths)];
  for (const s of splits)
    for (const e of list(s).filter((x) => !keptBySplit(x) && (x.isDirectory() || x.isFile()))) {
      const p = path.join(s, e.name);
      reach.push(p, ...(e.isDirectory() ? walkTree(p).paths : []));
    }
  const out = { entries: [], kept: [], notDenied: [], foreign: foreignOwners(reach) };
  const samples = new Map();
  const linked = [];
  const walks = new Map(targets.map((t) => [t, walkTree(t, out.foreign)]));
  // A file whose links all lie in the tree targets stays inside them: a deny on it hides nothing that is
  // not denied anyway (Appendix Z point 4; round 5: the file-history folders of a session and its fork).
  const seen = new Map();
  for (const { links } of walks.values()) for (const [key, l] of links) seen.set(key, (seen.get(key) ?? 0n) + l.n);
  for (const t of targets) {
    const { sample, links, others } = walks.get(t);
    const outside = [...links].filter(([key, l]) => seen.get(key) < l.nlink).map(([, l]) => l.p);
    if (outside.length) linked.push(`${t}: ${outside.length} file(s) also linked outside it, e.g. ${outside[0]}`);
    if (out.foreign.has(t)) {
      out.notDenied.push({ path: t, kind: 'tree', owner: out.foreign.get(t) });
      if (canOpen(t, 'tree')) splitEntries(t, out, false);
    } else if (others.length) splitEntries(t, out, false);
    else {
      out.entries.push({ path: t, kind: 'tree' });
      if (sample) samples.set(t, sample);
    }
  }
  // A deny on a hard-linked file reaches all its links, e.g. the node_modules of the checkouts.
  if (linked.length) throw new Stop(`nothing denied:\n${linked.join('\n')}`);
  for (const t of splits) splitEntries(t, out, true);
  // Each entry's owner, and whether it read before deny, for remove (Appendix V).
  for (const e of out.entries) Object.assign(e, { owner: ME, readBefore: readableBeforeDeny(e.path, e.kind) });
  const before = out.entries.filter((e) => !e.readBefore);
  // Deeper, where remove walks: what does not read already is not counted either (review #1030).
  // The entries and what another account owns are listed above.
  const listed = new Set([...out.entries, ...out.notDenied].map((e) => e.path));
  const inside = walkRoots(targets, out.entries)
    .flatMap(([dir, split]) => closedBeforeDeny(dir, split))
    .filter((e) => !listed.has(e.path))
    .map((e) => ({ ...e, owner: out.foreign.get(e.path) ?? ME }));
  for (const e of out.entries) console.log(`${dryRun ? 'would deny' : 'deny'} ${e.kind} ${e.path}`);
  for (const e of [...before, ...inside]) console.log(`unreadable before deny, remove does not count it: ${e.path}`);
  for (const e of out.notDenied) console.log(`not denied, owned by ${e.owner}: ${e.path}`);
  for (const p of out.kept) console.log(`stays readable ${p}`);
  if (dryRun) return;
  const state = {
    user: USER,
    at: new Date().toISOString(),
    entries: [],
    unreadableBefore: inside,
    notDenied: out.notDenied,
    kept: out.kept,
  };
  writeJson(STATE, state);
  // Each entry goes in the state file before its rule: stopped right after icacls (Ctrl+C, an error), deny
  // still leaves it to remove; removing from an entry not denied yet does nothing (T-388).
  for (const e of out.entries) {
    state.entries.push(e);
    writeJson(STATE, state);
    icacls(e.path, '/deny', `${USER}:${e.kind === 'tree' ? '(OI)(CI)(R)' : '(R)'}`);
  }
  const open = out.entries.filter((e) => canOpen(e.path, e.kind) || (samples.has(e.path) && canOpen(samples.get(e.path), 'file')));
  if (open.length) throw new Stop(`still readable: ${open.map((e) => e.path).join(', ')}; run remove`);
  console.log(
    `OK: ${out.entries.length} entries denied (${before.length} unreadable before, ${inside.length} more inside), ` +
      `${out.notDenied.length} not denied (another account's), ${out.kept.length} left readable; state in ${STATE}`,
  );
}

function remove() {
  const state = exists(STATE) ? readJson(STATE) : null;
  if (!state) console.log(`no ${STATE}: removing from the standard targets and from what is still denied under them`);
  const entries = state?.entries ?? [];
  // What deny left to another account is left alone here too.
  const theirs = new Set((state?.notDenied ?? []).map((e) => e.path));
  const done = new Map();
  const undo = (p, kind) => {
    if (done.has(p) || theirs.has(p) || !exists(p)) return;
    done.set(p, kind);
    try {
      icacls(p, '/remove:d', USER);
    } catch {
      // Not the end (round 4 stopped here): icacls says why, the check below lists p (Appendix V).
    }
  };
  for (const e of [...entries].reverse()) undo(e.path, e.kind);
  // The standard targets too, in case the state file is missing: deny writes it before its first rule and
  // each entry in it before that entry's rule, so a state file holds every entry deny denied (T-388).
  for (const c of claudeDirs()) undo(path.join(c, 'projects', PROJECT), 'tree');
  // Without it, a review worktree's temp folder that deny denied does not list, so reviewTempDirs cannot
  // tell it: each folder in %TEMP%\claude that does not list is undone (Appendix Z point 3).
  if (!state) for (const d of subdirs(path.join(TEMP, 'claude'))) if (!canOpen(d, 'tree')) undo(d, 'tree');
  const targets = treeTargets();
  for (const t of targets) undo(t, 'tree');
  // In .codex and Project-2C-review-2, and in a tree target that deny split around another account's
  // entries, deny went deeper (splitEntries): whatever there still does not read is undone, at any
  // depth, also without the state file (review #872).
  for (const [dir, split] of walkRoots(targets, entries))
    for (const e of closedUnder(dir, split)) undo(e.path, e.kind);
  const closed = [...done].filter(([p, kind]) => !canOpen(p, kind)).map(([p]) => p);
  const known = new Map(entries.map((e) => [e.path, e]));
  // Did not read before deny either: an entry, or deeper where remove walks (review #1030).
  const unread = [...entries.filter((e) => e.readBefore === false), ...(state?.unreadableBefore ?? [])];
  const before = new Map(unread.map((e) => [e.path, e]));
  const already = closed.filter((p) => before.has(p));
  for (const p of already) console.log(`unreadable before deny too, not counted: ${p} (owner ${before.get(p).owner})`);
  const left = closed.filter((p) => !before.has(p));
  if (left.length) {
    const unknown = left.filter((p) => !known.has(p));
    let found = new Map();
    try {
      found = foreignOwners(unknown);
    } catch {
      found = new Map(unknown.map((p) => [p, '?']));
    }
    const owner = (p) => known.get(p)?.owner ?? found.get(p) ?? ME;
    const lines = left.map((p) => `${p}  owner ${owner(p)}`);
    throw new Stop(`${left.length} of ${done.size} entries still denied (path, owner); ${STATE} kept:\n${lines.join('\n')}`);
  }
  if (state) fs.renameSync(STATE, path.join(COMMON, 'dot2-acl.removed.json'));
  const but = already.length ? ` but the ${already.length} above, which did not read before deny either` : '';
  console.log(`OK: denies removed from ${done.size} entries, all readable again${but}`);
}

// Readable files on scan's roots changed since `since` (ms) that hold a round 6 ID or report header (hits),
// files over 64 MB (big, not read) and counts. Callers print paths only, never a matching line.
function marked(since) {
  const roots = [
    ...subdirs(HOME, /^\.(claude|codex)/),
    path.join(APPDATA, 'Claude'),
    path.join(LOCALAPPDATA, 'Claude'),
    path.join(LOCALAPPDATA, 'OpenAI'),
    ...subdirs(path.join(LOCALAPPDATA, 'Packages'), /^(Claude|OpenAI)/i),
    TEMP,
    WS,
  ].filter(exists);
  const skipDirs = new Set(['.git', '.pnpm', 'target']);
  const notOpened = path.join(WS, 'Project-2'); // never opened (CLAUDE.md)
  const hits = [];
  const big = [];
  let read = 0;
  let closed = 0;
  const walk = (dir) => {
    let ents;
    try {
      ents = list(dir);
    } catch {
      closed++;
      return;
    }
    for (const e of ents) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!skipDirs.has(e.name) && p !== notOpened) walk(p);
        continue;
      }
      if (!e.isFile() || /^(\.credentials|auth\.json$)/.test(e.name)) continue;
      let buf;
      try {
        const st = fs.statSync(p);
        if (st.mtimeMs < since) continue;
        if (st.size > 64 * 2 ** 20) {
          big.push(p);
          continue;
        }
        buf = fs.readFileSync(p);
      } catch {
        closed++;
        continue;
      }
      read++;
      // UTF-8, and UTF-16LE at either byte alignment (app databases). Node 24.20 crashes on
      // toString('utf16le') of an odd-length view at an odd offset, so that view is cut to even length.
      const odd = buf.subarray(1, 1 + ((buf.length - 1) & ~1));
      const texts = [buf.toString('utf8'), buf.toString('utf16le'), odd.toString('utf16le')];
      if (texts.some((t) => MARKER.test(t))) hits.push(p);
    }
  };
  for (const r of roots) walk(r);
  return { hits, big, read, closed };
}

function scan() {
  needBaseline();
  // Files older than the baseline (preparation, before wave 1) cannot hold round 6 work.
  const { hits, big, read, closed } = marked(fs.statSync(BASELINE).mtimeMs);
  console.log(`${read} files read; ${closed} folders / files not readable (the denied ones count here)`);
  for (const p of big) console.log(`not read (over 64 MB): ${p}`);
  // Accepted in Appendix P: the desktop app's session list (titles, recaps); the running app keeps it open.
  const appSessions = path.join(APPDATA, 'Claude', 'claude-code-sessions') + path.sep;
  for (const p of hits.filter((h) => h.startsWith(appSessions))) console.log(`accepted, write it in baseline.md: ${p}`);
  const open = hits.filter((h) => !h.startsWith(appSessions));
  if (open.length) throw new Stop(`round 6 IDs or report headers readable in:\n${open.join('\n')}`);
  console.log('OK: no readable copy of Claude / Codex round 6 work found');
}

const [cmd, flag] = process.argv.slice(2);
const commands = { baseline, clean, deny: () => deny(flag === '--dry-run'), scan, remove };
try {
  if (!commands[cmd]) throw new Stop('usage: node dot2.mjs baseline | clean | deny [--dry-run] | scan | remove');
  commands[cmd]();
} catch (e) {
  console.error(`STOP: ${e instanceof Stop ? e.message : e.stack}`);
  process.exit(1);
}
```
