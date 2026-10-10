# Codex — review lại Phase 5, vòng 2, GÓI D

## Bảng R đủ 35 DR5

Bảng dưới gộp **chỉ báo cáo Codex A.md, B.md, C.md** với phép kiểm DR5-57 của phiên D. Dùng kết luận C cho DR5-15/48; chứng cứ phần DB của A bổ sung, không đếm hai lần. T-202 đã sửa nhưng không có DR5 nên không nằm trong 35 dòng. DR5-05 ở đây chỉ là phần Rust.

| DR5 | Issue / PR | Kết luận | Bằng chứng: tái hiện cũ; test đỏ khi gỡ sửa | Ghi chú / nguồn |
|---|---|---|---|---|
| 05 (Rust) | #487 | **HỒI QUY** | `finish_reason` length/null/content_filter được đưa về `finishReason` đúng. Bỏ field làm `a_reply_gives_its_content_token_counts_and_finish_reason` và `a_reply_without_usage_has_unknown_tokens_and_a_cut_one_says_length` đỏ. Field mới không qua guard key: trả key trong finish_reason vẫn thành công. | **CX2-B2** là hồi quy do field mới ở #503. Phần parser/runner xử lý trả lời bị cắt thuộc **KNOWN #492**, không báo lại. Nguồn: B.md. |
| 13 | #485 / #499 | **ĐÃ SỬA** | `{ summary: 'Tóm tắt' }`, output sai chế độ, evidence F99 không thuộc input đều bị `AI_ANALYSIS_INVALID`. Dòng hợp lệ Mock/OpenCode/ChatGPT web, ACCEPTED/REJECTED xuất–nhập giữ nguyên. Bỏ `analysisContentFits` → test `refuses an analysis whose provider, attempts or outcome do not fit together` đỏ; chỉ bỏ kiểm evidence cũng đỏ riêng (`R13.log`, `R13-evidence.log`). | `ai-analyses.ts:137–138,232–244`; import dùng cùng hàm. Probe độc lập 40 biến thể có 0 lệch lệnh/import. Nguồn: A.md. |
| 14 | #485 / #499 | **ĐÃ SỬA** | Backup có `raw_output = a\0` + 30.000 chữ, `model = glm\0-5.3`, note lịch hẹn có NUL → `BACKUP_INVALID`. Bỏ chốt NUL của `valueOf` → ba test mới về raw/model/meeting note đỏ (`R14.log`). Probe mở rộng: **95/95 cột text, 12/12 bảng dữ liệu** đều từ chối NUL, kể cả cột nullable. | Chốt đặt trước bind sql.js, không chỉ ở AI. Lệnh AI thay NUL trong rejected raw bằng `�`, roundtrip vẫn đúng. Khe hở lệnh lịch hẹn cũ ghi riêng CX2-A2; không phủ định việc sửa đường nhập. Nguồn: A.md. |
| 15 | #490 | SỬA MỘT PHẦN | Test `fact codes F{seq} ... leads a code replaced ...` và `analysisContent ... weighs ... CURRENT ...` xanh. Mutant `remap` làm 2 test đỏ, `refreshed` làm 1 test đỏ. E2E sửa ngày sinh cùng năm giữ CURRENT, F1 dẫn tới F6. | Panel đúng, STALE giữ ngày chụp, đổi giá trị thật không ánh xạ. Khối lịch hẹn vẫn dùng ngày cũ: **CX2-C1**. Nguồn: C.md. |
| 16 | #485 / #499 | **ĐÃ SỬA** | Prompt khác mode, suffix web sai provider, model 101 ký tự, REJECTED attempts=1 và ACCEPTED có lỗi cuối đều bị từ chối; model 100, attempts 1/2 của ACCEPTED, prompt version dương và token null hợp lệ vẫn nhận. Bỏ lần lượt mode, suffix web, attempts, max model, last errors → cùng test ràng cột đỏ ở **cả 5 lần** (`R16-*.log`). | Hàm labels/content dùng chung; ma trận 40 ca đối chiếu cả lệnh và backup. Validator tùy ý nhưng JSON hợp lệ là hợp đồng hiện tại; không tự siết toàn bộ shape của báo cáo. Nguồn: A.md. |
| 20 | #487 | **ĐÃ SỬA** | Gzip giải nén 64 MiB hiện chỉ đọc 2 097 153 byte; HTTP 429 gzip lớn vẫn giữ 429. Trả reader về `with_config().limit(MAX_BODY).read_to_vec()`: `a_gzip_reply_is_unpacked_and_read_to_2_mb_however_small_it_is_on_the_wire` đỏ, đọc 16 777 257 thay vì 2 097 153 byte. Thử thêm gzip chunked không Content-Length và body lỗi lớn. | `R20-R21-old-wire-limit.log`; `r2-probes.log`. Bộ nhớ có số đo ở trục P. Nguồn: B.md. |
| 21 | #487 | **ĐÃ SỬA** | Body đúng 2 097 152 byte được nhận, thêm 1 byte bị từ chối; đúng cho body thường, gzip và gzip chunked. Reader cũ làm `a_body_is_read_to_2_mb_and_one_byte_more_shows_it_is_longer` đỏ ngay ở đúng giới hạn. | `R20-R21-old-wire-limit.log`; `r2-probes.log`. Nguồn: B.md. |
| 22 | #487 | **ĐÃ SỬA** | Server local không trả bắt tay TLS → NETWORK; server không trả sau kết nối → TIMEOUT. Trả Resolve/Connect về TIMEOUT: `transport_errors_map_to_timeout_or_network` và `a_server_that_never_answers_the_tls_handshake_is_a_network_error` đỏ. Config production giữ resolve/connect 10 s và global 120 s; probe dùng thời hạn ngắn. | `R22-old-timeout-code.log`. Resolve kiểm bằng loại lỗi giả + config; chưa dựng DNS thật bị treo. Nguồn: B.md. |
| 24 | #487 | **SỬA MỘT PHẦN** | Bỏ `http_status_as_error(false)`, bỏ giới hạn đọc, đổi URL Go hoặc tên service: test mới đều đỏ. Tuy nhiên thay cả `post()` bằng lỗi NETWORK vẫn **35/35 xanh**, đúng kiểu đột biến vòng 1. Biến thể không sinh cảnh báo clippy cũng sống. | **CX2-B4**. `R24-disable-post.log` và `warning-clean-disable-post-*.log`. Nguồn: B.md. |
| 25 | #487 | **ĐÃ SỬA** | Dùng chính `key_entry()` trong bản sao, chỉ thay service/user bằng tên riêng của probe: ghi/đọc/xóa key giả, no-entry, đọc key Enterprise cũ rồi ghi lại Local đều đúng. Đổi hằng Local → Enterprise làm `the_key_is_stored_local_to_this_machine` đỏ. | `r2-extra.log`. Code hiện đúng; bỏ dây truyền modifiers lại không làm test PR đỏ: khoảng trống **CX2-B4**, không kết luận implementation hiện lưu Enterprise. Nguồn: B.md. |
| 26 | #487 | **ĐÃ SỬA** | NUL, LF/CR bên trong key, DEL, zero-width, BOM, non-ASCII, khoảng trắng nội bộ bị chặn; trim ngoài được phép, 512 ký tự được nhận; reasoning chỉ low/medium/high. Trả clean_key về luật cũ làm `a_key_that_is_empty_over_512_characters_or_not_printable_ascii_is_bad_request_and_not_stored` và `no_error_carries_the_key_or_the_session` đỏ; bỏ kiểm reasoning làm `wrong_arguments_are_bad_request_and_reach_neither_the_key_nor_the_network` đỏ. | `R26-old-key-validation.log`, `R26-old-reasoning.log`; các biên request/Unicode cũng được thử. Nguồn: B.md. |
| 27 | #487 | **SỬA MỘT PHẦN** | Raw-body fallback đã bỏ; key/session nguyên văn được che trước khi cắt 200 ký tự; body lỗi lớn được đọc hữu hạn và giữ mã HTTP. Ba đột biến hồi phục lỗi cũ đều làm test đỏ. Biến thể body bị cắt, gzip hỏng hoặc timeout sau header vẫn mất mã HTTP; key URL-encode trong message không được che. | **CX2-B1**, **CX2-B3**. `R27-raw-fallback.log`, `R27-no-session-mask.log`, `R27-reject-large-before-status.log`; `r2-probes.log`. Nguồn: B.md. |
| 28 | #487 | **SỬA MỘT PHẦN** | Content chứa toàn bộ key nguyên văn → BAD_RESPONSE. Bỏ guard làm `a_reply_whose_content_holds_the_key_is_bad_response` đỏ. Nhưng key trong JSON con dùng Unicode escape qua guard, được validator giải mã và lưu/backup; field mới finishReason cũng lọt key nguyên văn. | **CX2-B2**, **CX2-B3**. `R28-no-content-guard.log`; `key-boundary.log`. Nguồn: B.md. |
| 29 | #487 | **ĐÃ SỬA** | Thiếu usage, thiếu một count, count âm/sai kiểu → count không biết là null; không biến thành 0. Trả mặc định về 0 làm `a_reply_without_usage_has_unknown_tokens_and_a_cut_one_says_length` đỏ. Kiểm thêm count một phần và hợp đồng camelCase/null ở TypeScript. | `R29-zero-usage.log`; 20 test hợp đồng Tauri xanh. Nguồn: B.md. |
| 30 | #486 | ĐÃ SỬA | Unit giữ `httpStatus/serverMessage`; Edge kiểm lỗi ở panel, trích xuất và Settings: 401/429, AI_HTTP 500/502. Mutant `http` làm 2 test thông báo chung đỏ. | HTTP không có message vẫn có mã; lỗi không có HTTP giữ câu riêng; GENERAL không nhận thân thô. Nguồn: C.md. |
| 31 | #486 | ĐÃ SỬA | `ai-jobs.test.ts ... keeps the settings taken at the click ...` xanh; mutant `jobs` đỏ 1 test. E2E `the run says the model ...` xanh; mutant `runningModel` đỏ tại dòng model. | Đổi từ DeepSeek sang Kimi rồi Mock trong lúc chạy vẫn hiện DeepSeek và IPC vẫn gửi model đã chụp; Hủy giữ ảnh chụp tới khi runner hết bận. Nguồn: C.md. |
| 32 | #486 | ĐÃ SỬA | Ô key có `type=password`, `spellcheck=false`; lưu thành công xóa nội dung. Mutant `password` làm e2e `the key is checked ...` đỏ: nhận `text` thay `password`. | Lưu lỗi giữ giá trị trong ô mật khẩu để thử lại; `TextField` không áp `type` cho textarea. Không dùng key thật. Nguồn: C.md. |
| 33 | #489 | ĐÃ SỬA | E2E Mock và ChatGPT web có câu hoàn tất `role=status`; trích xuất có câu báo đề xuất. Mutant `status` đỏ 1 unit; mutant `live` đỏ tại status sau lưu web. | ACCEPTED/REJECTED có câu khác nhau; Hủy/discarded không báo đã lưu; live container tồn tại trước khi được điền. Kiểm DOM/keyboard, không chạy NVDA. Nguồn: C.md. |
| 35 | #485 / #499 | **ĐÃ SỬA** | Lưu REJECTED với issue có `path: { toString: null }`, detail kiểu số, code sai: `rejectedReport` bỏ issue hỏng, giữ issue V1 hợp lệ, không ném lỗi. Đưa `isIssue` về chỉ kiểm có thuộc tính → test mới DR5-35 đỏ với TypeError (`R35.log`). | Đọc UI giới hạn ở seam báo cáo validator cần cho A. Không render raw output. Nguồn: A.md. |
| 36 | #484 | ĐÃ SỬA | Hai ca nhập backup cùng ID và CURRENT trích F5 vào backup chỉ F1–F4 đều trả `discarded`, không ghi dòng. Mutant `generation` đỏ cả 2; mutant `counter` đỏ thêm test thế hệ DB. | Nạp lại cũng bỏ; đổi KYC cùng DB vẫn lưu STALE; backup lỗi/seed lỗi không tăng thế hệ; Hủy không lưu. Kết quả **đề xuất trích xuất** là ca mở rộng riêng ở CX2-C3, không phải đường ghi `ai_analyses` mà Issue #484 đã sửa. Nguồn: C.md. |
| 37 | #486 | HỒI QUY | Ca cũ `a key status read late never overwrites the key just saved` xanh. Mutant `keyRace` đỏ ca này. | Bảo vệ trạng thái sau lưu thành công đúng. Sau **lưu thất bại**, kết quả status ban đầu vẫn bị bỏ vĩnh viễn trong lần mở màn đó: **CX2-C5**. Bỏ riêng `!acted.current` làm probe lỗi mới hết tái hiện. Nguồn: C.md. |
| 38 | #489 | ĐÃ SỬA | E2E bấm mã F bằng Enter chuyển focus tới dòng dữ kiện. Mutant `focus` đỏ `toBeFocused`. | Đã kiểm cả mã còn hiệu lực và mã ánh xạ sau xác nhận lại; mã không còn hiệu lực có thông báo. Nguồn: C.md. |
| 39 | #483 | ĐÃ SỬA | E2E `the app's own message ... AI trích xuất waits ...` xanh: nút trích xuất của KH tắt trong phiên web, bật sau kết thúc. Mutant `webDisable` đỏ: nút vẫn enabled. | KH khác không bị khóa bởi phiên web này; rời hồ sơ làm mất phiên web. Nguồn: C.md. |
| 40 | #489 | SỬA MỘT PHẦN | Panel KH khác có câu bận, hết bận thì câu biến mất. Mutant `busy` đỏ 1 unit. Edge giữ Kiểm tra kết nối rồi mở KH: panel có câu, ghi chú chỉ có nút tắt. | Issue #489/test chấp nhận chỉ nói panel, nhưng quyết định Owner §8 câu 7 đã chốt cả **panel / ghi chú**: **CX2-C2**. Nguồn: C.md. |
| 41 | #489 | ĐÃ SỬA | Panel trống Mock/OpenCode có count/provider/gói/model và câu dữ liệu gửi đi. Mutant `help` đỏ 2 unit về số dữ kiện. E2E kiểm cả câu Mock và OpenCode. | Count gồm active/conflict, bỏ superseded; không đọc model giả cho Mock; help mất khi có bản phân tích. Nguồn: C.md. |
| 42 | #489 | ĐÃ SỬA | E2E lịch hẹn có badge ChatGPT web và bản ACCEPTED mới nhất; REJECTED mới hơn không thay kết quả hiển thị. Mutant `badgeAppointment` đỏ ca AI ở lịch hẹn. | Mock vẫn có badge, OpenCode giữ tên model; không thêm nút gọi AI ở lịch hẹn. Nguồn: C.md. |
| 43 | #489 | ĐÃ SỬA | Đóng phiên web sau lưu/Hủy trả focus về nút mở; Đóng dòng “0 đề xuất” trả về AI trích xuất. Mutant `webFocus` và `emptyFocus` mỗi phép làm 1 e2e đỏ. | Cơ chế fallback heading khi nút mở bị tắt đã đọc. Biến thể **Bỏ đề xuất cuối** chưa được xử lý: CX2-C4; khác hai trigger đóng được nêu trong Issue. Nguồn: C.md. |
| 44 | #486 | ĐÃ SỬA | AI_NO_KEY ở panel/trích xuất có link mở `#/settings/ai`; route Settings nhận mục AI. Mutant `link` đỏ `errorParts ... links ...`. | Các lỗi khác không bị cắt thành link nhầm; lỗi vẫn dùng câu chung §5.3. Nguồn: C.md. |
| 45 | #489 | ĐÃ SỬA | E2E bắt đầu từ CURRENT, mở web discovery, đổi KYC: badge vẫn PROFILE_DISCOVERY. Mutant `badge` đỏ unit: nhận CURRENT thay PROFILE_DISCOVERY. | Cả mode analysis/discovery được unit kiểm; chip dùng input/session đã chụp. Nguồn: C.md. |
| 46 | #486 | ĐÃ SỬA | Lưu key xong rồi bấm lưu ô trống chỉ còn “Chưa nhập key”, không còn status thành công. Mutant `keyEmpty` đỏ: status count 1 thay 0. | Kiểm key quá dài/ASCII/rỗng qua hàm chung; `setOutcome` được xóa trước validation. Nguồn: C.md. |
| 47 | #489 | ĐÃ SỬA | Nguồn hiện dùng `codes.join(t('sep.slash'))`, `vi.ts` có khóa. Thay lại literal bằng plugin `slash`, ca `analysis with the Mock` vẫn xanh; probe token guard cũng không phát hiện slash. | Sửa đúng qua đọc nguồn. Chưa có test bắt hồi quy cú pháp này; không suy diễn từ e2e xanh vì chữ hiển thị giống hệt. Log `ui-mutation-slash.log`, probe unit về guard. Nguồn: C.md. |
| 48 | #490 | ĐÃ SỬA | Unit backup có seq 10/20 hiện v10/v20; mutant `seq` đỏ: nhận 2 thay 20. | Đã rà chip analysis/web, lịch sử AI/KYC, meta KYC, preview version kế tiếp và lịch hẹn: dùng seq, không dùng vị trí mảng. Nguồn: C.md. |
| 49(a) | #483 / #497 | **SỬA MỘT PHẦN** | Dán nguyên `web@1` trên seed=1, ngày 15/09/2026: **767/767** hồ sơ được phép AI đều `OWN_MESSAGE`, không lưu. Bỏ guard → 7 ca mới đỏ (`R49.log`). CRLF, khoảng trắng quanh dòng, dán một phần còn khung đều bị chặn. Nhưng đổi khoảng trắng **bên trong cả hai khung**, hoặc NFD, bỏ khoảng trắng cạnh `===`, thêm `> ` trước cả hai khung → vẫn có ACCEPTED toàn `…`. Seed thật: **39/767** biến thể khoảng trắng được nhận; một dòng lưu thật thành CURRENT và xuất–nhập thành công. | **CX2-A1.** Tiêu chí dòng khung nguyên văn trong spec §3.1(3) đã đạt. “Một phần” nói về biến thể gần được plan §4 yêu cầu xét; không coi đây là vi phạm tiêu chí literal của Issue. Nguồn: A.md. |
| 50 | #490 | ĐÃ SỬA | Unit + e2e Nạp lại giữ OpenCode/Credit/Kimi/HIGH; mutant `carry` đỏ 2 unit. | Probe thêm seed lỗi giữ DB/thế hệ/cấu hình; JSON đọc được nhưng sai model giữ warning; JSON hỏng được bỏ đúng §4.1. Nhập backup lấy cấu hình của backup đúng hợp đồng. Nguồn: C.md. |
| 57 | #482 / #496 | **ĐÃ SỬA** | Baseline `tools/pr-core.test.mjs`: 59/59. Bỏ hai G5 khỏi CODE_DOCS trong bộ nhớ: 2 đỏ/57 xanh. Bỏ prompt khỏi block PR hoặc golden khỏi block push: mỗi phép 1 đỏ/58 xanh, assertion đồng bộ đúng. Probe riêng kiểm từng G5, trộn docs, đường đổi tên và mergeBlockers: không CI bị chặn, CI xanh hết chặn. | Hai bộ lọc CI và CODE_DOCS đều có 7 file; không chỉ sửa danh sách ở lệnh merge. D/R57-*.log; D/probe-unit.log. |

