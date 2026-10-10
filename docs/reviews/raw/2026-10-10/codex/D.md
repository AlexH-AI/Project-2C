# Review độc lập Phase 5 — Gói D: UI

- Ngày: 10/10/2026. Reviewer: Codex, phiên chính, không subagent.
- Repo: `C:\workspace\Project-2C-review-2`.
- SHA đã kiểm đầu và cuối đợt kiểm: `0df3606fb783cc89b1b9c413c02810340e273a4f` (detached HEAD).
- Phạm vi: panel KYC Intelligence, lịch sử/bằng chứng, ChatGPT web thủ công, trích xuất và hộp xác nhận, khối AI trong lịch hẹn, Settings AI, lớp điều phối AI phía TS và i18n liên quan.
- Kết quả: **7 phát hiện mới: 2 Medium, 5 Low**. Tất cả có bằng chứng CONFIRMED; CX-D5 là khoảng trống test, CX-D7 là lệch giữa hai tài liệu chuẩn. Không có Critical/High trong phạm vi đã kiểm.

Chỉ dùng repo, ba file `common/plan.md`, `baseline.md`, `known.md` và nguồn/probe của Codex. Không truy cập thư mục báo cáo của reviewer khác, không đọc báo cáo review của reviewer khác. Không gọi AI thật, không chạy eval, không mở ChatGPT, không truy cập Credential Manager. Các lượt UI dùng Mock hoặc IPC giả, `window.open` bị thay bằng hàm ghi nhận; probe trình duyệt chặn request ngoài localhost.

## 1. Phát hiện

### CX-D1 — Backup được chấp nhận nhưng báo cáo validator làm sập toàn màn hồ sơ

- **Mức:** Medium
- **Trục:** E (liên quan D, S: khả dụng của màn)
- **Vị trí:** `apps/desktop/src/routes/customers/ai-panel-view.ts:150–151`, `:131`, `:169`, `:140–141` (0df3606).
- **Tình trạng:** CONFIRMED
- **Mô tả:** `isIssue` chỉ kiểm có khóa `code` và `path`, rồi khẳng định đây là `ValidationIssue`. `path` là object vẫn tới `RegExp.exec`, còn `detail`/`code` sai kiểu vẫn có thể tới render. Spec §7.3 chỉ đòi `validator_json` là JSON hợp lệ; UI vì vậy phải chịu được JSON không có hình dạng báo cáo, đúng như comment tại dòng 154–156 đã hứa.
- **Tái hiện / bằng chứng:** `node C:\workspace\deep-review-5\codex\D\run-data.mjs` tạo dòng REJECTED với validator dưới đây qua `recordAiAnalysis`, xuất bằng chính `exportBackup`, rồi nhập bằng `importBackup`. Cả ghi và nhập đều thành công; `rejectedReport` ném `TypeError: Cannot convert object to primitive value`.

```json
[{"attempt":2,"errors":[{"code":"V1","path":{"toString":null},"detail":"bad"}]}]
```

  `ui-more.mjs` nhập file này qua Settings → Data, nhận thông báo thành công, rồi mở hồ sơ có dòng REJECTED mới nhất. ErrorBoundary thay toàn nội dung hồ sơ bằng “Màn này gặp lỗi và không hiển thị được”; panel KYC Intelligence còn 0 phần tử. Không cần bấm xem chi tiết validator. Bằng chứng: `data-probe.log`, `ui-more-results.json`, ảnh `D/validator-crash.png`.
- **Ảnh hưởng:** một backup hợp lệ theo hợp đồng hiện tại có thể khiến RE không xem/làm việc trên hồ sơ đó. Đã chứng minh mất khả dụng màn, chưa chứng minh mất dữ liệu hoặc thực thi script.
- **Đề xuất:** kiểm kiểu chuỗi, miền mã V1–V7 và hình dạng từng issue trước khi dùng; bỏ entry không đọc được, giữ thông báo REJECTED chung. Không cần siết golden hoặc đổi hợp đồng nhập để che lỗi UI. Ước lượng 30–60 dòng SP, thêm ca JSON sai hình dạng và ca mở hồ sơ sau nhập.

