# So sánh review Claude ↔ Astra (Codex) — Project-2C `0fa0eea`

- Ngày: 2026-09-30 · Người đối chiếu: Claude Code
- Nguồn:
  - Claude: `C:\workspace\review-reports\2026-09-30-claude-phase-1-3-review.md`
  - Astra: `C:\workspace\astra-reports\2026-09-30-project-2c-phase-1-3-review.md`
- Mọi điểm khác nhau đều được kiểm lại trên `0fa0eea` (worktree `Project-2C-review`, `git status` vẫn sạch) hoặc trên GitHub (chỉ đọc). Script đo mới: `tmp\import-size.repro.ts`.

## 1. Tóm tắt

| | Claude | Astra |
|---|---|---|
| Verdict | SẴN SÀNG CÓ ĐIỀU KIỆN | CHƯA SẴN SÀNG |
| Điều kiện / blocker | Sửa A-001 (nhập backup) + A-002 (`generation`), kiểm tay exe | Sửa A-001 (nhập backup), kiểm tay exe build cuối, hoàn tất #72 |
| Cách làm | Chạy `verify` / `e2e` / `verify:rust` + 3 script tái hiện | Chỉ đọc tĩnh, số liệu test lấy từ log CI |
| Số phát hiện | 15 (1 High, 5 Medium, 7 Low, 2 Nit) | 7 (1 High, 2 Medium, 4 Low) |
| Mẫu | 15 PR, 12 Issue | 17 PR, 14 Issue |

**Hai verdict thực chất giống nhau:** chưa đóng G7 cho tới khi xong phần kiểm toàn vẹn khi nhập backup và kiểm tay exe. Khác nhau chỉ ở cách gọi tên.

## 2. Điểm trùng (cả hai cùng thấy)

| # | Vấn đề | Claude | Astra | Kiểm lại / kết luận chung |
|---|---|---|---|---|
| C1 | Nhập backup bỏ qua bất biến nghiệp vụ | A-001 High, **đã tái hiện** (ngày hỏng, JSON hỏng, stage lệch, `re_id` là TL) | A-001 High, xác nhận tĩnh (JSON hỏng, stage lệch, `note_id` của KH khác) | **Đồng ý High.** Gộp danh sách kiểm của hai bên (§5) |
| C2 | `rfCount` O(A×T) | A-004 Medium ĐÃ BIẾT, đo được 119 ms/lần, 30 scope ≈ 1 s | B-001 Medium ĐÃ BIẾT, chưa đo | **Đồng ý Medium**, làm đầu Phase 4. Số đo của Claude bổ sung bằng chứng |
| C3 | Tài liệu trạng thái lệch | B-005 Low | B-004 Low | Đồng ý; hợp danh sách ở §4 |
| C4 | Coverage | B-003: không đo lớp app (`apps/desktop/src/data`) | B-003: ngưỡng 95% áp **gộp**, không ép riêng domain ≥ 95 / db ≥ 90 | **Hai góc khác nhau, cả hai đúng** (`vitest.config.ts:6-15`: `thresholds` toàn cục, `include` chỉ domain + db). Gộp thành một task |
| C5 | Actions ghim tag, không SHA | B-004 Low | Chỉ là góp ý §9.7 | Đồng ý Low |
| C6 | Chưa kiểm tay exe build cuối | Điều kiện G7 | Điều kiện G7 + danh sách ca native smoke | Dùng danh sách của Astra (§6.3 báo cáo Astra) |

## 3. Điểm khác nhau và kết quả kiểm lại

### 3.1 Chỉ Claude nêu