**Đếm: 27 ĐÃ SỬA, 6 SỬA MỘT PHẦN, 2 HỒI QUY, 0 CHƯA SỬA.** Sáu mục một phần: 15, 24, 27, 28, 40, 49(a). Hai hồi quy: 05 phần Rust, 37. Đây là phân loại theo phạm vi review cả biến thể gần; không nói mọi mục một phần đều thất bại tiêu chí nguyên văn của Issue. DR49(a) literal đạt; R36/R43 đạt đường sửa của Issue, còn biến thể extraction/focus ghi riêng.

## Kết luận G7: CHƯA SẴN SÀNG

Đợt sửa Owner đã chọn trước G7 chưa khép kín: caller lịch hẹn còn tính bằng chứng CURRENT theo ngày cũ (CX2-C1), ghi chú thiếu lý do khóa bận đã được Owner chốt (CX2-C2), test vẫn không bảo vệ `post()` production (CX2-B4), và các biến thể lỗi HTTP/key còn lọt (CX2-B1/B2/B3). Field `finishReason` mới gây thêm đường key qua IPC; chốt status key gây hồi quy nhỏ khi lưu thất bại. Test xanh không chứng minh tám mục R còn lại đã hoàn tất.

Không có Critical/High/Medium mới trong các báo cáo Codex: **10 Low + 1 Nit, tất cả CONFIRMED**. Mức Low của key vẫn giữ điều kiện kích hoạt bất thường mà Owner dùng cho DR5-28: gateway có TLS hợp lệ phản chiếu key; không phải model thông thường biết key. Kết luận CHƯA SẴN SÀNG là đánh giá mức hoàn thành đợt sửa và ranh giới hợp đồng, không tự nâng mức những ca này. Quyết định chấp nhận phần còn lại thuộc Owner ở G7.