### CX-D2 — Kết quả của lượt AI trước khi thay DB được ghi vào DB vừa nhập

- **Mức:** Medium
- **Trục:** D (liên quan E, C)
- **Vị trí:** `apps/desktop/src/data/ai-analysis.ts:177–181`, `:202–204`; `apps/desktop/src/data/app-data.ts:302–314` (0df3606).
- **Tình trạng:** CONFIRMED
- **Mô tả:** lượt chạy giữ customer/version ID, nhưng sau `await` gọi `app.run` trên DB hiện tại. Việc bỏ kết quả khi thay dữ liệu chỉ hoạt động tình cờ khi ID không còn tồn tại. Nhập backup xuất từ chính DB này giữ các ID nên callback của lượt cũ vẫn thêm analysis vào dữ liệu vừa thay.
- **Tái hiện / bằng chứng:** `data-probe.ts` tạo KH và dữ kiện bằng lệnh nghiệp vụ, xuất backup chưa có analysis; bắt đầu `analyseCustomer` với adapter giữ promise; **đợi `app.importBackup(...)` hoàn tất**, sau đó trả lời bằng `createMockAdapter`. Log:

```json
{"case":"same-id-backup","outcome":{"kind":"saved","status":"ACCEPTED"},"rows":[{"state":"CURRENT","seq":1}]}
```

  Kết quả cuối có một analysis CURRENT không nằm trong snapshot vừa nhập. Không sửa ID/hash hay dựng backup sai. Test hiện có `ai-analysis.test.ts:239–250` đòi discard sau Nạp lại, nhưng Nạp lại tạo ID khác nên không bắt điều kiện này.
- **Ảnh hưởng:** thao tác “Thay dữ liệu”, “Nhập không gộp dữ liệu” có thể bị tiếp nối bởi ghi từ lượt chạy thuộc DB trước. Repro chỉ chứng minh analysis xuất hiện sau khi restore; không khẳng định đã tái hiện gắn sang KH khác hoặc nội dung sai so với facts trong snapshot.
- **Đối chiếu KNOWN:** khác cửa sổ S-2 ở `common/known.md:14`: ở đây adapter chỉ trả lời **sau khi replace hoàn tất và DB cũ đã đóng**, không phải ghi trong lúc chờ backup. Ghi nhận như bằng chứng mới cho cách ly callback khi thay DB.
- **Đề xuất:** chụp token/identity của DB lúc bắt đầu, kiểm lại trước khi lưu; discard khi DB đã được thay dù ID trùng. Đổi KYC thông thường trong cùng DB vẫn lưu STALE đúng §3. Ước lượng 40–90 dòng SP; thêm test restore cùng ID sau khi replace hoàn tất.

### CX-D3 — Trạng thái key đọc lúc mở màn ghi đè trạng thái vừa lưu thành công

- **Mức:** Low
- **Trục:** E
- **Vị trí:** `apps/desktop/src/routes/SettingsAi.tsx:152–162`, `:174–177` (0df3606).
- **Tình trạng:** CONFIRMED
- **Mô tả:** effect đọc `keyStatus()` chỉ có cờ tránh cập nhật sau unmount. Nếu phản hồi này tới sau thao tác Lưu key, kết quả cũ vẫn ghi đè `stored=true` của thao tác mới.
- **Tái hiện / bằng chứng:** `ui-probe.mjs` dùng `asExe` và IPC giả, giữ promise `ai_key_status`; nhập `dummy-D-key`, bấm Lưu key, kiểm “Đã có key”; sau đó giải phóng promise trạng thái cũ với `false`. Kết quả `late-key-status`: IPC giả đã ghi nhận key, UI lại hiện **“Chưa có key”**, số nút “Xóa key…” = 0. Không có Credential Manager hoặc key thật trong phép thử.
- **Ảnh hưởng:** RE thấy trạng thái sai ngay sau lần lưu đầu, không còn nút xóa cho key đang có; có thể nhập/lưu lại không cần thiết. Không thấy key bị mất hoặc rò.
- **Đề xuất:** vô hiệu hóa phản hồi trạng thái cũ khi bắt đầu set/delete bằng số thứ tự thao tác, hoặc đọc lại trạng thái sau thao tác và bỏ phản hồi cũ. Ước lượng 20–40 dòng SP, test trì hoãn IPC.

