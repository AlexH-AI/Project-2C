# Deep review Phase 5 — gói F / xuyên gói

- Reviewer: Codex độc lập, phiên chính, không subagent. Ngày: 10/10/2026.
- Repo: `C:\workspace\Project-2C-review-2`; SHA đầu/cuối **`0df3606fb783cc89b1b9c413c02810340e273a4f`**, detached HEAD.
- Kết quả: **2 phát hiện mới Low, CONFIRMED**; **1 bổ sung Medium, CONFIRMED cho CX-D2**, không đếm lại thành lỗi mới. Không Critical/High, không PLAUSIBLE.
- **G7 Phase 5: CHƯA SẴN SÀNG**, theo kiểm chứng xuyên gói của phiên này (§7).

Chỉ đọc repo ghim, ba file được phép trong `common`, báo cáo/artifact của chính Codex. Đã đọc A–E của Codex để tránh báo trùng, không lập báo cáo tổng hợp A–F, không đọc hoặc so với reviewer khác. Không truy cập thư mục/báo cáo bị cấm. Không sửa repo, sửa lỗi, commit, tạo Issue hay đề xuất merge. Không gọi AI thật, chạy eval, đọc key/Credential Manager hoặc mở ChatGPT; HTTP/IPC/clipboard/browser đều giả khi cần.

## 1. Phát hiện và bằng chứng bổ sung

### CX-F1 — Bổ sung CX-D2: kết quả muộn thành CURRENT với bằng chứng không tồn tại sau restore

- **ID:** CX-F1 — bằng chứng bổ sung cho **CX-D2**, **không phải lỗi mới độc lập**.
- **Mức:** Medium.
- **Trục:** D; liên quan E/C/G.
- **Vị trí (0df3606):** `apps/desktop/src/data/ai-analysis.ts:177–181,195–204`; `data/app-data.ts:302–314`; điểm xác định CURRENT `packages/db/src/ai-analyses.ts:196–206`. Bối cảnh hợp lệ: `packages/domain/src/kyc.ts:122–127,160–163`; `packages/db/src/kyc.ts:425–438`.
- **Tình trạng:** **CONFIRMED**, tái hiện mới ở F bằng API app/DB gốc và Edge.
- **Mô tả:** lời gọi giữ ảnh chụp đầu vào nhưng không giữ identity/generation của DB. Sau khi nhập backup hoàn tất, callback ghi vào DB mới nếu customer/version ID vẫn có. Có thể tạo CURRENT trích một mã F chưa từng tồn tại trong DB đã khôi phục, không chỉ thêm một dòng ngoài snapshot.
- **Tái hiện / bằng chứng:** `node F/probe.mjs`, case `D2-stronger-same-id-restore`:
  1. Qua lệnh nghiệp vụ tạo KH, dữ kiện F1–F4, KYC v2; xuất backup nguyên bản **A** chưa có analysis.
  2. Xác nhận lại nghề **cùng giá trị** “Bác sĩ”: F4 bị thay bằng F5 mới. Hash/ID phiên bản không đổi — đúng luật hash hiện có, **không chỉnh hash hoặc ID trong backup**.
  3. Bắt đầu phân tích với adapter giữ promise; input thật chứa F5. Câu trả lời giả đúng schema trích F5 trong `hypotheses`, qua V1–V6 với chính input đó.
  4. **Đợi `app.importBackup(await app.readBackup(A))` hoàn tất**, sau đó mới giải phóng adapter. Kết quả `{kind:'saved',status:'ACCEPTED'}`, trạng thái **CURRENT**, nhưng DB hiện tại chỉ có F1–F4.
  5. Xuất/nhập tiếp bằng API backup gốc vẫn thành công. `ui.mjs` nhập artifact này qua Settings → Data: panel hiện CURRENT, “Bằng chứng: F5”, mức thấp với ngày xác nhận 10/10; bấm F5 hiện “F5 không còn hiệu lực”, DOM có **0** `#fact-F5`. `F/D2-ui.png`, `ui-results.json` lưu bằng chứng.
