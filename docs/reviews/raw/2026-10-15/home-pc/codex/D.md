XONG — codex gói D, 2026-10-13 23:43:04 +07:00

# Deep review Phase 1–6, lượt 1 — Codex, Gói D

## 1. Thông tin phiên

- Bên: Codex; Gói D — Màn nhập liệu. Phiên làm mới, không phải phiên nối tiếp.
- SHA đầu và cuối: 885534549808f42aec7f9af5743bbf86642ee4bd (8855345).
- Bắt đầu: 2026-10-13 23:08:01 +07:00. Kết thúc: 2026-10-13 23:43:04 +07:00; Asia/Bangkok.
- Máy: DESKTOP-KDURKJP (Home PC); Node v24.20.0, pnpm 12.6.0.
- Bước 0: D.md chưa tồn tại; A/B/C có đủ, dòng đầu không ĐANG LÀM. Chỉ đọc dòng đầu A/B/C để kiểm gói; không đọc nội dung báo cáo các gói đó.
- Gói D: 73 file code, 6.820 dòng SP + 1.748 dòng test; tất cả file trong bảng dưới đã đọc. Báo cáo có 3 phát hiện mới Low/C, đều CONFIRMED; 0 Critical/High/Medium.
- git status --short đầu phiên (cuối phiên giống hệt):

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

## 2. Phạm vi đã đọc

Tài liệu: common/prompt-codex.md, plan.md §1/3/4/5/6/10, known.md (OPEN/ACCEPTED, K1–K17), baseline.md, perf/perf-ref.json; CLAUDE.md gốc và của app/ui, CONTEXT.md; .claude/rules/{mockups,i18n-ui,tests}.md; spec Phase 3/4, Phase 6 §4.1/4.2/5.2; mockup README, customers.html, customer.html, customer-forms.html, kyc-forms.html, team.html, phase-3-feedback.html B1–B2 (B3 đọc nối luồng RE), trash.html (đặc biệt 11f/11g), table-more.html. ADR-0008 §7 đối chiếu material và KYC; docs/metrics/phase-6.md dùng ngưỡng, không so số đo Office Laptop với Home PC.

Đọc nối gói khi cần: AppDataContext.tsx, tables.ts; db backup/database/index/team/appointments/kyc, domain kyc-catalog/kyc-fact và helper ngày qua cây import; Settings/SettingsTrash/FilterBar/applied-filter cho điều hướng và xác nhận; e2e customer-kyc/team/data-table cho chất lượng seam. Đọc size-report-core.mjs, e2e/serve.mjs, e2e/perf/README.md, cấu hình Vite/Vitest/Playwright và manifest để dựng phép đo bằng công cụ sẵn có. Không cài dependency mới.

Các file code D (dòng ở SHA ghim; bản TSV là D/scope.tsv):