### CX-D4 — Đang chạy DeepSeek nhưng dòng tiến trình đổi thành Kimi sau sửa Settings

- **Mức:** Low
- **Trục:** C
- **Vị trí:** `apps/desktop/src/routes/customers/KycIntelligence.tsx:322`, `:374–377`; đối chiếu snapshot lời gọi ở `apps/desktop/src/data/ai-analysis.ts:125–132` (0df3606).
- **Tình trạng:** CONFIRMED
- **Mô tả:** lời gọi dùng cấu hình chụp khi bắt đầu, nhưng nhãn đang chạy đọc Settings hiện tại mỗi lần render. Người dùng có thể rời hồ sơ sang Settings khi job còn chạy.
- **Tái hiện / bằng chứng:** `ui-more.mjs`, IPC giả giữ yêu cầu phân tích; bắt đầu với OpenCode/DeepSeek V4.1 Flash; sang Settings đổi model thành Kimi K3; quay về hồ sơ khi chưa trả lời. Log `running-model-label`: request thực tế có `model=deepseek-v4.1-flash`, dòng hiện **“Đang phân tích… · Kimi K3 · tối đa 2 phút mỗi lần thử”**. Không có request mới tới model Kimi.
- **Ảnh hưởng:** RE hiểu sai model đang xử lý dữ kiện và kết quả đang chờ. Phép thử không cho thấy DB ghi sai model; đây là nhãn tiến trình sai.
- **Đề xuất:** lưu metadata provider/model của lượt chạy trong job và dùng nó để hiển thị trạng thái đang chạy, như cấu hình đã chụp cho request. Ước lượng 40–80 dòng SP, test điều hướng và đổi cấu hình khi pending.

### CX-D5 — Bỏ callback xử lý đề xuất đã sửa mà toàn bộ e2e AI vẫn xanh

- **Mức:** Low
- **Trục:** T
- **Vị trí:** `e2e/customer-ai.spec.ts:275–286`; seam `apps/desktop/src/routes/customers/KycDialogs.tsx:457` (0df3606).
- **Tình trạng:** CONFIRMED
- **Mô tả:** ca e2e có sửa đề xuất “2 con” thành “3 con” và xác nhận, nhưng chỉ kiểm facts có “3”; không kiểm đề xuất “2” đã được bỏ. Nếu callback `onSaved()` mất, ca xác nhận nguyên giá trị vẫn xanh vì bộ lọc trùng facts che lỗi; ca đã sửa mới bộc lộ.
- **Tái hiện / bằng chứng:** `run-e2e.mjs baseline`: **18/18 xanh, 24,2 s**. `run-e2e.mjs mutant` dùng Vite load hook cấp source shadow, chỉ bỏ dòng `onSaved()`; **18/18 vẫn xanh, 24,6 s**. `ui-more.mjs` kiểm ngay sau xác nhận đã sửa: baseline `pendingChildren=0`, mutant `pendingChildren=1`, cả hai `fact3=true`. `mutation.patch` và `KycDialogs.mutant.tsx` nằm ngoài repo; chưa từng patch worktree.
- **Ảnh hưởng:** hồi quy khiến đề xuất đã xử lý vẫn còn trong màn không được các e2e AI hiện tại bắt. **Bản gốc xử lý đúng**; đây không phải lỗi sản phẩm đã có.
- **Đề xuất:** sau xác nhận giá trị đã sửa, assert đề xuất đó không còn và hộp đã đóng, trước khi bấm trích xuất lại. Khoảng 5–15 dòng test, 0 dòng SP.

### CX-D6 — Bấm bằng chứng F bằng bàn phím chỉ cuộn hình ảnh, không đưa focus tới dữ kiện

