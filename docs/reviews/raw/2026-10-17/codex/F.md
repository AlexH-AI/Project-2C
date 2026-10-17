XONG — codex gói F lượt 2, 2026-10-17 15:16:12 +07:00

# Deep review Phase 1–6, lượt 2 — Codex Gói F

## 1. Thông tin phiên

- Bên: Codex; gói F — Xuyên gói, bloat / hiệu năng, công cụ; phiên mới.
- SHA đầu phiên: 4217ed4cd3300af1d63aa61db9eb13902fe75f16, detached, đúng mốc ghim.
- Git status đầu phiên: ?? .agents/; ?? .codex/; ?? AGENTS.md. Ba mục có sẵn được giữ nguyên.
- Bắt đầu: 17/10/2026 14:46:48 +07:00, Asia/Bangkok. Máy DESKTOP-KDURKJP, CPU i9-12900K, Node v24.20.0.
- Công cụ: Codex desktop, PowerShell, Node, Git, pnpm/Vitest/TypeScript/rg/Vite/Playwright/Edge sẵn có. Model: GPT-6 theo hệ thống; biến thể và mức suy luận không được giao diện công cụ cung cấp, không tự suy đoán.
- Bước 0: kiểm đúng tên đầy đủ A–E.md, cả năm XONG; F.md chưa có. Không chạy nghi thức phiên, hook, skill, gh, PR/Issue/merge; không dùng subagent.
- Repo chỉ đọc. Bản chép/probe/log nằm ở C:/workspace/deep-review-1-6-r2/codex/F/. Không mở các thư mục reviewer bị cấm, Project-2, transcript/key thật; không gọi eval-ai.mjs, dịch vụ AI hay ChatGPT.
- Mỗi browser context đã route chặn mọi hostname ngoài 127.0.0.1 và thay window.open trước navigation đầu. UI dùng IPC/OpenCode giả hoặc Mock.
- Kết quả riêng F: 2 Low (1 CONFIRMED, 1 PLAUSIBLE); không có P/B mới. Bảng R gộp: 55 ĐÃ SỬA, 3 SỬA MỘT PHẦN, 1 HỒI QUY, đủ 59 DR6.


## 2. Bảng R riêng gói F

| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| 44 | #601 → #630 | ĐÃ SỬA (F đo) | perf.mjs: có/bỏ ba chỉ mục ở 75/100/150/300/400 KH xóa đều deepEqual; tốt hơn rõ so lượt 1 cùng máy. A/E đã giết đột biến bỏ migration. | 100 KH: 67,512 ms (đo lại 51,623/51,725) so 211; 400 KH: 56,724 so 815. Xem §6b. |
| 55 | #605 → #642 | ĐÃ SỬA | Control 275/275; R55-content 2 test đỏ, R55-mask 3 đỏ. Tái hiện key nguyên văn và hai lớp đồng nhất nay AI_BAD_RESPONSE; lỗi 500 che key. | Biến thể trộn thứ tự theo từng span còn hở → CX2-F2; chỉ key/fetch giả. |
| 56 | #605 → #642 | ĐÃ SỬA | R56-null-cut 2 đỏ; R56-finish 3 đỏ. Test PR giữ null/thiếu content + length thành câu rỗng bị cắt, thử lại rồi ACCEPTED/OK sau hai lần. | Null + stop, số + length, finish_reason lạ vẫn từ chối/lọc theo contract Rust trong 54 test eval. |
| 57 | #605 → #642; #646 | ĐÃ SỬA | R57-untested 2 đỏ; incomplete 1 đỏ. Probe loadPr giả: REST đủ 101 file được đọc; thiếu 1 chặn; base có code chặn, chỉ docs qua. CI ghi cha thứ nhất của merge commit trước Verify; không dùng startedAt. | Biên danh sách commit compare bị cắt → CX2-F1 (PLAUSIBLE ngoài GitHub thật). Không gọi gh. |
| 58 | #605 → #642 | ĐÃ SỬA | R58-config 1 đỏ. CLI retro nguyên văn (chỉ stub homedir/hostname/run git) đọc .claude-b và .claude fixture, in đủ hai nguồn và hai phiên. | Khác hoa/thường cùng thư mục đếm đôi tái hiện được; đã KNOWN tại known.md:164, không tạo ID mới. |
| 64 | #605 → #642 | ĐÃ SỬA | Áp lại P3/P5/S3/S9 trên bản chép: lần lượt 1/1/2/1 test đỏ đúng assertion. Control gốc 275/275 xanh; 11/11 mutant công cụ bị giết. | S3 chạy cả session-core và pr-core; không coi lỗi load/config là test giết. |
| 65 | #606 → #644 | ĐÃ SỬA | Tables: 2/2 ở UTC−11, UTC−7, UTC+12; trả fixture 8855345 ở Los Angeles → 2 đỏ DATE_IN_FUTURE. Stats 9/9; bỏ guard nền 0 → 1 đỏ. AI e2e: sessionId chứa 1984 vẫn xanh; trả quét metadata → assertion 1984 đỏ. | TR-5 Auckland ACCEPTED giữ nguyên; không coi các fixture giờ giả ngoài miền đã chốt là lỗi sản phẩm. |

## 3. Phạm vi đã đọc / rà

Phạm vi F theo classifyFile: 84 file, 3.939 dòng sản phẩm / 12.417 dòng test-hỗ trợ / 4.628 dòng sinh tự động. Mã công cụ, CI, hook, cấu hình và phần sửa đọc theo nhánh/hợp đồng; test/e2e rà setup, helper, case/assertion, diff và mẫu dễ giả xanh trên từng file. test-audit.json lưu toàn danh mục case, số assertion và chỗ cần xem; số dòng dưới đây là chiều dài file để xác định phạm vi, không thay cho bằng chứng chạy test. Không nhận đã chạy lại toàn bộ 227 e2e hoặc toàn bộ verify/Rust của bước chuẩn bị.

Đọc kỹ nhất diff 8855345..4217ed4 của #642/#644/#646/#626, và các e2e đổi theo #614/#616/#618/#623/#628/#630/#632/#634/#636/#638/#640. Diff nguyên văn: reviewed-diff.patch. pnpm-lock.yaml là file sinh: đối chiếu diff/manifest và frozen-lockfile; không audit lại source dependency vendor.

Ngoài inventory: CLAUDE.md gốc; CONTEXT.md; package.json và manifest các package; cấu hình JSON/YAML gốc, .claude/settings.json/launch.json, template GitHub và quy tắc CI/tests; CLAUDE.md package tại điểm nối; spec Phase 3 §4/§6, Phase 4 chỉ số/backup, Phase 5 contract AI/G5, Phase 6 S2-1…S2-6/TR-3/E18–E20/§5; golden chỉ số/lịch hẹn/KYC; docs/metrics/phase-6.md và e2e/perf/README.md.

Lượt 1: tổng hợp §3–§5/§7/§9; sáu báo cáo F đã lưu trong repo (ba bên, hai máy), tập trung phát hiện, kịch bản, đột biến, số đo; các nguồn raw được dùng để xác định ca cũ, không tổng hợp báo cáo lượt 2 của bên khác. Common: prompt-codex.md, plan.md L2, known.md, fixes.md, baseline.md. Gói F được phép đọc báo cáo A–E lượt 2 của chính Codex; bảng gộp chỉ lấy các nguồn ấy và F.

Điểm nối đã kiểm: openAppData/run/tables/persist queue; lệnh customer/appointment/policy/KYC/restore, validation và export/import; teamCompare/reportRows/monthGrid/report-workbook; Mock analysis, CURRENT/STALE; hợp đồng Rust reply/finish_reason, migration 0009/0010 và bản DB vật lý cũ. Không sửa spec/golden/mockup để chiều code.