- **Ảnh hưởng:** restore không còn là snapshot độc lập; lịch sử AI sau restore có thể mang dữ kiện chỉ có ở nhánh dữ liệu đã bị thay. RE nhìn CURRENT nhưng không truy được nguồn bằng chứng. Không chứng minh sửa/xóa dữ kiện KYC, gắn sang KH khác hay lộ dữ liệu thật; giữ mức Medium.
- **Đối chiếu KNOWN:** `common/known.md:14` ghi cửa sổ chờ backup của S-2. Ca này callback trả **sau replace hoàn tất**, không ở cửa sổ đó. CX-D2 đã báo cùng căn nguyên; F chỉ bổ sung hậu quả nặng hơn, không nhân đôi phát hiện. Không báo luật hash cùng giá trị thành một lỗi mới.
- **Đề xuất:** chụp identity/generation DB lúc bắt đầu; trước khi lưu, discard nếu DB đã được thay, kể cả khi ID trùng. **Không** thay bằng kiểm “version phải là mới nhất” hoặc “F phải còn active”: đổi KYC trong **cùng DB** vẫn phải lưu STALE đúng §3. Không đổi golden/hash để che race. Ước lượng 40–90 dòng SP, ≤400; thêm ca restore cùng ID và chứng minh không ghi muộn.

### CX-F2 — Cùng lỗi HTTP nhưng panel/trích xuất làm mất mã và chi tiết đã có từ Rust

- **ID:** CX-F2.
- **Mức:** Low.
- **Trục:** C; liên quan A/T.
- **Vị trí (0df3606):** `apps/desktop/src/data/ai-analysis.ts:143–144,231–232`; `routes/customers/ai-panel-view.ts:199,212–215`; `extraction-view.ts:52–53`; `KycIntelligence.tsx:388–390`; `KycExtraction.tsx:119–123`; `i18n/vi.ts:222–230`. Đối chứng `routes/settings-ai-view.ts:75–83`.
- **Tình trạng:** **CONFIRMED**, ba luồng UI với cùng IPC giả.
- **Mô tả:** port và runner mang `httpStatus`/`serverMessage`, nhưng trạng thái panel chỉ giữ mã lỗi; trích xuất còn bỏ hai trường ngay ở lớp app. Hai bề mặt chỉ render `aiError.AI_HTTP = "OpenCode báo lỗi."`; Settings giữ và hiện HTTP/chi tiết.
- **Tái hiện / bằng chứng:** `node F/ui.mjs`, case `same-http-error-three-surfaces`, dùng `asExe`/IPC giả, provider OpenCode; không có Credential Manager/mạng thật. Cả ba `ai_complete` từ chối với `{code:'AI_HTTP',httpStatus:502,message:'FAKE_GATEWAY_MESSAGE_F'}`:
  - Phân tích: **“OpenCode báo lỗi. · Thử lại”**.
  - AI trích xuất: **“OpenCode báo lỗi. · Thử lại”**.
  - Cài đặt → Kiểm tra kết nối: **“OpenCode báo lỗi (HTTP 502): FAKE_GATEWAY_MESSAGE_F”**.
  - `F/ui-results.json`: 3 calls; `F/http-ui.png` lưu đối chứng Settings.
- **Nguồn đúng:** spec `phase-5-ai.md:169,175,307,321`; mockup G3 `ai.html:643–661` ghi rõ **“Thông báo lỗi (§5.3) — dùng chung panel, trích xuất, Cài đặt”**, dòng AI_HTTP có HTTP 502 và thông điệp server. Đây không phải yêu cầu hiện tên mã `AI_HTTP` cho RE.
- **Ảnh hưởng:** lỗi 400/500/502… khi thực hiện công việc thật bị gom thành một câu không có thông tin chẩn đoán, trong khi thử kết nối mới hiện chi tiết. Không làm sai trạng thái DB, không mất key; vì chủ yếu là lệch thông báo nên Low.
- **Đề xuất:** giữ metadata lỗi qua các outcome/view và dùng một formatter chung cho ba bề mặt. Chỉ truyền thông điệp **đã được Rust làm an toàn**; không đổ body/header/request thô vào UI. Có thể làm trước phần mã HTTP, phối hợp chính sách message với vấn đề ranh giới bí mật đã được review riêng. Ước lượng 40–100 dòng SP, ≤400, thêm ca UI cả ba luồng.

### CX-F3 — Import giữ seq KYC nhưng panel/lịch sử đánh lại số bằng vị trí mảng

