# Đánh giá DeepSeek v4.1 Flash và Muse Spark trong deep review Phase 5 — so với Claude Opus 5.5 và Codex (GPT Sol 6.1)

- **Ngày:** 2026-10-10 · **SHA được review:** `0df3606` · Owner yêu cầu đánh giá để quyết định có dùng hai model này làm agent phụ (Opus điều phối) từ Phase 6 hay không.
- **Nguồn:** 24 báo cáo gốc `raw/2026-10-10/{claude,codex,deepseek,muse}/` và bản tổng hợp đã kiểm trên code `2026-10-10-deep-review-phase-5-tong-hop.md` (64 vấn đề DR5-01 … DR5-64). Thời gian, token, số lần duyệt lấy từ log phiên xuất bằng CLI local (`opencode session export`, `muse export`), lưu ở `C:\workspace\deep-review-5\{deepseek,muse}\<gói>\session.json` (Home PC).
- **Điều kiện so sánh:** cùng SHA, cùng kế hoạch / trục / định dạng (`common-plan.md` §1–§5), cùng luật chỉ đọc, mỗi gói một phiên mới, tuần tự A → F. Khác: DeepSeek / Muse chạy sau Claude / Codex (không ảnh hưởng vì bốn bên không đọc báo cáo của nhau — đã kiểm, §6), Muse chạy trong sandbox của Muse Code (không mở socket, không ghi ra ngoài workspace nếu không xin), prompt hai bên mới có thêm mục "Bằng chứng phải thật" (`common-prompt-*.md`).

## 1. Kết luận ngắn

1. **Kết quả:** DeepSeek và Muse **chính xác** (gần như mọi phát hiện đều đúng khi kiểm trên code: 21 / 22 và 21 / 21) nhưng **phủ hẹp** (thấy 28 % và 31 % trong 64 vấn đề, Claude 66 %, Codex 38 %) và **không thấy cả hai lỗi Medium** của đợt này (DR5-49 dán lại tin nhắn ChatGPT web → phân tích CURRENT rỗng nghĩa; DR5-36 kết quả AI muộn ghi vào DB vừa khôi phục). Vì vậy cả hai kết luận G7 "SẴN SÀNG" — **sai**, trong khi Claude và Codex đều "CHƯA SẴN SÀNG", mỗi bên vì đúng một lỗi Medium mà bên kia không thấy.
2. **Cách review:** hai model làm đúng khuôn (đọc hết file, đi qua mọi trục, ghi "đã xét, không thấy", có probe và mutation), nhưng **nông hơn ở bước "phá thật"**: ít mutation (≈ 21 và ≈ 9, Claude ≈ 162), ít probe dựng nhiều bước. Phần lớn phát hiện của hai bên là loại **"đọc một hàm là thấy"** (4 / 4 vấn đề cả bốn bên cùng thấy đều thuộc loại này). Loại cần **chuỗi suy luận nhiều bước qua nhiều gói** (clipboard → khung dán → ví dụ trong prompt → V2 đạt; `await` → `replace` → ID trùng → lưu vào DB mới) thì chỉ frontier thấy.
3. **Hiệu năng:** DeepSeek **nhanh và rẻ nhất** (95 phút làm việc cho 6 gói, ≈ 0,96 USD theo giá OpenCode, trừ vào hạn mức gói Go). Muse **chậm nhất** (178 phút, cần **45 lần Owner duyệt tay** vì sandbox) và chi phí tiền bằng 0 ở gói contributor, đổi lại nội dung phiên có thể được Meta dùng để cải thiện sản phẩm.
4. **Khía cạnh khác:** cả hai giữ được độc lập (không đọc báo cáo bên khác). DeepSeek một lần liệt kê thư mục gốc bị cấm (chỉ thấy tên thư mục), có **một phát hiện sai** (DS-E3 trái golden đã đọc). Muse **ghi file vào repo** hai lần (probe test, thư mục build Rust — xóa ngay sau khi chạy, có ghi lại) dù prompt cấm, có **một nhận định sai** trong "đã xét" (đúng chỗ lỗi Medium DR5-49). Cả hai có lỗi chữ lạ trong báo cáo tiếng Việt (từ Bồ Đào Nha / Tây Ban Nha).
5. **Về đề xuất bỏ cấm subagent từ Phase 6 (§8):** đánh giá là **đủ tốt để làm "worker" có giám sát cho việc hẹp, kiểm được**, **chưa đủ tốt để làm reviewer độc lập hay ra kết luận cổng**. Nhưng ở Project-2C còn một rào cản lớn hơn chất lượng model: 2C là **nhánh đối chứng "chỉ Claude, không subagent"** của giao thức so sánh `docs/COMPARISON.md` (ACCEPTED, giống hệt ở hai repo), và Phase 6 là phase cuối trước bản v1.0 dùng để so sánh. **Khuyến nghị: giữ 2C đối chứng tới v1.0; đưa mô hình "Opus điều phối + DeepSeek / Muse làm worker" vào Project-2 (vốn là nhánh đa agent), dùng các bài học ở §7–§8.** Nếu anh vẫn muốn thử trong 2C, em đề xuất một pilot hẹp (§8.4) và các cổng phải mở.

