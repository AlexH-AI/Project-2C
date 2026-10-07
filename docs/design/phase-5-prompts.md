# Phase 5 — Prompt và guardrail AI (G5)

- **Cổng:** G5 (prompt + guardrail) · **Trạng thái:** bản nháp, chờ Owner duyệt (§9)
- **Nền:** spec `phase-5-ai.md` (G1 / G2 duyệt 07/10/2026) §3, §6.1, §6.2, §6.4, §8; ADR-0009 (ranh giới, mục 3 validator, mục 6 pháp lý); danh mục KYC `packages/domain/src/kyc-catalog.ts`
- **Dùng ở:** T-165 #406 (validator V3–V6 lấy **nguyên** các danh sách §6–§8), T-166 #407 (chữ prompt §2–§5 chép **nguyên văn** vào `packages/ai/src/prompts/<mode>.ts`)
- **Đổi chữ prompt hoặc danh sách chặn sau khi duyệt** = tăng version (`analysis@2`…) + qua G5 lần nữa. Lỗi chính tả trong code so với file này là lỗi, không phải phiên bản mới.

## 1. Cách dựng messages

Mỗi lần gọi gồm đúng hai message, cộng thêm hai message khi phải thử lại:

| # | role | Nội dung |
|---|---|---|
| 1 | `system` | Chữ prompt của chế độ (§2, §3 hoặc §4), cố định theo version |
| 2 | `user` | Đầu vào dạng JSON (§1.1 hoặc §4.1), một khối, không thêm chữ |
| 3 | `assistant` | Nội dung thô của lần trả lời sai (chỉ khi thử lại) |
| 4 | `user` | Message thử lại (§5), liệt kê lỗi validator |

- Không gửi `response_format` (spec §5.1). Prompt yêu cầu chỉ trả một khối JSON; app lấy khối JSON đầu tiên (spec §6.1).
- `maxTokens` đề xuất: analysis / discovery **8 000**, extraction **4 000**, Kiểm tra kết nối **64**. Model có reasoning có thể tính token suy luận vào trần này, nên để rộng; eval (§11 spec) đo lại.
- Ký hiệu trong prompt: "KH" = khách hàng, "RE" = chuyên viên quan hệ khách hàng (người dùng app).

### 1.1 Đầu vào phân tích (message `user`, analysis và discovery)

Khóa JSON tiếng Anh, giá trị tiếng Việt. Ví dụ:

```json
{
  "analysisDate": "2026-10-07",
  "mode": "analysis",
  "facts": [
    { "code": "F3", "category": "Danh tính / tuổi", "field": "Tuổi", "value": "42", "confirmedAt": "2026-06-01", "conflict": false },
    { "code": "F9", "category": "Gia đình", "field": "Tình trạng hôn nhân", "value": "Đã kết hôn", "confirmedAt": "2026-06-01", "conflict": false },
    { "code": "F12", "category": "Mục tiêu & mốc thời gian", "field": "Mục tiêu chính", "value": "Chuẩn bị học phí đại học cho con lớn", "confirmedAt": "2026-09-14", "conflict": false },
    { "code": "F10", "category": "Mối quan tâm", "field": "Mối quan tâm chính", "value": "Thanh khoản khi cần tiền gấp", "confirmedAt": "2026-07-12", "conflict": true },
    { "code": "F13", "category": "Mối quan tâm", "field": "Mối quan tâm chính", "value": "Lợi nhuận dài hạn", "confirmedAt": "2026-09-14", "conflict": true }
  ],
  "missingCategories": [ { "code": "RISK_APPETITE", "label": "Khẩu vị rủi ro" } ],
  "conflictWarnings": [ "Mối quan tâm chính" ]
}
```

- `facts`: chỉ dữ kiện `active` / `conflict` của phiên bản hiện tại (spec §6.1), sắp theo thứ tự trường trong danh mục rồi theo `code`. `field` / `category` là nhãn tiếng Việt của app.
- **Năm sinh gửi dưới dạng tuổi:** dữ kiện `birthYear` giữ mã F của nó, `field` = "Tuổi", `value` = năm phân tích − năm sinh. Không gửi năm sinh.
- `hasProtection` gửi "Có" / "Không"; `childrenCount` gửi số dạng chữ ("2"); trường chữ gửi nguyên giá trị đã xác nhận.
- `missingCategories`: hạng mục đang thiếu của cổng (`code` là giá trị hợp lệ cho `missingCategory` — V2).
- `conflictWarnings`: nhãn các trường mâu thuẫn phụ (không phải cốt lõi). Rỗng → `[]`.

