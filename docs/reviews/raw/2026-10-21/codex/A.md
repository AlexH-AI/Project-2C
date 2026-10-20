XONG — codex gói A lượt 3, 2026-10-20T01:17:56.176+07:00

## 1. Thông tin phiên

- Bên: **Codex**, gói **A — Lõi dữ liệu**, lượt 3, phiên làm mới.
- SHA đầu và cuối: `119e2e45cbce54d8a3943757bd826a7f1e9b694f`. Worktree: `C:\workspace\Project-2C-review-2`, detached.
- Bắt đầu: **2026-10-20T00:57:09+07:00**. Kiểm cuối: **2026-10-20T01:14:59.134+07:00**, Asia/Bangkok.
- Máy: **DESKTOP-KDURKJP**, 12th Gen Intel(R) Core(TM) i9-12900K, Node **v24.20.0**. Công cụ: Codex desktop, PowerShell, Node, Vitest 5.0.1, TypeScript, dependency-cruiser sẵn có.
- Model: GPT-6 theo thông tin phiên. Runtime không cung cấp định danh model cụ thể/mức suy luận để xác nhận; không tự suy đoán.
- Git status đầu/cuối giống nhau (ba mục ngoài Git có sẵn):

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

- Không sửa repo, không commit/gh/Issue/PR, không subagent, không cài công cụ, không gọi AI thật/đọc key/mở ChatGPT. Không dùng trình duyệt hoặc exe trong A; quy tắc chặn mạng probe trình duyệt không phát sinh. Không đọc báo cáo lượt 3 của bên khác.

## 2. Bảng R

| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| 68 | #652 → #666 | ĐÃ SỬA (phần A) | `scenarios.mjs` R68: ghi bù → xóa → khôi phục → backup nhập được. Gỡ fallback của stageOnDay: 1 test đỏ; gỡ fallback isStageOfDay: 2 test đỏ. | KH tạo N3 ngày 10/10, hiện đã N1 từ 12/10; cuộc gặp 05/10 vẫn giữ N3, KH giữ N1. Đổi N2 trước ngày tạo vẫn D10. |
| 69 | #652 → #666 | ĐÃ SỬA | R69 clocks bằng/lùi/tăng sau export/import đều chặn. Trả nguyên so timestamp cũ trên hai file: **4 test E20 đỏ**, 2 xanh; tắt guard seq: 3 test đỏ. | Baseline bao gồm timestamp không phần nghìn giây, cùng mili giây, thứ tự created_at đảo so seq. |
| 71 | #652 → #666 | ĐÃ SỬA | R71: file chéo KH bị BACKUP_INVALID rule 4; đường restore không đổi chuyển nhóm/KH khác. Gỡ filter KH và gỡ luật nhập: mỗi mutant 1 test đỏ. | Probe SQL thô chỉ kết luận về lệnh. Biến thể còn transition hợp lệ của X: chỉ X được khôi phục, Y nguyên. |
| 72 | #659 → #686 | ĐÃ SỬA (phần A) | 4.207 code point của tập bỏ về rỗng; mọi Unicode White_Space gộp đúng. KYC/tên được chuẩn hóa; backup chưa chuẩn hóa bị từ chối. Mutant text/note: 4/1 test đỏ. | NFD có ký tự vô hình giữa chữ và dấu; variation selector ngoài BMP; U+0085/U+2028/U+2029 trong ghi chú; kiểm UTF-16 hỏng ở baseline. |
| 84 | #662 → #707, #709, #710 | ĐÃ SỬA (phần A) | 14 test purge xanh (D1–D6, D9, D11, migration/file). Gỡ dọn/giữ/transaction/trigger đều đỏ. Dọn tải 113 và 1.313 dòng: còn 0 dòng, backup nhập được; 1.313 dòng trung vị 112,5 ms. | Chuỗi giữ 32 mắt xích; giữ nhân sự/team rồi giải phóng ở lần dọn sau; rollback lỗi cuối/COMMIT; VACUUM lỗi vẫn có dữ liệu đã dọn và retry thu gọn. B/E/F kiểm hàng đợi/màn/exe. |
| 87 | #652 → #666 | ĐÃ SỬA | R16: bỏ nhánh previewHandover trả 0 khi cùng RE → test “hands over only…” đỏ `expected 1 to be +0`. Baseline xanh. | Test có lịch của RE khác, nên số đếm không tự bằng 0 một cách tình cờ. |
| 92 | #660 → #689; #691 → #702 (liên quan) | ĐÃ SỬA | Test imports-again xanh ở Pacific/Pago_Pago (UTC−11), Etc/GMT-12 (UTC+12). Trả clock 11:00→10:00 UTC: test đỏ OUTCOME_IN_FUTURE tại UTC−11. | Baseline hash seed dùng mẫu được sinh ở UTC theo #702. Lần chạy +12 chỉ chọn imports-again; file seed bị skip bởi pattern, không nhận là đã chạy seed ở +12. |
| 103 | #653 → #667 | ĐÃ SỬA (phần A) | Một meetingKeepingMove có ba caller: lệnh, seed, outcomeLock. Trên tải: **3.254 move** so luật cũ/mới, **1.040 khóa latest** so outcomeLock, **0 lệch**. Bỏ chặn D7: 1 test đỏ. | Helper có 3 ca trực tiếp; seed/hash/golden xanh trong baseline. Biên trước ngày tạo thuộc sửa có chủ ý R68. |

