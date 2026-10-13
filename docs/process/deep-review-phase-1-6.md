# Kế hoạch deep review Phase 1–6 (6D)

- **Trạng thái:** lượt 1 — **chờ Owner duyệt** (Issue #562 T-222, nhãn `gate`). Owner duyệt thì ghi ngày vào dòng này trước khi merge.
- **Soạn:** 13/10/2026, bước 0 của lượt 1 (spec `docs/design/phase-6-hoan-thien.md` §6.3). Lượt 2 (T-224 #564) sửa trên cùng file: thêm mục "Lượt 2" và prompt lượt 2, giữ nguyên phần lượt 1.
- **Nguồn:** spec Phase 6 §2, §5.1, §6 (G1 #515); khuôn deep review Phase 1–4 (`deep-review-phase-1-4.md`) và Phase 5 (`docs/reviews/raw/2026-10-10/common-*.md`); bài học DeepSeek / Muse (`docs/reviews/2026-10-10-danh-gia-deepseek-muse.md` §6–§7); tổng hợp Phase 5 §9–§10; ADR-0001 phụ lục M2, M4.

| Yêu cầu của #562 | Mục |
|---|---|
| 1. SHA ghim, cách dựng worktree / thư mục | §2, §9 |
| 2. 6 gói, phạm vi, cỡ dòng đo lại, thứ tự phiên Claude | §3 |
| 3. Trục, gồm bloat và hiệu năng | §4 |
| 4. Prompt nguyên văn của 4 bên | Phụ lục A–E |
| 5. KNOWN | §5 |
| 6. Số đo nền, lệnh sinh dữ liệu tải và probe | §6 |
| 7. Cấu hình Muse và OpenCode | §7, Phụ lục F |
| 8. Thư mục bằng chứng, kiểm độc lập, lưu báo cáo gốc | §8 |
| 9. Ước lượng, câu hỏi cho Owner | §11, §12 |

## 1. Mục tiêu và phạm vi (lượt 1)

Đọc **toàn bộ code Phase 1–6** ở SHA ghim, trước v1.0. Bốn bên review độc lập, chỉ đọc; Claude phiên tổng hợp (T-223 #563) kiểm lại từng phát hiện trên code rồi đề xuất sửa (spec §6.1). Tìm, theo thứ tự ưu tiên:

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
| DeepSeek v4.1 Flash (OpenCode) | Owner | 2 | `C:\workspace\Project-2C-review` + `opencode.json` (Phụ lục F) | `…\deepseek\` | `DS-<gói><số>` |
| Muse Spark (Muse Code) | Owner | 2 (cùng lúc DeepSeek) | thư mục làm việc của Muse là `…\muse\`; đọc repo ở `C:\workspace\Project-2C-review-2` | `…\muse\` | `MU-<gói><số>` |
| **Claude phiên tổng hợp** (T-223) | Owner yêu cầu, sau khi đủ 24 báo cáo | — | checkout chính | `docs/reviews/` qua PR docs | dùng nguyên ID trên |

- Cả hai worktree detached ở cùng SHA ghim. Mỗi worktree review chỉ một bên tại một thời điểm (`CLAUDE.md`).
- **Vì sao chia hai đợt** (như Phase 5): ACL chỉ chặn được thư mục của bên **đã xong**, vì mọi bên chạy dưới cùng tài khoản Windows; đợt 2 chạy khi `claude\`, `codex\` đã bị chặn ACL (§7.3). Thêm nữa, `pnpm e2e` dùng cổng cố định 4173 và đo hiệu năng cần máy rảnh, nên càng ít bên chạy cùng lúc càng ít va.
- Mọi bên: **chỉ đọc**, không gọi dịch vụ AI thật, không đọc key, không tổng hợp với bên khác (quy tắc đầy đủ ở Phụ lục E). Báo cáo của Codex / DeepSeek / Muse là dữ liệu tham khảo (ADR-0001 M2, M4); kết luận phát hành chỉ lấy từ phiên tổng hợp.

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
- **Thứ tự phiên Claude: A → B → C → D → E → F.** Lõi dữ liệu trước vì mọi gói khác dựa vào; F cuối vì đọc báo cáo A–E của chính Claude và làm phần xuyên gói. Codex, DeepSeek, Muse tự chọn cách chia phiên nhưng nộp theo cùng tên gói (DeepSeek / Muse: mỗi gói một phiên mới, tuần tự A → F như Phase 5).
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
- **T — Chất lượng test:** test có đỏ khi code sai (đột biến trên **bản chép** ngoài repo, hoặc patch gỡ ngay — luật chỉ đọc ở Phụ lục E); test chép lại công thức của code; phụ thuộc ngày hệ thống / thứ tự / ngẫu nhiên; e2e giả xanh.
- **A — Trợ năng / i18n:** nhãn, `aria-*`, thứ tự Tab, bẫy focus trong hộp, `role="status"`, tương phản, chuỗi cứng, định dạng số / ngày.

### 4.2 Hai trục bắt buộc ghi riêng: bloat và hiệu năng

Mỗi báo cáo gói có **hai mục riêng** "Bloat" và "Hiệu năng" (kể cả khi không có phát hiện), mỗi mục một bảng: đã chạy / đo gì, trên dữ liệu nào, kết quả (số), phát hiện liên quan (ID). Gói A–E làm trong phạm vi của mình; **gói F làm cho toàn codebase** và tổng hợp số của chính bên đó.

- **Bloat:** export không ai import (`rg` + bản đồ `pnpm codemap` trong `CLAUDE.md` của package); hàm / tham số / prop / khóa i18n / CSS không dùng (`tsc --noUnusedLocals --noUnusedParameters` chạy tạm bằng lệnh, không sửa cấu hình); nhánh không thể xảy ra; abstraction chỉ một nơi dùng; code lặp ≥ 3 nơi (và các mục *Duplicated Code* đã ghi ở sổ — §5); dependency không dùng hoặc nặng hơn việc nó làm; cấu thành bundle (`pnpm build:web`, kích thước từng chunk) và exe. Mỗi đề xuất refactor ghi: cỡ ước lượng, file đụng tới, test nào giữ hành vi (spec §6.3: refactor giữ nguyên hành vi, test cũ xanh trước và sau, không đổi golden).
- **Hiệu năng:** **mọi phát hiện P phải có số đo** (ms / KB / MB / số lần render / số câu SQL), không suy đoán. Đo trên **dữ liệu tải** (§6). So với ngưỡng đã chốt (`docs/metrics/phase-6.md`: thao tác màn < 200 ms, các ngưỡng "Owner chốt 13/10") hoặc với số tham chiếu **cùng máy** (§6); số đo nền T-219 ở Office Laptop, không so trực tiếp với số đo ở Home PC. Ghi máy và việc gì đang chạy song song lúc đo. Chỗ cần xem: thuật toán bậc hai trên dữ liệu cỡ N, tính lại trong render, truy vấn thiếu chỉ mục / N+1, đọc cả bảng khi chỉ cần vài dòng (vd. `listTrash` — §5), mở / lưu / nhập / xuất DB, bộ nhớ, bundle nạp sớm.
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
- **Số tham chiếu cùng máy:** bước chuẩn bị chạy probe một lần trên Home PC ở SHA ghim (máy rảnh) → `common\perf\perf-homepc.json`, kèm exe release ở `common\exe\project2c.exe`. Reviewer so số mình đo ở Home PC với file này (hoặc với chính số mình đo trước / sau một thay đổi trên bản chép), không so với số Office Laptop.
- **Reviewer không bắt buộc chạy lại probe.** Muốn đo trên exe thì chép `common\exe\project2c.exe` vào thư mục kết quả của mình (exe ghi `Project2C-data\` cạnh nó), dùng cổng debug khác 9222 (`WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS`, `PERF_CDP`) và `PERF_OUT` trong thư mục của mình. Probe cần cửa sổ exe ở trên cùng nên **không chạy khi bên khác đang đo**; ghi giờ đo.
- **Bảng hàm thuần trong Node của Phase 4** (`importBackup`, `listAppointments`, `teamCompare` / `reportRows`, `monthGrid`, `countRecords` — `phase-6.md` cuối mục thời gian): **gói F đo lại** trên dữ liệu tải (cả hàm mới: `listTrash`, phần AI của hồ sơ KH), ghi máy; không so với số Phase 4 (khác máy, probe cũ ngoài repo), chỉ so ngưỡng Nhóm C và giữa các hàm.
- **Kết quả cổng ở SHA ghim** (bước chuẩn bị ghi vào `common\baseline.md`, reviewer không phải chạy lại toàn bộ): `pnpm verify` (số file / test, `lint:deps`), coverage theo vùng, `pnpm verify:rust` (số test Rust), `pnpm e2e` (`CI=1`), `pnpm build:web` (chunk), `pnpm build:exe` (cỡ exe).

## 7. Cấu hình OpenCode và Muse

### 7.1 DeepSeek (OpenCode)

- OpenCode trên Home PC: v2.0.27 (Phase 5: v2.0.24). Model `opencode-go/deepseek-v4.1-flash`; TUI có biến thể suy luận thì chọn mức cao nhất. Trừ vào hạn mức gói Go (Owner kiểm gói còn hạn trước đợt 2, K9).
- `C:\workspace\Project-2C-review\opencode.json` = bản ở **Phụ lục F** (bản Phase 5 đổi `deep-review-5` → `deep-review-1-6`): đọc / ghi / liệt kê bị chặn ở `claude\`, `codex\`, `muse\`; công cụ sửa file chỉ được ở `deepseek\`; cấm `git commit / push / stash / switch / clean / merge / rebase / checkout / restore / reset`, subagent, web, `pnpm eval:ai`, `tools/eval-ai.mjs`, lệnh `opencode`, `cmdkey`; hỏi trước `gh`, `curl`, `Invoke-WebRequest`. Đây là chặn theo mẫu chuỗi, model vẫn lách được, nên còn ACL (§7.3) và kiểm log (§8).
- Chạy: `opencode C:\workspace\Project-2C-review`; mỗi gói `/new`.

### 7.2 Muse (Muse Code) — sandbox

Phase 5 tốn 45 lần Owner duyệt tay (gói A 32 lần) vì báo cáo ghi ra ngoài thư mục làm việc của Muse, và một phiên thử chạy chế độ không hỏi (`:unrestricted`) đã liệt kê được `codex\`. Muse Code 1.3.0 (Home PC: `1.3.0-R3401.1`) bật sandbox và hỏi duyệt **theo mặc định**; ghi trong thư mục làm việc không phải xin, ghi ra ngoài phải xin. Cách cấu hình lượt này **đảo chỗ**: thư mục làm việc của Muse là thư mục kết quả, repo nằm ngoài nó.

1. **Bỏ chế độ không hỏi:** `~/.config/muse/settings.json` trên Home PC hiện có `"permissions": { "default_profile": ":unrestricted" }`. Owner sao lưu file, rồi bỏ khóa `default_profile` (giữ `model`, `reasoning_effort`) trong suốt 6D. Không bao giờ chạy `--yolo`, `--disable-sandbox`, `--disable-approval`, `--approval-mode never`.
2. **Thư mục làm việc = `C:\workspace\deep-review-1-6\muse\`** → ghi báo cáo, probe, bản chép để đột biến không phải xin duyệt. Repo `C:\workspace\Project-2C-review-2` nằm ngoài nên **chỉ đọc** với Muse: lệnh ghi vào đó phải xin, và Owner từ chối (trừ ngoại lệ ở bước 4).
3. Chạy (mỗi gói một phiên mới, thoát rồi chạy lại):

   ```powershell
   cd C:\workspace\deep-review-1-6\muse; muse --model muse-spark-1.3-contributor --reasoning-effort max --approval-mode on-request --approval-judge on
   ```

4. **Phiên thử trước gói A** (bỏ đi sau khi thử, mở phiên mới cho gói A). HUD của Muse phải hiện sandbox / duyệt đang bật. Gõ lần lượt:
   1. "Tạo file `C:\workspace\deep-review-1-6\muse\preflight.txt` chứa chữ ok" → chạy **không hỏi**.
   2. "Tạo file `C:\workspace\Project-2C-review-2\zz-preflight.txt`" → **phải hỏi**; Owner từ chối.
   3. "Liệt kê `C:\workspace\deep-review-1-6\codex`" → `Access is denied` (ACL §7.3).
   4. "Chạy `pnpm vitest run packages/domain` với thư mục làm việc `C:\workspace\Project-2C-review-2`" → ghi lại có phải xin duyệt không. Nếu lệnh test chỉ xin ghi vào thư mục build / cache đã bị git ignore (`node_modules\.vite`, `coverage`, `dist`, `test-results`, `src-tauri\target`) thì Owner duyệt được; xin ghi chỗ khác thì từ chối. Muse thường cần `git -c safe.directory=…` và `TEMP` / `TMP` trỏ vào thư mục của nó (Phase 5).
   5. Xóa `preflight.txt`; `git -C C:\workspace\Project-2C-review-2 status --short` phải rỗng.

   Bước 1 hỏi duyệt, hay bước 2 không hỏi → dừng, báo Claude để chỉnh cách chạy trước khi review (không chạy 6 gói trong tình trạng đó).
5. Muse báo "Your content … may be used for product improvement" (bản `-contributor`): repo public, dữ liệu giả lập — chấp nhận như Phase 5 (ADR-0001 M4).

### 7.3 ACL cho đợt 2

Trước khi mở phiên DeepSeek / Muse đầu tiên, sau khi Claude và Codex đã nộp đủ F (Owner chạy trong PowerShell):

```powershell
icacls C:\workspace\deep-review-1-6\claude /deny "${env:USERNAME}:(OI)(CI)(R)"
```

```powershell
icacls C:\workspace\deep-review-1-6\codex /deny "${env:USERNAME}:(OI)(CI)(R)"
```

Kiểm: `Get-ChildItem C:\workspace\deep-review-1-6\codex` báo `Access is denied`. Gỡ sau khi cả DeepSeek và Muse nộp F (chủ thư mục luôn gỡ được):

```powershell
icacls C:\workspace\deep-review-1-6\claude /remove:d "${env:USERNAME}"
```

```powershell
icacls C:\workspace\deep-review-1-6\codex /remove:d "${env:USERNAME}"
```

DeepSeek ↔ Muse chạy cùng lúc nên không chặn ACL lẫn nhau được: DeepSeek bị chặn `muse\` bằng `opencode.json`; Muse chỉ có prompt + sandbox (ngoài thư mục làm việc chỉ đọc được, không bị cấm đọc) — nên kiểm log ở §8 là lớp chính. Muốn chặt hơn thì chạy Muse trước hoặc sau DeepSeek và chặn ACL thư mục của bên đang không chạy.

## 8. Bằng chứng, kiểm độc lập, lưu báo cáo

**Thư mục bằng chứng ngoài repo** (Home PC): `C:\workspace\deep-review-1-6\`

```
common\    plan.md (bản đã duyệt của file này), known.md, baseline.md, prompt-{claude,codex,deepseek,muse}.md,
           opencode-deepseek.json, load\ (dữ liệu tải), exe\ (exe release ở SHA ghim), perf\ (tham chiếu Home PC)
claude\    A.md … F.md + A\ … F\ (probe, bản chép đột biến, log)
codex\     như trên
deepseek\  như trên + <gói>\session.json (xuất ở phiên tổng hợp)
muse\      như trên + <gói>\session.json
```

Lượt 2 dùng `C:\workspace\deep-review-1-6-r2\` cùng cấu trúc (T-224).

**Kiểm độc lập bằng log phiên** (phiên tổng hợp làm cho **cả bốn bên**, Phase 5 mới làm cho hai bên): xuất / tìm log phiên bằng CLI local (không gọi model):

| Bên | Log |
|---|---|
| Claude | transcript Claude Code của worktree review (`%USERPROFILE%\.claude*\projects\C--workspace-Project-2C-review\*.jsonl`) |
| Codex | log phiên Codex của Owner (thư mục `sessions` của Codex; Owner chỉ chỗ nếu khác) |
| DeepSeek | `opencode session list`, rồi `opencode session export <id>` → `deepseek\<gói>\session.json` |
| Muse | `muse export` (phiên của từng gói) → `muse\<gói>\session.json` |

Một script `node` của phiên tổng hợp quét **đầu vào lệnh công cụ** (không quét chữ prompt, vốn có tên các thư mục cấm) tìm: đường dẫn `deep-review-1-6[\\/](claude|codex|deepseek|muse)` của bên khác, liệt kê `C:\workspace` / `deep-review-1-6`, lệnh ghi vào worktree review (`git commit` / `checkout` / `reset`, tạo / sửa file trong repo), lệnh gọi AI của sản phẩm (`eval:ai`, `cmdkey`, chatgpt.com). Có kết quả → báo cáo gói đó đánh dấu "nhiễm" hoặc "vi phạm chỉ đọc", phiên tổng hợp xét riêng. Thêm: `git status --short` của hai worktree đầu / cuối mỗi gói (mỗi báo cáo ghi); khác rỗng (ngoài `opencode.json` ở `Project-2C-review` và file Codex tự sinh như `AGENTS.md`, `.codex/`, `.agents/` ở `Project-2C-review-2`) → báo, không tự xóa.

**Báo cáo gốc lưu ở repo** (phiên tổng hợp T-223, PR docs): `docs/reviews/raw/<ngày tổng hợp>/{claude,codex,deepseek,muse}/<gói>.md` nguyên văn, cùng `common-plan.md` (chỉ khi khác bản trong repo), `common-known.md`, `common-baseline.md`, `common-opencode-config.md`; tổng hợp ở `docs/reviews/<ngày>-deep-review-phase-1-6-luot-1-tong-hop.md`. Không chép `session.json`, exe, dữ liệu tải (lớn, có đường dẫn máy): giữ ở Home PC tới khi phát hành v1.0, rồi Owner xóa. Nguồn probe / đột biến nằm trong phụ lục báo cáo nên không mất.

## 9. Chuẩn bị và chạy

**Bước chuẩn bị — Claude, sau khi Owner duyệt kế hoạch** (một phiên; không review, không ghi phát hiện):

1. Kiểm `main` chưa có code mới: `git diff --name-only 8855345 origin/main` chỉ có `docs/**`. Có file khác → dừng, báo Owner (§2).
2. Tạo `C:\workspace\deep-review-1-6\{common,claude,codex,deepseek,muse}`.
3. Hai worktree về SHA ghim: `git -C C:\workspace\Project-2C-review checkout --detach 8855345` (tương tự `-review-2`), `pnpm install --frozen-lockfile` ở mỗi worktree (PowerShell); `git status --short` rỗng.
4. Chép vào `common\`: `plan.md` (file này, bản đã merge), `known.md` (§5: OPEN + ACCEPTED nguyên văn ở SHA ghim + bảng K1–K17), `prompt-<bên>.md` (Phụ lục A / B / C / D, mỗi file nối thêm nguyên văn Phụ lục E), `opencode-deepseek.json` (Phụ lục F).
5. Dữ liệu tải: `node tools/load-data.mjs --out C:\workspace\deep-review-1-6\common\load\load-2026-10-12-seed6.p2cbackup`; hash `tables` phải bằng §6.
6. Cổng ở SHA ghim (trong `Project-2C-review`): `pnpm verify`, `pnpm verify:rust`, `pnpm e2e` (`CI=1`), `pnpm build:exe`, `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` → `common\baseline.md`; chép exe vào `common\exe\`.
7. Probe tham chiếu Home PC (cần Owner: nhập dữ liệu tải trong exe theo `e2e/perf/README.md` bước 3, rồi không dùng máy ≈ 5 phút) → `common\perf\perf-homepc.json`, bảng vào `baseline.md`.
8. Báo Owner: sẵn sàng đợt 1.

**Owner chạy:**

| Bước | Việc |
|---|---|
| Đợt 1 | Claude: 6 phiên mới ở `C:\workspace\Project-2C-review`, lần lượt A → F, tin nhắn mở phiên: "Gói `<X>`. Đọc và làm đúng `C:\workspace\deep-review-1-6\common\prompt-claude.md`." Cùng lúc: Codex ở `C:\workspace\Project-2C-review-2` với `prompt-codex.md` (một hay nhiều phiên, ghi rõ gói). |
| Giữa hai đợt | ACL (§7.3); đặt `opencode.json` (Phụ lục F) vào `C:\workspace\Project-2C-review`; cấu hình Muse + phiên thử (§7.2); kiểm gói Go còn hạn. Phiên thử DeepSeek: "liệt kê `C:\workspace\deep-review-1-6\codex`" và "… `\muse`" → bị từ chối; bỏ phiên thử. |
| Đợt 2 | DeepSeek (`prompt-deepseek.md`) và Muse (`prompt-muse.md`), mỗi gói một phiên mới, A → F, tin nhắn mở phiên như đợt 1. Owner ghi giờ bắt đầu / xong mỗi gói (để so thời gian). |
| Sau đợt 2 | Gỡ ACL; xóa `opencode.json` ở `Project-2C-review`; trả `~/.config/muse/settings.json` về bản sao lưu nếu muốn. Gõ yêu cầu tổng hợp (T-223). |

Không phiên nào tự tổng hợp, kể cả khi một bên xong sớm.

## 10. Định dạng phát hiện và báo cáo

```
ID: <bên>-<gói><số>   (CL | CX | DS | MU; ví dụ CL-A12, CX-B03, DS-C4, MU-E7)
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

**Sau lượt 1 (T-223 #563, khi Owner yêu cầu):** phiên tổng hợp đọc đủ 24 báo cáo, kiểm **mọi** phát hiện trên code ở SHA ghim (đúng / KNOWN / sai / lệch mức), gộp trùng, ghi bên nào thấy; phần bloat / hiệu năng: số đo, phát hiện, đề xuất refactor; kiểm độc lập (§8); đề xuất nhóm sửa (Issue ≤ ~400 dòng SP, phát hiện P kèm số **trước** và ngưỡng **sau**) và câu hỏi cho Owner. Owner chọn → sửa (Issue thường, review phiên sạch). Lượt 2 (T-224) chạy trên SHA sau đợt sửa, so số đo với nền (`PERF_BASE`, `size-report --compare`, cùng máy với số đo nền).

**Ước lượng lượt 1** (spec §6.4; Phase 5: mỗi bên ≈ 2–3 giờ cho phạm vi ≈ 13 000 dòng; lượt này ≈ 32 000 dòng SP + 38 000 dòng test):

| Bên | Thời gian (đồng hồ) | Chi phí | Owner can thiệp |
|---|---|---|---|
| Claude | 1 phiên chuẩn bị + 6 phiên × ≈ 35–50 phút ≈ 4–5 giờ | gói Claude của Owner | mở 7 phiên; ≈ 5 phút rảnh máy cho probe |
| Codex | ≈ 3–4 giờ (song song Claude) | gói Codex của Owner | mở 1–6 phiên |
| DeepSeek | ≈ 2–3 giờ | ≈ 2–3 USD theo giá OpenCode (Phase 5 ≈ 0,96 USD), trừ hạn mức gói Go | mở 6 phiên + phiên thử |
| Muse | ≈ 3–4 giờ | 0 USD (contributor) | mở 6 phiên + phiên thử; mục tiêu ≤ 5 lần duyệt tay mỗi gói (Phase 5: 45 lần) |
| Tổng hợp (T-223) | 1–2 phiên Claude | — | yêu cầu tổng hợp, chọn việc sửa |

Đợt 1 ≈ nửa ngày, đợt 2 ≈ nửa ngày; cả lượt 1 ≈ 1–1,5 ngày làm việc của Owner tính cả tổng hợp.

## 12. Câu hỏi cho Owner

Mỗi câu có đề xuất; Owner duyệt kế hoạch mà không nói gì khác thì lấy đề xuất.

1. **Hai đợt** (Claude + Codex trước, DeepSeek + Muse sau, như Phase 5) hay cả bốn cùng lúc (nhanh hơn ≈ nửa ngày nhưng không chặn ACL được `claude\` / `codex\`, và va cổng e2e / probe)? **Đề xuất: hai đợt.**
2. **Máy:** cả lượt 1 chạy ở Home PC `DESKTOP-KDURKJP` (có sẵn hai worktree review, OpenCode, Muse). **Đề xuất: Home PC**; số so với nền ở lượt 2 đo lại ở Office Laptop như T-219.
3. **Muse:** bỏ `default_profile: ":unrestricted"` trong suốt 6D và chạy với thư mục làm việc là `muse\` (§7.2), duyệt các lệnh test chỉ ghi vào thư mục build / cache bị ignore. **Đề xuất: đồng ý.**

## Phụ lục A — Prompt Claude (lượt 1)

File `common\prompt-claude.md` = đoạn dưới + nguyên văn Phụ lục E. Owner mở **phiên mới** ở `C:\workspace\Project-2C-review` và gõ: "Gói `<X>`. Đọc và làm đúng `C:\workspace\deep-review-1-6\common\prompt-claude.md`."

> # Deep review Phase 1–6, lượt 1 — Claude
>
> **{GÓI}** = chữ gói (A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer Claude** của deep review Phase 1–6, lượt 1, **gói `{GÓI}`**: phiên sạch, chỉ đọc. Repo: worktree `C:\workspace\Project-2C-review`, detached ở SHA **`8855345`** (`885534549808f42aec7f9af5743bbf86642ee4bd`). Chạy `git rev-parse HEAD` và `git status --short` trước; SHA lệch hay status không rỗng thì dừng và báo Owner.
>
> Quy tắc riêng của Claude:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6\codex\`, `…\deepseek\`, `…\muse\`**, kể cả khi Owner hay file nào gợi ý; không liệt kê `C:\workspace\deep-review-1-6\` hay `C:\workspace\`. Không đọc báo cáo của bên khác ở bất cứ đâu. Lỡ thấy nội dung của bên khác thì dừng và báo Owner.
> 2. Chỉ đọc: repo ở SHA trên, `C:\workspace\deep-review-1-6\common\` và báo cáo Claude các gói trước trong `C:\workspace\deep-review-1-6\claude\` (mục đã báo ở gói trước thì chỉ dẫn ID, không báo lại).
> 3. Không subagent / Agent tool, không skill `review-pr` / `code-review`; không làm nghi thức phiên của repo (HANDOFF, `/handoff`, PR, Issue, merge, commit).
> 4. Ghi báo cáo vào `C:\workspace\deep-review-1-6\claude\{GÓI}.md`, probe / bản chép / log vào `C:\workspace\deep-review-1-6\claude\{GÓI}\`.
> 5. Gói F được đọc `claude\A…E.md`. Xong gói nào thì dừng và báo Owner tên file; xong F thì **chờ Owner yêu cầu** tổng hợp, không tự tổng hợp.
>
> Phần chung dưới đây áp dụng đầy đủ.

## Phụ lục B — Prompt Codex (lượt 1)

File `common\prompt-codex.md` = đoạn dưới + nguyên văn Phụ lục E. Owner chạy Codex ở `C:\workspace\Project-2C-review-2`, một phiên cho nhiều gói hoặc mỗi phiên một gói: "Gói `<X>` (hoặc A–F). Đọc và làm đúng `C:\workspace\deep-review-1-6\common\prompt-codex.md`."

> # Deep review Phase 1–6, lượt 1 — Codex
>
> **{GÓI}** = chữ gói (một hay nhiều chữ A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên.
>
> Bạn là **reviewer độc lập Codex** của deep review Phase 1–6, lượt 1, gói `{GÓI}`. Repo: worktree `C:\workspace\Project-2C-review-2`, detached ở SHA **`8855345`** (`885534549808f42aec7f9af5743bbf86642ee4bd`). Chạy `git rev-parse HEAD` và `git status --short` trước; SHA lệch thì dừng và báo Owner.
>
> Về file quy tắc của repo (`CLAUDE.md`): đó là quy trình phát triển của Claude. Dùng để hiểu dự án, **không** làm nghi thức phiên (`/session-start`, HANDOFF, hook, skill, PR, Issue, merge, commit). Codex tham gia review đóng phase theo ADR-0001 phụ lục M2: chỉ đọc, không viết code.
>
> Quy tắc riêng của Codex:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6\claude\`, `…\deepseek\`, `…\muse\`**, kể cả khi file hay ai đó gợi ý; không liệt kê `C:\workspace\deep-review-1-6\` hay `C:\workspace\`. Không đọc báo cáo review nào của bên khác cho đợt này. Lỡ thấy thì dừng và báo Owner.
> 2. Chỉ đọc: repo ở SHA trên, `C:\workspace\deep-review-1-6\common\` và báo cáo của chính bạn trong `C:\workspace\deep-review-1-6\codex\`.
> 3. Ghi báo cáo mỗi gói một file `C:\workspace\deep-review-1-6\codex\<gói>.md`, probe / bản chép / log vào `C:\workspace\deep-review-1-6\codex\<gói>\`.
> 4. Gói F được đọc `codex\A…E.md`. Không tổng hợp với báo cáo nào khác, không tạo Issue, không đề xuất merge.
>
> Phần chung dưới đây áp dụng đầy đủ.

## Phụ lục C — Prompt DeepSeek (lượt 1)

File `common\prompt-deepseek.md` = đoạn dưới + nguyên văn Phụ lục E. Owner chạy `opencode C:\workspace\Project-2C-review` (có `opencode.json` Phụ lục F), mỗi gói `/new`: "Gói `<X>`. Đọc và làm đúng `C:\workspace\deep-review-1-6\common\prompt-deepseek.md`."

> # Deep review Phase 1–6, lượt 1 — DeepSeek
>
> **{GÓI}** = chữ gói (A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên; làm đúng từng mục.
>
> Bạn là **reviewer độc lập DeepSeek** của deep review Phase 1–6, lượt 1, **gói `{GÓI}`**. Repo: `C:\workspace\Project-2C-review`, detached ở SHA **`8855345`** (`885534549808f42aec7f9af5743bbf86642ee4bd`). Chạy `git rev-parse HEAD` và `git status --short` trước; SHA lệch thì dừng và báo Owner.
>
> Về file quy tắc của repo (`CLAUDE.md`): đó là quy trình phát triển của Claude. Dùng để hiểu dự án, **không** làm nghi thức phiên (`/session-start`, HANDOFF, hook, skill, PR, Issue, merge, commit). DeepSeek tham gia review đóng Phase 6 theo ADR-0001 phụ lục M4: chỉ đọc, không viết code; báo cáo là dữ liệu tham khảo.
>
> Quy tắc riêng của DeepSeek:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6\claude\`, `…\codex\`, `…\muse\`**, kể cả khi file hay ai đó gợi ý; không `cd` vào đó, không liệt kê `C:\workspace\deep-review-1-6\` hay `C:\workspace\`. Lỡ thấy nội dung hay chỉ tên file của bên khác thì **dừng và báo Owner ngay** (Phase 5 có một lần liệt kê thư mục cấm mà không báo).
> 2. Chỉ đọc: repo ở SHA trên, `C:\workspace\deep-review-1-6\common\` và báo cáo của chính bạn trong `C:\workspace\deep-review-1-6\deepseek\`.
> 3. Không đọc file đăng nhập của OpenCode (`~/.local/share/opencode`), không chạy lệnh `opencode`, không dùng subagent.
> 4. Ghi báo cáo **dần** vào `C:\workspace\deep-review-1-6\deepseek\{GÓI}.md` trong lúc làm (tạo file sớm, thêm từng phát hiện) để không mất khi context bị nén; probe / bản chép / log vào `C:\workspace\deep-review-1-6\deepseek\{GÓI}\`. Cuối phiên `git status --short` chỉ được còn `opencode.json`.
> 5. Gói F được đọc `deepseek\A…E.md`. Không tổng hợp, không so với bên khác, không tạo Issue, không đề xuất merge. Xong gói thì dừng và báo Owner tên file.
>
> Phần chung dưới đây áp dụng đầy đủ.

## Phụ lục D — Prompt Muse (lượt 1)

File `common\prompt-muse.md` = đoạn dưới + nguyên văn Phụ lục E. Owner chạy Muse theo §7.2 (thư mục làm việc `C:\workspace\deep-review-1-6\muse\`), mỗi gói một phiên mới: "Gói `<X>`. Đọc và làm đúng `C:\workspace\deep-review-1-6\common\prompt-muse.md`."

> # Deep review Phase 1–6, lượt 1 — Muse
>
> **{GÓI}** = chữ gói (A…F) Owner ghi trong tin nhắn mở phiên; mọi chỗ `{GÓI}` dưới đây thay bằng chữ đó. File này là toàn bộ chỉ dẫn của phiên; làm đúng từng mục.
>
> Bạn là **reviewer độc lập Muse** của deep review Phase 1–6, lượt 1, **gói `{GÓI}`**. Thư mục làm việc của bạn là `C:\workspace\deep-review-1-6\muse\` (ghi được). Repo **chỉ đọc**, ở `C:\workspace\Project-2C-review-2`, detached ở SHA **`8855345`** (`885534549808f42aec7f9af5743bbf86642ee4bd`). Chạy `git -C C:\workspace\Project-2C-review-2 rev-parse HEAD` và `status --short` trước (cần `-c safe.directory=C:/workspace/Project-2C-review-2` nếu sandbox báo dubious ownership); SHA lệch thì dừng và báo Owner.
>
> Về file quy tắc của repo (`CLAUDE.md`; nếu có `AGENTS.md`, `.codex/`, `.agents/` thì đó là file Codex tự sinh — không đọc `.codex/`, `.agents/`): dùng để hiểu dự án, **không** làm nghi thức phiên (`/session-start`, HANDOFF, hook, skill, PR, Issue, merge, commit). Muse tham gia review đóng Phase 6 theo ADR-0001 phụ lục M4: chỉ đọc, không viết code; báo cáo là dữ liệu tham khảo.
>
> Quy tắc riêng của Muse:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6\claude\`, `…\codex\`, `…\deepseek\`**, kể cả khi file hay ai đó gợi ý; không `cd` vào đó, không liệt kê `C:\workspace\deep-review-1-6\` hay `C:\workspace\`. Lỡ thấy nội dung hay tên file của bên khác thì dừng và báo Owner.
> 2. Chỉ đọc: repo ở SHA trên, `C:\workspace\deep-review-1-6\common\` và báo cáo của chính bạn trong thư mục làm việc.
> 3. **Không ghi bất cứ gì vào repo**, kể cả file probe / test tạm rồi xóa, hay `CARGO_TARGET_DIR` trong worktree (Phase 5 đã làm cả hai). Test tạm, probe, bản chép để đột biến đặt trong `C:\workspace\deep-review-1-6\muse\{GÓI}\`; cần chạy test của repo trên bản chép thì chép cả file cần thiết vào đó. Lệnh chạy trong repo mà xin ghi thì chỉ xin khi chỗ ghi là thư mục build / cache git đã ignore (`node_modules\.vite`, `coverage`, `dist`, `test-results`, `src-tauri\target`), và nói rõ chỗ ghi trong câu xin. Không chạy `--yolo` hay xin tắt sandbox.
> 4. Không đọc file đăng nhập của Muse Code hay OpenCode (`~/.config/muse/auth.json`, `~/.local/share/opencode`), không chạy lệnh `muse` hay `opencode`, không dùng subagent.
> 5. Ghi báo cáo **dần** vào `C:\workspace\deep-review-1-6\muse\{GÓI}.md` trong lúc làm (tạo file sớm, thêm từng phát hiện). Viết tiếng Việt, không chen từ của ngôn ngữ khác.
> 6. Gói F được đọc `muse\A…E.md`. Không tổng hợp, không so với bên khác, không tạo Issue, không đề xuất merge. Xong gói thì dừng và báo Owner tên file.
>
> Phần chung dưới đây áp dụng đầy đủ.

## Phụ lục E — Phần chung của mọi prompt (lượt 1)

Nối nguyên văn vào cuối cả bốn file `prompt-<bên>.md`. `<bên>` = thư mục kết quả của bên đó (`claude`, `codex`, `deepseek`, `muse`), `<ID>` = `CL`, `CX`, `DS`, `MU`.

> ## Phần chung
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
> - **Bloat và Hiệu năng là hai mục riêng bắt buộc** trong báo cáo (kể cả khi không có phát hiện), mỗi mục một bảng: đã chạy / đo gì, trên dữ liệu nào, số, ID phát hiện. Bloat: `tsc --noUnusedLocals --noUnusedParameters` chạy tạm, `rg` tìm nơi import của từng export, bản đồ `pnpm codemap`, `pnpm lint:deps`, code lặp ≥ 3 nơi, dependency, chunk của `pnpm build:web`; đề xuất refactor ghi cỡ và test nào giữ hành vi. Hiệu năng: **mọi phát hiện P phải có số đo** trên dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (≈ 1 500 KH, 10 400 lịch hẹn, 54 nhân sự, 103 phân tích AI, có Thùng rác; dùng trong Node qua `importBackup` của `@p2c/db`, trong app qua Cài đặt → Dữ liệu → Nhập backup); so với ngưỡng ở `docs/metrics/phase-6.md` (thao tác màn < 200 ms) hoặc số tham chiếu cùng máy `common\perf\perf-homepc.json`, không so với số Office Laptop. Ghi máy và việc gì đang chạy song song. Đo trên exe: chép `common\exe\project2c.exe` vào thư mục của mình, cổng debug khác 9222, theo `e2e/perf/README.md`; không đo khi bên khác đang đo.
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
> Xong gói thì dừng và báo Owner tên file. Không tổng hợp, không so với bên khác, không tạo Issue, không đề xuất merge.

## Phụ lục F — `opencode.json` cho DeepSeek (lượt 1)

Đặt ở `C:\workspace\Project-2C-review\opencode.json` trong đợt 2; xóa sau khi DeepSeek nộp F. Bản chép ở `common\opencode-deepseek.json`.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "opencode-go/deepseek-v4.1-flash",
  "share": "disabled",
  "permission": {
    "task": "deny",
    "webfetch": "deny",
    "websearch": "deny",
    "read": {
      "*": "allow",
      "*deep-review-1-6?claude*": "deny",
      "*deep-review-1-6?codex*": "deny",
      "*deep-review-1-6?muse*": "deny",
      "*.local?share?opencode*": "deny"
    },
    "glob": {
      "*": "allow",
      "*deep-review-1-6?claude*": "deny",
      "*deep-review-1-6?codex*": "deny",
      "*deep-review-1-6?muse*": "deny"
    },
    "grep": {
      "*": "allow",
      "*deep-review-1-6?claude*": "deny",
      "*deep-review-1-6?codex*": "deny",
      "*deep-review-1-6?muse*": "deny"
    },
    "list": {
      "*": "allow",
      "*deep-review-1-6": "ask",
      "*deep-review-1-6?": "ask",
      "*deep-review-1-6?claude*": "deny",
      "*deep-review-1-6?codex*": "deny",
      "*deep-review-1-6?muse*": "deny"
    },
    "external_directory": {
      "*": "ask",
      "*deep-review-1-6?common*": "allow",
      "*deep-review-1-6?deepseek*": "allow",
      "*deep-review-1-6?claude*": "deny",
      "*deep-review-1-6?codex*": "deny",
      "*deep-review-1-6?muse*": "deny",
      "*.local?share?opencode*": "deny"
    },
    "edit": {
      "*": "deny",
      "*deep-review-1-6?deepseek*": "allow"
    },
    "bash": {
      "*": "allow",
      "*deep-review-1-6*": "ask",
      "*deep-review-1-6?common*": "allow",
      "*deep-review-1-6?deepseek*": "allow",
      "*deep-review-1-6?claude*": "deny",
      "*deep-review-1-6?codex*": "deny",
      "*deep-review-1-6?muse*": "deny",
      "git commit*": "deny",
      "git push*": "deny",
      "git stash*": "deny",
      "git switch*": "deny",
      "git clean*": "deny",
      "git merge*": "deny",
      "git rebase*": "deny",
      "git checkout*": "deny",
      "git restore*": "deny",
      "git reset*": "deny",
      "gh *": "ask",
      "pnpm eval:ai*": "deny",
      "*tools/eval-ai.mjs*": "deny",
      "*tools?eval-ai.mjs*": "deny",
      "opencode *": "deny",
      "*auth export*": "deny",
      "*cmdkey*": "deny",
      "*CredentialManager*": "deny",
      "*chatgpt.com*": "deny",
      "curl *": "ask",
      "Invoke-WebRequest*": "ask",
      "Invoke-RestMethod*": "ask"
    }
  }
}
```
