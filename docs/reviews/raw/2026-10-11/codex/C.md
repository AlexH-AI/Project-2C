# Codex — review Phase 5 vòng 2, GÓI C

SHA: `705ea7c0e76dcdcf8c89f949fc2e3b3b6e4fff2c`, detached tại `C:\workspace\Project-2C-review-2`. Bắt đầu 11/10/2026 02:10:20, kết thúc 02:32:11 (UTC+7). Reviewer làm trong phiên chính, không subagent. Báo cáo này chỉ xét gói C; không kết luận G7 và không tổng hợp với báo cáo vòng 2 khác.

## Bảng R

19 DR5 kiểm chính của gói C: **16 ĐÃ SỬA, 2 SỬA MỘT PHẦN, 1 HỒI QUY**. “Gỡ sửa” dưới đây là phép biến đổi nguồn trong bộ nhớ của Vite/Vitest; không thay file trong worktree. Mọi test đỏ được kiểm log để phân biệt assertion thất bại với lỗi build hoặc không tìm thấy test.

| DR5 | Issue | Kết luận | Bằng chứng: tái hiện cũ; test đỏ khi gỡ sửa | Ghi chú / biến thể gần |
|---|---|---|---|---|
| 15 | #490 | SỬA MỘT PHẦN | Test `fact codes F{seq} ... leads a code replaced ...` và `analysisContent ... weighs ... CURRENT ...` xanh. Mutant `remap` làm 2 test đỏ, `refreshed` làm 1 test đỏ. E2E sửa ngày sinh cùng năm giữ CURRENT, F1 dẫn tới F6. | Panel đúng, STALE giữ ngày chụp, đổi giá trị thật không ánh xạ. Khối lịch hẹn vẫn dùng ngày cũ: **CX2-C1**. |
| 30 | #486 | ĐÃ SỬA | Unit giữ `httpStatus/serverMessage`; Edge kiểm lỗi ở panel, trích xuất và Settings: 401/429, AI_HTTP 500/502. Mutant `http` làm 2 test thông báo chung đỏ. | HTTP không có message vẫn có mã; lỗi không có HTTP giữ câu riêng; GENERAL không nhận thân thô. |
| 31 | #486 | ĐÃ SỬA | `ai-jobs.test.ts ... keeps the settings taken at the click ...` xanh; mutant `jobs` đỏ 1 test. E2E `the run says the model ...` xanh; mutant `runningModel` đỏ tại dòng model. | Đổi từ DeepSeek sang Kimi rồi Mock trong lúc chạy vẫn hiện DeepSeek và IPC vẫn gửi model đã chụp; Hủy giữ ảnh chụp tới khi runner hết bận. |
| 32 | #486 | ĐÃ SỬA | Ô key có `type=password`, `spellcheck=false`; lưu thành công xóa nội dung. Mutant `password` làm e2e `the key is checked ...` đỏ: nhận `text` thay `password`. | Lưu lỗi giữ giá trị trong ô mật khẩu để thử lại; `TextField` không áp `type` cho textarea. Không dùng key thật. |
| 33 | #489 | ĐÃ SỬA | E2E Mock và ChatGPT web có câu hoàn tất `role=status`; trích xuất có câu báo đề xuất. Mutant `status` đỏ 1 unit; mutant `live` đỏ tại status sau lưu web. | ACCEPTED/REJECTED có câu khác nhau; Hủy/discarded không báo đã lưu; live container tồn tại trước khi được điền. Kiểm DOM/keyboard, không chạy NVDA. |
| 36 | #484 | ĐÃ SỬA | Hai ca nhập backup cùng ID và CURRENT trích F5 vào backup chỉ F1–F4 đều trả `discarded`, không ghi dòng. Mutant `generation` đỏ cả 2; mutant `counter` đỏ thêm test thế hệ DB. | Nạp lại cũng bỏ; đổi KYC cùng DB vẫn lưu STALE; backup lỗi/seed lỗi không tăng thế hệ; Hủy không lưu. Kết quả **đề xuất trích xuất** là ca mở rộng riêng ở CX2-C3, không phải đường ghi `ai_analyses` mà Issue #484 đã sửa. |
| 37 | #486 | HỒI QUY | Ca cũ `a key status read late never overwrites the key just saved` xanh. Mutant `keyRace` đỏ ca này. | Bảo vệ trạng thái sau lưu thành công đúng. Sau **lưu thất bại**, kết quả status ban đầu vẫn bị bỏ vĩnh viễn trong lần mở màn đó: **CX2-C5**. Bỏ riêng `!acted.current` làm probe lỗi mới hết tái hiện. |
| 38 | #489 | ĐÃ SỬA | E2E bấm mã F bằng Enter chuyển focus tới dòng dữ kiện. Mutant `focus` đỏ `toBeFocused`. | Đã kiểm cả mã còn hiệu lực và mã ánh xạ sau xác nhận lại; mã không còn hiệu lực có thông báo. |
| 39 | #483 | ĐÃ SỬA | E2E `the app's own message ... AI trích xuất waits ...` xanh: nút trích xuất của KH tắt trong phiên web, bật sau kết thúc. Mutant `webDisable` đỏ: nút vẫn enabled. | KH khác không bị khóa bởi phiên web này; rời hồ sơ làm mất phiên web. |
| 40 | #489 | SỬA MỘT PHẦN | Panel KH khác có câu bận, hết bận thì câu biến mất. Mutant `busy` đỏ 1 unit. Edge giữ Kiểm tra kết nối rồi mở KH: panel có câu, ghi chú chỉ có nút tắt. | Issue #489/test chấp nhận chỉ nói panel, nhưng quyết định Owner §8 câu 7 đã chốt cả **panel / ghi chú**: **CX2-C2**. |
| 41 | #489 | ĐÃ SỬA | Panel trống Mock/OpenCode có count/provider/gói/model và câu dữ liệu gửi đi. Mutant `help` đỏ 2 unit về số dữ kiện. E2E kiểm cả câu Mock và OpenCode. | Count gồm active/conflict, bỏ superseded; không đọc model giả cho Mock; help mất khi có bản phân tích. |
| 42 | #489 | ĐÃ SỬA | E2E lịch hẹn có badge ChatGPT web và bản ACCEPTED mới nhất; REJECTED mới hơn không thay kết quả hiển thị. Mutant `badgeAppointment` đỏ ca AI ở lịch hẹn. | Mock vẫn có badge, OpenCode giữ tên model; không thêm nút gọi AI ở lịch hẹn. |
| 43 | #489 | ĐÃ SỬA | Đóng phiên web sau lưu/Hủy trả focus về nút mở; Đóng dòng “0 đề xuất” trả về AI trích xuất. Mutant `webFocus` và `emptyFocus` mỗi phép làm 1 e2e đỏ. | Cơ chế fallback heading khi nút mở bị tắt đã đọc. Biến thể **Bỏ đề xuất cuối** chưa được xử lý: CX2-C4; khác hai trigger đóng được nêu trong Issue. |
| 44 | #486 | ĐÃ SỬA | AI_NO_KEY ở panel/trích xuất có link mở `#/settings/ai`; route Settings nhận mục AI. Mutant `link` đỏ `errorParts ... links ...`. | Các lỗi khác không bị cắt thành link nhầm; lỗi vẫn dùng câu chung §5.3. |
| 45 | #489 | ĐÃ SỬA | E2E bắt đầu từ CURRENT, mở web discovery, đổi KYC: badge vẫn PROFILE_DISCOVERY. Mutant `badge` đỏ unit: nhận CURRENT thay PROFILE_DISCOVERY. | Cả mode analysis/discovery được unit kiểm; chip dùng input/session đã chụp. |
| 46 | #486 | ĐÃ SỬA | Lưu key xong rồi bấm lưu ô trống chỉ còn “Chưa nhập key”, không còn status thành công. Mutant `keyEmpty` đỏ: status count 1 thay 0. | Kiểm key quá dài/ASCII/rỗng qua hàm chung; `setOutcome` được xóa trước validation. |
| 47 | #489 | ĐÃ SỬA | Nguồn hiện dùng `codes.join(t('sep.slash'))`, `vi.ts` có khóa. Thay lại literal bằng plugin `slash`, ca `analysis with the Mock` vẫn xanh; probe token guard cũng không phát hiện slash. | Sửa đúng qua đọc nguồn. Chưa có test bắt hồi quy cú pháp này; không suy diễn từ e2e xanh vì chữ hiển thị giống hệt. Log `ui-mutation-slash.log`, probe unit về guard. |
| 48 | #490 | ĐÃ SỬA | Unit backup có seq 10/20 hiện v10/v20; mutant `seq` đỏ: nhận 2 thay 20. | Đã rà chip analysis/web, lịch sử AI/KYC, meta KYC, preview version kế tiếp và lịch hẹn: dùng seq, không dùng vị trí mảng. |
| 50 | #490 | ĐÃ SỬA | Unit + e2e Nạp lại giữ OpenCode/Credit/Kimi/HIGH; mutant `carry` đỏ 2 unit. | Probe thêm seed lỗi giữ DB/thế hệ/cấu hình; JSON đọc được nhưng sai model giữ warning; JSON hỏng được bỏ đúng §4.1. Nhập backup lấy cấu hình của backup đúng hợp đồng. |