| File | Dòng đã đọc |
|---|---:|
| apps/desktop/index.html | 1–13 |
| apps/desktop/src/App.tsx | 1–18 |
| apps/desktop/src/i18n/index.test.ts | 1–141 |
| apps/desktop/src/i18n/index.ts | 1–132 |
| apps/desktop/src/i18n/vi.ts | 1–1198 |
| apps/desktop/src/index.css | 1–2 |
| apps/desktop/src/main.tsx | 1–47 |
| apps/desktop/src/routes/Screen.tsx | 1–21 |
| apps/desktop/src/routes/customers/CustomerAppointments.tsx | 1–154 |
| apps/desktop/src/routes/customers/CustomerDialogs.tsx | 1–495 |
| apps/desktop/src/routes/customers/CustomerKyc.tsx | 1–286 |
| apps/desktop/src/routes/customers/CustomerProfile.tsx | 1–277 |
| apps/desktop/src/routes/customers/CustomersScreen.test.tsx | 1–11 |
| apps/desktop/src/routes/customers/CustomersScreen.tsx | 1–252 |
| apps/desktop/src/routes/customers/KycDialogs.tsx | 1–500 |
| apps/desktop/src/routes/customers/customers-view.test.ts | 1–243 |
| apps/desktop/src/routes/customers/customers-view.ts | 1–159 |
| apps/desktop/src/routes/customers/kyc-view.test.ts | 1–402 |
| apps/desktop/src/routes/customers/kyc-view.ts | 1–254 |
| apps/desktop/src/routes/team/PersonDialogs.tsx | 1–202 |
| apps/desktop/src/routes/team/TeamDialogs.tsx | 1–95 |
| apps/desktop/src/routes/team/TeamScreen.tsx | 1–316 |
| apps/desktop/src/routes/team/team-view.test.ts | 1–129 |
| apps/desktop/src/routes/team/team-view.ts | 1–119 |
| apps/desktop/src/shell/AppShell.tsx | 1–60 |
| apps/desktop/src/shell/CloseGuard.tsx | 1–82 |
| apps/desktop/src/shell/ErrorBoundary.tsx | 1–49 |
| apps/desktop/src/shell/RePicker.tsx | 1–88 |
| apps/desktop/src/shell/SaveWarning.tsx | 1–15 |
| apps/desktop/src/shell/ScopeContext.tsx | 1–24 |
| apps/desktop/src/shell/ScopePicker.tsx | 1–61 |
| apps/desktop/src/shell/Sidebar.tsx | 1–58 |
| apps/desktop/src/shell/StartupError.tsx | 1–18 |
| apps/desktop/src/shell/block-reload.test.ts | 1–66 |
| apps/desktop/src/shell/block-reload.ts | 1–41 |
| apps/desktop/src/shell/close-guard.test.ts | 1–118 |
| apps/desktop/src/shell/close-guard.ts | 1–35 |
| apps/desktop/src/shell/routes.test.ts | 1–93 |
| apps/desktop/src/shell/routes.ts | 1–77 |
| apps/desktop/src/shell/scope.test.ts | 1–157 |
| apps/desktop/src/shell/scope.ts | 1–75 |
| apps/desktop/src/shell/screen-error.test.ts | 1–21 |
| apps/desktop/src/shell/screen-error.ts | 1–17 |
| apps/desktop/src/shell/startup-error.test.ts | 1–53 |
| apps/desktop/src/shell/startup-error.ts | 1–36 |
| apps/desktop/src/shell/useRoute.ts | 1–45 |
| apps/desktop/src/ui-choices.test.tsx | 1–30 |
| packages/ui/src/components/Button.tsx | 1–28 |
| packages/ui/src/components/Chart.tsx | 1–68 |
| packages/ui/src/components/Choices.tsx | 1–75 |
| packages/ui/src/components/DataTable.tsx | 1–205 |
| packages/ui/src/components/Dialog.tsx | 1–82 |
| packages/ui/src/components/NavIcon.tsx | 1–63 |
| packages/ui/src/components/PeriodPicker.label.test.ts | 1–26 |
| packages/ui/src/components/PeriodPicker.label.ts | 1–21 |
| packages/ui/src/components/PeriodPicker.tsx | 1–183 |
| packages/ui/src/components/PolicyBadge.tsx | 1–13 |
| packages/ui/src/components/Segmented.tsx | 1–64 |
| packages/ui/src/components/SelectField.tsx | 1–87 |
| packages/ui/src/components/StageBadge.tsx | 1–22 |
| packages/ui/src/components/TextField.tsx | 1–89 |
| packages/ui/src/components/chart-theme.test.ts | 1–47 |
| packages/ui/src/components/chart-theme.ts | 1–57 |
| packages/ui/src/components/compare-cells.test.ts | 1–50 |
| packages/ui/src/components/compare-cells.ts | 1–38 |
| packages/ui/src/components/show-more.test.ts | 1–53 |
| packages/ui/src/components/show-more.ts | 1–25 |
| packages/ui/src/fonts.css | 1–140 |
| packages/ui/src/index.ts | 1–17 |
| packages/ui/src/theme.css | 1–76 |
| packages/ui/src/token-guard.test.ts | 1–108 |
| packages/ui/src/token-guard.ts | 1–77 |
| packages/ui/src/tokens.css | 1–69 |

## 3. Phát hiện

Các đường D\ trong phần bằng chứng/phụ lục đều là C:\workspace\deep-review-1-6\codex\D\. Các vị trí code thuộc worktree C:\workspace\Project-2C-review-2\ ở SHA 8855345.