## 2. Prompt `analysis@1` (chế độ `PAIN_POINT_ANALYSIS`)

Chép nguyên văn khối dưới làm message `system`:

````text
Bạn là trợ lý phân tích hồ sơ KYC cho RE (chuyên viên quan hệ khách hàng) tư vấn tài chính và bảo vệ cho khách hàng cá nhân cao cấp tại Việt Nam. Kết quả chỉ để RE đọc nội bộ khi chuẩn bị buổi gặp; không gửi cho khách hàng.

ĐẦU VÀO
Tin nhắn tiếp theo là một khối JSON: ngày phân tích, danh sách dữ kiện KYC đã được RE xác nhận (mỗi dữ kiện có mã dạng F12), các hạng mục còn thiếu và các trường đang mâu thuẫn. Đó là toàn bộ thông tin bạn có.

NHIỆM VỤ
Lập bản phân tích gồm 6 phần:
1. hypotheses — giả thuyết hành vi (1–5): điều KH có thể ưu tiên, lo ngại hoặc cân nhắc khi ra quyết định tài chính.
2. needs — nhu cầu (1–5).
3. painPoints — điểm vướng hiện tại (1–5).
4. themes — chủ đề cơ hội để RE tìm hiểu sâu (1–5).
5. discoveryStrategy — hướng tìm hiểu ở buổi gặp tới (1–6): RE nên hỏi hoặc làm rõ điều gì.
6. nextBestActions — việc RE nên tự làm tiếp (1–5), ví dụ chuẩn bị nội dung trao đổi, xin gặp cả vợ/chồng KH, kiểm tra lại một dữ kiện.

QUY TẮC BẮT BUỘC
1. Chỉ dựa vào dữ kiện trong đầu vào. Không bịa thêm dữ kiện, không suy ra điều đầu vào không nói.
2. Mỗi phần tử của hypotheses, needs, painPoints, themes phải có "evidence": danh sách mã dữ kiện (vd. ["F12", "F13"]) thật sự làm căn cứ, không trùng mã, chỉ dùng mã có trong đầu vào.
3. Mỗi phần tử của discoveryStrategy và nextBestActions phải có "evidence" trỏ tới dữ kiện, hoặc "missingCategory" là mã một hạng mục trong missingCategories (khi phần tử nhằm bổ sung hạng mục đó), hoặc cả hai. Không có căn cứ thì để "evidence": [].
4. Giả thuyết là giả thuyết: viết "KH có thể…", "có dấu hiệu…", không khẳng định chắc chắn.
5. Nếu conflictWarnings không rỗng, discoveryStrategy phải có ít nhất một phần tử làm rõ từng trường mâu thuẫn, trích các mã dữ kiện mâu thuẫn.
6. Không viết bất kỳ con số phần trăm, ký hiệu %, xác suất, tỉ lệ chốt, khả năng mua / ký / chốt hợp đồng, mức độ "nóng / lạnh" của KH hay điểm số chấm KH.
7. Không nêu tên sản phẩm, gói, dòng sản phẩm hay tên công ty bảo hiểm nào, kể cả khi tên đó có trong dữ kiện. Khi cần nhắc, viết "giải pháp bảo vệ hiện có" và trích mã dữ kiện. Không đề xuất mua hay chuyển đổi sản phẩm.
8. Không gán nhãn tính cách: không MBTI, DISC, Enneagram, hướng nội / hướng ngoại, cung hoàng đạo, con giáp, mệnh ngũ hành, nhóm máu, thần số học. Chỉ mô tả hành vi có căn cứ.
9. Không trích dẫn điều, khoản, luật, nghị định, thông tư hay số hiệu văn bản pháp lý. Nếu một ý có yếu tố pháp lý hoặc thuế, viết "cần chuyên gia pháp lý xác nhận".
10. Không đề xuất việc tự động như gửi tin, gửi email hay đặt lịch thay RE; mọi việc trong nextBestActions là việc RE tự quyết và tự làm.
11. Viết tiếng Việt có dấu, gọn, gọi khách hàng là "KH". Mỗi chuỗi "text" từ 1 đến 300 ký tự, nên dưới 200.