Kiểm bổ sung tại seam UI của **DR5-35 / #485** (gói A kiểm chính): `isIssue` kiểm enum code và chuỗi `path/detail`; test report sai kiểu xanh. Mutant `issue` bỏ kiểm kiểu làm `rejectedReport ... leaves out an issue ...` đỏ 1 test. Không tính mục này vào 19 mục R kiểm chính hay bảng tổng của gói D lần thứ hai.

## Phát hiện

### CX2-C1 — Mức bằng chứng CURRENT lệch giữa hồ sơ và lịch hẹn

- **Mức:** Low. **Trục:** R, C, G. **Tình trạng:** CONFIRMED.
- **Vị trí (705ea7c):** `apps/desktop/src/routes/appointments/appointment-ai-view.ts:35`; `AppointmentAi.tsx:37`; seam thay đổi ở `routes/customers/ai-panel-view.ts:432` và `:440`.
- **Liên quan:** DR5-15; bỏ sót caller khi PR #505 thêm tính bằng chứng CURRENT theo dữ kiện hiện hành.
- **Mô tả:** Hồ sơ truyền facts vào `analysisContent`, lịch hẹn gọi cùng hàm mà không truyền facts nên rơi về mảng rỗng mặc định. Cùng một dòng CURRENT vì vậy có hai mức/ngày bằng chứng khác nhau.
- **Tái hiện:** `probe.test.ts`, ca `appointment and profile disagree after reconfirming the same value`. Dùng lệnh DB thật tạo KH, dữ kiện ngày 01/06/2024; phân tích discovery hợp lệ tại 11/10/2026 trích F2/F3; xác nhận lại Số con = 2 vào 11/10/2026. Không tạo version mới, dòng vẫn CURRENT. Panel: `MEDIUM`, 2 dữ kiện, mới nhất `2026-10-11`; lịch hẹn: `LOW`, 2 dữ kiện, mới nhất `2024-06-01`. Log `probe-unit.log` ghi cả hai object. `AppointmentAi` dùng trực tiếp các item này để render.
- **Hợp đồng:** §6.1 quy định CURRENT dùng ngày xác nhận hiện hành; §6.3 áp mức cho mọi phần tử có evidence; §9.2 lịch hẹn hiển thị kết quả ACCEPTED mới nhất. Trục C còn yêu cầu hai chỗ cùng tính một thứ phải cho cùng kết quả. Không cần đổi golden B01–B11.
- **Ảnh hưởng:** RE xác nhận lại cùng giá trị rồi xem lời gợi ý ở lịch hẹn thấy mức thấp/ngày cũ trong khi hồ sơ đã mới. Không đổi dữ kiện hay trạng thái dòng phân tích.
- **Đề xuất:** Query facts hiện hành ở `AppointmentAi`, truyền xuyên `appointmentAiView` tới `analysisContent`; thêm ca CURRENT xác nhận lại ở seam lịch hẹn. Khoảng 10–25 dòng sản phẩm và 30–50 dòng test.

