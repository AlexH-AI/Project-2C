# Báo cáo tổng hợp review Project-2C — Phase 3 (sâu) + Phase 1→3

- **Ngày:** 2026-09-30 · **SHA:** `0fa0eea40203a17c73ed9901c576963b9857f11d` (`main` sau T-074; code giống `724794a`)
- **Nguồn:** hai review độc lập, sau đó đối chiếu chéo và kiểm lại mọi điểm khác nhau:
  - Claude Code: `review-reports/2026-09-30-claude-phase-1-3-review.md`
  - Codex Astra: `astra-reports/2026-09-30-project-2c-phase-1-3-review.md`
  - Đối chiếu: `review-reports/2026-09-30-so-sanh-claude-astra.md`
- **Mục đích:** bản lưu cuối cùng. Mỗi phát hiện có một ID duy nhất (`F-xx`), mức độ đã hiệu chỉnh và **một task xử lý cụ thể**.

## 1. Kết luận

**Chưa đóng G7 Phase 3.** Đóng sau khi hoàn tất **Đợt 1** (§4): kiểm toàn vẹn khi nhập backup, sửa đường mất lưu im lặng khi thay DB, thêm ErrorBoundary, cập nhật tài liệu, và Owner kiểm tay exe build cuối.

- **Không có lỗi Critical.** Không có path traversal, SQL injection, RCE, hay mất dữ liệu vĩnh viễn đã chứng minh.
- **Lưu trữ lõi đúng ADR-0016:**
  - transaction / savepoint, persist chỉ sau `COMMIT`;
  - ghi `.tmp` → `sync_all` → `rename`;
  - `PersistQueue` gộp snapshot, `flush()` khi đóng;
  - lock file chặn exe thứ hai;
  - backup khởi động theo thứ tự ghi, bỏ bản trùng;
  - file xuất không ghi đè (claim).
- **Nghiệp vụ đúng khi đi qua lệnh:** D2 / D6 / D7 / D9 / D10; golden G01–G22 và K01–K15 chạy qua DB bằng lệnh nghiệp vụ; fixture golden không bị sửa trong Phase 3.
- **Rủi ro lớn nhất là dữ liệu không tin cậy đi vào** (nhập backup ở Phase 3, kéo snapshot ở Phase 6): nhiều bất biến chỉ nằm trong lệnh nghiệp vụ, còn đường nhập bỏ qua chúng.

| Mức | MỚI | ĐÃ BIẾT | Tổng |
|---|---|---|---|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 2 | 3 | 5 |
| Low | 6 | 6 | 12 |
| Nit | 2 | 0 | 2 |
| Quyết định / nợ (không tính lỗi) | — | — | 2 |

## 2. Kết quả chạy lệnh (Claude, máy Home PC, 20 luồng)

| Lệnh | Kết quả | Ghi chú |
|---|---|---|
| `pnpm install --frozen-lockfile` | ✅ | pnpm 12.6.0 |
| `pnpm verify` | ✅ 85 s | 45 file / 696 test; `lint:deps` 0 vi phạm; coverage 99,45 / 98,56 / 100 / 99,76; `db/src` 99,25 / 97,9 / 100 / 99,68; domain 100% |
| `pnpm e2e` | ❌ 87/90 | 3 test vượt 30 s khi 10 worker cùng seed; chạy `--workers=1` thì pass hết (F-05). CI (Astra đọc log run 36685673382): 90/90 xanh |
| `pnpm verify:rust` | ✅ 31 s | fmt, clippy `-D warnings`, 36/36 test |
| Script tái hiện | `review-reports/tmp/` | `backup-invariants.repro.ts` (F-01), `replace-open-fails.repro.ts` (F-02), `import-size.repro.ts` (F-04) |

