XONG — codex gói F, 2026-10-14 21:52:04 +07:00

# Deep review Phase 1–6, lượt 1 — Codex, Gói F

## 1. Thông tin phiên

- Bên: **codex**, ID **CX**; gói **F — Xuyên gói, bloat / hiệu năng, công cụ**.
- Repo: `C:\workspace\Project-2C-review-2`, detached HEAD.
- SHA đầu và cuối: **885534549808f42aec7f9af5743bbf86642ee4bd** (`8855345`).
- Bắt đầu: **2026-10-14 00:39:32 +07:00**, Asia/Bangkok; kết thúc: **2026-10-14 21:52:04 +07:00**.
- Máy: **DESKTOP-KDURKJP**, Intel Core i9-12900K; Node **24.20.0**, pnpm **12.6.0**.
- F chưa có khi mở phiên; A–E có đủ và đã hoàn tất. **Làm tiếp phần dở khi Owner nhắn “tiếp tục phần đang làm dở”**: tiếp tục từ F.md đã ghi CX-F1/F2, log công cụ/build/bloat/perf/mutation và cross-flow đã chạy xong; bổ sung các khoảng đọc còn thiếu, phạm vi/phụ lục và kết luận. Giữ nguyên phát hiện và số đo đã có, không chạy lại toàn lượt review.

`git status --short` đầu phiên, nguyên văn:

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