### CX2-C2 — Ghi chú không giải thích nút bị khóa vì yêu cầu AI ở nơi khác

- **Mức:** Low. **Trục:** R, C, A. **Tình trạng:** CONFIRMED.
- **Vị trí (705ea7c):** `apps/desktop/src/routes/customers/KycExtraction.tsx:44`, `:71`, `:92`.
- **Liên quan:** DR5-40; PR #504 chỉ bổ sung câu cho panel.
- **Mô tả:** `runner.busy` khóa nút trên mọi ghi chú nhưng chỉ ghi chú tự chạy mới hiện BusyLine. Ghi chú đang idle không có câu hay title giải thích bận ở nơi khác.
- **Tái hiện:** `probe.spec.ts`, ca `idle extraction note ...`. IPC giả giữ Kiểm tra kết nối, mở hồ sơ có ghi chú đủ dài. Nút AI trích xuất disabled; panel có “Đang có một yêu cầu AI khác…”, listitem của ghi chú không có câu đó. Log in đúng nội dung ghi chú chỉ gồm ngày, nhãn, nút và nguyên văn note. Ca xanh vì probe khẳng định hành vi thiếu hiện tại.
- **Hợp đồng:** Tổng hợp 10/10 §8 câu 7 nói **panel / ghi chú**; `known.md` §2 ghi Owner đồng ý cả 8 câu, `PROJECT-STATE.md:63` ghi nút tắt cần lời giải thích. Issue #489 hẹp hơn, chỉ đưa panel vào mục tiêu/test; đây là phần yêu cầu Owner đã duyệt chưa được triển khai, không cần xin lại chữ G3.
- **Ảnh hưởng:** Khi đọc timeline, RE không biết đang chờ yêu cầu nào hay vì sao nút tắt; trợ năng tại ghi chú cũng không có lý do.
- **Đề xuất:** Hiện câu i18n AI_BUSY tại ghi chú khi runner bận mà job ghi chú không chạy/hủy; tránh lặp với BusyLine và lý do ghi chú quá ngắn. Khoảng 5–15 dòng sản phẩm + 15–25 dòng e2e.