### CX-D1 — Dòng thời gian bỏ nhãn thay đổi quan trọng đã lưu

ID: CX-D1
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/customers/CustomerKyc.tsx:273–278 (8855345); đối chiếu docs/design/mockups/customer.html:328,344; test đang cố định hành vi thiếu nhãn ở e2e/customer-kyc.spec.ts:104.
Tình trạng: CONFIRMED
Mô tả: Dòng phiên bản KYC chỉ hiện tóm tắt và kyc vN, không đọc event.version.material. Các phiên bản material đã lưu vì thế không hiện nhãn thay đổi quan trọng như mockup đã duyệt.
Tái hiện / bằng chứng: node C:\workspace\deep-review-1-6\codex\D\ui-chain.mjs; log ui-chain.log: TIMELINE-MATERIAL-LABEL 0; SAVED-VERSIONS [{"seq":1,"material":1},{"seq":2,"material":1},{"seq":3,"material":1},{"seq":4,"material":1}]. Tạo KH, thêm số con 0, tạo mâu thuẫn 0/1, giải quyết, đổi đủ ngày sinh trong cùng năm rồi xuất backup. Ảnh kyc-chain.png; backup chain.p2cbackup. Các lệnh đều thành công, PAGEERRORS [].
Ảnh hưởng: RE đọc lịch sử không phân biệt được các lần thay đổi quan trọng với thay đổi phụ; dữ liệu, phiên bản và guardrail AI vẫn đúng. Chỉ sai hiển thị nên Low.
Đề xuất: hiện badge theo event.version.material bằng khóa timeline.material sẵn có; < 20 dòng SP, bổ sung e2e có một phiên bản material và một phiên bản không material; sửa assertion timeline đang ghi cứng việc không có badge. Không sửa mockup.

### CX-D2 — Hộp xóa nhân sự bỏ sót vai trò người đánh giá và hướng dẫn sai vai trò

ID: CX-D2
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/team/team-view.ts:103–118, apps/desktop/src/routes/team/PersonDialogs.tsx:143,169–190; apps/desktop/src/i18n/vi.ts:1114–1115 (8855345). Ranh giới DB: packages/db/src/team.ts:249–272.
Tình trạng: CONFIRMED
Mô tả: personUsage không đếm outcomeReviewerId. IS chỉ đánh giá kết quả (không phối hợp và không là RE) được hiện hộp xác nhận xóa với nút Xóa bật; sau khi bấm, lỗi PERSON_IN_USE lại yêu cầu Giữ vai trò RE dù người đó là IS và phải bỏ người đánh giá trước.
Tái hiện / bằng chứng: node C:\workspace\deep-review-1-6\codex\D\node-probe.mjs tạo IS và cuộc hẹn MET qua createPerson/scheduleAppointment/recordMeetingOutcome; REVIEWER-PERSON-USAGE {"customers":0,"appointments":0,"policies":0,"coordinating":0}; REVIEWER-DELETE-ERROR PERSON_IN_USE. node C:\workspace\deep-review-1-6\codex\D\reviewer-ui.mjs nhập reviewer-only.p2cbackup qua UI, mở Team → Sửa CX-D Reviewer only → Xóa nhân sự: DELETE-ENABLED true; AFTER chứa Giữ vai trò RE, hoặc giữ lại thay vì xóa; DELETE-DISABLED-AFTER true. Nguồn/log/ảnh ở D\reviewer-ui.mjs, reviewer-ui.log, reviewer-only.png.
Ảnh hưởng: người dùng không được báo chính xác nhân sự đang đánh giá cuộc hẹn nào / loại tham chiếu nào chặn xóa, được hướng dẫn giữ vai trò không đúng. DB chặn xóa đúng nên không mất dữ liệu; Low vì sai báo trước và câu hiển thị, không nâng thành lỗi dữ liệu.
Đề xuất: thêm số cuộc hẹn đang đánh giá vào PersonUsage và hộp 9b; thông báo PERSON_IN_USE cho hỗ trợ nêu việc bỏ người đánh giá ở Sửa kết quả, không khuyên giữ RE. < 80 dòng SP trong team-view.ts/PersonDialogs.tsx/vi.ts, test người chỉ đánh giá (0 ở các vai trò khác). Không đổi luật DB.

