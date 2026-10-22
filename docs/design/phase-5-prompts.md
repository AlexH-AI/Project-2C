# Phase 5 — Prompt và guardrail AI (G5)

- **Cổng:** G5 (prompt + guardrail) · **Trạng thái:** **Owner duyệt G5 07/10/2026** (PR #414; quyết định Q1–Q5 ở §9; Q6 duyệt cùng ngày ở PR #417) · §6a `web@1` (ChatGPT web, W-1) **Owner duyệt G5 08/10/2026** (PR #430) · Đợt Phase 6 `analysis@2` / `discovery@2` **Owner duyệt G5 11/10/2026** (T-197 #491, §10) · Đợt lượt 2 `analysis@3` / `discovery@3` **Owner duyệt G5 18/10/2026** (T-257 #661, §11) · Đợt lượt 3 `analysis@4` / `discovery@4` **Owner duyệt G5 23/10/2026** (T-277 #728, §12; PR code chép vào §1–§8)
- **Nền:** spec `phase-5-ai.md` (G1 / G2 duyệt 07/10/2026) §3, §6.1, §6.2, §6.4, §8; ADR-0009 (ranh giới, mục 3 validator, mục 6 pháp lý); danh mục KYC `packages/domain/src/kyc-catalog.ts`
- **Dùng ở:** T-165 #406 (validator V3–V6 lấy **nguyên** các danh sách §6–§8), T-166 #407 (chữ prompt §2–§5 chép **nguyên văn** vào `packages/ai/src/prompts/<mode>.ts`)
- **Đổi chữ prompt hoặc danh sách chặn sau khi duyệt** = tăng version (`analysis@2`…) + qua G5 lần nữa. Lỗi chính tả trong code so với file này là lỗi, không phải phiên bản mới.

## 1. Cách dựng messages

Mỗi lần gọi gồm đúng hai message, cộng thêm hai message khi phải thử lại:

| # | role | Nội dung |
|---|---|---|
| 1 | `system` | Chữ prompt của chế độ (§2, §3 hoặc §4), cố định theo version |
| 2 | `user` | Đầu vào dạng JSON (§1.1 hoặc §4.1), một khối, không thêm chữ |
| 3 | `assistant` | Nội dung thô của lần trả lời sai (chỉ khi thử lại); cắt bớt khi cần, dưới bảng |
| 4 | `user` | Message thử lại (§5), liệt kê lỗi validator |

- Trần 200 000 ký tự của cả bốn message (spec §5.1): khi message 1 + 2 + 4 cộng nguyên câu trả lời sai vượt trần, message 3 là **phần đầu** câu trả lời đó, cắt theo code point vừa đủ để tổng = trần; câu trả lời vừa trần thì gửi nguyên văn như cũ. Message 1 + 2 + 4 đã vượt trần → không thử lại, báo `AI_TOO_LARGE` (spec §5.3). Owner duyệt G5 11/10/2026 (T-199, CX-A6); chữ prompt không đổi nên không tăng version.
- Không gửi `response_format` (spec §5.1). Prompt yêu cầu chỉ trả một khối JSON; app lấy khối JSON đầu tiên (spec §6.1).
- `maxTokens`: analysis / discovery **24 000**, extraction **12 000**, Kiểm tra kết nối **1 024** (Owner 11/10/2026, §10.5, §10.7; ban đầu 8 000 / 4 000 / 64). Model có reasoning tính token suy luận vào trần này; trần x3 xấp xỉ số token model viết được trong hạn 120 s của một lần gọi.
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

## 2. Prompt `analysis@3` (chế độ `PAIN_POINT_ANALYSIS`)

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
6. Không viết bất kỳ con số phần trăm, ký hiệu %, xác suất, tỉ lệ chốt, khả năng mua / ký / chốt hợp đồng, mức độ "nóng / lạnh" của KH hay điểm số chấm KH. Không dùng cách nói mức khả năng như "nhiều khả năng", "khả năng cao"; viết "có thể".
7. Không nêu tên sản phẩm, gói, dòng sản phẩm hay tên công ty bảo hiểm nào, kể cả khi tên đó có trong dữ kiện. Khi cần nhắc giải pháp bảo vệ mà dữ kiện cho thấy KH đã có, viết "giải pháp bảo vệ hiện có" và trích mã dữ kiện. Không đề xuất mua hay chuyển đổi sản phẩm. Không khuyên phân bổ hay cơ cấu lại tài sản (tăng / giảm một loại tài sản); nếu đáng bàn, đưa vào discoveryStrategy thành điều RE cần tìm hiểu.
8. Nhãn tính cách chỉ được viết trong personalityNotes, không viết ở phần nào khác. Các phần khác không khái quát dữ kiện thành nét tính cách; KH tự mô tả mình thì chỉ nhắc lại điều KH nói và trích mã. Mỗi phần tử ghi "system": "PSYCHOLOGY" (tâm lý học: MBTI, DISC, Enneagram, Big Five, hướng nội / hướng ngoại) hoặc "ESOTERIC" (tử vi / huyền học: cung hoàng đạo, con giáp, mệnh ngũ hành, nhóm máu, thần số học). Đây là suy đoán để RE tham khảo — ngoại lệ duy nhất của quy tắc 1: viết "KH có thể…", phải có "evidence" trỏ tới dữ kiện làm căn cứ (vd. tuổi cho con giáp), không có căn cứ thì để personalityNotes là []. Đầu vào chỉ có tuổi: năm sinh là năm phân tích trừ tuổi, hoặc trước đó một năm; khi hai năm đó khác con giáp / mệnh thì nêu cả hai. Không dùng nhãn này làm căn cứ cho phần khác. Phần tử ESOTERIC chỉ nêu con giáp hoặc mệnh ngũ hành suy từ tuổi, hoặc nhãn có sẵn trong dữ kiện; không suy cung hoàng đạo, thần số học (cần ngày sinh) và không gán ý nghĩa huyền học cho nghề nghiệp, nơi ở hay thời điểm.
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

## 3. Prompt `discovery@3` (chế độ `PROFILE_DISCOVERY`)

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
7. Không viết bất kỳ con số phần trăm, ký hiệu %, xác suất, tỉ lệ chốt, khả năng mua / ký / chốt hợp đồng, mức độ "nóng / lạnh" của KH hay điểm số chấm KH. Không dùng cách nói mức khả năng như "nhiều khả năng", "khả năng cao"; viết "có thể".
8. Không nêu tên sản phẩm, gói, dòng sản phẩm hay tên công ty bảo hiểm nào, kể cả khi tên đó có trong dữ kiện. Khi cần nhắc giải pháp bảo vệ mà dữ kiện cho thấy KH đã có, viết "giải pháp bảo vệ hiện có" và trích mã dữ kiện. Không đề xuất mua hay chuyển đổi sản phẩm. Không khuyên phân bổ hay cơ cấu lại tài sản (tăng / giảm một loại tài sản); nếu đáng bàn, đưa vào discoveryStrategy thành điều RE cần tìm hiểu.
9. Nhãn tính cách chỉ được viết trong personalityNotes, không viết ở phần nào khác. Các phần khác không khái quát dữ kiện thành nét tính cách; KH tự mô tả mình thì chỉ nhắc lại điều KH nói và trích mã. Mỗi phần tử ghi "system": "PSYCHOLOGY" (tâm lý học: MBTI, DISC, Enneagram, Big Five, hướng nội / hướng ngoại) hoặc "ESOTERIC" (tử vi / huyền học: cung hoàng đạo, con giáp, mệnh ngũ hành, nhóm máu, thần số học). Đây là suy đoán để RE tham khảo — ngoại lệ duy nhất của quy tắc 1: viết "KH có thể…", phải có "evidence" trỏ tới dữ kiện làm căn cứ (vd. tuổi cho con giáp), không có căn cứ thì để personalityNotes là []. Đầu vào chỉ có tuổi: năm sinh là năm phân tích trừ tuổi, hoặc trước đó một năm; khi hai năm đó khác con giáp / mệnh thì nêu cả hai. Không dùng nhãn này làm căn cứ cho phần khác. Phần tử ESOTERIC chỉ nêu con giáp hoặc mệnh ngũ hành suy từ tuổi, hoặc nhãn có sẵn trong dữ kiện; không suy cung hoàng đạo, thần số học (cần ngày sinh) và không gán ý nghĩa huyền học cho nghề nghiệp, nơi ở hay thời điểm.
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
- Lỗi V1 nêu dạng đúng (Owner 18/10/2026, §11.6): khóa thiếu "thiếu, cần array" (khóa enum thiếu: "thiếu, cần một trong: …"); mã dữ kiện sai dạng "sai định dạng, cần mã dữ kiện dạng F12"; giá trị ngoài danh sách "giá trị không hợp lệ, cần một trong: PSYCHOLOGY, ESOTERIC" (danh sách lấy từ schema); `value` trích xuất sai kiểu "sai kiểu, cần string, number hoặc boolean" (`value` là chuỗi sai luật của chuỗi thì nhận lỗi của luật đó, vd. "chuỗi rỗng").

## 6. Message Kiểm tra kết nối

Không lưu, không qua validator (spec §4.3). `system`: `Trả lời đúng một từ: OK` · `user`: `ping` · `maxTokens` 1 024, `reasoning` theo Settings (§10.5). Thành công = lệnh Rust trả về không lỗi; không kiểm nội dung.

## 6a. Tin nhắn ChatGPT web `web@1` (spec §3.1, W-1 — Owner duyệt G5 08/10/2026)

ChatGPT web không có message `system`: app ghép **một** tin nhắn để người dùng dán. Chữ prompt của chế độ (§2 hoặc §3) giữ **nguyên văn**; phần bọc dưới có version riêng `web@1`, và `prompt_version` lưu dạng `analysis@3+web@1` (spec §7.1). Thay `{prompt}` bằng chữ prompt của chế độ, `{input}` bằng khối JSON đầu vào §1.1 (đúng như message `user` khi gọi OpenCode):

````plaintext
Tin nhắn này có hai phần. Phần HƯỚNG DẪN là chỉ dẫn cho toàn bộ cuộc trò chuyện; phần ĐẦU VÀO chính là khối JSON mà hướng dẫn gọi là "tin nhắn tiếp theo". Chỉ dùng thông tin trong ĐẦU VÀO: không tìm kiếm web, không dùng nguồn bên ngoài, không dùng thông tin từ các cuộc trò chuyện khác. Chỉ trả lời bằng đúng một khối JSON theo định dạng trong hướng dẫn, không thêm lời giải thích.

=== HƯỚNG DẪN ===
{prompt}

=== ĐẦU VÀO ===
{input}
````

- **Thử lại:** nút "Copy yêu cầu sửa" copy đúng message thử lại §5 (cùng `{issues}`); người dùng dán vào **cùng** cuộc chat nên không cần lặp lại prompt.
- **Câu dán là tin nhắn của app** (spec §3.1 mục 3; R2-03, R2-04 — Owner 11/10/2026, §10.6): mỗi dòng của câu dán và các dòng mốc chuẩn hóa như bước 0 của §7 (bỏ ký tự vô hình theo tập K20, gộp khoảng trắng, NFKC — §11.2), rồi bỏ tiền tố trích dẫn đầu dòng (một hay nhiều `>`, kèm khoảng trắng), gộp mọi khoảng trắng thành một dấu cách, cắt hai đầu. Một dòng trùng dòng mốc → `OWN_MESSAGE`: báo tại khung, không tính lần thử, không lưu. Dòng mốc: hai dòng khung `=== HƯỚNG DẪN ===`, `=== ĐẦU VÀO ===`, và dòng đầu, dòng cuối của message thử lại §5.
- Câu trả lời dán vào được xử lý như `content` của model: lấy khối JSON đầu tiên, bỏ rào ```` ```json ```` (spec §6.1); V1–V6 như §7–§8. Không có `maxTokens`, `reasoning` — người dùng tự chọn model và mức suy luận trên web.
- Khối trên dùng rào `plaintext` để `prompts.test.ts` (đang so đúng bốn khối `text` §2–§5) còn xanh cho tới task cài `web@1` (spec §13 #13); task đó so khối này với hằng số trong code.
- Đổi chữ phần bọc = `web@2` + qua G5; đổi prompt chế độ thì `prompt_version` đổi theo (vd. `analysis@3+web@1`).

## 7. Cách so khớp chung cho V3–V6

0. **Chuẩn hóa nền** (Owner 11/10/2026, §10.2; thứ tự và tập ký tự Owner 18/10/2026, §11.2): bỏ ký tự vô hình theo **tập của K20** (`\p{Cf}` như U+200B, 200C, 200D, 2060, 00AD, FEFF; mọi `\p{Default_Ignorable_Code_Point}` như U+3164, U+034F, bộ chọn biến thể; U+2800; ký tự điều khiển C0 / C1 không phải khoảng trắng — DR6-111, Owner 21/10/2026), gộp mọi khoảng trắng Unicode (kể cả NBSP, U+0085) thành một dấu cách, cắt hai đầu, **rồi** NFKC (gom `％`, `﹪` về `%`, chữ số / chữ cái toàn độ rộng về ASCII; dấu tổ hợp viết rời ghép lại vào chữ) → thay `-` và `_` bằng dấu cách. Gọi là **bản gốc** (giữ hoa thường). Mục trong danh sách cũng chuẩn hóa như vậy (vd. "dai-ichi" khớp "dai ichi").
1. Từ bản gốc: chữ thường → thay mọi chuỗi khoảng trắng bằng một dấu cách. Gọi là **bản có dấu**.
2. **Bản bỏ dấu** (Owner 18/10/2026, §11.3): mục "Bỏ dấu: có" khớp khi **mỗi chữ** (âm tiết) của mục trong bản có dấu được viết **đúng như mục**, hoặc viết **không dấu** (không dấu thanh, không dấu phụ, `đ` viết `d`). Trong một cụm, các chữ có thể lẫn hai cách ("Xác suat", "bảo hiem tron doi"). Chữ có dấu **khác** mục thì không khớp: "nghỉ", "nghĩ" không phải "nghị"; "nông" không phải "nóng". Mẫu `regex` "cả bản bỏ dấu" theo cùng luật: mỗi chữ trong mẫu (ngoài lớp ký tự `[…]`) cũng được viết không dấu.
3. Mục "Bỏ dấu: không": chỉ khớp chữ viết đúng như mục. Dùng cho mục mà dạng không dấu của nó là chữ thường có thật, vd. "do tin cậy" (vì tin cậy) trùng dạng không dấu của "độ tin cậy".
4. Cụm từ khớp theo **ranh giới từ**: trước và sau cụm không phải chữ cái / chữ số (Unicode). Không khớp giữa một từ. **Khoảng trắng bên trong cụm khớp 0 hoặc 1 dấu cách**: bỏ ký tự vô hình làm hai chữ dính nhau ("xác" + U+200B + "suất" → "xácsuất").
5. Mục `regex` chạy trên chuỗi đã chuẩn hóa như ghi trong bảng (có cờ `u`). Trong bảng, `\b` nghĩa là ranh giới từ Unicode của mục 4 — `\b` của JavaScript chỉ hiểu chữ ASCII (sai với "đ", "ề"…), nên code dùng `(?<![\p{L}\p{N}])` / `(?![\p{L}\p{N}])`. Chữ số là `\p{Nd}` (mọi chữ số thập phân Unicode — NFKC không đổi chữ số Ả Rập "٣٥"). Mẫu ghi "trên bản gốc" chạy trên bản gốc của bước 0. Một dấu cách viết trong mẫu khớp 0 hoặc 1 dấu cách, như bên trong cụm (mục 4); `\s*` trong mẫu V6 cũng cho phép hai phần dính nhau sau khi bỏ ký tự vô hình (§11.2).
6. Áp cho mọi chuỗi `text` trong output analysis / discovery (không áp cho mã `evidence`, `missingCategory`, `system`), **trừ V5 không áp cho `personalityNotes[*].text`** (§8.3). V3, V4, V6 vẫn áp cho `personalityNotes`. Mỗi lần khớp một `ValidationIssue`, `path` trỏ tới chuỗi đó.

## 8. Danh sách chặn

### 8.1 V3 — xác suất, chấm điểm, đoán khả năng mua

| Mục | Kiểu | Bỏ dấu |
|---|---|---|
| `%` · `‰` (ký tự, ở bất kỳ đâu; `％`, `﹪` thành `%` qua NFKC) | ký tự | — |
| phần trăm · percent | cụm | có |
| xác suất | cụm | có |
| tỉ lệ chốt · tỷ lệ chốt · tỉ lệ thành công · tỷ lệ thành công | cụm | có |
| khả năng chốt · khả năng mua · khả năng tham gia · khả năng thành công | cụm | có |
| khả năng ký | cụm | **không** |
| khả năng cao · khả năng thấp · nhiều khả năng · ít khả năng | cụm | có |
| cơ hội chốt · chốt deal · chốt sale · chốt hợp đồng · chốt hđ | cụm | có |
| dễ chốt | cụm | **không** |
| `\bchốt được\b(?! (lịch\|ngày\|giờ\|buổi\|thời gian\|thời điểm\|cuộc hẹn\|hẹn\|mốc\|kế hoạch\|mục tiêu\|phương án)\b)` | regex, cả bản bỏ dấu | — |
| `\b(sẵn sàng\|tiềm năng) mua\b(?=\s*($\|[.,;:!?)]\|(bảo hiểm\|sản phẩm\|giải pháp\|gói\|hợp đồng\|hđ)\b))` — chỉ khi theo sau là hết câu / dấu câu / từ chỉ sản phẩm | regex, cả bản bỏ dấu | — |
| sẵn sàng ký · chắc chắn mua · chắc chắn ký · tiềm năng chốt | cụm | có |
| độ tin cậy · mức độ tin cậy | cụm | **không** |
| khách nóng · khách lạnh · khách ấm · hot lead · warm lead · cold lead · lead score | cụm | có |
| chấm điểm KH · chấm điểm khách · điểm số KH · điểm số khách · xếp hạng KH · xếp hạng khách | cụm | có |

Ghi chú: "có thể", "có dấu hiệu" **không** bị chặn (prompt yêu cầu dùng). "Sẽ mua" không nằm trong danh sách vì trùng mục tiêu thật ("sẽ mua nhà năm 2027"); cùng lý do, "sẵn sàng mua" / "tiềm năng mua" chỉ chặn khi không có đối tượng hoặc đối tượng là sản phẩm (Owner 11/10/2026). Không chặn dạng "8/10" bằng regex vì trùng ngày ("01/10"); chấm điểm KH đã chặn qua "chấm điểm KH", "điểm số KH". "Tỷ lệ" đứng một mình không bị chặn (vd. tỷ lệ phân bổ tài sản), nhưng `%` luôn bị chặn — output trích mã dữ kiện thay vì nhắc lại số %. Trong regex, `\|` là dấu `|` (thoát khỏi bảng Markdown); một dấu cách viết trong regex khớp 0 hoặc 1 dấu cách như bên trong cụm (§7 mục 4).

### 8.2 V4 — tên sản phẩm, hãng bảo hiểm

**a) Hãng bảo hiểm** (nhân thọ và phi nhân thọ đang hoạt động tại Việt Nam, kể cả tên tắt):

| Mục | Bỏ dấu |
|---|---|
| prudential · pru · manulife · aia · dai-ichi · daiichi · fwd · generali · sun life · sunlife · chubb · hanwha · mb ageas · ageas · bidv metlife · metlife · cathay · fubon · shinhan life · phú hưng life · baoviet · bvnt · aviva · vietcombank-cardif · vcli · cardif · bic · pvi · pti · pjico · mic · vbi · liberty · tokio marine · msig · bảo long · aaa assurance | có |
| bảo việt · bảo minh | **không** |

("dai ichi" bỏ khỏi danh sách: "dai-ichi" đã khớp sau bước 0 của §7.)

**b) Tiền tố dòng sản phẩm**: regex `\bpru ?[a-zà-ỹđ]` trên bản có dấu và bản bỏ dấu (`-` đã thành dấu cách ở bước 0). Mục "pru" ở (a) chỉ khớp khi "pru" đứng riêng thành từ (vd. "PRU-Hành Trang", "Pru Link"); regex này bắt thêm tên dòng sản phẩm viết dính liền (vd. "PRULink", "Prumax"). Các hãng khác không cần regex riêng: tên dòng sản phẩm của họ đi kèm tên hãng viết rời (vd. "AIA Vitality"), nên mục ở (a) đã chặn.

**c) Loại sản phẩm cụ thể** (nêu tên loại = gợi ý sản phẩm, ADR-0009):

| Mục | Bỏ dấu |
|---|---|
| liên kết đơn vị · bảo hiểm liên kết · unit-linked · universal life · whole life · term life · bảo hiểm tử kỳ · bảo hiểm hỗn hợp · bảo hiểm trọn đời · bảo hiểm niên kim · niên kim · bảo hiểm đầu tư · gói bảo hiểm · sản phẩm bảo hiểm · quyền lợi bổ trợ · sản phẩm bổ trợ · rider | có |

Ghi chú: "bảo hiểm liên kết" khớp cả "bảo hiểm liên kết chung / đơn vị"; "liên kết chung" đứng riêng (vd. "tài khoản liên kết chung") không bị chặn (Owner 11/10/2026). "giải pháp bảo vệ", "bảo vệ hiện có", "bảo vệ thu nhập", "quỹ dự phòng", "bảo hiểm sức khỏe" (chung chung, như câu hỏi gợi ý của danh mục) **không** bị chặn. Tên ngân hàng / công ty quản lý quỹ / mã chứng khoán chưa chặn ở v1 (§9 Q2).

### 8.3 V5 — nhãn tính cách ngoài khối tham khảo

Owner 07/10/2026 (§9 Q5): nhãn tính cách **không bị cấm**, mà được đưa vào khối riêng `personalityNotes` làm thông tin tham khảo (tâm lý học `PSYCHOLOGY` và tử vi / huyền học `ESOTERIC`, AI suy ra từ dữ kiện, bắt buộc có bằng chứng). V5 chỉ chặn các mục dưới khi chúng xuất hiện ở **khối khác** (`hypotheses`, `needs`, `painPoints`, `themes`, `discoveryStrategy`, `nextBestActions`), để nhãn không lẫn vào phần phân tích chính.

| Mục | Kiểu | Bỏ dấu |
|---|---|---|
| `\b[ie][ns][tf][jp]( [at])?\b` trên bản có dấu (vd. "INTJ", "ENFP-A") | regex | — |
| mbti · disc · enneagram · big five · big 5 | cụm | có |
| `\b(nhóm\|kiểu) [disc]\b(?! (level\|suite)\b)` (vd. "nhóm D"; "nhóm C-level" không khớp) | regex, cả bản bỏ dấu | — |
| dominance · influence · steadiness · conscientiousness | cụm | có |
| hướng nội · hướng ngoại · introvert · extrovert · người hướng nội · người hướng ngoại | cụm | có |
| cung hoàng đạo · cung mệnh · con giáp · ngũ hành · thần số học · nhân số học | cụm | có |
| nhóm máu | cụm | **không** |
| tử vi · bát tự | cụm | **không** |
| bạch dương · kim ngưu · song tử · cự giải · xử nữ · thiên bình · bọ cạp · thiên yết · nhân mã · ma kết · bảo bình · song ngư · sư tử | cụm | **không** |
| tuổi tý · tuổi sửu · tuổi dần · tuổi mão · tuổi mẹo · tuổi thìn · tuổi tỵ · tuổi tị · tuổi ngọ · tuổi mùi · tuổi thân · tuổi dậu · tuổi tuất · tuổi hợi | cụm | **không** |
| mệnh kim · mệnh mộc · mệnh thủy · mệnh thuỷ · mệnh hỏa · mệnh hoả · mệnh thổ | cụm | **không** |
| `\bnhóm máu (a\|b\|ab\|o)\b` | regex | — |

Ghi chú: "tính cách" và "kiểu người" không nằm trong danh sách (dễ chặn nhầm câu mô tả hành vi). Validator không kiểm `system` khớp nội dung (vd. MBTI ghi nhầm `ESOTERIC`); eval đọc tay.

### 8.4 V6 — trích dẫn văn bản pháp lý

| Mục | Kiểu | Bỏ dấu |
|---|---|---|
| `\b(Điều\|ĐIỀU)\s*\p{Nd}+` trên **bản gốc, giữ hoa thường** (vd. "Điều 35", "Điều" + U+200B + "35"; "điều 2 vợ chồng" không khớp) | regex | — |
| `\bkhoản\s*\p{Nd}+[,]?\s*điều\s*\p{Nd}+` (vd. "khoản 2 Điều 35"; "khoản 2 điều kiện" không khớp) | regex, cả bản bỏ dấu | — |
| `\bđiểm\s*[a-zđ]\s*khoản\b` | regex, cả bản bỏ dấu | — |
| "luật" ở **mọi kiểu hoa / thường**, có ranh giới từ trước, không đứng sau từ "pháp", "kỷ", "kỉ", "quy", "qui" (mọi kiểu chữ) + khoảng trắng; theo sau là khoảng trắng (có thể không có) + một từ mở đầu bằng chữ hoa (`\p{Lu}`) mà **không** phải "KH", "RE" hay "sư" (mọi kiểu chữ). Chạy trên **bản gốc**. Vd. khớp "Luật Kinh doanh bảo hiểm", "Luật BHXH", "LuẬt Đất đai", "Luật" + U+200B + "BHXH"; không khớp "Luật sư", "LUẬT SƯ", "pháp luật Việt Nam", "pHáp luật Việt Nam", "kỷ luật KH", "quy luật Thị trường", "kỉ luật Thép", "qui luật Thị trường" | regex | — |
| bộ luật · nghị định · thông tư · văn bản hợp nhất | cụm | có |
| nghị quyết | cụm | **không** |
| `\b(quyết định\|công văn) số\s*\p{Nd}` (vd. "Quyết định số 123"; "quyết định số tiền" không khớp) | regex, cả bản bỏ dấu | — |
| `\b\p{Nd}{1,4}/\p{Nd}{4}/[a-zđ\p{Nd}]+\b` (số hiệu, vd. "46/2023/NĐ-CP", "08/2022/QH15") | regex, cả bản bỏ dấu | — |
| `\b(nđ cp\|tt btc\|qh1\p{Nd})\b` (`-` đã thành dấu cách ở bước 0) | regex, cả bản bỏ dấu | — |

Ghi chú: khác chữ spec §6.4 ở một điểm — "khoản <số>" **chỉ** chặn khi đi kèm "Điều <số>" vì "khoản 500 triệu" là cách nói tiền thường gặp. "Pháp luật", "pháp lý", "cần chuyên gia pháp lý xác nhận" không bị chặn, kể cả "pháp luật" đứng trước tên riêng (vd. "pháp luật Việt Nam", Owner 07/10/2026 — §9 Q6). "Điều <số>" chỉ chặn khi viết hoa "Điều" (Owner 11/10/2026): điều luật luôn viết hoa; "Điều 2 vợ chồng…" ở **đầu câu** vẫn bị chặn, "theo điều 35" viết thường đứng riêng không bị chặn.

### 8.5 Ca kiểm bắt buộc (T-165; C20–C54 đợt Phase 6, T-197; C55–C72 đợt lượt 2, T-257)

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
| C54 | Ví dụ JSON của `analysis@3` / `discovery@3` dán nguyên, với đầu vào có đủ mã ví dụ | V1, không ACCEPTED |
| C55 | Viết NFD, U+200B trước mỗi dấu tổ hợp: "KH dễ chốt" · "Bảo Việt" · "KH tuổi Tý" ở `needs` · "Theo Điều 35" · "Nghị quyết 12" | V3 · V4 · V5 · V6 · V6 |
| C56 | "Theo Điều" + U+200B + "35" · "Theo Điều" + U+2060 + "35" · "Luật" + U+200B + "Kinh doanh bảo hiểm" · "Luật" + U+2060 + "BHXH" | V6 |
| C57 | "khoản 2" + U+200B + "Điều" + U+200B + "35" · "khoản" + U+2060 + "2 điều 35" · "điểm" + U+200B + "a" + U+200B + "khoản 2" | V6 |
| C58 | "Hỏi KH đã có Luật" + U+200B + "Sư gia đình chưa" · "Di chúc cần đúng pháp" + U+200B + "luật Việt Nam" | đạt |
| C59 | "xác" + U+3164 + "suất" · "xác" + U+0085 + "suất" | V3 |
| C60 | "Bảo" + U+034F + "Minh" | V4 |
| C61 | `text` chỉ U+3164 · U+3164 + "…" | V1 |
| C62 | "Định hướng nơi ở sau khi nghỉ hưu" · "Định hướng ngoài giờ làm việc" · "Định hướng nối nghiệp cho con" ở `needs` · "RE chuyển hướng nói sang mục tiêu học phí" ở `nextBestActions` | đạt |
| C63 | "KH cần suy nghĩ định hướng đầu tư" · "KH nghĩ định cư ở Úc" · "KH nghỉ định kỳ hằng năm" | đạt |
| C64 | "Phần lớn là khách nông thôn" · "KH thuộc nhóm khách lãnh đạo cấp cao" · "Ngân hàng xếp hàng khách ưu tiên riêng" | đạt |
| C65 | "KH sẵn sàng kỹ lưỡng xem xét" · "KH muốn chắc chắn kỳ hạn gửi tiền" · "Khả năng múa của con KH" · "KH có khả năng mưa gió vẫn đến" | đạt |
| C66 | "Hai hợp đồng cùng mệnh giá" ở `needs` · "KH bỏ luật sư cũ" · "KH lo phí bảo hiểm từ kỳ tới sẽ tăng" · "KH thường gọi bảo hiểm khi xe gặp sự cố" | đạt |
| C67 | "KH là người hướng nội" · "KH cung mệnh Kim" · "KH la nguoi huong noi" · "KH huong nội" ở `needs` | V5 |
| C68 | "Theo nghị định mới" · "Theo nghi dinh moi" · "Nghi định 46 về thuế" | V6 |
| C69 | "KH là khách nóng" · "KH la khach nong" · "KH là khach nóng" · "KH sẵn sàng ký ngay" · "KH san sang ky ngay" · "Xác suat cao" | V3 |
| C70 | "Giữ kỉ luật Thép của KH" · "KH tin vào qui luật Thị trường" · "Giữ KỈ LUẬT Thép" · "KH tin vào QUI LUẬT Thị trường" | đạt |
| C71 | `text` 150 "a" + 650 000 × U+200B + 150 "a" · 150 "a" + 701 × U+200B + 150 "a" | V1 ("quá 1 000 ký tự kể cả ký tự vô hình") |
| C72 | `text` 150 "a" + 700 × U+200B + 150 "a" (đúng 1 000) · 300 × "ệ" viết NFD (900) + 100 × U+200B | đạt |

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

## 10. Đợt sửa G5 Phase 6 (T-197 #491) — Owner duyệt 11/10/2026

**Trạng thái:** đề xuất và **Owner duyệt G5 11/10/2026** ("duyệt hết"; §10.7 nâng x3–x5 theo tính toán, §10.8 đưa cả P1–P6). Các thay đổi đã chép vào §1–§8 (và spec `phase-5-ai.md` §3.1 mục 3, §5.1, §6.2, §6.4); mục này giữ lý do và số đo của từng quyết định.

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

### 10.7 `maxTokens`

Owner 11/10/2026: nâng **x3–x5**, mức cụ thể theo tính toán. Đề xuất **x3**: analysis / discovery **8 000 → 24 000**, extraction **4 000 → 12 000**.

Vì sao cần nâng (eval 10/10, model mặc định ở `high`, token ra tính cả suy luận):

- E07 dùng 7 064 token ra ở **một** lần thử, 88 % trần. Câu trả lời bị cắt thì `extractJson` đọc sai (DR5-05).
- X01 lần 1 báo V1 "không có khối JSON", tổng hai lần 6 531 token ra: khớp với lần đầu hết 4 000 token trước khi viết xong JSON, lần 2 khoảng 2 500.

Vì sao dừng ở x3:

- Tốc độ ra đo được 160–245 token/s (E18 chậm bất thường: 45 token/s). Trong hạn 120 s của một lần gọi (spec §5.2), model viết được khoảng 19 000–29 000 token. Trần 24 000 xấp xỉ mức hạn giờ cho phép. Trần x5 (40 000) không có tác dụng, vì `AI_TIMEOUT` sẽ đến trước.
- Chi phí chỉ tăng khi model thật sự viết dài. Trần chỉ chặn câu trả lời suy biến.

**Kéo theo một thay đổi Rust:** `ai.rs` từ chối `max_tokens` > 16 000 (`MAX_TOKENS`, trả `AI_BAD_REQUEST`). Muốn 24 000 thì nâng hằng này lên 32 000 (1 dòng + 2 test biên), PR phải gắn nhãn `build-exe`, và `apps/desktop/src-tauri/src/ai.rs` phải thêm vào danh sách file được phép của #491. Nếu không đổi Rust: analysis / discovery 16 000 (x2), extraction 12 000 (x3).

`maxTokens` không phải chữ prompt nên extraction vẫn giữ `extraction@1` (đề xuất trích xuất không lưu, không cần version để phân biệt).

### 10.8 Chữ prompt theo đọc tay eval 10/10 (R2–R7)

Owner 11/10/2026: **đưa cả P1–P6**. Áp cho cả `analysis@2` và `discovery@2` (số quy tắc ghi theo analysis / discovery):

| # | Ghi nhận eval | Sửa quy tắc |
|---|---|---|
| P1 | E10 REJECTED vì "nhiều khả năng" ở lần thử 2 (V3 đúng: là cách nói xác suất) | 6 / 7, thêm cuối: `Không dùng cách nói mức khả năng như "nhiều khả năng", "khả năng cao"; viết "có thể".` |
| P2 | E20 viết "giải pháp bảo vệ hiện có" khi F8 = Không | 7 / 8: `Khi cần nhắc, viết "giải pháp bảo vệ hiện có"…` → `Khi cần nhắc giải pháp bảo vệ mà dữ kiện cho thấy KH đã có, viết "giải pháp bảo vệ hiện có" và trích mã dữ kiện.` |
| P3 | E12, E19 `needs[3]` khuyên cân đối / giảm tập trung tài sản; E16 lộ trình triển khai | 7 / 8, thêm cuối: `Không khuyên phân bổ hay cơ cấu lại tài sản (tăng / giảm một loại tài sản); nếu đáng bàn, đưa vào discoveryStrategy thành điều RE cần tìm hiểu.` |
| P4 | E14: 51 tuổi → ghi "Mão hoặc Thìn" (đúng là Dần / Mão) | 8 / 9, thêm sau `(vd. tuổi cho con giáp)`: `Đầu vào chỉ có tuổi: năm sinh là năm phân tích trừ tuổi, hoặc trước đó một năm; khi hai năm đó khác con giáp / mệnh thì nêu cả hai.` |
| P5 | ESOTERIC yếu căn cứ: E02, E07, E09 ("theo huyền học… chín muồi"), E20 (Hải Phòng → "sông nước"), E15 ("nhóm tuổi đầu 30") | 8 / 9, thêm cuối: `Phần tử ESOTERIC chỉ nêu con giáp hoặc mệnh ngũ hành suy từ tuổi, hoặc nhãn có sẵn trong dữ kiện; không suy cung hoàng đạo, thần số học (cần ngày sinh) và không gán ý nghĩa huyền học cho nghề nghiệp, nơi ở hay thời điểm.` |
| P6 | E17 `painPoints[1]` đưa ý "hướng nội" sang khối khác mà không viết nhãn | 8 / 9, thêm sau `không viết ở phần nào khác.`: `Các phần khác không khái quát dữ kiện thành nét tính cách; KH tự mô tả mình thì chỉ nhắc lại điều KH nói và trích mã.` |

Mỗi câu ngắn, nhắm đúng một ghi nhận có mã hồ sơ. Eval sau (Owner chạy sau merge, bằng script đã sửa ở T-198) đo lại.

### 10.9 Ca kiểm mới (thêm vào §8.5)

Đã chép vào bảng §8.5 (C20–C54).

Tin nhắn ChatGPT web (§10.6), test bảng biến thể, cả hai dòng khung: tin nhắn `web@1` đổi sang NFD · NBSP trong khung · U+200B đầu dòng khung · hai dấu cách trong khung · tiền tố `> ` mọi dòng → `OWN_MESSAGE`; lần thử 2 dán đúng `retryMessage` của phiên → `OWN_MESSAGE`, phiên còn 1 lần thử đã dùng, không có `row`.

### 10.10 Không làm trong đợt này

- Chữ tương hình (Cyrillic, Greek): §10.2.
- "Điều" viết hoa ở **đầu câu** ("Điều 2 vợ chồng lo nhất là…") vẫn bị chặn; "điều 35" viết thường đứng riêng không còn bị chặn. Điều luật luôn viết hoa "Điều", nên chọn hướng này.
- "nhiều khả năng", "khả năng cao" vẫn chặn (là cách nói xác suất); P1 nói rõ trong prompt.
- "sẵn sàng mua" / "tiềm năng mua" không kèm từ sản phẩm nhưng có chữ khác theo sau ("KH sẵn sàng mua trong quý tới") lọt; quy tắc 6 / 7 của prompt vẫn cấm.
- `detail` ghi tên mục thay vì chữ model viết, mục trùng nhau sinh hai issue (ghi chú #420): code, không thuộc G5.

### 10.11 Owner duyệt

- [x] Version: `analysis@2`, `discovery@2`; `extraction@1`, `web@1` giữ (§10.1)
- [x] Cách so khớp: NFKC, bỏ `\p{Cf}`, `-` / `_` thành dấu cách, khoảng trắng trong cụm tùy chọn, `\p{Nd}`, `‰`, "percent" (§10.2)
- [x] Danh sách chặn đổi (§10.3)
- [x] V1 phương án A: `text` phải có chữ, đếm theo NFC (§10.4)
- [x] Kiểm tra kết nối `maxTokens` 1 024, giữ `reasoning` (§10.5)
- [x] Nhận diện tin nhắn của app + câu spec §3.1 mục 3 (§10.6)
- [x] `maxTokens` x3: analysis / discovery 24 000, extraction 12 000; Rust `MAX_TOKENS` 32 000 (§10.7)
- [x] Chữ prompt: cả P1–P6 (§10.8 — Owner 11/10/2026)
- [x] Ca kiểm C20–C54 + bảng biến thể tin nhắn web (§10.9)

## 11. Đợt sửa G5 Phase 6 lượt 2 (T-257 #661) — Owner duyệt 18/10/2026

**Trạng thái:** đề xuất và **Owner duyệt G5 18/10/2026** ("duyệt hết"). Các thay đổi đã chép vào §2, §3 (version), §5, §6a, §7, §8 (và spec `phase-5-ai.md` §6.2, §6.4); mục này giữ lý do và số đo của từng quyết định.

**Nền:** deep review Phase 1–6 lượt 1 (`docs/reviews/2026-10-15-deep-review-phase-1-6-luot-1-tong-hop.md` §5.3) DR6-17, DR6-23, DR6-24; lượt 2 (`docs/reviews/2026-10-17-deep-review-phase-1-6-luot-2-tong-hop.md` §6.3, §6.7) DR6-77, DR6-102. Owner 17/10/2026 chọn Phương án 3 (sửa hết, §9 của bản tổng hợp lượt 2). Tập ký tự vô hình lấy theo K20 mở rộng (T-255 #659: `normalizeText` của `packages/domain/src/text.ts`).

**Đã thử trước khi đề xuất** (bản dựng thử ngoài repo, chưa phải code):

- **58** chuỗi kiểm mới (ca C55–C72 của §11.7): luật hiện tại sai **41**, luật đề xuất đúng cả **58**. Mọi ca C1–C54 cũ (64 chuỗi) giữ nguyên kết quả.
- **1 085** chuỗi `text` thật của eval 10/10 và 11/10 (`docs/metrics/ai-eval-2026-10-1{0,1}.md`, mỗi chuỗi ở đúng khối của nó): **0** chuỗi bị chặn, trước và sau khi đổi.
- Quét toàn bộ Unicode: NFKC không biến ký tự thấy được nào thành ký tự vô hình. Vậy bỏ ký tự vô hình một lần, trước NFKC, là đủ (§11.2).
- Với DR6-23, đã thử cả hai hướng ở §11.3. Hướng "Bỏ dấu: không" cho từng mục (như Issue gợi ý) còn sai 6 câu thường mới tìm thấy. Hướng so theo từng chữ (đề xuất) đúng cả, và vẫn bắt chữ viết không dấu.

### 11.1 Version

| Prompt | Đổi | Version mới |
|---|---|---|
| analysis | cách so khớp (§11.2, §11.3), danh sách chặn (§11.2 mẫu V6, §11.4), V1 (§11.5, §11.6); **chữ prompt không đổi** | `analysis@3` |
| discovery | như analysis | `discovery@3` |
| extraction | chữ không đổi, không qua V3–V6; V1 (§11.5, §11.6) cũng áp nhưng đề xuất trích xuất không lưu | giữ `extraction@1` |
| tin nhắn ChatGPT web | chữ bọc không đổi; dòng dán chuẩn hóa theo bước 0 mới (§11.2) | giữ `web@1` → lưu `analysis@3+web@1` |

- Đầu file ghi: đổi danh sách chặn = tăng version. Đợt này chỉ đổi luật kiểm, nên tăng version để phân tích lưu sau đợt được phân biệt với bản `@2`. Phân tích đã lưu với `@2` vẫn hiện như đã ghi; `db` chỉ kiểm dạng `<mode>@<n>`. Seed lấy version từ `PROMPT_VERSIONS` nên tự theo.
- V1 chặt hơn (§11.5) cũng áp khi nhập backup (`db` dùng `@p2c/ai/schema`). Theo R2-02, Owner nạp lại dữ liệu giả lập; không viết migration.
- Version mới làm đổi test app và e2e đang ghim `@2`. Issue đã cho sửa `e2e/customer-ai*.spec.ts` và hai test app. Owner duyệt thêm `e2e/full-cycle.spec.ts` vào file được phép: dòng 275 ghim `discovery@2`.

### 11.2 Cách so khớp §7 bước 0 và mẫu V6 (DR6-17)

**Lỗi hiện tại:** bước 0 chạy NFKC **trước**, rồi mới bỏ `\p{Cf}`. Khi chữ viết NFD có U+200B chen trước dấu tổ hợp, NFKC không ghép được dấu vào chữ. Bỏ U+200B xong, chữ vẫn ở dạng NFD. Mọi mục chỉ so bản có dấu hay bản gốc vì thế lọt. Đã thử 5 / 5 ca lọt: "KH dễ chốt", "Bảo Việt", "KH tuổi Tý" (ở `needs`), "Theo Điều 35", "Nghị quyết 12". Nhận diện tin nhắn của app (§6a) cũng lọt:

- Tin nhắn `web@1` dán lại, có dòng khung viết như vậy: app tính là một lần thử (V1) thay vì báo `OWN_MESSAGE`.
- Ở lần thử 2, dán lại message thử lại viết như vậy: app lưu dòng REJECTED. R2-04 (§10.6) lọt.

Ngoài ra, ký tự vô hình không thuộc `\p{Cf}` cũng lọt: "xác" + U+3164 (Hangul filler) + "suất", "Bảo" + U+034F + "Minh" (review trước PR: ví dụ cũ "Bảo" + U+034F + "Việt" không lọt vì bản bỏ dấu cũ dính thành "baoviet", mục V4 có sẵn). U+0085 giữa hai chữ cũng lọt ("xác" + U+0085 + "suất"): `\s` của JavaScript không gồm U+0085, nên hai chữ không được tách.

**Đề xuất — bước 0 mới:**

> 0. **Chuẩn hóa nền:** bỏ ký tự vô hình theo **đúng tập của K20** (`\p{Cf}`, mọi `\p{Default_Ignorable_Code_Point}` như U+3164, U+034F, bộ chọn biến thể, và U+2800), gộp mọi khoảng trắng Unicode (kể cả NBSP, U+0085) thành một dấu cách, cắt hai đầu, **rồi** NFKC (gom `％`, `﹪` về `%`, chữ số / chữ cái toàn độ rộng về ASCII) → thay `-` và `_` bằng dấu cách. Gọi là **bản gốc** (giữ hoa thường). Mục trong danh sách cũng chuẩn hóa như vậy.

- Code: `normalizeText` của `domain` (hàm K20 dùng cho tên, giá trị KYC) rồi NFKC. Cả app dùng một tập ký tự vô hình; đổi tập ở K20 thì V3–V6 đổi theo.
- Bỏ ký tự vô hình trước thì dấu tổ hợp ghép lại được vào chữ khi NFKC. NFKC không sinh thêm ký tự vô hình (đã quét), nên không phải bỏ lần hai.
- Câu dán ChatGPT web (§6a) dùng chung bước 0 mới. Các bước sau đó (bỏ tiền tố `>`, gộp khoảng trắng, cắt hai đầu) giữ nguyên.

**Mẫu V6 có `\s+`** (DR6-17, H·CL-C1): bỏ ký tự vô hình làm hai chữ dính nhau ("Điều" + U+200B + "35" thành "Điều35"). Cụm từ và dấu cách viết trong mẫu đã khớp 0 hoặc 1 dấu cách (§7 mục 4, 5), nhưng `\s+` thì đòi ít nhất một khoảng trắng. Đề xuất đổi `\s+` → `\s*` ở bốn mẫu của §8.4:

| Mẫu | Mới |
|---|---|
| "Điều <số>" | `\b(Điều\|ĐIỀU)\s*\p{Nd}+` |
| "khoản <số> điều <số>" | `\bkhoản\s*\p{Nd}+[,]?\s*điều\s*\p{Nd}+` |
| "điểm <chữ> khoản" (cùng loại, Issue không nêu) | `\bđiểm\s*[a-zđ]\s*khoản\b` |
| "luật <Tên>" | khoảng trắng **sau** "luật" có thể không có. Khoảng trắng giữa "pháp / kỷ / quy" và "luật" giữ như cũ: hai chữ dính liền thì "luật" không còn ranh giới từ ở đầu, nên không khớp |

Câu thường không đổi kết quả: "Hỏi KH đã có Luật" + U+200B + "Sư gia đình chưa" và "Di chúc cần đúng pháp" + U+200B + "luật Việt Nam" vẫn đạt. Văn bản thường không có "Điều35", "khoản2điều35" hay "luậtKinh" viết dính.

### 11.3 Bản bỏ dấu khớp nhầm câu thường (DR6-23)

**Lỗi hiện tại:** §7 mục 2 bỏ dấu **cả câu** rồi so với mục đã bỏ dấu. Hai chữ có dấu khác nhau mà bỏ dấu giống nhau thì khớp nhầm. Đây là lỗi của cả cách so, không riêng vài mục. Câu thường hôm nay bị chặn:

| Mục ("Bỏ dấu: có") | Câu thường bị chặn | Nguồn |
|---|---|---|
| hướng nội · hướng ngoại (V5) | "Định **hướng nơi** ở", "RE chuyển **hướng nói** sang…", "Định **hướng ngoài** giờ", "Định **hướng nối** nghiệp cho con" | DR6-23; "nối nghiệp" thấy khi thử |
| nghị định (V6) | "suy **nghĩ định** hướng", "**nghĩ định** cư", "**nghỉ định** kỳ hằng năm" | DR6-23; "nghỉ định kỳ" thấy khi thử |
| khách nóng · khách lạnh (V3) | "**khách nông** thôn", "nhóm **khách lãnh** đạo cấp cao" | DR6-23; "lãnh đạo" thấy khi thử |
| sẵn sàng ký · chắc chắn ký (V3) | "**sẵn sàng kỹ** lưỡng", "**chắc chắn kỳ** hạn gửi tiền" | DR6-23; "kỳ hạn" thấy khi thử |
| cung mệnh (V5) | "hai hợp đồng **cùng mệnh** giá" | thấy khi thử |
| bộ luật (V6) | "KH **bỏ luật** sư cũ" | thấy khi thử |
| bảo hiểm tử kỳ · gói bảo hiểm (V4) | "phí **bảo hiểm từ kỳ** tới", "KH thường **gọi bảo hiểm** khi xe gặp sự cố" | thấy khi thử |
| khả năng mua (V3) | "**Khả năng múa** của con KH", "**khả năng mưa** gió" | thấy khi thử |
| xếp hạng khách (V3) | "Ngân hàng **xếp hàng khách** ưu tiên riêng" | thấy khi thử |

**Đề xuất (A — so theo từng chữ).** Viết lại §7 mục 2–3:

> 2. **Bỏ dấu:** mục "Bỏ dấu: có" khớp khi **mỗi chữ** (âm tiết) của mục trong câu được viết **đúng như mục**, hoặc viết **không dấu** (không dấu thanh, không dấu phụ, `đ` viết `d`). Trong một cụm, các chữ có thể lẫn hai cách ("Xác suat", "bảo hiem tron doi"). Chữ có dấu **khác** mục thì không khớp: "nghỉ", "nghĩ" không phải "nghị"; "nông" không phải "nóng". Mẫu `regex` "cả bản bỏ dấu" theo cùng luật: mỗi chữ trong mẫu (ngoài lớp ký tự `[…]`) cũng được viết không dấu.
> 3. Mục "Bỏ dấu: không": chỉ khớp chữ viết đúng như mục. Vẫn cần cho mục mà dạng không dấu của nó là chữ thường có thật, vd. "do tin cậy" (vì tin cậy) trùng dạng không dấu của "độ tin cậy".

- Mọi câu thường ở bảng trên hết bị chặn, mà chữ viết không dấu vẫn bị chặn: "KH la nguoi huong noi", "Theo nghi dinh moi", "KH la khach nong", "KH san sang ky ngay", "Nghi định 46 về thuế", "Xác suat cao".
- Không đổi danh sách chặn: không mục nào phải chuyển cột "Bỏ dấu".
- Code: bỏ "bản bỏ dấu" của cả câu. Mỗi mục / mẫu "có" được dựng thành một regex chạy trên bản có dấu, trong đó mỗi chữ là "chữ đúng dấu hoặc chữ không dấu". Phần đổi nằm trong `text-match.ts`, khoảng 25 dòng.
- **Mất** (model không đối kháng, §10.10): chữ viết **sai dấu** ("xạc suất", "khả nắng mua"); chữ giữ `đ` nhưng bỏ dấu thanh ("Nghi đinh"); chữ có hai dấu thanh chồng nhau. Hai lượt eval thật không có chữ nào như vậy (R1 = 0).

**(B) "Bỏ dấu: không" cho từng mục** (như Issue gợi ý, như "nghị quyết" ở §10.3). Chuyển 5 nhóm: khách nóng / lạnh / ấm, sẵn sàng ký / chắc chắn ký, bốn mục hướng nội / ngoại, cung mệnh, nghị định. Hướng này **không chọn**, vì:

- Còn sai 6 câu thường ở bảng trên ("bỏ luật sư", "bảo hiểm từ kỳ", "gọi bảo hiểm", "khả năng múa / mưa", "xếp hàng khách"). Muốn hết thì phải chuyển thêm cả "bộ luật", "khả năng mua", "gói bảo hiểm"…
- Mỗi mục chuyển sang "không" là mất luôn việc bắt chữ viết không dấu ("khach nong", "nghi dinh", "kha nang mua").

### 11.4 V6 "luật <Tên>": chính tả i (DR6-102)

"luật" không đứng sau "pháp", "kỷ", **"kỉ"**, "quy", **"qui"** (mọi kiểu chữ) + khoảng trắng. "Kỉ luật", "qui luật" là cách viết i hợp chuẩn, cùng nghĩa với "kỷ", "quy". Hôm nay "Giữ kỉ luật Thép của KH" và "KH tin vào qui luật Thị trường" bị chặn nhầm (0 lần trong eval thật). Sau khi sửa, các câu này đạt, cả khi viết hoa toàn bộ ("KỈ LUẬT", "QUI LUẬT"). "Theo Luật Kinh doanh bảo hiểm" vẫn bị chặn.

### 11.5 V1: tập ký tự vô hình của K20, trần chuỗi gốc (DR6-77, DR6-17)

**Hiện tại** (`schema.ts`, DR6-16): V1 bỏ `\p{Cf}`, rồi đếm 1–300 ký tự NFC trên phần còn lại; kiểm có chữ cái trên **chuỗi gốc**; chuỗi gốc không có trần. Hệ quả:

- **DR6-77:** `text` = 300 chữ + 650 000 × U+200B đạt V1, lưu thành ACCEPTED với `output_json` 1 951 125 B ≈ 2 MB vô hình. Dòng nằm trong `ai_analyses` (chỉ thêm, không xóa được) và trong mọi backup sau đó. Nhập backup cũng nhận vì dùng cùng schema (CL2-C1).
- **Tập ký tự hẹp hơn K20:** `text` chỉ có U+3164 (Hangul filler) đạt V1. U+3164 là chữ cái (`\p{Lo}`) nhưng vô hình, và không thuộc `\p{Cf}`. Cũng vậy với U+3164 + "…".

**Đề xuất (A — trần chuỗi gốc).** Áp cho mọi chuỗi AI viết: `text` của analysis / discovery; `field`, `value`, `quote` của trích xuất.

1. **Chuỗi gốc** (sau khi cắt khoảng trắng hai đầu, như nay) dài tối đa **1 000** ký tự, tính cả ký tự vô hình và dấu viết rời. Đếm theo `length` của JavaScript (emoji tính 2), không cấp phát theo cỡ chuỗi. Quá trần → V1 "quá 1 000 ký tự kể cả ký tự vô hình", kiểm trước mọi luật khác của chuỗi.
   - **Vì sao 1 000:** một chữ tiếng Việt viết NFD dài nhất 3 ký tự ("ệ" = e + 2 dấu). Vậy mọi chuỗi 300 ký tự viết NFD (≤ 900) vẫn đạt.
   - Một phân tích (≤ 35 chuỗi) chở tối đa ≈ 35 000 ký tự, thay vì không giới hạn như nay.
2. **Phần thấy được** = chuỗi sau `normalizeText` (K20: bỏ ký tự vô hình, gộp khoảng trắng, NFC, cắt hai đầu).
   - Rỗng → "chuỗi rỗng"; dài 1–300 ký tự.
   - `text` của analysis / discovery phải có chữ cái **trong phần thấy được**.
   - Thay đổi nhỏ kèm theo: khoảng trắng liền nhau ở giữa chuỗi nay đếm là 1, như tên / KYC theo K20.
3. Giá trị lưu vẫn là chuỗi model viết, chỉ cắt khoảng trắng hai đầu như nay. Nhập backup dùng cùng schema, nên 2 MB vô hình **trong chuỗi** bị từ chối ở cả lệnh lẫn nhập backup. Không phải sửa code `db`, chỉ thêm test.

**(B) Lưu phần thấy được** (schema biến `text` thành `normalizeText(text)`). `output_json` sẽ không còn ký tự vô hình, nhưng có hai nhược điểm, nên **không chọn**:

- Nhập backup chỉ kiểm "schema parse được", mà phép biến đổi luôn parse được. Backup sửa tay vẫn mang 2 MB vô hình vào được, trừ khi `db` thêm phép so "output đã ở dạng chuẩn".
- Chữ lưu khác chữ model viết.

### 11.6 V1: `detail` nêu dạng đúng (DR6-24)

`detail` đi vào message thử lại (§5). Hiện nó chỉ nói "sai", không nói đúng là gì, nên lần thử 2 dễ trượt tiếp thành REJECTED (L·MU-C2). Đề xuất:

| Lỗi | Ví dụ `path` | `detail` hiện tại | `detail` mới |
|---|---|---|---|
| Thiếu khóa (khối, `text`…) | `themes` | sai kiểu, cần array | **thiếu**, cần array |
| Thiếu khóa enum | `personalityNotes[0].system` | giá trị không hợp lệ | **thiếu**, cần một trong: PSYCHOLOGY, ESOTERIC |
| Sai kiểu | `painPoints[0].text` | sai kiểu, cần string | giữ nguyên |
| Mã dữ kiện sai dạng | `hypotheses[0].evidence[0]` | sai định dạng | sai định dạng, cần mã dữ kiện dạng F12 |
| Giá trị ngoài danh sách | `personalityNotes[0].system` | giá trị không hợp lệ | giá trị không hợp lệ, cần một trong: PSYCHOLOGY, ESOTERIC |
| (như trên) | `discoveryStrategy[0].missingCategory` | giá trị không hợp lệ | giá trị không hợp lệ, cần một trong: IDENTITY, FAMILY, OCCUPATION_INCOME, ASSETS, GOALS, RISK_APPETITE, EXISTING_PROTECTION, CONCERNS |
| `value` trích xuất sai kiểu | `facts[0].value` | sai định dạng | sai kiểu, cần string, number hoặc boolean |
| `value` trích xuất là chuỗi rỗng / quá 1 000 ký tự | `facts[0].value` | sai định dạng | lỗi của chuỗi: "chuỗi rỗng" / "quá 1 000 ký tự kể cả ký tự vô hình" |

- Danh sách giá trị lấy từ schema (`PERSONALITY_SYSTEMS`, `KYC_CATEGORIES`). V2 vẫn kiểm `missingCategory` có trong `missingCategories` của đầu vào.
- Các `detail` khác giữ nguyên: "cần ít nhất N phần tử", "quá N phần tử", "chuỗi rỗng", "quá 300 ký tự", "không có chữ", "trích trùng một dữ kiện", "cần evidence hoặc missingCategory", "không có khối JSON", "trả lời bị cắt…", "và K lỗi khác". Thêm một `detail` mới: "quá 1 000 ký tự kể cả ký tự vô hình" (§11.5).
- Chữ message thử lại §5 không đổi.

### 11.7 Ca kiểm mới (thêm vào §8.5)

Đã chép vào bảng §8.5 (C55–C72).

Ngoài bảng:

- **Tin nhắn ChatGPT web:** tin nhắn `web@1` có hai dòng khung viết NFD + U+200B trước dấu → `OWN_MESSAGE`. Ở lần thử 2, dán lại message thử lại của phiên viết như vậy → `OWN_MESSAGE`, phiên còn mở, không có `row`.
- **Message thử lại:** lần thử 1 có lỗi mã `"f12"`, `system` `"MBTI"`, thiếu khối `themes` → message lần 2 có đủ `detail` mới của §11.6.
- **`db`:** `recordAiAnalysis` và nhập backup từ chối dòng ACCEPTED có `text` của C71.

### 11.8 Không làm trong đợt này

- Chữ tương hình (Cyrillic, Greek), như §10.10.
- **REJECTED vẫn có thể lưu output lớn.** `output_json` của dòng REJECTED là output đã parse của lần thử cuối, không qua V1 (spec §7.1). Nên một output suy biến, lặp lại ở cả hai lần thử, vẫn lưu được tới cỡ thân trả lời (≤ 2 MB với OpenCode, ≤ 20 000 ký tự với ChatGPT web). Chuyện này có từ Phase 5 với mọi output suy biến; DR6-77 chỉ nói dòng ACCEPTED. Muốn sửa thì phải đổi spec §7.1 (G2), vì panel dùng `output_json` = `null` để nhận ra "không có khối JSON". Đề xuất: ghi `review-notes.md`, không làm ở đây.
- `detail` của V2 giữ nguyên ("F99 không có trong đầu vào", "ASSETS không phải hạng mục đang thiếu"): model đọc được mã đúng trong đầu vào.
- (Review trước PR.) Ký tự trống có bề rộng (U+2800, U+3164) đặt làm dấu cách giữa hai chữ: bỏ đi theo bước 0 thì hai chữ dính nhau, cụm phía sau mất ranh giới từ ở đầu ("KH" + U+2800 + "xác suất"), nên không bị chặn. Model không đối kháng (§10.10); khi đứng **giữa** cụm thì vẫn bị chặn (C59).
- (Review trước PR.) Nhập backup kiểm `output_json` bằng schema nhưng lưu nguyên chuỗi của backup, nên backup sửa tay vẫn mang được chuỗi lớn ở chỗ schema bỏ qua: khóa lạ, khoảng trắng hai đầu mà `trim` cắt (gồm U+FEFF). App không bao giờ viết như vậy (lệnh lưu kết quả đã parse). Có từ Phase 5, ngoài DR6-77; muốn chặn thì nhập backup phải so `output_json` với dạng đã parse (luật nhập mới, G2).

### 11.9 Owner duyệt

- [x] Version `analysis@3`, `discovery@3`; `extraction@1`, `web@1` giữ; thêm `e2e/full-cycle.spec.ts` vào file được phép (§11.1)
- [x] Bước 0: bỏ ký tự vô hình theo tập K20 trước, rồi NFKC; `\s+` → `\s*` ở bốn mẫu V6 (§11.2)
- [x] Bản bỏ dấu phương án A: so theo từng chữ (đúng dấu hoặc không dấu), không đổi cột "Bỏ dấu" của mục nào (§11.3)
- [x] "kỉ", "qui" vào ngoại lệ của "luật <Tên>" (§11.4)
- [x] V1 phương án A: trần chuỗi gốc 1 000, phần thấy được theo K20 (§11.5)
- [x] `detail` V1 nêu dạng đúng (§11.6)
- [x] Ca kiểm C55–C72 và các ca ngoài bảng (§11.7)
- [x] REJECTED lưu output lớn: ghi `review-notes.md`, không làm ở đây (§11.8)

## 12. Đợt sửa G5 Phase 6 lượt 3 (T-277 #728) — Owner duyệt 23/10/2026

**Trạng thái:** đề xuất và **Owner duyệt G5 23/10/2026** ("duyệt hết": bước 0 hướng C, "luật" hướng b2, `@4`, ba file thêm cho PR code). Theo Q4 (a) (Owner 21/10/2026), PR docs này đi trước, PR code đi sau. PR code chép các thay đổi vào §2, §3 (version), §6a, §7, §8.4, §8.5 và spec `phase-5-ai.md` §3.1 mục 3, §6.4. Mục này giữ lý do và số đo. Riêng §7 bước 0 có thêm nhóm ký tự điều khiển ngay ở PR này: chữ theo code đã merge, không đổi luật (§12.6).

**Nền:** deep review Phase 1–6 lượt 3 (`docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §6.6, §8.2 L3-I, §9 Q4): DR6-122, DR6-123, DR6-124. Báo cáo gốc: CL3-C3, CL3-C4, CL3-C5 (`docs/reviews/raw/2026-10-21/claude/C.md`), CX3-C1 (`docs/reviews/raw/2026-10-21/codex/C.md`). Owner 21/10/2026 đồng ý Q4 (a): sửa cả ba trong một đợt G5. Có hai chỗ đề xuất khác chữ Q4, vì số đo cho thấy chữ đó hụt (§12.2, §12.5). Hướng đúng chữ Q4 ghi kèm để Owner chọn; Owner 23/10 chọn hai hướng đề xuất (C, b2).