### CX2-C3 — Đề xuất trích xuất từ thế hệ DB cũ vẫn xuất hiện ở DB vừa nhập

- **Mức:** Low. **Trục:** E, C, D. **Tình trạng:** CONFIRMED.
- **Vị trí (705ea7c):** `apps/desktop/src/data/ai-analysis.ts:238–246`; `routes/customers/use-ai-job.ts:23–33`; `KycExtraction.tsx:60`.
- **Liên quan:** Biến thể mở rộng của DR5-36, có từ trước vòng 1; Issue #484 đã sửa đúng đường lưu phân tích sau await nhưng đề xuất extraction không có chốt thế hệ.
- **Mô tả:** Job chỉ mang khóa `extraction:<noteId>`, không mang thế hệ; `extractFromNote` không biết DB. Sau nhập backup cùng ID, hồ sơ mới gắn lại promise cũ và nhận đề xuất đã chạy trước khi thay DB.
- **Tái hiện unit:** `probe.test.ts`, ca `extraction returns proposals after a same-ID DB replacement`: held adapter, nhập snapshot chính DB đó, trả facts. Thế hệ `0 → 1`, kết quả vẫn `{kind:'facts', childrenCount:2}`, không bị bỏ.
- **Tái hiện Edge:** `probe.spec.ts`, ca `old extraction proposals ...`: ghi note “KH đã kết hôn và hiện có 2 con.”; giữ IPC extraction; rời hồ sơ; gọi **phương thức nhập backup sản phẩm** với snapshot cùng ID; mở lại hồ sơ trước khi IPC trả; ghi dữ kiện hiện tại Số con = 3; trả proposal cũ = 2. Proposal hiện dưới note. Bấm Xác nhận mở hộp có “Đang có: 3”; bấm xác nhận dữ kiện lưu 2. Probe chỉ expose `AppData` bằng transform `main.tsx` trong bộ nhớ để gọi đúng thao tác DB; toàn bộ runner, job, UI, validator và lệnh xác nhận là code sản phẩm.
- **Ảnh hưởng / giới hạn:** Đề xuất cũ được gắn sang dữ liệu mới, trái yêu cầu bỏ kết quả extraction sau thay DB của plan §4 gói C. **Không tự ghi KYC, không tạo dòng `ai_analyses`, không phải lỗi CURRENT trích F5 của vòng 1**; cần RE bấm xác nhận, hộp vẫn hiện giá trị đang có. Vì vậy giữ mức Low. Kết quả Kiểm tra kết nối không lưu gì; khi đi qua UI thay DB thông thường màn đó đã unmount, chưa thấy lỗi dữ liệu ở đường này.
- **Đề xuất:** Gắn thế hệ vào job/snapshot extraction và bỏ kết quả trước khi đưa đề xuất vào UI nếu DB đã đổi; khi thay DB cũng không giữ đề xuất đã kết thúc trên thế hệ cũ. Thêm test quay lại note cùng ID khi pending. Khoảng 15–35 dòng sản phẩm + 40–70 dòng test.