Số đo hiệu năng trên seed (Node):
- seed 3,7 s; DB 9,3 MB; `db.export()` 1–2 ms;
- `exportBackup` 161 ms, file 10,5 MB **một dòng**; `importBackup` 0,78 s;
- `listAppointments` 48 ms; `rfCount` 119 ms/lần (30 scope ≈ 1 s).

## 3. Danh sách phát hiện hợp nhất

Cột "Nguồn": C = Claude, A = Astra. Cột "Task": xem §4.

### F-01 — Nhập backup bỏ qua bất biến nghiệp vụ — High · CONFIRMED (tái hiện) · MỚI · C+A · Task T-a, T-b
- **Vị trí:**
  - `packages/db/src/backup.ts:32-37` (zod chỉ kiểm envelope), `:126-151` (`load` chỉ CHECK / UNIQUE / FK), `:183-188`;
  - `apps/desktop/src/data/app-data.ts:251-264` (`readBackup` chỉ đếm 5 bảng);
  - `packages/db/src/common.ts:40-43`, `packages/db/src/kyc.ts:488` (`JSON.parse`).
- **Quy tắc:** spec §6; Issue #71 ("file hỏng → lỗi có mã, dữ liệu hiện tại không đổi"); spec §3–§4, §8; D2, D10.
- **Tái hiện:**
  - `appointments.date = 'hello'` hoặc `'2026-02-30'` → nhập thành công, `listAppointments` ném `RangeError`;
  - `kyc_facts.value_json = '{not json'` → nhập thành công, `getKycProfile` ném `SyntaxError`;
  - `customers.stage = 'N1'` khi transition cuối là N3, `re_id` = TL → nhập thành công, lệch mà không báo;
  - `note_id` trỏ ghi chú của KH khác → FK vẫn hợp lệ (Astra).
- **Hậu quả:** DB hỏng được lưu thành `project2c.db`; màn Khách hàng / Lịch hẹn / Hồ sơ ném lỗi khi render → cửa sổ trắng (F-03); chỉ số và KYC sai. Phase 6 kéo snapshot cũng đi đường này.
- **Hướng sửa:** validator **đọc thuần** trên DB staging sau `load` + `migrate`, trước preview và trước mọi lần thay DB. Không phát lại lệnh nghiệp vụ (sẽ đổi `seq` / hash / id). Chi tiết ở T-a (giá trị từng ô) và T-b (liên bảng).

### F-02 — Mở DB mới lỗi khi thay → DB cũ ngừng lưu mà không báo — Medium · CONFIRMED (tái hiện exe mode) · ĐÃ BIẾT, bị đánh giá thấp · C (A ghi là đã biết) · Task T-c
- **Vị trí:** `apps/desktop/src/data/app-data.ts:163-178` (`++generation` trước `await openDatabase`), `:212-225`.
- **Nguồn đã biết:** R2 #101 NIT 4 (lúc đó chỉ có đường nạp lại). T-052 thêm đường nhập; test chấp nhận #187 "mở DB mới lỗi" chỉ chạy ở web mode (`app-data.test.ts:435`).
- **Tái hiện:** nhập bytes hỏng → reject → sửa tiếp → không có lần `save` nào, `failed()` = false, `flush()` resolve → đóng app mất thay đổi mà không có hộp hỏi.
- **Hướng sửa:** chỉ đổi `generation` sau khi `openDatabase` resolve; test exe mode cho cả nhập lẫn nạp lại.

### F-03 — Không có React ErrorBoundary — Medium · CONFIRMED · MỚI · C · Task T-c
- **Vị trí:** `apps/desktop/src/main.tsx`, `App.tsx` (grep rỗng).
- **Hậu quả:** một lỗi render gỡ cả cây → cửa sổ trắng, `CloseGuard` bị gỡ theo (đóng app không flush).
- **Hướng sửa:** boundary quanh nội dung từng màn trong `AppShell` (sidebar còn dùng được), thông báo i18n + chi tiết kỹ thuật; `CloseGuard` đặt ngoài boundary.