Không sửa nguồn/config/tài liệu trong repo, không commit/PR/Issue/merge, không dùng subagent, không làm nghi thức phiên hoặc gọi skill. Chỉ đọc repo ghim, `common/`, và kết quả của Codex. Không đọc/liệt kê/tìm kiếm thư mục kết quả hoặc báo cáo của bên khác. `.claude/**` trong repo được đọc như nguồn của gói F, không thực thi hook/skill. AI dùng Mock, Response/fetch giả và key tự tạo; không gọi AI sản phẩm, mở ChatGPT, hoặc đọc key thật. Probe/bản chép/log chỉ ở `C:\workspace\deep-review-1-6\codex\F\`.

## 2. Phạm vi đã đọc

Đọc sâu từng nguồn/test được luật `classifyFile` xếp F: **84 file, 3.761 dòng SP + 11.263 dòng test + 4.628 dòng lockfile sinh tự động**. Bảng dưới ghi dòng vật lý của SHA ghim; các lượt đọc bị cắt output được đọc bù theo khoảng. Lockfile được đọc đầu importer/dependency và quét toàn file để kiểm metadata/hash; không coi 4.628 dòng generated là 4.628 dòng logic đã review thủ công.

| File ghim | Dòng đã đọc / quét | Loại |
|---|---|---|
| `.claude/hooks/handoff-context.mjs` | 1–25 | đọc toàn product |
| `.claude/hooks/review-pr-hint.mjs` | 1–29 | đọc toàn product |
| `.dependency-cruiser.cjs` | 1–72 | đọc toàn product |
| `.githooks/pre-push` | 1–13 | đọc toàn product |
| `.github/ISSUE_TEMPLATE/config.yml` | 1–1 | đọc toàn product |
| `.github/ISSUE_TEMPLATE/task.yml` | 1–73 | đọc toàn product |
| `.github/workflows/ci.yml` | 1–148 | đọc toàn product |
| `apps/desktop/vite.config.ts` | 1–29 | đọc toàn product |
| `e2e/anchor.ts` | 1–7 | đọc toàn test |
| `e2e/appointment-outcome.spec.ts` | 1–386 | đọc toàn test |
| `e2e/appointments.spec.ts` | 1–890 | đọc toàn test |
| `e2e/backup.spec.ts` | 1–194 | đọc toàn test |
| `e2e/chart.spec.ts` | 1–69 | đọc toàn test |
| `e2e/customer-ai-web.spec.ts` | 1–341 | đọc toàn test |
| `e2e/customer-ai.spec.ts` | 1–790 | đọc toàn test |
| `e2e/customer-appointments.spec.ts` | 1–143 | đọc toàn test |
| `e2e/customer-forms.spec.ts` | 1–268 | đọc toàn test |
| `e2e/customer-kyc.spec.ts` | 1–160 | đọc toàn test |
| `e2e/customer-policies.spec.ts` | 1–166 | đọc toàn test |
| `e2e/customers.spec.ts` | 1–156 | đọc toàn test |
| `e2e/data-table.spec.ts` | 1–182 | đọc toàn test |
| `e2e/demo-data.spec.ts` | 1–71 | đọc toàn test |
| `e2e/dialog-keyboard.spec.ts` | 1–188 | đọc toàn test |
| `e2e/full-cycle.spec.ts` | 1–360 | đọc toàn test |
| `e2e/guide/check.guide.ts` | 1–21 | đọc toàn test |
| `e2e/guide/links.ts` | 1–56 | đọc toàn test |
| `e2e/guide/shots.guide.ts` | 1–213 | đọc toàn test |
| `e2e/navigation.spec.ts` | 1–177 | đọc toàn test |
| `e2e/overview.spec.ts` | 1–234 | đọc toàn test |
| `e2e/perf/probe.perf.ts` | 1–452 | đọc toàn test |
| `e2e/perf/stats.spec.ts` | 1–146 | đọc toàn test |
| `e2e/perf/stats.ts` | 1–212 | đọc toàn test |
| `e2e/period-picker.spec.ts` | 1–301 | đọc toàn test |
| `e2e/reports.spec.ts` | 1–238 | đọc toàn test |
| `e2e/screen-error.spec.ts` | 1–73 | đọc toàn test |
| `e2e/seed-timing.spec.ts` | 1–19 | đọc toàn test |
| `e2e/seeded-snapshot.spec.ts` | 1–56 | đọc toàn test |
| `e2e/seeded-snapshot.ts` | 1–12 | đọc toàn test |
| `e2e/serve.mjs` | 1–43 | đọc toàn test |
| `e2e/settings-ai.spec.ts` | 1–337 | đọc toàn test |
| `e2e/smoke.spec.ts` | 1–36 | đọc toàn test |
| `e2e/support.ts` | 1–303 | đọc toàn test |
| `e2e/team.spec.ts` | 1–380 | đọc toàn test |
| `e2e/theme.spec.ts` | 1–74 | đọc toàn test |
| `e2e/trash.spec.ts` | 1–200 | đọc toàn test |
| `eslint.config.js` | 1–48 | đọc toàn product |
| `packages/ui/scripts/check-tokens.ts` | 1–37 | đọc toàn product |
| `playwright.config.ts` | 1–47 | đọc toàn test |
| `playwright.guide.config.ts` | 1–38 | đọc toàn test |
| `playwright.perf.config.ts` | 1–19 | đọc toàn test |
| `pnpm-lock.yaml` | 1–4628 | generated / metadata |
| `pnpm-workspace.yaml` | 1–7 | đọc toàn product |
| `tools/bootstrap.ps1` | 1–211 | đọc toàn product |
| `tools/codemap-core.mjs` | 1–200 | đọc toàn product |
| `tools/codemap-core.test.mjs` | 1–197 | đọc toàn test |
| `tools/codemap.mjs` | 1–95 | đọc toàn product |
| `tools/eval-ai-core.mjs` | 1–712 | đọc toàn product |
| `tools/eval-ai-core.test.mjs` | 1–1023 | đọc toàn test |
| `tools/eval-ai.mjs` | 1–57 | đọc toàn product |
| `tools/fixtures/ai-eval.mjs` | 1–314 | đọc toàn test |
| `tools/handoff.mjs` | 1–160 | đọc toàn product |
| `tools/load-data-core.mjs` | 1–103 | đọc toàn product |
| `tools/load-data-core.test.mjs` | 1–162 | đọc toàn test |
| `tools/load-data.mjs` | 1–61 | đọc toàn product |
| `tools/merge-pr.mjs` | 1–158 | đọc toàn product |
| `tools/pr-core.mjs` | 1–294 | đọc toàn product |
| `tools/pr-core.test.mjs` | 1–661 | đọc toàn test |
| `tools/pr-status.mjs` | 1–136 | đọc toàn product |
| `tools/retro-core.mjs` | 1–242 | đọc toàn product |
| `tools/retro-core.test.mjs` | 1–169 | đọc toàn test |
| `tools/retro.mjs` | 1–56 | đọc toàn product |
| `tools/review-hint-core.mjs` | 1–27 | đọc toàn product |
| `tools/review-hint-core.test.mjs` | 1–42 | đọc toàn test |
| `tools/session-core.mjs` | 1–120 | đọc toàn product |
| `tools/session-core.test.mjs` | 1–199 | đọc toàn test |
| `tools/session-end.ps1` | 1–78 | đọc toàn product |
| `tools/session-end.test.mjs` | 1–69 | đọc toàn test |
| `tools/session-io.mjs` | 1–14 | đọc toàn product |
| `tools/session-start.ps1` | 1–72 | đọc toàn product |
| `tools/size-report-core.mjs` | 1–358 | đọc toàn product |
| `tools/size-report-core.test.mjs` | 1–299 | đọc toàn test |
| `tools/size-report.mjs` | 1–48 | đọc toàn product |
| `tools/status.mjs` | 1–77 | đọc toàn product |
| `vitest.config.ts` | 1–70 | đọc toàn test |

File F không tính vào cột SP/test, đã đọc thêm:

| File | Dòng đã đọc |
|---|---|
| `.claude/commands/handoff.md` | 1–19 |
| `.claude/commands/session-start.md` | 1–15 |
| `.claude/launch.json` | 1–17 |
| `.claude/rules/ci.md` | 1–17 |
| `.claude/rules/i18n-ui.md` | 1–14 |
| `.claude/rules/mockups.md` | 1–12 |
| `.claude/rules/tests.md` | 1–17 |
| `.claude/settings.json` | 1–43 |
| `.claude/skills/LICENSE-mattpocock-skills` | 1–21 |
| `.claude/skills/README.md` | 1–35 |
| `.claude/skills/grill-me/SKILL.md` | 1–7 |
| `.claude/skills/grilling/SKILL.md` | 1–28 |
| `.claude/skills/review-pr/SKILL.md` | 1–139 |
| `.claude/skills/setup-matt-pocock-skills/SKILL.md` | 1–116 |
| `.claude/skills/setup-matt-pocock-skills/domain.md` | 1–51 |
| `.claude/skills/setup-matt-pocock-skills/issue-tracker-github.md` | 1–45 |
| `.claude/skills/setup-matt-pocock-skills/issue-tracker-gitlab.md` | 1–46 |
| `.claude/skills/setup-matt-pocock-skills/issue-tracker-local.md` | 1–30 |
| `.claude/skills/setup-matt-pocock-skills/triage-labels.md` | 1–15 |
| `.claude/skills/tdd/SKILL.md` | 1–38 |
| `.claude/skills/tdd/mocking.md` | 1–59 |
| `.claude/skills/tdd/tests.md` | 1–77 |
| `.claude/skills/to-spec/SKILL.md` | 1–75 |
| `.claude/skills/to-tickets/SKILL.md` | 1–90 |
| `.editorconfig` | 1–19 |
| `.gitattributes` | 1–13 |
| `.github/pull_request_template.md` | 1–17 |
| `.gitignore` | 1–53 |
| `.nvmrc` | 1–1 |
| `.prettierignore` | 1–10 |
| `.prettierrc.json` | 1–5 |
| `CLAUDE.md` | 1–121 |
| `CONTEXT.md` | 1–46 |
| `README.md` | 1–47 |
| `e2e/perf/README.md` | 1–80 |
| `e2e/tsconfig.json` | 1–13 |
| `package.json` | 1–43 |
| `rust-toolchain.toml` | 1–5 |
| `tools/fixtures/retro/broken.jsonl` | 1–8 |
| `tools/fixtures/retro/review.jsonl` | 1–5 |
| `tools/fixtures/retro/task.jsonl` | 1–17 |
| `tsconfig.base.json` | 1–20 |

Đọc manifest và CLAUDE/export-map của `apps/desktop` cùng bốn package. AST và `rg` toàn nguồn dùng cho bloat/export; không tuyên bố đọc lại thủ công toàn codebase của A–E trong F. Những chỗ nối quan trọng đã đọc thêm ở F:

| File/chỗ nối | Dòng đã đọc |
|---|---|
| `apps/desktop/package.json` | 1–35 |
| `apps/desktop/CLAUDE.md` | 1–54 |
| `packages/ai/package.json` | 1–17 |
| `packages/ai/CLAUDE.md` | 1–53 |
| `packages/db/package.json` | 1–24 |
| `packages/db/CLAUDE.md` | 1–53 |
| `packages/domain/package.json` | 1–12 |
| `packages/domain/CLAUDE.md` | 1–52 |
| `packages/ui/package.json` | 1–25 |
| `packages/ui/CLAUDE.md` | 1–47 |
| `apps/desktop/src/data/app-data.ts` | 1–436 |
| `apps/desktop/src/data/tables.ts` | 1–68 |
| `apps/desktop/src/data/ai-analysis.ts` | 1–333 |
| `apps/desktop/src/data/persist-queue.ts` | 1–79 |
| `apps/desktop/src/routes/overview/team-compare-view.ts` | 1–129 |
| `apps/desktop/src/routes/appointments/appointments-view.ts` | 1–471 |
| `apps/desktop/src/routes/reports/report-workbook.ts` | 1–259 |
| `packages/db/src/index.ts` | 1–96 |
| `apps/desktop/src/routes/reports/reports-view.ts` | 1–110 |
| `packages/ai/src/adapter.ts` | 28–39 |
| `packages/ai/src/run.ts` | 208–228 |
| `apps/desktop/src-tauri/src/ai.rs` | 242–266 |
| `packages/db/src/customers.ts` | 1–210 |
| `packages/db/src/kyc.ts` | 1–220 |
| `packages/db/src/appointments.ts` | 1–90; 106–175; 249–341 |
| `packages/db/src/policies.ts` | 1–100 |
| `packages/db/src/team.ts` | 264–287 |
| `packages/db/src/ai-analyses.ts` | 1–105; 251–285 |
| `packages/db/src/trash.ts` | 1–95 |
| `packages/domain/src/stats.ts` | 149–183 |
| `packages/domain/src/money.ts` | 1–50 |
| `packages/domain/src/kyc-gate.ts` | 1–70 |

Tham chiếu: `common/prompt-codex.md` đầy đủ; `common/plan.md` mục tiêu/phạm vi/trục/thước/KNOWN/số đo/định dạng; `common/known.md` toàn bộ K1–K17 và sổ OPEN/ACCEPTED; `common/baseline.md`, `common/perf/perf-ref.json`; spec Phase 6 §4–6, `docs/metrics/phase-6.md`, `e2e/perf/README.md`. Đã đọc phần chính A–E.md của chính Codex trước phụ lục để kiểm phạm vi chưa khép và đưa ra kết luận cuối, không tổng hợp với bên khác. Spec/golden/mockup đã chốt vẫn là nguồn chuẩn.

## 3. Phát hiện

**2 phát hiện Low, đều CONFIRMED; không xác nhận Critical/High/Medium mới ở F.**

### CX-F1 — Eval AI có thể ghi key mà server phản chiếu vào báo cáo

ID: CX-F1
Mức: Low
Trục: S
Vị trí: tools/eval-ai-core.mjs:97–100,148–157,197,508,703–707 (8855345); ranh giới app có chặn ở apps/desktop/src-tauri/src/ai.rs:254–255.
Tình trạng: CONFIRMED
Mô tả: Adapter Node của công cụ eval không từ chối content chứa key, và chỉ che chuỗi key nguyên dạng trong thông điệp lỗi HTTP. Khác adapter Rust, key ở content hoặc dạng percent-encode có thể đi tới kết quả Markdown/partial/log khi ghi file lỗi.
Tái hiện / bằng chứng: `node C:\workspace\deep-review-1-6\codex\F\eval-boundary-probe.mjs` chỉ dùng Response/fetch giả và key tự tạo, không có kết nối mạng. `eval-boundary.json`: networkCalls=0, echoReturned=true, evalMainExit=0, resultFileContainsSyntheticKey=true, encodedServerMessageSurvives=true. Probe gọi core evalMain với file port trong bộ nhớ, không chạy tools/eval-ai.mjs hoặc ghi docs/metrics.
Ảnh hưởng: Owner chạy eval thật rồi lưu/commit báo cáo nếu server bất thường phản chiếu Authorization vào content hoặc error. Không chứng minh key thật đã lộ; app Rust hiện có kiểm reveals/mask, finding nằm ở công cụ phát triển. Low theo thước của lượt review vì cần server bất thường.
Đề xuất: Đồng bộ kiểm secret cho content và che cả dạng JSON/URL-escape trong serverMessage với Rust, thêm test HTTP giả cho 2xx/4xx và report/partial/log; ≈ 60–120 dòng SP (≤400), giữ 258 test công cụ và test adapter hiện có. Không sửa G5 hay dùng key thật.

### CX-F2 — Adapter eval bỏ finish_reason nên chấm khác app khi max_tokens cắt câu trả lời

ID: CX-F2
Mức: Low
Trục: C
Vị trí: tools/eval-ai-core.mjs:141–158 (8855345); hợp đồng packages/ai/src/adapter.ts:35, packages/ai/src/run.ts:219 và apps/desktop/src-tauri/src/ai.rs:247–264.
Tình trạng: CONFIRMED
Mô tả: readReply không truyền finishReason và từ chối content=null khi finish_reason=length. Công cụ eval vì thế không chạy cùng đường retry/CUT_ANSWER như app; có thể chấm ACCEPTED ở một output mà app REJECTED, hoặc ERROR ở một ca app thử lại được.
Tái hiện / bằng chứng: eval-boundary-probe.mjs, Response giả, cùng E01 và Mock làm trả lời kiểm soát. eval-boundary.json: emptyCutNode=ERROR/AI_BAD_RESPONSE/1 lần, emptyCutApp=ACCEPTED/2 lần; unfinishedOuterNode=ACCEPTED/1 lần, unfinishedOuterApp=REJECTED/2 lần. Ca đối chứng một JSON đầy đủ với length vẫn ACCEPTED, đúng hành vi app — không mặc định mọi length là lỗi.
Ảnh hưởng: Owner đánh giá model có câu trả lời bị cắt hoặc suy biến; số A1/lần thử và output đọc tay có thể không đại diện hành vi exe. Không thay đổi dữ liệu app, Low theo thước output bất thường.
Đề xuất: Ánh xạ finishReason hợp lệ và null+length thành content rỗng như Rust; giữ metadata khi ghi attempts, áp cut khi chấm lại lỗi sau transport error; ≈ 20–50 dòng SP và 40–80 test, giữ tests của eval/run/extract-json.

Không tạo ID lặp cho các lỗi A–E hay các mục KNOWN. Hai lỗi eval này nằm ở adapter Node/công cụ đánh giá, không phải adapter Rust mà exe dùng. Test của công cụ đang xanh nhưng chưa bao hai seam; không đếm thêm phát hiện T cho cùng nguyên nhân.

## 4. Bloat

Không thấy bloat mới có chi phí đo được để tạo ID. Không cài knip/jscpd/visualizer/cargo-bloat hay dependency mới.

| Đã chạy / đọc | Dữ liệu / phạm vi | Số / kết quả | ID |
|---|---|---|---|
| `tsc --noEmit --noUnusedLocals --noUnusedParameters` | domain, db, ai, ui, ui/scripts, desktop, e2e; nguồn ghim | **7 project, 0 diagnostic**, exit 0 (`unused.log`) | — |
| `pnpm codemap:check` | public exports/routes của các package/app | **Export maps are up to date**, exit 0 (`checks.log`) | — |
| `pnpm lint:deps` | apps + packages | **309 module / 1.244 dependency, 0 violation**, exit 0 (`checks.log`) | — |
| AST + `rg -n -w` nơi dùng của từng export | 188 file SP TS/TSX/MJS; mỗi tên export trong 974 declaration được tìm toàn apps/packages/tools/e2e | **974 exports**; **70 value + 107 type** không có tham chiếu bên ngoài file/barrel trong cách lọc này (`export-refs.json`) | — |
| Kiểm ứng viên export bằng nội dung/caller/test/public map | 177 ứng viên trên | Type bị erase; nhiều value dùng ngay trong file, helper chỉ test dùng hoặc API công cụ. `CHATGPT_URL`, `fillSlots`, `readHandoff`, `reviewedPr` không phải code chết. DB getAppointment/getPolicy/getTeam/getPerson/markKycVersionMaterial không nằm trong barrel; bản probe ban đầu gọi nhầm API đã sửa sang list public. Không lấy đếm ứng viên làm đếm code chết. | — |
| Tìm body hàm giống nhau ở ≥3 file, chuẩn hóa whitespace | AST SP trên; body ít nhất 160 ký tự | **0 nhóm trùng nguyên body ở ≥3 file** (`bloat.json`). Đây là scan exact clone, không chứng minh không có lặp ngữ nghĩa. Đã đọc các lặp resolver, badge, role, retry, plain/slug được KNOWN; không có bằng chứng chi phí mới. | — |
| Manifest/import/config/script và lockfile | root + 5 workspace manifest; lock 4.628 dòng | Domain không dependency; db dùng ai/schema đúng ngoại lệ; các direct dependency có caller runtime/tool/build/type/test. Lock SHA256 `41253fcf2cc91247874a7a9caecef19e902325ba0ac3727ab2e1e3a1462d6863`, **492 integrity entries**. Không thấy dependency runtime có thể bỏ được với chứng cứ hiện có. | — |
| `pnpm build:web` | build thật ở SHA ghim, không override anchor | **xanh, 1.093 module, 555ms** (`build.log`); warning chunk >600kB là warning build, không tự là lỗi | — |
| `node tools/size-report.mjs --json --exe <common exe>` | dist vừa build + exe release ghim | JS/CSS raw **2.364.283 byte**, gzip **697.071 byte**; 15 tệp khác **849.196 byte**; exe **5.414.400 byte**; **Δ 0** so common baseline | — |

Bundle chi tiết (gzip theo `size-report`/Node zlib, vì số gzip in bởi Vite dùng cách nén khác):

| Chunk/tệp | Raw byte | Gzip byte | Δ baseline |
|---|---|---|---|
| `assets/chart.js` | 513302 | 172450 | 0 |
| `assets/exceljs.min.js` | 929569 | 255572 | 0 |
| `assets/index.css` | 28364 | 6412 | 0 |
| `assets/index.js` | 891942 | 262010 | 0 |
| `assets/rolldown-runtime.js` | 1106 | 627 | 0 |
| **Tổng JS/CSS** | 2364283 | 697071 | 0 |

ExcelJS được import động ở lần xuất Excel; chart có chunk riêng. Không đề xuất refactor chỉ để giảm một warning: chưa có chi phí mới đo được. Nếu Owner chọn xử lý các lặp đã KNOWN, cần đo bundle/latency trước-sau và giữ seam golden, render/i18n, workbook cùng 596 đối chiếu dưới; phạm vi phải tách để ≤400 dòng SP/task. Các sửa cụ thể CX-F1/F2 có cỡ và test giữ hành vi ngay ở mục 3.

## 4b. Hiệu năng

**Dữ liệu:** `common/load/load-2026-10-12-seed6.p2cbackup`, **16.034.641 byte**, `tables` SHA256 **1e69a97f664708d91932a1158c3a9ddd4e4d4aebb689f9c912ac3c4d0962e3fd**. Sau nhập, 4 team / 51 nhân sự / 1.481 KH / 10.252 lịch hẹn / 1.674 HĐ live; **117 dòng Thùng rác**. Dữ liệu tải đầy đủ còn gồm 103 phân tích AI và các dòng xóa.

**Máy/tải song song:** Home PC DESKTOP-KDURKJP. Trước đo exe không có listener debug 9222–9410/4173; phiên này không chạy test/build/probe Node khi đo exe, không đo Node cùng lúc probe UI. Không biết/kiểm soát được mọi tác vụ nền hoặc bên khác không mở debug port, nên không khẳng định máy tuyệt đối rảnh. Exe bản chép private ở F/exe-run, debug **9357**, profile riêng; hash **dfa985f13ae2a4a8e1a8ec1b61696663a1a8873b318de60b5a9a1bc2bc481201** đúng common. Probe đã thực sự nhập lại backup qua UI, **1 test passed (2,3 phút)**, 5 lần/thao tác; db.save 15 lần. Không chạy toàn e2e cổng 4173 hoặc PW_REUSE.

### Hàm thuần và repository trong Node

`node F/core-perf.mjs`: một warm-up, 9 mẫu mỗi hàm (import 5), SQL.js thực, đồng hồ 14/10/2026; báo thời gian riêng hàm, không phải UI. Grid chứa đủ **10.252 dòng**. Một probe nháp dùng sai signature rồi thiếu coordinator tạo 0 dòng đã loại; `core-perf-empty-rows-invalid.json` chỉ để lưu lỗi probe, **không dùng làm số đo**.

| Hàm | Mẫu | Median ms | Min ms | Max ms | Ngân sách | ID |
|---|---|---|---|---|---|---|
| `importBackup` | 5 | 728.87 | 687.371 | 763.283 | ≤1100ms | — |
| `listAppointments` | 9 | 47.689 | 45.168 | 51.239 | ≤65ms | — |
| `countRecords` | 9 | 4.891 | 4.735 | 5.166 | ≤15ms | — |
| `teamCompare.month` | 9 | 2.02 | 1.549 | 2.891 | ≤15ms | — |
| `reportRows.month` | 9 | 8.655 | 6.06 | 10.067 | ≤15ms | — |
| `reportRows.year` | 9 | 7.527 | 6.756 | 12.179 | ≤15ms | — |
| `monthGrid` | 9 | 0.638 | 0.555 | 1.377 | ≤2ms | — |
| `listTrash` | 9 | 45.587 | 43.112 | 51.943 | chưa đặt | — |
| `exportBackup` | 9 | 179.979 | 174.735 | 191.275 | chưa đặt | — |

Ngưỡng ở cột chỉ là ngân sách hàm thuần Phase 4 mà phase-6.md nhắc lại. Không tính Δ với số nền Office Laptop/đầu vào Phase 4 khác. Tất cả ngân sách có ngưỡng đều đạt. `listTrash` gọi **444 SQL API** (exec+prepare, không phải 444 request mạng), nhưng **45,587ms** Node và **85ms** UI vẫn đạt. Việc đọc full teams/people/customers khi dựng Trash đã KNOWN; đây là số bổ sung, không chứng minh hậu quả mới để tạo ID. **600 lượt getter cache sau khi preload = 0 SQL**. Không dùng số Node để khẳng định latency trên exe.

Kiểm đối chiếu thêm **596 assertion**: 4 loại kỳ × 49 góc nhìn (all/team/RE), batched metrics/counts/stage snapshot bằng hàm domain độc lập và summary report bằng total team compare. Các hàm vẫn chung domain; probe này kiểm grouping/adapter, không thay golden chuẩn của A.

### Exe release và tham chiếu cùng máy

`PERF_CDP=http://127.0.0.1:9357`, `PERF_RUNS=5`, `PERF_BACKUP=<common load>`, `PERF_OUT=F/perf-exe.json`, `PERF_BASE=<common perf-ref.json>`, `pnpm exec playwright test -c playwright.perf.config.ts`. Cột Nền dùng **Home PC** common/perf-ref.json, không dùng số Office Laptop. Ngưỡng theo phase-6.md; Δ/% từ giá trị chưa làm tròn, luật cờ quá 20% và quá 10ms, heap quá 5MB. ID “—” = không có phát hiện P mới vượt ngưỡng sản phẩm.

