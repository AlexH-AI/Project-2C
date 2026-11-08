XONG — workbuddy gói B lượt 6, 01:14 08/11/2026

# Báo cáo deep review Phase 1–6, lượt 6 — gói B (File và Rust), bên workbuddy

## 1. Bên, gói, môi trường

- **Bên / gói:** workbuddy, gói **B — File và Rust** (`apps/desktop/src-tauri/**`, `apps/desktop/src/data/**` trừ file AI). Reviewer độc lập, chỉ đọc (ADR-0001 phụ lục M13); **không làm bảng R1 / R2** — theo `common\prompt-workbuddy.md` (Việc của gói mục 1) và `common\known.md` phần 4, 5, mọi dòng R1 (DR6-161…163) và R2 (T-374, 381, 382, 384) là KNOWN.
- **SHA đầu phiên:** `5b1328ae236aa62981dbf43066ff544a9e832c8c` (`git rev-parse HEAD`), đúng SHA ghim `5b1328a`.
- **`git status --short` đầu phiên:** rỗng (không có dòng nào).
- **Giờ bắt đầu:** 00:31 08/11/2026; **giờ xong:** 01:14 08/11/2026 (máy `DESKTOP-KDURKJP`, Home PC, GMT+7).
- **Công cụ:** app desktop WorkBuddy (bản theo `common\baseline.md`; không đọc thư mục dữ liệu của app), shell Git Bash / PowerShell của app, công cụ đọc / ghi file. **Không dùng agent phụ** trong phiên này (khối lượng đọc vừa phải, tự đọc hết). Không cài skill, không connector, không mạng ngoài, không `gh`, không đọc thư mục cấm.
- **Expert:** `CodeReviewExpert` (đã chọn trong phiên; mã không thấy).
- **Model:** ngữ cảnh phiên ghi `Deepseek-V4.1-Flash`; Owner chọn **Hy4** cho gói A–F (`common\baseline.md`, ghi chú sau phiên thử ≈ 23:35 07/11). Ghi cả hai, không khẳng định thay Owner.
- **Context:** không thấy trong ngữ cảnh phiên. **Mức suy luận:** không thấy trong ngữ cảnh phiên.
- **Bản Node đã dùng:** `v24.20.0` — lệnh đầu phiên đặt `export PATH="/c/Program Files/nodejs:$PATH"` rồi `node --version` in `v24.20.0` (≥ 24). Mọi lệnh có `node` / vitest đặt PATH ngay trong lệnh.

## 2. Bảng R1 / R2

Không áp dụng (agent WorkBuddy không làm bảng R). Các phát hiện dưới đây là lỗi mới / lỗ hổng test mới, có "Liên quan" tới vùng của DR6-161 / DR6-162 / DR6-163 nhưng không phải dòng R.

## 3. Phạm vi đã đọc

### Diff `37a80b6..5b1328a` của gói B

`git diff --stat 37a80b6 5b1328a -- apps/desktop/src-tauri apps/desktop/src/data` → **4 file, +185 / −15** (khớp `common\baseline.md` dòng gói B: SP +13 / −5 · 2 file, test +172 / −10 · 2 file):

| File | +/− | Nội dung |
|---|---|---|
| `apps/desktop/src/data/persist-queue.ts` | +10 / −2 | `drain()` kết thúc lượt khi hàng đợi rỗng (`const last = !waiting` … `if (last) return`), `idle()` chuyển thành vòng `while (running) await running` (T-374) |
| `apps/desktop/src/data/app-data.ts` | +3 / −3 | bỏ `if (!storage) return;`, dùng `storage!`, thêm câu giải thích (T-364, DR6-163) |
| `apps/desktop/src/data/persist-queue.test.ts` | +63 / −1 | 3 ca mới: listener ghi hai lần, `idle()` chờ lượt do listener mở, `idle()` không chờ `track()` |
| `apps/desktop/src/data/tauri-contract.test.ts` | +109 / −9 | ca capability kiểm mọi nguồn (file `capabilities/`, `app.security.capabilities`, `tauri*` config, `build.rs`, `add_capability`, `-c` / `--config` / `TAURI_CONFIG` trong script và workflow) |