### F-04 — Nhập backup không giới hạn dung lượng / số dòng / độ dài chuỗi — Low · CONFIRMED (đo) · MỚI · A (C đo) · Task T-a
- **Vị trí:** `apps/desktop/src/routes/SettingsBackup.tsx:63-67` (`file.text()` không kiểm `file.size`); `backup.ts:110-121`.
- **Đo (Node):** 10 MB → 0,76 s / +76 MB RSS; 60 MB → 1,8 s / +436 MB; 210 MB → 5,0 s / +732 MB; 300 000 ghi chú → đọc hết 4,5 s rồi mới bị từ chối.
- **Mức:** Astra xếp Medium, Claude xếp Low (không mất dữ liệu, người dùng tự chọn file). Sửa rẻ, nên gộp.
- **Hướng sửa:** cap `file.size` trước khi đọc + cap độ dài text trong `importBackup` (không chỉ ở UI); lỗi có mã + i18n. **Owner chốt ngưỡng** (gợi ý 100 MB ≈ 10× seed).

### F-05 — `pnpm e2e` local chập chờn: 3/90 vượt 30 s — Medium · CONFIRMED · ĐÃ BIẾT một phần (#155, R4) · C · Task T-d
- **Vị trí:** `playwright.config.ts` (workers mặc định, timeout 30 s); `e2e/chart.spec.ts:35`, `e2e/demo-data.spec.ts:6`, `e2e/navigation.spec.ts:56`.
- **Hướng sửa:** giới hạn worker local (vd. 4), hoặc `test.slow()`, hoặc giảm số lần seed (điều hướng hash thay vì `goto`). Chấp nhận khi xanh 3 lần liên tiếp trên máy 20 luồng.

### F-06 — `rfCount` / `inScope` O(A×T) — Medium · CONFIRMED (đo) · ĐÃ BIẾT (R3 #103) · C+A · Task T-e
- **Vị trí:** `packages/domain/src/stats.ts:26-35`, `:62-88`. 119 ms/lần; dashboard 12 tháng × 30 RE sẽ mất nhiều giây.
- **Hướng sửa:** index `Map` / `Set` theo `appointmentId` và `people.id`, dựng một lần cho mỗi snapshot / revision; golden không đổi; benchmark trước / sau.

### F-07 — Hàm MTD chưa có trong `domain` — Medium (Phase 4) · ĐÃ BIẾT (R3) · C+A · Task T-e
- Golden G18 phải tự dựng `customPeriod`. Thêm hàm chuẩn trước dashboard.

### F-08 — Coverage: ngưỡng áp gộp, không ép riêng; lớp app không được đo — Low · CONFIRMED · MỚI · C+A · Task T-g
- **Vị trí:** `vitest.config.ts:6-15`.
- **Hướng sửa:** ép domain ≥ 95 và db ≥ 90 riêng (theo glob hoặc đọc summary); thêm `apps/desktop/src/data/**/*.ts`, `apps/desktop/src/shell/*.ts` với ngưỡng riêng.

### F-09 — GitHub Actions ghim tag, không ghim SHA (repo public) — Low · CONFIRMED · MỚI · C (A góp ý) · Task T-g
- **Vị trí:** `.github/workflows/ci.yml` (`checkout@v7`, `pnpm/action-setup@v6`, `setup-node@v7`, `Swatinem/rust-cache@v2`, `upload-artifact@v7`).
- **Hướng sửa:** ghim SHA 40 ký tự + comment tag; cập nhật mỗi phase (Dependabot là công cụ mới → G4).

### F-10 — Tài liệu và mockup lệch thực tế — Low · CONFIRMED · ĐÃ BIẾT một phần · C+A · Task #72 (+ G2 Phase 4 cho mockup)