- **ID:** CX-F3.
- **Mức:** Low.
- **Trục:** C; liên quan D/E/T.
- **Vị trí (0df3606):** `packages/db/src/kyc.ts:539–547` bỏ `seq` khi đọc version; `apps/desktop/src/routes/customers/ai-panel-view.ts:403,463,503–512` dùng `findIndex + 1`. Cùng giả định tại `CustomerKyc.tsx:133–136`, `kyc-view.ts:146–151`. Import: `packages/db/src/backup-validation.ts:64`, command ghi tiếp `kyc.ts:432`.
- **Tình trạng:** **CONFIRMED**, command/import/view gốc và Edge.
- **Mô tả:** backup nhận seq nguyên dương an toàn, duy nhất, không bắt liên tiếp từ 1; command tiếp tục `max(seq)+1`. Nhưng DTO không trả seq, UI gọi vị trí trong mảng là số phiên bản, trái chip `kyc v<seq>` ở spec §3/§9.1.
- **Tái hiện / bằng chứng:** `probe.mjs`, case `version-seq-presentation`:
  1. Tạo hai phiên bản và một analysis bằng lệnh thật, xuất backup; chỉ đổi hai `kyc_versions.seq` thành **10,20**, không đổi thứ tự, ID, hash, facts hay output.
  2. Import thành công. Dòng AI trỏ version có **seq=20**, CURRENT; `analysisContent().chip.version` và `historyRows()[0].version` đều **2**.
  3. Ghi đổi nghề qua command sau import tạo version **seq=21**; preview/count của UI vẫn hiểu là **v3**.
  4. `ui.mjs` nhập file qua UI: panel ghi **“kyc v2”**, lịch sử **“v2”**, không lỗi màn. `F/version-ui.png`, `version-gaps.p2cbackup`, `ui-results.json`.
- **Ảnh hưởng:** số phiên bản hiển thị không còn khớp định danh thứ tự được lưu/xuất và dùng khi ghi tiếp sau một backup mà app chấp nhận. ID/version linkage và CURRENT/STALE trong DB vẫn đúng; không coi đây là mất dữ liệu. Luồng tạo dữ liệu liên tiếp bình thường không gặp; vì điều kiện cần backup có khoảng seq nên Low.
- **Đối chiếu:** spec `phase-5-ai.md:45,262–263,286,322`; invariant không có luật cấm khoảng trống seq. Không báo “phải chặn backup này” như yêu cầu đã duyệt, không sửa golden để đồng nhất với `index+1`.
- **Đề xuất:** trả seq thật trong `KycVersionRecord`, dùng nó ở chip/history/timeline/preview; giữ số lượng phiên bản là một khái niệm khác. Nếu muốn cấm seq có khoảng thì cần chốt thêm hợp đồng import, không âm thầm áp giả định chỉ ở UI. Ước lượng 40–120 dòng SP, ≤400; thêm round-trip + ghi tiếp trên seq 10,20.

## 2. Bảng đếm mức × trục

Đếm **phát hiện mới**, mỗi ID đúng một trục chính. CX-F1 là bổ sung CX-D2, tách riêng, không cộng vào tổng lỗi mới.

| Mức | E | G | C | D | S | P | B | T | A | Tổng mới |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Bổ sung CX-D2: Medium, không tính mới | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 bổ sung |

## 3. Kiểm đầu-cuối và hồi quy

| Kiểm trong phiên F | Kết quả / giới hạn |
|---|---|
| Unit tất cả `packages` + `apps` | **95 file, 2.001/2.001 đạt**, 57,14 s. Không gồm 151 test tools; không phải `pnpm verify` toàn bộ. |
| Unit tập trung app-data/persist/AI/backup | **6 file, 243 đạt**, 39,53 s; là tập con của 2.001, không cộng lặp. |
| Toàn bộ e2e hiện có | **182/182 đạt, 2,1 phút**, Edge, production build, 2 worker, retries=0. Bao gồm backup/thay dữ liệu, KYC/timeline, cuộc hẹn/HĐ/chỉ số và AI. |
| Probe xuyên gói | Mock → runner → command → panel/appointment → export/import; IPC giả → retry cùng session/token tổng; 10 mã lỗi Rust-shaped; thay KYC tại chỗ; Hủy/AI_BUSY; web retry/STALE; trích xuất → xác nhận. Đạt các assertion và tái hiện CX-F1/F3. |
| Probe UI mới | Ba trường hợp: seq khác nhãn; CURRENT/F5 không tồn tại; cùng HTTP 502 ở ba bề mặt. Đạt, mạng ngoài localhost bị chặn. |
| Mutation tạm trong bộ nhớ | Baseline **46 xanh**; ghim kết quả vào version mới nhất làm **2 đỏ** (native/web STALE); bỏ signal Hủy làm **1 đỏ**. Không mutation nào ghi vào worktree. |
| NoUnused/typecheck app | `tsc -p apps/desktop --noUnusedLocals --noUnusedParameters`: exit 0. |
| Ranh giới / export map | `pnpm lint:deps`: **0 vi phạm**, 297 module/1.156 dependency; `pnpm codemap:check`: up to date. Không chạy lệnh sinh codemap. |

