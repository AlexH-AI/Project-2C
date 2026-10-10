# Codex — review lại Phase 5, vòng 2, GÓI A

## Bảng R

| DR5 | Issue | Kết luận | Bằng chứng: tái hiện cũ; test đỏ khi gỡ sửa | Ghi chú |
|---|---|---|---|---|
| 13 | #485 / #499 | **ĐÃ SỬA** | `{ summary: 'Tóm tắt' }`, output sai chế độ, evidence F99 không thuộc input đều bị `AI_ANALYSIS_INVALID`. Dòng hợp lệ Mock/OpenCode/ChatGPT web, ACCEPTED/REJECTED xuất–nhập giữ nguyên. Bỏ `analysisContentFits` → test `refuses an analysis whose provider, attempts or outcome do not fit together` đỏ; chỉ bỏ kiểm evidence cũng đỏ riêng (`R13.log`, `R13-evidence.log`). | `ai-analyses.ts:137–138,232–244`; import dùng cùng hàm. Probe độc lập 40 biến thể có 0 lệch lệnh/import. |
| 14 | #485 / #499 | **ĐÃ SỬA** | Backup có `raw_output = a\0` + 30.000 chữ, `model = glm\0-5.3`, note lịch hẹn có NUL → `BACKUP_INVALID`. Bỏ chốt NUL của `valueOf` → ba test mới về raw/model/meeting note đỏ (`R14.log`). Probe mở rộng: **95/95 cột text, 12/12 bảng dữ liệu** đều từ chối NUL, kể cả cột nullable. | Chốt đặt trước bind sql.js, không chỉ ở AI. Lệnh AI thay NUL trong rejected raw bằng `�`, roundtrip vẫn đúng. Khe hở lệnh lịch hẹn cũ ghi riêng CX2-A2; không phủ định việc sửa đường nhập. |
| 16 | #485 / #499 | **ĐÃ SỬA** | Prompt khác mode, suffix web sai provider, model 101 ký tự, REJECTED attempts=1 và ACCEPTED có lỗi cuối đều bị từ chối; model 100, attempts 1/2 của ACCEPTED, prompt version dương và token null hợp lệ vẫn nhận. Bỏ lần lượt mode, suffix web, attempts, max model, last errors → cùng test ràng cột đỏ ở **cả 5 lần** (`R16-*.log`). | Hàm labels/content dùng chung; ma trận 40 ca đối chiếu cả lệnh và backup. Validator tùy ý nhưng JSON hợp lệ là hợp đồng hiện tại; không tự siết toàn bộ shape của báo cáo. |
| 35 | #485 / #499 | **ĐÃ SỬA** | Lưu REJECTED với issue có `path: { toString: null }`, detail kiểu số, code sai: `rejectedReport` bỏ issue hỏng, giữ issue V1 hợp lệ, không ném lỗi. Đưa `isIssue` về chỉ kiểm có thuộc tính → test mới DR5-35 đỏ với TypeError (`R35.log`). | Đọc UI giới hạn ở seam báo cáo validator cần cho A. Không render raw output. |
| 49(a) | #483 / #497 | **SỬA MỘT PHẦN** | Dán nguyên `web@1` trên seed=1, ngày 15/09/2026: **767/767** hồ sơ được phép AI đều `OWN_MESSAGE`, không lưu. Bỏ guard → 7 ca mới đỏ (`R49.log`). CRLF, khoảng trắng quanh dòng, dán một phần còn khung đều bị chặn. Nhưng đổi khoảng trắng **bên trong cả hai khung**, hoặc NFD, bỏ khoảng trắng cạnh `===`, thêm `> ` trước cả hai khung → vẫn có ACCEPTED toàn `…`. Seed thật: **39/767** biến thể khoảng trắng được nhận; một dòng lưu thật thành CURRENT và xuất–nhập thành công. | **CX2-A1.** Tiêu chí dòng khung nguyên văn trong spec §3.1(3) đã đạt. “Một phần” nói về biến thể gần được plan §4 yêu cầu xét; không coi đây là vi phạm tiêu chí literal của Issue. |
| 15, phần KYC | #490 / #505 | **ĐÃ SỬA** | Xác nhận lại `Kỹ sư` bằng chuỗi NFD tương đương: fact cũ superseded, fact mới active, không tạo phiên bản; F cũ dẫn đến F mới. Đổi ngày sinh nhưng giữ năm cũng không tạo phiên bản và dẫn mã birthYear cũ đến mã mới. Bỏ fallback `factInEffect` trong bộ nhớ → test dẫn mã và test mức bằng chứng CURRENT đều đỏ (`R15.log`: 2 failed). | Bản chất giữ version của DB đúng phương án Owner; fix nằm ở view. Test STALE giữ ngày đầu vào cũ vẫn xanh; giá trị thật sự khác không ánh xạ nhầm. Phần tương tác panel thuộc C. |
| 48, bổ sung phần DB | #490 / #505 | **ĐÃ SỬA** | `kyc_versions.seq` có lỗ 10,20 → API trả đúng 10,20; lần sau 21. Bỏ `seq: row.seq` → test DR5-48 mới đỏ (`R48.log`). | Kiểm thêm vì `kyc.ts` thuộc A; C chịu phần chip/timeline/preview. Không cộng thành DR5 thứ hai khi gộp A–C. |
| T-202, không có DR5 | #500 / #501 | **ĐÃ SỬA** | `rg WEB_PROMPT_VERSION packages/ai` không có kết quả, source/CLAUDE/codemap khớp; typecheck và prompt/web tests xanh. | Bỏ symbol chết; `WEB_WRAPPER.version` vẫn là nguồn `web@1`. Không có hành vi cần phá bằng mutation. |