| Chỗ | Lệch | Thực tế |
|---|---|---|
| `PROJECT-STATE.md:5,9,45` | Phase 1 còn mở, repo private, "issues #59–#72" | Phase 1 đóng 28/09, repo public 27/09, Phase 3 có khoảng 45 Issue |
| `PROJECT-PLAN.md:127` | "`pnpm verify` (… e2e)" | `verify` không gồm e2e |
| PLAN §4.4 | "adapter TauriSqlite"; "Từ Phase 3 build exe mọi PR" | ADR-0016 sql.js mọi nơi; ADR-0015 phụ lục: build theo nhãn |
| PLAN §5 | tiến độ ngày 26/09, "≤ ~400 dòng diff" | Phase 1, 2 đóng; Phase 3 chỉ còn #72; ngưỡng P1 |
| `docs/metrics/phase-1.md:22` | #17 "Chưa làm" | PR #128 đã merge |
| spec §5.1 | tên backup `project2c-YYYYMMDD-HHMMSS.db` | `project2c-s<seq8>-<stamp>.db` (T-056) |
| spec §8 | lớp Rust kiểm tay, build mọi PR | `cargo fmt` / `clippy` / `test` trong job `build-exe` theo nhãn |
| ADR-0015 §"Bắt buộc mở lại build exe" | danh sách cũ | đã bị phụ lục 27/09 thay → ghi chú "đã thay" |
| `HANDOFF.md:29` và các ghi chú khác | `formatCount` trong `money.ts`, `": "` cứng… | đã xử lý (`number.ts`, #185) → chuyển RESOLVED |
| **`mockups/overview.html:217-219`** | "Tỉ lệ chốt · lũy kế … HĐ ÷ KH từng ở N2/N1" | **công thức cũ đã bị G2 thay** (ADR-0007: HĐ phát hành ÷ RF cùng kỳ). Rủi ro trực tiếp cho dashboard Phase 4 |
| `mockups/settings-data.html:201` (10c) | "khôi phục bằng Nhập backup" | Nhập backup chỉ nhận `.p2cbackup`; app ghi đúng "chép bản backup thành `project2c.db`" (`vi.ts:527-528`) |
| `TeamAppointmentsChart.tsx:11` | "Placeholder … (Phase 3)" | nối DB ở Phase 4 |
| ADR-0003 `/resume`, branch protection | — | ĐÃ BIẾT, Owner để nguyên |

### F-11 — Lệnh DB không chặn ngày tương lai (sửa nhóm tay, HĐ) — Low · CONFIRMED · MỚI · C · Task T-h
- **Vị trí:** `packages/db/src/customers.ts:158-234`, `policies.ts:101-115`. UI đang chặn; bất biến "`stageOn(hôm nay)` = `customers.stage`" chỉ đúng nhờ UI.
- **Hướng sửa:** helper `today(db)` (ghi chú #166), mã lỗi riêng, test.

### F-12 — Xóa ngày sinh / chọn "Chưa rõ" giới tính → lỗi chung — Low · CONFIRMED · MỚI · C · Task T-h
- **Vị trí:** `CustomerDialogs.tsx:153, 186-203`; `kyc.ts:258-269`; `i18n/index.ts:16-22`; `vi.ts` thiếu `error.KYC_PROFILE_FIELD_REQUIRED`.
- **Hướng sửa:** câu i18n riêng hoặc khóa tùy chọn trống; test: mọi `DbErrorCode` mà UI chạm được đều có câu.

### F-13 — Lưu kết quả khi chưa chọn trạng thái: không báo gì — Low · CONFIRMED · ĐÃ BIẾT (#169) · A · Task T-h
- **Vị trí:** `OutcomeDialog.tsx:55-57, 81`. Hiện lỗi "Chọn trạng thái" qua i18n; e2e cho cả click lẫn Enter.

### F-14 — Miền năm không nhất quán (`MAX_YEAR`, `shift` month/year về 1899) — Low · CONFIRMED · ĐÃ BIẾT (R1, R3, #146) · A · G2 Phase 4 → Task T-f
- **Vị trí:** `packages/domain/src/period.ts:40-49, 215-236`; `packages/db/src/common.ts:30-38`.
- **Hướng sửa:** Owner chốt miền năm; `PeriodPicker` disable nút ở biên; test biên + round-trip.

### F-15 — `·` / `→` viết cứng trong JSX (~15 chỗ) — Low · CONFIRMED · ĐÃ BIẾT một phần (#141, #192) · C · Task T-h
- **Vị trí:** `AppointmentDialog.tsx:425,428,432`; `AppointmentsScreen.tsx:508,512,526`; `EditOutcomeDialog.tsx:129`; `MetFields.tsx:157`; `CustomerDialogs.tsx:380`; `CustomerKyc.tsx:66,166,221`; `CustomerPolicies.tsx:53`; `CustomerProfile.tsx:122`; `CustomersScreen.tsx:49`; `KycDialogs.tsx:274,320`. Hướng sửa: helper `joinParts()` + `t('sep.*')`.

### F-16 — Bằng chứng review không khớp head cuối; phiên review tự sửa code — Low · CONFIRMED · MỚI · A · Quy trình (P-1)
- PR #87: PASS lúc 21:47, commit cuối `6daf43f` lúc 21:49, merge lúc 22:01.
- PR #78: "CHANGES → đã sửa trong PR (14d7d0b)", commit sửa đứng ngay trước comment.
- 13/17 PR mẫu có PASS ghi đúng SHA head.

### F-17 — PR vượt ngưỡng P1 thường xuyên (đều tự khai) — Low · CONFIRMED · MỚI · C+A · Quy trình (P-2)
- Claude: 10/15 PR mẫu trong ngưỡng. Astra: 14/17 PR trong ngưỡng theo cách đếm P/T. Vượt: #74, #87, #139, #144, #155, #185. PR #96 sửa `playwright.config.ts` ngoài danh sách được phép mà không khai.

### F-18 — Formatter / tooltip ECharts phải escape chuỗi từ DB — Nit · PLAUSIBLE · MỚI · C · Task T-i (task dashboard đầu tiên Phase 4) + checklist ở #72
- Hiện chart dùng dữ liệu tĩnh. Khi Phase 4 đưa tên team / RE vào tooltip (DB có thể đến từ backup), formatter tự ghép HTML sẽ thành đường XSS. Quy ước: chỉ dùng tooltip mặc định, hoặc `echarts.format.encodeHTML`.

### F-19 — `getPolicy` quét toàn bộ HĐ; `t()` dùng `in` trên object thường — Nit · CONFIRMED · MỚI · C · Task T-h
- `packages/db/src/policies.ts:30-32` → truy vấn theo id. `apps/desktop/src/i18n/index.ts:11` → `Object.hasOwn(params, name)`.

### ĐÃ BIẾT còn mở, chuyển sang Phase 6 (không tính trong bảng lỗi)
- Ghi muộn trong khoảng chờ backup → thay DB (#96); hai `replace` chạy chồng nhau (#192). Modal đang chặn. Cần cơ chế tuần tự hóa replace / save / export / sync trước khi làm đồng bộ async (Task S-2).

### Quyết định / nợ phase sau (không tính là lỗi)
- **D-1 (Phase 5, G4 / G6):** gọi OpenCode Go và lưu key vào Windows Credential Manager. CSP `connect-src` chỉ có `'self' ipc:`, Rust chỉ dùng `std` → phải chọn nới CSP (key đi qua webview) hay lệnh Rust HTTP + keyring (crate mới). Quyết trước khi viết `packages/ai`. `STALE` so theo `kyc_versions` id / `seq`, không theo `date`.
- **D-2 (Phase 6):** `.p2cbackup` là một dòng JSON 10,5 MB, chưa làm được snapshot có diff đọc được như ADR-0010. Cần định dạng mỗi bảng một file, một dòng mỗi bản ghi, không có `exportedAt` trong file bảng; định danh snapshot, tombstone, chính sách xung đột (Task S-1).

## 4. Kế hoạch xử lý

Nguyên tắc: gom theo vùng code, mỗi task ≤ ~400 dòng sản phẩm / ≤ ~800 tổng (P1). Trước G7 chỉ làm những gì bảo vệ dữ liệu. Mỗi task là một Issue theo mẫu, TDD (test đỏ trước), review theo `risk`.

### Đợt 1 — trước khi đóng Phase 3 (G7)

| Task | Nội dung | Phát hiện | risk | File được phép | Test chấp nhận chính | Ước lượng |
|---|---|---|---|---|---|---|
| **T-a** | Nhập backup: kiểm giá trị từng ô + giới hạn dung lượng | F-01 (phần 1), F-04 | high | `packages/db/src/{backup,backup-validation (mới),errors}.ts` + test; `apps/desktop/src/data/app-data.ts` + test; `apps/desktop/src/routes/SettingsBackup.tsx`; `apps/desktop/src/i18n/vi.ts`; `e2e/backup.spec.ts`; `docs/design/phase-3-du-lieu.md` §6 | Ngày không đúng `YYYY-MM-DD` hoặc không tồn tại, `time` sai `HH:MM`, `value_json` không phải JSON / sai kiểu trường, `seq` ≤ 0 → `BACKUP_INVALID`; `RangeError` / `SyntaxError` lúc đọc → hộp 10b; file vượt ngưỡng bị từ chối **trước khi đọc** và cả khi gọi thẳng API; DB hiện tại, `persist`, listener đều không đổi; round-trip byte seed + file schema cũ vẫn xanh | ~200 / ~500 |
| **T-b** | Nhập backup: kiểm bất biến liên bảng | F-01 (phần 2) | high | `packages/db/src/backup-validation.ts` + test; `app-data.test.ts` | Mỗi ca → `BACKUP_INVALID`: KH thiếu transition đầu; `stage` ≠ `to` của transition mới nhất chưa xóa; ngày transition giảm theo `seq`; `from` không nối `to` trước; transition gắn cuộc hẹn khác KH / không MET / sai `stage_after`; `re_id` không phải RE; người phối hợp = RE; fact trỏ note KH khác; `birthYear` / `gender` active không từ `SYSTEM`; trường có 2 active hoặc 1 conflict. Bản ghi xóa mềm hợp lệ vẫn nhận | ~250 / ~650 |
| **T-c** | Thay DB không tắt lưu + ErrorBoundary | F-02, F-03 | high | `apps/desktop/src/data/app-data.ts` + test; `apps/desktop/src/shell/{AppShell,ErrorBoundary (mới)}.tsx`; `apps/desktop/src/App.tsx`; `vi.ts`; `e2e/**` | Exe mode: nhập / nạp lại khi `openDatabase` lỗi → sửa tiếp trên DB cũ vẫn tới `save`; màn ném lỗi render → thông báo i18n, sidebar dùng được, `CloseGuard` vẫn flush khi đóng | ~80 / ~250 |
| **#72 T-053** | Đóng Phase 3 | F-10, F-16/F-17 (ghi quy tắc), F-18 (thêm checklist) | low (docs) | `docs/**`, `.claude/skills/review-pr/SKILL.md` (P-1), `docs/process/REVIEW-CHECKLIST.md` | Mọi dòng của F-10 đã sửa hoặc ghi "đã thay"; HANDOFF chia ledger OPEN / RESOLVED / ACCEPTED; `docs/metrics/phase-3.md`; lưu báo cáo này vào `docs/reviews/`; Owner kiểm tay exe build **sau** T-a/T-b/T-c: mở lại giữ dữ liệu, exe thứ hai, lưu lỗi → thử lại / đóng, xuất trùng tên, nhập (kể cả file hỏng) / nạp lại, Explorer với đường dẫn có dấu phẩy / khoảng trắng — ghi SHA + kết quả vào #72 | docs |

Thứ tự: T-c (độc lập, nhỏ) → T-a → T-b (xếp chồng trên T-a) → #72. Mockup overview (F-10) ở #72 chỉ gắn cảnh báo "công thức cũ, xem ADR-0007"; sửa hẳn ở G2 Phase 4.

### Đợt 2 — đầu Phase 4 (trước màn dashboard)

| Task | Nội dung | Phát hiện | risk | Ghi chú |
|---|---|---|---|---|
| **T-d** | e2e local ổn định | F-05 | low | Làm đầu tiên vì mọi task sau đều chạy e2e |
| **G2 Phase 4** | Owner chốt: cách đếm "lịch dự kiến / đã gặp" + chuỗi dời lịch (gồm ca xóa lịch con của chuỗi dời); miền năm; sửa mockup Tổng quan theo ADR-0007 | F-10 (mockup), F-14 | gate | Cổng G2, cần trước T-e/T-f |
| **T-e** | Index chỉ số + hàm MTD | F-06, F-07 | med | Golden G01–G22 không đổi; benchmark trên seed < 20 ms/lần |
| **T-f** | Miền năm thống nhất theo quyết định G2 | F-14 | med | `period.ts`, `PeriodPicker`, `db/common.ts` |
| **T-g** | Chất lượng CI | F-08, F-09 | med | Coverage riêng domain / db + lớp app; ghim SHA Actions |
| **T-h** | Dọn UI / i18n / lệnh DB | F-11, F-12, F-13, F-15, F-19 + các ghi chú OPEN trong ledger cùng file | low → med (đụng `packages/db`) | Tách 2 PR nếu vượt ngưỡng: (1) `packages/db` + i18n lỗi, (2) JSX / OutcomeDialog |
| **T-i** | Task dashboard đầu tiên | F-18 | theo task | Acceptance: formatter chart escape / chỉ dùng tooltip mặc định |

### Đợt 3 — phase sau

| Task | Nội dung | Phát hiện |
|---|---|---|
| **D-1** | Quyết định G4/G6 gọi mạng + lưu key trước `packages/ai` | Phase 5 |
| **S-1** | Định dạng snapshot mỗi bảng một file, dùng lại validator T-a/T-b | D-2 |
| **S-2** | Tuần tự hóa replace / save / export / sync trước đồng bộ async | ĐÃ BIẾT #96/#192 |

### Thay đổi quy trình (ghi trong #72)

- **P-1 (F-16):** skill `review-pr`: PASS phải ghi SHA head; head đổi sau PASS → review lại diff mới; phiên review không commit.
- **P-2 (F-17):** khi viết Issue, ước lượng cỡ gồm cả i18n + e2e; dự kiến vượt ngưỡng → tách từ đầu; PR phải khai mọi file ngoài danh sách được phép.
- **P-3:** khi đóng mỗi phase, chuyển ghi chú review sang OPEN / RESOLVED / ACCEPTED, để review sau không phân loại nhầm (lần này F-02 bị Claude ghi MỚI vì R2 NIT không có trong HANDOFF).

## 5. Truy vết phát hiện → task

| Phát hiện | Mức | Task |
|---|---|---|
| F-01 | High | T-a, T-b |
| F-02 | Medium | T-c |
| F-03 | Medium | T-c |
| F-04 | Low | T-a |
| F-05 | Medium | T-d |
| F-06 | Medium | T-e |
| F-07 | Medium | T-e |
| F-08 | Low | T-g |
| F-09 | Low | T-g |
| F-10 | Low | #72 (+ G2 Phase 4) |
| F-11 | Low | T-h |
| F-12 | Low | T-h |
| F-13 | Low | T-h |
| F-14 | Low | G2 Phase 4 → T-f |
| F-15 | Low | T-h |
| F-16 | Low | P-1 (#72) |
| F-17 | Low | P-2 (#72) |
| F-18 | Nit | T-i + checklist (#72) |
| F-19 | Nit | T-h |
| D-1 | Quyết định | Phase 5 |
| D-2 | Nợ | S-1 |
| #96 / #192 | ĐÃ BIẾT | S-2 |

## 6. Hiệu chỉnh so với hai báo cáo gốc

- **Claude:** A-002 (`generation`) đổi từ MỚI thành **ĐÃ BIẾT (R2 #101 NIT 4), bị đánh giá thấp**; bảng PR thiếu chi tiết head #87 đổi sau PASS; bỏ sót các điểm lệch tài liệu mà Astra tìm được (PLAN:127, PLAN §4.4, HANDOFF, mockup overview, mockup 10c).
- **Astra:** A-002 (giới hạn dung lượng) hạ từ Medium xuống **Low** (đã đo, không mất dữ liệu); đường `generation` Astra ghi "chưa chứng minh" nay đã tái hiện ở exe mode → Medium; Astra không chạy test local nên không thấy e2e chập chờn (F-05) và không đo hiệu năng.
- Verdict hai bên khác tên gọi nhưng cùng nội dung: đóng G7 sau Đợt 1 và kiểm tay exe.

## 7. Trạng thái sau review (30/09/2026)

- **Quyết định Owner:** ngưỡng nhập backup **100 MB** (F-04).
- **Issue Đợt 1 đã tạo** (milestone Phase 3, `type:task`, `risk:high`, `ready-for-agent`):

  | Task | Issue | Bị chặn bởi |
  |---|---|---|
  | T-c | [#202 T-077](https://github.com/AlexH-AI/Project-2C/issues/202) Thay DB không làm DB cũ ngừng lưu + ErrorBoundary | Không |
  | T-a | [#203 T-078](https://github.com/AlexH-AI/Project-2C/issues/203) Nhập backup kiểm giá trị từng ô + giới hạn 100 MB | Không |
  | T-b | [#204 T-079](https://github.com/AlexH-AI/Project-2C/issues/204) Nhập backup kiểm bất biến liên bảng | #203 (có liên kết dependency trên GitHub) |

  Thứ tự làm: #202 → #203 → #204 → #72. Issue Đợt 2 (T-d … T-i) tạo khi bắt đầu Phase 4.
- **Dọn dẹp:**
  - hai worktree review cố định (`Project-2C-review`, `Project-2C-review-2`) đưa về `origin/main` `a36f94d` theo ADR-0017;
  - clone Astra `Project-2C-astra` đã xóa nội dung; 18 file cấu hình Codex (`.agents/`, `.codex/`, `AGENTS.md`) được lưu tại `astra-reports\codex-setup\`;
  - `git fetch --prune` bỏ ref `origin/task/T-076-…` đã xóa trên GitHub;
  - GitHub chỉ còn nhánh `main`.
- **Tài liệu trên `main`:** `main` đã đi tiếp tới `a36f94d` (#199, #201 chỉ sửa docs: ADR-0001 phụ lục M2, PLAN, STATE). Khi làm #72, đối chiếu lại F-10 với `main` mới nhất.

## 8. Giới hạn

- Không chạy exe thật (Tauri, Explorer, hai process, đĩa đầy, file bị khóa). Số đo hiệu năng lấy trong Node, không phải WebView2. Hậu quả "cửa sổ trắng" của F-01 là suy luận từng bước từ code (hàm đọc ném lỗi khi render + không có boundary), chưa quan sát trên trình duyệt.
- Chưa so từng màn với mockup G3 ở mức pixel / AA. Hai bên hợp lại lấy mẫu 25 PR và 16 Issue, không phủ toàn bộ.
- Trạng thái GitHub đọc ngày 30/09/2026; code neo ở `0fa0eea`.
