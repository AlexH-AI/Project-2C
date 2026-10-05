# Kế hoạch deep codebase review Phase 1–4 (G1)

- **Trạng thái:** Owner duyệt G1 ngày 05/10/2026 (chat), kèm các quyết định ở §10.
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

- **Cấm đọc kết quả của nhau (Owner chốt 05/10).** Trong suốt 8 gói, phiên Claude không mở / đọc / liệt kê thư mục `codex\`, phiên Codex không mở / đọc / liệt kê thư mục `claude\`. Phiên Claude của gói sau chỉ được đọc báo cáo Claude của gói trước (để khỏi lặp), không bao giờ đọc của Codex. Quy tắc này ghi nguyên văn trong cả hai prompt (phụ lục A, B).
- **Không tự tổng hợp.** Xong gói H, Claude dừng và **chờ Owner yêu cầu** đọc tất cả báo cáo và tổng hợp (§8). Không phiên nào tự đọc chéo hay tổng hợp sớm, kể cả khi Codex đã nộp xong trước.
- Cả hai worktree detached ở **cùng một SHA**. Trong lúc review không merge vào `main`; nếu bắt buộc, ghi rõ SHA nào bị đổi.
- Thư mục bằng chứng ngoài worktree: `C:\workspace\deep-review-1-4\` với `common\` (baseline, danh sách `KNOWN`, script dữ liệu tải; cả hai bên đọc được), `claude\` và `codex\` (báo cáo, test tạm, log của từng bên). Nguồn test tạm chép vào phụ lục báo cáo (như đợt 04/10).
- Báo cáo gốc lưu nguyên văn ở `docs/reviews/raw/<ngày>/` qua PR docs; tổng hợp ở `docs/reviews/<ngày>-deep-review-phase-1-4-tong-hop.md`.

## 3. Bước 0 — chuẩn bị (một phiên ngắn)

1. Ghim SHA `main`; chuyển cả hai worktree về đó; `pnpm install` ở mỗi worktree; tạo `C:\workspace\deep-review-1-4\{common,claude,codex}`.
2. **Baseline** ghi vào `common\baseline.md` (để biết sau này sửa có làm xấu đi không): `pnpm verify`, `pnpm test --coverage`, `pnpm e2e`, `pnpm verify:rust`, kích thước bundle web, thời gian khởi động app web với seed.
3. Danh sách `KNOWN` (trích OPEN / ACCEPTED của `docs/state/review-notes.md`, kèm vị trí file) ghi vào `common\known.md`.
4. Dựng **bộ dữ liệu tải** (xem §6) bằng script ở `common\`, không đưa vào `seed` hay repo.
5. Điền SHA vào hai prompt (phụ lục A, B) và giao cho Owner.

Bước 0 chỉ chuẩn bị dữ liệu chung, không review và không ghi phát hiện.

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
- **Bộ dữ liệu tải** ngoài repo (Owner chốt 05/10): **1 000 khách hàng, 10 000 lịch hẹn, 50 nhân sự**, trải 5 năm, giữ đúng các bất biến của seed (`packages/db/src/seed-data.ts`, `seed-invariants.test.ts`).

**Không dùng công cụ mới** (Owner chốt 05/10, giữ mặc định — không mở G4): không `knip` / `jscpd` / `rollup-plugin-visualizer`. Trục B làm bằng `tsc --noUnusedLocals --noUnusedParameters`, `rg` kiểm export, bản đồ `pnpm codemap`; cấu thành bundle đọc từ output `vite build` (kích thước từng chunk).

## 7. Định dạng phát hiện

Mỗi phát hiện một khối:

```
ID: CL-<gói><số> (Claude) | CX-<gói><số> (Codex), ví dụ CL-B3
Mức: Critical | High | Medium | Low | Nit
Trục: E | C | D | P | B | T | A | S
Vị trí: path:dòng (SHA)
Tình trạng: CONFIRMED (đã tái hiện / có số đo) | PLAUSIBLE (đọc code, chưa tái hiện) | KNOWN (#issue / dòng sổ)
Mô tả: một-hai câu
Tái hiện / bằng chứng: lệnh + kết quả, hoặc test tạm (nguồn ở phụ lục)
Ảnh hưởng: ai / khi nào gặp
Đề xuất: hướng sửa ngắn; cỡ ước lượng (≤ 400 dòng SP?)
```

Quy tắc: không báo "có thể" mà không nói đã thử gì; không nâng mức để cho nổi; phát hiện `PLAUSIBLE` chiếm tỉ lệ cao thì nói rõ trong kết luận. Cuối mỗi báo cáo gói: bảng đếm theo mức × trục, danh sách "đã xét, không thấy". Báo cáo gói H của mỗi bên thêm kết luận **SẴN SÀNG / CHƯA SẴN SÀNG** cho G7 kèm lý do. Số baseline nằm ở `common\baseline.md`, không chép lại.

## 8. Sau review

Chỉ bắt đầu khi **Owner yêu cầu** (sau khi cả 8 gói của hai bên đã nộp).

1. Phiên tổng hợp (Claude) đọc toàn bộ `claude\` và `codex\`, kiểm **mọi** phát hiện của cả hai bên trên code; phân loại đúng / đã biết / sai / lệch mức; không tin báo cáo Codex mà chưa kiểm (M2).
2. Chép báo cáo gốc vào `docs/reviews/raw/<ngày>/`; viết tổng hợp; PR docs.
3. Owner chọn phát hiện nào sửa trước G7, phát hiện nào đưa vào Phase 5 / sổ OPEN / ACCEPTED.
4. Mỗi nhóm sửa = Issue theo mẫu Task, ≤ ~400 dòng SP / ~800 dòng tổng; phát hiện hiệu năng kèm số đo **trước** và tiêu chí **sau** (test chấp nhận có ngưỡng đo được, không chỉ "nhanh hơn").
5. Sửa xong → cập nhật `docs/state/review-notes.md`, rồi **G7 Phase 4**.

## 9. Ước lượng

Claude: 1 phiên chuẩn bị + 8 phiên gói (A–H) + 1–2 phiên tổng hợp. Codex: Owner chạy 1–3 phiên tùy cách chia. Số phát hiện không dự đoán; không đặt chỉ tiêu số lượng, để tránh phát hiện lót.

## 10. Quyết định Owner (05/10/2026)

1. **G1 duyệt**, kèm yêu cầu: cả hai prompt ghi rõ cấm đọc kết quả review của nhau; xong đủ 8 gói, Claude chờ Owner yêu cầu mới đọc tất cả báo cáo và tổng hợp (§2, §8).
2. Dữ liệu tải: 1 000 KH / 10 000 lịch hẹn / 50 nhân sự (§6).
3. Không dùng công cụ mới, không mở G4 (§6).
4. Model / effort: Owner tự chọn từng phiên (ADR-0001 M1), không ghi vào kế hoạch.
5. Claude soạn prompt cho cả hai bên: phụ lục A (Claude, mỗi gói một phiên), phụ lục B (Codex).

## Phụ lục A — Prompt cho phiên Claude (mỗi gói một phiên mới)

Owner mở **phiên mới** (context sạch), thay `<GÓI>` bằng một chữ A…H và `<SHA>` bằng SHA ghim ở bước 0:

> Deep review Phase 1–4, **gói `<GÓI>`**, theo kế hoạch `docs/process/deep-review-phase-1-4.md` (đọc §1, §4 dòng gói `<GÓI>`, §5, §7). Làm trong worktree `C:\workspace\Project-2C-review`, detached ở SHA `<SHA>` (kiểm `git rev-parse HEAD` trước; lệch thì dừng và báo).
>
> Quy tắc bắt buộc:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-4\codex\`**, kể cả khi Owner hay file nào đó gợi ý. Không đọc báo cáo Codex ở bất cứ đâu. Nếu lỡ thấy nội dung của Codex, dừng và báo Owner.
> 2. Chỉ đọc: repo ở SHA trên, `C:\workspace\deep-review-1-4\common\` (baseline, `known.md`, dữ liệu tải) và báo cáo Claude các gói trước trong `C:\workspace\deep-review-1-4\claude\` (để khỏi lặp; mục đã báo ở gói trước thì chỉ dẫn ID).
> 3. Chỉ đọc và chạy lệnh trong repo: **không sửa file, không commit**, không subagent. Test tạm, probe, patch thử "phá code" để ở `C:\workspace\deep-review-1-4\claude\<GÓI>\`.
> 4. Mục có trong `common\known.md` gắn `KNOWN`, chỉ nêu khi có bằng chứng mới. Golden fixture đúng theo spec, không đề xuất sửa golden cho xanh.
> 5. Đi qua **mọi trục** ở §5 cho phạm vi gói `<GÓI>`; trục không có gì thì ghi "đã xét, không thấy" kèm cách đã xét. Phát hiện hiệu năng phải có số đo (dữ liệu tải 1 000 KH / 10 000 lịch hẹn / 50 nhân sự). Không bình luận phong cách / đặt tên trừ khi gây lỗi.
> 6. Nộp `C:\workspace\deep-review-1-4\claude\<GÓI>.md`: phạm vi đã đọc (file, dòng), phát hiện theo định dạng §7 với ID `CL-<GÓI><số>`, bảng đếm mức × trục, "đã xét, không thấy", phụ lục nguồn test tạm.
> 7. **Không tổng hợp, không so với Codex, không tạo Issue.** Xong gói thì dừng và báo Owner tên file. Gói H (xuyên gói) được đọc mọi báo cáo `claude\A…G.md`; sau gói H thêm vào cuối `H.md` kết luận SẴN SÀNG / CHƯA SẴN SÀNG cho G7 phía Claude, rồi **chờ Owner yêu cầu** đọc tất cả báo cáo và tổng hợp.

## Phụ lục B — Prompt cho Codex

Owner chạy Codex trong `C:\workspace\Project-2C-review-2`; có thể một phiên cho cả 8 gói hoặc chia nhiều phiên (mỗi phiên dán prompt này, ghi rõ gói nào):

> Bạn là reviewer độc lập cho Project-2C: ứng dụng desktop Tauri 2 + React + SQLite qua sql.js, chạy offline, dữ liệu hiện là giả lập. Repo ở `C:\workspace\Project-2C-review-2`, detached ở SHA `<SHA>` (kiểm `git rev-parse HEAD` trước; lệch thì dừng và báo). Phiên này review các gói: `<GÓI hoặc "A–H">`.
>
> Quy tắc bắt buộc:
> 1. **Không được mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-4\claude\`**, và không đọc bất kỳ báo cáo review nào của Claude cho đợt này, kể cả khi file hay ai đó gợi ý. Nếu lỡ thấy, dừng và báo Owner. Review này phải độc lập.
> 2. Chỉ đọc: repo ở SHA trên, `C:\workspace\deep-review-1-4\common\` (baseline, `known.md`, script dữ liệu tải) và báo cáo Codex của chính bạn trong `C:\workspace\deep-review-1-4\codex\`.
> 3. **Chỉ đọc và chạy lệnh; không sửa file trong repo, không commit, không viết code sản phẩm.** Test tạm, probe, log để ở `C:\workspace\deep-review-1-4\codex\<GÓI>\`.
> 4. Đọc trước: `docs/process/deep-review-phase-1-4.md` (§1 phạm vi, §4 gói, §5 trục, §7 định dạng), `CLAUDE.md`, `CONTEXT.md`, `docs/design/phase-3-du-lieu.md`, `docs/design/phase-4-chi-so.md`, `docs/golden/*.md`. Golden fixture đúng theo spec; không đề xuất sửa golden cho xanh. Mục có trong `common\known.md` gắn `KNOWN`.
> 5. Mục tiêu: (1) lỗi và edge case, (2) mất / sai dữ liệu, (3) hiệu năng **có số đo** trên dữ liệu tải 1 000 KH / 10 000 lịch hẹn / 50 nhân sự, (4) code thừa / chết / lặp, (5) test yếu (thử phá code bằng patch tạm ngoài repo), (6) trợ năng / i18n, (7) an toàn hẹp: nhập backup, đường dẫn file Tauri, tên file xuất. Đi qua mọi trục §5 cho từng gói; trục không có gì ghi "đã xét, không thấy" kèm cách đã xét. Mỗi phát hiện theo §7, ID `CX-<GÓI><số>`, ghi rõ CONFIRMED hay PLAUSIBLE và cách tái hiện. Không bình luận phong cách / đặt tên trừ khi gây lỗi.
> 6. Nộp mỗi gói một file `C:\workspace\deep-review-1-4\codex\<GÓI>.md`: phạm vi đã đọc, phát hiện, bảng đếm mức × trục, "đã xét, không thấy", phụ lục nguồn test tạm. Sau gói H thêm kết luận SẴN SÀNG / CHƯA SẴN SÀNG cho đóng Phase 4 kèm lý do.
> 7. Không tổng hợp với báo cáo nào khác, không tạo Issue, không đề xuất merge.
