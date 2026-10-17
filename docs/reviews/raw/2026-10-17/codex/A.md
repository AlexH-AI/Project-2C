XONG — codex gói A lượt 2, 2026-10-17 02:18:45 +07:00

## 1. Thông tin phiên

- Bên / gói: Codex — A. Lõi dữ liệu; phiên mới.
- SHA đầu phiên: 4217ed4cd3300af1d63aa61db9eb13902fe75f16 (đúng SHA yêu cầu).
- Worktree: C:\workspace\Project-2C-review-2.
- Git status đầu phiên: ba mục untracked có sẵn: .agents/; .codex/; AGENTS.md. Không thay đổi chúng.
- Giờ bắt đầu (Asia/Bangkok): 2026-10-17 01:58:45 +07:00.
- Máy: DESKTOP-KDURKJP, Intel Core i9-12900K, Node v24.20.0.
- Phiên bản CLI: codex-cli 0.162.1 (codex --version; có cảnh báo không dựng được PATH alias do HOME, không cản review).
- Công cụ: Codex desktop, PowerShell, Node/pnpm và probe local; không gọi AI sản phẩm, không gh, không subagent.
- Model: GPT-6 / Codex; phiên không cung cấp mã model chi tiết hoặc tên mức suy luận để xác nhận, không tự suy đoán.
- Phạm vi đọc ngoài repo: common của lượt 2; probe Codex lượt 1 khi cần. Không đọc kết quả lượt 2 của bên khác.

## 2. Bảng R

| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| 01 | #592 → #614 | ĐÃ SỬA | E18 probe nhận, không thêm chuyển nhóm, roundtrip được. Mutant R01: E18 đỏ (1 failed). | Xóa–rút chuyển nhóm nguồn–khôi phục giữ nhóm bị STAGE_NOT_ON_DAY đúng luật mới. |
| 02 | #594 → #618 | ĐÃ SỬA (phần A) | Bàn giao hai lần chuyển đúng 2 lịch Dự kiến; lịch Dời, quá hạn, đã hủy, đã xóa giữ RE. Mutant R02: 2 test đỏ; R02-next: 1 test đỏ. | Kiểm cả rollback COMMIT lỗi, RE của hẹn tiếp. Phần UI do D/E kiểm. |
| 03 | #592 → #614 | ĐÃ SỬA | E19 nhận không thêm transition; E20 trả TRANSITION_BEFORE_LATEST. Mutant R03 bỏ so thứ tự ghi: E20 đỏ; R03-kept-reapplied: E19 đỏ. | Biên cùng mili giây còn hở: CX2-A3. |
| 04 | #593 → #616 | HỒI QUY | Ca cũ sửa ngày qua chuyển tay nay kiểm lại đúng; mutant R04: 2 test đỏ. Nhưng nhập bù MET trước ngày tạo KH (K2) từng được nay bị chặn; backup cũ từ lệnh bị rule 4. | CX2-A1, bằng chứng precreation.log. Phần 6c/6f của E kiểm riêng. |
| 05 | #593 → #616 | ĐÃ SỬA | Chuyển tay lùi qua MET → TRANSITION_BEFORE_MEETING; rút move đang được giữ → STAGE_KEPT_BY_MEETING, DB không đổi. Mutant R05a / R05b: mỗi cái 1 test đỏ. | Cùng ngày vẫn cho chuyển tay; đóng rồi mở lại N3 và khôi phục giữ nhóm roundtrip được. |
| 44 | #601 → #630 | ĐÃ SỬA | Gỡ migration 0009 trên bản chép → test DR6-44 đỏ, SCAN appointments thay INDEX. Trên tải: 100 KH xóa 33,052 ms, 400 KH 66,515 ms, cùng máy lượt 1 là 211/815 ms. | Bỏ 3 chỉ mục trên cùng DB: 262,709/884,643 ms; assert mọi dòng trước/sau bằng nhau. Migration v9 có dữ liệu giữ đủ hàng/FK. |
| 49 | #604 → #640 | SỬA MỘT PHẦN | NFC, Cf, NBSP, giữ xuống dòng KYC đã đúng; mutant R49: 5 test đỏ. U+0085 thuộc Unicode White_Space vẫn giữ nguyên, tên chỉ U+0085 được nhận, backup cũng nhận. | CX2-A2; K20 yêu cầu mọi khoảng trắng Unicode. |
| 50 | #604 → #640 | ĐÃ SỬA | Import conflict 2 / 2.0 → BACKUP_INVALID; mutant bỏ distinct: 3 test đỏ. | Test 2/3/4 được nhận; so giá trị JSON đã đọc, không so chữ. |
| 51 | #604 → #640 | ĐÃ SỬA | Probe vai trò/giới tính sai → INVALID_CHOICE; nhóm sai → INVALID_TRANSITION. Gỡ requireChoice → 2 test lỗi CHECK thay mã. | Nhánh vai trò đang dùng ưu tiên lỗi PERSON_IN_USE hợp lý, không raw CHECK. |
| 52 | #604 → #640 | ĐÃ SỬA | Test mở DB v10 có dữ liệu giữ hàng/FK xanh. Gỡ CHECK people_team_none ở migration 0010 → 2 test đỏ. | Nhập backup cũng bị CHECK chặn trước luật 9; không cần mã rule. |
| 54 | #607 → #619; #604 → #640 | ĐÃ SỬA | Golden lich-hen.md có đoạn L-09/A09 nói rõ dữ liệu trước DR-47; comment model/count/seed khớp luật không RE. Unit coordinator + golden đều xanh. | Quyết định là ghi chú, giữ fixture; không đột biến văn bản đã được Owner chấp nhận. |
| 59 | #606 → #644 | ĐÃ SỬA | Chạy lại hash-status, hash-separator, M15, M10, N19 trên bản chép: lần lượt 2/2/1/2/1 test đỏ; 0 sống. | Toàn chiến dịch: 18/18 mutant có test đỏ; R51 là lỗi CHECK sai loại theo test, không lỗi import/harness. |

## 3. Phạm vi đã đọc

- Mã sản phẩm của cả domain và db: ngày/kỳ/tiền/số, vòng đời/nhóm, 3 đường gom chỉ số, KYC/hash/cổng/bằng chứng, schema, lệnh đọc/ghi, transaction/cache/persist/quickCheck, backup/14 luật, seed và dữ liệu tĩnh, Thùng rác/count, settings/ULID, barrel export và cấu hình. Bản kê file/dòng/SHA-256 ở phụ lục và A/inventory.json; đây là 116 file Git theo dõi, gồm tài liệu/cấu hình/meta. Cỡ theo quy tắc size-report của gói: 7.867 SP / 12.807 test / 311 dòng sinh / 98 file (baseline chung); hai cách đếm khác nhau, không cộng nhầm metadata vào SP.
- 42 file test: đã chạy toàn bộ 1.282 ca; đọc cấu trúc ca và seam (A/test-map.json), đọc kỹ toàn bộ phần diff test mới, các test D7/D10/E18–E20, chuyển RE, backup-conflict/text/integer, migration có dữ liệu, hash golden, roundtrip. Bản chép chạy nền 9 file/351 test xanh trước khi đột biến. Không đồng nhất “test xanh” với bảo đảm không có lỗi: 3 phát hiện dưới đều lọt test hiện tại.
- Diff sửa 8855345..4217ed4: 40 file trong hai package, +4.057/−132 dòng (gồm 2 snapshot lớn sinh tự động). Đã xét phần của #614/615, #616, #618, #630, #640, #644, comment/golden #619; phần quickCheck #620 và seed prompt #628 ở ranh giới A. Không gọi review-pr vì đây là deep review đóng phase chỉ đọc.
- Nguồn đúng: CLAUDE.md gốc + hai package, CONTEXT.md; Phase 3 §4/§6, Phase 4, Phase 6 §4.1/§4.2/§5; ADR-0007/0008; golden chi-so, kh-theo-nhom, kyc, lich-hen. common/plan.md §4 và L2.1–L2.11, known.md, fixes.md (các Issue/PR liên quan A), baseline.md. Đối chiếu tổng hợp lượt 1 §3–§5/§7/§9 và báo cáo A nguyên gốc ba bên ở cả hai máy trong docs/reviews/raw/2026-10-15; nguồn đột biến M31/M15/M10/N19 lấy ở phụ lục raw, không đọc báo cáo lượt 2 của bên khác.
- Không chạy UI/exe hay trình duyệt trong A; mọi kết luận ở đây là về lệnh/luật DB/domain. Các dòng R nhiều gói ghi rõ phần A; D/E kiểm UI, B kiểm đường mở file, F tổng hợp và đo app.

## 4. Kịch bản mới đã thử

Các ca nguyên thủy E18–E20/D7/D10 được ghi ở bảng R, không tính thay cho các chuỗi mới dưới đây. Lệnh probe đều dùng API lệnh DB; không SQL dựng dữ liệu màn. SQL chỉ dùng trong migration, so cấu trúc, bỏ chỉ mục DB tạm và tiêm lỗi COMMIT.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | Bàn giao A→B→C có lịch hôm nay, quá hạn, tương lai, đã hủy, Dời lịch và mắt xích mới; xóa/khôi phục KH rồi lịch xóa riêng; ghi kết quả quá hạn kèm hẹn tiếp | preview 2; chỉ 2 lịch Dự kiến chuyển; lịch gốc Dời giữ A, mắt xích mới C; lịch xóa phục hồi A; hẹn tiếp C; backup nhập lại được | — |
| 2 | Bàn giao xong phần UPDATE rồi COMMIT ném lỗi có chủ đích | Rollback cả KH/lịch, export tables nguyên; không báo thành công giả | — |
| 3 | Bàn giao, xóa RE cũ sau khi không còn bản ghi sống; thử bàn giao tới RE khác đã xóa; phục hồi lịch của RE cũ | Tới RE đã xóa → PERSON_NOT_FOUND và DB nguyên; listTrash/lệnh khôi phục cùng chặn RE cũ; khôi phục RE trước rồi lịch được; future vẫn RE mới | — |
| 4 | Xóa cuộc gặp giữ N2 → xóa cuộc gặp đã đưa KH lên N2 → thử khôi phục lịch giữ nhóm → phục hồi theo đúng thứ tự; lặp vòng nữa | STAGE_NOT_ON_DAY khi nguồn N2 đã rút; khôi phục move trước rồi kept được; invariants/roundtrip xanh | — |
| 5 | Cuộc gặp giữ N3 đã xóa; cùng ngày chuyển LOST rồi mở lại N3; phục hồi cuộc gặp | Không thêm move; cùng ngày hợp lệ, roundtrip xanh | — |
| 6 | Cf nằm giữa chữ và dấu NFD; NBSP/tab; ghi chú KYC CRLF + dòng trống; export/import | Tên “Bình Minh”; ghi chú “Dòng 1\n\nDòng 2”; không đổi nội dung qua backup | — |
| 7 | U+0085 giữa tên và đứng một mình ở tên, ghi chú, giá trị occupation; nhập lại backup | Không gộp/rỗng; lệnh nhận và cổng tính hạng mục occupation là đã có; import nhận | CX2-A2 |
| 8 | Xóa move rồi chuyển tay cùng ngày, cùng mili giây | listTrash không chặn; restore OK, KH N1 bị về N2; roundtrip vẫn nhận | CX2-A3 |
| 9 | Như 8 nhưng đồng hồ lúc chuyển tay lùi 1 s | Cũng lọt E20, KH về N2 | CX2-A3 |
| 10 | KH tạo 10/10 N3, lịch 05/10 giữ N3; chạy lệnh ở nguồn lượt 1 và lượt 2 | Lượt 1 OK/MET; lượt 2 TRANSITION_BEFORE_LATEST/SCHEDULED | CX2-A1 |
| 11 | Backup từ lệnh nhập bù hợp lệ lượt 1 → import hai bản; xóa/khôi phục bản ghi | Lượt 1 import OK; lượt 2 BACKUP_INVALID rule 4; restore STAGE_NOT_ON_DAY | CX2-A1 |
| 12 | Toàn bộ MET giữ nhóm sống trên tải lượt 2, xóa→khôi phục từng lịch; kiểm bất biến rồi import backup | 4.249/4.249 phục hồi, 0 lỗi; khác mẫu 4.254 của #614 vì dữ liệu tải sinh lại sau #616/#640 | — |
| 13 | 2 seed 0x2c2026 / 0xc0ffee × 1.500 bước, 13 lệnh gồm bàn giao/hẹn tiếp/xóa/khôi phục/KYC/HĐ; invariants sau từng bước | 3.000 bước qua; 1.058/1.092 bước không bị từ chối (gồm bước không có bản ghi để thao tác), 442/408 bị luật chặn; backup cả hai nhập được | — |
| 14 | Migration từ v9/v10 có dữ liệu, nhân sự đủ 5 vai trò, đã xóa, coordinator/reviewer; so cả 11 snapshot với SQL thực | Unit xanh, dữ liệu/FK giữ; 13 bảng/109 cột/18 FK/10 index/28 CHECK ở v11; quickCheck sạch | — |
| 15 | Bỏ 3 chỉ mục trên cùng DB tải, Thùng rác 15/75/100/150/300/400 KH xóa | Mọi dòng/effect/blocked/order bằng nhau (assert); nhanh hơn khi có index | — |
| 16 | 49 góc nhìn trên tải: gom chỉ số/đếm lịch/ảnh chụp nhóm so từng scope; byMark/series so từng mốc | Mọi assert bằng nhau; không đổi ý nghĩa sau các sửa | — |