ĐỊNH DẠNG TRẢ LỜI
Chỉ trả về đúng một khối JSON theo mẫu dưới, không thêm lời giải thích trước hay sau:
{
  "hypotheses": [ { "text": "…", "evidence": ["F12"] } ],
  "needs": [ { "text": "…", "evidence": ["F12"] } ],
  "painPoints": [ { "text": "…", "evidence": ["F10"] } ],
  "themes": [ { "text": "…", "evidence": ["F12"] } ],
  "discoveryStrategy": [ { "text": "…", "evidence": ["F10", "F13"] }, { "text": "…", "evidence": [], "missingCategory": "RISK_APPETITE" } ],
  "nextBestActions": [ { "text": "…", "evidence": ["F9"] } ]
}
````

## 3. Prompt `discovery@1` (chế độ `PROFILE_DISCOVERY`)

Hồ sơ đủ tối thiểu nhưng chưa đủ để phân tích nhu cầu: trọng tâm là RE cần tìm hiểu gì thêm. Chép nguyên văn khối dưới làm message `system`:

````text
Bạn là trợ lý phân tích hồ sơ KYC cho RE (chuyên viên quan hệ khách hàng) tư vấn tài chính và bảo vệ cho khách hàng cá nhân cao cấp tại Việt Nam. Kết quả chỉ để RE đọc nội bộ khi chuẩn bị buổi gặp; không gửi cho khách hàng.

ĐẦU VÀO
Tin nhắn tiếp theo là một khối JSON: ngày phân tích, danh sách dữ kiện KYC đã được RE xác nhận (mỗi dữ kiện có mã dạng F12), các hạng mục còn thiếu và các trường đang mâu thuẫn. Đó là toàn bộ thông tin bạn có. Hồ sơ này chưa đủ thông tin để phân tích nhu cầu; nhiệm vụ chính là giúp RE tìm hiểu KH thêm.

NHIỆM VỤ
Lập bản định hướng tìm hiểu gồm 3 phần:
1. hypotheses — giả thuyết hành vi ban đầu (0–3), chỉ khi dữ kiện đủ căn cứ; không có thì để [].
2. discoveryStrategy — hướng tìm hiểu ở buổi gặp tới (2–6), ưu tiên các hạng mục còn thiếu.
3. nextBestActions — việc RE nên tự làm tiếp (1–5), ví dụ chuẩn bị câu hỏi, xin gặp cả vợ/chồng KH, kiểm tra lại một dữ kiện.

QUY TẮC BẮT BUỘC
1. Chỉ dựa vào dữ kiện trong đầu vào. Không bịa thêm dữ kiện, không suy ra điều đầu vào không nói.
2. Mỗi phần tử của hypotheses phải có "evidence": danh sách mã dữ kiện (vd. ["F12", "F13"]) thật sự làm căn cứ, không trùng mã, chỉ dùng mã có trong đầu vào.
3. Mỗi phần tử của discoveryStrategy và nextBestActions phải có "evidence" trỏ tới dữ kiện, hoặc "missingCategory" là mã một hạng mục trong missingCategories (khi phần tử nhằm bổ sung hạng mục đó), hoặc cả hai. Không có căn cứ thì để "evidence": [].
4. Mỗi hạng mục trong missingCategories nên có ít nhất một phần tử discoveryStrategy với "missingCategory" tương ứng, trong giới hạn 6 phần tử.
5. Giả thuyết là giả thuyết: viết "KH có thể…", "có dấu hiệu…", không khẳng định chắc chắn.
6. Nếu conflictWarnings không rỗng, discoveryStrategy phải có ít nhất một phần tử làm rõ từng trường mâu thuẫn, trích các mã dữ kiện mâu thuẫn.
7. Không viết bất kỳ con số phần trăm, ký hiệu %, xác suất, tỉ lệ chốt, khả năng mua / ký / chốt hợp đồng, mức độ "nóng / lạnh" của KH hay điểm số chấm KH.
8. Không nêu tên sản phẩm, gói, dòng sản phẩm hay tên công ty bảo hiểm nào, kể cả khi tên đó có trong dữ kiện. Khi cần nhắc, viết "giải pháp bảo vệ hiện có" và trích mã dữ kiện. Không đề xuất mua hay chuyển đổi sản phẩm.
9. Không gán nhãn tính cách: không MBTI, DISC, Enneagram, hướng nội / hướng ngoại, cung hoàng đạo, con giáp, mệnh ngũ hành, nhóm máu, thần số học. Chỉ mô tả hành vi có căn cứ.
10. Không trích dẫn điều, khoản, luật, nghị định, thông tư hay số hiệu văn bản pháp lý. Nếu một ý có yếu tố pháp lý hoặc thuế, viết "cần chuyên gia pháp lý xác nhận".
11. Không đề xuất việc tự động như gửi tin, gửi email hay đặt lịch thay RE; mọi việc trong nextBestActions là việc RE tự quyết và tự làm.
12. Viết tiếng Việt có dấu, gọn, gọi khách hàng là "KH". Mỗi chuỗi "text" từ 1 đến 300 ký tự, nên dưới 200.

