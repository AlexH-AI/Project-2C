XONG — codex gói A lượt 6, 2026-11-07 12:37:51 +07:00

## 1. Thông tin phiên

- Codex, gói A — Lõi dữ liệu; phiên mới, không dừng vì hạn mức.
- SHA đầu phiên: **5b1328ae236aa62981dbf43066ff544a9e832c8c**.
- git status --short đầu phiên: rỗng.
- Bắt đầu: **2026-11-07 12:04:01 +07:00**, Asia/Bangkok.
- Công cụ: Codex desktop, functions.exec / exec_command, PowerShell. CLI cục bộ: **codex-cli 0.162.1**; đây không phải số phiên bản ứng dụng desktop. Khi hỏi phiên bản, CLI có cảnh báo quyền dọn thư mục tạm/alias, vẫn trả phiên bản.
- Model: thông tin agent của phiên công bố **GPT-6**; công cụ không công bố mã model cụ thể hay mức suy luận. Prompt Owner ghi lựa chọn GPT Sol 6.1; không coi chữ trong prompt là xác nhận runtime.
- Node **v24.20.0**, Vitest **5.0.1**. Mọi lệnh Node đặt C:\Program Files\nodejs đầu PATH trong cùng invocation.
- Chỉ đọc repo, không commit, không subagent. Probe/bản chép/log chỉ ghi ở C:\workspace\deep-review-1-6-r6\codex\A\. Codex không làm bảng R.
- Kết quả: **1 CONFIRMED, Low/D, đề xuất chặn phát hành theo K48**. Kết luận sẵn sàng v1.0 thuộc gói F.

## 3. Phạm vi đã đọc

Đọc trước toàn bộ git diff 37a80b6 5b1328a -- packages/domain packages/db: **14 file, +224/−31**. Gồm 13 file code/test (+223/−30) và packages/domain/CLAUDE.md (+1/−1). Theo baseline: 6 file sản phẩm +41/−8, 7 file test +182/−22.

Trọng tâm diff: isLabel hỏi trống qua normalizeText; luật nhập 15 giới hạn mã KH Crockford trên cả KH đã xóa; TrashOwner.customer.code; searchText chuyển về domain và export; test byName quá trần cache và đếm số lần tính khóa. Bản sản phẩm name-order.ts không đổi.

**Đọc sâu đủ 91/91 file trong common\files-A.txt: 42 sản phẩm, 49 test/fixture/test-support. File trong danh sách chưa đọc kỹ: không có.** Danh mục từng file và SHA-256 ở A/read-scope.tsv. 13 file sinh tự động đã được manifest loại sẵn.

Đã đi qua schema, migration loader, transaction/prepared statements, IDs, chữ/tiền/ngày/thứ tự tên, mọi lệnh nhân sự/KH/lịch/HĐ/KYC/phân tích AI, 15 luật backup, đếm bản ghi, seed, Dọn sạch; đọc cả test rollback/COMMIT, migration có dữ liệu, trigger append-only và golden.

Nguồn đối chiếu:

- CLAUDE.md gốc, CONTEXT.md, packages/{domain,db}/CLAUDE.md để hiểu dự án; không làm nghi thức phát triển.
- Spec Phase 3 §4/§6, Phase 4, Phase 6 §4/§5; golden chi-so, kh-theo-nhom, kyc, lich-hen; ADR-0007/0008.
- common/{plan,known,fixes,baseline}.md, đặc biệt L6.0–L6.11, K48–K50, T-363/T-368/T-377.
- Các mục gói A của tổng hợp lượt 1–5; tổng hợp lượt 5 §3, §6.1, §7, §9, §10.1; báo cáo gốc cũ trong repo để tránh trùng và xét lại ca từng “không thấy”.
- Ngoài A: apps/desktop/src/data/{app-data,tables}.ts, helper Thùng rác liên quan trong routes/trash-view.ts và nơi màn đọc dữ liệu, tools/ts-hooks* và đường sinh dữ liệu tải. Đây là đường nối, không phải review toàn bộ B/E.

Không thay spec/golden. R1/R2 là KNOWN; không chấm bằng bảng R.