Commit của gói: `292a63e` (T-364, PR #1064), `bf8dee7` (T-374, PR #1090), `b2ef4c1` (T-381, PR #1099), `4d38a72` (T-382, PR #1109), `a53a1d8` (T-384, PR #1115). Bản diff đầy đủ ở `workbuddy\B\diff-B.diff` (277 dòng), đã đọc hết.

Ngoài diff, đọc thêm chỗ gói B nối vào: `apps/desktop/src/shell/close-guard.ts`, `CloseGuard.tsx`, `SaveWarning.tsx` (ba chỗ đọc `saves`), `packages/db/src/database.ts` (chỗ gọi `persist`), `packages/db/src/purge.ts` (VACUUM + transaction rỗng), `apps/desktop/src/routes/reports/report-workbook.ts` (`reportFileName` / `slug`, đối chiếu `is_export_name` của Rust), `apps/desktop/src/i18n/vi.ts:1069-1070`, `apps/desktop/src/main.tsx`.

### `common\files-B.txt` (21 file: 11 product, 8 test, 2 product+test)

Đọc **từng dòng, hết**: `build.rs` (3), `lib.rs` (205), `main.rs` (6), `storage.rs` **cả 2 207 dòng** (683 dòng sản phẩm + 1 524 dòng test), `ai.rs` **dòng 1–578** (toàn bộ phần sản phẩm), `AppDataContext.tsx` (85), `app-data.ts` (496), `demo-snapshot.ts` (45), `listeners.ts` (15), `persist-queue.ts` (150), `tables.ts` (72), `tauri-storage.ts` (91), `today.ts` (58), `persist-queue.test.ts` (424), `tauri-contract.test.ts` (482), `tauri-storage.test.ts` (96), `listeners.test.ts` (28), `tables.test.ts` (43), `today.test.ts` (81), `demo-snapshot.test.ts` (46).

**Không đọc kỹ từng dòng:**

- `apps/desktop/src-tauri/src/ai.rs:579-2052` (khối `#[cfg(test)]`, 71 hàm — vài hàm là helper như `entry`, `local`): chỉ đọc **tên** các ca (chúng ánh xạ 1-1 với hành vi của phần sản phẩm đã đọc) và phần sản phẩm 1–578. Lý do: không có dòng sản phẩm nào trong khối đó; `common\baseline.md` ghi `pnpm verify:rust` ✅ 120 test ở đúng SHA này; phiên này **không dựng lại `target\`** để chạy `cargo test` (xem Phụ lục).
- `apps/desktop/src/data/app-data.test.ts` (1 563 dòng): đọc **toàn bộ tên 68 ca `it` trong 9 `describe`** và các đoạn của chuỗi lưu / thay / đóng app / Dọn sạch (dòng 778–1 190, 1 191–1 290); không đọc từng dòng phần `setup()` và các ca seed / golden. Lý do: không có dòng sản phẩm; bộ test chạy xanh (223 test) và các đột biến ở mục 4 nhắm vào file sản phẩm.

## 4. Kịch bản đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | `node node_modules/vitest/vitest.mjs run apps/desktop/src/data` | 11 file / **223 test xanh**, 2,5 s | — |
| 2 | `… run apps/desktop/src/data apps/desktop/src/shell` | 20 file / **297 test xanh** (gồm `close-guard.test.ts` đọc `saves`) | — |
| 3 | 8 đột biến trên bản chép `persist-queue.ts` + `persist-queue.test.ts` (`workbuddy\B\mut\`, junction `node_modules`, không đụng repo), mỗi đột biến chạy lại 16 ca | Baseline 16/16 xanh. M1 (`idle` về `if` một lần), M2 (bỏ `if (last) return`), M3 (`last = true` luôn), M4 (xóa `running` cả khi còn `waiting`), M5 (`flush` chờ một lượt), M7 (không thử lại `lost`), M8 (`idle` chờ cả `track`) đều **KILLED**; M6 (giữ `running` sau lượt cuối) **KILLED bằng treo** (`idle()` lặp vô hạn, `timeout 25` cắt) | — |
| 4 | Chạy **cả 8** đột biến M1–M8 trên **file thật** trong worktree (ghi, chạy 1 file test, `cp` trả nguyên byte, kiểm sha256 sau mỗi lần) | sha256 trước = sau = `bbb64d8d…1643`; `git status --short` rỗng sau mỗi lần. Log: `Tests 1 failed \| 15 passed` cho M1 (ca `idle()` chờ lượt của listener), M2, M3, M5 (ca DR6-139), M7 (3 ca); M8 2 ca (một ca `Test timed out in 5000ms`); M6 **treo**, cắt ở 25 s | — |
| 5 | `probe-imports.mjs`: chạy đúng regex của `tauriImports()` (`tauri-contract.test.ts:289`) trên 7 dạng import + trên toàn bộ `apps/desktop/src` | Dạng đang dùng: thấy. **MISSED**: dấu nháy kép, `import * as`, `import()` động. Repo hôm nay: `core: invoke`, `core: isTauri`, `window: getCurrentWindow` | WBR6-B2 |
| 6 | `grep -rn "label" tauri.conf.json capabilities/default.json tauri-contract.test.ts`; `grep -rn '"main"\|get_webview_window' src-tauri/src apps/desktop/src` | Chỉ `tauri.conf.json:15` có `"label": "main"`; test **không** đọc `label`; không dòng Rust / TS nào dùng nhãn cửa sổ | WBR6-B1 |
| 7 | `grep` mọi lời gọi `saves.*` trong `apps/` | 2 chỗ ghi (`app-data.ts:314,349`), 1 chỗ `track` / `idle` / `failed` (`:398,403,404`), 2 listener (`close-guard.ts:55`, `SaveWarning.tsx:36`) — **không listener nào ghi**, nên `idle()` mới không thể lặp vô hạn trong app | — |
| 8 | Đọc `packages/db/src/purge.ts:147-180` đối chiếu `app-data.ts:480-485` | `purgeTrash` chạy `db.transaction` (persist) rồi `VACUUM` rồi **một transaction rỗng nữa** để persist cỡ đã co: khớp số `13 438 976` B của `baseline.md`. Không thấy hở | — |
| 9 | Đối chiếu tên file Excel (`report-workbook.ts:198-230`) với `storage.rs:675-681` `is_export_name` | `slug()` bỏ dấu → `[a-z0-9-]`; `reports.excel.file` = `bao-cao`, `fileRange` = `{from}-den-{to}` (ASCII); mọi tên đi qua `is_export_name`. Không thấy hở | — |

## 5. Phát hiện mới

### WBR6-B1

```
ID: WBR6-B1
Mức: Low
Trục: T
Vị trí: apps/desktop/src/data/tauri-contract.test.ts:444-455 (5b1328a) — cạnh apps/desktop/src-tauri/tauri.conf.json:15 và capabilities/default.json:5
Tình trạng: CONFIRMED
Liên quan: DR6-161 (đã sửa ở T-364 / T-374 / T-381 / T-382 / T-384; đây là phần còn hở của cùng họ) · có từ trước, lượt 1–5 bỏ sót
Mô tả: Ca hợp đồng capability chốt `windows: ['main']` của capabilities/default.json bằng một literal, nhưng không chốt `label` của cửa sổ trong tauri.conf.json — hai chữ "main" chỉ khớp với nhau do trùng hợp. Tauri ghép capability với cửa sổ **theo nhãn**, nên đổi nhãn (ví dụ "main" → "heritas") làm capability không khớp cửa sổ nào: exe mất **cả bốn** quyền, test vẫn xanh.
Tái hiện / bằng chứng:
  $ grep -rn "label" apps/desktop/src-tauri/tauri.conf.json apps/desktop/src-tauri/capabilities/default.json apps/desktop/src/data/tauri-contract.test.ts
  apps/desktop/src-tauri/tauri.conf.json:15:        "label": "main",
  (không dòng nào khác — capabilities/default.json:5 là "windows": ["main"], test không nhắc `label`)
  $ grep -rn '"main"\|get_webview_window' apps/desktop/src-tauri/src apps/desktop/src --include=*.rs --include=*.ts --include=*.tsx
  (rỗng) — không dòng Rust / TS nào đọc nhãn cửa sổ, nên đổi nhãn không hỏng gì lúc build.
  Ca hiện có kiểm: `files(new URL('capabilities/', src), true)` = ['default.json'] (:352), `app.security` không có `capabilities` (:354), `tauri*` config chỉ một file (:353), và object đầy đủ của capability (:444). Object của **cửa sổ** chỉ được kiểm ở `title` (:329) — `app.windows.map(({ title }) => title)`.
Cùng mẫu: `grep -rn "windows: \[" apps/desktop/src --include=*.test.ts` → **chỉ** `tauri-contract.test.ts:448` (literal của capability); không ca nào đọc `app.windows` để lấy `label`. (`grep -rn "\.label" …` có thêm 6 dòng ở `stage-view.test.ts`, `ai-panel-view.test.ts`, `scope.test.ts` — đó là nhãn cột chart / nhãn ô chọn, không liên quan.) Ở Rust: `grep -rn "get_webview_window\|WebviewWindowBuilder" apps/desktop/src-tauri` → rỗng.
Ảnh hưởng: chỉ sau một lần sửa nhãn cửa sổ (refactor hợp lý, vì không code nào dùng nhãn). Khi đó, trong exe: `getCurrentWindow().onCloseRequested()` bị từ chối → **CloseGuard không cài được**, cửa sổ đóng theo mặc định của Tauri, mất thay đổi chưa lưu mà không hỏi; `setTitle` hỏng (tiêu đề đứng ở "Heritas L-CRM"); `destroy()` hỏng (nút "Đóng không lưu" không đóng được cửa sổ). e2e chạy bản build web **không có ACL** nên không bắt được; đây đúng là loại lỗi chỉ hiện ở exe mà DR6-161 muốn đóng.
Chặn phát hành: không — K48: Low ở trục T.
Đề xuất: thêm một dòng vào chính ca đó, ngay cạnh literal của capability:
  expect(app.windows.map(({ label }) => label)).toEqual(['main']);
(tiện thể khai báo kiểu của `tauriConf()` thêm `label: string`). Cỡ: 1–2 dòng test. Nếu muốn chắc hơn nữa: cho `windows` của capability và `label` cùng đọc từ một hằng, nhưng như vậy là sửa cấu hình build — không cần cho v1.0.
```

### WBR6-B2

```
ID: WBR6-B2
Mức: Nit
Trục: T
Vị trí: apps/desktop/src/data/tauri-contract.test.ts:281-299 (5b1328a), dùng ở :340-344
Tình trạng: CONFIRMED
Liên quan: DR6-161 · có từ trước, lượt 1–5 bỏ sót
Mô tả: `tauriImports()` chỉ đọc một dạng import — `import {…} from '@tauri-apps/api/<module>';` trên một dòng, nháy đơn, named import. Một `import * as`, một `import()` động hay nháy kép thêm API của Tauri mà danh sách "chỉ ba thứ" vẫn khớp, nên quyền thiếu trong capabilities/default.json không bị báo.
Tái hiện / bằng chứng: `node workbuddy\B\probe-imports.mjs` (chạy đúng regex của file, không chép lại):
  SEEN     one line, the form the repo uses → ["window: getCurrentWindow"]
  MISSED   one line, double quotes → []
  SEEN     several names, still one line → [3 tên]
  SEEN     wrapped by Prettier (over 100 columns) → [4 tên]      ← dạng nhiều dòng VẪN thấy
  MISSED   namespace import → []
  MISSED   dynamic import → []
  repo today: [ 'core: invoke', 'core: isTauri', 'window: getCurrentWindow' ]
Cùng mẫu: cùng lệnh trên toàn bộ `apps/desktop/src` — chỉ ba mục như trên, nên hôm nay chưa có chỗ nào lọt. `grep -rn "@tauri-apps/api" apps/desktop/src --include=*.ts --include=*.tsx` → 5 dòng: `main.tsx:1` (giá trị `invoke`, `isTauri`), `main.tsx:2` (giá trị `getCurrentWindow`), `ai-tauri.ts:14` và `tauri-storage.ts:3` (chỉ `import type`, đã bị lọc), `tauri-contract.test.ts:280` (comment).
Ảnh hưởng: chỉ khi có người viết `import * as` hoặc `import()` động — cả hai không có trong repo, và Prettier (`singleQuote: true`, `printWidth: 100`) chặn dấu nháy kép; `pnpm format:check` nằm trong `verify` nên dấu nháy kép khó lọt. Vì vậy để Nit, không phải Low.
Chặn phát hành: không — K48: Nit.
Đề xuất: nếu muốn đóng: đọc thêm hai dạng, hoặc đơn giản là `expect(readdirSync` + `readFileSync` của mọi file `.ts/.tsx` không chứa `from '@tauri-apps/api/` ngoài ba module đã biết` — tức kiểm **module** thay vì tên import, rẻ hơn và bắt cả ba dạng. Cỡ: 3–5 dòng test. Không cần cho v1.0.
```

## 6. Bloat / Hiệu năng

Không áp dụng (chỉ gói F và chủ đề G). Không có phát hiện P / B nào ở gói B: diff chỉ +13 dòng sản phẩm, và đường lưu / thay dữ liệu đã có số đo ở `common\baseline.md` (`db.save` 147 ms, `backup.import` 44 ms, `trash.open` 33 ms — đều trong ngưỡng).

## 7. Đếm

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 1 |
| **Tổng** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **2** | 0 | **2** |

- **Chặn phát hành: 0** (đề xuất). Cả hai đều là lỗ hổng test ở trục T, mức Low / Nit → K48: không chặn.
- **PLAUSIBLE: 0 / 2** — cả hai đều CONFIRMED bằng lệnh đã chạy và dán ở trên.

## 8. Đã xét, không thấy

- **E (edge case).** Đọc hết `persist-queue.ts` và đường `drain` / `flush` / `idle` / `track`; dựng 8 đột biến (mục 4 #3–4) — không đột biến nào sống. Các ca đã đi qua trong đầu và đối chiếu với test có sẵn: listener ghi hai lần trong `changed()` (DR6-162), listener ghi trong `changed()` của một lượt **lỗi**, `flush()` gọi trong lúc `track()` mới thêm, `flush()` thử lại `lost` khi một `persist` mới chen vào, `idle()` gọi từ trong listener. Không thấy hở mới. Rust: `open` / `save` / `backup` / `write_export` đọc từng dòng, đối chiếu 1 524 dòng test của `storage.rs` — mọi nhánh lỗi tôi nghĩ ra đều có ca (kể cả `icacls`, ổ đầy, `.tmp` bị giữ, `STALE_PAGE`, thư mục đội tên file).
- **C (hợp đồng / spec).** `ADR-0016` (một cửa sổ ghi, hàng đợi lưu), `ADR-0009` D-1 (key chỉ ở Credential Manager, không trả về webview), spec Phase 6 §4.1 (S2-1…S2-6), `phase-6.md` ngưỡng. `ai.rs` khớp: `KEY_MODIFIERS` = `persistence: Local` (D-1 mục 4), `Completion` không có trường nào mang key, `AiError.message` đã `mask` trước khi cắt 200 ký tự. Không thấy lệch.
- **D (dữ liệu).** `save` ghi `.tmp` + `fsync` + `rename`; `open` từ chối file rỗng / không SQLite / không thay được; `backup` chép nguyên file và không bao giờ ghi đè bản cũ; `write_export` không ghi đè và không để lại `.claim` / `.tmp`. Đối chiếu `app-data.ts` `openFrom` (chỉ persist khi `!migrated`) và `open()` (chỉ DB hiện tại được lưu). Không thấy đường mất dữ liệu mới.
- **G (guardrail AI).** `check()` chặn plan / model / session / role / `max_tokens` / tổng ký tự trước khi đọc key hay gọi mạng; `reveals` chặn key trong `content` (kể cả escape JSON / URL một và hai lớp); `mask` che key và session trong câu lỗi của server. Đã đọc `readings` / `unescape` / `mask` từng dòng và kiểm các chỉ số (`ahead[length - 1]` chỉ chạy khi `hex` đã đọc đủ ký tự). Không thấy hở mới.
- **S (an toàn ranh giới).** `is_export_name` chặn `/`, `\`, `..`, tên bắt đầu bằng `.`, đuôi lạ; `folder()` chỉ nhận `exports` / `backups`; `explorer()` lấy đường dẫn tuyệt đối từ `%SystemRoot%` (DR-54); CSP đóng. `raw_body` từ chối body JSON. Không thấy hở mới.
- **P (hiệu năng).** Không thêm việc nào vào đường nóng: `idle()` mới chỉ là một vòng `await` trên một promise; `changed()` vẫn so 4 khóa. Số đo của gói ở `baseline.md` trong ngưỡng; không đo lại (máy đang chạy phiên này).
- **B (bloat).** Diff +13 dòng sản phẩm; `tauri-contract.test.ts` +109 dòng là test của công cụ build, không vào bundle. Không thấy gì đáng gỡ.
- **T (chất lượng test).** Ngoài hai phát hiện trên: 8 đột biến ở `persist-queue.ts` đều bị giết (một bằng treo — nên biết: một `idle()` không bao giờ trả về làm treo bộ test chứ không báo đỏ). `app-data.test.ts` phủ đủ chuỗi lưu → thay → đóng app → Dọn sạch. `storage.rs` có 1 524 dòng test cho 683 dòng sản phẩm.
- **A (trợ năng / i18n).** Không đổi chuỗi người dùng nào trong gói; `SaveWarning` / `CloseDialog` giữ `role="alert"` / `Dialog`. Không thấy gì.

## 9. Phụ lục

- **Nguồn probe / đột biến:** `workbuddy\B\diff-B.diff` (diff gói), `workbuddy\B\probe-imports.mjs` (regex `tauriImports`), `workbuddy\B\apply2.mjs` + `workbuddy\B\persist-queue.orig.ts` (8 đột biến trên file thật, có `cp` trả nguyên byte và kiểm sha256), `workbuddy\B\mut\` (bản chép `persist-queue.ts` + test + `listeners.ts`, `apply.mjs`, `mutate.mjs`; junction `node_modules` đã gỡ).
- **Đột biến bị giết / sống:** M1–M8 **đều bị giết**; M6 giết bằng treo (`timeout 25`, `idle()` lặp vô hạn). Không đột biến nào sống → không có ca nào thiếu cho vùng T-374 sửa.
- **Không chạy:** `cargo test` / `pnpm verify:rust` (sẽ dựng lại `apps\desktop\src-tauri\target\`, vài GB; `common\baseline.md` đã ghi 120 test Rust xanh ở đúng SHA này, 07/11 11:44). `pnpm e2e` (cổng 4173; `baseline.md` đã có 329 passed). `pnpm build:web` / `build:exe`.
- **Dọn dẹp:** đã xóa junction `workbuddy\B\mut\node_modules` (trỏ vào `node_modules` của repo) bằng `Delete()` trên junction, không theo đường dẫn; giữ `workbuddy\B\mut\` với ba bản chép `persist-queue.ts` / `persist-queue.test.ts` / `listeners.ts` và `apply.mjs`, `mutate.mjs` làm nguồn. Đã xóa `C:\workspace\Project-2C-review\node_modules\.vite` (cache, bị ignore) sau khi nó làm vitest treo; không đụng file theo dõi nào.
- **`git status --short` cuối phiên:** rỗng; `git rev-parse HEAD` vẫn `5b1328ae236aa62981dbf43066ff544a9e832c8c`; sha256 của `apps/desktop/src/data/persist-queue.ts` = `bbb64d8dca71370dfed8b2f281b1bdde6355903a980e8e9e486150ecdee61643`, trùng lúc đầu phiên.
- **Giờ xong:** 01:14 08/11/2026.
