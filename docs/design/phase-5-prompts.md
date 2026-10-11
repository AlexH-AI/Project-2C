# Phase 5 — Prompt và guardrail AI (G5)

- **Cổng:** G5 (prompt + guardrail) · **Trạng thái:** **Owner duyệt G5 07/10/2026** (PR #414; quyết định Q1–Q5 ở §9; Q6 duyệt cùng ngày ở PR #417) · §6a `web@1` (ChatGPT web, W-1) **Owner duyệt G5 08/10/2026** (PR #430)
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
Lập bản phân tích gồm 7 phần:
1. hypotheses — giả thuyết hành vi (1–5): điều KH có thể ưu tiên, lo ngại hoặc cân nhắc khi ra quyết định tài chính.
2. needs — nhu cầu (1–5).
3. painPoints — điểm vướng hiện tại (1–5).
4. themes — chủ đề cơ hội để RE tìm hiểu sâu (1–5).
5. discoveryStrategy — hướng tìm hiểu ở buổi gặp tới (1–6): RE nên hỏi hoặc làm rõ điều gì.
6. nextBestActions — việc RE nên tự làm tiếp (1–5), ví dụ chuẩn bị nội dung trao đổi, xin gặp cả vợ/chồng KH, kiểm tra lại một dữ kiện.
7. personalityNotes — thông tin tham khảo về tính cách (0–4), theo quy tắc 8.

QUY TẮC BẮT BUỘC
1. Chỉ dựa vào dữ kiện trong đầu vào. Không bịa thêm dữ kiện, không suy ra điều đầu vào không nói.
2. Mỗi phần tử của hypotheses, needs, painPoints, themes phải có "evidence": danh sách mã dữ kiện (vd. ["F12", "F13"]) thật sự làm căn cứ, không trùng mã, chỉ dùng mã có trong đầu vào.
3. Mỗi phần tử của discoveryStrategy và nextBestActions phải có "evidence" trỏ tới dữ kiện, hoặc "missingCategory" là mã một hạng mục trong missingCategories (khi phần tử nhằm bổ sung hạng mục đó), hoặc cả hai. Không có căn cứ thì để "evidence": [].
4. Giả thuyết là giả thuyết: viết "KH có thể…", "có dấu hiệu…", không khẳng định chắc chắn.
5. Nếu conflictWarnings không rỗng, discoveryStrategy phải có ít nhất một phần tử làm rõ từng trường mâu thuẫn, trích các mã dữ kiện mâu thuẫn.
6. Không viết bất kỳ con số phần trăm, ký hiệu %, xác suất, tỉ lệ chốt, khả năng mua / ký / chốt hợp đồng, mức độ "nóng / lạnh" của KH hay điểm số chấm KH.
7. Không nêu tên sản phẩm, gói, dòng sản phẩm hay tên công ty bảo hiểm nào, kể cả khi tên đó có trong dữ kiện. Khi cần nhắc, viết "giải pháp bảo vệ hiện có" và trích mã dữ kiện. Không đề xuất mua hay chuyển đổi sản phẩm.
8. Nhãn tính cách chỉ được viết trong personalityNotes, không viết ở phần nào khác. Mỗi phần tử ghi "system": "PSYCHOLOGY" (tâm lý học: MBTI, DISC, Enneagram, Big Five, hướng nội / hướng ngoại) hoặc "ESOTERIC" (tử vi / huyền học: cung hoàng đạo, con giáp, mệnh ngũ hành, nhóm máu, thần số học). Đây là suy đoán để RE tham khảo — ngoại lệ duy nhất của quy tắc 1: viết "KH có thể…", phải có "evidence" trỏ tới dữ kiện làm căn cứ (vd. tuổi cho con giáp), không có căn cứ thì để personalityNotes là []. Không dùng nhãn này làm căn cứ cho phần khác.
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
  "nextBestActions": [ { "text": "…", "evidence": ["F9"] } ],
  "personalityNotes": [ { "system": "PSYCHOLOGY", "text": "…", "evidence": ["F10", "F13"] }, { "system": "ESOTERIC", "text": "…", "evidence": ["F3"] } ]
}
````

## 3. Prompt `discovery@1` (chế độ `PROFILE_DISCOVERY`)

Hồ sơ đủ tối thiểu nhưng chưa đủ để phân tích nhu cầu: trọng tâm là RE cần tìm hiểu gì thêm. Chép nguyên văn khối dưới làm message `system`:

````text
Bạn là trợ lý phân tích hồ sơ KYC cho RE (chuyên viên quan hệ khách hàng) tư vấn tài chính và bảo vệ cho khách hàng cá nhân cao cấp tại Việt Nam. Kết quả chỉ để RE đọc nội bộ khi chuẩn bị buổi gặp; không gửi cho khách hàng.

ĐẦU VÀO
Tin nhắn tiếp theo là một khối JSON: ngày phân tích, danh sách dữ kiện KYC đã được RE xác nhận (mỗi dữ kiện có mã dạng F12), các hạng mục còn thiếu và các trường đang mâu thuẫn. Đó là toàn bộ thông tin bạn có. Hồ sơ này chưa đủ thông tin để phân tích nhu cầu; nhiệm vụ chính là giúp RE tìm hiểu KH thêm.

NHIỆM VỤ
Lập bản định hướng tìm hiểu gồm 4 phần:
1. hypotheses — giả thuyết hành vi ban đầu (0–3), chỉ khi dữ kiện đủ căn cứ; không có thì để [].
2. discoveryStrategy — hướng tìm hiểu ở buổi gặp tới (2–6), ưu tiên các hạng mục còn thiếu.
3. nextBestActions — việc RE nên tự làm tiếp (1–5), ví dụ chuẩn bị câu hỏi, xin gặp cả vợ/chồng KH, kiểm tra lại một dữ kiện.
4. personalityNotes — thông tin tham khảo về tính cách (0–4), theo quy tắc 9.

