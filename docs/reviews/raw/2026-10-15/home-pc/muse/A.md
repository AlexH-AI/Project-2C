XONG — muse gói A, 22:54 14/10/2026

# Báo cáo rà soát sâu lượt 1 — gói A: Lõi dữ liệu

## 1. Thông tin phiên

- Bên rà soát: muse
- Gói: A (Lõi dữ liệu)
- Đường dẫn phạm vi: `packages/domain/**`, `packages/db/**`
- Kho mã nguồn: `C:\workspace\Project-2C-review-2`
- SHA ghim: `8855345` (`885534549808f42aec7f9af5743bbf86642ee4bd`)
- SHA đầu phiên: `885534549808f42aec7f9af5743bbf86642ee4bd` (khớp SHA ghim)
- Trạng thái kho đầu phiên (`status --short`):
  - `?? .agents/`
  - `?? .codex/`
  - `?? AGENTS.md`
  - (Ba mục trên là tập tin do bên khác tự sinh, không thuộc cây ghim; người rà soát không chạm tới.)
- Giờ bắt đầu: 22:38 14/10/2026 (+07:00)
- Giờ xong: 22:54 14/10/2026 (+07:00)
- Thư mục kết quả: `C:\workspace\deep-review-1-6\muse\A.md` và `C:\workspace\deep-review-1-6\muse\A\`
- Ghi chú: phiên làm mới (tập tin `A.md` chưa có trước phiên).
- Kết quả tóm tắt: 3 phát hiện (1 Low, 2 Nit), toàn bộ đã chạy probe kiểm chứng. Không có Critical, High hay Medium.

## 2. Phạm vi đã đọc

Đã đọc toàn bộ tập tin mã nguồn trong phạm vi (kể cả chú thích đầu tập tin), đối chiếu với đặc tả
`docs/design/phase-3-du-lieu.md`, `docs/design/phase-4-chi-so.md`, `docs/design/phase-6-hoan-thien.md`
(§4, §5), bốn tập tin golden (`chi-so`, `kh-theo-nhom`, `kyc`, `lich-hen`), ADR-0007, ADR-0008,
`docs/metrics/phase-6.md` và sổ `common\known.md`. Số dòng dưới là số dòng vật lý của tập tin ở SHA ghim.

### 2.1. `packages/domain/src` — mã nguồn (đọc toàn bộ)

| Tập tin | Dòng | Nội dung chính đã xét |
|---|---|---|
| `period.ts` | 434 | Ngày, kỳ, tuần, gợi ý năm sau, trần kỳ Tùy chọn, mốc biểu đồ và báo cáo |
| `money.ts` | 188 | Đọc số tiền gõ tay, đơn vị nói, trình bày gọn |
| `stats.ts` | 272 | Máy tính chỉ số, RF, tỉ lệ chốt, gom theo mốc và phạm vi |
| `stage-snapshot.ts` | 169 | Ảnh chụp nhóm khách hàng, chuỗi nhiều ngày |
| `appointment-counts.ts` | 116 | Đếm lịch hẹn bốn nhóm |
| `compare.ts` | 80 | Cửa sổ so kỳ trước, chênh lệch chỉ số |
| `customer-lifecycle.ts` | 63 | Chuyển nhóm cho phép, RF, nhóm tại ngày |
| `kyc.ts` | 164 | Ghi chú, dữ kiện, mâu thuẫn, băm, phiên bản |
| `kyc-gate.ts` | 85 | Cổng bốn trạng thái |
| `kyc-catalog.ts` | 155 | Tám hạng mục, trường chính, trường cốt lõi, ngưỡng |
| `kyc-fact.ts` | 71 | Kiểu trường, chuẩn hóa giá trị |
| `model.ts` | 110 | Thực thể chỉ số, vai trò, trạng thái |
| `evidence-level.ts` | 52 | Mức bằng chứng của đầu ra trí tuệ nhân tạo |
| `number.ts` | 43 | Nhóm nghìn, phần trăm, cỡ tập tin |
| `name-order.ts` | 10 | Thứ tự tên tiếng Việt |
| `pipeline-stage.ts` | 8 | Bốn nhóm N4–N1 |
| `index.ts` | 116 | Mặt ngoài gói |
| `golden/metrics.fixture.ts` | 245 | Kịch bản G01–G22 |
| `golden/stage-snapshot.fixture.ts` | 222 | Kịch bản S01–S13, M01–M04 |
| `golden/appointments.fixture.ts` | 133 | Kịch bản A01–A13 |
| `golden/kyc.fixture.ts` | 271 | Hồ sơ K01–K15 |

### 2.2. `packages/db/src` — mã nguồn (đọc toàn bộ)

| Tập tin | Dòng | Nội dung chính đã xét |
|---|---|---|
| `schema.ts` | 384 | Lược đồ Drizzle, ràng buộc kiểm tra, chỉ mục |
| `database.ts` | 229 | Mở dữ liệu, giao dịch, di trú, lưu câu lệnh |
| `migrations.ts` | 39 | Danh sách chín lần di trú |
| `common.ts` | 165 | Tên, ngày lưu, tiền, mã truy vấn |
| `errors.ts` | 108 | Mã lỗi và tham số |
| `ids.ts` | 34 | Mã ULID, mã base32 |
| `team.ts` | 320 | Lệnh nhóm và nhân sự |
| `customers.ts` | 370 | Lệnh khách hàng và chuyển nhóm |
| `appointments.ts` | 545 | Lệnh lịch hẹn và kết quả gặp |
| `policies.ts` | 154 | Lệnh hợp đồng |
| `kyc.ts` | 551 | Lệnh ghi chú, dữ kiện, phiên bản |
| `ai-analyses.ts` | 337 | Lưu và đọc lịch sử phân tích |
| `backup.ts` | 203 | Xuất và nhập tập tin sao lưu |
| `backup-validation.ts` | 438 | Kiểm giá trị và mười bốn luật liên bảng |
| `counts.ts` | 90 | Đếm trong câu truy vấn |
| `trash.ts` | 254 | Liệt kê Thùng rác, lý do chặn, hệ quả |
| `seed.ts` | 673 | Sinh dữ liệu giả lập |
| `seed-data.ts` | 306 | Bảng tên, trọng số |
| `settings.ts` | 29 | Đọc ghi cài đặt |
| `index.ts` | 96 | Mặt ngoài gói |
| `test-support.ts` | 39 | Dựng dữ liệu thử |
| `sql-raw.d.ts` | 5 | Kiểu nhập `.sql?raw` |

### 2.3. Di trú (đọc toàn bộ chín tập tin)

`migrations/0000_init.sql`, `0001_customers_policies.sql`, `0002_kyc.sql`,
`0003_kyc_append_only.sql`, `0004_appointment_outcome_reviewer.sql`, `0005_ai_analyses.sql`,
`0006_ai_analyses_append_only.sql`, `0007_ai_analyses_chatgpt_web.sql`,
`0008_ai_analyses_append_only_rebuilt.sql`. Đã xét cách dựng lại bảng, ràng buộc và trigger
chỉ thêm (đọc bốn tập tin đầu–cuối từng dòng, năm tập tin giữa theo khối thay đổi).

### 2.4. Kiểm thử trong phạm vi

- Chạy toàn bộ: `pnpm vitest run packages/domain packages/db` → 40 tập tin, 1229 ca, toàn bộ xanh
  (43,7 giây). Ghi nhận số để đối chiếu, không chạy lại ở cuối phiên.
- Đọc mẫu: `ids.test.ts` (toàn bộ), `customer-lifecycle.test.ts` (toàn bộ),
  cấu trúc `backup-invariants.test.ts` và các ca golden qua dữ liệu.
- Đột biến trên bản chép ngoài kho (xem phụ lục): hai đột biến, cả hai đều bị test bắt đỏ.
- Chưa đọc từng dòng toàn bộ tập tin `.test.ts` (khoảng mười một nghìn dòng); bù bằng cách chạy
  xanh toàn bộ, đột biến giết được và probe hành vi trực tiếp cho các luật quan trọng.

## 3. Phát hiện

```
ID: MU-A1
Mức: Low
Trục: E
Vị trí: packages/db/src/ids.ts:12 (8855345)
Tình trạng: CONFIRMED
Mô tả: Mã tạo ở mốc giờ trước năm 1970 chỉ dài 16–17 ký tự thay vì 26 ký tự
  như hợp đồng, và hai mốc khác nhau có thể cho cùng phần thời gian.
