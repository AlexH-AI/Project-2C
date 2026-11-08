# Issue và PR sửa sau lượt 5 — deep review Phase 1–6, lượt 6

Dựng ở bước chuẩn bị (`plan.md` §L6.9 bước 4), 07/11/2026 10:55 +07:00, máy `DESKTOP-KDURKJP`, bằng `gh issue view` / `gh pr view --json` trên `AlexH-AI/Project-2C` (tải lúc 2026-11-07T03:55:36.244Z); sổ ghi chú đọc ở SHA ghim `5b1328a`. Nguyên văn thân 22 Issue của hai bảng `plan.md` §L6.2 (đợt sửa lượt 5, mục sổ G7 sau đợt sửa), cùng thân mọi PR của chúng (22 PR). Thân PR chép cả, như lượt 4–5: PR theo mẫu PR ("Thay đổi", "Test chấp nhận", "Ghi chú OPEN liên quan", "Kiểm tra"), phần lệch so với Issue / chưa làm / sửa sau review nằm trong các mục đó khi PR có. Sau thân PR là nguyên văn các nhóm RESOLVED của `docs/state/review-notes.md` mà Issue đó gom (14 nhóm, theo nhãn "— T-xxx (" ở dòng đầu nhóm), để thử biến thể gần (`plan.md` §L6.4, bảng R). Issue không có nhóm nào: T-363, 364, 365, 366, 368, 369, 370, 379. Tiêu đề trong thân đã hạ hai cấp để lồng dưới mục của file này; chữ giữ nguyên.

Kiểm khi dựng: Issue đều CLOSED, PR đều MERGED, commit merge của mỗi PR trùng cột Commit của bảng §L6.2 và nằm trong lịch sử của `5b1328a`. Các Issue sau bảng §L6.2 (T-385 kế hoạch, T-386 review-pr / mẫu Issue và PR, T-387 và T-388 `dot2.mjs` lượt 6) không ở đây: T-386 đổi quy trình (`.github/ISSUE_TEMPLATE/task.yml`, skill, mẫu PR), không sửa vấn đề lượt 5; ba Issue kia chỉ sửa tài liệu của lượt 6.

| Bảng §L6.2 | Issue | Tiêu đề | PR (commit merge) | Nhóm RESOLVED |
|---|---|---|---|---:|
| Đợt sửa lượt 5 | #1045 | T-363: Lượt 5 L5-A: test byName giữ sửa DR6-136, nhãn model hỏi trống bằng normalizeText (DR6-158, 159) | #1063 (`75601dc`) | 0 |
| Đợt sửa lượt 5 | #1046 | T-364: Lượt 5 L5-B: test hợp đồng capability đủ, hàng đợi lưu không chồng lượt, nhánh chết app-data (DR6-161…163) | #1064 (`292a63e`) | 0 |
| Đợt sửa lượt 5 | #1047 | T-365: Lượt 5 L5-C: Mock trích xuất (worded, "bé", gạch "–"), rule test-support, khung dán ChatGPT web trống (DR6-164, 166…168) | #1066 (`509b785`) | 0 |
| Đợt sửa lượt 5 | #1048 | T-366: Lượt 5 L5-D: bộ chặn ký hiệu bắt đủ ký hiệu, escape, thực thể HTML, dấu nối JSX, bỏ báo nhầm (DR6-169) | #1068 (`31f7fc2`) | 0 |
| Đợt sửa lượt 5 | #1049 | T-367: Lượt 5 L5-E: chuỗi liền dài ở chín chỗ và e2e quét mọi màn (DR6-170, 174c) | #1070 (`dd5ae56`) | 1 |
| Đợt sửa lượt 5 | #1050 | T-368: Lượt 5 L5-F: tên nút khôi phục, luật nhập mã KH, hai ô tìm, hộp HĐ, e2e 10a và Thùng rác (DR6-160, 172…174ab) | #1072 (`e9f2eb1`) | 0 |
| Đợt sửa lượt 5 | #1051 | T-369: Lượt 5 L5-G: công cụ: test notes-core / auto-wait / review-hint, ci --since, metRows của probe (DR6-175…177) | #1056 (`234eb9e`) | 0 |
| Đợt sửa lượt 5 | #1052 | T-370: Lượt 5 L5-H: tài liệu nghiệm thu (7c, NT-AI-17) và mốc Mock trích xuất (DR6-165, 171) | #1074 (`bfc9f47`) | 0 |
| Mục sổ G7 | #1054 | T-371: Tổng hợp lượt 5: đếm chênh mức khớp bảng §5.1 (review #1044) | #1075 (`89028f8`) | 1 |
| Mục sổ G7 | #1058 | T-372: Probe: đổi tên biến status trong metRows (review #1056) | #1077 (`42f29a5`) | 1 |
| Mục sổ G7 | #1059 | T-373: auto-wait ci --since: run failure không có check đỏ thì báo đỏ (review #1056) | #1061 (`f4490e1`) | 1 |
| Mục sổ G7 | #1079 | T-374: Mục sổ G7: hàng đợi lưu idle() chờ hết lượt ghi, ca capability kiểm đủ nguồn quyền (review #1064) | #1090 (`bf8dee7`) | 1 |
| Mục sổ G7 | #1080 | T-375: Mục sổ G7: một luật câu dán trống, Mock nhận "đứa / thằng … đã mất", rule test-support chung (review #1066) | #1086 (`e0806b8`) | 1 |
| Mục sổ G7 | #1081 | T-376: Mục sổ G7: dọn nhỏ bộ chặn ký hiệu, trần tên ô bảng và khung SelectField (review #1068, #1070) | #1092 (`64720db`) | 1 |
| Mục sổ G7 | #1082 | T-377: Mục sổ G7: Thùng rác tách tên nút khôi phục (giây, team trùng tên), searchText về domain, e2e hộp 8b (review #1072) | #1088 (`20c51e3`) | 1 |
| Mục sổ G7 | #1083 | T-378: Mục sổ G7: auto-wait ci lấy kết luận failure của run pull_request mới nhất làm sàn khi không --since (review #1061) | #1103 (`ebee006`) | 1 |
| Mục sổ G7 | #1085 | T-379: auto-issues: phiên điều phối không đứng chờ khi tin báo của phiên con bị giữ hoặc GitHub lỡ push | #1104 (`88848b9`) | 0 |
| Mục sổ G7 | #1094 | T-380: Mục sổ G7: dòng lý do TR-1 và ô "Thuộc" nêu giờ xóa của team khi Thùng rác có hai team cùng tên (review #1088) | #1097 (`5d07d5e`) | 1 |
| Mục sổ G7 | #1095 | T-381: Mục sổ G7: ca capability kiểm config gộp lúc build (--config / TAURI_CONFIG), helper chung cho hai ca listener của hàng đợi lưu (review #1090) | #1099 (`b2ef4c1`) | 1 |
| Mục sổ G7 | #1101 | T-382: Mục sổ G7: một helper cho vế "xóa lúc" của Thùng rác, ca capability lọc đúng lệnh tauri, kiểm run: của workflow và [env] của Cargo (review #1097, #1099) | #1109 (`4d38a72`) | 1 |
| Mục sổ G7 | #1107 | T-383: Mục sổ G7: auto-wait đọc nhánh 404 vẫn chờ push, hàng "GitHub chưa thấy" chờ head kẹt bằng ci --not, ca test cancelled không --since, kết quả chạy thật auto-issues | #1113 (`5e03403`) | 1 |
| Mục sổ G7 | #1111 | T-384: Mục sổ G7: ca hợp đồng capability nhận mọi cách gọi CLI tauri (npx @tauri-apps/cli, .bin/tauri, tauri.cmd) | #1115 (`a53a1d8`) | 1 |

---

# Issue #1045 — T-363: Lượt 5 L5-A: test byName giữ sửa DR6-136, nhãn model hỏi trống bằng normalizeText (DR6-158, 159)

Trạng thái: CLOSED · nhãn: type:task, risk:med, status:in-progress, ready-for-agent

##### Mục tiêu

Nhóm **L5-A** của đợt sửa lượt 5 (lõi dữ liệu, gói A):

1. **DR6-158 — không test nào giữ phần sửa của DR6-136 (`byName`).**
   - (a) Đổi `name-order.ts` về bản `2e51e25` (đúng lỗi DR6-136: sắp bảng Lịch hẹn 10 255 dòng chậm ×6) thì cả 1 477 test `domain` + `db` vẫn xanh: phần sửa là sửa hiệu năng mà không có ca nào giữ chi phí.
   - (b) Ca 20 002 tên ("sorts more names than it keeps the keys of in the same order") chỉ phủ dòng. Tên của ca cho cùng thứ tự với tên trần, nên đột biến "quá trần thì trả tên trần" sống. Đột biến đó đưa lại đúng lỗi DR6-112 (thứ tự đi vòng với tên trộn chữ số) cho mọi tên sau 20 000 tên đầu của phiên.
   - Thêm hai ca:
     - lấp bộ nhớ khóa quá trần bằng tên khác rồi sắp 2 022 tên của ca DR6-112, nhiều lần xáo, đòi một thứ tự;
     - một ca giữ chi phí: đếm số lần tính khóa theo số tên khác nhau (qua một seam), hay ca thời gian bền với runner chậm như T-339 (so với collator trần cùng lần chạy). Chọn trong task, thân PR ghi cách chọn và lý do.
2. **DR6-159 — `isLabel` hỏi "trống" bằng `trim()`.** `trim()` không bỏ U+200B / U+2060 / U+0085 / U+3164 / U+180E. Nhãn model chỉ gồm các ký tự đó qua lệnh `recordAiAnalysis` và luật nhập 12; lịch sử phân tích hiện ô model rỗng. Mọi chỗ khác của app hỏi "trống" bằng `normalizeText` (K20, K25, DR6-150). Sửa: `isLabel` hỏi "trống" bằng `normalizeText`. Lệnh và luật nhập 12 cùng đổi vì cùng gọi `isLabel`. Dữ liệu giả lập nạp lại (quy tắc R2-02 / K1); không migration, không UI cho dữ liệu cũ.

##### Bối cảnh

- Deep review Phase 1–6 lượt 5: tổng hợp T-362 #1042, PR #1044, §6.1 (DR6-158, 159) và §8.2 (nhóm L5-A). Báo cáo gốc ở PR #1043 (`docs/reviews/raw/2026-11-05/`).
- Owner 04/11 chốt sửa hết trước G7 (K47). Owner 05/11 đồng ý cả 4 đề xuất §9 của tổng hợp (không câu nào về nhóm này).
- DR6-158 mới do #907 (T-319); DR6-159 có từ trước. Chỉ file backup sửa tay đi vào được DR6-159 (model chọn trong danh sách đóng).

##### Tài liệu cần đọc

- `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md` §6.1 (DR6-158, 159), §8.2 (L5-A)
- `docs/reviews/raw/2026-11-05/claude/A.md` (CLR5-A2: đột biến `R136-old-file`, `R136-past-max-raw`, probe `byname-past-max`; CLR5-A3), `docs/reviews/raw/2026-11-05/codex/A.md` (CXR5-A3: chốt đếm khóa 246 782 ≠ 1 269)
- `packages/domain/src/name-order.ts` (`keys`, `MAX_KEYS`, `keyOf`, `byName`), `packages/domain/src/name-order.test.ts`
- `packages/db/src/common.ts` (`isLabel`, `readsBackAsIs`), `packages/db/src/ai-analyses.ts` (lệnh, `analysisLabelsFit`), test của chúng
- `packages/domain/src/money.test.ts` (ca "reads a long run of spaces quickly": mẫu đo thời gian bền với runner chậm), `packages/ai/src/mock-extraction.test.ts` (bảng 36 000 ký tự của T-339)

##### File / thư mục được phép sửa

- `packages/domain/src/name-order.ts` (chỉ seam đếm, nếu chọn cách đếm), `packages/domain/src/name-order.test.ts`
- `packages/db/src/common.ts`, `packages/db/src/common.test.ts`, `packages/db/src/ai-analyses.test.ts`, `packages/db/src/backup-invariants.test.ts`, `packages/db/src/backup.test.ts`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `37a80b6`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

- `byName` giữ chữ ký và thứ tự. Seam đếm (nếu có) chỉ cho test, không vào `index.ts`.
- `isLabel` và luật nhập 12 từ chối thêm nhãn chỉ có ký tự vô hình; nhãn hợp lệ (gồm biên 100 code unit) như cũ.

##### Test chấp nhận

- [ ] Ca mới đỏ với đột biến "quá trần thì trả tên trần" (`R136-past-max-raw` của Claude A) và với cả file `name-order.ts` của `2e51e25` (`R136-old-file`). Thân PR ghi cách thử và kết quả.
- [ ] Sắp 10 255 lịch hẹn của dữ liệu tải theo KH vẫn cùng thứ tự, thời gian như lượt 5 (≈ 11 ms Node).
- [ ] Nhãn model chỉ gồm một ký tự U+200B, U+2060, U+0085, U+3164 hay U+180E (trong test viết bằng escape Unicode) → lệnh `recordAiAnalysis` từ chối (`AI_ANALYSIS_INVALID`) và nhập backup từ chối (`BACKUP_INVALID {rule:12}`). `glm-5.3`, nhãn hợp lệ 100 code unit có cặp surrogate như cũ.
- [ ] Seed và dữ liệu tải giữ hash `tables` (`e256e4f1…`).
- [ ] `pnpm verify` xanh.

Ước lượng: ≈ 1–5 dòng SP + ≈ 40 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med (luật nhập 12 đổi, như #907)

##### Bị chặn bởi

Không

## PR #1063 — fix: read a blank model label as normalizeText does, guard the byName key cache (T-363)

Trạng thái: MERGED · merge 2026-11-05T12:08:41Z · commit `75601dccce9a4e5d5d13668d518481d1abd3a118` · nhánh `task/T-363-byname-guard-label-blank` · nhãn: risk:med

Closes #1045

Phiên code: coding-ses1 (auto-issues)

#### Thay đổi

Nhóm L5-A của đợt sửa lượt 5 (DR6-158, DR6-159).

- **DR6-159** — `isLabel` (`packages/db/src/common.ts`) hỏi "trống" bằng `normalizeText` thay cho `trim()`, như mọi chỗ khác của app. Lệnh `recordAiAnalysis` và luật nhập 12 (`analysisLabelsFit`) cùng đổi vì cùng gọi `isLabel`: nhãn model chỉ gồm U+200B / U+2060 / U+0085 / U+3164 / U+180E giờ bị từ chối. Dữ liệu giả lập nạp lại (R2-02 / K1); không migration, không UI cho dữ liệu cũ.
- **DR6-158** — hai ca mới ở `packages/domain/src/name-order.test.ts`, mỗi ca chạy trên một bản module mới (`vi.resetModules()` + `import()`), tức một phiên chưa giữ khóa nào, nên không phụ thuộc thứ tự chạy các ca:
  - "sorts the 2 022 names one way after a session read 20 000 others": đọc 20 002 tên khác (lấp bộ nhớ khóa quá trần), rồi sắp 2 022 tên của ca DR6-112 (tách thành hằng `MIXED`, ca cũ dùng chung) 20 lần xáo, đòi một thứ tự và đúng thứ tự của module chung;
  - "works the key of a name out once, however many times a sort reads it": sắp 10 255 dòng của 1 000 KH (nửa có số toàn khổ), đòi đúng 1 000 lần tính khóa.
- `name-order.ts` **không đổi**: không cần seam mới.

##### Ca giữ chi phí: chọn đếm, không chọn thời gian

- **Cách đếm:** mỗi lần tính khóa thử tên với `LATIN` đúng một lần (`LATIN.test(name)` trong `keyOf`); `LATIN` đã export sẵn (ca "skips no digit to read" dùng). Ca spy `LATIN.test` của bản module mới: số lần gọi = số lần tính khóa.
- **Lý do:**
  - Số đếm xác định, không phụ thuộc runner. Ca thời gian dù so với collator trần cùng lần chạy vẫn có nhiễu: GC, JIT, coverage V8 của `pnpm verify`. Biên an toàn ở đây là 1 000 so với 246 578.
  - Bản tổng hợp §8.2 cũng nêu cách này ("bền với runner chậm hơn ca thời gian").
  - Không thêm dòng SP nào chỉ để test.
- **Đổi lại:** ca gắn với việc `keyOf` thử `LATIN` một lần cho mỗi khóa. Một refactor bỏ `LATIN.test` khỏi `keyOf` làm ca đỏ (0 ≠ 1 000) chứ không xanh im lặng, nên người sửa phải nhìn lại ca này.

#### Test chấp nhận

- [x] **Ca mới đỏ với `R136-past-max-raw` và với `R136-old-file`.** Cách thử: chép `name-order.test.ts` của nhánh và từng bản `name-order.ts` vào thư mục tạm ngoài repo, nối `node_modules`, chạy `vitest run` trên từng bản:
  - bản của nhánh: 11 / 11 xanh;
  - `R136-old-file` (`git show 2e51e25:packages/domain/src/name-order.ts`): 1 đỏ, 10 xanh. Đỏ ở ca đếm: `expected "test" to be called 1000 times, but got 246578 times` (Codex lượt 5 đếm được 246 782);
  - `R136-past-max-raw` (`if (keys.size >= MAX_KEYS) keys.clear();` → `if (keys.size >= MAX_KEYS) return name;`): 1 đỏ, 10 xanh. Đỏ ở ca "sorts the 2 022 names one way after a session read 20 000 others": hai lần xáo cho hai thứ tự khác nhau.
- [x] **Sắp 10 255 lịch hẹn của dữ liệu tải theo KH vẫn cùng thứ tự, thời gian như lượt 5.**
  - Cách đo: script tạm qua `tools/ts-hooks.mjs`. Dữ liệu tải mặc định; lịch sống của KH sống, sắp theo tên KH rồi giờ; trung vị 41 lần, Node v24, Home PC.
  - Thời gian: `byName` của nhánh **11,96 ms**; `2e51e25` 66,62 ms; collator trần 8,68 ms (lượt 5: Claude 11,19, Codex 11,45).
  - Thứ tự của nhánh trùng `2e51e25` và trùng collator trần.
- [x] **Nhãn model chỉ gồm một ký tự U+200B, U+2060, U+0085, U+3164 hay U+180E bị từ chối** (test viết bằng escape Unicode):
  - lệnh `recordAiAnalysis` → `AI_ANALYSIS_INVALID` (`ai-analyses.test.ts`, ca "refuses an analysis whose provider…");
  - `analysisLabelsFit` → `false` (ca "reads a model name at the import (rule 12)…");
  - nhập backup → `BACKUP_INVALID {rule:12}` (`backup-invariants.test.ts`, 5 ca "12: a model name of U+… alone");
  - `isLabel` có ca riêng ở `common.test.ts`.
  - Như cũ: `glm-5.3`, nhãn 100 code unit có cặp surrogate (lệnh, xuất → nhập, `analysisLabelsFit`). Trước khi sửa `isLabel`, đúng 8 ca mới đỏ.
- [x] **Seed và dữ liệu tải giữ hash `tables`.** Cùng script, chạy trên `main` `c0c4721` (worktree tạm, đã gỡ) và trên nhánh:
  - dữ liệu tải mặc định: `e256e4f18699f4a4e494b59a92ef46865eb4d2c9887f4ff1e7a6b872b4b345a2` cả hai;
  - seed demo (neo 2026-10-12, seed 1): `d805272565fb255bfa56248c4a808c10d94600bfb8ea8bf6161031b71c4d5074` cả hai.
- [x] `pnpm verify` xanh.

#### Ghi chú OPEN liên quan

Không có (`node tools/notes-for.mjs --diff` @ `c0c4721`: không ghi chú OPEN nào nêu các file của diff).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med` (luật nhập 12 đổi, như #907)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-363 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #1046 — T-364: Lượt 5 L5-B: test hợp đồng capability đủ, hàng đợi lưu không chồng lượt, nhánh chết app-data (DR6-161…163)

Trạng thái: CLOSED · nhãn: type:task, risk:med, status:in-progress, ready-for-agent

##### Mục tiêu

Nhóm **L5-B** của đợt sửa lượt 5 (lưu và hợp đồng bản dựng, gói B):

1. **DR6-161 — test hợp đồng bản dựng chỉ so mảng `permissions` của `capabilities/default.json`** (`tauri-contract.test.ts:338-356`). Tauri nạp mọi file `capabilities/**/*` khi `tauri.conf.json` không khai `app.security.capabilities`; khi có khai thì dùng danh sách đó, kể cả capability viết thẳng. Thêm file capability thứ hai, capability inline trong `tauri.conf.json`, hay `remote` / `windows` trong `default.json` đều để ca xanh. Bản web của e2e không có ACL, nên ca này là chốt chặn duy nhất của quyền webview (K37). Sửa ca:
   - liệt kê `capabilities/` đệ quy, đòi đúng một file `default.json`;
   - `tauri.conf.json` không có `app.security.capabilities`;
   - so cả object của `default.json` (`windows: ['main']`, không `remote`, đúng `permissions` như nay).
2. **DR6-162 — hàng đợi lưu: listener "lưu xong" gọi đồng bộ hai lệnh ghi thì hai lượt ghi chạy chồng.** `drain` đặt `running = undefined` trước khi gọi listener (`persist-queue.ts:99-100`). Lệnh thứ nhất mở một `drain` mới; lệnh thứ hai để `waiting`, và `drain` cũ lấy nó trong vòng `while (waiting)` (`:84`). Một lượt có thể bỏ cờ bận trong khi lượt kia còn giữ snapshot chưa lưu; đóng app lúc đó (`flush()` thấy `running` rỗng) để file thiếu thay đổi cuối. Listener của sản phẩm hiện không làm vậy. Sửa: một `drain` duy nhất lấy snapshot kế tiếp (hay `drain` cũ dừng khi `running` không còn là nó). Chọn trong task, thân PR ghi lý do.
3. **DR6-163 — nhánh `if (!storage) return;` ở đầu hàm ghi** (`app-data.ts:282`) không bao giờ chạy: `persist` chỉ được nối khi có `storage` (`:311-316`, `:349`). Coverage 0 / 262. Bỏ nhánh (kiểu cho phép), hay chú thích vì sao giữ.

##### Bối cảnh

- Deep review Phase 1–6 lượt 5: tổng hợp T-362 #1042, PR #1044, §6.2 (DR6-161, 162, 163) và §8.2 (nhóm L5-B). Báo cáo gốc ở PR #1043 (`docs/reviews/raw/2026-11-05/`).
- Owner 04/11 chốt sửa hết trước G7 (K47). Owner 05/11 đồng ý cả 4 đề xuất §9 (không câu nào về nhóm này).
- Cả ba có từ trước (DR6-161 từ #617). Quyền webview hiện đúng; hàng đợi của sản phẩm hiện không chồng (DeepSeek B K6).
- Không sửa `src-tauri/**`: ca hợp đồng chỉ đọc `capabilities/` và `tauri.conf.json`, nên không cần nhãn `build-exe`.

##### Tài liệu cần đọc

- `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md` §6.2, §8.2 (L5-B)
- `docs/reviews/raw/2026-11-05/claude/B.md` (CLR5-B1, đột biến CAP1–CAP4), `docs/reviews/raw/2026-11-05/codex/B.md` (CXR5-B2: probe listener lồng hai lệnh), `docs/reviews/raw/2026-11-05/deepseek/B.md` (DSR5-B1; K6)
- `apps/desktop/src/data/tauri-contract.test.ts`, `apps/desktop/src-tauri/capabilities/default.json`, `apps/desktop/src-tauri/tauri.conf.json` (chỉ đọc)
- `apps/desktop/src/data/persist-queue.ts` (`drain`, `flush`, `running`, `waiting`), `apps/desktop/src/data/app-data.ts` (hàm ghi `:275-320`, `inTurn`), `apps/desktop/src/shell/close-guard.ts`

##### File / thư mục được phép sửa

- `apps/desktop/src/data/tauri-contract.test.ts`
- `apps/desktop/src/data/persist-queue.ts`, `apps/desktop/src/data/persist-queue.test.ts`
- `apps/desktop/src/data/app-data.ts`, `apps/desktop/src/data/app-data.test.ts`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `37a80b6`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

- `createPersistQueue` (hay tên hiện tại) giữ chữ ký; `flush()` vẫn chờ mọi lượt ghi đã nhận, kể cả lượt nhận sau lời gọi.
- Quyền webview không đổi.

##### Test chấp nhận

- [ ] Ca hợp đồng đỏ với từng đột biến CAP1–CAP4 của Claude B: file capability thứ hai (cả trong thư mục con), capability inline trong `tauri.conf.json`, `remote` trong `default.json`, `windows` khác `['main']`. Thân PR ghi cách thử và kết quả.
- [ ] Ca hàng đợi: listener "lưu xong" gọi đồng bộ hai lệnh ghi (probe của CXR5-B2, giữ từng lần ghi) → không lúc nào có hai lượt ghi chạy cùng lúc; `flush()` gọi giữa chừng chờ tới khi file có mọi thay đổi. Ca đỏ trên code `37a80b6`.
- [ ] Mọi ca hiện có của `persist-queue` / `app-data` / `close-guard` xanh; `openAppData` + `flush` từ file 14,1 MB như lượt 5 (≈ 105 ms Node).
- [ ] Nhánh `app-data.ts:282` không còn, hay có chú thích; coverage không có nhánh chết mới.
- [ ] `pnpm verify` xanh.

Ước lượng: ≈ 10–25 dòng SP + ≈ 60 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med (hàng đợi lưu)

##### Bị chặn bởi

Không

## PR #1064 — fix: end a save drain once it lets the queue go, check every capability source (T-364)

Trạng thái: MERGED · merge 2026-11-05T12:47:09Z · commit `292a63ed141a74b3f1de271fc9455f4f0e1d44e4` · nhánh `task/T-364-persist-queue-capability-contract` · nhãn: type:task, risk:med

Closes #1046

Phiên code: coding-ses2 (auto-issues)

#### Thay đổi

Nhóm L5-B của đợt sửa lượt 5 (DR6-161, DR6-162, DR6-163).

- **DR6-161** — ca "allows the webview only the Tauri commands it uses" (`tauri-contract.test.ts`) giờ giữ mọi nguồn quyền của webview, không chỉ mảng `permissions`:
  - `src-tauri/capabilities/` liệt kê đệ quy phải đúng `['default.json']` (một file thứ hai, kể cả trong thư mục con, là đỏ);
  - trong `src-tauri/` chỉ có một file cấu hình Tauri, `tauri.conf.json`: `tauri.windows.conf.json` (Tauri gộp vào cấu hình khi dựng trên Windows) hay `Tauri.toml` là đỏ;
  - `tauri.conf.json` không có `app.security.capabilities` (danh sách đó thay thư mục, kể cả capability viết thẳng);
  - so **cả object** của `default.json`: `identifier: 'default'`, `windows: ['main']`, đúng 4 quyền như nay; một khóa thêm (`remote`, `webviews`, `platforms`, `local`…) là đỏ. `$schema` và `description` chỉ đòi là chuỗi (không đổi quyền).
- **DR6-162** — `persist-queue.ts`, `drain`: lượt ghi cuối đặt `running = undefined`, báo listener, rồi **dừng hẳn** (`if (last) return;`) thay vì quay lại `while (waiting)`. Listener nào ghi trong lúc được báo thì `persist` mở `drain` mới; `drain` đó là `running`, lấy mọi snapshot từ đó, và là cái `flush()` / `idle()` chờ.
- **DR6-163** — `app-data.ts`: bỏ nhánh `if (!storage) return;` ở đầu hàm ghi; `storage!.save(bytes)` kèm chú thích vì sao luôn có storage ở đó (chỉ `persist` của `open` khi có storage và `openFrom` khi có storage gọi `saves.persist`; `flush()` chỉ ghi lại một snapshot đã lỗi, tức đã từng ghi). Không dùng `storage?.save(bytes)`: một lần gọi sai sẽ im lặng bỏ lần lưu như nhánh cũ; với `!` nó ném `TypeError`, thành một lần lưu lỗi mà cảnh báo lưu hiện ra. Lint của repo cho phép `!` (có sẵn ở `trash-view.ts`, `kyc-view.ts`…).

##### Hàng đợi: chọn "`drain` cũ dừng", không chọn "một `drain` duy nhất"

- **Lý do:** `flush()` và `idle()` chờ `running`. Khi lượt ghi cuối đã nhả `running` và listener mở `drain` mới, `drain` mới mới là cái được chờ; `drain` cũ đi tiếp thì giữ một lượt ghi không ai chờ (đúng lỗi của CXR5-B2). Cho `drain` cũ dừng là đủ: 2 dòng SP, không thêm trạng thái.
- **Phương án kia** (giữ một `drain` lấy snapshot kế tiếp) phải chặn `persist` mở `drain` mới trong lúc báo listener: hoặc giữ `running` tới sau lúc báo, thì thay đổi "đã lưu" mà listener nghe vẫn nói `saving: true` (trái "one change, saved or failed, not two"); hoặc thêm cờ `notifying` rồi kiểm lại sau khi báo, thêm một trạng thái mà `flush()` cũng phải biết.
- **Hành vi không đổi:** listener chỉ đọc (của sản phẩm) hay chỉ ghi một lần: cùng thứ tự ghi, cùng số lần báo; snapshot chờ sau một lượt ghi vẫn gộp vào bản mới nhất.

#### Test chấp nhận

- [x] **Ca hợp đồng đỏ với từng đột biến CAP1–CAP4 của Claude B.** Cách thử: script tạm ở scratchpad (`mut-cap.mjs`) sửa thật file của checkout cho từng đột biến, chạy riêng ca này (`pnpm vitest run <file> -t "allows the webview only the Tauri commands it uses"`) trên test của nhánh và trên bản `git show main:…/tauri-contract.test.ts` chép tạm cạnh nó, rồi trả nguyên mọi file trong `finally` (`git status` sau đó chỉ còn 4 file của PR, không file thừa):

  | Đột biến | Test của `main` | Test của nhánh |
  |---|---|---|
  | đối chứng (không đổi) | xanh | xanh |
  | CAP1 `capabilities/extra.json` (`allow-maximize`, `allow-set-size`, `allow-close`) | **sống** | **đỏ** |
  | CAP1b cùng file ở `capabilities/sub/extra.json` | **sống** | **đỏ** |
  | CAP2 `app.security.capabilities: ["default", {capability inline}]` | **sống** | **đỏ** |
  | CAP3 `default.json` thêm `remote.urls: ["https://*"]` | **sống** | **đỏ** |
  | CAP4 `default.json` `windows: ["*"]` | **sống** | **đỏ** |
  | CAP5 `tauri.windows.conf.json` khai `app.security.capabilities` | **sống** | **đỏ** |

- [x] **Ca hàng đợi** "runs one write at a time when a listener told of a save saves twice, and flush() waits for both (DR6-162)" (`persist-queue.test.ts`). Probe của CXR5-B2 ở seam của hàng đợi:
  - Cách dựng: `fakeDisk` giữ từng lần ghi; listener nghe lần lưu `v1` xong thì gọi đồng bộ `persist(v2)` rồi `persist(v3)`; `flush()` gọi lúc `v2` còn chạy.
  - Ca đòi: `flush()` resolve khi file là `v3`, `maxInFlight` = 1, thứ tự ghi `v1, v2, v3`, cuối cùng `saving: false`.
  - **Đỏ trên code cũ** (`persist-queue.ts` không đổi từ `37a80b6` tới `75601dc`): `expected 'v2' to be 'v3'`: `flush()` xong khi file còn thiếu `v3`, và `v2`, `v3` ghi chồng nhau. Xanh sau khi sửa.
- [x] **Mọi ca hiện có xanh**: `persist-queue` / `app-data` / `close-guard` (trong `pnpm verify`).
- [x] **`openAppData` + `flush` từ file 14,1 MB như lượt 5.**
  - Cách đo: probe `p-open.mjs` của Claude B lượt 5 (`deep-review-1-6-r5\claude\B\`, `load13.db` 14 102 528 B) với `P2C_REPO` trỏ vào checkout của nhánh. Node v24, Home PC, 5 lần sau 1 lần khởi động.
  - Kết quả: trung vị **106,7 ms** (104,4–108,2); sự kiện `["backup"]`, không lưu. Lượt 5: 105,2 ms.
- [x] **Nhánh `app-data.ts:282` không còn; coverage không có nhánh chết mới.** `persist-queue.ts`: 12 / 12 nhánh được chạy; `app-data.ts`: 27 nhánh, 2 có đường không chạy, đều có từ trước và DSR5 đã liệt kê (`:324` `if (opening === mine)`, `:487` `??` của `openFolder`); `:282` không còn. Đọc từ `coverage/coverage-final.json` của `pnpm verify`.
- [x] `pnpm verify` xanh.

#### Ghi chú OPEN liên quan

Không có (`node tools/notes-for.mjs --diff` @ `75601dc`: không ghi chú OPEN nào nêu các file của diff).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Không sửa `src-tauri/**` (ca hợp đồng chỉ đọc `capabilities/` và `tauri.conf.json`), nên không cần nhãn `build-exe`.

Rủi ro: `risk:med` (hàng đợi lưu)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-364 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #1047 — T-365: Lượt 5 L5-C: Mock trích xuất (worded, "bé", gạch "–"), rule test-support, khung dán ChatGPT web trống (DR6-164, 166…168)

Trạng thái: CLOSED · nhãn: type:task, risk:med, status:in-progress, ready-for-agent

##### Mục tiêu

Nhóm **L5-C** của đợt sửa lượt 5 (AI, gói C):

1. **DR6-164 — phép thử chữ cái của `worded`** (`mock-extraction.ts:760-767`, `:780`) không ca nào giữ. Đổi nó thành "vế không ở vị trí 0" thì "1. Khách đã kết hôn.", "... Hai vợ chồng đã kết hôn, có 2 con." và mọi ghi chú mở bằng số thứ tự / "..." / "?" rồi "Khách / Hai vợ chồng / Chị nói" mất đề xuất, mà 701 / 701 ca Mock xanh. Thêm ca cho hai câu trên và đối chứng "Gặp. Khách đã kết hôn.".
2. **DR6-166 — Mock trích xuất bỏ lỡ đề xuất ở hai dạng** (hướng an toàn, Nit):
   - (a) Nhánh `otherDeaths` dùng `CHILD` trực tiếp (`:342-370`), nên "bé" nghĩa nhỏ cùng một chữ "mất" làm mất Số con. "KH có 3 con. Vụ mất điện ở căn nhà nhỏ bé." → không đề xuất ("… mất mát nhỏ." → 3). Sửa: ngoại lệ "bé nghĩa nhỏ" của luật 4 (#931) áp cả cho "dạng khác" của luật 3.
   - (b) `BULLET` (`:244`) chỉ nhận `-*•+` và "1)", không nhận gạch ngang U+2013. "– KH đã kết hôn" → không đề xuất. Sửa: `BULLET` nhận "–" theo cùng điều kiện khoảng trắng như "-".
   - Ghi hai điểm vào `docs/design/phase-5-ai.md` §10.
3. **DR6-167 — rule `ai-test-support-only-in-tests`** (`.dependency-cruiser.cjs:31-36`) chỉ xét `from` trong `packages/ai`, nên file sản phẩm của app desktop import được `packages/ai/src/test-support.ts` (có `vitest`) mà `lint:deps` xanh. Hợp đồng của Issue #960: chỉ test import file hỗ trợ test. Sửa: rule xét mọi file không phải test ở bên nhập (kể cả `apps/`); file test ở đâu cũng được. Repo hiện không có cạnh như vậy.
4. **DR6-168 — khung dán câu trả lời ChatGPT web hỏi "trống" bằng `trim()`** (`web.ts:145`, nút ở `KycWebSession.tsx:175`). Chuỗi chỉ có U+200B / U+2060 làm nút bật, rồi tính một lần thử (V1); hai lần ghi một dòng `ai_analyses` REJECTED không xóa được. Sửa: hỏi "trống" như mọi ô khác (bỏ ký tự vô hình theo tập K20 rồi cắt khoảng trắng; dùng hàm chuẩn của `domain` nếu `packages/ai` được phép import, nếu không thì hàm cùng tập ký tự có ca so với `normalizeText`), ở `checkWebAnswer` và ở nút. Sửa chữ spec §3.1 mục 3 cho khớp.
5. **DR6-165** theo Q2 (a) của Owner: **không đổi code Mock vì hiệu năng**; mốc ghi ở nhóm L5-H. Phần sửa 1, 2 không được làm Mock chậm hơn rõ (so số đo lượt 5: lần gọi đầu 28,5 ms, 3 551 ghi chú 103,5 ms).

##### Bối cảnh

- Deep review Phase 1–6 lượt 5: tổng hợp T-362 #1042, PR #1044, §6.3 (DR6-164…168) và §8.2 (nhóm L5-C). Báo cáo gốc ở PR #1043 (`docs/reviews/raw/2026-11-05/`).
- Owner 04/11 chốt sửa hết trước G7 (K47). Owner 05/11 đồng ý cả 4 đề xuất §9; Q2 (a): chấp nhận chi phí Mock, ghi mốc, không tối ưu.
- Luật Mock là K42 (Owner 01/11); đổi luật trong §10 theo hai điểm của mục 2 là phần sửa đã nêu ở tổng hợp, không phải luật mới.
- **Không G5:** không đổi prompt, validator hay danh sách chặn.
- DR6-164 mới (#917), DR6-166 (a) mới (#939), (b) trước, DR6-167 mới (#956), DR6-168 trước.

##### Tài liệu cần đọc

- `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md` §6.3, §8.2 (L5-C), §9 Q2
- `docs/reviews/raw/2026-11-05/claude/C.md` (CLR5-C1, đột biến T6; §6.2 số đo), `docs/reviews/raw/2026-11-05/codex/C.md` (CXR5-C1, C2, C3), `docs/reviews/raw/2026-11-05/deepseek/C.md` (DSR5-C1, Playwright)
- `docs/design/phase-5-ai.md` §3.1 (mục 3), §10
- `packages/ai/src/mock-extraction.ts` (`BULLET`, `CHILD`, `otherDeaths`, `worded`), `packages/ai/src/mock-extraction.test.ts`
- `packages/ai/src/web.ts` (`checkWebAnswer`), `apps/desktop/src/routes/customers/KycWebSession.tsx`
- `.dependency-cruiser.cjs` (`AI_TEST_FILES`, rule `ai-test-support-only-in-tests`)

##### File / thư mục được phép sửa

- `packages/ai/src/mock-extraction.ts`, `packages/ai/src/mock-extraction.test.ts`
- `packages/ai/src/web.ts`, `packages/ai/src/web.test.ts`
- `apps/desktop/src/routes/customers/KycWebSession.tsx`, `e2e/customer-ai-web.spec.ts`
- `.dependency-cruiser.cjs`
- `docs/design/phase-5-ai.md` (§3.1 mục 3, §10)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `37a80b6`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

- `checkWebAnswer` trả `{ kind: 'unusable', reason: 'EMPTY' }` cho chuỗi chỉ có khoảng trắng / ký tự vô hình; không tính lần thử. Câu trả lời có nội dung như cũ.
- Mock: mọi đề xuất hiện có giữ nguyên; chỉ thêm đề xuất ở hai dạng của mục 2 và các câu của mục 1.

##### Test chấp nhận

- [ ] Đột biến T6 của Claude C ("vế không ở vị trí 0") làm ca mới đỏ; "Gặp. Khách đã kết hôn." vẫn ra đề xuất như §10.
- [ ] "KH có 3 con. Vụ mất điện ở căn nhà nhỏ bé." → Số con 3; "– KH đã kết hôn" (một dòng và nhiều dòng) → Đã kết hôn; "–" không có khoảng trắng sau như "-" hiện nay.
- [ ] Trên 3 551 ghi chú RE của dữ liệu tải: 1 972 đề xuất cũ còn đủ (chỉ thêm, không mất); số đo không chậm hơn rõ mốc lượt 5. Thân PR ghi số đề xuất và số đo.
- [ ] Import `packages/ai/src/test-support.ts` từ một file sản phẩm của `apps/desktop/src` → `pnpm lint:deps` đỏ; từ một file test của `apps/desktop/src` → xanh. Thân PR ghi cách thử.
- [ ] Dán chuỗi chỉ có U+200B / U+2060 / U+3164 → nút tắt, `checkWebAnswer` trả `EMPTY`, không tính lần thử (unit + e2e `customer-ai-web.spec.ts`).
- [ ] Spec §3.1 mục 3 và §10 ghi đúng hành vi mới.
- [ ] `pnpm verify` xanh.

Ước lượng: ≈ 15–30 dòng SP + ≈ 60 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med; review nâng lên mức high theo bảng §2 của skill `review-pr` (diff chạm `packages/ai/**`).

##### Bị chặn bởi

Không

## PR #1066 — fix: Mock spares "nhỏ bé" of a dead child and reads "–" as a bullet, a blank paste read as normalizeText, test-support only for tests (T-365)

Trạng thái: MERGED · merge 2026-11-05T13:41:13Z · commit `509b785254c4ee1f819d4f01db3c092d558dc2a7` · nhánh `task/T-365-l5c-mock-web-empty` · nhãn: risk:med

Closes #1047

Phiên code: coding-ses1 (auto-issues)

Nhóm L5-C của đợt sửa lượt 5 (DR6-164, 166, 167, 168; DR6-165 theo Q2 (a): không đổi code Mock vì hiệu năng).

#### Thay đổi

- **DR6-164** (`mock-extraction.test.ts`): thêm ca giữ phép thử chữ cái của `worded`: "1. Khách đã kết hôn.", "... Hai vợ chồng đã kết hôn, có 2 con.", "?\nKhách đã kết hôn.", "1.\nChị nói đã kết hôn.", "2020. Khách đã kết hôn." → đề xuất; đối chứng "Gặp. Khách đã kết hôn." → không đề xuất. Không đổi code.
- **DR6-166 (a)** (`mock-extraction.ts`, `CHILD` của nhánh `otherDeaths`): "bé" của "nhỏ bé" không là con. "KH có 3 con. Vụ mất điện ở căn nhà nhỏ bé." → Số con 3.
  - **Quyết định Owner 05/11/2026, phương án (b)** (https://github.com/AlexH-AI/Project-2C/issues/1047#issuecomment-6658840458): ở nhánh con mất chỉ miễn "nhỏ bé". Các dạng nghĩa nhỏ khác của luật 4 ("bé nhỏ / xíu / tí / hơn / nhất") vẫn bỏ Số con, vì ở đây có thể chỉ một người con: "KH có 2 con. Bé nhỏ đã mất.", "Bé nhất đã mất", "Bé Tí đã mất". Áp nguyên ngoại lệ luật 4 như Issue ghi thì ba câu này ra Số con 2 / 3 / 2 (đề xuất sai mới, trái CX-A4); commit đầu `8a35a2c` làm theo cách đó, commit sau `5798016` thu hẹp theo (b). `NAMES_NO_ONE` (luật 4) giữ như `main`.
- **DR6-166 (b)** (`BULLET`): nhận gạch ngang U+2013 "–" như "-", phải có khoảng trắng theo sau.
- **DR6-167** (`.dependency-cruiser.cjs`): rule `ai-test-support-only-in-tests` xét mọi file không phải test ở bên nhập (kể cả `apps/`); file test (`.test.ts`, `.test.tsx`, `test-support.ts`) ở đâu cũng được. Hằng `AI_TEST_FILES` thành `TEST_FILES` (thêm `.test.tsx`), dùng cho cả `ai-only-on-domain-and-zod`.
- **DR6-168** (`web.ts`, `KycWebSession.tsx`): `checkWebAnswer` và nút "Kiểm tra và lưu" hỏi "trống" bằng `normalizeText` của `domain` (tập K20, như mọi ô khác). Thứ tự kiểm giữ nguyên: dán quá `MAX_READ` vẫn báo `TOO_LONG` trước, không chuẩn hóa cả chuỗi lớn (DR5-09).
- Spec `docs/design/phase-5-ai.md`: §3.1 mục 3 (rỗng theo K20), §10 ("đầu ghi chú" là trước mọi chữ cái; dấu đầu dòng có "–"; "nhỏ bé" ở luật 3 theo quyết định (b)).

Cỡ: 8 file, +77 / −26 (SP ≈ 30 dòng: `mock-extraction.ts`, `web.ts`, `KycWebSession.tsx`, `.dependency-cruiser.cjs`).

#### Test chấp nhận

- [x] **Đột biến T6** của Claude C (`worded = worded || clause.start > 0;` thay dòng `worded ||= /\p{L}/u.test(…)`): 5 ca worded mới đỏ (cùng các ca chưa sửa lúc đó); "Gặp. Khách đã kết hôn." vẫn xanh (không đề xuất như §10). Vá rồi trả file nguyên byte.
- [x] "KH có 3 con. Vụ mất điện ở căn nhà nhỏ bé." → Số con 3; "Bé nhỏ / Bé nhất / Bé Tí / Một bé nhỏ đã mất", "Mất điện ở căn hộ bé xíu" → không đề xuất Số con (quyết định (b)). "– KH đã kết hôn" → Đã kết hôn; "– KH đã kết hôn\n– Đã ly hôn năm 2020." → Ly hôn; "–KH đã kết hôn" và "-KH đã kết hôn" → không đề xuất. Các ca này đỏ trước khi sửa.
- [x] **Ghi chú thật** (probe ngoài repo theo `p03-mock.mjs` / `p07d-ab.mjs` / `p07e-cold.mjs` của lượt 5; bản `main` `331edf3` và nhánh cùng một tiến trình, qua `createMockAdapter` + `buildExtractionInput` như app; dữ liệu tải `load-2026-10-12-seed6.p2cbackup` + seed 3 ngày neo): 3 551 ghi chú RE khác nhau, **1 972 → 1 972 đề xuất, 0 khác, 0 mất**.
  - Số đo (Home PC, Node v24.20.0, 05/11 ~20:00): cả bộ 3 551 ghi chú, 7 vòng xen kẽ: `main` 73,69 ms → nhánh 75,10 ms (×1,02); lần gọi đầu của tiến trình (ghi chú RE dài nhất, 173 ký tự, 9 tiến trình mỗi bên): 28,47 → 28,49 ms; lần hai 11,10 → 12,35 ms. Trong luật nhiễu (> 20 % và > 10 ms), không chậm hơn mốc lượt 5 (28,5 ms; 103,5 ms).
- [x] **Rule test-support** (`npx depcruise apps packages`, tạm thêm file rồi xóa, `git status` sạch sau đó):
  - `apps/desktop/src/probe-dr6-167.ts` import `../../../packages/ai/src/test-support` → exit 1, `error ai-test-support-only-in-tests`; cùng file với cấu hình của `main` → exit 0 (lỗ của DR6-167);
  - cùng import từ `apps/desktop/src/probe-dr6-167.test.ts` và `.test.tsx` → exit 0;
  - từ file sản phẩm `packages/ai/src/` → exit 1 (như trước); từ `packages/ui/src/` → exit 2 (cả `ui-not-to-data` và rule này).
- [x] Dán chỉ U+200B / U+2060 / U+3164 (kèm khoảng trắng, xuống dòng) → `checkWebAnswer` trả `EMPTY` ở lần 1 và lần 2, không tính lần thử (unit `web.test.ts`); e2e `customer-ai-web.spec.ts`: nút "Kiểm tra và lưu" tắt, vẫn "Lần thử 1 / 2". Ca e2e đỏ khi tạm trả `KycWebSession.tsx` về `main`, xanh sau khi sửa (`customer-ai-web` + `customer-ai`: 28 / 28).
  - `normalizeText` ở nút chạy mỗi lần render: 20 000 ký tự 0,26 ms, 200 000 ký tự 2,4 ms, 1 000 000 ký tự 18 ms.
- [x] Spec §3.1 mục 3 và §10 ghi đúng hành vi mới.
- [x] `pnpm verify` xanh (130 file, 4 421 test).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (@ `5798016`): không có ghi chú OPEN nào nêu các file này. Không có.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med` (review mức high theo bảng §2 của `review-pr`: diff chạm `packages/ai/**`). Không G5: không đổi prompt, validator hay danh sách chặn. Không cần `build-exe`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-365 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #1048 — T-366: Lượt 5 L5-D: bộ chặn ký hiệu bắt đủ ký hiệu, escape, thực thể HTML, dấu nối JSX, bỏ báo nhầm (DR6-169)

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Nhóm **L5-D** của đợt sửa lượt 5: bộ chặn ký hiệu `findHardcodedSeparators` (`packages/ui/src/token-guard.ts`), **DR6-169** = phần còn của DR6-145 và hai lỗ mới. Theo Q3 (a) Owner chọn 05/11.

1. **(a) Ký hiệu chưa bắt** (phần (b) của DR6-145 mà Issue #901 thu hẹp):
   - thêm `←`, `–`, `…`, `“`, `”`, `‘`, `’` vào tập ký hiệu (`:98-99`);
   - theo Q3 (a): bắt cả ký hiệu trong tập viết bằng escape `\uXXXX` (và `\u{…}`) trong chuỗi / template, và thực thể HTML có tên hay số (`&times;`, `&middot;`, `&rarr;`, `&#183;`, `&#xB7;`…) trong chữ JSX;
   - bỏ câu "nor a mark written as a Unicode escape" khỏi doc của hàm, ghi đúng phạm vi mới.
2. **(b) Luật dấu nối JSX** (`:146-150`) chỉ nhận `}` `, ` `{` liền nhau. Phải bắt cả:
   - dạng Prettier viết khi dòng dài: `{a},{' '}`⏎`{b}`, `{a}`⏎`, {b}`, `,{' '}` một dòng (cả `{" "}`);
   - `{a}:{' '}{b}`;
   - dấu nối đứng trước `<` của một phần tử: `{t('a')}: <b>{v}</b>`.
3. **(c) Báo nhầm:**
   - `Promise<<T>() => T>` làm bộ đếm `types` đóng sớm nên thân hàm sau thành JSX (`:135`, `:155`): đếm `<` lồng của kiểu hàm generic;
   - `JOINER` báo `text.split(', ')`, `text.replace(', ', '; ')` (`:53`, `:107`): chỉ báo khi chuỗi là đối số của `.join(` (hay ghi giới hạn vào doc nếu cách đó gây báo nhầm khác; thân PR ghi lý do).

App hiện không có dạng nào của (a), (b); (c) không có chỗ nào trong repo.

##### Bối cảnh

- Deep review Phase 1–6 lượt 5: tổng hợp T-362 #1042, PR #1044, §6.4 (DR6-169), §8.2 (nhóm L5-D), §9 Q3. Báo cáo gốc ở PR #1043 (`docs/reviews/raw/2026-11-05/`).
- Owner 04/11 chốt sửa hết trước G7 (K47). **Owner 05/11 chọn Q3 (a):** bộ chặn bắt cả escape và thực thể HTML.
- DR6-145 (lượt 4) còn SỬA MỘT PHẦN ở lượt 5 (§3.1 của tổng hợp); task này đóng nốt.
- (a) có từ trước, (b) mới (#920), (c) mới (#920, #965).

##### Tài liệu cần đọc

- `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md` §3.1 (DR6-145), §6.4 (DR6-169), §8.2 (L5-D), §9 Q3
- `docs/reviews/raw/2026-11-05/claude/D.md` (CLR5-D1, D2; `plant-forms`: 387 / 510 lần cắm lọt; `ast-compare`), `docs/reviews/raw/2026-11-05/codex/D.md` (CXR5-D1, D2, D5), `docs/reviews/raw/2026-11-05/deepseek/D.md` (DSR5-D1, D2)
- `packages/ui/src/token-guard.ts`, `packages/ui/src/token-guard.test.ts`; lệnh `check-tokens` gọi hàm

##### File / thư mục được phép sửa

- `packages/ui/src/token-guard.ts`, `packages/ui/src/token-guard.test.ts`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `37a80b6`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

- `findHardcodedSeparators` giữ chữ ký và dạng kết quả; chỉ thêm chỗ bị báo.
- Cam kết "ký hiệu và dấu nối chỉ ở `vi.ts`" giữ đủ với mọi cách viết đã liệt kê.

##### Test chấp nhận

- [ ] Mọi dạng 🔁 ở §6.4 (a), (b) của tổng hợp bị báo; mọi dạng (c) không báo.
- [ ] `plant-forms` của Claude D (hay ca tương đương trong test): 510 / 510 lần cắm bị báo. Thân PR ghi cách thử và kết quả.
- [ ] 0 báo nhầm trên mọi file `.ts` / `.tsx` của repo (`check-tokens` xanh; so `ast-compare` nếu dùng lại).
- [ ] Doc của hàm ghi đúng phạm vi (escape, thực thể, giới hạn còn lại như regex literal).
- [ ] `pnpm verify` xanh.

Ước lượng: ≈ 15–35 dòng SP + ≈ 60 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low (công cụ kiểm, không đổi app)

##### Bị chặn bởi

Không

## PR #1068 — fix: separator guard finds every mark of vi.ts, its escapes and entities, Prettier's JSX joiners, no false reports (T-366)

Trạng thái: MERGED · merge 2026-11-05T14:29:34Z · commit `31f7fc24f3b462156145bcdc6dcbec2ebb08b234` · nhánh `task/T-366-token-guard-separators` · nhãn: risk:low

Closes #1048

Phiên code: coding-ses2 (auto-issues)

#### Thay đổi

Nhóm L5-D (DR6-169), theo Q3 (a): `findHardcodedSeparators` (`packages/ui/src/token-guard.ts`) giữ chữ ký và dạng kết quả, chỉ báo thêm ở các chỗ dưới đây.

- **(a) Ký hiệu.** Tập ký hiệu chuyển thành bảng `MARKS`: dấu nối `·`, `→`, `–` (`sep.dot`, `sep.arrow`, `sep.range`) báo `hardcoded-separator`; `✓ ○ × ▾ ▸ —` cộng `← … “ ” ‘ ’` báo `hardcoded-mark`. `–` vào nhóm dấu nối vì nó là `sep.range`.
  - Ký hiệu viết bằng escape trong chuỗi / template: `\uXXXX`, `\u{…}` (tối đa 4 chữ số có nghĩa, nên `\u{100b7}` không bị đọc thành `·`) và thêm `\xXX` (`\xb7` cũng là `·`). Kết quả báo là chính escape đó (`\u00d7`).
  - Thực thể HTML có tên (`&times;`, `&middot;`, `&rarr;`, `&larr;`, `&ndash;`, `&mdash;`, `&hellip;`, `&ldquo;` / `&rdquo;` / `&lsquo;` / `&rsquo;`) hay số (`&#183;`, `&#xB7;`). Hàm xét ở chữ JSX và ở mọi chuỗi ngoài comment, vì JSX cũng giải mã thực thể của thuộc tính (`title="&hellip;"`).
- **(b) Dấu nối JSX** (`JSX_JOINER`). Sau `}` của một biểu thức JSX, hàm bỏ qua khoảng trắng, xuống dòng và một `{' '}` / `{" "}` ở hai bên dấu `,;:`. Dấu đó phải hiện ra kèm một dấu cách thật (dấu cách cùng dòng hay một `{' '}`), và sau nó là `{` hay `<` của một phần tử (không tính `</`).
  - Bắt được: `{a},{' '}`⏎`{b}`, `{a}`⏎`, {b}`, `{a}`⏎`,{' '}`⏎`{b}`, `{a}:{' '}{b}` và `{t('a')}: <b>{v}</b>`.
  - Không báo: `{h}:{m}` và `{a},`⏎`{b}` (chữ hiện ra không có dấu cách), `<dt>{label}: </dt>`.
  - Chữ báo gộp mọi khoảng trắng thành một dấu cách, ví dụ `},{' '} {`. Dòng báo là dòng có `}`, như cách `plant-forms` tính.
- **(c) Báo nhầm.**
  - Bộ đếm `types`: khi đang ở trong đối số kiểu, mỗi `<` mở thêm một tầng. Nhờ vậy `Promise<<T>() => T>` và `Map<string, <T>(x: T) => T>` đóng ở `>` cuối.
  - `JOINER`: một chuỗi nguyên (hay template không có `${`) mà là nguyên một đối số của lời gọi (`CALLEE` đọc ngược tới `tên(`) chỉ bị báo khi lời gọi đó là `.join(`. Vì vậy `text.split(', ')` và `text.replace(', ', '; ')` không bị báo. Chuỗi không phải đối số của lời gọi vẫn bị báo như cũ: `a + ', ' + b`, `[a, ', ', b]`, `setLabel(a + ', ' + b)`, `` `${a}, ${b}` ``.
  - Lý do theo đúng câu "chỉ báo khi chuỗi là đối số của `.join(`" của Issue: cách này không gây báo nhầm nào (0 trên repo, xem dưới), chỉ để lọt thêm một dạng. Đó là chuỗi đưa cho một lời gọi tự dựng chữ (`parts.push(', ')`), nên doc ghi nó là giới hạn, kèm một ca test ghim.
- Doc của hàm bỏ câu "nor a mark written as a Unicode escape" và ghi phạm vi mới: ký hiệu, escape, thực thể, dạng Prettier. Các giới hạn còn lại cũng ghi ở đó:
  - không đọc regex literal (escape trong đó lọt);
  - chuỗi đưa cho lời gọi khác `.join(`;
  - dấu nối trong chữ JSX cạnh một từ (`{a}: b`) hay sau một phần tử (`<b>{a}</b>, {b}`): ở chỗ đó không phân biệt được JSX với code (`open ? <A /> : <B />`).

Cỡ: SP +72 / −18 (phần lớn là doc và comment), test +158.

#### Test chấp nhận

- [x] Mọi dạng 🔁 ở §6.4 (a), (b) bị báo, mọi dạng (c) không báo. Mỗi dạng có ca riêng trong `token-guard.test.ts` (7 ca mới). Probe của Claude D chạy lại: `remainder.mjs` **11 / 11 REPORTED** (`←`, `–`, `…`, ngoặc kép cong, `\u00d7` / `\u2014` trong chuỗi, `{'\u00b7'}` trong JSX, `&times;` / `&middot;` / `&rarr;` / `&#183;` trong chữ JSX); `jsx-near.mjs`: `{t('a')}: <b>{value}</b>` REPORTED. Hai dạng "sau một phần tử" của probe đó vẫn lọt: Issue không nêu, và giới hạn này đã ghi vào doc. `t333-variants.mjs` 9 / 9 như mong đợi.
- [x] `plant-forms` của Claude D: **510 / 510** lần cắm bị báo (`other A 93/93`, `B 135/135`, `C 39/39`, `D 210/210`, `text A 30/30`, `text B 3/3`; 3 chỗ không tìm lại được sau format, như lượt 5).
  - Cách thử: chép `C:\workspace\deep-review-1-6-r5\claude\D\guard\{plant-forms,remainder,jsx-near,t333-variants}.mjs` vào scratchpad, đổi `REPO` từ `Project-2C-review` sang checkout chính ở nhánh này (không đụng worktree review), rồi `node plant-forms.mjs`.
- [x] 0 báo nhầm trên mọi file `.ts` / `.tsx` của repo.
  - `pnpm lint:tokens` xanh.
  - Probe `false-reports.mjs` sửa từ phần 1 của `ast-compare.mjs` cho các dạng mới. Cây cú pháp TypeScript cho biết, ở mỗi chỗ, chữ JSX hiện ra giữa biểu thức và biểu thức / phần tử kế tiếp (`{' '}` tính là một dấu cách), chuỗi / mảnh template là dấu nối mà không phải đối số của lời gọi khác `.join(`, và ký hiệu (hay escape / thực thể của nó) ở ngoài comment.
  - Kết quả: **356 file, 1 833 lần báo (1 807 ký hiệu, 26 chuỗi), 0 sai chỗ**. Chiều ngược lại cũng 0: mọi dấu nối mà cây cú pháp thấy đều bị báo.
  - Thử thêm một ca CRLF dạng C: báo đúng dòng 2, và ký hiệu ở dòng 5 vẫn đúng dòng.
- [x] Doc của hàm ghi đúng phạm vi: escape, thực thể và các giới hạn còn lại (regex literal, lời gọi khác `.join(`, chữ JSX cạnh từ / sau phần tử).
- [x] `pnpm verify` xanh (130 file test, 4 429 test; phủ nhánh `packages/ui/src` 100%).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (@ `09c10ad`): Không có.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-366 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #1049 — T-367: Lượt 5 L5-E: chuỗi liền dài ở chín chỗ và e2e quét mọi màn (DR6-170, 174c)

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Nhóm **L5-E** của đợt sửa lượt 5: chuỗi liền dài kéo trang cuộn ngang. Theo Q4 (a) Owner chọn 05/11.

1. **DR6-170 — sửa chín chỗ** DR6-117 / 148 chưa phủ (tên không có trần độ dài; `requireName` chỉ kiểm rỗng). Bọc theo cách của DR6-117 / 148 (`block max-w-60 wrap-anywhere` / `min-w-0 wrap-anywhere`); tên thường không đổi hình:
   1. Khách hàng → Bảng: ô Họ tên / RE (`CustomersScreen.tsx:53-73`; bảng không trong khung cuộn `:193-202`). KH 81 chữ → trang 1 329 px ở 1 100; RE 160 chữ → 1 889 px cả ở 1 440.
   2. Dòng meta của hồ sơ KH (`CustomerProfile.tsx:173`): +299 px ở 1 100.
   3. Bảng và khung chi tiết Lịch hẹn (`AppointmentsScreen.tsx:316-320`, `:669`): 2 038 / 2 324 px.
   4. Bảng Thùng rác, ô "Thuộc" (`SettingsTrash.tsx:70-80`, `:372`): 1 992 px.
   5. Tên RE ở thẻ Hợp đồng (`CustomerPolicies.tsx:89`): 1 392 px ở 1 100.
   6. Ô chọn "RE của góc nhìn" (`ScopePicker.tsx:49-57`, `SelectField.tsx:55-63`): rộng 1 367–2 409 px, đẩy thanh trên của Tổng quan / Báo cáo / Lịch hẹn / Khách hàng ra ngoài cả ở 1 440. Giới hạn bề rộng ô; lựa chọn vẫn hiện đủ khi mở.
   7. Dòng "Đang xem" của Báo cáo (`FilterBar.tsx:70-81`) với team 160 chữ: `main` 868 → 2 134 px.
   8. Tiêu đề chart team ở Tổng quan (`StageBlock.tsx:73-77`): 254 → 2 136 px, đè sang cột bên.
   9. Ô nguồn / model ở lịch sử phân tích AI (`KycHistory.tsx:87-92`) với nhãn model 100 chữ (chỉ backup sửa tay): bảng 1 513 px.
2. **Một ca e2e quét mọi màn chính** (Q4 (a)): Tổng quan, Lịch hẹn (bảng + khung chi tiết), Khách hàng (bảng / Kanban / hồ sơ, thẻ Hợp đồng, lịch sử AI), Báo cáo, Team, Cài đặt → Thùng rác. Dữ liệu: KH 81 chữ, RE / team 160 chữ liền, nhãn model 100 chữ; cả khi chọn góc nhìn RE / team; ở 1 100 và 1 440. Đòi trang lẫn `main` không cuộn ngang. Màn mới sau này có tràn thì CI đỏ.
3. **DR6-174 (c)** — span `max-w-60` ở cột Team của Theo RE (`ReportTable.tsx:119-123`, #922) không ca nào giữ: thêm ca đòi cột Team ≤ 240 px với team 160 chữ (giết đột biến E148e của Claude E).

##### Bối cảnh

- Deep review Phase 1–6 lượt 5: tổng hợp T-362 #1042, PR #1044, §6.4 (DR6-170), §6.5 (DR6-174 c), §8.2 (nhóm L5-E), §9 Q4. Báo cáo gốc ở PR #1043 (`docs/reviews/raw/2026-11-05/`).
- Owner 04/11 chốt sửa hết trước G7 (K47). **Owner 05/11 chọn Q4 (a):** sửa chín chỗ và thêm một ca e2e quét mọi màn. Đây là lượt thứ ba tìm thêm chỗ tràn (DR6-117 lượt 3, DR6-148 lượt 4); ca quét chặn lượt tìm thứ tư.
- Tên dài có dấu cách (RE 46 chữ, team 49, KH 61) không tràn ở đâu. Không sai dữ liệu.
- Ảnh hướng dẫn: tên thường không đổi hình; bộ kiểm ảnh báo nếu khác. Không chụp lại trong task này (G7 làm, §8.1 mục 5 của tổng hợp).

##### Tài liệu cần đọc

- `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md` §6.4 (DR6-170), §6.5 (DR6-174), §8.2 (L5-E), §9 Q4
- `docs/reviews/raw/2026-11-05/claude/D.md` (CLR5-D3), `docs/reviews/raw/2026-11-05/claude/E.md` (CLR5-E1, CLR5-E4 c, đột biến E148e), `docs/reviews/raw/2026-11-05/codex/D.md` (CXR5-D3, D4), `docs/reviews/raw/2026-11-05/codex/E.md` (CXR5-E1, E2), `docs/reviews/raw/2026-11-05/codex/C.md` (CXR5-C4)
- `e2e/long-names.spec.ts` (ca DR6-117 / 148 hiện có, cách đo cuộn ngang)
- Các file ở mục "File được phép sửa"

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/customers/{CustomersScreen.tsx,CustomerProfile.tsx,CustomerPolicies.tsx,KycHistory.tsx}`
- `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx`
- `apps/desktop/src/routes/{SettingsTrash.tsx,FilterBar.tsx}`, `apps/desktop/src/routes/overview/StageBlock.tsx`
- `apps/desktop/src/shell/ScopePicker.tsx`, `packages/ui/src/components/SelectField.tsx`
- `e2e/long-names.spec.ts` (hay một spec mới cạnh nó cho ca quét)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `37a80b6`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

- Không đổi dữ liệu, lệnh hay i18n. Chỉ class bọc / giới hạn bề rộng.
- Tên thường (dữ liệu seed, dữ liệu tải) hiển thị y như trước.

##### Test chấp nhận

- [ ] Ca e2e quét: mọi màn chính ở 1 100 và 1 440, với KH 81 chữ, RE / team 160 chữ liền, nhãn model 100 chữ, cả khi chọn góc nhìn RE / team → trang và `main` không cuộn ngang (`scrollWidth ≤ clientWidth`).
- [ ] Gỡ tạm từng chỗ bọc của mục 1 → ca quét đỏ. Thân PR ghi cách thử và kết quả.
- [ ] Ô chọn góc nhìn mở ra vẫn đọc được đủ tên dài (xuống dòng hay title); chọn được bằng bàn phím như cũ.
- [ ] Cột Team của Theo RE ≤ 240 px với team 160 chữ; đột biến E148e bị giết.
- [ ] e2e ảnh hướng dẫn / ảnh chụp seed không đổi.
- [ ] `pnpm verify` và `pnpm e2e` xanh.

Ước lượng: ≈ 15–25 dòng SP + ≈ 100 dòng e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low

##### Bị chặn bởi

Không (L5-F cũng chạm màn Thùng rác nhưng ở `trash-view.ts`; PR merge sau thì `gh pr update-branch`)

## PR #1070 — fix: long unbroken names break in place on every main screen, a sweep e2e holds it (T-367)

Trạng thái: MERGED · merge 2026-11-05T16:41:28Z · commit `dd5ae567a90f25e71c77b14f4f63c2bfa1f17e97` · nhánh `task/T-367-long-name-sweep` · nhãn: risk:low

Closes #1049

Phiên code: coding-ses1 (auto-issues)

#### Thay đổi

Nhóm L5-E (DR6-170 theo Q4 (a), DR6-174 (c)). Chỉ đổi class bọc / giới hạn bề rộng; không đổi dữ liệu, lệnh hay i18n. Cách bọc theo DR6-117 / 148: ô bảng dùng khối có trần `block max-w-60 wrap-anywhere` (cột giữ bề rộng như tên thường, tên dài hơn trần thì xuống dòng ở trần); phần tử trong hàng flex dùng `min-w-0 wrap-anywhere`.

**Chín chỗ của Issue:**

1. Khách hàng → Bảng (`CustomersScreen.tsx`): ô Họ tên (khối bọc quanh link) và ô RE (`cell` mới) dùng `NAME` = `block max-w-60 wrap-anywhere`. Thêm: dòng tóm tắt góc nhìn ("<RE> · …" / "Cả team <team> · …") `min-w-0 wrap-anywhere`.
2. Dòng meta của hồ sơ KH (`CustomerProfile.tsx`): `wrap-anywhere`.
3. Lịch hẹn (`AppointmentsScreen.tsx`):
   - bảng: nút KH `max-w-60 text-left wrap-anywhere`, ô RE `NAME`;
   - khung chi tiết: `dd` `min-w-0 wrap-anywhere`, và tiêu đề `h2` (ngày · tên KH 81 chữ) `wrap-anywhere`;
   - thêm: bảng ngày (tên team `h3`, tên RE `h4`) và dòng tóm tắt góc nhìn. Ca quét thấy cả ba tràn khi chỉ sửa hai chỗ Issue nêu.
4. Thùng rác (`SettingsTrash.tsx`):
   - Ô "Thuộc": khối `block max-w-96 wrap-anywhere`. Trần 96 chứ không 60 vì ô có hai tên ("KH <tên> · RE <tên>"): ảnh `09-cai-dat-thung-rac` có ô này một dòng, trần 60 sẽ làm nó xuống dòng.
   - Ô "Bản ghi" (sau review): những dòng có thể chứa tên thì `wrap-anywhere`. Đó là dòng đầu của KH / nhân sự / team (`NAMED`; chữ bọc trong `span` `min-w-0` của hàng flex) và dòng lý do chặn / giữ lại ("Khôi phục KH <tên> trước.", "… nhân sự <tên> …").
   - Dòng đầu của lịch hẹn / HĐ (ngày, trạng thái, FYP) giữ nguyên. Lý do: bảng Thùng rác trong ảnh hướng dẫn đang bị ép bề rộng, và đã thử đặt `wrap-anywhere` cho cả ô thì cột lệch 4 px, ảnh `09-cai-dat-thung-rac` đổi.
5. Tên RE ở thẻ Hợp đồng (`CustomerPolicies.tsx`): `min-w-0 wrap-anywhere`.
6. Ô chọn góc nhìn (`ScopePicker.tsx`, `SelectField.tsx`): `SelectField` có prop mới `capped` — khung ô `min-w-0 max-w-80`, và `title` là nhãn của lựa chọn đang chọn. `ScopePicker` bật `capped` cho cả ô Team lẫn ô RE. Ô RE với dữ liệu seed rộng 250 px (đo ở 1 100 và 1 440), dưới trần 320 px, nên không đổi hình. Danh sách lựa chọn (`<option>`) giữ nguyên nhãn đủ.
7. Dòng "Đang xem" (`FilterBar.tsx`): `min-w-0 wrap-anywhere`.
8. Tiêu đề chart team ở Tổng quan (`StageBlock.tsx`): tên bọc trong `span` `min-w-0 wrap-anywhere` (trước là nút chữ trần của flex, không đặt `min-w-0` được).
9. Ô nguồn / model ở lịch sử phân tích (`KycHistory.tsx`): nhánh model bọc `block max-w-60 wrap-anywhere`; nhánh badge (Mock, ChatGPT web) không đổi.

**File ngoài danh sách được phép sửa** (REVIEW-CHECKLIST P-2): ca quét của Issue đỏ ở ba chỗ nữa mà Issue không nêu. Không sửa thì không đạt test chấp nhận "mọi màn chính … cả khi chọn góc nhìn RE / team":

- `apps/desktop/src/shell/RePicker.tsx`: tiêu đề "Team <tên> · n RE" của dải chọn RE (góc nhìn Team, Lịch hẹn và Khách hàng) `wrap-anywhere`. Tên team 160 chữ tràn khỏi cột 200 px, qua các chip RE, ra ngoài `main`.
- `apps/desktop/src/routes/reports/ReportsScreen.tsx`: dòng meta "Team <tên> · n RE" của bảng Tổng hợp `min-w-0 wrap-anywhere` (Báo cáo, góc nhìn Team / RE).
- `apps/desktop/src/routes/customers/KycIntelligence.tsx`: chip "kyc v2 · <prompt> · <model> · <giờ>" ở đầu khung KYC Intelligence `min-w-0 wrap-anywhere`. Với model 100 chữ, chip tràn ở 1 440.

**Ca e2e quét** (`e2e/long-names.spec.ts`, ca cuối):

- Dữ liệu:
  - KH `K`×81 tạo qua 5a, có ghi chú KYC và một phân tích Mock.
  - Xuất backup. Trong file: đổi tên RE của KH thành `R`×160 và team của RE đó thành `T`×160; phân tích đổi thành OpenCode với model `W`×100 (cách duy nhất có model ngoài danh sách là backup sửa tay). Nhập lại.
- Quét ở 1 100 và 1 440; mỗi lần đòi trang và `main` không cuộn ngang:
  - Lịch hẹn: tạo lịch 16/09 cho KH; bảng, khung chi tiết và bảng ngày ở góc nhìn Toàn bộ / Team / RE.
  - Xóa lịch đó (để có dòng ở Thùng rác).
  - Theo từng góc nhìn: Khách hàng (Bảng, Kanban), Tổng quan, Báo cáo (mọi bảng của nhóm "Bảng báo cáo").
  - Team & nhân sự (team đó mở). Sau đó tạo rồi xóa một team `G`×160.
  - Hồ sơ: thêm HĐ qua 8a, rồi quét với lịch sử AI có model 100 chữ. Sau đó xóa KH.
  - Cài đặt → Thùng rác, quét với ba dòng:
    - KH `K`×81 (tên ở "Bản ghi", RE / team 160 chữ ở "Thuộc");
    - lịch hẹn, bị chặn: "Khôi phục KH `K`×81 trước.";
    - team `G`×160.
- Góc nhìn RE được chọn bằng bàn phím: từ RE đầu danh sách (team khác), gõ "Rxxx" lên ô đang có focus. Ca đòi lựa chọn đúng và `title` của ô là nhãn đủ.
- DR6-174 (c): ca Báo cáo hiện có đo thêm ô Team của bảng Theo RE với team 160 chữ: phần nội dung ≤ 240 px.

Cỡ: SP +98 / −31 (khoảng một nửa là comment và xuống dòng của Prettier), e2e +243 / −1.

#### Test chấp nhận

- [x] Ca e2e quét (mô tả ở trên): xanh. `long-names.spec.ts` 8 / 8 xanh.
- [x] Gỡ tạm từng chỗ bọc → ca quét đỏ.
  - Cách thử: một script node (ngoài repo) làm lần lượt từng đột biến. Mỗi lần nó thay đúng một chuỗi class trong file (kiểm chuỗi đó có đúng một lần), chạy `pnpm exec playwright test e2e/long-names.spec.ts -g "push no main screen"` (E148e: `-g "figures of Báo cáo"`), rồi trả file về. `git status` sạch sau cả loạt.
  - Kết quả: **26 / 26 KILLED** (24 ở `0cae315`, hai dòng "Bản ghi" ở `8024535`; ô "Thuộc" chạy lại ở `8024535`, vẫn đỏ). Cột cuối là bước đầu tiên đỏ.

  | Đột biến (gỡ) | File | Đỏ ở |
  |---|---|---|
  | 1 ô Họ tên | `CustomersScreen.tsx` | Khách hàng, Bảng, Toàn bộ, 1 100 |
  | 1 ô RE | `CustomersScreen.tsx` | Khách hàng, Bảng, Toàn bộ, 1 100 |
  | 1 dòng tóm tắt góc nhìn | `CustomersScreen.tsx` | Khách hàng, Bảng, Team, 1 100 |
  | 2 dòng meta | `CustomerProfile.tsx` | hồ sơ, 1 100 |
  | 3 nút KH của bảng | `AppointmentsScreen.tsx` | Lịch hẹn, Team, 1 100 |
  | 3 ô RE của bảng (`NAME` = `''`) | `AppointmentsScreen.tsx` | Lịch hẹn, Toàn bộ, 1 100 |
  | 3 `dd` của chi tiết | `AppointmentsScreen.tsx` | Lịch hẹn, Toàn bộ, 1 100 |
  | 3 `h2` của chi tiết | `AppointmentsScreen.tsx` | Lịch hẹn, Toàn bộ, 1 100 |
  | 3 team của bảng ngày | `AppointmentsScreen.tsx` | Lịch hẹn, Toàn bộ, 1 100 |
  | 3 RE của bảng ngày | `AppointmentsScreen.tsx` | Lịch hẹn, Toàn bộ, 1 100 |
  | 3 dòng tóm tắt góc nhìn | `AppointmentsScreen.tsx` | Lịch hẹn, Team, 1 100 |
  | 4 ô "Thuộc" | `SettingsTrash.tsx` | Thùng rác, 1 100 |
  | 4 dòng đầu "Bản ghi" của KH / nhân sự / team | `SettingsTrash.tsx` | Thùng rác, 1 100 |
  | 4 dòng lý do chặn | `SettingsTrash.tsx` | Thùng rác, 1 100 |
  | 5 RE của HĐ | `CustomerPolicies.tsx` | hồ sơ, 1 100 |
  | 6 `capped` của ô Team | `ScopePicker.tsx` | Lịch hẹn, Team, 1 100 |
  | 6 `capped` của ô RE | `ScopePicker.tsx` | ô RE: thiếu `title` |
  | 6 trần của `SelectField` (giữ `title`) | `SelectField.tsx` | Lịch hẹn, Team, 1 100 |
  | 6 `title` | `SelectField.tsx` | ô RE: thiếu `title` |
  | 7 "Đang xem" | `FilterBar.tsx` | Báo cáo, Team, Theo RE, 1 100 |
  | 8 tiêu đề chart team | `StageBlock.tsx` | Tổng quan, Team, 1 100 |
  | 9 model ở lịch sử | `KycHistory.tsx` | hồ sơ, 1 100 |
  | tiêu đề dải chọn RE | `RePicker.tsx` | Lịch hẹn, Team, 1 100 |
  | meta của Tổng hợp | `ReportsScreen.tsx` | Báo cáo, Team, Theo RE, 1 100 |
  | chip của KYC Intelligence | `KycIntelligence.tsx` | hồ sơ, 1 440 |
  | E148e: cột Team của Theo RE không bọc span | `ReportTable.tsx` | ca Báo cáo: "Team of Theo RE at 1100" |

  Lần đầu, hai đột biến làm build hỏng (tsc báo biến không dùng), vì bỏ chỗ dùng duy nhất của một hằng: "ô RE của bảng" Lịch hẹn (`NAME`) và dòng đầu "Bản ghi" (`NAMED`). Chạy lại bằng cách làm rỗng giá trị và giữ chỗ dùng.
- [x] Ô chọn góc nhìn: ô có `title` là nhãn đủ của lựa chọn đang chọn. Các `<option>` giữ nguyên nhãn đủ, nên danh sách mở ra hiện đủ như trước. Ca quét chọn RE `R`×160 bằng bàn phím: focus ô, gõ bốn chữ đầu.
- [x] Cột Team của Theo RE ≤ 240 px với team 160 chữ; E148e bị giết (bảng trên).
- [x] Ảnh hướng dẫn không đổi: `pnpm exec playwright test -c playwright.guide.config.ts` 13 / 13 xanh, sau đó `git status` sạch (không ảnh nào đổi byte), ở `0cae315` và `8024535`. Ảnh chụp seed: `seeded-snapshot.spec.ts` xanh trong `pnpm e2e`.
- [x] `pnpm verify` xanh; `pnpm e2e` 325 / 325 xanh (ở `8024535`).

##### Sau review `0cae315` (`REVIEW: CHANGES`)

- [chặn] Spec + Correctness: đúng — KH 81 chữ đã xóa làm Thùng rác tràn. Tái hiện bằng ca quét mở rộng: KH và team bị xóa trước khi quét Thùng rác. Ca đỏ ở 1 100 khi chỉ bọc dòng đầu: tên KH còn ở dòng lý do chặn của lịch hẹn. Đã sửa như mục 4 ở trên.
- [không chặn] JSDoc của `dayIn`: đã chuyển về ngay trên `dayIn`.
- [không chặn] Gộp `block max-w-60 wrap-anywhere` thành một hằng ở `classes.ts`: không làm trong PR này. `classes.ts` ngoài danh sách file được phép, và `NAME` của `ReportTable.tsx` khác chuỗi (`w-max`, `whitespace-normal`).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (@ `8024535`): Không có.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-367 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

- Ghi chú review PR #1070 — T-367 (#1049, PR #1070, `REVIEW: PASS` @`ff39260`). Số dòng theo `main` `dd5ae56`:
  - Ghi chú không chặn của vòng `REVIEW: CHANGES` @`0cae315` đã làm trong PR: JSDoc của `dayIn` ("The day shown when the period changes…") nay nằm ngay trên `dayIn` (`apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:80`); hằng `NAME` đứng trước nó với doc riêng (`:74`–`:78`). Mục chặn của vòng đó (ô "Bản ghi" của Thùng rác tràn với KH 81 chữ đã xóa) sửa ở `8024535` trước khi PASS, không phải ghi chú sổ. Review #1070 có hai ghi chú mới, ghi ở OPEN [G7].

---

# Issue #1050 — T-368: Lượt 5 L5-F: tên nút khôi phục, luật nhập mã KH, hai ô tìm, hộp HĐ, e2e 10a và Thùng rác (DR6-160, 172…174ab)

Trạng thái: CLOSED · nhãn: type:task, risk:med, status:in-progress, ready-for-agent

##### Mục tiêu

Nhóm **L5-F** của đợt sửa lượt 5 (gói E: Thùng rác, ô tìm, hộp Hợp đồng, test hở). Theo Q1 (a) Owner chọn 05/11.

1. **DR6-160 — tên nút khôi phục ở Thùng rác còn trùng cho trình đọc màn hình** ở ba ca ngoài DR6-151. Q1 (a): sửa cả ba.
   - (a) Lịch hẹn / HĐ của hai KH cùng tên khác mã: `ofCustomer` ghép "của KH <tên>" chỉ từ tên (`trash-view.ts:239-242`; `TrashRef` không có mã, `trash.ts:29-39`). Sửa: `TrashRef` của KH có mã; khi tên KH của dòng trùng tên một KH khác có dòng trong Thùng rác, vế "của KH <tên>" thêm mã theo khuôn `customer.withCode` của 9b.
   - (b) Hai nhân sự trùng cả tên, vai trò, team: hai dòng chỉ khác cột "Xóa lúc". Sửa: tên nút thêm giờ xóa như cột "Xóa lúc".
   - (c) Hai mã KH chỉ khác số dấu cách (backup sửa tay). Sửa: luật nhập backup ("Kiểm giá trị") chỉ nhận mã dạng app sinh: `K-` + 4 ký tự Crockford base32 (như `customers.ts:553`). Đây là một luật nhập mới; dữ liệu giả lập nạp lại (quy tắc R2-02 / K1); không migration, không UI cho dữ liệu cũ. Ghi luật vào `docs/design/phase-3-du-lieu.md` (mục "Kiểm giá trị" của §6).
2. **DR6-172 — hai ô tìm so chữ gõ qua `trim()` rồi bỏ dấu:** chọn KH ở 6b (`searchCustomers`, `appointment-form.ts:165`; `AppointmentDialog.tsx:378`) và "Tìm theo tên" ở Thùng rác (`filterTrash`, `trash-view.ts:74`). Tên đã lưu qua `normalizeText`, nên tên dán kèm U+200B, NBSP thay dấu cách hay hai dấu cách liền không bao giờ khớp. Sửa: so trên `normalizeText` (một hàm "chuỗi tìm" dùng chung cho hai nơi, trong phạm vi file cho phép); `AppointmentDialog.tsx:378` hỏi trống bằng `normalizeText`.
3. **DR6-173 — hộp Hợp đồng 8a–8d hỏi "ô trống" bằng `trim()`** (`PolicyDialogs.tsx:79`, `shown`): ô Ngày / FYP chỉ có ký tự vô hình hiện lỗi bắt buộc ngay, trước khi bấm Lưu. Sửa: `shown` dùng `normalizeText`, như 6b / 6c / 6e sau DR6-150.
4. **DR6-174 (a, b) — test hở:**
   - (a) Hộp 10a: không ca nào bấm nút "Đang nhập…" lúc chạy (`SettingsBackup.tsx:243-245`, #924). Thêm e2e: Enter / Space / click nút lúc chạy → đúng một lần nhập (giết E154d của Claude E).
   - (b) T-350: phần màn truyền `today` vào cột Thùng rác và hộp khôi phục (`SettingsTrash.tsx:291`, `:304`; `RestoreDialog.tsx:27-28`) không ca nào giữ. Thêm e2e: nhập bù lịch Dự kiến ngày trước hôm nay, xóa → dòng / tên nút / hộp 11b ghi "Chưa ghi kết quả" (giết E350c, E350d).

##### Bối cảnh

- Deep review Phase 1–6 lượt 5: tổng hợp T-362 #1042, PR #1044, §6.1 (DR6-160), §6.5 (DR6-172, 173, 174), §8.2 (nhóm L5-F), §9 Q1. Báo cáo gốc ở PR #1043 (`docs/reviews/raw/2026-11-05/`).
- Owner 04/11 chốt sửa hết trước G7 (K47). **Owner 05/11 chọn Q1 (a):** sửa cả ba ca tên nút khôi phục, gồm luật nhập mã KH.
- DR6-160 họ DR6-119 / 151 (Q3 (a) của lượt 4). DR6-172, 173 có từ trước; DR6-174 (a, b) mới (#924, #1011).
- DR6-174 (c) thuộc nhóm L5-E (cột Team của Theo RE).

##### Tài liệu cần đọc

- `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md` §6.1 (DR6-160), §6.5, §8.2 (L5-F), §9 Q1
- `docs/reviews/raw/2026-11-05/claude/A.md` (CLR5-A1), `docs/reviews/raw/2026-11-05/codex/A.md` (CXR5-A1, A2), `docs/reviews/raw/2026-11-05/claude/E.md` (CLR5-E2, E3, E4; đột biến E154d, E350c, E350d), `docs/reviews/raw/2026-11-05/codex/E.md` (CXR5-E3), `docs/reviews/raw/2026-11-05/deepseek/E.md` (DSR5-E1)
- `docs/design/phase-3-du-lieu.md` §6 "Kiểm giá trị", dòng `code` của bảng KH (§2)
- `apps/desktop/src/routes/trash-view.ts` (`restoreLabel`, `ofCustomer`, `filterTrash`, `searchedName`), `packages/db/src/trash.ts` (`TrashRef`, `listTrash`), `packages/db/src/backup-validation.ts`, `packages/db/src/customers.ts` (sinh mã)
- `apps/desktop/src/routes/appointments/{appointment-form.ts,AppointmentDialog.tsx}`, `apps/desktop/src/routes/customers/PolicyDialogs.tsx`
- `e2e/{trash,dialog-keyboard,backup,customer-policies}.spec.ts`

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/trash-view.ts`, `apps/desktop/src/routes/trash-view.test.ts`
- `apps/desktop/src/routes/appointments/appointment-form.ts`, `apps/desktop/src/routes/appointments/appointment-form.test.ts`, `apps/desktop/src/routes/appointments/AppointmentDialog.tsx`
- `apps/desktop/src/routes/customers/PolicyDialogs.tsx`
- `apps/desktop/src/i18n/vi.ts` (chỉ khóa tên nút khôi phục, nếu cần)
- `packages/db/src/trash.ts`, `packages/db/src/trash.test.ts`
- `packages/db/src/backup-validation.ts`, `packages/db/src/backup-invariants.test.ts`, `packages/db/src/backup.test.ts`, `packages/db/src/customers.ts` (chỉ để dùng chung khuôn mã)
- `e2e/trash.spec.ts`, `e2e/dialog-keyboard.spec.ts`, `e2e/backup.spec.ts`, `e2e/customer-policies.spec.ts`, `e2e/appointments.spec.ts`
- `docs/design/phase-3-du-lieu.md` (luật mã KH ở "Kiểm giá trị")

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `37a80b6`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

- `TrashRef` thêm mã KH (chỉ khi dòng thuộc KH). Thứ tự và nội dung hiện có của `listTrash` không đổi.
- Luật nhập mới: mã KH không khớp `^K-[0-9A-HJKMNP-TV-Z]{4}$` (khuôn Crockford base32 app sinh; PR ghi đúng khuôn theo code) → `BACKUP_INVALID` với số luật mới, DB hiện tại không đổi. Seed và dữ liệu tải nhập được.
- Tên nút khôi phục chỉ đổi ở các ca trùng; tên thường như cũ.

##### Test chấp nhận

- [ ] Hai KH cùng tên khác mã, mỗi KH có lịch hẹn / HĐ trong Thùng rác → tên nút khôi phục khác nhau (có mã). KH không trùng tên → tên nút như cũ.
- [ ] Hai nhân sự trùng tên, vai trò, team trong Thùng rác → tên nút khác nhau (có giờ xóa).
- [ ] Backup có mã KH sai khuôn (`K-9A1C ` có dấu cách, `K-9a1c`, `KH-0001`, `K-9A1CU`) → từ chối với số luật mới; seed, dữ liệu tải, backup từ bản build hiện tại nhập được.
- [ ] Tìm KH ở 6b và "Tìm theo tên" ở Thùng rác: chữ có U+200B, NBSP, hai dấu cách liền → tìm ra như chữ chuẩn; chữ chỉ có ký tự vô hình → như ô trống.
- [ ] Hộp HĐ 8a–8d: ô Ngày / FYP chỉ có ký tự vô hình chờ lần bấm Lưu như ô trống; bấm Lưu vẫn chặn.
- [ ] e2e 10a: Enter / Space / click nút "Đang nhập…" → một lần nhập; đột biến E154d bị giết.
- [ ] e2e Thùng rác: lịch Dự kiến ngày trước hôm nay, xóa → dòng, tên nút, hộp 11b ghi "Chưa ghi kết quả"; E350c, E350d bị giết.
- [ ] `phase-3-du-lieu.md` ghi luật mã KH.
- [ ] `pnpm verify` và `pnpm e2e` xanh.

Ước lượng: ≈ 15–40 dòng SP + ≈ 120 dòng test / e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:med (luật nhập backup mới theo Q1 (a))

##### Bị chặn bởi

Không (L5-E cũng chạm màn Thùng rác nhưng ở ô "Thuộc" của `SettingsTrash.tsx`; PR merge sau thì `gh pr update-branch`)

## PR #1072 — fix: restore buttons tell namesakes apart, the import takes app codes only, search and policy fields read text as stored (T-368)

Trạng thái: MERGED · merge 2026-11-05T17:40:06Z · commit `e9f2eb18c50e929a189e1f8fc05ae598a8580465` · nhánh `task/T-368-trash-names-search-policy` · nhãn: risk:med

Closes #1050

Nhóm **L5-F** của đợt sửa lượt 5 (DR6-160 theo Q1 (a), DR6-172, DR6-173, DR6-174 (a, b)).

Phiên code: coding-ses2 (auto-issues)

#### Thay đổi

- **DR6-160 (a) — lịch hẹn / HĐ của hai KH cùng tên:** `TrashOwner.customer` của `listTrash` có thêm `code` (`TrashRef & { code }`, `packages/db/src/trash.ts`); thứ tự và các trường khác không đổi. `codedCustomers` (`trash-view.ts`) giờ trả khóa `kind:id` của mọi dòng mà tên nút phải nói thêm: ngoài KH cùng tên cùng nhóm (DR6-151, như cũ), thêm dòng lịch hẹn / HĐ mà KH của nó trùng tên một KH khác có mặt trong Thùng rác (KH đã xóa, hay KH của một lịch hẹn / HĐ khác; so theo id nên lịch / HĐ của cùng một KH không thêm mã). Khi đó vế "của KH <tên>" thành "của KH <tên> (<mã>)" bằng khóa `customer.withCode` của 9b. Tên KH không trùng: như cũ. Kiểu và tên `codedCustomers(rows): ReadonlySet<string>` giữ nguyên để `SettingsTrash.tsx` (ngoài danh sách file) không đổi.
- **DR6-160 (b) — hai nhân sự trùng tên, vai trò, team:** tên nút thêm "xóa lúc <giờ xóa>" (đúng chữ cột "Xóa lúc", `deletedAtText`), chỉ khi có nhân sự khác trùng cả ba (tên, vai trò, tên team; IS / BD / BDM không team cũng tính). Khóa mới `trash.restoreLabel.deletedAt` trong `vi.ts`.
- **DR6-160 (c) — luật nhập mã KH (luật 15):** `validateBackupInvariants` thêm `codeRule`: mọi `customers.code` (kể cả KH đã xóa) phải khớp `^K-[0-9A-HJKMNP-TV-Z]{4}$`, đúng khuôn `freeCode` sinh (`K-` + `encodeBase32` của 3 byte → 4 ký tự của bảng `0123456789ABCDEFGHJKMNPQRSTVWXYZ`, `ids.ts`). Sai → `BACKUP_INVALID` với `{ rule: 15 }`, DB hiện tại không đổi. Không migration, không UI cho dữ liệu cũ (R2-02 / K1). `freeCode` có một dòng comment trỏ luật 15 (không thêm export, để bản đồ export của `packages/db/CLAUDE.md` không đổi).
  - Spec `docs/design/phase-3-du-lieu.md`: luật ghi ở mục "Kiểm giá trị" của §6 như Issue giao, kèm số luật 15 (Interface / test chấp nhận đòi "số luật mới", nên code đặt luật cạnh luật 11–14 trong `validateBackupInvariants`, nơi duy nhất mang `rule`); dòng `code` của §3.3 và dòng trạng thái đầu file ghi khuôn.
  - Test cũ `backup.test.ts` "takes it inside or at the end of a text" từng dùng mã KH kết thúc bằng U+FEFF làm ví dụ "chữ không có luật": nay luật 15 từ chối mã đó, nên ca chuyển sang id kết thúc bằng U+FEFF (vẫn đọc lại nguyên).
- **DR6-172 — hai ô tìm:** hàm chung `searchText` (`appointment-form.ts`) = `stripDiacritics(normalizeText(text).toLowerCase())`, dùng cho cả chữ gõ và tên ở `searchCustomers` (6b) và `filterTrash` (Thùng rác). `AppointmentDialog.tsx` hỏi trống bằng `normalizeText(query)`: chỉ ký tự vô hình → không danh sách, không "Không có KH khớp.".
- **DR6-173 — hộp HĐ 8a–8d:** `shown` dùng `normalizeText(text) !== ''`, như 6b / 6c / 6e sau DR6-150.
- **DR6-174 (a), (b) — test hở:** xem e2e dưới.

#### Test chấp nhận

- [x] Hai KH cùng tên khác mã, mỗi KH có lịch hẹn / HĐ trong Thùng rác → tên nút khác nhau (có mã); KH không trùng tên → như cũ (`trash-view.test.ts` "tells apart the records of two customers of one name by their code", "names the code when the other customer of the name is a deleted one's row"; ca cũ của `ROWS` không đổi).
- [x] Hai nhân sự trùng tên, vai trò, team → tên nút khác nhau (có giờ xóa); khác vai trò / team → không thêm giờ ("tells apart two people of one name, role and team by when they were deleted"); cả thùng có đủ các ca trùng → mọi tên nút khác nhau.
- [x] Mã KH sai khuôn (`K-9A1C `, `K-9A  1C` của KH đã xóa, `K-9a1c`, `KH-0001`, `K-9A1CU`, `K-9A1`, `K-9A1U`, `K-ILO0`, chữ số toàn khổ) → `BACKUP_INVALID` `{ rule: 15 }`, DB không đổi (`backup-invariants.test.ts`, 9 ca "15: …"). Nhận: `K-0HJZ`, `K-9KMN`, `K-PTVX`, `K-ABGY` (hai đầu và các khe của bảng Crockford); seed 2 / 11 / 42 và dữ liệu tải có Thùng rác (`seed-invariants.test.ts`), backup xuất từ bản hiện tại (`history()`) nhập được.
- [x] Tìm KH ở 6b và "Tìm theo tên" ở Thùng rác: U+200B, NBSP, hai dấu cách, U+2060 giữa chữ → tìm ra; chỉ ký tự vô hình → như ô trống (unit `appointment-form.test.ts`, `trash-view.test.ts`; e2e `appointments.spec.ts` "the customer box finds a name pasted with invisible characters or other spaces (DR6-172)").
- [x] Hộp HĐ 8a: Ngày / FYP chỉ có U+200B U+0085 U+2060 → không `aria-invalid`, không lỗi trước Lưu; bấm Lưu → chặn với "Nhập ngày." / "Chưa nhập số tiền.", không thêm HĐ (`customer-policies.spec.ts`).
- [x] e2e 10a (`dialog-keyboard.spec.ts`, ca "the dialog of a running import keeps the focus on what runs"): lúc chạy, Enter + Space + click nút "Đang nhập…" → đúng 1 backup sau khi thả. **E154d bị giết** (bản đột biến `void replace()` không điều kiện: 4 backup, ca đỏ).
- [x] e2e Thùng rác (`trash.spec.ts`, ca mới "a deleted appointment of a day past still planned reads 'Chưa ghi kết quả'"): nhập bù lịch Dự kiến 10/09 (hôm nay e2e 15/09), xóa → ô "Bản ghi", tên nút và hộp khôi phục ghi "Chưa ghi kết quả". **E350c bị giết** (màn truyền `{ ...today, year: 2000 }` cho cột: ô ghi "Dự kiến", ca đỏ); **E350d bị giết** (hộp khôi phục đọc ngày đó: "Trạng tháiDự kiến", ca đỏ).
- [x] Đột biến bỏ sửa DR6-173 (`shown` về `trim()`) và bỏ sửa ô trống 6b (`query.trim()`) cũng làm đỏ ca e2e tương ứng. Mọi đột biến chạy tạm trên checkout rồi hoàn lại, không nằm trong commit.
- [x] `phase-3-du-lieu.md` ghi luật mã KH.
- [x] `pnpm verify` xanh ở local. `pnpm e2e`: các spec sửa chạy xanh ở local (xem Kiểm tra); bộ đủ chạy ở CI.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `264f95a`, 18 file): Không có.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Cỡ: ≈ 105 dòng SP thêm (≈ 130 kể cả dòng bỏ; phần lớn là comment và `codedCustomers`), ≈ 280 dòng test / e2e / tài liệu. Không `build-exe` (không đụng `src-tauri`, Cargo, `package.json`, lock, cấu hình build).

Rủi ro: `risk:med` (luật nhập backup mới theo Q1 (a))

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-368 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #1051 — T-369: Lượt 5 L5-G: công cụ: test notes-core / auto-wait / review-hint, ci --since, metRows của probe (DR6-175…177)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Nhóm **L5-G** của đợt sửa lượt 5 (công cụ, gói F). **Làm ngoài pipeline `auto-issues`:** `tools/auto-wait*`, `review-hint-core`, `notes-core` (qua `notes-for`) thuộc rào "không tự sửa" của skill `auto-issues` (K45).

1. **DR6-175 — test hở của công cụ phát triển** (code hiện tại đúng):
   - (a) `globMeetsFolder` (`tools/notes-core.mjs:207`, `return parts.length > names.length`): đổi thành `return true` thì 4 387 test xanh, mà ghi chú thư mục hiện thừa với đích như `e2e/*`, `packages/*/src`. Thêm ca `packages/*/src`, `packages/a*/src` (giết R156b của Claude F).
   - (b) `tools/auto-wait-core.mjs`: lần đọc tốt đặt lại số lần lỗi liên tiếp (`:231`, ca `waitFor` có lỗi xen lần đọc tốt; giết W15), lookbehind của `titleRegExp` (`:199`, ca `titleState` có số dính trước; giết W13b).
   - (c) `tools/review-hint-core.mjs:19`: khối app khớp không tham lam (ca `reviewedPr` có yêu cầu kẹp giữa hai khối; giết H6).
2. **DR6-176 — `auto-wait ci --since`** (`tools/auto-wait-core.mjs:129-149`) chỉ cần một workflow run nào đó tạo sau mốc cho cùng SHA, rồi lấy kết quả từ rollup. Sau `close` + `reopen`, rollup còn check cũ đã xong; một run `workflow_dispatch` (ci.yml có), hay run của chính lần reopen bị hủy trước khi có check, làm lệnh báo "CI green" theo check cũ. Sửa: chỉ tính run `pull_request` của đúng PR tạo sau mốc, và kết luận theo check của run đó (hay đòi run đó xong, không `cancelled`). `merge-pr` vẫn kiểm riêng như nay.
3. **DR6-177 — probe hiệu năng:** `metRows` lọc `hasText: 'Đã gặp'` trên cả dòng của bảng Lịch hẹn (`e2e/perf/probe.perf.ts:207`), không chỉ ô Trạng thái. Phép đếm kỳ Năm (`:287`, T-346) và việc chọn dòng thứ i (`:556-558`) đếm cả lịch Dự kiến có tên KH chứa cụm đó. Sửa: lọc theo ô Trạng thái.

##### Bối cảnh

- Deep review Phase 1–6 lượt 5: tổng hợp T-362 #1042, PR #1044, §6.6 (DR6-175, 176, 177), §8.2 (nhóm L5-G). Báo cáo gốc ở PR #1043 (`docs/reviews/raw/2026-11-05/`).
- Owner 04/11 chốt sửa hết trước G7 (K47). Owner 05/11 đồng ý cả 4 đề xuất §9 (không câu nào về nhóm này).
- Cả ba mới (DR6-175: #926 / #965, #944, #954; DR6-176: #954; DR6-177: #988). Dữ liệu tải không có tên KH chứa "Đã gặp".

##### Tài liệu cần đọc

- `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md` §6.6, §8.2 (L5-G)
- `docs/reviews/raw/2026-11-05/claude/F.md` (CLR5-F1, F2; đột biến R156b, W15, W13b, H6), `docs/reviews/raw/2026-11-05/codex/F.md` (CXR5-F1, F2)
- `.claude/skills/auto-issues/` (cách phiên điều phối gọi `auto-wait ci --since`)
- `tools/notes-core.mjs`, `tools/auto-wait-core.mjs`, `tools/auto-wait.mjs`, `tools/review-hint-core.mjs` và test của chúng
- `e2e/perf/probe.perf.ts` (`metRows`, `:207`, `:287`, `:556-558`)

##### File / thư mục được phép sửa

- `tools/notes-core.test.mjs`, `tools/review-hint-core.test.mjs`
- `tools/auto-wait-core.mjs`, `tools/auto-wait-core.test.mjs`, `tools/auto-wait.mjs`
- `e2e/perf/probe.perf.ts`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `37a80b6`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

- `auto-wait ci --since <mốc>` giữ cú pháp và mã thoát; chỉ đổi điều kiện "xong" / "xanh" theo mục 2.
- Probe in cùng tên thao tác, cùng cách đo.

##### Test chấp nhận

- [ ] Đột biến R156b, W15, W13b, H6 của Claude F đều làm ít nhất một ca đỏ. Thân PR ghi cách thử và kết quả.
- [ ] `ci --since`: chỉ có run `workflow_dispatch` sau mốc → chưa xong; run `pull_request` sau mốc bị `cancelled` → không báo xanh; run `pull_request` sau mốc xanh → xanh; check cũ trước mốc không được tính.
- [ ] Probe: KH tên chứa "Đã gặp" có lịch Dự kiến → không vào phép đếm kỳ Năm, không được chọn làm dòng "đã gặp".
- [ ] `pnpm verify` xanh; probe chạy được trên bản build (thân PR ghi một lần chạy hay lý do không chạy).

Ước lượng: ≈ 10–30 dòng SP + ≈ 60 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS

##### Rủi ro

risk:low. Làm ngoài pipeline `auto-issues` (rào "không tự sửa", K45).

##### Bị chặn bởi

Không

## PR #1056 — fix: wait for the reopened PR's own CI run, read met rows by status, keep tool tests (T-369)

Trạng thái: MERGED · merge 2026-11-05T07:53:26Z · commit `234eb9ee986ec921f17e6ee012e1585670c9e5eb` · nhánh `task/T-369-tools-tests-ci-since-metrows` · nhãn: risk:low

Closes #1051

Nhóm L5-G của đợt sửa lượt 5 (DR6-175…177). Làm ngoài pipeline `auto-issues` (rào "không tự sửa", K45).

#### Thay đổi

- **DR6-175 — test hở của công cụ** (0 dòng SP):
  - `tools/notes-core.test.mjs`: ca DR6-156 thêm hai đích dừng đúng ở độ sâu của thư mục, `packages/*/src` và `packages/a*/src`, không thấy ghi chú `packages/ai/src/` (giữ `return parts.length > names.length` của `globMeetsFolder`).
  - `tools/auto-wait-core.test.mjs`: `waitFor` với năm lần đọc lỗi xen năm lần đọc tốt vẫn xanh ở lần đọc 11 (giữ `failures = 0`); `titleState` với text `939` không nhận title chứa `PR 1939` (giữ lookbehind của `titleRegExp`).
  - `tools/review-hint-core.test.mjs`: "review PR #950 giúp anh" kẹp giữa hai khối `<system-reminder>` → 950 (giữ `[\s\S]*?` của `APP_BLOCK`).
- **DR6-176 — `auto-wait ci --since`** (`tools/auto-wait-core.mjs`, `tools/auto-wait.mjs`):
  - Với `--since`, kết luận theo **run `pull_request` mới nhất của nhánh PR** (`event`, `head_branch` = `headRefName`), tạo từ mốc trở đi, và theo **check của chính run đó** (run id đọc từ `detailsUrl` của check, `…/actions/runs/<id>/job/…`).
  - Run `workflow_dispatch` / `push`, hay run `pull_request` của nhánh khác: không tính → vẫn chờ ("no pull_request run of PR #N since T yet").
  - Run của PR kết thúc khác `success` / `failure` (`cancelled`, `startup_failure`…): mã 3 ("CI run <id> of PR #N ended cancelled @…"), không báo xanh. Đóng / mở lại lần nữa thì run mới hơn quyết định.
  - Run đã xong mà rollup chưa có check nào của nó: vẫn chờ ("no check of run <id> yet"). Check cũ trước mốc không được tính, kể cả check đỏ cũ.
  - `auto-wait.mjs` đọc thêm `headRefName` của PR và `id, event, head_branch, conclusion` của run (vẫn một lời gọi `gh api` cho runs, chỉ khi mọi check đã xong); chú thích usage nêu điều kiện mới và mã 3. Không `--since`: hành vi như cũ. Cú pháp và mã thoát giữ nguyên.
  - Hình dạng dữ liệu đã đối chiếu trên GitHub thật: check của rollup (PR #992) có `detailsUrl` `https://github.com/AlexH-AI/Project-2C/actions/runs/41662691492/job/126009754850`, run của Actions API có `id`, `event`, `head_branch`, `conclusion`. Trường `pull_requests` của run để trống với PR đã merge (GitHub chỉ điền PR đang mở), nên nối run với PR qua `head_branch`, không qua `pull_requests`. Run CI của chính PR này (`3e92ad9`), đọc bằng đúng `--jq` mới: `{"id":41988086229,"name":"CI","event":"pull_request","head_branch":"task/T-369-tools-tests-ci-since-metrows",…}`, trùng `headRefName` của PR.
  - Skill `auto-issues` (§ đóng / mở lại PR, dòng 274) không đổi: câu "`--since` chờ một run tạo từ mốc `T` trở đi, nên `ci` không báo xong theo run cũ" vẫn đúng; mã 3 đã có cách xử lý chung ("đọc lý do").
- **DR6-177 — probe** (`e2e/perf/probe.perf.ts`): `metRows` thành hàm async: tìm cột qua `columnheader` "Trạng thái" (`exact`) → `cellIndex`, rồi giữ dòng có ô ở cột đó chứa đúng chữ "Đã gặp" (`getByText(…, { exact: true })`). Hai nơi gọi (`metYear` đếm, `nextAppointment` kỳ Năm chọn dòng thứ *i*) đổi thành `(await metRows())…`. Không đổi tên thao tác, cách đo, thứ tự bước.

#### Test chấp nhận

- [x] **Đột biến R156b, W15, W13b, H6 của Claude F đều làm ít nhất một ca đỏ.** Script tạm ngoài repo áp từng đột biến (đổi đúng một chỗ, như `F\mut5.mjs` của Claude F: R156b `return parts.length > names.length;` → `return true;`; W15 bỏ `failures = 0;`; W13b `before` → `''`; H6 `[\s\S]*?<\/\1>` → `[\s\S]*<\/\1>`), chạy ba file test của công cụ, trả file về. Chạy trên code cuối của PR (`3e92ad9`):
  ```
  R156b | tools/notes-core.mjs | KILLED | Tests  1 failed | 83 passed (84)
      tools/notes-core.test.mjs > relatedNotes > reads a glob against a folder note one folder at a time (DR6-156)
  W15 | tools/auto-wait-core.mjs | KILLED | Tests  1 failed | 83 passed (84)
      tools/auto-wait-core.test.mjs > waitFor > counts only failed reads in a row: a good read between them starts the count again
  W13b | tools/auto-wait-core.mjs | KILLED | Tests  1 failed | 83 passed (84)
      tools/auto-wait-core.test.mjs > titleState > does not take a longer number for the PR asked for
  H6 | tools/review-hint-core.mjs | KILLED | Tests  1 failed | 83 passed (84)
      tools/review-hint-core.test.mjs > reviewedPr > still reads the review brief and the Owner around those blocks
  git status --short after: (chỉ 6 file của PR, không file nào của đột biến)
  ```
  Trên test của `37a80b6` bốn đột biến này sống cả bộ (4 387 test xanh, `docs/reviews/raw/2026-11-05/claude/F.md` §7).
- [x] **`ci --since`** (`describe('with since (a reopened PR)')` trong `tools/auto-wait-core.test.mjs`, 4 ca, đỏ trước khi sửa `ciState`):
  - chỉ có run `workflow_dispatch` (cũng `push`, nhánh khác) sau mốc → chưa xong;
  - run `pull_request` sau mốc bị `cancelled` → mã 3, không báo xanh (`startup_failure` cũng vậy);
  - run `pull_request` sau mốc xanh → xanh (cả run tạo đúng mốc);
  - check cũ trước mốc không được tính: check đỏ cũ + check xanh của run mới → xanh; check xanh cũ + check đỏ của run mới → đỏ, nêu `e2e`; run mới xong mà rollup chỉ có check cũ → chờ.
- [x] **Probe: KH tên chứa "Đã gặp" có lịch Dự kiến không vào phép đếm, không được chọn làm dòng "đã gặp".** Spec tạm (không commit) trên bản build web, Edge, dữ liệu giả lập neo 15/09/2026: tạo KH "Khách Đã gặp Gói G" với một lịch ngày 02/01/2026 (nhập bù, "Chưa ghi kết quả") và một lịch 18/09/2026 (Dự kiến); so locator cũ (`37a80b6`) với `metRows` mới (chép nguyên văn, chỉ thêm tham số `page`) và với số dòng có ô Trạng thái "Đã gặp" đọc thẳng từ DOM:
  ```
  Tuần: 100 rows shown, 11 met (DOM), ours: [{"status":"Dự kiến","customer":"Khách Đã gặp Gói G"}]
  Tuần: before 12 (ours 1), after 11 (ours 0)
  Năm: 100 rows shown, 81 met (DOM), ours: [{"status":"Chưa ghi kết quả","customer":"Khách Đã gặp Gói G"}]
  Năm: before 82 (ours 1), after 81 (ours 0)
    1 passed (13.8s)
  ```
  - Kỳ Tuần (mới nhất trước, như màn mở): dòng "đã gặp" đầu tiên của locator cũ là lịch Dự kiến của KH đó, chi tiết **không có** nút "Tạo lịch hẹn tiếp theo" (đúng CXR5-F2); dòng đầu của `metRows` mới là lịch Đã gặp thật, chi tiết **có** nút.
  - Kỳ Năm sắp tăng (đúng cách `metYear` đếm và `appointments.next-year` chọn): cũ 82 = 81 + 1 dòng của KH; mới 81 = số DOM, không dòng nào của KH.
  - Số mới bằng số DOM ở cả hai kỳ cũng cho thấy `getByRole('cell').nth(column)` trong `has` tính theo từng dòng, không theo cả bảng.
- [x] `pnpm verify` xanh (130 file, 4 391 test).
- [x] **Probe chạy được trên bản build.** Home PC `DESKTOP-KDURKJP`, 05/11/2026, probe ở head `3e92ad9`:
  - Exe: release build ở `be904e4` (exe của PR #988, như PR #992), sha256 `3312BBD4E2722626FD81F9534DAA5FE8AB50751AD3DA00AE3BF746939DEC73F2`, ở `C:\perf-exe-986\`, đã giữ dữ liệu tải mặc định (`load-2026-10-12-seed6`). Từ `be904e4` tới `main` chỉ PR #1011 (T-350) đổi code app: nhãn lịch Dự kiến ngày đã qua trong Thùng rác (`trash-view.ts`, `SettingsTrash.tsx`, `RestoreDialog.tsx`) và kiểu tham số của `statusLabel` / `appointmentGroup`; danh sách Lịch hẹn mà `metRows` đọc không đổi.
  - Mở exe với cổng debug, nối probe ngay. `PERF_RUNS=5`, `PERF_BASE=docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json`. Chạy hết trong **2,8 phút, đủ 35 thao tác**, mọi thao tác màn trong ngưỡng.
  - Dòng đã dùng: `Lịch năm 2026, 0 back: 79 met` (kiểm sớm; cùng số 79 như locator cũ ở PR #992, vì dữ liệu tải không có tên KH chứa "Đã gặp") và `Lịch tháng 10/2026, 1 back: 10 days met` (11 lần). Năm lần `appointments.next-year` chọn dòng qua `metRows` mới, đều tạo được lịch.
  - Một dòng ⚠️, ở `backup.read` (1 011 ms, nền 835 ms, +21 %): đọc file backup ở ô chọn file của webview, PR không đổi gì trên đường đo đó; lần chạy (a) của PR #992 trên cùng exe cho 975 ms. Số này chỉ để chứng minh probe chạy hết; số đo NT-HN-01 làm ở việc riêng của G7.

  | Thao tác | Lần | Trung vị | Min | Max | Ngưỡng | Nền | Δ |
  |---|---|---|---|---|---|---|---|
  | `app.open-data` | 1 | 354 ms | 354 ms | 354 ms | — | 387 ms | −33 ms (−9%) |
  | `backup.read` | 5 | 1011 ms | 998 ms | 1041 ms | — | 835 ms | +176 ms (+21%) ⚠️ |
  | `backup.import` | 5 | 45 ms | 38 ms | 49 ms | — | 43 ms | +2 ms (+5%) |
  | `db.save` | 15 | 157 ms | 154 ms | 164 ms | — | 151 ms | +6 ms (+4%) |
  | `reload.overview` | 5 | 413 ms | 411 ms | 470 ms | — | 398 ms | +15 ms (+4%) |
  | `reload.appointments` | 5 | 404 ms | 401 ms | 412 ms | — | 391 ms | +14 ms (+3%) |
  | `reload.customers` | 5 | 326 ms | 325 ms | 328 ms | — | 336 ms | −10 ms (−3%) |
  | `reload.reports` | 5 | 385 ms | 381 ms | 395 ms | — | 376 ms | +9 ms (+2%) |
  | `reload.team` | 5 | 368 ms | 365 ms | 379 ms | — | 355 ms | +14 ms (+4%) |
  | `reload.settings` | 5 | 297 ms | 294 ms | 309 ms | — | 283 ms | +13 ms (+5%) |
  | `appointments.period-day` | 5 | 8 ms | 6 ms | 11 ms | < 200 ms ✅ | 8 ms | −1 ms (−7%) |
  | `appointments.period-week` | 5 | 12 ms | 11 ms | 13 ms | < 200 ms ✅ | 12 ms | +0 ms (+3%) |
  | `appointments.period-month` | 5 | 5 ms | 5 ms | 5 ms | < 200 ms ✅ | 13 ms | −8 ms (−59%) |
  | `appointments.period-year` | 5 | 10 ms | 10 ms | 12 ms | < 200 ms ✅ | 17 ms | −6 ms (−39%) |
  | `appointments.sort-date-asc` | 5 | 21 ms | 17 ms | 23 ms | < 200 ms ✅ | 17 ms | +4 ms (+23%) |
  | `appointments.sort-date-desc` | 5 | 11 ms | 11 ms | 13 ms | < 200 ms ✅ | 11 ms | 0 ms (−1%) |
  | `appointments.select-row-year` | 5 | 7 ms | 6 ms | 9 ms | < 200 ms ✅ | 6 ms | +1 ms (+10%) |
  | `appointments.select-day-month` | 5 | 7 ms | 3 ms | 8 ms | < 200 ms ✅ | 9 ms | −3 ms (−28%) |
  | `appointments.select-row-month` | 5 | 6 ms | 5 ms | 10 ms | < 200 ms ✅ | 7 ms | −2 ms (−22%) |
  | `customers.view-table` | 5 | 18 ms | 15 ms | 20 ms | < 200 ms ✅ | 20 ms | −1 ms (−8%) |
  | `customers.sort-name` | 5 | 22 ms | 21 ms | 24 ms | < 200 ms ✅ | 23 ms | −1 ms (−4%) |
  | `customer.open-ai` | 5 | 21 ms | 20 ms | 24 ms | < 200 ms ✅ | 19 ms | +2 ms (+11%) |
  | `customer.ai-history` | 5 | 9 ms | 3 ms | 14 ms | < 200 ms ✅ | 2 ms | +7 ms (+330%) |
  | `overview.filter-year` | 5 | 18 ms | 16 ms | 21 ms | < 200 ms ✅ | 16 ms | +2 ms (+13%) |
  | `overview.filter-month` | 5 | 15 ms | 14 ms | 17 ms | < 200 ms ✅ | 14 ms | +1 ms (+8%) |
  | `reports.filter-year` | 5 | 10 ms | 8 ms | 10 ms | < 200 ms ✅ | 10 ms | 0 ms (−5%) |
  | `reports.filter-month` | 5 | 10 ms | 9 ms | 10 ms | < 200 ms ✅ | 10 ms | 0 ms (−3%) |
  | `reports.table-re` | 5 | 17 ms | 16 ms | 19 ms | < 200 ms ✅ | 17 ms | 0 ms (−2%) |
  | `trash.kind-appointments` | 5 | 6 ms | 6 ms | 9 ms | < 200 ms ✅ | 6 ms | +0 ms (+7%) |
  | `memory.js-heap` | 1 | 16,6 MB | 16,6 MB | 16,6 MB | — | 16,5 MB | +0,1 MB (+1%) |
  | `trash.open` | 5 | 33 ms | 33 ms | 36 ms | < 200 ms ✅ | 34 ms | −1 ms (−4%) |
  | `reports.export-excel` | 5 | 25 ms | 20 ms | 66 ms | — | 20 ms | +6 ms (+30%) |
  | `backup.export` | 5 | 456 ms | 446 ms | 470 ms | — | 438 ms | +18 ms (+4%) |
  | `appointments.next-month` | 5 | 113 ms | 111 ms | 118 ms | — | 101 ms | +12 ms (+12%) |
  | `appointments.next-year` | 5 | 111 ms | 110 ms | 112 ms | — | 107 ms | +4 ms (+4%) |

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (@ `3e92ad9`, 6 file): không có ghi chú OPEN nào nêu các file này. Không có.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Cỡ: 189 dòng thêm / 38 dòng bỏ, 6 file; SP ≈ 50 dòng (`auto-wait-core.mjs`, `auto-wait.mjs`, `probe.perf.ts`), còn lại là test. Không cần `build-exe`.

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-369 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #1052 — T-370: Lượt 5 L5-H: tài liệu nghiệm thu (7c, NT-AI-17) và mốc Mock trích xuất (DR6-165, 171)

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Nhóm **L5-H** của đợt sửa lượt 5 (tài liệu). Theo Q2 (a) Owner chọn 05/11.

1. **DR6-171 — hai dòng của `docs/testing/nghiem-thu-v1.md` chưa theo đợt sửa sau lượt 4:**
   - (a) Mục "Ô chọn" của "Lệch mockup đã biết" (`:407`) ghi hộp 7d vẽ hàng `.radio` mà app dùng ô chọn. Hộp 7c cũng vẽ hai hàng `.radio` có mô tả riêng (`kyc-forms.html:241-248`), còn app vẽ hai ô chọn và một dòng help chung. K44 đòi mọi lệch còn lại của ô chọn nằm ở mục này: thêm 7c vào câu của 7d.
   - (b) Ghi chú của NT-AI-17 (`:219`) vẫn ghi Mock "chỉ nhận '<n> con', 'đã kết hôn', 'độc thân'", trong khi §10 của `docs/design/phase-5-ai.md` nay có Ly hôn / Góa / Ly thân, con đã mất, "bé". Sửa ghi chú: trỏ §10 (hay liệt kê ngắn). Kết quả mong đợi của dòng vẫn đúng, không đổi.
2. **DR6-165 theo Q2 (a):** chấp nhận chi phí Mock trích xuất, ghi mốc mới vào `docs/metrics/phase-6.md`, không đổi code:
   - lần gọi đầu của tiến trình 28,5 ms (`2e51e25`: 9,2);
   - cả bộ 3 551 ghi chú RE của dữ liệu tải 103,5 ms (`2e51e25`: 62,2);
   - lần bấm AI trích xuất đầu trên màn 53 ms (`2e51e25`: 31);
   - Node 24, Home PC; nguồn `docs/reviews/raw/2026-11-05/claude/C.md` §6.2. Ghi rõ đây là mốc so cho lần sau (luật nhiễu so với mốc này), ngưỡng thao tác < 200 ms giữ nguyên.

##### Bối cảnh

- Deep review Phase 1–6 lượt 5: tổng hợp T-362 #1042, PR #1044, §6.3 (DR6-165), §6.4 (DR6-171), §8.2 (nhóm L5-H), §9 Q2. Báo cáo gốc ở PR #1043 (`docs/reviews/raw/2026-11-05/`).
- Owner 04/11 chốt sửa hết trước G7 (K47). **Owner 05/11 chọn Q2 (a):** chấp nhận chi phí, ghi mốc; lần bấm đầu của mỗi phiên app thêm ≈ 20 ms trên thao tác ≈ 30–50 ms; Mock chỉ cho demo / e2e / máy chưa có key.
- Nếu nhóm L5-C (Mock: "bé", "–", `worded`) merge trước và §10 đổi chữ, ghi chú NT-AI-17 trỏ §10 vẫn đúng.

##### Tài liệu cần đọc

- `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md` §6.3 (DR6-165), §6.4 (DR6-171), §7.2, §9 Q2
- `docs/reviews/raw/2026-11-05/claude/C.md` (CLR5-C2, §6.2 số đo), `docs/reviews/raw/2026-11-05/claude/D.md` (CLR5-D4), `docs/reviews/raw/2026-11-05/codex/F.md` (CXR5-F3)
- `docs/testing/nghiem-thu-v1.md` (NT-AI-17, mục "Lệch mockup đã biết" → "Ô chọn"), `docs/design/mockups/kyc-forms.html` (hộp 7c, 7d), `docs/design/phase-5-ai.md` §10
- `docs/metrics/phase-6.md` (mục "Số đo deep review lượt 5")

##### File / thư mục được phép sửa

- `docs/testing/nghiem-thu-v1.md`
- `docs/metrics/phase-6.md`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` trên các đường dẫn trên (sổ @ `37a80b6`): không có ghi chú OPEN nào.

##### Interface / hợp đồng

Không có (chỉ tài liệu).

##### Test chấp nhận

- [ ] Mục "Ô chọn" nêu cả 7c và 7d, khớp app và `kyc-forms.html`.
- [ ] Ghi chú NT-AI-17 không còn liệt kê thiếu; trỏ §10 (hay liệt kê đúng §10).
- [ ] `phase-6.md` có mốc Mock trích xuất theo Q2 (a): ba số, SHA, máy, nguồn.
- [ ] PR chỉ sửa `docs/**` (CI không chạy, ADR-0015).

##### Định nghĩa hoàn thành

- [ ] Review phiên sạch: PASS (PR docs, mức low)

##### Rủi ro

risk:low

##### Bị chặn bởi

Không

## PR #1074 — docs: acceptance notes name box 7c and the Mock rules of section 10, metrics record the Mock extraction baseline (T-370)

Trạng thái: MERGED · merge 2026-11-05T17:53:23Z · commit `bfc9f47260c4f458878358f81093aa377cbe7d09` · nhánh `task/T-370-acceptance-docs-mock-baseline` · nhãn: risk:low

Closes #1052

Phiên code: coding-ses1 (auto-issues)

#### Thay đổi

Nhóm L5-H của đợt sửa lượt 5 (DR6-171; DR6-165 theo Q2 (a), Owner 05/11). Chỉ tài liệu, không đổi code.

**DR6-171 (`docs/testing/nghiem-thu-v1.md`):**

- (a) Mục "Ô chọn" của "Lệch mockup đã biết": câu của 7d nay nêu cả 7c. Mockup `kyc-forms.html` vẽ hàng `.radio` ở đúng hai hộp này (`grep 'class="radio'` trên mọi mockup chỉ ra `kyc-forms.html:241, 245` (7c) và `:272, 276` (7d)), nên mục này nay có mọi lệch còn lại của ô chọn (K44):
  - 7c: mockup có hai hàng **Cập nhật** / **Đánh dấu mâu thuẫn**, mỗi hàng một câu mô tả riêng (`:241-248`). App vẽ hai ô chọn có nhãn "Trường đã có giá trị" và một dòng help chung `kycNote.modeHelp` (`KycDialogs.tsx:155-164`, `vi.ts:548-552`), từ T-048 phần B (#149).
  - 7d: giữ câu cũ; nguồn ghi "#149 / #150".
- (b) Ghi chú NT-AI-17: bỏ "Mock chỉ nhận "<n> con", "đã kết hôn", "độc thân"". Thay bằng liệt kê ngắn theo §10 của `docs/design/phase-5-ai.md` (Hôn nhân: Đã kết hôn, Độc thân, Ly hôn, Góa, Ly thân; Số con: kể cả "<n> bé", trừ số con đã mất), kèm câu trỏ §10. Kết quả mong đợi của dòng không đổi. §10 ở `main` đã gồm phần T-365 (#1066: "–", "nhỏ bé"); câu trỏ §10 vẫn đúng khi §10 đổi chữ.

**DR6-165 theo Q2 (a) (`docs/metrics/phase-6.md`):** thêm mục `#### Mốc Mock trích xuất (DR6-165, T-370)` ngay dưới "Số đo deep review lượt 5". Mục gồm:

- quyết định Q2 (a) của Owner: chấp nhận chi phí, không đổi code; Mock chỉ cho demo / e2e / máy chưa có key;
- ba số mốc ở `37a80b6`, so `2e51e25`:
  - lần gọi đầu của tiến trình 28,5 ms (9,2);
  - cả bộ 3 551 ghi chú RE 103,5 ms (62,2);
  - lần bấm đầu trên màn 53 ms (31, lượt 4);
- máy Home PC, Node v24.20.0; nguồn `docs/reviews/raw/2026-11-05/claude/C.md` §6.2 (CLR5-C2);
- câu "mốc so cho lần đo sau": luật nhiễu so với mốc này; ngưỡng < 200 ms giữ nguyên.

Thêm hai dòng để lần đo sau đọc đúng số:

- Số tuyệt đối đổi giữa các lần chạy: cả bộ 103,5 ms ở lượt 5, 73,7 ms ở thân PR #1066. Cùng code `packages/ai`: `git diff --stat 37a80b6 331edf3 -- packages/ai/src` rỗng. Vì vậy hai dòng Node nên đo xen kẽ với `37a80b6` trong cùng lần chạy (như tổng hợp lượt 5 §7.2).
- Sau mốc, T-365 (#1066) sửa Mock. Thân PR đó đo trước / sau, kết quả trong luật nhiễu (28,47 → 28,49 ms; 73,69 → 75,10 ms).

#### Test chấp nhận

- [x] Mục "Ô chọn" nêu cả 7c và 7d, khớp app (`KycDialogs.tsx` `Choices` + `kycNote.modeHelp`) và `kyc-forms.html` (7c `:241-248`, 7d `:272-279`).
- [x] Ghi chú NT-AI-17 không còn liệt kê thiếu: liệt kê đúng §10 và trỏ §10.
- [x] `phase-6.md` có mốc Mock trích xuất theo Q2 (a): ba số, SHA `37a80b6` (so `2e51e25`), máy Home PC / Node v24.20.0, nguồn `C.md` §6.2.
- [x] PR chỉ sửa `docs/**` (CI không chạy, ADR-0015): `docs/testing/nghiem-thu-v1.md`, `docs/metrics/phase-6.md`, đúng hai file Issue cho sửa.

#### Ghi chú OPEN liên quan

Không có (`node tools/notes-for.mjs --diff` @ `32d79c6`: không có ghi chú OPEN nào nêu hai file này).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-370 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #1054 — T-371: Tổng hợp lượt 5: đếm chênh mức khớp bảng §5.1 (review #1044)

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Bản tổng hợp deep review Phase 1–6 lượt 5 đếm số phát hiện "chênh mức" khớp bảng §5.1 của chính nó.

- **Hiện nay:** §1, dòng "Chênh mức khi kiểm" của bảng so ba bên §2.2 và §11 đều đếm **năm** mục: CLR5-E3 Nit → Low; CXR5-A1, CXR5-C1, CXR5-C2, CXR5-F2 Low → Nit (Claude 1 / 16, Codex 4 / 20, DeepSeek 0 / 5).
- **Thực tế:** bảng §5.1 ("Chỗ phiên tổng hợp chấm khác reviewer") còn ghi CLR5-D1, DSR5-D2 Nit → **Low** (gộp vào DR6-169).
  - CLR5-D1 cùng dạng với CLR5-E3 đã được đếm: một phát hiện Nit gộp vào vấn đề mà hai bên kia chấm Low (CLR5-D1 với CXR5-D1, DSR5-D1 ↔ CLR5-E3 với CXR5-E3, DSR5-E1).
  - Tổng hợp lượt 4 đếm từng phát hiện đổi mức (§1, §2.2, §11 của bản lượt 4).
- **Sau task:** cả ba chỗ đếm **bảy** mục, như bảng §5.1:
  - Claude 2 / 16 (D1, E3 lên);
  - Codex 4 / 20 (A1, C1, C2, F2 xuống);
  - DeepSeek 1 / 5 (D2 lên).

  Bảng §5.1, mức chốt, số DR6, nhóm sửa, kết luận và mọi Issue không đổi.

##### Bối cảnh

- Nguồn: ghi chú không chặn của review PR #1044 (T-362, #1042; `REVIEW: PASS` @`16dfff3`, merge squash `2fbf1e4`), mục Standards: https://github.com/AlexH-AI/Project-2C/pull/1044#issuecomment-6651846581
- Sổ: PR #1053 ghi ghi chú này vào OPEN, gắn [G7] vì Issue sửa lượt 5 (#1045…#1052) không cho sửa file bản tổng hợp. PR sổ gắn lại nhãn sang Issue này.
- Chọn "đếm bảy" thay vì "ghi ở §5.1 rằng phát hiện gộp vào vấn đề mức khác không tính":
  - cách sau phải loại cả CLR5-E3 (cùng dạng với CLR5-D1), nên đổi luôn cách đếm của §1 và §2.2;
  - đếm bảy giữ cách đếm của lượt 4 và tiêu đề của chính bảng §5.1.
- Owner 04/11 (K47): sửa hết mọi phát hiện rồi G7, nên mục này sửa trước G7.
- File ngoài rào "không tự sửa" của `auto-issues`: pipeline nhận được.

##### Tài liệu cần đọc

- `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md`: §1 (gạch "Năm mục chênh mức", dòng 49 ở `main` `7b8b99f`), §2.2 (dòng "Chênh mức khi kiểm", dòng 108), §5.1 (cả bảng, dòng 258–269), §11 (gạch "chênh mức năm mục", dòng 605).
- Bảng §5.1 và §2.2 của `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` (cách đếm của lượt 4).
- Comment review PR #1044 (link ở Bối cảnh), mục Standards.
- `docs/state/review-notes.md`, mục OPEN, nhóm "Ghi chú không chặn của review PR #1044".

##### File / thư mục được phép sửa

- `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md` (chỉ ba chỗ đếm "chênh mức" ở §1, §2.2, §11)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md` (sổ @ `7b8b99f`): đúng 1 mục "Trùng file", L14, là ghi chú Issue này sửa. **Gộp.** PR sổ gắn lại nhãn mục đó từ [G7] sang Issue này; phiên làm task chạy lại `notes-for <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Chỉ đổi số và danh sách ID ở ba chỗ:
  - §1: "Bảy mục chênh mức: CLR5-D1, CLR5-E3, DSR5-D2 Nit → Low; CXR5-A1, CXR5-C1, CXR5-C2, CXR5-F2 Low → Nit (§5.1)." Được ghi thêm một vế nêu ba mục lên Low do gộp vào vấn đề mà bên khác chấm Low;
  - §2.2, dòng "Chênh mức khi kiểm": `2 / 16 (D1, E3 lên)` · `4 / 20 (A1, C1, C2, F2 xuống)` · `1 / 5 (D2 lên)`;
  - §11: "chênh mức bảy mục".
- Không đổi bảng §5.1, §5.2, §6, phụ lục đối chiếu ID, hay số nào khác của bản tổng hợp. Không đổi `docs/metrics/phase-6.md` hay `docs/PROJECT-STATE.md`: hai file đó không nêu số mục chênh mức.

##### Test chấp nhận

- [ ] §1, §2.2 và §11 cùng đếm bảy mục chênh mức, khớp đúng bảy ID có mức chốt khác mức gốc trong bảng §5.1 (CLR5-D1, CLR5-E3, DSR5-D2, CXR5-A1, CXR5-C1, CXR5-C2, CXR5-F2).
- [ ] Dòng "Chênh mức khi kiểm" của §2.2: Claude 2 / 16, Codex 4 / 20, DeepSeek 1 / 5.
- [ ] `git diff` chỉ chạm ba chỗ trên; bảng §5.1 và mọi số khác của file không đổi.
- [ ] Thân PR có dòng cho ghi chú của review #1044 trong "Ghi chú OPEN liên quan".

Ước lượng: ≈ 3 dòng diff trong một file `.md`.

##### Định nghĩa hoàn thành

- [ ] PR chỉ sửa docs, nên CI không chạy.
- [ ] Review phiên sạch: PASS.
- [ ] PR sổ sau review chuyển ghi chú sang RESOLVED.

##### Rủi ro

risk:low

##### Bị chặn bởi

Không.

## PR #1075 — docs: lot 5 synthesis counts seven level changes as its section 5.1 table does (T-371)

Trạng thái: MERGED · merge 2026-11-05T18:01:14Z · commit `89028f8e88375e05fd4f48e76b0192a9f31a178a` · nhánh `task/T-371-luot-5-chenh-muc-count` · nhãn: risk:low

Closes #1054

Phiên code: coding-ses2 (auto-issues)

#### Thay đổi

Bản tổng hợp deep review Phase 1–6 lượt 5 nay đếm số phát hiện "chênh mức" khớp bảng §5.1 của chính nó: **bảy** mục, không phải năm. Chỉ tài liệu, ba dòng trong một file `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md`.

- §1 (`:49`): "Bảy mục chênh mức: CLR5-D1, CLR5-E3, DSR5-D2 Nit → Low; CXR5-A1, CXR5-C1, CXR5-C2, CXR5-F2 Low → Nit (§5.1)."
- §2.2, dòng "Chênh mức khi kiểm" (`:108`): `2 / 16 (D1, E3 lên)` · `4 / 20 (A1, C1, C2, F2 xuống)` · `1 / 5 (D2 lên)`.
- §11 (`:605`): "chênh mức bảy mục".

Bảy ID là đúng các dòng của bảng §5.1 có mức chốt khác mức reviewer: CLR5-E3 (`:263`), CXR5-A1 (`:264`), CXR5-C1, CXR5-C2 (`:265`), CXR5-F2 (`:266`), CLR5-D1, DSR5-D2 (`:268`, gộp vào DR6-169). Cách đếm theo từng phát hiện đổi mức, như lượt 4 (§1 `:40`, §2.2 `:79`, §11 `:574` của bản lượt 4).

Không thêm vế tùy chọn "ba mục lên Low do gộp vào vấn đề mà bên khác chấm Low": §5.1 ghi lý do của CLR5-E3 là thước §4.3 (chỉ sai hiển thị → Low), nên vế đó đọc như lý do chung sẽ lệch với §5.1.

Bảng §5.1, §5.2, §6, phụ lục đối chiếu ID, mức chốt, số DR6, nhóm sửa, kết luận và mọi Issue không đổi.

#### Test chấp nhận

- [x] §1, §2.2 và §11 cùng đếm bảy mục chênh mức, khớp đúng bảy ID có mức chốt khác mức gốc trong bảng §5.1 (CLR5-D1, CLR5-E3, DSR5-D2, CXR5-A1, CXR5-C1, CXR5-C2, CXR5-F2). Kiểm bằng script `node` tạm (ngoài repo): đọc bảng §5.1, lấy các dòng có mức reviewer ≠ mức chốt in đậm → đúng bảy ID trên; trước khi sửa script báo đỏ ở cả ba chỗ, sau khi sửa báo `PASS (7 IDs in §5.1)`.
- [x] Dòng "Chênh mức khi kiểm" của §2.2: Claude 2 / 16, Codex 4 / 20, DeepSeek 1 / 5.
- [x] `git diff` chỉ chạm ba chỗ trên (`3 insertions(+), 3 deletions(-)`, dòng 49, 108, 605); bảng §5.1 và mọi số khác của file không đổi. Trong file không còn chữ "năm mục" / "chênh mức năm".
- [x] Thân PR có dòng cho ghi chú của review #1044 trong "Ghi chú OPEN liên quan".

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `7e5cd58`: 1 mục "Trùng file".

- L14 **[T-371 #1054]** NIT `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md:49` (ghi chú không chặn của review PR #1044: ba chỗ đếm năm mục chênh mức, bảng §5.1 có bảy) → **đã sửa** ở PR này (cách "đếm bảy" ở cả ba chỗ). PR sổ sau review chuyển sang RESOLVED.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

PR chỉ sửa `docs/**` (không thuộc `CODE_DOCS`), nên CI không chạy (ADR-0015); không cần nhãn `build-exe`.

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-371 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

- Ghi chú review PR #1044 — T-371 (#1054, PR #1075, `REVIEW: PASS` @`7e5cd58`). Số dòng theo `main` `89028f8`:
  - #1044, NIT `docs/reviews/2026-11-05-deep-review-phase-1-6-luot-5-tong-hop.md:49` (§1; dòng "Chênh mức khi kiểm" của §2.2 `:108`; §11 `:605`; bảng §5.1 `:258`–`:269`): cả ba chỗ nay đếm bảy mục chênh mức, như bảng §5.1. §1 ghi "Bảy mục chênh mức: CLR5-D1, CLR5-E3, DSR5-D2 Nit → Low; CXR5-A1, CXR5-C1, CXR5-C2, CXR5-F2 Low → Nit (§5.1)"; §2.2 ghi Claude `2 / 16 (D1, E3 lên)`, Codex `4 / 20 (A1, C1, C2, F2 xuống)`, DeepSeek `1 / 5 (D2 lên)`; §11 ghi "chênh mức bảy mục". Cách đếm theo từng phát hiện đổi mức, như lượt 4. PR không thêm vế tùy chọn "ba mục lên Low do gộp", vì §5.1 ghi lý do của CLR5-E3 là thước §4.3. Review #1075 đếm lại bảy ID theo hai nguồn: bảng §5.1, và mức gốc so với mức chốt ở từng dòng của bảng §6. Bảng §5.1, mức chốt, số DR6, nhóm sửa và kết luận không đổi. Review #1075 không có ghi chú mới.

---

# Issue #1058 — T-372: Probe: đổi tên biến status trong metRows (review #1056)

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Trong `metRows` của probe hiệu năng, biến cục bộ không còn trùng tên với hàm `status(text)` của cùng file.

- **Hiện nay:** `e2e/perf/probe.perf.ts:211` (trong `metRows`, T-369 / PR #1056) khai báo `const status = list().getByRole('columnheader', { name: 'Trạng thái', exact: true });`, che hàm `const status = (text: string) => ({ selector: '[role="status"]', text });` ở `:200`. Lần sửa sau trong `metRows` mà định gọi `status(...)` sẽ nhận một `Locator` thay vì hàm.
- **Sau task:** biến đó có tên khác (ví dụ `header`), mọi chỗ dùng trong `metRows` đổi theo. Hành vi của probe giữ nguyên.

##### Bối cảnh

- Nguồn: ghi chú không chặn của review PR #1056 (T-369, #1051; `REVIEW: PASS` @`3e92ad9`, merge squash `234eb9e`), mục Correctness: https://github.com/AlexH-AI/Project-2C/pull/1056#issuecomment-6652572582. Comment ghi hàm `status` ở `:202`; dòng đúng là `:200`.
- Sổ: PR #1057 ghi ghi chú này vào OPEN, gắn [G7]. PR sổ gắn lại nhãn sang Issue này.
- Owner 04/11 (K47): sửa hết rồi mới G7. Owner 05/11 tách mục này khỏi mục `auto-wait` (T-373) để pipeline làm được.
- File ngoài rào "không tự sửa" của `auto-issues`: pipeline nhận được.

##### Tài liệu cần đọc

- `e2e/perf/probe.perf.ts`: `status` (`:200`), `metRows` (chú thích `:206`, hàm `:210`–`:215`) ở `main` `6ec6bad`.
- `docs/state/review-notes.md`, mục OPEN, nhóm "Ghi chú không chặn của review PR #1056".

##### File / thư mục được phép sửa

- `e2e/perf/probe.perf.ts` (chỉ trong `metRows`)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files e2e/perf/probe.perf.ts` (sổ @ `6ec6bad`): đúng 1 mục "Trùng file", L17, là ghi chú Issue này sửa. **Gộp.** Phiên làm task chạy lại `notes-for <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Chỉ đổi tên một biến cục bộ. Không đổi tên thao tác, cách đo, thứ tự bước, hay giá trị `metRows` trả về.

##### Test chấp nhận

- [ ] Trong `e2e/perf/probe.perf.ts` chỉ còn một khai báo tên `status` (hàm ở `:200`); `metRows` dùng tên mới.
- [ ] `git diff` chỉ chạm `metRows`.
- [ ] `pnpm verify` xanh (`tsc -p e2e` kiểm kiểu của probe).
- [ ] Không cần chạy probe trên exe vì chỉ đổi tên biến; thân PR ghi lý do này.
- [ ] Thân PR có dòng cho ghi chú L17 trong "Ghi chú OPEN liên quan".

Ước lượng: ≈ 2 dòng SP, không có test mới.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển ghi chú sang RESOLVED

##### Rủi ro

risk:low

##### Bị chặn bởi

Không.

## PR #1077 — refactor: the met rows header no longer shadows the status helper in the probe (T-372)

Trạng thái: MERGED · merge 2026-11-05T19:20:37Z · commit `42f29a5e21b3f89cba181bd552f864a9381db3c2` · nhánh `task/T-372-probe-metrows-header` · nhãn: type:task, risk:low

Closes #1058

Phiên code: coding-ses1 (auto-issues)

#### Thay đổi

- `e2e/perf/probe.perf.ts`, trong `metRows`: biến cục bộ `status` (`columnheader` "Trạng thái") đổi tên thành `header`, cùng chỗ dùng duy nhất của nó (`header.evaluate(...)` lấy `cellIndex`). Biến này không còn che hàm `status(text)` cùng file (khai báo ở `:200`).
- Không đổi tên thao tác, cách đo, thứ tự bước, hay giá trị `metRows` trả về.

#### Test chấp nhận

- [x] Trong `e2e/perf/probe.perf.ts` chỉ còn một khai báo tên `status` (hàm ở `:200`); `metRows` dùng tên mới:
  ```
  $ grep -n "const status\|status\b" e2e/perf/probe.perf.ts
  200:const status = (text: string) => ({ selector: '[role="status"]', text });
  394:  await detached('backup.import', confirm, status('Đã nhập backup'), true);
  539:  await detached('reports.export-excel', excel, status('Đã xuất báo cáo'));
  543:  await detached('backup.export', backup, status('Đã xuất backup'));
  ```
- [x] `git diff` chỉ chạm `metRows` (2 dòng: `:211`, `:212`).
- [x] `pnpm verify` xanh ở local (`tsc -p e2e` kiểm kiểu của probe).
- [x] Không chạy probe trên exe: chỉ đổi tên một biến cục bộ, không đổi biểu thức nào, nên hành vi probe giữ nguyên; kiểu của probe đã qua `tsc -p e2e` trong `pnpm verify`.
- [x] Dòng cho ghi chú OPEN dưới đây.

#### Ghi chú OPEN liên quan

- L14 `e2e/perf/probe.perf.ts` (**[T-372 #1058]** NIT `metRows`: biến `status` che hàm `status` cùng file): **đã sửa** (đổi tên thành `header`). Issue ghi L17 theo sổ @ `6ec6bad`; sổ @ `a5aea3e` đặt mục này ở L14.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-372 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

- Ghi chú review PR #1056 — T-372 (#1058, PR #1077, `REVIEW: PASS` @`4768d29`). Số dòng theo `main` `42f29a5`:
  - #1056, NIT `e2e/perf/probe.perf.ts:211` (`metRows` `:210`–`:215`; hàm `status(text)` ở `:200`): biến cục bộ lấy columnheader "Trạng thái" nay tên `header` (`:211`); chỗ dùng duy nhất của nó, `header.evaluate(...)` lấy `cellIndex` (`:212`), đổi theo. File chỉ còn một khai báo `status`, là hàm ở `:200`. Không đổi biểu thức, thao tác, thứ tự bước hay giá trị `metRows` trả về; PR không chạy probe trên exe vì chỉ đổi tên (thân PR #1077 ghi lý do), `tsc -p e2e` trong `pnpm verify` kiểm kiểu. Review #1077 không có ghi chú mới.

---

# Issue #1059 — T-373: auto-wait ci --since: run failure không có check đỏ thì báo đỏ (review #1056)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

`auto-wait ci --since` không báo "CI green" khi run `pull_request` của PR đã xong với `conclusion: failure`, kể cả khi rollup chưa có check đỏ nào của run đó. **Làm ngoài pipeline `auto-issues`:** `tools/auto-wait*` thuộc rào "không tự sửa" của skill (K45), như T-369.

- **Hiện nay** (`tools/auto-wait-core.mjs:164`–`:189`, `ciState`, nhánh `own`, T-369 / PR #1056): với `--since`, kết luận đọc từ các check của run trong rollup (`runOf(c) === String(own.id)`); `own.conclusion` chỉ dùng để tách `cancelled` / `startup_failure` ra mã 3. `ciState` đọc rollup (`gh pr view`) trước và runs (Actions API) sau. Nếu rollup trễ hơn API, chưa có check đỏ của run trong khi API đã báo run `failure`, lệnh báo `CI green @<head>: <n> pass` theo các check xanh còn lại.
- **Sau task:** run `failure` mà không thấy check đỏ nào của nó trong rollup → `done: true`, `EXIT.bad` (mã 1), text nêu id run (ví dụ `CI red @abc1234: run 2 failed, no red check of it yet`). Có check đỏ của run thì giữ như nay: mã 1, nêu tên check.
- **Vì sao báo đỏ thay vì chờ tiếp:** API đã cho kết luận của run, nên báo đỏ là đúng. Chờ thì có thể treo tới hết giờ nếu rollup không bao giờ có check đỏ. Phiên điều phối chỉ cần mã 1 rồi đọc lại trạng thái PR theo bảng (`.claude/skills/auto-issues/SKILL.md` §2, hàng "PR mở, CI đỏ trên `H`").

##### Bối cảnh

- Nguồn: ghi chú không chặn của review PR #1056 (T-369, #1051; `REVIEW: PASS` @`3e92ad9`, merge squash `234eb9e`), mục Correctness: https://github.com/AlexH-AI/Project-2C/pull/1056#issuecomment-6652572582.
- Sổ: PR #1057 ghi ghi chú này vào OPEN, gắn [G7]. PR sổ gắn lại nhãn sang Issue này.
- Cửa sổ rất hẹp, chưa tái hiện được trên GitHub thật. Owner 04/11 (K47): sửa hết rồi mới G7.
- Owner 05/11 tách mục này khỏi NIT của probe (T-372): pipeline làm T-372, còn Issue này làm theo cách thường (phiên thường, `review-pr`, `merge-pr`), như T-369.

##### Tài liệu cần đọc

- `tools/auto-wait-core.mjs`: `runOf`, `VERDICTS`, `newestRunOfPr` (`:104`–`:120`), `ciState` (`:134`–`:190`) ở `main` `6ec6bad`.
- `tools/auto-wait-core.test.mjs`: `describe('with since (a reopened PR)')` (helper `ranIn`, `run`).
- `tools/auto-wait.mjs` (chú thích usage, mã thoát: không phải sửa, vì mã 1 đã là "done and bad (red …)").
- `.claude/skills/auto-issues/SKILL.md` §2 (mã thoát `AUTO-WAIT`), §4 (đóng / mở lại PR rồi `ci --since`).
- `docs/state/review-notes.md`, mục OPEN, nhóm "Ghi chú không chặn của review PR #1056".

##### File / thư mục được phép sửa

- `tools/auto-wait-core.mjs`, `tools/auto-wait-core.test.mjs`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files tools/auto-wait-core.mjs tools/auto-wait-core.test.mjs` (sổ @ `6ec6bad`): đúng 1 mục "Trùng file", L16, là ghi chú Issue này sửa. **Gộp.** Phiên làm task chạy lại `notes-for <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- `auto-wait ci --since <mốc>` giữ cú pháp và mã thoát; chỉ thêm trường hợp `failure` không có check đỏ → mã 1.
- Không `--since`: hành vi không đổi.
- `cancelled` / `startup_failure` / kết thúc khác `success`, `failure`: vẫn mã 3 như nay.

##### Test chấp nhận

- [ ] `--since`, run `pull_request` sau mốc `conclusion: failure`, rollup chỉ có check xanh của run đó (cùng / không cùng check cũ trước mốc) → `done: true`, `EXIT.bad`, text nêu id run; không phải "CI green". Ca này đỏ trước khi sửa `ciState`.
- [ ] Run `failure` có check đỏ của run trong rollup → mã 1, nêu tên check (ca hiện có giữ xanh).
- [ ] Run `success` với check xanh → xanh; run `cancelled` → mã 3; run xong mà rollup chưa có check nào của nó → chờ (các ca hiện có giữ xanh).
- [ ] Không `--since`: mọi ca hiện có của `ciState` xanh, không sửa.
- [ ] `pnpm verify` xanh.
- [ ] Thân PR có dòng cho ghi chú L16 trong "Ghi chú OPEN liên quan".

Ước lượng: ≈ 5–10 dòng SP + ≈ 15 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển ghi chú sang RESOLVED

##### Rủi ro

risk:low. Làm ngoài pipeline `auto-issues` (rào "không tự sửa", K45).

##### Bị chặn bởi

Không.

## PR #1061 — fix: call a failed CI run red before its red check shows up (T-373)

Trạng thái: MERGED · merge 2026-11-05T09:39:36Z · commit `f4490e10b47d9816bef29eecfa723275d42ce968` · nhánh `task/T-373-ci-since-failed-run` · nhãn: risk:low

Closes #1059

#### Thay đổi

- `tools/auto-wait-core.mjs` (`ciState`, nhánh `--since`): sau khi tìm check đỏ trong các check của run, nếu run `pull_request` mới nhất kết thúc `failure` mà không có check đỏ nào của nó trong rollup thì báo `done: true`, `EXIT.bad` (mã 1), text `CI red @<head>: run <id> failed, no red check of it yet`. Lý do: `gh pr view` (rollup) đọc trước, Actions API (runs) đọc sau, nên rollup có thể chưa có check đỏ của run đã `failure`; trước đây lệnh báo "CI green" theo các check xanh còn lại.
- Ca chờ "no check of run <id> yet" dời xuống sau bước này: giờ chỉ còn cho run `success` mà rollup chưa có check nào của nó. Run `failure` mà rollup chưa có check nào của nó cũng báo đỏ theo run (đúng câu "Sau task" của Issue: run `failure` mà không thấy check đỏ nào của nó → mã 1; chờ thì có thể treo tới hết giờ).
- Có check đỏ của run → giữ như cũ (mã 1, nêu tên check). `cancelled` / `startup_failure` / kết thúc khác → mã 3 như cũ. Không `--since`: `own` là `null`, đường đi không đổi.
- Chú thích JSDoc của `ciState` thêm một câu cho trường hợp này. `tools/auto-wait.mjs` không sửa (mã 1 đã là "done and bad (red …)").
- `tools/auto-wait-core.test.mjs`: ca mới trong `describe('with since (a reopened PR)')`, run `failure` với rollup chỉ có check xanh của run (không / cùng check cũ trước mốc) và rollup chỉ có check cũ → đỏ theo run. Ca này đỏ trước khi sửa (`CI green @abc1234: 2 pass`).

#### Test chấp nhận

- [x] `--since`, run `pull_request` sau mốc `conclusion: failure`, rollup chỉ có check xanh của run đó (cùng / không cùng check cũ trước mốc) → `done: true`, `EXIT.bad`, text nêu id run; ca đỏ trước khi sửa `ciState`.
- [x] Run `failure` có check đỏ của run trong rollup → mã 1, nêu tên check (ca hiện có `reads only the checks of that run…` giữ xanh).
- [x] Run `success` với check xanh → xanh; run `cancelled` → mã 3; run `success` xong mà rollup chưa có check nào của nó → chờ (các ca hiện có giữ xanh).
- [x] Không `--since`: mọi ca hiện có của `ciState` xanh, không sửa.
- [x] `pnpm verify` xanh.
- [x] Thân PR có dòng cho ghi chú L16 (dưới).

#### Ghi chú OPEN liên quan

- L16 `tools/auto-wait-core.mjs` **[T-373 #1059]** (`ciState`, nhánh `own`: run `failure` mà rollup chưa có check đỏ thì báo "CI green"): **đã sửa** ở PR này (chọn hướng "báo đỏ theo run", như Issue).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Làm ngoài pipeline `auto-issues` (rào "không tự sửa", K45), như T-369.

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-373 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

- Ghi chú review PR #1056 — T-373 (#1059, PR #1061, `REVIEW: PASS` @`f397956`). Số dòng theo `main` `f4490e1`:
  - #1056, `tools/auto-wait-core.mjs:181` (`ciState`, sau bước tìm check đỏ `:176`–`:179`; ca chờ "no check of run" dời xuống `:188`–`:193`): với `--since`, run `pull_request` mới nhất kết thúc `failure` mà rollup chưa có check đỏ nào của nó (chỉ có check xanh của run, hay chưa có check nào của run) nay báo `done: true`, `EXIT.bad`, text `CI red @<head>: run <id> failed, no red check of it yet`, theo hướng "báo đỏ theo run" của Issue. Có check đỏ của run thì vẫn nêu tên check; `cancelled` / `startup_failure` vẫn mã 3; ca chờ chỉ còn cho run `success` chưa có check nào. Unit `calls a failed run red even when the head shows no red check of it yet` (`tools/auto-wait-core.test.mjs`). Review #1061 có một ghi chú mới, ghi ở OPEN [G7].

---

# Issue #1079 — T-374: Mục sổ G7: hàng đợi lưu idle() chờ hết lượt ghi, ca capability kiểm đủ nguồn quyền (review #1064)

Trạng thái: CLOSED · nhãn: type:task, risk:med, status:in-progress, ready-for-agent

##### Mục tiêu

Hai ghi chú không chặn của review PR #1064 (T-364), cả hai về lớp lưu dữ liệu của app desktop:

- **`idle()` của hàng đợi lưu chờ hết mọi lượt ghi**, đúng doc của nó ("Resolves once no write is running or waiting"), kể cả khi listener nghe lượt ghi cuối xong lại ghi tiếp.
  - **Hiện nay:** `idle()` trả về `drain` đang chạy lúc gọi. Từ T-364, listener ghi sau lượt ghi cuối thì mở một `drain` mới, nên `idle()` gọi trước đó xong sớm, khi lượt ghi của listener còn chạy. Probe của review trên bản sao module (Node 24): `persist(v1)`, gọi `idle()`, listener nghe `v1` xong gọi `persist(v2)` rồi `persist(v3)`. Kết quả: `idle()` xong khi trên đĩa là `v1`, `v2` đang ghi, `v3` còn chờ, `saving: true`.
  - **Sau task:** `idle()` lặp chờ như vòng của `flush()` (`while (running) await running;`) và chỉ xong khi không còn lượt ghi nào chạy hay chờ. `idle()` vẫn không chờ việc `track`, như doc của `track`.
  - Sản phẩm hiện không gặp lỗi này: không listener nào ghi, và `backUp` gọi `idle()` trong một lượt đã chặn mọi lệnh ghi. Với listener ghi một lần, lỗi có từ trước T-364.
- **Ca hợp đồng capability kiểm đủ nguồn quyền của Tauri.** Ca "allows the webview only the Tauri commands it uses" tự nhận là "the one check of them all" của quyền webview, nhưng còn hai nguồn chưa kiểm:
  - `tauri_build::Attributes::capabilities_path_pattern` trong build script, đổi thư mục Tauri đọc file capability (tauri-build 2.6.3);
  - `Manager::add_capability` gọi lúc chạy trong lib.rs (tauri 2.11.6; feature `dynamic-acl` nằm trong bộ feature mặc định).

  Hôm nay build script chỉ gọi `tauri_build::build()` và lib.rs không có `add_capability`, nên ca xanh ngay. Ca chỉ thêm `expect` để báo đỏ khi sau này có một trong hai.

##### Bối cảnh

- Nguồn: ghi chú không chặn của review PR #1064 (T-364, #1046: L5-B; `REVIEW: PASS` @`bf47b5e`, mức med; merge 05/11 (`merge-pr --owner`), squash `292a63e`): https://github.com/AlexH-AI/Project-2C/pull/1064#issuecomment-6658343401.
- Sổ: PR #1065 ghi hai ghi chú vào OPEN, gắn [G7]. PR nhãn sổ của đợt này gắn lại nhãn sang Issue này.
- Owner 04/11 (K47): sửa hết rồi mới G7. Owner 06/11/2026 duyệt đề xuất gom sổ của pipeline `auto-issues`: 5 Issue T-374…T-378.

##### Tài liệu cần đọc

- `apps/desktop/src/data/persist-queue.ts` ở `main` `c8f9c76`: doc của `idle` (`:17`), `drain` (`:83`; dừng sau lượt ghi cuối, `:105`), `idle` (`:115`), vòng chờ của `flush()` (`:138`).
- `apps/desktop/src/data/persist-queue.test.ts`: ca "runs one write at a time when a listener told of a save saves twice, and flush() waits for both (DR6-162)" (`:323`), ca "counts tracked work as saving until it settles; flush() waits for it and what it persists" (`:152`).
- `apps/desktop/src/data/app-data.ts:403` (`backUp` gọi `idle()`; chỉ đọc).
- `apps/desktop/src/data/tauri-contract.test.ts`: `rust` / `lib` (`:18`–`:20`), `desktop` (`:271`), ca "allows the webview only the Tauri commands it uses" (`:338`).
- `apps/desktop/src-tauri/build.rs`, `apps/desktop/src-tauri/src/lib.rs` (chỉ đọc).
- `docs/state/review-notes.md`, mục OPEN, nhóm "Ghi chú không chặn của review PR #1064".

##### File / thư mục được phép sửa

- `apps/desktop/src/data/persist-queue.ts`, `apps/desktop/src/data/persist-queue.test.ts`
- `apps/desktop/src/data/tauri-contract.test.ts`
- Không sửa `apps/desktop/src-tauri/**`, nên không cần nhãn `build-exe`.

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files apps/desktop/src/data/persist-queue.ts apps/desktop/src/data/persist-queue.test.ts apps/desktop/src/data/tauri-contract.test.ts` (sổ @ `c8f9c76`): 2 mục "Trùng file", là hai ghi chú Issue này sửa. **Gộp cả hai** (đã tính vào cỡ):

- L16 `persist-queue.ts:115`: `idle()` xong trước lượt ghi do listener mở.
- L17 `tauri-contract.test.ts:348`: ca capability chưa kiểm `capabilities_path_pattern` và `add_capability`.

Sau PR nhãn sổ, hai mục này mang nhãn T-374. Phiên làm task chạy lại `notes-for <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- `PersistQueue.idle(): Promise<void>` giữ chữ ký và doc. Không đổi `persist`, `track`, `flush`, `failed`, hay cách báo trạng thái lưu.
- Không đổi file nào của `src-tauri`; quyền của webview không đổi.

##### Test chấp nhận

- [ ] Ca mới của hàng đợi lưu: `persist(v1)`, gọi `idle()`, listener nghe `v1` xong gọi `persist(v2)` rồi `persist(v3)`. `idle()` chỉ xong khi trên đĩa là `v3` và không lượt ghi nào chạy hay chờ (`saving: false`). Ca này đỏ trước khi sửa `idle`.
- [ ] `idle()` không chờ việc `track`: có một việc `track` chưa xong, không lượt ghi nào → `idle()` xong ngay.
- [ ] Mọi ca hiện có của test hàng đợi lưu và của `app-data` xanh, không sửa.
- [ ] Ca "allows the webview only the Tauri commands it uses" kiểm thêm: build script của `src-tauri` không có `capabilities_path_pattern`, lib.rs không có `add_capability`. Ca xanh trên code hiện tại. Probe tạm (không commit): thêm một trong hai chữ đó vào chuỗi đọc được thì ca đỏ. Thân PR ghi cách thử.
- [ ] `pnpm verify` xanh; e2e xanh trên CI.
- [ ] Thân PR có dòng cho hai mục L16, L17 trong "Ghi chú OPEN liên quan".

Ước lượng: ≈ 3–5 dòng SP + ≈ 30–40 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển hai ghi chú sang RESOLVED

##### Rủi ro

risk:med (đường lưu dữ liệu, như T-364).

##### Bị chặn bởi

Không.

## PR #1090 — fix: idle() of the save queue waits for writes a listener starts, capability case checks every source (T-374)

Trạng thái: MERGED · merge 2026-11-06T04:00:06Z · commit `bf8dee7a4225a74f461cfe11053b1009f94abffa` · nhánh `task/T-374-idle-waits-all-writes` · nhãn: risk:med

Closes #1079

Phiên code: coding-ses1 (auto-issues)

#### Thay đổi

- **`idle()` của hàng đợi lưu chờ hết mọi lượt ghi** (`persist-queue.ts`): `idle()` thành `async` và lặp `while (running) await running;`, như vòng chờ của `flush()`. Listener nghe lượt ghi cuối xong mà ghi tiếp thì mở `drain` mới; `idle()` gọi trước đó nay chờ cả `drain` đó, chỉ xong khi không lượt ghi nào chạy hay chờ. `idle()` vẫn không chờ việc `track`, đúng doc của `track`. Chữ ký và doc của `idle` không đổi; `persist`, `track`, `flush`, `failed`, cách báo trạng thái lưu không đổi. `backUp` của `app-data` (chỉ đọc) không đổi.
- **Ca capability kiểm đủ nguồn quyền** (`tauri-contract.test.ts`, ca "allows the webview only the Tauri commands it uses"), thêm `expect`:
  - `src-tauri/Cargo.toml` không có khóa `build =` (build script là `build.rs`, không file nào khác);
  - `src-tauri/build.rs` không có `capabilities_path_pattern` (tauri-build đổi thư mục đọc file capability);
  - mọi file `.rs` dưới `src-tauri/src/` (có `lib.rs`) không có `add_capability` (`Manager::add_capability` lúc chạy, feature `dynamic-acl`). Quét cả thư mục thay vì chỉ `lib.rs`, để lệnh gọi ở module khác cũng báo đỏ.
- Không sửa `apps/desktop/src-tauri/**` nên không gắn `build-exe`. Không thêm khóa i18n, không thêm dependency.

#### Test chấp nhận

- [x] Ca mới "idle() waits for the writes a listener told of the last one starts too": `persist(v1)`, gọi `idle()`, listener nghe `v1` xong gọi `persist(v2)` rồi `persist(v3)`. Lúc `idle()` xong: trên đĩa `v3`, `saving: false`, `failed: false`; `started` = `v1, v2, v3`. **Đỏ trước khi sửa** `idle`: nhận `onDisk: 'v1'`, `saving: true` (đúng probe của review).
- [x] Ca mới "idle() does not wait for work tracked": một việc `track` chưa xong, không lượt ghi nào → `idle()` xong sau một tick, trạng thái vẫn `saving: true`. Ca này xanh cả trước khi sửa (ca chặn hồi quy). Probe tạm (không commit): cho `idle()` chờ cả việc `track` (`while (running || tracked.size > 0) await (running ?? Promise.allSettled(tracked));`) → ca này đỏ (`expected false to be true`); ca hiện có "counts tracked work as saving until it settles…" (`:152`) cũng đỏ.
- [x] Mọi ca hiện có của `persist-queue.test.ts` và `app-data.test.ts` xanh, không sửa (95 ca của hai file).
- [x] Ca capability xanh trên code hiện tại. Probe tạm (không commit; script sửa chuỗi đọc được trong file test, chạy `vitest run src/data/tauri-contract.test.ts -t "allows the webview"`, rồi trả file về nguyên văn; `git diff --stat` sau probe không đổi):
  - nối `tauri_build::try_build(tauri_build::Attributes::new().capabilities_path_pattern("x/*.json"))` vào chuỗi đọc từ `build.rs` → đỏ: `expected 'fn main() {\n    tauri_build::build()…' not to contain 'capabilities_path_pattern'`;
  - nối `app.add_capability(extra)?;` vào chuỗi đọc từ `lib.rs` → đỏ: `lib.rs: expected '// Keep the Rust layer thin: business…' not to contain 'add_capability'`;
  - nối `build = "other.rs"` vào chuỗi đọc từ `Cargo.toml` → đỏ: `expected '[package]\nname = "project2c"\nversio…' not to match /^build\s*=/m`.
- [x] `pnpm verify` xanh ở local (130 file test, 4471 test). e2e: chờ CI.
- [x] Thân PR có dòng cho L16, L17 (mục dưới).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `e06fea5`): 2 mục "Trùng file", đều là mục Issue này gộp.

- L16 `persist-queue.ts:115` (`idle()` xong trước lượt ghi do listener mở): **đã sửa**. `idle()` lặp chờ tới khi không còn `drain` nào.
- L17 `tauri-contract.test.ts:348` (ca capability chưa kiểm `capabilities_path_pattern` và `add_capability`): **đã sửa**. Thêm `expect` cho build script (kèm khóa `build` của Cargo.toml) và mọi file Rust của `src-tauri/src`.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-374 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

- Ghi chú review PR #1064 — T-374 (#1079, PR #1090, `REVIEW: PASS` @`e06fea5`). Số dòng theo `main` `bf8dee7`:
  - #1064, `apps/desktop/src/data/persist-queue.ts:115` (`idle`; vòng chờ của `flush()` `:141`): `idle()` thành `async` và lặp chờ `running` như vòng của `flush()`, nên chờ cả `drain` mà listener nghe lượt ghi cuối mở; vẫn không chờ việc `track`. Chữ ký và doc không đổi. Ca ở `apps/desktop/src/data/persist-queue.test.ts:348` (listener nghe `v1` ghi `v2`, `v3`: lúc `idle()` xong, đĩa là `v3`, `saving: false`; với bản cũ là `v1`, `saving: true`) và `:369` (`idle()` không chờ việc `track`).
  - #1064, `apps/desktop/src/data/tauri-contract.test.ts:338` (ca "allows the webview only the Tauri commands it uses"; các `expect` mới `:355`–`:364`): ca kiểm thêm rằng Cargo.toml của src-tauri không có khóa `build` (build script chỉ là build.rs), build.rs không có `capabilities_path_pattern`, và mọi file Rust dưới src-tauri/src (không chỉ lib.rs) không có `add_capability`. Thân PR #1090 ghi probe đỏ cho từng chữ. Không chạm `src-tauri`, nên không cần nhãn `build-exe`.

---

# Issue #1080 — T-375: Mục sổ G7: một luật câu dán trống, Mock nhận "đứa / thằng … đã mất", rule test-support chung (review #1066)

Trạng thái: CLOSED · nhãn: type:task, risk:med, status:in-progress, ready-for-agent

##### Mục tiêu

Bốn ghi chú không chặn của review PR #1066 (T-365), cả bốn ở `packages/ai` hoặc liền với nó:

- **Một luật "câu dán trống" cho khung dán ChatGPT web** (hai ghi chú). `@p2c/ai` export một hàm (vd. `isBlankWebAnswer`); cả `checkWebAnswer` lẫn nút "Kiểm tra và lưu" của phiên ChatGPT web đều dùng hàm này.
  - **Hiện nay:** nút tắt khi `normalizeText(pasted) === ''`. Nghĩa là cả câu dán bị chuẩn hóa ở mỗi lần render, không giới hạn độ dài (ô nhập không có `maxLength`). Trong khi đó `checkWebAnswer` báo `TOO_LONG` trước, không chuẩn hóa câu dán quá `MAX_READ` (DR5-09). Số đo của review (Node 24, cùng regex của `normalizeText`):
    - 1 triệu ký tự: 20 ms;
    - 5 triệu: 115 ms;
    - 20 triệu (cỡ ca DR5-09): ≈ 560 ms, cộng vài bản sao chuỗi ≈ 40 MB, ở mỗi phím gõ và mỗi lần render lại.

    Luật được viết hai lần và hai chỗ đã khác nhau với câu dán quá `MAX_READ`.
  - **Sau task:** câu dán dài hơn `MAX_READ` không bị chuẩn hóa ở đâu cả. Với câu dán đó, hàm trả "không trống": nút bật, bấm thì `checkWebAnswer` báo `TOO_LONG` và không tính lần thử, như nay. Câu dán dài tới `MAX_READ` là trống khi `normalizeText` ra rỗng, như nay (K20, DR6-168).
- **Mock trích xuất, luật mới (Owner duyệt 06/11/2026).** Ở nhánh "con đã mất theo cách khác" (`otherDeaths`), "đứa", "thằng" cũng là chữ chỉ một đứa trẻ, cạnh "con / bé".
  - Ví dụ: "KH có 2 con. Đứa nhỏ bé đã mất." và "KH có 2 con. Đứa nhỏ đã mất." → không đề xuất Số con. Hiện nay cả hai ra 2: câu đầu từ khi miễn "nhỏ bé" (DR6-166), câu sau có từ trước T-365 vì "đứa" không thuộc `CHILD_WORD`.
  - Theo hướng an toàn của CX-A4: thà không đề xuất còn hơn đề xuất sai. §10 của spec Phase 5 ghi luật này.
  - `CHILD_WORD` và mọi luật khác (luật người khác, `DEAD_CHILDREN`) không đổi.
- **Một rule test-support chung cho mọi package.** Rule `ai-test-support-only-in-tests` của dependency-cruiser nay chỉ khớp `to` của `packages/ai`. Vì vậy một file sản phẩm của `packages/ai` import file test của `packages/domain` (file có `vitest`) không bị rule nào chặn, vì `ai-only-on-domain-and-zod` cho phép `domain`.
  - **Sau task:** một rule chung `from: { pathNot: TEST_FILES }, to: { path: TEST_FILES }` chặn mọi file sản phẩm import file test hay test-support của bất kỳ package / app nào, cả test-support của `packages/db`.
  - Review đã thử cấu hình này trên head `5798016` (`depcruise apps packages`, cấu hình tạm ngoài repo): 0 vi phạm (354 module, 1 583 phụ thuộc).

##### Bối cảnh

- Nguồn: ghi chú không chặn của review PR #1066 (T-365, #1047: L5-C; `REVIEW: PASS` @`5798016`, mức high; merge 05/11 (`merge-pr --owner`), squash `509b785`): https://github.com/AlexH-AI/Project-2C/pull/1066#issuecomment-6659461913.
- Sổ: PR #1067 ghi bốn ghi chú vào OPEN, gắn [G7]. PR nhãn sổ của đợt này gắn lại nhãn sang Issue này.
- **Quyết định Owner 06/11/2026** (duyệt đề xuất gom sổ của pipeline `auto-issues`, mục sổ dòng 21): thêm "đứa / thằng … đã mất" vào nhánh `otherDeaths` và sửa §10 của spec Phase 5. Quyết định này bổ sung quyết định (b) ngày 05/11 trên #1047 (miễn "nhỏ bé", DR6-166), không thay nó.
- Owner 04/11 (K47): sửa hết rồi mới G7.
- Task không đổi prompt, không chạm tài liệu G5, không đổi kết quả của `checkWebAnswer` với bất kỳ câu dán nào.

##### Tài liệu cần đọc

- `docs/design/phase-5-ai.md` §10: gạch "Số con (T-330)" (con đã mất, miễn "nhỏ bé", `:381`) và gạch "Mỗi trường lấy giá trị cuối cùng…" (luật người khác, `:383`).
- `packages/ai/src/web.ts` ở `main` `c8f9c76`: `MAX_READ` (`:108`), `checkWebAnswer` (`:145`–`:152`).
- `packages/ai/src/web.test.ts`: ca câu dán trống (K20, DR6-168, `:280`), ca DR5-09 (`:471`–`:476`).
- `packages/ai/src/index.ts` (export của `@p2c/ai`); `packages/ai/CLAUDE.md` (bản đồ export, sinh lại bằng `pnpm codemap`).
- `apps/desktop/src/routes/customers/KycWebSession.tsx`: ô dán (`:153`), nút "Kiểm tra và lưu" (`:176`–`:180`).
- `packages/ai/src/mock-extraction.ts`: `CHILD_WORD` (`:88`), `CHILD` (`:344`–`:352`), `otherDeaths` (`:355`–`:381`).
- `packages/ai/src/mock-extraction.test.ts`: các ca "nhỏ bé" (`:1137`–`:1164`).
- `.dependency-cruiser.cjs`: `TEST_FILES` (`:7`), rule `ai-only-on-domain-and-zod` (`:25`–`:32`), `ai-test-support-only-in-tests` (`:33`–`:40`).
- `docs/state/review-notes.md`, mục OPEN, nhóm "Ghi chú không chặn của review PR #1066".

##### File / thư mục được phép sửa

- `packages/ai/src/web.ts`, `packages/ai/src/web.test.ts`, `packages/ai/src/index.ts`, `packages/ai/CLAUDE.md` (bản đồ export sinh lại)
- `apps/desktop/src/routes/customers/KycWebSession.tsx`
- `packages/ai/src/mock-extraction.ts`, `packages/ai/src/mock-extraction.test.ts`
- `docs/design/phase-5-ai.md` (chỉ gạch Số con của §10)
- `.dependency-cruiser.cjs`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` với các đường dẫn ở ô trên (sổ @ `c8f9c76`) cho 4 mục "Trùng file", là bốn ghi chú Issue này sửa. **Gộp cả bốn** (đã tính vào cỡ):

- L19 `KycWebSession.tsx:178`: nút chuẩn hóa cả câu dán ở mỗi lần render.
- L20 `packages/ai/src/web.ts:147` + `KycWebSession.tsx:178`: luật "câu dán trống" viết hai lần.
- L21 `packages/ai/src/mock-extraction.ts:350`: "Đứa nhỏ bé đã mất" ra Số con.
- L22 `.dependency-cruiser.cjs:39`: rule test-support chỉ khớp `packages/ai`.

Sau PR nhãn sổ, bốn mục này mang nhãn T-375. Phiên làm task chạy lại `notes-for <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- `@p2c/ai` export thêm `isBlankWebAnswer(pasted: string): boolean` (tên do phiên làm task chọn và ghi ở thân PR):
  - `false` khi `pasted.length > MAX_READ`, không chuẩn hóa câu đó;
  - ngược lại là `normalizeText(pasted) === ''`.
- `checkWebAnswer` giữ thứ tự `OWN_MESSAGE` → `TOO_LONG` (theo `MAX_READ`) → `EMPTY` → `TOO_LONG` (theo code point). Kết quả của mọi ca không đổi.
- Màn phiên ChatGPT web không gọi `normalizeText` trực tiếp cho nút nữa.
- Mock trích xuất: chỉ nhánh `otherDeaths` nhận thêm "đứa", "thằng". Chữ đứng riêng một từ, không phân biệt hoa thường, như `CHILD`.
- dependency-cruiser: rule chung thay `ai-test-support-only-in-tests` (tên rule do phiên chọn); `comment` nêu nguồn DR6-167 và review #1066.

##### Test chấp nhận

- [ ] `isBlankWebAnswer`:
  - chuỗi rỗng, chỉ khoảng trắng, chỉ ký tự vô hình (U+200B, U+2060, U+0085) → trống;
  - có chữ → không trống;
  - dài `MAX_READ + 1` toàn khoảng trắng → không trống.
- [ ] `checkWebAnswer`: câu dán dài hơn `MAX_READ`, toàn khoảng trắng → `TOO_LONG`, không tính lần thử, như nay. Mọi ca hiện có của test khung web xanh, không sửa.
- [ ] Nút "Kiểm tra và lưu" tắt / bật theo hàm mới. Các ca e2e hiện có của khung dán ChatGPT web xanh.
- [ ] Mock trích xuất, mỗi câu → không đề xuất Số con, đỏ trước khi sửa:
  - "KH có 2 con. Đứa nhỏ bé đã mất.";
  - "KH có 2 con. Đứa nhỏ đã mất.";
  - "KH có 2 con. Thằng út đã mất.".
- [ ] Mock trích xuất, giữ như nay: "KH có 3 con. Vụ mất điện ở căn nhà nhỏ bé." → 3. Mọi ca hiện có của test Mock trích xuất xanh, không sửa.
- [ ] §10 của spec Phase 5, gạch Số con, ghi luật mới kèm ví dụ trên và nguồn (Owner 06/11/2026).
- [ ] dependency-cruiser:
  - trên code hiện tại `pnpm lint:deps` 0 vi phạm;
  - probe tạm (không commit): một file sản phẩm của `packages/ai` import một file test của `packages/domain` → rule chung báo lỗi. Thân PR ghi cách thử.
- [ ] `pnpm verify` xanh (gồm bản đồ export); e2e xanh trên CI.
- [ ] Thân PR có dòng cho bốn mục L19–L22 trong "Ghi chú OPEN liên quan".

Ước lượng: ≈ 20–30 dòng SP + ≈ 50–70 dòng test, cộng ≈ 3 dòng spec.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển bốn ghi chú sang RESOLVED

##### Rủi ro

risk:med (`packages/ai`, luật mới của Mock trích xuất, như T-365).

##### Bị chặn bởi

Không.

## PR #1086 — fix: one blank-paste rule for ChatGPT web, Mock reads "đứa / thằng … đã mất", one test-support rule (T-375)

Trạng thái: MERGED · merge 2026-11-06T02:41:07Z · commit `e0806b8e77e205de5372b5849e42998c55d0278a` · nhánh `task/T-375-blank-web-answer-otherdeaths-depcruise` · nhãn: risk:med

Closes #1080

#### Thay đổi

- **Một luật câu dán trống** (L19, L20). `@p2c/ai` export `isBlankWebAnswer(pasted: string): boolean` (`packages/ai/src/web.ts`; tên phiên chọn):
  - `false` khi `pasted.length > MAX_READ`, không chuẩn hóa câu đó (DR5-09);
  - ngược lại là `normalizeText(pasted) === ''` (K20, DR6-168).

  `checkWebAnswer` dùng hàm này ở bước `EMPTY`. Thứ tự `OWN_MESSAGE` → `TOO_LONG` (theo `MAX_READ`) → `EMPTY` → `TOO_LONG` (theo code point) giữ nguyên, kết quả mọi ca không đổi. Nút "Kiểm tra và lưu" (`KycWebSession.tsx`) tắt theo `isBlankWebAnswer`; màn không import `normalizeText` nữa. Câu dán toàn khoảng trắng dài hơn `MAX_READ`: nút bật, bấm thì `TOO_LONG`, không tính lần thử.
- **Mock trích xuất** (L21, Owner 06/11/2026). `CHILD`, regex chỉ nhánh `otherDeaths` dùng, nhận thêm "đứa", "thằng": đứng riêng một từ, không phân biệt hoa thường, như "con / bé". `CHILD_WORD`, `DEAD_CHILDREN` và luật người khác không đổi. §10 của spec Phase 5, gạch Số con: luật mới, ví dụ của Issue, nguồn.
- **dependency-cruiser** (L22). Rule chung `test-files-only-in-tests` (tên phiên chọn) thay `ai-test-support-only-in-tests`: `from: { pathNot: TEST_FILES }, to: { path: TEST_FILES }`; `comment` nêu DR6-167 và review #1066.
- **`packages/ai/CLAUDE.md`**: bản đồ export sinh lại (`pnpm codemap`).
  - Ở `main` file dài 7 999 / 8 000 ký tự. Thêm `isBlankWebAnswer` vượt chỗ, nên `codemap` lùi về dạng chỉ tên file và bản đồ mất mọi tên export.
  - Để giữ bản đồ đầy đủ, dòng "ChatGPT web" (phần viết tay) bỏ ", `prompt_version` `webPromptVersion`". Dạng `prompt_version` đã có ở dòng "Mã lỗi", còn `webPromptVersion` có trong bản đồ. Dòng đó cũng ghi "dán trống" thay "dán rỗng", theo luật mới. File còn 7 981 ký tự.

#### Test chấp nhận

- [x] `isBlankWebAnswer` (`web.test.ts`, khối `describe` mới):
  - rỗng, chỉ khoảng trắng, chỉ ký tự vô hình (U+200B, U+2060, U+0085), khoảng trắng dài đúng `MAX_READ` → trống;
  - có chữ, có dấu chấm, khoảng trắng dài `MAX_READ + 1` → không trống.

  Đỏ trước khi có hàm (7 ca), xanh sau.
- [x] `checkWebAnswer`: bảng "does not count a paste that is …" thêm một dòng, `' '.repeat(MAX_READ + 1)` → `TOO_LONG`, không tính lần thử ở lần 1 lẫn lần 2. Các ca hiện có không sửa, xanh (70 ca).
- [x] Nút "Kiểm tra và lưu" tắt / bật theo `isBlankWebAnswer`. `pnpm exec playwright test e2e/customer-ai-web.spec.ts` chạy local: 11/11 xanh.
  - Probe local, không commit (file e2e ngoài danh sách được sửa): thêm vào ca đầu bước `box.fill(' '.repeat(40_001))`, bấm nút, chờ "Câu trả lời dài quá 20.000 ký tự" và "Lần thử 1 / 2".
  - Trước khi sửa nút: đỏ ở `save.click()` (nút tắt). Sau khi sửa: xanh.
- [x] Mock trích xuất (`mock-extraction.test.ts`, bảng rule 3):
  - "KH có 2 con. Đứa nhỏ bé đã mất.", "KH có 2 con. Đứa nhỏ đã mất.", "KH có 2 con. Thằng út đã mất." → không đề xuất Số con. Đỏ trước khi sửa (cả ba ra 2), xanh sau.
  - Thêm "KH có 2 con, thằng út đã qua đời." → không đề xuất. Ca này xanh cả trước khi sửa, nhờ chữ kết thúc "qua đời" sau số con trong cùng câu.
  - "KH có 3 con. Vụ mất điện ở căn nhà nhỏ bé." → 3, như nay. 704 ca xanh, ca cũ không sửa.
- [x] §10 của spec Phase 5, gạch Số con: luật mới, ba ví dụ, nguồn (Owner 06/11/2026).
- [x] dependency-cruiser:
  - `pnpm lint:deps` trên code của PR: 0 vi phạm (354 module, 1 583 phụ thuộc).
  - Probe tạm, không commit, ba file:
    - `packages/ai/src/zz-probe.ts`: `export * from '../../domain/src/text.test';`
    - `packages/db/src/zz-probe.ts`: `export * from './test-support';`
    - `apps/desktop/src/zz-probe.ts`: `export * from '../../../packages/db/src/test-support';`
  - `pnpm exec depcruise apps packages` với cấu hình mới: 3 lỗi `test-files-only-in-tests`, đúng ba cạnh trên (357 module, 1 586 phụ thuộc).
  - Cùng ba file với cấu hình của `main` (`git show main:.dependency-cruiser.cjs` ra file tạm, chạy với `--config`): 0 vi phạm.
- [x] `pnpm verify` xanh ở local (gồm bản đồ export); e2e chờ CI.
- [x] Mục "Ghi chú OPEN liên quan" có dòng cho L19–L22.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `5efc47e`): 4 mục "Trùng file".

- L19 `KycWebSession.tsx:178`, nút chuẩn hóa cả câu dán ở mỗi lần render: đã sửa. Nút dùng `isBlankWebAnswer`, không chuẩn hóa câu dán dài hơn `MAX_READ`.
- L20 `web.ts:147` + `KycWebSession.tsx:178`, luật "câu dán trống" viết hai lần: đã sửa. Một hàm `isBlankWebAnswer` cho cả `checkWebAnswer` lẫn nút.
- L21 `mock-extraction.ts:350`, "Đứa nhỏ bé đã mất" ra Số con: đã sửa. Nhánh `otherDeaths` nhận "đứa", "thằng" (Owner 06/11/2026); §10 ghi luật.
- L22 `.dependency-cruiser.cjs:39`, rule test-support chỉ khớp `packages/ai`: đã sửa. Rule chung `test-files-only-in-tests`.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

Phiên code: coding-ses1 (auto-issues)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-375 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

- Ghi chú review PR #1066 — T-375 (#1080, PR #1086, `REVIEW: PASS` @`2e4edfc`). Số dòng theo `main` `e0806b8`:
  - #1066, `apps/desktop/src/routes/customers/KycWebSession.tsx:178` (nút "Kiểm tra và lưu"): nút tắt theo `isBlankWebAnswer` của `@p2c/ai` (`packages/ai/src/web.ts:129`), màn không gọi `normalizeText` nữa. Hàm trả "không trống" cho câu dán dài hơn `MAX_READ` (`:108`) mà không chuẩn hóa câu đó, nên mỗi lần render chuẩn hóa tối đa `MAX_READ` code unit. Câu dán toàn khoảng trắng dài hơn `MAX_READ`: nút bật, bấm thì `checkWebAnswer` báo `TOO_LONG`, không tính lần thử, như Issue #1080 chốt. Unit: khối `isBlankWebAnswer` của `packages/ai/src/web.test.ts:544` (rỗng, khoảng trắng, ký tự vô hình, biên `MAX_READ` / `MAX_READ + 1`); các ca e2e có sẵn của khung dán xanh trên CI.
  - #1066, *Duplicated Code* `packages/ai/src/web.ts:156` và `apps/desktop/src/routes/customers/KycWebSession.tsx:178`: luật "câu dán trống" nay chỉ ở một hàm, `isBlankWebAnswer`, cho cả bước `EMPTY` của `checkWebAnswer` (`:156`) lẫn nút. Thứ tự `OWN_MESSAGE` → `TOO_LONG` theo `MAX_READ` (`:155`) → `EMPTY` → `TOO_LONG` theo code point giữ nguyên, kết quả mọi câu dán không đổi. Bảng "does not count a paste that is …" thêm ca khoảng trắng dài `MAX_READ + 1` → `TOO_LONG`, không tính lần thử ở lần 1 lẫn lần 2 (`packages/ai/src/web.test.ts:286`).
  - #1066, `packages/ai/src/mock-extraction.ts:352` (`CHILD`; `otherDeaths` `:365`): theo luật mới Owner duyệt 06/11/2026, "đứa", "thằng" cũng là chữ chỉ một người con ở nhánh `otherDeaths`, nên "KH có 2 con. Đứa nhỏ bé đã mất.", "KH có 2 con. Đứa nhỏ đã mất.", "KH có 2 con. Thằng út đã mất." không đề xuất Số con (`packages/ai/src/mock-extraction.test.ts:1146`–`:1149`). `CHILD_WORD`, `DEAD_CHILDREN` và luật người khác không đổi. §10 của `docs/design/phase-5-ai.md` (gạch Số con, `:381`) ghi luật, ba ví dụ và nguồn. Review #1086 kiểm thêm: hai chữ chỉ có thể bỏ một đề xuất Số con, không tạo đề xuất sai (CX-A4).
  - #1066, `.dependency-cruiser.cjs:34` (rule `test-files-only-in-tests`, thay `ai-test-support-only-in-tests`): `from: { pathNot: TEST_FILES }, to: { path: TEST_FILES }` (`:38`–`:39`) chặn mọi file sản phẩm import file test hay test-support của bất kỳ package / app nào, cả `packages/db/src/test-support.ts`. Thân PR #1086 ghi probe ba file tạm: cấu hình mới báo đúng 3 lỗi, cấu hình của `main` trước đó 0; `pnpm lint:deps` trên code 0 vi phạm. Review #1086 không có ghi chú mới.

---

# Issue #1081 — T-376: Mục sổ G7: dọn nhỏ bộ chặn ký hiệu, trần tên ô bảng và khung SelectField (review #1068, #1070)

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Sáu ghi chú không chặn nhỏ ở lớp UI. Task không đổi hình nào trên màn, nên ảnh hướng dẫn không phải chụp lại.

**Bộ chặn ký hiệu `findHardcodedSeparators`** (bốn ghi chú của review PR #1068, T-366):

- **`concat(` được xử như `.join(`.** `a.concat(', ', b)` bị báo `hardcoded-separator`. Bản trước T-366 báo dạng này, `31f7fc2` thì không. Chuỗi thay thế của `replace(` (`text.replace(/\n/g, ', ')`) vẫn không báo: nếu báo thì trái ca (c) của #1048 (`text.replace(', ', '; ')` không báo). Đoạn "Limits" của doc nêu thêm dạng này, bên cạnh `parts.push(', ')`.
- **Doc nêu escape trong chuỗi thuộc tính JSX.** `<p title="·" />` bị báo `hardcoded-separator`, dù thuộc tính JSX không giải mã escape (chữ hiện ra là `·`). Đó vẫn là chuỗi cứng nên giữ báo; chỉ ghi vào doc.
- **Thử `JOINER` trước.** Khi đóng chuỗi, phép thử rẻ `JOINER` chạy trước; chỉ khi khớp mới cắt chuỗi và tính `whole` / `CALLEE`. Kết quả không đổi.
- **Ghim dạng `{" "}` sau dấu nối.** Ca "flags a joiner of JSX however Prettier breaks it, and before an element" thêm dạng `{a},{" "}` ⏎ `{b}` (nháy kép), dạng #1048 nêu "(cả `{" "}`)". Dạng này đã bị báo; chỉ thiếu ca ghim.

**Class dùng chung** (hai ghi chú của review PR #1070, T-367):

- **Trần tên của ô bảng là một hằng.** `block max-w-60 wrap-anywhere` hiện khai hai lần thành `NAME` cục bộ (màn KH, màn Lịch hẹn) và viết thẳng lần ba (lịch sử KYC). Sau task, cả ba dùng một hằng ở module class dùng chung (DR6-67). `NAME` của bảng báo cáo khác chuỗi (thêm `w-max`, `whitespace-normal`) nên giữ riêng, kèm chú thích vì sao khác. Nút tên KH của màn Lịch hẹn (cùng họ, khác class) giữ nguyên.
- **Khung `SelectField` không có dấu cách thừa.** Khi không `capped`, class của khung hiện là `flex flex-col gap-1 ` (dấu cách ở cuối). Sau task, chỉ nối thêm class khi `capped`.

##### Bối cảnh

- Nguồn:
  - review PR #1068 (T-366, #1048: L5-D; `REVIEW: PASS` @`09c10ad`, mức low; merge squash `31f7fc2`): https://github.com/AlexH-AI/Project-2C/pull/1068#issuecomment-6660523326. Sổ: PR #1069.
  - review PR #1070 (T-367, #1049: L5-E; `REVIEW: CHANGES` @`0cae315`, rồi `REVIEW: PASS` @`ff39260`, mức low; merge squash `dd5ae56`): https://github.com/AlexH-AI/Project-2C/pull/1070#issuecomment-6663599391. Sổ: PR #1071.
  - Hai vòng review của #1070 đều nêu trần tên. PR để lại vì module class dùng chung nằm ngoài danh sách file của #1049.
- Owner 04/11 (K47): sửa hết rồi mới G7. Owner 06/11/2026 duyệt đề xuất gom sổ của pipeline `auto-issues` (5 Issue T-374…T-378).
- Cũng ngày 06/11/2026, Owner chọn **không sửa** trước v1.0 gợi ý chuyển bộ chặn sang đọc cây cú pháp TypeScript. PR nhãn sổ chuyển mục đó sang ACCEPTED. Task này giữ bộ quét hiện có.

##### Tài liệu cần đọc

- `packages/ui/src/token-guard.ts` ở `main` `c8f9c76`:
  - `JOINER` (`:53`), `CALLEE` (`:56`), `JSX_JOINER` (`:63`), `ESCAPE` (`:79`);
  - doc của `findHardcodedSeparators` (`:84`–`:98`, đoạn "Limits" `:94`);
  - phép thử khi đóng chuỗi (`:152`–`:160`).
- `packages/ui/src/token-guard.test.ts`: ca "flags a joiner of JSX however Prettier breaks it, and before an element" (`:262`); các ca của lời gọi khác `.join(` (ca (c) của #1048).
- `apps/desktop/src/routes/classes.ts` (hằng class dùng chung, DR6-67).
- `apps/desktop/src/routes/customers/CustomersScreen.tsx:57`, `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:78` và `:187`, `apps/desktop/src/routes/customers/KycHistory.tsx:93`.
- `apps/desktop/src/routes/reports/ReportTable.tsx:28`–`:32` (`NAME`, DR6-148).
- `packages/ui/src/components/SelectField.tsx:53` (khung, prop `capped`).
- `docs/state/review-notes.md`, mục OPEN, nhóm "Ghi chú không chặn của review PR #1068" và "… PR #1070".

##### File / thư mục được phép sửa

- `packages/ui/src/token-guard.ts`, `packages/ui/src/token-guard.test.ts`
- `packages/ui/src/components/SelectField.tsx`
- `apps/desktop/src/routes/classes.ts`
- `apps/desktop/src/routes/customers/CustomersScreen.tsx`, `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx`, `apps/desktop/src/routes/customers/KycHistory.tsx`
- `apps/desktop/src/routes/reports/ReportTable.tsx` (chỉ chú thích của `NAME`)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` với các đường dẫn ở ô trên (sổ @ `c8f9c76`) cho 7 mục "Trùng file". Gộp sáu mục (đã tính vào cỡ):

- L24 `token-guard.ts:94`: `concat(` và chuỗi thay thế của `replace(` lọt mà doc chưa nêu. **Gộp.**
- L25 `token-guard.ts:146`: escape trong chuỗi thuộc tính JSX báo sai tên luật. **Gộp** (ghi doc).
- L26 `token-guard.ts:154`: thử `JOINER` trước. **Gộp.**
- L27 `token-guard.test.ts:262`: thiếu ca `{" "}` sau dấu nối. **Gộp.**
- L30 `CustomersScreen.tsx:57`, `AppointmentsScreen.tsx:78`, `KycHistory.tsx:93`: trần tên của ô bảng viết ở ba nơi. **Gộp.**
- L31 `SelectField.tsx:53`: dấu cách thừa trong class của khung. **Gộp.**

Mục thứ bảy để lại:

- L28 `token-guard.ts:99`: gợi ý chuyển bộ chặn sang đọc cây cú pháp TypeScript. **Để lại:** Owner 06/11/2026 chọn không sửa trước v1.0; PR nhãn sổ chuyển sang ACCEPTED, nên `notes-for --diff` sẽ không còn nêu mục này.

Sau PR nhãn sổ, sáu mục gộp mang nhãn T-376 và số dòng từ L30 trở đi lùi một. Phiên làm task chạy lại `notes-for <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- `findHardcodedSeparators(source)` giữ chữ ký và kiểu kết quả. Chỉ thêm `concat` vào các lời gọi coi chuỗi nguyên là dấu nối.
- `classes.ts` export thêm một hằng cho trần tên ô bảng (tên do phiên chọn, vd. `CELL_NAME`). Chuỗi class giữ nguyên `block max-w-60 wrap-anywhere`.
- `SelectFieldProps` không đổi.

##### Test chấp nhận

- [ ] `a.concat(', ', b)` → một vi phạm `hardcoded-separator`; ca này đỏ trước khi sửa.
- [ ] Không báo, như nay: `text.replace(', ', '; ')` (ca (c) của #1048) và `text.split(', ')`.
- [ ] Ca `:262` có thêm dạng `{a},{" "}` ⏎ `{b}`, bị báo. Probe tạm (không commit): đổi nhóm thứ hai của `JSX_JOINER` thành chỉ nhận `{' '}` thì ca đỏ. Thân PR ghi cách thử.
- [ ] Mọi ca hiện có của test bộ chặn xanh, không sửa. Lượt quét toàn app của bộ chặn vẫn 0 vi phạm.
- [ ] Đoạn "Limits" của doc nêu chuỗi thay thế của `replace(`. Doc nêu escape trong chuỗi thuộc tính JSX bị báo dù không giải mã.
- [ ] Màn KH, màn Lịch hẹn, lịch sử KYC dùng hằng mới; không còn `NAME` cục bộ cùng chuỗi ở hai màn đầu. `NAME` của bảng báo cáo có chú thích vì sao khác.
- [ ] Khung `SelectField`: không `capped` → class `flex flex-col gap-1`, không dấu cách thừa; `capped` → `flex min-w-0 max-w-80 flex-col gap-1`, hay chuỗi cùng nghĩa.
- [ ] `pnpm verify` xanh; e2e xanh trên CI, gồm ca quét chuỗi liền dài ở mọi màn (T-367).
- [ ] Thân PR có dòng cho sáu mục gộp trong "Ghi chú OPEN liên quan".

Ước lượng: ≈ 20–30 dòng SP + ≈ 20–30 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển sáu ghi chú sang RESOLVED

##### Rủi ro

risk:low (không đổi hình, không đổi dữ liệu).

##### Bị chặn bởi

Không.

## PR #1092 — fix: separator guard flags concat(, table name cap is one class, SelectField frame has no trailing space (T-376)

Trạng thái: MERGED · merge 2026-11-06T05:04:29Z · commit `64720db1820b719dc4099e3fad9a757d44587402` · nhánh `task/T-376-guard-cleanup-cell-name` · nhãn: risk:low

Closes #1081

Phiên code: coding-ses2 (auto-issues)

#### Thay đổi

- **Bộ chặn ký hiệu** (`packages/ui/src/token-guard.ts`):
  - `JOINS` (`:59`) = `join`, `concat`: chuỗi nguyên `', '` / `'; '` đưa cho `concat(` bị báo như khi đưa cho `.join(` (`a.concat(', ', b)`, `a.concat(b, \`; \`, c)`). Lời gọi khác (`split(`, `replace(`, `replaceAll(`, `push(`) vẫn tha như nay.
  - Khi đóng chuỗi, phép thử rẻ chạy trước (`:161`): chuỗi dài đúng 2 ký tự mới cắt ra thử `JOINER`; chỉ khi khớp mới tính `whole` và `CALLEE`. Kết quả không đổi.
  - Doc của `findHardcodedSeparators`: escape trong chuỗi thuộc tính JSX (`<p title="\u00b7" />`) vẫn bị báo dù JSX không giải mã (chữ hiện ra là `\u00b7`), vì đó vẫn là chuỗi cứng thay cho i18n; đoạn "Limits" (`:100`) nêu `concat(` cạnh `.join(` (và `concat` gọi qua `.call(` vẫn lọt), và chuỗi thay thế của `text.replace(/\n/g, ', ')` cạnh `parts.push(', ')`.
- **Test bộ chặn** (`token-guard.test.ts`): ca mới "flags a separator passed to concat(, not the replacement of replace(" (`:233`); ca "flags a joiner of JSX however Prettier breaks it, and before an element" thêm dạng `{aaaa},{" "}` ⏎ `{bbbb}` (`:295`). Các ca khác không sửa.
- **Trần tên của ô bảng** (`apps/desktop/src/routes/classes.ts:37`): hằng `CELL_NAME = 'block max-w-60 wrap-anywhere'` (chuỗi giữ nguyên). Màn KH (`CustomersScreen.tsx`, cột tên + cột RE), màn Lịch hẹn (`AppointmentsScreen.tsx`, cột RE) bỏ `NAME` cục bộ, dùng `CELL_NAME`; lịch sử phân tích AI (`KycHistory.tsx`) bỏ chuỗi viết thẳng. Nút tên KH của màn Lịch hẹn (`max-w-60 … wrap-anywhere`, khác class) giữ nguyên. `NAME` của `ReportTable.tsx` giữ riêng, thêm chú thích vì sao khác: ô ở đó `whitespace-nowrap` nên tên phải `whitespace-normal` lại, và bảng thường rộng hơn khung (mọi cột ở bề rộng tối thiểu) nên `w-max` giữ bề rộng tối thiểu của tên bằng chính nó tới trần (lý do đo ở PR #922).
- **Khung `SelectField`** (`packages/ui/src/components/SelectField.tsx:53`): `capped ? 'flex min-w-0 max-w-80 flex-col gap-1' : 'flex flex-col gap-1'`, hết dấu cách thừa. `SelectFieldProps` không đổi.
- Không đổi hình trên màn (class giữ nguyên chuỗi), nên không chụp lại ảnh hướng dẫn. Không thêm khóa i18n, không thêm dependency. Không đụng file cần `build-exe`.

#### Test chấp nhận

- [x] `a.concat(', ', b)` → một vi phạm `hardcoded-separator` (ca mới, dòng 1; dòng 2 là `concat(` với chuỗi ở giữa). **Đỏ trước khi sửa**: `expected [] to deeply equal [ …(2) ]`.
- [x] Không báo, như nay: `text.replace(', ', '; ')` và `text.split(', ')` (ca "leaves a separator passed to a call other than .join(", không sửa, xanh). Ca mới ghim thêm `text.replace(/\n/g, ', ')` không báo (giới hạn, như `parts.push(', ')`).
- [x] Ca `:262` có thêm `{aaaa},{" "}` ⏎ `{bbbb}` → `{ line: 18, match: '},{" "} {' }`. Ca này xanh cả trước khi sửa (chỉ ghim). Probe tạm (không commit): script đổi nhóm thứ hai của `JSX_JOINER` từ `\{(?:' '|" ")\}` thành `\{(?:' ')\}`, chạy `vitest run packages/ui/src/token-guard.test.ts` → đỏ đúng ca này (thiếu `match: '},{" "} {'`), 36 ca còn lại xanh; script trả regex về nguyên văn, `git diff` không còn dòng `JSX_JOINER`.
- [x] Mọi ca hiện có của `token-guard.test.ts` xanh, không sửa (37 ca, gồm ca mới). Lượt quét toàn app (`pnpm lint:tokens` trong `pnpm verify`): `Design tokens: no styling that bypasses the tokens in apps/desktop/src, packages/ui/src/components.` (0 vi phạm).
- [x] Đoạn "Limits" nêu chuỗi thay thế của `replace(` (và `concat(` cạnh `.join(`); doc nêu escape trong chuỗi thuộc tính JSX bị báo dù không giải mã.
- [x] Màn KH, màn Lịch hẹn, lịch sử KYC dùng `CELL_NAME`; `grep NAME` hai màn đầu chỉ còn `CELL_NAME`. `NAME` của bảng báo cáo có chú thích vì sao khác.
- [x] Khung `SelectField`: probe tạm (không commit; file test tạm ở `apps/desktop/src/`, render `SelectField` bằng `renderToStaticMarkup`, đọc class của `<div>` ngoài cùng, rồi xóa): không `capped` / `capped={false}` → `flex flex-col gap-1`; `capped` → `flex min-w-0 max-w-80 flex-col gap-1`. Cùng probe trên bản `main` của `SelectField.tsx` → đỏ: `expected 'flex flex-col gap-1 ' to be 'flex flex-col gap-1'`. Không thêm file test cố định vì danh sách file được phép của Issue không có file test nào cho `SelectField`.
- [x] `pnpm verify` xanh ở local (130 file test, 4472 test). e2e (gồm ca quét chuỗi liền dài ở mọi màn, T-367): chờ CI.
- [x] Thân PR có dòng cho sáu mục gộp (mục dưới).

#### Vòng sửa 1 (`cc5a5f0`, sau `REVIEW: CHANGES` @`5c3608b`)

- [chặn] Doc về escape trong chuỗi thuộc tính JSX (`token-guard.ts:95`–`:97`): **đã sửa**. File có ký tự `·` thật (byte `C2 B7`) ở chỗ phải là escape; nay ví dụ là `<p title="\u00b7" />` và "the text shows `\u00b7`". Kiểm: `grep -n $'\xc2\xb7' packages/ui/src/token-guard.ts` chỉ còn ba dòng có từ trước (`MARKS`, `ENTITIES`, câu đầu của doc).
- [không chặn] Cắt chuỗi chỉ để thử `JOINER`: **đã sửa**, thử `i - start === 2` trước khi cắt (`:160`–`:161`).
- [không chặn] `concat` gọi qua `.call(` / `.apply(` lọt: **đã sửa** bằng doc, "Limits" nêu `String.prototype.concat.call(a, ', ', b)`.
- [không chặn] `SelectField` chỉ có probe tạm: để lại, như review đã chấp nhận (Issue không cho file test nào của `SelectField`).
- `pnpm verify` xanh ở local sau vòng sửa (130 file test, 4472 test; quét token 0 vi phạm).

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `5c3608b`): 6 mục "Trùng file", đều là mục Issue này gộp. (L28 cũ, gợi ý đọc cây cú pháp TypeScript, đã sang ACCEPTED nên không còn nêu.)

- L16 `token-guard.ts:94` (`concat(` và chuỗi thay thế của `replace(` lọt mà doc chưa nêu): **đã sửa**. `concat(` bị báo như `.join(`; doc nêu chuỗi thay thế của `replace(` trong "Limits" (không báo được mà không trái ca (c) của #1048).
- L17 `token-guard.ts:146` (escape trong chuỗi thuộc tính JSX báo dưới tên luật không đúng): **đã sửa** (ghi doc, giữ báo). Vòng 1 viết nhầm ký tự `·` thật thay cho escape `\u00b7` (review @`5c3608b`); `cc5a5f0` sửa.
- L18 `token-guard.ts:154` (thử `JOINER` sau cùng): **đã sửa**. `JOINER` chạy trước, `whole` / `CALLEE` chỉ tính khi khớp.
- L19 `token-guard.test.ts:262` (thiếu ca `{" "}` sau dấu nối): **đã sửa**. Thêm dạng vào ca; probe đổi regex thì ca đỏ.
- L21 `CustomersScreen.tsx:57`, `AppointmentsScreen.tsx:78`, `KycHistory.tsx:93` (trần tên ô bảng ở ba nơi): **đã sửa**. `CELL_NAME` ở `classes.ts`; `NAME` của `ReportTable.tsx` giữ riêng kèm chú thích.
- L22 `SelectField.tsx:53` (dấu cách thừa trong class khung): **đã sửa**.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-376 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

- Ghi chú review PR #1068, #1070, #1092 — T-376 (#1081, PR #1092, `REVIEW: PASS` @`cc5a5f0`). Số dòng theo `main` `64720db`:
  - #1068, `packages/ui/src/token-guard.ts:59` (`JOINS`; phép thử `:166`; đoạn "Limits" `:99`–`:103`): `concat(` nay được xử như `.join(`: chuỗi nguyên `', '` / `'; '` đưa cho `concat(` bị báo `hardcoded-separator` (`a.concat(', ', b)`, cả khi chuỗi là template hay đứng giữa các đối số); lời gọi khác (`split(`, `replace(`, `push(`) vẫn tha. "Limits" nêu thêm chuỗi thay thế của `text.replace(/\n/g, ', ')` cạnh `parts.push(', ')`: báo nó thì cũng báo `text.replace(', ', '; ')`, trái ca (c) của #1048. Ca ở `packages/ui/src/token-guard.test.ts:233`, đỏ trên `main` trước PR (probe của thân PR và của cả hai vòng review).
  - #1068, NIT `packages/ui/src/token-guard.ts:95`–`:97` (doc của `findHardcodedSeparators`): doc nêu escape trong chuỗi thuộc tính JSX (`<p title="\u00b7" />`) vẫn bị báo dù JSX không giải mã (chữ hiện ra là `\u00b7`), vì đó vẫn là chuỗi cứng viết thay cho i18n; hành vi giữ nguyên. Vòng đầu viết nhầm ký tự `·` thật thay cho escape (mục chặn của review @`5c3608b`); `cc5a5f0` sửa.
  - #1068, NIT hiệu năng `packages/ui/src/token-guard.ts:160` (phép thử khi đóng chuỗi; `whole` `:162`, `CALLEE` `:163`–`:165`): chỉ chuỗi dài đúng 2 ký tự mới được cắt ra thử `JOINER`; `whole` và `CALLEE` chỉ tính khi khớp. Phép thử độ dài trước khi cắt là ghi chú không chặn của review @`5c3608b`, PR làm ở `cc5a5f0`. Review @`cc5a5f0` so head (bỏ `concat` khỏi `JOINS`) với `main` trên 391 file của repo và 200.000 nguồn ngẫu nhiên ngắn: kết quả không khác.
  - #1068, `packages/ui/src/token-guard.test.ts:295` (ca "flags a joiner of JSX however Prettier breaks it, and before an element" `:276`; kết quả `:306`): ca thêm dạng `{aaaa},{" "}` ⏎ `{bbbb}` (nháy kép sau dấu nối), báo `},{" "} {`. Đổi nhóm thứ hai của `JSX_JOINER` (`packages/ui/src/token-guard.ts:66`) thành chỉ nhận `{' '}` thì ca đỏ (probe của thân PR #1092 và của review).
  - #1070, *Duplicated Code* `apps/desktop/src/routes/classes.ts:37` (`CELL_NAME`, doc `:32`–`:36`): trần tên của ô bảng `block max-w-60 wrap-anywhere` nay là một hằng, dùng ở `apps/desktop/src/routes/customers/CustomersScreen.tsx:61` (tên) và `:80` (RE), `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:192` (RE) và `apps/desktop/src/routes/customers/KycHistory.tsx:93`; hai `NAME` cục bộ đã bỏ. Nút tên KH của màn Lịch hẹn (`AppointmentsScreen.tsx:181`, khác class) giữ nguyên. `NAME` của `apps/desktop/src/routes/reports/ReportTable.tsx:35` giữ riêng, chú thích `:31`–`:33` nêu vì sao khác: ô ở đó `whitespace-nowrap` nên tên cần `whitespace-normal`, và `w-max` giữ bề rộng tối thiểu của tên khi bảng rộng hơn khung. Chuỗi class không đổi, nên ảnh hướng dẫn không chụp lại.
  - #1070, NIT `packages/ui/src/components/SelectField.tsx:53` (khung; prop `capped`): class của khung là `flex min-w-0 max-w-80 flex-col gap-1` khi `capped`, `flex flex-col gap-1` khi không, hết dấu cách thừa; `SelectFieldProps` không đổi. Kiểm bằng probe tạm (thân PR #1092); việc thiếu test cố định ở ACCEPTED, review #1092.
  - #1092, ghi chú không chặn còn lại của vòng `REVIEW: CHANGES` @`5c3608b`, PR làm ở `cc5a5f0`: "Limits" (`packages/ui/src/token-guard.ts:101`) nêu `String.prototype.concat.call(a, ', ', b)` là dạng lọt, vì `CALLEE` đọc ra `call`. Mục chặn của vòng đó (ví dụ escape của doc) sửa ở `cc5a5f0` trước khi PASS, không phải ghi chú sổ. Review @`cc5a5f0` không có ghi chú mới.

---

# Issue #1082 — T-377: Mục sổ G7: Thùng rác tách tên nút khôi phục (giây, team trùng tên), searchText về domain, e2e hộp 8b (review #1072)

Trạng thái: CLOSED · nhãn: type:task, risk:med, status:in-progress, ready-for-agent

##### Mục tiêu

Năm ghi chú không chặn của review PR #1072 (T-368), quanh Thùng rác và ô tìm:

- **Nhân sự xóa cùng phút có tên nút khôi phục khác nhau.** Hai nhân sự trùng tên, vai trò, team mà bị xóa trong cùng một phút hiện có cùng tên nút: vế "xóa lúc" chỉ tới phút, còn khóa so khớp không tính giờ xóa. Ví dụ: xóa 08:31:05 và 08:31:40 đều ra "… · RE · Bình Minh · xóa lúc 05/10/2026 08:31".
  - **Sau task:** khi chữ phút của các dòng đó cũng trùng, vế "xóa lúc" thêm giây (`formatLocalDateTime(…, { seconds: true })`). Xóa ở hai phút khác nhau thì giữ dạng phút như nay.
  - Chữ cột "Xóa lúc" không đổi (Q1 (a) lượt 5).
- **Team trùng tên có tên nút khôi phục khác nhau.** Hai team đã xóa cùng tên hiện cùng một tên nút "Khôi phục team <tên>". Chỉ mục `teams_active_name` chỉ bắt tên không trùng giữa các team chưa xóa. Tái hiện: tạo team Sao Mai, xóa, tạo lại Sao Mai, xóa lần nữa → hai dòng chỉ khác cột "Xóa lúc".
  - **Sau task:** team trùng tên trong Thùng rác thêm vế "xóa lúc" như nhân sự (ca (b) của DR6-160 áp cho team), cùng luật giây ở trên. Team không trùng tên giữ tên nút như nay.
- **Đổi tên `codedCustomers`.** Hàm nay trả khóa của cả lịch hẹn, HĐ, nhân sự (và team, sau task) cần tách tên nút, nên tên "customers" sai nghĩa. Đổi tên (vd. `toldApart`) ở cả nơi định nghĩa lẫn nơi gọi của màn Thùng rác.
- **`searchText` về `domain`.** Dạng chữ tìm chung của ô KH 6b và ô "Tìm theo tên" của Thùng rác hiện nằm trong module form 6b, nên Thùng rác phải import module form. Sau task, hàm nằm ở `packages/domain` cạnh `normalizeText`, `stripDiacritics` (DR6-67), export qua index của domain. Hành vi không đổi.
- **e2e ghim hộp 8b (Ghi phát hành).** Test chấp nhận của #1050 ghi "Hộp HĐ 8a–8d", nhưng ca e2e chỉ đi 8a. Thêm một ca cho 8b: Ngày phát hành và FYP phát hành chỉ có ký tự vô hình thì không báo lỗi trước khi lưu, bấm lưu thì báo, như ca 8a (DR6-173). Hai chỗ gọi `shown` của ô phát hành hiện chưa ca nào giữ.

##### Bối cảnh

- Nguồn: ghi chú không chặn của review PR #1072 (T-368, #1050: L5-F; `REVIEW: PASS` @`857f306`, mức med; merge 06/11 (`merge-pr --owner`), squash `e9f2eb1`): https://github.com/AlexH-AI/Project-2C/pull/1072#issuecomment-6664912619.
- Sổ: PR #1073 ghi năm ghi chú vào OPEN, gắn [G7]. PR nhãn sổ của đợt này gắn lại nhãn sang Issue này.
- Q1 (a), Owner 05/11/2026 (DR6-160): tên nút khôi phục dùng chữ của cột "Xóa lúc" để tách hai dòng. Task giữ quyết định đó, chỉ thêm giây khi chữ phút cũng trùng.
- Owner 04/11 (K47): sửa hết rồi mới G7. Owner 06/11/2026 duyệt đề xuất gom sổ của pipeline `auto-issues` (5 Issue T-374…T-378).

##### Tài liệu cần đọc

- `docs/design/phase-6-hoan-thien.md` §4.2 (Thùng rác: cột "Bản ghi", "Thuộc", "Xóa lúc", nút khôi phục).
- `apps/desktop/src/routes/trash-view.ts` ở `main` `c8f9c76`: `filterTrash` (`:69`–`:80`), `alike` (`:205`), `codedCustomers` (`:211`–`:237`), `restoreLabel` (`:239`–`:270`), `deletedAtText` (`:285`).
- `apps/desktop/src/routes/trash-view.test.ts`: `filterTrash` (ca ký tự vô hình `:241`–`:251`), `describe('restoreLabel (DR6-43)')` (`:380`), `describe('deletedAtText')` (`:574`).
- `apps/desktop/src/routes/SettingsTrash.tsx:320` (nơi gọi `codedCustomers`).
- `apps/desktop/src/routes/appointments/appointment-form.ts:160`–`:178` (`searchText`, `searchCustomers`).
- `packages/domain/src/text.ts` (`normalizeText`, `stripDiacritics`), `packages/domain/src/period.ts:99` (`formatLocalDateTime`, `seconds`), `packages/domain/src/index.ts`.
- `docs/design/mockups/policy-forms.html` khối 8b (Ghi phát hành).
- `e2e/customer-policies.spec.ts:133`–`:160` (ca 8a, DR6-173).
- `apps/desktop/src/routes/customers/PolicyDialogs.tsx:78`–`:95` (`shown`; chỉ đọc).
- `docs/state/review-notes.md`, mục OPEN, nhóm "Ghi chú không chặn của review PR #1072".

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/trash-view.ts`, `apps/desktop/src/routes/trash-view.test.ts`, `apps/desktop/src/routes/SettingsTrash.tsx`
- `apps/desktop/src/routes/appointments/appointment-form.ts`, `apps/desktop/src/routes/appointments/appointment-form.test.ts`
- `packages/domain/src/text.ts`, `packages/domain/src/text.test.ts`, `packages/domain/src/index.ts`, `packages/domain/CLAUDE.md` (bản đồ export sinh lại)
- `e2e/customer-policies.spec.ts`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files` với các đường dẫn ở ô trên (sổ @ `c8f9c76`) cho 5 mục "Trùng file", là năm ghi chú Issue này sửa. **Gộp cả năm** (đã tính vào cỡ):

- L33 `trash-view.ts:264`: nhân sự xóa cùng phút trùng tên nút.
- L34 `trash-view.ts:234`: team trùng tên trùng tên nút.
- L35 `e2e/customer-policies.spec.ts:135`: e2e chỉ đi 8a.
- L36 `trash-view.ts:219` + `SettingsTrash.tsx:320`: tên `codedCustomers`.
- L37 `appointment-form.ts:165`: chỗ đặt `searchText`.

"Trong vùng" (1): L22 (`.dependency-cruiser.cjs`, nêu `packages/domain/`). **Để lại:** thuộc T-375.

Sau PR nhãn sổ, năm mục gộp mang nhãn T-377 và số dòng lùi một. Phiên làm task chạy lại `notes-for <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- `@p2c/domain` export thêm `searchText(text: string): string`, như hàm hiện có ở module form 6b. Module form 6b không còn định nghĩa nó; Thùng rác không còn import module form 6b.
- `codedCustomers` đổi tên.
  - Kiểu trả về có thể đổi để mang thông tin "cần giây" (vd. từ `ReadonlySet<string>` sang một map khóa → mức tách); nơi gọi duy nhất là màn Thùng rác.
  - `restoreLabel(row, coded, today)` có thể đổi kiểu tham số thứ hai theo đó. Thân PR ghi kiểu chọn.
- Không thêm khóa i18n: vế "xóa lúc" dùng `trash.restoreLabel.deletedAt` có sẵn. Không đổi chữ cột "Xóa lúc".

##### Test chấp nhận

- [ ] Hai nhân sự cùng tên, vai trò, team, xóa 08:31:05 và 08:31:40 cùng ngày → hai tên nút khác nhau, vế "xóa lúc" có giây ("… 08:31:05", "… 08:31:40"). Ca này đỏ trước khi sửa.
- [ ] Hai nhân sự như trên xóa ở hai phút khác nhau → tên nút giữ dạng phút (ca hiện có xanh).
- [ ] Hai team cùng tên, cả hai trong Thùng rác → hai tên nút khác nhau, có vế "xóa lúc". Ca này đỏ trước khi sửa.
- [ ] Team không trùng tên → "Khôi phục team <tên>" như nay.
- [ ] Mọi ca hiện có của `restoreLabel` (KH có mã, lịch hẹn / HĐ của KH trùng tên, DR6-43, DR6-151, DR6-160) xanh, không đổi kết quả.
- [ ] Không còn tên `codedCustomers` trong mã nguồn.
- [ ] `searchText` export từ `@p2c/domain`, có ca ở test của `text.ts`: dấu, hoa thường, U+200B, khoảng trắng không ngắt, DR6-172. Các ca tìm hiện có của Thùng rác và ô KH 6b xanh, không sửa.
- [ ] e2e, ca mới cho hộp 8b:
  - Ngày phát hành và FYP phát hành chỉ có ký tự vô hình → không báo lỗi trước khi lưu;
  - bấm lưu → báo lỗi ở cả hai ô như ô trống, không ghi phát hành.
  - Ca xanh trên code hiện tại (chỉ ghim).
- [ ] `pnpm verify` xanh (gồm bản đồ export); e2e xanh trên CI.
- [ ] Thân PR có dòng cho năm mục L33–L37 trong "Ghi chú OPEN liên quan".

Ước lượng: ≈ 30–40 dòng SP + ≈ 60–90 dòng test và e2e.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển năm ghi chú sang RESOLVED

##### Rủi ro

risk:med (thêm export ở `packages/domain`, tên nút của Thùng rác, như T-368).

##### Bị chặn bởi

Không.

## PR #1088 — fix: Thùng rác tells apart same-minute people and namesake teams, searchText to domain, e2e box 8b (T-377)

Trạng thái: MERGED · merge 2026-11-06T03:24:32Z · commit `20c51e391111f69e5fec9e3112522ffe7fa612b6` · nhánh `task/T-377-trash-restore-label-seconds` · nhãn: risk:med

Closes #1082

Phiên code: coding-ses2 (auto-issues)

#### Thay đổi

- **Nhân sự xóa cùng phút** (`trash-view.ts`): trong các nhân sự trùng tên, vai trò, team, những dòng mà chữ phút của "Xóa lúc" cũng trùng có vế "xóa lúc" thêm giây (`formatLocalDateTime(…, { seconds: true })`). Xóa ở phút khác vẫn giữ dạng phút. Chữ cột "Xóa lúc" không đổi (`deletedAtText(row)` mặc định vẫn tới phút; thêm tham số `{ seconds }` không bắt buộc).
- **Team trùng tên**: team đã xóa có tên trùng một team khác trong Thùng rác có vế "xóa lúc" như nhân sự (ca (b) của DR6-160), cùng luật giây. Team không trùng tên giữ "Khôi phục team <tên>".
- **Đổi tên `codedCustomers` → `toldApart`**. **Kiểu chọn:** `toldApart(rows): ReadonlyMap<string, ToldBy>` với `type ToldBy = 'code' | 'minute' | 'second'` (khóa là `rowKey`: `kind:id`). `restoreLabel(row, told: ReadonlyMap<string, ToldBy>, today)`:
  - `code` → KH có mã / KH của lịch hẹn, HĐ có mã (như nay);
  - `minute` / `second` → nhân sự, team có vế "xóa lúc" tới phút / tới giây.
  - Nơi gọi duy nhất `SettingsTrash.tsx` đổi theo (`trashColumns` nhận `told`).
- **`searchText` về `@p2c/domain`** (`packages/domain/src/text.ts`, cạnh `normalizeText`, `stripDiacritics`; export qua `index.ts`; bản đồ export sinh lại). Module form 6b và Thùng rác import từ `@p2c/domain`; Thùng rác không còn import module form 6b. Hành vi không đổi.
- **e2e ghim hộp 8b**: ca mới ở `e2e/customer-policies.spec.ts`. Ngày phát hành và FYP phát hành chỉ có ký tự vô hình thì không báo lỗi trước khi bấm "Phát hành". Bấm thì báo ở cả hai ô ("Nhập ngày.", "Chưa nhập số tiền."), HĐ vẫn "Đã nộp", nút phát hành còn.
- Không thêm khóa i18n (dùng `trash.restoreLabel.deletedAt`).

#### Test chấp nhận

- [x] Hai nhân sự cùng tên, vai trò, team, xóa 08:31:05 và 08:31:40 cùng ngày → hai tên nút khác nhau, "… xóa lúc 05/10/2026 08:31:05" / "… 08:31:40". Ca này đỏ trước khi sửa (cả hai ra "… 08:31"). Ca thêm: người cùng phút nhưng khác vai trò không làm thêm giây.
- [x] Hai nhân sự như trên xóa ở hai phút khác nhau → giữ dạng phút (ca DR6-160 hiện có xanh; ca mới có dòng thứ ba khác phút giữ dạng phút).
- [x] Hai team cùng tên → "Khôi phục team Bình Minh · xóa lúc 05/10/2026 08:33" / "… 09/10/2026 14:20"; cùng phút → tới giây. Ca này đỏ trước khi sửa (cả hai ra "Khôi phục team Bình Minh").
- [x] Team không trùng tên (kể cả khi trùng tên một nhân sự) → "Khôi phục team <tên>".
- [x] Mọi ca hiện có của `restoreLabel` xanh, không đổi kết quả. Ca `restoreLabel(planned, new Set(), …)` đổi tham số thành `new Map()` theo kiểu mới; chuỗi kỳ vọng giữ nguyên.
- [x] Không còn tên `codedCustomers` trong mã nguồn (`grep` trên `apps`, `packages`, `e2e`, `tools`).
- [x] `searchText` export từ `@p2c/domain`, có `describe('searchText')` ở `text.test.ts`: dấu, hoa thường, NFD, U+200B, khoảng trắng không ngắt, hai khoảng trắng, chỉ ký tự vô hình (DR6-172). Ca tìm của Thùng rác và ô KH 6b không sửa, xanh.
- [x] e2e ca mới cho hộp 8b xanh ở local trên code hiện tại (chỉ ghim): `pnpm exec playwright test e2e/customer-policies.spec.ts -g "DR6-173"` → 3 passed (seed-timing, 8a, 8b).
- [x] `pnpm verify` xanh ở local (130 file test, 4469 test; gồm bản đồ export). e2e đầy đủ: chờ CI.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `50865a2`): 5 mục "Trùng file", đều là mục Issue này gộp.

- L27 `trash-view.ts` (vế "xóa lúc" của `restoreLabel`, nhân sự xóa cùng phút trùng tên nút): **đã sửa**. Thêm giây khi chữ phút cũng trùng.
- L28 `trash-view.ts` (`codedCustomers` không có ca team, hai team cùng tên trùng tên nút): **đã sửa**. Team trùng tên có vế "xóa lúc", cùng luật giây.
- L29 `e2e/customer-policies.spec.ts` (ca DR6-173 chỉ đi 8a): **đã sửa**. Thêm ca cho 8b.
- L30 `trash-view.ts`, `SettingsTrash.tsx` (tên `codedCustomers`): **đã sửa**. Đổi thành `toldApart`.
- L31 `appointment-form.ts`, `trash-view.ts`, `text.ts`, `index.ts` (chỗ đặt `searchText`): **đã sửa**. Hàm về `@p2c/domain`.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-377 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

- Ghi chú review PR #1072 — T-377 (#1082, PR #1088, `REVIEW: PASS` @`00b9745`). Số dòng theo `main` `20c51e3`:
  - #1072, `apps/desktop/src/routes/trash-view.ts:292` (vế "xóa lúc" của `restoreLabel`; `byDeletion` `:223`): nhân sự trùng tên, vai trò, team mà chữ phút của "Xóa lúc" cũng trùng có vế "xóa lúc" tới giây (`deletedAtText(row, { seconds: true })`, `:318`). Xóa ở phút khác vẫn giữ dạng phút; chữ cột "Xóa lúc" không đổi. Ca ở `apps/desktop/src/routes/trash-view.test.ts:527` (08:31:05 / 08:31:40; người khác vai trò xóa cùng phút không làm thêm giây) và `:629` (`deletedAtText` có `seconds`).
  - #1072, `apps/desktop/src/routes/trash-view.ts:264` (`toldApart`, `byDeletion(teams, …)`): team trùng tên một team khác trong Thùng rác có vế "xóa lúc" như nhân sự, cùng luật giây; team không trùng tên, kể cả khi trùng tên một nhân sự, giữ "Khôi phục team <tên>". Ca ở `apps/desktop/src/routes/trash-view.test.ts:545` và `:566` (tên nút đôi một khác nhau).
  - #1072, `e2e/customer-policies.spec.ts:165` (ca 8b, DR6-173): Ngày phát hành và FYP phát hành chỉ có ký tự vô hình thì không báo lỗi trước khi bấm "Phát hành"; bấm thì báo ở cả hai ô, HĐ vẫn "Đã nộp". Ca giữ hai chỗ gọi `shown` của ô phát hành (`apps/desktop/src/routes/customers/PolicyDialogs.tsx:89`, `:93`).
  - #1072, *Mysterious Name* `apps/desktop/src/routes/trash-view.ts:242` (`codedCustomers`): hàm nay tên `toldApart`, trả `ReadonlyMap<string, ToldBy>` (`ToldBy` = `'code' | 'minute' | 'second'`, `:217`). `restoreLabel(row, told, today)` và nơi gọi `apps/desktop/src/routes/SettingsTrash.tsx:321` đổi theo; mã nguồn không còn tên `codedCustomers`.
  - #1072, gợi ý chỗ đặt `packages/domain/src/text.ts:70` (`searchText`): hàm dời nguyên văn từ `apps/desktop/src/routes/appointments/appointment-form.ts` về domain, export qua `packages/domain/src/index.ts:109`, có `describe('searchText')` ở `packages/domain/src/text.test.ts:188`. `apps/desktop/src/routes/trash-view.ts` không còn import module form 6b.

---

# Issue #1083 — T-378: Mục sổ G7: auto-wait ci lấy kết luận failure của run pull_request mới nhất làm sàn khi không --since (review #1061)

Trạng thái: CLOSED · nhãn: type:task, risk:low

##### Mục tiêu

`auto-wait ci <N>` **không `--since`** (vd. `ci <N> --not <sha>` sau một lần push) không báo "CI green" khi run `pull_request` mới nhất của head đã xong với `conclusion: failure` mà rollup chưa có check đỏ của nó.

**Làm ngoài pipeline `auto-issues`.** `tools/auto-wait*` thuộc rào "không tự sửa" của skill (K45), nên Issue này không gắn `ready-for-agent`. Owner làm theo cách thường (phiên thường, `review-pr`, `merge-pr`), như T-369 và T-373.

- **Hiện nay:** sàn theo kết luận `failure` của run (T-373) chỉ có ở nhánh `--since` (`own`). Không `--since` thì `own` là `null`, sàn bị bỏ qua. Cùng độ trễ rollup như T-373: rollup đọc trước chỉ có check xanh, chưa có check đỏ của job vừa lỗi (vd. Build portable exe, `needs: verify`), còn runs đọc sau đã báo run `completed` / `failure`. Khi đó lệnh vẫn báo "CI green".
- **Sau task:** không `--since`, lấy run `pull_request` mới nhất trong các run của head làm sàn. Run đó `failure` mà rollup không có check đỏ → `done: true`, `EXIT.bad` (mã 1), text nêu id run như nhánh `--since`.
- **Không lấy mọi run của head:** run `failure` của một event khác (vd. `push`) trên cùng head sẽ báo đỏ nhầm.

##### Bối cảnh

- Nguồn: ghi chú không chặn của review PR #1061 (T-373, #1059; `REVIEW: PASS` @`f397956`, mức low; merge 05/11, squash `f4490e1`): https://github.com/AlexH-AI/Project-2C/pull/1061#issuecomment-6654684403.
- Sổ: PR #1062 ghi ghi chú vào OPEN, gắn [G7]. PR nhãn sổ của đợt này gắn lại nhãn sang Issue này.
- Issue #1059 chốt "Không `--since`: hành vi không đổi", nên đây không phải lỗi của PR #1061. Cửa sổ hẹp như mục T-373, chưa tái hiện được trên GitHub thật.
- Owner 04/11 (K47): sửa hết rồi mới G7. Owner 06/11/2026 duyệt đề xuất gom sổ của pipeline `auto-issues` và chốt Issue này làm theo cách thường, ngoài pipeline.

##### Tài liệu cần đọc

- `tools/auto-wait-core.mjs` ở `main` `c8f9c76`: `runOf`, `VERDICTS`, `newestRunOfPr` (`:104`–`:120`), `ciState` (`:135`–`:199`; `own` `:151`, `running` `:158`, `checks = rollup` `:165`, sàn `failure` `:181`–`:187`).
- `tools/auto-wait-core.test.mjs`: `describe('ciState')` (`:132`), `describe('with since (a reopened PR)')` (`:208`).
- `tools/auto-wait.mjs` (usage, mã thoát; không phải sửa).
- `.claude/skills/auto-issues/SKILL.md` §2 (mã thoát `AUTO-WAIT`), chỉ đọc.
- `docs/state/review-notes.md`, mục OPEN, nhóm "Ghi chú không chặn của review PR #1061".

##### File / thư mục được phép sửa

- `tools/auto-wait-core.mjs`, `tools/auto-wait-core.test.mjs`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files tools/auto-wait-core.mjs tools/auto-wait-core.test.mjs` (sổ @ `c8f9c76`): 1 mục "Trùng file", L14 `tools/auto-wait-core.mjs:181`, là ghi chú Issue này sửa. **Gộp** (đã tính vào cỡ). Sau PR nhãn sổ, mục này mang nhãn T-378. Phiên làm task chạy lại `notes-for <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- `auto-wait ci` giữ cú pháp và mã thoát. Chỉ thêm một trường hợp: không `--since`, run `pull_request` mới nhất của head `failure`, rollup không có check đỏ → mã 1.
- `--since`: không đổi.
- Không `--since`: mọi trường hợp khác không đổi, gồm cách đọc check (vẫn cả rollup) và run `cancelled` / `startup_failure`.

##### Test chấp nhận

- [ ] Không `--since`, run `pull_request` mới nhất của head `failure`, rollup chỉ có check xanh → `done: true`, `EXIT.bad`, text nêu id run. Ca này đỏ trước khi sửa.
- [ ] Không `--since`, run `push` `failure` và run `pull_request` mới nhất `success` trên cùng head, check xanh → xanh (không báo đỏ nhầm).
- [ ] Không `--since`, run `pull_request` cũ hơn `failure`, run `pull_request` mới nhất `success`, check xanh → xanh.
- [ ] Mọi ca hiện có của `ciState`, cả nhánh `--since`, xanh, không sửa.
- [ ] `pnpm verify` xanh.
- [ ] Thân PR có dòng cho mục L14 trong "Ghi chú OPEN liên quan".

Ước lượng: ≈ 5–10 dòng SP + ≈ 30 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển ghi chú sang RESOLVED

##### Rủi ro

risk:low. Làm ngoài pipeline `auto-issues` (rào "không tự sửa", K45); Owner review và merge theo cách thường.

##### Bị chặn bởi

Không.

## PR #1103 — fix: auto-wait ci calls the newest pull_request run's failure red without --since too (T-378)

Trạng thái: MERGED · merge 2026-11-06T12:37:14Z · commit `ebee006781371e762733d317e14b886db73f5a33` · nhánh `task/T-378-ci-floor-without-since` · nhãn: type:task, risk:low

Closes #1083

#### Thay đổi

- `tools/auto-wait-core.mjs` (`ciState`, `newestRunOfPr`): run `pull_request` mới nhất của nhánh PR (`newest`) giờ được tính cả khi không `--since` (`newestRunOfPr` nhận `since = null` → không lọc theo giờ). Sàn `failure` (T-373) đọc `newest` thay vì `own`, nên không `--since` mà run đó `failure`, rollup chưa có check đỏ → `done: true`, `EXIT.bad`, text `CI red @<head>: run <id> failed, no red check of it yet` (như nhánh `--since`).
- `own` vẫn chỉ có khi `--since`: không `--since` thì cách đọc check (cả rollup), ca chờ "no check of run … yet" và `cancelled` / `startup_failure` không đổi.
- Chỉ run `event === 'pull_request'` của `headRefName`: run `push` `failure` trên cùng head không báo đỏ nhầm.
- `tools/auto-wait-core.test.mjs`: chuyển hai helper `ranIn` / `run` từ `describe('with since')` lên `describe('ciState')` (không đổi nội dung) để dùng chung; thêm `describe('without since (a push after a fix)')` 3 ca.

#### Test chấp nhận

- [x] Không `--since`, run `pull_request` mới nhất `failure`, rollup chỉ có check xanh (cả check có / không có `detailsUrl`) → `done: true`, `EXIT.bad`, text nêu id run. Ca này đỏ trước khi sửa (nhận `CI green @abc1234: 2 pass`).
- [x] Không `--since`, run `push` `failure` (cũ hơn và mới hơn run PR) + run `pull_request` mới nhất `success`, check xanh → xanh.
- [x] Không `--since`, run `pull_request` cũ hơn `failure`, mới nhất `success` (hai thứ tự trong mảng) → xanh.
- [x] Mọi ca hiện có của `ciState`, cả nhánh `--since`, xanh, không sửa (48/48).
- [x] `pnpm verify` xanh.
- [x] Thân PR có dòng cho mục L14 dưới đây.

#### Ghi chú OPEN liên quan

- L14 `tools/auto-wait-core.mjs` **[T-378 #1083]** (`ciState` `:181`, sàn `failure` chỉ ở nhánh `--since`): **đã sửa** ở PR này (sàn theo run `pull_request` mới nhất của head cả khi không `--since`, không lấy run event khác; kèm 3 ca test không `--since`).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Làm ngoài pipeline `auto-issues` (rào `tools/auto-wait*`, K45).

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-378 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

- Ghi chú review PR #1061 — T-378 (#1083, PR #1103, `REVIEW: PASS` @`254f0c8`). Số dòng theo `main` `b4c514e`:
  - #1061, `tools/auto-wait-core.mjs:204`–`:211` (`ciState`, sàn `failure`; `newestRunOfPr` `:114`, `newest` `:174`, `own` `:175`): sàn theo kết luận `failure` (T-373) nay đọc `newest`, run `pull_request` mới nhất của nhánh PR, cả khi không `--since` (`newestRunOfPr` với `since` là `null` thì không lọc theo giờ). Không `--since` mà run đó `failure`, rollup chưa có check đỏ → `EXIT.bad`, text `CI red @<head>: run <id> failed, no red check of it yet`, như nhánh `--since`. Chỉ xét run `event === 'pull_request'` của `headRefName`, nên run `push` `failure` trên cùng head không báo đỏ nhầm. `own` vẫn chỉ có khi `--since`, nên cách đọc check và ca `cancelled` / `startup_failure` không đổi. Ba ca không `--since` ở `tools/auto-wait-core.test.mjs:226` (`:230`, `:242`, `:253`); review tái hiện ca đầu đỏ với code trước khi sửa.

---

# Issue #1085 — T-379: auto-issues: phiên điều phối không đứng chờ khi tin báo của phiên con bị giữ hoặc GitHub lỡ push

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress

##### Mục tiêu

Phiên điều phối của pipeline `auto-issues` không đứng chờ lâu khi phiên con đã xong lượt hoặc GitHub lỡ một sự kiện. Đợt chạy 05–06/11/2026 gặp ba chỗ kẹt:

- **Tin báo của phiên con bị giữ.** Sau nhiều lượt tự động liền nhau mà Owner không nhắn, app ngừng đánh thức phiên điều phối khi phiên con xong lượt; tin báo (`<side-sessions-event>`) chờ tới lượt sau. Từ khoảng 18:00Z 05/11, tin báo của PR #1076, #1077, #1078 và #1084 không đánh thức phiên điều phối; chúng đến dồn một lượt khi Owner nhắn (khoảng 01:2xZ 06/11). Bước theo GitHub vẫn chạy nhờ `auto-wait` (`pr` / `ci` / `review` / `title` xong khi GitHub đổi), nên chỗ kẹt nằm ở các bước không để dấu trên GitHub.
- **Bước của §6 chờ bằng `sleep --timeout 30`.** §6 không để dấu trên GitHub trước khi có PR gắn nhãn, nên skill trông vào tin báo để đánh thức sớm ("tin báo của phiên con thường đánh thức sớm hơn", `SKILL.md:321`; lệnh chờ `:146`, `:310`, `:312`). Khi tin báo bị giữ, mỗi bước của §6 có thể chờ tới 30 phút dù phiên con đã xong (đợt này: `CẦN OWNER` khi `gh issue create` bị chặn, và PR gắn nhãn #1084, đều phải chờ `sleep` hết giờ hoặc Owner nhắn).
- **GitHub lỡ sự kiện `synchronize`.** PR #1070: `coding-ses1` push `ff39260` lúc 16:02:40Z 05/11, nhánh trên GitHub đã ở `ff39260` (`gh api …/branches/<nhánh>`), nhưng `headRefOid` của PR vẫn là `8024535` và không có run CI mới. `auto-wait ci 1070 --not 8024535` chỉ báo "head still 8024535: waiting for a push" (`tools/auto-wait-core.mjs:139`–`:141`) và sẽ chờ hết 60 phút. Đóng rồi mở lại PR (16:10Z) mới đồng bộ head và chạy CI.

Đã thử: `SendMessage` với `notify_when_idle: true` không dùng được với phiên con của app desktop ("no idle subscription was made: notify_when_idle is only supported for Claude sessions on this machine in this release"), nên không dựa vào cách đó.

**Sau task:**

- Mỗi bước mà kết quả không lên GitHub (brief chờ, mọi bước của §6) chờ bằng `sleep` ngắn (vd. 5 phút), không 30 phút. Mỗi lần thức là một nhịp như thường: đọc `list_sessions` / `list_events`, thấy dòng `AUTO-CHILD` mới thì làm tiếp.
- Bước theo GitHub khi phiên con đã rảnh: trần chờ ngắn hơn 60 phút (vd. 15), để nhịp sau sớm gặp hàng "Phiên con rảnh; dòng `AUTO-CHILD` cuối báo một kết quả mà GitHub chưa thấy".
- Luật "Hai lần hết giờ liền cho cùng một việc mà GitHub không đổi" (§2, "Chờ") tính theo tổng thời gian chờ (vd. ≥ 60 phút không đổi), không theo số lần hết giờ, để trần ngắn không làm hỏi Owner sớm.
- `auto-wait ci <N> --not <H>`: khi nhánh của PR trên GitHub đã ở một SHA khác `H` mà `headRefOid` của PR vẫn là `H` quá một khoảng (vd. 3 phút), lệnh xong với mã 3 và text nêu "PR head stale: branch at <sha7>". §2 / §4 ghi cách xử lý: đóng rồi mở lại PR, chờ `ci <N> --since <T>`, như với notice `Tested base`.
- §2 / §6 ghi rõ: tin báo của phiên con có thể bị app giữ sau nhiều lượt tự động; lệnh chờ là tín hiệu đánh thức chính; `notify_when_idle` không dùng được với phiên con của app desktop.

##### Bối cảnh

- Đợt `auto-issues` 05–06/11/2026 ở Home PC: 9 Issue #1045…#1058 (PR #1063…#1077) và gom sổ (#1079…#1083, PR #1084). Owner hỏi "đơ à?" khi PR #1070 kẹt, và sau đợt hỏi vì sao phiên điều phối không điều phối tiếp khi phiên con đã xong. Owner bấm "Làm ở đây" để có Issue này (06/11/2026).
- File cần sửa thuộc rào "không tự sửa" (đầu `SKILL.md`, K45): Issue không gắn `ready-for-agent`; Owner làm, review và merge theo cách thường, như T-369, T-373, T-378.
- T-378 (#1083) cũng sửa `tools/auto-wait-core.mjs` (`ciState`, nhánh không `--since`). Làm T-378 trước, hoặc gộp hai Issue vào một PR.

##### Tài liệu cần đọc

- `.claude/skills/auto-issues/SKILL.md` ở `main` `5efc47e`: §2 bảng bước (hàng "Một phiên con đang chạy" `:109`, hàng "kết quả mà GitHub chưa thấy" `:111`), "Chờ" (`:137`–`:156`, lệnh chờ theo việc `:140`–`:146`, luật hai lần hết giờ `:151`), §4 (đóng / mở lại PR), §6 (`:310`–`:321`).
- `tools/auto-wait-core.mjs`: `ciState` (`:135`; nhánh `--not` `:139`–`:141`), vòng chờ và mã thoát (`:280`–`:297`).
- `tools/auto-wait-core.test.mjs`: `describe('ciState')`.
- `tools/auto-wait.mjs` (usage, mã thoát).
- Transcript phiên điều phối 05–06/11 (Home PC) nếu cần mốc giờ chi tiết; các mốc chính đã ghi ở Mục tiêu.

##### File / thư mục được phép sửa

- `.claude/skills/auto-issues/SKILL.md`
- `tools/auto-wait-core.mjs`, `tools/auto-wait-core.test.mjs`, `tools/auto-wait.mjs` (chỉ usage nếu đổi)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files .claude/skills/auto-issues/SKILL.md tools/auto-wait.mjs tools/auto-wait-core.mjs tools/auto-wait-core.test.mjs` (sổ @ `5efc47e`): 1 mục "Trùng file", L14 `tools/auto-wait-core.mjs:181`, nhãn **[T-378 #1083]**. Để lại cho T-378, trừ khi Owner gộp hai Issue.

##### Interface / hợp đồng

- `auto-wait` giữ cú pháp và các mã thoát hiện có. Chỉ thêm: `ci --not <H>` ra mã 3 khi head của PR bị kẹt so với nhánh (như Mục tiêu).
- Lệnh đọc SHA nhánh dùng `gh api repos/<owner>/<repo>/branches/<nhánh>` hoặc `git ls-remote`, qua seam đọc sẵn có của module để test được không cần mạng.
- `SKILL.md`: đổi lệnh chờ, luật hết giờ và thêm đoạn về tin báo bị giữ như Mục tiêu. Không đổi quyền của pipeline (M11), rào, brief của phiên con.

##### Test chấp nhận

- [ ] `ciState` với `not = H`: PR `headRefOid = H`, nhánh ở `X ≠ H` quá ngưỡng → `done: true`, `EXIT.look`, text nêu "stale" và `X`. Ca này đỏ trước khi sửa.
- [ ] Nhánh ở `X ≠ H` nhưng chưa quá ngưỡng → vẫn chờ ("waiting for a push" hoặc text tương đương).
- [ ] Nhánh ở `H` (chưa push) → vẫn chờ, như nay.
- [ ] Mọi ca hiện có của `auto-wait-core.test.mjs` xanh, không sửa.
- [ ] `SKILL.md`: không còn `sleep --timeout 30`; lệnh chờ của §6 và brief chờ là `sleep` ngắn; luật hết giờ theo tổng thời gian; §4 có cách xử lý "PR head stale"; có đoạn về tin báo bị giữ và `notify_when_idle`.
- [ ] `pnpm verify` xanh.
- [ ] Chạy thật một đợt `auto-issues` sau khi merge: không bước nào của §6 chờ quá ngưỡng `sleep` mới khi phiên con đã xong (ghi kết quả vào thân PR hoặc comment Issue).

Ước lượng: ≈ 15–25 dòng SP + ≈ 30–50 dòng test, ≈ 15–25 dòng `SKILL.md`.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] Owner merge (rào "không tự sửa")

##### Rủi ro

risk:low. Làm ngoài pipeline `auto-issues` (rào "không tự sửa", K45); Owner review và merge theo cách thường.

##### Bị chặn bởi

#1083 (T-378, cùng `tools/auto-wait-core.mjs`), trừ khi Owner gộp hai Issue vào một PR.

## PR #1104 — fix: auto-issues waits with short caps, auto-wait ci --not stops on a PR head stale behind its branch (T-379)

Trạng thái: MERGED · merge 2026-11-06T13:32:22Z · commit `88848b94d420608374792dfecf0b84b0b58091e5` · nhánh `task/T-379-auto-wait-stale-head` · nhãn: risk:low

Closes #1085

#### Thay đổi

- `tools/auto-wait-core.mjs`: `ciState` thêm seam `branch()` (SHA nhánh của PR trên GitHub + bao lâu lần chờ này đã thấy nhánh ở SHA đó). Với `--not <H>` mà head vẫn là `H`:
  - nhánh ở `H` (chưa push) → chờ như cũ, `head still <H>: waiting for a push`;
  - nhánh ở `X ≠ H` dưới 3 phút → chờ, `head still <H>, branch at <X>: waiting for the PR to follow`;
  - nhánh ở `X ≠ H` từ 3 phút (`STALE_HEAD_MS`) → xong, mã 3, `PR head stale: branch at <X>, head still <H> (GitHub missed the push)` (PR #1070).
  - `heldFor(now)`: đếm từ lần đọc đầu tiên thấy một giá trị trong một lần chờ, về 0 khi giá trị đổi. Push trước lúc bắt đầu chờ tính từ lần đọc đầu, nên không bao giờ coi là cũ hơn thực tế (chậm nhất 3 phút sau khi đặt lệnh chờ).
- `tools/auto-wait.mjs`: đọc SHA nhánh bằng `gh api repos/{owner}/{repo}/git/ref/heads/<nhánh>` (chỉ khi head vẫn là `--not`), nối `heldFor(Date.now)`; header ghi mã 3 mới. Usage không đổi. Issue ghi file này "chỉ usage nếu đổi", nhưng mục Interface đòi đọc SHA nhánh qua seam đọc của module; `auto-wait-core.mjs` không có I/O, nên lệnh đọc nằm ở đây.
- `.claude/skills/auto-issues/SKILL.md`:
  - §2 "Chờ": đoạn mới "Lệnh chờ là tín hiệu đánh thức chính" (tin báo của phiên con có thể bị app giữ; `notify_when_idle` không dùng được với phiên con của app desktop); trần 15 phút cho `pr` / `ci` / `review` / `title`, `sleep --timeout 5` cho §6; brief chờ giữ `sleep --timeout 1`.
  - Luật "hai lần hết giờ" → "Chờ lâu cho cùng một việc": cộng `--timeout` của các lệnh chờ liền nhau (cả `sleep`) mà không có gì đổi, tổng tới 60 phút thì hỏi Owner; Owner chọn chờ tiếp thì đếm lại. Số liệu đợt 05/11: phiên code mất 3–43 phút mỗi Issue (nhãn `status:in-progress` → tạo PR), nên 60 phút không làm hỏi sớm. §5 sửa câu tương ứng.
  - Mã 3 `PR head stale` → §4 mục mới "Head của PR kẹt": đóng, mở lại PR, chờ `ci <N> --since <T>` như với notice `Tested base`. Hàng "kết quả mà GitHub chưa thấy" của §2 nêu nguyên nhân này.
  - §6: bảng và đoạn cuối dùng `sleep --timeout 5`, không trông vào tin báo.

#### Test chấp nhận

- [x] `ciState` với `not = H`, nhánh ở `X ≠ H` quá ngưỡng → `done: true`, `EXIT.look`, text nêu "stale" và `X` (đỏ trước khi sửa).
- [x] Nhánh ở `X ≠ H` chưa quá ngưỡng → vẫn chờ.
- [x] Nhánh ở `H` → vẫn chờ, `waiting for a push`.
- [x] Mọi ca cũ của `auto-wait-core.test.mjs` xanh, không sửa (thêm ca: nhánh chỉ đọc khi head vẫn là `--not`; `heldFor`).
- [x] `SKILL.md`: không còn `sleep --timeout 30`; §6 và brief chờ dùng `sleep` ngắn; luật chờ lâu theo tổng thời gian; §4 có "Head của PR kẹt"; có đoạn về tin báo bị giữ và `notify_when_idle`.
- [x] `pnpm verify` xanh.
- [ ] Chạy thật một đợt `auto-issues` sau khi merge: không bước nào của §6 chờ quá 5 phút khi phiên con đã xong. **Chưa làm** — làm ở đợt `auto-issues` kế tiếp, ghi kết quả vào comment Issue #1085.

Kiểm tay: `gh api …/git/ref/heads/task/T-379-auto-wait-stale-head` ra đúng `adea3bc…` (nhánh có `/`); `node tools/auto-wait.mjs ci <PR này> --not <head> --once` trên GitHub thật (ghi ở comment sau khi mở PR).

#### Ghi chú OPEN liên quan

- L14 `tools/auto-wait-core.mjs` **[T-378 #1083]** (`ciState`, sàn `failure` khi không `--since`): để lại — đã sửa ở PR #1103 (T-378, merge 06/11); chờ PR sổ của review #1103 chuyển sang RESOLVED. PR này không đụng phần đó.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`. File thuộc rào "không tự sửa" (`.claude/skills/auto-issues/**`, `tools/auto-wait*`): làm ngoài pipeline, Owner review và merge theo cách thường (K45).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-379 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

Không có nhóm nào mang nhãn này.

---

# Issue #1094 — T-380: Mục sổ G7: dòng lý do TR-1 và ô "Thuộc" nêu giờ xóa của team khi Thùng rác có hai team cùng tên (review #1088)

Trạng thái: CLOSED · nhãn: type:task, risk:med, status:in-progress, ready-for-agent

##### Mục tiêu

Một ghi chú không chặn của review PR #1088 (T-377). Khi Thùng rác có hai team cùng tên, dòng lý do TR-1 dưới một bản ghi bị chặn vì team đã xóa, và ô "Thuộc" của dòng đó, phải nói rõ là team nào.

- **Hiện nay:**
  - Câu `TEAM_NOT_FOUND` chỉ nêu tên team, vd. "Khôi phục team Sao Mai trước.". Ô "Thuộc" ghi "Team Sao Mai (đã xóa)". Từ T-377, hai nút khôi phục của hai team đó chỉ khác nhau ở vế "xóa lúc", còn câu và ô không có vế đó, nên không biết phải khôi phục team nào.
  - Tái hiện: team Sao Mai (t1) có RE X. Xóa X, xóa t1, tạo lại Sao Mai (t2), xóa t2. Nếu khôi phục nhầm t2 thì X vẫn hiện cùng câu dù team Sao Mai đã có trên màn Team. Còn t1 bị chặn `TEAM_NAME_TAKEN` cho tới khi đổi tên t2.
- **Sau task:** `toldApart` đã tách team chặn (`owner.team` của dòng) bằng giờ xóa (khóa `team:<id>`, `minute` hoặc `second`). Khi đó:
  - Dòng lý do `TEAM_NOT_FOUND` thêm vế "xóa lúc …" của chính team đó, đúng chữ trong tên nút khôi phục team đó: tới phút, hoặc tới giây khi trùng phút. Ví dụ: "Khôi phục team Sao Mai (xóa lúc 05/10/2026 08:31) trước."
  - Ô "Thuộc" đổi dấu "(đã xóa)" của phần team thành "(đã xóa lúc 05/10/2026 08:31)", cùng cách ghi giờ. Áp cho mọi dòng có phần team là team đó: nhân sự, KH.
  - Hộp khôi phục báo lỗi khi dữ liệu vừa đổi (`restoreRow`) dùng cùng câu với dòng lý do.
- Team không có trùng tên trong Thùng rác: câu và ô giữ nguyên như hiện nay (mockup 11a, 11d). Giá trị cột "Thuộc" dùng để sắp / lọc vẫn chỉ là tên.

##### Bối cảnh

- Nguồn: ghi chú không chặn của review PR #1088 (T-377, #1082; `REVIEW: PASS` @`00b9745`, mức med; merge 06/11 (`merge-pr --owner`), squash `20c51e3`): https://github.com/AlexH-AI/Project-2C/pull/1088#issuecomment-6676003726.
- Sổ: PR #1089 ghi ghi chú này vào OPEN, gắn [G7] (L16 ở `main` `c0f463b`). PR nhãn sổ của đợt này gắn lại nhãn sang Issue này.
- Q1 (a), Owner 05/11/2026 (DR6-160): dùng chữ của cột "Xóa lúc" để tách hai dòng giống nhau. T-377 thêm giây khi chữ phút cũng trùng. Task này dùng đúng chữ đó cho dòng lý do và ô "Thuộc". Mockup chỉ vẽ ca không trùng tên, ca đó giữ nguyên.
- Owner 04/11 (K47): sửa hết rồi mới G7. Owner 06/11/2026 duyệt đề xuất gom sổ lần 2 của pipeline `auto-issues` (T-380, T-381).

##### Tài liệu cần đọc

- `docs/design/phase-6-hoan-thien.md` §4.2: TR-1 (dòng lý do nêu tên bản ghi chặn), cột "Thuộc", "Xóa lúc".
- `docs/design/mockups/trash.html` khối 11a (bảng, ô "Thuộc") và 11d (mẫu câu lý do).
- `apps/desktop/src/routes/trash-view.ts` ở `main` `c0f463b`: `ownerParts` (`:187`), `ToldBy` / `byDeletion` / `toldApart` (`:213`–`:270`), `restoreLabel` (`:280`), `deletedAtText` (`:318`), `blockedReason` / `reasonSentence` (`:327`–`:375`, nhánh `TEAM_NOT_FOUND` `:368`), `restoreRow` (`:614`).
- `apps/desktop/src/routes/SettingsTrash.tsx`: `RecordCell` (dòng lý do `:72`), `OwnerCell` (`:82`–`:99`), cột "Thuộc" (`:130`–`:136`), `told` (`:321`).
- `apps/desktop/src/routes/trash-view.test.ts`: dòng mẫu `mai` / `binhMinh` (`:150`–`:180`), `describe('ownerParts …')` (`:354`), `describe('restoreLabel (DR6-43)')` (`:380`; ca team trùng tên quanh `:545`–`:562`), `describe('blockedReason (mockup 11d)')` (`:636`), `describe('restoreRow')` (`:999`).
- `apps/desktop/src/i18n/vi.ts:307`–`:311` (`trash.owner.*`, `trash.gone`), `:345` (`trash.blocked.TEAM_NOT_FOUND`), `:388` (`trash.restoreLabel.deletedAt`).
- `docs/state/review-notes.md`, mục OPEN, nhóm "Ghi chú không chặn của review PR #1088".

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/trash-view.ts`, `apps/desktop/src/routes/trash-view.test.ts`
- `apps/desktop/src/routes/SettingsTrash.tsx`
- `apps/desktop/src/i18n/vi.ts` (chỉ khóa `trash.*`)

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files apps/desktop/src/routes/trash-view.ts apps/desktop/src/routes/trash-view.test.ts apps/desktop/src/routes/SettingsTrash.tsx apps/desktop/src/i18n/vi.ts` (sổ @ `c0f463b`): 1 mục "Trùng file", là ghi chú Issue này sửa. **Gộp** (đã tính vào cỡ):

- L16 `trash-view.ts:368`–`:371`: dòng lý do TR-1 và ô "Thuộc" không nói team nào khi Thùng rác có hai team cùng tên.

Sau PR nhãn sổ, mục này mang nhãn T-380. Phiên làm task chạy lại `notes-for <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- `blockedReason` và `ownerParts` nhận thêm một tham số tùy chọn: chữ "xóa lúc" của các team đã xóa mà `toldApart` tách. Có thể là một map `teamId → { by: ToldBy, deletedAt }`, dựng một lần từ các dòng của Thùng rác, hoặc dạng tương đương do phiên làm task chọn. Không truyền tham số thì kết quả như hiện nay.
- `restoreRow` nhận cùng tham số đó và truyền vào `blockedReason`.
- `OwnerPart` có thể thêm một trường tùy chọn cho giờ xóa, để `OwnerCell` ghi "(đã xóa lúc …)" thay "(đã xóa)". `text` của phần team vẫn chỉ là tên, nên cột "Thuộc" sắp / lọc như cũ.
- Chuỗi mới đi qua i18n (`vi.ts`) và dùng lại `deletedAtText` (`seconds` khi `ToldBy` là `second`). Không parse hay format ngày ở chỗ khác.
- Không đổi `toldApart`, `restoreLabel`, `@p2c/db` hay params của lỗi.

##### Test chấp nhận

- [ ] Ca mới (`trash-view.test.ts`): Thùng rác có hai team "Bình Minh" xóa khác phút, và nhân sự `mai` bị chặn `TEAM_NOT_FOUND` vì một trong hai team. `blockedReason` (có tham số mới) trả về câu có vế "xóa lúc" của đúng team đó, vd. "Khôi phục team Bình Minh (xóa lúc 05/10/2026 08:31) trước.". Câu đổi theo team chặn khi đổi `owner.team.id`. Ca đỏ trước khi sửa.
- [ ] Hai team trùng tên xóa cùng phút: vế "xóa lúc" ghi tới giây, khớp tên nút khôi phục của team đó (`restoreLabel`).
- [ ] `ownerParts` (có tham số mới) của dòng đó: phần team mang giờ xóa của đúng team, `text` vẫn là "Team Bình Minh". Ô "Thuộc" hiện "(đã xóa lúc 05/10/2026 08:31)".
- [ ] Chỉ một team "Bình Minh" trong Thùng rác, hoặc không truyền tham số: câu vẫn là "Khôi phục team Bình Minh trước.", ô vẫn "(đã xóa)". Mọi ca hiện có của `blockedReason`, `ownerParts`, `restoreLabel` xanh, không sửa.
- [ ] `restoreRow` khi lệnh khôi phục từ chối `TEAM_NOT_FOUND` lúc có hai team trùng tên: chữ lỗi bằng `blockedReason` của dòng với cùng tham số.
- [ ] `SettingsTrash.tsx` truyền tham số đó cho dòng lý do, ô "Thuộc" và hộp khôi phục, dựng từ mọi dòng, không theo bộ lọc như `told`.
- [ ] `pnpm verify` xanh; e2e xanh trên CI.
- [ ] Thân PR có dòng cho mục L16 trong "Ghi chú OPEN liên quan".

Ước lượng: ≈ 50–80 dòng SP (kể cả `vi.ts`) + ≈ 100–150 dòng test.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển ghi chú sang RESOLVED

##### Rủi ro

risk:med (màn Thùng rác, như T-377).

##### Bị chặn bởi

Không.

## PR #1097 — fix: the TR-1 line and "Thuộc" say when the team in the way was deleted when two teams share its name (T-380)

Trạng thái: MERGED · merge 2026-11-06T09:19:32Z · commit `5d07d5e817c225a9851a08b911e8b54b92ce86b1` · nhánh `task/T-380-trash-team-deleted-at` · nhãn: risk:med

Closes #1094

Phiên code: coding-ses2 (auto-issues)

#### Thay đổi

- `trash-view.ts`:
  - `TeamsDeletedAt` (map `teamId → chữ "xóa lúc"`) và `teamsDeletedAt(rows, told = toldApart(rows))`: chỉ các team mà `toldApart` tách bằng giờ xóa (`minute` / `second`), chữ dựng bằng `deletedAtText` (`seconds` khi `second`), đúng chữ của nút khôi phục team đó. Dòng nhân sự tách bằng giờ xóa không vào map.
  - `blockedReason(row, block, teams?)`: `TEAM_NOT_FOUND` khi `row.owner.team.id` có trong `teams` → "Khôi phục team {name} (xóa lúc {when}) trước."; còn lại như cũ.
  - `ownerParts(row, teams?)`: phần team có trong `teams` mang thêm `deletedAt`; `text` vẫn chỉ là tên. `goneText(part)` mới: "(đã xóa)" hoặc "(đã xóa lúc {when})".
  - `restoreRow(app, row, teams?)` truyền `teams` vào `blockedReason`.
  - Không đổi `toldApart`, `restoreLabel`, `@p2c/db`, params của lỗi.
- `SettingsTrash.tsx`: dựng `teams = teamsDeletedAt(rows, told)` một lần từ mọi dòng (không theo bộ lọc, như `told`), truyền cho dòng lý do (`RecordCell`), ô "Thuộc" (`OwnerCell`, dùng `goneText`) và hộp khôi phục. Giá trị sắp / lọc của cột "Thuộc" vẫn là `ownerParts(row)[0].text` (chỉ tên).
- `vi.ts`: hai khóa `trash.goneAt`, `trash.blocked.teamDeletedAt`.

##### File ngoài danh sách được phép sửa (P-2)

- `apps/desktop/src/routes/RestoreDialog.tsx`: hộp khôi phục là component riêng, gọi `restoreRow(app, row)`. Để hộp dùng cùng câu với dòng lý do (test chấp nhận "`SettingsTrash.tsx` truyền tham số đó cho … hộp khôi phục"), component nhận thêm prop `teams` và truyền vào `restoreRow`. Chỉ 3 dòng code + JSDoc.

#### Test chấp nhận

- [x] Ca mới: hai team "Bình Minh" xóa khác phút (`binhMinh` t1 05/10 08:33, `remade` t2 09/10 14:20), `mai` bị chặn `TEAM_NOT_FOUND`: `blockedReason` có tham số mới → "Khôi phục team Bình Minh (xóa lúc 05/10/2026 08:33) trước." với `owner.team.id = t1`, đổi thành "… 09/10/2026 14:20 …" khi `t2`. Đỏ trước khi sửa (`teamsDeletedAt is not a function`, 9 ca).
- [x] Hai team trùng tên xóa cùng phút: vế "xóa lúc" tới giây ("09/10/2026 14:20:30"), khớp `restoreLabel` của team đó ("Khôi phục team Bình Minh · xóa lúc 09/10/2026 14:20:30").
- [x] `ownerParts` có tham số mới: phần team `{ text: 'Team Bình Minh', deleted: true, deletedAt: '09/10/2026 14:20' }`, `goneText` → "(đã xóa lúc 09/10/2026 14:20)"; phần team sau RE của một KH cũng vậy, phần RE vẫn "(đã xóa)".
- [x] Chỉ một team "Bình Minh", hoặc không truyền tham số: câu "Khôi phục team Bình Minh trước.", ô "(đã xóa)" (`toStrictEqual`, không có `deletedAt`). Mọi ca cũ của `blockedReason`, `ownerParts`, `restoreLabel` xanh, không sửa.
- [x] `restoreRow` (DB thật, đồng hồ ghim qua `clock`): RE xóa lúc team còn → team Sao Mai xóa 05/10 08:33 → tạo lại Sao Mai, xóa 09/10 14:20 → lệnh từ chối `TEAM_NOT_FOUND`, chữ lỗi "Khôi phục team Sao Mai (xóa lúc 05/10/2026 08:33) trước." = `blockedReason` của dòng với cùng tham số; không truyền tham số thì như cũ.
- [x] `SettingsTrash.tsx` truyền tham số cho dòng lý do, ô "Thuộc" và hộp khôi phục, dựng từ mọi dòng (`rows`), không theo bộ lọc. (Không có test component cho màn này; kiểm bằng typecheck + đọc code, e2e hiện có chạy trên CI.)
- [x] `pnpm verify` xanh ở local; e2e chờ CI.
- [x] Dòng cho L16 ở mục dưới.

Cỡ: +101 / −25 dòng SP (kể cả `vi.ts`, `RestoreDialog.tsx`, phần lớn là JSDoc và prettier tách dòng) + 139 dòng test; tổng diff 265 dòng.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` @ `fe687c1`: 1 mục "Trùng file".

- L16 `trash-view.ts:368`–`:371` (`reasonSentence`, nhánh `TEAM_NOT_FOUND`; dòng lý do TR-1 và ô "Thuộc" không nói team nào khi Thùng rác có hai team cùng tên): **đã sửa** ở PR này (mục đích của Issue).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:med`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-380 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

- Ghi chú review PR #1088 — T-380 (#1094, PR #1097, `REVIEW: PASS` @`fe687c1`). Số dòng theo `main` `5d07d5e`:
  - #1088, `apps/desktop/src/routes/trash-view.ts:377`–`:378` (`reasonSentence`, nhánh `TEAM_NOT_FOUND`; map `teamsDeletedAt` `:293`; `ownerParts` `:192`, `goneText` `:210`): khi `toldApart` tách team chặn (`row.owner.team`) bằng giờ xóa, dòng lý do TR-1 nay ghi "Khôi phục team <tên> (xóa lúc …) trước." (khóa `trash.blocked.teamDeletedAt`). Ô "Thuộc" ghi "(đã xóa lúc …)" (khóa `trash.goneAt`), áp cho dòng nhân sự lẫn KH. Cả hai dùng đúng chữ vế "xóa lúc" của nút khôi phục team đó: tới phút, hoặc tới giây khi trùng phút. Team không trùng tên trong Thùng rác, hoặc khi không truyền map, giữ câu và ô cũ; cột "Thuộc" vẫn sắp / lọc theo tên. `apps/desktop/src/routes/SettingsTrash.tsx:335` dựng map từ mọi dòng (không theo bộ lọc) rồi truyền cho dòng lý do (`:83`), ô "Thuộc" (`:94`) và hộp khôi phục: lỗi `restoreRow` của `apps/desktop/src/routes/RestoreDialog.tsx:33` dùng cùng câu. Ca ở `apps/desktop/src/routes/trash-view.test.ts:393` (`ownerParts`), `:426` (`teamsDeletedAt`), `:738`–`:759` (`blockedReason`), `:1240` (`restoreRow` trên DB thật).

---

# Issue #1095 — T-381: Mục sổ G7: ca capability kiểm config gộp lúc build (--config / TAURI_CONFIG), helper chung cho hai ca listener của hàng đợi lưu (review #1090)

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Hai ghi chú không chặn của review PR #1090 (T-374). Cả hai chỉ sửa test của lớp dữ liệu app desktop, không đổi code sản phẩm:

- **Ca hợp đồng capability kiểm thêm config gộp lúc build.** Ca "allows the webview only the Tauri commands it uses" vẫn sót một nguồn quyền của webview: config mà tauri-build gộp vào lúc build bằng JSON merge patch (tauri-utils 2.9.3, acl/build.rs dòng 427). Nguồn này đến từ lệnh `tauri build` với `-c` / `--config` (JSON hoặc file), hoặc từ biến môi trường `TAURI_CONFIG`.
  - **Hiện nay:** đường này thêm được `app.security.capabilities` mà không chạm tauri.conf.json. Ca hiện chỉ đọc tauri.conf.json, và bộ lọc `^tauri` chỉ bắt các file tên `tauri*` trong thư mục src-tauri. Hôm nay không ai dùng đường này: script `build:exe` của app là `tauri build --no-bundle`, còn job build exe của CI không đặt `TAURI_CONFIG`.
  - **Sau task:** ca báo đỏ khi một script trong `package.json` (của app hoặc ở gốc) gọi `tauri` với `-c` / `--config`, hoặc khi workflow CI có `TAURI_CONFIG`.
- **Một helper chung cho hai ca listener của hàng đợi lưu.** Ca "idle() waits for the writes a listener told of the last one starts too" chép nguyên phần dựng của ca DR6-162: cờ `told`, và listener ghi `v2` rồi `v3` sau lượt ghi đầu. Sau task, phần dựng đó nằm ở một helper cạnh `fakeDisk` (vd. `saveTwiceAfterFirst(queue)`), dùng cho cả hai ca. Kịch bản chung của `flush()` và `idle()` vì thế chỉ nằm một chỗ.

##### Bối cảnh

- Nguồn: ghi chú không chặn của review PR #1090 (T-374, #1079; `REVIEW: PASS` @`e06fea5`, mức med; merge 06/11 (`merge-pr --owner`), squash `bf8dee7`): https://github.com/AlexH-AI/Project-2C/pull/1090#issuecomment-6676490072.
- Sổ: PR #1091 ghi hai ghi chú vào OPEN, gắn [G7] (L18, L19 ở `main` `c0f463b`). PR nhãn sổ của đợt này gắn lại nhãn sang Issue này.
- Ca capability: T-374 thêm hai nguồn quyền (`capabilities_path_pattern`, `add_capability`). Task này thêm nguồn thứ ba, nằm ngoài hai nguồn Issue #1079 đã nêu.
- Owner 04/11 (K47): sửa hết rồi mới G7. Owner 06/11/2026 duyệt đề xuất gom sổ lần 2 của pipeline `auto-issues` (T-380, T-381).

##### Tài liệu cần đọc

- `apps/desktop/src/data/tauri-contract.test.ts` ở `main` `c0f463b`: `rust` / `lib` (`:18`–`:20`), `desktop` (`:271`), ca "allows the webview only the Tauri commands it uses" (`:338`; các `expect` của T-374 ở `:355`–`:364`).
- `apps/desktop/package.json` (script `tauri`, `build:exe`), `package.json` ở gốc (script `dev`, `build:exe`), `.github/workflows/ci.yml` (job build exe, `pnpm build:exe`). Chỉ đọc.
- `apps/desktop/src/data/persist-queue.test.ts`: `fakeDisk`, ca DR6-162 (`:323`, phần dựng `:324`–`:335`), ca `idle()` (`:348`, phần dựng `:349`–`:360`).
- `docs/state/review-notes.md`, mục OPEN, nhóm "Ghi chú không chặn của review PR #1090".

##### File / thư mục được phép sửa

- `apps/desktop/src/data/tauri-contract.test.ts`
- `apps/desktop/src/data/persist-queue.test.ts`
- Không sửa `apps/desktop/src-tauri/**`, `package.json` hay workflow CI (test chỉ đọc chúng), nên không cần nhãn `build-exe`.

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files apps/desktop/src/data/tauri-contract.test.ts apps/desktop/src/data/persist-queue.test.ts` (sổ @ `c0f463b`): 2 mục "Trùng file", là hai ghi chú Issue này sửa. **Gộp cả hai** (đã tính vào cỡ):

- L18 `tauri-contract.test.ts:354`: ca capability chưa kiểm config gộp lúc build (`--config` / `TAURI_CONFIG`).
- L19 `persist-queue.test.ts:349`–`:360`: phần dựng chép của ca DR6-162.

Sau PR nhãn sổ, hai mục này mang nhãn T-381. Phiên làm task chạy lại `notes-for <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Không đổi code sản phẩm, không đổi file nào của `src-tauri`. Quyền của webview không đổi.
- Helper mới chỉ nằm trong `persist-queue.test.ts`, không export.

##### Test chấp nhận

- [ ] Ca "allows the webview only the Tauri commands it uses" kiểm thêm hai điều. Một: không script nào của `apps/desktop/package.json` và `package.json` ở gốc gọi `tauri` kèm `-c` / `--config`. Hai: `.github/workflows/ci.yml` (hoặc mọi file `.github/workflows/*.yml`) không có `TAURI_CONFIG`. Ca xanh trên code hiện tại.
- [ ] Probe tạm (không commit): thêm `--config x.json` vào chuỗi script đọc được, hoặc `TAURI_CONFIG` vào chuỗi workflow đọc được, thì ca đỏ. Thân PR ghi cách thử.
- [ ] Ca DR6-162 và ca `idle()` của hàng đợi lưu dùng chung một helper cho phần dựng listener. Hai ca giữ nguyên tên, bước chạy và mọi `expect`, đều xanh. Không còn khối dựng chép trong file.
- [ ] Mọi ca khác của hai file test xanh, không sửa.
- [ ] `pnpm verify` xanh; e2e xanh trên CI.
- [ ] Thân PR có dòng cho hai mục L18, L19 trong "Ghi chú OPEN liên quan".

Ước lượng: 0 dòng SP + ≈ 40–70 dòng test (diff).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển hai ghi chú sang RESOLVED

##### Rủi ro

risk:low (chỉ sửa test).

##### Bị chặn bởi

Không.

## PR #1099 — test: the capability case checks the config tauri build merges in, one helper sets up the save queue's listener (T-381)

Trạng thái: MERGED · merge 2026-11-06T09:54:31Z · commit `b2ef4c19138063cddba0acb4c0d5be3c8c2ce0bf` · nhánh `task/T-381-build-config-capability-listener-helper` · nhãn: risk:low

Closes #1095

Phiên code: coding-ses1 (auto-issues)

#### Thay đổi

Chỉ sửa test, không đổi code sản phẩm, không đổi file nào của `src-tauri`, `package.json` hay workflow CI (test chỉ đọc chúng), nên không cần nhãn `build-exe`.

- `apps/desktop/src/data/tauri-contract.test.ts`, ca "allows the webview only the Tauri commands it uses": kiểm thêm nguồn quyền thứ ba, config mà tauri-build gộp vào lúc build bằng JSON merge patch.
  - Mọi script của `apps/desktop/package.json` và `package.json` ở gốc được tách theo `&&`, `||`, `;`, `|`. Lệnh nào gọi `tauri` không được có `--config`, cũng không có `-c`, kể cả khi `-c` đứng một mình (`-c x.json`), dính giá trị (`-cx.json`) hay gộp với cờ ngắn khác (`-dc x.json`). Regex: `/(?:^|\s)(?:-[A-Za-z]*c|--config\b)/`.
  - Ca cũng đòi danh sách lệnh gọi `tauri` có `tauri build --no-bundle`, để vòng kiểm không trống khi cách đọc script hỏng.
  - Hai `package.json` và mọi file `.github/workflows/*.yml` / `*.yaml` không có `TAURI_CONFIG`. Ca đòi danh sách workflow có `ci.yml`.
- `apps/desktop/src/data/persist-queue.test.ts`: helper `saveTwiceAfterFirst(queue)` cạnh `fakeDisk` (không export) dựng listener: cờ `told`, ghi `v2` rồi `v3` khi được báo lượt ghi đầu đã xong. Ca DR6-162 và ca `idle()` dùng chung helper; hai ca giữ nguyên tên, bước chạy và mọi `expect`. Không còn khối dựng chép trong file.

#### Test chấp nhận

- [x] Ca "allows the webview only the Tauri commands it uses" kiểm thêm: không script nào của `apps/desktop/package.json` và `package.json` ở gốc gọi `tauri` kèm `-c` / `--config`; mọi file `.github/workflows/*.yml` không có `TAURI_CONFIG`. Ca xanh trên code hiện tại.
- [x] Probe tạm (không commit), cách thử bên dưới: ca đỏ với mọi biến thể `--config` / `-c` và với `TAURI_CONFIG`; cờ khác vẫn xanh.
- [x] Ca DR6-162 và ca `idle()` dùng chung `saveTwiceAfterFirst`; giữ tên, bước chạy, mọi `expect`; xanh.
- [x] Mọi ca khác của hai file test xanh, không sửa (34/34 ca của hai file).
- [x] `pnpm verify` xanh ở local; e2e: chờ CI.
- [x] Hai mục L16, L17 (L18, L19 ở `c0f463b` theo Issue) có dòng trong "Ghi chú OPEN liên quan".

##### Cách thử probe

Tạm thay `read` của ca bằng bản đọc biến môi trường: `PROBE_FILE` / `PROBE_AT` / `PROBE_FLAG` chèn `PROBE_FLAG` ngay sau chuỗi `PROBE_AT` trong file `PROBE_FILE`; `PROBE_ENV` nối `env:\n  TAURI_CONFIG: '{}'` vào cuối file đó. Chạy `pnpm exec vitest run apps/desktop/src/data/tauri-contract.test.ts -t 'allows the webview only the Tauri commands it uses'` cho từng ca, rồi gỡ mã probe trước khi commit. Kết quả:

| Probe | Kết quả | Lý do |
|---|---|---|
| không probe | xanh | |
| `package.json` gốc, `tauri dev --config x.json` | đỏ | `not to match` regex cờ config |
| `package.json` gốc, `tauri dev --config={}` | đỏ | như trên |
| `package.json` gốc, `tauri dev -c x.json` | đỏ | như trên |
| `package.json` gốc, `tauri dev -cx.json` | đỏ | như trên |
| `package.json` gốc, `tauri dev -dc x.json` | đỏ | như trên |
| app, script `tauri` thành `tauri -c x.json` | đỏ | như trên |
| app, `tauri build --no-bundle --config x.json` | đỏ | danh sách lệnh không còn `tauri build --no-bundle` |
| `package.json` gốc, `tauri dev --debug -t x86_64-pc-windows-msvc` | xanh | cờ khác, không phải config |
| `.github/workflows/ci.yml` thêm `TAURI_CONFIG` | đỏ | `ci.yml: … not to contain 'TAURI_CONFIG'` |
| `package.json` gốc, script `build:web` thành `pnpm TAURI_CONFIG=x.json --filter …` | đỏ | `package.json: … not to contain 'TAURI_CONFIG'` |

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `b27bf0a`): 2 mục "Trùng file", cả hai đã sửa.

- L16 `apps/desktop/src/data/tauri-contract.test.ts` **[T-381 #1095]** (ca capability chưa kiểm config gộp lúc build, `--config` / `TAURI_CONFIG`): đã sửa.
- L17 `apps/desktop/src/data/persist-queue.test.ts` **[T-381 #1095]** *Duplicated Code* (phần dựng chép của ca DR6-162 ở ca `idle()`): đã sửa.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-381 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

- Ghi chú review PR #1090 — T-381 (#1095, PR #1099, `REVIEW: PASS` @`b27bf0a`). Số dòng theo `main` `b2ef4c1`:
  - #1090, `apps/desktop/src/data/tauri-contract.test.ts:365`–`:387` (ca "allows the webview only the Tauri commands it uses" `:338`): ca nay kiểm thêm nguồn quyền thứ ba, config mà tauri-build gộp lúc build. Script của package.json của app và ở gốc được tách theo `&&`, `||`, `;`, `|`; lệnh nào gọi `tauri` không được có `--config` hay `-c`, kể cả `-c` dính giá trị hay gộp với cờ ngắn khác (`:379`). Ca đòi danh sách lệnh có `tauri build --no-bundle` (`:377`), để vòng kiểm không trống. Hai package.json và mọi file `.yml` / `.yaml` của thư mục workflow (ca đòi có ci.yml) không có `TAURI_CONFIG` (`:381`–`:387`). Probe của thân PR #1099: ca đỏ với mọi biến thể cờ config và với `TAURI_CONFIG`, xanh với cờ khác.
  - #1090, *Duplicated Code* `apps/desktop/src/data/persist-queue.test.ts:52`–`:65` (`saveTwiceAfterFirst`, cạnh `fakeDisk` `:5`): phần dựng listener (cờ `told`, ghi `v2` rồi `v3` sau lượt ghi đầu) nay nằm một chỗ, không export. Ca DR6-162 (`:338`) và ca `idle()` (`:356`) gọi helper ở `:341`, `:359`, giữ tên, bước chạy và mọi `expect`.

---

# Issue #1101 — T-382: Mục sổ G7: một helper cho vế "xóa lúc" của Thùng rác, ca capability lọc đúng lệnh tauri, kiểm run: của workflow và [env] của Cargo (review #1097, #1099)

Trạng thái: CLOSED · nhãn: type:task, risk:low, status:in-progress, ready-for-agent

##### Mục tiêu

Bốn ghi chú không chặn còn `[G7]` trong sổ: một của review PR #1097 (T-380), ba của review PR #1099 (T-381). Không đổi hành vi nào của app. Một mục refactor code sản phẩm, ba mục siết test hợp đồng capability.

- **Một helper cho vế "xóa lúc" của Thùng rác** (L16, review #1097).
  - **Hiện nay:** luật dựng vế "xóa lúc" viết hai lần trong `apps/desktop/src/routes/trash-view.ts`: ở `teamsDeletedAt` (`:300`–`:301`) và ở `restoreLabel` (`:330`–`:332`). Cả hai nơi viết `by === 'minute' || by === 'second'` rồi gọi `deletedAtText(row, { seconds: by === 'second' })`. Bất biến của T-380 là dòng lý do và ô "Thuộc" nói đúng chữ trong tên nút khôi phục của team đó. Bất biến này nay chỉ có test giữ.
  - **Sau task:** một helper không export, vd. `deletionWords(row, by): string | undefined`, dùng cho cả hai nơi. Chữ trên màn không đổi.
- **Bộ lọc lệnh `tauri` chỉ giữ lệnh gọi `tauri`** (L18, review #1099).
  - **Hiện nay:** bộ lọc `/\btauri\b/` (`apps/desktop/src/data/tauri-contract.test.ts:376`) giữ cả ba lệnh cargo của script `verify:rust` trong `package.json` ở gốc, vì chúng chứa đường dẫn `apps/desktop/src-tauri/Cargo.toml`. Regex cờ config (`:379`) vì thế chạy cả trên cờ của cargo. Hôm nay ca xanh vì `-D warnings` có dấu cách. Đổi thành `-- -Dclippy::pedantic` thì ca đỏ sai, vì `-Dc` khớp `-[A-Za-z]*c`.
  - **Sau task:** chỉ giữ lệnh có `tauri` là một từ đứng riêng, vd. `/(?:^|\s)tauri(?:\s|$)/`.
- **Workflow CI được kiểm cờ config như script** (L19, review #1099).
  - **Hiện nay:** file workflow chỉ được kiểm `TAURI_CONFIG` (`:381`–`:387`). Một bước `run:` gọi thẳng `pnpm --filter @p2c/desktop tauri build --no-bundle --config x.json` (không qua script của `package.json`) vẫn xanh. Hôm nay job build exe của `ci.yml` chỉ chạy `pnpm build:exe`.
  - **Sau task:** các lệnh `run:` của mọi file `.github/workflows/*.yml` / `*.yaml` được tách như script (`&&`, `||`, `;`, `|`, xuống dòng của khối `run: |`), lọc bằng cùng bộ lọc lệnh `tauri` mới, rồi áp cùng regex cờ config.
- **Không file config Cargo nào đặt `TAURI_CONFIG`** (L20, review #1099).
  - **Hiện nay:** `TAURI_CONFIG` còn đến được build script của tauri-build qua bảng `[env]` của file config Cargo (`.cargo/config.toml` hoặc `.cargo/config` ở `apps/desktop/src-tauri/` hoặc một thư mục cha trong repo). Ca không đọc. Hôm nay repo không có thư mục `.cargo`.
  - **Sau task:** ca thêm `expect` rằng không file config Cargo nào trong repo (các thư mục từ `apps/desktop/src-tauri` lên tới gốc repo) có `TAURI_CONFIG`. File không có thì bỏ qua.

##### Bối cảnh

- Nguồn:
  - review PR #1097 (T-380, #1094; `REVIEW: PASS` @`fe687c1`, mức med; merge 06/11, squash `5d07d5e`);
  - review PR #1099 (T-381, #1095; `REVIEW: PASS` @`b27bf0a`, mức low; merge 06/11, squash `b2ef4c1`).
- Sổ: PR #1098 và #1100 ghi bốn ghi chú vào OPEN, gắn [G7] (L16, L18, L19, L20 ở `main` `00693d7`). PR nhãn sổ của đợt này gắn lại nhãn sang Issue này.
- L19, L20 nằm ngoài phạm vi Issue #1095 nên không phải lỗi của PR #1099.
- Owner 04/11 (K47): sửa hết rồi mới G7. Owner 06/11/2026 bảo tạo Issue cho bốn mục này.

##### Tài liệu cần đọc

- `apps/desktop/src/routes/trash-view.ts` ở `main` `00693d7`: `TeamsDeletedAt` / `teamsDeletedAt` (`:286`–`:304`), `restoreLabel` (`:317`–`:339`), `deletedAtText`. Test cạnh nó: `trash-view.test.ts` (ca `teamsDeletedAt` so map với `restoreLabel`).
- `apps/desktop/src/data/tauri-contract.test.ts`: ca "allows the webview only the Tauri commands it uses" (`:338`), phần của T-381 (`:367`–`:387`), helper `files`.
- `package.json` ở gốc (script `verify:rust`), `apps/desktop/package.json`, `.github/workflows/*.yml`. Chỉ đọc.
- `docs/state/review-notes.md`, mục OPEN, nhóm "Ghi chú không chặn của review PR #1097" và "… PR #1099".

##### File / thư mục được phép sửa

- `apps/desktop/src/routes/trash-view.ts`
- `apps/desktop/src/routes/trash-view.test.ts` (chỉ khi cần)
- `apps/desktop/src/data/tauri-contract.test.ts`
- Không sửa `apps/desktop/src-tauri/**`, `package.json` hay workflow CI (test chỉ đọc chúng), nên không cần nhãn `build-exe`.

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files apps/desktop/src/routes/trash-view.ts apps/desktop/src/routes/trash-view.test.ts apps/desktop/src/data/tauri-contract.test.ts` (sổ @ `00693d7`): 4 mục "Trùng file", là bốn ghi chú Issue này sửa. **Gộp cả bốn** (đã tính vào cỡ):

- L16 `trash-view.ts:300`: luật vế "xóa lúc" viết hai lần.
- L18 `tauri-contract.test.ts:376`: bộ lọc `\btauri\b` giữ lệnh cargo.
- L19 `tauri-contract.test.ts:381`: lệnh `run:` của workflow chưa được kiểm cờ config.
- L20 `tauri-contract.test.ts:385`: `[env]` của config Cargo chưa được kiểm `TAURI_CONFIG`.

Sau PR nhãn sổ, bốn mục này mang nhãn T-382. Phiên làm task chạy lại `notes-for <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Không đổi hành vi của app: chữ của nút khôi phục, dòng lý do TR-1 và ô "Thuộc" giữ nguyên từng ký tự. `teamsDeletedAt` và `restoreLabel` giữ chữ ký. Helper mới không export.
- Không đổi file nào của `src-tauri`. Quyền của webview không đổi.

##### Test chấp nhận

- [ ] `teamsDeletedAt` và `restoreLabel` cùng gọi một helper cho vế "xóa lúc"; trong `trash-view.ts` không còn hai chỗ viết `by === 'minute' || by === 'second'`. Mọi ca của `trash-view.test.ts` xanh, không sửa `expect` nào.
- [ ] Bộ lọc lệnh `tauri` giữ `tauri build --no-bundle` và bỏ ba lệnh cargo của `verify:rust`. Probe tạm (không commit): thay `-D warnings` bằng `-- -Dclippy::pedantic` trong chuỗi script đọc được thì ca vẫn xanh; thêm `--config x.json` vào lệnh `tauri` thì ca đỏ.
- [ ] Probe tạm: thêm vào chuỗi workflow đọc được một bước `run: pnpm --filter @p2c/desktop tauri build --no-bundle --config x.json` (cả dạng một dòng lẫn khối `run: |`) thì ca đỏ. Workflow hiện tại xanh.
- [ ] Probe tạm: một chuỗi config Cargo đọc được có `TAURI_CONFIG` trong `[env]` thì ca đỏ. Repo hiện tại (không có `.cargo`) xanh.
- [ ] Thân PR ghi cách thử của từng probe.
- [ ] Mọi ca khác của các file test xanh, không sửa.
- [ ] `pnpm verify` xanh; e2e xanh trên CI.
- [ ] Thân PR có dòng cho bốn mục L16, L18, L19, L20 trong "Ghi chú OPEN liên quan".

Ước lượng: ≈ 5–15 dòng SP + ≈ 40–80 dòng test (diff).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển bốn ghi chú sang RESOLVED

##### Rủi ro

risk:low (refactor nhỏ không đổi hành vi + siết test).

##### Bị chặn bởi

Không.

## PR #1109 — refactor: one helper for the trash's deletion words, tighter tauri config contract (T-382)

Trạng thái: MERGED · merge 2026-11-06T14:45:31Z · commit `4d38a726accff2f7223d155d80f0565322081805` · nhánh `task/T-382-trash-helper-tauri-contract` · nhãn: risk:low

Closes #1101

Phiên code: coding-ses2 (auto-issues)

#### Thay đổi

- `apps/desktop/src/routes/trash-view.ts`: helper không export `deletionWords(row, by): string | undefined` dựng vế "xóa lúc" (tới phút / tới giây) cho cả `teamsDeletedAt` và `restoreLabel`. Điều kiện `by === 'minute' || by === 'second'` chỉ còn một chỗ, trong helper. Chữ ký của hai hàm export và chữ trên màn không đổi (L16 của Issue).
- `apps/desktop/src/data/tauri-contract.test.ts`, ca "allows the webview only the Tauri commands it uses":
  - Bộ lọc lệnh `tauri` đổi từ `/\btauri\b/` sang `/(?:^|\s)tauri(?:\s|$)/`: giữ `tauri build --no-bundle` (và script `tauri`), bỏ ba lệnh cargo của `verify:rust` (L18 của Issue).
  - Lệnh `run:` của mọi `.github/workflows/*.yml` / `*.yaml` (một dòng, có hoặc không ngoặc; khối `|` giữ dòng, khối `>` gộp dòng; mọi dòng thụt sâu hơn khóa `run:`) được tách như script (`&&`, `||`, `;`, `|`, xuống dòng; dòng tận cùng bằng `\` hoặc `` ` `` nối dòng sau), lọc bằng cùng bộ lọc `tauri`, rồi áp cùng regex cờ config. Thêm `expect` rằng các lệnh `run:` đọc được có `pnpm build:exe`, để phần tách không rỗng âm thầm (L19 của Issue).
  - Vòng `TAURI_CONFIG` đọc thêm `.cargo/config.toml` và `.cargo/config` ở `apps/desktop/src-tauri/`, `apps/desktop/`, `apps/` và gốc repo; file không có thì bỏ qua (L20 của Issue).
- Không sửa `src-tauri/**`, `package.json` hay workflow (test chỉ đọc chúng) nên không gắn `build-exe`.

#### Test chấp nhận

- [x] `teamsDeletedAt` và `restoreLabel` cùng gọi `deletionWords`; `trash-view.ts` chỉ còn một chỗ viết `by === 'minute' || by === 'second'` (trong helper). `trash-view.test.ts` xanh 105/105, không sửa file test.
- [x] Bộ lọc giữ `tauri build --no-bundle`, bỏ ba lệnh cargo của `verify:rust`: probe P1 xanh, P2 đỏ (dưới).
- [x] Lệnh `run:` của workflow có `tauri … --config x.json` thì ca đỏ (P3 một dòng, P4 khối `run: |`, P5 khối `run: >-`). Workflow hiện tại xanh.
- [x] Config Cargo có `TAURI_CONFIG` trong `[env]` thì ca đỏ (P6, P7); config Cargo không có thì xanh (P8). Repo hiện tại (không có `.cargo`) xanh.
- [x] Cách thử của từng probe: ghi dưới.
- [x] Mọi ca khác của hai file test xanh, không sửa (`tauri-contract.test.ts` 18/18).
- [x] `pnpm verify` xanh ở local; e2e chờ CI.
- [x] "Ghi chú OPEN liên quan" có dòng cho cả bốn mục.

##### Probe (tạm, không commit)

Script tạm trong scratchpad: chép `tauri-contract.test.ts` thành `apps/desktop/src/data/tauri-contract.probe<N>.test.ts`, thay hàm `read` của ca bằng bản trả về chuỗi đã sửa của file thật (hoặc chuỗi giả cho file config Cargo, kèm `existsSync` coi file giả là có), chạy `pnpm vitest run <file> -t "allows the webview only"`, rồi xóa bản chép. File thật của repo không đổi. Chạy trên bản test mới và trên bản ở `main` `5cd997c`:

| Probe | Chuỗi đọc được bị sửa | Bản mới | Bản `main` |
|---|---|---|---|
| P1 | `package.json`: `-D warnings` → `-- -Dclippy::pedantic` trong `verify:rust` | xanh | **đỏ** (`cargo clippy …` khớp regex cờ config) |
| P2 | `package.json`: `build:exe` → `pnpm --filter @p2c/desktop tauri build --no-bundle --config x.json` | **đỏ** (regex cờ config) | — |
| P3 | `ci.yml`: thêm bước `- run: pnpm --filter @p2c/desktop tauri build --no-bundle --config x.json` | **đỏ** | xanh (bỏ lọt) |
| P4 | `ci.yml`: thêm bước `run: \|` có dòng `pnpm install` rồi dòng lệnh `tauri` trên, sau đó `shell: pwsh` | **đỏ** | xanh (bỏ lọt) |
| P5 | `ci.yml`: thêm bước `run: >-` với `… tauri build` và `--no-bundle --config x.json` ở hai dòng | **đỏ** | — |
| P6 | thêm `apps/desktop/src-tauri/.cargo/config.toml` = `[env]` / `TAURI_CONFIG = "x.json"` | **đỏ** | xanh (bỏ lọt) |
| P7 | thêm `.cargo/config` ở gốc = `[env]` / `TAURI_CONFIG = { value = "x.json" }` | **đỏ** | — |
| P8 | thêm `apps/desktop/src-tauri/.cargo/config.toml` = `[env]` / `FOO = "1"` | xanh | — |

Mọi ca đỏ của bản mới đỏ ở đúng `expect` của mục đó (`not.toMatch` regex cờ config, hoặc `not.toContain('TAURI_CONFIG')` kèm tên file), không ở `expect` khác. Script tự báo lỗi khi chuỗi thay không khớp, nên probe không xanh vì không áp được.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `5cd997c`): 4 mục "Trùng file", đều là mục Issue này sửa. Số dòng sổ nay là L14, L16, L17, L18 (Issue ghi L16, L18, L19, L20 ở sổ `00693d7`).

- L14 (Issue: L16) `trash-view.ts:300`, luật vế "xóa lúc" viết hai lần: **đã sửa** (helper `deletionWords`).
- L16 (Issue: L18) `tauri-contract.test.ts:376`, bộ lọc `\btauri\b` giữ lệnh cargo: **đã sửa** (`/(?:^|\s)tauri(?:\s|$)/`).
- L17 (Issue: L19) `tauri-contract.test.ts:381`, lệnh `run:` của workflow chưa được kiểm cờ config: **đã sửa**.
- L18 (Issue: L20) `tauri-contract.test.ts:385`, `[env]` của config Cargo chưa được kiểm `TAURI_CONFIG`: **đã sửa**.

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-382 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

- Ghi chú review PR #1097, #1099 — T-382 (#1101, PR #1109, `REVIEW: PASS` @`8a75fb3`). Số dòng theo `main` `4d38a72`:
  - #1097, *Duplicated Code* `apps/desktop/src/routes/trash-view.ts:310` (`deletionWords`; `teamsDeletedAt` `:293`, `restoreLabel` `:327`): luật dựng vế "xóa lúc" nay nằm trong một helper không export. `teamsDeletedAt` (`:299`) và `restoreLabel` (`:339`) cùng gọi helper này; điều kiện `by === 'minute' || by === 'second'` chỉ còn trong helper. Chữ trên màn và chữ ký hai hàm export không đổi; file test cạnh nó không sửa.
  - #1099, `apps/desktop/src/data/tauri-contract.test.ts:380` (`tauriCalls`; ca "allows the webview only the Tauri commands it uses" `:338`): bộ lọc đổi từ `/\btauri\b/` sang `/(?:^|\s)tauri(?:\s|$)/`, nên regex cờ config không còn chạy trên ba lệnh cargo của script verify:rust. `tauri build --no-bundle` vẫn được giữ (`:390`). Probe P1 của thân PR #1109: `-- -Dclippy::pedantic` xanh (bản cũ đỏ). Ghi chú mới về các dạng gọi CLI mà bộ lọc này bỏ nằm ở OPEN, nhóm review #1109.
  - #1099, `apps/desktop/src/data/tauri-contract.test.ts:398`–`:413` (`runs`): lệnh `run:` của mọi file workflow (một dòng, có hoặc không ngoặc; khối `|` giữ dòng, khối `>` gộp dòng) được tách như script. `commands` (`:372`) tách thêm theo xuống dòng và nối dòng tận cùng bằng `\` hoặc dấu backtick. Các lệnh này được lọc bằng cùng bộ lọc `tauri`, rồi áp cùng regex cờ config (`noConfig` `:381`). Ca đòi các lệnh `run:` có `pnpm build:exe` (`:412`), để phần tách không rỗng. Probe P3–P5 của thân PR #1109: đỏ.
  - #1099, `apps/desktop/src/data/tauri-contract.test.ts:414`–`:419` (`cargoConfigs`; vòng `TAURI_CONFIG` `:417`): ca đọc thêm `.cargo/config.toml` và `.cargo/config` ở `apps/desktop/src-tauri/`, `apps/desktop/`, `apps/` và gốc repo, bỏ qua file không có. Không file nào trong số đó được có `TAURI_CONFIG`. Probe của thân PR #1109: P6, P7 đỏ; P8 (`[env]` không có `TAURI_CONFIG`) xanh.

---

# Issue #1107 — T-383: Mục sổ G7: auto-wait đọc nhánh 404 vẫn chờ push, hàng "GitHub chưa thấy" chờ head kẹt bằng ci --not, ca test cancelled không --since, kết quả chạy thật auto-issues

Trạng thái: CLOSED · nhãn: type:task, risk:low

##### Mục tiêu

Dọn bốn mục sổ [G7] của review #1103 (T-378) và #1104 (T-379) ở `auto-wait` và skill `auto-issues`, để sổ OPEN trống trước G7 (K47).

**Làm ngoài pipeline `auto-issues`.** `tools/auto-wait*` và skill thuộc rào "không tự sửa" (K45), nên Issue này không gắn `ready-for-agent`. Owner làm theo cách thường (phiên thường, `review-pr`, `merge-pr`), như T-378 và T-379.

1. **Đọc nhánh lỗi 404 không dừng lệnh chờ** (review #1104). Hiện nay `ci <N> --not <H>` đọc SHA nhánh của PR mỗi lần head vẫn là `H`. Ref không có ở repo gốc (404; vd. PR từ fork) thì lần đọc ném lỗi, nên năm lần liền ra mã 3, `--once` ra mã 3 ngay. Trước PR #1104, nhánh `--not` chỉ chờ push. Sau task: lỗi 404 của lần đọc nhánh nghĩa là "không biết nhánh", và lệnh chờ push như trước PR #1104 (`head still <H>: waiting for a push`). Lỗi khác (mạng, `gh` lỗi tạm) vẫn là một lần đọc lỗi như nay.
2. **Hàng "kết quả mà GitHub chưa thấy" chờ head kẹt bằng `ci --not`** (review #1104). Hiện nay khi phiên code đã báo `ĐÃ PUSH @<X>` mà head của PR vẫn là `H`, hàng này đặt `sleep --timeout 1` thay cho lệnh `ci --not` đang chạy. Bộ đếm 3 phút của lệnh cũ mất theo, rồi lần sau hàng bảo "tìm nguyên nhân … và nhắc phiên con sửa". Với head kẹt, việc sửa là phiên điều phối đóng / mở lại PR (§4 "Head của PR kẹt"), không phải nhắc phiên con. Sau task: với kết quả là head mới, lệnh chờ là `ci <N> --not <H> --timeout 15` (giữ lệnh đang chạy nếu đúng là lệnh này), để mã 3 `PR head stale` tự ra sau 3 phút. Hàng nêu cách thấy nhánh đã ở `X` (`node tools/auto-wait.mjs ci <N> --not <H> --once`, text `branch at <X>`) và ghi rõ nguyên nhân này xử lý theo §4.
3. **Ca test `cancelled` / `startup_failure` ở nhánh không `--since`** (review #1103). Issue #1083 chốt "Không `--since`: mọi trường hợp khác không đổi, gồm … run `cancelled` / `startup_failure`", nhưng không ca nào giữ điều này. Code hiện đúng (sàn chỉ so `=== 'failure'`). Sau task: có ca giữ hành vi đó, để nới sàn thành `!== 'success'` thì ca đỏ.
4. **Kết quả chạy thật `auto-issues` sau PR #1104** (test chấp nhận cuối của #1085). Thân PR ghi kết quả đợt `auto-issues` gần nhất sau khi merge #1104: không bước nào của §6 chờ quá 5 phút khi phiên con đã xong; có mã 3 `PR head stale` nào không. Ghi cả vào comment Issue #1085.

##### Bối cảnh

- Nguồn: ghi chú không chặn của review PR #1103 (https://github.com/AlexH-AI/Project-2C/pull/1103#issuecomment-6684975498) và PR #1104 (https://github.com/AlexH-AI/Project-2C/pull/1104#issuecomment-6685746878). Sổ: PR #1105 và #1106 ghi vào OPEN, gắn [G7]. PR nhãn sổ của Issue này gắn lại nhãn.
- Owner 06/11/2026 bảo tạo Issue cho các mục [G7] này. Cùng lúc Owner chọn:
  - mục "luật chờ lâu tổng 60 phút hỏi Owner sớm khi review mức high chạy dài": **chấp nhận, không sửa**. Số đo 04–06/11: từ commit cuối tới comment REVIEW, kể cả CI, lâu nhất 38 phút (#1070); review mức high #1066 và #1086 là 25 và 24 phút. PR nhãn sổ chuyển mục này sang ACCEPTED; Issue này không gồm nó;
  - mục chạy thật: **gộp vào Issue này** (mục 4).
- Mục 4 cần một đợt `auto-issues` thật sau #1104. Cách gọn nhất: chạy T-382 (#1101, `ready-for-agent`) qua pipeline trước Issue này. Đợt đó hết hàng đợi thì sang §6 (gom sổ), nên có cả bước chờ `sleep --timeout 5`. Không có đợt nào trước khi mở PR thì thân PR ghi "chưa chạy" và Owner quyết (chấp nhận, hoặc chờ đợt sau).
- Owner 04/11 (K47): sửa hết rồi mới G7.

##### Tài liệu cần đọc

- `tools/auto-wait-core.mjs` ở `main` `68bbae2`: `ciState` (`:143`; nhánh `--not` và `branch()` `:150`–`:163`; sàn `failure` `:204`–`:211`), `heldFor` (`:293`), `waitFor` (`:309`; lần đọc lỗi `:319`–`:330`).
- `tools/auto-wait-core.test.mjs`: `describe('without since (a push after a fix)')` (`:226`), `describe('with since (a reopened PR)')` ca `cancelled` (`:313`), `describe('with not, the branch ahead of the head …')` (`:389`).
- `tools/auto-wait.mjs`: `gh` (`:44`), `branchSha` (`:65`–`:70`), `branchHeld` (`:73`), `READS.ci` (`:91`–`:104`); `tools/session-io.mjs` `run` (cách lỗi `gh` thành `Error`, chỉ đọc). Lỗi 404 thật của `gh api …/git/ref/heads/<nhánh không có>`: `gh: Not Found (HTTP 404)`.
- `.claude/skills/auto-issues/SKILL.md`: §2 bảng bước (`:109`–`:111`), "Chờ" (`:135`–`:157`; mã thoát `:148`–`:151`), §3.3 / §3.4 dòng `ĐÃ PUSH` (`:212`, `:219`), §4 "Head của PR kẹt" (`:277`), §6 (`:306`–`:323`).
- `docs/state/review-notes.md`, OPEN: nhóm "Ghi chú không chặn của review PR #1103" và "… PR #1104".

##### File / thư mục được phép sửa

- `.claude/skills/auto-issues/SKILL.md`
- `tools/auto-wait-core.mjs`, `tools/auto-wait-core.test.mjs`, `tools/auto-wait.mjs`

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files .claude/skills/auto-issues/SKILL.md tools/auto-wait-core.mjs tools/auto-wait-core.test.mjs tools/auto-wait.mjs` (sổ @ `68bbae2`): 5 mục "Trùng file", đều [G7].

- **Gộp** (đã tính vào cỡ), sau PR nhãn sổ mang nhãn T-383:
  - L20 `tools/auto-wait-core.test.mjs:226`: ca `cancelled` / `startup_failure` không `--since` (mục 3);
  - L23 `.claude/skills/auto-issues/SKILL.md:111`: hàng "kết quả mà GitHub chưa thấy" (mục 2);
  - L24 `tools/auto-wait.mjs:66`–`:70` + `tools/auto-wait-core.test.mjs:389`: đọc nhánh lỗi (mục 1);
  - L25 `.claude/skills/auto-issues/SKILL.md:323`: chạy thật (mục 4).
- **Không gộp:** L22 `.claude/skills/auto-issues/SKILL.md:152` (luật chờ lâu 60 phút). Owner 06/11 chấp nhận, PR nhãn sổ chuyển sang ACCEPTED.

Phiên làm task chạy lại `notes-for <issue>` lúc bắt đầu (số dòng sổ đổi sau PR nhãn).

##### Interface / hợp đồng

- `auto-wait` giữ cú pháp, usage và mã thoát.
- `ciState`: `branch()` ném lỗi mà thông điệp có `(HTTP 404)` → coi như không có thông tin nhánh, kết quả như `branch()` trả `null` (`head still <H>: waiting for a push`). Lỗi khác vẫn ném ra như nay (`waitFor` tính là một lần đọc lỗi). Phần phân loại nằm ở `auto-wait-core.mjs`, để test không cần mạng.
- `SKILL.md`: chỉ đổi hàng `:111` của bảng §2 (và câu tương ứng nếu có trỏ tới nó). Không đổi quyền của pipeline (M11), rào, brief của phiên con, luật chờ lâu.

##### Test chấp nhận

- [ ] `ciState` với `not = H`, head vẫn `H`, `branch()` ném `Error('gh api … failed: gh: Not Found (HTTP 404)')` → `{ done: false, text: 'head still <H>: waiting for a push' }`. Ca này đỏ trước khi sửa (lỗi ném ra).
- [ ] Cùng như trên, `branch()` ném lỗi khác (vd. `… failed: connect ETIMEDOUT`) → `ciState` ném lỗi (không nuốt).
- [ ] Không `--since`, run `pull_request` mới nhất của head `cancelled`, rollup chỉ có check xanh → `done: true`, `EXIT.done`, `CI green …`; cùng với `startup_failure`.
- [ ] Mọi ca hiện có của `auto-wait-core.test.mjs` xanh, không sửa.
- [ ] `SKILL.md` hàng `:111`: kết quả là head mới (`ĐÃ PUSH @<X>`) mà head của PR vẫn `H` → lệnh chờ `ci <N> --not <H> --timeout 15`, không `sleep --timeout 1`; hàng nêu `ci <N> --not <H> --once` / `branch at <X>` và trỏ §4 "Head của PR kẹt" cho nguyên nhân này, không nhắc phiên con.
- [ ] Thân PR ghi kết quả đợt `auto-issues` gần nhất sau #1104 (mục 4), hoặc "chưa chạy" để Owner quyết; kết quả có thì ghi cả vào comment Issue #1085.
- [ ] `pnpm verify` xanh.
- [ ] Thân PR có dòng cho mỗi mục "Trùng file" trong "Ghi chú OPEN liên quan".

Ước lượng: ≈ 5–10 dòng SP + ≈ 30–40 dòng test + ≈ 2–4 dòng `SKILL.md`.

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển các mục đã sửa sang RESOLVED

##### Rủi ro

risk:low. Làm ngoài pipeline `auto-issues` (rào "không tự sửa", K45); Owner review và merge theo cách thường.

##### Bị chặn bởi

Không. Nên chạy T-382 (#1101) qua pipeline trước, để có đợt chạy thật cho mục 4.

## PR #1113 — fix: auto-wait waits for a push when the PR's branch is not on GitHub (T-383)

Trạng thái: MERGED · merge 2026-11-06T15:44:27Z · commit `5e0340362d9d50b4aa082d5611e9a7cf4a19acc1` · nhánh `task/T-383-auto-wait-branch-404` · nhãn: type:task, risk:low

Closes #1107

Phiên code: phiên thường (ngoài pipeline `auto-issues`: `tools/auto-wait*` và skill thuộc rào "không tự sửa", K45).

#### Thay đổi

- `tools/auto-wait-core.mjs`: `ciState` đọc nhánh qua helper không export `readBranch(branch)`. `branch()` ném lỗi mà thông điệp có `(HTTP 404)` → `null`, nên `ciState` ra `head still <H>: waiting for a push` như trước PR #1104. Lỗi khác ném ra như nay, `waitFor` tính là một lần đọc lỗi. Phần phân loại nằm ở core, test không cần mạng (mục 1).
- `tools/auto-wait.mjs`: chỉ comment của `branchSha` (nhánh không có thì `gh` lỗi `(HTTP 404)`, `ciState` coi là không có tin). Cú pháp, usage, mã thoát không đổi.
- `tools/auto-wait-core.test.mjs`: ba ca mới, không sửa ca cũ:
  - nhóm `with not, the branch ahead of the head …`: `branch()` ném `… failed: gh: Not Found (HTTP 404)` → `{ done: false, text: 'head still abc1234: waiting for a push' }` (mục 1);
  - cùng nhóm: `branch()` ném `… failed: connect ETIMEDOUT` hoặc `… failed: gh: Server Error (HTTP 500)` → `ciState` ném đúng lỗi đó (mục 1);
  - nhóm `without since (a push after a fix)`: run `pull_request` mới nhất `cancelled` / `startup_failure`, rollup xanh, không `--since` → `CI green @abc1234: 2 pass` (mục 3).
- `.claude/skills/auto-issues/SKILL.md`, chỉ hàng `:111` của bảng §2 (mục 2):
  - danh sách nguyên nhân "nhắc phiên con sửa" bỏ "nhánh đã ở head mới mà PR chưa theo";
  - thêm câu riêng cho head mới (`ĐÃ PUSH @<X>`) mà head của PR vẫn là `H`. `node tools/auto-wait.mjs ci <N> --not <H> --once` ra `branch at <X>` là dấu hiệu. Nguyên nhân này không nhắc phiên con: lệnh chờ tự ra mã 3 `PR head stale` sau 3 phút, rồi làm theo §4 (head của PR kẹt);
  - cột lệnh chờ: head mới → `ci <N> --not <H> --timeout 15`, giữ lệnh đang chạy nếu đúng là lệnh này (đặt lại thì đếm 3 phút từ đầu); kết quả khác vẫn `sleep --timeout 1`.
  - Không đổi quyền pipeline (M11), rào, brief, luật chờ lâu. Câu §5 `:288` ("kết quả phiên con báo mà GitHub vẫn không thấy sau khi đã nhắc") vẫn đúng cho các kết quả khác, nên không đổi.

#### Test chấp nhận

- [x] `ciState` với `not = H`, head vẫn `H`, `branch()` ném `Error('gh api … failed: gh: Not Found (HTTP 404)')` → `{ done: false, text: 'head still <H>: waiting for a push' }`. Ca này đỏ trước khi sửa: lỗi ném ra từ `ciState` (`auto-wait-core.mjs:151`).
  - Thông điệp trong ca lấy theo lỗi thật: `run('gh', ['api', 'repos/{owner}/{repo}/git/ref/heads/task/no-such-branch-t383'])` của `session-io.mjs` ném `gh api repos/{owner}/{repo}/git/ref/heads/task/no-such-branch-t383 failed: gh: Not Found (HTTP 404)`.
- [x] Như trên, `branch()` ném lỗi khác (`connect ETIMEDOUT`, `gh: Server Error (HTTP 500)`) → `ciState` ném lỗi, không nuốt.
- [x] Không `--since`, run `pull_request` mới nhất `cancelled`, rollup chỉ có check xanh → `done: true`, `EXIT.done`, `CI green …`; cùng với `startup_failure`.
  - Probe (tạm, đã trả lại): nới sàn `newest?.conclusion === 'failure'` thành `newest && newest.conclusion !== 'success'` thì đúng một ca đỏ, là ca mới này; 56 ca còn lại xanh.
- [x] Mọi ca hiện có của `auto-wait-core.test.mjs` xanh, không sửa (57/57 gồm 3 ca mới).
- [x] `SKILL.md` hàng `:111`: head mới mà head của PR vẫn `H` → lệnh chờ `ci <N> --not <H> --timeout 15`, không `sleep --timeout 1`. Hàng nêu `ci <N> --not <H> --once` / `branch at <X>`, và trỏ §4 "Head của PR kẹt" cho nguyên nhân này, không nhắc phiên con.
- [x] Kết quả đợt `auto-issues` gần nhất sau #1104 (mục 4): ghi dưới, và trong comment Issue #1085.
- [x] `pnpm verify` xanh ở local (130 file test, 4493 ca).
- [x] "Ghi chú OPEN liên quan" có dòng cho cả bốn mục "Trùng file".

##### Kết quả chạy thật `auto-issues` sau #1104 (mục 4, test chấp nhận cuối của #1085)

Nguồn: comment của Owner trên Issue này, https://github.com/AlexH-AI/Project-2C/issues/1107#issuecomment-6688248100. Đợt 06/11/2026 ở Home PC, hàng đợi chỉ có #1101 (T-382), rồi §6 gom sổ.

- **Không bước nào của §6 chờ quá 5 phút khi phiên con đã xong.**
  - §3.6: tin báo của phiên con đến ngay khi nó xong lượt. Phiên điều phối dừng lệnh `sleep --timeout 5` đang chạy và làm nhịp ngay.
  - §3.7: `coding-ses1` xong lượt 15:11:49 UTC. `sleep --timeout 5` đánh thức phiên điều phối khoảng 3,5 phút sau; PR #1112 merge 15:15:26.
- **Mã 3 `PR head stale`:** không lần nào. Head của PR #1109 không đổi sau lần push đầu.
- Chờ CI: lệnh `ci 1109 --timeout 15` đầu tiên hết giờ (mã 2) khi job Verify đang ở bước E2E (≈ 20 phút); lệnh thứ hai ra xanh. Tổng chờ ≈ 20 phút, dưới ngưỡng 60 phút.
- **Ngoài phạm vi Issue này, Owner quyết:** auto mode của `coding-ses1` chặn `gh issue create` ở §3.7, vì yêu cầu đến từ phiên điều phối chứ không từ Owner. Owner phải cho phép ngay trong phiên con. Hướng sửa (§3.7 ghi rõ bước cần Owner cho phép trong phiên con, hoặc phiên điều phối tự tạo Issue sau khi Owner duyệt) nằm trong rào "không tự sửa"; PR này không đổi §3.7.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `4564665`): 4 mục "Trùng file", đều là mục Issue này sửa. Số dòng sổ nay là L14, L16, L17, L18.

- L14 `tools/auto-wait-core.test.mjs:226`, ca `cancelled` / `startup_failure` không `--since`: **đã sửa** (ca mới trong nhóm `without since`).
- L16 `.claude/skills/auto-issues/SKILL.md:111`, hàng "kết quả mà GitHub chưa thấy" thay `ci --not` bằng `sleep --timeout 1`: **đã sửa**.
- L17 `tools/auto-wait.mjs:66`–`:70` + `tools/auto-wait-core.test.mjs:389`, đọc nhánh lỗi 404: **đã sửa** (`readBranch` ở core, hai ca mới).
- L18 `.claude/skills/auto-issues/SKILL.md:323`, chạy thật một đợt sau #1104: **đã làm** (kết quả trên; comment Issue #1085).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`. Không sửa `src-tauri/**`, `package.json`, cấu hình build, nên không gắn `build-exe`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-383 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

- Ghi chú review PR #1103, #1104 — T-383 (#1107, PR #1113, `REVIEW: PASS` @`4564665`). Số dòng theo `main` `5e03403`:
  - #1103, `tools/auto-wait-core.test.mjs:265` (ca "goes by the checks when the newest pull_request run was cancelled or failed to start", trong `describe('without since (a push after a fix)')` `:226`; sàn `failure` `tools/auto-wait-core.mjs:220`): ca mới cho run `pull_request` mới nhất `cancelled` và `startup_failure`, rollup xanh, không `--since` → `CI green @abc1234: 2 pass`. Review tái hiện: nới sàn thành `newest && newest.conclusion !== 'success'` thì ca đỏ với cả hai kết luận.
  - #1104, `.claude/skills/auto-issues/SKILL.md:111` (hàng "Phiên con rảnh; dòng `AUTO-CHILD` cuối báo một kết quả … mà GitHub chưa thấy"; §4 "Head của PR kẹt" `:277`): danh sách nguyên nhân "nhắc phiên con sửa" bỏ "nhánh đã ở head mới mà PR chưa theo". Riêng head mới (`ĐÃ PUSH @<X>`) mà head của PR vẫn là `H`, hàng nêu `node tools/auto-wait.mjs ci <N> --not <H> --once`, text `branch at <X>` là dấu hiệu; nguyên nhân này không nhắc phiên con: lệnh chờ tự ra mã 3 `PR head stale` sau 3 phút, rồi làm theo §4. Lệnh chờ của head mới là `ci <N> --not <H> --timeout 15`, giữ lệnh đang chạy nếu đúng là lệnh này; kết quả khác vẫn `sleep --timeout 1`.
  - #1104, `tools/auto-wait-core.mjs:118` (`readBranch`; gọi ở `ciState` `:166`) và `tools/auto-wait.mjs:65`–`:73` (`branchSha`; `branch()` của `READS.ci` `:102`): lần đọc nhánh lỗi mà thông điệp có `(HTTP 404)` cho `null`, nên `ciState` ra `head still <H>: waiting for a push` như trước PR #1104; lỗi khác vẫn ném ra, để `waitFor` (`tools/auto-wait-core.mjs:324`) tính là một lần đọc lỗi. Ca ở `tools/auto-wait-core.test.mjs:438` (404) và `:445` (`connect ETIMEDOUT`, `(HTTP 500)`), trong nhóm `:401`. Review tái hiện ca 404 ném lỗi với core trước khi sửa; lỗi thật của `gh api …/git/ref/heads/<nhánh không có>` qua `run` của `tools/session-io.mjs` khớp thông điệp của ca.
  - #1104, `.claude/skills/auto-issues/SKILL.md:323` (§6, `sleep --timeout 5`): đã chạy thật một đợt `auto-issues` sau PR #1104 (06/11, Home PC; hàng đợi #1101, rồi §6 gom sổ). Không bước nào của §6 chờ quá 5 phút khi phiên con đã xong; không có mã 3 `PR head stale`. Kết quả ở thân PR #1113 và comment Issue #1085; số liệu ở comment của Owner trên Issue #1107.

---

# Issue #1111 — T-384: Mục sổ G7: ca hợp đồng capability nhận mọi cách gọi CLI tauri (npx @tauri-apps/cli, .bin/tauri, tauri.cmd)

Trạng thái: CLOSED · nhãn: type:task, risk:low, ready-for-agent

##### Mục tiêu

Dọn ghi chú không chặn cuối cùng còn `[G7]` trong sổ: mục của review PR #1109 (T-382) về bộ lọc lệnh `tauri` của ca hợp đồng capability. Không đổi hành vi nào của app. Chỉ siết một test.

- **Hiện nay:** bộ lọc lệnh `tauri` của ca "allows the webview only the Tauri commands it uses" là `/(?:^|\s)tauri(?:\s|$)/`. Bộ lọc chỉ giữ lệnh có `tauri` là một từ đứng riêng. Vì vậy nó bỏ các lệnh gọi CLI tauri mà tên chương trình không đúng là từ đó: `npx @tauri-apps/cli build --config x.json`, `node_modules/.bin/tauri build -c x.json`, `tauri.cmd build`. Cờ config của các lệnh này không được kiểm: một script của `package.json` hay một bước `run:` của workflow viết theo các dạng đó, kèm `--config` / `-c`, vẫn xanh. Bộ lọc cũ `\btauri\b` (trước T-382) giữ được các lệnh này. Hôm nay repo chỉ gọi `tauri` trần (`tauri`, `tauri build --no-bundle`, `pnpm --filter @p2c/desktop tauri dev`), nên ca vẫn đúng với repo hiện tại.
- **Sau task:** bộ lọc giữ mọi cách gọi CLI tauri nêu ở "Interface / hợp đồng", và vẫn bỏ lệnh cargo của `verify:rust` (lý do T-382 đổi bộ lọc). Ca có `expect` trên các chuỗi lệnh mẫu, để bộ lọc không hẹp lại mà không test nào đỏ.

##### Bối cảnh

- Nguồn: ghi chú không chặn của review PR #1109 (T-382, #1101; `REVIEW: PASS` @`8a75fb3`, mức low; merge 06/11 qua pipeline `auto-issues`, squash `4d38a72`): https://github.com/AlexH-AI/Project-2C/pull/1109#issuecomment-6687545135. Sổ: PR #1110 ghi mục vào OPEN, gắn [G7]. PR nhãn sổ của Issue này gắn lại nhãn.
- Đã thử bằng node ở `main` `1584672`: regex hiện tại cho `false` với ba lệnh mẫu ở trên, regex cũ `\btauri\b` cho `true`. Regex sổ đề xuất (`/(?:^|[\s/])tauri(?:\.cmd)?(?:\s|$)|(?:^|\s)@tauri-apps\/cli(?:@\S+)?(?:\s|$)/`) cho `true` với cả ba, và với script của repo hôm nay giữ đúng 3 lệnh như regex hiện tại.
- Owner 06/11/2026 duyệt đề xuất gom sổ của đợt `auto-issues` sau T-382: tạo Issue này (https://github.com/AlexH-AI/Project-2C/pull/1110). Owner 04/11 (K47): sửa hết rồi mới G7.
- Bốn mục OPEN còn lại thuộc T-383 (#1107), làm ngoài pipeline; không liên quan file của Issue này.

##### Tài liệu cần đọc

- `apps/desktop/src/data/tauri-contract.test.ts` ở `main` `1584672`: ca "allows the webview only the Tauri commands it uses" (`:338`); phần cờ config (`:365`–`:419`): `commands` (`:372`), chú thích và `tauriCalls` (`:377`–`:380`), `noConfig` (`:381`), lệnh `run:` của workflow (`:398`).
- `package.json` ở gốc (script `verify:rust`: ba lệnh cargo có đường dẫn `apps/desktop/src-tauri/Cargo.toml`, cờ `-D warnings`), `apps/desktop/package.json` (script `tauri`, `build:exe`, `dev`). Chỉ đọc.
- `docs/state/review-notes.md`, mục OPEN, nhóm "Ghi chú không chặn của review PR #1109".

##### File / thư mục được phép sửa

- `apps/desktop/src/data/tauri-contract.test.ts`
- Không sửa `apps/desktop/src-tauri/**`, `package.json` hay workflow CI (test chỉ đọc chúng), nên không cần nhãn `build-exe`.

##### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --files apps/desktop/src/data/tauri-contract.test.ts` (sổ @ `1584672`): 1 mục "Trùng file". **Gộp** (đã tính vào cỡ):

- L20 `apps/desktop/src/data/tauri-contract.test.ts:380`: bộ lọc `/(?:^|\s)tauri(?:\s|$)/` bỏ lệnh gọi CLI tauri mà tên chương trình không đúng là từ `tauri`.

Sau PR nhãn sổ, mục này mang nhãn T-384. Phiên làm task chạy lại `notes-for <issue>` lúc bắt đầu.

##### Interface / hợp đồng

- Chỉ đổi bộ lọc của `tauriCalls` (và chú thích của nó). `commands`, `noConfig`, regex cờ config và các `expect` khác của ca giữ nguyên.
- Bộ lọc **giữ** lệnh mà tên chương trình là CLI tauri, ở đầu lệnh hay sau trình chạy (`pnpm`, `pnpm exec`, `npx`, `pnpm dlx`, `cargo`…):
  - `tauri` là một từ đứng riêng (như nay): `tauri build --no-bundle`, `pnpm --filter @p2c/desktop tauri dev`, `cargo tauri build`;
  - `tauri` là đoạn cuối của đường dẫn, sau `/` hoặc `\`: `node_modules/.bin/tauri build -c x.json`, `node_modules\.bin\tauri.cmd build`;
  - đuôi `.cmd` của shim Windows: `tauri.cmd build`;
  - tên gói `@tauri-apps/cli`, có hoặc không phiên bản: `npx @tauri-apps/cli build --config x.json`, `pnpm dlx @tauri-apps/cli@2 build`.
- Bộ lọc **bỏ** lệnh chỉ chứa `tauri` trong một đường dẫn đi tiếp: ba lệnh cargo của `verify:rust` (`apps/desktop/src-tauri/Cargo.toml`: sau `tauri` là `/`, trước là `-`).
- Cách viết regex do phiên làm task chọn (một regex hay vài regex); regex sổ đề xuất ở "Bối cảnh" là gợi ý, cần thêm `\` vào ký tự trước `tauri`.

##### Test chấp nhận

- [ ] Ca có `expect` trên chuỗi lệnh mẫu (commit, không cần mạng): `tauriCalls` giữ mọi lệnh mẫu ở "Interface / hợp đồng" mục **giữ**, và bỏ ba lệnh cargo của `verify:rust` (lấy từ `package.json` ở gốc hoặc viết lại nguyên văn). Phần **giữ** đỏ với bộ lọc hiện tại (trừ ba lệnh `tauri` trần và `cargo tauri build`).
- [ ] Probe tạm (không commit): thêm `--config x.json` vào lệnh `npx @tauri-apps/cli build`, `node_modules/.bin/tauri build` hay `tauri.cmd build` trong chuỗi script đọc được thì ca đỏ; thay `-D warnings` của `verify:rust` bằng `-- -Dclippy::pedantic` thì ca vẫn xanh. Thân PR ghi cách thử.
- [ ] `expect(tauriCalls(scripts)).toContain('tauri build --no-bundle')` và `expect(runs.flatMap(commands)).toContain('pnpm build:exe')` giữ nguyên, xanh.
- [ ] Mọi ca khác của `tauri-contract.test.ts` xanh, không sửa.
- [ ] `pnpm verify` xanh; e2e xanh trên CI.
- [ ] Thân PR có dòng cho mục L20 trong "Ghi chú OPEN liên quan".

Ước lượng: 0 dòng SP + ≈ 10–25 dòng test (diff).

##### Định nghĩa hoàn thành

- [ ] `pnpm verify` xanh
- [ ] CI xanh
- [ ] Review phiên sạch: PASS
- [ ] PR sổ sau review chuyển ghi chú sang RESOLVED

##### Rủi ro

risk:low (chỉ siết một test, không đổi code sản phẩm).

##### Bị chặn bởi

Không.

## PR #1115 — test: the capability contract keeps every way of calling the tauri CLI (T-384)

Trạng thái: MERGED · merge 2026-11-06T16:22:31Z · commit `a53a1d89dd12bed9755208b32d33debec17ffabf` · nhánh `task/T-384-tauri-cli-calls` · nhãn: type:task, risk:low

Closes #1111

Phiên code: phiên tay (không qua `auto-issues`)

#### Thay đổi

- `apps/desktop/src/data/tauri-contract.test.ts`, ca "allows the webview only the Tauri commands it uses":
  - Bộ lọc của `tauriCalls` đổi từ `/(?:^|\s)tauri(?:\s|$)/` sang hai regex (`cli`), lệnh khớp một trong hai thì được giữ:
    - `/(?:^|[\s/\\])tauri(?:\.cmd)?(?:\s|$)/`: `tauri` là từ đứng riêng hoặc đoạn cuối của đường dẫn (sau `/` hay `\`), có thể kèm đuôi `.cmd` của shim Windows;
    - `/(?:^|\s)@tauri-apps\/cli(?:@\S+)?(?:\s|$)/`: tên gói `@tauri-apps/cli`, có hoặc không phiên bản.
  - Lệnh cargo của `verify:rust` vẫn bị bỏ: trong `apps/desktop/src-tauri/Cargo.toml`, trước `tauri` là `-`, sau là `/`.
  - Chú thích của bộ lọc viết lại theo luật mới.
  - Thêm `expect` trên 8 lệnh mẫu của mục **giữ** trong Issue, cộng script `verify:rust` đọc từ `package.json` ở gốc: `tauriCalls([...samples, verifyRust])` phải bằng đúng `samples`. Thêm `expect(verifyRust).toContain('src-tauri/Cargo.toml')` để phần **bỏ** không rỗng âm thầm khi script đổi tên.
- `commands`, `noConfig`, regex cờ config và các `expect` khác của ca giữ nguyên.
- Không sửa `src-tauri/**`, `package.json` hay workflow (test chỉ đọc chúng), nên không gắn `build-exe`.

#### Test chấp nhận

- [x] Ca có `expect` trên các lệnh mẫu: giữ đủ 8 lệnh của mục **giữ**, bỏ ba lệnh cargo của `verify:rust` (đọc từ `package.json` ở gốc). Bước đỏ (`expect` mới với bộ lọc cũ) chỉ giữ `tauri build --no-bundle`, `pnpm --filter @p2c/desktop tauri dev`, `cargo tauri build`; 5 lệnh còn lại thiếu, ba lệnh cargo không có trong kết quả. Khớp dự báo của Issue.
- [x] Probe tạm (dưới): P1–P6 đỏ, P7 xanh.
- [x] `expect(tauriCalls(scripts)).toContain('tauri build --no-bundle')` và `expect(runs.flatMap(commands)).toContain('pnpm build:exe')` giữ nguyên, xanh.
- [x] Mọi ca khác của `tauri-contract.test.ts` xanh, không sửa (18/18).
- [x] `pnpm verify` xanh ở local; e2e chờ CI.
- [x] "Ghi chú OPEN liên quan" có dòng cho L20.

##### Probe (tạm, không commit)

Script tạm trong scratchpad: với mỗi probe, thay một chuỗi trong file thật của repo, chạy `pnpm --filter @p2c/desktop exec vitest run src/data/tauri-contract.test.ts -t "only the Tauri commands"`, rồi ghi lại nội dung gốc của file (trong `finally`). Script báo lỗi khi chuỗi cần thay không có trong file, nên probe không xanh vì không áp được. Sau khi chạy, `git status` chỉ còn file test của PR.

| Probe | Chuỗi đọc được bị sửa | Kết quả |
|---|---|---|
| P1 | `apps/desktop/package.json`: `"tauri": "tauri"` → `"tauri": "npx @tauri-apps/cli build --config x.json"` | **đỏ** |
| P2 | như trên, giá trị `node_modules/.bin/tauri build --config x.json` | **đỏ** |
| P3 | như trên, giá trị `tauri.cmd build --config x.json` | **đỏ** |
| P4 | như trên, giá trị `node_modules\.bin\tauri.cmd build -c x.json` | **đỏ** |
| P5 | như trên, giá trị `pnpm dlx @tauri-apps/cli@2 build -c x.json` | **đỏ** |
| P6 | `.github/workflows/ci.yml`: `run: pnpm build:exe` → `run: pnpm build:exe && npx @tauri-apps/cli build --config x.json` | **đỏ** |
| P7 | `package.json`: `-D warnings` → `-- -Dclippy::pedantic` trong `verify:rust` | xanh |

Mọi ca đỏ đỏ ở `expect(command).not.toMatch(/(?:^|\s)(?:-[A-Za-z]*c|--config\b)/)` của `noConfig`, trên đúng lệnh vừa thêm, không ở `expect` khác.

#### Ghi chú OPEN liên quan

`node tools/notes-for.mjs --diff` (sổ @ `5e03403`): 1 mục "Trùng file", là mục Issue này sửa.

- L20 `tauri-contract.test.ts:380`, bộ lọc `/(?:^|\s)tauri(?:\s|$)/` bỏ lệnh gọi CLI tauri mà tên chương trình không đúng là từ `tauri`: **đã sửa** (hai regex `cli`, cộng `expect` trên lệnh mẫu).

#### Kiểm tra

- [x] `pnpm verify` xanh ở local
- [x] Không thêm dependency ngoài ADR-0005 (hoặc đã qua G4)
- [ ] Review phiên sạch theo `docs/process/REVIEW-CHECKLIST.md`

Rủi ro: `risk:low`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

## Nhóm RESOLVED của sổ gắn T-384 (`docs/state/review-notes.md` ở `5b1328a`, nguyên văn)

- Ghi chú review PR #1109 — T-384 (#1111, PR #1115, `REVIEW: PASS` @`d0ad56c`). Số dòng theo `main` `a53a1d8`:
  - #1109, `apps/desktop/src/data/tauri-contract.test.ts:382` (`cli`; `tauriCalls` `:386`; ca "allows the webview only the Tauri commands it uses" `:338`; `noConfig` `:402`): bộ lọc nay là hai regex `cli`. Regex thứ nhất nhận `tauri` đứng riêng hoặc là đoạn cuối của đường dẫn (sau `/` hay `\`), có thể kèm đuôi `.cmd`; regex thứ hai nhận tên gói `@tauri-apps/cli`, có hoặc không phiên bản. Ca có `expect` trên 8 lệnh mẫu của Issue #1111 cộng script `verify:rust` đọc từ `package.json` ở gốc (`:388`–`:401`): giữ đúng 8 lệnh, bỏ ba lệnh cargo. Review thử bằng node: regex thứ nhất là tập trên của bộ lọc cũ (lớp `[\s/\\]` chứa `\s`). Probe P1–P6 của thân PR #1115 đỏ, P7 (`-- -Dclippy::pedantic`) xanh. Hai ghi chú mới của review #1115 nằm ở ACCEPTED (Owner 06/11).

---