**8/8 mục ĐÃ SỬA trong phần A.** Không có mục SỬA MỘT PHẦN/CHƯA SỬA/HỒI QUY được xác nhận. Kết luận nhiều gói ở trên chỉ bao phủ lệnh/domain/DB.

## 3. Phạm vi đã đọc

- Phạm vi sản phẩm: domain ngày/kỳ/tiền/số, lifecycle/RF/snapshot/ba đường gom chỉ số, KYC/catalog/cổng/hash/bằng chứng; db schema/migration/cache/transaction/persist, mọi repository/lệnh, backup/14 luật, seed/dữ liệu tĩnh, counts/trash/purge, settings/ULID/export API và cấu hình. Bản kê từng file, dòng và SHA-256 ở cuối mục 9 và `A/inventory.json` (**120 file Git**, gồm snapshot/meta/tài liệu/cấu hình). Cỡ theo size-report chung: **8.189 SP / 13.885 test / 339 dòng sinh / 101 file**, khác cách đếm inventory vì metadata.
- Test: rà cấu trúc/seam của **43 file**, **1.788 lời gọi expect** tĩnh ở `A/test-map.json`/`test-map.txt`; đọc sâu phần diff sửa, purge, E20, backfill, cross-customer, KYC Unicode, backup/migration/rollback, helper D7 và seed hash. Chạy toàn bộ **1.322 test, 43/43 file xanh** trên bản chép (130,08 s). Đây không phải phát biểu mọi nhánh được chứng minh không có lỗi.
- Diff `4217ed4..119e2e4`: đọc kỹ #666, #667, #669 (personUsage), #674 (integrityCheck ở DB), #686, #689, #698 (seed/schema ở ranh giới A), #702, #709 và phần nối #710. Phần A theo kế hoạch: +455/−133 SP ở 12 file, +1.095/−17 test ở 13 file, migration 0011 mới.
- Nguồn đúng: CLAUDE.md gốc/hai package, CONTEXT.md; Phase 3 §4/§6, Phase 4, Phase 6 §4.1/§4.2/§5 (TR-11–13, D1–D13); ADR-0007/0008 (phụ lục dọn); golden chi-so, kh-theo-nhom, kyc, lich-hen và fixture/test. Không đổi spec/golden/mockup.
- Nguồn lượt trước: hai bản tổng hợp 15/10 và 17/10; phạm vi/phát hiện/kịch bản/phụ lục A của Codex/Claude/Muse lượt 1 và A của Codex/Claude lượt 2 trong repo. common plan §4/L3, known (OPEN/ACCEPTED, K1–K29), fixes các nhóm liên quan, baseline. Probe Codex lượt 2 dùng lại runtime/fuzz/perf/snapshot/mutation harness, cập nhật đường dẫn/hash/ngày, lưu bản dùng ở A/. Không chạy lại script có đường ghi vào lượt 2.
- Không kết luận về focus/UI, S-2/Rust/file thật, guardrail nội dung AI hoặc hiệu năng exe từ SQL thô. Chỉ đọc `tables.ts` và helper `outcome-form.ts` nơi A nối vào app.

## 4. Kịch bản mới đã thử

Các ca R68/R69/R71/R72 được ghi ở bảng R, không tính thay cho các kịch bản mới dưới. Dọn sạch chưa có ở lượt 1–2; các chuỗi sau đều chạy thực tế.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | Chuỗi dời **32 mắt xích**, 31 dòng đầu đã xóa từ file nhập; RE và người hỗ trợ đã xóa; preview → listTrash → purge → nhập backup → xóa KH → purge lần hai | Lần đầu giữ đúng 31 lịch + 2 người, lý do khớp; sau xóa KH mọi dòng giải phóng, FK/invariants/roundtrip đạt | — |
| 2 | Chuỗi ba lịch với **team riêng đã xóa**, RE/người phối hợp đã xóa; người phụ trách hiện tại ở team còn dùng; dọn hai lần | Giữ đúng 2 lịch + 2 người + 1 team; preview/lý do/listTrash/lệnh bằng nhau; xóa KH rồi dọn giải phóng cả 5 | — |
| 3 | Ba trigger với KH **đang dùng → đã xóa mềm → đã khôi phục**, trên dữ liệu tải có AI/KYC thật của Mock | Đang dùng/khôi phục: cả ba DELETE bị append-only chặn. Đã xóa: ai→facts→notes đi qua; probe rollback giữ dữ liệu; nhập lại được | — |
| 4 | Tiêm lỗi **VACUUM** sau transaction, kiểm persist rồi dọn lại khi Thùng rác đã rỗng | Lần đầu dọn thành công, lưu đúng 1 lần ở cỡ cũ 184.320 B; retry lưu thêm 2 lần, còn 163.840 B; backup nhập được | — |
| 5 | Tiêm lỗi ở DELETE KH sau khi đã xóa AI/KYC/lịch, và tiêm lỗi COMMIT; sau lỗi thử dọn lại | Cả hai rollback mọi bảng; FK bật lại (=1), foreign_key_check rỗng; dọn lại thành công | — |
| 6 | Nhập tải → chụp readTables → chỉ số 49 góc nhìn × 3 kỳ → purge → backup nhập lại → mở file bytes mới | Toàn bộ dữ liệu sống giữ nguyên, 147 bộ KPI bằng nhau, 4 team/51 người/1.481 KH/10.255 lịch/1.674 HĐ giữ nguyên; mở lại được | — |
| 7 | Hai seed fuzz × 1.500 bước: **15 loại thao tác**, thêm tạo KH sau khi đã dọn, purge, KYC/HĐ/bàn giao/dời/khôi phục xen kẽ; luật nhập sau mỗi bước | 3.000 bước, 200 lần gọi purge (có cả Thùng rác rỗng); 2.363 bước không ném lỗi, 637 lần bị luật từ chối; mọi lần từ chối tables không đổi; 2 chuỗi roundtrip đạt | — |
| 8 | Mở từng snapshot/migration 0000…0011 và so bảng/cột/FK/index/CHECK với SQLite thật; integrityCheck mỗi mức | 12/12 khớp; schema mới 13 bảng/109 cột/18 FK/10 index/28 CHECK; chuỗi prevId đúng; integrity sạch | — |
| 9 | Đối chứng giữ hành vi D7 trên tải: predicate theo SQL/isStageOfDay cũ đối với mỗi move ↔ helper mới; helper ↔ outcomeLock cho move latest | 3.254 move + 1.040 khóa latest, 0 lệch; seed/golden/hash trong baseline xanh | — |
| 10 | Dọn tải ở hai cỡ 113/1.313 dòng, mỗi cỡ nhập file mới 5 lần; đo trước/sau và VACUUM riêng | Mọi lần còn 0 dòng, kept=0; file và thời gian ở mục Hiệu năng; không đo trên DB đã dọn từ mẫu trước | — |

