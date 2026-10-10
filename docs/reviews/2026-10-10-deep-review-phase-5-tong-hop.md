# Tổng hợp deep review Phase 5 — Claude, Codex, DeepSeek, Muse

- **Ngày tổng hợp:** 2026-10-10 · **SHA được review:** `0df3606` (`main` sau #480) · kế hoạch: `raw/2026-10-10/common-plan.md` (Claude + Codex) và `raw/2026-10-10/common-plan-opencode.md` (thêm DeepSeek + Muse để so sánh, Owner quyết 10/10).
- **Báo cáo gốc (nguyên văn):** `raw/2026-10-10/{claude,codex,deepseek,muse}/{A…F}.md` — 24 báo cáo, 6 gói (A `packages/ai` + domain · B db · C Rust · D UI · E tools / e2e / CI · F xuyên gói). Số đo nền `common-baseline.md`, KNOWN `common-known.md`, prompt hai bên mới `common-prompt-{deepseek,muse}.md`, cấu hình OpenCode `common-opencode-config.md`.
- **Bằng chứng ngoài repo:** probe, mutation, log, ảnh ở `C:\workspace\deep-review-5\<bên>\<gói>\` (chỉ Home PC). Phiên DeepSeek / Muse xuất ra `deepseek\<gói>\session.json`, `muse\<gói>\session.json` (phiên tổng hợp xuất bằng CLI local, không gọi model).
- **Reviewer:** Claude Opus 5.5 (phiên sạch mỗi gói) · Codex GPT Sol 6.1 · DeepSeek v4.1 Flash (`opencode-go/deepseek-v4.1-flash`, OpenCode 2.0.24, biến thể `max`) · Muse Spark (`muse-spark-1.3-contributor`, Muse Code 1.3.0, effort `max`).
- **Đánh giá riêng DeepSeek / Muse so với Claude / Codex và đề xuất multi-agent Phase 6:** `2026-10-10-danh-gia-deepseek-muse.md`.

**Cách kiểm (ADR-0001 M2):** mọi phát hiện của 4 bên được gộp rồi đối chiếu trên code `0df3606` ở checkout chính. Cột "Kiểm": ✅ đọc đúng chỗ code, khớp mô tả · 🔁 phiên tổng hợp chạy lại probe của reviewer, ra cùng kết quả · 📏 số đo của reviewer (nhiều bên đo độc lập thì ghi) · 🧪 khoảng trống test, dùng mutation của reviewer (đã xem test hiện có không có ca đó) · 📄 lệch giữa hai tài liệu. **1 phát hiện bị bác** (DS-E3, §6); nhiều phát hiện hạ / nâng mức (§4.1).

## 1. Kết luận chung

| Bên | Kết luận G7 ở gói F | Lý do chính |
|---|---|---|
| Claude | **CHƯA SẴN SÀNG** | CL-F1 (dán lại tin nhắn ChatGPT web → phân tích CURRENT toàn "…"), CL-C1 (trần 2 MB không giữ với trả lời gzip) |
| Codex | **CHƯA SẴN SÀNG** | CX-D2 / CX-F1 (kết quả AI muộn ghi vào DB vừa khôi phục khi ID trùng, CURRENT trích mã F không tồn tại) |
| DeepSeek | SẴN SÀNG | không có Critical / High; xếp DS-A1, DS-B1 làm sau |
| Muse | SẴN SÀNG | không có Critical / High; đề xuất làm MS-D1 trước |

**Kết luận hợp nhất: CHƯA SẴN SÀNG.** Hai lỗi Medium sau khi kiểm (DR5-36, DR5-49) có thật, đường vào là thao tác bình thường của RE, và ghi vào bảng `ai_analyses` **chỉ thêm, không xóa được**. Mỗi lỗi chỉ một bên frontier thấy; DeepSeek và Muse không thấy cả hai nên kết luận SẴN SÀNG của họ không đứng.

- **Không có Critical / High.** Sau khi gộp: **64 vấn đề riêng biệt** (DR5-01 … DR5-64): **2 Medium · 38 Low · 24 Nit**, cộng 4 mục KNOWN có bằng chứng mới (§6).
- **Tối thiểu trước G7:** đợt 1 phần bắt buộc (§7: I-1, I-2, I-3) ≈ 145 dòng SP + test. **Khuyến nghị:** thêm I-4 (Rust, đằng nào G7 cũng build exe), I-5 (thông báo lỗi / ô key) và I-8 (CI cho tài liệu G5) ≈ 335 dòng SP, 6 Issue.
- **Điều cả bốn cùng xác nhận là tốt:** AI không có đường nào tự ghi dữ liệu KYC (đề xuất trích xuất chỉ lưu khi RE bấm Xác nhận); key chỉ ở Rust / Credential Manager, không vào DB, backup, log, câu lỗi (ngoài các kẽ hở nhỏ ở DR5-27/28); output model và câu dán chỉ hiện dạng chữ (không `dangerouslySetInnerHTML`, thử `<img onerror>` / `javascript:` đều ra chữ); danh sách chặn khớp G5 §8 từng hàng (171 cụm, cả cột "Bỏ dấu"); dữ liệu gửi đi đúng §6.1 (tuổi thay năm sinh, không tên / mã KH / ghi chú khi phân tích); migration Phase 4 → 5 trên DB có dữ liệu giữ đủ dòng và trigger; ranh giới `ai → domain + zod`, `db → @p2c/ai/schema` có hiệu lực thật (cả 4 bên dựng vi phạm thử, `dependency-cruiser` bắt đủ). DeepSeek và Codex chạy lại toàn bộ: `pnpm verify` 2 152 test, `verify:rust` 73 test, e2e 182/182 — khớp baseline.

## 2. Số liệu

### 2.1 Theo bên (mức do chính bên đó gán)

| Bên | Phát hiện mới | Medium / Low / Nit | KNOWN có bằng chứng mới | PLAUSIBLE | Bị bác | Thời gian A–F |
|---|---|---|---|---|---|---|
| Claude | 44 | 2 / 25 / 17 | (ghi trong từng mục) | 4 | 0 | ≈ 2 h 40 (12:40 → 15:22) |
| Codex | 24 | 12 / 12 / 0 | 3 (+1 bổ sung CX-D2) | 0 | 0 | ≈ 2 h 45 (12:40 → 15:24) |
| DeepSeek | 22 (21 riêng: DS-F1 = DS-B1) | 1 / 15 / 6 | 0 | 2 | **1** (DS-E3) | ≈ 1 h 51 (16:03 → 17:54), phiên làm việc 95 phút |
| Muse | 22 (21 riêng: MS-A4 ≈ MS-B3) | 1 / 11 / 10 | 3 | 8 | 0 | ≈ 2 h 57 (15:58 → 18:55), phiên 178 phút, 45 lần Owner duyệt |

Claude và Codex chạy song song; DeepSeek và Muse chạy song song sau đó. Thời gian lấy từ giờ ghi file báo cáo và log phiên xuất ra (DeepSeek / Muse).

### 2.2 Theo vấn đề đã gộp

| | Claude | Codex | DeepSeek | Muse |
|---|---|---|---|---|
| Số vấn đề (trong 64) bên đó thấy | **42** (66 %) | 24 (38 %) | 18 (28 %) | 20 (31 %) |
| Chỉ bên đó thấy (và đúng) | **23** | 9 | 3 | 6 |
| Medium sau khi chốt (2) | 1 (DR5-49) | 1 (DR5-36) | 0 | 0 |
| Gán Medium nhưng chốt thấp hơn | 1 / 2 | 11 / 12 | 1 / 1 | 1 / 1 |

- **Cả 4 cùng thấy (4):** DR5-01 (biến thể Unicode lọt V3–V6), DR5-13 (lệnh không kiểm output ACCEPTED như luật 13), DR5-31 (dòng "Đang phân tích… · model" theo Cài đặt hiện tại), DR5-52 (chấm X của script eval không chuẩn hóa như V7).
- **3 / 4 cùng thấy (9):** DR5-02, 04, 06, 14, 18, 24, 30, 53, 55. **2 / 4 (10):** DR5-03, 16, 20, 21, 26, 27, 34, 40, 58, 61. **Một bên (41):** §4.2, §4.3.

## 3. Điểm các bên cùng thấy

| DR5 | Vấn đề | Ai thấy (mức gốc) | Mức chốt | Kiểm |
|---|---|---|---|---|
| **01** | So khớp V3–V6 (G5 §7) chỉ NFC + chữ thường + gộp `\s`: ký tự vô hình (U+200B/200D/2060/00AD) giữa cụm, `％` toàn độ rộng, chữ số Ả Rập / toàn độ rộng ("Điều ٣٥"), homoglyph ("AIА", "Manυlife"), nối bằng `-` / `_` ("xác-suất") đều lọt và thành ACCEPTED | CL-A3 (L), CX-A2 (M), DS-A1 (M), MS-A2 (L) | **Low** | ✅ `text-match.ts:57-61` không bỏ `\p{Cf}`, không NFKC |
| **13** | `recordAiAnalysis` với ACCEPTED chỉ đòi `output` khác `null`, không chạy schema của `mode` và không kiểm `evidence ⊆ input` như luật 13 khi nhập → một dòng sai làm **mọi backup sau đó bị từ chối** và `analysisContent` ném `ZodError` (cả màn Hồ sơ KH vào ErrorBoundary). Fixture test vẫn dùng `{ summary: 'Tóm tắt' }` (10 test đỏ nếu thêm kiểm). Hôm nay không đường nào của app ghi dòng như vậy | CL-B1 (L), CX-B1 (M), DS-B1 + DS-F1 (L), MS-B2 (L) | **Low** (rẻ, làm sớm) | ✅ `ai-analyses.ts:140-143` so với `backup-validation.ts:396-409` |
| **31** | Dòng "Đang phân tích… · <model>" đọc `app.ai.settings()` mỗi lần render; yêu cầu chạy với cài đặt chụp lúc bấm → đổi model ở Cài đặt rồi quay lại thì dòng ghi sai model (đổi sang Mock thì mất phần chi tiết) | CL-D5 (N), CX-D4 (L), DS-D2 (N), MS-D6 (N) | **Nit** | ✅ `KycIntelligence.tsx:322, 374-380` |
| **52** | `gradeNote` so từ khóa trên `quote` thô, V7 so bản NFC + gộp khoảng trắng → trích dẫn NFD / NBSP / xuống dòng trong từ khóa bị chấm "thiếu" (TRƯỢT giả); Codex thêm chiều ngược: predicate "Không được có" của X02 bỏ sót `Bác\nsĩ` (ĐẠT giả) | CL-E1 (L), CX-E1 (M), DS-E1 (L), MS-E1 (L) | **Low** | ✅ `eval-ai-core.mjs:221-228` |
| 02 | G5 chặn nhầm câu thường, ngoài các ca KNOWN #420: "quyết định số tiền / số lượng", "luật" + chữ hoa ("kỷ luật KH", "LUẬT SƯ", "pHáp luật"), "do tin cậy" → "độ tin cậy", "suy nghĩ quyết định" → "nghị quyết", "nhóm màu" → "nhóm máu", "sẵn sàng mua nhà", "tiềm năng mua", "điểm số", "liên kết chung", "điều 2 vợ chồng". Code chép đúng G5 | CL-A1, CL-A2 (L), CX-A5 (KNOWN+), DS-A2 (L) | **Low** (G5) | ✅ `blocklists.ts:20-86`; probe 3 bên |
| 04 | `extractJson` O(n²) khi nhiều `{` không đóng: 20 000 ký tự (trần dán) 326–454 ms, 80 000 ký tự 5,9 s, 100 000 ký tự 11,4 s; chạy trên luồng webview | CL-A5 (L), CX-A1 (M), DS-A3 (L); Muse đo 1 500 `{` = 41 ms rồi bỏ | **Low** | ✅ `extract-json.ts:10-36`; 📏 3 bên cùng cỡ |
| 06 | `packages/ai` không tự giữ trần 200 000 ký tự của Rust: lần thử lại chép nguyên câu trả lời dài, input ~1 300 dữ kiện, hàng nghìn mã `evidence` sai (message thử lại 124 218 ký tự), ghi chú KYC > 197 486 ký tự → `AI_BAD_REQUEST` ("lỗi lập trình"), không lưu REJECTED | CX-A6 (M), MS-A1 (L), CL-A8 (N), CL-A9 (N) | **Low** | ✅ `run.ts:183-212` không đo; `ai.rs:29` |
| 14 | Nhập backup nhận chuỗi có NUL: sql.js cắt tại NUL khi bind nên `raw_output` vượt trần 20 000 mà vẫn nhập được và đọc lại chỉ còn phần trước NUL; Muse thêm: `model = 'glm\0-5.3'` qua luật 12 thành `glm` | CL-B3 (N), CX-B2 (M), MS-B1 (L) | **Low** | ✅ `backup.ts:187` `valueOf` không kiểm NUL |
| 18 | 8 nhãn hạng mục + 21 nhãn trường có 3 bản (`vi.ts`, `ai/input.ts`, `db/seed-data.ts`), `seed.ts` chép `buildAnalysisInput` + câu Mock; không test nào nối; Mock của seed **đã lệch** Mock thật (1 vs 2 giả thuyết, không `personalityNotes`, mã trích khác) | CL-B5 (L), DS-A5, DS-B2, DS-B3 (L), MS-A4, MS-A5 (L), MS-B3 (N) | **Low** | ✅ hôm nay 0 nhãn lệch (4 bên so) |
| 24 | `post()` và hằng URL / key không có test đỏ khi sai: bỏ `http_status_as_error(false)`, `limit(u64::MAX)`, thay cả `post()` bằng lỗi, `GO_URL` = URL Credit, đổi `KEY_SERVICE` … vẫn 73/73 xanh | CL-C4 (L, 14/24 đột biến sống), CX-C3 (L), DS-C2 (L) | **Low** | 🧪 3 bên |
| 30 | Lỗi `AI_HTTP` ở panel và AI trích xuất chỉ hiện "OpenCode báo lỗi.", mất mã HTTP + thông điệp server mà §5.3 / mockup 2l yêu cầu (Cài đặt → Kiểm tra kết nối thì có). Liên quan T-164: Owner cần đọc mã thật khi gói Go hết hạn | CL-D1 (L), CX-F2 (L), MS-D1 (M) | **Low** | ✅ `ai-panel-view.ts:212-216`, `ai-analysis.ts:231-232` |
| 53 | Script eval kiểm "file đã có" lúc đầu nhưng ghi bằng `writeFileSync` cuối lượt (≈ 10 phút) → hai lượt chồng nhau ghi đè kết quả đã trả tiền | CL-E3 (L), CX-E2 (M), DS-E4 (L); Muse thấy, cho là chấp nhận được | **Low** | ✅ `eval-ai-core.mjs:565-576` |
| 55 | Adapter eval `await response.text()` đọc hết thân rồi mới so 2 MB (Codex: 32 MiB đọc hết, RSS +68 MiB) | CX-E3 (M), DS-E5 (N), MS-E2 (N) | **Low** | ✅ `eval-ai-core.mjs:151` |
| 03 | Test không ghim từng mục danh sách chặn: bỏ "tiềm năng mua" / "hanwha" / "ngũ hành" / "công văn số" / "bvnt" vẫn 281/281 xanh | CX-A3 (M), MS-A3 (L) | **Low** | 🧪 2 bên |
| 20 | `limit(MAX_BODY)` của ureq nằm **dưới** lớp giải nén gzip (feature mặc định): 521 KB nén → 512 MB trong RAM; 2 MB nén ≈ 2 GB → release `panic = "abort"` | CL-C1 (M), MS-C3 (N) | **Low** | ✅ `ureq body/mod.rs:519-526`; Claude chạy server local |
| 21 | Thân đúng 2 097 152 byte bị từ chối (`LimitReader` báo lỗi khi `left == 0`), trái §5.2 "vượt 2 MB" | DS-C1 (L), MS-C2 (N) | **Nit** | 📏 2 bên |
| 40 | Nút AI tắt vì yêu cầu đang chạy ở KH khác / Kiểm tra kết nối, panel không nói vì sao (Cài đặt thì có) | DS-D1 (L, PLAUSIBLE), MS-D4 (L); Claude ghi "mockup 2d chỉ đòi tắt", không báo | **Low** (Owner) | ✅ `ai-panel-view.ts:86` |

## 4. Điểm khác nhau và đánh giá

### 4.1 Chênh mức

| DR5 | Các bên gán | Chốt | Lý do |
|---|---|---|---|
| 01 Unicode lọt V3–V6 | L · M · M · L | **Low** | Model không đối kháng, RE không có động cơ lách; eval thật R1 = 0 vi phạm; output chỉ là gợi ý RE đọc, không tự gửi KH. `％` toàn độ rộng là đường thực tế nhất (3 / 4 model trong `AI_MODELS` gốc Trung Quốc) → làm trong đợt G5 |
| 04 `extractJson` O(n²) | L · M · L | **Low** | Đầu vào bị chặn: dán ≤ 20 000 ký tự (≤ 0,45 s), OpenCode bị `max_tokens` 8 000 giới hạn. Sửa rẻ (một lượt ngăn xếp) |
| 06 trần 200 000 | N · M · L | **Low** | Chỉ khi output suy biến / dữ liệu khổng lồ; không mất KYC |
| 13 lệnh ↔ luật 13 | L · M · L · L | **Low** | Tiềm ẩn (hôm nay không đường ghi); nhưng 4 / 4 cùng thấy và sửa ≈ 20 dòng → làm trước G7 |
| 14 NUL khi nhập | N · M · L | **Low** | Chỉ file sửa tay; hậu quả là mất phần chẩn đoán |
| 20 gzip | M · N | **Low** | Cần server có chứng chỉ hợp lệ cho opencode.ai trả thân nén lớn; hậu quả app đóng, không mất dữ liệu đã lưu. Rẻ → gộp đợt Rust trước G7, không coi là điều kiện G7 |
| 28 key trong trả lời 2xx | M (Codex) | **Low** | Key nằm ở header tới gateway, model không thấy key; cần gateway phản chiếu header vào `content`. Phòng thủ rẻ (Rust từ chối `content` chứa key) |
| 30 `AI_HTTP` mất chi tiết | L · L · M | **Low** | Có đường vòng (Cài đặt → Kiểm tra kết nối); nên sửa sớm vì gói Go hết hạn 11/10 |
| 35 `validator_json` lạ làm sập màn | M (Codex) | **Low** | Chỉ file backup sửa tay; mất khả dụng một màn, không mất dữ liệu |
| 37 trạng thái key về muộn | L (Codex) | **Nit** | Tái hiện bằng IPC giả giữ `ai_key_status`; Credential Manager trả trong vài ms, người dùng không kịp gõ + lưu trước đó |
| 52 chấm eval | L · M · L · L | **Low** | Owner vẫn đọc tay theo `ai-eval.md`; chỉ sai cột Script |
| 53, 55 script eval | L · M · L | **Low** | Công cụ Owner chạy tay; sửa trước lần eval kế tiếp |
| 62 token âm ở eval | L (Codex) | **Nit** | Cần upstream gửi `usage` âm |

### 4.2 Chỉ một bên thấy — hai lỗi Medium

**DR5-49 (chỉ Claude, CL-F1) — Medium, 🔁 phiên tổng hợp chạy lại.** Khối JSON **đầu tiên** của tin nhắn `web@1` là ví dụ định dạng trong prompt G5 (`analysis.ts:39-47`, `discovery.ts:37-42`): mọi `text` là `"…"`, `evidence` là `F12`, `F10`, `F13`, `F9`, `F3`. `"…"` dài 1 ký tự nên qua schema; V3–V6 không có gì để chặn; V2 đạt khi KH có đủ các mã đó. RE vừa bấm "Phân tích bằng ChatGPT web" (tin nhắn còn trong clipboard), quay lại app và Ctrl+V vào "Dán kết quả" → **ACCEPTED ở lần thử 1**, thành CURRENT, đẩy phân tích thật thành STALE, hiện cả ở chi tiết lịch hẹn, không xóa được. Chạy lại `probe-paste-own-seed.mjs` trên seed demo: `analysis 38 ACCEPTED / 270`, `discovery 1 / 497` (39 / 767 KH). KH còn lại báo V2 "F12 không có trong đầu vào" — câu báo không nói "đây là tin nhắn của app", dán lại lần nữa thành REJECTED. Đường OpenCode: model chép lại ví dụ cho cùng kết quả.
- **Muse nói ngược** (MS F §4 E): "Dán cả tin nhắn web vào khung đáp án (nhầm): thành V1 tính lần thử, đúng spec §3.1.3". Sai: tin nhắn có JSON nên không bao giờ là V1; kết quả là V2 hoặc **ACCEPTED**. Muse đọc mà không chạy thử.

**DR5-36 (chỉ Codex, CX-D2 + CX-F1) — Medium, ✅.** `analyseCustomer` giữ `customerId` / `kycVersionId`, sau `await` lưu bằng `app.run` trên DB **hiện tại**; chỉ bỏ khi lỗi `CUSTOMER_NOT_FOUND` / `KYC_VERSION_NOT_FOUND` (`ai-analysis.ts:177-181, 202-211`). Doc comment `AnalysisOutcome.discarded` hứa "the data replaced by Nạp lại / Nhập backup → nothing is saved", nhưng điều đó chỉ đúng khi ID biến mất. Khôi phục một backup **của chính DB này** trong lúc phân tích đang chạy (tới 2 × 120 s) giữ nguyên ID → kết quả cũ ghi vào DB vừa khôi phục. Codex F dựng ca nặng hơn bằng lệnh nghiệp vụ thật (xác nhận lại cùng giá trị tạo F5, khôi phục bản chỉ có F1–F4): CURRENT trích **F5 không tồn tại**, panel "F5 không còn hiệu lực". Khác KNOWN S-2 (ghi muộn trong khoảng chờ backup): ở đây kết quả về **sau** khi thay xong. Claude F, DeepSeek F, Muse F đều xét "thay DB khi AI chạy" và kết luận "discarded" — chỉ đúng khi ID khác (Nạp lại).

### 4.3 Chỉ một bên thấy — Low / Nit đáng chú ý

- **Chỉ Claude (23):** DR5-05 (trả lời bị cắt chọn phần tử con), 15 (xác nhận lại cùng giá trị: CURRENT nhưng bằng chứng "không còn hiệu lực"), 22 (hết hạn kết nối 10 s báo "2 phút"), 32 (ô key là ô chữ thường), 33 (không báo xong cho trình đọc màn hình), 50 (Nạp lại đưa Cài đặt → AI về Mock), 57 (hai tài liệu mà test so nguyên văn bị CI coi là docs-only — **phải sửa trước mọi PR G5**), 54 (dừng giữa chừng mất toàn bộ kết quả eval đã trả tiền), cùng các Nit ở §5.
- **Chỉ Codex (9):** DR5-07 (Mock trích "2 cháu ngoại" thành Số con, "chưa đăng ký kết hôn" thành "Đã kết hôn"), 28 (key trong trả lời 2xx), 35 (validator_json lạ làm sập màn), 38 (bấm mã F không chuyển focus), 39 (ADR W-1 mục 6 nói "các nút AI của chính KH đó tắt" còn spec §3.1 mục 4 chỉ liệt kê Phân tích + ChatGPT web — nút AI trích xuất vẫn bật), 48 (backup có `seq` phiên bản hở → UI đánh số theo vị trí mảng).
- **Chỉ DeepSeek (3):** DR5-09 (`Array.from` trên chuỗi dán 20 triệu ký tự ≈ 140 MB rác), 19 (4 kiểu export thừa ở `@p2c/db`), 63 (eval `redirect: 'error'` ra `AI_NETWORK`, Rust ra `AI_HTTP`).
- **Chỉ Muse (6):** DR5-41 (panel trống thiếu dòng help của mockup 2a / 4d "Gửi 8 dữ kiện đã xác nhận tới OpenCode Go · DeepSeek V4.1 Flash… Không gửi tên, mã KH, ghi chú." — Claude D ghi "khớp mockup 2b–2l", bỏ sót 2a), 42 (khối AI ở lịch hẹn không có badge "ChatGPT web", W-1 mục 4), 43 (focus rơi về `body` khi phiên web đóng), 10, 11, 64.

### 4.4 Mâu thuẫn và nhận định cần sửa

- **G7:** DeepSeek / Muse "SẴN SÀNG" vì không thấy DR5-36, DR5-49 — không đứng (§4.2).
- **DS-E3 bị bác:** `readConfig` gửi `reasoning_effort: high` cho mọi model là **chủ ý** của golden `ai-eval.md` §1 dòng 12–13 ("Eval gửi `reasoning_effort: high` dù `models.ts` còn để `reasoningEffort: false`… lần chạy đầu cũng là lần kiểm model có nhận tham số đó không"). DeepSeek ghi đã đọc file này.
- **CL-C4 nói quá một ý** (Claude tự sửa ở F §5): `tauri-contract.test.ts:158-194` có so tên lệnh, tham số camelCase, mã lỗi giữa `lib.rs` và JS. Phần còn đúng: `post()` / hằng URL / key / static `AI_RUNNING` không có test đỏ.
- **Bỏ qua có ý thức:** Muse thấy TOCTOU của eval (DR5-53) nhưng cho "chấp nhận được"; DeepSeek thấy ô key không che nhưng cho "mockup cũng vậy" (DR5-32); Claude thấy nút tắt không lời giải thích nhưng cho "mockup 2d chỉ đòi tắt" (DR5-40). Phiên tổng hợp giữ cả ba thành phát hiện Low, Owner chọn.

## 5. Bảng đầy đủ

Mức: M = Medium, L = Low, N = Nit. Nhóm sửa: §7.

### 5.1 `packages/ai` + guardrail

| DR5 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 01 | Biến thể Unicode lọt V3–V6 (§3) | CL-A3, CX-A2, DS-A1, MS-A2 | L | ✅ | G5 |
| 02 | G5 chặn nhầm câu thường (§3) | CL-A1/A2, CX-A5, DS-A2 | L | ✅ | G5 |
| 03 | Test không ghim từng mục blocklist | CX-A3, MS-A3 | L | 🧪 | I-9 |
| 04 | `extractJson` O(n²) | CL-A5, CX-A1, DS-A3 | L | ✅📏 | I-11 |
| 05 | Trả lời bị cắt (hết `max_tokens`) → `extractJson` chọn phần tử con, V1 "hypotheses: sai kiểu", REJECTED lưu phần tử con; Rust bỏ `finish_reason` | CL-A4 (+ CL-C3) | L | ✅ | I-4 + I-11 |
| 06 | Không giữ trần 200 000 ký tự trước Rust (§3) | CX-A6, MS-A1, CL-A8, CL-A9 | L | ✅ | I-11 |
| 07 | Mock trích xuất sai nghĩa (cháu ngoại, chưa đăng ký kết hôn, ly hôn) | CX-A4 | L | ✅ `mock-adapter.ts:136-145` | I-11 |
| 08 | `text` chỉ có ký tự vô hình qua schema / V7; 250 ký tự NFD đếm 302 → V1 oan | CL-A7 | N | ✅ `schema.ts:87` | G5 |
| 09 | `Array.from` cả chuỗi dán / `raw_output` rất lớn (20 triệu ký tự ≈ 140 MB) | DS-A4 | N | 📏 | I-11 |
| 10 | Hằng `BUSY` / `CANCELLED` dùng chung, gán được; `analysisOutcome([])` ném `TypeError` khó hiểu | MS-A6, MS-A8 | N | ✅ `run.ts:43-44` | I-10 |
| 11 | Mock discovery 0 dữ kiện + 0 thiếu → `nextBestActions: [null]`; comment mô tả sai | MS-A7 | N | ✅ | I-10 |
| 12 | Đột biến sống: bỏ xử lý `\"` trong `closingBrace`, bỏ NFC của `collapseSpaces`, MBTI chữ thường, tuổi theo năm xác nhận | CL-A6 | L | 🧪 | I-9 |

### 5.2 db

| DR5 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 13 | Lệnh không kiểm output ACCEPTED như luật 13 (§3) | CL-B1, CX-B1, DS-B1/F1, MS-B2 | L | ✅ | **I-3** |
| 14 | Nhập backup nhận NUL (§3) | CL-B3, CX-B2, MS-B1 | L | ✅ | **I-3** |
| 15 | Xác nhận lại cùng giá trị (hoặc sửa ngày sinh cùng năm) thay dữ kiện được trích mà không tạo phiên bản → phân tích vẫn CURRENT, bấm bằng chứng ra "không còn hiệu lực", mức bằng chứng theo ngày cũ | CL-B2 (+ bằng chứng F) | L | ✅ | Owner Q3 |
| 16 | Lệnh / nhập không ràng chéo cột: REJECTED với `attempts` = 1, ACCEPTED có báo cáo validator lỗi, `prompt_version` không khớp `mode`, `model` 5 000 ký tự, `date` trước ngày tạo KH | CL-B4, DS-F2 | N | ✅ | **I-3** |
| 17 | Đột biến sống: lời nhắc material khi có bản nhỏ sau bản cốt lõi; mã lỗi NUL của giá trị KYC | CL-B6 | L | 🧪 | I-9 |
| 18 | Nhãn 3 bản + seed chép builder / Mock, đã lệch (§3) | CL-B5, DS-A5/B2/B3, MS-A4/A5/B3 | L | ✅ | I-10 |
| 19 | `AiAnalysisMode/Status/Provider/Reasoning` export qua `@p2c/db`, không ai dùng | DS-B4 | N | ✅ | I-10 |

### 5.3 Rust (`ai.rs`, `lib.rs`)

| DR5 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 20 | Trần 2 MB đếm byte nén (§3) | CL-C1, MS-C3 | L | ✅ | **I-4** |
| 21 | Thân đúng 2 MB bị từ chối | DS-C1, MS-C2 | N | 📏 | **I-4** |
| 22 | `Timeout(_)` gộp cả hết hạn kết nối 10 s (kể cả bắt tay TLS) thành `AI_TIMEOUT` "AI không trả lời trong 2 phút"; test đang chốt hành vi này | CL-C2 | L | ✅ `ai.rs:257-263` | **I-4** |
| 23 | Kiểm tra kết nối `max_tokens` 64 kèm reasoning: spec §4.2 đo DeepSeek Flash dùng 65 token suy luận ở `high` → có thể `content: null` → `AI_BAD_RESPONSE` | CL-C3 (PLAUSIBLE) | L | 📄 | G5 |
| 24 | `post()` / hằng URL / key không có test đỏ (§3) | CL-C4, CX-C3, DS-C2 | L | 🧪 | **I-4** |
| 25 | Key lưu không truyền `persistence` → kiểu Enterprise (đi theo hồ sơ roaming), trái "mỗi máy một key" (D-1 mục 4) | CL-C5 (PLAUSIBLE) | L | ✅ `ai.rs:303-309` | Owner Q4 (G6) |
| 26 | `clean_key` chỉ trim + độ dài: key có LF / NUL / ký tự ngoài ASCII được lưu, mọi lần gọi sau ra `AI_NETWORK`; `reasoning` là chuỗi bất kỳ | CL-C6, MS-C1 | N | ✅ `ai.rs:266-274` | **I-4** |
| 27 | `server_message`: không có message JSON thì trả nguyên thân (phản chiếu header / session / request), che key chỉ khi trùng nguyên key, không che mã phiên (W-1 mục 7); trả lời lỗi > 2 MB mất mã HTTP | CL-C7, CX-C2 | L | ✅ `ai.rs:235-254` | **I-4** |
| 28 | Trả lời 2xx chứa key đi thẳng về webview, vào output ACCEPTED / `raw_output` REJECTED | CX-C1 | L | ✅ `ai.rs:222-229` | **I-4** |
| 29 | Thiếu `usage` → 0 token thay vì `null` | CL-F3 | N | ✅ `ai.rs:225` | **I-4** |

### 5.4 UI

| DR5 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 30 | `AI_HTTP` mất mã + thông điệp ở panel / trích xuất (§3) | CL-D1, CX-F2, MS-D1 | L | ✅ | **I-5** |
| 31 | Dòng đang chạy theo Cài đặt hiện tại (§3) | CL-D5, CX-D4, DS-D2, MS-D6 | N | ✅ | **I-5** |
| 32 | Ô nhập key là `<input>` chữ thường, không tắt `spellcheck`: key hiện rõ khi dán và còn sau lần lưu lỗi | CL-D2 | L | ✅ `SettingsAi.tsx:220-227` | **I-5** |
| 33 | Phân tích / trích xuất xong không được báo cho trình đọc màn hình (`BusyLine` biến mất, kết quả ngoài vùng live) | CL-D3 | L | ✅ | I-6 |
| 34 | Đột biến sống ở TSX: bấm đúp nút ChatGPT web, copy chậm của phiên cũ, dòng REJECTED / lỗi cũ khi phiên web mở, Thử lại khi runner bận, `onSaved()` của hộp 3f, render output bằng HTML (e2e vẫn xanh) | CL-D4, CX-D5, CX-E5 | L | 🧪 | I-9 |
| 35 | `isIssue` chỉ kiểm có khóa: `validator_json` từ backup với `path` là object → `TypeError` khi render → cả màn Hồ sơ KH vào ErrorBoundary | CX-D1 | L | ✅ `ai-panel-view.ts:150-151` | **I-3** |
| **36** | **Kết quả AI muộn ghi vào DB vừa khôi phục khi ID trùng (§4.2)** | CX-D2, CX-F1 | **M** | ✅ | **I-2** |
| 37 | `ai_key_status` về muộn ghi đè trạng thái vừa lưu | CX-D3 | N | ✅ | **I-5** |
| 38 | Bấm mã F bằng bàn phím chỉ cuộn, focus ở lại nút | CX-D6 | L | ✅ | I-6 |
| 39 | ADR-0009 W-1 mục 6 ↔ spec §3.1 mục 4: phạm vi nút tắt khi chờ dán | CX-D7 | L | 📄 | Owner Q5 |
| 40 | Nút AI tắt vì bận ở nơi khác, không lời giải thích (§3) | DS-D1, MS-D4 | L | ✅ | Owner Q7 → I-6 |
| 41 | Panel trống thiếu dòng help mockup 2a / 4d (provider · gói · model, "Không gửi tên, mã KH, ghi chú") | MS-D2 | L | ✅ `KycIntelligence.tsx:426-428`, `ai.html:479, 874` | I-6 |
| 42 | Khối AI ở lịch hẹn chỉ có badge Mock, không có "ChatGPT web" | MS-D3 | N | ✅ `AppointmentAi.tsx:52` | I-6 |
| 43 | Phiên web đóng / Đóng "0 đề xuất" → focus về `body` | MS-D5 (+ Claude D-A1 ghi nhận) | N | ✅ | I-6 |
| 44 | `AI_NO_KEY` không có link "Cài đặt → AI" như mockup 2f / 2l | CL-D6 | N | ✅ | **I-5** |
| 45 | Trong phiên ChatGPT web, badge đầu panel theo bản lưu / cổng hiện tại, không theo ảnh chụp (spec §9.1, mockup 4e) | CL-D7 | N | ✅ | I-6 |
| 46 | Lưu key với ô trống ngay sau lần lưu thành công hiện cùng lúc "Chưa nhập key." và "Đã lưu key." | CL-D8 | N | ✅ | **I-5** |
| 47 | `codes.join(' / ')` cứng | CL-D9 | N | ✅ | I-6 |
| 48 | `KycVersionRecord` không trả `seq`, UI đánh số "kyc v<n>" theo vị trí mảng; backup có `seq` 10, 20 (luật nhập cho phép) hiện v2 | CX-F3 | L | ✅ `kyc.ts:539-547` | I-6 |

### 5.5 Xuyên gói

| DR5 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| **49** | **Ví dụ JSON của prompt G5 đạt validator: dán lại tin nhắn / model chép ví dụ → CURRENT toàn "…" (§4.2)** | CL-F1 | **M** | 🔁 | **I-1** + G5 |
| 50 | "Nạp lại dữ liệu giả lập" dựng DB mới không có dòng `settings.ai` → Cài đặt → AI về Mock / Go / DeepSeek Flash / DEFAULT, không báo (hộp 10c chỉ nói "dữ liệu được thay") | CL-F2 | L | ✅ `app-data.ts:335-341, 374-377` | Owner Q6 → I-6 |
| 51 | Kiểu trường KYC (số / có–không) ở 5 chỗ trong 3 gói | CL-F4 | N | ✅ | I-10 |

### 5.6 tools / e2e / CI

| DR5 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 52 | `gradeNote` không chuẩn hóa như V7 (§3) | CL-E1, CX-E1, DS-E1, MS-E1 | L | ✅ | I-7 |
| 53 | Eval ghi đè (TOCTOU) (§3) | CL-E3, CX-E2, DS-E4 | L | ✅ | I-7 |
| 54 | Dừng giữa lượt (Ctrl+C, treo, máy ngủ) mất mọi câu trả lời đã trả tiền: chỉ ghi một lần ở cuối | CL-E4 | L | ✅ | I-7 |
| 55 | Eval đọc hết thân trả lời trước khi so 2 MB (§3) | CX-E3, DS-E5, MS-E2 | L | ✅ | I-7 |
| 56 | Giá trị model ở ô "Không được có" của bảng X không qua `plain()` (khác chỗ KNOWN `:409`, `:451`) | CL-E2 | L | ✅ `eval-ai-core.mjs:237` | I-7 |
| 57 | `docs/design/phase-5-prompts.md` và `docs/golden/ai-eval.md` được test so nguyên văn nhưng `ci.yml` / `isDocsOnly` coi là docs-only → PR sửa G5 không chạy CI, `main` đỏ âm thầm | CL-E5 | L | ✅ `ci.yml:8-16`, `pr-core.mjs:27-32` | **I-8** |
| 58 | Test eval: 4 đột biến có nghĩa sống (A3 thiếu khối, A1 18/20, timeout 20 phút, FATAL ở vòng ghi chú); fixture không so cột chế độ / hạng mục với golden; lệnh thật không chạy CI; logic Rust chép không test | CL-E6, DS-E6 | L | 🧪 | I-7 |
| 59 | Thông điệp lỗi server (≤ 200 ký tự, chỉ che key) vào file `docs/metrics` commit lên repo public | CL-E7 (PLAUSIBLE) | N | ✅ | I-7 |
| 60 | IPC giả `ai_complete` luôn trả `"OK"` → không e2e nào thấy ACCEPTED của OpenCode hay kiểm cái gì đi vào `ai_complete` | CL-E8 | N | ✅ `e2e/support.ts:82-87` | I-9 |
| 61 | `appointments.spec.ts:817-846` chép `createKycCustomer` / `addKycNote` của `support.ts` | CL-E9, DS-E2 | N | ✅ | I-9 |
| 62 | Eval nhận token âm, Rust ra 0 | CX-E4 | N | ✅ | I-7 |
| 63 | Eval `redirect: 'error'` → `AI_NETWORK`, Rust → `AI_HTTP` | DS-E7 | N | ✅ | I-7 |
| 64 | Eval không có hẹn giờ kết nối 10 s như Rust | MS-E3 (PLAUSIBLE) | N | ✅ | I-7 |

## 6. KNOWN có bằng chứng mới, phát hiện bị bác

- **#420 (G5 chặn nhầm):** thêm cụm mới ở DR5-02.
- **#474 (eval):** `recording` — Muse thêm biến thể lỗi ngay lần gọi đầu ghi "0 lần thử", token 0 / 0 (MS-E4); Codex tái hiện lần 2 lỗi (CX-E6). `detail` không qua `plain()` — Muse dựng `</details>` lọt vào file (MS-E5). `noteDetails` dùng `EVAL_NOTES` toàn cục — Codex tái hiện `TypeError` (CX-E7). Gộp vào I-7.
- **#455 (phạm vi export `run.ts`):** `analysisOutcome([])` / `nextRetry([])` ném `TypeError` khó hiểu (MS-A8). Gộp I-10.
- **S-2:** Codex tách rõ DR5-36 khỏi cửa sổ S-2 (kết quả về sau khi `replace` xong) — xử lý ở I-2, không chờ S-2.
- **Bị bác:** DS-E3 (§4.4).

## 7. Lộ trình sửa

Mỗi nhóm = một Issue theo mẫu Task (≤ ~400 dòng SP). Thứ tự trong đợt 1 theo rủi ro và phụ thuộc.

### Đợt 1 — trước G7

| Issue | Nội dung | DR5 | Cỡ ước lượng | Nhãn |
|---|---|---|---|---|
| **I-1** | `checkWebAnswer` coi câu dán chứa khung `=== HƯỚNG DẪN ===` / `=== ĐẦU VÀO ===` (hoặc trùng tin nhắn) là `unusable` — không tính lần thử, câu "Đây là tin nhắn của app — hãy copy câu trả lời của ChatGPT" (i18n). Thêm 1 dòng vào spec §3.1 điểm 3 (G1 nhỏ). Test: ví dụ G5 qua `checkAnalysisAnswer` hiện ACCEPTED (khóa lại cho đợt G5) | 49 (a) | ~15 SP + ~40 test | `risk:med` |
| **I-2** | Chụp "thế hệ" DB (bộ đếm tăng ở `replace`) lúc bấm; trước khi lưu, khác thế hệ → `discarded`, kể cả khi ID trùng. Áp cho phân tích OpenCode / Mock (phiên web đã mất khi rời màn). Giữ: đổi KYC trong cùng DB vẫn lưu STALE; Hủy không lưu | 36 | ~60 SP + ~80 test | `risk:med` |
| **I-3** | Một hàm dùng chung "ACCEPTED: schema của `mode` + `evidence ⊆ input`" cho `toRow` và luật 13; sửa fixture `{ summary }`; `valueOf` từ chối chuỗi có NUL (mọi bảng); ràng `prompt_version` bắt đầu bằng `<mode>@` và REJECTED ⇒ `attempts` = 2 ở lệnh + luật 12 (nếu Owner chọn); `isIssue` kiểm kiểu từng trường | 13, 14, 16, 35 | ~70 SP + ~100 test | `risk:low` |
| **I-4** | Rust `ai.rs`: đọc thân qua `take(MAX_BODY + 1)` **sau** giải nén (hoặc tắt gzip — đổi feature là G4); `Timeout::Connect / Resolve` → `AI_NETWORK`; `clean_key` chỉ nhận ASCII in được, `check` nhận `reasoning` ∈ {low, medium, high}; `server_message` bỏ fallback thân thô, che cả mã phiên; 2xx có `content` chứa key → `AI_BAD_RESPONSE`; status non-2xx giữ `AI_HTTP` khi thân quá lớn; `usage` thiếu → `null`; trả `finish_reason`. Tách `post` thành agent + `post_with` để test với server local (redirect, > 2 MB, gzip, header, timeout); test hằng URL / key bằng chuỗi | 20, 21, 22, 24, 26, 27, 28, 29, (5) | ~90 SP + ~200 test | `risk:med`, **`build-exe`** |
| **I-5** | Lỗi và Cài đặt: `AiPanelRun` / `ExtractionOutcome` giữ `httpStatus` + `serverMessage`, dùng chung `errorText` (đưa ra khỏi `settings-ai-view.ts`), `AI_NO_KEY` có link; dòng đang chạy hiện cài đặt chụp lúc bấm (giữ trong `AiJobs`); `TextField` thêm `type` / `spellCheck`, ô key `type="password"`; `setOutcome(undefined)` trước khi kiểm ô; bỏ phản hồi `ai_key_status` cũ | 30, 31, 32, 37, 44, 46 | ~90 SP + ~80 test | `risk:low` |

- **Tối thiểu:** I-1, I-2, I-3 (≈ 145 dòng SP). **Khuyến nghị:** I-1 → I-5 + I-8 (≈ 335 dòng SP) — I-4 đổi Rust nên cần build exe, mà G7 đằng nào cũng phát hành exe.
- **I-8 làm trước bất kỳ PR G5 nào:** thêm `docs/design/phase-5-prompts.md`, `docs/golden/ai-eval.md` vào `paths` của `ci.yml` và danh sách "md là code" của `pr-core.mjs` (đổi tên `CODEMAP_DOCS` thành danh sách chung; test giữ hai nơi khớp) — DR5-57, ~10 dòng.

### Đợt 2 — sau G7 (đầu Phase 6), hoặc trước G7 nếu Owner muốn "sửa hết" như 06/10

| Issue | Nội dung | DR5 |
|---|---|---|
| I-6 | UI theo mockup + trợ năng: dòng help 2a / 4d, badge "ChatGPT web" ở lịch hẹn, badge đầu panel theo ảnh chụp, vùng `role="status"` báo xong, focus tới dữ kiện khi bấm mã F (`tabIndex=-1`), focus sau khi đóng phiên web / "0 đề xuất", `sep.slash`, `seq` thật cho số phiên bản; nếu Owner chọn: lời giải thích khi bận, Nạp lại giữ Cài đặt → AI | 33, 38, 40, 41, 42, 43, 45, 47, 48, 50 |
| I-7 | Script eval (trước lần chạy eval kế tiếp): `gradeNote` chuẩn hóa NFC + gộp `\s+` + chữ thường cho quote, từ khóa, predicate cấm; ghi `wx` + `.partial` sau mỗi mục; đọc thân theo luồng, cắt ở 2 MB; `plain()` cho mọi chữ model; token âm, 3xx, hẹn giờ kết nối như Rust; 4 ca test đột biến + test đọc bảng §3–§5 của golden; mục KNOWN #474 | 52–56, 58, 59, 62–64 |
| I-9 | Test: từng mục G5 §8 đọc từ tài liệu (cả cột "Bỏ dấu"), các đột biến sống của A / B / D, e2e bấm đúp ChatGPT web / Thử lại khi bận / dòng REJECTED trong phiên web / `onSaved` / output có HTML, `ai_complete` giả theo kịch bản + 1 e2e OpenCode ACCEPTED, helper e2e dùng chung | 03, 12, 17, 34, 60, 61 |
| I-10 | Dọn lặp: nhãn + phần analysis của `buildAnalysisInput` vào `@p2c/ai/schema` cho seed dùng lại (hoặc tối thiểu test so 3 bản + so Mock seed với Mock thật), `kycFieldType` ở `domain`, bỏ 4 kiểu export thừa, `Object.freeze` hằng runner, Mock rỗng | 10, 11, 18, 19, 51 |
| I-11 | `packages/ai` độ bền đầu vào: `extractJson` một lượt (O(n)), dừng khi khối ngoài không đóng và báo "trả lời bị cắt" (dùng `finish_reason` của I-4), `ai` tự đo tổng ký tự trước khi gọi Rust và báo lỗi dữ liệu, gộp mã `evidence` sai, `Array.from` có điểm dừng sớm, Mock trích xuất hẹp hơn | 04, 05, 06, 07, 09 |

### Đợt G5 — cần Owner duyệt G5, tăng `prompt_version`

Gộp một PR G5 (sau I-8): danh sách chặn sửa chặn nhầm (DR5-02 + KNOWN #420: "dễ chốt", "bảo minh", "độ tin cậy", "nghị quyết", "nhóm máu", "bảo việt" sang "Bỏ dấu: không"; "quyết định số" và "công văn số" đòi chữ số theo sau; mẫu `luật` bỏ qua `KH` / `RE` / chữ hoa toàn bộ; "sẵn sàng mua", "tiềm năng mua", "điểm số", "chấm điểm" thu hẹp); cách so khớp §7 thêm NFKC + bỏ `\p{Cf}` + coi `-` / `_` như khoảng trắng (DR5-01); V1 đòi `text` có ít nhất một chữ cái (DR5-08, DR5-49 b) hoặc mã trong ví dụ prompt đổi thành mã không bao giờ có (`F0`); Kiểm tra kết nối `max_tokens` rộng hơn hoặc không kèm `reasoning` (DR5-23). Ca kiểm mới vào G5 §8.5.

## 8. Câu hỏi cần Owner quyết

1. **Phạm vi trước G7:** tối thiểu (I-1 → I-3), khuyến nghị (I-1 → I-5 + I-8), hay sửa hết (cả đợt 2) như quyết định 06/10?
2. **DR5-49:** làm luôn phần G5 (V1 đòi chữ cái / đổi mã ví dụ) trong đợt 1, hay để đợt G5?
3. **DR5-15:** khi RE xác nhận lại cùng giá trị — (a) giữ CURRENT theo phiên bản, panel ánh xạ mã F cũ sang dữ kiện hiện hành cùng trường / giá trị; hay (b) coi là STALE khi tập mã F còn hiệu lực khác tập trong `input_json` (đổi định nghĩa P1, G2)?
4. **DR5-25 (G6):** lưu key kiểu `Local` (đúng "mỗi máy một key", máy domain không đem key đi theo hồ sơ)?
5. **DR5-39 (G1):** khi phiên ChatGPT web đang chờ dán, nút "AI trích xuất" của chính KH đó có tắt không (ADR W-1 mục 6 nói "các nút AI", spec §3.1 mục 4 chỉ liệt kê hai nút)?
6. **DR5-50:** "Nạp lại" giữ nguyên Cài đặt → AI, hay giữ hành vi và ghi rõ trong spec §4.1 + hộp 10c?
7. **DR5-40 (G3):** thêm dòng "Đang có một yêu cầu AI khác — chờ xong rồi thử lại." ở panel / ghi chú khi nút tắt vì bận ở nơi khác?
8. **Đợt G5:** chạy ngay sau G7 hay chờ lần eval kế tiếp?

## 9. Kiểm độc lập và tuân thủ quy trình

Phiên tổng hợp xuất phiên DeepSeek (`opencode session export`) và Muse (`muse export --session`) bằng CLI local, rồi tìm mọi lệnh / đường dẫn chạm thư mục bên khác (`plan-opencode.md` §4):

| Bên | Đọc báo cáo bên khác | Ghi / sửa repo | Ghi chú |
|---|---|---|---|
| Claude, Codex | Không (ghi trong báo cáo; ACL chặn `claude\`, `codex\` khi hai bên mới chạy) | Không (`git status` sạch; Codex giữ 3 mục `.agents/`, `.codex/`, `AGENTS.md` có sẵn) | — |
| DeepSeek | Không. **Một lần liệt kê `C:\workspace\deep-review-5`** (gói E, thấy 5 tên thư mục, không mở) — prompt cấm liệt kê thư mục này; model tự nhận ra trong suy luận nhưng không báo Owner | Không (chỉ `opencode.json`) | Không subagent, không gọi AI của sản phẩm |
| Muse | Không trong 6 phiên A–F (Owner thử `Get-ChildItem …codex` cuối phiên F: Muse từ chối, viện dẫn luật 1). Phiên thử đầu (15:34) đã liệt kê `codex\` (tên, cỡ, giờ — sự cố đã ghi trong `plan-opencode.md` §1); phiên thử 15:48 bị ACL từ chối kể cả khi xin chạy mở rộng | **Có, tạm thời:** gói D ghi `apps/desktop/src/routes/customers/zz-msd-probe.test.ts` vào repo, chạy rồi xóa (báo cáo có ghi); gói C đặt `CARGO_TARGET_DIR` trong worktree (`.probe-target-tmp`), xóa sau khi chạy. Prompt cấm sửa file trong repo | Chạy trong sandbox user `muse-sbx-r1`: không ghi ra `deep-review-5\` được nên mỗi lần ghi báo cáo phải xin chạy mở rộng — **45 lần Owner duyệt tay**, 72 lần bộ duyệt tự động (LLM judge) duyệt, ≈ 40 phút chờ. Thư mục `subagent\` trong log là nhắc việc nội bộ chỉ đọc, `accepted_spawns` rỗng: không subagent review |

Không báo cáo nào bị coi là "nhiễm". `opencode.json` vẫn còn ở hai worktree review (bước 4 của `plan-opencode.md` §4): Owner tự xóa (lệnh xóa bị chặn ở phiên này).

## 10. Ghi chú phương pháp

- Phiên tổng hợp đọc trọn 24 báo cáo, đọc lại code ở các điểm trong cột "Kiểm" và chạy lại probe CL-F1 (`probe-paste-own-message.mjs`, `probe-paste-own-seed.mjs`); không chạy lại các mutation / số đo khác.
- Mức chốt theo cùng thước đợt 1–4: Medium = thao tác bình thường dẫn tới dữ liệu sai / không đảo ngược được hoặc chặn việc chính; Low = cần điều kiện hiếm (file sửa tay, output suy biến, server bất thường) hoặc chỉ sai hiển thị; Nit = chữ / dọn dẹp.
- Số đo thời gian của Claude / Codex lấy từ giờ ghi báo cáo (hai bên chạy song song, mỗi gói một phiên do Owner mở); không đo được token của hai bên này trên máy hiện tại.