Tái hiện / bằng chứng: probe A\A1.mjs gọi ulid với đồng hồ ghim:
  1900-01-01 -> dài 17, 1969-12-31 -> dài 17 và cùng chuỗi với mốc 1900,
  1970-01-01 -> dài 26. Seed với mốc 1900 (probe A\A2.mjs) cho mã dài 16–17
  ký tự mà không báo lỗi. Nguyên nhân: vòng lấy 10 ký tự thời gian dùng
  charAt(time % 32); với time âm, số dư âm cho chuỗi rỗng.
Ảnh hưởng: Người dùng có đồng hồ máy sai về trước 1970, hoặc lệnh sinh dữ liệu
  chạy với mốc rất cũ, sẽ có dữ liệu mà mã không đúng dạng ULID 26 ký tự;
  thứ tự theo mã không còn đúng thứ tự thời gian. Mã vẫn khác nhau nhờ phần
  ngẫu nhiên nên chưa mất hay lẫn dữ liệu.
Đề xuất: Từ chối mốc trước 1970 ở hàm tạo mã, hoặc kẹp phần thời gian về 0
  kèm chú thích. Cỡ ước lượng: dưới 20 dòng mã nguồn và một ca thử.
```

```
ID: MU-A2
Mức: Nit
Trục: C
Vị trí: packages/db/src/team.ts:276, packages/db/src/customers.ts:311 (8855345)
Tình trạng: CONFIRMED
Mô tả: Vai trò nhân sự lạ và giới tính lạ không được lệnh kiểm trước, nên lỗi
  lộ ra là lỗi thô của kho dữ liệu thay vì lỗi có mã để màn hình dịch.
