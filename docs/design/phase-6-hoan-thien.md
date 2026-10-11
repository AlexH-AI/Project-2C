# Spec Phase 6 — Hoàn thiện & phát hành v1.0 (G1)

- **Trạng thái:** bản nháp, chờ Owner duyệt **G1** (phạm vi, thứ tự, kế hoạch kiểm thử, kế hoạch review đóng phase). Chi tiết từng tính năng ở §4 (luật, mockup) viết và duyệt riêng (G2 / G3) trước khi tách Issue của tính năng đó.
- **Soạn:** 11/10/2026, sau G7 Phase 5 (`main` `3d6c7fc`). Nguồn: `PROJECT-PLAN.md` §5 dòng Phase 6, ADR-0010 (đồng bộ), comment Owner trên #72 (Thùng rác), D-2 / S-1 / S-2 ở `docs/reviews/2026-09-30-phase-1-3-tong-hop.md`, yêu cầu Owner 11/10 (kiểm thử toàn diện; 2 lượt deep review Phase 1–6 bằng 4 agent; phân tích bloat code và hiệu năng; gộp bớt số gói review; #491 sau khi duyệt spec; bỏ so sánh với Project-2; chưa làm `Project-2C-data` ở v1.0).

## 1. Mục tiêu và tiêu chí xong

Phase 6 đưa app tới **v1.0**: dùng được hằng ngày trên hai máy, dữ liệu không mất. Không còn so sánh với Project-2 (Owner quyết 11/10/2026, ADR-0002 Superseded): không có `docs/metrics/FINAL.md`, `docs/COMPARISON.md` hết hiệu lực.

Tiêu chí phát hành v1.0 (G7 cuối):

1. Milestone Phase 6 đóng hết Issue.
2. Kiểm thử phát hành (§5) đạt: kịch bản trọn vòng e2e xanh, danh sách nghiệm thu của Owner đạt, đo hiệu năng trên dữ liệu tải đạt ngưỡng §5.2, exe chạy được trên hai máy và trên một máy Windows sạch, nâng từ exe Phase 5 không mất dữ liệu.
3. Hai lượt deep review Phase 1–6 (§6) xong; mọi phát hiện từ Medium trở lên đã sửa, phần còn lại Owner đã quyết (sửa / hoãn sau v1.0 / chấp nhận).
4. `pnpm verify`, `pnpm verify:rust`, `pnpm e2e` xanh trên SHA phát hành; eval AI thật đạt ngưỡng spec Phase 5 §11 sau đợt G5.
5. Hướng dẫn sử dụng tiếng Việt có trong repo và trong bản phát hành.

## 2. Thứ tự

| Bước | Nội dung | Cổng |
|---|---|---|
| **6A** | Việc còn lại từ review Phase 5 (§3), bắt đầu bằng đợt G5 #491 **sau khi spec này qua G1** | G5 (#491) |
| **6B** | Tính năng còn lại (§4): S-2, Thùng rác, hướng dẫn sử dụng | G2 / G3 từng tính năng |
| **6C** | Kiểm thử phát hành (§5), gồm lệnh sinh dữ liệu tải và số đo nền hiệu năng / kích thước | — |
| **6D** | Deep review Phase 1–6, **2 lượt × 4 agent, 6 gói** (§6); **phân tích bloat code và hiệu năng nằm trong lượt 1**; sửa sau mỗi lượt | Owner chọn việc sửa sau mỗi lượt |
| **6E** | G7: Owner nghiệm thu exe cuối, chỉ số Phase 6, phát hành v1.0 (§7) | **G7** |

6A và 6B có thể xen nhau (khác file). Phần tự động của 6C chạy lại sau mỗi đợt sửa của 6D.

**Vì sao phân tích bloat / hiệu năng không đứng riêng, trước hay sau review:**