| ID Claude | Nội dung | Astra | Kiểm lại | Kết luận cuối |
|---|---|---|---|---|
| A-002 | Mở DB mới lỗi → DB cũ ngừng lưu mà không báo | Coi là ĐÃ BIẾT, "chưa chứng minh đường UI" (§4.1) | **Astra đúng về nguồn gốc:** R2 #101 đã có NIT 4, "`open()` tăng `generation` trước khi `openDatabase` resolve… im lặng không lưu nữa". HANDOFF không ghi lại nên Claude đánh nhầm là MỚI. **Claude đúng về mức độ:** R2 chỉ xét đường nạp lại; T-052 thêm đường nhập backup, và test chấp nhận #187 ("mở DB mới lỗi") chỉ chạy ở web mode. Script tái hiện ở exe mode cho thấy mất thay đổi không cảnh báo, đóng app không hỏi | **Medium · ĐÃ BIẾT (R2 #101 NIT 4), bị đánh giá thấp.** Sửa cùng đợt nhập backup |
| B-001 | Không có ErrorBoundary → lỗi render là cửa sổ trắng | Nhắc bên trong A-001, không tách riêng | grep rỗng trên `apps/desktop/src` | **Medium, giữ.** Là lưới an toàn cho A-001 và mọi màn Phase 4 |
| A-003 | `pnpm e2e` local đỏ 3/90 (timeout 30 s, 10 worker) | Không chạy local; CI 90/90 xanh (5,6 phút) | Chạy lại `--workers=1`: pass hết. CI có `retries: 1` và ít core | **Medium, giữ.** Không làm hỏng sản phẩm, nhưng làm cổng e2e local mất tin cậy. Task nhỏ |
| B-002 | `.p2cbackup` 1 dòng / 10,5 MB, chưa làm được snapshot Phase 6 | Có ý tương tự ở §8 (nợ Phase 6), không tính là phát hiện | — | Đồng ý là **nợ Phase 6**, không chặn G7 |
| A-005 | Lệnh DB không chặn ngày tương lai (sửa nhóm tay, HĐ) | Không | Đọc lại `customers.ts:158-234`, `policies.ts:101-115`: không có kiểm `db.now()` | **Low, giữ** (UI đang chặn) |
| A-006 | Xóa ngày sinh / chọn "Chưa rõ" → lỗi chung `error.unknown` | Không | `vi.ts` không có `error.KYC_PROFILE_FIELD_REQUIRED` | **Low, giữ** |
| A-007 | `·` / `→` viết cứng ở khoảng 15 chỗ | Nhắc là ĐÃ BIẾT (§4.4) | — | Low ĐÃ BIẾT một phần |
| A-008 | 5/15 PR vượt ~400 dòng (đều tự khai) | Nằm trong §5 (14/17 trong ngưỡng) | Hai cách đếm khác nhau, cùng kết luận | Quy ước quy trình, không cần Issue |
| B-006, A-009 | Nit: formatter chart, `getPolicy`, `t()` | Không | — | Nit, gom vào dọn dẹp |

### 3.2 Chỉ Astra nêu