| Thao tác | Mẫu | Median | Min–max | Ngưỡng | Nền Home PC | Δ / cờ | ID |
|---|---|---|---|---|---|---|---|
| `app.open-data` | 1 | 279ms | 279–279ms | ≤600ms | 188.5ms | +90.5ms / +48.0% ⚠️ | — |
| `backup.read` | 5 | 812.7ms | 788.6–846.5ms | ≤2000ms | 793.8ms | +18.9ms / +2.4% | — |
| `backup.import` | 5 | 38.3ms | 32.8–51.7ms | ≤500ms | 48.7ms | -10.4ms / -21.4% | — |
| `db.save` | 15 | 143.7ms | 140.6–165.4ms | ≤400ms | 140.1ms | +3.6ms / +2.6% | — |
| `reload.overview` | 5 | 295.5ms | 291–366.5ms | <500ms | 293.1ms | +2.4ms / +0.8% | — |
| `reload.appointments` | 5 | 288.4ms | 288.2–306.8ms | <500ms | 282.5ms | +5.9ms / +2.1% | — |
| `reload.customers` | 5 | 211.1ms | 209.5–229.9ms | <500ms | 206.4ms | +4.7ms / +2.3% | — |
| `reload.reports` | 5 | 269.6ms | 268.1–280.9ms | <500ms | 264ms | +5.6ms / +2.1% | — |
| `reload.team` | 5 | 266.7ms | 253.5–274.8ms | <500ms | 247.5ms | +19.2ms / +7.8% | — |
| `reload.settings` | 5 | 196.5ms | 178.1–203.8ms | <500ms | 179.7ms | +16.8ms / +9.3% | — |
| `appointments.period-day` | 5 | 7.8ms | 7.5–10.7ms | <200ms | 7.6ms | +0.2ms / +2.6% | — |
| `appointments.period-week` | 5 | 13.2ms | 12.2–15.1ms | <200ms | 12.7ms | +0.5ms / +3.9% | — |
| `appointments.period-month` | 5 | 13.2ms | 12.5–13.3ms | <200ms | 13.3ms | -0.1ms / -0.8% | — |
| `appointments.period-year` | 5 | 16.6ms | 15.9–19.3ms | <200ms | 16.5ms | +0.1ms / +0.6% | — |
| `appointments.sort-date-asc` | 5 | 17.5ms | 16.5–18.3ms | <200ms | 17.2ms | +0.3ms / +1.7% | — |
| `appointments.sort-date-desc` | 5 | 11.2ms | 10.8–12.3ms | <200ms | 11.6ms | -0.4ms / -3.4% | — |
| `appointments.select-row-year` | 5 | 6ms | 5.5–8.4ms | <200ms | 6.1ms | -0.1ms / -1.6% | — |
| `appointments.select-day-month` | 5 | 8.5ms | 7.7–10ms | <200ms | 10.3ms | -1.8ms / -17.5% | — |
| `appointments.select-row-month` | 5 | 6.9ms | 6.7–8.8ms | <200ms | 7ms | -0.1ms / -1.4% | — |
| `customers.view-table` | 5 | 19ms | 17.8–20.5ms | <200ms | 17.9ms | +1.1ms / +6.1% | — |
| `customers.sort-name` | 5 | 24ms | 21.4–24.4ms | <200ms | 22.1ms | +1.9ms / +8.6% | — |
| `customer.open-ai` | 5 | 19.7ms | 19.4–20.6ms | <200ms | 19.6ms | +0.1ms / +0.5% | — |
| `customer.ai-history` | 5 | 11.1ms | 1.8–17.5ms | <200ms | 12.4ms | -1.3ms / -10.5% | — |
| `overview.filter-year` | 5 | 14.9ms | 14.4–18.3ms | <200ms | 15ms | -0.1ms / -0.7% | — |
| `overview.filter-month` | 5 | 14.1ms | 13–15.1ms | <200ms | 14ms | +0.1ms / +0.7% | — |
| `reports.filter-year` | 5 | 8.8ms | 8.5–9.5ms | <200ms | 9ms | -0.2ms / -2.2% | — |
| `reports.filter-month` | 5 | 9.5ms | 9–10.2ms | <200ms | 9.5ms | +0ms / +0.0% | — |
| `reports.table-re` | 5 | 17.4ms | 16.4–18ms | <200ms | 17.1ms | +0.3ms / +1.8% | — |
| `trash.open` | 5 | 85ms | 79–90.5ms | <200ms | 79.5ms | +5.5ms / +6.9% | — |
| `trash.kind-appointments` | 5 | 6ms | 5.9–13.3ms | <200ms | 6.4ms | -0.4ms / -6.3% | — |
| `memory.js-heap` | 1 | 16.4MB | 16.4–16.4MB | ≤21MB | 16.4MB | +0MB / +0.0% | — |
| `reports.export-excel` | 5 | 23.8ms | 17.6–67.6ms | ≤500ms | 24.4ms | -0.6ms / -2.5% | — |
| `backup.export` | 5 | 438.7ms | 436.4–461.1ms | ≤1000ms | 423.8ms | +14.9ms / +3.5% | — |
| `appointments.next-month` | 5 | 117.3ms | 108.8–129.8ms | ≤300ms | 101.9ms | +15.4ms / +15.1% | — |
| `appointments.next-year` | 5 | 106.9ms | 105.5–122.4ms | ≤300ms; Năm−Tháng≤50ms | 105.8ms | +1.1ms / +1.0% | — |

**Giữ nguyên cờ `app.open-data`, không che kết quả chậm hơn nền.** Mẫu đầu 279ms vs 188,5ms (+48%) bị ⚠️. Đo thêm bằng chính exe và DB tải, nối CDP muộn 12s tránh debugger lúc khởi động, không thao tác màn khác:

| Đo mở lại DB tải | Mẫu | Median ms | Min–max ms | So nền 188,5ms | Ngưỡng | ID |
|---|---|---|---|---|---|---|
| Profile mới / ba bản chép | 3 | 276.7 | 256.1–282.7 | +88.2ms / +46.8% ⚠️ | ≤600ms | — |
| Profile dùng lại / một bản chép | 3 | 233.8 | 230.2–239.4 | +45.3ms / +24.0% ⚠️ | ≤600ms | — |

Profile mới là các thư mục riêng F/startup-1/2/3; profile dùng lại là F/startup-1. Profile dùng lại vẫn cao hơn mẫu nền duy nhất **45,3ms/+24,0%**, chưa quy được nguyên nhân code/đĩa/profile/tải nền. Exe là **cùng artifact**, không phải so hai phiên bản code. Đây là cờ số đo cần theo dõi, **không báo Medium** vì toàn bộ mẫu 230–283ms vẫn ≤600ms. Tổng từ gọi exe đến mở DB của profile dùng lại **573,5–604,8ms** (chưa phải LCP); probe không lấy được LCP qua getEntries, không gọi số này là thời gian “màn đầu đã vẽ”.

Không đo lại cold start sinh seed: quyết định K15 đã chấp nhận mốc đo lại Phase 4/6 (~4s), không áp trở lại ngưỡng 2s cũ. Heap **16,4MB** là JS heap sau GC, **không gồm WASM DB** theo chính ngân sách đã chốt, không khẳng định tổng RAM tiến trình. Các bản exe/probe đã đóng; F không giữ service/port nền.

## 5. Đếm mức × trục

Chỉ đếm phát hiện mới của F, mỗi ID một trục chính:

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 2 |

**CONFIRMED 2/2; PLAUSIBLE 0/2 (0%); KNOWN không có ID mới.** Cờ thời gian mở DB được ghi rõ, không coi là finding sản phẩm đã xác định nguyên nhân. Việc repo test xanh không phủ nhận CX-F1/F2.

## 6. Đã xét, không thấy