### CX-D3 — Đổi team không đưa bảng về 100 dòng

ID: CX-D3
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/team/TeamScreen.tsx:304–310 (8855345), packages/ui/src/components/DataTable.tsx:104–110; hợp đồng docs/design/mockups/table-more.html:49.
Tình trạng: CONFIRMED
Mô tả: DataTable của bảng thành viên không nhận resetKey theo team, nên giới hạn Hiện thêm của team trước được giữ khi đổi team. Mockup yêu cầu đổi bộ lọc quay về 100 dòng và ghi rõ áp dụng cả bảng Team.
Tái hiện / bằng chứng: node C:\workspace\deep-review-1-6\codex\D\team-more-data.mjs tạo hai team 201/151 RE qua createTeam/createPerson, xuất backup; node C:\workspace\deep-review-1-6\codex\D\team-more-ui.mjs nhập file qua UI, mở Team A → Hiện thêm → Team B. Log: TEAM-A-INITIAL 100; TEAM-A-AFTER-MORE 200; TEAM-B-AFTER-SWITCH 151; FOOT Đã hiện hết 151 người; TEAM-B-AFTER-REMOUNT 100. Cần rời màn rồi vào lại mới reset. D\team-more-ui.log, team-more.png, team-more.p2cbackup.
Ảnh hưởng: team có hơn 100 RE được mở ở số dòng đã tăng của team khác; số đếm/dữ liệu vẫn đúng. Đây là sai hành vi phân trang hiển thị ở bộ dữ liệu lớn, Low; không coi là phát hiện hiệu năng vì fixture này không phải bộ tải chung và chưa đo độ trễ.
Đề xuất: truyền resetKey={entry.team.id} cho DataTable; 1–3 dòng SP, thêm e2e hai team >100 RE kiểm đổi team về 100 và sắp cột vẫn giữ số dòng. Giữ quy tắc Hiện thêm K4, không ảo hóa.

Lưu ý nguồn CX-D3: reset khi đổi bộ lọc được ghi ở thiết kế T-150 table-more.html:49 và API DataTable.tsx:57–58; Owner đã chốt Hiện thêm 100 dòng (KNOWN K4), chức năng đã có trong exe Phase 4. README mockup vẫn ghi Chờ duyệt (T-150), nên báo cáo không khẳng định metadata G3 của file này đã được cập nhật. Hành vi 200 → 151 thay vì 100 được probe xác nhận độc lập.

## 4. Bloat

Không có phát hiện B mới có chi phí đo được trong phạm vi D. Các mục lặp đã có ở KNOWN (badge, role RE/TL, lọc reId…) không có bằng chứng mới nên không tạo lại ID. Chưa đề xuất refactor mới; nếu sửa ba phát hiện C, cỡ và seam giữ hành vi ghi ngay tại từng phát hiện.

| Đã chạy / đọc | Dữ liệu | Kết quả / số | ID |
|---|---|---|---|
| tsc --noEmit --noUnusedLocals --noUnusedParameters | app và ui tsconfig, SHA ghim | Hai lệnh exit 0; hai cờ vốn đã bật trong tsconfig.base.json | — |
| pnpm codemap:check + đọc bản đồ export/route | app/ui CLAUDE.md | Export maps are up to date | — |
| Quét AST import/export + rg tra tên ở nguồn | toàn bộ source TS/TSX/MJS theo git; xét các export D | 146 khai báo export; 19 không có named importer đều là type/interface; không phát hiện runtime export chết | — |
| Quét i18n literal + tiền tố dynamic, tra rg | 1.085 khóa vi.ts, source/test trong repo | 0 ứng viên không dùng; phép quét bảo thủ, không chứng minh mọi khóa được chạy | — |
| pnpm lint:deps | 309 modules / 1.244 dependencies | 0 vi phạm; các dependency ui được dùng (React, domain, TanStack Table, ECharts) | — |
| pnpm lint:tokens; đọc CSS/token/font/component | app + components ui | 0 styling bypass; 12 font woff2 nội bộ, không cần font mạng | — |
| pnpm build:web; node tools/size-report.mjs --json | build production cuối, không VITE_DEMO_ANCHOR | 1.093 modules; JS/CSS 2.364.283 byte, gzip 697.071 byte, bằng baseline | — |

