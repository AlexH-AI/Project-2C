XONG — claude gói F, 14/10/2026 22:21

# Deep review Phase 1–6, lượt 1 — Claude, gói F (Xuyên gói, bloat / hiệu năng, công cụ)

## 1. Đầu phiên

- Bên: Claude (Opus 5.5), phiên sạch, chỉ đọc.
- Gói: F — `tools/**`, `e2e/**`, `.github/**`, `.githooks/**`, `.claude/**`, `packages/ui/scripts/`, `apps/desktop/vite.config.ts`, file gốc repo; luồng xuyên gói; toàn codebase cho bloat và hiệu năng.
- Máy: `DESKTOP-KDURKJP` (Home PC).
- Repo: `C:\workspace\Project-2C-review`, `git rev-parse HEAD` = `885534549808f42aec7f9af5743bbf86642ee4bd` (khớp SHA ghim `8855345`).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 14/10/2026 21:42.
- Bước 0: `F.md` chưa có → làm mới; `A.md`…`E.md` có đủ, dòng đầu đều `XONG`.
- Ghi chú minh bạch: lệnh đầu tiên của phiên (đọc prompt) có kèm `ls -la C:/workspace/deep-review-1-6/` trước khi đọc tới quy tắc 1; chỉ thấy tên 4 thư mục con (`claude`, `codex`, `common`, `muse`) và giờ sửa, **không** mở / liệt kê bên trong `codex\` hay `muse\`, không thấy nội dung báo cáo bên khác.

## 2. Phạm vi đã đọc

Danh sách file gói F lấy đúng luật `classifyFile` của `tools/size-report-core.mjs` (`claude\F\list.mjs` → `list.log`): 84 file, **3 761 dòng SP / 11 263 dòng test / 4 628 dòng sinh tự động** (khớp `plan.md` §3).

**Code sản phẩm gói F (đọc ở SHA ghim; hết từng dòng trừ chỗ ghi "lướt" / "phần đầu"). Chưa đọc:** `tools/retro-core.mjs` (242; chỉ đọc `retro.mjs` gọi nó — đếm số liệu transcript Claude Code của máy, không đụng dữ liệu app), `tools/size-report-core.mjs:200-358` (dựng bảng Markdown / so sánh), `.github/ISSUE_TEMPLATE/task.yml` (mẫu Issue), tài liệu `.md` trong `.claude/` (chỉ tra `review-pr/SKILL.md` phần dạng comment REVIEW).

- `tools/`: `pr-core.mjs` (294), `merge-pr.mjs` (158), `pr-status.mjs` (136), `session-core.mjs` (120), `session-io.mjs` (14), `status.mjs` (77), `handoff.mjs` (160), `review-hint-core.mjs` (27), `load-data.mjs` (61), `load-data-core.mjs` (103), `eval-ai.mjs` (57), `eval-ai-core.mjs` (712: cấu hình, adapter, `readReply` / `serverMessage`, `runEval`, phần ghi file kết quả; phần dựng bảng Markdown đọc lướt), `codemap.mjs` (95), `codemap-core.mjs` (200), `size-report-core.mjs` (đầu file tới `parseSizeArgs`), `size-report.mjs` (48, phần đầu), `retro.mjs` (56), `session-start.ps1` (72), `session-end.ps1` (78), `bootstrap.ps1` (211).
- CI / hook / cấu hình: `.github/workflows/ci.yml` (148), `.githooks/pre-push` (13), `.claude/settings.json`, `.claude/hooks/handoff-context.mjs` (25), `.claude/hooks/review-pr-hint.mjs` (29), `.dependency-cruiser.cjs` (72), `eslint.config.js` (48), `package.json` gốc, `pnpm-workspace.yaml`, `vitest.config.ts` (70), `tsconfig.base.json`, `e2e/tsconfig.json`, `apps/desktop/vite.config.ts` (29), `packages/ui/scripts/check-tokens.ts` (37), `playwright.config.ts`, `playwright.perf.config.ts`, `playwright.guide.config.ts`; `package.json` của 5 package (dependency).
- e2e (test của gói F): `e2e/serve.mjs`, `anchor.ts`, `seeded-snapshot.ts`, `support.ts` (hết), `full-cycle.spec.ts` (1–120 + cách kiểm số), `demo-data.spec.ts`, `seed-timing.spec.ts`, `smoke.spec.ts` (hết), `perf/probe.perf.ts` (1–140); quét toàn bộ `e2e/` bằng `git grep` cho mẫu test yếu (`catch`, `waitForTimeout`, `skip` / `only`, `expect.soft`, `toBeGreaterThan(0)`, `\d+`, bộ gom lỗi console không được kiểm).

**Code gói khác mà phần xuyên gói nối vào (chỉ chỗ nối):** `packages/db/src/appointments.ts:101-130, :251-293, :358-361`, `customers.ts:84-102, :170-200, :247-305`, `trash.ts:130-165`, `seed.ts:380-412`, `policies.ts:17-39`, `counts.ts`, `errors.ts` (danh sách mã); `packages/domain/src/customer-lifecycle.ts:41-60`, `stage-snapshot.ts:34-50`, `stats.ts:160-175`; `apps/desktop/src/data/tables.ts`, `app-data.ts:200-216` (seed demo), `main.tsx`; `routes/reports/reports-view.ts:196-330`, `routes/trash-view.ts:115-210`, `routes/appointments/DeleteAppointmentDialog.tsx`, `AppointmentsScreen.tsx:620-652`, `i18n/vi.ts` (khóa `appointmentDelete.*`, `trash.*`, `error.*`), `i18n/index.ts:124-130`; `src-tauri/tauri.conf.json`, `src-tauri/src/ai.rs:225-362` (luật key của Rust để so với script eval).

**Tài liệu:** `CLAUDE.md` gốc + `apps/desktop/CLAUDE.md`, `packages/db/CLAUDE.md`, `packages/domain/CLAUDE.md`, `.claude/rules/tests.md`, `i18n-ui.md`; `docs/design/phase-6-hoan-thien.md` (tiêu chí phát hành ở đầu file dòng 10–16, §4.2 TR-1…TR-10 + E1–E17, §5, §6); `docs/metrics/phase-6.md` (bảng ngưỡng, dòng 91 bảng hàm thuần Phase 4); `docs/testing/nghiem-thu-v1.md` (NT-LH-33, NT-TR-01…17); `common\plan.md` (hết), `known.md` (hết), `baseline.md` (hết); báo cáo `claude\A.md`…`E.md` (hết, để không báo lại và để tổng hợp số).

## 3. Phát hiện

Không có Critical / High. Một Medium (CL-F2), ba Low. Mọi phát hiện CONFIRMED.

### CL-F1 — Script eval AI ghi được API key vào file kết quả (`docs/metrics/…`, repo public): không chặn trả lời chứa key như Rust, không che dạng `%XX` trong thông điệp lỗi

```
ID: CL-F1
Mức: Low
Trục: S, C
Vị trí: tools/eval-ai-core.mjs:5-6 (doc comment hứa "never written to the output or the result file"), :86-100 (serverMessage chỉ che dạng nguyên văn), :127-149 (readReply không kiểm content chứa key), :376, :417 (raw của REJECTED / INVALID vào file kết quả) — so với apps/desktop/src-tauri/src/ai.rs:279-300 (kiểm key trong trả lời / `mask` theo cả escape JSON và %XX), :721, :757, :1181 (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** đầu file nói script "gọi OpenCode như lệnh Rust `ai_complete` (cùng URL, header, body, mã trạng thái)" và key "không bao giờ được ghi ra output hay file kết quả". Rust (K8) coi trả lời có key — nguyên văn, escape JSON hay `%XX` — là `AI_BAD_RESPONSE`, và che key ở cả ba dạng trong thông điệp lỗi server. Script chỉ che dạng nguyên văn trong thông điệp lỗi (`replaceAll`) và không kiểm `content`; câu trả lời REJECTED / INVALID được chép nguyên văn vào `docs/metrics/ai-eval-<ngày>.md` — file dành để commit vào repo public.
- **Tái hiện:** `node p1-eval-key.mjs` (log `claude\F\p1-eval-key.log`), gọi `evalMain` với `fetch` giả và key giả `sk-FAKEPROBEKEY-…` (không gọi mạng):
  - A — server trả 200 với `content` = `Authorization: Bearer <key>` → `exit 0; files docs/metrics/ai-eval-2026-10-14.md; key occurrences in result+log {"raw":25,…}` (dòng `raw` của từng hồ sơ REJECTED / ghi chú INVALID);
  - B — HTTP 500, `error.message` = `bad header Bearer%20<key dạng %XX>` → `{"percent":75}`, vd. `| E01 | discovery | LỖI \`AI_HTTP\` (HTTP 500: bad header Bearer%20%73%6B%2D%46%41…) |`;
  - C (đối chứng) — key nguyên văn trong thông điệp lỗi → 0 lần (đã che).
- **Ảnh hưởng:** chỉ khi server / proxy bất thường dội lại header; Owner chạy eval rồi commit file kết quả (repo public). File có dặn "đọc lại trước khi commit" chỉ khi có thông điệp lỗi server, không khi key nằm trong `content`. Cần server bất thường → Low; hậu quả nếu xảy ra là lộ key.
- **Đề xuất:** dùng chung luật của Rust trong script: `readReply` ném `AI_BAD_RESPONSE` khi `content` chứa key (nguyên văn / sau `decodeURIComponent` từng `%XX` / escape JSON), `serverMessage` che cả dạng `%XX`; thêm ca vào `eval-ai-core.test.mjs` như `ai.rs:757`, `:1181`. ≈ 20 dòng SP + 2 ca test.

### CL-F2 — Xóa một cuộc gặp Đã gặp "giữ nhóm" rồi không khôi phục lại được (63 % số cuộc gặp như vậy trên dữ liệu tải), dù không có gì đổi sau khi xóa và hộp 6g hứa "khôi phục được"

```
ID: CL-F2
Mức: Medium
Trục: C, D
Vị trí: packages/db/src/appointments.ts:263-272 (restoreAppointment → applyOutcome), :278-286 (checkRestoreAppointment), :289-293 (outcomeStage so "nhóm sau" với nhóm HIỆN TẠI của KH), :358-361 (applyOutcome); packages/db/src/trash.ts:139-160 (hệ quả TR-8 tính bằng cùng outcomeStage); apps/desktop/src/routes/appointments/DeleteAppointmentDialog.tsx:87, :97 + apps/desktop/src/i18n/vi.ts:825-827 ("Cuộc hẹn này không đổi nhóm KH … Xóa mềm, khôi phục được ở Cài đặt → Thùng rác."); vi.ts:306-307 (câu chặn D10), vi.ts:265 + mockup trash.html:140 ("Khôi phục đưa bản ghi về như trước.") — so với docs/design/phase-6-hoan-thien.md:91 (TR-3), :102 (TR-10), :122-124 (E5–E7) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** cuộc gặp Đã gặp mà "nhóm sau" bằng nhóm KH lúc ghi thì không sinh chuyển nhóm (giữ nhóm). Xóa nó luôn được (không có chuyển nhóm để rút, D7) và hộp 6g nói "Cuộc hẹn này không đổi nhóm KH … Xóa mềm, khôi phục được ở Cài đặt → Thùng rác." Nhưng khôi phục so "nhóm sau" với nhóm **hiện tại** của KH: KH đã đổi nhóm sau ngày cuộc gặp (việc rất thường — KH đi tiếp N3 → N2 → N1) thì khôi phục muốn ghi một chuyển nhóm **mới** "N2 → N3" ở ngày cuộc gặp — chuyển nhóm mà cuộc gặp chưa bao giờ có — và D10 chặn (`TRANSITION_BEFORE_LATEST`), hoặc ADR-0007 chặn khi KH đã đóng (`INVALID_TRANSITION`). Thùng rác hiện nút Khôi phục tắt với câu "Nhóm KH đã đổi ngày …, sau ngày cuộc hẹn này — không ghi chuyển nhóm lùi ngày (D10)", ngay sau lần xóa, khi chưa có gì đổi. Spec chỉ có E5–E8 cho cuộc gặp **có** chuyển nhóm (E6 chặn vì nhóm đổi **sau khi xóa**); TR-3 nói khôi phục "ghi lại chuyển nhóm **của cuộc gặp**" — cuộc gặp giữ nhóm không có chuyển nhóm nào để ghi lại. (`listTrash` cũng tính hệ quả TR-8 của dòng đó là "N2 → N3" cho một cuộc gặp giữ N3; màn không hiện vì dòng bị chặn, `trash-view.ts:122-123`.)
- **Tái hiện:**
  - Ca dựng tay (`node p4-keep-stage-A.mjs`, log `claude\F\p4-keep-stage-A.log`; DB mới, ngày tương đối hôm nay 14/10): KH tạo N3; cuộc gặp 24/09 Đã gặp, nhóm sau N3 (giữ); cuộc gặp 04/10 Đã gặp N3 → N2. Xóa cuộc gặp 24/09 → dòng Thùng rác `{"blocked":{"code":"TRANSITION_BEFORE_LATEST","params":{"date":"04/10/2026"}},"effect":{"kind":"stageChange","from":"N2","to":"N3",…,"rf":false}}`; `restoreAppointment → TRANSITION_BEFORE_LATEST {"date":"04/10/2026"}`.
  - Dữ liệu tải (`node p4b-keep-stage-count.mjs`, log `p4b-keep-stage-count.log`): 7 507 cuộc gặp Đã gặp sống, 4 254 giữ nhóm; nếu xóa từng cái rồi khôi phục ngay: **2 689 bị chặn `TRANSITION_BEFORE_LATEST`, 1 bị chặn `INVALID_TRANSITION`**, 1 khôi phục bằng một chuyển nhóm mới (CL-F3), 1 563 về như cũ; 815 / 1 280 KH có cuộc gặp như vậy. Kiểm bằng lệnh thật trên 150 cuộc gặp ngẫu nhiên (xóa → `listTrash` → `restoreAppointment`): `{"sample":150,"agree":150,"disagree":[]}`.
  - Probe xuyên gói "xóa rồi khôi phục" (`node p2-undo.mjs 25`, log `p2-undo.log`): KH 25 / 25, HĐ 25 / 25, lịch không Đã gặp 25 / 25, cuộc gặp có chuyển nhóm 4 / 4 (21 cái còn lại bị D7 từ chối xóa — đúng luật) về đúng như trước (so `reportRows` Năm / Tháng / năm trước, bảng `list*`, `countRecords`); cuộc gặp giữ nhóm: 19 / 25 "blocked right after its own deletion". (Các dòng "CHANGED" của log là hệ quả của chính các cuộc gặp bị kẹt trong Thùng rác — probe không cập nhật mốc sau lần khôi phục bị từ chối; `p3-undo-detail.log` xóa → khôi phục riêng từng cái ấy: chỉ `updated_at` đổi.)
  - **Trên màn** (bản web ở SHA ghim, `claude\F\web\` = `apps/desktop/dist` của bước chuẩn bị, cổng 4330, seed demo neo 14/10; KH tìm bằng `node p7-seed-keep.mjs 2026-10-14`, log `p7-seed-keep.log`): hồ sơ KH Trần Hoài Hương (N2 từ 24/07/2026; bảng Lịch hẹn: "10/06 19:30 Giữ N3", "24/07 15:00 N3 → N2 · RF") → Lịch hẹn, tháng 06/2026, ngày 10/06, chi tiết → Sửa kết quả → Xóa lịch hẹn. Hộp xóa: "Cuộc hẹn này không đổi nhóm KH. Khi xóa: Nhóm KH không đổi · RF không đổi · Ghi chú KYC giữ nguyên · Xóa mềm, khôi phục được ở Cài đặt → Thùng rác." → Xóa lịch hẹn → Cài đặt → Thùng rác: đầu màn "Khôi phục đưa bản ghi về như trước."; dòng `10/06/2026 19:30 · Đã gặp · nhóm sau N3 · Nhóm KH đã đổi ngày 24/07/2026, sau ngày cuộc hẹn này — không ghi chuyển nhóm lùi ngày (D10).`, nút `["Khôi phục…", disabled: true]` (`javascript_exec`, 22:12). Dữ liệu chỉ trong bộ nhớ của trang.
- **Ảnh hưởng:** RE / quản lý xóa nhầm (hoặc xóa thử, tin câu "khôi phục được") một cuộc gặp đã ghi: bản ghi (ngày, nhóm sau, bước tiếp, case size, người phối hợp, ghi chú) nằm lại Thùng rác mãi (TR-6 không có xóa vĩnh viễn), số "Đã gặp" của kỳ đó giảm vĩnh viễn. Đường vòng đều mất dữ liệu: ghi lại tay (theo CL-E4 thì chỉ "nhóm sau = nhóm hiện tại" lưu được), hoặc nhập lại backup cũ (mất mọi thay đổi sau đó). Thao tác bình thường, không đảo ngược được → Medium.
- **Đề xuất (cần Owner chốt vì thêm một ca vào bảng E của spec):** khi khôi phục (và khi `listTrash` tính hệ quả), cuộc gặp giữ nhóm — "nhóm sau" bằng nhóm của KH **tại ngày cuộc gặp** (`stageOn` của `domain`) — về mà không ghi chuyển nhóm, như E7; chỉ cuộc gặp có "nhóm sau" khác nhóm tại ngày đó mới ghi lại chuyển nhóm và qua D10 (E5, E6, E8 giữ nguyên). Thêm ca E18 "cuộc gặp giữ N3 ngày 24/09, KH đổi N3 → N2 ngày 04/10, xóa rồi khôi phục → được, không đổi nhóm". ≈ 15 dòng SP (`appointments.ts`, `trash.ts` dùng chung một hàm) + 2–3 ca `trash.test.ts` / `appointments.test.ts`. Cùng gốc "so nhóm sau với nhóm hiện tại" với CL-A2, CL-E4 — nên sửa chung một Issue. Test hở để lọt lỗi này: E1–E16 chỉ có cuộc gặp có chuyển nhóm, fuzz gói A kiểm "lý do chặn = lỗi của lệnh" (cả hai cùng sai) chứ không kiểm "xóa rồi khôi phục = như cũ" → thêm một test thuộc tính trên seed demo: xóa rồi khôi phục từng lịch / HĐ / KH, `exportBackup` (bỏ `updated_at`, `deleted_at`) phải như trước (≈ 30 dòng test, như `p2-undo.mjs`).

### CL-F3 — Xóa (6g) một cuộc gặp có chuyển nhóm, hoặc chuyển tay (5d) lùi ngày, để lại cuộc gặp "giữ nhóm" trái với nhóm KH; dữ liệu tải có sẵn một ca, và xóa → khôi phục ca đó đổi nhóm KH / thêm một RF

```
ID: CL-F3
Mức: Low
Trục: D, C
Vị trí: packages/db/src/customers.ts:273-294 (withdrawAppointmentTransition: chỉ kiểm chuyển nhóm là mới nhất, không xét cuộc gặp giữ nhóm sau nó), :170-180 + :250-267 (changeStageManually → checkTransition: D10 chỉ so với chuyển nhóm mới nhất, không với cuộc gặp Đã gặp); packages/db/src/appointments.ts:251-257 (softDeleteAppointment); packages/db/src/seed.ts:394-405 (fillTrash xóa theo đúng luật D7 đó); packages/db/src/backup-validation.ts (luật nhập không bắt trạng thái này) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** D7 cho xóa cuộc gặp có chuyển nhóm khi chuyển nhóm đó là mới nhất của KH. Cuộc gặp **giữ nhóm** ghi sau nó (không có chuyển nhóm) không được xét: xóa xong KH về nhóm cũ, còn cuộc gặp sau vẫn ghi "nhóm sau" là nhóm mới. Hồ sơ hiện cuộc gặp cuối "Đã gặp · giữ N2" trong khi KH ở N3; luật nhập backup nhận trạng thái này (thêm hai đường vào trạng thái CL-A2 mô tả, sau 6f và 6c / CL-E4). Seed (`fillTrash`, dùng đúng luật D7) đã tạo ra một ca như vậy trong dữ liệu tải.
- **Tái hiện:** `node p4c-odd.mjs` + `node p4d-raw.mjs` (log `p4c-odd.log`, `p4d-raw.log`), dữ liệu tải: KH "Phan Đức Lan" `stage N3`; chuyển nhóm `N3→N2 2026-07-24` của cuộc gặp `…F8QG` đã xóa (`deleted_at 2026-10-12`, do `fillTrash`); cuộc gặp `2026-08-12 MET stage_after N2` (`…F5EV`) còn sống, không có chuyển nhóm. Xóa `…F5EV` → dòng Thùng rác `{"blocked":null,"effect":{"kind":"stageChange","from":"N3","to":"N2",…,"rf":true}}`; khôi phục → `customer now N2; transitions: ∅→N4 2025-10-12 | N4→N3 2026-04-17 | N3→N2 2026-08-12` — một lần "xóa rồi khôi phục" thêm một RF (hộp TR-8 có báo "tính 1 RF", nên không lặng lẽ). Ca dựng tay của CL-A2 (`claude\A\s2-scenarios.log`) là cùng loại trạng thái. Quét bất biến (`node p8-invariants.mjs`, log `p8-invariants.log`): trên dữ liệu tải đúng 1 cuộc gặp giữ nhóm có "nhóm sau" khác nhóm KH tại ngày đó (`F5EV 2026-08-12 after N2 / on its day N3`), 0 chuyển nhóm sống của lịch đã xóa / không Đã gặp, 0 chuyển nhóm lệch "nhóm sau"; seed demo của app hôm nay (không có Thùng rác): 0.
  - Đường vào thứ hai cùng hệ quả — chuyển tay (5d) lùi ngày qua một cuộc gặp giữ nhóm (`node p10-manual-backdate.mjs`, log `p10-manual-backdate.log`, DB mới): cuộc gặp 04/10 Đã gặp giữ N3 → `changeStageManually` N3 → N2 ngày 24/09 (trước cuộc gặp) **được nhận** (D10 chỉ so với chuyển nhóm mới nhất 14/09) → cuộc gặp 04/10 "after N3" trong khi KH N2 từ 24/09. Xóa cuộc gặp → dòng Thùng rác `{"blocked":null,"effect":{"kind":"stageChange","from":"N2","to":"N3",…}}`; khôi phục → `stage N3`, thêm `N2→N3 2026-10-04 (meeting)` — "khôi phục đưa bản ghi về như trước" lại đổi nhóm KH.
- **Ảnh hưởng:** RE xóa một cuộc gặp đổi nhóm (ghi nhầm) khi đã ghi thêm cuộc gặp giữ nhóm sau đó, hoặc chuyển tay với ngày lùi qua một cuộc gặp đã ghi: lịch sử nhóm trên hồ sơ tự mâu thuẫn; về sau xóa → khôi phục cuộc gặp sau làm đổi nhóm và RF. Hộp 6g có nói "Nhóm KH → về N3", nên người dùng thấy một phần → Low.
- **Đề xuất:** gộp với CL-F2 / CL-A2 / CL-E4 (một luật "nhóm sau so với nhóm tại ngày cuộc gặp"): D7 từ chối xóa cuộc gặp có chuyển nhóm khi có cuộc gặp Đã gặp sau nó ghi "nhóm sau" bằng nhóm mới (câu báo nêu ngày cuộc gặp đó), hoặc hộp 6g nêu cuộc gặp đó; luật nhập backup kiểm "cuộc gặp Đã gặp không có chuyển nhóm thì nhóm sau = nhóm KH tại ngày đó" (K1: nạp lại dữ liệu giả lập). ≈ 15–25 dòng SP + test; sinh lại dữ liệu tải (hash `tables` đổi).

### CL-F4 — Bốn luật của cổng merge / hook không test nào giữ (đột biến P3, P5, S3, S9 sống)

```
ID: CL-F4
Mức: Low
Trục: T
Vị trí: tools/pr-core.mjs:48 (isNotesOnly: đúng một file `docs/state/review-notes.md`), :117 (verdict phải BẮT ĐẦU bằng PASS); tools/session-core.mjs:92 (SHA trong REVIEW ≥ 7 ký tự hex), :73 (cắt theo chỗ còn lại sau header); tools/pr-core.test.mjs:208-226, tools/session-core.test.mjs:110-121, :128-130 (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** 50 đột biến trên `tools/*-core.mjs` (cổng merge `mergeBlockers` / `cleanupPlan`, `latestReview` / `checkCounts`, HANDOFF, gợi ý review, dữ liệu tải, codemap, kích thước, script eval): 45 bị test giết, 5 sống qua cả 2 755 test. Một cái gần tương đương (P4: PR không có file nào được coi là "chỉ sổ ghi chú" — vẫn bị chặn vì không có CI). Bốn cái còn lại là luật thật của cổng merge (`CLAUDE.md` bước 5) không có ca kiểm:
  - **P3** `isNotesOnly` nhận mọi file dưới `docs/state/` → PR sửa sổ ghi chú **kèm** một file khác trong `docs/state/` được merge không cần REVIEW. Ca hiện có chỉ ghép sổ với `docs/README.md` (`pr-core.test.mjs:216`).
  - **P5** verdict chỉ cần **chứa** "PASS" (`/PASS/` thay `/^PASS\b/`) → một comment `REVIEW: CHANGES — sửa 2 mục rồi mới PASS` mở cổng. Test chỉ có verdict `CHANGES` trần.
  - **S3** SHA trong REVIEW nhận 1–6 ký tự → `head \`a\`` khớp mọi head bắt đầu bằng "a". Không ca nào có SHA ngắn.
  - **S9** `fitOutput` so với cả giới hạn thay vì phần còn lại sau header → HANDOFF dài gần 9 500 ký tự cho đầu ra hook vượt `HOOK_LIMIT` (vẫn dưới 10 000 của Claude Code). Test chỉ có thân 4 và 20 000 ký tự.
- **Tái hiện:** `node mutate.mjs` (log `claude\F\mutate.log`, `mutate-results.json`): `P3 any docs/state file needs no REVIEW → SURVIVED (tools tests and the whole vitest suite: 2755 passed)`, tương tự P4, P5, S3, S9; dòng cuối `git status --short after: ""`.
- **Ảnh hưởng:** chỉ người sửa công cụ sau này: nới các luật trên không làm CI đỏ, và cổng merge là lớp kiểm duy nhất của "REVIEW PASS đúng head" (`main` không bắt buộc status check — `CLAUDE.md`). Hành vi hiện tại đúng.
- **Đề xuất:** thêm 4 ca (≈ 20 dòng test): sổ ghi chú + `docs/state/x.md` → cần REVIEW; `REVIEW: CHANGES … PASS` → chặn; `head \`abc\`` → không có SHA; `fitOutput(header 200 ký tự, thân 9 400 ký tự).length < HOOK_LIMIT`.

## 4. Bloat (toàn codebase)

Số của gói A–E lấy nguyên từ báo cáo Claude các gói đó (cùng SHA, cùng máy), không đo lại.

| Đã chạy / đo | Trên | Kết quả | ID |
|---|---|---|---|
| `tsc --noEmit --noUnusedLocals --noUnusedParameters` | mọi package + app (A–E, mỗi gói exit 0, 0 dòng); `e2e` dùng `tsconfig.base.json` có sẵn hai cờ (`tsc -p e2e` nằm trong `pnpm typecheck`, xanh ở `baseline.md`); `tools/*.mjs` qua ESLint `no-unused-vars` của `pnpm lint` | 0 biến / tham số thừa — hai cờ vốn bật ở `tsconfig.base.json:12-13` | — |
| Export không có nơi dùng sản phẩm ngoài file (`exports.mjs` mỗi gói; gói F: `claude\F\exports-f.mjs` → `exports-f.log`) | toàn repo | A: 6 hàm SP chỉ test dùng + 1 bí danh (CL-A8); B: `PersistQueue.unsaved()` (CL-B4); C: 0; D: `PLAIN_SLOTS` (CL-D8); E: 0. F: 17 export của `tools/*-core.mjs` chỉ dùng trong chính file hoặc trong test (vd. `REVIEW_NOTES`, `BODY_MAX`, `DEFAULT_DIST`, `writeHandoff`, `LOAD_SCALE`) và helper e2e chỉ test dùng (đúng vai trò) — công cụ dev, không vào bundle, không có chi phí đo được → không thành phát hiện | CL-A8, CL-B4, CL-D8 |
| Code lặp, khớp nguyên thân hàm ≥ 25 token (`claude\F\dup-scan.mjs`, dùng `typescript` của repo; 194 file SP, 952 thân hàm → `dup-scan.log`) | `packages/*/src`, `apps/desktop/src`, `tools`, `e2e` (không test) | 2 nhóm, đều KNOWN: hook `resolve` của `tools/eval-ai.mjs:18` ≡ `tools/load-data.mjs:20` (#566); `plain` `appointment-form.ts:111` ≡ `trash-view.ts:48` (#543) | — |
| Code lặp theo cấu trúc (định danh / chuỗi chuẩn hóa, ≥ 35 token; `dup-scan-struct.mjs` → `dup-scan-struct-35.log`) | như trên | 8 nhóm: `remove` (try `app.run(softDelete…)` / catch `setError`) ×5 ở 5 hộp xóa (8 dòng mỗi nơi); `update<X>Row` ×4, `list<X>` ×3, `restore<X>` ×3, `analysesOf` / `notesOf` / `factsOf` ×3 ở `packages/db` (cùng họ CL-A9); `toggle` ×2; `isCustomerLive` / `reviewsLiveAppointment` ×2. Lặp ngắn, không có chi phí đo được; phần `db` đã có đề xuất ở CL-A9 | (CL-A9) |
| Dependency khai báo ↔ import thật | `package.json` gốc + 5 package | mọi dependency đều được import (`exceljs` nạp động, `drizzle-kit` cho `db:generate`, `globals` cho ESLint). Rust: 6 crate trực tiếp, 294 crate (gói B) | — |
| Cấu thành bundle (`claude\F\bundle\split-build.mjs`: `vite build` của repo, cùng plugin / target / nhóm chart, thêm một chunk cho mỗi dependency / package, `includeDependenciesRecursively: false`, ra thư mục của tôi → `split-build.log`) | bản build web ở SHA ghim | (min, byte / gzip) react-dom 207 089 / 63 771 · `routes` 189 977 / 50 806 · **zod 89 716 / 25 158** · `i18n` 66 385 / 18 608 · drizzle-orm 63 564 / 17 018 · `db` 50 216 / 15 066 · sql.js (JS) 39 781 / 14 007 · `ai` 35 989 / 12 591 · tanstack 35 611 / 11 086 · `domain` 22 716 / 8 703 · `data`+`shell` 19 711 / 7 505 · migration 16 373 / 3 200 · `@tauri-apps/api` 15 114 / 3 785 · `ui` 14 650 / 5 013 · seed 12 213 / 5 958 · react 11 751 / 4 470; ECharts 512 882 / 172 311 (nạp sẵn lúc mở vì màn đầu là Tổng quan); exceljs ≈ 930 KB (chỉ nạp ở lần Xuất Excel đầu). Tổng JS+CSS 2 367 844 B (baseline 2 364 283 — khác vì chia chunk). zod đầy đủ = 10 % phần JS nạp lúc mở (không kể ECharts) → số đo mới cho CL-C3 | (CL-C3) |
| Exe | `baseline.md` | 5 414 400 B; tách theo crate cần `cargo-bloat` (G4) | — |
| `pnpm lint:deps`, `pnpm codemap --check` | `baseline.md` (cổng ở SHA ghim) | 0 vi phạm (309 module, 1 244 phụ thuộc); bản đồ export khớp code | — |
| Mã lỗi ↔ câu i18n (`claude\F\p9-error-keys.mjs` → `p9-error-keys.log`) | `DB_ERROR_CODES` (55), `AI_ERROR_CODES` + `AI_LOCAL_ERROR_CODES` (11) ↔ `vi.ts` | thiếu `error.*` cho `SEED_DATABASE_NOT_EMPTY`, `SCHEMA_TOO_NEW`, `BACKUP_INVALID`, `BACKUP_TOO_LARGE` và `aiError.AI_BAD_REQUEST` — cả 5 đều có đường hiện riêng (hộp 10b `SettingsBackup.tsx:261-263`, màn khởi động `startup-error.ts:28`, `ai-error-view.ts:30,39` → câu chung; seed chỉ gọi trên DB mới) → không thừa / thiếu thật | — |
| Đề xuất refactor (tổng các gói) | — | CL-A8 (≈ −45 dòng), CL-A9 (≈ −40), CL-B4 (−3), CL-C3 (≈ 120 dòng đổi cách viết, −60…−70 KB min), CL-C5 (≈ −15), CL-D7 (≈ −15, ~10 file), CL-D8 (≤ 5 / mục). Không có đề xuất mới ở gói F. Test giữ hành vi: ghi trong từng mục; không đổi golden | — |

## 4b. Hiệu năng (toàn codebase)

**Máy, lúc đo:** Home PC `DESKTOP-KDURKJP` (i9-12900K), Node v24.20.0, 14/10/2026 22:07; CPU 4 %, đang mở 2 `codex.exe` + dịch vụ đi kèm (không đo), 6 `msedgewebview2` (khung trình duyệt), không có `project2c`. Đo trước khi chạy đột biến. Dữ liệu: `common\load\load-2026-10-12-seed6.p2cbackup` nhập bằng `importBackup` (1 481 KH sống, 10 252 lịch hẹn, 1 674 HĐ, 4 883 chuyển nhóm, 51 nhân sự, 4 team; Thùng rác 117 dòng). Hôm nay của probe = 12/10/2026 (mốc dữ liệu tải). `claude\F\p5-perf.mjs` → `p5-perf.log`. Trung vị (min–max), n lần.

**Bảng hàm thuần Phase 4 đo lại** (`docs/metrics/phase-6.md:91`; không so với số Phase 4 — khác máy, probe cũ ngoài repo — chỉ so ngưỡng và giữa các hàm):

| Hàm (Node) | n | Trung vị | Min–max | Ngưỡng Phase 4 | ID |
|---|---:|---:|---|---|---|
| `importBackup` (file 16 034 641 B) | 5 | 709,9 ms | 676,8–810,0 | ≤ 1 100 ms ✅ | — |
| `listAppointments` (10 252 lịch) | 7 | 46,5 ms | 45,3–49,7 | ≤ 65 ms ✅ | — |
| `teamCompare` Năm / Tháng | 7 | 3,5 / 2,1 ms | 2,6–9,7 / 1,5–3,0 | ≤ 15 ms ✅ | — |
| `reportRows` Năm / Tháng · Toàn bộ | 7 | 10,4 / 6,5 ms | 9,4–17,8 / 5,9–10,0 | ≤ 15 ms ✅ (max Năm 17,8 là lần đầu) | — |
| `monthGrid` tháng · Toàn bộ | 7 | 1,0 ms | 0,6–1,6 | ≤ 2 ms ✅ | — |
| `countRecords` | 7 | 4,8 ms | 4,7–7,5 | ≤ 15 ms ✅ | — |
| `listTrash` (117 dòng, 15 KH đã xóa) | 7 | 48,7 ms | 42,0–54,3 | màn < 200 ms ✅; tăng ≈ 2 ms / KH đã xóa (CL-A1) | (CL-A1) |
| Phần AI của hồ sơ KH (KH nhiều phân tích nhất / cả 95 KH có phân tích một lượt) | 20 / 3 | 0,42 / 36,8 ms | 0,31–2,45 / 28,7–37,9 | < 200 ms / KH ✅ | — |

**Tổng hợp số của cả lượt (Claude, cùng máy):**

| Vùng | Số chính | So với | ID |
|---|---|---|---|
| Exe (`perf-ref.json`, bước chuẩn bị, Home PC) | mọi thao tác màn ≤ 106 ms (trừ tải lại màn 180–293 ms, không có ngưỡng); `app.open-data` 189 ms; `backup.read` 794 ms; `backup.import` 49 ms; `backup.export` 424 ms; `db.save` 140 ms; JS heap 16,4 MB | ngưỡng `phase-6.md` (< 200 ms màn; ≤ 600 / 2 000 / 500 / 1 000 / 400 ms; ≤ 21 MB) — đạt hết | — |
| Gói A (Node) | `listTrash` 45 ms → 211 ms ở 100 KH đã xóa, 815 ms ở 400 (chỉ mục `customer_id` tạm: 48 ms); lệnh ghi một lần ≤ 2 ms | màn Thùng rác < 200 ms | CL-A1 |
| Gói B (Rust / Node) | `storage::save` 9,5 ms (phần còn lại của `db.save` 140 ms là IPC 13 MB); tăng tuyến tính theo cỡ file, ngoại suy 400 ms ở ≈ 38 MB; `tables()` đọc lại 6 bảng 80,6 ms mỗi revision | ≤ 400 ms | — |
| Gói C | mọi phép AI < 5 ms; `validateOutput` lớn nhất 2,8 ms | — | — |
| Gói D, E (bản web, có React, không vẽ) | thao tác màn ≤ 96 ms (Lưu kết quả Hủy 88,9 ms; Khôi phục một lịch 71,8 ms; → Team sau một lần lưu 59,3 ms) | < 200 ms | — |
| Gói F (bảng trên) | mọi hàm thuần Phase 4 trong ngưỡng | ngưỡng Phase 4 | — |

Không có phát hiện P mới ở gói F. Phát hiện P duy nhất của cả lượt (Claude) là CL-A1 (Low: chỉ vượt ngưỡng khi Thùng rác giữ ≥ 100 KH đã xóa). Không đo lại trên exe: probe cần cửa sổ exe ở trên cùng trong ≈ 5 phút và máy rảnh; trên Home PC lúc này có phiên Codex mở, và số exe ở SHA ghim đã có ở `perf-ref.json`.

## 5. Bảng đếm mức × trục

Gói F (đếm theo trục chính, trục phụ trong ngoặc):

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High | | | | | | | | | | 0 |
| Medium | | CL-F2 (D) | | | | | | | | 1 |
| Low | | | CL-F3 (C) | | CL-F1 (C) | | | CL-F4 | | 3 |
| Nit | | | | | | | | | | 0 |

CONFIRMED 4 / 4 (mỗi phát hiện có lệnh / probe / đột biến chạy trong phiên, CL-F2 thêm thao tác trên bản web); 0 PLAUSIBLE, 0 KNOWN mới. Mục đã báo ở gói trước chỉ dẫn ID: CL-A1 (P), CL-A2 / CL-E4 (cùng gốc CL-F2, CL-F3), CL-A9 (code lặp `db`), CL-C3 (số đo zod mới ở mục 4).

Cả sáu báo cáo của Claude (A–F, tổng số của chính bên Claude, để làm kết luận mục 8; không so với bên khác):

| Gói | Critical | High | Medium | Low | Nit | Trong đó KNOWN |
|---|---:|---:|---:|---:|---:|---:|
| A | 0 | 0 | 0 | 6 | 4 | 0 |
| B | 0 | 0 | 0 | 2 | 3 | 1 (CL-B5) |
| C | 0 | 0 | 0 | 5 | 2 | 0 |
| D | 0 | 0 | 0 | 6 | 4 | 0 |
| E | 0 | 0 | 0 | 5 | 2 | 0 |
| F | 0 | 0 | 1 | 3 | 0 | 0 |
| **Tổng** | 0 | 0 | **1** | 27 | 15 | 1 |

## 6. Đã xét, không thấy

- **E — edge case.** Công cụ: đọc nhánh đối số của `merge-pr.mjs` (số PR, cờ lạ → exit 2), `load-data-core.mjs` (`--anchor` sau hôm nay, `--seed` ngoài 32 bit, cờ thiếu giá trị), `eval-ai-core.mjs` (`--model` chỉ nhận id của `AI_MODELS` nên không thành đường dẫn lạ trong tên file kết quả), `handoff.mjs` (thân rỗng / > 9 000 ký tự, CRLF, Issue đổi giữa đọc và ghi), `session-end.ps1` (pathspec không khớp → `git add` lỗi → dừng, có `$LASTEXITCODE` sau mỗi lệnh có tác dụng phụ), `bootstrap.ps1` (mọi lệnh native có tác dụng phụ đều qua `Assert-ExitCode`). Xuyên gói: "xóa rồi khôi phục" trên dữ liệu tải (`p2-undo.mjs`): KH 25 / 25, HĐ 25 / 25, lịch không Đã gặp 25 / 25, cuộc gặp có chuyển nhóm 4 / 4 (21 cái còn lại bị D7 từ chối xóa vì không phải chuyển nhóm mới nhất — đúng luật) về đúng như cũ (dòng "CHANGED" duy nhất của nhóm lịch không Đã gặp là hệ quả của các cuộc gặp CL-F2 bị kẹt trước đó; chạy riêng thì chỉ `updated_at` đổi, `p3-undo-detail.log`); ngoài CL-F2, CL-F3 không thấy gì.
- **C — hợp đồng.** Bộ lọc `paths` của CI ↔ `CODE_DOCS` ↔ test đọc tài liệu (`git grep` mọi test / tool đọc `docs/`: chỉ `phase-5-prompts.md`, `ai-eval.md`, `docs/user-guide` của spec chụp ảnh — ngoài `pnpm e2e`); `mergeBlockers` ↔ `CLAUDE.md` bước 5 (REVIEW của người có quyền ghi, SHA trùng head, CI xanh, `main` có code sau lúc CI chạy, `build-exe`, risk, base, xếp chồng, ngoại lệ sổ ghi chú) — khớp. Tổng quan (ảnh chụp nhóm từ chuyển nhóm, `domain`) ↔ Khách hàng (cột `stage`, `db`) trên dữ liệu tải: 6 nhóm trùng số, 0 KH lệch chuyển nhóm mới nhất (`p6-stage-consistency.log`). Lệch còn lại: CL-F1 (doc comment của script eval), CL-F2 (câu "khôi phục được" / "về như trước").
- **D — dữ liệu.** Bất biến chuyển nhóm ↔ cuộc gặp trên dữ liệu tải và seed demo hôm nay (`p8-invariants.log`): 0 chuyển nhóm sống của lịch đã xóa / lịch không Đã gặp, 0 chuyển nhóm lệch "nhóm sau", 0 lịch có hai chuyển nhóm sống; ngoài 1 ca của CL-F3. `listTrash` ↔ `restoreAppointment` trùng nhau 150 / 150 ca (`p4b-keep-stage-count.log`) — chỗ sai của CL-F2 nằm ở luật chung của cả hai, không ở chỗ lệch nhau.
- **G — guardrail AI.** Script eval đi đúng luồng của app (`runAnalysis` / `runExtraction` của `@p2c/ai`: cổng → prompt → validator → một lần thử lại; `FATAL` dừng sau lỗi key / hạn mức — đột biến E5 bị giết); chỉ phần key / server khác Rust (CL-F1). Không gọi dịch vụ AI thật (chỉ `fetch` giả).
- **S — an toàn.** CI: `permissions` chỉ đọc, action ghim SHA kèm chú thích phiên bản, nhãn đọc bằng `gh api` với `github.token`, PR từ fork chạy với token chỉ đọc; `pre-push` chặn mọi `refs/heads/main` (kể cả xóa nhánh); `.claude/settings.json` chặn `Agent`; hook `review-pr-hint` chỉ đọc chữ prompt, không chạy lệnh; `merge-pr` ghim head (`--match-head-commit`), chỉ nhận REVIEW của `OWNER` / `MEMBER` / `COLLABORATOR`, không xóa nhánh / worktree khi head khác SHA đã merge hay còn thay đổi chưa commit (đột biến P19–P23, P26 bị giết); `handoff.mjs` từ chối ghi khi Issue đã đổi; `session-end.ps1` commit theo pathspec, không đẩy `main`. Ngoài CL-F1 không thấy gì.
- **P — hiệu năng.** Mục 4b.
- **B — bloat.** Mục 4.
- **T — test.** Đột biến 50 cái trên `tools/*-core.mjs` (§7); e2e: mọi `trackConsoleErrors` đều được kiểm `toEqual([])` (6 file, 10 lần gọi), 1 `waitForTimeout(6 000)` có chủ ý (chờ lâu hơn một lần Nạp lại), không có `test.only` / `skip` / `expect.soft` / `catch` nuốt lỗi; các phép kiểm `\d+` ở e2e đã có ghi chú (#541) hoặc có unit test giữ số. `full-cycle.spec.ts` xóa / khôi phục lịch Dự kiến và KH, không có cuộc gặp Đã gặp (chỗ CL-F2 lọt — đã ghi ở đề xuất CL-F2).
- **A — trợ năng / i18n.** Gói F không có màn. Xuyên gói: mọi mã `DbError` / `AiError` có câu tiếng Việt hoặc đường hiện riêng (`p9-error-keys.log`, xem mục 4); các mục trợ năng còn lại thuộc gói D, E (CL-D10, CL-E3).

## 7. Phụ lục

**Probe / script** (thư mục `C:\workspace\deep-review-1-6\claude\F\`; đều chỉ đọc repo ở SHA ghim, chỉ ghi trong thư mục này; nạp TypeScript của repo bằng `hooks.mjs` — chép từ gói E, `@p2c/ui` → `ui-stub.mjs`):

- `list.mjs` → `list.log` — danh sách file gói F theo `classifyFile` (84 file, 3 761 / 11 263 / 4 628).
- `p1-eval-key.mjs` → `p1-eval-key.log` (CL-F1): `evalMain` với `fetch` giả, key giả, file trong bộ nhớ.
- `p2-undo.mjs` → `p2-undo.log` (xóa rồi khôi phục 25 bản ghi mỗi loại trên dữ liệu tải, so `reportRows` + bảng); `p3-undo-detail.mjs` → `p3-undo-detail.log`.
- `p4-keep-stage-A.mjs` → `p4-keep-stage-A.log` (CL-F2 ca dựng tay); `p4b-keep-stage-count.mjs` → `p4b-keep-stage-count.log` (CL-F2 đếm trên dữ liệu tải + 150 ca kiểm bằng lệnh thật). Bản đầu của p4 (vòng xóa → `listTrash` cho cả 4 254 cuộc gặp) chạy quá 10 phút vì Thùng rác lớn dần, đã dừng (`TaskStop`) sau phần A; phần B thay bằng p4b.
- `p4c-odd.mjs` → `p4c-odd.log`, `p4d-raw.mjs` → `p4d-raw.log`, `p10-manual-backdate.mjs` → `p10-manual-backdate.log` (CL-F3).
- `p5-perf.mjs` → `p5-perf.log` (mục 4b).
- `p6-stage-consistency.mjs` → `p6-stage-consistency.log`, `p8-invariants.mjs` → `p8-invariants.log` (§6 C, D).
- `p7-seed-keep.mjs` → `p7-seed-keep.log` (tìm KH trong seed demo của bản web để thao tác CL-F2 trên màn).
- `p9-error-keys.mjs` → `p9-error-keys.log` (mã lỗi ↔ câu i18n).
- `exports-f.mjs` → `exports-f.log`; `dup-scan.mjs` → `dup-scan.log`; `dup-scan-struct.mjs` → `dup-scan-struct.log` (≥ 60 token), `dup-scan-struct-35.log` (≥ 35 token).
- `bundle\split-build.mjs` → `bundle\split-build.log` (+ `split-build.raw.log`, đầu ra build ở `bundle\out\`).
- `serve.mjs` + `web\` (bản chép `apps/desktop/dist` của bước chuẩn bị, trùng byte với `claude\E\web` — `cmp` khớp — không có ngày neo e2e). Thao tác trên trang qua khung trình duyệt của Claude Code (`javascript_exec`): đổi góc nhìn sang RE Trần Văn Tuấn, mở hồ sơ Trần Hoài Hương, Lịch hẹn tháng 06/2026, xóa cuộc gặp 10/06 19:30, mở Cài đặt → Thùng rác. Dữ liệu chỉ trong bộ nhớ của trang; server dừng và thẻ trình duyệt đóng trước khi xong phiên.
- `mutate.mjs` (= `mutate-head.part.mjs` + runner chép từ gói E `mutate-runner.part.mjs`) → `mutate.log`, `mutate-results.json`; bản gốc trước đột biến ở `orig\`.
- `draft-sections.md`, `sections-5-7.md` — bản nháp các mục của báo cáo này (không phải bằng chứng).

**Đột biến** (`mutate.mjs`, 14/10/2026 22:10–22:18: patch một file `tools/*-core.mjs` trong worktree, chạy `vitest run tools --bail=1` (258 test), sống thì chạy cả bộ vitest; trả file về từng byte, so `git show HEAD:` trước / sau). 50 đột biến:

- `pr-core.mjs` P1–P26, `session-core.mjs` S1–S11, `review-hint-core.mjs` H1–H2, `load-data-core.mjs` L1–L2, `codemap-core.mjs` C1–C2, `size-report-core.mjs` Z1–Z2, `eval-ai-core.mjs` E1–E5.
- **Sống (5):** P3, P5, S3, S9 → CL-F4; P4 (gần tương đương: PR không có file nào vẫn bị chặn vì không có CI).
- **Bị giết (45):** P1, P2, P6–P26, S1, S2, S4–S8, S10, S11, H1, H2, L1, L2, C1, C2, Z1, Z2, E1–E5. Tên test giết từng đột biến ở `mutate.log`.
- Dòng cuối `mutate.log`: `git status --short after: ""`.

Tổng đột biến của cả lượt (Claude): A 59 (4 sống), B 57 (5), C 97 (5), D 65 (8, 3 có e2e giữ), E 84 (3), F 50 (5) — 412 đột biến, 30 sống; 18 cái sống thành phát hiện T (CL-A4, A5, A7, B2, C7, D4, E6, F4) hoặc phần của phát hiện khác (A6 trong CL-C6); 12 còn lại tương đương, có e2e giữ hoặc KNOWN (#541).

**Tác dụng phụ ngoài repo:** không mở exe, không chạy `pnpm e2e`, không gọi dịch vụ AI, không đọc key; một lần `vite build` tạm của repo ra `claude\F\bundle\out\` (cache Vite trong `node_modules/.vite` của repo, bị ignore); `vitest` của `tools` tạo rồi xóa clone tạm của `session-end.test.mjs` trong `%TEMP%`.

**`git status --short` cuối phiên** (14/10/2026 22:19): rỗng; `git rev-parse HEAD` → `885534549808f42aec7f9af5743bbf86642ee4bd`. Cổng 4330 không còn tiến trình nghe.

**Giờ xong:** 14/10/2026 22:21 (+07:00).

## 8. Kết luận cho v1.0 ở SHA `8855345` (Claude, tham khảo — kết luận thật ở phiên tổng hợp)

**CHƯA SẴN SÀNG.**

Lý do:

1. Tiêu chí phát hành `docs/design/phase-6-hoan-thien.md:14` (mục 3): "mọi phát hiện từ Medium trở lên đã sửa". CL-F2 là Medium: xóa một cuộc gặp Đã gặp giữ nhóm — thao tác thường, hộp 6g và màn Thùng rác hứa "khôi phục được" / "Khôi phục đưa bản ghi về như trước" — thì 2 690 / 4 254 cuộc gặp như vậy trên dữ liệu tải (63 %) không khôi phục lại được, kể cả ngay sau khi xóa. Sửa nhỏ (≈ 15 dòng SP + test, cần Owner chốt thêm một ca vào bảng E của spec) và nên sửa chung với CL-F3, CL-A2, CL-E4 (cùng gốc "nhóm sau so với nhóm hiện tại").
2. Không có Critical / High trong sáu báo cáo của Claude (A–F: 0 / 0). Các cổng ở SHA ghim xanh (`baseline.md`: verify 2 755 test, Rust 91, e2e 210, coverage ≥ ngưỡng từng vùng). Hiệu năng trên dữ liệu tải đạt mọi ngưỡng đã chốt (exe `perf-ref.json`; hàm thuần Phase 4 ở mục 4b); chỉ CL-A1 vượt khi Thùng rác giữ ≥ 100 KH đã xóa.
3. Các mục Low / Nit cần Owner quyết trước G7 (sửa / hoãn / chấp nhận): ba dòng nghiệm thu sẽ đỏ theo đúng chữ của danh mục (CL-D2 NT-HS-05, CL-D3 NT-HS-08, CL-E1 NT-TQ-22); mâu thuẫn giữa tài liệu đã duyệt (CL-C2 mockup mờ 50 % ↔ ADR-0013 AA, CL-E5 cách viết tỉ lệ); họ "nhóm sau" (CL-A2, CL-E4, CL-F3); key trong script eval (CL-F1, công cụ dev, không thuộc exe).

Nếu CL-F2 được sửa (và Owner quyết các Low trên), phần Claude thấy không còn gì chặn v1.0.