- **Mức:** Low
- **Trục:** A
- **Vị trí:** `apps/desktop/src/routes/customers/CustomerProfile.tsx:100–103`; `CustomerKyc.tsx:75–79`; `KycIntelligence.tsx:101–103` (0df3606).
- **Tình trạng:** CONFIRMED (DOM và bàn phím; chưa chạy trình đọc màn hình thật)
- **Mô tả:** nút mã F gọi `scrollIntoView` và tô viền khoảng hai giây. Dữ kiện đích là `span` không focusable, không có live announcement; focus tiếp tục ở nút mã F thay vì dữ kiện người dùng muốn đọc.
- **Tái hiện / bằng chứng:** `ui-probe.mjs` focus nút F1 rồi nhấn Enter. Log `fact-keyboard`: `document.activeElement` vẫn là `BUTTON` có chữ `F1`, còn `fact-F1` có `aria-current=true`. `aria-current` trên một span ngoài focus không tạo đường chuyển focus hay thông báo dữ kiện vừa đến.
- **Ảnh hưởng:** người dùng bàn phím hoặc trình đọc màn hình không được dẫn tới nội dung bằng chứng; hiệu ứng cuộn/viền chỉ có ích khi nhìn thấy màn. Không khẳng định đã đo hành vi cụ thể của NVDA/JAWS.
- **Đề xuất:** cho đích nhận focus lập trình (`tabIndex=-1`) và gọi focus sau cuộn, hoặc có thông báo live phù hợp mang tên/giá trị dữ kiện. Ước lượng 10–30 dòng SP; test active element/nội dung được thông báo.

### CX-D7 — Phạm vi khóa nút khi chờ ChatGPT web lệch giữa ADR và spec chi tiết

- **Mức:** Low
- **Trục:** C
- **Vị trí:** `docs/decisions/0009-ai-copilot-provider-va-guardrail.md:79`; `docs/design/phase-5-ai.md:79`; `apps/desktop/src/routes/customers/KycExtraction.tsx:59` (0df3606).
- **Tình trạng:** CONFIRMED (khác biệt văn bản và trạng thái nút)
- **Mô tả:** ADR-0009 W-1 mục 6 ghi “trong lúc chờ dán, **các nút AI của chính KH đó tắt**”. Spec §3.1 mục 4 chỉ liệt kê Phân tích OpenCode/Mock và ChatGPT web. UI làm theo danh sách hẹp: nút AI trích xuất của chính KH vẫn bật khi đang chờ dán.
- **Tái hiện / bằng chứng:** `ui-probe.mjs` tạo KH có ghi chú đủ dài, mở phiên web của KH, kiểm `AI trích xuất` trong chính hồ sơ: log `web-own-extraction`, `enabled=true`. `disabled` của nút này chỉ xét `busy || button.tooShort`; phiên web không giữ global runner.
- **Ảnh hưởng:** code phù hợp danh sách cụ thể của spec nhưng không phù hợp lời chốt rộng hơn trong ADR. Chưa thấy lỗi lưu dữ kiện tự động, hai request HTTP chạy đồng thời, hoặc sai kết quả chỉ vì nút còn bật; không nâng thành lỗi concurrency High.
- **Đề xuất:** khi xử lý lệch tài liệu tại G1, xác nhận phạm vi của lời chốt W-1. Nếu giữ nghĩa “các nút AI”, truyền trạng thái phiên web cùng KH tới nút trích xuất để khóa; vẫn giữ khả năng gọi AI ở KH khác theo §3.1 mục 5. Khoảng 20–50 dòng SP. Không sửa golden cho khớp UI.

## 2. Phạm vi đã đọc

Các đường dẫn dưới đây tương đối với repo đã ghi ở đầu. “Toàn file” là phạm vi đọc, không hàm ý mọi nhánh đều đã tái hiện. Các phần lân cận ngoài D chỉ được đọc để kiểm hợp đồng nối vào UI; không thay thế review gói A/B/C/E/F.

### Tài liệu chuẩn và quy tắc

