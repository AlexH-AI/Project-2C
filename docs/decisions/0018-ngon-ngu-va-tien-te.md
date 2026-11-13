# ADR-0018: Ngôn ngữ và tiền tệ

- **Trạng thái:** Accepted (G1, G2): Owner duyệt ngày 12/11/2026 ("Duyệt G1 và G2"). G1 là quyết định và kiến trúc; G2 là golden `docs/golden/so-va-tien-te.md` và khóa `currency` của bảng `settings`.
- **Ngày:** 2026-11-12
- **Nguồn:** Owner 11–12/11/2026 trong chat ở Home PC (chín lượt nguyên văn: `docs/PROJECT-STATE.md`, hai mục 2026-11-11 và 2026-11-12; Issue #1221 mục Bối cảnh). Spec: `docs/design/phase-6-phan-hoi-dung-thu.md` §11 (Phần G).
- **Thay một phần:** ADR-0011 điểm 2 (giao diện chỉ tiếng Việt) và điểm 3 (tiền "1,2 tỷ" / "500 tr"); `docs/PROJECT-PLAN.md` §4.4 (đọc tiền VND "500tr", "1,2 tỷ"; ngôn ngữ Q13) và §4.6 (định dạng tiền "1,2 tỷ" / "500 tr").
- **Commit / PR:** T-418 (#1221) · PR: #1222

Mỗi điểm ghi rõ ai chốt: **Owner chốt** (nguyên văn ở `PROJECT-STATE.md`) hay **Claude đề xuất** (Owner duyệt trong PR #1222). Các điểm đề xuất được gom thành câu hỏi Q1–Q17 ở spec §11.3.

**Owner trả lời ngày 12/11/2026** các câu Q1–Q15 và Q17 (spec §11.3). Mọi đề xuất giữ như ghi, trừ ba chỗ đã sửa trong ADR này theo câu trả lời:

- ký hiệu của AUD, CAD, SGD: "$250 AUD" (Q1);
- bậc K của dạng gọn tiếng Việt (Q3);
- đơn vị ở ô nhập theo ngôn ngữ giao diện (Q6).

Q16, bảng thuật ngữ tiếng Anh (spec §11.6): Owner xem danh sách đầy đủ, sửa bốn từ, rồi "Còn lại duyệt". Bốn từ sửa: Team & nhân sự → "Team management"; Nhân sự → "staff"; Mất cơ hội → "lost opportunity"; RF → "referal", viết đúng chính tả là "Referral" (§1).

**Sau review phiên sạch của PR #1222** (head `33f631a`), Owner cùng ngày bảo "xử lý hết trong v1.0" và chọn "Sửa hết trên PR này" (spec §11.3, dưới bảng). Hai chỗ đổi luật ô nhập (§5):

- tiền có cent: "1.500" không đơn vị là 1.5 ("USD khác nhé, 1.500 là 1.5, còn 1,500 là 1500 USD");
- VND: "0.500 tr" được nhận là 0.5 tr ("Nhận là 0.5 tr").

Owner duyệt lại G2 cùng ngày cho các dòng golden đổi (X19, I38, I39) và các câu §5 ở trên (chọn "Duyệt"). Các sửa khác của vòng này chỉ là chữ: tên Issue dự kiến G-01 … G-16 (spec §11.7), câu về `chi-so.md` (Hệ quả), câu ngoại lệ của migration (§7).

**Sau review phiên sạch ở `831ec95`** (PASS kèm một ghi chú: luật "1.500" = 1.5 của tiền có cent, khi áp cho EUR), Owner cùng ngày chọn một quy chuẩn cho mọi tiền có cent, kể cả EUR: "Đưa về 1 quy chuẩn như cách viết với USD. Khi người dùng sử dụng Euro thì khi nhập sẽ có báo cách nhập cho đúng." §5 sửa hai câu lý do (người dùng EUR kiểu châu Âu cũng viết "1.500" cho 1500) và thêm câu hướng dẫn cách nhập của ô tiền EUR; golden thêm I40 (EUR "1.500" → €1.50). Owner duyệt lại G2 cùng ngày cho dòng I40 và các câu §5 này (chọn "Duyệt").

## Bối cảnh

Hôm nay app chỉ có tiếng Việt (ADR-0011) và mọi số tiền là VND. Tiền lưu bằng số nguyên đồng (`packages/domain/src/money.ts`) và viết kiểu Việt Nam: "500.000.000 ₫", "1,9 tỷ", "66,7%". Ô nhập đoán vai trò của `.` và `,` theo số chữ số đứng sau (`splitNumber`), nên "1.500" là 1500 còn "1,5" là 1,5.

Bản Mac phát hành cùng bản Windows. Hướng thương mại hóa (Mac App Store, `docs/design/nen-tang-mac-va-thuong-mai-hoa.md`) cần thêm bản tiếng Anh cho người dùng quốc tế. Owner, nguyên văn (lượt sau thay lượt trước ở chỗ khác nhau):

> "1 điểm anh thấy đang bỏ sót: UI song ngữ Việt - Anh. Cần có thêm 1 mục trong Cài đặt => Ngôn ngữ/Language và cho chọn Tiếng Việt hoặc English" (11/11)

> "Đưa vào v1.0 nhưng anh cần bổ sung thêm 1 ý có thể thay đổi khá nhiều kiến trúc, cần em cân nhắc: [...] với bản English, người dùng là quốc tế, hướng phát triển thương mại hóa sau này lên Mac App Store thì phải có 1 quy ước, cho chọn dạng tiền tệ, ví dụ: USD, Euro, AUD, CAD [...] Không áp tỉ giá quy đổi, đây chỉ là về phần hiển thị và số liệu nhập" (11/11)

> "Anh rút lại yêu cầu là cho đổi các dạng tiền tệ khi dùng app để tránh phát sinh lỗi code mà chúng ta khóa bằng 2 thiết lập: chọn dạng tiền tệ và ngôn ngữ khi thiết lập user [...] Sau khi chọn dạng tiền tệ thì không thể đổi được, nếu user muốn đổi là thiết lập lại từ đầu như 1 user mới, database mới hoàn toàn, starting fresh. Ngôn ngữ thì có thể chuyển đổi Anh - Việt bất kỳ khi nào. Tiếng Việt chỉ cho chọn khi tiền tệ chọn là Việt Nam Đồng." (11/11)

> "Em có thể làm chặt, áp dụng cách dùng dấu , và . của excel. Ví dụ 3000000 trên excel sẽ viết là 3,000,000 ngăn 3 số 0 bằng dấu , cho dễ nhìn. Dấu . là dùng cho số sau thập phân ví dụ 1.9 tỷ là 1 tỷ 900 triệu." Với dấu kiểu Excel ở giao diện tiếng Việt: "Cả tiếng Việt". (11/11)

> "Anh quyết định là bỏ JPY đi vì bộ tên người Nhật sẽ phức tạp thêm vấn nhiều vấn đề." "Với VNĐ thì dù ngôn ngữ có là tiếng Anh thì vẫn ghi là 3,000,000 VNĐ." "đã làm chặt theo luật Excel thì dữ liệu mẫu cũng phải thay thế lại theo chuẩn này nhé. Người dùng thực tế sẽ được hướng dẫn nhập đúng chuẩn để tránh nhập nhầm." (12/11)

## Quyết định

### 1. Ngôn ngữ

- **Owner chốt:** hai ngôn ngữ, Tiếng Việt và English. Cài đặt có mục mới "Ngôn ngữ / Language", đổi được bất kỳ lúc nào. Tiếng Việt chỉ chọn được khi tiền tệ của dữ liệu là VND; với tiền tệ khác, lựa chọn Tiếng Việt bị làm mờ, kèm một dòng lý do.
- Thuật ngữ ngành giữ tiếng Anh ở cả hai ngôn ngữ, như ADR-0011: FYP, KYC, N1–N4, RM, TL, IS, BD, BDM, MTD, KPI. Bảng thuật ngữ tiếng Anh Owner duyệt 12/11: spec §11.6.
- **RF** (Owner 12/11): tiếng Việt vẫn viết "RF"; English viết "Referral" (chỉ số "Chuyển RF" → "Referrals"). Owner: "RF là chỉ đích danh chỉ số chuyển RF: nghĩa là IS got referred from RM. RM đã khơi gợi nhu cầu thành công, phối hợp với IS để trình bày giải pháp (tương ứng với chuyển lên N2)". Định nghĩa chỉ số giữ như ADR-0007.
- **Claude đề xuất:**
  - **Lưu theo máy, không vào DB và backup.** Bảng `settings` đi theo backup (`dataTables` chép mọi bảng trừ `schema_migrations`), nên ngôn ngữ không để ở đó. Nếu để ở đó, nhập một backup sẽ đổi ngôn ngữ của máy đang dùng, và Mac với PC dùng chung file thì không chọn ngôn ngữ riêng được. Nơi lưu là bộ nhớ của WebView (`localStorage`, khóa `p2c.language`). Trạng thái "che tên KH" (đợt a, "Có nhớ") cũng nhớ theo máy, có thể dùng chung chỗ này.
  - **Chưa lưu gì thì theo tiền tệ:** VND thì Tiếng Việt, tiền tệ khác thì English. Máy đã lưu Tiếng Việt mà dữ liệu đang mở không phải VND thì app hiện English và giữ nguyên lựa chọn đã lưu.
  - **Đổi ngôn ngữ = tải lại giao diện:** app chờ hàng đợi lưu xong (như khi đóng cửa sổ) rồi tải lại; dữ liệu không đổi. Lý do: có nhãn được dựng sẵn ngay lúc nạp module, vd. `PERIOD_LABELS` của `apps/desktop/src/routes/period-labels.ts`. Tải lại đơn giản và chắc chắn hơn đổi nóng từng màn.

### 2. Tiền tệ của dữ liệu

- **Owner chốt:**
  - Bảy tiền tệ: **VND** (không số lẻ); **USD, EUR, GBP, AUD, CAD, SGD** (hai số lẻ, cent). JPY bỏ.
  - Không quy đổi tỷ giá: tiền tệ chỉ quyết định cách hiện và cách nhập số.
  - Mỗi bộ dữ liệu một tiền tệ, chọn một lần ở thiết lập ban đầu (§7), sau đó không đổi được. Muốn đổi thì "Thiết lập lại từ đầu".
  - Tiếng Việt chỉ đi với VND. English đi với cả bảy tiền tệ; VND hiện bằng tiếng Anh thì chỉ đổi chữ đơn vị: tỷ → Bil, triệu → Mil.
- **Claude đề xuất (G2):**
  - Tiền tệ là dữ liệu: khóa `currency` của bảng `settings` (key / value JSON, `packages/db/src/settings.ts`), giá trị là mã ISO 4217, vd. `"VND"`, `"USD"`. Khóa này đi theo file backup.
  - Đề xuất mức tiền tệ theo máy đã loại (Phương án 3): tiền tệ là thuộc tính của dữ liệu, không phải của máy.

### 3. Cách lưu tiền (Claude đề xuất)

- **Số nguyên theo đơn vị nhỏ nhất** của tiền tệ: đồng với VND, cent với tiền có cent. Dữ liệu VND hiện có giữ nguyên, không đổi con số nào.
- **Ba cột tiền** (`packages/db/src/schema.ts`) dùng tiền tệ của DB: `policies.submitted_fyp`, `policies.issued_fyp`, `appointments.expected_case_size`. Phần B không thêm cột tiền vì FYP hủy bằng FYP phát hành.
- **Kiểu tiền chung:** kiểu `Vnd` của `domain` thành kiểu tiền chung (tên chốt ở Issue, vd. `Money`), là số nguyên đơn vị nhỏ nhất. Từng số không mang tiền tệ riêng: tiền tệ là của cả DB và được truyền vào hàm định dạng / đọc. Bảng tiền tệ (§4) cố định trong `domain`.
- **Trần phí** (Owner chốt "100 Billions"): 100 Billions đơn vị chính, cho mọi tiền tệ.
  - VND: 100,000,000,000 đồng, bằng `MAX_FEE_VND` hôm nay (DR-23).
  - Tiền có cent: 10,000,000,000,000 cent.
  - Ba chỗ hôm nay kiểm theo `MAX_FEE_VND` mà chưa biết tiền tệ: `isFee` / `requireAmount` (`packages/db/src/common.ts`), luật nhập backup cho ba cột tiền (`FEES` của `backup-validation.ts`). Cả ba phải nhận tiền tệ. Khi nhập backup, app đọc tiền tệ của file trước rồi mới kiểm phí.
- **Hệ quả về độ chính xác của tổng.** Số nguyên an toàn (`Number.MAX_SAFE_INTEGER` = 9,007,199,254,740,991) chứa được tổng của:
  - 90,071 phí ở mức trần với VND (÷ 100,000,000,000);
  - chỉ **900** phí ở mức trần với tiền có cent (÷ 10,000,000,000,000).

  Vượt quá thì phép cộng báo lỗi, không cộng sai lặng lẽ (`addVnd` ném `RangeError`), như hôm nay. Ở mức thực tế (phí vài nghìn tới vài trăm nghìn USD) không chạm tới giới hạn này.

### 4. Định dạng số

- **Owner chốt:** dấu kiểu Excel cho mọi ngôn ngữ và mọi con số (tiền, số đếm, phần trăm, cỡ file): `,` ngăn hàng nghìn, `.` cho phần lẻ.
- **Owner chốt:** ký hiệu tiền.
  - VND ghi bằng chữ **"VNĐ"** (thay "₫"), đặt sau số, ở cả hai ngôn ngữ: "3,000,000 VNĐ".
  - Các tiền khác đặt ký hiệu trước số: "$1,250.50", "€250K".
  - Ba đồng đô la khác USD (Owner chọn 12/11, Q1): "Ví dụ $250 AUD, $250 CAD, $250 SGD. Đưa 3 chữ cái viết tắt của tiền tệ cùng dùng đồng Dollar sau con số. Dễ nhìn, dễ phân biệt hơn."
    - USD chỉ ghi "$", không kèm mã (Owner chọn "USD chỉ "$"").
    - Mã chỉ kèm ở dạng đầy đủ; dạng gọn không kèm mã: "$250K" (Owner chọn "Chỉ dạng đầy đủ kèm mã").
    - Đề xuất ban đầu của Claude ("A$", "C$", "S$") bị bỏ. CLDR tiếng Anh viết "A$", "CA$" và "SGD".
- **Claude đề xuất:** bảng tiền tệ cố định trong `domain`, không dùng `Intl` (Phương án 5).

  | Mã | Số lẻ | Dạng đầy đủ | Dạng gọn | Trần phí (số lưu) |
  |---|---|---|---|---|
  | VND | 0 | "VNĐ" sau số, cách một dấu cách: `3,000,000 VNĐ` | không kèm chữ VNĐ: `1.9 tỷ` | 100,000,000,000 |
  | USD | 2 | "$" trước số, viết liền: `$1,250.50` | `$1.25K` | 10,000,000,000,000 |
  | EUR | 2 | `€1,250.50` | `€1.25K` | 10,000,000,000,000 |
  | GBP | 2 | `£1,250.50` | `£1.25K` | 10,000,000,000,000 |
  | AUD | 2 | "$" trước, mã sau số: `$1,250.50 AUD` | `$1.25K` | 10,000,000,000,000 |
  | CAD | 2 | `$1,250.50 CAD` | `$1.25K` | 10,000,000,000,000 |
  | SGD | 2 | `$1,250.50 SGD` | `$1.25K` | 10,000,000,000,000 |

  Dạng gọn của AUD, CAD, SGD giống USD. Trong app không lẫn được, vì mỗi bộ dữ liệu chỉ có một tiền tệ; tiền tệ hiện ở Cài đặt, ở dạng đầy đủ, và trong file Excel.
- **Dạng đầy đủ** (ô số, bảng, hồ sơ, dòng đọc dưới ô nhập):
  - VND: "3,000,000 VNĐ".
  - Tiền có cent: **luôn hai số lẻ**, "$1,250.50", "$1,250.00" (Q2).
  - Số âm có dấu `-` đứng đầu, trước cả ký hiệu: "-$1,250.50", "-$1,250.50 AUD", "-3,000,000 VNĐ" (Q4).
- **Dạng gọn** (ô KPI, biểu đồ, cột hẹp). Owner chốt các bậc: English K / Mil / Bil / T; tiếng Việt tr / tỷ, "thêm bậc khi cần". Phần chi tiết (Owner chọn 12/11):
  - Bậc tiếng Việt: **K**, **tr**, **tỷ**. Owner chọn "K" như tiếng Anh, không dùng "nghìn" (Q3). Không có bậc nghìn tỷ: số lớn hơn vẫn tính bằng tỷ, "1,500 tỷ" (hôm nay "1.500 tỷ").
  - English có bậc T từ 1,000 Bil: "1.5T".
  - Đơn vị một chữ cái (K, T) viết liền số: "$250K", "750K", "1.5T". Đơn vị nhiều chữ cái cách số một dấu cách: "1.9 Bil", "500 tr" (Q5). Mẫu "€250K" và "1.9 Bil" của Issue theo đúng luật này.
  - Dưới 1,000 đơn vị chính thì hiện dạng đầy đủ: "950 VNĐ", "$950.50". Hôm nay ngưỡng này là 1 triệu.
  - Tối đa hai số lẻ, bỏ số 0 ở cuối. Làm tròn nửa xa số 0 (như `Math.round` trên trị tuyệt đối hôm nay). Làm tròn chạm 1,000 của một bậc thì lên bậc kế: 999,995 đồng thành "1 tr" / "1 Mil".
  - VND không kèm chữ VNĐ ở dạng gọn (hôm nay cũng không kèm ₫). Tiền có cent kèm ký hiệu trước: "$1.2 Mil".
  - Số âm: "-1.2 tỷ", "-$1.25K". Chênh lệch so kỳ trước có dấu "−" (U+2212) hoặc "+"; 0 thì không dấu, như `formatVndDelta` hôm nay.
- **Số khác:**
  - Số đếm: "1,204".
  - Phần trăm: một số lẻ, không ghi ".0", "-0" thành "0": "66.7%", "100%", "-2.4%".
  - Cỡ file: "3.1 MB", 1 KB = 1024 B.
- **Excel:** app ghi số thật kèm `numFmt`. Dấu ngăn khi xem file do cài đặt vùng của Excel trên máy mở file quyết định: một Excel đặt kiểu Việt Nam vẫn hiện `3.000.000`. App không ép được điều này, trừ khi ghi chữ thay cho số (mất cộng / lọc trong Excel). `numFmt` theo tiền tệ làm trong phần E.

Đầu vào → đầu ra của từng luật: golden `docs/golden/so-va-tien-te.md`.

### 5. Ô nhập tiền

- **Owner chốt:** ô nhập chặt theo cùng luật dấu. "1.500" là 1.5. Người dùng được hướng dẫn nhập đúng chuẩn.
- **Claude đề xuất:**
  - **Dấu:**
    - `,` chỉ để ngăn hàng nghìn: nhóm đúng 3 chữ số, nhóm đầu 1–3 chữ số và không bắt đầu bằng 0.
    - `.` chỉ cho phần lẻ, một lần.
    - Viết liền không dấu ngăn vẫn được: "3000000".
  - **Số lẻ:**
    - Không có đơn vị, VND: không có chữ số nào sau `.`, kể cả số 0. Vì vậy "1.500" bị từ chối với VND, kèm gợi ý "1,500": hai cách hiểu 1.5 và 1500 không bao giờ lặng lẽ thành một số.
    - Không có đơn vị, tiền có cent: `.` luôn là dấu phần lẻ; kết quả phải tròn cent, như khi có đơn vị. "1.500" là 1.5, lưu `150` ($1.50); "1.505" thì không (lẻ dưới 1 cent). Owner chốt 12/11, sau review PR #1222: "USD khác nhé, 1.500 là 1.5, còn 1,500 là 1500 USD".
    - **EUR theo cùng luật**, dù người dùng EUR kiểu châu Âu (Đức, Ý, Tây Ban Nha…) viết "1.500" cho 1500. Gõ theo thói quen đó thì app lưu `150` (€1.50, nhỏ đi 1000 lần) mà không báo lỗi, đúng loại lỗi mà luật `ambiguous` của VND (dưới) tránh. Chỗ chặn còn lại là câu hướng dẫn cách nhập của ô tiền EUR (gạch "Chữ mẫu và dòng đọc") và dòng đọc dưới ô ("€1.50").
      - Claude hỏi lại sau review `831ec95`, đưa hai lựa chọn: "EUR từ chối" (Claude đề xuất: "1.500" không đơn vị bị từ chối, kèm hai cách viết, như luật `ambiguous`) và "Giữ cho mọi tiền có cent". Owner không chọn cái nào mà tự gõ câu trả lời, chốt 12/11: "Đưa về 1 quy chuẩn như cách viết với USD. Khi người dùng sử dụng Euro thì khi nhập sẽ có báo cách nhập cho đúng."
      - Vì vậy sáu tiền có cent dùng một luật, có đơn vị cũng vậy: với EUR, "1.500 Mil" là 1.5 Mil như với USD (I37).
    - Có đơn vị: kết quả phải tròn đơn vị nhỏ nhất. "1.5 tỷ" được; "1.0000000001 tỷ" thì không.
  - **Đơn vị theo ngôn ngữ giao diện** (Owner chọn 12/11, Q6: "Theo ngôn ngữ giao diện"), không phân biệt hoa thường:
    - Tiếng Việt: nghìn / ngàn / k; triệu / tr; tỷ / tỉ; kèm các bản không dấu như hôm nay.
    - English: K, Mil, Bil.
    - Gõ đơn vị của ngôn ngữ kia là lỗi cách gõ, kèm gợi ý đổi đơn vị: "500 Mil" khi đang dùng tiếng Việt → gợi ý "500 tr".
    - Không ngôn ngữ nào nhận T: mọi số tính bằng nghìn tỷ đều đã quá trần phí. Cũng không nhận "m", "bn", "million". Vì không có đơn vị "t", "1.5t" là lỗi cách gõ, không bị đọc thành triệu hay nghìn tỷ.
  - **Cách nói của người Việt giữ nguyên** (Q7): "1tr5" = 1,500,000, "1 tỷ 2" = 1,200,000,000. Chỉ có ở giao diện tiếng Việt, và số trước đơn vị không có phần lẻ.
  - **Dấu tiền:**
    - VND nhận "VNĐ", "VND", "₫", "đ", "đồng" gõ sau số, ở cả hai ngôn ngữ (Owner chốt).
    - USD, EUR, GBP nhận ký hiệu của chính tiền tệ đó trước số, hoặc mã ISO trước / sau số.
    - AUD, CAD, SGD nhận "$" trước số, hoặc mã ISO trước / sau số ("$100 AUD"). Không nhận "A$", theo Q1.
    - Dấu của một tiền tệ khác là lỗi cách gõ.
  - **Cách gõ sai luật bị từ chối, app không tự hiểu lại.**
    - Nếu cách đọc cũ (`splitNumber` hôm nay, hay nhóm số bằng dấu cách) ra một số hợp lệ theo luật mới, dưới ô hiện gợi ý viết lại: "1,5 tỷ" → "1.5 tỷ"; "500.000.000" → "500,000,000"; "1.500" với VND → "1,500".
    - Người dùng bấm vào gợi ý thì gợi ý mới được điền, như gợi ý năm của `parseQuickDate` (chỉ đưa ra, không tự áp). Hình chốt ở mockup.
  - **Nhóm số bằng dấu cách** ("500 000 000", hôm nay được nhận) cũng thành lỗi kèm gợi ý, để chỉ còn một luật.
  - **Chữ mẫu và dòng đọc:** ô nhập có chữ mẫu theo ngôn ngữ và tiền tệ, vd. "500 tr · 1.5 tỷ", "$1,250.50 · 250K". Dòng đọc dưới ô (`amountRead`, "500,000,000 VNĐ (500 tr)") giữ nguyên.
    - **Ô nhập tiền EUR có câu hướng dẫn cách nhập.** Owner chốt 12/11, sau review `831ec95`: "Khi người dùng sử dụng Euro thì khi nhập sẽ có báo cách nhập cho đúng." Nội dung, vd.: `,` ngăn hàng nghìn, `.` cho phần lẻ, "1,500.00". Câu chữ, vị trí và lúc hiện chốt ở mockup G3 (spec §11.5) và i18n. Code làm ở Issue G-08 (spec §11.7), cùng thiết lập ban đầu, chỗ đầu tiên chọn được EUR.
  - **Với VND, một dấu `.` theo sau đúng 3 chữ số rồi tới đơn vị, khi phần nguyên khác `0`, bị từ chối** (mã lỗi mới `ambiguous`), kèm cả hai cách viết. Ví dụ "1.500 tr" → gợi ý "1.5 tr" hay "1,500 tr".
    - Lý do: hôm nay "1.500 tr" là 1,500 tr; luật dấu mới đọc thành 1.5 tr. Cả hai đều là phí hợp lệ, nên nhận lặng lẽ là đổi số gấp 1000 lần, đúng loại lỗi mà Phương án 6 tránh.
    - Luật này chỉ áp cho VND, ở cả hai ngôn ngữ ("1.500 Mil"). Nó giữ cho cách đọc và dữ liệu cũ của app, vốn đều là VND (hôm nay "1.500 tr" là 1,500 tr), không lặng lẽ đổi nghĩa. Tiền có cent là mới, chưa có dữ liệu hay cách đọc cũ nào trong app. Người dùng EUR kiểu châu Âu cũng quen viết "1.500" cho 1500, nhưng Owner chọn một quy chuẩn như USD, kèm câu hướng dẫn cách nhập (gạch "Không có đơn vị, tiền có cent" ở trên). Tiền có cent vẫn đọc "1.500 Mil" là $1,500,000.00 (€1,500,000.00 với EUR).
    - Phần nguyên `0` không nhập nhằng: "0.500 tr" là 0.5 tr theo cả cách đọc hôm nay (`splitNumber` đọc một dấu đứng sau `0` là dấu phần lẻ) lẫn luật mới, nên được nhận. Từ chối thì gợi ý thứ hai, "0,500 tr", lại sai luật nhóm (nhóm đầu không bắt đầu bằng 0). Owner chọn 12/11, sau review PR #1222: "Nhận là 0.5 tr".
    - Owner chọn 12/11 (Q17): "Từ chối, đưa hai cách viết".
- Ba trường tiền của KYC (`annualIncome`, `totalAssets`, `liabilities`) lưu chữ người dùng gõ; dòng đọc dưới các trường này (`kycAmountRead`) dùng cùng hàm đọc. Chữ đã lưu không đổi.
  - Chữ viết theo kiểu cũ thì chỉ mất dòng đọc, không bao giờ đọc ra một số khác. Lý do: mọi cách viết mà luật cũ và luật mới hiểu khác nhau đều bị từ chối: nhiều dấu `.`, `,` đứng trước phần lẻ, VND không đơn vị có `.`, và "1.500 tr" theo luật trên. Chữ kiểu cũ chỉ có ở dữ liệu VND (mọi dữ liệu hôm nay là VND), nên luật "1.500" = $1.50 của tiền có cent không chạm tới nó.

### 6. Ngày (Owner chốt 12/11)

- Một luật nhập **dd/mm/yyyy cho cả hai ngôn ngữ**, kể cả dạng gọn dd/mm của `parseQuickDate`. Chữ mẫu "dd/mm/yyyy". Không dùng mm/dd. Ngày vẫn lưu dạng ISO (`CalendarDate`).
- Bảng và ô nhập ghi "12/11/2026" ở cả hai ngôn ngữ.
- English hiện tên tháng ở chỗ đủ rộng: "12 Nov 2026", "Thu 12 Nov 2026", "9 – 15 Nov 2026", "November 2026". Danh sách chỗ rộng chốt ở mockup từng màn.
- Tuần vẫn tính từ Thứ Hai tới Chủ Nhật (ADR-0007).
- Lý do (Claude trả lời câu hỏi của Owner, 12/11):
  - Ngày lưu dạng ISO nên giữa hai ngôn ngữ không có xung đột dữ liệu.
  - Rủi ro của mm/dd là nhập nhầm mà không có lỗi nào báo: đổi ngôn ngữ thì "03/04" thành hai ngày khác nhau, nhất là với ngày hẹn gõ gọn "dd/mm".
  - Ở các nơi dùng sáu tiền tệ có cent, mm/dd là cách viết chính chỉ ở Mỹ. Canada dùng lẫn nhiều kiểu; các nơi còn lại viết dd/mm.

### 7. Thiết lập ban đầu, thiết lập lại, backup

- **Thiết lập ban đầu (wizard), Owner chốt thứ tự:**
  1. Video demo (làm khi UI/UX ở trạng thái final).
  2. Ngôn ngữ.
  3. Tiền tệ: chọn Tiếng Việt thì bước này chỉ có VND (tiền khác làm mờ); chọn English thì có đủ bảy tiền tệ.
  4. Nguồn dữ liệu: trắng / dữ liệu mẫu (giả lập) / file backup cùng tiền tệ.
- **DB mới hay DB cũ (Claude đề xuất):**
  - Phân biệt bằng nhánh `stored` của `openAppData` (`apps/desktop/src/data/app-data.ts`). Exe khởi động mà thư mục dữ liệu chưa có file DB (`storage.load()` không trả gì) là DB mới, vào wizard; hôm nay nhánh này tự seed dữ liệu mẫu. Có file thì mở như cũ, không qua wizard.
  - Không phân biệt được bằng khóa `currency`: DB mới cũng chạy mọi migration, nên migration không biết DB mới hay cũ.
- **Wizard không ghi gì cho tới bước cuối.** DB được dựng riêng rồi lưu thành một file, như `demoData` hôm nay. Thoát giữa chừng thì lần mở sau vào lại wizard.
- **Bản web** (`pnpm dev:web`, e2e) không có file. Bản này giữ như hôm nay: mở thẳng dữ liệu mẫu VND (seed ghi khóa `currency`), không qua wizard. E2e của wizard bật wizard bằng một tùy chọn của bản web, chốt ở Issue wizard.
- **Khóa cho DB cũ (Claude đề xuất):**
  - Một migration mới ghi `currency = "VND"` khi bảng `settings` chưa có khóa này.
    - Đây là khóa mới cho mọi DB cũ, không phải sửa dữ liệu sai. Nó là ngoại lệ có chủ ý của quy tắc "Dữ liệu hiện là giả lập" (R2-02, `CLAUDE.md` gốc) và câu "không viết migration dữ liệu" của `packages/db/CLAUDE.md`. Owner duyệt ngày 12/11/2026 (Q12: "Migration ghi VND").
  - File dữ liệu cũ (vd. của exe `5215b2e`) được nâng khi mở. Backup cũ được nâng khi nhập, như mọi migration (`importBackup` chạy các migration mà file còn thiếu).
  - Vì phiên bản schema tăng, exe cũ từ chối file mới (`SCHEMA_TOO_NEW`) thay vì đọc nhầm cent thành đồng. `BACKUP_FORMAT` (`project2c-backup`) giữ nguyên.
  - DB mới cũng có khóa VND sau migration; wizard hay seed ghi đè bằng tiền tệ đã chọn trước khi có dữ liệu.
- **Nhập backup (Claude đề xuất):**
  - Sau migration, file phải có khóa `currency` mang một trong bảy mã. Phí của file được kiểm theo trần của tiền tệ của file.
  - `importBackup` (`packages/db/src/backup.ts`) dựng DB mới và không thấy DB đang mở. Vì vậy app truyền vào tiền tệ mong đợi: tiền tệ của DB đang mở (Cài đặt → Dữ liệu), hay tiền tệ vừa chọn ở wizard.
  - Khác tiền tệ thì từ chối (mã lỗi mới, vd. `BACKUP_CURRENCY_MISMATCH`), thông báo nêu cả hai tiền tệ. Owner chốt cách xử lý: muốn dùng file đó thì thiết lập lại, chọn đúng tiền tệ, rồi nhập.
  - Backup cũ chưa có khóa được coi là VND, nhờ migration ở trên.
- **Thiết lập lại từ đầu.** Owner chốt: tự backup, tạo DB mới hoàn toàn, quay về wizard. Claude đề xuất phần chi tiết:
  - Cài đặt hiện tiền tệ chỉ để xem, kèm nút "Thiết lập lại từ đầu"; chỗ đặt chốt ở mockup. Hộp xác nhận bắt gõ chữ như các thao tác thay toàn bộ dữ liệu (`ConfirmWordDialog`).
  - App lưu nốt, tự backup file đang dùng (như Nạp lại / Nhập backup), rồi vào wizard.
  - File cũ vẫn là dữ liệu đang lưu cho tới khi wizard xong. Thoát giữa chừng thì chưa thiết lập lại: lần mở sau vẫn là dữ liệu cũ. Wizard xong mới thay file bằng DB mới, trong một lần ghi.
  - DB mới hoàn toàn: không giữ dòng `ai` của Cài đặt → AI. Khác với Nạp lại, nút này giữ dòng `ai` (DR5-50).
  - Key AI nằm trong kho key của hệ điều hành, thuộc về máy, nên không bị xóa; người dùng xóa trong Cài đặt → AI.
  - Wizard hỏi lại ngôn ngữ, chọn sẵn ngôn ngữ đang dùng.
- **Nạp lại dữ liệu mẫu (Claude đề xuất):**
  - Giữ tiền tệ của DB; nạp bộ mẫu của tiền tệ đó (§8); giữ dòng `ai` như hôm nay.
  - Hôm nay `reloadDemoData` chỉ mang dòng `ai` sang DB mới, nên phải mang thêm khóa `currency`.

### 8. Dữ liệu mẫu (Owner chốt, chi tiết Claude đề xuất)

- **VND:** dùng bộ tiếng Việt hiện có (`packages/db/src/seed.ts`, `seed-data.ts`), viết lại các số trong chữ theo luật mới: ghi chú, giá trị KYC, câu trả lời của AI giả lập (`packages/ai/src/mock-extraction.ts`, `mock-adapter.ts`). Issue kiểm từng chỗ có số.
- **Tiền có cent:**
  - Owner chốt: bộ tên tiếng Anh; con số theo độ lớn hợp với tiền có cent, không dùng số lớn như VND.
  - Claude đề xuất: cùng cấu trúc bộ VND (team, RM, KH, lịch, HĐ), seed cố định. Một bộ số dùng chung cho cả sáu tiền tệ, nhãn theo tiền đã chọn. Một phần phí có số lẻ cent, để người dùng thấy dạng đầy đủ.
  - Chữ của bộ tiếng Anh (ghi chú, KYC) viết bằng tiếng Anh. AI giả lập hôm nay chỉ đọc tiếng Việt; phần này chốt ở Issue của bộ mẫu tiếng Anh, cùng lúc với A6.
- **E2e và golden chỉ số** vẫn dùng bộ VND.

### 9. i18n trong code (Claude đề xuất)

- **Bộ khóa:** `en.ts` có cùng bộ khóa với `vi.ts`; khi bản tiếng Anh xong, typecheck bắt khóa thiếu.
  - Trong lúc dịch dần, `en.ts` thiếu khóa thì một test liệt kê các khóa thiếu.
  - Cài đặt chưa cho chọn English cho tới Issue dịch cuối cùng.
- **Số nhiều tiếng Anh** ("1 customer", "2 customers"): khóa tiếng Anh có hai dạng `one` / `other`, `t()` chọn theo ô đếm (`COUNT_SLOTS`). Tiếng Việt chỉ một dạng.
- **Chuỗi tiếng Việt ngoài `vi.ts`** (khoảng 1,050 dòng ở 122 file nguồn, đo 11/11) gom về i18n, trừ chỗ là dữ liệu: blocklist của `packages/ai`, mock, seed.
- **Chữ dùng để định dạng trong `domain`**: đơn vị nghìn / tr / tỷ / K / Mil / Bil / T, ký hiệu tiền, tên tháng tiếng Anh. Các chữ này nằm trong bảng của `domain`, như "tỷ", "tr", "₫" hôm nay, để golden kiểm được ngay ở `domain`. Nhãn giao diện vẫn đi qua i18n.
- **Luật repo:** `.claude/rules/i18n-ui.md` và dòng i18n của `CLAUDE.md` gốc sửa cùng PR code đầu tiên của phần G.

### 10. Phần đi cùng việc khác

- **AI** (G5, gộp vào A6): AI trả lời theo ngôn ngữ của app.
  - Ba cột tiền không gửi cho AI (rà 11/11).
  - Dữ kiện KYC về tiền (thu nhập, tổng tài sản, khoản vay) là chữ người dùng gõ và gửi nguyên văn, nên với DB tiền khác VND, chữ đó mang ký hiệu và đơn vị khác.
  - Hai prompt `analysis.ts`, `discovery.ts` ghi "tại Việt Nam". A6 xem lại câu này, và xem có cần báo tiền tệ cho AI không.
  - `kyc-catalog.ts` không có ngưỡng tiền nào (rà 12/11).
- **Excel** (phần E): ngôn ngữ theo app lúc xuất; `numFmt` theo tiền tệ. Hôm nay `numFmt` là `#,##0` và tiêu đề cột tiền ghi "(đồng)" (`report-workbook.ts`).
- **macOS:** khai hai ngôn ngữ vi + en cho gói app, để menu và hộp chọn file theo ngôn ngữ của app. Làm ở một Issue Mac sau, ghi vào ADR "Bản macOS".
- **Để sau:** hướng dẫn sử dụng tiếng Anh để sau v1.0; video demo làm khi UI/UX final.

## Phương án đã cân nhắc

1. **Đổi tiền tệ khi đang dùng** (Owner nêu ở lượt 2, rút lại ở lượt 3). Không quy đổi tỷ giá thì số đã nhập theo tiền cũ mất nghĩa. Hai cách làm máy móc đều hỏng:
   - Giữ nguyên con số đang hiện, nhân / chia số lưu theo số lẻ.
     - VND → USD nhân 100 (đồng → cent): HĐ 2 tỷ đ thành 200,000,000,000 cent, tức một HĐ $2,000,000,000.00. Nếu trần là một số lưu cố định như `MAX_FEE_VND` hôm nay (100,000,000,000, đọc thành $1 Bil khi là cent) thì HĐ này vượt trần.
     - Với trần theo đơn vị chính (§3), HĐ này không vượt trần, nhưng tổng chỉ còn chính xác tới 900 phí ở mức trần thay vì 90,071.
     - USD → VND chia 100 thì mất cent: $1,250.50 thành 1,250 hay 1,251 VNĐ. Đổi lại sang USD không lấy lại được $1,250.50.
   - Giữ số lưu, chỉ đổi tên tiền tệ: mọi số đổi giá trị gấp hay chia 100 mà không có gì báo.
2. **Lưu ×100 cố định cho mọi tiền tệ** (VND cũng lưu phần trăm đồng).
   - Mọi số VND đã lưu, mọi backup, golden và seed phải nhân 100.
   - Trần VND thành 10,000,000,000,000, nên tổng VND cũng chỉ chính xác tới 900 phí ở mức trần.
   - VND không có số lẻ, nên hai chữ số thêm không dùng vào việc gì.
3. **Tiền tệ theo máy** (lưu cạnh ngôn ngữ): Mac và PC dùng chung dữ liệu bằng file backup (Owner 11/11), nên cùng một file sẽ hiện thành hai tiền tệ trên hai máy.
4. **Tiền tệ đổi theo ngôn ngữ** (vi → VND, en → USD): đổi ngôn ngữ là số đổi nghĩa, và người dùng VND không chọn được giao diện tiếng Anh. Owner tách thành hai thiết lập (lượt 3).
5. **`Intl.NumberFormat` / `toLocaleString`:**
   - WebView2 (Chromium) và WKWebView (Safari) dùng dữ liệu ICU / CLDR khác phiên bản, và dữ liệu này đổi theo bản cập nhật hệ điều hành (ký hiệu "CA$", loại dấu cách không ngắt…). Hai bản app có thể ra chữ khác nhau, golden không đứng yên.
   - Cách viết Owner chọn (dấu kiểu Excel cả ở tiếng Việt, "VNĐ" sau số, Mil / Bil) không trùng locale CLDR nào.
   - Luật hiện hành cũng cấm `toLocaleString` (`.claude/rules/i18n-ui.md`).
6. **Ô nhập tự đoán dấu** (giữ `splitNumber`): "1.500" có thể là 1,500 hay 1.5 tùy người gõ; đoán sai là lặng lẽ lưu một số khác. Owner chọn luật chặt kèm hướng dẫn nhập (12/11).
7. **BigInt hay thư viện số thập phân để nới giới hạn của tổng:** sql.js trả `number`, JSON không có BigInt, và thư viện mới phải qua G4. Trần 100 Billions cộng số nguyên an toàn đủ cho dữ liệu thực tế (§3).
8. **Ngày mm/dd cho English:** Owner giữ dd/mm (12/11), lý do ở §6.
9. **JPY** (không số lẻ như VND): ISO 4217 ghi JPY có 0 chữ số lẻ, nên về kỹ thuật dùng được. Owner bỏ ngày 12/11 vì bộ tên người Nhật cho dữ liệu mẫu sinh thêm nhiều vấn đề. Nhóm không số lẻ chỉ còn VND.
10. **Lưu ngôn ngữ trong bảng `settings`:** ngôn ngữ đi theo backup. Nhập file từ máy khác sẽ đổi ngôn ngữ của máy này (§1).

## Lý do

- Tiền tệ là thuộc tính của dữ liệu, không phải của máy hay của ngôn ngữ, nên nằm trong DB và đi theo backup. Nhờ đó Mac và PC dùng chung file mà không ai đọc sai số.
- Ngôn ngữ chỉ là cách hiện, nên lưu theo máy.
- Không đổi tiền tệ trên dữ liệu đang có, nên cũng không cần mã chuyển đổi nào. Đó là lý do Owner rút lại yêu cầu ban đầu.
- Đơn vị nhỏ nhất theo tiền tệ giữ nguyên dữ liệu VND và golden chỉ số hiện có.
- Bảng định dạng cố định trong `domain` cho kết quả giống hệt nhau trên WebView2 và WKWebView, và golden kiểm được.

## Hệ quả

- **Mọi chỗ hiện số đổi dấu:** "500.000.000 ₫" → "500,000,000 VNĐ", "1,9 tỷ" → "1.9 tỷ", "66,7%" → "66.7%".
  - Golden `docs/golden/chi-so.md` đổi mọi số viết kiểu Việt cùng PR code của dấu kiểu Excel (Issue G-03, spec §11.7): phần trăm "66,7%" và tiền theo triệu nhóm bằng `.` ("1.000", "1.500", "2.580"…), mà luật mới đọc thành 1, 1.5, 2.58. Số lưu của fixture không đổi. E2e đổi chữ theo.
  - Mockup đợt a (`components.html`, `app-shell.html`) đổi số trong Issue mockup của phần G. Đợt b (T-417) và các đợt sau vẽ theo luật mới.
- **Thêm thao tác:** một bước thiết lập ban đầu (wizard) và một thao tác "Thiết lập lại từ đầu". Danh sách nghiệm thu thêm dòng cho hai việc này; màn đổi thì nghiệm thu lại (K46).
- **Exe cũ:** không mở được file DB / backup của bản mới (`SCHEMA_TOO_NEW`), như mọi lần nâng schema.
- **Mac và PC** dùng chung dữ liệu bằng file backup nên cùng tiền tệ; ngôn ngữ thì mỗi máy chọn riêng.
- **Tiền có cent:** tổng chỉ chính xác tới 900 phí ở mức trần (§3).
- **File Excel:** dấu ngăn khi xem tùy Excel của máy mở file (§4).
- **Thứ tự làm:** Issue code của phần G làm sau A, theo spec §11.7, ước 16 Issue. Golden D và mockup đợt c–e viết theo luật mới.

## Phụ lục — Mockup G3 đợt f (T-425 #1250; Owner duyệt G3 ngày 13/11/2026)

Mockup `docs/design/mockups/ngon-ngu-tien-te.html` vẽ những chỗ ADR này để lại cho mockup. **Owner duyệt G3 ngày 13/11/2026** trong chat ở Home PC (PR #1251): Claude hỏi từng điểm trong 14 điểm của mục `#ask`, mỗi điểm kèm phương án đề xuất và một phương án khác; Owner chọn phương án đề xuất ở cả 14 điểm (nhãn nguyên văn ở spec `phase-6-phan-hoi-dung-thu.md` §8, gạch "G3 đợt f"). Các điểm dưới đây vì vậy có hiệu lực. Không điểm nào đổi luật ở thân ADR hay golden.

- **Thiết lập ban đầu (§7):** mỗi bước một màn, có số bước và nút Quay lại. Bước ngôn ngữ viết bằng cả hai ngôn ngữ, chọn sẵn theo ngôn ngữ của máy. Bước tiền tệ: bảy thẻ, mỗi thẻ ghi cách viết số tiền; với Tiếng Việt sáu thẻ kia mờ kèm lý do; câu "chọn một lần" dưới tiêu đề, không có hộp hỏi lại. Bước dữ liệu chọn sẵn "Dữ liệu mẫu". File backup khác tiền tệ: thông báo nêu hai tiền tệ, hai nút "Chọn file khác" và "Quay lại bước Tiền tệ". Khi tới từ "Thiết lập lại từ đầu": một dải nhắc dữ liệu đang dùng còn nguyên, và nút "Quay về dữ liệu đang dùng".
- **Cài đặt (§1, §7):** mục thứ tư "Ngôn ngữ / Language" (tên viết bằng cả hai ngôn ngữ), đứng đầu danh sách; bấm một thẻ là đổi ngay và tải lại. Tiền tệ chỉ xem và nút "Thiết lập lại từ đầu" nằm trong mục Dữ liệu (Owner: "A · Trong Dữ liệu"; phương án bỏ: mục "Ngôn ngữ & tiền tệ"). Hộp xác nhận bắt gõ "THIẾT LẬP LẠI" ("START OVER"). Nhập backup khác tiền tệ: thêm một ca vào hộp "Không nhập được file", kèm nút mở thiết lập lại.
- **Ô nhập tiền (§5):** chữ mẫu "vd. 500 tr · 1.5 tỷ" / "e.g. 500 Mil · 1.5 Bil" / "e.g. 1,250.50 · 250K"; tên tiền tệ ở cuối ô; gợi ý là viên bấm được, ghi cả số tiền nó ứng với; bảng câu lỗi theo mã lỗi (tiếng Việt và bản dịch đề xuất) ở mục `#money` của mockup.
- **Câu hướng dẫn của ô tiền EUR (§5):** `"," separates thousands, "." is the decimal point: 1,500.00`, luôn hiện dưới mọi ô tiền khi tiền tệ là EUR; gõ kiểu "1.500" (được đọc là €1.50, I40) thì dòng đọc thêm gợi ý "1,500"; bước tiền tệ nói một lần khi chọn EUR (Owner: "A · Luôn hiện dưới ô"; phương án bỏ: chỉ hiện khi ô đang được gõ).
- **Chỗ rộng dùng tên tháng tiếng Anh (§6):** dòng dưới tên màn (kỳ đang xem), đầu bảng "Lưu ý", dòng đọc dưới ô ngày. Viên kỳ dùng dạng hẹp ("Nov 2026"); ô ngày và bảng giữ dd/mm/yyyy.
- **Mockup đợt a:** `components.html` và `app-shell.html` viết lại số theo luật mới trong cùng PR (chỉ đổi cách viết, không đổi giá trị), như mục "Hệ quả" đã ghi.
- **Kiểm:** ô gõ thử của mockup đọc đúng mọi dòng I01–I40, X01–X34, M01–M07 và hiện đúng mọi dòng F, C, D, N của golden (199 ca từ 155 dòng, script đọc thẳng file golden). Hàm trong mockup không phải code của app: Issue G-02 viết lại trong `packages/domain` và kiểm bằng fixture của golden.