Tái hiện / bằng chứng: probe A\A2.mjs gọi createPerson với role 'XX' và không
  team -> lỗi thô "CHECK constraint failed: people_role"; gọi createCustomer
  với gender 'X' -> lỗi thô "CHECK constraint failed: customers_gender".
  (Vai trò lạ mà kèm team thì lệnh báo TEAM_NOT_ALLOWED, cũng không đúng ý.)
Ảnh hưởng: Chỉ tới được bằng cách gọi lệnh sai kiểu trong mã (màn hình dùng
  danh sách chọn nên không gửi được giá trị này); khi đó màn hình không có mã
  lỗi để hiện câu chữ đúng.
Đề xuất: Kiểm vai trò thuộc năm giá trị và giới tính thuộc hai giá trị ở đầu
  lệnh, ném lỗi có mã sẵn có. Cỡ ước lượng: dưới 30 dòng mã nguồn và vài ca thử.
```

```
ID: MU-A3
Mức: Nit
Trục: D
Vị trí: packages/db/src/schema.ts:64 (8855345)
Tình trạng: CONFIRMED
Mô tả: Ràng buộc kiểm tra ở tầng dữ liệu chỉ giữ nửa "RE và TL phải có nhóm",
  không giữ nửa "IS, BD, BDM luôn trống nhóm" như đặc tả dữ liệu §3.2.
Tái hiện / bằng chứng: probe A\A6.mjs ghi thẳng một người IS kèm nhóm bằng câu
  lệnh dữ liệu -> kho dữ liệu cho qua; ghi người RE thiếu nhóm -> bị chặn đúng.
  Hiện tại lệnh (TEAM_NOT_ALLOWED) và luật nhập sao lưu số 9 vẫn chặn đủ, nên
  chưa có đường nào trong app đưa được dữ liệu sai vào.
Ảnh hưởng: Lưới chặn cuối ở tầng dữ liệu thiếu một nửa; nếu sau này có thêm
  đường ghi mới mà quên kiểm, dữ liệu sai sẽ lọt qua.