- `CLAUDE.md:1–120`, `CONTEXT.md:1–46`, `apps/desktop/CLAUDE.md:1–54`, `.claude/rules/i18n-ui.md:1–14`, `.claude/rules/tests.md:1–17`.
- `docs/design/phase-5-ai.md:1–430`; `phase-5-prompts.md:1–345`; `docs/golden/ai-eval.md:1–119`; `docs/decisions/0009-ai-copilot-provider-va-guardrail.md:1–82`, gồm D-1/G5/W-1.
- `docs/design/mockups/ai.html`: đọc chọn đoạn để đối chiếu §1 Settings, §2 panel/lịch sử/REJECTED, §3 trích xuất và hộp 3f, §4 ChatGPT web, phần quyết định. Các mốc tra bằng `rg`: `:302`, `:471`, `:602–623`, `:666`, `:747`, `:767–771`, `:924`, `:957`, `:961–989`; không coi là đã đọc toàn file hoặc audit toàn bộ CSS mockup.
- `C:\workspace\deep-review-5\common\plan.md`, `baseline.md`, `known.md`: toàn nội dung phục vụ đợt review; không dùng số đo baseline như số đo mới của phiên này.

### UI và điều phối — toàn file

| Vùng | File và dòng |
|---|---|
| Panel / lịch sử / web | `routes/customers/KycIntelligence.tsx:1–445`; `KycHistory.tsx:1–154`; `KycWebSession.tsx:1–172`; `ai-panel-view.ts:1–521` |
| Trích xuất / xác nhận | `KycExtraction.tsx:1–134`; `extraction-view.ts:1–83`; `KycDialogs.tsx:1–490` |
| Tích hợp hồ sơ KYC | `CustomerProfile.tsx:1–263`; `CustomerKyc.tsx:1–284`; `kyc-view.ts:1–235`; `use-ai-job.ts:1–48` |
| Cài đặt AI | `routes/SettingsAi.tsx:1–357`; `routes/settings-ai-view.ts:1–107` |
| Chi tiết lịch hẹn | `routes/appointments/AppointmentAi.tsx:1–81`; `appointment-ai-view.ts:1–41` |
| Lớp dữ liệu AI | `data/ai-analysis.ts:1–304`; `ai-jobs.ts:1–76`; `ai-tauri.ts:1–75`; `app-data.ts:1–381`; `AppDataContext.tsx:1–52` |

Tiền tố các file trong bảng là `apps/desktop/src/`; file rút gọn cùng hàng nằm cùng thư mục với file đầu hàng.

### Chỗ nối vào và test

- `apps/desktop/src/main.tsx:1–43`; `routes/Settings.tsx:1–100`; `routes/SettingsBackup.tsx:1–280`; `routes/appointments/AppointmentsScreen.tsx`: imports và khối chi tiết/AI khoảng dòng 559–655.
- `packages/ui/src/components/TextField.tsx:1–81`, `Dialog.tsx:1–82`; ErrorBoundary/Screen tại shell và cách báo lỗi hồ sơ được kiểm qua UI.
- `apps/desktop/src/i18n/index.ts:1–132`, `vi.ts:122–312`, `:367–385`, `:522–524`, các câu backup/data tại `:860–912`.
- `packages/ai/src/web.ts:1–121`, `run.ts:1–205`: đầu vào, các outcome, validation/retry và runner; không audit toàn bộ blocklists trong gói D.
- `packages/db/src/ai-analyses.ts:90–180`, `database.ts:1–140`, `migrations.ts:1–45`, schema/backup-validation tại chỗ nối AI tìm bằng `rg`; đọc helpers tạo dữ liệu thử. Không chạy migration audit riêng trong D.
- `apps/desktop/src-tauri/tauri.conf.json` và `capabilities/default.json`: toàn file, dùng cho trục S của UI; không chạy Rust hay đọc key.
- Test đã đọc các ca liên quan và chạy trọn: `data/ai-analysis.test.ts`, `ai-jobs.test.ts`, `ai-tauri.test.ts`, `routes/customers/ai-panel-view.test.ts`, `extraction-view.test.ts`, `routes/settings-ai-view.test.ts`, `routes/appointments/appointment-ai-view.test.ts`.
- e2e: **chạy trọn** 3 file `e2e/customer-ai.spec.ts:1–386`, `customer-ai-web.spec.ts:1–214`, `settings-ai.spec.ts:1–233`. Đọc các ca liên quan bằng tìm kiếm và đoạn source, gồm `customer-ai.spec.ts:251–302`, `customer-ai-web.spec.ts:1–74`, `settings-ai.spec.ts:100–146`, helpers liên quan tại `e2e/support.ts`; không khẳng định đã đọc tuần tự toàn bộ ba file. Đọc ca AI trong `e2e/appointments.spec.ts:816–903`, chạy test tại dòng 848. Không claim đã chạy toàn bộ e2e repo.