| File tại SHA ghim | Dòng của file | Loại |
|---|---|---|
| .claude/hooks/handoff-context.mjs | 1–25 | product |
| .claude/hooks/review-pr-hint.mjs | 1–29 | product |
| .dependency-cruiser.cjs | 1–72 | product |
| .githooks/pre-push | 1–13 | product |
| .github/ISSUE_TEMPLATE/config.yml | 1–1 | product |
| .github/ISSUE_TEMPLATE/task.yml | 1–73 | product |
| .github/workflows/ci.yml | 1–157 | product |
| apps/desktop/vite.config.ts | 1–29 | product |
| e2e/anchor.ts | 1–7 | test |
| e2e/appointment-outcome.spec.ts | 1–438 | test |
| e2e/appointments.spec.ts | 1–890 | test |
| e2e/backup.spec.ts | 1–218 | test |
| e2e/chart.spec.ts | 1–69 | test |
| e2e/customer-ai-web.spec.ts | 1–341 | test |
| e2e/customer-ai.spec.ts | 1–891 | test |
| e2e/customer-appointments.spec.ts | 1–143 | test |
| e2e/customer-forms.spec.ts | 1–401 | test |
| e2e/customer-kyc.spec.ts | 1–260 | test |
| e2e/customer-policies.spec.ts | 1–178 | test |
| e2e/customers.spec.ts | 1–156 | test |
| e2e/data-table.spec.ts | 1–199 | test |
| e2e/demo-data.spec.ts | 1–71 | test |
| e2e/dialog-keyboard.spec.ts | 1–188 | test |
| e2e/full-cycle.spec.ts | 1–362 | test |
| e2e/guide/check.guide.ts | 1–21 | test |
| e2e/guide/links.ts | 1–56 | test |
| e2e/guide/shots.guide.ts | 1–216 | test |
| e2e/navigation.spec.ts | 1–279 | test |
| e2e/overview.spec.ts | 1–234 | test |
| e2e/perf/probe.perf.ts | 1–452 | test |
| e2e/perf/stats.spec.ts | 1–161 | test |
| e2e/perf/stats.ts | 1–213 | test |
| e2e/period-picker.spec.ts | 1–301 | test |
| e2e/reports.spec.ts | 1–238 | test |
| e2e/screen-error.spec.ts | 1–73 | test |
| e2e/seed-timing.spec.ts | 1–19 | test |
| e2e/seeded-snapshot.spec.ts | 1–56 | test |
| e2e/seeded-snapshot.ts | 1–12 | test |
| e2e/serve.mjs | 1–43 | test |
| e2e/settings-ai.spec.ts | 1–337 | test |
| e2e/smoke.spec.ts | 1–36 | test |
| e2e/support.ts | 1–303 | test |
| e2e/team.spec.ts | 1–500 | test |
| e2e/theme.spec.ts | 1–74 | test |
| e2e/trash.spec.ts | 1–363 | test |
| eslint.config.js | 1–48 | product |
| packages/ui/scripts/check-tokens.ts | 1–37 | product |
| playwright.config.ts | 1–47 | test |
| playwright.guide.config.ts | 1–38 | test |
| playwright.perf.config.ts | 1–19 | test |
| pnpm-lock.yaml | 1–4628 | generated |
| pnpm-workspace.yaml | 1–7 | product |
| tools/bootstrap.ps1 | 1–211 | product |
| tools/codemap-core.mjs | 1–200 | product |
| tools/codemap-core.test.mjs | 1–197 | test |
| tools/codemap.mjs | 1–95 | product |
| tools/eval-ai-core.mjs | 1–806 | product |
| tools/eval-ai-core.test.mjs | 1–1208 | test |
| tools/eval-ai.mjs | 1–57 | product |
| tools/fixtures/ai-eval.mjs | 1–314 | test |
| tools/handoff.mjs | 1–160 | product |
| tools/load-data-core.mjs | 1–103 | product |
| tools/load-data-core.test.mjs | 1–162 | test |
| tools/load-data.mjs | 1–61 | product |
| tools/merge-pr.mjs | 1–159 | product |
| tools/pr-core.mjs | 1–330 | product |
| tools/pr-core.test.mjs | 1–743 | test |
| tools/pr-status.mjs | 1–157 | product |
| tools/retro-core.mjs | 1–253 | product |
| tools/retro-core.test.mjs | 1–183 | test |
| tools/retro.mjs | 1–62 | product |
| tools/review-hint-core.mjs | 1–27 | product |
| tools/review-hint-core.test.mjs | 1–42 | test |
| tools/session-core.mjs | 1–120 | product |
| tools/session-core.test.mjs | 1–211 | test |
| tools/session-end.ps1 | 1–78 | product |
| tools/session-end.test.mjs | 1–69 | test |
| tools/session-io.mjs | 1–14 | product |
| tools/session-start.ps1 | 1–72 | product |
| tools/size-report-core.mjs | 1–358 | product |
| tools/size-report-core.test.mjs | 1–299 | test |
| tools/size-report.mjs | 1–48 | product |
| tools/status.mjs | 1–77 | product |
| vitest.config.ts | 1–86 | test |

## 4. Kịch bản mới đã thử

N1–N5 là năm chuỗi mới nhiều bước qua nhiều gói. N6–N10 là biến thể/bổ sung; full-cycle gốc và kiểm lại A1 không tính vào chỉ tiêu năm chuỗi mới.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| N1 | Bàn giao A→B, dời lịch, bàn giao B→C, qua ngày, ghi kết quả lịch cũ + hẹn tiếp, HĐ của A, xóa/khôi phục KH, backup roundtrip, Excel theo RE. | Qua openAppData/run/tables: lịch tiếp C, RF của A=1, FYP nộp A=24 triệu, doanh số A=21 triệu; workbook 4 sheet đọc lại được, số Excel khớp Tổng quan/Báo cáo. | — |
| N2 | KH đã bàn giao B; xóa lịch/HĐ của A, xóa RE A, thử khôi phục HĐ, phục hồi A rồi lịch/HĐ, backup và chỉ số. | Bị PERSON_NOT_FOUND đúng; sau phục hồi RF=1/HĐ nộp=1, KH vẫn B; Tổng quan và Báo cáo/roundtrip bằng nhau. | — |
| N3 | KYC NBSP/Cf + ghi chú nhiều dòng → Mock analysis → bàn giao → xác nhận lại chữ chuẩn tương đương → xóa/khôi phục KH → backup → đổi dữ kiện material → backup. | CURRENT giữ qua các bước tương đương; chuyển STALE đúng khi nghề đổi; dòng mới còn sau import; không tự ghi đề xuất. | — |
| N4 | HĐ FYP sát 100 tỷ qua 2025/2026 → đổi ngày và FYP còn 2/1 đồng → bàn giao → xóa/khôi phục → roundtrip → chỉ số hai năm. | Case size 2025=2, doanh số 2026=1, case size 2026=0; không chuyển chỉ số HĐ theo người nhận KH. | — |
| N5 | Đọc preview backup → sửa tên mới hơn preview → backup trước thay bị DISK_FULL → thử lại → lưu → mở lại bytes đã lưu. | Lỗi giữ tên mới/generation 0; thử lại thay về KH F/generation 1; mở lại đúng bản được xác nhận. S2-4/K12, không ghi đè mất giữa chừng. | — |
| N6 | DB vật lý do exe lượt 1 của chính Codex tạo → bản chép → openAppData hiện tại → backup/migrate/save → xuất và đọc backup. | Schema 9→11, quickCheck sạch; 4 team/51 người/1.481 KH/10.262 lịch/1.674 HĐ giữ; hash file gốc nguyên. Export JSON từ dữ liệu giả lập cũ bị rule 4 từ chối theo K1. Chỉ kiểm lớp dữ liệu/port RAM, không nhận đã chạy exe mới trên thư mục đó. | KNOWN K1 |
| N7 | PR 101 file, đọc thiếu 1; base code/docs; compare chỉ có 250 commit docs của chuỗi giả 251 có code ở cuối. | 101 file đủ đọc; thiếu bị chặn; code base chặn; docs qua. Compare cắt thiếu vẫn báo ready. API stub, không gọi GitHub. | CX2-F1 |
| N8 | Key giả nguyên văn/hai lớp đồng nhất/trộn hai thứ tự theo span → adapter 2xx → runEval → mọi partial + file cuối; thêm HTTP 500 Unicode prefix. | Hai dạng cũ chặn; dạng trộn còn trong kết quả và 26 lần ghi partial; lỗi 500 cũng còn dạng trộn. Raw key trong lỗi được che. | CX2-F2 |
| N9 | R65: sessionId cả hai request giả chứa 1984, chạy nguyên test AI của PR; đổi lại quét cả metadata trên bản chép. | Control 1/1 xanh; mutant đỏ đúng not.toContain(1984). Khác với random chờ may rủi, ca này buộc metadata chứa năm. | — |
| N10 | Retro CLI với config custom/default fixture và alias khác hoa/thường trên Windows. | Custom đọc đủ hai thư mục; alias đọc cùng phiên hai lần. Đã mô tả nguyên nhân/hậu quả ở known.md:164, không phát hiện mới. | KNOWN #642 |

Bổ sung: nguyên full-cycle.spec.ts chạy qua UI, IPC giả/Mock, 1/1 xanh; A1 kiểm độc lập bằng paired-export.mjs, cùng kết quả báo cáo A. Không dùng lệnh db trực tiếp để kết luận màn: các chuỗi N1–N5/A1 đều qua AppData.

## 5. Phát hiện mới

### CX2-F1 — Danh sách commit sau tested base chưa kiểm đủ

ID: CX2-F1
Mức: Low
Trục: S
Vị trí: tools/pr-status.mjs:53, :56; tools/pr-core.mjs:173 (4217ed4).
Tình trạng: PLAUSIBLE — đường hàm đã CONFIRMED bằng API stub; không gọi GitHub thật để kiểm ngữ nghĩa/phân trang endpoint.
Liên quan: DR6-57 · biên có từ trước, lượt 1 bỏ sót: 8855345 cũng đọc compare một lần; PR #642 đổi mốc so sánh nhưng còn giữ điểm này. Khác lỗi 100 file PR đã sửa.
Kịch bản: N7.
Mô tả: PR files và annotations đã phân trang, nhưng compare chỉ lấy mảng .commits[].sha một lần rồi tin là đủ. Nếu phản hồi compare bị giới hạn/cắt danh sách, commit code ở phần không đọc sẽ không vào mainSince, nên cổng coi tổ hợp là đã được test.
Tái hiện / bằng chứng: node F/core-probe.mjs, core-results.json: pr-compare-truncated → mainSince=250, blockers=[], comparePaginated=[false], 255 lần gọi bộ nạp giả. compare-fixture.json mô tả total_commits=251, 250 docs được trả, commit code cuối bị bỏ. pr-compare-truncated.txt in ready. Stub của session-io không thể spawn process; không chạy gh. Ngữ nghĩa giới hạn 250 commit của API chưa xác minh trực tiếp trong phiên, nên giữ PLAUSIBLE dù nhánh không kiểm đủ đã chạy thật.
Ảnh hưởng: PR code để lâu qua rất nhiều commit trên main có thể vượt cổng tested base với một phần base chưa được CI thử. Điều kiện hiếm; đây là công cụ dev, không lỗi dữ liệu exe hiện tại.
Đề xuất: phân trang compare, kiểm tổng số commit/quan hệ ahead và chặn khi không đọc đủ; thêm test bộ nạp với trang 2 chứa code. Khoảng 30–70 dòng SP, dưới 400, không dependency mới. Có thể kiểm bằng adapter I/O giả như probe; không cần merge thật.