E2E dùng config tạm trỏ nguyên test trong repo, ngày seed **15/09/2026**, build/snapshot/trace ở F. Các probe UI mới dùng ngày **10/10/2026**. Không nhận số baseline/common là số đo mới. Không build exe/Tauri, chạy Rust/clippy lại hoặc live eval trong F; IPC giả không thay thế kiểm TLS/Credential Manager thật.

## 4. Đi qua mọi trục — phần “đã xét, không thấy”

| Trục | Cách xét / kết quả |
|---|---|
| **E** | Hai lượt AI chồng nhau, Hủy khi pending, lỗi 10 mã qua IPC, đổi KYC tại chỗ/restore cùng ID sau await, dán trắng/20.001 ký tự, retry 1→2 qua probe và test. Có CX-F1/F3. **Đã xét, không thấy lỗi mới khác** ở các seam đã kiểm. Unicode/ngày nhuận/JSON biên được chạy trong suite packages; không giả định đã thử model thật, mọi biểu diễn đối kháng hay một exe chạy qua nửa đêm. |
| **G** | Theo đường `runAnalysis → checkAnalysisAnswer → V1–V6`, web dùng chung kiểm/đếm retry; `runExtraction → V1 → V7 → ConfirmFactDialog → command KYC`. Case F5 qua V2 đúng với snapshot nhưng snapshot thuộc DB đã bị thay: CX-F1 là lỗi identity dữ liệu, không lỗi matcher. **Đã xét, không thấy bypass mới ở điểm nối**: không có UI tự ghi KYC từ output, proposal không vào DB trước xác nhận; sai hai lần/REJECTED và cổng chặn được unit/e2e kiểm. Không audit lại toàn corpus G5 riêng A hoặc tuyên bố regex bảo đảm R1 đọc tay. |
| **C** | So IPC camelCase/plan/reasoning/session/messages/token và mapping lỗi với Rust/spec; Mock/web model-token null, prompt version, CURRENT/STALE/REJECTED theo seq, phần chỉ đọc lịch hẹn. Có CX-F2/F3. **Đã xét, không thấy sai hợp đồng mới khác** ở luồng bình thường: cùng session cho retry, token 11+13=24 và 3+5=8; lỗi không tạo history, đổi KYC tại chỗ lưu STALE. |
| **D** | Inventory trước/sau analysis chỉ tăng `ai_analyses`; extraction không ghi trước xác nhận; backup/import giữ row, Hủy không ghi; callback sau replace CX-F1. Đọc CHECK/trigger, migration rebuild/recreate trigger và chạy unit/e2e liên quan. **Đã xét, không thấy hồi quy mới khác** vào KYC, backup, cuộc hẹn/HĐ/chỉ số trong suite chạy. Không dùng các mục hash/S-2 đã KNOWN để dựng lỗi mới; không đo race filesystem Rust trong F. |
| **S** | Phân tích chỉ gửi facts/cổng, tuổi 42 thay 1984; probe kiểm không gửi marker tên KH/RE/ghi chú/customer ID. Ghi chú trích xuất gửi nguyên văn đúng cảnh báo; JSON stringify không tạo thêm role/URL. Đọc key port/Rust commands, endpoint cố định, CSP/capability, URL mở trang, render text của UI. **Đã xét, không thấy phát hiện bảo mật mới xuyên gói**; không xem các lỗi đã báo ở A/C/D/E như đã được sửa. Không gọi key store hay browser thật; không chứng minh model không nghe injection ngữ nghĩa. |
| **P** | Số đo mới đầu-cuối CPU/sql.js ở §5; không thấy vấn đề đủ bằng chứng để xếp mức trong tải nhỏ đó. **Đã xét, không thấy phát hiện mới có số đo**. Không suy từ Mock ra latency model, từ build warning ra giật UI, hoặc từ test xanh ra tải 10.000 history tốt. |
| **B** | NoUnused/codemap/dependency check và đọc caller/export của các seam AI. So các bản nhãn/schema/counter giữa ai/db/UI. **Đã xét, không thấy bloat mới có tác hại**; danh sách provider, trần 20.000, status markup/normalization lặp đã KNOWN, không báo lại phong cách. CX-F2 là lệch formatter gây mất thông tin thực tế, không chỉ đề nghị gộp code. |
| **T** | 2.001 unit + 182 e2e mới; hai mutation có hành vi sai thật đều làm test đỏ. **Đã xét, không thấy giả xanh mới trong hai mutation này**. Suite vẫn xanh trước repro F1/F2/F3 nên không bảo vệ ba seam này; không công bố mutation score toàn repo hay coverage chứng minh tính đúng. Mutation chỉ Vite transform, dừng tiến trình là hết patch. |
| **A** | UI probe dùng role/label/alert/status bằng tiếng Việt; e2e gồm bàn phím/dialog; HTTP metadata bị mất ở CX-F2. **Đã xét, không thấy lỗi trợ năng/i18n mới khác** tại seam F. Không coi model text/dữ kiện snapshot là chuỗi phải dịch. Chưa chạy trình đọc màn hình thật, audit tương phản hoặc đánh giá lại phát hiện focus của gói D. |