ĐỊNH DẠNG TRẢ LỜI
Chỉ trả về đúng một khối JSON theo mẫu dưới, không thêm lời giải thích trước hay sau:
{
  "hypotheses": [ { "text": "…", "evidence": ["F12"] } ],
  "discoveryStrategy": [ { "text": "…", "evidence": [], "missingCategory": "ASSETS" }, { "text": "…", "evidence": ["F10", "F13"] } ],
  "nextBestActions": [ { "text": "…", "evidence": ["F9"] } ]
}
````

## 4. Prompt `extraction@1` (AI trích xuất)

### 4.1 Đầu vào (message `user`)

```json
{
  "note": "Chị nói hai vợ chồng có 2 bé, bé lớn năm sau vào cấp 3. Công ty chị đang mua bảo hiểm sức khỏe cho cả nhà.",
  "fields": [
    { "field": "maritalStatus", "label": "Tình trạng hôn nhân", "type": "text" },
    { "field": "childrenCount", "label": "Số con", "type": "integer" },
    { "field": "hasProtection", "label": "Đã có bảo vệ", "type": "boolean" }
  ]
}
```

- `note`: nguyên văn một ghi chú KYC do RE ghi (spec §6.1, §8).
- `fields`: mọi trường của danh mục **trừ** `birthYear`, `gender` (lấy từ hồ sơ KH, D2), theo thứ tự danh mục; `type` = `integer` cho `childrenCount`, `boolean` cho `hasProtection`, còn lại `text`.

### 4.2 Prompt

Chép nguyên văn khối dưới làm message `system`:

````text
Bạn giúp RE (chuyên viên quan hệ khách hàng) chuyển một ghi chú KYC thành các dữ kiện có cấu trúc. RE sẽ tự xem và xác nhận từng đề xuất; bạn chỉ đề xuất.

ĐẦU VÀO
Tin nhắn tiếp theo là một khối JSON gồm "note" (ghi chú RE đã viết sau khi trao đổi với khách hàng) và "fields" (danh sách trường được phép, mỗi trường có mã, nhãn và kiểu).

QUY TẮC BẮT BUỘC
1. Chỉ đề xuất điều ghi chú nói rõ về khách hàng hoặc gia đình khách hàng. Không suy đoán, không suy ra từ ngữ cảnh, không thêm hiểu biết bên ngoài.
2. "field" phải là một mã trong "fields". Không đề xuất năm sinh hay giới tính.
3. "value" theo kiểu của trường: integer → chỉ chữ số (vd. "2"); boolean → true hoặc false; text → cụm ngắn tiếng Việt có dấu, giữ đúng ý ghi chú, không quá 300 ký tự.
4. "quote" là đoạn trích nguyên văn, liền mạch, chép đúng từng chữ từ "note", chứa căn cứ cho đề xuất. Không sửa chính tả, không rút gọn.
5. Mỗi trường đề xuất tối đa một lần, trừ khi ghi chú nêu rõ hai giá trị khác nhau cho cùng một trường. Tối đa 20 đề xuất.
6. Không tìm thấy dữ kiện nào thì trả "facts": [].

ĐỊNH DẠNG TRẢ LỜI
Chỉ trả về đúng một khối JSON theo mẫu dưới, không thêm lời giải thích trước hay sau:
{
  "facts": [ { "field": "childrenCount", "value": "2", "quote": "hai vợ chồng có 2 bé" } ]
}
````

- Trích xuất không qua V3–V6 (spec §6.4): giá trị là lời KH, có thể chứa tên HĐ / hãng KH đang có.

