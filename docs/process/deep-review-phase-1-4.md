# Kế hoạch deep codebase review Phase 1–4 (G1)

- **Trạng thái:** Đề xuất, chờ Owner duyệt (G1). Công cụ mới ở §6 cần G4 riêng.
- **Soạn:** 05/10/2026 · **SHA nền hiện tại:** `2db3e1a` (`main` sau T-137, #346); SHA ghim thật chốt ở bước 0.
- **Khác review đóng Phase 4 (04/10):** review đó nhìn diff `5eb7c03..595ef79` và tìm lỗi theo luồng người dùng. Đợt này đọc **toàn bộ code Phase 1–4** để tìm lỗi còn nằm sâu, edge case, code thừa / chết và điểm nghẽn hiệu năng, **trước khi qua Phase 5**. Cùng khuôn: Claude phiên sạch + Codex độc lập (ADR-0001 phụ lục M2).

## 1. Mục tiêu và phạm vi

Tìm, theo thứ tự ưu tiên:

1. **Lỗi đúng-sai và edge case** (ranh giới tháng / năm / nửa đêm, rỗng, một phần tử, số lớn, âm, trùng, thứ tự).
2. **Toàn vẹn dữ liệu** (migration, backup nhập / xuất, bất biến seed, KYC hash, ghi file qua Rust).
3. **Hiệu năng** (thuật toán, render thừa, truy vấn, bundle, mở app khi dữ liệu lớn).
4. **Code thừa / chết / lặp**, abstraction vô ích, export không ai dùng.
5. **Test yếu** (test không bắt được lỗi thật, mock quá tay, phụ thuộc thứ tự, ngày hệ thống).
6. **Trợ năng và i18n** còn sót.

Ngoài phạm vi: thiết kế sản phẩm mới, đổi mockup, bảo mật web (app offline, không server / đăng nhập). Bảo mật chỉ xét **nhập backup, đường dẫn file Tauri (`capabilities/default.json`, `storage.rs`), tên file xuất**; chỗ lưu API key là việc của D-1 / G6 Phase 5.

Không báo lại mục đã có ở `docs/state/review-notes.md` (OPEN / ACCEPTED): gắn nhãn `KNOWN`, chỉ nêu thêm nếu có bằng chứng mới.

## 2. Vai trò và quy tắc độc lập

| Bên | Chỗ làm | Việc |
|---|---|---|
| Claude (phiên sạch, mỗi gói một phiên, **tuần tự**, không subagent) | `C:\workspace\Project-2C-review` | Đọc, chạy lệnh, viết test tạm ngoài repo; không commit |
| Codex (Owner chạy) | `C:\workspace\Project-2C-review-2` | Như trên; **không viết code vào repo** |
| Claude (phiên tổng hợp, sau cùng) | checkout chính | Kiểm lại từng phát hiện của cả hai trên code, phân loại, tạo Issue |

- Hai bên **không xem báo cáo của nhau** cho tới khi cả hai nộp xong.
- Cả hai worktree detached ở **cùng một SHA**. Trong lúc review không merge vào `main`; nếu bắt buộc, ghi rõ SHA nào bị đổi.
- Test tạm, probe, log, file bằng chứng để **ngoài worktree** (`C:\workspace\deep-review-1-4\`), nguồn test tạm chép vào phụ lục báo cáo (như đợt 04/10).
- Báo cáo gốc lưu nguyên văn ở `docs/reviews/raw/<ngày>/` qua PR docs; tổng hợp ở `docs/reviews/<ngày>-deep-review-phase-1-4-tong-hop.md`.

## 3. Bước 0 — chuẩn bị (một phiên ngắn)

1. Ghim SHA `main`; chuyển cả hai worktree về đó; `pnpm install` ở mỗi worktree.
2. **Baseline** (ghi số vào đầu báo cáo, để biết sau này sửa có làm xấu đi không): `pnpm verify`, `pnpm test --coverage`, `pnpm e2e`, `pnpm verify:rust`, kích thước bundle web, thời gian khởi động app web với seed.
3. Đưa danh sách `KNOWN` (trích OPEN / ACCEPTED, kèm vị trí file) vào thư mục bằng chứng để cả hai bên dùng chung.
4. Dựng **bộ dữ liệu tải** ngoài repo (xem §6): sinh bằng script trong thư mục bằng chứng, không đưa vào `seed`.

## 4. Chia gói (≈ 25 000 dòng sản phẩm + ≈ 17 000 dòng test)

| Gói | Phạm vi | Dòng SP / test | Trọng tâm riêng |
|---|---|---|---|
| **A. domain** | `packages/domain` (+ golden) | 2 700 / 3 000 | Tiền, ngày, kỳ, chỉ số, nhóm KH; ranh giới kỳ; số lớn / âm; golden không bị chiều theo code |
| **B. db** | `packages/db` | 4 000 / 4 500 | Schema vs lệnh vs backup có khớp nhau; ràng buộc thiếu CHECK; migration; transaction; `backup.ts` (`valueOf`, `ORDER BY`); chỉ mục / truy vấn chậm; bất biến seed |
| **C. Rust** | `apps/desktop/src-tauri` (`storage.rs` 1 100 dòng) | 1 240 / 37 test Rust | Ghi file nguyên tử, khóa, race khi `replace` chồng nhau (S-2), đường dẫn, `unsafe`, lỗi Windows (sharing violation, quyền, ổ đầy), `dead_code` ngoài Windows |
| **D. ui + shell + data + i18n** | `packages/ui`, `apps/desktop/src/{shell,data,i18n}` | 3 300 / 1 000 | `DataTable` (sắp, rỗng, `sortable:false`), Chart, ErrorBoundary, CloseGuard, `app-data` (mở / lưu / thay), chuỗi i18n thiếu / thừa / lệch |
| **E. Lịch hẹn + Khách hàng** | `routes/appointments`, `routes/customers` | 5 500 / ~2 500 | Máy trạng thái lịch hẹn, chuyển nhóm KH, KYC, hộp thoại và lỗi, state form, trợ năng |
| **F. Tổng quan + Báo cáo + Team + Cài đặt** | `routes/{overview,reports,team}`, `Settings*`, `FilterBar`, `PeriodPicker` | 3 000 / ~1 500 | Số liệu giữa các màn khớp nhau và khớp Excel; kỳ Tùy chọn dài; nửa đêm; render thừa |
| **G. tools + CI + e2e** | `tools/`, `.github`, `.claude/hooks`, `e2e/` | 1 800 / 4 500 | Script quy trình có an toàn không (đè dữ liệu, git, `$LASTEXITCODE`), test e2e flaky / giả xanh, độ phủ e2e |
| **H. Xuyên gói** (sau cùng) | toàn repo | — | Ranh giới module, code chết xuyên gói, lặp giữa gói, nhất quán lỗi / mã lỗi, hiệu năng mở app đầu-cuối |

Thứ tự phiên Claude: A → B → C → D → E → F → G → H (gói sau dùng phát hiện của gói trước để khỏi lặp). Codex tự chọn thứ tự nhưng nộp theo cùng cấu trúc gói.

## 5. Trục kiểm (checklist dùng chung cho cả hai bên)

Mỗi gói đi qua **mọi trục** dưới đây; trục nào không có gì thì ghi "đã xét, không thấy" kèm cách đã xét.

- **E — Edge case:** rỗng / 1 phần tử / lớn; ngày: 29/02, 31 → tháng 30 ngày, cuối năm, nửa đêm, DST không có nhưng múi giờ máy khác; số: 0, âm, `MAX_SAFE_INTEGER`, làm tròn; chuỗi: dài, Unicode, chuỗi có `\`, tên trùng; thứ tự và ổn định khi sắp; hai thao tác chồng nhau.
- **C — Đúng hợp đồng:** hàm làm đúng điều tên / doc comment / nhãn UI nói (quy tắc "nhãn UI hiểu theo nghĩa thường"); hai chỗ cùng tính một thứ có ra cùng số không.
- **D — Dữ liệu:** mọi đường ghi có kiểm cùng luật với đường nhập backup; không mất dữ liệu khi lỗi giữa chừng; `INSERT` / `UPDATE` ngoài transaction.
- **P — Hiệu năng:** vòng lặp lồng nhau trên dữ liệu thuộc cỡ N; tính lại trong render; danh sách không ảo hóa; truy vấn thiếu chỉ mục / N+1; sao chép mảng lớn; bundle (thư viện nặng nạp sớm, không tách chunk); thời gian mở và lưu DB. **Mọi phát hiện P phải kèm số đo** (ms / KB / số lần render), không suy đoán.
- **B — Bloat:** export không ai import; hàm / tham số / prop / key i18n không dùng; nhánh không thể xảy ra; abstraction chỉ có một nơi dùng; code lặp ≥ 3 nơi; dependency không dùng.
- **T — Chất lượng test:** test có thật sự đỏ khi code sai (thử phá code đúng một chỗ bằng patch tạm ngoài repo); assertion rỗng; test chép lại công thức của code; phụ thuộc ngày hệ thống / thứ tự.
- **A — Trợ năng / i18n:** nhãn, `aria-*`, thứ tự Tab, bẫy focus trong dialog, tương phản, chuỗi cứng, định dạng số / ngày.
- **S — An toàn (hẹp):** như §1.

## 6. Công cụ đo

Dùng sẵn có, không cần duyệt thêm:

- `pnpm verify`, `pnpm lint:deps`, `pnpm test --coverage` (số thật, đọc cả file không nằm trong `coverage.include`), `pnpm e2e`, `pnpm verify:rust`, `cargo clippy` mức nghiêm hơn (`-W clippy::pedantic` chạy một lần, ghi kết quả, không đổi cấu hình repo), `tsc --noUnusedLocals --noUnusedParameters` chạy tạm.
- Profile trình duyệt (Edge DevTools / Performance, React Profiler dạng build dev) trên `pnpm dev:web`; đo trong Node cho phần thuần.
- **Bộ dữ liệu tải** ngoài repo. **Giả định cần Owner xác nhận:** 2 000 khách hàng, 20 000 lịch hẹn, 60 nhân sự, trải 5 năm — bội số hợp lý so với seed hiện tại (xem `packages/db/src/seed-data.ts`). Nếu Owner có quy mô thật khác, thay số này.

**Cần G4 (đề xuất, mặc định là KHÔNG cài):** `knip` (export / file / dependency chết), `jscpd` (trùng lặp), `rollup-plugin-visualizer` (cấu thành bundle). Cả ba chỉ chạy một lần trong worktree review qua `pnpm dlx`, **không** thêm vào `package.json` hay CI. Nếu không duyệt, trục B làm bằng `tsc --noUnusedLocals`, `rg` kiểm export và bản đồ `pnpm codemap`.

## 7. Định dạng phát hiện

Mỗi phát hiện một khối:

```
ID: DR-<gói><số>   (Claude: CL5-…, Codex: CX5-… nếu muốn tách)
Mức: Critical | High | Medium | Low | Nit
Trục: E | C | D | P | B | T | A | S
Vị trí: path:dòng (SHA)
Tình trạng: CONFIRMED (đã tái hiện / có số đo) | PLAUSIBLE (đọc code, chưa tái hiện) | KNOWN (#issue / dòng sổ)
Mô tả: một-hai câu
Tái hiện / bằng chứng: lệnh + kết quả, hoặc test tạm (nguồn ở phụ lục)
Ảnh hưởng: ai / khi nào gặp
Đề xuất: hướng sửa ngắn; cỡ ước lượng (≤ 400 dòng SP?)
```

Quy tắc: không báo "có thể" mà không nói đã thử gì; không nâng mức để cho nổi; phát hiện `PLAUSIBLE` chiếm tỉ lệ cao thì nói rõ trong kết luận. Cuối báo cáo: bảng đếm theo mức × trục, danh sách "đã xét, không thấy", bảng số baseline, kết luận **SẴN SÀNG / CHƯA SẴN SÀNG** cho G7 kèm lý do.

## 8. Sau review

1. Phiên tổng hợp (Claude) kiểm **mọi** phát hiện của cả hai bên trên code; phân loại đúng / đã biết / sai / lệch mức; không tin báo cáo Codex mà chưa kiểm (M2).
2. Chép báo cáo gốc vào `docs/reviews/raw/<ngày>/`; viết tổng hợp; PR docs.
3. Owner chọn phát hiện nào sửa trước G7, phát hiện nào đưa vào Phase 5 / sổ OPEN / ACCEPTED.
4. Mỗi nhóm sửa = Issue theo mẫu Task, ≤ ~400 dòng SP / ~800 dòng tổng; phát hiện hiệu năng kèm số đo **trước** và tiêu chí **sau** (test chấp nhận có ngưỡng đo được, không chỉ "nhanh hơn").
5. Sửa xong → cập nhật `docs/state/review-notes.md`, rồi **G7 Phase 4**.

## 9. Ước lượng

Claude: 1 phiên chuẩn bị + 8 phiên gói (A–H) + 1–2 phiên tổng hợp. Codex: Owner chạy 1–3 phiên tùy cách chia. Số phát hiện không dự đoán; không đặt chỉ tiêu số lượng, để tránh phát hiện lót.

## 10. Câu hỏi cho Owner

1. **G1:** duyệt kế hoạch này (phạm vi, chia gói, quy tắc độc lập)?
2. **Quy mô dữ liệu tải:** giữ 2 000 KH / 20 000 lịch hẹn / 60 nhân sự hay có số khác?
3. **G4:** có cho chạy một lần `knip` / `jscpd` / `rollup-plugin-visualizer` qua `pnpm dlx` không? (mặc định: không.)
4. **Mô hình / effort** cho các phiên Claude (Owner chọn từng phiên theo ADR-0001 M1); đề nghị mức cao nhất cho gói B, C, E.
5. **Codex:** dùng prompt ở phụ lục A, hay Owner có prompt riêng?

## Phụ lục A — Prompt cho Codex (bản đề xuất)

> Bạn là reviewer độc lập cho Project-2C (ứng dụng desktop Tauri 2 + React + SQLite qua sql.js, offline, dữ liệu hiện là giả lập). Repo ở `C:\workspace\Project-2C-review-2`, detached ở SHA `<SHA>`. **Chỉ đọc và chạy lệnh; không sửa file trong repo, không commit.** Test tạm, probe và log để ở `C:\workspace\deep-review-1-4\codex\`.
>
> Nhiệm vụ: review toàn bộ code Phase 1–4 để tìm: (1) lỗi và edge case, (2) mất / sai dữ liệu, (3) vấn đề hiệu năng (có số đo), (4) code thừa / chết / lặp, (5) test yếu, (6) trợ năng / i18n. Đọc `CLAUDE.md`, `CONTEXT.md`, `docs/design/phase-3-du-lieu.md`, `docs/design/phase-4-chi-so.md`, `docs/golden/*.md`. Golden fixture là đúng theo spec; không đề xuất sửa golden cho xanh. Mục có trong `docs/state/review-notes.md` (OPEN / ACCEPTED) là đã biết: gắn `KNOWN`.
>
> Đi qua từng gói (domain, db, Rust, ui/shell/data/i18n, Lịch hẹn + KH, Tổng quan + Báo cáo + Team + Cài đặt, tools/CI/e2e, xuyên gói) và từng trục ở §5. Mỗi phát hiện theo định dạng §7, **kèm cách tái hiện**; nêu rõ CONFIRMED hay PLAUSIBLE. Phát hiện hiệu năng phải có số đo trên bộ dữ liệu tải. Không bình luận phong cách / đặt tên trừ khi gây lỗi.
>
> Nộp một file Markdown: kết luận SẴN SÀNG / CHƯA SẴN SÀNG cho đóng Phase 4, bảng baseline (`verify`, coverage, e2e, Rust, bundle), phát hiện theo gói, danh sách "đã xét, không thấy", và phụ lục nguồn test tạm.