### CX2-F2 — Key trộn thứ tự escape vẫn vào file kết quả eval

ID: CX2-F2
Mức: Low
Trục: S
Vị trí: tools/eval-ai-core.mjs:132, :144, :236, :788 (4217ed4).
Tình trạng: CONFIRMED.
Liên quan: DR6-55 · biến thể gần có từ trước, lượt 1 bỏ sót; PR #642 còn hở. Cùng nguyên nhân giải mã theo cả chuỗi với CX2-B3 (Rust); ở đây xác nhận đường ghi báo cáo/partial riêng của tools.
Kịch bản: N8.
Mô tả: Bốn readings chỉ dùng hai thứ tự đồng nhất cho toàn chuỗi. Key có span cần JSON→URL xen span cần URL→JSON không hiện nguyên key trong reading nào; reply được nhận và dữ liệu có thể phục hồi thành key được giữ trong báo cáo eval.
Tái hiện / bằng chứng: node F/core-probe.mjs với key hoàn toàn giả sk-review-MIXED-827. Mỗi ký tự chẵn viết dạng backslash-u0025 + mã hex, ký tự lẻ dạng %5Cu00 + mã hex. Raw và hai lớp đồng nhất → AI_BAD_RESPONSE; mixed → accepted. evalMain với fetch giả exit 0, 50 call giả, finalRetainsEncoded=true, partialWritesRetainEncoded=26; file bằng chứng eval-mixed-result.md. node F/extra-probe.mjs: HTTP 500, raw key được che, mixed còn trong serverMessage (eval-error-variants.json). Không có socket AI, key thật hay file repo nào được ghi.
Ảnh hưởng: server/proxy bất thường dội key theo dạng trộn; Owner chạy eval và đưa báo cáo vào repo public có thể mang theo key mã hóa. Cần server bất thường, giữ Low như DR6-55; không gán Critical từ probe key giả.
Đề xuất: nhận/che tổ hợp thứ tự theo từng span, giữ đúng luật không giải JSON hai lần trên cùng span/backslash literal; thêm control âm và ca mixed cho cả Rust lẫn script. Ước lượng dưới 200 dòng SP mỗi phần, cần tách theo giới hạn task nếu làm cả hai cùng test. Không đổi prompt G5.


## 6. Bloat

| Đã chạy / đọc | Dữ liệu / phạm vi | Số / kết quả | ID |
|---|---|---|---|
| TypeScript desktop + e2e --noUnusedLocals --noUnusedParameters --noEmit | Nguyên bản cuối; mọi module app nối vào package | Exit 0, 0 diagnostic. unused.log/e2e-types.log | — |
| codemap:check | Export/route của 5 package | Up to date; chế độ check không ghi | — |
| lint:deps cuối | apps/packages | 0 vi phạm; 315 module / 1.277 dependency | — |
| AST export + rg nơi dùng | 189 file SP TS/TSX/MJS toàn codebase | 1.015 export; 110 type candidate và 74 value candidate không có tham chiếu tên ngoài file | KNOWN/false-positive cần xét nội bộ |
| Nhóm hàm trùng nguyên thân | Thân ≥160 ký tự, bỏ khoảng trắng, ≥3 file | 0 nhóm; không bắt mọi lặp cấu trúc | DR6-67 KNOWN |
| Bundle JS/CSS bình thường | SHA 4217ed4, build-web.log/size.json | 2382036 B raw / 702109 B gzip; so lượt 1 +17.753/+5.038 | — |
| Index / chart / Excel / CSS | Chunk cuối | 909.669 / 513.302 / 929.569 / 28.390 B raw; chart+Excel không tăng | — |
| Exe common (không build lại) | Release chuẩn bị, SHA256 khớp E2C421FD… | 5.404.672 B, −9.728 B so lượt 1; crate-type rlib do B kiểm | R13 ở B |
| Cỡ repo | Theo cùng luật size-report | SP 33.788 (+1.572), test 41.633 (+3.642), generated 4.939 (+22), 386 file (+7) | — |

Các candidate 0 tham chiếu ngoài file không đồng nghĩa code chết: nhiều tên còn dùng nội bộ, import alias, hook gọi qua chuỗi hoặc public API chỉ test dùng. Đã đối chiếu nhóm ấy với DR6-66/67 và known.md: export DB/markName/PLAIN_SLOTS/PersistQueue.unsaved; hàm lặp, CARD/ALERT/LINK, cột báo cáo, loader hook. Không có bằng chứng mới về chi phí để báo lại; không đề xuất refactor mới. Không cài knip, jscpd, visualizer hay cargo-bloat.

Bundle cuối dựng bằng pnpm build:web sau khi đã khôi phục đủ junction, không đặt VITE_DEMO_ANCHOR hay TAURI_ENV_* riêng. Server UI là phép chạy khác, define anchor 15/09/2026 chỉ phục vụ test, không dùng nó tính bundle. Chart/Excel vẫn chia chunk; Excel chỉ import khi xuất. Exe dùng bản chuẩn bị common, không build release lại.

## 6b. Hiệu năng

Máy DESKTOP-KDURKJP. Bộ tải lượt 2: 16.034.517 byte, tables SHA256 1c306cfb8203409337a5fa33c48306694581cb70355eb5526e4cf4f543589591. Số sống: 1.481 KH / 10.255 lịch / 51 người / 4 team / 1.674 HĐ. Pin 14/10/2026 như core-perf của chính Codex Home PC lượt 1 để so cùng khoảng ngày. Mỗi hàm 1 warm-up +9 mẫu (import 5); phần Thùng rác 5 mẫu; phép đo lại riêng 3 warm-up +11 mẫu.

Không chạy test/build/browser/exe của chính phiên trong lúc đo Node. Không thể xác nhận mọi tác vụ nền hoặc phiên reviewer khác; ghi rõ thay vì khẳng định máy hoàn toàn rảnh. Thời gian Node không được dùng như thời gian UI/IPC. Số exe bên dưới tái sử dụng baseline.md cùng máy, không so nền T-219 laptop.

ExportBackup lần đầu có cờ: 246,156 so 179,979 ms (+36,8%); hai process đo lại riêng 240,252/273,745 ms. Không che các số này. Đối chứng tiếp theo dùng hàm exportBackup từ 8855345 và hàm hiện tại, cùng DB tải, luân phiên thứ tự, 9 mẫu: cũ 176,444 (170,047–213,062), hiện tại 177,158 (168,431–194,176), output hoàn toàn bằng nhau. Diff cũng cho thấy phần export không đổi. Vì đối chứng hiện tại trở lại mốc cũ và exe export 422 so 424 ms, chưa xác nhận hồi quy sản phẩm; nguyên nhân các lượt chậm trước chưa truy được, có thể tải nền/GC. Không biến cờ đo đơn lẻ thành finding P hay xóa số bất lợi.

592 assertion kiểm công thức nhóm/góc nhìn/ngày-tuần-tháng-năm so các hàm đơn, teamCompare với reportRows; 600 getter bảng cache không query lại. Số câu SQL listTrash tăng 444→588 so lượt 1 do luật khôi phục mới cần đọc nhóm tại ngày; tổng thời gian vẫn giảm rõ nhờ index. Không coi số câu tăng đơn độc là hồi quy khi đã đo hành vi/thời gian.

| Hàm Node | Lần | Trung vị ms (min–max) | Lượt 1 cùng máy ms | Nhận định / ngưỡng |
|---|---|---|---|---|
| importBackup | 5 | 756,102 (735,785–1182,070) | 728,870 | Đạt; ≤ 1.100 |
| listAppointments | 9 | 45,605 (45,253–47,735) | 47,689 | Đạt; ≤ 65 |
| countRecords | 9 | 4,788 (4,715–4,965) | 4,891 | Đạt; ≤ 15 |
| teamCompare.month | 9 | 1,782 (1,500–2,347) | 2,020 | Đạt; ≤ 15 |
| teamCompare.year | 9 | 2,609 (2,440–4,178) | ≈3,5 (TH lượt 1) | Đạt; ≤ 15 |
| reportRows.month | 9 | 6,217 (5,780–7,443) | 8,655 | Đạt; ≤ 15 |
| reportRows.year | 9 | 7,284 (7,173–8,666) | 7,527 | Đạt; ≤ 15 |
| monthGrid | 9 | 0,605 (0,576–0,917) | 0,638 | Đạt; ≤ 2 |
| listTrash | 9 | 20,649 (19,562–23,702) | 45,587 | Đạt; Màn < 200 (Node tham khảo) |
| exportBackup | 9 | 246,156 (174,816–460,867) | 179,979 | ⚠️; giữ các lần đo lại bên dưới. Exe ≤ 1.000; Node tham khảo |
| write-and-six-tables | 9 | 73,547 (68,712–101,618) | —; seam/nguồn khác | Đạt; Màn < 200 (Node tham khảo) |
| customer-ai-profile | 9 | 0,211 (0,168–0,295) | —; seam/nguồn khác | Đạt; Màn < 200 (Node tham khảo) |