### CX2-C4 — Bỏ đề xuất cuối làm mất focus về body

- **Mức:** Low. **Trục:** E, A. **Tình trạng:** CONFIRMED.
- **Vị trí (705ea7c):** `apps/desktop/src/routes/customers/KycExtraction.tsx:51`, `:119`; `extraction-view.ts:72`.
- **Liên quan:** Cùng vùng DR5-43, có từ trước vòng 1; hai trigger “đóng web” và “đóng 0 đề xuất” của Issue #489 đã được sửa.
- **Mô tả:** Bỏ gọi `handle(index)` làm dòng chứa nút đang focus biến mất; khi đề xuất cuối đã xử lý, view thành `none` và không chuyển focus tới nút còn tồn tại.
- **Tái hiện:** `probe.spec.ts`, ca `last dropped proposal ...`. Dùng Mock với note đủ dài, 2 đề xuất; focus từng nút Bỏ, nhấn Enter. Sau Bỏ cuối, list biến mất và `document.activeElement.tagName === 'BODY'`. Log `LAST DROP activeElement=BODY`.
- **Ảnh hưởng:** RE dùng bàn phím mất điểm thao tác sau xử lý đề xuất; đọc tiếp/chạy trích xuất lại phải tìm nút. Không mất dữ kiện.
- **Đề xuất:** Sau khi bỏ, đưa focus tới hành động của đề xuất tiếp theo; nếu hết, về AI trích xuất của note. Test Enter ở proposal cuối. Khoảng 10–25 dòng sản phẩm + 15–25 dòng e2e.

### CX2-C5 — Lưu key thất bại làm mất phản hồi status ban đầu

- **Mức:** Nit. **Trục:** R, E, A. **Tình trạng:** CONFIRMED.
- **Vị trí (705ea7c):** `apps/desktop/src/routes/SettingsAi.tsx:156–160`, `:176`, `:183–185`.
- **Liên quan:** Hồi quy do PR #502 sửa DR5-37.
- **Mô tả:** `acted.current` được bật trước `setKey` và không được phục hồi khi lệnh thất bại. Nếu status ban đầu chưa về, cả phản hồi hợp lệ đó bị bỏ dù thao tác chưa đổi key và `stored` vẫn undefined.
- **Tái hiện:** IPC giả: giữ `ai_key_status`, trả `true` khi được nhả; `ai_key_set` reject `AI_KEYRING`. Mở Settings AI, nhập key giả, lưu gặp lỗi, rồi nhả status. Sau thêm 100 ms, không có “Đã có key” và không có nút Xóa key. `key-failure-probe.log` xác nhận. Chạy cùng probe trên mutant chỉ đổi `fresh` về `current` (bỏ chốt `acted`) làm assertion của probe đỏ: status được nhận lại; log `key-failure-keyRace.log`. Không đọc/ghi Credential Manager thật.
- **Ảnh hưởng:** Khi status chậm trùng lỗi lưu, RE không thấy trạng thái key đang tồn tại hoặc nút xóa cho đến khi rời/mở lại mục AI. Key không bị mất và vẫn được che; vì trigger hẹp và remount khắc phục, giữ mức Nit.
- **Đề xuất:** Sau thao tác thất bại, đọc lại status hoặc quản lý phiên bản thao tác để vẫn nhận status không bị thay đổi; giữ bảo vệ ca lưu thành công trả status cũ. Khoảng 5–15 dòng sản phẩm + 20–35 dòng e2e.

## Các trục đã đi qua