Các mục đã giao Phase 6 vẫn **KNOWN** và không dùng làm lý do mới để chặn G7. Báo cáo này không tạo Issue, không đề xuất merge hay gộp với báo cáo của bên khác.

## DR5-57: phép kiểm riêng của D

- Đọc toàn bộ fix #496 tại `tools/pr-core.mjs:15–39`, `tools/pr-core.test.mjs:23–109`, hai block `paths` tại `.github/workflows/ci.yml:3–39`, rồi theo caller `mergeBlockers`, `merge-pr.mjs`, `pr-status.mjs`. `CODEMAP_DOCS` có 5 file, `CODE_DOCS` thêm đúng 2 tài liệu G5; danh sách CI PR/push cùng 7 file. `.claude/rules/ci.md` và CLAUDE.md đã ghi ngoại lệ này.
- Tái hiện cũ: mỗi PR chỉ đổi `docs/design/phase-5-prompts.md` hoặc `docs/golden/ai-eval.md` nay là code; PR giả có PASS nhưng không CI bị `mergeBlockers` chặn. Có Verify xanh thì hết chặn đó. Docs review thường vẫn docs-only. Không tạo PR hoặc kích hoạt Actions thật.
- Baseline test PR: **59/59**. Mutation `code-docs` bỏ cả 2 đường G5: **2 assertion đỏ, 57 xanh**. Mutation `workflow-pr` bỏ prompt ở block PR: **1 assertion đỏ, 58 xanh**. Mutation `workflow-push` bỏ golden ở block push: **1 assertion đỏ, 58 xanh**. Cả hai block thực sự được assertion kiểm, không chỉ block đầu.
- Mutation dùng Vite transform trong bộ nhớ: sửa module hoặc giá trị chuỗi CI mà test đọc; không sửa workflow/source trên đĩa. Process kết thúc là mutation mất. Hai thử cấu hình đầu lỗi cú pháp/nạp module đã được sửa trong harness; chỉ ba lượt đỏ tại assertion đích ở trên là bằng chứng.
- Biến thể gần: từng G5 riêng, trộn docs thường, hai đường tên cũ/mới của trường hợp đổi tên, package codemap doc và file code thường. Mô phỏng thứ tự include/exclude **cho từng changed path** khớp `isDocsOnly`. Không gọi gh merge. Đây là kiểm tĩnh cộng test helper, không phải một workflow chạy trên GitHub.
- Push main vẫn bỏ job Verify theo ADR-0015; PR G5 chạy Verify và e2e. Không coi lựa chọn sẵn có đó là lỗi mới.