DR6-44, cùng dữ liệu tải; số KH xóa là tổng trong DB, không cộng thêm 15 KH nền:

| KH đã xóa | Dòng trả | Có index ms | Bỏ index ms | Hành vi |
|---|---|---|---|---|
| 75 | 173 | 26,343 | 202,628 | deepEqual |
| 100 | 198 | 67,512 | 254,581 | deepEqual |
| 150 | 248 | 31,609 | 363,366 | deepEqual |
| 300 | 398 | 43,849 | 762,877 | deepEqual |
| 400 | 498 | 56,724 | 905,297 | deepEqual |

100 KH có số ban đầu 67,512 ms, đo riêng lại 51,623/51,725; 150 KH 31,609 cho thấy có nhiễu giữa các lượt. Giữ đủ mẫu, không chọn số tốt nhất để thay số gốc. Mọi hàng đối chứng cùng DB trả cùng nội dung/effect/blocked/order. So mốc Home PC lượt 1: 100 KH 211 ms, 400 KH 815 ms; cải thiện rõ.

Exe dùng số chuẩn bị cùng máy (baseline.md), không đo thêm exe trong F:

| Thao tác | Lượt 2 | Lượt 1 cùng máy / mốc | Ngưỡng / nhận định |
|---|---|---|---|
| app.open-data | 301 ms | 189 ms | ≤600; ⚠️ +113 ms/+60% |
| reload.* (6 màn) | 247–355 ms | 180–293 ms | <500; ⚠️ +62–67 ms/+21–37% |
| Mọi thao tác màn | 2–99 ms (các dòng probe) | Trong baseline cùng máy | <200, đạt |
| trash.open | 73 ms | 80 ms | <200, đạt |
| backup.read / import / export | 814 / 43 / 422 ms | 794 / 49 / 424 ms | ≤2.000 / 500 / 1.000, đạt |
| db.save | 147 ms | 140 ms | ≤400, đạt |
| Excel export | 27 ms | 24 ms | ≤500, đạt |
| Tạo lịch tiếp tháng/năm | 99 / 106 ms | 102 / 106 ms | ≤300; chênh 7 ≤50, đạt |
| JS heap | 16,5 MB | 16,4 MB | ≤21, đạt; không gồm WASM DB |
| Mở lần đầu LCP (3 lần) | 3.526 ms | Phase 4 max 3.937 ms | Không quá 4.724 ms theo luật nhiễu, đạt |
| Build release (ghi lại) | build:exe 104s; cargo 97s | Không có phép so cache cùng Home PC | Không suy ra mức nhanh hơn từ số laptop |

Chi phí mở/reload tăng phù hợp quick_check thêm ≈68 ms mà B đã đo và #620 chủ ý thêm; đó là suy luận có số thành phần, không trace đầy đủ exe. Không bỏ các cờ tương đối dù vẫn đạt ngưỡng tuyệt đối.

## 7. Đếm mức × trục

Riêng F:

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

F: CONFIRMED 1/2, PLAUSIBLE 1/2 (50%, cao); F1 chỉ xác nhận nhánh hàm bằng stub vì phiên cấm gh, giữ rõ giới hạn thay vì nâng thành xác nhận API thật.

Sáu gói Codex (đếm theo ID, không đếm lại 59 dòng R):

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Low | 1 | 2 | 0 | 1 | 0 | 3 | 0 | 0 | 3 | 1 | 11 |
| Nit | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

Tổng 13 ID: 1 Medium, 11 Low, 1 Nit; 12 CONFIRMED, 1 PLAUSIBLE (7,7%). B3/F2 chung họ lỗi nhưng ở hai implementation/đường thoát; số ID không đồng nghĩa số Issue. Alias retro là KNOWN, không thêm ID.

| ID | Mức | Trục chính | Tình trạng | Nội dung / nguồn |
|---|---|---|---|---|
| CX2-A1 | Medium | C | CONFIRMED | K2 nhập bù trước ngày tạo KH bị chặn; DR6-04 hồi quy; F kiểm lại qua app. |
| CX2-A2 | Low | E | CONFIRMED | U+0085 còn lọt luật chữ; DR6-49 sửa một phần. |
| CX2-A3 | Low | D | CONFIRMED | E20 dùng thời gian; cùng mili giây/đồng hồ lùi có thể đổi nhóm. |
| CX2-B1 | Low | T | CONFIRMED | Test chỉ giữ version đồng nhất, không ghim 1.0.0. |
| CX2-B2 | Low | T | CONFIRMED | Bỏ Drop dọn temp Rust vẫn qua test. |
| CX2-B3 | Low | S | CONFIRMED | Key trộn thứ tự escape ở Rust; cùng họ F2. |
| CX2-B4 | Low | T | CONFIRMED | J5 đóng handle cũ chưa được test giữ; DR6-60 sửa một phần. |
| CX2-C1 | Low | E | CONFIRMED | Mock còn nhận dữ kiện người khác/giả định. |
| CX2-D1 | Low | A | CONFIRMED | Nút Bỏ dữ kiện nháp làm focus về body. |
| CX2-E1 | Low | R | CONFIRMED | Dòng Trash chưa nói Không đổi nhóm KH; DR6-01 sửa một phần. |
| CX2-E2 | Nit | C | CONFIRMED | Ví dụ E7 trong nguồn G3 cũ trái spec đã thu hẹp. |
| CX2-F1 | Low | S | PLAUSIBLE | Compare chưa kiểm đủ commit; đường hàm đã chạy, GitHub thật chưa xác minh. |
| CX2-F2 | Low | S | CONFIRMED | Dạng key trộn escape tới partial/result eval; fetch/key giả. |

## 8. Đã xét, không thấy thêm / trục có phát hiện

| Trục | Đã đọc/chạy và kết luận có giới hạn |
|---|---|
| R | Đủ bảy dòng riêng F và bảng gộp 59; 14/14 đột biến F bị giết. Phần cũ đã sửa; biến thể F1/F2 ghi riêng. |
| E | N1–N5, N6 file cũ, N7 phân trang, N8 escape, N9 metadata, múi giờ; không thấy lỗi dữ liệu mới trong năm chuỗi qua app. Alias retro là KNOWN. |
| C | Spec S-2/TR/K18–K21, số theo RE, Excel, contract finish_reason, CI/docs-only/nhãn build-exe, cổng REVIEW, script/load/codemap/size/retro. A1 kiểm độc lập qua app vẫn trái K2; dùng cùng ID gói A. |
| D | N1–N6: transaction, xóa/khôi phục, backup trước thay, lỗi backup giữ dữ liệu/generation, mở lại bytes, checksum file cũ. 592 assertion tải; chưa thấy mất/hỏng dữ liệu mới. DB cũ export bị rule 4 thuộc K1, không tự viết migration dữ liệu giả lập. |
| G | 54 test eval qua pipeline AI thật với fetch giả; Mock CURRENT/STALE xuyên bàn giao/backup; F2 tại ranh giới key. V1–V7 toàn bộ do C kiểm, không nhận F đã làm lại toàn G5. |
| S | CX2-F1/F2. Ngoài chúng: redirect manual, timeout/body cap, file claim wx, partial/rename, mask-before-cut, name/head/risk/CI/EXE gates, script native exit codes. Không gọi gh hoặc key/runtime thật. |
| P | §6b có số, đối chứng index và export, so cùng máy. Exe vẫn đạt mọi ngưỡng; cờ open/reload và các số Node nhiễu được giữ. Chưa có phát hiện P mới. |
| B | AST/rg 189 source/1.015 export, 0 nhóm nguyên thân ≥3 file, tsc, 315 module, codemap, bundle/exe. DR6-25/66/67 vẫn KNOWN/hoãn; không có bloat mới với chi phí chứng minh được. |
| T | Control 275/275 (hai nơi), test stats/zone/browser, 14 mutation assertion đỏ, nguyên full-cycle UI xanh. Rà AST cả phạm vi test F; waitForTimeout 6s của Hủy reload là ca kiểm tác vụ không được chạy, skipIf chỉ cho thiếu pwsh, catch ở eval để kiểm nội dung lỗi. Không thấy only/skip lén. Chạy lại full e2e/coverage/Rust dùng baseline, không nhận đã tự chạy. |
| A | Full-cycle qua role/nhãn tiếng Việt, browser R65, guard token/i18n/codemap; phần focus/contrast của C/D/E chỉ lấy từ chính báo cáo đã xong. Không chạy screen reader hoặc nhận đã làm lại visual audit mọi màn. |


## 9. Phụ lục nguồn, kiểm tra và giới hạn