Chi tiết bundle (gzip bằng helper size-report/gzipSync, khác cột ước tính gzip của Vite):

| Chunk | Byte thô | Byte gzip | Δ với baseline thô/gzip |
|---|---:|---:|---:|
| assets/chart.js | 513302 | 172450 | 0 / 0 |
| assets/exceljs.min.js | 929569 | 255572 | 0 / 0 |
| assets/index.css | 28364 | 6412 | 0 / 0 |
| assets/index.js | 891942 | 262010 | 0 / 0 |
| assets/rolldown-runtime.js | 1106 | 627 | 0 / 0 |
| Tổng JS/CSS | 2364283 | 697071 | 0 / 0 |
| Tệp khác: 15 font/wasm/HTML… | 849196 | — | 0 |

Không build hoặc đo exe trong D; exe tham chiếu common/exe/project2c.exe có 5.414.400 byte theo baseline. Lượt build probe neo 12/10 có thêm snapshot demo và 10 byte literal ngày trong index, đã build lại production ở cuối; đó là cấu hình probe, không là bloat sản phẩm. Giữ size.json và build.log để tái kiểm.

## 4b. Hiệu năng

Nguồn node-probe.mjs --perf-only, node-perf-final.log, node-perf.json. Nhập đúng bộ common/load/load-2026-10-12-seed6.p2cbackup bằng importBackup của db, đồng hồ neo 12/10/2026. Dữ liệu tổng 1.496 KH / 10.414 lịch / 54 người; dữ liệu sống phép đo: 1.481 KH / 10.252 lịch / 51 người / 4 team / 1.674 HĐ / 4.883 chuyển nhóm. KH nhiều lịch nhất có 38 lịch, 10 facts, 6 notes, 10 phiên bản.

Home PC DESKTOP-KDURKJP. Đo chốt sau khi đã dừng preview 4317, không chạy build/test/browser song song trong phiên này; tải CPU của phiên khác/ngoài phiên không được kiểm soát. Warmup 10; 100 lần mỗi hàm, đường đọc hồ sơ 30 lần. Đường đọc hồ sơ dùng đúng sortedByName và tái dùng transitions như CustomerProfile.tsx; lượt đo nháp trước đó có thêm một lần đọc transitions, giữ trong progress.md/node-probe.log để không che lịch sử probe.

| Phép đo | Lần | Trung vị ms | Min–max ms | ID P |
|---|---:|---:|---:|---|
| customerBoard.all | 100 | 1,307 | 1,222–3,749 | — |
| customerBoard.team | 100 | 0,374 | 0,363–0,707 | — |
| staffMetrics.44-RE | 100 | 5,900 | 5,637–7,018 | — |
| groupByTeam | 100 | 0,003 | 0,003–0,027 | — |
| reOptions | 100 | 0,022 | 0,021–0,056 | — |
| kycOverview.max-appointments-profile | 100 | 0,003 | 0,002–0,029 | — |
| kycTimeline.max-appointments-profile | 100 | 0,013 | 0,013–0,034 | — |
| readProfile.copy | 30 | 8,611 | 8,183–12,192 | — |
| importBackup, chuẩn bị bộ tải | 1 | 849,097 | — | — |

Không có phát hiện P từ phép đo trên. Các số hàm thuần/SQL không phải thời gian từ click tới khung hình, nên không dùng để khẳng định riêng UI đạt 200 ms. Tham chiếu UI cùng Home PC do bước chuẩn bị đã đo: customers.view-table 17,9 ms, customers.sort-name 22,1 ms, customer.open-ai 19,6 ms; tất cả dưới 200 ms. Không chạy lại exe/probe toàn bộ trong D (plan §6 cho phép dùng số chuẩn bị); không so với Office Laptop.

Fixture team-more 201/151 RE chỉ để xác nhận hành vi CX-D3; không dùng nó để đưa ra phát hiện P. readProfile đọc cả bảng policies và staffMetrics quét dữ liệu theo RE đã được xét, hiện 8,611 ms / 5,900 ms trên bộ tải, chưa có bằng chứng nút thắt cần refactor.