Nguồn: A/scenarios.mjs (14/14 ca ghi ok), A/edges.mjs, A/precreation.mjs, A/load-fuzz.mjs, A/perf.mjs, A/snapshots.mjs và log cùng tên.


## 5. Phát hiện mới

### CX2-A1 — Nhập bù MET giữ nhóm trước ngày tạo KH bị chặn, trái K2 còn hiệu lực

ID: CX2-A1
Mức: Medium
Trục: C
Vị trí: packages/db/src/appointments.ts:407; packages/db/src/backup-validation.ts:223; packages/db/src/appointments.ts:308 (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-04 · mới do đợt sửa PR #616
Kịch bản: 10, 11 (precreation.mjs)
Mô tả: KH được tạo 10/10 ở N3, ghi cuộc gặp 05/10 giữ N3. Ở lượt 1 lệnh và nhập backup nhận đúng quyết định DR-43; lượt 2 stageOnDay trả null rồi cố ghi chuyển nhóm trước transition tạo KH, nên từ chối. Luật nhập backup mới và kiểm khôi phục cũng chặn ca này. K2 của common/known.md vẫn xác nhận đây là nhập bù hợp lệ, không thêm luật.
Tái hiện / bằng chứng: node A/precreation.mjs: new-command TRANSITION_BEFORE_LATEST / SCHEDULED; old-command OK / MET; old-import OK; new-import BACKUP_INVALID rule 4; delete OK rồi restore STAGE_NOT_ON_DAY. Ba nguồn lượt 1 lấy bằng git show 8855345, lưu nguyên và bản chỉ đổi đường import ngoài repo. Không chèn SQL để dựng dữ liệu, không kết luận về UI.
Ảnh hưởng: RE nhập bù một cuộc gặp có thật trước ngày tạo hồ sơ; cũng không thể khôi phục hay nhập lại dữ liệu nhập bù đã được phép theo K2. Không mất dữ liệu khi bị từ chối. Các trạng thái NO_SHOW / CANCELLED và HĐ không bị quy tắc mới tương tự, nên riêng MET đổi hành vi.
Đề xuất: đưa ngoại lệ nhập bù K2 vào cùng luật ghi / nhập / khôi phục và test trước ngày transition đầu; không tự sửa quyết định/golden cho khớp code. Cần Owner xử lý mâu thuẫn K2 ↔ luật ngày mới ở phiên tổng hợp. Ước lượng dưới 100 dòng SP + test, trong 400 dòng.

### CX2-A2 — Hàm chữ chung bỏ sót U+0085 thuộc Unicode White_Space

ID: CX2-A2
Mức: Low
Trục: E
Vị trí: packages/domain/src/text.ts:25 (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-49 · có từ trước, lượt 1 bỏ sót U+0085; phần còn thiếu của PR #640 / K20
Kịch bản: 7 (scenarios.mjs, edges.mjs)
Mô tả: regex JavaScript \s không bao gồm U+0085 (NEXT LINE), trong khi K20 yêu cầu gộp mọi khoảng trắng Unicode. Vì vậy normalizeText('Bình\u0085Minh') không thành 'Bình Minh', và tên chỉ '\u0085' không bị coi là rỗng.
Tái hiện / bằng chứng: node A/scenarios.mjs: unicodeWhiteSpace=true, stored và normalized giữ U+0085, createTeam({name:'\u0085'}) → OK, export/import roundtrip=true. edges.mjs còn xác nhận ghi chú chỉ U+0085 và occupation chỉ U+0085 được nhận, cổng tính OCCUPATION_INCOME là đã có; backup nhận lại. Cf/NFC/NBSP ở cùng probe đúng; mutant R49 gỡ các bước mới làm 5 test hiện có đỏ.
Ảnh hưởng: cần chuỗi dán chứa ký tự hiếm; lệnh và nhập backup đều cùng bỏ sót, trái phạm vi K20. Không suy ra lỗi hiển thị khi chưa chạy màn.
Đề xuất: dùng lớp Unicode White_Space cùng U+FEFF theo luật đã chốt trong hàm chung; bổ sung ca U+0085 cho tên/giá trị/ghi chú và import. Khoảng 5–15 dòng SP + test.

### CX2-A3 — E20 dùng dấu thời gian để phân thứ tự, lọt khi thời gian bằng nhau hoặc lùi

ID: CX2-A3
Mức: Low
Trục: D
Vị trí: packages/db/src/customers.ts:286 (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-03 · biến thể gần, mới do PR #614
Kịch bản: 8, 9 (scenarios.mjs, edges.mjs)
Mô tả: E20 phải chặn chuyển nhóm cùng ngày được ghi sau lần xóa, nhưng checkTransition chỉ coi là sau khi latest.createdAt > recordedAfter. Hai thao tác có cùng mili giây hoặc đồng hồ lùi làm điều kiện sai dù seq cho biết thao tác chuyển tay mới hơn.
Tái hiện / bằng chứng: node A/scenarios.mjs, cùng seam withSources của DB: ghi cuộc gặp 02/10 N3→N2; cố định now=2026-10-17T05:00:05.000Z khi xóa và chuyển tay cùng ngày N3→N1; restoreAppointment trả OK, KH thành N2 thay vì TRANSITION_BEFORE_LATEST / giữ N1. edges.mjs thử thêm đồng hồ chuyển tay lùi 1 s: listTrash không chặn, lệnh vẫn OK và KH về N2. Backup sau đó vẫn nhập được. E20 thông thường với đồng hồ tăng trả đúng lỗi; mutant R03 bỏ điều kiện bị test E20 giết.
Ảnh hưởng: điều kiện hiếm ở lệnh gọi nhanh / độ phân giải đồng hồ hoặc đồng hồ bị chỉnh lùi; chưa có chứng cứ người dùng thao tác UI hai bước trong cùng mili giây. Vì vậy Low, không nâng thành lỗi thao tác bình thường.
Đề xuất: phân biệt thứ tự ghi bằng seq hoặc mốc logic ổn định gắn lần rút, có test now bằng nhau và lùi; giữ luật E20 cho cả listTrash/lệnh. Cần cân nhắc mô hình dữ liệu ở phiên sửa; ước lượng dưới 100 dòng SP, có thể cần schema.

## 6. Bloat

| Đã chạy / đọc | Dữ liệu / phạm vi | Kết quả | ID |
|---|---|---|---|
| tsc --noEmit --noUnusedLocals --noUnusedParameters cho domain và db | Hai tsconfig, không sửa cấu hình | Cả hai exit 0, log rỗng | — |
| pnpm lint:deps | Toàn repo | 315 module, 1.277 phụ thuộc, 0 vi phạm | — |
| pnpm codemap:check | Export map hiện tại | Export maps are up to date | — |
| AST export + rg tham chiếu | 37 file nguồn, 341 export | 44 ứng viên không có tham chiếu ngoài file; gồm type suy ra và hàm tự dùng trong file, không phải 44 dead export. Sáu hàm chỉ test dùng getAppointment/getPolicy/getTeam/getPerson/markKycVersionMaterial/monthToDate đã là KNOWN DR6-66 | KNOWN, không phát hiện mới |
| Đọc lặp cấu trúc updateRow / seq / find-live, tính ngày seed và bộ loại dấu | domain/db | Các nhóm đã ghi DR6-67; không có chi phí mới được đo để báo lại | KNOWN |
| Bundle/exe tham chiếu common/baseline, không tự build | Cùng SHA, Home PC | JS/CSS 2.382.036 B (+17.753 so lượt 1), gzip 702.109 B (+5.038); exe 5.404.672 B (−9.728). Không quy toàn bộ delta cho A | — |

Không có phát hiện B mới. Không cài công cụ. Không đề xuất refactor riêng cho việc đã hoãn; khi Owner mở lại DR6-66/67 thì dùng test domain/db/golden/roundtrip giữ hành vi, không sửa golden.

## 6b. Hiệu năng

Máy DESKTOP-KDURKJP, i9-12900K, Node v24.20.0. Lần hoàn chỉnh bắt đầu 17/10/2026 02:07:25 +07:00. Unit/đột biến của Codex đã xong; không chạy build/exe; không kiểm nội dung hay tiến trình reviewer khác nên tải của bên khác chưa biết. Đo Node/sql.js, một lượt làm nóng + 5 lượt, GC ngoài khoảng đo. Không quy thời gian hàm Node thành độ trễ UI. Dữ liệu tải đúng common/load/load-2026-10-12-seed6.p2cbackup, 16.034.517 B; tables hash 1c306cfb8203409337a5fa33c48306694581cb70355eb5526e4cf4f543589591. Mốc DB cố định 17/10; dữ liệu tải anchor 12/10. Không dùng file lượt 1.

So cùng máy: tổng hợp lượt 1 §7.1 (Home PC), thêm số Codex A Home PC khi có cùng hàm. Ngưỡng hàm Node Phase 4 được Phase 6 giữ để tham chiếu; không lấy ngưỡng backup.import 500 ms của bước UI xác nhận để so importBackup dựng/kiểm toàn DB. Xấu hơn chỉ khi >20% và >10 ms; không có dòng dưới xấu hơn theo luật đó.

| Hàm | Lượt 2 trung vị ms (min–max) | Lượt 1 Home PC | Ngưỡng / kết quả | ID |
|---|---:|---:|---|---|
| importBackup | 726.868 (724.335–751.513) | 729 (F Codex); A 1.588,177 | ≤ 1.100 ms: đạt | — |
| listAppointments | 48.788 (47.952–49.354) | 47,7 (F Codex); A 118,423 | ≤ 65 ms: đạt | — |
| countRecords | 5.941 (5.328–7.016) | 4,9 (F Codex); A 11,156 | ≤ 15 ms: đạt | — |
| listTrash | 25.19 (24.954–27.899) | 45,6 (F Codex); A 128,136 | giảm; Node, không coi là thời gian màn | — |
| listCustomers | 5.64 (4.8–6.37) | 17,835 (A) | không xấu hơn / chỉ ghi số | — |
| listStageTransitions | 9.868 (9.787–10.055) | 29,827 (A) | không xấu hơn / chỉ ghi số | — |
| listPolicies | 7.642 (6.495–8.69) | 23,020 (A) | không xấu hơn / chỉ ghi số | — |
| periodMetrics | 2.069 (1.667–2.208) | 6,243 (A) | không xấu hơn / chỉ ghi số | — |
| periodMetricsByScope | 2.233 (1.804–2.633) | 5,804 (A) | không xấu hơn / chỉ ghi số | — |
| periodMetricsByMark | 1.085 (0.984–1.63) | 4,369 (A) | không xấu hơn / chỉ ghi số | — |
| appointmentCountsByScope | 1.634 (1.409–1.874) | 5,018 (A) | không xấu hơn / chỉ ghi số | — |
| stageSnapshotByScope | 1.261 (1.198–1.292) | 4,260 (A) | không xấu hơn / chỉ ghi số | — |
| stageSnapshotSeries | 2.662 (2.497–2.84) | 6,304 (A) | không xấu hơn / chỉ ghi số | — |
| exportBackup | 167.669 (167.211–167.893) | 424,334 (A) | không xấu hơn / chỉ ghi số | — |
| handover-roundtrip | 0.748 (0.723–0.874) | chưa có cùng phép đo | chỉ ghi số, chưa có mốc so | — |

Hai bộ số Node lượt 1 A/F cùng máy khác mức làm nóng/nhiễu, nên giữ riêng tên nguồn, không trộn trung bình. Ưu tiên so F ở các hàng có số tổng hợp; so A cho các hàm chỉ A có. Các phép gom đo cả 49 scope. Lệnh bàn giao+đếm ở DB tải đo trong outer transaction rollback, không gồm lưu file.

| KH trong Thùng rác | Dòng trả | Có index, ms (min–max) | Bỏ index, ms (min–max) | Cùng dòng trước/sau? | Lượt 1 Home PC |
|---:|---:|---:|---:|---|---|
| 15 | 113 | 25.004 (24.734–25.37) | 85.003 (83.914–86.963) | Có, assert deepEqual | — |
| 75 | 173 | 31.329 (30.702–32.237) | 210.791 (206.853–216.518) | Có, assert deepEqual | — |
| 100 | 198 | 33.052 (32.224–33.778) | 262.709 (259.173–272.185) | Có, assert deepEqual | 211 ms |
| 150 | 248 | 39.96 (39.139–41.048) | 364.135 (361.597–366.433) | Có, assert deepEqual | — |
| 300 | 398 | 55.098 (54.596–56.596) | 674.164 (670.646–675.063) | Có, assert deepEqual | — |
| 400 | 498 | 66.515 (65.292–69.095) | 884.643 (874.034–937.394) | Có, assert deepEqual | 815 ms |

DR6-44: cải thiện 100 KH từ 211 xuống 33,052 ms (~6,4 lần), 400 KH từ 815 xuống 66,515 (~12,3 lần) so số lượt 1 cùng máy. Kiểm đối chứng trên đúng tải lượt 2 còn cho ~8,0 và ~13,3 lần. Dữ liệu giữa hai lượt không giống hoàn toàn vì siết luật K1; khẳng định giữ hành vi dựa vào assert trước/sau chỉ mục trên cùng DB, unit cũ và migration giữ hàng. Không có phát hiện P mới. Các chỉ số exe của baseline (ví dụ app.open-data/reload chậm hơn cùng máy) thuộc B/F, không dùng để suy nguyên nhân từ A.


## 7. Đếm mức × trục

Mỗi phát hiện tính đúng một trục chính; các DR6 đã sửa chỉ nằm bảng R, không đếm lại.

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Low | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |

CONFIRMED 3/3; PLAUSIBLE 0/3 (0%). CX2-A1 xác nhận hồi quy hành vi và mâu thuẫn tài liệu, không tự quyết ưu tiên hai quyết định Owner. CX2-A3 chỉ Low do biên đồng hồ hiếm, chưa chứng minh đường UI bình thường. Bảng R đủ 12 DR6: 10 ĐÃ SỬA, 1 SỬA MỘT PHẦN (49), 1 HỒI QUY (04); không kết luận thay các phần UI của D/E hay tổng hợp v1.0 của F.

## 8. Đã xét, không thấy thêm theo trục

| Trục | Đã chạy / đọc và kết quả ngoài các phát hiện trên |
|---|---|
| R | Đủ 12 dòng; bản chép baseline 351 xanh, 18/18 đột biến chết vì sai kết quả/mã lỗi mong đợi. Các sửa #644 bắt được toàn bộ 5 đột biến hash/status, separator, M15, M10, N19 đã thử. Không khẳng định chiến dịch bao phủ mọi lỗi. |
| E | 3.000 bước với 13 loại lệnh, hai seed; nhiều vòng rút/khôi phục, RE xóa, chuyển cùng ngày qua LOST/N3; 4.249 giữ nhóm trên tải. Không có bất biến hỏng trong các chuỗi hợp lệ, ngoài các biên đã nêu. |
| C | So định nghĩa RF/RE/team, thời điểm nhóm, 4 nhóm lịch và ảnh chụp với spec/golden. 49 scope và mốc trả bằng hàm chuẩn. Golden L-09 có ghi chú đúng quyết định; không đề xuất đổi fixture. |
| D | Transaction rollback khi từ chối và COMMIT lỗi; roundtrip sau chuỗi; migration từ v9/v10 có dữ liệu; mọi snapshot khớp schema và quickCheck sạch. Không thấy mất dữ liệu hay FK gãy. |
| G | Gate deterministic và material/hash của domain đọc theo ADR-0008, golden K01–K15 + test xung đột; db chỉ nhận schema AI qua module được phép; test phân tích/history/backup xanh. Không gọi AI, không thẩm định chất lượng output/guardrail riêng của C. |
| S | Import số lẻ token, giá trị conflict trùng, enum sai, NUL/surrogate, version mới, rollback trong unit. staging đóng ở finally; identifier SQL quote theo schema/không nối input người dùng. Hash KYC nhập snapshot S-1 vẫn KNOWN K12, không báo lại. Không đọc key. |
| P | Bảng riêng ở §6b; so đúng máy, hash đúng, không suy từ độ phức tạp. Chỉ mục cải thiện rõ và giữ dòng. Không có phát hiện P mới. |
| B | tsc/noUnused, codemap, lint:deps, 341 export; 44 ứng viên đã lọc theo type/self-use. Hàm chỉ test và code lặp là KNOWN DR6-66/67; không có chi phí mới để báo lại. |
| T | Đọc diff test PR, các seam/golden/roundtrip; chạy unit 1.282 + baseline bản chép 351; 18 đột biến chết. Khoảng trống mới trước-ngày-tạo, Unicode White_Space U+0085 và đồng hồ trùng/lùi đi cùng phát hiện sản phẩm, không tách thêm lỗi test để tăng số. |
| A | Domain formatting ngày/tiền/số và tên dùng chung, DB trả mã lỗi; chuỗi SYSTEM note là dữ liệu đã chấp nhận. Không có UI ở A để kết luận focus/aria/tương phản; không thấy lỗi i18n mới tại ranh giới đã đọc. |


## 9. Phụ lục bằng chứng

Mọi file dưới C:/workspace/deep-review-1-6-r2/codex/A/. Các lệnh Node chạy từ worktree nhưng chỉ ghi kết quả ở A; không patch repo. SQL thay đổi chỉ DB bộ nhớ / bản chép. Các bản chép đột biến đã trả về nguyên nguồn sau mỗi lần chạy; mutant-<id>.txt giữ nguồn sai riêng để tái hiện.

| Lệnh / file | Kết quả |
|---|---|
| pnpm exec vitest run packages/domain packages/db --maxWorkers=2 → unit-baseline.log | 42 file / 1.282 test, 72,23 s, xanh |
| node A/mutations.mjs → mutations.log + mutation-results.json | Baseline 9 file/351 test, 52,62 s xanh; 16 mutant đầu đều đỏ |
| node A/mutations-extra.mjs → mutations-extra.log | Thêm 2 mutant đỏ; tổng 18/18, 0 sống |
| node A/scenarios.mjs → scenarios.log | 14/14 ca ok; chữ U+0085 và E20 đồng hồ trùng thể hiện khoảng trống, không bị hiểu là “không thấy lỗi” |
| node A/edges.mjs → edges.log | 4 kết quả: clock 0/−1000 ms, KYC U+0085, RE đã xóa |
| node A/precreation.mjs → precreation.log | Bằng chứng đối chiếu trước/sau của CX2-A1; r1-original-* giữ git show nguyên văn, r1-* chỉ đổi import; không phải một worktree đầy đủ ở SHA lượt 1 |
| node A/load-fuzz.mjs → load-fuzz.log | 4.249/4.249 + 3.000 bước + backup/invariant xanh |
| node --expose-gc A/perf.mjs → perf.log + perf-results.json | 5 lần/hàm; tải đúng hash; bảng §6b |
| node A/snapshots.mjs → snapshots.log | 11/11 snapshot khớp bảng/cột/kiểu/notNull/FK/index/CHECK, chuỗi prevId đúng; quickCheck sạch |
| node A/bloat.mjs → bloat.log, export-refs.json, inventory.json, test-map.json | Kê 116 file/hash, 341 export; không cài công cụ |
| tsc-domain.log, tsc-db.log, lint-deps.log, codemap.log | Các kiểm chỉ đọc exit 0 |

Hai lần sửa lỗi harness trước khi có kết quả hoàn chỉnh (cú pháp Unicode/API export và SAVEPOINT ngoài transaction) chỉ ở thư mục kết quả; không coi lỗi harness là phát hiện sản phẩm. Báo cáo lấy log chạy hoàn chỉnh cuối. Không chạy lại full verify/e2e/Rust vì baseline đã có ở SHA ghim; không chiếm cổng 4173, không build bundle, không đọc/gọi AI thật.

### Đột biến trên bản chép

| ID | Test đỏ | Kết quả | Test bắt |
|---|---|---|---|
| R01 | Tests  1 failed  /  1 passed  /  25 skipped (27) | KILLED (exit 1) |  packages/db/src/trash.test.ts > listTrash: appointments (TR-2, TR-3, TR-5) > E18: restores a met appointment that kept the stage, though the stage changed after its day |
| R03 | Tests  1 failed  /  1 passed  /  25 skipped (27) | KILLED (exit 1) |  packages/db/src/trash.test.ts > listTrash: appointments (TR-2, TR-3, TR-5) > E20: blocks a met appointment once the stage was moved on its day after the deletion |
| R04 | Tests  2 failed  /  5 passed  /  57 skipped (64) | KILLED (exit 1) |  packages/db/src/appointments.test.ts > the stage on the meeting day > H·CL-E4: records a late meeting as kept only in the stage of its day;  packages/db/src/appointments.test.ts > the stage on the meeting day > H·CL-A2: refuses moving a kept meeting before the change that took the customer there |
| R05a | Tests  1 failed  /  6 passed  /  57 skipped (64) | KILLED (exit 1) |  packages/db/src/appointments.test.ts > the stage on the meeting day > refuses a stage change dated before a met appointment already recorded (5d) |
| R05b | Tests  1 failed  /  1 passed  /  62 skipped (64) | KILLED (exit 1) |  packages/db/src/appointments.test.ts > the stage on the meeting day > H·CL-F3: keeps the move of a meeting while a later meeting kept the stage it moved to (D7) |
| R02 | Tests  2 failed  /  15 passed (17) | KILLED (exit 1) |  packages/db/src/customers.test.ts > customers > hands the planned appointments over to a new RE, and nothing else (5c);  packages/db/src/customers.test.ts > customers > hands over only when the RE changes, and saves nothing when refused |
| R44 | Tests  1 failed  /  30 skipped (31) | KILLED (exit 1) |  packages/db/src/database.test.ts > migrating a saved database > adds the lookups of a customer and an appointment to a database with data (DR6-44) |
| R49 | Tests  5 failed  /  1 passed (6) | KILLED (exit 1) |  packages/domain/src/text.test.ts > normalizeText > gives one line as the screens show it: one space per run of white space, trimmed (DR6-49);  packages/domain/src/text.test.ts > normalizeText > drops invisible format characters, so text with nothing to see is empty;  packages/domain/src/text.test.ts > normalizeText > composes (NFC), also a tone mark kept from its letter by a format character;  packages/domain/src/text.test.ts > normalizeNote > keeps the line breaks of a note and cleans each line as normalizeText (Owner 16/10/2026);  packages/domain/src/text.test.ts > normalizeNote > is empty when no line has anything to see |
| R50 | Tests  3 failed  /  2 passed  /  141 skipped (146) | KILLED (exit 1) |  packages/db/src/backup-invariants.test.ts > importBackup — rules across tables > refuses 7: a conflict of two facts with the same value, the current database unchanged;  packages/db/src/backup-invariants.test.ts > importBackup — rules across tables > refuses 7: a conflict of the same value written two ways, the current database unchanged;  packages/db/src/backup-invariants.test.ts > importBackup — rules across tables > refuses 7: a conflict of three facts, two with the same value, the current database unchanged |
| R51 | Tests  2 failed  /  3 passed  /  36 skipped (41) | KILLED (exit 1) |  packages/db/src/customers.test.ts > customers > refuses a gender or a stage outside their lists with a code;  packages/db/src/team.test.ts > people > refuses a role outside the list with a code, with a team or without |
| R52 | Tests  2 failed  /  29 skipped (31) | KILLED (exit 1) |  packages/db/src/database.test.ts > schema constraints > rejects an IS, BD or BDM with a team;  packages/db/src/database.test.ts > migrating a saved database > checks that an IS, BD or BDM has no team on a database with data (DR6-52) |
| R59-hash | Tests  2 failed  /  31 passed (33) | KILLED (exit 1) |  packages/domain/src/kyc.test.ts > KYC versions > keeps the stored hash of golden profile K10;  packages/domain/src/kyc.test.ts > KYC versions > keeps the stored hash of golden profile K14 |
| R59-hash-separator | Tests  2 failed  /  31 passed (33) | KILLED (exit 1) |  packages/domain/src/kyc.test.ts > KYC versions > keeps the stored hash of golden profile K10;  packages/domain/src/kyc.test.ts > KYC versions > keeps the stored hash of golden profile K14 |
| R59-M15 | Tests  1 failed  /  2 passed (3) | KILLED (exit 1) |  packages/db/src/counts.test.ts > countCustomerRecords (mockup 5f, spec Phase 6 TR-4, TR-9) > counts one RF for a met meeting moved to another day |
| R59-M10 | Tests  2 failed  /  4 passed  /  140 skipped (146) | KILLED (exit 1) |  packages/db/src/backup-invariants.test.ts > importBackup — rules across tables > refuses VALUE: a fraction of a prompt token, the current database unchanged;  packages/db/src/backup-invariants.test.ts > importBackup — rules across tables > refuses VALUE: a fraction of a completion token, the current database unchanged |
| R59-N19 | Tests  1 failed  /  26 passed (27) | KILLED (exit 1) |  packages/db/src/trash.test.ts > listTrash: appointments (TR-2, TR-3, TR-5) > E5: restores a met appointment whose stage change is no RF, and says so (DR6-59) |
| R02-next | Tests  1 failed  /  63 skipped (64) | KILLED (exit 1) |  packages/db/src/appointments.test.ts > recordOutcomeWithNext > books the next appointment for the RE now in charge of the customer |
| R03-kept-reapplied | Tests  1 failed  /  26 skipped (27) | KILLED (exit 1) |  packages/db/src/trash.test.ts > listTrash: appointments (TR-2, TR-3, TR-5) > E19: restores a met appointment that kept the stage, though moved by hand on its day |

R51 đỏ do CHECK thô thay vì DbError INVALID_CHOICE, được codeOf chủ động ném ra và test đánh dấu fail; đây là đột biến bị bắt, không phải lỗi import/config. Con số “killed:15” ở cuối mutations.log là bộ đếm sơ bộ chỉ tìm từ AssertionError, bỏ sót R51; mutation-results.json và bảng này đếm đúng 18/18 dựa trên từng kết quả/test. M31, M31b, M15, M10, N19 đều là đột biến code sản phẩm dưới test mới của #644.

### Bản kê file/dòng

Mã sản phẩm đọc theo file; test có bản đồ ca ở test-map.json và diff mới được đọc sâu như §3; metadata snapshot kiểm cấu trúc bằng probe, không coi JSON sinh tự động là code sản phẩm. Mỗi dòng ghi miền file hiện hữu 1..N, không phải khẳng định mỗi dòng test đã được thẩm định thủ công độc lập.

| File | Dòng | Cách xét |
|---|---:|---|
| packages/db/CLAUDE.md | 1–53 | Đọc cấu hình/tài liệu |
| packages/db/drizzle.config.ts | 1–7 | Đọc mã/ranh giới và probe liên quan |
| packages/db/migrations/0000_init.sql | 1–33 | Đọc SQL + chạy migration |
| packages/db/migrations/0001_customers_policies.sql | 1–86 | Đọc SQL + chạy migration |
| packages/db/migrations/0002_kyc.sql | 1–44 | Đọc SQL + chạy migration |
| packages/db/migrations/0003_kyc_append_only.sql | 1–22 | Đọc SQL + chạy migration |
| packages/db/migrations/0004_appointment_outcome_reviewer.sql | 1–6 | Đọc SQL + chạy migration |
| packages/db/migrations/0005_ai_analyses.sql | 1–35 | Đọc SQL + chạy migration |
| packages/db/migrations/0006_ai_analyses_append_only.sql | 1–11 | Đọc SQL + chạy migration |
| packages/db/migrations/0007_ai_analyses_chatgpt_web.sql | 1–40 | Đọc SQL + chạy migration |
| packages/db/migrations/0008_ai_analyses_append_only_rebuilt.sql | 1–12 | Đọc SQL + chạy migration |
| packages/db/migrations/0009_lookup_indexes.sql | 1–3 | Đọc SQL + chạy migration |
| packages/db/migrations/0010_people_team_none.sql | 1–19 | Đọc SQL + chạy migration |
| packages/db/migrations/meta/0000_snapshot.json | 1–203 | So schema/journal bằng snapshot probe + unit |
| packages/db/migrations/meta/0001_snapshot.json | 1–742 | So schema/journal bằng snapshot probe + unit |
| packages/db/migrations/meta/0002_snapshot.json | 1–1016 | So schema/journal bằng snapshot probe + unit |
| packages/db/migrations/meta/0003_snapshot.json | 1–1016 | So schema/journal bằng snapshot probe + unit |
| packages/db/migrations/meta/0004_snapshot.json | 1–1036 | So schema/journal bằng snapshot probe + unit |
| packages/db/migrations/meta/0005_snapshot.json | 1–1248 | So schema/journal bằng snapshot probe + unit |
| packages/db/migrations/meta/0006_snapshot.json | 1–1248 | So schema/journal bằng snapshot probe + unit |
| packages/db/migrations/meta/0007_snapshot.json | 1–1248 | So schema/journal bằng snapshot probe + unit |
| packages/db/migrations/meta/0008_snapshot.json | 1–1248 | So schema/journal bằng snapshot probe + unit |
| packages/db/migrations/meta/0009_snapshot.json | 1–1265 | So schema/journal bằng snapshot probe + unit |
| packages/db/migrations/meta/0010_snapshot.json | 1–1269 | So schema/journal bằng snapshot probe + unit |
| packages/db/migrations/meta/_journal.json | 1–83 | So schema/journal bằng snapshot probe + unit |
| packages/db/package.json | 1–24 | Đọc cấu hình/tài liệu |
| packages/db/src/ai-analyses.test.ts | 1–728 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/ai-analyses.ts | 1–337 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/appointments.test.ts | 1–1273 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/appointments.ts | 1–593 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/backup-engine.test.ts | 1–22 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/backup-invariants.test.ts | 1–1251 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/backup-validation.ts | 1–459 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/backup.test.ts | 1–498 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/backup.ts | 1–206 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/common.test.ts | 1–36 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/common.ts | 1–187 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/counts.test.ts | 1–129 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/counts.ts | 1–90 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/customers.test.ts | 1–475 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/customers.ts | 1–540 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/database.test.ts | 1–723 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/database.ts | 1–245 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/errors.ts | 1–128 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/golden-kyc.test.ts | 1–71 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/golden-metrics.test.ts | 1–188 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/ids.test.ts | 1–33 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/ids.ts | 1–34 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/index.ts | 1–98 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/kyc.test.ts | 1–736 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/kyc.ts | 1–560 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/migrations.ts | 1–43 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/policies.test.ts | 1–214 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/policies.ts | 1–154 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/reads.test.ts | 1–232 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/restore-roundtrip.test.ts | 1–117 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/schema.ts | 1–395 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/seed-data.ts | 1–306 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/seed-invariants.test.ts | 1–209 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/seed.test.ts | 1–370 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/seed.ts | 1–697 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/settings.test.ts | 1–39 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/settings.ts | 1–29 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/sql-raw.d.ts | 1–5 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/team.test.ts | 1–374 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/team.ts | 1–321 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/test-support.ts | 1–40 | Đọc mã/ranh giới và probe liên quan |
| packages/db/src/trash.test.ts | 1–566 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/db/src/trash.ts | 1–254 | Đọc mã/ranh giới và probe liên quan |
| packages/db/tsconfig.json | 1–8 | Đọc cấu hình/tài liệu |
| packages/domain/CLAUDE.md | 1–53 | Đọc cấu hình/tài liệu |
| packages/domain/package.json | 1–12 | Đọc cấu hình/tài liệu |
| packages/domain/src/appointment-counts.test.ts | 1–155 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/appointment-counts.ts | 1–116 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/compare.test.ts | 1–224 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/compare.ts | 1–80 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/customer-lifecycle.test.ts | 1–131 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/customer-lifecycle.ts | 1–63 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/evidence-level.test.ts | 1–121 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/evidence-level.ts | 1–52 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/golden/appointments.fixture.test.ts | 1–50 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/golden/appointments.fixture.ts | 1–133 | Đối chiếu golden + test qua DB/domain |
| packages/domain/src/golden/kyc.fixture.test.ts | 1–68 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/golden/kyc.fixture.ts | 1–271 | Đối chiếu golden + test qua DB/domain |
| packages/domain/src/golden/metrics.fixture.test.ts | 1–112 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/golden/metrics.fixture.ts | 1–245 | Đối chiếu golden + test qua DB/domain |
| packages/domain/src/golden/stage-snapshot.fixture.test.ts | 1–74 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/golden/stage-snapshot.fixture.ts | 1–222 | Đối chiếu golden + test qua DB/domain |
| packages/domain/src/index.ts | 1–117 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/kyc-catalog.test.ts | 1–81 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/kyc-catalog.ts | 1–155 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/kyc-fact.test.ts | 1–57 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/kyc-fact.ts | 1–73 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/kyc-gate.test.ts | 1–136 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/kyc-gate.ts | 1–85 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/kyc.test.ts | 1–398 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/kyc.ts | 1–164 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/model.ts | 1–110 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/money.test.ts | 1–269 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/money.ts | 1–188 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/name-order.test.ts | 1–30 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/name-order.ts | 1–10 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/number.test.ts | 1–72 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/number.ts | 1–43 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/period.test.ts | 1–755 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/period.ts | 1–434 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/pipeline-stage.test.ts | 1–15 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/pipeline-stage.ts | 1–8 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/stage-snapshot.test.ts | 1–272 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/stage-snapshot.ts | 1–169 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/stats-rf.test.ts | 1–201 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/stats.test.ts | 1–347 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/stats.ts | 1–272 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/src/text.test.ts | 1–44 | Unit + map ca; diff mới và seam liên quan đọc kỹ |
| packages/domain/src/text.ts | 1–40 | Đọc mã/ranh giới và probe liên quan |
| packages/domain/tsconfig.json | 1–7 | Đọc cấu hình/tài liệu |

### Nguồn probe / đột biến

Giữ nguyên nguồn dưới để báo cáo raw mang theo bằng chứng khi chuyển máy. Các đường dẫn absolute trỏ đúng worktree ghim và thư mục kết quả của phiên này. Tệp mutant đầy đủ không nhúng lặp lại vì mỗi mutation transform đã có trong source runner dưới đây.

#### runtime.mjs

```javascript
import {readFileSync} from 'node:fs';
import {registerHooks,createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
export const root='C:/workspace/Project-2C-review-2/';
const req=createRequire(root+'packages/db/package.json');
registerHooks({
 resolve(s,c,n){
  if(s==='@p2c/db')return n(pathToFileURL(root+'packages/db/src/index.ts').href,c);
  if(s==='@p2c/domain')return n(pathToFileURL(root+'packages/domain/src/index.ts').href,c);
  if(s==='@p2c/ai/schema')return n(pathToFileURL(root+'packages/ai/src/schema.ts').href,c);
  try{return n(s,c)}catch(e){if(!s.startsWith('.')){try{return n(pathToFileURL(req.resolve(s)).href,c)}catch{}throw e;}for(const ext of ['.ts','/index.ts']){try{return n(s+ext,c)}catch{}}throw e;}
 },
 load(u,c,n){if(!u.endsWith('?raw'))return n(u,c);return {format:'module',source:'export default '+JSON.stringify(readFileSync(new URL(u.slice(0,-4)),'utf8'))+';',shortCircuit:true};}
});
export const fromRepo=p=>import(pathToFileURL(root+p).href);
export const a=await fromRepo('packages/db/src/index.ts');
export const m=await fromRepo('packages/domain/src/index.ts');
export const validation=await fromRepo('packages/db/src/backup-validation.ts');
export const d=(day,month=10,year=2026)=>m.calendarDate(year,month,day);
export async function fresh(){
 let tick=0;const now=()=>new Date(Date.UTC(2026,9,17,5)+tick++);
 const db=await a.openDatabase({now});
 const team=a.createTeam(db,{name:'Probe'});
 const re=a.createPerson(db,{name:'RE A',role:'RE',teamId:team.id});
 const re2=a.createPerson(db,{name:'RE B',role:'RE',teamId:team.id});
 const re3=a.createPerson(db,{name:'RE C',role:'RE',teamId:team.id});
 const tl=a.createPerson(db,{name:'TL',role:'TL',teamId:team.id});
 return {db,team,re,re2,re3,tl,now};
}
export const code=fn=>{try{fn();return 'OK'}catch(e){return e.code??String(e)}};
export function invariants(db){validation.validateBackupValues(db);validation.validateBackupInvariants(db)}
export async function roundtrip(db,now){const file=a.exportBackup(db);const b=(await a.importBackup(file,{now})).db;b.sqlite.close();return true;}
```

#### scenarios.mjs

```javascript
import assert from 'node:assert/strict';
import {a,m,fresh,d,code,invariants,roundtrip} from './runtime.mjs';
const rows=[];
async function test(name,fn){try{const result=await fn();const row={name,ok:true,...result};rows.push(row);console.log(JSON.stringify(row));}catch(e){const row={name,ok:false,error:e.code??e.message,stack:e.stack};rows.push(row);console.log(JSON.stringify(row));}}
const outcome=stage=>({status:'MET',stageAfter:stage,nextStep:'Tiếp tục'});
function customer(s,stage='N3',date=d(1)){return a.createCustomer(s.db,{name:'KH',reId:s.re.id,stage,date});}
function book(s,c,date,re=s.re){return a.scheduleAppointment(s.db,{customerId:c.id,reId:re.id,date,triggerType:'OTHER',coordinatorIds:[s.tl.id]});}
await test('R01-E18-kept-stage-later-change',async()=>{const s=await fresh(),c=customer(s);const p=book(s,c,d(2));a.recordMeetingOutcome(s.db,p.id,outcome('N3'));a.changeStageManually(s.db,c.id,{to:'N2',date:d(5)});a.softDeleteAppointment(s.db,p.id);assert.equal(a.listTrash(s.db).find(t=>t.id===p.id)?.blocked,undefined);a.restoreAppointment(s.db,p.id);assert.equal(a.listStageTransitions(s.db,c.id).length,2);invariants(s.db);return {roundtrip:await roundtrip(s.db,s.now)};});
await test('R03-E19-same-day-kept',async()=>{const s=await fresh(),c=customer(s,'N2');const p=book(s,c,d(2));a.recordMeetingOutcome(s.db,p.id,outcome('N2'));a.softDeleteAppointment(s.db,p.id);a.changeStageManually(s.db,c.id,{to:'N3',date:d(2)});a.restoreAppointment(s.db,p.id);assert.equal(a.getCustomer(s.db,c.id).stage,'N3');invariants(s.db);return {roundtrip:await roundtrip(s.db,s.now)};});
await test('R03-E20-same-day-moved',async()=>{const s=await fresh(),c=customer(s);const p=book(s,c,d(2));a.recordMeetingOutcome(s.db,p.id,outcome('N2'));a.softDeleteAppointment(s.db,p.id);a.changeStageManually(s.db,c.id,{to:'N1',date:d(2)});const err=code(()=>a.restoreAppointment(s.db,p.id));assert.equal(err,'TRANSITION_BEFORE_LATEST');return {err};});
await test('R04-move-kept-across-manual-change',async()=>{const s=await fresh(),c=customer(s);const p=book(s,c,d(2));a.recordMeetingOutcome(s.db,p.id,outcome('N3'));a.changeStageManually(s.db,c.id,{to:'N2',date:d(5)});a.editMeetingOutcome(s.db,p.id,outcome('N3'),{date:d(6)});invariants(s.db);assert.equal(a.listStageTransitions(s.db,c.id).length,3);return {roundtrip:await roundtrip(s.db,s.now)};});
await test('R05-backdated-manual-and-delete-D7',async()=>{const s=await fresh(),c=customer(s);const p=book(s,c,d(2));a.recordMeetingOutcome(s.db,p.id,outcome('N2'));const q=book(s,c,d(4));a.recordMeetingOutcome(s.db,q.id,outcome('N2'));const before=a.exportBackup(s.db);const manual=code(()=>a.changeStageManually(s.db,c.id,{to:'N1',date:d(3)}));const deletion=code(()=>a.softDeleteAppointment(s.db,p.id));assert.equal(manual,'TRANSITION_BEFORE_MEETING');assert.equal(deletion,'STAGE_KEPT_BY_MEETING');assert.deepEqual(JSON.parse(before).tables,JSON.parse(a.exportBackup(s.db)).tables);return {manual,deletion};});
await test('R02-double-handover-rescheduled-deleted-customer',async()=>{const s=await fresh(),c=customer(s);const past=book(s,c,d(16));const today=book(s,c,d(17));const future=book(s,c,d(20));const moved=a.rescheduleAppointment(s.db,future.id,{date:d(21)});const removed=book(s,c,d(22));a.softDeleteAppointment(s.db,removed.id);const cancelled=book(s,c,d(23));a.recordMeetingOutcome(s.db,cancelled.id,{status:'CANCELLED'});const preview=a.previewHandover(s.db,c.id,s.re2.id);assert.equal(preview,2);a.updateCustomerProfile(s.db,c.id,{reId:s.re2.id});a.updateCustomerProfile(s.db,c.id,{reId:s.re3.id});const ids=Object.fromEntries(a.listAppointments(s.db,c.id).map(p=>[p.id,p.reId]));assert.equal(ids[past.id],s.re.id);assert.equal(ids[today.id],s.re3.id);assert.equal(ids[moved.id],s.re3.id);assert.equal(ids[future.id],s.re.id);assert.equal(ids[cancelled.id],s.re.id);a.softDeleteCustomer(s.db,c.id);assert.equal(code(()=>a.updateCustomerProfile(s.db,c.id,{reId:s.re.id})),'CUSTOMER_NOT_FOUND');a.restoreCustomer(s.db,c.id);a.restoreAppointment(s.db,removed.id);assert.equal(a.listAppointments(s.db).find(p=>p.id===removed.id).reId,s.re.id);const next=a.recordOutcomeWithNext(s.db,past.id,outcome('N3'),{date:d(24)});assert.equal(next.next.reId,s.re3.id);invariants(s.db);return {preview,roundtrip:await roundtrip(s.db,s.now)};});
await test('NEW-restore-kept-when-underlying-move-withdrawn',async()=>{const s=await fresh(),c=customer(s);const p=book(s,c,d(2));a.recordMeetingOutcome(s.db,p.id,outcome('N2'));const q=book(s,c,d(4));a.recordMeetingOutcome(s.db,q.id,outcome('N2'));a.softDeleteAppointment(s.db,q.id);a.softDeleteAppointment(s.db,p.id);const err=code(()=>a.restoreAppointment(s.db,q.id));assert.equal(err,'STAGE_NOT_ON_DAY');a.restoreAppointment(s.db,p.id);a.restoreAppointment(s.db,q.id);a.softDeleteAppointment(s.db,q.id);a.softDeleteAppointment(s.db,p.id);a.restoreAppointment(s.db,p.id);a.restoreAppointment(s.db,q.id);invariants(s.db);return {err,roundtrip:await roundtrip(s.db,s.now)};});
await test('NEW-same-day-closed-reopen-then-restore',async()=>{const s=await fresh(),c=customer(s);const p=book(s,c,d(2));a.recordMeetingOutcome(s.db,p.id,outcome('N3'));a.softDeleteAppointment(s.db,p.id);a.changeStageManually(s.db,c.id,{to:'LOST',date:d(2)});a.changeStageManually(s.db,c.id,{to:'N3',date:d(2)});a.restoreAppointment(s.db,p.id);invariants(s.db);return {roundtrip:await roundtrip(s.db,s.now)};});
await test('NEW-handover-rollback-after-kyc-error',async()=>{const s=await fresh(),c=customer(s);const p=book(s,c,d(20));const before=JSON.parse(a.exportBackup(s.db)).tables;const original=s.db.sqlite.run.bind(s.db.sqlite);let throwNext=true;s.db.sqlite.run=(sql,...args)=>{if(throwNext&&typeof sql==='string'&&sql.startsWith('COMMIT')){throwNext=false;throw Error('probe COMMIT failure');}return original(sql,...args)};const err=code(()=>a.updateCustomerProfile(s.db,c.id,{reId:s.re2.id}));s.db.sqlite.run=original;assert.deepEqual(JSON.parse(a.exportBackup(s.db)).tables,before);assert.equal(a.listAppointments(s.db).find(p=>p.id===p.id).reId,s.re.id);return {err};});
await test('R49-Unicode-NFC-lines-command-import',async()=>{const s=await fresh(),c=customer(s);const t=a.createTeam(s.db,{name:' Bi\u200b\u0300nh\u00a0  Minh '});const n=a.recordKycNote(s.db,c.id,{text:'  Dòng  1\r\n\r\n Dòng\u00a02\u200b ',date:d(2),facts:[{field:'occupation',value:' Bác\u00a0  sĩ\u200b '}]});invariants(s.db);return {storedName:t.name,note:n.note.text,roundtrip:await roundtrip(s.db,s.now)};});
await test('NEW-whitespace-U0085',async()=>{const s=await fresh();const name='Bình\u0085Minh';const t=a.createTeam(s.db,{name});const only=code(()=>a.createTeam(s.db,{name:'\u0085'}));const norm=m.normalizeText(name);return {unicodeWhiteSpace:/\p{White_Space}/u.test('\u0085'),stored:t.name,normalized:norm,only,roundtrip:await roundtrip(s.db,s.now)};});
await test('R50-conflicts-numeric-equivalent',async()=>{const s=await fresh(),c=customer(s);const n=a.recordKycNote(s.db,c.id,{text:'Gia đình',date:d(2),facts:[{field:'childrenCount',value:2}]});a.markKycConflict(s.db,c.id,{field:'childrenCount',value:3,noteId:n.note.id,date:d(3)});const file=JSON.parse(a.exportBackup(s.db));for(const f of file.tables.kyc_facts)f.value_json=f.value_json==='3'?'2.0':f.value_json;let err='OK';try{const b=(await a.importBackup(JSON.stringify(file),{now:s.now})).db;b.sqlite.close()}catch(e){err=e.code}assert.equal(err,'BACKUP_INVALID');return {err};});
await test('R51-invalid-enums-atomic',async()=>{const s=await fresh(),c=customer(s);const p=book(s,c,d(2));const errors=[code(()=>a.updatePerson(s.db,s.re3.id,{role:'ADMIN'})),code(()=>a.updateCustomerProfile(s.db,c.id,{gender:'X'})),code(()=>a.recordMeetingOutcome(s.db,p.id,outcome('N9')))];assert.deepEqual(errors,['INVALID_CHOICE','INVALID_CHOICE','INVALID_TRANSITION']);return {errors};});
await test('NEW-E20-clock-collision',async()=>{const s=await fresh(),c=customer(s);const p=book(s,c,d(2));a.recordMeetingOutcome(s.db,p.id,outcome('N2'));const fixed=()=>new Date('2026-10-17T05:00:05.000Z');const sources={now:fixed,random:b=>crypto.getRandomValues(b)};s.db.withSources(sources,()=>{a.softDeleteAppointment(s.db,p.id);a.changeStageManually(s.db,c.id,{to:'N1',date:d(2)});});const err=code(()=>a.restoreAppointment(s.db,p.id));return {err,current:a.getCustomer(s.db,c.id).stage,roundtrip:await roundtrip(s.db,s.now)};});
console.log(JSON.stringify({total:rows.length,passed:rows.filter(x=>x.ok).length,failed:rows.filter(x=>!x.ok).length}));
```

#### edges.mjs

```javascript
import assert from 'node:assert/strict';
import {a,m,fresh,d,code,invariants,roundtrip} from './runtime.mjs';
for(const offset of [0,-1000]){
 const s=await fresh(),c=a.createCustomer(s.db,{name:'KH',reId:s.re.id,stage:'N3',date:d(1)}),p=a.scheduleAppointment(s.db,{customerId:c.id,reId:s.re.id,date:d(2),triggerType:'OTHER'});
 a.recordMeetingOutcome(s.db,p.id,{status:'MET',stageAfter:'N2',nextStep:'Gửi'});
 const at=Date.parse('2026-10-17T05:00:05.000Z');
 s.db.withSources({now:()=>new Date(at),random:b=>crypto.getRandomValues(b)},()=>a.softDeleteAppointment(s.db,p.id));
 s.db.withSources({now:()=>new Date(at+offset),random:b=>crypto.getRandomValues(b)},()=>a.changeStageManually(s.db,c.id,{to:'N1',date:d(2)}));
 const block=a.listTrash(s.db).find(x=>x.id===p.id)?.blocked?.code??null;
 console.log(JSON.stringify({scenario:'E20-clock',offset,block,result:code(()=>a.restoreAppointment(s.db,p.id)),stage:a.getCustomer(s.db,c.id).stage,roundtrip:await roundtrip(s.db,s.now)}));s.db.sqlite.close();
}
{
 const s=await fresh(),c=a.createCustomer(s.db,{name:'KH',reId:s.re.id,stage:'N3',date:d(1)});
 const note=a.recordKycNote(s.db,c.id,{text:'\u0085',date:d(2),facts:[]}).note;
 a.confirmKycFact(s.db,c.id,{field:'occupation',value:'\u0085',noteId:note.id,date:d(2)});
 console.log(JSON.stringify({scenario:'U0085-kyc',note:note.text,fact:a.getKycProfile(s.db,c.id).facts[0].value,present:m.evaluateKycGate(a.getKycProfile(s.db,c.id).facts).presentCategories,roundtrip:await roundtrip(s.db,s.now)}));s.db.sqlite.close();
}
{
 const s=await fresh(),c=a.createCustomer(s.db,{name:'KH',reId:s.re.id,stage:'N3',date:d(1)}),schedule=date=>a.scheduleAppointment(s.db,{customerId:c.id,reId:s.re.id,date,triggerType:'OTHER'}),past=schedule(d(2)),future=schedule(d(20));
 a.softDeleteAppointment(s.db,past.id);a.updateCustomerProfile(s.db,c.id,{reId:s.re2.id});a.softDeletePerson(s.db,s.re.id);a.softDeletePerson(s.db,s.re3.id);
 const before=JSON.parse(a.exportBackup(s.db)).tables;
 const refused=code(()=>a.updateCustomerProfile(s.db,c.id,{reId:s.re3.id}));assert.equal(refused,'PERSON_NOT_FOUND');assert.deepEqual(JSON.parse(a.exportBackup(s.db)).tables,before);
 const block=a.listTrash(s.db).find(x=>x.id===past.id).blocked.code;assert.equal(block,'PERSON_NOT_FOUND');assert.equal(code(()=>a.restoreAppointment(s.db,past.id)),block);
 a.restorePerson(s.db,s.re.id);a.restoreAppointment(s.db,past.id);invariants(s.db);console.log(JSON.stringify({scenario:'handover-deleted-RE',refused,block,futureOnNewRE:a.listAppointments(s.db).find(x=>x.id===future.id).reId===s.re2.id,roundtrip:await roundtrip(s.db,s.now)}));s.db.sqlite.close();
}
```

#### precreation.mjs

```javascript
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {a,m,fresh,d,code,root,roundtrip} from './runtime.mjs';
const out='C:/workspace/deep-review-1-6-r2/codex/A/';
for(const file of ['appointments.ts','backup.ts','backup-validation.ts']){
 let text=execFileSync('git',['show','8855345:packages/db/src/'+file],{cwd:root,encoding:'utf8'});
 writeFileSync(out+'r1-original-'+file,text);
 text=text.replace(/from '(\.[^']+)'/g,(_,s)=>`from '${file==='backup.ts'&&s==='./backup-validation'?pathToFileURL(out+'r1-backup-validation.ts').href:pathToFileURL(root+'packages/db/src/'+s.slice(2)+'.ts').href}'`);
 writeFileSync(out+'r1-'+file,text);
}
const old=await import(pathToFileURL(out+'r1-appointments.ts').href);
const oldBackup=await import(pathToFileURL(out+'r1-backup.ts').href);
const outcome={status:'MET',stageAfter:'N3',nextStep:'Ghi bù'};
async function setup(){const s=await fresh();const c=a.createCustomer(s.db,{name:'KH nhập bù',reId:s.re.id,stage:'N3',date:d(10)});const p=a.scheduleAppointment(s.db,{customerId:c.id,reId:s.re.id,date:d(5),triggerType:'OTHER',coordinatorIds:[]});return {...s,c,p};}
const s=await setup();
console.log(JSON.stringify({scenario:'precreation-new-command',result:code(()=>a.recordMeetingOutcome(s.db,s.p.id,outcome)),status:a.listAppointments(s.db)[0].status}));
const t=await setup();
console.log(JSON.stringify({scenario:'precreation-old-command',result:code(()=>old.recordMeetingOutcome(t.db,t.p.id,outcome)),status:a.listAppointments(t.db)[0].status}));
const text=a.exportBackup(t.db);
writeFileSync(out+'precreation-from-r1-command.p2cbackup',text);
for(const [name,api]of [['old-import',oldBackup],['new-import',a]]){try{const b=(await api.importBackup(text,{now:t.now})).db;console.log(JSON.stringify({scenario:name,result:'OK'}));b.sqlite.close()}catch(e){console.log(JSON.stringify({scenario:name,result:e.code,params:e.params}));}}
console.log(JSON.stringify({scenario:'precreation-delete-restore',deleted:code(()=>a.softDeleteAppointment(t.db,t.p.id)),restored:code(()=>a.restoreAppointment(t.db,t.p.id)),block:a.listTrash(t.db).find(r=>r.id===t.p.id)?.blocked}));
```

#### load-fuzz.mjs

```javascript
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {a,m,fresh,d,code,invariants,roundtrip} from './runtime.mjs';
const out='C:/workspace/deep-review-1-6-r2/codex/A/';
const text=readFileSync('C:/workspace/deep-review-1-6-r2/common/load/load-2026-10-12-seed6.p2cbackup','utf8');
const now=()=>new Date('2026-10-17T05:00:00Z'),db=(await a.importBackup(text,{now})).db;
const moved=new Set(a.listStageTransitions(db).map(t=>t.appointmentId));
const kept=a.listAppointments(db).filter(p=>p.status==='MET'&&!moved.has(p.id));
const errors={};let restored=0;
db.transaction(()=>{for(const p of kept){const err=code(()=>{a.softDeleteAppointment(db,p.id);a.restoreAppointment(db,p.id)});if(err==='OK')restored++;else errors[err]=(errors[err]??0)+1;}});
invariants(db);console.log(JSON.stringify({scenario:'load-every-kept-meeting',kept:kept.length,restored,errors,roundtrip:await roundtrip(db,now)}));db.sqlite.close();
for(const seed of [0x2c2026,0xc0ffee]){
 let state=seed;const rand=n=>{state^=state<<13;state^=state>>>17;state^=state<<5;return Math.floor((state>>>0)/4294967296*n)};
 const s=await fresh(),{db,re,re2,re3,tl}=s;
 const customers=Array.from({length:10},(_,i)=>a.createCustomer(db,{name:'KH '+i,reId:(i%2?re:re2).id,stage:'N3',date:d(1)}));
 const ids=[];const outcomes=['N4','N3','N2','N1','ON_HOLD','LOST'];const operations={},errors={};let success=0;
 for(let step=0;step<1500;step++){
  const c=customers[rand(customers.length)],live=a.getCustomer(db,c.id),aps=a.listAppointments(db,c.id),ap=aps[rand(aps.length)],op=rand(13);operations[op]=(operations[op]??0)+1;
  try{
   switch(op){
    case 0:ids.push(a.scheduleAppointment(db,{customerId:c.id,reId:[re,re2,re3][rand(3)].id,date:d(1+rand(24)),triggerType:'OTHER',coordinatorIds:[tl.id]}).id);break;
    case 1:if(ap)a.recordMeetingOutcome(db,ap.id,{status:'MET',stageAfter:outcomes[rand(6)],nextStep:'Tiếp tục'});break;
    case 2:if(ap)a.editMeetingOutcome(db,ap.id,{status:'MET',stageAfter:outcomes[rand(6)],nextStep:'Sửa'},{date:d(1+rand(17))});break;
    case 3:if(ap)a.softDeleteAppointment(db,ap.id);break;
    case 4:if(ids.length)a.restoreAppointment(db,ids[rand(ids.length)]);break;
    case 5:if(ap)ids.push(a.rescheduleAppointment(db,ap.id,{date:d(1+rand(24))}).id);break;
    case 6:a.changeStageManually(db,c.id,{to:outcomes[rand(6)],date:d(1+rand(17))});break;
    case 7:if(live)a.softDeleteCustomer(db,c.id);else a.restoreCustomer(db,c.id);break;
    case 8:a.updateCustomerProfile(db,c.id,{reId:[re,re2,re3][rand(3)].id});break;
    case 9:if(ap){const x=a.recordOutcomeWithNext(db,ap.id,{status:'MET',stageAfter:'N3',nextStep:'Lịch tiếp'},{date:d(17+rand(8))});ids.push(x.next.id)}break;
    case 10:a.recordKycNote(db,c.id,{text:'  KYC\r\n Dòng\u00a0  '+step,date:d(1+rand(17)),facts:[{field:'childrenCount',value:rand(4)},{field:'occupation',value:' Bác\u00a0 sĩ\u200b '}]});break;
    case 11:if(live){const p=a.submitPolicy(db,{customerId:c.id,reId:re.id,submittedDate:d(1+rand(17)),submittedFyp:1+rand(1000000)});a.softDeletePolicy(db,p.id);a.restorePolicy(db,p.id)}break;
    case 12:if(ap)a.recordMeetingOutcome(db,ap.id,{status:rand(2)?'CANCELLED':'NO_SHOW'});break;
   }
   success++;
  }catch(e){if(!e.code)throw e;errors[e.code]=(errors[e.code]??0)+1;}
  try{invariants(db)}catch(e){console.log(JSON.stringify({scenario:'fuzz-invariant-broken',seed,step,op,error:e.code,params:e.params}));throw e;}
 }
 console.log(JSON.stringify({scenario:'new-fuzz',seed,steps:1500,success,operations,errors,roundtrip:await roundtrip(db,s.now)}));db.sqlite.close();
}
```

#### mutations.mjs

```javascript
import {cpSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root='C:/workspace/Project-2C-review-2/',out='C:/workspace/deep-review-1-6-r2/codex/A/',copy=out+'copy/';
for(const p of ['domain','db']){mkdirSync(copy+'packages/'+p,{recursive:true});for(const sub of ['src','package.json',...(p==='db'?['migrations']:[])])cpSync(root+'packages/'+p+'/'+sub,copy+'packages/'+p+'/'+sub,{recursive:true});}
const config=`export default {root:${JSON.stringify(copy)},resolve:{alias:[{find:'@p2c/domain',replacement:${JSON.stringify(copy+'packages/domain/src/index.ts')}},{find:'@p2c/ai/schema',replacement:${JSON.stringify(root+'packages/ai/src/schema.ts')}},{find:'vitest',replacement:${JSON.stringify(root+'node_modules/vitest/dist/index.js')}},...['drizzle-orm','sql.js','zod'].map(p=>({find:p,replacement:${JSON.stringify(root+'packages/db/node_modules/')}+p}))]},test:{include:['packages/*/src/**/*.test.ts'],maxWorkers:1}};`;
writeFileSync(out+'mutation.config.mjs',config);
const tests=['packages/db/src/trash.test.ts','packages/db/src/appointments.test.ts','packages/db/src/customers.test.ts','packages/db/src/database.test.ts','packages/db/src/backup-invariants.test.ts','packages/db/src/team.test.ts','packages/db/src/counts.test.ts','packages/domain/src/kyc.test.ts','packages/domain/src/text.test.ts'];
function run(id,files,pattern){const args=[root+'node_modules/vitest/vitest.mjs','run','--config',out+'mutation.config.mjs',...files,...(pattern?['-t',pattern]:[])];const p=spawnSync(process.execPath,args,{cwd:copy,encoding:'utf8',timeout:240000,env:{...process.env,FORCE_COLOR:'0'}});const log=(p.stdout??'')+(p.stderr??'');writeFileSync(out+'mutation-'+id+'.log',log);const summary=log.split('\n').filter(s=>/Test Files|Tests |Duration|FAIL |AssertionError|Error:|❯.*[×]/.test(s));const row={id,exit:p.status,signal:p.signal,summary,error:p.error?.message};console.log(JSON.stringify(row));return row;}
const rows=[];
rows.push(run('baseline',tests));
if(rows[0].exit!==0){writeFileSync(out+'mutation-results.json',JSON.stringify(rows,null,2));process.exit(1);}
const db='packages/db/src/',domain='packages/domain/src/';
const mutations=[
 ['R01',db+'appointments.ts',s=>s.replace('const move = restoreStageMove(db, row, stage);',`const move = restoreStageMove(db, row, stage);\n  if (!move && row.status === 'MET') checkTransition(db, row.customerId, row.stageAfter!, fromIsoDate(row.date));`),[db+'trash.test.ts'],'E18|E19'],
 ['R03',db+'customers.ts',s=>s.replace('recordedAfter !== undefined && latest.createdAt > recordedAfter','false'),[db+'trash.test.ts'],'E20'],
 ['R04',db+'appointments.ts',s=>s.replace('outcomeStage(row, stageOnDay(db, row.customerId, date))','outcomeStage(row, liveCustomer(db, row.customerId).stage)'),[db+'appointments.test.ts'],'the stage on the meeting day'],
 ['R05a',db+'customers.ts',s=>s.replace('if (compareDates(date, today(db)) < 0) {','if (false) {'),[db+'appointments.test.ts'],'the stage on the meeting day'],
 ['R05b',db+'customers.ts',s=>s.replace('if (left) throw new DbError', 'if (false) throw new DbError'),[db+'appointments.test.ts'],'H·CL-F3'],
 ['R02',db+'customers.ts',s=>s.replace('if (profile.reId !== row.reId) {','if (false) {'),[db+'customers.test.ts']],
 ['R44','packages/db/migrations/0009_lookup_indexes.sql',s=>'-- removed lookup indexes\n',[db+'database.test.ts'],'DR6-44'],
 ['R49',domain+'text.ts',s=>s.replace(".replace(/\\p{Cf}/gu, '')",'').replace(".replace(/\\s+/gu, ' ')",''),[domain+'text.test.ts']],
 ['R50',db+'backup-validation.ts',s=>s.replace(' && new Set(conflict).size === conflict.length',''),[db+'backup-invariants.test.ts'],'7:'],
 ['R51',db+'common.ts',s=>s.replace("if (!list.includes(value)) throw new DbError('INVALID_CHOICE');",''),[db+'customers.test.ts',db+'team.test.ts'],'choice|role|gender|enum'],
 ['R52','packages/db/migrations/0010_people_team_none.sql',s=>s.replace(',\n\tCONSTRAINT "people_team_none" CHECK("__new_people"."role" IN (\'RE\', \'TL\') OR "__new_people"."team_id" IS NULL)',''),[db+'database.test.ts'],'DR6-52|rejects an IS'],
 ['R59-hash',domain+'kyc.ts',s=>s.replace('[fact.field, fact.value, fact.status]','[fact.field, fact.value]'),[domain+'kyc.test.ts']],
 ['R59-hash-separator',domain+'kyc.ts',s=>s.replace(".join('\\n')",".join('|')"),[domain+'kyc.test.ts']],
 ['R59-M15',db+'counts.ts',s=>s.replace("t.deleted_at IS NULL AND a.deleted_at IS NULL",'a.deleted_at IS NULL'),[db+'counts.test.ts']],
 ['R59-M10',db+'backup.ts',s=>s.replace('Number.isSafeInteger(value)',"typeof value === 'number'"),[db+'backup-invariants.test.ts'],'token|integer'],
 ['R59-N19',db+'trash.ts',s=>s.replace('rf: isRfTransition(stage, move.to)','rf: true'),[db+'trash.test.ts']]
];
for(const [id,path,change,files,pattern] of mutations){const file=copy+path,original=readFileSync(file,'utf8'),mutant=change(original);if(mutant===original)throw Error('No change: '+id);writeFileSync(out+'mutant-'+id+'.txt',mutant);writeFileSync(file,mutant);try{rows.push(run(id,files,pattern));writeFileSync(out+'mutation-results.json',JSON.stringify(rows,null,2));}finally{writeFileSync(file,original);}}
console.log(JSON.stringify({total:rows.length-1,killed:rows.slice(1).filter(r=>r.exit===1&&r.summary.some(s=>s.includes('AssertionError'))).length}));
```

#### mutations-extra.mjs

```javascript
import {readFileSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const root='C:/workspace/Project-2C-review-2/',out='C:/workspace/deep-review-1-6-r2/codex/A/',file=out+'copy/packages/db/src/appointments.ts',original=readFileSync(file,'utf8'),rows=JSON.parse(readFileSync(out+'mutation-results.json','utf8'));
for(const [id,from,to,test,pattern]of [
 ['R02-next','const { reId } = liveCustomer(db, recorded.customerId);','const reId = recorded.reId;','appointments','books the next appointment for the RE now'],
 ['R03-kept-reapplied','if (move?.to) reinstateTransition(db, move.withdrawn, move.to, fromIsoDate(row.date));','applyOutcome(db, row);','trash','E19']
]){const mutant=original.replace(from,to);if(mutant===original)throw Error('no change '+id);writeFileSync(out+'mutant-'+id+'.txt',mutant);writeFileSync(file,mutant);try{const r=spawnSync(process.execPath,[root+'node_modules/vitest/vitest.mjs','run','--config',out+'mutation.config.mjs','packages/db/src/'+test+'.test.ts','-t',pattern],{cwd:out+'copy',encoding:'utf8',timeout:120000,env:{...process.env,FORCE_COLOR:'0'}});const log=(r.stdout??'')+(r.stderr??'');writeFileSync(out+'mutation-'+id+'.log',log);const row={id,exit:r.status,summary:log.split('\n').filter(s=>/Test Files|Tests |FAIL |AssertionError/.test(s))};rows.push(row);console.log(JSON.stringify(row));writeFileSync(out+'mutation-results.json',JSON.stringify(rows,null,2));}finally{writeFileSync(file,original);}}
```

#### mutation.config.mjs

```javascript
export default {root:"C:/workspace/deep-review-1-6-r2/codex/A/copy/",resolve:{alias:[{find:'@p2c/domain',replacement:"C:/workspace/deep-review-1-6-r2/codex/A/copy/packages/domain/src/index.ts"},{find:'@p2c/ai/schema',replacement:"C:/workspace/Project-2C-review-2/packages/ai/src/schema.ts"},{find:'vitest',replacement:"C:/workspace/Project-2C-review-2/node_modules/vitest/dist/index.js"},...['drizzle-orm','sql.js','zod'].map(p=>({find:p,replacement:"C:/workspace/Project-2C-review-2/packages/db/node_modules/"+p}))]},test:{include:['packages/*/src/**/*.test.ts'],maxWorkers:1}};
```

#### perf.mjs

```javascript
import {readFileSync,writeFileSync} from 'node:fs';
import {hostname,cpus} from 'node:os';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {a,m} from './runtime.mjs';
const out='C:/workspace/deep-review-1-6-r2/codex/A/';
const text=readFileSync('C:/workspace/deep-review-1-6-r2/common/load/load-2026-10-12-seed6.p2cbackup','utf8'),file=JSON.parse(text);
const metadata={machine:hostname(),cpu:cpus()[0].model,node:process.version,at:new Date().toISOString(),bytes:Buffer.byteLength(text),tablesHash:createHash('sha256').update(JSON.stringify(file.tables)).digest('hex'),concurrency:'Codex unit and mutation processes completed; no Codex build/exe test running. Other reviewer work unknown.'};
console.log(JSON.stringify(metadata));
assert.equal(metadata.tablesHash,'1c306cfb8203409337a5fa33c48306694581cb70355eb5526e4cf4f543589591');
const now=()=>new Date('2026-10-17T05:00:00Z'),db=(await a.importBackup(text,{now})).db,ops={};
function stats(xs){const ys=[...xs].sort((a,b)=>a-b);return {runs:ys.length,median:+ys[Math.floor(ys.length/2)].toFixed(3),min:+ys[0].toFixed(3),max:+ys.at(-1).toFixed(3)}}
async function bench(name,fn){await fn();const xs=[];for(let i=0;i<5;i++){globalThis.gc?.();const at=performance.now();await fn();xs.push(performance.now()-at)}ops[name]=stats(xs);console.log(JSON.stringify({name,...ops[name]}));writeFileSync(out+'perf-results.json',JSON.stringify({metadata,ops},null,2));}
await bench('importBackup',async()=>{const c=(await a.importBackup(text,{now})).db;c.sqlite.close()});
await bench('listAppointments',()=>a.listAppointments(db));await bench('listCustomers',()=>a.listCustomers(db));await bench('listStageTransitions',()=>a.listStageTransitions(db));await bench('listPolicies',()=>a.listPolicies(db));await bench('countRecords',()=>a.countRecords(db));await bench('listTrash',()=>a.listTrash(db));
const data={people:a.listPeople(db),policies:a.listPolicies(db),appointments:a.listAppointments(db),transitions:a.listStageTransitions(db)},customers=a.listCustomers(db),today=m.calendarDate(2026,10,17),period=m.periodOf('year',today),all={kind:'all'},marks=m.reportMarks(period),scopes=[all,...a.listTeams(db).map(t=>({kind:'team',teamId:t.id})),...data.people.filter(p=>p.role==='RE').map(p=>({kind:'re',reId:p.id}))];
await bench('periodMetrics',()=>m.periodMetrics(data,period,all));await bench('periodMetricsByScope',()=>{const f=m.periodMetricsByScope(data,period);return scopes.map(f)});await bench('periodMetricsByMark',()=>m.periodMetricsByMark(data,marks,all));await bench('appointmentCountsByScope',()=>{const f=m.appointmentCountsByScope(data.appointments,period,data.people,today);return scopes.map(f)});await bench('stageSnapshotByScope',()=>{const f=m.stageSnapshotByScope(customers,data.transitions,data.people,today);return scopes.map(f)});await bench('stageSnapshotSeries',()=>m.stageSnapshotSeries(customers,data.transitions,data.people)(marks.map(x=>x.end),all));await bench('exportBackup',()=>a.exportBackup(db));
for(const scope of scopes){assert.deepEqual(m.periodMetricsByScope(data,period)(scope),m.periodMetrics(data,period,scope));assert.deepEqual(m.appointmentCountsByScope(data.appointments,period,data.people,today)(scope),m.appointmentCounts(data.appointments,period,scope,data.people,today));assert.deepEqual(m.stageSnapshotByScope(customers,data.transitions,data.people,today)(scope),m.stageSnapshot(customers,data.transitions,today,scope,data.people));}
assert.deepEqual(m.periodMetricsByMark(data,marks,all),marks.map(x=>m.periodMetrics(data,x,all)));assert.deepEqual(m.stageSnapshotSeries(customers,data.transitions,data.people)(marks.map(x=>x.end),all),marks.map(x=>m.stageSnapshot(customers,data.transitions,x.end,all,data.people)));
const re=data.people.find(x=>x.role==='RE');
await bench('handover-roundtrip',()=>{const rollback={};try{db.transaction(()=>{a.updateCustomerProfile(db,customers[0].id,{reId:re.id});a.countCustomerRecords(db,customers[0].id);throw rollback;})}catch(e){if(e!==rollback)throw e;}});
const trash=[];for(const count of [15,75,100,150,300,400]){
 const x=(await a.importBackup(text,{now})).db;
 const already=JSON.parse(a.exportBackup(x)).tables.customers.filter(c=>c.deleted_at!==null).length;
 for(const c of a.listCustomers(x).slice(0,Math.max(0,count-already)))a.softDeleteCustomer(x,c.id);
 const expected=a.listTrash(x);
 await bench('trash-indexed-'+count,()=>a.listTrash(x));
 x.sqlite.exec('DROP INDEX appointments_customer;DROP INDEX policies_customer;DROP INDEX stage_transitions_appointment;');
 assert.deepEqual(a.listTrash(x),expected);
 await bench('trash-unindexed-'+count,()=>a.listTrash(x));
 trash.push({customersDeleted:count,rows:expected.length,behaviorIdentical:true,indexed:ops['trash-indexed-'+count],unindexed:ops['trash-unindexed-'+count]});x.sqlite.close();
}
console.log(JSON.stringify({counts:a.countRecords(db),scopes:scopes.length,equivalenceOnLoad:true,trash}));writeFileSync(out+'perf-results.json',JSON.stringify({metadata,ops,trash,equivalenceOnLoad:true},null,2));db.sqlite.close();
```

#### snapshots.mjs

```javascript
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {fromRepo,a,root} from './runtime.mjs';
const {MIGRATIONS}=await fromRepo('packages/db/src/migrations.ts');
let previous='00000000-0000-0000-0000-000000000000';const counts=[];
for(let i=0;i<MIGRATIONS.length;i++){
 const name=String(i).padStart(4,'0')+'_snapshot.json',snap=JSON.parse(readFileSync(root+'packages/db/migrations/meta/'+name,'utf8'));assert.equal(snap.prevId,previous);previous=snap.id;
 const db=await a.openDatabase({migrations:MIGRATIONS.slice(0,i+1)}),names=db.sqlite.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")[0].values.flat();assert.deepEqual(Object.keys(snap.tables).sort(),names);
 let columns=0,indices=0,fks=0,checks=0;
 for(const [table,t]of Object.entries(snap.tables)){
  const actual=db.sqlite.exec('SELECT name,type,"notnull",pk FROM pragma_table_info(?) ORDER BY cid',[table])[0].values;assert.deepEqual(actual.map(r=>r[0]),Object.keys(t.columns));
  for(const row of actual){const col=t.columns[row[0]];assert.equal(row[1].toLowerCase(),col.type);assert.equal(Boolean(row[2]),col.notNull);columns++;}
  const fk=db.sqlite.exec('SELECT "from","table","to",on_update,on_delete FROM pragma_foreign_key_list(?)',[table])[0]?.values??[],expected=Object.values(t.foreignKeys).flatMap(k=>k.columnsFrom.map((col,j)=>[col,k.tableTo,k.columnsTo[j],k.onUpdate,k.onDelete])),sorted=rs=>rs.map(r=>JSON.stringify(r.map(x=>typeof x==='string'?x.toLowerCase():x))).sort();assert.deepEqual(sorted(fk),sorted(expected));fks+=fk.length;
  const ix=db.sqlite.exec('SELECT name,"unique" FROM pragma_index_list(?)',[table])[0]?.values??[];for(const [name,k]of Object.entries(t.indexes)){assert(ix.some(([n,u])=>n===name&&Boolean(u)===k.isUnique));indices++;}
  const ddl=db.sqlite.exec('SELECT sql FROM sqlite_master WHERE type="table" AND name=?',[table])[0].values[0][0];for(const key of Object.keys(t.checkConstraints)){assert(ddl.includes(key));checks++;}
 }
 assert.deepEqual(db.quickCheck(),[]);counts.push({snapshot:name,tables:names.length,columns,foreignKeys:fks,indices,checks,match:true});db.sqlite.close();
}
console.log(JSON.stringify(counts,null,2));
```

#### bloat.mjs

```javascript
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const root='C:/workspace/Project-2C-review-2/',out='C:/workspace/deep-review-1-6-r2/codex/A/';const ts=createRequire(root+'package.json')('typescript');
const files=execFileSync('git',['ls-files','packages/domain','packages/db'],{cwd:root,encoding:'utf8'}).trim().split('\n');
const inventory=files.map(p=>({file:p,lines:readFileSync(root+p,'utf8').trimEnd().split('\n').length,sha256:createHash('sha256').update(readFileSync(root+p)).digest('hex')}));
writeFileSync(out+'inventory.json',JSON.stringify(inventory,null,2));
const sources=files.filter(p=>p.endsWith('.ts')&&!/\.test\.|\/golden\/|\.d\.ts$|\/test-support\.ts$|\/index\.ts$/.test(p)),rows=[],tests=[];
for(const file of files.filter(p=>p.endsWith('.test.ts'))){const text=readFileSync(root+file,'utf8');tests.push({file,lines:text.split('\n').length,cases:[...text.matchAll(/(?:it|test|describe)(?:\.each\([\s\S]*?\))?\(\s*['"`]([^'"`]+)['"`]/g)].map(x=>x[1])});}
writeFileSync(out+'test-map.json',JSON.stringify(tests,null,2));
for(const file of sources){const sf=ts.createSourceFile(file,readFileSync(root+file,'utf8'),ts.ScriptTarget.Latest,true);for(const st of sf.statements){if(!st.modifiers?.some(x=>x.kind===ts.SyntaxKind.ExportKeyword))continue;const names=ts.isVariableStatement(st)?st.declarationList.declarations.map(d=>d.name.getText(sf)):st.name?[st.name.getText(sf)]:[];for(const name of names){let matches='';try{matches=execFileSync('rg',['-n','-w',name,'apps','packages','tools','e2e','--glob','*.ts','--glob','*.tsx','--glob','*.mjs','--glob','!*.test.*','--glob','!*.spec.*','--glob','!*.guide.*','--glob','!*.perf.*','--glob','!**/golden/**','--glob','!test-support.ts'],{cwd:root,encoding:'utf8'}).trim()}catch(e){if(e.status!==1)throw e}const refs=matches.split('\n').filter(Boolean).filter(l=>{const p=l.split(':')[0].replaceAll('\\','/');return p!==file&&!p.endsWith('/index.ts')});rows.push({file,name,line:sf.getLineAndCharacterOfPosition(st.getStart(sf)).line+1,kind:ts.isInterfaceDeclaration(st)||ts.isTypeAliasDeclaration(st)?'type':'value',references:refs});}}}
writeFileSync(out+'export-refs.json',JSON.stringify(rows,null,2));console.log(JSON.stringify({files:files.length,sourceFiles:sources.length,exports:rows.length,tests:tests.length,noOtherProductReference:rows.filter(r=>r.references.length===0).map(({file,name,line,kind})=>({file,name,line,kind}))},null,2));
```

### Trạng thái cuối phiên

SHA: 4217ed4cd3300af1d63aa61db9eb13902fe75f16.

Git status --short, nguyên văn:

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

Bằng đầu phiên; kiểm lại SHA-256 toàn bộ 116 file kê đầu đợt kiểm: 0 file đổi. Bản chép nằm ngoài repo. Không tạo Issue/PR/commit/merge; không đọc các thư mục reviewer bị cấm. Không tổng hợp với lượt 2 khác.

Giờ xong / kiểm cuối (Asia/Bangkok): 2026-10-17 02:18:45 +07:00. Chỉ hoàn tất Gói A; B mở phiên mới.