**Kết luận DR5-57: ĐÃ SỬA, không có CX2-D mới.**

## Đường đi xuyên gói đã chạy

Dùng source ở SHA ghim, sql.js/migrations thật trong bộ nhớ, adapter Mock hoặc `tauriOpenCode` với hàm invoke giả; UI dùng Edge trên bản build không sửa sản phẩm. Không có HTTP tới provider hay gọi command Credential Manager thật.

1. **OpenCode:** Settings Credit/Kimi/HIGH → IPC args/session → runner → schema/validator → lệnh DB → panel/lịch hẹn → xuất/nhập backup. Discovery và analysis đều ACCEPTED; thay KYC tạo STALE cho dòng cũ. Token không biết vẫn null; seq từ DB được dùng. Tên KH, mã KH, tên RE/team, phone và ghi chú riêng không xuất hiện trong messages phân tích. Ghi chú extraction được gửi nguyên văn theo §6.1, không áp nhầm cam kết ẩn danh của phân tích cho extraction.
2. **Mock:** không có `ai_complete`; vẫn đi qua validator/lệnh lưu chung. **ChatGPT web thủ công:** port copy/open giả không mở trang; dán tin nhắn của app bị OWN_MESSAGE và không tiêu hao attempt; đổi KYC cùng DB rồi dán output hợp lệ lưu STALE, provider/prompt/model đúng và roundtrip được.
3. **Lỗi/retry:** 401/403, 402/429, 302/502 đi qua port TS, analysis/extraction và `errorText` giữ cùng code/status/message, không thêm dòng AI. Đây là fake IPC để kiểm nửa TS; không phủ định lỗi reader Rust CX2-B1. Invalid→valid dùng một session và 4 messages; token null không bị cộng thành 0. Invalid rồi lỗi mạng không lưu một bản REJECTED giả.
4. **Extraction:** response có childrenCount hợp lệ, birthYear bị cấm, occupation có quote không thuộc note; chỉ childrenCount thành đề xuất đã chuẩn hóa. Không ghi KYC hay ai_analyses tự động. Chỉ lệnh xác nhận tay đổi KYC và khiến bản phân tích cũ STALE.
5. **UI OpenCode giả:** bật settings qua UI, Enter ở Phân tích → CURRENT, nguồn Kimi K3, `role=status` báo đã lưu. Output chứa `<img src=x onerror=alert(1)>` hiện nguyên văn; panel có 0 img và không dialog. 22 request đều localhost. Không chạy screen reader thật.
6. **Kiểm lại CX2-C1 riêng trong D:** dữ kiện 01/06/2024, xác nhận lại cùng giá trị ngày 11/10/2026, không version mới. Dòng vẫn CURRENT nhưng panel `MEDIUM / 2026-10-11`, lịch hẹn `LOW / 2024-06-01`. `D/probe-unit.log` ghi cả hai object. Caller lịch hẹn không truyền facts hiện hành vào `analysisContent`.