## 4. Kịch bản đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| A-01 | Toàn bộ unit domain + db, CLI Vitest trực tiếp | **44/44 file, 1.503/1.503 test qua**, 63,99 s; unit-A.log | — |
| A-02 | 8 hạt chọn thao tác × 600 bước qua AppData: KH/bàn giao, lịch/kết quả/dời/xóa/khôi phục/hẹn tiếp, chuyển tay, HĐ, nhân sự, KYC, dọn | **4.800 bước**: 2.333 lệnh thành công, 901 DbError, 1.566 bước thiếu đối tượng nên bỏ qua. Sau mỗi bước: hai validator backup qua và counts bằng năm danh sách tables() | — |
| A-03 | So tables trước/sau lệnh bị từ chối | 901 lần không đổi; không lỗi ngoài DbError | — |
| A-04 | Xuất/nhập định kỳ trong máy trạng thái | **80 vòng** db import, tables bằng nhau | — |
| A-05 | Dọn sạch trong chuỗi | **214 lần**, counts bằng preview, bất biến sau bước qua | — |
| A-06 | Nhập tải qua app.readBackup → app.importBackup | 4 team, 51 nhân sự, 1.481 KH, 10.255 lịch, 1.674 HĐ; SHA-256 file đúng F952E062…EC13A0 | — |
| A-07 | 49 scope × 5 loại kỳ × 6 đối chiếu trên tải | **1.470 đối chiếu qua**: metrics, appointmentCounts, stageSnapshot đơn lẻ/gom theo scope/mốc/chuỗi | — |
| A-08 | Dọn 113 dòng Thùng rác trên tải qua AppData | Preview khớp; chỉ tiêu năm và snapshot đã so không đổi; xuất sau dọn được readBackup nhận; Thùng rác còn 0 | — |
| A-09 | Hai lần rút cùng timestamp, chuyển tay trung gian cùng ngày, xuất/nhập rồi khôi phục | Hai biến thể N1/N2 bị E20 chặn nhầm; clock tăng và dời ngày sau là đối chứng đúng; chuyển tay thật sau xóa vẫn chặn | CXR6-A1 |
| A-10 | Lần xóa cuối không rút gì, nhưng mốc trùng lần rút cũ; giữ N2/N4 | **4 đối chứng có assertion qua**: clock tăng chặn STAGE_NOT_ON_DAY; clock đứng cho khôi phục, ghi thêm nhóm. N2 có 1 RF; snapshot đổi; backup sau vẫn nhận | CXR6-A1 |
| A-11 | Bản chép thêm ORDER BY seq DESC, hook chỉ trong process | Sửa hai ca chặn nhầm A-09, giữ E20 thật; **A-10 vẫn sai dữ liệu**. Hướng sửa một dòng chưa đủ | CXR6-A1 |
| A-12 | Nghi regex mã KH/năm sinh nhận hậu tố xuống dòng | Node từ chối LF, CR, U+2028, U+2029; loại bỏ nghi vấn | — |

Máy trạng thái dùng PRNG chọn thao tác, nhưng ID có nguồn ngẫu nhiên của app; không coi là trace cố định theo seed hay duyệt hết trạng thái. Validator liên bảng không bắt mọi sai khác nghiệp vụ: A-10 sai TR-3 nhưng vẫn qua luật nhập.

## 5. Phát hiện mới

### CXR6-A1 — Mốc xóa trùng gán nhầm lần thu hồi, khôi phục ghi thêm nhóm/RF