| Trục | Đã chạy / đọc, kết luận và giới hạn |
|---|---|
| E | Đã xét, không thấy edge case mới ngoài hai ca adapter eval suy biến ở mục 3: công cụ max-body/truncated/errors, các script lỗi native, pipeline ghi file và hàng đợi thay dữ liệu. Cross-flow chạy delete/restore khác thứ tự, cùng stage sau manual; nháp probe bị DB từ chối vì team IS và thiếu nextStep, đúng luật, không báo lỗi app. |
| C | Có **CX-F2**. Đọc contract Completion/Rust/run/eval, spec metrics/backup/TR và toàn e2e F. Cross-flow xác nhận team hiện tại ↔ owner lịch/HĐ lịch sử, snapshot Excel/export backup lúc thay DB. Đọc các gate PR main/head/SHA/build-exe/CI và test thuần pr-core, không chạy merge thật. |
| D | Đã xét, không thấy mới: importer của bộ tải, public DB commands, AppData cache/revision/persist, child soft-delete/parent restore. Snapshot cũ mở lại khớp counts cũ và AI STALE; bytes persist sau import mở lại khớp counts mới. Không chỉ so object trong bộ nhớ chưa serialize. |
| G | Đã xét, không thấy mới: Mock qua analyseCustomer thật, schema/gate version/state, no-secret AI store, Error/cut retry adapter parity. Không chạy model thật nên không kết luận chất lượng nội dung model thực hoặc độ đạt eval trả phí. Không báo lại CX-C1/KNOWN prompt/retry. |
| S | Có **CX-F1**. Key synthetic+fake fetch, không real network; đọc giới hạn body, URL/header/session, Rust reveals, tools file ports, CI permissions/pin actions và hook push. E2e dùng invoke giả cho các lệnh AI; file Rust sâu thuộc B và baseline 91 test, không thay việc đó bằng Mock. |
| P | Đã xét, không thấy thao tác vượt ngưỡng mới: 35 metric exe + bảng Node gồm listTrash; giữ cờ app.open-data, không suy cờ hết sau warm profile. Không coi việc heap excludes WASM hay coldseed đã chấp nhận là vấn đề mới. |
| B | Đã xét, không thấy mới có chi phí đo: 7 noUnused, codemap, deps, import/export toàn nguồn, clone scan, direct manifest/lock, build và raw/gzip/exe đều Δ0; giới hạn scan rõ ở mục 4. |
| T | Đã xét, không thấy khoảng hở mới ngoài seam của CX-F1/F2: **9 file/258 test công cụ xanh**; bản chép stats nền 8 xanh, **2 mutant đều bị giết, 0 sống** (3 ca đỏ vì assertion hành vi, không lỗi compile/import). Đọc toàn e2e, fixture, console watcher, actual workbook/backup assertions, isolated temp Git tests; không suy coverage ~99% = đúng spec. Hai khoảng hở Rust ở B giữ nguyên báo cáo B, không đếm lại. |
| A | Đã xét, không thấy mới trong chỗ nối F: đọc tests dialog keyboard/period picker/radiogroup/nav/status/aria-invalid/describedby, các nhãn Việt trong test; UI probe exe có locator accessible đúng và không console failure. Không chạy NVDA/axe, không tuyên bố audit trợ năng thực địa; các lỗi hiển thị đã ghi D/E và các mục KNOWN không có bằng chứng mới. |

### Chuỗi xuyên gói chạy thật trên bộ tải

`node F/cross-flow.mjs`, StoragePort trong bộ nhớ thay Rust I/O; DB/domain/AI/derived UI/report workbook là code nguyên bản SHA ghim. Toàn bộ assertions xanh, không network.

1. Tạo hai team, hai RE và IS không team; KH N3 có facts profile; thêm gia đình/nghề → Mock ACCEPTED/CURRENT → thêm residence không material → STALE.
2. Lịch MET N3→N2 với RE1, policy nộp/phát hành với RE2; đổi RE phụ trách KH sang RE2 vẫn giữ owner lịch/HĐ. Đổi team RE1 làm lịch và RF chuyển sang team mới theo spec.
3. Xóa lịch (rút transition), manual KH cùng N2 vào ngày sau → Trash báo stageKept → restore lịch không tạo RF. Xóa riêng HĐ, xóa KH → HĐ bị parent block; restore KH giữ HĐ xóa riêng; restore HĐ rồi AI vẫn STALE.
4. Tổng quan ↔ Báo cáo khớp. Riêng KH probe: met=1/RF=0/nộp=1/case size=24.000.000/phát hành=1/doanh số=21.000.000. Xuất backup và workbook bắt đầu trước import; giữ file write/backup rồi cho thay DB xong, hoàn tất exports sau đó. Workbook mở được, 4 sheet, 10 cột số đầu khớp report cũ; backup cũ mở lại khớp counts/AI/lịch/HĐ; DB mới + backup mới không có ID probe. Bytes persist mới mở lại khớp bộ tải.

```json
{
  "at": "2026-10-13T18:06:50.427Z",
  "data": "common/load/load-2026-10-12-seed6.p2cbackup",
  "steps": [
    "KYC -> Mock accepted/current -> minor new fact -> stale",
    "responsible RE changed; historical owners retained; current team determines team metric",
    "delete meeting -> later manual same stage -> restore no RF; independent child delete survives parent restore",
    "Overview/report equal -> Excel + backup snapshot exported across held replace -> old consistent snapshot, new DB excludes old IDs"
  ],
  "ownMetrics": {
    "submittedCount": 1,
    "caseSize": 24000000,
    "issuedCount": 1,
    "revenue": 21000000,
    "rfCount": 0,
    "closeRate": null
  },
  "ownAppointments": {
    "met": 1,
    "missed": 0,
    "unrecorded": 0,
    "planned": 0,
    "total": 1
  },
  "excelFirstTenFigures": [
    216,
    59,
    57,
    446,
    778,
    13,
    59,
    2709000000,
    64,
    2611000000
  ],
  "oldCounts": {
    "teams": 6,
    "people": 54,
    "customers": 1482,
    "appointments": 10253,
    "policies": 1675
  },
  "newCounts": {
    "teams": 4,
    "people": 51,
    "customers": 1481,
    "appointments": 10252,
    "policies": 1674
  },
  "saveCount": 5,
  "backups": 2,
  "exportedSheets": 4,
  "networkCalls": 0,
  "storage": "memory stand-in for Rust StoragePort; file command covered by B, not rerun here"
}
```

Probe đối chiếu bảng domain là code-path comparison; riêng chuỗi này còn có số kỳ vọng literal và deserialize backup/Excel. Không khẳng định StoragePort memory kiểm được hành vi lỗi đĩa/flush native; phần đó đã kiểm trong B.

## 7. Phụ lục — nguồn probe, lệnh và trạng thái cuối

### Lệnh / kết quả thật