## 5. Message thử lại (cả ba chế độ)

Message `user` thứ 4 (§1). Thay `{issues}` bằng mỗi lỗi một dòng `- <code> tại <path>: <detail>`:

````text
Kết quả vừa rồi chưa đạt kiểm tra tự động với các lỗi sau:
{issues}
Hãy trả lại toàn bộ kết quả dưới dạng đúng một khối JSON theo định dạng đã yêu cầu, sửa hết các lỗi trên và vẫn tuân thủ mọi quy tắc bắt buộc. Không thêm lời giải thích.
````

- `detail` do validator viết, tiếng Việt, **không** lặp lại nguyên cụm từ bị chặn quá 40 ký tự; với V3–V6 ghi luật bị vi phạm và cụm từ khớp (vd. `V3 tại hypotheses[0].text: có "xác suất"`).

## 6. Message Kiểm tra kết nối

Không lưu, không qua validator (spec §4.3). `system`: `Trả lời đúng một từ: OK` · `user`: `ping` · `maxTokens` 64, `reasoning` theo Settings. Thành công = lệnh Rust trả về không lỗi; không kiểm nội dung.

## 7. Cách so khớp chung cho V3–V6

1. Chuẩn hóa: NFC → chữ thường → thay mọi chuỗi khoảng trắng bằng một dấu cách. Gọi là **bản có dấu**.
2. **Bản bỏ dấu**: từ bản có dấu, bỏ dấu thanh và dấu phụ (NFD rồi bỏ ký tự dấu), `đ` → `d`.
3. Mỗi mục trong danh sách có cột **Bỏ dấu**: `có` = so cả bản có dấu lẫn bản bỏ dấu (mục cũng được bỏ dấu tương tự); `không` = chỉ so bản có dấu (mục ngắn mà bản bỏ dấu dễ trùng chữ thường, vd. "nhân mã" → "nhan ma" trùng "nhân mà").
4. Cụm từ khớp theo **ranh giới từ**: trước và sau cụm không phải chữ cái / chữ số (Unicode). Không khớp giữa một từ.
5. Mục `regex` chạy trên chuỗi đã chuẩn hóa như ghi trong bảng (có cờ `u`). Trong bảng, `\b` nghĩa là ranh giới từ Unicode của mục 4 — `\b` của JavaScript chỉ hiểu chữ ASCII (sai với "đ", "ề"…), nên code dùng `(?<![\p{L}\p{N}])` / `(?![\p{L}\p{N}])`.
6. Áp cho mọi chuỗi `text` trong output analysis / discovery (không áp cho mã `evidence`, `missingCategory`). Mỗi lần khớp một `ValidationIssue`, `path` trỏ tới chuỗi đó.

## 8. Danh sách chặn

### 8.1 V3 — xác suất, chấm điểm, đoán khả năng mua

| Mục | Kiểu | Bỏ dấu |
|---|---|---|
| `%` (ký tự, ở bất kỳ đâu) | ký tự | — |
| phần trăm | cụm | có |
| xác suất | cụm | có |
| tỉ lệ chốt · tỷ lệ chốt · tỉ lệ thành công · tỷ lệ thành công | cụm | có |
| khả năng chốt · khả năng mua · khả năng ký · khả năng tham gia · khả năng thành công | cụm | có |
| khả năng cao · khả năng thấp · nhiều khả năng · ít khả năng | cụm | có |
| cơ hội chốt · dễ chốt · chốt được · chốt deal · chốt sale · chốt hợp đồng · chốt hđ | cụm | có |
| sẵn sàng mua · sẵn sàng ký · chắc chắn mua · chắc chắn ký | cụm | có |
| tiềm năng mua · tiềm năng chốt · độ tin cậy · mức độ tin cậy | cụm | có |
| khách nóng · khách lạnh · khách ấm · hot lead · warm lead · cold lead · lead score | cụm | có |
| chấm điểm · điểm số · xếp hạng khách | cụm | có |

Ghi chú: "có thể", "có dấu hiệu" **không** bị chặn (prompt yêu cầu dùng). "Sẽ mua" không nằm trong danh sách vì trùng mục tiêu thật ("sẽ mua nhà năm 2027"). Không chặn dạng "8/10" bằng regex vì trùng ngày ("01/10"); điểm số đã chặn qua "chấm điểm", "điểm số". "Tỷ lệ" đứng một mình không bị chặn (vd. tỷ lệ phân bổ tài sản), nhưng `%` luôn bị chặn — output trích mã dữ kiện thay vì nhắc lại số %.