- **Không để sau 6D:** refactor bỏ bloat và sửa hiệu năng đụng nhiều file. Làm sau lượt review cuối thì code phát hành là code chưa ai review lại, đúng lúc sát v1.0 (lệch nguyên tắc "review đúng SHA sẽ merge / phát hành").
- **Không cần đứng riêng trước 6D:** bốn agent đều phải đi qua hai trục bloat / hiệu năng ở lượt 1, Claude đi thêm một lượt riêng ở gói F (§6.2). Phân tích một mình trước rồi lại review cùng trục là làm hai lần.
- **Cách làm:** việc chuẩn bị đo (dữ liệu tải, số đo nền) làm sớm ở 6C vì kiểm thử phát hành cũng cần; phát hiện bloat / hiệu năng gộp vào bản tổng hợp lượt 1 và sửa trong đợt sửa lượt 1; **lượt 2 kiểm lại các refactor đó** (hành vi không đổi, số đo không xấu đi).

## 3. 6A — việc còn lại từ Phase 5

Đã có trong milestone Phase 6: #491 T-197 (đợt G5: chặn nhầm, so khớp, ví dụ prompt, R2-04; `gate`), #488 T-198 (script eval), #492 T-199 (`packages/ai` chịu đầu vào / đầu ra bất thường), #493 T-200 (khoảng trống test), #494 T-201 (gộp nhãn / kiểu trường / Mock), #509 T-205 (trợ năng AI), #510 T-206 (phạm vi docs-only của `pnpm verify`). Sau #491: chạy lại eval AI thật (Owner chạy, gói Go).

## 4. 6B — tính năng còn lại

Mỗi mục dưới đây có phần spec chi tiết riêng (thêm vào file này, §4.x) qua G2 / G3 trước khi tách Issue.