| 11 | Khôi phục R với seq cũ cùng ngày sau khi X đã xóa, rồi khôi phục X (biến thể thân PR #666 nêu) | R giữ seq cũ; preview X nêu N2→N1, rf=false; kết quả X không RF, KH N1; backup nhập được. Không vi phạm phép so seq của K22: R.seq < X.seq | — |

Nguồn: `scenarios.mjs` (9/9 ca, gồm replay R), `extra-scenarios.mjs` (3/3 ca), `fuzz-purge.mjs`, `snapshots.mjs`, `purge-node.mjs`, `restore-old-seq.mjs`; JSON/log cùng tên. Ở ca 6 dùng `readTables` của app, không suy ra màn từ raw SQL. R103 đối chiếu predicate được chép từ điều kiện SQL/isStageOfDay cũ; không nhận là đã chạy nguyên runtime cũ. Ca 11 không gắn KNOWN (common/known không liệt kê); ghi lại kết quả thực, trong đó thay đổi RF đã có trong TrashEffect trước khi khôi phục, và thứ tự seq vẫn theo K22. SQL thô ở các ca tiêm lỗi/trigger/file nhập chỉ dùng để kiểm lệnh.

## 5. Phát hiện mới

**Không có phát hiện mới cần cấp ID CX3-A ở phiên này.** Không đặt chỉ tiêu số lượng. Không có PLAUSIBLE tồn đọng được nâng thành CONFIRMED.

Các điểm vẫn thấy nhưng đã là KNOWN, không báo lại thành phát hiện:

- `purge.ts` luôn quét KEPT_PEOPLE/KEPT_TEAMS kể cả không lịch giữ; `trash.ts` refs đọc cả bảng. Có số đối chứng mới ở mục 6, chưa cho hậu quả vượt phạm vi KNOWN hoặc ngưỡng màn.
- optionalText chỉ trim; VT/FF không tách dòng; spec Phase 3 còn câu K20 cũ; emoji ZWJ bị tách theo luật Owner.
- Nhánh VACUUM lỗi chưa được test sản phẩm giữ; phiên này đã probe độc lập nhưng không thêm test vào repo. DR6-66/67 export/hàm chỉ test dùng và code lặp giữ trạng thái KNOWN.

## 6. Bloat

| Đã chạy / đọc | Phạm vi | Kết quả | ID |
|---|---|---|---|
| tsc --noEmit --noUnusedLocals --noUnusedParameters | domain và db, cấu hình nguyên | Hai lệnh exit 0, log rỗng | — |
| codemap --check | Repo | Export maps are up to date; exit 0 | — |
| lint:deps | Repo | **320 module / 1.312 phụ thuộc, 0 vi phạm** | — |
| Caller mới meetingKeepingMove / keptRecords | lệnh, seed, outcomeLock; previewPurge, listTrash | D7 một hàm/3 caller; tập giữ một hàm dùng chung; không tìm thấy export chạy mới bỏ không | — |
| Đọc lặp/unused đã ghi sổ | updateRow, nextSeq, find/live, seed ngày, rowsOf/selectRows, hàm getter chỉ test | Trùng DR6-66/67 và OPEN #667/#709, không cấp ID lại; không có chi phí mới được xác nhận | KNOWN |
| Cỡ A tại SHA ghim | baseline chung, không dựng lại bundle | 8.189 SP / 13.885 test / 339 sinh; SP +322 so lượt 2, gồm purge mới | — |

Không đề xuất dependency/công cụ mới. Không tái chạy build bundle/exe ở A; dùng baseline chung đã dựng không đặt biến môi trường riêng. Bloat không có chi phí đo mới thì không nâng mức.

## 6a. Hiệu năng

**Máy/dữ liệu/cách đo:** Home PC DESKTOP-KDURKJP, i9-12900K, Node v24.20.0. File tải 16.034.517 B; tables SHA-256 `1c0a43fb9d5711df4700cb688a256ac50bb44eed1c0fd00218fa36f0746d003f`, xác nhận bằng assert. Lúc đo không chạy unit/mutation/build/exe của Codex; hoạt động reviewer khác không được quan sát. Mẫu perf.mjs bắt đầu 2026-10-19T18:05:22.943Z (01:05:22 +07). Hàm chung: warmup + 5 mẫu, có GC trước mẫu; số Node không đồng nhất với thao tác exe. Đo purge: 5 mẫu/cỡ, DB mới mỗi mẫu, không persist (như baseline chuẩn bị).

| Hàm Node | Lượt 2 cùng máy (ms) | Lượt 3 trung vị (min–max), ms | Nhận xét / ID |
|---|---:|---|---|
| `importBackup` | 726,868 | 760,382 (738,690–806,466) | Không chạm cả hai ngưỡng nhiễu (>20% và >10 ms). |
| `listAppointments` | 48,788 | 59,027 (56,921–61,938) | Mẫu đầu chạm luật nhiễu; đối chứng dưới xác nhận mã hàm nguyên, không hồi quy. |
| `listCustomers` | 5,640 | 7,350 (6,024–8,239) | Không chạm cả hai ngưỡng nhiễu (>20% và >10 ms). |
| `listStageTransitions` | 9,868 | 10,733 (10,548–10,784) | Không chạm cả hai ngưỡng nhiễu (>20% và >10 ms). |
| `listPolicies` | 7,642 | 9,367 (7,671–11,386) | Không chạm cả hai ngưỡng nhiễu (>20% và >10 ms). |
| `countRecords` | 5,941 | 5,756 (5,562–5,852) | Không chạm cả hai ngưỡng nhiễu (>20% và >10 ms). |
| `listTrash` | 25,190 | 36,130 (34,652–41,340) | Mẫu đầu +10,940 ms; đối chứng và chi phí mới đã KNOWN, xem dưới. |
| `periodMetrics` | 2,069 | 2,893 (2,818–3,029) | Không chạm cả hai ngưỡng nhiễu (>20% và >10 ms). |
| `periodMetricsByScope` | 2,233 | 3,348 (2,943–3,755) | Không chạm cả hai ngưỡng nhiễu (>20% và >10 ms). |
| `periodMetricsByMark` | 1,085 | 2,138 (1,764–2,188) | Không chạm cả hai ngưỡng nhiễu (>20% và >10 ms). |
| `appointmentCountsByScope` | 1,634 | 2,785 (2,445–3,128) | Không chạm cả hai ngưỡng nhiễu (>20% và >10 ms). |
| `stageSnapshotByScope` | 1,261 | 2,221 (1,809–2,319) | Không chạm cả hai ngưỡng nhiễu (>20% và >10 ms). |
| `stageSnapshotSeries` | 2,662 | 3,594 (3,157–4,658) | Không chạm cả hai ngưỡng nhiễu (>20% và >10 ms). |
| `exportBackup` | 167,669 | 174,964 (171,582–176,269) | Không chạm cả hai ngưỡng nhiễu (>20% và >10 ms). |
| `handover-roundtrip` | 0,748 | 0,982 (0,939–0,991) | Không chạm cả hai ngưỡng nhiễu (>20% và >10 ms). |

**Đối chứng thích nghi vì hai số chạm luật nhiễu:** lấy nguồn cũ bằng git show 4217ed4, chỉ đổi đường import trong bản chép sang cùng dependency/runtime mới, cùng bytes tải lượt 3; 11 mẫu sau 3 warmup, đổi lượt cũ/mới xen kẽ, assert kết quả bằng nhau. Đây là đối chứng phần hàm, không phải chạy nguyên app lượt 2.

| Hàm | Cũ / mới, ms | Bằng chứng | ID |
|---|---|---|---|
| `listAppointments` | 48,145 / 48,037 | SHA-256 của thân hàm bằng nhau; chênh −0,108 ms. Mẫu đầu là nhiễu. | — |
| `listTrash` | 28,488 / 33,636 | Thêm keptRecords: +5,148 ms (≈18,1%), không vượt cả hai mốc nhiễu trong A/B; đúng chi phí OPEN #709 đã biết. | KNOWN |

| Đo dọn | 113 dòng, trung vị (min–max), ms | 1.313 dòng, trung vị (min–max), ms | Mốc chuẩn bị 113 / 1.313 (ms) | ID |
|---|---|---|---|---|
| `listTrashBefore` | 34,033 (31,941–44,630) | 144,900 (139,159–168,888) | 32.6 / 140.7 | — |
| `previewPurge` | 5,914 (5,842–6,315) | 10,512 (10,259–10,973) | 5.6 / 9.9 | — |
| `purgeTrash` | 96,054 (93,951–96,797) | 112,529 (108,633–113,355) | 93.8 / 109.8 | — |
| `purgeTrashWithoutVacuum` | 30,052 (29,893–31,569) | 107,815 (104,266–108,719) | 29.4 / 105.3 | — |
| `vacuum` | 65,003 (63,900–66,761) | 4,636 (4,367–4,986) | 64.4 / 5 | — |
| `export` | 2,052 (2,003–2,188) | 0,356 (0,349–0,388) | 2.1 / 0.4 | — |
| `listTrashAfter` | 10,770 (9,625–11,105) | 2,093 (1,459–2,414) | 10.8 / 2.1 | — |

- 113 dòng: **14.069.760 → 13.410.304 B**, 0 kept, 0 dòng sau dọn.
- 1.313 dòng: **14.118.912 → 1.486.848 B** (giảm ≈89,5%), 0 kept, 0 dòng sau dọn. Cỡ lớn = thêm softDeleteCustomer cho 1.200 KH sống đầu tiên theo id.
- Các số purge không xấu hơn mốc chuẩn bị theo luật nhiễu; spec chưa đặt ngưỡng tuyệt đối cho lệnh dọn. Không dùng ngưỡng thao tác màn <200 ms để tự phán xét tổng transaction/VACUUM/file.
- **So mốc Home PC sau #656:** dùng số exe của common/baseline.md (đã chạy tại SHA ghim, được prompt cho phép dùng lại), không đo exe riêng trong A. app.open-data **373 vs 387 ms**, backup.read **827 vs 835 ms**, db.save **146 vs 151 ms**, trash.open **38 vs 34 ms**; mọi dòng đạt ngưỡng và không dòng nào xấu hơn theo luật nhiễu. Lượt 2 app.open-data thấp hơn do quick_check; K24 chấp nhận chi phí integrity_check.
- Chỉ số/đếm/snapshot trên tải còn tương đương 49 góc nhìn và các mark như probe lượt 2. Không có phát hiện P mới. Giới hạn quan sát: chưa đo app đầy đủ hay ảnh hưởng hệ thống ngoài phiên; F tổng hợp số exe/bundle và đo màn sau dọn.

## 7. Đếm mức × trục

Chỉ đếm phát hiện **mới**, không đếm 8 dòng R hay các KNOWN.

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

CONFIRMED mới: 0; PLAUSIBLE: 0. Không có tỷ lệ PLAUSIBLE cao cần cảnh báo. Đây không phải kết luận sẵn sàng v1.0; kết luận toàn bộ thuộc gói F.

## 8. Đã xét, không thấy thêm theo trục

| Trục | Đã chạy / đọc và kết luận trong A |
|---|---|
| R | 8 mục ở bảng R; 15 đột biến có test đỏ, baseline xanh; không thấy phần sửa còn thiếu trong phạm vi A. |
| E | Đã xét Unicode toàn bộ tập target, NFD/supplementary, clocks đảo/bằng, nhập bù trước tạo KH, chuỗi 32 mắt xích, dọn lặp/no-op, VACUUM lỗi, 3.000 bước fuzz. Không thấy lỗi mới. Ngày/tiền/kỳ/miền 1900–2100 được đọc và baseline golden/biên xanh. |
| C | Đối chiếu hợp đồng Phase 3/4/6, ADR7/8, R103 so 3.254 move; keptBy/preview/lệnh cùng tập; readTables/147 KPI trước/sau giữ nguyên. Không thấy lệch hợp đồng mới. Câu K20 cũ trong spec đã KNOWN. |
| D | Rollback cuối DELETE/COMMIT, FK khôi phục, 12 migration/snapshot, nhập/xuất/mở lại sau dọn, dữ liệu sống nguyên, fuzz luật nhập sau từng bước. Không thấy mất/sai dữ liệu mới ở lệnh. |
| G | Đã xét phần A: schema JSON của lịch sử AI, quan hệ version/KH, append-only và purge đúng chủ. Không gọi AI; validator/prompt/guardrail nội dung do C kiểm, không kết luận thay. |
| S | Đã xét bind/quote identifier, envelope strict/type/size/FK/CHECK và 14 luật, chéo KH đã rút, trigger live/deleted/restored; unit backup-engine/value/invariants xanh. Không thấy lỗ hổng mới ở biên DB; key/Rust/mạng ngoài A. |
| P | Bảng số riêng trên tải đúng hash, đối chứng hàm cũ/mới và mốc sau #656; không có P mới. Chi phí tập giữ đã KNOWN. |
| B | Hai tsc noUnused, codemap, deps xanh; caller helper/tập giữ chung được dùng; code lặp/dead API trùng KNOWN. Không có bloat mới được chứng minh. |
| T | Rà seam 43 file/1.788 expect; 1.322 test baseline, 15/15 mutant bị giết, clock hai đầu miền, probe/fuzz độc lập. Nhánh VACUUM chưa có test sản phẩm là OPEN đã biết; không coi probe ngoài repo là đã lấp test repo. |
| A | Đã xét phần domain/db: định dạng Việt và catalogue thông điệp dữ liệu/error qua unit/golden; normalized names/KYC dùng hàm chung. Không kiểm UI/focus/contrast bằng code DB; D/E phụ trách. Không thấy lỗi i18n mới trong phạm vi này. |

## 9. Phụ lục bằng chứng và kết thúc

### 9.1 Lệnh / probe

Các đường trong khối dưới là lệnh đã chạy; thư mục làm việc repo hoặc bản chép được ghi rõ trong script. Runner mutations/timezones truyền args/TZ đầy đủ, log từng ca riêng.

```powershell
node C:/workspace/Project-2C-review-2/node_modules/vitest/vitest.mjs run --config C:/workspace/deep-review-1-6-r3/codex/A/mutation.config.mjs --reporter=dot
node C:/workspace/deep-review-1-6-r3/codex/A/scenarios.mjs
node C:/workspace/deep-review-1-6-r3/codex/A/mutations.mjs
node C:/workspace/deep-review-1-6-r3/codex/A/mutation-exact-r69.mjs
node C:/workspace/deep-review-1-6-r3/codex/A/timezones.mjs
node C:/workspace/deep-review-1-6-r3/codex/A/extra-scenarios.mjs
node C:/workspace/deep-review-1-6-r3/codex/A/fuzz-purge.mjs
node C:/workspace/deep-review-1-6-r3/codex/A/snapshots.mjs
node --expose-gc C:/workspace/deep-review-1-6-r3/codex/A/perf.mjs
node --expose-gc C:/workspace/deep-review-1-6-r3/codex/A/perf-paired.mjs
node C:/workspace/deep-review-1-6-r3/codex/A/purge-node.mjs C:/workspace/Project-2C-review-2 C:/workspace/deep-review-1-6-r3/common/load/load-2026-10-12-seed6.p2cbackup C:/workspace/deep-review-1-6-r3/codex/A/purge-node.json 5
node node_modules/typescript/bin/tsc -p packages/domain --noEmit --noUnusedLocals --noUnusedParameters
node node_modules/typescript/bin/tsc -p packages/db --noEmit --noUnusedLocals --noUnusedParameters
node tools/codemap.mjs --check
pnpm lint:deps
```

- `setup.mjs`: chép src/migrations/package/tsconfig của domain/db; không install, không tạo junction node_modules. `mutation.config.mjs` alias dependency có sẵn về worktree, domain về bản chép.
- `unit-baseline.log`: **43 passed / 1.322 passed**, không có file đỏ. Baseline lần đầu thiếu tsconfig.base.json là lỗi harness trước khi test chạy; đã chép thêm rồi mới lấy baseline và làm đột biến.
- `scenarios.log/json`: **9/9** xanh sau sửa hai lỗi harness (tự đệ quy random khi truyền vào withSources; sai chữ ký periodMetrics). `scenarios-harness-first.log` giữ kết quả đầu; không tính lỗi probe thành lỗi app.
- `extra-scenarios.log/json`: **3/3** xanh. Lần đầu thử xóa riêng notes khi facts còn tham chiếu bị FK từ chối đúng; sau đó kiểm theo thứ tự ai→facts→notes trong một transaction rollback. Kết quả đầu giữ ở `extra-scenarios-first.log`.
- `fuzz-purge.log`: 2 seed × 1.500 bước, invariants sau mỗi bước và tables không đổi sau từ chối; 200 gọi purge, roundtrip 2/2. “Không ném lỗi” gồm no-op khi không có bản ghi phù hợp, không phải 2.363 lần thay dữ liệu.
- `snapshots.log`: 12/12 match; `timezone-results.json`/`tz-*.log`: unmutated imports-again 1/1 ở UTC−11 và UTC+12. Không nhận file seed bị skip là đã chạy.
- `perf-results.json`, `perf-paired.json`, `purge-node.json` + log: số thô, mỗi mẫu, metadata. `perf-paired-harness-first.log` là lỗi đường import file URL trước khi đối chứng chạy, không phải lỗi sản phẩm. Nguồn cũ nguyên văn ở `r2-*-original.ts`; bản chỉ đổi import ở `r2-*.ts`.
- `inventory.json`, `test-map.json/txt`, `tsc-*.log`, `codemap.log`, `lint-deps.log`, `final-checks.json`, `progress-snapshot.md` giữ lại cho kiểm độc lập.

### 9.2 Đột biến

Mọi mutation chạy trên `A/copy/`, phục hồi file trong finally. Mỗi nguồn `mutant-<ID>.txt` và log `mutation-<ID>.log`; riêng old-clock có hai nguồn suffix customers/appointments. Không có mutant sống hoặc thất bại vì harness/import/syntax.

| Mutant | Gỡ / làm sai gì | Bằng chứng test đỏ | Kết quả |
|---|---|---|---|
| R68-command | Bỏ fallback nhóm tạo KH ở stageOnDay | Tests  1 failed | 65 skipped (66) | Bị giết |
| R68-import-restore | Bỏ fallback nhóm tạo ở isStageOfDay | Tests  2 failed | 1 passed | 213 skipped (216) | Bị giết |
| R69-seq | Tắt guard seq E20 | Tests  3 failed | 3 passed | 25 skipped (31) | Bị giết |
| R71-command | Bỏ filter customerId khi tìm transition đã rút | Tests  1 failed | 65 skipped (66) | Bị giết |
| R71-import | Bỏ kiểm cùng KH ở luật nhập 4 | Tests  1 failed | 149 skipped (150) | Bị giết |
| R72-text | Trả regex Cf/JS whitespace cũ | Tests  4 failed | 8 passed (12) | Bị giết |
| R72-note | Trả bộ tách dòng CR/LF cũ | Tests  1 failed | 11 passed (12) | Bị giết |
| R84-no-purge | Bỏ mọi DELETE | Tests  1 failed | 13 skipped (14) | Bị giết |
| R84-no-keep | Preview không giữ tham chiếu | Tests  2 failed | 12 skipped (14) | Bị giết |
| R84-no-rollback | Bỏ transaction bao dọn | Tests  1 failed | 13 skipped (14) | Bị giết |
| R84-old-triggers | Bỏ nới trigger của migration 0011 | Tests  2 failed | 12 skipped (14) | Bị giết |
| R87-preview | Bỏ nhánh cùng RE trả 0 | Tests  1 failed | 19 skipped (20) | Bị giết |
| R92-clock | Trả clock 10:00 UTC tại UTC−11 | Tests  1 failed | 149 skipped (150) | Bị giết |
| R103-removed-rule | Bỏ check STAGE_KEPT_BY_MEETING | Tests  1 failed | 1 passed | 64 skipped (66) | Bị giết |
| R69-old-clock | Trả nguyên phép so timestamp cũ ở hai file | Tests  4 failed | 2 passed | 25 skipped (31) | Bị giết |

**15/15 bị giết; 0 sống.** Không đồng nhất việc mutant đỏ với bảo đảm mọi biến thể đều đúng; các probe/đối chiếu mới ở mục 4 bổ sung phần đó.

### 9.3 Bản kê file và dòng

Dòng là 1–N của file ở SHA ghim; metadata sinh được so với SQLite qua snapshot probe, test rà theo bản đồ seam.

| File | Dòng |
|---|---:|
| `packages/db/CLAUDE.md` | 1–54 |
| `packages/db/drizzle.config.ts` | 1–7 |
| `packages/db/migrations/0000_init.sql` | 1–33 |
| `packages/db/migrations/0001_customers_policies.sql` | 1–86 |
| `packages/db/migrations/0002_kyc.sql` | 1–44 |
| `packages/db/migrations/0003_kyc_append_only.sql` | 1–22 |
| `packages/db/migrations/0004_appointment_outcome_reviewer.sql` | 1–6 |
| `packages/db/migrations/0005_ai_analyses.sql` | 1–35 |
| `packages/db/migrations/0006_ai_analyses_append_only.sql` | 1–11 |
| `packages/db/migrations/0007_ai_analyses_chatgpt_web.sql` | 1–40 |
| `packages/db/migrations/0008_ai_analyses_append_only_rebuilt.sql` | 1–12 |
| `packages/db/migrations/0009_lookup_indexes.sql` | 1–3 |
| `packages/db/migrations/0010_people_team_none.sql` | 1–19 |
| `packages/db/migrations/0011_trash_purge.sql` | 1–28 |
| `packages/db/migrations/meta/0000_snapshot.json` | 1–203 |
| `packages/db/migrations/meta/0001_snapshot.json` | 1–742 |
| `packages/db/migrations/meta/0002_snapshot.json` | 1–1016 |
| `packages/db/migrations/meta/0003_snapshot.json` | 1–1016 |
| `packages/db/migrations/meta/0004_snapshot.json` | 1–1036 |
| `packages/db/migrations/meta/0005_snapshot.json` | 1–1248 |
| `packages/db/migrations/meta/0006_snapshot.json` | 1–1248 |
| `packages/db/migrations/meta/0007_snapshot.json` | 1–1248 |
| `packages/db/migrations/meta/0008_snapshot.json` | 1–1248 |
| `packages/db/migrations/meta/0009_snapshot.json` | 1–1265 |
| `packages/db/migrations/meta/0010_snapshot.json` | 1–1269 |
| `packages/db/migrations/meta/0011_snapshot.json` | 1–1269 |
| `packages/db/migrations/meta/_journal.json` | 1–90 |
| `packages/db/package.json` | 1–24 |
| `packages/db/src/ai-analyses.test.ts` | 1–737 |
| `packages/db/src/ai-analyses.ts` | 1–337 |
| `packages/db/src/appointments.test.ts` | 1–1318 |
| `packages/db/src/appointments.ts` | 1–591 |
| `packages/db/src/backup-engine.test.ts` | 1–22 |
| `packages/db/src/backup-invariants.test.ts` | 1–1274 |
| `packages/db/src/backup-validation.ts` | 1–465 |
| `packages/db/src/backup.test.ts` | 1–564 |
| `packages/db/src/backup.ts` | 1–206 |
| `packages/db/src/common.test.ts` | 1–42 |
| `packages/db/src/common.ts` | 1–189 |
| `packages/db/src/counts.test.ts` | 1–129 |
| `packages/db/src/counts.ts` | 1–90 |
| `packages/db/src/customers.test.ts` | 1–532 |
| `packages/db/src/customers.ts` | 1–591 |
| `packages/db/src/database.test.ts` | 1–746 |
| `packages/db/src/database.ts` | 1–247 |
| `packages/db/src/errors.ts` | 1–128 |
| `packages/db/src/golden-kyc.test.ts` | 1–71 |
| `packages/db/src/golden-metrics.test.ts` | 1–188 |
| `packages/db/src/ids.test.ts` | 1–33 |
| `packages/db/src/ids.ts` | 1–34 |
| `packages/db/src/index.ts` | 1–102 |
| `packages/db/src/kyc.test.ts` | 1–765 |
| `packages/db/src/kyc.ts` | 1–560 |
| `packages/db/src/migrations.ts` | 1–45 |
| `packages/db/src/policies.test.ts` | 1–214 |
| `packages/db/src/policies.ts` | 1–154 |
| `packages/db/src/purge.test.ts` | 1–573 |
| `packages/db/src/purge.ts` | 1–233 |
| `packages/db/src/reads.test.ts` | 1–232 |
| `packages/db/src/restore-roundtrip.test.ts` | 1–117 |
| `packages/db/src/schema.ts` | 1–395 |
| `packages/db/src/seed-data.ts` | 1–306 |
| `packages/db/src/seed-invariants.test.ts` | 1–209 |
| `packages/db/src/seed.test.ts` | 1–375 |
| `packages/db/src/seed.ts` | 1–685 |
| `packages/db/src/settings.test.ts` | 1–39 |
| `packages/db/src/settings.ts` | 1–29 |
| `packages/db/src/sql-raw.d.ts` | 1–5 |
| `packages/db/src/team.test.ts` | 1–490 |
| `packages/db/src/team.ts` | 1–345 |
| `packages/db/src/test-support.ts` | 1–40 |
| `packages/db/src/trash.test.ts` | 1–621 |
| `packages/db/src/trash.ts` | 1–264 |
| `packages/db/tsconfig.json` | 1–8 |
| `packages/domain/CLAUDE.md` | 1–53 |
| `packages/domain/package.json` | 1–12 |
| `packages/domain/src/appointment-counts.test.ts` | 1–155 |
| `packages/domain/src/appointment-counts.ts` | 1–116 |
| `packages/domain/src/compare.test.ts` | 1–224 |
| `packages/domain/src/compare.ts` | 1–80 |
| `packages/domain/src/customer-lifecycle.test.ts` | 1–131 |
| `packages/domain/src/customer-lifecycle.ts` | 1–63 |
| `packages/domain/src/evidence-level.test.ts` | 1–121 |
| `packages/domain/src/evidence-level.ts` | 1–52 |
| `packages/domain/src/golden/appointments.fixture.test.ts` | 1–50 |
| `packages/domain/src/golden/appointments.fixture.ts` | 1–133 |
| `packages/domain/src/golden/kyc.fixture.test.ts` | 1–68 |
| `packages/domain/src/golden/kyc.fixture.ts` | 1–271 |
| `packages/domain/src/golden/metrics.fixture.test.ts` | 1–112 |
| `packages/domain/src/golden/metrics.fixture.ts` | 1–245 |
| `packages/domain/src/golden/stage-snapshot.fixture.test.ts` | 1–74 |
| `packages/domain/src/golden/stage-snapshot.fixture.ts` | 1–222 |
| `packages/domain/src/index.ts` | 1–117 |
| `packages/domain/src/kyc-catalog.test.ts` | 1–81 |
| `packages/domain/src/kyc-catalog.ts` | 1–155 |
| `packages/domain/src/kyc-fact.test.ts` | 1–57 |
| `packages/domain/src/kyc-fact.ts` | 1–73 |
| `packages/domain/src/kyc-gate.test.ts` | 1–136 |
| `packages/domain/src/kyc-gate.ts` | 1–85 |
| `packages/domain/src/kyc.test.ts` | 1–398 |
| `packages/domain/src/kyc.ts` | 1–164 |
| `packages/domain/src/model.ts` | 1–110 |
| `packages/domain/src/money.test.ts` | 1–269 |
| `packages/domain/src/money.ts` | 1–188 |
| `packages/domain/src/name-order.test.ts` | 1–30 |
| `packages/domain/src/name-order.ts` | 1–10 |
| `packages/domain/src/number.test.ts` | 1–72 |
| `packages/domain/src/number.ts` | 1–43 |
| `packages/domain/src/period.test.ts` | 1–755 |
| `packages/domain/src/period.ts` | 1–434 |
| `packages/domain/src/pipeline-stage.test.ts` | 1–15 |
| `packages/domain/src/pipeline-stage.ts` | 1–8 |
| `packages/domain/src/stage-snapshot.test.ts` | 1–272 |
| `packages/domain/src/stage-snapshot.ts` | 1–169 |
| `packages/domain/src/stats-rf.test.ts` | 1–201 |
| `packages/domain/src/stats.test.ts` | 1–347 |
| `packages/domain/src/stats.ts` | 1–272 |
| `packages/domain/src/text.test.ts` | 1–115 |
| `packages/domain/src/text.ts` | 1–42 |
| `packages/domain/tsconfig.json` | 1–7 |

### 9.4 Kiểm cuối

- SHA: `119e2e45cbce54d8a3943757bd826a7f1e9b694f`.
- SHA-256 của **120/120 file** ở repo khớp đầu phiên; bản chép của mọi file có trong inventory cũng trở lại nguyên byte; 0 mismatch.
- Git status cuối:

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

- Chỉ thêm/sửa báo cáo, probe và log trong `C:\workspace\deep-review-1-6-r3\codex\A.md` và `…\codex\A\`. Cache/build bị ignore không dùng làm trạng thái task. Không còn lệnh chờ, phát hiện chưa kiểm, hoặc sửa đổi tạm trong repo.
- Giờ xong: **2026-10-20T01:17:56.176+07:00**. Đã kiểm cấu trúc báo cáo, bảng R đủ 8 mục và toàn bộ bằng chứng trước khi đổi dòng đầu XONG.