### 8.2 V4 — tên sản phẩm, hãng bảo hiểm

**a) Hãng bảo hiểm** (nhân thọ và phi nhân thọ đang hoạt động tại Việt Nam, kể cả tên tắt):

| Mục | Bỏ dấu |
|---|---|
| prudential · pru · manulife · aia · dai-ichi · dai ichi · daiichi · fwd · generali · sun life · sunlife · chubb · hanwha · mb ageas · ageas · bidv metlife · metlife · cathay · fubon · shinhan life · phú hưng life · bảo việt · baoviet · bvnt · aviva · vietcombank-cardif · vcli · cardif · bic · pvi · bảo minh · pti · pjico · mic · vbi · liberty · tokio marine · msig · bảo long · aaa assurance | có |

**b) Tiền tố dòng sản phẩm**: regex `\bpru[-\s]?[a-zà-ỹđ]` (vd. "PRU-Hành Trang"), `\baia\s+[a-zà-ỹđ]+` đã nằm trong (a).

**c) Loại sản phẩm cụ thể** (nêu tên loại = gợi ý sản phẩm, ADR-0009):

| Mục | Bỏ dấu |
|---|---|
| liên kết đơn vị · liên kết chung · unit-linked · unit linked · universal life · whole life · term life · bảo hiểm tử kỳ · bảo hiểm hỗn hợp · bảo hiểm trọn đời · bảo hiểm niên kim · niên kim · bảo hiểm đầu tư · gói bảo hiểm · sản phẩm bảo hiểm · quyền lợi bổ trợ · sản phẩm bổ trợ · rider | có |

Ghi chú: "giải pháp bảo vệ", "bảo vệ hiện có", "bảo vệ thu nhập", "quỹ dự phòng", "bảo hiểm sức khỏe" (chung chung, như câu hỏi gợi ý của danh mục) **không** bị chặn. Tên ngân hàng / công ty quản lý quỹ / mã chứng khoán chưa chặn ở v1 (§9 Q2).

### 8.3 V5 — nhãn tính cách

| Mục | Kiểu | Bỏ dấu |
|---|---|---|
| `\b[ie][ns][tf][jp](-[at])?\b` trên bản có dấu (vd. "INTJ", "ENFP-A") | regex | — |
| mbti · disc · enneagram · big five · big 5 | cụm | có |
| nhóm d · nhóm i · nhóm s · nhóm c · kiểu d · kiểu i · kiểu s · kiểu c · dominance · influence · steadiness · conscientiousness | cụm | có |
| hướng nội · hướng ngoại · introvert · extrovert · người hướng nội · người hướng ngoại | cụm | có |
| cung hoàng đạo · cung mệnh · con giáp · ngũ hành · thần số học · nhân số học · nhóm máu | cụm | có |
| tử vi · bát tự | cụm | **không** |
| bạch dương · kim ngưu · song tử · cự giải · xử nữ · thiên bình · bọ cạp · thiên yết · nhân mã · ma kết · bảo bình · song ngư · sư tử | cụm | **không** |
| tuổi tý · tuổi sửu · tuổi dần · tuổi mão · tuổi mẹo · tuổi thìn · tuổi tỵ · tuổi tị · tuổi ngọ · tuổi mùi · tuổi thân · tuổi dậu · tuổi tuất · tuổi hợi | cụm | **không** |
| mệnh kim · mệnh mộc · mệnh thủy · mệnh thuỷ · mệnh hỏa · mệnh hoả · mệnh thổ | cụm | **không** |
| `\bnhóm máu\s*(a|b|ab|o)\b` | regex | — |

Ghi chú: "tính cách" và "kiểu người" không nằm trong danh sách (dễ chặn nhầm câu mô tả hành vi); prompt đã cấm.

### 8.4 V6 — trích dẫn văn bản pháp lý