## 2. Bảng so sánh bốn model

| Chỉ số | Claude Opus 5.5 | Codex GPT Sol 6.1 | DeepSeek v4.1 Flash | Muse Spark |
|---|---|---|---|---|
| Phát hiện mới (bên đó gán M / L / N) | 44 (2 / 25 / 17) | 24 (12 / 12 / 0) | 22 (1 / 15 / 6) | 22 (1 / 11 / 10) |
| Phát hiện bị bác (sai) | 0 (1 ý nói quá, tự sửa ở F) | 0 | **1** (DS-E3) | 0 (nhưng 1 nhận định sai ở "đã xét" F) |
| Vấn đề thấy / 64 (recall) | **42 (66 %)** | 24 (38 %) | 18 (28 %) | 20 (31 %) |
| Chỉ mình thấy (đúng) | **23** | 9 | 3 | 6 |
| Thấy lỗi Medium (2) | DR5-49 | DR5-36 | — | — |
| Gán Medium bị hạ khi kiểm | 1 / 2 | 11 / 12 | 1 / 1 | 1 / 1 |
| PLAUSIBLE (chưa tái hiện) | 4 | 0 | 2 | 8 |
| Kết luận G7 | CHƯA (đúng) | CHƯA (đúng) | SẴN SÀNG (sai) | SẴN SÀNG (sai) |
| Mutation đã chạy (≈) | 162 | 21 + corpus 990 ca | 21 | 9 |
| Chạy lại toàn bộ cổng | không (dùng baseline) | 182 e2e + 2 001 unit | `verify` + `verify:rust` + 182 e2e | một phần |
| Thời gian A–F (đồng hồ) | ≈ 2 h 40 | ≈ 2 h 45 | ≈ 1 h 51 (95 phút làm việc) | ≈ 2 h 57 (178 phút, ≈ 40 phút chờ duyệt) |
| Owner can thiệp trong phiên | mở 6 phiên | mở phiên | mở 6 phiên | mở 6 phiên + **45 lần duyệt tay** |
| Token (từ log phiên) | không đo được trên máy này | không đo | vào 1,65 tr + đọc cache 111 tr · ra 162 k + suy luận 465 k | vào cỡ 200 tr (phần lớn cache; log có thể đếm trùng) · ra ≈ 0,96 tr + suy luận ≈ 0,57 tr |
| Chi phí | gói Claude của Owner | gói Codex của Owner | ≈ 0,96 USD (giá OpenCode, trừ hạn mức gói Go) | 0 USD (contributor; nội dung có thể dùng cải thiện sản phẩm) |
| Tuân thủ "chỉ đọc" | đạt | đạt | đạt | **2 lần ghi tạm vào repo** |
| Tuân thủ độc lập | đạt | đạt | 1 lần liệt kê thư mục gốc (chỉ tên) | đạt (phiên thử trước đó đã liệt kê `codex\`) |

Cách đếm "vấn đề thấy": một bên được tính là thấy DR5-xx nếu có ít nhất một phát hiện mô tả đúng vấn đề đó (xem cột "Ai thấy" ở §5 bản tổng hợp).

## 3. Kết quả: chất lượng phát hiện

### 3.1 DeepSeek v4.1 Flash

**Làm tốt**
- Thấy đủ 4 vấn đề cả bốn bên cùng thấy (DR5-01 Unicode lọt V3–V6, DR5-13 lệnh ↔ luật 13, DR5-31 nhãn model khi đang chạy, DR5-52 chấm eval), và một nửa các vấn đề 3 / 4 (DR5-02, 04, 18, 24, 53, 55).
- **Phát hiện biên mà frontier bỏ qua:** DS-C1 — thân trả lời đúng 2 MB bị từ chối (ureq `LimitReader` lỗi khi `left == 0`); DeepSeek dựng server HTTP local, đo cả bản sửa `limit(MAX_BODY + 1)`. Muse thấy độc lập cùng điều này; Claude và Codex đều thử 2 MB ± 1 nhưng không nhận ra.
- Gói F chạy lại **toàn bộ** cổng (`pnpm verify` 2 152 test, `verify:rust` 73 test, e2e 182 test) — cẩn thận hơn Claude ở việc kiểm hồi quy.
- Mức gán khá sát: chỉ 1 Medium (bị hạ xuống Low), không thổi phồng như Codex.

**Hạn chế**
- **Không thấy hai lỗi Medium.** Ở F, DeepSeek viết "nhập backup giữa phiên web → lưu bị từ chối mềm", "thay DB khi đang chạy → discarded khi KH / phiên bản biến mất" — đúng cho Nạp lại (ID mới), không xét ca khôi phục chính DB (ID trùng, DR5-36). Không thử dán lại tin nhắn của app (DR5-49).
- **DS-E3 sai:** đề nghị `readConfig` không gửi `reasoning_effort: high` cho model không nhận, trong khi golden `ai-eval.md` §1 ghi rõ đây là chủ ý (lần chạy đầu cũng là lần kiểm model có nhận tham số không). DeepSeek ghi đã đọc golden.
- Gói D không chạy giao diện ("không có môi trường DOM") nên 2 / 2 phát hiện ở PLAUSIBLE; không thấy lỗi `AI_HTTP` mất chi tiết (3 bên khác thấy), ô key hiện rõ thì bỏ qua với lý do "mockup cũng vậy".
- Một khẳng định không có căn cứ trong DS-A1 ("một số tokenizer hay chèn ZWSP").

### 3.2 Muse Spark

**Làm tốt**
- **So mockup kỹ nhất:** MS-D2 (panel trống thiếu dòng help của mockup 2a / 4d) — Claude ghi đã so "2b–2l" và bỏ sót 2a, Codex / DeepSeek không thấy; theo quy tắc Owner "nhãn UI khớp dòng mẫu của mockup" đây là lỗi thật. MS-D3 (khối AI ở lịch hẹn thiếu badge "ChatGPT web", W-1 mục 4) cũng chỉ Muse thấy.
- Kiểm danh sách chặn bằng 682 khẳng định trên từng mục G5 §8 (cả cột bỏ dấu) và chỉ ra test repo không ghim từng mục (MS-A3, trùng Codex CX-A3).
- Thêm bằng chứng mới cho KNOWN có giá trị: lỗi ngay lần gọi đầu ghi "0 lần thử" (MS-E4); nhãn `model` có NUL qua luật 12 (MS-B1, chi tiết hai frontier không có).
- Gắn KNOWN đúng, không báo lại mục đã biết; ghi rõ khi một phát hiện chỉ là đọc code (8 PLAUSIBLE).

**Hạn chế**
- **Không thấy hai lỗi Medium**, và ở F còn **khẳng định sai đúng chỗ đó**: "Dán cả tin nhắn web vào khung đáp án (nhầm): thành V1 tính lần thử, đúng spec §3.1.3". Thực tế tin nhắn có JSON nên không bao giờ là V1; kết quả là V2 hoặc **ACCEPTED** (39 / 767 KH trên seed — phiên tổng hợp chạy lại). Muse lập luận từ spec thay vì chạy thử.
- **Gói F không có phát hiện nào** (0 mới); gói C kết luận "code Rust chắc… chỉ 3 Nit", xếp trần gzip (DR5-20) là Nit, không coi test `post()` thiếu là phát hiện (3 bên khác coi là Low).
- Đo `extractJson` với 1 500 `{` (41 ms) rồi kết luận "không có vấn đề P" — không đẩy tới trần 20 000 (0,33–0,45 s) như ba bên kia.
- Thấy TOCTOU ghi đè file eval nhưng cho là "chấp nhận được" (3 bên khác báo Low / Medium).

### 3.3 So với frontier

| Loại vấn đề | Claude | Codex | DeepSeek | Muse |
|---|---|---|---|---|
| Lệch hợp đồng đọc một hàm là thấy (DR5-13, 30, 31, 52) | ✔ | ✔ | ✔ | ✔ |
| Biên số / byte (2 MB ± 1, O(n²), trần 200 000) | ✔ (O(n²), 200 000) | ✔ | ✔ (cả 2 MB ± 1) | ✔ (2 MB ± 1, 200 000) |
| So mockup từng dòng | ✔ (bỏ sót 2a) | ít | ít | **✔ tốt nhất** |
| Chuỗi nhiều bước qua nhiều gói (DR5-36, 49) | ✔ (49) | ✔ (36) | ✘ | ✘ (và nhận định sai) |
| An toàn ở ranh giới (gzip, key phản chiếu, câu lỗi phản chiếu header) | ✔ (gzip, mã phiên) | ✔ (key, header) | ✘ | ✔ gzip nhưng xếp Nit |
| Hiệu chỉnh mức | sát | **thổi phồng** (11 / 12 Medium bị hạ) | sát | hơi thấp |
| Tự sửa sai của mình | ✔ (CL-C4 ở F) | ✔ (tách rõ khỏi KNOWN S-2) | — | — |

## 4. Cách review: độ sâu và độ rộng

- **Độ rộng (trục §4):** cả bốn đi qua đủ 9 trục ở mọi gói và ghi "đã xét, không thấy" kèm cách xét. DeepSeek / Muse đọc đủ file trong phạm vi (bảng "Phạm vi đã đọc" tương đương Claude / Codex). Khác biệt không nằm ở việc **đọc gì** mà ở việc **thử phá cái gì**.
- **Độ sâu — "phá thật":**
  - Claude: ≈ 162 đột biến một dòng trên 5 gói (giết 26 / 30, 23 / 25, 10 / 24, 35 / 48, 28 / 35), probe Rust nạp nguyên `ai.rs` của repo với server HTTP / gzip local, Playwright trên bản build để thử XSS, focus, bấm đúp, dán 2 MB; F chạy probe trên cả seed demo (767 KH).
  - Codex: ít đột biến nhưng nhiều hạ tầng thật — chứng chỉ TLS tự ký để thử `post()` nguyên bản, nhập backup qua UI Edge, chạy lại 182 e2e + 2 001 unit, corpus 990 ca cho danh sách chặn, đo RSS khi đọc 32 MiB.
  - DeepSeek: 21 đột biến (đa số bị test giết — dùng để khẳng định test tốt, ít dùng để tìm chỗ hở), server HTTP local cho Rust, chạy toàn bộ cổng ở F. Không dựng probe UI.
  - Muse: ≈ 9 đột biến (4 unit eval, 4 e2e, 1 gỡ mục blocklist lúc chạy); bị sandbox chặn mở socket nên phần Rust dùng bản chép `LimitReader` + đo tỉ lệ nén thay vì gọi thật; e2e phải xin chạy mở rộng.
- **Hệ quả:** tỉ lệ phát hiện "chỉ mình thấy" tương quan với độ sâu thử phá: Claude 23, Codex 9, Muse 6, DeepSeek 3.

## 5. Hiệu năng

- **DeepSeek:** 6 phiên 12–20 phút (tổng 95 phút), ≈ 80–160 lệnh công cụ mỗi phiên, đầu ra ngắn (24–31 k token mỗi gói) nhưng suy luận nhiều (64–88 k). Chi phí theo OpenCode ≈ 0,13–0,21 USD mỗi gói. Là model rẻ nhất đạt độ chính xác ~95 %.
- **Muse:** 6 phiên 20–41 phút (tổng 178 phút), trong đó ≈ 40 phút chờ duyệt. Ngữ cảnh đầu vào lớn (hàng chục triệu token mỗi gói, phần lớn đọc cache). 45 lần Owner duyệt tay (gói A 32 lần — mỗi lần ghi báo cáo ra `deep-review-5\` phải xin), 72 lần bộ duyệt tự động của Muse (LLM judge) duyệt.
- **Claude / Codex:** ≈ 2 h 40 – 2 h 45 cho 6 gói chạy song song; token không đo được trên máy này. Hai bên làm nhiều việc hơn hẳn trong cùng thời gian đồng hồ (162 đột biến, probe Rust / TLS / Playwright).

## 6. Khía cạnh khác

- **Độc lập:** kiểm log phiên của DeepSeek / Muse không thấy lệnh nào đọc `claude\`, `codex\` hay báo cáo của nhau. DeepSeek gói E liệt kê `C:\workspace\deep-review-5` (prompt cấm) — thấy 5 tên thư mục, tự nhận ra trong suy luận nhưng **không báo Owner** như prompt yêu cầu. Muse: 6 phiên review sạch; khi Owner thử ra lệnh liệt kê `codex\` ở cuối phiên F, Muse **từ chối** và viện dẫn luật 1 — hành vi đúng.
- **Chỉ đọc:** Muse gói D ghi `apps/desktop/src/routes/customers/zz-msd-probe.test.ts` vào repo để chạy vitest rồi xóa; gói C đặt thư mục build Rust trong worktree rồi xóa. Có ghi trong báo cáo (D rõ, C một dòng). Với chế độ không hỏi (YOLO) ở phiên thử đầu, đây là rủi ro thật nếu Muse làm việc trên repo có dữ liệu thật.
- **Trung thực về bằng chứng:** cả hai ghi CONFIRMED / PLAUSIBLE nghiêm túc, dán lệnh + kết quả thật; không thấy số đo bịa. Muse ghi rõ cả lỗi probe của chính mình ("probe F1 ban đầu đọc nhầm tên cột — lỗi của probe, sản phẩm đúng").
- **Chất lượng chữ:** báo cáo tiếng Việt của cả hai đọc tốt, đúng khuôn §5. Có lỗi lạ: DeepSeek "đường produção" (tiếng Bồ Đào Nha) ở DS-F1; Muse "igualmente" (tiếng Tây Ban Nha) ở D, và nhiều chỗ "Ghi" thay cho "log" ("không Ghi lỗi nào"). Claude / Codex không có.
- **Môi trường:** Muse chạy dưới user sandbox `muse-sbx-r1`, phải `git -c safe.directory=…`, `TEMP` riêng, exe build trong LocalLow không chạy được — nhiều công sức đi vào lách môi trường. DeepSeek chạy thẳng trong PowerShell của Owner, chỉ bị chặn theo mẫu chuỗi của `opencode.json` (lách được nếu model muốn).

## 7. Bài học cho việc dùng hai model này

1. **Độ chính xác cao, độ phủ thấp** → hợp với vai "người làm việc theo danh sách": việc có tiêu chí đúng / sai rõ, kết quả kiểm được bằng máy hay bằng một lần đọc code.
2. **Không dùng cho kết luận cổng:** cả hai cho G7 "SẴN SÀNG" khi còn 2 lỗi Medium; cả hai đều lập luận từ spec ở đúng chỗ cần chạy thử.
3. **Giao việc kèm "phải chạy thử":** chỗ DeepSeek / Muse yếu là bước dựng kịch bản phá nhiều bước. Khi Opus đã nghĩ ra kịch bản (vd. "dán lại chính tin nhắn", "khôi phục backup cùng DB giữa lúc AI chạy"), giao cho worker chạy và báo số là hợp; giao cho worker tự nghĩ kịch bản thì không.
4. **Mọi phát hiện của worker là dữ liệu, Opus kiểm lại** (như đợt này): với độ chính xác ~95 % chi phí kiểm thấp, nhưng phải kiểm vì có phát hiện trái golden (DS-E3) và nhận định sai trong "đã xét" (Muse F).
5. **Muse cần cấu hình sandbox trước** (đường ghi được cho thư mục kết quả, cấm ghi repo) — nếu không, Owner phải duyệt hàng chục lần mỗi phiên, hoặc phải bật chế độ không hỏi (rủi ro ghi repo).

## 8. Về đề xuất bỏ cấm subagent từ Phase 6

### 8.1 Đề xuất của anh (em hiểu)

Từ đầu Phase 6, bỏ lệnh cấm subagent để ở bước testing, Opus làm điều phối (orchestrator), gọi DeepSeek và Muse làm agent phụ chạy các vòng test cho độ ổn định của app; đồng thời là bước đầu xây Multi-Agent Team cho các dự án sau.

### 8.2 Rào cản không thuộc chất lượng model

- **`docs/COMPARISON.md` (ACCEPTED, giống hệt ở hai repo):** 2C là **nhánh đối chứng** — "Chỉ Claude Code, không subagent… Không dùng OpenCode, Muse Code, Cursor, Codex để viết / review code"; Project-2 là nhánh **"Opus 5.5 làm kiến trúc sư / điều phối; các agent khác Claude (OpenCode, Muse, Cursor, Codex) làm task"**. Đề xuất của anh chính là mô hình của Project-2. Đưa nó vào 2C ở Phase 6 — phase cuối, phase làm ra bản v1.0 dùng cho `docs/metrics/FINAL.md` — sẽ làm hai nhánh giống nhau ở đúng phần được so sánh.
- **ADR-0001** mục 2 và lý do loại phương án "Claude + subagent" ("làm mờ ranh giới một agent, khó so sánh công bằng"); **ADR-0012** chặn Agent tool bằng `permissions.deny`; `CLAUDE.md` "Không dùng OpenCode/Muse/Cursor/Codex để viết code, không dùng OpenCode/Muse/Cursor để review". Đổi bất kỳ điều nào là **G1**; thêm dịch vụ / hạn mức là **G4**; chạy agent ngoài có quyền ghi trên máy, gửi code cho Meta / OpenCode là **G6**.
- **Về kỹ thuật:** "subagent" của Claude Code (Agent tool) chỉ sinh **Claude**, không gọi được DeepSeek / Muse. Để Opus điều phối hai model này, Opus gọi CLI qua Bash: `opencode run --model opencode-go/deepseek-v4.1-flash --format json "<việc>"` và `muse exec "<việc>"` (cả hai CLI có chế độ chạy một lượt, đã kiểm `--help`). Như vậy **không cần mở Agent tool**; thứ cần đổi là luật "không dùng OpenCode / Muse".

### 8.3 Các phương án

| Phương án | Nội dung | Được | Mất / rủi ro |
|---|---|---|---|
| **A — khuyến nghị** | Giữ 2C đối chứng tới v1.0. Thiết kế "Opus điều phối + worker DeepSeek / Muse" đưa vào **Project-2** (bắt đầu sau 2C) với các bài học §7. Nếu muốn, ở đóng Phase 6 của 2C cho DeepSeek / Muse review chỉ đọc như đợt này (dữ liệu tham khảo, ngoại lệ ghi rõ như Codex M2) | Giữ nguyên giá trị so sánh 2C ↔ 2; thử multi-agent ở đúng nơi thiết kế cho nó; không đổi ADR của 2C | Phase 6 của 2C không được lợi từ worker rẻ |
| B — pilot hẹp trong 2C | Phase 6 cho Opus gọi DeepSeek / Muse **chỉ cho vòng test** (§8.4); worker không viết code / test vào repo, Opus kiểm mọi kết quả và tự viết mọi thay đổi | Đo được giá trị thật của worker trên việc thật trước Project-2 | Phải sửa COMPARISON.md ở cả hai repo (nhánh 2C không còn "chỉ Claude" ở Phase 6), ADR-0001 phụ lục mới, `CLAUDE.md`; ghi biến nhiễu vào FINAL. Hạn mức gói Go dùng chung với runtime sản phẩm |
| C — mở hẳn | Bỏ cấm subagent / agent ngoài, worker viết code và test | — | Không khuyến nghị: mất nhánh đối chứng; đợt này cho thấy worker bỏ sót lỗi Medium và có thể ghi vào repo khi không bị chặn |

### 8.4 Nếu anh chọn B — thiết kế pilot

- **Việc giao cho worker (kiểm được bằng máy):** sinh và chạy bộ đầu vào đối kháng do Opus chỉ định (vd. biến thể Unicode cho V3–V6, file backup sửa tay theo từng luật nhập); chạy lặp e2e / unit nhiều lần để tìm test chập chờn và tóm tắt; chạy kịch bản mutation do Opus soạn rồi báo đột biến sống; so mockup ↔ màn theo danh sách (thế mạnh của Muse); kiểm nhất quán lặp (nhãn, hằng, mã lỗi giữa các gói).
- **Không giao:** kết luận mức nghiêm trọng, kết luận cổng (G7, review PASS), quyết định guardrail / G5 / bảo mật, viết code hay test vào repo, tự nghĩ kịch bản phá nhiều bước.
- **Hàng rào:** worktree riêng ở SHA ghim, chỉ đọc; thư mục kết quả riêng là chỗ ghi duy nhất (ACL như đợt này); Muse cấu hình sandbox ghi được thư mục kết quả, **không** chế độ không hỏi; không key, không gọi AI của sản phẩm; sau mỗi lượt Opus xuất log phiên và quét tự động (đường dẫn cấm, lệnh ghi repo) như §6; `git status` sạch là điều kiện nhận kết quả.
- **Đo để quyết định sau pilot:** độ chính xác (≥ 90 % sau khi Opus kiểm), số phát hiện đúng mà Opus không tự thấy, thời gian Opus bỏ ra để kiểm, số lần Owner phải duyệt, hạn mức gói Go đã dùng. So với chính Opus làm một mình trên cùng việc.
- **Cổng cần mở trước khi bắt đầu:** G1 (phụ lục ADR-0001 "M3", sửa `CLAUDE.md`, sửa `docs/COMPARISON.md` ở **cả hai repo** + nhật ký thay đổi), G4 (dùng OpenCode / Muse làm công cụ phát triển, hạn mức gói Go — gói hết hạn 11/10), G6 (gửi code repo cho DeepSeek qua OpenCode và cho Meta ở gói contributor: chấp nhận được với repo public + dữ liệu giả lập, **không** dùng cho dự án riêng tư hay dữ liệu khách hàng thật).

### 8.5 Cho các dự án sau (Multi-Agent Team)

Đợt này là một thử nghiệm so sánh có kiểm soát tốt (cùng SHA, cùng kế hoạch, độc lập được kiểm bằng log). Đề xuất mang sang Project-2 / dự án khác: Opus giữ vai kiến trúc sư + người kiểm cuối; Codex (hoặc một frontier khác) làm reviewer độc lập thứ hai vì nó bổ sung đúng chỗ Claude hụt (DR5-36); DeepSeek làm worker rẻ cho vòng lặp kiểm được; Muse làm worker so giao diện ↔ mockup và quét nhất quán, sau khi đã cấu hình sandbox. Giữ nguyên nguyên tắc "phát hiện của agent khác là dữ liệu, Opus kiểm trên code trước khi tạo Issue".

**Em không đổi ADR, `CLAUDE.md` hay `COMPARISON.md` trong PR này.** Khi anh chọn phương án, em soạn phụ lục ADR / bản sửa COMPARISON tương ứng để anh duyệt G1.