**ID:** CXR6-A1  
**Mức:** Low  
**Trục:** D  
**Vị trí:** packages/db/src/customers.ts:465, packages/db/src/customers.ts:477, packages/db/src/customers.ts:480; packages/db/src/appointments.ts:259, packages/db/src/appointments.ts:274, packages/db/src/appointments.ts:316 (5b1328a).  
**Tình trạng:** CONFIRMED.  
**Liên quan:** DR6-03/DR6-69/DR6-105, T-248 (#666); **có từ trước, lượt 1–5 bỏ sót các biến thể này**. Không do diff sau lượt 5.

**Mô tả:** App dùng timestamp làm khóa nhận diện chuyển nhóm mà một lần xóa rút. Khi mốc xóa trùng lần rút cũ, helper nhận nhầm dòng cũ, kể cả lần xóa cuối không rút gì: khôi phục có thể ghi nhóm/RF không thuộc lần xóa, hoặc bị E20 chặn nhầm.

**Tái hiện / bằng chứng chính:**

~~~powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
node C:\workspace\deep-review-1-6-r6\codex\A\clock-no-withdrawal.mjs
~~~

Probe dùng openAppData, ghi qua app.run, đọc tables(), xuất/đọc/nhập qua AppData. Không SQL thô, không sửa backup. Clock giả đứng tại **2026-11-07T05:00:00.000Z**; RandomFill cố định giúp thứ tự ID ổn định.

1. Tạo Lan N3 ngày 01/10.
2. Lịch A ngày 05/10 MET/N2, tạo chuyển nhóm seq 2.
3. Sửa A thành CANCELLED, rút seq 2 tại T.
4. Chuyển tay KH N3→N2 ngày 04/10.
5. Sửa A thành MET/N2: **giữ nhóm, không chuyển nhóm sống của A**.
6. Xóa A tại T: **không rút chuyển nhóm nào**.
7. Chuyển tay KH N2→N3 ngày 04/10.
8. Xuất → readBackup → importBackup được nhận; khôi phục A.

Theo TR-3, cuộc gặp giữ nhóm không được tự thêm chuyển nhóm khi khôi phục. N2 nay không còn là nhóm của ngày 05/10, nên phải chặn **STAGE_NOT_ON_DAY**.

Trích các trường từ hai dòng đầy đủ của clock-no-withdrawal.log:

~~~json
{"mode":"ticks","held":"N2","rf":0,"noLiveTransitionAtDelete":0,"trashEffect":{"kind":"none"},"trashBlocked":{"code":"STAGE_NOT_ON_DAY","params":{"date":"05/10/2026"}},"before":"N3","result":{"code":"STAGE_NOT_ON_DAY","params":{"date":"05/10/2026"}},"after":"N3","readsAfter":"OK"}
{"mode":"stopped","held":"N2","rf":1,"noLiveTransitionAtDelete":0,"selectedSeq":2,"trashEffect":{"kind":"stageChange","from":"N3","to":"N2","date":{"year":2026,"month":10,"day":5},"rf":true},"before":"N3","result":"OK","after":"N2","readsAfter":"OK"}
~~~

Snapshot 05/10 từ **N3=1, N2=0** thành **N3=0, N2=1**. Có thêm chuyển nhóm N3→N2 ngày 05/10 gắn A và RF=1. Biến thể giữ N4 bị thêm N3→N4 (RF=0). Hai đối chứng clock tăng đều chặn đúng và giữ N3.

Backup thật trước/sau nằm ở clock-no-withdrawal-{N2,N4}-{before,after}.p2cbackup. Bản sau được readBackup nhận: luật nhập không phát hiện sai ý nghĩa TR-3.

**Biến thể chặn nhầm:** clock-collision.mjs tạo A 02/10 N3→N2 (seq 2), sửa Hủy (rút 2), chuyển tay N3→N4 cùng 02/10 (seq 3), sửa A MET/N1 hoặc N2 (seq 4), xóa (rút 4). Hai dòng 2/4 cùng deleted_at; sau xuất/nhập helper chọn 2. listTrash và restoreAppointment cùng trả TRANSITION_BEFORE_LATEST {date:"02/10/2026",sameDay:1}, dù chuyển tay xảy ra trước lần xóa cuối. Clock tăng chọn 4 và khôi phục đúng; dời cuộc gặp sang 03/10 cũng không chặn nhầm.

**Nguyên nhân / kiểm hướng sửa:** transitionWithdrawnAt lọc appointment/customer/deleted_at rồi .get(); không có định danh riêng cho lần xóa, không thể phân biệt “lần xóa này không rút gì” với lần rút cũ trùng mốc. Thêm ORDER BY seq DESC trên bản chép làm **5/5 biến thể A-09** đúng, vẫn chặn E20 thật; nhưng **A-10 còn sai**, ghi ở candidate-no-withdrawal.log. Hướng sửa một dòng là thiếu.

**Mới so lượt cũ:** docs/reviews/raw/2026-10-21/claude/A.md:172, f-stage-K6, từng thấy chọn dòng cũ khi hai mốc trùng, nhưng ca đó vẫn ghi chuyển nhóm hợp lệ nên không báo. A-09 đặt chuyển tay trung gian **cùng ngày**; A-10 có lần xóa cuối **không rút gì**, chứng minh đổi nhóm/RF/snapshot. Không báo lại riêng DR6-69 về seq hay DR6-105 về dạng timestamp.

**Cùng mẫu:** quét từ gốc toàn repo:

~~~powershell
rg -n 'transitionWithdrawnAt|restoreStageMove|afterSeq|versionsAt|withdrawAppointmentTransition|eq\(stageTransitions.deletedAt' --glob '*.{ts,tsx,mjs,rs}' --glob '!*.test.*'
~~~

- Ghép quan hệ bằng mốc xóa: packages/db/src/customers.ts:465–480.
- Rút chuyển nhóm: packages/db/src/appointments.ts:158, :216 (ghi/sửa kết quả), :259 (xóa); dùng customers.ts:369. Probe đã đi qua sửa kết quả, sửa lại, xóa, khôi phục.
- Tiêu thụ lần rút: appointments.ts:289–292 (guard), :315–316 (restoreStageMove), :274 (ghi lại); trash.ts:144 dùng chung để tính hiệu ứng. **Một họ lỗi, một ID.**
- packages/db/src/kyc.ts:131–138 cũng ghép createdAt nhưng kiểm nhiều phiên bản trùng mốc rồi bỏ ánh xạ khi mơ hồ, không cùng lỗi.
- Không tìm thêm đường sản phẩm ghép lần rút bằng deleted_at ngoài helper trên.

**Ảnh hưởng:** cần clock đứng/quay lại đúng mili giây, hoặc backup sửa tay tạo mốc trùng. Chưa chứng minh clock tăng bình thường sinh lỗi. Khi gặp, khôi phục đổi nhóm KH, RF, snapshot trái “trả đúng lúc xóa”, và sai khác vào backup. Hiệu ứng Thùng rác tính theo lần rút nhầm; nhánh khác chặn nhầm E20.

**Chặn phát hành:** **có — đề xuất theo K48**. Low vì điều kiện hiếm; trục chính D vì đã chứng minh hậu quả lên dữ liệu, RF, snapshot, backup. K48 quy định Low/D chặn. Phiên tổng hợp chốt mức/trục và việc chặn.

**Đề xuất:** định danh rõ lần thu hồi của chính thao tác xóa, kể cả “không rút”; ví dụ lưu transition id/null cùng bản ghi xóa trong transaction, thay timestamp làm khóa quan hệ. Một helper chung cho lệnh/hiệu ứng, kiểm liên kết khi nhập backup. Giữ seq của E20 và đưa lại đúng dòng cũ khi phù hợp. Test cả hai dòng rút trùng mốc và chỉ một dòng rút cũ nhưng lần xóa cuối không rút, clock tăng/lùi, xuất/nhập, chuyển tay cùng ngày/sau xóa thật; so nhóm/RF/snapshot. Ước **40–90 dòng sản phẩm/SQL, 100–160 dòng test**, cần chốt biểu diễn dữ liệu khi làm Issue; chưa triển khai hay đo cỡ thực tế. Không sửa spec/golden theo code.

## 7. Bảng đếm mức × trục

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | **1** | 0 | 0 | 0 | 0 | 0 | 0 | **1** |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 0 | **1** | 0 | 0 | 0 | 0 | 0 | 0 | **1** |

**CONFIRMED 1, PLAUSIBLE 0; chặn 1 / không chặn 0.** Không có tỉ lệ PLAUSIBLE cao. Nhánh E20 cùng nguyên nhân nằm trong A1, không đếm hai lần. Nhận định tạm Low/E của nhật ký được thay bằng Low/D sau A-10.

## 8. Đã xét, không thấy

| Trục | Bằng chứng và kết quả ngoài CXR6-A1 |
|---|---|
| E | Đọc mọi nhánh lệnh/domain, unit ngày/tiền/Unicode, 4.800 bước, 1.470 đối chiếu, đối chứng clock. Ngoài chặn nhầm cùng họ A1, chưa chứng minh edge case mới |
| C | Đối chiếu ADR, D1–D13, TR-1…13, E7/E18/E19/E20, golden và luật nhập. A1 trái TR-3 đã xếp D; chưa thấy mâu thuẫn hợp đồng mới khác |
| D | 901 lần từ chối không đổi tables, 80 roundtrip, hai validator sau mỗi bước, Dọn sạch và tải. Đọc test migration có dữ liệu/rollback/COMMIT/FK/append-only. Ngoài A1 chưa chứng minh sai/mất dữ liệu mới |
| G | Đọc kyc-gate, fact/status/hash/version, ai-analyses input/output/labels, luật nhập 7/8/12–14; test và golden KYC qua. Không gọi AI thật; chưa thấy lỗ guardrail mới ở tầng A |
| S | Đọc envelope backup, giới hạn 100 MiB, kiểm giá trị/liên kết/storable text, SQL tham số, migration/integrity và trigger. Test backup/Unicode hỏng qua; chưa thấy vượt ranh giới mới |
| P | Đọc gom chỉ số/snapshot, cache tên, index, Dọn sạch; ca đếm khóa byName qua. Mốc ở common/baseline.md; không đo riêng, không đưa phát hiện P hay suy số đo từ thời gian unit |
| B | Đọc đủ sản phẩm/diff; searchText là helper chung. Không thấy phần thêm chỉ cho probe lọt vào sản phẩm, không có chi phí bloat mới đo được; không đề nghị refactor trước phát hành |
| T | Đọc đủ 49 test/fixture/test-support, chạy 1.503 unit, đối chứng bản chép. Ca trùng mốc “lần xóa không rút gì” là phần cần thêm của A1, không tách ID test hở cùng nguyên nhân |
| A | Đọc Unicode/thứ tự tên/format tiền-ngày/owner-code Thùng rác; test searchText/name-order/text/period qua. Chưa thấy lỗi i18n/trợ năng mới trong dữ liệu A; không coi đọc code là kiểm bố cục màn |

## 9. Phụ lục

Mọi tên file dưới tương đối với **C:\workspace\deep-review-1-6-r6\codex\A\**:

| File | Nội dung |
|---|---|
| unit-A.log | Bộ unit A |
| scenarios.mjs, scenarios.log | Máy trạng thái, roundtrip, tải, Dọn sạch |
| clock-collision.mjs, clock-collision.log | 5 biến thể hai lần rút |
| clock-collision-{N1,N2}.p2cbackup | Backup chặn nhầm |
| clock-collision-refinement.log | Lần tinh chỉnh đầu thất bại assertion vì ID ngẫu nhiên làm thứ tự chèn sau import đổi; không dùng làm kết quả cuối. Probe cuối ghim RandomFill |
| clock-no-withdrawal.mjs, clock-no-withdrawal.log | 4 biến thể gốc lần xóa cuối không rút; có RF/snapshot |
| clock-no-withdrawal-{N2,N4}-{before,after}.p2cbackup | Backup thật trước/sau lỗi dữ liệu |
| candidate-customers.ts | Bản chép thêm đúng một ORDER BY, không thay repo |
| candidate-check.mjs, candidate-check.log | Bản chép: 5 biến thể đầu đúng, giữ E20 thật |
| candidate-no-withdrawal.mjs, candidate-no-withdrawal.log | Bản chép: lỗi dữ liệu vẫn sống; hướng sửa một dòng thiếu |
| read-scope.tsv | Danh mục 91 file đã đọc, loại, SHA-256 |
| worklog.md | Nhật ký ghi dần; nhận định tạm đã được thay bằng kết luận báo cáo này |

Không làm đột biến bảng R. ORDER BY là thử chẩn đoán hướng sửa, chưa phải bản sửa đủ. Repo không bị patch.

Lệnh chạy unit từ repo:

~~~powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
node node_modules/vitest/vitest.mjs run packages/domain packages/db
~~~

Mỗi probe chạy riêng bằng cùng mẫu PATH, ví dụ:

~~~powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
node C:\workspace\deep-review-1-6-r6\codex\A\scenarios.mjs
~~~

Các entry point khác: clock-collision.mjs, clock-no-withdrawal.mjs, candidate-check.mjs, candidate-no-withdrawal.mjs (đường dẫn đầy đủ cùng thư mục A). Probe ghi backup cần quyền ghi thư mục kết quả Codex.

Không gọi pnpm, gh/công cụ có gh ngầm, dịch vụ AI sản phẩm, Credential Manager hay trình duyệt; không cài công cụ.

### Kiểm cuối

- git status --short cuối phiên: **rỗng**, giống đầu phiên.
- SHA cuối phiên: **5b1328ae236aa62981dbf43066ff544a9e832c8c**, đúng SHA ghim.
- Danh mục đọc: 91 file, 42 product + 49 test; kiểm file bằng đường dẫn đầy đủ. Probe và backup bằng chứng đã có.
- Không file sản phẩm/test trong repo bị sửa; không commit. Chỉ cache test bị ignore có thể được Vitest ghi.
- Giờ xong: **2026-11-07 12:37:51 +07:00** (Asia/Bangkok).