## 3. Bảng đếm mức × trục

Mỗi phát hiện mới tính đúng một lần theo trục chính; KNOWN không cộng vào bảng.

| Mức | E | G | C | D | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 2 |
| Low | 1 | 0 | 2 | 0 | 0 | 0 | 0 | 1 | 1 | 5 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng** | **2** | **0** | **2** | **1** | **0** | **0** | **0** | **1** | **1** | **7** |

## 4. Các trục đã xét, phần không thấy phát hiện mới

| Trục | Cách xét và kết quả |
|---|---|
| E | Chạy các ca rỗng/quá 20.000 ký tự, lần thử, lỗi/hủy/khóa runner, đổi KYC, rời/quay lại màn trong unit/e2e; probe dán 1 triệu ký tự, trì hoãn IPC và thay DB khi AI pending. Có CX-D1/D3; không thấy phát hiện mới khác trong các ca đã chạy. Unicode/chuyển ngày kiểm qua hàm ngày chuẩn và test hiện có; không chạy đồng hồ qua nửa đêm trong exe. |
| G | **Đã xét, không thấy phát hiện mới ở seam UI.** Đối chiếu G5 V1–V7 và golden: OpenCode/Mock qua `runAnalysis`, web qua `checkWebAnswer`, trích xuất qua `runExtraction`; không có đường UI tự bỏ validator để ghi analysis. Unit/e2e chứng minh hai lần sai → REJECTED, dán trắng/quá dài không tính lần, dữ kiện chỉ ghi sau xác nhận, sửa/bỏ đề xuất được. V3–V6 không áp vào giá trị trích xuất theo G5, không báo đó là bypass. Không kiểm sức chống prompt injection của model thật, không kết luận mọi biến thể blocklist đều an toàn từ D. |
| C | Đối chiếu nhãn CURRENT/STALE/REJECTED, chip Mock/ChatGPT, mã F, mức bằng chứng, lịch sử và cảnh báo với spec/mockup; chi tiết lịch hẹn lấy ACCEPTED mới nhất và chỉ đọc, test e2e xanh. Có CX-D4/D7; chưa thấy lệch mới khác. Badge trên kết quả lịch sử được chọn và format dd/mm không năm là hành vi đã thống nhất, không báo lỗi. |
| D | Xuất/nhập bằng API thật của DB và UI; malformed validator theo hợp đồng §7.3 dẫn CX-D1; restore cùng ID sau lượt AI pending dẫn CX-D2. Test chứng minh hủy không ghi, đổi KYC lưu STALE, xóa KH discard, trích xuất không tự lưu. Không thấy mất dữ liệu trong các probe còn lại; chưa kiểm rollback Rust hay mọi bảng migration của gói B. |
| S | **Đã xét, không thấy phát hiện mới ngoài mất khả dụng ở CX-D1.** Tìm `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `href`, `fetch`, `window.open` trong đường AI UI. Output model là text React, link nội bộ do app dựng; payload `<img src=x onerror="window.__xss=1"> https://bad.example/` được giữ nguyên chữ: 0 img, 0 anchor ngoài, `__xss=null`. Không có markdown tự chạy. URL web là hằng `CHATGPT_URL`, có `noopener`, không ghép facts vào URL. Kiểm CSP/capabilities khai báo và key write-only phía TS; key không ghi vào settings/backup theo test. Không chứng minh triển khai Credential Manager/TLS của Rust bằng phiên này. |
| P | **Đã xét, không thấy lỗi mới đủ bằng chứng để xếp mức.** Dán/kiểm 1.000.000 ký tự: **192,08 ms** tính từ `performance.now()` phía harness trước fill tới assertion lỗi 20.000, gồm IPC Playwright/render; vẫn ở lần 1, chưa lưu history. `historyRows` benchmark bên dưới có chi phí lớn ở dữ liệu tổng hợp 10.000 analysis + 10.000 version, nhưng không coi đó là số đo render/DB hay tải thực tế của khách hàng. |
| B | **Đã xét, không thấy bloat mới cần báo.** `pnpm exec tsc -p apps/desktop/tsconfig.json --noUnusedLocals --noUnusedParameters` xanh; `node tools/codemap.mjs --check` báo maps up to date. `rg` và đọc đường dùng các exports/nhánh UI không thấy export chết hoặc lặp mới ≥3 nơi. Hai khối status trích xuất/panel và hai phép chuẩn hóa đã nằm trong KNOWN, không đếm lại. |
| T | 140 unit xanh, 18 e2e AI baseline xanh, 1 e2e lịch hẹn AI xanh. Mutation độc lập chứng minh CX-D5; không suy ra test đủ chỉ từ coverage/baseline. Không chạy cả 182 e2e hoặc live eval. |
| A | Kiểm dialog, TextField labels, alert/status, thao tác bàn phím và i18n Phase 5; phát hiện CX-D6. Chuỗi output của model/dữ kiện không bị coi là chuỗi UI phải dịch. Chưa thấy lỗi i18n mới khác ngoài các mục KNOWN; không chạy audit tương phản tự động hay trình đọc màn hình thật. |

