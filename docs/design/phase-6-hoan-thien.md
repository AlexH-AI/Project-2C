# Spec Phase 6 — Hoàn thiện & phát hành v1.0 (G1)

- **Trạng thái:** bản nháp, chờ Owner duyệt **G1** (phạm vi, thứ tự, kế hoạch kiểm thử, kế hoạch review đóng phase). Chi tiết từng tính năng ở §4 (luật, mockup) viết và duyệt riêng (G2 / G3) trước khi tách Issue của tính năng đó.
- **Soạn:** 11/10/2026, sau G7 Phase 5 (`main` `3d6c7fc`). Nguồn: `PROJECT-PLAN.md` §5 dòng Phase 6, ADR-0010 (đồng bộ), comment Owner trên #72 (Thùng rác), D-2 / S-1 / S-2 ở `docs/reviews/2026-09-30-phase-1-3-tong-hop.md`, yêu cầu Owner 11/10 (kiểm thử toàn diện; 2 lượt deep review Phase 1–6 bằng 4 agent; phân tích bloat code và hiệu năng).

## 1. Mục tiêu và tiêu chí xong

Phase 6 đưa app tới **v1.0**: dùng được hằng ngày trên hai máy, dữ liệu không mất, và là bản dùng để so sánh với Project-2 (`docs/COMPARISON.md`, `docs/metrics/FINAL.md`).

Tiêu chí phát hành v1.0 (G7 cuối):

1. Milestone Phase 6 đóng hết Issue.
2. Kiểm thử phát hành (§6) đạt: kịch bản trọn vòng e2e xanh, danh sách nghiệm thu của Owner đạt, đo hiệu năng trên dữ liệu tải đạt ngưỡng §5.2, exe chạy được trên hai máy và trên một máy Windows sạch, nâng từ exe Phase 5 không mất dữ liệu.
3. Hai lượt deep review Phase 1–6 (§7) xong; mọi phát hiện từ Medium trở lên đã sửa, phần còn lại Owner đã quyết (sửa / hoãn sau v1.0 / chấp nhận).
4. `pnpm verify`, `pnpm verify:rust`, `pnpm e2e` xanh trên SHA phát hành; eval AI thật đạt ngưỡng spec Phase 5 §11 sau đợt G5.
5. Hướng dẫn sử dụng tiếng Việt có trong repo và trong bản phát hành.

## 2. Thứ tự

| Bước | Nội dung | Cổng |
|---|---|---|
| **6A** | Việc còn lại từ review Phase 5 (§3), bắt đầu bằng đợt G5 #491 | G5 (#491) |
| **6B** | Tính năng còn lại (§4): Thùng rác, S-2, S-1, gộp backup / xung đột, đồng bộ `Project-2C-data`, hướng dẫn sử dụng | G2 / G3 từng tính năng; G4 / G6 nếu cần (§4.4) |
| **6C** | Phân tích codebase: bloat code và hiệu năng (§5), Claude làm, sửa theo Issue | Owner chọn việc sửa |
| **6D** | Kiểm thử phát hành (§6) | — |
| **6E** | Deep review Phase 1–6, **2 lượt × 4 agent** (§7), sửa sau mỗi lượt | Owner chọn việc sửa sau mỗi lượt |
| **6F** | G7: Owner nghiệm thu exe cuối, chỉ số Phase 6, phát hành v1.0 (§8) | **G7** |

6A và 6B có thể xen nhau (khác file). 6C đứng trước 6E để review nhìn code đã gọn; 6D chạy lại phần tự động sau mỗi đợt sửa của 6E.

## 3. 6A — việc còn lại từ Phase 5

Đã có trong milestone Phase 6: #491 T-197 (đợt G5: chặn nhầm, so khớp, ví dụ prompt, R2-04; `gate`), #488 T-198 (script eval), #492 T-199 (`packages/ai` chịu đầu vào / đầu ra bất thường), #493 T-200 (khoảng trống test), #494 T-201 (gộp nhãn / kiểu trường / Mock), #509 T-205 (trợ năng AI), #510 T-206 (phạm vi docs-only của `pnpm verify`). Sau #491: chạy lại eval AI thật (Owner chạy, gói Go).

## 4. 6B — tính năng còn lại

Mỗi mục dưới đây có phần spec chi tiết riêng (thêm vào file này, §4.x) qua G2 / G3 trước khi tách Issue.