## Mốc và phương pháp

- HEAD kiểm đầu phiên và khi chốt: **705ea7c0e76dcdcf8c89f949fc2e3b3b6e4fff2c**, detached. Không fetch/pull/chuyển SHA.
- Đọc common plan §1–§6, baseline, known; CLAUDE/CONTEXT; spec Phase 5; G5; golden eval; ADR-0009 gồm D-1/G5/W-1; tổng hợp 10/10 §3–§5/§7/§8; quyết định Owner 10/10 trong PROJECT-STATE. Đọc thân Issue **#482–#490 và #500** bằng `gh issue view --repo AlexH-AI/Project-2C --json number,title,body`.
- Đi theo R → diff sửa **0df3606..705ea7c** → phần Phase 5 **3e84ce8..705ea7c**, trong phạm vi A. Không đọc báo cáo vòng 2 của bên khác, không tổng hợp, không tạo Issue, không đề xuất merge.
- Không ghi source repo. “Gỡ sửa” bằng Vite transform **trong bộ nhớ**; source và patch không thay đổi trên đĩa. Mỗi process test kết thúc là mutation mất; biến môi trường `CX_MUTATION` được bỏ trong `finally`.
- Chỉ Mock/scripted adapter và sql.js trong bộ nhớ. Không dịch vụ AI thật, eval:ai, key app, Credential Manager hay trang ChatGPT.

## Phát hiện

### CX2-A1 — Biến thể gần của khung app vẫn ghi được ví dụ thành CURRENT