## Phát hiện đã có ở Codex A–C

Giữ nguyên ID và mức, không báo lại thành CX2-D. D đọc nguồn/caller để đối chiếu; chỉ CX2-C1 được chạy lại độc lập trong D. Bằng chứng chạy/mutation/native ở A–C là kết quả của các gói đó, không được trình bày như phép chạy mới ở D. Khuôn đầy đủ và nguồn test ở [A.md](C:/workspace/deep-review-5-r2/codex/A.md), [B.md](C:/workspace/deep-review-5-r2/codex/B.md), [C.md](C:/workspace/deep-review-5-r2/codex/C.md).

### CX2-A1 — khung app biến thể vẫn lưu ví dụ thành CURRENT

**Low · R/E/D · CONFIRMED.** `packages/ai/src/web.ts:85–88,111`; DR49(a), phần sửa #497 chưa bao phủ biến thể. NFD hoặc đổi khoảng trắng nội bộ cả hai khung vẫn giữ tin nhắn của app nhưng vượt guard; A ghi 39/767 hồ sơ seed nhận biến thể khoảng trắng, có dòng CURRENT và backup/import thật. Literal 767/767 bị chặn đúng. Ảnh hưởng khi RE dán tin nhắn đã biến dạng, không phải mọi thao tác dán. Hướng sửa: NFC/khoảng trắng tại dòng khung, test không mất attempt; khoảng 5–15 dòng sản phẩm + 30–50 dòng test. Ví dụ không có khung là KNOWN #491.

### CX2-A2 — NUL tại lệnh lịch hẹn cũ làm cắt ghi chú

**Low · D/C · CONFIRMED tại API lệnh.** `packages/db/src/common.ts:37–40`; `appointments.ts:278,296,360`. Có từ trước Phase 5; R14 đường nhập backup đã sửa. A truyền `Hẹn lại\0THÔNG TIN SAU NUL` vào triggerNote/nextStep/note; đọc lại và backup chỉ còn `Hẹn lại`. Chưa tái hiện qua clipboard UI Windows; trigger hiếm, không hỏng bảng AI. Hướng sửa: dùng chốt NUL của lệnh ở mọi ô chữ lịch hẹn, kiểm transaction; khoảng 5–15 dòng sản phẩm + 30–60 dòng test, không migration dữ liệu giả lập.

### CX2-B1 — mất mã HTTP khi body lỗi sau header

**Low · C/R/E · CONFIRMED.** `apps/desktop/src-tauri/src/ai.rs:387–394`; DR27, biến thể #503. Server local B trả header 401/402/403/429/500/502 rồi đóng body thiếu: NETWORK không status; gzip sai tương tự, header 429/body chậm ra TIMEOUT không status. Body lỗi lớn đọc được đã giữ status đúng. UI mất phân biệt key/hạn mức/server, không mất dữ liệu. Hướng sửa: giữ non-2xx/status dù reader lỗi; 2xx phân biệt lỗi body; khoảng 20–35 dòng sản phẩm + 60–100 dòng test.

### CX2-B2 — finishReason mới có thể đưa key nguyên văn qua IPC

**Low · S/R/C · CONFIRMED.** `apps/desktop/src-tauri/src/ai.rs:241,249`, `lib.rs:136`, `data/ai-tauri.ts:64`; hồi quy #503, DR05 Rust/28. B gọi `reply` với content OK và finish_reason bằng key giả; Completion/JSON IPC vẫn chứa key. Guard chỉ kiểm content. Runner không lưu finishReason, nên không kết luận field này vào DB. Cần gateway phản chiếu key bất thường. Hướng sửa: kiểm mọi string Completion trước IPC, giữ stop/length/null hợp lệ; khoảng 5–15 dòng sản phẩm + 20–40 dòng test.

### CX2-B3 — key JSON escape được giải mã rồi lưu vào DB/backup

**Low · S/R/D · CONFIRMED.** `apps/desktop/src-tauri/src/ai.rs:241,262–267`; `packages/ai/src/run.ts`, `packages/db/src/ai-analyses.ts`; DR27/28 sửa chưa đủ. B tạo fixture thực sự qua Rust `reply`: key giả Unicode-escape không bị content.contains bắt. Parser thật giải mã; validator ACCEPTED; lệnh DB/export/import đều giữ key nguyên văn. Message lỗi percent-encode cũng không bị mask. Không có bằng chứng sự cố key thật; điều kiện gateway bất thường như B2. Hướng sửa: kiểm biểu diễn JSON escape/URL encoding có thể giải mã thành secret trước IPC; khoảng 40–80 dòng sản phẩm + 80–120 dòng test. Không thay G5/golden.