### Số đo lịch sử

Node 24.20.0, `historyRows` trên dữ liệu tổng hợp trong `data-probe.ts`; năm lần mỗi cỡ, lần đầu chưa warm. Mỗi analysis có một version khác nhau để đi qua `versions.findIndex`, cùng cấu trúc output hợp lệ lấy từ Mock. Không có ghi 10.000 dòng DB; đây là benchmark thuần hàm view.

| Analysis / version | Lần đầu (ms) | Trung vị 5 lần (ms) | Min–max (ms) |
|---|---:|---:|---:|
| 10 / 10 | 0,0985 | 0,0111 | 0,0109–0,0985 |
| 1.000 / 1.000 | 3,8469 | 3,2196 | 3,1741–3,8469 |
| 10.000 / 10.000 | 258,7873 | 123,5091 | 105,2404–258,7873 |

`kycVersionSeq` có tìm tuyến tính mỗi dòng; có thể lập map khi phải hỗ trợ lịch sử rất lớn. Chưa có tải/giới hạn hay SLA tương ứng trong spec để kết luận đây là lỗi chặn. Log giữ mọi số đo, không chỉ chọn mẫu nhanh.

### KNOWN đối chiếu, không báo lại

- **KNOWN — `common/known.md:14` S-2:** ghi muộn trong cửa sổ chờ backup và replace chồng nhau. CX-D2 cung cấp ca **sau** replace, giữ cùng ID, như mô tả ở trên.
- **KNOWN — `:52–54`:** lỗi kết thúc lúc rời màn chỉ nằm trong component `ended`; `AiJobs.start` có thể ghi đè cùng khóa ở đường gọi không được UI hiện tại mở. Không báo như phát hiện mới.
- **KNOWN — `:55–60`:** preview refused chỉ báo lúc submit; lặp status panel/trích xuất; nhãn note theo button; dấu `:` viết thẳng; chuẩn hóa lặp hai nơi.
- **KNOWN — `:61–65`:** warning cấu hình mặc định khó xóa, kết quả connection cũ sau đổi cấu hình, câu ChatGPT thiếu lead in đậm, thiếu e2e xóa warning. CX-D3 là race trạng thái **key**; CX-D4 là metadata của **lượt đang chạy**, khác các mục này.
- **KNOWN — `:13`:** hash KYC không được kiểm khi nhập. Không dùng lỗi hash này để tạo CX-D2.

## 5. Phụ lục — test tạm, nguồn và lệnh