- **Mức:** Low.
- **Trục:** R, E, D (trục chính R).
- **Vị trí:** `packages/ai/src/web.ts:85–88,111` (705ea7c); hệ quả ở `packages/ai/src/run.ts:288–306`, `packages/db/src/ai-analyses.ts:111`.
- **Tình trạng:** **CONFIRMED**.
- **Liên quan:** DR5-49(a), giới hạn phần sửa PR #497. Khác KNOWN DR5-49(b): ở đây **còn cả tin nhắn và hai khung của app**, chỉ đổi cách viết khung; không phải dán riêng ví dụ hay model tự chép ví dụ.
- **Mô tả:** `isOwnMessage` chuẩn hóa xuống dòng và trim mép nhưng so nguyên byte khung. Đổi `=== HƯỚNG DẪN ===` thành `=== HƯỚNG  DẪN ===` và `=== ĐẦU VÀO ===` thành `=== ĐẦU  VÀO ===` làm guard bỏ qua cả tin nhắn, để parser lấy JSON ví dụ trước JSON đầu vào. NFD cho toàn tin nhắn cũng bỏ qua guard.
- **Tái hiện/bằng chứng:** `probe.test.ts` ghi `FRAME_CASES` với original/CRLF/partial/trim → OWN_MESSAGE; NFD/double_space/no_space/markdown_quote → ACCEPTED với text `…` trên PROFILE có đủ mã ví dụ. `sweep.test.ts` dùng **lệnh seed, startWebAnalysis, checkWebAnswer, recordAiAnalysis, listAiAnalyses, exportBackup/importBackup thật**: 1.200 KH, 767 đủ gate; nguyên bản bị chặn 767/767, bản đổi khoảng trắng nhận **38 analysis + 1 discovery**. KH đầu tiên `01K56KY2AS70FQJ49MZWA1SC6K`, KYC `01KDWPWZK27B6F1MMY4RHN0W6J`, được lưu CURRENT; backup nhận lại dòng đó. Nguồn và log ở phụ lục.
- **Ảnh hưởng:** Khi tin nhắn app bị biên tập/chuẩn hóa trước lúc dán nhầm, kết quả ví dụ trở thành lịch sử chỉ thêm. Đường Ctrl+V trực tiếp của vòng 1 **đã sửa**; cần thay đổi cả hai khung mới lọt nên mức Low, không giữ Medium của lỗi ban đầu. Chưa đo tần suất xảy ra trong thao tác RE thật.
- **Đúng hợp đồng:** Spec §3.1(3) và Issue #483 mô tả khung nguyên văn; code đáp ứng tiêu chí đó. Đây là khoảng hở biến thể gần theo plan §4, không yêu cầu sửa golden hay nới chính sách G5. Output thật có một dòng khung riêng cũng bị chặn đúng quy tắc hiện hành; không báo đó là regression/chặn nhầm.
- **Đề xuất:** Chuẩn hóa NFC và khoảng trắng nội bộ khi nhận diện **dòng khung**; thêm ca dán nguyên tin nhắn biến thể cùng kiểm không mất lần thử. Xét xử lý dấu quote `>` theo phạm vi quyết định sau. Khoảng 5–15 dòng sản phẩm + 30–50 dòng test; không cần đổi chữ prompt/golden. Ví dụ đứng riêng vẫn thuộc #491.

### CX2-A2 — Chốt NUL ở backup chưa có tương đương tại lệnh lịch hẹn cũ