Đề xuất: Thêm vế kiểm tra vào ràng buộc ở lần di trú kế tiếp (dữ liệu hiện tại
  đều đúng nên di trú an toàn). Cỡ ước lượng: dưới 10 dòng lược đồ và một ca thử.
```

Không phát hiện nào trùng sổ KNOWN mà có bằng chứng mới, nên không gắn nhãn KNOWN.
Các mục sổ đã đối chiếu và thấy vẫn đúng như mô tả: câu lệnh nhập sao lưu không
giải phóng (chấp nhận vì kho tạm đóng ngay), `listTrash` đọc toàn bộ ba bảng
(đo 45 ms trên dữ liệu tải, dưới ngưỡng), `res[0]` ở `fillTrash` (lệnh sinh cố
định quy mô nên chưa tới được), đếm RF theo chuyển nhóm (đúng nhờ bất biến mỗi
lịch một chuyển, luật nhập số 4 giữ).

## 4. Bloat

| Lần | Đã chạy / đọc gì | Dữ liệu | Số | Mã phát hiện |
|---|---|---|---|---|
| 1 | `tsc --noUnusedLocals --noUnusedParameters` cho `packages/domain` | Mã nguồn ở SHA ghim | 0 biến và tham số thừa | — |
| 2 | Lệnh trên cho `packages/db` | Như trên | 0 biến và tham số thừa | — |
| 3 | `pnpm lint:deps` (ranh giới module) | Toàn kho | Không vi phạm (309 module) | — |
| 4 | Tìm nơi nhập từng mặt ngoài của hai gói bằng tìm kiếm mã | Toàn kho | Mọi mặt ngoài trong `index.ts` đều có nơi dùng ở app, công cụ hoặc kiểm thử đầu-cuối | — |
| 5 | Xét hàm đọc đơn (`getAppointment`, `getPolicy`, `getTeam`, `getPerson`) | Toàn kho | Chỉ test dùng, nhưng đó là cửa đọc lại để kiểm thử, không phải thừa | — |
| 6 | Rà lặp mã từ ba nơi trở lên trong phạm vi | Hai gói | Không thấy khối lặp đáng gộp; các hàm dựng đối tượng theo từng thực thể là khác nhau đúng | — |
| 7 | Đối chiếu phụ thuộc của hai gói với nơi dùng | `package.json` hai gói | `drizzle-orm`, `sql.js`, `zod`, `@p2c/ai/schema` đều có nơi dùng; `domain` không phụ thuộc gì | — |

Kết luận bloat: không có phát hiện. Không đề xuất refactor nào trong gói A.

## 5. Hiệu năng

Máy đo: Home PC `DESKTOP-KDURKJP` (cùng máy với số tham chiếu `perf-ref.json`).
Việc chạy song song lúc đo: không có gì ngoài phiên rà soát này.
Dữ liệu: `common\load\load-2026-10-12-seed6.p2cbackup` (15,0 MB; 1 481 khách hàng,
10 252 lịch hẹn, 51 nhân sự sau khi trừ Thùng rác). Đo trong Node bằng probe
`A\A4.mjs` (nạp qua `importBackup` của `@p2c/db`).

| Lần | Đã chạy / đo gì | Dữ liệu | Số | Mã phát hiện |
|---|---|---|---|---|
| 1 | Đọc tập tin sao lưu vào chuỗi | Dữ liệu tải | 27 ms | — |
| 2 | Nhập sao lưu (dựng kho, di trú, kiểm giá trị và 14 luật) | Dữ liệu tải | 791 ms (một lần) | — |
| 3 | Đếm bản ghi (`countRecords`) | Dữ liệu tải | Trung vị 5 ms (4–6, năm lần) | — |
| 4 | Liệt kê Thùng rác (`listTrash`, 117 dòng) | Dữ liệu tải | Trung vị 45 ms (41–53, năm lần) | — |
| 5 | Xuất sao lưu thành chuỗi (15,7 triệu ký tự) | Dữ liệu tải | Trung vị 169 ms (169–171, ba lần) | — |
| 6 | Chỉ số một tháng (`periodMetrics`) | Dữ liệu tải | Trung vị 1 ms (năm lần) | — |
| 7 | Đếm lịch một tháng (`appointmentCounts`) | Dữ liệu tải | Trung vị 1 ms (năm lần) | — |
| 8 | Ảnh chụp nhóm (`stageSnapshot`) | Dữ liệu tải | Trung vị 1 ms (năm lần) | — |
| 9 | Chỉ số gom theo phạm vi (`periodMetricsByScope`) | Dữ liệu tải | Trung vị 1 ms (năm lần) | — |
| 10 | Đếm bản ghi của một khách hàng | Dữ liệu tải | Trung vị 2 ms (năm lần) | — |

Đối chiếu ngưỡng: mọi thao tác tính toán trên màn hình (lần 3, 4, 6–10) đều dưới
ngưỡng 200 ms đã chốt, với biên lớn (chậm nhất là Thùng rác 45 ms, trong Node;
số tham chiếu cùng máy trên exe cho mở Thùng rác là 80 ms, cũng dưới ngưỡng).
Nhập và xuất sao lưu là việc có hộp tiến trình, không thuộc ngưỡng thao tác màn
hình; số lần 2 đo trọn `importBackup` trong Node nên không so trực tiếp với bước
`backup.import` 49 ms của probe trên exe.

Kết luận hiệu năng: không có phát hiện P trong gói A.

## 6. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Low | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Nit | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| Tổng | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |

Tỉ lệ CONFIRMED là 3/3 (100%), không có PLAUSIBLE. Không gắn KNOWN vì không có
bằng chứng mới cho mục sổ nào.

## 7. Trục đã xét mà không thấy gì

- E (ca biên, còn lại sau MU-A1): đã chạy probe ngày nhanh ở biên 1900 và 2100
  (gợi ý năm sau về `null` đúng, không ném lỗi), trần kỳ Tùy chọn (31/01 → 30/04,
  15/11/2100 → 31/12/2100, khớp bảng đặc tả), tiền biên (`0`, `1,0`, `100 tỷ`,
  `1tr5`, `1 tỷ 2`, số âm với hai dấu trừ, `+500` bị từ chối) và kịch bản khôi
  phục E6/E7 (chặn D10 đúng, khôi phục không thêm chuyển nhóm đúng). Đã đọc toàn
  bộ `period.ts`, `money.ts`, `customer-lifecycle.ts` và đường D7/D10.
- C (đúng hợp đồng, còn lại sau MU-A2): đã đối chiếu bốn bộ golden với tập tin
  kiểm thử (G01–G22, S01–S13, A01–A13, K01–K15) — số tay khớp mã; chạy xanh toàn
  bộ 1229 ca. Đã xét RF, tỉ lệ chốt, tuần Thứ Hai–Chủ Nhật, MTD, ảnh chụp mốc,
  bốn nhóm lịch hẹn, cổng KYC và cờ material — đều khớp ADR-0007, ADR-0008 và
  đặc tả giai đoạn 4.
- D (dữ liệu, còn lại sau MU-A3): đã xét giao dịch bọc mọi lệnh, lui toàn bộ khi
  từ chối, `seq` an toàn, bất biến `customers.stage`, rút chuyển nhóm theo D7,
  khôi phục kiểm lại ngày và người, mười bốn luật nhập sao lưu, di trú tắt khóa
  ngoại rồi kiểm lại. Probe E6/E7 và đếm sau xóa/khôi phục đều đúng.
- G (guardrail trí tuệ nhân tạo): gói A chỉ giữ việc lưu lịch sử phân tích và
  tính mức bằng chứng, không giữ bộ kiểm đầu ra. Đã đọc `ai-analyses.ts` (kiểm
  nhãn, kiểm nội dung, luật 11–14 khi nhập) và `evidence-level.ts` (bậc theo số
  dữ kiện, hạ một bậc khi không mới) — đúng đặc tả giai đoạn 5 §6.3, §7.
- S (an toàn ranh giới): đã chạy probe chuỗi 101 MB (từ chối `BACKUP_TOO_LARGE`
  sau 0 ms, không đọc), JSON lồng sâu năm mươi nghìn tầng (`BACKUP_INVALID` sau
  6 ms, không treo), ký tự NUL trong văn bản nhập (bị từ chối ở mọi đường).
  Ranh giới khóa, đường dẫn và CSP thuộc gói B, không nằm ở đây.
- P (hiệu năng): đã đo mười mục trên dữ liệu tải (xem §5), toàn bộ thao tác màn
  hình dưới ngưỡng. Không đo trên exe vì số tham chiếu cùng máy đã có và phần
  Node đã đủ sâu cho gói này.
- B (bloat): đã chạy kiểm biến thừa, kiểm ranh giới, rà mặt ngoài và lặp mã
  (xem §4). Không thấy mã chết, export thừa hay phụ thuộc thừa.
- T (chất lượng test): đã chạy xanh 1229 ca và giết hai đột biến trên bản chép
  (RF nhận nhầm N4→N3 bị một ca bắt; đuôi nói `1tr5` tính sai bị bảy ca bắt).
  Không thấy test phụ thuộc ngày hệ thống (đồng hồ ghim), thứ tự hay ngẫu nhiên
  trong phạm vi đọc.
- A (trợ năng, đa ngữ): gói A không giữ chuỗi màn hình (mã lỗi do app dịch ở gói
  khác); chuỗi ngày `dd/mm/yyyy` và tóm tắt phiên bản KYC đúng dạng. Không có gì
  để xét thêm.

## 8. Phụ lục

### 8.1. Nguồn probe

Thư mục `C:\workspace\deep-review-1-6\muse\A\` giữ sáu probe chạy bằng Node trực
tiếp (mỗi tập tin tự ghi cách chạy ở dòng đầu, dùng chung móc nạp TypeScript
chép theo mẫu `tools/load-data.mjs`):

| Probe | Việc | Kết quả |
|---|---|---|
| `A1.mjs` | ULID ở năm mốc 1900–2100; mã base32; mười bốn chuỗi tiền biên | Mốc trước 1970 cho mã dài 17 (MU-A1); tiền đúng |
| `A2.mjs` | Vai trò lạ, giới tính lạ, seed mốc 1900 | Lỗi thô (MU-A2); seed cho mã dài 16–17 |
| `A3.mjs` | Xóa rồi khôi phục lịch Đã gặp theo E6/E7; đếm sau khôi phục | Chặn và cho qua đều đúng; Thùng rác nêu đúng lý do |
| `A4.mjs` | Nhập dữ liệu tải rồi đo mười mục | Số ở §5 |
| `A5.mjs` | Chuỗi 101 MB, JSON lồng sâu, ngày nhanh biên, trần kỳ | Từ chối nhanh và đúng; trần khớp đặc tả |
| `A6.mjs` | Ghi thẳng người IS kèm nhóm bằng câu lệnh dữ liệu | Kho cho qua (MU-A3); RE thiếu nhóm bị chặn |

Đột biến trên bản chép (thư mục `A\mut1`, `A\mut2`, chạy `vitest` với gốc ở đó):

| Đột biến | Test bắt | Kết quả |
|---|---|---|
| `isRfTransition` nhận thêm N4→N3 | `RF transitions > counts only a move from N4/N3 up to N2/N1` | Bị giết (1 đỏ, 11 xanh) |
| Đuôi nói `1tr5` thành `005` thay vì `500` | Bảy ca trong `money.test.ts` | Bị giết (7 đỏ, 136 xanh) |

### 8.2. Trạng thái kho cuối phiên

`git -C C:\workspace\Project-2C-review-2 status --short` cuối phiên cho đúng ba
dòng như đầu phiên (`?? .agents/`, `?? .codex/`, `?? AGENTS.md`); không có thay
đổi nào trong cây ghim. Mọi lệnh test chỉ ghi vào bộ nhớ đệm đã bỏ qua của kho.

### 8.3. Giờ xong

22:54 14/10/2026 (+07:00). Báo cáo đủ tám mục theo khuôn; gói A dừng ở đây.