Chạy trong PowerShell; mọi native command có tác dụng phụ trong script tạm đều kiểm exit code. Tất cả đường dẫn `F/` dưới là `C:\workspace\deep-review-1-6\codex\F\`.

| Lệnh / probe | Kết quả / log |
|---|---|
| `pnpm exec vitest run tools --maxWorkers=1` | 9 file / **258 passed**, 15,46s, exit 0; `tools-tests.log`. session-end tests dùng Git clone/bare remote tạm của test, không remote/repo dự án. |
| `pnpm codemap:check`, `pnpm lint:deps` | xanh, exit 0; `checks.log` |
| `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters -p <project tsconfig>` cho 7 project | không diagnostic, exit 0; `unused.log` |
| `pnpm build:web` + `node tools/size-report.mjs --json --exe C:\workspace\deep-review-1-6\common\exe\project2c.exe` | xanh, size.json + build.log; chỉ tạo dist/cache bị ignore |
| `node F/eval-boundary-probe.mjs` | assertions xanh; **networkCalls=0**, fake key; `eval-boundary.json` (file report port là Map, không docs/metrics) |
| `node F/bloat-probe.mjs` | 188 source / 974 export / 0 exact clone group ≥3 file; `bloat.json`, `export-refs.json` |
| `node F/core-perf.mjs` | bảng final + **596 assertion**, exit 0; `core-perf.json`, `core-perf.log` |
| `node F/exe-setup.mjs`, rồi perf config với env mục 4b | own exe PID 37524, đã đóng; **1 passed**, perf-exe.log/json |
| `node F/startup-repeat.mjs`, rồi `STARTUP_REUSE=1 node F/startup-repeat.mjs` | mỗi lượt 3 lần, cổng 9358; startup-repeat/warm.json + .log; các PID bản chép đều đã đóng |
| `node F/cross-flow.mjs` | assertions xanh, 4 chuỗi, persist reopen/Excel/backup deserialize; cross-flow.json/log |
| `node F/mutation-prepare.mjs baseline`, `pnpm exec vitest run --config F/mutation.config.mjs` | **8/8 xanh**, exit 0, 132ms (`mutation-baseline.log`) |
| `node F/mutation-prepare.mjs mutated`, cùng vitest config | **3 failed / 5 passed**, exit 1, 155ms (`mutation-killed.log`); đỏ đúng assertion, không compile/import |
| `node F/scope.mjs` | inventory dòng/path và lock metadata; scope.json/log |

Đột biến chỉ ở **bản chép**: median mẫu chẵn lấy số trên thay vì trung bình → test `summarize gives the median, min and max of the samples` bắt 3 khác 2,5; `isWorse` luôn false → `compareRuns gives each change and flags what got worse beyond the noise` và `markdownTable against a base run adds the base median and the change` bắt cờ thiếu. **2 killed, 0 survived**; không suy tỉ lệ này thành coverage mutation của toàn repo. Nguồn mutant và test chép được lưu dưới đây.

Probe nháp đã sửa vì người review gọi sai monthGrid/coordinator, IS.teamId, outcome.nextStep, DB getter không có trong barrel. Không thay nguồn repo để làm probe xanh; những lỗi dựng probe này không là phát hiện sản phẩm. Non-escalated lần đầu ghi file JSON ngoài workspace bị EPERM, chạy lại với quyền ghi thư mục kết quả đã được anh chỉ định; không có auto-review rejection.

Các cổng toàn repo **lấy từ common/baseline.md ở đúng SHA**, không tuyên bố chạy lại trong F: verify **110 file / 2.755 test**, Rust **91 test**, e2e **210 passed**, coverage Stmts **98,99%**, Branch **97,03%**, Funcs **98,94%**, Lines **99,24%**, build exe release hash khớp. Không chạy `eval:ai`, công cụ gh/handoff/merge/session/retro thật hoặc cold seed lại. Không đọc dữ liệu ngoài phạm vi.

Kết quả seam eval, nguyên văn JSON:

```json
{
  "syntheticOnly": true,
  "networkCalls": 0,
  "echoReturned": true,
  "evalMainExit": 0,
  "resultFileContainsSyntheticKey": true,
  "encodedServerMessageSurvives": true,
  "completeJsonWithLengthIsValidControl": "ACCEPTED",
  "emptyCutNode": {
    "status": "ERROR",
    "code": "AI_BAD_RESPONSE",
    "attempts": 1
  },
  "emptyCutApp": {
    "status": "ACCEPTED",
    "attempts": 2
  },
  "unfinishedOuterNode": {
    "status": "ACCEPTED",
    "attempts": 1
  },
  "unfinishedOuterApp": {
    "status": "REJECTED",
    "attempts": 2
  }
}
```

### Nguồn probe / bản chép

Các nguồn dưới được chèn đầy đủ để báo cáo raw vẫn có bằng chứng khi đưa vào repo. Runtime dùng dependency sẵn có, không cài công cụ. `stats.ts` ở đây là **bản mutant**, file gốc ghim không thay đổi. `stats.test.ts` là test gốc đổi import runner từ Playwright sang Vitest trong bản chép.

#### `F/runtime.mjs`

````js
import { readFileSync } from 'node:fs';
import { registerHooks, createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
export const root = 'C:/workspace/Project-2C-review-2/';
export const out = 'C:/workspace/deep-review-1-6/codex/F/';
export const requireRepo = createRequire(root + 'package.json');
registerHooks({
  resolve(specifier, context, nextResolve) {
    try { return nextResolve(specifier, context); } catch (error) {
      if (!specifier.startsWith('.')) throw error;
      for (const suffix of ['.ts', '/index.ts']) {
        try { return nextResolve(specifier + suffix, context); } catch {}
      }
      throw error;
    }
  },
  load(url, context, nextLoad) {
    if (!url.endsWith('?raw')) return nextLoad(url, context);
    return { format: 'module', source: `export default ${JSON.stringify(readFileSync(new URL(url.slice(0, -4)), 'utf8'))};`, shortCircuit: true };
  }
});
export const fromRepo = path => import(pathToFileURL(root + path).href);
export const dbapi = await fromRepo('packages/db/src/index.ts');
export const domain = await fromRepo('packages/domain/src/index.ts');
````

#### `F/eval-boundary-probe.mjs`

````js
import { writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { fromRepo, domain, out } from './runtime.mjs';
const core = await fromRepo('tools/eval-ai-core.mjs');
const ai = await fromRepo('packages/ai/src/index.ts');
const fixtures = await fromRepo('tools/fixtures/ai-eval.mjs');
const secret = 'sk-CX-F-SYNTHETIC-KEY-ONLY-6f82';
const request = {sessionId:'synthetic-session', model:'deepseek-v4.1-flash', reasoning:'HIGH', messages:[], maxTokens:4000};
const response = (content, finish_reason='stop') => new Response(JSON.stringify({choices:[{message:{content},finish_reason}],usage:{prompt_tokens:20,completion_tokens:10}}),{status:200});
const adapter = fetch => core.openCodeAdapter({url:core.PLAN_URLS.GO,key:secret,userAgent:'CX-F-local-probe',fetch});
const echoed = await adapter(async()=>response(secret)).complete(request);
assert.equal(echoed.content, secret);
const files = new Map();
const log = [];
const exit = await core.evalMain({env:{OPENCODE_GO_KEY:secret},argv:[], fetch:async()=>response(secret),now:()=>performance.now(),day:domain.calendarDate(2026,10,14),userAgent:'CX-F-local-probe',files:{create:(p,t)=>files.set(p,t),write:(p,t)=>files.set(p,t),rename:(a,b)=>{files.set(b,files.get(a));files.delete(a)},remove:p=>files.delete(p)},log:t=>log.push(t)});
const resultFile = [...files.values()][0];
assert(resultFile.includes(secret));
const encoded = Array.from(secret).map(x=>'%'+x.charCodeAt(0).toString(16).padStart(2,'0').toUpperCase()).join('');
const encodedError = await adapter(async()=>new Response(JSON.stringify({error:{message:encoded}}),{status:500})).complete(request).catch(e=>e);
assert.equal(encodedError.serverMessage, encoded);
const mock = ai.createMockAdapter();
const cutAdapter = adapter(async(_url,init)=>response((await mock.complete({messages:JSON.parse(init.body).messages})).content,'length'));
const settings={provider:'OPENCODE_GO',opencodePlan:'GO',model:'deepseek-v4.1-flash',reasoning:'HIGH'};
const cut = await core.runEval({adapter:cutAdapter,settings,now:()=>performance.now(),log:()=>{},profileSpecs:[fixtures.EVAL_PROFILES[0]],noteSpecs:[]});
let nodeCalls=0;
const nullCutNode=adapter(async(_url,init)=>++nodeCalls===1?response(null,'length'):response((await mock.complete({messages:JSON.parse(init.body).messages})).content));
const runOne = ad=>core.runEval({adapter:ad,settings,now:()=>performance.now(),log:()=>{},profileSpecs:[fixtures.EVAL_PROFILES[0]],noteSpecs:[]});
const nullNode=await runOne(nullCutNode);
let appCalls=0;
const nullApp=await runOne({complete:async req=>++appCalls===1?{content:'',finishReason:'length',promptTokens:null,completionTokens:null}:mock.complete(req)});
assert.equal(nullNode.profiles[0].status,'ERROR');
assert.equal(nullApp.profiles[0].status,'ACCEPTED');
const nestedInput=ai.takeAnalysisInput(fixtures.EVAL_PROFILES[0],fixtures.EVAL_TODAY);
const validJson=(await mock.complete({messages:[{role:'user',content:JSON.stringify(nestedInput)}]})).content;
const unfinished='Ghi chú { chưa đóng. '+validJson;
const nestedNode=await runOne(adapter(async()=>response(unfinished,'length')));
const nestedApp=await runOne({complete:async()=>({content:unfinished,finishReason:'length',promptTokens:20,completionTokens:10})});
const result = {syntheticOnly:true,networkCalls:0,echoReturned:true,evalMainExit:exit,resultFileContainsSyntheticKey:resultFile.includes(secret),encodedServerMessageSurvives:true,completeJsonWithLengthIsValidControl:cut.profiles[0].status,emptyCutNode:{status:nullNode.profiles[0].status,code:nullNode.profiles[0].error?.code,attempts:nodeCalls},emptyCutApp:{status:nullApp.profiles[0].status,attempts:appCalls},unfinishedOuterNode:{status:nestedNode.profiles[0].status,attempts:nestedNode.profiles[0].attempts.length},unfinishedOuterApp:{status:nestedApp.profiles[0].status,attempts:nestedApp.profiles[0].attempts.length}};
writeFileSync(out+'eval-boundary.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
````

#### `F/bloat-probe.mjs`

````js
import { readFileSync,writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { requireRepo, root, out } from './runtime.mjs';
const ts=requireRepo('typescript');
const paths=execFileSync('git',['ls-files'],{cwd:root,encoding:'utf8'}).trim().split('\n');
const source=paths.filter(p=>/\.(ts|tsx|mjs)$/.test(p)&&/^(apps|packages|tools|e2e)\//.test(p));
const code=source.filter(p=>!/(?:\.test\.|\.spec\.|\.guide\.|\.perf\.|\/golden\/|\/fixtures\/|test-support\.ts|\.d\.ts)/.test(p)&&!p.startsWith('e2e/'));
const exports=[], bodies=new Map(), imports=[];
for(const file of code){const text=readFileSync(root+file,'utf8'),sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,file.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);for(const st of sf.statements){if(ts.isImportDeclaration(st)&&st.moduleSpecifier)imports.push({file,from:st.moduleSpecifier.text});if(!st.modifiers?.some(x=>x.kind===ts.SyntaxKind.ExportKeyword))continue;const names=ts.isVariableStatement(st)?st.declarationList.declarations.map(x=>x.name.getText(sf)):st.name?[st.name.getText(sf)]:[];for(const name of names)exports.push({file,name,line:sf.getLineAndCharacterOfPosition(st.getStart(sf)).line+1,kind:ts.isInterfaceDeclaration(st)||ts.isTypeAliasDeclaration(st)?'type':'value'});}const visit=node=>{if((ts.isFunctionDeclaration(node)||ts.isArrowFunction(node)||ts.isFunctionExpression(node))&&node.body){const body=node.body.getText(sf).replace(/\s+/g,' ');if(body.length>=160){const set=bodies.get(body)??[];set.push({file,line:sf.getLineAndCharacterOfPosition(node.getStart(sf)).line+1,chars:body.length});bodies.set(body,set);}}ts.forEachChild(node,visit)};visit(sf);}
// rg supplies references for every exported name in one batched search, avoiding N processes.
const names=[...new Set(exports.map(x=>x.name))].filter(x=>/^[A-Za-z_$][\w$]*$/.test(x));
const args=['-n','-w','--glob','*.ts','--glob','*.tsx','--glob','*.mjs','--glob','!*.test.*','--glob','!*.spec.*','--glob','!**/golden/**','--glob','!**/fixtures/**','--glob','!test-support.ts'];for(const n of names)args.push('-e',n);args.push('apps','packages','tools','e2e');
const refs=execFileSync('rg',args,{cwd:root,encoding:'utf8',maxBuffer:20*1024*1024}).split('\n').filter(Boolean).map(line=>{const hit=/^(.*?):(\d+):(.*)$/.exec(line);return hit?{file:hit[1].replaceAll('\\','/'),line:Number(hit[2]),text:hit[3]}:null}).filter(Boolean);
for(const e of exports){const regex=new RegExp('(?<![\\w$])'+e.name.replaceAll('

### Kiểm trạng thái cuối

`git rev-parse HEAD`: `885534549808f42aec7f9af5743bbf86642ee4bd`.

`git status --short` cuối phiên:

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

Khớp đầu phiên. `git diff --exit-code` và `git diff --cached --exit-code`: exit 0; không tracked change. Không còn bản exe của F hoặc listener 9357/9358. Hoàn tất: **2026-10-14 21:52:04 +07:00**.

## 8. Kết luận v1.0 ở SHA 8855345

**SẴN SÀNG cho v1.0 trong phạm vi kiểm độc lập của Codex**, theo thước mức và ngân sách đã chốt của lượt review này.

Lý do: A–E của chính Codex có 11 phát hiện Low, F thêm 2 Low ở công cụ eval; không có Critical/High/Medium đã xác nhận trong sáu gói. Các cổng nền ở đúng SHA xanh; F kiểm thêm chuỗi DB/domain/Mock/UI derived/Excel/backup/persist và đo bộ tải trên exe, mọi thao tác đạt ngân sách. Bundle/exe không tăng. Hai mutant stats bị test bắt. Các hạn chế và 13 Low vẫn tồn tại, không coi review là không có lỗi.

CX-F1 cần xử lý trước khi dùng eval trả phí/lưu báo cáo thật để tránh điều kiện server phản chiếu key; CX-F2 cần xử lý để số eval đại diện đúng exe. Cờ mở DB **233,8ms vs 188,5ms** khi profile dùng lại được giữ để theo dõi; vẫn ≤600ms, không xác nhận code regression với cùng artifact và nền chỉ một mẫu. Cold seed, WASM RAM, model thật và trợ năng thực địa chưa được đo mới trong F như giới hạn đã nêu.

Đây là kết luận của Codex ở SHA ghim, chưa phải quyết định G7 hay hành động phát hành. Không tổng hợp với bên khác, không tạo Issue hoặc đề xuất merge; chờ anh yêu cầu tổng hợp.
,'\\

### Kiểm trạng thái cuối

`git rev-parse HEAD`: `885534549808f42aec7f9af5743bbf86642ee4bd`.

`git status --short` cuối phiên:

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

Khớp đầu phiên. `git diff --exit-code` và `git diff --cached --exit-code`: exit 0; không tracked change. Không còn bản exe của F hoặc listener 9357/9358. Hoàn tất: **2026-10-14 21:52:04 +07:00**.

## 8. Kết luận v1.0 ở SHA 8855345

**SẴN SÀNG cho v1.0 trong phạm vi kiểm độc lập của Codex**, theo thước mức và ngân sách đã chốt của lượt review này.

Lý do: A–E của chính Codex có 11 phát hiện Low, F thêm 2 Low ở công cụ eval; không có Critical/High/Medium đã xác nhận trong sáu gói. Các cổng nền ở đúng SHA xanh; F kiểm thêm chuỗi DB/domain/Mock/UI derived/Excel/backup/persist và đo bộ tải trên exe, mọi thao tác đạt ngân sách. Bundle/exe không tăng. Hai mutant stats bị test bắt. Các hạn chế và 13 Low vẫn tồn tại, không coi review là không có lỗi.

CX-F1 cần xử lý trước khi dùng eval trả phí/lưu báo cáo thật để tránh điều kiện server phản chiếu key; CX-F2 cần xử lý để số eval đại diện đúng exe. Cờ mở DB **233,8ms vs 188,5ms** khi profile dùng lại được giữ để theo dõi; vẫn ≤600ms, không xác nhận code regression với cùng artifact và nền chỉ một mẫu. Cold seed, WASM RAM, model thật và trợ năng thực địa chưa được đo mới trong F như giới hạn đã nêu.

Đây là kết luận của Codex ở SHA ghim, chưa phải quyết định G7 hay hành động phát hành. Không tổng hợp với bên khác, không tạo Issue hoặc đề xuất merge; chờ anh yêu cầu tổng hợp.
)+'(?![\\w$])');e.references=refs.filter(r=>r.file!==e.file&&!r.file.endsWith('/index.ts')&&regex.test(r.text));}
const duplicates=[...bodies].filter(([,xs])=>new Set(xs.map(x=>x.file)).size>=3).map(([body,locations])=>({body,locations}));
const result={codeFiles:code.length,exports:exports.length,unreferenced:exports.filter(x=>x.references.length===0),duplicates,imports};
writeFileSync(out+'export-refs.json',JSON.stringify(exports,null,2)+'\n');writeFileSync(out+'bloat.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({codeFiles:code.length,exports:exports.length,unreferencedValues:result.unreferenced.filter(x=>x.kind==='value').map(({file,name,line})=>({file,name,line})),unreferencedTypes:result.unreferenced.filter(x=>x.kind==='type').length,duplicates},null,2));
````

#### `F/core-perf.mjs`

````js
import { readFileSync, writeFileSync } from 'node:fs';
import { hostname, cpus } from 'node:os';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { dbapi as a, domain as m, fromRepo, out } from './runtime.mjs';
const backup = readFileSync('C:/workspace/deep-review-1-6/common/load/load-2026-10-12-seed6.p2cbackup','utf8');
const now = () => new Date('2026-10-14T05:00:00Z');
const {db} = await a.importBackup(backup,{now});
const {readTables} = await fromRepo('apps/desktop/src/data/tables.ts');
const {teamCompare} = await fromRepo('apps/desktop/src/routes/overview/team-compare-view.ts');
const {reportRows} = await fromRepo('apps/desktop/src/routes/reports/reports-view.ts');
const {monthGrid,appointmentRows} = await fromRepo('apps/desktop/src/routes/appointments/appointments-view.ts');
const t = readTables(db); for(const key of ['people','teams','customers','appointments','policies','transitions']) void t[key];
const today = m.calendarDate(2026,10,14), month=m.periodOf('month',today), year=m.periodOf('year',today), scope={kind:'all'};
const ops={};
async function bench(name,fn,runs=9){await fn();const samples=[];for(let i=0;i<runs;i++){const start=performance.now();await fn();samples.push(performance.now()-start)}const sorted=[...samples].sort((a,b)=>a-b);ops[name]={runs,median:+sorted[Math.floor(runs/2)].toFixed(3),min:+sorted[0].toFixed(3),max:+sorted.at(-1).toFixed(3),samples};}
await bench('importBackup',async()=>{const {db:copy}=await a.importBackup(backup,{now});copy.sqlite.close()},5);
await bench('listAppointments',()=>a.listAppointments(db));
await bench('countRecords',()=>a.countRecords(db));
await bench('teamCompare.month',()=>teamCompare(t,month,today));
await bench('reportRows.month',()=>reportRows(t,month,scope,today));
await bench('reportRows.year',()=>reportRows(t,year,scope,today));
const rows=appointmentRows(t,scope,'any');
assert.equal(rows.length,t.appointments.length);
await bench('monthGrid',()=>monthGrid(month.start,rows,month,today));
await bench('listTrash',()=>a.listTrash(db));
await bench('exportBackup',()=>a.exportBackup(db));
let calls=0; const exec=db.sqlite.exec.bind(db.sqlite), prepare=db.sqlite.prepare.bind(db.sqlite);
db.sqlite.exec=(...args)=>{calls++;return exec(...args)};db.sqlite.prepare=(...args)=>{calls++;return prepare(...args)};
a.listTrash(db);const trashSqlCalls=calls;
const cached=readTables(db);for(const key of ['people','teams','customers','appointments','policies','transitions']) void cached[key];calls=0;
for(let i=0;i<100;i++)for(const key of ['people','teams','customers','appointments','policies','transitions'])void cached[key]; const cacheSqlCalls=calls;
const scopes=[scope,...t.teams.map(x=>({kind:'team',teamId:x.id})),...t.people.filter(x=>x.role==='RE').map(x=>({kind:'re',reId:x.id}))];
let assertions=0;
for(const kind of ['day','week','month','year']){const p=m.periodOf(kind,today);const metric=m.periodMetricsByScope(t,p),counts=m.appointmentCountsByScope(t.appointments,p,t.people,today),stage=m.stageSnapshotByScope(t.customers,t.transitions,t.people,today);for(const sc of scopes){assert.deepEqual(metric(sc),m.periodMetrics(t,p,sc));assert.deepEqual(counts(sc),m.appointmentCounts(t.appointments,p,sc,t.people,today));assert.deepEqual(stage(sc),m.stageSnapshot(t.customers,t.transitions,today,sc,t.people));assertions+=3;}const rr=reportRows(t,p,scope,today),tc=teamCompare(t,p,today);assert.deepEqual(rr.summary.metrics,tc.total.metrics);assert.equal(rr.summary.appointments.met,tc.total.met);assertions+=2;}
const result={machine:hostname(),cpu:cpus()[0].model,node:process.version,at:new Date().toISOString(),concurrency:'No test/build/UI probe of this Codex session; other reviewer/background load not known.',bytes:Buffer.byteLength(backup),tablesSha256:createHash('sha256').update(JSON.stringify(JSON.parse(backup).tables)).digest('hex'),counts:a.countRecords(db),gridInputRows:rows.length,trashRows:a.listTrash(db).length,trashSqlCalls,cacheSqlCalls,assertions,ops};
writeFileSync(out+'core-perf.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));db.sqlite.close();
````

#### `F/exe-setup.mjs`

````js
import { mkdirSync,copyFileSync,readFileSync,writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dbapi,out } from './runtime.mjs';
const dir=out+'exe-run/';mkdirSync(dir+'Project2C-data/',{recursive:true});
const source='C:/workspace/deep-review-1-6/common/exe/project2c.exe';
const exe=dir+'project2c.exe';copyFileSync(source,exe);
const {db}=await dbapi.importBackup(readFileSync('C:/workspace/deep-review-1-6/common/load/load-2026-10-12-seed6.p2cbackup','utf8'));
writeFileSync(dir+'Project2C-data/project2c.db',db.export());db.sqlite.close();
const proc=spawn(exe,[],{cwd:dir,windowsHide:true,detached:true,stdio:'ignore',env:{...process.env,WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS:'--remote-debugging-port=9357',WEBVIEW2_USER_DATA_FOLDER:dir+'webview-profile'}});proc.unref();
const info={pid:proc.pid,exe,port:9357,at:new Date().toISOString(),sha256:createHash('sha256').update(readFileSync(exe)).digest('hex'),concurrency:'No other listening debug port found in 9222–9410 before launch; no other Codex test/build/Node performance probe during exe measurement. Other background CPU load unknown.'};writeFileSync(out+'exe-process.json',JSON.stringify(info,null,2)+'\n');console.log(JSON.stringify(info,null,2));
````

#### `F/startup-repeat.mjs`

````js
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { dbapi, requireRepo, out } from './runtime.mjs';
const { chromium } = requireRepo('@playwright/test');
const { db } = await dbapi.importBackup(readFileSync('C:/workspace/deep-review-1-6/common/load/load-2026-10-12-seed6.p2cbackup','utf8'));
const bytes = db.export(); db.sqlite.close();
const samples=[]; const reuse=process.env.STARTUP_REUSE==='1';
for(let i=1;i<=3;i++) {
  const dir=out+'startup-'+(reuse?1:i)+'/'; mkdirSync(dir+'Project2C-data/',{recursive:true});
  const exe=dir+'project2c.exe'; copyFileSync('C:/workspace/deep-review-1-6/common/exe/project2c.exe',exe);
  writeFileSync(dir+'Project2C-data/project2c.db',bytes);
  const invoked=Date.now();
  const child=spawn(exe,[],{cwd:dir,windowsHide:true,stdio:'ignore',env:{...process.env,WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS:'--remote-debugging-port=9358',WEBVIEW2_USER_DATA_FOLDER:dir+'webview-profile'}});
  try {
    // Late CDP attach, as the accepted startup measurement, avoiding debugger overhead at open.
    await new Promise(r=>setTimeout(r,12000));
    const browser=await chromium.connectOverCDP('http://127.0.0.1:9358');
    const page=browser.contexts()[0].pages()[0];
    const result=await page.evaluate(()=>({
      origin:performance.timeOrigin,
      navigation:performance.getEntriesByType('navigation')[0].type,
      opened:performance.getEntriesByName('p2c:data-open','mark')[0]?.startTime,
      lcp:performance.getEntriesByType('largest-contentful-paint').at(-1)?.startTime,
      hasOverview:document.body.innerText.includes('Tổng quan')
    }));
    assert.equal(result.navigation,'navigate'); assert.equal(result.hasOverview,true);
    assert.equal(typeof result.opened,'number');
    samples.push({run:i,pid:child.pid,exe,invoked,...result,launchToData:result.origin-invoked+result.opened});
    console.log(JSON.stringify(samples.at(-1)));
    await browser.close();
  } finally {
    child.kill(); await new Promise(r=>setTimeout(r,700));
  }
}
const values=samples.map(s=>s.opened).sort((a,b)=>a-b);
const result={samples,opened:{runs:3,median:values[1],min:values[0],max:values[2]},reuseWebviewProfile:reuse,sameFrozenBackup:true,noParallelCodexProbe:true,attachDelayMs:12000};
writeFileSync(out+(reuse?'startup-warm.json':'startup-repeat.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result.opened));
````

#### `F/cross-flow.mjs`

````js
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { dbapi as a, domain as d, fromRepo, root, out } from './runtime.mjs';
const { openAppData }=await fromRepo('apps/desktop/src/data/app-data.ts');
const { analyseCustomer }=await fromRepo('apps/desktop/src/data/ai-analysis.ts');
const { reportRows }=await fromRepo('apps/desktop/src/routes/reports/reports-view.ts');
const { teamCompare }=await fromRepo('apps/desktop/src/routes/overview/team-compare-view.ts');
const { buildReportWorkbook }=await fromRepo('apps/desktop/src/routes/reports/report-workbook.ts');
const Excel=createRequire(root+'apps/desktop/package.json')('exceljs');
const backup=readFileSync('C:/workspace/deep-review-1-6/common/load/load-2026-10-12-seed6.p2cbackup','utf8');
const clock=()=>new Date('2026-10-14T05:00:00Z');
const { db:initial }=await a.importBackup(backup,{now:clock});
let saved=initial.export();initial.sqlite.close();
const heldExports=[],written=[];let holdExport=false,holdBackup=false,releaseBackup,enteredBackup;
const backupEntered=new Promise(r=>enteredBackup=r);
let backups=0,saveCount=0;
const storage={
 load:async()=>saved,
 save:async bytes=>{saved=bytes.slice();saveCount++},
 backup:async()=>{backups++;if(holdBackup){enteredBackup();await new Promise(r=>releaseBackup=r)}return 'fake-auto-'+backups+'.db'},
 writeExport:async(name,bytes)=>{const copy=bytes.slice();if(holdExport)await new Promise(r=>heldExports.push(r));written.push({name,bytes:copy});return 'memory/'+name},
 latestBackup:async()=>undefined,openFolder:async()=>{}
};
const app=await openAppData({storage,clock,ai:{web:{copy:async()=>true,openChatGpt:async()=>true},reportError:e=>{throw e}}});
const day=n=>d.calendarDate(2026,10,n),today=day(14),period=d.periodOf('month',today);
const run=fn=>app.run(fn),steps=[];
const appointment=(db,id)=>a.listAppointments(db).find(row=>row.id===id);
const policyOf=(db,id)=>a.listPolicies(db).find(row=>row.id===id);
const t1=run(db=>a.createTeam(db,{name:'F probe original'}));
const t2=run(db=>a.createTeam(db,{name:'F probe moved'}));
const re1=run(db=>a.createPerson(db,{name:'F RE historical',role:'RE',teamId:t1.id}));
const re2=run(db=>a.createPerson(db,{name:'F RE responsible',role:'RE',teamId:t1.id}));
const is=run(db=>a.createPerson(db,{name:'F reviewer',role:'IS',teamId:null}));
const c=run(db=>a.createCustomer(db,{name:'F cross customer',reId:re1.id,stage:'N3',date:day(10),birthDate:{year:1984},gender:'FEMALE'}));
run(db=>a.recordKycNote(db,c.id,{text:'Độc thân, chưa có con, kỹ sư.',date:day(10),facts:[{field:'maritalStatus',value:'Độc thân'},{field:'childrenCount',value:0},{field:'occupation',value:'Kỹ sư'}]}));
assert.deepEqual(await analyseCustomer(app,c.id),{kind:'saved',status:'ACCEPTED'});
assert.equal(a.listAiAnalyses(app.db(),c.id)[0].state,'CURRENT');
run(db=>a.recordKycNote(db,c.id,{text:'Nơi ở Hà Nội',date:day(11),facts:[{field:'residence',value:'Hà Nội'}]}));
assert.equal(a.listAiAnalyses(app.db(),c.id)[0].state,'STALE');steps.push('KYC -> Mock accepted/current -> minor new fact -> stale');
const appt=run(db=>a.scheduleAppointment(db,{customerId:c.id,reId:re1.id,date:day(12),triggerType:'OTHER',triggerNote:'review probe'}));
run(db=>a.recordMeetingOutcome(db,appt.id,{status:'MET',stageAfter:'N2',nextStep:'Hẹn tiếp',outcomeReviewerId:is.id}));
const policy=run(db=>a.submitPolicy(db,{customerId:c.id,reId:re2.id,submittedDate:day(10),submittedFyp:24000000}));
run(db=>a.issuePolicy(db,policy.id,{issuedDate:day(13),issuedFyp:21000000}));
run(db=>a.updateCustomerProfile(db,c.id,{reId:re2.id}));
assert.equal(appointment(app.db(),appt.id).reId,re1.id);assert.equal(policyOf(app.db(),policy.id).reId,re2.id);
run(db=>a.updatePerson(db,re1.id,{teamId:t2.id}));
const scope={kind:'team',teamId:t2.id};
let rr=reportRows(app.tables(),period,scope,today);
assert.equal(rr.summary.appointments.met,1);assert.equal(rr.summary.metrics.rfCount,1);assert.equal(rr.summary.metrics.submittedCount,0);
steps.push('responsible RE changed; historical owners retained; current team determines team metric');
run(db=>a.softDeleteAppointment(db,appt.id));
run(db=>a.changeStageManually(db,c.id,{to:'N2',date:day(14)}));
const trashAppt=a.listTrash(app.db()).find(x=>x.id===appt.id);
assert.deepEqual(trashAppt.effect,{kind:'stageKept',stage:'N2'});assert.equal(trashAppt.blocked,undefined);
run(db=>a.restoreAppointment(db,appt.id));
assert.equal(reportRows(app.tables(),period,scope,today).summary.metrics.rfCount,0);
run(db=>a.softDeletePolicy(db,policy.id));run(db=>a.softDeleteCustomer(db,c.id));
assert.equal(a.listTrash(app.db()).find(x=>x.id===policy.id).blocked.code,'CUSTOMER_NOT_FOUND');
run(db=>a.restoreCustomer(db,c.id));assert.equal(policyOf(app.db(),policy.id),undefined);
run(db=>a.restorePolicy(db,policy.id));
assert.equal(a.listAiAnalyses(app.db(),c.id)[0].state,'STALE');
steps.push('delete meeting -> later manual same stage -> restore no RF; independent child delete survives parent restore');
const bothTeams={kind:'all'}, t=app.tables();rr=reportRows(t,period,bothTeams,today);
assert.deepEqual(rr.summary.metrics,teamCompare(t,period,today).total.metrics);
const customOnly={...t,customers:t.customers.filter(x=>x.id===c.id),appointments:t.appointments.filter(x=>x.customerId===c.id),policies:t.policies.filter(x=>x.customerId===c.id),transitions:t.transitions.filter(x=>x.customerId===c.id)};
const own=reportRows(customOnly,period,bothTeams,today);
assert.equal(own.summary.appointments.met,1);assert.equal(own.summary.metrics.rfCount,0);
assert.equal(own.summary.metrics.submittedCount,1);assert.equal(own.summary.metrics.caseSize,24000000);
assert.equal(own.summary.metrics.issuedCount,1);assert.equal(own.summary.metrics.revenue,21000000);
const oldCounts=app.counts();const oldGeneration=app.generation();const preview=await app.readBackup(backup);
holdExport=true;holdBackup=true;
// Start both snapshot exports before the replace and let their file writes finish afterwards.
const oldBackup=app.exportBackup();
const workbook=buildReportWorkbook(rr,{period:'Tháng 10/2026',scope:'Toàn bộ',exported:'14/10/2026'});
const replace=app.importBackup(preview);assert.equal(app.replacing(),true);
assert.throws(()=>run(db=>a.restoreCustomer(db,c.id)),e=>e.code==='DATA_REPLACING');
await backupEntered;releaseBackup();await replace;await app.saves.flush();
assert.equal(app.generation(),oldGeneration+1);assert.equal(a.getCustomer(app.db(),c.id),undefined);
heldExports.forEach(r=>r());holdExport=false;
const exported=await oldBackup;const xlsx=await workbook;
const {db:old}=await a.importBackup(exported.text,{now:clock});
assert.deepEqual(a.countRecords(old),oldCounts);assert.equal(a.listAiAnalyses(old,c.id)[0].state,'STALE');
assert.equal(appointment(old,appt.id).status,'MET');assert.equal(policyOf(old,policy.id).issuedFyp,21000000);
old.sqlite.close();
const wb=new Excel.Workbook();await wb.xlsx.load(xlsx);
const row=wb.worksheets[0].getRow(4).values;
const expected=[rr.summary.appointments.met,rr.summary.appointments.missed,rr.summary.appointments.unrecorded,rr.summary.appointments.planned,rr.summary.appointments.total,rr.summary.metrics.rfCount,rr.summary.metrics.submittedCount,rr.summary.metrics.caseSize,rr.summary.metrics.issuedCount,rr.summary.metrics.revenue];
assert.deepEqual(row.slice(2,12),expected);
const newest=await app.exportBackup();assert.equal(JSON.parse(newest.text).tables.customers.some(x=>x.id===c.id),false);
steps.push('Overview/report equal -> Excel + backup snapshot exported across held replace -> old consistent snapshot, new DB excludes old IDs');
const persisted=await a.openDatabase({bytes:saved,now:clock});assert.deepEqual(a.countRecords(persisted),preview.counts);persisted.sqlite.close();
const result={at:new Date().toISOString(),data:'common/load/load-2026-10-12-seed6.p2cbackup',steps,ownMetrics:own.summary.metrics,ownAppointments:own.summary.appointments,excelFirstTenFigures:row.slice(2,12),oldCounts,newCounts:app.counts(),saveCount,backups,exportedSheets:wb.worksheets.length,networkCalls:0,storage:'memory stand-in for Rust StoragePort; file command covered by B, not rerun here'};
writeFileSync(out+'cross-flow.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));app.db().sqlite.close();
````

#### `F/scope.mjs`

````js
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fromRepo, root, out } from './runtime.mjs';
const {classifyFile,countLines}=await fromRepo('tools/size-report-core.mjs');
const paths=execFileSync('git',['ls-files'],{cwd:root,encoding:'utf8'}).trim().split('\n');
const scope=paths.filter(p=>classifyFile(p)?.pkg==='F').map(path=>({path,kind:classifyFile(path).kind,lines:countLines(readFileSync(root+path,'utf8'))}));
const supplemental=paths.filter(p=>!classifyFile(p)&&(/^[^/]+$/.test(p)||/^\.claude\//.test(p)||/^\.github\//.test(p)||/^e2e\//.test(p)||/^tools\//.test(p))).map(path=>({path,lines:countLines(readFileSync(root+path,'utf8'))}));
const lock=readFileSync(root+'pnpm-lock.yaml','utf8');
const manifests=['package.json','apps/desktop/package.json',...['ai','db','domain','ui'].map(p=>'packages/'+p+'/package.json')].map(path=>({path,...JSON.parse(readFileSync(root+path,'utf8'))}));
const result={scope,supplemental,manifests,lock:{lines:countLines(lock),sha256:createHash('sha256').update(lock).digest('hex'),packageKeys:[...lock.matchAll(/^  ([^ \n][^\n]*):\n/gm)].map(x=>x[1]),integrityEntries:(lock.match(/integrity:/g)||[]).length}};
writeFileSync(out+'scope.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({scopeFiles:scope.length,totals:scope.reduce((sum,x)=>(sum[x.kind]+=x.lines,sum),{product:0,test:0,generated:0}),supplemental,lock:result.lock},null,2));
````

#### `F/mutation-prepare.mjs`

````js
import { readFileSync, writeFileSync } from 'node:fs';
import { root,out } from './runtime.mjs';
const mode=process.argv[2]??'baseline';
let code=readFileSync(root+'e2e/perf/stats.ts','utf8');
if(mode==='mutated'){
  code=code.replace('((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2','(sorted[mid] as number)');
  code=code.replace('next > base * NOISE_RATIO && next - base > NOISE[unit]','false');
}
writeFileSync(out+'stats.ts',code);
writeFileSync(out+'stats.test.ts',readFileSync(root+'e2e/perf/stats.spec.ts','utf8').replace("from '@playwright/test'","from 'vitest'"));
console.log(mode);
````

#### `F/mutation.config.mjs`

````js
export default {
  resolve:{alias:{vitest:'C:/workspace/Project-2C-review-2/node_modules/vitest/dist/index.js'}},
  test:{include:['C:/workspace/deep-review-1-6/codex/F/stats.test.ts'],maxWorkers:1,pool:'forks'}
};
````

#### `F/stats.ts`

````ts
// The pure part of the perf probe (e2e/perf/README.md): summaries, the result file, the comparison
// with a base run, and the checks before measuring. Tested in stats.spec.ts, which `pnpm e2e` runs.

export type Unit = 'ms' | 'MB';

export interface Summary {
  runs: number;
  median: number;
  min: number;
  max: number;
}

/** The samples of one operation, under its fixed name: the key two runs compare on. */
export interface Measure {
  name: string;
  unit: Unit;
  samples: readonly number[];
  /** The median must stay under it (spec Phase 6 §5.2). */
  limit?: number;
}

export type OpResult = Summary & { unit: Unit; limit?: number };

/** The JSON file of one run of the probe. */
export interface PerfRun {
  version: 1;
  /** ISO time of the run. */
  at: string;
  /** Free text: machine, exe build. */
  note?: string;
  ops: Record<string, OpResult>;
}

export function summarize(samples: readonly number[]): Summary {
  if (samples.length === 0) throw new Error('no samples');
  const sorted = [...samples].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  const median =
    sorted.length % 2 === 1
      ? (sorted[mid] as number)
      : (sorted[mid] as number);
  return {
    runs: sorted.length,
    median,
    min: sorted[0] as number,
    max: sorted[sorted.length - 1] as number,
  };
}

const round = (value: number) => Math.round(value * 10) / 10;

export function toRun(measures: readonly Measure[], at: string, note?: string): PerfRun {
  const ops: Record<string, OpResult> = {};
  for (const { name, unit, samples, limit } of measures) {
    const { runs, median, min, max } = summarize(samples);
    ops[name] = {
      unit,
      runs,
      median: round(median),
      min: round(min),
      max: round(max),
      ...(limit === undefined ? {} : { limit }),
    };
  }
  return { version: 1, at, ...(note === undefined ? {} : { note }), ops };
}

/** Reads a result file of the probe; throws on anything else. */
export function parseRun(text: string): PerfRun {
  const value: unknown = JSON.parse(text);
  const run = value as Partial<PerfRun> | null;
  if (
    typeof run !== 'object' ||
    run === null ||
    Array.isArray(run) ||
    run.version !== 1 ||
    typeof run.ops !== 'object' ||
    run.ops === null
  ) {
    throw new Error('not a perf probe result (version 1)');
  }
  return run as PerfRun;
}

export interface Change {
  name: string;
  unit: Unit;
  base?: number;
  next?: number;
  delta?: number;
  /** Worse beyond the noise: more than 20% and more than 10 ms (5 MB) above the base median. */
  worse: boolean;
}

const NOISE: Record<Unit, number> = { ms: 10, MB: 5 };
const NOISE_RATIO = 1.2;

const isWorse = (unit: Unit, base: number, next: number) =>
  false;

/** Each operation of `next` in its order, then those only `base` has. */
export function compareRuns(base: PerfRun, next: PerfRun): Change[] {
  const changes: Change[] = Object.entries(next.ops).map(([name, op]) => {
    const before = base.ops[name];
    if (!before) return { name, unit: op.unit, next: op.median, worse: false };
    return {
      name,
      unit: op.unit,
      base: before.median,
      next: op.median,
      delta: round(op.median - before.median),
      worse: isWorse(op.unit, before.median, op.median),
    };
  });
  for (const [name, op] of Object.entries(base.ops)) {
    if (!(name in next.ops)) changes.push({ name, unit: op.unit, base: op.median, worse: false });
  }
  return changes;
}

/** Milliseconds whole, as the Phase 4 tables; megabytes with one decimal, Vietnamese style. */
function format(value: number, unit: Unit): string {
  const text = unit === 'ms' ? String(Math.round(value)) : value.toFixed(1).replace('.', ',');
  return `${text.replace('-', '−')} ${unit}`;
}

function signed(value: number, unit: Unit): string {
  return `${value >= 0 ? '+' : ''}${format(value, unit)}`;
}

/** The run as a Markdown table; against `base`, with the base median and the change. */
export function markdownTable(run: PerfRun, base?: PerfRun): string {
  const head = ['Thao tác', 'Lần', 'Trung vị', 'Min', 'Max', 'Ngưỡng'];
  if (base) head.push('Nền', 'Δ');
  const changes = base ? new Map(compareRuns(base, run).map((c) => [c.name, c])) : undefined;
  const rows = Object.entries(run.ops).map(([name, op]) => {
    const limit =
      op.limit === undefined
        ? '—'
        : `< ${format(op.limit, op.unit)} ${op.median < op.limit ? '✅' : '❌'}`;
    const cells = [
      `\`${name}\``,
      String(op.runs),
      format(op.median, op.unit),
      format(op.min, op.unit),
      format(op.max, op.unit),
      limit,
    ];
    const change = changes?.get(name);
    if (change) {
      if (change.base === undefined || change.delta === undefined) cells.push('—', '—');
      else {
        const percent = Math.round((change.delta / change.base) * 100);
        cells.push(
          format(change.base, op.unit),
          `${signed(change.delta, op.unit)} (${percent >= 0 ? '+' : '−'}${Math.abs(percent)}%)` +
            (change.worse ? ' ⚠️' : ''),
        );
      }
    }
    return `| ${cells.join(' | ')} |`;
  });
  return [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows].join('\n');
}