QUY TẮC BẮT BUỘC
1. Chỉ dựa vào dữ kiện trong đầu vào. Không bịa thêm dữ kiện, không suy ra điều đầu vào không nói.
2. Mỗi phần tử của hypotheses phải có "evidence": danh sách mã dữ kiện (vd. ["F12", "F13"]) thật sự làm căn cứ, không trùng mã, chỉ dùng mã có trong đầu vào.
3. Mỗi phần tử của discoveryStrategy và nextBestActions phải có "evidence" trỏ tới dữ kiện, hoặc "missingCategory" là mã một hạng mục trong missingCategories (khi phần tử nhằm bổ sung hạng mục đó), hoặc cả hai. Không có căn cứ thì để "evidence": [].
4. Mỗi hạng mục trong missingCategories nên có ít nhất một phần tử discoveryStrategy với "missingCategory" tương ứng, trong giới hạn 6 phần tử.
5. Giả thuyết là giả thuyết: viết "KH có thể…", "có dấu hiệu…", không khẳng định chắc chắn.
6. Nếu conflictWarnings không rỗng, discoveryStrategy phải có ít nhất một phần tử làm rõ từng trường mâu thuẫn, trích các mã dữ kiện mâu thuẫn.
7. Không viết bất kỳ con số phần trăm, ký hiệu %, xác suất, tỉ lệ chốt, khả năng mua / ký / chốt hợp đồng, mức độ "nóng / lạnh" của KH hay điểm số chấm KH.
8. Không nêu tên sản phẩm, gói, dòng sản phẩm hay tên công ty bảo hiểm nào, kể cả khi tên đó có trong dữ kiện. Khi cần nhắc, viết "giải pháp bảo vệ hiện có" và trích mã dữ kiện. Không đề xuất mua hay chuyển đổi sản phẩm.
9. Nhãn tính cách chỉ được viết trong personalityNotes, không viết ở phần nào khác. Mỗi phần tử ghi "system": "PSYCHOLOGY" (tâm lý học: MBTI, DISC, Enneagram, Big Five, hướng nội / hướng ngoại) hoặc "ESOTERIC" (tử vi / huyền học: cung hoàng đạo, con giáp, mệnh ngũ hành, nhóm máu, thần số học). Đây là suy đoán để RE tham khảo — ngoại lệ duy nhất của quy tắc 1: viết "KH có thể…", phải có "evidence" trỏ tới dữ kiện làm căn cứ (vd. tuổi cho con giáp), không có căn cứ thì để personalityNotes là []. Không dùng nhãn này làm căn cứ cho phần khác.
10. Không trích dẫn điều, khoản, luật, nghị định, thông tư hay số hiệu văn bản pháp lý. Nếu một ý có yếu tố pháp lý hoặc thuế, viết "cần chuyên gia pháp lý xác nhận".
11. Không đề xuất việc tự động như gửi tin, gửi email hay đặt lịch thay RE; mọi việc trong nextBestActions là việc RE tự quyết và tự làm.
12. Viết tiếng Việt có dấu, gọn, gọi khách hàng là "KH". Mỗi chuỗi "text" từ 1 đến 300 ký tự, nên dưới 200.