## 5. Bảng đếm mức × trục

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

CONFIRMED 3/3; PLAUSIBLE 0/3 (0%); KNOWN không có ID mới. Các test hở được nêu cùng phát hiện C tương ứng, không đếm lại thành phát hiện T.

## 6. Các trục đã xét

| Trục | Đã đọc / chạy và kết quả |
|---|---|
| E | Đã xét, không thấy lỗi mới ngoài các sai hiển thị C. Unit kiểm rỗng, trần năm, ngày sai, ngắn năm, nhóm đóng; UI thử ngày sinh 29/02/2000, đổi đủ ngày cùng năm, Unicode NFD, số con 0, boolean false, cùng giá trị, mâu thuẫn rồi giải quyết; kiểm bảng >100 dòng bằng fixture hợp lệ. |
| C | Đối chiếu form 5a–5f, 7a–7e, Team B1/B2, nhãn RE dùng chung, Xóa KH 11f và Hiện thêm. Có CX-D1–D3. Các lệch đã KNOWN không có bằng chứng mới nên không báo lại. |
| D | Đã xét, không thấy sai/mất dữ liệu mới: ui-chain ghi 0/false, xác nhận lại không tăng version, đổi đủ ngày sinh cùng năm không tăng version; tạo/giải quyết conflict; xóa/khôi phục cho nội dung KYC giống hệt; backup lưu bốn material=1; reviewer bị DB chặn xóa đúng. Đây là kiểm luồng nối D→db→Thùng rác→backup, không thay review toàn bộ db/Rust. |
| G | Đã xét phần UI của D, không thấy guardrail mới: trường birthYear/gender chỉ chỉnh hồ sơ, NOTE_FIELDS bỏ hai trường; proposal chỉ lưu khi RE xác nhận; currentFacts/preview dùng domain; conflict core đưa cổng CONFLICT_RESOLUTION, giải quyết trở lại PROFILE_DISCOVERY. Không gọi AI thật, không mở ChatGPT, không đọc key. Validator/prompt thuộc C. |
| S | Đã xét, không thấy ranh giới mới: tên chứa chuỗi img/onerror được chuẩn hóa NFC và render chữ, main có 0 img; React render KYC và lỗi dạng text, route encode/decode có test malformed/Unicode; font local. Không dùng dangerouslySetInnerHTML trong các file D. CSP/key/network thuộc B/C, không kết luận thay các gói đó. |
| P | Đã xét, không thấy qua bảng đo §4b; customerBoard, staffMetrics, reOptions, kycOverview/timeline, đường đọc profile trên bộ tải chung. Chưa đo lại exe, giới hạn phép đo đã nêu. |
| B | Đã xét, không thấy bloat mới có chi phí đo: tsc noUnused sạch, 146 export, 1.085 i18n keys, codemap/deps/tokens sạch; build/chunk bằng baseline. Các 19 type không importer không sinh byte runtime; các lặp đã KNOWN giữ nguyên. |
| T | Đã xét, không thấy vấn đề test mới ngoài seam bỏ sót đi cùng C: 17 file/133 test xanh, 3 đột biến bị giết thật; đọc assertions KYC timeline/Team và helper tests. Baseline chung 210 e2e passed, không chạy lại pnpm e2e. UI chain và keyboard probe riêng không tính là suite e2e chính thức. |
| A | Đã xét, không thấy mới ngoài câu hướng dẫn sai CX-D2: ariaSnapshot cho form/radio có tên, required/error/describedby; Escape trả focus + Khách hàng; 24 Tab/Shift+Tab không focus control nền; hai lần activeElement BODY ở vòng Tab, dialog vẫn :modal (không suy là escape vào control app). Arrow chọn Bảng/Team, RE chọn từ Khách hàng còn đúng ở Lịch hẹn, sort giữ 200 dòng; html lang=vi. Chart thiếu số liệu và viền tương phản thấp đã KNOWN, không có bằng chứng mới. Không dùng axe hoặc thêm công cụ. |

## 7. Phụ lục nguồn / probe và kết thúc