**KNOWN đối chiếu:** `common/known.md:13–14` (hash/S-2), `:43–47` (G5 chặn nhầm), `:52–65` (job/UI/key Settings), `:67–74` (hằng/export/provider/date và mã F timeline). Không có bằng chứng mới riêng cho những mục đó ngoài việc phân biệt cửa sổ S-2 với CX-F1; không lập lại ID KNOWN mới. Các mục model quality/eval/Go đã chấp nhận ở `:5–8` không được đổi thành bug xuyên gói.

## 5. Hiệu năng có số đo

Node **v24.20.0**, sql.js/dependency có sẵn, DB bộ nhớ: một KH, hai version, một analysis discovery bằng Mock. Đo **sau tạo dữ liệu**, từ `analyseCustomer` qua `listAiAnalyses`, `analysisContent`, export, import và mở lại DB. Không disk persistence, network, Rust hay thời gian render Edge. Một warm-up, năm mẫu; giữ mọi mẫu trong JSON.

| Mẫu | Tổng ms | Backup byte |
|---|---:|---:|
| Warm-up | 8,8748 | 5.709 |
| 1 | 9,8726 | 5.709 |
| 2 | 8,2288 | 5.709 |
| 3 | 7,9204 | 5.709 |
| 4 | 8,3427 | 5.709 |
| 5 | 8,4019 | 5.709 |

**Trung vị: 8,3427 ms**, min/max 7,9204/9,8726 ms. Không có ngưỡng SLA hoặc tải khách hàng lớn suy ra từ số đo này. Chi phí parser/history tải lớn đã có review riêng, không tái công bố số đo đó như kết quả mới F.

## 6. Phạm vi đã đọc (file, dòng)

Số dòng tại SHA ghim. Chạy test/import một module không đồng nghĩa đã đọc tay toàn module. F tập trung hợp đồng/điểm nối trên toàn repo, không tuyên bố đọc tuần tự mọi file repo.