| Trục | Cách xét và kết quả |
|---|---|
| R | 19 dòng trên; 14 mutant unit (gồm DR5-35 seam UI) đều bị assertion bắt; 10 mutant UI đều bị assertion bắt. Mutant slash chạy xanh, ghi rõ giới hạn. |
| E | Cổng trống/không version, ghi chú 19/20 ký tự và surrogate pair, đề xuất 0/1/nhiều, trùng/cũ/mâu thuẫn, key rỗng/ASCII/quá dài, Hủy giữ busy, hai yêu cầu chồng, rời/quay lại màn, cùng-ID backup và seed/backup lỗi. Đọc NFC/space normalization ở extraction-view; không ghi nhận lỗi mới về Unicode/ngày ở lớp desktop. Có CX2-C3/C4/C5. |
| G | Đọc đường `runAnalysis/runExtraction/checkWebAnswer` tới record/confirm; chạy ca gate chặn không gọi AI, sai hai lần REJECTED, Hủy không lưu, own-message không tính attempt, trích xuất chỉ thành đề xuất. Có CX2-C1 về mức deterministic ở caller lịch hẹn. **Đã xét, không thấy guardrail desktop mới lọt/chặn nhầm** ngoài các mục KNOWN; không tuyên bố đã lặp toàn bộ fuzz V1–V7 của gói A. |
| C | Đối chiếu spec/G5/golden, mockup 1/2/3/4, W-1 và quyết định Owner 10/10. Hai caller cùng tính bằng chứng, khóa bận và vòng đời kết quả là CX2-C1/C2/C3. |
| D | SQL thật trong bộ nhớ: same-ID restore, phiên bản KYC không đổi khi xác nhận cùng giá trị, đổi thật thành STALE, replace thất bại không tăng thế hệ, Nạp lại giữ cấu hình, nhập backup dùng cấu hình backup. **Đã xét, không thấy mất/hỏng dữ liệu mới** ở đường lưu analysis/Nạp lại; CX2-C3 về gắn proposal sang thế hệ khác vẫn cần xác nhận tay. S-2 là KNOWN. |
| S | Đọc adapter invoke chỉ có status/set/delete, save settings chỉ lấy 4 trường; messages chụp tại click; URL ChatGPT hằng, không dữ liệu trên URL, `noopener`; output/quote/server message/report là React text, không innerHTML; CSP chỉ self/ipc, capabilities không thêm HTTP. Password và lỗi HTTP chạy IPC giả. **Đã xét, không thấy lỗi an toàn mới trong gói C**. Không kiểm key Local/native HTTP của gói B, không gọi AI thật, không mở chatgpt.com. |
| P | Probe `analysisContent` CURRENT với output discovery cố định, đặt facts được trích cuối lịch sử để phải tìm qua mảng: 5 batch × 100 lần, sau 20 lần warm-up. Median mỗi view: **10 facts 0,0566 ms; 1.000 facts 0,2597 ms; 10.000 facts 2,9046 ms**; batch chậm nhất tương ứng 0,0769 / 0,3767 / 3,3121 ms. Đây là số đo hàm thuần Node/Vitest, không phải thời gian React render hay khởi động app. **Đã xét, không thấy vấn đề hiệu năng mới có đủ bằng chứng để báo**. |
| B | `node tools/codemap.mjs --check` báo export maps up to date; tsc desktop `--noUnusedLocals --noUnusedParameters --noEmit --incremental false` exit 0; rà export/caller, JSX thông báo/focus và helper chung qua rg. **Đã xét, không thấy code chết/lặp mới gây lỗi**. Lặp BusyLine/status, constants/provider và phạm vi export đã ở KNOWN, không báo lại. |
| T | 266 unit gốc và 63 e2e gốc xanh; probe thêm 5 unit/4 e2e. Đã thực sự gỡ sửa trong bộ nhớ và thấy assertion đỏ, không chỉ đọc test. Ca mới C1/C2/C3/C4/C5 đều lọt bộ test gốc. Riêng R47 thiếu chốt tự động về literal slash, chỉ đọc nguồn mới xác nhận được; ca UI chữ giống nhau nên không thể chứng minh i18n. Các lỗ hổng test DR5-34 đã giao #493 giữ KNOWN. |
| A | Edge thật với focus/Enter/Escape, các nút web/0 proposal, role/status/aria-live/label của input, chuỗi i18n và mã F. C2/C4/C5 là phần còn thiếu. **Đã xét, không thấy lỗi i18n mới** ngoài phần cú pháp/markup đã KNOWN; không suy diễn role=status thành bằng chứng đã nghe screen reader đọc. |

## KNOWN và giới hạn