Tất cả nguồn dưới đây ở F/ cạnh báo cáo, trừ báo cáo A–E/probe cũ của chính Codex được ghi rõ. Không có source/report của reviewer lượt 2 khác.

| Nguồn | Công dụng / kết quả |
|---|---|
| prepare.mjs; copy/; scope.json; reviewed-diff.patch | Bản chép tracked, inventory/hash F, diff sửa. Git index riêng chỉ để test ls-files, không commit bản chép review. Test session-end tự tạo/commit/push vào remote Git tạm cục bộ rồi dọn theo bộ test; không chạm GitHub/repo gốc. |
| tools-control.log; tools-final.log | 9 file / 275 test xanh; lần cuối chạy trực tiếp repo nguyên bản. |
| mutations.mjs; mutations.json; R55*/R56*/R57*/R58*/R64*.log | 11 mutant công cụ trên bản chép, phục hồi từng file bằng finally; 11 bị giết đúng assertion. |
| core-probe.mjs; core-results.json; pr-io/; pr-*.txt; compare-fixture.json | I/O gh chỉ là hàm stub; >100 PR files, tested base, docs/code, compare cắt thiếu. Không có gh process/network. |
| eval-mixed-result.md; extra-probe.mjs; eval-error-variants.json | File kết quả và mọi write được giữ trong Map/probe. Key hoàn toàn giả; 50 fetch giả, 0 call AI thật. |
| cross.mjs; cross-results.json; N1.xlsx | N1–N5 qua openAppData/run/tables; invariants/roundtrip; ExcelJS đọc workbook và kiểm số theo RE. |
| legacy-open.mjs; round1-data-copy.db; legacy-open.json | DB của own round-1 exe-run; đọc/copy, mở qua app hiện tại bằng storage RAM, hash source nguyên. Không mở exe mới thật trong thư mục cũ. |
| paired-export.mjs; old-backup.ts; export-paired.json; A1-app-recheck.json | Đối chứng hàm export 8855345/current trên cùng DB; kiểm lại A1 ở seam app. |
| perf.mjs; perf-results.json; perf-repeat*.json | Tải đúng hash, số gốc/đo lại/index đối chứng, từng mẫu giữ đầy đủ. Không chạy exe perf mới. |
| R65.mjs; R65-results.json; R65-*.log | Ba TZ control; stats control 9 xanh/1 mutant đỏ; tables fixture cũ 2 đỏ. |
| prepare-ui.mjs; serve-ui.mjs; copy/e2e/safe.ts; browser-check.mjs | Server 127.0.0.1:4339, fixture chặn mạng/window.open từ đầu. AI metadata control 1 xanh, full-cycle 1 xanh (~29,9s), mutant metadata 1 đỏ đúng 1984. Đã dừng server bằng Ctrl+C. |
| retro-probe.mjs; retro-io/; retro-fixtures/; retro-results.json | CLI chỉ đọc fixture. Case alias đếm 1 phiên hai lần là KNOWN, không tính phát hiện mới. |
| bloat.mjs; bloat.json; export-refs.json; test-audit.mjs/.json | AST/rg toàn source/test theo phạm vi; quét là candidate, không tự gán dead code. |
| deps.log; codemap.log; unused.log; e2e-types.log; build-web.log; size.json | Kiểm cuối: deps 315/1.277, codemap mới, unused/types sạch, bundle cuối trùng baseline lượt 2. |
| common/baseline.md; common/perf/perf-ref-r1.json | Tái sử dụng verify 2.898 test/113 file, 101 Rust, 227 e2e và coverage 99,03/96,99/98,93/99,28%; không chạy lại toàn bộ trong F. |

Đột biến ngoài tools: R65-stats, R65-message, R65-tables → mỗi loại đều bị giết. Tổng F 14/14 mutant, 0 sống. Các lần lỗi import/config/harness không được tính là mutation kill.

Hiệu chỉnh và tác dụng phụ của harness:
- Lượt pnpm đầu trong copy từ chối node_modules junction nhưng đã đổi tám junction @p2c của repo sang copy. Không phải lỗi sản phẩm. Đã khôi phục từng junction sau kiểm đường dẫn/target; pnpm offline/frozen một mình không sửa đủ, nên repair-links.mjs unlink đúng junction và trỏ lại package gốc. Graph cuối về 315 module / 1.277 dependency; bundle cuối đúng 2.382.036/702.109 byte. Các log trước sửa link không dùng làm kết quả cuối. Chỉ cache/dependency link bị ignore đổi; source, lockfile, cấu hình tracked nguyên.
- Control bản chép đầu thiếu Git index: 274/275; đã tạo index riêng không commit, chạy lại 275/275. Đó là lỗi harness.
- Probe cross ban đầu sửa import Windows thành file URL; IS cần teamId:null; today ghim phải cố định khi clock dịch ngày; MET cần nextStep; addKycNote không phải export package nên dùng recordKycNote. Chỉ các lượt cross.log cuối đủ N1–N5 mới làm bằng chứng; không báo lỗi sản phẩm từ fixture chưa hợp lệ.
- Một lệnh node -e tóm tắt số đo và một lượt functions.exec soạn script lỗi cú pháp trước khi chạm sản phẩm; đã dùng file script. R65/schema/table mutants có assertion lỗi nghiệp vụ thật, không lỗi import.
- CIM dùng để nhận PID server bị Access denied; dừng server qua session Ctrl+C, kiểm kết nối local trong guard cuối. Không có action bị auto-review từ chối hay việc còn chờ quyền.
- Không cài tool mới; không chạy script nghi thức hay eval CLI thật. Không sửa lỗi, spec, golden, prompt, commit repo, tạo Issue/PR hay đề xuất merge.


| ID | Kết quả control/mutant |
|---|---|
| R55-content |  Test Files  1 failed (1);       Tests  2 failed \| 52 passed (54); ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯; source bản chép phục hồi |
| R55-mask |  Test Files  1 failed (1);       Tests  3 failed \| 51 passed (54); ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯; source bản chép phục hồi |
| R56-null-cut |  Test Files  1 failed (1);       Tests  2 failed \| 52 passed (54); ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯; source bản chép phục hồi |
| R56-finish |  Test Files  1 failed (1);       Tests  3 failed \| 51 passed (54); ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯; source bản chép phục hồi |
| R57-untested |  Test Files  1 failed (1);       Tests  2 failed \| 70 passed (72); ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯; source bản chép phục hồi |
| R57-incomplete |  Test Files  1 failed (1);       Tests  1 failed \| 71 passed (72); ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯; source bản chép phục hồi |
| R58-config |  Test Files  1 failed (1);       Tests  1 failed \| 14 passed (15); ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯; source bản chép phục hồi |
| R64-P3 |  Test Files  1 failed (1);       Tests  1 failed \| 71 passed (72); ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯; source bản chép phục hồi |
| R64-P5 |  Test Files  1 failed (1);       Tests  1 failed \| 71 passed (72); ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯; source bản chép phục hồi |
| R64-S3 |  Test Files  2 failed (2);       Tests  2 failed \| 99 passed (101); ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯; source bản chép phục hồi |
| R64-S9 |  Test Files  1 failed (1);       Tests  1 failed \| 28 passed (29); ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯; source bản chép phục hồi |
| R65-stats | 9/9 xanh; bỏ nền 0 → 1 đỏ / 8 xanh |
| R65-message | SessionId 1984: 1 xanh; quét metadata → 1 đỏ |
| R65-tables | 3 TZ ×2 xanh; fixture 8855345 ở Los Angeles → 2 đỏ |

Trạng thái cuối (kiểm lại sau mọi probe):

- HEAD: 4217ed4cd3300af1d63aa61db9eb13902fe75f16.
- git status --short:

~~~text
?? .agents/
?? .codex/
?? AGENTS.md
~~~

- git diff HEAD: rỗng; 84/84 hash F trùng đầu phiên; đủ tám junction workspace trỏ về package gốc; mọi source mutant đã phục hồi trên bản chép.
- Server 4339 đã dừng (kết nối local: ECONNREFUSED); không mở exe hay chiếm 4173/9222 trong F.
- Chi tiết guard: F/final-check.json. Giờ xong: 2026-10-17 15:16:12 +07:00.

## 10. Bảng R gộp đủ 59 DR6

Chỉ từ A–E.md lượt 2 của Codex và phần F ở trên. Khi cùng DR6 có nhiều seam, lấy kết luận còn thiếu/hồi quy; giữ nguồn và phạm vi. DR6-01: dữ liệu đã sửa nhưng dòng Trash thiếu; DR6-04: UI lấy nhóm tại ngày đúng nhưng K2 hồi quy. DR6-44 lấy số đo F, test mutation ở A/E.

| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú | Gói nguồn |
|---|---|---|---|---|---|
| DR6-01 | #592 → #614 | SỬA MỘT PHẦN | UI E18/E19 khôi phục được, không thêm transition; E20 chặn đúng; M01 làm 6/27 test trash đỏ. | Lỗi dữ liệu lượt 1 đã hết. Dòng bảng chưa có “Không đổi nhóm KH” theo mục tiêu #592 → CX2-E1; hộp xác nhận đúng. A xác nhận dữ liệu đã sửa; E thiếu dòng hiển thị, lấy kết luận chặt hơn. | A, E |
| DR6-02 | #594 → #618 | ĐÃ SỬA (phần A) | Bàn giao hai lần chuyển đúng 2 lịch Dự kiến; lịch Dời, quá hạn, đã hủy, đã xóa giữ RE. Mutant R02: 2 test đỏ; R02-next: 1 test đỏ. | Kiểm cả rollback COMMIT lỗi, RE của hẹn tiếp. Phần UI do D/E kiểm. | A, D, E |
| DR6-03 | #592 → #614 | ĐÃ SỬA | E19 nhận không thêm transition; E20 trả TRANSITION_BEFORE_LATEST. Mutant R03 bỏ so thứ tự ghi: E20 đỏ; R03-kept-reapplied: E19 đỏ. | Biên cùng mili giây còn hở: CX2-A3. | A |
| DR6-04 | #593 → #616 | HỒI QUY | Ca cũ sửa ngày qua chuyển tay nay kiểm lại đúng; mutant R04: 2 test đỏ. Nhưng nhập bù MET trước ngày tạo KH (K2) từng được nay bị chặn; backup cũ từ lệnh bị rule 4. | CX2-A1, bằng chứng precreation.log. Phần 6c/6f của E kiểm riêng. E xác nhận 6c/6f đúng nhóm tại ngày; A và F xác nhận hồi quy nhập bù K2, nên gộp là HỒI QUY. | A, E |
| DR6-05 | #593 → #616 | ĐÃ SỬA | Chuyển tay lùi qua MET → TRANSITION_BEFORE_MEETING; rút move đang được giữ → STAGE_KEPT_BY_MEETING, DB không đổi. Mutant R05a / R05b: mỗi cái 1 test đỏ. | Cùng ngày vẫn cho chuyển tay; đóng rồi mở lại N3 và khôi phục giữ nhóm roundtrip được. | A |
| DR6-06 | #595 → #620 | ĐÃ SỬA | Control 104 JS xanh; bỏ chặn damage làm ca “refuses a file damaged inside…” đỏ (R06-quick-check.log). Trên bộ tải lượt 2, phá trang 858, 1717, 2576 → DATA_DAMAGED, không backup/save ở cả ba. | KNOWN: quickCheck chạy sau migrate, có giới hạn schema ≤6 (known.md:121). Không ghi lại thành phát hiện. | B |
| DR6-07 | #595 → #620 | ĐÃ SỬA | 101 Rust xanh gồm file DB bị giữ, tmp bị giữ, lock chỉ đọc, StorageFull. Bỏ mapping held-db / DISK_FULL đều làm ca tương ứng đỏ (R07-held-db.log, R07-full.log). 16 test startup/SaveWarning/close xanh. | Lỗi lưu khi import rồi flush phục hồi ở N1; lỗi lưu và CloseGuard thực trên exe ở N12. Đĩa đầy dùng seam, không làm đầy ổ thật. | B |
| DR6-08 | #595 → #620 | ĐÃ SỬA | Trả openFrom về persist(bytes) làm test snapshot cuối đỏ (R08-migrate.log). File v0 có notes ở đường nhập test và ở startup N4 → schema 11, notes còn. | Raw schema được đọc không tự migrate; không lặp sai phép kiểm lượt 1. | B |
| DR6-09 | #595 → #620 | ĐÃ SỬA | Bỏ dọn backup tmp → 1 storage test đỏ (R09-cleanup.log); ca folder/foreign-name giữ nguyên. Đếm test control trong thư mục riêng: 0 thư mục sót. N8 kiểm tmp bị giữ qua reload / process mới. | Bỏ Drop còn sống 58/58, để lại 53 thư mục trong phép đo riêng → CX2-B2, khoảng hở test mới. | B |
| DR6-10 | #596 → #617 | ĐÃ SỬA | Hai hướng của tái hiện cũ nay BAD_RESPONSE / che ***. Bỏ riêng Json→URL hoặc URL→Json đều làm “the_key_in_two_layers…” đỏ (R10-json-url.log, R10-url-json.log). Backslash JSON hợp lệ vẫn được nhận. | Trộn hai thứ tự trong cùng key: CX2-B3. Đây là biến thể có từ trước, không gọi là hồi quy do #617. | B |
| DR6-11 | #596 → #617 | ĐÃ SỬA | Nới 128→129 làm test wrong_arguments đỏ (R11-model.log). N7: ASCII 128 nhận; 129 / emoji / tab / U+200B từ chối; tên Org_1/a.4:free nhận. | Không thấy đường model sai đi tới key hoặc mạng trong ca đã chạy. | B |
| DR6-12 | #596 → #617 | ĐÃ SỬA | Ba cấu hình app đều 1.0.0; Cargo.lock entry project2c cùng version. PE FileVersion và ProductVersion của exe common đều 1.0.0. Trả một file về 0.1.0 làm test đỏ. | Trả đồng loạt cả ba vẫn 14/14 xanh → CX2-B1. Không nói exe hiện tại sai version. | B |
| DR6-13 | #596 → #617 | ĐÃ SỬA | Cargo.toml chỉ rlib; trả staticlib/cdylib làm test contract đỏ (R13-crates.log). Test cũ Rust xanh; exe release baseline đã build và probe chạy được, 5.404.672 byte. | Home PC không có số build lượt 1 cùng cache để so 11,5 s. Dùng mốc chuẩn bị 104 s / cargo 97 s và kiểm cấu hình; target/release tại worktree này chưa tồn tại, không suy thành số tiết kiệm target đã đo. | B |
| DR6-14 | #596 → #617 | ĐÃ SỬA | Trả quyền/CSP cũ làm test contract đỏ (R14-capability.log, R14-csp.log). Exe: 4 lệnh thừa bị ACL từ chối; nhập/xuất/mở folder được; base-uri/form-action bị CSP chặn; đóng sạch và CloseGuard khi chưa lưu đều qua. | Không gọi open_chatgpt thật vì prompt cấm mở chatgpt.com. Test Rust dựng command với Explorer full path + URL hằng, không spawn browser. Mock/S2-3 qua 15 test seam, không gọi dịch vụ thật. | B |
| DR6-15 | #598 → #628 (`e6c9078`) | **ĐÃ SỬA** | `core-probe.mjs`: phiên trước nhập backup cùng ID, dán đúng hoặc sai đều `discarded`, 0 dòng mới; phiên mở sau nhập lưu CURRENT. `web-boundaries.mjs`: mở trong lúc thay / thay xong khi copy còn chờ đều mang generation 0, dữ liệu mới generation 1, dán bị loại. `webChip` vẫn trả v2 khi phiên bản cũ không còn. **M1** bỏ kiểm generation: 1/57 test đỏ, chính ca nhập cùng ID của PR. | Thay thất bại giữ generation và phiên lưu lại được, attempts=1. Đang thay trả `replacing` là ACCEPTED #628, theo S2-2/4; không báo lại. Copy/open sau await vẫn có thể xảy ra cho dữ liệu cũ: KNOWN #628, probe xác nhận không lưu nhầm. | C |
| DR6-16 | #598 → #628 | **ĐÃ SỬA** | 295 chữ + 10 U+200B đạt; 301 chữ bị V1. `Kh`, `kH`, `Re`, `rE`, `Sư` ở ngoại lệ luật đạt; “Luật Khoa học và Công nghệ” vẫn V6. **M2** quay về đếm cả Cf: 2/80 test đỏ; **M3** quay KH/RE về chữ hoa: 2/109 test đỏ. | 300 ký tự NFC tạo từ `e + Cf + dấu sắc` đạt, biên 299 chữ + emoji đạt / 300 chữ + emoji bị V1. Các đường lọt V3–V6 thuộc DR6-17 đã hoãn, không tính mới. | C |
| DR6-18 | #598 → #628 | **ĐÃ SỬA** | Seed hiện dùng `PROMPT_VERSIONS[mode]`, analysis/discovery @2. `seed-control`: ca “has a few Mock analyses…” xanh; **M12** đổi ngay chỗ ghi seed về `${mode}@1`: chính test seed đỏ. **M11** đổi hằng analysis về @1: test khớp version prompt đỏ. | Không dùng sự tồn tại của hằng làm bằng chứng duy nhất. `schema.test.ts` giữ hằng ↔ prompt, `seed.test.ts` giữ seed ↔ hằng. Các @1 của fixture lịch sử cũ là hợp lệ, không đổi toàn bộ @1. | C |
| DR6-19 | #598 → #628 | **ĐÃ SỬA** | Năm ca gốc về em trai/con trai, phủ định, “9 con số” đều 0 đề xuất; “KH đã kết hôn, có 2 con” vẫn hai đề xuất. **M4** bỏ `aboutTheKh`: 6/38 test đỏ; **M15** bỏ riêng loại trừ “con số”: 1/38 test đỏ. | Biến thể ngoài năm ca gốc vẫn hở → **CX2-C1**. Hai âm tính giả với “KH có 2 con, đã kết hôn” / “bạn học cũ” đã có KNOWN, không tạo ID mới. | C |
| DR6-20 | #603 → #638 (`e8d340a`) | **ĐÃ SỬA** | Edge: Enter trên Hủy và Thử lại giữ focus ở SPAN ghi chú khi request đang giữ và sau Hủy. **Nguyên test PR** `customer-ai.spec.ts:816` xanh ở control; bỏ hai `thenFocus` trên bản chép → đỏ tại `:837`, “Expected: focused / Received: inactive”. Probe riêng xác nhận cả hai về BODY khi bỏ sửa. | Không chỉ kiểm click chuột/trạng thái. Lệnh AI là stub, khóa runner vẫn giữ tới khi request trả. | C |
| DR6-21 | #599 → #632 (`35ba0d3`) | **ĐÃ SỬA** | Control nguyên test PR `customer-ai.spec.ts:70` xanh. **Đột biến opacity-85 → opacity-50**: chính test đỏ, expected ≥4,5, received **2,493574**. Phép đo bổ sung chuẩn hóa màu qua canvas và trộn alpha/opacity: STALE discovery/cổng chặn 31 node, analysis gồm personalityNotes khi STALE/đang chạy/đang hủy 57 node, chi tiết lịch hẹn 19 node: thấp nhất đều **4,806871:1**. CURRENT analysis thấp nhất 5,614963. | Mockup `.faded` 0,85 + thẻ rỗng viền đứt khớp app. Đã kiểm cả khối AI ở lịch hẹn; không suy chỉ từ việc dùng chung Item. | C |
| DR6-22 | #598 → #628; #599 → #632 | **ĐÃ SỬA** | `SettingsAi.tsx:309` và `ai.html:465` nay 1 024; `connection.ts:13` maxTokens 1_024; golden ai-eval dòng 13 nói reasoningEffort true; `vi.ts:250` là “200.000”. **M13** đổi chữ về “200 000”: test panel đỏ. | Phần comment/mockup/golden kiểm trực tiếp và diff; không gán test hành vi cho một dòng comment. | C |
| DR6-26 | #602 → #636 | ĐÃ SỬA | e2e IS only reviews xanh; mutant R26 unit 1 failed | Ca TL vừa đánh giá vừa phối hợp trong unit; KH đã xóa + câu PERSON_IN_USE là KNOWN | D |
| DR6-27 | #597 → #623 | ĐÃ SỬA | e2e KYC xanh; mutant R27 unit 3 failed | N3: ba trường tiền ×7 đầu vào + trường nghề nghiệp, hint/aria-describedby khớp | D |
| DR6-28 | #597 → #623 | ĐÃ SỬA | e2e KYC xanh; mutant R28 unit 2 failed | N6: 3 giá trị cùng ngày F1/F2/F3, 7c đọc đủ mã, giải quyết về F2 | D |
| DR6-29 | #597 → #623; #607 → #619 | ĐÃ SỬA | R29 unit 1 failed; R29-material e2e đỏ; docs ghi ô Kỳ tại docs/testing/nghiem-thu-v1.md:387 | Không tính RF / chuyển tay / material khớp; ô Kỳ chấp nhận không làm | D |
| DR6-30 | #597 → #623 | ĐÃ SỬA | e2e bố cục xanh; R30-e2e đỏ; ảnh profile-1440/1100.png đã xem | 376px×3 tại 1440; 402px×2 tại 1100; không tràn ngang trên KH seed đã thử | D |
| DR6-31 | #602 → #636 | ĐÃ SỬA | e2e ngoài góc nhìn xanh; R31-e2e đỏ | N1: ẩn ở Toàn bộ, hiện lại khi về RE cũ — câu vẫn đúng, không coi là lỗi mới | D |
| DR6-32 | #602 → #636 | ĐÃ SỬA | e2e hai team >100 RE xanh; R32-e2e đỏ | Sort/Hiện thêm và reset qua team đã có trong lượt control | D |
| DR6-33 | #602 → #636 | ĐÃ SỬA | R33 unit 1 failed, R33-day và R33-gender e2e đỏ; control xanh | Lỗi khóa ghi chỉ giữ bằng unit theo giới hạn UI modal đã nêu ở PR | D |
| DR6-34 | #603 → #638 | ĐÃ SỬA | control asExe xanh; R34/BR3/BR4 unit bị giết; exe-ui.json trên exe release đúng hash | CDP Input gửi phím và chuột, hộp/bản nháp/URL nguyên; chưa dùng phần cứng chuột/bàn phím thật | D |
| DR6-35 | #603 → #638 | ĐÃ SỬA | R35-route/foot/more e2e đều đỏ, control xanh | Biến thể Bỏ dữ kiện ngoài Issue ghi CX2-D1; không ghi là lỗi của ba nút đã sửa | D |
| DR6-36 | #607 → #619 | ĐÃ SỬA (ghi lệch theo Owner) | docs/testing/nghiem-thu-v1.md:388–391 đủ bốn điểm, đối chiếu form và mockup | 5c không ghi ngày sinh cũ; 7c không cảnh báo trước; 7a thiếu hạng mục/cốt lõi; hai nhãn tạo KH | D |
| DR6-38 | #600 → #634 | ĐÃ SỬA | UI 6h qua giao thừa giữ 31/12/2026 và từ chối ngày đã qua; 6f lưu Hủy giữ ngày; 8b phát hành đúng 31/12/2026. M38a: 3/20 đỏ, M38b: 3/21 đỏ. | Unit openDraft còn kiểm 8a/8d và người gõ đè ô ngày; không tự đổi năm. | E |
| DR6-39 | #600 → #634 | ĐÃ SỬA | expectedCaseSize chỉ lấy cuộc gặp mới nhất; M39 khôi phục điều kiện bỏ null → 1/21 đỏ. | N5 chạy trên app.tables sau chuỗi có cuộc gặp mới không ước lượng; không lấy số cũ. Test cùng ngày/giờ và lịch không Đã gặp vẫn xanh. | E |
| DR6-40 | #600 → #634 | ĐÃ SỬA | UI sửa FYP nộp 24→30 tr, phát hành 21 tr: “khác FYP nộp −9 tr”; M40 so bản đã lưu → 1/21 đỏ. | N4 hai năm, FYP sát 100 tỷ và 1–2 đồng: chênh đúng; dòng ảnh hưởng vẫn so bản đã lưu. | E |
| DR6-41 | #600 → #634 | ĐÃ SỬA | UI dời tháng nộp/phát hành 09→08: đủ 4 dòng −24/+30/−21/+21 tr; M41 bỏ ảnh hưởng khi đổi tháng → 1/21 đỏ. | N4 dời qua hai năm, số tháng/năm/delta đúng. Số đếm HĐ không hiện trong preview là KNOWN #634, không báo lại. | E |
| DR6-42 | #600 → #634 | ĐÃ SỬA | UI kèm lịch 01/11 chuyển kỳ/ngày và chọn lịch mới; nguyên test e2e PR sửa xanh ở control; gỡ onShow: test “no-show with a next…” đỏ (M42-e2e.log). | Lịch mới dùng RE hiện tại sau bàn giao; helper revealCreated có test xóa lọc che khuất / ngoài góc nhìn. | E |
| DR6-43 | #601 → #630 | ĐÃ SỬA | UI cột Bản ghi không có nút sắp, Thao tác có tên ẩn, nút mô tả lý do; HĐ ngày mai tự bật qua nửa đêm. M43: 3/56 đỏ; M43-day làm nguyên e2e TR-5 đỏ. | Không cần ghi phụ để làm mới; control test toHaveAccessibleDescription đúng câu. Không chạy screen reader thực. | E |
| DR6-44 | #601 → #630 | ĐÃ SỬA (F đo) | perf.mjs: có/bỏ ba chỉ mục ở 75/100/150/300/400 KH xóa đều deepEqual; tốt hơn rõ so lượt 1 cùng máy. A/E đã giết đột biến bỏ migration. | 100 KH: 67,512 ms (đo lại 51,623/51,725) so 211; 400 KH: 56,724 so 815. Xem §6b. | A, E, F |
| DR6-45 | #601 → #630 | ĐÃ SỬA | UI Nạp lại→Nhập chỉ còn thông báo nhập; nguyên e2e control xanh; M45 bỏ điều kiện showsNotice làm nguyên test PR đỏ do có 2 status. | Thông báo / state lặp là KNOWN #630; không ghi lại bloat. | E |
| DR6-46 | #597 → #623 | ĐÃ SỬA | UI Năm 2026 · 01/01 – 17/10/2026 · Toàn bộ; 2 nguyên e2e Tổng quan/Báo cáo control xanh; M46 bỏ dấu làm cả 2 đỏ. | Tháng MTD vẫn không thêm dấu trước khoảng ngày; unit viewingText giữ range/MTD, workbook meta giữ kỳ. | E |
| DR6-47 | #607 → #619 | ĐÃ SỬA | NT-TQ-06 và “Lệch mockup đã biết”: tròn 60%/100%/0%, không tròn 66,7%; workbook numFmt 0.0%. Các test golden ở overview/team-compare/reports/workbook xanh. | Owner chọn giữ golden; đối chiếu docs và app, không áp dụng gỡ code cho mục docs được chấp nhận. | E |
| DR6-48 | #607 → #619 | ĐÃ SỬA | Danh sách lệch đã có đủ: 6c thiếu lần n; nhãn nhóm lịch; công thức tỉ lệ; meta Theo RE/Theo mốc; Nội dung 5 loại không có KYC; chú giải lịch không có Trong kỳ. Đọc code/vi.ts/mockup/NT. | Các dòng mô tả khớp source UI ở SHA ghim. Đây là ghi lệch theo Owner, không mutation sản phẩm. E7 mới ở CX2-E2 là khác các lệch của DR6-48. | E |
| DR6-49 | #604 → #640 | SỬA MỘT PHẦN | NFC, Cf, NBSP, giữ xuống dòng KYC đã đúng; mutant R49: 5 test đỏ. U+0085 thuộc Unicode White_Space vẫn giữ nguyên, tên chỉ U+0085 được nhận, backup cũng nhận. | CX2-A2; K20 yêu cầu mọi khoảng trắng Unicode. | A |
| DR6-50 | #604 → #640 | ĐÃ SỬA | Import conflict 2 / 2.0 → BACKUP_INVALID; mutant bỏ distinct: 3 test đỏ. | Test 2/3/4 được nhận; so giá trị JSON đã đọc, không so chữ. | A |
| DR6-51 | #604 → #640 | ĐÃ SỬA | Probe vai trò/giới tính sai → INVALID_CHOICE; nhóm sai → INVALID_TRANSITION. Gỡ requireChoice → 2 test lỗi CHECK thay mã. | Nhánh vai trò đang dùng ưu tiên lỗi PERSON_IN_USE hợp lý, không raw CHECK. | A |
| DR6-52 | #604 → #640 | ĐÃ SỬA | Test mở DB v10 có dữ liệu giữ hàng/FK xanh. Gỡ CHECK people_team_none ở migration 0010 → 2 test đỏ. | Nhập backup cũng bị CHECK chặn trước luật 9; không cần mã rule. | A |
| DR6-54 | #607 → #619; #604 → #640 | ĐÃ SỬA | Golden lich-hen.md có đoạn L-09/A09 nói rõ dữ liệu trước DR-47; comment model/count/seed khớp luật không RE. Unit coordinator + golden đều xanh. | Quyết định là ghi chú, giữ fixture; không đột biến văn bản đã được Owner chấp nhận. | A |
| DR6-55 | #605 → #642 | ĐÃ SỬA | Control 275/275; R55-content 2 test đỏ, R55-mask 3 đỏ. Tái hiện key nguyên văn và hai lớp đồng nhất nay AI_BAD_RESPONSE; lỗi 500 che key. | Biến thể trộn thứ tự theo từng span còn hở → CX2-F2; chỉ key/fetch giả. | F |
| DR6-56 | #605 → #642 | ĐÃ SỬA | R56-null-cut 2 đỏ; R56-finish 3 đỏ. Test PR giữ null/thiếu content + length thành câu rỗng bị cắt, thử lại rồi ACCEPTED/OK sau hai lần. | Null + stop, số + length, finish_reason lạ vẫn từ chối/lọc theo contract Rust trong 54 test eval. | F |
| DR6-57 | #605 → #642; #646 | ĐÃ SỬA | R57-untested 2 đỏ; incomplete 1 đỏ. Probe loadPr giả: REST đủ 101 file được đọc; thiếu 1 chặn; base có code chặn, chỉ docs qua. CI ghi cha thứ nhất của merge commit trước Verify; không dùng startedAt. | Biên danh sách commit compare bị cắt → CX2-F1 (PLAUSIBLE ngoài GitHub thật). Không gọi gh. | F |
| DR6-58 | #605 → #642 | ĐÃ SỬA | R58-config 1 đỏ. CLI retro nguyên văn (chỉ stub homedir/hostname/run git) đọc .claude-b và .claude fixture, in đủ hai nguồn và hai phiên. | Khác hoa/thường cùng thư mục đếm đôi tái hiện được; đã KNOWN tại known.md:164, không tạo ID mới. | F |
| DR6-59 | #606 → #644 | ĐÃ SỬA | Chạy lại hash-status, hash-separator, M15, M10, N19 trên bản chép: lần lượt 2/2/1/2/1 test đỏ; 0 sống. | Toàn chiến dịch: 18/18 mutant có test đỏ; R51 là lỗi CHECK sai loại theo test, không lỗi import/harness. | A |
| DR6-60 | #595/#596/#606 → #620/#617/#644 | SỬA MỘT PHẦN | RS4/R8 tên dấu chấm, RS9 độ dài, sync_all, A14, MJ15 đều bị test giết. J5 thật bỏ setTimeout trước previous.sqlite.close vẫn 104/104 test B xanh (R60-J5-close.log). | CX2-B4. J5 có trong tổng hợp §5.8 / known.md, nhưng fixes.md chỉ giao MJ15 cho phần TS; không thấy quyết định hoãn J5. Không gộp ca phụ byte-size của probe với J5. | B |
| DR6-61 | #598 → #628 | **ĐÃ SỬA** | **M5/M6/M14** bỏ ngoại lệ kỷ/quy/RE: mỗi cái 1 test đỏ. **M7/M8** cho V4/V6 bỏ qua personalityNotes: mỗi cái 1 test đỏ. **M9** trần TS ký tự +1 và **M10** maxTokens extraction 40.000: mỗi cái đỏ đúng test hợp đồng TS ↔ Rust. Control 817/817 xanh. | Ca dương Luật Khoa học/Kinh doanh vẫn bị chặn; V3 cũng còn áp cho personalityNotes. Đọc nguồn Rust để kiểm hợp đồng, không gọi Rust/network/key thật. | C |
| DR6-62 | #606 → #644; #603 → #638 | ĐÃ SỬA | X5 4 failed; X6 2 failed; D6 1 failed; BR3/BR4 1 failed mỗi ca | stageSince dùng ở kanban, hồ sơ và 5d; coverage.include có UI/i18n, ngưỡng 92/100 theo PR | D |
| DR6-63 | #606 → #644 | ĐÃ SỬA | Áp lại đột biến lượt 1: policy:restoreCustomer → 1/56 đỏ; DOT_ORDER Dự kiến trước → 1/42 đỏ. Control có 979 test xanh. | Các ca oneOfEach kiểm riêng team/person/customer/appointment/policy còn lại trong trash; AV8 ghim thứ tự planned cuối. | E |
| DR6-64 | #605 → #642 | ĐÃ SỬA | Áp lại P3/P5/S3/S9 trên bản chép: lần lượt 1/1/2/1 test đỏ đúng assertion. Control gốc 275/275 xanh; 11/11 mutant công cụ bị giết. | S3 chạy cả session-core và pr-core; không coi lỗi load/config là test giết. | F |
| DR6-65 | #606 → #644 | ĐÃ SỬA | Tables: 2/2 ở UTC−11, UTC−7, UTC+12; trả fixture 8855345 ở Los Angeles → 2 đỏ DATE_IN_FUTURE. Stats 9/9; bỏ guard nền 0 → 1 đỏ. AI e2e: sessionId chứa 1984 vẫn xanh; trả quét metadata → assertion 1984 đỏ. | TR-5 Auckland ACCEPTED giữ nguyên; không coi các fixture giờ giả ngoài miền đã chốt là lỗi sản phẩm. | F |