| File / nhóm | Dòng đã đọc |
|---|---|
| `CLAUDE.md`, `CONTEXT.md` | 1–120; 1–46 |
| `docs/design/phase-5-ai.md`, `phase-5-prompts.md`, `docs/golden/ai-eval.md` | 1–430; 1–345; 1–119 |
| `docs/decisions/0009-ai-copilot-provider-va-guardrail.md` | 1–82, gồm D-1/G5/W-1 |
| `docs/design/mockups/ai.html` | 636–671 và tra HTTP 455/653/860/987 |
| `packages/ai/src/run.ts`, `input.ts`, `schema.ts`, `web.ts`, `settings.ts` | Toàn file: 1–394; 1–132; 1–159; 1–121; 1–86 |
| `packages/ai/src/validator.ts` | 100–228; seam còn lại qua caller/test, không đọc lại toàn blocklist ở F |
| `packages/domain/src/kyc.ts`, `kyc-fact.ts` | 1–164; 1–57 |
| `packages/db/src/ai-analyses.ts`, `backup.ts` | 1–277; 1–201 |
| `packages/db/src/kyc.ts` | 1–250, 420–548 |
| `packages/db/src/schema.ts`, `backup-validation.ts`, `common.ts` | 290–384; 350–446 + tra seq dòng 64/148; 1–130 |
| `packages/db/src/migrations.ts`; migrations `0007`, `0008` | 1–39; 1–40; 1–12 |
| `apps/desktop/src/data/ai-analysis.ts`, `ai-tauri.ts`, `ai-jobs.ts`, `app-data.ts`, `persist-queue.ts` | Toàn file: 1–304; 1–75; 1–76; 1–381; 1–79 |
| `routes/customers/KycIntelligence.tsx`, `KycExtraction.tsx`, `use-ai-job.ts`, `extraction-view.ts` | 1–445; 1–134; 1–48; 1–83 |
| `routes/customers/CustomerProfile.tsx`, `KycWebSession.tsx` | 1–263; 1–172 |
| `routes/customers/ai-panel-view.ts` | 190–289, 330–521; lookup panelError/type dòng 187–190 |
| `routes/customers/CustomerKyc.tsx`, `kyc-view.ts`, `KycDialogs.tsx` | 85–284; 1–174; 345–490 |
| `routes/appointments/appointment-ai-view.ts`; `routes/settings-ai-view.ts` | 1–41; 50–99 |
| `routes/SettingsBackup.tsx`; `shell/CloseGuard.tsx`; `main.tsx` | 120–280; 1–82; 1–43 |
| `i18n/vi.ts` | 206–238; lookup HTTP/check status/backup confirm labels |
| `apps/desktop/src-tauri/src/ai.rs`, `lib.rs` | 1–355; 125–205 |
| `apps/desktop/src-tauri/tauri.conf.json`, `capabilities/default.json` | 1–31; 1–7 |
| `data/ai-analysis.test.ts`, `tauri-contract.test.ts`, `e2e/support.ts` | 1–320; 120–195; 1–173 |
| `packages/db/src/backup-invariants.test.ts` | Các vị trí seq qua grep (293,591–604,751–752,940–959); suite cả file được chạy |
| `package.json`, `vitest.config.ts` | 1–43; 1–70 |

Tiền tố các đường dẫn UI rút gọn trong bảng: `apps/desktop/src/`. `common/plan.md:1–119`, `baseline.md:1–29`, `known.md:1–104` đã đọc. Báo cáo Codex A–E và các harness loader/UI/build của chính Codex được đọc để tránh trùng và xây probe, không truy cập báo cáo reviewer khác.

## 7. Kết luận G7 Phase 5

**CHƯA SẴN SÀNG.** Lý do quyết định là đường AI → thay DB → lưu vẫn không cách ly các thế hệ dữ liệu: **kiểm chứng mới CX-F1** tạo CURRENT mang bằng chứng không tồn tại sau một restore hợp lệ. Đây là lỗi xuyên gói còn ở SHA ghim, không phải thất bại của model thật hay một mục chỉ suy đoán từ báo cáo khác.

Trước khi có thể đánh giá lại G7, cần chứng minh callback cũ không ghi vào DB vừa thay khi ID/version trùng, đồng thời giữ đúng hành vi đổi KYC trong cùng DB → STALE và Hủy → không lưu. CX-F2/F3 là hai lệch hợp đồng Low để Owner cân nhắc riêng; không cần nâng chúng thành High hoặc tự sửa golden.

2.001 unit và 182 e2e đạt là bằng chứng hồi quy tích cực, **không xóa được ca lỗi mới ngoài corpus**. Kết luận này chỉ dựa kiểm xuyên gói F; không lập bảng tổng hợp A–F, không khẳng định đã kiểm model/key/TLS thật hoặc thay quyết định G7 của Owner. Không đề xuất merge/phát hành trong review.

## 8. Phụ lục — nguồn test tạm, log và tái chạy

