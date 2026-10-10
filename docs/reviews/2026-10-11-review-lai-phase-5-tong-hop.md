# Tổng hợp review lại Phase 5 (vòng 2) — Claude, Codex

- **Ngày tổng hợp:** 2026-10-11 · **SHA được review:** `705ea7c` (`main` sau #505, T-196) · kế hoạch: `raw/2026-10-11/common-plan.md`.
- **Báo cáo gốc (nguyên văn):** `raw/2026-10-11/{claude,codex}/{A…D}.md` — 8 báo cáo, 4 gói (A `packages/ai` + db · B Rust + hợp đồng Tauri · C UI + data + e2e · D xuyên gói + CI, kết luận G7). Số đo nền `common-baseline.md`, KNOWN `common-known.md`.
- **Bằng chứng ngoài repo:** probe, mutation, log ở `C:\workspace\deep-review-5-r2\{claude,codex}\<gói>\` (chỉ Home PC). Không chép vào repo: `docs/**` không chạy CI nhưng `pnpm verify` vẫn quét file không phải `.md` dưới `docs/` (CL2-D1, §3).
- **Reviewer:** Claude Opus 5.5 (phiên sạch mỗi gói, tuần tự A → D) · Codex (cùng lúc, worktree riêng). Hai bên không đọc báo cáo vòng 2 của nhau.
- **Mục tiêu vòng 2** (plan §1): (1) trục R — 35 DR5 giao Issue Phase 5 đã sửa đúng và đủ chưa; (2) đọc sâu diff sửa `0df3606..705ea7c`; (3) quét lại Phase 5 tìm điều vòng 1 bỏ sót.

**Cách kiểm (ADR-0001 M2):** mọi phát hiện của hai bên được gộp rồi đối chiếu trên code `705ea7c` ở checkout chính. Cột "Kiểm": ✅ đọc đúng chỗ code, khớp mô tả · 🧪 khoảng trống test, đã xem test hiện có không có ca đó · 📏 dựa vào probe / số đo của reviewer (hai bên đo độc lập thì ghi). **0 phát hiện bị bác.** Một chỗ hai bên tưởng mâu thuẫn (key viết bằng escape JSON, §4.2) thực ra là hai phép thử khác nhau, cả hai đúng.

## 1. Kết luận chung

| Bên | Kết luận G7 ở gói D | Lý do chính |
|---|---|---|
| Claude | **SẴN SÀNG** | 35 / 35 DR5 đã sửa; 0 Critical / High / Medium; 7 Low đều cần điều kiện hiếm |
| Codex | **CHƯA SẴN SÀNG** | đợt sửa chưa khép kín: lịch hẹn tính bằng chứng lệch hồ sơ (CX2-C1), ghi chú thiếu câu bận Owner đã chốt (CX2-C2), test chưa giữ `post()` (CX2-B4), `finishReason` mới lọt key (CX2-B2) |

**Kết luận hợp nhất: SẴN SÀNG cho G7, khuyến nghị một đợt sửa nhỏ trước (phương án B, §6).**

- **Không có Critical / High / Medium.** Hai lỗi Medium của vòng 1 đã hết: DR5-49 (a) — dán nguyên tin nhắn ChatGPT web của app: **767 / 767** hồ sơ seed bị chặn tại khung (vòng 1: 39 phân tích CURRENT toàn "…"), cả hai bên đo; DR5-36 — nhập backup cùng ID trong lúc AI chạy → `discarded`, không ghi dòng nào (cả hai bên).
- **Bảng R (35 DR5, §2):** 30 ĐÃ SỬA · 3 SỬA MỘT PHẦN (15, 24, 40) · 2 HỒI QUY (05 phần Rust, 37) · 0 CHƯA SỬA. Mọi phần sửa có test đỏ khi gỡ, trừ các chỗ ghi ở §3 (R2-11, R2-18).
- **Phát hiện mới sau khi gộp:** **21 vấn đề riêng** (R2-01 … R2-21): **11 Low · 10 Nit**. Phần lớn là biến thể gần của chính các phần sửa.
- **Vì sao hai bên lệch kết luận G7:** không lệch về sự thật — 4 điểm Codex nêu đều được Claude thấy (3 / 4) hoặc đúng khi kiểm. Lệch ở thước: Claude chấm theo "có lỗi chặn không" (thước Medium §10 tổng hợp 10/10), Codex chấm theo "đợt sửa Owner đã chọn trước G7 đã khép kín chưa". Phiên tổng hợp thấy cả hai thước có lý: không có gì chặn G7, nhưng có 3 chỗ đợt sửa làm thiếu so với quyết định Owner 10/10 (R2-01, R2-02) hoặc tự sinh lỗi (R2-09, R2-14) — đáng khép trước khi build exe G7, cỡ nhỏ.
- **Điều hai bên cùng xác nhận là tốt:** đợt sửa không đổi validator / danh sách chặn / prompt (`git diff` rỗng); AI vẫn không có đường tự ghi KYC; lệnh và luật nhập backup giờ dùng chung kiểm tra (Claude: 1 430 dòng do app sinh, 0 lệch; Codex: ma trận 40 ca, 0 lệch); NUL bị từ chối ở mọi cột chữ của backup (Claude 97 / 97 giá trị, Codex 95 / 95 cột); bom gzip 4 GB chỉ đọc 2 MB + 1 byte, bộ nhớ +6,6 MB (Claude; Codex đo 64 MiB, đỉnh 15,5 MiB); `pnpm verify` 2 215 test, e2e 188 xanh (cả hai chạy lại).

## 2. Bảng R — đủ 35 DR5

Thước chung của phiên tổng hợp (hai bên dùng khác nhau, §4.1):

- **ĐÃ SỬA:** đường lỗi vòng 1 báo đã hết và có test đỏ khi gỡ; biến thể gần còn hở (nếu có) ghi ở cột cuối, thành phát hiện riêng.
- **SỬA MỘT PHẦN:** một phần của chính mô tả DR5 hoặc quyết định Owner 10/10 chưa làm.
- **HỒI QUY:** phần sửa làm hỏng một chỗ trước đó đúng.

| DR5 | Issue / PR | Gói | Claude | Codex | **Chốt** | Biến thể / ghi chú |
|---|---|---|---|---|---|---|
| 05 (Rust) | #487 / #503 | B | ĐÃ SỬA | HỒI QUY | **HỒI QUY** (Low) | `finish_reason` tới JS đúng; nhưng trường mới không qua kiểm key, trước #503 trường này không sang webview → R2-09. `content: null` + `length` mất `finish_reason` → R2-16 |
| 13 | #485 / #499 | A | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | — |
| 14 | #485 / #499 | A | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Lệnh lịch hẹn vẫn nhận NUL (code Phase 2–3) → R2-13 |
| 15 | #490 / #505 | A + C | ĐÃ SỬA | SỬA MỘT PHẦN | **SỬA MỘT PHẦN** | Panel đúng; khối AI ở chi tiết lịch hẹn hiện cùng phân tích CURRENT mà vẫn tính mức theo ngày cũ → R2-01 |
| 16 | #485 / #499 | A | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | — |
| 20 | #487 / #503 | B | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | — |
| 21 | #487 / #503 | B | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | — |
| 22 | #487 / #503 | B | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Hết hạn phân giải tên chỉ kiểm bằng đọc code (cả hai) |
| 24 | #487 / #503 | B | ĐÃ SỬA | SỬA MỘT PHẦN | **SỬA MỘT PHẦN** | 14 / 14 đột biến sống vòng 1 giờ bị giết (Claude); nhưng thay cả `post()` bằng lỗi NETWORK vẫn 35 / 35 xanh — đúng chữ DR5-24 "`post()` không có test đỏ" → R2-11 |
| 25 | #487 / #503 | B | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Code lưu `Local` (cả hai thử Credential Manager thật, mục tạm); test không ghim `key_entry()` → R2-11 |
| 26 | #487 / #503 | B | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | — |
| 27 | #487 / #503 | B | ĐÃ SỬA | SỬA MỘT PHẦN | **ĐÃ SỬA** | Ba điểm của DR5-27 đã hết. Biến thể: thân lỗi đọc hỏng mất mã HTTP → R2-08; key URL-encode trong message → R2-10 |
| 28 | #487 / #503 | B | ĐÃ SỬA | SỬA MỘT PHẦN | **ĐÃ SỬA** | `content` chứa key → `AI_BAD_RESPONSE`. Biến thể: key viết `\uXXXX` bên trong JSON của `content` → R2-10; `finish_reason` → R2-09 |
| 29 | #487 / #503 | B | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | — |
| 30 | #486 / #502 | C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Claude D: 12 / 12 dạng lỗi từ Rust ra cùng một câu ở panel, trích xuất, Cài đặt |
| 31 | #486 / #502 | C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | — |
| 32 | #486 / #502 | C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | — |
| 33 | #489 / #504 | C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Câu từ chối tại khung dán không được báo → R2-06; "0 đề xuất" → R2-17 |
| 35 | #485 / #499 | A | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | — |
| 36 | #484 / #498 | C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Đường lưu `ai_analyses` đúng. Đề xuất AI trích xuất (không lưu) chưa có chốt thế hệ → R2-07 |
| 37 | #486 / #502 | C | ĐÃ SỬA | HỒI QUY | **HỒI QUY** (Nit) | Trạng thái key về muộn không đè key vừa lưu. Nhưng lưu **lỗi** cũng bật `acted`, nên trạng thái đúng về sau bị bỏ tới khi mở lại màn → R2-14 |
| 38 | #489 / #504 | C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Link "Xem ở Dữ kiện KYC →" (2b) chỉ cuộn → R2-20 |
| 39 | #483 / #497 | C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | — |
| 40 | #489 / #504 | C | ĐÃ SỬA | SỬA MỘT PHẦN | **SỬA MỘT PHẦN** | Owner đồng ý câu hỏi §8.7 "ở panel / ghi chú"; Issue #489 thu hẹp còn panel. Ghi chú vẫn tắt nút không lời giải thích → R2-02 |
| 41 | #489 / #504 | C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | — |
| 42 | #489 / #504 | C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | TSX không có test đỏ khi gỡ → R2-18 |
| 43 | #489 / #504 | C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Hai đường Issue nêu đã sửa; 6 đường khác vẫn rơi focus về `body` → R2-05 |
| 44 | #486 / #502 | C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | — |
| 45 | #489 / #504 | C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | TSX một phần không test → R2-18 |
| 46 | #486 / #502 | C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | — |
| 47 | #489 / #504 | C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Chỉ chuyển chuỗi vào i18n; không test bắt (chữ hiển thị giống hệt), cả hai ghi |
| 48 | #490 / #505 | A + C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | TSX `kyc.meta`, `kycNote.sub` không test → R2-18 |
| 49 (a) | #483 / #497 | A + C | ĐÃ SỬA | SỬA MỘT PHẦN | **ĐÃ SỬA** | 767 / 767 bị chặn (cả hai). Biến thể: khung bị đổi NFD / khoảng trắng / NBSP / ZWSP → vẫn 39 ACCEPTED → R2-03; dán lại tin nhắn "Copy yêu cầu sửa" ở lần 2 → REJECTED → R2-04. 49 (b) là KNOWN #491 |
| 50 | #490 / #505 | C | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | — |
| 57 | #482 / #496 | D | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Biến thể: file không phải `.md` dưới `docs/` → R2-12; skill `review-pr` → R2-19; test không giữ `CODE_DOCS` khớp thứ test đọc → R2-21 |
| — (T-202) | #500 / #501 | A | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Không phải DR5, không đếm trong 35 |

## 3. Bảng phát hiện mới (R2-01 … R2-21)

Mức chốt bởi phiên tổng hợp; khi hai bên gán khác nhau, lý do ở §4.1.

### 3.1 Low (11)

| R2 | Vấn đề | Ai thấy | Mức (CL / CX → chốt) | Kiểm | Nguồn gốc |
|---|---|---|---|---|---|
| 01 | Khối KYC Intelligence ở chi tiết lịch hẹn gọi `analysisContent(shown, versions)` không truyền `facts` (tham số mặc định `[]`), nên sau khi RE xác nhận lại cùng giá trị, cùng một phân tích CURRENT có mức / ngày "mới nhất" khác Hồ sơ KH (vd. hồ sơ `MEDIUM · 2026-10-11`, lịch hẹn `LOW · 2024-06-01`) | CL2-C1, CX2-C1 (Codex D chạy lại) | L / L → **L** | ✅ `appointment-ai-view.ts:35`, `AppointmentAi.tsx:37`, `ai-panel-view.ts:430–441` | PR #505 bỏ sót nơi gọi thứ hai |
| 02 | Nút AI trích xuất của ghi chú tắt khi AI bận ở nơi khác mà không có câu giải thích; Owner đã đồng ý câu §8.7 "ở panel / ghi chú" (`PROJECT-STATE.md` 10/10: "A disabled AI button explains a request running elsewhere") | CX2-C2 | — / L → **L** | ✅ `KycExtraction.tsx:44–76` | Issue #489 thu hẹp quyết định |
| 03 | Nhận diện tin nhắn của app so dòng khung từng ký tự sau `trim()`: khung bị đổi NFD, NBSP, ZWSP, hai dấu cách, tiền tố `> ` thì không nhận ra, ví dụ trong prompt lại thành phân tích ACCEPTED (39 / 767 hồ sơ seed; Codex lưu thật thành CURRENT, xuất / nhập backup được) | CL2-A2, CX2-A1 | L / L → **L** | ✅ `web.ts:85–89`; 📏 cả hai đo 39 / 767 | Giới hạn cách nhận diện của PR #497 |
| 04 | Ở lần thử 2, dán lại chính tin nhắn "Copy yêu cầu sửa" (không có dòng khung) → V1, tính lần thử, lưu REJECTED và đóng phiên. Đúng chữ spec §3.1 mục 3, trái tinh thần quyết định Owner 10/10 | CL2-A1 | L / — → **L** | ✅ `web.ts:111`, `prompts/retry.ts:13–15` | Có từ trước; #497 bỏ sót |
| 05 | Nút tự biến mất khi bấm làm focus rơi về `<body>`: Bỏ / Xác nhận đề xuất trích xuất (cả đề xuất cuối), Hủy khi đang chạy, Thử lại trong alert, "← Về bản mới nhất" | CL2-C2 (6 đường), CX2-C4 (Bỏ đề xuất cuối) | L / L → **L** | ✅ `KycExtraction.tsx:51, 113–124`; 📏 probe Edge của cả hai | Có từ trước; #504 chỉ phủ hai đường Issue nêu |
| 06 | Câu từ chối tại khung dán ("tin nhắn của app", "dài quá 20.000 ký tự") chỉ là lỗi của ô (`aria-describedby`), không vào vùng live / alert, focus ở nguyên nút: với trình đọc màn hình, bấm "Kiểm tra và lưu" là không có gì xảy ra | CL2-C3 | L / — → **L** | ✅ `KycWebSession.tsx:141–152` | `OWN_MESSAGE` mới (#497), `TOO_LONG` có từ trước |
| 07 | Job AI trích xuất mang khóa `extraction:<noteId>`, không mang thế hệ DB: nhập backup cùng ID trong lúc trích xuất chạy, quay lại hồ sơ, đề xuất cũ vẫn hiện trên dữ liệu mới. Không tự ghi gì; Xác nhận vẫn qua hộp 3f hiện giá trị đang có | CX2-C3 | — / L → **L** | ✅ `use-ai-job.ts:18–33`, `ai-analysis.ts:238–246` | Biến thể DR5-36 có từ trước; #484 đúng phạm vi `ai_analyses` |
| 09 | `finish_reason` mới (PR #503) đi thẳng về webview, không qua kiểm key như `content`, không có trần độ dài: gateway phản chiếu header vào trường này đưa key tới JS (D-1 mục 1) | CL2-B3, CX2-B2 | N / L → **L** | ✅ `ai.rs:238–250` | Mới do #503 → DR5-05 HỒI QUY |
| 10 | Kiểm key ở Rust chỉ so nguyên văn: key viết `\uXXXX` **bên trong** JSON của `content` qua được, rồi `JSON.parse` của webview giải mã thành key nguyên vẹn → ACCEPTED, vào `ai_analyses` và backup (Codex chạy hết đường Rust → validator → lệnh → xuất / nhập). Key URL-encode trong `server_message` không bị che | CX2-B3 (Claude thử biến thể, ghi "đã xét" — §4.2) | — / L → **L** | ✅ `ai.rs:241, 262–267` | Biến thể DR5-27/28 |
| 11 | Test Rust chưa giữ hai đường thật: thay cả `post()` bằng `Err(AI_NETWORK)` vẫn 35 / 35 xanh (test duy nhất gọi `post` chờ đúng lỗi đó cho URL `http://`); `key_entry()` dựng với `None` (key về `Enterprise`) vẫn 35 / 35 xanh | CL2-B1 (`key_entry`), CX2-B4 (cả hai) | L / L → **L** | 🧪 `ai.rs:337–345, 1028–1040, 1373` | Test mới của #503 |
| 12 | CI và `merge-pr` coi mọi file dưới `docs/` là docs-only, nhưng `pnpm verify` (`prettier --check .`, `eslint .`) vẫn quét file không phải `.md` dưới `docs/` (ngoài `docs/design/`): PR docs chép mã probe vào `docs/` merge không CI, rồi `main` đỏ | CL2-D1 | L / — → **L** | ✅ `.prettierignore`, `eslint.config.js:7–14`, `pr-core.mjs:36–41` | Có từ trước (ADR-0015) |

### 3.2 Nit (10)

| R2 | Vấn đề | Ai thấy | Mức (CL / CX → chốt) | Kiểm | Nguồn gốc |
|---|---|---|---|---|---|
| 08 | Đã đọc được mã HTTP nhưng đọc thân lỗi hỏng (đóng sớm, gzip hỏng, treo giữa thân) thì cả lời gọi thành `AI_NETWORK` / `AI_TIMEOUT`, mất mã: 401 / 429 báo "Không kết nối được" | CL2-B2, CX2-B1 | N / L → **N** | ✅ `ai.rs:387–395` | Có từ trước; #503 chỉ giữ mã khi thân > 2 MB |
| 13 | `optionalText` không chặn NUL: lệnh lịch hẹn (`triggerNote`, `nextStep`, lý do dời, `note`) lưu chuỗi bị sql.js cắt tại NUL mà không báo. Nhập backup thì đã chặn | CL2-A4, CX2-A2 | N / L → **N** | ✅ `common.ts:33–36`, `appointments.ts:235, 278, 296, 309, 360` | Phase 2–3, không phải code Phase 5 |
| 14 | Lưu key **lỗi** cũng bật `acted`, nên trạng thái key đúng về sau bị bỏ: không thấy "Đã có key" / nút Xóa tới khi mở lại mục AI | CX2-C5 | — / N → **N** | ✅ `SettingsAi.tsx:150–185` | Mới do #502 → DR5-37 HỒI QUY |
| 15 | Ca test "spaces around a frame line" chỉ thêm khoảng trắng quanh một dòng khung, dòng kia giữ nguyên: bỏ `trim()` hay đổi thứ tự kiểm `OWN_MESSAGE` / `TOO_LONG` vẫn 24 / 24 xanh | CL2-A3 | N → **N** | 🧪 `web.test.ts:276–279` | Test mới của #497 |
| 16 | `content: null` + `finish_reason: "length"` (model suy luận hết `max_tokens`) ra `AI_BAD_RESPONSE`, mất `finish_reason`; đúng chữ spec §5.3, ghi để #492 không phải sửa Rust lần nữa | CL2-B4 | N → **N** | ✅ `ai.rs:239` | Có từ trước |
| 17 | Kết quả "0 đề xuất" là `<p role="status">` sinh cùng lúc với chữ, không nằm trong vùng live có sẵn như kết quả có đề xuất (PLAUSIBLE: chưa thử trình đọc màn hình thật) | CL2-C4 | N → **N** | ✅ `KycExtraction.tsx:100–102, 129–134` | Mới do #504 |
| 18 | Phần TSX của 4 mục sửa không có test đỏ khi đưa về cũ: badge web ở lịch hẹn (42), `SourceBadge` trong phiên (45), `kyc.meta` / `kycNote.sub` theo vị trí (48) | CL2-C5 | N → **N** | 🧪 📏 mutate (e2e 0 đỏ) | Mới do #504, #505; cùng loại DR5-34 (#493) |
| 19 | Skill `review-pr`: "PR chỉ sửa docs (`docs/**`, `*.md`) → mức low, bỏ Correctness" mâu thuẫn với `CODE_DOCS` và với dòng `docs/golden/**` → high của chính bảng | CL2-D2 | N → **N** | ✅ `.claude/skills/review-pr/SKILL.md:62, 66` | Có từ trước |
| 20 | Link "Xem ở Dữ kiện KYC →" ở cổng CONFLICT_RESOLUTION (2b) chỉ cuộn, focus ở lại link | CL2-C6 | N → **N** | ✅ `KycIntelligence.tsx:93–102` | Có từ trước |
| 21 | `pr-core.test.mjs` giữ `ci.yml` ↔ `CODE_DOCS` khớp nhau, không giữ `CODE_DOCS` khớp các file `.md` mà test thật sự đọc (thêm test so nguyên văn tài liệu khác, hay đổi tên `ai-eval.md`, không đỏ) | CL2-D3 | N → **N** | 🧪 `tools/pr-core.test.mjs:80–96` | Test mới của #496 |

**Tổng: 21 vấn đề** (11 Low + 10 Nit).

### 3.3 Đếm theo bên

| | Claude | Codex |
|---|---|---|
| Phát hiện mới (ID riêng của bên) | 17 (A 4, B 4, C 6, D 3) | 11 (A 2, B 4, C 5, D 0) |
| Mức tự gán: Low / Nit | 7 / 10 | 10 / 1 |
| Số vấn đề (trong 21) bên đó thấy | **17** | 11 |
| Chỉ bên đó thấy | **10** (R2-04, 06, 12, 15, 16, 17, 18, 19, 20, 21) | **4** (R2-02, 07, 10, 14) |
| Cả hai thấy | 7 (R2-01, 03, 05, 08, 09, 11, 13) | |
| PLAUSIBLE | 1 (R2-17) | 0 |
| Thời gian | A 01:15–01:40 · B 01:41–02:00 · C 02:00–02:40 · D 02:37–02:58 (≈ 1 h 45) | A 01:2x–01:43 · B ≈01:45–02:09 · C 02:10–02:32 · D 02:38–02:57 (≈ 1 h 35) |

- Claude thấy nhiều hơn, chủ yếu Nit về test / trợ năng / CI. Codex thấy 4 điều Claude bỏ sót, trong đó **2 có trọng lượng**: R2-02 (đối chiếu quyết định Owner chứ không chỉ Issue) và R2-10 (chạy hết đường Rust → DB → backup thay vì dừng ở Rust).
- Codex gán mức cao hơn ở các mục cả hai cùng thấy (R2-08, 09, 13: Low thay Nit) — cùng xu hướng vòng 1 nhưng chênh nhỏ hơn nhiều (vòng 1: 11 / 12 Medium của Codex bị hạ).

## 4. Điểm khác nhau và đánh giá

### 4.1 Chênh kết luận và mức

- **Bảng R (Claude 35 / 35 ĐÃ SỬA, Codex 27 / 6 / 2):** Claude coi biến thể gần là phát hiện riêng, giữ DR5 ở ĐÃ SỬA khi đường vòng 1 báo đã hết. Codex hạ DR5 xuống SỬA MỘT PHẦN khi còn biến thể. Phiên tổng hợp dùng thước ở §2: chỉ hạ khi phần **trong mô tả DR5 hoặc quyết định Owner** chưa làm. Theo đó:
  - Theo Codex ở **15** (cùng một phân tích CURRENT, hai nơi hiện, một nơi chưa sửa — trục C "hai chỗ cùng tính một thứ"), **24** (DR5-24 ghi đúng "`post()` không có test đỏ"), **40** (quyết định Owner gồm cả ghi chú), **05** và **37** (HỒI QUY: phần sửa làm hỏng chỗ trước đó đúng — trước #503 `finish_reason` không sang webview; trước #502 trạng thái key về sau lưu lỗi vẫn hiện).
  - Theo Claude ở **27**, **28**, **49 (a)**: các điểm trong mô tả DR5 đã hết; phần còn hở là biến thể mới (R2-03, 08, 09, 10).
- **R2-09 (`finish_reason`) Nit → Low:** cùng mô hình đe dọa với DR5-28 mà Owner đã chấp nhận ở mức Low; trái doc comment `ai.rs:240` ("The webview must never get the key"). Hôm nay JS chưa lưu trường này, nhưng #492 sẽ bắt đầu đọc nó.
- **R2-08, R2-13 Low → Nit:** chỉ sai câu chẩn đoán (R2-08, cần proxy trả lỗi với thân hỏng) / không phải code Phase 5, bàn phím và clipboard Windows không đưa được NUL vào ô (R2-13).

### 4.2 Tưởng mâu thuẫn: key viết bằng escape JSON

Claude B (dòng DR5-28): "key viết bằng escape JSON → `AI_BAD_RESPONSE`". Codex B (CX2-B3): "key Unicode-escape qua guard". Kiểm `ai.rs:236–243`: Rust parse thân trả lời bằng `serde_json` rồi mới so `content.contains(key)`. Escape ở **lớp ngoài** (chuỗi `content` của API) bị serde giải trước khi so → bị chặn (phép thử của Claude). Escape **bên trong** chuỗi `content` (chữ `\u0073\u006b…` nằm trong JSON phân tích mà model trả) vẫn là chữ thường với Rust, chỉ được giải ở `JSON.parse` của webview → qua (phép thử của Codex). Cả hai đúng; Claude có thử biến thể hoa / thường / URL-encode nhưng xếp vào "đã xét, không báo" vì chỉ hiện trên màn của người nhập key — Codex chỉ ra được hậu quả xa hơn (vào DB, backup). Giữ Low như DR5-28: cần gateway TLS hợp lệ phản chiếu key **và** mã hóa lại nó.

### 4.3 Điều chỉ một bên thấy

- **Codex, Claude bỏ sót:** R2-02 (Claude C đối chiếu Issue #489 và mockup 2d, không đối chiếu chữ "panel / ghi chú" của câu hỏi §8.7); R2-07 (Claude C xét "phiên web không qua được `replace`" nhưng không xét job trích xuất sống qua lần rời màn); R2-14 (Claude chỉ gỡ sửa DR5-37, không thử nhánh lưu lỗi).
- **Claude, Codex bỏ sót:** R2-04 (biến thể ở lần thử 2), R2-06 (trợ năng câu từ chối), R2-12 (đúng loại DR5-57 qua đường khác; ảnh hưởng trực tiếp tới chính PR này), các Nit test / trợ năng.

### 4.4 Ghi nhận thêm

- R2-12 đã áp ngay cho PR này: chỉ chép `.md` vào `raw/2026-10-11/`, như tiền lệ 10/10.
- Claude C ghi `appointments.spec.ts:848` đỏ 1 / 3 lượt khi chạy 4 spec × 4 worker, 36 / 36 xanh khi chạy riêng; Codex D có 1 ca đỏ do hostname harness (`127.0.0.1` thay `localhost`). Cả hai không phải lỗi sản phẩm; không tạo Issue. Ghi vào sổ review nếu gặp lại trên CI.
- Không bên nào nâng mức mục KNOWN. Codex đo lại `extractJson` với 20 000 `{`: ≈ 466 ms (KNOWN DR5-04, #492).

## 5. KNOWN

Giữ nguyên `common-known.md`: #488 (eval), #491 (G5: 01, 02, 08, 23, 49 b), #492 (parser / runner: 04, 05 phần `ai`, 06, 07, 09), #493 (test: 03, 12, 17, 34, 60, 61), #494 (bloat: 10, 11, 18, 19, 51), S-2, các mục sổ review. Không có "KNOWN đã sửa", không có bằng chứng hậu quả nặng hơn.

## 6. Đề xuất

Không có gì chặn G7. Ba phương án:

| | Làm gì trước G7 | Cỡ | Ghi chú |
|---|---|---|---|
| A | Không gì; mọi R2 vào Phase 6 | 0 | Nhanh nhất; exe G7 mang R2-09, R2-14 (lỗi do chính đợt sửa sinh ra) |
| **B (khuyến nghị)** | Khép đợt sửa 10/10: 2 Issue | ≈ 60–80 dòng SP + test | Mọi lỗi do đợt sửa sinh ra hoặc làm thiếu so với quyết định Owner được khép trước exe G7; phần còn lại vào Issue Phase 6 đã có |
| C | Sửa hết 21 mục | ≈ 200 dòng SP, 4–5 Issue | Như 06/10; R2-04 cần sửa spec (G1 nhỏ), R2-03 hợp với chuẩn hóa của đợt G5 hơn |

**Phương án B — chi tiết:**

1. **Issue UI (`risk:med`):** R2-01 (truyền `facts` ở lịch hẹn; nên bỏ giá trị mặc định `[]` của `analysisContent` để TypeScript bắt nơi gọi thiếu) · R2-02 (câu `AI_BUSY` ở ghi chú khi nút tắt vì bận nơi khác — chữ đã duyệt G3 ở mockup 2d) · R2-07 (chụp thế hệ DB vào job trích xuất, bỏ đề xuất khi thế hệ đổi) · R2-14 (lưu / xóa key lỗi thì đọc lại trạng thái). Ước ≈ 40–50 dòng SP + test.
2. **Issue Rust (`risk:med`, `build-exe`):** R2-09 (`finish_reason` chỉ nhận từ ngắn `[a-z_]`, ≤ 32 ký tự, còn lại `None`) · R2-08 (non-2xx giữ mã dù đọc thân lỗi) · R2-11 (test đi qua `post()` thật bằng agent tiêm vào; test `key_entry()` trả entry `Local`) · R2-16 nếu tiện (`content: null` + `length` → `content: ""`). Ước ≈ 15–25 dòng SP + 80–120 dòng test. G7 đằng nào cũng build exe.

**Xếp phần còn lại (cả A và B):**

| Đi đâu | Mục |
|---|---|
| #491 T-197 (đợt G5) | R2-03 (chuẩn hóa dòng khung cùng cách chuẩn hóa V3–V6), R2-04 (thêm nửa câu spec §3.1 mục 3) |
| #492 T-199 | R2-10 (quyết định: chặn biểu diễn escape ở Rust, hay ghi nhận là giới hạn đã chấp nhận), R2-16 (nếu không làm ở B) |
| #493 T-200 | R2-15, R2-18, R2-21 |
| Issue mới Phase 6 "trợ năng AI" | R2-05, R2-06, R2-17, R2-20 |
| Issue mới Phase 6 tools nhỏ | R2-12 (thêm `docs/**` vào `.prettierignore` và `ignores` của eslint, test giữ ba nơi khớp), R2-19 |
| Lần chạm sau của `common.ts` | R2-13 |

## 7. Câu hỏi cho Owner

1. **Phương án A / B / C** (§6)? Khuyến nghị B.
2. **R2-10:** chặn thêm biểu diễn escape / URL-encode của key ở Rust (≈ 40–80 dòng, #492), hay ghi nhận là giới hạn đã chấp nhận cùng lý do hạ mức DR5-28?
3. **R2-04:** coi tin nhắn "Copy yêu cầu sửa" dán lại là `OWN_MESSAGE` (không tính lần thử)? Cần thêm nửa câu vào spec §3.1 mục 3 (G1 nhỏ); đề xuất làm cùng đợt G5 (#491).
4. **Trợ năng (R2-05, 06, 18, 21):** gộp một Issue Phase 6, hay gộp vào #493?

## 8. Tuân thủ quy trình

- Hai bên làm trên đúng SHA `705ea7c`, đầu và cuối phiên; worktree review cuối phiên sạch (Codex còn `.agents/`, `.codex/`, `AGENTS.md` có sẵn). Không bên nào gọi AI thật, đọc key của app, hay mở chatgpt.com; mục Credential Manager tạm của cả hai đã xóa.
- Độc lập: Claude ghi không mở `codex\`; Codex ghi không đọc báo cáo vòng 2 của Claude. Không bên nào dẫn ID của bên kia.
- 9 PR đợt sửa (Claude D đã kiểm): `REVIEW: PASS` mới nhất trùng head lúc merge 9 / 9; ba PR `risk:med` merge bằng `--owner`; CI xanh; milestone Phase 5: 0 Issue mở. Artifact exe ở `705ea7c` (run `38074144272`).
- Phiên tổng hợp đọc đủ 8 báo cáo và kiểm mọi phát hiện trên code `705ea7c` (đọc code; không chạy lại probe — bằng chứng chạy là của reviewer, ghi 📏).

## 9. Quyết định Owner (11/10/2026)

1. **Phương án B.** Trước G7 (milestone Phase 5): #507 T-203 (UI: R2-01, 02, 07, 14) và #508 T-204 (Rust: R2-08, 09, 10, 11).
2. **R2-10: chặn thêm.** Kiểm key ở Rust chặn cả dạng escape JSON / URL-encode; làm trong T-204 (không để #492 như §6 đề xuất, vì là sửa Rust và G7 đằng nào cũng build exe).
3. **R2-04: đồng ý**, làm cùng đợt G5 #491 (kèm nửa câu spec §3.1 mục 3).
4. **Trợ năng: một Issue riêng** — #509 T-205 (R2-05, 06, 17, 20).

Phần còn lại đã ghi vào thân Issue Phase 6: #491 (R2-03, 04), #492 (R2-16, được sửa nhánh `content: null` trong `ai.rs`), #493 (R2-15, 18, 21), #494 (R2-13), #510 T-206 (R2-12, 19). Không mục nào chỉ nằm trong bản tổng hợp này.