ĐỊNH DẠNG TRẢ LỜI
Chỉ trả về đúng một khối JSON theo mẫu dưới, không thêm lời giải thích trước hay sau:
{
  "hypotheses": [ { "text": "…", "evidence": ["F12"] } ],
  "discoveryStrategy": [ { "text": "…", "evidence": [], "missingCategory": "ASSETS" }, { "text": "…", "evidence": ["F10", "F13"] } ],
  "nextBestActions": [ { "text": "…", "evidence": ["F9"] } ],
  "personalityNotes": [ { "system": "ESOTERIC", "text": "…", "evidence": ["F3"] } ]
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

## 6a. Tin nhắn ChatGPT web `web@1` (spec §3.1, W-1 — Owner duyệt G5 08/10/2026)

ChatGPT web không có message `system`: app ghép **một** tin nhắn để người dùng dán. Chữ prompt của chế độ (§2 hoặc §3) giữ **nguyên văn** — không tạo `analysis@2`; phần bọc dưới có version riêng `web@1`, và `prompt_version` lưu dạng `analysis@1+web@1` (spec §7.1). Thay `{prompt}` bằng chữ prompt của chế độ, `{input}` bằng khối JSON đầu vào §1.1 (đúng như message `user` khi gọi OpenCode):

````plaintext
Tin nhắn này có hai phần. Phần HƯỚNG DẪN là chỉ dẫn cho toàn bộ cuộc trò chuyện; phần ĐẦU VÀO chính là khối JSON mà hướng dẫn gọi là "tin nhắn tiếp theo". Chỉ dùng thông tin trong ĐẦU VÀO: không tìm kiếm web, không dùng nguồn bên ngoài, không dùng thông tin từ các cuộc trò chuyện khác. Chỉ trả lời bằng đúng một khối JSON theo định dạng trong hướng dẫn, không thêm lời giải thích.

=== HƯỚNG DẪN ===
{prompt}

=== ĐẦU VÀO ===
{input}
````

- **Thử lại:** nút "Copy yêu cầu sửa" copy đúng message thử lại §5 (cùng `{issues}`); người dùng dán vào **cùng** cuộc chat nên không cần lặp lại prompt.
- Câu trả lời dán vào được xử lý như `content` của model: lấy khối JSON đầu tiên, bỏ rào ```` ```json ```` (spec §6.1); V1–V6 như §7–§8. Không có `maxTokens`, `reasoning` — người dùng tự chọn model và mức suy luận trên web.
- Khối trên dùng rào `plaintext` để `prompts.test.ts` (đang so đúng bốn khối `text` §2–§5) còn xanh cho tới task cài `web@1` (spec §13 #13); task đó so khối này với hằng số trong code.
- Đổi chữ phần bọc = `web@2` + qua G5; đổi prompt chế độ thì `prompt_version` đổi theo (vd. `analysis@2+web@1`).

## 7. Cách so khớp chung cho V3–V6

1. Chuẩn hóa: NFC → chữ thường → thay mọi chuỗi khoảng trắng bằng một dấu cách. Gọi là **bản có dấu**.
2. **Bản bỏ dấu**: từ bản có dấu, bỏ dấu thanh và dấu phụ (NFD rồi bỏ ký tự dấu), `đ` → `d`.
3. Mỗi mục trong danh sách có cột **Bỏ dấu**: `có` = so cả bản có dấu lẫn bản bỏ dấu (mục cũng được bỏ dấu tương tự); `không` = chỉ so bản có dấu (mục ngắn mà bản bỏ dấu dễ trùng chữ thường, vd. "nhân mã" → "nhan ma" trùng "nhân mà").
4. Cụm từ khớp theo **ranh giới từ**: trước và sau cụm không phải chữ cái / chữ số (Unicode). Không khớp giữa một từ.
5. Mục `regex` chạy trên chuỗi đã chuẩn hóa như ghi trong bảng (có cờ `u`). Trong bảng, `\b` nghĩa là ranh giới từ Unicode của mục 4 — `\b` của JavaScript chỉ hiểu chữ ASCII (sai với "đ", "ề"…), nên code dùng `(?<![\p{L}\p{N}])` / `(?![\p{L}\p{N}])`.
6. Áp cho mọi chuỗi `text` trong output analysis / discovery (không áp cho mã `evidence`, `missingCategory`, `system`), **trừ V5 không áp cho `personalityNotes[*].text`** (§8.3). V3, V4, V6 vẫn áp cho `personalityNotes`. Mỗi lần khớp một `ValidationIssue`, `path` trỏ tới chuỗi đó.

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

**b) Tiền tố dòng sản phẩm**: regex `\bpru[-\s]?[a-zà-ỹđ]` trên bản có dấu và bản bỏ dấu. Mục "pru" ở (a) chỉ khớp khi "pru" đứng riêng thành từ (vd. "PRU-Hành Trang", "Pru Link"); regex này bắt thêm tên dòng sản phẩm viết dính liền (vd. "PRULink", "Prumax"). Các hãng khác không cần regex riêng: tên dòng sản phẩm của họ đi kèm tên hãng viết rời (vd. "AIA Vitality"), nên mục ở (a) đã chặn.

**c) Loại sản phẩm cụ thể** (nêu tên loại = gợi ý sản phẩm, ADR-0009):

| Mục | Bỏ dấu |
|---|---|
| liên kết đơn vị · liên kết chung · unit-linked · unit linked · universal life · whole life · term life · bảo hiểm tử kỳ · bảo hiểm hỗn hợp · bảo hiểm trọn đời · bảo hiểm niên kim · niên kim · bảo hiểm đầu tư · gói bảo hiểm · sản phẩm bảo hiểm · quyền lợi bổ trợ · sản phẩm bổ trợ · rider | có |

Ghi chú: "giải pháp bảo vệ", "bảo vệ hiện có", "bảo vệ thu nhập", "quỹ dự phòng", "bảo hiểm sức khỏe" (chung chung, như câu hỏi gợi ý của danh mục) **không** bị chặn. Tên ngân hàng / công ty quản lý quỹ / mã chứng khoán chưa chặn ở v1 (§9 Q2).

### 8.3 V5 — nhãn tính cách ngoài khối tham khảo

Owner 07/10/2026 (§9 Q5): nhãn tính cách **không bị cấm**, mà được đưa vào khối riêng `personalityNotes` làm thông tin tham khảo (tâm lý học `PSYCHOLOGY` và tử vi / huyền học `ESOTERIC`, AI suy ra từ dữ kiện, bắt buộc có bằng chứng). V5 chỉ chặn các mục dưới khi chúng xuất hiện ở **khối khác** (`hypotheses`, `needs`, `painPoints`, `themes`, `discoveryStrategy`, `nextBestActions`), để nhãn không lẫn vào phần phân tích chính.

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

Ghi chú: "tính cách" và "kiểu người" không nằm trong danh sách (dễ chặn nhầm câu mô tả hành vi). Validator không kiểm `system` khớp nội dung (vd. MBTI ghi nhầm `ESOTERIC`); eval đọc tay.

### 8.4 V6 — trích dẫn văn bản pháp lý

| Mục | Kiểu | Bỏ dấu |
|---|---|---|
| `\bđiều\s+\d+` (vd. "Điều 35") | regex, cả bản bỏ dấu `\bdieu\s+\d+` | — |
| `\bkhoản\s+\d+[,]?\s+điều\b` (vd. "khoản 2 Điều 35") | regex, cả bản bỏ dấu | — |
| `\bđiểm\s+[a-zđ]\s+khoản\b` | regex, cả bản bỏ dấu | — |
| `(?<!(pháp|Pháp|PHÁP)\s+)(luật|Luật|LUẬT)\s+\p{Lu}` trên **chuỗi gốc NFC, giữ hoa thường**, có ranh giới từ trước "luật" (vd. "Luật Kinh doanh bảo hiểm"; "Luật sư" và "pháp luật Việt Nam" không khớp) | regex | — |
| bộ luật · nghị định · thông tư · nghị quyết · văn bản hợp nhất · quyết định số · công văn số | cụm | có |
| `\b\d{1,4}/\d{4}/[a-zđ0-9-]+\b` (số hiệu, vd. "46/2023/NĐ-CP", "08/2022/QH15") | regex, cả bản bỏ dấu | — |
| `\b(nđ-cp|tt-btc|qh1\d)\b` | regex, cả bản bỏ dấu | — |

Ghi chú: khác chữ spec §6.4 ở một điểm — "khoản <số>" **chỉ** chặn khi đi kèm "Điều" vì "khoản 500 triệu" là cách nói tiền thường gặp. "Pháp luật", "pháp lý", "cần chuyên gia pháp lý xác nhận" không bị chặn, kể cả "pháp luật" đứng trước tên riêng (vd. "pháp luật Việt Nam", Owner 07/10/2026 — §9 Q6).

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
| C8 | "KH thuộc nhóm INTJ" ở `hypotheses` | V5 |
| C9 | "KH có thể tuổi Tý" ở `nextBestActions` | V5 |
| C8b | "KH có thể thuộc nhóm INTJ" ở `personalityNotes` (`PSYCHOLOGY`) | đạt |
| C9b | "KH có thể tuổi Tý, mệnh Kim" ở `personalityNotes` (`ESOTERIC`) | đạt |
| C9c | "KH có 80% là INTJ" ở `personalityNotes` | V3 (`%`) — V3 vẫn áp |
| C10 | "Nhân mà KH quan tâm…" (câu có "nhân mà") | đạt (zodiac không so bỏ dấu) |
| C11 | "Theo Điều 35 Luật Kinh doanh bảo hiểm" | V6 (hai lần) |
| C12 | "Khoản 500 triệu đáo hạn năm 2027" | đạt |
| C13 | "Cần chuyên gia pháp lý xác nhận về thừa kế" | đạt |
| C14 | "Nghi dinh 46/2023/ND-CP" | V6 |
| C15 | "KH sẽ mua nhà năm 2027 (F12)" | đạt |
| C16 | "Hỏi KH đã có luật sư gia đình chưa" | đạt |
| C17 | "Hẹn lại từ 01/10 để làm rõ F10" | đạt |
| C18 | "Di chúc cần đúng pháp luật Việt Nam" | đạt ("pháp luật" trước tên riêng — Q6) |
| C19 | "Đề xuất PRULink cho KH" | V4 (regex §8.2 b, tên viết dính liền) |

## 9. Owner duyệt

**Owner chốt 07/10/2026:**

| # | Câu hỏi | Chốt |
|---|---|---|
| Q1 | Chặn tên **loại** sản phẩm (§8.2 c)? | **Có** — cấm gợi ý sản phẩm theo ADR-0009; AI không viết "bảo hiểm trọn đời", "liên kết đơn vị"… kể cả khi chỉ mô tả nhu cầu |
| Q2 | Chặn tên ngân hàng / công ty quản lý quỹ / mã chứng khoán? | **Chưa chặn ở v1**; prompt vẫn cấm gợi ý sản phẩm |
| Q3 | Thêm dòng sản phẩm riêng của hãng Owner vào §8.2? | **Không** |
| Q4 | V6 "khoản <số>" chỉ chặn khi đi kèm "Điều" (lệch chữ spec §6.4, §8.4) | **Đồng ý** |
| Q5 | Nhãn tính cách (§8.3) | **Không cấm** — khối riêng `personalityNotes` "Thông tin tham khảo", cả tâm lý học và tử vi / huyền học, mỗi phần tử ghi rõ loại, AI suy ra từ dữ kiện và bắt buộc có bằng chứng. Đổi ADR-0009 mục 3 (phụ lục G5) và spec §6.2 / §6.4 / §9.1 |
| Q6 | V6 mục `luật …` khớp nhầm "pháp luật Việt Nam" (ghi chú review PR #414) | **Đồng ý** (PR #417): thêm điều kiện "luật" không đứng sau "pháp"; thêm ca C18, C19 |

**Checklist:**

- [x] Cách dựng messages, đầu vào (tuổi thay năm sinh), `maxTokens` (§1)
- [x] Prompt `analysis@1` (§2)
- [x] Prompt `discovery@1` (§3)
- [x] Prompt `extraction@1` + đầu vào (§4)
- [x] Message thử lại, Kiểm tra kết nối (§5, §6)
- [x] Cách so khớp (§7)
- [x] Danh sách chặn V3–V6 và ca kiểm C1–C17 (§8), gồm điểm lệch spec ở "khoản <số>" (§8.4)
- [x] Tin nhắn ChatGPT web `web@1`: phần bọc, giữ nguyên prompt chế độ, thử lại dùng §5 (§6a — W-1, 08/10/2026)

## 10. Đợt sửa G5 Phase 6 (T-197 #491) — đề xuất, chờ Owner duyệt

**Trạng thái:** đề xuất 11/10/2026, **chưa duyệt**. §1–§9 ở trên vẫn là bản đang chạy (`analysis@1`, `discovery@1`) cho tới khi Owner duyệt; sau khi duyệt, các thay đổi dưới được chép vào §1–§8 (và spec `phase-5-ai.md` §3.1 mục 3, §6.2, §6.4) trong cùng PR với code + test, mục này rút gọn thành nhật ký.

**Nền:** deep review Phase 5 (`docs/reviews/2026-10-10-deep-review-phase-5-tong-hop.md`) DR5-01, DR5-02, DR5-08, DR5-23, DR5-49 (b); review lại vòng 2 (`docs/reviews/2026-10-11-review-lai-phase-5-tong-hop.md`) R2-03, R2-04; ghi chú review #420 (`docs/state/review-notes.md`); đọc tay eval 10/10 (`docs/metrics/ai-eval-2026-10-10.md`, R2–R7).

**Đã thử trước khi đề xuất** (bản dựng thử ngoài repo, chưa phải code): luật mới ở §10.2–§10.3 cho **41 / 41** câu thường đạt (C3–C18 cũ + mọi câu chặn nhầm của DR5-02 và #420) và **47 / 47** ca phải chặn bị chặn (C1–C19 cũ + biến thể Unicode của DR5-01); chạy trên **547** chuỗi `text` thật của eval 10/10: **0** câu bị chặn.

### 10.1 Version

| Prompt | Đổi | Version mới |
|---|---|---|
| analysis | danh sách chặn (§10.3), V1 (§10.4), chữ prompt nếu Owner chọn (§10.8) | `analysis@2` |
| discovery | như analysis | `discovery@2` |
| extraction | không đổi chữ; không qua V3–V6; chỉ `maxTokens` nếu Owner chọn §10.7 | giữ `extraction@1` |
| tin nhắn ChatGPT web | chữ bọc không đổi; chỉ cách nhận diện tin nhắn của app đổi (§10.6) | giữ `web@1` → lưu `analysis@2+web@1` |

- Phân tích đã lưu với `@1` vẫn hiện như đã ghi. `db` chỉ kiểm dạng `<mode>@<n>` (không có danh sách version) nên không phải sửa `db`.
- V1 chặt hơn (§10.4) cũng áp khi nhập backup (`db` dùng `@p2c/ai/schema`): theo R2-02, Owner nạp lại dữ liệu giả lập; không migration.

### 10.2 Cách so khớp §7 (DR5-01)

Thêm một bước **trước** mục 1 của §7, dùng chung cho bản gốc, bản có dấu và bản bỏ dấu:

0. **Chuẩn hóa nền:** NFKC (gom `％`, `﹪` về `%`, chữ số / chữ cái toàn độ rộng về ASCII) → bỏ mọi ký tự định dạng `\p{Cf}` (U+200B, 200C, 200D, 2060, 00AD, FEFF…) → thay `-` và `_` bằng dấu cách. Các mục trong danh sách cũng chuẩn hóa như vậy (vd. "dai-ichi" thành "dai ichi").

Sửa thêm:

- Mục 1: "NFC" đổi thành "kết quả bước 0" (NFKC đã gồm NFC).
- **Khoảng trắng trong một cụm khớp 0 hoặc 1 dấu cách**: bỏ ký tự vô hình làm hai chữ dính nhau ("xác​suất" → "xácsuất"), nên cụm "xác suất" phải khớp cả "xácsuất". Ranh giới từ hai đầu cụm giữ nguyên (§7 mục 4).
- **Chữ số trong regex là `\p{Nd}`** (mọi chữ số thập phân Unicode) thay cho `\d`: NFKC không đổi chữ số Ả Rập ("Điều ٣٥").
- V3 thêm ký tự `‰` (NFKC không gom về `%`) và cụm "percent" (CX-A2 "70 percent").

Không xử lý chữ tương hình khác bảng (Cyrillic "А", Greek "υ"): cần bảng confusables, model không đối kháng, R1 eval = 0 (§10.10).

### 10.3 Danh sách chặn §8 (DR5-02 + #420)

Chỉ liệt kê mục đổi; mục khác giữ nguyên. "Bỏ dấu: không" = chỉ so bản có dấu (§7 mục 3).

| Luật | Mục cũ | Đề xuất | Câu thường hết bị chặn |
|---|---|---|---|
| V3 | dễ chốt (bỏ dấu: có) | bỏ dấu: **không** | "Hẹn KH **để chốt** lịch gặp tiếp" |
| V3 | khả năng ký (có) | bỏ dấu: **không** | "**khả năng kỹ** thuật", "**khả năng kỷ** luật tài chính" |
| V3 | chốt được | chỉ chặn khi **không** theo sau bởi: lịch · ngày · giờ · buổi · thời gian · thời điểm · cuộc hẹn · hẹn · mốc · kế hoạch · mục tiêu · phương án | "**Chốt được** lịch hẹn tuần sau" (vẫn chặn "KH có thể chốt được trong tháng này") |
| V3 | sẵn sàng mua · tiềm năng mua | chỉ chặn khi theo sau là: hết câu / dấu câu, hoặc bảo hiểm · sản phẩm · giải pháp · gói · hợp đồng · hđ | "KH có thể **sẵn sàng mua** nhà năm 2027", "**Tiềm năng mua** thêm bất động sản cho con" (cùng lý do bỏ "sẽ mua", C15) |
| V3 | độ tin cậy · mức độ tin cậy (có) | bỏ dấu: **không** | "gắn bó với đơn vị cũ **do tin cậy** người tư vấn" |
| V3 | chấm điểm · điểm số · xếp hạng khách | chấm điểm KH · chấm điểm khách · điểm số KH · điểm số khách · xếp hạng KH · xếp hạng khách | "Con KH cần cải thiện **điểm số**", "**chấm điểm** đầu vào đại học", "**Điểm sơ** bộ" |
| V3 | (mới) | `‰`, "percent" (§10.2) | — |
| V4 | bảo việt · bảo minh (có) | bỏ dấu: **không** ("baoviet", "bvnt" giữ) | "RE **bảo viết** lại mục tiêu", "KH **báo mình** sẽ đi công tác" |
| V4 | liên kết chung | **bảo hiểm liên kết** (khớp cả "bảo hiểm liên kết chung / đơn vị") | "tài khoản **liên kết chung** của hai vợ chồng" |
| V5 | nhóm d · nhóm i · nhóm s · nhóm c · kiểu d · kiểu i · kiểu s · kiểu c | như cũ, nhưng **không** chặn khi theo sau là "level" / "suite" | "KH thuộc **nhóm C-level** của tập đoàn" (vẫn chặn "nhóm D") |
| V5 | nhóm máu (có) | bỏ dấu: **không** (regex `nhóm máu (a\|b\|ab\|o)` giữ) | "KH thích **nhóm màu** trung tính", "**nhóm mẫu** câu hỏi" |
| V6 | `\bđiều\s+\d+` (cả bản bỏ dấu) | `\b(Điều\|ĐIỀU)\s+\p{Nd}+` trên **bản gốc, giữ hoa thường** | "Làm rõ **điều 2** vợ chồng KH còn băn khoăn" |
| V6 | `\bkhoản\s+\d+[,]?\s+điều\b` | `\bkhoản\s+\p{Nd}+[,]?\s+điều\s+\p{Nd}+` (đòi số sau "điều"; cả bản bỏ dấu) | "Hỏi KH về **khoản 2 điều** kiện vay" (vẫn chặn "khoản 2 điều 35" viết thường) |
| V6 | `(?<!(pháp\|Pháp\|PHÁP)\s+)(luật\|Luật\|LUẬT)\s+\p{Lu}` | "luật" **mọi kiểu hoa / thường**, đứng sau một từ khác "pháp", "kỷ", "quy" (so không phân biệt hoa thường), theo sau là một từ mở đầu bằng chữ hoa mà **không** phải "KH", "RE" hay "sư" (mọi kiểu chữ) | "kỷ luật KH", "quy luật Thị trường", "LUẬT SƯ", "Luật Sư", "pHáp luật Việt Nam" (vẫn chặn "Luật Kinh doanh…", "Luật BHXH", "LuẬt Đất đai") |
| V6 | nghị quyết (có) | bỏ dấu: **không** | "cần thời gian **suy nghĩ quyết** định" |
| V6 | quyết định số · công văn số (cụm) | regex `\b(quyết định\|công văn) số\s*\p{Nd}` (cả bản bỏ dấu) | "**quyết định số** tiền / số lượng", "**công văn số** liệu" (vẫn chặn "Quyết định số 123") |
| V6 | `\b\d{1,4}/\d{4}/[a-zđ0-9-]+\b`, `\b(nđ-cp\|tt-btc\|qh1\d)\b` | `\d` → `\p{Nd}`; `-` trong mẫu thành dấu cách tùy chọn (bước 0 đã đổi `-` thành dấu cách) | — |

### 10.4 V1: `text` phải có chữ (DR5-08, DR5-49 phần b)

Ví dụ định dạng trong prompt (§2, §3) có mọi `text` là "…" và mã F12, F10, F13, F9, F3: model chép lại ví dụ, hoặc RE dán phần ví dụ, thì ACCEPTED ở KH có đủ các mã đó (39 / 767 hồ sơ seed). Issue cho hai cách:

- **(A — đề xuất)** V1: mỗi `text` của analysis / discovery (kể cả `personalityNotes`), sau khi bỏ `\p{Cf}` và cắt khoảng trắng hai đầu, phải dài 1–300 ký tự **đếm theo NFC** và có **ít nhất một chữ cái** (`\p{L}`). "…", "—", chuỗi chỉ có ký tự vô hình → V1 (`detail` "không có chữ" / "chuỗi rỗng"). Đồng thời sửa phần đếm của DR5-08: 250 ký tự viết NFD không còn bị tính 302.
- (B) Đổi mã trong ví dụ prompt thành `F0` (không bao giờ có, `FACT_CODE` từ chối) → V1 ở `evidence`. Model có thể chép "F0" vào câu trả lời thật, thêm lần thử lại.

Chọn **A**, giữ nguyên ví dụ: không đổi cách model đọc mẫu, đồng thời chặn mọi `text` rỗng nghĩa từ bất kỳ nguồn nào. Trích xuất (`field`, `value`, `quote`): chuỗi chỉ có ký tự vô hình → V1 "chuỗi rỗng"; **không** đòi chữ cái (giá trị số "2" là đúng). Test khóa của T-190 ("accepts the format example…") đảo thành "không ACCEPTED".

### 10.5 Kiểm tra kết nối (DR5-23)

`maxTokens` **64 → 1 024**, `reasoning` vẫn theo Settings (§6). Lý do: spec §4.2 đo `deepseek-v4.1-flash` dùng 65 token suy luận ở `high` cho câu hỏi ngắn, đã quá 64 → có thể `content: null` → `AI_BAD_RESPONSE` dù kết nối được. Giữ `reasoning` để Kiểm tra kết nối vẫn thử đúng mức suy luận Owner chọn; model trả "OK" thì dừng sớm nên chi phí gần như không đổi. (Cách khác: không gửi `reasoning` — rẻ hơn chút nhưng không còn kiểm model nhận mức đó.)

### 10.6 Nhận diện tin nhắn của app khi dán (R2-03, R2-04)

Không đổi chữ `web@1`. Đổi cách `checkWebAnswer` nhận ra câu dán là tin nhắn của app (`OWN_MESSAGE`: báo tại khung, không tính lần thử, không lưu):

1. **Chuẩn hóa từng dòng** trước khi so (R2-03), cùng bước 0 của §10.2: NFKC → bỏ `\p{Cf}` → bỏ tiền tố trích dẫn đầu dòng (một hay nhiều `>`, kèm khoảng trắng) → gộp mọi khoảng trắng (kể cả NBSP) thành một dấu cách → cắt hai đầu. Dòng khung so cũng chuẩn hóa như vậy. Hết lọt khi khung bị đổi NFD / NBSP / ZWSP đầu dòng / hai dấu cách / `> `.
2. **Dán lại message thử lại** (R2-04): ngoài hai dòng khung `=== HƯỚNG DẪN ===`, `=== ĐẦU VÀO ===`, một dòng trùng **dòng đầu** ("Kết quả vừa rồi chưa đạt kiểm tra tự động với các lỗi sau:") hoặc **dòng cuối** ("Hãy trả lại toàn bộ kết quả…") của message thử lại §5 cũng là `OWN_MESSAGE`. Ở lần thử 2, RE dán nhầm tin nhắn "Copy yêu cầu sửa" thì phiên vẫn mở, không có dòng REJECTED. Câu báo giữ nguyên ("Đây là tin nhắn của app — hãy copy câu trả lời của ChatGPT.").

Spec `phase-5-ai.md` §3.1 mục 3 (G1 nhỏ), câu về tin nhắn của app đổi thành:

> câu dán có một dòng (sau chuẩn hóa: NFKC, bỏ ký tự định dạng, bỏ tiền tố trích dẫn `>`, gộp khoảng trắng) là khung `=== HƯỚNG DẪN ===` hoặc `=== ĐẦU VÀO ===` của tin nhắn app (dán lại cả hay một phần tin nhắn), **hoặc là dòng đầu / dòng cuối của message thử lại G5 §5 (dán lại "Copy yêu cầu sửa")** → báo "Đây là tin nhắn của app — hãy copy câu trả lời của ChatGPT." tại khung, không tính lần thử, không lưu gì (DR5-49, Owner 10/10/2026; R2-03, R2-04).

### 10.7 `maxTokens` (tùy chọn)

Đề xuất analysis / discovery **8 000 → 12 000**, extraction **4 000 → 8 000** (trần Rust 16 000). Eval 10/10, model mặc định ở `high` (token ra tính cả suy luận):

- E07 dùng 7 064 token ra ở **một** lần thử, 88 % trần. Câu trả lời bị cắt thì `extractJson` đọc sai (DR5-05).
- X01 lần 1 báo V1 "không có khối JSON", tổng hai lần 6 531 token ra: khớp với lần đầu hết 4 000 token trước khi viết xong JSON, lần 2 khoảng 2 500.

Chi phí chỉ tăng khi model thật sự viết dài. `maxTokens` không phải chữ prompt nên extraction vẫn giữ `extraction@1` (đề xuất trích xuất không lưu, không cần version để phân biệt).

### 10.8 Chữ prompt theo đọc tay eval 10/10 (R2–R7, Owner chọn)

Áp cho cả `analysis@2` và `discovery@2` (số quy tắc ghi theo analysis / discovery). Mỗi mục độc lập, Owner chọn mục nào đưa vào:

| # | Ghi nhận eval | Sửa quy tắc |
|---|---|---|
| P1 | E10 REJECTED vì "nhiều khả năng" ở lần thử 2 (V3 đúng: là cách nói xác suất) | 6 / 7, thêm cuối: `Không dùng cách nói mức khả năng như "nhiều khả năng", "khả năng cao"; viết "có thể".` |
| P2 | E20 viết "giải pháp bảo vệ hiện có" khi F8 = Không | 7 / 8: `Khi cần nhắc, viết "giải pháp bảo vệ hiện có"…` → `Khi cần nhắc giải pháp bảo vệ mà dữ kiện cho thấy KH đã có, viết "giải pháp bảo vệ hiện có" và trích mã dữ kiện.` |
| P3 | E12, E19 `needs[3]` khuyên cân đối / giảm tập trung tài sản; E16 lộ trình triển khai | 7 / 8, thêm cuối: `Không khuyên phân bổ hay cơ cấu lại tài sản (tăng / giảm một loại tài sản); nếu đáng bàn, đưa vào discoveryStrategy thành điều RE cần tìm hiểu.` |
| P4 | E14: 51 tuổi → ghi "Mão hoặc Thìn" (đúng là Dần / Mão) | 8 / 9, thêm sau `(vd. tuổi cho con giáp)`: `Đầu vào chỉ có tuổi: năm sinh là năm phân tích trừ tuổi, hoặc trước đó một năm; khi hai năm đó khác con giáp / mệnh thì nêu cả hai.` |
| P5 | ESOTERIC yếu căn cứ: E02, E07, E09 ("theo huyền học… chín muồi"), E20 (Hải Phòng → "sông nước"), E15 ("nhóm tuổi đầu 30") | 8 / 9, thêm cuối: `Phần tử ESOTERIC chỉ nêu con giáp hoặc mệnh ngũ hành suy từ tuổi, hoặc nhãn có sẵn trong dữ kiện; không suy cung hoàng đạo, thần số học (cần ngày sinh) và không gán ý nghĩa huyền học cho nghề nghiệp, nơi ở hay thời điểm.` |
| P6 | E17 `painPoints[1]` đưa ý "hướng nội" sang khối khác mà không viết nhãn | 8 / 9, thêm sau `không viết ở phần nào khác.`: `Các phần khác không khái quát dữ kiện thành nét tính cách; KH tự mô tả mình thì chỉ nhắc lại điều KH nói và trích mã.` |

Đề xuất đưa **cả 6** vào: mỗi câu ngắn, nhắm đúng một ghi nhận có mã hồ sơ; eval sau (Owner chạy sau merge, script đã sửa ở T-198) đo lại.

### 10.9 Ca kiểm mới (thêm vào §8.5)

| # | Chuỗi trong output | Kết quả |
|---|---|---|
| C20 | "Hẹn KH để chốt lịch gặp tiếp" | đạt |
| C21 | "KH báo mình sẽ đi công tác" | đạt |
| C22 | "KH có khả năng kỹ thuật tốt" | đạt |
| C23 | "Điểm sơ bộ của buổi gặp đầu" | đạt |
| C24 | "KH thuộc nhóm C-level của tập đoàn" | đạt |
| C25 | "Chốt được lịch hẹn tuần sau" | đạt |
| C26 | "Hỏi KH về khoản 2 điều kiện vay" | đạt |
| C27 | "Hỏi KH đã quyết định số tiền dành cho học phí chưa" | đạt |
| C28 | "KH có dấu hiệu giữ kỷ luật KH tự đặt khi chi tiêu" | đạt |
| C29 | "HỎI KH ĐÃ CÓ LUẬT SƯ GIA ĐÌNH CHƯA" | đạt |
| C30 | "Đúng pHáp luật Việt Nam" | đạt |
| C31 | "KH có thể gắn bó với đơn vị cũ do tin cậy người tư vấn" | đạt |
| C32 | "KH có thể cần thời gian suy nghĩ quyết định" | đạt |
| C33 | "KH thích nhóm màu trung tính" | đạt |
| C34 | "Làm rõ điều 2 vợ chồng KH còn băn khoăn" | đạt |
| C35 | "KH có thể sẵn sàng mua nhà trong năm 2027 (F1)" | đạt |
| C36 | "Con KH cần cải thiện điểm số để du học" | đạt |
| C37 | "Hỏi tài khoản liên kết chung của hai vợ chồng" | đạt |
| C38 | "RE bảo viết lại mục tiêu cho rõ" | đạt |
| C39 | "KH sẵn sàng mua bảo hiểm" | V3 |
| C40 | "Chấm điểm KH 8/10" | V3 |
| C41 | "KH có thể chốt được trong tháng này" | V3 |
| C42 | "Theo khoản 2 điều 35" | V6 |
| C43 | "Quyết định số 123/QĐ-BTC" | V6 |
| C44 | "Theo Luật BHXH" · "LuẬt Đất đai quy định" | V6 |
| C45 | "Theo Điều ٣٥" · "Theo Điều ３５" | V6 |
| C46 | "KH có ７０％ cơ hội đồng ý" · "Tỷ lệ 5‰" · "KH có 70 percent cơ hội" | V3 |
| C47 | "Xác-suất cao" · "xác_suất cao" | V3 |
| C48 | "xác" + U+200B + "suất" | V3 |
| C49 | "P" + U+200B + "rudential" · "ＡＩＡ" | V4 |
| C50 | "I" + U+2060 + "NTJ" ở `hypotheses` · "mệnh" + U+00AD + "Kim" ở `needs` | V5 |
| C51 | "Lu" + U+200B + "ật Kinh doanh bảo hiểm" | V6 |
| C52 | `text` "…" · `text` chỉ có U+200B | V1 |
| C53 | `text` 250 ký tự viết NFD | đạt |
| C54 | Ví dụ JSON của `analysis@2` / `discovery@2` dán nguyên, với đầu vào có đủ mã ví dụ | V1, không ACCEPTED |

Tin nhắn ChatGPT web (§10.6), test bảng biến thể, cả hai dòng khung: tin nhắn `web@1` đổi sang NFD · NBSP trong khung · U+200B đầu dòng khung · hai dấu cách trong khung · tiền tố `> ` mọi dòng → `OWN_MESSAGE`; lần thử 2 dán đúng `retryMessage` của phiên → `OWN_MESSAGE`, phiên còn 1 lần thử đã dùng, không có `row`.

### 10.10 Không làm trong đợt này

- Chữ tương hình (Cyrillic, Greek): §10.2.
- "Điều" viết hoa ở **đầu câu** ("Điều 2 vợ chồng lo nhất là…") vẫn bị chặn; "điều 35" viết thường đứng riêng không còn bị chặn. Điều luật luôn viết hoa "Điều", nên chọn hướng này.
- "nhiều khả năng", "khả năng cao" vẫn chặn (là cách nói xác suất); P1 nói rõ trong prompt.
- "sẵn sàng mua" / "tiềm năng mua" không kèm từ sản phẩm nhưng có chữ khác theo sau ("KH sẵn sàng mua trong quý tới") lọt; quy tắc 6 / 7 của prompt vẫn cấm.
- `detail` ghi tên mục thay vì chữ model viết, mục trùng nhau sinh hai issue (ghi chú #420): code, không thuộc G5.

### 10.11 Owner duyệt

- [ ] Version: `analysis@2`, `discovery@2`; `extraction@1`, `web@1` giữ (§10.1)
- [ ] Cách so khớp: NFKC, bỏ `\p{Cf}`, `-` / `_` thành dấu cách, khoảng trắng trong cụm tùy chọn, `\p{Nd}`, `‰`, "percent" (§10.2)
- [ ] Danh sách chặn đổi (§10.3)
- [ ] V1 phương án A: `text` phải có chữ, đếm theo NFC (§10.4)
- [ ] Kiểm tra kết nối `maxTokens` 1 024, giữ `reasoning` (§10.5)
- [ ] Nhận diện tin nhắn của app + câu spec §3.1 mục 3 (§10.6)
- [ ] `maxTokens` analysis / discovery 12 000, extraction 8 000 (§10.7)
- [ ] Chữ prompt P1–P6 — chọn mục (§10.8)
- [ ] Ca kiểm C20–C54 + bảng biến thể tin nhắn web (§10.9)