- **Mức:** Low.
- **Trục:** D, C (trục chính D).
- **Vị trí:** `packages/db/src/common.ts:37–40`; `packages/db/src/appointments.ts:278,296,360` (705ea7c). Chốt đối chiếu: `packages/db/src/backup.ts:190`.
- **Tình trạng:** **CONFIRMED** tại API lệnh; chưa tái hiện qua clipboard/UI Windows.
- **Liên quan:** Phát hiện bổ sung khi rà DR5-14 ở **mọi bảng**. Có từ trước Phase 5, vòng 1 chưa ghi; không phải hồi quy của PR #499, không phải đường AI/backup còn lọt. Phần `appointments.ts` ngoài phạm vi AI chính của A được đọc chỉ để kiểm ranh giới NUL này.
- **Mô tả:** `optionalText` chỉ trim; note outcome cũng chỉ trim. `scheduleAppointment` và `recordMeetingOutcome` nhận chuỗi chứa NUL, sql.js cắt phần sau NUL khi bind/đọc. Khác đường nhập vừa được siết, lệnh không từ chối dữ liệu và không báo phần bị mất.
- **Tái hiện/bằng chứng:** `matrix.test.ts`, ca `records the non-AI command boundary seen while testing NUL in all tables`: dùng `setup/createCustomer`, đặt lịch với trigger `OTHER` và `triggerNote = 'Hẹn lại\0THÔNG TIN SAU NUL'`; ghi MET với `nextStep` và `note` cùng chuỗi đó. Lệnh đặt lịch trả chuỗi đầy đủ nhưng `getAppointment` đọc **cả ba cột chỉ còn `Hẹn lại`**. Xuất–nhập backup thành công và vẫn chỉ còn `Hẹn lại`: dữ liệu đã mất trước bước xuất.
- **Ảnh hưởng:** Chỉ ca chuỗi bất thường chứa NUL truyền vào lệnh; không chứng minh đây là thao tác dán thường gặp của RE. Mất một phần ghi chú/bước tiếp theo/lý do hẹn, không hỏng quan hệ hay bảng AI. Dữ liệu hiện là giả lập.
- **Đề xuất:** Dùng chốt từ chối NUL hiện có cho các ô chữ tự do của lệnh lịch hẹn, kiểm cả đường đặt/sửa/outcome/dời lịch; test từ chối và transaction không đổi. Khoảng 5–15 dòng sản phẩm + 30–60 dòng test. Theo R2-02 không cần migration hay UI sửa dữ liệu cũ. Bảng R14 vẫn ĐÃ SỬA cho phạm vi nhập backup của Issue #485.

## Kiểm tra và số đo

| Lần chạy | Kết quả | Log |
|---|---|---|
| R baseline: web, db AI, backup-invariants, kyc, ai-panel-view | **5 file / 262 test xanh**, 55,40 s | `A/r-baseline.log` |
| Quét phạm vi còn lại: toàn bộ AI, domain evidence/kyc/kyc-fact/gate, db backup/backup-engine/seed/seed-invariants, kyc-view | **22 file / 457 test xanh**, 48,69 s | `A/phase-suite.log` |
| Probe riêng R/Unicode/DB roundtrip/report | **5 test xanh** | `A/probe.log` |
| Quét literal G5 + seed DR49 + đo JSON | **3 test xanh** | `A/sweep.log` |
| Ma trận lệnh/import + 95 cột text + lệnh lịch hẹn NUL | **3 test xanh** | `A/matrix.log` |
| Mutation R13/schema, R13/evidence; R14; 5 guard R16; R35; R15; R48; R49 | **12 lượt đều đỏ**, đúng assertion, có `CX_MUTATION_APPLIED` | `A/R*.log` |
| `pnpm codemap:check` | Export maps up to date | Kết quả terminal phiên |
| `pnpm --filter @p2c/ai --filter @p2c/db --filter @p2c/domain typecheck` | 3 lần `tsc --noEmit` exit 0; tsconfig đã bật noUnusedLocals/noUnusedParameters | Kết quả terminal phiên |
| `pnpm lint:deps` | 299 module / 1.168 dependency, 0 violation | Kết quả terminal phiên |

Hai nhóm test repo có phần trùng (`web.test.ts`); không cộng số trên thành số test duy nhất. Không chạy lại toàn bộ `pnpm verify`, Rust, e2e hay eval thật; baseline common không được trình bày như kết quả phiên này. Hai test matrix ban đầu lỗi do fixture dùng enum trigger không tồn tại; đã đổi fixture sang `OTHER` và chạy lại xanh, không sửa sản phẩm.

Số đo local, Node 24.20.0 / Vitest 5.0.1 / sql.js, seed=1/ngày neo 15/09/2026, DB trong bộ nhớ:

- Tạo 1.200 KH: **3.835 ms**; quét 767 phiên web cùng biến thể: **390 ms**.
- Backup **10.700.531 ký tự**: export **166 ms**, import **642 ms**. Một mẫu, không suy ra SLA hay vấn đề hiệu năng mới.
- `extractJson` với 20.000 `x`: 0,010 / 0,002 / 0,001 ms. Với 20.000 `{`: **456 / 471 / 466 ms**. Đây là **KNOWN DR5-04 / #492** (thuật toán thử nhiều đầu `{`), không phát hiện mới và không nâng mức.

## Đi qua mọi trục

| Trục | Kết quả và cách đã xét |
|---|---|
| R | Bảng đầu báo cáo; chạy tái hiện cũ, 12 mutation độc lập trong bộ nhớ và biến thể gần. DR49(a) còn giới hạn CX2-A1; không thấy hồi quy mới từ các fix A. |
| E | CX2-A1. Đã thử NFC/NFD, CRLF, trim, thay khoảng trắng trong khung, dấu quote, tin nhắn+output thật, JSON 20.000 ký tự, model 100/101, prompt số 0/01/2, attempts/tokens, ngày sai 29/02; test domain kiểm cutoff đúng ngày và 29/02. Ngoài hai phát hiện, đã xét, không thấy lỗi mới. |
| G | **Đã xét, không thấy lỗi mới ngoài KNOWN.** Quét độc lập từ bảng G5: **171 literal / 819 biến thể** hoa/thường/NFD/khoảng trắng/bỏ dấu đúng từng cột, 0 bỏ lọt trái quy tắc. Test regex V3/V5/V6, V2 evidence/category, V1 cardinality/defaults, V7 field/type/quote/NFC và giữ sản phẩm trong extraction. Runner chỉ trả đề xuất, không import DB. |
| C | CX2-A2 ở ranh giới NUL lệnh cũ. **Đã xét, không thấy lệch hợp đồng mới trong AI**: hai chế độ/gate/provider, +web, attempts, nullable usage, schema mới nhất, REJECTED, nguyên văn prompt; giữ version khi xác nhận lại theo Owner; CURRENT dùng ngày fact mới, STALE dùng ảnh chụp. Không đòi V7 chứng minh ngữ nghĩa value–quote, vì luật tự động hiện chỉ field/type/substring. |
| D | CX2-A1/A2. Ngoài đó, **đã xét, không thấy**: 40 ca lệnh/import, 95 cột NUL, rollback không lưu dòng sai, roundtrip hợp lệ, trigger append-only kể cả rebuild migration, CURRENT/STALE theo seq, seq có lỗ, seed deterministic và backup. |
| S | **Đã xét, không thấy lỗi an toàn mới trong A.** Input phân tích chỉ facts/gate/ngày, không tên/điện thoại/RE/notes/hợp đồng/appointments; birthYear gửi tuổi. Extraction gửi đúng một ghi chú theo hợp đồng. `ai` không có mạng thật/key, web là bộ dựng/kiểm chuỗi; retry không tự áp output lên KYC; lỗi report hỏng bị lọc. Xem guard literal và chuỗi/prompt injection trong các test input/validator; không suy ra prompt có thể kháng mọi model injection. Key/CSP/capabilities/open URL thực tế thuộc B/C, chưa kiểm trực tiếp trong A. |
| P | **Đã xét, không thấy vấn đề mới** ngoài KNOWN DR04, với số đo trên. Không gọi suy đoán về độ lớn dữ liệu là finding. |
| B | **Đã xét, không thấy bloat mới ngoài KNOWN**: codemap check, noUnused, rg symbol, diff fix; WEB_PROMPT_VERSION đã gỡ. Nhãn/seed mock copy, type field copy, public helper exports và logic retry mixed đã có trong known; không báo lại thành mới. |
| T | **Đã xét, không thấy test sống sót khi bỏ những guard đã phá**: 12 lượt đỏ. Test mới về own message chưa bao phủ NFD/khoảng trắng nội bộ (bằng chứng cho CX2-A1). Việc test format example ACCEPTED là khóa hành vi Owner tạm chấp nhận, không đề xuất đổi test/golden cho xanh. Khoảng trống blocklist đã KNOWN #493; probe literal ở đây bổ sung bằng chứng, không tính phát hiện test mới. |
| A | **Đã xét, không thấy lỗi i18n/trợ năng mới trong phạm vi A.** Kiểm label input khớp G5, chi tiết validator/retry tiếng Việt, report dùng path/detail chuỗi và thông điệp V1; golden mức bằng chứng và seam dẫn mã fact. Không đánh giá focus/role/status hay trình đọc màn hình bằng browser ở A; đó là nhiệm vụ C. Lặp bộ nhãn đã KNOWN #494. |