1. **S-2 — tuần tự hóa thay DB / lưu / xuất.** Một hàng đợi duy nhất cho mọi thao tác file (ghi muộn trong lúc chờ backup → thay DB #96; hai `replace` chồng nhau #192). Cần cho v1.0 dù chưa có đồng bộ, vì là lỗi chạy đua của thao tác hiện có.
2. **Thùng rác (#72).** Màn khôi phục bản ghi xóa mềm, gộp với nhóm quản lý dữ liệu ở Cài đặt; chốt một lần quy tắc khôi phục chéo (D10, người / KH đã xóa) ở G2; mockup G3.
3. **Hướng dẫn sử dụng tiếng Việt** (`docs/user-guide/`), theo từng màn, có ảnh chụp từ bản build; kèm vào bản phát hành.

**Ra khỏi v1.0 (Owner quyết 11/10/2026):** đồng bộ `Project-2C-data` (ADR-0010 phương án D). Dữ liệu v1 là dữ liệu giả lập; khi chuyển sang dữ liệu nhập liệu sẽ chọn phương án backup lên cloud phù hợp hơn (ADR mới khi đó). Kéo theo: **S-1** (snapshot mỗi bảng một file, D-2) và **gộp backup / phát hiện xung đột** giữa hai máy — cả hai chỉ phục vụ đồng bộ — cũng ra khỏi v1.0 và xét lại cùng phương án cloud. v1.0 chuyển dữ liệu giữa hai máy bằng xuất / nhập `.p2cbackup` như hiện nay.

Không thêm tính năng ngoài danh sách này trong Phase 6 (việc mới ghi sang sau v1.0).

## 5. 6C — kiểm thử phát hành

1. **Kịch bản trọn vòng tự động (e2e):** một chuỗi trên bản build web đi hết vòng nghiệp vụ — tạo team / RE → khách hàng → ghi chú KYC + xác nhận dữ kiện → lịch hẹn → kết quả cuộc gặp → hợp đồng → Tổng quan / Báo cáo khớp số → AI (Mock) → xóa mềm + khôi phục ở Thùng rác → xuất backup → nạp lại → nhập backup → số liệu như trước. Chạy trong CI như e2e hiện có.
2. **Danh sách nghiệm thu cho Owner** `docs/testing/nghiem-thu-v1.md`: theo từng màn và từng dòng mockup, mỗi dòng có thao tác + kết quả mong đợi + ô Đạt / Lỗi; dùng ở 6C (lượt thử) và ở G7 (lượt cuối trên exe phát hành).
3. **Exe trên máy thật:** hai máy của Owner và một máy Windows sạch (vd. Windows Sandbox, Owner chạy): lần chạy đầu, thư mục dữ liệu, không cần quyền admin; **nâng từ exe Phase 5** (`3d6c7fc`) giữ nguyên dữ liệu; backup máy này → nhập máy kia và ngược lại.
4. **Độ bền dữ liệu:** tắt app giữa lúc lưu / thay DB / xuất (S-2), file DB hỏng, ổ đầy hoặc không ghi được — app báo lỗi rõ, không mất bản đã lưu.
5. **Hiệu năng** trên dữ liệu tải theo §5.2, đo trên exe release.
6. **Eval AI thật** sau đợt G5 (§3).

Lỗi tìm ra ở 6C thành Issue thường; lỗi chặn phát hành gắn `risk:high`.

### 5.1 Dữ liệu tải và số đo nền

- Bộ dữ liệu tải của deep review Phase 1–4 (1 496 KH, 10 434 lịch hẹn) chỉ nằm ngoài repo trên Office Laptop. Thêm **một lệnh sinh dữ liệu tải tất định trong repo** (cùng cỡ, thêm `ai_analyses` và dữ liệu Phase 6) để hai máy và bốn reviewer đo cùng một bộ.
- **Số đo nền** ghi vào `docs/metrics/phase-6.md` trước lượt review 1: thời gian các thao tác ở §5.2, bộ nhớ webview, kích thước bundle web theo gói JS và exe; số dòng sản phẩm / test theo vùng. Đây là mốc để lượt 2 so "không xấu đi".

### 5.2 Ngưỡng hiệu năng

- Đo: mở app (lần đầu / mở lại), màn đầu sau tải lại, đổi kỳ / sắp cột / chọn dòng ở Lịch hẹn, Khách hàng, Tổng quan, Báo cáo, xuất Excel, panel AI và lịch sử phân tích, nhập / xuất backup, lưu DB.
- Giữ ngưỡng Nhóm C của deep review Phase 1–4 (thao tác màn < 200 ms trên dữ liệu tải; `docs/metrics/phase-4.md` mục "Đo đầu-cuối"), thêm ngưỡng cho màn Phase 5 / 6 sau số đo nền. Không màn nào xấu hơn số đo Phase 4.

## 6. 6D — deep review Phase 1–6: 2 lượt × 4 agent

### 6.1 Vai trò

| Bên | Ai chạy | Việc |
|---|---|---|
| Claude (phiên sạch mỗi gói, tuần tự, không subagent) | Owner mở phiên | Reviewer, chỉ đọc, worktree review riêng |
| Codex | Owner | Reviewer độc lập, chỉ đọc (ADR-0001 M2) |
| DeepSeek v4.1 Flash (OpenCode) | Owner | Reviewer độc lập, chỉ đọc |
| Muse Spark (Muse Code) | Owner | Reviewer độc lập, chỉ đọc |
| **Claude (phiên tổng hợp)** | sau khi đủ báo cáo | **Vai chính:** đọc mọi báo cáo, kiểm lại từng phát hiện trên code (đúng / đã biết / sai), gộp trùng, chốt mức, đề xuất hướng giải quyết cho từng vấn đề (kèm phương án khi có nhiều cách), xếp việc sửa thành phương án cho Owner chọn |

Báo cáo của Codex / DeepSeek / Muse là **dữ liệu tham khảo**; kết luận "sẵn sàng phát hành" chỉ lấy từ phiên tổng hợp sau khi đã kiểm trên code (bài học Phase 5: DeepSeek / Muse kết luận SẴN SÀNG khi còn 2 lỗi Medium — `docs/reviews/2026-10-10-danh-gia-deepseek-muse.md` §7).

### 6.2 Chia 6 gói

Cỡ đo trên `3d6c7fc` (dòng sản phẩm / test; Rust có test trong cùng file), cộng phần Phase 6 dự kiến. Phase 5 cũng 6 gói, mỗi bên ≈ 2–3 giờ.

| Gói | Phạm vi | Dòng SP / test (hiện tại) | Trọng tâm riêng |
|---|---|---|---|
| **A. Lõi dữ liệu** | `packages/domain` + `packages/db` (schema, migration, repository, backup, seed) | 7 400 / 9 100 | Tiền, ngày, kỳ, chỉ số; bất biến dữ liệu; nhập backup; golden không chiều theo code |
| **B. File và Rust** | `apps/desktop/src-tauri` + lớp `src/data` (adapter lưu, thay DB) + S-2 (Phase 6) | 3 100 Rust + ≈ 1 500 TS + phần S-2 | Ghi nguyên tử, hàng đợi S-2, mất dữ liệu, ranh giới bảo mật (đường dẫn, key) |
| **C. AI** | `packages/ai` + màn / view AI (panel, lịch sử, ChatGPT web, trích xuất, Cài đặt → AI) | 1 700 + ≈ 1 500 / 2 200 + test view | Guardrail G5, validator, STALE, key không sang webview |
| **D. Màn nhập liệu** | `packages/ui`, shell, i18n, Khách hàng (phần không AI), KYC, Team | ≈ 7 000 / ≈ 4 000 | Khớp mockup / nhãn, form, trợ năng |
| **E. Lịch hẹn, chỉ số, quản lý** | Lịch hẹn, Kết quả, Hợp đồng, Tổng quan, Báo cáo, Cài đặt, Thùng rác (Phase 6) | ≈ 6 000 / ≈ 2 000 | Đếm / lọc đúng nghĩa nhãn, số khớp giữa màn, xuất Excel |
| **F. Xuyên gói + bloat / hiệu năng + công cụ** | `tools/`, CI, e2e; luồng xuyên gói; **toàn bộ codebase cho trục bloat / hiệu năng** | 2 300 / 6 900 | Code chết / lặp / export thừa, dependency, bundle / exe, đo trên dữ liệu tải, test yếu, CI |

Gói F là chỗ phân tích bloat code và hiệu năng toàn cục (yêu cầu Owner 11/10); các gói A–E vẫn ghi hai trục này trong phạm vi của mình. Nếu cần gọn hơn nữa, gộp D + E (5 gói) — đổi lại gói D+E ≈ 13 000 dòng SP, dài gấp đôi gói khác.

### 6.3 Cách làm (theo khuôn deep review Phase 1–4 và Phase 5)

- **Kế hoạch chi tiết** `docs/process/deep-review-phase-1-6.md` soạn ở bước 0 của lượt 1 (SHA ghim, prompt từng bên, KNOWN, baseline lấy từ §5.1), Owner duyệt trước khi chạy.
- **Trục:** các trục của deep review trước (đúng-sai / edge case, toàn vẹn dữ liệu, bảo mật ở ranh giới, test yếu, trợ năng / i18n, khớp spec / mockup / nhãn) **và hai trục bắt buộc ghi riêng: bloat code, hiệu năng** (đo trên dữ liệu tải §5.1).
- **Độc lập:** cùng SHA, mỗi bên một thư mục, cấm đọc báo cáo của nhau cho tới phiên tổng hợp; kiểm bằng log phiên như Phase 5.
- **Muse:** cấu hình sandbox trước (thư mục kết quả ghi được, repo chỉ đọc, không chế độ không hỏi) để tránh hàng chục lần Owner duyệt tay.
- **Lượt 1** trên SHA sau 6C → tổng hợp (gồm phần bloat / hiệu năng: số đo, phát hiện, đề xuất refactor) → Owner chọn → sửa (Issue thường, review phiên sạch; refactor giữ nguyên hành vi, test cũ xanh trước và sau, không đổi golden).
- **Lượt 2** trên SHA sau đợt sửa lượt 1, cùng 6 gói, cùng 4 bên, có hai phần ngang nhau (Owner chốt 11/10):
  1. **Kiểm phần đã sửa:** trạng thái từng vấn đề lượt 1 (đã sửa / một phần / hồi quy); refactor bloat / hiệu năng không đổi hành vi; số đo không xấu hơn nền.
  2. **Tìm lỗi mới và edge case mới** trên toàn bộ phạm vi gói, không chỉ quanh chỗ đã sửa: prompt lượt 2 yêu cầu mỗi bên thử những kịch bản / biên chưa có trong báo cáo lượt 1 (danh sách vấn đề lượt 1 đưa vào KNOWN để không báo lại).

  → tổng hợp → Owner chọn → sửa.
- Báo cáo gốc lưu nguyên văn ở `docs/reviews/raw/<ngày>/{claude,codex,deepseek,muse}/` qua PR docs; tổng hợp ở `docs/reviews/`.
- Công cụ phân tích: ưu tiên thứ đã có (`dependency-cruiser`, `codemap`, script `node`). Công cụ mới (vd. `knip`, `cargo-bloat`) là **G4**.

### 6.4 Ước lượng

6 gói × 4 bên = 24 báo cáo mỗi lượt, 48 cho hai lượt. Theo Phase 5: mỗi bên ≈ 2–3 giờ đồng hồ một lượt (Phase 1–6 lớn hơn, ước ≈ 3–4 giờ); DeepSeek ≈ 1 USD trừ vào hạn mức gói Go; Muse tốn thời gian chờ duyệt nếu chưa cấu hình sandbox.

### 6.5 Quy tắc

ADR-0001 phụ lục **M4** (cùng PR với spec này): ở review đóng Phase 6, DeepSeek và Muse tham gia như Codex — chỉ đọc, không viết code, báo cáo là dữ liệu tham khảo, không thay review phiên sạch. Không mở Agent tool, không cho agent ngoài viết code; multi-agent thử ở project mới, không ở 2C (Owner 11/10). Bỏ so sánh với Project-2 nên không còn ràng buộc từ `docs/COMPARISON.md` (ADR-0001 phụ lục M3, ADR-0002 Superseded).

## 7. 6E — G7 và phát hành v1.0

- Owner nghiệm thu exe cuối theo `docs/testing/nghiem-thu-v1.md`, điền số Owner vào `docs/metrics/phase-6.md`.
- **GitHub Release v1.0** (repo public): exe + hướng dẫn sử dụng; đăng Release là thao tác công khai nên chỉ làm khi Owner bảo ở G7.
- Đánh giá cuối dự án (thay `FINAL.md` cũ): chỉ số Phase 1–6 của 2C, ghi trong `docs/metrics/phase-6.md`.
## 8. Quyết định Owner 11/10 và câu hỏi còn lại (G1)

Đã chốt 11/10: #491 làm sau khi spec này qua G1; lượt 2 vừa kiểm phần đã sửa vừa tìm lỗi / edge case mới (§6.3); bỏ so sánh với Project-2 (Project-2 dừng; ADR-0002 Superseded, `COMPARISON.md` hết hiệu lực, ADR-0001 phụ lục M3); `Project-2C-data` ra khỏi v1.0 (§4).

Owner đồng ý (11/10): thứ tự 6A–6E như §2, phân tích bloat / hiệu năng nằm trong lượt review 1; giữ 6 gói như §6.2; S-1 và gộp backup / xung đột ra khỏi v1.0 cùng `Project-2C-data` (§4), không thêm cảnh báo khi nhập backup (phương án a). Hệ quả đã biết: làm trên hai máy vẫn là "bản nhập sau thắng" — mỗi lúc làm trên một máy, xuất trước khi đổi máy.

Không còn câu hỏi mở; chờ Owner duyệt G1.

## 9. Tách Issue

Sau G1: Issue cho 6C (lệnh dữ liệu tải + số đo nền; kịch bản trọn vòng; danh sách nghiệm thu), 6D (bước 0 mỗi lượt; tổng hợp mỗi lượt). Issue tính năng 6B tách sau khi phần spec chi tiết của từng tính năng qua G2 / G3.