Chạy các script dưới bằng Node v24.20.0, từ worktree hoặc dùng đường dẫn tuyệt đối C:\workspace\deep-review-1-6\codex\D\<file>. Các probe UI cần server production riêng 4317, build neo 12/10/2026; server đã dừng sau kiểm. Muốn tái chạy: E2E_PORT=4317, VITE_DEMO_ANCHOR=12/10/2026, node e2e/serve.mjs (PowerShell gán $env); không dùng PW_REUSE và không đụng cổng 4173.

| Nguồn | Bằng chứng / log |
|---|---|
| ui-smoke.mjs | ui-smoke.log, customers.png, team.png: nhập bộ tải qua UI; form rỗng 2 lỗi, autofocus/return focus; PAGEERRORS [] |
| ui-chain.mjs | ui-chain.log, kyc-chain.png, chain.p2cbackup: NFC/HTML chữ, 0/false, reconfirm/conflict/resolve, delete/restore, material flags đối chiếu |
| hooks.mjs, node-probe.mjs | node-probe.log cho reviewer-only; node-perf-final.log/node-perf.json cho số chốt, --perf-only giữ nguyên fixture reviewer |
| reviewer-ui.mjs | reviewer-ui.log, reviewer-only.png, reviewer-only.p2cbackup: nhãn IS, Xóa bật, lỗi giữ RE sai |
| team-more-data.mjs, team-more-ui.mjs | team-more-data.log, team-more-ui.log, team-more.png, team-more.p2cbackup: 100→200→151; remount về 100 |
| keyboard-ui.mjs | keyboard-ui.log: Tab/Shift+Tab, Escape, Arrow, sort giữ số dòng, RE giữa hai màn, lang vi |
| bloat.mjs | bloat.log/bloat.json/scope.tsv: AST imports, i18n, inventory |
| mutation-run.mjs + mutations/ | mutations.log; từng thư mục M1/M2/M3 chứa bản chép code/test/config/result.log; bảng dưới |
| Lệnh toolchain sẵn có | unit.log (17/133), build.log, size.json, tokens.log; noUnused, lint:deps, codemap:check xem log phiên |
| progress.md | Bản báo cáo ghi dần trước khi sắp lại cuối phiên; giữ lịch sử các lỗi harness đã sửa |

| Đột biến ngoài repo | Kết quả cuối | Trạng thái |
|---|---|---|
| M1 đảo thứ tự ngày của board | 2 failed / 14 passed (16) | Bị giết |
| M2 hiện cả facts superseded | 2 failed / 17 passed (19) | Bị giết |
| M3 cửa sổ 31 thay 30 ngày | 1 failed / 5 passed (6) | Bị giết |

0 đột biến sống trong ba ca này. Không suy độ bao phủ đột biến toàn bộ D từ ba phép thử. M2 ban đầu lỗi alias và chưa chạy test, sau sửa harness mới có hai assertion đỏ thật. Probe ban đầu nhầm nhãn nút bản web, loại textbox/searchbox và dùng goto khiến DB web bị nạp lại; đã sửa selector/điều hướng nội bộ, chạy lại xanh. Lượt đếm Team đầu chưa chờ bảng nên thấy 0; bản chốt có expect 100 rồi mới thao tác. Các lỗi harness không được tính là lỗi sản phẩm.

Ảnh customers/team đã xem trực quan; kết luận CX-D1–D3 dựa vào DOM log và đối chiếu dữ liệu, không dựa chỉ vào ảnh. Không patch repo, không commit, không Issue/PR/merge; không đọc/ghi thư mục reviewer khác, không đọc báo cáo của bên khác cho đợt này, không cài công cụ, không gọi dịch vụ AI/key thật. Chỉ tạo file báo cáo/probe/log/fixture trong codex/D và build/cache bị ignore trong worktree.

git rev-parse HEAD cuối: 885534549808f42aec7f9af5743bbf86642ee4bd. git diff --stat và git diff --cached --stat rỗng. git status --short cuối:

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

Kết thúc: 2026-10-13 23:43:04 +07:00. Gói kế tiếp: E, phiên mới. Không kết luận phát hành ở Gói D.