## KNOWN không tính vào phát hiện mới

- **DR5-49(b)/08, #491:** prompt example đứng riêng có text `…` vẫn qua V1–V6 nếu đủ F; probe `only_prompt` xác nhận. Không dùng chứng cứ này để gọi fix phần (a) thất bại hoàn toàn; CX2-A1 chỉ nói các biến thể còn giữ khung.
- **DR5-04, #492:** phép đo parser nêu trên; chưa có hậu quả nặng hơn tổng hợp.
- Các giới hạn G5 Unicode/false positive (#491), parser truncation/finishReason chưa dùng ở `ai`, request size/mock semantics/Array.from (#492), test coverage (#493), lặp/dead/public helpers (#494 và sổ review) đã đối chiếu code, giữ nhãn KNOWN; không tính mới, không sửa prompt/golden.
- Hash phiên bản từ backup và các race thay DB ở JS trong known không được tuyên bố đã giải quyết bởi kiểm tra A. Phần thế hệ DB là C/D.

## Phạm vi đọc và giới hạn

**Nguồn sản phẩm đọc sâu:**

- Toàn bộ file sản phẩm `packages/ai/src`: `adapter.ts:1–43`, `schema.ts:1–156`, `validator.ts:1–228`, `blocklists.ts:1–92`, `text-match.ts:1–60`, `extract-json.ts:1–36`, `input.ts:1–132`, `run.ts:1–403`, `web.ts:1–132`, `mock-adapter.ts:1–170`, `settings.ts:1–86`, `models.ts:1–35`, `errors.ts:1–46`, `index.ts:1–11`, `raw.d.ts:1–5`; prompts analysis `1–48`, discovery `1–43`, extraction `1–27`, retry `1–51`, connection `1–13`; helper test-support `1–69`.
- DB: `ai-analyses.ts:1–337`, `backup.ts:1–203`; `backup-validation.ts:1–115,366–438` và toàn bộ hunk Phase 5; `kyc.ts:1–180,430–551` và toàn bộ hunk Phase 5; `seed.ts:1–110,420–574` và toàn bộ hunk Phase 5; `seed-data.ts:308–345` (bộ nhãn); `common.ts:1–70`, `settings.ts:1–29`, `database.ts:1–145`, `schema.ts:288–407`, `migrations/0005…0008` toàn file SQL. Diff package db index/migrations wiring đã xét; không đọc toàn bộ snapshot JSON sinh tự động.
- Domain: `evidence-level.ts:1–52`, `kyc-fact.ts:1–57`; logic KYC/version và toàn bộ hunk Phase 5. Đọc evidence golden tests, kyc/normalize, gate contract; test domain được chạy trong suite.
- UI seam cần cho A: `ai-panel-view.ts:1–250,405–515`, `kyc-view.ts:40–110,120–230`; các test DR35/DR15/DR48 tương ứng. Mở rộng riêng ranh giới NUL: `appointments.ts:1–155,275–321,342–384`; API đọc getAppointment và test fixture. Không review toàn bộ UI/Rust/e2e.
- Test đọc tập trung: toàn bộ hunk sửa của `web.test.ts`, `ai-analyses.test.ts`, `backup-invariants.test.ts`, `kyc.test.ts`; run/retry/cancel/usage, schema input/output, validator main/blocklists/extraction, prompts nguyên văn, db roundtrip/rollback/migration/append-only, UI report/current-vs-stale/fact-code. Các file còn lại trong suite được chạy; không khẳng định đã đọc từng dòng của tất cả test repo.

## Bảng đếm mức × trục

Chỉ đếm **trục chính**, mỗi ID một lần; trục phụ ghi ở finding và bảng kiểm. Không tính KNOWN, không tính các dòng R đã sửa.

| Mức | R | E | G | C | D | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 1 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

**2 CONFIRMED Low**; không có PLAUSIBLE mới. Trong 6 DR5 chính của A: 5 ĐÃ SỬA, 1 SỬA MỘT PHẦN; kiểm thêm DR48 DB và T-202 đều đạt. Gói A không kết luận G7 toàn Phase 5.

## Phụ lục: nguồn probe và lệnh chạy

Tất cả artifact dưới `C:\workspace\deep-review-5-r2\codex\A\`:

- `vitest.config.mjs`: aliases về source repo, cache ngoài repo, 12 mutation theo `CX_MUTATION`. `probe.config.mjs`: cấu hình cho test ngoài repo.
- `probe.test.ts` + `probe.log`: 5 ca R/near variants, roundtrip, report, KYC. `sweep.test.ts` + `sweep.log`: quét bảng G5 độc lập, seed DR49, số đo.
- `matrix.test.ts` + `matrix.log`: ma trận 40 biến thể, 95 cột text/12 bảng, NUL ở lệnh lịch hẹn.
- `r-baseline.log`, `phase-suite.log`, `R13.log`, `R13-evidence.log`, `R14.log`, `R16-mode.log`, `R16-web.log`, `R16-attempts.log`, `R16-model.log`, `R16-errors.log`, `R35.log`, `R15.log`, `R48.log`, `R49.log`.

Chạy từ repo bằng PowerShell (không đặt CX_MUTATION khi chạy baseline/probe):

```powershell
pnpm exec vitest run --config C:\workspace\deep-review-5-r2\codex\A\probe.config.mjs C:\workspace\deep-review-5-r2\codex\A\probe.test.ts --reporter=verbose
pnpm exec vitest run --config C:\workspace\deep-review-5-r2\codex\A\probe.config.mjs C:\workspace\deep-review-5-r2\codex\A\sweep.test.ts --reporter=verbose
pnpm exec vitest run --config C:\workspace\deep-review-5-r2\codex\A\probe.config.mjs C:\workspace\deep-review-5-r2\codex\A\matrix.test.ts --reporter=verbose
```

Mutation DB: set `CX_MUTATION` thành `R13`, `R13-evidence`, hoặc một `R16-*`, rồi chạy config chính với `packages/db/src/ai-analyses.test.ts -t 'refuses an analysis whose provider'`. Mutation khác: `R14` với backup-invariants `-t NUL`; `R35` với ai-panel-view `-t DR5-35`; `R15` với kyc-view + ai-panel-view `-t DR5-15`; `R48` với db kyc `-t DR5-48`; `R49` với web `-t 'own message'`. Bỏ biến môi trường sau mỗi lượt; chỉ áp transform trong test process.

Thời gian (UTC+7, 11/10/2026): bắt đầu đọc chuẩn **trước 01:23:24**; mốc giờ mở phiên không được lưu. Mốc artifact đầu tiên **01:23:24**, baseline R **01:24:34**; chốt báo cáo **01:43:04**. Git cuối phiên: đúng SHA ghim; chỉ còn `.agents/`, `.codex/`, `AGENTS.md` untracked có sẵn, không mutation/source/commit mới.