### CX2-B4 — test vẫn để post production hỏng mà xanh

**Low · T/R/S/C · CONFIRMED.** `apps/desktop/src-tauri/src/ai.rs:337,1028–1038,1216,1371`; DR24 và khoảng trống test DR25, #503. B thay `post()` bằng NETWORK hoặc bỏ modifiers của `key_entry`: mỗi mutant vẫn 35/35 xanh; phiên bản không warning cũng qua clippy thường. Test server gọi post_with, test Local tự tạo store khác. Code hiện Local đúng qua probe native tên riêng của B, không kết luận đang lưu Enterprise. Hướng sửa: seam đi qua post production và chính key_entry, server/TLS/credential riêng có cleanup; khoảng 20–40 dòng sản phẩm + 100–150 dòng test, không dịch vụ mới. Chi tiết ước lượng/phạm vi ở B.md.

### CX2-C1 — CURRENT khác mức giữa hồ sơ và lịch hẹn

**Low · R/C/G · CONFIRMED, D tái hiện lại.** `apps/desktop/src/routes/appointments/appointment-ai-view.ts:35`, `AppointmentAi.tsx:37`; `routes/customers/ai-panel-view.ts:432,440`; DR15, caller bỏ sót #505. Cùng CURRENT sau xác nhận lại cùng giá trị cho MEDIUM/ngày mới ở hồ sơ, LOW/ngày cũ ở lịch hẹn vì thiếu facts. Không đổi dữ kiện/trạng thái phân tích. Hướng sửa: truyền facts hiện hành qua caller lịch hẹn, test same-value CURRENT; khoảng 10–25 dòng sản phẩm + 30–50 dòng test.

### CX2-C2 — ghi chú không giải thích khóa vì AI ở nơi khác

**Low · R/C/A · CONFIRMED.** `apps/desktop/src/routes/customers/KycExtraction.tsx:44,71,92`; DR40, #504. C giữ Kiểm tra kết nối bằng IPC giả rồi mở note: nút disabled, panel có câu bận, note không có câu. Quyết định Owner §8 câu 7 đã chốt cả panel/ghi chú dù Issue/test chỉ nêu panel. RE không biết vì sao phải chờ. Hướng sửa: dùng câu i18n AI_BUSY ở note idle, tránh lặp với BusyLine; khoảng 5–15 dòng sản phẩm + 15–25 dòng e2e.

### CX2-C3 — đề xuất cũ được gắn vào DB vừa thay cùng ID

**Low · E/C/D · CONFIRMED.** `apps/desktop/src/data/ai-analysis.ts:238–246`; `routes/customers/use-ai-job.ts:23–33`, `KycExtraction.tsx:60`. Biến thể quanh DR36, không phủ định fix lưu ai_analyses #498. C giữ extraction, nhập backup cùng note ID, mở lại, đổi Số con thành 3 rồi nhận proposal cũ 2. Proposal vẫn hiện; phải xác nhận tay qua hộp hiện giá trị 3 mới lưu 2. Không tự ghi KYC/AI. Hướng sửa: snapshot thế hệ job extraction và bỏ kết quả/đề xuất thế hệ cũ; khoảng 15–35 dòng sản phẩm + 40–70 dòng test.

### CX2-C4 — Bỏ đề xuất cuối mất focus về BODY

**Low · E/A · CONFIRMED.** `apps/desktop/src/routes/customers/KycExtraction.tsx:51,119`; `extraction-view.ts:72`. C dùng Enter trên Bỏ của proposal cuối: list biến mất, activeElement BODY. Có từ trước vòng 1, khác hai trigger đóng đã sửa DR43. RE dùng bàn phím mất điểm thao tác, không mất dữ kiện. Hướng sửa: focus đề xuất kế hoặc AI trích xuất khi hết; khoảng 10–25 dòng sản phẩm + 15–25 dòng e2e.

### CX2-C5 — lưu key thất bại bỏ status ban đầu

**Nit · R/E/A · CONFIRMED.** `apps/desktop/src/routes/SettingsAi.tsx:156–160,176,183–185`; hồi quy #502/DR37. C giữ keyStatus=true, setKey reject AI_KEYRING rồi nhả status: không badge đã có key/nút xóa vì acted.current đã bật. Remount khắc phục; key vẫn tồn tại và được che. Probe bỏ riêng acted hết lỗi mới, nhưng giữ test bảo vệ ca lưu thành công. Hướng sửa: đọc lại status sau thất bại hoặc phiên bản thao tác; khoảng 5–15 dòng sản phẩm + 20–35 dòng e2e.

## Đi qua mọi trục §5