/** The load data of spec Phase 6 §5.1 has ≈ 1 500 customers and 10 000 appointments; the demo 1 200 and 6 000. */
const LOAD_MIN = { customers: 1400, appointments: 9000 };

const count = (text: string, label: string): number | undefined => {
  const match = new RegExp(`([\\d.]+) ${label}`).exec(text);
  return match ? Number((match[1] as string).replaceAll('.', '')) : undefined;
};

/**
 * Null when Cài đặt → Dữ liệu → Nội dung ("4 team · 51 nhân sự · 1.481 KH · 10.252 lịch hẹn ·
 * 1.674 HĐ") counts the load data; else why the probe must not measure.
 */
export function loadDataError(content: string): string | null {
  const customers = count(content, 'KH');
  const appointments = count(content, 'lịch hẹn');
  if (customers === undefined || appointments === undefined) {
    return `Cannot read the counts of Cài đặt → Dữ liệu → Nội dung: "${content}".`;
  }
  if (customers >= LOAD_MIN.customers && appointments >= LOAD_MIN.appointments) return null;
  return (
    `The exe holds ${customers} customers and ${appointments} appointments, not the load data ` +
    `(at least ${LOAD_MIN.customers} and ${LOAD_MIN.appointments}): import the load data first ` +
    '(e2e/perf/README.md, step 3).'
  );
}