Mọi file sau nằm trong **`C:\workspace\deep-review-5\codex\D\`**. Nguồn đầy đủ được giữ tại đó; không có script/product patch trong repo.

| Nguồn | Nội dung và bằng chứng |
|---|---|
| `run-data.mjs`, `data-probe.ts` | Vite `runnerImport` nạp module TS gốc; dùng lệnh nghiệp vụ tạo facts, held adapter + Mock, restore backup cùng ID, validator sai hình dạng, benchmark lịch sử. Log `data-probe.log`; fixture `validator-damaged.p2cbackup`, ID tại `customer-id.txt`. |
| `ui-probe.mjs` | Headless Edge trên dev server localhost: web pending/AI trích xuất, dán 1 triệu ký tự, HTML dưới dạng chữ, bàn phím F1, fake key IPC trả muộn. `ui-probe.log`, `ui-results.json`, `model-text.png`. |
| `run-e2e.mjs`, `playwright.config.mjs` | Build/preview hoàn toàn ngoài repo; chạy 3 file e2e AI baseline hoặc shadow mutation. `e2e-baseline.log`, `e2e-mutant.log`; `baseline-dist`, `mutant-dist`. |
| `mutation.patch`, `KycDialogs.mutant.tsx` | Chỉ bỏ `onSaved()` ở source shadow. Vite hook thay nội dung module trong build mutant; worktree không bị patch. Build baseline dùng file gốc. |
| `ui-more.mjs` | So sánh giữ/bỏ đề xuất đã sửa trên baseline và mutant; UI import fixture validator; fake IPC giữ phân tích, đổi model khi pending. `ui-more.log`, `ui-more-results.json`, `validator-crash.png`. |
| `run-appointment.mjs`, `playwright-appointment.config.mjs` | Preview build baseline ngoài repo, chạy riêng test AI chi tiết lịch hẹn tại `e2e/appointments.spec.ts:848`; `e2e-appointment.log`. |

Thứ tự tái chạy từ PowerShell (đường dẫn tuyệt đối, không gọi dịch vụ AI):

```powershell
node C:\workspace\deep-review-5\codex\D\run-data.mjs
node C:\workspace\deep-review-5\codex\D\ui-probe.mjs
node C:\workspace\deep-review-5\codex\D\run-e2e.mjs baseline
node C:\workspace\deep-review-5\codex\D\run-e2e.mjs mutant
node C:\workspace\deep-review-5\codex\D\ui-more.mjs
node C:\workspace\deep-review-5\codex\D\run-appointment.mjs
```

Các harness khởi tạo ngày demo bằng `VITE_DEMO_ANCHOR=15/09/2026` và đóng server/browser trong `finally`. Có sửa lỗi cấu hình ngày của harness ở lượt chạy đầu (dùng ISO thay format mà `parseDate` nhận); kết quả xanh và số đo ở báo cáo là các lượt đã sửa harness, không coi lỗi đó là lỗi repo.

Lệnh kiểm unit đã chạy từ repo:

```powershell
pnpm test apps/desktop/src/data/ai-analysis.test.ts apps/desktop/src/data/ai-jobs.test.ts apps/desktop/src/data/ai-tauri.test.ts apps/desktop/src/routes/customers/ai-panel-view.test.ts apps/desktop/src/routes/customers/extraction-view.test.ts apps/desktop/src/routes/settings-ai-view.test.ts apps/desktop/src/routes/appointments/appointment-ai-view.test.ts
```

Kết quả: **7 file / 140 test xanh**, khoảng 1,59 s. Không có log unit riêng trong D; số này lấy từ output lệnh của phiên. TSC với noUnused và codemap cũng xanh như trục B. Không chạy `pnpm verify` toàn repo trong phiên review D; số `pnpm verify` trong baseline là số đã có, không nhận là kiểm mới.

Kiểm cuối: `git rev-parse HEAD` vẫn đúng SHA ghim; `git diff --exit-code` và `git diff --cached --exit-code` đều xanh. `git status --short` giữ nguyên ba mục **có sẵn từ đầu phiên**:

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

Không xóa các file của môi trường/Owner để tạo trạng thái sạch giả. Không có thay đổi file tracked, commit, Issue hay thao tác merge. Báo cáo chỉ gói D; chưa đưa kết luận G7 dành cho gói F.