| Trục | Cách xét và kết quả D |
|---|---|
| R | DR57 baseline, 3 mutant đều đỏ assertion và biến thể; gộp đúng 35 dòng A–C. Các mục còn hở dẫn ID ở trên. Không dùng full suite xanh để đổi kết luận biến thể thất bại thành ĐÃ SỬA. |
| E | Probe retry/lỗi giữa lần thử, null usage, KYC đổi trong cùng DB, same-value xác nhận lại, web own-message, extraction gồm field/quote bị lọc. Đọc generation/cancel/replace và báo cáo C, không lặp mọi stress native B. Ngoài các ID A–C, **đã xét, không thấy lỗi mới** ở seam D. |
| G | Đối chiếu G5/golden/spec và deterministic evidence; đường chung Mock/OpenCode/web đều qua validator. Extraction chỉ đề xuất và xác nhận tay. CX2-C1 lệch caller; các vấn đề prompt/parser đã KNOWN. **Đã xét, không thấy guardrail mới lọt/chặn nhầm** ở seam D. Không kết luận chất lượng model thật. |
| C | CI↔CODE_DOCS; Rust AiError/Completion↔port TS↔runner↔DB↔views; nullable tokens, finishReason/httpStatus, prompt/provider, seq. C1 tái hiện độc lập; B1/B2/B4 và C2/C3 đã dẫn. Ngoài đó **đã xét, không thấy lệch hợp đồng mới**. |
| D | Hai mode OpenCode roundtrip backup/import thật; Mock/web cùng luật lưu; KYC đổi thành STALE, extraction không tự lưu, lỗi HTTP/network không thêm dòng. Chốt lệnh/import chung đã A xét. **Đã xét, không thấy mất/hỏng dữ liệu mới trong D**; A2/B3/C3 giữ đúng giới hạn, S-2 KNOWN. |
| S | Kiểm canary private trong messages; UI script HTML chỉ React text; mọi request probe localhost; CSP/capabilities/fixed URLs và command không trả key. B2/B3 là khe key đã tái hiện bằng fake. **Đã xét, không thấy thêm đường thực thi output/mở URL tùy ý hay gửi dữ liệu ngoài hợp đồng**. Không thử AI thật/key app/trang ChatGPT. |
| P | Web build 528 ms; seed UI probe 2.827,5 ms; backup nhỏ 10.365 byte export 2,46 ms/import 11,87 ms. Seed e2e chạy riêng qua ngưỡng 5 s. Một mẫu máy local, không suy ra SLA/timing Tauri. **Đã xét, không thấy vấn đề hiệu năng mới có số đo đủ để báo**. Parser nhiều `{` đã KNOWN #492. |
| B | Codemap check xanh; tsc desktop noUnused xanh; rg caller/export/helper và diff mới trong tools/data/UI; T-202 không còn export chết. **Đã xét, không thấy code chết/lặp mới gây lỗi**; các mục bloat #494 vẫn KNOWN, không nhận xét phong cách. |
| T | 2.215 unit, đủ 188 e2e có pass, 7 probe unit và 1 UI probe. Mutation DR57 bắt được cả hai block CI; B4 là test sống sót, R47 sửa i18n chỉ source chứng minh. **Đã xét, không thấy lỗ hổng test mới riêng D**. Bộ test xanh không phủ định các probe bug A–C. |
| A | Enter trên UI OpenCode/status, role/label, i18n error/source/model; đọc focus web/F/proposal và test C. C2/C4/C5 có giới hạn. **Đã xét, không thấy lỗi trợ năng/i18n mới riêng D**. Chưa chạy NVDA, không suy diễn DOM status thành đã nghe screen reader. |

## Kiểm tra đã chạy trong D

| Kiểm tra | Kết quả | Bằng chứng |
|---|---|---|
| DR57 baseline | 59/59 | `D/R57-baseline.log` |
| Bỏ CODE_DOCS G5 | 2 assertion đỏ/57 xanh | `D/R57-code-docs.log` |
| Bỏ một G5 ở block PR hoặc push | Mỗi phép 1 assertion đỏ/58 xanh | `D/R57-workflow-pr.log`, `D/R57-workflow-push.log` |
| Toàn bộ unit gốc | **103 file, 2.215/2.215**, 104,13 s | `D/unit-full.log` |
| Probe xuyên gói | **7/7**, 1,23 s | `D/probe.test.ts`, `D/probe-unit.log` |
| Web build gốc + snapshot | Build thành công, output/cache ngoài repo | `D/serve.mjs`, `D/dist/` |
| E2E gốc, bỏ seed timing để chạy riêng | 187 ca: **186 pass, 1 fail do hostname harness** | `D/e2e-full.log` |
| Seed riêng + toàn bộ theme ở localhost | **6/6**, 7,4 s, gồm ca network thất bại ở lượt trước | `D/e2e-followup.log` |
| UI OpenCode IPC giả/safe text/keyboard | **1/1**, 5,0 s | `D/probe-ui.log` |
| `node tools/codemap.mjs --check` | Export maps up to date | Terminal D |
| `tsc -p apps/desktop --noEmit --incremental false --noUnusedLocals --noUnusedParameters` | Exit 0 | Terminal D |
| `pnpm lint:deps` | 299 module/1.168 dependency, 0 violation | Terminal D |

E2E ban đầu dùng `127.0.0.1:4201`, trong khi test `theme.spec.ts:48` chỉ cho hostname literal `localhost`; failure in toàn request 127.0.0.1 của chính app. Đổi **config ngoài repo** sang localhost, chạy lại 5 theme + seed riêng đều xanh. Vì vậy có kết quả pass cho **188 ca gốc duy nhất qua hai lượt**, không nói một lượt 188/188. Không có sửa test/sản phẩm để làm xanh.

Probe extraction ban đầu dùng expectation chuỗi `3` nhưng domain chuẩn hóa thành số `3`; đã sửa fixture harness và chạy lại. Probe UI đầu tiên không nạp được helper import.meta ở ngoài repo; sao phần helper test cần dùng sang D, không sửa helper gốc, lượt cuối xanh. Những lỗi harness không tính thành finding sản phẩm.

Không chạy `pnpm verify` như một lệnh trọn gói, không chạy native Rust/exe/eval trong D. Kết quả Rust/local HTTP/credential/clippy ở B là bằng chứng gói B, không phải phép chạy D; baseline common không được nhận thành test phiên D. UI OpenCode chỉ thay IPC, không chứng minh HTTPS production, cũng không che khoảng trống B4.

## KNOWN

- #488: eval DR52–56/58/59/62–64; #491: G5 DR01/02/08/23/49(b), false positive #420; #492: parser/runner DR04/05 TS/06/07/09; #493: test DR03/12/17/34/60/61; #494: bloat DR10/11/18/19/51. Không báo lại, không đổi golden.
- S-2: pending write/replace chồng; job caller vi phạm busy; lỗi hoàn tất ở màn khác không được giữ; cảnh báo cấu hình/kết quả kết nối cũ; ConfirmFactDialog refused muộn; vài markup/i18n nhỏ đã ghi trong known. Không có chứng cứ D nặng hơn để nâng mức.
- Probe UI ACCEPTED với fake IPC bổ sung bằng chứng hợp đồng, không biến KNOWN DR60 thành một finding mới hoặc tuyên bố đã sửa bộ test production.

## Phạm vi đọc và giới hạn

Đọc chuẩn bắt buộc: `common/plan.md` §1–§6, baseline, known; CLAUDE.md, CONTEXT.md, spec Phase 5, G5 prompts, golden AI eval; ADR-0009 D-1/G5/W-1; tổng hợp 10/10 §3–§5/§7/§8 và quyết định Owner 10/10 trong PROJECT-STATE; thân Issue #482–#490/#500 qua `gh issue view`. Chỉ đọc báo cáo Codex A/B/C vòng 2; không truy cập, tìm, liệt kê thư mục/báo cáo vòng 2 bị cấm.