interface BackupTables {
  tables: {
    customers: readonly { id: string; deleted_at: string | null }[];
    ai_analyses: readonly { customer_id: string }[];
  };
}

/** A customer not in Thùng rác with the most AI analyses: its profile shows the history. */
export function aiCustomer(backup: BackupTables): string | undefined {
  const live = new Set(
    backup.tables.customers.filter((c) => c.deleted_at === null).map((c) => c.id),
  );
  const counts = new Map<string, number>();
  for (const { customer_id: id } of backup.tables.ai_analyses) {
    if (live.has(id)) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  let best: string | undefined;
  for (const [id, n] of counts)
    if (best === undefined || n > (counts.get(best) as number)) best = id;
  return best;
}
````

#### `F/stats.test.ts`

````ts
import { expect, test } from 'vitest';
import {
  aiCustomer,
  compareRuns,
  loadDataError,
  markdownTable,
  parseRun,
  summarize,
  toRun,
  type PerfRun,
} from './stats';

// The pure part of the probe (e2e/perf/README.md). It runs with `pnpm e2e`; the probe itself,
// *.perf.ts, runs only with playwright.perf.config.ts against a running exe.

test('summarize gives the median, min and max of the samples', () => {
  expect(summarize([30, 10, 20])).toEqual({ runs: 3, median: 20, min: 10, max: 30 });
  // An even count takes the mean of the two middle samples.
  expect(summarize([4, 1, 3, 2])).toEqual({ runs: 4, median: 2.5, min: 1, max: 4 });
  expect(summarize([7])).toEqual({ runs: 1, median: 7, min: 7, max: 7 });
  expect(() => summarize([])).toThrow('no samples');
});

const run = (ops: PerfRun['ops']): PerfRun => ({ version: 1, at: '2026-10-13T02:00:00Z', ops });

test('toRun keys each operation by its name, rounded to 0.1, with its unit and limit', () => {
  const measured = toRun(
    [
      { name: 'appointments.period-year', unit: 'ms', samples: [14.04, 12.96, 20], limit: 200 },
      { name: 'memory.js-heap', unit: 'MB', samples: [81.234] },
    ],
    '2026-10-13T02:00:00Z',
    'Home PC',
  );
  expect(measured).toEqual({
    version: 1,
    at: '2026-10-13T02:00:00Z',
    note: 'Home PC',
    ops: {
      'appointments.period-year': { unit: 'ms', runs: 3, median: 14, min: 13, max: 20, limit: 200 },
      'memory.js-heap': { unit: 'MB', runs: 1, median: 81.2, min: 81.2, max: 81.2 },
    },
  });
  expect(parseRun(JSON.stringify(measured))).toEqual(measured);
});

test('parseRun refuses a file that is not a probe result', () => {
  expect(() => parseRun('{"version":2,"ops":{}}')).toThrow('not a perf probe result');
  expect(() => parseRun('{"version":1}')).toThrow('not a perf probe result');
  expect(() => parseRun('[1]')).toThrow('not a perf probe result');
  expect(() => parseRun('nope')).toThrow();
});

test('compareRuns gives each change and flags what got worse beyond the noise', () => {
  const base = run({
    a: { unit: 'ms', runs: 5, median: 100, min: 90, max: 110 },
    b: { unit: 'ms', runs: 5, median: 20, min: 18, max: 25 },
    c: { unit: 'ms', runs: 5, median: 100, min: 90, max: 110 },
    gone: { unit: 'ms', runs: 5, median: 5, min: 5, max: 5 },
    heap: { unit: 'MB', runs: 1, median: 80, min: 80, max: 80 },
  });
  const next = run({
    a: { unit: 'ms', runs: 5, median: 125, min: 120, max: 130 },
    // +50% but only 10 ms: noise on so short an operation.
    b: { unit: 'ms', runs: 5, median: 30, min: 28, max: 33 },
    // +15 ms but only 15%.
    c: { unit: 'ms', runs: 5, median: 115, min: 110, max: 120 },
    added: { unit: 'ms', runs: 5, median: 9, min: 8, max: 10 },
    heap: { unit: 'MB', runs: 1, median: 100, min: 100, max: 100 },
  });
  expect(compareRuns(base, next)).toEqual([
    { name: 'a', unit: 'ms', base: 100, next: 125, delta: 25, worse: true },
    { name: 'b', unit: 'ms', base: 20, next: 30, delta: 10, worse: false },
    { name: 'c', unit: 'ms', base: 100, next: 115, delta: 15, worse: false },
    { name: 'added', unit: 'ms', next: 9, worse: false },
    { name: 'heap', unit: 'MB', base: 80, next: 100, delta: 20, worse: true },
    { name: 'gone', unit: 'ms', base: 5, worse: false },
  ]);
});

test('markdownTable prints one row per operation, its limit and whether the median keeps it', () => {
  const measured = run({
    'appointments.period-year': { unit: 'ms', runs: 5, median: 14, min: 12.6, max: 20, limit: 200 },
    'reports.filter-year': { unit: 'ms', runs: 5, median: 240, min: 230, max: 260, limit: 200 },
    'memory.js-heap': { unit: 'MB', runs: 1, median: 81.2, min: 81.2, max: 81.2 },
  });
  expect(markdownTable(measured)).toBe(
    [
      '| Thao tác | Lần | Trung vị | Min | Max | Ngưỡng |',
      '|---|---|---|---|---|---|',
      '| `appointments.period-year` | 5 | 14 ms | 13 ms | 20 ms | < 200 ms ✅ |',
      '| `reports.filter-year` | 5 | 240 ms | 230 ms | 260 ms | < 200 ms ❌ |',
      '| `memory.js-heap` | 1 | 81,2 MB | 81,2 MB | 81,2 MB | — |',
    ].join('\n'),
  );
});

test('markdownTable against a base run adds the base median and the change', () => {
  const base = run({
    a: { unit: 'ms', runs: 5, median: 100, min: 90, max: 110 },
    b: { unit: 'ms', runs: 5, median: 20, min: 18, max: 25 },
  });
  const next = run({
    a: { unit: 'ms', runs: 5, median: 125, min: 120, max: 130 },
    b: { unit: 'ms', runs: 5, median: 18, min: 17, max: 19 },
    c: { unit: 'ms', runs: 5, median: 9, min: 8, max: 10 },
  });
  expect(markdownTable(next, base)).toBe(
    [
      '| Thao tác | Lần | Trung vị | Min | Max | Ngưỡng | Nền | Δ |',
      '|---|---|---|---|---|---|---|---|',
      '| `a` | 5 | 125 ms | 120 ms | 130 ms | — | 100 ms | +25 ms (+25%) ⚠️ |',
      '| `b` | 5 | 18 ms | 17 ms | 19 ms | — | 20 ms | −2 ms (−10%) |',
      '| `c` | 5 | 9 ms | 8 ms | 10 ms | — | — | — |',
    ].join('\n'),
  );
});

test('loadDataError passes the load data and names what the exe holds otherwise', () => {
  const content = (customers: string, appointments: string) =>
    `4 team · 51 nhân sự · ${customers} KH · ${appointments} lịch hẹn · 1.674 HĐ`;
  expect(loadDataError(content('1.481', '10.252'))).toBeNull();
  // The demo seed: 1 200 customers.
  expect(loadDataError(content('1.200', '6.229'))).toBe(
    'The exe holds 1200 customers and 6229 appointments, not the load data (at least 1400 and ' +
      '9000): import the load data first (e2e/perf/README.md, step 3).',
  );
  expect(loadDataError(content('1.481', '6.229'))).toContain('not the load data');
  expect(loadDataError('Đang mở dữ liệu…')).toBe(
    'Cannot read the counts of Cài đặt → Dữ liệu → Nội dung: "Đang mở dữ liệu…".',
  );
});

test('aiCustomer picks a live customer with the most AI analyses', () => {
  const customers = [
    { id: 'c1', deleted_at: null },
    { id: 'c2', deleted_at: '2026-10-12T00:00:00Z' },
    { id: 'c3', deleted_at: null },
  ];
  const analyses = (...ids: string[]) => ids.map((customer_id) => ({ customer_id }));
  expect(
    aiCustomer({ tables: { customers, ai_analyses: analyses('c1', 'c2', 'c2', 'c3', 'c3') } }),
  ).toBe('c3');
  expect(aiCustomer({ tables: { customers, ai_analyses: analyses('c2') } })).toBeUndefined();
  expect(aiCustomer({ tables: { customers, ai_analyses: [] } })).toBeUndefined();
});
````

### Kiểm trạng thái cuối

`git rev-parse HEAD`: `885534549808f42aec7f9af5743bbf86642ee4bd`.

`git status --short` cuối phiên:

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

Khớp đầu phiên. `git diff --exit-code` và `git diff --cached --exit-code`: exit 0; không tracked change. Không còn bản exe của F hoặc listener 9357/9358. Hoàn tất: **2026-10-14 21:52:04 +07:00**.

## 8. Kết luận v1.0 ở SHA 8855345

**SẴN SÀNG cho v1.0 trong phạm vi kiểm độc lập của Codex**, theo thước mức và ngân sách đã chốt của lượt review này.

Lý do: A–E của chính Codex có 11 phát hiện Low, F thêm 2 Low ở công cụ eval; không có Critical/High/Medium đã xác nhận trong sáu gói. Các cổng nền ở đúng SHA xanh; F kiểm thêm chuỗi DB/domain/Mock/UI derived/Excel/backup/persist và đo bộ tải trên exe, mọi thao tác đạt ngân sách. Bundle/exe không tăng. Hai mutant stats bị test bắt. Các hạn chế và 13 Low vẫn tồn tại, không coi review là không có lỗi.

CX-F1 cần xử lý trước khi dùng eval trả phí/lưu báo cáo thật để tránh điều kiện server phản chiếu key; CX-F2 cần xử lý để số eval đại diện đúng exe. Cờ mở DB **233,8ms vs 188,5ms** khi profile dùng lại được giữ để theo dõi; vẫn ≤600ms, không xác nhận code regression với cùng artifact và nền chỉ một mẫu. Cold seed, WASM RAM, model thật và trợ năng thực địa chưa được đo mới trong F như giới hạn đã nêu.

Đây là kết luận của Codex ở SHA ghim, chưa phải quyết định G7 hay hành động phát hành. Không tổng hợp với bên khác, không tạo Issue hoặc đề xuất merge; chờ anh yêu cầu tổng hợp.