1. **S-2 — tuần tự hóa thay DB / lưu / xuất / đồng bộ.** Một hàng đợi duy nhất cho mọi thao tác file (ghi muộn trong lúc chờ backup → thay DB #96; hai `replace` chồng nhau #192). Làm trước đồng bộ.
2. **Thùng rác (#72).** Màn khôi phục bản ghi xóa mềm, gộp với nhóm quản lý dữ liệu ở Cài đặt; chốt một lần quy tắc khôi phục chéo (D10, người / KH đã xóa) ở G2; mockup G3.
3. **S-1 — snapshot mỗi bảng một file** (D-2): mỗi bảng một file, một dòng một bản ghi, không có `exportedAt` trong file bảng; định danh snapshot, tombstone, chính sách xung đột. Là định dạng cho đồng bộ; `.p2cbackup` hiện tại vẫn nhập được.
4. **Gộp backup / phát hiện xung đột** giữa hai máy: so hai snapshot, liệt kê xung đột, người dùng chọn; luật gộp ở G2.
5. **Đồng bộ `Project-2C-data`** (ADR-0010): app dùng Git có sẵn trên máy, không lưu token GitHub trong app. Owner cần tạo repo private `Project-2C-data` trước (hiện chưa có). Kiểm lại ở G6 (đẩy dữ liệu ra GitHub) và G4 (nếu cần thêm crate / công cụ).
6. **Hướng dẫn sử dụng tiếng Việt** (`docs/user-guide/`), theo từng màn, có ảnh chụp từ bản build; kèm vào bản phát hành.

Không thêm tính năng ngoài danh sách này trong Phase 6 (việc mới ghi sang sau v1.0).

## 5. 6C — phân tích codebase: bloat code và hiệu năng

Claude làm trong phiên chính (không subagent), xuất một báo cáo `docs/reviews/<ngày>-phan-tich-bloat-hieu-nang.md` gồm số đo nền, danh sách phát hiện có bằng chứng, đề xuất sửa; Owner chọn việc sửa, mỗi việc một Issue theo quy trình thường. Sửa bloat là refactor giữ nguyên hành vi: test cũ xanh trước và sau, không đổi golden.

### 5.1 Bloat code

- Export, file, hàm, khóa i18n, design token không ai dùng; dependency không dùng hoặc trùng chức năng.
- Logic lặp giữa các gói / màn (nhãn, kiểu trường, định dạng, kiểm dữ liệu ở lệnh và ở nhập backup), abstraction chỉ có một chỗ dùng.
- File quá lớn (đề xuất mốc: file sản phẩm > 400 dòng phải có lý do), test lặp hoặc không bắt được lỗi thật.
- Kích thước bundle web và exe theo từng phần (gói JS, crate Rust).
- Công cụ: ưu tiên thứ đã có (`dependency-cruiser`, `codemap`, TypeScript compiler API qua script `node` trong `tools/`). Công cụ mới (vd. `knip`, `cargo-bloat`) là **G4**, chỉ đề xuất khi script tự viết không đủ.

### 5.2 Hiệu năng

- **Dữ liệu tải trong repo:** bộ dữ liệu tải của deep review Phase 1–4 (1 496 KH, 10 434 lịch hẹn) chỉ nằm ngoài repo trên Office Laptop. Thêm một lệnh sinh dữ liệu tải tất định trong repo (cùng cỡ, thêm `ai_analyses` và dữ liệu Phase 6) để hai máy và các reviewer đo cùng một bộ.
- **Đo:** mở app (lần đầu / mở lại), màn đầu sau tải lại, đổi kỳ / sắp cột / chọn dòng ở Lịch hẹn, Khách hàng, Tổng quan, Báo cáo, xuất Excel, panel AI và lịch sử phân tích, nhập / xuất backup, lưu DB, đồng bộ; bộ nhớ webview; kích thước bundle và exe.
- **Ngưỡng:** giữ ngưỡng Nhóm C của deep review Phase 1–4 (thao tác màn < 200 ms trên dữ liệu tải; xem `docs/metrics/phase-4.md` mục "Đo đầu-cuối"), thêm ngưỡng cho màn Phase 5 / 6 khi đo nền xong. Không có màn nào xấu hơn số đo Phase 4.

## 6. 6D — kiểm thử phát hành

1. **Kịch bản trọn vòng tự động (e2e):** một chuỗi trên bản build web đi hết vòng nghiệp vụ — tạo team / RE → khách hàng → ghi chú KYC + xác nhận dữ kiện → lịch hẹn → kết quả cuộc gặp → hợp đồng → Tổng quan / Báo cáo khớp số → AI (Mock) → xóa mềm + khôi phục ở Thùng rác → xuất backup → nạp lại → nhập backup → số liệu như trước. Chạy trong CI như e2e hiện có.
2. **Danh sách nghiệm thu cho Owner** `docs/testing/nghiem-thu-v1.md`: theo từng màn và từng dòng mockup, mỗi dòng có thao tác + kết quả mong đợi + ô Đạt / Lỗi; dùng ở 6D (lượt thử) và ở G7 (lượt cuối trên exe phát hành).
3. **Exe trên máy thật:** hai máy của Owner và một máy Windows sạch (vd. Windows Sandbox, Owner chạy): lần chạy đầu, thư mục dữ liệu, không cần quyền admin; **nâng từ exe Phase 5** (`3d6c7fc`) giữ nguyên dữ liệu; backup máy này → nhập máy kia; đồng bộ hai chiều qua `Project-2C-data` có xung đột.
4. **Độ bền dữ liệu:** tắt app giữa lúc lưu / thay DB / đồng bộ (S-2), file DB hỏng, ổ đầy hoặc không ghi được — app báo lỗi rõ, không mất bản đã lưu.
5. **Hiệu năng** trên dữ liệu tải theo §5.2, đo trên exe release.
6. **Eval AI thật** sau đợt G5 (§3).

Lỗi tìm ra ở 6D thành Issue thường; lỗi chặn phát hành gắn `risk:high`.

## 7. 6E — deep review Phase 1–6: 2 lượt × 4 agent

### 7.1 Vai trò

| Bên | Ai chạy | Việc |
|---|---|---|
| Claude (phiên sạch mỗi gói, tuần tự, không subagent) | Owner mở phiên | Reviewer, chỉ đọc, worktree review riêng |
| Codex | Owner | Reviewer độc lập, chỉ đọc (ADR-0001 M2) |
| DeepSeek v4.1 Flash (OpenCode) | Owner | Reviewer độc lập, chỉ đọc |
| Muse Spark (Muse Code) | Owner | Reviewer độc lập, chỉ đọc |
| **Claude (phiên tổng hợp)** | sau khi đủ báo cáo | **Vai chính:** đọc mọi báo cáo, kiểm lại từng phát hiện trên code (đúng / đã biết / sai), gộp trùng, chốt mức, đề xuất hướng giải quyết cho từng vấn đề (kèm phương án khi có nhiều cách), xếp việc sửa thành phương án cho Owner chọn |

Báo cáo của Codex / DeepSeek / Muse là **dữ liệu tham khảo**; kết luận "sẵn sàng phát hành" chỉ lấy từ phiên tổng hợp sau khi đã kiểm trên code (bài học Phase 5: DeepSeek / Muse kết luận SẴN SÀNG khi còn 2 lỗi Medium — `docs/reviews/2026-10-10-danh-gia-deepseek-muse.md` §7).

### 7.2 Cách làm (theo khuôn deep review Phase 1–4 và Phase 5)

- **Kế hoạch chi tiết** `docs/process/deep-review-phase-1-6.md` soạn ở bước 0 của lượt 1 (SHA ghim, prompt từng bên, KNOWN, baseline, dữ liệu tải §5.2), Owner duyệt trước khi chạy.
- **Chia gói (đề xuất, ≈ 10 gói):** A domain · B db (schema, migration, repository, backup) · C Rust (`storage.rs`, `ai.rs`, đồng bộ) · D ui / shell / data / i18n · E Khách hàng + KYC + Lịch hẹn + Hợp đồng · F Tổng quan / Báo cáo / Team / Cài đặt · G AI (`packages/ai`, panel, ChatGPT web, trích xuất) · H tính năng Phase 6 (Thùng rác, S-1, S-2, gộp, đồng bộ) · I tools / CI / e2e · J xuyên gói.
- **Trục:** các trục của deep review trước (đúng-sai / edge case, toàn vẹn dữ liệu, bảo mật ở ranh giới, test yếu, trợ năng / i18n, khớp spec / mockup / nhãn) **và hai trục bắt buộc ghi riêng: bloat code, hiệu năng** (đo trên dữ liệu tải).
- **Độc lập:** cùng SHA, mỗi bên một thư mục, cấm đọc báo cáo của nhau cho tới phiên tổng hợp; kiểm bằng log phiên như Phase 5.
- **Muse:** cấu hình sandbox trước (thư mục kết quả ghi được, repo chỉ đọc, không chế độ không hỏi) để tránh hàng chục lần Owner duyệt tay.
- **Lượt 1** trên SHA sau 6D → tổng hợp → Owner chọn → sửa (Issue thường, review phiên sạch).
- **Lượt 2** trên SHA sau đợt sửa lượt 1: review lại toàn bộ, ghi trạng thái từng vấn đề lượt 1 (đã sửa / một phần / hồi quy) và phát hiện mới → tổng hợp → Owner chọn → sửa.
- Báo cáo gốc lưu nguyên văn ở `docs/reviews/raw/<ngày>/{claude,codex,deepseek,muse}/` qua PR docs; tổng hợp ở `docs/reviews/`.

### 7.3 Ước lượng

Phase 5 (6 gói): mỗi bên ≈ 2–3 giờ đồng hồ; Muse cần 45 lần duyệt tay khi chưa cấu hình sandbox; DeepSeek ≈ 1 USD trừ vào hạn mức gói Go. Phase 1–6 với ≈ 10 gói: ước ≈ 4–5 giờ mỗi bên mỗi lượt, ≈ 40 báo cáo mỗi lượt, 80 báo cáo cho hai lượt; phiên tổng hợp mỗi lượt có thể cần chia hai phiên theo nhóm gói.

### 7.4 Thay đổi quy tắc cần duyệt cùng G1 này

- Hiện `CLAUDE.md` và ADR-0001 M2 chỉ cho Codex review đóng phase; DeepSeek / Muse ở Phase 5 là ngoại lệ một lần. Đề xuất **ADR-0001 phụ lục M3**: ở review đóng Phase 6, DeepSeek và Muse tham gia như Codex — chỉ đọc, không viết code, báo cáo là dữ liệu tham khảo, không thay review phiên sạch; sửa dòng tương ứng ở `CLAUDE.md`. Không mở Agent tool, không cho agent ngoài viết code (phương án A của đánh giá 10/10).
- `docs/COMPARISON.md` dòng 2C ghi "Không dùng OpenCode, Muse Code, Cursor, Codex để viết/review code" — đã lệch từ khi có Codex M2 (30/09). File phải giống hệt ở hai repo nên 2C không tự sửa; đề xuất Owner chọn: (a) ghi vào Nhật ký thay đổi của cả hai repo "2C dùng reviewer ngoài chỉ đọc khi đóng phase", hoặc (b) giữ nguyên và ghi là biến nhiễu trong `FINAL.md`.

## 8. 6F — G7 và phát hành v1.0

- Owner nghiệm thu exe cuối theo `docs/testing/nghiem-thu-v1.md`, điền số Owner vào `docs/metrics/phase-6.md`.
- **GitHub Release v1.0** (repo public): exe + hướng dẫn sử dụng; đăng Release là thao tác công khai nên chỉ làm khi Owner bảo ở G7.
- `docs/metrics/FINAL.md` làm sau khi **cả hai repo** đạt v1.0 (COMPARISON.md), không thuộc Phase 6 của 2C.

## 9. Câu hỏi cho Owner (G1)

1. Thứ tự 6A–6F như §2? Riêng #491 (G5) làm ngay hay sau khi duyệt spec này?
2. Chia ≈ 10 gói cho deep review như §7.2, hay gộp bớt để giảm thời gian?
3. Lượt 2 review lại **toàn bộ** Phase 1–6 (như trên), hay chỉ phần đã sửa + vùng rủi ro?
4. ADR-0001 M3 như §7.4? COMPARISON.md chọn (a) hay (b)?
5. Đồng bộ `Project-2C-data`: Owner tạo repo private khi nào; có giữ trong v1.0 không (là phần lớn và rủi ro nhất của 6B)?

## 10. Tách Issue

Sau G1: Issue cho 6C (lệnh dữ liệu tải; báo cáo phân tích), 6D (kịch bản trọn vòng; danh sách nghiệm thu), 6E (bước 0 mỗi lượt; tổng hợp mỗi lượt). Issue tính năng 6B tách sau khi phần spec chi tiết của từng tính năng qua G2 / G3.