Giữ nguyên phân loại KNOWN của `common/known.md`: G5/prompt ví dụ/false positive (#491), chịu đầu vào bất thường (#492), eval (#488), test (#493), bloat (#494). Không thử AI thật để đánh giá chất lượng model. Không nâng mức các mục này từ bằng chứng desktop hiện có.

Các mục trong sổ review liên quan vẫn KNOWN: lỗi hoàn tất khi đang ở màn khác không được giữ trong AiJobs; `start` ghi đè khóa khi caller vi phạm busy; pending writes/replace chồng S-2; cảnh báo cấu hình khó xóa và kết quả kết nối cũ còn hiện khi đổi model; preview ConfirmFactDialog báo refused muộn; markup lặp và dấu `:` trong proposal. Không có bằng chứng hậu quả nặng hơn để báo lại.

Không chạy `pnpm verify` toàn repo, `pnpm eval:ai`, Rust hoặc gọi IPC thật: đây là review gói C, mọi build/cache/output phải ngoài repo. Kiểm TS/codemap và bộ unit/e2e liên quan được chạy trực tiếp với config ngoài repo. Test e2e adapter exe dùng `asExe` giả; test web ghi lại `window.open` và clipboard nên không mở trang thật. Các kết quả không thay thế phép kiểm native của gói B hay xuyên gói của D.

## Phạm vi đã đọc

Đọc các nguồn bắt buộc trước kiểm R: `common/plan.md` §1–§6, `baseline.md`, `known.md`; CLAUDE.md, CONTEXT.md; spec Phase 5, G5 prompts, golden AI eval; ADR `docs/decisions/0009-ai-copilot-provider-va-guardrail.md` và D-1/G5/W-1; tổng hợp 10/10 §3–§5/§7/§8; body Issue #482–#490 và #500 qua GitHub. Đọc package CLAUDE của desktop/UI và rule tests/i18n. Không đọc báo cáo vòng 2 khác.

Đọc diff sửa `0df3606..705ea7c` trong các file dưới, rồi đối chiếu phần Phase 5 của `3e84ce8..705ea7c` bằng diff/source hiện tại. Các module mới Phase 5 được đọc toàn bộ; file có phần Phase 1–4 được rà phần AI và ngữ cảnh caller.

| Nhóm | File / dòng tại SHA ghim |
|---|---|
| Data desktop | `ai-analysis.ts:1–315`, `ai-jobs.ts:1–82`, `ai-tauri.ts:1–75`, `app-data.ts:1–405` trong `apps/desktop/src/data/` |
| Panel / extraction / web / report | `KycIntelligence.tsx:1–547`, `KycExtraction.tsx:1–154`, `KycWebSession.tsx:1–177`, `KycHistory.tsx:1–154`, `use-ai-job.ts:1–53`, `ai-panel-view.ts:1–599`, `extraction-view.ts:1–83` trong `apps/desktop/src/routes/customers/` |
| KYC caller | `kyc-view.ts:1–254`, `CustomerProfile.tsx:1–270`, `CustomerKyc.tsx:1–286`, `KycDialogs.tsx:1–498`: phần AI/mã F/seq và luồng xác nhận |
| Lịch hẹn AI | `apps/desktop/src/routes/appointments/AppointmentAi.tsx:1–82`, `appointment-ai-view.ts:1–47`; điểm tích hợp AI ở AppointmentsScreen |
| Settings / route / error | `SettingsAi.tsx:1–366`, `Settings.tsx:1–166`, `settings-ai-view.ts:1–87`, `ai-error-view.ts:1–66`, `apps/desktop/src/shell/routes.ts:1–71`; điểm key Settings route ở Screen |
| UI / i18n | `packages/ui/src/components/TextField.tsx:1–89`; `apps/desktop/src/i18n/vi.ts` khóa `sep`, AI panel, web, error, Settings AI, extraction; token-guard phần separator |
| Security / domain đọc bổ sung | `apps/desktop/src-tauri/tauri.conf.json`, `capabilities/default.json`; `packages/domain/src/evidence-level.ts`; seam DB KYC cho reconfirm/version |
| Test | Hunk sửa và ca liên quan của `ai-analysis.test.ts`, `ai-jobs.test.ts`, `ai-tauri.test.ts`, `app-data.test.ts`, các `*-view.test.ts` ở customers, appointments, Settings/error và shell/routes; e2e customer-ai, customer-ai-web, settings-ai, appointments AI, dialog-keyboard; support IPC/web giả |
| Mockup | `docs/design/mockups/ai.html` các khối Settings 1, panel 2 (bao gồm 2l), F/extraction 3, web 4; đối chiếu nội dung với spec §9 |

## Bảng đếm mức × trục

Mỗi phát hiện có thể thuộc nhiều trục; cột “ID riêng” không đếm lặp. Không tính KNOWN hoặc dòng bổ sung DR5-35.

| Mức | R | E | G | C | D | S | P | B | T | A | ID riêng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 2 | 2 | 1 | 3 | 1 | 0 | 0 | 0 | 0 | 2 | 4 |
| Nit | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |

Tất cả 5 phát hiện **CONFIRMED**; không có PLAUSIBLE mới.

## Phụ lục — probe, log và cách chạy

Mọi đường dẫn dưới tính từ `C:\workspace\deep-review-5-r2\codex\C\`; không có test/patch tạm trong repo.

- `vitest.config.mjs`: chọn 12 file test gốc, cache ngoài repo, plugin mutant. Baseline `unit-baseline.log`: **266/266**. Chạy từ worktree: `node node_modules/vitest/vitest.mjs run --config C:/workspace/deep-review-5-r2/codex/C/vitest.config.mjs` (khi probe đã tồn tại sẽ chọn thêm probe; con số 266 là baseline trước bổ sung).
- `probe.test.ts`, `probe-unit.log`: **5/5**, gồm C1, C3, biến thể R50, giới hạn guard R47 và số đo P. Chạy cùng lệnh trên nhưng thêm `C:/workspace/deep-review-5-r2/codex/C/probe.test.ts --reporter verbose`.
- `mutation-<name>.log`: 14 phép `generation`, `counter`, `carry`, `jobs`, `http`, `link`, `badge`, `busy`, `help`, `seq`, `remap`, `refreshed`, `status`, `issue`; đặt env `MUTANT=<name>` cho config Vitest. Tất cả exit 1 do assertion của test gốc; không test nào đỏ do thiếu transform.
- `serve.mjs`, `pw.config.mjs`, `e2e-baseline.log`: build nguồn gốc và seed ra `dist`, preview localhost:4199. Chạy Playwright với config này: **63/63**, 2,0 phút. Server đã dừng.
- `serve-probe.mjs`, `pw.probe.config.mjs`, `probe.spec.ts`: build ra `dist-probe` với hook `window.__reviewData` trong bộ nhớ; HTTP localhost:4200. `probe-e2e.log` là lần đầu 4/4; lần xác nhận cuối `key-failure-probe.log` chạy lại **4/4** với mã lỗi key giả `AI_KEYRING` và thêm 100 ms sau nhả status. Server đã dừng.
- `ui-mutations.mjs`, `pw.mutation.config.mjs`, `ui-build-<name>.log`, `ui-mutation-<name>.log`: 10 mutant `password`, `keyEmpty`, `keyRace`, `focus`, `webFocus`, `emptyFocus`, `live`, `webDisable`, `badgeAppointment`, `runningModel`; mỗi mutant làm một ca e2e gốc đỏ tại assertion mục tiêu. Driver tự dừng server sau mỗi ca.
- `ui-slash.mjs`, `ui-mutation-slash.log`: restore literal slash trong bộ nhớ; **1/1 xanh**, phản ánh đúng giới hạn test R47.
- `key-failure-variant.mjs`, `key-failure-keyRace.log`: kiểm hồi quy C5 với IPC giả và bản chỉ bỏ chốt acted; **1 ca probe đỏ** vì bug không còn tái hiện, không phải e2e gốc đỏ. Phân biệt với log `ui-mutation-keyRace.log` (bỏ chốt làm bug cũ quay lại).

Kiểm cuối: HEAD vẫn `705ea7c0e76dcdcf8c89f949fc2e3b3b6e4fff2c`; `git diff --exit-code` exit 0; `git status --short` chỉ còn ba mục có sẵn:

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

Không sửa file sản phẩm, không commit, không tạo Issue, không đề xuất merge. Toàn bộ patch thử nằm ở plugin transform trong bộ nhớ và hết hiệu lực khi process dừng; các nguồn probe/log được giữ để Owner kiểm lại.