**Đã thử trước khi đề xuất** (bản chép `packages/ai` ngoài repo, chưa phải code):

- **921** test hiện có của `packages/ai`, gồm C1–C72 và test đọc bảng §8: xanh với đề xuất. Hướng B của §12.2 làm đỏ 1 test (review #420).
- **59** chuỗi kiểm cho DR6-122, DR6-124 và **12** ca dán ChatGPT web cho DR6-123: kết quả ghi ở từng mục.
- **1 085** chuỗi `text` thật của eval 10/10 và 11/10, mỗi chuỗi ở đúng khối của nó: 0 chuỗi bị chặn, trước và sau, ở mọi hướng.
- **2 636** chuỗi trong code (`vi.ts` 2 305, `schema.ts` 64, seed 267): không chuỗi nào đổi kết quả. 6 chuỗi bị chặn như nhau trước và sau; đều là nhãn hay chú thích như "Tỉ lệ chốt", "Tử vi / huyền học", không phải output AI.
- **118 744** đoạn chữ của `docs/**/*.md`: 7 đoạn đổi kết quả. Cả 7 ở bản tổng hợp / báo cáo gốc lượt 3, chỗ trích chính các câu của DR6-122, DR6-124.

### 12.1 Version

| Prompt | Đổi | Version mới |
|---|---|---|
| analysis | cách so khớp (§12.2, §12.4), danh sách chặn (§12.5: mục "luật <Tên>" của §8.4); **chữ prompt không đổi** | `analysis@4` |
| discovery | như analysis | `discovery@4` |
| extraction | chữ không đổi, không qua V3–V6 | giữ `extraction@1` |
| tin nhắn ChatGPT web | chữ bọc không đổi; dòng dán theo bước 0 mới (§12.2) và cách tách dòng mới (§12.3) | giữ `web@1` → lưu `analysis@4+web@1` |

- Đầu file ghi: đổi danh sách chặn = tăng version. §12.5 đổi một mục của §8.4, nên `@4` là mặc định, như §11.1. Giữ `@3` nghĩa là Owner miễn luật đầu file cho đợt này: ít file phải đổi hơn, nhưng phân tích lưu trước và sau đợt mang cùng version mà luật kiểm khác nhau.
- Hệ quả của `@4`, như #698: test app và e2e đang ghim `@3` đổi theo; mốc hash seed (`seed.test.ts`) đổi; seed lấy version từ `PROMPT_VERSIONS` nên tự theo. Phân tích đã lưu với `@3` vẫn hiện như đã ghi; `db` chỉ kiểm dạng `<mode>@<n>`. Eval AI thật ở G7 (NT-EV-01) chạy với `@4`.
- **File được phép của PR code** (Issue #728) thêm ba file, vì chúng ghi version hay chép chữ của file này:
  - `docs/design/phase-5-prompts.md`: chép §12 vào §2, §3, §6a, §7, §8.4, §8.5; đổi trạng thái §12;
  - `docs/README.md`: dòng ghi version prompt;
  - `docs/user-guide/11-thuat-ngu.md`: dòng Prompt, ví dụ `analysis@3`.

### 12.2 Bước 0: dấu tổ hợp lạc (DR6-122)

**Lỗi hiện tại:** #698 bỏ "bản bỏ dấu của cả câu" (§11.3). Bản đó cũng là chỗ duy nhất bỏ được một dấu tổ hợp không thuộc chữ nào. Nay dấu như vậy làm cụm không khớp, nên câu lọt V3–V6. Bản trước #698 (`4217ed4`) chặn cả bốn câu đầu (CL3-C3):

- "KH có xác" + U+0301 + " suất đồng ý cao": dấu sắc thừa trên "c" ("xáć").
- "KH có xác " + U+0301 + "suất đồng ý cao": dấu đứng sau dấu cách.
- "KH có xác" + U+00B4 + "suất đồng ý cao", "KH có xác" + U+00A8 + "suất đồng ý cao": NFKC viết `´`, `¨` thành dấu cách + dấu.
- Cùng loại, cũng lọt hôm nay: "KH có thể chốt" + U+0301 + " được", "KH dễ " + U+0301 + "chốt", "Đề xuất Bảo" + U+00B4 + "Việt", "KH tuổi" + U+00B4 + "Tý" ở `needs`, "Theo Điều" + U+00B4 + "35", "Theo Luật " + U+0301 + "Kinh doanh bảo hiểm".

§11.3 đã ghi phần "Mất": chữ sai dấu, chữ giữ `đ` bỏ dấu thanh, hai dấu thanh chồng nhau. Dạng này chưa có trong đó. Eval thật không có câu nào như vậy: chỉ gặp ở output suy biến hay câu dán.

**Ba hướng**, đều đã đo trên bản chép:

| Hướng | Luật | "xáć suất" | Dấu sau dấu cách, `´`, `¨` | "chốt" + U+0301 + " được" | 921 test hiện có |
|---|---|---|---|---|---|
| A (chữ Q4 21/10) | Sau NFKC, bỏ dấu tổ hợp không đứng sau chữ cái | lọt | chặn | lọt | xanh |
| B | Ở dạng tách dấu (NFKD), bỏ dấu tổ hợp không đứng sau nguyên âm, rồi ghép lại (NFC) | chặn | chặn | chặn | đỏ 1 |
| **C (đề xuất)** | Như B, nhưng dấu đó **đọc như một dấu cách**, rồi gộp lại khoảng trắng | chặn | chặn | chặn | xanh |

- A không đạt chính ca kiểm của Issue: NFKC ghép "c" + U+0301 thành chữ cái "ć" (U+0107), nên không còn dấu tổ hợp nào để bỏ.
- B làm "Ý x" + U+0301 + "xác suất" hết bị chặn: bỏ dấu thì "x" dính vào "xác". Ca này có test từ review #420 (dấu đứng một mình là ranh giới từ).
- C giữ đúng cách đó: dấu lạc vẫn là ranh giới từ. Tiếng Việt viết đúng không có dấu trên phụ âm hay chữ số, nên dấu lạc chỉ đến từ gõ hay chép hỏng. Dấu gõ sau phụ âm cuối cũng không còn làm chữ thành chữ khác: "KH có xac" + U+0301 + " suat cao" đọc là "xac suat", vẫn V3.

**Đề xuất — §7 bước 0 thêm một bước sau NFKC:**

> … **rồi** NFKC (…); **dấu tổ hợp lạc** đọc như một dấu cách: xét ở dạng tách dấu, đó là mọi dấu tổ hợp không đứng sau nguyên âm (a, e, i, o, u, y, hoa hay thường, kể cả nguyên âm đã mang dấu khác), vd. dấu đứng sau phụ âm, chữ số, dấu cách, dấu câu hay ở đầu chuỗi; rồi gộp lại khoảng trắng và cắt hai đầu → thay `-` và `_` bằng dấu cách. …

- Code: `cleanText` = `normalizeText` → NFKD → thay dấu lạc bằng dấu cách → NFC → gộp khoảng trắng, cắt hai đầu. Không có dấu lạc thì kết quả đúng bằng NFKC như nay: mọi kho chữ ở đầu mục không đổi.
- Áp cho bản gốc, bản có dấu của V3–V6 và cho dòng dán ChatGPT web (§6a), như bước 0 hiện nay. Không áp cho V1 (V1 dùng `normalizeText`, §11.5); chữ lưu không đổi.
- `detail` vẫn một dấu cách giữa hai phần: "Điều 35", "Luật K".
- **Mất** (thêm vào phần "Mất" của §11.3): dấu lạc **giữa một chữ**, sau phụ âm. "KH là khách n" + U+0301 + "óng" đọc thành "khách n óng", không khớp "khách nóng". Hôm nay câu này cũng lọt. B bắt được ca này nhưng làm hỏng ca #420.

### 12.3 Tin nhắn của app: tách dòng (DR6-123)

**Lỗi hiện tại:** §6a so "mỗi dòng" của câu dán, nhưng `web.ts` chỉ tách dòng ở CR / LF. Có thể dấu xuống dòng của tin nhắn đã thành U+0085, U+2028 hay U+2029 khi qua một ứng dụng trung gian. Khi đó tin nhắn của app dán lại bị đọc thành một dòng dài, không ai nhận ra dòng mốc. Lần 1 tính là một lần thử; lần 2 dán lại message thử lại thì lưu dòng REJECTED. CX3-C1 tái hiện được qua giao diện trên Edge. Ghi chú KYC (`normalizeNote`, K25) đã tách dòng ở cả ba ký tự này.

**Đề xuất:** một dòng của câu dán kết thúc ở CR LF, CR, LF, U+0085, U+2028 hoặc U+2029, như ghi chú KYC. §6a ghi: "mỗi dòng (tách ở CR, LF, U+0085, U+2028, U+2029) của câu dán…".

- Đã thử: tin nhắn `web@1` ở lần 1 và message thử lại của phiên ở lần 2, mỗi cái với LF, CRLF, U+0085, U+2028, U+2029 thay mọi dấu xuống dòng. Cả 10 ca ra `OWN_MESSAGE`; hôm nay 6 / 10 lọt. Câu trả lời nhắc dòng mốc ở **giữa** một `text` vẫn là câu trả lời.
- **Chấp nhận:** nếu một chuỗi JSON của câu trả lời có U+2028 ngay trước và ngay sau dòng mốc, dòng mốc thành một dòng riêng. Câu dán đó bị coi là tin nhắn của app: báo tại khung, không tính lần thử. Chỉ app viết dòng mốc.

### 12.4 Chữ có dạng không dấu trùng một chữ khác (DR6-124 a)

**Lỗi hiện tại:** §7 mục 2 cho mỗi chữ của mục "Bỏ dấu: có" viết đúng như mục **hoặc** viết không dấu, lẫn trong một cụm. Có chữ mà dạng không dấu cũng là một chữ viết đúng khác. Câu viết đúng chính tả có chữ đó, đứng cạnh các chữ còn lại của mục, bị coi là bản không dấu của mục:

| Câu thường bị chặn | Mục | Chữ |
|---|---|---|
| "KH là khách **am** hiểu tài chính", "Nhóm khách **am** tường thị trường chứng khoán" | khách ấm (V3) | "ấm" → "am" |
| "KH là khách **lanh** lợi, quyết nhanh" | khách lạnh (V3) | "lạnh" → "lanh" |
| "Hỏi KH về định hướng **noi** theo của gia đình" | hướng nội (V5) | "nội" → "noi" |
| "KH làm **IT** khả năng tăng thu nhập cao" | ít khả năng (V3) | "ít" → "it" |

**Đề xuất:** §7 mục 2 thêm một danh sách **đóng**: **"ấm", "lạnh", "nội", "ít"**. Chữ trong danh sách chỉ khớp dạng không dấu khi **mọi** chữ của cụm cũng viết không dấu.

- Vẫn chặn: "KH la khach am", "KH la khach lanh", "KH huong noi" ở `needs` (cả cụm không dấu); "KH là khach ấm", "KH có ít kha nang", "KH huong nội" (C67) (chữ trong danh sách viết đúng dấu).
- Hết chặn: bốn câu ở bảng; "KH là khách am", "KH thiên về hướng noi" (cụm lẫn, chữ trong danh sách viết không dấu). "Phòng IT khả năng cao sẽ đổi" chỉ còn bị chặn vì "khả năng cao".
- **Vì sao danh sách đóng**, không phải "mọi chữ có dạng không dấu là một chữ khác": nhiều chữ khác cũng vậy ("nghị" → "nghi", "bảo" → "bao", "số" → "so"…). Đưa hết vào thì mất phần đã duyệt 18/10: C68 "Nghi định 46 về thuế" chỉ bị V6 chặn nhờ "nghi" viết không dấu trong một cụm lẫn. Danh sách chỉ có chữ đã gặp trong câu thường (bảng trên). Thêm chữ = qua G5.
- Không mẫu `regex` nào của §8 có chữ trong danh sách.
- Code: `phrase` của `text-match.ts`. Mục có chữ trong danh sách khớp khi mỗi chữ viết đúng hay không dấu, trừ chữ trong danh sách phải viết đúng; **hoặc** khi cả cụm viết không dấu.

### 12.5 V6 "luật <Tên>": "định", "giới" (DR6-124 b)

**Lỗi hiện tại:** "KH chi tiêu theo định luật Pareto", "KH tin vào định luật Murphy", "Định luật Pareto đúng với chi tiêu của KH", "KH giữ giới luật Phật giáo" bị V6 chặn, vì "luật" chỉ được miễn sau "pháp", "kỷ", "kỉ", "quy", "qui".

| Hướng | Thêm vào danh sách miễn | "định luật Pareto", "giới luật Phật giáo" | "Theo quy định Luật Kinh doanh bảo hiểm" | "Cần xác định Luật Đất đai có áp dụng không" |
|---|---|---|---|---|
| b1 (chữ Q4 21/10) | "định", "giới" | đạt | **lọt** | lọt |
| **b2 (đề xuất)** | "giới"; "định" **trừ** khi chính "định" đứng sau "quy" / "qui" | đạt | V6 | lọt |

- "theo quy định Luật …" là cách dẫn văn bản luật hay gặp nhất. Với b1, câu này lọt ở mọi kiểu viết đã thử: "quy định Luật …", "quy định luật Đất đai", "qui định Luật Đất đai", "QUY ĐỊNH LUẬT Đất đai". b2 vẫn chặn cả bốn.
- b2 chỉ để lọt "Luật <Tên>" sau "định" của từ ghép khác ("xác định", "chỉ định"…): hiếm, ghi vào "Mất".
- "Theo Luật Kinh doanh bảo hiểm", "Theo đạo luật Doanh nghiệp" vẫn V6 ở cả hai hướng; "KH tin vào quy luật Pareto" vẫn đạt.

Mục "luật" của §8.4 sau khi sửa; PR code chép nguyên chữ dưới (so với hiện nay: thêm "giới", "định" và các ví dụ cuối):

> "luật" ở **mọi kiểu hoa / thường**, có ranh giới từ trước, không đứng sau từ "pháp", "kỷ", "kỉ", "quy", "qui", "giới", hay "định" mà trước nó không phải "quy" / "qui" (mọi kiểu chữ) + khoảng trắng; theo sau là khoảng trắng (có thể không có) + một từ mở đầu bằng chữ hoa (`\p{Lu}`) mà **không** phải "KH", "RE" hay "sư" (mọi kiểu chữ). Chạy trên **bản gốc**. Vd. khớp "Luật Kinh doanh bảo hiểm", "Luật BHXH", "LuẬt Đất đai", "Luật" + U+200B + "BHXH", "quy định Luật Kinh doanh bảo hiểm"; không khớp "Luật sư", "LUẬT SƯ", "pháp luật Việt Nam", "pHáp luật Việt Nam", "kỷ luật KH", "quy luật Thị trường", "kỉ luật Thép", "qui luật Thị trường", "định luật Pareto", "giới luật Phật giáo"

### 12.6 §7 bước 0: ký tự điều khiển (ghi chú review #738)

Từ 21/10, `normalizeText` bỏ cả ký tự điều khiển C0 / C1 không phải khoảng trắng (DR6-111, PR #738). Owner 21/10/2026 (Q2 (a) lượt 3) chốt V3–V6 của G5 theo luật đó. Chữ §7 bước 0 liệt kê tập của K20 nhưng thiếu nhóm này (ghi chú sổ của review #738). PR này thêm nhóm đó vào §7 bước 0 cho khớp code: không đổi luật, không đổi version. §11.2 giữ nguyên, làm bản ghi đề xuất 18/10.

### 12.7 Ca kiểm mới (PR code chép vào §8.5)

| # | Chuỗi trong output | Kết quả |
|---|---|---|
| C73 | "KH có xác" + U+0301 + " suất đồng ý cao" · "KH có xá" + U+0107 + " suất đồng ý cao" · "KH có xác " + U+0301 + "suất đồng ý cao" · "KH có xác" + U+00B4 + "suất đồng ý cao" · "KH có xác" + U+00A8 + "suất đồng ý cao" | V3 |
| C74 | "KH dễ " + U+0301 + "chốt" · "Đề xuất Bảo" + U+00B4 + "Việt" · "KH tuổi" + U+00B4 + "Tý" ở `needs` · "Theo Điều" + U+00B4 + "35" · "Theo Luật " + U+0301 + "Kinh doanh bảo hiểm" | V3 · V4 · V5 · V6 · V6 |
| C75 | "KH có thể chốt" + U+0301 + " được" · "KH có xac" + U+0301 + " suat cao" · "Ý x" + U+0301 + "xác suất" | V3 |
| C76 | "KH là khách am hiểu tài chính" · "Nhóm khách am tường thị trường chứng khoán" · "KH là khách lanh lợi, quyết nhanh" · "Hỏi KH về định hướng noi theo của gia đình" · "KH làm IT khả năng tăng thu nhập cao" | đạt |
| C77 | "KH la khach am" · "KH la khach lanh" · "KH huong noi" ở `needs` · "KH là khach ấm" · "KH có ít kha nang" | V3 · V3 · V5 · V3 · V3 |
| C78 | "KH chi tiêu theo định luật Pareto" · "Định luật Pareto đúng với chi tiêu của KH" · "KH giữ giới luật Phật giáo" · "KH giữ GIỚI LUẬT Phật giáo" | đạt |
| C79 | "Theo quy định Luật Kinh doanh bảo hiểm" · "Theo qui định Luật Đất đai" · "Theo đạo luật Doanh nghiệp" | V6 |

Ngoài bảng:

- **Tin nhắn ChatGPT web:** tin nhắn `web@1` có U+0085, U+2028 hay U+2029 thay mọi dấu xuống dòng → `OWN_MESSAGE` ở lần 1. Ở lần 2, message thử lại của phiên viết như vậy → `OWN_MESSAGE`, phiên còn mở, không có `row`. Câu trả lời có "=== HƯỚNG DẪN ===" ở giữa một `text` vẫn là câu trả lời.
- **Kho chữ:** 1 085 chuỗi eval thật và mọi chuỗi của `vi.ts` ra như trước.

### 12.8 Không làm trong đợt này

- Chữ tương hình (Cyrillic, Greek), như §10.10, §11.8.
- Dấu lạc giữa một chữ sau phụ âm (§12.2); chữ sai dấu, chữ giữ `đ` bỏ dấu thanh, hai dấu chồng nhau (§11.3).
- Chữ có dạng không dấu trùng một chữ khác mà chưa có trong danh sách §12.4 (vd. "nghi" của C68): thêm khi gặp câu thường, qua G5.
- "Luật <Tên>" sau "định" của từ ghép khác "quy định" (§12.5).

### 12.9 Owner duyệt

- [x] Version `analysis@4`, `discovery@4`; `extraction@1`, `web@1` giữ; thêm `docs/design/phase-5-prompts.md`, `docs/README.md`, `docs/user-guide/11-thuat-ngu.md` vào file được phép của PR code (§12.1)
- [x] Bước 0 hướng C: dấu tổ hợp lạc đọc như một dấu cách (§12.2)
- [x] Tin nhắn của app: tách dòng ở CR, LF, U+0085, U+2028, U+2029 (§12.3)
- [x] Danh sách đóng "ấm", "lạnh", "nội", "ít": chỉ khớp không dấu khi cả cụm không dấu (§12.4)
- [x] "luật <Tên>" hướng b2: miễn "giới", và "định" trừ khi "định" đứng sau "quy" / "qui"; chữ mới của mục §8.4 (§12.5)
- [x] Ca kiểm C73–C79 và các ca ngoài bảng (§12.7)