Tất cả ở **`C:\workspace\deep-review-5\codex\F\`**; dùng toolchain/dependency có sẵn, không công cụ mới.

| Nguồn / artifact | Nội dung |
|---|---|
| `loader.mjs`, `probe.mjs` | Node registerHooks/stripTypeScriptTypes nạp TS/SQL từ repo ghim; SQLite bộ nhớ, Mock/fake invoke, held adapter, native/web/extraction, identity restore, seq, token biên, benchmark. Nguồn đầy đủ giữ tại file, không pseudocode. |
| `probe-results.json`, `probe-final.log` | Kết quả hoàn chỉnh. `probe.log` là lượt đầu lỗi harness dùng `addKycNote` từ root export; đã sửa import module ngoài repo. `probe-complete.log` là lượt logic trước bổ sung artifact UI. |
| `D2-dangling-evidence.p2cbackup`, `D2-customer-id.txt` | DB thật xuất sau repro callback muộn; không dựng lỗi bằng chỉnh ID/hash. |
| `version-gaps.p2cbackup`, `version-customer-id.txt` | Backup chỉ đổi seq version 10,20; không đổi facts/output/hash. |
| `ui.mjs`, `ui-results.json`, `ui-final.log` | Edge UI import thật, hiển thị/click F5 và HTTP metadata qua `asExe` giả. Ba ca hoàn chỉnh. `ui-complete.log` giữ lượt harness dùng sai nhãn nút import trong exe; đã đổi sang “Backup rồi thay dữ liệu”. |
| `D2-ui.png`, `version-ui.png`, `http-ui.png` | Ảnh UI các bằng chứng trên. |
| `mutation.config.mjs`, `mutations.mjs` | Hai transform sản phẩm **chỉ trong bộ nhớ**. `mutation-summary.json`, `mutation-*.json/.log`, `mutations-complete.log` giữ baseline/đỏ. `mutations.log` là lỗi resolver CLI ở lượt harness đầu, không lỗi sản phẩm. |
| `regression-e2e.mjs`, `regression-playwright.config.mjs` | Build + snapshot + preview ngoài repo; chạy nguyên 182 test. `regression-e2e.log/.json`, `regression-traces/` giữ kết quả. Server/browser đã đóng. |
| `regression-unit.log`, `baseline-unit.log`, `typecheck-app.log`, `dependencies.log`, `codemap.log` | Log các kiểm trong §3. |
| `manifest.mjs`, `source-integrity.json/.log` | 17 file seam so byte với `git show HEAD`, tất cả trùng; SHA/detached/diff/status cuối. |

Biên token `9.007.199.254.740.992` của IPC giả bị command từ chối `AI_ANALYSIS_INVALID`, không ghi row; giữ trong JSON như kiểm robustness, **không lập phát hiện sản phẩm riêng** cho lượng token bất khả thi của yêu cầu tối đa 16.000. Không dùng ca đó làm lý do G7.

Lệnh tái chạy từ PowerShell, cwd repo; các lệnh ghi lại artifact của F, nên dùng thư mục output mới nếu muốn giữ thêm một lượt:

```powershell
node C:\workspace\deep-review-5\codex\F\probe.mjs
node C:\workspace\deep-review-5\codex\F\ui.mjs
node C:\workspace\deep-review-5\codex\F\mutations.mjs
node C:\workspace\deep-review-5\codex\F\regression-e2e.mjs
pnpm exec vitest run packages apps --reporter=dot
pnpm exec tsc -p apps/desktop/tsconfig.json --noUnusedLocals --noUnusedParameters
pnpm lint:deps
pnpm codemap:check
node C:\workspace\deep-review-5\codex\F\manifest.mjs
```

### Trạng thái worktree cuối

Không thay đổi tracked/staged, không patch cần gỡ trong repo; 17 file kiểm byte trùng HEAD, SHA vẫn đúng và detached. **Worktree vốn chưa sạch từ đầu**, `git status --short` đầu/cuối giữ đúng:

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

Không xóa/sửa các mục có sẵn của môi trường/Owner để tạo trạng thái sạch giả. Review không tạo mục mới trong repo; mọi output của phiên ở F. Báo cáo gói F kết thúc tại SHA ghim; chờ Owner, không tạo Issue hoặc tiếp tục sửa.