Đủ 59 mã có Issue sửa: 55 ĐÃ SỬA, 3 SỬA MỘT PHẦN (01/49/60), 1 HỒI QUY (04), 0 CHƯA SỬA. Tám mã 17/23/24/25/37/53/66/67 đã hoãn/chấp nhận, không lẫn vào bảng R.

## 11. Kết luận v1.0 tại 4217ed4

**CHƯA SẴN SÀNG.**

Căn cứ chặn chính là CX2-A1 (Medium, hồi quy DR6-04 do #616): nhập bù một cuộc gặp giữ nhóm trước ngày tạo KH từng hợp lệ theo K2 nay bị từ chối; backup/khôi phục cũng chịu luật mới. F đã kiểm lại qua openAppData/run/tables: KH tạo 10/10, cuộc gặp 05/10 giữ N3 → TRANSITION_BEFORE_LATEST, lịch vẫn SCHEDULED. Không đổi spec/K2 để hợp thức hóa code.

Ba DR6 còn SỬA MỘT PHẦN: 01 (thiếu dòng hiển thị của Thùng rác, dữ liệu cũ đã sửa), 49 (Unicode White_Space U+0085), 60 (test J5). Bảng gộp giữ phạm vi/nguồn từng phần để không đánh đồng một đường dữ liệu đã hết lỗi với mọi seam đã đủ.

Các Low mới và test hở còn lại cần phiên tổng hợp của Owner phân loại; F1 giữ PLAUSIBLE vì cấm gọi gh trong phiên. F2 và B3 là cùng họ giải mã ở hai implementation, cần xét cùng nhau; số ID không phải số Issue bắt buộc.

Mặt đạt: 55/59 DR6 đã sửa; 14 mutant F bị test giết; năm chuỗi mới qua app cùng full-cycle UI/Excel/backup xanh; index DR6-44 cải thiện rõ và giữ hành vi; bundle/exe/các thao tác exe còn trong ngưỡng. Những bằng chứng này không xóa hồi quy Medium đã xác nhận.

Đây là kết luận của sáu gói Codex lượt 2 ở SHA ghim, không phải kết luận phát hành thay Owner. Không tổng hợp với báo cáo lượt 2 nào khác, không tạo Issue, không đề xuất merge.