| ID Astra | Nội dung | Kiểm lại | Kết luận cuối |
|---|---|---|---|
| A-002 | Nhập backup không giới hạn dung lượng / số dòng / độ dài chuỗi | **Xác nhận và đo được** (Node, `tmp\import-size.repro.ts`): file 10 MB → 764 ms, RSS +76 MB; 60 MB → 1,8 s, +436 MB; **210 MB → 5,0 s, +732 MB**; 300 000 ghi chú → đọc 4,5 s rồi mới bị từ chối. `SettingsBackup.tsx:63-67` gọi `file.text()` mà không kiểm `file.size`. Không mất dữ liệu (DB hiện tại không bị đụng), chỉ đơ UI; file cỡ GB có thể làm treo renderer. Người dùng phải tự chọn nhầm file | **Low–Medium.** Claude xếp **Low** vì chỉ tự gây ra và không mất dữ liệu, nhưng sửa rất rẻ (cap `file.size` + độ dài text). **Gộp vào task nhập backup**, Owner chốt ngưỡng (gợi ý 100 MB, gấp khoảng 10 lần seed) |
| A-003 | Lưu kết quả khi chưa chọn trạng thái: không báo gì | `OutcomeDialog.tsx:55-57, 81` `if (status === null) return;`. Đã có trong HANDOFF ghi chú #169 | Low **ĐÃ BIẾT**. Claude không báo lại vì prompt yêu cầu không lặp ghi chú đã biết. Đưa vào Issue dọn dẹp UI |
| B-002 | Miền năm không nhất quán (không có `MAX_YEAR`; `shift` tháng / năm lùi về 1899) | `period.ts:40-49` chỉ có `MIN_YEAR`; `shift` month/year dựng ngày trực tiếp (`:222-227`). ĐÃ BIẾT (R1, R3, #146) | Low **ĐÃ BIẾT**, nên chốt (G2) trước bộ lọc / báo cáo Phase 4 |
| Quy trình | PASS không khớp head cuối, review phiên sửa code | **#87:** PASS lúc 21:47, commit cuối `6daf43f` lúc 21:49, merge lúc 22:01. Head đổi sau PASS; bảng §5 của Claude bỏ sót chi tiết này. **#78:** comment "CHANGES → đã sửa trong PR (14d7d0b)" 19 giây sau commit sửa, tức phiên review tự sửa code. Việc này trước ADR-0017 (27/09), nhưng trái nguyên tắc review chỉ đọc | **Đúng, Low (quy trình).** Thêm vào skill `review-pr`: PASS phải ghi SHA; head đổi → review lại phần diff mới; phiên review không commit |
| Tài liệu | Các điểm lệch Claude không thấy | Đã kiểm từng dòng: `PROJECT-PLAN.md:127` ghi "`pnpm verify` (lint · typecheck · unit · **e2e**)", thực tế `verify` không có e2e; PLAN §4.4 vẫn "adapter TauriSqlite"; PLAN §4.4 "Từ Phase 3: build exe lại chạy ở mọi PR code"; `HANDOFF.md:29` "`formatCount` nằm trong `money.ts`", nay đã ở `number.ts:7`. **`mockups/overview.html:217-219` "Tỉ lệ chốt · lũy kế … HĐ ÷ KH từng ở N2/N1"** là công thức cũ đã bị G2 thay. Mockup 10c "khôi phục bằng Nhập backup": chỉ mockup sai, câu trong app (`vi.ts:527-528`) đúng | **Tất cả đúng.** Riêng mockup overview là **rủi ro thật cho Phase 4**: dashboard dựng theo mockup sẽ dùng sai công thức. Phải sửa mockup (hoặc gắn cảnh báo) trước khi làm màn Tổng quan |
| Ledger ĐÃ BIẾT | HANDOFF lẫn ghi chú đã sửa với ghi chú còn mở | Đúng (vd. `": "`, `isUnsavedChangesError`, `formatCount` đã xử lý nhưng vẫn nằm trong danh sách) | Chia ledger thành OPEN / RESOLVED / ACCEPTED khi đóng phase |

### 3.3 Khác nhau về phương pháp và số liệu (không mâu thuẫn)

- **Test:** hai bên cùng số liệu (696 unit, 36 Rust, coverage 99,45 / 98,56 / 100 / 99,76). Khác ở e2e: CI xanh 90/90 (Astra đọc log) và local đỏ 3/90 (Claude chạy thật). Cả hai đều đúng, xem A-003 của Claude.
- **Mức độ bằng chứng:** Claude tái hiện A-001 bằng lệnh chạy thật; Astra xác nhận tĩnh. Nên dùng bộ tái hiện của Claude làm test đỏ cho task sửa.
- **Mẫu PR:** hợp lại được 25 PR khác nhau. Astra phủ thêm #74, #78, #83, #102, #190, #192, #196; Claude phủ thêm #139, #144, #155, #171, #179.

## 4. Danh sách phát hiện hợp nhất (sau kiểm lại)

| Mức | Phát hiện | Trạng thái | Nguồn |
|---|---|---|---|
| High | Nhập backup không kiểm toàn vẹn nghiệp vụ | MỚI | Cả hai |
| Medium | Mở DB lỗi khi thay → DB cũ ngừng lưu mà không báo | ĐÃ BIẾT (R2 NIT), bị đánh giá thấp | Claude (Astra ghi là đã biết) |
| Medium | Không có ErrorBoundary | MỚI | Claude |
| Medium | `rfCount` O(A×T) | ĐÃ BIẾT | Cả hai |
| Medium | e2e local chập chờn | ĐÃ BIẾT một phần | Claude |
| Medium (Phase 6) | Định dạng snapshot | MỚI (nợ) | Claude; Astra ở mục nợ |
| Low | Nhập backup không giới hạn dung lượng | MỚI | Astra (Claude đo) |
| Low | Coverage: ngưỡng gộp + không đo lớp app | MỚI | Cả hai (hai góc) |
| Low | Tài liệu / mockup lệch (gồm mockup tỉ lệ chốt cũ) | ĐÃ BIẾT một phần | Cả hai, Astra đầy đủ hơn |
| Low | Lệnh DB không chặn ngày tương lai | MỚI | Claude |
| Low | Thiếu câu `error.KYC_PROFILE_FIELD_REQUIRED` | MỚI | Claude |
| Low | PASS không khớp head cuối, review tự sửa code (#87, #78) | MỚI | Astra |
| Low | Actions chưa ghim SHA | MỚI | Cả hai |
| Low | Lưu kết quả khi chưa chọn trạng thái | ĐÃ BIẾT (#169) | Astra |
| Low | Miền năm / `shift` | ĐÃ BIẾT (R1/R3) | Astra |
| Low | `·` / `→` cứng trong JSX | ĐÃ BIẾT một phần | Claude |

## 5. Cách xử lý đề xuất (hiệu quả nhất)

Nguyên tắc: gom theo **file / vùng code** để mỗi PR chỉ chạm một vùng; chỉ đặt vào trước G7 những gì bảo vệ dữ liệu. Mọi thứ khác chuyển sang đầu Phase 4 hoặc Phase 6.

### Đợt 1 — trước G7 (3 Issue code + #72)

1. **T-a · Nhập backup: kiểm giá trị + giới hạn dung lượng** (`risk:high`, ~200 dòng sản phẩm / ~500 tổng).
   - File: `packages/db/src/{backup,backup-validation (mới),errors}.ts` + test, `apps/desktop/src/routes/SettingsBackup.tsx`, `apps/desktop/src/data/app-data.ts` (`readBackup`), `vi.ts`, `e2e/backup.spec.ts`.
   - Nội dung:
     - kiểm định dạng ngày (`YYYY-MM-DD`, ngày tồn tại), `time` (`HH:MM`), `value_json` là JSON đúng kiểu trường, `seq` > 0;
     - cap `file.size` trước `file.text()`, cộng cap độ dài text ở `importBackup`, ngưỡng do Owner chốt;
     - `RangeError` / `SyntaxError` trong bước đọc → `BACKUP_INVALID` (hộp 10b).
   - Test đỏ trước: 4 ca của `tmp\backup-invariants.repro.ts` + ca vượt dung lượng.
2. **T-b · Nhập backup: kiểm bất biến liên bảng** (`risk:high`, ~250 / ~650).
   - File: `backup-validation.ts` + test.
   - Kiểm:
     - mỗi KH có transition đầu (`from` null) và `stage` = `to` của transition mới nhất chưa xóa;
     - ngày không giảm theo `seq`; `from` của mỗi transition = `to` của transition trước;
     - transition có `appointment_id` → cuộc hẹn cùng KH, MET, đúng `stage_after`;
     - `re_id` (KH / cuộc hẹn / HĐ) là người vai trò RE; người phối hợp ≠ RE;
     - fact trỏ note cùng KH; `birthYear` / `gender` active chỉ từ note `SYSTEM`; mỗi trường có 1 active hoặc ≥ 2 conflict.
   - **Đọc thuần, không phát lại lệnh nghiệp vụ** (đồng ý với Astra: phát lại sẽ đổi `seq` / hash / id).
   - Bản ghi xóa mềm hợp lệ vẫn phải round-trip giống từng byte.
3. **T-c · Thay DB không tắt lưu + ErrorBoundary** (`risk:high`, ~80 / ~250).
   - File: `app-data.ts` (tăng `generation` chỉ sau khi mở thành công), `app-data.test.ts` (ca exe mode theo `tmp\replace-open-fails.repro.ts`), `shell/ErrorBoundary.tsx` (mới) quanh nội dung màn, `CloseGuard` đặt ngoài boundary, `vi.ts`.
4. **#72 T-053 (đã có):**
   - (a) sửa tài liệu theo danh sách hợp nhất: `PROJECT-STATE`, PLAN §4.4 / §5 / dòng 127, spec §5 / §8, `metrics/phase-1.md`, ghi chú ADR-0015, **mockup overview tỉ lệ chốt** (sửa hoặc gắn cảnh báo "công thức cũ, xem ADR-0007"), mockup 10c;
   - (b) HANDOFF ledger OPEN / RESOLVED / ACCEPTED;
   - (c) `metrics/phase-3.md`;
   - (d) Owner kiểm tay exe build **sau** T-a / T-b / T-c theo danh sách native smoke của Astra: mở lại giữ dữ liệu, exe thứ hai, lưu lỗi → thử lại / đóng, xuất trùng tên, nhập / nạp lại, Explorer với đường dẫn có dấu phẩy / khoảng trắng; ghi SHA vào #72.

T-a và T-b có thể xếp chồng; T-c độc lập nên làm song song được. Nếu cần rút gọn, T-a + T-c là tối thiểu để không còn đường mất dữ liệu hay cửa sổ trắng. T-b có thể để Owner chấp nhận rủi ro có ghi nhận, nhưng **không nên**, vì Phase 5 (KYC → AI) và Phase 6 đều cần dữ liệu nhập vào đáng tin.

### Đợt 2 — đầu Phase 4 (trước màn dashboard)

5. **Hiệu năng chỉ số + MTD:** `rfCount` / `inScope` dùng index (C2), cộng hàm MTD. Golden không đổi, test thời gian trên seed.
6. **Chốt G2 cho Phase 4:**
   - định nghĩa "lịch dự kiến / đã gặp" + chuỗi dời lịch, kể cả ca xóa lịch con của chuỗi dời;
   - miền năm (`MAX_YEAR`, `shift` ở biên);
   - sửa mockup overview theo ADR-0007.
7. **e2e local ổn định** (A-003 Claude): giới hạn worker local hoặc giảm số lần seed. Làm trước khi task Phase 4 thêm e2e.
8. **Chất lượng CI:** coverage ép riêng domain / db + thêm lớp `apps/desktop/src/data`; ghim Actions theo SHA.
9. **Dọn dẹp UI / i18n** (`risk:low`): `error.KYC_PROFILE_FIELD_REQUIRED`, lỗi "chọn trạng thái" ở OutcomeDialog, `·` / `→` qua i18n, chặn ngày tương lai ở lệnh DB (sửa nhóm tay, HĐ), cộng các ghi chú OPEN liên quan trong ledger.

### Đợt 3 — để sau

10. **Phase 5:** quyết G4 / G6 cho cách gọi OpenCode Go và lưu key trước khi viết `packages/ai`.
11. **Phase 6:** định dạng snapshot mỗi bảng một file, dùng lại validator của T-a / T-b; định danh snapshot, tombstone, chính sách xung đột (Astra §8).

### Thay đổi quy trình (không cần code)

- Skill `review-pr`: kết luận PASS phải ghi **SHA head**; head đổi sau PASS → review lại phần diff mới trước khi merge (#87). Phiên review không commit (#78).
- Viết Issue: ước lượng cỡ gồm cả i18n + e2e; dự kiến vượt ~400 dòng sản phẩm → tách ngay từ đầu.
- Khi đóng phase: chuyển ghi chú review đã xử lý sang RESOLVED để lần review sau không đánh nhầm MỚI / ĐÃ BIẾT. Lần này Claude đánh nhầm một mục vì R2 NIT 4 không có trong tóm tắt HANDOFF.

## 6. Ghi chú về hai báo cáo gốc

- Báo cáo Claude **giữ nguyên** để đối chiếu. Sai lệch đã biết: A-002 phải là **ĐÃ BIẾT (R2 #101 NIT 4, bị đánh giá thấp)**, không phải MỚI; bảng §5 thiếu chi tiết head #87 đổi sau PASS.
- Báo cáo Astra: xếp A-002 (giới hạn dung lượng) Medium là hơi cao, vì không mất dữ liệu và chỉ do người dùng tự chọn file (Claude đề xuất Low). §4.1 xếp đường `generation` là "chưa chứng minh", nhưng nay đã tái hiện được ở exe mode, nên cần nâng lên Medium.