R trước, rồi diff sửa `0df3606..705ea7c`, rồi phần Phase 5 `3e84ce8..705ea7c`. Phạm vi D đọc sâu là các seam và caller dưới; không tuyên bố audit từng dòng toàn repo hoặc lặp mọi fuzz/mutation của A–C.

| Nhóm | File / dòng hoặc phần đã đọc |
|---|---|
| CI/tools chính | `.github/workflows/ci.yml` toàn file (1–161); `tools/pr-core.mjs:1–170` và nhánh cleanup liên quan; `pr-core.test.mjs:1–125` + diff; `codemap-core.mjs` diff/catalog; caller `merge-pr.mjs`, `pr-status.mjs`; `.claude/rules/ci.md` toàn file; CLAUDE.md phần CI. |
| AI qua port/run | `apps/desktop/src/data/ai-tauri.ts:1–75`, `ai-analysis.ts` phần chuẩn bị/lưu/await/generation/extraction/web; `packages/ai/src/adapter.ts`, `errors.ts`, `input.ts` privacy, `run.ts:155–403`, `web.ts:1–132`, schema/prompt/validator theo caller/diff và báo cáo A. |
| DB/đời sống app | `app-data.ts:1–405` theo các chunk DB/replace/reload/settings; `packages/db/src/ai-analyses.ts:1–255`; backup/backup-validation/kyc fix diff và caller; domain `evidence-level.ts:1–52` cùng Phase 5 diff/test B01–B11. |
| Rust/hợp đồng | `ai.rs:1–413` theo chunk args/check/reply/errors/key/agent/post/browser; `lib.rs:136–186`; Cargo/cấu hình/capabilities/CSP; đối chiếu B về native tests mới, không đọc từng test Rust trong D. |
| UI | Fix diff SettingsAi/Settings/routes/KycIntelligence/KycExtraction/CustomerProfile/ai-panel-view/extraction-view/kyc-view; `appointment-ai-view.ts:1–53`, caller AppointmentAi; TextField/i18n/error/settings view; current source phần key status, focus, BusyLine/status và evidence. |
| Test | Fix diff unit/e2e liên quan; đọc `e2e/support.ts`, settings-ai/customer-ai/web/network/seed; chạy toàn bộ unit/e2e gốc nêu trên. |

## Đếm mức × trục

Mỗi phát hiện gán **một trục chính** để không cộng trùng: R=A1/C1/C2/C5, E=C3/C4, C=B1, D=A2, S=B2/B3, T=B4. Trục phụ được ghi ở từng ID. Bảng tính các finding Codex A–C kế thừa; **phát hiện mới riêng D: 0 CONFIRMED, 0 PLAUSIBLE**.

| Mức | R | E | G | C | D | S | P | B | T | A | Tổng ID |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 3 | 2 | 0 | 1 | 1 | 2 | 0 | 0 | 1 | 0 | 10 |
| Nit | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

## Phụ lục nguồn test tạm và chạy lại

Tất cả nguồn/log/cache/build/probe D ở `C:\workspace\deep-review-5-r2\codex\D\`; báo cáo nộp `C:\workspace\deep-review-5-r2\codex\D.md`. A/B/C không bị đổi. Các lệnh dưới chạy từ worktree, không cần key thật. Mutation chỉ trong process; luôn bỏ biến môi trường sau lượt chạy.

```powershell
node node_modules/vitest/vitest.mjs run tools/pr-core.test.mjs --config C:/workspace/deep-review-5-r2/codex/D/vitest.config.mjs
$env:R57_MUTANT = 'code-docs' # hoặc workflow-pr / workflow-push
node node_modules/vitest/vitest.mjs run tools/pr-core.test.mjs --config C:/workspace/deep-review-5-r2/codex/D/vitest.config.mjs
Remove-Item Env:R57_MUTANT
node node_modules/vitest/vitest.mjs run C:/workspace/deep-review-5-r2/codex/D/probe.test.ts --config C:/workspace/deep-review-5-r2/codex/D/vitest.config.mjs --reporter verbose
$env:FULL_UNIT = '1'
node node_modules/vitest/vitest.mjs run --config C:/workspace/deep-review-5-r2/codex/D/vitest.config.mjs
Remove-Item Env:FULL_UNIT
node C:/workspace/deep-review-5-r2/codex/D/serve.mjs
# Terminal khác, localhost server ở 4201:
node node_modules/@playwright/test/cli.js test --config C:/workspace/deep-review-5-r2/codex/D/pw.config.mjs
node node_modules/@playwright/test/cli.js test --config C:/workspace/deep-review-5-r2/codex/D/pw-followup.config.mjs
node node_modules/@playwright/test/cli.js test --config C:/workspace/deep-review-5-r2/codex/D/pw-probe.config.mjs
```

Lượt full unit báo 2.215 là trước khi thêm probe ngoài repo; chạy lại config FULL_UNIT hiện sẽ thêm 7 probe. `pw.config.mjs` giữ nguyên hostname của lượt đầu để tái hiện log; `pw-followup.config.mjs` và `pw-probe.config.mjs` dùng localhost. Helper UI giả chỉ giữ key trong bộ nhớ, không gọi Credential Manager. Server local đã dừng cuối phiên. `build-report.mjs`/`r-table.md` chỉ dùng ghép 35 dòng, không phải code sản phẩm.

## Thời gian và worktree cuối phiên

UTC+7 ngày 11/10/2026: đã kiểm SHA/đọc chuẩn trước mốc giờ đầu tiên **02:38:30**; không có mốc mở phiên chính xác hơn. Chốt báo cáo **02:56:42**. HEAD đầu/cuối **705ea7c0e76dcdcf8c89f949fc2e3b3b6e4fff2c**, detached. Không source/commit/mutation trên đĩa, không tạo Issue, không merge, không gọi dịch vụ AI thật.

`git diff --exit-code` xanh; `git status --short` cuối phiên giữ đúng ba mục sẵn có:

```text
?? .agents/
?? .codex/
?? AGENTS.md
```