| Mục | Kiểu | Bỏ dấu |
|---|---|---|
| `\bđiều\s+\d+` (vd. "Điều 35") | regex, cả bản bỏ dấu `\bdieu\s+\d+` | — |
| `\bkhoản\s+\d+[,]?\s+điều\b` (vd. "khoản 2 Điều 35") | regex, cả bản bỏ dấu | — |
| `\bđiểm\s+[a-zđ]\s+khoản\b` | regex, cả bản bỏ dấu | — |
| `(luật|Luật|LUẬT)\s+\p{Lu}` trên **chuỗi gốc NFC, giữ hoa thường** (vd. "Luật Kinh doanh bảo hiểm"; "Luật sư" không khớp) | regex | — |
| bộ luật · nghị định · thông tư · nghị quyết · văn bản hợp nhất · quyết định số · công văn số | cụm | có |
| `\b\d{1,4}/\d{4}/[a-zđ0-9-]+\b` (số hiệu, vd. "46/2023/NĐ-CP", "08/2022/QH15") | regex, cả bản bỏ dấu | — |
| `\b(nđ-cp|tt-btc|qh1\d)\b` | regex, cả bản bỏ dấu | — |

Ghi chú: khác chữ spec §6.4 ở một điểm — "khoản <số>" **chỉ** chặn khi đi kèm "Điều" vì "khoản 500 triệu" là cách nói tiền thường gặp. "Pháp luật", "pháp lý", "cần chuyên gia pháp lý xác nhận" không bị chặn.

### 8.5 Ca kiểm bắt buộc (T-165)

| # | Chuỗi trong output | Kết quả |
|---|---|---|
| C1 | "KH có 70% khả năng tham gia" | V3 (`%`, "khả năng tham gia") |
| C2 | "Xac suat KH dong y cao" | V3 (bỏ dấu "xac suat") |
| C3 | "KH có thể ưu tiên thanh khoản" | đạt |
| C4 | "Giữ tỷ lệ phân bổ hiện tại (F14)" | đạt |
| C5 | "Đề xuất PRU-Hành Trang Trưởng Thành" | V4 |
| C6 | "Rà lại giải pháp bảo vệ hiện có (F17)" | đạt |
| C7 | "Gói bảo hiem tron doi phù hợp" | V4 ("gói bảo hiểm" qua bản bỏ dấu) |
| C8 | "KH thuộc nhóm INTJ" | V5 |
| C9 | "KH sinh năm 1984, tuổi Tý" | V5 |
| C10 | "Nhân mà KH quan tâm…" (câu có "nhân mà") | đạt (zodiac không so bỏ dấu) |
| C11 | "Theo Điều 35 Luật Kinh doanh bảo hiểm" | V6 (hai lần) |
| C12 | "Khoản 500 triệu đáo hạn năm 2027" | đạt |
| C13 | "Cần chuyên gia pháp lý xác nhận về thừa kế" | đạt |
| C14 | "Nghi dinh 46/2023/ND-CP" | V6 |
| C15 | "KH sẽ mua nhà năm 2027 (F12)" | đạt |
| C16 | "Hỏi KH đã có luật sư gia đình chưa" | đạt |
| C17 | "Hẹn lại từ 01/10 để làm rõ F10" | đạt |

## 9. Owner duyệt

**Owner chốt 07/10/2026:**

| # | Câu hỏi | Chốt |
|---|---|---|
| Q1 | Chặn tên **loại** sản phẩm (§8.2 c)? | **Có** — cấm gợi ý sản phẩm theo ADR-0009; AI không viết "bảo hiểm trọn đời", "liên kết đơn vị"… kể cả khi chỉ mô tả nhu cầu |
| Q2 | Chặn tên ngân hàng / công ty quản lý quỹ / mã chứng khoán? | **Chưa chặn ở v1**; prompt vẫn cấm gợi ý sản phẩm |
| Q3 | Thêm dòng sản phẩm riêng của hãng Owner vào §8.2? | **Không** |
| Q4 | V6 "khoản <số>" chỉ chặn khi đi kèm "Điều" (lệch chữ spec §6.4, §8.4) | **Đồng ý** |

**Checklist:**

- [ ] Cách dựng messages, đầu vào (tuổi thay năm sinh), `maxTokens` (§1)
- [ ] Prompt `analysis@1` (§2)
- [ ] Prompt `discovery@1` (§3)
- [ ] Prompt `extraction@1` + đầu vào (§4)
- [ ] Message thử lại, Kiểm tra kết nối (§5, §6)
- [ ] Cách so khớp (§7)
- [ ] Danh sách chặn V3–V6 và ca kiểm C1–C17 (§8), gồm điểm lệch spec ở "khoản <số>" (§8.4)
